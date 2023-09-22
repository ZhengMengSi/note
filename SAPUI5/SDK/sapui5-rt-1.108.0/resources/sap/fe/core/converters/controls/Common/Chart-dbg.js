/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/annotations/DataField", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper", "sap/ui/core/Core", "../../helpers/Aggregation", "../../helpers/ID", "../../ManifestSettings"], function (DataField, Action, ConfigurableObject, Key, DataModelPathHelper, Core, Aggregation, ID, ManifestSettings) {
  "use strict";

  var _exports = {};
  var VisualizationType = ManifestSettings.VisualizationType;
  var TemplateType = ManifestSettings.TemplateType;
  var ActionType = ManifestSettings.ActionType;
  var getFilterBarID = ID.getFilterBarID;
  var getChartID = ID.getChartID;
  var AggregationHelper = Aggregation.AggregationHelper;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var KeyHelper = Key.KeyHelper;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * Method to retrieve all chart actions from annotations.
   *
   * @param chartAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns The table annotation actions
   */
  function getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext) {
    var chartActions = [];

    if (chartAnnotation) {
      var aActions = chartAnnotation.Actions || [];
      aActions.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _ActionTarget;

        var chartAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true) && !dataField.Inline && !dataField.Determining && !(dataField !== null && dataField !== void 0 && (_ActionTarget = dataField.ActionTarget) !== null && _ActionTarget !== void 0 && _ActionTarget.isBound)) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              chartAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              chartAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;
          }
        }

        if (chartAction) {
          chartActions.push(chartAction);
        }
      });
    }

    return chartActions;
  }

  function getChartActions(chartAnnotation, visualizationPath, converterContext) {
    var aAnnotationActions = getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext);
    var manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions);
    var chartActions = insertCustomElements(aAnnotationActions, manifestActions.actions, {
      enableOnSelect: "overwrite",
      enabled: "overwrite",
      visible: "overwrite",
      command: "overwrite"
    });
    return {
      "actions": chartActions,
      "commandActions": manifestActions.commandActions
    };
  }

  _exports.getChartActions = getChartActions;

  function getP13nMode(visualizationPath, converterContext) {
    var _chartManifestSetting;

    var manifestWrapper = converterContext.getManifestWrapper();
    var chartManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var hasVariantManagement = ["Page", "Control"].indexOf(manifestWrapper.getVariantManagement()) > -1;
    var personalization = true;
    var aPersonalization = [];

    if ((chartManifestSettings === null || chartManifestSettings === void 0 ? void 0 : (_chartManifestSetting = chartManifestSettings.chartSettings) === null || _chartManifestSetting === void 0 ? void 0 : _chartManifestSetting.personalization) !== undefined) {
      personalization = chartManifestSettings.chartSettings.personalization;
    }

    if (hasVariantManagement && personalization) {
      if (personalization === true) {
        return "Sort,Type,Item";
      } else if (typeof personalization === "object") {
        if (personalization.type) {
          aPersonalization.push("Type");
        }

        if (personalization.item) {
          aPersonalization.push("Item");
        }

        if (personalization.sort) {
          aPersonalization.push("Sort");
        }

        return aPersonalization.join(",");
      }
    }

    return undefined;
  }
  /**
   * Create the ChartVisualization configuration that will be used to display a chart using the Chart building block.
   *
   * @param chartAnnotation The target chart annotation
   * @param visualizationPath The current visualization annotation path
   * @param converterContext The converter context
   * @param doNotCheckApplySupported Flag that indicates whether applysupported needs to be checked or not
   * @returns The chart visualization based on the annotation
   */


  _exports.getP13nMode = getP13nMode;

  function createChartVisualization(chartAnnotation, visualizationPath, converterContext, doNotCheckApplySupported) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3;

    var aggregationHelper = new AggregationHelper(converterContext.getEntityType(), converterContext);

    if (!doNotCheckApplySupported && !aggregationHelper.isAnalyticsSupported()) {
      throw new Error("ApplySupported is not added to the annotations");
    }

    var aTransAggregations = aggregationHelper.getTransAggregations();
    var aCustomAggregates = aggregationHelper.getCustomAggregateDefinitions();
    var mCustomAggregates = {};

    if (aCustomAggregates) {
      var entityType = aggregationHelper.getEntityType();

      var _iterator = _createForOfIteratorHelper(aCustomAggregates),
          _step;

      try {
        var _loop = function () {
          var _customAggregate$anno, _customAggregate$anno2, _relatedCustomAggrega, _relatedCustomAggrega2, _relatedCustomAggrega3;

          var customAggregate = _step.value;
          var aContextDefiningProperties = customAggregate === null || customAggregate === void 0 ? void 0 : (_customAggregate$anno = customAggregate.annotations) === null || _customAggregate$anno === void 0 ? void 0 : (_customAggregate$anno2 = _customAggregate$anno.Aggregation) === null || _customAggregate$anno2 === void 0 ? void 0 : _customAggregate$anno2.ContextDefiningProperties;
          var qualifier = customAggregate === null || customAggregate === void 0 ? void 0 : customAggregate.qualifier;
          var relatedCustomAggregateProperty = qualifier && entityType.entityProperties.find(function (property) {
            return property.name === qualifier;
          });
          var label = relatedCustomAggregateProperty && (relatedCustomAggregateProperty === null || relatedCustomAggregateProperty === void 0 ? void 0 : (_relatedCustomAggrega = relatedCustomAggregateProperty.annotations) === null || _relatedCustomAggrega === void 0 ? void 0 : (_relatedCustomAggrega2 = _relatedCustomAggrega.Common) === null || _relatedCustomAggrega2 === void 0 ? void 0 : (_relatedCustomAggrega3 = _relatedCustomAggrega2.Label) === null || _relatedCustomAggrega3 === void 0 ? void 0 : _relatedCustomAggrega3.toString());
          mCustomAggregates[qualifier] = {
            name: qualifier,
            label: label || "Custom Aggregate (".concat(qualifier, ")"),
            sortable: true,
            sortOrder: "both",
            contextDefiningProperty: aContextDefiningProperties ? aContextDefiningProperties.map(function (oCtxDefProperty) {
              return oCtxDefProperty.value;
            }) : []
          };
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    var mTransAggregations = {};
    var oResourceBundleCore = Core.getLibraryResourceBundle("sap.fe.core");

    if (aTransAggregations) {
      for (var i = 0; i < aTransAggregations.length; i++) {
        var _aTransAggregations$i, _aTransAggregations$i2, _aTransAggregations$i3, _aTransAggregations$i4, _aTransAggregations$i5, _aTransAggregations$i6;

        mTransAggregations[aTransAggregations[i].Name] = {
          name: aTransAggregations[i].Name,
          propertyPath: aTransAggregations[i].AggregatableProperty.valueOf().value,
          aggregationMethod: aTransAggregations[i].AggregationMethod,
          label: (_aTransAggregations$i = aTransAggregations[i]) !== null && _aTransAggregations$i !== void 0 && (_aTransAggregations$i2 = _aTransAggregations$i.annotations) !== null && _aTransAggregations$i2 !== void 0 && (_aTransAggregations$i3 = _aTransAggregations$i2.Common) !== null && _aTransAggregations$i3 !== void 0 && _aTransAggregations$i3.Label ? (_aTransAggregations$i4 = aTransAggregations[i]) === null || _aTransAggregations$i4 === void 0 ? void 0 : (_aTransAggregations$i5 = _aTransAggregations$i4.annotations) === null || _aTransAggregations$i5 === void 0 ? void 0 : (_aTransAggregations$i6 = _aTransAggregations$i5.Common) === null || _aTransAggregations$i6 === void 0 ? void 0 : _aTransAggregations$i6.Label.toString() : "".concat(oResourceBundleCore.getText("AGGREGATABLE_PROPERTY"), " (").concat(aTransAggregations[i].Name, ")"),
          sortable: true,
          sortOrder: "both",
          custom: false
        };
      }
    }

    var aAggProps = aggregationHelper.getAggregatableProperties();
    var aGrpProps = aggregationHelper.getGroupableProperties();
    var mApplySupported = {};
    mApplySupported.$Type = "Org.OData.Aggregation.V1.ApplySupportedType";
    mApplySupported.AggregatableProperties = [];
    mApplySupported.GroupableProperties = [];

    for (var _i = 0; aAggProps && _i < aAggProps.length; _i++) {
      var _aAggProps$_i, _aAggProps$_i2, _aAggProps$_i2$Proper;

      var obj = {
        $Type: (_aAggProps$_i = aAggProps[_i]) === null || _aAggProps$_i === void 0 ? void 0 : _aAggProps$_i.$Type,
        Property: {
          $PropertyPath: (_aAggProps$_i2 = aAggProps[_i]) === null || _aAggProps$_i2 === void 0 ? void 0 : (_aAggProps$_i2$Proper = _aAggProps$_i2.Property) === null || _aAggProps$_i2$Proper === void 0 ? void 0 : _aAggProps$_i2$Proper.value
        }
      };
      mApplySupported.AggregatableProperties.push(obj);
    }

    for (var _i2 = 0; aGrpProps && _i2 < aGrpProps.length; _i2++) {
      var _aGrpProps$_i;

      var _obj = {
        $PropertyPath: (_aGrpProps$_i = aGrpProps[_i2]) === null || _aGrpProps$_i === void 0 ? void 0 : _aGrpProps$_i.value
      };
      mApplySupported.GroupableProperties.push(_obj);
    }

    var chartActions = getChartActions(chartAnnotation, visualizationPath, converterContext);

    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 1),
        navigationPropertyPath
    /*, annotationPath*/
    = _visualizationPath$sp2[0];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    var title = (_converterContext$get = converterContext.getEntityType().annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.HeaderInfo) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.TypeNamePlural;
    var dataModelPath = converterContext.getDataModelObjectPath();
    var isEntitySet = navigationPropertyPath.length === 0;
    var entityName = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
    var sFilterbarId = isEntitySet ? getFilterBarID(converterContext.getContextPath()) : undefined;
    var oVizProperties = {
      "legendGroup": {
        "layout": {
          "position": "bottom"
        }
      }
    };
    var autoBindOnInit;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      autoBindOnInit = true;
    } else if (converterContext.getTemplateType() === TemplateType.ListReport || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      autoBindOnInit = false;
    }

    var hasMultipleVisualizations = converterContext.getManifestWrapper().hasMultipleVisualizations() || converterContext.getTemplateType() === "AnalyticalListPage";
    var onSegmentedButtonPressed = hasMultipleVisualizations ? ".handlers.onSegmentedButtonPressed" : "";
    var visible = hasMultipleVisualizations ? "{= ${pageInternal>alpContentView} !== 'Table'}" : "true";
    var allowedTransformations = aggregationHelper.getAllowedTransformations();
    mApplySupported.enableSearch = allowedTransformations ? allowedTransformations.indexOf("search") >= 0 : true;
    var qualifier = "";

    if (chartAnnotation.fullyQualifiedName.split("#").length > 1) {
      qualifier = chartAnnotation.fullyQualifiedName.split("#")[1];
    }

    return {
      type: VisualizationType.Chart,
      id: qualifier ? getChartID(isEntitySet ? entityName : navigationPropertyPath, qualifier, VisualizationType.Chart) : getChartID(isEntitySet ? entityName : navigationPropertyPath, VisualizationType.Chart),
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      entityName: entityName,
      personalization: getP13nMode(visualizationPath, converterContext),
      navigationPath: navigationPropertyPath,
      annotationPath: converterContext.getAbsoluteAnnotationPath(visualizationPath),
      filterId: sFilterbarId,
      vizProperties: JSON.stringify(oVizProperties),
      actions: chartActions.actions,
      commandActions: chartActions.commandActions,
      title: title,
      autoBindOnInit: autoBindOnInit,
      onSegmentedButtonPressed: onSegmentedButtonPressed,
      visible: visible,
      customAgg: mCustomAggregates,
      transAgg: mTransAggregations,
      applySupported: mApplySupported
    };
  }

  _exports.createChartVisualization = createChartVisualization;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRDaGFydEFjdGlvbnNGcm9tQW5ub3RhdGlvbnMiLCJjaGFydEFubm90YXRpb24iLCJ2aXN1YWxpemF0aW9uUGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJjaGFydEFjdGlvbnMiLCJhQWN0aW9ucyIsIkFjdGlvbnMiLCJmb3JFYWNoIiwiZGF0YUZpZWxkIiwiY2hhcnRBY3Rpb24iLCJpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0IiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhpZGRlbiIsInZhbHVlT2YiLCJJbmxpbmUiLCJEZXRlcm1pbmluZyIsIkFjdGlvblRhcmdldCIsImlzQm91bmQiLCJrZXkiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCIkVHlwZSIsInR5cGUiLCJBY3Rpb25UeXBlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwicHVzaCIsImdldENoYXJ0QWN0aW9ucyIsImFBbm5vdGF0aW9uQWN0aW9ucyIsIm1hbmlmZXN0QWN0aW9ucyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJnZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uIiwiYWN0aW9ucyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiZW5hYmxlT25TZWxlY3QiLCJlbmFibGVkIiwidmlzaWJsZSIsImNvbW1hbmQiLCJjb21tYW5kQWN0aW9ucyIsImdldFAxM25Nb2RlIiwibWFuaWZlc3RXcmFwcGVyIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwiY2hhcnRNYW5pZmVzdFNldHRpbmdzIiwiaGFzVmFyaWFudE1hbmFnZW1lbnQiLCJpbmRleE9mIiwiZ2V0VmFyaWFudE1hbmFnZW1lbnQiLCJwZXJzb25hbGl6YXRpb24iLCJhUGVyc29uYWxpemF0aW9uIiwiY2hhcnRTZXR0aW5ncyIsInVuZGVmaW5lZCIsIml0ZW0iLCJzb3J0Iiwiam9pbiIsImNyZWF0ZUNoYXJ0VmlzdWFsaXphdGlvbiIsImRvTm90Q2hlY2tBcHBseVN1cHBvcnRlZCIsImFnZ3JlZ2F0aW9uSGVscGVyIiwiQWdncmVnYXRpb25IZWxwZXIiLCJnZXRFbnRpdHlUeXBlIiwiaXNBbmFseXRpY3NTdXBwb3J0ZWQiLCJFcnJvciIsImFUcmFuc0FnZ3JlZ2F0aW9ucyIsImdldFRyYW5zQWdncmVnYXRpb25zIiwiYUN1c3RvbUFnZ3JlZ2F0ZXMiLCJnZXRDdXN0b21BZ2dyZWdhdGVEZWZpbml0aW9ucyIsIm1DdXN0b21BZ2dyZWdhdGVzIiwiZW50aXR5VHlwZSIsImN1c3RvbUFnZ3JlZ2F0ZSIsImFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwiQWdncmVnYXRpb24iLCJDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwicXVhbGlmaWVyIiwicmVsYXRlZEN1c3RvbUFnZ3JlZ2F0ZVByb3BlcnR5IiwiZW50aXR5UHJvcGVydGllcyIsImZpbmQiLCJwcm9wZXJ0eSIsIm5hbWUiLCJsYWJlbCIsIkNvbW1vbiIsIkxhYmVsIiwidG9TdHJpbmciLCJzb3J0YWJsZSIsInNvcnRPcmRlciIsImNvbnRleHREZWZpbmluZ1Byb3BlcnR5IiwibWFwIiwib0N0eERlZlByb3BlcnR5IiwidmFsdWUiLCJtVHJhbnNBZ2dyZWdhdGlvbnMiLCJvUmVzb3VyY2VCdW5kbGVDb3JlIiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImkiLCJsZW5ndGgiLCJOYW1lIiwicHJvcGVydHlQYXRoIiwiQWdncmVnYXRhYmxlUHJvcGVydHkiLCJhZ2dyZWdhdGlvbk1ldGhvZCIsIkFnZ3JlZ2F0aW9uTWV0aG9kIiwiZ2V0VGV4dCIsImN1c3RvbSIsImFBZ2dQcm9wcyIsImdldEFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhR3JwUHJvcHMiLCJnZXRHcm91cGFibGVQcm9wZXJ0aWVzIiwibUFwcGx5U3VwcG9ydGVkIiwiQWdncmVnYXRhYmxlUHJvcGVydGllcyIsIkdyb3VwYWJsZVByb3BlcnRpZXMiLCJvYmoiLCJQcm9wZXJ0eSIsIiRQcm9wZXJ0eVBhdGgiLCJzcGxpdCIsIm5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJsYXN0SW5kZXhPZiIsInN1YnN0ciIsInRpdGxlIiwiSGVhZGVySW5mbyIsIlR5cGVOYW1lUGx1cmFsIiwiZGF0YU1vZGVsUGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJpc0VudGl0eVNldCIsImVudGl0eU5hbWUiLCJ0YXJnZXRFbnRpdHlTZXQiLCJzdGFydGluZ0VudGl0eVNldCIsInNGaWx0ZXJiYXJJZCIsImdldEZpbHRlckJhcklEIiwiZ2V0Q29udGV4dFBhdGgiLCJvVml6UHJvcGVydGllcyIsImF1dG9CaW5kT25Jbml0IiwiZ2V0VGVtcGxhdGVUeXBlIiwiVGVtcGxhdGVUeXBlIiwiT2JqZWN0UGFnZSIsIkxpc3RSZXBvcnQiLCJBbmFseXRpY2FsTGlzdFBhZ2UiLCJoYXNNdWx0aXBsZVZpc3VhbGl6YXRpb25zIiwib25TZWdtZW50ZWRCdXR0b25QcmVzc2VkIiwiYWxsb3dlZFRyYW5zZm9ybWF0aW9ucyIsImdldEFsbG93ZWRUcmFuc2Zvcm1hdGlvbnMiLCJlbmFibGVTZWFyY2giLCJWaXN1YWxpemF0aW9uVHlwZSIsIkNoYXJ0IiwiaWQiLCJnZXRDaGFydElEIiwiY29sbGVjdGlvbiIsImdldFRhcmdldE9iamVjdFBhdGgiLCJuYXZpZ2F0aW9uUGF0aCIsImdldEFic29sdXRlQW5ub3RhdGlvblBhdGgiLCJmaWx0ZXJJZCIsInZpelByb3BlcnRpZXMiLCJKU09OIiwic3RyaW5naWZ5IiwiY3VzdG9tQWdnIiwidHJhbnNBZ2ciLCJhcHBseVN1cHBvcnRlZCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiQ2hhcnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDaGFydCwgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB7IFVJQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHsgaXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2Fubm90YXRpb25zL0RhdGFGaWVsZFwiO1xuaW1wb3J0IHR5cGUgeyBBbm5vdGF0aW9uQWN0aW9uLCBCYXNlQWN0aW9uLCBDb21iaW5lZEFjdGlvbiwgQ3VzdG9tQWN0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IGluc2VydEN1c3RvbUVsZW1lbnRzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCB0eXBlIENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uLy4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0aW9uSGVscGVyIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvQWdncmVnYXRpb25cIjtcbmltcG9ydCB7IGdldENoYXJ0SUQsIGdldEZpbHRlckJhcklEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB0eXBlIHsgQ2hhcnRNYW5pZmVzdENvbmZpZ3VyYXRpb24sIENoYXJ0UGVyc29uYWxpemF0aW9uTWFuaWZlc3RTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBBY3Rpb25UeXBlLCBUZW1wbGF0ZVR5cGUsIFZpc3VhbGl6YXRpb25UeXBlIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB0eXBlIE1hbmlmZXN0V3JhcHBlciBmcm9tIFwiLi4vLi4vTWFuaWZlc3RXcmFwcGVyXCI7XG5cbi8qKlxuICogQHR5cGVkZWYgQ2hhcnRWaXN1YWxpemF0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIENoYXJ0VmlzdWFsaXphdGlvbiA9IHtcblx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuQ2hhcnQ7XG5cdGlkOiBzdHJpbmc7XG5cdGNvbGxlY3Rpb246IHN0cmluZztcblx0ZW50aXR5TmFtZTogc3RyaW5nO1xuXHRwZXJzb25hbGl6YXRpb24/OiBzdHJpbmc7XG5cdG5hdmlnYXRpb25QYXRoOiBzdHJpbmc7XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdGZpbHRlcklkPzogc3RyaW5nO1xuXHR2aXpQcm9wZXJ0aWVzOiBzdHJpbmc7XG5cdGFjdGlvbnM6IEJhc2VBY3Rpb25bXTtcblx0Y29tbWFuZEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj47XG5cdHRpdGxlOiBzdHJpbmc7XG5cdGF1dG9CaW5kT25Jbml0OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRvblNlZ21lbnRlZEJ1dHRvblByZXNzZWQ6IHN0cmluZztcblx0dmlzaWJsZTogc3RyaW5nO1xuXHRjdXN0b21BZ2c6IG9iamVjdDtcblx0dHJhbnNBZ2c6IG9iamVjdDtcblx0YXBwbHlTdXBwb3J0ZWQ6IHtcblx0XHQkVHlwZTogc3RyaW5nO1xuXHRcdGVuYWJsZVNlYXJjaDogYm9vbGVhbjtcblx0XHRBZ2dyZWdhdGFibGVQcm9wZXJ0aWVzOiBhbnlbXTtcblx0XHRHcm91cGFibGVQcm9wZXJ0aWVzOiBhbnlbXTtcblx0fTtcblx0bXVsdGlWaWV3cz86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byByZXRyaWV2ZSBhbGwgY2hhcnQgYWN0aW9ucyBmcm9tIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBjaGFydEFubm90YXRpb25cbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSB0YWJsZSBhbm5vdGF0aW9uIGFjdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0Q2hhcnRBY3Rpb25zRnJvbUFubm90YXRpb25zKFxuXHRjaGFydEFubm90YXRpb246IENoYXJ0LFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBCYXNlQWN0aW9uW10ge1xuXHRjb25zdCBjaGFydEFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRpZiAoY2hhcnRBbm5vdGF0aW9uKSB7XG5cdFx0Y29uc3QgYUFjdGlvbnMgPSBjaGFydEFubm90YXRpb24uQWN0aW9ucyB8fCBbXTtcblx0XHRhQWN0aW9ucy5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdGxldCBjaGFydEFjdGlvbjogQW5ub3RhdGlvbkFjdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRcdGlmIChcblx0XHRcdFx0aXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdChkYXRhRmllbGQpICYmXG5cdFx0XHRcdCEoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuSW5saW5lICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuRGV0ZXJtaW5pbmcgJiZcblx0XHRcdFx0IShkYXRhRmllbGQgYXMgYW55KT8uQWN0aW9uVGFyZ2V0Py5pc0JvdW5kXG5cdFx0XHQpIHtcblx0XHRcdFx0Y29uc3Qga2V5ID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdFx0XHRcdFx0Y2hhcnRBY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGtleVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRcdFx0XHRjaGFydEFjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24sXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0XHRcdGtleToga2V5XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChjaGFydEFjdGlvbikge1xuXHRcdFx0XHRjaGFydEFjdGlvbnMucHVzaChjaGFydEFjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGNoYXJ0QWN0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJ0QWN0aW9ucyhjaGFydEFubm90YXRpb246IENoYXJ0LCB2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29tYmluZWRBY3Rpb24ge1xuXHRjb25zdCBhQW5ub3RhdGlvbkFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGdldENoYXJ0QWN0aW9uc0Zyb21Bbm5vdGF0aW9ucyhjaGFydEFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgbWFuaWZlc3RBY3Rpb25zID0gZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdChcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpLmFjdGlvbnMsXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRhQW5ub3RhdGlvbkFjdGlvbnNcblx0KTtcblx0Y29uc3QgY2hhcnRBY3Rpb25zID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYUFubm90YXRpb25BY3Rpb25zLCBtYW5pZmVzdEFjdGlvbnMuYWN0aW9ucywge1xuXHRcdGVuYWJsZU9uU2VsZWN0OiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGVuYWJsZWQ6IFwib3ZlcndyaXRlXCIsXG5cdFx0dmlzaWJsZTogXCJvdmVyd3JpdGVcIixcblx0XHRjb21tYW5kOiBcIm92ZXJ3cml0ZVwiXG5cdH0pO1xuXHRyZXR1cm4ge1xuXHRcdFwiYWN0aW9uc1wiOiBjaGFydEFjdGlvbnMsXG5cdFx0XCJjb21tYW5kQWN0aW9uc1wiOiBtYW5pZmVzdEFjdGlvbnMuY29tbWFuZEFjdGlvbnNcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFAxM25Nb2RlKHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXI6IE1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IGNoYXJ0TWFuaWZlc3RTZXR0aW5nczogQ2hhcnRNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCBoYXNWYXJpYW50TWFuYWdlbWVudDogYm9vbGVhbiA9IFtcIlBhZ2VcIiwgXCJDb250cm9sXCJdLmluZGV4T2YobWFuaWZlc3RXcmFwcGVyLmdldFZhcmlhbnRNYW5hZ2VtZW50KCkpID4gLTE7XG5cdGxldCBwZXJzb25hbGl6YXRpb246IENoYXJ0UGVyc29uYWxpemF0aW9uTWFuaWZlc3RTZXR0aW5ncyA9IHRydWU7XG5cdGNvbnN0IGFQZXJzb25hbGl6YXRpb246IHN0cmluZ1tdID0gW107XG5cdGlmIChjaGFydE1hbmlmZXN0U2V0dGluZ3M/LmNoYXJ0U2V0dGluZ3M/LnBlcnNvbmFsaXphdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGVyc29uYWxpemF0aW9uID0gY2hhcnRNYW5pZmVzdFNldHRpbmdzLmNoYXJ0U2V0dGluZ3MucGVyc29uYWxpemF0aW9uO1xuXHR9XG5cdGlmIChoYXNWYXJpYW50TWFuYWdlbWVudCAmJiBwZXJzb25hbGl6YXRpb24pIHtcblx0XHRpZiAocGVyc29uYWxpemF0aW9uID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gXCJTb3J0LFR5cGUsSXRlbVwiO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHBlcnNvbmFsaXphdGlvbiA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi50eXBlKSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlR5cGVcIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGVyc29uYWxpemF0aW9uLml0ZW0pIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiSXRlbVwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uc29ydCkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJTb3J0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBDaGFydFZpc3VhbGl6YXRpb24gY29uZmlndXJhdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBkaXNwbGF5IGEgY2hhcnQgdXNpbmcgdGhlIENoYXJ0IGJ1aWxkaW5nIGJsb2NrLlxuICpcbiAqIEBwYXJhbSBjaGFydEFubm90YXRpb24gVGhlIHRhcmdldCBjaGFydCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gdmlzdWFsaXphdGlvblBhdGggVGhlIGN1cnJlbnQgdmlzdWFsaXphdGlvbiBhbm5vdGF0aW9uIHBhdGhcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGRvTm90Q2hlY2tBcHBseVN1cHBvcnRlZCBGbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYXBwbHlzdXBwb3J0ZWQgbmVlZHMgdG8gYmUgY2hlY2tlZCBvciBub3RcbiAqIEByZXR1cm5zIFRoZSBjaGFydCB2aXN1YWxpemF0aW9uIGJhc2VkIG9uIHRoZSBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaGFydFZpc3VhbGl6YXRpb24oXG5cdGNoYXJ0QW5ub3RhdGlvbjogQ2hhcnQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGRvTm90Q2hlY2tBcHBseVN1cHBvcnRlZD86IGJvb2xlYW5cbik6IENoYXJ0VmlzdWFsaXphdGlvbiB7XG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0aWYgKCFkb05vdENoZWNrQXBwbHlTdXBwb3J0ZWQgJiYgIWFnZ3JlZ2F0aW9uSGVscGVyLmlzQW5hbHl0aWNzU3VwcG9ydGVkKCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBcHBseVN1cHBvcnRlZCBpcyBub3QgYWRkZWQgdG8gdGhlIGFubm90YXRpb25zXCIpO1xuXHR9XG5cdGNvbnN0IGFUcmFuc0FnZ3JlZ2F0aW9ucyA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldFRyYW5zQWdncmVnYXRpb25zKCk7XG5cdGNvbnN0IGFDdXN0b21BZ2dyZWdhdGVzID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMoKTtcblx0Y29uc3QgbUN1c3RvbUFnZ3JlZ2F0ZXMgPSB7fSBhcyBhbnk7XG5cdGlmIChhQ3VzdG9tQWdncmVnYXRlcykge1xuXHRcdGNvbnN0IGVudGl0eVR5cGUgPSBhZ2dyZWdhdGlvbkhlbHBlci5nZXRFbnRpdHlUeXBlKCk7XG5cdFx0Zm9yIChjb25zdCBjdXN0b21BZ2dyZWdhdGUgb2YgYUN1c3RvbUFnZ3JlZ2F0ZXMpIHtcblx0XHRcdGNvbnN0IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzID0gY3VzdG9tQWdncmVnYXRlPy5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM7XG5cdFx0XHRjb25zdCBxdWFsaWZpZXIgPSBjdXN0b21BZ2dyZWdhdGU/LnF1YWxpZmllcjtcblx0XHRcdGNvbnN0IHJlbGF0ZWRDdXN0b21BZ2dyZWdhdGVQcm9wZXJ0eSA9IHF1YWxpZmllciAmJiBlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZmluZCgocHJvcGVydHkpID0+IHByb3BlcnR5Lm5hbWUgPT09IHF1YWxpZmllcik7XG5cdFx0XHRjb25zdCBsYWJlbCA9IHJlbGF0ZWRDdXN0b21BZ2dyZWdhdGVQcm9wZXJ0eSAmJiByZWxhdGVkQ3VzdG9tQWdncmVnYXRlUHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy50b1N0cmluZygpO1xuXHRcdFx0bUN1c3RvbUFnZ3JlZ2F0ZXNbcXVhbGlmaWVyXSA9IHtcblx0XHRcdFx0bmFtZTogcXVhbGlmaWVyLFxuXHRcdFx0XHRsYWJlbDogbGFiZWwgfHwgYEN1c3RvbSBBZ2dyZWdhdGUgKCR7cXVhbGlmaWVyfSlgLFxuXHRcdFx0XHRzb3J0YWJsZTogdHJ1ZSxcblx0XHRcdFx0c29ydE9yZGVyOiBcImJvdGhcIixcblx0XHRcdFx0Y29udGV4dERlZmluaW5nUHJvcGVydHk6IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzXG5cdFx0XHRcdFx0PyBhQ29udGV4dERlZmluaW5nUHJvcGVydGllcy5tYXAoKG9DdHhEZWZQcm9wZXJ0eSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0N0eERlZlByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHRcdCAgfSlcblx0XHRcdFx0XHQ6IFtdXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IG1UcmFuc0FnZ3JlZ2F0aW9ucyA9IHt9IGFzIGFueTtcblx0Y29uc3Qgb1Jlc291cmNlQnVuZGxlQ29yZSA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIik7XG5cdGlmIChhVHJhbnNBZ2dyZWdhdGlvbnMpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFUcmFuc0FnZ3JlZ2F0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bVRyYW5zQWdncmVnYXRpb25zW2FUcmFuc0FnZ3JlZ2F0aW9uc1tpXS5OYW1lXSA9IHtcblx0XHRcdFx0bmFtZTogYVRyYW5zQWdncmVnYXRpb25zW2ldLk5hbWUsXG5cdFx0XHRcdHByb3BlcnR5UGF0aDogYVRyYW5zQWdncmVnYXRpb25zW2ldLkFnZ3JlZ2F0YWJsZVByb3BlcnR5LnZhbHVlT2YoKS52YWx1ZSxcblx0XHRcdFx0YWdncmVnYXRpb25NZXRob2Q6IGFUcmFuc0FnZ3JlZ2F0aW9uc1tpXS5BZ2dyZWdhdGlvbk1ldGhvZCxcblx0XHRcdFx0bGFiZWw6IGFUcmFuc0FnZ3JlZ2F0aW9uc1tpXT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWxcblx0XHRcdFx0XHQ/IGFUcmFuc0FnZ3JlZ2F0aW9uc1tpXT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWwudG9TdHJpbmcoKVxuXHRcdFx0XHRcdDogYCR7b1Jlc291cmNlQnVuZGxlQ29yZS5nZXRUZXh0KFwiQUdHUkVHQVRBQkxFX1BST1BFUlRZXCIpfSAoJHthVHJhbnNBZ2dyZWdhdGlvbnNbaV0uTmFtZX0pYCxcblx0XHRcdFx0c29ydGFibGU6IHRydWUsXG5cdFx0XHRcdHNvcnRPcmRlcjogXCJib3RoXCIsXG5cdFx0XHRcdGN1c3RvbTogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgYUFnZ1Byb3BzID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0QWdncmVnYXRhYmxlUHJvcGVydGllcygpO1xuXHRjb25zdCBhR3JwUHJvcHMgPSBhZ2dyZWdhdGlvbkhlbHBlci5nZXRHcm91cGFibGVQcm9wZXJ0aWVzKCk7XG5cdGNvbnN0IG1BcHBseVN1cHBvcnRlZCA9IHt9IGFzIGFueTtcblx0bUFwcGx5U3VwcG9ydGVkLiRUeXBlID0gXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQXBwbHlTdXBwb3J0ZWRUeXBlXCI7XG5cdG1BcHBseVN1cHBvcnRlZC5BZ2dyZWdhdGFibGVQcm9wZXJ0aWVzID0gW107XG5cdG1BcHBseVN1cHBvcnRlZC5Hcm91cGFibGVQcm9wZXJ0aWVzID0gW107XG5cblx0Zm9yIChsZXQgaSA9IDA7IGFBZ2dQcm9wcyAmJiBpIDwgYUFnZ1Byb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qgb2JqID0ge1xuXHRcdFx0JFR5cGU6IGFBZ2dQcm9wc1tpXT8uJFR5cGUsXG5cdFx0XHRQcm9wZXJ0eToge1xuXHRcdFx0XHQkUHJvcGVydHlQYXRoOiBhQWdnUHJvcHNbaV0/LlByb3BlcnR5Py52YWx1ZVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRtQXBwbHlTdXBwb3J0ZWQuQWdncmVnYXRhYmxlUHJvcGVydGllcy5wdXNoKG9iaik7XG5cdH1cblxuXHRmb3IgKGxldCBpID0gMDsgYUdycFByb3BzICYmIGkgPCBhR3JwUHJvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBvYmogPSB7ICRQcm9wZXJ0eVBhdGg6IGFHcnBQcm9wc1tpXT8udmFsdWUgfTtcblxuXHRcdG1BcHBseVN1cHBvcnRlZC5Hcm91cGFibGVQcm9wZXJ0aWVzLnB1c2gob2JqKTtcblx0fVxuXG5cdGNvbnN0IGNoYXJ0QWN0aW9ucyA9IGdldENoYXJ0QWN0aW9ucyhjaGFydEFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0bGV0IFtuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIC8qLCBhbm5vdGF0aW9uUGF0aCovXSA9IHZpc3VhbGl6YXRpb25QYXRoLnNwbGl0KFwiQFwiKTtcblx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGFzdEluZGV4T2YoXCIvXCIpID09PSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpIHtcblx0XHQvLyBEcm9wIHRyYWlsaW5nIHNsYXNoXG5cdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdH1cblx0Y29uc3QgdGl0bGU6IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLmFubm90YXRpb25zPy5VST8uSGVhZGVySW5mbz8uVHlwZU5hbWVQbHVyYWw7XG5cdGNvbnN0IGRhdGFNb2RlbFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgaXNFbnRpdHlTZXQ6IGJvb2xlYW4gPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA9PT0gMDtcblx0Y29uc3QgZW50aXR5TmFtZTogc3RyaW5nID0gZGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQgPyBkYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldC5uYW1lIDogZGF0YU1vZGVsUGF0aC5zdGFydGluZ0VudGl0eVNldC5uYW1lO1xuXHRjb25zdCBzRmlsdGVyYmFySWQgPSBpc0VudGl0eVNldCA/IGdldEZpbHRlckJhcklEKGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKSkgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9WaXpQcm9wZXJ0aWVzID0ge1xuXHRcdFwibGVnZW5kR3JvdXBcIjoge1xuXHRcdFx0XCJsYXlvdXRcIjoge1xuXHRcdFx0XHRcInBvc2l0aW9uXCI6IFwiYm90dG9tXCJcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdGxldCBhdXRvQmluZE9uSW5pdDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0YXV0b0JpbmRPbkluaXQgPSB0cnVlO1xuXHR9IGVsc2UgaWYgKFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0IHx8XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZVxuXHQpIHtcblx0XHRhdXRvQmluZE9uSW5pdCA9IGZhbHNlO1xuXHR9XG5cdGNvbnN0IGhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMgPVxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucygpIHx8IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFwiQW5hbHl0aWNhbExpc3RQYWdlXCI7XG5cdGNvbnN0IG9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZCA9IGhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMgPyBcIi5oYW5kbGVycy5vblNlZ21lbnRlZEJ1dHRvblByZXNzZWRcIiA6IFwiXCI7XG5cdGNvbnN0IHZpc2libGUgPSBoYXNNdWx0aXBsZVZpc3VhbGl6YXRpb25zID8gXCJ7PSAke3BhZ2VJbnRlcm5hbD5hbHBDb250ZW50Vmlld30gIT09ICdUYWJsZSd9XCIgOiBcInRydWVcIjtcblx0Y29uc3QgYWxsb3dlZFRyYW5zZm9ybWF0aW9ucyA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldEFsbG93ZWRUcmFuc2Zvcm1hdGlvbnMoKTtcblx0bUFwcGx5U3VwcG9ydGVkLmVuYWJsZVNlYXJjaCA9IGFsbG93ZWRUcmFuc2Zvcm1hdGlvbnMgPyBhbGxvd2VkVHJhbnNmb3JtYXRpb25zLmluZGV4T2YoXCJzZWFyY2hcIikgPj0gMCA6IHRydWU7XG5cdGxldCBxdWFsaWZpZXI6IHN0cmluZyA9IFwiXCI7XG5cdGlmIChjaGFydEFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KFwiI1wiKS5sZW5ndGggPiAxKSB7XG5cdFx0cXVhbGlmaWVyID0gY2hhcnRBbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcIiNcIilbMV07XG5cdH1cblx0cmV0dXJuIHtcblx0XHR0eXBlOiBWaXN1YWxpemF0aW9uVHlwZS5DaGFydCxcblx0XHRpZDogcXVhbGlmaWVyXG5cdFx0XHQ/IGdldENoYXJ0SUQoaXNFbnRpdHlTZXQgPyBlbnRpdHlOYW1lIDogbmF2aWdhdGlvblByb3BlcnR5UGF0aCwgcXVhbGlmaWVyLCBWaXN1YWxpemF0aW9uVHlwZS5DaGFydClcblx0XHRcdDogZ2V0Q2hhcnRJRChpc0VudGl0eVNldCA/IGVudGl0eU5hbWUgOiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLCBWaXN1YWxpemF0aW9uVHlwZS5DaGFydCksXG5cdFx0Y29sbGVjdGlvbjogZ2V0VGFyZ2V0T2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSksXG5cdFx0ZW50aXR5TmFtZTogZW50aXR5TmFtZSxcblx0XHRwZXJzb25hbGl6YXRpb246IGdldFAxM25Nb2RlKHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRuYXZpZ2F0aW9uUGF0aDogbmF2aWdhdGlvblByb3BlcnR5UGF0aCxcblx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKHZpc3VhbGl6YXRpb25QYXRoKSxcblx0XHRmaWx0ZXJJZDogc0ZpbHRlcmJhcklkLFxuXHRcdHZpelByb3BlcnRpZXM6IEpTT04uc3RyaW5naWZ5KG9WaXpQcm9wZXJ0aWVzKSxcblx0XHRhY3Rpb25zOiBjaGFydEFjdGlvbnMuYWN0aW9ucyxcblx0XHRjb21tYW5kQWN0aW9uczogY2hhcnRBY3Rpb25zLmNvbW1hbmRBY3Rpb25zLFxuXHRcdHRpdGxlOiB0aXRsZSxcblx0XHRhdXRvQmluZE9uSW5pdDogYXV0b0JpbmRPbkluaXQsXG5cdFx0b25TZWdtZW50ZWRCdXR0b25QcmVzc2VkOiBvblNlZ21lbnRlZEJ1dHRvblByZXNzZWQsXG5cdFx0dmlzaWJsZTogdmlzaWJsZSxcblx0XHRjdXN0b21BZ2c6IG1DdXN0b21BZ2dyZWdhdGVzLFxuXHRcdHRyYW5zQWdnOiBtVHJhbnNBZ2dyZWdhdGlvbnMsXG5cdFx0YXBwbHlTdXBwb3J0ZWQ6IG1BcHBseVN1cHBvcnRlZFxuXHR9O1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBOENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxT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