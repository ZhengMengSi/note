/*
 * !SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Item",'sap/ui/base/SyncPromise',"sap/ui/mdc/library"],function(I,S,M){"use strict";var a;var _={axis1:true,axis2:true,axis3:true};var b=I.extend("sap.ui.mdc.chart.MeasureItem",{metadata:{"abstract":true,library:"sap.ui.mdc",properties:{propertyPath:{type:"string"},role:{type:"string",defaultValue:"axis1"},dataPoint:{type:"object"},aggregationMethod:{type:"string",defaultValue:undefined}}}});b.prototype.getCriticality=function(){var d=this.getDataPoint();return d?d.criticality:null;};b.prototype.setDataPoint=function(v){if(!this.isPropertyInitial("dataPoint")){throw new Error("Data point is readonly");}return this.setProperty("dataPoint",v);};b.createVizChartItem=function(s){return new S(function(r){var v;if(a){v=new a(s);r(v);}else{sap.ui.require(["sap/chart/data/Measure"],function(c){a=c;v=new a(s);r(v);});}});};b.getVizItemSettings=function(m){var s={label:m.label,role:m.role||"axis1",name:m.key};var A=m.aggregationMethod;if(A){s.analyticalInfo={"with":A,propertyPath:m.propertyPath};}return s;};b.prototype.getSettings=function(m){if(m&&m.key==this.getKey()){m.label=this.getLabel()||m.label;m.role=this.getRole();}else{m={key:this.getKey(),label:this.getLabel(),role:this.getRole(),propertyPath:this.getPropertyPath(),aggregationMethod:this.getAggregationMethod(),dataPoint:this.getDataPoint()};}return b.getVizItemSettings(m);};b.prototype.toChart=function(c){return new S(function(r){var v=c.getMeasureByName(this.getKey());if(v){var o=v.getRole();v.setRole(this.getRole());if(this._observer){this._observer.propertyChange(this,"role",o,this.getRole());}}else{this.toVizChartItem().then(function(i){c.addMeasure(i,true);if(this._observer){this._observer.propertyChange(this,"role",null,this.getRole());}}.bind(this));}}.bind(this));};b.prototype.toVizChartItem=function(m){if(!this._pToVizItem){this._pToVizItem=new S(function(r){m=m||{};b.createVizChartItem(this.getSettings(m)).then(function(v){r(v);});}.bind(this));}return this._pToVizItem;};b.prototype.setRole=function(r){if(!_[r]){jQuery.error("Invalide Measure role: "+r);}this.setProperty("role",r,true);var c=this.getParent();if(c){c.oChartPromise.then(function(v){this.toChart(v);}.bind(this));}return this;};b.prototype.getVizItemType=function(){return M.ChartItemType.Measure;};b.prototype.getAdditionalColoringMeasures=function(){var A=[];var c=this.getCriticality();if(c&&c.DynamicThresholds){A=c.DynamicThresholds.usedMeasures;}return A;};return b;},true);