/*
* ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define(['./FlexUtil', 'sap/ui/fl/apply/api/FlexRuntimeInfoAPI', 'sap/base/Log'], function(FlexUtil, FlexRuntimeInfoAPI, Log) {
	"use strict";

	var StateUtil = {
		/**
		*	Creates and applies the necessary changes for a given control and state
		*
		* @param {object} oControl the control which will be used to create and apply changes on
		* @param {object} oState the state in which the control should be represented
		* oSate = {
		* 		filter: {
		* 			name: "A",
		* 			operaor: "EQ",
		* 			value: "[1]"
		* 		},
		* 		sort: [
		* 			{
		* 				name: {descending: true}
		* 			}
		* 		]
		*
		* }
		*/
		applyExternalState: function(oControl, oState){
			return new Promise(function(resolve, reject) {

				var bValidInterface = this.checkXStateInterface(oControl);

				if (!bValidInterface) {
					reject("The control needs to implement IxState");
				}

				StateUtil.retrieveExternalState(oControl).then(function(oCurrentState){
					//in case the app DOES want to support this, he could simply add sth. like the key to the state object with value null, but needs to be reconsidered
					var bSortSupported = oCurrentState.hasOwnProperty("sort");
					var bFilterSupported = oCurrentState.hasOwnProperty("filter");
					var aChanges = [];

					//TODO: ORDER OF CHANGES ??? --> Which changes should come first?...
					if (bSortSupported){
						aChanges = aChanges.concat(this.createSortChanges(oControl, oState.sort, oCurrentState.sort));
					}

					if (bFilterSupported){
						aChanges = aChanges.concat(this.createConditionChanges(oControl, oState.filter, oCurrentState.filter));
					}

					resolve(FlexUtil.handleChanges(aChanges));
				}.bind(this), reject);

			}.bind(this));

		},

		/**
		* Creates delta based sort changes
		*
		* @private
		*/
		createSortChanges: function(oControl, aNewSorters, aPreviousSorters){
			var fnSymbol = function(o){
				return o.name + o.descending;
			};
			var aSortChanges = FlexUtil.getArrayDeltaChanges(aPreviousSorters, aNewSorters, fnSymbol, oControl, "removeSort", "addSort", "moveSort");
			return aSortChanges;
		},

		/**
		* Creates delta based condition changes
		*
		* @private
		*/
		createConditionChanges: function(oControl, mNewConditionState, mPreviousConditionState) {
			var aConditionChanges = [];
			for (var sFieldPath in mNewConditionState) {
				var oProperty = oControl.hasProperty(sFieldPath);
				if (!oProperty) {
					Log.warning("property '" + sFieldPath + "' not supported");
					continue;
				}
				aConditionChanges = aConditionChanges.concat(FlexUtil.getConditionDeltaChanges(sFieldPath, mNewConditionState[sFieldPath], mPreviousConditionState[sFieldPath], oControl));
			}
			return aConditionChanges;
		},

		/**
		 * Retrieves the externalized state for a given control instance
		 *
		 * @param {object} oControl The control instance implementing IxState to retrieve the externalized state
		 */
		retrieveExternalState: function(oControl) {

			return new Promise(function(resolve, reject) {

				var bValidInterface = this.checkXStateInterface(oControl);

				if (!bValidInterface){
					reject("The control needs to implement then interface IxState.");
				}

				//ensure the propertyinfo is available
				oControl.waitForInitialization().then(function() {

					//ensure that all changes have been applied
					FlexRuntimeInfoAPI.waitForChanges({
						element: oControl
					}).then(function() {

						resolve(oControl.getCurrentState());

					});

				});

			}.bind(this));
		},

		/**
		* Checks if a control is fulfilling the requirements to use <code>StateUtil</code>
		*
		* @param {object} oControl The control instance to be checked for corrext IxState implementation
		* @private
		*/
		checkXStateInterface: function(oControl) {

			//check if a control instance is available
			if (!oControl) {
				return false;
			}

			//check if flex is enabled
			if (!FlexRuntimeInfoAPI.isFlexSupported({element: oControl})) {
				return false;
			}

			//check for IxState 'waitForInitialization'
			if (!oControl.isA("sap.ui.mdc.IxState")) {
				return false;
			}

			return true;
		}

	};

	return StateUtil;
});
