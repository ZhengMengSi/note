/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/Device","sap/m/ValueColor",'./library',"sap/base/security/encodeXML","sap/base/Log","sap/suite/ui/microchart/MicroChartRenderUtils","sap/ui/core/theming/Parameters"],function(D,V,l,e,L,M,P){"use strict";var R={};R.FORM_RATIO=100;R.BACKGROUND_CIRCLE_BORDER_WIDTH=1;R.BACKGROUND_CIRCLE_RADIUS=(R.FORM_RATIO/2.0)-(R.BACKGROUND_CIRCLE_BORDER_WIDTH/2.0);R.RING_WIDTH=8.75;R.RING_CORE_RADIUS=R.BACKGROUND_CIRCLE_RADIUS-(R.RING_WIDTH/2.0)-R.BACKGROUND_CIRCLE_BORDER_WIDTH;R.SVG_VIEWBOX_CENTER_FACTOR="50%";R.X_ROTATION=0;R.SWEEP_FLAG=1;R.PADDING_WIDTH=0.22;R.NUMBER_FONT_SIZE=23.5;R.EDGE_CASE_SIZE_USE_SMALL_FONT=54;R.EDGE_CASE_SIZE_SHOW_TEXT=46;R.EDGE_CASE_SIZE_MICRO_CHART=24;R.render=function(r,c){if(!c._bThemeApplied){return;}if(c._hasData()){this._writeDivStartElement(c,r);this._writeOuterContainerElement(c,r);r.write("</div>");}else{r.write("<div");this._writeMainProperties(r,c);r.writeClasses();r.writeStyles();r.write(">");this._renderNoData(r);r.write("</div>");}};R._writeOuterContainerElement=function(c,r){this._writeDivVerticalContainerElement(c,r);this._writeDivInnerContainerElement(c,r);if(this._renderingOfInnerContentIsRequired(c)){this._writeLabelInside(c,r);}this._writeSVGStartElement(c,r);this._writeBackground(r);if(this._renderingOfInnerContentIsRequired(c)){this._writeBorders(r);if(this._innerCircleRequired(c)){this._writeCircle(c,r);}else{this._writeCircleWithPathElements(c,r);}}r.write("</svg>");r.write("</div>");if(this._renderingOfInnerContentIsRequired(c)){this._writeLabelOutside(c,r);}r.write("</div>");};R._writeMainProperties=function(r,c){var i=c.hasListeners("press");this._renderActiveProperties(r,c);var a=c.getTooltip_AsString(i);r.writeAttribute("role","img");if(c.getAriaLabelledBy().length){r.writeAccessibilityState(c);}else{r.writeAttributeEscaped("aria-label",a);}r.writeControlData(c);r.addClass("sapSuiteRMC");r.addClass("sapSuiteRMCSize"+c.getSize());r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());};R._writeDivStartElement=function(c,r){r.write("<div");this._writeMainProperties(r,c);r.writeClasses();r.writeStyles();r.write(">");};R._writeDivVerticalContainerElement=function(c,r){r.write("<div");r.addClass("sapSuiteRMCVerticalAlignmentContainer");r.addClass("sapSuiteRMCAlign"+c.getAlignContent());r.writeClasses();r.writeStyles();r.write(">");};R._writeDivInnerContainerElement=function(c,r){r.write("<div");r.addClass("sapSuiteRMCInnerContainer");r.writeClasses();r.writeStyles();r.write(">");};R._writeSVGStartElement=function(c,r){r.write("<svg class=\"sapSuiteRMCSvg"+"\" focusable=\"false"+"\" viewBox=\"0 0 "+R.FORM_RATIO+' '+R.FORM_RATIO+"\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">");};R._writeBackground=function(r){r.write("<circle class=\"sapSuiteRMCCircleBackground\" cx=\""+R.SVG_VIEWBOX_CENTER_FACTOR+"\" cy=\""+R.SVG_VIEWBOX_CENTER_FACTOR+"\" r=\""+R.BACKGROUND_CIRCLE_RADIUS+"\" stroke-width=\""+this.BACKGROUND_CIRCLE_BORDER_WIDTH+"\" />");};R._writeBorders=function(r){var f=R.RING_CORE_RADIUS+(R.RING_WIDTH/2.0)-(R.BACKGROUND_CIRCLE_BORDER_WIDTH/2.0),a=R.RING_CORE_RADIUS-(R.RING_WIDTH/2.0)+(R.BACKGROUND_CIRCLE_BORDER_WIDTH/2.0);r.write("<circle");r.addClass("sapSuiteRMCRing");r.writeClasses();r.writeAttribute("cx",R.SVG_VIEWBOX_CENTER_FACTOR);r.writeAttribute("cy",R.SVG_VIEWBOX_CENTER_FACTOR);r.writeAttribute("r",f);r.writeAttribute("stroke-width",R.BACKGROUND_CIRCLE_BORDER_WIDTH);r.write("/>");r.write("<circle");r.addClass("sapSuiteRMCRing");r.writeClasses();r.writeAttribute("cx",R.SVG_VIEWBOX_CENTER_FACTOR);r.writeAttribute("cy",R.SVG_VIEWBOX_CENTER_FACTOR);r.writeAttribute("r",a);r.writeAttribute("stroke-width",R.BACKGROUND_CIRCLE_BORDER_WIDTH);r.write("/>");};R._writeCircle=function(c,r){var C=this._getFullCircleColor(c);r.write("<circle");if(c._isValueColorValid()||C==="sapSuiteRMCRemainingCircle"){r.addClass(e(C));}else{r.writeAttributeEscaped("stroke",P.get(C)||C);}r.writeClasses();r.writeStyles();r.write("cx=\""+R.SVG_VIEWBOX_CENTER_FACTOR+"\" cy=\""+R.SVG_VIEWBOX_CENTER_FACTOR+"\" r=\""+R.RING_CORE_RADIUS+"\" fill=\"transparent\" stroke-width=\""+R.RING_WIDTH+"px\" />");};R._writeCircleWithPathElements=function(c,r){var i=c.getPercentage()>50?1:0;var p=this._getPercentageForCircleRendering(c)-R.PADDING_WIDTH;var a=this._calculatePathCoordinates(c,p,false);this._writePath1(i,a,c,r);p=this._getPercentageForCircleRendering(c)+R.PADDING_WIDTH;a=this._calculatePathCoordinates(c,p,true);this._writePath2(i,a,c,r);};R._writePath1=function(a,p,c,r){var s="M"+p[0]+" "+p[1]+" A "+R.RING_CORE_RADIUS+" "+R.RING_CORE_RADIUS+", "+R.X_ROTATION+", "+a+", "+R.SWEEP_FLAG+", "+p[2]+" "+p[3];var C=this._getPathColor(c);r.write("<path");r.addClass("sapSuiteRMCPath");if(c._isValueColorValid()||C==="sapSuiteRMCRemainingCircle"){r.addClass(e(C));}else{r.writeAttributeEscaped("stroke",P.get(C)||C);}r.writeClasses();r.writeStyles();r.write("d=\""+e(s)+"\" fill=\"transparent\" stroke-width=\""+R.RING_WIDTH+"px\" />");};R._writePath2=function(a,p,c,r){var s="M"+p[2]+" "+p[3]+" A "+R.RING_CORE_RADIUS+" "+R.RING_CORE_RADIUS+", "+R.X_ROTATION+", "+(1-a)+", "+R.SWEEP_FLAG+", "+p[0]+" "+p[1];r.write("<path class=\"sapSuiteRMCPath sapSuiteRMCRemainingCircle\" d=\""+e(s)+"\" fill=\"transparent\" stroke-width=\""+R.RING_WIDTH+"px\" />");};R._writeLabelInside=function(c,r){r.write("<div");r.addClass("sapSuiteRMCInsideLabel sapSuiteRMCFont "+this._getTextColorClass(c));r.writeClasses();r.writeStyles();r.write(">");r.write(e(this._generateTextContent(c)));r.write("</div>");};R._writeLabelOutside=function(c,r){r.write("<div");r.addClass("sapSuiteRMCOutsideLabel sapSuiteRMCFont sapSuiteRMCLabelHide "+this._getTextColorClass(c));r.writeClasses();r.writeStyles();r.write(">");r.write(e(this._generateTextContent(c)));r.write("</div>");};R._renderingOfInnerContentIsRequired=function(c){return c._hasData();};R._getVerticalViewboxCenterFactorForText=function(){if(D.browser.msie||D.browser.mozilla||D.browser.edge){return"57%";}else{return"51%";}};R._innerCircleRequired=function(c){return c.getPercentage()>=100||c.getPercentage()<=0;};R._calculatePathCoordinates=function(c,p,h){var C=[];var f=0;var a=R.FORM_RATIO/2;if(h){f=2*R.PADDING_WIDTH/100*2*Math.PI;}C.push(a+R.RING_CORE_RADIUS*Math.cos(-Math.PI/2.0-f));C.push(a+R.RING_CORE_RADIUS*Math.sin(-Math.PI/2.0-f));C.push(a+R.RING_CORE_RADIUS*Math.cos(-Math.PI/2.0+p/100*2*Math.PI));C.push(a+R.RING_CORE_RADIUS*Math.sin(-Math.PI/2.0+p/100*2*Math.PI));return C;};R._getPercentageForCircleRendering=function(c){var p=c.getPercentage();var f=p;if(p>99-R.PADDING_WIDTH){f=99-R.PADDING_WIDTH;}if(p<1+R.PADDING_WIDTH){f=1+R.PADDING_WIDTH;}return f;};R._getTextColorClass=function(c){switch(c.getValueColor()){case V.Good:return"sapSuiteRMCGoodTextColor";case V.Error:return"sapSuiteRMCErrorTextColor";case V.Critical:return"sapSuiteRMCCriticalTextColor";default:return"sapSuiteRMCNeutralTextColor";}};R._getFullCircleColor=function(c){if(c.getPercentage()>=100){return this._getPathColor(c);}if(c.getPercentage()<=0){return"sapSuiteRMCRemainingCircle";}};R._getPathColor=function(c){var v=c.getValueColor();if(c._isValueColorValid()){switch(v){case V.Good:return"sapSuiteRMCPathGood";case V.Error:return"sapSuiteRMCPathError";case V.Critical:return"sapSuiteRMCPathCritical";default:return"sapSuiteRMCPathNeutral";}}else{return v;}};R._generateTextContent=function(c){if(c.getPercentage()===100){return c._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT",[100]);}if(c.getPercentage()===0){return c._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT",[0]);}if(c.getPercentage()>=100){L.error("Values over 100%("+c.getPercentage()+"%) are not supported");return c._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT",[100]);}if(c.getPercentage()<=0){L.error("Values below 0%("+c.getPercentage()+"%) are not supported");return c._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT",[0]);}return c._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT",[c.getPercentage()]);};M.extendMicroChartRenderer(R);return R;},true);