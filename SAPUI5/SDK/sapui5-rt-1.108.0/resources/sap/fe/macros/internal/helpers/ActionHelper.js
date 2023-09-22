/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/BindingHelper","sap/fe/core/helpers/BindingToolkit","sap/fe/macros/CommonHelper"],function(e,a,o){"use strict";var t=a.isPathInModelExpression;var n=a.getExpressionFromAnnotation;var i=e.bindingContextPathVisitor;var r={getMultiSelectDisabledActions:function(e,a){var t=[];var n,i,r,l,s;if(e){var u=e.filter(function(e){return e.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"});u.forEach(function(e){i=e.Action;n=o.getActionPath(a.context,true,i,false);s=a.context.getObject("".concat(n,"/@$ui5.overload/0"));if(s&&s.$Parameter&&s.$IsBound){for(var u in s.$Parameter){r="".concat(n,"/").concat(s.$Parameter[u].$Name,"@");l=a.context.getObject(r);if(l&&(l["@com.sap.vocabularies.UI.v1.Hidden"]&&l["@com.sap.vocabularies.UI.v1.Hidden"].$Path||l["@com.sap.vocabularies.Common.v1.FieldControl"]&&l["@com.sap.vocabularies.Common.v1.FieldControl"].$Path)){t.push(i);break}}}})}return t},getPressEventDataFieldForActionButton:function(e,a,t,n){var i=a.InvocationGrouping&&a.InvocationGrouping.$EnumMember==="com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"?"ChangeSet":"Isolated";t=t||{};t["invocationGrouping"]=o.addSingleQuotes(i);t["controlId"]=o.addSingleQuotes(e);t["operationAvailableMap"]=o.addSingleQuotes(n);t["model"]="${$source>/}.getModel()";t["label"]=a.Label&&o.addSingleQuotes(a.Label,true);return o.generateFunction(".editFlow.invokeAction",o.addSingleQuotes(a.Action),o.objectToString(t))},getNumberOfContextsExpression:function(e){var a;if(e==="single"){a="${internal>numberOfSelectedContexts} === 1"}else{a="${internal>numberOfSelectedContexts} > 0"}return a},getOperationAvailableMap:function(e,a,o){var t=this;var n={};if(e){e.forEach(function(e){if(e.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"){if(e.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"){var i=e.Action;if((i===null||i===void 0?void 0:i.indexOf("/"))<0&&!e.Determining){if(a==="table"){n=t._getOperationAvailableMapOfTable(e,i,n,o)}else if(a==="chart"){n=t._getOperationAvailableMapOfChart(i,n,o)}}}}})}return n},_getOperationAvailableMapOfTable:function(e,a,o,r){var l,s,u;var d=e.ActionTarget;if((d===null||d===void 0?void 0:(l=d.annotations)===null||l===void 0?void 0:(s=l.Core)===null||s===void 0?void 0:s.OperationAvailable)===null){}else if(d!==null&&d!==void 0&&(u=d.parameters)!==null&&u!==void 0&&u.length){var c,v,p,f;var g=d.parameters[0].fullyQualifiedName,b=n(d===null||d===void 0?void 0:(c=d.annotations)===null||c===void 0?void 0:(v=c.Core)===null||v===void 0?void 0:v.OperationAvailable,[],undefined,function(e){return i(e,r,g)});if(t(b)){o=this._addToMap(a,b.path,o)}else if((d===null||d===void 0?void 0:(p=d.annotations)===null||p===void 0?void 0:(f=p.Core)===null||f===void 0?void 0:f.OperationAvailable)!==undefined){o=this._addToMap(a,b,o)}}return o},_getOperationAvailableMapOfChart:function(e,a,t){var n=o.getActionPath(t.context,false,e,true);if(n===null){a=this._addToMap(e,null,a)}else{n=o.getActionPath(t.context,false,e);if(n.sProperty){a=this._addToMap(e,n.sProperty.substr(n.sBindingParameter.length+1),a)}}return a},_addToMap:function(e,a,o){if(e&&o){o[e]=a}return o}};return r},false);
//# sourceMappingURL=ActionHelper.js.map