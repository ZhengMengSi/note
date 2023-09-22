/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/model/json/JSONModel", "sap/fe/macros/CommonHelper"],
	function(JSONModel, CommonHelper) {
		"use strict";
		/**
		 * Static class used by MDC Table during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var TableRuntime = {
			displayTableSettings: function(oEvent) {
				/*
				 Temporary solution
				 Wait for mdc Table to provide public api to either get button 'Settings' or fire event on this button
				 */
				var oParent = oEvent.getSource().getParent(),
					oSettingsButton = sap.ui.getCore().byId(oParent.getId() + "-settings");
				CommonHelper.fireButtonPress(oSettingsButton);
			},
			executeConditionalActionShortcut: function(sButtonMatcher, oSource) {
				// Get the button related to keyboard shortcut
				var oParent = oSource.getParent();
				if (sButtonMatcher !== "CreationRow") {
					var oButton = oParent.getActions().find(function(oElement) {
						return oElement.getId().endsWith(sButtonMatcher);
					});
					CommonHelper.fireButtonPress(oButton);
				} else {
					var oCreationRow = oParent.getAggregation("creationRow");
					if (oCreationRow && oCreationRow.getApplyEnabled() && oCreationRow.getVisible()) {
						oCreationRow.fireApply();
					}
				}
			},
			setContexts: function(oTable, sModelName, sPrefix, sDeletablePath, oDraft, sCollection) {
				var oActionOperationAvailableMap = JSON.parse(sCollection);
				var aSelectedContexts = oTable.getSelectedContexts();
				var isDeletable = false;
				var aDeletableContexts = [];
				var aUnsavedContexts = [];
				var aLockedContexts = [];
				var oLockedAndUnsavedContexts = {};
				var oModelObject;
				var sContextCollectionName = "/$contexts/" + sPrefix;
				var oContextModel = oTable.getModel(sModelName);
				if (!oContextModel) {
					// create model but that seems to be too later
					oContextModel = new JSONModel();
					oTable.setModel(oContextModel, "$contexts");
				}
				oLockedAndUnsavedContexts.aUnsavedContexts = [];
				oLockedAndUnsavedContexts.aLockedContexts = [];
				oContextModel.setProperty("/$contexts", {});
				oContextModel.setProperty(sContextCollectionName, {
					selectedContexts: aSelectedContexts,
					numberOfSelectedContexts: aSelectedContexts.length,
					deleteEnabled: true,
					deletableContexts: [],
					unSavedContexts: [],
					lockedContexts: []
				});
				for (var i = 0; i < aSelectedContexts.length; i++) {
					var oSelectedContext = aSelectedContexts[i];
					var oContextData = oSelectedContext.getObject();
					for (var key in oContextData) {
						if (key.indexOf("#") === 0) {
							var sActionPath = key;
							sActionPath = sActionPath.substring(1, sActionPath.length);
							oModelObject = oContextModel.getProperty(sContextCollectionName);
							oModelObject[sActionPath] = true;
							oContextModel.setProperty(sContextCollectionName, oModelObject);
						}
					}
					oModelObject = oContextModel.getProperty(sContextCollectionName);
					if (sDeletablePath != "undefined") {
						if (oSelectedContext.getProperty(sDeletablePath)) {
							if (oDraft !== "undefined" && oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true) {
								oLockedAndUnsavedContexts = getUnsavedAndLockedContexts(oContextData, oSelectedContext);
							} else {
								aDeletableContexts.push(oSelectedContext);
								oLockedAndUnsavedContexts.isDeletable = true;
							}
						}
						oModelObject["deleteEnabled"] = oLockedAndUnsavedContexts.isDeletable;
					} else if (oDraft !== "undefined" && oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true) {
						oLockedAndUnsavedContexts = getUnsavedAndLockedContexts(oContextData, oSelectedContext);
					} else {
						aDeletableContexts.push(oSelectedContext);
					}
				}
				function getUnsavedAndLockedContexts(oContextData, oSelectedContext) {
					if (oContextData.DraftAdministrativeData.InProcessByUser) {
						aLockedContexts.push(oSelectedContext);
					} else {
						aUnsavedContexts.push(oSelectedContext);
						isDeletable = true;
					}
					return {
						aLockedContexts: aLockedContexts,
						aUnsavedContexts: aUnsavedContexts,
						isDeletable: isDeletable
					};
				}
				this.setActionEnablement(oContextModel, oActionOperationAvailableMap, sContextCollectionName, aSelectedContexts);
				oModelObject["deletableContexts"] = aDeletableContexts;
				oModelObject["unSavedContexts"] = oLockedAndUnsavedContexts.aUnsavedContexts;
				oModelObject["lockedContexts"] = oLockedAndUnsavedContexts.aLockedContexts;
				oModelObject["controlId"] = oTable.getId();
				oContextModel.setProperty(sContextCollectionName, oModelObject);
			},
			setActionEnablement: function(oContextModel, oActionOperationAvailableMap, sContextCollectionName, aSelectedContexts) {
				for (var sAction in oActionOperationAvailableMap) {
					oContextModel.setProperty(sContextCollectionName + "/" + sAction, false);
					var sProperty = oActionOperationAvailableMap[sAction];
					for (var i = 0; i < aSelectedContexts.length; i++) {
						var oSelectedContext = aSelectedContexts[i];
						var oContextData = oSelectedContext.getObject();
						if (sProperty === null && !!oContextData["#" + sAction]) {
							//look for action advertisement if present and its value is not null
							oContextModel.setProperty(sContextCollectionName + "/" + sAction, true);
							break;
						} else if (!!oSelectedContext.getObject(sProperty)) {
							oContextModel.setProperty(sContextCollectionName + "/" + sAction, true);
							break;
						}
					}
				}
			}
		};

		return TableRuntime;
	},
	/* bExport= */ true
);
