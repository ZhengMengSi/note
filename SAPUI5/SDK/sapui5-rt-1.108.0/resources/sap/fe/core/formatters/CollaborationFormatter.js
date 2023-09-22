/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var t={};var o=function(t){if(o.hasOwnProperty(t)){for(var r=arguments.length,a=new Array(r>1?r-1:0),i=1;i<r;i++){a[i-1]=arguments[i]}return o[t].apply(this,a)}else{return""}};var r=function(t){for(var o=arguments.length,r=new Array(o>1?o-1:0),a=1;a<o;a++){r[a-1]=arguments[a]}return!!n.apply(void 0,[t].concat(r))};r.__functionName="sap.fe.core.formatters.CollaborationFormatter#hasCollaborationActivity";t.hasCollaborationActivity=r;var a=function(t){for(var o=arguments.length,r=new Array(o>1?o-1:0),a=1;a<o;a++){r[a-1]=arguments[a]}var i=n.apply(void 0,[t].concat(r));return(i===null||i===void 0?void 0:i.initials)||undefined};a.__functionName="sap.fe.core.formatters.CollaborationFormatter#getCollaborationActivityInitials";t.getCollaborationActivityInitials=a;var i=function(t){for(var o=arguments.length,r=new Array(o>1?o-1:0),a=1;a<o;a++){r[a-1]=arguments[a]}var i=n.apply(void 0,[t].concat(r));return i!==null&&i!==void 0&&i.color?"Accent".concat(i.color):undefined};i.__functionName="sap.fe.core.formatters.CollaborationFormatter#getCollaborationActivityColor";t.getCollaborationActivityColor=i;function n(t){for(var o=arguments.length,r=new Array(o>1?o-1:0),a=1;a<o;a++){r[a-1]=arguments[a]}if(t&&t.length>0){return t.find(function(t){var o;var a=(t===null||t===void 0?void 0:(o=t.key)===null||o===void 0?void 0:o.split(","))||[];var i="";var n;for(var l=0;l<a.length;l++){var e;n=a[l].split("=");i=(n[1]||n[0]).split("'").join("");if(i!==((e=r[l])===null||e===void 0?void 0:e.toString())){return false}}return true})}}o.hasCollaborationActivity=r;o.getCollaborationActivityInitials=a;o.getCollaborationActivityColor=i;return o},true);
//# sourceMappingURL=CollaborationFormatter.js.map