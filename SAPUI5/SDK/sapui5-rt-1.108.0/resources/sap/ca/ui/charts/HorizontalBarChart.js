/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.charts.HorizontalBarChart");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.ca.ui.charts.Chart");sap.ca.ui.charts.Chart.extend("sap.ca.ui.charts.HorizontalBarChart",{metadata:{deprecated:true,library:"sap.ca.ui",properties:{data:{type:"object",group:"Misc",defaultValue:null},container:{type:"string",group:"Misc",defaultValue:"chart"},barHeight:{type:"int",group:"Misc",defaultValue:48}},aggregations:{scroll:{type:"sap.m.ScrollContainer",multiple:false,deprecated:true},horizontalBarChart:{type:"sap.viz.ui5.Bar",multiple:false},verticalArea:{type:"sap.m.VBox",multiple:false,deprecated:true}}}});sap.ca.ui.charts.HorizontalBarChart.prototype.init=function(){sap.ca.ui.charts.Chart.prototype.init.apply(this);this.setChartType("Bar")};sap.ca.ui.charts.HorizontalBarChart.prototype.setData=function(t){this._oInternalVizChart.setModel(t)};sap.ca.ui.charts.HorizontalBarChart.prototype.getContainer=function(){return this.getId()};sap.ca.ui.charts.HorizontalBarChart.prototype.setContainer=function(t){jQuery.sap.log.warning("Usage of deprecated feature, please use instead the generated ID : "+this.getId())};sap.ca.ui.charts.HorizontalBarChart.prototype.setBarHeight=function(t){this.setProperty("minShapeSize",t)};sap.ca.ui.charts.HorizontalBarChart.prototype.getBarHeight=function(){return this.getProperty("minShapeSize")};sap.ca.ui.charts.HorizontalBarChart.prototype.setContent=function(t){jQuery.sap.log.warning("Usage of deprecated feature, please use setAggregation('internalContent')")};sap.ca.ui.charts.HorizontalBarChart.prototype.getContent=function(){jQuery.sap.log.warning("Usage of deprecated feature please use getAggregation('internalContent')");return null};sap.ca.ui.charts.HorizontalBarChart.prototype.setScroll=function(t){jQuery.sap.log.warning("Usage of deprecated feature please use setAggregation('internalContent')")};sap.ca.ui.charts.HorizontalBarChart.prototype.getScroll=function(){return this.getAggregation("internalContent")};sap.ca.ui.charts.HorizontalBarChart.prototype.getHorizontalBarChart=function(){return this.getAggregation("internalVizChart")};sap.ca.ui.charts.HorizontalBarChart.prototype.setHorizontalBarChart=function(t){this.setAggregation("internalVizChart",t)};sap.ca.ui.charts.HorizontalBarChart.prototype.getVerticalArea=function(){jQuery.sap.log.warning("Usage of deprecated feature please use getAggregation('internalContent')");return null};sap.ca.ui.charts.HorizontalBarChart.prototype.setVerticalArea=function(t){jQuery.sap.log.warning("Usage of deprecated feature, please use setAggregation('internalContent')")};
//# sourceMappingURL=HorizontalBarChart.js.map