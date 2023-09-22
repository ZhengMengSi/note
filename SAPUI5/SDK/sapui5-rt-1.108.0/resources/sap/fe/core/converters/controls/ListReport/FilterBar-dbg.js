/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/controls/Common/Table", "sap/fe/core/converters/controls/ListReport/VisualFilters", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "../../ManifestSettings", "../Common/DataVisualization"], function (Table, VisualFilters, ConfigurableObject, IssueManager, Key, BindingToolkit, ModelHelper, ManifestSettings, DataVisualization) {
  "use strict";

  var _exports = {};
  var getSelectionVariant = DataVisualization.getSelectionVariant;
  var AvailabilityType = ManifestSettings.AvailabilityType;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var compileExpression = BindingToolkit.compileExpression;
  var KeyHelper = Key.KeyHelper;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getVisualFilters = VisualFilters.getVisualFilters;
  var isFilteringCaseSensitive = Table.isFilteringCaseSensitive;
  var getTypeConfig = Table.getTypeConfig;
  var getSelectionVariantConfiguration = Table.getSelectionVariantConfiguration;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var filterFieldType;

  (function (filterFieldType) {
    filterFieldType["Default"] = "Default";
    filterFieldType["Slot"] = "Slot";
  })(filterFieldType || (filterFieldType = {}));

  var sEdmString = "Edm.String";
  var sStringDataType = "sap.ui.model.odata.type.String";

  /**
   * Enter all DataFields of a given FieldGroup into the filterFacetMap.
   *
   * @param fieldGroup
   * @returns The map of facets for the given FieldGroup
   */
  function getFieldGroupFilterGroups(fieldGroup) {
    var filterFacetMap = {};
    fieldGroup.Data.forEach(function (dataField) {
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
        var _fieldGroup$annotatio, _fieldGroup$annotatio2;

        filterFacetMap[dataField.Value.path] = {
          group: fieldGroup.fullyQualifiedName,
          groupLabel: compileExpression(getExpressionFromAnnotation(fieldGroup.Label || ((_fieldGroup$annotatio = fieldGroup.annotations) === null || _fieldGroup$annotatio === void 0 ? void 0 : (_fieldGroup$annotatio2 = _fieldGroup$annotatio.Common) === null || _fieldGroup$annotatio2 === void 0 ? void 0 : _fieldGroup$annotatio2.Label) || fieldGroup.qualifier)) || fieldGroup.qualifier
        };
      }
    });
    return filterFacetMap;
  }

  function getExcludedFilterProperties(selectionVariants) {
    return selectionVariants.reduce(function (previousValue, selectionVariant) {
      selectionVariant.propertyNames.forEach(function (propertyName) {
        previousValue[propertyName] = true;
      });
      return previousValue;
    }, {});
  }
  /**
   * Check that all the tables for a dedicated entity set are configured as analytical tables.
   *
   * @param listReportTables List report tables
   * @param contextPath
   * @returns Is FilterBar search field hidden or not
   */


  function checkAllTableForEntitySetAreAnalytical(listReportTables, contextPath) {
    if (contextPath && listReportTables.length > 0) {
      return listReportTables.every(function (visualization) {
        return visualization.enableAnalytics && contextPath === visualization.annotation.collection;
      });
    }

    return false;
  }

  function getSelectionVariants(lrTableVisualizations, converterContext) {
    var selectionVariantPaths = [];
    return lrTableVisualizations.map(function (visualization) {
      var tableFilters = visualization.control.filters;
      var tableSVConfigs = [];

      for (var _key in tableFilters) {
        if (Array.isArray(tableFilters[_key].paths)) {
          var paths = tableFilters[_key].paths;
          paths.forEach(function (path) {
            if (path && path.annotationPath && selectionVariantPaths.indexOf(path.annotationPath) === -1) {
              selectionVariantPaths.push(path.annotationPath);
              var selectionVariantConfig = getSelectionVariantConfiguration(path.annotationPath, converterContext);

              if (selectionVariantConfig) {
                tableSVConfigs.push(selectionVariantConfig);
              }
            }
          });
        }
      }

      return tableSVConfigs;
    }).reduce(function (svConfigs, selectionVariant) {
      return svConfigs.concat(selectionVariant);
    }, []);
  }
  /**
   * Returns the condition path required for the condition model. It looks as follows:
   * <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
   *
   * @param entityType The root EntityType
   * @param propertyPath The full path to the target property
   * @returns The formatted condition path
   */


  var _getConditionPath = function (entityType, propertyPath) {
    var parts = propertyPath.split("/");
    var partialPath;
    var key = "";

    while (parts.length) {
      var part = parts.shift();
      partialPath = partialPath ? "".concat(partialPath, "/").concat(part) : part;
      var property = entityType.resolvePath(partialPath);

      if (property._type === "NavigationProperty" && property.isCollection) {
        part += "*";
      }

      key = key ? "".concat(key, "/").concat(part) : part;
    }

    return key;
  };

  var _createFilterSelectionField = function (entityType, property, fullPropertyPath, includeHidden, converterContext) {
    var _property$annotations, _property$annotations2, _property$annotations3;

    // ignore complex property types and hidden annotated ones
    if (property !== undefined && property.targetType === undefined && (includeHidden || ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) !== true)) {
      var _property$annotations4, _property$annotations5, _property$annotations6, _property$annotations7, _property$annotations8, _targetEntityType$ann, _targetEntityType$ann2, _targetEntityType$ann3;

      var targetEntityType = converterContext.getAnnotationEntityType(property);
      return {
        key: KeyHelper.getSelectionFieldKeyFromPath(fullPropertyPath),
        annotationPath: converterContext.getAbsoluteAnnotationPath(fullPropertyPath),
        conditionPath: _getConditionPath(entityType, fullPropertyPath),
        availability: ((_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.UI) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.HiddenFilter) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.valueOf()) === true ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
        label: compileExpression(getExpressionFromAnnotation(((_property$annotations7 = property.annotations.Common) === null || _property$annotations7 === void 0 ? void 0 : (_property$annotations8 = _property$annotations7.Label) === null || _property$annotations8 === void 0 ? void 0 : _property$annotations8.valueOf()) || property.name)),
        group: targetEntityType.name,
        groupLabel: compileExpression(getExpressionFromAnnotation((targetEntityType === null || targetEntityType === void 0 ? void 0 : (_targetEntityType$ann = targetEntityType.annotations) === null || _targetEntityType$ann === void 0 ? void 0 : (_targetEntityType$ann2 = _targetEntityType$ann.Common) === null || _targetEntityType$ann2 === void 0 ? void 0 : (_targetEntityType$ann3 = _targetEntityType$ann2.Label) === null || _targetEntityType$ann3 === void 0 ? void 0 : _targetEntityType$ann3.valueOf()) || targetEntityType.name))
      };
    }

    return undefined;
  };

  function getModelType(sType) {
    var mDefaultTypeForEdmType = {
      "Edm.Boolean": {
        modelType: "Bool"
      },
      "Edm.Byte": {
        modelType: "Int"
      },
      "Edm.Date": {
        modelType: "Date"
      },
      "Edm.DateTime": {
        modelType: "Date"
      },
      "Edm.DateTimeOffset": {
        modelType: "DateTimeOffset"
      },
      "Edm.Decimal": {
        modelType: "Decimal"
      },
      "Edm.Double": {
        modelType: "Float"
      },
      "Edm.Float": {
        modelType: "Float"
      },
      "Edm.Guid": {
        modelType: "Guid"
      },
      "Edm.Int16": {
        modelType: "Int"
      },
      "Edm.Int32": {
        modelType: "Int"
      },
      "Edm.Int64": {
        modelType: "Int"
      },
      "Edm.SByte": {
        modelType: "Int"
      },
      "Edm.Single": {
        modelType: "Float"
      },
      "Edm.String": {
        modelType: "String"
      },
      "Edm.Time": {
        modelType: "TimeOfDay"
      },
      "Edm.TimeOfDay": {
        modelType: "TimeOfDay"
      },
      "Edm.Stream": {//no corresponding modelType - ignore for filtering
      }
    };
    return sType && sType in mDefaultTypeForEdmType && mDefaultTypeForEdmType[sType].modelType;
  }

  _exports.getModelType = getModelType;

  var _getSelectionFields = function (entityType, navigationPath, properties, includeHidden, converterContext) {
    var selectionFieldMap = {};

    if (properties) {
      properties.forEach(function (property) {
        var propertyPath = property.name;
        var fullPath = (navigationPath ? "".concat(navigationPath, "/") : "") + propertyPath;

        var selectionField = _createFilterSelectionField(entityType, property, fullPath, includeHidden, converterContext);

        if (selectionField) {
          selectionFieldMap[fullPath] = selectionField;
        }
      });
    }

    return selectionFieldMap;
  };

  var _getSelectionFieldsByPath = function (entityType, propertyPaths, includeHidden, converterContext) {
    var selectionFields = {};

    if (propertyPaths) {
      propertyPaths.forEach(function (propertyPath) {
        var localSelectionFields;
        var property = entityType.resolvePath(propertyPath);

        if (property === undefined) {
          return;
        }

        if (property._type === "NavigationProperty") {
          // handle navigation properties
          localSelectionFields = _getSelectionFields(entityType, propertyPath, property.targetType.entityProperties, includeHidden, converterContext);
        } else if (property.targetType !== undefined && property.targetType._type === "ComplexType") {
          // handle ComplexType properties
          localSelectionFields = _getSelectionFields(entityType, propertyPath, property.targetType.properties, includeHidden, converterContext);
        } else {
          var navigationPath = propertyPath.includes("/") ? propertyPath.split("/").splice(0, 1).join("/") : "";
          localSelectionFields = _getSelectionFields(entityType, navigationPath, [property], includeHidden, converterContext);
        }

        selectionFields = _objectSpread(_objectSpread({}, selectionFields), localSelectionFields);
      });
    }

    return selectionFields;
  };

  var _getFilterField = function (filterFields, propertyPath, converterContext, entityType) {
    var filterField = filterFields[propertyPath];
    var availability = filterField && filterField.availability;

    if (filterField) {
      delete filterFields[propertyPath];
    } else {
      filterField = _createFilterSelectionField(entityType, entityType.resolvePath(propertyPath), propertyPath, true, converterContext);
    }

    if (!filterField) {
      var _converterContext$get;

      (_converterContext$get = converterContext.getDiagnostics()) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MISSING_SELECTIONFIELD);
    } // defined SelectionFields are available by default


    if (filterField) {
      var _entityType$annotatio, _entityType$annotatio2;

      filterField.availability = availability === AvailabilityType.Hidden ? AvailabilityType.Hidden : AvailabilityType.Default;
      filterField.isParameter = !!((_entityType$annotatio = entityType.annotations) !== null && _entityType$annotatio !== void 0 && (_entityType$annotatio2 = _entityType$annotatio.Common) !== null && _entityType$annotatio2 !== void 0 && _entityType$annotatio2.ResultContext);
    }

    return filterField;
  };

  var _getDefaultFilterFields = function (aSelectOptions, entityType, converterContext, excludedFilterProperties, annotatedSelectionFields) {
    var selectionFields = [];
    var UISelectionFields = {};
    var properties = entityType.entityProperties; // Using entityType instead of entitySet

    annotatedSelectionFields === null || annotatedSelectionFields === void 0 ? void 0 : annotatedSelectionFields.forEach(function (SelectionField) {
      UISelectionFields[SelectionField.value] = true;
    });

    if (aSelectOptions && aSelectOptions.length > 0) {
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var sPropertyPath = propertyName.value;
        var currentSelectionFields = {};
        annotatedSelectionFields === null || annotatedSelectionFields === void 0 ? void 0 : annotatedSelectionFields.forEach(function (SelectionField) {
          currentSelectionFields[SelectionField.value] = true;
        });

        if (!(sPropertyPath in excludedFilterProperties)) {
          if (!(sPropertyPath in currentSelectionFields)) {
            var _FilterField = getFilterField(sPropertyPath, converterContext, entityType);

            if (_FilterField) {
              selectionFields.push(_FilterField);
            }
          }
        }
      });
    } else if (properties) {
      properties.forEach(function (property) {
        var _property$annotations9, _property$annotations10;

        var defaultFilterValue = (_property$annotations9 = property.annotations) === null || _property$annotations9 === void 0 ? void 0 : (_property$annotations10 = _property$annotations9.Common) === null || _property$annotations10 === void 0 ? void 0 : _property$annotations10.FilterDefaultValue;
        var propertyPath = property.name;

        if (!(propertyPath in excludedFilterProperties)) {
          if (defaultFilterValue && !(propertyPath in UISelectionFields)) {
            var _FilterField2 = getFilterField(propertyPath, converterContext, entityType);

            if (_FilterField2) {
              selectionFields.push(_FilterField2);
            }
          }
        }
      });
    }

    return selectionFields;
  };
  /**
   * Get all parameter filter fields in case of a parameterized service.
   *
   * @param converterContext
   * @returns An array of parameter FilterFields
   */


  function _getParameterFields(converterContext) {
    var _parameterEntityType$, _parameterEntityType$2;

    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var parameterEntityType = dataModelObjectPath.startingEntitySet.entityType;
    var isParameterized = !!((_parameterEntityType$ = parameterEntityType.annotations) !== null && _parameterEntityType$ !== void 0 && (_parameterEntityType$2 = _parameterEntityType$.Common) !== null && _parameterEntityType$2 !== void 0 && _parameterEntityType$2.ResultContext) && !dataModelObjectPath.targetEntitySet;
    var parameterConverterContext = isParameterized && converterContext.getConverterContextFor("/".concat(dataModelObjectPath.startingEntitySet.name));
    return parameterConverterContext ? parameterEntityType.entityProperties.map(function (property) {
      return _getFilterField({}, property.name, parameterConverterContext, parameterEntityType);
    }) : [];
  }
  /**
   * Determines if the FilterBar search field is hidden or not.
   *
   * @param listReportTables The list report tables
   * @param charts The ALP charts
   * @param converterContext The converter context
   * @returns The information if the FilterBar search field is hidden or not
   */


  var getFilterBarhideBasicSearch = function (listReportTables, charts, converterContext) {
    // Check if charts allow search
    var noSearchInCharts = charts.length === 0 || charts.every(function (chart) {
      return !chart.applySupported.enableSearch;
    }); // Check if all tables are analytical and none of them allow for search

    var noSearchInTables = listReportTables.length === 0 || listReportTables.every(function (table) {
      return table.enableAnalytics && !table.enableAnalyticsSearch;
    });
    var contextPath = converterContext.getContextPath();

    if (contextPath && noSearchInCharts && noSearchInTables) {
      return true;
    } else {
      return false;
    }
  };
  /**
   * Retrieves filter fields from the manifest.
   *
   * @param entityType The current entityType
   * @param converterContext The converter context
   * @returns The filter fields defined in the manifest
   */


  _exports.getFilterBarhideBasicSearch = getFilterBarhideBasicSearch;

  var getManifestFilterFields = function (entityType, converterContext) {
    var fbConfig = converterContext.getManifestWrapper().getFilterConfiguration();
    var definedFilterFields = (fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.filterFields) || {};

    var selectionFields = _getSelectionFieldsByPath(entityType, Object.keys(definedFilterFields).map(function (key) {
      return KeyHelper.getPathFromSelectionFieldKey(key);
    }), true, converterContext);

    var filterFields = {};

    for (var sKey in definedFilterFields) {
      var filterField = definedFilterFields[sKey];
      var propertyName = KeyHelper.getPathFromSelectionFieldKey(sKey);
      var selectionField = selectionFields[propertyName];
      var type = filterField.type === "Slot" ? filterFieldType.Slot : filterFieldType.Default;
      var visualFilter = filterField && filterField !== null && filterField !== void 0 && filterField.visualFilter ? getVisualFilters(entityType, converterContext, sKey, definedFilterFields) : undefined;
      filterFields[sKey] = {
        key: sKey,
        type: type,
        annotationPath: selectionField === null || selectionField === void 0 ? void 0 : selectionField.annotationPath,
        conditionPath: (selectionField === null || selectionField === void 0 ? void 0 : selectionField.conditionPath) || propertyName,
        template: filterField.template,
        label: filterField.label,
        position: filterField.position || {
          placement: Placement.After
        },
        availability: filterField.availability || AvailabilityType.Default,
        settings: filterField.settings,
        visualFilter: visualFilter,
        required: filterField.required
      };
    }

    return filterFields;
  };

  _exports.getManifestFilterFields = getManifestFilterFields;

  var getFilterField = function (propertyPath, converterContext, entityType) {
    return _getFilterField({}, propertyPath, converterContext, entityType);
  };

  _exports.getFilterField = getFilterField;

  var getFilterRestrictions = function (oFilterRestrictionsAnnotation, sRestriction) {
    if (sRestriction === "RequiredProperties" || sRestriction === "NonFilterableProperties") {
      var aProps = [];

      if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation[sRestriction]) {
        aProps = oFilterRestrictionsAnnotation[sRestriction].map(function (oProperty) {
          return oProperty.$PropertyPath || oProperty.value;
        });
      }

      return aProps;
    } else if (sRestriction === "FilterAllowedExpressions") {
      var mAllowedExpressions = {};

      if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation.FilterExpressionRestrictions) {
        oFilterRestrictionsAnnotation.FilterExpressionRestrictions.forEach(function (oProperty) {
          //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
          if (mAllowedExpressions[oProperty.Property.value]) {
            mAllowedExpressions[oProperty.Property.value].push(oProperty.AllowedExpressions);
          } else {
            mAllowedExpressions[oProperty.Property.value] = [oProperty.AllowedExpressions];
          }
        });
      }

      return mAllowedExpressions;
    }

    return oFilterRestrictionsAnnotation;
  };

  _exports.getFilterRestrictions = getFilterRestrictions;

  var getSearchFilterPropertyInfo = function () {
    return {
      name: "$search",
      path: "$search",
      dataType: sStringDataType,
      maxConditions: 1
    };
  };

  var getEditStateFilterPropertyInfo = function () {
    return {
      name: "$editState",
      path: "$editState",
      groupLabel: "",
      group: "",
      dataType: sStringDataType,
      hiddenFilter: false
    };
  };

  var getSearchRestrictions = function (converterContext) {
    var searchRestrictions;

    if (!ModelHelper.isSingleton(converterContext.getEntitySet())) {
      var _converterContext$get2, _converterContext$get3;

      var capabilites = (_converterContext$get2 = converterContext.getEntitySet()) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.annotations) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.Capabilities;
      searchRestrictions = capabilites === null || capabilites === void 0 ? void 0 : capabilites.SearchRestrictions;
    }

    return searchRestrictions;
  };

  var getNavigationRestrictions = function (converterContext, sNavigationPath) {
    var _converterContext$get4, _converterContext$get5, _converterContext$get6;

    var oNavigationRestrictions = (_converterContext$get4 = converterContext.getEntitySet()) === null || _converterContext$get4 === void 0 ? void 0 : (_converterContext$get5 = _converterContext$get4.annotations) === null || _converterContext$get5 === void 0 ? void 0 : (_converterContext$get6 = _converterContext$get5.Capabilities) === null || _converterContext$get6 === void 0 ? void 0 : _converterContext$get6.NavigationRestrictions;
    var aRestrictedProperties = oNavigationRestrictions && oNavigationRestrictions.RestrictedProperties;
    return aRestrictedProperties && aRestrictedProperties.find(function (oRestrictedProperty) {
      return oRestrictedProperty && oRestrictedProperty.NavigationProperty && (oRestrictedProperty.NavigationProperty.$NavigationPropertyPath === sNavigationPath || oRestrictedProperty.NavigationProperty.value === sNavigationPath);
    });
  };

  _exports.getNavigationRestrictions = getNavigationRestrictions;

  var _fetchBasicPropertyInfo = function (oFilterFieldInfo) {
    return {
      key: oFilterFieldInfo.key,
      annotationPath: oFilterFieldInfo.annotationPath,
      conditionPath: oFilterFieldInfo.conditionPath,
      name: oFilterFieldInfo.conditionPath,
      label: oFilterFieldInfo.label,
      hiddenFilter: oFilterFieldInfo.availability === "Hidden",
      display: "Value",
      isParameter: oFilterFieldInfo.isParameter,
      caseSensitive: oFilterFieldInfo.caseSensitive,
      availability: oFilterFieldInfo.availability,
      position: oFilterFieldInfo.position,
      type: oFilterFieldInfo.type,
      template: oFilterFieldInfo.template,
      menu: oFilterFieldInfo.menu,
      required: oFilterFieldInfo.required
    };
  };

  var getSpecificAllowedExpression = function (aExpressions) {
    var aAllowedExpressionsPriority = ["SingleValue", "MultiValue", "SingleRange", "MultiRange", "SearchExpression", "MultiRangeOrSearchExpression"];
    aExpressions.sort(function (a, b) {
      return aAllowedExpressionsPriority.indexOf(a) - aAllowedExpressionsPriority.indexOf(b);
    });
    return aExpressions[0];
  };

  _exports.getSpecificAllowedExpression = getSpecificAllowedExpression;

  var displayMode = function (oPropertyAnnotations, oCollectionAnnotations) {
    var _oPropertyAnnotations, _oPropertyAnnotations2, _oPropertyAnnotations3, _oPropertyAnnotations4, _oPropertyAnnotations5, _oCollectionAnnotatio;

    var oTextAnnotation = oPropertyAnnotations === null || oPropertyAnnotations === void 0 ? void 0 : (_oPropertyAnnotations = oPropertyAnnotations.Common) === null || _oPropertyAnnotations === void 0 ? void 0 : _oPropertyAnnotations.Text,
        oTextArrangmentAnnotation = oTextAnnotation && (oPropertyAnnotations && (oPropertyAnnotations === null || oPropertyAnnotations === void 0 ? void 0 : (_oPropertyAnnotations2 = oPropertyAnnotations.Common) === null || _oPropertyAnnotations2 === void 0 ? void 0 : (_oPropertyAnnotations3 = _oPropertyAnnotations2.Text) === null || _oPropertyAnnotations3 === void 0 ? void 0 : (_oPropertyAnnotations4 = _oPropertyAnnotations3.annotations) === null || _oPropertyAnnotations4 === void 0 ? void 0 : (_oPropertyAnnotations5 = _oPropertyAnnotations4.UI) === null || _oPropertyAnnotations5 === void 0 ? void 0 : _oPropertyAnnotations5.TextArrangement) || oCollectionAnnotations && (oCollectionAnnotations === null || oCollectionAnnotations === void 0 ? void 0 : (_oCollectionAnnotatio = oCollectionAnnotations.UI) === null || _oCollectionAnnotatio === void 0 ? void 0 : _oCollectionAnnotatio.TextArrangement));

    if (oTextArrangmentAnnotation) {
      if (oTextArrangmentAnnotation.valueOf() === "UI.TextArrangementType/TextOnly") {
        return "Description";
      } else if (oTextArrangmentAnnotation.valueOf() === "UI.TextArrangementType/TextLast") {
        return "ValueDescription";
      }

      return "DescriptionValue"; //TextFirst
    }

    return oTextAnnotation ? "DescriptionValue" : "Value";
  };

  _exports.displayMode = displayMode;

  var fetchPropertyInfo = function (converterContext, oFilterFieldInfo, oTypeConfig) {
    var _converterContext$get7;

    var oPropertyInfo = _fetchBasicPropertyInfo(oFilterFieldInfo);

    var sAnnotationPath = oFilterFieldInfo.annotationPath;

    if (!sAnnotationPath) {
      return oPropertyInfo;
    }

    var targetPropertyObject = converterContext.getConverterContextFor(sAnnotationPath).getDataModelObjectPath().targetObject;
    var oPropertyAnnotations = targetPropertyObject === null || targetPropertyObject === void 0 ? void 0 : targetPropertyObject.annotations;
    var oCollectionAnnotations = converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get7 = converterContext.getDataModelObjectPath().targetObject) === null || _converterContext$get7 === void 0 ? void 0 : _converterContext$get7.annotations;
    var oFormatOptions = oTypeConfig.formatOptions;
    var oConstraints = oTypeConfig.constraints;
    oPropertyInfo = Object.assign(oPropertyInfo, {
      formatOptions: oFormatOptions,
      constraints: oConstraints,
      display: displayMode(oPropertyAnnotations, oCollectionAnnotations)
    });
    return oPropertyInfo;
  };

  _exports.fetchPropertyInfo = fetchPropertyInfo;

  var isMultiValue = function (oProperty) {
    var bIsMultiValue = true; //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

    switch (oProperty.filterExpression) {
      case "SearchExpression":
      case "SingleRange":
      case "SingleValue":
        bIsMultiValue = false;
        break;

      default:
        break;
    }

    if (oProperty.type && oProperty.type.indexOf("Boolean") > 0) {
      bIsMultiValue = false;
    }

    return bIsMultiValue;
  };

  _exports.isMultiValue = isMultiValue;

  var _isFilterableNavigationProperty = function (entry) {
    return (entry.$Type === "com.sap.vocabularies.UI.v1.DataField" || entry.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" || entry.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") && entry.Value.path.includes("/");
  };

  var getAnnotatedSelectionFieldData = function (converterContext) {
    var _converterContext$get8, _entityType$annotatio3, _entityType$annotatio4;

    var lrTables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var annotationPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var includeHidden = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var lineItemTerm = arguments.length > 4 ? arguments[4] : undefined;
    // Fetch all selectionVariants defined in the different visualizations and different views (multi table mode)
    var selectionVariants = getSelectionVariants(lrTables, converterContext); // create a map of properties to be used in selection variants

    var excludedFilterProperties = getExcludedFilterProperties(selectionVariants);
    var entityType = converterContext.getEntityType(); //Filters which has to be added which is part of SV/Default annotations but not present in the SelectionFields

    var annotatedSelectionFields = annotationPath && ((_converterContext$get8 = converterContext.getEntityTypeAnnotation(annotationPath)) === null || _converterContext$get8 === void 0 ? void 0 : _converterContext$get8.annotation) || ((_entityType$annotatio3 = entityType.annotations) === null || _entityType$annotatio3 === void 0 ? void 0 : (_entityType$annotatio4 = _entityType$annotatio3.UI) === null || _entityType$annotatio4 === void 0 ? void 0 : _entityType$annotatio4.SelectionFields) || [];
    var navProperties = [];

    if (lrTables.length === 0 && !!lineItemTerm) {
      var _converterContext$get9;

      (_converterContext$get9 = converterContext.getEntityTypeAnnotation(lineItemTerm).annotation) === null || _converterContext$get9 === void 0 ? void 0 : _converterContext$get9.forEach(function (entry) {
        if (_isFilterableNavigationProperty(entry)) {
          if (!navProperties.includes(entry.Value.path.split("/")[0])) {
            navProperties.push(entry.Value.path.split("/")[0]);
          }
        }
      });
    } // create a map of all potential filter fields based on...


    var filterFields = _objectSpread(_objectSpread(_objectSpread({}, _getSelectionFields(entityType, "", entityType.entityProperties, includeHidden, converterContext)), _getSelectionFieldsByPath(entityType, navProperties, false, converterContext)), _getSelectionFieldsByPath(entityType, converterContext.getManifestWrapper().getFilterConfiguration().navigationProperties, includeHidden, converterContext));

    var aSelectOptions = [];
    var selectionVariant = getSelectionVariant(entityType, converterContext);

    if (selectionVariant) {
      aSelectOptions = selectionVariant.SelectOptions;
    }

    var propertyInfoFields = (annotatedSelectionFields === null || annotatedSelectionFields === void 0 ? void 0 : annotatedSelectionFields.reduce(function (selectionFields, selectionField) {
      var propertyPath = selectionField.value;

      if (!(propertyPath in excludedFilterProperties)) {
        var navigationPath;

        if (annotationPath.startsWith("@com.sap.vocabularies.UI.v1.SelectionFields")) {
          navigationPath = "";
        } else {
          navigationPath = annotationPath.split("/@com.sap.vocabularies.UI.v1.SelectionFields")[0];
        }

        var filterPropertyPath = navigationPath ? navigationPath + "/" + propertyPath : propertyPath;

        var filterField = _getFilterField(filterFields, filterPropertyPath, converterContext, entityType);

        if (filterField) {
          filterField.group = "";
          filterField.groupLabel = "";
          selectionFields.push(filterField);
        }
      }

      return selectionFields;
    }, [])) || [];

    var defaultFilterFields = _getDefaultFilterFields(aSelectOptions, entityType, converterContext, excludedFilterProperties, annotatedSelectionFields);

    return {
      excludedFilterProperties: excludedFilterProperties,
      entityType: entityType,
      annotatedSelectionFields: annotatedSelectionFields,
      filterFields: filterFields,
      propertyInfoFields: propertyInfoFields,
      defaultFilterFields: defaultFilterFields
    };
  };

  var fetchTypeConfig = function (property) {
    var oTypeConfig = getTypeConfig(property, property === null || property === void 0 ? void 0 : property.type);

    if ((property === null || property === void 0 ? void 0 : property.type) === sEdmString && (oTypeConfig.constraints.nullable === undefined || oTypeConfig.constraints.nullable === true)) {
      oTypeConfig.formatOptions.parseKeepsEmptyString = false;
    }

    return oTypeConfig;
  };

  _exports.fetchTypeConfig = fetchTypeConfig;

  var assignDataTypeToPropertyInfo = function (propertyInfoField, converterContext, aRequiredProps, aTypeConfig) {
    var oPropertyInfo = fetchPropertyInfo(converterContext, propertyInfoField, aTypeConfig[propertyInfoField.key]),
        sPropertyPath = "";

    if (propertyInfoField.conditionPath) {
      sPropertyPath = propertyInfoField.conditionPath.replace(/\+|\*/g, "");
    }

    if (oPropertyInfo) {
      var _propertyInfoField$re;

      oPropertyInfo = Object.assign(oPropertyInfo, {
        maxConditions: !oPropertyInfo.isParameter && isMultiValue(oPropertyInfo) ? -1 : 1,
        required: (_propertyInfoField$re = propertyInfoField.required) !== null && _propertyInfoField$re !== void 0 ? _propertyInfoField$re : oPropertyInfo.isParameter || aRequiredProps.indexOf(sPropertyPath) >= 0,
        caseSensitive: isFilteringCaseSensitive(converterContext),
        dataType: aTypeConfig[propertyInfoField.key].type
      });
    }

    return oPropertyInfo;
  };

  _exports.assignDataTypeToPropertyInfo = assignDataTypeToPropertyInfo;

  var processSelectionFields = function (propertyInfoFields, converterContext, defaultValuePropertyFields) {
    //get TypeConfig function
    var selectionFieldTypes = [];
    var aTypeConfig = {};

    if (defaultValuePropertyFields) {
      propertyInfoFields = propertyInfoFields.concat(defaultValuePropertyFields);
    } //add typeConfig


    propertyInfoFields.forEach(function (parameterField) {
      if (parameterField.annotationPath) {
        var propertyConvertyContext = converterContext.getConverterContextFor(parameterField.annotationPath);
        var propertyTargetObject = propertyConvertyContext.getDataModelObjectPath().targetObject;
        selectionFieldTypes.push(propertyTargetObject === null || propertyTargetObject === void 0 ? void 0 : propertyTargetObject.type);
        var oTypeConfig = fetchTypeConfig(propertyTargetObject);
        aTypeConfig[parameterField.key] = oTypeConfig;
      } else {
        selectionFieldTypes.push(sEdmString);
        aTypeConfig[parameterField.key] = {
          type: sStringDataType
        };
      }
    }); // filterRestrictions

    var _oFilterrestrictions;

    if (!ModelHelper.isSingleton(converterContext.getEntitySet())) {
      var _converterContext$get10, _converterContext$get11, _converterContext$get12;

      _oFilterrestrictions = (_converterContext$get10 = converterContext.getEntitySet()) === null || _converterContext$get10 === void 0 ? void 0 : (_converterContext$get11 = _converterContext$get10.annotations) === null || _converterContext$get11 === void 0 ? void 0 : (_converterContext$get12 = _converterContext$get11.Capabilities) === null || _converterContext$get12 === void 0 ? void 0 : _converterContext$get12.FilterRestrictions;
    }

    var oFilterRestrictions = _oFilterrestrictions;
    var oRet = {};
    oRet["RequiredProperties"] = getFilterRestrictions(oFilterRestrictions, "RequiredProperties") || [];
    oRet["NonFilterableProperties"] = getFilterRestrictions(oFilterRestrictions, "NonFilterableProperties") || [];
    oRet["FilterAllowedExpressions"] = getFilterRestrictions(oFilterRestrictions, "FilterAllowedExpressions") || {};
    var sEntitySetPath = converterContext.getContextPath();
    var aPathParts = sEntitySetPath.split("/");

    if (aPathParts.length > 2) {
      var sNavigationPath = aPathParts[aPathParts.length - 1];
      aPathParts.splice(-1, 1);
      var oNavigationRestrictions = getNavigationRestrictions(converterContext, sNavigationPath);
      var oNavigationFilterRestrictions = oNavigationRestrictions && oNavigationRestrictions.FilterRestrictions;
      oRet.RequiredProperties.concat(getFilterRestrictions(oNavigationFilterRestrictions, "RequiredProperties") || []);
      oRet.NonFilterableProperties.concat(getFilterRestrictions(oNavigationFilterRestrictions, "NonFilterableProperties") || []);
      oRet.FilterAllowedExpressions = _objectSpread(_objectSpread({}, getFilterRestrictions(oNavigationFilterRestrictions, "FilterAllowedExpressions") || {}), oRet.FilterAllowedExpressions);
    }

    var aRequiredProps = oRet.RequiredProperties;
    var aNonFilterableProps = oRet.NonFilterableProperties;
    var aFetchedProperties = []; // process the fields to add necessary properties

    propertyInfoFields.forEach(function (propertyInfoField) {
      var sPropertyPath;

      if (aNonFilterableProps.indexOf(sPropertyPath) === -1) {
        var oPropertyInfo = assignDataTypeToPropertyInfo(propertyInfoField, converterContext, aRequiredProps, aTypeConfig);
        aFetchedProperties.push(oPropertyInfo);
      }
    }); //add edit

    var dataModelObjectPath = converterContext.getDataModelObjectPath();

    if (ModelHelper.isObjectPathDraftSupported(dataModelObjectPath)) {
      aFetchedProperties.push(getEditStateFilterPropertyInfo());
    } // add search


    var searchRestrictions = getSearchRestrictions(converterContext);
    var hideBasicSearch = Boolean(searchRestrictions && !searchRestrictions.Searchable);

    if (sEntitySetPath && hideBasicSearch !== true) {
      if (!searchRestrictions || searchRestrictions !== null && searchRestrictions !== void 0 && searchRestrictions.Searchable) {
        aFetchedProperties.push(getSearchFilterPropertyInfo());
      }
    }

    return aFetchedProperties;
  };

  _exports.processSelectionFields = processSelectionFields;

  var insertCustomManifestElements = function (filterFields, entityType, converterContext) {
    return insertCustomElements(filterFields, getManifestFilterFields(entityType, converterContext), {
      "availability": "overwrite",
      label: "overwrite",
      type: "overwrite",
      position: "overwrite",
      template: "overwrite",
      settings: "overwrite",
      visualFilter: "overwrite",
      required: "overwrite"
    });
  };
  /**
   * Retrieve the configuration for the selection fields that will be used within the filter bar
   * This configuration takes into account the annotation and the selection variants.
   *
   * @param converterContext
   * @param lrTables
   * @param annotationPath
   * @param [includeHidden]
   * @param [lineItemTerm]
   * @returns An array of selection fields
   */


  _exports.insertCustomManifestElements = insertCustomManifestElements;

  var getSelectionFields = function (converterContext) {
    var _entityType$annotatio5, _entityType$annotatio6;

    var lrTables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var annotationPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var includeHidden = arguments.length > 3 ? arguments[3] : undefined;
    var lineItemTerm = arguments.length > 4 ? arguments[4] : undefined;
    var oAnnotatedSelectionFieldData = getAnnotatedSelectionFieldData(converterContext, lrTables, annotationPath, includeHidden, lineItemTerm);

    var parameterFields = _getParameterFields(converterContext);

    var propertyInfoFields = JSON.parse(JSON.stringify(oAnnotatedSelectionFieldData.propertyInfoFields));
    var entityType = oAnnotatedSelectionFieldData.entityType;
    propertyInfoFields = parameterFields.concat(propertyInfoFields);
    propertyInfoFields = insertCustomManifestElements(propertyInfoFields, entityType, converterContext);
    var aFetchedProperties = processSelectionFields(propertyInfoFields, converterContext, oAnnotatedSelectionFieldData.defaultFilterFields);
    aFetchedProperties.sort(function (a, b) {
      if (a.groupLabel === undefined || a.groupLabel === null) {
        return -1;
      }

      if (b.groupLabel === undefined || b.groupLabel === null) {
        return 1;
      }

      return a.groupLabel.localeCompare(b.groupLabel);
    });
    var sFetchProperties = JSON.stringify(aFetchedProperties);
    sFetchProperties = sFetchProperties.replace(/\{/g, "\\{");
    sFetchProperties = sFetchProperties.replace(/\}/g, "\\}");
    var sPropertyInfo = sFetchProperties; // end of propertyFields processing
    // to populate selection fields

    var propSelectionFields = JSON.parse(JSON.stringify(oAnnotatedSelectionFieldData.propertyInfoFields));
    propSelectionFields = parameterFields.concat(propSelectionFields); // create a map of properties to be used in selection variants

    var excludedFilterProperties = oAnnotatedSelectionFieldData.excludedFilterProperties;
    var filterFacets = entityType === null || entityType === void 0 ? void 0 : (_entityType$annotatio5 = entityType.annotations) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.UI) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.FilterFacets;
    var filterFacetMap = {};
    var aFieldGroups = converterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.FieldGroup");

    if (filterFacets === undefined || filterFacets.length < 0) {
      for (var i in aFieldGroups) {
        filterFacetMap = _objectSpread(_objectSpread({}, filterFacetMap), getFieldGroupFilterGroups(aFieldGroups[i]));
      }
    } else {
      filterFacetMap = filterFacets.reduce(function (previousValue, filterFacet) {
        for (var _i = 0; _i < (filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$Target = filterFacet.Target) === null || _filterFacet$Target === void 0 ? void 0 : (_filterFacet$Target$$ = _filterFacet$Target.$target) === null || _filterFacet$Target$$ === void 0 ? void 0 : (_filterFacet$Target$$2 = _filterFacet$Target$$.Data) === null || _filterFacet$Target$$2 === void 0 ? void 0 : _filterFacet$Target$$2.length); _i++) {
          var _filterFacet$Target, _filterFacet$Target$$, _filterFacet$Target$$2, _filterFacet$Target2, _filterFacet$Target2$, _filterFacet$Target2$2, _filterFacet$Target2$3, _filterFacet$ID, _filterFacet$Label;

          previousValue[filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$Target2 = filterFacet.Target) === null || _filterFacet$Target2 === void 0 ? void 0 : (_filterFacet$Target2$ = _filterFacet$Target2.$target) === null || _filterFacet$Target2$ === void 0 ? void 0 : (_filterFacet$Target2$2 = _filterFacet$Target2$.Data[_i]) === null || _filterFacet$Target2$2 === void 0 ? void 0 : (_filterFacet$Target2$3 = _filterFacet$Target2$2.Value) === null || _filterFacet$Target2$3 === void 0 ? void 0 : _filterFacet$Target2$3.path] = {
            group: filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$ID = filterFacet.ID) === null || _filterFacet$ID === void 0 ? void 0 : _filterFacet$ID.toString(),
            groupLabel: filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$Label = filterFacet.Label) === null || _filterFacet$Label === void 0 ? void 0 : _filterFacet$Label.toString()
          };
        }

        return previousValue;
      }, {});
    } // create a map of all potential filter fields based on...


    var filterFields = oAnnotatedSelectionFieldData.filterFields; // finally create final list of filter fields by adding the SelectionFields first (order matters)...

    var allFilters = propSelectionFields // ...and adding remaining filter fields, that are not used in a SelectionVariant (order doesn't matter)
    .concat(Object.keys(filterFields).filter(function (propertyPath) {
      return !(propertyPath in excludedFilterProperties);
    }).map(function (propertyPath) {
      return Object.assign(filterFields[propertyPath], filterFacetMap[propertyPath]);
    }));
    var sContextPath = converterContext.getContextPath(); //if all tables are analytical tables "aggregatable" properties must be excluded

    if (checkAllTableForEntitySetAreAnalytical(lrTables, sContextPath)) {
      // Currently all agregates are root entity properties (no properties coming from navigation) and all
      // tables with same entitySet gets same aggreagte configuration that's why we can use first table into
      // LR to get aggregates (without currency/unit properties since we expect to be able to filter them).
      var aggregates = lrTables[0].aggregates;

      if (aggregates) {
        var aggregatableProperties = Object.keys(aggregates).map(function (aggregateKey) {
          return aggregates[aggregateKey].relativePath;
        });
        allFilters = allFilters.filter(function (filterField) {
          return aggregatableProperties.indexOf(filterField.key) === -1;
        });
      }
    }

    var selectionFields = insertCustomManifestElements(allFilters, entityType, converterContext); // Add caseSensitive property to all selection fields.

    var isCaseSensitive = isFilteringCaseSensitive(converterContext);
    selectionFields.forEach(function (filterField) {
      filterField.caseSensitive = isCaseSensitive;
    });
    return {
      selectionFields: selectionFields,
      sPropertyInfo: sPropertyInfo
    };
  };
  /**
   * Determines whether the filter bar inside a value help dialog should be expanded. This is true if one of the following conditions hold:
   * (1) a filter property is mandatory,
   * (2) no search field exists (entity isn't search enabled),
   * (3) when the data isn't loaded by default (annotation FetchValues = 2).
   *
   * @param converterContext The converter context
   * @param filterRestrictionsAnnotation The FilterRestriction annotation
   * @param valueListAnnotation The ValueList annotation
   * @returns The value for expandFilterFields
   */


  _exports.getSelectionFields = getSelectionFields;

  var getExpandFilterFields = function (converterContext, filterRestrictionsAnnotation, valueListAnnotation) {
    var requiredProperties = getFilterRestrictions(filterRestrictionsAnnotation, "RequiredProperties");
    var searchRestrictions = getSearchRestrictions(converterContext);
    var hideBasicSearch = Boolean(searchRestrictions && !searchRestrictions.Searchable);
    var valueList = valueListAnnotation.getObject();

    if (requiredProperties.length > 0 || hideBasicSearch || (valueList === null || valueList === void 0 ? void 0 : valueList.FetchValues) === 2) {
      return true;
    }

    return false;
  };

  _exports.getExpandFilterFields = getExpandFilterFields;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmaWx0ZXJGaWVsZFR5cGUiLCJzRWRtU3RyaW5nIiwic1N0cmluZ0RhdGFUeXBlIiwiZ2V0RmllbGRHcm91cEZpbHRlckdyb3VwcyIsImZpZWxkR3JvdXAiLCJmaWx0ZXJGYWNldE1hcCIsIkRhdGEiLCJmb3JFYWNoIiwiZGF0YUZpZWxkIiwiJFR5cGUiLCJWYWx1ZSIsInBhdGgiLCJncm91cCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImdyb3VwTGFiZWwiLCJjb21waWxlRXhwcmVzc2lvbiIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsIkxhYmVsIiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJxdWFsaWZpZXIiLCJnZXRFeGNsdWRlZEZpbHRlclByb3BlcnRpZXMiLCJzZWxlY3Rpb25WYXJpYW50cyIsInJlZHVjZSIsInByZXZpb3VzVmFsdWUiLCJzZWxlY3Rpb25WYXJpYW50IiwicHJvcGVydHlOYW1lcyIsInByb3BlcnR5TmFtZSIsImNoZWNrQWxsVGFibGVGb3JFbnRpdHlTZXRBcmVBbmFseXRpY2FsIiwibGlzdFJlcG9ydFRhYmxlcyIsImNvbnRleHRQYXRoIiwibGVuZ3RoIiwiZXZlcnkiLCJ2aXN1YWxpemF0aW9uIiwiZW5hYmxlQW5hbHl0aWNzIiwiYW5ub3RhdGlvbiIsImNvbGxlY3Rpb24iLCJnZXRTZWxlY3Rpb25WYXJpYW50cyIsImxyVGFibGVWaXN1YWxpemF0aW9ucyIsImNvbnZlcnRlckNvbnRleHQiLCJzZWxlY3Rpb25WYXJpYW50UGF0aHMiLCJtYXAiLCJ0YWJsZUZpbHRlcnMiLCJjb250cm9sIiwiZmlsdGVycyIsInRhYmxlU1ZDb25maWdzIiwia2V5IiwiQXJyYXkiLCJpc0FycmF5IiwicGF0aHMiLCJhbm5vdGF0aW9uUGF0aCIsImluZGV4T2YiLCJwdXNoIiwic2VsZWN0aW9uVmFyaWFudENvbmZpZyIsImdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uIiwic3ZDb25maWdzIiwiY29uY2F0IiwiX2dldENvbmRpdGlvblBhdGgiLCJlbnRpdHlUeXBlIiwicHJvcGVydHlQYXRoIiwicGFydHMiLCJzcGxpdCIsInBhcnRpYWxQYXRoIiwicGFydCIsInNoaWZ0IiwicHJvcGVydHkiLCJyZXNvbHZlUGF0aCIsIl90eXBlIiwiaXNDb2xsZWN0aW9uIiwiX2NyZWF0ZUZpbHRlclNlbGVjdGlvbkZpZWxkIiwiZnVsbFByb3BlcnR5UGF0aCIsImluY2x1ZGVIaWRkZW4iLCJ1bmRlZmluZWQiLCJ0YXJnZXRUeXBlIiwiVUkiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwidGFyZ2V0RW50aXR5VHlwZSIsImdldEFubm90YXRpb25FbnRpdHlUeXBlIiwiS2V5SGVscGVyIiwiZ2V0U2VsZWN0aW9uRmllbGRLZXlGcm9tUGF0aCIsImdldEFic29sdXRlQW5ub3RhdGlvblBhdGgiLCJjb25kaXRpb25QYXRoIiwiYXZhaWxhYmlsaXR5IiwiSGlkZGVuRmlsdGVyIiwiQXZhaWxhYmlsaXR5VHlwZSIsIkFkYXB0YXRpb24iLCJsYWJlbCIsIm5hbWUiLCJnZXRNb2RlbFR5cGUiLCJzVHlwZSIsIm1EZWZhdWx0VHlwZUZvckVkbVR5cGUiLCJtb2RlbFR5cGUiLCJfZ2V0U2VsZWN0aW9uRmllbGRzIiwibmF2aWdhdGlvblBhdGgiLCJwcm9wZXJ0aWVzIiwic2VsZWN0aW9uRmllbGRNYXAiLCJmdWxsUGF0aCIsInNlbGVjdGlvbkZpZWxkIiwiX2dldFNlbGVjdGlvbkZpZWxkc0J5UGF0aCIsInByb3BlcnR5UGF0aHMiLCJzZWxlY3Rpb25GaWVsZHMiLCJsb2NhbFNlbGVjdGlvbkZpZWxkcyIsImVudGl0eVByb3BlcnRpZXMiLCJpbmNsdWRlcyIsInNwbGljZSIsImpvaW4iLCJfZ2V0RmlsdGVyRmllbGQiLCJmaWx0ZXJGaWVsZHMiLCJmaWx0ZXJGaWVsZCIsImdldERpYWdub3N0aWNzIiwiYWRkSXNzdWUiLCJJc3N1ZUNhdGVnb3J5IiwiQW5ub3RhdGlvbiIsIklzc3VlU2V2ZXJpdHkiLCJIaWdoIiwiSXNzdWVUeXBlIiwiTUlTU0lOR19TRUxFQ1RJT05GSUVMRCIsIkRlZmF1bHQiLCJpc1BhcmFtZXRlciIsIlJlc3VsdENvbnRleHQiLCJfZ2V0RGVmYXVsdEZpbHRlckZpZWxkcyIsImFTZWxlY3RPcHRpb25zIiwiZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzIiwiYW5ub3RhdGVkU2VsZWN0aW9uRmllbGRzIiwiVUlTZWxlY3Rpb25GaWVsZHMiLCJTZWxlY3Rpb25GaWVsZCIsInZhbHVlIiwic2VsZWN0T3B0aW9uIiwiUHJvcGVydHlOYW1lIiwic1Byb3BlcnR5UGF0aCIsImN1cnJlbnRTZWxlY3Rpb25GaWVsZHMiLCJGaWx0ZXJGaWVsZCIsImdldEZpbHRlckZpZWxkIiwiZGVmYXVsdEZpbHRlclZhbHVlIiwiRmlsdGVyRGVmYXVsdFZhbHVlIiwiX2dldFBhcmFtZXRlckZpZWxkcyIsImRhdGFNb2RlbE9iamVjdFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwicGFyYW1ldGVyRW50aXR5VHlwZSIsInN0YXJ0aW5nRW50aXR5U2V0IiwiaXNQYXJhbWV0ZXJpemVkIiwidGFyZ2V0RW50aXR5U2V0IiwicGFyYW1ldGVyQ29udmVydGVyQ29udGV4dCIsImdldENvbnZlcnRlckNvbnRleHRGb3IiLCJnZXRGaWx0ZXJCYXJoaWRlQmFzaWNTZWFyY2giLCJjaGFydHMiLCJub1NlYXJjaEluQ2hhcnRzIiwiY2hhcnQiLCJhcHBseVN1cHBvcnRlZCIsImVuYWJsZVNlYXJjaCIsIm5vU2VhcmNoSW5UYWJsZXMiLCJ0YWJsZSIsImVuYWJsZUFuYWx5dGljc1NlYXJjaCIsImdldENvbnRleHRQYXRoIiwiZ2V0TWFuaWZlc3RGaWx0ZXJGaWVsZHMiLCJmYkNvbmZpZyIsImdldE1hbmlmZXN0V3JhcHBlciIsImdldEZpbHRlckNvbmZpZ3VyYXRpb24iLCJkZWZpbmVkRmlsdGVyRmllbGRzIiwiT2JqZWN0Iiwia2V5cyIsImdldFBhdGhGcm9tU2VsZWN0aW9uRmllbGRLZXkiLCJzS2V5IiwidHlwZSIsIlNsb3QiLCJ2aXN1YWxGaWx0ZXIiLCJnZXRWaXN1YWxGaWx0ZXJzIiwidGVtcGxhdGUiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwic2V0dGluZ3MiLCJyZXF1aXJlZCIsImdldEZpbHRlclJlc3RyaWN0aW9ucyIsIm9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uIiwic1Jlc3RyaWN0aW9uIiwiYVByb3BzIiwib1Byb3BlcnR5IiwiJFByb3BlcnR5UGF0aCIsIm1BbGxvd2VkRXhwcmVzc2lvbnMiLCJGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zIiwiUHJvcGVydHkiLCJBbGxvd2VkRXhwcmVzc2lvbnMiLCJnZXRTZWFyY2hGaWx0ZXJQcm9wZXJ0eUluZm8iLCJkYXRhVHlwZSIsIm1heENvbmRpdGlvbnMiLCJnZXRFZGl0U3RhdGVGaWx0ZXJQcm9wZXJ0eUluZm8iLCJoaWRkZW5GaWx0ZXIiLCJnZXRTZWFyY2hSZXN0cmljdGlvbnMiLCJzZWFyY2hSZXN0cmljdGlvbnMiLCJNb2RlbEhlbHBlciIsImlzU2luZ2xldG9uIiwiZ2V0RW50aXR5U2V0IiwiY2FwYWJpbGl0ZXMiLCJDYXBhYmlsaXRpZXMiLCJTZWFyY2hSZXN0cmljdGlvbnMiLCJnZXROYXZpZ2F0aW9uUmVzdHJpY3Rpb25zIiwic05hdmlnYXRpb25QYXRoIiwib05hdmlnYXRpb25SZXN0cmljdGlvbnMiLCJOYXZpZ2F0aW9uUmVzdHJpY3Rpb25zIiwiYVJlc3RyaWN0ZWRQcm9wZXJ0aWVzIiwiUmVzdHJpY3RlZFByb3BlcnRpZXMiLCJmaW5kIiwib1Jlc3RyaWN0ZWRQcm9wZXJ0eSIsIk5hdmlnYXRpb25Qcm9wZXJ0eSIsIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiX2ZldGNoQmFzaWNQcm9wZXJ0eUluZm8iLCJvRmlsdGVyRmllbGRJbmZvIiwiZGlzcGxheSIsImNhc2VTZW5zaXRpdmUiLCJtZW51IiwiZ2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbiIsImFFeHByZXNzaW9ucyIsImFBbGxvd2VkRXhwcmVzc2lvbnNQcmlvcml0eSIsInNvcnQiLCJhIiwiYiIsImRpc3BsYXlNb2RlIiwib1Byb3BlcnR5QW5ub3RhdGlvbnMiLCJvQ29sbGVjdGlvbkFubm90YXRpb25zIiwib1RleHRBbm5vdGF0aW9uIiwiVGV4dCIsIm9UZXh0QXJyYW5nbWVudEFubm90YXRpb24iLCJUZXh0QXJyYW5nZW1lbnQiLCJmZXRjaFByb3BlcnR5SW5mbyIsIm9UeXBlQ29uZmlnIiwib1Byb3BlcnR5SW5mbyIsInNBbm5vdGF0aW9uUGF0aCIsInRhcmdldFByb3BlcnR5T2JqZWN0IiwidGFyZ2V0T2JqZWN0Iiwib0Zvcm1hdE9wdGlvbnMiLCJmb3JtYXRPcHRpb25zIiwib0NvbnN0cmFpbnRzIiwiY29uc3RyYWludHMiLCJhc3NpZ24iLCJpc011bHRpVmFsdWUiLCJiSXNNdWx0aVZhbHVlIiwiZmlsdGVyRXhwcmVzc2lvbiIsIl9pc0ZpbHRlcmFibGVOYXZpZ2F0aW9uUHJvcGVydHkiLCJlbnRyeSIsImdldEFubm90YXRlZFNlbGVjdGlvbkZpZWxkRGF0YSIsImxyVGFibGVzIiwibGluZUl0ZW1UZXJtIiwiZ2V0RW50aXR5VHlwZSIsImdldEVudGl0eVR5cGVBbm5vdGF0aW9uIiwiU2VsZWN0aW9uRmllbGRzIiwibmF2UHJvcGVydGllcyIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwiZ2V0U2VsZWN0aW9uVmFyaWFudCIsIlNlbGVjdE9wdGlvbnMiLCJwcm9wZXJ0eUluZm9GaWVsZHMiLCJzdGFydHNXaXRoIiwiZmlsdGVyUHJvcGVydHlQYXRoIiwiZGVmYXVsdEZpbHRlckZpZWxkcyIsImZldGNoVHlwZUNvbmZpZyIsImdldFR5cGVDb25maWciLCJudWxsYWJsZSIsInBhcnNlS2VlcHNFbXB0eVN0cmluZyIsImFzc2lnbkRhdGFUeXBlVG9Qcm9wZXJ0eUluZm8iLCJwcm9wZXJ0eUluZm9GaWVsZCIsImFSZXF1aXJlZFByb3BzIiwiYVR5cGVDb25maWciLCJyZXBsYWNlIiwiaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlIiwicHJvY2Vzc1NlbGVjdGlvbkZpZWxkcyIsImRlZmF1bHRWYWx1ZVByb3BlcnR5RmllbGRzIiwic2VsZWN0aW9uRmllbGRUeXBlcyIsInBhcmFtZXRlckZpZWxkIiwicHJvcGVydHlDb252ZXJ0eUNvbnRleHQiLCJwcm9wZXJ0eVRhcmdldE9iamVjdCIsIl9vRmlsdGVycmVzdHJpY3Rpb25zIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwib0ZpbHRlclJlc3RyaWN0aW9ucyIsIm9SZXQiLCJzRW50aXR5U2V0UGF0aCIsImFQYXRoUGFydHMiLCJvTmF2aWdhdGlvbkZpbHRlclJlc3RyaWN0aW9ucyIsIlJlcXVpcmVkUHJvcGVydGllcyIsIk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzIiwiRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zIiwiYU5vbkZpbHRlcmFibGVQcm9wcyIsImFGZXRjaGVkUHJvcGVydGllcyIsImlzT2JqZWN0UGF0aERyYWZ0U3VwcG9ydGVkIiwiaGlkZUJhc2ljU2VhcmNoIiwiQm9vbGVhbiIsIlNlYXJjaGFibGUiLCJpbnNlcnRDdXN0b21NYW5pZmVzdEVsZW1lbnRzIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRTZWxlY3Rpb25GaWVsZHMiLCJvQW5ub3RhdGVkU2VsZWN0aW9uRmllbGREYXRhIiwicGFyYW1ldGVyRmllbGRzIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwibG9jYWxlQ29tcGFyZSIsInNGZXRjaFByb3BlcnRpZXMiLCJzUHJvcGVydHlJbmZvIiwicHJvcFNlbGVjdGlvbkZpZWxkcyIsImZpbHRlckZhY2V0cyIsIkZpbHRlckZhY2V0cyIsImFGaWVsZEdyb3VwcyIsImdldEFubm90YXRpb25zQnlUZXJtIiwiaSIsImZpbHRlckZhY2V0IiwiVGFyZ2V0IiwiJHRhcmdldCIsIklEIiwidG9TdHJpbmciLCJhbGxGaWx0ZXJzIiwiZmlsdGVyIiwic0NvbnRleHRQYXRoIiwiYWdncmVnYXRlcyIsImFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhZ2dyZWdhdGVLZXkiLCJyZWxhdGl2ZVBhdGgiLCJpc0Nhc2VTZW5zaXRpdmUiLCJnZXRFeHBhbmRGaWx0ZXJGaWVsZHMiLCJmaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uIiwidmFsdWVMaXN0QW5ub3RhdGlvbiIsInJlcXVpcmVkUHJvcGVydGllcyIsInZhbHVlTGlzdCIsImdldE9iamVjdCIsIkZldGNoVmFsdWVzIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJGaWx0ZXJCYXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBbm5vdGF0aW9uVGVybSwgRW50aXR5VHlwZSwgTmF2aWdhdGlvblByb3BlcnR5LCBQcm9wZXJ0eSwgUHJvcGVydHlQYXRoIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NhcGFiaWxpdGllc19FZG1cIjtcbmltcG9ydCB0eXBlIHtcblx0RGF0YUZpZWxkLFxuXHREYXRhRmllbGRBYnN0cmFjdFR5cGVzLFxuXHREYXRhRmllbGRUeXBlcyxcblx0RGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoLFxuXHREYXRhRmllbGRXaXRoVXJsLFxuXHRGaWVsZEdyb3VwLFxuXHRMaW5lSXRlbSxcblx0UmVmZXJlbmNlRmFjZXRUeXBlcyxcblx0U2VsZWN0T3B0aW9uVHlwZVxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgeyBVSUFubm90YXRpb25UZXJtcywgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgdHlwZSB7IENoYXJ0VmlzdWFsaXphdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9DaGFydFwiO1xuaW1wb3J0IHR5cGUgeyBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiwgVGFibGVWaXN1YWxpemF0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5pbXBvcnQgeyBnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiwgZ2V0VHlwZUNvbmZpZywgaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5pbXBvcnQgdHlwZSB7IFZpc3VhbEZpbHRlcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9MaXN0UmVwb3J0L1Zpc3VhbEZpbHRlcnNcIjtcbmltcG9ydCB7IGdldFZpc3VhbEZpbHRlcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9MaXN0UmVwb3J0L1Zpc3VhbEZpbHRlcnNcIjtcbmltcG9ydCB0eXBlIENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBDb25maWd1cmFibGVPYmplY3QsIEN1c3RvbUVsZW1lbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5LCBJc3N1ZVNldmVyaXR5LCBJc3N1ZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IEZpbHRlckZpZWxkTWFuaWZlc3RDb25maWd1cmF0aW9uLCBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb24sIEZpbHRlclNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IEF2YWlsYWJpbGl0eVR5cGUgfSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgZ2V0U2VsZWN0aW9uVmFyaWFudCB9IGZyb20gXCIuLi9Db21tb24vRGF0YVZpc3VhbGl6YXRpb25cIjtcbi8vaW1wb3J0IHsgaGFzVmFsdWVIZWxwIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcblxuZXhwb3J0IHR5cGUgRmlsdGVyRmllbGQgPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdHR5cGU/OiBzdHJpbmc7XG5cdGNvbmRpdGlvblBhdGg6IHN0cmluZztcblx0YXZhaWxhYmlsaXR5OiBBdmFpbGFiaWxpdHlUeXBlO1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0dGVtcGxhdGU/OiBzdHJpbmc7XG5cdGdyb3VwPzogc3RyaW5nO1xuXHRncm91cExhYmVsPzogc3RyaW5nO1xuXHRzZXR0aW5ncz86IEZpbHRlclNldHRpbmdzO1xuXHRpc1BhcmFtZXRlcj86IGJvb2xlYW47XG5cdHZpc3VhbEZpbHRlcj86IFZpc3VhbEZpbHRlcnM7XG5cdGNhc2VTZW5zaXRpdmU/OiBib29sZWFuO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG59O1xuXG50eXBlIEZpbHRlckdyb3VwID0ge1xuXHRncm91cD86IHN0cmluZztcblx0Z3JvdXBMYWJlbD86IHN0cmluZztcbn07XG5cbmVudW0gZmlsdGVyRmllbGRUeXBlIHtcblx0RGVmYXVsdCA9IFwiRGVmYXVsdFwiLFxuXHRTbG90ID0gXCJTbG90XCJcbn1cblxuY29uc3Qgc0VkbVN0cmluZyA9IFwiRWRtLlN0cmluZ1wiO1xuY29uc3Qgc1N0cmluZ0RhdGFUeXBlID0gXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5TdHJpbmdcIjtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tRWxlbWVudEZpbHRlckZpZWxkID0gQ3VzdG9tRWxlbWVudDxGaWx0ZXJGaWVsZD47XG5cbi8qKlxuICogRW50ZXIgYWxsIERhdGFGaWVsZHMgb2YgYSBnaXZlbiBGaWVsZEdyb3VwIGludG8gdGhlIGZpbHRlckZhY2V0TWFwLlxuICpcbiAqIEBwYXJhbSBmaWVsZEdyb3VwXG4gKiBAcmV0dXJucyBUaGUgbWFwIG9mIGZhY2V0cyBmb3IgdGhlIGdpdmVuIEZpZWxkR3JvdXBcbiAqL1xuZnVuY3Rpb24gZ2V0RmllbGRHcm91cEZpbHRlckdyb3VwcyhmaWVsZEdyb3VwOiBGaWVsZEdyb3VwKTogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+IHtcblx0Y29uc3QgZmlsdGVyRmFjZXRNYXA6IFJlY29yZDxzdHJpbmcsIEZpbHRlckdyb3VwPiA9IHt9O1xuXHRmaWVsZEdyb3VwLkRhdGEuZm9yRWFjaCgoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0aWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRcIikge1xuXHRcdFx0ZmlsdGVyRmFjZXRNYXBbZGF0YUZpZWxkLlZhbHVlLnBhdGhdID0ge1xuXHRcdFx0XHRncm91cDogZmllbGRHcm91cC5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdGdyb3VwTGFiZWw6XG5cdFx0XHRcdFx0Y29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRcdFx0XHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZmllbGRHcm91cC5MYWJlbCB8fCBmaWVsZEdyb3VwLmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsIHx8IGZpZWxkR3JvdXAucXVhbGlmaWVyKVxuXHRcdFx0XHRcdCkgfHwgZmllbGRHcm91cC5xdWFsaWZpZXJcblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGZpbHRlckZhY2V0TWFwO1xufVxuXG5mdW5jdGlvbiBnZXRFeGNsdWRlZEZpbHRlclByb3BlcnRpZXMoc2VsZWN0aW9uVmFyaWFudHM6IFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uW10pOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiB7XG5cdHJldHVybiBzZWxlY3Rpb25WYXJpYW50cy5yZWR1Y2UoKHByZXZpb3VzVmFsdWU6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+LCBzZWxlY3Rpb25WYXJpYW50KSA9PiB7XG5cdFx0c2VsZWN0aW9uVmFyaWFudC5wcm9wZXJ0eU5hbWVzLmZvckVhY2goKHByb3BlcnR5TmFtZSkgPT4ge1xuXHRcdFx0cHJldmlvdXNWYWx1ZVtwcm9wZXJ0eU5hbWVdID0gdHJ1ZTtcblx0XHR9KTtcblx0XHRyZXR1cm4gcHJldmlvdXNWYWx1ZTtcblx0fSwge30pO1xufVxuXG4vKipcbiAqIENoZWNrIHRoYXQgYWxsIHRoZSB0YWJsZXMgZm9yIGEgZGVkaWNhdGVkIGVudGl0eSBzZXQgYXJlIGNvbmZpZ3VyZWQgYXMgYW5hbHl0aWNhbCB0YWJsZXMuXG4gKlxuICogQHBhcmFtIGxpc3RSZXBvcnRUYWJsZXMgTGlzdCByZXBvcnQgdGFibGVzXG4gKiBAcGFyYW0gY29udGV4dFBhdGhcbiAqIEByZXR1cm5zIElzIEZpbHRlckJhciBzZWFyY2ggZmllbGQgaGlkZGVuIG9yIG5vdFxuICovXG5mdW5jdGlvbiBjaGVja0FsbFRhYmxlRm9yRW50aXR5U2V0QXJlQW5hbHl0aWNhbChsaXN0UmVwb3J0VGFibGVzOiBUYWJsZVZpc3VhbGl6YXRpb25bXSwgY29udGV4dFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuXHRpZiAoY29udGV4dFBhdGggJiYgbGlzdFJlcG9ydFRhYmxlcy5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuIGxpc3RSZXBvcnRUYWJsZXMuZXZlcnkoKHZpc3VhbGl6YXRpb24pID0+IHtcblx0XHRcdHJldHVybiB2aXN1YWxpemF0aW9uLmVuYWJsZUFuYWx5dGljcyAmJiBjb250ZXh0UGF0aCA9PT0gdmlzdWFsaXphdGlvbi5hbm5vdGF0aW9uLmNvbGxlY3Rpb247XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3Rpb25WYXJpYW50cyhcblx0bHJUYWJsZVZpc3VhbGl6YXRpb25zOiBUYWJsZVZpc3VhbGl6YXRpb25bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb25bXSB7XG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0cmV0dXJuIGxyVGFibGVWaXN1YWxpemF0aW9uc1xuXHRcdC5tYXAoKHZpc3VhbGl6YXRpb24pID0+IHtcblx0XHRcdGNvbnN0IHRhYmxlRmlsdGVycyA9IHZpc3VhbGl6YXRpb24uY29udHJvbC5maWx0ZXJzO1xuXHRcdFx0Y29uc3QgdGFibGVTVkNvbmZpZ3M6IFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uW10gPSBbXTtcblx0XHRcdGZvciAoY29uc3Qga2V5IGluIHRhYmxlRmlsdGVycykge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh0YWJsZUZpbHRlcnNba2V5XS5wYXRocykpIHtcblx0XHRcdFx0XHRjb25zdCBwYXRocyA9IHRhYmxlRmlsdGVyc1trZXldLnBhdGhzO1xuXHRcdFx0XHRcdHBhdGhzLmZvckVhY2goKHBhdGgpID0+IHtcblx0XHRcdFx0XHRcdGlmIChwYXRoICYmIHBhdGguYW5ub3RhdGlvblBhdGggJiYgc2VsZWN0aW9uVmFyaWFudFBhdGhzLmluZGV4T2YocGF0aC5hbm5vdGF0aW9uUGF0aCkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGVjdGlvblZhcmlhbnRQYXRocy5wdXNoKHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWxlY3Rpb25WYXJpYW50Q29uZmlnID0gZ2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24ocGF0aC5hbm5vdGF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRcdFx0XHRcdGlmIChzZWxlY3Rpb25WYXJpYW50Q29uZmlnKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFibGVTVkNvbmZpZ3MucHVzaChzZWxlY3Rpb25WYXJpYW50Q29uZmlnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGFibGVTVkNvbmZpZ3M7XG5cdFx0fSlcblx0XHQucmVkdWNlKChzdkNvbmZpZ3MsIHNlbGVjdGlvblZhcmlhbnQpID0+IHN2Q29uZmlncy5jb25jYXQoc2VsZWN0aW9uVmFyaWFudCksIFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjb25kaXRpb24gcGF0aCByZXF1aXJlZCBmb3IgdGhlIGNvbmRpdGlvbiBtb2RlbC4gSXQgbG9va3MgYXMgZm9sbG93czpcbiAqIDwxOk4tUHJvcGVydHlOYW1lPipcXC88MToxLVByb3BlcnR5TmFtZT4vPFByb3BlcnR5TmFtZT4uXG4gKlxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIHJvb3QgRW50aXR5VHlwZVxuICogQHBhcmFtIHByb3BlcnR5UGF0aCBUaGUgZnVsbCBwYXRoIHRvIHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIFRoZSBmb3JtYXR0ZWQgY29uZGl0aW9uIHBhdGhcbiAqL1xuY29uc3QgX2dldENvbmRpdGlvblBhdGggPSBmdW5jdGlvbiAoZW50aXR5VHlwZTogRW50aXR5VHlwZSwgcHJvcGVydHlQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRjb25zdCBwYXJ0cyA9IHByb3BlcnR5UGF0aC5zcGxpdChcIi9cIik7XG5cdGxldCBwYXJ0aWFsUGF0aDtcblx0bGV0IGtleSA9IFwiXCI7XG5cdHdoaWxlIChwYXJ0cy5sZW5ndGgpIHtcblx0XHRsZXQgcGFydCA9IHBhcnRzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuXHRcdHBhcnRpYWxQYXRoID0gcGFydGlhbFBhdGggPyBgJHtwYXJ0aWFsUGF0aH0vJHtwYXJ0fWAgOiBwYXJ0O1xuXHRcdGNvbnN0IHByb3BlcnR5OiBQcm9wZXJ0eSB8IE5hdmlnYXRpb25Qcm9wZXJ0eSA9IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocGFydGlhbFBhdGgpO1xuXHRcdGlmIChwcm9wZXJ0eS5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJiBwcm9wZXJ0eS5pc0NvbGxlY3Rpb24pIHtcblx0XHRcdHBhcnQgKz0gXCIqXCI7XG5cdFx0fVxuXHRcdGtleSA9IGtleSA/IGAke2tleX0vJHtwYXJ0fWAgOiBwYXJ0O1xuXHR9XG5cdHJldHVybiBrZXk7XG59O1xuXG5jb25zdCBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQgPSBmdW5jdGlvbiAoXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdHByb3BlcnR5OiBQcm9wZXJ0eSxcblx0ZnVsbFByb3BlcnR5UGF0aDogc3RyaW5nLFxuXHRpbmNsdWRlSGlkZGVuOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCB7XG5cdC8vIGlnbm9yZSBjb21wbGV4IHByb3BlcnR5IHR5cGVzIGFuZCBoaWRkZW4gYW5ub3RhdGVkIG9uZXNcblx0aWYgKFxuXHRcdHByb3BlcnR5ICE9PSB1bmRlZmluZWQgJiZcblx0XHRwcm9wZXJ0eS50YXJnZXRUeXBlID09PSB1bmRlZmluZWQgJiZcblx0XHQoaW5jbHVkZUhpZGRlbiB8fCBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpICE9PSB0cnVlKVxuXHQpIHtcblx0XHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShwcm9wZXJ0eSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGtleTogS2V5SGVscGVyLmdldFNlbGVjdGlvbkZpZWxkS2V5RnJvbVBhdGgoZnVsbFByb3BlcnR5UGF0aCksXG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKGZ1bGxQcm9wZXJ0eVBhdGgpLFxuXHRcdFx0Y29uZGl0aW9uUGF0aDogX2dldENvbmRpdGlvblBhdGgoZW50aXR5VHlwZSwgZnVsbFByb3BlcnR5UGF0aCksXG5cdFx0XHRhdmFpbGFiaWxpdHk6XG5cdFx0XHRcdHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuRmlsdGVyPy52YWx1ZU9mKCkgPT09IHRydWUgPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuQWRhcHRhdGlvbixcblx0XHRcdGxhYmVsOiBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ocHJvcGVydHkuYW5ub3RhdGlvbnMuQ29tbW9uPy5MYWJlbD8udmFsdWVPZigpIHx8IHByb3BlcnR5Lm5hbWUpKSxcblx0XHRcdGdyb3VwOiB0YXJnZXRFbnRpdHlUeXBlLm5hbWUsXG5cdFx0XHRncm91cExhYmVsOiBjb21waWxlRXhwcmVzc2lvbihcblx0XHRcdFx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHRhcmdldEVudGl0eVR5cGU/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKCkgfHwgdGFyZ2V0RW50aXR5VHlwZS5uYW1lKVxuXHRcdFx0KVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2RlbFR5cGUoc1R5cGU6IGFueSkge1xuXHR0eXBlIGRlZmF1bHRNb2RlbFR5cGUgPSB7XG5cdFx0W2tleTogc3RyaW5nXToge1xuXHRcdFx0W2tleTogc3RyaW5nXTogc3RyaW5nO1xuXHRcdH07XG5cdH07XG5cdGNvbnN0IG1EZWZhdWx0VHlwZUZvckVkbVR5cGU6IGRlZmF1bHRNb2RlbFR5cGUgPSB7XG5cdFx0XCJFZG0uQm9vbGVhblwiOiB7XG5cdFx0XHRtb2RlbFR5cGU6IFwiQm9vbFwiXG5cdFx0fSxcblx0XHRcIkVkbS5CeXRlXCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJJbnRcIlxuXHRcdH0sXG5cdFx0XCJFZG0uRGF0ZVwiOiB7XG5cdFx0XHRtb2RlbFR5cGU6IFwiRGF0ZVwiXG5cdFx0fSxcblx0XHRcIkVkbS5EYXRlVGltZVwiOiB7XG5cdFx0XHRtb2RlbFR5cGU6IFwiRGF0ZVwiXG5cdFx0fSxcblx0XHRcIkVkbS5EYXRlVGltZU9mZnNldFwiOiB7XG5cdFx0XHRtb2RlbFR5cGU6IFwiRGF0ZVRpbWVPZmZzZXRcIlxuXHRcdH0sXG5cdFx0XCJFZG0uRGVjaW1hbFwiOiB7XG5cdFx0XHRtb2RlbFR5cGU6IFwiRGVjaW1hbFwiXG5cdFx0fSxcblx0XHRcIkVkbS5Eb3VibGVcIjoge1xuXHRcdFx0bW9kZWxUeXBlOiBcIkZsb2F0XCJcblx0XHR9LFxuXHRcdFwiRWRtLkZsb2F0XCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJGbG9hdFwiXG5cdFx0fSxcblx0XHRcIkVkbS5HdWlkXCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJHdWlkXCJcblx0XHR9LFxuXHRcdFwiRWRtLkludDE2XCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJJbnRcIlxuXHRcdH0sXG5cdFx0XCJFZG0uSW50MzJcIjoge1xuXHRcdFx0bW9kZWxUeXBlOiBcIkludFwiXG5cdFx0fSxcblx0XHRcIkVkbS5JbnQ2NFwiOiB7XG5cdFx0XHRtb2RlbFR5cGU6IFwiSW50XCJcblx0XHR9LFxuXHRcdFwiRWRtLlNCeXRlXCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJJbnRcIlxuXHRcdH0sXG5cdFx0XCJFZG0uU2luZ2xlXCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJGbG9hdFwiXG5cdFx0fSxcblx0XHRcIkVkbS5TdHJpbmdcIjoge1xuXHRcdFx0bW9kZWxUeXBlOiBcIlN0cmluZ1wiXG5cdFx0fSxcblx0XHRcIkVkbS5UaW1lXCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJUaW1lT2ZEYXlcIlxuXHRcdH0sXG5cdFx0XCJFZG0uVGltZU9mRGF5XCI6IHtcblx0XHRcdG1vZGVsVHlwZTogXCJUaW1lT2ZEYXlcIlxuXHRcdH0sXG5cdFx0XCJFZG0uU3RyZWFtXCI6IHtcblx0XHRcdC8vbm8gY29ycmVzcG9uZGluZyBtb2RlbFR5cGUgLSBpZ25vcmUgZm9yIGZpbHRlcmluZ1xuXHRcdH1cblx0fTtcblx0cmV0dXJuIHNUeXBlICYmIHNUeXBlIGluIG1EZWZhdWx0VHlwZUZvckVkbVR5cGUgJiYgbURlZmF1bHRUeXBlRm9yRWRtVHlwZVtzVHlwZV0ubW9kZWxUeXBlO1xufVxuY29uc3QgX2dldFNlbGVjdGlvbkZpZWxkcyA9IGZ1bmN0aW9uIChcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZyxcblx0cHJvcGVydGllczogQXJyYXk8UHJvcGVydHk+IHwgdW5kZWZpbmVkLFxuXHRpbmNsdWRlSGlkZGVuOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4ge1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0ge307XG5cdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0cHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5UGF0aDogc3RyaW5nID0gcHJvcGVydHkubmFtZTtcblx0XHRcdGNvbnN0IGZ1bGxQYXRoOiBzdHJpbmcgPSAobmF2aWdhdGlvblBhdGggPyBgJHtuYXZpZ2F0aW9uUGF0aH0vYCA6IFwiXCIpICsgcHJvcGVydHlQYXRoO1xuXHRcdFx0Y29uc3Qgc2VsZWN0aW9uRmllbGQgPSBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQoZW50aXR5VHlwZSwgcHJvcGVydHksIGZ1bGxQYXRoLCBpbmNsdWRlSGlkZGVuLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdGlmIChzZWxlY3Rpb25GaWVsZCkge1xuXHRcdFx0XHRzZWxlY3Rpb25GaWVsZE1hcFtmdWxsUGF0aF0gPSBzZWxlY3Rpb25GaWVsZDtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0aW9uRmllbGRNYXA7XG59O1xuXG5jb25zdCBfZ2V0U2VsZWN0aW9uRmllbGRzQnlQYXRoID0gZnVuY3Rpb24gKFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRwcm9wZXJ0eVBhdGhzOiBBcnJheTxzdHJpbmc+IHwgdW5kZWZpbmVkLFxuXHRpbmNsdWRlSGlkZGVuOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4ge1xuXHRsZXQgc2VsZWN0aW9uRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4gPSB7fTtcblx0aWYgKHByb3BlcnR5UGF0aHMpIHtcblx0XHRwcm9wZXJ0eVBhdGhzLmZvckVhY2goKHByb3BlcnR5UGF0aDogc3RyaW5nKSA9PiB7XG5cdFx0XHRsZXQgbG9jYWxTZWxlY3Rpb25GaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPjtcblxuXHRcdFx0Y29uc3QgcHJvcGVydHk6IFByb3BlcnR5IHwgTmF2aWdhdGlvblByb3BlcnR5ID0gZW50aXR5VHlwZS5yZXNvbHZlUGF0aChwcm9wZXJ0eVBhdGgpO1xuXHRcdFx0aWYgKHByb3BlcnR5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByb3BlcnR5Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdC8vIGhhbmRsZSBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblx0XHRcdFx0bG9jYWxTZWxlY3Rpb25GaWVsZHMgPSBfZ2V0U2VsZWN0aW9uRmllbGRzKFxuXHRcdFx0XHRcdGVudGl0eVR5cGUsXG5cdFx0XHRcdFx0cHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdHByb3BlcnR5LnRhcmdldFR5cGUuZW50aXR5UHJvcGVydGllcyxcblx0XHRcdFx0XHRpbmNsdWRlSGlkZGVuLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHkudGFyZ2V0VHlwZSAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnR5LnRhcmdldFR5cGUuX3R5cGUgPT09IFwiQ29tcGxleFR5cGVcIikge1xuXHRcdFx0XHQvLyBoYW5kbGUgQ29tcGxleFR5cGUgcHJvcGVydGllc1xuXHRcdFx0XHRsb2NhbFNlbGVjdGlvbkZpZWxkcyA9IF9nZXRTZWxlY3Rpb25GaWVsZHMoXG5cdFx0XHRcdFx0ZW50aXR5VHlwZSxcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0cHJvcGVydHkudGFyZ2V0VHlwZS5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdGluY2x1ZGVIaWRkZW4sXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmF2aWdhdGlvblBhdGggPSBwcm9wZXJ0eVBhdGguaW5jbHVkZXMoXCIvXCIpID8gcHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKS5zcGxpY2UoMCwgMSkuam9pbihcIi9cIikgOiBcIlwiO1xuXHRcdFx0XHRsb2NhbFNlbGVjdGlvbkZpZWxkcyA9IF9nZXRTZWxlY3Rpb25GaWVsZHMoZW50aXR5VHlwZSwgbmF2aWdhdGlvblBhdGgsIFtwcm9wZXJ0eV0sIGluY2x1ZGVIaWRkZW4sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3Rpb25GaWVsZHMgPSB7XG5cdFx0XHRcdC4uLnNlbGVjdGlvbkZpZWxkcyxcblx0XHRcdFx0Li4ubG9jYWxTZWxlY3Rpb25GaWVsZHNcblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkcztcbn07XG5cbmNvbnN0IF9nZXRGaWx0ZXJGaWVsZCA9IGZ1bmN0aW9uIChcblx0ZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4sXG5cdHByb3BlcnR5UGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlXG4pOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCB7XG5cdGxldCBmaWx0ZXJGaWVsZDogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQgPSBmaWx0ZXJGaWVsZHNbcHJvcGVydHlQYXRoXTtcblx0Y29uc3QgYXZhaWxhYmlsaXR5ID0gZmlsdGVyRmllbGQgJiYgZmlsdGVyRmllbGQuYXZhaWxhYmlsaXR5O1xuXHRpZiAoZmlsdGVyRmllbGQpIHtcblx0XHRkZWxldGUgZmlsdGVyRmllbGRzW3Byb3BlcnR5UGF0aF07XG5cdH0gZWxzZSB7XG5cdFx0ZmlsdGVyRmllbGQgPSBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQoZW50aXR5VHlwZSwgZW50aXR5VHlwZS5yZXNvbHZlUGF0aChwcm9wZXJ0eVBhdGgpLCBwcm9wZXJ0eVBhdGgsIHRydWUsIGNvbnZlcnRlckNvbnRleHQpO1xuXHR9XG5cdGlmICghZmlsdGVyRmllbGQpIHtcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldERpYWdub3N0aWNzKCk/LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5IaWdoLCBJc3N1ZVR5cGUuTUlTU0lOR19TRUxFQ1RJT05GSUVMRCk7XG5cdH1cblx0Ly8gZGVmaW5lZCBTZWxlY3Rpb25GaWVsZHMgYXJlIGF2YWlsYWJsZSBieSBkZWZhdWx0XG5cdGlmIChmaWx0ZXJGaWVsZCkge1xuXHRcdGZpbHRlckZpZWxkLmF2YWlsYWJpbGl0eSA9IGF2YWlsYWJpbGl0eSA9PT0gQXZhaWxhYmlsaXR5VHlwZS5IaWRkZW4gPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdDtcblx0XHRmaWx0ZXJGaWVsZC5pc1BhcmFtZXRlciA9ICEhZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5SZXN1bHRDb250ZXh0O1xuXHR9XG5cdHJldHVybiBmaWx0ZXJGaWVsZDtcbn07XG5cbmNvbnN0IF9nZXREZWZhdWx0RmlsdGVyRmllbGRzID0gZnVuY3Rpb24gKFxuXHRhU2VsZWN0T3B0aW9uczogYW55W10sXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4sXG5cdGFubm90YXRlZFNlbGVjdGlvbkZpZWxkczogUHJvcGVydHlQYXRoW11cbik6IEZpbHRlckZpZWxkW10ge1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHM6IEZpbHRlckZpZWxkW10gPSBbXTtcblx0Y29uc3QgVUlTZWxlY3Rpb25GaWVsZHM6IGFueSA9IHt9O1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzO1xuXHQvLyBVc2luZyBlbnRpdHlUeXBlIGluc3RlYWQgb2YgZW50aXR5U2V0XG5cdGFubm90YXRlZFNlbGVjdGlvbkZpZWxkcz8uZm9yRWFjaCgoU2VsZWN0aW9uRmllbGQpID0+IHtcblx0XHRVSVNlbGVjdGlvbkZpZWxkc1tTZWxlY3Rpb25GaWVsZC52YWx1ZV0gPSB0cnVlO1xuXHR9KTtcblx0aWYgKGFTZWxlY3RPcHRpb25zICYmIGFTZWxlY3RPcHRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRhU2VsZWN0T3B0aW9ucz8uZm9yRWFjaCgoc2VsZWN0T3B0aW9uOiBTZWxlY3RPcHRpb25UeXBlKSA9PiB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWU6IGFueSA9IHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWU7XG5cdFx0XHRjb25zdCBzUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBwcm9wZXJ0eU5hbWUudmFsdWU7XG5cdFx0XHRjb25zdCBjdXJyZW50U2VsZWN0aW9uRmllbGRzOiBhbnkgPSB7fTtcblx0XHRcdGFubm90YXRlZFNlbGVjdGlvbkZpZWxkcz8uZm9yRWFjaCgoU2VsZWN0aW9uRmllbGQpID0+IHtcblx0XHRcdFx0Y3VycmVudFNlbGVjdGlvbkZpZWxkc1tTZWxlY3Rpb25GaWVsZC52YWx1ZV0gPSB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIShzUHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpIHtcblx0XHRcdFx0aWYgKCEoc1Byb3BlcnR5UGF0aCBpbiBjdXJyZW50U2VsZWN0aW9uRmllbGRzKSkge1xuXHRcdFx0XHRcdGNvbnN0IEZpbHRlckZpZWxkOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCA9IGdldEZpbHRlckZpZWxkKHNQcm9wZXJ0eVBhdGgsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpO1xuXHRcdFx0XHRcdGlmIChGaWx0ZXJGaWVsZCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0aW9uRmllbGRzLnB1c2goRmlsdGVyRmllbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKHByb3BlcnRpZXMpIHtcblx0XHRwcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5OiBQcm9wZXJ0eSkgPT4ge1xuXHRcdFx0Y29uc3QgZGVmYXVsdEZpbHRlclZhbHVlID0gcHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uRmlsdGVyRGVmYXVsdFZhbHVlO1xuXHRcdFx0Y29uc3QgcHJvcGVydHlQYXRoID0gcHJvcGVydHkubmFtZTtcblx0XHRcdGlmICghKHByb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKSB7XG5cdFx0XHRcdGlmIChkZWZhdWx0RmlsdGVyVmFsdWUgJiYgIShwcm9wZXJ0eVBhdGggaW4gVUlTZWxlY3Rpb25GaWVsZHMpKSB7XG5cdFx0XHRcdFx0Y29uc3QgRmlsdGVyRmllbGQ6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkID0gZ2V0RmlsdGVyRmllbGQocHJvcGVydHlQYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlKTtcblx0XHRcdFx0XHRpZiAoRmlsdGVyRmllbGQpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGlvbkZpZWxkcy5wdXNoKEZpbHRlckZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0aW9uRmllbGRzO1xufTtcblxuLyoqXG4gKiBHZXQgYWxsIHBhcmFtZXRlciBmaWx0ZXIgZmllbGRzIGluIGNhc2Ugb2YgYSBwYXJhbWV0ZXJpemVkIHNlcnZpY2UuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHBhcmFtZXRlciBGaWx0ZXJGaWVsZHNcbiAqL1xuZnVuY3Rpb24gX2dldFBhcmFtZXRlckZpZWxkcyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogRmlsdGVyRmllbGRbXSB7XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgcGFyYW1ldGVyRW50aXR5VHlwZSA9IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQuZW50aXR5VHlwZTtcblx0Y29uc3QgaXNQYXJhbWV0ZXJpemVkID0gISFwYXJhbWV0ZXJFbnRpdHlUeXBlLmFubm90YXRpb25zPy5Db21tb24/LlJlc3VsdENvbnRleHQgJiYgIWRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5U2V0O1xuXHRjb25zdCBwYXJhbWV0ZXJDb252ZXJ0ZXJDb250ZXh0ID1cblx0XHRpc1BhcmFtZXRlcml6ZWQgJiYgY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKGAvJHtkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWV9YCk7XG5cblx0cmV0dXJuIChcblx0XHRwYXJhbWV0ZXJDb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHQ/IHBhcmFtZXRlckVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9nZXRGaWx0ZXJGaWVsZChcblx0XHRcdFx0XHRcdHt9IGFzIFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPixcblx0XHRcdFx0XHRcdHByb3BlcnR5Lm5hbWUsXG5cdFx0XHRcdFx0XHRwYXJhbWV0ZXJDb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdFx0cGFyYW1ldGVyRW50aXR5VHlwZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHQgIH0pXG5cdFx0XHQ6IFtdXG5cdCkgYXMgRmlsdGVyRmllbGRbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBGaWx0ZXJCYXIgc2VhcmNoIGZpZWxkIGlzIGhpZGRlbiBvciBub3QuXG4gKlxuICogQHBhcmFtIGxpc3RSZXBvcnRUYWJsZXMgVGhlIGxpc3QgcmVwb3J0IHRhYmxlc1xuICogQHBhcmFtIGNoYXJ0cyBUaGUgQUxQIGNoYXJ0c1xuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgaW5mb3JtYXRpb24gaWYgdGhlIEZpbHRlckJhciBzZWFyY2ggZmllbGQgaXMgaGlkZGVuIG9yIG5vdFxuICovXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyQmFyaGlkZUJhc2ljU2VhcmNoID0gZnVuY3Rpb24gKFxuXHRsaXN0UmVwb3J0VGFibGVzOiBUYWJsZVZpc3VhbGl6YXRpb25bXSxcblx0Y2hhcnRzOiBDaGFydFZpc3VhbGl6YXRpb25bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogYm9vbGVhbiB7XG5cdC8vIENoZWNrIGlmIGNoYXJ0cyBhbGxvdyBzZWFyY2hcblx0Y29uc3Qgbm9TZWFyY2hJbkNoYXJ0cyA9IGNoYXJ0cy5sZW5ndGggPT09IDAgfHwgY2hhcnRzLmV2ZXJ5KChjaGFydCkgPT4gIWNoYXJ0LmFwcGx5U3VwcG9ydGVkLmVuYWJsZVNlYXJjaCk7XG5cblx0Ly8gQ2hlY2sgaWYgYWxsIHRhYmxlcyBhcmUgYW5hbHl0aWNhbCBhbmQgbm9uZSBvZiB0aGVtIGFsbG93IGZvciBzZWFyY2hcblx0Y29uc3Qgbm9TZWFyY2hJblRhYmxlcyA9XG5cdFx0bGlzdFJlcG9ydFRhYmxlcy5sZW5ndGggPT09IDAgfHwgbGlzdFJlcG9ydFRhYmxlcy5ldmVyeSgodGFibGUpID0+IHRhYmxlLmVuYWJsZUFuYWx5dGljcyAmJiAhdGFibGUuZW5hYmxlQW5hbHl0aWNzU2VhcmNoKTtcblxuXHRjb25zdCBjb250ZXh0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKTtcblx0aWYgKGNvbnRleHRQYXRoICYmIG5vU2VhcmNoSW5DaGFydHMgJiYgbm9TZWFyY2hJblRhYmxlcykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgZmlsdGVyIGZpZWxkcyBmcm9tIHRoZSBtYW5pZmVzdC5cbiAqXG4gKiBAcGFyYW0gZW50aXR5VHlwZSBUaGUgY3VycmVudCBlbnRpdHlUeXBlXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBmaWx0ZXIgZmllbGRzIGRlZmluZWQgaW4gdGhlIG1hbmlmZXN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uIChcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudEZpbHRlckZpZWxkPiB7XG5cdGNvbnN0IGZiQ29uZmlnOiBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgZGVmaW5lZEZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24+ID0gZmJDb25maWc/LmZpbHRlckZpZWxkcyB8fCB7fTtcblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4gPSBfZ2V0U2VsZWN0aW9uRmllbGRzQnlQYXRoKFxuXHRcdGVudGl0eVR5cGUsXG5cdFx0T2JqZWN0LmtleXMoZGVmaW5lZEZpbHRlckZpZWxkcykubWFwKChrZXkpID0+IEtleUhlbHBlci5nZXRQYXRoRnJvbVNlbGVjdGlvbkZpZWxkS2V5KGtleSkpLFxuXHRcdHRydWUsXG5cdFx0Y29udmVydGVyQ29udGV4dFxuXHQpO1xuXHRjb25zdCBmaWx0ZXJGaWVsZHM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnRGaWx0ZXJGaWVsZD4gPSB7fTtcblxuXHRmb3IgKGNvbnN0IHNLZXkgaW4gZGVmaW5lZEZpbHRlckZpZWxkcykge1xuXHRcdGNvbnN0IGZpbHRlckZpZWxkID0gZGVmaW5lZEZpbHRlckZpZWxkc1tzS2V5XTtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBLZXlIZWxwZXIuZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleShzS2V5KTtcblx0XHRjb25zdCBzZWxlY3Rpb25GaWVsZCA9IHNlbGVjdGlvbkZpZWxkc1twcm9wZXJ0eU5hbWVdO1xuXHRcdGNvbnN0IHR5cGUgPSBmaWx0ZXJGaWVsZC50eXBlID09PSBcIlNsb3RcIiA/IGZpbHRlckZpZWxkVHlwZS5TbG90IDogZmlsdGVyRmllbGRUeXBlLkRlZmF1bHQ7XG5cdFx0Y29uc3QgdmlzdWFsRmlsdGVyID1cblx0XHRcdGZpbHRlckZpZWxkICYmIGZpbHRlckZpZWxkPy52aXN1YWxGaWx0ZXJcblx0XHRcdFx0PyBnZXRWaXN1YWxGaWx0ZXJzKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQsIHNLZXksIGRlZmluZWRGaWx0ZXJGaWVsZHMpXG5cdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdGZpbHRlckZpZWxkc1tzS2V5XSA9IHtcblx0XHRcdGtleTogc0tleSxcblx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogc2VsZWN0aW9uRmllbGQ/LmFubm90YXRpb25QYXRoLFxuXHRcdFx0Y29uZGl0aW9uUGF0aDogc2VsZWN0aW9uRmllbGQ/LmNvbmRpdGlvblBhdGggfHwgcHJvcGVydHlOYW1lLFxuXHRcdFx0dGVtcGxhdGU6IGZpbHRlckZpZWxkLnRlbXBsYXRlLFxuXHRcdFx0bGFiZWw6IGZpbHRlckZpZWxkLmxhYmVsLFxuXHRcdFx0cG9zaXRpb246IGZpbHRlckZpZWxkLnBvc2l0aW9uIHx8IHsgcGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXIgfSxcblx0XHRcdGF2YWlsYWJpbGl0eTogZmlsdGVyRmllbGQuYXZhaWxhYmlsaXR5IHx8IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdCxcblx0XHRcdHNldHRpbmdzOiBmaWx0ZXJGaWVsZC5zZXR0aW5ncyxcblx0XHRcdHZpc3VhbEZpbHRlcjogdmlzdWFsRmlsdGVyLFxuXHRcdFx0cmVxdWlyZWQ6IGZpbHRlckZpZWxkLnJlcXVpcmVkXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gZmlsdGVyRmllbGRzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpbHRlckZpZWxkID0gZnVuY3Rpb24gKHByb3BlcnR5UGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlOiBFbnRpdHlUeXBlKSB7XG5cdHJldHVybiBfZ2V0RmlsdGVyRmllbGQoe30sIHByb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyUmVzdHJpY3Rpb25zID0gZnVuY3Rpb24gKG9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uOiBhbnksIHNSZXN0cmljdGlvbjogYW55KSB7XG5cdGlmIChzUmVzdHJpY3Rpb24gPT09IFwiUmVxdWlyZWRQcm9wZXJ0aWVzXCIgfHwgc1Jlc3RyaWN0aW9uID09PSBcIk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzXCIpIHtcblx0XHRsZXQgYVByb3BzID0gW107XG5cdFx0aWYgKG9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uICYmIG9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uW3NSZXN0cmljdGlvbl0pIHtcblx0XHRcdGFQcm9wcyA9IG9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uW3NSZXN0cmljdGlvbl0ubWFwKGZ1bmN0aW9uIChvUHJvcGVydHk6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gb1Byb3BlcnR5LiRQcm9wZXJ0eVBhdGggfHwgb1Byb3BlcnR5LnZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBhUHJvcHM7XG5cdH0gZWxzZSBpZiAoc1Jlc3RyaWN0aW9uID09PSBcIkZpbHRlckFsbG93ZWRFeHByZXNzaW9uc1wiKSB7XG5cdFx0Y29uc3QgbUFsbG93ZWRFeHByZXNzaW9ucyA9IHt9IGFzIGFueTtcblx0XHRpZiAob0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24gJiYgb0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucykge1xuXHRcdFx0b0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChvUHJvcGVydHk6IGFueSkge1xuXHRcdFx0XHQvL1NpbmdsZVZhbHVlIHwgTXVsdGlWYWx1ZSB8IFNpbmdsZVJhbmdlIHwgTXVsdGlSYW5nZSB8IFNlYXJjaEV4cHJlc3Npb24gfCBNdWx0aVJhbmdlT3JTZWFyY2hFeHByZXNzaW9uXG5cdFx0XHRcdGlmIChtQWxsb3dlZEV4cHJlc3Npb25zW29Qcm9wZXJ0eS5Qcm9wZXJ0eS52YWx1ZV0pIHtcblx0XHRcdFx0XHRtQWxsb3dlZEV4cHJlc3Npb25zW29Qcm9wZXJ0eS5Qcm9wZXJ0eS52YWx1ZV0ucHVzaChvUHJvcGVydHkuQWxsb3dlZEV4cHJlc3Npb25zKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtQWxsb3dlZEV4cHJlc3Npb25zW29Qcm9wZXJ0eS5Qcm9wZXJ0eS52YWx1ZV0gPSBbb1Byb3BlcnR5LkFsbG93ZWRFeHByZXNzaW9uc107XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gbUFsbG93ZWRFeHByZXNzaW9ucztcblx0fVxuXHRyZXR1cm4gb0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb247XG59O1xuXG5jb25zdCBnZXRTZWFyY2hGaWx0ZXJQcm9wZXJ0eUluZm8gPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB7XG5cdFx0bmFtZTogXCIkc2VhcmNoXCIsXG5cdFx0cGF0aDogXCIkc2VhcmNoXCIsXG5cdFx0ZGF0YVR5cGU6IHNTdHJpbmdEYXRhVHlwZSxcblx0XHRtYXhDb25kaXRpb25zOiAxXG5cdH07XG59O1xuXG5jb25zdCBnZXRFZGl0U3RhdGVGaWx0ZXJQcm9wZXJ0eUluZm8gPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB7XG5cdFx0bmFtZTogXCIkZWRpdFN0YXRlXCIsXG5cdFx0cGF0aDogXCIkZWRpdFN0YXRlXCIsXG5cdFx0Z3JvdXBMYWJlbDogXCJcIixcblx0XHRncm91cDogXCJcIixcblx0XHRkYXRhVHlwZTogc1N0cmluZ0RhdGFUeXBlLFxuXHRcdGhpZGRlbkZpbHRlcjogZmFsc2Vcblx0fTtcbn07XG5cbmNvbnN0IGdldFNlYXJjaFJlc3RyaWN0aW9ucyA9IGZ1bmN0aW9uIChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KSB7XG5cdGxldCBzZWFyY2hSZXN0cmljdGlvbnM7XG5cdGlmICghTW9kZWxIZWxwZXIuaXNTaW5nbGV0b24oY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSkpIHtcblx0XHRjb25zdCBjYXBhYmlsaXRlcyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXMgYXMgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzO1xuXHRcdHNlYXJjaFJlc3RyaWN0aW9ucyA9IGNhcGFiaWxpdGVzPy5TZWFyY2hSZXN0cmljdGlvbnM7XG5cdH1cblx0cmV0dXJuIHNlYXJjaFJlc3RyaWN0aW9ucztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROYXZpZ2F0aW9uUmVzdHJpY3Rpb25zID0gZnVuY3Rpb24gKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsIHNOYXZpZ2F0aW9uUGF0aDogc3RyaW5nKSB7XG5cdGNvbnN0IG9OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zOiBhbnkgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpPy5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zO1xuXHRjb25zdCBhUmVzdHJpY3RlZFByb3BlcnRpZXMgPSBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucyAmJiBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucy5SZXN0cmljdGVkUHJvcGVydGllcztcblx0cmV0dXJuIChcblx0XHRhUmVzdHJpY3RlZFByb3BlcnRpZXMgJiZcblx0XHRhUmVzdHJpY3RlZFByb3BlcnRpZXMuZmluZChmdW5jdGlvbiAob1Jlc3RyaWN0ZWRQcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRvUmVzdHJpY3RlZFByb3BlcnR5ICYmXG5cdFx0XHRcdG9SZXN0cmljdGVkUHJvcGVydHkuTmF2aWdhdGlvblByb3BlcnR5ICYmXG5cdFx0XHRcdChvUmVzdHJpY3RlZFByb3BlcnR5Lk5hdmlnYXRpb25Qcm9wZXJ0eS4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCA9PT0gc05hdmlnYXRpb25QYXRoIHx8XG5cdFx0XHRcdFx0b1Jlc3RyaWN0ZWRQcm9wZXJ0eS5OYXZpZ2F0aW9uUHJvcGVydHkudmFsdWUgPT09IHNOYXZpZ2F0aW9uUGF0aClcblx0XHRcdCk7XG5cdFx0fSlcblx0KTtcbn07XG5cbmNvbnN0IF9mZXRjaEJhc2ljUHJvcGVydHlJbmZvID0gZnVuY3Rpb24gKG9GaWx0ZXJGaWVsZEluZm86IGFueSkge1xuXHRyZXR1cm4ge1xuXHRcdGtleTogb0ZpbHRlckZpZWxkSW5mby5rZXksXG5cdFx0YW5ub3RhdGlvblBhdGg6IG9GaWx0ZXJGaWVsZEluZm8uYW5ub3RhdGlvblBhdGgsXG5cdFx0Y29uZGl0aW9uUGF0aDogb0ZpbHRlckZpZWxkSW5mby5jb25kaXRpb25QYXRoLFxuXHRcdG5hbWU6IG9GaWx0ZXJGaWVsZEluZm8uY29uZGl0aW9uUGF0aCxcblx0XHRsYWJlbDogb0ZpbHRlckZpZWxkSW5mby5sYWJlbCxcblx0XHRoaWRkZW5GaWx0ZXI6IG9GaWx0ZXJGaWVsZEluZm8uYXZhaWxhYmlsaXR5ID09PSBcIkhpZGRlblwiLFxuXHRcdGRpc3BsYXk6IFwiVmFsdWVcIixcblx0XHRpc1BhcmFtZXRlcjogb0ZpbHRlckZpZWxkSW5mby5pc1BhcmFtZXRlcixcblx0XHRjYXNlU2Vuc2l0aXZlOiBvRmlsdGVyRmllbGRJbmZvLmNhc2VTZW5zaXRpdmUsXG5cdFx0YXZhaWxhYmlsaXR5OiBvRmlsdGVyRmllbGRJbmZvLmF2YWlsYWJpbGl0eSxcblx0XHRwb3NpdGlvbjogb0ZpbHRlckZpZWxkSW5mby5wb3NpdGlvbixcblx0XHR0eXBlOiBvRmlsdGVyRmllbGRJbmZvLnR5cGUsXG5cdFx0dGVtcGxhdGU6IG9GaWx0ZXJGaWVsZEluZm8udGVtcGxhdGUsXG5cdFx0bWVudTogb0ZpbHRlckZpZWxkSW5mby5tZW51LFxuXHRcdHJlcXVpcmVkOiBvRmlsdGVyRmllbGRJbmZvLnJlcXVpcmVkXG5cdH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChhRXhwcmVzc2lvbnM6IGFueSkge1xuXHRjb25zdCBhQWxsb3dlZEV4cHJlc3Npb25zUHJpb3JpdHkgPSBbXG5cdFx0XCJTaW5nbGVWYWx1ZVwiLFxuXHRcdFwiTXVsdGlWYWx1ZVwiLFxuXHRcdFwiU2luZ2xlUmFuZ2VcIixcblx0XHRcIk11bHRpUmFuZ2VcIixcblx0XHRcIlNlYXJjaEV4cHJlc3Npb25cIixcblx0XHRcIk11bHRpUmFuZ2VPclNlYXJjaEV4cHJlc3Npb25cIlxuXHRdO1xuXG5cdGFFeHByZXNzaW9ucy5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xuXHRcdHJldHVybiBhQWxsb3dlZEV4cHJlc3Npb25zUHJpb3JpdHkuaW5kZXhPZihhKSAtIGFBbGxvd2VkRXhwcmVzc2lvbnNQcmlvcml0eS5pbmRleE9mKGIpO1xuXHR9KTtcblxuXHRyZXR1cm4gYUV4cHJlc3Npb25zWzBdO1xufTtcblxuZXhwb3J0IGNvbnN0IGRpc3BsYXlNb2RlID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eUFubm90YXRpb25zOiBhbnksIG9Db2xsZWN0aW9uQW5ub3RhdGlvbnM6IGFueSkge1xuXHRjb25zdCBvVGV4dEFubm90YXRpb24gPSBvUHJvcGVydHlBbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0LFxuXHRcdG9UZXh0QXJyYW5nbWVudEFubm90YXRpb24gPVxuXHRcdFx0b1RleHRBbm5vdGF0aW9uICYmXG5cdFx0XHQoKG9Qcm9wZXJ0eUFubm90YXRpb25zICYmIG9Qcm9wZXJ0eUFubm90YXRpb25zPy5Db21tb24/LlRleHQ/LmFubm90YXRpb25zPy5VST8uVGV4dEFycmFuZ2VtZW50KSB8fFxuXHRcdFx0XHQob0NvbGxlY3Rpb25Bbm5vdGF0aW9ucyAmJiBvQ29sbGVjdGlvbkFubm90YXRpb25zPy5VST8uVGV4dEFycmFuZ2VtZW50KSk7XG5cblx0aWYgKG9UZXh0QXJyYW5nbWVudEFubm90YXRpb24pIHtcblx0XHRpZiAob1RleHRBcnJhbmdtZW50QW5ub3RhdGlvbi52YWx1ZU9mKCkgPT09IFwiVUkuVGV4dEFycmFuZ2VtZW50VHlwZS9UZXh0T25seVwiKSB7XG5cdFx0XHRyZXR1cm4gXCJEZXNjcmlwdGlvblwiO1xuXHRcdH0gZWxzZSBpZiAob1RleHRBcnJhbmdtZW50QW5ub3RhdGlvbi52YWx1ZU9mKCkgPT09IFwiVUkuVGV4dEFycmFuZ2VtZW50VHlwZS9UZXh0TGFzdFwiKSB7XG5cdFx0XHRyZXR1cm4gXCJWYWx1ZURlc2NyaXB0aW9uXCI7XG5cdFx0fVxuXHRcdHJldHVybiBcIkRlc2NyaXB0aW9uVmFsdWVcIjsgLy9UZXh0Rmlyc3Rcblx0fVxuXHRyZXR1cm4gb1RleHRBbm5vdGF0aW9uID8gXCJEZXNjcmlwdGlvblZhbHVlXCIgOiBcIlZhbHVlXCI7XG59O1xuXG5leHBvcnQgY29uc3QgZmV0Y2hQcm9wZXJ0eUluZm8gPSBmdW5jdGlvbiAoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCwgb0ZpbHRlckZpZWxkSW5mbzogYW55LCBvVHlwZUNvbmZpZzogYW55KSB7XG5cdGxldCBvUHJvcGVydHlJbmZvID0gX2ZldGNoQmFzaWNQcm9wZXJ0eUluZm8ob0ZpbHRlckZpZWxkSW5mbyk7XG5cdGNvbnN0IHNBbm5vdGF0aW9uUGF0aCA9IG9GaWx0ZXJGaWVsZEluZm8uYW5ub3RhdGlvblBhdGg7XG5cblx0aWYgKCFzQW5ub3RhdGlvblBhdGgpIHtcblx0XHRyZXR1cm4gb1Byb3BlcnR5SW5mbztcblx0fVxuXHRjb25zdCB0YXJnZXRQcm9wZXJ0eU9iamVjdCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihzQW5ub3RhdGlvblBhdGgpLmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS50YXJnZXRPYmplY3Q7XG5cblx0Y29uc3Qgb1Byb3BlcnR5QW5ub3RhdGlvbnMgPSB0YXJnZXRQcm9wZXJ0eU9iamVjdD8uYW5ub3RhdGlvbnM7XG5cdGNvbnN0IG9Db2xsZWN0aW9uQW5ub3RhdGlvbnMgPSBjb252ZXJ0ZXJDb250ZXh0Py5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkudGFyZ2V0T2JqZWN0Py5hbm5vdGF0aW9ucztcblxuXHRjb25zdCBvRm9ybWF0T3B0aW9ucyA9IG9UeXBlQ29uZmlnLmZvcm1hdE9wdGlvbnM7XG5cdGNvbnN0IG9Db25zdHJhaW50cyA9IG9UeXBlQ29uZmlnLmNvbnN0cmFpbnRzO1xuXHRvUHJvcGVydHlJbmZvID0gT2JqZWN0LmFzc2lnbihvUHJvcGVydHlJbmZvLCB7XG5cdFx0Zm9ybWF0T3B0aW9uczogb0Zvcm1hdE9wdGlvbnMsXG5cdFx0Y29uc3RyYWludHM6IG9Db25zdHJhaW50cyxcblx0XHRkaXNwbGF5OiBkaXNwbGF5TW9kZShvUHJvcGVydHlBbm5vdGF0aW9ucywgb0NvbGxlY3Rpb25Bbm5vdGF0aW9ucylcblx0fSk7XG5cdHJldHVybiBvUHJvcGVydHlJbmZvO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTXVsdGlWYWx1ZSA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IGFueSkge1xuXHRsZXQgYklzTXVsdGlWYWx1ZSA9IHRydWU7XG5cdC8vU2luZ2xlVmFsdWUgfCBNdWx0aVZhbHVlIHwgU2luZ2xlUmFuZ2UgfCBNdWx0aVJhbmdlIHwgU2VhcmNoRXhwcmVzc2lvbiB8IE11bHRpUmFuZ2VPclNlYXJjaEV4cHJlc3Npb25cblx0c3dpdGNoIChvUHJvcGVydHkuZmlsdGVyRXhwcmVzc2lvbikge1xuXHRcdGNhc2UgXCJTZWFyY2hFeHByZXNzaW9uXCI6XG5cdFx0Y2FzZSBcIlNpbmdsZVJhbmdlXCI6XG5cdFx0Y2FzZSBcIlNpbmdsZVZhbHVlXCI6XG5cdFx0XHRiSXNNdWx0aVZhbHVlID0gZmFsc2U7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS50eXBlICYmIG9Qcm9wZXJ0eS50eXBlLmluZGV4T2YoXCJCb29sZWFuXCIpID4gMCkge1xuXHRcdGJJc011bHRpVmFsdWUgPSBmYWxzZTtcblx0fVxuXHRyZXR1cm4gYklzTXVsdGlWYWx1ZTtcbn07XG5cbmNvbnN0IF9pc0ZpbHRlcmFibGVOYXZpZ2F0aW9uUHJvcGVydHkgPSBmdW5jdGlvbiAoXG5cdGVudHJ5OiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzXG4pOiBlbnRyeSBpcyBBbm5vdGF0aW9uVGVybTxEYXRhRmllbGQgfCBEYXRhRmllbGRXaXRoVXJsIHwgRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoPiB7XG5cdHJldHVybiAoXG5cdFx0KGVudHJ5LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQgfHxcblx0XHRcdGVudHJ5LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsIHx8XG5cdFx0XHRlbnRyeS4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoKSAmJlxuXHRcdGVudHJ5LlZhbHVlLnBhdGguaW5jbHVkZXMoXCIvXCIpXG5cdCk7XG59O1xuXG5jb25zdCBnZXRBbm5vdGF0ZWRTZWxlY3Rpb25GaWVsZERhdGEgPSBmdW5jdGlvbiAoXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGxyVGFibGVzOiBUYWJsZVZpc3VhbGl6YXRpb25bXSA9IFtdLFxuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nID0gXCJcIixcblx0aW5jbHVkZUhpZGRlbjogYm9vbGVhbiA9IGZhbHNlLFxuXHRsaW5lSXRlbVRlcm0/OiBzdHJpbmdcbikge1xuXHQvLyBGZXRjaCBhbGwgc2VsZWN0aW9uVmFyaWFudHMgZGVmaW5lZCBpbiB0aGUgZGlmZmVyZW50IHZpc3VhbGl6YXRpb25zIGFuZCBkaWZmZXJlbnQgdmlld3MgKG11bHRpIHRhYmxlIG1vZGUpXG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRzOiBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbltdID0gZ2V0U2VsZWN0aW9uVmFyaWFudHMobHJUYWJsZXMsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdC8vIGNyZWF0ZSBhIG1hcCBvZiBwcm9wZXJ0aWVzIHRvIGJlIHVzZWQgaW4gc2VsZWN0aW9uIHZhcmlhbnRzXG5cdGNvbnN0IGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSBnZXRFeGNsdWRlZEZpbHRlclByb3BlcnRpZXMoc2VsZWN0aW9uVmFyaWFudHMpO1xuXHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdC8vRmlsdGVycyB3aGljaCBoYXMgdG8gYmUgYWRkZWQgd2hpY2ggaXMgcGFydCBvZiBTVi9EZWZhdWx0IGFubm90YXRpb25zIGJ1dCBub3QgcHJlc2VudCBpbiB0aGUgU2VsZWN0aW9uRmllbGRzXG5cdGNvbnN0IGFubm90YXRlZFNlbGVjdGlvbkZpZWxkcyA9ICgoYW5ub3RhdGlvblBhdGggJiYgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihhbm5vdGF0aW9uUGF0aCk/LmFubm90YXRpb24pIHx8XG5cdFx0ZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uVUk/LlNlbGVjdGlvbkZpZWxkcyB8fFxuXHRcdFtdKSBhcyBQcm9wZXJ0eVBhdGhbXTtcblxuXHRjb25zdCBuYXZQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRpZiAobHJUYWJsZXMubGVuZ3RoID09PSAwICYmICEhbGluZUl0ZW1UZXJtKSB7XG5cdFx0KGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24obGluZUl0ZW1UZXJtKS5hbm5vdGF0aW9uIGFzIExpbmVJdGVtKT8uZm9yRWFjaCgoZW50cnkpID0+IHtcblx0XHRcdGlmIChfaXNGaWx0ZXJhYmxlTmF2aWdhdGlvblByb3BlcnR5KGVudHJ5KSkge1xuXHRcdFx0XHRpZiAoIW5hdlByb3BlcnRpZXMuaW5jbHVkZXMoZW50cnkuVmFsdWUucGF0aC5zcGxpdChcIi9cIilbMF0pKSB7XG5cdFx0XHRcdFx0bmF2UHJvcGVydGllcy5wdXNoKGVudHJ5LlZhbHVlLnBhdGguc3BsaXQoXCIvXCIpWzBdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gY3JlYXRlIGEgbWFwIG9mIGFsbCBwb3RlbnRpYWwgZmlsdGVyIGZpZWxkcyBiYXNlZCBvbi4uLlxuXHRjb25zdCBmaWx0ZXJGaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPiA9IHtcblx0XHQvLyAuLi5ub24gaGlkZGVuIHByb3BlcnRpZXMgb2YgdGhlIGVudGl0eVxuXHRcdC4uLl9nZXRTZWxlY3Rpb25GaWVsZHMoZW50aXR5VHlwZSwgXCJcIiwgZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLCBpbmNsdWRlSGlkZGVuLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHQvLyAuLi4gbm9uIGhpZGRlbiBwcm9wZXJ0aWVzIG9mIG5hdmlnYXRpb24gcHJvcGVydGllc1xuXHRcdC4uLl9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGgoZW50aXR5VHlwZSwgbmF2UHJvcGVydGllcywgZmFsc2UsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdC8vIC4uLmFkZGl0aW9uYWwgbWFuaWZlc3QgZGVmaW5lZCBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblx0XHQuLi5fZ2V0U2VsZWN0aW9uRmllbGRzQnlQYXRoKFxuXHRcdFx0ZW50aXR5VHlwZSxcblx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0RmlsdGVyQ29uZmlndXJhdGlvbigpLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLFxuXHRcdFx0aW5jbHVkZUhpZGRlbixcblx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHQpXG5cdH07XG5cdGxldCBhU2VsZWN0T3B0aW9uczogYW55W10gPSBbXTtcblx0Y29uc3Qgc2VsZWN0aW9uVmFyaWFudCA9IGdldFNlbGVjdGlvblZhcmlhbnQoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cdGlmIChzZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0YVNlbGVjdE9wdGlvbnMgPSBzZWxlY3Rpb25WYXJpYW50LlNlbGVjdE9wdGlvbnM7XG5cdH1cblxuXHRjb25zdCBwcm9wZXJ0eUluZm9GaWVsZHM6IGFueSA9XG5cdFx0YW5ub3RhdGVkU2VsZWN0aW9uRmllbGRzPy5yZWR1Y2UoKHNlbGVjdGlvbkZpZWxkczogRmlsdGVyRmllbGRbXSwgc2VsZWN0aW9uRmllbGQpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5UGF0aCA9IHNlbGVjdGlvbkZpZWxkLnZhbHVlO1xuXHRcdFx0aWYgKCEocHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpIHtcblx0XHRcdFx0bGV0IG5hdmlnYXRpb25QYXRoOiBzdHJpbmc7XG5cdFx0XHRcdGlmIChhbm5vdGF0aW9uUGF0aC5zdGFydHNXaXRoKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvbkZpZWxkc1wiKSkge1xuXHRcdFx0XHRcdG5hdmlnYXRpb25QYXRoID0gXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuYXZpZ2F0aW9uUGF0aCA9IGFubm90YXRpb25QYXRoLnNwbGl0KFwiL0Bjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIilbMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBmaWx0ZXJQcm9wZXJ0eVBhdGggPSBuYXZpZ2F0aW9uUGF0aCA/IG5hdmlnYXRpb25QYXRoICsgXCIvXCIgKyBwcm9wZXJ0eVBhdGggOiBwcm9wZXJ0eVBhdGg7XG5cdFx0XHRcdGNvbnN0IGZpbHRlckZpZWxkOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCA9IF9nZXRGaWx0ZXJGaWVsZChcblx0XHRcdFx0XHRmaWx0ZXJGaWVsZHMsXG5cdFx0XHRcdFx0ZmlsdGVyUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0ZW50aXR5VHlwZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoZmlsdGVyRmllbGQpIHtcblx0XHRcdFx0XHRmaWx0ZXJGaWVsZC5ncm91cCA9IFwiXCI7XG5cdFx0XHRcdFx0ZmlsdGVyRmllbGQuZ3JvdXBMYWJlbCA9IFwiXCI7XG5cdFx0XHRcdFx0c2VsZWN0aW9uRmllbGRzLnB1c2goZmlsdGVyRmllbGQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uRmllbGRzO1xuXHRcdH0sIFtdKSB8fCBbXTtcblxuXHRjb25zdCBkZWZhdWx0RmlsdGVyRmllbGRzID0gX2dldERlZmF1bHRGaWx0ZXJGaWVsZHMoXG5cdFx0YVNlbGVjdE9wdGlvbnMsXG5cdFx0ZW50aXR5VHlwZSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcyxcblx0XHRhbm5vdGF0ZWRTZWxlY3Rpb25GaWVsZHNcblx0KTtcblxuXHRyZXR1cm4ge1xuXHRcdGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzLFxuXHRcdGVudGl0eVR5cGU6IGVudGl0eVR5cGUsXG5cdFx0YW5ub3RhdGVkU2VsZWN0aW9uRmllbGRzOiBhbm5vdGF0ZWRTZWxlY3Rpb25GaWVsZHMsXG5cdFx0ZmlsdGVyRmllbGRzOiBmaWx0ZXJGaWVsZHMsXG5cdFx0cHJvcGVydHlJbmZvRmllbGRzOiBwcm9wZXJ0eUluZm9GaWVsZHMsXG5cdFx0ZGVmYXVsdEZpbHRlckZpZWxkczogZGVmYXVsdEZpbHRlckZpZWxkc1xuXHR9O1xufTtcblxuZXhwb3J0IGNvbnN0IGZldGNoVHlwZUNvbmZpZyA9IGZ1bmN0aW9uIChwcm9wZXJ0eTogUHJvcGVydHkpIHtcblx0Y29uc3Qgb1R5cGVDb25maWcgPSBnZXRUeXBlQ29uZmlnKHByb3BlcnR5LCBwcm9wZXJ0eT8udHlwZSk7XG5cdGlmIChwcm9wZXJ0eT8udHlwZSA9PT0gc0VkbVN0cmluZyAmJiAob1R5cGVDb25maWcuY29uc3RyYWludHMubnVsbGFibGUgPT09IHVuZGVmaW5lZCB8fCBvVHlwZUNvbmZpZy5jb25zdHJhaW50cy5udWxsYWJsZSA9PT0gdHJ1ZSkpIHtcblx0XHRvVHlwZUNvbmZpZy5mb3JtYXRPcHRpb25zLnBhcnNlS2VlcHNFbXB0eVN0cmluZyA9IGZhbHNlO1xuXHR9XG5cdHJldHVybiBvVHlwZUNvbmZpZztcbn07XG5cbmV4cG9ydCBjb25zdCBhc3NpZ25EYXRhVHlwZVRvUHJvcGVydHlJbmZvID0gZnVuY3Rpb24gKFxuXHRwcm9wZXJ0eUluZm9GaWVsZDogYW55LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRhUmVxdWlyZWRQcm9wczogYW55LFxuXHRhVHlwZUNvbmZpZzogYW55XG4pIHtcblx0bGV0IG9Qcm9wZXJ0eUluZm86IGFueSA9IGZldGNoUHJvcGVydHlJbmZvKGNvbnZlcnRlckNvbnRleHQsIHByb3BlcnR5SW5mb0ZpZWxkLCBhVHlwZUNvbmZpZ1twcm9wZXJ0eUluZm9GaWVsZC5rZXldKSxcblx0XHRzUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBcIlwiO1xuXHRpZiAocHJvcGVydHlJbmZvRmllbGQuY29uZGl0aW9uUGF0aCkge1xuXHRcdHNQcm9wZXJ0eVBhdGggPSBwcm9wZXJ0eUluZm9GaWVsZC5jb25kaXRpb25QYXRoLnJlcGxhY2UoL1xcK3xcXCovZywgXCJcIik7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eUluZm8pIHtcblx0XHRvUHJvcGVydHlJbmZvID0gT2JqZWN0LmFzc2lnbihvUHJvcGVydHlJbmZvLCB7XG5cdFx0XHRtYXhDb25kaXRpb25zOiAhb1Byb3BlcnR5SW5mby5pc1BhcmFtZXRlciAmJiBpc011bHRpVmFsdWUob1Byb3BlcnR5SW5mbykgPyAtMSA6IDEsXG5cdFx0XHRyZXF1aXJlZDogcHJvcGVydHlJbmZvRmllbGQucmVxdWlyZWQgPz8gKG9Qcm9wZXJ0eUluZm8uaXNQYXJhbWV0ZXIgfHwgYVJlcXVpcmVkUHJvcHMuaW5kZXhPZihzUHJvcGVydHlQYXRoKSA+PSAwKSxcblx0XHRcdGNhc2VTZW5zaXRpdmU6IGlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZShjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdGRhdGFUeXBlOiBhVHlwZUNvbmZpZ1twcm9wZXJ0eUluZm9GaWVsZC5rZXldLnR5cGVcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gb1Byb3BlcnR5SW5mbztcbn07XG5cbmV4cG9ydCBjb25zdCBwcm9jZXNzU2VsZWN0aW9uRmllbGRzID0gZnVuY3Rpb24gKFxuXHRwcm9wZXJ0eUluZm9GaWVsZHM6IGFueSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZGVmYXVsdFZhbHVlUHJvcGVydHlGaWVsZHM/OiBhbnlcbikge1xuXHQvL2dldCBUeXBlQ29uZmlnIGZ1bmN0aW9uXG5cdGNvbnN0IHNlbGVjdGlvbkZpZWxkVHlwZXM6IGFueSA9IFtdO1xuXHRjb25zdCBhVHlwZUNvbmZpZzogYW55ID0ge307XG5cblx0aWYgKGRlZmF1bHRWYWx1ZVByb3BlcnR5RmllbGRzKSB7XG5cdFx0cHJvcGVydHlJbmZvRmllbGRzID0gcHJvcGVydHlJbmZvRmllbGRzLmNvbmNhdChkZWZhdWx0VmFsdWVQcm9wZXJ0eUZpZWxkcyk7XG5cdH1cblx0Ly9hZGQgdHlwZUNvbmZpZ1xuXHRwcm9wZXJ0eUluZm9GaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW1ldGVyRmllbGQ6IGFueSkge1xuXHRcdGlmIChwYXJhbWV0ZXJGaWVsZC5hbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlDb252ZXJ0eUNvbnRleHQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlckNvbnRleHRGb3IocGFyYW1ldGVyRmllbGQuYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0Y29uc3QgcHJvcGVydHlUYXJnZXRPYmplY3QgPSBwcm9wZXJ0eUNvbnZlcnR5Q29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkudGFyZ2V0T2JqZWN0O1xuXHRcdFx0c2VsZWN0aW9uRmllbGRUeXBlcy5wdXNoKHByb3BlcnR5VGFyZ2V0T2JqZWN0Py50eXBlKTtcblx0XHRcdGNvbnN0IG9UeXBlQ29uZmlnID0gZmV0Y2hUeXBlQ29uZmlnKHByb3BlcnR5VGFyZ2V0T2JqZWN0KTtcblx0XHRcdGFUeXBlQ29uZmlnW3BhcmFtZXRlckZpZWxkLmtleV0gPSBvVHlwZUNvbmZpZztcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VsZWN0aW9uRmllbGRUeXBlcy5wdXNoKHNFZG1TdHJpbmcpO1xuXHRcdFx0YVR5cGVDb25maWdbcGFyYW1ldGVyRmllbGQua2V5XSA9IHsgdHlwZTogc1N0cmluZ0RhdGFUeXBlIH07XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBmaWx0ZXJSZXN0cmljdGlvbnNcblx0bGV0IF9vRmlsdGVycmVzdHJpY3Rpb25zO1xuXHRpZiAoIU1vZGVsSGVscGVyLmlzU2luZ2xldG9uKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkpKSB7XG5cdFx0X29GaWx0ZXJyZXN0cmljdGlvbnMgPSAoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcyBhcyBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMpXG5cdFx0XHQ/LkZpbHRlclJlc3RyaWN0aW9ucztcblx0fVxuXHRjb25zdCBvRmlsdGVyUmVzdHJpY3Rpb25zID0gX29GaWx0ZXJyZXN0cmljdGlvbnM7XG5cdGNvbnN0IG9SZXQgPSB7fSBhcyBhbnk7XG5cdG9SZXRbXCJSZXF1aXJlZFByb3BlcnRpZXNcIl0gPSBnZXRGaWx0ZXJSZXN0cmljdGlvbnMob0ZpbHRlclJlc3RyaWN0aW9ucywgXCJSZXF1aXJlZFByb3BlcnRpZXNcIikgfHwgW107XG5cdG9SZXRbXCJOb25GaWx0ZXJhYmxlUHJvcGVydGllc1wiXSA9IGdldEZpbHRlclJlc3RyaWN0aW9ucyhvRmlsdGVyUmVzdHJpY3Rpb25zLCBcIk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzXCIpIHx8IFtdO1xuXHRvUmV0W1wiRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zXCJdID0gZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9GaWx0ZXJSZXN0cmljdGlvbnMsIFwiRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zXCIpIHx8IHt9O1xuXG5cdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRDb250ZXh0UGF0aCgpO1xuXHRjb25zdCBhUGF0aFBhcnRzID0gc0VudGl0eVNldFBhdGguc3BsaXQoXCIvXCIpO1xuXHRpZiAoYVBhdGhQYXJ0cy5sZW5ndGggPiAyKSB7XG5cdFx0Y29uc3Qgc05hdmlnYXRpb25QYXRoID0gYVBhdGhQYXJ0c1thUGF0aFBhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdGFQYXRoUGFydHMuc3BsaWNlKC0xLCAxKTtcblx0XHRjb25zdCBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucyA9IGdldE5hdmlnYXRpb25SZXN0cmljdGlvbnMoY29udmVydGVyQ29udGV4dCwgc05hdmlnYXRpb25QYXRoKTtcblx0XHRjb25zdCBvTmF2aWdhdGlvbkZpbHRlclJlc3RyaWN0aW9ucyA9IG9OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zICYmIG9OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zLkZpbHRlclJlc3RyaWN0aW9ucztcblx0XHRvUmV0LlJlcXVpcmVkUHJvcGVydGllcy5jb25jYXQoZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9OYXZpZ2F0aW9uRmlsdGVyUmVzdHJpY3Rpb25zLCBcIlJlcXVpcmVkUHJvcGVydGllc1wiKSB8fCBbXSk7XG5cdFx0b1JldC5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcy5jb25jYXQoZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9OYXZpZ2F0aW9uRmlsdGVyUmVzdHJpY3Rpb25zLCBcIk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzXCIpIHx8IFtdKTtcblx0XHRvUmV0LkZpbHRlckFsbG93ZWRFeHByZXNzaW9ucyA9IHtcblx0XHRcdC4uLihnZXRGaWx0ZXJSZXN0cmljdGlvbnMob05hdmlnYXRpb25GaWx0ZXJSZXN0cmljdGlvbnMsIFwiRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zXCIpIHx8IHt9KSxcblx0XHRcdC4uLm9SZXQuRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zXG5cdFx0fTtcblx0fVxuXHRjb25zdCBhUmVxdWlyZWRQcm9wcyA9IG9SZXQuUmVxdWlyZWRQcm9wZXJ0aWVzO1xuXHRjb25zdCBhTm9uRmlsdGVyYWJsZVByb3BzID0gb1JldC5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcztcblx0Y29uc3QgYUZldGNoZWRQcm9wZXJ0aWVzOiBhbnkgPSBbXTtcblxuXHQvLyBwcm9jZXNzIHRoZSBmaWVsZHMgdG8gYWRkIG5lY2Vzc2FyeSBwcm9wZXJ0aWVzXG5cdHByb3BlcnR5SW5mb0ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eUluZm9GaWVsZDogYW55KSB7XG5cdFx0bGV0IHNQcm9wZXJ0eVBhdGg7XG5cdFx0aWYgKGFOb25GaWx0ZXJhYmxlUHJvcHMuaW5kZXhPZihzUHJvcGVydHlQYXRoKSA9PT0gLTEpIHtcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eUluZm8gPSBhc3NpZ25EYXRhVHlwZVRvUHJvcGVydHlJbmZvKHByb3BlcnR5SW5mb0ZpZWxkLCBjb252ZXJ0ZXJDb250ZXh0LCBhUmVxdWlyZWRQcm9wcywgYVR5cGVDb25maWcpO1xuXHRcdFx0YUZldGNoZWRQcm9wZXJ0aWVzLnB1c2gob1Byb3BlcnR5SW5mbyk7XG5cdFx0fVxuXHR9KTtcblxuXHQvL2FkZCBlZGl0XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0aWYgKE1vZGVsSGVscGVyLmlzT2JqZWN0UGF0aERyYWZ0U3VwcG9ydGVkKGRhdGFNb2RlbE9iamVjdFBhdGgpKSB7XG5cdFx0YUZldGNoZWRQcm9wZXJ0aWVzLnB1c2goZ2V0RWRpdFN0YXRlRmlsdGVyUHJvcGVydHlJbmZvKCkpO1xuXHR9XG5cdC8vIGFkZCBzZWFyY2hcblx0Y29uc3Qgc2VhcmNoUmVzdHJpY3Rpb25zID0gZ2V0U2VhcmNoUmVzdHJpY3Rpb25zKGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBoaWRlQmFzaWNTZWFyY2ggPSBCb29sZWFuKHNlYXJjaFJlc3RyaWN0aW9ucyAmJiAhc2VhcmNoUmVzdHJpY3Rpb25zLlNlYXJjaGFibGUpO1xuXHRpZiAoc0VudGl0eVNldFBhdGggJiYgaGlkZUJhc2ljU2VhcmNoICE9PSB0cnVlKSB7XG5cdFx0aWYgKCFzZWFyY2hSZXN0cmljdGlvbnMgfHwgc2VhcmNoUmVzdHJpY3Rpb25zPy5TZWFyY2hhYmxlKSB7XG5cdFx0XHRhRmV0Y2hlZFByb3BlcnRpZXMucHVzaChnZXRTZWFyY2hGaWx0ZXJQcm9wZXJ0eUluZm8oKSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGFGZXRjaGVkUHJvcGVydGllcztcbn07XG5cbmV4cG9ydCBjb25zdCBpbnNlcnRDdXN0b21NYW5pZmVzdEVsZW1lbnRzID0gZnVuY3Rpb24gKFxuXHRmaWx0ZXJGaWVsZHM6IEZpbHRlckZpZWxkW10sXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbikge1xuXHRyZXR1cm4gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoZmlsdGVyRmllbGRzLCBnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyhlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KSwge1xuXHRcdFwiYXZhaWxhYmlsaXR5XCI6IFwib3ZlcndyaXRlXCIsXG5cdFx0bGFiZWw6IFwib3ZlcndyaXRlXCIsXG5cdFx0dHlwZTogXCJvdmVyd3JpdGVcIixcblx0XHRwb3NpdGlvbjogXCJvdmVyd3JpdGVcIixcblx0XHR0ZW1wbGF0ZTogXCJvdmVyd3JpdGVcIixcblx0XHRzZXR0aW5nczogXCJvdmVyd3JpdGVcIixcblx0XHR2aXN1YWxGaWx0ZXI6IFwib3ZlcndyaXRlXCIsXG5cdFx0cmVxdWlyZWQ6IFwib3ZlcndyaXRlXCJcblx0fSk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgc2VsZWN0aW9uIGZpZWxkcyB0aGF0IHdpbGwgYmUgdXNlZCB3aXRoaW4gdGhlIGZpbHRlciBiYXJcbiAqIFRoaXMgY29uZmlndXJhdGlvbiB0YWtlcyBpbnRvIGFjY291bnQgdGhlIGFubm90YXRpb24gYW5kIHRoZSBzZWxlY3Rpb24gdmFyaWFudHMuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBsclRhYmxlc1xuICogQHBhcmFtIGFubm90YXRpb25QYXRoXG4gKiBAcGFyYW0gW2luY2x1ZGVIaWRkZW5dXG4gKiBAcGFyYW0gW2xpbmVJdGVtVGVybV1cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHNlbGVjdGlvbiBmaWVsZHNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNlbGVjdGlvbkZpZWxkcyA9IGZ1bmN0aW9uIChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bHJUYWJsZXM6IFRhYmxlVmlzdWFsaXphdGlvbltdID0gW10sXG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmcgPSBcIlwiLFxuXHRpbmNsdWRlSGlkZGVuPzogYm9vbGVhbixcblx0bGluZUl0ZW1UZXJtPzogc3RyaW5nXG4pOiBhbnkge1xuXHRjb25zdCBvQW5ub3RhdGVkU2VsZWN0aW9uRmllbGREYXRhID0gZ2V0QW5ub3RhdGVkU2VsZWN0aW9uRmllbGREYXRhKFxuXHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0bHJUYWJsZXMsXG5cdFx0YW5ub3RhdGlvblBhdGgsXG5cdFx0aW5jbHVkZUhpZGRlbixcblx0XHRsaW5lSXRlbVRlcm1cblx0KTtcblx0Y29uc3QgcGFyYW1ldGVyRmllbGRzID0gX2dldFBhcmFtZXRlckZpZWxkcyhjb252ZXJ0ZXJDb250ZXh0KTtcblx0bGV0IHByb3BlcnR5SW5mb0ZpZWxkczogRmlsdGVyRmllbGRbXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob0Fubm90YXRlZFNlbGVjdGlvbkZpZWxkRGF0YS5wcm9wZXJ0eUluZm9GaWVsZHMpKTtcblx0Y29uc3QgZW50aXR5VHlwZSA9IG9Bbm5vdGF0ZWRTZWxlY3Rpb25GaWVsZERhdGEuZW50aXR5VHlwZTtcblxuXHRwcm9wZXJ0eUluZm9GaWVsZHMgPSBwYXJhbWV0ZXJGaWVsZHMuY29uY2F0KHByb3BlcnR5SW5mb0ZpZWxkcyk7XG5cblx0cHJvcGVydHlJbmZvRmllbGRzID0gaW5zZXJ0Q3VzdG9tTWFuaWZlc3RFbGVtZW50cyhwcm9wZXJ0eUluZm9GaWVsZHMsIGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdGNvbnN0IGFGZXRjaGVkUHJvcGVydGllcyA9IHByb2Nlc3NTZWxlY3Rpb25GaWVsZHMoXG5cdFx0cHJvcGVydHlJbmZvRmllbGRzLFxuXHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0b0Fubm90YXRlZFNlbGVjdGlvbkZpZWxkRGF0YS5kZWZhdWx0RmlsdGVyRmllbGRzXG5cdCk7XG5cdGFGZXRjaGVkUHJvcGVydGllcy5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xuXHRcdGlmIChhLmdyb3VwTGFiZWwgPT09IHVuZGVmaW5lZCB8fCBhLmdyb3VwTGFiZWwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cdFx0aWYgKGIuZ3JvdXBMYWJlbCA9PT0gdW5kZWZpbmVkIHx8IGIuZ3JvdXBMYWJlbCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIDE7XG5cdFx0fVxuXHRcdHJldHVybiBhLmdyb3VwTGFiZWwubG9jYWxlQ29tcGFyZShiLmdyb3VwTGFiZWwpO1xuXHR9KTtcblxuXHRsZXQgc0ZldGNoUHJvcGVydGllcyA9IEpTT04uc3RyaW5naWZ5KGFGZXRjaGVkUHJvcGVydGllcyk7XG5cdHNGZXRjaFByb3BlcnRpZXMgPSBzRmV0Y2hQcm9wZXJ0aWVzLnJlcGxhY2UoL1xcey9nLCBcIlxcXFx7XCIpO1xuXHRzRmV0Y2hQcm9wZXJ0aWVzID0gc0ZldGNoUHJvcGVydGllcy5yZXBsYWNlKC9cXH0vZywgXCJcXFxcfVwiKTtcblx0Y29uc3Qgc1Byb3BlcnR5SW5mbyA9IHNGZXRjaFByb3BlcnRpZXM7XG5cdC8vIGVuZCBvZiBwcm9wZXJ0eUZpZWxkcyBwcm9jZXNzaW5nXG5cblx0Ly8gdG8gcG9wdWxhdGUgc2VsZWN0aW9uIGZpZWxkc1xuXHRsZXQgcHJvcFNlbGVjdGlvbkZpZWxkczogRmlsdGVyRmllbGRbXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob0Fubm90YXRlZFNlbGVjdGlvbkZpZWxkRGF0YS5wcm9wZXJ0eUluZm9GaWVsZHMpKTtcblx0cHJvcFNlbGVjdGlvbkZpZWxkcyA9IHBhcmFtZXRlckZpZWxkcy5jb25jYXQocHJvcFNlbGVjdGlvbkZpZWxkcyk7XG5cdC8vIGNyZWF0ZSBhIG1hcCBvZiBwcm9wZXJ0aWVzIHRvIGJlIHVzZWQgaW4gc2VsZWN0aW9uIHZhcmlhbnRzXG5cdGNvbnN0IGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSBvQW5ub3RhdGVkU2VsZWN0aW9uRmllbGREYXRhLmV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcztcblx0Y29uc3QgZmlsdGVyRmFjZXRzID0gZW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LlVJPy5GaWx0ZXJGYWNldHM7XG5cdGxldCBmaWx0ZXJGYWNldE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+ID0ge307XG5cblx0Y29uc3QgYUZpZWxkR3JvdXBzID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uc0J5VGVybShcIlVJXCIsIFVJQW5ub3RhdGlvblRlcm1zLkZpZWxkR3JvdXApO1xuXG5cdGlmIChmaWx0ZXJGYWNldHMgPT09IHVuZGVmaW5lZCB8fCBmaWx0ZXJGYWNldHMubGVuZ3RoIDwgMCkge1xuXHRcdGZvciAoY29uc3QgaSBpbiBhRmllbGRHcm91cHMpIHtcblx0XHRcdGZpbHRlckZhY2V0TWFwID0ge1xuXHRcdFx0XHQuLi5maWx0ZXJGYWNldE1hcCxcblx0XHRcdFx0Li4uZ2V0RmllbGRHcm91cEZpbHRlckdyb3VwcyhhRmllbGRHcm91cHNbaV0pXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmaWx0ZXJGYWNldE1hcCA9IGZpbHRlckZhY2V0cy5yZWR1Y2UoKHByZXZpb3VzVmFsdWU6IFJlY29yZDxzdHJpbmcsIEZpbHRlckdyb3VwPiwgZmlsdGVyRmFjZXQ6IFJlZmVyZW5jZUZhY2V0VHlwZXMpID0+IHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgKGZpbHRlckZhY2V0Py5UYXJnZXQ/LiR0YXJnZXQgYXMgRmllbGRHcm91cCk/LkRhdGE/Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHByZXZpb3VzVmFsdWVbKChmaWx0ZXJGYWNldD8uVGFyZ2V0Py4kdGFyZ2V0IGFzIEZpZWxkR3JvdXApPy5EYXRhW2ldIGFzIERhdGFGaWVsZFR5cGVzKT8uVmFsdWU/LnBhdGhdID0ge1xuXHRcdFx0XHRcdGdyb3VwOiBmaWx0ZXJGYWNldD8uSUQ/LnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0Z3JvdXBMYWJlbDogZmlsdGVyRmFjZXQ/LkxhYmVsPy50b1N0cmluZygpXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHJldmlvdXNWYWx1ZTtcblx0XHR9LCB7fSk7XG5cdH1cblxuXHQvLyBjcmVhdGUgYSBtYXAgb2YgYWxsIHBvdGVudGlhbCBmaWx0ZXIgZmllbGRzIGJhc2VkIG9uLi4uXG5cdGNvbnN0IGZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0gb0Fubm90YXRlZFNlbGVjdGlvbkZpZWxkRGF0YS5maWx0ZXJGaWVsZHM7XG5cblx0Ly8gZmluYWxseSBjcmVhdGUgZmluYWwgbGlzdCBvZiBmaWx0ZXIgZmllbGRzIGJ5IGFkZGluZyB0aGUgU2VsZWN0aW9uRmllbGRzIGZpcnN0IChvcmRlciBtYXR0ZXJzKS4uLlxuXHRsZXQgYWxsRmlsdGVycyA9IHByb3BTZWxlY3Rpb25GaWVsZHNcblxuXHRcdC8vIC4uLmFuZCBhZGRpbmcgcmVtYWluaW5nIGZpbHRlciBmaWVsZHMsIHRoYXQgYXJlIG5vdCB1c2VkIGluIGEgU2VsZWN0aW9uVmFyaWFudCAob3JkZXIgZG9lc24ndCBtYXR0ZXIpXG5cdFx0LmNvbmNhdChcblx0XHRcdE9iamVjdC5rZXlzKGZpbHRlckZpZWxkcylcblx0XHRcdFx0LmZpbHRlcigocHJvcGVydHlQYXRoKSA9PiAhKHByb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKVxuXHRcdFx0XHQubWFwKChwcm9wZXJ0eVBhdGgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihmaWx0ZXJGaWVsZHNbcHJvcGVydHlQYXRoXSwgZmlsdGVyRmFjZXRNYXBbcHJvcGVydHlQYXRoXSk7XG5cdFx0XHRcdH0pXG5cdFx0KTtcblx0Y29uc3Qgc0NvbnRleHRQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRDb250ZXh0UGF0aCgpO1xuXG5cdC8vaWYgYWxsIHRhYmxlcyBhcmUgYW5hbHl0aWNhbCB0YWJsZXMgXCJhZ2dyZWdhdGFibGVcIiBwcm9wZXJ0aWVzIG11c3QgYmUgZXhjbHVkZWRcblx0aWYgKGNoZWNrQWxsVGFibGVGb3JFbnRpdHlTZXRBcmVBbmFseXRpY2FsKGxyVGFibGVzLCBzQ29udGV4dFBhdGgpKSB7XG5cdFx0Ly8gQ3VycmVudGx5IGFsbCBhZ3JlZ2F0ZXMgYXJlIHJvb3QgZW50aXR5IHByb3BlcnRpZXMgKG5vIHByb3BlcnRpZXMgY29taW5nIGZyb20gbmF2aWdhdGlvbikgYW5kIGFsbFxuXHRcdC8vIHRhYmxlcyB3aXRoIHNhbWUgZW50aXR5U2V0IGdldHMgc2FtZSBhZ2dyZWFndGUgY29uZmlndXJhdGlvbiB0aGF0J3Mgd2h5IHdlIGNhbiB1c2UgZmlyc3QgdGFibGUgaW50b1xuXHRcdC8vIExSIHRvIGdldCBhZ2dyZWdhdGVzICh3aXRob3V0IGN1cnJlbmN5L3VuaXQgcHJvcGVydGllcyBzaW5jZSB3ZSBleHBlY3QgdG8gYmUgYWJsZSB0byBmaWx0ZXIgdGhlbSkuXG5cdFx0Y29uc3QgYWdncmVnYXRlcyA9IGxyVGFibGVzWzBdLmFnZ3JlZ2F0ZXM7XG5cdFx0aWYgKGFnZ3JlZ2F0ZXMpIHtcblx0XHRcdGNvbnN0IGFnZ3JlZ2F0YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoYWdncmVnYXRlcykubWFwKChhZ2dyZWdhdGVLZXkpID0+IGFnZ3JlZ2F0ZXNbYWdncmVnYXRlS2V5XS5yZWxhdGl2ZVBhdGgpO1xuXHRcdFx0YWxsRmlsdGVycyA9IGFsbEZpbHRlcnMuZmlsdGVyKChmaWx0ZXJGaWVsZCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWdncmVnYXRhYmxlUHJvcGVydGllcy5pbmRleE9mKGZpbHRlckZpZWxkLmtleSkgPT09IC0xO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRzID0gaW5zZXJ0Q3VzdG9tTWFuaWZlc3RFbGVtZW50cyhhbGxGaWx0ZXJzLCBlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHQvLyBBZGQgY2FzZVNlbnNpdGl2ZSBwcm9wZXJ0eSB0byBhbGwgc2VsZWN0aW9uIGZpZWxkcy5cblx0Y29uc3QgaXNDYXNlU2Vuc2l0aXZlID0gaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlKGNvbnZlcnRlckNvbnRleHQpO1xuXHRzZWxlY3Rpb25GaWVsZHMuZm9yRWFjaCgoZmlsdGVyRmllbGQpID0+IHtcblx0XHRmaWx0ZXJGaWVsZC5jYXNlU2Vuc2l0aXZlID0gaXNDYXNlU2Vuc2l0aXZlO1xuXHR9KTtcblxuXHRyZXR1cm4geyBzZWxlY3Rpb25GaWVsZHMsIHNQcm9wZXJ0eUluZm8gfTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBmaWx0ZXIgYmFyIGluc2lkZSBhIHZhbHVlIGhlbHAgZGlhbG9nIHNob3VsZCBiZSBleHBhbmRlZC4gVGhpcyBpcyB0cnVlIGlmIG9uZSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgaG9sZDpcbiAqICgxKSBhIGZpbHRlciBwcm9wZXJ0eSBpcyBtYW5kYXRvcnksXG4gKiAoMikgbm8gc2VhcmNoIGZpZWxkIGV4aXN0cyAoZW50aXR5IGlzbid0IHNlYXJjaCBlbmFibGVkKSxcbiAqICgzKSB3aGVuIHRoZSBkYXRhIGlzbid0IGxvYWRlZCBieSBkZWZhdWx0IChhbm5vdGF0aW9uIEZldGNoVmFsdWVzID0gMikuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gZmlsdGVyUmVzdHJpY3Rpb25zQW5ub3RhdGlvbiBUaGUgRmlsdGVyUmVzdHJpY3Rpb24gYW5ub3RhdGlvblxuICogQHBhcmFtIHZhbHVlTGlzdEFubm90YXRpb24gVGhlIFZhbHVlTGlzdCBhbm5vdGF0aW9uXG4gKiBAcmV0dXJucyBUaGUgdmFsdWUgZm9yIGV4cGFuZEZpbHRlckZpZWxkc1xuICovXG5leHBvcnQgY29uc3QgZ2V0RXhwYW5kRmlsdGVyRmllbGRzID0gZnVuY3Rpb24gKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRmaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uOiBhbnksXG5cdHZhbHVlTGlzdEFubm90YXRpb246IGFueVxuKTogYm9vbGVhbiB7XG5cdGNvbnN0IHJlcXVpcmVkUHJvcGVydGllcyA9IGdldEZpbHRlclJlc3RyaWN0aW9ucyhmaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uLCBcIlJlcXVpcmVkUHJvcGVydGllc1wiKTtcblx0Y29uc3Qgc2VhcmNoUmVzdHJpY3Rpb25zID0gZ2V0U2VhcmNoUmVzdHJpY3Rpb25zKGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBoaWRlQmFzaWNTZWFyY2ggPSBCb29sZWFuKHNlYXJjaFJlc3RyaWN0aW9ucyAmJiAhc2VhcmNoUmVzdHJpY3Rpb25zLlNlYXJjaGFibGUpO1xuXHRjb25zdCB2YWx1ZUxpc3QgPSB2YWx1ZUxpc3RBbm5vdGF0aW9uLmdldE9iamVjdCgpO1xuXHRpZiAocmVxdWlyZWRQcm9wZXJ0aWVzLmxlbmd0aCA+IDAgfHwgaGlkZUJhc2ljU2VhcmNoIHx8IHZhbHVlTGlzdD8uRmV0Y2hWYWx1ZXMgPT09IDIpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW9ES0EsZTs7YUFBQUEsZTtJQUFBQSxlO0lBQUFBLGU7S0FBQUEsZSxLQUFBQSxlOztFQUtMLElBQU1DLFVBQVUsR0FBRyxZQUFuQjtFQUNBLElBQU1DLGVBQWUsR0FBRyxnQ0FBeEI7O0VBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsU0FBU0MseUJBQVQsQ0FBbUNDLFVBQW5DLEVBQXdGO0lBQ3ZGLElBQU1DLGNBQTJDLEdBQUcsRUFBcEQ7SUFDQUQsVUFBVSxDQUFDRSxJQUFYLENBQWdCQyxPQUFoQixDQUF3QixVQUFDQyxTQUFELEVBQXVDO01BQzlELElBQUlBLFNBQVMsQ0FBQ0MsS0FBVixLQUFvQixzQ0FBeEIsRUFBZ0U7UUFBQTs7UUFDL0RKLGNBQWMsQ0FBQ0csU0FBUyxDQUFDRSxLQUFWLENBQWdCQyxJQUFqQixDQUFkLEdBQXVDO1VBQ3RDQyxLQUFLLEVBQUVSLFVBQVUsQ0FBQ1Msa0JBRG9CO1VBRXRDQyxVQUFVLEVBQ1RDLGlCQUFpQixDQUNoQkMsMkJBQTJCLENBQUNaLFVBQVUsQ0FBQ2EsS0FBWCw4QkFBb0JiLFVBQVUsQ0FBQ2MsV0FBL0Isb0ZBQW9CLHNCQUF3QkMsTUFBNUMsMkRBQW9CLHVCQUFnQ0YsS0FBcEQsS0FBNkRiLFVBQVUsQ0FBQ2dCLFNBQXpFLENBRFgsQ0FBakIsSUFFS2hCLFVBQVUsQ0FBQ2dCO1FBTHFCLENBQXZDO01BT0E7SUFDRCxDQVZEO0lBV0EsT0FBT2YsY0FBUDtFQUNBOztFQUVELFNBQVNnQiwyQkFBVCxDQUFxQ0MsaUJBQXJDLEVBQWtIO0lBQ2pILE9BQU9BLGlCQUFpQixDQUFDQyxNQUFsQixDQUF5QixVQUFDQyxhQUFELEVBQXlDQyxnQkFBekMsRUFBOEQ7TUFDN0ZBLGdCQUFnQixDQUFDQyxhQUFqQixDQUErQm5CLE9BQS9CLENBQXVDLFVBQUNvQixZQUFELEVBQWtCO1FBQ3hESCxhQUFhLENBQUNHLFlBQUQsQ0FBYixHQUE4QixJQUE5QjtNQUNBLENBRkQ7TUFHQSxPQUFPSCxhQUFQO0lBQ0EsQ0FMTSxFQUtKLEVBTEksQ0FBUDtFQU1BO0VBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztFQUNBLFNBQVNJLHNDQUFULENBQWdEQyxnQkFBaEQsRUFBd0ZDLFdBQXhGLEVBQXlIO0lBQ3hILElBQUlBLFdBQVcsSUFBSUQsZ0JBQWdCLENBQUNFLE1BQWpCLEdBQTBCLENBQTdDLEVBQWdEO01BQy9DLE9BQU9GLGdCQUFnQixDQUFDRyxLQUFqQixDQUF1QixVQUFDQyxhQUFELEVBQW1CO1FBQ2hELE9BQU9BLGFBQWEsQ0FBQ0MsZUFBZCxJQUFpQ0osV0FBVyxLQUFLRyxhQUFhLENBQUNFLFVBQWQsQ0FBeUJDLFVBQWpGO01BQ0EsQ0FGTSxDQUFQO0lBR0E7O0lBQ0QsT0FBTyxLQUFQO0VBQ0E7O0VBRUQsU0FBU0Msb0JBQVQsQ0FDQ0MscUJBREQsRUFFQ0MsZ0JBRkQsRUFHbUM7SUFDbEMsSUFBTUMscUJBQStCLEdBQUcsRUFBeEM7SUFDQSxPQUFPRixxQkFBcUIsQ0FDMUJHLEdBREssQ0FDRCxVQUFDUixhQUFELEVBQW1CO01BQ3ZCLElBQU1TLFlBQVksR0FBR1QsYUFBYSxDQUFDVSxPQUFkLENBQXNCQyxPQUEzQztNQUNBLElBQU1DLGNBQStDLEdBQUcsRUFBeEQ7O01BQ0EsS0FBSyxJQUFNQyxJQUFYLElBQWtCSixZQUFsQixFQUFnQztRQUMvQixJQUFJSyxLQUFLLENBQUNDLE9BQU4sQ0FBY04sWUFBWSxDQUFDSSxJQUFELENBQVosQ0FBa0JHLEtBQWhDLENBQUosRUFBNEM7VUFDM0MsSUFBTUEsS0FBSyxHQUFHUCxZQUFZLENBQUNJLElBQUQsQ0FBWixDQUFrQkcsS0FBaEM7VUFDQUEsS0FBSyxDQUFDMUMsT0FBTixDQUFjLFVBQUNJLElBQUQsRUFBVTtZQUN2QixJQUFJQSxJQUFJLElBQUlBLElBQUksQ0FBQ3VDLGNBQWIsSUFBK0JWLHFCQUFxQixDQUFDVyxPQUF0QixDQUE4QnhDLElBQUksQ0FBQ3VDLGNBQW5DLE1BQXVELENBQUMsQ0FBM0YsRUFBOEY7Y0FDN0ZWLHFCQUFxQixDQUFDWSxJQUF0QixDQUEyQnpDLElBQUksQ0FBQ3VDLGNBQWhDO2NBQ0EsSUFBTUcsc0JBQXNCLEdBQUdDLGdDQUFnQyxDQUFDM0MsSUFBSSxDQUFDdUMsY0FBTixFQUFzQlgsZ0JBQXRCLENBQS9EOztjQUNBLElBQUljLHNCQUFKLEVBQTRCO2dCQUMzQlIsY0FBYyxDQUFDTyxJQUFmLENBQW9CQyxzQkFBcEI7Y0FDQTtZQUNEO1VBQ0QsQ0FSRDtRQVNBO01BQ0Q7O01BQ0QsT0FBT1IsY0FBUDtJQUNBLENBbkJLLEVBb0JMdEIsTUFwQkssQ0FvQkUsVUFBQ2dDLFNBQUQsRUFBWTlCLGdCQUFaO01BQUEsT0FBaUM4QixTQUFTLENBQUNDLE1BQVYsQ0FBaUIvQixnQkFBakIsQ0FBakM7SUFBQSxDQXBCRixFQW9CdUUsRUFwQnZFLENBQVA7RUFxQkE7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7RUFDQSxJQUFNZ0MsaUJBQWlCLEdBQUcsVUFBVUMsVUFBVixFQUFrQ0MsWUFBbEMsRUFBZ0U7SUFDekYsSUFBTUMsS0FBSyxHQUFHRCxZQUFZLENBQUNFLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBZDtJQUNBLElBQUlDLFdBQUo7SUFDQSxJQUFJaEIsR0FBRyxHQUFHLEVBQVY7O0lBQ0EsT0FBT2MsS0FBSyxDQUFDN0IsTUFBYixFQUFxQjtNQUNwQixJQUFJZ0MsSUFBSSxHQUFHSCxLQUFLLENBQUNJLEtBQU4sRUFBWDtNQUNBRixXQUFXLEdBQUdBLFdBQVcsYUFBTUEsV0FBTixjQUFxQkMsSUFBckIsSUFBOEJBLElBQXZEO01BQ0EsSUFBTUUsUUFBdUMsR0FBR1AsVUFBVSxDQUFDUSxXQUFYLENBQXVCSixXQUF2QixDQUFoRDs7TUFDQSxJQUFJRyxRQUFRLENBQUNFLEtBQVQsS0FBbUIsb0JBQW5CLElBQTJDRixRQUFRLENBQUNHLFlBQXhELEVBQXNFO1FBQ3JFTCxJQUFJLElBQUksR0FBUjtNQUNBOztNQUNEakIsR0FBRyxHQUFHQSxHQUFHLGFBQU1BLEdBQU4sY0FBYWlCLElBQWIsSUFBc0JBLElBQS9CO0lBQ0E7O0lBQ0QsT0FBT2pCLEdBQVA7RUFDQSxDQWREOztFQWdCQSxJQUFNdUIsMkJBQTJCLEdBQUcsVUFDbkNYLFVBRG1DLEVBRW5DTyxRQUZtQyxFQUduQ0ssZ0JBSG1DLEVBSW5DQyxhQUptQyxFQUtuQ2hDLGdCQUxtQyxFQU1UO0lBQUE7O0lBQzFCO0lBQ0EsSUFDQzBCLFFBQVEsS0FBS08sU0FBYixJQUNBUCxRQUFRLENBQUNRLFVBQVQsS0FBd0JELFNBRHhCLEtBRUNELGFBQWEsSUFBSSwwQkFBQU4sUUFBUSxDQUFDL0MsV0FBVCwwR0FBc0J3RCxFQUF0Qiw0R0FBMEJDLE1BQTFCLGtGQUFrQ0MsT0FBbEMsUUFBZ0QsSUFGbEUsQ0FERCxFQUlFO01BQUE7O01BQ0QsSUFBTUMsZ0JBQWdCLEdBQUd0QyxnQkFBZ0IsQ0FBQ3VDLHVCQUFqQixDQUF5Q2IsUUFBekMsQ0FBekI7TUFDQSxPQUFPO1FBQ05uQixHQUFHLEVBQUVpQyxTQUFTLENBQUNDLDRCQUFWLENBQXVDVixnQkFBdkMsQ0FEQztRQUVOcEIsY0FBYyxFQUFFWCxnQkFBZ0IsQ0FBQzBDLHlCQUFqQixDQUEyQ1gsZ0JBQTNDLENBRlY7UUFHTlksYUFBYSxFQUFFekIsaUJBQWlCLENBQUNDLFVBQUQsRUFBYVksZ0JBQWIsQ0FIMUI7UUFJTmEsWUFBWSxFQUNYLDJCQUFBbEIsUUFBUSxDQUFDL0MsV0FBVCw0R0FBc0J3RCxFQUF0Qiw0R0FBMEJVLFlBQTFCLGtGQUF3Q1IsT0FBeEMsUUFBc0QsSUFBdEQsR0FBNkRTLGdCQUFnQixDQUFDVixNQUE5RSxHQUF1RlUsZ0JBQWdCLENBQUNDLFVBTG5HO1FBTU5DLEtBQUssRUFBRXhFLGlCQUFpQixDQUFDQywyQkFBMkIsQ0FBQywyQkFBQWlELFFBQVEsQ0FBQy9DLFdBQVQsQ0FBcUJDLE1BQXJCLDRHQUE2QkYsS0FBN0Isa0ZBQW9DMkQsT0FBcEMsT0FBaURYLFFBQVEsQ0FBQ3VCLElBQTNELENBQTVCLENBTmxCO1FBT041RSxLQUFLLEVBQUVpRSxnQkFBZ0IsQ0FBQ1csSUFQbEI7UUFRTjFFLFVBQVUsRUFBRUMsaUJBQWlCLENBQzVCQywyQkFBMkIsQ0FBQyxDQUFBNkQsZ0JBQWdCLFNBQWhCLElBQUFBLGdCQUFnQixXQUFoQixxQ0FBQUEsZ0JBQWdCLENBQUUzRCxXQUFsQiwwR0FBK0JDLE1BQS9CLDRHQUF1Q0YsS0FBdkMsa0ZBQThDMkQsT0FBOUMsT0FBMkRDLGdCQUFnQixDQUFDVyxJQUE3RSxDQURDO01BUnZCLENBQVA7SUFZQTs7SUFDRCxPQUFPaEIsU0FBUDtFQUNBLENBNUJEOztFQThCTyxTQUFTaUIsWUFBVCxDQUFzQkMsS0FBdEIsRUFBa0M7SUFNeEMsSUFBTUMsc0JBQXdDLEdBQUc7TUFDaEQsZUFBZTtRQUNkQyxTQUFTLEVBQUU7TUFERyxDQURpQztNQUloRCxZQUFZO1FBQ1hBLFNBQVMsRUFBRTtNQURBLENBSm9DO01BT2hELFlBQVk7UUFDWEEsU0FBUyxFQUFFO01BREEsQ0FQb0M7TUFVaEQsZ0JBQWdCO1FBQ2ZBLFNBQVMsRUFBRTtNQURJLENBVmdDO01BYWhELHNCQUFzQjtRQUNyQkEsU0FBUyxFQUFFO01BRFUsQ0FiMEI7TUFnQmhELGVBQWU7UUFDZEEsU0FBUyxFQUFFO01BREcsQ0FoQmlDO01BbUJoRCxjQUFjO1FBQ2JBLFNBQVMsRUFBRTtNQURFLENBbkJrQztNQXNCaEQsYUFBYTtRQUNaQSxTQUFTLEVBQUU7TUFEQyxDQXRCbUM7TUF5QmhELFlBQVk7UUFDWEEsU0FBUyxFQUFFO01BREEsQ0F6Qm9DO01BNEJoRCxhQUFhO1FBQ1pBLFNBQVMsRUFBRTtNQURDLENBNUJtQztNQStCaEQsYUFBYTtRQUNaQSxTQUFTLEVBQUU7TUFEQyxDQS9CbUM7TUFrQ2hELGFBQWE7UUFDWkEsU0FBUyxFQUFFO01BREMsQ0FsQ21DO01BcUNoRCxhQUFhO1FBQ1pBLFNBQVMsRUFBRTtNQURDLENBckNtQztNQXdDaEQsY0FBYztRQUNiQSxTQUFTLEVBQUU7TUFERSxDQXhDa0M7TUEyQ2hELGNBQWM7UUFDYkEsU0FBUyxFQUFFO01BREUsQ0EzQ2tDO01BOENoRCxZQUFZO1FBQ1hBLFNBQVMsRUFBRTtNQURBLENBOUNvQztNQWlEaEQsaUJBQWlCO1FBQ2hCQSxTQUFTLEVBQUU7TUFESyxDQWpEK0I7TUFvRGhELGNBQWMsQ0FDYjtNQURhO0lBcERrQyxDQUFqRDtJQXdEQSxPQUFPRixLQUFLLElBQUlBLEtBQUssSUFBSUMsc0JBQWxCLElBQTRDQSxzQkFBc0IsQ0FBQ0QsS0FBRCxDQUF0QixDQUE4QkUsU0FBakY7RUFDQTs7OztFQUNELElBQU1DLG1CQUFtQixHQUFHLFVBQzNCbkMsVUFEMkIsRUFFM0JvQyxjQUYyQixFQUczQkMsVUFIMkIsRUFJM0J4QixhQUoyQixFQUszQmhDLGdCQUwyQixFQU1HO0lBQzlCLElBQU15RCxpQkFBOEMsR0FBRyxFQUF2RDs7SUFDQSxJQUFJRCxVQUFKLEVBQWdCO01BQ2ZBLFVBQVUsQ0FBQ3hGLE9BQVgsQ0FBbUIsVUFBQzBELFFBQUQsRUFBd0I7UUFDMUMsSUFBTU4sWUFBb0IsR0FBR00sUUFBUSxDQUFDdUIsSUFBdEM7UUFDQSxJQUFNUyxRQUFnQixHQUFHLENBQUNILGNBQWMsYUFBTUEsY0FBTixTQUEwQixFQUF6QyxJQUErQ25DLFlBQXhFOztRQUNBLElBQU11QyxjQUFjLEdBQUc3QiwyQkFBMkIsQ0FBQ1gsVUFBRCxFQUFhTyxRQUFiLEVBQXVCZ0MsUUFBdkIsRUFBaUMxQixhQUFqQyxFQUFnRGhDLGdCQUFoRCxDQUFsRDs7UUFDQSxJQUFJMkQsY0FBSixFQUFvQjtVQUNuQkYsaUJBQWlCLENBQUNDLFFBQUQsQ0FBakIsR0FBOEJDLGNBQTlCO1FBQ0E7TUFDRCxDQVBEO0lBUUE7O0lBQ0QsT0FBT0YsaUJBQVA7RUFDQSxDQW5CRDs7RUFxQkEsSUFBTUcseUJBQXlCLEdBQUcsVUFDakN6QyxVQURpQyxFQUVqQzBDLGFBRmlDLEVBR2pDN0IsYUFIaUMsRUFJakNoQyxnQkFKaUMsRUFLSDtJQUM5QixJQUFJOEQsZUFBNEMsR0FBRyxFQUFuRDs7SUFDQSxJQUFJRCxhQUFKLEVBQW1CO01BQ2xCQSxhQUFhLENBQUM3RixPQUFkLENBQXNCLFVBQUNvRCxZQUFELEVBQTBCO1FBQy9DLElBQUkyQyxvQkFBSjtRQUVBLElBQU1yQyxRQUF1QyxHQUFHUCxVQUFVLENBQUNRLFdBQVgsQ0FBdUJQLFlBQXZCLENBQWhEOztRQUNBLElBQUlNLFFBQVEsS0FBS08sU0FBakIsRUFBNEI7VUFDM0I7UUFDQTs7UUFDRCxJQUFJUCxRQUFRLENBQUNFLEtBQVQsS0FBbUIsb0JBQXZCLEVBQTZDO1VBQzVDO1VBQ0FtQyxvQkFBb0IsR0FBR1QsbUJBQW1CLENBQ3pDbkMsVUFEeUMsRUFFekNDLFlBRnlDLEVBR3pDTSxRQUFRLENBQUNRLFVBQVQsQ0FBb0I4QixnQkFIcUIsRUFJekNoQyxhQUp5QyxFQUt6Q2hDLGdCQUx5QyxDQUExQztRQU9BLENBVEQsTUFTTyxJQUFJMEIsUUFBUSxDQUFDUSxVQUFULEtBQXdCRCxTQUF4QixJQUFxQ1AsUUFBUSxDQUFDUSxVQUFULENBQW9CTixLQUFwQixLQUE4QixhQUF2RSxFQUFzRjtVQUM1RjtVQUNBbUMsb0JBQW9CLEdBQUdULG1CQUFtQixDQUN6Q25DLFVBRHlDLEVBRXpDQyxZQUZ5QyxFQUd6Q00sUUFBUSxDQUFDUSxVQUFULENBQW9Cc0IsVUFIcUIsRUFJekN4QixhQUp5QyxFQUt6Q2hDLGdCQUx5QyxDQUExQztRQU9BLENBVE0sTUFTQTtVQUNOLElBQU11RCxjQUFjLEdBQUduQyxZQUFZLENBQUM2QyxRQUFiLENBQXNCLEdBQXRCLElBQTZCN0MsWUFBWSxDQUFDRSxLQUFiLENBQW1CLEdBQW5CLEVBQXdCNEMsTUFBeEIsQ0FBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUNDLElBQXJDLENBQTBDLEdBQTFDLENBQTdCLEdBQThFLEVBQXJHO1VBQ0FKLG9CQUFvQixHQUFHVCxtQkFBbUIsQ0FBQ25DLFVBQUQsRUFBYW9DLGNBQWIsRUFBNkIsQ0FBQzdCLFFBQUQsQ0FBN0IsRUFBeUNNLGFBQXpDLEVBQXdEaEMsZ0JBQXhELENBQTFDO1FBQ0E7O1FBRUQ4RCxlQUFlLG1DQUNYQSxlQURXLEdBRVhDLG9CQUZXLENBQWY7TUFJQSxDQWxDRDtJQW1DQTs7SUFDRCxPQUFPRCxlQUFQO0VBQ0EsQ0E3Q0Q7O0VBK0NBLElBQU1NLGVBQWUsR0FBRyxVQUN2QkMsWUFEdUIsRUFFdkJqRCxZQUZ1QixFQUd2QnBCLGdCQUh1QixFQUl2Qm1CLFVBSnVCLEVBS0c7SUFDMUIsSUFBSW1ELFdBQW9DLEdBQUdELFlBQVksQ0FBQ2pELFlBQUQsQ0FBdkQ7SUFDQSxJQUFNd0IsWUFBWSxHQUFHMEIsV0FBVyxJQUFJQSxXQUFXLENBQUMxQixZQUFoRDs7SUFDQSxJQUFJMEIsV0FBSixFQUFpQjtNQUNoQixPQUFPRCxZQUFZLENBQUNqRCxZQUFELENBQW5CO0lBQ0EsQ0FGRCxNQUVPO01BQ05rRCxXQUFXLEdBQUd4QywyQkFBMkIsQ0FBQ1gsVUFBRCxFQUFhQSxVQUFVLENBQUNRLFdBQVgsQ0FBdUJQLFlBQXZCLENBQWIsRUFBbURBLFlBQW5ELEVBQWlFLElBQWpFLEVBQXVFcEIsZ0JBQXZFLENBQXpDO0lBQ0E7O0lBQ0QsSUFBSSxDQUFDc0UsV0FBTCxFQUFrQjtNQUFBOztNQUNqQix5QkFBQXRFLGdCQUFnQixDQUFDdUUsY0FBakIsa0ZBQW1DQyxRQUFuQyxDQUE0Q0MsYUFBYSxDQUFDQyxVQUExRCxFQUFzRUMsYUFBYSxDQUFDQyxJQUFwRixFQUEwRkMsU0FBUyxDQUFDQyxzQkFBcEc7SUFDQSxDQVZ5QixDQVcxQjs7O0lBQ0EsSUFBSVIsV0FBSixFQUFpQjtNQUFBOztNQUNoQkEsV0FBVyxDQUFDMUIsWUFBWixHQUEyQkEsWUFBWSxLQUFLRSxnQkFBZ0IsQ0FBQ1YsTUFBbEMsR0FBMkNVLGdCQUFnQixDQUFDVixNQUE1RCxHQUFxRVUsZ0JBQWdCLENBQUNpQyxPQUFqSDtNQUNBVCxXQUFXLENBQUNVLFdBQVosR0FBMEIsQ0FBQywyQkFBQzdELFVBQVUsQ0FBQ3hDLFdBQVosNEVBQUMsc0JBQXdCQyxNQUF6QixtREFBQyx1QkFBZ0NxRyxhQUFqQyxDQUEzQjtJQUNBOztJQUNELE9BQU9YLFdBQVA7RUFDQSxDQXRCRDs7RUF3QkEsSUFBTVksdUJBQXVCLEdBQUcsVUFDL0JDLGNBRCtCLEVBRS9CaEUsVUFGK0IsRUFHL0JuQixnQkFIK0IsRUFJL0JvRix3QkFKK0IsRUFLL0JDLHdCQUwrQixFQU1mO0lBQ2hCLElBQU12QixlQUE4QixHQUFHLEVBQXZDO0lBQ0EsSUFBTXdCLGlCQUFzQixHQUFHLEVBQS9CO0lBQ0EsSUFBTTlCLFVBQVUsR0FBR3JDLFVBQVUsQ0FBQzZDLGdCQUE5QixDQUhnQixDQUloQjs7SUFDQXFCLHdCQUF3QixTQUF4QixJQUFBQSx3QkFBd0IsV0FBeEIsWUFBQUEsd0JBQXdCLENBQUVySCxPQUExQixDQUFrQyxVQUFDdUgsY0FBRCxFQUFvQjtNQUNyREQsaUJBQWlCLENBQUNDLGNBQWMsQ0FBQ0MsS0FBaEIsQ0FBakIsR0FBMEMsSUFBMUM7SUFDQSxDQUZEOztJQUdBLElBQUlMLGNBQWMsSUFBSUEsY0FBYyxDQUFDM0YsTUFBZixHQUF3QixDQUE5QyxFQUFpRDtNQUNoRDJGLGNBQWMsU0FBZCxJQUFBQSxjQUFjLFdBQWQsWUFBQUEsY0FBYyxDQUFFbkgsT0FBaEIsQ0FBd0IsVUFBQ3lILFlBQUQsRUFBb0M7UUFDM0QsSUFBTXJHLFlBQWlCLEdBQUdxRyxZQUFZLENBQUNDLFlBQXZDO1FBQ0EsSUFBTUMsYUFBcUIsR0FBR3ZHLFlBQVksQ0FBQ29HLEtBQTNDO1FBQ0EsSUFBTUksc0JBQTJCLEdBQUcsRUFBcEM7UUFDQVAsd0JBQXdCLFNBQXhCLElBQUFBLHdCQUF3QixXQUF4QixZQUFBQSx3QkFBd0IsQ0FBRXJILE9BQTFCLENBQWtDLFVBQUN1SCxjQUFELEVBQW9CO1VBQ3JESyxzQkFBc0IsQ0FBQ0wsY0FBYyxDQUFDQyxLQUFoQixDQUF0QixHQUErQyxJQUEvQztRQUNBLENBRkQ7O1FBR0EsSUFBSSxFQUFFRyxhQUFhLElBQUlQLHdCQUFuQixDQUFKLEVBQWtEO1VBQ2pELElBQUksRUFBRU8sYUFBYSxJQUFJQyxzQkFBbkIsQ0FBSixFQUFnRDtZQUMvQyxJQUFNQyxZQUFvQyxHQUFHQyxjQUFjLENBQUNILGFBQUQsRUFBZ0IzRixnQkFBaEIsRUFBa0NtQixVQUFsQyxDQUEzRDs7WUFDQSxJQUFJMEUsWUFBSixFQUFpQjtjQUNoQi9CLGVBQWUsQ0FBQ2pELElBQWhCLENBQXFCZ0YsWUFBckI7WUFDQTtVQUNEO1FBQ0Q7TUFDRCxDQWZEO0lBZ0JBLENBakJELE1BaUJPLElBQUlyQyxVQUFKLEVBQWdCO01BQ3RCQSxVQUFVLENBQUN4RixPQUFYLENBQW1CLFVBQUMwRCxRQUFELEVBQXdCO1FBQUE7O1FBQzFDLElBQU1xRSxrQkFBa0IsNkJBQUdyRSxRQUFRLENBQUMvQyxXQUFaLHNGQUFHLHVCQUFzQkMsTUFBekIsNERBQUcsd0JBQThCb0gsa0JBQXpEO1FBQ0EsSUFBTTVFLFlBQVksR0FBR00sUUFBUSxDQUFDdUIsSUFBOUI7O1FBQ0EsSUFBSSxFQUFFN0IsWUFBWSxJQUFJZ0Usd0JBQWxCLENBQUosRUFBaUQ7VUFDaEQsSUFBSVcsa0JBQWtCLElBQUksRUFBRTNFLFlBQVksSUFBSWtFLGlCQUFsQixDQUExQixFQUFnRTtZQUMvRCxJQUFNTyxhQUFvQyxHQUFHQyxjQUFjLENBQUMxRSxZQUFELEVBQWVwQixnQkFBZixFQUFpQ21CLFVBQWpDLENBQTNEOztZQUNBLElBQUkwRSxhQUFKLEVBQWlCO2NBQ2hCL0IsZUFBZSxDQUFDakQsSUFBaEIsQ0FBcUJnRixhQUFyQjtZQUNBO1VBQ0Q7UUFDRDtNQUNELENBWEQ7SUFZQTs7SUFDRCxPQUFPL0IsZUFBUDtFQUNBLENBOUNEO0VBZ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0VBQ0EsU0FBU21DLG1CQUFULENBQTZCakcsZ0JBQTdCLEVBQWdGO0lBQUE7O0lBQy9FLElBQU1rRyxtQkFBbUIsR0FBR2xHLGdCQUFnQixDQUFDbUcsc0JBQWpCLEVBQTVCO0lBQ0EsSUFBTUMsbUJBQW1CLEdBQUdGLG1CQUFtQixDQUFDRyxpQkFBcEIsQ0FBc0NsRixVQUFsRTtJQUNBLElBQU1tRixlQUFlLEdBQUcsQ0FBQywyQkFBQ0YsbUJBQW1CLENBQUN6SCxXQUFyQiw0RUFBQyxzQkFBaUNDLE1BQWxDLG1EQUFDLHVCQUF5Q3FHLGFBQTFDLENBQUQsSUFBNEQsQ0FBQ2lCLG1CQUFtQixDQUFDSyxlQUF6RztJQUNBLElBQU1DLHlCQUF5QixHQUM5QkYsZUFBZSxJQUFJdEcsZ0JBQWdCLENBQUN5RyxzQkFBakIsWUFBNENQLG1CQUFtQixDQUFDRyxpQkFBcEIsQ0FBc0NwRCxJQUFsRixFQURwQjtJQUdBLE9BQ0N1RCx5QkFBeUIsR0FDdEJKLG1CQUFtQixDQUFDcEMsZ0JBQXBCLENBQXFDOUQsR0FBckMsQ0FBeUMsVUFBVXdCLFFBQVYsRUFBb0I7TUFDN0QsT0FBTzBDLGVBQWUsQ0FDckIsRUFEcUIsRUFFckIxQyxRQUFRLENBQUN1QixJQUZZLEVBR3JCdUQseUJBSHFCLEVBSXJCSixtQkFKcUIsQ0FBdEI7SUFNQyxDQVBELENBRHNCLEdBU3RCLEVBVko7RUFZQTtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztFQUNPLElBQU1NLDJCQUEyQixHQUFHLFVBQzFDcEgsZ0JBRDBDLEVBRTFDcUgsTUFGMEMsRUFHMUMzRyxnQkFIMEMsRUFJaEM7SUFDVjtJQUNBLElBQU00RyxnQkFBZ0IsR0FBR0QsTUFBTSxDQUFDbkgsTUFBUCxLQUFrQixDQUFsQixJQUF1Qm1ILE1BQU0sQ0FBQ2xILEtBQVAsQ0FBYSxVQUFDb0gsS0FBRDtNQUFBLE9BQVcsQ0FBQ0EsS0FBSyxDQUFDQyxjQUFOLENBQXFCQyxZQUFqQztJQUFBLENBQWIsQ0FBaEQsQ0FGVSxDQUlWOztJQUNBLElBQU1DLGdCQUFnQixHQUNyQjFILGdCQUFnQixDQUFDRSxNQUFqQixLQUE0QixDQUE1QixJQUFpQ0YsZ0JBQWdCLENBQUNHLEtBQWpCLENBQXVCLFVBQUN3SCxLQUFEO01BQUEsT0FBV0EsS0FBSyxDQUFDdEgsZUFBTixJQUF5QixDQUFDc0gsS0FBSyxDQUFDQyxxQkFBM0M7SUFBQSxDQUF2QixDQURsQztJQUdBLElBQU0zSCxXQUFXLEdBQUdTLGdCQUFnQixDQUFDbUgsY0FBakIsRUFBcEI7O0lBQ0EsSUFBSTVILFdBQVcsSUFBSXFILGdCQUFmLElBQW1DSSxnQkFBdkMsRUFBeUQ7TUFDeEQsT0FBTyxJQUFQO0lBQ0EsQ0FGRCxNQUVPO01BQ04sT0FBTyxLQUFQO0lBQ0E7RUFDRCxDQWxCTTtFQW9CUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxJQUFNSSx1QkFBdUIsR0FBRyxVQUN0Q2pHLFVBRHNDLEVBRXRDbkIsZ0JBRnNDLEVBR0s7SUFDM0MsSUFBTXFILFFBQXFDLEdBQUdySCxnQkFBZ0IsQ0FBQ3NILGtCQUFqQixHQUFzQ0Msc0JBQXRDLEVBQTlDO0lBQ0EsSUFBTUMsbUJBQXFFLEdBQUcsQ0FBQUgsUUFBUSxTQUFSLElBQUFBLFFBQVEsV0FBUixZQUFBQSxRQUFRLENBQUVoRCxZQUFWLEtBQTBCLEVBQXhHOztJQUNBLElBQU1QLGVBQTRDLEdBQUdGLHlCQUF5QixDQUM3RXpDLFVBRDZFLEVBRTdFc0csTUFBTSxDQUFDQyxJQUFQLENBQVlGLG1CQUFaLEVBQWlDdEgsR0FBakMsQ0FBcUMsVUFBQ0ssR0FBRDtNQUFBLE9BQVNpQyxTQUFTLENBQUNtRiw0QkFBVixDQUF1Q3BILEdBQXZDLENBQVQ7SUFBQSxDQUFyQyxDQUY2RSxFQUc3RSxJQUg2RSxFQUk3RVAsZ0JBSjZFLENBQTlFOztJQU1BLElBQU1xRSxZQUFzRCxHQUFHLEVBQS9EOztJQUVBLEtBQUssSUFBTXVELElBQVgsSUFBbUJKLG1CQUFuQixFQUF3QztNQUN2QyxJQUFNbEQsV0FBVyxHQUFHa0QsbUJBQW1CLENBQUNJLElBQUQsQ0FBdkM7TUFDQSxJQUFNeEksWUFBWSxHQUFHb0QsU0FBUyxDQUFDbUYsNEJBQVYsQ0FBdUNDLElBQXZDLENBQXJCO01BQ0EsSUFBTWpFLGNBQWMsR0FBR0csZUFBZSxDQUFDMUUsWUFBRCxDQUF0QztNQUNBLElBQU15SSxJQUFJLEdBQUd2RCxXQUFXLENBQUN1RCxJQUFaLEtBQXFCLE1BQXJCLEdBQThCcEssZUFBZSxDQUFDcUssSUFBOUMsR0FBcURySyxlQUFlLENBQUNzSCxPQUFsRjtNQUNBLElBQU1nRCxZQUFZLEdBQ2pCekQsV0FBVyxJQUFJQSxXQUFKLGFBQUlBLFdBQUosZUFBSUEsV0FBVyxDQUFFeUQsWUFBNUIsR0FDR0MsZ0JBQWdCLENBQUM3RyxVQUFELEVBQWFuQixnQkFBYixFQUErQjRILElBQS9CLEVBQXFDSixtQkFBckMsQ0FEbkIsR0FFR3ZGLFNBSEo7TUFJQW9DLFlBQVksQ0FBQ3VELElBQUQsQ0FBWixHQUFxQjtRQUNwQnJILEdBQUcsRUFBRXFILElBRGU7UUFFcEJDLElBQUksRUFBRUEsSUFGYztRQUdwQmxILGNBQWMsRUFBRWdELGNBQUYsYUFBRUEsY0FBRix1QkFBRUEsY0FBYyxDQUFFaEQsY0FIWjtRQUlwQmdDLGFBQWEsRUFBRSxDQUFBZ0IsY0FBYyxTQUFkLElBQUFBLGNBQWMsV0FBZCxZQUFBQSxjQUFjLENBQUVoQixhQUFoQixLQUFpQ3ZELFlBSjVCO1FBS3BCNkksUUFBUSxFQUFFM0QsV0FBVyxDQUFDMkQsUUFMRjtRQU1wQmpGLEtBQUssRUFBRXNCLFdBQVcsQ0FBQ3RCLEtBTkM7UUFPcEJrRixRQUFRLEVBQUU1RCxXQUFXLENBQUM0RCxRQUFaLElBQXdCO1VBQUVDLFNBQVMsRUFBRUMsU0FBUyxDQUFDQztRQUF2QixDQVBkO1FBUXBCekYsWUFBWSxFQUFFMEIsV0FBVyxDQUFDMUIsWUFBWixJQUE0QkUsZ0JBQWdCLENBQUNpQyxPQVJ2QztRQVNwQnVELFFBQVEsRUFBRWhFLFdBQVcsQ0FBQ2dFLFFBVEY7UUFVcEJQLFlBQVksRUFBRUEsWUFWTTtRQVdwQlEsUUFBUSxFQUFFakUsV0FBVyxDQUFDaUU7TUFYRixDQUFyQjtJQWFBOztJQUNELE9BQU9sRSxZQUFQO0VBQ0EsQ0F0Q007Ozs7RUF3Q0EsSUFBTXlCLGNBQWMsR0FBRyxVQUFVMUUsWUFBVixFQUFnQ3BCLGdCQUFoQyxFQUFvRW1CLFVBQXBFLEVBQTRGO0lBQ3pILE9BQU9pRCxlQUFlLENBQUMsRUFBRCxFQUFLaEQsWUFBTCxFQUFtQnBCLGdCQUFuQixFQUFxQ21CLFVBQXJDLENBQXRCO0VBQ0EsQ0FGTTs7OztFQUlBLElBQU1xSCxxQkFBcUIsR0FBRyxVQUFVQyw2QkFBVixFQUE4Q0MsWUFBOUMsRUFBaUU7SUFDckcsSUFBSUEsWUFBWSxLQUFLLG9CQUFqQixJQUF5Q0EsWUFBWSxLQUFLLHlCQUE5RCxFQUF5RjtNQUN4RixJQUFJQyxNQUFNLEdBQUcsRUFBYjs7TUFDQSxJQUFJRiw2QkFBNkIsSUFBSUEsNkJBQTZCLENBQUNDLFlBQUQsQ0FBbEUsRUFBa0Y7UUFDakZDLE1BQU0sR0FBR0YsNkJBQTZCLENBQUNDLFlBQUQsQ0FBN0IsQ0FBNEN4SSxHQUE1QyxDQUFnRCxVQUFVMEksU0FBVixFQUEwQjtVQUNsRixPQUFPQSxTQUFTLENBQUNDLGFBQVYsSUFBMkJELFNBQVMsQ0FBQ3BELEtBQTVDO1FBQ0EsQ0FGUSxDQUFUO01BR0E7O01BQ0QsT0FBT21ELE1BQVA7SUFDQSxDQVJELE1BUU8sSUFBSUQsWUFBWSxLQUFLLDBCQUFyQixFQUFpRDtNQUN2RCxJQUFNSSxtQkFBbUIsR0FBRyxFQUE1Qjs7TUFDQSxJQUFJTCw2QkFBNkIsSUFBSUEsNkJBQTZCLENBQUNNLDRCQUFuRSxFQUFpRztRQUNoR04sNkJBQTZCLENBQUNNLDRCQUE5QixDQUEyRC9LLE9BQTNELENBQW1FLFVBQVU0SyxTQUFWLEVBQTBCO1VBQzVGO1VBQ0EsSUFBSUUsbUJBQW1CLENBQUNGLFNBQVMsQ0FBQ0ksUUFBVixDQUFtQnhELEtBQXBCLENBQXZCLEVBQW1EO1lBQ2xEc0QsbUJBQW1CLENBQUNGLFNBQVMsQ0FBQ0ksUUFBVixDQUFtQnhELEtBQXBCLENBQW5CLENBQThDM0UsSUFBOUMsQ0FBbUQrSCxTQUFTLENBQUNLLGtCQUE3RDtVQUNBLENBRkQsTUFFTztZQUNOSCxtQkFBbUIsQ0FBQ0YsU0FBUyxDQUFDSSxRQUFWLENBQW1CeEQsS0FBcEIsQ0FBbkIsR0FBZ0QsQ0FBQ29ELFNBQVMsQ0FBQ0ssa0JBQVgsQ0FBaEQ7VUFDQTtRQUNELENBUEQ7TUFRQTs7TUFDRCxPQUFPSCxtQkFBUDtJQUNBOztJQUNELE9BQU9MLDZCQUFQO0VBQ0EsQ0F4Qk07Ozs7RUEwQlAsSUFBTVMsMkJBQTJCLEdBQUcsWUFBWTtJQUMvQyxPQUFPO01BQ05qRyxJQUFJLEVBQUUsU0FEQTtNQUVON0UsSUFBSSxFQUFFLFNBRkE7TUFHTitLLFFBQVEsRUFBRXhMLGVBSEo7TUFJTnlMLGFBQWEsRUFBRTtJQUpULENBQVA7RUFNQSxDQVBEOztFQVNBLElBQU1DLDhCQUE4QixHQUFHLFlBQVk7SUFDbEQsT0FBTztNQUNOcEcsSUFBSSxFQUFFLFlBREE7TUFFTjdFLElBQUksRUFBRSxZQUZBO01BR05HLFVBQVUsRUFBRSxFQUhOO01BSU5GLEtBQUssRUFBRSxFQUpEO01BS044SyxRQUFRLEVBQUV4TCxlQUxKO01BTU4yTCxZQUFZLEVBQUU7SUFOUixDQUFQO0VBUUEsQ0FURDs7RUFXQSxJQUFNQyxxQkFBcUIsR0FBRyxVQUFVdkosZ0JBQVYsRUFBOEM7SUFDM0UsSUFBSXdKLGtCQUFKOztJQUNBLElBQUksQ0FBQ0MsV0FBVyxDQUFDQyxXQUFaLENBQXdCMUosZ0JBQWdCLENBQUMySixZQUFqQixFQUF4QixDQUFMLEVBQStEO01BQUE7O01BQzlELElBQU1DLFdBQVcsNkJBQUc1SixnQkFBZ0IsQ0FBQzJKLFlBQWpCLEVBQUgscUZBQUcsdUJBQWlDaEwsV0FBcEMsMkRBQUcsdUJBQThDa0wsWUFBbEU7TUFDQUwsa0JBQWtCLEdBQUdJLFdBQUgsYUFBR0EsV0FBSCx1QkFBR0EsV0FBVyxDQUFFRSxrQkFBbEM7SUFDQTs7SUFDRCxPQUFPTixrQkFBUDtFQUNBLENBUEQ7O0VBU08sSUFBTU8seUJBQXlCLEdBQUcsVUFBVS9KLGdCQUFWLEVBQThDZ0ssZUFBOUMsRUFBdUU7SUFBQTs7SUFDL0csSUFBTUMsdUJBQTRCLDZCQUFHakssZ0JBQWdCLENBQUMySixZQUFqQixFQUFILHFGQUFHLHVCQUFpQ2hMLFdBQXBDLHFGQUFHLHVCQUE4Q2tMLFlBQWpELDJEQUFHLHVCQUE0REssc0JBQWpHO0lBQ0EsSUFBTUMscUJBQXFCLEdBQUdGLHVCQUF1QixJQUFJQSx1QkFBdUIsQ0FBQ0csb0JBQWpGO0lBQ0EsT0FDQ0QscUJBQXFCLElBQ3JCQSxxQkFBcUIsQ0FBQ0UsSUFBdEIsQ0FBMkIsVUFBVUMsbUJBQVYsRUFBb0M7TUFDOUQsT0FDQ0EsbUJBQW1CLElBQ25CQSxtQkFBbUIsQ0FBQ0Msa0JBRHBCLEtBRUNELG1CQUFtQixDQUFDQyxrQkFBcEIsQ0FBdUNDLHVCQUF2QyxLQUFtRVIsZUFBbkUsSUFDQU0sbUJBQW1CLENBQUNDLGtCQUFwQixDQUF1Qy9FLEtBQXZDLEtBQWlEd0UsZUFIbEQsQ0FERDtJQU1BLENBUEQsQ0FGRDtFQVdBLENBZE07Ozs7RUFnQlAsSUFBTVMsdUJBQXVCLEdBQUcsVUFBVUMsZ0JBQVYsRUFBaUM7SUFDaEUsT0FBTztNQUNObkssR0FBRyxFQUFFbUssZ0JBQWdCLENBQUNuSyxHQURoQjtNQUVOSSxjQUFjLEVBQUUrSixnQkFBZ0IsQ0FBQy9KLGNBRjNCO01BR05nQyxhQUFhLEVBQUUrSCxnQkFBZ0IsQ0FBQy9ILGFBSDFCO01BSU5NLElBQUksRUFBRXlILGdCQUFnQixDQUFDL0gsYUFKakI7TUFLTkssS0FBSyxFQUFFMEgsZ0JBQWdCLENBQUMxSCxLQUxsQjtNQU1Oc0csWUFBWSxFQUFFb0IsZ0JBQWdCLENBQUM5SCxZQUFqQixLQUFrQyxRQU4xQztNQU9OK0gsT0FBTyxFQUFFLE9BUEg7TUFRTjNGLFdBQVcsRUFBRTBGLGdCQUFnQixDQUFDMUYsV0FSeEI7TUFTTjRGLGFBQWEsRUFBRUYsZ0JBQWdCLENBQUNFLGFBVDFCO01BVU5oSSxZQUFZLEVBQUU4SCxnQkFBZ0IsQ0FBQzlILFlBVnpCO01BV05zRixRQUFRLEVBQUV3QyxnQkFBZ0IsQ0FBQ3hDLFFBWHJCO01BWU5MLElBQUksRUFBRTZDLGdCQUFnQixDQUFDN0MsSUFaakI7TUFhTkksUUFBUSxFQUFFeUMsZ0JBQWdCLENBQUN6QyxRQWJyQjtNQWNONEMsSUFBSSxFQUFFSCxnQkFBZ0IsQ0FBQ0csSUFkakI7TUFlTnRDLFFBQVEsRUFBRW1DLGdCQUFnQixDQUFDbkM7SUFmckIsQ0FBUDtFQWlCQSxDQWxCRDs7RUFvQk8sSUFBTXVDLDRCQUE0QixHQUFHLFVBQVVDLFlBQVYsRUFBNkI7SUFDeEUsSUFBTUMsMkJBQTJCLEdBQUcsQ0FDbkMsYUFEbUMsRUFFbkMsWUFGbUMsRUFHbkMsYUFIbUMsRUFJbkMsWUFKbUMsRUFLbkMsa0JBTG1DLEVBTW5DLDhCQU5tQyxDQUFwQztJQVNBRCxZQUFZLENBQUNFLElBQWIsQ0FBa0IsVUFBVUMsQ0FBVixFQUFrQkMsQ0FBbEIsRUFBMEI7TUFDM0MsT0FBT0gsMkJBQTJCLENBQUNwSyxPQUE1QixDQUFvQ3NLLENBQXBDLElBQXlDRiwyQkFBMkIsQ0FBQ3BLLE9BQTVCLENBQW9DdUssQ0FBcEMsQ0FBaEQ7SUFDQSxDQUZEO0lBSUEsT0FBT0osWUFBWSxDQUFDLENBQUQsQ0FBbkI7RUFDQSxDQWZNOzs7O0VBaUJBLElBQU1LLFdBQVcsR0FBRyxVQUFVQyxvQkFBVixFQUFxQ0Msc0JBQXJDLEVBQWtFO0lBQUE7O0lBQzVGLElBQU1DLGVBQWUsR0FBR0Ysb0JBQUgsYUFBR0Esb0JBQUgsZ0RBQUdBLG9CQUFvQixDQUFFek0sTUFBekIsMERBQUcsc0JBQThCNE0sSUFBdEQ7SUFBQSxJQUNDQyx5QkFBeUIsR0FDeEJGLGVBQWUsS0FDYkYsb0JBQW9CLEtBQUlBLG9CQUFKLGFBQUlBLG9CQUFKLGlEQUFJQSxvQkFBb0IsQ0FBRXpNLE1BQTFCLHFGQUFJLHVCQUE4QjRNLElBQWxDLHFGQUFJLHVCQUFvQzdNLFdBQXhDLHFGQUFJLHVCQUFpRHdELEVBQXJELDJEQUFJLHVCQUFxRHVKLGVBQXpELENBQXJCLElBQ0NKLHNCQUFzQixLQUFJQSxzQkFBSixhQUFJQSxzQkFBSixnREFBSUEsc0JBQXNCLENBQUVuSixFQUE1QiwwREFBSSxzQkFBNEJ1SixlQUFoQyxDQUZULENBRmpCOztJQU1BLElBQUlELHlCQUFKLEVBQStCO01BQzlCLElBQUlBLHlCQUF5QixDQUFDcEosT0FBMUIsT0FBd0MsaUNBQTVDLEVBQStFO1FBQzlFLE9BQU8sYUFBUDtNQUNBLENBRkQsTUFFTyxJQUFJb0oseUJBQXlCLENBQUNwSixPQUExQixPQUF3QyxpQ0FBNUMsRUFBK0U7UUFDckYsT0FBTyxrQkFBUDtNQUNBOztNQUNELE9BQU8sa0JBQVAsQ0FOOEIsQ0FNSDtJQUMzQjs7SUFDRCxPQUFPa0osZUFBZSxHQUFHLGtCQUFILEdBQXdCLE9BQTlDO0VBQ0EsQ0FoQk07Ozs7RUFrQkEsSUFBTUksaUJBQWlCLEdBQUcsVUFBVTNMLGdCQUFWLEVBQThDMEssZ0JBQTlDLEVBQXFFa0IsV0FBckUsRUFBdUY7SUFBQTs7SUFDdkgsSUFBSUMsYUFBYSxHQUFHcEIsdUJBQXVCLENBQUNDLGdCQUFELENBQTNDOztJQUNBLElBQU1vQixlQUFlLEdBQUdwQixnQkFBZ0IsQ0FBQy9KLGNBQXpDOztJQUVBLElBQUksQ0FBQ21MLGVBQUwsRUFBc0I7TUFDckIsT0FBT0QsYUFBUDtJQUNBOztJQUNELElBQU1FLG9CQUFvQixHQUFHL0wsZ0JBQWdCLENBQUN5RyxzQkFBakIsQ0FBd0NxRixlQUF4QyxFQUF5RDNGLHNCQUF6RCxHQUFrRjZGLFlBQS9HO0lBRUEsSUFBTVgsb0JBQW9CLEdBQUdVLG9CQUFILGFBQUdBLG9CQUFILHVCQUFHQSxvQkFBb0IsQ0FBRXBOLFdBQW5EO0lBQ0EsSUFBTTJNLHNCQUFzQixHQUFHdEwsZ0JBQUgsYUFBR0EsZ0JBQUgsaURBQUdBLGdCQUFnQixDQUFFbUcsc0JBQWxCLEdBQTJDNkYsWUFBOUMsMkRBQUcsdUJBQXlEck4sV0FBeEY7SUFFQSxJQUFNc04sY0FBYyxHQUFHTCxXQUFXLENBQUNNLGFBQW5DO0lBQ0EsSUFBTUMsWUFBWSxHQUFHUCxXQUFXLENBQUNRLFdBQWpDO0lBQ0FQLGFBQWEsR0FBR3BFLE1BQU0sQ0FBQzRFLE1BQVAsQ0FBY1IsYUFBZCxFQUE2QjtNQUM1Q0ssYUFBYSxFQUFFRCxjQUQ2QjtNQUU1Q0csV0FBVyxFQUFFRCxZQUYrQjtNQUc1Q3hCLE9BQU8sRUFBRVMsV0FBVyxDQUFDQyxvQkFBRCxFQUF1QkMsc0JBQXZCO0lBSHdCLENBQTdCLENBQWhCO0lBS0EsT0FBT08sYUFBUDtFQUNBLENBcEJNOzs7O0VBc0JBLElBQU1TLFlBQVksR0FBRyxVQUFVMUQsU0FBVixFQUEwQjtJQUNyRCxJQUFJMkQsYUFBYSxHQUFHLElBQXBCLENBRHFELENBRXJEOztJQUNBLFFBQVEzRCxTQUFTLENBQUM0RCxnQkFBbEI7TUFDQyxLQUFLLGtCQUFMO01BQ0EsS0FBSyxhQUFMO01BQ0EsS0FBSyxhQUFMO1FBQ0NELGFBQWEsR0FBRyxLQUFoQjtRQUNBOztNQUNEO1FBQ0M7SUFQRjs7SUFTQSxJQUFJM0QsU0FBUyxDQUFDZixJQUFWLElBQWtCZSxTQUFTLENBQUNmLElBQVYsQ0FBZWpILE9BQWYsQ0FBdUIsU0FBdkIsSUFBb0MsQ0FBMUQsRUFBNkQ7TUFDNUQyTCxhQUFhLEdBQUcsS0FBaEI7SUFDQTs7SUFDRCxPQUFPQSxhQUFQO0VBQ0EsQ0FoQk07Ozs7RUFrQlAsSUFBTUUsK0JBQStCLEdBQUcsVUFDdkNDLEtBRHVDLEVBRStDO0lBQ3RGLE9BQ0MsQ0FBQ0EsS0FBSyxDQUFDeE8sS0FBTiwrQ0FDQXdPLEtBQUssQ0FBQ3hPLEtBQU4sa0RBREEsSUFFQXdPLEtBQUssQ0FBQ3hPLEtBQU4sNkRBRkQsS0FHQXdPLEtBQUssQ0FBQ3ZPLEtBQU4sQ0FBWUMsSUFBWixDQUFpQjZGLFFBQWpCLENBQTBCLEdBQTFCLENBSkQ7RUFNQSxDQVREOztFQVdBLElBQU0wSSw4QkFBOEIsR0FBRyxVQUN0QzNNLGdCQURzQyxFQU1yQztJQUFBOztJQUFBLElBSkQ0TSxRQUlDLHVFQUpnQyxFQUloQztJQUFBLElBSERqTSxjQUdDLHVFQUh3QixFQUd4QjtJQUFBLElBRkRxQixhQUVDLHVFQUZ3QixLQUV4QjtJQUFBLElBREQ2SyxZQUNDO0lBQ0Q7SUFDQSxJQUFNOU4saUJBQWtELEdBQUdlLG9CQUFvQixDQUFDOE0sUUFBRCxFQUFXNU0sZ0JBQVgsQ0FBL0UsQ0FGQyxDQUlEOztJQUNBLElBQU1vRix3QkFBaUQsR0FBR3RHLDJCQUEyQixDQUFDQyxpQkFBRCxDQUFyRjtJQUNBLElBQU1vQyxVQUFVLEdBQUduQixnQkFBZ0IsQ0FBQzhNLGFBQWpCLEVBQW5CLENBTkMsQ0FPRDs7SUFDQSxJQUFNekgsd0JBQXdCLEdBQUsxRSxjQUFjLCtCQUFJWCxnQkFBZ0IsQ0FBQytNLHVCQUFqQixDQUF5Q3BNLGNBQXpDLENBQUosMkRBQUksdUJBQTBEZixVQUE5RCxDQUFmLCtCQUNqQ3VCLFVBQVUsQ0FBQ3hDLFdBRHNCLHFGQUNqQyx1QkFBd0J3RCxFQURTLDJEQUNqQyx1QkFBNEI2SyxlQURLLEtBRWpDLEVBRkQ7SUFJQSxJQUFNQyxhQUF1QixHQUFHLEVBQWhDOztJQUNBLElBQUlMLFFBQVEsQ0FBQ3BOLE1BQVQsS0FBb0IsQ0FBcEIsSUFBeUIsQ0FBQyxDQUFDcU4sWUFBL0IsRUFBNkM7TUFBQTs7TUFDNUMsMEJBQUM3TSxnQkFBZ0IsQ0FBQytNLHVCQUFqQixDQUF5Q0YsWUFBekMsRUFBdURqTixVQUF4RCxrRkFBaUY1QixPQUFqRixDQUF5RixVQUFDME8sS0FBRCxFQUFXO1FBQ25HLElBQUlELCtCQUErQixDQUFDQyxLQUFELENBQW5DLEVBQTRDO1VBQzNDLElBQUksQ0FBQ08sYUFBYSxDQUFDaEosUUFBZCxDQUF1QnlJLEtBQUssQ0FBQ3ZPLEtBQU4sQ0FBWUMsSUFBWixDQUFpQmtELEtBQWpCLENBQXVCLEdBQXZCLEVBQTRCLENBQTVCLENBQXZCLENBQUwsRUFBNkQ7WUFDNUQyTCxhQUFhLENBQUNwTSxJQUFkLENBQW1CNkwsS0FBSyxDQUFDdk8sS0FBTixDQUFZQyxJQUFaLENBQWlCa0QsS0FBakIsQ0FBdUIsR0FBdkIsRUFBNEIsQ0FBNUIsQ0FBbkI7VUFDQTtRQUNEO01BQ0QsQ0FORDtJQU9BLENBckJBLENBdUJEOzs7SUFDQSxJQUFNK0MsWUFBeUMsaURBRTNDZixtQkFBbUIsQ0FBQ25DLFVBQUQsRUFBYSxFQUFiLEVBQWlCQSxVQUFVLENBQUM2QyxnQkFBNUIsRUFBOENoQyxhQUE5QyxFQUE2RGhDLGdCQUE3RCxDQUZ3QixHQUkzQzRELHlCQUF5QixDQUFDekMsVUFBRCxFQUFhOEwsYUFBYixFQUE0QixLQUE1QixFQUFtQ2pOLGdCQUFuQyxDQUprQixHQU0zQzRELHlCQUF5QixDQUMzQnpDLFVBRDJCLEVBRTNCbkIsZ0JBQWdCLENBQUNzSCxrQkFBakIsR0FBc0NDLHNCQUF0QyxHQUErRDJGLG9CQUZwQyxFQUczQmxMLGFBSDJCLEVBSTNCaEMsZ0JBSjJCLENBTmtCLENBQS9DOztJQWFBLElBQUltRixjQUFxQixHQUFHLEVBQTVCO0lBQ0EsSUFBTWpHLGdCQUFnQixHQUFHaU8sbUJBQW1CLENBQUNoTSxVQUFELEVBQWFuQixnQkFBYixDQUE1Qzs7SUFDQSxJQUFJZCxnQkFBSixFQUFzQjtNQUNyQmlHLGNBQWMsR0FBR2pHLGdCQUFnQixDQUFDa08sYUFBbEM7SUFDQTs7SUFFRCxJQUFNQyxrQkFBdUIsR0FDNUIsQ0FBQWhJLHdCQUF3QixTQUF4QixJQUFBQSx3QkFBd0IsV0FBeEIsWUFBQUEsd0JBQXdCLENBQUVyRyxNQUExQixDQUFpQyxVQUFDOEUsZUFBRCxFQUFpQ0gsY0FBakMsRUFBb0Q7TUFDcEYsSUFBTXZDLFlBQVksR0FBR3VDLGNBQWMsQ0FBQzZCLEtBQXBDOztNQUNBLElBQUksRUFBRXBFLFlBQVksSUFBSWdFLHdCQUFsQixDQUFKLEVBQWlEO1FBQ2hELElBQUk3QixjQUFKOztRQUNBLElBQUk1QyxjQUFjLENBQUMyTSxVQUFmLENBQTBCLDZDQUExQixDQUFKLEVBQThFO1VBQzdFL0osY0FBYyxHQUFHLEVBQWpCO1FBQ0EsQ0FGRCxNQUVPO1VBQ05BLGNBQWMsR0FBRzVDLGNBQWMsQ0FBQ1csS0FBZixDQUFxQiw4Q0FBckIsRUFBcUUsQ0FBckUsQ0FBakI7UUFDQTs7UUFFRCxJQUFNaU0sa0JBQWtCLEdBQUdoSyxjQUFjLEdBQUdBLGNBQWMsR0FBRyxHQUFqQixHQUF1Qm5DLFlBQTFCLEdBQXlDQSxZQUFsRjs7UUFDQSxJQUFNa0QsV0FBb0MsR0FBR0YsZUFBZSxDQUMzREMsWUFEMkQsRUFFM0RrSixrQkFGMkQsRUFHM0R2TixnQkFIMkQsRUFJM0RtQixVQUoyRCxDQUE1RDs7UUFNQSxJQUFJbUQsV0FBSixFQUFpQjtVQUNoQkEsV0FBVyxDQUFDakcsS0FBWixHQUFvQixFQUFwQjtVQUNBaUcsV0FBVyxDQUFDL0YsVUFBWixHQUF5QixFQUF6QjtVQUNBdUYsZUFBZSxDQUFDakQsSUFBaEIsQ0FBcUJ5RCxXQUFyQjtRQUNBO01BQ0Q7O01BQ0QsT0FBT1IsZUFBUDtJQUNBLENBeEJELEVBd0JHLEVBeEJILE1Bd0JVLEVBekJYOztJQTJCQSxJQUFNMEosbUJBQW1CLEdBQUd0SSx1QkFBdUIsQ0FDbERDLGNBRGtELEVBRWxEaEUsVUFGa0QsRUFHbERuQixnQkFIa0QsRUFJbERvRix3QkFKa0QsRUFLbERDLHdCQUxrRCxDQUFuRDs7SUFRQSxPQUFPO01BQ05ELHdCQUF3QixFQUFFQSx3QkFEcEI7TUFFTmpFLFVBQVUsRUFBRUEsVUFGTjtNQUdOa0Usd0JBQXdCLEVBQUVBLHdCQUhwQjtNQUlOaEIsWUFBWSxFQUFFQSxZQUpSO01BS05nSixrQkFBa0IsRUFBRUEsa0JBTGQ7TUFNTkcsbUJBQW1CLEVBQUVBO0lBTmYsQ0FBUDtFQVFBLENBNUZEOztFQThGTyxJQUFNQyxlQUFlLEdBQUcsVUFBVS9MLFFBQVYsRUFBOEI7SUFDNUQsSUFBTWtLLFdBQVcsR0FBRzhCLGFBQWEsQ0FBQ2hNLFFBQUQsRUFBV0EsUUFBWCxhQUFXQSxRQUFYLHVCQUFXQSxRQUFRLENBQUVtRyxJQUFyQixDQUFqQzs7SUFDQSxJQUFJLENBQUFuRyxRQUFRLFNBQVIsSUFBQUEsUUFBUSxXQUFSLFlBQUFBLFFBQVEsQ0FBRW1HLElBQVYsTUFBbUJuSyxVQUFuQixLQUFrQ2tPLFdBQVcsQ0FBQ1EsV0FBWixDQUF3QnVCLFFBQXhCLEtBQXFDMUwsU0FBckMsSUFBa0QySixXQUFXLENBQUNRLFdBQVosQ0FBd0J1QixRQUF4QixLQUFxQyxJQUF6SCxDQUFKLEVBQW9JO01BQ25JL0IsV0FBVyxDQUFDTSxhQUFaLENBQTBCMEIscUJBQTFCLEdBQWtELEtBQWxEO0lBQ0E7O0lBQ0QsT0FBT2hDLFdBQVA7RUFDQSxDQU5NOzs7O0VBUUEsSUFBTWlDLDRCQUE0QixHQUFHLFVBQzNDQyxpQkFEMkMsRUFFM0M5TixnQkFGMkMsRUFHM0MrTixjQUgyQyxFQUkzQ0MsV0FKMkMsRUFLMUM7SUFDRCxJQUFJbkMsYUFBa0IsR0FBR0YsaUJBQWlCLENBQUMzTCxnQkFBRCxFQUFtQjhOLGlCQUFuQixFQUFzQ0UsV0FBVyxDQUFDRixpQkFBaUIsQ0FBQ3ZOLEdBQW5CLENBQWpELENBQTFDO0lBQUEsSUFDQ29GLGFBQXFCLEdBQUcsRUFEekI7O0lBRUEsSUFBSW1JLGlCQUFpQixDQUFDbkwsYUFBdEIsRUFBcUM7TUFDcENnRCxhQUFhLEdBQUdtSSxpQkFBaUIsQ0FBQ25MLGFBQWxCLENBQWdDc0wsT0FBaEMsQ0FBd0MsUUFBeEMsRUFBa0QsRUFBbEQsQ0FBaEI7SUFDQTs7SUFDRCxJQUFJcEMsYUFBSixFQUFtQjtNQUFBOztNQUNsQkEsYUFBYSxHQUFHcEUsTUFBTSxDQUFDNEUsTUFBUCxDQUFjUixhQUFkLEVBQTZCO1FBQzVDekMsYUFBYSxFQUFFLENBQUN5QyxhQUFhLENBQUM3RyxXQUFmLElBQThCc0gsWUFBWSxDQUFDVCxhQUFELENBQTFDLEdBQTRELENBQUMsQ0FBN0QsR0FBaUUsQ0FEcEM7UUFFNUN0RCxRQUFRLDJCQUFFdUYsaUJBQWlCLENBQUN2RixRQUFwQix5RUFBaUNzRCxhQUFhLENBQUM3RyxXQUFkLElBQTZCK0ksY0FBYyxDQUFDbk4sT0FBZixDQUF1QitFLGFBQXZCLEtBQXlDLENBRm5FO1FBRzVDaUYsYUFBYSxFQUFFc0Qsd0JBQXdCLENBQUNsTyxnQkFBRCxDQUhLO1FBSTVDbUosUUFBUSxFQUFFNkUsV0FBVyxDQUFDRixpQkFBaUIsQ0FBQ3ZOLEdBQW5CLENBQVgsQ0FBbUNzSDtNQUpELENBQTdCLENBQWhCO0lBTUE7O0lBQ0QsT0FBT2dFLGFBQVA7RUFDQSxDQXBCTTs7OztFQXNCQSxJQUFNc0Msc0JBQXNCLEdBQUcsVUFDckNkLGtCQURxQyxFQUVyQ3JOLGdCQUZxQyxFQUdyQ29PLDBCQUhxQyxFQUlwQztJQUNEO0lBQ0EsSUFBTUMsbUJBQXdCLEdBQUcsRUFBakM7SUFDQSxJQUFNTCxXQUFnQixHQUFHLEVBQXpCOztJQUVBLElBQUlJLDBCQUFKLEVBQWdDO01BQy9CZixrQkFBa0IsR0FBR0Esa0JBQWtCLENBQUNwTSxNQUFuQixDQUEwQm1OLDBCQUExQixDQUFyQjtJQUNBLENBUEEsQ0FRRDs7O0lBQ0FmLGtCQUFrQixDQUFDclAsT0FBbkIsQ0FBMkIsVUFBVXNRLGNBQVYsRUFBK0I7TUFDekQsSUFBSUEsY0FBYyxDQUFDM04sY0FBbkIsRUFBbUM7UUFDbEMsSUFBTTROLHVCQUF1QixHQUFHdk8sZ0JBQWdCLENBQUN5RyxzQkFBakIsQ0FBd0M2SCxjQUFjLENBQUMzTixjQUF2RCxDQUFoQztRQUNBLElBQU02TixvQkFBb0IsR0FBR0QsdUJBQXVCLENBQUNwSSxzQkFBeEIsR0FBaUQ2RixZQUE5RTtRQUNBcUMsbUJBQW1CLENBQUN4TixJQUFwQixDQUF5QjJOLG9CQUF6QixhQUF5QkEsb0JBQXpCLHVCQUF5QkEsb0JBQW9CLENBQUUzRyxJQUEvQztRQUNBLElBQU0rRCxXQUFXLEdBQUc2QixlQUFlLENBQUNlLG9CQUFELENBQW5DO1FBQ0FSLFdBQVcsQ0FBQ00sY0FBYyxDQUFDL04sR0FBaEIsQ0FBWCxHQUFrQ3FMLFdBQWxDO01BQ0EsQ0FORCxNQU1PO1FBQ055QyxtQkFBbUIsQ0FBQ3hOLElBQXBCLENBQXlCbkQsVUFBekI7UUFDQXNRLFdBQVcsQ0FBQ00sY0FBYyxDQUFDL04sR0FBaEIsQ0FBWCxHQUFrQztVQUFFc0gsSUFBSSxFQUFFbEs7UUFBUixDQUFsQztNQUNBO0lBQ0QsQ0FYRCxFQVRDLENBc0JEOztJQUNBLElBQUk4USxvQkFBSjs7SUFDQSxJQUFJLENBQUNoRixXQUFXLENBQUNDLFdBQVosQ0FBd0IxSixnQkFBZ0IsQ0FBQzJKLFlBQWpCLEVBQXhCLENBQUwsRUFBK0Q7TUFBQTs7TUFDOUQ4RSxvQkFBb0IsOEJBQUl6TyxnQkFBZ0IsQ0FBQzJKLFlBQWpCLEVBQUosdUZBQUksd0JBQWlDaEwsV0FBckMsdUZBQUksd0JBQThDa0wsWUFBbEQsNERBQUcsd0JBQ3BCNkUsa0JBREg7SUFFQTs7SUFDRCxJQUFNQyxtQkFBbUIsR0FBR0Ysb0JBQTVCO0lBQ0EsSUFBTUcsSUFBSSxHQUFHLEVBQWI7SUFDQUEsSUFBSSxDQUFDLG9CQUFELENBQUosR0FBNkJwRyxxQkFBcUIsQ0FBQ21HLG1CQUFELEVBQXNCLG9CQUF0QixDQUFyQixJQUFvRSxFQUFqRztJQUNBQyxJQUFJLENBQUMseUJBQUQsQ0FBSixHQUFrQ3BHLHFCQUFxQixDQUFDbUcsbUJBQUQsRUFBc0IseUJBQXRCLENBQXJCLElBQXlFLEVBQTNHO0lBQ0FDLElBQUksQ0FBQywwQkFBRCxDQUFKLEdBQW1DcEcscUJBQXFCLENBQUNtRyxtQkFBRCxFQUFzQiwwQkFBdEIsQ0FBckIsSUFBMEUsRUFBN0c7SUFFQSxJQUFNRSxjQUFjLEdBQUc3TyxnQkFBZ0IsQ0FBQ21ILGNBQWpCLEVBQXZCO0lBQ0EsSUFBTTJILFVBQVUsR0FBR0QsY0FBYyxDQUFDdk4sS0FBZixDQUFxQixHQUFyQixDQUFuQjs7SUFDQSxJQUFJd04sVUFBVSxDQUFDdFAsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtNQUMxQixJQUFNd0ssZUFBZSxHQUFHOEUsVUFBVSxDQUFDQSxVQUFVLENBQUN0UCxNQUFYLEdBQW9CLENBQXJCLENBQWxDO01BQ0FzUCxVQUFVLENBQUM1SyxNQUFYLENBQWtCLENBQUMsQ0FBbkIsRUFBc0IsQ0FBdEI7TUFDQSxJQUFNK0YsdUJBQXVCLEdBQUdGLHlCQUF5QixDQUFDL0osZ0JBQUQsRUFBbUJnSyxlQUFuQixDQUF6RDtNQUNBLElBQU0rRSw2QkFBNkIsR0FBRzlFLHVCQUF1QixJQUFJQSx1QkFBdUIsQ0FBQ3lFLGtCQUF6RjtNQUNBRSxJQUFJLENBQUNJLGtCQUFMLENBQXdCL04sTUFBeEIsQ0FBK0J1SCxxQkFBcUIsQ0FBQ3VHLDZCQUFELEVBQWdDLG9CQUFoQyxDQUFyQixJQUE4RSxFQUE3RztNQUNBSCxJQUFJLENBQUNLLHVCQUFMLENBQTZCaE8sTUFBN0IsQ0FBb0N1SCxxQkFBcUIsQ0FBQ3VHLDZCQUFELEVBQWdDLHlCQUFoQyxDQUFyQixJQUFtRixFQUF2SDtNQUNBSCxJQUFJLENBQUNNLHdCQUFMLG1DQUNLMUcscUJBQXFCLENBQUN1Ryw2QkFBRCxFQUFnQywwQkFBaEMsQ0FBckIsSUFBb0YsRUFEekYsR0FFSUgsSUFBSSxDQUFDTSx3QkFGVDtJQUlBOztJQUNELElBQU1uQixjQUFjLEdBQUdhLElBQUksQ0FBQ0ksa0JBQTVCO0lBQ0EsSUFBTUcsbUJBQW1CLEdBQUdQLElBQUksQ0FBQ0ssdUJBQWpDO0lBQ0EsSUFBTUcsa0JBQXVCLEdBQUcsRUFBaEMsQ0FsREMsQ0FvREQ7O0lBQ0EvQixrQkFBa0IsQ0FBQ3JQLE9BQW5CLENBQTJCLFVBQVU4UCxpQkFBVixFQUFrQztNQUM1RCxJQUFJbkksYUFBSjs7TUFDQSxJQUFJd0osbUJBQW1CLENBQUN2TyxPQUFwQixDQUE0QitFLGFBQTVCLE1BQStDLENBQUMsQ0FBcEQsRUFBdUQ7UUFDdEQsSUFBTWtHLGFBQWEsR0FBR2dDLDRCQUE0QixDQUFDQyxpQkFBRCxFQUFvQjlOLGdCQUFwQixFQUFzQytOLGNBQXRDLEVBQXNEQyxXQUF0RCxDQUFsRDtRQUNBb0Isa0JBQWtCLENBQUN2TyxJQUFuQixDQUF3QmdMLGFBQXhCO01BQ0E7SUFDRCxDQU5ELEVBckRDLENBNkREOztJQUNBLElBQU0zRixtQkFBbUIsR0FBR2xHLGdCQUFnQixDQUFDbUcsc0JBQWpCLEVBQTVCOztJQUNBLElBQUlzRCxXQUFXLENBQUM0RiwwQkFBWixDQUF1Q25KLG1CQUF2QyxDQUFKLEVBQWlFO01BQ2hFa0osa0JBQWtCLENBQUN2TyxJQUFuQixDQUF3QndJLDhCQUE4QixFQUF0RDtJQUNBLENBakVBLENBa0VEOzs7SUFDQSxJQUFNRyxrQkFBa0IsR0FBR0QscUJBQXFCLENBQUN2SixnQkFBRCxDQUFoRDtJQUNBLElBQU1zUCxlQUFlLEdBQUdDLE9BQU8sQ0FBQy9GLGtCQUFrQixJQUFJLENBQUNBLGtCQUFrQixDQUFDZ0csVUFBM0MsQ0FBL0I7O0lBQ0EsSUFBSVgsY0FBYyxJQUFJUyxlQUFlLEtBQUssSUFBMUMsRUFBZ0Q7TUFDL0MsSUFBSSxDQUFDOUYsa0JBQUQsSUFBdUJBLGtCQUF2QixhQUF1QkEsa0JBQXZCLGVBQXVCQSxrQkFBa0IsQ0FBRWdHLFVBQS9DLEVBQTJEO1FBQzFESixrQkFBa0IsQ0FBQ3ZPLElBQW5CLENBQXdCcUksMkJBQTJCLEVBQW5EO01BQ0E7SUFDRDs7SUFFRCxPQUFPa0csa0JBQVA7RUFDQSxDQWhGTTs7OztFQWtGQSxJQUFNSyw0QkFBNEIsR0FBRyxVQUMzQ3BMLFlBRDJDLEVBRTNDbEQsVUFGMkMsRUFHM0NuQixnQkFIMkMsRUFJMUM7SUFDRCxPQUFPMFAsb0JBQW9CLENBQUNyTCxZQUFELEVBQWUrQyx1QkFBdUIsQ0FBQ2pHLFVBQUQsRUFBYW5CLGdCQUFiLENBQXRDLEVBQXNFO01BQ2hHLGdCQUFnQixXQURnRjtNQUVoR2dELEtBQUssRUFBRSxXQUZ5RjtNQUdoRzZFLElBQUksRUFBRSxXQUgwRjtNQUloR0ssUUFBUSxFQUFFLFdBSnNGO01BS2hHRCxRQUFRLEVBQUUsV0FMc0Y7TUFNaEdLLFFBQVEsRUFBRSxXQU5zRjtNQU9oR1AsWUFBWSxFQUFFLFdBUGtGO01BUWhHUSxRQUFRLEVBQUU7SUFSc0YsQ0FBdEUsQ0FBM0I7RUFVQSxDQWZNO0VBaUJQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sSUFBTW9ILGtCQUFrQixHQUFHLFVBQ2pDM1AsZ0JBRGlDLEVBTTNCO0lBQUE7O0lBQUEsSUFKTjRNLFFBSU0sdUVBSjJCLEVBSTNCO0lBQUEsSUFITmpNLGNBR00sdUVBSG1CLEVBR25CO0lBQUEsSUFGTnFCLGFBRU07SUFBQSxJQURONkssWUFDTTtJQUNOLElBQU0rQyw0QkFBNEIsR0FBR2pELDhCQUE4QixDQUNsRTNNLGdCQURrRSxFQUVsRTRNLFFBRmtFLEVBR2xFak0sY0FIa0UsRUFJbEVxQixhQUprRSxFQUtsRTZLLFlBTGtFLENBQW5FOztJQU9BLElBQU1nRCxlQUFlLEdBQUc1SixtQkFBbUIsQ0FBQ2pHLGdCQUFELENBQTNDOztJQUNBLElBQUlxTixrQkFBaUMsR0FBR3lDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLFNBQUwsQ0FBZUosNEJBQTRCLENBQUN2QyxrQkFBNUMsQ0FBWCxDQUF4QztJQUNBLElBQU1sTSxVQUFVLEdBQUd5Tyw0QkFBNEIsQ0FBQ3pPLFVBQWhEO0lBRUFrTSxrQkFBa0IsR0FBR3dDLGVBQWUsQ0FBQzVPLE1BQWhCLENBQXVCb00sa0JBQXZCLENBQXJCO0lBRUFBLGtCQUFrQixHQUFHb0MsNEJBQTRCLENBQUNwQyxrQkFBRCxFQUFxQmxNLFVBQXJCLEVBQWlDbkIsZ0JBQWpDLENBQWpEO0lBRUEsSUFBTW9QLGtCQUFrQixHQUFHakIsc0JBQXNCLENBQ2hEZCxrQkFEZ0QsRUFFaERyTixnQkFGZ0QsRUFHaEQ0UCw0QkFBNEIsQ0FBQ3BDLG1CQUhtQixDQUFqRDtJQUtBNEIsa0JBQWtCLENBQUNuRSxJQUFuQixDQUF3QixVQUFVQyxDQUFWLEVBQWtCQyxDQUFsQixFQUEwQjtNQUNqRCxJQUFJRCxDQUFDLENBQUMzTSxVQUFGLEtBQWlCMEQsU0FBakIsSUFBOEJpSixDQUFDLENBQUMzTSxVQUFGLEtBQWlCLElBQW5ELEVBQXlEO1FBQ3hELE9BQU8sQ0FBQyxDQUFSO01BQ0E7O01BQ0QsSUFBSTRNLENBQUMsQ0FBQzVNLFVBQUYsS0FBaUIwRCxTQUFqQixJQUE4QmtKLENBQUMsQ0FBQzVNLFVBQUYsS0FBaUIsSUFBbkQsRUFBeUQ7UUFDeEQsT0FBTyxDQUFQO01BQ0E7O01BQ0QsT0FBTzJNLENBQUMsQ0FBQzNNLFVBQUYsQ0FBYTBSLGFBQWIsQ0FBMkI5RSxDQUFDLENBQUM1TSxVQUE3QixDQUFQO0lBQ0EsQ0FSRDtJQVVBLElBQUkyUixnQkFBZ0IsR0FBR0osSUFBSSxDQUFDRSxTQUFMLENBQWVaLGtCQUFmLENBQXZCO0lBQ0FjLGdCQUFnQixHQUFHQSxnQkFBZ0IsQ0FBQ2pDLE9BQWpCLENBQXlCLEtBQXpCLEVBQWdDLEtBQWhDLENBQW5CO0lBQ0FpQyxnQkFBZ0IsR0FBR0EsZ0JBQWdCLENBQUNqQyxPQUFqQixDQUF5QixLQUF6QixFQUFnQyxLQUFoQyxDQUFuQjtJQUNBLElBQU1rQyxhQUFhLEdBQUdELGdCQUF0QixDQWxDTSxDQW1DTjtJQUVBOztJQUNBLElBQUlFLG1CQUFrQyxHQUFHTixJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxTQUFMLENBQWVKLDRCQUE0QixDQUFDdkMsa0JBQTVDLENBQVgsQ0FBekM7SUFDQStDLG1CQUFtQixHQUFHUCxlQUFlLENBQUM1TyxNQUFoQixDQUF1Qm1QLG1CQUF2QixDQUF0QixDQXZDTSxDQXdDTjs7SUFDQSxJQUFNaEwsd0JBQWlELEdBQUd3Syw0QkFBNEIsQ0FBQ3hLLHdCQUF2RjtJQUNBLElBQU1pTCxZQUFZLEdBQUdsUCxVQUFILGFBQUdBLFVBQUgsaURBQUdBLFVBQVUsQ0FBRXhDLFdBQWYscUZBQUcsdUJBQXlCd0QsRUFBNUIsMkRBQUcsdUJBQTZCbU8sWUFBbEQ7SUFDQSxJQUFJeFMsY0FBMkMsR0FBRyxFQUFsRDtJQUVBLElBQU15UyxZQUFZLEdBQUd2USxnQkFBZ0IsQ0FBQ3dRLG9CQUFqQixDQUFzQyxJQUF0QywwQ0FBckI7O0lBRUEsSUFBSUgsWUFBWSxLQUFLcE8sU0FBakIsSUFBOEJvTyxZQUFZLENBQUM3USxNQUFiLEdBQXNCLENBQXhELEVBQTJEO01BQzFELEtBQUssSUFBTWlSLENBQVgsSUFBZ0JGLFlBQWhCLEVBQThCO1FBQzdCelMsY0FBYyxtQ0FDVkEsY0FEVSxHQUVWRix5QkFBeUIsQ0FBQzJTLFlBQVksQ0FBQ0UsQ0FBRCxDQUFiLENBRmYsQ0FBZDtNQUlBO0lBQ0QsQ0FQRCxNQU9PO01BQ04zUyxjQUFjLEdBQUd1UyxZQUFZLENBQUNyUixNQUFiLENBQW9CLFVBQUNDLGFBQUQsRUFBNkN5UixXQUE3QyxFQUFrRjtRQUN0SCxLQUFLLElBQUlELEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLElBQUlDLFdBQUosYUFBSUEsV0FBSiw4Q0FBSUEsV0FBVyxDQUFFQyxNQUFqQixpRkFBSSxvQkFBcUJDLE9BQXpCLG9GQUFHLHNCQUE4QzdTLElBQWpELDJEQUFHLHVCQUFvRHlCLE1BQXZELENBQWpCLEVBQWdGaVIsRUFBQyxFQUFqRixFQUFxRjtVQUFBOztVQUNwRnhSLGFBQWEsQ0FBR3lSLFdBQUgsYUFBR0EsV0FBSCwrQ0FBR0EsV0FBVyxDQUFFQyxNQUFoQixrRkFBRyxxQkFBcUJDLE9BQXhCLG9GQUFFLHNCQUE4QzdTLElBQTlDLENBQW1EMFMsRUFBbkQsQ0FBRixxRkFBQyx1QkFBMkV0UyxLQUE1RSwyREFBQyx1QkFBa0ZDLElBQW5GLENBQWIsR0FBd0c7WUFDdkdDLEtBQUssRUFBRXFTLFdBQUYsYUFBRUEsV0FBRiwwQ0FBRUEsV0FBVyxDQUFFRyxFQUFmLG9EQUFFLGdCQUFpQkMsUUFBakIsRUFEZ0c7WUFFdkd2UyxVQUFVLEVBQUVtUyxXQUFGLGFBQUVBLFdBQUYsNkNBQUVBLFdBQVcsQ0FBRWhTLEtBQWYsdURBQUUsbUJBQW9Cb1MsUUFBcEI7VUFGMkYsQ0FBeEc7UUFJQTs7UUFDRCxPQUFPN1IsYUFBUDtNQUNBLENBUmdCLEVBUWQsRUFSYyxDQUFqQjtJQVNBLENBaEVLLENBa0VOOzs7SUFDQSxJQUFNb0YsWUFBeUMsR0FBR3VMLDRCQUE0QixDQUFDdkwsWUFBL0UsQ0FuRU0sQ0FxRU47O0lBQ0EsSUFBSTBNLFVBQVUsR0FBR1gsbUJBQW1CLENBRW5DO0lBRm1DLENBR2xDblAsTUFIZSxDQUlmd0csTUFBTSxDQUFDQyxJQUFQLENBQVlyRCxZQUFaLEVBQ0UyTSxNQURGLENBQ1MsVUFBQzVQLFlBQUQ7TUFBQSxPQUFrQixFQUFFQSxZQUFZLElBQUlnRSx3QkFBbEIsQ0FBbEI7SUFBQSxDQURULEVBRUVsRixHQUZGLENBRU0sVUFBQ2tCLFlBQUQsRUFBa0I7TUFDdEIsT0FBT3FHLE1BQU0sQ0FBQzRFLE1BQVAsQ0FBY2hJLFlBQVksQ0FBQ2pELFlBQUQsQ0FBMUIsRUFBMEN0RCxjQUFjLENBQUNzRCxZQUFELENBQXhELENBQVA7SUFDQSxDQUpGLENBSmUsQ0FBakI7SUFVQSxJQUFNNlAsWUFBWSxHQUFHalIsZ0JBQWdCLENBQUNtSCxjQUFqQixFQUFyQixDQWhGTSxDQWtGTjs7SUFDQSxJQUFJOUgsc0NBQXNDLENBQUN1TixRQUFELEVBQVdxRSxZQUFYLENBQTFDLEVBQW9FO01BQ25FO01BQ0E7TUFDQTtNQUNBLElBQU1DLFVBQVUsR0FBR3RFLFFBQVEsQ0FBQyxDQUFELENBQVIsQ0FBWXNFLFVBQS9COztNQUNBLElBQUlBLFVBQUosRUFBZ0I7UUFDZixJQUFNQyxzQkFBZ0MsR0FBRzFKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZd0osVUFBWixFQUF3QmhSLEdBQXhCLENBQTRCLFVBQUNrUixZQUFEO1VBQUEsT0FBa0JGLFVBQVUsQ0FBQ0UsWUFBRCxDQUFWLENBQXlCQyxZQUEzQztRQUFBLENBQTVCLENBQXpDO1FBQ0FOLFVBQVUsR0FBR0EsVUFBVSxDQUFDQyxNQUFYLENBQWtCLFVBQUMxTSxXQUFELEVBQWlCO1VBQy9DLE9BQU82TSxzQkFBc0IsQ0FBQ3ZRLE9BQXZCLENBQStCMEQsV0FBVyxDQUFDL0QsR0FBM0MsTUFBb0QsQ0FBQyxDQUE1RDtRQUNBLENBRlksQ0FBYjtNQUdBO0lBQ0Q7O0lBRUQsSUFBTXVELGVBQWUsR0FBRzJMLDRCQUE0QixDQUFDc0IsVUFBRCxFQUFhNVAsVUFBYixFQUF5Qm5CLGdCQUF6QixDQUFwRCxDQWhHTSxDQWtHTjs7SUFDQSxJQUFNc1IsZUFBZSxHQUFHcEQsd0JBQXdCLENBQUNsTyxnQkFBRCxDQUFoRDtJQUNBOEQsZUFBZSxDQUFDOUYsT0FBaEIsQ0FBd0IsVUFBQ3NHLFdBQUQsRUFBaUI7TUFDeENBLFdBQVcsQ0FBQ3NHLGFBQVosR0FBNEIwRyxlQUE1QjtJQUNBLENBRkQ7SUFJQSxPQUFPO01BQUV4TixlQUFlLEVBQWZBLGVBQUY7TUFBbUJxTSxhQUFhLEVBQWJBO0lBQW5CLENBQVA7RUFDQSxDQS9HTTtFQWlIUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztFQUNPLElBQU1vQixxQkFBcUIsR0FBRyxVQUNwQ3ZSLGdCQURvQyxFQUVwQ3dSLDRCQUZvQyxFQUdwQ0MsbUJBSG9DLEVBSTFCO0lBQ1YsSUFBTUMsa0JBQWtCLEdBQUdsSixxQkFBcUIsQ0FBQ2dKLDRCQUFELEVBQStCLG9CQUEvQixDQUFoRDtJQUNBLElBQU1oSSxrQkFBa0IsR0FBR0QscUJBQXFCLENBQUN2SixnQkFBRCxDQUFoRDtJQUNBLElBQU1zUCxlQUFlLEdBQUdDLE9BQU8sQ0FBQy9GLGtCQUFrQixJQUFJLENBQUNBLGtCQUFrQixDQUFDZ0csVUFBM0MsQ0FBL0I7SUFDQSxJQUFNbUMsU0FBUyxHQUFHRixtQkFBbUIsQ0FBQ0csU0FBcEIsRUFBbEI7O0lBQ0EsSUFBSUYsa0JBQWtCLENBQUNsUyxNQUFuQixHQUE0QixDQUE1QixJQUFpQzhQLGVBQWpDLElBQW9ELENBQUFxQyxTQUFTLFNBQVQsSUFBQUEsU0FBUyxXQUFULFlBQUFBLFNBQVMsQ0FBRUUsV0FBWCxNQUEyQixDQUFuRixFQUFzRjtNQUNyRixPQUFPLElBQVA7SUFDQTs7SUFDRCxPQUFPLEtBQVA7RUFDQSxDQWJNIn0=