/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
		'sap/base/Log'
	],
	function(
		Log
	) {
		"use strict";

		/**
		 *
		 * @class Utilities to handle operators of conditions
		 *
		 * @author SAP SE
		 * @version 1.77.2
		 * @alias sap.ui.mdc.condition.Condition
		 *
		 * @private
		 * @experimental
		 * @sap-restricted
		 */
		var Condition = function() {};

		/**
		 * Creates a condition instance for a strict equal condition.
		 *
		 * This is a "strict equal" condition with key and description. It is used for entries selected in the value help
		 * and for everything entered in the <code>Field</code> control.
		 *
		 * @param {string} sKey Operator for the condition
		 * @param {string} sDescription Description of the operator
		 * @param {object} oInParameters In parameters of the condition
		 * @param {object} oOutParameters Out parameters of the condition
		 * @returns {object} The new condition object with the given operator EEQ along with sKey and sDescription as aValues
		 * @public
		 */
		Condition.createItemCondition = function(sKey, sDescription, oInParameters, oOutParameters) {
			var aValues = [sKey, sDescription];
			if (sDescription === null || sDescription === undefined) {
				aValues.pop();
			}
			return this.createCondition("EEQ", aValues, oInParameters, oOutParameters);
		};

		/**
		 * Creates a condition instance for the <code>ConditionModel</code>.
		 *
		 * @param {string} sOperator Operator for the condition
		 * @param {any[]} aValues Array of values for the condition
		 * @param {object} oInParameters In parameters of the condition
		 * @param {object} oOutParameters Out parameters of the condition
		 * @returns {object} The new condition object with the given operator and values
		 * @public
		 */
		Condition.createCondition = function(sOperator, aValues, oInParameters, oOutParameters) {
			var oCondition = { operator: sOperator, values: aValues, isEmpty: null }; // use null as undefined is not recognized by filter
			if (oInParameters) {
				oCondition.inParameters = oInParameters;
			}
			if (oOutParameters) {
				oCondition.outParameters = oOutParameters;
			}
			return oCondition;
		};

		Condition._removeEmptyConditions = function(aConditions) {
			for (var i = aConditions.length - 1; i > -1; i--) {
				if (aConditions[i].isEmpty) {
					aConditions.splice(parseInt(i), 1);
				}
			}
			return aConditions;
		};

		return Condition;
	}, /* bExport= */ true);
