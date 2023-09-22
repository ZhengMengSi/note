// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/suite/ui/microchart/ComparisonMicroChart'],function(H){"use strict";sap.ui.core.Control.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetBarChart',{metadata:{properties:{lastUpdated:{type:"string"},aItems:{type:"object"}},aggregations:{'items':{type:'sap.suite.ui.microchart.ComparisonMicroChartData',multiple:true}}},constructor:function(o){var t=this;t.options=o;sap.ui.core.Control.prototype.constructor.apply(this);this.bindAggregation('items','items',function(){var c=new sap.suite.ui.microchart.ComparisonMicroChartData({title:'{label}',value:'{value}',color:{path:'selected',formatter:function(v){var r=sap.m.ValueColor.Good;if(!v){r=sap.m.ValueColor.Neutral;}return r;}},displayValue:'{valueLabel}',press:function(e){var a=e.getSource().getBindingContext();var m=a.getModel();var d=a.getObject();var i=d.selected;var f=d.filterCondition;if(i){if(t.options.oSearchFacetDialog){t.options.oSearchFacetDialog.onDetailPageSelectionChangeCharts(e);}else{m.removeFilterCondition(f,true);}}else if(t.options.oSearchFacetDialog){t.options.oSearchFacetDialog.onDetailPageSelectionChangeCharts(e);}else{m.addFilterCondition(f,true);}}});return c;});},renderer:function(r,c){r.write('<div');r.writeControlData(c);r.writeClasses();r.write('>');var C=new sap.suite.ui.microchart.ComparisonMicroChart({width:"90%",colorPalette:"",press:function(e){},tooltip:"",shrinkable:true});if(c.options.oSearchFacetDialog){C.setWidth("95%");C.addStyleClass("sapUshellSearchFacetBarChartLarge");}else{C.addStyleClass("sapUshellSearchFacetBarChart");}C.addEventDelegate({onAfterRendering:function(e){$('#'+this.sId).has('.Good').addClass("sapUshellSearchFacetBarChartSelected");}});var a=c.getItems();var b=c.getAItems();if(a.length===0&&b){a=b;}var m=0;for(var i=0;i<a.length;++i){var d=a[i];if(!c.options.oSearchFacetDialog){if(d.mProperties&&d.mProperties.value){C.addData(d);}else if(d.mProperties&&!d.mProperties.value){m++;}}else{C.addData(d);}}c.iMissingCnt=m;r.renderControl(C);r.write('</div>');},onAfterRendering:function(){var t=this;var a=$(this.getDomRef()).closest(".sapUshellSearchFacetIconTabBar").find(".sapUshellSearchFacetInfoZeile")[0];var I=sap.ui.getCore().byId(a.id);if(t.iMissingCnt>0){I.setVisible(true);var m=sap.ushell.resources.i18n.getText("infoZeileNumberMoreSelected",[t.iMissingCnt]);I.setText(m);I.rerender();}else{I.setVisible(false);}var A=$(".sapSuiteUiMicroChartPointer");for(var i=0;i<A.length;i++){var b=A[i];var s=b.title;if(s&&s.indexOf(":")===-1){b.title=s.replace(/( \d+) *$/,':$1');}}},setEshRole:function(){}});});