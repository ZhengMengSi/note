/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/dt/Plugin","sap/ui/dt/DOMUtil","sap/ui/dt/OverlayUtil","sap/ui/dt/OverlayRegistry","sap/ui/thirdparty/jquery","sap/ui/Device"],function(t,e,r,a,o,jQuery,n){"use strict";var i=e.extend("sap.ui.dt.plugin.DragDrop",{metadata:{abstract:true,library:"sap.ui.dt",properties:{},associations:{},events:{}}});var g=7;var s=false;var h;i.prototype._preventScrollOnTouch=function(t){if(s){t.preventDefault()}};i.prototype.init=function(){e.prototype.init.apply(this,arguments);document.addEventListener("touchmove",this._preventScrollOnTouch,true);this._dragScrollHandler=this._dragScroll.bind(this);this._dragLeaveHandler=this._dragLeave.bind(this);this._mScrollIntervals={}};i.prototype.exit=function(){e.prototype.exit.apply(this,arguments);document.removeEventListener("touchmove",this._preventScrollOnTouch);delete this._mElementOverlayDelegate;delete this._mAggregationOverlayDelegate;delete this._dragScrollHandler};i.prototype.registerElementOverlay=function(t){t.attachEvent("movableChange",this._onMovableChange,this);if(t.isMovable()){this._attachDragEvents(t)}t.attachBrowserEvent("dragover",this._onDragOver,this);t.attachBrowserEvent("dragenter",this._onDragEnter,this);t.attachBrowserEvent("dragleave",this._onDragLeave,this)};i.prototype.registerAggregationOverlay=function(t){t.attachTargetZoneChange(this._onAggregationTargetZoneChange,this);if(!n.browser.webkit){this._attachDragScrollHandler(t)}};i.prototype.deregisterElementOverlay=function(t){t.detachEvent("movableChange",this._onMovableChange,this);this._detachDragEvents(t);t.detachBrowserEvent("dragover",this._onDragOver,this);t.detachBrowserEvent("dragenter",this._onDragEnter,this);t.detachBrowserEvent("dragleave",this._onDragLeave,this)};i.prototype.deregisterAggregationOverlay=function(t){t.detachTargetZoneChange(this._onAggregationTargetZoneChange,this);if(!n.browser.webkit){this._removeDragScrollHandler(t);this._clearScrollIntervalFor(t.$().attr("id"))}};i.prototype._attachDragEvents=function(t){t.attachBrowserEvent("dragstart",this._onDragStart,this);t.attachBrowserEvent("drag",this._onDrag,this);t.attachBrowserEvent("dragend",this._onDragEnd,this);t.attachBrowserEvent("touchstart",this._onTouchStart,this)};i.prototype._detachDragEvents=function(t){t.detachBrowserEvent("dragstart",this._onDragStart,this);t.detachBrowserEvent("drag",this._onDrag,this);t.detachBrowserEvent("dragend",this._onDragEnd,this);t.detachBrowserEvent("touchstart",this._onTouchStart,this)};i.prototype.onMovableChange=function(){};i.prototype.onDragStart=function(){};i.prototype.onDragEnd=function(){};i.prototype.onDrag=function(){};i.prototype.onDragEnter=function(){};i.prototype.onDragLeave=function(){};i.prototype.onDragOver=function(){};i.prototype.onAggregationDragEnter=function(){};i.prototype.onAggregationDragOver=function(){};i.prototype.onAggregationDragLeave=function(){};i.prototype.onAggregationDrop=function(){};i.prototype._checkMovable=function(t){if(t.isMovable()||r.getDraggable(t.$())!==undefined){r.setDraggable(t.$(),t.isMovable())}};i.prototype._onMovableChange=function(t){var e=t.getSource();if(e.isMovable()){this._attachDragEvents(e)}else{this._detachDragEvents(e)}this.onMovableChange(e)};i.prototype._onDragStart=function(t){var e=o.getOverlay(t.currentTarget.id);t.stopPropagation();if(n.browser.firefox&&t&&t.originalEvent&&t.originalEvent.dataTransfer&&t.originalEvent.dataTransfer.setData){t.originalEvent.dataTransfer.setData("text/plain","")}this.setBusy(true);this.showGhost(e,t);this.onDragStart(e)};i.prototype._attachTouchDragEvents=function(t){t.attachBrowserEvent("touchmove",this._onTouchMove,this);t.attachBrowserEvent("touchend",this._onTouchEnd,this)};i.prototype._detachTouchDragEvents=function(t){t.detachBrowserEvent("touchmove",this._onTouchMove,this);t.detachBrowserEvent("touchend",this._onTouchEnd,this)};i.prototype._onTouchStart=function(t){var e=t.touches[0].pageX;var r=t.touches[0].pageY;var a=o.getOverlay(t.currentTarget.id);function n(){a.detachBrowserEvent("touchmove",h,this);a.detachBrowserEvent("touchend",v,this);a.detachBrowserEvent("contextmenu",v,this)}function i(t,a){var o=e-t;var n=r-a;return Math.sqrt(o*o+n*n)}function h(t){var e=t.touches[0].pageX;var r=t.touches[0].pageY;var o=i(e,r);if(o>g){this.onDragStart(a);n.call(this);this._attachTouchDragEvents(a)}}function v(){n.call(this);s=false}s=true;t.stopPropagation();a.attachBrowserEvent("touchmove",h,this);a.attachBrowserEvent("contextmenu",v,this);a.attachBrowserEvent("touchend",v,this)};i.prototype._getTargetOverlay=function(e){if(t.isA(e,"sap.ui.dt.Overlay")){var r;if(t.isA(e,"sap.ui.dt.AggregationOverlay")&&e.getTargetZone()){r=e}else if(t.isA(e,"sap.ui.dt.ElementOverlay")&&a.isInTargetZoneAggregation(e)){r=e}return r||this._getTargetOverlay(e.getParent())}};i.prototype._findTargetOverlayFromCoordinates=function(t,e){var r=document.elementFromPoint(t,e);var a=r?sap.ui.getCore().byId(r.id):undefined;return this._getTargetOverlay(a)};i.prototype._onTouchMove=function(e){var r=o.getOverlay(e.currentTarget.id);this.onDrag(r);var a=e.touches||e.changedTouches;var n=a[0].pageX;var i=a[0].pageY;var g=this._findTargetOverlayFromCoordinates(n,i);if(!g){return}if(g!==h){if(h){if(t.isA(h,"sap.ui.dt.AggregationOverlay")){this.onAggregationDragLeave(h)}else{this.onDragLeave(h)}}h=g;if(t.isA(g,"sap.ui.dt.AggregationOverlay")){this.onAggregationDragEnter(g)}else{this.onDragEnter(g)}}if(t.isA(g,"sap.ui.dt.AggregationOverlay")){this.onAggregationDragOver(g)}else{this.onDragOver(g)}e.stopPropagation()};i.prototype._getValidTargetZoneAggregationOverlay=function(e){if(t.isA(e,"sap.ui.dt.AggregationOverlay")&&e.getTargetZone()){return e}return this._getValidTargetZoneAggregationOverlay(e.getParent())};i.prototype._onTouchEnd=function(t){var e=o.getOverlay(t.currentTarget.id);var r=this._getValidTargetZoneAggregationOverlay(e);if(r){this.onAggregationDrop(r)}this.onDragEnd(e);this._detachTouchDragEvents(e);h=undefined;s=false};i.prototype.showGhost=function(t,e){if(e&&e.originalEvent&&e.originalEvent.dataTransfer){if(e.originalEvent.dataTransfer.setDragImage){this._$ghost=this.createGhost(t,e);this._$ghost.appendTo("#overlay-container");setTimeout(function(){this._removeGhost()}.bind(this),0);e.originalEvent.dataTransfer.setDragImage(this._$ghost.get(0),e.originalEvent.pageX-t.$().offset().left,e.originalEvent.pageY-t.$().offset().top)}}};i.prototype._removeGhost=function(){this.removeGhost();delete this._$ghost};i.prototype.removeGhost=function(){var t=this.getGhost();if(t){t.remove()}};i.prototype.createGhost=function(t){var e=t.getAssociatedDomRef();var a;if(!e){e=this._getAssociatedDomCopy(t);a=e}else{a=jQuery("<div></div>");jQuery.makeArray(e).forEach(function(t){r.cloneDOMAndStyles(t,a)})}var o=jQuery("<div></div>").addClass("sapUiDtDragGhostWrapper");return o.append(a.addClass("sapUiDtDragGhost"))};i.prototype._getAssociatedDomCopy=function(t){var e=jQuery("<div></div>");t.getAggregationOverlays().forEach(function(t){t.getChildren().forEach(function(t){var a=t.getAssociatedDomRef();if(a){r.cloneDOMAndStyles(a,e)}else{r.cloneDOMAndStyles(this._getAssociatedDomCopy(t),e)}},this)},this);return e};i.prototype.getGhost=function(){return this._$ghost};i.prototype._onDragEnd=function(t){this.setBusy(false);var e=o.getOverlay(t.currentTarget.id);this._removeGhost();this._clearAllScrollIntervals();this.onDragEnd(e);t.stopPropagation()};i.prototype._onDrag=function(t){var e=o.getOverlay(t.currentTarget.id);this.onDrag(e);t.stopPropagation()};i.prototype._onDragEnter=function(t){var e=o.getOverlay(t.currentTarget.id);if(a.isInTargetZoneAggregation(e)){if(!this.onDragEnter(e)){t.stopPropagation()}}t.preventDefault()};i.prototype._onDragLeave=function(t){var e=o.getOverlay(t.currentTarget.id);if(a.isInTargetZoneAggregation(e)){if(!this.onDragLeave(e)){t.stopPropagation()}}t.preventDefault()};i.prototype._onDragOver=function(t){var e=o.getOverlay(t.currentTarget.id);if(a.isInTargetZoneAggregation(e)){if(!this.onDragOver(e)){t.stopPropagation()}}t.preventDefault()};i.prototype._onAggregationTargetZoneChange=function(t){var e=t.getSource();var r=t.getParameter("targetZone");if(r){this._attachAggregationOverlayEvents(e)}else{this._detachAggregationOverlayEvents(e)}};i.prototype._attachAggregationOverlayEvents=function(t){t.attachBrowserEvent("dragenter",this._onAggregationDragEnter,this);t.attachBrowserEvent("dragover",this._onAggregationDragOver,this);t.attachBrowserEvent("dragleave",this._onAggregationDragLeave,this);t.attachBrowserEvent("drop",this._onAggregationDrop,this)};i.prototype._detachAggregationOverlayEvents=function(t){t.detachBrowserEvent("dragenter",this._onAggregationDragEnter,this);t.detachBrowserEvent("dragover",this._onAggregationDragOver,this);t.detachBrowserEvent("dragleave",this._onAggregationDragLeave,this);t.detachBrowserEvent("drop",this._onAggregationDrop,this)};i.prototype._onAggregationDragEnter=function(t){var e=o.getOverlay(t.currentTarget.id);this.onAggregationDragEnter(e);t.preventDefault();t.stopPropagation()};i.prototype._onAggregationDragOver=function(t){var e=o.getOverlay(t.currentTarget.id);this.onAggregationDragOver(e);t.preventDefault();t.stopPropagation()};i.prototype._onAggregationDragLeave=function(t){var e=o.getOverlay(t.currentTarget.id);this.onAggregationDragLeave(e);t.preventDefault();t.stopPropagation()};i.prototype._onAggregationDrop=function(t){var e=o.getOverlay(t.currentTarget.id);this.onAggregationDrop(e);t.preventDefault();t.stopPropagation()};var v=100;var l=20;var c=50;i.prototype._clearScrollInterval=function(t,e){if(this._mScrollIntervals[t]){window.clearInterval(this._mScrollIntervals[t][e]);delete this._mScrollIntervals[t][e]}};i.prototype._clearScrollIntervalFor=function(t){if(this._mScrollIntervals[t]){Object.keys(this._mScrollIntervals[t]).forEach(function(e){this._clearScrollInterval(t,e)},this)}};i.prototype._clearAllScrollIntervals=function(){Object.keys(this._mScrollIntervals).forEach(this._clearScrollIntervalFor.bind(this))};i.prototype._checkScroll=function(t,e,r){var a;var o;var n=1;if(e==="top"||e==="bottom"){a=t.outerHeight();o=t.scrollTop.bind(t)}else{a=t.outerWidth();o=t.scrollLeft.bind(t)}if(e==="top"||e==="left"){n=-1}var i=Math.floor(a/4);var g=v;if(i<v){g=i}if(r<g){this._mScrollIntervals[t.attr("id")]=this._mScrollIntervals[t.attr("id")]||{};if(!this._mScrollIntervals[t.attr("id")][e]){this._mScrollIntervals[t.attr("id")][e]=window.setInterval(function(){var t=o();o(t+n*l)},c)}}else{this._clearScrollInterval(t.attr("id"),e)}};i.prototype._dragLeave=function(t){var e=o.getOverlay(t.currentTarget.id);this._clearScrollIntervalFor(e.$().attr("id"))};i.prototype._dragScroll=function(t){var e=o.getOverlay(t.currentTarget.id);var r=e.$();var a=t.clientX;var n=t.clientY;var i=r.offset();var g=r.height();var s=r.width();var h=i.top;var v=i.left;var l=h+g;var c=v+s;this._checkScroll(r,"bottom",l-n);this._checkScroll(r,"top",n-h);this._checkScroll(r,"right",c-a);this._checkScroll(r,"left",a-v)};i.prototype._attachDragScrollHandler=function(e){var a;if(t.isA(e,"sap.ui.dt.AggregationOverlay")){a=e}else{a=e.srcControl}if(r.hasScrollBar(a.$())){a.getDomRef().addEventListener("dragover",this._dragScrollHandler,true);a.getDomRef().addEventListener("dragleave",this._dragLeaveHandler,true)}};i.prototype._removeDragScrollHandler=function(e){var r;if(t.isA(e,"sap.ui.dt.AggregationOverlay")){r=e}else{r=e.srcControl}var a=r.getDomRef();if(a){a.removeEventListener("dragover",this._dragScrollHandler,true)}};return i});
//# sourceMappingURL=DragDrop.js.map