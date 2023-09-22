/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log","sap/ui/model/json/JSONModel","sap/ui/core/Core"],function(e,r,t){"use strict";var a="/sap/opu/odata4/ui2/insights_srv/srvd/ui2/";var n=a+"insights_cards_repo_srv/0001/";var i="INSIGHTS_CARDS";var s=a+"insights_cards_read_srv/0001/"+i;var o="POST";var d="PUT";var c;var u=e.getLogger("sap.insights.CardHelper");var p=sap.ui.getCore().getLibraryResourceBundle("sap.insights");var l="sap.insights.preview.Preview",h="sap.insights.selection.Selection",f="sap.insights.selection.SelectionDialog",g="sap.insights.copy.Copy";function v(e){return n+i+"('"+e+"')"}function m(){return fetch(n,{method:"HEAD",headers:{"X-CSRF-Token":"Fetch"}}).then(function(e){var r=e.headers.get("X-CSRF-Token");if(e.ok&&r){return r}w(p.getText("tokenFetchError"))})}function C(e,r,t){if([d,o].indexOf(t)===-1){w("Method not supported.")}var a=e["sap.app"].id;var s=t===d?v(a):n+i;e={descriptorContent:JSON.stringify(e),id:a};var c=JSON.stringify(e);return fetch(s,{method:t,headers:{"X-CSRF-Token":r,"content-type":"application/json;odata.metadata=minimal;charset=utf-8"},body:c}).then(function(e){return e.json()}).then(function(e){if(e.error){w(e.error.message)}return JSON.parse(e.descriptorContent)})}function y(e,r){var t=n+i+"/com.sap.gateway.srvd.ui2.insights_cards_repo_srv.v0001.setRank?";var a=JSON.stringify({changedCards:JSON.stringify(e)});return fetch(t,{method:o,headers:{"X-CSRF-Token":r,"content-type":"application/json;odata.metadata=minimal;charset=utf-8"},body:a}).then(function(e){return e.json()}).then(function(e){if(e.error){w(e.error.message)}e.value.forEach(function(e){if(e.descriptorContent){e.descriptorContent=JSON.parse(e.descriptorContent)}});return e.value})}function b(e){var r=e.split(".");if(r[0]!=="user"){w("sap.app.id value should start with user.<id>.")}}function S(e,r){return fetch(v(e),{method:"DELETE",headers:{"X-CSRF-Token":r}}).then(function(e){return e.ok?{}:e.json()}).then(function(r){if(r.error){w(r.error.message)}return e})}function T(){var e="sap.insights is not enabled for this system.";var r="ux.eng.s4producthomes1";try{var t=window["sap-ushell-config"];var a=t.apps.insights.enabled;var n=t.ushell.homeApp.component.name;var i=n===r;var s=t.ushell.spaces.myHome.enabled;if(a&&s&&i){return Promise.resolve(true)}return Promise.reject(new Error(e))}catch(r){return Promise.reject(new Error(e))}}function w(e){u.error(e);throw new Error(e)}function _(e){var r=false;if(!e["sap.app"]){u.error("Invalid card manifest. sap.app namespace do not exists.");r=true}if(!r&&!e["sap.app"].id){u.error("Invalid card manifest. sap.app.id do not exists.");r=true}if(!r){b(e["sap.app"].id,false)}if(!r&&!e["sap.app"].type){u.error("Invalid card manifest. sap.app.type do not exists.");r=true}if(!r&&e["sap.app"].type.toLowerCase()!=="card"){u.error("Invalid card manifest. invalid value for sap.app.type, expected card.");r=true}if(!r&&!e["sap.card"]){u.error("Invalid card manifest. sap.card namespace do not exists.");r=true}if(!r&&!e["sap.card"].type){u.error("Invalid card manifest. sap.card.type do not exists.");r=true}var t=["Analytical","List","Table"];if(!r&&t.indexOf(e["sap.card"].type)===-1){u.error("Invalid card manifest. Invalid value for sap.card.type. Supported types: "+t);r=true}if(!r&&!e["sap.insights"]){u.error("Invalid card manifest. sap.insights namespace do not exists.");r=true}if(!r&&!e["sap.insights"].parentAppId){u.error("Invalid card manifest. sap.insights.parentAppId do not exists.");r=true}if(!r&&!e["sap.insights"].cardType){u.error("Invalid card manifest. sap.insights.cardType do not exists.");r=true}if(!r&&e["sap.insights"].cardType!=="RT"){u.error("Invalid card manifest. Invalid value for sap.insights.cardType, supported value is RT");r=true}if(!r&&!e["sap.insights"].versions||!e["sap.insights"].versions.ui5){u.error("Invalid card manifest. Invalid value for sap.insights version");r=true}if(!r){var a,n,i,s=false,o=e["sap.card"].type;if(o==="Analytical"){a=e["sap.card"].content.actions||[];n=e["sap.card"].header.actions||[];a=a.filter(function(e){return e.type==="Navigation"&&e.parameters&&e.parameters.ibnTarget&&e.parameters.ibnTarget.semanticObject&&e.parameters.ibnTarget.action});n=n.filter(function(e){return e.type==="Navigation"&&e.parameters&&e.parameters.ibnTarget&&e.parameters.ibnTarget.semanticObject&&e.parameters.ibnTarget.action});if(a.length>0||n.length>0){s=true}if(e["sap.card"].configuration.parameters.state&&e["sap.card"].configuration.parameters.state.value){i=JSON.parse(e["sap.card"].configuration.parameters.state.value);if(i.parameters&&i.parameters.ibnTarget&&i.parameters.ibnTarget.semanticObject&&i.parameters.ibnTarget.action){s=true}}}if(o==="List"||o==="Table"){a=(o==="List"?e["sap.card"].content.item.actions:e["sap.card"].content.row.actions)||[];n=e["sap.card"].header.actions||[];a=a.filter(function(e){return e.type==="Navigation"});n=n.filter(function(e){return e.type==="Navigation"});if(a.length>0||n.length>0){var d={},c={};if(e["sap.card"].configuration.parameters.headerState&&e["sap.card"].configuration.parameters.headerState.value){d=JSON.parse(e["sap.card"].configuration.parameters.headerState.value)}if(e["sap.card"].configuration.parameters.lineItemState&&e["sap.card"].configuration.parameters.lineItemState.value){c=JSON.parse(e["sap.card"].configuration.parameters.lineItemState.value)}var l=false,h=false;if(d.parameters&&d.parameters.ibnTarget&&d.parameters.ibnTarget.semanticObject&&d.parameters.ibnTarget.action){l=true}if(c.parameters&&c.parameters.ibnTarget&&c.parameters.ibnTarget.semanticObject&&c.parameters.ibnTarget.action){h=true}s=l||h}}if(!s){u.error("Invalid card manifest. Card should have navigation.");r=true}}if(r){throw new Error(p.getText("invalidManifest"))}}var L={localCardCache:{},userCardModel:(new r).setDefaultBindingMode("OneWay"),suggestedCardModel:(new r).setDefaultBindingMode("OneWay"),_mergeCard:function(e,r){try{_(e)}catch(e){return Promise.reject(e)}return m().then(function(t){return C(e,t,r)}).then(function(e){this.localCardCache={};return e}.bind(this))},createCard:function(e){return this._mergeCard(e,o)},updateCard:function(e){return this._mergeCard(e,d)},deleteCard:function(e){try{b(e)}catch(e){return Promise.reject(e)}return m().then(function(r){return S(e,r)}).then(function(e){this.localCardCache={};return e}.bind(this))},getUserCards:function(){if(this.localCardCache.userCards){return Promise.resolve(this.localCardCache.userCards)}var e=s+"?$orderby=rank";return this._readCard(e).then(function(e){this.localCardCache.userCards=e;return e}.bind(this))},getUserCardModel:function(){return this.getUserCards().then(function(e){var r=e.filter(function(e){return e.visibility});this.userCardModel.setProperty("/cards",e);this.userCardModel.setProperty("/cardCount",e.length);this.userCardModel.setProperty("/visibleCardCount",r.length);return this.userCardModel}.bind(this))},getSuggestedCards:function(){if(this.localCardCache.suggestedCards){return Promise.resolve(this.localCardCache.suggestedCards)}var e=s+"?$filter=visibility eq true&$select=descriptorUrl,visibility,rank&$orderby=rank&$skip=0&$top=10";return this._readCard(e).then(function(e){this.localCardCache.suggestedCards=e;return e}.bind(this))},getSuggestedCardModel:function(){return this.getSuggestedCards().then(function(e){this.suggestedCardModel.setProperty("/cards",e);this.suggestedCardModel.setProperty("/cardCount",e.length);return this.suggestedCardModel}.bind(this))},_readCard:function(e){return fetch(e).then(function(e){if(e.ok){return e.json()}w("Cannot read user's suggested cards.")}).then(function(e){e.value.forEach(function(e){if(e.descriptorContent){e.descriptorContent=JSON.parse(e.descriptorContent)}});return e.value})},setCardsRanking:function(e){return m().then(function(r){return y(e,r)}).then(function(e){this.localCardCache={};return e}.bind(this))},_refreshUserCards:function(e){var r=e?{deleteAllCards:"X"}:{};return new Promise(function(e){fetch(n,{method:"HEAD",headers:{"X-CSRF-Token":"Fetch"}}).then(function(t){var a=t.headers.get("X-CSRF-Token");fetch(n+i+"/com.sap.gateway.srvd.ui2.insights_cards_repo_srv.v0001.deleteCards?",{method:"POST",headers:{"X-CSRF-Token":a,"content-type":"application/json;odata.metadata=minimal;charset=utf-8"},body:JSON.stringify(r)}).then(function(){this.localCardCache={};e()}.bind(this))}.bind(this))}.bind(this))},getParentAppDetails:function(e){var r={};return sap.ushell.Container.getServiceAsync("ClientSideTargetResolution").then(function(t){var a=t._oAdapter._aInbounds||[];var n=a.find(function(r){return r.resolutionResult&&r.resolutionResult.applicationDependencies&&r.resolutionResult.applicationDependencies.name===e.descriptorContent["sap.insights"].parentAppId});if(n){r.semanticObject="#"+n.semanticObject+"-"+n.action;r.title=e.descriptorContent["sap.app"].title}return r})}};var P={_oViewCache:{},_getLoadLibraryPromise:function(e){var r;switch(e){case l:r=Promise.all([t.loadLibrary("sap.m"),t.loadLibrary("sap.ui.integration"),t.loadLibrary("sap.viz")]);break;case h:case f:r=Promise.all([t.loadLibrary("sap.m"),t.loadLibrary("sap.ui.core"),t.loadLibrary("sap.f"),t.loadLibrary("sap.ui.integration"),t.loadLibrary("sap.ui.layout"),t.loadLibrary("sap.viz")]);break;case g:r=Promise.all([t.loadLibrary("sap.m"),t.loadLibrary("sap.ui.core"),t.loadLibrary("sap.f"),t.loadLibrary("sap.ui.integration"),t.loadLibrary("sap.ui.layout")]);break;default:break}return r},_getXMLView:function(e){return new Promise(function(r,t){if(this._oViewCache[e]){return r(this._oViewCache[e])}return this._getLoadLibraryPromise(e).then(function(){return sap.ui.core.mvc.XMLView.create({viewName:e}).then(function(t){this._oViewCache[e]=t;return r(this._oViewCache[e])}.bind(this))}.bind(this))}.bind(this))},showCardPreview:function(e){return this._getXMLView(l).then(function(r){return r.getController().showPreview(e)})},_showCardSelectionDialog:function(e){return this._getXMLView(f).then(function(r){return r.getController().showSelectionDialog(e)})}};return{getServiceAsync:function(e){if(e==="UIService"){return Promise.resolve(P)}else{if(c){return Promise.resolve(L)}return T().then(function(){c=true;return L}).catch(function(e){return Promise.reject(e)})}}}});
//# sourceMappingURL=CardHelper.js.map