// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/base/EventProvider","sap/base/Log","sap/ushell/utils","sap/ui/thirdparty/jquery","sap/base/util/deepEqual","sap/base/util/isEmptyObject"],function(e,t,a,jQuery,n,r){"use strict";var i="valueStored";var s=["value","noEdit","noStore","extendedValue","alwaysAskPlugin"];function o(o,u,l,f){this._aPlugins=[];this._oUserDefaultParametersNames={};this._oWasParameterPersisted={};var d=this;var c=new e;function h(e){var t=typeof e.getComponentData==="function"&&e.getComponentData()&&e.getComponentData().config&&e.getComponentData().config["sap-priority"]||0;if(typeof t!=="number"||isNaN(t)){return 0}return t}this._insertPluginOrdered=function(e,t){var a=h(t),n,r;for(n=0;n<e.length&&t;++n){r=h(e[n]);if(t&&a>r){e.splice(n,0,t);t=undefined}}if(t){e.push(t)}return e};this.registerPlugin=function(e){this._aPlugins=this._insertPluginOrdered(this._aPlugins,e)};this._getUserDefaultValueFromPlugin=function(e,a,n,r){var i;if(typeof e.getUserDefault==="function"){i=new Promise(function(i,s){e.getUserDefault(a,r,n).done(function(s){var o=s||r;var u=this._getComponentNameOfPlugin(e);t.debug('[UserDefaults] Fetched "'+a+'" for SystemContext='+n.id+" from Plugin="+u,JSON.stringify(o,null,2));i(o)}.bind(this)).fail(function(){t.error('invocation of getUserDefault("'+a+'") for plugin '+d._getComponentNameOfPlugin(e)+" rejected.",null,"sap.ushell.services.UserDefaultParameters");i(r)})}.bind(this))}else{i=Promise.resolve(r)}return i};this._iterateOverPluginsToGetDefaultValue=function(e,a,n,r){return new Promise(function(i,s){r.loadPlugins("UserDefaults").done(function(){var t=this._aPlugins.reduce(function(t,a){var r=t.then(this._getUserDefaultValueFromPlugin.bind(this,a,e,n));return r}.bind(this),Promise.resolve(a));t.then(i)}.bind(this)).fail(function(){t.error("Cannot get value for "+e+". One or more plugins could not be loaded.");s("Initialization of plugins failed")})}.bind(this))};this._getStoreDate=function(){return(new Date).toString()};this._storeValue=function(e,t,a,n){if(a&&t.extendedValue){return sap.ushell.Container.getServiceAsync("ClientSideTargetResolution").then(function(r){return new Promise(function(i){r.getUserDefaultParameterNames(n).done(function(r){var s=this._extractKeyArrays(r);var o=s.extended.indexOf(e)<0;this._saveParameterValue(e,t,a,o,n).then(i)}.bind(this)).fail(function(){this._saveParameterValue(e,t,a,false,n).then(i)}.bind(this))}.bind(this))}.bind(this))}return this._saveParameterValue(e,t,a,false,n)};this._saveParameterValue=function(e,t,n,r,s){if(r){t.extendedValue=undefined}if(n&&this._valueIsEmpty(t)){t=undefined;this._oWasParameterPersisted[e]=false}else{t._shellData=jQuery.extend(true,{storeDate:this._getStoreDate()},t._shellData)}return sap.ushell.Container.getServiceAsync("UserDefaultParameterPersistence").then(function(n){return new Promise(function(r){n.saveParameterValue(e,t,s).always(function(){var n={parameterName:e,parameterValue:a.clone(t||{}),systemContext:s};c.fireEvent(i,n);r(e)})})})};this._getPersistedValue=function(e,t){return new Promise(function(a,n){sap.ushell.Container.getServiceAsync("UserDefaultParameterPersistence").then(function(r){r.loadParameterValue(e,t).done(a).fail(n)})})};this._valueIsEmpty=function(e){return!e||!e.value&&!e.extendedValue};this._haveSameMembersValue=function(e,t,a){return a.every(function(a){return e[a]===t[a]||n(e[a],t[a])})};this._getUserDefaultParameterNames=function(e){if(!this._oUserDefaultParametersNames[e.id]){this._oUserDefaultParametersNames[e.id]=new Promise(function(t){sap.ushell.Container.getServiceAsync("ClientSideTargetResolution").then(function(a){a.getUserDefaultParameterNames(e).done(function(e){var a=this._extractKeyArrays(e);var n=a.extended;var r=a.allParameters;var i=this._arrayToObject(r);t({aAllParameterNames:r,aExtendedParameterNames:n,oMetadataObject:i})}.bind(this))}.bind(this))}.bind(this))}return this._oUserDefaultParametersNames[e.id]};this._isRelevantParameter=function(e,t){return this._getUserDefaultParameterNames(t).then(function(t){if(!t.aAllParameterNames||t.aAllParameterNames.indexOf(e)===-1){throw new Error('The given parameter "'+e+'" is not part of the list of parameters for the given system context.')}})};this.hasRelevantMaintainableParameters=function(e){var t=false;var a=[];return new Promise(function(n){this._getUserDefaultParameterNames(e).then(function(i){if(!r(i)&&i.aAllParameterNames){i.aAllParameterNames.forEach(function(n){var r=this.getValue(n,e);a.push(r);r.done(function(e){if(e&&!e.hasOwnProperty("noEdit")){t=true}})}.bind(this));jQuery.when.apply(undefined,a).done(function(){n(t)}).fail(function(){n()})}else{n()}}.bind(this))}.bind(this))};this.getValue=function(e,t){var n=new jQuery.Deferred;this._isRelevantParameter(e,t).then(function(){return this._getPersistedValue(e,t).then(function(t){this._oWasParameterPersisted[e]=true;return t||{}}.bind(this)).catch(function(){return{value:undefined}})}.bind(this)).then(function(e){var t=a.clone(e);var r=!e._shellData&&this._valueIsEmpty(e)||e.noStore||e.alwaysAskPlugin;if(!r){n.resolve(e);return}return Promise.all([t,e,sap.ushell.Container.getServiceAsync("PluginManager")])}.bind(this)).then(function(a){var r=a[0];var i=a[1];var o=a[2];return this._iterateOverPluginsToGetDefaultValue(e,i,t,o).then(function(a){if(!this._oWasParameterPersisted[e]||!this._haveSameMembersValue(r,a,s)){this._oWasParameterPersisted[e]=true;this._storeValue(e,a,false,t).then(function(){n.resolve(a)})}else{n.resolve(a)}}.bind(this)).catch(n.reject)}.bind(this)).catch(function(){n.resolve({value:undefined})});return n.promise()};this._addParameterValuesToParameters=function(e,t,a){var n=new jQuery.Deferred;var r=[];t.forEach(function(t){var n=this.getValue(t,a);r.push(n);n.done(function(a){e[t].valueObject=a})}.bind(this));jQuery.when.apply(jQuery,r).done(n.resolve.bind(n,e)).fail(n.reject.bind(n,e));return n.promise()};this._arrayToObject=function(e){var t={};e.forEach(function(e){t[e]={}});return t};this._getComponentNameOfPlugin=function(e){try{return e.getMetadata().getComponentName()||""}catch(e){return"'name of plugin could not be determined'"}};this._getEditorDataAndValue=function(e,a,n,r,i){var s=this;var o=[];var u=[];this._aPlugins.forEach(function(e){if(typeof e.getEditorMetadata==="function"){var a=new jQuery.Deferred;o.push(a);try{var n=o.length-1;e.getEditorMetadata(r,i).done(function(e){u[n]=e}).always(a.resolve).fail(function(){t.error("EditorMetadata for plugin "+s._getComponentNameOfPlugin(e)+"cannot be invoked.",null,"sap.ushell.services.UserDefaultParameters");a.resolve()})}catch(e){t.error("Error invoking getEditorMetaData on plugin: "+e+e.stack,null,"sap.ushell.services.UserDefaultParameters");a.resolve()}}});jQuery.when.apply(jQuery,o).done(function(){var o=[];var l=u.reverse().reduce(function(e,t){a.forEach(function(a){if(t[a]&&t[a].editorMetadata){e[a].editorMetadata=t[a].editorMetadata}});return e},r);a.forEach(function(e){if(!(l[e]&&l[e].editorMetadata)){o.push(e)}});s._addParameterValuesToParameters(l,a,i).done(function(a){var r=jQuery.extend(true,{},a),i;n.forEach(function(e){if(r[e]){r[e].editorMetadata=r[e].editorMetadata||{};r[e].editorMetadata.extendedUsage=true}});i=Object.keys(r).splice(0);i.forEach(function(e){var t;if(r[e].valueObject&&r[e].valueObject.noEdit===true){delete r[e];t=o.indexOf(e);if(t>=0){o.splice(t,1)}}});if(o.length>0){t.error('The following parameter names have no editor metadata and thus likely no configured plugin:\n"'+o.join('",\n"')+'".')}e.resolve(r)}).fail(e.reject.bind(e))})};this.editorGetParameters=function(e){var a=new jQuery.Deferred;Promise.all([sap.ushell.Container.getServiceAsync("PluginManager"),this._getUserDefaultParameterNames(e)]).then(function(n){var r=n[0];var i=n[1];if(i.oMetadataObject.length===0){a.resolve({})}else{r.loadPlugins("UserDefaults").done(function(){this._getEditorDataAndValue(a,i.aAllParameterNames,i.aExtendedParameterNames,i.oMetadataObject,e)}.bind(this)).fail(function(){t.error("One or more plugins could not be loaded");a.reject("Initialization of plugins failed")})}}.bind(this));return a.promise()};this._extractKeyArrays=function(e){var t={simple:e&&e.simple&&Object.keys(e.simple).sort()||[],extended:e&&e.extended&&Object.keys(e.extended).sort()||[]};var a=t.extended.filter(function(e){return t.simple.indexOf(e)<0});t.allParameters=t.simple.concat(a).sort();return t};this.editorSetValue=function(e,t,a){var n=new jQuery.Deferred;this._storeValue(e,t,true,a).then(n.resolve);return n.promise()};this.attachValueStored=function(e){c.attachEvent(i,e)};this.detachValueStored=function(e){c.detachEvent(i,e)}}o.hasNoAdapter=true;return o},true);
//# sourceMappingURL=UserDefaultParameters.js.map