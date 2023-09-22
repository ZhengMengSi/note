/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/DataType","sap/ui/core/theming/Parameters","sap/gantt/config/TimeHorizon","sap/gantt/simple/MarkerType","sap/gantt/simple/LegendShapeGroupOrientation","sap/ui/core/Core","sap/ui/core/library","sap/ui/layout/library","sap/ui/table/library","sap/m/library","sap/ui/export/library","sap/ui/dt/library","sap/ui/fl/library","sap/ui/comp/library"],function(t,e,n,a,i,o){"use strict";var r=o.initLibrary({name:"sap.gantt",dependencies:["sap.ui.core","sap.ui.layout","sap.ui.table","sap.m","sap.ui.export","sap.ui.dt","sap.ui.fl","sap.ui.comp"],designtime:"sap/gantt/designtime/library.designtime",types:["sap.gantt.control.ToolbarType","sap.gantt.SelectionMode","sap.gantt.shape.ShapeCategory","sap.gantt.def.filter.MorphologyOperator","sap.gantt.def.filter.ColorMatrixValue","sap.gantt.shape.ext.rls.RelationshipType","sap.gantt.config.ZoomControlType","sap.gantt.config.BirdEyeRange","sap.gantt.config.FindMode","sap.gantt.GenericArray","sap.gantt.dragdrop.GhostAlignment","sap.gantt.dragdrop.SnapMode","sap.gantt.simple.GanttChartWithTableDisplayType","sap.gantt.simple.ContainerToolbarPlaceholderType","sap.gantt.simple.VisibleHorizonUpdateType","sap.gantt.simple.MarkerType","sap.gantt.simple.LegendShapeGroupOrientation"],interfaces:[],controls:["sap.gantt.control.Toolbar","sap.gantt.GanttChart","sap.gantt.GanttChartBase","sap.gantt.GanttChartWithTable","sap.gantt.GanttChartContainer","sap.gantt.legend.LegendContainer","sap.gantt.legend.ListLegend","sap.gantt.legend.DimensionLegend","sap.gantt.simple.GanttChartWithTable","sap.gantt.simple.ContainerToolbar","sap.gantt.simple.GanttChartContainer","sap.gantt.simple.ContainerToolbarPlaceholder"],elements:["sap.gantt.axistime.ProportionZoomStrategy","sap.gantt.config.TimeHorizon","sap.gantt.config.TimeAxis","sap.gantt.config.ToolbarGroup","sap.gantt.config.Mode","sap.gantt.config.ModeGroup","sap.gantt.config.LayoutGroup","sap.gantt.config.ExpandChart","sap.gantt.config.ExpandChartGroup","sap.gantt.config.TimeZoomGroup","sap.gantt.config.BirdEyeGroup","sap.gantt.config.ToolbarScheme","sap.gantt.config.Hierarchy","sap.gantt.config.HierarchyColumn","sap.gantt.config.ColumnAttribute","sap.gantt.config.GanttChartLayout","sap.gantt.config.ContainerLayout","sap.gantt.config.SettingItem","sap.gantt.config.SettingGroup","sap.gantt.config.ObjectType","sap.gantt.config.ChartScheme","sap.gantt.config.Locale","sap.gantt.config.Shape","sap.gantt.def.SvgDefs","sap.gantt.axistime.AxisTimeStrategyBase","sap.gantt.AdhocLine","sap.gantt.simple.GanttRowSettings","sap.gantt.simple.BaseCalendar","sap.gantt.simple.BaseChevron","sap.gantt.simple.BaseDiamond","sap.gantt.simple.BaseGroup","sap.gantt.simple.BaseImage","sap.gantt.simple.BaseLine","sap.gantt.simple.BasePath","sap.gantt.simple.BaseRectangle","sap.gantt.simple.BaseShape","sap.gantt.simple.BaseText","sap.gantt.simple.BaseCursor","sap.gantt.simple.BaseConditionalShape","sap.gantt.simple.AdhocLine","sap.gantt.simple.DeltaLine","sap.gantt.simple.AdhocDiamond","sap.gantt.simple.BaseTriangle","sap.gantt.simple.LegendShapeGroup","sap.gantt.simple.BaseDeltaRectangle","sap.gantt.simple.MultiActivityGroup","sap.gantt.simple.MultiActivityRowSettings","sap.gantt.simple.UtilizationBarChart","sap.gantt.simple.UtilizationLineChart","sap.gantt.simple.StockChart","sap.gantt.simple.UtilizationChart","sap.gantt.simple.UtilizationDimension","sap.gantt.simple.UtilizationPeriod","sap.gantt.simple.StockChartDimension","sap.gantt.simple.StockChartPeriod","sap.gantt.simple.shapes.Shape","sap.gantt.simple.shapes.Task"],extensions:{flChangeHandlers:{"sap.gantt.simple.GanttChartContainer":"sap/gantt/flexibility/simple/GanttChartContainer","sap.ui.table.Column":"sap/gantt/flexibility/simple/GanttTableColumn","sap.ui.table.TreeTable":"sap/gantt/flexibility/simple/GanttTableColumn","sap.ui.table.Table":"sap/gantt/flexibility/simple/GanttTableColumn","sap.gantt.axistime.ProportionZoomStrategy":"sap/gantt/flexibility/simple/GanttChartContainer","sap.gantt.axistime.StepwiseZoomStrategy":"sap/gantt/flexibility/simple/GanttChartContainer","sap.gantt.axistime.FullScreenStrategy":"sap/gantt/flexibility/simple/GanttChartContainer","sap.gantt.simple.GanttChartWithTable":"sap/gantt/flexibility/simple/GanttChartWithTable","sap.gantt.simple.AdhocLine":"sap/gantt/flexibility/simple/AdhocLine","sap.gantt.simple.DeltaLine":"sap/gantt/flexibility/simple/DeltaLine"}},noLibraryCSS:false,version:"1.108.0"});this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");r.SelectionMode={MultiWithKeyboard:"MultiWithKeyboard",Multiple:"Multiple",MultiWithKeyboardAndLasso:"MultiWithKeyboardAndLasso",MultipleWithLasso:"MultipleWithLasso",Single:"Single",None:"None"};r.AdhocLineLayer={Top:"Top",Bottom:"Bottom"};r.DeltaLineLayer={Top:"Top",Bottom:"Bottom"};r.control.ToolbarType={Global:"GLOBAL",Local:"LOCAL"};r.ValueSVGPaintServer=t.createType("sap.gantt.ValueSVGPaintServer",{isValid:function(t){var e=sap.m.ValueCSSColor.isValid(t);if(!e){e=/(?:url\(['|"]?)(.*?)(?:['|"]?\))|^[@|#](.*?)$|initial|transparent|none|inherit/.test(t)}return e}},t.getType("string"));r.ValueSVGPaintServer.setNormalizer(function(t){var n=sap.m.ValueColor;if(!t){return t}if(t.substr(0,1)==="@"){t=t.substring(1)}var a=e.get(t)||t;switch(a){case n.Critical:return e.get("sapUiChartCritical");case n.Error:return e.get("sapUiChartBad");case n.Good:return e.get("sapUiChartGood");case n.Neutral:return e.get("sapUiChartNeutral");default:return a}});r.SVGLength=t.createType("sap.gantt.SVGLength",{isValid:function(t){if(t==="auto"||t==="inherit"){return true}return/^[-+]?([0-9]*\.?[0-9]+)(em|ex|px|in|cm|mm|pt|pc|%)?$/.test(t)}},t.getType("any"));r.palette={};r.palette.SemanticColors=["sapUiNegativeText","sapUiCriticalText","sapUiPositiveText","sapUiInformativeText","sapUiNeutralText"];r.palette.LegendColors=[];var s;for(s=1;s<=20;s++){r.palette.LegendColors.push("sapUiLegend"+s)}r.palette.AccentColors=[];for(s=1;s<=10;s++){r.palette.AccentColors.push("sapUiAccent"+s)}r.PaletteColor=t.createType("sap.gantt.PaletteColor",{isValid:function(t){var e=String(t);if(e[0].startsWith("@")){e=e.substr(1)}return r.palette.SemanticColors.indexOf(e)>=0||r.palette.LegendColors.indexOf(e)>=0||r.palette.AccentColors.indexOf(e)>=0},parseValue:function(t){var e=String(t);if(e[0].startsWith("@")){e=e.substr(1)}return e}},t.getType("string"));r.shape.ShapeCategory={InRowShape:"InRowShape",Relationship:"relationship"};r.simple.shapes.TaskType={Normal:"Normal",SummaryExpanded:"SummaryExpanded",SummaryCollapsed:"SummaryCollapsed",Error:"Error"};r.simple.shapes.ShapeAlignment={Top:"Top",Middle:"Middle",Bottom:"Bottom"};r.def.filter.MorphologyOperator={Dilate:"dilate",Erode:"erode"};r.def.filter.ColorMatrixValue={AllToWhite:"-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0",AllToBlack:"-1 0 0 0 0, 0 -1 0 0 0, 0 0 -1 0 0, 0 0 0 1 0"};r.shape.ext.rls.RelationshipType={FinishToFinish:0,FinishToStart:1,StartToFinish:2,StartToStart:3};r.simple.connectorType={Arrow:"Arrow",Square:"Square",Circle:"Circle",Diamond:"Diamond",HorizontalRectangle:"HorizontalRectangle",VerticalRectangle:"VerticalRectangle",None:"None"};r.simple.findByOperator={AND:"AND",OR:"OR"};r.simple.relationshipShapeSize={Small:"Small",Medium:"Medium",Large:"Large"};r.simple.RelationshipType={FinishToFinish:"FinishToFinish",FinishToStart:"FinishToStart",StartToFinish:"StartToFinish",StartToStart:"StartToStart"};r.config.ZoomControlType={SliderWithButtons:"SliderWithButtons",SliderOnly:"SliderOnly",ButtonsOnly:"ButtonsOnly",Select:"Select",None:"None"};r.config.BirdEyeRange={AllRows:"AllRows",VisibleRows:"VisibleRows"};r.config.FindMode={Toolbar:"Toolbar",SidePanel:"SidePanel",Both:"Both"};r.config.TimeUnit={minute:"d3.time.minute",hour:"d3.time.hour",day:"d3.time.day",week:"d3.time.week",month:"d3.time.month",year:"d3.time.year"};r.config.WeekFirstDay={ad:"d3.time.monday",ae:"d3.time.saturday",af:"d3.time.saturday",ag:"d3.time.sunday",ai:"d3.time.monday",al:"d3.time.monday",am:"d3.time.monday",an:"d3.time.monday",ar:"d3.time.sunday",as:"d3.time.sunday",at:"d3.time.monday",au:"d3.time.sunday",ax:"d3.time.monday",az:"d3.time.monday",ba:"d3.time.monday",bd:"d3.time.friday",be:"d3.time.monday",bg:"d3.time.monday",bh:"d3.time.saturday",bm:"d3.time.monday",bn:"d3.time.monday",br:"d3.time.sunday",bs:"d3.time.sunday",bt:"d3.time.sunday",bw:"d3.time.sunday",by:"d3.time.monday",bz:"d3.time.sunday",ca:"d3.time.sunday",ch:"d3.time.monday",cl:"d3.time.monday",cm:"d3.time.monday",cn:"d3.time.sunday",co:"d3.time.sunday",cr:"d3.time.monday",cy:"d3.time.monday",cz:"d3.time.monday",de:"d3.time.monday",dj:"d3.time.saturday",dk:"d3.time.monday",dm:"d3.time.sunday",do:"d3.time.sunday",dz:"d3.time.saturday",ec:"d3.time.monday",ee:"d3.time.monday",eg:"d3.time.saturday",es:"d3.time.monday",et:"d3.time.sunday",fi:"d3.time.monday",fj:"d3.time.monday",fo:"d3.time.monday",fr:"d3.time.monday",gb:"d3.time.monday","gb-alt-variant":"d3.time.sunday",ge:"d3.time.monday",gf:"d3.time.monday",gp:"d3.time.monday",gr:"d3.time.monday",gt:"d3.time.sunday",gu:"d3.time.sunday",hk:"d3.time.sunday",hn:"d3.time.sunday",hr:"d3.time.monday",hu:"d3.time.monday",id:"d3.time.sunday",ie:"d3.time.sunday",il:"d3.time.sunday",in:"d3.time.sunday",iq:"d3.time.saturday",ir:"d3.time.saturday",is:"d3.time.monday",it:"d3.time.monday",jm:"d3.time.sunday",jo:"d3.time.saturday",jp:"d3.time.sunday",ke:"d3.time.sunday",kg:"d3.time.monday",kh:"d3.time.sunday",kr:"d3.time.sunday",kw:"d3.time.saturday",kz:"d3.time.monday",la:"d3.time.sunday",lb:"d3.time.monday",li:"d3.time.monday",lk:"d3.time.monday",lt:"d3.time.monday",lu:"d3.time.monday",lv:"d3.time.monday",ly:"d3.time.saturday",ma:"d3.time.saturday",mc:"d3.time.monday",md:"d3.time.monday",me:"d3.time.monday",mh:"d3.time.sunday",mk:"d3.time.monday",mm:"d3.time.sunday",mn:"d3.time.monday",mo:"d3.time.sunday",mq:"d3.time.monday",mt:"d3.time.sunday",mv:"d3.time.friday",mx:"d3.time.sunday",my:"d3.time.monday",mz:"d3.time.sunday",ni:"d3.time.sunday",nl:"d3.time.monday",no:"d3.time.monday",np:"d3.time.sunday",nz:"d3.time.monday",om:"d3.time.saturday",pa:"d3.time.sunday",pe:"d3.time.sunday",ph:"d3.time.sunday",pk:"d3.time.sunday",pl:"d3.time.monday",pr:"d3.time.sunday",pt:"d3.time.monday",py:"d3.time.sunday",qa:"d3.time.saturday",re:"d3.time.monday",ro:"d3.time.monday",rs:"d3.time.monday",ru:"d3.time.monday",sa:"d3.time.sunday",sd:"d3.time.saturday",se:"d3.time.monday",sg:"d3.time.sunday",si:"d3.time.monday",sk:"d3.time.monday",sm:"d3.time.monday",sv:"d3.time.sunday",sy:"d3.time.saturday",th:"d3.time.sunday",tj:"d3.time.monday",tm:"d3.time.monday",tn:"d3.time.sunday",tr:"d3.time.monday",tt:"d3.time.sunday",tw:"d3.time.sunday",ua:"d3.time.monday",um:"d3.time.sunday",us:"d3.time.sunday",uy:"d3.time.monday",uz:"d3.time.monday",va:"d3.time.monday",ve:"d3.time.sunday",vi:"d3.time.sunday",vn:"d3.time.monday",ws:"d3.time.sunday",xk:"d3.time.monday",ye:"d3.time.sunday",za:"d3.time.sunday",zw:"d3.time.sunday"};r.config.DEFAULT_PLAN_HORIZON=new n({startTime:new Date((new Date).getTime()-31536e6),endTime:new Date((new Date).getTime()+31536e6)});r.config.DEFAULT_PLAN_HORIZON.destroy=function(){};r.config.DEFAULT_INIT_HORIZON=new n({startTime:new Date((new Date).getTime()-2628e6),endTime:new Date((new Date).getTime()+2628e6)});r.config.DEFAULT_INIT_HORIZON.destroy=function(){};var m=sap.ui.getCore().getConfiguration().getRTL()?".M.d":"d.M.";var T=sap.ui.getCore().getConfiguration().getFormatSettings().getDatePattern("short");r.config.DEFAULT_DATE_PATTERN=T?T:"EEEE, MMM d, yy";var g=sap.ui.getCore().getConfiguration().getFormatSettings().getTimePattern("short");r.config.DEFAULT_TIME_PATTERN=g?g:"HH:mm";var l=sap.ui.getCore().getConfiguration().getFormatSettings().getLegacyTimeFormat();r.config.TIME_PATTERN_LOWERCASE=l==="2"||l==="4"?true:false;r.config.DEFAULT_TIME_ZOOM_STRATEGY={"1min":{innerInterval:{unit:r.config.TimeUnit.minute,span:1,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.minute,span:1,pattern:r.config.DEFAULT_TIME_PATTERN}},"5min":{innerInterval:{unit:r.config.TimeUnit.minute,span:5,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.minute,span:5,pattern:r.config.DEFAULT_TIME_PATTERN}},"10min":{innerInterval:{unit:r.config.TimeUnit.minute,span:10,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.minute,span:10,pattern:r.config.DEFAULT_TIME_PATTERN}},"15min":{innerInterval:{unit:r.config.TimeUnit.minute,span:15,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.minute,span:15,pattern:r.config.DEFAULT_TIME_PATTERN}},"30min":{innerInterval:{unit:r.config.TimeUnit.minute,span:30,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.minute,span:30,pattern:r.config.DEFAULT_TIME_PATTERN}},"1hour":{innerInterval:{unit:r.config.TimeUnit.hour,span:1,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.hour,span:1,pattern:r.config.DEFAULT_TIME_PATTERN}},"2hour":{innerInterval:{unit:r.config.TimeUnit.hour,span:2,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.hour,span:2,pattern:r.config.DEFAULT_TIME_PATTERN}},"4hour":{innerInterval:{unit:r.config.TimeUnit.hour,span:4,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.hour,span:4,pattern:r.config.DEFAULT_TIME_PATTERN}},"6hour":{innerInterval:{unit:r.config.TimeUnit.hour,span:6,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.hour,span:6,pattern:r.config.DEFAULT_TIME_PATTERN}},"12hour":{innerInterval:{unit:r.config.TimeUnit.hour,span:12,range:90},largeInterval:{unit:r.config.TimeUnit.day,span:1,pattern:r.config.DEFAULT_DATE_PATTERN},smallInterval:{unit:r.config.TimeUnit.hour,span:12,pattern:r.config.DEFAULT_TIME_PATTERN}},"1day":{innerInterval:{unit:r.config.TimeUnit.day,span:1,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:1,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.day,span:1,pattern:m}},"2day":{innerInterval:{unit:r.config.TimeUnit.day,span:2,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:1,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.day,span:2,pattern:m}},"4day":{innerInterval:{unit:r.config.TimeUnit.day,span:4,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:1,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.day,span:4,pattern:m}},"1week":{innerInterval:{unit:r.config.TimeUnit.week,span:1,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:1,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.week,span:1,pattern:m}},"2week":{innerInterval:{unit:r.config.TimeUnit.week,span:2,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:1,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.week,span:2,pattern:m}},"1month":{innerInterval:{unit:r.config.TimeUnit.month,span:1,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:6,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.month,span:1,pattern:m}},"2month":{innerInterval:{unit:r.config.TimeUnit.month,span:2,range:90},largeInterval:{unit:r.config.TimeUnit.month,span:6,format:"yyyyMMMM"},smallInterval:{unit:r.config.TimeUnit.month,span:2,pattern:m}},"4month":{innerInterval:{unit:r.config.TimeUnit.month,span:4,range:90},largeInterval:{unit:r.config.TimeUnit.year,span:1,format:"yyyy"},smallInterval:{unit:r.config.TimeUnit.month,span:4,pattern:"LLLL"}},"6month":{innerInterval:{unit:r.config.TimeUnit.month,span:6,range:90},largeInterval:{unit:r.config.TimeUnit.year,span:1,format:"yyyy"},smallInterval:{unit:r.config.TimeUnit.month,span:6,pattern:"LLLL"}},"1year":{innerInterval:{unit:r.config.TimeUnit.year,span:1,range:90},largeInterval:{unit:r.config.TimeUnit.year,span:1,format:"yyyy"},smallInterval:{unit:r.config.TimeUnit.year,span:1,pattern:"LLLL"}},"2year":{innerInterval:{unit:r.config.TimeUnit.year,span:2,range:90},largeInterval:{unit:r.config.TimeUnit.year,span:2,format:"yyyy"},smallInterval:{unit:r.config.TimeUnit.year,span:2,pattern:"LLLL"}},"5year":{innerInterval:{unit:r.config.TimeUnit.year,span:5,range:90},largeInterval:{unit:r.config.TimeUnit.year,span:5,format:"yyyy"},smallInterval:{unit:r.config.TimeUnit.year,span:5,pattern:"LLLL"}}};var p;Object.defineProperty(r.config,"DEFAULT_TIME_AXIS",{get:function(){if(p){return p}p=new sap.gantt.axistime.AxisTimeStrategyBase;return p},set:function(t){p=t}});r.config.DEFAULT_MODE_KEY="sap_mode";r.config.DEFAULT_MODE=new sap.gantt.config.Mode({key:r.config.DEFAULT_MODE_KEY,text:this._oRb.getText("TLTP_DEFAULT"),icon:"sap-icon://status-positive"});r.config.DEFAULT_MODES=[r.config.DEFAULT_MODE];r.config.DEFAULT_CHART_SCHEME_KEY="sap_main";r.config.DEFAULT_CHART_SCHEME=new sap.gantt.config.ChartScheme({key:r.config.DEFAULT_CHART_SCHEME_KEY,name:"Default",rowSpan:1});r.config.DEFAULT_CHART_SCHEMES=[r.config.DEFAULT_CHART_SCHEME];r.config.DEFAULT_OBJECT_TYPE_KEY="sap_object";r.config.DEFAULT_OBJECT_TYPE=new sap.gantt.config.ObjectType({key:r.config.DEFAULT_OBJECT_TYPE_KEY,description:"Default",mainChartSchemeKey:r.config.DEFAULT_CHART_SCHEME_KEY});r.config.DEFAULT_OBJECT_TYPES=[r.config.DEFAULT_OBJECT_TYPE];r.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY="sap_enableNowLine";r.config.SETTING_ITEM_ENABLE_NOW_LINE=new sap.gantt.config.SettingItem({id:"enableNowLineSettingItem",key:r.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_NOW_LINE"),tooltip:this._oRb.getText("TLTP_NOW_LINE")});r.config.SETTING_ITEM_ENABLE_STATUS_BAR_KEY="sap_enableStatusBar";r.config.SETTING_ITEM_ENABLE_STATUS_BAR=new sap.gantt.config.SettingItem({id:"enableStatusBarSettingItem",key:r.config.SETTING_ITEM_ENABLE_STATUS_BAR_KEY,checked:false,_isStandard:true,displayText:this._oRb.getText("XCKL_STATUS_BAR"),tooltip:this._oRb.getText("XCKL_STATUS_BAR")});r.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY="sap_enableCursorLine";r.config.SETTING_ITEM_ENABLE_CURSOR_LINE=new sap.gantt.config.SettingItem({id:"enableCurserLineSettingItem",key:r.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_CURSOR_LINE"),tooltip:this._oRb.getText("TLTP_CURSOR_LINE")});r.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY="sap_enableVerticalLine";r.config.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY="sap_enableAdhocLine";r.config.SETTING_ITEM_ENABLE_DELTA_LINE_KEY="sap_enableDeltaLine";r.config.SETTING_ITEM_ENABLE_NON_WORKING_TIME_KEY="sap_enableNonWorkingTime";r.config.SETTING_ITEM_ENABLE_VERTICAL_LINE=new sap.gantt.config.SettingItem({id:"enableVerticalLineSettingItem",key:r.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_VERTICAL_LINE"),tooltip:this._oRb.getText("TLTP_VERTICAL_LINE")});r.config.SETTING_ITEM_ENABLE_ADHOC_LINE=new sap.gantt.config.SettingItem({id:"enableAdhocLineSettingItem",key:r.config.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_ADHOC_LINE"),tooltip:this._oRb.getText("TLTP_ADHOC_LINE")});r.config.SETTING_ITEM_ENABLE_DELTA_LINE=new sap.gantt.config.SettingItem({id:"enableDeltaLineSettingItem",key:r.config.SETTING_ITEM_ENABLE_DELTA_LINE_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_DELTA_LINE"),tooltip:this._oRb.getText("TLTP_DELTA_LINE")});r.config.SETTING_ITEM_ENABLE_NON_WORKING_TIME=new sap.gantt.config.SettingItem({id:"enableNonWorkingTimeSettingItem",key:r.config.SETTING_ITEM_ENABLE_NON_WORKING_TIME_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_NON_WORKING_TIME"),tooltip:this._oRb.getText("XCKL_NON_WORKING_TIME")});r.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY="sap_enableTimeScrollSync";r.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC=new sap.gantt.config.SettingItem({id:"enableTimeScrollSyncSettingItem",key:r.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY,checked:true,_isStandard:true,displayText:this._oRb.getText("XCKL_TIME_SCROLL_SYNC"),tooltip:this._oRb.getText("TLTP_TIME_SCROLL_SYNC")});r.config.DEFAULT_TOOLBAR_SETTING_ITEMS=[r.config.SETTING_ITEM_ENABLE_NOW_LINE,r.config.SETTING_ITEM_ENABLE_CURSOR_LINE,r.config.SETTING_ITEM_ENABLE_VERTICAL_LINE,r.config.SETTING_ITEM_ENABLE_ADHOC_LINE,r.config.SETTING_ITEM_ENABLE_DELTA_LINE,r.config.SETTING_ITEM_ENABLE_NON_WORKING_TIME,r.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC,r.config.SETTING_ITEM_ENABLE_STATUS_BAR];r.config.EMPTY_TOOLBAR_SCHEME_KEY="sap_empty_toolbar";r.config.EMPTY_TOOLBAR_SCHEME=new sap.gantt.config.ToolbarScheme({key:r.config.EMPTY_TOOLBAR_SCHEME_KEY,customToolbarItems:new sap.gantt.config.ToolbarGroup({position:"L1",overflowPriority:sap.m.OverflowToolbarPriority.High})});r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY="sap_container_toolbar";r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME=new sap.gantt.config.ToolbarScheme({key:r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY,customToolbarItems:new sap.gantt.config.ToolbarGroup({position:"L1",overflowPriority:sap.m.OverflowToolbarPriority.High}),timeZoom:new sap.gantt.config.TimeZoomGroup({position:"R2",overflowPriority:sap.m.OverflowToolbarPriority.NeverOverflow}),settings:new sap.gantt.config.SettingGroup({position:"R1",overflowPriority:sap.m.OverflowToolbarPriority.Low,items:r.config.DEFAULT_TOOLBAR_SETTING_ITEMS})});r.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY="sap_ganttchart_toolbar";r.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME=new sap.gantt.config.ToolbarScheme({key:r.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY,customToolbarItems:new sap.gantt.config.ToolbarGroup({position:"L2",overflowPriority:sap.m.OverflowToolbarPriority.High}),expandTree:new sap.gantt.config.ToolbarGroup({position:"L3",overflowPriority:sap.m.OverflowToolbarPriority.Low})});r.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEMES=[r.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME,r.config.EMPTY_TOOLBAR_SCHEME];r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEMES=[r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME,r.config.EMPTY_TOOLBAR_SCHEME];r.config.DEFAULT_HIERARCHY_KEY="sap_hierarchy";r.config.DEFAULT_HIERARCHY=new sap.gantt.config.Hierarchy;r.config.DEFAULT_HIERARCHYS=[r.config.DEFAULT_HIERARCHY];r.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY="sap_container_layout_single";r.config.DEFAULT_CONTAINER_SINGLE_LAYOUT=new sap.gantt.config.ContainerLayout({key:r.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY,text:this._oRb.getText("XLST_SINGLE_LAYOUT"),toolbarSchemeKey:r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY,ganttChartLayouts:[new sap.gantt.config.GanttChartLayout({activeModeKey:r.config.DEFAULT_MODE_KEY,hierarchyKey:r.config.DEFAULT_HIERARCHY_KEY})]});r.config.DEFAULT_CONTAINER_DUAL_LAYOUT_KEY="sap_container_layout_dual";r.config.DEFAULT_CONTAINER_DUAL_LAYOUT=new sap.gantt.config.ContainerLayout({key:r.config.DEFAULT_CONTAINER_DUAL_LAYOUT_KEY,text:this._oRb.getText("XLST_DUAL_LAYOUT"),toolbarSchemeKey:r.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY,ganttChartLayouts:[new sap.gantt.config.GanttChartLayout({activeModeKey:r.config.DEFAULT_MODE_KEY,hierarchyKey:r.config.DEFAULT_HIERARCHY_KEY}),new sap.gantt.config.GanttChartLayout({activeModeKey:r.config.DEFAULT_MODE_KEY,hierarchyKey:r.config.DEFAULT_HIERARCHY_KEY})]});r.config.DEFAULT_CONTAINER_LAYOUTS=[r.config.DEFAULT_CONTAINER_SINGLE_LAYOUT,r.config.DEFAULT_CONTAINER_DUAL_LAYOUT];r.config.DEFAULT_LOCALE_CET=new sap.gantt.config.Locale({timeZone:"CET",utcdiff:"000000",utcsign:"+"});r.config.DEFAULT_EMPTY_OBJECT={};r.DIMENSION_LEGEND_NIL="NIL";r.MouseWheelZoomType={FineGranular:"FineGranular",Stepwise:"Stepwise",None:"None"};r.GenericArray=t.createType("sap.gantt.GenericArray",{isValid:function(t){if(typeof t==="string"||t instanceof String){return true}if(Array.isArray(t)){for(var e=0;e<t.length;e++){if(!(typeof t[e]==="string"||t[e]instanceof String||typeof t[e]==="object")){return false}}return true}return false},parseValue:function(t){if(t){if(Array.isArray(t)){return t}else if(typeof t==="string"){var e;if(t.indexOf("[")>-1&&t.indexOf("{")>-1){t=t.replace(/\'/g,'"');e=JSON.parse(t)}else{if(t.indexOf("[")>-1){var n=/^\[(.*)\]$/g;var a=n.exec(t);if(a){t=a[1]}}e=t.split(",");for(var i=0;i<e.length;i++){e[i]=e[i].trim()}}return e}}return t}},t.getType("any"));r.dragdrop.GhostAlignment={Start:"Start",None:"None",End:"End"};r.dragdrop.SnapMode={Left:"Left",Right:"Right",Both:"Both",None:"None"};r.simple.GanttChartWithTableDisplayType={Both:"Both",Chart:"Chart",Table:"Table"};r.simple.ContainerToolbarPlaceholderType={VariantManagement:"VariantManagement",BirdEyeButton:"BirdEyeButton",DisplayTypeButton:"DisplayTypeButton",LegendButton:"LegendButton",SettingButton:"SettingButton",Spacer:"Spacer",TimeZoomControl:"TimeZoomControl"};r.DragOrientation={Horizontal:"Horizontal",Vertical:"Vertical",Free:"Free"};r.simple.VisibleHorizonUpdateType={HorizontalScroll:"HorizontalScroll",InitialRender:"InitialRender",MouseWheelZoom:"MouseWheelZoom",SyncVisibleHorizon:"SyncVisibleHorizon",TimePeriodZooming:"TimePeriodZooming",TotalHorizonUpdated:"TotalHorizonUpdated",ZoomLevelChanged:"ZoomLevelChanged"};r.simple.VisibleHorizonUpdateSubType={ZoomIn:"ZoomIn",ZoomOut:"ZoomOut",NotApplicable:"NotApplicable"};r.simple.exportTableCustomDataType={Numeric:"numeric",DateTime:"dateTime",StringDate:"stringDate",Date:"date",Time:"time",Boolean:"boolean",String:"string",Currency:"currency"};r.simple.horizontalTextAlignment={Start:"Start",End:"End",Middle:"Middle",Dynamic:"Dynamic"};r.simple.verticalTextAlignment={Top:"Top",Bottom:"Bottom",Center:"Center"};r.simple.yAxisColumnContent={ThresholdwithLabelandUOM:"ThresholdwithLabelandUOM",ThresholdwithUOM:"ThresholdwithUOM",ThresholdwithLabel:"ThresholdwithLabel",OnlyThreshold:"OnlyThreshold"};r.simple.MarkerType=a;r.simple.LegendShapeGroupOrientation=i;return r});
//# sourceMappingURL=library.js.map