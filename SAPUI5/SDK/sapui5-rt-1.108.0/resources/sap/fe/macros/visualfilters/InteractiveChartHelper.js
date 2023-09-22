/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/JSTokenizer","sap/fe/core/CommonUtils","sap/fe/core/controls/filterbar/utils/VisualFilterUtils","sap/fe/core/helpers/StableIdHelper","sap/fe/core/templating/CriticalityFormatters","sap/fe/core/templating/FilterHelper","sap/fe/macros/CommonHelper","sap/fe/macros/filter/FilterFieldHelper","sap/fe/macros/ResourceModel","sap/ui/core/format/NumberFormat","sap/ui/mdc/condition/ConditionConverter","sap/fe/core/type/TypeUtil","sap/ui/model/odata/v4/AnnotationHelper","sap/ui/model/odata/v4/ODataUtils"],function(e,t,a,r,n,i,o,l,c,s,u,g,f,p){"use strict";var v=i.getFiltersConditionsFromSelectionVariant;var h=n.buildExpressionForCriticalityColorMicroChart;var m=r.generate;var d={getChartDisplayedValue:function(e,t,a){var r=m([a]);return"{parts:[{path:'"+e+"',type:'sap.ui.model.odata.type.Decimal', constraints:{'nullable':false}}"+(t&&t.ScaleFactor?",{value:'"+t.ScaleFactor.$Decimal+"'}":",{path:'internal>scalefactorNumber/"+r+"'}")+(t&&t.NumberOfFractionalDigits?",{value:'"+t.NumberOfFractionalDigits+"'}":",{value:'0'}")+",{path:'internal>currency/"+r+"'}"+",{path:'"+e+"',type:'sap.ui.model.odata.type.String', constraints:{'nullable':false}}"+"], formatter:'VisualFilterRuntime.scaleVisualFilterValue'}"},getChartValue:function(e){return"{path:'"+e+"',type:'sap.ui.model.odata.type.Decimal', constraints:{'nullable':false}}"},getChart:function(e){var t=e.getModel();var a=t.getObject(e.getPath());var r=a.Visualizations;for(var n=0;n<r.length;n++){if(r[n].$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.Chart")>-1){var i=f.getNavigationPath(e.getPath());return t.createBindingContext(i+"/"+r[n].$AnnotationPath)}}return undefined},getChartLabel:function(){return arguments.length<=2?undefined:arguments[2]},_getMeasurePath:function(e,t){var a;if(t){a="/Measures/0/$PropertyPath"}if(e.DynamicMeasures&&e.DynamicMeasures.length>0){a="/DynamicMeasures/0/$AnnotationPath/AggregatableProperty/$PropertyPath"}else if(!t&&e.Measures&&e.Measures.length>0){a="/Measures/0/$PropertyPath"}return a},getAggregationBinding:function(r,n,i,o,c,s,f,h,m,y,P,C,b,$){var I=C.getProperty("contextPath");var M=I?I.getPath():"";var T=n.Dimensions[0].$PropertyPath;var O=[];var D,S,E,V;var x=i.$kind=="NavigationProperty"?r.getPath(1):(i.$kind=="EntitySet"?"/":"")+r.getModel(1).getObject("".concat(r.getPath(1),"@sapui.name"));var A=d.getUoM(r,n,i,undefined,h,m);var F=r.getInterface(1).getPath(),U=r.getInterface(1).getModel();if(b){O.push({operator:"EQ",value1:"true",value2:null,path:"IsActiveEntity",isParameter:true})}if(f&&f.getObject()){E=v(F,U,f.getObject(),a.getCustomConditions.bind(a));for(var R in E){var L=E[R];L.forEach(function(e){if(!e.isParameter){O.push(e)}})}}if(M!=="".concat(x,"/")&&P&&P.length&&E){var j=[];var _=a.convertFilterCondions(E);var N=t.getParameterInfo(U,x).parameterProperties;for(var B in P){var H=P[B];var q=N[H];var J=F.split("/")[1];var w=U.createBindingContext("/".concat(J,"/").concat(H));var k=e.parseJS(l.formatOptions(q,{context:w})||"{}");var z=e.parseJS(l.constraints(q,{context:w})||"{}");var Q=g.getTypeConfig(q.$Type,k,z);var G=_[H];var K=G?G[0]:undefined;if(K){var W=u.toType(K,Q,g);var X=q.$Type;var Y=encodeURIComponent(p.formatLiteral(W.values[0],X));Y=Y.replaceAll("'","\\'");j.push("".concat(H,"=").concat(Y))}}var Z=x.slice(0,x.lastIndexOf("/"));var ee=x.substring(x.lastIndexOf("/")+1);V="".concat(Z,"(").concat(j.toString(),")/").concat(ee);x=V}if(h){if(y){D=A&&A.$Path?"{ 'unit' : '".concat(A.$Path,"' }"):"{}";S=""}else{D="{}";S=A&&A.$Path?", '".concat(A.$Path,"' : {}"):""}}else if(m&&m.AggregatableProperty&&m.AggregatableProperty.value&&m.AggregationMethod){D="{ 'name' : '"+m.AggregatableProperty.value+"', 'with' : '"+m.AggregationMethod+"'}";S=A&&A.$Path?", '"+A.$Path+"' : {}":""}var te=o?"' : { 'additionally' : ['"+o.$Path+"'] }":"' : { }";var ae=JSON.stringify(O);return"{path: '"+x+"', templateShareable: true, suspended : true, 'filters' : "+ae+",'parameters' : {"+d.getSortOrder(r,U,n,c,s,$)+", '$$aggregation' : {'aggregate' : {'"+$+"' : "+D+"},'group' : {'"+T+te+S+"} } }"+d.getMaxItems(n)+"}"},getSortOrder:function(e,t,a,r,n,i){var o;if(a.ChartType.$EnumMember==="com.sap.vocabularies.UI.v1.ChartType/Donut"||a.ChartType.$EnumMember==="com.sap.vocabularies.UI.v1.ChartType/Bar"){if(n&&n.length){if(n[0].DynamicProperty){o=t.getObject(e.getPath(0).split("@")[0]+n[0].DynamicProperty.$AnnotationPath).Name}else{o=n[0].Property.$PropertyPath}if(o===i){return"'$orderby' : '"+i+(n[0].Descending?" desc'":"'")}return"'$orderby' : '"+i+" desc'"}return"'$orderby' : '"+i+" desc'"}else if(r==="Edm.Date"||r==="Edm.Time"||r==="Edm.DateTimeOffset"){return"'$orderby' : '"+a.Dimensions[0].$PropertyPath+"'"}else if(n&&n.length&&n[0].Property.$PropertyPath===a.Dimensions[0].$PropertyPath){return"'$orderby' : '"+n[0].Property.$PropertyPath+(n[0].Descending?" desc'":"'")}else{return"'$orderby' : '"+a.Dimensions[0].$PropertyPath+"'"}},getMaxItems:function(e){if(e.ChartType.$EnumMember==="com.sap.vocabularies.UI.v1.ChartType/Bar"){return",'startIndex' : 0,'length' : 3"}else if(e.ChartType.$EnumMember==="com.sap.vocabularies.UI.v1.ChartType/Line"){return",'startIndex' : 0,'length' : 6"}else{return""}},getColorBinding:function(e,t,a){var r=e.getModel(0);var n=e.getPath(1);var i=r.getObject("".concat(n,"$PropertyPath@com.sap.vocabularies.UI.v1.ValueCriticality"));t=t.targetObject;if(t.Criticality){return h(t)}else if(t.CriticalityCalculation){var l=t.CriticalityCalculation.ImprovementDirection&&t.CriticalityCalculation.ImprovementDirection.$EnumMember;var c=f.value(t.Value,{context:e.getInterface(0)});var s=f.value(t.CriticalityCalculation.DeviationRangeLowValue,{context:e.getInterface(0)});var u=f.value(t.CriticalityCalculation.ToleranceRangeLowValue,{context:e.getInterface(0)});var g=f.value(t.CriticalityCalculation.AcceptanceRangeLowValue,{context:e.getInterface(0)});var p=f.value(t.CriticalityCalculation.AcceptanceRangeHighValue,{context:e.getInterface(0)});var v=f.value(t.CriticalityCalculation.ToleranceRangeHighValue,{context:e.getInterface(0)});var m=f.value(t.CriticalityCalculation.DeviationRangeHighValue,{context:e.getInterface(0)});return o.getCriticalityCalculationBinding(l,c,s,u,g,p,v,m)}else if(i&&i.length){return o.getValueCriticality(a.$PropertyPath,i)}else{return undefined}},getScaleUoMTitle:function(e,t,a,r,n,i,o,l){var c=e.getModel(0);var u=c.getObject("".concat(e.getPath(0),"/MeasureAttributes/0/DataPoint/$AnnotationPath/ValueFormat/ScaleFactor/$Decimal"));var g=m([r]);var f=s.getIntegerInstance({style:"short",showScale:false,shortRefNumber:u});var p=f.getScale();var v=d.getUoM(e,t,a,undefined,n,i);v=v&&(v.$Path?"${internal>uom/"+g+"}":"'"+v+"'");p=p?"'"+p+"'":"${internal>scalefactor/"+g+"}";if(!o){o="|"}o=v?"' "+o+" ' + ":"";var h=p&&v?o+p+" + ' ' + "+v:o+(p||v);return l?h:"{= "+h+"}"},getMeasureDimensionTitle:function(e,t,a,r,n){var i=e.getModel(0);var o;var l=d._getMeasurePath(t,r);var s=i.getObject("".concat(e.getPath(0))+l);var u=i.getObject("".concat(e.getPath(0),"/Dimensions/0/$PropertyPath"));var g=d.getLabel(i,e,"Dimensions");if(!r&&n){o=n.annotations&&n.annotations.Common&&n.annotations.Common.Label;if(o===undefined){o=o=d.getLabel(i,e,"Measures")}}else{o=d.getLabel(i,e,"Measures")}if(o===undefined){o=s}if(g===undefined){g=u}return c&&c.getText("M_INTERACTIVE_CHART_HELPER_VISUALFILTER_MEASURE_DIMENSION_TITLE",[o,g])},getLabel:function(e,t,a){return e.getObject("".concat(t.getPath(0),"/").concat(a,"/0/$PropertyPath@com.sap.vocabularies.Common.v1.Label"))},getToolTip:function(e,t,a,r,n,i,l){var s=t&&t["ChartType"]&&t["ChartType"]["$EnumMember"];var u=d.getMeasureDimensionTitle(e,t,a,n,i);u=o.escapeSingleQuotes(u);if(l==="false"&&s==="com.sap.vocabularies.UI.v1.ChartType/Line"){return"{= '".concat(u,"'}")}var g=c.getText("M_INTERACTIVE_CHART_HELPER_VISUALFILTER_TOOLTIP_SEPERATOR");var f=m([r]);var p=d.getScaleUoMTitle(e,t,a,f,n,i,g,true);return"{= '"+u+(p?"' + "+p:"'")+"}"},getUoM:function(e,t,a,r,n,i){var o=e.getModel(0);var l=d._getMeasurePath(t,n);var c=o.getObject("".concat(e.getPath(0))+l+"@Org.OData.Measures.V1.ISOCurrency");var s=o.getObject("".concat(e.getPath(0))+l+"@Org.OData.Measures.V1.Unit");var u=o.getObject("".concat(e.getPath(0))+l);var g;if(!n&&i){g=i.AggregatableProperty&&i.AggregatableProperty.value}else{g=u}var f=function(t,a){var n=a&&a.split("V1.")[1];var i={};if(t){i[n]=t;return r&&t.$Path?JSON.stringify(i):t}else if(g){t=e.getModel(1).getObject("".concat(e.getPath(1),"/").concat(g).concat(a));i[n]=t;return t&&r&&t.$Path?JSON.stringify(i):t}};return f(c,"@Org.OData.Measures.V1.ISOCurrency")||f(s,"@Org.OData.Measures.V1.Unit")},getScaleFactor:function(e){if(e&&e.ScaleFactor){return e.ScaleFactor.$Decimal}return undefined},getUoMVisiblity:function(e,t,a){var r=t&&t["ChartType"]&&t["ChartType"]["$EnumMember"];if(a){return false}else if(!(r==="com.sap.vocabularies.UI.v1.ChartType/Bar"||r==="com.sap.vocabularies.UI.v1.ChartType/Line")){return false}else{return true}},getInParameterFiltersBinding:function(e){if(e.length>0){var t=[];var a="";e.forEach(function(e){if(e.localDataProperty){t.push("{path:'$filters>/conditions/".concat(e.localDataProperty,"'}"))}});if(t.length>0){a=t.join();return"{parts:[".concat(a,"], formatter:'sap.fe.macros.visualfilters.VisualFilterRuntime.getFiltersFromConditions'}")}else{return undefined}}else{return undefined}},getfilterCountBinding:function(e,t){var a=t.Dimensions[0].$PropertyPath;return"{path:'$filters>/conditions/"+a+"', formatter:'sap.fe.macros.visualfilters.VisualFilterRuntime.getFilterCounts'}"}};d.getfilterCountBinding.requiresIContext=true;d.getColorBinding.requiresIContext=true;d.getAggregationBinding.requiresIContext=true;d.getUoM.requiresIContext=true;d.getScaleUoMTitle.requiresIContext=true;d.getToolTip.requiresIContext=true;d.getMeasureDimensionTitle.requiresIContext=true;d.getUoMVisiblity.requiresIContext=true;return d},false);
//# sourceMappingURL=InteractiveChartHelper.js.map