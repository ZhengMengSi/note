/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/landvisz/EntityConstants","sap/landvisz/internal/EntityAction","sap/landvisz/internal/IdentificationBar","sap/landvisz/internal/ModelingStatus","sap/ui/core/Control","sap/ui/core/Icon","sap/ui/commons/Dialog","sap/ui/commons/Image","sap/ui/commons/Label","sap/ui/commons/layout/HorizontalLayout","sap/ui/commons/layout/VerticalLayout","sap/ui/commons/TabStrip","./LandscapeEntityRenderer"],function(t,e,i,a,s,o,n,r,l,u,h,p,y,d){"use strict";var c=t.EntityCSSSize;var g=t.ModelingStatus;var f=o.extend("sap.landvisz.LandscapeEntity",{metadata:{library:"sap.landvisz",properties:{systemName:{type:"string",group:"Data",defaultValue:null},type:{type:"sap.landvisz.LandscapeObject",group:"Data",defaultValue:null},qualifierText:{type:"string",group:"Data",defaultValue:null},qualifierTooltip:{type:"string",group:"Data",defaultValue:null},qualifierType:{type:"string",group:"Data",defaultValue:null},renderingSize:{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:c.Regular},defaultState:{type:"string",group:"Data",defaultValue:null},description:{type:"string",group:"Data",defaultValue:null},actions:{type:"object",group:"Data",defaultValue:null},systemStatus:{type:"sap.landvisz.ModelingStatus",group:"Data",defaultValue:g.NORMAL},statusTooltip:{type:"string",group:"Data",defaultValue:null},explodeViewWidth:{type:"sap.ui.core.CSSSize",group:"Data",defaultValue:null},explodeViewHeight:{type:"sap.ui.core.CSSSize",group:"Data",defaultValue:null},showCustomActions:{type:"boolean",group:"Identification",defaultValue:true},showEntityActions:{type:"boolean",group:"Data",defaultValue:true},systemId:{type:"string",group:"Identification",defaultValue:null},stateIconSrc:{type:"string",group:"Data",defaultValue:null},stateIconTooltip:{type:"string",group:"Data",defaultValue:null},componentType:{type:"sap.landvisz.ComponentType",group:"Identification",defaultValue:null},componentTypeTooltip:{type:"string",group:"Data",defaultValue:null},trackSystemCount:{type:"string",group:"Misc",defaultValue:null}},aggregations:{dataContainers:{type:"sap.landvisz.internal.DataContainer",multiple:true,singularName:"dataContainer"},actionBar:{type:"sap.landvisz.internal.ActionBar",multiple:true,singularName:"actionBar"},entityStatus:{type:"sap.ui.commons.Image",multiple:false}},events:{mouseOverIdenIcon:{},statusSelect:{},trackInfoPress:{}}}});f.prototype.init=function(){this.initializationDone=false;this.top=0;this.explodeViewClosed=true;this.left=0;this.oHLayout=null;this.firstTime=true;var t=sap.ui.getCore().getConfiguration().getTheme();this.internalEvent=false;this.showMax=true;this._imgResourcePath=sap.ui.resource("sap.landvisz","themes/base/img/framework/");this._imgFolderPath="16x16/";this.maxIconSrc=this._imgResourcePath+this._imgFolderPath+"maximize_enable_dark.png";this.restoreIconSrc=this._imgResourcePath+this._imgFolderPath+"restore_enable_dark.png";this.smvIconSrc=this._imgResourcePath+ +this._imgFolderPath+"openshowall_enable_dark.png";this.smvCollapseIconSrc=this._imgResourcePath+ +this._imgFolderPath+"closeshowall_enable_dark.png";this.entityAction;this.entityActionArray=new Array;var e=sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");this.SHOW_ALL_TEXT=e.getText("SHOW_ALL");this.COLLAPSE_TEXT=e.getText("COLLAPSE_EXPLODE_VIEW");this.MAXIMIZE_TEXT=e.getText("MAXIMIZE");this.RESTORE_TEXT=e.getText("RESTORE");this.NEXT=e.getText("NEXT");this.PREVIOUS=e.getText("PREVIOUS");this.createActionButtons(this.SHOW_ALL_TEXT,"showAll",this.smvIconSrc);this.createActionButtons(this.COLLAPSE_TEXT,"collapseAll",this.smvCollapseIconSrc);this.createActionButtons(this.MAXIMIZE_TEXT,"max",this.maxIconSrc);this.createActionButtons(this.RESTORE_TEXT,"restore",this.restoreIconSrc);this.dialogArray=new Array;this.propertyArray=new Array;this.expVisible=false;this.showMiniNavigation=true;this.hasNavigationEvent=false;this.hasEntityEvent=false;this.containerEvent=false;this.maxEnabled=true;this.sViewWidth=0;this.sViewHeight=0;this.viewType="";this.showOverlay=false;this.overlayFilter="";this.oDialog=new r({modal:false});this.previousClicked=false;this.display="block"};f.prototype.exit=function(){this.oHLayout&&this.oHLayout.destroy();this.oVLayout&&this.oVLayout.destroy()};f.prototype.createActionButtons=function(t,e,a){var s=this.getId();this.entityAction=new i(s+e+"EntityAction");this.entityAction.setActionTooltip(t);this.entityActionArray.push(this.entityAction)};f.prototype.initControls=function(){var t=this.getId();var e=sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");if(!this.oVLayout)this.oVLayout=new p(t+"-CLVEntityVLayout");if(!this.oVLayoutContainer)this.oVLayoutContainer=new p(t+"-CLVEntityVLayoutContainer");if(!this.oVLayoutProperties)this.oVLayoutProperties=new p(t+"-CLVEntityVLayoutProperties");if(!this.oHLayout)this.oHLayout=new h(t+"CLVEntityHLayout");if(!this.oIdnBar)this.oIdnBar=new a(t+"-CLVEntityIdnRegion");if(!this.modelStatus)this.modelStatus=new s(t+"-CLVEntityModelingStatus");if(!this.propertyHeaders)this.propertyHeaders=new Array;this.selectedIndex=0;this.dataContainer;this.headerBtn;this.navItem;this.isAggregated;if(!this.oHLayoutMiniNavigation)this.oHLayoutMiniNavigation=new h(t+"CLVEntityMiniNavigationHLayout");if(!this.oHLayoutAction)this.oHLayoutAction=new h(t+"CLVEntityActions");if(!this.oHLayoutAllAction)this.oHLayoutAllAction=new h(t+"CLVEntityAllActions");this.smvContainer;this.containerWidth;this.oToolBarBtn;this.visibleTabCount=0;if(!this.entityHeader)this.entityHeader=new y(t+"-CLVTabStrip");if(!this.oHeadersLayout)this.oHeadersLayout=new h(t+"-CLVHeadersLayout");if(!this.previousIcon)this.nextIcon=new l(t+"-NextImage");if(!this.previousIcon)this.previousIcon=new l(t+"-PreviousImage");if(!this.oSingleHeaderLayout)this.oSingleHeaderLayout=new h(t+"-oSingleHeaderLayout");if(!this.oSingleHeaderLabel)this.oSingleHeaderLabel=new u(t+"-oSingleHeaderLabel");if(!this.oVLayoutOverlay)this.oVLayoutOverlay=new p(t+"-vlayoutOverlay");this.nextEnabled=false;this.previousEnable=false;this.entityMaximized;var i=this;this.infoIcon=new n({src:"sap-icon://hint",press:function(){i.fireTrackInfoPress()}}).addStyleClass("trackInfoIcon")};f.prototype.onclick=function(t){if(t.srcControl.getTooltip()==this.MAXIMIZE_TEXT)this.display="none";else this.display="block"};f.prototype.onAfterRendering=function(){setTimeout(function(){var t=jQuery(document.getElementById("SMV"));var e;if(t&&t.length>0){for(var i=0;i<t[0].children.length;i++){e=jQuery(t[0].children[i]);e.show(700)}}},800);if(this.entityMaximized==true){var t=this.containerWidth-2;this.oHLayoutMiniNavigation.$().css({width:t});var e=this.sViewHeight-32-41;var i=this.sViewWidth-33-100;this.$("CLVEntityVLayoutProperties").css({height:e,width:i,display:this.display})}var a=this.containerWidth;if(this.entityMaximized!=true)a=a*12;var s=this.oHeadersLayout.$();s.css({width:a});var o=this.oHeadersLayout.getContent();var n;var r;if(o&&o.length>1){for(var l=0;l<o.length;l++){n=o[l];r=n.$();if(n.inDisplay==true){r.show()}else r.hide()}}var u=this.getDataContainers();var h;var p;if(u&&u.length>1){for(var l=0;l<u.length;l++){h=u[l];p=h.$();if(h.inDisplay==true){p.show(700)}else p.hide(500)}}this.previousClicked=false};return f});
//# sourceMappingURL=LandscapeEntity.js.map