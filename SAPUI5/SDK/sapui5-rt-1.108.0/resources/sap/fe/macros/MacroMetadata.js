/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/deepClone","sap/base/util/merge","sap/base/util/uid","sap/fe/core/converters/ConverterContext"],function(e,t,n,r){"use strict";var a=function(e,t){var n={};if(e){var r=e[t];if(r){Object.keys(r).forEach(function(e){n[e]=r[e]})}}return n};var o=function(e,t,n,r){if(e[t]===undefined||r){e[t]=n}};var i={metadata:{properties:{_flexId:{type:"string"}}},extend:function(c,s){s.metadata.properties._flexId=i.metadata.properties._flexId;s.hasValidation=true;s.getOverrides=a.bind(s);s.setDefaultValue=o.bind(s);s.getConverterContext=function(n,a,o,i){var c=o.appComponent;var s=o.models.viewData&&o.models.viewData.getData();var u=Object.assign({},s);delete u.resourceBundle;u=e(u);u.controlConfiguration=t(u.controlConfiguration,i);return r.createConverterContextForMacro(n.startingEntitySet.name,o.models.metaModel,c&&c.getDiagnostics(),t,n.contextLocation,u)};s.createBindingContext=function(e,t){var r="/".concat(n());t.models.converterContext.setProperty(r,e);return t.models.converterContext.createBindingContext(r)};s.parseAggregation=function(e,t){var n={};if(e&&e.children.length>0){var r=e.children;for(var a=0;a<r.length;a++){var o=t(r[a],a);if(o){n[o.key]=o}}}return n};s.getContentId=function(e){return"".concat(e,"-content")};return s}};return i},false);
//# sourceMappingURL=MacroMetadata.js.map