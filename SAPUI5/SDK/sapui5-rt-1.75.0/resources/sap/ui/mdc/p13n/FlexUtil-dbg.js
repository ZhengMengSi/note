/*
* ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define([
	'sap/ui/model/json/JSONModel', 'sap/base/util/array/diff', 'sap/m/Button', 'sap/base/util/merge', 'sap/base/util/deepEqual'
], function (JSONModel, diff, Button, merge, deepEqual) {
	"use strict";
	// Check if we are in a modal scenario, maybe also think about putting this in a property
	var bIsModal = false;// jQuery.sap.getUriParameters().get("P13nModal") === "true";
	var FlexUtil = {

		/**
		* Generates a personalization dialog based on the provided settings
		*
		* @public
		* @param {map} mSettings settings for the personalization dialog visualization + flex handling
		* @param {object} mSettings.control reference of the control which should be personalized
		* @param {object} mSettings.source reference of the control which will be used to locate the popover
		* @param {object} mSettings.p13nData the data which contains the necessary information to display the dialog
		* @param {string} mSettings.p13nType can be used to use a predefined set of personalization (currently available options are: Chart, Columns, Sort and AdaptFitlers)
		* In case this pararmeter is not being used, the method requires the following additional properties in mSettings: title, panelPath, changeOperations and fnSymbol
		* @returns {Promise<object>} Resolves with the corresponding panel created through the mSettings parameter
		*/
		showP13nPanel: function (mSettings) {
			return new Promise(function (resolve, reject) {

				this.mSettings = mSettings;

				//enhance mSettings with control specific information
				if (mSettings.p13nType){
					mSettings = merge(mSettings, this._getAdditionalControlInfo(mSettings.p13nType));
				}

				// Load either sap.m.Dialog or sap.m.ResponsivePopover, depending on the setting
				sap.ui.require(bIsModal ? [
					'sap/m/Dialog', mSettings.panelPath
				] : [
						'sap/m/ResponsivePopover', mSettings.panelPath
					],function (Container, Panel) {

					this.sortP13nData(mSettings.p13nData);

					// set the model for runtime and save the initial state for the later diff (sap.base.util.merge creates a deep copy)
					this.oJSONModel = new JSONModel(mSettings.p13nData);
					this.oJSONModel.setSizeLimit(10000);
					this.oState = merge({}, mSettings.p13nData);

					this.fnHandleChange = function (aChanges) {
						FlexUtil.handleChanges(aChanges).then(function () {
							if (mSettings.fnAfterCreateChanges) {
								mSettings.fnAfterCreateChanges();
							}
							if (this.oJSONModel) {
								// overwrite the initial state with the current model to ensure the correct diff
								this.oState = merge({}, this.oJSONModel.getData());
							}
						}.bind(this));
					}.bind(this);

					var oPanel = new Panel({
						change: bIsModal ? function () {
						} : [this._registerChangeEvent, this]
					});
					oPanel.setP13nModel(this.oJSONModel);

					// Build the dialog
					var oDialog = this._createP13nContainer(Container, oPanel, bIsModal, this.oJSONModel, mSettings.control, mSettings.title, this.fnHandleChange);
					mSettings.control.addDependent(oDialog);
					if (bIsModal) {
						oDialog.open();
					} else {
						oDialog.openBy(mSettings.source);
					}
					resolve(oPanel);
				}.bind(this));
			}.bind(this));
		},

		_registerChangeEvent: function () {
			var aChanges = [], aInitialState = [], aCurrentState = [];

			var fFilter = function (oItem) {
				return oItem.selected;
			};

			aInitialState = this.oState.items.filter(fFilter);
			aCurrentState = this.oJSONModel.getData().items.filter(fFilter);

			aChanges = this.getArrayDeltaChanges(aInitialState, aCurrentState, this.mSettings.fnSymbol, this.mSettings.control, this.mSettings.changeOperations[0], this.mSettings.changeOperations[1], this.mSettings.changeOperations[2]);

			this.oState = merge({}, this.oJSONModel.getData());

			this.fnHandleChange(aChanges);
		},

		_getAdditionalControlInfo: function(sPanelType) {

			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			var aChangeOperations = [], fnSymbol, sTitle, sPanelPath;

			switch (sPanelType) {

				case "Sort":

					fnSymbol = function (o) {return o.name + o.descending;};
					aChangeOperations = ["removeSort", "addSort", "moveSort"];
					sTitle = oResourceBundle.getText("sort.PERSONALIZATION_DIALOG_TITLE");
					sPanelPath = "sap/ui/mdc/p13n/SortPanel";
					break;

				case "Columns":

					fnSymbol = function (o) {return o.name;	};
					aChangeOperations = ["removeColumn", "addColumn", "moveColumn"];
					sTitle = oResourceBundle.getText("table.SETTINGS_COLUMN");
					sPanelPath = "sap/ui/mdc/p13n/SelectionPanel";
					break;

				case "Chart":

					fnSymbol = function (o) {return o.name + o.role;};
					aChangeOperations = ["removeItem", "addItem", "moveItem"];
					sTitle = oResourceBundle.getText("chart.PERSONALIZATION_DIALOG_TITLE");
					sPanelPath = "sap/ui/mdc/p13n/ChartItemPanel";
					break;

				case "AdaptFilters":

					fnSymbol = function (o) { return o.name; };
					aChangeOperations = ["removeFilter", "addFilter", "moveFilter"];
					sTitle = oResourceBundle.getText("filterbar.ADAPT_TITLE");
					sPanelPath = "sap/ui/mdc/p13n/AdaptFiltersPanel";
					break;

			}

			var mAdditionalSettings = {
				changeOperations: aChangeOperations,
				symbol: fnSymbol,
				title: sTitle,
				panelPath: sPanelPath
			};

			return mAdditionalSettings;
		},

		_createPopover: function(Container, oPanel, sTitle, fnCreateChanges){
			var oContainer = new Container({
				title: sTitle,
				horizontalScrolling: false,
				verticalScrolling: true,
				contentWidth: "26rem",
				resizable: true,
				contentHeight: "40rem",
				placement: "HorizontalPreferredRight",
				content: oPanel,
				afterClose: function () {
					// resolve the Promise with an empty array, to be able to reload the settings
					oContainer.destroy();
					fnCreateChanges([]);
				}
			});
			return oContainer;
		},

		_createModalDialog: function(Container, oPanel, sTitle, fnCreateChanges, oJSONModel){
			var oDataBeforeOpen = merge({}, oJSONModel.getProperty("/"));
			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			var oContainer = new Container({
				title: sTitle,
				horizontalScrolling: false,
				verticalScrolling: true,
				contentWidth: "40rem",
				contentHeight: "55rem",
				draggable: true,
				resizable: true,
				stretch: "{device>/system/phone}",
				content: oPanel,
				buttons: [
					new Button({
						text: oResourceBundle.getText("p13nDialog.OK"),
						type: "Emphasized",
						press: function () {
							// Apply a diff to create changes for flex
							this._registerChangeEvent();
							oContainer.close();
							oContainer.destroy();
						}.bind(this)
					}), new Button({
						text: oResourceBundle.getText("p13nDialog.CANCEL"),
						press: function () {
							// Discard the collected changes
							oContainer.close();
							oContainer.destroy();
							oJSONModel.setProperty("/", merge({}, oDataBeforeOpen));
							// resolve the Promise with an empty array, to be able to reload the settings
							fnCreateChanges([]);
						}
					})
				]
			});
			return oContainer;
		},

		_createP13nContainer: function (Container, oPanel, bIsModal, oJSONModel, oControl, sTitle, fnCreateChanges) {

			var oContainer;

			if (bIsModal) {
				oContainer = this._createModalDialog(Container, oPanel, sTitle, fnCreateChanges, oJSONModel);
			} else {
				oContainer = this._createPopover(Container, oPanel, sTitle, fnCreateChanges);
			}

			// Add custom style class in order to display marked items accordingly
			oContainer.addStyleClass("sapUiMdcPersonalizationDialog");
			// Set compact style class if the table is compact too
			oContainer.toggleStyleClass("sapUiSizeCompact", !!jQuery(oControl.getDomRef()).closest(".sapUiSizeCompact").length);
			return oContainer;
		},

		/**
		* Generated a set of changes based on the given arrays for a specified control
		*
		* @public
		* @param {array} aExistingArray The array before changes have been done
		* @param {array} aExistingArray The array after changes have been done
		* @param {function} fnSymBol A function which is being used to distinct which attributes within the object are relevant to diff
		* @param {object} oControl Control instance which is being used to generate the changes
		* @param {string} sRemoveOperation Name of the control specific 'remove' changehandler
		* @param {string} sInsertOperation Name of the control specific 'add' changehandler
		* @param {string} sMoveOperation Name of the control specific 'move' changehandler
		*
		* @returns {array} Array containing the delta based created changes
		*/
		getArrayDeltaChanges: function (aExistingArray, aChangedArray, fnSymBol, oControl, sRemoveOperation, sInsertOperation, sMoveOperation) {
			var aResults = diff(aExistingArray, aChangedArray, fnSymBol);
			// Function to match field with exising field in the given array
			var fMatch = function (oField, aArray) {
				return aArray.filter(function (oExistingField) {
					return oExistingField && (oExistingField.name === oField.name);
				})[0];
			};
			// Function to extract change content from a field/property
			// TODO: move this to appropriate settings (e.g. TableSettings) instance
			var fGetChangeContent = function (oProperty) {
				var oChangeContent = {
					name: oProperty.name
				};
				// ID
				if (oProperty.id) {
					oChangeContent.id = oProperty.id;
				}
				// Index
				if (oProperty.index >= 0) {
					oChangeContent.index = oProperty.index;
				}
				// Role
				if (oProperty.role) {
					oChangeContent.role = oProperty.role;
				}
				// SortOrder
				if (oProperty.hasOwnProperty("descending")) {
					oChangeContent.descending = oProperty.descending === "true" || oProperty.descending === true;
				}

				return oChangeContent;
			};

			var aChanges = [];
			var aProcessedArray = aExistingArray.slice(0);

			aResults.forEach(function (oResult) {
				// Begin --> hack for handling result returned by diff
				if (oResult.type === "delete" && aProcessedArray[oResult.index] === undefined) {
					aProcessedArray.splice(oResult.index, 1);
					return;
				}

				var oProp, oExistingProp, iLength;
				if (oResult.type === "insert") {
					oExistingProp = fMatch(aChangedArray[oResult.index], aProcessedArray);
					if (oExistingProp) {
						oExistingProp.index = aProcessedArray.indexOf(oExistingProp);
						aProcessedArray.splice(oExistingProp.index, 1, undefined);
						aChanges.push(this.createAddRemoveChange(oControl, sRemoveOperation, fGetChangeContent(oExistingProp)));
					}
				}
				// End hack
				oProp = oResult.type === "delete" ? aProcessedArray[oResult.index] : aChangedArray[oResult.index];
				oProp.index = oResult.index;
				if (oResult.type === "delete") {
					aProcessedArray.splice(oProp.index, 1);
				} else {
					aProcessedArray.splice(oProp.index, 0, oProp);
				}
				// Move operation shows up as insert followed by delete OR delete followed by insert
				if (sMoveOperation) {
					iLength = aChanges.length;
					// Get the last added change
					if (iLength) {
						oExistingProp = aChanges[iLength - 1];
						oExistingProp = oExistingProp ? oExistingProp.changeSpecificData.content : undefined;
					}
					// Matching property exists with a different index --> then this is a move operation
					if (oExistingProp && oExistingProp.name === oProp.name && oResult.index != oExistingProp.index) {
						// remove the last insert/delete operation
						aChanges.pop();
						aChanges.push(this.createMoveChange(oExistingProp.id, oExistingProp.name, oResult.index, sMoveOperation, oControl, sMoveOperation !== "moveSort"));
						return;
					}
				}

				aChanges.push(this.createAddRemoveChange(oControl, oResult.type === "delete" ? sRemoveOperation : sInsertOperation, fGetChangeContent(oProp)));

			}.bind(this));
			return aChanges;
		},

		/**
		* Generates a personalization dialog based on the provided settings
		*
		* @public
		* @param {array} sFieldPath The relevant fieldPath
		* @param {array} aOrigConditions The conditions after they have been changed
		* @param {function} aOrigShadowConditions The conditions before they have been changed
		* @param {object} oControl Control instance which is being used to generate the changes
		*
		* @returns {array} Array containing the delta based created changes
		*/
		getConditionDeltaChanges: function(sFieldPath, aOrigConditions, aOrigShadowConditions, oControl){
			var oChange, aChanges = [];
			var aConditions = aOrigConditions;
			var aShadowConditions = aOrigShadowConditions ? aOrigShadowConditions : [];


			if (deepEqual(aConditions, aShadowConditions)) {
				return aChanges;
			}

			var fnRemoveSameConditions = function(aConditions, aShadowConditions){
				var bRunAgain;

				do  {
					bRunAgain = false;

					for (var i = 0; i < aConditions.length; i++) {
						for (var j = 0; j < aShadowConditions.length; j++) {
							if (deepEqual(aConditions[i], aShadowConditions[j])) {
								aConditions.splice(i, 1);
								aShadowConditions.splice(j, 1);
								bRunAgain = true;
								break;
							}
						}

						if (bRunAgain) {
							break;
						}
					}
				}  while (bRunAgain);
			};

			fnRemoveSameConditions(aConditions, aShadowConditions);

			if ((aConditions.length > 0) || (aShadowConditions.length > 0)) {

				aShadowConditions.forEach(function(oCondition) {
					oChange = FlexUtil.createConditionChange("removeCondition", oControl, sFieldPath, oCondition);
					if (oChange) {
						aChanges.push(oChange);
					}
				});

				aConditions.forEach(function(oCondition) {
					oChange = FlexUtil.createConditionChange("addCondition", oControl, sFieldPath, oCondition);
					if (oChange) {
						aChanges.push(oChange);
					}
				});

			}

			return aChanges;
		},

		createAddRemoveChange: function(oControl, sOperation, oContent){
			var oAddRemoveChange = {
				selectorElement: oControl,
				changeSpecificData: {
					changeType: sOperation,
					content: oContent
				}
			};
			return oAddRemoveChange;
		},

		createMoveChange: function (sId, sPropertyName, iNewIndex, sMoveOperation, oControl, bPersistId) {
			var oMoveChange =  {
				selectorElement: oControl,
				changeSpecificData: {
					changeType: sMoveOperation,
					content: {
						id: sId,
						name: sPropertyName,
						index: iNewIndex
					}
				}
			};

			if (!bPersistId) {
				delete oMoveChange.changeSpecificData.content.id;
			}

			return oMoveChange;
		},

		createConditionChange: function(sChangeType, oControl, sFieldPath, oCondition) {
			var oConditionChange = {
				selectorElement: oControl,
				changeSpecificData: {
					changeType: sChangeType,
					content: {
						name: sFieldPath,
						condition: oCondition
					}
				}
			};

			return oConditionChange;
		},

		sortP13nData: function (oData) {

			var sLocale = sap.ui.getCore().getConfiguration().getLocale().toString();

			var oCollator = window.Intl.Collator(sLocale, {});

			// group selected / unselected --> sort alphabetically in each group
			oData.items.sort(function (mField1, mField2) {
				if (mField1.selected && mField2.selected) {
					return (mField1.position || 0) - (mField2.position || 0);
				} else if (mField1.selected) {
					return -1;
				} else if (mField2.selected) {
					return 1;
				} else if (!mField1.selected && !mField2.selected) {
					return oCollator.compare(mField1.label, mField2.label);
				}
			});

		},

		handleChanges: function (aChanges) {
			return new Promise(function (resolve, reject) {
				sap.ui.require([
					"sap/ui/fl/write/api/ControlPersonalizationWriteAPI"
				], function (ControlPersonalizationWriteAPI) {
					ControlPersonalizationWriteAPI.add({
						changes: aChanges
					}).then(function (aDirtyChanges) {
						resolve(aDirtyChanges);
					}, reject);
				});
			});
		}
	};
	return FlexUtil;
});
