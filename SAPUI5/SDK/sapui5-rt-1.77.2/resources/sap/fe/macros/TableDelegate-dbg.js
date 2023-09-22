/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/TableDelegate",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/StableIdHelper",
		"sap/fe/macros/field/FieldHelper",
		"sap/fe/macros/table/TableHelper",
		"sap/fe/macros/DelegateUtil"
	],
	function(
		TableDelegate,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment,
		JSONModel,
		CommonHelper,
		StableIdHelper,
		FieldHelper,
		TableHelper,
		DelegateUtil
	) {
		"use strict";

		var FETCHED_PROPERTIES_DATA_KEY = "sap.fe.TableDelegate.propertyInfoMap";

		/**
		 * Helper class for sap.ui.mdc.Table.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.69
		 * @alias sap.fe.macros.TableDelegate
		 */
		var ODataTableDelegate = Object.assign({}, TableDelegate);

		function _sliceAtSlash(sPath, bLastSlash, bLastPart) {
			var iSlashIndex = bLastSlash ? sPath.lastIndexOf("/") : sPath.indexOf("/");

			if (iSlashIndex === -1) {
				return sPath;
			}
			return bLastPart ? sPath.substring(iSlashIndex + 1, sPath.length) : sPath.substring(0, iSlashIndex);
		}

		function _fetchPropertyInfo(oBindingContext, sNavigationPath) {
			var oMetaModel = oBindingContext.getModel(),
				sBindingPath = oBindingContext.getPath(),
				oNavigationContext = oMetaModel.createBindingContext(sBindingPath + "/" + sNavigationPath),
				sLabel = CommonHelper.getLabel(oNavigationContext),
				sDescription = null, // TODO this was erroneous - better having it empty for now
				sPath = CommonHelper.getIdentifyingName(oNavigationContext),
				sGroupPath = _sliceAtSlash(sPath, true),
				bInGroup = sGroupPath != sPath,
				sGroupLabel = bInGroup ? CommonHelper.getLabel(oBindingContext, sGroupPath) : null,
				bFilterable = CommonHelper.isPropertyFilterable(sPath, { context: oNavigationContext }),
				bHidden = oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.Hidden"),
				vType = oNavigationContext.getProperty("$kind") && oNavigationContext.getProperty("$Type"),
				bComplexType = vType && vType.indexOf("Edm.") !== 0;

			if (bHidden || bComplexType) {
				return null;
			}

			return {
				name: sPath,
				path: sPath,
				metadataPath: sNavigationPath,
				groupLabel: sGroupLabel,
				group: bInGroup ? sGroupPath : null,
				label: sLabel,
				description: sDescription || sLabel,
				maxLength: oNavigationContext.$MaxLength,
				precision: oNavigationContext.$Precision,
				scale: oNavigationContext.$Scale,
				type: oNavigationContext.$Type,
				filterable: bFilterable,
				sortable: true
			};
		}

		function _fetchLineItemProperties(oBindingContext) {
			var sBindingPath = oBindingContext.getPath(),
				oMetaModel = oBindingContext.getModel(),
				fnIsAlreadyProcessed = function(oFetchedProperty) {
					return oFetchedProperty.name === this.name;
				};
			return oMetaModel.requestObject(sBindingPath + "/@com.sap.vocabularies.UI.v1.LineItem").then(function(aLineItemInfos) {
				return aLineItemInfos
					.map(function(oDataField, iIndex) {
						switch (oDataField.$Type) {
							case "com.sap.vocabularies.UI.v1.DataField":
							case "com.sap.vocabularies.UI.v1.DataFieldDefault":
								return _fetchPropertyInfo(oBindingContext, "@com.sap.vocabularies.UI.v1.LineItem/" + iIndex, oMetaModel);
							// TODO the following should be added when we actually fully support those
							case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
							case "com.sap.vocabularies.UI.v1.DataPoint":
							case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
							default:
								return null;
						}
					})
					.filter(function(oPropertyInfo) {
						// filter out empty property info
						return !!oPropertyInfo;
					})
					.filter(function(oPropertyInfo, iIndex, aArray) {
						// in case a line-item refers to the same property or annotation (therefore having the same name), only the first should be considered
						return !aArray.slice(0, iIndex).some(fnIsAlreadyProcessed.bind(oPropertyInfo));
					});
			});
		}

		function _fetchPropertiesForEntity(sBindingPath, oMetaModel) {
			// when fetching properties, this binding context is needed - so lets create it only once and use if for all properties/data-fields/line-items
			var oBindingContext = oMetaModel.createBindingContext(sBindingPath);
			return _fetchLineItemProperties(oBindingContext).then(function(aFetchedProperties) {
				return Promise.all([
					DelegateUtil.fetchPropertiesForEntity(sBindingPath, oMetaModel),
					DelegateUtil.fetchAnnotationsForEntity(sBindingPath, oMetaModel)
				]).then(function(aResults) {
					// DraftAdministrativeData does not work via 'entitySet/$NavigationPropertyBinding/DraftAdministrativeData'
					if (!aResults[0] && !aResults[1]) {
						return Promise.resolve(aFetchedProperties);
					}
					var oEntityType = aResults[0],
						mEntitySetAnnotations = aResults[1],
						aSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {},
						aNonSortableProperties = (aSortRestrictions["NonSortableProperties"] || []).map(function(oCollection) {
							return oCollection["$PropertyPath"];
						}),
						oObj,
						oPropertyInfo,
						fnIsAlreadyProcessed = function(oFetchedProperty) {
							return oFetchedProperty.name === oPropertyInfo.name;
						};

					for (var sKey in oEntityType) {
						oObj = oEntityType[sKey];
						if (oObj && oObj.$kind === "Property") {
							oPropertyInfo = _fetchPropertyInfo(oBindingContext, sKey);
							if (oPropertyInfo) {
								if (!aFetchedProperties.some(fnIsAlreadyProcessed)) {
									aFetchedProperties.push(oPropertyInfo);
								}
								oPropertyInfo.sortable = oPropertyInfo.sortable && aNonSortableProperties.indexOf(sKey) === -1;
							}
						}
					}

					return aFetchedProperties;
				});
			});
		}

		function _getCachedPropertiesForEntity(oTable) {
			return oTable.data(FETCHED_PROPERTIES_DATA_KEY);
		}

		function _getCachedOrFetchPropertiesForEntity(oTable, sEntitySetPath, oMetaModel) {
			var aFetchedProperties = _getCachedPropertiesForEntity(oTable);

			if (aFetchedProperties) {
				return Promise.resolve(aFetchedProperties);
			}
			return _fetchPropertiesForEntity(sEntitySetPath, oMetaModel).then(function(aFetchedProperties) {
				oTable.data(FETCHED_PROPERTIES_DATA_KEY, aFetchedProperties);
				return aFetchedProperties;
			});
		}

		ODataTableDelegate.rebindTable = function(oTable, oBindingInfo, sSearchText) {
			var aUnboundIBNActions;
			if (oTable.data("unboundIBNActions")) {
				aUnboundIBNActions = oTable.data("unboundIBNActions").split(",");
			}
			if (!oTable.getModel("actionsVisibility") && aUnboundIBNActions) {
				// call getLinks and update the model
				var actionsVisibilityModel = new JSONModel();

				for (var j = 0; j < aUnboundIBNActions.length; j++) {
					actionsVisibilityModel.setProperty("/" + aUnboundIBNActions[j], false);
				}
				oTable.setModel(actionsVisibilityModel, "actionsVisibility");
				TableHelper.updateDataFiledForIBNButtonsVisibility(actionsVisibilityModel);
			}

			if (sSearchText) {
				oBindingInfo.parameters.$search = sSearchText;
			} else {
				delete oBindingInfo.parameters.$search;
			}
			// Cleaning the properties in case there is table rebind : [INTERNAL] Incident 2080022392
			var localUIModel = oTable.getModel("localUI");
			if (localUIModel) {
				var sTableId = oTable.getId().split("--")[1];
				localUIModel.setProperty("/$contexts/" + sTableId + "/deleteEnabled", false);
				localUIModel.setProperty("/$contexts/" + sTableId + "/numberOfSelectedContexts", 0);
				localUIModel.setProperty("/$contexts/" + sTableId + "/selectedContexts", []);
				localUIModel.setProperty("/$contexts/" + sTableId + "/deletableContexts", []);
			}
			TableDelegate.rebindTable(oTable, oBindingInfo, sSearchText);
		};

		/**
		 * Fetches the relevant metadata for the table and returns property info array
		 *
		 * @param {Object} oTable - instance of the mdc Table
		 * @returns {Array} array of property info
		 */
		ODataTableDelegate.fetchProperties = function(oTable) {
			return DelegateUtil.fetchModel(oTable).then(function(oModel) {
				if (!oModel) {
					return [];
				}
				return _getCachedOrFetchPropertiesForEntity(oTable, oTable.data("targetCollectionName"), oModel.getMetaModel());
			});
		};

		ODataTableDelegate.updateBindingInfo = function(oMetadataInfo, oBindingInfo) {
			/**
			 * TODO: binding info needs to be suspended at the begining and when the first bindRows is called
			 * To avoid duplicate requests
			 * To avoid no requests
			 */
			if (oBindingInfo.binding && !oBindingInfo.binding.isSuspended()) {
				oBindingInfo.suspended = false;
			}

			TableDelegate.updateBindingInfo.call(TableDelegate, oMetadataInfo, oBindingInfo);
		};

		ODataTableDelegate.beforeAddColumnFlex = function(sPropertyInfoName, oTable, mPropertyBag) {
			var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel(),
				oModifier = mPropertyBag.modifier,
				bIsXML = oModifier.targets === "xmlTree",
				sTableId = oModifier.getId(oTable),
				oController = (!bIsXML && mPropertyBag.view && mPropertyBag.view.getController()) || undefined,
				sPath,
				oValueHelp,
				oTableContext,
				oColumn;

			// fall-back
			if (!oMetaModel) {
				return Promise.resolve(null);
			}

			sPath = DelegateUtil.getCustomDataProperty("targetCollectionName", oTable, oModifier);

			oTableContext = oMetaModel.createBindingContext(sPath);

			// 1. check if this column has value help
			// 2. check if there is already a value help existing which can be re-used for the new column added
			var sProperty = sPath + "/" + sPropertyInfoName,
				oPropertyContext = oMetaModel.createBindingContext(sProperty);

			oValueHelp = DelegateUtil.checkValueHelp({
				sPropertyName: sPropertyInfoName,
				sBindingPath: sPath,
				sVHIdPrefix: "TableVH",
				oControl: oTable,
				oMetaModel: oMetaModel,
				oModifier: oModifier
			}).then(function(bValueHelpRequired) {
				if (bValueHelpRequired) {
					return fnTemplateValueHelp("sap.fe.macros.table.ValueHelp");
				}
				return Promise.resolve();
			});

			function fnTemplateValueHelp(sFragmentName) {
				var oThis = new JSONModel({
						id: sTableId
					}),
					oPreprocessorSettings = {
						bindingContexts: {
							"collection": oTableContext,
							"item": oPropertyContext,
							"this": oThis.createBindingContext("/")
						},
						models: {
							"this": oThis,
							"collection": oMetaModel,
							"item": oMetaModel
						}
					};

				return DelegateUtil.templateControlFragment(
					sFragmentName,
					oPreprocessorSettings,
					undefined,
					oModifier.targets === "xmlTree"
				).then(function(oValueHelp) {
					if (oValueHelp) {
						oModifier.insertAggregation(oTable, "dependents", oValueHelp, 0);
					}
				});
			}

			function fnTemplateFragment(sFragmentName, oHandler) {
				var oThis = new JSONModel({
						editMode: "{" + DelegateUtil.getCustomDataProperty("editModePropertyBinding", oTable, oModifier) + "}",
						onCallAction: DelegateUtil.getCustomDataProperty("onCallAction", oTable, oModifier),
						tableType: DelegateUtil.getCustomDataProperty("tableType", oTable, oModifier),
						onChange: DelegateUtil.getCustomDataProperty("onChange", oTable, oModifier),
						parentControl: "Table",
						id: sTableId,
						navigationPropertyPath: sPropertyInfoName
					}),
					oPreprocessorSettings = {
						bindingContexts: {
							"collection": oTableContext,
							"dataField": oPropertyContext,
							"this": oThis.createBindingContext("/")
						},
						models: {
							"this": oThis,
							"collection": oMetaModel,
							"dataField": oMetaModel
						}
					};

				return DelegateUtil.templateControlFragment(
					sFragmentName,
					oPreprocessorSettings,
					oHandler,
					oModifier.targets === "xmlTree"
				);
			}

			oColumn = oValueHelp.then(fnTemplateFragment.bind(this, "sap.fe.macros.table.ColumnProperty", oController));
			return oColumn;
		};

		return ODataTableDelegate;
	},
	/* bExport= */ false
);
