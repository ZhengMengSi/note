/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/base/EventProvider"
], function(EventProvider) {
	"use strict";

	var HISTORY_PREFIX = "sapui5.history-";
	var MAX_HISTORY_RECORDS = 3;

	/**
	 * Retrieves the data for History Values
	 *
	 * @constructor
	 * @private
	 * @author SAP SE
	 */
	var oInstance;
	var HistoryValuesProvider = EventProvider.extend("sap.ui.comp.providers.HistoryValuesProvider", {
		metadata: {
			library: "sap.ui.comp",
			events: {
				fieldUpdated: {
					parameters: {
						fieldData: {
							type: "Array"
						},
						fieldName: {
							type: "String"
						}
					}
				}
			}
		},

		constructor: function () {
			EventProvider.apply(this, arguments);

			this._initialize();
		}
	});

	HistoryValuesProvider.prototype._initialize = function () {
		this._oHistoryDataReadyPromise = new Promise(function (resolve) {
			this._historyDataReadyResolve = resolve;
		}.bind(this));

		this._getGlobalPersonalizer().getPersData().then(function (oData) {
			if (!oData) {
				oData = {};
			}

			var sAppUniqueID = this._getAppUniqueID();

			this._appContainerID = oData[sAppUniqueID];

			if (!this._appContainerID) {
				this._appContainerID = this._getAppContainerID();

				oData[sAppUniqueID] = this._appContainerID;

				this._getGlobalPersonalizer().setPersData(oData);
			}

			this._getInitialDataFromService();
		}.bind(this));
	};

	/**
	 * Register control to record history values
	 *
	 * @private
	 * @sap-restricted sap.ui.comp.providers.ValueListProvider
	 * @param oControl {sap.ui.core.Control} control to listen for changes
	 * @param sFieldName {string} fieldName
	 */
	HistoryValuesProvider.prototype.registerControl = function (oControl, sFieldName) {
		if (oControl.isA("sap.m.MultiInput")) {
			oControl.attachTokenUpdate(function (oEvent) {
				this._onMultiInputChange(sFieldName, oEvent);
			}, this);
			return;
		}

		if (oControl.isA("sap.m.MultiComboBox")) {
			oControl.attachSelectionChange(function (oEvent) {
				this._onMultiComboBoxChange(sFieldName, oEvent);
			}, this);
			return;
		}

		if (oControl.isA("sap.m.Input")) {
			oControl.attachChange(function (oEvent) {
				this._onInputChange(sFieldName, oEvent);
			}, this);
			return;
		}

		if (oControl.isA("sap.m.ComboBox")) {
			oControl.attachChange(function (oEvent) {
				this._onComboBoxChange(sFieldName, oEvent);
			}, this);
			return;
		}
	};

	/**
	 * Returns history value for a field
	 *
	 * @private
	 * @sap-restricted sap.ui.comp.providers.ValueListProvider
	 * @param sFieldName
	 * @returns {Array} recorded history values
	 */
	HistoryValuesProvider.prototype.getFieldData = function(sFieldName) {
		return this._getHistoryData()[sFieldName] || [];
	};

	/**
	 * Returns promise to wait for data
	 *
	 * @private
	 * @sap-restricted sap.ui.comp.providers.ValueListProvider
	 * @returns {Promise}
	 */
	HistoryValuesProvider.prototype.isDataReady = function () {
		return this._oHistoryDataReadyPromise;
	};

	HistoryValuesProvider.prototype._onMultiInputChange = function (sFieldName, oEvent) {
		var sType = oEvent.getParameter("type"),
			aAddedTokens = oEvent.getParameter("addedTokens");

		if (sType === "added") {
			var aDataToSave = aAddedTokens.reduce(function (aResult, oToken) {
				var oData = oToken.data("row");
				if (oData) {
					oData = Object.assign({}, oData);
					delete oData.__metadata;
					delete oData.order;

					return aResult.concat(oData);
				}

				return aResult;
			}, []);

			this._saveFieldData(sFieldName, aDataToSave);
		}
	};

	HistoryValuesProvider.prototype._onMultiComboBoxChange = function (sFieldName, oEvent) {
		var bSelected = oEvent.getParameter("selected"),
			oChangedItem = oEvent.getParameter("changedItem");

		if (bSelected && oChangedItem) {
			var oData = oChangedItem.getBindingContext("list").getObject();

			this._processSingleValueControl(sFieldName, oData);
		}
	};

	HistoryValuesProvider.prototype._onInputChange = function (sFieldName, oEvent) {
		var bValidated = oEvent.getParameter("validated"),
			oSelectedRow = sap.ui.getCore().byId(oEvent.getSource().getSelectedRow());

		if (bValidated && oSelectedRow) {
			var oData = oSelectedRow.getBindingContext("list").getObject();

			this._processSingleValueControl(sFieldName, oData);
		}
	};

	HistoryValuesProvider.prototype._onComboBoxChange = function (sFieldName, oEvent) {
		var sValue = oEvent.getParameter("value"),
			sNewValue = oEvent.getParameter("newValue"),
			oSelectedItem = oEvent.getSource().getSelectedItem();

		if (sValue && sNewValue && oSelectedItem) {
			var oData = oSelectedItem.getBindingContext("list").getObject();

			this._processSingleValueControl(sFieldName, oData);
		}
	};

	HistoryValuesProvider.prototype._processSingleValueControl = function (sFieldName, oData) {
		if (oData) {
			oData =  Object.assign({}, oData);
			delete oData.__metadata;
			delete oData.order;

			this._saveFieldData(sFieldName, [oData]);
		}
	};

	HistoryValuesProvider.prototype._getGlobalPersonalizer = function () {
		if (this._globalPersonalizer) {
			return this._globalPersonalizer;
		}

		var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
			oScope = {
				keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
				writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
				clientStorageAllowed: false,
				validity: Infinity
			},
			oGlobalPersId = {
				container: this._getGlobalContainerID(),
				item: this._getHistoryPrefix() + "appContainerIDs"
			};

		this._globalPersonalizer = oPersonalizationService.getPersonalizer(oGlobalPersId, oScope);

		return this._globalPersonalizer;
	};

	HistoryValuesProvider.prototype._getAppPersonalizer = function () {
		if (this._appPersonalizer) {
			return this._appPersonalizer;
		}

		var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
			oScope = {
				keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
				writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
				clientStorageAllowed: false,
				validity: Infinity
			},
			oAppPersId = {
				container: this._getAppContainerID(),
				item: this._getHistoryPrefix() + "appData"
			};

		this._appPersonalizer = oPersonalizationService.getPersonalizer(oAppPersId, oScope);

		return this._appPersonalizer;
	};

	HistoryValuesProvider.prototype._getInitialDataFromService = function () {
		return this._getAppPersonalizer().getPersData().then(function (oData) {
			oData = oData || {};
			this._setHistoryData(oData);

			this._historyDataReadyResolve(oData);

			return oData;
		}.bind(this));
	};

	HistoryValuesProvider.prototype._getHistoryData = function () {
		return this._historyData;
	};

	HistoryValuesProvider.prototype._setHistoryData = function (oData) {
		this._historyData = oData;
	};

	HistoryValuesProvider.prototype._saveFieldData = function (sFieldName, aFieldNewData) {
		var oAppData = this._getHistoryData(),
			aFieldOldData = oAppData[sFieldName] || [],
			iMaxHistoryRecords = this._getMaxHistoryRecords();

		oAppData[sFieldName] = this._getDistinct(aFieldNewData.concat(aFieldOldData)).slice(0, iMaxHistoryRecords);

		this._setHistoryData(oAppData);

		this.fireEvent("fieldUpdated", {
			fieldData: oAppData[sFieldName],
			fieldName: sFieldName
		});

		return this._getAppPersonalizer().setPersData(oAppData);
	};

	HistoryValuesProvider.prototype._getGlobalContainerID = function () {
		if (!this._globalContainerID) {
			this._globalContainerID = this._getHistoryPrefix() + "all.apps.containers";
		}

		return this._globalContainerID;
	};

	HistoryValuesProvider.prototype._getAppContainerID = function () {
		if (!this._appContainerID) {
			this._appContainerID = this._createUUID();
		}

		return this._appContainerID;
	};

	HistoryValuesProvider.prototype._getAppUniqueID = function () {
		if (this._appUniqueID) {
			return this._appUniqueID;
		}

		var oAppLifeCycleService = sap.ushell.Container.getService("AppLifeCycle"),
			oCurrentApplication = oAppLifeCycleService.getCurrentApplication(),
			oComponent, oMetadata, oManifest, sId;

		if (oCurrentApplication) {
			oComponent = oCurrentApplication.componentInstance;
		}

		if (oComponent) {
			oMetadata = oComponent.getMetadata();
		}

		if (oMetadata) {
			oManifest = oMetadata.getManifest();
		}

		if (oManifest) {
			sId = oManifest["sap.app"].id;
		}

		this._appUniqueID = this._getHistoryPrefix() + sId;

		return this._appUniqueID;
	};

	HistoryValuesProvider.prototype._getHistoryPrefix = function () {
		return HISTORY_PREFIX;
	};

	HistoryValuesProvider.prototype._getMaxHistoryRecords = function () {
		return MAX_HISTORY_RECORDS;
	};

	HistoryValuesProvider.prototype._getDistinct = function (aData) {
		var oUnique = {},
			aDistinct = [],
			sKey = aData[0] && Object.keys(aData[0])[0];

		aData.forEach(function (x) {
			var sCurr = x[sKey];
			if (!oUnique[sCurr]) {
				aDistinct.push(x);
				oUnique[sCurr] = true;
			}
		}, this);

		return aDistinct;
	};

	HistoryValuesProvider.prototype._createUUID = function () {
		var sUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (sPosition) {
			var iRandom = Math.random() * 16 | 0;

			if (sPosition === 'y') {
				iRandom = iRandom & 0x3 | 0x8;
			}

			return iRandom.toString(16);
		});

		return sUuid;
	};

	return {
		getInstance: function () {
			if (!oInstance) {
				oInstance = new HistoryValuesProvider();
			}
			return oInstance;
		}
	};
});
