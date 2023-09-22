/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/annotations/DataField", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/converters/helpers/Key", "sap/fe/core/formatters/TableFormatter", "sap/fe/core/formatters/TableFormatterTypes", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/DisplayModeFormatter", "sap/fe/core/templating/EntitySetHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/macros/internal/helpers/ActionHelper", "../../helpers/Aggregation", "../../helpers/DataFieldHelper", "../../helpers/ID", "../../ManifestSettings", "./Criticality", "./table/StandardActions"], function (DataField, Action, BindingHelper, ConfigurableObject, IssueManager, Key, tableFormatters, TableFormatterTypes, BindingToolkit, ModelHelper, StableIdHelper, DataModelPathHelper, DisplayModeFormatter, EntitySetHelper, PropertyHelper, ActionHelper, Aggregation, DataFieldHelper, ID, ManifestSettings, Criticality, StandardActions) {
  "use strict";

  var _exports = {};
  var isInDisplayMode = StandardActions.isInDisplayMode;
  var isDraftOrStickySupported = StandardActions.isDraftOrStickySupported;
  var getStandardActionPaste = StandardActions.getStandardActionPaste;
  var getStandardActionMassEdit = StandardActions.getStandardActionMassEdit;
  var getStandardActionDelete = StandardActions.getStandardActionDelete;
  var getStandardActionCreate = StandardActions.getStandardActionCreate;
  var getRestrictions = StandardActions.getRestrictions;
  var getMassEditVisibility = StandardActions.getMassEditVisibility;
  var getInsertUpdateActionsTemplating = StandardActions.getInsertUpdateActionsTemplating;
  var getDeleteVisibility = StandardActions.getDeleteVisibility;
  var getCreationRow = StandardActions.getCreationRow;
  var getCreateVisibility = StandardActions.getCreateVisibility;
  var generateStandardActionsContext = StandardActions.generateStandardActionsContext;
  var getMessageTypeFromCriticalityType = Criticality.getMessageTypeFromCriticalityType;
  var VisualizationType = ManifestSettings.VisualizationType;
  var VariantManagementType = ManifestSettings.VariantManagementType;
  var TemplateType = ManifestSettings.TemplateType;
  var SelectionMode = ManifestSettings.SelectionMode;
  var Importance = ManifestSettings.Importance;
  var HorizontalAlign = ManifestSettings.HorizontalAlign;
  var CreationMode = ManifestSettings.CreationMode;
  var AvailabilityType = ManifestSettings.AvailabilityType;
  var ActionType = ManifestSettings.ActionType;
  var getTableID = ID.getTableID;
  var isReferencePropertyStaticallyHidden = DataFieldHelper.isReferencePropertyStaticallyHidden;
  var AggregationHelper = Aggregation.AggregationHelper;
  var isProperty = PropertyHelper.isProperty;
  var isPathExpression = PropertyHelper.isPathExpression;
  var isNavigationProperty = PropertyHelper.isNavigationProperty;
  var getTargetValueOnDataPoint = PropertyHelper.getTargetValueOnDataPoint;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedTimezoneProperty = PropertyHelper.getAssociatedTimezoneProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getNonSortablePropertiesRestrictions = EntitySetHelper.getNonSortablePropertiesRestrictions;
  var getDisplayMode = DisplayModeFormatter.getDisplayMode;
  var EDM_TYPE_MAPPING = DisplayModeFormatter.EDM_TYPE_MAPPING;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var isPathSearchable = DataModelPathHelper.isPathSearchable;
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var not = BindingToolkit.not;
  var isConstant = BindingToolkit.isConstant;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  var MessageType = TableFormatterTypes.MessageType;
  var KeyHelper = Key.KeyHelper;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategoryType = IssueManager.IssueCategoryType;
  var IssueCategory = IssueManager.IssueCategory;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var UI = BindingHelper.UI;
  var Entity = BindingHelper.Entity;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var isActionNavigable = Action.isActionNavigable;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var isDataFieldTypes = DataField.isDataFieldTypes;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var isDataFieldAlwaysHidden = DataField.isDataFieldAlwaysHidden;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var getDataFieldDataType = DataField.getDataFieldDataType;
  var collectRelatedPropertiesRecursively = DataField.collectRelatedPropertiesRecursively;
  var collectRelatedProperties = DataField.collectRelatedProperties;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var ColumnType; // Custom Column from Manifest

  (function (ColumnType) {
    ColumnType["Default"] = "Default";
    ColumnType["Annotation"] = "Annotation";
    ColumnType["Slot"] = "Slot";
  })(ColumnType || (ColumnType = {}));

  /**
   * Returns an array of all annotation-based and manifest-based table actions.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @param navigationSettings
   * @returns The complete table actions
   */
  function getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var aTableActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
    var aAnnotationActions = aTableActions.tableActions;
    var aHiddenActions = aTableActions.hiddenTableActions;
    var manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions, navigationSettings, true, aHiddenActions);
    var actions = insertCustomElements(aAnnotationActions, manifestActions.actions, {
      isNavigable: "overwrite",
      enableOnSelect: "overwrite",
      enableAutoScroll: "overwrite",
      enabled: "overwrite",
      visible: "overwrite",
      defaultValuesExtensionFunction: "overwrite",
      command: "overwrite"
    });
    return {
      "actions": actions,
      "commandActions": manifestActions.commandActions
    };
  }
  /**
   * Returns an array of all columns, annotation-based as well as manifest based.
   * They are sorted and some properties can be overwritten via the manifest (check out the keys that can be overwritten).
   *
   * @param lineItemAnnotation Collection of data fields for representation in a table or list
   * @param visualizationPath
   * @param converterContext
   * @param navigationSettings
   * @returns Returns all table columns that should be available, regardless of templating or personalization or their origin
   */


  _exports.getTableActions = getTableActions;

  function getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
    var manifestColumns = getColumnsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).columns, annotationColumns, converterContext, converterContext.getAnnotationEntityType(lineItemAnnotation), navigationSettings);
    return insertCustomElements(annotationColumns, manifestColumns, {
      width: "overwrite",
      importance: "overwrite",
      horizontalAlign: "overwrite",
      availability: "overwrite",
      isNavigable: "overwrite",
      settings: "overwrite",
      formatOptions: "overwrite"
    });
  }
  /**
   * Retrieve the custom aggregation definitions from the entityType.
   *
   * @param entityType The target entity type.
   * @param tableColumns The array of columns for the entity type.
   * @param converterContext The converter context.
   * @returns The aggregate definitions from the entityType, or undefined if the entity doesn't support analytical queries.
   */


  _exports.getTableColumns = getTableColumns;

  var getAggregateDefinitionsFromEntityType = function (entityType, tableColumns, converterContext) {
    var aggregationHelper = new AggregationHelper(entityType, converterContext);

    function findColumnFromPath(path) {
      return tableColumns.find(function (column) {
        var annotationColumn = column;
        return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
      });
    }

    if (!aggregationHelper.isAnalyticsSupported()) {
      return undefined;
    } // Keep a set of all currency/unit properties, as we don't want to consider them as aggregates
    // They are aggregates for technical reasons (to manage multi-units situations) but it doesn't make sense from a user standpoint


    var mCurrencyOrUnitProperties = new Set();
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.unit) {
        mCurrencyOrUnitProperties.add(oTableColumn.unit);
      }
    });
    var aCustomAggregateAnnotations = aggregationHelper.getCustomAggregateDefinitions();
    var mRawDefinitions = {};
    aCustomAggregateAnnotations.forEach(function (annotation) {
      var oAggregatedProperty = aggregationHelper._entityType.entityProperties.find(function (oProperty) {
        return oProperty.name === annotation.qualifier;
      });

      if (oAggregatedProperty) {
        var _annotation$annotatio, _annotation$annotatio2;

        var aContextDefiningProperties = (_annotation$annotatio = annotation.annotations) === null || _annotation$annotatio === void 0 ? void 0 : (_annotation$annotatio2 = _annotation$annotatio.Aggregation) === null || _annotation$annotatio2 === void 0 ? void 0 : _annotation$annotatio2.ContextDefiningProperties;
        mRawDefinitions[oAggregatedProperty.name] = aContextDefiningProperties ? aContextDefiningProperties.map(function (oCtxDefProperty) {
          return oCtxDefProperty.value;
        }) : [];
      }
    });
    var mResult = {};
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
        var aRawContextDefiningProperties = mRawDefinitions[oTableColumn.relativePath]; // Ignore aggregates corresponding to currencies or units of measure and dummy created property for datapoint target Value

        if (aRawContextDefiningProperties && !mCurrencyOrUnitProperties.has(oTableColumn.name) && !oTableColumn.isDataPointFakeTargetProperty) {
          mResult[oTableColumn.name] = {
            defaultAggregate: {},
            relativePath: oTableColumn.relativePath
          };
          var aContextDefiningProperties = [];
          aRawContextDefiningProperties.forEach(function (contextDefiningPropertyName) {
            var foundColumn = findColumnFromPath(contextDefiningPropertyName);

            if (foundColumn) {
              aContextDefiningProperties.push(foundColumn.name);
            }
          });

          if (aContextDefiningProperties.length) {
            mResult[oTableColumn.name].defaultAggregate.contextDefiningProperties = aContextDefiningProperties;
          }
        }
      }
    });
    return mResult;
  };
  /**
   * Updates a table visualization for analytical use cases.
   *
   * @param tableVisualization The visualization to be updated
   * @param entityType The entity type displayed in the table
   * @param converterContext The converter context
   * @param presentationVariantAnnotation The presentationVariant annotation (if any)
   */


  _exports.getAggregateDefinitionsFromEntityType = getAggregateDefinitionsFromEntityType;

  function updateTableVisualizationForAnalytics(tableVisualization, entityType, converterContext, presentationVariantAnnotation) {
    if (tableVisualization.control.type === "AnalyticalTable") {
      var aggregatesDefinitions = getAggregateDefinitionsFromEntityType(entityType, tableVisualization.columns, converterContext),
          aggregationHelper = new AggregationHelper(entityType, converterContext);

      if (aggregatesDefinitions) {
        tableVisualization.enableAnalytics = true;
        tableVisualization.aggregates = aggregatesDefinitions;
        var allowedTransformations = aggregationHelper.getAllowedTransformations();
        tableVisualization.enableAnalyticsSearch = allowedTransformations ? allowedTransformations.indexOf("search") >= 0 : true; // Add group and sort conditions from the presentation variant

        tableVisualization.annotation.groupConditions = getGroupConditions(presentationVariantAnnotation, tableVisualization.columns, tableVisualization.control.type);
        tableVisualization.annotation.aggregateConditions = getAggregateConditions(presentationVariantAnnotation, tableVisualization.columns);
      }

      tableVisualization.control.type = "GridTable"; // AnalyticalTable isn't a real type for the MDC:Table, so we always switch back to Grid
    } else if (tableVisualization.control.type === "ResponsiveTable") {
      tableVisualization.annotation.groupConditions = getGroupConditions(presentationVariantAnnotation, tableVisualization.columns, tableVisualization.control.type);
    }
  }
  /**
   * Get the navigation target path from manifest settings.
   *
   * @param converterContext The converter context
   * @param navigationPropertyPath The navigation path to check in the manifest settings
   * @returns Navigation path from manifest settings
   */


  function getNavigationTargetPath(converterContext, navigationPropertyPath) {
    var manifestWrapper = converterContext.getManifestWrapper();

    if (navigationPropertyPath && manifestWrapper.getNavigationConfiguration(navigationPropertyPath)) {
      var navConfig = manifestWrapper.getNavigationConfiguration(navigationPropertyPath);

      if (Object.keys(navConfig).length > 0) {
        return navigationPropertyPath;
      }
    }

    var dataModelPath = converterContext.getDataModelObjectPath();
    var contextPath = converterContext.getContextPath();
    var navConfigForContextPath = manifestWrapper.getNavigationConfiguration(contextPath);

    if (navConfigForContextPath && Object.keys(navConfigForContextPath).length > 0) {
      return contextPath;
    }

    return dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
  }
  /**
   * Sets the 'unit' and 'textArrangement' properties in columns when necessary.
   *
   * @param entityType The entity type displayed in the table
   * @param tableColumns The columns to be updated
   */


  function updateLinkedProperties(entityType, tableColumns) {
    function findColumnByPath(path) {
      return tableColumns.find(function (column) {
        var annotationColumn = column;
        return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
      });
    }

    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
        var oProperty = entityType.entityProperties.find(function (oProp) {
          return oProp.name === oTableColumn.relativePath;
        });

        if (oProperty) {
          var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation7;

          var oUnit = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);
          var oTimezone = getAssociatedTimezoneProperty(oProperty);
          var sTimezone = oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.Common) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.Timezone;

          if (oUnit) {
            var oUnitColumn = findColumnByPath(oUnit.name);
            oTableColumn.unit = oUnitColumn === null || oUnitColumn === void 0 ? void 0 : oUnitColumn.name;
          } else {
            var _oProperty$annotation3, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6;

            var sUnit = (oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation3 = oProperty.annotations) === null || _oProperty$annotation3 === void 0 ? void 0 : (_oProperty$annotation4 = _oProperty$annotation3.Measures) === null || _oProperty$annotation4 === void 0 ? void 0 : _oProperty$annotation4.ISOCurrency) || (oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation5 = oProperty.annotations) === null || _oProperty$annotation5 === void 0 ? void 0 : (_oProperty$annotation6 = _oProperty$annotation5.Measures) === null || _oProperty$annotation6 === void 0 ? void 0 : _oProperty$annotation6.Unit);

            if (sUnit) {
              oTableColumn.unitText = "".concat(sUnit);
            }
          }

          if (oTimezone) {
            var oTimezoneColumn = findColumnByPath(oTimezone.name);
            oTableColumn.timezone = oTimezoneColumn === null || oTimezoneColumn === void 0 ? void 0 : oTimezoneColumn.name;
          } else if (sTimezone) {
            oTableColumn.timezoneText = sTimezone.toString();
          }

          var displayMode = getDisplayMode(oProperty),
              textAnnotation = (_oProperty$annotation7 = oProperty.annotations.Common) === null || _oProperty$annotation7 === void 0 ? void 0 : _oProperty$annotation7.Text;

          if (isPathExpression(textAnnotation) && displayMode !== "Value") {
            var oTextColumn = findColumnByPath(textAnnotation.path);

            if (oTextColumn && oTextColumn.name !== oTableColumn.name) {
              oTableColumn.textArrangement = {
                textProperty: oTextColumn.name,
                mode: displayMode
              };
            }
          }
        }
      }
    });
  }

  _exports.updateLinkedProperties = updateLinkedProperties;

  function getSemanticKeysAndTitleInfo(converterContext) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3, _converterContext$get4, _converterContext$get5, _converterContext$get6, _converterContext$get7, _converterContext$get8, _converterContext$get9, _converterContext$get10, _converterContext$get11, _converterContext$get12, _converterContext$get13;

    var headerInfoTitlePath = (_converterContext$get = converterContext.getAnnotationEntityType()) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotations) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.UI) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.HeaderInfo) === null || _converterContext$get4 === void 0 ? void 0 : (_converterContext$get5 = _converterContext$get4.Title) === null || _converterContext$get5 === void 0 ? void 0 : (_converterContext$get6 = _converterContext$get5.Value) === null || _converterContext$get6 === void 0 ? void 0 : _converterContext$get6.path;
    var semanticKeyAnnotations = (_converterContext$get7 = converterContext.getAnnotationEntityType()) === null || _converterContext$get7 === void 0 ? void 0 : (_converterContext$get8 = _converterContext$get7.annotations) === null || _converterContext$get8 === void 0 ? void 0 : (_converterContext$get9 = _converterContext$get8.Common) === null || _converterContext$get9 === void 0 ? void 0 : _converterContext$get9.SemanticKey;
    var headerInfoTypeName = converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get10 = converterContext.getAnnotationEntityType()) === null || _converterContext$get10 === void 0 ? void 0 : (_converterContext$get11 = _converterContext$get10.annotations) === null || _converterContext$get11 === void 0 ? void 0 : (_converterContext$get12 = _converterContext$get11.UI) === null || _converterContext$get12 === void 0 ? void 0 : (_converterContext$get13 = _converterContext$get12.HeaderInfo) === null || _converterContext$get13 === void 0 ? void 0 : _converterContext$get13.TypeName;
    var semanticKeyColumns = [];

    if (semanticKeyAnnotations) {
      semanticKeyAnnotations.forEach(function (oColumn) {
        semanticKeyColumns.push(oColumn.value);
      });
    }

    return {
      headerInfoTitlePath: headerInfoTitlePath,
      semanticKeyColumns: semanticKeyColumns,
      headerInfoTypeName: headerInfoTypeName
    };
  }

  function createTableVisualization(lineItemAnnotation, visualizationPath, converterContext, presentationVariantAnnotation, isCondensedTableLayoutCompliant, viewConfiguration) {
    var tableManifestConfig = getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext, isCondensedTableLayoutCompliant);

    var _splitPath = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath.navigationPropertyPath;

    var navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
    var navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationTargetPath);
    var columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
    var operationAvailableMap = getOperationAvailableMap(lineItemAnnotation, converterContext);
    var semanticKeysAndHeaderInfoTitle = getSemanticKeysAndTitleInfo(converterContext);
    var tableActions = getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
    var oVisualization = {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfig, columns, presentationVariantAnnotation, viewConfiguration),
      control: tableManifestConfig,
      actions: removeDuplicateActions(tableActions.actions),
      commandActions: tableActions.commandActions,
      columns: columns,
      operationAvailableMap: JSON.stringify(operationAvailableMap),
      operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext),
      headerInfoTitle: semanticKeysAndHeaderInfoTitle.headerInfoTitlePath,
      semanticKeys: semanticKeysAndHeaderInfoTitle.semanticKeyColumns,
      headerInfoTypeName: semanticKeysAndHeaderInfoTitle.headerInfoTypeName
    };
    updateLinkedProperties(converterContext.getAnnotationEntityType(lineItemAnnotation), columns);
    updateTableVisualizationForAnalytics(oVisualization, converterContext.getAnnotationEntityType(lineItemAnnotation), converterContext, presentationVariantAnnotation);
    return oVisualization;
  }

  _exports.createTableVisualization = createTableVisualization;

  function createDefaultTableVisualization(converterContext) {
    var tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
    var columns = getColumnsFromEntityType({}, converterContext.getEntityType(), [], [], converterContext, tableManifestConfig.type);
    var operationAvailableMap = getOperationAvailableMap(undefined, converterContext);
    var semanticKeysAndHeaderInfoTitle = getSemanticKeysAndTitleInfo(converterContext);
    var oVisualization = {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(undefined, "", converterContext, tableManifestConfig, columns),
      control: tableManifestConfig,
      actions: [],
      columns: columns,
      operationAvailableMap: JSON.stringify(operationAvailableMap),
      operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext),
      headerInfoTitle: semanticKeysAndHeaderInfoTitle.headerInfoTitlePath,
      semanticKeys: semanticKeysAndHeaderInfoTitle.semanticKeyColumns,
      headerInfoTypeName: semanticKeysAndHeaderInfoTitle.headerInfoTypeName
    };
    updateLinkedProperties(converterContext.getEntityType(), columns);
    updateTableVisualizationForAnalytics(oVisualization, converterContext.getEntityType(), converterContext);
    return oVisualization;
  }
  /**
   * Gets the map of Core.OperationAvailable property paths for all DataFieldForActions.
   *
   * @param lineItemAnnotation The instance of the line item
   * @param converterContext The instance of the converter context
   * @returns The record containing all action names and their corresponding Core.OperationAvailable property paths
   */


  _exports.createDefaultTableVisualization = createDefaultTableVisualization;

  function getOperationAvailableMap(lineItemAnnotation, converterContext) {
    return ActionHelper.getOperationAvailableMap(lineItemAnnotation, "table", converterContext);
  }
  /**
   * Gets updatable propertyPath for the current entityset if valid.
   *
   * @param converterContext The instance of the converter context
   * @returns The updatable property for the rows
   */


  function getCurrentEntitySetUpdatablePath(converterContext) {
    var _entitySet$annotation, _entitySet$annotation2, _entitySet$annotation3;

    var restrictions = getRestrictions(converterContext);
    var entitySet = converterContext.getEntitySet();
    var updatable = restrictions.isUpdatable;
    var isOnlyDynamicOnCurrentEntity = !isConstant(updatable.expression) && updatable.navigationExpression._type === "Unresolvable";
    var updatablePropertyPath = entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation = entitySet.annotations.Capabilities) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.UpdateRestrictions) === null || _entitySet$annotation2 === void 0 ? void 0 : (_entitySet$annotation3 = _entitySet$annotation2.Updatable) === null || _entitySet$annotation3 === void 0 ? void 0 : _entitySet$annotation3.path;
    return isOnlyDynamicOnCurrentEntity ? updatablePropertyPath : "";
  }
  /**
   * Method to retrieve all property paths assigned to the Core.OperationAvailable annotation.
   *
   * @param operationAvailableMap The record consisting of actions and their Core.OperationAvailable property paths
   * @param converterContext The instance of the converter context
   * @returns The CSV string of all property paths associated with the Core.OperationAvailable annotation
   */


  function getOperationAvailableProperties(operationAvailableMap, converterContext) {
    var properties = new Set();

    for (var actionName in operationAvailableMap) {
      var propertyName = operationAvailableMap[actionName];

      if (propertyName === null) {
        // Annotation configured with explicit 'null' (action advertisement relevant)
        properties.add(actionName);
      } else if (typeof propertyName === "string") {
        // Add property paths and not Constant values.
        properties.add(propertyName);
      }
    }

    if (properties.size) {
      var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3, _entityType$annotatio4, _entityType$annotatio5;

      // Some actions have an operation available based on property --> we need to load the HeaderInfo.Title property
      // so that the dialog on partial actions is displayed properly (BCP 2180271425)
      var entityType = converterContext.getEntityType();
      var titleProperty = (_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.HeaderInfo) === null || _entityType$annotatio3 === void 0 ? void 0 : (_entityType$annotatio4 = _entityType$annotatio3.Title) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.Value) === null || _entityType$annotatio5 === void 0 ? void 0 : _entityType$annotatio5.path;

      if (titleProperty) {
        properties.add(titleProperty);
      }
    }

    return Array.from(properties).join(",");
  }
  /**
   * Iterates over the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and
   * returns all the UI.Hidden annotation expressions.
   *
   * @param lineItemAnnotation Collection of data fields used for representation in a table or list
   * @param currentEntityType Current entity type
   * @param contextDataModelObjectPath Object path of the data model
   * @param isEntitySet
   * @returns All the `UI.Hidden` path expressions found in the relevant actions
   */


  function getUIHiddenExpForActionsRequiringContext(lineItemAnnotation, currentEntityType, contextDataModelObjectPath, isEntitySet) {
    var aUiHiddenPathExpressions = [];
    lineItemAnnotation.forEach(function (dataField) {
      var _dataField$ActionTarg, _dataField$Inline;

      // Check if the lineItem context is the same as that of the action:
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && dataField !== null && dataField !== void 0 && (_dataField$ActionTarg = dataField.ActionTarget) !== null && _dataField$ActionTarg !== void 0 && _dataField$ActionTarg.isBound && currentEntityType === (dataField === null || dataField === void 0 ? void 0 : dataField.ActionTarget.sourceEntityType) || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && dataField.RequiresContext && (dataField === null || dataField === void 0 ? void 0 : (_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) !== true) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

        if (typeof ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === "object") {
          aUiHiddenPathExpressions.push(equal(getBindingExpFromContext(dataField, contextDataModelObjectPath, isEntitySet), false));
        }
      }
    });
    return aUiHiddenPathExpressions;
  }
  /**
   * This method is used to change the context currently referenced by this binding by removing the last navigation property.
   *
   * It is used (specifically in this case), to transform a binding made for a NavProp context /MainObject/NavProp1/NavProp2,
   * into a binding on the previous context /MainObject/NavProp1.
   *
   * @param source DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction
   * @param contextDataModelObjectPath DataModelObjectPath
   * @param isEntitySet
   * @returns The binding expression
   */


  function getBindingExpFromContext(source, contextDataModelObjectPath, isEntitySet) {
    var _sExpression;

    var sExpression;

    if ((source === null || source === void 0 ? void 0 : source.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForAction" || (source === null || source === void 0 ? void 0 : source.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
      var _annotations, _annotations$UI;

      sExpression = source === null || source === void 0 ? void 0 : (_annotations = source.annotations) === null || _annotations === void 0 ? void 0 : (_annotations$UI = _annotations.UI) === null || _annotations$UI === void 0 ? void 0 : _annotations$UI.Hidden;
    } else {
      sExpression = source === null || source === void 0 ? void 0 : source.visible;
    }

    var sPath;

    if ((_sExpression = sExpression) !== null && _sExpression !== void 0 && _sExpression.path) {
      sPath = sExpression.path;
    } else {
      sPath = sExpression;
    }

    if (sPath) {
      if (source !== null && source !== void 0 && source.visible) {
        sPath = sPath.substring(1, sPath.length - 1);
      }

      if (sPath.indexOf("/") > 0) {
        var _contextDataModelObje;

        //check if the navigation property is correct:
        var aSplitPath = sPath.split("/");
        var sNavigationPath = aSplitPath[0];

        if ((contextDataModelObjectPath === null || contextDataModelObjectPath === void 0 ? void 0 : (_contextDataModelObje = contextDataModelObjectPath.targetObject) === null || _contextDataModelObje === void 0 ? void 0 : _contextDataModelObje._type) === "NavigationProperty" && contextDataModelObjectPath.targetObject.partner === sNavigationPath) {
          return pathInModel(aSplitPath.slice(1).join("/"));
        } else {
          return constant(true);
        } // In case there is no navigation property, if it's an entitySet, the expression binding has to be returned:

      } else if (isEntitySet) {
        return pathInModel(sPath); // otherwise the expression binding cannot be taken into account for the selection mode evaluation:
      } else {
        return constant(true);
      }
    }

    return constant(true);
  }
  /**
   * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and check
   * if at least one of them is always visible in the table toolbar (and requires a context).
   *
   * @param lineItemAnnotation Collection of data fields for representation in a table or list
   * @param currentEntityType Current Entity Type
   * @returns `true` if there is at least 1 action that meets the criteria
   */


  function hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation, currentEntityType) {
    return lineItemAnnotation.some(function (dataField) {
      var _dataField$Inline2, _dataField$annotation4, _dataField$annotation5, _dataField$annotation6, _dataField$annotation7, _dataField$annotation8, _dataField$annotation9;

      if ((dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && (dataField === null || dataField === void 0 ? void 0 : (_dataField$Inline2 = dataField.Inline) === null || _dataField$Inline2 === void 0 ? void 0 : _dataField$Inline2.valueOf()) !== true && (((_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.Hidden) === null || _dataField$annotation6 === void 0 ? void 0 : _dataField$annotation6.valueOf()) === false || ((_dataField$annotation7 = dataField.annotations) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.UI) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.Hidden) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.valueOf()) === undefined)) {
        if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
          var _dataField$ActionTarg2;

          // Check if the lineItem context is the same as that of the action:
          return (dataField === null || dataField === void 0 ? void 0 : (_dataField$ActionTarg2 = dataField.ActionTarget) === null || _dataField$ActionTarg2 === void 0 ? void 0 : _dataField$ActionTarg2.isBound) && currentEntityType === (dataField === null || dataField === void 0 ? void 0 : dataField.ActionTarget.sourceEntityType);
        } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
          return dataField.RequiresContext;
        }
      }

      return false;
    });
  }

  function hasCustomActionsAlwaysVisibleInToolBar(manifestActions) {
    return Object.keys(manifestActions).some(function (actionKey) {
      var _action$visible;

      var action = manifestActions[actionKey];

      if (action.requiresSelection && ((_action$visible = action.visible) === null || _action$visible === void 0 ? void 0 : _action$visible.toString()) === "true") {
        return true;
      }

      return false;
    });
  }
  /**
   * Iterates over the custom actions (with key requiresSelection) declared in the manifest for the current line item and returns all the
   * visible key values as an expression.
   *
   * @param manifestActions The actions defined in the manifest
   * @returns Array<Expression<boolean>> All the visible path expressions of the actions that meet the criteria
   */


  function getVisibleExpForCustomActionsRequiringContext(manifestActions) {
    var aVisiblePathExpressions = [];

    if (manifestActions) {
      Object.keys(manifestActions).forEach(function (actionKey) {
        var action = manifestActions[actionKey];

        if (action.requiresSelection === true && action.visible !== undefined) {
          if (typeof action.visible === "string") {
            var _action$visible2;

            /*The final aim would be to check if the path expression depends on the parent context
            and considers only those expressions for the expression evaluation,
            but currently not possible from the manifest as the visible key is bound on the parent entity.
            Tricky to differentiate the path as it's done for the Hidden annotation.
            For the time being we consider all the paths of the manifest*/
            aVisiblePathExpressions.push(resolveBindingString(action === null || action === void 0 ? void 0 : (_action$visible2 = action.visible) === null || _action$visible2 === void 0 ? void 0 : _action$visible2.valueOf()));
          }
        }
      });
    }

    return aVisiblePathExpressions;
  }
  /**
   * Evaluate if the path is statically deletable or updatable.
   *
   * @param converterContext
   * @returns The table capabilities
   */


  function getCapabilityRestriction(converterContext) {
    var isDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
    var isUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath());
    return {
      isDeletable: !(isConstant(isDeletable) && isDeletable.value === false),
      isUpdatable: !(isConstant(isUpdatable) && isUpdatable.value === false)
    };
  }

  _exports.getCapabilityRestriction = getCapabilityRestriction;

  function getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities, deleteButtonVisibilityExpression) {
    var _tableManifestSetting;

    var massEditVisibilityExpression = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : constant(false);

    if (!lineItemAnnotation) {
      return SelectionMode.None;
    }

    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var selectionMode = (_tableManifestSetting = tableManifestSettings.tableSettings) === null || _tableManifestSetting === void 0 ? void 0 : _tableManifestSetting.selectionMode;
    var aHiddenBindingExpressions = [],
        aVisibleBindingExpressions = [];
    var manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, [], undefined, false);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
      parentEntitySetDeletable = isParentDeletable ? compileExpression(isParentDeletable, true) : isParentDeletable;
    }

    var bMassEditEnabled = !isConstant(massEditVisibilityExpression) || massEditVisibilityExpression.value !== false;

    if (selectionMode && selectionMode === SelectionMode.None && deleteButtonVisibilityExpression) {
      if (converterContext.getTemplateType() === TemplateType.ObjectPage && bMassEditEnabled) {
        // Mass Edit in OP is enabled only in edit mode.
        return compileExpression(ifElse(and(UI.IsEditable, massEditVisibilityExpression), constant("Multi"), ifElse(deleteButtonVisibilityExpression, constant("Multi"), constant("None"))));
      } else if (bMassEditEnabled) {
        return SelectionMode.Multi;
      }

      return compileExpression(ifElse(deleteButtonVisibilityExpression, constant("Multi"), constant("None")));
    }

    if (!selectionMode || selectionMode === SelectionMode.Auto) {
      selectionMode = SelectionMode.Multi;
    }

    if (bMassEditEnabled) {
      // Override default selection mode when mass edit is visible
      selectionMode = selectionMode === SelectionMode.Single ? SelectionMode.Single : SelectionMode.Multi;
    }

    if (hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation, converterContext.getEntityType()) || hasCustomActionsAlwaysVisibleInToolBar(manifestActions.actions)) {
      return selectionMode;
    }

    aHiddenBindingExpressions = getUIHiddenExpForActionsRequiringContext(lineItemAnnotation, converterContext.getEntityType(), converterContext.getDataModelObjectPath(), isEntitySet);
    aVisibleBindingExpressions = getVisibleExpForCustomActionsRequiringContext(manifestActions.actions); // No action requiring a context:

    if (aHiddenBindingExpressions.length === 0 && aVisibleBindingExpressions.length === 0 && (deleteButtonVisibilityExpression || bMassEditEnabled)) {
      if (!isEntitySet) {
        // Example: OP case
        if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false" || bMassEditEnabled) {
          // Building expression for delete and mass edit
          var buttonVisibilityExpression = or(deleteButtonVisibilityExpression || true, // default delete visibility as true
          massEditVisibilityExpression);
          return compileExpression(ifElse(and(UI.IsEditable, buttonVisibilityExpression), constant(selectionMode), constant(SelectionMode.None)));
        } else {
          return SelectionMode.None;
        } // EntitySet deletable:

      } else if (bMassEditEnabled) {
        // example: LR scenario
        return selectionMode;
      } else if (targetCapabilities.isDeletable && deleteButtonVisibilityExpression) {
        return compileExpression(ifElse(deleteButtonVisibilityExpression, constant(selectionMode), constant("None"))); // EntitySet not deletable:
      } else {
        return SelectionMode.None;
      } // There are actions requiring a context:

    } else if (!isEntitySet) {
      // Example: OP case
      if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false" || bMassEditEnabled) {
        // Use selectionMode in edit mode if delete is enabled or mass edit is visible
        var editModebuttonVisibilityExpression = ifElse(bMassEditEnabled && !targetCapabilities.isDeletable, massEditVisibilityExpression, constant(true));
        return compileExpression(ifElse(and(UI.IsEditable, editModebuttonVisibilityExpression), constant(selectionMode), ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None))));
      } else {
        return compileExpression(ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None)));
      } //EntitySet deletable:

    } else if (targetCapabilities.isDeletable || bMassEditEnabled) {
      // Example: LR scenario
      return selectionMode; //EntitySet not deletable:
    } else {
      return compileExpression(ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions)).concat([massEditVisibilityExpression])), constant(selectionMode), constant(SelectionMode.None)));
    }
  }
  /**
   * Method to retrieve all table actions from annotations.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns The table annotation actions
   */


  _exports.getSelectionMode = getSelectionMode;

  function getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext) {
    var tableActions = [];
    var hiddenTableActions = [];

    if (lineItemAnnotation) {
      lineItemAnnotation.forEach(function (dataField) {
        var _dataField$annotation10, _dataField$annotation11, _dataField$annotation12, _dataField$annotation13, _dataField$annotation14, _dataField$annotation15, _dataField$annotation16, _dataField$annotation17, _dataField$annotation18, _dataField$annotation19;

        var tableAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : (_dataField$annotation12 = _dataField$annotation11.Hidden) === null || _dataField$annotation12 === void 0 ? void 0 : _dataField$annotation12.valueOf()) === true) && !dataField.Inline && !dataField.Determining) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              tableAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                visible: compileExpression(not(equal(getExpressionFromAnnotation((_dataField$annotation13 = dataField.annotations) === null || _dataField$annotation13 === void 0 ? void 0 : (_dataField$annotation14 = _dataField$annotation13.UI) === null || _dataField$annotation14 === void 0 ? void 0 : _dataField$annotation14.Hidden, [], undefined, converterContext.getRelativeModelPathFunction()), true))),
                isNavigable: true
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              tableAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                visible: compileExpression(not(equal(getExpressionFromAnnotation((_dataField$annotation15 = dataField.annotations) === null || _dataField$annotation15 === void 0 ? void 0 : (_dataField$annotation16 = _dataField$annotation15.UI) === null || _dataField$annotation16 === void 0 ? void 0 : _dataField$annotation16.Hidden, [], undefined, converterContext.getRelativeModelPathFunction()), true)))
              };
              break;

            default:
              break;
          }
        } else if (((_dataField$annotation17 = dataField.annotations) === null || _dataField$annotation17 === void 0 ? void 0 : (_dataField$annotation18 = _dataField$annotation17.UI) === null || _dataField$annotation18 === void 0 ? void 0 : (_dataField$annotation19 = _dataField$annotation18.Hidden) === null || _dataField$annotation19 === void 0 ? void 0 : _dataField$annotation19.valueOf()) === true) {
          hiddenTableActions.push({
            type: ActionType.Default,
            key: KeyHelper.generateKeyFromDataField(dataField)
          });
        }

        if (tableAction) {
          tableActions.push(tableAction);
        }
      });
    }

    return {
      tableActions: tableActions,
      hiddenTableActions: hiddenTableActions
    };
  }

  function getHighlightRowBinding(criticalityAnnotation, isDraftRoot, targetEntityType) {
    var defaultHighlightRowDefinition = MessageType.None;

    if (criticalityAnnotation) {
      if (typeof criticalityAnnotation === "object") {
        defaultHighlightRowDefinition = getExpressionFromAnnotation(criticalityAnnotation);
      } else {
        // Enum Value so we get the corresponding static part
        defaultHighlightRowDefinition = getMessageTypeFromCriticalityType(criticalityAnnotation);
      }
    }

    var aMissingKeys = [];
    targetEntityType === null || targetEntityType === void 0 ? void 0 : targetEntityType.keys.forEach(function (key) {
      if (key.name !== "IsActiveEntity") {
        aMissingKeys.push(pathInModel(key.name, undefined));
      }
    });
    return formatResult([defaultHighlightRowDefinition, pathInModel("filteredMessages", "internal"), isDraftRoot && Entity.HasActive, isDraftRoot && Entity.IsActive, "".concat(isDraftRoot)].concat(aMissingKeys), tableFormatters.rowHighlighting, targetEntityType);
  }

  function _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings, visualizationPath) {
    var _newAction2;

    var navigation = (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.create) || (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.detail);
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var originalTableSettings = tableManifestSettings && tableManifestSettings.tableSettings || {}; // cross-app

    if (navigation !== null && navigation !== void 0 && navigation.outbound && navigation.outboundDetail && navigationSettings !== null && navigationSettings !== void 0 && navigationSettings.create) {
      return {
        mode: "External",
        outbound: navigation.outbound,
        outboundDetail: navigation.outboundDetail,
        navigationSettings: navigationSettings
      };
    }

    var newAction;

    if (lineItemAnnotation) {
      var _converterContext$get14, _targetAnnotationsCom, _targetAnnotationsSes;

      // in-app
      var targetAnnotations = (_converterContext$get14 = converterContext.getEntitySet()) === null || _converterContext$get14 === void 0 ? void 0 : _converterContext$get14.annotations;
      var targetAnnotationsCommon = targetAnnotations === null || targetAnnotations === void 0 ? void 0 : targetAnnotations.Common,
          targetAnnotationsSession = targetAnnotations === null || targetAnnotations === void 0 ? void 0 : targetAnnotations.Session;
      newAction = (targetAnnotationsCommon === null || targetAnnotationsCommon === void 0 ? void 0 : (_targetAnnotationsCom = targetAnnotationsCommon.DraftRoot) === null || _targetAnnotationsCom === void 0 ? void 0 : _targetAnnotationsCom.NewAction) || (targetAnnotationsSession === null || targetAnnotationsSession === void 0 ? void 0 : (_targetAnnotationsSes = targetAnnotationsSession.StickySessionSupported) === null || _targetAnnotationsSes === void 0 ? void 0 : _targetAnnotationsSes.NewAction);

      if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
        // A combination of 'CreationRow' and 'NewAction' does not make sense
        throw Error("Creation mode '".concat(CreationMode.CreationRow, "' can not be used with a custom 'new' action (").concat(newAction, ")"));
      }

      if (navigation !== null && navigation !== void 0 && navigation.route) {
        var _newAction;

        // route specified
        return {
          mode: tableManifestConfiguration.creationMode,
          append: tableManifestConfiguration.createAtEnd,
          newAction: (_newAction = newAction) === null || _newAction === void 0 ? void 0 : _newAction.toString(),
          navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode

        };
      }
    } // no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'


    if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
      var _originalTableSetting;

      tableManifestConfiguration.creationMode = CreationMode.Inline; // In case there was no specific configuration for the createAtEnd we force it to false

      if (((_originalTableSetting = originalTableSettings.creationMode) === null || _originalTableSetting === void 0 ? void 0 : _originalTableSetting.createAtEnd) === undefined) {
        tableManifestConfiguration.createAtEnd = false;
      }
    }

    return {
      mode: tableManifestConfiguration.creationMode,
      append: tableManifestConfiguration.createAtEnd,
      newAction: (_newAction2 = newAction) === null || _newAction2 === void 0 ? void 0 : _newAction2.toString()
    };
  }

  var _getRowConfigurationProperty = function (lineItemAnnotation, visualizationPath, converterContext, navigationSettings, targetPath) {
    var pressProperty, navigationTarget;
    var criticalityProperty = constant(MessageType.None);
    var targetEntityType = converterContext.getEntityType();

    if (navigationSettings && lineItemAnnotation) {
      var _navigationSettings$d, _navigationSettings$d2;

      navigationTarget = ((_navigationSettings$d = navigationSettings.display) === null || _navigationSettings$d === void 0 ? void 0 : _navigationSettings$d.target) || ((_navigationSettings$d2 = navigationSettings.detail) === null || _navigationSettings$d2 === void 0 ? void 0 : _navigationSettings$d2.outbound);

      if (navigationTarget) {
        pressProperty = ".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
      } else if (targetEntityType) {
        var _navigationSettings$d3;

        var targetEntitySet = converterContext.getEntitySet();
        navigationTarget = (_navigationSettings$d3 = navigationSettings.detail) === null || _navigationSettings$d3 === void 0 ? void 0 : _navigationSettings$d3.route;

        if (navigationTarget && !ModelHelper.isSingleton(targetEntitySet)) {
          var _lineItemAnnotation$a, _lineItemAnnotation$a2;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a === void 0 ? void 0 : (_lineItemAnnotation$a2 = _lineItemAnnotation$a.UI) === null || _lineItemAnnotation$a2 === void 0 ? void 0 : _lineItemAnnotation$a2.Criticality, !!ModelHelper.getDraftRoot(targetEntitySet) || !!ModelHelper.getDraftNode(targetEntitySet), targetEntityType);
          pressProperty = "API.onTableRowPress($event, $controller, ${$parameters>bindingContext}, { callExtension: true, targetPath: '" + targetPath + "', editable : " + (ModelHelper.getDraftRoot(targetEntitySet) || ModelHelper.getDraftNode(targetEntitySet) ? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')" : "undefined") + "})"; //Need to access to DraftRoot and DraftNode !!!!!!!
        } else {
          var _lineItemAnnotation$a3, _lineItemAnnotation$a4;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a3 = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a3 === void 0 ? void 0 : (_lineItemAnnotation$a4 = _lineItemAnnotation$a3.UI) === null || _lineItemAnnotation$a4 === void 0 ? void 0 : _lineItemAnnotation$a4.Criticality, false, targetEntityType);
        }
      }
    }

    var rowNavigatedExpression = formatResult([pathInModel("/deepestPath", "internal")], tableFormatters.navigatedRow, targetEntityType);
    return {
      press: pressProperty,
      action: pressProperty ? "Navigation" : undefined,
      rowHighlighting: compileExpression(criticalityProperty),
      rowNavigated: compileExpression(rowNavigatedExpression),
      visible: compileExpression(not(UI.IsInactive))
    };
  };
  /**
   * Retrieve the columns from the entityType.
   *
   * @param columnsToBeCreated The columns to be created.
   * @param entityType The target entity type.
   * @param annotationColumns The array of columns created based on LineItem annotations.
   * @param nonSortableColumns The array of all non sortable column names.
   * @param converterContext The converter context.
   * @param tableType The table type.
   * @returns The column from the entityType
   */


  var getColumnsFromEntityType = function (columnsToBeCreated, entityType) {
    var annotationColumns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var nonSortableColumns = arguments.length > 3 ? arguments[3] : undefined;
    var converterContext = arguments.length > 4 ? arguments[4] : undefined;
    var tableType = arguments.length > 5 ? arguments[5] : undefined;
    var tableColumns = annotationColumns; // Catch already existing columns - which were added before by LineItem Annotations

    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    entityType.entityProperties.forEach(function (property) {
      // Catch already existing columns - which were added before by LineItem Annotations
      var exists = annotationColumns.some(function (column) {
        return column.name === property.name;
      }); // if target type exists, it is a complex property and should be ignored

      if (!property.targetType && !exists && property.annotations.UI && !isReferencePropertyStaticallyHidden(property.annotations.UI.DataFieldDefault)) {
        var relatedPropertiesInfo = collectRelatedProperties(property.name, property, converterContext, true, tableType);
        var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);
        var additionalPropertyNames = Object.keys(relatedPropertiesInfo.additionalProperties);
        var columnInfo = getColumnDefinitionFromProperty(property, converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName), property.name, true, true, nonSortableColumns, aggregationHelper, converterContext);
        var semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [converterContext.getEntityType()])[0];
        var oColumnDraftIndicator = getDefaultDraftIndicatorForColumn(columnInfo.name, semanticKeys, false, null);

        if (Object.keys(oColumnDraftIndicator).length > 0) {
          columnInfo.formatOptions = _objectSpread({}, oColumnDraftIndicator);
        }

        if (relatedPropertyNames.length > 0) {
          columnInfo.propertyInfos = relatedPropertyNames;
          columnInfo.exportSettings = _objectSpread(_objectSpread({}, columnInfo.exportSettings), {}, {
            template: relatedPropertiesInfo.exportSettingsTemplate,
            wrap: relatedPropertiesInfo.exportSettingsWrapping
          });
          columnInfo.exportSettings.type = _getExportDataType(property.type, relatedPropertyNames.length > 1);

          if (relatedPropertiesInfo.exportUnitName) {
            columnInfo.exportSettings.unitProperty = relatedPropertiesInfo.exportUnitName;
            columnInfo.exportSettings.type = "Currency"; // Force to a currency because there's a unitProperty (otherwise the value isn't properly formatted when exported)
          } else if (relatedPropertiesInfo.exportUnitString) {
            columnInfo.exportSettings.unit = relatedPropertiesInfo.exportUnitString;
          }

          if (relatedPropertiesInfo.exportTimezoneName) {
            columnInfo.exportSettings.timezoneProperty = relatedPropertiesInfo.exportTimezoneName;
            columnInfo.exportSettings.utc = false;
          } else if (relatedPropertiesInfo.exportTimezoneString) {
            columnInfo.exportSettings.timezone = relatedPropertiesInfo.exportTimezoneString;
          } // Collect information of related columns to be created.


          relatedPropertyNames.forEach(function (name) {
            columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
          });
        }

        if (additionalPropertyNames.length > 0) {
          columnInfo.additionalPropertyInfos = additionalPropertyNames; // Create columns for additional properties identified for ALP use case.

          additionalPropertyNames.forEach(function (name) {
            // Intentional overwrite as we require only one new PropertyInfo for a related Property.
            columnsToBeCreated[name] = relatedPropertiesInfo.additionalProperties[name];
          });
        }

        tableColumns.push(columnInfo);
      } else if (getDisplayMode(property) === "Description") {
        tableColumns.push(getColumnDefinitionFromProperty(property, converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName), property.name, false, false, nonSortableColumns, aggregationHelper, converterContext));
      }
    }); // Create a propertyInfo for each related property.

    var relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);

    return tableColumns.concat(relatedColumns);
  };
  /**
   * Create a column definition from a property.
   *
   * @param property Entity type property for which the column is created
   * @param fullPropertyPath The full path to the target property
   * @param relativePath The relative path to the target property based on the context
   * @param useDataFieldPrefix Should be prefixed with "DataField::", else it will be prefixed with "Property::"
   * @param availableForAdaptation Decides whether the column should be available for adaptation
   * @param nonSortableColumns The array of all non-sortable column names
   * @param aggregationHelper The aggregationHelper for the entity
   * @param converterContext The converter context
   * @returns The annotation column definition
   */


  _exports.getColumnsFromEntityType = getColumnsFromEntityType;

  var getColumnDefinitionFromProperty = function (property, fullPropertyPath, relativePath, useDataFieldPrefix, availableForAdaptation, nonSortableColumns, aggregationHelper, converterContext) {
    var _property$annotations, _property$annotations2, _property$annotations3, _annotations2, _annotations2$UI, _annotations2$UI$Data, _annotations2$UI$Data2, _annotations2$UI$Data3, _annotations2$UI$Data4, _annotations3, _annotations3$UI;

    var name = useDataFieldPrefix ? relativePath : "Property::".concat(relativePath);
    var key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
    var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property);
    var isHidden = ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) === true;
    var groupPath = property.name ? _sliceAtSlash(property.name, true, false) : undefined;
    var isGroup = groupPath != property.name;
    var isDataPointFakeProperty = name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1;

    var exportType = _getExportDataType(property.type);

    var sDateInputFormat = property.type === "Edm.Date" ? "YYYY-MM-DD" : undefined;
    var dataType = getDataFieldDataType(property);
    var propertyTypeConfig = !isDataPointFakeProperty ? getTypeConfig(property, dataType) : undefined;
    var semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [converterContext.getEntityType()])[0];
    var sortable = !isHidden && nonSortableColumns.indexOf(relativePath) === -1 && !isDataPointFakeProperty;
    var oTypeConfig = !isDataPointFakeProperty ? {
      className: property.type || dataType,
      oFormatOptions: propertyTypeConfig.formatOptions,
      oConstraints: propertyTypeConfig.constraints
    } : undefined;
    var exportSettings = isDataPointFakeProperty ? {
      template: getTargetValueOnDataPoint(property)
    } : {
      type: exportType,
      inputFormat: sDateInputFormat,
      scale: property.scale,
      delimiter: property.type === "Edm.Int64"
    };

    if (!isDataPointFakeProperty) {
      var _property$annotations4, _property$annotations5, _property$annotations6, _property$annotations7, _property$annotations8, _property$annotations9;

      var oUnitProperty = getAssociatedCurrencyProperty(property) || getAssociatedUnitProperty(property);
      var oTimezoneProperty = getAssociatedTimezoneProperty(property);
      var sUnitText = (property === null || property === void 0 ? void 0 : (_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.Measures) === null || _property$annotations5 === void 0 ? void 0 : _property$annotations5.ISOCurrency) || (property === null || property === void 0 ? void 0 : (_property$annotations6 = property.annotations) === null || _property$annotations6 === void 0 ? void 0 : (_property$annotations7 = _property$annotations6.Measures) === null || _property$annotations7 === void 0 ? void 0 : _property$annotations7.Unit);
      var sTimezoneText = property === null || property === void 0 ? void 0 : (_property$annotations8 = property.annotations) === null || _property$annotations8 === void 0 ? void 0 : (_property$annotations9 = _property$annotations8.Common) === null || _property$annotations9 === void 0 ? void 0 : _property$annotations9.Timezone;

      if (oUnitProperty) {
        exportSettings.unitProperty = oUnitProperty.name;
        exportSettings.type = "Currency"; // Force to a currency because there's a unitProperty (otherwise the value isn't properly formatted when exported)
      } else if (sUnitText) {
        exportSettings.unit = "".concat(sUnitText);
      }

      if (oTimezoneProperty) {
        exportSettings.timezoneProperty = oTimezoneProperty.name;
        exportSettings.utc = false;
      } else if (sTimezoneText) {
        exportSettings.timezone = sTimezoneText.toString();
      }
    }

    var collectedNavigationPropertyLabels = _getCollectedNavigationPropertyLabels(relativePath, converterContext);

    var oColumn = {
      key: key,
      type: ColumnType.Annotation,
      label: getLabel(property, isGroup),
      groupLabel: isGroup ? getLabel(property) : null,
      group: isGroup ? groupPath : null,
      annotationPath: fullPropertyPath,
      semanticObjectPath: semanticObjectAnnotationPath,
      // A fake property was created for the TargetValue used on DataPoints, this property should be hidden and non sortable
      availability: !availableForAdaptation || isHidden || isDataPointFakeProperty ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
      name: name,
      relativePath: isDataPointFakeProperty ? ((_annotations2 = property.annotations) === null || _annotations2 === void 0 ? void 0 : (_annotations2$UI = _annotations2.UI) === null || _annotations2$UI === void 0 ? void 0 : (_annotations2$UI$Data = _annotations2$UI.DataFieldDefault) === null || _annotations2$UI$Data === void 0 ? void 0 : (_annotations2$UI$Data2 = _annotations2$UI$Data.Target) === null || _annotations2$UI$Data2 === void 0 ? void 0 : (_annotations2$UI$Data3 = _annotations2$UI$Data2.$target) === null || _annotations2$UI$Data3 === void 0 ? void 0 : (_annotations2$UI$Data4 = _annotations2$UI$Data3.Value) === null || _annotations2$UI$Data4 === void 0 ? void 0 : _annotations2$UI$Data4.path) || property.Value.path : relativePath,
      sortable: sortable,
      isGroupable: aggregationHelper.isAnalyticsSupported() ? aggregationHelper.isPropertyGroupable(property) : sortable,
      isKey: property.isKey,
      isDataPointFakeTargetProperty: isDataPointFakeProperty,
      exportSettings: exportSettings,
      caseSensitive: isFilteringCaseSensitive(converterContext),
      typeConfig: oTypeConfig,
      visualSettings: isDataPointFakeProperty ? {
        widthCalculation: null
      } : undefined,
      importance: getImportance((_annotations3 = property.annotations) === null || _annotations3 === void 0 ? void 0 : (_annotations3$UI = _annotations3.UI) === null || _annotations3$UI === void 0 ? void 0 : _annotations3$UI.DataFieldDefault, semanticKeys),
      additionalLabels: collectedNavigationPropertyLabels
    };

    var sTooltip = _getTooltip(property);

    if (sTooltip) {
      oColumn.tooltip = sTooltip;
    }

    return oColumn;
  };
  /**
   * Returns Boolean true for valid columns, false for invalid columns.
   *
   * @param dataField Different DataField types defined in the annotations
   * @returns True for valid columns, false for invalid columns
   * @private
   */


  var _isValidColumn = function (dataField) {
    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return !!dataField.Inline;

      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        return true;

      default: // Todo: Replace with proper Log statement once available
      //  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);

    }
  };
  /**
   * Returns the binding expression to evaluate the visibility of a DataField or DataPoint annotation.
   *
   * SAP Fiori elements will evaluate either the UI.Hidden annotation defined on the annotation itself or on the target property.
   *
   * @param dataFieldModelPath The metapath referring to the annotation that is evaluated by SAP Fiori elements.
   * @param [formatOptions] FormatOptions optional.
   * @param formatOptions.isAnalytics This flag is used to check if the analytic table has GroupHeader expanded.
   * @returns An expression that you can bind to the UI.
   */


  var _getVisibleExpression = function (dataFieldModelPath, formatOptions) {
    var _targetObject$Target, _targetObject$Target$, _targetObject$annotat, _targetObject$annotat2, _propertyValue$annota, _propertyValue$annota2;

    var targetObject = dataFieldModelPath.targetObject;
    var propertyValue;

    if (targetObject) {
      switch (targetObject.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        case "com.sap.vocabularies.UI.v1.DataPointType":
          propertyValue = targetObject.Value.$target;
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          // if it is a DataFieldForAnnotation pointing to a DataPoint we look at the dataPoint's value
          if ((targetObject === null || targetObject === void 0 ? void 0 : (_targetObject$Target = targetObject.Target) === null || _targetObject$Target === void 0 ? void 0 : (_targetObject$Target$ = _targetObject$Target.$target) === null || _targetObject$Target$ === void 0 ? void 0 : _targetObject$Target$.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
            var _targetObject$Target$2;

            propertyValue = (_targetObject$Target$2 = targetObject.Target.$target) === null || _targetObject$Target$2 === void 0 ? void 0 : _targetObject$Target$2.Value.$target;
          }

          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
        default:
          propertyValue = undefined;
      }
    }

    var isAnalyticalGroupHeaderExpanded = formatOptions !== null && formatOptions !== void 0 && formatOptions.isAnalytics ? UI.IsExpanded : constant(false);
    var isAnalyticalLeaf = formatOptions !== null && formatOptions !== void 0 && formatOptions.isAnalytics ? equal(UI.NodeLevel, 0) : constant(false); // A data field is visible if:
    // - the UI.Hidden expression in the original annotation does not evaluate to 'true'
    // - the UI.Hidden expression in the target property does not evaluate to 'true'
    // - in case of Analytics it's not visible for an expanded GroupHeader

    return and.apply(void 0, [not(equal(getExpressionFromAnnotation(targetObject === null || targetObject === void 0 ? void 0 : (_targetObject$annotat = targetObject.annotations) === null || _targetObject$annotat === void 0 ? void 0 : (_targetObject$annotat2 = _targetObject$annotat.UI) === null || _targetObject$annotat2 === void 0 ? void 0 : _targetObject$annotat2.Hidden), true)), ifElse(!!propertyValue, propertyValue && not(equal(getExpressionFromAnnotation((_propertyValue$annota = propertyValue.annotations) === null || _propertyValue$annota === void 0 ? void 0 : (_propertyValue$annota2 = _propertyValue$annota.UI) === null || _propertyValue$annota2 === void 0 ? void 0 : _propertyValue$annota2.Hidden), true)), true), or(not(isAnalyticalGroupHeaderExpanded), isAnalyticalLeaf)]);
  };
  /**
   * Returns hidden binding expressions for a field group.
   *
   * @param dataFieldGroup DataField defined in the annotations
   * @param fieldFormatOptions FormatOptions optional.
   * @param fieldFormatOptions.isAnalytics This flag is used to check if the analytic table has GroupHeader expanded.
   * @returns Compile binding of field group expressions.
   * @private
   */


  _exports._getVisibleExpression = _getVisibleExpression;

  var _getFieldGroupHiddenExpressions = function (dataFieldGroup, fieldFormatOptions) {
    var _dataFieldGroup$Targe, _dataFieldGroup$Targe2;

    var aFieldGroupHiddenExpressions = [];

    if (dataFieldGroup.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && ((_dataFieldGroup$Targe = dataFieldGroup.Target) === null || _dataFieldGroup$Targe === void 0 ? void 0 : (_dataFieldGroup$Targe2 = _dataFieldGroup$Targe.$target) === null || _dataFieldGroup$Targe2 === void 0 ? void 0 : _dataFieldGroup$Targe2.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
      var _dataFieldGroup$Targe3;

      (_dataFieldGroup$Targe3 = dataFieldGroup.Target.$target.Data) === null || _dataFieldGroup$Targe3 === void 0 ? void 0 : _dataFieldGroup$Targe3.forEach(function (innerDataField) {
        aFieldGroupHiddenExpressions.push(_getVisibleExpression({
          targetObject: innerDataField
        }, fieldFormatOptions));
      });
      return compileExpression(ifElse(or.apply(void 0, aFieldGroupHiddenExpressions), constant(true), constant(false)));
    } else {
      return undefined;
    }
  };
  /**
   * Returns the label for the property and dataField.
   *
   * @param [property] Property, DataField or Navigation Property defined in the annotations
   * @param isGroup
   * @returns Label of the property or DataField
   * @private
   */


  var getLabel = function (property) {
    var isGroup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!property) {
      return undefined;
    }

    if (isProperty(property) || isNavigationProperty(property)) {
      var _annotations4, _annotations4$UI, _dataFieldDefault$Lab, _property$annotations10, _property$annotations11;

      var dataFieldDefault = (_annotations4 = property.annotations) === null || _annotations4 === void 0 ? void 0 : (_annotations4$UI = _annotations4.UI) === null || _annotations4$UI === void 0 ? void 0 : _annotations4$UI.DataFieldDefault;

      if (dataFieldDefault && !dataFieldDefault.qualifier && (_dataFieldDefault$Lab = dataFieldDefault.Label) !== null && _dataFieldDefault$Lab !== void 0 && _dataFieldDefault$Lab.valueOf()) {
        var _dataFieldDefault$Lab2;

        return compileExpression(getExpressionFromAnnotation((_dataFieldDefault$Lab2 = dataFieldDefault.Label) === null || _dataFieldDefault$Lab2 === void 0 ? void 0 : _dataFieldDefault$Lab2.valueOf()));
      }

      return compileExpression(getExpressionFromAnnotation(((_property$annotations10 = property.annotations.Common) === null || _property$annotations10 === void 0 ? void 0 : (_property$annotations11 = _property$annotations10.Label) === null || _property$annotations11 === void 0 ? void 0 : _property$annotations11.valueOf()) || property.name));
    } else if (isDataFieldTypes(property)) {
      var _property$Label2, _property$Value, _property$Value$$targ, _property$Value$$targ2, _property$Value$$targ3, _property$Value$$targ4, _property$Value2, _property$Value2$$tar;

      if (!!isGroup && property.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation") {
        var _property$Label;

        return compileExpression(getExpressionFromAnnotation((_property$Label = property.Label) === null || _property$Label === void 0 ? void 0 : _property$Label.valueOf()));
      }

      return compileExpression(getExpressionFromAnnotation(((_property$Label2 = property.Label) === null || _property$Label2 === void 0 ? void 0 : _property$Label2.valueOf()) || ((_property$Value = property.Value) === null || _property$Value === void 0 ? void 0 : (_property$Value$$targ = _property$Value.$target) === null || _property$Value$$targ === void 0 ? void 0 : (_property$Value$$targ2 = _property$Value$$targ.annotations) === null || _property$Value$$targ2 === void 0 ? void 0 : (_property$Value$$targ3 = _property$Value$$targ2.Common) === null || _property$Value$$targ3 === void 0 ? void 0 : (_property$Value$$targ4 = _property$Value$$targ3.Label) === null || _property$Value$$targ4 === void 0 ? void 0 : _property$Value$$targ4.valueOf()) || ((_property$Value2 = property.Value) === null || _property$Value2 === void 0 ? void 0 : (_property$Value2$$tar = _property$Value2.$target) === null || _property$Value2$$tar === void 0 ? void 0 : _property$Value2$$tar.name)));
    } else if (property.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      var _property$Label3, _property$Target, _property$Target$$tar, _property$Target$$tar2, _property$Target$$tar3, _property$Target$$tar4, _property$Target$$tar5, _property$Target$$tar6;

      return compileExpression(getExpressionFromAnnotation(((_property$Label3 = property.Label) === null || _property$Label3 === void 0 ? void 0 : _property$Label3.valueOf()) || ((_property$Target = property.Target) === null || _property$Target === void 0 ? void 0 : (_property$Target$$tar = _property$Target.$target) === null || _property$Target$$tar === void 0 ? void 0 : (_property$Target$$tar2 = _property$Target$$tar.Value) === null || _property$Target$$tar2 === void 0 ? void 0 : (_property$Target$$tar3 = _property$Target$$tar2.$target) === null || _property$Target$$tar3 === void 0 ? void 0 : (_property$Target$$tar4 = _property$Target$$tar3.annotations) === null || _property$Target$$tar4 === void 0 ? void 0 : (_property$Target$$tar5 = _property$Target$$tar4.Common) === null || _property$Target$$tar5 === void 0 ? void 0 : (_property$Target$$tar6 = _property$Target$$tar5.Label) === null || _property$Target$$tar6 === void 0 ? void 0 : _property$Target$$tar6.valueOf())));
    } else {
      var _property$Label4;

      return compileExpression(getExpressionFromAnnotation((_property$Label4 = property.Label) === null || _property$Label4 === void 0 ? void 0 : _property$Label4.valueOf()));
    }
  };

  var _getTooltip = function (source) {
    var _source$annotations, _source$annotations$C;

    if (!source) {
      return undefined;
    }

    if (isProperty(source) || (_source$annotations = source.annotations) !== null && _source$annotations !== void 0 && (_source$annotations$C = _source$annotations.Common) !== null && _source$annotations$C !== void 0 && _source$annotations$C.QuickInfo) {
      var _source$annotations2, _source$annotations2$;

      return (_source$annotations2 = source.annotations) !== null && _source$annotations2 !== void 0 && (_source$annotations2$ = _source$annotations2.Common) !== null && _source$annotations2$ !== void 0 && _source$annotations2$.QuickInfo ? compileExpression(getExpressionFromAnnotation(source.annotations.Common.QuickInfo.valueOf())) : undefined;
    } else if (isDataFieldTypes(source)) {
      var _source$Value, _source$Value$$target, _source$Value$$target2, _source$Value$$target3;

      return (_source$Value = source.Value) !== null && _source$Value !== void 0 && (_source$Value$$target = _source$Value.$target) !== null && _source$Value$$target !== void 0 && (_source$Value$$target2 = _source$Value$$target.annotations) !== null && _source$Value$$target2 !== void 0 && (_source$Value$$target3 = _source$Value$$target2.Common) !== null && _source$Value$$target3 !== void 0 && _source$Value$$target3.QuickInfo ? compileExpression(getExpressionFromAnnotation(source.Value.$target.annotations.Common.QuickInfo.valueOf())) : undefined;
    } else if (source.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      var _source$Target, _datapointTarget$Valu, _datapointTarget$Valu2, _datapointTarget$Valu3, _datapointTarget$Valu4;

      var datapointTarget = (_source$Target = source.Target) === null || _source$Target === void 0 ? void 0 : _source$Target.$target;
      return datapointTarget !== null && datapointTarget !== void 0 && (_datapointTarget$Valu = datapointTarget.Value) !== null && _datapointTarget$Valu !== void 0 && (_datapointTarget$Valu2 = _datapointTarget$Valu.$target) !== null && _datapointTarget$Valu2 !== void 0 && (_datapointTarget$Valu3 = _datapointTarget$Valu2.annotations) !== null && _datapointTarget$Valu3 !== void 0 && (_datapointTarget$Valu4 = _datapointTarget$Valu3.Common) !== null && _datapointTarget$Valu4 !== void 0 && _datapointTarget$Valu4.QuickInfo ? compileExpression(getExpressionFromAnnotation(datapointTarget.Value.$target.annotations.Common.QuickInfo.valueOf())) : undefined;
    } else {
      return undefined;
    }
  };

  function getRowStatusVisibility(colName, isSemanticKeyInFieldGroup) {
    return formatResult([pathInModel("semanticKeyHasDraftIndicator", "internal"), pathInModel("filteredMessages", "internal"), colName, isSemanticKeyInFieldGroup], tableFormatters.getErrorStatusTextVisibilityFormatter);
  }
  /**
   * Creates a PropertyInfo for each identified property consumed by a LineItem.
   *
   * @param columnsToBeCreated Identified properties.
   * @param existingColumns The list of columns created for LineItems and Properties of entityType.
   * @param nonSortableColumns The array of column names which cannot be sorted.
   * @param converterContext The converter context.
   * @param entityType The entity type for the LineItem
   * @returns The array of columns created.
   */


  _exports.getRowStatusVisibility = getRowStatusVisibility;

  var _createRelatedColumns = function (columnsToBeCreated, existingColumns, nonSortableColumns, converterContext, entityType) {
    var relatedColumns = [];
    var relatedPropertyNameMap = {};
    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    Object.keys(columnsToBeCreated).forEach(function (name) {
      var property = columnsToBeCreated[name],
          annotationPath = converterContext.getAbsoluteAnnotationPath(name),
          // Check whether the related column already exists.
      relatedColumn = existingColumns.find(function (column) {
        return column.name === name;
      });

      if (relatedColumn === undefined) {
        // Case 1: Key contains DataField prefix to ensure all property columns have the same key format.
        // New created property column is set to hidden.
        relatedColumns.push(getColumnDefinitionFromProperty(property, annotationPath, name, true, false, nonSortableColumns, aggregationHelper, converterContext));
      } else if (relatedColumn.annotationPath !== annotationPath || relatedColumn.propertyInfos) {
        // Case 2: The existing column points to a LineItem (or)
        // Case 3: This is a self reference from an existing column
        var newName = "Property::".concat(name); // Checking whether the related property column has already been created in a previous iteration.

        if (!existingColumns.some(function (column) {
          return column.name === newName;
        })) {
          // Create a new property column with 'Property::' prefix,
          // Set it to hidden as it is only consumed by Complex property infos.
          var column = getColumnDefinitionFromProperty(property, annotationPath, name, false, false, nonSortableColumns, aggregationHelper, converterContext);
          column.isPartOfLineItem = relatedColumn.isPartOfLineItem;
          relatedColumns.push(column);
          relatedPropertyNameMap[name] = newName;
        } else if (existingColumns.some(function (column) {
          return column.name === newName;
        }) && existingColumns.some(function (column) {
          var _column$propertyInfos;

          return (_column$propertyInfos = column.propertyInfos) === null || _column$propertyInfos === void 0 ? void 0 : _column$propertyInfos.includes(name);
        })) {
          relatedPropertyNameMap[name] = newName;
        }
      }
    }); // The property 'name' has been prefixed with 'Property::' for uniqueness.
    // Update the same in other propertyInfos[] references which point to this property.

    existingColumns.forEach(function (column) {
      var _column$propertyInfos2, _column$additionalPro;

      column.propertyInfos = (_column$propertyInfos2 = column.propertyInfos) === null || _column$propertyInfos2 === void 0 ? void 0 : _column$propertyInfos2.map(function (propertyInfo) {
        var _relatedPropertyNameM;

        return (_relatedPropertyNameM = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM !== void 0 ? _relatedPropertyNameM : propertyInfo;
      });
      column.additionalPropertyInfos = (_column$additionalPro = column.additionalPropertyInfos) === null || _column$additionalPro === void 0 ? void 0 : _column$additionalPro.map(function (propertyInfo) {
        var _relatedPropertyNameM2;

        return (_relatedPropertyNameM2 = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM2 !== void 0 ? _relatedPropertyNameM2 : propertyInfo;
      });
    });
    return relatedColumns;
  };
  /**
   * Getting the Column Name
   * If it points to a DataField with one property or DataPoint with one property, it will use the property name
   * here to be consistent with the existing flex changes.
   *
   * @param dataField Different DataField types defined in the annotations
   * @returns The name of annotation columns
   * @private
   */


  var _getAnnotationColumnName = function (dataField) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    // This is needed as we have flexibility changes already that we have to check against
    if (isDataFieldTypes(dataField)) {
      var _dataField$Value;

      return (_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : _dataField$Value.path;
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && (_dataField$Target = dataField.Target) !== null && _dataField$Target !== void 0 && (_dataField$Target$$ta = _dataField$Target.$target) !== null && _dataField$Target$$ta !== void 0 && (_dataField$Target$$ta2 = _dataField$Target$$ta.Value) !== null && _dataField$Target$$ta2 !== void 0 && _dataField$Target$$ta2.path) {
      var _dataField$Target2, _dataField$Target2$$t;

      // This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
      return (_dataField$Target2 = dataField.Target) === null || _dataField$Target2 === void 0 ? void 0 : (_dataField$Target2$$t = _dataField$Target2.$target) === null || _dataField$Target2$$t === void 0 ? void 0 : _dataField$Target2$$t.Value.path;
    } else {
      return KeyHelper.generateKeyFromDataField(dataField);
    }
  };
  /**
   * Determines if the data field labels have to be displayed in the table.
   *
   * @param fieldGroupName The `DataField` name being processed.
   * @param visualizationPath
   * @param converterContext
   * @returns `showDataFieldsLabel` value from the manifest
   * @private
   */


  var _getShowDataFieldsLabel = function (fieldGroupName, visualizationPath, converterContext) {
    var _converterContext$get15;

    var oColumns = (_converterContext$get15 = converterContext.getManifestControlConfiguration(visualizationPath)) === null || _converterContext$get15 === void 0 ? void 0 : _converterContext$get15.columns;
    var aColumnKeys = oColumns && Object.keys(oColumns);
    return aColumnKeys && !!aColumnKeys.find(function (key) {
      return key === fieldGroupName && oColumns[key].showDataFieldsLabel;
    });
  };
  /**
   * Determines the relative path of the property with respect to the root entity.
   *
   * @param dataField The `DataField` being processed.
   * @returns The relative path
   */


  var _getRelativePath = function (dataField) {
    var _Value, _dataField$Target3;

    var relativePath = "";

    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        relativePath = dataField === null || dataField === void 0 ? void 0 : (_Value = dataField.Value) === null || _Value === void 0 ? void 0 : _Value.path;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        relativePath = dataField === null || dataField === void 0 ? void 0 : (_dataField$Target3 = dataField.Target) === null || _dataField$Target3 === void 0 ? void 0 : _dataField$Target3.value;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
      case "com.sap.vocabularies.UI.v1.DataFieldForActionGroup":
      case "com.sap.vocabularies.UI.v1.DataFieldWithActionGroup":
        relativePath = KeyHelper.generateKeyFromDataField(dataField);
        break;
    }

    return relativePath;
  };

  var _sliceAtSlash = function (path, isLastSlash, isLastPart) {
    var iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

    if (iSlashIndex === -1) {
      return path;
    }

    return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
  };
  /**
   * Determine whether a column is sortable.
   *
   * @param dataField The data field being processed
   * @param propertyPath The property path
   * @param nonSortableColumns Collection of non-sortable column names as per annotation
   * @returns True if the column is sortable
   */


  var _isColumnSortable = function (dataField, propertyPath, nonSortableColumns) {
    return nonSortableColumns.indexOf(propertyPath) === -1 && ( // Column is not marked as non-sortable via annotation
    dataField.$Type === "com.sap.vocabularies.UI.v1.DataField" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction");
  };
  /**
   * Returns whether filtering on the table is case sensitive.
   *
   * @param converterContext The instance of the converter context
   * @returns Returns 'false' if FilterFunctions annotation supports 'tolower', else 'true'
   */


  var isFilteringCaseSensitive = function (converterContext) {
    var filterFunctions = _getFilterFunctions(converterContext);

    return Array.isArray(filterFunctions) ? filterFunctions.indexOf("tolower") === -1 : true;
  };

  _exports.isFilteringCaseSensitive = isFilteringCaseSensitive;

  function _getFilterFunctions(ConverterContext) {
    var _ConverterContext$get, _ConverterContext$get2, _ConverterContext$get3, _ConverterContext$get4, _ConverterContext$get5;

    if (ModelHelper.isSingleton(ConverterContext.getEntitySet())) {
      return undefined;
    }

    var capabilities = (_ConverterContext$get = ConverterContext.getEntitySet()) === null || _ConverterContext$get === void 0 ? void 0 : (_ConverterContext$get2 = _ConverterContext$get.annotations) === null || _ConverterContext$get2 === void 0 ? void 0 : _ConverterContext$get2.Capabilities;
    return (capabilities === null || capabilities === void 0 ? void 0 : capabilities.FilterFunctions) || ((_ConverterContext$get3 = ConverterContext.getEntityContainer()) === null || _ConverterContext$get3 === void 0 ? void 0 : (_ConverterContext$get4 = _ConverterContext$get3.annotations) === null || _ConverterContext$get4 === void 0 ? void 0 : (_ConverterContext$get5 = _ConverterContext$get4.Capabilities) === null || _ConverterContext$get5 === void 0 ? void 0 : _ConverterContext$get5.FilterFunctions);
  }
  /**
   * Returns default format options for text fields in a table.
   *
   * @param formatOptions
   * @returns Collection of format options with default values
   */


  function _getDefaultFormatOptionsForTable(formatOptions) {
    return formatOptions === undefined ? undefined : _objectSpread({
      textLinesEdit: 4
    }, formatOptions);
  }

  function _findSemanticKeyValues(semanticKeys, name) {
    var aSemanticKeyValues = [];
    var bSemanticKeyFound = false;

    for (var i = 0; i < semanticKeys.length; i++) {
      aSemanticKeyValues.push(semanticKeys[i].value);

      if (semanticKeys[i].value === name) {
        bSemanticKeyFound = true;
      }
    }

    return {
      values: aSemanticKeyValues,
      semanticKeyFound: bSemanticKeyFound
    };
  }

  function _findProperties(semanticKeyValues, fieldGroupProperties) {
    var semanticKeyHasPropertyInFieldGroup = false;
    var sPropertyPath;

    if (semanticKeyValues && semanticKeyValues.length >= 1 && fieldGroupProperties && fieldGroupProperties.length >= 1) {
      for (var i = 0; i < semanticKeyValues.length; i++) {
        if ([semanticKeyValues[i]].some(function (tmp) {
          return fieldGroupProperties.indexOf(tmp) >= 0;
        })) {
          semanticKeyHasPropertyInFieldGroup = true;
          sPropertyPath = semanticKeyValues[i];
          break;
        }
      }
    }

    return {
      semanticKeyHasPropertyInFieldGroup: semanticKeyHasPropertyInFieldGroup,
      fieldGroupPropertyPath: sPropertyPath
    };
  }

  function _findSemanticKeyValuesInFieldGroup(dataFieldGroup, semanticKeyValues) {
    var _dataFieldGroup$Targe4, _dataFieldGroup$Targe5;

    var aProperties = [];
    var _propertiesFound = {
      semanticKeyHasPropertyInFieldGroup: false,
      fieldGroupPropertyPath: undefined
    };

    if (dataFieldGroup && dataFieldGroup.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && ((_dataFieldGroup$Targe4 = dataFieldGroup.Target) === null || _dataFieldGroup$Targe4 === void 0 ? void 0 : (_dataFieldGroup$Targe5 = _dataFieldGroup$Targe4.$target) === null || _dataFieldGroup$Targe5 === void 0 ? void 0 : _dataFieldGroup$Targe5.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
      var _dataFieldGroup$Targe6;

      (_dataFieldGroup$Targe6 = dataFieldGroup.Target.$target.Data) === null || _dataFieldGroup$Targe6 === void 0 ? void 0 : _dataFieldGroup$Targe6.forEach(function (innerDataField) {
        if ((innerDataField.$Type === "com.sap.vocabularies.UI.v1.DataField" || innerDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") && innerDataField.Value) {
          aProperties.push(innerDataField.Value.path);
        }

        _propertiesFound = _findProperties(semanticKeyValues, aProperties);
      });
    }

    return {
      semanticKeyHasPropertyInFieldGroup: _propertiesFound.semanticKeyHasPropertyInFieldGroup,
      propertyPath: _propertiesFound.fieldGroupPropertyPath
    };
  }
  /**
   * Returns default format options with draftIndicator for a column.
   *
   * @param name
   * @param semanticKeys
   * @param isFieldGroupColumn
   * @param dataFieldGroup
   * @returns Collection of format options with default values
   */


  function getDefaultDraftIndicatorForColumn(name, semanticKeys, isFieldGroupColumn, dataFieldGroup) {
    if (!semanticKeys) {
      return {};
    }

    var semanticKey = _findSemanticKeyValues(semanticKeys, name);

    var semanticKeyInFieldGroup = _findSemanticKeyValuesInFieldGroup(dataFieldGroup, semanticKey.values);

    if (semanticKey.semanticKeyFound) {
      var formatOptionsObj = {
        hasDraftIndicator: true,
        semantickeys: semanticKey.values,
        objectStatusTextVisibility: compileExpression(getRowStatusVisibility(name, false))
      };

      if (isFieldGroupColumn && semanticKeyInFieldGroup.semanticKeyHasPropertyInFieldGroup) {
        formatOptionsObj["objectStatusTextVisibility"] = compileExpression(getRowStatusVisibility(name, true));
        formatOptionsObj["fieldGroupDraftIndicatorPropertyPath"] = semanticKeyInFieldGroup.propertyPath;
      }

      return formatOptionsObj;
    } else if (!semanticKeyInFieldGroup.semanticKeyHasPropertyInFieldGroup) {
      return {};
    } else {
      // Semantic Key has a property in a FieldGroup
      return {
        fieldGroupDraftIndicatorPropertyPath: semanticKeyInFieldGroup.propertyPath,
        fieldGroupName: name,
        objectStatusTextVisibility: compileExpression(getRowStatusVisibility(name, true))
      };
    }
  }

  function _getImpNumber(dataField) {
    var _dataField$annotation20, _dataField$annotation21;

    var importance = dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation20 = dataField.annotations) === null || _dataField$annotation20 === void 0 ? void 0 : (_dataField$annotation21 = _dataField$annotation20.UI) === null || _dataField$annotation21 === void 0 ? void 0 : _dataField$annotation21.Importance;

    if (importance && importance.includes("UI.ImportanceType/High")) {
      return 3;
    }

    if (importance && importance.includes("UI.ImportanceType/Medium")) {
      return 2;
    }

    if (importance && importance.includes("UI.ImportanceType/Low")) {
      return 1;
    }

    return 0;
  }

  function _getDataFieldImportance(dataField) {
    var _dataField$annotation22, _dataField$annotation23;

    var importance = dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation22 = dataField.annotations) === null || _dataField$annotation22 === void 0 ? void 0 : (_dataField$annotation23 = _dataField$annotation22.UI) === null || _dataField$annotation23 === void 0 ? void 0 : _dataField$annotation23.Importance;
    return importance ? importance.split("/")[1] : Importance.None;
  }

  function _getMaxImportance(fields) {
    if (fields && fields.length > 0) {
      var maxImpNumber = -1;
      var impNumber = -1;
      var DataFieldWithMaxImportance;

      var _iterator = _createForOfIteratorHelper(fields),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var field = _step.value;
          impNumber = _getImpNumber(field);

          if (impNumber > maxImpNumber) {
            maxImpNumber = impNumber;
            DataFieldWithMaxImportance = field;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return _getDataFieldImportance(DataFieldWithMaxImportance);
    }

    return Importance.None;
  }
  /**
   * Returns the importance value for a column.
   *
   * @param dataField
   * @param semanticKeys
   * @returns The importance value
   */


  function getImportance(dataField, semanticKeys) {
    var _Value4;

    //Evaluate default Importance is not set explicitly
    var fieldsWithImportance, mapSemanticKeys; //Check if semanticKeys are defined at the EntitySet level

    if (semanticKeys && semanticKeys.length > 0) {
      mapSemanticKeys = semanticKeys.map(function (key) {
        return key.value;
      });
    }

    if (!dataField) {
      return undefined;
    }

    if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      var fieldGroupData = dataField.Target["$target"]["Data"],
          fieldGroupHasSemanticKey = fieldGroupData && fieldGroupData.some(function (fieldGroupDataField) {
        var _Value2, _Value3;

        return (fieldGroupDataField === null || fieldGroupDataField === void 0 ? void 0 : (_Value2 = fieldGroupDataField.Value) === null || _Value2 === void 0 ? void 0 : _Value2.path) && fieldGroupDataField.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && mapSemanticKeys && mapSemanticKeys.includes(fieldGroupDataField === null || fieldGroupDataField === void 0 ? void 0 : (_Value3 = fieldGroupDataField.Value) === null || _Value3 === void 0 ? void 0 : _Value3.path);
      }); //If a FieldGroup contains a semanticKey, importance set to High

      if (fieldGroupHasSemanticKey) {
        return Importance.High;
      } else {
        var _dataField$annotation24, _dataField$annotation25;

        //If the DataFieldForAnnotation has an Importance we take it
        if (dataField !== null && dataField !== void 0 && (_dataField$annotation24 = dataField.annotations) !== null && _dataField$annotation24 !== void 0 && (_dataField$annotation25 = _dataField$annotation24.UI) !== null && _dataField$annotation25 !== void 0 && _dataField$annotation25.Importance) {
          return _getDataFieldImportance(dataField);
        } // else the highest importance (if any) is returned


        fieldsWithImportance = fieldGroupData && fieldGroupData.filter(function (item) {
          var _item$annotations, _item$annotations$UI;

          return item === null || item === void 0 ? void 0 : (_item$annotations = item.annotations) === null || _item$annotations === void 0 ? void 0 : (_item$annotations$UI = _item$annotations.UI) === null || _item$annotations$UI === void 0 ? void 0 : _item$annotations$UI.Importance;
        });
        return _getMaxImportance(fieldsWithImportance);
      } //If the current field is a semanticKey, importance set to High

    }

    return dataField.Value && dataField !== null && dataField !== void 0 && (_Value4 = dataField.Value) !== null && _Value4 !== void 0 && _Value4.path && mapSemanticKeys && mapSemanticKeys.includes(dataField.Value.path) ? Importance.High : _getDataFieldImportance(dataField);
  }
  /**
   * Returns line items from metadata annotations.
   *
   * @param lineItemAnnotation Collection of data fields with their annotations
   * @param visualizationPath The visualization path
   * @param converterContext The converter context
   * @returns The columns from the annotations
   */


  _exports.getImportance = getImportance;

  var getColumnsFromAnnotations = function (lineItemAnnotation, visualizationPath, converterContext) {
    var _tableManifestSetting2;

    var entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
        annotationColumns = [],
        columnsToBeCreated = {},
        nonSortableColumns = getNonSortablePropertiesRestrictions(converterContext.getEntitySet()),
        tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath),
        tableType = (tableManifestSettings === null || tableManifestSettings === void 0 ? void 0 : (_tableManifestSetting2 = tableManifestSettings.tableSettings) === null || _tableManifestSetting2 === void 0 ? void 0 : _tableManifestSetting2.type) || "ResponsiveTable";
    var semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [converterContext.getEntityType()])[0];

    if (lineItemAnnotation) {
      lineItemAnnotation.forEach(function (lineItem) {
        var _lineItem$Value, _lineItem$Value$$targ, _lineItem$Target, _lineItem$Target$$tar, _lineItem$Target2, _lineItem$Target2$$ta, _lineItem$annotations, _lineItem$annotations2, _lineItem$annotations3;

        if (!_isValidColumn(lineItem)) {
          return;
        }

        var semanticObjectAnnotationPath = isDataFieldTypes(lineItem) && (_lineItem$Value = lineItem.Value) !== null && _lineItem$Value !== void 0 && (_lineItem$Value$$targ = _lineItem$Value.$target) !== null && _lineItem$Value$$targ !== void 0 && _lineItem$Value$$targ.fullyQualifiedName ? getSemanticObjectPath(converterContext, lineItem) : undefined;

        var relativePath = _getRelativePath(lineItem);

        var relatedPropertyNames; // Determine properties which are consumed by this LineItem.

        var relatedPropertiesInfo = collectRelatedPropertiesRecursively(lineItem, converterContext, tableType);
        var relatedProperties = relatedPropertiesInfo.properties;

        if (lineItem.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && ((_lineItem$Target = lineItem.Target) === null || _lineItem$Target === void 0 ? void 0 : (_lineItem$Target$$tar = _lineItem$Target.$target) === null || _lineItem$Target$$tar === void 0 ? void 0 : _lineItem$Target$$tar.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
          relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties).filter(function (key) {
            var _relatedProperties$ke;

            var isStaticallyHidden;

            if ((_relatedProperties$ke = relatedProperties[key].annotations) !== null && _relatedProperties$ke !== void 0 && _relatedProperties$ke.UI) {
              var _relatedProperties$ke2, _relatedProperties$ke3;

              isStaticallyHidden = isReferencePropertyStaticallyHidden((_relatedProperties$ke2 = relatedProperties[key].annotations) === null || _relatedProperties$ke2 === void 0 ? void 0 : (_relatedProperties$ke3 = _relatedProperties$ke2.UI) === null || _relatedProperties$ke3 === void 0 ? void 0 : _relatedProperties$ke3.DataFieldDefault);
            } else {
              isStaticallyHidden = isReferencePropertyStaticallyHidden(relatedProperties[key]);
            }

            return !isStaticallyHidden;
          });
        } else {
          relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);
        }

        var additionalPropertyNames = Object.keys(relatedPropertiesInfo.additionalProperties);

        var groupPath = _sliceAtSlash(relativePath, true, false);

        var isGroup = groupPath != relativePath;
        var sLabel = getLabel(lineItem, isGroup);

        var name = _getAnnotationColumnName(lineItem);

        var isFieldGroupColumn = groupPath.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1;
        var showDataFieldsLabel = isFieldGroupColumn ? _getShowDataFieldsLabel(name, visualizationPath, converterContext) : false;
        var dataType = getDataFieldDataType(lineItem);
        var sDateInputFormat = dataType === "Edm.Date" ? "YYYY-MM-DD" : undefined;

        var formatOptions = _getDefaultFormatOptionsForTable(getDefaultDraftIndicatorForColumn(name, semanticKeys, isFieldGroupColumn, lineItem));

        var fieldGroupHiddenExpressions;

        if (lineItem.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && ((_lineItem$Target2 = lineItem.Target) === null || _lineItem$Target2 === void 0 ? void 0 : (_lineItem$Target2$$ta = _lineItem$Target2.$target) === null || _lineItem$Target2$$ta === void 0 ? void 0 : _lineItem$Target2$$ta.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
          fieldGroupHiddenExpressions = _getFieldGroupHiddenExpressions(lineItem, formatOptions);
        }

        var exportSettings = {
          template: relatedPropertiesInfo.exportSettingsTemplate,
          wrap: relatedPropertiesInfo.exportSettingsWrapping,
          type: dataType ? _getExportDataType(dataType, relatedPropertyNames.length > 1) : undefined,
          inputFormat: sDateInputFormat,
          delimiter: dataType === "Edm.Int64"
        };

        if (relatedPropertiesInfo.exportUnitName) {
          exportSettings.unitProperty = relatedPropertiesInfo.exportUnitName;
          exportSettings.type = "Currency"; // Force to a currency because there's a unitProperty (otherwise the value isn't properly formatted when exported)
        } else if (relatedPropertiesInfo.exportUnitString) {
          exportSettings.unit = relatedPropertiesInfo.exportUnitString;
        }

        if (relatedPropertiesInfo.exportTimezoneName) {
          exportSettings.timezoneProperty = relatedPropertiesInfo.exportTimezoneName;
        } else if (relatedPropertiesInfo.exportTimezoneString) {
          exportSettings.timezone = relatedPropertiesInfo.exportTimezoneString;
        }

        var propertyTypeConfig = dataType && getTypeConfig(lineItem, dataType);
        var oTypeConfig = propertyTypeConfig ? {
          className: dataType,
          oFormatOptions: _objectSpread(_objectSpread({}, formatOptions), propertyTypeConfig.formatOptions),
          oConstraints: propertyTypeConfig.constraints
        } : undefined;
        var visualSettings = {};

        if (!dataType || !oTypeConfig) {
          // for charts
          visualSettings.widthCalculation = null;
        }

        var oColumn = {
          key: KeyHelper.generateKeyFromDataField(lineItem),
          type: ColumnType.Annotation,
          label: sLabel,
          groupLabel: isGroup ? getLabel(lineItem) : null,
          group: isGroup ? groupPath : null,
          FieldGroupHiddenExpressions: fieldGroupHiddenExpressions,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
          semanticObjectPath: semanticObjectAnnotationPath,
          availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
          name: name,
          showDataFieldsLabel: showDataFieldsLabel,
          relativePath: relativePath,
          sortable: _isColumnSortable(lineItem, relativePath, nonSortableColumns),
          propertyInfos: relatedPropertyNames.length ? relatedPropertyNames : undefined,
          additionalPropertyInfos: additionalPropertyNames.length > 0 ? additionalPropertyNames : undefined,
          exportSettings: exportSettings,
          width: ((_lineItem$annotations = lineItem.annotations) === null || _lineItem$annotations === void 0 ? void 0 : (_lineItem$annotations2 = _lineItem$annotations.HTML5) === null || _lineItem$annotations2 === void 0 ? void 0 : (_lineItem$annotations3 = _lineItem$annotations2.CssDefaults) === null || _lineItem$annotations3 === void 0 ? void 0 : _lineItem$annotations3.width) || undefined,
          importance: getImportance(lineItem, semanticKeys),
          isNavigable: true,
          formatOptions: formatOptions,
          caseSensitive: isFilteringCaseSensitive(converterContext),
          typeConfig: oTypeConfig,
          visualSettings: visualSettings,
          timezoneText: exportSettings.timezone,
          isPartOfLineItem: true
        };

        var sTooltip = _getTooltip(lineItem);

        if (sTooltip) {
          oColumn.tooltip = sTooltip;
        }

        annotationColumns.push(oColumn); // Collect information of related columns to be created.

        relatedPropertyNames.forEach(function (relatedPropertyName) {
          columnsToBeCreated[relatedPropertyName] = relatedPropertiesInfo.properties[relatedPropertyName];
        }); // Create columns for additional properties identified for ALP use case.

        additionalPropertyNames.forEach(function (additionalPropertyName) {
          // Intentional overwrite as we require only one new PropertyInfo for a related Property.
          columnsToBeCreated[additionalPropertyName] = relatedPropertiesInfo.additionalProperties[additionalPropertyName];
        });
      });
    } // Get columns from the Properties of EntityType


    return getColumnsFromEntityType(columnsToBeCreated, entityType, annotationColumns, nonSortableColumns, converterContext, tableType);
  };
  /**
   * Gets the property names from the manifest and checks against existing properties already added by annotations.
   * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
   *
   * @param properties
   * @param annotationColumns
   * @param converterContext
   * @param entityType
   * @returns The columns from the annotations
   */


  var _getPropertyNames = function (properties, annotationColumns, converterContext, entityType) {
    var matchedProperties;

    if (properties) {
      matchedProperties = properties.map(function (propertyPath) {
        var annotationColumn = annotationColumns.find(function (annotationColumn) {
          return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
        });

        if (annotationColumn) {
          return annotationColumn.name;
        } else {
          var relatedColumns = _createRelatedColumns(_defineProperty({}, propertyPath, entityType.resolvePath(propertyPath)), annotationColumns, [], converterContext, entityType);

          annotationColumns.push(relatedColumns[0]);
          return relatedColumns[0].name;
        }
      });
    }

    return matchedProperties;
  };

  var _appendCustomTemplate = function (properties) {
    return properties.map(function (property) {
      return "{".concat(properties.indexOf(property), "}");
    }).join("\n");
  };
  /**
   * Returns table column definitions from manifest.
   *
   * These may be custom columns defined in the manifest, slot columns coming through
   * a building block, or annotation columns to overwrite annotation-based columns.
   *
   * @param columns
   * @param annotationColumns
   * @param converterContext
   * @param entityType
   * @param navigationSettings
   * @returns The columns from the manifest
   */


  var getColumnsFromManifest = function (columns, annotationColumns, converterContext, entityType, navigationSettings) {
    var internalColumns = {};

    function isAnnotationColumn(column, key) {
      return annotationColumns.some(function (annotationColumn) {
        return annotationColumn.key === key;
      });
    }

    function isSlotColumn(manifestColumn) {
      return manifestColumn.type === ColumnType.Slot;
    }

    function isCustomColumn(manifestColumn) {
      return manifestColumn.type === undefined && !!manifestColumn.template;
    }

    for (var key in columns) {
      var _manifestColumn$posit;

      var manifestColumn = columns[key];
      KeyHelper.validateKey(key); // BaseTableColumn

      var baseTableColumn = {
        key: key,
        width: manifestColumn.width || undefined,
        position: {
          anchor: (_manifestColumn$posit = manifestColumn.position) === null || _manifestColumn$posit === void 0 ? void 0 : _manifestColumn$posit.anchor,
          placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
        },
        caseSensitive: isFilteringCaseSensitive(converterContext)
      };

      if (isAnnotationColumn(manifestColumn, key)) {
        var propertiesToOverwriteAnnotationColumn = _objectSpread(_objectSpread({}, baseTableColumn), {}, {
          importance: manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.importance,
          horizontalAlign: manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.horizontalAlign,
          availability: manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.availability,
          type: ColumnType.Annotation,
          isNavigable: isAnnotationColumn(manifestColumn, key) ? undefined : isActionNavigable(manifestColumn, navigationSettings, true),
          settings: manifestColumn.settings,
          formatOptions: _getDefaultFormatOptionsForTable(manifestColumn.formatOptions)
        });

        internalColumns[key] = propertiesToOverwriteAnnotationColumn;
      } else {
        var propertyInfos = _getPropertyNames(manifestColumn.properties, annotationColumns, converterContext, entityType);

        var baseManifestColumn = _objectSpread(_objectSpread({}, baseTableColumn), {}, {
          header: manifestColumn.header,
          importance: (manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.importance) || Importance.None,
          horizontalAlign: (manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.horizontalAlign) || HorizontalAlign.Begin,
          availability: (manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.availability) || AvailabilityType.Default,
          template: manifestColumn.template,
          propertyInfos: propertyInfos,
          exportSettings: propertyInfos ? {
            template: _appendCustomTemplate(propertyInfos),
            wrap: !!(propertyInfos.length > 1)
          } : null,
          id: "CustomColumn::".concat(key),
          name: "CustomColumn::".concat(key),
          //Needed for MDC:
          formatOptions: {
            textLinesEdit: 4
          },
          isGroupable: false,
          isNavigable: false,
          sortable: false,
          visualSettings: {
            widthCalculation: null
          }
        });

        if (isSlotColumn(manifestColumn)) {
          var customTableColumn = _objectSpread(_objectSpread({}, baseManifestColumn), {}, {
            type: ColumnType.Slot
          });

          internalColumns[key] = customTableColumn;
        } else if (isCustomColumn(manifestColumn)) {
          var _customTableColumn = _objectSpread(_objectSpread({}, baseManifestColumn), {}, {
            type: ColumnType.Default
          });

          internalColumns[key] = _customTableColumn;
        } else {
          var _IssueCategoryType$An;

          var message = "The annotation column '".concat(key, "' referenced in the manifest is not found");
          converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.Low, message, IssueCategoryType, IssueCategoryType === null || IssueCategoryType === void 0 ? void 0 : (_IssueCategoryType$An = IssueCategoryType.AnnotationColumns) === null || _IssueCategoryType$An === void 0 ? void 0 : _IssueCategoryType$An.InvalidKey);
        }
      }
    }

    return internalColumns;
  };

  function getP13nMode(visualizationPath, converterContext, tableManifestConfiguration) {
    var _tableManifestSetting3;

    var manifestWrapper = converterContext.getManifestWrapper();
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var variantManagement = manifestWrapper.getVariantManagement();
    var aPersonalization = [];
    var isAnalyticalTable = tableManifestConfiguration.type === "AnalyticalTable";
    var isResponsiveTable = tableManifestConfiguration.type === "ResponsiveTable";

    if ((tableManifestSettings === null || tableManifestSettings === void 0 ? void 0 : (_tableManifestSetting3 = tableManifestSettings.tableSettings) === null || _tableManifestSetting3 === void 0 ? void 0 : _tableManifestSetting3.personalization) !== undefined) {
      // Personalization configured in manifest.
      var personalization = tableManifestSettings.tableSettings.personalization;

      if (personalization === true) {
        // Table personalization fully enabled.
        switch (tableManifestConfiguration.type) {
          case "AnalyticalTable":
            return "Sort,Column,Filter,Group,Aggregate";

          case "ResponsiveTable":
            return "Sort,Column,Filter,Group";

          default:
            return "Sort,Column,Filter";
        }
      } else if (typeof personalization === "object") {
        // Specific personalization options enabled in manifest. Use them as is.
        if (personalization.sort) {
          aPersonalization.push("Sort");
        }

        if (personalization.column) {
          aPersonalization.push("Column");
        }

        if (personalization.filter) {
          aPersonalization.push("Filter");
        }

        if (personalization.group && (isAnalyticalTable || isResponsiveTable)) {
          aPersonalization.push("Group");
        }

        if (personalization.aggregate && isAnalyticalTable) {
          aPersonalization.push("Aggregate");
        }

        return aPersonalization.length > 0 ? aPersonalization.join(",") : undefined;
      }
    } else {
      // No personalization configured in manifest.
      aPersonalization.push("Sort");
      aPersonalization.push("Column");

      if (converterContext.getTemplateType() === TemplateType.ListReport) {
        if (variantManagement === VariantManagementType.Control || _isFilterBarHidden(manifestWrapper, converterContext)) {
          // Feature parity with V2.
          // Enable table filtering by default only in case of Control level variant management.
          // Or when the LR filter bar is hidden via manifest setting
          aPersonalization.push("Filter");
        }
      } else {
        aPersonalization.push("Filter");
      }

      if (isAnalyticalTable) {
        aPersonalization.push("Group");
        aPersonalization.push("Aggregate");
      }

      if (isResponsiveTable) {
        aPersonalization.push("Group");
      }

      return aPersonalization.join(",");
    }

    return undefined;
  }
  /**
   * Returns a Boolean value suggesting if a filter bar is being used on the page.
   *
   * Chart has a dependency to filter bar (issue with loading data). Once resolved, the check for chart should be removed here.
   * Until then, hiding filter bar is now allowed if a chart is being used on LR.
   *
   * @param manifestWrapper Manifest settings getter for the page
   * @param converterContext The instance of the converter context
   * @returns Boolean suggesting if a filter bar is being used on the page.
   */


  _exports.getP13nMode = getP13nMode;

  function _isFilterBarHidden(manifestWrapper, converterContext) {
    return manifestWrapper.isFilterBarHidden() && !converterContext.getManifestWrapper().hasMultipleVisualizations() && converterContext.getTemplateType() !== TemplateType.AnalyticalListPage;
  }
  /**
   * Returns a JSON string containing the sort conditions for the presentation variant.
   *
   * @param converterContext The instance of the converter context
   * @param presentationVariantAnnotation Presentation variant annotation
   * @param columns Table columns processed by the converter
   * @returns Sort conditions for a presentation variant.
   */


  function getSortConditions(converterContext, presentationVariantAnnotation, columns) {
    // Currently navigation property is not supported as sorter
    var nonSortableProperties = getNonSortablePropertiesRestrictions(converterContext.getEntitySet());
    var sortConditions;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.SortOrder) {
      var sorters = [];
      var conditions = {
        sorters: sorters
      };
      presentationVariantAnnotation.SortOrder.forEach(function (condition) {
        var _conditionProperty$$t;

        var conditionProperty = condition.Property;

        if (conditionProperty && nonSortableProperties.indexOf((_conditionProperty$$t = conditionProperty.$target) === null || _conditionProperty$$t === void 0 ? void 0 : _conditionProperty$$t.name) === -1) {
          var infoName = convertPropertyPathsToInfoNames([conditionProperty], columns)[0];

          if (infoName) {
            conditions.sorters.push({
              name: infoName,
              descending: !!condition.Descending
            });
          }
        }
      });
      sortConditions = conditions.sorters.length ? JSON.stringify(conditions) : undefined;
    }

    return sortConditions;
  }
  /**
   * Converts an array of propertyPath to an array of propertyInfo names.
   *
   * @param paths the array to be converted
   * @param columns the array of propertyInfos
   * @returns an array of propertyInfo names
   */


  function convertPropertyPathsToInfoNames(paths, columns) {
    var infoNames = [];
    paths.forEach(function (currentPath) {
      var _currentPath$$target;

      if (currentPath !== null && currentPath !== void 0 && (_currentPath$$target = currentPath.$target) !== null && _currentPath$$target !== void 0 && _currentPath$$target.name) {
        var propertyInfo = columns.find(function (column) {
          var _currentPath$$target2;

          var annotationColumn = column;
          return !annotationColumn.propertyInfos && annotationColumn.relativePath === (currentPath === null || currentPath === void 0 ? void 0 : (_currentPath$$target2 = currentPath.$target) === null || _currentPath$$target2 === void 0 ? void 0 : _currentPath$$target2.name);
        });

        if (propertyInfo) {
          infoNames.push(propertyInfo.name);
        }
      }
    });
    return infoNames;
  }
  /**
   * Returns a JSON string containing Presentation Variant group conditions.
   *
   * @param presentationVariantAnnotation Presentation variant annotation
   * @param columns Converter processed table columns
   * @param tableType The table type.
   * @returns Group conditions for a Presentation variant.
   */


  function getGroupConditions(presentationVariantAnnotation, columns, tableType) {
    var groupConditions;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.GroupBy) {
      var aGroupBy = presentationVariantAnnotation.GroupBy;

      if (tableType === "ResponsiveTable") {
        aGroupBy = aGroupBy.slice(0, 1);
      }

      var aGroupLevels = convertPropertyPathsToInfoNames(aGroupBy, columns).map(function (infoName) {
        return {
          name: infoName
        };
      });
      groupConditions = aGroupLevels.length ? JSON.stringify({
        groupLevels: aGroupLevels
      }) : undefined;
    }

    return groupConditions;
  }
  /**
   * Returns a JSON string containing Presentation Variant aggregate conditions.
   *
   * @param presentationVariantAnnotation Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns Group conditions for a Presentation variant.
   */


  function getAggregateConditions(presentationVariantAnnotation, columns) {
    var aggregateConditions;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.Total) {
      var aTotals = presentationVariantAnnotation.Total;
      var aggregates = {};
      convertPropertyPathsToInfoNames(aTotals, columns).forEach(function (infoName) {
        aggregates[infoName] = {};
      });
      aggregateConditions = JSON.stringify(aggregates);
    }

    return aggregateConditions;
  }

  function getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfiguration, columns, presentationVariantAnnotation, viewConfiguration) {
    var _converterContext$get16, _converterContext$get17, _converterContext$get18;

    // Need to get the target
    var _splitPath2 = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath2.navigationPropertyPath;

    var title = (_converterContext$get16 = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get16 === void 0 ? void 0 : (_converterContext$get17 = _converterContext$get16.UI) === null || _converterContext$get17 === void 0 ? void 0 : (_converterContext$get18 = _converterContext$get17.HeaderInfo) === null || _converterContext$get18 === void 0 ? void 0 : _converterContext$get18.TypeNamePlural;
    var entitySet = converterContext.getDataModelObjectPath().targetEntitySet;
    var pageManifestSettings = converterContext.getManifestWrapper();
    var hasAbsolutePath = navigationPropertyPath.length === 0,
        p13nMode = getP13nMode(visualizationPath, converterContext, tableManifestConfiguration),
        id = navigationPropertyPath ? getTableID(visualizationPath) : getTableID(converterContext.getContextPath(), "LineItem");
    var targetCapabilities = getCapabilityRestriction(converterContext);
    var navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
    var navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationTargetPath);

    var creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings, visualizationPath);

    var standardActionsContext = generateStandardActionsContext(converterContext, creationBehaviour.mode, tableManifestConfiguration, viewConfiguration);
    var deleteButtonVisibilityExpression = getDeleteVisibility(converterContext, standardActionsContext);
    var createButtonVisibilityExpression = getCreateVisibility(converterContext, standardActionsContext);
    var massEditButtonVisibilityExpression = getMassEditVisibility(converterContext, standardActionsContext);
    var isInsertUpdateTemplated = getInsertUpdateActionsTemplating(standardActionsContext, isDraftOrStickySupported(converterContext), compileExpression(createButtonVisibilityExpression) === "false");
    var selectionMode = getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, hasAbsolutePath, targetCapabilities, deleteButtonVisibilityExpression, massEditButtonVisibilityExpression);
    var threshold = navigationPropertyPath ? 10 : 30;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.MaxItems) {
      threshold = presentationVariantAnnotation.MaxItems.valueOf();
    }

    var variantManagement = pageManifestSettings.getVariantManagement();
    var isSearchable = isPathSearchable(converterContext.getDataModelObjectPath());
    var standardActions = {
      create: getStandardActionCreate(converterContext, standardActionsContext),
      "delete": getStandardActionDelete(converterContext, standardActionsContext),
      paste: getStandardActionPaste(converterContext, standardActionsContext, isInsertUpdateTemplated),
      massEdit: getStandardActionMassEdit(converterContext, standardActionsContext),
      creationRow: getCreationRow(converterContext, standardActionsContext)
    };
    return {
      id: id,
      entityName: entitySet ? entitySet.name : "",
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      navigationPath: navigationPropertyPath,
      row: _getRowConfigurationProperty(lineItemAnnotation, visualizationPath, converterContext, navigationSettings, navigationTargetPath),
      p13nMode: p13nMode,
      standardActions: {
        actions: standardActions,
        isInsertUpdateTemplated: isInsertUpdateTemplated,
        updatablePropertyPath: getCurrentEntitySetUpdatablePath(converterContext)
      },
      displayMode: isInDisplayMode(converterContext, viewConfiguration),
      create: creationBehaviour,
      selectionMode: selectionMode,
      autoBindOnInit: _isFilterBarHidden(pageManifestSettings, converterContext) || converterContext.getTemplateType() !== TemplateType.ListReport && converterContext.getTemplateType() !== TemplateType.AnalyticalListPage && !(viewConfiguration && pageManifestSettings.hasMultipleVisualizations(viewConfiguration)),
      variantManagement: variantManagement === "Control" && !p13nMode ? VariantManagementType.None : variantManagement,
      threshold: threshold,
      sortConditions: getSortConditions(converterContext, presentationVariantAnnotation, columns),
      title: title,
      searchable: tableManifestConfiguration.type !== "AnalyticalTable" && !(isConstant(isSearchable) && isSearchable.value === false)
    };
  }

  _exports.getTableAnnotationConfiguration = getTableAnnotationConfiguration;

  function _getExportDataType(dataType) {
    var isComplexProperty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var exportDataType = "String";

    if (isComplexProperty) {
      if (dataType === "Edm.DateTimeOffset") {
        exportDataType = "DateTime";
      }

      return exportDataType;
    } else {
      switch (dataType) {
        case "Edm.Decimal":
        case "Edm.Int32":
        case "Edm.Int64":
        case "Edm.Double":
        case "Edm.Byte":
          exportDataType = "Number";
          break;

        case "Edm.DateOfTime":
        case "Edm.Date":
          exportDataType = "Date";
          break;

        case "Edm.DateTimeOffset":
          exportDataType = "DateTime";
          break;

        case "Edm.TimeOfDay":
          exportDataType = "Time";
          break;

        case "Edm.Boolean":
          exportDataType = "Boolean";
          break;

        default:
          exportDataType = "String";
      }
    }

    return exportDataType;
  }
  /**
   * Split the visualization path into the navigation property path and annotation.
   *
   * @param visualizationPath
   * @returns The split path
   */


  function splitPath(visualizationPath) {
    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 2),
        navigationPropertyPath = _visualizationPath$sp2[0],
        annotationPath = _visualizationPath$sp2[1];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    return {
      navigationPropertyPath: navigationPropertyPath,
      annotationPath: annotationPath
    };
  }

  _exports.splitPath = splitPath;

  function getSelectionVariantConfiguration(selectionVariantPath, converterContext) {
    var resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
    var selection = resolvedTarget.annotation;

    if (selection) {
      var _selection$SelectOpti, _selection$Text;

      var propertyNames = [];
      (_selection$SelectOpti = selection.SelectOptions) === null || _selection$SelectOpti === void 0 ? void 0 : _selection$SelectOpti.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var propertyPath = propertyName.value;

        if (propertyNames.indexOf(propertyPath) === -1) {
          propertyNames.push(propertyPath);
        }
      });
      return {
        text: selection === null || selection === void 0 ? void 0 : (_selection$Text = selection.Text) === null || _selection$Text === void 0 ? void 0 : _selection$Text.toString(),
        propertyNames: propertyNames
      };
    }

    return undefined;
  }

  _exports.getSelectionVariantConfiguration = getSelectionVariantConfiguration;

  function _getFullScreenBasedOnDevice(tableSettings, converterContext, isIphone) {
    var _tableSettings$enable;

    // If enableFullScreen is not set, use as default true on phone and false otherwise
    var enableFullScreen = (_tableSettings$enable = tableSettings.enableFullScreen) !== null && _tableSettings$enable !== void 0 ? _tableSettings$enable : isIphone; // Make sure that enableFullScreen is not set on ListReport for desktop or tablet

    if (!isIphone && enableFullScreen && converterContext.getTemplateType() === TemplateType.ListReport) {
      enableFullScreen = false;
      converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
    }

    return enableFullScreen;
  }

  function _getMultiSelectMode(tableSettings, tableType, converterContext) {
    var multiSelectMode;

    if (tableType !== "ResponsiveTable") {
      return undefined;
    }

    switch (converterContext.getTemplateType()) {
      case TemplateType.ListReport:
      case TemplateType.AnalyticalListPage:
        multiSelectMode = !tableSettings.selectAll ? "ClearAll" : "Default";
        break;

      case TemplateType.ObjectPage:
        multiSelectMode = tableSettings.selectAll === false ? "ClearAll" : "Default";

        if (converterContext.getManifestWrapper().useIconTabBar()) {
          multiSelectMode = !tableSettings.selectAll ? "ClearAll" : "Default";
        }

        break;

      default:
    }

    return multiSelectMode;
  }

  function _getTableType(tableSettings, aggregationHelper, converterContext) {
    var tableType = (tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type) || "ResponsiveTable";
    /*  Now, we keep the configuration in the manifest, even if it leads to errors.
    	We only change if we're not on desktop from Analytical to Responsive.
     */

    if (tableType === "AnalyticalTable" && !converterContext.getManifestWrapper().isDesktop()) {
      tableType = "ResponsiveTable";
    }

    return tableType;
  }

  function _getGridTableMode(tableType, tableSettings, isTemplateListReport) {
    if (tableType === "GridTable") {
      if (isTemplateListReport) {
        return {
          rowCountMode: "Auto",
          rowCount: "3"
        };
      } else {
        return {
          rowCountMode: tableSettings.rowCountMode ? tableSettings.rowCountMode : "Fixed",
          rowCount: tableSettings.rowCount ? tableSettings.rowCount : 5
        };
      }
    } else {
      return {};
    }
  }

  function _getCondensedTableLayout(_tableType, _tableSettings) {
    return _tableSettings.condensedTableLayout !== undefined && _tableType !== "ResponsiveTable" ? _tableSettings.condensedTableLayout : false;
  }

  function _getTableSelectionLimit(_tableSettings) {
    return _tableSettings.selectAll === true || _tableSettings.selectionLimit === 0 ? 0 : _tableSettings.selectionLimit || 200;
  }

  function _getTableInlineCreationRowCount(_tableSettings) {
    var _tableSettings$creati, _tableSettings$creati2;

    return (_tableSettings$creati = _tableSettings.creationMode) !== null && _tableSettings$creati !== void 0 && _tableSettings$creati.inlineCreationRowCount ? (_tableSettings$creati2 = _tableSettings.creationMode) === null || _tableSettings$creati2 === void 0 ? void 0 : _tableSettings$creati2.inlineCreationRowCount : 2;
  }

  function _getFilters(tableSettings, quickFilterPaths, quickSelectionVariant, path, converterContext) {
    var _tableSettings$quickV;

    if (quickSelectionVariant) {
      quickFilterPaths.push({
        annotationPath: path.annotationPath
      });
    }

    return {
      quickFilters: {
        enabled: converterContext.getTemplateType() === TemplateType.ListReport ? "{= ${pageInternal>hasPendingFilters} !== true}" : true,
        showCounts: tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV = tableSettings.quickVariantSelection) === null || _tableSettings$quickV === void 0 ? void 0 : _tableSettings$quickV.showCounts,
        paths: quickFilterPaths
      }
    };
  }

  function _getEnableExport(tableSettings, converterContext, enablePaste) {
    return tableSettings.enableExport !== undefined ? tableSettings.enableExport : converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
  }

  function _getFilterConfiguration(tableSettings, lineItemAnnotation, converterContext) {
    var _tableSettings$quickV2, _tableSettings$quickV3, _tableSettings$quickV4;

    if (!lineItemAnnotation) {
      return {};
    }

    var quickFilterPaths = [];
    var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
    var quickSelectionVariant;
    var filters;
    tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV2 = tableSettings.quickVariantSelection) === null || _tableSettings$quickV2 === void 0 ? void 0 : (_tableSettings$quickV3 = _tableSettings$quickV2.paths) === null || _tableSettings$quickV3 === void 0 ? void 0 : _tableSettings$quickV3.forEach(function (path) {
      quickSelectionVariant = targetEntityType.resolvePath(path.annotationPath);
      filters = _getFilters(tableSettings, quickFilterPaths, quickSelectionVariant, path, converterContext);
    });
    var hideTableTitle = false;
    hideTableTitle = !!((_tableSettings$quickV4 = tableSettings.quickVariantSelection) !== null && _tableSettings$quickV4 !== void 0 && _tableSettings$quickV4.hideTableTitle);
    return {
      filters: filters,
      headerVisible: !(quickSelectionVariant && hideTableTitle)
    };
  }

  function _getCollectedNavigationPropertyLabels(relativePath, converterContext) {
    var navigationProperties = enhanceDataModelPath(converterContext.getDataModelObjectPath(), relativePath).navigationProperties;

    if ((navigationProperties === null || navigationProperties === void 0 ? void 0 : navigationProperties.length) > 0) {
      var collectedNavigationPropertyLabels = [];
      navigationProperties.forEach(function (navProperty) {
        collectedNavigationPropertyLabels.push(getLabel(navProperty) || navProperty.name);
      });
      return collectedNavigationPropertyLabels;
    }
  }

  function getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext) {
    var _tableSettings$creati3, _tableSettings$creati4, _tableSettings$creati5, _tableSettings$creati6, _tableSettings$creati7, _tableSettings$quickV5, _manifestWrapper$getV;

    var checkCondensedLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var _manifestWrapper = converterContext.getManifestWrapper();

    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var tableSettings = tableManifestSettings && tableManifestSettings.tableSettings || {};
    var creationMode = ((_tableSettings$creati3 = tableSettings.creationMode) === null || _tableSettings$creati3 === void 0 ? void 0 : _tableSettings$creati3.name) || CreationMode.NewPage;
    var enableAutoColumnWidth = !_manifestWrapper.isPhone();
    var enablePaste = tableSettings.enablePaste !== undefined ? tableSettings.enablePaste : converterContext.getTemplateType() === "ObjectPage"; // Paste is disabled by default excepted for OP

    var templateType = converterContext.getTemplateType();
    var dataStateIndicatorFilter = templateType === TemplateType.ListReport ? "API.dataStateIndicatorFilter" : undefined;

    var isCondensedTableLayoutCompliant = checkCondensedLayout && _manifestWrapper.isCondensedLayoutCompliant();

    var oFilterConfiguration = _getFilterConfiguration(tableSettings, lineItemAnnotation, converterContext);

    var customValidationFunction = (_tableSettings$creati4 = tableSettings.creationMode) === null || _tableSettings$creati4 === void 0 ? void 0 : _tableSettings$creati4.customValidationFunction;
    var entityType = converterContext.getEntityType();
    var aggregationHelper = new AggregationHelper(entityType, converterContext);

    var tableType = _getTableType(tableSettings, aggregationHelper, converterContext);

    var gridTableRowMode = _getGridTableMode(tableType, tableSettings, templateType === TemplateType.ListReport);

    var condensedTableLayout = _getCondensedTableLayout(tableType, tableSettings);

    var oConfiguration = {
      // If no createAtEnd is specified it will be false for Inline create and true otherwise
      createAtEnd: ((_tableSettings$creati5 = tableSettings.creationMode) === null || _tableSettings$creati5 === void 0 ? void 0 : _tableSettings$creati5.createAtEnd) !== undefined ? (_tableSettings$creati6 = tableSettings.creationMode) === null || _tableSettings$creati6 === void 0 ? void 0 : _tableSettings$creati6.createAtEnd : creationMode !== CreationMode.Inline,
      creationMode: creationMode,
      customValidationFunction: customValidationFunction,
      dataStateIndicatorFilter: dataStateIndicatorFilter,
      // if a custom validation function is provided, disableAddRowButtonForEmptyData should not be considered, i.e. set to false
      disableAddRowButtonForEmptyData: !customValidationFunction ? !!((_tableSettings$creati7 = tableSettings.creationMode) !== null && _tableSettings$creati7 !== void 0 && _tableSettings$creati7.disableAddRowButtonForEmptyData) : false,
      enableAutoColumnWidth: enableAutoColumnWidth,
      enableExport: _getEnableExport(tableSettings, converterContext, enablePaste),
      enableFullScreen: _getFullScreenBasedOnDevice(tableSettings, converterContext, _manifestWrapper.isPhone()),
      enableMassEdit: tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.enableMassEdit,
      enablePaste: enablePaste,
      headerVisible: true,
      multiSelectMode: _getMultiSelectMode(tableSettings, tableType, converterContext),
      selectionLimit: _getTableSelectionLimit(tableSettings),
      inlineCreationRowCount: _getTableInlineCreationRowCount(tableSettings),
      showRowCount: !(tableSettings !== null && tableSettings !== void 0 && (_tableSettings$quickV5 = tableSettings.quickVariantSelection) !== null && _tableSettings$quickV5 !== void 0 && _tableSettings$quickV5.showCounts) && !((_manifestWrapper$getV = _manifestWrapper.getViewConfiguration()) !== null && _manifestWrapper$getV !== void 0 && _manifestWrapper$getV.showCounts),
      type: tableType,
      useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
      isCompactType: _manifestWrapper.isCompactType()
    };
    return _objectSpread(_objectSpread(_objectSpread({}, oConfiguration), gridTableRowMode), oFilterConfiguration);
  }

  _exports.getTableManifestConfiguration = getTableManifestConfiguration;

  function getTypeConfig(oProperty, dataType) {
    var _targetType, _oTargetMapping, _propertyTypeConfig$t, _propertyTypeConfig$t2, _propertyTypeConfig$t3, _propertyTypeConfig$t4;

    var oTargetMapping = EDM_TYPE_MAPPING[oProperty === null || oProperty === void 0 ? void 0 : oProperty.type] || (dataType ? EDM_TYPE_MAPPING[dataType] : undefined);

    if (!oTargetMapping && oProperty !== null && oProperty !== void 0 && oProperty.targetType && ((_targetType = oProperty.targetType) === null || _targetType === void 0 ? void 0 : _targetType._type) === "TypeDefinition") {
      oTargetMapping = EDM_TYPE_MAPPING[oProperty.targetType.underlyingType];
    }

    var propertyTypeConfig = {
      type: (_oTargetMapping = oTargetMapping) === null || _oTargetMapping === void 0 ? void 0 : _oTargetMapping.type,
      constraints: {},
      formatOptions: {}
    };

    if (isProperty(oProperty)) {
      var _oTargetMapping$const, _oTargetMapping$const2, _oTargetMapping$const3, _oTargetMapping$const4, _oTargetMapping$const5, _oProperty$annotation8, _oProperty$annotation9, _oProperty$annotation10, _oProperty$annotation11, _oTargetMapping$const6, _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15, _oTargetMapping$const7, _oProperty$annotation16, _oProperty$annotation17;

      propertyTypeConfig.constraints = {
        scale: (_oTargetMapping$const = oTargetMapping.constraints) !== null && _oTargetMapping$const !== void 0 && _oTargetMapping$const.$Scale ? oProperty.scale : undefined,
        precision: (_oTargetMapping$const2 = oTargetMapping.constraints) !== null && _oTargetMapping$const2 !== void 0 && _oTargetMapping$const2.$Precision ? oProperty.precision : undefined,
        maxLength: (_oTargetMapping$const3 = oTargetMapping.constraints) !== null && _oTargetMapping$const3 !== void 0 && _oTargetMapping$const3.$MaxLength ? oProperty.maxLength : undefined,
        nullable: (_oTargetMapping$const4 = oTargetMapping.constraints) !== null && _oTargetMapping$const4 !== void 0 && _oTargetMapping$const4.$Nullable ? oProperty.nullable : undefined,
        minimum: (_oTargetMapping$const5 = oTargetMapping.constraints) !== null && _oTargetMapping$const5 !== void 0 && _oTargetMapping$const5["@Org.OData.Validation.V1.Minimum/$Decimal"] && !isNaN((_oProperty$annotation8 = oProperty.annotations) === null || _oProperty$annotation8 === void 0 ? void 0 : (_oProperty$annotation9 = _oProperty$annotation8.Validation) === null || _oProperty$annotation9 === void 0 ? void 0 : _oProperty$annotation9.Minimum) ? "".concat((_oProperty$annotation10 = oProperty.annotations) === null || _oProperty$annotation10 === void 0 ? void 0 : (_oProperty$annotation11 = _oProperty$annotation10.Validation) === null || _oProperty$annotation11 === void 0 ? void 0 : _oProperty$annotation11.Minimum) : undefined,
        maximum: (_oTargetMapping$const6 = oTargetMapping.constraints) !== null && _oTargetMapping$const6 !== void 0 && _oTargetMapping$const6["@Org.OData.Validation.V1.Maximum/$Decimal"] && !isNaN((_oProperty$annotation12 = oProperty.annotations) === null || _oProperty$annotation12 === void 0 ? void 0 : (_oProperty$annotation13 = _oProperty$annotation12.Validation) === null || _oProperty$annotation13 === void 0 ? void 0 : _oProperty$annotation13.Maximum) ? "".concat((_oProperty$annotation14 = oProperty.annotations) === null || _oProperty$annotation14 === void 0 ? void 0 : (_oProperty$annotation15 = _oProperty$annotation14.Validation) === null || _oProperty$annotation15 === void 0 ? void 0 : _oProperty$annotation15.Maximum) : undefined,
        isDigitSequence: propertyTypeConfig.type === "sap.ui.model.odata.type.String" && (_oTargetMapping$const7 = oTargetMapping.constraints) !== null && _oTargetMapping$const7 !== void 0 && _oTargetMapping$const7["@com.sap.vocabularies.Common.v1.IsDigitSequence"] && (_oProperty$annotation16 = oProperty.annotations) !== null && _oProperty$annotation16 !== void 0 && (_oProperty$annotation17 = _oProperty$annotation16.Common) !== null && _oProperty$annotation17 !== void 0 && _oProperty$annotation17.IsDigitSequence ? true : undefined
      };
    }

    propertyTypeConfig.formatOptions = {
      parseAsString: (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t = propertyTypeConfig.type) === null || _propertyTypeConfig$t === void 0 ? void 0 : _propertyTypeConfig$t.indexOf("sap.ui.model.odata.type.Int")) === 0 || (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t2 = propertyTypeConfig.type) === null || _propertyTypeConfig$t2 === void 0 ? void 0 : _propertyTypeConfig$t2.indexOf("sap.ui.model.odata.type.Double")) === 0 ? false : undefined,
      emptyString: (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t3 = propertyTypeConfig.type) === null || _propertyTypeConfig$t3 === void 0 ? void 0 : _propertyTypeConfig$t3.indexOf("sap.ui.model.odata.type.Int")) === 0 || (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t4 = propertyTypeConfig.type) === null || _propertyTypeConfig$t4 === void 0 ? void 0 : _propertyTypeConfig$t4.indexOf("sap.ui.model.odata.type.Double")) === 0 ? "" : undefined,
      parseKeepsEmptyString: propertyTypeConfig.type === "sap.ui.model.odata.type.String" ? true : undefined
    };
    return propertyTypeConfig;
  }

  _exports.getTypeConfig = getTypeConfig;
  return {
    getTableActions: getTableActions,
    getTableColumns: getTableColumns,
    getColumnsFromEntityType: getColumnsFromEntityType,
    updateLinkedProperties: updateLinkedProperties,
    createTableVisualization: createTableVisualization,
    createDefaultTableVisualization: createDefaultTableVisualization,
    getCapabilityRestriction: getCapabilityRestriction,
    getSelectionMode: getSelectionMode,
    getRowStatusVisibility: getRowStatusVisibility,
    getImportance: getImportance,
    getP13nMode: getP13nMode,
    getTableAnnotationConfiguration: getTableAnnotationConfiguration,
    isFilteringCaseSensitive: isFilteringCaseSensitive,
    splitPath: splitPath,
    getSelectionVariantConfiguration: getSelectionVariantConfiguration,
    getTableManifestConfiguration: getTableManifestConfiguration,
    getTypeConfig: getTypeConfig
  };
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb2x1bW5UeXBlIiwiZ2V0VGFibGVBY3Rpb25zIiwibGluZUl0ZW1Bbm5vdGF0aW9uIiwidmlzdWFsaXphdGlvblBhdGgiLCJjb252ZXJ0ZXJDb250ZXh0IiwibmF2aWdhdGlvblNldHRpbmdzIiwiYVRhYmxlQWN0aW9ucyIsImdldFRhYmxlQW5ub3RhdGlvbkFjdGlvbnMiLCJhQW5ub3RhdGlvbkFjdGlvbnMiLCJ0YWJsZUFjdGlvbnMiLCJhSGlkZGVuQWN0aW9ucyIsImhpZGRlblRhYmxlQWN0aW9ucyIsIm1hbmlmZXN0QWN0aW9ucyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJnZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uIiwiYWN0aW9ucyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiaXNOYXZpZ2FibGUiLCJlbmFibGVPblNlbGVjdCIsImVuYWJsZUF1dG9TY3JvbGwiLCJlbmFibGVkIiwidmlzaWJsZSIsImRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbiIsImNvbW1hbmQiLCJjb21tYW5kQWN0aW9ucyIsImdldFRhYmxlQ29sdW1ucyIsImFubm90YXRpb25Db2x1bW5zIiwiZ2V0Q29sdW1uc0Zyb21Bbm5vdGF0aW9ucyIsIm1hbmlmZXN0Q29sdW1ucyIsImdldENvbHVtbnNGcm9tTWFuaWZlc3QiLCJjb2x1bW5zIiwiZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUiLCJ3aWR0aCIsImltcG9ydGFuY2UiLCJob3Jpem9udGFsQWxpZ24iLCJhdmFpbGFiaWxpdHkiLCJzZXR0aW5ncyIsImZvcm1hdE9wdGlvbnMiLCJnZXRBZ2dyZWdhdGVEZWZpbml0aW9uc0Zyb21FbnRpdHlUeXBlIiwiZW50aXR5VHlwZSIsInRhYmxlQ29sdW1ucyIsImFnZ3JlZ2F0aW9uSGVscGVyIiwiQWdncmVnYXRpb25IZWxwZXIiLCJmaW5kQ29sdW1uRnJvbVBhdGgiLCJwYXRoIiwiZmluZCIsImNvbHVtbiIsImFubm90YXRpb25Db2x1bW4iLCJwcm9wZXJ0eUluZm9zIiwidW5kZWZpbmVkIiwicmVsYXRpdmVQYXRoIiwiaXNBbmFseXRpY3NTdXBwb3J0ZWQiLCJtQ3VycmVuY3lPclVuaXRQcm9wZXJ0aWVzIiwiU2V0IiwiZm9yRWFjaCIsIm9Db2x1bW4iLCJvVGFibGVDb2x1bW4iLCJ1bml0IiwiYWRkIiwiYUN1c3RvbUFnZ3JlZ2F0ZUFubm90YXRpb25zIiwiZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMiLCJtUmF3RGVmaW5pdGlvbnMiLCJhbm5vdGF0aW9uIiwib0FnZ3JlZ2F0ZWRQcm9wZXJ0eSIsIl9lbnRpdHlUeXBlIiwiZW50aXR5UHJvcGVydGllcyIsIm9Qcm9wZXJ0eSIsIm5hbWUiLCJxdWFsaWZpZXIiLCJhQ29udGV4dERlZmluaW5nUHJvcGVydGllcyIsImFubm90YXRpb25zIiwiQWdncmVnYXRpb24iLCJDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwibWFwIiwib0N0eERlZlByb3BlcnR5IiwidmFsdWUiLCJtUmVzdWx0IiwiYVJhd0NvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMiLCJoYXMiLCJpc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eSIsImRlZmF1bHRBZ2dyZWdhdGUiLCJjb250ZXh0RGVmaW5pbmdQcm9wZXJ0eU5hbWUiLCJmb3VuZENvbHVtbiIsInB1c2giLCJsZW5ndGgiLCJjb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwidXBkYXRlVGFibGVWaXN1YWxpemF0aW9uRm9yQW5hbHl0aWNzIiwidGFibGVWaXN1YWxpemF0aW9uIiwicHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24iLCJjb250cm9sIiwidHlwZSIsImFnZ3JlZ2F0ZXNEZWZpbml0aW9ucyIsImVuYWJsZUFuYWx5dGljcyIsImFnZ3JlZ2F0ZXMiLCJhbGxvd2VkVHJhbnNmb3JtYXRpb25zIiwiZ2V0QWxsb3dlZFRyYW5zZm9ybWF0aW9ucyIsImVuYWJsZUFuYWx5dGljc1NlYXJjaCIsImluZGV4T2YiLCJncm91cENvbmRpdGlvbnMiLCJnZXRHcm91cENvbmRpdGlvbnMiLCJhZ2dyZWdhdGVDb25kaXRpb25zIiwiZ2V0QWdncmVnYXRlQ29uZGl0aW9ucyIsImdldE5hdmlnYXRpb25UYXJnZXRQYXRoIiwibmF2aWdhdGlvblByb3BlcnR5UGF0aCIsIm1hbmlmZXN0V3JhcHBlciIsImdldE1hbmlmZXN0V3JhcHBlciIsImdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uIiwibmF2Q29uZmlnIiwiT2JqZWN0Iiwia2V5cyIsImRhdGFNb2RlbFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwiY29udGV4dFBhdGgiLCJnZXRDb250ZXh0UGF0aCIsIm5hdkNvbmZpZ0ZvckNvbnRleHRQYXRoIiwidGFyZ2V0RW50aXR5U2V0Iiwic3RhcnRpbmdFbnRpdHlTZXQiLCJ1cGRhdGVMaW5rZWRQcm9wZXJ0aWVzIiwiZmluZENvbHVtbkJ5UGF0aCIsIm9Qcm9wIiwib1VuaXQiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJvVGltZXpvbmUiLCJnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eSIsInNUaW1lem9uZSIsIkNvbW1vbiIsIlRpbWV6b25lIiwib1VuaXRDb2x1bW4iLCJzVW5pdCIsIk1lYXN1cmVzIiwiSVNPQ3VycmVuY3kiLCJVbml0IiwidW5pdFRleHQiLCJvVGltZXpvbmVDb2x1bW4iLCJ0aW1lem9uZSIsInRpbWV6b25lVGV4dCIsInRvU3RyaW5nIiwiZGlzcGxheU1vZGUiLCJnZXREaXNwbGF5TW9kZSIsInRleHRBbm5vdGF0aW9uIiwiVGV4dCIsImlzUGF0aEV4cHJlc3Npb24iLCJvVGV4dENvbHVtbiIsInRleHRBcnJhbmdlbWVudCIsInRleHRQcm9wZXJ0eSIsIm1vZGUiLCJnZXRTZW1hbnRpY0tleXNBbmRUaXRsZUluZm8iLCJoZWFkZXJJbmZvVGl0bGVQYXRoIiwiVUkiLCJIZWFkZXJJbmZvIiwiVGl0bGUiLCJWYWx1ZSIsInNlbWFudGljS2V5QW5ub3RhdGlvbnMiLCJTZW1hbnRpY0tleSIsImhlYWRlckluZm9UeXBlTmFtZSIsIlR5cGVOYW1lIiwic2VtYW50aWNLZXlDb2x1bW5zIiwiY3JlYXRlVGFibGVWaXN1YWxpemF0aW9uIiwiaXNDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFudCIsInZpZXdDb25maWd1cmF0aW9uIiwidGFibGVNYW5pZmVzdENvbmZpZyIsImdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uIiwic3BsaXRQYXRoIiwibmF2aWdhdGlvblRhcmdldFBhdGgiLCJvcGVyYXRpb25BdmFpbGFibGVNYXAiLCJnZXRPcGVyYXRpb25BdmFpbGFibGVNYXAiLCJzZW1hbnRpY0tleXNBbmRIZWFkZXJJbmZvVGl0bGUiLCJvVmlzdWFsaXphdGlvbiIsIlZpc3VhbGl6YXRpb25UeXBlIiwiVGFibGUiLCJnZXRUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uIiwicmVtb3ZlRHVwbGljYXRlQWN0aW9ucyIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzIiwiZ2V0T3BlcmF0aW9uQXZhaWxhYmxlUHJvcGVydGllcyIsImhlYWRlckluZm9UaXRsZSIsInNlbWFudGljS2V5cyIsImNyZWF0ZURlZmF1bHRUYWJsZVZpc3VhbGl6YXRpb24iLCJnZXRDb2x1bW5zRnJvbUVudGl0eVR5cGUiLCJnZXRFbnRpdHlUeXBlIiwiQWN0aW9uSGVscGVyIiwiZ2V0Q3VycmVudEVudGl0eVNldFVwZGF0YWJsZVBhdGgiLCJyZXN0cmljdGlvbnMiLCJnZXRSZXN0cmljdGlvbnMiLCJlbnRpdHlTZXQiLCJnZXRFbnRpdHlTZXQiLCJ1cGRhdGFibGUiLCJpc1VwZGF0YWJsZSIsImlzT25seUR5bmFtaWNPbkN1cnJlbnRFbnRpdHkiLCJpc0NvbnN0YW50IiwiZXhwcmVzc2lvbiIsIm5hdmlnYXRpb25FeHByZXNzaW9uIiwiX3R5cGUiLCJ1cGRhdGFibGVQcm9wZXJ0eVBhdGgiLCJDYXBhYmlsaXRpZXMiLCJVcGRhdGVSZXN0cmljdGlvbnMiLCJVcGRhdGFibGUiLCJwcm9wZXJ0aWVzIiwiYWN0aW9uTmFtZSIsInByb3BlcnR5TmFtZSIsInNpemUiLCJ0aXRsZVByb3BlcnR5IiwiQXJyYXkiLCJmcm9tIiwiam9pbiIsImdldFVJSGlkZGVuRXhwRm9yQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQiLCJjdXJyZW50RW50aXR5VHlwZSIsImNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoIiwiaXNFbnRpdHlTZXQiLCJhVWlIaWRkZW5QYXRoRXhwcmVzc2lvbnMiLCJkYXRhRmllbGQiLCIkVHlwZSIsIkFjdGlvblRhcmdldCIsImlzQm91bmQiLCJzb3VyY2VFbnRpdHlUeXBlIiwiUmVxdWlyZXNDb250ZXh0IiwiSW5saW5lIiwidmFsdWVPZiIsIkhpZGRlbiIsImVxdWFsIiwiZ2V0QmluZGluZ0V4cEZyb21Db250ZXh0Iiwic291cmNlIiwic0V4cHJlc3Npb24iLCJzUGF0aCIsInN1YnN0cmluZyIsImFTcGxpdFBhdGgiLCJzcGxpdCIsInNOYXZpZ2F0aW9uUGF0aCIsInRhcmdldE9iamVjdCIsInBhcnRuZXIiLCJwYXRoSW5Nb2RlbCIsInNsaWNlIiwiY29uc3RhbnQiLCJoYXNCb3VuZEFjdGlvbnNBbHdheXNWaXNpYmxlSW5Ub29sQmFyIiwic29tZSIsImhhc0N1c3RvbUFjdGlvbnNBbHdheXNWaXNpYmxlSW5Ub29sQmFyIiwiYWN0aW9uS2V5IiwiYWN0aW9uIiwicmVxdWlyZXNTZWxlY3Rpb24iLCJnZXRWaXNpYmxlRXhwRm9yQ3VzdG9tQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQiLCJhVmlzaWJsZVBhdGhFeHByZXNzaW9ucyIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uIiwiaXNEZWxldGFibGUiLCJpc1BhdGhEZWxldGFibGUiLCJpc1BhdGhVcGRhdGFibGUiLCJnZXRTZWxlY3Rpb25Nb2RlIiwidGFyZ2V0Q2FwYWJpbGl0aWVzIiwiZGVsZXRlQnV0dG9uVmlzaWJpbGl0eUV4cHJlc3Npb24iLCJtYXNzRWRpdFZpc2liaWxpdHlFeHByZXNzaW9uIiwiU2VsZWN0aW9uTW9kZSIsIk5vbmUiLCJ0YWJsZU1hbmlmZXN0U2V0dGluZ3MiLCJzZWxlY3Rpb25Nb2RlIiwidGFibGVTZXR0aW5ncyIsImFIaWRkZW5CaW5kaW5nRXhwcmVzc2lvbnMiLCJhVmlzaWJsZUJpbmRpbmdFeHByZXNzaW9ucyIsImlzUGFyZW50RGVsZXRhYmxlIiwicGFyZW50RW50aXR5U2V0RGVsZXRhYmxlIiwiZ2V0VGVtcGxhdGVUeXBlIiwiVGVtcGxhdGVUeXBlIiwiT2JqZWN0UGFnZSIsImNvbXBpbGVFeHByZXNzaW9uIiwiYk1hc3NFZGl0RW5hYmxlZCIsImlmRWxzZSIsImFuZCIsIklzRWRpdGFibGUiLCJNdWx0aSIsIkF1dG8iLCJTaW5nbGUiLCJidXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiIsIm9yIiwiZWRpdE1vZGVidXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiIsImNvbmNhdCIsInRhYmxlQWN0aW9uIiwiaXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCIsIkRldGVybWluaW5nIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIm5vdCIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsImdldFJlbGF0aXZlTW9kZWxQYXRoRnVuY3Rpb24iLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJEZWZhdWx0IiwiZ2V0SGlnaGxpZ2h0Um93QmluZGluZyIsImNyaXRpY2FsaXR5QW5ub3RhdGlvbiIsImlzRHJhZnRSb290IiwidGFyZ2V0RW50aXR5VHlwZSIsImRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uIiwiTWVzc2FnZVR5cGUiLCJnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUiLCJhTWlzc2luZ0tleXMiLCJmb3JtYXRSZXN1bHQiLCJFbnRpdHkiLCJIYXNBY3RpdmUiLCJJc0FjdGl2ZSIsInRhYmxlRm9ybWF0dGVycyIsInJvd0hpZ2hsaWdodGluZyIsIl9nZXRDcmVhdGlvbkJlaGF2aW91ciIsInRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uIiwibmF2aWdhdGlvbiIsImNyZWF0ZSIsImRldGFpbCIsIm9yaWdpbmFsVGFibGVTZXR0aW5ncyIsIm91dGJvdW5kIiwib3V0Ym91bmREZXRhaWwiLCJuZXdBY3Rpb24iLCJ0YXJnZXRBbm5vdGF0aW9ucyIsInRhcmdldEFubm90YXRpb25zQ29tbW9uIiwidGFyZ2V0QW5ub3RhdGlvbnNTZXNzaW9uIiwiU2Vzc2lvbiIsIkRyYWZ0Um9vdCIsIk5ld0FjdGlvbiIsIlN0aWNreVNlc3Npb25TdXBwb3J0ZWQiLCJjcmVhdGlvbk1vZGUiLCJDcmVhdGlvbk1vZGUiLCJDcmVhdGlvblJvdyIsIkVycm9yIiwicm91dGUiLCJhcHBlbmQiLCJjcmVhdGVBdEVuZCIsIm5hdmlnYXRlVG9UYXJnZXQiLCJOZXdQYWdlIiwiX2dldFJvd0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSIsInRhcmdldFBhdGgiLCJwcmVzc1Byb3BlcnR5IiwibmF2aWdhdGlvblRhcmdldCIsImNyaXRpY2FsaXR5UHJvcGVydHkiLCJkaXNwbGF5IiwidGFyZ2V0IiwiTW9kZWxIZWxwZXIiLCJpc1NpbmdsZXRvbiIsIkNyaXRpY2FsaXR5IiwiZ2V0RHJhZnRSb290IiwiZ2V0RHJhZnROb2RlIiwicm93TmF2aWdhdGVkRXhwcmVzc2lvbiIsIm5hdmlnYXRlZFJvdyIsInByZXNzIiwicm93TmF2aWdhdGVkIiwiSXNJbmFjdGl2ZSIsImNvbHVtbnNUb0JlQ3JlYXRlZCIsIm5vblNvcnRhYmxlQ29sdW1ucyIsInRhYmxlVHlwZSIsInByb3BlcnR5IiwiZXhpc3RzIiwidGFyZ2V0VHlwZSIsImlzUmVmZXJlbmNlUHJvcGVydHlTdGF0aWNhbGx5SGlkZGVuIiwiRGF0YUZpZWxkRGVmYXVsdCIsInJlbGF0ZWRQcm9wZXJ0aWVzSW5mbyIsImNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyIsInJlbGF0ZWRQcm9wZXJ0eU5hbWVzIiwiYWRkaXRpb25hbFByb3BlcnR5TmFtZXMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNvbHVtbkluZm8iLCJnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5IiwiZ2V0QW5ub3RhdGlvbnNCeVRlcm0iLCJvQ29sdW1uRHJhZnRJbmRpY2F0b3IiLCJnZXREZWZhdWx0RHJhZnRJbmRpY2F0b3JGb3JDb2x1bW4iLCJleHBvcnRTZXR0aW5ncyIsInRlbXBsYXRlIiwiZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSIsIndyYXAiLCJleHBvcnRTZXR0aW5nc1dyYXBwaW5nIiwiX2dldEV4cG9ydERhdGFUeXBlIiwiZXhwb3J0VW5pdE5hbWUiLCJ1bml0UHJvcGVydHkiLCJleHBvcnRVbml0U3RyaW5nIiwiZXhwb3J0VGltZXpvbmVOYW1lIiwidGltZXpvbmVQcm9wZXJ0eSIsInV0YyIsImV4cG9ydFRpbWV6b25lU3RyaW5nIiwiYWRkaXRpb25hbFByb3BlcnR5SW5mb3MiLCJyZWxhdGVkQ29sdW1ucyIsIl9jcmVhdGVSZWxhdGVkQ29sdW1ucyIsImZ1bGxQcm9wZXJ0eVBhdGgiLCJ1c2VEYXRhRmllbGRQcmVmaXgiLCJhdmFpbGFibGVGb3JBZGFwdGF0aW9uIiwicmVwbGFjZVNwZWNpYWxDaGFycyIsInNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgiLCJnZXRTZW1hbnRpY09iamVjdFBhdGgiLCJpc0hpZGRlbiIsImdyb3VwUGF0aCIsIl9zbGljZUF0U2xhc2giLCJpc0dyb3VwIiwiaXNEYXRhUG9pbnRGYWtlUHJvcGVydHkiLCJleHBvcnRUeXBlIiwic0RhdGVJbnB1dEZvcm1hdCIsImRhdGFUeXBlIiwiZ2V0RGF0YUZpZWxkRGF0YVR5cGUiLCJwcm9wZXJ0eVR5cGVDb25maWciLCJnZXRUeXBlQ29uZmlnIiwic29ydGFibGUiLCJvVHlwZUNvbmZpZyIsImNsYXNzTmFtZSIsIm9Gb3JtYXRPcHRpb25zIiwib0NvbnN0cmFpbnRzIiwiY29uc3RyYWludHMiLCJnZXRUYXJnZXRWYWx1ZU9uRGF0YVBvaW50IiwiaW5wdXRGb3JtYXQiLCJzY2FsZSIsImRlbGltaXRlciIsIm9Vbml0UHJvcGVydHkiLCJvVGltZXpvbmVQcm9wZXJ0eSIsInNVbml0VGV4dCIsInNUaW1lem9uZVRleHQiLCJjb2xsZWN0ZWROYXZpZ2F0aW9uUHJvcGVydHlMYWJlbHMiLCJfZ2V0Q29sbGVjdGVkTmF2aWdhdGlvblByb3BlcnR5TGFiZWxzIiwiQW5ub3RhdGlvbiIsImxhYmVsIiwiZ2V0TGFiZWwiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJzZW1hbnRpY09iamVjdFBhdGgiLCJBdmFpbGFiaWxpdHlUeXBlIiwiQWRhcHRhdGlvbiIsIlRhcmdldCIsIiR0YXJnZXQiLCJpc0dyb3VwYWJsZSIsImlzUHJvcGVydHlHcm91cGFibGUiLCJpc0tleSIsImNhc2VTZW5zaXRpdmUiLCJpc0ZpbHRlcmluZ0Nhc2VTZW5zaXRpdmUiLCJ0eXBlQ29uZmlnIiwidmlzdWFsU2V0dGluZ3MiLCJ3aWR0aENhbGN1bGF0aW9uIiwiZ2V0SW1wb3J0YW5jZSIsImFkZGl0aW9uYWxMYWJlbHMiLCJzVG9vbHRpcCIsIl9nZXRUb29sdGlwIiwidG9vbHRpcCIsIl9pc1ZhbGlkQ29sdW1uIiwiX2dldFZpc2libGVFeHByZXNzaW9uIiwiZGF0YUZpZWxkTW9kZWxQYXRoIiwicHJvcGVydHlWYWx1ZSIsImlzQW5hbHl0aWNhbEdyb3VwSGVhZGVyRXhwYW5kZWQiLCJpc0FuYWx5dGljcyIsIklzRXhwYW5kZWQiLCJpc0FuYWx5dGljYWxMZWFmIiwiTm9kZUxldmVsIiwiX2dldEZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucyIsImRhdGFGaWVsZEdyb3VwIiwiZmllbGRGb3JtYXRPcHRpb25zIiwiYUZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucyIsIkRhdGEiLCJpbm5lckRhdGFGaWVsZCIsImlzUHJvcGVydHkiLCJpc05hdmlnYXRpb25Qcm9wZXJ0eSIsImRhdGFGaWVsZERlZmF1bHQiLCJMYWJlbCIsImlzRGF0YUZpZWxkVHlwZXMiLCJRdWlja0luZm8iLCJkYXRhcG9pbnRUYXJnZXQiLCJnZXRSb3dTdGF0dXNWaXNpYmlsaXR5IiwiY29sTmFtZSIsImlzU2VtYW50aWNLZXlJbkZpZWxkR3JvdXAiLCJnZXRFcnJvclN0YXR1c1RleHRWaXNpYmlsaXR5Rm9ybWF0dGVyIiwiZXhpc3RpbmdDb2x1bW5zIiwicmVsYXRlZFByb3BlcnR5TmFtZU1hcCIsImdldEFic29sdXRlQW5ub3RhdGlvblBhdGgiLCJyZWxhdGVkQ29sdW1uIiwibmV3TmFtZSIsImlzUGFydE9mTGluZUl0ZW0iLCJpbmNsdWRlcyIsInByb3BlcnR5SW5mbyIsIl9nZXRBbm5vdGF0aW9uQ29sdW1uTmFtZSIsIl9nZXRTaG93RGF0YUZpZWxkc0xhYmVsIiwiZmllbGRHcm91cE5hbWUiLCJvQ29sdW1ucyIsImFDb2x1bW5LZXlzIiwic2hvd0RhdGFGaWVsZHNMYWJlbCIsIl9nZXRSZWxhdGl2ZVBhdGgiLCJpc0xhc3RTbGFzaCIsImlzTGFzdFBhcnQiLCJpU2xhc2hJbmRleCIsImxhc3RJbmRleE9mIiwiX2lzQ29sdW1uU29ydGFibGUiLCJwcm9wZXJ0eVBhdGgiLCJmaWx0ZXJGdW5jdGlvbnMiLCJfZ2V0RmlsdGVyRnVuY3Rpb25zIiwiaXNBcnJheSIsIkNvbnZlcnRlckNvbnRleHQiLCJjYXBhYmlsaXRpZXMiLCJGaWx0ZXJGdW5jdGlvbnMiLCJnZXRFbnRpdHlDb250YWluZXIiLCJfZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JUYWJsZSIsInRleHRMaW5lc0VkaXQiLCJfZmluZFNlbWFudGljS2V5VmFsdWVzIiwiYVNlbWFudGljS2V5VmFsdWVzIiwiYlNlbWFudGljS2V5Rm91bmQiLCJpIiwidmFsdWVzIiwic2VtYW50aWNLZXlGb3VuZCIsIl9maW5kUHJvcGVydGllcyIsInNlbWFudGljS2V5VmFsdWVzIiwiZmllbGRHcm91cFByb3BlcnRpZXMiLCJzZW1hbnRpY0tleUhhc1Byb3BlcnR5SW5GaWVsZEdyb3VwIiwic1Byb3BlcnR5UGF0aCIsInRtcCIsImZpZWxkR3JvdXBQcm9wZXJ0eVBhdGgiLCJfZmluZFNlbWFudGljS2V5VmFsdWVzSW5GaWVsZEdyb3VwIiwiYVByb3BlcnRpZXMiLCJfcHJvcGVydGllc0ZvdW5kIiwiaXNGaWVsZEdyb3VwQ29sdW1uIiwic2VtYW50aWNLZXkiLCJzZW1hbnRpY0tleUluRmllbGRHcm91cCIsImZvcm1hdE9wdGlvbnNPYmoiLCJoYXNEcmFmdEluZGljYXRvciIsInNlbWFudGlja2V5cyIsIm9iamVjdFN0YXR1c1RleHRWaXNpYmlsaXR5IiwiZmllbGRHcm91cERyYWZ0SW5kaWNhdG9yUHJvcGVydHlQYXRoIiwiX2dldEltcE51bWJlciIsIkltcG9ydGFuY2UiLCJfZ2V0RGF0YUZpZWxkSW1wb3J0YW5jZSIsIl9nZXRNYXhJbXBvcnRhbmNlIiwiZmllbGRzIiwibWF4SW1wTnVtYmVyIiwiaW1wTnVtYmVyIiwiRGF0YUZpZWxkV2l0aE1heEltcG9ydGFuY2UiLCJmaWVsZCIsImZpZWxkc1dpdGhJbXBvcnRhbmNlIiwibWFwU2VtYW50aWNLZXlzIiwiZmllbGRHcm91cERhdGEiLCJmaWVsZEdyb3VwSGFzU2VtYW50aWNLZXkiLCJmaWVsZEdyb3VwRGF0YUZpZWxkIiwiSGlnaCIsImZpbHRlciIsIml0ZW0iLCJnZXROb25Tb3J0YWJsZVByb3BlcnRpZXNSZXN0cmljdGlvbnMiLCJsaW5lSXRlbSIsImNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5IiwicmVsYXRlZFByb3BlcnRpZXMiLCJpc1N0YXRpY2FsbHlIaWRkZW4iLCJzTGFiZWwiLCJmaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMiLCJGaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMiLCJpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbiIsIkhUTUw1IiwiQ3NzRGVmYXVsdHMiLCJyZWxhdGVkUHJvcGVydHlOYW1lIiwiYWRkaXRpb25hbFByb3BlcnR5TmFtZSIsIl9nZXRQcm9wZXJ0eU5hbWVzIiwibWF0Y2hlZFByb3BlcnRpZXMiLCJyZXNvbHZlUGF0aCIsIl9hcHBlbmRDdXN0b21UZW1wbGF0ZSIsImludGVybmFsQ29sdW1ucyIsImlzQW5ub3RhdGlvbkNvbHVtbiIsImlzU2xvdENvbHVtbiIsIm1hbmlmZXN0Q29sdW1uIiwiU2xvdCIsImlzQ3VzdG9tQ29sdW1uIiwidmFsaWRhdGVLZXkiLCJiYXNlVGFibGVDb2x1bW4iLCJwb3NpdGlvbiIsImFuY2hvciIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwicHJvcGVydGllc1RvT3ZlcndyaXRlQW5ub3RhdGlvbkNvbHVtbiIsImlzQWN0aW9uTmF2aWdhYmxlIiwiYmFzZU1hbmlmZXN0Q29sdW1uIiwiaGVhZGVyIiwiSG9yaXpvbnRhbEFsaWduIiwiQmVnaW4iLCJpZCIsImN1c3RvbVRhYmxlQ29sdW1uIiwibWVzc2FnZSIsImdldERpYWdub3N0aWNzIiwiYWRkSXNzdWUiLCJJc3N1ZUNhdGVnb3J5IiwiTWFuaWZlc3QiLCJJc3N1ZVNldmVyaXR5IiwiTG93IiwiSXNzdWVDYXRlZ29yeVR5cGUiLCJBbm5vdGF0aW9uQ29sdW1ucyIsIkludmFsaWRLZXkiLCJnZXRQMTNuTW9kZSIsInZhcmlhbnRNYW5hZ2VtZW50IiwiZ2V0VmFyaWFudE1hbmFnZW1lbnQiLCJhUGVyc29uYWxpemF0aW9uIiwiaXNBbmFseXRpY2FsVGFibGUiLCJpc1Jlc3BvbnNpdmVUYWJsZSIsInBlcnNvbmFsaXphdGlvbiIsInNvcnQiLCJhZ2dyZWdhdGUiLCJMaXN0UmVwb3J0IiwiVmFyaWFudE1hbmFnZW1lbnRUeXBlIiwiQ29udHJvbCIsIl9pc0ZpbHRlckJhckhpZGRlbiIsImlzRmlsdGVyQmFySGlkZGVuIiwiaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyIsIkFuYWx5dGljYWxMaXN0UGFnZSIsImdldFNvcnRDb25kaXRpb25zIiwibm9uU29ydGFibGVQcm9wZXJ0aWVzIiwic29ydENvbmRpdGlvbnMiLCJTb3J0T3JkZXIiLCJzb3J0ZXJzIiwiY29uZGl0aW9ucyIsImNvbmRpdGlvbiIsImNvbmRpdGlvblByb3BlcnR5IiwiUHJvcGVydHkiLCJpbmZvTmFtZSIsImNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMiLCJkZXNjZW5kaW5nIiwiRGVzY2VuZGluZyIsInBhdGhzIiwiaW5mb05hbWVzIiwiY3VycmVudFBhdGgiLCJHcm91cEJ5IiwiYUdyb3VwQnkiLCJhR3JvdXBMZXZlbHMiLCJncm91cExldmVscyIsIlRvdGFsIiwiYVRvdGFscyIsInRpdGxlIiwiVHlwZU5hbWVQbHVyYWwiLCJwYWdlTWFuaWZlc3RTZXR0aW5ncyIsImhhc0Fic29sdXRlUGF0aCIsInAxM25Nb2RlIiwiZ2V0VGFibGVJRCIsImNyZWF0aW9uQmVoYXZpb3VyIiwic3RhbmRhcmRBY3Rpb25zQ29udGV4dCIsImdlbmVyYXRlU3RhbmRhcmRBY3Rpb25zQ29udGV4dCIsImdldERlbGV0ZVZpc2liaWxpdHkiLCJjcmVhdGVCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiIsImdldENyZWF0ZVZpc2liaWxpdHkiLCJtYXNzRWRpdEJ1dHRvblZpc2liaWxpdHlFeHByZXNzaW9uIiwiZ2V0TWFzc0VkaXRWaXNpYmlsaXR5IiwiaXNJbnNlcnRVcGRhdGVUZW1wbGF0ZWQiLCJnZXRJbnNlcnRVcGRhdGVBY3Rpb25zVGVtcGxhdGluZyIsImlzRHJhZnRPclN0aWNreVN1cHBvcnRlZCIsInRocmVzaG9sZCIsIk1heEl0ZW1zIiwiaXNTZWFyY2hhYmxlIiwiaXNQYXRoU2VhcmNoYWJsZSIsInN0YW5kYXJkQWN0aW9ucyIsImdldFN0YW5kYXJkQWN0aW9uQ3JlYXRlIiwiZ2V0U3RhbmRhcmRBY3Rpb25EZWxldGUiLCJwYXN0ZSIsImdldFN0YW5kYXJkQWN0aW9uUGFzdGUiLCJtYXNzRWRpdCIsImdldFN0YW5kYXJkQWN0aW9uTWFzc0VkaXQiLCJjcmVhdGlvblJvdyIsImdldENyZWF0aW9uUm93IiwiZW50aXR5TmFtZSIsImNvbGxlY3Rpb24iLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwibmF2aWdhdGlvblBhdGgiLCJyb3ciLCJpc0luRGlzcGxheU1vZGUiLCJhdXRvQmluZE9uSW5pdCIsInNlYXJjaGFibGUiLCJpc0NvbXBsZXhQcm9wZXJ0eSIsImV4cG9ydERhdGFUeXBlIiwic3Vic3RyIiwiZ2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24iLCJzZWxlY3Rpb25WYXJpYW50UGF0aCIsInJlc29sdmVkVGFyZ2V0IiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJzZWxlY3Rpb24iLCJwcm9wZXJ0eU5hbWVzIiwiU2VsZWN0T3B0aW9ucyIsInNlbGVjdE9wdGlvbiIsIlByb3BlcnR5TmFtZSIsInRleHQiLCJfZ2V0RnVsbFNjcmVlbkJhc2VkT25EZXZpY2UiLCJpc0lwaG9uZSIsImVuYWJsZUZ1bGxTY3JlZW4iLCJJc3N1ZVR5cGUiLCJGVUxMU0NSRUVOTU9ERV9OT1RfT05fTElTVFJFUE9SVCIsIl9nZXRNdWx0aVNlbGVjdE1vZGUiLCJtdWx0aVNlbGVjdE1vZGUiLCJzZWxlY3RBbGwiLCJ1c2VJY29uVGFiQmFyIiwiX2dldFRhYmxlVHlwZSIsImlzRGVza3RvcCIsIl9nZXRHcmlkVGFibGVNb2RlIiwiaXNUZW1wbGF0ZUxpc3RSZXBvcnQiLCJyb3dDb3VudE1vZGUiLCJyb3dDb3VudCIsIl9nZXRDb25kZW5zZWRUYWJsZUxheW91dCIsIl90YWJsZVR5cGUiLCJfdGFibGVTZXR0aW5ncyIsImNvbmRlbnNlZFRhYmxlTGF5b3V0IiwiX2dldFRhYmxlU2VsZWN0aW9uTGltaXQiLCJzZWxlY3Rpb25MaW1pdCIsIl9nZXRUYWJsZUlubGluZUNyZWF0aW9uUm93Q291bnQiLCJpbmxpbmVDcmVhdGlvblJvd0NvdW50IiwiX2dldEZpbHRlcnMiLCJxdWlja0ZpbHRlclBhdGhzIiwicXVpY2tTZWxlY3Rpb25WYXJpYW50IiwicXVpY2tGaWx0ZXJzIiwic2hvd0NvdW50cyIsInF1aWNrVmFyaWFudFNlbGVjdGlvbiIsIl9nZXRFbmFibGVFeHBvcnQiLCJlbmFibGVQYXN0ZSIsImVuYWJsZUV4cG9ydCIsIl9nZXRGaWx0ZXJDb25maWd1cmF0aW9uIiwiZmlsdGVycyIsImhpZGVUYWJsZVRpdGxlIiwiaGVhZGVyVmlzaWJsZSIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwiZW5oYW5jZURhdGFNb2RlbFBhdGgiLCJuYXZQcm9wZXJ0eSIsImNoZWNrQ29uZGVuc2VkTGF5b3V0IiwiX21hbmlmZXN0V3JhcHBlciIsImVuYWJsZUF1dG9Db2x1bW5XaWR0aCIsImlzUGhvbmUiLCJ0ZW1wbGF0ZVR5cGUiLCJkYXRhU3RhdGVJbmRpY2F0b3JGaWx0ZXIiLCJpc0NvbmRlbnNlZExheW91dENvbXBsaWFudCIsIm9GaWx0ZXJDb25maWd1cmF0aW9uIiwiY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uIiwiZ3JpZFRhYmxlUm93TW9kZSIsIm9Db25maWd1cmF0aW9uIiwiZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSIsImVuYWJsZU1hc3NFZGl0Iiwic2hvd1Jvd0NvdW50IiwiZ2V0Vmlld0NvbmZpZ3VyYXRpb24iLCJ1c2VDb25kZW5zZWRUYWJsZUxheW91dCIsImlzQ29tcGFjdFR5cGUiLCJvVGFyZ2V0TWFwcGluZyIsIkVETV9UWVBFX01BUFBJTkciLCJ1bmRlcmx5aW5nVHlwZSIsIiRTY2FsZSIsInByZWNpc2lvbiIsIiRQcmVjaXNpb24iLCJtYXhMZW5ndGgiLCIkTWF4TGVuZ3RoIiwibnVsbGFibGUiLCIkTnVsbGFibGUiLCJtaW5pbXVtIiwiaXNOYU4iLCJWYWxpZGF0aW9uIiwiTWluaW11bSIsIm1heGltdW0iLCJNYXhpbXVtIiwiaXNEaWdpdFNlcXVlbmNlIiwiSXNEaWdpdFNlcXVlbmNlIiwicGFyc2VBc1N0cmluZyIsImVtcHR5U3RyaW5nIiwicGFyc2VLZWVwc0VtcHR5U3RyaW5nIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJUYWJsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG5cdEVudGl0eVR5cGUsXG5cdEVudW1WYWx1ZSxcblx0TmF2aWdhdGlvblByb3BlcnR5LFxuXHRQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdFByb3BlcnR5LFxuXHRQcm9wZXJ0eUFubm90YXRpb25WYWx1ZSxcblx0UHJvcGVydHlQYXRoLFxuXHRUeXBlRGVmaW5pdGlvblxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRmlsdGVyRnVuY3Rpb25zIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9DYXBhYmlsaXRpZXNcIjtcbmltcG9ydCB7IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQ2FwYWJpbGl0aWVzX0VkbVwiO1xuaW1wb3J0IHR5cGUgeyBTZW1hbnRpY0tleSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQ29tbW9uXCI7XG5pbXBvcnQgeyBDb21tb25Bbm5vdGF0aW9uVGVybXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NvbW1vblwiO1xuaW1wb3J0IHsgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ29tbW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tb25fRWRtXCI7XG5pbXBvcnQgeyBFbnRpdHlTZXRBbm5vdGF0aW9uc19TZXNzaW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9TZXNzaW9uX0VkbVwiO1xuaW1wb3J0IHR5cGUge1xuXHRDcml0aWNhbGl0eVR5cGUsXG5cdERhdGFGaWVsZCxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RGF0YUZpZWxkRm9yQWN0aW9uLFxuXHREYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24sXG5cdERhdGFGaWVsZFR5cGVzLFxuXHREYXRhUG9pbnQsXG5cdERhdGFQb2ludFR5cGVUeXBlcyxcblx0RmllbGRHcm91cFR5cGUsXG5cdExpbmVJdGVtLFxuXHRQcmVzZW50YXRpb25WYXJpYW50VHlwZSxcblx0U2VsZWN0aW9uVmFyaWFudFR5cGUsXG5cdFNlbGVjdE9wdGlvblR5cGVcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHsgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgdHlwZSB7IENvbXBsZXhQcm9wZXJ0eUluZm8gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcbmltcG9ydCB7XG5cdGNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyxcblx0Y29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHksXG5cdGdldERhdGFGaWVsZERhdGFUeXBlLFxuXHRnZXRTZW1hbnRpY09iamVjdFBhdGgsXG5cdGlzRGF0YUZpZWxkQWx3YXlzSGlkZGVuLFxuXHRpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0LFxuXHRpc0RhdGFGaWVsZFR5cGVzXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2Fubm90YXRpb25zL0RhdGFGaWVsZFwiO1xuaW1wb3J0IHR5cGUgeyBBbm5vdGF0aW9uQWN0aW9uLCBCYXNlQWN0aW9uLCBDb21iaW5lZEFjdGlvbiwgQ3VzdG9tQWN0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCwgaXNBY3Rpb25OYXZpZ2FibGUsIHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vQWN0aW9uXCI7XG5pbXBvcnQgeyBFbnRpdHksIFVJIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9CaW5kaW5nSGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IENvbmZpZ3VyYWJsZU9iamVjdCwgQ3VzdG9tRWxlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBpbnNlcnRDdXN0b21FbGVtZW50cywgUGxhY2VtZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlQ2F0ZWdvcnlUeXBlLCBJc3N1ZVNldmVyaXR5LCBJc3N1ZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB0YWJsZUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVGFibGVGb3JtYXR0ZXJcIjtcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVGFibGVGb3JtYXR0ZXJUeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24sIENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7XG5cdGFuZCxcblx0Y29tcGlsZUV4cHJlc3Npb24sXG5cdGNvbnN0YW50LFxuXHRlcXVhbCxcblx0Zm9ybWF0UmVzdWx0LFxuXHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24sXG5cdGlmRWxzZSxcblx0aXNDb25zdGFudCxcblx0bm90LFxuXHRvcixcblx0cGF0aEluTW9kZWwsXG5cdHJlc29sdmVCaW5kaW5nU3RyaW5nXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCB7IHJlcGxhY2VTcGVjaWFsQ2hhcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IHtcblx0RGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0ZW5oYW5jZURhdGFNb2RlbFBhdGgsXG5cdGdldFRhcmdldE9iamVjdFBhdGgsXG5cdGlzUGF0aERlbGV0YWJsZSxcblx0aXNQYXRoU2VhcmNoYWJsZSxcblx0aXNQYXRoVXBkYXRhYmxlXG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgRGlzcGxheU1vZGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EaXNwbGF5TW9kZUZvcm1hdHRlclwiO1xuaW1wb3J0IHsgRURNX1RZUEVfTUFQUElORywgZ2V0RGlzcGxheU1vZGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EaXNwbGF5TW9kZUZvcm1hdHRlclwiO1xuaW1wb3J0IHsgZ2V0Tm9uU29ydGFibGVQcm9wZXJ0aWVzUmVzdHJpY3Rpb25zIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRW50aXR5U2V0SGVscGVyXCI7XG5pbXBvcnQge1xuXHRnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSxcblx0Z2V0QXNzb2NpYXRlZFRpbWV6b25lUHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHksXG5cdGdldFRhcmdldFZhbHVlT25EYXRhUG9pbnQsXG5cdGlzTmF2aWdhdGlvblByb3BlcnR5LFxuXHRpc1BhdGhFeHByZXNzaW9uLFxuXHRpc1Byb3BlcnR5XG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgQWN0aW9uSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL2ludGVybmFsL2hlbHBlcnMvQWN0aW9uSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCIuLi8uLi9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBBZ2dyZWdhdGlvbkhlbHBlciB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0FnZ3JlZ2F0aW9uXCI7XG5pbXBvcnQgeyBpc1JlZmVyZW5jZVByb3BlcnR5U3RhdGljYWxseUhpZGRlbiB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0RhdGFGaWVsZEhlbHBlclwiO1xuaW1wb3J0IHsgZ2V0VGFibGVJRCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0lEXCI7XG5pbXBvcnQgdHlwZSB7XG5cdEN1c3RvbURlZmluZWRUYWJsZUNvbHVtbixcblx0Q3VzdG9tRGVmaW5lZFRhYmxlQ29sdW1uRm9yT3ZlcnJpZGUsXG5cdEZvcm1hdE9wdGlvbnNUeXBlLFxuXHROYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLFxuXHROYXZpZ2F0aW9uVGFyZ2V0Q29uZmlndXJhdGlvbixcblx0VGFibGVDb2x1bW5TZXR0aW5ncyxcblx0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdFZpZXdQYXRoQ29uZmlndXJhdGlvblxufSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHtcblx0QWN0aW9uVHlwZSxcblx0QXZhaWxhYmlsaXR5VHlwZSxcblx0Q3JlYXRpb25Nb2RlLFxuXHRIb3Jpem9udGFsQWxpZ24sXG5cdEltcG9ydGFuY2UsXG5cdFNlbGVjdGlvbk1vZGUsXG5cdFRlbXBsYXRlVHlwZSxcblx0VmFyaWFudE1hbmFnZW1lbnRUeXBlLFxuXHRWaXN1YWxpemF0aW9uVHlwZVxufSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHR5cGUgTWFuaWZlc3RXcmFwcGVyIGZyb20gXCIuLi8uLi9NYW5pZmVzdFdyYXBwZXJcIjtcbmltcG9ydCB7IGdldE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5VHlwZSB9IGZyb20gXCIuL0NyaXRpY2FsaXR5XCI7XG5pbXBvcnQgdHlwZSB7IFN0YW5kYXJkQWN0aW9uQ29uZmlnVHlwZSB9IGZyb20gXCIuL3RhYmxlL1N0YW5kYXJkQWN0aW9uc1wiO1xuaW1wb3J0IHtcblx0Z2VuZXJhdGVTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRnZXRDcmVhdGVWaXNpYmlsaXR5LFxuXHRnZXRDcmVhdGlvblJvdyxcblx0Z2V0RGVsZXRlVmlzaWJpbGl0eSxcblx0Z2V0SW5zZXJ0VXBkYXRlQWN0aW9uc1RlbXBsYXRpbmcsXG5cdGdldE1hc3NFZGl0VmlzaWJpbGl0eSxcblx0Z2V0UmVzdHJpY3Rpb25zLFxuXHRnZXRTdGFuZGFyZEFjdGlvbkNyZWF0ZSxcblx0Z2V0U3RhbmRhcmRBY3Rpb25EZWxldGUsXG5cdGdldFN0YW5kYXJkQWN0aW9uTWFzc0VkaXQsXG5cdGdldFN0YW5kYXJkQWN0aW9uUGFzdGUsXG5cdGlzRHJhZnRPclN0aWNreVN1cHBvcnRlZCxcblx0aXNJbkRpc3BsYXlNb2RlXG59IGZyb20gXCIuL3RhYmxlL1N0YW5kYXJkQWN0aW9uc1wiO1xuXG5leHBvcnQgdHlwZSBUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uID0ge1xuXHRhdXRvQmluZE9uSW5pdDogYm9vbGVhbjtcblx0Y29sbGVjdGlvbjogc3RyaW5nO1xuXHR2YXJpYW50TWFuYWdlbWVudDogVmFyaWFudE1hbmFnZW1lbnRUeXBlO1xuXHRmaWx0ZXJJZD86IHN0cmluZztcblx0aWQ6IHN0cmluZztcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZztcblx0cDEzbk1vZGU/OiBzdHJpbmc7XG5cdHJvdz86IHtcblx0XHRhY3Rpb24/OiBzdHJpbmc7XG5cdFx0cHJlc3M/OiBzdHJpbmc7XG5cdFx0cm93SGlnaGxpZ2h0aW5nOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0XHRyb3dOYXZpZ2F0ZWQ6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHRcdHZpc2libGU/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0fTtcblx0c2VsZWN0aW9uTW9kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRzdGFuZGFyZEFjdGlvbnM6IHtcblx0XHRhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBTdGFuZGFyZEFjdGlvbkNvbmZpZ1R5cGU+O1xuXHRcdGlzSW5zZXJ0VXBkYXRlVGVtcGxhdGVkOiBib29sZWFuO1xuXHRcdHVwZGF0YWJsZVByb3BlcnR5UGF0aDogc3RyaW5nO1xuXHR9O1xuXHRkaXNwbGF5TW9kZT86IGJvb2xlYW47XG5cdHRocmVzaG9sZDogbnVtYmVyO1xuXHRlbnRpdHlOYW1lOiBzdHJpbmc7XG5cdHNvcnRDb25kaXRpb25zPzogc3RyaW5nO1xuXHRncm91cENvbmRpdGlvbnM/OiBzdHJpbmc7XG5cdGFnZ3JlZ2F0ZUNvbmRpdGlvbnM/OiBzdHJpbmc7XG5cblx0LyoqIENyZWF0ZSBuZXcgZW50cmllcyAqL1xuXHRjcmVhdGU6IENyZWF0ZUJlaGF2aW9yIHwgQ3JlYXRlQmVoYXZpb3JFeHRlcm5hbDtcblx0dGl0bGU6IHN0cmluZztcblx0c2VhcmNoYWJsZTogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogTmV3IGVudHJpZXMgYXJlIGNyZWF0ZWQgd2l0aGluIHRoZSBhcHAgKGRlZmF1bHQgY2FzZSlcbiAqL1xudHlwZSBDcmVhdGVCZWhhdmlvciA9IHtcblx0bW9kZTogQ3JlYXRpb25Nb2RlO1xuXHRhcHBlbmQ6IGJvb2xlYW47XG5cdG5ld0FjdGlvbj86IHN0cmluZztcblx0bmF2aWdhdGVUb1RhcmdldD86IHN0cmluZztcbn07XG5cbi8qKlxuICogTmV3IGVudHJpZXMgYXJlIGNyZWF0ZWQgYnkgbmF2aWdhdGluZyB0byBzb21lIHRhcmdldFxuICovXG50eXBlIENyZWF0ZUJlaGF2aW9yRXh0ZXJuYWwgPSB7XG5cdG1vZGU6IFwiRXh0ZXJuYWxcIjtcblx0b3V0Ym91bmQ6IHN0cmluZztcblx0b3V0Ym91bmREZXRhaWw6IE5hdmlnYXRpb25UYXJnZXRDb25maWd1cmF0aW9uW1wib3V0Ym91bmREZXRhaWxcIl07XG5cdG5hdmlnYXRpb25TZXR0aW5nczogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbjtcbn07XG5cbmV4cG9ydCB0eXBlIFRhYmxlQ2FwYWJpbGl0eVJlc3RyaWN0aW9uID0ge1xuXHRpc0RlbGV0YWJsZTogYm9vbGVhbjtcblx0aXNVcGRhdGFibGU6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZUZpbHRlcnNDb25maWd1cmF0aW9uID0ge1xuXHRlbmFibGVkPzogc3RyaW5nIHwgYm9vbGVhbjtcblx0cGF0aHM6IFtcblx0XHR7XG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRcdH1cblx0XTtcblx0c2hvd0NvdW50cz86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiA9IHtcblx0cHJvcGVydHlOYW1lczogc3RyaW5nW107XG5cdHRleHQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uID0ge1xuXHRjcmVhdGVBdEVuZDogYm9vbGVhbjtcblx0Y3JlYXRpb25Nb2RlOiBDcmVhdGlvbk1vZGU7XG5cdGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGE6IGJvb2xlYW47XG5cdGN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHR1c2VDb25kZW5zZWRUYWJsZUxheW91dDogYm9vbGVhbjtcblx0ZW5hYmxlRXhwb3J0OiBib29sZWFuO1xuXHRoZWFkZXJWaXNpYmxlOiBib29sZWFuO1xuXHRmaWx0ZXJzPzogUmVjb3JkPHN0cmluZywgVGFibGVGaWx0ZXJzQ29uZmlndXJhdGlvbj47XG5cdHR5cGU6IFRhYmxlVHlwZTtcblx0cm93Q291bnRNb2RlOiBHcmlkVGFibGVSb3dDb3VudE1vZGU7XG5cdHJvd0NvdW50OiBudW1iZXI7XG5cdHNlbGVjdEFsbD86IGJvb2xlYW47XG5cdHNlbGVjdGlvbkxpbWl0OiBudW1iZXI7XG5cdG11bHRpU2VsZWN0TW9kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRlbmFibGVQYXN0ZTogYm9vbGVhbjtcblx0ZW5hYmxlRnVsbFNjcmVlbjogYm9vbGVhbjtcblx0c2hvd1Jvd0NvdW50OiBib29sZWFuO1xuXHRpbmxpbmVDcmVhdGlvblJvd0NvdW50PzogbnVtYmVyO1xuXHRlbmFibGVNYXNzRWRpdDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblx0ZW5hYmxlQXV0b0NvbHVtbldpZHRoOiBib29sZWFuO1xuXHRkYXRhU3RhdGVJbmRpY2F0b3JGaWx0ZXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0aXNDb21wYWN0VHlwZT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZVR5cGUgPSBcIkdyaWRUYWJsZVwiIHwgXCJSZXNwb25zaXZlVGFibGVcIiB8IFwiQW5hbHl0aWNhbFRhYmxlXCI7XG5leHBvcnQgdHlwZSBHcmlkVGFibGVSb3dDb3VudE1vZGUgPSBcIkF1dG9cIiB8IFwiRml4ZWRcIjtcblxuZW51bSBDb2x1bW5UeXBlIHtcblx0RGVmYXVsdCA9IFwiRGVmYXVsdFwiLCAvLyBEZWZhdWx0IFR5cGUgKEN1c3RvbSBDb2x1bW4pXG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIixcblx0U2xvdCA9IFwiU2xvdFwiXG59XG5cbi8vIEN1c3RvbSBDb2x1bW4gZnJvbSBNYW5pZmVzdFxuZXhwb3J0IHR5cGUgTWFuaWZlc3REZWZpbmVkQ3VzdG9tQ29sdW1uID0gQ3VzdG9tRGVmaW5lZFRhYmxlQ29sdW1uICYge1xuXHR0eXBlPzogQ29sdW1uVHlwZS5EZWZhdWx0O1xufTtcblxuLy8gU2xvdCBDb2x1bW4gZnJvbSBCdWlsZGluZyBCbG9ja1xuZXhwb3J0IHR5cGUgRnJhZ21lbnREZWZpbmVkU2xvdENvbHVtbiA9IEN1c3RvbURlZmluZWRUYWJsZUNvbHVtbiAmIHtcblx0dHlwZTogQ29sdW1uVHlwZS5TbG90O1xufTtcblxuLy8gUHJvcGVydGllcyBhbGwgQ29sdW1uVHlwZXMgaGF2ZTpcbmV4cG9ydCB0eXBlIEJhc2VUYWJsZUNvbHVtbiA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0dHlwZTogQ29sdW1uVHlwZTsgLy9PcmlnaW4gb2YgdGhlIHNvdXJjZSB3aGVyZSB3ZSBhcmUgZ2V0dGluZyB0aGUgdGVtcGxhdGVkIGluZm9ybWF0aW9uIGZyb21cblx0d2lkdGg/OiBzdHJpbmc7XG5cdGltcG9ydGFuY2U/OiBJbXBvcnRhbmNlO1xuXHRob3Jpem9udGFsQWxpZ24/OiBIb3Jpem9udGFsQWxpZ247XG5cdGF2YWlsYWJpbGl0eT86IEF2YWlsYWJpbGl0eVR5cGU7XG5cdGlzTmF2aWdhYmxlPzogYm9vbGVhbjtcblx0Y2FzZVNlbnNpdGl2ZTogYm9vbGVhbjtcbn07XG5cbi8vIFByb3BlcnRpZXMgb24gQ3VzdG9tIENvbHVtbnMgYW5kIFNsb3QgQ29sdW1uc1xuZXhwb3J0IHR5cGUgQ3VzdG9tQmFzZWRUYWJsZUNvbHVtbiA9IEJhc2VUYWJsZUNvbHVtbiAmIHtcblx0aWQ6IHN0cmluZztcblx0bmFtZTogc3RyaW5nO1xuXHRoZWFkZXI/OiBzdHJpbmc7XG5cdHRlbXBsYXRlOiBzdHJpbmc7XG5cdHByb3BlcnR5SW5mb3M/OiBzdHJpbmdbXTtcblx0ZXhwb3J0U2V0dGluZ3M/OiB7XG5cdFx0dGVtcGxhdGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHR3cmFwOiBib29sZWFuO1xuXHR9IHwgbnVsbDtcblx0Zm9ybWF0T3B0aW9uczogeyB0ZXh0TGluZXNFZGl0OiBudW1iZXIgfTtcblx0aXNHcm91cGFibGU6IGJvb2xlYW47XG5cdGlzTmF2aWdhYmxlOiBib29sZWFuO1xuXHRzb3J0YWJsZTogYm9vbGVhbjtcblx0dmlzdWFsU2V0dGluZ3M6IHsgd2lkdGhDYWxjdWxhdGlvbjogbnVsbCB9O1xufTtcblxuLy8gUHJvcGVydGllcyBkZXJpdmVkIGZyb20gTWFuaWZlc3QgdG8gb3ZlcnJpZGUgQW5ub3RhdGlvbiBjb25maWd1cmF0aW9uc1xuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblRhYmxlQ29sdW1uRm9yT3ZlcnJpZGUgPSBCYXNlVGFibGVDb2x1bW4gJiB7XG5cdHNldHRpbmdzPzogVGFibGVDb2x1bW5TZXR0aW5ncztcblx0Zm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuLy8gUHJvcGVydGllcyBmb3IgQW5ub3RhdGlvbiBDb2x1bW5zXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uVGFibGVDb2x1bW4gPSBBbm5vdGF0aW9uVGFibGVDb2x1bW5Gb3JPdmVycmlkZSAmIHtcblx0bmFtZTogc3RyaW5nO1xuXHRwcm9wZXJ0eUluZm9zPzogc3RyaW5nW107XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdHJlbGF0aXZlUGF0aDogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0dG9vbHRpcD86IHN0cmluZztcblx0Z3JvdXBMYWJlbD86IHN0cmluZztcblx0Z3JvdXA/OiBzdHJpbmc7XG5cdEZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucz86IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHRzaG93RGF0YUZpZWxkc0xhYmVsPzogYm9vbGVhbjtcblx0aXNLZXk/OiBib29sZWFuO1xuXHRpc0dyb3VwYWJsZTogYm9vbGVhbjtcblx0dW5pdD86IHN0cmluZztcblx0dW5pdFRleHQ/OiBzdHJpbmc7XG5cdHRpbWV6b25lVGV4dD86IHN0cmluZztcblx0dGltZXpvbmU/OiBzdHJpbmc7XG5cdHNlbWFudGljT2JqZWN0UGF0aD86IHN0cmluZztcblx0c29ydGFibGU6IGJvb2xlYW47XG5cdGV4cG9ydFNldHRpbmdzPzoge1xuXHRcdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRcdGxhYmVsPzogc3RyaW5nO1xuXHRcdHdyYXA/OiBib29sZWFuO1xuXHRcdHR5cGU/OiBzdHJpbmc7XG5cdFx0aW5wdXRGb3JtYXQ/OiBzdHJpbmc7XG5cdFx0Zm9ybWF0Pzogc3RyaW5nO1xuXHRcdHNjYWxlPzogbnVtYmVyO1xuXHRcdGRlbGltaXRlcj86IGJvb2xlYW47XG5cdFx0dW5pdD86IHN0cmluZztcblx0XHR1bml0UHJvcGVydHk/OiBzdHJpbmc7XG5cdFx0dGltZXpvbmU/OiBzdHJpbmc7XG5cdFx0dGltZXpvbmVQcm9wZXJ0eT86IHN0cmluZztcblx0XHR1dGM/OiBib29sZWFuO1xuXHR9O1xuXHRpc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eT86IGJvb2xlYW47XG5cdHRleHRBcnJhbmdlbWVudD86IHtcblx0XHR0ZXh0UHJvcGVydHk6IHN0cmluZztcblx0XHRtb2RlOiBEaXNwbGF5TW9kZTtcblx0fTtcblx0YWRkaXRpb25hbFByb3BlcnR5SW5mb3M/OiBzdHJpbmdbXTtcblx0dmlzdWFsU2V0dGluZ3M/OiBWaXN1YWxTZXR0aW5ncztcblx0dHlwZUNvbmZpZz86IG9iamVjdDtcblx0aXNQYXJ0T2ZMaW5lSXRlbT86IGJvb2xlYW47IC8vIHRlbXBvcmFyeSBpbmRpY2F0b3IgdG8gb25seSBhbGxvdyBmaWx0ZXJpbmcgb24gbmF2aWdhdGlvbiBwcm9wZXJ0aWVzIHdoZW4gdGhleSdyZSBwYXJ0IG9mIGEgbGluZSBpdGVtXG5cdGFkZGl0aW9uYWxMYWJlbHM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFZpc3VhbFNldHRpbmdzID0ge1xuXHR3aWR0aENhbGN1bGF0aW9uPzogV2lkdGhDYWxjdWxhdGlvbjtcbn07XG5cbmV4cG9ydCB0eXBlIFdpZHRoQ2FsY3VsYXRpb24gPSBudWxsIHwge1xuXHRtaW5XaWR0aD86IG51bWJlcjtcblx0bWF4V2lkdGg/OiBudW1iZXI7XG5cdGRlZmF1bHRXaWR0aD86IG51bWJlcjtcblx0aW5jbHVkZUxhYmVsPzogYm9vbGVhbjtcblx0Z2FwPzogbnVtYmVyO1xuXHQvLyBvbmx5IHJlbGV2YW50IGZvciBjb21wbGV4IHR5cGVzXG5cdGV4Y2x1ZGVQcm9wZXJ0aWVzPzogc3RyaW5nW107XG5cdHZlcnRpY2FsQXJyYW5nZW1lbnQ/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgVGFibGVDb2x1bW4gPSBDdXN0b21CYXNlZFRhYmxlQ29sdW1uIHwgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuZXhwb3J0IHR5cGUgTWFuaWZlc3RDb2x1bW4gPSBDdXN0b21FbGVtZW50PEN1c3RvbUJhc2VkVGFibGVDb2x1bW4gfCBBbm5vdGF0aW9uVGFibGVDb2x1bW5Gb3JPdmVycmlkZT47XG5cbmV4cG9ydCB0eXBlIEFnZ3JlZ2F0ZURhdGEgPSB7XG5cdGRlZmF1bHRBZ2dyZWdhdGU6IHtcblx0XHRjb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzPzogc3RyaW5nW107XG5cdH07XG5cdHJlbGF0aXZlUGF0aDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgVGFibGVWaXN1YWxpemF0aW9uID0ge1xuXHR0eXBlOiBWaXN1YWxpemF0aW9uVHlwZS5UYWJsZTtcblx0YW5ub3RhdGlvbjogVGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbjtcblx0Y29udHJvbDogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbjtcblx0Y29sdW1uczogVGFibGVDb2x1bW5bXTtcblx0YWN0aW9uczogQmFzZUFjdGlvbltdO1xuXHRjb21tYW5kQWN0aW9ucz86IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj47XG5cdGFnZ3JlZ2F0ZXM/OiBSZWNvcmQ8c3RyaW5nLCBBZ2dyZWdhdGVEYXRhPjtcblx0ZW5hYmxlQW5hbHl0aWNzPzogYm9vbGVhbjtcblx0ZW5hYmxlQW5hbHl0aWNzU2VhcmNoPzogYm9vbGVhbjtcblx0b3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBzdHJpbmc7XG5cdG9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXM6IHN0cmluZztcblx0aGVhZGVySW5mb1RpdGxlOiBzdHJpbmc7XG5cdHNlbWFudGljS2V5czogc3RyaW5nW107XG5cdGhlYWRlckluZm9UeXBlTmFtZTogUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8U3RyaW5nPiB8IHVuZGVmaW5lZDtcbn07XG5cbnR5cGUgU29ydGVyVHlwZSA9IHtcblx0bmFtZTogc3RyaW5nO1xuXHRkZXNjZW5kaW5nOiBib29sZWFuO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBhbm5vdGF0aW9uLWJhc2VkIGFuZCBtYW5pZmVzdC1iYXNlZCB0YWJsZSBhY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBsaW5lSXRlbUFubm90YXRpb25cbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBuYXZpZ2F0aW9uU2V0dGluZ3NcbiAqIEByZXR1cm5zIFRoZSBjb21wbGV0ZSB0YWJsZSBhY3Rpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZUFjdGlvbnMoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb25cbik6IENvbWJpbmVkQWN0aW9uIHtcblx0Y29uc3QgYVRhYmxlQWN0aW9ucyA9IGdldFRhYmxlQW5ub3RhdGlvbkFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGFBbm5vdGF0aW9uQWN0aW9ucyA9IGFUYWJsZUFjdGlvbnMudGFibGVBY3Rpb25zO1xuXHRjb25zdCBhSGlkZGVuQWN0aW9ucyA9IGFUYWJsZUFjdGlvbnMuaGlkZGVuVGFibGVBY3Rpb25zO1xuXHRjb25zdCBtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCkuYWN0aW9ucyxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGFBbm5vdGF0aW9uQWN0aW9ucyxcblx0XHRuYXZpZ2F0aW9uU2V0dGluZ3MsXG5cdFx0dHJ1ZSxcblx0XHRhSGlkZGVuQWN0aW9uc1xuXHQpO1xuXHRjb25zdCBhY3Rpb25zID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYUFubm90YXRpb25BY3Rpb25zLCBtYW5pZmVzdEFjdGlvbnMuYWN0aW9ucywge1xuXHRcdGlzTmF2aWdhYmxlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGVuYWJsZU9uU2VsZWN0OiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGVuYWJsZUF1dG9TY3JvbGw6IFwib3ZlcndyaXRlXCIsXG5cdFx0ZW5hYmxlZDogXCJvdmVyd3JpdGVcIixcblx0XHR2aXNpYmxlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbjogXCJvdmVyd3JpdGVcIixcblx0XHRjb21tYW5kOiBcIm92ZXJ3cml0ZVwiXG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0XCJhY3Rpb25zXCI6IGFjdGlvbnMsXG5cdFx0XCJjb21tYW5kQWN0aW9uc1wiOiBtYW5pZmVzdEFjdGlvbnMuY29tbWFuZEFjdGlvbnNcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBjb2x1bW5zLCBhbm5vdGF0aW9uLWJhc2VkIGFzIHdlbGwgYXMgbWFuaWZlc3QgYmFzZWQuXG4gKiBUaGV5IGFyZSBzb3J0ZWQgYW5kIHNvbWUgcHJvcGVydGllcyBjYW4gYmUgb3ZlcndyaXR0ZW4gdmlhIHRoZSBtYW5pZmVzdCAoY2hlY2sgb3V0IHRoZSBrZXlzIHRoYXQgY2FuIGJlIG92ZXJ3cml0dGVuKS5cbiAqXG4gKiBAcGFyYW0gbGluZUl0ZW1Bbm5vdGF0aW9uIENvbGxlY3Rpb24gb2YgZGF0YSBmaWVsZHMgZm9yIHJlcHJlc2VudGF0aW9uIGluIGEgdGFibGUgb3IgbGlzdFxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMgUmV0dXJucyBhbGwgdGFibGUgY29sdW1ucyB0aGF0IHNob3VsZCBiZSBhdmFpbGFibGUsIHJlZ2FyZGxlc3Mgb2YgdGVtcGxhdGluZyBvciBwZXJzb25hbGl6YXRpb24gb3IgdGhlaXIgb3JpZ2luXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZUNvbHVtbnMoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb25cbik6IFRhYmxlQ29sdW1uW10ge1xuXHRjb25zdCBhbm5vdGF0aW9uQ29sdW1ucyA9IGdldENvbHVtbnNGcm9tQW5ub3RhdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IG1hbmlmZXN0Q29sdW1ucyA9IGdldENvbHVtbnNGcm9tTWFuaWZlc3QoXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKS5jb2x1bW5zLFxuXHRcdGFubm90YXRpb25Db2x1bW5zLFxuXHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShsaW5lSXRlbUFubm90YXRpb24pLFxuXHRcdG5hdmlnYXRpb25TZXR0aW5nc1xuXHQpO1xuXG5cdHJldHVybiBpbnNlcnRDdXN0b21FbGVtZW50cyhhbm5vdGF0aW9uQ29sdW1ucyBhcyBUYWJsZUNvbHVtbltdLCBtYW5pZmVzdENvbHVtbnMgYXMgUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudDxUYWJsZUNvbHVtbj4+LCB7XG5cdFx0d2lkdGg6IFwib3ZlcndyaXRlXCIsXG5cdFx0aW1wb3J0YW5jZTogXCJvdmVyd3JpdGVcIixcblx0XHRob3Jpem9udGFsQWxpZ246IFwib3ZlcndyaXRlXCIsXG5cdFx0YXZhaWxhYmlsaXR5OiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGlzTmF2aWdhYmxlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdHNldHRpbmdzOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGZvcm1hdE9wdGlvbnM6IFwib3ZlcndyaXRlXCJcblx0fSk7XG59XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGN1c3RvbSBhZ2dyZWdhdGlvbiBkZWZpbml0aW9ucyBmcm9tIHRoZSBlbnRpdHlUeXBlLlxuICpcbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSB0YXJnZXQgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gdGFibGVDb2x1bW5zIFRoZSBhcnJheSBvZiBjb2x1bW5zIGZvciB0aGUgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHQuXG4gKiBAcmV0dXJucyBUaGUgYWdncmVnYXRlIGRlZmluaXRpb25zIGZyb20gdGhlIGVudGl0eVR5cGUsIG9yIHVuZGVmaW5lZCBpZiB0aGUgZW50aXR5IGRvZXNuJ3Qgc3VwcG9ydCBhbmFseXRpY2FsIHF1ZXJpZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBZ2dyZWdhdGVEZWZpbml0aW9uc0Zyb21FbnRpdHlUeXBlID0gZnVuY3Rpb24gKFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHR0YWJsZUNvbHVtbnM6IFRhYmxlQ29sdW1uW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEFnZ3JlZ2F0ZURhdGE+IHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0ZnVuY3Rpb24gZmluZENvbHVtbkZyb21QYXRoKHBhdGg6IHN0cmluZyk6IFRhYmxlQ29sdW1uIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGFibGVDb2x1bW5zLmZpbmQoKGNvbHVtbikgPT4ge1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQgJiYgYW5ub3RhdGlvbkNvbHVtbi5yZWxhdGl2ZVBhdGggPT09IHBhdGg7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIWFnZ3JlZ2F0aW9uSGVscGVyLmlzQW5hbHl0aWNzU3VwcG9ydGVkKCkpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gS2VlcCBhIHNldCBvZiBhbGwgY3VycmVuY3kvdW5pdCBwcm9wZXJ0aWVzLCBhcyB3ZSBkb24ndCB3YW50IHRvIGNvbnNpZGVyIHRoZW0gYXMgYWdncmVnYXRlc1xuXHQvLyBUaGV5IGFyZSBhZ2dyZWdhdGVzIGZvciB0ZWNobmljYWwgcmVhc29ucyAodG8gbWFuYWdlIG11bHRpLXVuaXRzIHNpdHVhdGlvbnMpIGJ1dCBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgZnJvbSBhIHVzZXIgc3RhbmRwb2ludFxuXHRjb25zdCBtQ3VycmVuY3lPclVuaXRQcm9wZXJ0aWVzID0gbmV3IFNldCgpO1xuXHR0YWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbHVtbikgPT4ge1xuXHRcdGNvbnN0IG9UYWJsZUNvbHVtbiA9IG9Db2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdGlmIChvVGFibGVDb2x1bW4udW5pdCkge1xuXHRcdFx0bUN1cnJlbmN5T3JVbml0UHJvcGVydGllcy5hZGQob1RhYmxlQ29sdW1uLnVuaXQpO1xuXHRcdH1cblx0fSk7XG5cblx0Y29uc3QgYUN1c3RvbUFnZ3JlZ2F0ZUFubm90YXRpb25zID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMoKTtcblx0Y29uc3QgbVJhd0RlZmluaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcblxuXHRhQ3VzdG9tQWdncmVnYXRlQW5ub3RhdGlvbnMuZm9yRWFjaCgoYW5ub3RhdGlvbikgPT4ge1xuXHRcdGNvbnN0IG9BZ2dyZWdhdGVkUHJvcGVydHkgPSBhZ2dyZWdhdGlvbkhlbHBlci5fZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZpbmQoKG9Qcm9wZXJ0eSkgPT4ge1xuXHRcdFx0cmV0dXJuIG9Qcm9wZXJ0eS5uYW1lID09PSBhbm5vdGF0aW9uLnF1YWxpZmllcjtcblx0XHR9KTtcblxuXHRcdGlmIChvQWdncmVnYXRlZFByb3BlcnR5KSB7XG5cdFx0XHRjb25zdCBhQ29udGV4dERlZmluaW5nUHJvcGVydGllcyA9IGFubm90YXRpb24uYW5ub3RhdGlvbnM/LkFnZ3JlZ2F0aW9uPy5Db250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzO1xuXHRcdFx0bVJhd0RlZmluaXRpb25zW29BZ2dyZWdhdGVkUHJvcGVydHkubmFtZV0gPSBhQ29udGV4dERlZmluaW5nUHJvcGVydGllc1xuXHRcdFx0XHQ/IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLm1hcCgob0N0eERlZlByb3BlcnR5KSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb0N0eERlZlByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHQgIH0pXG5cdFx0XHRcdDogW107XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgbVJlc3VsdDogUmVjb3JkPHN0cmluZywgQWdncmVnYXRlRGF0YT4gPSB7fTtcblxuXHR0YWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbHVtbikgPT4ge1xuXHRcdGNvbnN0IG9UYWJsZUNvbHVtbiA9IG9Db2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdGlmIChvVGFibGVDb2x1bW4ucHJvcGVydHlJbmZvcyA9PT0gdW5kZWZpbmVkICYmIG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGgpIHtcblx0XHRcdGNvbnN0IGFSYXdDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzID0gbVJhd0RlZmluaXRpb25zW29UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGhdO1xuXG5cdFx0XHQvLyBJZ25vcmUgYWdncmVnYXRlcyBjb3JyZXNwb25kaW5nIHRvIGN1cnJlbmNpZXMgb3IgdW5pdHMgb2YgbWVhc3VyZSBhbmQgZHVtbXkgY3JlYXRlZCBwcm9wZXJ0eSBmb3IgZGF0YXBvaW50IHRhcmdldCBWYWx1ZVxuXHRcdFx0aWYgKFxuXHRcdFx0XHRhUmF3Q29udGV4dERlZmluaW5nUHJvcGVydGllcyAmJlxuXHRcdFx0XHQhbUN1cnJlbmN5T3JVbml0UHJvcGVydGllcy5oYXMob1RhYmxlQ29sdW1uLm5hbWUpICYmXG5cdFx0XHRcdCFvVGFibGVDb2x1bW4uaXNEYXRhUG9pbnRGYWtlVGFyZ2V0UHJvcGVydHlcblx0XHRcdCkge1xuXHRcdFx0XHRtUmVzdWx0W29UYWJsZUNvbHVtbi5uYW1lXSA9IHtcblx0XHRcdFx0XHRkZWZhdWx0QWdncmVnYXRlOiB7fSxcblx0XHRcdFx0XHRyZWxhdGl2ZVBhdGg6IG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGhcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3QgYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM6IHN0cmluZ1tdID0gW107XG5cdFx0XHRcdGFSYXdDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLmZvckVhY2goKGNvbnRleHREZWZpbmluZ1Byb3BlcnR5TmFtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGZvdW5kQ29sdW1uID0gZmluZENvbHVtbkZyb21QYXRoKGNvbnRleHREZWZpbmluZ1Byb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0aWYgKGZvdW5kQ29sdW1uKSB7XG5cdFx0XHRcdFx0XHRhQ29udGV4dERlZmluaW5nUHJvcGVydGllcy5wdXNoKGZvdW5kQ29sdW1uLm5hbWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdG1SZXN1bHRbb1RhYmxlQ29sdW1uLm5hbWVdLmRlZmF1bHRBZ2dyZWdhdGUuY29udGV4dERlZmluaW5nUHJvcGVydGllcyA9IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gbVJlc3VsdDtcbn07XG5cbi8qKlxuICogVXBkYXRlcyBhIHRhYmxlIHZpc3VhbGl6YXRpb24gZm9yIGFuYWx5dGljYWwgdXNlIGNhc2VzLlxuICpcbiAqIEBwYXJhbSB0YWJsZVZpc3VhbGl6YXRpb24gVGhlIHZpc3VhbGl6YXRpb24gdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIGVudGl0eSB0eXBlIGRpc3BsYXllZCBpbiB0aGUgdGFibGVcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIFRoZSBwcmVzZW50YXRpb25WYXJpYW50IGFubm90YXRpb24gKGlmIGFueSlcbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGFibGVWaXN1YWxpemF0aW9uRm9yQW5hbHl0aWNzKFxuXHR0YWJsZVZpc3VhbGl6YXRpb246IFRhYmxlVmlzdWFsaXphdGlvbixcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/OiBQcmVzZW50YXRpb25WYXJpYW50VHlwZVxuKSB7XG5cdGlmICh0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC50eXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiKSB7XG5cdFx0Y29uc3QgYWdncmVnYXRlc0RlZmluaXRpb25zID0gZ2V0QWdncmVnYXRlRGVmaW5pdGlvbnNGcm9tRW50aXR5VHlwZShlbnRpdHlUeXBlLCB0YWJsZVZpc3VhbGl6YXRpb24uY29sdW1ucywgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRcdGlmIChhZ2dyZWdhdGVzRGVmaW5pdGlvbnMpIHtcblx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5lbmFibGVBbmFseXRpY3MgPSB0cnVlO1xuXHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmFnZ3JlZ2F0ZXMgPSBhZ2dyZWdhdGVzRGVmaW5pdGlvbnM7XG5cblx0XHRcdGNvbnN0IGFsbG93ZWRUcmFuc2Zvcm1hdGlvbnMgPSBhZ2dyZWdhdGlvbkhlbHBlci5nZXRBbGxvd2VkVHJhbnNmb3JtYXRpb25zKCk7XG5cdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uZW5hYmxlQW5hbHl0aWNzU2VhcmNoID0gYWxsb3dlZFRyYW5zZm9ybWF0aW9ucyA/IGFsbG93ZWRUcmFuc2Zvcm1hdGlvbnMuaW5kZXhPZihcInNlYXJjaFwiKSA+PSAwIDogdHJ1ZTtcblxuXHRcdFx0Ly8gQWRkIGdyb3VwIGFuZCBzb3J0IGNvbmRpdGlvbnMgZnJvbSB0aGUgcHJlc2VudGF0aW9uIHZhcmlhbnRcblx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5hbm5vdGF0aW9uLmdyb3VwQ29uZGl0aW9ucyA9IGdldEdyb3VwQ29uZGl0aW9ucyhcblx0XHRcdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24sXG5cdFx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb2x1bW5zLFxuXHRcdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC50eXBlXG5cdFx0XHQpO1xuXHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmFubm90YXRpb24uYWdncmVnYXRlQ29uZGl0aW9ucyA9IGdldEFnZ3JlZ2F0ZUNvbmRpdGlvbnMoXG5cdFx0XHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLFxuXHRcdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uY29sdW1uc1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHR0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC50eXBlID0gXCJHcmlkVGFibGVcIjsgLy8gQW5hbHl0aWNhbFRhYmxlIGlzbid0IGEgcmVhbCB0eXBlIGZvciB0aGUgTURDOlRhYmxlLCBzbyB3ZSBhbHdheXMgc3dpdGNoIGJhY2sgdG8gR3JpZFxuXHR9IGVsc2UgaWYgKHRhYmxlVmlzdWFsaXphdGlvbi5jb250cm9sLnR5cGUgPT09IFwiUmVzcG9uc2l2ZVRhYmxlXCIpIHtcblx0XHR0YWJsZVZpc3VhbGl6YXRpb24uYW5ub3RhdGlvbi5ncm91cENvbmRpdGlvbnMgPSBnZXRHcm91cENvbmRpdGlvbnMoXG5cdFx0XHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbixcblx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb2x1bW5zLFxuXHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmNvbnRyb2wudHlwZVxuXHRcdCk7XG5cdH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIG5hdmlnYXRpb24gdGFyZ2V0IHBhdGggZnJvbSBtYW5pZmVzdCBzZXR0aW5ncy5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIFRoZSBuYXZpZ2F0aW9uIHBhdGggdG8gY2hlY2sgaW4gdGhlIG1hbmlmZXN0IHNldHRpbmdzXG4gKiBAcmV0dXJucyBOYXZpZ2F0aW9uIHBhdGggZnJvbSBtYW5pZmVzdCBzZXR0aW5nc1xuICovXG5mdW5jdGlvbiBnZXROYXZpZ2F0aW9uVGFyZ2V0UGF0aChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBzdHJpbmcpIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggJiYgbWFuaWZlc3RXcmFwcGVyLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpKSB7XG5cdFx0Y29uc3QgbmF2Q29uZmlnID0gbWFuaWZlc3RXcmFwcGVyLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpO1xuXHRcdGlmIChPYmplY3Qua2V5cyhuYXZDb25maWcpLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGRhdGFNb2RlbFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgY29udGV4dFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnRleHRQYXRoKCk7XG5cdGNvbnN0IG5hdkNvbmZpZ0ZvckNvbnRleHRQYXRoID0gbWFuaWZlc3RXcmFwcGVyLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKGNvbnRleHRQYXRoKTtcblx0aWYgKG5hdkNvbmZpZ0ZvckNvbnRleHRQYXRoICYmIE9iamVjdC5rZXlzKG5hdkNvbmZpZ0ZvckNvbnRleHRQYXRoKS5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuIGNvbnRleHRQYXRoO1xuXHR9XG5cblx0cmV0dXJuIGRhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0ID8gZGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQubmFtZSA6IGRhdGFNb2RlbFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSAndW5pdCcgYW5kICd0ZXh0QXJyYW5nZW1lbnQnIHByb3BlcnRpZXMgaW4gY29sdW1ucyB3aGVuIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0gZW50aXR5VHlwZSBUaGUgZW50aXR5IHR5cGUgZGlzcGxheWVkIGluIHRoZSB0YWJsZVxuICogQHBhcmFtIHRhYmxlQ29sdW1ucyBUaGUgY29sdW1ucyB0byBiZSB1cGRhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVMaW5rZWRQcm9wZXJ0aWVzKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIHRhYmxlQ29sdW1uczogVGFibGVDb2x1bW5bXSkge1xuXHRmdW5jdGlvbiBmaW5kQ29sdW1uQnlQYXRoKHBhdGg6IHN0cmluZyk6IFRhYmxlQ29sdW1uIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGFibGVDb2x1bW5zLmZpbmQoKGNvbHVtbikgPT4ge1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQgJiYgYW5ub3RhdGlvbkNvbHVtbi5yZWxhdGl2ZVBhdGggPT09IHBhdGg7XG5cdFx0fSk7XG5cdH1cblxuXHR0YWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbHVtbikgPT4ge1xuXHRcdGNvbnN0IG9UYWJsZUNvbHVtbiA9IG9Db2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdGlmIChvVGFibGVDb2x1bW4ucHJvcGVydHlJbmZvcyA9PT0gdW5kZWZpbmVkICYmIG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGgpIHtcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eSA9IGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5maW5kKChvUHJvcDogUHJvcGVydHkpID0+IG9Qcm9wLm5hbWUgPT09IG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGgpO1xuXHRcdFx0aWYgKG9Qcm9wZXJ0eSkge1xuXHRcdFx0XHRjb25zdCBvVW5pdCA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eSkgfHwgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eShvUHJvcGVydHkpO1xuXHRcdFx0XHRjb25zdCBvVGltZXpvbmUgPSBnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eShvUHJvcGVydHkpO1xuXHRcdFx0XHRjb25zdCBzVGltZXpvbmUgPSBvUHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LlRpbWV6b25lO1xuXHRcdFx0XHRpZiAob1VuaXQpIHtcblx0XHRcdFx0XHRjb25zdCBvVW5pdENvbHVtbiA9IGZpbmRDb2x1bW5CeVBhdGgob1VuaXQubmFtZSk7XG5cdFx0XHRcdFx0b1RhYmxlQ29sdW1uLnVuaXQgPSBvVW5pdENvbHVtbj8ubmFtZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBzVW5pdCA9IG9Qcm9wZXJ0eT8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSB8fCBvUHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0XHRcdFx0XHRpZiAoc1VuaXQpIHtcblx0XHRcdFx0XHRcdG9UYWJsZUNvbHVtbi51bml0VGV4dCA9IGAke3NVbml0fWA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvVGltZXpvbmUpIHtcblx0XHRcdFx0XHRjb25zdCBvVGltZXpvbmVDb2x1bW4gPSBmaW5kQ29sdW1uQnlQYXRoKG9UaW1lem9uZS5uYW1lKTtcblx0XHRcdFx0XHRvVGFibGVDb2x1bW4udGltZXpvbmUgPSBvVGltZXpvbmVDb2x1bW4/Lm5hbWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoc1RpbWV6b25lKSB7XG5cdFx0XHRcdFx0b1RhYmxlQ29sdW1uLnRpbWV6b25lVGV4dCA9IHNUaW1lem9uZS50b1N0cmluZygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZGlzcGxheU1vZGUgPSBnZXREaXNwbGF5TW9kZShvUHJvcGVydHkpLFxuXHRcdFx0XHRcdHRleHRBbm5vdGF0aW9uID0gb1Byb3BlcnR5LmFubm90YXRpb25zLkNvbW1vbj8uVGV4dDtcblx0XHRcdFx0aWYgKGlzUGF0aEV4cHJlc3Npb24odGV4dEFubm90YXRpb24pICYmIGRpc3BsYXlNb2RlICE9PSBcIlZhbHVlXCIpIHtcblx0XHRcdFx0XHRjb25zdCBvVGV4dENvbHVtbiA9IGZpbmRDb2x1bW5CeVBhdGgodGV4dEFubm90YXRpb24ucGF0aCk7XG5cdFx0XHRcdFx0aWYgKG9UZXh0Q29sdW1uICYmIG9UZXh0Q29sdW1uLm5hbWUgIT09IG9UYWJsZUNvbHVtbi5uYW1lKSB7XG5cdFx0XHRcdFx0XHRvVGFibGVDb2x1bW4udGV4dEFycmFuZ2VtZW50ID0ge1xuXHRcdFx0XHRcdFx0XHR0ZXh0UHJvcGVydHk6IG9UZXh0Q29sdW1uLm5hbWUsXG5cdFx0XHRcdFx0XHRcdG1vZGU6IGRpc3BsYXlNb2RlXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldFNlbWFudGljS2V5c0FuZFRpdGxlSW5mbyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KSB7XG5cdGNvbnN0IGhlYWRlckluZm9UaXRsZVBhdGggPSAoY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZSgpPy5hbm5vdGF0aW9ucz8uVUk/LkhlYWRlckluZm8/LlRpdGxlIGFzIERhdGFGaWVsZFR5cGVzKT8uVmFsdWVcblx0XHQ/LnBhdGg7XG5cdGNvbnN0IHNlbWFudGljS2V5QW5ub3RhdGlvbnM6IGFueVtdIHwgdW5kZWZpbmVkID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZSgpPy5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY0tleTtcblx0Y29uc3QgaGVhZGVySW5mb1R5cGVOYW1lID0gY29udmVydGVyQ29udGV4dD8uZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUoKT8uYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UeXBlTmFtZTtcblx0Y29uc3Qgc2VtYW50aWNLZXlDb2x1bW5zOiBzdHJpbmdbXSA9IFtdO1xuXHRpZiAoc2VtYW50aWNLZXlBbm5vdGF0aW9ucykge1xuXHRcdHNlbWFudGljS2V5QW5ub3RhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAob0NvbHVtbjogYW55KSB7XG5cdFx0XHRzZW1hbnRpY0tleUNvbHVtbnMucHVzaChvQ29sdW1uLnZhbHVlKTtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7IGhlYWRlckluZm9UaXRsZVBhdGgsIHNlbWFudGljS2V5Q29sdW1ucywgaGVhZGVySW5mb1R5cGVOYW1lIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUYWJsZVZpc3VhbGl6YXRpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPzogUHJlc2VudGF0aW9uVmFyaWFudFR5cGUsXG5cdGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQ/OiBib29sZWFuLFxuXHR2aWV3Q29uZmlndXJhdGlvbj86IFZpZXdQYXRoQ29uZmlndXJhdGlvblxuKTogVGFibGVWaXN1YWxpemF0aW9uIHtcblx0Y29uc3QgdGFibGVNYW5pZmVzdENvbmZpZyA9IGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKFxuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHR2aXN1YWxpemF0aW9uUGF0aCxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnRcblx0KTtcblx0Y29uc3QgeyBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIH0gPSBzcGxpdFBhdGgodmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCBuYXZpZ2F0aW9uVGFyZ2V0UGF0aCA9IGdldE5hdmlnYXRpb25UYXJnZXRQYXRoKGNvbnZlcnRlckNvbnRleHQsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpO1xuXHRjb25zdCBuYXZpZ2F0aW9uU2V0dGluZ3MgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKG5hdmlnYXRpb25UYXJnZXRQYXRoKTtcblx0Y29uc3QgY29sdW1ucyA9IGdldFRhYmxlQ29sdW1ucyhsaW5lSXRlbUFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBuYXZpZ2F0aW9uU2V0dGluZ3MpO1xuXHRjb25zdCBvcGVyYXRpb25BdmFpbGFibGVNYXAgPSBnZXRPcGVyYXRpb25BdmFpbGFibGVNYXAobGluZUl0ZW1Bbm5vdGF0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3Qgc2VtYW50aWNLZXlzQW5kSGVhZGVySW5mb1RpdGxlID0gZ2V0U2VtYW50aWNLZXlzQW5kVGl0bGVJbmZvKGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCB0YWJsZUFjdGlvbnMgPSBnZXRUYWJsZUFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblNldHRpbmdzKTtcblx0Y29uc3Qgb1Zpc3VhbGl6YXRpb246IFRhYmxlVmlzdWFsaXphdGlvbiA9IHtcblx0XHR0eXBlOiBWaXN1YWxpemF0aW9uVHlwZS5UYWJsZSxcblx0XHRhbm5vdGF0aW9uOiBnZXRUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLFxuXHRcdFx0dmlzdWFsaXphdGlvblBhdGgsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0dGFibGVNYW5pZmVzdENvbmZpZyxcblx0XHRcdGNvbHVtbnMsXG5cdFx0XHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbixcblx0XHRcdHZpZXdDb25maWd1cmF0aW9uXG5cdFx0KSxcblx0XHRjb250cm9sOiB0YWJsZU1hbmlmZXN0Q29uZmlnLFxuXHRcdGFjdGlvbnM6IHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnModGFibGVBY3Rpb25zLmFjdGlvbnMpLFxuXHRcdGNvbW1hbmRBY3Rpb25zOiB0YWJsZUFjdGlvbnMuY29tbWFuZEFjdGlvbnMsXG5cdFx0Y29sdW1uczogY29sdW1ucyxcblx0XHRvcGVyYXRpb25BdmFpbGFibGVNYXA6IEpTT04uc3RyaW5naWZ5KG9wZXJhdGlvbkF2YWlsYWJsZU1hcCksXG5cdFx0b3BlcmF0aW9uQXZhaWxhYmxlUHJvcGVydGllczogZ2V0T3BlcmF0aW9uQXZhaWxhYmxlUHJvcGVydGllcyhvcGVyYXRpb25BdmFpbGFibGVNYXAsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGhlYWRlckluZm9UaXRsZTogc2VtYW50aWNLZXlzQW5kSGVhZGVySW5mb1RpdGxlLmhlYWRlckluZm9UaXRsZVBhdGgsXG5cdFx0c2VtYW50aWNLZXlzOiBzZW1hbnRpY0tleXNBbmRIZWFkZXJJbmZvVGl0bGUuc2VtYW50aWNLZXlDb2x1bW5zLFxuXHRcdGhlYWRlckluZm9UeXBlTmFtZTogc2VtYW50aWNLZXlzQW5kSGVhZGVySW5mb1RpdGxlLmhlYWRlckluZm9UeXBlTmFtZVxuXHR9O1xuXG5cdHVwZGF0ZUxpbmtlZFByb3BlcnRpZXMoY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShsaW5lSXRlbUFubm90YXRpb24pLCBjb2x1bW5zKTtcblx0dXBkYXRlVGFibGVWaXN1YWxpemF0aW9uRm9yQW5hbHl0aWNzKFxuXHRcdG9WaXN1YWxpemF0aW9uLFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uXG5cdCk7XG5cblx0cmV0dXJuIG9WaXN1YWxpemF0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVmYXVsdFRhYmxlVmlzdWFsaXphdGlvbihjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogVGFibGVWaXN1YWxpemF0aW9uIHtcblx0Y29uc3QgdGFibGVNYW5pZmVzdENvbmZpZyA9IGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgXCJcIiwgY29udmVydGVyQ29udGV4dCwgZmFsc2UpO1xuXHRjb25zdCBjb2x1bW5zID0gZ2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlKHt9LCBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKSwgW10sIFtdLCBjb252ZXJ0ZXJDb250ZXh0LCB0YWJsZU1hbmlmZXN0Q29uZmlnLnR5cGUpO1xuXHRjb25zdCBvcGVyYXRpb25BdmFpbGFibGVNYXAgPSBnZXRPcGVyYXRpb25BdmFpbGFibGVNYXAodW5kZWZpbmVkLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3Qgc2VtYW50aWNLZXlzQW5kSGVhZGVySW5mb1RpdGxlID0gZ2V0U2VtYW50aWNLZXlzQW5kVGl0bGVJbmZvKGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBvVmlzdWFsaXphdGlvbjogVGFibGVWaXN1YWxpemF0aW9uID0ge1xuXHRcdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLlRhYmxlLFxuXHRcdGFubm90YXRpb246IGdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24odW5kZWZpbmVkLCBcIlwiLCBjb252ZXJ0ZXJDb250ZXh0LCB0YWJsZU1hbmlmZXN0Q29uZmlnLCBjb2x1bW5zKSxcblx0XHRjb250cm9sOiB0YWJsZU1hbmlmZXN0Q29uZmlnLFxuXHRcdGFjdGlvbnM6IFtdLFxuXHRcdGNvbHVtbnM6IGNvbHVtbnMsXG5cdFx0b3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBKU09OLnN0cmluZ2lmeShvcGVyYXRpb25BdmFpbGFibGVNYXApLFxuXHRcdG9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXM6IGdldE9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXMob3BlcmF0aW9uQXZhaWxhYmxlTWFwLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRoZWFkZXJJbmZvVGl0bGU6IHNlbWFudGljS2V5c0FuZEhlYWRlckluZm9UaXRsZS5oZWFkZXJJbmZvVGl0bGVQYXRoLFxuXHRcdHNlbWFudGljS2V5czogc2VtYW50aWNLZXlzQW5kSGVhZGVySW5mb1RpdGxlLnNlbWFudGljS2V5Q29sdW1ucyxcblx0XHRoZWFkZXJJbmZvVHlwZU5hbWU6IHNlbWFudGljS2V5c0FuZEhlYWRlckluZm9UaXRsZS5oZWFkZXJJbmZvVHlwZU5hbWVcblx0fTtcblxuXHR1cGRhdGVMaW5rZWRQcm9wZXJ0aWVzKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb2x1bW5zKTtcblx0dXBkYXRlVGFibGVWaXN1YWxpemF0aW9uRm9yQW5hbHl0aWNzKG9WaXN1YWxpemF0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0cmV0dXJuIG9WaXN1YWxpemF0aW9uO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCBvZiBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBwcm9wZXJ0eSBwYXRocyBmb3IgYWxsIERhdGFGaWVsZEZvckFjdGlvbnMuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvbiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGxpbmUgaXRlbVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgVGhlIHJlY29yZCBjb250YWluaW5nIGFsbCBhY3Rpb24gbmFtZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgQ29yZS5PcGVyYXRpb25BdmFpbGFibGUgcHJvcGVydHkgcGF0aHNcbiAqL1xuZnVuY3Rpb24gZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwKGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcblx0cmV0dXJuIEFjdGlvbkhlbHBlci5nZXRPcGVyYXRpb25BdmFpbGFibGVNYXAobGluZUl0ZW1Bbm5vdGF0aW9uLCBcInRhYmxlXCIsIGNvbnZlcnRlckNvbnRleHQpO1xufVxuXG4vKipcbiAqIEdldHMgdXBkYXRhYmxlIHByb3BlcnR5UGF0aCBmb3IgdGhlIGN1cnJlbnQgZW50aXR5c2V0IGlmIHZhbGlkLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSB1cGRhdGFibGUgcHJvcGVydHkgZm9yIHRoZSByb3dzXG4gKi9cbmZ1bmN0aW9uIGdldEN1cnJlbnRFbnRpdHlTZXRVcGRhdGFibGVQYXRoKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBzdHJpbmcge1xuXHRjb25zdCByZXN0cmljdGlvbnMgPSBnZXRSZXN0cmljdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdGNvbnN0IHVwZGF0YWJsZSA9IHJlc3RyaWN0aW9ucy5pc1VwZGF0YWJsZTtcblx0Y29uc3QgaXNPbmx5RHluYW1pY09uQ3VycmVudEVudGl0eTogYW55ID0gIWlzQ29uc3RhbnQodXBkYXRhYmxlLmV4cHJlc3Npb24pICYmIHVwZGF0YWJsZS5uYXZpZ2F0aW9uRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJVbnJlc29sdmFibGVcIjtcblx0Y29uc3QgdXBkYXRhYmxlUHJvcGVydHlQYXRoID0gKGVudGl0eVNldD8uYW5ub3RhdGlvbnMuQ2FwYWJpbGl0aWVzPy5VcGRhdGVSZXN0cmljdGlvbnM/LlVwZGF0YWJsZSBhcyBhbnkpPy5wYXRoO1xuXG5cdHJldHVybiBpc09ubHlEeW5hbWljT25DdXJyZW50RW50aXR5ID8gKHVwZGF0YWJsZVByb3BlcnR5UGF0aCBhcyBzdHJpbmcpIDogXCJcIjtcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gcmV0cmlldmUgYWxsIHByb3BlcnR5IHBhdGhzIGFzc2lnbmVkIHRvIHRoZSBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBhbm5vdGF0aW9uLlxuICpcbiAqIEBwYXJhbSBvcGVyYXRpb25BdmFpbGFibGVNYXAgVGhlIHJlY29yZCBjb25zaXN0aW5nIG9mIGFjdGlvbnMgYW5kIHRoZWlyIENvcmUuT3BlcmF0aW9uQXZhaWxhYmxlIHByb3BlcnR5IHBhdGhzXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgQ1NWIHN0cmluZyBvZiBhbGwgcHJvcGVydHkgcGF0aHMgYXNzb2NpYXRlZCB3aXRoIHRoZSBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBhbm5vdGF0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldE9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXMob3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogc3RyaW5nIHtcblx0Y29uc3QgcHJvcGVydGllcyA9IG5ldyBTZXQoKTtcblxuXHRmb3IgKGNvbnN0IGFjdGlvbk5hbWUgaW4gb3BlcmF0aW9uQXZhaWxhYmxlTWFwKSB7XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gb3BlcmF0aW9uQXZhaWxhYmxlTWFwW2FjdGlvbk5hbWVdO1xuXHRcdGlmIChwcm9wZXJ0eU5hbWUgPT09IG51bGwpIHtcblx0XHRcdC8vIEFubm90YXRpb24gY29uZmlndXJlZCB3aXRoIGV4cGxpY2l0ICdudWxsJyAoYWN0aW9uIGFkdmVydGlzZW1lbnQgcmVsZXZhbnQpXG5cdFx0XHRwcm9wZXJ0aWVzLmFkZChhY3Rpb25OYW1lKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdC8vIEFkZCBwcm9wZXJ0eSBwYXRocyBhbmQgbm90IENvbnN0YW50IHZhbHVlcy5cblx0XHRcdHByb3BlcnRpZXMuYWRkKHByb3BlcnR5TmFtZSk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKHByb3BlcnRpZXMuc2l6ZSkge1xuXHRcdC8vIFNvbWUgYWN0aW9ucyBoYXZlIGFuIG9wZXJhdGlvbiBhdmFpbGFibGUgYmFzZWQgb24gcHJvcGVydHkgLS0+IHdlIG5lZWQgdG8gbG9hZCB0aGUgSGVhZGVySW5mby5UaXRsZSBwcm9wZXJ0eVxuXHRcdC8vIHNvIHRoYXQgdGhlIGRpYWxvZyBvbiBwYXJ0aWFsIGFjdGlvbnMgaXMgZGlzcGxheWVkIHByb3Blcmx5IChCQ1AgMjE4MDI3MTQyNSlcblx0XHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdFx0Y29uc3QgdGl0bGVQcm9wZXJ0eSA9IChlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uSGVhZGVySW5mbz8uVGl0bGUgYXMgRGF0YUZpZWxkVHlwZXMpPy5WYWx1ZT8ucGF0aDtcblx0XHRpZiAodGl0bGVQcm9wZXJ0eSkge1xuXHRcdFx0cHJvcGVydGllcy5hZGQodGl0bGVQcm9wZXJ0eSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIEFycmF5LmZyb20ocHJvcGVydGllcykuam9pbihcIixcIik7XG59XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciB0aGUgRGF0YUZpZWxkRm9yQWN0aW9uIGFuZCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gb2YgYSBsaW5lIGl0ZW0gYW5kXG4gKiByZXR1cm5zIGFsbCB0aGUgVUkuSGlkZGVuIGFubm90YXRpb24gZXhwcmVzc2lvbnMuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvbiBDb2xsZWN0aW9uIG9mIGRhdGEgZmllbGRzIHVzZWQgZm9yIHJlcHJlc2VudGF0aW9uIGluIGEgdGFibGUgb3IgbGlzdFxuICogQHBhcmFtIGN1cnJlbnRFbnRpdHlUeXBlIEN1cnJlbnQgZW50aXR5IHR5cGVcbiAqIEBwYXJhbSBjb250ZXh0RGF0YU1vZGVsT2JqZWN0UGF0aCBPYmplY3QgcGF0aCBvZiB0aGUgZGF0YSBtb2RlbFxuICogQHBhcmFtIGlzRW50aXR5U2V0XG4gKiBAcmV0dXJucyBBbGwgdGhlIGBVSS5IaWRkZW5gIHBhdGggZXhwcmVzc2lvbnMgZm91bmQgaW4gdGhlIHJlbGV2YW50IGFjdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0VUlIaWRkZW5FeHBGb3JBY3Rpb25zUmVxdWlyaW5nQ29udGV4dChcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSxcblx0Y3VycmVudEVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRpc0VudGl0eVNldDogYm9vbGVhblxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+W10ge1xuXHRjb25zdCBhVWlIaWRkZW5QYXRoRXhwcmVzc2lvbnM6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPltdID0gW107XG5cdGxpbmVJdGVtQW5ub3RhdGlvbi5mb3JFYWNoKChkYXRhRmllbGQpID0+IHtcblx0XHQvLyBDaGVjayBpZiB0aGUgbGluZUl0ZW0gY29udGV4dCBpcyB0aGUgc2FtZSBhcyB0aGF0IG9mIHRoZSBhY3Rpb246XG5cdFx0aWYgKFxuXHRcdFx0KGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uICYmXG5cdFx0XHRcdGRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0Py5pc0JvdW5kICYmXG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlUeXBlID09PSBkYXRhRmllbGQ/LkFjdGlvblRhcmdldC5zb3VyY2VFbnRpdHlUeXBlKSB8fFxuXHRcdFx0KGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uICYmXG5cdFx0XHRcdGRhdGFGaWVsZC5SZXF1aXJlc0NvbnRleHQgJiZcblx0XHRcdFx0ZGF0YUZpZWxkPy5JbmxpbmU/LnZhbHVlT2YoKSAhPT0gdHJ1ZSlcblx0XHQpIHtcblx0XHRcdGlmICh0eXBlb2YgZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0YVVpSGlkZGVuUGF0aEV4cHJlc3Npb25zLnB1c2goZXF1YWwoZ2V0QmluZGluZ0V4cEZyb21Db250ZXh0KGRhdGFGaWVsZCwgY29udGV4dERhdGFNb2RlbE9iamVjdFBhdGgsIGlzRW50aXR5U2V0KSwgZmFsc2UpKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYVVpSGlkZGVuUGF0aEV4cHJlc3Npb25zO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gY2hhbmdlIHRoZSBjb250ZXh0IGN1cnJlbnRseSByZWZlcmVuY2VkIGJ5IHRoaXMgYmluZGluZyBieSByZW1vdmluZyB0aGUgbGFzdCBuYXZpZ2F0aW9uIHByb3BlcnR5LlxuICpcbiAqIEl0IGlzIHVzZWQgKHNwZWNpZmljYWxseSBpbiB0aGlzIGNhc2UpLCB0byB0cmFuc2Zvcm0gYSBiaW5kaW5nIG1hZGUgZm9yIGEgTmF2UHJvcCBjb250ZXh0IC9NYWluT2JqZWN0L05hdlByb3AxL05hdlByb3AyLFxuICogaW50byBhIGJpbmRpbmcgb24gdGhlIHByZXZpb3VzIGNvbnRleHQgL01haW5PYmplY3QvTmF2UHJvcDEuXG4gKlxuICogQHBhcmFtIHNvdXJjZSBEYXRhRmllbGRGb3JBY3Rpb24gfCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gfCBDdXN0b21BY3Rpb25cbiAqIEBwYXJhbSBjb250ZXh0RGF0YU1vZGVsT2JqZWN0UGF0aCBEYXRhTW9kZWxPYmplY3RQYXRoXG4gKiBAcGFyYW0gaXNFbnRpdHlTZXRcbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gZ2V0QmluZGluZ0V4cEZyb21Db250ZXh0KFxuXHRzb3VyY2U6IERhdGFGaWVsZEZvckFjdGlvbiB8IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiB8IEN1c3RvbUFjdGlvbixcblx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGlzRW50aXR5U2V0OiBib29sZWFuXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PiB7XG5cdGxldCBzRXhwcmVzc2lvbjogYW55IHwgdW5kZWZpbmVkO1xuXHRpZiAoXG5cdFx0KHNvdXJjZSBhcyBEYXRhRmllbGRGb3JBY3Rpb24pPy4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uIHx8XG5cdFx0KHNvdXJjZSBhcyBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24pPy4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXG5cdCkge1xuXHRcdHNFeHByZXNzaW9uID0gKHNvdXJjZSBhcyBEYXRhRmllbGRGb3JBY3Rpb24gfCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24pPy5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbjtcblx0fSBlbHNlIHtcblx0XHRzRXhwcmVzc2lvbiA9IChzb3VyY2UgYXMgQ3VzdG9tQWN0aW9uKT8udmlzaWJsZTtcblx0fVxuXHRsZXQgc1BhdGg6IHN0cmluZztcblx0aWYgKHNFeHByZXNzaW9uPy5wYXRoKSB7XG5cdFx0c1BhdGggPSBzRXhwcmVzc2lvbi5wYXRoO1xuXHR9IGVsc2Uge1xuXHRcdHNQYXRoID0gc0V4cHJlc3Npb247XG5cdH1cblx0aWYgKHNQYXRoKSB7XG5cdFx0aWYgKChzb3VyY2UgYXMgQ3VzdG9tQWN0aW9uKT8udmlzaWJsZSkge1xuXHRcdFx0c1BhdGggPSBzUGF0aC5zdWJzdHJpbmcoMSwgc1BhdGgubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXHRcdGlmIChzUGF0aC5pbmRleE9mKFwiL1wiKSA+IDApIHtcblx0XHRcdC8vY2hlY2sgaWYgdGhlIG5hdmlnYXRpb24gcHJvcGVydHkgaXMgY29ycmVjdDpcblx0XHRcdGNvbnN0IGFTcGxpdFBhdGggPSBzUGF0aC5zcGxpdChcIi9cIik7XG5cdFx0XHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBhU3BsaXRQYXRoWzBdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRjb250ZXh0RGF0YU1vZGVsT2JqZWN0UGF0aD8udGFyZ2V0T2JqZWN0Py5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJlxuXHRcdFx0XHRjb250ZXh0RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QucGFydG5lciA9PT0gc05hdmlnYXRpb25QYXRoXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHBhdGhJbk1vZGVsKGFTcGxpdFBhdGguc2xpY2UoMSkuam9pbihcIi9cIikpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSW4gY2FzZSB0aGVyZSBpcyBubyBuYXZpZ2F0aW9uIHByb3BlcnR5LCBpZiBpdCdzIGFuIGVudGl0eVNldCwgdGhlIGV4cHJlc3Npb24gYmluZGluZyBoYXMgdG8gYmUgcmV0dXJuZWQ6XG5cdFx0fSBlbHNlIGlmIChpc0VudGl0eVNldCkge1xuXHRcdFx0cmV0dXJuIHBhdGhJbk1vZGVsKHNQYXRoKTtcblx0XHRcdC8vIG90aGVyd2lzZSB0aGUgZXhwcmVzc2lvbiBiaW5kaW5nIGNhbm5vdCBiZSB0YWtlbiBpbnRvIGFjY291bnQgZm9yIHRoZSBzZWxlY3Rpb24gbW9kZSBldmFsdWF0aW9uOlxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBjb25zdGFudCh0cnVlKTtcbn1cblxuLyoqXG4gKiBMb29wIHRocm91Z2ggdGhlIERhdGFGaWVsZEZvckFjdGlvbiBhbmQgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIG9mIGEgbGluZSBpdGVtIGFuZCBjaGVja1xuICogaWYgYXQgbGVhc3Qgb25lIG9mIHRoZW0gaXMgYWx3YXlzIHZpc2libGUgaW4gdGhlIHRhYmxlIHRvb2xiYXIgKGFuZCByZXF1aXJlcyBhIGNvbnRleHQpLlxuICpcbiAqIEBwYXJhbSBsaW5lSXRlbUFubm90YXRpb24gQ29sbGVjdGlvbiBvZiBkYXRhIGZpZWxkcyBmb3IgcmVwcmVzZW50YXRpb24gaW4gYSB0YWJsZSBvciBsaXN0XG4gKiBAcGFyYW0gY3VycmVudEVudGl0eVR5cGUgQ3VycmVudCBFbnRpdHkgVHlwZVxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZXJlIGlzIGF0IGxlYXN0IDEgYWN0aW9uIHRoYXQgbWVldHMgdGhlIGNyaXRlcmlhXG4gKi9cbmZ1bmN0aW9uIGhhc0JvdW5kQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSwgY3VycmVudEVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBib29sZWFuIHtcblx0cmV0dXJuIGxpbmVJdGVtQW5ub3RhdGlvbi5zb21lKChkYXRhRmllbGQpID0+IHtcblx0XHRpZiAoXG5cdFx0XHQoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gfHxcblx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24pICYmXG5cdFx0XHRkYXRhRmllbGQ/LklubGluZT8udmFsdWVPZigpICE9PSB0cnVlICYmXG5cdFx0XHQoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IGZhbHNlIHx8IGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB1bmRlZmluZWQpXG5cdFx0KSB7XG5cdFx0XHRpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24pIHtcblx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIGxpbmVJdGVtIGNvbnRleHQgaXMgdGhlIHNhbWUgYXMgdGhhdCBvZiB0aGUgYWN0aW9uOlxuXHRcdFx0XHRyZXR1cm4gZGF0YUZpZWxkPy5BY3Rpb25UYXJnZXQ/LmlzQm91bmQgJiYgY3VycmVudEVudGl0eVR5cGUgPT09IGRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0LnNvdXJjZUVudGl0eVR5cGU7XG5cdFx0XHR9IGVsc2UgaWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBkYXRhRmllbGQuUmVxdWlyZXNDb250ZXh0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBoYXNDdXN0b21BY3Rpb25zQWx3YXlzVmlzaWJsZUluVG9vbEJhcihtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4pOiBib29sZWFuIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hbmlmZXN0QWN0aW9ucykuc29tZSgoYWN0aW9uS2V5KSA9PiB7XG5cdFx0Y29uc3QgYWN0aW9uID0gbWFuaWZlc3RBY3Rpb25zW2FjdGlvbktleV07XG5cdFx0aWYgKGFjdGlvbi5yZXF1aXJlc1NlbGVjdGlvbiAmJiBhY3Rpb24udmlzaWJsZT8udG9TdHJpbmcoKSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgdGhlIGN1c3RvbSBhY3Rpb25zICh3aXRoIGtleSByZXF1aXJlc1NlbGVjdGlvbikgZGVjbGFyZWQgaW4gdGhlIG1hbmlmZXN0IGZvciB0aGUgY3VycmVudCBsaW5lIGl0ZW0gYW5kIHJldHVybnMgYWxsIHRoZVxuICogdmlzaWJsZSBrZXkgdmFsdWVzIGFzIGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIG1hbmlmZXN0QWN0aW9ucyBUaGUgYWN0aW9ucyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICogQHJldHVybnMgQXJyYXk8RXhwcmVzc2lvbjxib29sZWFuPj4gQWxsIHRoZSB2aXNpYmxlIHBhdGggZXhwcmVzc2lvbnMgb2YgdGhlIGFjdGlvbnMgdGhhdCBtZWV0IHRoZSBjcml0ZXJpYVxuICovXG5mdW5jdGlvbiBnZXRWaXNpYmxlRXhwRm9yQ3VzdG9tQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQobWFuaWZlc3RBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+KTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+W10ge1xuXHRjb25zdCBhVmlzaWJsZVBhdGhFeHByZXNzaW9uczogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+W10gPSBbXTtcblx0aWYgKG1hbmlmZXN0QWN0aW9ucykge1xuXHRcdE9iamVjdC5rZXlzKG1hbmlmZXN0QWN0aW9ucykuZm9yRWFjaCgoYWN0aW9uS2V5KSA9PiB7XG5cdFx0XHRjb25zdCBhY3Rpb24gPSBtYW5pZmVzdEFjdGlvbnNbYWN0aW9uS2V5XTtcblx0XHRcdGlmIChhY3Rpb24ucmVxdWlyZXNTZWxlY3Rpb24gPT09IHRydWUgJiYgYWN0aW9uLnZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGFjdGlvbi52aXNpYmxlID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0LypUaGUgZmluYWwgYWltIHdvdWxkIGJlIHRvIGNoZWNrIGlmIHRoZSBwYXRoIGV4cHJlc3Npb24gZGVwZW5kcyBvbiB0aGUgcGFyZW50IGNvbnRleHRcblx0XHRcdFx0XHRhbmQgY29uc2lkZXJzIG9ubHkgdGhvc2UgZXhwcmVzc2lvbnMgZm9yIHRoZSBleHByZXNzaW9uIGV2YWx1YXRpb24sXG5cdFx0XHRcdFx0YnV0IGN1cnJlbnRseSBub3QgcG9zc2libGUgZnJvbSB0aGUgbWFuaWZlc3QgYXMgdGhlIHZpc2libGUga2V5IGlzIGJvdW5kIG9uIHRoZSBwYXJlbnQgZW50aXR5LlxuXHRcdFx0XHRcdFRyaWNreSB0byBkaWZmZXJlbnRpYXRlIHRoZSBwYXRoIGFzIGl0J3MgZG9uZSBmb3IgdGhlIEhpZGRlbiBhbm5vdGF0aW9uLlxuXHRcdFx0XHRcdEZvciB0aGUgdGltZSBiZWluZyB3ZSBjb25zaWRlciBhbGwgdGhlIHBhdGhzIG9mIHRoZSBtYW5pZmVzdCovXG5cblx0XHRcdFx0XHRhVmlzaWJsZVBhdGhFeHByZXNzaW9ucy5wdXNoKHJlc29sdmVCaW5kaW5nU3RyaW5nKGFjdGlvbj8udmlzaWJsZT8udmFsdWVPZigpKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYVZpc2libGVQYXRoRXhwcmVzc2lvbnM7XG59XG5cbi8qKlxuICogRXZhbHVhdGUgaWYgdGhlIHBhdGggaXMgc3RhdGljYWxseSBkZWxldGFibGUgb3IgdXBkYXRhYmxlLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgdGFibGUgY2FwYWJpbGl0aWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXBhYmlsaXR5UmVzdHJpY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IFRhYmxlQ2FwYWJpbGl0eVJlc3RyaWN0aW9uIHtcblx0Y29uc3QgaXNEZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHRjb25zdCBpc1VwZGF0YWJsZSA9IGlzUGF0aFVwZGF0YWJsZShjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSk7XG5cdHJldHVybiB7XG5cdFx0aXNEZWxldGFibGU6ICEoaXNDb25zdGFudChpc0RlbGV0YWJsZSkgJiYgaXNEZWxldGFibGUudmFsdWUgPT09IGZhbHNlKSxcblx0XHRpc1VwZGF0YWJsZTogIShpc0NvbnN0YW50KGlzVXBkYXRhYmxlKSAmJiBpc1VwZGF0YWJsZS52YWx1ZSA9PT0gZmFsc2UpXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3Rpb25Nb2RlKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRpc0VudGl0eVNldDogYm9vbGVhbixcblx0dGFyZ2V0Q2FwYWJpbGl0aWVzOiBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbixcblx0ZGVsZXRlQnV0dG9uVmlzaWJpbGl0eUV4cHJlc3Npb24/OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4sXG5cdG1hc3NFZGl0VmlzaWJpbGl0eUV4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiA9IGNvbnN0YW50KGZhbHNlKVxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0aWYgKCFsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRyZXR1cm4gU2VsZWN0aW9uTW9kZS5Ob25lO1xuXHR9XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RTZXR0aW5ncyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCk7XG5cdGxldCBzZWxlY3Rpb25Nb2RlID0gdGFibGVNYW5pZmVzdFNldHRpbmdzLnRhYmxlU2V0dGluZ3M/LnNlbGVjdGlvbk1vZGU7XG5cdGxldCBhSGlkZGVuQmluZGluZ0V4cHJlc3Npb25zOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5bXSA9IFtdLFxuXHRcdGFWaXNpYmxlQmluZGluZ0V4cHJlc3Npb25zOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5bXSA9IFtdO1xuXHRjb25zdCBtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCkuYWN0aW9ucyxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFtdLFxuXHRcdHVuZGVmaW5lZCxcblx0XHRmYWxzZVxuXHQpO1xuXHRsZXQgaXNQYXJlbnREZWxldGFibGUsIHBhcmVudEVudGl0eVNldERlbGV0YWJsZTtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHRcdHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9IGlzUGFyZW50RGVsZXRhYmxlID8gY29tcGlsZUV4cHJlc3Npb24oaXNQYXJlbnREZWxldGFibGUsIHRydWUpIDogaXNQYXJlbnREZWxldGFibGU7XG5cdH1cblxuXHRjb25zdCBiTWFzc0VkaXRFbmFibGVkOiBib29sZWFuID0gIWlzQ29uc3RhbnQobWFzc0VkaXRWaXNpYmlsaXR5RXhwcmVzc2lvbikgfHwgbWFzc0VkaXRWaXNpYmlsaXR5RXhwcmVzc2lvbi52YWx1ZSAhPT0gZmFsc2U7XG5cdGlmIChzZWxlY3Rpb25Nb2RlICYmIHNlbGVjdGlvbk1vZGUgPT09IFNlbGVjdGlvbk1vZGUuTm9uZSAmJiBkZWxldGVCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbikge1xuXHRcdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSAmJiBiTWFzc0VkaXRFbmFibGVkKSB7XG5cdFx0XHQvLyBNYXNzIEVkaXQgaW4gT1AgaXMgZW5hYmxlZCBvbmx5IGluIGVkaXQgbW9kZS5cblx0XHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihcblx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdGFuZChVSS5Jc0VkaXRhYmxlLCBtYXNzRWRpdFZpc2liaWxpdHlFeHByZXNzaW9uKSxcblx0XHRcdFx0XHRjb25zdGFudChcIk11bHRpXCIpLFxuXHRcdFx0XHRcdGlmRWxzZShkZWxldGVCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiwgY29uc3RhbnQoXCJNdWx0aVwiKSwgY29uc3RhbnQoXCJOb25lXCIpKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAoYk1hc3NFZGl0RW5hYmxlZCkge1xuXHRcdFx0cmV0dXJuIFNlbGVjdGlvbk1vZGUuTXVsdGk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKGlmRWxzZShkZWxldGVCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiwgY29uc3RhbnQoXCJNdWx0aVwiKSwgY29uc3RhbnQoXCJOb25lXCIpKSk7XG5cdH1cblx0aWYgKCFzZWxlY3Rpb25Nb2RlIHx8IHNlbGVjdGlvbk1vZGUgPT09IFNlbGVjdGlvbk1vZGUuQXV0bykge1xuXHRcdHNlbGVjdGlvbk1vZGUgPSBTZWxlY3Rpb25Nb2RlLk11bHRpO1xuXHR9XG5cdGlmIChiTWFzc0VkaXRFbmFibGVkKSB7XG5cdFx0Ly8gT3ZlcnJpZGUgZGVmYXVsdCBzZWxlY3Rpb24gbW9kZSB3aGVuIG1hc3MgZWRpdCBpcyB2aXNpYmxlXG5cdFx0c2VsZWN0aW9uTW9kZSA9IHNlbGVjdGlvbk1vZGUgPT09IFNlbGVjdGlvbk1vZGUuU2luZ2xlID8gU2VsZWN0aW9uTW9kZS5TaW5nbGUgOiBTZWxlY3Rpb25Nb2RlLk11bHRpO1xuXHR9XG5cblx0aWYgKFxuXHRcdGhhc0JvdW5kQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobGluZUl0ZW1Bbm5vdGF0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKSkgfHxcblx0XHRoYXNDdXN0b21BY3Rpb25zQWx3YXlzVmlzaWJsZUluVG9vbEJhcihtYW5pZmVzdEFjdGlvbnMuYWN0aW9ucylcblx0KSB7XG5cdFx0cmV0dXJuIHNlbGVjdGlvbk1vZGU7XG5cdH1cblx0YUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucyA9IGdldFVJSGlkZGVuRXhwRm9yQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQoXG5cdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLFxuXHRcdGlzRW50aXR5U2V0XG5cdCk7XG5cdGFWaXNpYmxlQmluZGluZ0V4cHJlc3Npb25zID0gZ2V0VmlzaWJsZUV4cEZvckN1c3RvbUFjdGlvbnNSZXF1aXJpbmdDb250ZXh0KG1hbmlmZXN0QWN0aW9ucy5hY3Rpb25zKTtcblxuXHQvLyBObyBhY3Rpb24gcmVxdWlyaW5nIGEgY29udGV4dDpcblx0aWYgKFxuXHRcdGFIaWRkZW5CaW5kaW5nRXhwcmVzc2lvbnMubGVuZ3RoID09PSAwICYmXG5cdFx0YVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMubGVuZ3RoID09PSAwICYmXG5cdFx0KGRlbGV0ZUJ1dHRvblZpc2liaWxpdHlFeHByZXNzaW9uIHx8IGJNYXNzRWRpdEVuYWJsZWQpXG5cdCkge1xuXHRcdGlmICghaXNFbnRpdHlTZXQpIHtcblx0XHRcdC8vIEV4YW1wbGU6IE9QIGNhc2Vcblx0XHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIgfHwgYk1hc3NFZGl0RW5hYmxlZCkge1xuXHRcdFx0XHQvLyBCdWlsZGluZyBleHByZXNzaW9uIGZvciBkZWxldGUgYW5kIG1hc3MgZWRpdFxuXHRcdFx0XHRjb25zdCBidXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiA9IG9yKFxuXHRcdFx0XHRcdGRlbGV0ZUJ1dHRvblZpc2liaWxpdHlFeHByZXNzaW9uIHx8IHRydWUsIC8vIGRlZmF1bHQgZGVsZXRlIHZpc2liaWxpdHkgYXMgdHJ1ZVxuXHRcdFx0XHRcdG1hc3NFZGl0VmlzaWJpbGl0eUV4cHJlc3Npb25cblx0XHRcdFx0KTtcblx0XHRcdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0XHRcdGlmRWxzZShhbmQoVUkuSXNFZGl0YWJsZSwgYnV0dG9uVmlzaWJpbGl0eUV4cHJlc3Npb24pLCBjb25zdGFudChzZWxlY3Rpb25Nb2RlKSwgY29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKSlcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBTZWxlY3Rpb25Nb2RlLk5vbmU7XG5cdFx0XHR9XG5cdFx0XHQvLyBFbnRpdHlTZXQgZGVsZXRhYmxlOlxuXHRcdH0gZWxzZSBpZiAoYk1hc3NFZGl0RW5hYmxlZCkge1xuXHRcdFx0Ly8gZXhhbXBsZTogTFIgc2NlbmFyaW9cblx0XHRcdHJldHVybiBzZWxlY3Rpb25Nb2RlO1xuXHRcdH0gZWxzZSBpZiAodGFyZ2V0Q2FwYWJpbGl0aWVzLmlzRGVsZXRhYmxlICYmIGRlbGV0ZUJ1dHRvblZpc2liaWxpdHlFeHByZXNzaW9uKSB7XG5cdFx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKGRlbGV0ZUJ1dHRvblZpc2liaWxpdHlFeHByZXNzaW9uLCBjb25zdGFudChzZWxlY3Rpb25Nb2RlKSwgY29uc3RhbnQoXCJOb25lXCIpKSk7XG5cdFx0XHQvLyBFbnRpdHlTZXQgbm90IGRlbGV0YWJsZTpcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFNlbGVjdGlvbk1vZGUuTm9uZTtcblx0XHR9XG5cdFx0Ly8gVGhlcmUgYXJlIGFjdGlvbnMgcmVxdWlyaW5nIGEgY29udGV4dDpcblx0fSBlbHNlIGlmICghaXNFbnRpdHlTZXQpIHtcblx0XHQvLyBFeGFtcGxlOiBPUCBjYXNlXG5cdFx0aWYgKHRhcmdldENhcGFiaWxpdGllcy5pc0RlbGV0YWJsZSB8fCBwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgIT09IFwiZmFsc2VcIiB8fCBiTWFzc0VkaXRFbmFibGVkKSB7XG5cdFx0XHQvLyBVc2Ugc2VsZWN0aW9uTW9kZSBpbiBlZGl0IG1vZGUgaWYgZGVsZXRlIGlzIGVuYWJsZWQgb3IgbWFzcyBlZGl0IGlzIHZpc2libGVcblx0XHRcdGNvbnN0IGVkaXRNb2RlYnV0dG9uVmlzaWJpbGl0eUV4cHJlc3Npb24gPSBpZkVsc2UoXG5cdFx0XHRcdGJNYXNzRWRpdEVuYWJsZWQgJiYgIXRhcmdldENhcGFiaWxpdGllcy5pc0RlbGV0YWJsZSxcblx0XHRcdFx0bWFzc0VkaXRWaXNpYmlsaXR5RXhwcmVzc2lvbixcblx0XHRcdFx0Y29uc3RhbnQodHJ1ZSlcblx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRcdGlmRWxzZShcblx0XHRcdFx0XHRhbmQoVUkuSXNFZGl0YWJsZSwgZWRpdE1vZGVidXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiksXG5cdFx0XHRcdFx0Y29uc3RhbnQoc2VsZWN0aW9uTW9kZSksXG5cdFx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0XHRcdGNvbnN0YW50KHNlbGVjdGlvbk1vZGUpLFxuXHRcdFx0XHRcdFx0Y29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0XHRpZkVsc2UoXG5cdFx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0XHRjb25zdGFudChzZWxlY3Rpb25Nb2RlKSxcblx0XHRcdFx0XHRjb25zdGFudChTZWxlY3Rpb25Nb2RlLk5vbmUpXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdC8vRW50aXR5U2V0IGRlbGV0YWJsZTpcblx0fSBlbHNlIGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgYk1hc3NFZGl0RW5hYmxlZCkge1xuXHRcdC8vIEV4YW1wbGU6IExSIHNjZW5hcmlvXG5cdFx0cmV0dXJuIHNlbGVjdGlvbk1vZGU7XG5cdFx0Ly9FbnRpdHlTZXQgbm90IGRlbGV0YWJsZTpcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRpZkVsc2UoXG5cdFx0XHRcdG9yKC4uLmFIaWRkZW5CaW5kaW5nRXhwcmVzc2lvbnMuY29uY2F0KGFWaXNpYmxlQmluZGluZ0V4cHJlc3Npb25zKSwgbWFzc0VkaXRWaXNpYmlsaXR5RXhwcmVzc2lvbiksXG5cdFx0XHRcdGNvbnN0YW50KHNlbGVjdGlvbk1vZGUpLFxuXHRcdFx0XHRjb25zdGFudChTZWxlY3Rpb25Nb2RlLk5vbmUpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufVxuXG4vKipcbiAqIE1ldGhvZCB0byByZXRyaWV2ZSBhbGwgdGFibGUgYWN0aW9ucyBmcm9tIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBsaW5lSXRlbUFubm90YXRpb25cbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSB0YWJsZSBhbm5vdGF0aW9uIGFjdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0VGFibGVBbm5vdGF0aW9uQWN0aW9ucyhsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtLCB2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KSB7XG5cdGNvbnN0IHRhYmxlQWN0aW9uczogQmFzZUFjdGlvbltdID0gW107XG5cdGNvbnN0IGhpZGRlblRhYmxlQWN0aW9uczogQmFzZUFjdGlvbltdID0gW107XG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRsaW5lSXRlbUFubm90YXRpb24uZm9yRWFjaCgoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0XHRsZXQgdGFibGVBY3Rpb246IEFubm90YXRpb25BY3Rpb24gfCB1bmRlZmluZWQ7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QoZGF0YUZpZWxkKSAmJlxuXHRcdFx0XHQhKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSAmJlxuXHRcdFx0XHQhZGF0YUZpZWxkLklubGluZSAmJlxuXHRcdFx0XHQhZGF0YUZpZWxkLkRldGVybWluaW5nXG5cdFx0XHQpIHtcblx0XHRcdFx0Y29uc3Qga2V5ID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIjpcblx0XHRcdFx0XHRcdHRhYmxlQWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbixcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6IGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0XHRcdFx0XHRcdG5vdChcblx0XHRcdFx0XHRcdFx0XHRcdGVxdWFsKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFtdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFJlbGF0aXZlTW9kZWxQYXRoRnVuY3Rpb24oKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiOlxuXHRcdFx0XHRcdFx0dGFibGVBY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRcdFx0XHRcdFx0bm90KFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1YWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0W10sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0UmVsYXRpdmVNb2RlbFBhdGhGdW5jdGlvbigpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0aGlkZGVuVGFibGVBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGlmICh0YWJsZUFjdGlvbikge1xuXHRcdFx0XHR0YWJsZUFjdGlvbnMucHVzaCh0YWJsZUFjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHR0YWJsZUFjdGlvbnM6IHRhYmxlQWN0aW9ucyxcblx0XHRoaWRkZW5UYWJsZUFjdGlvbnM6IGhpZGRlblRhYmxlQWN0aW9uc1xuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRIaWdobGlnaHRSb3dCaW5kaW5nKFxuXHRjcml0aWNhbGl0eUFubm90YXRpb246IFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxDcml0aWNhbGl0eVR5cGU+IHwgRW51bVZhbHVlPENyaXRpY2FsaXR5VHlwZT4gfCB1bmRlZmluZWQsXG5cdGlzRHJhZnRSb290OiBib29sZWFuLFxuXHR0YXJnZXRFbnRpdHlUeXBlPzogRW50aXR5VHlwZVxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPE1lc3NhZ2VUeXBlPiB7XG5cdGxldCBkZWZhdWx0SGlnaGxpZ2h0Um93RGVmaW5pdGlvbjogTWVzc2FnZVR5cGUgfCBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248TWVzc2FnZVR5cGU+ID0gTWVzc2FnZVR5cGUuTm9uZTtcblx0aWYgKGNyaXRpY2FsaXR5QW5ub3RhdGlvbikge1xuXHRcdGlmICh0eXBlb2YgY3JpdGljYWxpdHlBbm5vdGF0aW9uID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRkZWZhdWx0SGlnaGxpZ2h0Um93RGVmaW5pdGlvbiA9IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihjcml0aWNhbGl0eUFubm90YXRpb24pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxNZXNzYWdlVHlwZT47XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEVudW0gVmFsdWUgc28gd2UgZ2V0IHRoZSBjb3JyZXNwb25kaW5nIHN0YXRpYyBwYXJ0XG5cdFx0XHRkZWZhdWx0SGlnaGxpZ2h0Um93RGVmaW5pdGlvbiA9IGdldE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5VHlwZShjcml0aWNhbGl0eUFubm90YXRpb24pO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGFNaXNzaW5nS2V5czogYW55W10gPSBbXTtcblx0dGFyZ2V0RW50aXR5VHlwZT8ua2V5cy5mb3JFYWNoKChrZXk6IGFueSkgPT4ge1xuXHRcdGlmIChrZXkubmFtZSAhPT0gXCJJc0FjdGl2ZUVudGl0eVwiKSB7XG5cdFx0XHRhTWlzc2luZ0tleXMucHVzaChwYXRoSW5Nb2RlbChrZXkubmFtZSwgdW5kZWZpbmVkKSk7XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gZm9ybWF0UmVzdWx0KFxuXHRcdFtcblx0XHRcdGRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uLFxuXHRcdFx0cGF0aEluTW9kZWwoYGZpbHRlcmVkTWVzc2FnZXNgLCBcImludGVybmFsXCIpLFxuXHRcdFx0aXNEcmFmdFJvb3QgJiYgRW50aXR5Lkhhc0FjdGl2ZSxcblx0XHRcdGlzRHJhZnRSb290ICYmIEVudGl0eS5Jc0FjdGl2ZSxcblx0XHRcdGAke2lzRHJhZnRSb290fWAsXG5cdFx0XHQuLi5hTWlzc2luZ0tleXNcblx0XHRdLFxuXHRcdHRhYmxlRm9ybWF0dGVycy5yb3dIaWdobGlnaHRpbmcsXG5cdFx0dGFyZ2V0RW50aXR5VHlwZVxuXHQpO1xufVxuXG5mdW5jdGlvbiBfZ2V0Q3JlYXRpb25CZWhhdmlvdXIoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uOiBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M6IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmdcbik6IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb25bXCJjcmVhdGVcIl0ge1xuXHRjb25zdCBuYXZpZ2F0aW9uID0gbmF2aWdhdGlvblNldHRpbmdzPy5jcmVhdGUgfHwgbmF2aWdhdGlvblNldHRpbmdzPy5kZXRhaWw7XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RTZXR0aW5nczogVGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCBvcmlnaW5hbFRhYmxlU2V0dGluZ3MgPSAodGFibGVNYW5pZmVzdFNldHRpbmdzICYmIHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzKSB8fCB7fTtcblx0Ly8gY3Jvc3MtYXBwXG5cdGlmIChuYXZpZ2F0aW9uPy5vdXRib3VuZCAmJiBuYXZpZ2F0aW9uLm91dGJvdW5kRGV0YWlsICYmIG5hdmlnYXRpb25TZXR0aW5ncz8uY3JlYXRlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1vZGU6IFwiRXh0ZXJuYWxcIixcblx0XHRcdG91dGJvdW5kOiBuYXZpZ2F0aW9uLm91dGJvdW5kLFxuXHRcdFx0b3V0Ym91bmREZXRhaWw6IG5hdmlnYXRpb24ub3V0Ym91bmREZXRhaWwsXG5cdFx0XHRuYXZpZ2F0aW9uU2V0dGluZ3M6IG5hdmlnYXRpb25TZXR0aW5nc1xuXHRcdH07XG5cdH1cblxuXHRsZXQgbmV3QWN0aW9uO1xuXHRpZiAobGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0Ly8gaW4tYXBwXG5cdFx0Y29uc3QgdGFyZ2V0QW5ub3RhdGlvbnMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpPy5hbm5vdGF0aW9ucztcblx0XHRjb25zdCB0YXJnZXRBbm5vdGF0aW9uc0NvbW1vbiA9IHRhcmdldEFubm90YXRpb25zPy5Db21tb24gYXMgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ29tbW9uLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvbnNTZXNzaW9uID0gdGFyZ2V0QW5ub3RhdGlvbnM/LlNlc3Npb24gYXMgRW50aXR5U2V0QW5ub3RhdGlvbnNfU2Vzc2lvbjtcblx0XHRuZXdBY3Rpb24gPSB0YXJnZXRBbm5vdGF0aW9uc0NvbW1vbj8uRHJhZnRSb290Py5OZXdBY3Rpb24gfHwgdGFyZ2V0QW5ub3RhdGlvbnNTZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkPy5OZXdBY3Rpb247XG5cblx0XHRpZiAodGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cgJiYgbmV3QWN0aW9uKSB7XG5cdFx0XHQvLyBBIGNvbWJpbmF0aW9uIG9mICdDcmVhdGlvblJvdycgYW5kICdOZXdBY3Rpb24nIGRvZXMgbm90IG1ha2Ugc2Vuc2Vcblx0XHRcdHRocm93IEVycm9yKGBDcmVhdGlvbiBtb2RlICcke0NyZWF0aW9uTW9kZS5DcmVhdGlvblJvd30nIGNhbiBub3QgYmUgdXNlZCB3aXRoIGEgY3VzdG9tICduZXcnIGFjdGlvbiAoJHtuZXdBY3Rpb259KWApO1xuXHRcdH1cblx0XHRpZiAobmF2aWdhdGlvbj8ucm91dGUpIHtcblx0XHRcdC8vIHJvdXRlIHNwZWNpZmllZFxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bW9kZTogdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlLFxuXHRcdFx0XHRhcHBlbmQ6IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0ZUF0RW5kLFxuXHRcdFx0XHRuZXdBY3Rpb246IG5ld0FjdGlvbj8udG9TdHJpbmcoKSxcblx0XHRcdFx0bmF2aWdhdGVUb1RhcmdldDogdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuTmV3UGFnZSA/IG5hdmlnYXRpb24ucm91dGUgOiB1bmRlZmluZWQgLy8gbmF2aWdhdGUgb25seSBpbiBOZXdQYWdlIG1vZGVcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Ly8gbm8gbmF2aWdhdGlvbiBvciBubyByb3V0ZSBzcGVjaWZpZWQgLSBmYWxsYmFjayB0byBpbmxpbmUgY3JlYXRlIGlmIG9yaWdpbmFsIGNyZWF0aW9uIG1vZGUgd2FzICdOZXdQYWdlJ1xuXHRpZiAodGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuTmV3UGFnZSkge1xuXHRcdHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSA9IENyZWF0aW9uTW9kZS5JbmxpbmU7XG5cdFx0Ly8gSW4gY2FzZSB0aGVyZSB3YXMgbm8gc3BlY2lmaWMgY29uZmlndXJhdGlvbiBmb3IgdGhlIGNyZWF0ZUF0RW5kIHdlIGZvcmNlIGl0IHRvIGZhbHNlXG5cdFx0aWYgKG9yaWdpbmFsVGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmNyZWF0ZUF0RW5kID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0ZUF0RW5kID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRtb2RlOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUsXG5cdFx0YXBwZW5kOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGVBdEVuZCxcblx0XHRuZXdBY3Rpb246IG5ld0FjdGlvbj8udG9TdHJpbmcoKVxuXHR9O1xufVxuXG5jb25zdCBfZ2V0Um93Q29uZmlndXJhdGlvblByb3BlcnR5ID0gZnVuY3Rpb24gKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M6IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdHRhcmdldFBhdGg6IHN0cmluZ1xuKSB7XG5cdGxldCBwcmVzc1Byb3BlcnR5LCBuYXZpZ2F0aW9uVGFyZ2V0O1xuXHRsZXQgY3JpdGljYWxpdHlQcm9wZXJ0eTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPE1lc3NhZ2VUeXBlPiA9IGNvbnN0YW50KE1lc3NhZ2VUeXBlLk5vbmUpO1xuXHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdGlmIChuYXZpZ2F0aW9uU2V0dGluZ3MgJiYgbGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0bmF2aWdhdGlvblRhcmdldCA9IG5hdmlnYXRpb25TZXR0aW5ncy5kaXNwbGF5Py50YXJnZXQgfHwgbmF2aWdhdGlvblNldHRpbmdzLmRldGFpbD8ub3V0Ym91bmQ7XG5cdFx0aWYgKG5hdmlnYXRpb25UYXJnZXQpIHtcblx0XHRcdHByZXNzUHJvcGVydHkgPVxuXHRcdFx0XHRcIi5oYW5kbGVycy5vbkNoZXZyb25QcmVzc05hdmlnYXRlT3V0Qm91bmQoICRjb250cm9sbGVyICwnXCIgKyBuYXZpZ2F0aW9uVGFyZ2V0ICsgXCInLCAkeyRwYXJhbWV0ZXJzPmJpbmRpbmdDb250ZXh0fSlcIjtcblx0XHR9IGVsc2UgaWYgKHRhcmdldEVudGl0eVR5cGUpIHtcblx0XHRcdGNvbnN0IHRhcmdldEVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdFx0XHRuYXZpZ2F0aW9uVGFyZ2V0ID0gbmF2aWdhdGlvblNldHRpbmdzLmRldGFpbD8ucm91dGU7XG5cdFx0XHRpZiAobmF2aWdhdGlvblRhcmdldCAmJiAhTW9kZWxIZWxwZXIuaXNTaW5nbGV0b24odGFyZ2V0RW50aXR5U2V0KSkge1xuXHRcdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gZ2V0SGlnaGxpZ2h0Um93QmluZGluZyhcblx0XHRcdFx0XHRsaW5lSXRlbUFubm90YXRpb24uYW5ub3RhdGlvbnM/LlVJPy5Dcml0aWNhbGl0eSxcblx0XHRcdFx0XHQhIU1vZGVsSGVscGVyLmdldERyYWZ0Um9vdCh0YXJnZXRFbnRpdHlTZXQpIHx8ICEhTW9kZWxIZWxwZXIuZ2V0RHJhZnROb2RlKHRhcmdldEVudGl0eVNldCksXG5cdFx0XHRcdFx0dGFyZ2V0RW50aXR5VHlwZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRwcmVzc1Byb3BlcnR5ID1cblx0XHRcdFx0XHRcIkFQSS5vblRhYmxlUm93UHJlc3MoJGV2ZW50LCAkY29udHJvbGxlciwgJHskcGFyYW1ldGVycz5iaW5kaW5nQ29udGV4dH0sIHsgY2FsbEV4dGVuc2lvbjogdHJ1ZSwgdGFyZ2V0UGF0aDogJ1wiICtcblx0XHRcdFx0XHR0YXJnZXRQYXRoICtcblx0XHRcdFx0XHRcIicsIGVkaXRhYmxlIDogXCIgK1xuXHRcdFx0XHRcdChNb2RlbEhlbHBlci5nZXREcmFmdFJvb3QodGFyZ2V0RW50aXR5U2V0KSB8fCBNb2RlbEhlbHBlci5nZXREcmFmdE5vZGUodGFyZ2V0RW50aXR5U2V0KVxuXHRcdFx0XHRcdFx0PyBcIiEkeyRwYXJhbWV0ZXJzPmJpbmRpbmdDb250ZXh0fS5nZXRQcm9wZXJ0eSgnSXNBY3RpdmVFbnRpdHknKVwiXG5cdFx0XHRcdFx0XHQ6IFwidW5kZWZpbmVkXCIpICtcblx0XHRcdFx0XHRcIn0pXCI7IC8vTmVlZCB0byBhY2Nlc3MgdG8gRHJhZnRSb290IGFuZCBEcmFmdE5vZGUgISEhISEhIVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IGdldEhpZ2hsaWdodFJvd0JpbmRpbmcobGluZUl0ZW1Bbm5vdGF0aW9uLmFubm90YXRpb25zPy5VST8uQ3JpdGljYWxpdHksIGZhbHNlLCB0YXJnZXRFbnRpdHlUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Y29uc3Qgcm93TmF2aWdhdGVkRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+ID0gZm9ybWF0UmVzdWx0KFxuXHRcdFtwYXRoSW5Nb2RlbChcIi9kZWVwZXN0UGF0aFwiLCBcImludGVybmFsXCIpXSxcblx0XHR0YWJsZUZvcm1hdHRlcnMubmF2aWdhdGVkUm93LFxuXHRcdHRhcmdldEVudGl0eVR5cGVcblx0KTtcblx0cmV0dXJuIHtcblx0XHRwcmVzczogcHJlc3NQcm9wZXJ0eSxcblx0XHRhY3Rpb246IHByZXNzUHJvcGVydHkgPyBcIk5hdmlnYXRpb25cIiA6IHVuZGVmaW5lZCxcblx0XHRyb3dIaWdobGlnaHRpbmc6IGNvbXBpbGVFeHByZXNzaW9uKGNyaXRpY2FsaXR5UHJvcGVydHkpLFxuXHRcdHJvd05hdmlnYXRlZDogY29tcGlsZUV4cHJlc3Npb24ocm93TmF2aWdhdGVkRXhwcmVzc2lvbiksXG5cdFx0dmlzaWJsZTogY29tcGlsZUV4cHJlc3Npb24obm90KFVJLklzSW5hY3RpdmUpKVxuXHR9O1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgY29sdW1ucyBmcm9tIHRoZSBlbnRpdHlUeXBlLlxuICpcbiAqIEBwYXJhbSBjb2x1bW5zVG9CZUNyZWF0ZWQgVGhlIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSB0YXJnZXQgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gYW5ub3RhdGlvbkNvbHVtbnMgVGhlIGFycmF5IG9mIGNvbHVtbnMgY3JlYXRlZCBiYXNlZCBvbiBMaW5lSXRlbSBhbm5vdGF0aW9ucy5cbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgVGhlIGFycmF5IG9mIGFsbCBub24gc29ydGFibGUgY29sdW1uIG5hbWVzLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHBhcmFtIHRhYmxlVHlwZSBUaGUgdGFibGUgdHlwZS5cbiAqIEByZXR1cm5zIFRoZSBjb2x1bW4gZnJvbSB0aGUgZW50aXR5VHlwZVxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlID0gZnVuY3Rpb24gKFxuXHRjb2x1bW5zVG9CZUNyZWF0ZWQ6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5Pixcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0YW5ub3RhdGlvbkNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW10sXG5cdG5vblNvcnRhYmxlQ29sdW1uczogc3RyaW5nW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHRhYmxlVHlwZTogVGFibGVUeXBlXG4pOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSB7XG5cdGNvbnN0IHRhYmxlQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10gPSBhbm5vdGF0aW9uQ29sdW1ucztcblx0Ly8gQ2F0Y2ggYWxyZWFkeSBleGlzdGluZyBjb2x1bW5zIC0gd2hpY2ggd2VyZSBhZGRlZCBiZWZvcmUgYnkgTGluZUl0ZW0gQW5ub3RhdGlvbnNcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0ZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5OiBQcm9wZXJ0eSkgPT4ge1xuXHRcdC8vIENhdGNoIGFscmVhZHkgZXhpc3RpbmcgY29sdW1ucyAtIHdoaWNoIHdlcmUgYWRkZWQgYmVmb3JlIGJ5IExpbmVJdGVtIEFubm90YXRpb25zXG5cdFx0Y29uc3QgZXhpc3RzID0gYW5ub3RhdGlvbkNvbHVtbnMuc29tZSgoY29sdW1uKSA9PiB7XG5cdFx0XHRyZXR1cm4gY29sdW1uLm5hbWUgPT09IHByb3BlcnR5Lm5hbWU7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiB0YXJnZXQgdHlwZSBleGlzdHMsIGl0IGlzIGEgY29tcGxleCBwcm9wZXJ0eSBhbmQgc2hvdWxkIGJlIGlnbm9yZWRcblx0XHRpZiAoXG5cdFx0XHQhcHJvcGVydHkudGFyZ2V0VHlwZSAmJlxuXHRcdFx0IWV4aXN0cyAmJlxuXHRcdFx0cHJvcGVydHkuYW5ub3RhdGlvbnMuVUkgJiZcblx0XHRcdCFpc1JlZmVyZW5jZVByb3BlcnR5U3RhdGljYWxseUhpZGRlbihwcm9wZXJ0eS5hbm5vdGF0aW9ucy5VSS5EYXRhRmllbGREZWZhdWx0KVxuXHRcdCkge1xuXHRcdFx0Y29uc3QgcmVsYXRlZFByb3BlcnRpZXNJbmZvOiBDb21wbGV4UHJvcGVydHlJbmZvID0gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzKFxuXHRcdFx0XHRwcm9wZXJ0eS5uYW1lLFxuXHRcdFx0XHRwcm9wZXJ0eSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0dGFibGVUeXBlXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgcmVsYXRlZFByb3BlcnR5TmFtZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMocmVsYXRlZFByb3BlcnRpZXNJbmZvLnByb3BlcnRpZXMpO1xuXHRcdFx0Y29uc3QgYWRkaXRpb25hbFByb3BlcnR5TmFtZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMocmVsYXRlZFByb3BlcnRpZXNJbmZvLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKTtcblx0XHRcdGNvbnN0IGNvbHVtbkluZm8gPSBnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5KFxuXHRcdFx0XHRwcm9wZXJ0eSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdHByb3BlcnR5Lm5hbWUsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRcdFx0YWdncmVnYXRpb25IZWxwZXIsXG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IHNlbWFudGljS2V5cyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXCJDb21tb25cIiwgQ29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljS2V5LCBbXG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpXG5cdFx0XHRdKVswXTtcblx0XHRcdGNvbnN0IG9Db2x1bW5EcmFmdEluZGljYXRvciA9IGdldERlZmF1bHREcmFmdEluZGljYXRvckZvckNvbHVtbihjb2x1bW5JbmZvLm5hbWUsIHNlbWFudGljS2V5cywgZmFsc2UsIG51bGwpO1xuXHRcdFx0aWYgKE9iamVjdC5rZXlzKG9Db2x1bW5EcmFmdEluZGljYXRvcikubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb2x1bW5JbmZvLmZvcm1hdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0Li4ub0NvbHVtbkRyYWZ0SW5kaWNhdG9yXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVsYXRlZFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb2x1bW5JbmZvLnByb3BlcnR5SW5mb3MgPSByZWxhdGVkUHJvcGVydHlOYW1lcztcblx0XHRcdFx0Y29sdW1uSW5mby5leHBvcnRTZXR0aW5ncyA9IHtcblx0XHRcdFx0XHQuLi5jb2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSxcblx0XHRcdFx0XHR3cmFwOiByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0U2V0dGluZ3NXcmFwcGluZ1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLnR5cGUgPSBfZ2V0RXhwb3J0RGF0YVR5cGUocHJvcGVydHkudHlwZSwgcmVsYXRlZFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMSk7XG5cblx0XHRcdFx0aWYgKHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRVbml0TmFtZSkge1xuXHRcdFx0XHRcdGNvbHVtbkluZm8uZXhwb3J0U2V0dGluZ3MudW5pdFByb3BlcnR5ID0gcmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFVuaXROYW1lO1xuXHRcdFx0XHRcdGNvbHVtbkluZm8uZXhwb3J0U2V0dGluZ3MudHlwZSA9IFwiQ3VycmVuY3lcIjsgLy8gRm9yY2UgdG8gYSBjdXJyZW5jeSBiZWNhdXNlIHRoZXJlJ3MgYSB1bml0UHJvcGVydHkgKG90aGVyd2lzZSB0aGUgdmFsdWUgaXNuJ3QgcHJvcGVybHkgZm9ybWF0dGVkIHdoZW4gZXhwb3J0ZWQpXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFVuaXRTdHJpbmcpIHtcblx0XHRcdFx0XHRjb2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLnVuaXQgPSByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VW5pdFN0cmluZztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFRpbWV6b25lTmFtZSkge1xuXHRcdFx0XHRcdGNvbHVtbkluZm8uZXhwb3J0U2V0dGluZ3MudGltZXpvbmVQcm9wZXJ0eSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRUaW1lem9uZU5hbWU7XG5cdFx0XHRcdFx0Y29sdW1uSW5mby5leHBvcnRTZXR0aW5ncy51dGMgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VGltZXpvbmVTdHJpbmcpIHtcblx0XHRcdFx0XHRjb2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLnRpbWV6b25lID0gcmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFRpbWV6b25lU3RyaW5nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ29sbGVjdCBpbmZvcm1hdGlvbiBvZiByZWxhdGVkIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cblx0XHRcdFx0cmVsYXRlZFByb3BlcnR5TmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbHVtbnNUb0JlQ3JlYXRlZFtuYW1lXSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzW25hbWVdO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFkZGl0aW9uYWxQcm9wZXJ0eU5hbWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29sdW1uSW5mby5hZGRpdGlvbmFsUHJvcGVydHlJbmZvcyA9IGFkZGl0aW9uYWxQcm9wZXJ0eU5hbWVzO1xuXHRcdFx0XHQvLyBDcmVhdGUgY29sdW1ucyBmb3IgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGlkZW50aWZpZWQgZm9yIEFMUCB1c2UgY2FzZS5cblx0XHRcdFx0YWRkaXRpb25hbFByb3BlcnR5TmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuXHRcdFx0XHRcdC8vIEludGVudGlvbmFsIG92ZXJ3cml0ZSBhcyB3ZSByZXF1aXJlIG9ubHkgb25lIG5ldyBQcm9wZXJ0eUluZm8gZm9yIGEgcmVsYXRlZCBQcm9wZXJ0eS5cblx0XHRcdFx0XHRjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0gPSByZWxhdGVkUHJvcGVydGllc0luZm8uYWRkaXRpb25hbFByb3BlcnRpZXNbbmFtZV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGFibGVDb2x1bW5zLnB1c2goY29sdW1uSW5mbyk7XG5cdFx0fSBlbHNlIGlmIChnZXREaXNwbGF5TW9kZShwcm9wZXJ0eSkgPT09IFwiRGVzY3JpcHRpb25cIikge1xuXHRcdFx0dGFibGVDb2x1bW5zLnB1c2goXG5cdFx0XHRcdGdldENvbHVtbkRlZmluaXRpb25Gcm9tUHJvcGVydHkoXG5cdFx0XHRcdFx0cHJvcGVydHksXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0cHJvcGVydHkubmFtZSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRub25Tb3J0YWJsZUNvbHVtbnMsXG5cdFx0XHRcdFx0YWdncmVnYXRpb25IZWxwZXIsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gQ3JlYXRlIGEgcHJvcGVydHlJbmZvIGZvciBlYWNoIHJlbGF0ZWQgcHJvcGVydHkuXG5cdGNvbnN0IHJlbGF0ZWRDb2x1bW5zID0gX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zKGNvbHVtbnNUb0JlQ3JlYXRlZCwgdGFibGVDb2x1bW5zLCBub25Tb3J0YWJsZUNvbHVtbnMsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpO1xuXG5cdHJldHVybiB0YWJsZUNvbHVtbnMuY29uY2F0KHJlbGF0ZWRDb2x1bW5zKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgY29sdW1uIGRlZmluaXRpb24gZnJvbSBhIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eSBFbnRpdHkgdHlwZSBwcm9wZXJ0eSBmb3Igd2hpY2ggdGhlIGNvbHVtbiBpcyBjcmVhdGVkXG4gKiBAcGFyYW0gZnVsbFByb3BlcnR5UGF0aCBUaGUgZnVsbCBwYXRoIHRvIHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEBwYXJhbSByZWxhdGl2ZVBhdGggVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIHRhcmdldCBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgY29udGV4dFxuICogQHBhcmFtIHVzZURhdGFGaWVsZFByZWZpeCBTaG91bGQgYmUgcHJlZml4ZWQgd2l0aCBcIkRhdGFGaWVsZDo6XCIsIGVsc2UgaXQgd2lsbCBiZSBwcmVmaXhlZCB3aXRoIFwiUHJvcGVydHk6OlwiXG4gKiBAcGFyYW0gYXZhaWxhYmxlRm9yQWRhcHRhdGlvbiBEZWNpZGVzIHdoZXRoZXIgdGhlIGNvbHVtbiBzaG91bGQgYmUgYXZhaWxhYmxlIGZvciBhZGFwdGF0aW9uXG4gKiBAcGFyYW0gbm9uU29ydGFibGVDb2x1bW5zIFRoZSBhcnJheSBvZiBhbGwgbm9uLXNvcnRhYmxlIGNvbHVtbiBuYW1lc1xuICogQHBhcmFtIGFnZ3JlZ2F0aW9uSGVscGVyIFRoZSBhZ2dyZWdhdGlvbkhlbHBlciBmb3IgdGhlIGVudGl0eVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgYW5ub3RhdGlvbiBjb2x1bW4gZGVmaW5pdGlvblxuICovXG5jb25zdCBnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5ID0gZnVuY3Rpb24gKFxuXHRwcm9wZXJ0eTogUHJvcGVydHksXG5cdGZ1bGxQcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmcsXG5cdHVzZURhdGFGaWVsZFByZWZpeDogYm9vbGVhbixcblx0YXZhaWxhYmxlRm9yQWRhcHRhdGlvbjogYm9vbGVhbixcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0YWdncmVnYXRpb25IZWxwZXI6IEFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBBbm5vdGF0aW9uVGFibGVDb2x1bW4ge1xuXHRjb25zdCBuYW1lID0gdXNlRGF0YUZpZWxkUHJlZml4ID8gcmVsYXRpdmVQYXRoIDogYFByb3BlcnR5Ojoke3JlbGF0aXZlUGF0aH1gO1xuXHRjb25zdCBrZXkgPSAodXNlRGF0YUZpZWxkUHJlZml4ID8gXCJEYXRhRmllbGQ6OlwiIDogXCJQcm9wZXJ0eTo6XCIpICsgcmVwbGFjZVNwZWNpYWxDaGFycyhyZWxhdGl2ZVBhdGgpO1xuXHRjb25zdCBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoID0gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQsIHByb3BlcnR5KTtcblx0Y29uc3QgaXNIaWRkZW4gPSBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlO1xuXHRjb25zdCBncm91cFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHByb3BlcnR5Lm5hbWUgPyBfc2xpY2VBdFNsYXNoKHByb3BlcnR5Lm5hbWUsIHRydWUsIGZhbHNlKSA6IHVuZGVmaW5lZDtcblx0Y29uc3QgaXNHcm91cDogYm9vbGVhbiA9IGdyb3VwUGF0aCAhPSBwcm9wZXJ0eS5uYW1lO1xuXHRjb25zdCBpc0RhdGFQb2ludEZha2VQcm9wZXJ0eTogYm9vbGVhbiA9IG5hbWUuaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIikgPiAtMTtcblx0Y29uc3QgZXhwb3J0VHlwZTogc3RyaW5nID0gX2dldEV4cG9ydERhdGFUeXBlKHByb3BlcnR5LnR5cGUpO1xuXHRjb25zdCBzRGF0ZUlucHV0Rm9ybWF0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBwcm9wZXJ0eS50eXBlID09PSBcIkVkbS5EYXRlXCIgPyBcIllZWVktTU0tRERcIiA6IHVuZGVmaW5lZDtcblx0Y29uc3QgZGF0YVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGdldERhdGFGaWVsZERhdGFUeXBlKHByb3BlcnR5KTtcblx0Y29uc3QgcHJvcGVydHlUeXBlQ29uZmlnID0gIWlzRGF0YVBvaW50RmFrZVByb3BlcnR5ID8gZ2V0VHlwZUNvbmZpZyhwcm9wZXJ0eSwgZGF0YVR5cGUpIDogdW5kZWZpbmVkO1xuXHRjb25zdCBzZW1hbnRpY0tleXM6IFNlbWFudGljS2V5ID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uc0J5VGVybShcIkNvbW1vblwiLCBDb21tb25Bbm5vdGF0aW9uVGVybXMuU2VtYW50aWNLZXksIFtcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKVxuXHRdKVswXTtcblx0Y29uc3Qgc29ydGFibGUgPSAhaXNIaWRkZW4gJiYgbm9uU29ydGFibGVDb2x1bW5zLmluZGV4T2YocmVsYXRpdmVQYXRoKSA9PT0gLTEgJiYgIWlzRGF0YVBvaW50RmFrZVByb3BlcnR5O1xuXHRjb25zdCBvVHlwZUNvbmZpZyA9ICFpc0RhdGFQb2ludEZha2VQcm9wZXJ0eVxuXHRcdD8ge1xuXHRcdFx0XHRjbGFzc05hbWU6IHByb3BlcnR5LnR5cGUgfHwgZGF0YVR5cGUsXG5cdFx0XHRcdG9Gb3JtYXRPcHRpb25zOiBwcm9wZXJ0eVR5cGVDb25maWcuZm9ybWF0T3B0aW9ucyxcblx0XHRcdFx0b0NvbnN0cmFpbnRzOiBwcm9wZXJ0eVR5cGVDb25maWcuY29uc3RyYWludHNcblx0XHQgIH1cblx0XHQ6IHVuZGVmaW5lZDtcblx0Y29uc3QgZXhwb3J0U2V0dGluZ3M6IGFueSA9IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5XG5cdFx0PyB7XG5cdFx0XHRcdHRlbXBsYXRlOiBnZXRUYXJnZXRWYWx1ZU9uRGF0YVBvaW50KHByb3BlcnR5KVxuXHRcdCAgfVxuXHRcdDoge1xuXHRcdFx0XHR0eXBlOiBleHBvcnRUeXBlLFxuXHRcdFx0XHRpbnB1dEZvcm1hdDogc0RhdGVJbnB1dEZvcm1hdCxcblx0XHRcdFx0c2NhbGU6IHByb3BlcnR5LnNjYWxlLFxuXHRcdFx0XHRkZWxpbWl0ZXI6IHByb3BlcnR5LnR5cGUgPT09IFwiRWRtLkludDY0XCJcblx0XHQgIH07XG5cblx0aWYgKCFpc0RhdGFQb2ludEZha2VQcm9wZXJ0eSkge1xuXHRcdGNvbnN0IG9Vbml0UHJvcGVydHkgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShwcm9wZXJ0eSkgfHwgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eShwcm9wZXJ0eSk7XG5cdFx0Y29uc3Qgb1RpbWV6b25lUHJvcGVydHkgPSBnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eShwcm9wZXJ0eSk7XG5cdFx0Y29uc3Qgc1VuaXRUZXh0ID0gcHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgcHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0XHRjb25zdCBzVGltZXpvbmVUZXh0ID0gcHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LlRpbWV6b25lO1xuXHRcdGlmIChvVW5pdFByb3BlcnR5KSB7XG5cdFx0XHRleHBvcnRTZXR0aW5ncy51bml0UHJvcGVydHkgPSBvVW5pdFByb3BlcnR5Lm5hbWU7XG5cdFx0XHRleHBvcnRTZXR0aW5ncy50eXBlID0gXCJDdXJyZW5jeVwiOyAvLyBGb3JjZSB0byBhIGN1cnJlbmN5IGJlY2F1c2UgdGhlcmUncyBhIHVuaXRQcm9wZXJ0eSAob3RoZXJ3aXNlIHRoZSB2YWx1ZSBpc24ndCBwcm9wZXJseSBmb3JtYXR0ZWQgd2hlbiBleHBvcnRlZClcblx0XHR9IGVsc2UgaWYgKHNVbml0VGV4dCkge1xuXHRcdFx0ZXhwb3J0U2V0dGluZ3MudW5pdCA9IGAke3NVbml0VGV4dH1gO1xuXHRcdH1cblx0XHRpZiAob1RpbWV6b25lUHJvcGVydHkpIHtcblx0XHRcdGV4cG9ydFNldHRpbmdzLnRpbWV6b25lUHJvcGVydHkgPSBvVGltZXpvbmVQcm9wZXJ0eS5uYW1lO1xuXHRcdFx0ZXhwb3J0U2V0dGluZ3MudXRjID0gZmFsc2U7XG5cdFx0fSBlbHNlIGlmIChzVGltZXpvbmVUZXh0KSB7XG5cdFx0XHRleHBvcnRTZXR0aW5ncy50aW1lem9uZSA9IHNUaW1lem9uZVRleHQudG9TdHJpbmcoKTtcblx0XHR9XG5cdH1cblx0Y29uc3QgY29sbGVjdGVkTmF2aWdhdGlvblByb3BlcnR5TGFiZWxzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCA9IF9nZXRDb2xsZWN0ZWROYXZpZ2F0aW9uUHJvcGVydHlMYWJlbHMocmVsYXRpdmVQYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRjb25zdCBvQ29sdW1uOiBhbnkgPSB7XG5cdFx0a2V5OiBrZXksXG5cdFx0dHlwZTogQ29sdW1uVHlwZS5Bbm5vdGF0aW9uLFxuXHRcdGxhYmVsOiBnZXRMYWJlbChwcm9wZXJ0eSwgaXNHcm91cCksXG5cdFx0Z3JvdXBMYWJlbDogaXNHcm91cCA/IGdldExhYmVsKHByb3BlcnR5KSA6IG51bGwsXG5cdFx0Z3JvdXA6IGlzR3JvdXAgPyBncm91cFBhdGggOiBudWxsLFxuXHRcdGFubm90YXRpb25QYXRoOiBmdWxsUHJvcGVydHlQYXRoLFxuXHRcdHNlbWFudGljT2JqZWN0UGF0aDogc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCxcblx0XHQvLyBBIGZha2UgcHJvcGVydHkgd2FzIGNyZWF0ZWQgZm9yIHRoZSBUYXJnZXRWYWx1ZSB1c2VkIG9uIERhdGFQb2ludHMsIHRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGhpZGRlbiBhbmQgbm9uIHNvcnRhYmxlXG5cdFx0YXZhaWxhYmlsaXR5OlxuXHRcdFx0IWF2YWlsYWJsZUZvckFkYXB0YXRpb24gfHwgaXNIaWRkZW4gfHwgaXNEYXRhUG9pbnRGYWtlUHJvcGVydHkgPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuQWRhcHRhdGlvbixcblx0XHRuYW1lOiBuYW1lLFxuXHRcdHJlbGF0aXZlUGF0aDogaXNEYXRhUG9pbnRGYWtlUHJvcGVydHlcblx0XHRcdD8gKHByb3BlcnR5IGFzIGFueSkuYW5ub3RhdGlvbnM/LlVJPy5EYXRhRmllbGREZWZhdWx0Py5UYXJnZXQ/LiR0YXJnZXQ/LlZhbHVlPy5wYXRoIHx8IChwcm9wZXJ0eSBhcyBhbnkpLlZhbHVlLnBhdGhcblx0XHRcdDogcmVsYXRpdmVQYXRoLFxuXHRcdHNvcnRhYmxlOiBzb3J0YWJsZSxcblx0XHRpc0dyb3VwYWJsZTogYWdncmVnYXRpb25IZWxwZXIuaXNBbmFseXRpY3NTdXBwb3J0ZWQoKSA/IGFnZ3JlZ2F0aW9uSGVscGVyLmlzUHJvcGVydHlHcm91cGFibGUocHJvcGVydHkpIDogc29ydGFibGUsXG5cdFx0aXNLZXk6IHByb3BlcnR5LmlzS2V5LFxuXHRcdGlzRGF0YVBvaW50RmFrZVRhcmdldFByb3BlcnR5OiBpc0RhdGFQb2ludEZha2VQcm9wZXJ0eSxcblx0XHRleHBvcnRTZXR0aW5nczogZXhwb3J0U2V0dGluZ3MsXG5cdFx0Y2FzZVNlbnNpdGl2ZTogaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlKGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdHR5cGVDb25maWc6IG9UeXBlQ29uZmlnLFxuXHRcdHZpc3VhbFNldHRpbmdzOiBpc0RhdGFQb2ludEZha2VQcm9wZXJ0eSA/IHsgd2lkdGhDYWxjdWxhdGlvbjogbnVsbCB9IDogdW5kZWZpbmVkLFxuXHRcdGltcG9ydGFuY2U6IGdldEltcG9ydGFuY2UoKHByb3BlcnR5IGFzIGFueSkuYW5ub3RhdGlvbnM/LlVJPy5EYXRhRmllbGREZWZhdWx0LCBzZW1hbnRpY0tleXMpLFxuXHRcdGFkZGl0aW9uYWxMYWJlbHM6IGNvbGxlY3RlZE5hdmlnYXRpb25Qcm9wZXJ0eUxhYmVsc1xuXHR9O1xuXHRjb25zdCBzVG9vbHRpcCA9IF9nZXRUb29sdGlwKHByb3BlcnR5KTtcblx0aWYgKHNUb29sdGlwKSB7XG5cdFx0b0NvbHVtbi50b29sdGlwID0gc1Rvb2x0aXA7XG5cdH1cblxuXHRyZXR1cm4gb0NvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG59O1xuXG4vKipcbiAqIFJldHVybnMgQm9vbGVhbiB0cnVlIGZvciB2YWxpZCBjb2x1bW5zLCBmYWxzZSBmb3IgaW52YWxpZCBjb2x1bW5zLlxuICpcbiAqIEBwYXJhbSBkYXRhRmllbGQgRGlmZmVyZW50IERhdGFGaWVsZCB0eXBlcyBkZWZpbmVkIGluIHRoZSBhbm5vdGF0aW9uc1xuICogQHJldHVybnMgVHJ1ZSBmb3IgdmFsaWQgY29sdW1ucywgZmFsc2UgZm9yIGludmFsaWQgY29sdW1uc1xuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX2lzVmFsaWRDb2x1bW4gPSBmdW5jdGlvbiAoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSB7XG5cdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRyZXR1cm4gISFkYXRhRmllbGQuSW5saW5lO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGRlZmF1bHQ6XG5cdFx0Ly8gVG9kbzogUmVwbGFjZSB3aXRoIHByb3BlciBMb2cgc3RhdGVtZW50IG9uY2UgYXZhaWxhYmxlXG5cdFx0Ly8gIHRocm93IG5ldyBFcnJvcihcIlVuaGFuZGxlZCBEYXRhRmllbGQgQWJzdHJhY3QgdHlwZTogXCIgKyBkYXRhRmllbGQuJFR5cGUpO1xuXHR9XG59O1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUgdGhlIHZpc2liaWxpdHkgb2YgYSBEYXRhRmllbGQgb3IgRGF0YVBvaW50IGFubm90YXRpb24uXG4gKlxuICogU0FQIEZpb3JpIGVsZW1lbnRzIHdpbGwgZXZhbHVhdGUgZWl0aGVyIHRoZSBVSS5IaWRkZW4gYW5ub3RhdGlvbiBkZWZpbmVkIG9uIHRoZSBhbm5vdGF0aW9uIGl0c2VsZiBvciBvbiB0aGUgdGFyZ2V0IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBkYXRhRmllbGRNb2RlbFBhdGggVGhlIG1ldGFwYXRoIHJlZmVycmluZyB0byB0aGUgYW5ub3RhdGlvbiB0aGF0IGlzIGV2YWx1YXRlZCBieSBTQVAgRmlvcmkgZWxlbWVudHMuXG4gKiBAcGFyYW0gW2Zvcm1hdE9wdGlvbnNdIEZvcm1hdE9wdGlvbnMgb3B0aW9uYWwuXG4gKiBAcGFyYW0gZm9ybWF0T3B0aW9ucy5pc0FuYWx5dGljcyBUaGlzIGZsYWcgaXMgdXNlZCB0byBjaGVjayBpZiB0aGUgYW5hbHl0aWMgdGFibGUgaGFzIEdyb3VwSGVhZGVyIGV4cGFuZGVkLlxuICogQHJldHVybnMgQW4gZXhwcmVzc2lvbiB0aGF0IHlvdSBjYW4gYmluZCB0byB0aGUgVUkuXG4gKi9cbmV4cG9ydCBjb25zdCBfZ2V0VmlzaWJsZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoXG5cdGRhdGFGaWVsZE1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Zm9ybWF0T3B0aW9ucz86IGFueVxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4ge1xuXHRjb25zdCB0YXJnZXRPYmplY3Q6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBEYXRhUG9pbnRUeXBlVHlwZXMgPSBkYXRhRmllbGRNb2RlbFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRsZXQgcHJvcGVydHlWYWx1ZTtcblx0aWYgKHRhcmdldE9iamVjdCkge1xuXHRcdHN3aXRjaCAodGFyZ2V0T2JqZWN0LiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlOlxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlID0gdGFyZ2V0T2JqZWN0LlZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdFx0XHQvLyBpZiBpdCBpcyBhIERhdGFGaWVsZEZvckFubm90YXRpb24gcG9pbnRpbmcgdG8gYSBEYXRhUG9pbnQgd2UgbG9vayBhdCB0aGUgZGF0YVBvaW50J3MgdmFsdWVcblx0XHRcdFx0aWYgKHRhcmdldE9iamVjdD8uVGFyZ2V0Py4kdGFyZ2V0Py4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZSkge1xuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWUgPSB0YXJnZXRPYmplY3QuVGFyZ2V0LiR0YXJnZXQ/LlZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cHJvcGVydHlWYWx1ZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0Y29uc3QgaXNBbmFseXRpY2FsR3JvdXBIZWFkZXJFeHBhbmRlZCA9IGZvcm1hdE9wdGlvbnM/LmlzQW5hbHl0aWNzID8gVUkuSXNFeHBhbmRlZCA6IGNvbnN0YW50KGZhbHNlKTtcblx0Y29uc3QgaXNBbmFseXRpY2FsTGVhZiA9IGZvcm1hdE9wdGlvbnM/LmlzQW5hbHl0aWNzID8gZXF1YWwoVUkuTm9kZUxldmVsLCAwKSA6IGNvbnN0YW50KGZhbHNlKTtcblxuXHQvLyBBIGRhdGEgZmllbGQgaXMgdmlzaWJsZSBpZjpcblx0Ly8gLSB0aGUgVUkuSGlkZGVuIGV4cHJlc3Npb24gaW4gdGhlIG9yaWdpbmFsIGFubm90YXRpb24gZG9lcyBub3QgZXZhbHVhdGUgdG8gJ3RydWUnXG5cdC8vIC0gdGhlIFVJLkhpZGRlbiBleHByZXNzaW9uIGluIHRoZSB0YXJnZXQgcHJvcGVydHkgZG9lcyBub3QgZXZhbHVhdGUgdG8gJ3RydWUnXG5cdC8vIC0gaW4gY2FzZSBvZiBBbmFseXRpY3MgaXQncyBub3QgdmlzaWJsZSBmb3IgYW4gZXhwYW5kZWQgR3JvdXBIZWFkZXJcblx0cmV0dXJuIGFuZChcblx0XHQuLi5bXG5cdFx0XHRub3QoZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSksXG5cdFx0XHRpZkVsc2UoXG5cdFx0XHRcdCEhcHJvcGVydHlWYWx1ZSxcblx0XHRcdFx0cHJvcGVydHlWYWx1ZSAmJiBub3QoZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHByb3BlcnR5VmFsdWUuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSksXG5cdFx0XHRcdHRydWVcblx0XHRcdCksXG5cdFx0XHRvcihub3QoaXNBbmFseXRpY2FsR3JvdXBIZWFkZXJFeHBhbmRlZCksIGlzQW5hbHl0aWNhbExlYWYpXG5cdFx0XVxuXHQpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGhpZGRlbiBiaW5kaW5nIGV4cHJlc3Npb25zIGZvciBhIGZpZWxkIGdyb3VwLlxuICpcbiAqIEBwYXJhbSBkYXRhRmllbGRHcm91cCBEYXRhRmllbGQgZGVmaW5lZCBpbiB0aGUgYW5ub3RhdGlvbnNcbiAqIEBwYXJhbSBmaWVsZEZvcm1hdE9wdGlvbnMgRm9ybWF0T3B0aW9ucyBvcHRpb25hbC5cbiAqIEBwYXJhbSBmaWVsZEZvcm1hdE9wdGlvbnMuaXNBbmFseXRpY3MgVGhpcyBmbGFnIGlzIHVzZWQgdG8gY2hlY2sgaWYgdGhlIGFuYWx5dGljIHRhYmxlIGhhcyBHcm91cEhlYWRlciBleHBhbmRlZC5cbiAqIEByZXR1cm5zIENvbXBpbGUgYmluZGluZyBvZiBmaWVsZCBncm91cCBleHByZXNzaW9ucy5cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9nZXRGaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMgPSBmdW5jdGlvbiAoXG5cdGRhdGFGaWVsZEdyb3VwOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLFxuXHRmaWVsZEZvcm1hdE9wdGlvbnM6IGFueVxuKTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfCB1bmRlZmluZWQge1xuXHRjb25zdCBhRmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PltdID0gW107XG5cdGlmIChcblx0XHRkYXRhRmllbGRHcm91cC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiAmJlxuXHRcdGRhdGFGaWVsZEdyb3VwLlRhcmdldD8uJHRhcmdldD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkZpZWxkR3JvdXBUeXBlXG5cdCkge1xuXHRcdGRhdGFGaWVsZEdyb3VwLlRhcmdldC4kdGFyZ2V0LkRhdGE/LmZvckVhY2goKGlubmVyRGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIHwgRGF0YVBvaW50VHlwZVR5cGVzKSA9PiB7XG5cdFx0XHRhRmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zLnB1c2goXG5cdFx0XHRcdF9nZXRWaXNpYmxlRXhwcmVzc2lvbih7IHRhcmdldE9iamVjdDogaW5uZXJEYXRhRmllbGQgfSBhcyBEYXRhTW9kZWxPYmplY3RQYXRoLCBmaWVsZEZvcm1hdE9wdGlvbnMpXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihpZkVsc2Uob3IoLi4uYUZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucyksIGNvbnN0YW50KHRydWUpLCBjb25zdGFudChmYWxzZSkpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGxhYmVsIGZvciB0aGUgcHJvcGVydHkgYW5kIGRhdGFGaWVsZC5cbiAqXG4gKiBAcGFyYW0gW3Byb3BlcnR5XSBQcm9wZXJ0eSwgRGF0YUZpZWxkIG9yIE5hdmlnYXRpb24gUHJvcGVydHkgZGVmaW5lZCBpbiB0aGUgYW5ub3RhdGlvbnNcbiAqIEBwYXJhbSBpc0dyb3VwXG4gKiBAcmV0dXJucyBMYWJlbCBvZiB0aGUgcHJvcGVydHkgb3IgRGF0YUZpZWxkXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBnZXRMYWJlbCA9IGZ1bmN0aW9uIChwcm9wZXJ0eTogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB8IFByb3BlcnR5IHwgTmF2aWdhdGlvblByb3BlcnR5LCBpc0dyb3VwID0gZmFsc2UpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAoIXByb3BlcnR5KSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRpZiAoaXNQcm9wZXJ0eShwcm9wZXJ0eSkgfHwgaXNOYXZpZ2F0aW9uUHJvcGVydHkocHJvcGVydHkpKSB7XG5cdFx0Y29uc3QgZGF0YUZpZWxkRGVmYXVsdCA9IChwcm9wZXJ0eSBhcyBQcm9wZXJ0eSkuYW5ub3RhdGlvbnM/LlVJPy5EYXRhRmllbGREZWZhdWx0O1xuXHRcdGlmIChkYXRhRmllbGREZWZhdWx0ICYmICFkYXRhRmllbGREZWZhdWx0LnF1YWxpZmllciAmJiBkYXRhRmllbGREZWZhdWx0LkxhYmVsPy52YWx1ZU9mKCkpIHtcblx0XHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZGF0YUZpZWxkRGVmYXVsdC5MYWJlbD8udmFsdWVPZigpKSk7XG5cdFx0fVxuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ocHJvcGVydHkuYW5ub3RhdGlvbnMuQ29tbW9uPy5MYWJlbD8udmFsdWVPZigpIHx8IHByb3BlcnR5Lm5hbWUpKTtcblx0fSBlbHNlIGlmIChpc0RhdGFGaWVsZFR5cGVzKHByb3BlcnR5KSkge1xuXHRcdGlmICghIWlzR3JvdXAgJiYgcHJvcGVydHkuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb24pIHtcblx0XHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ocHJvcGVydHkuTGFiZWw/LnZhbHVlT2YoKSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oXG5cdFx0XHRcdHByb3BlcnR5LkxhYmVsPy52YWx1ZU9mKCkgfHwgcHJvcGVydHkuVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKCkgfHwgcHJvcGVydHkuVmFsdWU/LiR0YXJnZXQ/Lm5hbWVcblx0XHRcdClcblx0XHQpO1xuXHR9IGVsc2UgaWYgKHByb3BlcnR5LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uKSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKFxuXHRcdFx0XHRwcm9wZXJ0eS5MYWJlbD8udmFsdWVPZigpIHx8IChwcm9wZXJ0eS5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKClcblx0XHRcdClcblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ocHJvcGVydHkuTGFiZWw/LnZhbHVlT2YoKSkpO1xuXHR9XG59O1xuXG5jb25zdCBfZ2V0VG9vbHRpcCA9IGZ1bmN0aW9uIChzb3VyY2U6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICghc291cmNlKSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGlmIChpc1Byb3BlcnR5KHNvdXJjZSkgfHwgc291cmNlLmFubm90YXRpb25zPy5Db21tb24/LlF1aWNrSW5mbykge1xuXHRcdHJldHVybiBzb3VyY2UuYW5ub3RhdGlvbnM/LkNvbW1vbj8uUXVpY2tJbmZvXG5cdFx0XHQ/IGNvbXBpbGVFeHByZXNzaW9uKGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihzb3VyY2UuYW5ub3RhdGlvbnMuQ29tbW9uLlF1aWNrSW5mby52YWx1ZU9mKCkpKVxuXHRcdFx0OiB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoaXNEYXRhRmllbGRUeXBlcyhzb3VyY2UpKSB7XG5cdFx0cmV0dXJuIHNvdXJjZS5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uUXVpY2tJbmZvXG5cdFx0XHQ/IGNvbXBpbGVFeHByZXNzaW9uKGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihzb3VyY2UuVmFsdWUuJHRhcmdldC5hbm5vdGF0aW9ucy5Db21tb24uUXVpY2tJbmZvLnZhbHVlT2YoKSkpXG5cdFx0XHQ6IHVuZGVmaW5lZDtcblx0fSBlbHNlIGlmIChzb3VyY2UuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb24pIHtcblx0XHRjb25zdCBkYXRhcG9pbnRUYXJnZXQgPSBzb3VyY2UuVGFyZ2V0Py4kdGFyZ2V0IGFzIERhdGFQb2ludDtcblx0XHRyZXR1cm4gZGF0YXBvaW50VGFyZ2V0Py5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uUXVpY2tJbmZvXG5cdFx0XHQ/IGNvbXBpbGVFeHByZXNzaW9uKGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihkYXRhcG9pbnRUYXJnZXQuVmFsdWUuJHRhcmdldC5hbm5vdGF0aW9ucy5Db21tb24uUXVpY2tJbmZvLnZhbHVlT2YoKSkpXG5cdFx0XHQ6IHVuZGVmaW5lZDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um93U3RhdHVzVmlzaWJpbGl0eShjb2xOYW1lOiBzdHJpbmcsIGlzU2VtYW50aWNLZXlJbkZpZWxkR3JvdXA/OiBCb29sZWFuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGZvcm1hdFJlc3VsdChcblx0XHRbXG5cdFx0XHRwYXRoSW5Nb2RlbChgc2VtYW50aWNLZXlIYXNEcmFmdEluZGljYXRvcmAsIFwiaW50ZXJuYWxcIiksXG5cdFx0XHRwYXRoSW5Nb2RlbChgZmlsdGVyZWRNZXNzYWdlc2AsIFwiaW50ZXJuYWxcIiksXG5cdFx0XHRjb2xOYW1lLFxuXHRcdFx0aXNTZW1hbnRpY0tleUluRmllbGRHcm91cFxuXHRcdF0sXG5cdFx0dGFibGVGb3JtYXR0ZXJzLmdldEVycm9yU3RhdHVzVGV4dFZpc2liaWxpdHlGb3JtYXR0ZXJcblx0KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgUHJvcGVydHlJbmZvIGZvciBlYWNoIGlkZW50aWZpZWQgcHJvcGVydHkgY29uc3VtZWQgYnkgYSBMaW5lSXRlbS5cbiAqXG4gKiBAcGFyYW0gY29sdW1uc1RvQmVDcmVhdGVkIElkZW50aWZpZWQgcHJvcGVydGllcy5cbiAqIEBwYXJhbSBleGlzdGluZ0NvbHVtbnMgVGhlIGxpc3Qgb2YgY29sdW1ucyBjcmVhdGVkIGZvciBMaW5lSXRlbXMgYW5kIFByb3BlcnRpZXMgb2YgZW50aXR5VHlwZS5cbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgVGhlIGFycmF5IG9mIGNvbHVtbiBuYW1lcyB3aGljaCBjYW5ub3QgYmUgc29ydGVkLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIGVudGl0eSB0eXBlIGZvciB0aGUgTGluZUl0ZW1cbiAqIEByZXR1cm5zIFRoZSBhcnJheSBvZiBjb2x1bW5zIGNyZWF0ZWQuXG4gKi9cbmNvbnN0IF9jcmVhdGVSZWxhdGVkQ29sdW1ucyA9IGZ1bmN0aW9uIChcblx0Y29sdW1uc1RvQmVDcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eT4sXG5cdGV4aXN0aW5nQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10sXG5cdG5vblNvcnRhYmxlQ29sdW1uczogc3RyaW5nW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGVcbik6IEFubm90YXRpb25UYWJsZUNvbHVtbltdIHtcblx0Y29uc3QgcmVsYXRlZENvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW107XG5cdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0eU5hbWVNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0T2JqZWN0LmtleXMoY29sdW1uc1RvQmVDcmVhdGVkKS5mb3JFYWNoKChuYW1lKSA9PiB7XG5cdFx0Y29uc3QgcHJvcGVydHkgPSBjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0sXG5cdFx0XHRhbm5vdGF0aW9uUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aChuYW1lKSxcblx0XHRcdC8vIENoZWNrIHdoZXRoZXIgdGhlIHJlbGF0ZWQgY29sdW1uIGFscmVhZHkgZXhpc3RzLlxuXHRcdFx0cmVsYXRlZENvbHVtbiA9IGV4aXN0aW5nQ29sdW1ucy5maW5kKChjb2x1bW4pID0+IGNvbHVtbi5uYW1lID09PSBuYW1lKTtcblx0XHRpZiAocmVsYXRlZENvbHVtbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBDYXNlIDE6IEtleSBjb250YWlucyBEYXRhRmllbGQgcHJlZml4IHRvIGVuc3VyZSBhbGwgcHJvcGVydHkgY29sdW1ucyBoYXZlIHRoZSBzYW1lIGtleSBmb3JtYXQuXG5cdFx0XHQvLyBOZXcgY3JlYXRlZCBwcm9wZXJ0eSBjb2x1bW4gaXMgc2V0IHRvIGhpZGRlbi5cblx0XHRcdHJlbGF0ZWRDb2x1bW5zLnB1c2goXG5cdFx0XHRcdGdldENvbHVtbkRlZmluaXRpb25Gcm9tUHJvcGVydHkoXG5cdFx0XHRcdFx0cHJvcGVydHksXG5cdFx0XHRcdFx0YW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0bmFtZSxcblx0XHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRcdFx0XHRhZ2dyZWdhdGlvbkhlbHBlcixcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChyZWxhdGVkQ29sdW1uLmFubm90YXRpb25QYXRoICE9PSBhbm5vdGF0aW9uUGF0aCB8fCByZWxhdGVkQ29sdW1uLnByb3BlcnR5SW5mb3MpIHtcblx0XHRcdC8vIENhc2UgMjogVGhlIGV4aXN0aW5nIGNvbHVtbiBwb2ludHMgdG8gYSBMaW5lSXRlbSAob3IpXG5cdFx0XHQvLyBDYXNlIDM6IFRoaXMgaXMgYSBzZWxmIHJlZmVyZW5jZSBmcm9tIGFuIGV4aXN0aW5nIGNvbHVtblxuXG5cdFx0XHRjb25zdCBuZXdOYW1lID0gYFByb3BlcnR5Ojoke25hbWV9YDtcblxuXHRcdFx0Ly8gQ2hlY2tpbmcgd2hldGhlciB0aGUgcmVsYXRlZCBwcm9wZXJ0eSBjb2x1bW4gaGFzIGFscmVhZHkgYmVlbiBjcmVhdGVkIGluIGEgcHJldmlvdXMgaXRlcmF0aW9uLlxuXHRcdFx0aWYgKCFleGlzdGluZ0NvbHVtbnMuc29tZSgoY29sdW1uKSA9PiBjb2x1bW4ubmFtZSA9PT0gbmV3TmFtZSkpIHtcblx0XHRcdFx0Ly8gQ3JlYXRlIGEgbmV3IHByb3BlcnR5IGNvbHVtbiB3aXRoICdQcm9wZXJ0eTo6JyBwcmVmaXgsXG5cdFx0XHRcdC8vIFNldCBpdCB0byBoaWRkZW4gYXMgaXQgaXMgb25seSBjb25zdW1lZCBieSBDb21wbGV4IHByb3BlcnR5IGluZm9zLlxuXHRcdFx0XHRjb25zdCBjb2x1bW4gPSBnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5KFxuXHRcdFx0XHRcdHByb3BlcnR5LFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdG5hbWUsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0bm9uU29ydGFibGVDb2x1bW5zLFxuXHRcdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29sdW1uLmlzUGFydE9mTGluZUl0ZW0gPSByZWxhdGVkQ29sdW1uLmlzUGFydE9mTGluZUl0ZW07XG5cdFx0XHRcdHJlbGF0ZWRDb2x1bW5zLnB1c2goY29sdW1uKTtcblx0XHRcdFx0cmVsYXRlZFByb3BlcnR5TmFtZU1hcFtuYW1lXSA9IG5ld05hbWU7XG5cdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRleGlzdGluZ0NvbHVtbnMuc29tZSgoY29sdW1uKSA9PiBjb2x1bW4ubmFtZSA9PT0gbmV3TmFtZSkgJiZcblx0XHRcdFx0ZXhpc3RpbmdDb2x1bW5zLnNvbWUoKGNvbHVtbikgPT4gY29sdW1uLnByb3BlcnR5SW5mb3M/LmluY2x1ZGVzKG5hbWUpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0eU5hbWVNYXBbbmFtZV0gPSBuZXdOYW1lO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gVGhlIHByb3BlcnR5ICduYW1lJyBoYXMgYmVlbiBwcmVmaXhlZCB3aXRoICdQcm9wZXJ0eTo6JyBmb3IgdW5pcXVlbmVzcy5cblx0Ly8gVXBkYXRlIHRoZSBzYW1lIGluIG90aGVyIHByb3BlcnR5SW5mb3NbXSByZWZlcmVuY2VzIHdoaWNoIHBvaW50IHRvIHRoaXMgcHJvcGVydHkuXG5cdGV4aXN0aW5nQ29sdW1ucy5mb3JFYWNoKChjb2x1bW4pID0+IHtcblx0XHRjb2x1bW4ucHJvcGVydHlJbmZvcyA9IGNvbHVtbi5wcm9wZXJ0eUluZm9zPy5tYXAoKHByb3BlcnR5SW5mbykgPT4gcmVsYXRlZFByb3BlcnR5TmFtZU1hcFtwcm9wZXJ0eUluZm9dID8/IHByb3BlcnR5SW5mbyk7XG5cdFx0Y29sdW1uLmFkZGl0aW9uYWxQcm9wZXJ0eUluZm9zID0gY29sdW1uLmFkZGl0aW9uYWxQcm9wZXJ0eUluZm9zPy5tYXAoXG5cdFx0XHQocHJvcGVydHlJbmZvKSA9PiByZWxhdGVkUHJvcGVydHlOYW1lTWFwW3Byb3BlcnR5SW5mb10gPz8gcHJvcGVydHlJbmZvXG5cdFx0KTtcblx0fSk7XG5cblx0cmV0dXJuIHJlbGF0ZWRDb2x1bW5zO1xufTtcblxuLyoqXG4gKiBHZXR0aW5nIHRoZSBDb2x1bW4gTmFtZVxuICogSWYgaXQgcG9pbnRzIHRvIGEgRGF0YUZpZWxkIHdpdGggb25lIHByb3BlcnR5IG9yIERhdGFQb2ludCB3aXRoIG9uZSBwcm9wZXJ0eSwgaXQgd2lsbCB1c2UgdGhlIHByb3BlcnR5IG5hbWVcbiAqIGhlcmUgdG8gYmUgY29uc2lzdGVudCB3aXRoIHRoZSBleGlzdGluZyBmbGV4IGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIGRhdGFGaWVsZCBEaWZmZXJlbnQgRGF0YUZpZWxkIHR5cGVzIGRlZmluZWQgaW4gdGhlIGFubm90YXRpb25zXG4gKiBAcmV0dXJucyBUaGUgbmFtZSBvZiBhbm5vdGF0aW9uIGNvbHVtbnNcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9nZXRBbm5vdGF0aW9uQ29sdW1uTmFtZSA9IGZ1bmN0aW9uIChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpIHtcblx0Ly8gVGhpcyBpcyBuZWVkZWQgYXMgd2UgaGF2ZSBmbGV4aWJpbGl0eSBjaGFuZ2VzIGFscmVhZHkgdGhhdCB3ZSBoYXZlIHRvIGNoZWNrIGFnYWluc3Rcblx0aWYgKGlzRGF0YUZpZWxkVHlwZXMoZGF0YUZpZWxkKSkge1xuXHRcdHJldHVybiBkYXRhRmllbGQuVmFsdWU/LnBhdGg7XG5cdH0gZWxzZSBpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uICYmIChkYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0IGFzIERhdGFQb2ludCk/LlZhbHVlPy5wYXRoKSB7XG5cdFx0Ly8gVGhpcyBpcyBmb3IgcmVtb3ZpbmcgZHVwbGljYXRlIHByb3BlcnRpZXMuIEZvciBleGFtcGxlLCAnUHJvZ3Jlc3MnIFByb3BlcnR5IGlzIHJlbW92ZWQgaWYgaXQgaXMgYWxyZWFkeSBkZWZpbmVkIGFzIGEgRGF0YVBvaW50XG5cdFx0cmV0dXJuIChkYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0IGFzIERhdGFQb2ludCk/LlZhbHVlLnBhdGg7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKTtcblx0fVxufTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBkYXRhIGZpZWxkIGxhYmVscyBoYXZlIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdGFibGUuXG4gKlxuICogQHBhcmFtIGZpZWxkR3JvdXBOYW1lIFRoZSBgRGF0YUZpZWxkYCBuYW1lIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIGBzaG93RGF0YUZpZWxkc0xhYmVsYCB2YWx1ZSBmcm9tIHRoZSBtYW5pZmVzdFxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX2dldFNob3dEYXRhRmllbGRzTGFiZWwgPSBmdW5jdGlvbiAoZmllbGRHcm91cE5hbWU6IHN0cmluZywgdmlzdWFsaXphdGlvblBhdGg6IHN0cmluZywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IGJvb2xlYW4ge1xuXHRjb25zdCBvQ29sdW1ucyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCk/LmNvbHVtbnM7XG5cdGNvbnN0IGFDb2x1bW5LZXlzID0gb0NvbHVtbnMgJiYgT2JqZWN0LmtleXMob0NvbHVtbnMpO1xuXHRyZXR1cm4gKFxuXHRcdGFDb2x1bW5LZXlzICYmXG5cdFx0ISFhQ29sdW1uS2V5cy5maW5kKGZ1bmN0aW9uIChrZXk6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIGtleSA9PT0gZmllbGRHcm91cE5hbWUgJiYgb0NvbHVtbnNba2V5XS5zaG93RGF0YUZpZWxkc0xhYmVsO1xuXHRcdH0pXG5cdCk7XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgdGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIHByb3BlcnR5IHdpdGggcmVzcGVjdCB0byB0aGUgcm9vdCBlbnRpdHkuXG4gKlxuICogQHBhcmFtIGRhdGFGaWVsZCBUaGUgYERhdGFGaWVsZGAgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHJldHVybnMgVGhlIHJlbGF0aXZlIHBhdGhcbiAqL1xuY29uc3QgX2dldFJlbGF0aXZlUGF0aCA9IGZ1bmN0aW9uIChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBzdHJpbmcge1xuXHRsZXQgcmVsYXRpdmVQYXRoOiBzdHJpbmcgPSBcIlwiO1xuXG5cdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGg6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhBY3Rpb246XG5cdFx0XHRyZWxhdGl2ZVBhdGggPSAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZCk/LlZhbHVlPy5wYXRoO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb246XG5cdFx0XHRyZWxhdGl2ZVBhdGggPSBkYXRhRmllbGQ/LlRhcmdldD8udmFsdWU7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uR3JvdXA6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uR3JvdXA6XG5cdFx0XHRyZWxhdGl2ZVBhdGggPSBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiByZWxhdGl2ZVBhdGg7XG59O1xuXG5jb25zdCBfc2xpY2VBdFNsYXNoID0gZnVuY3Rpb24gKHBhdGg6IHN0cmluZywgaXNMYXN0U2xhc2g6IGJvb2xlYW4sIGlzTGFzdFBhcnQ6IGJvb2xlYW4pIHtcblx0Y29uc3QgaVNsYXNoSW5kZXggPSBpc0xhc3RTbGFzaCA/IHBhdGgubGFzdEluZGV4T2YoXCIvXCIpIDogcGF0aC5pbmRleE9mKFwiL1wiKTtcblxuXHRpZiAoaVNsYXNoSW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIHBhdGg7XG5cdH1cblx0cmV0dXJuIGlzTGFzdFBhcnQgPyBwYXRoLnN1YnN0cmluZyhpU2xhc2hJbmRleCArIDEsIHBhdGgubGVuZ3RoKSA6IHBhdGguc3Vic3RyaW5nKDAsIGlTbGFzaEluZGV4KTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2x1bW4gaXMgc29ydGFibGUuXG4gKlxuICogQHBhcmFtIGRhdGFGaWVsZCBUaGUgZGF0YSBmaWVsZCBiZWluZyBwcm9jZXNzZWRcbiAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggVGhlIHByb3BlcnR5IHBhdGhcbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgQ29sbGVjdGlvbiBvZiBub24tc29ydGFibGUgY29sdW1uIG5hbWVzIGFzIHBlciBhbm5vdGF0aW9uXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb2x1bW4gaXMgc29ydGFibGVcbiAqL1xuY29uc3QgX2lzQ29sdW1uU29ydGFibGUgPSBmdW5jdGlvbiAoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBwcm9wZXJ0eVBhdGg6IHN0cmluZywgbm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gKFxuXHRcdG5vblNvcnRhYmxlQ29sdW1ucy5pbmRleE9mKHByb3BlcnR5UGF0aCkgPT09IC0xICYmIC8vIENvbHVtbiBpcyBub3QgbWFya2VkIGFzIG5vbi1zb3J0YWJsZSB2aWEgYW5ub3RhdGlvblxuXHRcdChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZCB8fFxuXHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsIHx8XG5cdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb24gfHxcblx0XHRcdGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbilcblx0KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIGZpbHRlcmluZyBvbiB0aGUgdGFibGUgaXMgY2FzZSBzZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgUmV0dXJucyAnZmFsc2UnIGlmIEZpbHRlckZ1bmN0aW9ucyBhbm5vdGF0aW9uIHN1cHBvcnRzICd0b2xvd2VyJywgZWxzZSAndHJ1ZSdcbiAqL1xuZXhwb3J0IGNvbnN0IGlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZSA9IGZ1bmN0aW9uIChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogYm9vbGVhbiB7XG5cdGNvbnN0IGZpbHRlckZ1bmN0aW9uczogRmlsdGVyRnVuY3Rpb25zIHwgdW5kZWZpbmVkID0gX2dldEZpbHRlckZ1bmN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KTtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkoZmlsdGVyRnVuY3Rpb25zKSA/IChmaWx0ZXJGdW5jdGlvbnMgYXMgU3RyaW5nW10pLmluZGV4T2YoXCJ0b2xvd2VyXCIpID09PSAtMSA6IHRydWU7XG59O1xuXG5mdW5jdGlvbiBfZ2V0RmlsdGVyRnVuY3Rpb25zKENvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBGaWx0ZXJGdW5jdGlvbnMgfCB1bmRlZmluZWQge1xuXHRpZiAoTW9kZWxIZWxwZXIuaXNTaW5nbGV0b24oQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSkpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdGNvbnN0IGNhcGFiaWxpdGllcyA9IENvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXMgYXMgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzO1xuXHRyZXR1cm4gY2FwYWJpbGl0aWVzPy5GaWx0ZXJGdW5jdGlvbnMgfHwgQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlDb250YWluZXIoKT8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcz8uRmlsdGVyRnVuY3Rpb25zO1xufVxuXG4vKipcbiAqIFJldHVybnMgZGVmYXVsdCBmb3JtYXQgb3B0aW9ucyBmb3IgdGV4dCBmaWVsZHMgaW4gYSB0YWJsZS5cbiAqXG4gKiBAcGFyYW0gZm9ybWF0T3B0aW9uc1xuICogQHJldHVybnMgQ29sbGVjdGlvbiBvZiBmb3JtYXQgb3B0aW9ucyB3aXRoIGRlZmF1bHQgdmFsdWVzXG4gKi9cbmZ1bmN0aW9uIF9nZXREZWZhdWx0Rm9ybWF0T3B0aW9uc0ZvclRhYmxlKGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnNUeXBlIHwgdW5kZWZpbmVkKTogRm9ybWF0T3B0aW9uc1R5cGUgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gZm9ybWF0T3B0aW9ucyA9PT0gdW5kZWZpbmVkXG5cdFx0PyB1bmRlZmluZWRcblx0XHQ6IHtcblx0XHRcdFx0dGV4dExpbmVzRWRpdDogNCxcblx0XHRcdFx0Li4uZm9ybWF0T3B0aW9uc1xuXHRcdCAgfTtcbn1cblxuZnVuY3Rpb24gX2ZpbmRTZW1hbnRpY0tleVZhbHVlcyhzZW1hbnRpY0tleXM6IGFueVtdLCBuYW1lOiBzdHJpbmcpOiBhbnkge1xuXHRjb25zdCBhU2VtYW50aWNLZXlWYWx1ZXM6IHN0cmluZ1tdID0gW107XG5cdGxldCBiU2VtYW50aWNLZXlGb3VuZCA9IGZhbHNlO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHNlbWFudGljS2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdGFTZW1hbnRpY0tleVZhbHVlcy5wdXNoKHNlbWFudGljS2V5c1tpXS52YWx1ZSk7XG5cdFx0aWYgKHNlbWFudGljS2V5c1tpXS52YWx1ZSA9PT0gbmFtZSkge1xuXHRcdFx0YlNlbWFudGljS2V5Rm91bmQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlczogYVNlbWFudGljS2V5VmFsdWVzLFxuXHRcdHNlbWFudGljS2V5Rm91bmQ6IGJTZW1hbnRpY0tleUZvdW5kXG5cdH07XG59XG5cbmZ1bmN0aW9uIF9maW5kUHJvcGVydGllcyhzZW1hbnRpY0tleVZhbHVlczogYW55W10sIGZpZWxkR3JvdXBQcm9wZXJ0aWVzOiBhbnlbXSkge1xuXHRsZXQgc2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cCA9IGZhbHNlO1xuXHRsZXQgc1Byb3BlcnR5UGF0aDtcblx0aWYgKHNlbWFudGljS2V5VmFsdWVzICYmIHNlbWFudGljS2V5VmFsdWVzLmxlbmd0aCA+PSAxICYmIGZpZWxkR3JvdXBQcm9wZXJ0aWVzICYmIGZpZWxkR3JvdXBQcm9wZXJ0aWVzLmxlbmd0aCA+PSAxKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZW1hbnRpY0tleVZhbHVlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKFtzZW1hbnRpY0tleVZhbHVlc1tpXV0uc29tZSgodG1wKSA9PiBmaWVsZEdyb3VwUHJvcGVydGllcy5pbmRleE9mKHRtcCkgPj0gMCkpIHtcblx0XHRcdFx0c2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cCA9IHRydWU7XG5cdFx0XHRcdHNQcm9wZXJ0eVBhdGggPSBzZW1hbnRpY0tleVZhbHVlc1tpXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiB7XG5cdFx0c2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cDogc2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cCxcblx0XHRmaWVsZEdyb3VwUHJvcGVydHlQYXRoOiBzUHJvcGVydHlQYXRoXG5cdH07XG59XG5cbmZ1bmN0aW9uIF9maW5kU2VtYW50aWNLZXlWYWx1ZXNJbkZpZWxkR3JvdXAoZGF0YUZpZWxkR3JvdXA6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBudWxsLCBzZW1hbnRpY0tleVZhbHVlczogW10pOiBhbnkge1xuXHRjb25zdCBhUHJvcGVydGllczogYW55W10gPSBbXTtcblx0bGV0IF9wcm9wZXJ0aWVzRm91bmQ6IHsgc2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cDogYm9vbGVhbjsgZmllbGRHcm91cFByb3BlcnR5UGF0aDogYW55IH0gPSB7XG5cdFx0c2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cDogZmFsc2UsXG5cdFx0ZmllbGRHcm91cFByb3BlcnR5UGF0aDogdW5kZWZpbmVkXG5cdH07XG5cdGlmIChcblx0XHRkYXRhRmllbGRHcm91cCAmJlxuXHRcdGRhdGFGaWVsZEdyb3VwLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uICYmXG5cdFx0ZGF0YUZpZWxkR3JvdXAuVGFyZ2V0Py4kdGFyZ2V0Py4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRmllbGRHcm91cFR5cGVcblx0KSB7XG5cdFx0ZGF0YUZpZWxkR3JvdXAuVGFyZ2V0LiR0YXJnZXQuRGF0YT8uZm9yRWFjaCgoaW5uZXJEYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdGlmIChcblx0XHRcdFx0KGlubmVyRGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQgfHwgaW5uZXJEYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmwpICYmXG5cdFx0XHRcdGlubmVyRGF0YUZpZWxkLlZhbHVlXG5cdFx0XHQpIHtcblx0XHRcdFx0YVByb3BlcnRpZXMucHVzaChpbm5lckRhdGFGaWVsZC5WYWx1ZS5wYXRoKTtcblx0XHRcdH1cblx0XHRcdF9wcm9wZXJ0aWVzRm91bmQgPSBfZmluZFByb3BlcnRpZXMoc2VtYW50aWNLZXlWYWx1ZXMsIGFQcm9wZXJ0aWVzKTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHNlbWFudGljS2V5SGFzUHJvcGVydHlJbkZpZWxkR3JvdXA6IF9wcm9wZXJ0aWVzRm91bmQuc2VtYW50aWNLZXlIYXNQcm9wZXJ0eUluRmllbGRHcm91cCxcblx0XHRwcm9wZXJ0eVBhdGg6IF9wcm9wZXJ0aWVzRm91bmQuZmllbGRHcm91cFByb3BlcnR5UGF0aFxuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgZGVmYXVsdCBmb3JtYXQgb3B0aW9ucyB3aXRoIGRyYWZ0SW5kaWNhdG9yIGZvciBhIGNvbHVtbi5cbiAqXG4gKiBAcGFyYW0gbmFtZVxuICogQHBhcmFtIHNlbWFudGljS2V5c1xuICogQHBhcmFtIGlzRmllbGRHcm91cENvbHVtblxuICogQHBhcmFtIGRhdGFGaWVsZEdyb3VwXG4gKiBAcmV0dXJucyBDb2xsZWN0aW9uIG9mIGZvcm1hdCBvcHRpb25zIHdpdGggZGVmYXVsdCB2YWx1ZXNcbiAqL1xuZnVuY3Rpb24gZ2V0RGVmYXVsdERyYWZ0SW5kaWNhdG9yRm9yQ29sdW1uKFxuXHRuYW1lOiBzdHJpbmcsXG5cdHNlbWFudGljS2V5czogYW55W10sXG5cdGlzRmllbGRHcm91cENvbHVtbjogYm9vbGVhbixcblx0ZGF0YUZpZWxkR3JvdXA6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBudWxsXG4pIHtcblx0aWYgKCFzZW1hbnRpY0tleXMpIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblx0Y29uc3Qgc2VtYW50aWNLZXkgPSBfZmluZFNlbWFudGljS2V5VmFsdWVzKHNlbWFudGljS2V5cywgbmFtZSk7XG5cdGNvbnN0IHNlbWFudGljS2V5SW5GaWVsZEdyb3VwID0gX2ZpbmRTZW1hbnRpY0tleVZhbHVlc0luRmllbGRHcm91cChkYXRhRmllbGRHcm91cCwgc2VtYW50aWNLZXkudmFsdWVzKTtcblx0aWYgKHNlbWFudGljS2V5LnNlbWFudGljS2V5Rm91bmQpIHtcblx0XHRjb25zdCBmb3JtYXRPcHRpb25zT2JqOiBhbnkgPSB7XG5cdFx0XHRoYXNEcmFmdEluZGljYXRvcjogdHJ1ZSxcblx0XHRcdHNlbWFudGlja2V5czogc2VtYW50aWNLZXkudmFsdWVzLFxuXHRcdFx0b2JqZWN0U3RhdHVzVGV4dFZpc2liaWxpdHk6IGNvbXBpbGVFeHByZXNzaW9uKGdldFJvd1N0YXR1c1Zpc2liaWxpdHkobmFtZSwgZmFsc2UpKVxuXHRcdH07XG5cdFx0aWYgKGlzRmllbGRHcm91cENvbHVtbiAmJiBzZW1hbnRpY0tleUluRmllbGRHcm91cC5zZW1hbnRpY0tleUhhc1Byb3BlcnR5SW5GaWVsZEdyb3VwKSB7XG5cdFx0XHRmb3JtYXRPcHRpb25zT2JqW1wib2JqZWN0U3RhdHVzVGV4dFZpc2liaWxpdHlcIl0gPSBjb21waWxlRXhwcmVzc2lvbihnZXRSb3dTdGF0dXNWaXNpYmlsaXR5KG5hbWUsIHRydWUpKTtcblx0XHRcdGZvcm1hdE9wdGlvbnNPYmpbXCJmaWVsZEdyb3VwRHJhZnRJbmRpY2F0b3JQcm9wZXJ0eVBhdGhcIl0gPSBzZW1hbnRpY0tleUluRmllbGRHcm91cC5wcm9wZXJ0eVBhdGg7XG5cdFx0fVxuXHRcdHJldHVybiBmb3JtYXRPcHRpb25zT2JqO1xuXHR9IGVsc2UgaWYgKCFzZW1hbnRpY0tleUluRmllbGRHcm91cC5zZW1hbnRpY0tleUhhc1Byb3BlcnR5SW5GaWVsZEdyb3VwKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9IGVsc2Uge1xuXHRcdC8vIFNlbWFudGljIEtleSBoYXMgYSBwcm9wZXJ0eSBpbiBhIEZpZWxkR3JvdXBcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZmllbGRHcm91cERyYWZ0SW5kaWNhdG9yUHJvcGVydHlQYXRoOiBzZW1hbnRpY0tleUluRmllbGRHcm91cC5wcm9wZXJ0eVBhdGgsXG5cdFx0XHRmaWVsZEdyb3VwTmFtZTogbmFtZSxcblx0XHRcdG9iamVjdFN0YXR1c1RleHRWaXNpYmlsaXR5OiBjb21waWxlRXhwcmVzc2lvbihnZXRSb3dTdGF0dXNWaXNpYmlsaXR5KG5hbWUsIHRydWUpKVxuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gX2dldEltcE51bWJlcihkYXRhRmllbGQ6IERhdGFGaWVsZFR5cGVzKTogbnVtYmVyIHtcblx0Y29uc3QgaW1wb3J0YW5jZSA9IGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5JbXBvcnRhbmNlIGFzIHN0cmluZztcblxuXHRpZiAoaW1wb3J0YW5jZSAmJiBpbXBvcnRhbmNlLmluY2x1ZGVzKFwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiKSkge1xuXHRcdHJldHVybiAzO1xuXHR9XG5cdGlmIChpbXBvcnRhbmNlICYmIGltcG9ydGFuY2UuaW5jbHVkZXMoXCJVSS5JbXBvcnRhbmNlVHlwZS9NZWRpdW1cIikpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXHRpZiAoaW1wb3J0YW5jZSAmJiBpbXBvcnRhbmNlLmluY2x1ZGVzKFwiVUkuSW1wb3J0YW5jZVR5cGUvTG93XCIpKSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblx0cmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIF9nZXREYXRhRmllbGRJbXBvcnRhbmNlKGRhdGFGaWVsZDogRGF0YUZpZWxkVHlwZXMpOiBJbXBvcnRhbmNlIHtcblx0Y29uc3QgaW1wb3J0YW5jZSA9IGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5JbXBvcnRhbmNlIGFzIHN0cmluZztcblx0cmV0dXJuIGltcG9ydGFuY2UgPyAoaW1wb3J0YW5jZS5zcGxpdChcIi9cIilbMV0gYXMgSW1wb3J0YW5jZSkgOiBJbXBvcnRhbmNlLk5vbmU7XG59XG5cbmZ1bmN0aW9uIF9nZXRNYXhJbXBvcnRhbmNlKGZpZWxkczogRGF0YUZpZWxkVHlwZXNbXSk6IEltcG9ydGFuY2Uge1xuXHRpZiAoZmllbGRzICYmIGZpZWxkcy5sZW5ndGggPiAwKSB7XG5cdFx0bGV0IG1heEltcE51bWJlciA9IC0xO1xuXHRcdGxldCBpbXBOdW1iZXIgPSAtMTtcblx0XHRsZXQgRGF0YUZpZWxkV2l0aE1heEltcG9ydGFuY2U7XG5cdFx0Zm9yIChjb25zdCBmaWVsZCBvZiBmaWVsZHMpIHtcblx0XHRcdGltcE51bWJlciA9IF9nZXRJbXBOdW1iZXIoZmllbGQpO1xuXHRcdFx0aWYgKGltcE51bWJlciA+IG1heEltcE51bWJlcikge1xuXHRcdFx0XHRtYXhJbXBOdW1iZXIgPSBpbXBOdW1iZXI7XG5cdFx0XHRcdERhdGFGaWVsZFdpdGhNYXhJbXBvcnRhbmNlID0gZmllbGQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBfZ2V0RGF0YUZpZWxkSW1wb3J0YW5jZShEYXRhRmllbGRXaXRoTWF4SW1wb3J0YW5jZSBhcyBEYXRhRmllbGRUeXBlcyk7XG5cdH1cblx0cmV0dXJuIEltcG9ydGFuY2UuTm9uZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbXBvcnRhbmNlIHZhbHVlIGZvciBhIGNvbHVtbi5cbiAqXG4gKiBAcGFyYW0gZGF0YUZpZWxkXG4gKiBAcGFyYW0gc2VtYW50aWNLZXlzXG4gKiBAcmV0dXJucyBUaGUgaW1wb3J0YW5jZSB2YWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0YW5jZShkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMsIHNlbWFudGljS2V5czogU2VtYW50aWNLZXkpOiBJbXBvcnRhbmNlIHwgdW5kZWZpbmVkIHtcblx0Ly9FdmFsdWF0ZSBkZWZhdWx0IEltcG9ydGFuY2UgaXMgbm90IHNldCBleHBsaWNpdGx5XG5cdGxldCBmaWVsZHNXaXRoSW1wb3J0YW5jZSwgbWFwU2VtYW50aWNLZXlzOiBhbnk7XG5cdC8vQ2hlY2sgaWYgc2VtYW50aWNLZXlzIGFyZSBkZWZpbmVkIGF0IHRoZSBFbnRpdHlTZXQgbGV2ZWxcblx0aWYgKHNlbWFudGljS2V5cyAmJiBzZW1hbnRpY0tleXMubGVuZ3RoID4gMCkge1xuXHRcdG1hcFNlbWFudGljS2V5cyA9IHNlbWFudGljS2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGtleS52YWx1ZTtcblx0XHR9KTtcblx0fVxuXHRpZiAoIWRhdGFGaWVsZCkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0aWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikge1xuXHRcdGNvbnN0IGZpZWxkR3JvdXBEYXRhID0gKGRhdGFGaWVsZCBhcyBhbnkpLlRhcmdldFtcIiR0YXJnZXRcIl1bXCJEYXRhXCJdIGFzIEZpZWxkR3JvdXBUeXBlLFxuXHRcdFx0ZmllbGRHcm91cEhhc1NlbWFudGljS2V5ID1cblx0XHRcdFx0ZmllbGRHcm91cERhdGEgJiZcblx0XHRcdFx0KGZpZWxkR3JvdXBEYXRhIGFzIGFueSkuc29tZShmdW5jdGlvbiAoZmllbGRHcm91cERhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykge1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHQoZmllbGRHcm91cERhdGFGaWVsZCBhcyB1bmtub3duIGFzIERhdGFGaWVsZFR5cGVzKT8uVmFsdWU/LnBhdGggJiZcblx0XHRcdFx0XHRcdGZpZWxkR3JvdXBEYXRhRmllbGQuJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb24gJiZcblx0XHRcdFx0XHRcdG1hcFNlbWFudGljS2V5cyAmJlxuXHRcdFx0XHRcdFx0bWFwU2VtYW50aWNLZXlzLmluY2x1ZGVzKChmaWVsZEdyb3VwRGF0YUZpZWxkIGFzIHVua25vd24gYXMgRGF0YUZpZWxkVHlwZXMpPy5WYWx1ZT8ucGF0aClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KTtcblx0XHQvL0lmIGEgRmllbGRHcm91cCBjb250YWlucyBhIHNlbWFudGljS2V5LCBpbXBvcnRhbmNlIHNldCB0byBIaWdoXG5cdFx0aWYgKGZpZWxkR3JvdXBIYXNTZW1hbnRpY0tleSkge1xuXHRcdFx0cmV0dXJuIEltcG9ydGFuY2UuSGlnaDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9JZiB0aGUgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiBoYXMgYW4gSW1wb3J0YW5jZSB3ZSB0YWtlIGl0XG5cdFx0XHRpZiAoZGF0YUZpZWxkPy5hbm5vdGF0aW9ucz8uVUk/LkltcG9ydGFuY2UpIHtcblx0XHRcdFx0cmV0dXJuIF9nZXREYXRhRmllbGRJbXBvcnRhbmNlKGRhdGFGaWVsZCBhcyB1bmtub3duIGFzIERhdGFGaWVsZFR5cGVzKTtcblx0XHRcdH1cblx0XHRcdC8vIGVsc2UgdGhlIGhpZ2hlc3QgaW1wb3J0YW5jZSAoaWYgYW55KSBpcyByZXR1cm5lZFxuXHRcdFx0ZmllbGRzV2l0aEltcG9ydGFuY2UgPVxuXHRcdFx0XHRmaWVsZEdyb3VwRGF0YSAmJlxuXHRcdFx0XHQoZmllbGRHcm91cERhdGEgYXMgYW55KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW06IERhdGFGaWVsZFR5cGVzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0/LmFubm90YXRpb25zPy5VST8uSW1wb3J0YW5jZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gX2dldE1heEltcG9ydGFuY2UoZmllbGRzV2l0aEltcG9ydGFuY2UgYXMgRGF0YUZpZWxkVHlwZXNbXSk7XG5cdFx0fVxuXHRcdC8vSWYgdGhlIGN1cnJlbnQgZmllbGQgaXMgYSBzZW1hbnRpY0tleSwgaW1wb3J0YW5jZSBzZXQgdG8gSGlnaFxuXHR9XG5cdHJldHVybiAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZFR5cGVzKS5WYWx1ZSAmJlxuXHRcdChkYXRhRmllbGQgYXMgRGF0YUZpZWxkVHlwZXMpPy5WYWx1ZT8ucGF0aCAmJlxuXHRcdG1hcFNlbWFudGljS2V5cyAmJlxuXHRcdG1hcFNlbWFudGljS2V5cy5pbmNsdWRlcygoZGF0YUZpZWxkIGFzIERhdGFGaWVsZFR5cGVzKS5WYWx1ZS5wYXRoKVxuXHRcdD8gSW1wb3J0YW5jZS5IaWdoXG5cdFx0OiBfZ2V0RGF0YUZpZWxkSW1wb3J0YW5jZShkYXRhRmllbGQgYXMgdW5rbm93biBhcyBEYXRhRmllbGRUeXBlcyk7XG59XG5cbi8qKlxuICogUmV0dXJucyBsaW5lIGl0ZW1zIGZyb20gbWV0YWRhdGEgYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvbiBDb2xsZWN0aW9uIG9mIGRhdGEgZmllbGRzIHdpdGggdGhlaXIgYW5ub3RhdGlvbnNcbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aCBUaGUgdmlzdWFsaXphdGlvbiBwYXRoXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBjb2x1bW5zIGZyb20gdGhlIGFubm90YXRpb25zXG4gKi9cbmNvbnN0IGdldENvbHVtbnNGcm9tQW5ub3RhdGlvbnMgPSBmdW5jdGlvbiAoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEFubm90YXRpb25UYWJsZUNvbHVtbltdIHtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKSxcblx0XHRhbm5vdGF0aW9uQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10gPSBbXSxcblx0XHRjb2x1bW5zVG9CZUNyZWF0ZWQ6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5PiA9IHt9LFxuXHRcdG5vblNvcnRhYmxlQ29sdW1uczogc3RyaW5nW10gPSBnZXROb25Tb3J0YWJsZVByb3BlcnRpZXNSZXN0cmljdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSksXG5cdFx0dGFibGVNYW5pZmVzdFNldHRpbmdzOiBUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCksXG5cdFx0dGFibGVUeXBlOiBUYWJsZVR5cGUgPSB0YWJsZU1hbmlmZXN0U2V0dGluZ3M/LnRhYmxlU2V0dGluZ3M/LnR5cGUgfHwgXCJSZXNwb25zaXZlVGFibGVcIjtcblx0Y29uc3Qgc2VtYW50aWNLZXlzOiBTZW1hbnRpY0tleSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXCJDb21tb25cIiwgQ29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljS2V5LCBbXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKClcblx0XSlbMF07XG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRsaW5lSXRlbUFubm90YXRpb24uZm9yRWFjaCgobGluZUl0ZW0pID0+IHtcblx0XHRcdGlmICghX2lzVmFsaWRDb2x1bW4obGluZUl0ZW0pKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGggPVxuXHRcdFx0XHRpc0RhdGFGaWVsZFR5cGVzKGxpbmVJdGVtKSAmJiBsaW5lSXRlbS5WYWx1ZT8uJHRhcmdldD8uZnVsbHlRdWFsaWZpZWROYW1lXG5cdFx0XHRcdFx0PyBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dCwgbGluZUl0ZW0pXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRjb25zdCByZWxhdGl2ZVBhdGggPSBfZ2V0UmVsYXRpdmVQYXRoKGxpbmVJdGVtKTtcblx0XHRcdGxldCByZWxhdGVkUHJvcGVydHlOYW1lczogc3RyaW5nW107XG5cdFx0XHQvLyBEZXRlcm1pbmUgcHJvcGVydGllcyB3aGljaCBhcmUgY29uc3VtZWQgYnkgdGhpcyBMaW5lSXRlbS5cblx0XHRcdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mbzogQ29tcGxleFByb3BlcnR5SW5mbyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KGxpbmVJdGVtLCBjb252ZXJ0ZXJDb250ZXh0LCB0YWJsZVR5cGUpO1xuXHRcdFx0Y29uc3QgcmVsYXRlZFByb3BlcnRpZXM6IGFueSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRsaW5lSXRlbS4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiAmJlxuXHRcdFx0XHRsaW5lSXRlbS5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5GaWVsZEdyb3VwVHlwZVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocmVsYXRlZFByb3BlcnRpZXNJbmZvLnByb3BlcnRpZXMpLmZpbHRlcigoa2V5KSA9PiB7XG5cdFx0XHRcdFx0bGV0IGlzU3RhdGljYWxseUhpZGRlbjtcblx0XHRcdFx0XHRpZiAocmVsYXRlZFByb3BlcnRpZXNba2V5XS5hbm5vdGF0aW9ucz8uVUkpIHtcblx0XHRcdFx0XHRcdGlzU3RhdGljYWxseUhpZGRlbiA9IGlzUmVmZXJlbmNlUHJvcGVydHlTdGF0aWNhbGx5SGlkZGVuKHJlbGF0ZWRQcm9wZXJ0aWVzW2tleV0uYW5ub3RhdGlvbnM/LlVJPy5EYXRhRmllbGREZWZhdWx0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aXNTdGF0aWNhbGx5SGlkZGVuID0gaXNSZWZlcmVuY2VQcm9wZXJ0eVN0YXRpY2FsbHlIaWRkZW4ocmVsYXRlZFByb3BlcnRpZXNba2V5XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiAhaXNTdGF0aWNhbGx5SGlkZGVuO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocmVsYXRlZFByb3BlcnRpZXNJbmZvLnByb3BlcnRpZXMpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgYWRkaXRpb25hbFByb3BlcnR5TmFtZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMocmVsYXRlZFByb3BlcnRpZXNJbmZvLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKTtcblx0XHRcdGNvbnN0IGdyb3VwUGF0aDogc3RyaW5nID0gX3NsaWNlQXRTbGFzaChyZWxhdGl2ZVBhdGgsIHRydWUsIGZhbHNlKTtcblx0XHRcdGNvbnN0IGlzR3JvdXA6IGJvb2xlYW4gPSBncm91cFBhdGggIT0gcmVsYXRpdmVQYXRoO1xuXHRcdFx0Y29uc3Qgc0xhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBnZXRMYWJlbChsaW5lSXRlbSwgaXNHcm91cCk7XG5cdFx0XHRjb25zdCBuYW1lID0gX2dldEFubm90YXRpb25Db2x1bW5OYW1lKGxpbmVJdGVtKTtcblx0XHRcdGNvbnN0IGlzRmllbGRHcm91cENvbHVtbjogYm9vbGVhbiA9IGdyb3VwUGF0aC5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIikgPiAtMTtcblx0XHRcdGNvbnN0IHNob3dEYXRhRmllbGRzTGFiZWw6IGJvb2xlYW4gPSBpc0ZpZWxkR3JvdXBDb2x1bW5cblx0XHRcdFx0PyBfZ2V0U2hvd0RhdGFGaWVsZHNMYWJlbChuYW1lLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dClcblx0XHRcdFx0OiBmYWxzZTtcblx0XHRcdGNvbnN0IGRhdGFUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBnZXREYXRhRmllbGREYXRhVHlwZShsaW5lSXRlbSk7XG5cdFx0XHRjb25zdCBzRGF0ZUlucHV0Rm9ybWF0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBkYXRhVHlwZSA9PT0gXCJFZG0uRGF0ZVwiID8gXCJZWVlZLU1NLUREXCIgOiB1bmRlZmluZWQ7XG5cdFx0XHRjb25zdCBmb3JtYXRPcHRpb25zID0gX2dldERlZmF1bHRGb3JtYXRPcHRpb25zRm9yVGFibGUoXG5cdFx0XHRcdGdldERlZmF1bHREcmFmdEluZGljYXRvckZvckNvbHVtbihuYW1lLCBzZW1hbnRpY0tleXMsIGlzRmllbGRHcm91cENvbHVtbiwgbGluZUl0ZW0pXG5cdFx0XHQpO1xuXHRcdFx0bGV0IGZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9uczogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGxpbmVJdGVtLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uICYmXG5cdFx0XHRcdGxpbmVJdGVtLlRhcmdldD8uJHRhcmdldD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkZpZWxkR3JvdXBUeXBlXG5cdFx0XHQpIHtcblx0XHRcdFx0ZmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zID0gX2dldEZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucyhsaW5lSXRlbSwgZm9ybWF0T3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBleHBvcnRTZXR0aW5nczogYW55ID0ge1xuXHRcdFx0XHR0ZW1wbGF0ZTogcmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFNldHRpbmdzVGVtcGxhdGUsXG5cdFx0XHRcdHdyYXA6IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRTZXR0aW5nc1dyYXBwaW5nLFxuXHRcdFx0XHR0eXBlOiBkYXRhVHlwZSA/IF9nZXRFeHBvcnREYXRhVHlwZShkYXRhVHlwZSwgcmVsYXRlZFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMSkgOiB1bmRlZmluZWQsXG5cdFx0XHRcdGlucHV0Rm9ybWF0OiBzRGF0ZUlucHV0Rm9ybWF0LFxuXHRcdFx0XHRkZWxpbWl0ZXI6IGRhdGFUeXBlID09PSBcIkVkbS5JbnQ2NFwiXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAocmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFVuaXROYW1lKSB7XG5cdFx0XHRcdGV4cG9ydFNldHRpbmdzLnVuaXRQcm9wZXJ0eSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRVbml0TmFtZTtcblx0XHRcdFx0ZXhwb3J0U2V0dGluZ3MudHlwZSA9IFwiQ3VycmVuY3lcIjsgLy8gRm9yY2UgdG8gYSBjdXJyZW5jeSBiZWNhdXNlIHRoZXJlJ3MgYSB1bml0UHJvcGVydHkgKG90aGVyd2lzZSB0aGUgdmFsdWUgaXNuJ3QgcHJvcGVybHkgZm9ybWF0dGVkIHdoZW4gZXhwb3J0ZWQpXG5cdFx0XHR9IGVsc2UgaWYgKHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRVbml0U3RyaW5nKSB7XG5cdFx0XHRcdGV4cG9ydFNldHRpbmdzLnVuaXQgPSByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VW5pdFN0cmluZztcblx0XHRcdH1cblx0XHRcdGlmIChyZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VGltZXpvbmVOYW1lKSB7XG5cdFx0XHRcdGV4cG9ydFNldHRpbmdzLnRpbWV6b25lUHJvcGVydHkgPSByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VGltZXpvbmVOYW1lO1xuXHRcdFx0fSBlbHNlIGlmIChyZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VGltZXpvbmVTdHJpbmcpIHtcblx0XHRcdFx0ZXhwb3J0U2V0dGluZ3MudGltZXpvbmUgPSByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0VGltZXpvbmVTdHJpbmc7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVR5cGVDb25maWcgPSBkYXRhVHlwZSAmJiBnZXRUeXBlQ29uZmlnKGxpbmVJdGVtLCBkYXRhVHlwZSk7XG5cdFx0XHRjb25zdCBvVHlwZUNvbmZpZyA9IHByb3BlcnR5VHlwZUNvbmZpZ1xuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogZGF0YVR5cGUsXG5cdFx0XHRcdFx0XHRvRm9ybWF0T3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHQuLi5mb3JtYXRPcHRpb25zLFxuXHRcdFx0XHRcdFx0XHQuLi5wcm9wZXJ0eVR5cGVDb25maWcuZm9ybWF0T3B0aW9uc1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG9Db25zdHJhaW50czogcHJvcGVydHlUeXBlQ29uZmlnLmNvbnN0cmFpbnRzXG5cdFx0XHRcdCAgfVxuXHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IHZpc3VhbFNldHRpbmdzOiBWaXN1YWxTZXR0aW5ncyA9IHt9O1xuXHRcdFx0aWYgKCFkYXRhVHlwZSB8fCAhb1R5cGVDb25maWcpIHtcblx0XHRcdFx0Ly8gZm9yIGNoYXJ0c1xuXHRcdFx0XHR2aXN1YWxTZXR0aW5ncy53aWR0aENhbGN1bGF0aW9uID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb0NvbHVtbjogYW55ID0ge1xuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQobGluZUl0ZW0pLFxuXHRcdFx0XHR0eXBlOiBDb2x1bW5UeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdGxhYmVsOiBzTGFiZWwsXG5cdFx0XHRcdGdyb3VwTGFiZWw6IGlzR3JvdXAgPyBnZXRMYWJlbChsaW5lSXRlbSkgOiBudWxsLFxuXHRcdFx0XHRncm91cDogaXNHcm91cCA/IGdyb3VwUGF0aCA6IG51bGwsXG5cdFx0XHRcdEZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9uczogZmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGxpbmVJdGVtLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdHNlbWFudGljT2JqZWN0UGF0aDogc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0YXZhaWxhYmlsaXR5OiBpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbihsaW5lSXRlbSkgPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdCxcblx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0c2hvd0RhdGFGaWVsZHNMYWJlbDogc2hvd0RhdGFGaWVsZHNMYWJlbCxcblx0XHRcdFx0cmVsYXRpdmVQYXRoOiByZWxhdGl2ZVBhdGgsXG5cdFx0XHRcdHNvcnRhYmxlOiBfaXNDb2x1bW5Tb3J0YWJsZShsaW5lSXRlbSwgcmVsYXRpdmVQYXRoLCBub25Tb3J0YWJsZUNvbHVtbnMpLFxuXHRcdFx0XHRwcm9wZXJ0eUluZm9zOiByZWxhdGVkUHJvcGVydHlOYW1lcy5sZW5ndGggPyByZWxhdGVkUHJvcGVydHlOYW1lcyA6IHVuZGVmaW5lZCxcblx0XHRcdFx0YWRkaXRpb25hbFByb3BlcnR5SW5mb3M6IGFkZGl0aW9uYWxQcm9wZXJ0eU5hbWVzLmxlbmd0aCA+IDAgPyBhZGRpdGlvbmFsUHJvcGVydHlOYW1lcyA6IHVuZGVmaW5lZCxcblx0XHRcdFx0ZXhwb3J0U2V0dGluZ3M6IGV4cG9ydFNldHRpbmdzLFxuXHRcdFx0XHR3aWR0aDogbGluZUl0ZW0uYW5ub3RhdGlvbnM/LkhUTUw1Py5Dc3NEZWZhdWx0cz8ud2lkdGggfHwgdW5kZWZpbmVkLFxuXHRcdFx0XHRpbXBvcnRhbmNlOiBnZXRJbXBvcnRhbmNlKGxpbmVJdGVtIGFzIERhdGFGaWVsZFR5cGVzLCBzZW1hbnRpY0tleXMpLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZSxcblx0XHRcdFx0Zm9ybWF0T3B0aW9uczogZm9ybWF0T3B0aW9ucyxcblx0XHRcdFx0Y2FzZVNlbnNpdGl2ZTogaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlKGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0XHR0eXBlQ29uZmlnOiBvVHlwZUNvbmZpZyxcblx0XHRcdFx0dmlzdWFsU2V0dGluZ3M6IHZpc3VhbFNldHRpbmdzLFxuXHRcdFx0XHR0aW1lem9uZVRleHQ6IGV4cG9ydFNldHRpbmdzLnRpbWV6b25lLFxuXHRcdFx0XHRpc1BhcnRPZkxpbmVJdGVtOiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3Qgc1Rvb2x0aXAgPSBfZ2V0VG9vbHRpcChsaW5lSXRlbSk7XG5cdFx0XHRpZiAoc1Rvb2x0aXApIHtcblx0XHRcdFx0b0NvbHVtbi50b29sdGlwID0gc1Rvb2x0aXA7XG5cdFx0XHR9XG5cblx0XHRcdGFubm90YXRpb25Db2x1bW5zLnB1c2gob0NvbHVtbik7XG5cblx0XHRcdC8vIENvbGxlY3QgaW5mb3JtYXRpb24gb2YgcmVsYXRlZCBjb2x1bW5zIHRvIGJlIGNyZWF0ZWQuXG5cdFx0XHRyZWxhdGVkUHJvcGVydHlOYW1lcy5mb3JFYWNoKChyZWxhdGVkUHJvcGVydHlOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbHVtbnNUb0JlQ3JlYXRlZFtyZWxhdGVkUHJvcGVydHlOYW1lXSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzW3JlbGF0ZWRQcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIENyZWF0ZSBjb2x1bW5zIGZvciBhZGRpdGlvbmFsIHByb3BlcnRpZXMgaWRlbnRpZmllZCBmb3IgQUxQIHVzZSBjYXNlLlxuXHRcdFx0YWRkaXRpb25hbFByb3BlcnR5TmFtZXMuZm9yRWFjaCgoYWRkaXRpb25hbFByb3BlcnR5TmFtZSkgPT4ge1xuXHRcdFx0XHQvLyBJbnRlbnRpb25hbCBvdmVyd3JpdGUgYXMgd2UgcmVxdWlyZSBvbmx5IG9uZSBuZXcgUHJvcGVydHlJbmZvIGZvciBhIHJlbGF0ZWQgUHJvcGVydHkuXG5cdFx0XHRcdGNvbHVtbnNUb0JlQ3JlYXRlZFthZGRpdGlvbmFsUHJvcGVydHlOYW1lXSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5hZGRpdGlvbmFsUHJvcGVydGllc1thZGRpdGlvbmFsUHJvcGVydHlOYW1lXTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gR2V0IGNvbHVtbnMgZnJvbSB0aGUgUHJvcGVydGllcyBvZiBFbnRpdHlUeXBlXG5cdHJldHVybiBnZXRDb2x1bW5zRnJvbUVudGl0eVR5cGUoY29sdW1uc1RvQmVDcmVhdGVkLCBlbnRpdHlUeXBlLCBhbm5vdGF0aW9uQ29sdW1ucywgbm9uU29ydGFibGVDb2x1bW5zLCBjb252ZXJ0ZXJDb250ZXh0LCB0YWJsZVR5cGUpO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcyBmcm9tIHRoZSBtYW5pZmVzdCBhbmQgY2hlY2tzIGFnYWluc3QgZXhpc3RpbmcgcHJvcGVydGllcyBhbHJlYWR5IGFkZGVkIGJ5IGFubm90YXRpb25zLlxuICogSWYgYSBub3QgeWV0IHN0b3JlZCBwcm9wZXJ0eSBpcyBmb3VuZCBpdCBhZGRzIGl0IGZvciBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgb25seSB0byB0aGUgYW5ub3RhdGlvbkNvbHVtbnMuXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXNcbiAqIEBwYXJhbSBhbm5vdGF0aW9uQ29sdW1uc1xuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBlbnRpdHlUeXBlXG4gKiBAcmV0dXJucyBUaGUgY29sdW1ucyBmcm9tIHRoZSBhbm5vdGF0aW9uc1xuICovXG5jb25zdCBfZ2V0UHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIChcblx0cHJvcGVydGllczogc3RyaW5nW10gfCB1bmRlZmluZWQsXG5cdGFubm90YXRpb25Db2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZVxuKTogc3RyaW5nW10gfCB1bmRlZmluZWQge1xuXHRsZXQgbWF0Y2hlZFByb3BlcnRpZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXHRpZiAocHJvcGVydGllcykge1xuXHRcdG1hdGNoZWRQcm9wZXJ0aWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5UGF0aCkge1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGFubm90YXRpb25Db2x1bW5zLmZpbmQoZnVuY3Rpb24gKGFubm90YXRpb25Db2x1bW4pIHtcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25Db2x1bW4ucmVsYXRpdmVQYXRoID09PSBwcm9wZXJ0eVBhdGggJiYgYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQ7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChhbm5vdGF0aW9uQ29sdW1uKSB7XG5cdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uQ29sdW1uLm5hbWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZWxhdGVkQ29sdW1ucyA9IF9jcmVhdGVSZWxhdGVkQ29sdW1ucyhcblx0XHRcdFx0XHR7IFtwcm9wZXJ0eVBhdGhdOiBlbnRpdHlUeXBlLnJlc29sdmVQYXRoKHByb3BlcnR5UGF0aCkgfSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uQ29sdW1ucyxcblx0XHRcdFx0XHRbXSxcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdGVudGl0eVR5cGVcblx0XHRcdFx0KTtcblx0XHRcdFx0YW5ub3RhdGlvbkNvbHVtbnMucHVzaChyZWxhdGVkQ29sdW1uc1swXSk7XG5cdFx0XHRcdHJldHVybiByZWxhdGVkQ29sdW1uc1swXS5uYW1lO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIG1hdGNoZWRQcm9wZXJ0aWVzO1xufTtcblxuY29uc3QgX2FwcGVuZEN1c3RvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHByb3BlcnRpZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcblx0cmV0dXJuIHByb3BlcnRpZXNcblx0XHQubWFwKChwcm9wZXJ0eSkgPT4ge1xuXHRcdFx0cmV0dXJuIGB7JHtwcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHkpfX1gO1xuXHRcdH0pXG5cdFx0LmpvaW4oYCR7XCJcXG5cIn1gKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0YWJsZSBjb2x1bW4gZGVmaW5pdGlvbnMgZnJvbSBtYW5pZmVzdC5cbiAqXG4gKiBUaGVzZSBtYXkgYmUgY3VzdG9tIGNvbHVtbnMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QsIHNsb3QgY29sdW1ucyBjb21pbmcgdGhyb3VnaFxuICogYSBidWlsZGluZyBibG9jaywgb3IgYW5ub3RhdGlvbiBjb2x1bW5zIHRvIG92ZXJ3cml0ZSBhbm5vdGF0aW9uLWJhc2VkIGNvbHVtbnMuXG4gKlxuICogQHBhcmFtIGNvbHVtbnNcbiAqIEBwYXJhbSBhbm5vdGF0aW9uQ29sdW1uc1xuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBlbnRpdHlUeXBlXG4gKiBAcGFyYW0gbmF2aWdhdGlvblNldHRpbmdzXG4gKiBAcmV0dXJucyBUaGUgY29sdW1ucyBmcm9tIHRoZSBtYW5pZmVzdFxuICovXG5jb25zdCBnZXRDb2x1bW5zRnJvbU1hbmlmZXN0ID0gZnVuY3Rpb24gKFxuXHRjb2x1bW5zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21EZWZpbmVkVGFibGVDb2x1bW4gfCBDdXN0b21EZWZpbmVkVGFibGVDb2x1bW5Gb3JPdmVycmlkZT4sXG5cdGFubm90YXRpb25Db2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0bmF2aWdhdGlvblNldHRpbmdzPzogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxuKTogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RDb2x1bW4+IHtcblx0Y29uc3QgaW50ZXJuYWxDb2x1bW5zOiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdENvbHVtbj4gPSB7fTtcblxuXHRmdW5jdGlvbiBpc0Fubm90YXRpb25Db2x1bW4oXG5cdFx0Y29sdW1uOiBDdXN0b21EZWZpbmVkVGFibGVDb2x1bW4gfCBDdXN0b21EZWZpbmVkVGFibGVDb2x1bW5Gb3JPdmVycmlkZSxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBjb2x1bW4gaXMgQ3VzdG9tRGVmaW5lZFRhYmxlQ29sdW1uRm9yT3ZlcnJpZGUge1xuXHRcdHJldHVybiBhbm5vdGF0aW9uQ29sdW1ucy5zb21lKChhbm5vdGF0aW9uQ29sdW1uKSA9PiBhbm5vdGF0aW9uQ29sdW1uLmtleSA9PT0ga2V5KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzU2xvdENvbHVtbihtYW5pZmVzdENvbHVtbjogYW55KTogbWFuaWZlc3RDb2x1bW4gaXMgRnJhZ21lbnREZWZpbmVkU2xvdENvbHVtbiB7XG5cdFx0cmV0dXJuIG1hbmlmZXN0Q29sdW1uLnR5cGUgPT09IENvbHVtblR5cGUuU2xvdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzQ3VzdG9tQ29sdW1uKG1hbmlmZXN0Q29sdW1uOiBhbnkpOiBtYW5pZmVzdENvbHVtbiBpcyBNYW5pZmVzdERlZmluZWRDdXN0b21Db2x1bW4ge1xuXHRcdHJldHVybiBtYW5pZmVzdENvbHVtbi50eXBlID09PSB1bmRlZmluZWQgJiYgISFtYW5pZmVzdENvbHVtbi50ZW1wbGF0ZTtcblx0fVxuXG5cdGZvciAoY29uc3Qga2V5IGluIGNvbHVtbnMpIHtcblx0XHRjb25zdCBtYW5pZmVzdENvbHVtbiA9IGNvbHVtbnNba2V5XTtcblx0XHRLZXlIZWxwZXIudmFsaWRhdGVLZXkoa2V5KTtcblxuXHRcdC8vIEJhc2VUYWJsZUNvbHVtblxuXHRcdGNvbnN0IGJhc2VUYWJsZUNvbHVtbiA9IHtcblx0XHRcdGtleToga2V5LFxuXHRcdFx0d2lkdGg6IG1hbmlmZXN0Q29sdW1uLndpZHRoIHx8IHVuZGVmaW5lZCxcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdGFuY2hvcjogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24/LmFuY2hvcixcblx0XHRcdFx0cGxhY2VtZW50OiBtYW5pZmVzdENvbHVtbi5wb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gUGxhY2VtZW50LkFmdGVyIDogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24ucGxhY2VtZW50XG5cdFx0XHR9LFxuXHRcdFx0Y2FzZVNlbnNpdGl2ZTogaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlKGNvbnZlcnRlckNvbnRleHQpXG5cdFx0fTtcblxuXHRcdGlmIChpc0Fubm90YXRpb25Db2x1bW4obWFuaWZlc3RDb2x1bW4sIGtleSkpIHtcblx0XHRcdGNvbnN0IHByb3BlcnRpZXNUb092ZXJ3cml0ZUFubm90YXRpb25Db2x1bW46IEN1c3RvbUVsZW1lbnQ8QW5ub3RhdGlvblRhYmxlQ29sdW1uRm9yT3ZlcnJpZGU+ID0ge1xuXHRcdFx0XHQuLi5iYXNlVGFibGVDb2x1bW4sXG5cdFx0XHRcdGltcG9ydGFuY2U6IG1hbmlmZXN0Q29sdW1uPy5pbXBvcnRhbmNlLFxuXHRcdFx0XHRob3Jpem9udGFsQWxpZ246IG1hbmlmZXN0Q29sdW1uPy5ob3Jpem9udGFsQWxpZ24sXG5cdFx0XHRcdGF2YWlsYWJpbGl0eTogbWFuaWZlc3RDb2x1bW4/LmF2YWlsYWJpbGl0eSxcblx0XHRcdFx0dHlwZTogQ29sdW1uVHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogaXNBbm5vdGF0aW9uQ29sdW1uKG1hbmlmZXN0Q29sdW1uLCBrZXkpXG5cdFx0XHRcdFx0PyB1bmRlZmluZWRcblx0XHRcdFx0XHQ6IGlzQWN0aW9uTmF2aWdhYmxlKG1hbmlmZXN0Q29sdW1uLCBuYXZpZ2F0aW9uU2V0dGluZ3MsIHRydWUpLFxuXHRcdFx0XHRzZXR0aW5nczogbWFuaWZlc3RDb2x1bW4uc2V0dGluZ3MsXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IF9nZXREZWZhdWx0Rm9ybWF0T3B0aW9uc0ZvclRhYmxlKG1hbmlmZXN0Q29sdW1uLmZvcm1hdE9wdGlvbnMpXG5cdFx0XHR9O1xuXHRcdFx0aW50ZXJuYWxDb2x1bW5zW2tleV0gPSBwcm9wZXJ0aWVzVG9PdmVyd3JpdGVBbm5vdGF0aW9uQ29sdW1uO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eUluZm9zOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCA9IF9nZXRQcm9wZXJ0eU5hbWVzKFxuXHRcdFx0XHRtYW5pZmVzdENvbHVtbi5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRhbm5vdGF0aW9uQ29sdW1ucyxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0ZW50aXR5VHlwZVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJhc2VNYW5pZmVzdENvbHVtbiA9IHtcblx0XHRcdFx0Li4uYmFzZVRhYmxlQ29sdW1uLFxuXHRcdFx0XHRoZWFkZXI6IG1hbmlmZXN0Q29sdW1uLmhlYWRlcixcblx0XHRcdFx0aW1wb3J0YW5jZTogbWFuaWZlc3RDb2x1bW4/LmltcG9ydGFuY2UgfHwgSW1wb3J0YW5jZS5Ob25lLFxuXHRcdFx0XHRob3Jpem9udGFsQWxpZ246IG1hbmlmZXN0Q29sdW1uPy5ob3Jpem9udGFsQWxpZ24gfHwgSG9yaXpvbnRhbEFsaWduLkJlZ2luLFxuXHRcdFx0XHRhdmFpbGFiaWxpdHk6IG1hbmlmZXN0Q29sdW1uPy5hdmFpbGFiaWxpdHkgfHwgQXZhaWxhYmlsaXR5VHlwZS5EZWZhdWx0LFxuXHRcdFx0XHR0ZW1wbGF0ZTogbWFuaWZlc3RDb2x1bW4udGVtcGxhdGUsXG5cdFx0XHRcdHByb3BlcnR5SW5mb3M6IHByb3BlcnR5SW5mb3MsXG5cdFx0XHRcdGV4cG9ydFNldHRpbmdzOiBwcm9wZXJ0eUluZm9zXG5cdFx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlOiBfYXBwZW5kQ3VzdG9tVGVtcGxhdGUocHJvcGVydHlJbmZvcyksXG5cdFx0XHRcdFx0XHRcdHdyYXA6ICEhKHByb3BlcnR5SW5mb3MubGVuZ3RoID4gMSlcblx0XHRcdFx0XHQgIH1cblx0XHRcdFx0XHQ6IG51bGwsXG5cdFx0XHRcdGlkOiBgQ3VzdG9tQ29sdW1uOjoke2tleX1gLFxuXHRcdFx0XHRuYW1lOiBgQ3VzdG9tQ29sdW1uOjoke2tleX1gLFxuXHRcdFx0XHQvL05lZWRlZCBmb3IgTURDOlxuXHRcdFx0XHRmb3JtYXRPcHRpb25zOiB7IHRleHRMaW5lc0VkaXQ6IDQgfSxcblx0XHRcdFx0aXNHcm91cGFibGU6IGZhbHNlLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogZmFsc2UsXG5cdFx0XHRcdHNvcnRhYmxlOiBmYWxzZSxcblx0XHRcdFx0dmlzdWFsU2V0dGluZ3M6IHsgd2lkdGhDYWxjdWxhdGlvbjogbnVsbCB9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoaXNTbG90Q29sdW1uKG1hbmlmZXN0Q29sdW1uKSkge1xuXHRcdFx0XHRjb25zdCBjdXN0b21UYWJsZUNvbHVtbjogQ3VzdG9tRWxlbWVudDxDdXN0b21CYXNlZFRhYmxlQ29sdW1uPiA9IHtcblx0XHRcdFx0XHQuLi5iYXNlTWFuaWZlc3RDb2x1bW4sXG5cdFx0XHRcdFx0dHlwZTogQ29sdW1uVHlwZS5TbG90XG5cdFx0XHRcdH07XG5cdFx0XHRcdGludGVybmFsQ29sdW1uc1trZXldID0gY3VzdG9tVGFibGVDb2x1bW47XG5cdFx0XHR9IGVsc2UgaWYgKGlzQ3VzdG9tQ29sdW1uKG1hbmlmZXN0Q29sdW1uKSkge1xuXHRcdFx0XHRjb25zdCBjdXN0b21UYWJsZUNvbHVtbjogQ3VzdG9tRWxlbWVudDxDdXN0b21CYXNlZFRhYmxlQ29sdW1uPiA9IHtcblx0XHRcdFx0XHQuLi5iYXNlTWFuaWZlc3RDb2x1bW4sXG5cdFx0XHRcdFx0dHlwZTogQ29sdW1uVHlwZS5EZWZhdWx0XG5cdFx0XHRcdH07XG5cdFx0XHRcdGludGVybmFsQ29sdW1uc1trZXldID0gY3VzdG9tVGFibGVDb2x1bW47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlID0gYFRoZSBhbm5vdGF0aW9uIGNvbHVtbiAnJHtrZXl9JyByZWZlcmVuY2VkIGluIHRoZSBtYW5pZmVzdCBpcyBub3QgZm91bmRgO1xuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0XHQuYWRkSXNzdWUoXG5cdFx0XHRcdFx0XHRJc3N1ZUNhdGVnb3J5Lk1hbmlmZXN0LFxuXHRcdFx0XHRcdFx0SXNzdWVTZXZlcml0eS5Mb3csXG5cdFx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdFx0SXNzdWVDYXRlZ29yeVR5cGUsXG5cdFx0XHRcdFx0XHRJc3N1ZUNhdGVnb3J5VHlwZT8uQW5ub3RhdGlvbkNvbHVtbnM/LkludmFsaWRLZXlcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gaW50ZXJuYWxDb2x1bW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFAxM25Nb2RlKFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvblxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdmFyaWFudE1hbmFnZW1lbnQ6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZSA9IG1hbmlmZXN0V3JhcHBlci5nZXRWYXJpYW50TWFuYWdlbWVudCgpO1xuXHRjb25zdCBhUGVyc29uYWxpemF0aW9uOiBzdHJpbmdbXSA9IFtdO1xuXHRjb25zdCBpc0FuYWx5dGljYWxUYWJsZSA9IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLnR5cGUgPT09IFwiQW5hbHl0aWNhbFRhYmxlXCI7XG5cdGNvbnN0IGlzUmVzcG9uc2l2ZVRhYmxlID0gdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24udHlwZSA9PT0gXCJSZXNwb25zaXZlVGFibGVcIjtcblx0aWYgKHRhYmxlTWFuaWZlc3RTZXR0aW5ncz8udGFibGVTZXR0aW5ncz8ucGVyc29uYWxpemF0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHQvLyBQZXJzb25hbGl6YXRpb24gY29uZmlndXJlZCBpbiBtYW5pZmVzdC5cblx0XHRjb25zdCBwZXJzb25hbGl6YXRpb246IGFueSA9IHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzLnBlcnNvbmFsaXphdGlvbjtcblx0XHRpZiAocGVyc29uYWxpemF0aW9uID09PSB0cnVlKSB7XG5cdFx0XHQvLyBUYWJsZSBwZXJzb25hbGl6YXRpb24gZnVsbHkgZW5hYmxlZC5cblx0XHRcdHN3aXRjaCAodGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24udHlwZSkge1xuXHRcdFx0XHRjYXNlIFwiQW5hbHl0aWNhbFRhYmxlXCI6XG5cdFx0XHRcdFx0cmV0dXJuIFwiU29ydCxDb2x1bW4sRmlsdGVyLEdyb3VwLEFnZ3JlZ2F0ZVwiO1xuXHRcdFx0XHRjYXNlIFwiUmVzcG9uc2l2ZVRhYmxlXCI6XG5cdFx0XHRcdFx0cmV0dXJuIFwiU29ydCxDb2x1bW4sRmlsdGVyLEdyb3VwXCI7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0cmV0dXJuIFwiU29ydCxDb2x1bW4sRmlsdGVyXCI7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgcGVyc29uYWxpemF0aW9uID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHQvLyBTcGVjaWZpYyBwZXJzb25hbGl6YXRpb24gb3B0aW9ucyBlbmFibGVkIGluIG1hbmlmZXN0LiBVc2UgdGhlbSBhcyBpcy5cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uc29ydCkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJTb3J0XCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5jb2x1bW4pIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQ29sdW1uXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5maWx0ZXIpIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiRmlsdGVyXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5ncm91cCAmJiAoaXNBbmFseXRpY2FsVGFibGUgfHwgaXNSZXNwb25zaXZlVGFibGUpKSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkdyb3VwXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5hZ2dyZWdhdGUgJiYgaXNBbmFseXRpY2FsVGFibGUpIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQWdncmVnYXRlXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24ubGVuZ3RoID4gMCA/IGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIikgOiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIE5vIHBlcnNvbmFsaXphdGlvbiBjb25maWd1cmVkIGluIG1hbmlmZXN0LlxuXHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlNvcnRcIik7XG5cdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQ29sdW1uXCIpO1xuXHRcdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCkge1xuXHRcdFx0aWYgKHZhcmlhbnRNYW5hZ2VtZW50ID09PSBWYXJpYW50TWFuYWdlbWVudFR5cGUuQ29udHJvbCB8fCBfaXNGaWx0ZXJCYXJIaWRkZW4obWFuaWZlc3RXcmFwcGVyLCBjb252ZXJ0ZXJDb250ZXh0KSkge1xuXHRcdFx0XHQvLyBGZWF0dXJlIHBhcml0eSB3aXRoIFYyLlxuXHRcdFx0XHQvLyBFbmFibGUgdGFibGUgZmlsdGVyaW5nIGJ5IGRlZmF1bHQgb25seSBpbiBjYXNlIG9mIENvbnRyb2wgbGV2ZWwgdmFyaWFudCBtYW5hZ2VtZW50LlxuXHRcdFx0XHQvLyBPciB3aGVuIHRoZSBMUiBmaWx0ZXIgYmFyIGlzIGhpZGRlbiB2aWEgbWFuaWZlc3Qgc2V0dGluZ1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJGaWx0ZXJcIik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkZpbHRlclwiKTtcblx0XHR9XG5cblx0XHRpZiAoaXNBbmFseXRpY2FsVGFibGUpIHtcblx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkdyb3VwXCIpO1xuXHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQWdncmVnYXRlXCIpO1xuXHRcdH1cblx0XHRpZiAoaXNSZXNwb25zaXZlVGFibGUpIHtcblx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkdyb3VwXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gYVBlcnNvbmFsaXphdGlvbi5qb2luKFwiLFwiKTtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBCb29sZWFuIHZhbHVlIHN1Z2dlc3RpbmcgaWYgYSBmaWx0ZXIgYmFyIGlzIGJlaW5nIHVzZWQgb24gdGhlIHBhZ2UuXG4gKlxuICogQ2hhcnQgaGFzIGEgZGVwZW5kZW5jeSB0byBmaWx0ZXIgYmFyIChpc3N1ZSB3aXRoIGxvYWRpbmcgZGF0YSkuIE9uY2UgcmVzb2x2ZWQsIHRoZSBjaGVjayBmb3IgY2hhcnQgc2hvdWxkIGJlIHJlbW92ZWQgaGVyZS5cbiAqIFVudGlsIHRoZW4sIGhpZGluZyBmaWx0ZXIgYmFyIGlzIG5vdyBhbGxvd2VkIGlmIGEgY2hhcnQgaXMgYmVpbmcgdXNlZCBvbiBMUi5cbiAqXG4gKiBAcGFyYW0gbWFuaWZlc3RXcmFwcGVyIE1hbmlmZXN0IHNldHRpbmdzIGdldHRlciBmb3IgdGhlIHBhZ2VcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIEJvb2xlYW4gc3VnZ2VzdGluZyBpZiBhIGZpbHRlciBiYXIgaXMgYmVpbmcgdXNlZCBvbiB0aGUgcGFnZS5cbiAqL1xuZnVuY3Rpb24gX2lzRmlsdGVyQmFySGlkZGVuKG1hbmlmZXN0V3JhcHBlcjogTWFuaWZlc3RXcmFwcGVyLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogYm9vbGVhbiB7XG5cdHJldHVybiAoXG5cdFx0bWFuaWZlc3RXcmFwcGVyLmlzRmlsdGVyQmFySGlkZGVuKCkgJiZcblx0XHQhY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5oYXNNdWx0aXBsZVZpc3VhbGl6YXRpb25zKCkgJiZcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpICE9PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlXG5cdCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIEpTT04gc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNvcnQgY29uZGl0aW9ucyBmb3IgdGhlIHByZXNlbnRhdGlvbiB2YXJpYW50LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiBQcmVzZW50YXRpb24gdmFyaWFudCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gY29sdW1ucyBUYWJsZSBjb2x1bW5zIHByb2Nlc3NlZCBieSB0aGUgY29udmVydGVyXG4gKiBAcmV0dXJucyBTb3J0IGNvbmRpdGlvbnMgZm9yIGEgcHJlc2VudGF0aW9uIHZhcmlhbnQuXG4gKi9cbmZ1bmN0aW9uIGdldFNvcnRDb25kaXRpb25zKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbjogUHJlc2VudGF0aW9uVmFyaWFudFR5cGUgfCB1bmRlZmluZWQsXG5cdGNvbHVtbnM6IFRhYmxlQ29sdW1uW11cbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdC8vIEN1cnJlbnRseSBuYXZpZ2F0aW9uIHByb3BlcnR5IGlzIG5vdCBzdXBwb3J0ZWQgYXMgc29ydGVyXG5cdGNvbnN0IG5vblNvcnRhYmxlUHJvcGVydGllcyA9IGdldE5vblNvcnRhYmxlUHJvcGVydGllc1Jlc3RyaWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpKTtcblx0bGV0IHNvcnRDb25kaXRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGlmIChwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uU29ydE9yZGVyKSB7XG5cdFx0Y29uc3Qgc29ydGVyczogU29ydGVyVHlwZVtdID0gW107XG5cdFx0Y29uc3QgY29uZGl0aW9ucyA9IHtcblx0XHRcdHNvcnRlcnM6IHNvcnRlcnNcblx0XHR9O1xuXHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLlNvcnRPcmRlci5mb3JFYWNoKChjb25kaXRpb24pID0+IHtcblx0XHRcdGNvbnN0IGNvbmRpdGlvblByb3BlcnR5ID0gY29uZGl0aW9uLlByb3BlcnR5O1xuXHRcdFx0aWYgKGNvbmRpdGlvblByb3BlcnR5ICYmIG5vblNvcnRhYmxlUHJvcGVydGllcy5pbmRleE9mKGNvbmRpdGlvblByb3BlcnR5LiR0YXJnZXQ/Lm5hbWUpID09PSAtMSkge1xuXHRcdFx0XHRjb25zdCBpbmZvTmFtZSA9IGNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMoW2NvbmRpdGlvblByb3BlcnR5XSwgY29sdW1ucylbMF07XG5cdFx0XHRcdGlmIChpbmZvTmFtZSkge1xuXHRcdFx0XHRcdGNvbmRpdGlvbnMuc29ydGVycy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IGluZm9OYW1lLFxuXHRcdFx0XHRcdFx0ZGVzY2VuZGluZzogISFjb25kaXRpb24uRGVzY2VuZGluZ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0c29ydENvbmRpdGlvbnMgPSBjb25kaXRpb25zLnNvcnRlcnMubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoY29uZGl0aW9ucykgOiB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIHNvcnRDb25kaXRpb25zO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIHByb3BlcnR5UGF0aCB0byBhbiBhcnJheSBvZiBwcm9wZXJ0eUluZm8gbmFtZXMuXG4gKlxuICogQHBhcmFtIHBhdGhzIHRoZSBhcnJheSB0byBiZSBjb252ZXJ0ZWRcbiAqIEBwYXJhbSBjb2x1bW5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eUluZm9zXG4gKiBAcmV0dXJucyBhbiBhcnJheSBvZiBwcm9wZXJ0eUluZm8gbmFtZXNcbiAqL1xuXG5mdW5jdGlvbiBjb252ZXJ0UHJvcGVydHlQYXRoc1RvSW5mb05hbWVzKHBhdGhzOiBQcm9wZXJ0eVBhdGhbXSwgY29sdW1uczogVGFibGVDb2x1bW5bXSk6IHN0cmluZ1tdIHtcblx0Y29uc3QgaW5mb05hbWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRwYXRocy5mb3JFYWNoKChjdXJyZW50UGF0aCkgPT4ge1xuXHRcdGlmIChjdXJyZW50UGF0aD8uJHRhcmdldD8ubmFtZSkge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlJbmZvID0gY29sdW1ucy5maW5kKChjb2x1bW4pID0+IHtcblx0XHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRcdHJldHVybiAhYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zICYmIGFubm90YXRpb25Db2x1bW4ucmVsYXRpdmVQYXRoID09PSBjdXJyZW50UGF0aD8uJHRhcmdldD8ubmFtZTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKHByb3BlcnR5SW5mbykge1xuXHRcdFx0XHRpbmZvTmFtZXMucHVzaChwcm9wZXJ0eUluZm8ubmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gaW5mb05hbWVzO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBKU09OIHN0cmluZyBjb250YWluaW5nIFByZXNlbnRhdGlvbiBWYXJpYW50IGdyb3VwIGNvbmRpdGlvbnMuXG4gKlxuICogQHBhcmFtIHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIFByZXNlbnRhdGlvbiB2YXJpYW50IGFubm90YXRpb25cbiAqIEBwYXJhbSBjb2x1bW5zIENvbnZlcnRlciBwcm9jZXNzZWQgdGFibGUgY29sdW1uc1xuICogQHBhcmFtIHRhYmxlVHlwZSBUaGUgdGFibGUgdHlwZS5cbiAqIEByZXR1cm5zIEdyb3VwIGNvbmRpdGlvbnMgZm9yIGEgUHJlc2VudGF0aW9uIHZhcmlhbnQuXG4gKi9cbmZ1bmN0aW9uIGdldEdyb3VwQ29uZGl0aW9ucyhcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb246IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlIHwgdW5kZWZpbmVkLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdLFxuXHR0YWJsZVR5cGU6IHN0cmluZ1xuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0bGV0IGdyb3VwQ29uZGl0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRpZiAocHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/Lkdyb3VwQnkpIHtcblx0XHRsZXQgYUdyb3VwQnkgPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbi5Hcm91cEJ5O1xuXHRcdGlmICh0YWJsZVR5cGUgPT09IFwiUmVzcG9uc2l2ZVRhYmxlXCIpIHtcblx0XHRcdGFHcm91cEJ5ID0gYUdyb3VwQnkuc2xpY2UoMCwgMSk7XG5cdFx0fVxuXHRcdGNvbnN0IGFHcm91cExldmVscyA9IGNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMoYUdyb3VwQnksIGNvbHVtbnMpLm1hcCgoaW5mb05hbWUpID0+IHtcblx0XHRcdHJldHVybiB7IG5hbWU6IGluZm9OYW1lIH07XG5cdFx0fSk7XG5cblx0XHRncm91cENvbmRpdGlvbnMgPSBhR3JvdXBMZXZlbHMubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoeyBncm91cExldmVsczogYUdyb3VwTGV2ZWxzIH0pIDogdW5kZWZpbmVkO1xuXHR9XG5cdHJldHVybiBncm91cENvbmRpdGlvbnM7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIEpTT04gc3RyaW5nIGNvbnRhaW5pbmcgUHJlc2VudGF0aW9uIFZhcmlhbnQgYWdncmVnYXRlIGNvbmRpdGlvbnMuXG4gKlxuICogQHBhcmFtIHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIFByZXNlbnRhdGlvbiB2YXJpYW50IGFubm90YXRpb25cbiAqIEBwYXJhbSBjb2x1bW5zIENvbnZlcnRlciBwcm9jZXNzZWQgdGFibGUgY29sdW1uc1xuICogQHJldHVybnMgR3JvdXAgY29uZGl0aW9ucyBmb3IgYSBQcmVzZW50YXRpb24gdmFyaWFudC5cbiAqL1xuZnVuY3Rpb24gZ2V0QWdncmVnYXRlQ29uZGl0aW9ucyhcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb246IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlIHwgdW5kZWZpbmVkLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRsZXQgYWdncmVnYXRlQ29uZGl0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRpZiAocHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/LlRvdGFsKSB7XG5cdFx0Y29uc3QgYVRvdGFscyA9IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLlRvdGFsO1xuXHRcdGNvbnN0IGFnZ3JlZ2F0ZXM6IFJlY29yZDxzdHJpbmcsIG9iamVjdD4gPSB7fTtcblx0XHRjb252ZXJ0UHJvcGVydHlQYXRoc1RvSW5mb05hbWVzKGFUb3RhbHMsIGNvbHVtbnMpLmZvckVhY2goKGluZm9OYW1lKSA9PiB7XG5cdFx0XHRhZ2dyZWdhdGVzW2luZm9OYW1lXSA9IHt9O1xuXHRcdH0pO1xuXG5cdFx0YWdncmVnYXRlQ29uZGl0aW9ucyA9IEpTT04uc3RyaW5naWZ5KGFnZ3JlZ2F0ZXMpO1xuXHR9XG5cblx0cmV0dXJuIGFnZ3JlZ2F0ZUNvbmRpdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbixcblx0Y29sdW1uczogVGFibGVDb2x1bW5bXSxcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/OiBQcmVzZW50YXRpb25WYXJpYW50VHlwZSxcblx0dmlld0NvbmZpZ3VyYXRpb24/OiBWaWV3UGF0aENvbmZpZ3VyYXRpb25cbik6IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24ge1xuXHQvLyBOZWVkIHRvIGdldCB0aGUgdGFyZ2V0XG5cdGNvbnN0IHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCB9ID0gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdGl0bGU6IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldEVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UeXBlTmFtZVBsdXJhbDtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkudGFyZ2V0RW50aXR5U2V0O1xuXHRjb25zdCBwYWdlTWFuaWZlc3RTZXR0aW5nczogTWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0Y29uc3QgaGFzQWJzb2x1dGVQYXRoID0gbmF2aWdhdGlvblByb3BlcnR5UGF0aC5sZW5ndGggPT09IDAsXG5cdFx0cDEzbk1vZGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGdldFAxM25Nb2RlKHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiksXG5cdFx0aWQgPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoID8gZ2V0VGFibGVJRCh2aXN1YWxpemF0aW9uUGF0aCkgOiBnZXRUYWJsZUlEKGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKSwgXCJMaW5lSXRlbVwiKTtcblx0Y29uc3QgdGFyZ2V0Q2FwYWJpbGl0aWVzID0gZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uKGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBuYXZpZ2F0aW9uVGFyZ2V0UGF0aCA9IGdldE5hdmlnYXRpb25UYXJnZXRQYXRoKGNvbnZlcnRlckNvbnRleHQsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpO1xuXHRjb25zdCBuYXZpZ2F0aW9uU2V0dGluZ3MgPSBwYWdlTWFuaWZlc3RTZXR0aW5ncy5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihuYXZpZ2F0aW9uVGFyZ2V0UGF0aCk7XG5cdGNvbnN0IGNyZWF0aW9uQmVoYXZpb3VyID0gX2dldENyZWF0aW9uQmVoYXZpb3VyKFxuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbixcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdG5hdmlnYXRpb25TZXR0aW5ncyxcblx0XHR2aXN1YWxpemF0aW9uUGF0aFxuXHQpO1xuXHRjb25zdCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0ID0gZ2VuZXJhdGVTdGFuZGFyZEFjdGlvbnNDb250ZXh0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0Y3JlYXRpb25CZWhhdmlvdXIubW9kZSBhcyBDcmVhdGlvbk1vZGUsXG5cdFx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdFx0dmlld0NvbmZpZ3VyYXRpb25cblx0KTtcblxuXHRjb25zdCBkZWxldGVCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiA9IGdldERlbGV0ZVZpc2liaWxpdHkoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCk7XG5cdGNvbnN0IGNyZWF0ZUJ1dHRvblZpc2liaWxpdHlFeHByZXNzaW9uID0gZ2V0Q3JlYXRlVmlzaWJpbGl0eShjb252ZXJ0ZXJDb250ZXh0LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0KTtcblx0Y29uc3QgbWFzc0VkaXRCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbiA9IGdldE1hc3NFZGl0VmlzaWJpbGl0eShjb252ZXJ0ZXJDb250ZXh0LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0KTtcblx0Y29uc3QgaXNJbnNlcnRVcGRhdGVUZW1wbGF0ZWQgPSBnZXRJbnNlcnRVcGRhdGVBY3Rpb25zVGVtcGxhdGluZyhcblx0XHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRcdGlzRHJhZnRPclN0aWNreVN1cHBvcnRlZChjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRjb21waWxlRXhwcmVzc2lvbihjcmVhdGVCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvbikgPT09IFwiZmFsc2VcIlxuXHQpO1xuXG5cdGNvbnN0IHNlbGVjdGlvbk1vZGUgPSBnZXRTZWxlY3Rpb25Nb2RlKFxuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHR2aXN1YWxpemF0aW9uUGF0aCxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGhhc0Fic29sdXRlUGF0aCxcblx0XHR0YXJnZXRDYXBhYmlsaXRpZXMsXG5cdFx0ZGVsZXRlQnV0dG9uVmlzaWJpbGl0eUV4cHJlc3Npb24sXG5cdFx0bWFzc0VkaXRCdXR0b25WaXNpYmlsaXR5RXhwcmVzc2lvblxuXHQpO1xuXHRsZXQgdGhyZXNob2xkID0gbmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IDEwIDogMzA7XG5cdGlmIChwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uTWF4SXRlbXMpIHtcblx0XHR0aHJlc2hvbGQgPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbi5NYXhJdGVtcy52YWx1ZU9mKCkgYXMgbnVtYmVyO1xuXHR9XG5cblx0Y29uc3QgdmFyaWFudE1hbmFnZW1lbnQ6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZSA9IHBhZ2VNYW5pZmVzdFNldHRpbmdzLmdldFZhcmlhbnRNYW5hZ2VtZW50KCk7XG5cdGNvbnN0IGlzU2VhcmNoYWJsZSA9IGlzUGF0aFNlYXJjaGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHRjb25zdCBzdGFuZGFyZEFjdGlvbnMgPSB7XG5cdFx0Y3JlYXRlOiBnZXRTdGFuZGFyZEFjdGlvbkNyZWF0ZShjb252ZXJ0ZXJDb250ZXh0LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0KSxcblx0XHRcImRlbGV0ZVwiOiBnZXRTdGFuZGFyZEFjdGlvbkRlbGV0ZShjb252ZXJ0ZXJDb250ZXh0LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0KSxcblx0XHRwYXN0ZTogZ2V0U3RhbmRhcmRBY3Rpb25QYXN0ZShjb252ZXJ0ZXJDb250ZXh0LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0LCBpc0luc2VydFVwZGF0ZVRlbXBsYXRlZCksXG5cdFx0bWFzc0VkaXQ6IGdldFN0YW5kYXJkQWN0aW9uTWFzc0VkaXQoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCksXG5cdFx0Y3JlYXRpb25Sb3c6IGdldENyZWF0aW9uUm93KGNvbnZlcnRlckNvbnRleHQsIHN0YW5kYXJkQWN0aW9uc0NvbnRleHQpXG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpZDogaWQsXG5cdFx0ZW50aXR5TmFtZTogZW50aXR5U2V0ID8gZW50aXR5U2V0Lm5hbWUgOiBcIlwiLFxuXHRcdGNvbGxlY3Rpb246IGdldFRhcmdldE9iamVjdFBhdGgoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpLFxuXHRcdG5hdmlnYXRpb25QYXRoOiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuXHRcdHJvdzogX2dldFJvd0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eShcblx0XHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHRcdHZpc3VhbGl6YXRpb25QYXRoLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5ncyxcblx0XHRcdG5hdmlnYXRpb25UYXJnZXRQYXRoXG5cdFx0KSxcblx0XHRwMTNuTW9kZTogcDEzbk1vZGUsXG5cdFx0c3RhbmRhcmRBY3Rpb25zOiB7XG5cdFx0XHRhY3Rpb25zOiBzdGFuZGFyZEFjdGlvbnMsXG5cdFx0XHRpc0luc2VydFVwZGF0ZVRlbXBsYXRlZDogaXNJbnNlcnRVcGRhdGVUZW1wbGF0ZWQsXG5cdFx0XHR1cGRhdGFibGVQcm9wZXJ0eVBhdGg6IGdldEN1cnJlbnRFbnRpdHlTZXRVcGRhdGFibGVQYXRoKGNvbnZlcnRlckNvbnRleHQpXG5cdFx0fSxcblx0XHRkaXNwbGF5TW9kZTogaXNJbkRpc3BsYXlNb2RlKGNvbnZlcnRlckNvbnRleHQsIHZpZXdDb25maWd1cmF0aW9uKSxcblx0XHRjcmVhdGU6IGNyZWF0aW9uQmVoYXZpb3VyLFxuXHRcdHNlbGVjdGlvbk1vZGU6IHNlbGVjdGlvbk1vZGUsXG5cdFx0YXV0b0JpbmRPbkluaXQ6XG5cdFx0XHRfaXNGaWx0ZXJCYXJIaWRkZW4ocGFnZU1hbmlmZXN0U2V0dGluZ3MsIGNvbnZlcnRlckNvbnRleHQpIHx8XG5cdFx0XHQoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQgJiZcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSAmJlxuXHRcdFx0XHQhKHZpZXdDb25maWd1cmF0aW9uICYmIHBhZ2VNYW5pZmVzdFNldHRpbmdzLmhhc011bHRpcGxlVmlzdWFsaXphdGlvbnModmlld0NvbmZpZ3VyYXRpb24pKSksXG5cdFx0dmFyaWFudE1hbmFnZW1lbnQ6IHZhcmlhbnRNYW5hZ2VtZW50ID09PSBcIkNvbnRyb2xcIiAmJiAhcDEzbk1vZGUgPyBWYXJpYW50TWFuYWdlbWVudFR5cGUuTm9uZSA6IHZhcmlhbnRNYW5hZ2VtZW50LFxuXHRcdHRocmVzaG9sZDogdGhyZXNob2xkLFxuXHRcdHNvcnRDb25kaXRpb25zOiBnZXRTb3J0Q29uZGl0aW9ucyhjb252ZXJ0ZXJDb250ZXh0LCBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiwgY29sdW1ucyksXG5cdFx0dGl0bGU6IHRpdGxlLFxuXHRcdHNlYXJjaGFibGU6IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLnR5cGUgIT09IFwiQW5hbHl0aWNhbFRhYmxlXCIgJiYgIShpc0NvbnN0YW50KGlzU2VhcmNoYWJsZSkgJiYgaXNTZWFyY2hhYmxlLnZhbHVlID09PSBmYWxzZSlcblx0fTtcbn1cblxuZnVuY3Rpb24gX2dldEV4cG9ydERhdGFUeXBlKGRhdGFUeXBlOiBzdHJpbmcsIGlzQ29tcGxleFByb3BlcnR5OiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuXHRsZXQgZXhwb3J0RGF0YVR5cGU6IHN0cmluZyA9IFwiU3RyaW5nXCI7XG5cdGlmIChpc0NvbXBsZXhQcm9wZXJ0eSkge1xuXHRcdGlmIChkYXRhVHlwZSA9PT0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIikge1xuXHRcdFx0ZXhwb3J0RGF0YVR5cGUgPSBcIkRhdGVUaW1lXCI7XG5cdFx0fVxuXHRcdHJldHVybiBleHBvcnREYXRhVHlwZTtcblx0fSBlbHNlIHtcblx0XHRzd2l0Y2ggKGRhdGFUeXBlKSB7XG5cdFx0XHRjYXNlIFwiRWRtLkRlY2ltYWxcIjpcblx0XHRcdGNhc2UgXCJFZG0uSW50MzJcIjpcblx0XHRcdGNhc2UgXCJFZG0uSW50NjRcIjpcblx0XHRcdGNhc2UgXCJFZG0uRG91YmxlXCI6XG5cdFx0XHRjYXNlIFwiRWRtLkJ5dGVcIjpcblx0XHRcdFx0ZXhwb3J0RGF0YVR5cGUgPSBcIk51bWJlclwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJFZG0uRGF0ZU9mVGltZVwiOlxuXHRcdFx0Y2FzZSBcIkVkbS5EYXRlXCI6XG5cdFx0XHRcdGV4cG9ydERhdGFUeXBlID0gXCJEYXRlXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkVkbS5EYXRlVGltZU9mZnNldFwiOlxuXHRcdFx0XHRleHBvcnREYXRhVHlwZSA9IFwiRGF0ZVRpbWVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRWRtLlRpbWVPZkRheVwiOlxuXHRcdFx0XHRleHBvcnREYXRhVHlwZSA9IFwiVGltZVwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJFZG0uQm9vbGVhblwiOlxuXHRcdFx0XHRleHBvcnREYXRhVHlwZSA9IFwiQm9vbGVhblwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGV4cG9ydERhdGFUeXBlID0gXCJTdHJpbmdcIjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGV4cG9ydERhdGFUeXBlO1xufVxuXG4vKipcbiAqIFNwbGl0IHRoZSB2aXN1YWxpemF0aW9uIHBhdGggaW50byB0aGUgbmF2aWdhdGlvbiBwcm9wZXJ0eSBwYXRoIGFuZCBhbm5vdGF0aW9uLlxuICpcbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHJldHVybnMgVGhlIHNwbGl0IHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0UGF0aCh2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nKSB7XG5cdGxldCBbbmF2aWdhdGlvblByb3BlcnR5UGF0aCwgYW5ub3RhdGlvblBhdGhdID0gdmlzdWFsaXphdGlvblBhdGguc3BsaXQoXCJAXCIpO1xuXG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA9PT0gbmF2aWdhdGlvblByb3BlcnR5UGF0aC5sZW5ndGggLSAxKSB7XG5cdFx0Ly8gRHJvcCB0cmFpbGluZyBzbGFzaFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLnN1YnN0cigwLCBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpO1xuXHR9XG5cdHJldHVybiB7IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsIGFubm90YXRpb25QYXRoIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbihcblx0c2VsZWN0aW9uVmFyaWFudFBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQge1xuXHRjb25zdCByZXNvbHZlZFRhcmdldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24oc2VsZWN0aW9uVmFyaWFudFBhdGgpO1xuXHRjb25zdCBzZWxlY3Rpb246IFNlbGVjdGlvblZhcmlhbnRUeXBlID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhcyBTZWxlY3Rpb25WYXJpYW50VHlwZTtcblxuXHRpZiAoc2VsZWN0aW9uKSB7XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lczogc3RyaW5nW10gPSBbXTtcblx0XHRzZWxlY3Rpb24uU2VsZWN0T3B0aW9ucz8uZm9yRWFjaCgoc2VsZWN0T3B0aW9uOiBTZWxlY3RPcHRpb25UeXBlKSA9PiB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWU6IGFueSA9IHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWU7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVBhdGg6IHN0cmluZyA9IHByb3BlcnR5TmFtZS52YWx1ZTtcblx0XHRcdGlmIChwcm9wZXJ0eU5hbWVzLmluZGV4T2YocHJvcGVydHlQYXRoKSA9PT0gLTEpIHtcblx0XHRcdFx0cHJvcGVydHlOYW1lcy5wdXNoKHByb3BlcnR5UGF0aCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRleHQ6IHNlbGVjdGlvbj8uVGV4dD8udG9TdHJpbmcoKSxcblx0XHRcdHByb3BlcnR5TmFtZXM6IHByb3BlcnR5TmFtZXNcblx0XHR9O1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIF9nZXRGdWxsU2NyZWVuQmFzZWRPbkRldmljZShcblx0dGFibGVTZXR0aW5nczogVGFibGVNYW5pZmVzdFNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0aXNJcGhvbmU6IGJvb2xlYW5cbik6IGJvb2xlYW4ge1xuXHQvLyBJZiBlbmFibGVGdWxsU2NyZWVuIGlzIG5vdCBzZXQsIHVzZSBhcyBkZWZhdWx0IHRydWUgb24gcGhvbmUgYW5kIGZhbHNlIG90aGVyd2lzZVxuXHRsZXQgZW5hYmxlRnVsbFNjcmVlbiA9IHRhYmxlU2V0dGluZ3MuZW5hYmxlRnVsbFNjcmVlbiA/PyBpc0lwaG9uZTtcblx0Ly8gTWFrZSBzdXJlIHRoYXQgZW5hYmxlRnVsbFNjcmVlbiBpcyBub3Qgc2V0IG9uIExpc3RSZXBvcnQgZm9yIGRlc2t0b3Agb3IgdGFibGV0XG5cdGlmICghaXNJcGhvbmUgJiYgZW5hYmxlRnVsbFNjcmVlbiAmJiBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCkge1xuXHRcdGVuYWJsZUZ1bGxTY3JlZW4gPSBmYWxzZTtcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldERpYWdub3N0aWNzKCkuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5NYW5pZmVzdCwgSXNzdWVTZXZlcml0eS5Mb3csIElzc3VlVHlwZS5GVUxMU0NSRUVOTU9ERV9OT1RfT05fTElTVFJFUE9SVCk7XG5cdH1cblx0cmV0dXJuIGVuYWJsZUZ1bGxTY3JlZW47XG59XG5cbmZ1bmN0aW9uIF9nZXRNdWx0aVNlbGVjdE1vZGUoXG5cdHRhYmxlU2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdHRhYmxlVHlwZTogVGFibGVUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRsZXQgbXVsdGlTZWxlY3RNb2RlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGlmICh0YWJsZVR5cGUgIT09IFwiUmVzcG9uc2l2ZVRhYmxlXCIpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdHN3aXRjaCAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSkge1xuXHRcdGNhc2UgVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQ6XG5cdFx0Y2FzZSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlOlxuXHRcdFx0bXVsdGlTZWxlY3RNb2RlID0gIXRhYmxlU2V0dGluZ3Muc2VsZWN0QWxsID8gXCJDbGVhckFsbFwiIDogXCJEZWZhdWx0XCI7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlOlxuXHRcdFx0bXVsdGlTZWxlY3RNb2RlID0gdGFibGVTZXR0aW5ncy5zZWxlY3RBbGwgPT09IGZhbHNlID8gXCJDbGVhckFsbFwiIDogXCJEZWZhdWx0XCI7XG5cdFx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS51c2VJY29uVGFiQmFyKCkpIHtcblx0XHRcdFx0bXVsdGlTZWxlY3RNb2RlID0gIXRhYmxlU2V0dGluZ3Muc2VsZWN0QWxsID8gXCJDbGVhckFsbFwiIDogXCJEZWZhdWx0XCI7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHR9XG5cblx0cmV0dXJuIG11bHRpU2VsZWN0TW9kZTtcbn1cblxuZnVuY3Rpb24gX2dldFRhYmxlVHlwZShcblx0dGFibGVTZXR0aW5nczogVGFibGVNYW5pZmVzdFNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0YWdncmVnYXRpb25IZWxwZXI6IEFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBUYWJsZVR5cGUge1xuXHRsZXQgdGFibGVUeXBlID0gdGFibGVTZXR0aW5ncz8udHlwZSB8fCBcIlJlc3BvbnNpdmVUYWJsZVwiO1xuXHQvKiAgTm93LCB3ZSBrZWVwIHRoZSBjb25maWd1cmF0aW9uIGluIHRoZSBtYW5pZmVzdCwgZXZlbiBpZiBpdCBsZWFkcyB0byBlcnJvcnMuXG5cdFx0V2Ugb25seSBjaGFuZ2UgaWYgd2UncmUgbm90IG9uIGRlc2t0b3AgZnJvbSBBbmFseXRpY2FsIHRvIFJlc3BvbnNpdmUuXG5cdCAqL1xuXHRpZiAodGFibGVUeXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiICYmICFjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmlzRGVza3RvcCgpKSB7XG5cdFx0dGFibGVUeXBlID0gXCJSZXNwb25zaXZlVGFibGVcIjtcblx0fVxuXHRyZXR1cm4gdGFibGVUeXBlO1xufVxuXG5mdW5jdGlvbiBfZ2V0R3JpZFRhYmxlTW9kZSh0YWJsZVR5cGU6IFRhYmxlVHlwZSwgdGFibGVTZXR0aW5nczogVGFibGVNYW5pZmVzdFNldHRpbmdzQ29uZmlndXJhdGlvbiwgaXNUZW1wbGF0ZUxpc3RSZXBvcnQ6IGJvb2xlYW4pOiBhbnkge1xuXHRpZiAodGFibGVUeXBlID09PSBcIkdyaWRUYWJsZVwiKSB7XG5cdFx0aWYgKGlzVGVtcGxhdGVMaXN0UmVwb3J0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyb3dDb3VudE1vZGU6IFwiQXV0b1wiLFxuXHRcdFx0XHRyb3dDb3VudDogXCIzXCJcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJvd0NvdW50TW9kZTogdGFibGVTZXR0aW5ncy5yb3dDb3VudE1vZGUgPyB0YWJsZVNldHRpbmdzLnJvd0NvdW50TW9kZSA6IFwiRml4ZWRcIixcblx0XHRcdFx0cm93Q291bnQ6IHRhYmxlU2V0dGluZ3Mucm93Q291bnQgPyB0YWJsZVNldHRpbmdzLnJvd0NvdW50IDogNVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIF9nZXRDb25kZW5zZWRUYWJsZUxheW91dChfdGFibGVUeXBlOiBUYWJsZVR5cGUsIF90YWJsZVNldHRpbmdzOiBUYWJsZU1hbmlmZXN0U2V0dGluZ3NDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XG5cdHJldHVybiBfdGFibGVTZXR0aW5ncy5jb25kZW5zZWRUYWJsZUxheW91dCAhPT0gdW5kZWZpbmVkICYmIF90YWJsZVR5cGUgIT09IFwiUmVzcG9uc2l2ZVRhYmxlXCJcblx0XHQ/IF90YWJsZVNldHRpbmdzLmNvbmRlbnNlZFRhYmxlTGF5b3V0XG5cdFx0OiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2dldFRhYmxlU2VsZWN0aW9uTGltaXQoX3RhYmxlU2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb24pOiBudW1iZXIge1xuXHRyZXR1cm4gX3RhYmxlU2V0dGluZ3Muc2VsZWN0QWxsID09PSB0cnVlIHx8IF90YWJsZVNldHRpbmdzLnNlbGVjdGlvbkxpbWl0ID09PSAwID8gMCA6IF90YWJsZVNldHRpbmdzLnNlbGVjdGlvbkxpbWl0IHx8IDIwMDtcbn1cblxuZnVuY3Rpb24gX2dldFRhYmxlSW5saW5lQ3JlYXRpb25Sb3dDb3VudChfdGFibGVTZXR0aW5nczogVGFibGVNYW5pZmVzdFNldHRpbmdzQ29uZmlndXJhdGlvbik6IG51bWJlciB7XG5cdHJldHVybiBfdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmlubGluZUNyZWF0aW9uUm93Q291bnQgPyBfdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmlubGluZUNyZWF0aW9uUm93Q291bnQgOiAyO1xufVxuXG5mdW5jdGlvbiBfZ2V0RmlsdGVycyhcblx0dGFibGVTZXR0aW5nczogVGFibGVNYW5pZmVzdFNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0cXVpY2tGaWx0ZXJQYXRoczogeyBhbm5vdGF0aW9uUGF0aDogc3RyaW5nIH1bXSxcblx0cXVpY2tTZWxlY3Rpb25WYXJpYW50OiBhbnksXG5cdHBhdGg6IHsgYW5ub3RhdGlvblBhdGg6IHN0cmluZyB9LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBhbnkge1xuXHRpZiAocXVpY2tTZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0cXVpY2tGaWx0ZXJQYXRocy5wdXNoKHsgYW5ub3RhdGlvblBhdGg6IHBhdGguYW5ub3RhdGlvblBhdGggfSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRxdWlja0ZpbHRlcnM6IHtcblx0XHRcdGVuYWJsZWQ6XG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0ID8gXCJ7PSAke3BhZ2VJbnRlcm5hbD5oYXNQZW5kaW5nRmlsdGVyc30gIT09IHRydWV9XCIgOiB0cnVlLFxuXHRcdFx0c2hvd0NvdW50czogdGFibGVTZXR0aW5ncz8ucXVpY2tWYXJpYW50U2VsZWN0aW9uPy5zaG93Q291bnRzLFxuXHRcdFx0cGF0aHM6IHF1aWNrRmlsdGVyUGF0aHNcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIF9nZXRFbmFibGVFeHBvcnQoXG5cdHRhYmxlU2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGVuYWJsZVBhc3RlOiBib29sZWFuXG4pOiBib29sZWFuIHtcblx0cmV0dXJuIHRhYmxlU2V0dGluZ3MuZW5hYmxlRXhwb3J0ICE9PSB1bmRlZmluZWRcblx0XHQ/IHRhYmxlU2V0dGluZ3MuZW5hYmxlRXhwb3J0XG5cdFx0OiBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpICE9PSBcIk9iamVjdFBhZ2VcIiB8fCBlbmFibGVQYXN0ZTtcbn1cblxuZnVuY3Rpb24gX2dldEZpbHRlckNvbmZpZ3VyYXRpb24oXG5cdHRhYmxlU2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IGFueSB7XG5cdGlmICghbGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cdGNvbnN0IHF1aWNrRmlsdGVyUGF0aHM6IHsgYW5ub3RhdGlvblBhdGg6IHN0cmluZyB9W10gPSBbXTtcblx0Y29uc3QgdGFyZ2V0RW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKTtcblx0bGV0IHF1aWNrU2VsZWN0aW9uVmFyaWFudDogYW55O1xuXHRsZXQgZmlsdGVycztcblx0dGFibGVTZXR0aW5ncz8ucXVpY2tWYXJpYW50U2VsZWN0aW9uPy5wYXRocz8uZm9yRWFjaCgocGF0aDogeyBhbm5vdGF0aW9uUGF0aDogc3RyaW5nIH0pID0+IHtcblx0XHRxdWlja1NlbGVjdGlvblZhcmlhbnQgPSB0YXJnZXRFbnRpdHlUeXBlLnJlc29sdmVQYXRoKHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdGZpbHRlcnMgPSBfZ2V0RmlsdGVycyh0YWJsZVNldHRpbmdzLCBxdWlja0ZpbHRlclBhdGhzLCBxdWlja1NlbGVjdGlvblZhcmlhbnQsIHBhdGgsIGNvbnZlcnRlckNvbnRleHQpO1xuXHR9KTtcblxuXHRsZXQgaGlkZVRhYmxlVGl0bGUgPSBmYWxzZTtcblx0aGlkZVRhYmxlVGl0bGUgPSAhIXRhYmxlU2V0dGluZ3MucXVpY2tWYXJpYW50U2VsZWN0aW9uPy5oaWRlVGFibGVUaXRsZTtcblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJzOiBmaWx0ZXJzLFxuXHRcdGhlYWRlclZpc2libGU6ICEocXVpY2tTZWxlY3Rpb25WYXJpYW50ICYmIGhpZGVUYWJsZVRpdGxlKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBfZ2V0Q29sbGVjdGVkTmF2aWdhdGlvblByb3BlcnR5TGFiZWxzKHJlbGF0aXZlUGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KSB7XG5cdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gZW5oYW5jZURhdGFNb2RlbFBhdGgoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIHJlbGF0aXZlUGF0aCkubmF2aWdhdGlvblByb3BlcnRpZXM7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydGllcz8ubGVuZ3RoID4gMCkge1xuXHRcdGNvbnN0IGNvbGxlY3RlZE5hdmlnYXRpb25Qcm9wZXJ0eUxhYmVsczogc3RyaW5nW10gPSBbXTtcblx0XHRuYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKChuYXZQcm9wZXJ0eTogYW55KSA9PiB7XG5cdFx0XHRjb2xsZWN0ZWROYXZpZ2F0aW9uUHJvcGVydHlMYWJlbHMucHVzaChnZXRMYWJlbChuYXZQcm9wZXJ0eSkgfHwgbmF2UHJvcGVydHkubmFtZSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGNvbGxlY3RlZE5hdmlnYXRpb25Qcm9wZXJ0eUxhYmVscztcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGNoZWNrQ29uZGVuc2VkTGF5b3V0ID0gZmFsc2Vcbik6IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24ge1xuXHRjb25zdCBfbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0Y29uc3QgdGFibGVNYW5pZmVzdFNldHRpbmdzOiBUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCk7XG5cdGNvbnN0IHRhYmxlU2V0dGluZ3MgPSAodGFibGVNYW5pZmVzdFNldHRpbmdzICYmIHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzKSB8fCB7fTtcblx0Y29uc3QgY3JlYXRpb25Nb2RlID0gdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/Lm5hbWUgfHwgQ3JlYXRpb25Nb2RlLk5ld1BhZ2U7XG5cdGNvbnN0IGVuYWJsZUF1dG9Db2x1bW5XaWR0aCA9ICFfbWFuaWZlc3RXcmFwcGVyLmlzUGhvbmUoKTtcblx0Y29uc3QgZW5hYmxlUGFzdGUgPVxuXHRcdHRhYmxlU2V0dGluZ3MuZW5hYmxlUGFzdGUgIT09IHVuZGVmaW5lZCA/IHRhYmxlU2V0dGluZ3MuZW5hYmxlUGFzdGUgOiBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBcIk9iamVjdFBhZ2VcIjsgLy8gUGFzdGUgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdCBleGNlcHRlZCBmb3IgT1Bcblx0Y29uc3QgdGVtcGxhdGVUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKTtcblx0Y29uc3QgZGF0YVN0YXRlSW5kaWNhdG9yRmlsdGVyID0gdGVtcGxhdGVUeXBlID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCA/IFwiQVBJLmRhdGFTdGF0ZUluZGljYXRvckZpbHRlclwiIDogdW5kZWZpbmVkO1xuXHRjb25zdCBpc0NvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW50ID0gY2hlY2tDb25kZW5zZWRMYXlvdXQgJiYgX21hbmlmZXN0V3JhcHBlci5pc0NvbmRlbnNlZExheW91dENvbXBsaWFudCgpO1xuXHRjb25zdCBvRmlsdGVyQ29uZmlndXJhdGlvbiA9IF9nZXRGaWx0ZXJDb25maWd1cmF0aW9uKHRhYmxlU2V0dGluZ3MsIGxpbmVJdGVtQW5ub3RhdGlvbiwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbiA9IHRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5jdXN0b21WYWxpZGF0aW9uRnVuY3Rpb247XG5cdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IHRhYmxlVHlwZTogVGFibGVUeXBlID0gX2dldFRhYmxlVHlwZSh0YWJsZVNldHRpbmdzLCBhZ2dyZWdhdGlvbkhlbHBlciwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGdyaWRUYWJsZVJvd01vZGUgPSBfZ2V0R3JpZFRhYmxlTW9kZSh0YWJsZVR5cGUsIHRhYmxlU2V0dGluZ3MsIHRlbXBsYXRlVHlwZSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpO1xuXHRjb25zdCBjb25kZW5zZWRUYWJsZUxheW91dCA9IF9nZXRDb25kZW5zZWRUYWJsZUxheW91dCh0YWJsZVR5cGUsIHRhYmxlU2V0dGluZ3MpO1xuXHRjb25zdCBvQ29uZmlndXJhdGlvbiA9IHtcblx0XHQvLyBJZiBubyBjcmVhdGVBdEVuZCBpcyBzcGVjaWZpZWQgaXQgd2lsbCBiZSBmYWxzZSBmb3IgSW5saW5lIGNyZWF0ZSBhbmQgdHJ1ZSBvdGhlcndpc2Vcblx0XHRjcmVhdGVBdEVuZDpcblx0XHRcdHRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5jcmVhdGVBdEVuZCAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdD8gdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmNyZWF0ZUF0RW5kXG5cdFx0XHRcdDogY3JlYXRpb25Nb2RlICE9PSBDcmVhdGlvbk1vZGUuSW5saW5lLFxuXHRcdGNyZWF0aW9uTW9kZTogY3JlYXRpb25Nb2RlLFxuXHRcdGN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbjogY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uLFxuXHRcdGRhdGFTdGF0ZUluZGljYXRvckZpbHRlcjogZGF0YVN0YXRlSW5kaWNhdG9yRmlsdGVyLFxuXHRcdC8vIGlmIGEgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEgc2hvdWxkIG5vdCBiZSBjb25zaWRlcmVkLCBpLmUuIHNldCB0byBmYWxzZVxuXHRcdGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGE6ICFjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb24gPyAhIXRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5kaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhIDogZmFsc2UsXG5cdFx0ZW5hYmxlQXV0b0NvbHVtbldpZHRoOiBlbmFibGVBdXRvQ29sdW1uV2lkdGgsXG5cdFx0ZW5hYmxlRXhwb3J0OiBfZ2V0RW5hYmxlRXhwb3J0KHRhYmxlU2V0dGluZ3MsIGNvbnZlcnRlckNvbnRleHQsIGVuYWJsZVBhc3RlKSxcblx0XHRlbmFibGVGdWxsU2NyZWVuOiBfZ2V0RnVsbFNjcmVlbkJhc2VkT25EZXZpY2UodGFibGVTZXR0aW5ncywgY29udmVydGVyQ29udGV4dCwgX21hbmlmZXN0V3JhcHBlci5pc1Bob25lKCkpLFxuXHRcdGVuYWJsZU1hc3NFZGl0OiB0YWJsZVNldHRpbmdzPy5lbmFibGVNYXNzRWRpdCxcblx0XHRlbmFibGVQYXN0ZTogZW5hYmxlUGFzdGUsXG5cdFx0aGVhZGVyVmlzaWJsZTogdHJ1ZSxcblx0XHRtdWx0aVNlbGVjdE1vZGU6IF9nZXRNdWx0aVNlbGVjdE1vZGUodGFibGVTZXR0aW5ncywgdGFibGVUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRzZWxlY3Rpb25MaW1pdDogX2dldFRhYmxlU2VsZWN0aW9uTGltaXQodGFibGVTZXR0aW5ncyksXG5cdFx0aW5saW5lQ3JlYXRpb25Sb3dDb3VudDogX2dldFRhYmxlSW5saW5lQ3JlYXRpb25Sb3dDb3VudCh0YWJsZVNldHRpbmdzKSxcblx0XHRzaG93Um93Q291bnQ6ICF0YWJsZVNldHRpbmdzPy5xdWlja1ZhcmlhbnRTZWxlY3Rpb24/LnNob3dDb3VudHMgJiYgIV9tYW5pZmVzdFdyYXBwZXIuZ2V0Vmlld0NvbmZpZ3VyYXRpb24oKT8uc2hvd0NvdW50cyxcblx0XHR0eXBlOiB0YWJsZVR5cGUsXG5cdFx0dXNlQ29uZGVuc2VkVGFibGVMYXlvdXQ6IGNvbmRlbnNlZFRhYmxlTGF5b3V0ICYmIGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQsXG5cdFx0aXNDb21wYWN0VHlwZTogX21hbmlmZXN0V3JhcHBlci5pc0NvbXBhY3RUeXBlKClcblx0fTtcblx0cmV0dXJuIHsgLi4ub0NvbmZpZ3VyYXRpb24sIC4uLmdyaWRUYWJsZVJvd01vZGUsIC4uLm9GaWx0ZXJDb25maWd1cmF0aW9uIH07XG59XG5cbmV4cG9ydCB0eXBlIGNvbmZpZ1R5cGVDb25zdHJhaW50cyA9IHtcblx0c2NhbGU/OiBudW1iZXI7XG5cdHByZWNpc2lvbj86IG51bWJlcjtcblx0bWF4TGVuZ3RoPzogbnVtYmVyO1xuXHRudWxsYWJsZT86IGJvb2xlYW47XG5cdG1pbmltdW0/OiBzdHJpbmc7XG5cdG1heGltdW0/OiBzdHJpbmc7XG5cdGlzRGlnaXRTZXF1ZW5jZT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBjb25maWdUeXBlZm9ybWF0T3B0aW9ucyA9IHtcblx0cGFyc2VBc1N0cmluZz86IGJvb2xlYW47XG5cdGVtcHR5U3RyaW5nPzogc3RyaW5nO1xuXHRwYXJzZUtlZXBzRW1wdHlTdHJpbmc/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgY29uZmlnVHlwZSA9IHtcblx0dHlwZTogc3RyaW5nO1xuXHRjb25zdHJhaW50czogY29uZmlnVHlwZUNvbnN0cmFpbnRzO1xuXHRmb3JtYXRPcHRpb25zOiBjb25maWdUeXBlZm9ybWF0T3B0aW9ucztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlQ29uZmlnKG9Qcm9wZXJ0eTogUHJvcGVydHkgfCBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBkYXRhVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYW55IHtcblx0bGV0IG9UYXJnZXRNYXBwaW5nID0gRURNX1RZUEVfTUFQUElOR1sob1Byb3BlcnR5IGFzIFByb3BlcnR5KT8udHlwZV0gfHwgKGRhdGFUeXBlID8gRURNX1RZUEVfTUFQUElOR1tkYXRhVHlwZV0gOiB1bmRlZmluZWQpO1xuXHRpZiAoIW9UYXJnZXRNYXBwaW5nICYmIChvUHJvcGVydHkgYXMgUHJvcGVydHkpPy50YXJnZXRUeXBlICYmIChvUHJvcGVydHkgYXMgUHJvcGVydHkpLnRhcmdldFR5cGU/Ll90eXBlID09PSBcIlR5cGVEZWZpbml0aW9uXCIpIHtcblx0XHRvVGFyZ2V0TWFwcGluZyA9IEVETV9UWVBFX01BUFBJTkdbKChvUHJvcGVydHkgYXMgUHJvcGVydHkpLnRhcmdldFR5cGUgYXMgVHlwZURlZmluaXRpb24pLnVuZGVybHlpbmdUeXBlXTtcblx0fVxuXHRjb25zdCBwcm9wZXJ0eVR5cGVDb25maWc6IGNvbmZpZ1R5cGUgPSB7XG5cdFx0dHlwZTogb1RhcmdldE1hcHBpbmc/LnR5cGUsXG5cdFx0Y29uc3RyYWludHM6IHt9LFxuXHRcdGZvcm1hdE9wdGlvbnM6IHt9XG5cdH07XG5cdGlmIChpc1Byb3BlcnR5KG9Qcm9wZXJ0eSkpIHtcblx0XHRwcm9wZXJ0eVR5cGVDb25maWcuY29uc3RyYWludHMgPSB7XG5cdFx0XHRzY2FsZTogb1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LiRTY2FsZSA/IG9Qcm9wZXJ0eS5zY2FsZSA6IHVuZGVmaW5lZCxcblx0XHRcdHByZWNpc2lvbjogb1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LiRQcmVjaXNpb24gPyBvUHJvcGVydHkucHJlY2lzaW9uIDogdW5kZWZpbmVkLFxuXHRcdFx0bWF4TGVuZ3RoOiBvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cz8uJE1heExlbmd0aCA/IG9Qcm9wZXJ0eS5tYXhMZW5ndGggOiB1bmRlZmluZWQsXG5cdFx0XHRudWxsYWJsZTogb1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LiROdWxsYWJsZSA/IG9Qcm9wZXJ0eS5udWxsYWJsZSA6IHVuZGVmaW5lZCxcblx0XHRcdG1pbmltdW06XG5cdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy5bXCJAT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTWluaW11bS8kRGVjaW1hbFwiXSAmJlxuXHRcdFx0XHQhaXNOYU4ob1Byb3BlcnR5LmFubm90YXRpb25zPy5WYWxpZGF0aW9uPy5NaW5pbXVtKVxuXHRcdFx0XHRcdD8gYCR7b1Byb3BlcnR5LmFubm90YXRpb25zPy5WYWxpZGF0aW9uPy5NaW5pbXVtfWBcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZCxcblx0XHRcdG1heGltdW06XG5cdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy5bXCJAT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTWF4aW11bS8kRGVjaW1hbFwiXSAmJlxuXHRcdFx0XHQhaXNOYU4ob1Byb3BlcnR5LmFubm90YXRpb25zPy5WYWxpZGF0aW9uPy5NYXhpbXVtKVxuXHRcdFx0XHRcdD8gYCR7b1Byb3BlcnR5LmFubm90YXRpb25zPy5WYWxpZGF0aW9uPy5NYXhpbXVtfWBcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZCxcblx0XHRcdGlzRGlnaXRTZXF1ZW5jZTpcblx0XHRcdFx0cHJvcGVydHlUeXBlQ29uZmlnLnR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCIgJiZcblx0XHRcdFx0b1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LltcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNEaWdpdFNlcXVlbmNlXCJdICYmXG5cdFx0XHRcdG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc0RpZ2l0U2VxdWVuY2Vcblx0XHRcdFx0XHQ/IHRydWVcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZFxuXHRcdH07XG5cdH1cblx0cHJvcGVydHlUeXBlQ29uZmlnLmZvcm1hdE9wdGlvbnMgPSB7XG5cdFx0cGFyc2VBc1N0cmluZzpcblx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZz8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludFwiKSA9PT0gMCB8fFxuXHRcdFx0cHJvcGVydHlUeXBlQ29uZmlnPy50eXBlPy5pbmRleE9mKFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuRG91YmxlXCIpID09PSAwXG5cdFx0XHRcdD8gZmFsc2Vcblx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0ZW1wdHlTdHJpbmc6XG5cdFx0XHRwcm9wZXJ0eVR5cGVDb25maWc/LnR5cGU/LmluZGV4T2YoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5JbnRcIikgPT09IDAgfHxcblx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZz8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRvdWJsZVwiKSA9PT0gMFxuXHRcdFx0XHQ/IFwiXCJcblx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0cGFyc2VLZWVwc0VtcHR5U3RyaW5nOiBwcm9wZXJ0eVR5cGVDb25maWcudHlwZSA9PT0gXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5TdHJpbmdcIiA/IHRydWUgOiB1bmRlZmluZWRcblx0fTtcblx0cmV0dXJuIHByb3BlcnR5VHlwZUNvbmZpZztcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHRnZXRUYWJsZUFjdGlvbnMsXG5cdGdldFRhYmxlQ29sdW1ucyxcblx0Z2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlLFxuXHR1cGRhdGVMaW5rZWRQcm9wZXJ0aWVzLFxuXHRjcmVhdGVUYWJsZVZpc3VhbGl6YXRpb24sXG5cdGNyZWF0ZURlZmF1bHRUYWJsZVZpc3VhbGl6YXRpb24sXG5cdGdldENhcGFiaWxpdHlSZXN0cmljdGlvbixcblx0Z2V0U2VsZWN0aW9uTW9kZSxcblx0Z2V0Um93U3RhdHVzVmlzaWJpbGl0eSxcblx0Z2V0SW1wb3J0YW5jZSxcblx0Z2V0UDEzbk1vZGUsXG5cdGdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24sXG5cdGlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZSxcblx0c3BsaXRQYXRoLFxuXHRnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbixcblx0Z2V0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdGdldFR5cGVDb25maWdcbn07XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTRPS0EsVSxFQU1MOzthQU5LQSxVO0lBQUFBLFU7SUFBQUEsVTtJQUFBQSxVO0tBQUFBLFUsS0FBQUEsVTs7RUFpSkw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sU0FBU0MsZUFBVCxDQUNOQyxrQkFETSxFQUVOQyxpQkFGTSxFQUdOQyxnQkFITSxFQUlOQyxrQkFKTSxFQUtXO0lBQ2pCLElBQU1DLGFBQWEsR0FBR0MseUJBQXlCLENBQUNMLGtCQUFELEVBQXFCQyxpQkFBckIsRUFBd0NDLGdCQUF4QyxDQUEvQztJQUNBLElBQU1JLGtCQUFrQixHQUFHRixhQUFhLENBQUNHLFlBQXpDO0lBQ0EsSUFBTUMsY0FBYyxHQUFHSixhQUFhLENBQUNLLGtCQUFyQztJQUNBLElBQU1DLGVBQWUsR0FBR0Msc0JBQXNCLENBQzdDVCxnQkFBZ0IsQ0FBQ1UsK0JBQWpCLENBQWlEWCxpQkFBakQsRUFBb0VZLE9BRHZCLEVBRTdDWCxnQkFGNkMsRUFHN0NJLGtCQUg2QyxFQUk3Q0gsa0JBSjZDLEVBSzdDLElBTDZDLEVBTTdDSyxjQU42QyxDQUE5QztJQVFBLElBQU1LLE9BQU8sR0FBR0Msb0JBQW9CLENBQUNSLGtCQUFELEVBQXFCSSxlQUFlLENBQUNHLE9BQXJDLEVBQThDO01BQ2pGRSxXQUFXLEVBQUUs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