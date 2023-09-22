/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define([
		"sap/ui/base/Object",
		"sap/ui/model/Filter",
		"sap/ui/model/ParseException",
		"sap/ui/Device",
		"sap/base/Log",
		"sap/base/util/ObjectPath",
		"./Condition"
	],

	function(
		BaseObject,
		Filter,
		ParseException,
		Device,
		Log,
		ObjectPath,
		Condition
	) {
		"use strict";

		// translation utils
		var oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		sap.ui.getCore().attachLocalizationChanged(function() {
			oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		});

		/**
		 * Creates a <code>sap.ui.mdc.condition.Operator</code> object.
		 * This is used in the FilterField to define what filter operators are supported
		 *
		 * If a function or property is initial, the default implementation is used
		 *
		 * @extends sap.ui.base.Object
		 * @param {object} [oConfiguration] formatting options.
		 * @param {string} [oConfiguration.name] Name of the operator used in the condition
		 * @param {string} [oConfiguration.filterOperator] the operator's default filter operator that is created as defined in sap.ui.model.FilterOperator
		 * @param {string} [oConfiguration.tokenParse] the string representation of the regular expression that is used to parse the operator by a control
		 *                 within the string, placeholder can refer to the translated tokenText can be used. #tokenText# will refer to the
		 *                 given oConfiguration.tokenText property if given.
		 * @param {string} [oConfiguration.tokenFormat] the string representation of the regular expression that is used to parse the operator by a control
		 *                 within the string, placeholder can refer to the translated tokenText can be used. #tokenText# will refer to the
		 *                 given oConfiguration.tokenText property if given.
		 * @param {string[]} [oConfiguration.valueTypes] array of type to be used. The length of the array defines the number of values that
		 *                 need to be entered with the operator.
		 *                 If set to Operator.ValueType.Self the <code>Type</code> of the <code>Field</code> or <code>FilterField</code> using the <code>Operator</code> is used.
		 *                 If set to Operator.ValueType.Static a simple string type is used to display static text.
		 *                 If set to a name of a data type an instance of this data type will be used.
		 *                 If set to an object with the properties <code>name</code>, <code>formatOptions</code> and <code>constraints</code>
		 *                 an instance of the corresponding data type will be used.
		 * @param {string[]} [oConfiguration.paramTypes] array of type parameters. //TODO
		 * @param {string} [oConfiguration.longText] string representation of the operator as a long text.
		 *                If the longText is not given it will be looked up in the resource bundle of the sap.ui.mdc library by the key
		 *                operators.{oConfiguration.name}.longText
		 * @param {string} [oConfiguration.tokenText] string representation of the operator as a short text.
		 *                If the token Text is not given it will be looked up in the resource bundle of the sap.ui.mdc library by the key
		 *                operators.{oConfiguration.name}.tokenText
		 * @param {object} [oConfiguration.displayFormats] pattern how different displayFormats are rendered
		 * @param {function} [oConfiguration.format] function to format condition
		 * @param {function} [oConfiguration.parse] function to parse input into condition
		 * @param {function} [oConfiguration.validate] function to validate condition
		 * @param {function} [oConfiguration.getModelFilter] function create filter for a condition
		 * @param {function} [oConfiguration.isEmpty] function to check if condition is empty
		 * @param {function} [oConfiguration.createControl] function to create a control
		 * @param {function} [oConfiguration.splitText] function to split text // TODO remove
		 * @param {boolean} [oConfiguration.showInSuggest] if not set to false the operator appears in the DefineCondition panel // TODO better API
		 * @param {boolean} [oConfiguration.exclude] if set the operator is handles as exclude filter when creating the filters of all conditions
		 * @constructor
		 * @private
		 * @alias sap.ui.mdc.condition.Operator
		 * @version 1.73.0
		 * @author SAP SE
		 */
		var Operator = BaseObject.extend("sap.ui.mdc.condition.Operator", /** @lends sap.ui.mdc.condition.Operator.prototype */ {
			constructor: function(oConfiguration) {
				BaseObject.apply(this, arguments);

				if (!oConfiguration) {
					throw new Error("Operator configuration missing");
				}
				if (!oConfiguration.name) {
					Log.warning("Operator configuration expects a name property");
				}
				if (!oConfiguration.filterOperator && !oConfiguration.getModelFilter) {
					throw new Error("Operator configuration for " + oConfiguration.name + " needs a default filter operator from sap.ui.model.FilterOperator or the function getModelFilter");
				}

				// map given properties
				// TODO: for compatibility reasons just put to this.name... but is a API getName better at the end?
				this.name = oConfiguration.name;
				this.filterOperator = oConfiguration.filterOperator;
				this.valueTypes = oConfiguration.valueTypes;
				this.paramTypes = oConfiguration.paramTypes;
				this.displayFormats = oConfiguration.displayFormats;

				var sTextKey = "operators." + this.name;
				this.longText = oConfiguration.longText || getText(sTextKey + ".longText") || "";
				this.tokenText = oConfiguration.tokenText || getText(sTextKey + ".tokenText") || "";
				var sTokenText = this.tokenText;
				if (Device.browser.msie) { // IE cannot replace single $, $$ will be replaced to $
					sTokenText = sTokenText.replace(/\$/g, "$$$");
				}

				// create token parsing RegExp
				if (sTokenText) {
					if (oConfiguration.tokenParse) {
						this.tokenParse = oConfiguration.tokenParse.replace(/#tokenText#/g, sTokenText);
						for (var i = 0; i < this.valueTypes.length; i++) {
							var sReplace = this.paramTypes ? this.paramTypes[i] : this.valueTypes[i];
							this.tokenParse = this.tokenParse.replace(new RegExp("\\$" + i, "g"), sReplace);
						}
						this.tokenParseRegExp = new RegExp(this.tokenParse, "i");
					} else {
						this.tokenParseRegExp = new RegExp(this.tokenText, "i"); // operator without value
					}
				}

				// create token formatter
				if (sTokenText) {
					if (oConfiguration.tokenFormat) {
						this.tokenFormat = oConfiguration.tokenFormat.replace(/\#tokenText\#/g, sTokenText);
					} else {
						this.tokenFormat = this.tokenText; // static operator with no value (e.g. "THIS YEAR")
					}
				}

				if (oConfiguration.format) {
					this.format = oConfiguration.format;
				}
				if (oConfiguration.parse) {
					this.parse = oConfiguration.parse;
				}
				if (oConfiguration.validate) {
					this.validate = oConfiguration.validate;
				}
				if (oConfiguration.getModelFilter) {
					this.getModelFilter = oConfiguration.getModelFilter;
				}
				if (oConfiguration.isEmpty) {
					this.isEmpty = oConfiguration.isEmpty;
				}
				if (oConfiguration.createControl) {
					this.createControl = oConfiguration.createControl; // TODO move default implementation from DefineConditionPanel to here
				}
				if (oConfiguration.splitText) {
					this.splitText = oConfiguration.splitText; // TODO as only used by EEQ remove it from general api
				}
				if (oConfiguration.hasOwnProperty("showInSuggest")) {
					this.showInSuggest = oConfiguration.showInSuggest;
				}

				this.exclude = !!oConfiguration.exclude; // to have always a boolean value
			}
		});

		/**
		 * Defines whyt type is used for parse or format the operation
		 *
		 * @enum {string}
		 * @private
		 * @since 1.75
		 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
		 */
		Operator.ValueType = {
				/**
				 * The <code>Type</code> of the <code>Field</code> or <code>FilterField</code> using the <code>Operator</code> is used.
				 *
				 * @public
				 */
				Self: "self",

				/**
				 * A simple string type is used to display static text.
				 *
				 * @public
				 */
				Static: "static"
		};

		function getText(sKey, sType) {

			var key = sKey + (sType ? "." + sType : ""),
				sText;

			if (oMessageBundle.hasText(key)) {
				sText = oMessageBundle.getText(key);
			} else
			if (sType) {
				sText = oMessageBundle.getText(sKey);
			} else {
				sText = key;
			}
			return sText;

		}

		/**
		 * gets text for a operator name
		 *
		 * @param {string} sKey text key
		 * @param {string} sType name of type
		 * @return {string} text
		 *
		 * @public
		 */
		Operator.prototype.getTypeText = function(sKey, sType) { // for DefineConditionPanel Select items

			return getText(sKey, sType);

		};

		/**
		 * creates filter object for a condition
		 *
		 * @param {object} oCondition Condition
		 * @param {string} sFieldPath path of filter
 		 * @param {sap.ui.model.Type} oType data type of the used filter field
		 * @return {sap.ui.model.Filter} filter object
		 *
		 * @public
		 */
		Operator.prototype.getModelFilter = function(oCondition, sFieldPath, oType) {

			var vValue = oCondition.values[0];
			var oFilter;
			var oFilterUnit;
			var aFieldPaths = sFieldPath.split(",");
			// TODO: CompositeType (Unit/Currency) -> also filter for unit
			if (Array.isArray(vValue) && aFieldPaths.length > 1) {
				vValue = vValue[0];
				sFieldPath = aFieldPaths[0];
				oFilterUnit = new Filter({path: aFieldPaths[1], operator: "EQ", value1: oCondition.values[0][1]});
			}
			if (oFilterUnit && vValue === undefined) {
				// filter only for unit
				oFilter = oFilterUnit;
				oFilterUnit = undefined;
			} else if (this.valueTypes.length == 1) {
				oFilter = new Filter({ path: sFieldPath, operator: this.filterOperator, value1: vValue });
			} else {
				var vValue2 = oCondition.values[1];
				if (Array.isArray(vValue2) && aFieldPaths.length > 1) {
					vValue2 = vValue2[0];
					// use same unit as for value1
				}
				oFilter = new Filter({ path: sFieldPath, operator: this.filterOperator, value1: vValue, value2: vValue2 });
			}

			if (oFilterUnit) {
				oFilter = new Filter({ filters: [oFilter, oFilterUnit], and: true });
			}

			// add filter for in-parameters
			if (oCondition.inParameters) {
				var aFilters = [oFilter];
				for ( var sInPath in oCondition.inParameters) {
					aFilters.push(new Filter({path: sInPath, operator: "EQ", value1: oCondition.inParameters[sInPath]}));
				}
				oFilter = new Filter({ filters: aFilters, and: true });
			}

			return oFilter;

		};

		/**
		 * checks if a condition is empty
		 *
		 * @param {object} oCondition Condition
		 * @param {sap.ui.model.Type} oType data type
		 * @return {boolean} true if empty
		 *
		 * @public
		 */
		Operator.prototype.isEmpty = function(oCondition, oType) {

			var isEmpty = false;

			if (oCondition) {
				for (var i = 0; i < this.valueTypes.length; i++) {
					if (this.valueTypes[i] !== Operator.ValueType.Static) {
						var vValue = oCondition.values[i];
						if (vValue === null || vValue === undefined || vValue === "") { // empty has to use the oType information
							isEmpty = true;
							break;
						}
					}
				}
			}

			return isEmpty;

		};

		/**
		 * formats a condition
		 *
		 * @param {any[]} aValues values
		 * @param {object} oCondition Condition
		 * @param {sap.ui.model.Type} oType data type
		 * @param {string} sDisplay display mode
		 * @return {string} formatted text
		 *
		 * @public
		 */
		Operator.prototype.format = function(aValues, oCondition, oType, sDisplay) { // TODO: Condition not needed

			var sTokenText = this.tokenFormat;
			var iCount = this.valueTypes.length;
			for (var i = 0; i < iCount; i++) {
				if (this.valueTypes[i] !== Operator.ValueType.Static) {
					var v = aValues[i] !== undefined && aValues[i] !== null ? aValues[i] : "";
					if (this.valueTypes[i] !== Operator.ValueType.Self) {
						oType = this._createLocalType(this.valueTypes[i]);
					}
					var sReplace = oType ? oType.formatValue(v, "string") : v;
					sTokenText = sTokenText.replace(new RegExp("\\$" + i, "g"), sReplace);
				}
			}
			return sTokenText;

		};

		/**
		 * parses a text
		 *
		 * @param {string} sText text
		 * @param {sap.ui.model.Type} oType data type
		 * @return {any[]} array of values
		 *
		 * @public
		 */
		Operator.prototype.parse = function(sText, oType) {

			var aMatch = sText.match(this.tokenParseRegExp);
			var aResult; // might remain undefined - if no match
			if (aMatch) {
				aResult = [];
				for (var i = 0; i < this.valueTypes.length; i++) {
					if ([Operator.ValueType.Self, Operator.ValueType.Static].indexOf(this.valueTypes[i]) === -1) {
						oType = this._createLocalType(this.valueTypes[i]);
					}
					try {
						var sValue = aMatch[i + 1];
						var vValue = this._parseValue(sValue, oType);
						if (this.valueTypes[i] !== Operator.ValueType.Static) {
							aResult.push(vValue);
						}
					} catch (err) {
						// Error
						Log.warning(err.message);
						throw err;
					}
				}
			}

			return aResult; // currently returns empty array for operators without values, undefined for no match

		};

		/**
		 * parses a text using the type
		 *
		 * @param {string} sValue text
		 * @param {sap.ui.model.Type} oType data type
		 * @return {string} single value
		 *
		 * @protected
		 */
		Operator.prototype._parseValue = function(sValue, oType) { // needed in EEQ operator to be accessed from outside

			if (sValue === undefined) {
				return sValue; // as some types running in errors with undefined and in this case there is nothing to parse
			}

			var aCurrentValue;
			if (oType instanceof sap.ui.model.CompositeType && oType._aCurrentValue && oType.getParseWithValues()) {
				aCurrentValue = oType._aCurrentValue;
			}

			var vValue = oType ? oType.parseValue(sValue, "string", aCurrentValue) : sValue;

			if (aCurrentValue && Array.isArray(vValue)) {
				// in case the user only entered a part of the CompositeType, we add the missing parts from aCurrentValue
				// but add only the parts that have entries in array after parsing ( not set one-time parts)
				for (var j = 0; j < vValue.length; j++) {
					if (vValue[j] === undefined) {
						vValue[j] = aCurrentValue[j];
					}
				}
			}

			return vValue;

		};

		/**
		 * validates a value
		 *
		 * @param {any} aValues values
		 * @param {sap.ui.model.Type} oType data type
		 *
		 * @public
		 */
		Operator.prototype.validate = function(aValues, oType) {

			var iCount = this.valueTypes.length;
			for (var i = 0; i < iCount; i++) {
				var vValue = aValues[i] !== undefined && aValues[i] !== null ? aValues[i] : "";
				if (this.valueTypes[i] && this.valueTypes[i] !== Operator.ValueType.Static) { // do not validate Description in EEQ case
					if ([Operator.ValueType.Self, Operator.ValueType.Static].indexOf(this.valueTypes[i]) === -1) {
						oType = this._createLocalType(this.valueTypes[i]);
					}
					if (oType) {
						oType.validateValue(vValue);
					}
				}
			}

		};

		// Local type is needed eg. for "next x days" operator.
		// Function also called in DefineConditionPanel
		Operator.prototype._createLocalType = function(vType) {

			if (!this._oType) {
				var sType;
				var oFormatOptions;
				var oConstraints;

				if (typeof vType === "string") {
					sType = vType;
				} else if (vType && typeof vType === "object") {
					sType = vType.name;
					oFormatOptions = vType.formatOptions;
					oConstraints = vType.constraints;
				}

				sap.ui.requireSync(sType.replace(/\./g, "/"));
				var oTypeClass = ObjectPath.get(sType || "");
				this._oType = new oTypeClass(oFormatOptions, oConstraints);
			}
			return this._oType;

		};

		/**
		 * tests if a text fits to the operator
		 *
		 * @param {string} sText text
		 * @return {boolean} true valid
		 *
		 * @public
		 */
		Operator.prototype.test = function(sText) {

			return this.tokenParseRegExp.test(sText);

		};

		/**
		 * created a Condition for a given text
		 *
		 * @param {string} sText text
		 * @param {sap.ui.model.Type} oType data type
		 * @param {string} sDisplayFormat display format
		 * @return {object} condition
		 *
		 * @public
		 */
		Operator.prototype.getCondition = function(sText, oType, sDisplayFormat) {

			if (this.test(sText)) {
				var aValues = this.parse(sText, oType, sDisplayFormat);
				if (aValues.length == this.valueTypes.length || this.valueTypes[0] === Operator.ValueType.Static) {
					return Condition.createCondition( this.name, aValues );
				} else {
					throw new ParseException("Parsed value don't meet operator");
				}
			}
			return null;

		};

		/**
		 * Checks if an <code>Operator</code> contains only one value or not.
		 *
		 * For example, an equal Operator has only one value, a between operator two.
		 *
		 * @returns {object} True if only one value is used.
		 * @since 1.75.0
		 * @public
		 * @restricted sap.ui.mdc.field.FieldBase
		 */
		Operator.prototype.isSingleValue = function() {

			if (this.valueTypes.length > 1 && this.valueTypes[1]) {
				// second value is defined. (If only description it doesn't matter.)
				return false;
			}

			return true;

		};

		return Operator;

});
