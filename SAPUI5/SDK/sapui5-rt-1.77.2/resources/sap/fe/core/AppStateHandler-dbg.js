/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* global Promise */
sap.ui.define(
	[
		"sap/ui/mdc/p13n/StateUtil",
		"sap/fe/navigation/navigationLibrary",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/NavigationHelper",
		"sap/ui/core/routing/HashChanger",
		"sap/base/Log"
	],
	function(StateUtil, NavLibrary, CommonUtils, NavigationHelper, HashChanger, Log) {
		"use strict";
		var AppStateHandler = {
			bIsAppStateReady: false,
			sNavType: null,
			init: function() {
				this.bIsAppStateReady = false;
			},
			/**
			 * Creates an appstate on every filter change and also variant change.
			 * @function
			 * @static
			 * @name sap.fe.core.AppStateHandler.
			 * @memberof sap.fe.core.AppStateHandler
			 * @param {object} oController Instance of the controller passed
			 * @private
			 * @sap-restricted
			 **/
			createAppState: function(oController) {
				/* currently we are passing the controller of the view for which we need to create the app state but in future this can also be used to create
				appstate for storing the control level data by passing the control */
				var oAppComponent = CommonUtils.getAppComponent(oController.getView());
				var oViewData = oController.getView().getViewData();
				var oMetaModel = oController
					.getView()
					.getModel()
					.getMetaModel();
				var bIsFclEnabled = oAppComponent.getRootViewController().isFclEnabled();
				var sEntitySet = oViewData.entitySet;
				var oRouterProxy = oAppComponent.getRouterProxy();
				var sHash = HashChanger.getInstance().getHash();
				var that = this;
				var sTemplate;
				if (
					(oViewData.viewLevel === 0 || bIsFclEnabled) &&
					oController.getView().getViewData().variantManagement !== "None" && //TODO This has to be removed once functionality fnClearFilterAndReplaceWithAppState is working with VM set to "None"
					this._getIsAppStateReady() &&
					this.sNavType !== "initial" &&
					this.sNavType !== "xAppState" &&
					this.sNavType !== "URLParams"
				) {
					//if we are in LR and also if appstate is ready and also navtype is iAppState then only create an appstate
					sTemplate = "LR";
					var sFilterBarKey = this.createKeyForAppStateData(sTemplate, [sEntitySet], "FilterBar");
					var mInnerAppData = {};
					var sVariantKey, oVariant;
					var oFilterBar = oController.getView().byId(
						oController
							.getView()
							.getContent()[0]
							.data("filterBarId")
					);
					// TODO Check for scenarios where personalisation
					// TODO Check scenarios where VM is None / Control

					switch (oController.getView().getViewData().variantManagement) {
						case "Page":
							oVariant = oController.getView().byId("fe::lr::vm");
							sVariantKey = this.createKeyForAppStateData(sTemplate, [sEntitySet], "Variant");
							break;
						case "None":
							Log.debug("AppState handling is currently only working with Page VM");
							break;
						case "Control":
							Log.debug("Variant Management is set to Control VM which does not support the AppState handling yet");
							break;
						default:
							Log.error(
								"Variant Management not correctly defined, variable wrongly set to: " +
									oController.getView().getViewData().variantManagement
							);
							break;
					}
					StateUtil.retrieveExternalState(oFilterBar).then(function(mExtConditions) {
						oAppComponent.getService("navigation").then(function(oNavigationService) {
							mInnerAppData[sFilterBarKey] = mExtConditions;
							switch (oController.getView().getViewData().variantManagement) {
								case "Page":
									mInnerAppData[sVariantKey] = {
										"variantId": oVariant.getCurrentVariantKey()
									};
									break;
								case "Control":
									// code for control variant management
									break;
								default:
									break;
							}
							var oStoreData = {
								appState: mInnerAppData
							};
							oStoreData = that.removeSensitiveDataForIAppState(oStoreData, oMetaModel, sEntitySet);
							var oAppState = oNavigationService.storeInnerAppStateWithImmediateReturn(oStoreData, true, sEntitySet, true);
							var sAppStateKey = oAppState.appStateKey;
							var sNewHash = oNavigationService.replaceInnerAppStateKey(sHash, sAppStateKey);
							oRouterProxy.navToHash(sNewHash);
						});
					});
				} else if (oViewData.viewLevel === 1) {
					//code for storing appstate for OP to be placed here
					sTemplate = "OP";
				} else if (oViewData.viewLevel > 1) {
					//code for storing appstate for SUB OP to be placed here
					sTemplate = "SUBOP";
				}
				this.sNavType = null; //setting back the navtype to null after initial load so that on every filter change afterwards we can create an appstate
			},

			/**
			 * Applies an appstate by fetching appdata and passing it to _applyAppstateToPage.
			 * @function
			 * @static
			 * @name sap.fe.core.AppStateHandler.
			 * @memberof sap.fe.core.AppStateHandler
			 * @param {object} oController Instance of the controller passed
			 * @private
			 * @sap-restricted
			 **/
			applyAppState: function(oController) {
				var that = this;
				var oAppComponent = CommonUtils.getAppComponent(oController.getView());
				var oFilterBar = oController.getView().byId(
					oController
						.getView()
						.getContent()[0]
						.data("filterBarId")
				);
				oAppComponent.getService("navigation").then(function(oNavigationService) {
					var oParseNavigationPromise = oNavigationService.parseNavigation();
					oParseNavigationPromise.done(function(oAppData, oStartupParameters, sNavType) {
						that.sNavType = sNavType;
						if (sNavType) {
							that._applyAppStateToPage(oController, oAppData, oStartupParameters, sNavType);
						} else {
							//if navtype is not iAppState then set the app state ready to true
							that._setIsAppStateReady(true, oFilterBar);
						}
					});
				});
			},

			/**
			 * Applies Appstate to the page.
			 * @function
			 * @static
			 * @name sap.fe.core.AppStateHandler.
			 * @memberof sap.fe.core.AppStateHandler
			 * @param {object} oController Instance of the controller passed
			 * @param {object} oAppData Object containing the appdata fetched from parse navigation promise
			 * @param {object} oStartupParameters Object containing the startupparameters of the component fetched from parse navigation promise
			 * @param {string} sNavType Type of the navigation
			 * @private
			 * @sap-restricted
			 **/
			_applyAppStateToPage: function(oController, oAppData, oStartupParameters, sNavType) {
				var that = this,
					sTemplate,
					oConditions,
					oFilterBar,
					oAppComponent = CommonUtils.getAppComponent(oController.getView()),
					oMetaModel = oAppComponent.getMetaModel(),
					oViewData = oController.getView().getViewData(),
					sEntitySet = oViewData.entitySet,
					bIsFclEnabled = oAppComponent.getRootViewController().isFclEnabled();

				if (sNavType !== "iAppState") {
					oConditions = {};
					oFilterBar = oController.getView().byId(
						oController
							.getView()
							.getContent()[0]
							.data("filterBarId")
					);

					if (oAppData.oSelectionVariant) {
						var oPropertiesMetadata = CommonUtils.getEntitySetProperties(oMetaModel, sEntitySet),
							aMandatoryFilterFields = CommonUtils.getMandatoryFilterFields(oMetaModel, sEntitySet);

						NavigationHelper.addDefaultDisplayCurrency(aMandatoryFilterFields, oAppData);
						NavigationHelper.addSelectionVariantToConditions(oAppData.oSelectionVariant, oConditions, oPropertiesMetadata);
						StateUtil.applyExternalState(oFilterBar, {
							filter: oConditions
						}).then(function() {
							that._setIsAppStateReady(true, oFilterBar);
						});
					} else {
						that._setIsAppStateReady(true, oFilterBar);
					}
				} else if (oViewData.viewLevel === 0 || bIsFclEnabled) {
					sTemplate = "LR";

					var sFilterBarKey = this.createKeyForAppStateData(sTemplate, [sEntitySet], "FilterBar");
					var sVariantKey;
					switch (oController.getView().getViewData().variantManagement) {
						case "Page":
							sVariantKey = this.createKeyForAppStateData(sTemplate, [sEntitySet], "Variant");
							break;
						case "None":
							break;
						case "Control":
							break;
						default:
							Log.error(
								"Variant Management not correctly defined, variable wrongly set to: " +
									oController.getView().getViewData().variantManagement
							);
							break;
					}

					oFilterBar = oController.getView().byId(
						oController
							.getView()
							.getContent()[0]
							.data("filterBarId")
					);
					if (
						(oAppData && oAppData.appState && oAppData.appState[sVariantKey] && oAppData.appState[sVariantKey].variantId) || //Page VM
						(oAppData && oAppData.appState && oAppData.appState[sFilterBarKey]) // No VM > Dirty state only
						// TODO Check for control VM
					) {
						//First apply the variant from the appdata
						var fnClearFilterAndReplaceWithAppState = function() {
							var oAnnotation = oMetaModel.getObject("/" + sEntitySet + "@Org.OData.Capabilities.V1.FilterRestrictions");
							var oEntityType = oMetaModel.getObject("/" + sEntitySet + "/");
							var aNonFilterableProps = [];
							if (oAnnotation) {
								if (oAnnotation.NonFilterableProperties) {
									aNonFilterableProps = oAnnotation.NonFilterableProperties.map(function(oProperty) {
										return oProperty.$PropertyPath;
									});
								}
							}
							var oObj;
							var oClearConditions = {};
							for (var sKey in oEntityType) {
								oObj = oEntityType[sKey];
								if (oObj) {
									if (oObj.$kind === "Property") {
										// skip non-filterable property
										if (aNonFilterableProps.indexOf(sKey) >= 0) {
											continue;
										}
										oClearConditions[sKey] = [];
									}
								}
							}
							//After applying the variant , clear all the filterable properties
							//TODO: Currently we are fetching all the filterable properties from the entitytype and explicitly clearing the state by setting its value to []
							//This is just a workaround till StateUtil provides an api to clear the state.
							StateUtil.applyExternalState(oFilterBar, {
								filter: {
									"filter": oClearConditions
								}
							}).then(function() {
								if (oAppData && oAppData.appState && oAppData.appState[sFilterBarKey]) {
									oConditions = oAppData.appState[sFilterBarKey].filter;
								}
								//Now apply the filters fetched from the appstate
								StateUtil.applyExternalState(oFilterBar, {
									filter: oConditions
								}).then(function() {
									that._setIsAppStateReady(true, oFilterBar); //once the filters are applied and appstate is applied then set appstate ready to true
								});
							});
						};
						switch (oController.getView().getViewData().variantManagement) {
							case "Page":
								sap.ui.fl.ControlPersonalizationAPI.activateVariant(
									oAppComponent,
									oAppData.appState[sVariantKey].variantId
								).then(fnClearFilterAndReplaceWithAppState);
								break;
							case "None":
								Log.debug("AppState handling is currently only working with Page VM");
								break;
							case "Control":
								Log.debug("Variant Management is set to Control VM which does not support the AppState handling yet");
								break;
							default:
								Log.error(
									"Variant Management not correctly defined, variable wrongly set to: " +
										oController.getView().getViewData().variantManagement
								);
								break;
						}
					}
				} else if (oViewData.viewLevel === 1) {
					sTemplate = "OP";
					//code for storing appstate for OP to be placed here
				} else if (oViewData.viewLevel > 1) {
					sTemplate = "SUBOP";
					//code for storing appstate for SUB OP to be placed here
				}
			},

			/**
			 * Creates key to store app data
			 * @function
			 * @static
			 * @name sap.fe.core.AppStateHandler.
			 * @memberof sap.fe.core.AppStateHandler
			 * @param {array} aEntitySet Array of EntitySets to be concatenated
			 * @param {sControl} sControl name of the control for which the appdata needs to be stored
			 * @returns {string} key for the app state data
			 * @private
			 * @sap-restricted
			 **/

			createKeyForAppStateData: function(sView, aEntitySet, sControl) {
				/* EG: sView = OP
						aEntitySet = ["SalesOrderManage","_Item"]
						sControl = Table
						Now the key should be "OP_SalesOrderManage/_Item/Table" which means we are storing appdata for the OP table _Item
				*/
				var sKey = "";
				sKey = sKey + sView + "_";
				for (var i = 0; i < aEntitySet.length; i++) {
					sKey = sKey + aEntitySet[0] + "/";
				}
				sKey = sKey + sControl;
				return sKey;
			},

			_setIsAppStateReady: function(bIsAppStateReady, oFilterBar) {
				this.bIsAppStateReady = bIsAppStateReady;
				if (!Object.keys(oFilterBar.getFilterConditions()).length) {
					this.sNavType = null;
				}
			},
			_getIsAppStateReady: function() {
				return this.bIsAppStateReady;
			},
			removeSensitiveDataForIAppState: function(oData, oMetaModel, sEntitySet) {
				var aPropertyAnnotations;
				var sKey = "LR_" + sEntitySet + "/FilterBar";
				var oFilterData = oData.appState[sKey].filter;
				var aKeys = Object.keys(oFilterData);
				aKeys.map(function(sProp) {
					if (sProp !== "$editState") {
						aPropertyAnnotations = oMetaModel.getObject("/" + sEntitySet + "/" + sProp + "@");
						if (aPropertyAnnotations) {
							if (NavigationHelper._checkPropertyAnnotationsForSensitiveData(aPropertyAnnotations)) {
								delete oFilterData[sProp];
							}
						}
					}
				});
				oData.appState[sKey].filter = oFilterData;
				return oData;
			}
		};
		return AppStateHandler;
	},
	/* bExport= */
	true
);
