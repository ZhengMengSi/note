// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/m/library","sap/m/Button","sap/ui/thirdparty/jquery","sap/ushell/utils/WindowUtils"],function(r,m,B,q,W){"use strict";var P=m.PlacementType;var A=function(){this.oEventBus=sap.ui.getCore().getEventBus();this.init=function(M){this.oModel=M;};};A.prototype._activate=function(){this.oModel.setProperty("/tileActionModeActive",true);this.aOrigHiddenGroupsIds=this.getHomepageManager().getCurrentHiddenGroupIds(this.oModel);var d=sap.ui.getCore().byId("dashboardGroups");d.addLinksToUnselectedGroups();var t=sap.ui.getCore().byId("ActionModeBtn");if(t){t.setTooltip(r.i18n.getText("exitEditMode"));t.setText(r.i18n.getText("exitEditMode"));if(t.setSelected){t.setSelected(true);}}this.oEventBus.publish("launchpad","actionModeActive");};A.prototype._deactivate=function(){this.oModel.setProperty("/tileActionModeActive",false);this.oEventBus.publish("launchpad","actionModeInactive",this.aOrigHiddenGroupsIds);var t=sap.ui.getCore().byId("TileActions");if(t!==undefined){t.destroy();}sap.ui.require(["sap/m/MessageToast"],function(M){M.show(r.i18n.getText("savedChanges"),{duration:4000});});var T=sap.ui.getCore().byId("ActionModeBtn");if(T){T.setTooltip(r.i18n.getText("activateEditMode"));T.setText(r.i18n.getText("activateEditMode"));if(T.setSelected){T.setSelected(false);}}};A.prototype.toggleActionMode=function(M,s,d){d=d||[];var v=d.filter(function(g){return g.getVisible();});var D={group:v[M.getProperty("/topGroupInViewPortIndex")],restoreLastFocusedTile:true};if(M.getProperty("/tileActionModeActive")){this._deactivate();var j=q(".sapUshellTileContainerHeader[tabindex=0]");if(j.length){var a=j[0].closest(".sapUshellTileContainer");if(a){D.restoreLastFocusedTileContainerById=a.id;}}}else{this._activate();}this.oEventBus.publish("launchpad","scrollToGroup",D);};A.prototype.activateGroupEditMode=function(g){var j=q(g.getDomRef()).find(".sapUshellTileContainerContent");j.addClass("sapUshellTileContainerEditMode");};A.prototype.getHomepageManager=function(){if(!this.oHomepageManager){this.oHomepageManager=sap.ushell.components.getHomepageManager();}return this.oHomepageManager;};A.prototype._openActionsMenu=function(e,v){var t=this,T=v||e.getSource(),a=[],o=sap.ui.getCore().byId("TileActions"),b,i,c=[],n,d,f,g,h,j;if(T){g=T.getBindingContext().getObject().object;a=this.getHomepageManager().getTileActions(g);}t.oTileControl=T;q(".sapUshellTileActionLayerDivSelected").removeClass("sapUshellTileActionLayerDivSelected");j=q(e.getSource().getDomRef()).find(".sapUshellTileActionLayerDiv");j.addClass("sapUshellTileActionLayerDivSelected");var k=T.getModel();var G=T.getParent().getBindingContext().getPath();if(a.length===0||k.getProperty(G+"/isGroupLocked")){n=new B({text:r.i18n.getText("tileHasNoActions"),enabled:false});c.push(n);}else{for(i=0;i<a.length;i++){f=a[i];h=(function(f){return function(){t._handleActionPress(f,T);};}(f));d=new B({text:f.text,icon:f.icon,press:h});c.push(d);}}b=e.getSource().getActionSheetIcon?e.getSource().getActionSheetIcon():undefined;if(!b){var M=sap.ui.getCore().byId(e.getSource().getId()+"-action-more");if(M){b=M;}else{b=e.getSource();}}if(!o){sap.ui.require(["sap/m/ActionSheet"],function(l){o=new l("TileActions",{placement:P.Bottom,afterClose:function(){q(".sapUshellTileActionLayerDivSelected").removeClass("sapUshellTileActionLayerDivSelected");var E=sap.ui.getCore().getEventBus();E.publish("dashboard","actionSheetClose",t.oTileControl);}});t._openActionSheet(o,c,b);});}else{t._openActionSheet(o,c,b);}};A.prototype._openActionSheet=function(a,b,t){b=b||[];a.destroyButtons();b.forEach(function(o){a.addButton(o);});a.openBy(t);};A.prototype._handleActionPress=function(a,t){if(a.press){a.press.call(a,t);}else if(a.targetURL){if(a.targetURL.indexOf("#")===0){hasher.setHash(a.targetURL);}else{W.openURL(a.targetURL,"_blank");}}else{sap.ui.require(["sap/m/MessageToast"],function(M){M.show("No Action");});}};return new A();},true);