/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * Annotation renderer.
	 * @namespace
	 */
	var AnnotationRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *            the control to be rendered
	 */
	AnnotationRenderer.render = function(oRm, oControl) {

		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapUiVizKitAnnotation" + oControl.getStyle());
		oRm.writeClasses();
		oRm.write(">");

		for (var i = 0; i < 5; i++) {
			oRm.write("<div");
			oRm.addClass("sapUiVizKitAnnotationElement" + i);
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
		}

		oRm.write("</div>");
	};

	return AnnotationRenderer;

}, /* bExport= */ true);
