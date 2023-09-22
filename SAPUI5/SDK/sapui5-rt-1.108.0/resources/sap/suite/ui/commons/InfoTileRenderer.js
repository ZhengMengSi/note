/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./library","sap/ui/core/HTML"],function(t,e){"use strict";var i={};i.renderTitle=function(t,e){if(e.getTitle()!==""){t.write("<div");t.addClass("sapSuiteInfoTileTitleTxt");t.addClass(e.getState());t.addClass(e.getSize());t.writeClasses();t.writeAttribute("id",e.getId()+"-title-text");t.writeAttributeEscaped("title",e.getTitle());t.write(">");t.renderControl(e._oTitle);t.write("</div>")}};i.renderDescription=function(t,e){if(e.getDescription()!==""){t.write("<div");t.addClass("sapSuiteInfoTileDescTxt");t.addClass(e.getState());t.addClass(e.getSize());t.writeClasses();t.writeAttribute("id",e.getId()+"-description-text");t.writeAttributeEscaped("title",e.getDescription());t.write(">");t.writeEscaped(e.getDescription());t.write("</div>")}};i.renderInnerContent=function(t,e){t.renderControl(e.getContent())};i.renderContent=function(t,e){t.write("<div");t.addClass("sapSuiteInfoTileContent");t.addClass(e.getSize());t.writeClasses();t.writeAttribute("id",e.getId()+"-content");t.write(">");this.renderInnerContent(t,e);t.write("</div>")};i.renderFooterText=function(t,e){if(e.getFooter()!==""){t.writeEscaped(e.getFooter())}};i.renderFooterTooltip=function(t,e){t.writeAttributeEscaped("title",e.getFooter())};i.renderFooter=function(i,r){var d=r.getState();i.write("<div");i.addClass("sapSuiteInfoTileFtrTxt");i.addClass(r.getSize());i.addClass(r.getState());i.writeClasses();i.writeAttribute("id",r.getId()+"-footer-text");if(d===t.LoadState.Loaded){this.renderFooterTooltip(i,r)}i.write(">");switch(d){case t.LoadState.Loading:var s=new e({content:"<div class='sapSuiteInfoTileLoading'><div>"});s.setBusyIndicatorDelay(0);s.setBusy(true);i.renderControl(s);break;case t.LoadState.Failed:i.renderControl(r._oWarningIcon);i.write("<span");i.writeAttribute("id",r.getId()+"-failed-text");i.addClass("sapSuiteInfoTileFtrFldTxt");i.writeClasses();i.write(">");i.writeEscaped(r._sFailedToLoad);i.write("</span>");break;default:this.renderFooterText(i,r)}i.write("</div>")};i.render=function(t,e){var i=e.getTooltip_AsString();t.write("<div");t.writeControlData(e);if(i){t.writeAttributeEscaped("title",i)}t.addClass("sapSuiteInfoTile");t.addClass(e.getSize());t.addClass(e.getState());t.writeClasses();t.writeAttribute("tabindex","0");t.write(">");this.renderTitle(t,e);this.renderDescription(t,e);this.renderContent(t,e);this.renderFooter(t,e);t.write("</div>")};return i},true);
//# sourceMappingURL=InfoTileRenderer.js.map