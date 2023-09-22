/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/base/EventProvider","./GanttUtils"],function(e,t,d){"use strict";var i=e.SelectionMode;var l=t.extend("sap.gantt.simple.SelectionModel",{constructor:function(e){t.apply(this,arguments);this.sSelectionMode=e||i.Single;this.mSelected={uid:{},shapeId:{},rowId:{},deSelectShapeId:{},deSelectRowId:{}}}});l.prototype.getSelectionMode=function(){return this.sSelectionMode};l.prototype.setSelectionMode=function(e){this.sSelectionMode=e||i.Single;return this};l.prototype.updateShape=function(e,t){var d=this.getSelectionMode();if(d==="None"){return}if(!e){if(d===i.Single||d===i.Multiple||d===i.MultiWithKeyboard&&!t.ctrl||d===i.MultipleWithLasso||d===i.MultiWithKeyboardAndLasso&&!t.ctrl){this.clear(false)}return}if(t.selected&&!this.mSelected.uid[e]){var l=Object.keys(this.mSelected.uid);if(this.sSelectionMode===i.Single){this.mSelected.uid={}}else if(this.sSelectionMode===i.MultiWithKeyboard||this.sSelectionMode===i.MultiWithKeyboardAndLasso){if(t.ctrl){l=[]}else{this.mSelected.uid={}}}else if(this.sSelectionMode===i.Multiple||this.sSelectionMode===i.MultipleWithLasso){l=[]}this._updateSelectedShape(e,t);this._fireSelectionChanged(l)}else if(!t.selected&&this.mSelected.uid[e]){delete this.mSelected.uid[e];this._fireSelectionChanged([e])}};l.prototype.updateShapes=function(e){if(!e){return}var t=[];var d=Object.keys(e);for(var i=0;i<d.length;i++){var l=d[i];var c=e[d[i]];if(c&&c.selected&&!this.mSelected.uid[l]){this._updateSelectedShape(l,c)}else if(c&&!c.selected&&this.mSelected.uid[l]){delete this.mSelected.uid[l];t.push(l)}}this._fireSelectionChanged(t)};l.prototype.updateProperties=function(e,t,d){if(this.mSelected.uid[e]){this.mSelected.uid[e].draggable=t.draggable;this.mSelected.uid[e].time=t.time;this.mSelected.uid[e].endTime=t.endTime}else if(d){this._updateSelectedShape(e,t)}};l.prototype._updateSelectedShape=function(e,t){this.mSelected.uid[e]={shapeUid:e,draggable:t.draggable,time:t.time,endTime:t.endTime}};l.prototype._fireSelectionChanged=function(e,t,d,i){var l={shapeUid:Object.keys(this.mSelected.uid),deselectedUid:e,silent:!!t,deSelectAll:i};if(l.shapeUid.length>0||l.deselectedUid.length>0||d){this.fireSelectionChanged(l)}};l.prototype.clearSelectionByUid=function(e){if(this.existed(e)){delete this.mSelected.uid[e]}};l.prototype.existed=function(e){return!!this.mSelected.uid[e]};l.prototype.clear=function(e){if(this.mSelected.uid.length===0){return false}var t=this.allUid();this.mSelected.uid={};this.mSelected.shapeId={};this.mSelected.rowId={};this._fireSelectionChanged(t,e);return true};l.prototype.allUid=function(){return Object.keys(this.mSelected.uid)};l.prototype.numberOfSelectedDraggableShapes=function(){return this.allSelectedDraggableUid().length};l.prototype.allSelectedDraggableUid=function(){return Object.keys(this.mSelected.uid).filter(function(e){return this.mSelected.uid[e].draggable}.bind(this))};l.prototype.updateSelectedShapes=function(e,t){var d=[];this.mSelected.deSelectRowId={};if(!e||e.length===0){this.mSelected.deSelectShapeId=this.mSelected.shapeId;this.mSelected.shapeId={}}if(t){d=this.allUid();this.mSelected.uid={};this.mSelected.shapeId={}}e.forEach(function(e){if(e.Selected){this.mSelected.deSelectShapeId={};if(e.ShapeId&&!this.mSelected.shapeId[e.ShapeId]){this.mSelected.shapeId[e.ShapeId]={selected:e.Selected}}else if(e.rowId&&!this.mSelected.rowId[e.rowId]){this.mSelected.rowId[e.rowId]={selected:e.Selected}}}else{if(e.ShapeId&&this.mSelected.shapeId[e.ShapeId]){delete this.mSelected.shapeId[e.ShapeId];this.mSelected.deSelectShapeId[e.ShapeId]={selected:e.Selected}}else if(e.ShapeId&&!this.mSelected.shapeId[e.ShapeId]){this.mSelected.deSelectShapeId[e.ShapeId]={selected:e.Selected}}else if(e.rowId&&this.mSelected.rowId[e.rowId]){delete this.mSelected.rowId[e.rowId];this.mSelected.deSelectRowId[e.rowId]={selected:e.Selected}}else if(e.rowId&&!this.mSelected.rowId[e.rowId]){this.mSelected.deSelectRowId[e.rowId]={selected:e.Selected}}}}.bind(this));if(e.length>0){var i=[];Object.keys(this.mSelected.deSelectShapeId).forEach(function(e){var t=jQuery("[data-sap-gantt-shape-id='"+e+"']").get(0),d=sap.ui.getCore().byId(t&&t.id);i.push(d&&d.getShapeUid())});d=i?i:d}this._fireSelectionChanged(d,true,true,false)};l.prototype.clearAllSelectedShapeIds=function(){this.mSelected.deSelectShapeId=this.mSelected.shapeId;this.mSelected.deSelectRowId=this.mSelected.rowId;this.mSelected.shapeId={};this.mSelected.rowId={};var e=this.allUid();this.mSelected.uid={};this._fireSelectionChanged(e,true,true,true)};l.prototype.getSelectedShapeIDS=function(){return Object.keys(this.mSelected.shapeId)};l.prototype.getSelectedRowIDS=function(){return Object.keys(this.mSelected.rowId)};l.prototype.getDeSelectedShapeIDS=function(){return Object.keys(this.mSelected.deSelectShapeId)};l.prototype.getDeSelectedRowIDS=function(){return Object.keys(this.mSelected.deSelectRowId)};l.prototype.updateShapeId=function(e,t){if(t){if(!this.mSelected.shapeId[e]){this.mSelected.shapeId[e]={selected:t}}if(this.mSelected.deSelectShapeId[e]){delete this.mSelected.deSelectShapeId[e]}}else{if(this.mSelected.shapeId[e]){delete this.mSelected.shapeId[e]}if(!this.mSelected.deSelectShapeId[e]){this.mSelected.deSelectShapeId[e]={selected:t}}}};l.prototype.clearDeselectionModelById=function(e){if(this.mSelected.deSelectShapeId[e]){delete this.mSelected.deSelectShapeId[e]}};l.prototype.getSelectedShapeDataByUid=function(e){return this.mSelected.uid[e]};l.prototype.attachSelectionChanged=function(e,t,d){this.attachEvent("selectionChanged",e,t,d)};l.prototype.detachSelectionChanged=function(e,t){this.detachEvent("selectionChanged",e,t)};l.prototype.fireSelectionChanged=function(e){this.fireEvent("selectionChanged",e);return this};return l},true);
//# sourceMappingURL=SelectionModel.js.map