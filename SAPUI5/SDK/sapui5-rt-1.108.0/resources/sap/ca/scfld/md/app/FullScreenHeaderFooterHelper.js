/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.scfld.md.app.FullScreenHeaderFooterHelper");jQuery.sap.require("sap.ushell.ui.footerbar.JamShareButton");jQuery.sap.require("sap.ushell.ui.footerbar.JamDiscussButton");jQuery.sap.require("sap.ushell.ui.footerbar.AddBookmarkButton");jQuery.sap.require("sap.ca.scfld.md.app.ButtonListHelper");jQuery.sap.require("sap.ca.scfld.md.app.CommonHeaderFooterHelper");sap.ui.base.Object.extend("sap.ca.scfld.md.app.FullScreenHeaderFooterHelper",{constructor:function(e){this.oAppImp=e;this.oCommonHeaderFooterHelper=new sap.ca.scfld.md.app.CommonHeaderFooterHelper(e,undefined,true)},defineHeaderFooter:function(e){var o=e.getHeaderFooterOptions();this.setHeaderFooter(e,o)},setHeaderFooter:function(e,o,t){if(!o){return}var r=this.oCommonHeaderFooterHelper.startBuild(e,o,{iSettingsPosition:0},t);this.oCommonHeaderFooterHelper.createSettingsButton(e);var n=this.needsFooter(e);this.defineHeader(e,r,n);this.defineFooter(e,r,n);this.oAppImp.oCurController.FullCtrl=e;this.oAppImp.oCurController.MasterCtrl=null;this.oAppImp.oCurController.DetailCtrl=null;this.oCommonHeaderFooterHelper.endBuild(e)},defineFooter:function(e,o,t){if(t){this.oCommonHeaderFooterHelper.defineFooterRight(e,o,1e3,this.oAppImp.bIsPhone,false,true);if(!this.oAppImp.bIsPhone){if(!e._oControlStore.oLeftButtonList){e._oControlStore.oLeftButtonList=new sap.ca.scfld.md.app.ButtonListHelper(this.oAppImp,25);e._oControlStore.oLeftButtonList.oBar=e._oControlStore.oButtonListHelper.oBar;e._oControlStore.oButtonListHelper.addButtonListHelper(e._oControlStore.oLeftButtonList)}this.oCommonHeaderFooterHelper.getGenericButtons(3,e,e._oControlStore.oLeftButtonList)}}},defineHeader:function(e,o,t){var r=e._oHeaderFooterOptions.sFullscreenTitleId;this.oCommonHeaderFooterHelper.ensureHeader(e,o,true,undefined,r);if(e._oHeaderFooterOptions.oHeaderBtnSettings){this.oCommonHeaderFooterHelper.setAppHeaderBtn(e,e._oHeaderFooterOptions.oHeaderBtnSettings)}if(e._oHeaderFooterOptions.sI18NFullscreenTitle){var n=this.oAppImp.getResourceBundle();var i=n.getText(e._oHeaderFooterOptions.sI18NFullscreenTitle)}else if(e._oHeaderFooterOptions.sFullscreenTitle){var i=e._oHeaderFooterOptions.sFullscreenTitle}else{var n=this.oAppImp.getResourceBundle();var i=n.getText("FULLSCREEN_TITLE")}e._oControlStore.oTitle.setText(i);if(e._oControlStore.oFacetFilterButton){e._oControlStore.oFacetFilterButton.setVisible(!!e._oHeaderFooterOptions.onFacetFilter)}else if(e._oHeaderFooterOptions.onFacetFilter){e._oControlStore.oFacetFilterButton=new sap.m.Button;e._oControlStore.oFacetFilterButton.setIcon("sap-icon://filter");e._oControlStore.oFacetFilterButton.attachPress(function(o){e._oHeaderFooterOptions.onFacetFilter(o)});e._oControlStore.oHeaderBar.addContentRight(e._oControlStore.oFacetFilterButton)}},needsFooter:function(e){return e._oHeaderFooterOptions.onFacetFilter||this.oCommonHeaderFooterHelper.getGenericCount(e)>0||this.oCommonHeaderFooterHelper.getActionsCount(e)>0||this.oCommonHeaderFooterHelper.hasShareButtons(e)},getFooterRightCount:function(e){var o=this.oCommonHeaderFooterHelper.getFooterRightCount(e,"S");var t=this.oCommonHeaderFooterHelper.getGenericCount(e);var r=this.oCommonHeaderFooterHelper.getActionsCount(e);if(this.oAppImp.bIsPhone&&sap.ui.Device.orientation.landscape){if(r===1&&t<4){return r+t}if(r===0){return t}o=this.oCommonHeaderFooterHelper.getFooterRightCount(e,"M")}else if(this.oAppImp.bIsPhone&&!sap.ui.Device.orientation.landscape){if(r===0){return t}o=this.oCommonHeaderFooterHelper.getFooterRightCount(e,"S")}else if(this.oAppImp.bIsIPad&&!sap.ui.Device.orientation.landscape){o=this.oCommonHeaderFooterHelper.getFooterRightCount(e,"M")}else{o=this.oCommonHeaderFooterHelper.getFooterRightCount(e,"XL")}if(r===o&&t===1){return o+1}return o}});
//# sourceMappingURL=FullScreenHeaderFooterHelper.js.map