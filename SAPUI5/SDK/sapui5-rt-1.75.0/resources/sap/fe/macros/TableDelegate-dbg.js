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
		"sap/ui/mdc/Table",
		"sap/base/util/merge"
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
		MdcTable,
		mergeObjects
	) {
		"use strict";

		// TODO hack/workaround for async issue between MdcFilterBar and MdcTable!
		MdcTable.prototype.rebindTable = function() {
			var oFilter = sap.ui.getCore().byId(this.getFilter()),
				fnWaitPromise = oFilter && (oFilter.waitForInitialFiltersApplied || oFilter.waitForInitialization);

			if (fnWaitPromise) {
				fnWaitPromise.call(oFilter).then(
					function() {
						this.bindRows(this.getRowsBindingInfo() || {});
					}.bind(this)
				);
			} else {
				this.bindRows(this.getRowsBindingInfo() || {});
			}
		};

		var NS_MACRODATA = "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1";
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

		function _getPropertyPathAndName(oDataField) {
			var iNavigationPathIndex = (oDataField.Value && oDataField.Value.$Path && oDataField.Value.$Path.lastIndexOf("/")) || -1,
				sNavigationPath = iNavigationPathIndex === -1 ? "" : oDataField.Value.$Path.substring(0, iNavigationPathIndex),
				sPropertyName = iNavigationPathIndex === -1 ? "" : oDataField.Value.$Path.substring(iNavigationPathIndex + 1);

			return {
				path: sNavigationPath,
				name: sPropertyName
			};
		}

		function _fetchAllPropertyInfo(oContext, sNavigationProperty, sKey, sBindingPath, oMetaModel) {
			var mPropertyInfo;
			if (!("$kind" in oContext)) {
				var mPropertyPathAndName = _getPropertyPathAndName(oContext);

				mPropertyInfo = _fetchPropertyInfo(
					oMetaModel.getObject(
						sBindingPath + "/" + (mPropertyPathAndName.path ? mPropertyPathAndName.path + "/" : "") + mPropertyPathAndName.name
					),
					mPropertyPathAndName.path,
					mPropertyPathAndName.name,
					sBindingPath,
					oMetaModel
				);
			} else {
				mPropertyInfo = _fetchPropertyInfo(oContext, sNavigationProperty, sKey, sBindingPath, oMetaModel);
			}

			return mPropertyInfo;
		}

		function _fetchPropertyInfo(oProperty, sNavigationProperty, sKey, sBindingPath, oMetaModel) {
			var sPath = (sNavigationProperty ? sNavigationProperty + "/" : "") + sKey,
				oPropertyAnnotations = oMetaModel.getObject(sBindingPath + "/" + sPath + "@"),
				bIsHidden = false,
				bIsComplexType = false,
				// label on navigation property, fall-back label on entity type of navigation property target
				sGroupLabel = sNavigationProperty
					? oMetaModel.getObject(sBindingPath + "/" + sNavigationProperty + "@com.sap.vocabularies.Common.v1.Label") ||
					  oMetaModel.getObject(sBindingPath + "/" + sNavigationProperty + "/@com.sap.vocabularies.Common.v1.Label") ||
					  oMetaModel.getObject(sBindingPath + "/" + sNavigationProperty + "@sapui.name")
					: "",
				sLabel = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sKey;

			// check if hidden
			bIsHidden = oPropertyAnnotations["@com.sap.vocabularies.UI.v1.Hidden"] || false;
			bIsHidden = bIsHidden === true || (bIsHidden && bIsHidden["Bool"] !== "false");
			// check if complex type eg. field control, messages
			bIsComplexType = oProperty.$Type && oProperty.$Type.indexOf("Edm.") !== 0;
			if (bIsHidden || bIsComplexType) {
				return false;
			}

			return {
				name: sPath,
				path: sPath,
				groupLabel: sGroupLabel || null,
				group: sNavigationProperty,
				label: sLabel,
				description:
					oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
					oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path,
				maxLength: oProperty.$MaxLength,
				precision: oProperty.$Precision,
				scale: oProperty.$Scale,
				type: oProperty.$Type,
				filterable: true
			};
		}

		function _fetchLineItemProperties(sBindingPath, oMetaModel) {
			return oMetaModel.requestObject(sBindingPath + "/@com.sap.vocabularies.UI.v1.LineItem").then(function(aLineItemInfos) {
				return aLineItemInfos
					.filter(function(oDataField) {
						switch (oDataField.$Type) {
							case "com.sap.vocabularies.UI.v1.DataField":
							case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
							case "com.sap.vocabularies.UI.v1.DataFieldDefault":
							case "com.sap.vocabularies.UI.v1.DataPoint": // TODO check
								return true;
							// TODO for later
							case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
							default:
								return false;
						}
					})
					.map(function(oDataField) {
						return _fetchAllPropertyInfo(oDataField, null, null, sBindingPath, oMetaModel);
					});
			});
		}

		function _fetchPropertiesForEntity(sEntitySetPath, sNavigationProperty, sBindingPath, oMetaModel) {
			return Promise.all([
				oMetaModel.requestObject(sEntitySetPath + "/"),
				oMetaModel.requestObject(sEntitySetPath + "@"),
				_fetchLineItemProperties(sBindingPath, oMetaModel)
			]).then(function(aResults) {
				// DraftAdministrativeData does not work via 'entitySet/$NavigationPropertyBinding/DraftAdministrativeData'
				if (!aResults[0] && !aResults[1]) {
					return Promise.resolve([]);
				}
				var oEntityType = aResults[0],
					mEntitySetAnnotations = aResults[1],
					aSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {},
					aNonSortableProperties = (aSortRestrictions["NonSortableProperties"] || []).map(function(oCollection) {
						return oCollection["$PropertyPath"];
					}),
					oObj,
					oPropertyInfo,
					aFetchedProperties = aResults[2],
					fnIsAlreadyProcessed = function(oFetchedProperty) {
						return oFetchedProperty.path === oPropertyInfo.path;
					};

				for (var sKey in oEntityType) {
					oObj = oEntityType[sKey];
					if (oObj && oObj.$kind === "Property") {
						oPropertyInfo = _fetchAllPropertyInfo(oObj, sNavigationProperty, sKey, sBindingPath, oMetaModel);
						if (oPropertyInfo !== false) {
							if (aFetchedProperties.some(fnIsAlreadyProcessed)) {
								continue;
							}
							oPropertyInfo.sortable = aNonSortableProperties.indexOf(sKey) == -1;
							aFetchedProperties.push(oPropertyInfo);
						}
					}
				}

				return aFetchedProperties;
			});
		}

		ODataTableDelegate.rebindTable = function(oTable, oBindingInfo, sSearchText) {
			if (sSearchText) {
				oBindingInfo.parameters.$search = sSearchText;
			} else {
				delete oBindingInfo.parameters.$search;
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
			var oMetadataInfo = oTable.getDelegate() && oTable.getDelegate().payload,
				sEntitySetPath,
				oModel,
				oMetaModel;

			sEntitySetPath = oTable.data("targetCollectionName");
			oModel = oTable.getModel(oMetadataInfo.model);
			oMetaModel = oModel.getMetaModel();

			return _fetchPropertiesForEntity(
				sEntitySetPath, //entity set
				"", //complete navigation property path
				sEntitySetPath, //binding path for table
				oMetaModel
			);
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
				bValueHelpExists = false,
				sTableId = oModifier.getId(oTable),
				oController = (!bIsXML && mPropertyBag.view.getController()) || undefined,
				sPath,
				oValueHelp,
				oTableContext,
				oColumn;

			// fall-back
			if (!oMetaModel) {
				return Promise.resolve(null);
			}

			if (bIsXML) {
				sPath = oTable.getAttributeNS(NS_MACRODATA, "targetCollectionName");
			} else {
				sPath = oTable.data("targetCollectionName");
			}

			oTableContext = oMetaModel.createBindingContext(sPath);

			// 1. check if this column has value help
			// 2. check if there is already a value help existing which can be re-used for the new column added
			var sProperty = sPath + "/" + sPropertyInfoName,
				oPropertyContext = oMetaModel.createBindingContext(sProperty);

			oValueHelp = Promise.all([
				oMetaModel.requestObject(sProperty + "@com.sap.vocabularies.Common.v1.ValueListReferences"),
				oMetaModel.requestObject(sProperty + "@com.sap.vocabularies.Common.v1.ValueListMapping"),
				oMetaModel.requestObject(sProperty + "@com.sap.vocabularies.Common.v1.ValueList")
			]).then(function(aResults) {
				var bSupportsValueHelp = aResults[0] || aResults[1] || aResults[2];
				if (bSupportsValueHelp) {
					var sValueHelpProperty = FieldHelper.valueHelpProperty(oPropertyContext),
						sGeneratedId = StableIdHelper.generate([
							StableIdHelper.generate([oModifier.getId(oTable), "TableVH"]),
							sPropertyInfoName
						]);
					// unit/currency
					if (sValueHelpProperty.indexOf("$Path") > -1) {
						sValueHelpProperty = oMetaModel.getObject(sValueHelpProperty);
					}
					if (sProperty !== sValueHelpProperty) {
						sGeneratedId = StableIdHelper.generate([sGeneratedId, sValueHelpProperty]);
					}
					bValueHelpExists = oModifier.getAggregation(oTable, "dependents").some(function(oDependent) {
						return oModifier.getId(oDependent) === sGeneratedId;
					});
					if (!bValueHelpExists) {
						return fnTemplateValueHelp("sap.fe.macros.table.ValueHelp");
					}
				}
				return Promise.resolve();
			});

			function fnTemplateValueHelp(sFragmentName) {
				var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
					oThis = new JSONModel({
						id: sTableId
					});

				return XMLPreprocessor.process(
					oFragment,
					{ name: sFragmentName },
					{
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
					}
				)
					.then(function(oFragment) {
						var oValueHelp = oFragment.getElementsByTagNameNS("sap.ui.mdc.field", "FieldValueHelp")[0];
						if (!bIsXML && oValueHelp) {
							oValueHelp = Fragment.load({
								definition: oFragment
							});
						}
						return oValueHelp;
					})
					.then(function(oValueHelp) {
						if (oValueHelp) {
							oModifier.insertAggregation(oTable, "dependents", oValueHelp, 0);
						}
					});
			}

			function fnTemplateFragment(sFragmentName, oHandler) {
				var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
					oThis;

				if (bIsXML) {
					oThis = new JSONModel({
						editMode: "{" + oTable.getAttributeNS(NS_MACRODATA, "editModePropertyBinding") + "}",
						onCallAction: oTable.getAttributeNS(NS_MACRODATA, "onCallAction"),
						tableType: oTable.getAttributeNS(NS_MACRODATA, "tableType"),
						parentControl: "Table",
						id: sTableId,
						onChange: oTable.getAttributeNS(NS_MACRODATA, "onChange"),
						navigationPropertyPath: sPropertyInfoName
					});
				} else {
					oThis = new JSONModel({
						editMode: "{" + oTable.data("editModePropertyBinding") + "}",
						onCallAction: oTable.data("onCallAction"),
						tableType: oTable.data("tableType"),
						parentControl: "Table",
						id: sTableId,
						onChange: oTable.data("onChange"),
						navigationPropertyPath: sPropertyInfoName
					});
				}

				return XMLPreprocessor.process(
					oFragment,
					{ name: sFragmentName },
					{
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
					}
				).then(function(oFragment) {
					var oColumn = oFragment.getElementsByTagNameNS("sap.ui.mdc.table", "Column")[0];
					if (bIsXML) {
						return oColumn;
					}
					return Fragment.load({
						definition: oFragment,
						controller: oHandler
					});
				});
			}

			oColumn = oValueHelp.then(fnTemplateFragment.bind(this, "sap.fe.macros.table.ColumnProperty", oController));
			return oColumn;
		};

		return ODataTableDelegate;
	},
	/* bExport= */ false
);
