/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
jQuery.sap.declare("sap.uiext.inbox.InboxFormattedTextView");sap.ui.commons.FormattedTextView.extend("sap.uiext.inbox.InboxFormattedTextView",{metadata:{properties:{wrapping:{type:"boolean",defaultValue:true},maxLines:{type:"int",defaultValue:1}}},renderer:function(e,t){sap.ui.commons.FormattedTextViewRenderer.render.apply(this,arguments)}});sap.uiext.inbox.InboxFormattedTextView.prototype.applyStylingToFormattedTextDiv=function(e){if(e){if(this.getWrapping()&&this.getMaxLines()>0){if(!this.canUseNativeLineClamp()){this.clampHeight();jQuery(e).css({"text-overflow":"ellipsis",overflow:"hidden","max-width":"100%"})}else{jQuery(e).css({display:"-webkit-box","-webkit-box-orient":"vertical",overflow:"hidden","-webkit-line-clamp":this.getMaxLines()+""})}}else if(!this.getWrapping()){jQuery(e).css({"text-overflow":"ellipsis",overflow:"hidden","max-width":"100%",whitespace:"nowrap"})}}};sap.uiext.inbox.InboxFormattedTextView.prototype.setMaxLines=function(e){this.setProperty("maxLines",e);var t=this.getTextDomRef();this.applyStylingToFormattedTextDiv(t);return this};sap.uiext.inbox.InboxFormattedTextView.prototype.onAfterRendering=function(){var e=this.getTextDomRef();this.applyStylingToFormattedTextDiv(e)};sap.uiext.inbox.InboxFormattedTextView.hasNativeLineClamp=function(){return typeof document.documentElement.style.webkitLineClamp!="undefined"};sap.uiext.inbox.InboxFormattedTextView.prototype.canUseNativeLineClamp=function(){if(!sap.uiext.inbox.InboxFormattedTextView.hasNativeLineClamp()){return false}return true};sap.uiext.inbox.InboxFormattedTextView.prototype.getClampHeight=function(e){var t=e||this.getTextDomRef();return this.getMaxLines()*this.getLineHeight(t)};sap.uiext.inbox.InboxFormattedTextView.prototype.setHtmlText=function(e){if(sap.ui.commons.FormattedTextView.prototype.setHtmlText){sap.ui.commons.FormattedTextView.prototype.setHtmlText.apply(this,arguments)}else{this.setProperty("htmlText",e)}if(this.isClamped()){this.getParent().getAggregation("taskDescriptionLink").setVisible(true)}};sap.uiext.inbox.InboxFormattedTextView.prototype.clampHeight=function(e){var t=e||this.getTextDomRef();if(!t){return 0}var i=this.getClampHeight(t);t.style.maxHeight=i+"px";return i};sap.uiext.inbox.InboxFormattedTextView.prototype.getTextDomRef=function(){var e=this.getDomRef();return e&&(e.firstElementChild||e)};sap.uiext.inbox.InboxFormattedTextView.prototype.getLineHeight=function(e){var t=e||this.getTextDomRef();var i,o;if(!t){return}if(window.getComputedStyle!==undefined){o=window.getComputedStyle(t)}else{o={};o.lineHeight=document.getElementById(t.id).currentStyle.lineHeight;o.fontSize=document.getElementById(t.id).currentStyle.fontSize}i=parseFloat(o.lineHeight);if(!i){i=parseFloat(o.fontSize)*this.normalLineHeight}var r=Math.floor(i);return r};sap.uiext.inbox.InboxFormattedTextView.prototype.isClamped=function(e,t){var i=e||this.getTextDomRef();if(!i){return}var o=this.getHtmlText(true);var r=this.getClampHeight(i);var n=t||o.length;i.textContent=o.slice(0,n);if(i.scrollHeight>r){return true}return false};sap.uiext.inbox.InboxFormattedTextView.prototype.removeClamp=function(e){var t=e||this.getTextDomRef();if(!t){return}jQuery(t).css("-webkit-line-clamp","");jQuery(t).css("max-height","");jQuery(t).css("height","auto")};sap.ui.core.Control.extend("sap.uiext.inbox.InboxTaskDetails",{metadata:{properties:{showMore:{type:"string",defaultValue:"auto"}},aggregations:{fTV:{type:"sap.ui.commons.FormattedTextView",multiple:false,visibility:"public"},taskDescriptionLink:{type:"sap.ui.commons.Link",multiple:false,visibility:"hidden"}},events:{showMoreClick:{enablePreventDefault:true}}},init:function(){var e=this;this._oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");this.setAggregation("taskDescriptionLink",new sap.ui.commons.Link({text:e._oBundle.getText("INBOX_SHOW_MORE_TEXT"),tooltip:e._oBundle.getText("INBOX_SHOW_MORE_LINK_TOOLTIP"),visible:false}).attachPress(jQuery.proxy(this.showMoreClick,this)))},renderer:{render:function(e,t){e.write("<div");e.writeControlData(t);e.addClass("inboxTaskDetails");e.writeClasses();e.write(">");e.write("<div");e.addClass("fTV");e.writeClasses();e.writeStyles();e.write(">");e.renderControl(t.getAggregation("fTV"));e.write("</div>");if(t.getAggregation("taskDescriptionLink").getVisible()){e.write("<div");e.addClass("taskDescriptionLink");e.writeClasses();e.writeStyles();e.write(">");e.renderControl(t.getAggregation("taskDescriptionLink"));e.write("</div>")}e.write("</div>")}},onAfterRendering:function(){var e=this.getAggregation("fTV");if(this.getShowMore()==="true"||e.isClamped()&&this.getShowMore()==="auto"){this.getAggregation("taskDescriptionLink").setVisible(true)}},showMoreClick:function(e){var t=sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");var i=t.getText("INBOX_SHOW_MORE_TEXT");var o=t.getText("INBOX_SHOW_LESS_TEXT");if(e.getSource().getText()===i){e.getSource().setText(t.getText("INBOX_SHOW_LESS_TEXT"));e.getSource().setTooltip(t.getText("INBOX_SHOW_LESS_LINK_TOOLTIP"));this.fireShowMoreClick({text:i})}else{e.getSource().setText(i);e.getSource().setTooltip(t.getText("INBOX_SHOW_MORE_LINK_TOOLTIP"));this.fireShowMoreClick({text:o})}}});
//# sourceMappingURL=InboxFormattedTextView.js.map