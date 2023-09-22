/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/ActionRuntime","sap/fe/core/CommonUtils","sap/fe/core/library","sap/fe/macros/field/FieldRuntime","sap/fe/macros/table/TableHelper"],function(e,t,n,a,i){"use strict";var r=n.CreationMode;var s={displayTableSettings:function(e){var n=e.getSource().getParent(),a=sap.ui.getCore().byId("".concat(n.getId(),"-settings"));t.fireButtonPress(a)},executeConditionalActionShortcut:function(e,n){var a=n.getParent();if(e!==r.CreationRow){var i=a.getActions().reduce(function(e,t){return e.concat(t.getAction())},[]).find(function(t){return t.getId().endsWith(e)});t.fireButtonPress(i)}else{var s=a.getAggregation("creationRow");if(s&&s.getApplyEnabled()&&s.getVisible()){s.fireApply()}}},setContexts:function(t,n,a,r,s,o,d){var c=o?o.split(","):[];var l=JSON.parse(r);var g=s&&s!=="undefined"&&JSON.parse(s);var f=t.getSelectedContexts();var u=false;var v=[];var p=t.data("displayModePropertyBinding")==="true"&&a!=="undefined";var b=[];var y=[];var C=[];var x={};var h={};var P={};var m;var I=t.getBindingContext("internal");P.aUnsavedContexts=[];P.aLockedContexts=[];f=f.filter(function(e){return!e.isInactive()});I.setProperty("",Object.assign(I.getObject(),{selectedContexts:f,numberOfSelectedContexts:f.length,dynamicActions:x,ibn:h,deleteEnabled:true,deletableContexts:[],unSavedContexts:[],lockedContexts:[],updatableContexts:[],semanticKeyHasDraftIndicator:I.getProperty("semanticKeyHasDraftIndicator")?I.getProperty("semanticKeyHasDraftIndicator"):undefined}));for(var A=0;A<f.length;A++){var E=f[A];var O=E.getObject();for(var D in O){if(D.indexOf("#")===0){var B=D;B=B.substring(1,B.length);m=I.getObject();m.dynamicActions[B]={enabled:true};I.setProperty("",m)}}m=I.getObject();if(n!="undefined"){if(E&&E.getProperty(n)){if(a!=="undefined"&&O.IsActiveEntity===true&&O.HasDraftEntity===true){P=j(O,E)}else{v.push(E);P.isDeletable=true}}m["deleteEnabled"]=P.isDeletable}else if(a!=="undefined"&&O.IsActiveEntity===true&&O.HasDraftEntity===true){P=j(O,E)}else{v.push(E)}var S=d.length===0||!!E.getProperty(d);var R=!p||O.IsActiveEntity;if(S&&R){b.push(E)}}function j(e,t){if(e.DraftAdministrativeData.InProcessByUser){C.push(t)}else{y.push(t);u=true}return{aLockedContexts:C,aUnsavedContexts:y,isDeletable:u}}if(!t.data("enableAnalytics")){i.setIBNEnablement(I,g,f)}if(f.length>1){this.disableAction(c,x)}if(m){m["deletableContexts"]=v;m["updatableContexts"]=b;m["unSavedContexts"]=P.aUnsavedContexts;m["lockedContexts"]=P.aLockedContexts;m["controlId"]=t.getId();I.setProperty("",m)}return e.setActionEnablement(I,l,f,"table")},disableAction:function(e,t){e.forEach(function(e){t[e]={bEnabled:false}})},onFieldChangeInCreationRow:function(e,t){var n=a.getFieldStateOnChange(e),i=n.field,r=i.getId();var s=i.getBindingContext("internal"),o=s.getProperty("creationRowFieldValidity"),d=Object.assign({},o);d[r]=n.state;s.setProperty("creationRowFieldValidity",d);if(t){var c=s.getProperty("creationRowCustomValidity"),l=Object.assign({},c);l[i.getBinding("value").getPath()]={fieldId:i.getId()};s.setProperty("creationRowCustomValidity",l);var g=sap.ui.getCore().getMessageManager();var f="".concat(i.getBindingContext().getPath(),"/").concat(i.getBindingPath("value"));g.getMessageModel().getData().forEach(function(e){if(e.target===f){g.removeMessages(e)}})}}};return s},false);
//# sourceMappingURL=TableRuntime.js.map