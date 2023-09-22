/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var A={};A.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUiVizKitAnnotation"+c.getStyle());r.writeClasses();r.write(">");for(var i=0;i<5;i++){r.write("<div");r.addClass("sapUiVizKitAnnotationElement"+i);r.writeClasses();r.write(">");r.write("</div>");}r.write("</div>");};return A;},true);
