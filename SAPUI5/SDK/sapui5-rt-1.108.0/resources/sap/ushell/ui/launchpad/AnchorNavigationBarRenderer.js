// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources"],function(e){"use strict";var t={apiVersion:2};t.render=function(t,o){t.openStart("div",o);t.attr("data-sap-ui-customfastnavgroup","true");t.class("sapUshellAnchorNavigationBar");t.openEnd();t.openStart("div");t.class("sapUshellAnchorNavigationBarInner");t.openEnd();if(o.getGroups().length>0){o._setRenderedCompletely(true);t.openStart("div");t.class("sapUshellAnchorLeftOverFlowButton");t.accessibilityState(o._getOverflowLeftArrowButton(),{hidden:true});t.openEnd();t.renderControl(o._getOverflowLeftArrowButton());t.close("div");t.openStart("div");t.class("sapUshellAnchorNavigationBarItems");t.openEnd();t.openStart("ul");t.class("sapUshellAnchorNavigationBarItemsScroll");t.accessibilityState(o,{role:"tablist",label:e.i18n.getText("AnchorNavigationBar_AriaLabel")});t.openEnd();this.renderAnchorNavigationItems(t,o);t.close("ul");t.close("div");t.openStart("div");t.class("sapUshellAnchorRightOverFlowButton");t.accessibilityState(o._getOverflowRightArrowButton(),{hidden:true});t.openEnd();t.renderControl(o._getOverflowRightArrowButton());t.close("div");t.openStart("div");t.class("sapUshellAnchorItemOverFlow");t.accessibilityState(o._getOverflowButton(),{hidden:true});t.openEnd();t.renderControl(o._getOverflowButton());t.close("div")}t.close("div");t.close("div")};t.renderAnchorNavigationItems=function(e,t){t.getGroups().forEach(function(t){e.renderControl(t)})};t.shouldAddIBarContext=function(){return false};return t},true);
//# sourceMappingURL=AnchorNavigationBarRenderer.js.map