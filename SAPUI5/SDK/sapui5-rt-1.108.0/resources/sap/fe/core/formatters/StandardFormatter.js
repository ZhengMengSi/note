/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/controls/Any","sap/fe/core/helpers/BindingToolkit"],function(r,e){"use strict";var t=e.transformRecursively;var n=e.constant;var a=e.compileExpression;var o=function(r){var e=this;for(var o=arguments.length,s=new Array(o>1?o-1:0),u=1;u<o;u++){s[u-1]=arguments[u]}var f=JSON.parse(r);t(f,"PathInModel",function(r){if(r.modelName==="$"){return n(s[parseInt(r.path.substring(1),10)])}return r},true);t(f,"ComplexType",function(r){var t=a(r);if(t){return n(i(t,e))}return n(t)});var c=a(f);return i(c,this)};var i=function(e,t){var n=new r({anyText:e});n.setModel(t.getModel());n.setBindingContext(t.getBindingContext());return n.getAnyText()};o.__functionName="sap.fe.core.formatters.StandardFormatter#evaluateComplexExpression";var s=function(){for(var r=arguments.length,e=new Array(r),t=0;t<r;t++){e[t]=arguments[t]}return e.join("")};s.__functionName="sap.fe.core.formatters.StandardFormatter#concat";var u=function(r,e,t){return r?e:t};u.__functionName="sap.fe.core.formatters.StandardFormatter#ifElse";var f=function(r){if(f.hasOwnProperty(r)){for(var e=arguments.length,t=new Array(e>1?e-1:0),n=1;n<e;n++){t[n-1]=arguments[n]}return f[r].apply(this,t)}else{return""}};f.evaluateComplexExpression=o;f.concat=s;f.ifElse=u;return f},true);
//# sourceMappingURL=StandardFormatter.js.map