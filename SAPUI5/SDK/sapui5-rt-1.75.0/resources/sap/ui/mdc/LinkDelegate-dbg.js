/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([], function() {
	"use strict";
	/**
	   * Base Delegate for {@link sap.ui.mdc.Link}. Extend this object in your project to use all functionalites of the {@link sap.ui.mdc.Link}.
	   * <b>Note:</b>
	   * The class is experimental and the API/behaviour is not finalized and hence this should not be used for productive usage.
	   * @author SAP SE
	   * @private
	   * @experimental
	   * @since 1.74
	   * @alias sap.ui.mdc.LinkDelegate
	   */
	var LinkDelegate = {
		/**
		 * Fetches the relevant {@link sap.ui.mdc.link.LinkItem} for the Link and returns them.
		 * @public
		 * @param {Object} oPayload - The Payload of the Link given by the application
		 * @param {Object} oBindingContext - The binding context of the Link
		 * @param {Object} oInfoLog - The InfoLog of the Link
		 * @returns {Promise} once resolved an array of {@link sap.ui.mdc.link.LinkItem} is returned
		 */
		fetchLinkItems: function(oPayload, oBindingContext, oInfoLog) {
			return Promise.resolve([]);
		},
		/**
		 * Fetches the relevant additionalContent for the Link and retuns it as an array.
		 * @public
		 * @param {Object} oPayload - The Payload of the Link given by the application
		 * @param {Object} oBindingContext - The binding context of the Link
		 * @returns {Promise} once resolved an array of {@link sap.ui.core.Control} is returned
		 */
		fetchAdditionalContent: function(oPayload, oBindingContext) {
			return Promise.resolve([]);
		},
		/**
		 * Checks if the Link is triggerable - has content / links to open a popover.
		 * If <code>false</code> is resolved the Link will calculate it based on the LinkItems + AdditionalContent
		 * If <code>true</code> is resolved the Link will always be diplayed as a Link and won't do the calculation
		 * @private
		 * @param {Object} oPayload - The Payload of the Link given by the application
		 * @returns {Promise} once resolved a boolean is returned.
		 */
		_isTriggerable: function(oPayload) {
			return Promise.resolve(false);
		}
	};
	return LinkDelegate;
}, /* bExport= */ true);
