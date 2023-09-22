/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/Device","sap/ui/base/Object","sap/gantt/misc/ShapeManager","sap/gantt/misc/Format","sap/ui/core/Core","sap/gantt/misc/Utility","sap/gantt/drawer/ShapeInRow"],function(q,D,B,S,F,C,U,a){"use strict";var b=B.extend("sap.gantt.eventHandler.ShapeResizeHandler",{constructor:function(c){B.call(this);this._oSourceChart=c;this._bResizing=false;this._oResizingData=undefined;this._oShapeManager=c._oShapeManager;this._oSourceChartId=this._oSourceChart.getId();this._oShapeInRowDrawer=new a();this._DEFAULT_RESIZE_CURSOR_SHOWING_THRESHOLD=1;this._DEFAULT_MOUSE_MOVE_PIXEL=3;this._TIMESTAMP_START_TIME_KEY="time";this._TIMESTAMP_END_TIME_KEY="endTime";}});b.prototype.getIsResizing=function(){return this._bResizing;};b.prototype.getResizingData=function(){return this._oResizingData;};b.prototype.handleShapeResize=function(e){if(e.button===0){var s=d3.select(e.target).datum();if(e.target.getAttribute("class")&&s){var c=e.target.getAttribute("class").split(" ")[0];if(d3.select(e.target).classed("sapUiShapeResizingCursor")&&this._oShapeManager.isShapeResizable(s,c)&&this._oShapeManager.isShapeDuration(s,c)){this._handleShapeResizeStart(e);this._preventBubbleAndDefault(e);}}}};b.prototype._handleShapeResizeStart=function(e){var s=q(this._oSourceChart.getDomSelectorById("svg"));var c=d3.select(e.target).datum();if(c){var r=U.getRowDatumByShapeUid(c.uid,this._oSourceChart.getId());if(r){r.y=this._oSourceChart._oAxisOrdinal.elementToView(r.uid);var x=e.pageX-s.offset().left||e.offsetX;var t=this._getTopShapeInstance(c,e.target.getAttribute("class").split(" ")[0]);var d,f;if(t){if(C.getConfiguration().getRTL()===true){d=t.getEndTime(c);f=t.getTime(c);}else{d=t.getTime(c);f=t.getEndTime(c);}}var o={"shapeData":c,"objectInfoRef":r};this._oResizingData={"oShapeData":o,"aOldTime":[d,f],"resizeStartPointX":x,"topShapeInstance":t};q(document.body).unbind("mousemove.shapeResizing");q(document.body).unbind("mouseup.shapeResizing");q(document.body).bind("mousemove.shapeResizing",this._handleShapeResizing.bind(this));q(document.body).bind("mouseup.shapeResizing",this._handleShapeResizeEnd.bind(this));}}};b.prototype.checkShapeResizable=function(s,t,p){if(s&&t&&p){q(t).removeClass("sapUiShapeResizingCursor");var c=t.getAttribute("class")?t.getAttribute("class").split(" ")[0]:undefined;if(!c||c.indexOf("__")<0){return;}if(this._oShapeManager.isShapeResizable(s,c)){var h,d,e;var o=this._getShapeInstance(s,c);if(o){var f=o.getTime(s);var E=o.getEndTime(s);d=this._oSourceChart.getAxisTime().timeToView(F.abapTimestampToDate(f));e=this._oSourceChart.getAxisTime().timeToView(F.abapTimestampToDate(E));h=Math.abs(e-p)<Math.abs(d-p)?Math.abs(e-p):Math.abs(d-p);}if(h<=this._DEFAULT_RESIZE_CURSOR_SHOWING_THRESHOLD&&!this._oSourceChart._bDragging){q(t).addClass("sapUiShapeResizingCursor");}else{q(t).removeClass("sapUiShapeResizingCursor");}}}};b.prototype._preventBubbleAndDefault=function(e){e.preventDefault();e.stopPropagation();};b.prototype._handleShapeResizing=function(e){if(!D.support.touch&&(e.button!==0||e.buttons===0||e.ctrlKey)){return false;}var s=q(this._oSourceChart.getDomSelectorById("svg"));var d=Math.abs((e.pageX-s.offset().left||e.offsetX)-this._oResizingData.resizeStartPointX);if(d>this._DEFAULT_MOUSE_MOVE_PIXEL){if(this._oResizingData!==undefined){this._updateResizingShapeData(e);this._bResizing=true;this._oSourceChart._oAutoScrollHandler.autoScroll(this._oSourceChart,e);}}};b.prototype._handleShapeResizingWhenAutoScroll=function(){if(this.getIsResizing()){this._updateResizingShapeData(this._oLastEvent);}};b.prototype._updateResizingShapeData=function(e){this._oLastEvent=e;var s=q(this._oSourceChart.getDomSelectorById("svg"));var c=e.pageX-s.offset().left||e.offsetX;var r=this._calculateResizedNewTime(c);this._drawResizingShadow(r);};b.prototype._parseShapeTimeProperty=function(s,A){var p;if(s.mShapeConfig.hasShapeProperty(A)){var c=s.mShapeConfig.getShapeProperty(A);if(typeof c==="string"&&c.charAt(0)==="{"&&c.charAt(c.length-1)==="}"){p=c.substring(1,c.length-1);}}return p;};b.prototype._drawResizingShadow=function(r){var s=d3.select(this._oSourceChart.getDomSelectorById("svg"));if(r){var c=q.extend(true,{},this._oResizingData.oShapeData.shapeData);var o=this._oResizingData.topShapeInstance.getAggregation("resizeShadowShape");var d=this._parseShapeTimeProperty(o,this._TIMESTAMP_START_TIME_KEY);var e=this._parseShapeTimeProperty(o,this._TIMESTAMP_END_TIME_KEY);var n,N;if(C.getConfiguration().getRTL()===true){n=r[1];N=r[0];}else{n=r[0];N=r[1];}if(c[d]){c[d]=n;}if(c[e]){c[e]=N;}var f={"objectInfoRef":this._oResizingData.oShapeData.objectInfoRef};f.shapeData=c;o.dataSet=[f];this._oShapeInRowDrawer.drawResizeShadow(s,o,this._oSourceChart.getAxisTime(),this._oSourceChart._oAxisOrdinal,this._oSourceChart._oStatusSet);}};b.prototype._calculateResizedNewTime=function(c){var r=[];var n,N;var o=this._oResizingData.aOldTime[0];var d=this._oResizingData.aOldTime[1];var e=this._oSourceChart.getAxisTime().timeToView(F.abapTimestampToDate(o));var f=this._oSourceChart.getAxisTime().timeToView(F.abapTimestampToDate(d));var i;if(this._oResizingData.isLeftSideClick!==undefined&&this._oResizingData.isLeftSideClick!==null){i=this._oResizingData.isLeftSideClick;}else{i=Math.abs(this._oResizingData.resizeStartPointX-e)<Math.abs(this._oResizingData.resizeStartPointX-f)?true:false;this._oResizingData.isLeftSideClick=i;}if(i){N=d;if(c>=f){n=d;}else{n=F.dateToAbapTimestamp(this._oSourceChart.getAxisTime().viewToTime(c));}}else{n=o;if(c<=e){N=o;}else{N=F.dateToAbapTimestamp(this._oSourceChart.getAxisTime().viewToTime(c));}}r=[n,N];return r;};b.prototype._getShapeInstance=function(s,c){var m=this._oShapeManager.getShapeInstance(s,c);if(m){if(m.getId()===c){return m;}else if(m.getShapes()){var d=m.getShapes();for(var i=0;i<d.length;i++){if(d[i].getId()===c){return d[i];}}}}else{var t=C.byId(c).getParent();if(t){return t;}}return undefined;};b.prototype._getTopShapeInstance=function(s,c){var m=this._oShapeManager.getShapeInstance(s,c);if(m){return m;}else{var t=C.byId(c).getParent();if(t){return t;}}return undefined;};b.prototype._handleShapeResizeEnd=function(e){this._oSourceChart._oAutoScrollHandler.stop();var r=d3.selectAll(".resizingShadow");if(!r.empty()){r.remove();}if(this._bResizing&&this._oResizingData!==undefined){this._collectResizingShapeData(e);this._oSourceChart.fireShapeResizeEnd({shapeUid:this._oResizingData.oShapeData.shapeData.uid,rowObject:this._oResizingData.oShapeData.objectInfoRef,oldTime:this._oResizingData.aOldTime,newTime:this._oResizingData.aNewTime});}q(document.body).unbind("mousemove.shapeResizing");q(document.body).unbind("mouseup.shapeResizing");q(e.target).removeClass("sapUiShapeResizingCursor");this._bResizing=false;this._oResizingData=undefined;this._oLastEvent=undefined;};b.prototype._collectResizingShapeData=function(e){var s=q(this._oSourceChart.getDomSelectorById("svg"));var c=e.pageX-s.offset().left||e.offsetX;var r=this._calculateResizedNewTime(c);var n,N;if(C.getConfiguration().getRTL()===true){n=r[1];N=r[0];}else{n=r[0];N=r[1];}this._oResizingData.aNewTime=[n,N];};return b;},true);