/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */

// --------------------------------------------------------------------------------
// Utility class used by smart controls for filtering
// --------------------------------------------------------------------------------
sap.ui.define([], function () {
	"use strict";

	/**
	 * Utility class used by smart controls for filtering
	 *
	 * @private
	 */
	return {

		/**
		 * Transforms operation for exclude
		 * @private
		 * @static
		 * @param {string} sOperation the input operation
		 * @returns {string} Transformed operation
		 */
		getTransformedExcludeOperation: function (sOperation) {
			var sTransformedOperation = {
				"EQ": "NE",
				"GE": "LT",
				"LT": "GE",
				"LE": "GT",
				"GT": "LE",
				"BT": "NB",
				"Contains": "NotContains",
				"StartsWith": "NotStartsWith",
				"EndsWith": "NotEndsWith"
			}[sOperation];

			return sTransformedOperation ? sTransformedOperation : sOperation;
		},
		/**
		 * The default sap.m.Input suggestions filtering can not handle description(id).
		 * @private
		 * @static
		 * @returns {function} Filter function for sap.m.Input auto suggestions
		 */
		getSuggestionsFilter: function () {
			return function (sValue, oColumnListItem) {
				var sText,
					i,
					aCells = oColumnListItem.getCells(),
					oDescriptionRegex = new RegExp("\\(" + sValue + ".*?\\)$", "gi");

				for (i = 0; i < aCells.length; i++) {
					if (aCells[i].getText) {
						sText = aCells[i].getText();
						if (sText.toLowerCase().startsWith(sValue.toLowerCase()) || oDescriptionRegex.test(sText)) {
							return true;
						}
					}
				}

				return false;
			};
		}

	};

});
