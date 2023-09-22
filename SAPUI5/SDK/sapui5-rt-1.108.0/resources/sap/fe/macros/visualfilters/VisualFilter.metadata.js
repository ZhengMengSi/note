/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/fe/core/converters/helpers/Aggregation","sap/fe/core/converters/MetaModelConverter","sap/fe/core/helpers/ModelHelper","sap/fe/macros/MacroMetadata","sap/fe/macros/ResourceModel"],function(e,t,a,r,i,s){"use strict";var n=a.getInvolvedDataModelObjects;var o=t.AggregationHelper;var l=i.extend("sap.fe.macros.visualfilters.VisualFilter",{name:"VisualFilter",namespace:"sap.fe.macros",fragment:"sap.fe.macros.visualfilters.VisualFilter",metadata:{properties:{id:{type:"string"},title:{type:"string",defaultValue:""},contextPath:{type:"sap.ui.model.Context",required:true,$kind:["EntitySet","NavigationProperty"]},metaPath:{type:"sap.ui.model.Context"},outParameter:{type:"string"},selectionVariantAnnotation:{type:"sap.ui.model.Context"},inParameters:{type:"sap.ui.model.Context"},multipleSelectionAllowed:{type:"boolean"},required:{type:"boolean"},showOverlayInitially:{type:"boolean"},renderLineChart:{type:"boolean"},requiredProperties:{type:"sap.ui.model.Context"},filterBarEntityType:{type:"sap.ui.model.Context"},showError:{type:"boolean"},chartMeasure:{type:"string"}}},create:function(t,a,i){var l,g;t.groupId="$auto.visualFilters";t.inParameters=t.inParameters.getObject();this.setDefaultValue(t,"aggregateProperties",undefined);this.setDefaultValue(t,"showValueHelp",undefined);this.setDefaultValue(t,"bCustomAggregate",false);var u=n(t.metaPath,t.contextPath);var p=this.getConverterContext(u,t.contextPath,i);var f=new o(p.getEntityType(),p);var c=f.getCustomAggregateDefinitions();var d=t.contextPath&&t.contextPath.getModel();var h=t.metaPath&&t.metaPath.getPath();var m=d.getObject(h);var v,y;var P=m&&m.Visualizations;if(P){for(var A=0;A<P.length;A++){var M=m.Visualizations[A]&&m.Visualizations[A].$AnnotationPath;v=p.getEntityTypeAnnotation(M)&&p.getEntityTypeAnnotation(M).annotation}}var b,T=[];if((l=v)!==null&&l!==void 0&&(g=l.Measures)!==null&&g!==void 0&&g.length){T=c.filter(function(e){return e.qualifier===v.Measures[0].value});y=T.length>0?T[0].qualifier:v.Measures[0].value;b=f.getAggregatedProperties("AggregatedProperties")[0]}if(b&&b.length>0&&!v.DynamicMeasures&&T.length===0&&v.Measures.length>0){e.warning("The transformational aggregate measures are configured as Chart.Measures but should be configured as Chart.DynamicMeasures instead. Please check the SAP Help documentation and correct the configuration accordingly.")}if(v.DynamicMeasures){if(T.length===0){y=p.getConverterContextFor(p.getAbsoluteAnnotationPath(v.DynamicMeasures[0].value)).getDataModelObjectPath().targetObject.Name;b=f.getAggregatedProperties("AggregatedProperty")}else{e.warning("The dynamic measures have been ignored as visual filters can deal with only 1 measure and the first (custom aggregate) measure defined under Chart.Measures is considered.")}}var C;if(v){if(v.ChartType==="UI.ChartType/Line"||v.ChartType==="UI.ChartType/Bar"){C=true}else{C=false}}if(c.some(function(e){return e.qualifier===y})){t.bCustomAggregate=true}var E=t.selectionVariantAnnotation&&t.selectionVariantAnnotation.getObject();var O=0;if(E&&!t.multipleSelectionAllowed){for(var V=0;V<E.SelectOptions.length;V++){if(E.SelectOptions[V].PropertyName.$PropertyPath===v.Dimensions[0].value){O++;if(O>1){throw new Error("Multiple SelectOptions for FilterField having SingleValue Allowed Expression")}}}}var I=this.getAggregateProperties(b,y);if(I){t.aggregateProperties=I}var D=this.getUoM(d,t.contextPath,y,I);if(D&&D.$Path&&c.some(function(e){return e.qualifier===D.$Path})){t.bUoMHasCustomAggregate=true}else{t.bUoMHasCustomAggregate=false}var _=this.getHiddenMeasure(d,t.contextPath,y,t.bCustomAggregate,I);var S=v.Dimensions[0]&&v.Dimensions[0].$target&&v.Dimensions[0].$target.type;var x=v.ChartType;if(S==="Edm.Date"||S==="Edm.Time"||S==="Edm.DateTimeOffset"){t.showValueHelp=false}else if(typeof _==="boolean"&&_){t.showValueHelp=false}else if(!(x==="UI.ChartType/Bar"||x==="UI.ChartType/Line")){t.showValueHelp=false}else if(t.renderLineChart==="false"&&x==="UI.ChartType/Line"){t.showValueHelp=false}else{t.showValueHelp=true}this.setDefaultValue(t,"draftSupported",r.isDraftSupported(i.models.metaModel,t.contextPath));if(typeof _==="boolean"&&_||!C||t.renderLineChart==="false"){t.showError=true;t.errorMessageTitle=_||!C?s.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"):s.getText("M_VISUAL_FILTER_LINE_CHART_INVALID_DATATYPE");if(_){t.errorMessage=s.getText("M_VISUAL_FILTER_HIDDEN_MEASURE",y)}else if(!C){t.errorMessage=s.getText("M_VISUAL_FILTER_UNSUPPORTED_CHART_TYPE")}else{t.errorMessage=s.getText("M_VISUAL_FILTER_LINE_CHART_UNSUPPORTED_DIMENSION")}}t.chartMeasure=y;return t},getAggregateProperties:function(e,t){var a={};if(!e){return}e.some(function(e){if(e.Name===t){a=e;return true}});return a},getHiddenMeasure:function(e,t,a,r,i){var s;if(!r&&i){s=i.AggregatableProperty&&i.AggregatableProperty.value}else{s=a}var n=e.getObject(t+"/"+s+"@com.sap.vocabularies.UI.v1.Hidden");if(!n&&i&&i.AggregatableProperty){n=e.getObject(t+"/"+s+"@com.sap.vocabularies.UI.v1.Hidden")}return n},getUoM:function(e,t,a,r){var i=e.getObject(t+"/"+a+"@Org.OData.Measures.V1.ISOCurrency");var s=e.getObject(t+"/"+a+"@Org.OData.Measures.V1.Unit");if(!i&&!s&&r&&r.AggregatableProperty){i=e.getObject(t+"/"+r.AggregatableProperty.value+"@Org.OData.Measures.V1.ISOCurrency");s=e.getObject(t+"/"+r.AggregatableProperty.value+"@Org.OData.Measures.V1.Unit")}return i||s}});return l},false);
//# sourceMappingURL=VisualFilter.metadata.js.map