/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/fe/core/converters/controls/Common/DataVisualization","sap/fe/core/converters/helpers/Aggregation","sap/fe/core/converters/MetaModelConverter","sap/fe/core/helpers/ModelHelper","sap/fe/core/templating/DataModelPathHelper","sap/fe/macros/MacroMetadata","sap/fe/macros/ODataMetaModelUtil","sap/ui/model/json/JSONModel"],function(e,t,a,r,i,n,o,s,l){"use strict";var u=n.getContextRelativeTargetObjectPath;var c=r.getInvolvedDataModelObjects;var h=a.AggregationHelper;var g=t.getDataVisualizationConfiguration;var p={"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1":"axis1","com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2":"axis2","com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3":"axis3","com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis4":"axis4"};var f=o.extend("sap.fe.macros.Chart",{name:"Chart",namespace:"sap.fe.macros.internal",publicNamespace:"sap.fe.macros",fragment:"sap.fe.macros.chart.Chart",metadata:{stereotype:"xmlmacro",properties:{chartDefinition:{type:"sap.ui.model.Context"},id:{type:"string",isPublic:true},_applyIdToContent:{type:"boolean",defaultValue:false},metaPath:{type:"sap.ui.model.Context",isPublic:true},contextPath:{type:"sap.ui.model.Context",isPublic:true},height:{type:"string",defaultValue:"100%"},width:{type:"string",defaultValue:"100%"},headerLevel:{type:"sap.ui.core.TitleLevel",defaultValue:"Auto",isPublic:true},selectionMode:{type:"string",defaultValue:"MULTIPLE",isPublic:true},personalization:{type:"string|boolean",isPublic:true},filterBar:{type:"string",isPublic:true},filter:{type:"string",isPublic:true},noDataText:{type:"string"},chartDelegate:{type:"string"},vizProperties:{type:"string"},actions:{type:"sap.ui.model.Context"},autoBindOnInit:{type:"boolean"},visible:{type:"string"}},events:{onSegmentedButtonPressed:{type:"function"},selectionChange:{type:"Function",isPublic:true},stateChange:{type:"function"}}},create:function(e,t,a){var r;var n=c(e.metaPath,e.contextPath);var o=this.getConverterContext(n,e.contextPath,a);var s=new h(o.getEntityType(),o);if(e.chartDefinition===undefined||e.chartDefinition===null){var l=u(n);if(e.metaPath.getObject().$Type==="com.sap.vocabularies.UI.v1.PresentationVariantType"){var p=e.metaPath.getObject().Visualizations;p.forEach(function(e){if(e.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart")>-1){l=e.$AnnotationPath}})}var f=g(l,e.useCondensedLayout,o);r=f.visualizations[0];e.chartDefinition=this.createBindingContext(r,a)}else{r=e.chartDefinition.getObject()}r.path=e.chartDefinition.getPath();this.setDefaultValue(e,"navigationPath",r.navigationPath);this.setDefaultValue(e,"autoBindOnInit",r.autoBindOnInit);this.setDefaultValue(e,"vizProperties",r.vizProperties);e.actions=this.createBindingContext(r.actions,a);e.selectionMode=e.selectionMode.toUpperCase();if(e.filterBar){this.setDefaultValue(e,"filter",this.getContentId(e.filterBar))}else if(!e.filter){this.setDefaultValue(e,"filter",r.filterId)}this.setDefaultValue(e,"onSegmentedButtonPressed",r.onSegmentedButtonPressed);this.setDefaultValue(e,"visible",r.visible);var d=e.contextPath.getPath();d=d[d.length-1]==="/"?d.slice(0,-1):d;this.setDefaultValue(e,"draftSupported",i.isDraftSupported(a.models.metaModel,d));if(e._applyIdToContent){e._apiId=e.id+"::Chart";e._contentId=e.id}else{e._apiId=e.id;e._contentId=this.getContentId(e.id)}e.measures=this.getChartMeasures(e,s);return e},getChartMeasures:function(t,a){var r=this;var i=t.metaPath.getModel();var n=t.chartDefinition.getObject().annotationPath.split("/");var o=n.filter(function(e,t){return n.indexOf(e)==t}).toString().replaceAll(",","/");var s=i.getObject(o);var u=a.getAggregatedProperties("AggregatedProperty");var c=[];var h=t.metaPath.getPath();var g=a.getAggregatedProperties("AggregatedProperties");var p=s.Measures?s.Measures:[];var f=s.DynamicMeasures?s.DynamicMeasures:[];var d=g[0]?g[0].filter(function(e){return p.some(function(t){return e.Name===t.$PropertyPath})}):undefined;var v=h.replace(/@com.sap.vocabularies.UI.v1.(Chart|PresentationVariant|SelectionPresentationVariant).*/,"");var P=t.chartDefinition.getObject().transAgg;var m=t.chartDefinition.getObject().customAgg;if(u&&!f&&d.length>0){e.warning("The transformational aggregate measures are configured as Chart.Measures but should be configured as Chart.DynamicMeasures instead. Please check the SAP Help documentation and correct the configuration accordingly.")}var y=p.some(function(e){var t=r.getCustomAggMeasure(m,e);return!!t});if(u.length>0&&!f.length&&!y){throw new Error("Please configure DynamicMeasures for the chart")}if(u.length>0){for(var b=0;b<f.length;b++){var M=f[b].$AnnotationPath;var C=i.getObject(v+M);if(M.indexOf("/")>-1){e.error("$expand is not yet supported. Measure: ${sKey} from an association cannot be used")}else if(!C){throw new Error("Please provide the right AnnotationPath to the Dynamic Measure "+f[b].$AnnotationPath)}else if(!f[b].$AnnotationPath.startsWith("@com.sap.vocabularies.Analytics.v1.AggregatedProperty")){throw new Error("Please provide the right AnnotationPath to the Dynamic Measure "+f[b].$AnnotationPath)}else{var D={key:C.Name,role:"axis1"};D.propertyPath=C.AggregatableProperty.$PropertyPath;D.aggregationMethod=C.AggregationMethod;D.label=C["@com.sap.vocabularies.Common.v1.Label"]||i.getObject(v+D.propertyPath+"@com.sap.vocabularies.Common.v1.Label");this.setChartMeasureAttributes(s.MeasureAttributes,v,D,i);c.push(D)}}}for(var A=0;A<p.length;A++){var x=p[A].$PropertyPath;var O=this.getCustomAggMeasure(m,p[A]);var $={};if(O){if(x.indexOf("/")>-1){e.error("$expand is not yet supported. Measure: ${sKey} from an association cannot be used")}$.key=O.$PropertyPath;$.role="axis1";$.propertyPath=O.$PropertyPath;c.push($)}else if(u.length===0&&P[x]){var I=P[x];$.key=I.name;$.role="axis1";$.propertyPath=x;$.aggregationMethod=I.aggregationMethod;$.label=I.label||$.label;c.push($)}this.setChartMeasureAttributes(s.MeasureAttributes,v,$,i)}var V=new l(c);V.$$valueAsPromise=true;return V.createBindingContext("/")},getCustomAggMeasure:function(e,t){if(e[t.$PropertyPath]){return t}return null},setChartMeasureAttributes:function(e,t,a,r){if(e&&e.length){for(var i=0;i<e.length;i++){var n={};if(e[i].DynamicMeasure){n.Path=e[i].DynamicMeasure.$AnnotationPath}else{n.Path=e[i].Measure.$PropertyPath}n.DataPoint=e[i].DataPoint?e[i].DataPoint.$PropertyPath:null;n.Role=e[i].Role;if(a.key===n.Path){a.role=n.Role?p[n.Role.$EnumMember]:a.role;var o=n.DataPoint;if(o){var l=r.getObject(t+o);if(l.Value.$Path==a.key){a.dataPoint=this.formatJSONToString(s.createDataPointProperty(l))}}}}}},formatJSONToString:function(e){if(!e){return undefined}var t=JSON.stringify(e);t=t.replace(new RegExp("{","g"),"\\{");t=t.replace(new RegExp("}","g"),"\\}");return t}});return f},false);
//# sourceMappingURL=Chart.metadata.js.map