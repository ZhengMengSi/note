/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/annotations/DataField","sap/fe/core/converters/controls/Common/Action","sap/fe/core/converters/helpers/ConfigurableObject","sap/fe/core/converters/helpers/Key","sap/fe/core/templating/DataModelPathHelper","sap/ui/core/Core","../../helpers/Aggregation","../../helpers/ID","../../ManifestSettings"],function(e,t,r,a,n,o,i,l,u){"use strict";var v={};var s=u.VisualizationType;var d=u.TemplateType;var f=u.ActionType;var g=l.getFilterBarID;var p=l.getChartID;var c=i.AggregationHelper;var y=n.getTargetObjectPath;var m=a.KeyHelper;var h=r.insertCustomElements;var b=t.getActionsFromManifest;var A=e.isDataFieldForActionAbstract;function P(e,t){return C(e)||S(e,t)||O(e,t)||T()}function T(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function S(e,t){var r=e==null?null:typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(r==null)return;var a=[];var n=true;var o=false;var i,l;try{for(r=r.call(e);!(n=(i=r.next()).done);n=true){a.push(i.value);if(t&&a.length===t)break}}catch(e){o=true;l=e}finally{try{if(!n&&r["return"]!=null)r["return"]()}finally{if(o)throw l}}return a}function C(e){if(Array.isArray(e))return e}function I(e,t){var r=typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=O(e))||t&&e&&typeof e.length==="number"){if(r)e=r;var a=0;var n=function(){};return{s:n,n:function(){if(a>=e.length)return{done:true};return{done:false,value:e[a++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o=true,i=false,l;return{s:function(){r=r.call(e)},n:function(){var e=r.next();o=e.done;return e},e:function(e){i=true;l=e},f:function(){try{if(!o&&r.return!=null)r.return()}finally{if(i)throw l}}}}function O(e,t){if(!e)return;if(typeof e==="string")return w(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return w(e,t)}function w(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,a=new Array(t);r<t;r++){a[r]=e[r]}return a}function D(e,t,r){var a=[];if(e){var n=e.Actions||[];n.forEach(function(e){var t,n,o,i;var l;if(A(e)&&!(((t=e.annotations)===null||t===void 0?void 0:(n=t.UI)===null||n===void 0?void 0:(o=n.Hidden)===null||o===void 0?void 0:o.valueOf())===true)&&!e.Inline&&!e.Determining&&!(e!==null&&e!==void 0&&(i=e.ActionTarget)!==null&&i!==void 0&&i.isBound)){var u=m.generateKeyFromDataField(e);switch(e.$Type){case"com.sap.vocabularies.UI.v1.DataFieldForAction":l={type:f.DataFieldForAction,annotationPath:r.getEntitySetBasedAnnotationPath(e.fullyQualifiedName),key:u};break;case"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":l={type:f.DataFieldForIntentBasedNavigation,annotationPath:r.getEntitySetBasedAnnotationPath(e.fullyQualifiedName),key:u};break}}if(l){a.push(l)}})}return a}function E(e,t,r){var a=D(e,t,r);var n=b(r.getManifestControlConfiguration(t).actions,r,a);var o=h(a,n.actions,{enableOnSelect:"overwrite",enabled:"overwrite",visible:"overwrite",command:"overwrite"});return{actions:o,commandActions:n.commandActions}}v.getChartActions=E;function F(e,t){var r;var a=t.getManifestWrapper();var n=t.getManifestControlConfiguration(e);var o=["Page","Control"].indexOf(a.getVariantManagement())>-1;var i=true;var l=[];if((n===null||n===void 0?void 0:(r=n.chartSettings)===null||r===void 0?void 0:r.personalization)!==undefined){i=n.chartSettings.personalization}if(o&&i){if(i===true){return"Sort,Type,Item"}else if(typeof i==="object"){if(i.type){l.push("Type")}if(i.item){l.push("Item")}if(i.sort){l.push("Sort")}return l.join(",")}}return undefined}v.getP13nMode=F;function M(e,t,r,a){var n,i,l;var u=new c(r.getEntityType(),r);if(!a&&!u.isAnalyticsSupported()){throw new Error("ApplySupported is not added to the annotations")}var v=u.getTransAggregations();var f=u.getCustomAggregateDefinitions();var m={};if(f){var h=u.getEntityType();var b=I(f),A;try{var T=function(){var e,t,r,a,n;var o=A.value;var i=o===null||o===void 0?void 0:(e=o.annotations)===null||e===void 0?void 0:(t=e.Aggregation)===null||t===void 0?void 0:t.ContextDefiningProperties;var l=o===null||o===void 0?void 0:o.qualifier;var u=l&&h.entityProperties.find(function(e){return e.name===l});var v=u&&(u===null||u===void 0?void 0:(r=u.annotations)===null||r===void 0?void 0:(a=r.Common)===null||a===void 0?void 0:(n=a.Label)===null||n===void 0?void 0:n.toString());m[l]={name:l,label:v||"Custom Aggregate (".concat(l,")"),sortable:true,sortOrder:"both",contextDefiningProperty:i?i.map(function(e){return e.value}):[]}};for(b.s();!(A=b.n()).done;){T()}}catch(e){b.e(e)}finally{b.f()}}var S={};var C=o.getLibraryResourceBundle("sap.fe.core");if(v){for(var O=0;O<v.length;O++){var w,D,M,N,j,B;S[v[O].Name]={name:v[O].Name,propertyPath:v[O].AggregatableProperty.valueOf().value,aggregationMethod:v[O].AggregationMethod,label:(w=v[O])!==null&&w!==void 0&&(D=w.annotations)!==null&&D!==void 0&&(M=D.Common)!==null&&M!==void 0&&M.Label?(N=v[O])===null||N===void 0?void 0:(j=N.annotations)===null||j===void 0?void 0:(B=j.Common)===null||B===void 0?void 0:B.Label.toString():"".concat(C.getText("AGGREGATABLE_PROPERTY")," (").concat(v[O].Name,")"),sortable:true,sortOrder:"both",custom:false}}}var x=u.getAggregatableProperties();var L=u.getGroupableProperties();var $={};$.$Type="Org.OData.Aggregation.V1.ApplySupportedType";$.AggregatableProperties=[];$.GroupableProperties=[];for(var z=0;x&&z<x.length;z++){var G,V,k;var H={$Type:(G=x[z])===null||G===void 0?void 0:G.$Type,Property:{$PropertyPath:(V=x[z])===null||V===void 0?void 0:(k=V.Property)===null||k===void 0?void 0:k.value}};$.AggregatableProperties.push(H)}for(var R=0;L&&R<L.length;R++){var U;var Q={$PropertyPath:(U=L[R])===null||U===void 0?void 0:U.value};$.GroupableProperties.push(Q)}var K=E(e,t,r);var W=t.split("@"),q=P(W,1),J=q[0];if(J.lastIndexOf("/")===J.length-1){J=J.substr(0,J.length-1)}var Y=(n=r.getEntityType().annotations)===null||n===void 0?void 0:(i=n.UI)===null||i===void 0?void 0:(l=i.HeaderInfo)===null||l===void 0?void 0:l.TypeNamePlural;var _=r.getDataModelObjectPath();var X=J.length===0;var Z=_.targetEntitySet?_.targetEntitySet.name:_.startingEntitySet.name;var ee=X?g(r.getContextPath()):undefined;var te={legendGroup:{layout:{position:"bottom"}}};var re;if(r.getTemplateType()===d.ObjectPage){re=true}else if(r.getTemplateType()===d.ListReport||r.getTemplateType()===d.AnalyticalListPage){re=false}var ae=r.getManifestWrapper().hasMultipleVisualizations()||r.getTemplateType()==="AnalyticalListPage";var ne=ae?".handlers.onSegmentedButtonPressed":"";var oe=ae?"{= ${pageInternal>alpContentView} !== 'Table'}":"true";var ie=u.getAllowedTransformations();$.enableSearch=ie?ie.indexOf("search")>=0:true;var le="";if(e.fullyQualifiedName.split("#").length>1){le=e.fullyQualifiedName.split("#")[1]}return{type:s.Chart,id:le?p(X?Z:J,le,s.Chart):p(X?Z:J,s.Chart),collection:y(r.getDataModelObjectPath()),entityName:Z,personalization:F(t,r),navigationPath:J,annotationPath:r.getAbsoluteAnnotationPath(t),filterId:ee,vizProperties:JSON.stringify(te),actions:K.actions,commandActions:K.commandActions,title:Y,autoBindOnInit:re,onSegmentedButtonPressed:ne,visible:oe,customAgg:m,transAgg:S,applySupported:$}}v.createChartVisualization=M;return v},false);
//# sourceMappingURL=Chart.js.map