/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define([
		'sap/ui/mdc/condition/Operator',
		'sap/ui/model/Filter',
		'sap/ui/model/odata/type/Date',
		'sap/ui/model/odata/type/DateTime',
		'sap/ui/mdc/util/DateUtil',
		'sap/base/Log'
	],

	function(
		Operator,
		Filter,
		DateType,
		DateTimeType,
		DateUtil,
		Log
	) {
		"use strict";

		/**
		 * Creates a <code>sap.ui.mdc.condition.RangeOperator</code> object.
		 * This is used in the FilterField to define what filter operators are supported
		 *
		 * If a function or property is initial, the default implementation is used
		 *
		 * @extends sap.ui.mdc.condition.Operator
		 * @param {object} [oConfiguration]
		 * @param {string} [oConfiguration.name] Name of the operator used in the condition
		 * @param {string} [oConfiguration.filterOperator] should not be set
		 * @param {string} [oConfiguration.tokenParse]
		 * @param {string} [oConfiguration.tokenFormat]
		 * @param {string} [oConfiguration.additionalInfo] additionalInfo text for the operator. Will be shown in the operator suggest as second column. If not used (undefined) the Include or Exclude information of the operator is used.
		 * @param {function} [oConfiguration.calcRange] function to calculate the date range of the operation. the function returns an array of UniversalDates.
		 * @param {function} [oConfiguration.formatRange] function to format the date range.
		 * @constructor
		 * @private
		 * @alias sap.ui.mdc.condition.Operator
		 * @version 1.74.0
		 * @author SAP SE
		 */
		var RangeOperator = Operator.extend("sap.ui.mdc.condition.RangeOperator", /** @lends sap.ui.mdc.condition.RangeOperator.prototype */ {
			constructor: function(oConfiguration) {
				oConfiguration.filterOperator = "RANGE"; // No default operator for the filter exist
				oConfiguration.tokenParse = oConfiguration.tokenParse || "^#tokenText#$";
				oConfiguration.tokenFormat = oConfiguration.tokenFormat || "#tokenText#";

				Operator.apply(this, arguments);

				if (oConfiguration.additionalInfo !== undefined) {
					this.additionalInfo = oConfiguration.additionalInfo;
				}

				if (oConfiguration.calcRange) {
					this.calcRange = oConfiguration.calcRange;
				}

				if (oConfiguration.formatRange) {
					this.formatRange = oConfiguration.formatRange;
				} else if (this.calcRange) {
					this.formatRange = function(aRange, oDataType) {
						return oDataType.formatValue(aRange[0], "string") + " - " + oDataType.formatValue(aRange[1], "string");
					};
				}

				//TODO type instance should be fetched from the FilterField instance.
				this._oDateType = new DateType();
			}
		});

		RangeOperator.prototype.getModelFilter = function(oCondition, sFieldPath, oType) {
			var aRange = this._getRange(oCondition.values[0], oType || this._oDateType);
			return new Filter({ path: sFieldPath, operator: "BT", value1: aRange[0], value2: aRange[1] });
		};

		RangeOperator.prototype._getRange = function(iDuration, oDateType) {
			var aRange = this.calcRange(iDuration);

			for (var i = 0; i < 2; i++) {
				//the calcRange result must be converted from local time to UTC and into the correct type format.
				aRange[i].oDate = DateUtil.localToUtc(aRange[i].oDate);
				aRange[i] = DateUtil.universalDateToType(aRange[i], oDateType || this._oDateType);
			}

			return aRange;
		};

		/**
		 * Creates the static text of the operator
		 *
 		 * @param {sap.ui.model.Type} oDateType data type of the used filterfield
		 * @return {string} static text
		 *
		 * @public
		 * @restricted sap.ui.mdc.field.DefineConditionPanel
		 */
		RangeOperator.prototype.getStaticText = function(oDataType) {
			var aRange = this._getRange(null, oDataType);
			return this.formatRange(aRange, oDataType);
		};

		return RangeOperator;

}, /* bExport= */ true);
