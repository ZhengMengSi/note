/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/theming/Parameters","sap/m/ScrollContainer","sap/ui/core/Icon","sap/m/Label","./TabContainerRenderer"],function(jQuery,e,t,a,n,o,s,r,i){"use strict";var l=t.extend("sap.me.TabContainer",{metadata:{deprecated:true,library:"sap.me",properties:{selectedTab:{type:"int",group:"Data",defaultValue:null},badgeInfo:{type:"int",group:"Data",defaultValue:null},badgeNotes:{type:"int",group:"Data",defaultValue:null},badgeAttachments:{type:"int",group:"Data",defaultValue:null},badgePeople:{type:"int",group:"Data",defaultValue:null},expandable:{type:"boolean",group:"Misc",defaultValue:true},expanded:{type:"boolean",group:"Misc",defaultValue:true},visible:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{tabs:{type:"sap.ui.core.Icon",multiple:true,singularName:"tab",visibility:"hidden"},contentInfo:{type:"sap.ui.core.Control",multiple:false},contentAttachments:{type:"sap.ui.core.Control",multiple:false},contentNotes:{type:"sap.ui.core.Control",multiple:false},contentPeople:{type:"sap.ui.core.Control",multiple:false},badges:{type:"sap.ui.core.Control",multiple:true,singularName:"badge",visibility:"hidden"}},events:{select:{allowPreventDefault:true},expand:{},collapse:{}}}});l.prototype.init=function(){this.addAggregation("tabs",this._createButton("Info"));this.addAggregation("tabs",this._createButton("Notes"));this.addAggregation("tabs",this._createButton("Attachments"));this.addAggregation("tabs",this._createButton("People"));a.insertFontFaceStyle();this._bFirstRendering=true};l.prototype.setBadgeInfo=function(e){this._setBadgeLabelByName("badgeInfo",e);return this};l.prototype.setBadgeAttachments=function(e){this._setBadgeLabelByName("badgeAttachments",e);return this};l.prototype.setBadgeNotes=function(e){this._setBadgeLabelByName("badgeNotes",e);return this};l.prototype.setBadgePeople=function(e){this._setBadgeLabelByName("badgePeople",e);return this};l.prototype.onBeforeRendering=function(){if(this.getSelectedTab()==undefined){this.setProperty("selectedTab",0,true)}};l.prototype._setBadgeLabelByName=function(e,t){var a=sap.ui.getCore().byId(this.getId()+"-"+e);a.setText(t);this.setProperty(e,t);a.toggleStyleClass("sapUIMeTabContainerHiddenBadges",t==0)};l.prototype._placeElements=function(){var e=this.$("arrow");var t=this.getAggregation("tabs")[this.getSelectedTab()];if(t&&t.$().outerWidth()>8){var a=parseFloat(t.$()[0].offsetLeft)+parseFloat(t.$().outerWidth()/2)-parseFloat(e.width()/2);e.css("left",a+"px")}};l.prototype.onAfterRendering=function(){this.setProperty("expanded",true,true);if(this._bFirstRendering){this._bFirstRendering=false;setTimeout(jQuery.proxy(this._placeElements,this),300)}else{this._placeElements()}};l.prototype.onThemeChanged=function(){this._placeElements()};l.prototype.onTransitionEnded=function(){var e=this.$("container");if(this.getExpanded()){this.$("arrow").show();e.css("display","block");this.$().find(".sapUIMeTabContainerContent").removeClass("sapUIMeTabContainerContentClosed")}else{e.css("display","none");this.$().find(".sapUIMeTabContainerContent").addClass("sapUIMeTabContainerContentClosed")}};l.prototype.toggleExpandCollapse=function(){var e=!this.getExpanded();var t=this.$("container");var a=this.$("arrow");if(e){this.$().find(".sapUIMeTabContainerButtons").children().filter(":eq("+this.getSelectedTab()+")").addClass("sapUIMeTabContainerTabSelected");t.slideDown("400",jQuery.proxy(this.onTransitionEnded,this));this.fireExpand()}else{a.hide();this.$().find(".sapUIMeTabContainerTabSelected").removeClass("sapUIMeTabContainerTabSelected");t.slideUp("400",jQuery.proxy(this.onTransitionEnded,this));this.fireCollapse()}this.setProperty("expanded",e,true)};l.prototype.onButtonTap=function(e){var t=e.getSource();var a=this.indexOfAggregation("tabs",t);if(a==this.getSelectedTab()&&this.getExpandable()){this.toggleExpandCollapse()}else{this.setProperty("expanded",true,true);var n=t.getId();var o=this._getContentForBtn(n);if(o){if(this.fireSelect()){this.setSelectedTab(a)}}}};l.prototype._getContentForBtn=function(e){var t=this.getId()+"-";var a=e.substr(e.indexOf(t)+t.length);return this.getAggregation(a)};l.prototype._getBagdeForBtn=function(e){var t=this.getId()+"-content";var a=e.substr(e.indexOf(t)+t.length);a.charAt(0).toUpperCase();a="badge"+a;return this.getProperty(a)};l.prototype._getScrollContainer=function(e){return new o({content:e})};l.prototype._createButton=function(e){var t=n.get("sapMeTabIcon"+e);var o=a.getIconURI(t);var i=n.get("sapMeTabColor"+e);var l=new s(this.getId()+"-content"+e,{src:o,backgroundColor:i,activeColor:n.get("sapUiIconInverted")});l.addStyleClass("sapUIMeTabContainerBtn");l.addStyleClass("sapUIMeTabContainerBtn"+e);l.attachPress(this.onButtonTap,this);var p=new r(this.getId()+"-badge"+e,{textAlign:"Center"});p.addStyleClass("sapUIMeTabContainerBadge");p.addStyleClass("sapUIMeTabContainerBadge"+e);this.addAggregation("badges",p);return l};return l});
//# sourceMappingURL=TabContainer.js.map