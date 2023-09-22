//@ui5-bundle sap/sac/grid/library-preload.js
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/AlertLevel", [],function(){"use strict";var _={NORMAL:"0",GOOD_1:"1",GOOD_2:"2",GOOD_3:"3",CRITICAL_1:"4",CRITICAL_2:"5",CRITICAL_3:"6",BAD_1:"7",BAD_2:"8",BAD_3:"9"};return _});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/Cell", ["sap/ui/core/Element"],function(e){"use strict";var t=e.extend("sap.sac.grid.Cell",{metadata:{library:"sap.sac.grid",properties:{alertLevel:{type:"sap.sac.grid.AlertLevel"},displayValue:{type:"string"},cellType:{type:"sap.sac.grid.CellType"},column:{type:"int",defaultValue:0},icon:{type:"string"},helpId:{type:"string"},context:{type:"string"},valueState:{type:"sap.ui.core.ValueState"},row:{type:"int",defaultValue:0},displayLevel:{type:"int"},semanticClass:{type:"string"},inputEnabled:{type:"boolean"},documentId:{type:"string"}}}});return t});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/CellGridPart", [],function(){"use strict";var t={Rows:"Rows",Columns:"Columns",Data:"Data",Mixed:"Mixed",Empty:"Empty"};return t});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/CellType", [],function(){"use strict";var e={HEADER:"Header",TITLE:"Title",RESULT:"Result",RESULT_POSITIVE:"ResultPositive",RESULT_HEADER:"ResultHeader",RESULT_NEGATIVE:"ResultNegative",RESULT_CRITICAL:"ResultCritical",POSITIVE:"Positive",NEGATIVE:"Negative",CRITICAL:"Critical",STANDARD:"Standard",EMPTY:"Empty"};return e});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/Format",[],function(){"use strict";var s={Basic:"Basic",ExcelStyle:"ExcelStyle",BusinessStyle:"BusinessStyle",BusinessStyleFormular:"BusinessStyleFormular",CustomStyle:"CustomStyle"};return s});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/Grid", ["sap/ui/core/Control","sap/ui/core/HTML","sap/ui/core/ResizeHandler","sap/sac/grid/utils/GridUtils","sap/sac/grid/Format","sap/sac/grid/utils/Utilities","sap/sac/grid/GridRenderer"],function(e,t,n,a,i,r,l){"use strict";var o=e.extend("sap.sac.grid.Grid",{renderer:l,metadata:{properties:{maxRows:{type:"int",group:"Dimension",defaultValue:15},virtualRows:{type:"int",group:"Dimension"},rowHeight:{type:"int",group:"Dimension",defaultValue:31},maxColumns:{type:"int",defaultValue:20},virtualColumns:{type:"int"},columnLimit:{type:"int",defaultValue:20},rowLimit:{type:"int",defaultValue:125},input:{type:"boolean",defaultValue:false},fixedRows:{type:"int",defaultValue:0},fixedColumns:{type:"int",defaultValue:0},offsetColumn:{type:"int",defaultValue:0},offsetRow:{type:"int",defaultValue:0},format:{type:"sap.sac.grid.Format",multiple:false,defaultValue:i.ExcelStyle},tableData:{type:"object",defaultValue:null}},aggregations:{cells:{type:"sap.sac.grid.Cell",multiple:true,bindable:"bindable"},semanticStyles:{type:"sap.sac.grid.SemanticStyle",multiple:true,bindable:"bindable"}},defaultAggregation:"cells",events:{requestMoreRows:{parameters:{currentRow:"int",defered:"object"}},requestMoreColumns:{parameters:{currentColumn:"int",defered:"object"}},rightClick:{parameters:{cell:"sap.sac.grid.Cell",link:"sap.m.Link"}},drill:{parameters:{cell:"sap.sac.grid.Cell"}},initialMount:{},cellMouseDown:{parameters:{nativeEvent:"MouseEvent",row:"int",column:"int",cellContext:"object",targetDescription:"string"}},cellMouseUp:{parameters:{nativeEvent:"MouseEvent",row:"int",column:"int",cellType:"int",cellContext:"object"}},selectionChanged:{newSelection:"object[]",selectionContext:"int"},drillIconClick:{parameters:{row:"int",column:"int",nativeEvent:"MouseEvent",targetDescription:"string"}},customCellIconClick:{parameters:{row:"int",column:"int",className:"string",dataAttributes:"object",iconCharCode:"int"}},cellLinkPressed:{row:"int",column:"int",cellHyperlinkId:"string"},commentIconClicked:{row:"int",column:"int"},externalElementDropped:{externalData:"any",targetRow:"int",targetColumn:"int",placedBeforeCell:"boolean"},cellDropped:{parameters:{sourceRow:"int",sourceColumn:"int",targetRow:"int",targetColumn:"int",placedBeforeCell:"boolean"}},dragCopyEnd:{parameters:{originalSelection:"object",newSelection:"object"}},keyboardShortcut:{parameters:{currentSelection:"object",nativeEvent:"KeyboardEvent",keyUp:"boolean"}},changeColumnWidth:{parameters:{newColumnWidths:"object[]"}},changeRowHeight:{parameters:{newRowHeights:"object[]"}},changeTitleHeight:{parameters:{newHeight:"int"}},verticalLimitReached:{parameters:{scrollTop:"int",scrollDown:"boolean"}},horizontalLimitReached:{parameters:{scrollLeft:"int",scrollToRight:"boolean"}},contextMenu:{parameters:{row:"int",column:"int",nativeEvent:"MouseEvent",targetDescription:"string",currentSelectionAreas:"object",isTitle:"boolean"}}}},init:function(){this.reactTableContainer=this.getReactTableDivContainer(this.getId())},getReactTableDivContainer:function(e){var t=document.createElement("div");t.setAttribute("id",e+"-reactNode");t.className="sapUiSACReactNode";t.className="reactTableComponent";return t},onAfterRendering:function(){var e=this;a.renderSACGrid(e);var t=e;if(!this._iResizeHandlerId){e.AnchorElement=a.findAnchorElement(e);if(!e.AnchorElement){e.AnchorElement=t}e._iResizeHandlerId=n.register(e.AnchorElement,function(e){var n=t.mSacTable&&t.mSacTable.cachedData;if(n){r.decideWidgetDimensions(t,n,true);r.updateTableData(t,n)}});sap.ui.getCore().attachThemeChanged(function(t){a.renderSACGrid(e)})}},_getFormat:function(){var e=this.getFormat();var t=this.getParent()&&this.getParent().getPivotTable&&this.getParent().getPivotTable();var n=t&&t.getFormat&&t.getFormat();if(n&&e!=n){e=n}return e},_isExcelStyle:function(){return this._getFormat()===i.ExcelStyle},_completeRowHeight:function(){var e=this._isExcelStyle()?1:0;return this.getRowHeight()+e}});return o});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/GridRenderer", [],function(){"use strict";var t={apiVersion:2};t.render=function(t,e){t.openStart("div",e);t.attr("data-sap-ui-fastnavgroup","true");t.style("width","100%");t.style("height","100%");t.openEnd();t.close("div")};return t});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/SemanticStyle", ["sap/ui/core/Element"],function(e){"use strict";var t=e.extend("sap.sac.grid.SemanticStyle",{metadata:{library:"sap.sac.grid",properties:{member:{type:"string"},class:{type:"string"}}}});return t});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/library",["sap/sac/grid/CellType","sap/sac/grid/SemanticStyle","sap/sac/grid/Format","sap/sac/grid/AlertLevel"],function(e,a,s,r){"use strict";var i=sap.ui.getCore().initLibrary({name:"sap.sac.grid",version:"1.108.0",dependencies:["sap.m","sap.ui.core"],types:["sap.sac.grid.AlertLevel","sap.sac.grid.CellType","sap.sac.grid.Format"],interfaces:[],controls:["sap.sac.grid.Grid"],elements:["sap.sac.grid.Cell","sap.sac.grid.SemanticStyle"]});i.CellType=e;i.AlertLevel=r;i.SemanticStyle=a;i.Format=s;return i},false);
sap.ui.predefine("sap/sac/grid/utils/CellStyle", ["sap/ui/core/theming/Parameters"],function(e){"use strict";var t=function(){var t=this;t.getStyleObjectForHierarchyLevel=function(r,a){var c={position:1,padding:{right:a?0:1,left:a?0:1}};switch(r){case 0:c.pattern=t.fetchCellBorderStyleObject("",10,0,e.get("sapUiChart2"));break;case 1:c.pattern=t.fetchCellBorderStyleObject("",10,0,e.get("sapUiBaseText"));break;case 2:c.pattern=t.fetchCellBorderStyleObject("",10,-1,e.get("sapUiBaseText"));break;default:}return[c]};t.getStyleObjectForBusinessScenario=function(r){var a={position:1,padding:{right:1,left:1}};switch(r){case"Actual":a.pattern=t.fetchCellBorderStyleObject("",10,3,e.get("sapUiBlackBorder"),e.get("sapUiBaseText"));break;case"Previous":a.pattern=t.fetchCellBorderStyleObject("",10,3,e.get("sapUiFieldPlaceholderTextColor"));break;case"Forecast":a.pattern=t.fetchCellBorderStyleObject("",10,3,e.get("sapUiEmphasizedLine",e.get("sapUiWhite")));break;case"Budget":a.pattern=t.fetchCellBorderStyleObject("",10,3,e.get("sapUiWhite"),e.get("sapUiBaseText"));break;case"AbsoluteVariance":a.pattern=t.fetchCellBorderStyleObject("",10,3,e.get("sapUiSacGridAbsoluteVariance"));break;case"PercentageVariance":a.pattern=t.fetchCellBorderStyleObject("",10,3,e.get("sapUiSacGridPercentageVariance"));break;default:}return[a]};t.fetchCellBorderStyleObject=function(e,t,r,a,c){return{background:e,style:t,width:r,color:a,borderColor:c}};t.getStyleObjectForAlignmentAndBackGround=function(t,r){var a=t.getRow();var c=t.getCellType();var l=e.get("sapUiListHeaderBackground");var i=t.data();var n=i["cellDimension"]=="NonMeasureStructure";var s=c=="Title"||c=="Header"?-1:1;s=c=="Header"&&n?0:s;return{alignment:{horizontal:s},fillColor:a<r?l:"transparent"}}};return new t});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/utils/GridUtils", ["sap/base/Log","sap/ui/core/theming/Parameters","sap/sac/grid/utils/Utilities","sap/sac/grid/utils/TableEventHandlers","sap/sac/grid/Format","sap/sac/grid/utils/ModelHelper","sap/sac/grid/utils/CellStyle","sap/sac/grid/thirdparty/sac.internal.grid.vendor.1.3.2-853b6e9d44742cac02ebc475a5de75530af5bc2e","sap/sac/grid/thirdparty/sac.internal.grid.main.1.3.2-853b6e9d44742cac02ebc475a5de75530af5bc2e"],function(e,t,l,n,a,o,r){"use strict";function i(){var e=this;function i(e,l,n,o,i){var c={style:{},styleUpdatedByUser:true};var s=l.getRow();var d=l.getColumn();var u=l.getCellType();var g=t.get("sapUiListHeaderBackground");var f=l.data();var C=i["isOverallResults"];if(e==a.ExcelStyle){var v=(s<n||d<o)&&u!="Title";c.style={fillColor:v||C?g:"transparent",wrap:false}}else if(e==a.BusinessStyle){var m=f["cellDimension"]=="NonMeasureStructure";c.style=r.getStyleObjectForAlignmentAndBackGround(l,n);if(i["showStyleLinesForDataLevel"]&&u!="Title"&&!m){c.style.lines=r.getStyleObjectForHierarchyLevel(i["level"])}var p=l.getSemanticClass();if(p&&l.getDisplayValue()){c.style.lines=r.getStyleObjectForBusinessScenario(p)}if(C){c.style.fillColor=g}}return c}function c(e){var t=e._getFormat();var n=e.getFixedColumns();var a=e.getFixedRows();var o=e.getCells();var r=false;var c=0;var s=0;var d={rows:[],columns:[]};var u=e.mergeNewDataWithExisitngData?e.gridCells:{};var g={};o.forEach(function(e){var o={};var f=parseInt(e.getRow());var C=parseInt(e.getColumn());var v=e.getDisplayValue();var m=e.getIcon();s=f>s?f:s;c=C>c?C:c;g[f]=g[f]?g[f]:[];var p=l.getHierarchyInfo(t,e,g,n,a,d);o=Object.assign(o,p);var h=l.calculateColumnWidth({displayText:v,isBold:p["isInATotalsContext"],hierarchyPaddingLeft:p["hierarchyPaddingLeft"]});o.ColumnWidth=h;o.cellType=l.cellTypeMapping(e.getCellType(),p["isInATotalsContext"]);var w=i(t,e,a,n,p);o=Object.assign(o,w);g[f][C]=o;u[f]=u[f]?u[f]:[];u[f][C]=l.extractUsefulInfoFromCell(e);if(!r){r=m==="sap-icon://slim-arrow-up"?true:false}});l.storePropertiesToControl(e,r,c,s,u);l.fillMissingIndexes(e,g);return g}e.renderSACGrid=function(e){s(e);var t=e.getTableData();var n=!!t;if(!n){if(e.mSacTable&&e.mSacTable.cachedData){t=e.mSacTable.cachedData}else{t=o.fetchInitialTableModel(e.getId())}if(e.getCells().length>0){if(e.getCells().length===1){var a=e.getCells()[0];l.showNoDataInSacTable(a.getDisplayValue(),e);return}else{l.addRemoveCssClassToReactTable(false,"noDataInTable",e)}var r=c(e);l.addRowsAndColumnSettingsToTableModel(e,t,r);l.addDataRegionPropertiesToTableModel(e,t);t.showGrid=e._isExcelStyle();l.decideWidgetDimensions(e,t)}}if(e.mSacTable&&t.rows.length>0){l.updateTableData(e,t)}};function s(e){if(!e.mSacTable){var t={onCellMouseUp:function(t){e.fireCellMouseUp({nativeEvent:t.event,row:t.row,column:t.col,cellContext:t.cellContext,cellType:t.cellType});var l=t.event&&t.event.button===0;var a=!!e.mSacTable.cachedData.rows[t.row].cells[t.col].formatted;var o=t.event&&t.event.srcElement;var r=d(o);var i=r("icon");var c=r("rowSelection")||r("colSelection");if(l&&a&&!i&&!c){n.onCellClicked(t,e)}},onDrillIconClicked:function(t){e.fireDrillIconClick({row:t.row,column:t.col,nativeEvent:t.event,targetDescription:t.selectedCell});n.onDrillIconClicked(t,e);e.mSacTable.scrollPosition={scrollTop:e.mSacTable.getScrollTop(),scrollLeft:e.mSacTable.getScrollLeft()}},onReloadLimitReached:function(t){n.requestMoreRows(e,t)},onRenderComplete:function(){e.fireInitialMount()},onCellMouseDown:function(t){e.fireCellMouseDown({nativeEvent:t.event,row:t.row,column:t.col,cellContext:t.cellContext,targetDescription:t.selectedCell})},onSelectedRegionChanged:function(t,l){e.fireSelectionChanged({newSelection:t,selectionContext:l})},onCellIconClicked:function(t){e.fireCustomCellIconClick({row:t.row,column:t.col,className:t.className,dataAttributes:t.dataAttributes,iconCharCode:t.iconCharCode})},onCellLinkPressed:function(t){e.fireCellLinkPressed({row:t.row,column:t.col,cellHyperlinkId:t.cellHyperlinkId})},onCommentIconClicked:function(t){e.fireCommentIconClicked({row:t.row,column:t.col})},onExternalElementDropped:function(t){e.fireExternalElementDropped({externalData:t.externalData,targetRow:t.targetRow,targetColumn:t.targetCol,placedBeforeCell:t.placedBeforeCell})},onCellDropped:function(t){e.fireCellDropped({sourceRow:t.sourceRow,sourceColumn:t.sourceCol,targetRow:t.targetRow,targetColumn:t.targetCol,placedBeforeCell:t.placedBeforeCell})},onDragCopyFinish:function(t){e.fireDragCopyEnd({originalSelection:t.originalRegion})},onKeyboardShortcut:function(t){e.fireKeyboardShortcut({currentSelection:t.selectionArea,nativeEvent:t.event,keyUp:t.keyUp})},onColumnWidthChanged:function(t){e.fireChangeColumnWidth({newColumnWidths:t})},onRowHeightChanged:function(t){e.fireChangeRowHeight({newRowHeights:t})},onTitleHeightChanged:function(t){e.fireChangeTitleHeight({newHeight:t})},onContextMenu:function(t){e.fireContextMenu({row:t.row,column:t.col,nativeEvent:t.event,targetDescription:t.targetDescription,currentSelectionAreas:t.currentSelectionAreas,isTitle:t.isTitle})}};if(e.mEventRegistry["horizontalLimitReached"]){t.onReloadLimitReachedHorizontally=function(t,l){e.fireHorizontalLimitReached({scrollTop:t,scrollDown:l})}}if(e.mEventRegistry["verticalLimitReached"]){t.onReloadLimitReachedVertically=function(t,l){e.fireVerticalLimitReached({scrollLeft:t,scrollToRight:l})}}var l=o.fetchInitialTableModel(e.getId());e.mSacTable=new SACGridRendering.ReactTable(l,e.reactTableContainer,t)}}function d(e){return function(t){return e&&e.classList&&e.classList.contains(t)}}e.findAnchorElement=function(e){var t=e.getParent();return t}}return new i});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/utils/ModelHelper", ["sap/sac/grid/Format","sap/sac/grid/utils/CellStyle"],function(e,t){"use strict";function o(){var t=this;t.fetchSACTableCellTypeEnum=function(e){var t={Value:0,Header:1,Input:2,Chart:3,ColumnCoordinate:10,RowCoordinate:11,RowDimHeader:14,ColDimHeader:15,ColDimMember:16,RowDimMember:17,AttributeRowDimHeader:18,AttributeColDimHeader:19,AttributeRowDimMember:20,AttributeColDimMember:21,Custom:23,Comment:25,Image:31};return t[e]};t.fetchInitialTableModel=function(e){return{id:e+"-reactNode",hasFixedRowsCols:true,featureToggles:{dimHeaderCellsWithIcons:true,accessibilityKeyboardSupport:true},reversedHierarchy:true,freezeEndRow:0,freezeEndCol:0,classesToIgnore:[],showGrid:true,showCoordinateHeader:false,showFreezeLines:false,title:{titleStyle:{height:0},titleVisible:false,subtitleVisible:false},rows:[],columnSettings:[],totalHeight:0,totalWidth:0,dataRegionStartCol:0,dataRegionStartRow:0,dataRegionEndCol:0,dataRegionEndRow:0,dataRegionCornerCol:0,dataRegionCornerRow:0,lastRowIndex:0,dimensionCellCoordinatesInHeader:{},rowHeightSetting:"Compact",scrollPosition:{scrollLeft:0,scrollTop:0}}};t.getEmptyCellValues=function(t,o,l,r,i){var a={row:t,column:o,formatted:"",expanded:false,showDrillIcon:false,level:0,isInATotalsContext:false,hierarchyPaddingLeft:0,cellType:16,ColumnWidth:150};if(l==e.BusinessStyle){a.style={fillColor:t<r?i:"transparent"};a.styleUpdatedByUser=true}return a};t.getTableModelForNoData=function(e,t){return{id:t+"-reactNode",widgetHeight:400,widgetWidth:800,totalHeight:200,totalWidth:400,showGrid:true,hasFixedRowsCols:true,rows:[{row:0,fixed:true,cells:[{row:0,column:0,formatted:e,cellType:1,style:{},isInATotalsContext:true}],height:40}],columnSettings:[{column:0,width:200,fixed:true}]}};t.fetchCellHierarchyProperties=function(e,t,o){return{row:e,column:t,formatted:o,expanded:false,showDrillIcon:false,level:0,isInATotalsContext:false,hierarchyPaddingLeft:0,isOverallResults:false,showStyleLinesForDataLevel:false}}}return new o});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/utils/ResourceBundle", ["sap/sac/grid/utils/ResourceModel"],function(e){"use strict";return e.getResourceBundle()});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/utils/TableEventHandlers", ["sap/sac/grid/utils/Utilities"],function(e){"use strict";function t(){var t=this;t.onDrillIconClicked=function(e,t){var r=parseInt(e.col);var i=parseInt(e.row);var s=Object.keys(t.gridCells).length&&t.gridCells[i][r];var n=e.row>t.getRowLimit();if(n){t.mergeNewDataWithExisitngData=true}if(s){t.fireEvent("drill",{cell:s,keepOffset:n})}};t.onCellClicked=function(e,t){var r=parseInt(e.col);var i=parseInt(e.row);var s=e.event.srcElement;var n=Object.keys(t.gridCells).length&&t.gridCells[i][r];if(n&&s){t.fireEvent("rightClick",{cell:n,link:s})}};t.requestMoreRows=function(t,r){var i=t.getFixedRows();var s=t.rowCount-i;var n=t.getVirtualRows();var a=e.isScrollDown(t);var f=s<n;var o=t.getRowLimit();t.rowOffset=t.rowOffset?t.rowOffset:0;t.rowOffsetEnd=t.rowOffsetEnd?t.rowOffsetEnd:o;if(a&&f&&e.nextBatchDataFetchNeeded(t,r)){t.rowOffsetEnd=t.rowOffsetEnd+o;t.rowOffset=t.rowOffset+o;t.mergeNewDataWithExisitngData=true;t.fireEvent("requestMoreRows",{currentRow:t.rowOffset})}else{e.updateTableData(t)}}}return new t});
/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/sac/grid/utils/Utilities", ["sap/sac/grid/Format","sap/sac/grid/utils/ModelHelper","sap/ui/core/theming/Parameters"],function(e,t,a){"use strict";var r=function(){var r=this;r.cellTypeMapping=function(e,a){var r;switch(e){case"Title":r="RowDimHeader";break;case"Header":r="RowDimMember";break;case"Result":case"Standard":r=a?"ColDimHeader":"ColDimMember";break;default:r=a?"ColDimHeader":"ColDimMember"}return t.fetchSACTableCellTypeEnum(r)};function o(e){var t=e.displayText;var a=document.createElement("canvas");var r=a.getContext("2d");if(e.isBold){r.font="bold 16px arial"}else{r.font="16px arial"}return r.measureText(t)}function n(e){var t=e.width;if(e.actualBoundingBoxLeft!==undefined&&e.actualBoundingBoxRight!==undefined){t=Math.abs(e.actualBoundingBoxLeft)+Math.abs(e.actualBoundingBoxRight)}return Math.ceil(t)}r.calculateColumnWidth=function(e){var t=o(e);return n(t)+e.hierarchyPaddingLeft};r.decideWidgetDimensions=function(e,t,a){var r=0,o=0;var n=e._isExcelStyle();var i=t.columnSettings&&t.columnSettings.length;var l=t.columnSettings;r=this.calculateTotalWidth(i,l,n);var s=t.rows&&t.rows.length;var c=e._completeRowHeight();o=this.calculateTotalHeight(s,c,n);var u=this.getAnchorDimensions(e,a);var d=this.getReactTableComponentOfGrid(e);if(d){jQuery(d).css("height",u.anchorHeight)}t.widgetWidth=u.anchorWidth;t.widgetHeight=u.anchorHeight;t.totalHeight=o;t.totalWidth=r};r.getAnchorDimensions=function(e,t){var a=e.AnchorElement?e.AnchorElement:e;var r,o;if(a&&a.getDomRef){var n=jQuery(a.getDomRef());r=n.width();o=n.height()}var i=e.AnchorDimensions?e.AnchorDimensions:{anchorWidth:0,anchorHeight:0};if(!t){o=i.anchorHeight>o?i.anchorHeight:o}e.AnchorDimensions={anchorWidth:r,anchorHeight:o};return e.AnchorDimensions};r.calculateTotalHeight=function(e,t,a){if(a){return e*(t+1)}else{return e*t}};r.calculateTotalWidth=function(e,t,a){var r=0;t.forEach(function(e){r=r+e.width});if(a){return r+e*1}else{return r}};r.updateTableData=function(e,t){if(e.mSacTable){var a=function(){document.getElementById(e.getId()).appendChild(e.reactTableContainer);e.mSacTable.reapplyScrollPosition();var t=e.AnchorDimensions;var a=r.getReactTableComponentOfGrid(e);if(a&&t){jQuery(a).css("height",t.anchorHeight)}};var o=t?t:e.mSacTable.cachedData;e.mSacTable.updateTableData(o,a)}};r.getDrillState=function(e){var t;if(e=="sap-icon://slim-arrow-down"||e=="sap-icon://slim-arrow-up"){t="Expanded"}else if(e=="sap-icon://slim-arrow-right"){t="Collapsed"}return t};r.getHierarchyInfo=function(a,r,o,n,i,l){var s=r.getRow();var c=r.getColumn();var u=r.getDisplayValue();var d=0;var h=r.data();var f=t.fetchCellHierarchyProperties(s,c,u);var g=r.getIcon();var m=this.getDrillState(g);var v=r.getDisplayLevel();f["expanded"]=m==="Expanded"?true:false;f["showDrillIcon"]=typeof g!="undefined"&&g!=""?true:false;f["level"]=v;f["isInATotalsContext"]=f["showDrillIcon"];if(f["showDrillIcon"]&&s>=i){f["isInATotalsContext"]=true;f["showStyleLinesForDataLevel"]=true}else{for(d=0;d<n;d++){if(o[s][d]&&o[s][d].isInATotalsContext&&!o[s][d].isOverallResults){f["isInATotalsContext"]=true;f["level"]=o[s][d].level;f["showStyleLinesForDataLevel"]=true;break}}}f["hierarchyPaddingLeft"]=v===0?8:2*v*8;f["isInHierarchy"]=v===0?false:true;if(a==e.BusinessStyle){var C=h["cellDimension"]=="NonMeasureStructure";if(C){f["isInATotalsContext"]=true}}var p=h["cellMember"];if(p&&(p.toLowerCase()=="total"||p=="!SUMME")){f["isInATotalsContext"]=true;f["isOverallResults"]=true;if(s<i){l["columns"].push(c)}else{l["rows"].push(s)}}else{f["isOverallResults"]=l["columns"].includes(c)||l["rows"].includes(s);f["isInATotalsContext"]=f["isInATotalsContext"]?f["isInATotalsContext"]:f["isOverallResults"]}return f};r.fillMissingIndexes=function(e,r){var o=e._getFormat();var n=e.getFixedRows();var i=a.get("sapUiListHeaderBackground");for(var l in r){var s=r[l];for(var c=0;c<e.columnCount;c++){if(s[c]==undefined){s[c]=t.getEmptyCellValues(parseInt(l),c,o,n,i)}}}};r.getRowCount=function(e){if(e.rowCount){return e.rowCount}else{var t=e.getFixedRows();var a=e.getVirtualRows();var r=e.getRowLimit();return t+a<r?t+a:r}};r.getMaxRows=function(e){var t=e.getFixedRows();var a=e.getVirtualRows();return t+a};r.getColumnCount=function(e){if(e.columnCount){return e.columnCount}else{var t=e.getFixedColumns();var a=e.getVirtualColumns();var r=e.getColumLimit();return t+a<r?t+a:r}};r.getMaxColumns=function(e){var t=e.getFixedColumns();var a=e.getVirtualColumns();return t+a};r.showNoDataInSacTable=function(e,a){var r=t.getTableModelForNoData(e,a.getId());this.storePropertiesToControl(a,false,0,0,{});this.updateTableData(a,r);this.addRemoveCssClassToReactTable(true,"noDataInTable",a)};r.addRemoveCssClassToReactTable=function(e,t,a){var r=this.getReactTableComponentOfGrid(a);if(e&&r){r.classList.add(t)}else if(r){r.classList.remove(t)}};r.storePropertiesToControl=function(e,t,a,r,o){e.reversedHierarchy=t;e.columnCount=a+1;e.rowCount=r+1;e.gridCells=o};r.addRowsAndColumnSettingsToTableModel=function(e,t,a){var r=e.getRowHeight();var o=e.getFixedRows();if(e.mergeNewDataWithExisitngData){var n=t.rows;var l=this.formTableDataRowsArray(a,r,o);var s=l.splice(0,o);Array.prototype.splice.apply(n,[0,o].concat(s));var c=l[0].row;n.splice(c);t.rows=n.concat(l)}else{t.rows=this.formTableDataRowsArray(a,r,o)}i(t.rows);var u=this.getColumnCount(e);var d=e.getFixedColumns();t.columnSettings=this.formTableDataColumnSettingsArray(t.rows,u,d)};r.formTableDataRowsArray=function(e,t,a){return Object.keys(e).map(function(r,o){return{row:parseInt(r),height:t,cells:e[r],fixed:parseInt(r)<a}})};r.formTableDataColumnSettingsArray=function(e,t,a){return Array.from(Array(t).keys()).map(function(t){return{column:t,minWidth:150,width:e[0].cells[t]?e[0].cells[t].ColumnWidth:150,id:t.toString(),fixed:t<a,hasWrapCell:false,emptyColumn:false}})};function i(e){var a=e[0].cells;for(var r=1;r<e.length;r++){var o=e[r].cells;for(var n=0;n<o.length;n++){var i=o[n];if(!a[n]){a[n]=t.getEmptyCellValues(0,n);a[n].ColumnWidth=150}if(!i.ColumnWidth||i.ColumnWidth>a[n].ColumnWidth){a[n].ColumnWidth=i.ColumnWidth}}}}r.addDataRegionPropertiesToTableModel=function(e,t){t.reversedHierarchy=e.reversedHierarchy;t.dataRegionEndCol=t.columnSettings.length-1;t.dataRegionEndRow=t.rows.length-1;t.lastRowIndex=t.rows.length-1;t.dataRegionStartCol=0;t.dataRegionStartRow=0;t.dataRegionCornerCol=e.getFixedColumns();t.dataRegionCornerRow=e.getFixedRows();t.freezeEndRow=e.getFixedRows()-1;t.freezeEndCol=e.getFixedColumns()-1};r.getReactTableComponentOfGrid=function(e){var t;if(e){var a=e.getDomRef()&&e.getDomRef().getElementsByClassName("reactTableComponent");if(a&&a.length>0){t=a[0]}}return t};r.extractUsefulInfoFromCell=function(e){var t={};t.cellCustomata=jQuery.extend(true,{},e.data());t=Object.assign(t,e.mProperties);t.data=function(e){if(e){return t.cellCustomata[e]}else{return t.cellCustomata}};t.getCellType=function(){return t.cellType};return jQuery.extend(true,{},t)};r.nextBatchDataFetchNeeded=function(e,t){var a=false;var r=e.getFixedRows();var o=e.rowCount-r;var n=o;var i=e._completeRowHeight();var l=Math.ceil(t/i);var s=e.AnchorDimensions&&e.AnchorDimensions.anchorHeight;var c=Math.ceil(s/i);var u=3*c;if(l>n-u){a=true}return a};r.isScrollDown=function(e){var t=e.oldScrollPosition?e.oldScrollPosition:{scrollTop:0,scrollLeft:0};var a=e.mSacTable.scrollPosition?e.mSacTable.scrollPosition:{scrollTop:0,scrollLeft:0};if(t.scrollTop<a.scrollTop){e.oldScrollPosition=e.mSacTable.scrollPosition;return true}e.oldScrollPosition=e.mSacTable.scrollPosition;return false}};return new r});
sap.ui.require.preload({
	"sap/sac/grid/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.sac.grid","type":"library","embeds":[],"i18n":{"bundleUrl":"messagebundle.properties","supportedLocales":[""]},"applicationVersion":{"version":"1.108.0"},"title":"{{title}}","description":"{{sap.sac.grid}}","ach":"LOD-ANA-TAB","resources":"resources.json","offline":false,"openSourceComponents":[{"name":"React","packagedWithMySelf":true,"version":"v16.13.1"}]},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw","sap_hcb","sap_horizon","sap_horizon_dark","sap_horizon_hcb","sap_horizon_hcw"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.108","libs":{"sap.m":{"minVersion":"1.108.0"},"sap.ui.core":{"minVersion":"1.108.0"}}},"contentDensities":{"cozy":false,"compact":true},"library":{"i18n":{"bundleUrl":"messagebundle.properties","supportedLocales":[""]},"content":{"controls":["sap.sac.grid.Grid"],"elements":["sap.sac.grid.Cell","sap.sac.grid.SemanticStyle"],"types":["sap.sac.grid.AlertLevel","sap.sac.grid.CellType","sap.sac.grid.Format"],"interfaces":[]}}}}'
});
//# sourceMappingURL=library-preload.js.map