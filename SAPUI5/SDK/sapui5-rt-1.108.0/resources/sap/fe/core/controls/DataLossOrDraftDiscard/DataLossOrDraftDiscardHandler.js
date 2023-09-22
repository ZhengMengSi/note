/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Fragment","sap/ui/core/util/XMLPreprocessor","sap/ui/core/XMLTemplateProcessor","sap/ui/model/json/JSONModel"],function(e,t,n,r,a){"use strict";var o={};var i;(function(e){e["Save"]="draftDataLossOptionSave";e["Keep"]="draftDataLossOptionKeep";e["Discard"]="draftDataLossOptionDiscard"})(i||(i={}));var s;var c;function f(o,f,d,D){var g;s=o;c=f;var m="sap.fe.core.controls.DataLossOrDraftDiscard.DataLossDraft";var L=d.getView();var h={onDataLossOk:function(){var t=l(g);if(t===i.Save){p(d).then(s).catch(function(t){e.error("Error while saving document",t)});g.close()}else if(t===i.Keep){s();g.close()}else if(t===i.Discard){u(d,D).then(s).catch(function(t){e.error("Error while discarding draft",t)});g.close()}},onDataLossCancel:function(){c();g.close()},setDataLossPopup:function(e){d.dataLossPopup=e}};var P=L.getModel("sap.fe.i18n");var w=new a({}),O={bindingContexts:{this:w.createBindingContext("/")},models:{this:w,i18n:P}};if(d.dataLossPopup){g=d.dataLossPopup;g.open();v(g)}else{var C=r.loadTemplate(m,"fragment");Promise.resolve(n.process(C,{name:m},O)).then(function(e){return t.load({definition:e,controller:h})}).then(function(e){g=e;e.attachAfterOpen(function(){v(g)});L.addDependent(g);g.open();h.setDataLossPopup(g)}).catch(function(t){e.error("Error while opening the Discard Dialog fragment",t)})}}function d(e,t,n,r){return new Promise(function(a,o){var i=function(t){var n=e(t);a(n)};var s=function(){t();o()};f(i,s,n,r)})}o.performAfterDiscardorKeepDraft=d;function u(e,t){var n=e.getView().getBindingContext();var r={skipBackNavigation:true,skipDiscardPopover:true,skipBindingToView:t!==undefined?t:true};return e.editFlow.cancelDocument(n,r)}o.discardDraft=u;function p(e){var t=e.getView().getBindingContext();if(e.isA("sap.fe.templates.ObjectPage.ObjectPageController")){return e._saveDocument(t)}else{return e.editFlow.saveDocument(t)}}o.saveDocument=p;function l(e){var t=e.getContent().find(function(e){return e.data("listIdentifier")==="draftDataLossOptionsList"});return t.getSelectedItem().data("itemKey")}o.getSelectedKey=l;function v(e){var t=e.getContent().find(function(e){return e.data("listIdentifier")==="draftDataLossOptionsList"});var n=t.getItems()[0];t.setSelectedItem(n);e.getButtons()[0].focus()}o.selectAndFocusFirstEntry=v;return{performAfterDiscardorKeepDraft:d,discardDraft:u,saveDocument:p,getSelectedKey:l,selectAndFocusFirstEntry:v}},false);
//# sourceMappingURL=DataLossOrDraftDiscardHandler.js.map