/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/ui/core/mvc/View", "sap/ui/core/Component", "sap/m/MessageBox", "sap/base/Log", "sap/fe/navigation/SelectionVariant"],
	function(View, Component, MessageBox, Log, SelectionVariant) {
		"use strict";

		function fnGetParentViewOfControl(oControl) {
			while (oControl && !(oControl instanceof View)) {
				oControl = oControl.getParent();
			}
			return oControl;
		}

		function fnHasTransientContexts(oListBinding) {
			var bHasTransientContexts = false;
			oListBinding.getCurrentContexts().forEach(function(oContext) {
				if (oContext && oContext.isTransient()) {
					bHasTransientContexts = true;
				}
			});
			return bHasTransientContexts;
		}

		function updateRelateAppsModel(
			oEntry,
			oObjectPageLayout,
			oXApplNavigation,
			sCurrentSemObj,
			sCurrentAction,
			aSemKeys,
			aSemUnavailableActs,
			oMetaModel,
			oMetaPath
		) {
			var oParam = {};
			if (oEntry) {
				if (aSemKeys && aSemKeys.length > 0) {
					for (var j = 0; j < aSemKeys.length; j++) {
						var sSemKey = aSemKeys[j].$PropertyPath;
						if (!oParam[sSemKey]) {
							oParam[sSemKey] = [];
							oParam[sSemKey].push(oEntry[sSemKey]);
						}
					}
				} else {
					// fallback to Technical Keys if no Semantic Key is present
					var aTechnicalKeys = oMetaModel.getObject(oMetaPath + "/$Type/$Key");
					for (var key in aTechnicalKeys) {
						var sObjKey = aTechnicalKeys[key];
						if (!oParam[sObjKey]) {
							oParam[sObjKey] = [];
							oParam[sObjKey].push(oEntry[sObjKey]);
						}
					}
				}
			}
			var oLinksDeferred = oXApplNavigation.getLinks({
				semanticObject: sCurrentSemObj,
				params: oParam
			});
			oLinksDeferred.done(function(aLinks) {
				// Sorting the related app links alphabetically
				aLinks.sort(function(oLink1, oLink2) {
					if (oLink1.text < oLink2.text) {
						return -1;
					}
					if (oLink1.text > oLink2.text) {
						return 1;
					}
					return 0;
				});
				if (aLinks && aLinks.length > 0) {
					var aItems = [];
					//Skip same application from Related Apps
					for (var i = 0; i < aLinks.length; i++) {
						var oLink = aLinks[i];
						var sIntent = oLink.intent;
						var sAction = sIntent.split("-")[1].split("?")[0];
						if (
							sAction !== sCurrentAction &&
							(!aSemUnavailableActs || (aSemUnavailableActs && aSemUnavailableActs.indexOf(sAction) === -1))
						) {
							aItems.push({
								text: oLink.text,
								targetSemObject: sIntent.split("#")[1].split("-")[0],
								targetAction: sAction.split("~")[0],
								targetParams: oParam
							});
						}
					}
					// If no app in list, related apps button will be hidden
					oObjectPageLayout.getModel("relatedAppsModel").setProperty("/visibility", aItems.length > 0);
					oObjectPageLayout.getModel("relatedAppsModel").setProperty("/items", aItems);
				} else {
					oObjectPageLayout.getModel("relatedAppsModel").setProperty("/visibility", false);
				}
			});
		}

		function fnUpdateRelatedAppsDetails(oObjectPageLayout) {
			var oUshellContainer = sap.ushell && sap.ushell.Container;
			var oXApplNavigation = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
			var oURLParsing = oUshellContainer && oUshellContainer.getService("URLParsing");
			var oParsedUrl = oURLParsing && oURLParsing.parseShellHash(document.location.hash);
			var sCurrentSemObj = oParsedUrl.semanticObject; // Current Semantic Object
			var sCurrentAction = oParsedUrl.action; // Current Action
			var oMetaModel = oObjectPageLayout.getModel().getMetaModel();
			var oBindingContext = oObjectPageLayout.getBindingContext();
			var oPath = oBindingContext && oBindingContext.getPath();
			var oMetaPath = oMetaModel.getMetaPath(oPath);
			// Semantic Key Vocabulary
			var sSemanticKeyVocabulary = oMetaPath + "/" + "@com.sap.vocabularies.Common.v1.SemanticKey";
			//Semantic Keys
			var aSemKeys = oMetaModel.getObject(sSemanticKeyVocabulary);
			// Unavailable Actions
			var aSemUnavailableActs = oMetaModel.getObject(
				oMetaPath + "/" + "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"
			);
			var oEntry = oBindingContext.getObject();
			if (!oEntry) {
				oBindingContext.requestObject().then(function(oEntry) {
					updateRelateAppsModel(
						oEntry,
						oObjectPageLayout,
						oXApplNavigation,
						sCurrentSemObj,
						sCurrentAction,
						aSemKeys,
						aSemUnavailableActs,
						oMetaModel,
						oMetaPath
					);
				});
			} else {
				updateRelateAppsModel(
					oEntry,
					oObjectPageLayout,
					oXApplNavigation,
					sCurrentSemObj,
					sCurrentAction,
					aSemKeys,
					aSemUnavailableActs,
					oMetaModel,
					oMetaPath
				);
			}
		}

		/**
		 * Fire Press on a Button
		 * Test if oButton is an enabled and visible sap.m.Button before triggering a press event
		 * @param {sap.m.Button | sap.m.OverflowToolbarButton} oButton a SAP UI5 Button
		 */
		function fnFireButtonPress(oButton) {
			var aAuthorizedTypes = ["sap.m.Button", "sap.m.OverflowToolbarButton"];
			if (
				oButton &&
				aAuthorizedTypes.indexOf(oButton.getMetadata().getName()) !== -1 &&
				oButton.getVisible() &&
				oButton.getEnabled()
			) {
				oButton.firePress();
			}
		}

		function fnResolveStringtoBoolean(sValue) {
			if (sValue === "true" || sValue === true) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Retrieves the main component associated with a given control / view
		 * @param {sap.ui.base.ManagedObject} oControl a managed object
		 */
		function getAppComponent(oControl) {
			var oOwner = Component.getOwnerComponentFor(oControl);
			if (!oOwner) {
				return oControl;
			} else {
				return getAppComponent(oOwner);
			}
		}

		/**
		 * FE MessageBox to confirm in case data loss warning is to be given.
		 *
		 * @param {Function} fnProcess - Task to be performed if user confirms.
		 * @param {sap.ui.core.Control} oControl - Control responsible for the the trigger of the dialog
		 * @param {string} programmingModel - Type of transaction model
		 * @returns {object} MessageBox if confirmation is required else the fnProcess function.
		 *
		 */
		function fnProcessDataLossConfirmation(fnProcess, oControl, programmingModel, oController) {
			var oUIModelData = oControl && oControl.getModel("ui") && oControl.getModel("ui").getData(),
				bUIEditable = oUIModelData.createMode || oUIModelData.editable === "Editable",
				oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
				sWarningMsg = oResourceBundle && oResourceBundle.getText("NAVIGATION_AWAY_MSG"),
				sConfirmButtonTxt = oResourceBundle && oResourceBundle.getText("NAVIGATION_AWAY_CONFIRM_BUTTON"),
				sCancelButtonTxt = oResourceBundle && oResourceBundle.getText("NAVIGATION_AWAY_CANCEL_BUTTON");

			if (programmingModel === "Sticky" && bUIEditable) {
				return MessageBox.warning(sWarningMsg, {
					actions: [sConfirmButtonTxt, sCancelButtonTxt],
					onClose: function(sAction) {
						if (sAction === sConfirmButtonTxt) {
							var oLocalUIModel = oControl && oControl.getModel("localUI");

							Log.info("Navigation confirmed.");
							if (oLocalUIModel) {
								oLocalUIModel.setProperty("/sessionOn", false);
							} else {
								Log.warning("Local UIModel couldn't be found.");
							}
							fnProcess();
							if (oController) {
								oController.editFlow.fnStickyDiscard(oControl.getBindingContext());
							}
						} else {
							Log.info("Navigation rejected.");
						}
					}
				});
			}
			return fnProcess();
		}

		/**
		 * Performs External Navigation.
		 *
		 * @param {object} oView - LR or OP view where Navigation is performed
		 * @param {object} oSelectionVariantEntityType - Selection Variant
		 * @param {string} sSemanticObject
		 * @param {string} sAction
		 *
		 */
		function fnNavigateToExternalApp(oView, oSelectionVariant, sSemanticObject, sAction, fnOnError) {
			oSelectionVariant = oSelectionVariant ? oSelectionVariant : new SelectionVariant();
			var vNavigationParameters = oSelectionVariant.toJSONString();
			var oAppComponent = CommonUtils.getAppComponent(oView);
			oAppComponent.getService("navigation").then(function(oNavigationService) {
				oNavigationService.navigate(sSemanticObject, sAction, vNavigationParameters, null, fnOnError);
			});
		}

		/**
		 * Method to get metadata of entityset properties
		 *
		 * @param {object} oMetaModel - MetaModel for annotations
		 * @param {string} sEntitySet - EntitySet for properities
		 *
		 */
		function fnGetEntitySetProperties(oMetaModel, sEntitySet) {
			var oEntityType = oMetaModel.getObject("/" + sEntitySet + "/") || {},
				oProperties = {};

			for (var sKey in oEntityType) {
				if (
					oEntityType.hasOwnProperty(sKey) &&
					!/^\$/i.test(sKey) &&
					oEntityType[sKey].$kind &&
					oEntityType[sKey].$kind === "Property"
				) {
					oProperties[sKey] = oEntityType[sKey];
				}
			}
			return oProperties;
		}

		/**
		 * Method to get madatory filterfields
		 *
		 * @param {object} oMetaModel - MetaModel for annotations
		 * @param {string} sEntitySet - EntitySet for properities
		 *
		 */
		function fnGetMandatoryFilterFields(oMetaModel, sEntitySet) {
			var aMandatoryFilterFields;
			if (oMetaModel && sEntitySet) {
				aMandatoryFilterFields = oMetaModel.getObject(
					"/" + sEntitySet + "@Org.OData.Capabilities.V1.FilterRestrictions/RequiredProperties"
				);
			}
			return aMandatoryFilterFields;
		}

		/**
		 * Method to update the IBN Buttons Visibility
		 *
		 * @param {object} localUIModel - JSONModel containing SemanticObject and Action combination
		 */
		function fnUpdateDataFiledForIBNButtonsVisibility(localUIModel) {
			var oUshellContainer = sap.ushell && sap.ushell.Container;
			var oXApplNavigation = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
			var oLinksDeferred = oXApplNavigation.getLinks({
				params: {}
			});
			oLinksDeferred.then(function(aLinks) {
				if (aLinks && aLinks.length > 0) {
					var oLinks = {};
					// TODO: we need to add only those actions in the model which are present on the UI
					for (var i = 0; i < aLinks.length; i++) {
						oLinks[aLinks[i].intent.substring(1)] = true;
					}
					localUIModel.setProperty("/IBNActions", oLinks);
				}
			});
		}
		/**
		 * Creates the updated key to check the i18n override and fallbacks to the old value if the new value is not available for the same key.
		 *
		 * @param {string} sFrameworkKey - current key.
		 * @param {object} oResourceBundle - contains the local resource bundle
		 * @param {object} oParams - parameter object for the resource value
		 * @param {object} sEntitySetName - entity set name of the control where the resource is being used
		 */
		function getTranslatedText(sFrameworkKey, oResourceBundle, oParams, sEntitySetName) {
			var sContextOverriddenKey;
			if (oResourceBundle) {
				if (sEntitySetName) {
					//CASE: Context Specific Overriding of the text
					sContextOverriddenKey = sFrameworkKey + "|" + sEntitySetName;
					if (oResourceBundle.getText(sContextOverriddenKey, oParams, true)) {
						return oResourceBundle.getText(sContextOverriddenKey, oParams, true);
					}
				}
				//CASE: Direct overriding of the Framework Text
				if (oResourceBundle.getText(sFrameworkKey, oParams, true)) {
					return oResourceBundle.getText(sFrameworkKey, oParams, true);
				}
			}
			//CASE: Framework Text
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
			return oResourceBundle.getText(sFrameworkKey, oParams);
		}

		var CommonUtils = {
			fireButtonPress: fnFireButtonPress,
			getParentViewOfControl: fnGetParentViewOfControl,
			hasTransientContext: fnHasTransientContexts,
			updateRelatedAppsDetails: fnUpdateRelatedAppsDetails,
			resolveStringtoBoolean: fnResolveStringtoBoolean,
			getAppComponent: getAppComponent,
			processDataLossConfirmation: fnProcessDataLossConfirmation,
			navigateToExternalApp: fnNavigateToExternalApp,
			getMandatoryFilterFields: fnGetMandatoryFilterFields,
			getEntitySetProperties: fnGetEntitySetProperties,
			updateDataFiledForIBNButtonsVisibility: fnUpdateDataFiledForIBNButtonsVisibility,
			getTranslatedText: getTranslatedText
		};

		return CommonUtils;
	}
);
