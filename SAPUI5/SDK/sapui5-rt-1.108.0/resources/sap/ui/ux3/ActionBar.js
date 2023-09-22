/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/ui/core/delegate/ItemNavigation","./library","./ActionBarRenderer","sap/ui/core/ResizeHandler","sap/ui/ux3/ThingAction","sap/ui/ux3/ToolPopup","sap/ui/ux3/Feeder","sap/ui/core/Popup","sap/ui/commons/MenuItem","sap/ui/commons/Menu","sap/ui/commons/MenuButton","sap/ui/commons/Button","sap/ui/Device","sap/base/Log","sap/ui/core/Configuration"],function(jQuery,t,e,o,i,n,s,r,a,u,l,c,h,p,d,_,g){"use strict";var f=u.Dock;var A=o.FeederType;var m=o.ActionBarSocialActions;var M=o.FollowActionState;var y=t.extend("sap.ui.ux3.ActionBar",{metadata:{deprecated:true,library:"sap.ui.ux3",properties:{followState:{type:"sap.ui.ux3.FollowActionState",group:"Misc",defaultValue:M.Default},flagState:{type:"boolean",group:"Misc",defaultValue:null},favoriteState:{type:"boolean",group:"Misc",defaultValue:null},updateState:{type:"boolean",group:"Misc",defaultValue:null},thingIconURI:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},alwaysShowMoreMenu:{type:"boolean",group:"Misc",defaultValue:true},showUpdate:{type:"boolean",group:"Misc",defaultValue:true},showFollow:{type:"boolean",group:"Misc",defaultValue:true},showFlag:{type:"boolean",group:"Misc",defaultValue:true},showFavorite:{type:"boolean",group:"Misc",defaultValue:true},showOpen:{type:"boolean",group:"Misc",defaultValue:true},dividerWidth:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null}},aggregations:{businessActions:{type:"sap.ui.ux3.ThingAction",multiple:true,singularName:"businessAction"},_businessActionButtons:{type:"sap.ui.commons.Button",multiple:true,singularName:"_businessActionButton",visibility:"hidden"},_socialActions:{type:"sap.ui.ux3.ThingAction",multiple:true,singularName:"_socialAction",visibility:"hidden"}},events:{actionSelected:{parameters:{id:{type:"string"},action:{type:"sap.ui.ux3.ThingAction"},newState:{type:"string"}}},feedSubmit:{parameters:{text:{type:"string"}}}}},renderer:i});y.prototype.init=function(){this.mActionMap={};this.mActionKeys=m;this.oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Update),true);this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Follow),true);this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Flag),true);this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Favorite),true);this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Open),true);if(!this._oItemNavigation){this._oItemNavigation=new e;this.addDelegate(this._oItemNavigation)}};y.prototype.exit=function(){this.closePopups();if(this._oUpdatePopup){this._oUpdatePopup.destroy();this._oUpdatePopup=null}if(this._oMoreMenuButton){this._oMoreMenuButton.destroy();this._oMoreMenuButton=null}if(this._oMoreMenu){this._oMoreMenu.destroy();this._oMoreMenu=null}if(this._oMenu){this._oMenu.destroy();this._oMenu=null}if(this._oHoldItem){this._oHoldItem.destroy()}if(this._oUnFollowItem){this._oUnFollowItem.destroy()}if(this._oUnHoldItem){this._oUnHoldItem.destroy()}if(this._sResizeListenerId){n.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this.mActionKeys=null;this.oRb=null;this.destroyAggregation("_socialActions");this.destroyAggregation("_businessActionButtons");if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}};y.prototype.isActive=function(){var t=this.getDomRef()!=null;return t};y.prototype._getLocalizedText=function(t,e){var o;if(this.oRb){o=this.oRb.getText(t)}if(o&&e){for(var i=0;i<e.length;i++){o=o.replace("{"+i+"}",e[i])}}return o?o:t};y.prototype._getSocialAction=function(t){var e=this.mActionMap[t];if(!e){e=new s({id:this.getId()+"-"+t});switch(t){case this.mActionKeys.Update:e.name=this.mActionKeys.Update;e.tooltipKey="ACTIONBAR_UPDATE_ACTION_TOOLTIP";e.cssClass="sapUiUx3ActionBarUpdateAction";e.fnInit=function(t){t._oUpdatePopup=new r({id:t.getId()+"-UpdateActionPopup"}).addStyleClass("sapUiUx3ActionBarUpdatePopup");t._oUpdatePopup._ensurePopup().setAutoClose(true);t._feeder=new a({id:t.getId()+"-Feeder",type:A.Comment,thumbnailSrc:t.getThingIconURI(),text:"",submit:jQuery.proxy(function(t){var e=t.getParameter("text");this.fireFeedSubmit({text:e});this._oUpdatePopup.close()},t)});t._feeder.addStyleClass("sapUiUx3ActionBarFeeder");t._oUpdatePopup.addContent(t._feeder)};e.fnActionSelected=function(t,o){o._setUpdateState(!o.getUpdateState());if(o._oUpdatePopup.isOpen()){o._oUpdatePopup.close()}else{var i,n,s;o._oUpdatePopup.setPosition(f.BeginBottom,f.BeginTop,t.getSource().getDomRef(),"-8 -13","none");o._oUpdatePopup.open();i=jQuery(o._oUpdatePopup.getDomRef());n=jQuery(window).height();s=jQuery(o.getDomRef()).offset().top;i.css("top","auto").css("bottom",n-s+7+"px");setTimeout(function(){if(o._feeder.getFocusDomRef()){o._feeder.getFocusDomRef().focus()}},1e3)}o._updateSocialActionDomRef(e)};e.fnExit=function(t){if(t._oUpdatePopup){t._oUpdatePopup.destroy();t._oUpdatePopup=null}};e.fnCalculateState=function(t){var e=null;if(t.getUpdateState()){e="Selected"}return e};break;case this.mActionKeys.Follow:var o=e;e.name=this.mActionKeys.Follow;e.tooltipKey="ACTIONBAR_FOLLOW_ACTION_TOOLTIP_FOLLOW";e.cssClass="sapUiUx3ActionBarFollowAction";e.isMenu=function(t){return t.getFollowState()!=M.Default};e.fnActionSelected=function(t,e){if(e.getFollowState()==M.Default){e._setFollowState(M.Follow);e.fireActionSelected({id:o.name,state:"followState",action:o});this._fnPrepareFollowMenu(t,e)}else{e._oMenu.open(false,o.getFocusDomRef(),f.BeginBottom,f.BeginTop,o.getDomRef())}};e.fnCalculateState=function(t){return t.getFollowState()};e._fnPrepareFollowMenu=function(t,o){var i=sap.ui.resource("sap.ui.ux3","themes/"+g.getTheme());if(o.mActionMap[o.mActionKeys.Follow]){if(!o._oUnFollowItem){o._oUnFollowItem=new l({id:o.getId()+"-unfollowState",text:o._getLocalizedText("TI_FOLLOW_ACTION_MENU_TXT_UNFOLLOW"),icon:i+"/img/menu_unlisten.png"})}if(!o._oHoldItem){o._oHoldItem=new l({id:o.getId()+"-holdState",text:o._getLocalizedText("TI_FOLLOW_ACTION_MENU_TXT_HOLD"),icon:i+"/img/menu_hold.png"})}if(!o._oUnHoldItem){o._oUnHoldItem=new l({id:o.getId()+"-unholdState",text:o._getLocalizedText("TI_FOLLOW_ACTION_MENU_TXT_UNHOLD"),icon:i+"/img/menu_follow.png"})}if(!o._oMenu){o._oMenu=new c({id:o.getId()+"-followActionMenu"});o._oMenu.attachItemSelect(jQuery.proxy(function(t){this._fnFollowMenuSelected(t,o)},this));o._oMenu.addItem(o._oHoldItem);o._oMenu.addItem(o._oUnHoldItem);o._oMenu.addItem(o._oUnFollowItem)}if(o.getFollowState()==M.Default){o.mActionMap[o.mActionKeys.Follow].setTooltip(o._getLocalizedText("TI_FOLLOW_ACTION_TOOLTIP_FOLLOW"));o._oHoldItem.setVisible(false);o._oUnFollowItem.setVisible(false);o._oUnHoldItem.setVisible(false)}else if(o.getFollowState()==M.Follow){o.mActionMap[o.mActionKeys.Follow].setTooltip(o._getLocalizedText("TI_FOLLOW_ACTION_TOOLTIP_STOPPAUSE_FOLLOW"));o._oHoldItem.setVisible(true);o._oUnFollowItem.setVisible(true);o._oUnHoldItem.setVisible(false)}else if(o.getFollowState()==M.Hold){o.mActionMap[o.mActionKeys.Follow].setTooltip(o._getLocalizedText("TI_FOLLOW_ACTION_TOOLTIP_STOPCONTINUE_FOLLOW"));o._oHoldItem.setVisible(false);o._oUnFollowItem.setVisible(true);o._oUnHoldItem.setVisible(true)}o._updateSocialActionDomRef(e)}};e._fnFollowMenuSelected=function(t,e){if(e.mActionMap[e.mActionKeys.Follow]){var i=t.getParameters().item.getId();if(i==e.getId()+"-followState"){e._setFollowState(M.Follow)}else if(i==e.getId()+"-unfollowState"){e._setFollowState(M.Default)}else if(i==e.getId()+"-holdState"){e._setFollowState(M.Hold)}else if(i+"-unholdState"){e._setFollowState(M.Follow)}e.fireActionSelected({id:o.name,state:i,action:o});this._fnPrepareFollowMenu(t,e)}};break;case this.mActionKeys.Favorite:var i=e;e.name=this.mActionKeys.Favorite;e.tooltipKey="ACTIONBAR_FAVORITE_ACTION_TOOLTIP";e.cssClass="sapUiUx3ActionBarFavoriteAction";e.fnActionSelected=function(t,o){if(o.getFavoriteState()==true){o._setFavoriteState(false)}else{o._setFavoriteState(true)}o.fireActionSelected({id:i.name,state:o.getFavoriteState(),action:i});o._updateSocialActionDomRef(e)};e.fnCalculateState=function(t){var e=null;if(t.getFavoriteState()){e="Selected"}return e};break;case this.mActionKeys.Flag:var n=e;e.name=this.mActionKeys.Flag;e.tooltipKey="ACTIONBAR_FLAG_ACTION_TOOLTIP";e.cssClass="sapUiUx3ActionBarFlagAction";e.fnActionSelected=function(t,o){o._setFlagState(!o.getFlagState());o.fireActionSelected({id:n.name,state:o.getFlagState(),action:n});o._updateSocialActionDomRef(e)};e.fnCalculateState=function(t){var e=null;if(t.getFlagState()){e="Selected"}return e};break;case this.mActionKeys.Open:e.name=this.mActionKeys.Open;e.tooltipKey="ACTIONBAR_OPEN_THING_ACTION_TOOLTIP";e.cssClass="sapUiUx3ActionBarOpenThingAction";break;default:_.warning('Function "sap.ui.ux3.ActionBar.prototype._getSocialAction" was called with unknown action key "'+t+'".\n\tNo action will not be rendered.');return undefined}}return e};y.prototype._updateSocialActionDomRef=function(t){var e=t.$();if(e){e.attr("class",t.cssClass);if(t.fnCalculateState){e.addClass("sapUiUx3ActionBarAction");e.addClass(t.fnCalculateState(this))}if(t.name==this.mActionKeys.Update||t.name==this.mActionKeys.Flag||t.name==this.mActionKeys.Favorite){e.attr("aria-pressed",t.fnCalculateState(this)=="Selected"?"true":"false")}if(t.isMenu){e.attr("aria-haspopup",t.isMenu(this)?"true":"false")}}};y.prototype._rerenderSocialActions=function(){var t=this.$("socialActions");if(t.length>0){var e=sap.ui.getCore().createRenderManager();i.renderSocialActions(e,this);e.flush(t[0]);e.destroy()}};y.prototype._rerenderBusinessAction=function(t){var e=t.$();if(e.length>0){var o=sap.ui.getCore().createRenderManager();o.renderControl(t);o.flush(e[0].parentNode);o.destroy()}};y.prototype._rerenderBusinessActions=function(){if(!this.getAlwaysShowMoreMenu()){var t=this.$("businessActions");if(t&&t.length>0){var e=sap.ui.getCore().createRenderManager();i.renderBusinessActionButtons(e,this);e.flush(t[0]);e.destroy()}}this._onresize()};y.prototype.setFollowState=function(t){this.setProperty("followState",t);if(!this._oMenu){var e=this._getSocialAction(this.mActionKeys.Follow);e._fnPrepareFollowMenu(null,this)}return this};y.prototype.setShowUpdate=function(t){this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Update),t);this.setProperty("showUpdate",t,true);return this};y.prototype.setShowFollow=function(t){this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Follow),t);this.setProperty("showFollow",t,true);return this};y.prototype.setShowFlag=function(t){this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Flag),t);this.setProperty("showFlag",t,true);return this};y.prototype.setShowFavorite=function(t){this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Favorite),t);this.setProperty("showFavorite",t,true);return this};y.prototype.setShowOpen=function(t){this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Open),t);this.setProperty("showOpen",t,true);return this};y.prototype._setFollowState=function(t){this.setProperty("followState",t,true);return this};y.prototype._setFlagState=function(t){this.setProperty("flagState",t,true);return this};y.prototype._setUpdateState=function(t){this.setProperty("updateState",t,true);return this};y.prototype._setFavoriteState=function(t){this.setProperty("favoriteState",t,true);return this};y.prototype.setThingIconURI=function(t){this.setProperty("thingIconURI",t,true);var e=this.mActionMap[this.mActionKeys.Update];if(e&&this._feeder){this._feeder.setThumbnailSrc(t)}else{_.warning('Function "sap.ui.ux3.ActionBar.setThingIconURI": failed to set new icon "'+t+'".\n\tReason: either updateAction '+e+" or feeder "+this._feeder+" is not defined.")}return this};y.prototype.setDividerWidth=function(t){this._iSocActListWidth=null;this.setProperty("dividerWidth",t);return this};y.prototype.setAlwaysShowMoreMenu=function(t){var e=this.getProperty("alwaysShowMoreMenu");var o=this.getAggregation("businessActions",[]);this.setProperty("alwaysShowMoreMenu",t,true);if(e!=t&&o){if(!t){for(var i=0;i<o.length;i++){var n=o[i];this._createButtonForAction(n,this._oMoreMenu._getMenuItemForAction(n))}}else{var s=this._getBusinessActionButtons();for(var r=0;r<s.length;r++){if(s[r].oMenuItem){s[r].oMenuItem.setVisible(true);s[r].oMenuItem=null}}this.destroyAggregation("_businessActionButtons")}this._styleMoreMenuButton()}this._bCallOnresize=true;this._rerenderBusinessActions();return this};y.prototype.closePopups=function(){if(this._oUpdatePopup){this._oUpdatePopup.close()}if(this._oMoreMenu){this._oMoreMenu.close()}if(this._oMenu){this._oMenu.close()}};y.prototype._removeSocialAction=function(t){var e=null;if(t.name&&this.mActionMap[t.name]){if(this.mActionMap[t.name].fnExit){this.mActionMap[t.name].fnExit(this)}e=this.removeAggregation("_socialActions",this.mActionMap[t.name],true);this.mActionMap[t.name].destroy();delete this.mActionMap[t.name];this._rerenderSocialActions();this._iSocActListWidth=null}return e};y.prototype._removeAllSocialActions=function(){for(var t in this.mActionMap){if(this.mActionMap[t]&&this.mActionMap[t].fnExit){this.mActionMap[t].fnExit(this)}}this.mActionMap={};var e=this.removeAllAggregation("_socialActions",true);this._iSocActListWidth=null;this._rerenderSocialActions();return e};y.prototype._addSocialAction=function(t,e){var o=null;if(!this.mActionMap[t.name]){o=this._prepareSocialAction(t,e);if(t.fnInit){t.fnInit(this)}this._iSocActListWidth=null}if(o){this._rerenderSocialActions()}return o};y.prototype._prepareSocialAction=function(t,e){t.attachSelect(jQuery.proxy(function(e){if(t.fnActionSelected){t.fnActionSelected(e,this)}else{this.fireActionSelected({id:t.name,action:t})}},this));t.setTooltip(this._getLocalizedText(t.tooltipKey));this.mActionMap[t.name]=t;if(e){this.insertAggregation("_socialActions",t,e,true)}else{this.addAggregation("_socialActions",t,true)}return t};y.prototype._setShowSocialAction=function(t,e){return e?this._addSocialAction(t):this._removeSocialAction(t)};y.prototype.addBusinessAction=function(t){return this._addBusinessAction(t)};y.prototype.insertBusinessAction=function(t,e){return this._addBusinessAction(t,e)};y.prototype.removeBusinessAction=function(t){return this._removeBusinessAction(t,true)};y.prototype._removeBusinessAction=function(t,e){if(typeof t==="string"){var o;var i=t;for(var n=0;n<this.getBusinessActions().length;n++){var s=this.getBusinessActions()[n];if(s.getId()===i){o=s;break}}t=o}if(this._oMoreMenu){var r=this._oMoreMenu._getMenuItemForAction(t);if(r){this._oMoreMenu.removeItem(r);r.destroy()}if(this._oMoreMenu.getItems().length==0){this._oMoreMenuButton.destroy();this._oMoreMenuButton=null;this._oMoreMenu.destroy();this._oMoreMenu=null}}if(!this.getAlwaysShowMoreMenu()){var a=this._getButtonForAction(t);if(a){this.removeAggregation("_businessActionButtons",a,true);a.destroy()}}var u=this.removeAggregation("businessActions",t,true);if(e){this._rerenderBusinessActions()}return u};y.prototype.removeAllBusinessActions=function(){var t=this.getAggregation("businessActions",[]);if(t){for(var e=0;e<t.length;e++){this._removeBusinessAction(t[e],false)}}this._rerenderBusinessActions();var o=this.removeAllAggregation("businessActions",true);return o};y.prototype.destroyBusinessActions=function(){var t=this.getAggregation("businessActions",[]);if(t){for(var e=0;e<t.length;e++){var o=this._removeBusinessAction(t[e],false);if(o instanceof sap.ui.core.Element){o.destroy(true)}}}this._rerenderBusinessActions();var i=this.destroyAggregation("businessActions",true);return i};y.prototype._getBusinessActionButtons=function(){return this.getAggregation("_businessActionButtons",[])};y.prototype._addBusinessAction=function(t,e){var o;if(!e&&e!=0){o=this.addAggregation("businessActions",t,true)}else{o=this.insertAggregation("businessActions",t,e,true)}if(!this._oMoreMenuButton){this._oMoreMenuButton=new h(this.getId()+"-MoreMenuButton");this._oMoreMenuButton.setText(this._getLocalizedText("ACTIONBAR_BUTTON_MORE_TEXT"));this._oMoreMenuButton.setTooltip(this._getLocalizedText("ACTIONBAR_BUTTON_MORE_TOOLTIP"));this._oMoreMenuButton.setDockButton(f.EndTop);this._oMoreMenuButton.setDockMenu(f.EndBottom);this._styleMoreMenuButton();this._oMoreMenu=new c(this.getId()+"-MoreMenu",{ariaDescription:this._getLocalizedText("ACTIONBAR_BUTTON_MORE_TOOLTIP")});this._oMoreMenu._getMenuItemForAction=function(t){for(var e=0;e<this.getItems().length;e++){var o=this.getItems()[e];if(o.action==t){return o}}return null};this._oMoreMenuButton.setMenu(this._oMoreMenu)}var i=this._oMoreMenu.getId()+"-MenuItem-"+t.getId();var n=new l(i,{text:t.getText(),enabled:t.getEnabled()});n.action=t;n.attachSelect(jQuery.proxy(function(e){this.fireActionSelected({id:t.getId(),action:t})},this));if(e){this._oMoreMenu.insertItem(n,e)}else{this._oMoreMenu.addItem(n)}this._createButtonForAction(t,n,e);this._rerenderBusinessActions();return o};y.prototype._getMoreMenuButton=function(){return this._oMoreMenuButton};y.prototype._onresize=function(t){var e=this.$();if(e){var o=this.getActionBarMinWidth()+"px";if(e.css("minWidth")!=o){e.css("minWidth",o)}}if(!this.getAlwaysShowMoreMenu()&&this._oMoreMenuButton){var i=false;if(this._getBusinessActionButtons().length>1){var n=this._oMoreMenuButton.$().outerWidth();var s=e.outerWidth()-this._getSocialActionListMinWidth()-n;var r=this._getBusinessActionButtons();var a=0;for(var u=0;u<r.length;u++){var l=r[u].$().parent();a+=l.outerWidth();if(u==r.length-1){a-=n}if(a>=s){if(l.length>0){l.css("display","none");if(r[u].oMenuItem){r[u].oMenuItem.setVisible(true)}i=true}}else{if(l.length>0){l.css("display","");if(d.browser.msie){this._rerenderBusinessAction(r[u])}if(r[u].oMenuItem){r[u].oMenuItem.setVisible(false)}}}}i|=this.getAggregation("businessActions").length>r.length}var c=this._oMoreMenuButton.$().parent();if(c.length>0){i?c.css("display",""):c.css("display","none")}if(!i&&this._oMoreMenu){this._oMoreMenu.close()}}this._setItemNavigation()};y.prototype.onBeforeRendering=function(){n.deregister(this._sResizeListenerId);this._sResizeListenerId=null};y.prototype.onAfterRendering=function(){this._sResizeListenerId=n.register(this.getDomRef(),jQuery.proxy(this._onresize,this));if(this._bCallOnresize){this._onresize()}this._setItemNavigation()};y.prototype._getSocialActionListMinWidth=function(){if(!this._iSocActListWidth){if(this.getDividerWidth()){this._iSocActListWidth=parseInt(this.getDividerWidth())}else{var t=this.getAggregation("_socialActions",[]);var e=t.length;this._iSocActListWidth=24*e+12}}return this._iSocActListWidth};y.prototype.getActionBarMinWidth=function(){var t=this._getSocialActionListMinWidth();var e=this._oMoreMenuButton;if(!this.getAlwaysShowMoreMenu()&&this._getBusinessActionButtons().length==1){e=this._getBusinessActionButtons()[0]}if(e){var o=e.$().parent();if(o){t+=o.outerWidth()-3}}return t};y.prototype._getButtonForAction=function(t){for(var e=0;e<this._getBusinessActionButtons().length;e++){var o=this._getBusinessActionButtons()[e];if(o.action==t){return o}}return null};y.prototype._createButtonForAction=function(t,e,o){if(!this.getAlwaysShowMoreMenu()&&!t.showInMoreMenu){var i=new p({id:this.getId()+"-"+t.getId()+"Button",text:t.getText(),tooltip:t.getTooltip(),enabled:t.getEnabled()});i.attachPress(jQuery.proxy(function(e){this.fireActionSelected({id:t.getId(),action:t})},this));i.oMenuItem=e;i.action=t;if(o){this.insertAggregation("_businessActionButtons",i,o,true)}else{this.addAggregation("_businessActionButtons",i,true)}return i}return null};y.prototype._styleMoreMenuButton=function(){if(this._oMoreMenuButton){if(this.getAlwaysShowMoreMenu()){this._oMoreMenuButton.setLite(true);this._oMoreMenuButton.addStyleClass("sapUiUx3ActionBarLiteMoreButton")}else{this._oMoreMenuButton.setLite(false);this._oMoreMenuButton.removeStyleClass("sapUiUx3ActionBarLiteMoreButton")}}};y.prototype._setItemNavigation=function(){if(this.getDomRef()){this._oItemNavigation.setRootDomRef(jQuery(this.getDomRef()).get(0));var t=[];var e=this.getAggregation("_socialActions",[]);for(var o=0;o<e.length;o++){t.push(e[o].getDomRef())}e=this.getAggregation("_businessActionButtons",[]);for(var o=0;o<e.length;o++){t.push(e[o].getDomRef())}if(this._oMoreMenuButton&&this._oMoreMenuButton.getDomRef()){t.push(this._oMoreMenuButton.getDomRef())}this._oItemNavigation.setItemDomRefs(t)}};y.prototype.invalidate=function(e){if(e instanceof s){var o=sap.ui.getCore().byId(this.getId()+"-"+e.getId()+"Button");var i=this._oMoreMenu&&this._oMoreMenu._getMenuItemForAction(e);if(o){o.setTooltip(e.getTooltip());o.setText(e.getText());o.setEnabled(e.getEnabled())}if(i){i.setTooltip(e.getTooltip());i.setText(e.getText());i.setEnabled(e.getEnabled())}if(!o&&!i){t.prototype.invalidate.apply(this,arguments)}}t.prototype.invalidate.apply(this,arguments)};return y});
//# sourceMappingURL=ActionBar.js.map