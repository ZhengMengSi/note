/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the FilterBar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/FilterBarDelegate",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/StableIdHelper",
		"sap/fe/macros/field/FieldHelper",
		"sap/base/util/ObjectPath",
		"sap/ui/mdc/odata/v4/FieldBaseDelegate",
		"sap/ui/model/odata/type/String",
		"sap/fe/macros/ResourceModel",
		"sap/base/util/merge"
	],
	function(
		FilterBarDelegate,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment,
		JSONModel,
		CommonHelper,
		StableIdHelper,
		FieldHelper,
		ObjectPath,
		FieldBaseDelegate,
		StringType,
		ResourceModel,
		mergeObjects
	) {
		"use strict";
		var NS_MACRODATA = "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
			ODataFilterBarDelegate = Object.assign({}, FilterBarDelegate),
			aVisitedEntityTypes = [],
			mDefaultTypeForEdmType = {
				"Edm.Boolean": "Bool",
				"Edm.Byte": "Int",
				"Edm.DateTime": "Date",
				"Edm.DateTimeOffset": "DateTimeOffset",
				"Edm.Decimal": "Decimal",
				"Edm.Double": "Float",
				"Edm.Float": "Float",
				"Edm.Guid": "Guid",
				"Edm.Int16": "Int",
				"Edm.Int32": "Int",
				"Edm.Int64": "Int",
				"Edm.SByte": "Int",
				"Edm.Single": "Float",
				"Edm.String": "String",
				"Edm.Time": "TimeOfDay"
			},
			EDIT_STATE_PROPERTY_NAME = "$editState";

		function _isMultiValue(oProperty) {
			var bIsMultiValue = true;

			//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

			switch (oProperty.filterExpression) {
				case "SearchExpression":
				case "SingleRange":
				case "SingleValue":
					bIsMultiValue = false;
					break;
			}

			if (oProperty.type && oProperty.type.indexOf("Boolean") > 0) {
				bIsMultiValue = false;
			}

			return bIsMultiValue;
		}

		function _getEditStateFilterPropertyInfo() {
			return {
				name: EDIT_STATE_PROPERTY_NAME,
				path: EDIT_STATE_PROPERTY_NAME,
				groupLabel: null,
				group: null,
				label: ResourceModel.getText("filterbar.EDITING_STATUS"),
				tooltip: null,
				hiddenFilter: false,
				type: "sap.ui.model.odata.type.String",
				baseType: new StringType(),
				defaultFilterConditions: [
					{
						fieldPath: "$editState",
						operator: "DRAFT_EDIT_STATE",
						values: ["0"]
					}
				]
			};
		}

		function fnTemplateEditState(oFilterBar) {
			var mThis = {
				id: oFilterBar.data("localId"),
				draftEditStateModelName: oFilterBar.data("draftEditStateModelName")
			};

			return _templateFragment("sap.fe.macros.filter.EditState", mThis, {
				models: {
					"this.i18n": ResourceModel.getModel()
				}
			});
		}

		function _templateFragment(sFragmentName, mThis, mSettings) {
			var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
				oThis = new JSONModel(mThis);

			mSettings = mergeObjects({}, mSettings, {
				bindingContexts: {
					"this": oThis.createBindingContext("/")
				},
				models: {
					"this": oThis
				}
			});

			return XMLPreprocessor.process(
				oFragment,
				{ name: sFragmentName },
				{
					bindingContexts: mSettings.bindingContexts,
					models: mSettings.models
				}
			).then(function(oFragment) {
				if (mSettings.isXml) {
					return oFragment.firstElementChild;
				}
				return Fragment.load({ definition: oFragment });
			});
		}

		function _fetchPropertyInfo(oProperty, sNavigationProperty, sKey, sBindingPath, oMetaModel) {
			var oPropertyAnnotations = oMetaModel.getObject(sNavigationProperty + "/" + sKey + "@"),
				oFilterDefaultValue,
				oFilterDefaultValueAnnotation,
				bIsHidden,
				bIsHiddenFilter,
				bIsComplexType,
				bIsDigitSequence,
				oConstraints,
				oPropertyInfo,
				sGroupLabel =
					sNavigationProperty !== sBindingPath
						? oMetaModel.getObject(sNavigationProperty + "@com.sap.vocabularies.Common.v1.Label") ||
						  oMetaModel.getObject(sNavigationProperty + "/@com.sap.vocabularies.Common.v1.Label") ||
						  oMetaModel.getObject(sNavigationProperty + "@sapui.name")
						: "",
				sLabel = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sKey,
				sPath = sNavigationProperty.substr(sBindingPath.length);

			// check if hidden
			bIsHidden = CommonHelper.getBoolAnnotationValue(oPropertyAnnotations["@com.sap.vocabularies.UI.v1.Hidden"]);

			// check if complex type eg. field control, messages
			bIsComplexType = oProperty.$Type && oProperty.$Type.indexOf("Edm.") !== 0;
			if (bIsHidden || bIsComplexType) {
				return false;
			}

			//check if hidden filter
			bIsHiddenFilter = CommonHelper.getBoolAnnotationValue(oPropertyAnnotations["@com.sap.vocabularies.UI.v1.HiddenFilter"]);

			// check digit sequence
			bIsDigitSequence = CommonHelper.getBoolAnnotationValue(oPropertyAnnotations["@com.sap.vocabularies.Common.v1.IsDigitSequence"]);

			// handle constraints
			if (oProperty.$MaxLength || oProperty.$Precision || oProperty.$Scale || bIsDigitSequence) {
				oConstraints = {};
				if (oProperty.$MaxLength) {
					oConstraints.maxLength = oProperty.$MaxLength;
				}
				if (oProperty.$Precision) {
					oConstraints.precision = oProperty.$Precision;
				}
				if (oProperty.$Scale) {
					oConstraints.scale = oProperty.$Scale;
				}
				if (bIsDigitSequence) {
					oConstraints.isDigitSequence = bIsDigitSequence;
				}
			} else {
				oConstraints = null;
			}

			oFilterDefaultValueAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.FilterDefaultValue"];
			if (oFilterDefaultValueAnnotation) {
				oFilterDefaultValue = oFilterDefaultValueAnnotation["$" + mDefaultTypeForEdmType[oProperty.$Type]];
			}

			// /_NavigationProperty1/_NavigationProperty2/Property
			if (sPath.indexOf("/") === 0) {
				sPath = sPath.substr(1);
			}

			// Show the labels of previous two navigations if there
			var sFirstLabel, sSecondLabel, sSecondToLastNavigation;
			if (sPath.split("/").length > 1) {
				sSecondToLastNavigation = sBindingPath + "/" + sPath.substr(0, sPath.lastIndexOf("/"));
				sFirstLabel =
					oMetaModel.getObject(sSecondToLastNavigation + "@com.sap.vocabularies.Common.v1.Label") ||
					oMetaModel.getObject(sSecondToLastNavigation + "/@com.sap.vocabularies.Common.v1.Label");
				sSecondLabel = sGroupLabel;
				sGroupLabel = sFirstLabel + " > " + sSecondLabel;
			}

			if (sPath) {
				sPath = sPath + "/";
			}
			sPath = sPath + sKey;

			oPropertyInfo = {
				name: sPath,
				path: sPath,
				groupLabel: sGroupLabel || null,
				group: sNavigationProperty,
				label: sLabel,
				tooltip: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.QuickInfo"] || null,
				hiddenFilter: bIsHiddenFilter,
				type: FieldBaseDelegate.getDataTypeClass({}, oProperty.$Type)
			};

			if (oProperty.$Type === "Edm.DateTimeOffset") {
				if (!oConstraints) {
					oConstraints = {};
				}

				oConstraints.V4 = true;
			}

			if (oConstraints) {
				oPropertyInfo.constraints = oConstraints;
			}

			if (oFilterDefaultValue) {
				oPropertyInfo.defaultFilterConditions = [
					{
						fieldPath: sKey,
						operator: "EQ",
						values: [oFilterDefaultValue]
					}
				];
			}

			var vDataType = ObjectPath.get(oPropertyInfo.type || "");
			if (vDataType) {
				oPropertyInfo.baseType = new vDataType(oPropertyInfo.formatOptions, oPropertyInfo.constraints);
			}

			return oPropertyInfo;
		}

		function _fetchPropertiesForEntity(sEntitySetPath, sNavigationProperty, sBindingPath, oMetaModel) {
			return Promise.all([oMetaModel.requestObject(sEntitySetPath + "/"), oMetaModel.requestObject(sEntitySetPath + "@")]).then(
				function(aResults) {
					var oEntityType = aResults[0],
						mEntitySetAnnotations = aResults[1];
					if (!oEntityType) {
						return Promise.resolve([]);
					}
					var oObj,
						oPropertyInfo,
						aFetchedProperties = [],
						aNonFilterableProps = [],
						aRequiredProps = [],
						aSelectionFields = [],
						mAllowedExpressions = {},
						oAnnotation = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];

					if (oAnnotation) {
						if (oAnnotation.NonFilterableProperties) {
							aNonFilterableProps = oAnnotation.NonFilterableProperties.map(function(oProperty) {
								return oProperty.$PropertyPath;
							});
						}

						if (oAnnotation.RequiredProperties) {
							aRequiredProps = oAnnotation.RequiredProperties.map(function(oProperty) {
								return oProperty.$PropertyPath;
							});
						}

						if (oAnnotation.FilterExpressionRestrictions) {
							oAnnotation.FilterExpressionRestrictions.forEach(function(oProperty) {
								//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
								mAllowedExpressions[oProperty.Property.$PropertyPath] = oProperty.AllowedExpressions;
							});
						}
					}

					// find selection fields
					oAnnotation = oMetaModel.getObject(sEntitySetPath + "/" + "@com.sap.vocabularies.UI.v1.SelectionFields");
					if (oAnnotation) {
						aSelectionFields = oAnnotation.map(function(oProperty) {
							return oProperty.$PropertyPath;
						});
					}

					for (var sKey in oEntityType) {
						oObj = oEntityType[sKey];
						if (oObj) {
							if (oObj.$kind === "Property") {
								// skip non-filterable property
								if (aNonFilterableProps.indexOf(sKey) >= 0) {
									continue;
								}
								oPropertyInfo = _fetchPropertyInfo(oObj, sNavigationProperty, sKey, sBindingPath, oMetaModel);
								if (oPropertyInfo !== false) {
									oPropertyInfo.required = aRequiredProps.indexOf(sKey) >= 0;
									oPropertyInfo.visible = aSelectionFields.indexOf(sKey) >= 0;
									if (mAllowedExpressions[sKey]) {
										oPropertyInfo.filterExpression = mAllowedExpressions[sKey];
									} else {
										oPropertyInfo.filterExpression = "auto"; // default
									}
									oPropertyInfo.maxConditions = _isMultiValue(oPropertyInfo) ? -1 : 1;

									aFetchedProperties.push(oPropertyInfo);
								}
							}
						}
					}
					return aFetchedProperties;
				}
			);
		}

		function _retrieveModel() {
			this.filterBar.detachModelContextChange(_retrieveModel, this);
			var sModelName = this.modelName,
				oModel = this.filterBar.getModel(sModelName);

			if (oModel) {
				this.resolve(oModel);
			} else {
				this.filterBar.attachModelContextChange(_retrieveModel, this);
			}
		}

		function _waitForPropagatedModel(oFilterBar) {
			return new Promise(function(resolve, reject) {
				var sModelName = oFilterBar.getDelegate().payload && oFilterBar.getDelegate().payload.modelName,
					oContext = { modelName: sModelName, filterBar: oFilterBar, resolve: resolve };
				_retrieveModel.call(oContext);
			});
		}

		/**
		 * Method responsible for providing information about current filter field added to filter bar via 'Adapt Filters' UI.
		 * @param sPropertyName {string} Name of the property being added as filter field
		 * @param oFilterBar {object}	FilterBar control instance
		 * @param mPropertyBag {map}	Instance of property bag from Flex change API
		 * @returns {Promise} once resolved a filter field definition is returned
		 */
		ODataFilterBarDelegate.beforeAddFilterFlex = function(sPropertyName, oFilterBar, mPropertyBag) {
			if (sPropertyName === EDIT_STATE_PROPERTY_NAME) {
				return fnTemplateEditState(oFilterBar);
			}

			var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel(),
				oModifier = mPropertyBag.modifier,
				bIsXml = oModifier.targets === "xmlTree",
				sEntitySetPath;

			if (!oMetaModel) {
				return Promise.resolve(null);
			}

			if (bIsXml) {
				sEntitySetPath = "/" + oFilterBar.getAttributeNS(NS_MACRODATA, "entitySet");
			} else {
				sEntitySetPath = "/" + oFilterBar.data("entitySet");
			}

			var sPropertyPath = sEntitySetPath + "/" + sPropertyName,
				vhIdPrefix,
				idPrefix,
				sNavigationPrefix = sPropertyName.indexOf("/") >= 0 ? sPropertyName.substring(0, sPropertyName.lastIndexOf("/")) : "";

			idPrefix = sNavigationPrefix
				? StableIdHelper.generate([oModifier.getId(oFilterBar), "FF", sNavigationPrefix])
				: StableIdHelper.generate([oModifier.getId(oFilterBar), "FF"]);

			vhIdPrefix = sNavigationPrefix
				? StableIdHelper.generate([oModifier.getId(oFilterBar), "FFVH", sNavigationPrefix])
				: StableIdHelper.generate([oModifier.getId(oFilterBar), "FFVH"]);

			var oPropertyContext = oMetaModel.createBindingContext(sPropertyPath),
				mTemplateSettings = {
					bindingContexts: {
						"entitySet": oMetaModel.createBindingContext(sEntitySetPath),
						"property": oPropertyContext
					},
					models: {
						"entitySet": oMetaModel,
						"property": oMetaModel
					},
					isXml: bIsXml
				};

			function fnTemplateValueHelp(mSettings) {
				var mThis = {
					idPrefix: vhIdPrefix,
					conditionModel: "$filters>/conditions/" + sPropertyName,
					navigationPrefix: sNavigationPrefix ? "/" + sNavigationPrefix : ""
				};

				return _templateFragment("sap.fe.macros.ValueHelp", mThis, mSettings).then(function(oVHElement) {
					if (oVHElement) {
						oModifier.insertAggregation(oFilterBar, "dependents", oVHElement, 0);
					}
				});
			}

			function fnTemplateFragment(mSettings) {
				var mThis = {
					idPrefix: idPrefix,
					vhIdPrefix: vhIdPrefix,
					propertyPath: sPropertyName,
					navigationPrefix: sNavigationPrefix ? "/" + sNavigationPrefix : ""
				};

				return _templateFragment("sap.fe.macros.FilterField", mThis, mSettings);
			}

			return Promise.all([
				oMetaModel.requestObject(sPropertyPath + "@com.sap.vocabularies.Common.v1.ValueListReferences"),
				oMetaModel.requestObject(sPropertyPath + "@com.sap.vocabularies.Common.v1.ValueListMapping"),
				oMetaModel.requestObject(sPropertyPath + "@com.sap.vocabularies.Common.v1.ValueList")
			])
				.then(function(aResults) {
					var oValueHelp = Promise.resolve();
					var bSupportsValueHelp = aResults[0] || aResults[1] || aResults[2];
					if (bSupportsValueHelp) {
						var sValueHelpProperty = FieldHelper.valueHelpProperty(oPropertyContext),
							sName =
								sPropertyName.indexOf("/") >= 0
									? sPropertyName.substring(sPropertyName.lastIndexOf("/") + 1)
									: sPropertyName,
							sGeneratedId = StableIdHelper.generate([vhIdPrefix, sName]);

						if (sPropertyPath !== sValueHelpProperty) {
							sGeneratedId = StableIdHelper.generate([sGeneratedId, sValueHelpProperty]);
						}

						var bValueHelpExists = oModifier.getAggregation(oFilterBar, "dependents").some(function(oDependent) {
							return oModifier.getId(oDependent) === sGeneratedId;
						});

						if (!bValueHelpExists) {
							oValueHelp = fnTemplateValueHelp(mTemplateSettings);
						}
					}
					return oValueHelp;
				})
				.then(fnTemplateFragment.bind(this, mTemplateSettings));
		};

		/**
		 * Fetches the relevant metadata for the filter bar and returns property info array.
		 * @param {sap.ui.mdc.FilterBar} oFilterBar - the instance of filter bar
		 * @returns {Promise} once resolved an array of property info is returned
		 */
		ODataFilterBarDelegate.fetchProperties = function(oFilterBar) {
			var sEntitySet = oFilterBar.data("entitySet"),
				sEntitySetPath = "/" + sEntitySet,
				oMetaModel;

			return _waitForPropagatedModel(oFilterBar).then(function(oModel) {
				if (!oModel) {
					return [];
				}

				oMetaModel = oModel.getMetaModel();
				if (oFilterBar.getBindingContext()) {
					sEntitySetPath = CommonHelper.getTargetCollection(oFilterBar.getBindingContext(), sEntitySet);
				}

				//track to avoid circular repeats
				aVisitedEntityTypes.push(oMetaModel.getObject(sEntitySetPath + "/@sapui.name"));
				return _fetchPropertiesForEntity(sEntitySetPath, sEntitySetPath, sEntitySetPath, oMetaModel).then(function(aProperties) {
					if (oFilterBar.data("draftEditStateModelName")) {
						aProperties.push(_getEditStateFilterPropertyInfo());
					}
					return aProperties;
				});
			});
		};

		return ODataFilterBarDelegate;
	},
	/* bExport= */ false
);