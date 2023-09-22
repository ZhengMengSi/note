/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.AnnotationPositionType.
sap.ui.define([], function() {
	"use strict";

	/**
	 * Sets the postion type for annotation text.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.AnnotationPositionType
	 * @public
	 */
	var AnnotationPositionType = {
		/**
		 * Annotation is positioned relative to its node refeence if it has one, otherwise it is fixed
		 * @public
		 */
		Relative: "Relative",
		/**
		 * Annotation is positioned at a fixed location on the screen
		 * @public
		 */
		Fixed: "Fixed"
	};

	return AnnotationPositionType;

}, /* bExport= */ true);
