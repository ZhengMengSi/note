/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to execute model specific logic in FieldBase
// ---------------------------------------------------------------------------------------

sap.ui.define([
	'sap/ui/mdc/util/BaseType'
], function(
	BaseType
) {
	"use strict";
	/**
	 * Delegate class for <code>sap.ui.mdc.base.FieldBase</code>.<br>
	 * <b>Note:</b> The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.72.0
	 * @alias sap.ui.mdc.field.FieldBaseDelegate
	 */
	var FieldBaseDelegate = {

			/**
			 * Maps the Edm type names to real type names
			 *
			 * If a real type has already been defined, this type is returned.
			 *
			 * @param {object} oPayload Payload for delegate
			 * @param {string} sType Given EDM type
			 * @returns {string} Data type name
			 */
			getDataTypeClass: function(oPayload, sType) {

				// only not V4 specific types
				var mEdmTypes = {
						"Edm.Boolean": "sap.ui.model.odata.type.Boolean",
						"Edm.Byte": "sap.ui.model.odata.type.Byte",
						"Edm.DateTime": "sap.ui.model.odata.type.DateTime", // only for V2  constraints: {displayFormat: 'Date' }
						"Edm.DateTimeOffset": "sap.ui.model.odata.type.DateTimeOffset", //constraints: { V4: true, precision: n }
						"Edm.Decimal": "sap.ui.model.odata.type.Decimal", //constraints: { precision, scale, minimum, maximum, minimumExclusive, maximumExclusive}
						"Edm.Double": "sap.ui.model.odata.type.Double",
						"Edm.Float": "sap.ui.model.odata.type.Single",
						"Edm.Guid": "sap.ui.model.odata.type.Guid",
						"Edm.Int16": "sap.ui.model.odata.type.Int16",
						"Edm.Int32": "sap.ui.model.odata.type.Int32",
						"Edm.Int64": "sap.ui.model.odata.type.Int64",
						//Edm.Raw not supported
						"Edm.SByte": "sap.ui.model.odata.type.SByte",
						"Edm.Single": "sap.ui.model.odata.type.Single",
						"Edm.String": "sap.ui.model.odata.type.String", //constraints: {maxLength, isDigitSequence}
						"Edm.Time": "sap.ui.model.odata.type.Time" // only V2
				};

				if (mEdmTypes[sType]) {
					sType = mEdmTypes[sType];
				} else if (sType && sType.startsWith("Edm.")) {
					// unknown Edm type -> throw error to not continue with strange data
					throw new Error("Invalid data type " + sType);
				}

				return sType;

			},

			/**
			 * To know what control is rendered the <code>Field</code> or </code>FilterField</code>
			 * needs to know if the type represents a date, a number or something else in a normalized way.
			 *
			 * As default <code>string</code> is returned.
			 *
			 * @param {object} oPayload Payload for delegate
			 * @param {string} sType Given type
			 * @param {object} oFormatOptions Used <code>FormatOptions</code>
			 * @param {object} oConstraints Used <code>Constraints</code>
			 * @returns {sap.ui.mdc.condition.BaseType} output <code>Date</code>, <code>DateTime</code> or <code>Time</code>...
			 */
			getBaseType: function(oPayload, sType, oFormatOptions, oConstraints) {

				switch (sType) {
				case "sap.ui.model.type.Date":
					return BaseType.Date;

				case "sap.ui.model.odata.type.DateTime":
					if (oConstraints && (oConstraints.displayFormat === "Date" || oConstraints.isDateOnly)) {
						return BaseType.Date;
					} else {
						return BaseType.DateTime;
					}
					break;

				case "sap.ui.model.type.DateTime":
				case "sap.ui.model.odata.type.DateTimeOffset":
					return BaseType.DateTime;

				case "sap.ui.model.type.Time":
				case "sap.ui.model.odata.type.Time":
					return BaseType.Time;

				case "sap.ui.model.type.Boolean":
				case "sap.ui.model.odata.type.Boolean":
				case "sap.ui.mdc.base.type.Boolean":
					return BaseType.Boolean;

				case "sap.ui.model.type.Unit":
				case "sap.ui.model.type.Currency":
					if (!oFormatOptions || !oFormatOptions.hasOwnProperty("showMeasure") || oFormatOptions.showMeasure) {
						return BaseType.Unit;
					} else {
						return BaseType.Numeric;
					}
					break;

				case "sap.ui.model.type.Integer":
				case "sap.ui.model.type.Float":
				case "sap.ui.model.odata.type.Byte":
				case "sap.ui.model.odata.type.SByte":
				case "sap.ui.model.odata.type.Decimal":
				case "sap.ui.model.odata.type.Int16":
				case "sap.ui.model.odata.type.Int32":
				case "sap.ui.model.odata.type.Int64":
				case "sap.ui.model.odata.type.Single":
				case "sap.ui.model.odata.type.Double":
					return BaseType.Numeric;

				default:
					return BaseType.String;

				}

			},

			/**
			 * If the <code>Field</code> control is used, the used data type might come from the binding.
			 * In V4-unit or currency case it might need to be formatted once.
			 * To initialize the internal type later on, the currencies must be returned.
			 *
			 * @param {object} oPayload Payload for delegate
			 * @param {sap.ui.model.SimpleType} oType Type from binding
			 * @param {any} vValue Given value
			 * @returns {object} Information needed to initialize internal type (needs to set bTypeInitialized to true if initialized)
			 */
			initializeTypeFromBinding: function(oPayload, oType, vValue) {

				return {};

			},

			/**
			 * This function initializes the unit type.
			 * If the <code>Field</code> control is used, the used data type might come from the binding.
			 * If the type is a V4 unit or currency, it might need to be formatted once.
			 *
			 * @param {object} oPayload Payload for delegate
			 * @param {sap.ui.model.SimpleType} oType Type from binding
			 * @param {object} oTypeInitialization Information needed to initialize internal type
			 */
			initializeInternalUnitType: function(oPayload, oType, oTypeInitialization) {

			}

	};
	return FieldBaseDelegate;
});
