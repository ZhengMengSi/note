/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingToolkit","sap/fe/core/templating/DataModelPathHelper"],function(i,t){"use strict";var e={};var r=t.getRelativePaths;var a=i.or;var o=i.ifElse;var l=i.getExpressionFromAnnotation;var n=i.equal;var c=i.constant;var v=i.compileExpression;var s=function(i,t){var e=i.targetObject?i.targetObject:i;var s=e===null||e===void 0?void 0:e.Criticality;var y=t?r(t):undefined;var p=l(s,y);var u;if(s){u=o(a(n(p,c("UI.CriticalityType/Negative")),n(p,c(1)),n(p,c("1"))),c("Error"),o(a(n(p,c("UI.CriticalityType/Critical")),n(p,c(2)),n(p,c("2"))),c("Warning"),o(a(n(p,c("UI.CriticalityType/Positive")),n(p,c(3)),n(p,c("3"))),c("Success"),o(a(n(p,c("UI.CriticalityType/Information")),n(p,c(5)),n(p,c("5"))),c("Information"),c("None")))))}else{u=c("None")}return v(u)};e.buildExpressionForCriticalityColor=s;var y=function(i,t){var e=i!==null&&i!==void 0&&i.targetObject?i.targetObject:i;var s=e===null||e===void 0?void 0:e.Criticality;var y=t?r(t):undefined;var p=l(s,y);var u=(e===null||e===void 0?void 0:e.CriticalityRepresentation)&&(e===null||e===void 0?void 0:e.CriticalityRepresentation)==="UI.CriticalityRepresentationType/WithoutIcon";var C;if(!u){if(s){C=o(a(n(p,c("UI.CriticalityType/Negative")),n(p,c(1)),n(p,c("1"))),c("sap-icon://message-error"),o(a(n(p,c("UI.CriticalityType/Critical")),n(p,c(2)),n(p,c("2"))),c("sap-icon://message-warning"),o(a(n(p,c("UI.CriticalityType/Positive")),n(p,c(3)),n(p,c("3"))),c("sap-icon://message-success"),o(a(n(p,c("UI.CriticalityType/Information")),n(p,c(5)),n(p,c("5"))),c("sap-icon://message-information"),c("")))))}else{C=c("")}}else{C=c("")}return v(C)};e.buildExpressionForCriticalityIcon=y;var p=function(i){var t=i!==null&&i!==void 0&&i.targetObject?i.targetObject:i;var e=t===null||t===void 0?void 0:t.Criticality;var r=l(e);var s;if(e){s=o(a(n(r,c("UI.CriticalityType/Negative")),n(r,c(1)),n(r,c("1"))),c("Reject"),o(a(n(r,c("UI.CriticalityType/Positive")),n(r,c(3)),n(r,c("3"))),c("Accept"),c("Default")))}else{s=c("Default")}return v(s)};e.buildExpressionForCriticalityButtonType=p;var u=function(i){var t=i!==null&&i!==void 0&&i.targetObject?i.targetObject:i;var e=t===null||t===void 0?void 0:t.Criticality;var r=l(e);var s;if(e){s=o(a(n(r,c("UI.CriticalityType/Negative")),n(r,c(1)),n(r,c("1"))),c("Error"),o(a(n(r,c("UI.CriticalityType/Critical")),n(r,c(2)),n(r,c("2"))),c("Critical"),o(a(n(r,c("UI.CriticalityType/Positive")),n(r,c(3)),n(r,c("3"))),c("Good"),c("Neutral"))))}else{s=c("Neutral")}return v(s)};e.buildExpressionForCriticalityColorMicroChart=u;return e},false);
//# sourceMappingURL=CriticalityFormatters.js.map