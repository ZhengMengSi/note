/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/base/util/extend","sap/base/util/ObjectPath","sap/fe/core/helpers/ClassSupport","sap/m/library","sap/ui/core/Core","sap/ui/core/Fragment","sap/ui/core/mvc/ControllerExtension","sap/ui/core/mvc/OverrideExecution","sap/ui/core/routing/HashChanger","sap/ui/core/util/XMLPreprocessor","sap/ui/core/XMLTemplateProcessor","sap/ui/model/json/JSONModel"],function(e,t,r,a,i,o,n,l,s,p,c,u,h){"use strict";var d,m,f,v,g,S,y,b,_,P,T,E,O,w,M,j,D;var A=a.publicExtension;var I=a.methodOverride;var x=a.finalExtension;var C=a.extensible;var U=a.defineUI5Class;function H(e,t){try{var r=e()}catch(e){return t(e)}if(r&&r.then){return r.then(void 0,t)}return r}function L(e,t){e.prototype=Object.create(t.prototype);e.prototype.constructor=e;R(e,t)}function R(e,t){R=Object.setPrototypeOf?Object.setPrototypeOf.bind():function e(t,r){t.__proto__=r;return t};return R(e,t)}function J(e,t,r,a,i){var o={};Object.keys(a).forEach(function(e){o[e]=a[e]});o.enumerable=!!o.enumerable;o.configurable=!!o.configurable;if("value"in o||o.initializer){o.writable=true}o=r.slice().reverse().reduce(function(r,a){return a(e,t,r)||r},o);if(i&&o.initializer!==void 0){o.value=o.initializer?o.initializer.call(i):void 0;o.initializer=undefined}if(o.initializer===void 0){Object.defineProperty(e,t,o);o=null}return o}var B;var F=(d=U("sap.fe.core.controllerextensions.Share"),m=I(),f=I(),v=A(),g=x(),S=A(),y=C(s.After),b=A(),_=x(),P=A(),T=x(),E=A(),O=x(),w=A(),M=x(),d(j=(D=function(a){L(l,a);function l(){return a.apply(this,arguments)||this}var s=l.prototype;s.onInit=function e(){var t=new h({url:"",appTitle:"",subTitle:""});this.base.getView().setModel(t,"collaborationInfo")};s.onExit=function e(){var t,r;var a=(t=this.base)===null||t===void 0?void 0:(r=t.getView())===null||r===void 0?void 0:r.getModel("collaborationInfo");if(a){a.destroy()}};s.openShareSheet=function e(t){this._openShareSheetImpl(t)};s.adaptShareMetadata=function e(t){return t};s._openShareSheetImpl=function r(a){try{var l=this;var s;var d=p.getInstance().getHash(),m=p.getInstance().hrefForAppSpecificHash?p.getInstance().hrefForAppSpecificHash(""):"",f={url:window.location.origin+window.location.pathname+(d?m+d:window.location.hash),title:document.title,email:{url:"",title:""},jam:{url:"",title:""},tile:{url:"",title:"",subtitle:"",icon:"",queryUrl:""}};B=a;var v=function(e,r){var a=e.getModel("shareData");var i=t(a.getData(),r);a.setData(i)};var g=H(function(){return Promise.resolve(Promise.resolve(l.adaptShareMetadata(f))).then(function(r){var p={shareEmailPressed:function(){var e=s.getModel("shareData");var t=e.getData();var r=o.getLibraryResourceBundle("sap.fe.core");var a=t.email.title?t.email.title:r.getText("T_SHARE_UTIL_HELPER_SAPFE_EMAIL_SUBJECT",[t.title]);i.URLHelper.triggerEmail(undefined,a,t.email.url?t.email.url:t.url)},shareMSTeamsPressed:function(){var e=s.getModel("shareData");var t=e.getData();var r=t.email.title?t.email.title:t.title;var a=t.email.url?t.email.url:t.url;var i=window.open("","ms-teams-share-popup","width=700,height=600");i.opener=null;i.location="https://teams.microsoft.com/share?msgText=".concat(encodeURIComponent(r),"&href=").concat(encodeURIComponent(a))},onSaveTilePress:function(){setTimeout(function(){var e;(e=o.byId("bookmarkDialog"))===null||e===void 0?void 0:e.attachAfterClose(function(){B.focus()})},0)},shareJamPressed:function(){l._doOpenJamShareDialog(r.jam.title?r.jam.title:r.title,r.jam.url?r.jam.url:r.url)}};p.onCancelPressed=function(){s.close()};p.setShareSheet=function(e){a.shareSheet=e};var d=new h({});var m={bindingContexts:{this:d.createBindingContext("/")},models:{this:d}};var f={title:r.tile.title?r.tile.title:r.title,subtitle:r.tile.subtitle,icon:r.tile.icon,url:r.tile.url?r.tile.url:r.url.substring(r.url.indexOf("#")),queryUrl:r.tile.queryUrl};var g=function(){if(a.shareSheet){s=a.shareSheet;var i=s.getModel("share");l._setStaticShareData(i);var o=t(i.getData(),f);i.setData(o);v(s,r);s.openBy(a)}else{var d="sap.fe.macros.share.ShareSheet";var g=u.loadTemplate(d,"fragment");var S=H(function(){return Promise.resolve(Promise.resolve(c.process(g,{name:d},m))).then(function(e){return Promise.resolve(n.load({definition:e,controller:p})).then(function(e){s=e;s.setModel(new h(f||{}),"share");var i=s.getModel("share");l._setStaticShareData(i);var o=t(i.getData(),f);i.setData(o);s.setModel(new h(r||{}),"shareData");v(s,r);a.addDependent(s);s.openBy(a);p.setShareSheet(s)})})},function(t){e.error("Error while opening the share fragment",t)});if(S&&S.then)return S.then(function(){})}}();if(g&&g.then)return g.then(function(){})})},function(t){e.error("Error while fetching the share model data",t)});return Promise.resolve(g&&g.then?g.then(function(){}):void 0)}catch(e){return Promise.reject(e)}};s._setStaticShareData=function e(t){var a=o.getLibraryResourceBundle("sap.fe.core");t.setProperty("/jamButtonText",a.getText("T_COMMON_SAPFE_SHARE_JAM"));t.setProperty("/emailButtonText",a.getText("T_SEMANTIC_CONTROL_SEND_EMAIL"));t.setProperty("/msTeamsShareButtonText",a.getText("T_COMMON_SAPFE_SHARE_MSTEAMS"));if(r.get("sap-ushell-config.renderers.fiori2.componentData.config.sapHorizonEnabled")===true){t.setProperty("/msTeamsVisible",true)}else{t.setProperty("/msTeamsVisible",false)}var i=r.get("sap.ushell.Container.getUser");t.setProperty("/jamVisible",!!i&&i().isJamActive());t.setProperty("/saveAsTileVisible",!!(sap&&sap.ushell&&sap.ushell.Container))};s._doOpenJamShareDialog=function e(t,r){var a=o.createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:r,share:t}}});a.open()};s._triggerEmail=function e(){try{var t=this;return Promise.resolve(t._adaptShareMetadata()).then(function(e){var t=o.getLibraryResourceBundle("sap.fe.core");var r=e.email.title?e.email.title:t.getText("T_SHARE_UTIL_HELPER_SAPFE_EMAIL_SUBJECT",[e.title]);i.URLHelper.triggerEmail(undefined,r,e.email.url?e.email.url:e.url)})}catch(e){return Promise.reject(e)}};s._triggerShareToJam=function e(){try{var t=this;return Promise.resolve(t._adaptShareMetadata()).then(function(e){t._doOpenJamShareDialog(e.jam.title?e.jam.title:e.title,e.jam.url?e.jam.url:window.location.origin+window.location.pathname+e.url)})}catch(e){return Promise.reject(e)}};s._saveAsTile=function e(t){try{var r=this;return Promise.resolve(r._adaptShareMetadata()).then(function(e){var r=t.getDependents()[0];r.setTitle(e.tile.title?e.tile.title:e.title);r.setSubtitle(e.tile.subtitle);r.setTileIcon(e.tile.icon);r.setCustomUrl(e.tile.url?e.tile.title:e.title);r.setServiceUrl(e.tile.queryUrl);r.firePress()})}catch(e){return Promise.reject(e)}};s._adaptShareMetadata=function e(){var t=p.getInstance().getHash(),r=p.getInstance().hrefForAppSpecificHash?p.getInstance().hrefForAppSpecificHash(""):"",a={url:window.location.origin+window.location.pathname+(t?r+t:window.location.hash),title:document.title,email:{url:"",title:""},jam:{url:"",title:""},tile:{url:"",title:"",subtitle:"",icon:"",queryUrl:""}};return this.adaptShareMetadata(a)};return l}(l),J(D.prototype,"onInit",[m],Object.getOwnPropertyDescriptor(D.prototype,"onInit"),D.prototype),J(D.prototype,"onExit",[f],Object.getOwnPropertyDescriptor(D.prototype,"onExit"),D.prototype),J(D.prototype,"openShareSheet",[v,g],Object.getOwnPropertyDescriptor(D.prototype,"openShareSheet"),D.prototype),J(D.prototype,"adaptShareMetadata",[S,y],Object.getOwnPropertyDescriptor(D.prototype,"adaptShareMetadata"),D.prototype),J(D.prototype,"_triggerEmail",[b,_],Object.getOwnPropertyDescriptor(D.prototype,"_triggerEmail"),D.prototype),J(D.prototype,"_triggerShareToJam",[P,T],Object.getOwnPropertyDescriptor(D.prototype,"_triggerShareToJam"),D.prototype),J(D.prototype,"_saveAsTile",[E,O],Object.getOwnPropertyDescriptor(D.prototype,"_saveAsTile"),D.prototype),J(D.prototype,"_adaptShareMetadata",[w,M],Object.getOwnPropertyDescriptor(D.prototype,"_adaptShareMetadata"),D.prototype),D))||j);return F},false);
//# sourceMappingURL=Share.js.map