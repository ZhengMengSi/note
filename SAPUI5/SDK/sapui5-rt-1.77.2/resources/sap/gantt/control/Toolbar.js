/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/CustomData","sap/ui/base/ManagedObjectMetadata","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/m/ToolbarSpacer","sap/m/FlexBox","sap/m/library","sap/m/Button","sap/m/SegmentedButton","sap/m/Select","sap/m/MenuButton","sap/m/Menu","sap/m/MenuItem","sap/ui/core/Item","sap/m/ViewSettingsDialog","sap/m/ViewSettingsCustomTab","sap/m/CheckBox","sap/ui/core/library","sap/m/Slider","sap/m/Popover"],function(l,C,a,b,M,O,c,T,F,d,B,S,e,f,g,h,j,V,k,n,o,p,P){"use strict";var L=l.config,q=l.control;var r=o.Orientation;var s=d.FlexDirection;var t=d.PlacementType;var u=C.extend("sap.gantt.control.Toolbar",{metadata:{properties:{width:{type:"CSSSize",defaultValue:"100%"},height:{type:"CSSSize",defaultValue:"100%"},type:{type:"string",defaultValue:q.ToolbarType.Global},sourceId:{type:"string"},zoomLevel:{type:"int",defaultValue:0},enableTimeScrollSync:{type:"boolean",defaultValue:true},enableCursorLine:{type:"boolean",defaultValue:true},enableNowLine:{type:"boolean",defaultValue:true},enableVerticalLine:{type:"boolean",defaultValue:true},enableAdhocLine:{type:"boolean",defaultValue:true},modes:{type:"object[]",defaultValue:[L.DEFAULT_MODE]},mode:{type:"string",defaultValue:L.DEFAULT_MODE_KEY},toolbarSchemes:{type:"object[]",defaultValue:[L.DEFAULT_CONTAINER_TOOLBAR_SCHEME,L.DEFAULT_GANTTCHART_TOOLBAR_SCHEME,L.EMPTY_TOOLBAR_SCHEME]},hierarchies:{type:"object[]",defaultValue:[L.DEFAULT_HIERARCHY]},containerLayouts:{type:"object[]",defaultValue:[L.DEFAULT_CONTAINER_SINGLE_LAYOUT,L.DEFAULT_CONTAINER_DUAL_LAYOUT]}},aggregations:{legend:{type:"sap.ui.core.Control",multiple:false,visibility:"public"},customToolbarItems:{type:"sap.ui.core.Control",multiple:true,visibility:"public",singularName:"customToolbarItem"},_toolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"}},events:{sourceChange:{parameters:{id:{type:"string"}}},layoutChange:{parameters:{id:{type:"string"},value:{type:"string"}}},expandChartChange:{parameters:{action:{type:"string"},expandedChartSchemes:{type:"any[]"}}},expandTreeChange:{parameters:{action:{type:"string"}}},zoomStopChange:{parameters:{index:{type:"int"},selectedItem:{type:"sap.ui.core.Item"}}},settingsChange:{parameters:{id:{type:"string"},value:{type:"boolean"}}},modeChange:{parameters:{mode:{type:"string"}}},birdEye:{parameters:{birdEyeRange:{type:"string"}}}}}});u.ToolbarItemPosition={Left:"Left",Right:"Right"};u.prototype.init=function(){this._oToolbar=new O({width:"auto",design:sap.m.ToolbarDesign.Auto});this.setAggregation("_toolbar",this._oToolbar,true);this._bClearCustomItems=true;this._resetToolbarInfo();this._oModesConfigMap={};this._oModesConfigMap[L.DEFAULT_MODE_KEY]=L.DEFAULT_MODE;this._oToolbarSchemeConfigMap={};this._oToolbarSchemeConfigMap[L.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY]=L.DEFAULT_CONTAINER_TOOLBAR_SCHEME;this._oToolbarSchemeConfigMap[L.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY]=L.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;this._oToolbarSchemeConfigMap[L.EMPTY_TOOLBAR_SCHEME_KEY]=L.EMPTY_TOOLBAR_SCHEME;this._oHierarchyConfigMap={};this._oHierarchyConfigMap[L.DEFAULT_HIERARCHY_KEY]=L.DEFAULT_HIERARCHY;this._oContainerLayoutConfigMap={};this._oContainerLayoutConfigMap[L.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY]=L.DEFAULT_CONTAINER_SINGLE_LAYOUT;this._oContainerLayoutConfigMap[L.DEFAULT_CONTAINER_DUAL_LAYOUT_KEY]=L.DEFAULT_CONTAINER_DUAL_LAYOUT;this._oZoomSlider=null;this._oSelect=null;this._iLiveChangeTimer=-1;this._aTimers=[];this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this._nCounterOfDefaultSliders=0;this._sZoomControlType=L.ZoomControlType.SliderWithButtons;};u.prototype._resetToolbarInfo=function(){this._oItemConfiguration={Left:[],Right:[]};this._oAllItems={Left:[],Right:[]};if(this._bClearCustomItems){this._aCustomItems=[];this._iCustomItemInsertIndex=-1;}};u.prototype.applySettings=function(m,i){if(this.getSourceId()&&this.getType()){this._resetAllCompositeControls();}var R=C.prototype.applySettings.apply(this,arguments);return R;};u.prototype.onAfterRendering=function(){if(this._oVHButton&&jQuery("#"+this._oVHButton.getId())[0]){jQuery("#"+this._oVHButton.getId()).attr("aria-label",this._oRb.getText("TLTP_SWITCH_GANTTCHART"));}};u.prototype.setLegend=function(i){this.setAggregation("legend",i);if(!this._oLegendPop){this._oLegendPop=new P({placement:t.Bottom,showArrow:false,showHeader:false});}if(i){this._oLegendPop.removeAllContent();this._oLegendPop.addContent(i);this._oLegendPop.setOffsetX(this._calcOffsetForLegendPopover());}};u.prototype.updateZoomLevel=function(z){this._bSuppressZoomStopChange=true;this.setZoomLevel(z);};u.prototype.setZoomLevel=function(z,i){if(z>=0){var m=this.getZoomLevel();if(m!==z){this.setProperty("zoomLevel",z,i);if(this._oZoomSlider){this._oZoomSlider.setValue(z);this._oZoomSlider.setTooltip(this._oRb.getText("TLTP_SLIDER_ZOOM_LEVEL")+':'+z);if(!this._bSuppressZoomStopChange){this.fireZoomStopChange({index:z});}}if(this._oSelect){this._oSelect.setSelectedItem(this._oSelect.getItems()[z]);if(!this._bSuppressZoomStopChange){this.fireZoomStopChange({index:z,selectedItem:this._oSelect.getSelectedItem()});}}if(this._oToolbarScheme&&!isNaN(z)&&this._oZoomInButton&&this._oZoomOutButton&&this._oToolbarScheme.getTimeZoom()){var v=this._oToolbarScheme.getTimeZoom().getStepCountOfSlider()-1,w=0;if(z===v){this._oZoomInButton.setEnabled(false);this._oZoomOutButton.setEnabled(true);}else if(z===w){this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(false);}else{this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(true);}}}}this._bSuppressZoomStopChange=false;return this;};u.prototype.setMode=function(m){this.setProperty("mode",m);if(this._oModeSegmentButton){this._oModeSegmentButton.setSelectedButton(this._oModeButtonMap[m]);}return this;};u.prototype.setHierarchies=function(H){this.setProperty("hierarchies",H,true);this._oHierarchyConfigMap={};if(H){for(var i=0;i<H.length;i++){this._oHierarchyConfigMap[H[i].getKey()]=H[i];}}this._resetAllCompositeControls();return this;};u.prototype.setContainerLayouts=function(m){this.setProperty("containerLayouts",m,true);this._oContainerLayoutConfigMap={};if(m){for(var i=0;i<m.length;i++){this._oContainerLayoutConfigMap[m[i].getKey()]=m[i];}}this._resetAllCompositeControls();return this;};u.prototype.setModes=function(m){this.setProperty("modes",m,true);this._oModesConfigMap={};if(m){for(var i=0;i<m.length;i++){this._oModesConfigMap[m[i].getKey()]=m[i];}}return this;};u.prototype.setToolbarDesign=function(i){this._oToolbar.setDesign(i);return this;};u.prototype.setToolbarSchemes=function(m){this.setProperty("toolbarSchemes",m,true);this._oToolbarSchemeConfigMap={};if(m){for(var i=0;i<m.length;i++){this._oToolbarSchemeConfigMap[m[i].getKey()]=m[i];}}this._resetAllCompositeControls();return this;};u.prototype.setSourceId=function(i){this.setProperty("sourceId",i,true);this._resetAllCompositeControls();return this;};u.prototype.setType=function(i){this.setProperty("type",i,true);this._resetAllCompositeControls();return this;};u.prototype.addCustomToolbarItem=function(i){if(this._iCustomItemInsertIndex==-1){this._oToolbar.insertContent(i,0);this._iCustomItemInsertIndex++;}else{this._oToolbar.insertContent(i,this._iCustomItemInsertIndex+1);this._iCustomItemInsertIndex++;}this._aCustomItems.push(i);this._resetAllCompositeControls();return this;};u.prototype.insertCustomToolbarItem=function(i,I){var m=this._aCustomItems.length;if(I>=m){I=m;}if(this._iCustomItemInsertIndex===-1){this._oToolbar.insertContent(i,0);this._aCustomItems.push(i);}else{this._oToolbar.insertContent(i,this._iCustomItemInsertIndex-this._aCustomItems.length+1+I);this._aCustomItems.splice(I,0,i);}this._iCustomItemInsertIndex++;return this;};u.prototype.removeCustomToolbarItem=function(v){if(this._aCustomItems.length===0){return this._aCustomItems;}if((typeof v)==="number"){var i=this._aCustomItems.length;var R=v>i?i:v;this._oToolbar.removeContent(this._iCustomItemInsertIndex-i+R+1);this._iCustomItemInsertIndex--;return this._aCustomItems.splice(R,1);}else if(v){this._oToolbar.removeContent(v);this._iCustomItemInsertIndex--;return this._aCustomItems.splice(jQuery.inArray(v,this._aCustomItems),1);}};u.prototype.getCustomToolbarItems=function(){return this._aCustomItems.slice(0);};u.prototype.destroyCustomToolbarItems=function(){var i=this.removeAllCustomToolbarItems();i.forEach(function(m){m.destroy();});return i;};u.prototype.removeAllCustomToolbarItems=function(){var R=[];for(var i=0;i<this._aCustomItems.length;i++){R.push(this._oToolbar.removeContent(this._aCustomItems[i]));}this._iCustomItemInsertIndex=this._iCustomItemInsertIndex-this._aCustomItems.length;this._aCustomItems.splice(0,this._aCustomItems.length);return R;};u.prototype._resetAllCompositeControls=function(){this._determineToolbarSchemeConfig(this.getSourceId());this._destroyCompositeControls();if(!this._sToolbarSchemeKey){return;}this._resolvePositions();var i,v,w=u.ToolbarItemPosition.Left,R=u.ToolbarItemPosition.Right;var x=this._oItemConfiguration[w];for(i=0;i<x.length;i++){if(x[i]){this._createCompositeControl(w,i,x[i]);}}var y=this._oItemConfiguration[R];for(i=y.length-1;i>=0;i--){if(y[i]){this._createCompositeControl(R,i,y[i]);}}var A=function(v){if(jQuery.isArray(v)){for(var m=0;m<v.length;m++){this._oToolbar.addContent(v[m]);}}else if(v){this._oToolbar.addContent(v);}};for(i=0;i<this._oAllItems[w].length;i++){v=this._oAllItems[w][i];A.call(this,v);}if(this._oAllItems[w].length!==0||this._oAllItems[R].length!==0){this._oToolbar.addContent(new T());}for(i=0;i<this._oAllItems[R].length;i++){v=this._oAllItems[R][i];A.call(this,v);}};u.prototype.getAllToolbarItems=function(){return this._oToolbar.getContent();};u.prototype._determineToolbarSchemeConfig=function(i){this._sToolbarSchemeKey=null;if(this.getType()===q.ToolbarType.Global&&this._oContainerLayoutConfigMap[i]){this._sToolbarSchemeKey=this._oContainerLayoutConfigMap[i].getToolbarSchemeKey();this._sInitMode=this.getMode()!=L.DEFAULT_MODE_KEY?this.getMode():this._oContainerLayoutConfigMap[i].getActiveModeKey();}else if(this.getType()===q.ToolbarType.Local&&this._oHierarchyConfigMap[i]){this._sToolbarSchemeKey=this._oHierarchyConfigMap[i].getToolbarSchemeKey();this._sInitMode=this.getMode()!=L.DEFAULT_MODE_KEY?this.getMode():this._oHierarchyConfigMap[i].getActiveModeKey();}if(this._oToolbarScheme==this._oToolbarSchemeConfigMap[this._sToolbarSchemeKey]){this._bClearCustomItems=false;}else{this._oToolbarScheme=this._oToolbarSchemeConfigMap[this._sToolbarSchemeKey];this._bClearCustomItems=true;}if(this._oToolbarScheme&&this._oToolbarScheme.getProperty("toolbarDesign")){this.setToolbarDesign(this._oToolbarScheme.getProperty("toolbarDesign"));}};u.prototype._destroyCompositeControls=function(){this._oToolbar.getContent().forEach(function(i){if(this._aCustomItems.indexOf(i)<0){i.destroy();}},this);this._oToolbar.removeAllContent();this._resetToolbarInfo();};u.prototype._resolvePositions=function(){if(this._oToolbarScheme){jQuery.each(this._oToolbarScheme.getMetadata().getAllProperties(),function(m){if(m!=="key"&&m!=="toolbarDesign"){var v=this._oToolbarScheme.getProperty(m);if(v){var w=this._parsePosition(v.getPosition());this._oItemConfiguration[w.position][w.idx]=jQuery.extend({},{groupId:m},v);}}}.bind(this));var i=this._oItemConfiguration;var A=Object.keys(i);A.forEach(function(m){var v=i[m],w=[];var x=Object.keys(v).sort();x.forEach(function(y,z){w.push(v[y]);});i[m]=w;});}};u.prototype._parsePosition=function(i){return{position:i.toUpperCase().substr(0,1)==="L"?u.ToolbarItemPosition.Left:u.ToolbarItemPosition.Right,idx:parseInt(i.substr(1,i.length-1),10)};};u.prototype._createCompositeControl=function(i,I,G){var v;switch(G.groupId){case"sourceSelect":v=this._genSourceSelectGroup(G);break;case"birdEye":v=this._genBirdEyeGroup(G);break;case"layout":v=this._genLayoutGroup(G);break;case"expandChart":v=this._genExpandChartGroup(G);break;case"expandTree":v=this._genExpandTreeGroup(G);break;case"customToolbarItems":v=this._genCustomToolbarItemGroup(i,G);break;case"mode":v=this._genModeButtonGroup(G);break;case"timeZoom":v=this._genTimeZoomGroupControls(G);break;case"legend":v=this._genLegend(G);break;case"settings":v=this._genSettings(G);break;default:break;}if(v){this._oAllItems[i]=this._oAllItems[i].concat(v);}};u.prototype._genBirdEyeGroup=function(G){var i=this;var m=new c({priority:G.getOverflowPriority()});var v=this._oRb.getText("TXT_BRIDEYE");var w=this._oRb.getText("TXT_BRIDEYE_RANGE_VISIBLE_ROWS");var x=this._oRb.getText("TXT_BRIDEYE_RANGE_ALL_ROWS");var y=this._oRb.getText("TLTP_BRIDEYE_ON_VISIBLE_ROWS");var z=this._oRb.getText("TLTP_BRIDEYE_ON_ALL_ROWS");this._oBirdEyeButton=null;if(G.getBirdEyeRange()===L.BirdEyeRange.AllRows){this._oBirdEyeButton=new B({id:this._getConfigButtonId(G),icon:"sap-icon://show",tooltip:v+"("+x+"): "+z,layoutData:m,press:function(E){i.fireBirdEye({action:"birdEye",birdEyeRange:G.getBirdEyeRange()});}});}else if(G.getBirdEyeRange()===L.BirdEyeRange.VisibleRows){this._oBirdEyeButton=new B({id:this._getConfigButtonId(G),icon:"sap-icon://show",tooltip:v+"("+w+"): "+y,layoutData:m,press:function(E){i.fireBirdEye({action:"birdEye",birdEyeRange:G.getBirdEyeRange()});}});}else{this._oBirdEyeButton=new f({width:"8rem",text:w,tooltip:v+": "+y,icon:"sap-icon://show",buttonMode:sap.m.MenuButtonMode.Split,useDefaultActionOnly:true,defaultAction:function(E){i.fireBirdEye({action:"birdEye",birdEyeRange:this._currentBirdEyeRange?this._currentBirdEyeRange:L.BirdEyeRange.VisibleRows});}});var A=new g({id:this._getConfigButtonId(G),itemSelected:function(E){var I=E.getParameter("item");var H=I.birdEyeRange;i._oBirdEyeButton.setTooltip(I.getTooltip());i._oBirdEyeButton.setText(I.getText());I.setIcon("sap-icon://show");if(!this.getParent()._currentBirdEyeRange||this.getParent()._currentBirdEyeRange!==H){this.getParent()._currentBirdEyeRange=H;}i.fireBirdEye({action:"birdEye",birdEyeRange:H});}});var D=new h({text:w,tooltip:v+": "+y,press:function(E){this.setIcon();}});D.birdEyeRange=L.BirdEyeRange.VisibleRows;A.addItem(D);D=new h({text:x,tooltip:v+": "+z,press:function(E){this.setIcon();}});D.birdEyeRange=L.BirdEyeRange.AllRows;A.addItem(D);this._oBirdEyeButton.setMenu(A);}return this._oBirdEyeButton;};u.prototype._genSourceSelectGroup=function(G){var i=this.getSourceId();var m=this;var v;this._oSourceSelectBox=new e({id:this._getConfigButtonId(G),layoutData:new c({priority:G.getOverflowPriority()}),width:"200px",change:function(E){var x=E.getParameter("selectedItem");var y=x.oSourceConfig;m.fireSourceChange({id:x.getKey(),config:y});}});switch(this.getType()){case q.ToolbarType.Global:v=this.getContainerLayouts();this._oSourceSelectBox.setTooltip(this._oRb.getText("TLTP_GLOBAL_HIERARCHY_RESOURCES"));break;case q.ToolbarType.Local:v=this.getHierarchies();this._oSourceSelectBox.setTooltip(this._oRb.getText("TLTP_LOCAL_HIERARCHY_RESOURCES"));break;default:return null;}var w;for(var I=0;I<v.length;I++){w=new j({key:v[I].getKey(),text:v[I].getText()});w.oSourceConfig=v[I];this._oSourceSelectBox.addItem(w);if(w.getKey()===i){this._oSourceSelectBox.setSelectedItem(w);}}return this._oSourceSelectBox;};u.prototype._genLayoutGroup=function(G){if(this.getType==="LOCAL"){return null;}var m=this,H=this.getHierarchies(),v,i;this._oAddGanttChartSelect=new e({id:this._getConfigButtonId(G,"add"),icon:"sap-icon://add",type:sap.m.SelectType.IconOnly,autoAdjustWidth:true,maxWidth:"50px",tooltip:this._oRb.getText("TLTP_ADD_GANTTCHART"),forceSelection:false,layoutData:new c({priority:G.getOverflowPriority()}),change:function(x){if(x.getParameter("selectedItem")){var y=m.data("holder");if(y.getGanttCharts().length<y.getMaxNumOfGanttCharts()){if(!m._oLessGanttChartSelect.getEnabled()){m._oLessGanttChartSelect.setEnabled(true);if(m._oVHButton){m._oVHButton.setEnabled(true);}}if(y.getGanttCharts().length==y.getMaxNumOfGanttCharts()-1){this.setEnabled(false);}x.getSource().setSelectedItemId("");m.fireLayoutChange({id:"add",value:{hierarchyKey:x.getParameter("selectedItem").getKey(),hierarchyConfig:x.getParameter("selectedItem").data("hierarchyConfig")}});}if(y.getGanttCharts().length>y.getMaxNumOfGanttCharts()){this.setEnabled(false);}}}});if(H&&H.length>0){for(i=0;i<H.length;i++){v=new j({text:H[i].getText(),key:H[i].getKey()});v.data("hierarchyConfig",H[i]);this._oAddGanttChartSelect.addItem(v);}}var E=this._oContainerLayoutConfigMap[this.getSourceId()].getGanttChartLayouts().length>1?true:false;this._oLessGanttChartSelect=new e({id:this._getConfigButtonId(G,"less"),icon:"sap-icon://less",type:sap.m.SelectType.IconOnly,tooltip:this._oRb.getText("TLTP_REMOVE_GANTTCHART"),maxWidth:"50px",autoAdjustWidth:true,forceSelection:false,enabled:E,layoutData:new c({priority:G.getOverflowPriority()}),change:function(x){if(x.getParameter("selectedItem")){var y=m.data("holder");if(y.getGanttCharts().length<=y.getMaxNumOfGanttCharts()){if(!m._oAddGanttChartSelect.getEnabled()){m._oAddGanttChartSelect.setEnabled(true);}}m.fireLayoutChange({id:"less",value:{hierarchyKey:x.getParameter("selectedItem").getKey(),hierarchyConfig:x.getParameter("selectedItem").data("hierarchyConfig"),ganttChartIndex:x.getParameter("selectedItem").data("ganttChartIndex")}});var z=x.getSource().getSelectedItem();if(z){z.setText("");}if(y.getGanttCharts().length==1){this.setEnabled(false);if(m._oVHButton){m._oVHButton.setEnabled(false);}}}}});this._oLessGanttChartSelect.addEventDelegate({onclick:this._fillLessGanttChartSelectItem},this);var I=this._oContainerLayoutConfigMap[this.getSourceId()].getOrientation()===r.Vertical?"sap-icon://resize-vertical":"sap-icon://resize-horizontal";var w=this._oContainerLayoutConfigMap[this.getSourceId()].getOrientation()===r.Vertical?this._oRb.getText("TLTP_ARRANGE_GANTTCHART_VERTICALLY"):this._oRb.getText("TLTP_ARRANGE_GANTTCHART_HORIZONTALLY");this._oVHButton=new B({id:this._getConfigButtonId(G),icon:I,tooltip:w,type:G.getButtonType(),layoutData:new c({priority:G.getOverflowPriority()}),press:function(x){switch(this.getIcon()){case"sap-icon://resize-vertical":this.setIcon("sap-icon://resize-horizontal");this.setTooltip(m._oRb.getText("TLTP_ARRANGE_GANTTCHART_HORIZONTALLY"));m.fireLayoutChange({id:"orientation",value:r.Horizontal});break;case"sap-icon://resize-horizontal":this.setIcon("sap-icon://resize-vertical");this.setTooltip(m._oRb.getText("TLTP_ARRANGE_GANTTCHART_VERTICALLY"));m.fireLayoutChange({id:"orientation",value:r.Vertical});break;default:break;}}});this._oLayoutButton=[this._oAddGanttChartSelect,this._oLessGanttChartSelect,this._oVHButton];return this._oLayoutButton;};u.prototype._fillLessGanttChartSelectItem=function(){var G=this.data("holder").getGanttCharts(),I;this._oLessGanttChartSelect.removeAllItems();if(G&&G.length>0){for(var i=0;i<G.length;i++){I=new j({text:this._oHierarchyConfigMap[G[i].getHierarchyKey()].getText(),key:G[i].getHierarchyKey()});I.data("hierarchyConfig",this._oHierarchyConfigMap[G[i].getHierarchyKey()]);I.data("ganttChartIndex",i);this._oLessGanttChartSelect.insertItem(I,i);}}};u.prototype._genExpandChartGroup=function(G){this._aChartExpandButtons=[];var m=function(x){this.fireExpandChartChange({isExpand:x.getSource().data("isExpand"),expandedChartSchemes:x.getSource().data("chartSchemeKeys")});};var E=G.getExpandCharts(),v;for(var i=0;i<E.length;i++){var w=E[i];v=new B({id:this._getConfigButtonId(w),icon:w.getIcon(),tooltip:w.getTooltip(),layoutData:new c({priority:G.getOverflowPriority()}),press:m.bind(this),type:G.getButtonType(),customData:[new b({key:"isExpand",value:w.getIsExpand()}),new b({key:"chartSchemeKeys",value:w.getChartSchemeKeys()})]});if(G.getShowArrowText()){v.setText(w.getIsExpand()?"ꜜ":"ꜛ");}this._aChartExpandButtons.push(v);}return this._aChartExpandButtons;};u.prototype._genCustomToolbarItemGroup=function(i,G){if(this._iCustomItemInsertIndex===-1){if(i==u.ToolbarItemPosition.Left){var m=this._oAllItems[i].length;this._iCustomItemInsertIndex=m-1;}else{var m=this._oAllItems[u.ToolbarItemPosition.Left].length+1+this._oAllItems[i].length;this._iCustomItemInsertIndex=m-1;}}return this._aCustomItems;};u.prototype._genExpandTreeGroup=function(G){var i=this;this._oTreeGroup=[new B({id:this._getConfigButtonId(G,"expand"),icon:"sap-icon://expand",tooltip:this._oRb.getText("TLTP_EXPAND"),type:G.getButtonType(),layoutData:new c({priority:G.getOverflowPriority()}),enabled:false,press:function(E){i.fireExpandTreeChange({action:"expand"});}}),new B({id:this._getConfigButtonId(G,"collapse"),icon:"sap-icon://collapse",tooltip:this._oRb.getText("TLTP_COLLAPSE"),layoutData:new c({priority:G.getOverflowPriority()}),enabled:false,press:function(E){i.fireExpandTreeChange({action:"collapse"});}})];return this._oTreeGroup;};u.prototype._genModeButtonGroup=function(G){var m=function(E){var i=E.getParameter("button");this.fireModeChange({mode:i.data("mode")});};this._oModeSegmentButton=new S({select:m.bind(this)});this._oModeButtonMap={};var J=function(i,v){if(this._oModesConfigMap[v]){var w=new B({id:this._getConfigButtonId(this._oModesConfigMap[v]),icon:this._oModesConfigMap[v].getIcon(),activeIcon:this._oModesConfigMap[v].getActiveIcon(),type:G.getButtonType(),tooltip:this._oModesConfigMap[v].getText(),layoutData:new c({priority:G.getOverflowPriority()}),customData:[new b({key:"mode",value:v})]});this._oModeButtonMap[v]=w;this._oModeSegmentButton.addButton(w);}};jQuery.each(G.getModeKeys(),J.bind(this));if(this._sInitMode){this._oModeSegmentButton.setSelectedButton(this._oModeButtonMap[this._sInitMode]);}return this._oModeSegmentButton;};u.prototype._getCounterOfZoomLevels=function(){if(!this._nCounterOfDefaultSliders){this._nCounterOfDefaultSliders=this._oToolbarScheme.getTimeZoom().getStepCountOfSlider();}var i=this._oToolbarScheme.getTimeZoom().getInfoOfSelectItems();if(!i||i.length===0){this._oToolbarScheme.getTimeZoom().setStepCountOfSlider(this._nCounterOfDefaultSliders);return this._nCounterOfDefaultSliders;}var m=i.length;this._oToolbarScheme.getTimeZoom().setStepCountOfSlider(m);return m;};u.prototype._getZoomControlType=function(){return this._sZoomControlType;};u.prototype._genTimeZoomGroupControls=function(G){var m=this;var z=G.getZoomControlType(),R=[],v,Z,w,x;var y=new c({priority:G.getOverflowPriority()});var U=function(J){jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);this._iLiveChangeTimer=-1;this.setZoomLevel(J,true);};this._sZoomControlType=z;this.fireEvent("_zoomControlTypeChange",{zoomControlType:z});if(z===L.ZoomControlType.None){return R;}else if(z===L.ZoomControlType.Select){var A=[],I=this._oToolbarScheme.getTimeZoom().getInfoOfSelectItems();if(I.length>0){if(I[0]instanceof j){A=I;}else{for(var i=0;i<I.length;i++){var D=new j({key:I[i].key,text:I[i].text});A.push(D);}}}v=new e({id:this._getConfigButtonId(G,"select"),items:A,selectedItem:A[this.getZoomLevel()],layoutData:y,change:function(J){var v=J.getSource();var K=v.getSelectedItem();var N=v.indexOfItem(K);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,m,U,[N,K]);}});this._oSelect=v;R.push(v);}else{var E=this._getCounterOfZoomLevels();if(this.data("holder")&&this.data("holder").getSliderStep()){E=this.data("holder").getSliderStep();}if(z!==L.ZoomControlType.ButtonsOnly){Z=new p({tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_LEVEL")+':'+this.getZoomLevel(),showHandleTooltip:true,showAdvancedTooltip:true,id:this._getConfigButtonId(G,"slider"),width:"200px",layoutData:y,max:E-1,value:this.getZoomLevel(),min:0,step:1,liveChange:function(J){var K=parseInt(J.getParameter("value"),10);jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,U,[K]);}.bind(this)});}if(z!==L.ZoomControlType.SliderOnly){var H=function(J){return function(K){var N=parseInt(J?this._oZoomSlider.stepUp(1).getValue():this._oZoomSlider.stepDown(1).getValue(),10);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,U,[N]);};};w=new sap.m.Button({id:this._getConfigButtonId(G,"zoomIn"),icon:"sap-icon://zoom-in",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_IN"),layoutData:y.clone(),press:H(true).bind(this)});x=new B({id:this._getConfigButtonId(G,"zoomOut"),icon:"sap-icon://zoom-out",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_OUT"),layoutData:y.clone(),press:H(false).bind(this)});}if(x){R.push(x);this._oZoomOutButton=x;}if(Z){R.push(Z);this._oZoomSlider=Z;}if(w){R.push(w);this._oZoomInButton=w;}}return R;};u.prototype._genLegend=function(G){if(!this._oLegendPop){this._oLegendPop=new P({placement:t.Bottom,showArrow:false,showHeader:false});}if(this.getLegend()){this._oLegendPop.removeAllContent();this._oLegendPop.addContent(this.getLegend());}this._oLegendButton=new B({id:this._getConfigButtonId(G),icon:"sap-icon://legend",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_SHOW_LEGEND"),layoutData:new c({priority:G.getOverflowPriority(),closeOverflowOnInteraction:false}),press:function(E){this._oLegendPop.setOffsetX(this._calcOffsetForLegendPopover());var i=this._oLegendPop;if(i.isOpen()){i.close();}else{i.openBy(this._oLegendButton);}}.bind(this)});return this._oLegendButton;};u.prototype._genSettings=function(G){var m=G.getItems()||[];var v=this;var A=m.map(function(i){return new n({name:i.getKey(),text:i.getDisplayText(),tooltip:i.getTooltip(),selected:i.getChecked()}).addStyleClass("sapUiSettingBoxItem");});this._aOldSettingState=A.map(function(i){return i.getSelected();});var R=function(A){for(var i=0;i<A.length;i++){switch(A[i].getName()){case L.SETTING_ITEM_ENABLE_NOW_LINE_KEY:A[i].setSelected(this.getEnableNowLine());break;case L.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY:A[i].setSelected(this.getEnableCursorLine());break;case L.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY:A[i].setSelected(this.getEnableVerticalLine());break;case L.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY:A[i].setSelected(this.getEnableAdhocLine());break;case L.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY:A[i].setSelected(this.getEnableTimeScrollSync());break;default:break;}}}.bind(this);var w=function(A){for(var i=0;i<A.length;i++){A[i].setSelected(true);}};this._oSettingsBox=new F({direction:s.Column,items:A}).addStyleClass("sapUiSettingBox");this._oSettingsDialog=new V({title:this._oRb.getText("SETTINGS_DIALOG_TITLE"),customTabs:[new k({content:this._oSettingsBox})],confirm:function(){var x=this._oSettingsBox.getItems();var y=[];for(var i=0;i<x.length;i++){y.push({id:x[i].getName(),value:x[i].getSelected()});v._aOldSettingState[i]=x[i].getSelected();}this.fireSettingsChange(y);}.bind(this),cancel:function(){R(A);},reset:function(){w(A);}});this._oSettingsButton=new B({id:this._getConfigButtonId(G),icon:"sap-icon://action-settings",type:G.getButtonType(),tooltip:this._oRb.getText("TXT_SETTING_BUTTON"),layoutData:new c({priority:G.getOverflowPriority()}),press:function(E){this._oSettingsDialog.open();}.bind(this)});return this._oSettingsButton;};u.prototype.toggleExpandTreeButton=function(R){if(this._oTreeGroup&&this._oTreeGroup.length>0){this._oTreeGroup.forEach(function(i){i.setEnabled(R);});}};u.prototype.getToolbarSchemeKey=function(){return this._sToolbarSchemeKey;};u.prototype.setEnableNowLine=function(E){this.setProperty("enableNowLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(L.SETTING_ITEM_ENABLE_NOW_LINE_KEY,E);}return this;};u.prototype.setEnableCursorLine=function(E){this.setProperty("enableCursorLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(L.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY,E);}return this;};u.prototype.setEnableVerticalLine=function(E){this.setProperty("enableVerticalLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(L.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY,E);}return this;};u.prototype.setEnableAdhocLine=function(E){this.setProperty("enableAdhocLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(L.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY,E);}return this;};u.prototype.setEnableTimeScrollSync=function(E){this.setProperty("enableTimeScrollSync",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(L.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY,E);}return this;};u.prototype._setSettingItemProperties=function(m,v){var w=this._oSettingsBox.getItems();for(var i=0;i<w.length;i++){if(w[i].getName()===m){w[i].setSelected(v);break;}}};u.prototype.exit=function(){if(this._oLegendPop){this._oLegendPop.destroy(false);}if(this._oSettingsPop){this._oSettingsPop.destroy(false);}};u.prototype._calcOffsetForLegendPopover=function(){var i=0,m=65;var v=1;var z=1;var w=window.devicePixelRatio||1;w=Math.round(w*100)/100;if(sap.ui.Device.browser.name==="ie"){z=Math.round((screen.deviceXDPI/screen.logicalXDPI)*100)/100;}else if(sap.ui.Device.browser.name==="cr"){z=Math.round((window.outerWidth/window.innerWidth)*100)/100;}else{z=w;}if(z!==1){if(z<1||(z-1)%1===0){m+=m*(z-1)*0.1;}else{m=85;}w=Math.round(w*10)/10;if(z<1){v=w+Math.floor((1-z)*10)/10;}else if(z<=1.1){v=Math.round(z*10)/10*w;}else{v=w-Math.floor((z-1.1)*10)/10;}}if(a.getConfiguration().getRTL()===true){i=140;}else{var x=this._oLegendPop.getContent();if(x&&x.length>0){var y=sap.ui.getCore().byId(x[0].getContent());i=Math.round((m-parseInt(y.getWidth(),10))*v);}}return i;};u.prototype.getZoomLevels=function(){if(this._oToolbarScheme){var i=this._oToolbarScheme.getTimeZoom();if(i){switch(i.getZoomControlType()){case L.ZoomControlType.Select:return i.getTextsOfSelect()||0;case L.ZoomControlType.None:return-1;default:return i.getStepCountOfSlider();}}}return-1;};u.prototype._getConfigButtonId=function(i,m){var I=null;if(M.isGeneratedId(i.getId())){return I;}var v=this.getParent();if(v){v=this.getType()==="LOCAL"?v.getParent():v;if(v){I=v.getId()+"-"+i.getId();I=m?I+"-"+m:I;}}return I;};return u;},true);