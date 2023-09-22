/*
* ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define(['./AdaptationController', './FlexUtil', 'sap/ui/fl/apply/api/FlexRuntimeInfoAPI'], function(AdaptationController, FlexUtil, FlexRuntimeInfoAPI) {
	"use strict";
	var oAdaptationController = new AdaptationController();
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
					var oSortPromise, oConditionPromise, aChanges = [];

					//TODO: ORDER OF CHANGES ??? --> Which changes should come first?...
					if (bSortSupported){
						oSortPromise = oAdaptationController.createSortChanges(oState.sort);
					}

					if (bFilterSupported){
						oConditionPromise =	oAdaptationController.createConditionChanges(oState.filter);
					}

					//resolve after all changes have been
					Promise.all([oSortPromise, oConditionPromise]).then(function(aRawChanges){
						aRawChanges.forEach(function(aSpecificChanges){
							if (aSpecificChanges && aSpecificChanges.length > 0){
								aChanges = aChanges.concat(aSpecificChanges);
							}
						});
						resolve(FlexUtil.handleChanges(aChanges));
					});
				}, reject);

			}.bind(this));

		},

		/**
		 * Retrieves the externalized state for a given control instance
		 *
		 * @param {object} oControl The control instance implementing IxState to retrieve the externalized state
		 */
		retrieveExternalState: function(oControl) {

			return new Promise(function(resolve, reject) {

				//needs to be set in order to create and delta the changes as expected
				oAdaptationController.setAdaptationControl(oControl);
				oAdaptationController.setStateRetriever(oControl.getCurrentState);

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

						//currently only filter is supported
						resolve({
							filter: oControl.getCurrentState().filter
						});

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
