// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Bar","sap/ui/Device","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject","sap/m/Button","sap/ushell/resources","sap/ushell/library","./AnchorNavigationBarRenderer"],function(t,e,jQuery,s,o,i){"use strict";var r=t.extend("sap.ushell.ui.launchpad.AnchorNavigationBar",{metadata:{library:"sap.ushell",properties:{accessibilityLabel:{type:"string",defaultValue:null},selectedItemIndex:{type:"int",group:"Misc",defaultValue:0},overflowEnabled:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{groups:{type:"sap.ushell.ui.launchpad.AnchorItem",multiple:true,singularName:"group"}},events:{afterRendering:{},itemPress:{}}}});r.prototype.init=function(){e.resize.attachHandler(this.reArrangeNavigationBarElements,this);this.bGroupWasPressed=false;this.bIsRtl=sap.ui.getCore().getConfiguration().getRTL();this._bIsRenderedCompletely=false;this.fnNavigationBarItemsVisibility=this.setNavigationBarItemsVisibility.bind(this);this.fnAdjustVisibleAnchorItemsAccessibility=this.adjustVisibleAnchorItemsAccessibility.bind(this)};r.prototype.onBeforeRendering=function(){var t=window.document.getElementsByClassName("sapUshellAnchorNavigationBarItemsScroll")[0];if(t){t.removeEventListener("scroll",this.fnNavigationBarItemsVisibility)}};r.prototype.onAfterRendering=function(){if(this._bIsRenderedCompletely){this.reArrangeNavigationBarElements();this.adjustVisibleAnchorItemsAccessibility();var t=window.document.getElementsByClassName("sapUshellAnchorNavigationBarItemsScroll")[0];if(t){t.addEventListener("scroll",this.fnNavigationBarItemsVisibility)}}};r.prototype.openOverflowPopup=function(){var t=jQuery(".sapUshellAnchorItemOverFlow").hasClass("sapUshellAnchorItemOverFlowOpen");if(this.oOverflowButton&&!t){this.oOverflowButton.firePress()}};r.prototype.closeOverflowPopup=function(){if(this.oPopover){this.oPopover.close()}};r.prototype.reArrangeNavigationBarElements=function(){this.anchorItems=this.getVisibleGroups();var t=this.getSelectedItemIndex()||0;if(this.anchorItems.length){this.adjustItemSelection(t)}if(e.system.phone&&this.anchorItems.length){this.anchorItems.forEach(function(t){t.setIsGroupVisible(false)});this.anchorItems[this.getSelectedItemIndex()].setIsGroupVisible(true)}else{setTimeout(function(){this.setNavigationBarItemsVisibility()}.bind(this),200)}};r.prototype._scrollToGroupByGroupIndex=function(t,s){var o=e.system.tablet?".sapUshellAnchorNavigationBarItemsScroll":".sapUshellAnchorNavigationBarItems";var i=document.documentElement.querySelector(o);var r=this.anchorItems[t].getDomRef();if(i&&r){var l=i.getBoundingClientRect();var n=r.getBoundingClientRect();var h=jQuery(i);var a=this.bIsRtl?h.scrollLeftRTL():i.scrollLeft;var f;if(n.left<l.left){f=n.left-l.left-16}else if(n.right>l.right){f=n.right-l.right+16}if(f){if(this.bIsRtl){h.scrollLeftRTL(a+f)}else{i.scrollLeft=a+f}}this.setNavigationBarItemsVisibility()}};r.prototype.setNavigationBarItemsVisibility=function(){if(!e.system.phone){this.setNavigationBarItemsVisibilityOnDesktop()}else if(this.anchorItems&&this.anchorItems.length>0){this.oOverflowButton.removeStyleClass("sapUshellShellHidden");var t=this.getSelectedItemIndex()||0;if(this.oPopover){this.oPopover.setTitle(this.anchorItems[t].getTitle())}}};r.prototype.setNavigationBarItemsVisibilityOnDesktop=function(){if(this.anchorItems.length&&(!this.isMostRightAnchorItemVisible()||!this.isMostLeftAnchorItemVisible())){this.oOverflowButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowButton){this.oOverflowButton.addStyleClass("sapUshellShellHidden")}if(this.bIsRtl){if(this.anchorItems.length&&!this.isMostLeftAnchorItemVisible()){this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowRightButton){this.oOverflowRightButton.addStyleClass("sapUshellShellHidden")}if(this.anchorItems.length&&!this.isMostRightAnchorItemVisible()){this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowLeftButton){this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden")}}else{if(this.anchorItems.length&&!this.isMostLeftAnchorItemVisible()){this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowLeftButton){this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden")}if(this.anchorItems.length&&!this.isMostRightAnchorItemVisible()){this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowRightButton){this.oOverflowRightButton.addStyleClass("sapUshellShellHidden")}}};r.prototype.adjustItemSelection=function(t){setTimeout(function(){if(this.anchorItems&&this.anchorItems.length){this.anchorItems.forEach(function(t){t.setSelected(false)});if(t>=0&&t<this.anchorItems.length){this.anchorItems[t].setSelected(true);this._scrollToGroupByGroupIndex(t)}}}.bind(this),50)};r.prototype.isMostRightAnchorItemVisible=function(){var t=jQuery(".sapUshellAnchorNavigationBarInner"),e=!s(t)?t.width():0,o=!s(t)&&t.offset()?t.offset().left:0,i=this.bIsRtl?this.anchorItems[0].getDomRef():this.anchorItems[this.anchorItems.length-1].getDomRef(),r=!s(i)?jQuery(i).width():0,l;if(r<0){r=80}l=i&&jQuery(i).offset()?jQuery(i).offset().left:0;return Math.ceil(l)+r<=o+e};r.prototype.isMostLeftAnchorItemVisible=function(){var t=jQuery(".sapUshellAnchorNavigationBarInner"),e=!s(t)&&t.offset()&&t.offset().left||0,o=this.bIsRtl?this.anchorItems[this.anchorItems.length-1].getDomRef():this.anchorItems[0].getDomRef(),i=!s(o)&&jQuery(o).offset()?jQuery(o).offset().left:0;return Math.ceil(i)>=e};r.prototype.setSelectedItemIndex=function(t){if(t!==undefined){this.setProperty("selectedItemIndex",t,true)}};r.prototype.setOverflowEnabled=function(t){this.setProperty("overflowEnabled",t);if(this.oOverflowButton){this.oOverflowButton.setEnabled(t)}};r.prototype._getOverflowLeftArrowButton=function(){if(!this.oOverflowLeftButton){this.oOverflowLeftButton=new o({icon:"sap-icon://slim-arrow-left",tooltip:i.i18n.getText("scrollToTop"),press:function(){this._scrollToGroupByGroupIndex(0)}.bind(this)}).addStyleClass("sapUshellShellHidden");this.oOverflowLeftButton._bExcludeFromTabChain=true}return this.oOverflowLeftButton};r.prototype._getOverflowRightArrowButton=function(){if(!this.oOverflowRightButton){this.oOverflowRightButton=new o({icon:"sap-icon://slim-arrow-right",tooltip:i.i18n.getText("scrollToEnd"),press:function(){this._scrollToGroupByGroupIndex(this.anchorItems.length-1)}.bind(this)}).addStyleClass("sapUshellShellHidden");this.oOverflowRightButton._bExcludeFromTabChain=true}return this.oOverflowRightButton};r.prototype._getOverflowButton=function(){if(!this.oOverflowButton){this.oOverflowButton=new o("sapUshellAnchorBarOverflowButton",{icon:"sap-icon://slim-arrow-down",tooltip:i.i18n.getText("more_groups"),enabled:this.getOverflowEnabled(),press:function(){this._togglePopover()}.bind(this)}).addStyleClass("sapUshellShellHidden")}return this.oOverflowButton};r.prototype._togglePopover=function(){sap.ui.require(["sap/m/Popover","sap/ui/model/Filter","sap/ushell/ui/launchpad/GroupListItem","sap/m/List","sap/m/library"],function(t,e,s,o,i){var r=i.ListMode;if(!this.oPopover){this.oList=new o({mode:r.SingleSelectMaster,rememberSelections:false,selectionChange:function(t){this.fireItemPress({group:t.getParameter("listItem")});this.oPopover.close()}.bind(this)});this.oPopover=new t("sapUshellAnchorBarOverflowPopover",{showArrow:false,showHeader:false,placement:"Left",content:[this.oList],horizontalScrolling:false,beforeOpen:function(){var t=jQuery(".sapUshellAnchorItemOverFlow"),e=sap.ui.getCore().getConfiguration().getRTL(),s=e?-1*t.outerWidth():t.outerWidth();this.setOffsetX(s)},afterClose:function(){jQuery(".sapUshellAnchorItemOverFlow").removeClass("sapUshellAnchorItemOverFlowOpen");jQuery(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed",false)}}).addStyleClass("sapUshellAnchorItemsPopover").addStyleClass("sapContrastPlus")}if(this.oPopover.isOpen()){this.oPopover.close()}else{this.anchorItems=this.getVisibleGroups();this.oList.setModel(this.getModel());var l=this.getModel().getProperty("/tileActionModeActive");var n=new e("","EQ","a");n.fnTest=function(t){if(!t.visibilityModes[l?1:0]){return false}return t.isGroupVisible||l};this.oList.bindItems({path:"/groups",template:new s({title:"{title}",groupId:"{groupId}",index:"{index}"}),filters:[n]});var h=jQuery(".sapUshellAnchorItemSelected").attr("id");var a=sap.ui.getCore().byId(h);this.oList.getItems().forEach(function(t){if(a.mProperties.groupId===t.mProperties.groupId){t.addStyleClass("sapUshellAnchorPopoverItemSelected")}else{t.addStyleClass("sapUshellAnchorPopoverItemNonSelected")}});jQuery(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed",true);this.oPopover.openBy(this.oOverflowButton)}}.bind(this))};r.prototype.getVisibleGroups=function(){return this.getGroups().filter(function(t){return t.getVisible()})};r.prototype._setRenderedCompletely=function(t){this._bIsRenderedCompletely=t};r.prototype.handleAnchorItemPress=function(t){this.bGroupWasPressed=true;this.fireItemPress({group:t.getSource(),manualPress:true})};r.prototype.adjustVisibleAnchorItemsAccessibility=function(){var t=this.getVisibleGroups(),e=t.length;t.forEach(function(t,s){t.setPosinset(s+1);t.setSetsize(e)})};r.prototype.addGroup=function(t,e){t.attachVisibilityChanged(this.fnAdjustVisibleAnchorItemsAccessibility);return this.addAggregation("groups",t,e)};r.prototype.insertGroup=function(t,e,s){t.attachVisibilityChanged(this.fnAdjustVisibleAnchorItemsAccessibility);return this.insertAggregation("groups",t,e,s)};r.prototype.removeGroup=function(t,e){t.detachVisibilityChanged(this.fnAdjustVisibleAnchorItemsAccessibility);return this.removeAggregation("groups",t,e)};r.prototype.exit=function(){if(this.oOverflowLeftButton){this.oOverflowLeftButton.destroy()}if(this.oOverflowRightButton){this.oOverflowRightButton.destroy()}if(this.oOverflowButton){this.oOverflowButton.destroy()}if(this.oPopover){this.oPopover.destroy()}if(t.prototype.exit){t.prototype.exit.apply(this,arguments)}};return r});
//# sourceMappingURL=AnchorNavigationBar.js.map