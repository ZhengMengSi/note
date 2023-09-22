/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/strings/capitalize","sap/ui/core/Control","sap/gantt/library","sap/ui/base/ManagedObjectObserver","sap/ui/layout/Splitter","sap/ui/layout/SplitterLayoutData","sap/ui/core/library","../control/AssociateContainer","../config/TimeHorizon","sap/ui/fl/write/api/ControlPersonalizationWriteAPI","sap/m/FlexBox","sap/m/Text","./FindAndSelectUtils","./GanttChartContainerRenderer"],function(t,e,a,n,i,o,r,s,l,h,p,g,u){"use strict";var c=a.simple.GanttChartWithTableDisplayType;var y=r.Orientation;var d=e.extend("sap.gantt.simple.GanttChartContainer",{metadata:{library:"sap.gantt",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},layoutOrientation:{type:"sap.ui.core.Orientation",group:"Behavior",defaultValue:sap.ui.core.Orientation.Vertical},enableTimeScrollSync:{type:"boolean",defaultValue:true},enableCursorLine:{type:"boolean",defaultValue:true},enableNowLine:{type:"boolean",defaultValue:true},enableVerticalLine:{type:"boolean",defaultValue:true},enableAdhocLine:{type:"boolean",defaultValue:true},enableDeltaLine:{type:"boolean",defaultValue:true},enableNonWorkingTime:{type:"boolean",defaultValue:true},displayType:{type:"sap.gantt.simple.GanttChartWithTableDisplayType",defaultValue:c.Both},enableStatusBar:{type:"boolean",defaultValue:false},statusMessage:{type:"string",defaultValue:""},statusBarDatePattern:{type:"string",defaultValue:"EEEE, MMMM d, yyyy"},statusBarTimePattern:{type:"string",defaultValue:"hh:mm:ss a"},hideSettingsItem:{type:"string[]",defaultValue:[]},enableVariantManagement:{type:"boolean",defaultValue:false},_enableRTA:{type:"boolean",defaultValue:false},showSearchSidePanel:{type:"boolean",defaultValue:false},customSearchResults:{type:"array",defaultValue:[]}},defaultAggregation:"ganttCharts",aggregations:{toolbar:{type:"sap.gantt.simple.ContainerToolbar",multiple:false},ganttCharts:{type:"sap.gantt.simple.GanttChartWithTable",multiple:true},statusBar:{type:"sap.m.FlexBox",multiple:false},svgDefs:{type:"sap.gantt.def.SvgDefs",multiple:false},variantHandler:{type:"sap.gantt.simple.CustomVariantHandler",multiple:false},searchSidePanel:{type:"sap.gantt.simple.GanttSearchSidePanel",multiple:false},searchSidePanelList:{type:"sap.tnt.NavigationList",multiple:false}},events:{customSettingChange:{parameters:{name:{type:"string"},value:{type:"boolean"}}},variantApplied:{},ganttSearchSidePanelList:{parameters:{searchResults:{type:"array"}}},customGanttSearchResult:{parameters:{searchResults:{type:"array"}}}},designtime:"sap/gantt/designtime/simple/GanttChartContainer.designtime"}});var f=["enableCursorLine","enableNowLine","enableVerticalLine","enableAdhocLine","enableDeltaLine","enableNonWorkingTime"];var m=["enableTimeScrollSync"].concat(f).concat(["enableStatusBar"]).concat(["showSearchSidePanel"]);var S={zoomLevel:0,displayType:c.Both,enableCursorLine:true,enableNowLine:true,enableVerticalLine:true,enableAdhocLine:true,enableDeltaLine:true,enableTimeScrollSync:true,enableNonWorkingTime:true,enableStatusBar:false};f.forEach(function(e){d.prototype["set"+t(e,0)]=function(t){this.setProperty(e,t);this.getGanttCharts().forEach(function(a){a.setProperty(e,t)});return this}});d.prototype.setSharedPropertiesValueToGantts=function(){f.forEach(function(t){var e=this.getProperty(t);this.getGanttCharts().forEach(function(a){a.setProperty(t,e,true)})}.bind(this))};d.prototype.init=function(){this._bInitHorizonApplied=false;this._nInitialRenderedGantts=0;this._oSplitter=new i({id:this.getId()+"-ganttContainerSplitter",orientation:this.getLayoutOrientation()});this.oObserver=new n(this.observePropertiesChanges.bind(this));this.oObserver.observe(this,{properties:m});this.oStatusBar=new p(this.getId()+"-ganttStatusBar",{renderType:"Bare",alignItems:"Center",justifyContent:"SpaceBetween"}).addStyleClass("sapUiSettingBox");this.setAggregation("statusBar",this.oStatusBar,true);this.createItems().forEach(function(t){this.getStatusBar().addItem(t)}.bind(this))};d.prototype.exit=function(){this.oObserver.disconnect();this._oSplitter.destroy()};d.prototype.setSearchSidePanel=function(t){this.setAggregation("searchSidePanel",t,true);return this};d.prototype.setSearchSidePanelList=function(t){this.setAggregation("searchSidePanelList",t,true);return this};d.prototype.setDisplayType=function(t){this._setDisplayTypeForAll(t);this.setProperty("displayType",t,false);return this};d.prototype.setToolbar=function(t){this.setAggregation("toolbar",t,true);t.attachZoomStopChange(this._onToolbarZoomStopChange,this);t.attachBirdEyeButtonPress(this._onToolbarBirdEyeButtonPress,this);t.attachEvent("_settingsChange",this._onToolbarSettingsChange.bind(this));t.attachEvent("_zoomControlTypeChange",this._onToolbarZoomControlTypeChange.bind(this));t.attachDisplayTypeChange(this._onToolbarDisplayTypeChanged.bind(this),this);t._oDisplayTypeSegmentedButton.setSelectedKey(this.getDisplayType());return this};d.prototype.setVariantHandler=function(t){this.setAggregation("variantHandler",t,true);t.attachSetDataComplete(this.customVariantChange,this)};d.prototype.setLayoutOrientation=function(t){this.setProperty("layoutOrientation",t);this._oSplitter.setOrientation(t);return this};d.prototype.addGanttChart=function(t){this.addAggregation("ganttCharts",t,true);this._insertGanttChart(t)};d.prototype.insertGanttChart=function(t,e){this.insertAggregation("ganttCharts",t,e);this._insertGanttChart(t,e)};d.prototype.removeGanttChart=function(t){this._removeGanttChartFromSplitter(t);var e=this.removeAggregation("ganttCharts",t);if(this.indexOfDependent(e)===-1){this.addDependent(e)}this._adjustSplitterLayoutData();return e};d.prototype.removeAllGanttCharts=function(){var t=this.getGanttCharts();for(var e=0;e<t.length;e++){this._removeGanttChartFromSplitter(t[e])}var a=this.removeAllAggregation("ganttCharts");a.forEach(function(t){if(this.indexOfDependent(t)===-1){this.addDependent(t)}}.bind(this));return a};d.prototype._insertGanttChart=function(t,e){if(!t){return}var a=this._getOtherGanttSelectionPanelSize(t);if(a){t.setProperty("selectionPanelSize",a,"true")}var n=new s({content:t,layoutData:t.getLayoutData()?t.getLayoutData().clone():new o});if(e!==0&&!e){this._oSplitter.addContentArea(n)}else{this._oSplitter.insertContentArea(n,e)}this._sanitizeGanttChartEvents(t);this.setSharedPropertiesValueToGantts();t.setDisplayType(this.getDisplayType())};d.prototype._adjustSplitterLayoutData=function(){var t=this.getGanttCharts();var e=this._oSplitter.getContentAreas();if(t.length===1){e[0].getLayoutData().setSize("auto")}};d.prototype._getOtherGanttSelectionPanelSize=function(t){var e=this.getGanttCharts().filter(function(e){return e.getId()!==t.getId()});return e&&e.length>0?e[0].getSelectionPanelSize():null};d.prototype._sanitizeGanttChartEvents=function(t){var e={_initialRenderGanttChartsSync:this._onInitialRenderGanttChartsSync,_timePeriodZoomOperation:this._onGanttChartTimePeriodZoomOperation,_zoomInfoUpdated:this._onZoomInfoUpdated,_selectionPanelResize:this._onSelectionPanelWidthChange,_layoutDataChange:this._onGanttChartLayoutDataChange};Object.keys(e).forEach(function(a){t.detachEvent(a,e[a],this)}.bind(this));Object.keys(e).forEach(function(a){t.attachEvent(a,e[a],this)}.bind(this))};d.prototype._onGanttChartLayoutDataChange=function(t){var e=t.getSource(),a=e.getLayoutData();this._oSplitter.getContentAreas().forEach(function(t){if(t.getContent()===e.getId()){t.getLayoutData().setSize(a.getSize()).setMinSize(a.getMinSize())}})};d.prototype._onInitialRenderGanttChartsSync=function(t){var e=t.getParameters();var a=this.getGanttCharts();if(e.reasonCode==="initialRender"&&!this.getEnableTimeScrollSync()){return}if(!this.getEnableTimeScrollSync()){if(e.reasonCode==="visibleHorizonUpdated"){for(var n=0;n<a.length;n++){if(t.getSource().getId()===a[n].getId()){continue}a[n].syncVisibleHorizon(e.visibleHorizon,e.visibleWidth,true)}}else{var i;if(e.reasonCode==="mouseWheelZoom"){i="syncMouseWheelZoom"}if(i){for(var o=0;o<a.length;o++){var r=a[o];var s=r;if(t.getSource().getId()===s.getId()){continue}s[i](e)}}}}else{for(var l=0;l<a.length;l++){a[l].syncVisibleHorizon(e.visibleHorizon,e.visibleWidth)}}};d.prototype._onGanttChartTimePeriodZoomOperation=function(t){var e=this.getEnableTimeScrollSync();var a=this.getGanttCharts();for(var n=0;n<a.length;n++){if(t.getSource().getId()===a[n].getId()){continue}var i=this._oSplitter.getOrientation();a[n].syncTimePeriodZoomOperation(t,e,i)}};d.prototype._onSelectionPanelWidthChange=function(t){var e=this.getDisplayType(),a=t.getParameter("displayType");if(e!==a){this.setDisplayType(a);return}if(this.getLayoutOrientation()===y.Horizontal&&e!==c.Both){return}var n=t.getParameter("newWidth");this.getGanttCharts().forEach(function(t){t.setProperty("selectionPanelSize",n+"px",false);t._draw()})};d.prototype._removeGanttChartFromSplitter=function(t){var e=t;if(typeof t==="number"){e=this.getGanttCharts()[t]}if(e){this._oSplitter.removeContentArea(e._oAC)}};d.prototype.onBeforeRendering=function(){this.observePropertiesChanges();this.handleZoomControlTypeToAxistimeStrategy();if(this.getSvgDefs()){this._propogateSvgDefs()}};d.prototype.onAfterRendering=function(){if(this.getEnableStatusBar()){this.msgText.setText(this.getStatusMessage())}if(this._bHideToolbar&&this.getToolbar()){this.getToolbar().addStyleClass("sapToolbarContentHidden")}else if(!this._bHideToolbar&&this.getToolbar()){this.getToolbar().removeStyleClass("sapToolbarContentHidden")}if(this.getToolbar()&&this._bHideVariant&&this.getToolbar()._oVariantManagement){this.getToolbar()._oVariantManagement.addStyleClass("sapToolbarContentHidden")}else if(this.getToolbar()&&!this._bHideVariant&&this.getToolbar()._oVariantManagement){this.getToolbar()._oVariantManagement.removeStyleClass("sapToolbarContentHidden")}};d.prototype._propogateSvgDefs=function(){var t=this.getGanttCharts();t.forEach(function(t){t.setAggregation("svgDefs",this.getSvgDefs(),true)}.bind(this))};d.prototype.handleZoomControlTypeToAxistimeStrategy=function(){if(this.getToolbar()){var t=this.getGanttCharts();var e=this.getToolbar().getZoomControlType();t.forEach(function(t){t.getAxisTimeStrategy()._updateZoomControlType(e)})}};d.prototype._onZoomInfoUpdated=function(t){if(this.getToolbar()){var e=t.getParameter("zoomLevel");if(!isNaN(e)){this.getToolbar().updateZoomLevel(e)}}};d.prototype._addChangesToControlPersonalizationWriteAPI=function(t,e){var a=this.getEnableVariantManagement()||this.getProperty("_enableRTA");if(!t.bPreventDefault&&a){h.add({changes:e})}};d.prototype.updateSearch=function(){this._bPreventShapeScroll=true;if(this.getShowSearchSidePanel()){this.getSearchSidePanel()._oSearchSidePanel.getItems()[1].getContent()[0].fireSearch()}else if(this.getToolbar()&&this.getToolbar()._searchFlexBox&&this.getToolbar()._searchFlexBox.getItems()[0]){this.getToolbar()._searchFlexBox.getItems()[0].fireSearch()}};d.prototype.closeSearchSidePanel=function(){if(this.getShowSearchSidePanel()){this.getSearchSidePanel()._oSearchSidePanel.getItems()[0].getContent()[0].getItems()[2].firePress()}};d.prototype._onToolbarDisplayTypeChanged=function(t){var e=[];e.push({selectorElement:this,changeSpecificData:{changeType:"GanttContainerDisplayType",content:{propertyName:"displayType",newValue:t.getParameter("displayType"),oldValue:S.displayType}}});this.setDisplayType(t.getParameter("displayType"));this._addChangesToControlPersonalizationWriteAPI(t,e)};d.prototype._setDisplayTypeForAll=function(t){var e=this.getToolbar();if(e){e._oDisplayTypeSegmentedButton.setSelectedKey(t)}this.getGanttCharts().forEach(function(e){e.setDisplayType(t)})};d.prototype._onToolbarBirdEyeButtonPress=function(t){var e=this.getGanttCharts();var n;var i;e.forEach(function(t){var e=t._getZoomExtension().calculateBirdEyeRange(null,true);if(e.startTime&&e.endTime){if(!n||e.startTime.getTime()<n.getTime()){n=e.startTime}if(!i||i.getTime()<e.endTime.getTime()){i=e.endTime}}});if(n&&i){var o=new l({startTime:n,endTime:i});e.forEach(function(t){var e=t.getAxisTimeStrategy();if(e.getMouseWheelZoomType()===a.MouseWheelZoomType.Stepwise){e.bBirdEyeTriggered=true}t.syncVisibleHorizon(o)})}};d.prototype._onToolbarZoomStopChange=function(t){var e=this.getGanttCharts();var a=[];e.forEach(function(e){a.push({selectorElement:e.getAxisTimeStrategy(),changeSpecificData:{changeType:"GanttContainerZoomLevel",content:{propertyName:"zoomLevel",newValue:t.getParameter("index"),oldValue:S.zoomLevel}}})});this._addChangesToControlPersonalizationWriteAPI(t,a);e.forEach(function(e){e.getAxisTimeStrategy().updateStopInfo({index:t.getParameter("index"),selectedItem:t.getParameter("selectedItem")})})};d.prototype._onToolbarZoomControlTypeChange=function(t){this._handleZoomControlType(t.getParameter("zoomControlType"));var e=this.getGanttCharts()[0];if(e&&e.isA("sap.gantt.simple.GanttChartWithTable")){S={zoomLevel:e.getAggregation("axisTimeStrategy").getProperty("zoomLevel"),displayType:e.getProperty("displayType"),enableAdhocLine:e.getProperty("enableAdhocLine"),enableCursorLine:e.getProperty("enableCursorLine"),enableDeltaLine:e.getProperty("enableDeltaLine"),enableNowLine:e.getProperty("enableNowLine"),enableVerticalLine:e.getProperty("enableVerticalLine"),enableNonWorkingTime:e.getProperty("enableNonWorkingTime"),enableStatusBar:this.getEnableStatusBar()}}};d.prototype._handleZoomControlType=function(t){var e=this.getGanttCharts();e.forEach(function(e){e.getAxisTimeStrategy()._updateZoomControlType(t)})};d.prototype._onToolbarSettingsChange=function(e){var a=e.getParameters();var n=[],i=[],o="";a.forEach(function(e){if(e.isStandard){var a=e.name.substr(4);if(m.indexOf(a)>=0){this["set"+t(a,0)](e.value);this._bToolbarSettingsItemChanged=true;switch(m.indexOf(a)){case 0:o="GanttContainerEnableTimeScrollSync";break;case 1:o="GanttContainerEnableCursorLine";break;case 2:o="GanttContainerEnableNowLine";break;case 3:o="GanttContainerEnableVerticalLine";break;case 4:o="GanttContainerEnableAdhocLine";break;case 5:o="GanttContainerEnableDeltaLine";break;case 6:o="GanttContainerEnableNonWorkingTime";break;case 7:o="GanttContainerEnableStatusBar";break}i.push({selectorElement:this,changeSpecificData:{changeType:o,content:{propertyName:a,newValue:e.value,oldValue:S[a]}}})}}else{delete e.isStandard;n.push(e)}}.bind(this));if(n.length>0){this.fireCustomSettingChange(n);var r=this.getEnableVariantManagement()||this.getProperty("_enableRTA");if(!r){this.getToolbar().updateCustomSettings(n)}}this._addChangesToControlPersonalizationWriteAPI(e,i)};d.prototype.customVariantChange=function(t){var e=this.getVariantHandler(),a=e.getData(),n=[];a.dependentControls=e.getDependantControlID();n.push({selectorElement:this,changeSpecificData:{changeType:"GanttContainerCustom",content:a}});this._addChangesToControlPersonalizationWriteAPI(t,n)};d.prototype.observePropertiesChanges=function(t){var e;var a=this.getToolbar();if(!t){e=m.reduce(function(t,e){t[e]=this.getProperty(e);return t}.bind(this),{});if(a){var n=a._oSettingsBox.getItems();var i=this.getHideSettingsItem();n.forEach(function(t){var e=i.filter(function(e){return t.getName().endsWith(e)})[0];if(e){t.setVisible(false)}})}}else{e={};e[t.name]=t.current}if(a){var o=!t;a.updateSettingsConfig(e,o)}};d.prototype.createItems=function(){this.msgText=new g(this.getId()+"-ganttStatusBarMsgText",{maxLines:1}).addStyleClass("sapUiSmallMarginEnd").addStyleClass("sapGanttStatusBarText");this.dateTimeText=new g(this.getId()+"-ganttStatusBarDateTimeText",{textAlign:sap.ui.core.TextAlign.Right});return[this.msgText,this.dateTimeText]};d.prototype.updateAxisTimeSettings=function(){this.getGanttCharts().forEach(function(t){t.getAxisTimeStrategy().initialSettings.zoomLevel=t.getAxisTimeStrategy().getZoomLevel()})};d.prototype.setStatusMessage=function(t){this.setProperty("statusMessage",t,true);this.msgText.setProperty("text",t,true);if(this.getEnableStatusBar()){this.oStatusBar.invalidate()}return this};return d},true);
//# sourceMappingURL=GanttChartContainer.js.map