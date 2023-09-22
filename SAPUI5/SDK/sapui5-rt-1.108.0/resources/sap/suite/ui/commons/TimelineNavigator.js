/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/delegate/ItemNavigation","sap/base/assert","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes"],function(jQuery,t,e,i,s){"use strict";function o(t,e){var i=t.length-e.length;return i>=0&&t.lastIndexOf(e)===i}var n=t.extend("sap.suite.ui.commons.TimelineNavigator",{constructor:function(e,i,s,o){t.apply(this,arguments);this.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"]});this.setCycling(false);this._aRows=o;this.iActiveTabIndex=0;this.iTabIndex=0;this.bRefocusOnNextUpdate=false;this.oLastFocused=null}});n.prototype.updateReferences=function(t,e,i){this.oDomRef=t;this.setItemDomRefs(e);this._aRows=i;if(this.bRefocusOnNextUpdate){this._refocusItem();this.bRefocusOnNextUpdate=false}this.setBeforeAfterTabIndex()};n.prototype.refocusOnNextUpdate=function(){this.bRefocusOnNextUpdate=true};n.prototype._refocusItem=function(){var t=this.iFocusedIndex;if(t<0){return}while(!jQuery(this.aItemDomRefs[t]).is(":visible")){t++;if(t>=this.aItemDomRefs.length){t=0}if(t===this.iFocusedIndex){break}}setTimeout(function(){if(this.aItemDomRefs){this.focusItem(t)}}.bind(this),0)};n.prototype.setItemDomRefs=function(t){e(Array.isArray(t),"aItemDomRefs must be an array of DOM elements");this.aItemDomRefs=t;if(this.iFocusedIndex>t.length-1){this.iFocusedIndex=t.length-1}for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]){var s=jQuery(this.aItemDomRefs[i]);if(i==this.iFocusedIndex&&!s.data("sap.INRoot")){s.attr("tabIndex",this.iActiveTabIndex)}else if(s.attr("tabindex")=="0"){s.attr("tabIndex",this.iTabIndex)}s.data("sap.INItem",true);s.data("sap.InNavArea",true);if(s.data("sap.INRoot")&&i!=this.iFocusedIndex){s.data("sap.INRoot").setNestedItemsTabindex()}}}return this};n.prototype.setItemsTabindex=function(){for(var t=0;t<this.aItemDomRefs.length;t++){if(this.aItemDomRefs[t]){var e=jQuery(this.aItemDomRefs[t]);if(e.is(":sapFocusable")){if(t==this.iFocusedIndex&&!e.data("sap.INRoot")){e.attr("tabIndex",this.iActiveTabIndex)}else{e.attr("tabIndex",this.iTabIndex)}}}}return this};n.prototype.setBeforeAfterTabIndex=function(){if(this.oDomRef){var t=this.oDomRef.id+"-after";jQuery(window.document.getElementById(t)).attr("tabindex",-1);t=this.oDomRef.id+"-before";jQuery(window.document.getElementById(t)).attr("tabindex",-1);jQuery(this.oDomRef).attr("tabindex",-1)}};n.prototype.setFocusedIndex=function(t){var e;if(this.aItemDomRefs.length<0){this.iFocusedIndex=-1;return this}if(t<0){t=0}if(t>this.aItemDomRefs.length-1){t=this.aItemDomRefs.length-1}if(this.iFocusedIndex!==-1&&this.aItemDomRefs.length>this.iFocusedIndex){jQuery(this.aItemDomRefs[this.iFocusedIndex]).attr("tabIndex",this.iTabIndex);e=jQuery(this.aItemDomRefs[this.iFocusedIndex]);if(e.data("sap.INRoot")&&t!=this.iFocusedIndex){jQuery(e.data("sap.INRoot").aItemDomRefs[e.data("sap.INRoot").iFocusedIndex]).attr("tabIndex",this.iTabIndex)}}this.iFocusedIndex=t;var i=this.aItemDomRefs[this.iFocusedIndex];e=jQuery(this.aItemDomRefs[this.iFocusedIndex]);if(!e.data("sap.INRoot")){jQuery(i).attr("tabIndex",this.iActiveTabIndex)}return this};n.prototype._callParent=function(e,i){if(typeof t.prototype[e]==="function"){t.prototype[e].apply(this,i)}};n.prototype._onF7=function(t){if(!i(this.oDomRef,t.target)){return}var e=this.getFocusedIndex();if(e>=0){this.focusItem(e,t);t.preventDefault();t.stopPropagation()}};n.prototype.onsapspace=function(t){this.onsapenter(t)};n.prototype.onsapenter=function(t){var e,i;if(this._skipNavigation(t,false,true)){return}i=jQuery(this.getFocusedDomRef());e=i.attr("id");if(o(e,"-outline")){if(i.hasClass("sapSuiteUiCommonsTimelineGroupHeaderMainWrapper")){e=e.substr(0,e.length-"outline".length)+"groupCollapseIcon";i.find("#"+e).keyup()}else{i.find("div[role='toolbar']").children().first().mousedown().mouseup().click();this.fireEvent("Enter",{domRef:i.get(0)})}t.preventDefault();t.stopPropagation()}};n.prototype.onsaphome=function(t){if(this.aItemDomRefs.length===0){return}if(this._skipNavigation(t,false,false)){return}this._callParent("onsaphome",arguments)};n.prototype.onkeydown=function(t){this._callParent("onkeydown",arguments);if(t.keyCode===s.F7){this._onF7(t)}};n.prototype.onmousedown=function(t){var e=t.target;var s=function(t,e){var i=false;var s=jQuery(t);while(!s.is(":sapFocusable")&&s.get(0)!=e){s=s.parent()}if(s.get(0)!=e){i=true}return i};if(i(this.oDomRef,e)){for(var o=0;o<this.aItemDomRefs.length;o++){var n=this.aItemDomRefs[o];if(i(n,e)){if(n===e||!s(e,n)){this.focusItem(o,t)}return}}this._bMouseDownHappened=true;setTimeout(function(){this._bMouseDownHappened=false}.bind(this),20)}};n.prototype.onsapnext=function(t){var e,i=true,o,n,a;if(!this._aRows){this._callParent("onsapnext",arguments);return}if(this._skipNavigation(t,true,false)){return}t.preventDefault();t.stopPropagation();if(this.getFocusedIndex()<0){return}o=this._findPosition(this.iFocusedIndex);if(o===null){throw new Error("TimelineNavigation cannot obtain a position of focused item and hance it cannot senect next.")}n=Object.assign({},o);do{if(t.keyCode===s.ARROW_DOWN){n.iY++;if(n.iY>=this._aRows.length){if(n.iX+1>=this._aRows[this._aRows.length-1].length){return}n.iY=0;n.iX++}}else{n.iX++;if(n.iX>=this._aRows[n.iY].length){if(n.iY+1>=this._aRows.length){return}n.iX=0;n.iY++}}if(n.iX===o.iX&&n.iY===o.iY){if(i){i=false}else{return}}a=this._aRows[n.iY][n.iX]}while(!a||!jQuery(a).is(":sapFocusable"));e=this._findIndex(n);this.focusItem(e,t)};n.prototype.onsapprevious=function(t){var e,i=true,o,n,a;if(!this._aRows){this._callParent("onsapprevious",arguments);return}if(this._skipNavigation(t,true,false)){return}t.preventDefault();t.stopPropagation();if(this.getFocusedIndex()<0){return}o=this._findPosition(this.iFocusedIndex);if(o===null){throw new Error("TimelineNavigation cannot obtain a position of focused item and hance it cannot senect next.")}n=Object.assign({},o);do{if(t.keyCode===s.ARROW_UP){n.iY--;if(n.iY<0){if(n.iX<=0){return}n.iY=this._aRows.length-1;n.iX--}}else{n.iX--;if(n.iX<0){if(n.iY<=0){return}n.iX=this._aRows[n.iY].length-1;n.iY--}}if(n.iX===o.iX&&n.iY===o.iY){if(i){i=false}else{return}}a=this._aRows[n.iY][n.iX]}while(!a||!jQuery(a).is(":sapFocusable"));e=this._findIndex(n);this.focusItem(e,t)};n.prototype._isInDomRefs=function(t){return this.aItemDomRefs.indexOf(t)>-1};n.prototype._isInTimeline=function(t){while(t){if(this._isInDomRefs(t)){return true}t=t.parentElement}return false};n.prototype._hasTabbableChildren=function(t){if(t&&t.tabIndex>=0){return true}var e=this;if(t&&t.childElementCount>0){t.childNodes.forEach(function(t){return e._hasTabbableChildren(t)})}return false};n.prototype._isLastChildInTimeline=function(t){return this._isInTimeline(t.target)&&!this._hasTabbableChildren(t.target)};n.prototype.onsaptabnext=function(t){if(t.target.id&&this._isLastChildInTimeline(t)){var e=this.oDomRef.id+"-after";jQuery(window.document.getElementById(e)).focus()}};n.prototype.onsaptabprevious=function(t){if(this._isInDomRefs(t.target)){var e=this.oDomRef.id+"-before";jQuery(window.document.getElementById(e)).focus()}};n.prototype.onfocusin=function(t){if(this._isInTimeline(t.target)){this.oLastFocused=t.target}if(!t.relatedTarget||!this._isInTimeline(t.relatedTarget)){if(this._isInTimeline(t.target)&&this.oLastFocused&&this.oLastFocused!==t.target){jQuery(this.oLastFocused).focus()}}};n.prototype._findPosition=function(t){var e,i,s=this.aItemDomRefs[t];for(i=0;i<this._aRows.length;i++){for(e=0;e<this._aRows[i].length;e++){if(s===this._aRows[i][e]){return{iX:e,iY:i}}}}return null};n.prototype._findIndex=function(t){var e=this._aRows[t.iY][t.iX],i;for(i=0;i<this.aItemDomRefs.length;i++){if(e===this.aItemDomRefs[i]){return i}}return null};n.prototype._skipNavigation=function(t,e,s){return!i(this.oDomRef,t.target)||this.getFocusedIndex()<0&&s||this.aItemDomRefs&&Array.prototype.indexOf.call(this.aItemDomRefs,t.target)===-1||jQuery(this.oDomRef).data("sap.InNavArea")&&e};return n});
//# sourceMappingURL=TimelineNavigator.js.map