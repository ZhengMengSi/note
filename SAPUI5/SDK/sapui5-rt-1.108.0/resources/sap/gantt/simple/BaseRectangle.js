/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseShape","./RenderUtils","./GanttUtils","../misc/Format","../misc/Utility","../library","./BaseText"],function(t,e,i,r,a,n,s){"use strict";var h=n.simple.shapes.ShapeAlignment;var o=t.extend("sap.gantt.simple.BaseRectangle",{metadata:{library:"sap.gantt",properties:{x:{type:"sap.gantt.SVGLength"},y:{type:"sap.gantt.SVGLength"},width:{type:"sap.gantt.SVGLength"},height:{type:"sap.gantt.SVGLength",defaultValue:"auto"},rx:{type:"sap.gantt.SVGLength",group:"Appearance",defaultValue:0},ry:{type:"sap.gantt.SVGLength",group:"Appearance",defaultValue:0}}},renderer:{apiVersion:2}});var p=["x","y","width","height","style","rx","ry","filter","opacity","transform"];o.prototype.getX=function(){return i.getValueX(this)};o.prototype.getY=function(){var t=this.getProperty("y"),e=1;if(t===null||t===undefined){var i=Number(this.getHeight());t=this.getRowYCenter()-i/2;if(this._iBaseRowHeight!=undefined){if(this.getAlignShape()==h.Top){t=this.getRowYCenter()-this._iBaseRowHeight/2+e}else if(this.getAlignShape()==h.Bottom){t=this.getRowYCenter()+this._iBaseRowHeight/2-i-e}t=parseInt(t,10)}}return t};o.prototype.getWidth=function(){var t=this.getProperty("width");if(t!==null&&t!==undefined){return t}var e=this.getAxisTime();if(e==null){return 0}var i,a=e.timeToView(r.abapTimestampToDate(this.getTime())),n=e.timeToView(r.abapTimestampToDate(this.getEndTime()));if(!jQuery.isNumeric(a)||!jQuery.isNumeric(n)){return 0}i=Math.abs(n-a);i=i<1?1:i;return i};o.prototype.getHeight=function(){var t=this.getProperty("height");if(t==="auto"){return parseFloat(this._iBaseRowHeight*.625,10)}if(t==="inherit"){return this._iBaseRowHeight}return t};o.prototype.getStyle=function(){var e=t.prototype.getStyle.apply(this,arguments);var i={fill:this.determineValueColor(this.getFill()),"stroke-dasharray":this.getStrokeDasharray(),"fill-opacity":this.getFillOpacity(),"stroke-opacity":this.getStrokeOpacity()};return e+this.getInlineStyle(i)};o.prototype._isValid=function(){var t=this.getX();return t!==undefined&&t!==null};o.prototype.renderElement=function(i,r){if(!this._isValid()){return}this.writeElementData(i,"rect",true);if(this.aCustomStyleClasses){this.aCustomStyleClasses.forEach(function(t){i.class(t)})}e.renderAttributes(i,r,p);i.openEnd();e.renderTooltip(i,r);if(this.getShowAnimation()){e.renderElementAnimation(i,r)}i.close("rect");if(!r.isA("sap.gantt.simple.BaseCalendar")&&this.getShowTitle()){e.renderElementTitle(i,r,function(t){return new s(t)})}t.prototype.renderElement.apply(this,arguments)};o.prototype.getShapeAnchors=function(){var t=a.getShapeBias(this);return{head:{x:this.getX()+t.x,y:this.getY()+this.getHeight()/2+t.y,dx:0,dy:this.getHeight()/2},tail:{x:this.getX()+this.getWidth()+t.x,y:this.getY()+this.getHeight()/2+t.y,dx:0,dy:this.getHeight()/2}}};return o},true);
//# sourceMappingURL=BaseRectangle.js.map