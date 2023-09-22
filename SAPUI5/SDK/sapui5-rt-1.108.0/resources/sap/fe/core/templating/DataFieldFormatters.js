/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/MetaModelConverter","sap/fe/core/templating/DataModelPathHelper","sap/fe/core/templating/UIFormatters"],function(t,e,a){"use strict";var r={};var o=a.getConverterContext;var n=e.enhanceDataModelPath;var c=t.getInvolvedDataModelObjects;var i=function(t,e){var a=e.context.getPath();if(!t){throw new Error("Unresolved context path ".concat(a))}var r=false;if(typeof t==="object"&&(t.hasOwnProperty("$Path")||t.hasOwnProperty("$AnnotationPath"))){r=true}else if(typeof t==="object"&&t.hasOwnProperty("$kind")&&t.$kind!=="Property"){throw new Error("Context does not resolve to a DataField object but to a ".concat(t.$kind))}var n=o(t,e);if(r){n=n.$target}return n};r.getDataField=i;var s=function(t,e){var a=e.context.getPath();if(!t){throw new Error("Unresolved context path ".concat(a))}if(typeof t==="object"&&t.hasOwnProperty("$kind")&&t.$kind!=="Property"){throw new Error("Context does not resolve to a Property object but to a ".concat(t.$kind))}var r=c(e.context);if(r.targetObject&&r.targetObject.type==="Path"){r=n(r,r.targetObject.path)}if(r.targetObject&&r.targetObject.type==="AnnotationPath"){r=n(r,r.targetObject)}if(a.endsWith("$Path")||a.endsWith("$AnnotationPath")){r=n(r,t)}return r};r.getDataFieldObjectPath=s;var d=function(t,e){var a=i(t,e);return a.$Type==="com.sap.vocabularies.UI.v1.ConnectedFieldsType"};r.isSemanticallyConnectedFields=d;return r},false);
//# sourceMappingURL=DataFieldFormatters.js.map