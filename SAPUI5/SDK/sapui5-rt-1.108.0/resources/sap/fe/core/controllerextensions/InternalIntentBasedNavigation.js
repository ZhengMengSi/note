/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/base/util/merge","sap/fe/core/controllerextensions/editFlow/draft","sap/fe/core/helpers/ClassSupport","sap/fe/core/helpers/KeepAliveHelper","sap/fe/core/helpers/ModelHelper","sap/fe/navigation/SelectionVariant","sap/ui/core/Core","sap/ui/core/Fragment","sap/ui/core/mvc/ControllerExtension","sap/ui/core/mvc/OverrideExecution","sap/ui/core/util/XMLPreprocessor","sap/ui/core/XMLTemplateProcessor","sap/ui/model/json/JSONModel"],function(e,t,o,a,r,n,i,s,c,p,l,v,u,f){"use strict";var g,d,y,m,b,h,O,P,C,S,x,M,j,A,_,N,w,E,D,F,V,I,B;var R=a.publicExtension;var T=a.privateExtension;var L=a.methodOverride;var $=a.finalExtension;var k=a.extensible;var W=a.defineUI5Class;function z(e,t){e.prototype=Object.create(t.prototype);e.prototype.constructor=e;J(e,t)}function J(e,t){J=Object.setPrototypeOf?Object.setPrototypeOf.bind():function e(t,o){t.__proto__=o;return t};return J(e,t)}function U(e,t,o,a,r){var n={};Object.keys(a).forEach(function(e){n[e]=a[e]});n.enumerable=!!n.enumerable;n.configurable=!!n.configurable;if("value"in n||n.initializer){n.writable=true}n=o.slice().reverse().reduce(function(o,a){return a(e,t,o)||o},n);if(r&&n.initializer!==void 0){n.value=n.initializer?n.initializer.call(r):void 0;n.initializer=undefined}if(n.initializer===void 0){Object.defineProperty(e,t,n);n=null}return n}var H=(g=W("sap.fe.core.controllerextensions.InternalInternalBasedNavigation"),d=L(),y=R(),m=$(),b=R(),h=$(),O=R(),P=$(),C=R(),S=k(l.Instead),x=R(),M=$(),j=T(),A=R(),_=$(),N=R(),w=$(),E=R(),D=$(),F=R(),V=$(),g(I=(B=function(a){z(p,a);function p(){return a.apply(this,arguments)||this}var l=p.prototype;l.onInit=function e(){this._oAppComponent=this.base.getAppComponent();this._oMetaModel=this._oAppComponent.getModel().getMetaModel();this._oNavigationService=this._oAppComponent.getNavigationService();this._oView=this.base.getView()};l.navigate=function e(a,c,p){var l=this;var v=function(e){var o=p&&p.navigationContexts,n=o&&!Array.isArray(o)?[o]:o,v=p&&p.semanticObjectMapping,u=p&&p.additionalNavigationParameters,f={semanticObject:a,action:c},g=l.base.getView(),d=g.getController();if(e){l._oView.setBindingContext(e)}if(a&&c){var y=[],m=new i;if(n&&n.length){n.forEach(function(e){if(e.isA&&e.isA("sap.ui.model.odata.v4.Context")){var t=e.getObject();var o=l._oMetaModel.getMetaPath(e.getPath());t=l.removeSensitiveData(t,o);var a=l.prepareContextForExternalNavigation(t,e);f["propertiesWithoutConflict"]=a.propertiesWithoutConflict;y.push(a.semanticAttributes)}else if(!(e&&Array.isArray(e.data))&&typeof e==="object"){y.push(l.removeSensitiveData(e.data,e.metaPath))}else if(e&&Array.isArray(e.data)){y=l.removeSensitiveData(e.data,e.metaPath)}})}if(y&&y.length){m=l._oNavigationService.mixAttributesAndSelectionVariant(y,m.toJSONString())}var b=l._oView.getModel(),h=l.getEntitySet(),O=h?l._oNavigationService.constructContextUrl(h,b):undefined;if(O){m.setFilterContextUrl(O)}if(u){l._applyOutboundParams(m,u)}d.intentBasedNavigation.adaptNavigationContext(m,f);if(v){l._applySemanticObjectMappings(m,v)}l._removeTechnicalParameters(m);var P=d._intentBasedNavigation.getNavigationMode();var C=p&&p.refreshStrategies||{},S=g.getModel("internal");if(S){if((g&&g.getViewData()).refreshStrategyOnAppRestore){var x=g.getViewData().refreshStrategyOnAppRestore||{};t(C,x)}var M=r.getRefreshStrategyForIntent(C,a,c);if(M){S.setProperty("/refreshStrategyOnAppRestore",M)}}var j=function(){sap.ui.require(["sap/m/MessageBox"],function(e){var t=s.getLibraryResourceBundle("sap.fe.core");e.error(t.getText("C_COMMON_HELPER_NAVIGATION_ERROR_MESSAGE"),{title:t.getText("C_COMMON_SAPFE_ERROR")})})};l._oNavigationService.navigate(a,c,m.toJSONString(),undefined,j,undefined,P)}else{throw new Error("Semantic Object/action is not provided")}};var u=this.base.getView().getBindingContext();var f=u&&u.getModel().getMetaModel();if(this.getView().getViewData().converterType==="ObjectPage"&&f&&!n.isStickySessionSupported(f)){o.processDataLossOrDraftDiscardConfirmation(v.bind(this),Function.prototype,this.base.getView().getBindingContext(),this.base.getView().getController(),true,o.NavigationType.ForwardNavigation)}else{v()}};l.prepareContextForExternalNavigation=function e(t,o){var a={},r=o.getPath(),n=o.getModel().getMetaModel(),i=n.getMetaPath(r),s=i.split("/").filter(Boolean);function c(e,t){for(var o in e){if(e[o]===null||typeof e[o]!=="object"){if(!a[o]){a[o]=[]}a[o].push(t)}else{var r=e[o];c(r,"".concat(t,"/").concat(o))}}}c(t,i);var p=s[0],l=n.getObject("/".concat(p,"/@sapui.name")),v={};var u,f,g;for(var d in a){var y=a[d];var m=void 0;if(y.length>1){for(var b=0;b<=y.length-1;b++){var h=y[b];var O=h.replace(h===i?i:"".concat(i,"/"),"");O=(O===""?O:"".concat(O,"/"))+d;var P=n.getObject("".concat(h,"/@sapui.name"));if(P===l){u=O}if(h===i){f=O}g=O;t["".concat(i,"/").concat(O).split("/").filter(function(e){return e!=""}).join(".")]=o.getProperty(O)}m=u||f||g;t[d]=o.getProperty(m);u=undefined;f=undefined;g=undefined}else{var C=y[0];var S=C.replace(C===i?i:"".concat(i,"/"),"");S=(S===""?S:"".concat(S,"/"))+d;t[d]=o.getProperty(S);v[d]="".concat(i,"/").concat(S).split("/").filter(function(e){return e!=""}).join(".")}}for(var x in t){if(t[x]!==null&&typeof t[x]==="object"){delete t[x]}}return{semanticAttributes:t,propertiesWithoutConflict:v}};l.prepareFiltersForExternalNavigation=function e(t,o,a){var r;var n={};var i={};var s,c,p,l,v;function u(e){var t;for(var a in e){if(e[a]){if(a.includes("/")){t=a;var r=a.split("/");a=r[r.length-1]}else{t=o}if(!n[a]){n[a]=[]}n[a].push(t)}}}u(t);for(var f in n){var g=n[f];if(g.length>1){for(var d=0;d<=g.length-1;d++){r=g[d];if(r===o){p="".concat(o,"/").concat(f);v=f;s=f;if(a&&a.includes(f)){t["$Parameter.".concat(f)]=t[f]}}else{v=r;p="".concat(o,"/").concat(r).replaceAll(/\*/g,"");c=r}t[p.split("/").filter(function(e){return e!=""}).join(".")]=t[v];delete t[r]}l=s||c;t[f]=t[l]}else{r=g[0];p=r===o?"".concat(o,"/").concat(f):"".concat(o,"/").concat(r).replaceAll("*","");i[f]=p.split("/").filter(function(e){return e!=""}).join(".");if(a&&a.includes(f)){t["$Parameter.".concat(f)]=t[f]}}}return{filterConditions:t,filterConditionsWithoutConflict:i}};l.getNavigationMode=function e(){return undefined};l.navigateWithConfirmationDialog=function t(o,a,r){var n,i=this;if(r!==null&&r!==void 0&&r.notApplicableContexts&&((n=r.notApplicableContexts)===null||n===void 0?void 0:n.length)>=1){var s;var p={onClose:function(){s.close()},onContinue:function(){r.navigationContexts=r.applicableContexts;s.close();i.navigate(o,a,r)}};var l=function(){var e;var t=r.notApplicableContexts.length,o=[];for(var a=0;a<r.notApplicableContexts.length;a++){e=r.notApplicableContexts[a].getObject();o.push(e)}var n=new f(o);var i=new f({total:t,label:r.label});s.setModel(n,"notApplicable");s.setModel(i,"totals");s.open()};var g="sap.fe.core.controls.ActionPartial";var d=u.loadTemplate(g,"fragment");var y=this._oView.getModel();var m=y.getMetaModel();var b=r.notApplicableContexts[0].getCanonicalPath();var h="".concat(b.substr(0,b.indexOf("(")),"/");Promise.resolve(v.process(d,{name:g},{bindingContexts:{entityType:m.createBindingContext(h)},models:{entityType:m,metaModel:m}})).then(function(e){return c.load({definition:e,controller:p})}).then(function(e){s=e;i.getView().addDependent(e);l()}).catch(function(){e.error("Error")})}else{this.navigate(o,a,r)}};l._removeTechnicalParameters=function e(t){t.removeSelectOption("@odata.context");t.removeSelectOption("@odata.metadataEtag");t.removeSelectOption("SAP__Messages")};l.getEntitySet=function e(){return this._oView.getViewData().entitySet};l.removeSensitiveData=function e(t,o){if(t){var a=Object.keys(t);if(a.length){delete t["@odata.context"];delete t["@odata.metadataEtag"];delete t["SAP__Messages"];for(var r=0;r<a.length;r++){if(t[a[r]]&&typeof t[a[r]]==="object"){this.removeSensitiveData(t[a[r]],"".concat(o,"/").concat(a[r]))}var n=a[r],i=this._oMetaModel.getObject("".concat(o,"/").concat(n,"@"));if(i){if(i["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]||i["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"]||i["@com.sap.vocabularies.Analytics.v1.Measure"]){delete t[n]}else if(i["@com.sap.vocabularies.Common.v1.FieldControl"]){var s=i["@com.sap.vocabularies.Common.v1.FieldControl"];if(s["$EnumMember"]&&s["$EnumMember"].split("/")[1]==="Inapplicable"){delete t[n]}else if(s["$Path"]&&this._isFieldControlPathInapplicable(s["$Path"],t)){delete t[n]}}}}}}return t};l._isFieldControlPathInapplicable=function e(t,o){var a=false;var r=t.split("/");if(r.length>1){a=o[r[0]]&&o[r[0]].hasOwnProperty(r[1])&&o[r[0]][r[1]]===0}else{a=o[t]===0}return a};l._applySemanticObjectMappings=function e(t,o){var a=typeof o==="string"?JSON.parse(o):o;for(var r=0;r<a.length;r++){var n=a[r]["LocalProperty"]&&a[r]["LocalProperty"]["$PropertyPath"]||a[r]["@com.sap.vocabularies.Common.v1.LocalProperty"]&&a[r]["@com.sap.vocabularies.Common.v1.LocalProperty"]["$Path"];var i=a[r]["SemanticObjectProperty"]||a[r]["@com.sap.vocabularies.Common.v1.SemanticObjectProperty"];if(t.getSelectOption(n)){var s=t.getSelectOption(n);t.removeSelectOption(n);t.massAddSelectOption(i,s)}}return t};l.navigateOutbound=function t(o,a){var r;var n=this.base.getAppComponent().getManifestEntry("sap.app"),i=n.crossNavigation&&n.crossNavigation.outbounds[o];if(!i){e.error("Outbound is not defined in manifest!!");return}var s=i.semanticObject,c=i.action,p=i.parameters&&this.getOutboundParams(i.parameters);if(a){r=[];Object.keys(a).forEach(function(e){var t;if(Array.isArray(a[e])){var o=a[e];for(var n=0;n<o.length;n++){var i;t={};t[e]=o[n];(i=r)===null||i===void 0?void 0:i.push(t)}}else{var s;t={};t[e]=a[e];(s=r)===null||s===void 0?void 0:s.push(t)}})}if(r||p){a={navigationContexts:{data:r||p}}}this.base._intentBasedNavigation.navigate(s,c,a)};l._applyOutboundParams=function e(t,o){var a=Object.keys(o);var r=t.getSelectOptionsPropertyNames();a.forEach(function(e){if(!r.includes(e)){t.addSelectOption(e,"I","EQ",o[e])}});return t};l.getOutboundParams=function e(t){var o={};if(t){var a=Object.keys(t)||[];if(a.length>0){a.forEach(function(e){var a=t[e];if(a.value&&a.value.value&&a.value.format==="plain"){if(!o[e]){o[e]=a.value.value}}})}}return o};l.onChevronPressNavigateOutBound=function e(t,o,a,r){var i=t.getAppComponent().getRoutingService().getOutbounds();var s=i[o];var c;if(s&&s.semanticObject&&s.action){var p={intents:{}};var l={};var v;if(a){if(a.isA&&a.isA("sap.ui.model.odata.v4.Context")){v=n.getMetaPathForContext(a);a=[a]}else{v=n.getMetaPathForContext(a[0])}l[v]="self";p["_feDefault"]=l}if(r){var u="".concat(s.semanticObject,"-").concat(s.action);p.intents[u]={};p.intents[u][r]="self"}if(s&&s.parameters){var f=s.parameters&&this.getOutboundParams(s.parameters);if(Object.keys(f).length>0){c=f}}t._intentBasedNavigation.navigate(s.semanticObject,s.action,{navigationContexts:a,refreshStrategies:p,additionalNavigationParameters:c});return Promise.resolve()}else{throw new Error("outbound target ".concat(o," not found in cross navigation definition of manifest"))}};return p}(p),U(B.prototype,"onInit",[d],Object.getOwnPropertyDescriptor(B.prototype,"onInit"),B.prototype),U(B.prototype,"navigate",[y,m],Object.getOwnPropertyDescriptor(B.prototype,"navigate"),B.prototype),U(B.prototype,"prepareContextForExternalNavigation",[b,h],Object.getOwnPropertyDescriptor(B.prototype,"prepareContextForExternalNavigation"),B.prototype),U(B.prototype,"prepareFiltersForExternalNavigation",[O,P],Object.getOwnPropertyDescriptor(B.prototype,"prepareFiltersForExternalNavigation"),B.prototype),U(B.prototype,"getNavigationMode",[C,S],Object.getOwnPropertyDescriptor(B.prototype,"getNavigationMode"),B.prototype),U(B.prototype,"navigateWithConfirmationDialog",[x,M],Object.getOwnPropertyDescriptor(B.prototype,"navigateWithConfirmationDialog"),B.prototype),U(B.prototype,"getEntitySet",[j],Object.getOwnPropertyDescriptor(B.prototype,"getEntitySet"),B.prototype),U(B.prototype,"removeSensitiveData",[A,_],Object.getOwnPropertyDescriptor(B.prototype,"removeSensitiveData"),B.prototype),U(B.prototype,"navigateOutbound",[N,w],Object.getOwnPropertyDescriptor(B.prototype,"navigateOutbound"),B.prototype),U(B.prototype,"getOutboundParams",[E,D],Object.getOwnPropertyDescriptor(B.prototype,"getOutboundParams"),B.prototype),U(B.prototype,"onChevronPressNavigateOutBound",[F,V],Object.getOwnPropertyDescriptor(B.prototype,"onChevronPressNavigateOutBound"),B.prototype),B))||I);return H},false);
//# sourceMappingURL=InternalIntentBasedNavigation.js.map