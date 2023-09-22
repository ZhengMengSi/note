/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.textPool");sap.ui.define(["sap/apf/utils/hashtable","sap/apf/core/utils/filter","sap/ui/core/format/DateFormat","sap/apf/utils/utils","sap/ui/thirdparty/jquery"],function(e,t,n,a,jQuery){"use strict";sap.apf.modeler.core.TextPool=function(e,t,n){var a=e.instances.messageHandler;var r=e.instances.persistenceProxy;var i=e.isUsingCloudFoundryProxy;var s=e.constructors.Hashtable;var o=new s(a);var m=new s(a);var l=new s(a);var u=0;var p={TextElement:sap.apf.core.constants.textKeyForInitialText,Language:sap.apf.core.constants.developmentLanguage,TextElementType:"XFLD",TextElementDescription:"",MaximumLength:10,Application:t,TranslationHint:""};function x(e,t){var n=o.getKeys();var a,r=n.length;var i=t.MaximumLength||10;var s=t.TranslationHint||"";var m;for(a=0;a<r;a++){m=o.getItem(n[a]);if(m.TextElementDescription===e&&m.MaximumLength===i&&m.TranslationHint===s){return n[a]}}return undefined}this.removeTexts=function(e,t,n){var a=[];var s,m;function l(t){var a;if(!t){for(a=0;a<m;a++){o.removeItem(e[a])}}n(t)}m=e.length;if(m===0){n(undefined);return}for(s=0;s<m;s++){if(e[s]===sap.apf.core.constants.textKeyForInitialText){continue}a.push({method:"DELETE",entitySetName:"texts",inputParameters:[{name:"TextElement",value:e[s]},{name:"Language",value:sap.apf.core.constants.developmentLanguage}]})}if(i){r.doChangeOperationsInBatch(a,l,t,true)}else{r.doChangeOperationsInBatch(a,l,t)}};this.isInitialTextKey=function(e){return e===sap.apf.core.constants.textKeyForInitialText};this.addTextsAndSave=function(e,t,n){function a(e,t){return e.TextElement===t.TextElement&&e.TextElementDescription===t.TextElementDescription&&e.MaximumLength===t.MaximumLength&&e.Language===t.Language&&e.TranslationHint===t.TranslationHint}var s;var m=e.length;var l;var u=[];var p=[];var x=[];var f;for(s=0;s<m;s++){if(e[s]===sap.apf.core.constants.textKeyForInitialText){continue}l=o.getItem(e[s].TextElement);if(l){if(!a(l,e[s])){u.push(e[s]);o.setItem(e[s].TextElement,e[s])}}else{p.push(e[s]);o.setItem(e[s].TextElement,e[s])}}m=u.length;for(s=0;s<m;s++){f=[{name:"TextElement",value:u[s].TextElement},{name:"Language",value:u[s].Language}];u[s].MaximumLength=parseInt(u[s].MaximumLength,10);x.push({method:"PUT",entitySetName:"texts",data:u[s],inputParameters:f})}m=p.length;for(s=0;s<m;s++){p[s].MaximumLength=parseInt(p[s].MaximumLength,10);x.push({method:"POST",entitySetName:"texts",data:p[s]})}if(x.length>0){if(i){r.doChangeOperationsInBatch(x,t,n,false)}else{r.doChangeOperationsInBatch(x,t,n)}}else{t(undefined)}};this.exportTexts=function(e){var n=sap.apf.utils.renderHeaderOfTextPropertyFile(t,a);var r={TextElement:"AnalyticalConfigurationName",Language:sap.apf.core.constants.developmentLanguage,TextElementType:"XTIT",TextElementDescription:e,MaximumLength:250,Application:t,TranslationHint:""};return n+sap.apf.utils.renderTextEntries(o,a)+sap.apf.utils.renderEntryOfTextPropertyFile(r,a)};this.get=function(e){var t,n;if(e===sap.apf.core.constants.textKeyForInitialText){return p}if(o.hasItem(e)){return o.getItem(e)}if(m.hasItem(e)){t=m.getItem(e);if(t.TextElementDescription){return t}return o.getItem(t)}n=jQuery.extend({},true,p);n.TextElement=e;n.TextElementDescription=e;return n};this.getPersistentKey=function(e){return e};this.setTextAsPromise=function(e,n){var i;var s=jQuery.Deferred();var m=function(e,t,n){if(n){a.putMessage(n)}if(e){o.setItem(e.TextElement,e);i=e.TextElement}s.resolve(e&&e.TextElement)};var l={TextElement:"",Language:sap.apf.core.constants.developmentLanguage,TextElementType:n.TextElementType,TextElementDescription:e,MaximumLength:n.MaximumLength||10,Application:t,TranslationHint:n.TranslationHint||""};if(!e){s.resolve(sap.apf.core.constants.textKeyForInitialText)}i=x(e,n);if(i){s.resolve(i)}else{u++;r.create("texts",l,m,true)}return s.promise()};this.getTextKeys=function(e){var t=o.getKeys();var n,a,r=t.length;var i=[];for(n=0;n<r;n++){a=o.getItem(t[n]);if(e&&a.TextElementType!==e){continue}if(l.hasItem(t[n])){i.push(l.getItem(t[n]))}else{i.push(t[n])}}return i};this.getTextsByTypeAndLength=function(e,t){var n=o.getKeys();var a,r,i=n.length;var s=[];for(a=0;a<i;a++){r=o.getItem(n[a]);if(r.TextElementType===e&&r.MaximumLength===t){if(l.hasItem(n[a])){s.push({TextElement:l.getItem(n[a]),TextElementDescription:r.TextElementDescription})}else{s.push({TextElement:n[a],TextElementDescription:r.TextElementDescription})}}}return s};function f(){var e,t;t=n.length;for(e=0;e<t;e++){if(n[e].TextElement){o.setItem(n[e].TextElement,n[e])}}}f()}});
//# sourceMappingURL=textPool.js.map