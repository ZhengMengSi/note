// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/base/Log","sap/ushell/renderers/fiori2/AccessKeysHandler","sap/ushell/bootstrap/common/common.load.model"],function(e,t,jQuery,i,n,s){"use strict";var r=function(){};r._instance=undefined;r.getInstance=function(){if(r._instance===undefined){r._instance=new r;return r._instance._init().then(function(){return r._instance})}return Promise.resolve(r._instance)};r.prototype={keyCodes:t,_init:function(){this.oModel=s.getModel();return new Promise(function(e){if(!this.oLaunchPageService){sap.ushell.Container.getServiceAsync("LaunchPage").then(function(t){this.oLaunchPageService=t;e()}.bind(this))}else{e()}}.bind(this))},goToLastVisitedTile:function(e,t){var i,s,r=jQuery(".sapUshellTile, .sapMGTLineMode, .sapFCard");if(t){var l=jQuery("#dashboardGroups").find(".sapUshellTileContainer").filter(":visible"),o=this.oModel.getProperty("/topGroupInViewPortIndex");var a=e||jQuery(l.get(o));var u=a.find(".sapUshellTile, .sapMGTLineMode, .sapFCard");i=u.filter(":visible").eq(0);s=u.filter("[tabindex=0]:visible").eq(0);if(!i.length){i=r.filter(":visible").eq(0)}}else{i=r.filter(":visible").eq(0);s=r.filter("[tabindex=0]:visible").eq(0)}if(s.length){this.moveScrollDashboard(s)}else if(i.length){i.attr("tabindex","0");this.moveScrollDashboard(i)}else{n.sendFocusBackToShell()}},_goToFirstTileOfNextGroup:function(e,t){this._preventDefault(t);var i=this._getGroupAndTilesInfo();if(i){var n=this._getNextGroup(e,i.oGroup,false,true);if(n){this._goToTileOfGroup("first",n)}}},_goToTileOfGroup:function(e,t){if(t){var i=t.getTiles().filter(this._filterInvisibleTiles);var n=t.getLinks().filter(this._filterInvisibleTiles);if(t.getShowPlaceholder()){i.push(t.oPlusTile)}i=i.concat(n);e=e==="first"?0:e;e=e==="last"?i.length-1:e;var s=i[e];if(s){this.moveScrollDashboard(s.$());return true}}return false},_moveTile:function(e){var t=this._getGroupAndTilesInfo();if(!t||t.oGroup.getProperty("isGroupLocked")||t.oCurTile.isA("sap.ushell.ui.launchpad.PlusTile")){return null}var i=t.oCurTile;var n=this._getNextTile(e,true);if(n){var s=i.getMode?i.getMode():"ContentMode";var r=n.getMode?n.getMode():"ContentMode";var l=i.getParent();var o=n.getParent();var a=l===o;var u=s===r;var h=r==="LineMode"?o.getLinks():o.getTiles();var f=h.indexOf(n);var d=this._getTileRect(e,i);var c=this._getTileRect(e,n);if(!c){f=0}else{var p=d.right>c.right+5;var g=f===h.length-1;if(!a||!u){if((e==="up"||e==="down")&&p&&g){f++}else if(e==="left"){f++}}}var T=sap.ui.getCore().byId("sapUshellDashboardPage").getParent();sap.ui.getCore().getEventBus().publish("launchpad",u?"movetile":"convertTile",{callBack:this.callbackSetFocus.bind(this),sTileId:T.getController()._getTileUuid(i),toGroupId:o.getGroupId?o.getGroupId():o.groupId,srcGroupId:l.getGroupId?l.getGroupId():l.groupId,toIndex:f,tile:i,sToItems:r==="LineMode"?"links":"tiles",sFromItems:s==="LineMode"?"links":"tiles",sTileType:s==="LineMode"?"link":"tile",longDrop:false})}},callbackSetFocus:function(e){setTimeout(function(){if(e.oParent&&e.oParent instanceof sap.ushell.ui.launchpad.Tile){this.moveScrollDashboard(jQuery(e.oParent.getDomRef()))}else{this.moveScrollDashboard(e.$())}}.bind(this),0)},_getTileCenter:function(e,t,i){if(!(i instanceof HTMLElement)){var n=i.$().find(".sapMGTLineStyleHelper");if(i.isLink&&n&&n.length>1){if(e==="down"){return t.right}return t.left}}return t.right-(t.right-t.left)/2},_getTileRect:function(e,t){if(t instanceof HTMLElement){return t.getBoundingClientRect()}var i=t.$().find(".sapMGTLineStyleHelper");if(t.isLink&&i&&i.length){if(e==="down"){return i.get(i.length-1).getBoundingClientRect()}return i.get(0).getBoundingClientRect()}if(t.getDomRef()){return t.getDomRef().getBoundingClientRect()}return undefined},_findClosestTile:function(e,t,i){var n=this._getTileRect(e,i),s=this._getTileCenter(e,n,i);var r,l=Infinity,o=e==="down"?1:-1,a=t.indexOf(i)+o,u;for(;;a+=o){var h=t[a];if(!h){return r}if(!r){if(e==="down"&&a===t.length-1){return h}if(e==="up"&&a===0){return h}}var f=this._getTileRect(e,h);if(!f){return r}if(e==="down"&&n.bottom+5>=f.bottom){continue}if(e==="up"&&n.top-5<=f.top){continue}if(r&&u!==f.top){return r}u=f.top;var d=Math.min(Math.abs(f.left-s),Math.abs(f.right-s));if(l>d){l=d;r=h}else{return r}}},_filterInvisibleTiles:function(e){return e.getVisible()&&e.getDomRef()},_getNextTile:function(e,t){var i=this._getGroupAndTilesInfo();if(!i){return null}var n=i.oCurTile;var s=i.oGroup;var r=s.getTiles().filter(this._filterInvisibleTiles);var l=s.getLinks().filter(this._filterInvisibleTiles);var o=n.isLink;var a=s.getShowPlaceholder();var u=n.getBindingContext();var h=!t||u&&this.oLaunchPageService.isLinkPersonalizationSupported(u.getObject().object);var f=o?l:r;var d=f.indexOf(n);if(d<0){if(e==="right"){if(l.length){return l[0]}}if(e==="left"){if(r.length){return r[r.length-1]}}}else{if(e==="right"){if(d<f.length-1){return f[d+1]}if(!o&&a&&!t){return s.oPlusTile}if(!o&&h&&l.length){return l[0]}}if(e==="left"){if(d>0){return f[d-1]}if(o&&a){return s.oPlusTile}if(o&&r.length){return r[r.length-1]}}}var c=this._getNextGroup(e,s,t,h);var p=c?c.getTiles().filter(this._filterInvisibleTiles):[];var g=c?c.getLinks().filter(this._filterInvisibleTiles):[];var T=c&&c.getShowPlaceholder();if(c){if(e==="right"){if(p.length){return p[0]}if(T){return c.oPlusTile}if(g.length){return g[0]}return c.oPlusTile}if(e==="left"){if(h&&g.length){return g[g.length-1]}if(T&&!t){return c.oPlusTile}if(p.length){return p[p.length-1]}return c.oPlusTile}}if(e==="up"||e==="down"){if(!r.length&&t){r=[s.oPlusTile]}var v=h?r.concat(l):r;var C=[];if(c){if(!p.length&&t){p=[c.oPlusTile]}C=h?p.concat(g):p}var _=e==="up"?C.concat(v):v.concat(C);return this._findClosestTile(e,_,n)}},_getNextGroup:function(e,t,i,n){var s;var r=t.getParent().getGroups();var l=r.indexOf(t);var o=l;if(e==="down"||e==="right"){s=1}else{s=-1}o+=s;while(r[o]){var a=r[o];var u=a.getTiles().filter(this._filterInvisibleTiles);var h=a.getLinks().filter(this._filterInvisibleTiles);var f=n?u.concat(h):u;var d=a.getVisible()&&!(a.getIsGroupLocked()&&i)&&!(a.getIsGroupLocked()&&f.length===0)&&!(f.length===0&&!(i||a.getShowPlaceholder()));if(d){return a}o+=s}return undefined},_getGroupAndTilesInfo:function(){var e=this._getFocusOnTile(jQuery(document.activeElement));if(!e||!e.length){return null}var t=e.control(0);t.isLink=e.hasClass("sapUshellLinkTile")||e.hasClass("sapMGTLineMode");var i=e.closest(".sapUshellTileContainer").control(0);if(!i){return null}return{oCurTile:t,oGroup:i}},_goToSiblingElementInTileContainer:function(e,t){var i=t.closest(".sapUshellTileContainer"),n,s,r;n=t.closest(".sapUshellTileContainerBeforeContent");if(n.length){if(e==="up"||e==="left"){this._goToNextTileContainer(n,e)}else{r=i.find(".sapUshellTileContainerHeader").eq(0);r.focus()}return}n=t.closest(".sapUshellTileContainerHeader");if(n.length){if(e==="up"){if(!this._goToTileContainerBeforeContent(i)){this._goToNextTileContainer(n,e)}}else if(e==="down"){s=i.find(".sapUshellTile, .sapUshellLinkTile, .sapFCard").eq(0);if(s.length){this.moveScrollDashboard(s)}else{this._goToNextTileContainer(n,e)}}else if(e==="left"){if(t.hasClass("sapUshellTileContainerHeader")){if(!this._goToTileContainerBeforeContent(i)){this._goToNextTileContainer(n,"left")}}else{r=t.closest(".sapUshellTileContainerHeader");r.focus()}}else if(e==="right"){var l=t.hasClass("sapMInputBaseInner");if(!l){s=i.find(".sapUshellTile, .sapUshellLinkTile, .sapFCard").eq(0);if(s.length){this.moveScrollDashboard(s)}else{this._goToNextTileContainer(n,"down")}}}return}n=this._getFocusOnTile(t);if(n){this._goFromFocusedTile(e,n,true);return}n=t.closest(".sapUshellTileContainerAfterContent");if(n.length){if(e==="up"||e==="left"){this._goToTileOfGroup("first",n.control(0))}else{this._goToNextTileContainer(n,e)}}},_goToNextTileContainer:function(e,t){var i=e.closest(".sapUshellTileContainer");if(i.length===1){var n=jQuery(".sapUshellTileContainer").filter(":visible"),s=t==="down"?1:-1,r=jQuery(n[n.index(i)+s]);if(r.length===1){var l=r.find(".sapUshellTileContainerHeader");if(t==="down"){if(!this._goToTileContainerBeforeContent(r)){this._setTileContainerSelectiveFocus(r)}}else if(!this._goToTileContainerAfterContent(r)){if(t==="up"||t==="left"){var o=t==="up"?"first":"last";if(!this._goToTileOfGroup(o,r.control(0))){l.focus()}}}}}},_goToTileContainerBeforeContent:function(e){var t=e.hasClass("sapUshellTileContainer")?e:e.closest(".sapUshellTileContainer"),i=t.find(".sapUshellTileContainerBeforeContent button").filter(":visible");if(i.length){i.focus();return true}return false},_goToTileContainerAfterContent:function(e){var t=e.hasClass("sapUshellTileContainer")?e:e.closest(".sapUshellTileContainer"),i=t.find(".sapUshellTileContainerAfterContent button").filter(":visible");if(i.length){i.focus();return true}return false},_goFromFocusedTile:function(e,t,i){var n=this._getNextTile(e),s=t.closest(".sapUshellTileContainer");if(n){var r=n.$(),l=r.closest(".sapUshellTileContainer");if(i&&s.get(0).id!==l.get(0).id){if(e==="down"||e==="right"){if(!this._goToTileContainerAfterContent(s)){this._setTileContainerSelectiveFocus(l)}}else if(e==="up"||e==="left"){var o=s.find(".sapUshellTileContainerHeader");o.focus()}}else{this.moveScrollDashboard(r)}}else if(i){if(e==="down"||e==="right"){this._goToTileContainerAfterContent(s)}else if(e==="up"||e==="left"){var a=s.find(".sapUshellTileContainerHeader");a.focus()}}},_setTileContainerSelectiveFocus:function(e){var t=jQuery("#dashboardGroups").find(".sapUshellTileContainer").filter(":visible"),i=e.find(".sapUshellTileContainerBeforeContent button"),n=e.find(".sapUshellTileContainerHeader").eq(0),s=i.length&&i.is(":visible");if(s){i.focus()}else if(e.get(0)===t.get(0)){this.goToLastVisitedTile()}else if(n.length){n.focus()}},_setTileFocus:function(e){var t=document.getElementById("catalogView");if(t&&t.contains(e)){this.setFocusOnCatalogTile(e);return}var i=document.getElementById("dashboardGroups");var n=i.querySelectorAll(".sapUshellTile[tabindex]");for(var s=0;s<n.length;++s){n[s].removeAttribute("tabindex")}var r=[".sapMGTLineMode",".sapMGT",".sapFCard"].join('[tabindex="0"], ');var l=i.querySelectorAll(r);for(var o=0;o<l.length;++o){l[o].setAttribute("tabindex","-1")}e.setAttribute("tabindex",0);var a=sap.ui.getCore().byId(e.getAttribute("id"));if(a){var u=a.getParent();if(u){var h=sap.ui.getCore().getEventBus();h.publish("launchpad","scrollToGroup",{group:u})}a.focus()}},setFocusOnCatalogTile:function(e){var t=jQuery(".sapUshellTile[tabindex=0]"),i,n;if(t.length){jQuery(".sapUshellTileContainerContent [tabindex=0]").get().forEach(function(e){jQuery(e).attr("tabindex",-1)});i=t.find("[tabindex], a").addBack().filter("[tabindex], a");i.attr("tabindex",-1)}if(!e){n=jQuery(".sapUshellTile, .sapUshellAppBox").filter(":visible");if(n.length){e=n[0]}else{var s=document.getElementsByClassName("sapMMessagePageMainText");if(s.length){s[0].focus()}return}}e.setAttribute("tabindex",0);jQuery(e).find("button").attr("tabindex",0);e.focus()},moveScrollDashboard:function(e){if(e.length){this._setTileFocus(e[0])}},_moveGroupFromDashboard:function(e,t){var i,n=jQuery(".sapUshellDashboardGroupsContainerItem"),s,r;i=t.closest(".sapUshellDashboardGroupsContainerItem");s=n.index(i);r=e==="up"||e==="left"?s-1:s+1;this._moveGroup(s,r)},_moveGroup:function(e,t){if(t<0||t>=jQuery(".sapUshellDashboardGroupsContainerItem").length||t<jQuery(".sapUshellDisableDragAndDrop").length){return}sap.ui.getCore().getEventBus().publish("launchpad","moveGroup",{fromIndex:e,toIndex:t});setTimeout(function(){var e=jQuery(".sapUshellTileContainerHeader")[t];jQuery(e).focus()},100)},_getFocusOnTile:function(e){var t;[".sapUshellTile",".sapUshellLinkTile",".sapFCard"].forEach(function(i){var n=e.closest(i);if(n.length){t=n}});return t},_renameGroup:function(e){if(e.closest(".sapUshellTileContainerHeader").length===1){e=e[0].tagName==="H2"?e:e.find("h2");e.click()}},_arrowsButtonsHandler:function(e,t,i){this._preventDefault(t);if(i.hasClass("sapUshellAnchorItem")){this._handleAnchorNavigationItemsArrowKeys(e,i);return}if(i.is("#sapUshellAnchorBarOverflowButton")){this._handleAnchorNavigationOverflowButtonArrowKeys(e);return}var n=this._getFocusOnTile(i);var s=this.oModel.getProperty("/tileActionModeActive");var r=this.oModel.getProperty("/personalization");if(t.ctrlKey===true&&r){var l=i.closest(".sapUshellTileContainerHeader");if(n){this._moveTile(e)}else if(l.length){var o=l.closest(".sapUshellTileContainerContent");if(!o.hasClass("sapUshellTileContainerDefault")||!o.hasClass("sapUshellTileContainerLocked")){this._moveGroupFromDashboard(e,l)}}}else if(s){this._goToSiblingElementInTileContainer(e,i)}else if(n){this._goFromFocusedTile(e,n,s)}else{this.goToLastVisitedTile()}},_handleAnchorNavigationOverflowButtonArrowKeys:function(e){if(e==="left"||e==="up"){var t=jQuery(".sapUshellAnchorItem").filter(":visible");this._setAnchorItemFocus(t.eq(t.length-1)[0])}},_handleAnchorNavigationItemsArrowKeys:function(e,t){var i=jQuery(".sapUshellAnchorItem").filter(":visible"),n=i.index(t);if(e==="left"||e==="up"){if(n>0){this._setAnchorItemFocus(i.eq(n-1)[0]);return}}if(e==="right"||e==="down"){if(n<i.length-1){this._setAnchorItemFocus(i.eq(n+1)[0])}else if(n===i.length-1){var s=document.getElementById("sapUshellAnchorBarOverflowButton");s.focus()}}},_setAnchorItemFocus:function(e){var t=document.getElementsByClassName("sapUshellAnchorItem");for(var i=0;i<t.length;++i){t[i].setAttribute("tabindex","-1")}if(!e){e=jQuery(".sapUshellAnchorItem").filter(":visible")[0]}e.setAttribute("tabindex","0");e.focus()},_appFinderHomeEndButtonsHandler:function(e,t,i){var n=jQuery(".sapUshellTile, .sapUshellAppBox").filter(":visible"),s;if(n.length){if(e==="home"){s=jQuery(n.get(0))}if(e==="end"){s=jQuery(n.get(n.length-1))}}if(s){this._preventDefault(t);this._appFinderFocusAppBox(i,s)}},_homeEndButtonsHandler:function(e,t,i){if(i.hasClass("sapUshellAnchorItem")){this._preventDefault(t);this._setAnchorItemFocus(jQuery(".sapUshellAnchorItem").filter(":visible:"+e)[0])}else if(t.ctrlKey===true){this._preventDefault(t);var n=jQuery(".sapUshellTile, .sapFCard").filter(":visible")[e]();if(n.length){this._setTileFocus(n[0])}}else{var s=i.closest(".sapUshellTileContainer");if(s){var r=s.control(0);if(r){this._preventDefault(t);this._goToTileOfGroup(e,r)}}}},_deleteButtonHandler:function(e){var t=this.oModel.getProperty("/tileActionModeActive");var i=this.oModel.getProperty("/personalization");if(t&&i){var n=this._getFocusOnTile(e);if(n&&!n.hasClass("sapUshellLockedTile")&&!n.hasClass("sapUshellPlusTile")){var s=this._getGroupAndTilesInfo();if(s&&!s.oCurTile.isLink){var r=sap.ui.getCore().byId("sapUshellDashboardPage").getParent();sap.ui.getCore().getEventBus().publish("launchpad","deleteTile",{tileId:r.getController()._getTileUuid(s.oCurTile),items:"tiles"},this)}}}},_spaceButtonHandler:function(e,t){e.preventDefault();var i=this._getFocusOnTile(t);if(!i||!i.length){t.click();return}if(i.hasClass("sapFCard")){i.control(0).getCardHeader().firePress();return}var n=t.find("[role=button], a.sapMGT");if(n.length&&!this.oModel.getProperty("/tileActionModeActive")){var s=n.control(0);if(s){s.firePress();return}}i.control(0).firePress()},goToSelectedAnchorNavigationItem:function(){this._setAnchorItemFocus(document.getElementsByClassName("sapUshellAnchorItemSelected")[0]);return document.activeElement&&document.activeElement.classList.contains("sapUshellAnchorItemSelected")},handleFocusOnMe:function(t,i){var n=sap.ushell.Container.getRenderer("fiori2"),s=r._instance;if(n){var l=n.getCurrentCoreView();if(l==="home"&&!e.last("/core/spaces/enabled")){var o=document.activeElement?document.activeElement.tagName:"";if(o==="INPUT"||o==="TEXTAREA"){if(t.keyCode===s.keyCodes.ENTER){var a=jQuery(document.activeElement).closest(".sapUshellTileContainerHeader");if(a.length){setTimeout(function(){a=jQuery("#"+a[0].id);a.focus()},10)}}}else{s._dashboardKeydownHandler(t)}}if(l==="appFinder"){if(i){if(t.shiftKey){s.setFocusOnCatalogTile()}else{var u=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(u&&u.getVisible()){u.focus()}else{s.appFinderFocusMenuButtons(t)}}}else{s._appFinderKeydownHandler(t)}}}},_appFinderFocusAppBox:function(e,t){if(e&&t){e.attr("tabindex","-1").find(".sapUshellPinButton").attr("tabindex","-1");t.attr("tabindex","0").focus();t.find(".sapUshellPinButton").attr("tabindex","0")}},_preventDefault:function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()},_getNextCatalog:function(e,t){var n;if(e==="down"||e==="right"){n=t.next()}else if(e==="up"||e==="left"){n=t.prev()}else{i.error("Direction is unkown",e,"sap.ushell.components.ComponentKeysHandler");return null}if(n.length>0){var s=n.find("li.sapUshellAppBox, li.sapUshellTile").get().length;if(s>0){return n}return this._getNextCatalog(e,n)}return undefined},_getNextCatalogItem:function(e,t,i){var n=jQuery(t.parents()[2]),s=n.find("li.sapUshellAppBox, li.sapUshellTile").get();if(e==="right"||e==="left"){var r=s.indexOf(t.get(0)),l=e==="right"?r+1:r-1;if(s[l]){return s[l]}}var o=this._getNextCatalog(e,n),a=o?o.find("li.sapUshellAppBox, li.sapUshellTile").get():[];if(a.length>0&&e==="right"){return a[0]}if(a.length>0&&e==="left"){return a[a.length-1]}if(e==="down"||e==="up"){if(a.length>0&&i){return a[0]}var u=e==="down"?s.concat(a):a.concat(s);return this._findClosestTile(e,u,t.get(0))}return undefined},_appFinderKeysHandler:function(e,t,i,n){if(i.is(".sapUshellAppBox, .sapUshellTile")){this._preventDefault(t);var s=jQuery(this._getNextCatalogItem(e,i,n));if(s){this._appFinderFocusAppBox(i,s)}}},appFinderFocusMenuButtons:function(e){var t=jQuery("#catalog-button, #userMenu-button, #sapMenu-button").filter("[tabindex=0]");if(t.length){t.eq(0).focus();this._preventDefault(e);return true}return false},_appFinderKeydownHandler:function(e){var t=jQuery(document.activeElement);if(e.srcElement.id!=="appFinderSearch-I"){var i=e.keyCode,n=sap.ui.getCore().getConfiguration().getRTL();if(n&&i===this.keyCodes.ARROW_RIGHT){i=this.keyCodes.ARROW_LEFT}else if(n&&i===this.keyCodes.ARROW_LEFT){i=this.keyCodes.ARROW_RIGHT}switch(i){case this.keyCodes.ARROW_UP:this._appFinderKeysHandler("up",e,t);break;case this.keyCodes.ARROW_DOWN:this._appFinderKeysHandler("down",e,t);break;case this.keyCodes.ARROW_RIGHT:this._appFinderKeysHandler("right",e,t);break;case this.keyCodes.ARROW_LEFT:this._appFinderKeysHandler("left",e,t);break;case this.keyCodes.PAGE_UP:this._appFinderKeysHandler("up",e,t,true);break;case this.keyCodes.PAGE_DOWN:this._appFinderKeysHandler("down",e,t,true);break;case this.keyCodes.HOME:this._appFinderHomeEndButtonsHandler("home",e,t);break;case this.keyCodes.END:this._appFinderHomeEndButtonsHandler("end",e,t);break;case this.keyCodes.SPACE:this._spaceButtonHandler(e,t);break;default:return}}},_dashboardKeydownHandler:function(e){var t=document.activeElement&&document.activeElement.tagName;if(t==="INPUT"||t==="TEXTAREA"){return}var i=e.keyCode,n=sap.ui.getCore().getConfiguration().getRTL(),s=jQuery(document.activeElement);if(n){if(i===this.keyCodes.ARROW_RIGHT){i=this.keyCodes.ARROW_LEFT}else if(i===this.keyCodes.ARROW_LEFT){i=this.keyCodes.ARROW_RIGHT}}switch(i){case this.keyCodes.F2:this._renameGroup(s);break;case this.keyCodes.DELETE:case this.keyCodes.BACKSPACE:this._deleteButtonHandler(s);break;case this.keyCodes.ARROW_UP:this._arrowsButtonsHandler("up",e,s);break;case this.keyCodes.ARROW_DOWN:this._arrowsButtonsHandler("down",e,s);break;case this.keyCodes.ARROW_RIGHT:this._arrowsButtonsHandler("right",e,s);break;case this.keyCodes.ARROW_LEFT:this._arrowsButtonsHandler("left",e,s);break;case this.keyCodes.PAGE_UP:this._goToFirstTileOfNextGroup("up",e);break;case this.keyCodes.PAGE_DOWN:this._goToFirstTileOfNextGroup("down",e);break;case this.keyCodes.HOME:this._homeEndButtonsHandler("first",e,s);break;case this.keyCodes.END:this._homeEndButtonsHandler("last",e,s);break;case this.keyCodes.SPACE:this._spaceButtonHandler(e,s);break;case this.keyCodes.ENTER:this._spaceButtonHandler(e,s);break;default:break}}};return r});
//# sourceMappingURL=ComponentKeysHandler.js.map