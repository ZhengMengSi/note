/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/fe/core/CommonUtils", "sap/fe/core/converters/controls/ListReport/FilterBar", "sap/fe/core/converters/ConverterContext", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/SemanticDateOperators", "sap/fe/core/templating/DisplayModeFormatter", "sap/fe/macros/CommonHelper", "sap/fe/macros/DelegateUtil", "sap/fe/macros/ODataMetaModelUtil", "sap/ui/core/Core", "sap/ui/mdc/condition/Condition", "sap/ui/mdc/condition/ConditionConverter", "sap/ui/mdc/enum/ConditionValidated", "sap/ui/mdc/odata/v4/TypeUtil", "sap/ui/mdc/p13n/StateUtil", "sap/ui/mdc/util/FilterUtil", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/odata/v4/ODataUtils"], function (Log, merge, CommonUtils, FilterBarConverter, ConverterContext, MetaModelConverter, ModelHelper, SemanticDateOperators, DisplayModeFormatter, CommonHelper, DelegateUtil, MetaModelUtil, Core, Condition, ConditionConverter, ConditionValidated, TypeUtil, StateUtil, FilterUtil, Filter, FilterOperator, ODataUtils) {
  "use strict";

  var ODATA_TYPE_MAPPING = DisplayModeFormatter.ODATA_TYPE_MAPPING;

  var oFilterUtils = {
    getFilter: function (vIFilter) {
      var aFilters = oFilterUtils.getFilterInfo(vIFilter).filters;
      return aFilters.length ? new Filter(oFilterUtils.getFilterInfo(vIFilter).filters, false) : undefined;
    },
    getFilterField: function (propertyPath, converterContext, entityType) {
      return FilterBarConverter.getFilterField(propertyPath, converterContext, entityType);
    },
    buildProperyInfo: function (propertyInfoField, converterContext) {
      var oPropertyInfo;
      var aTypeConfig = {};
      var propertyConvertyContext = converterContext.getConverterContextFor(propertyInfoField.annotationPath);
      var propertyTargetObject = propertyConvertyContext.getDataModelObjectPath().targetObject;
      var oTypeConfig = FilterBarConverter.fetchTypeConfig(propertyTargetObject);
      oPropertyInfo = FilterBarConverter.fetchPropertyInfo(converterContext, propertyInfoField, oTypeConfig);
      aTypeConfig[propertyInfoField.key] = oTypeConfig;
      oPropertyInfo = FilterBarConverter.assignDataTypeToPropertyInfo(oPropertyInfo, converterContext, [], aTypeConfig);
      return oPropertyInfo;
    },
    createConverterContext: function (oFilterControl, sEntityTypePath, metaModel, appComponent) {
      var sFilterEntityTypePath = DelegateUtil.getCustomData(oFilterControl, "entityType"),
          contextPath = sEntityTypePath || sFilterEntityTypePath;
      var oView = oFilterControl.isA ? CommonUtils.getTargetView(oFilterControl) : null;
      var oMetaModel = metaModel || oFilterControl.getModel().getMetaModel();
      var oAppComponent = appComponent || oView && CommonUtils.getAppComponent(oView);
      var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oMetaModel.createBindingContext(contextPath));
      var manifestSettings;

      if (oFilterControl.isA && !oFilterControl.isA("sap.ui.mdc.filterbar.vh.FilterBar")) {
        manifestSettings = oView && oView.getViewData() || undefined;
      }

      return ConverterContext.createConverterContextForMacro(oVisualizationObjectPath.startingEntitySet.name, oMetaModel, oAppComponent && oAppComponent.getDiagnostics(), merge, oVisualizationObjectPath.contextLocation, manifestSettings);
    },
    getConvertedFilterFields: function (oFilterControl, sEntityTypePath, includeHidden, metaModel, appComponent, oModifier, lineItemTerm) {
      var oMetaModel = this._getFilterMetaModel(oFilterControl, metaModel);

      var sFilterEntityTypePath = DelegateUtil.getCustomData(oFilterControl, "entityType"),
          contextPath = sEntityTypePath || sFilterEntityTypePath;

      var lrTables = this._getFieldsForTable(oFilterControl, sEntityTypePath);

      var oConverterContext = this.createConverterContext(oFilterControl, sEntityTypePath, metaModel, appComponent); //aSelectionFields = FilterBarConverter.getSelectionFields(oConverterContext);

      return this._getSelectionFields(oFilterControl, sEntityTypePath, sFilterEntityTypePath, contextPath, lrTables, oMetaModel, oConverterContext, includeHidden, oModifier, lineItemTerm);
    },
    getBindingPathForParameters: function (oIFilter, mConditions, aFilterPropertiesMetadata, aParameters) {
      var aParams = [];
      aFilterPropertiesMetadata = oFilterUtils.setTypeConfigToProperties(aFilterPropertiesMetadata); // Collecting all parameter values from conditions

      for (var i = 0; i < aParameters.length; i++) {
        var sFieldPath = aParameters[i];

        if (mConditions[sFieldPath] && mConditions[sFieldPath].length > 0) {
          // We would be using only the first condition for parameter value.
          var oConditionInternal = merge({}, mConditions[sFieldPath][0]);
          var oProperty = FilterUtil.getPropertyByKey(aFilterPropertiesMetadata, sFieldPath);
          var oTypeConfig = oProperty.typeConfig || TypeUtil.getTypeConfig(oProperty.dataType, oProperty.formatOptions, oProperty.constraints);
          var mInternalParameterCondition = ConditionConverter.toType(oConditionInternal, oTypeConfig, oIFilter.getTypeUtil());
          var sEdmType = ODATA_TYPE_MAPPING[oTypeConfig.className];
          aParams.push("".concat(sFieldPath, "=").concat(encodeURIComponent(ODataUtils.formatLiteral(mInternalParameterCondition.values[0], sEdmType))));
        }
      } // Binding path from EntityType


      var sEntityTypePath = oIFilter.data("entityType");
      var sEntitySetPath = sEntityTypePath.substring(0, sEntityTypePath.length - 1);
      var sParameterEntitySet = sEntitySetPath.slice(0, sEntitySetPath.lastIndexOf("/"));
      var sTargetNavigation = sEntitySetPath.substring(sEntitySetPath.lastIndexOf("/") + 1); // create parameter context

      return "".concat(sParameterEntitySet, "(").concat(aParams.toString(), ")/").concat(sTargetNavigation);
    },
    getEditStateIsHideDraft: function (mConditions) {
      var bIsHideDraft = false;

      if (mConditions && mConditions.$editState) {
        var oCondition = mConditions.$editState.find(function (condition) {
          return condition.operator === "DRAFT_EDIT_STATE";
        });

        if (oCondition && (oCondition.values.includes("ALL_HIDING_DRAFTS") || oCondition.values.includes("SAVED_ONLY"))) {
          bIsHideDraft = true;
        }
      }

      return bIsHideDraft;
    },

    /**
     * Gets all filters that originate from the MDC FilterBar.
     *
     * @param vIFilter String or object instance related to
     *  - MDC_FilterBar/Table/Chart
     * @param mProperties Properties on filters that are to be retrieved. Available parameters:
     * 	 - ignoredProperties: Array of property names which should be not considered for filtering
     *	 - propertiesMetadata: Array with all the property metadata. If not provided, properties will be retrieved from vIFilter.
     *	 - targetControl: MDC_table or chart. If provided, property names which are not relevant for the target control entitySet are not considered.
     * @param mFilterConditions Map with externalized filter conditions.
     * @returns FilterBar filters and basic search
     * @private
     * @ui5-restricted
     */
    getFilterInfo: function (vIFilter, mProperties, mFilterConditions) {
      var aIgnoreProperties = mProperties && mProperties.ignoredProperties || [];
      var oTargetControl = mProperties && mProperties.targetControl,
          sTargetEntityPath = oTargetControl ? oTargetControl.data("entityType") : undefined;
      var oIFilter = vIFilter,
          sSearch,
          aFilters = [],
          sBindingPath,
          aPropertiesMetadata = mProperties && mProperties.propertiesMetadata;

      if (typeof vIFilter === "string") {
        oIFilter = Core.byId(vIFilter);
      }

      if (oIFilter) {
        sSearch = this._getSearchField(oIFilter, aIgnoreProperties);

        var mConditions = this._getFilterConditions(mProperties, mFilterConditions, oIFilter);

        var aFilterPropertiesMetadata = oIFilter.getPropertyInfoSet ? oIFilter.getPropertyInfoSet() : null;
        aFilterPropertiesMetadata = this._getFilterPropertiesMetadata(aFilterPropertiesMetadata, oIFilter);

        if (mProperties && mProperties.targetControl && mProperties.targetControl.isA("sap.ui.mdc.Chart")) {
          Object.keys(mConditions).forEach(function (sKey) {
            if (sKey === "$editState") {
              delete mConditions["$editState"];
            }
          });
        }

        var aParameters = oIFilter.data("parameters") || [];
        aParameters = typeof aParameters === "string" ? JSON.parse(aParameters) : aParameters;

        if (aParameters && aParameters.length > 0) {
          // Binding path changes in case of parameters.
          sBindingPath = oFilterUtils.getBindingPathForParameters(oIFilter, mConditions, aFilterPropertiesMetadata, aParameters);
        }

        if (mConditions) {
          //Exclude Interface Filter properties that are not relevant for the Target control entitySet
          if (sTargetEntityPath && oIFilter.data("entityType") !== sTargetEntityPath) {
            var oMetaModel = oIFilter.getModel().getMetaModel();
            var aTargetPropertiesMetadata = oIFilter.getControlDelegate().fetchPropertiesForEntity(sTargetEntityPath, oMetaModel, oIFilter);
            aPropertiesMetadata = aTargetPropertiesMetadata;
            var mEntityProperties = {};

            for (var i in aTargetPropertiesMetadata) {
              var oEntityProperty = aTargetPropertiesMetadata[i];
              mEntityProperties[oEntityProperty.name] = {
                "hasProperty": true,
                dataType: oEntityProperty.dataType
              };
            }

            var _aIgnoreProperties = this._getIgnoredProperties(aFilterPropertiesMetadata, mEntityProperties);

            if (_aIgnoreProperties.length > 0) {
              aIgnoreProperties = aIgnoreProperties.concat(_aIgnoreProperties);
            }
          } else if (!aPropertiesMetadata) {
            aPropertiesMetadata = aFilterPropertiesMetadata;
          } // var aParamKeys = [];
          // aParameters.forEach(function (oParam) {
          // 	aParamKeys.push(oParam.key);
          // });


          var oFilter = FilterUtil.getFilterInfo(oIFilter, mConditions, oFilterUtils.setTypeConfigToProperties(aPropertiesMetadata), aIgnoreProperties.concat(aParameters)).filters;
          aFilters = oFilter ? [oFilter] : [];
        }
      }

      return {
        filters: aFilters,
        search: sSearch || undefined,
        bindingPath: sBindingPath
      };
    },
    setTypeConfigToProperties: function (aProperties) {
      if (aProperties && aProperties.length) {
        aProperties.forEach(function (oIFilterProperty) {
          if (oIFilterProperty.typeConfig && oIFilterProperty.typeConfig.typeInstance && oIFilterProperty.typeConfig.typeInstance.getConstraints instanceof Function) {
            return;
          }

          if (oIFilterProperty.path === "$editState") {
            oIFilterProperty.typeConfig = TypeUtil.getTypeConfig("sap.ui.model.odata.type.String", {}, {});
          } else if (oIFilterProperty.path === "$search") {
            oIFilterProperty.typeConfig = TypeUtil.getTypeConfig("sap.ui.model.odata.type.String", {}, {});
          } else if (oIFilterProperty.dataType || oIFilterProperty.typeConfig && oIFilterProperty.typeConfig.className) {
            oIFilterProperty.typeConfig = TypeUtil.getTypeConfig(oIFilterProperty.dataType || oIFilterProperty.typeConfig.className, oIFilterProperty.formatOptions, oIFilterProperty.constraints);
          }
        });
      }

      return aProperties;
    },
    getNotApplicableFilters: function (oFilterBar, oControl) {
      var sTargetEntityTypePath = oControl.data("entityType"),
          oFilterBarEntityPath = oFilterBar.data("entityType"),
          oFilterBarEntitySetAnnotations = oFilterBar.getModel().getMetaModel().getObject(oFilterBarEntityPath),
          aNotApplicable = [],
          mConditions = oFilterBar.getConditions(),
          oMetaModel = oFilterBar.getModel().getMetaModel(),
          bIsFilterBarEntityType = sTargetEntityTypePath === oFilterBar.data("entityType"),
          bIsChart = oControl.isA("sap.ui.mdc.Chart"),
          bIsAnalyticalTable = !bIsChart && oControl.getParent().getTableDefinition().enableAnalytics,
          bEnableSearch = bIsChart ? CommonHelper.parseCustomData(DelegateUtil.getCustomData(oControl, "applySupported")).enableSearch : !bIsAnalyticalTable || oControl.getParent().getTableDefinition().enableAnalyticsSearch;

      if (mConditions && (!bIsFilterBarEntityType || bIsAnalyticalTable || bIsChart)) {
        // We don't need to calculate the difference on property Level if entity sets are identical
        var aTargetProperties = bIsFilterBarEntityType ? [] : oFilterBar.getControlDelegate().fetchPropertiesForEntity(sTargetEntityTypePath, oMetaModel, oFilterBar),
            mTargetProperties = aTargetProperties.reduce(function (mProp, oProp) {
          mProp[oProp.name] = oProp;
          return mProp;
        }, {}),
            mTableAggregates = !bIsChart && oControl.getParent().getTableDefinition().aggregates || {},
            mAggregatedProperties = {};
        Object.keys(mTableAggregates).forEach(function (sAggregateName) {
          var oAggregate = mTableAggregates[sAggregateName];
          mAggregatedProperties[oAggregate.relativePath] = oAggregate;
        });
        var chartEntityTypeAnnotations = oControl.getModel().getMetaModel().getObject(oControl.data("targetCollectionPath") + "/");

        if (oControl.isA("sap.ui.mdc.Chart")) {
          var oEntitySetAnnotations = oControl.getModel().getMetaModel().getObject("".concat(oControl.data("targetCollectionPath"), "@")),
              mChartCustomAggregates = MetaModelUtil.getAllCustomAggregates(oEntitySetAnnotations);
          Object.keys(mChartCustomAggregates).forEach(function (sAggregateName) {
            if (!mAggregatedProperties[sAggregateName]) {
              var oAggregate = mChartCustomAggregates[sAggregateName];
              mAggregatedProperties[sAggregateName] = oAggregate;
            }
          });
        }

        for (var sProperty in mConditions) {
          // Need to check the length of mConditions[sProperty] since previous filtered properties are kept into mConditions with empty array as definition
          var aConditionProperty = mConditions[sProperty];
          var typeCheck = true;

          if (chartEntityTypeAnnotations[sProperty] && oFilterBarEntitySetAnnotations[sProperty]) {
            typeCheck = chartEntityTypeAnnotations[sProperty]["$Type"] === oFilterBarEntitySetAnnotations[sProperty]["$Type"];
          }

          if (Array.isArray(aConditionProperty) && aConditionProperty.length > 0 && ((!mTargetProperties[sProperty] || mTargetProperties[sProperty] && !typeCheck) && (!bIsFilterBarEntityType || sProperty === "$editState" && bIsChart) || mAggregatedProperties[sProperty])) {
            aNotApplicable.push(sProperty.replace(/\+|\*/g, ""));
          }
        }
      }

      if (!bEnableSearch && oFilterBar.getSearch()) {
        aNotApplicable.push("$search");
      }

      return aNotApplicable;
    },

    /**
     * Set the filter values for the given property in the filter bar.
     * The filter values can be either a single value or an array of values.
     * Each filter value must be represented as a primitive value.
     *
     * @param oFilterBar The filter bar that contains the filter field
     * @param sConditionPath The path to the property as a condition path
     * @param  {Object[]} args List of optional parameters
     *  [sOperator] The operator to be used - if not set, the default operator (EQ) will be used
     *  [vValues] The values to be applied - if sOperator is missing, vValues is used as 3rd parameter
     * @private
     */
    setFilterValues: function (oFilterBar, sConditionPath) {
      try {
        function _temp5() {
          return Promise.resolve(StateUtil.applyExternalState(oFilterBar, {
            filter: filter
          })).then(function () {});
        }

        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var sOperator = args === null || args === void 0 ? void 0 : args[0];
        var vValues = args === null || args === void 0 ? void 0 : args[1]; // Do nothing when the filter bar is hidden

        if (!oFilterBar) {
          return Promise.resolve();
        } // common filter Operators need a value. Do nothing if this value is undefined
        // BCP: 2270135274


        if (args.length === 2 && (vValues === undefined || vValues === null || vValues === "") && sOperator && Object.keys(FilterOperator).indexOf(sOperator) !== -1) {
          Log.warning("An empty filter value cannot be applied with the ".concat(sOperator, " operator"));
          return Promise.resolve();
        } // The 4th parameter is optional; if sOperator is missing, vValues is used as 3rd parameter
        // This does not apply for semantic dates, as these do not require vValues (exception: "LASTDAYS", 3)


        if (vValues === undefined && !SemanticDateOperators.getSemanticDateOperations().includes(sOperator || "")) {
          var _sOperator;

          vValues = (_sOperator = sOperator) !== null && _sOperator !== void 0 ? _sOperator : [];
          sOperator = undefined;
        } // If sOperator is not set, use EQ as default


        if (!sOperator) {
          sOperator = FilterOperator.EQ;
        } // Supported array types:
        //  - Single Values:	"2" | ["2"]
        //  - Multiple Values:	["2", "3"]
        //  - Ranges:			["2","3"]
        // Unsupported array types:
        //  - Multiple Ranges:	[["2","3"]] | [["2","3"],["4","5"]]


        var supportedValueTypes = ["string", "number", "boolean"];

        if (vValues !== undefined && (!Array.isArray(vValues) && !supportedValueTypes.includes(typeof vValues) || Array.isArray(vValues) && vValues.length > 0 && !supportedValueTypes.includes(typeof vValues[0]))) {
          throw new Error("FilterUtils.js#_setFilterValues: Filter value not supported; only primitive values or an array thereof can be used.");
        }

        var values;

        if (vValues !== undefined) {
          values = Array.isArray(vValues) ? vValues : [vValues];
        }

        var filter = {};

        var _temp6 = function () {
          if (sConditionPath) {
            var _temp7 = function () {
              if (values && values.length) {
                if (sOperator === FilterOperator.BT) {
                  // The operator BT requires one condition with both thresholds
                  filter[sConditionPath] = [Condition.createCondition(sOperator, values, null, null, ConditionValidated.NotValidated)];
                } else {
                  // Regular single and multi value conditions, if there are no values, we do not want any conditions
                  filter[sConditionPath] = values.map(function (value) {
                    return Condition.createCondition(sOperator, [value], null, null, ConditionValidated.NotValidated);
                  });
                }
              } else {
                var _temp8 = function () {
                  if (!SemanticDateOperators.getSemanticDateOperations().includes(sOperator || "")) {
                    return Promise.resolve(StateUtil.retrieveExternalState(oFilterBar)).then(function (oState) {
                      if (oState.filter[sConditionPath]) {
                        oState.filter[sConditionPath].forEach(function (oCondition) {
                          oCondition.filtered = false;
                        });
                        filter = oState.filter;
                      }
                    });
                  } else {
                    // vValues is undefined, so the operator is a semantic date that does not need values (see above)
                    filter[sConditionPath] = [Condition.createCondition(sOperator, [], null, null, ConditionValidated.NotValidated)];
                  }
                }();

                if (_temp8 && _temp8.then) return _temp8.then(function () {});
              }
            }();

            if (_temp7 && _temp7.then) return _temp7.then(function () {});
          }
        }();

        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    conditionToModelPath: function (sConditionPath) {
      // make the path usable as model property, therefore slashes become backslashes
      return sConditionPath.replace(/\//g, "\\");
    },
    _getFilterMetaModel: function (oFilterControl, metaModel) {
      return metaModel || oFilterControl.getModel().getMetaModel();
    },
    _getEntitySetPath: function (sEntityTypePath) {
      return sEntityTypePath && ModelHelper.getEntitySetPath(sEntityTypePath);
    },
    _getFieldsForTable: function (oFilterControl, sEntityTypePath) {
      var lrTables = [];
      /**
       * Gets fields from
       * 	- direct entity properties,
       * 	- navigateProperties key in the manifest if these properties are known by the entity
       *  - annotation "SelectionFields"
       */

      if (sEntityTypePath) {
        var oView = CommonUtils.getTargetView(oFilterControl);

        var tableControls = oView && oView.oController && oView.oController._getControls && oView.oController._getControls("table"); //[0].getParent().getTableDefinition();


        if (tableControls) {
          tableControls.forEach(function (oTable) {
            lrTables.push(oTable.getParent().getTableDefinition());
          });
        }

        return lrTables;
      }

      return [];
    },
    _getSelectionFields: function (oFilterControl, sEntityTypePath, sFilterEntityTypePath, contextPath, lrTables, oMetaModel, oConverterContext, includeHidden, oModifier, lineItemTerm) {
      var aSelectionFields = FilterBarConverter.getSelectionFields(oConverterContext, lrTables, undefined, includeHidden, lineItemTerm).selectionFields;

      if ((oModifier ? oModifier.getControlType(oFilterControl) === "sap.ui.mdc.FilterBar" : oFilterControl.isA("sap.ui.mdc.FilterBar")) && sEntityTypePath !== sFilterEntityTypePath) {
        /**
         * We are on multi entity sets scenario so we add annotation "SelectionFields"
         * from FilterBar entity if these properties are known by the entity
         */
        var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oMetaModel.createBindingContext(contextPath));
        var oPageContext = oConverterContext.getConverterContextFor(sFilterEntityTypePath);
        var aFilterBarSelectionFieldsAnnotation = oPageContext.getEntityTypeAnnotation("@com.sap.vocabularies.UI.v1.SelectionFields").annotation || [];
        var mapSelectionFields = {};
        aSelectionFields.forEach(function (oSelectionField) {
          mapSelectionFields[oSelectionField.conditionPath] = true;
        });
        aFilterBarSelectionFieldsAnnotation.forEach(function (oFilterBarSelectionFieldAnnotation) {
          var sPath = oFilterBarSelectionFieldAnnotation.value;

          if (!mapSelectionFields[sPath]) {
            var oFilterField = FilterBarConverter.getFilterField(sPath, oConverterContext, oVisualizationObjectPath.startingEntitySet.entityType);

            if (oFilterField) {
              aSelectionFields.push(oFilterField);
            }
          }
        });
      }

      if (aSelectionFields) {
        var fieldNames = [];
        aSelectionFields.forEach(function (oField) {
          fieldNames.push(oField.key);
        });
        aSelectionFields = this._getSelectionFieldsFromPropertyInfos(oFilterControl, fieldNames, aSelectionFields);
      }

      return aSelectionFields;
    },
    _getSelectionFieldsFromPropertyInfos: function (oFilterControl, fieldNames, aSelectionFields) {
      var propertyInfoFields = oFilterControl.getPropertyInfo && oFilterControl.getPropertyInfo() || [];
      propertyInfoFields.forEach(function (oProp) {
        if (oProp.name === "$search" || oProp.name === "$editState") {
          return;
        }

        var selField = aSelectionFields[fieldNames.indexOf(oProp.key)];

        if (fieldNames.indexOf(oProp.key) !== -1 && selField.annotationPath) {
          oProp.group = selField.group;
          oProp.groupLabel = selField.groupLabel;
          oProp.settings = selField.settings;
          oProp.visualFilter = selField.visualFilter;
          oProp.label = selField.label;
          aSelectionFields[fieldNames.indexOf(oProp.key)] = oProp;
        }

        if (fieldNames.indexOf(oProp.key) === -1 && !oProp.annotationPath) {
          aSelectionFields.push(oProp);
        }
      });
      return aSelectionFields;
    },
    _getSearchField: function (oIFilter, aIgnoreProperties) {
      return oIFilter.getSearch && aIgnoreProperties.indexOf("search") === -1 ? oIFilter.getSearch() : null;
    },
    _getFilterConditions: function (mProperties, mFilterConditions, oIFilter) {
      var mConditions = mFilterConditions || oIFilter.getConditions();

      if (mProperties && mProperties.targetControl && mProperties.targetControl.isA("sap.ui.mdc.Chart")) {
        Object.keys(mConditions).forEach(function (sKey) {
          if (sKey === "$editState") {
            delete mConditions["$editState"];
          }
        });
      }

      return mConditions;
    },
    _getFilterPropertiesMetadata: function (aFilterPropertiesMetadata, oIFilter) {
      if (!(aFilterPropertiesMetadata && aFilterPropertiesMetadata.length)) {
        if (oIFilter.getPropertyInfo) {
          aFilterPropertiesMetadata = oIFilter.getPropertyInfo();
        } else {
          aFilterPropertiesMetadata = null;
        }
      }

      return aFilterPropertiesMetadata;
    },
    _getIgnoredProperties: function (aFilterPropertiesMetadata, mEntityProperties) {
      var aIgnoreProperties = [];
      aFilterPropertiesMetadata.forEach(function (oIFilterProperty) {
        var sIFilterPropertyName = oIFilterProperty.name;
        var mEntityPropertiesCurrent = mEntityProperties[sIFilterPropertyName];

        if (mEntityPropertiesCurrent && (!mEntityPropertiesCurrent["hasProperty"] || mEntityPropertiesCurrent["hasProperty"] && oIFilterProperty.dataType !== mEntityPropertiesCurrent.dataType)) {
          aIgnoreProperties.push(sIFilterPropertyName);
        }
      });
      return aIgnoreProperties;
    },
    getFilters: function (filterBar) {
      var _this$getFilterInfo = this.getFilterInfo(filterBar),
          filters = _this$getFilterInfo.filters,
          search = _this$getFilterInfo.search;

      return {
        filters: filters,
        search: search
      };
    }
  };
  return oFilterUtils;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvRmlsdGVyVXRpbHMiLCJnZXRGaWx0ZXIiLCJ2SUZpbHRlciIsImFGaWx0ZXJzIiwiZ2V0RmlsdGVySW5mbyIsImZpbHRlcnMiLCJsZW5ndGgiLCJGaWx0ZXIiLCJ1bmRlZmluZWQiLCJnZXRGaWx0ZXJGaWVsZCIsInByb3BlcnR5UGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJlbnRpdHlUeXBlIiwiRmlsdGVyQmFyQ29udmVydGVyIiwiYnVpbGRQcm9wZXJ5SW5mbyIsInByb3BlcnR5SW5mb0ZpZWxkIiwib1Byb3BlcnR5SW5mbyIsImFUeXBlQ29uZmlnIiwicHJvcGVydHlDb252ZXJ0eUNvbnRleHQiLCJnZXRDb252ZXJ0ZXJDb250ZXh0Rm9yIiwiYW5ub3RhdGlvblBhdGgiLCJwcm9wZXJ0eVRhcmdldE9iamVjdCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJ0YXJnZXRPYmplY3QiLCJvVHlwZUNvbmZpZyIsImZldGNoVHlwZUNvbmZpZyIsImZldGNoUHJvcGVydHlJbmZvIiwia2V5IiwiYXNzaWduRGF0YVR5cGVUb1Byb3BlcnR5SW5mbyIsImNyZWF0ZUNvbnZlcnRlckNvbnRleHQiLCJvRmlsdGVyQ29udHJvbCIsInNFbnRpdHlUeXBlUGF0aCIsIm1ldGFNb2RlbCIsImFwcENvbXBvbmVudCIsInNGaWx0ZXJFbnRpdHlUeXBlUGF0aCIsIkRlbGVnYXRlVXRpbCIsImdldEN1c3RvbURhdGEiLCJjb250ZXh0UGF0aCIsIm9WaWV3IiwiaXNBIiwiQ29tbW9uVXRpbHMiLCJnZXRUYXJnZXRWaWV3Iiwib01ldGFNb2RlbCIsImdldE1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwib0FwcENvbXBvbmVudCIsImdldEFwcENvbXBvbmVudCIsIm9WaXN1YWxpemF0aW9uT2JqZWN0UGF0aCIsIk1ldGFNb2RlbENvbnZlcnRlciIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwibWFuaWZlc3RTZXR0aW5ncyIsImdldFZpZXdEYXRhIiwiQ29udmVydGVyQ29udGV4dCIsImNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyIsInN0YXJ0aW5nRW50aXR5U2V0IiwibmFtZSIsImdldERpYWdub3N0aWNzIiwibWVyZ2UiLCJjb250ZXh0TG9jYXRpb24iLCJnZXRDb252ZXJ0ZWRGaWx0ZXJGaWVsZHMiLCJpbmNsdWRlSGlkZGVuIiwib01vZGlmaWVyIiwibGluZUl0ZW1UZXJtIiwiX2dldEZpbHRlck1ldGFNb2RlbCIsImxyVGFibGVzIiwiX2dldEZpZWxkc0ZvclRhYmxlIiwib0NvbnZlcnRlckNvbnRleHQiLCJfZ2V0U2VsZWN0aW9uRmllbGRzIiwiZ2V0QmluZGluZ1BhdGhGb3JQYXJhbWV0ZXJzIiwib0lGaWx0ZXIiLCJtQ29uZGl0aW9ucyIsImFGaWx0ZXJQcm9wZXJ0aWVzTWV0YWRhdGEiLCJhUGFyYW1ldGVycyIsImFQYXJhbXMiLCJzZXRUeXBlQ29uZmlnVG9Qcm9wZXJ0aWVzIiwiaSIsInNGaWVsZFBhdGgiLCJvQ29uZGl0aW9uSW50ZXJuYWwiLCJvUHJvcGVydHkiLCJGaWx0ZXJVdGlsIiwiZ2V0UHJvcGVydHlCeUtleSIsInR5cGVDb25maWciLCJUeXBlVXRpbCIsImdldFR5cGVDb25maWciLCJkYXRhVHlwZSIsImZvcm1hdE9wdGlvbnMiLCJjb25zdHJhaW50cyIsIm1JbnRlcm5hbFBhcmFtZXRlckNvbmRpdGlvbiIsIkNvbmRpdGlvbkNvbnZlcnRlciIsInRvVHlwZSIsImdldFR5cGVVdGlsIiwic0VkbVR5cGUiLCJPREFUQV9UWVBFX01BUFBJTkciLCJjbGFzc05hbWUiLCJwdXNoIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiT0RhdGFVdGlscyIsImZvcm1hdExpdGVyYWwiLCJ2YWx1ZXMiLCJkYXRhIiwic0VudGl0eVNldFBhdGgiLCJzdWJzdHJpbmciLCJzUGFyYW1ldGVyRW50aXR5U2V0Iiwic2xpY2UiLCJsYXN0SW5kZXhPZiIsInNUYXJnZXROYXZpZ2F0aW9uIiwidG9TdHJpbmciLCJnZXRFZGl0U3RhdGVJc0hpZGVEcmFmdCIsImJJc0hpZGVEcmFmdCIsIiRlZGl0U3RhdGUiLCJvQ29uZGl0aW9uIiwiZmluZCIsImNvbmRpdGlvbiIsIm9wZXJhdG9yIiwiaW5jbHVkZXMiLCJtUHJvcGVydGllcyIsIm1GaWx0ZXJDb25kaXRpb25zIiwiYUlnbm9yZVByb3BlcnRpZXMiLCJpZ25vcmVkUHJvcGVydGllcyIsIm9UYXJnZXRDb250cm9sIiwidGFyZ2V0Q29udHJvbCIsInNUYXJnZXRFbnRpdHlQYXRoIiwic1NlYXJjaCIsInNCaW5kaW5nUGF0aCIsImFQcm9wZXJ0aWVzTWV0YWRhdGEiLCJwcm9wZXJ0aWVzTWV0YWRhdGEiLCJDb3JlIiwiYnlJZCIsIl9nZXRTZWFyY2hGaWVsZCIsIl9nZXRGaWx0ZXJDb25kaXRpb25zIiwiZ2V0UHJvcGVydHlJbmZvU2V0IiwiX2dldEZpbHRlclByb3BlcnRpZXNNZXRhZGF0YSIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwic0tleSIsIkpTT04iLCJwYXJzZSIsImFUYXJnZXRQcm9wZXJ0aWVzTWV0YWRhdGEiLCJnZXRDb250cm9sRGVsZWdhdGUiLCJmZXRjaFByb3BlcnRpZXNGb3JFbnRpdHkiLCJtRW50aXR5UHJvcGVydGllcyIsIm9FbnRpdHlQcm9wZXJ0eSIsIl9hSWdub3JlUHJvcGVydGllcyIsIl9nZXRJZ25vcmVkUHJvcGVydGllcyIsImNvbmNhdCIsIm9GaWx0ZXIiLCJzZWFyY2giLCJiaW5kaW5nUGF0aCIsImFQcm9wZXJ0aWVzIiwib0lGaWx0ZXJQcm9wZXJ0eSIsInR5cGVJbnN0YW5jZSIsImdldENvbnN0cmFpbnRzIiwiRnVuY3Rpb24iLCJwYXRoIiwiZ2V0Tm90QXBwbGljYWJsZUZpbHRlcnMiLCJvRmlsdGVyQmFyIiwib0NvbnRyb2wiLCJzVGFyZ2V0RW50aXR5VHlwZVBhdGgiLCJvRmlsdGVyQmFyRW50aXR5UGF0aCIsIm9GaWx0ZXJCYXJFbnRpdHlTZXRBbm5vdGF0aW9ucyIsImdldE9iamVjdCIsImFOb3RBcHBsaWNhYmxlIiwiZ2V0Q29uZGl0aW9ucyIsImJJc0ZpbHRlckJhckVudGl0eVR5cGUiLCJiSXNDaGFydCIsImJJc0FuYWx5dGljYWxUYWJsZSIsImdldFBhcmVudCIsImdldFRhYmxlRGVmaW5pdGlvbiIsImVuYWJsZUFuYWx5dGljcyIsImJFbmFibGVTZWFyY2giLCJDb21tb25IZWxwZXIiLCJwYXJzZUN1c3RvbURhdGEiLCJlbmFibGVTZWFyY2giLCJlbmFibGVBbmFseXRpY3NTZWFyY2giLCJhVGFyZ2V0UHJvcGVydGllcyIsIm1UYXJnZXRQcm9wZXJ0aWVzIiwicmVkdWNlIiwibVByb3AiLCJvUHJvcCIsIm1UYWJsZUFnZ3JlZ2F0ZXMiLCJhZ2dyZWdhdGVzIiwibUFnZ3JlZ2F0ZWRQcm9wZXJ0aWVzIiwic0FnZ3JlZ2F0ZU5hbWUiLCJvQWdncmVnYXRlIiwicmVsYXRpdmVQYXRoIiwiY2hhcnRFbnRpdHlUeXBlQW5ub3RhdGlvbnMiLCJvRW50aXR5U2V0QW5ub3RhdGlvbnMiLCJtQ2hhcnRDdXN0b21BZ2dyZWdhdGVzIiwiTWV0YU1vZGVsVXRpbCIsImdldEFsbEN1c3RvbUFnZ3JlZ2F0ZXMiLCJzUHJvcGVydHkiLCJhQ29uZGl0aW9uUHJvcGVydHkiLCJ0eXBlQ2hlY2siLCJBcnJheSIsImlzQXJyYXkiLCJyZXBsYWNlIiwiZ2V0U2VhcmNoIiwic2V0RmlsdGVyVmFsdWVzIiwic0NvbmRpdGlvblBhdGgiLCJTdGF0ZVV0aWwiLCJhcHBseUV4dGVybmFsU3RhdGUiLCJmaWx0ZXIiLCJhcmdzIiwic09wZXJhdG9yIiwidlZhbHVlcyIsIkZpbHRlck9wZXJhdG9yIiwiaW5kZXhPZiIsIkxvZyIsIndhcm5pbmciLCJTZW1hbnRpY0RhdGVPcGVyYXRvcnMiLCJnZXRTZW1hbnRpY0RhdGVPcGVyYXRpb25zIiwiRVEiLCJzdXBwb3J0ZWRWYWx1ZVR5cGVzIiwiRXJyb3IiLCJCVCIsIkNvbmRpdGlvbiIsImNyZWF0ZUNvbmRpdGlvbiIsIkNvbmRpdGlvblZhbGlkYXRlZCIsIk5vdFZhbGlkYXRlZCIsIm1hcCIsInZhbHVlIiwicmV0cmlldmVFeHRlcm5hbFN0YXRlIiwib1N0YXRlIiwiZmlsdGVyZWQiLCJjb25kaXRpb25Ub01vZGVsUGF0aCIsIl9nZXRFbnRpdHlTZXRQYXRoIiwiTW9kZWxIZWxwZXIiLCJnZXRFbnRpdHlTZXRQYXRoIiwidGFibGVDb250cm9scyIsIm9Db250cm9sbGVyIiwiX2dldENvbnRyb2xzIiwib1RhYmxlIiwiYVNlbGVjdGlvbkZpZWxkcyIsImdldFNlbGVjdGlvbkZpZWxkcyIsInNlbGVjdGlvbkZpZWxkcyIsImdldENvbnRyb2xUeXBlIiwib1BhZ2VDb250ZXh0IiwiYUZpbHRlckJhclNlbGVjdGlvbkZpZWxkc0Fubm90YXRpb24iLCJnZXRFbnRpdHlUeXBlQW5ub3RhdGlvbiIsImFubm90YXRpb24iLCJtYXBTZWxlY3Rpb25GaWVsZHMiLCJvU2VsZWN0aW9uRmllbGQiLCJjb25kaXRpb25QYXRoIiwib0ZpbHRlckJhclNlbGVjdGlvbkZpZWxkQW5ub3RhdGlvbiIsInNQYXRoIiwib0ZpbHRlckZpZWxkIiwiZmllbGROYW1lcyIsIm9GaWVsZCIsIl9nZXRTZWxlY3Rpb25GaWVsZHNGcm9tUHJvcGVydHlJbmZvcyIsInByb3BlcnR5SW5mb0ZpZWxkcyIsImdldFByb3BlcnR5SW5mbyIsInNlbEZpZWxkIiwiZ3JvdXAiLCJncm91cExhYmVsIiwic2V0dGluZ3MiLCJ2aXN1YWxGaWx0ZXIiLCJsYWJlbCIsInNJRmlsdGVyUHJvcGVydHlOYW1lIiwibUVudGl0eVByb3BlcnRpZXNDdXJyZW50IiwiZ2V0RmlsdGVycyIsImZpbHRlckJhciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRmlsdGVyVXRpbHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcInNhcC9iYXNlL3V0aWwvbWVyZ2VcIjtcbmltcG9ydCBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0ICogYXMgRmlsdGVyQmFyQ29udmVydGVyIGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0xpc3RSZXBvcnQvRmlsdGVyQmFyXCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBNZXRhTW9kZWxDb252ZXJ0ZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCBTZW1hbnRpY0RhdGVPcGVyYXRvcnMgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU2VtYW50aWNEYXRlT3BlcmF0b3JzXCI7XG5pbXBvcnQgeyBPREFUQV9UWVBFX01BUFBJTkcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EaXNwbGF5TW9kZUZvcm1hdHRlclwiO1xuaW1wb3J0IENvbW1vbkhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9Db21tb25IZWxwZXJcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgTWV0YU1vZGVsVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9PRGF0YU1ldGFNb2RlbFV0aWxcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgQ29uZGl0aW9uIGZyb20gXCJzYXAvdWkvbWRjL2NvbmRpdGlvbi9Db25kaXRpb25cIjtcbmltcG9ydCBDb25kaXRpb25Db252ZXJ0ZXIgZnJvbSBcInNhcC91aS9tZGMvY29uZGl0aW9uL0NvbmRpdGlvbkNvbnZlcnRlclwiO1xuaW1wb3J0IENvbmRpdGlvblZhbGlkYXRlZCBmcm9tIFwic2FwL3VpL21kYy9lbnVtL0NvbmRpdGlvblZhbGlkYXRlZFwiO1xuaW1wb3J0IEZpbHRlckJhciBmcm9tIFwic2FwL3VpL21kYy9GaWx0ZXJCYXJcIjtcbmltcG9ydCBUeXBlVXRpbCBmcm9tIFwic2FwL3VpL21kYy9vZGF0YS92NC9UeXBlVXRpbFwiO1xuaW1wb3J0IFN0YXRlVXRpbCBmcm9tIFwic2FwL3VpL21kYy9wMTNuL1N0YXRlVXRpbFwiO1xuaW1wb3J0IEZpbHRlclV0aWwgZnJvbSBcInNhcC91aS9tZGMvdXRpbC9GaWx0ZXJVdGlsXCI7XG5pbXBvcnQgRmlsdGVyIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyXCI7XG5pbXBvcnQgRmlsdGVyT3BlcmF0b3IgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJPcGVyYXRvclwiO1xuaW1wb3J0IE1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL01ldGFNb2RlbFwiO1xuaW1wb3J0IE9EYXRhVXRpbHMgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YVV0aWxzXCI7XG5cbmNvbnN0IG9GaWx0ZXJVdGlscyA9IHtcblx0Z2V0RmlsdGVyOiBmdW5jdGlvbiAodklGaWx0ZXI6IGFueSkge1xuXHRcdGNvbnN0IGFGaWx0ZXJzID0gb0ZpbHRlclV0aWxzLmdldEZpbHRlckluZm8odklGaWx0ZXIpLmZpbHRlcnM7XG5cdFx0cmV0dXJuIGFGaWx0ZXJzLmxlbmd0aCA/IG5ldyBGaWx0ZXIob0ZpbHRlclV0aWxzLmdldEZpbHRlckluZm8odklGaWx0ZXIpLmZpbHRlcnMsIGZhbHNlKSA6IHVuZGVmaW5lZDtcblx0fSxcblx0Z2V0RmlsdGVyRmllbGQ6IGZ1bmN0aW9uIChwcm9wZXJ0eVBhdGg6IHN0cmluZywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZTogRW50aXR5VHlwZSkge1xuXHRcdHJldHVybiBGaWx0ZXJCYXJDb252ZXJ0ZXIuZ2V0RmlsdGVyRmllbGQocHJvcGVydHlQYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlKTtcblx0fSxcblx0YnVpbGRQcm9wZXJ5SW5mbzogZnVuY3Rpb24gKHByb3BlcnR5SW5mb0ZpZWxkOiBhbnksIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpIHtcblx0XHRsZXQgb1Byb3BlcnR5SW5mbztcblx0XHRjb25zdCBhVHlwZUNvbmZpZzogYW55ID0ge307XG5cdFx0Y29uc3QgcHJvcGVydHlDb252ZXJ0eUNvbnRleHQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlckNvbnRleHRGb3IocHJvcGVydHlJbmZvRmllbGQuYW5ub3RhdGlvblBhdGgpO1xuXHRcdGNvbnN0IHByb3BlcnR5VGFyZ2V0T2JqZWN0ID0gcHJvcGVydHlDb252ZXJ0eUNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldE9iamVjdDtcblx0XHRjb25zdCBvVHlwZUNvbmZpZyA9IEZpbHRlckJhckNvbnZlcnRlci5mZXRjaFR5cGVDb25maWcocHJvcGVydHlUYXJnZXRPYmplY3QpO1xuXHRcdG9Qcm9wZXJ0eUluZm8gPSBGaWx0ZXJCYXJDb252ZXJ0ZXIuZmV0Y2hQcm9wZXJ0eUluZm8oY29udmVydGVyQ29udGV4dCwgcHJvcGVydHlJbmZvRmllbGQsIG9UeXBlQ29uZmlnKTtcblx0XHRhVHlwZUNvbmZpZ1twcm9wZXJ0eUluZm9GaWVsZC5rZXldID0gb1R5cGVDb25maWc7XG5cdFx0b1Byb3BlcnR5SW5mbyA9IEZpbHRlckJhckNvbnZlcnRlci5hc3NpZ25EYXRhVHlwZVRvUHJvcGVydHlJbmZvKG9Qcm9wZXJ0eUluZm8sIGNvbnZlcnRlckNvbnRleHQsIFtdLCBhVHlwZUNvbmZpZyk7XG5cdFx0cmV0dXJuIG9Qcm9wZXJ0eUluZm87XG5cdH0sXG5cdGNyZWF0ZUNvbnZlcnRlckNvbnRleHQ6IGZ1bmN0aW9uIChvRmlsdGVyQ29udHJvbDogYW55LCBzRW50aXR5VHlwZVBhdGg6IHN0cmluZywgbWV0YU1vZGVsPzogTWV0YU1vZGVsLCBhcHBDb21wb25lbnQ/OiBBcHBDb21wb25lbnQpIHtcblx0XHRjb25zdCBzRmlsdGVyRW50aXR5VHlwZVBhdGggPSBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvRmlsdGVyQ29udHJvbCwgXCJlbnRpdHlUeXBlXCIpLFxuXHRcdFx0Y29udGV4dFBhdGggPSBzRW50aXR5VHlwZVBhdGggfHwgc0ZpbHRlckVudGl0eVR5cGVQYXRoO1xuXG5cdFx0Y29uc3Qgb1ZpZXcgPSBvRmlsdGVyQ29udHJvbC5pc0EgPyBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KG9GaWx0ZXJDb250cm9sKSA6IG51bGw7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG1ldGFNb2RlbCB8fCBvRmlsdGVyQ29udHJvbC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpO1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBhcHBDb21wb25lbnQgfHwgKG9WaWV3ICYmIENvbW1vblV0aWxzLmdldEFwcENvbXBvbmVudChvVmlldykpO1xuXHRcdGNvbnN0IG9WaXN1YWxpemF0aW9uT2JqZWN0UGF0aCA9IE1ldGFNb2RlbENvbnZlcnRlci5nZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChjb250ZXh0UGF0aCkpO1xuXHRcdGxldCBtYW5pZmVzdFNldHRpbmdzO1xuXHRcdGlmIChvRmlsdGVyQ29udHJvbC5pc0EgJiYgIW9GaWx0ZXJDb250cm9sLmlzQShcInNhcC51aS5tZGMuZmlsdGVyYmFyLnZoLkZpbHRlckJhclwiKSkge1xuXHRcdFx0bWFuaWZlc3RTZXR0aW5ncyA9IChvVmlldyAmJiBvVmlldy5nZXRWaWV3RGF0YSgpKSB8fCB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHJldHVybiBDb252ZXJ0ZXJDb250ZXh0LmNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyhcblx0XHRcdG9WaXN1YWxpemF0aW9uT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldC5uYW1lLFxuXHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdG9BcHBDb21wb25lbnQgJiYgb0FwcENvbXBvbmVudC5nZXREaWFnbm9zdGljcygpLFxuXHRcdFx0bWVyZ2UsXG5cdFx0XHRvVmlzdWFsaXphdGlvbk9iamVjdFBhdGguY29udGV4dExvY2F0aW9uLFxuXHRcdFx0bWFuaWZlc3RTZXR0aW5nc1xuXHRcdCk7XG5cdH0sXG5cdGdldENvbnZlcnRlZEZpbHRlckZpZWxkczogZnVuY3Rpb24gKFxuXHRcdG9GaWx0ZXJDb250cm9sOiBhbnksXG5cdFx0c0VudGl0eVR5cGVQYXRoPzogYW55LFxuXHRcdGluY2x1ZGVIaWRkZW4/OiBib29sZWFuLFxuXHRcdG1ldGFNb2RlbD86IE1ldGFNb2RlbCxcblx0XHRhcHBDb21wb25lbnQ/OiBBcHBDb21wb25lbnQsXG5cdFx0b01vZGlmaWVyPzogYW55LFxuXHRcdGxpbmVJdGVtVGVybT86IHN0cmluZ1xuXHQpIHtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gdGhpcy5fZ2V0RmlsdGVyTWV0YU1vZGVsKG9GaWx0ZXJDb250cm9sLCBtZXRhTW9kZWwpO1xuXHRcdGNvbnN0IHNGaWx0ZXJFbnRpdHlUeXBlUGF0aCA9IERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9GaWx0ZXJDb250cm9sLCBcImVudGl0eVR5cGVcIiksXG5cdFx0XHRjb250ZXh0UGF0aCA9IHNFbnRpdHlUeXBlUGF0aCB8fCBzRmlsdGVyRW50aXR5VHlwZVBhdGg7XG5cblx0XHRjb25zdCBsclRhYmxlczogYW55W10gPSB0aGlzLl9nZXRGaWVsZHNGb3JUYWJsZShvRmlsdGVyQ29udHJvbCwgc0VudGl0eVR5cGVQYXRoKTtcblxuXHRcdGNvbnN0IG9Db252ZXJ0ZXJDb250ZXh0ID0gdGhpcy5jcmVhdGVDb252ZXJ0ZXJDb250ZXh0KG9GaWx0ZXJDb250cm9sLCBzRW50aXR5VHlwZVBhdGgsIG1ldGFNb2RlbCwgYXBwQ29tcG9uZW50KTtcblxuXHRcdC8vYVNlbGVjdGlvbkZpZWxkcyA9IEZpbHRlckJhckNvbnZlcnRlci5nZXRTZWxlY3Rpb25GaWVsZHMob0NvbnZlcnRlckNvbnRleHQpO1xuXHRcdHJldHVybiB0aGlzLl9nZXRTZWxlY3Rpb25GaWVsZHMoXG5cdFx0XHRvRmlsdGVyQ29udHJvbCxcblx0XHRcdHNFbnRpdHlUeXBlUGF0aCxcblx0XHRcdHNGaWx0ZXJFbnRpdHlUeXBlUGF0aCxcblx0XHRcdGNvbnRleHRQYXRoLFxuXHRcdFx0bHJUYWJsZXMsXG5cdFx0XHRvTWV0YU1vZGVsLFxuXHRcdFx0b0NvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRpbmNsdWRlSGlkZGVuLFxuXHRcdFx0b01vZGlmaWVyLFxuXHRcdFx0bGluZUl0ZW1UZXJtXG5cdFx0KTtcblx0fSxcblxuXHRnZXRCaW5kaW5nUGF0aEZvclBhcmFtZXRlcnM6IGZ1bmN0aW9uIChvSUZpbHRlcjogYW55LCBtQ29uZGl0aW9uczogYW55LCBhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhOiBhbnksIGFQYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRjb25zdCBhUGFyYW1zOiBhbnlbXSA9IFtdO1xuXHRcdGFGaWx0ZXJQcm9wZXJ0aWVzTWV0YWRhdGEgPSBvRmlsdGVyVXRpbHMuc2V0VHlwZUNvbmZpZ1RvUHJvcGVydGllcyhhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhKTtcblx0XHQvLyBDb2xsZWN0aW5nIGFsbCBwYXJhbWV0ZXIgdmFsdWVzIGZyb20gY29uZGl0aW9uc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYVBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHNGaWVsZFBhdGggPSBhUGFyYW1ldGVyc1tpXTtcblx0XHRcdGlmIChtQ29uZGl0aW9uc1tzRmllbGRQYXRoXSAmJiBtQ29uZGl0aW9uc1tzRmllbGRQYXRoXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdC8vIFdlIHdvdWxkIGJlIHVzaW5nIG9ubHkgdGhlIGZpcnN0IGNvbmRpdGlvbiBmb3IgcGFyYW1ldGVyIHZhbHVlLlxuXHRcdFx0XHRjb25zdCBvQ29uZGl0aW9uSW50ZXJuYWwgPSBtZXJnZSh7fSwgbUNvbmRpdGlvbnNbc0ZpZWxkUGF0aF1bMF0pIGFzIGFueTtcblx0XHRcdFx0Y29uc3Qgb1Byb3BlcnR5ID0gRmlsdGVyVXRpbC5nZXRQcm9wZXJ0eUJ5S2V5KGFGaWx0ZXJQcm9wZXJ0aWVzTWV0YWRhdGEsIHNGaWVsZFBhdGgpIGFzIGFueTtcblx0XHRcdFx0Y29uc3Qgb1R5cGVDb25maWcgPVxuXHRcdFx0XHRcdG9Qcm9wZXJ0eS50eXBlQ29uZmlnIHx8IFR5cGVVdGlsLmdldFR5cGVDb25maWcob1Byb3BlcnR5LmRhdGFUeXBlLCBvUHJvcGVydHkuZm9ybWF0T3B0aW9ucywgb1Byb3BlcnR5LmNvbnN0cmFpbnRzKTtcblx0XHRcdFx0Y29uc3QgbUludGVybmFsUGFyYW1ldGVyQ29uZGl0aW9uID0gQ29uZGl0aW9uQ29udmVydGVyLnRvVHlwZShvQ29uZGl0aW9uSW50ZXJuYWwsIG9UeXBlQ29uZmlnLCBvSUZpbHRlci5nZXRUeXBlVXRpbCgpKTtcblx0XHRcdFx0Y29uc3Qgc0VkbVR5cGUgPSBPREFUQV9UWVBFX01BUFBJTkdbb1R5cGVDb25maWcuY2xhc3NOYW1lXTtcblx0XHRcdFx0YVBhcmFtcy5wdXNoKFxuXHRcdFx0XHRcdGAke3NGaWVsZFBhdGh9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KE9EYXRhVXRpbHMuZm9ybWF0TGl0ZXJhbChtSW50ZXJuYWxQYXJhbWV0ZXJDb25kaXRpb24udmFsdWVzWzBdLCBzRWRtVHlwZSkpfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBCaW5kaW5nIHBhdGggZnJvbSBFbnRpdHlUeXBlXG5cdFx0Y29uc3Qgc0VudGl0eVR5cGVQYXRoID0gb0lGaWx0ZXIuZGF0YShcImVudGl0eVR5cGVcIik7XG5cdFx0Y29uc3Qgc0VudGl0eVNldFBhdGggPSBzRW50aXR5VHlwZVBhdGguc3Vic3RyaW5nKDAsIHNFbnRpdHlUeXBlUGF0aC5sZW5ndGggLSAxKTtcblx0XHRjb25zdCBzUGFyYW1ldGVyRW50aXR5U2V0ID0gc0VudGl0eVNldFBhdGguc2xpY2UoMCwgc0VudGl0eVNldFBhdGgubGFzdEluZGV4T2YoXCIvXCIpKTtcblx0XHRjb25zdCBzVGFyZ2V0TmF2aWdhdGlvbiA9IHNFbnRpdHlTZXRQYXRoLnN1YnN0cmluZyhzRW50aXR5U2V0UGF0aC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKTtcblx0XHQvLyBjcmVhdGUgcGFyYW1ldGVyIGNvbnRleHRcblx0XHRyZXR1cm4gYCR7c1BhcmFtZXRlckVudGl0eVNldH0oJHthUGFyYW1zLnRvU3RyaW5nKCl9KS8ke3NUYXJnZXROYXZpZ2F0aW9ufWA7XG5cdH0sXG5cblx0Z2V0RWRpdFN0YXRlSXNIaWRlRHJhZnQ6IGZ1bmN0aW9uIChtQ29uZGl0aW9uczogYW55KSB7XG5cdFx0bGV0IGJJc0hpZGVEcmFmdCA9IGZhbHNlO1xuXHRcdGlmIChtQ29uZGl0aW9ucyAmJiBtQ29uZGl0aW9ucy4kZWRpdFN0YXRlKSB7XG5cdFx0XHRjb25zdCBvQ29uZGl0aW9uID0gbUNvbmRpdGlvbnMuJGVkaXRTdGF0ZS5maW5kKGZ1bmN0aW9uIChjb25kaXRpb246IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gY29uZGl0aW9uLm9wZXJhdG9yID09PSBcIkRSQUZUX0VESVRfU1RBVEVcIjtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKG9Db25kaXRpb24gJiYgKG9Db25kaXRpb24udmFsdWVzLmluY2x1ZGVzKFwiQUxMX0hJRElOR19EUkFGVFNcIikgfHwgb0NvbmRpdGlvbi52YWx1ZXMuaW5jbHVkZXMoXCJTQVZFRF9PTkxZXCIpKSkge1xuXHRcdFx0XHRiSXNIaWRlRHJhZnQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYklzSGlkZURyYWZ0O1xuXHR9LFxuXHQvKipcblx0ICogR2V0cyBhbGwgZmlsdGVycyB0aGF0IG9yaWdpbmF0ZSBmcm9tIHRoZSBNREMgRmlsdGVyQmFyLlxuXHQgKlxuXHQgKiBAcGFyYW0gdklGaWx0ZXIgU3RyaW5nIG9yIG9iamVjdCBpbnN0YW5jZSByZWxhdGVkIHRvXG5cdCAqICAtIE1EQ19GaWx0ZXJCYXIvVGFibGUvQ2hhcnRcblx0ICogQHBhcmFtIG1Qcm9wZXJ0aWVzIFByb3BlcnRpZXMgb24gZmlsdGVycyB0aGF0IGFyZSB0byBiZSByZXRyaWV2ZWQuIEF2YWlsYWJsZSBwYXJhbWV0ZXJzOlxuXHQgKiBcdCAtIGlnbm9yZWRQcm9wZXJ0aWVzOiBBcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyB3aGljaCBzaG91bGQgYmUgbm90IGNvbnNpZGVyZWQgZm9yIGZpbHRlcmluZ1xuXHQgKlx0IC0gcHJvcGVydGllc01ldGFkYXRhOiBBcnJheSB3aXRoIGFsbCB0aGUgcHJvcGVydHkgbWV0YWRhdGEuIElmIG5vdCBwcm92aWRlZCwgcHJvcGVydGllcyB3aWxsIGJlIHJldHJpZXZlZCBmcm9tIHZJRmlsdGVyLlxuXHQgKlx0IC0gdGFyZ2V0Q29udHJvbDogTURDX3RhYmxlIG9yIGNoYXJ0LiBJZiBwcm92aWRlZCwgcHJvcGVydHkgbmFtZXMgd2hpY2ggYXJlIG5vdCByZWxldmFudCBmb3IgdGhlIHRhcmdldCBjb250cm9sIGVudGl0eVNldCBhcmUgbm90IGNvbnNpZGVyZWQuXG5cdCAqIEBwYXJhbSBtRmlsdGVyQ29uZGl0aW9ucyBNYXAgd2l0aCBleHRlcm5hbGl6ZWQgZmlsdGVyIGNvbmRpdGlvbnMuXG5cdCAqIEByZXR1cm5zIEZpbHRlckJhciBmaWx0ZXJzIGFuZCBiYXNpYyBzZWFyY2hcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRnZXRGaWx0ZXJJbmZvOiBmdW5jdGlvbiAodklGaWx0ZXI6IHN0cmluZyB8IG9iamVjdCwgbVByb3BlcnRpZXM/OiBhbnksIG1GaWx0ZXJDb25kaXRpb25zPzogYW55KSB7XG5cdFx0bGV0IGFJZ25vcmVQcm9wZXJ0aWVzID0gKG1Qcm9wZXJ0aWVzICYmIG1Qcm9wZXJ0aWVzLmlnbm9yZWRQcm9wZXJ0aWVzKSB8fCBbXTtcblx0XHRjb25zdCBvVGFyZ2V0Q29udHJvbCA9IG1Qcm9wZXJ0aWVzICYmIG1Qcm9wZXJ0aWVzLnRhcmdldENvbnRyb2wsXG5cdFx0XHRzVGFyZ2V0RW50aXR5UGF0aCA9IG9UYXJnZXRDb250cm9sID8gb1RhcmdldENvbnRyb2wuZGF0YShcImVudGl0eVR5cGVcIikgOiB1bmRlZmluZWQ7XG5cdFx0bGV0IG9JRmlsdGVyOiBhbnkgPSB2SUZpbHRlcixcblx0XHRcdHNTZWFyY2gsXG5cdFx0XHRhRmlsdGVyczogYW55W10gPSBbXSxcblx0XHRcdHNCaW5kaW5nUGF0aCxcblx0XHRcdGFQcm9wZXJ0aWVzTWV0YWRhdGEgPSBtUHJvcGVydGllcyAmJiBtUHJvcGVydGllcy5wcm9wZXJ0aWVzTWV0YWRhdGE7XG5cdFx0aWYgKHR5cGVvZiB2SUZpbHRlciA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0b0lGaWx0ZXIgPSBDb3JlLmJ5SWQodklGaWx0ZXIpIGFzIGFueTtcblx0XHR9XG5cdFx0aWYgKG9JRmlsdGVyKSB7XG5cdFx0XHRzU2VhcmNoID0gdGhpcy5fZ2V0U2VhcmNoRmllbGQob0lGaWx0ZXIsIGFJZ25vcmVQcm9wZXJ0aWVzKTtcblx0XHRcdGNvbnN0IG1Db25kaXRpb25zID0gdGhpcy5fZ2V0RmlsdGVyQ29uZGl0aW9ucyhtUHJvcGVydGllcywgbUZpbHRlckNvbmRpdGlvbnMsIG9JRmlsdGVyKTtcblx0XHRcdGxldCBhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhID0gb0lGaWx0ZXIuZ2V0UHJvcGVydHlJbmZvU2V0ID8gb0lGaWx0ZXIuZ2V0UHJvcGVydHlJbmZvU2V0KCkgOiBudWxsO1xuXHRcdFx0YUZpbHRlclByb3BlcnRpZXNNZXRhZGF0YSA9IHRoaXMuX2dldEZpbHRlclByb3BlcnRpZXNNZXRhZGF0YShhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhLCBvSUZpbHRlcik7XG5cdFx0XHRpZiAobVByb3BlcnRpZXMgJiYgbVByb3BlcnRpZXMudGFyZ2V0Q29udHJvbCAmJiBtUHJvcGVydGllcy50YXJnZXRDb250cm9sLmlzQShcInNhcC51aS5tZGMuQ2hhcnRcIikpIHtcblx0XHRcdFx0T2JqZWN0LmtleXMobUNvbmRpdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKHNLZXk6IHN0cmluZykge1xuXHRcdFx0XHRcdGlmIChzS2V5ID09PSBcIiRlZGl0U3RhdGVcIikge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG1Db25kaXRpb25zW1wiJGVkaXRTdGF0ZVwiXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0bGV0IGFQYXJhbWV0ZXJzID0gb0lGaWx0ZXIuZGF0YShcInBhcmFtZXRlcnNcIikgfHwgW107XG5cdFx0XHRhUGFyYW1ldGVycyA9IHR5cGVvZiBhUGFyYW1ldGVycyA9PT0gXCJzdHJpbmdcIiA/IEpTT04ucGFyc2UoYVBhcmFtZXRlcnMpIDogYVBhcmFtZXRlcnM7XG5cdFx0XHRpZiAoYVBhcmFtZXRlcnMgJiYgYVBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHQvLyBCaW5kaW5nIHBhdGggY2hhbmdlcyBpbiBjYXNlIG9mIHBhcmFtZXRlcnMuXG5cdFx0XHRcdHNCaW5kaW5nUGF0aCA9IG9GaWx0ZXJVdGlscy5nZXRCaW5kaW5nUGF0aEZvclBhcmFtZXRlcnMob0lGaWx0ZXIsIG1Db25kaXRpb25zLCBhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhLCBhUGFyYW1ldGVycyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobUNvbmRpdGlvbnMpIHtcblx0XHRcdFx0Ly9FeGNsdWRlIEludGVyZmFjZSBGaWx0ZXIgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgcmVsZXZhbnQgZm9yIHRoZSBUYXJnZXQgY29udHJvbCBlbnRpdHlTZXRcblx0XHRcdFx0aWYgKHNUYXJnZXRFbnRpdHlQYXRoICYmIG9JRmlsdGVyLmRhdGEoXCJlbnRpdHlUeXBlXCIpICE9PSBzVGFyZ2V0RW50aXR5UGF0aCkge1xuXHRcdFx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvSUZpbHRlci5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpO1xuXHRcdFx0XHRcdGNvbnN0IGFUYXJnZXRQcm9wZXJ0aWVzTWV0YWRhdGEgPSBvSUZpbHRlclxuXHRcdFx0XHRcdFx0LmdldENvbnRyb2xEZWxlZ2F0ZSgpXG5cdFx0XHRcdFx0XHQuZmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5KHNUYXJnZXRFbnRpdHlQYXRoLCBvTWV0YU1vZGVsLCBvSUZpbHRlcik7XG5cdFx0XHRcdFx0YVByb3BlcnRpZXNNZXRhZGF0YSA9IGFUYXJnZXRQcm9wZXJ0aWVzTWV0YWRhdGE7XG5cblx0XHRcdFx0XHRjb25zdCBtRW50aXR5UHJvcGVydGllczogYW55ID0ge307XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBpIGluIGFUYXJnZXRQcm9wZXJ0aWVzTWV0YWRhdGEpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9FbnRpdHlQcm9wZXJ0eSA9IGFUYXJnZXRQcm9wZXJ0aWVzTWV0YWRhdGFbaV07XG5cdFx0XHRcdFx0XHRtRW50aXR5UHJvcGVydGllc1tvRW50aXR5UHJvcGVydHkubmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRcdFwiaGFzUHJvcGVydHlcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZGF0YVR5cGU6IG9FbnRpdHlQcm9wZXJ0eS5kYXRhVHlwZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3QgX2FJZ25vcmVQcm9wZXJ0aWVzOiBhbnkgPSB0aGlzLl9nZXRJZ25vcmVkUHJvcGVydGllcyhhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhLCBtRW50aXR5UHJvcGVydGllcyk7XG5cdFx0XHRcdFx0aWYgKF9hSWdub3JlUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRhSWdub3JlUHJvcGVydGllcyA9IGFJZ25vcmVQcm9wZXJ0aWVzLmNvbmNhdChfYUlnbm9yZVByb3BlcnRpZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICghYVByb3BlcnRpZXNNZXRhZGF0YSkge1xuXHRcdFx0XHRcdGFQcm9wZXJ0aWVzTWV0YWRhdGEgPSBhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHZhciBhUGFyYW1LZXlzID0gW107XG5cdFx0XHRcdC8vIGFQYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9QYXJhbSkge1xuXHRcdFx0XHQvLyBcdGFQYXJhbUtleXMucHVzaChvUGFyYW0ua2V5KTtcblx0XHRcdFx0Ly8gfSk7XG5cdFx0XHRcdGNvbnN0IG9GaWx0ZXIgPSAoXG5cdFx0XHRcdFx0RmlsdGVyVXRpbC5nZXRGaWx0ZXJJbmZvKFxuXHRcdFx0XHRcdFx0b0lGaWx0ZXIsXG5cdFx0XHRcdFx0XHRtQ29uZGl0aW9ucyxcblx0XHRcdFx0XHRcdG9GaWx0ZXJVdGlscy5zZXRUeXBlQ29uZmlnVG9Qcm9wZXJ0aWVzKGFQcm9wZXJ0aWVzTWV0YWRhdGEpLFxuXHRcdFx0XHRcdFx0YUlnbm9yZVByb3BlcnRpZXMuY29uY2F0KGFQYXJhbWV0ZXJzKVxuXHRcdFx0XHRcdCkgYXMgYW55XG5cdFx0XHRcdCkuZmlsdGVycztcblx0XHRcdFx0YUZpbHRlcnMgPSBvRmlsdGVyID8gW29GaWx0ZXJdIDogW107XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7IGZpbHRlcnM6IGFGaWx0ZXJzLCBzZWFyY2g6IHNTZWFyY2ggfHwgdW5kZWZpbmVkLCBiaW5kaW5nUGF0aDogc0JpbmRpbmdQYXRoIH07XG5cdH0sXG5cdHNldFR5cGVDb25maWdUb1Byb3BlcnRpZXM6IGZ1bmN0aW9uIChhUHJvcGVydGllczogYW55KSB7XG5cdFx0aWYgKGFQcm9wZXJ0aWVzICYmIGFQcm9wZXJ0aWVzLmxlbmd0aCkge1xuXHRcdFx0YVByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAob0lGaWx0ZXJQcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRvSUZpbHRlclByb3BlcnR5LnR5cGVDb25maWcgJiZcblx0XHRcdFx0XHRvSUZpbHRlclByb3BlcnR5LnR5cGVDb25maWcudHlwZUluc3RhbmNlICYmXG5cdFx0XHRcdFx0b0lGaWx0ZXJQcm9wZXJ0eS50eXBlQ29uZmlnLnR5cGVJbnN0YW5jZS5nZXRDb25zdHJhaW50cyBpbnN0YW5jZW9mIEZ1bmN0aW9uXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob0lGaWx0ZXJQcm9wZXJ0eS5wYXRoID09PSBcIiRlZGl0U3RhdGVcIikge1xuXHRcdFx0XHRcdG9JRmlsdGVyUHJvcGVydHkudHlwZUNvbmZpZyA9IFR5cGVVdGlsLmdldFR5cGVDb25maWcoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5TdHJpbmdcIiwge30sIHt9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChvSUZpbHRlclByb3BlcnR5LnBhdGggPT09IFwiJHNlYXJjaFwiKSB7XG5cdFx0XHRcdFx0b0lGaWx0ZXJQcm9wZXJ0eS50eXBlQ29uZmlnID0gVHlwZVV0aWwuZ2V0VHlwZUNvbmZpZyhcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmluZ1wiLCB7fSwge30pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG9JRmlsdGVyUHJvcGVydHkuZGF0YVR5cGUgfHwgKG9JRmlsdGVyUHJvcGVydHkudHlwZUNvbmZpZyAmJiBvSUZpbHRlclByb3BlcnR5LnR5cGVDb25maWcuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRcdG9JRmlsdGVyUHJvcGVydHkudHlwZUNvbmZpZyA9IFR5cGVVdGlsLmdldFR5cGVDb25maWcoXG5cdFx0XHRcdFx0XHRvSUZpbHRlclByb3BlcnR5LmRhdGFUeXBlIHx8IG9JRmlsdGVyUHJvcGVydHkudHlwZUNvbmZpZy5jbGFzc05hbWUsXG5cdFx0XHRcdFx0XHRvSUZpbHRlclByb3BlcnR5LmZvcm1hdE9wdGlvbnMsXG5cdFx0XHRcdFx0XHRvSUZpbHRlclByb3BlcnR5LmNvbnN0cmFpbnRzXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBhUHJvcGVydGllcztcblx0fSxcblx0Z2V0Tm90QXBwbGljYWJsZUZpbHRlcnM6IGZ1bmN0aW9uIChvRmlsdGVyQmFyOiBhbnksIG9Db250cm9sOiBhbnkpIHtcblx0XHRjb25zdCBzVGFyZ2V0RW50aXR5VHlwZVBhdGggPSBvQ29udHJvbC5kYXRhKFwiZW50aXR5VHlwZVwiKSxcblx0XHRcdG9GaWx0ZXJCYXJFbnRpdHlQYXRoID0gb0ZpbHRlckJhci5kYXRhKFwiZW50aXR5VHlwZVwiKSxcblx0XHRcdG9GaWx0ZXJCYXJFbnRpdHlTZXRBbm5vdGF0aW9ucyA9IG9GaWx0ZXJCYXIuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKS5nZXRPYmplY3Qob0ZpbHRlckJhckVudGl0eVBhdGgpLFxuXHRcdFx0YU5vdEFwcGxpY2FibGUgPSBbXSxcblx0XHRcdG1Db25kaXRpb25zID0gb0ZpbHRlckJhci5nZXRDb25kaXRpb25zKCksXG5cdFx0XHRvTWV0YU1vZGVsID0gb0ZpbHRlckJhci5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0YklzRmlsdGVyQmFyRW50aXR5VHlwZSA9IHNUYXJnZXRFbnRpdHlUeXBlUGF0aCA9PT0gb0ZpbHRlckJhci5kYXRhKFwiZW50aXR5VHlwZVwiKSxcblx0XHRcdGJJc0NoYXJ0ID0gb0NvbnRyb2wuaXNBKFwic2FwLnVpLm1kYy5DaGFydFwiKSxcblx0XHRcdGJJc0FuYWx5dGljYWxUYWJsZSA9ICFiSXNDaGFydCAmJiBvQ29udHJvbC5nZXRQYXJlbnQoKS5nZXRUYWJsZURlZmluaXRpb24oKS5lbmFibGVBbmFseXRpY3MsXG5cdFx0XHRiRW5hYmxlU2VhcmNoID0gYklzQ2hhcnRcblx0XHRcdFx0PyBDb21tb25IZWxwZXIucGFyc2VDdXN0b21EYXRhKERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9Db250cm9sLCBcImFwcGx5U3VwcG9ydGVkXCIpKS5lbmFibGVTZWFyY2hcblx0XHRcdFx0OiAhYklzQW5hbHl0aWNhbFRhYmxlIHx8IG9Db250cm9sLmdldFBhcmVudCgpLmdldFRhYmxlRGVmaW5pdGlvbigpLmVuYWJsZUFuYWx5dGljc1NlYXJjaDtcblxuXHRcdGlmIChtQ29uZGl0aW9ucyAmJiAoIWJJc0ZpbHRlckJhckVudGl0eVR5cGUgfHwgYklzQW5hbHl0aWNhbFRhYmxlIHx8IGJJc0NoYXJ0KSkge1xuXHRcdFx0Ly8gV2UgZG9uJ3QgbmVlZCB0byBjYWxjdWxhdGUgdGhlIGRpZmZlcmVuY2Ugb24gcHJvcGVydHkgTGV2ZWwgaWYgZW50aXR5IHNldHMgYXJlIGlkZW50aWNhbFxuXHRcdFx0Y29uc3QgYVRhcmdldFByb3BlcnRpZXMgPSBiSXNGaWx0ZXJCYXJFbnRpdHlUeXBlXG5cdFx0XHRcdD8gW11cblx0XHRcdFx0OiBvRmlsdGVyQmFyLmdldENvbnRyb2xEZWxlZ2F0ZSgpLmZldGNoUHJvcGVydGllc0ZvckVudGl0eShzVGFyZ2V0RW50aXR5VHlwZVBhdGgsIG9NZXRhTW9kZWwsIG9GaWx0ZXJCYXIpLFxuXHRcdFx0XHRtVGFyZ2V0UHJvcGVydGllcyA9IGFUYXJnZXRQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAobVByb3A6IGFueSwgb1Byb3A6IGFueSkge1xuXHRcdFx0XHRcdG1Qcm9wW29Qcm9wLm5hbWVdID0gb1Byb3A7XG5cdFx0XHRcdFx0cmV0dXJuIG1Qcm9wO1xuXHRcdFx0XHR9LCB7fSksXG5cdFx0XHRcdG1UYWJsZUFnZ3JlZ2F0ZXMgPSAoIWJJc0NoYXJ0ICYmIG9Db250cm9sLmdldFBhcmVudCgpLmdldFRhYmxlRGVmaW5pdGlvbigpLmFnZ3JlZ2F0ZXMpIHx8IHt9LFxuXHRcdFx0XHRtQWdncmVnYXRlZFByb3BlcnRpZXM6IGFueSA9IHt9O1xuXG5cdFx0XHRPYmplY3Qua2V5cyhtVGFibGVBZ2dyZWdhdGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChzQWdncmVnYXRlTmFtZTogc3RyaW5nKSB7XG5cdFx0XHRcdGNvbnN0IG9BZ2dyZWdhdGUgPSBtVGFibGVBZ2dyZWdhdGVzW3NBZ2dyZWdhdGVOYW1lXTtcblx0XHRcdFx0bUFnZ3JlZ2F0ZWRQcm9wZXJ0aWVzW29BZ2dyZWdhdGUucmVsYXRpdmVQYXRoXSA9IG9BZ2dyZWdhdGU7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGNoYXJ0RW50aXR5VHlwZUFubm90YXRpb25zID0gb0NvbnRyb2xcblx0XHRcdFx0LmdldE1vZGVsKClcblx0XHRcdFx0LmdldE1ldGFNb2RlbCgpXG5cdFx0XHRcdC5nZXRPYmplY3Qob0NvbnRyb2wuZGF0YShcInRhcmdldENvbGxlY3Rpb25QYXRoXCIpICsgXCIvXCIpO1xuXHRcdFx0aWYgKG9Db250cm9sLmlzQShcInNhcC51aS5tZGMuQ2hhcnRcIikpIHtcblx0XHRcdFx0Y29uc3Qgb0VudGl0eVNldEFubm90YXRpb25zID0gb0NvbnRyb2xcblx0XHRcdFx0XHQuZ2V0TW9kZWwoKVxuXHRcdFx0XHRcdC5nZXRNZXRhTW9kZWwoKVxuXHRcdFx0XHRcdC5nZXRPYmplY3QoYCR7b0NvbnRyb2wuZGF0YShcInRhcmdldENvbGxlY3Rpb25QYXRoXCIpfUBgKSxcblx0XHRcdFx0XHRtQ2hhcnRDdXN0b21BZ2dyZWdhdGVzID0gTWV0YU1vZGVsVXRpbC5nZXRBbGxDdXN0b21BZ2dyZWdhdGVzKG9FbnRpdHlTZXRBbm5vdGF0aW9ucyk7XG5cdFx0XHRcdE9iamVjdC5rZXlzKG1DaGFydEN1c3RvbUFnZ3JlZ2F0ZXMpLmZvckVhY2goZnVuY3Rpb24gKHNBZ2dyZWdhdGVOYW1lOiBzdHJpbmcpIHtcblx0XHRcdFx0XHRpZiAoIW1BZ2dyZWdhdGVkUHJvcGVydGllc1tzQWdncmVnYXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9BZ2dyZWdhdGUgPSBtQ2hhcnRDdXN0b21BZ2dyZWdhdGVzW3NBZ2dyZWdhdGVOYW1lXTtcblx0XHRcdFx0XHRcdG1BZ2dyZWdhdGVkUHJvcGVydGllc1tzQWdncmVnYXRlTmFtZV0gPSBvQWdncmVnYXRlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoY29uc3Qgc1Byb3BlcnR5IGluIG1Db25kaXRpb25zKSB7XG5cdFx0XHRcdC8vIE5lZWQgdG8gY2hlY2sgdGhlIGxlbmd0aCBvZiBtQ29uZGl0aW9uc1tzUHJvcGVydHldIHNpbmNlIHByZXZpb3VzIGZpbHRlcmVkIHByb3BlcnRpZXMgYXJlIGtlcHQgaW50byBtQ29uZGl0aW9ucyB3aXRoIGVtcHR5IGFycmF5IGFzIGRlZmluaXRpb25cblx0XHRcdFx0Y29uc3QgYUNvbmRpdGlvblByb3BlcnR5ID0gbUNvbmRpdGlvbnNbc1Byb3BlcnR5XTtcblx0XHRcdFx0bGV0IHR5cGVDaGVjayA9IHRydWU7XG5cdFx0XHRcdGlmIChjaGFydEVudGl0eVR5cGVBbm5vdGF0aW9uc1tzUHJvcGVydHldICYmIG9GaWx0ZXJCYXJFbnRpdHlTZXRBbm5vdGF0aW9uc1tzUHJvcGVydHldKSB7XG5cdFx0XHRcdFx0dHlwZUNoZWNrID0gY2hhcnRFbnRpdHlUeXBlQW5ub3RhdGlvbnNbc1Byb3BlcnR5XVtcIiRUeXBlXCJdID09PSBvRmlsdGVyQmFyRW50aXR5U2V0QW5ub3RhdGlvbnNbc1Byb3BlcnR5XVtcIiRUeXBlXCJdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRBcnJheS5pc0FycmF5KGFDb25kaXRpb25Qcm9wZXJ0eSkgJiZcblx0XHRcdFx0XHRhQ29uZGl0aW9uUHJvcGVydHkubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdCgoKCFtVGFyZ2V0UHJvcGVydGllc1tzUHJvcGVydHldIHx8IChtVGFyZ2V0UHJvcGVydGllc1tzUHJvcGVydHldICYmICF0eXBlQ2hlY2spKSAmJlxuXHRcdFx0XHRcdFx0KCFiSXNGaWx0ZXJCYXJFbnRpdHlUeXBlIHx8IChzUHJvcGVydHkgPT09IFwiJGVkaXRTdGF0ZVwiICYmIGJJc0NoYXJ0KSkpIHx8XG5cdFx0XHRcdFx0XHRtQWdncmVnYXRlZFByb3BlcnRpZXNbc1Byb3BlcnR5XSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YU5vdEFwcGxpY2FibGUucHVzaChzUHJvcGVydHkucmVwbGFjZSgvXFwrfFxcKi9nLCBcIlwiKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCFiRW5hYmxlU2VhcmNoICYmIG9GaWx0ZXJCYXIuZ2V0U2VhcmNoKCkpIHtcblx0XHRcdGFOb3RBcHBsaWNhYmxlLnB1c2goXCIkc2VhcmNoXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gYU5vdEFwcGxpY2FibGU7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZmlsdGVyIHZhbHVlcyBmb3IgdGhlIGdpdmVuIHByb3BlcnR5IGluIHRoZSBmaWx0ZXIgYmFyLlxuXHQgKiBUaGUgZmlsdGVyIHZhbHVlcyBjYW4gYmUgZWl0aGVyIGEgc2luZ2xlIHZhbHVlIG9yIGFuIGFycmF5IG9mIHZhbHVlcy5cblx0ICogRWFjaCBmaWx0ZXIgdmFsdWUgbXVzdCBiZSByZXByZXNlbnRlZCBhcyBhIHByaW1pdGl2ZSB2YWx1ZS5cblx0ICpcblx0ICogQHBhcmFtIG9GaWx0ZXJCYXIgVGhlIGZpbHRlciBiYXIgdGhhdCBjb250YWlucyB0aGUgZmlsdGVyIGZpZWxkXG5cdCAqIEBwYXJhbSBzQ29uZGl0aW9uUGF0aCBUaGUgcGF0aCB0byB0aGUgcHJvcGVydHkgYXMgYSBjb25kaXRpb24gcGF0aFxuXHQgKiBAcGFyYW0gIHtPYmplY3RbXX0gYXJncyBMaXN0IG9mIG9wdGlvbmFsIHBhcmFtZXRlcnNcblx0ICogIFtzT3BlcmF0b3JdIFRoZSBvcGVyYXRvciB0byBiZSB1c2VkIC0gaWYgbm90IHNldCwgdGhlIGRlZmF1bHQgb3BlcmF0b3IgKEVRKSB3aWxsIGJlIHVzZWRcblx0ICogIFt2VmFsdWVzXSBUaGUgdmFsdWVzIHRvIGJlIGFwcGxpZWQgLSBpZiBzT3BlcmF0b3IgaXMgbWlzc2luZywgdlZhbHVlcyBpcyB1c2VkIGFzIDNyZCBwYXJhbWV0ZXJcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHNldEZpbHRlclZhbHVlczogYXN5bmMgZnVuY3Rpb24gKG9GaWx0ZXJCYXI/OiBhbnksIHNDb25kaXRpb25QYXRoPzogc3RyaW5nLCAuLi5hcmdzOiBhbnkpIHtcblx0XHRsZXQgc09wZXJhdG9yOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBhcmdzPy5bMF07XG5cdFx0bGV0IHZWYWx1ZXM6IHVuZGVmaW5lZCB8IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBzdHJpbmdbXSB8IG51bWJlcltdIHwgYm9vbGVhbltdID0gYXJncz8uWzFdO1xuXG5cdFx0Ly8gRG8gbm90aGluZyB3aGVuIHRoZSBmaWx0ZXIgYmFyIGlzIGhpZGRlblxuXHRcdGlmICghb0ZpbHRlckJhcikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGNvbW1vbiBmaWx0ZXIgT3BlcmF0b3JzIG5lZWQgYSB2YWx1ZS4gRG8gbm90aGluZyBpZiB0aGlzIHZhbHVlIGlzIHVuZGVmaW5lZFxuXHRcdC8vIEJDUDogMjI3MDEzNTI3NFxuXHRcdGlmIChcblx0XHRcdGFyZ3MubGVuZ3RoID09PSAyICYmXG5cdFx0XHQodlZhbHVlcyA9PT0gdW5kZWZpbmVkIHx8IHZWYWx1ZXMgPT09IG51bGwgfHwgdlZhbHVlcyA9PT0gXCJcIikgJiZcblx0XHRcdHNPcGVyYXRvciAmJlxuXHRcdFx0T2JqZWN0LmtleXMoRmlsdGVyT3BlcmF0b3IpLmluZGV4T2Yoc09wZXJhdG9yKSAhPT0gLTFcblx0XHQpIHtcblx0XHRcdExvZy53YXJuaW5nKGBBbiBlbXB0eSBmaWx0ZXIgdmFsdWUgY2Fubm90IGJlIGFwcGxpZWQgd2l0aCB0aGUgJHtzT3BlcmF0b3J9IG9wZXJhdG9yYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIDR0aCBwYXJhbWV0ZXIgaXMgb3B0aW9uYWw7IGlmIHNPcGVyYXRvciBpcyBtaXNzaW5nLCB2VmFsdWVzIGlzIHVzZWQgYXMgM3JkIHBhcmFtZXRlclxuXHRcdC8vIFRoaXMgZG9lcyBub3QgYXBwbHkgZm9yIHNlbWFudGljIGRhdGVzLCBhcyB0aGVzZSBkbyBub3QgcmVxdWlyZSB2VmFsdWVzIChleGNlcHRpb246IFwiTEFTVERBWVNcIiwgMylcblx0XHRpZiAodlZhbHVlcyA9PT0gdW5kZWZpbmVkICYmICFTZW1hbnRpY0RhdGVPcGVyYXRvcnMuZ2V0U2VtYW50aWNEYXRlT3BlcmF0aW9ucygpLmluY2x1ZGVzKHNPcGVyYXRvciB8fCBcIlwiKSkge1xuXHRcdFx0dlZhbHVlcyA9IHNPcGVyYXRvciA/PyBbXTtcblx0XHRcdHNPcGVyYXRvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBJZiBzT3BlcmF0b3IgaXMgbm90IHNldCwgdXNlIEVRIGFzIGRlZmF1bHRcblx0XHRpZiAoIXNPcGVyYXRvcikge1xuXHRcdFx0c09wZXJhdG9yID0gRmlsdGVyT3BlcmF0b3IuRVE7XG5cdFx0fVxuXG5cdFx0Ly8gU3VwcG9ydGVkIGFycmF5IHR5cGVzOlxuXHRcdC8vICAtIFNpbmdsZSBWYWx1ZXM6XHRcIjJcIiB8IFtcIjJcIl1cblx0XHQvLyAgLSBNdWx0aXBsZSBWYWx1ZXM6XHRbXCIyXCIsIFwiM1wiXVxuXHRcdC8vICAtIFJhbmdlczpcdFx0XHRbXCIyXCIsXCIzXCJdXG5cdFx0Ly8gVW5zdXBwb3J0ZWQgYXJyYXkgdHlwZXM6XG5cdFx0Ly8gIC0gTXVsdGlwbGUgUmFuZ2VzOlx0W1tcIjJcIixcIjNcIl1dIHwgW1tcIjJcIixcIjNcIl0sW1wiNFwiLFwiNVwiXV1cblx0XHRjb25zdCBzdXBwb3J0ZWRWYWx1ZVR5cGVzID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcblx0XHRpZiAoXG5cdFx0XHR2VmFsdWVzICE9PSB1bmRlZmluZWQgJiZcblx0XHRcdCgoIUFycmF5LmlzQXJyYXkodlZhbHVlcykgJiYgIXN1cHBvcnRlZFZhbHVlVHlwZXMuaW5jbHVkZXModHlwZW9mIHZWYWx1ZXMpKSB8fFxuXHRcdFx0XHQoQXJyYXkuaXNBcnJheSh2VmFsdWVzKSAmJiB2VmFsdWVzLmxlbmd0aCA+IDAgJiYgIXN1cHBvcnRlZFZhbHVlVHlwZXMuaW5jbHVkZXModHlwZW9mIHZWYWx1ZXNbMF0pKSlcblx0XHQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XCJGaWx0ZXJVdGlscy5qcyNfc2V0RmlsdGVyVmFsdWVzOiBGaWx0ZXIgdmFsdWUgbm90IHN1cHBvcnRlZDsgb25seSBwcmltaXRpdmUgdmFsdWVzIG9yIGFuIGFycmF5IHRoZXJlb2YgY2FuIGJlIHVzZWQuXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGxldCB2YWx1ZXM6IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgbnVsbClbXSB8IHVuZGVmaW5lZDtcblx0XHRpZiAodlZhbHVlcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZXMgPSBBcnJheS5pc0FycmF5KHZWYWx1ZXMpID8gdlZhbHVlcyA6IFt2VmFsdWVzXTtcblx0XHR9XG5cblx0XHRsZXQgZmlsdGVyOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cdFx0aWYgKHNDb25kaXRpb25QYXRoKSB7XG5cdFx0XHRpZiAodmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKHNPcGVyYXRvciA9PT0gRmlsdGVyT3BlcmF0b3IuQlQpIHtcblx0XHRcdFx0XHQvLyBUaGUgb3BlcmF0b3IgQlQgcmVxdWlyZXMgb25lIGNvbmRpdGlvbiB3aXRoIGJvdGggdGhyZXNob2xkc1xuXHRcdFx0XHRcdGZpbHRlcltzQ29uZGl0aW9uUGF0aF0gPSBbQ29uZGl0aW9uLmNyZWF0ZUNvbmRpdGlvbihzT3BlcmF0b3IsIHZhbHVlcywgbnVsbCwgbnVsbCwgQ29uZGl0aW9uVmFsaWRhdGVkLk5vdFZhbGlkYXRlZCldO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFJlZ3VsYXIgc2luZ2xlIGFuZCBtdWx0aSB2YWx1ZSBjb25kaXRpb25zLCBpZiB0aGVyZSBhcmUgbm8gdmFsdWVzLCB3ZSBkbyBub3Qgd2FudCBhbnkgY29uZGl0aW9uc1xuXHRcdFx0XHRcdGZpbHRlcltzQ29uZGl0aW9uUGF0aF0gPSB2YWx1ZXMubWFwKCh2YWx1ZSkgPT5cblx0XHRcdFx0XHRcdENvbmRpdGlvbi5jcmVhdGVDb25kaXRpb24oc09wZXJhdG9yISwgW3ZhbHVlXSwgbnVsbCwgbnVsbCwgQ29uZGl0aW9uVmFsaWRhdGVkLk5vdFZhbGlkYXRlZClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCFTZW1hbnRpY0RhdGVPcGVyYXRvcnMuZ2V0U2VtYW50aWNEYXRlT3BlcmF0aW9ucygpLmluY2x1ZGVzKHNPcGVyYXRvciB8fCBcIlwiKSkge1xuXHRcdFx0XHRjb25zdCBvU3RhdGUgPSBhd2FpdCBTdGF0ZVV0aWwucmV0cmlldmVFeHRlcm5hbFN0YXRlKG9GaWx0ZXJCYXIpO1xuXHRcdFx0XHRpZiAob1N0YXRlLmZpbHRlcltzQ29uZGl0aW9uUGF0aF0pIHtcblx0XHRcdFx0XHRvU3RhdGUuZmlsdGVyW3NDb25kaXRpb25QYXRoXS5mb3JFYWNoKChvQ29uZGl0aW9uOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdG9Db25kaXRpb24uZmlsdGVyZWQgPSBmYWxzZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRmaWx0ZXIgPSBvU3RhdGUuZmlsdGVyO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyB2VmFsdWVzIGlzIHVuZGVmaW5lZCwgc28gdGhlIG9wZXJhdG9yIGlzIGEgc2VtYW50aWMgZGF0ZSB0aGF0IGRvZXMgbm90IG5lZWQgdmFsdWVzIChzZWUgYWJvdmUpXG5cdFx0XHRcdGZpbHRlcltzQ29uZGl0aW9uUGF0aF0gPSBbQ29uZGl0aW9uLmNyZWF0ZUNvbmRpdGlvbihzT3BlcmF0b3IsIFtdLCBudWxsLCBudWxsLCBDb25kaXRpb25WYWxpZGF0ZWQuTm90VmFsaWRhdGVkKV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGF3YWl0IFN0YXRlVXRpbC5hcHBseUV4dGVybmFsU3RhdGUob0ZpbHRlckJhciwgeyBmaWx0ZXIgfSk7XG5cdH0sXG5cdGNvbmRpdGlvblRvTW9kZWxQYXRoOiBmdW5jdGlvbiAoc0NvbmRpdGlvblBhdGg6IHN0cmluZykge1xuXHRcdC8vIG1ha2UgdGhlIHBhdGggdXNhYmxlIGFzIG1vZGVsIHByb3BlcnR5LCB0aGVyZWZvcmUgc2xhc2hlcyBiZWNvbWUgYmFja3NsYXNoZXNcblx0XHRyZXR1cm4gc0NvbmRpdGlvblBhdGgucmVwbGFjZSgvXFwvL2csIFwiXFxcXFwiKTtcblx0fSxcblx0X2dldEZpbHRlck1ldGFNb2RlbDogZnVuY3Rpb24gKG9GaWx0ZXJDb250cm9sOiBhbnksIG1ldGFNb2RlbD86IE1ldGFNb2RlbCkge1xuXHRcdHJldHVybiBtZXRhTW9kZWwgfHwgb0ZpbHRlckNvbnRyb2wuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0fSxcblx0X2dldEVudGl0eVNldFBhdGg6IGZ1bmN0aW9uIChzRW50aXR5VHlwZVBhdGg6IGFueSkge1xuXHRcdHJldHVybiBzRW50aXR5VHlwZVBhdGggJiYgTW9kZWxIZWxwZXIuZ2V0RW50aXR5U2V0UGF0aChzRW50aXR5VHlwZVBhdGgpO1xuXHR9LFxuXG5cdF9nZXRGaWVsZHNGb3JUYWJsZTogZnVuY3Rpb24gKG9GaWx0ZXJDb250cm9sOiBhbnksIHNFbnRpdHlUeXBlUGF0aD86IGFueSkge1xuXHRcdGNvbnN0IGxyVGFibGVzOiBhbnlbXSA9IFtdO1xuXHRcdC8qKlxuXHRcdCAqIEdldHMgZmllbGRzIGZyb21cblx0XHQgKiBcdC0gZGlyZWN0IGVudGl0eSBwcm9wZXJ0aWVzLFxuXHRcdCAqIFx0LSBuYXZpZ2F0ZVByb3BlcnRpZXMga2V5IGluIHRoZSBtYW5pZmVzdCBpZiB0aGVzZSBwcm9wZXJ0aWVzIGFyZSBrbm93biBieSB0aGUgZW50aXR5XG5cdFx0ICogIC0gYW5ub3RhdGlvbiBcIlNlbGVjdGlvbkZpZWxkc1wiXG5cdFx0ICovXG5cdFx0aWYgKHNFbnRpdHlUeXBlUGF0aCkge1xuXHRcdFx0Y29uc3Qgb1ZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KG9GaWx0ZXJDb250cm9sKTtcblx0XHRcdGNvbnN0IHRhYmxlQ29udHJvbHMgPSBvVmlldyAmJiBvVmlldy5vQ29udHJvbGxlciAmJiBvVmlldy5vQ29udHJvbGxlci5fZ2V0Q29udHJvbHMgJiYgb1ZpZXcub0NvbnRyb2xsZXIuX2dldENvbnRyb2xzKFwidGFibGVcIik7IC8vWzBdLmdldFBhcmVudCgpLmdldFRhYmxlRGVmaW5pdGlvbigpO1xuXHRcdFx0aWYgKHRhYmxlQ29udHJvbHMpIHtcblx0XHRcdFx0dGFibGVDb250cm9scy5mb3JFYWNoKGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdFx0XHRcdGxyVGFibGVzLnB1c2gob1RhYmxlLmdldFBhcmVudCgpLmdldFRhYmxlRGVmaW5pdGlvbigpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbHJUYWJsZXM7XG5cdFx0fVxuXHRcdHJldHVybiBbXTtcblx0fSxcblx0X2dldFNlbGVjdGlvbkZpZWxkczogZnVuY3Rpb24gKFxuXHRcdG9GaWx0ZXJDb250cm9sOiBhbnksXG5cdFx0c0VudGl0eVR5cGVQYXRoOiBzdHJpbmcsXG5cdFx0c0ZpbHRlckVudGl0eVR5cGVQYXRoOiBzdHJpbmcsXG5cdFx0Y29udGV4dFBhdGg6IHN0cmluZyxcblx0XHRsclRhYmxlczogYW55W10sXG5cdFx0b01ldGFNb2RlbDogYW55LFxuXHRcdG9Db252ZXJ0ZXJDb250ZXh0OiBhbnksXG5cdFx0aW5jbHVkZUhpZGRlbj86IGJvb2xlYW4sXG5cdFx0b01vZGlmaWVyPzogYW55LFxuXHRcdGxpbmVJdGVtVGVybT86IHN0cmluZ1xuXHQpIHtcblx0XHRsZXQgYVNlbGVjdGlvbkZpZWxkcyA9IEZpbHRlckJhckNvbnZlcnRlci5nZXRTZWxlY3Rpb25GaWVsZHMoXG5cdFx0XHRvQ29udmVydGVyQ29udGV4dCxcblx0XHRcdGxyVGFibGVzLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0aW5jbHVkZUhpZGRlbixcblx0XHRcdGxpbmVJdGVtVGVybVxuXHRcdCkuc2VsZWN0aW9uRmllbGRzO1xuXHRcdGlmIChcblx0XHRcdChvTW9kaWZpZXJcblx0XHRcdFx0PyBvTW9kaWZpZXIuZ2V0Q29udHJvbFR5cGUob0ZpbHRlckNvbnRyb2wpID09PSBcInNhcC51aS5tZGMuRmlsdGVyQmFyXCJcblx0XHRcdFx0OiBvRmlsdGVyQ29udHJvbC5pc0EoXCJzYXAudWkubWRjLkZpbHRlckJhclwiKSkgJiZcblx0XHRcdHNFbnRpdHlUeXBlUGF0aCAhPT0gc0ZpbHRlckVudGl0eVR5cGVQYXRoXG5cdFx0KSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIFdlIGFyZSBvbiBtdWx0aSBlbnRpdHkgc2V0cyBzY2VuYXJpbyBzbyB3ZSBhZGQgYW5ub3RhdGlvbiBcIlNlbGVjdGlvbkZpZWxkc1wiXG5cdFx0XHQgKiBmcm9tIEZpbHRlckJhciBlbnRpdHkgaWYgdGhlc2UgcHJvcGVydGllcyBhcmUga25vd24gYnkgdGhlIGVudGl0eVxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBvVmlzdWFsaXphdGlvbk9iamVjdFBhdGggPSBNZXRhTW9kZWxDb252ZXJ0ZXIuZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzKG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoY29udGV4dFBhdGgpKTtcblx0XHRcdGNvbnN0IG9QYWdlQ29udGV4dCA9IG9Db252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlckNvbnRleHRGb3Ioc0ZpbHRlckVudGl0eVR5cGVQYXRoKTtcblx0XHRcdGNvbnN0IGFGaWx0ZXJCYXJTZWxlY3Rpb25GaWVsZHNBbm5vdGF0aW9uOiBhbnkgPVxuXHRcdFx0XHRvUGFnZUNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24oXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uRmllbGRzXCIpLmFubm90YXRpb24gfHwgW107XG5cdFx0XHRjb25zdCBtYXBTZWxlY3Rpb25GaWVsZHM6IGFueSA9IHt9O1xuXHRcdFx0YVNlbGVjdGlvbkZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChvU2VsZWN0aW9uRmllbGQ6IGFueSkge1xuXHRcdFx0XHRtYXBTZWxlY3Rpb25GaWVsZHNbb1NlbGVjdGlvbkZpZWxkLmNvbmRpdGlvblBhdGhdID0gdHJ1ZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRhRmlsdGVyQmFyU2VsZWN0aW9uRmllbGRzQW5ub3RhdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChvRmlsdGVyQmFyU2VsZWN0aW9uRmllbGRBbm5vdGF0aW9uOiBhbnkpIHtcblx0XHRcdFx0Y29uc3Qgc1BhdGggPSBvRmlsdGVyQmFyU2VsZWN0aW9uRmllbGRBbm5vdGF0aW9uLnZhbHVlO1xuXHRcdFx0XHRpZiAoIW1hcFNlbGVjdGlvbkZpZWxkc1tzUGF0aF0pIHtcblx0XHRcdFx0XHRjb25zdCBvRmlsdGVyRmllbGQgPSBGaWx0ZXJCYXJDb252ZXJ0ZXIuZ2V0RmlsdGVyRmllbGQoXG5cdFx0XHRcdFx0XHRzUGF0aCxcblx0XHRcdFx0XHRcdG9Db252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdFx0b1Zpc3VhbGl6YXRpb25PYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0LmVudGl0eVR5cGVcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmIChvRmlsdGVyRmllbGQpIHtcblx0XHRcdFx0XHRcdGFTZWxlY3Rpb25GaWVsZHMucHVzaChvRmlsdGVyRmllbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmIChhU2VsZWN0aW9uRmllbGRzKSB7XG5cdFx0XHRjb25zdCBmaWVsZE5hbWVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0YVNlbGVjdGlvbkZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChvRmllbGQ6IGFueSkge1xuXHRcdFx0XHRmaWVsZE5hbWVzLnB1c2gob0ZpZWxkLmtleSk7XG5cdFx0XHR9KTtcblx0XHRcdGFTZWxlY3Rpb25GaWVsZHMgPSB0aGlzLl9nZXRTZWxlY3Rpb25GaWVsZHNGcm9tUHJvcGVydHlJbmZvcyhvRmlsdGVyQ29udHJvbCwgZmllbGROYW1lcywgYVNlbGVjdGlvbkZpZWxkcyk7XG5cdFx0fVxuXHRcdHJldHVybiBhU2VsZWN0aW9uRmllbGRzO1xuXHR9LFxuXHRfZ2V0U2VsZWN0aW9uRmllbGRzRnJvbVByb3BlcnR5SW5mb3M6IGZ1bmN0aW9uIChvRmlsdGVyQ29udHJvbDogYW55LCBmaWVsZE5hbWVzOiBhbnksIGFTZWxlY3Rpb25GaWVsZHM6IGFueSkge1xuXHRcdGNvbnN0IHByb3BlcnR5SW5mb0ZpZWxkcyA9IChvRmlsdGVyQ29udHJvbC5nZXRQcm9wZXJ0eUluZm8gJiYgb0ZpbHRlckNvbnRyb2wuZ2V0UHJvcGVydHlJbmZvKCkpIHx8IFtdO1xuXHRcdHByb3BlcnR5SW5mb0ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChvUHJvcDogYW55KSB7XG5cdFx0XHRpZiAob1Byb3AubmFtZSA9PT0gXCIkc2VhcmNoXCIgfHwgb1Byb3AubmFtZSA9PT0gXCIkZWRpdFN0YXRlXCIpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2VsRmllbGQgPSBhU2VsZWN0aW9uRmllbGRzW2ZpZWxkTmFtZXMuaW5kZXhPZihvUHJvcC5rZXkpXTtcblx0XHRcdGlmIChmaWVsZE5hbWVzLmluZGV4T2Yob1Byb3Aua2V5KSAhPT0gLTEgJiYgc2VsRmllbGQuYW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdFx0b1Byb3AuZ3JvdXAgPSBzZWxGaWVsZC5ncm91cDtcblx0XHRcdFx0b1Byb3AuZ3JvdXBMYWJlbCA9IHNlbEZpZWxkLmdyb3VwTGFiZWw7XG5cdFx0XHRcdG9Qcm9wLnNldHRpbmdzID0gc2VsRmllbGQuc2V0dGluZ3M7XG5cdFx0XHRcdG9Qcm9wLnZpc3VhbEZpbHRlciA9IHNlbEZpZWxkLnZpc3VhbEZpbHRlcjtcblx0XHRcdFx0b1Byb3AubGFiZWwgPSBzZWxGaWVsZC5sYWJlbDtcblx0XHRcdFx0YVNlbGVjdGlvbkZpZWxkc1tmaWVsZE5hbWVzLmluZGV4T2Yob1Byb3Aua2V5KV0gPSBvUHJvcDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZpZWxkTmFtZXMuaW5kZXhPZihvUHJvcC5rZXkpID09PSAtMSAmJiAhb1Byb3AuYW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdFx0YVNlbGVjdGlvbkZpZWxkcy5wdXNoKG9Qcm9wKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gYVNlbGVjdGlvbkZpZWxkcztcblx0fSxcblx0X2dldFNlYXJjaEZpZWxkOiBmdW5jdGlvbiAob0lGaWx0ZXI6IGFueSwgYUlnbm9yZVByb3BlcnRpZXM6IGFueSkge1xuXHRcdHJldHVybiBvSUZpbHRlci5nZXRTZWFyY2ggJiYgYUlnbm9yZVByb3BlcnRpZXMuaW5kZXhPZihcInNlYXJjaFwiKSA9PT0gLTEgPyBvSUZpbHRlci5nZXRTZWFyY2goKSA6IG51bGw7XG5cdH0sXG5cdF9nZXRGaWx0ZXJDb25kaXRpb25zOiBmdW5jdGlvbiAobVByb3BlcnRpZXM6IGFueSwgbUZpbHRlckNvbmRpdGlvbnM6IGFueSwgb0lGaWx0ZXI6IGFueSkge1xuXHRcdGNvbnN0IG1Db25kaXRpb25zID0gbUZpbHRlckNvbmRpdGlvbnMgfHwgb0lGaWx0ZXIuZ2V0Q29uZGl0aW9ucygpO1xuXHRcdGlmIChtUHJvcGVydGllcyAmJiBtUHJvcGVydGllcy50YXJnZXRDb250cm9sICYmIG1Qcm9wZXJ0aWVzLnRhcmdldENvbnRyb2wuaXNBKFwic2FwLnVpLm1kYy5DaGFydFwiKSkge1xuXHRcdFx0T2JqZWN0LmtleXMobUNvbmRpdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKHNLZXk6IHN0cmluZykge1xuXHRcdFx0XHRpZiAoc0tleSA9PT0gXCIkZWRpdFN0YXRlXCIpIHtcblx0XHRcdFx0XHRkZWxldGUgbUNvbmRpdGlvbnNbXCIkZWRpdFN0YXRlXCJdO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG1Db25kaXRpb25zO1xuXHR9LFxuXHRfZ2V0RmlsdGVyUHJvcGVydGllc01ldGFkYXRhOiBmdW5jdGlvbiAoYUZpbHRlclByb3BlcnRpZXNNZXRhZGF0YTogYW55LCBvSUZpbHRlcjogYW55KSB7XG5cdFx0aWYgKCEoYUZpbHRlclByb3BlcnRpZXNNZXRhZGF0YSAmJiBhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhLmxlbmd0aCkpIHtcblx0XHRcdGlmIChvSUZpbHRlci5nZXRQcm9wZXJ0eUluZm8pIHtcblx0XHRcdFx0YUZpbHRlclByb3BlcnRpZXNNZXRhZGF0YSA9IG9JRmlsdGVyLmdldFByb3BlcnR5SW5mbygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YUZpbHRlclByb3BlcnRpZXNNZXRhZGF0YSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhO1xuXHR9LFxuXHRfZ2V0SWdub3JlZFByb3BlcnRpZXM6IGZ1bmN0aW9uIChhRmlsdGVyUHJvcGVydGllc01ldGFkYXRhOiBhbnksIG1FbnRpdHlQcm9wZXJ0aWVzOiBhbnkpIHtcblx0XHRjb25zdCBhSWdub3JlUHJvcGVydGllczogYW55ID0gW107XG5cdFx0YUZpbHRlclByb3BlcnRpZXNNZXRhZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChvSUZpbHRlclByb3BlcnR5OiBhbnkpIHtcblx0XHRcdGNvbnN0IHNJRmlsdGVyUHJvcGVydHlOYW1lID0gb0lGaWx0ZXJQcm9wZXJ0eS5uYW1lO1xuXHRcdFx0Y29uc3QgbUVudGl0eVByb3BlcnRpZXNDdXJyZW50ID0gbUVudGl0eVByb3BlcnRpZXNbc0lGaWx0ZXJQcm9wZXJ0eU5hbWVdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRtRW50aXR5UHJvcGVydGllc0N1cnJlbnQgJiZcblx0XHRcdFx0KCFtRW50aXR5UHJvcGVydGllc0N1cnJlbnRbXCJoYXNQcm9wZXJ0eVwiXSB8fFxuXHRcdFx0XHRcdChtRW50aXR5UHJvcGVydGllc0N1cnJlbnRbXCJoYXNQcm9wZXJ0eVwiXSAmJiBvSUZpbHRlclByb3BlcnR5LmRhdGFUeXBlICE9PSBtRW50aXR5UHJvcGVydGllc0N1cnJlbnQuZGF0YVR5cGUpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGFJZ25vcmVQcm9wZXJ0aWVzLnB1c2goc0lGaWx0ZXJQcm9wZXJ0eU5hbWUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBhSWdub3JlUHJvcGVydGllcztcblx0fSxcblx0Z2V0RmlsdGVyczogZnVuY3Rpb24gKGZpbHRlckJhcjogRmlsdGVyQmFyKSB7XG5cdFx0Y29uc3QgeyBmaWx0ZXJzLCBzZWFyY2ggfSA9IHRoaXMuZ2V0RmlsdGVySW5mbyhmaWx0ZXJCYXIpO1xuXG5cdFx0cmV0dXJuIHsgZmlsdGVycywgc2VhcmNoIH07XG5cdH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBvRmlsdGVyVXRpbHM7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQTJCQSxJQUFNQSxZQUFZLEdBQUc7SUFDcEJDLFNBQVMsRUFBRSxVQUFVQyxRQUFWLEVBQXlCO01BQ25DLElBQU1DLFFBQVEsR0FBR0gsWUFBWSxDQUFDSSxhQUFiLENBQTJCRixRQUEzQixFQUFxQ0csT0FBdEQ7TUFDQSxPQUFPRixRQUFRLENBQUNHLE1BQVQsR0FBa0IsSUFBSUMsTUFBSixDQUFXUCxZQUFZLENBQUNJLGFBQWIsQ0FBMkJGLFFBQTNCLEVBQXFDRyxPQUFoRCxFQUF5RCxLQUF6RCxDQUFsQixHQUFvRkcsU0FBM0Y7SUFDQSxDQUptQjtJQUtwQkMsY0FBYyxFQUFFLFVBQVVDLFlBQVYsRUFBZ0NDLGdCQUFoQyxFQUFvRUMsVUFBcEUsRUFBNEY7TUFDM0csT0FBT0Msa0JBQWtCLENBQUNKLGNBQW5CLENBQWtDQyxZQUFsQyxFQUFnREMsZ0JBQWhELEVBQWtFQyxVQUFsRSxDQUFQO0lBQ0EsQ0FQbUI7SUFRcEJFLGdCQUFnQixFQUFFLFVBQVVDLGlCQUFWLEVBQWtDSixnQkFBbEMsRUFBc0U7TUFDdkYsSUFBSUssYUFBSjtNQUNBLElBQU1DLFdBQWdCLEdBQUcsRUFB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