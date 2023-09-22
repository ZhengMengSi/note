/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/converters/helpers/SelectionVariantHelper", "sap/fe/core/formatters/TableFormatterTypes", "sap/fe/core/templating/PropertyHelper", "../../helpers/Aggregation", "../../helpers/ID", "./Criticality"], function (IssueManager, SelectionVariantHelper, TableFormatterTypes, PropertyHelper, Aggregation, ID, Criticality) {
  "use strict";

  var _exports = {};
  var getMessageTypeFromCriticalityType = Criticality.getMessageTypeFromCriticalityType;
  var getKPIID = ID.getKPIID;
  var AggregationHelper = Aggregation.AggregationHelper;
  var isPathExpression = PropertyHelper.isPathExpression;
  var MessageType = TableFormatterTypes.MessageType;
  var getFilterDefinitionsFromSelectionVariant = SelectionVariantHelper.getFilterDefinitionsFromSelectionVariant;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;

  var DeviationIndicatorFromTrendType = {
    "UI.TrendType/StrongUp": "Up",
    "UI.TrendType/Up": "Up",
    "UI.TrendType/StrongDown": "Down",
    "UI.TrendType/Down": "Down",
    "UI.TrendType/Sideways": "None"
  };
  var KPIChartTypeFromUI = {
    "UI.ChartType/ColumnStacked": "StackedColumn",
    "UI.ChartType/BarStacked": "StackedBar",
    "UI.ChartType/Donut": "Donut",
    "UI.ChartType/Line": "Line",
    "UI.ChartType/Bubble": "bubble",
    "UI.ChartType/Column": "column",
    "UI.ChartType/Bar": "bar",
    "UI.ChartType/VerticalBullet": "vertical_bullet",
    "UI.ChartType/Combination": "combination",
    "UI.ChartType/Scatter": "scatter"
  };

  function convertKPIChart(chartAnnotation, presentationVariantAnnotation) {
    var _presentationVariantA, _presentationVariantA2;

    if (chartAnnotation.Measures === undefined) {
      // We need at least 1 measure (but no dimension is allowed, e.g. for bubble chart)
      return undefined;
    }

    var charDimensions = chartAnnotation.Dimensions ? chartAnnotation.Dimensions.map(function (propertyPath) {
      var _chartAnnotation$Dime, _propertyPath$$target, _propertyPath$$target2, _dimAttribute$Role;

      var dimAttribute = (_chartAnnotation$Dime = chartAnnotation.DimensionAttributes) === null || _chartAnnotation$Dime === void 0 ? void 0 : _chartAnnotation$Dime.find(function (attribute) {
        var _attribute$Dimension;

        return ((_attribute$Dimension = attribute.Dimension) === null || _attribute$Dimension === void 0 ? void 0 : _attribute$Dimension.value) === propertyPath.value;
      });
      return {
        name: propertyPath.value,
        label: ((_propertyPath$$target = propertyPath.$target.annotations.Common) === null || _propertyPath$$target === void 0 ? void 0 : (_propertyPath$$target2 = _propertyPath$$target.Label) === null || _propertyPath$$target2 === void 0 ? void 0 : _propertyPath$$target2.toString()) || propertyPath.value,
        role: dimAttribute === null || dimAttribute === void 0 ? void 0 : (_dimAttribute$Role = dimAttribute.Role) === null || _dimAttribute$Role === void 0 ? void 0 : _dimAttribute$Role.replace("UI.ChartDimensionRoleType/", "")
      };
    }) : [];
    var chartMeasures = chartAnnotation.Measures.map(function (propertyPath) {
      var _chartAnnotation$Meas, _propertyPath$$target3, _propertyPath$$target4, _measureAttribute$Rol;

      var measureAttribute = (_chartAnnotation$Meas = chartAnnotation.MeasureAttributes) === null || _chartAnnotation$Meas === void 0 ? void 0 : _chartAnnotation$Meas.find(function (attribute) {
        var _attribute$Measure;

        return ((_attribute$Measure = attribute.Measure) === null || _attribute$Measure === void 0 ? void 0 : _attribute$Measure.value) === propertyPath.value;
      });
      return {
        name: propertyPath.value,
        label: ((_propertyPath$$target3 = propertyPath.$target.annotations.Common) === null || _propertyPath$$target3 === void 0 ? void 0 : (_propertyPath$$target4 = _propertyPath$$target3.Label) === null || _propertyPath$$target4 === void 0 ? void 0 : _propertyPath$$target4.toString()) || propertyPath.value,
        role: measureAttribute === null || measureAttribute === void 0 ? void 0 : (_measureAttribute$Rol = measureAttribute.Role) === null || _measureAttribute$Rol === void 0 ? void 0 : _measureAttribute$Rol.replace("UI.ChartMeasureRoleType/", "")
      };
    });
    return {
      chartType: KPIChartTypeFromUI[chartAnnotation.ChartType] || "Line",
      dimensions: charDimensions,
      measures: chartMeasures,
      sortOrder: presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : (_presentationVariantA = presentationVariantAnnotation.SortOrder) === null || _presentationVariantA === void 0 ? void 0 : _presentationVariantA.map(function (sortOrder) {
        var _sortOrder$Property;

        return {
          name: ((_sortOrder$Property = sortOrder.Property) === null || _sortOrder$Property === void 0 ? void 0 : _sortOrder$Property.value) || "",
          descending: !!sortOrder.Descending
        };
      }),
      maxItems: presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : (_presentationVariantA2 = presentationVariantAnnotation.MaxItems) === null || _presentationVariantA2 === void 0 ? void 0 : _presentationVariantA2.valueOf()
    };
  }

  function updateCurrency(datapointAnnotation, kpiDef) {
    var _targetValueProperty$, _targetValueProperty$3;

    var targetValueProperty = datapointAnnotation.Value.$target;

    if ((_targetValueProperty$ = targetValueProperty.annotations.Measures) !== null && _targetValueProperty$ !== void 0 && _targetValueProperty$.ISOCurrency) {
      var _targetValueProperty$2;

      var currency = (_targetValueProperty$2 = targetValueProperty.annotations.Measures) === null || _targetValueProperty$2 === void 0 ? void 0 : _targetValueProperty$2.ISOCurrency;

      if (isPathExpression(currency)) {
        kpiDef.datapoint.unit = {
          value: currency.$target.name,
          isCurrency: true,
          isPath: true
        };
      } else {
        kpiDef.datapoint.unit = {
          value: currency.toString(),
          isCurrency: true,
          isPath: false
        };
      }
    } else if ((_targetValueProperty$3 = targetValueProperty.annotations.Measures) !== null && _targetValueProperty$3 !== void 0 && _targetValueProperty$3.Unit) {
      var _targetValueProperty$4;

      var unit = (_targetValueProperty$4 = targetValueProperty.annotations.Measures) === null || _targetValueProperty$4 === void 0 ? void 0 : _targetValueProperty$4.Unit;

      if (isPathExpression(unit)) {
        kpiDef.datapoint.unit = {
          value: unit.$target.name,
          isCurrency: false,
          isPath: true
        };
      } else {
        kpiDef.datapoint.unit = {
          value: unit.toString(),
          isCurrency: false,
          isPath: false
        };
      }
    }
  }

  function updateCriticality(datapointAnnotation, aggregationHelper, kpiDef) {
    if (datapointAnnotation.Criticality) {
      if (typeof datapointAnnotation.Criticality === "object") {
        // Criticality is a path --> check if the corresponding property is aggregatable
        var criticalityProperty = datapointAnnotation.Criticality.$target;

        if (aggregationHelper.isPropertyAggregatable(criticalityProperty)) {
          kpiDef.datapoint.criticalityPath = datapointAnnotation.Criticality.path;
        } else {
          // The property isn't aggregatable --> we ignore it
          kpiDef.datapoint.criticalityValue = MessageType.None;
        }
      } else {
        // Criticality is an enum Value --> get the corresponding static value
        kpiDef.datapoint.criticalityValue = getMessageTypeFromCriticalityType(datapointAnnotation.Criticality);
      }
    } else if (datapointAnnotation.CriticalityCalculation) {
      kpiDef.datapoint.criticalityCalculationMode = datapointAnnotation.CriticalityCalculation.ImprovementDirection;
      kpiDef.datapoint.criticalityCalculationThresholds = [];

      switch (kpiDef.datapoint.criticalityCalculationMode) {
        case "UI.ImprovementDirectionType/Target":
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeHighValue);
          break;

        case "UI.ImprovementDirectionType/Minimize":
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeHighValue);
          break;

        case "UI.ImprovementDirectionType/Maximize":
        default:
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeLowValue);
      }
    } else {
      kpiDef.datapoint.criticalityValue = MessageType.None;
    }
  }

  function updateTrend(datapointAnnotation, aggregationHelper, kpiDef) {
    if (datapointAnnotation.Trend) {
      if (typeof datapointAnnotation.Trend === "object") {
        // Trend is a path --> check if the corresponding property is aggregatable
        var trendProperty = datapointAnnotation.Trend.$target;

        if (aggregationHelper.isPropertyAggregatable(trendProperty)) {
          kpiDef.datapoint.trendPath = datapointAnnotation.Trend.path;
        } else {
          // The property isn't aggregatable --> we ignore it
          kpiDef.datapoint.trendValue = "None";
        }
      } else {
        // Trend is an enum Value --> get the corresponding static value
        kpiDef.datapoint.trendValue = DeviationIndicatorFromTrendType[datapointAnnotation.Trend] || "None";
      }
    } else if (datapointAnnotation.TrendCalculation) {
      kpiDef.datapoint.trendCalculationIsRelative = datapointAnnotation.TrendCalculation.IsRelativeDifference ? true : false;

      if (datapointAnnotation.TrendCalculation.ReferenceValue.$target) {
        // Reference value is a path --> check if the corresponding property is aggregatable
        var referenceProperty = datapointAnnotation.TrendCalculation.ReferenceValue.$target;

        if (aggregationHelper.isPropertyAggregatable(referenceProperty)) {
          kpiDef.datapoint.trendCalculationReferencePath = datapointAnnotation.TrendCalculation.ReferenceValue.path;
        } else {
          // The property isn't aggregatable --> we ignore it and switch back to trend 'None'
          kpiDef.datapoint.trendValue = "None";
        }
      } else {
        // Reference value is a static value
        kpiDef.datapoint.trendCalculationReferenceValue = datapointAnnotation.TrendCalculation.ReferenceValue;
      }

      if (kpiDef.datapoint.trendCalculationReferencePath !== undefined || kpiDef.datapoint.trendCalculationReferenceValue !== undefined) {
        kpiDef.datapoint.trendCalculationTresholds = [datapointAnnotation.TrendCalculation.StrongDownDifference.valueOf(), datapointAnnotation.TrendCalculation.DownDifference.valueOf(), datapointAnnotation.TrendCalculation.UpDifference.valueOf(), datapointAnnotation.TrendCalculation.StrongUpDifference.valueOf()];
      }
    } else {
      kpiDef.datapoint.trendValue = "None";
    }
  }

  function updateTarget(datapointAnnotation, aggregationHelper, kpiDef) {
    if (datapointAnnotation.TargetValue) {
      if (datapointAnnotation.TargetValue.$target) {
        // Target value is a path --> check if the corresponding property is aggregatable (otherwise ignore)
        var targetProperty = datapointAnnotation.TargetValue.$target;

        if (aggregationHelper.isPropertyAggregatable(targetProperty)) {
          kpiDef.datapoint.targetPath = datapointAnnotation.TargetValue.path;
        }
      } else {
        // Target value is a static value
        kpiDef.datapoint.targetValue = datapointAnnotation.TargetValue;
      }
    }
  }

  function getNavigationInfoFromProperty(property) {
    var annotations = property.annotations["Common"] || {}; // Look for the semanticObject annotation (if any)

    var semanticObjectAnnotation;
    Object.keys(annotations).forEach(function (annotationKey) {
      var annotation = annotations[annotationKey];

      if (annotation.term === "com.sap.vocabularies.Common.v1.SemanticObject") {
        if (!annotation.qualifier || !semanticObjectAnnotation) {
          // We always take the annotation without qualifier if there's one, otherwise we take the first one
          semanticObjectAnnotation = annotation;
        }
      }
    });

    if (semanticObjectAnnotation) {
      var result = {
        semanticObject: semanticObjectAnnotation.toString(),
        unavailableActions: []
      }; // Look for the unavailable actions (if any)

      var annotationKey = Object.keys(annotations).find(function (key) {
        var _semanticObjectAnnota;

        return annotations[key].term === "com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions" && annotations[key].qualifier === ((_semanticObjectAnnota = semanticObjectAnnotation) === null || _semanticObjectAnnota === void 0 ? void 0 : _semanticObjectAnnota.qualifier);
      });

      if (annotationKey) {
        result.unavailableActions = annotations[annotationKey];
      }

      return result;
    } else {
      return undefined;
    }
  }

  function createKPIDefinition(kpiName, kpiConfig, converterContext) {
    var _datapointAnnotation$, _datapointAnnotation$2;

    var kpiConverterContext = converterContext.getConverterContextFor("/".concat(kpiConfig.entitySet));
    var aggregationHelper = new AggregationHelper(kpiConverterContext.getEntityType(), kpiConverterContext);

    if (!aggregationHelper.isAnalyticsSupported()) {
      // The entity doesn't support analytical queries
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.NO_ANALYTICS + kpiConfig.entitySet);
      return undefined;
    }

    var selectionVariantAnnotation;
    var datapointAnnotation;
    var presentationVariantAnnotation;
    var chartAnnotation;
    var navigationInfo; // Search for a KPI with the qualifier frmo the manifest

    var aKPIAnnotations = kpiConverterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.KPI");
    var targetKPI = aKPIAnnotations.find(function (kpi) {
      return kpi.qualifier === kpiConfig.qualifier;
    });

    if (targetKPI) {
      var _targetKPI$Detail, _presentationVariantA3, _presentationVariantA4, _presentationVariantA5, _targetKPI$Detail2;

      datapointAnnotation = targetKPI.DataPoint;
      selectionVariantAnnotation = targetKPI.SelectionVariant;
      presentationVariantAnnotation = (_targetKPI$Detail = targetKPI.Detail) === null || _targetKPI$Detail === void 0 ? void 0 : _targetKPI$Detail.DefaultPresentationVariant;
      chartAnnotation = (_presentationVariantA3 = presentationVariantAnnotation) === null || _presentationVariantA3 === void 0 ? void 0 : (_presentationVariantA4 = _presentationVariantA3.Visualizations) === null || _presentationVariantA4 === void 0 ? void 0 : (_presentationVariantA5 = _presentationVariantA4.find(function (viz) {
        return viz.$target.$Type === "com.sap.vocabularies.UI.v1.ChartDefinitionType";
      })) === null || _presentationVariantA5 === void 0 ? void 0 : _presentationVariantA5.$target;

      if ((_targetKPI$Detail2 = targetKPI.Detail) !== null && _targetKPI$Detail2 !== void 0 && _targetKPI$Detail2.SemanticObject) {
        var _targetKPI$Detail$Act;

        navigationInfo = {
          semanticObject: targetKPI.Detail.SemanticObject.toString(),
          action: (_targetKPI$Detail$Act = targetKPI.Detail.Action) === null || _targetKPI$Detail$Act === void 0 ? void 0 : _targetKPI$Detail$Act.toString(),
          unavailableActions: []
        };
      }
    } else {
      // Fallback: try to find a SPV with the same qualifier
      var aSPVAnnotations = kpiConverterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant");
      var targetSPV = aSPVAnnotations.find(function (spv) {
        return spv.qualifier === kpiConfig.qualifier;
      });

      if (targetSPV) {
        var _presentationVariantA6, _presentationVariantA7, _presentationVariantA8, _presentationVariantA9, _presentationVariantA10, _presentationVariantA11;

        selectionVariantAnnotation = targetSPV.SelectionVariant;
        presentationVariantAnnotation = targetSPV.PresentationVariant;
        datapointAnnotation = (_presentationVariantA6 = presentationVariantAnnotation) === null || _presentationVariantA6 === void 0 ? void 0 : (_presentationVariantA7 = _presentationVariantA6.Visualizations) === null || _presentationVariantA7 === void 0 ? void 0 : (_presentationVariantA8 = _presentationVariantA7.find(function (viz) {
          return viz.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType";
        })) === null || _presentationVariantA8 === void 0 ? void 0 : _presentationVariantA8.$target;
        chartAnnotation = (_presentationVariantA9 = presentationVariantAnnotation) === null || _presentationVariantA9 === void 0 ? void 0 : (_presentationVariantA10 = _presentationVariantA9.Visualizations) === null || _presentationVariantA10 === void 0 ? void 0 : (_presentationVariantA11 = _presentationVariantA10.find(function (viz) {
          return viz.$target.$Type === "com.sap.vocabularies.UI.v1.ChartDefinitionType";
        })) === null || _presentationVariantA11 === void 0 ? void 0 : _presentationVariantA11.$target;
      } else {
        // Couldn't find a KPI or a SPV annotation with the qualifier from the manifest
        converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.KPI_NOT_FOUND + kpiConfig.qualifier);
        return undefined;
      }
    }

    if (!presentationVariantAnnotation || !datapointAnnotation || !chartAnnotation) {
      // Couldn't find a chart or datapoint definition
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.KPI_DETAIL_NOT_FOUND + kpiConfig.qualifier);
      return undefined;
    }

    var datapointProperty = datapointAnnotation.Value.$target;

    if (!aggregationHelper.isPropertyAggregatable(datapointProperty)) {
      // The main property of the KPI is not aggregatable --> We can't calculate its value so we ignore the KPI
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.MAIN_PROPERTY_NOT_AGGREGATABLE + kpiConfig.qualifier);
      return undefined;
    } // Chart definition


    var chartDef = convertKPIChart(chartAnnotation, presentationVariantAnnotation);

    if (!chartDef) {
      return undefined;
    }

    var kpiDef = {
      id: getKPIID(kpiName),
      entitySet: kpiConfig.entitySet,
      datapoint: {
        propertyPath: datapointAnnotation.Value.path,
        annotationPath: kpiConverterContext.getEntitySetBasedAnnotationPath(datapointAnnotation.fullyQualifiedName),
        title: (_datapointAnnotation$ = datapointAnnotation.Title) === null || _datapointAnnotation$ === void 0 ? void 0 : _datapointAnnotation$.toString(),
        description: (_datapointAnnotation$2 = datapointAnnotation.Description) === null || _datapointAnnotation$2 === void 0 ? void 0 : _datapointAnnotation$2.toString()
      },
      selectionVariantFilterDefinitions: selectionVariantAnnotation ? getFilterDefinitionsFromSelectionVariant(selectionVariantAnnotation) : undefined,
      chart: chartDef
    }; // Navigation

    if (!navigationInfo) {
      // No navigationInfo was found in the KPI annotation --> try the outbound navigation from the manifest
      if (kpiConfig.detailNavigation) {
        navigationInfo = {
          outboundNavigation: kpiConfig.detailNavigation
        };
      } else {
        // No outbound navigation in the manifest --> try the semantic object on the Datapoint value
        navigationInfo = getNavigationInfoFromProperty(datapointProperty);
      }
    }

    if (navigationInfo) {
      kpiDef.navigation = navigationInfo;
    }

    updateCurrency(datapointAnnotation, kpiDef);
    updateCriticality(datapointAnnotation, aggregationHelper, kpiDef);
    updateTrend(datapointAnnotation, aggregationHelper, kpiDef);
    updateTarget(datapointAnnotation, aggregationHelper, kpiDef);
    return kpiDef;
  }
  /**
   * Creates the KPI definitions from the manifest and the annotations.
   *
   * @param converterContext The converter context for the page
   * @returns Returns an array of KPI definitions
   */


  function getKPIDefinitions(converterContext) {
    var kpiConfigs = converterContext.getManifestWrapper().getKPIConfiguration(),
        kpiDefs = [];
    Object.keys(kpiConfigs).forEach(function (kpiName) {
      var oDef = createKPIDefinition(kpiName, kpiConfigs[kpiName], converterContext);

      if (oDef) {
        kpiDefs.push(oDef);
      }
    });
    return kpiDefs;
  }

  _exports.getKPIDefinitions = getKPIDefinitions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEZXZpYXRpb25JbmRpY2F0b3JGcm9tVHJlbmRUeXBlIiwiS1BJQ2hhcnRUeXBlRnJvbVVJIiwiY29udmVydEtQSUNoYXJ0IiwiY2hhcnRBbm5vdGF0aW9uIiwicHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24iLCJNZWFzdXJlcyIsInVuZGVmaW5lZCIsImNoYXJEaW1lbnNpb25zIiwiRGltZW5zaW9ucyIsIm1hcCIsInByb3BlcnR5UGF0aCIsImRpbUF0dHJpYnV0ZSIsIkRpbWVuc2lvbkF0dHJpYnV0ZXMiLCJmaW5kIiwiYXR0cmlidXRlIiwiRGltZW5zaW9uIiwidmFsdWUiLCJuYW1lIiwibGFiZWwiLCIkdGFyZ2V0IiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJMYWJlbCIsInRvU3RyaW5nIiwicm9sZSIsIlJvbGUiLCJyZXBsYWNlIiwiY2hhcnRNZWFzdXJlcyIsIm1lYXN1cmVBdHRyaWJ1dGUiLCJNZWFzdXJlQXR0cmlidXRlcyIsIk1lYXN1cmUiLCJjaGFydFR5cGUiLCJDaGFydFR5cGUiLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJzb3J0T3JkZXIiLCJTb3J0T3JkZXIiLCJQcm9wZXJ0eSIsImRlc2NlbmRpbmciLCJEZXNjZW5kaW5nIiwibWF4SXRlbXMiLCJNYXhJdGVtcyIsInZhbHVlT2YiLCJ1cGRhdGVDdXJyZW5jeSIsImRhdGFwb2ludEFubm90YXRpb24iLCJrcGlEZWYiLCJ0YXJnZXRWYWx1ZVByb3BlcnR5IiwiVmFsdWUiLCJJU09DdXJyZW5jeSIsImN1cnJlbmN5IiwiaXNQYXRoRXhwcmVzc2lvbiIsImRhdGFwb2ludCIsInVuaXQiLCJpc0N1cnJlbmN5IiwiaXNQYXRoIiwiVW5pdCIsInVwZGF0ZUNyaXRpY2FsaXR5IiwiYWdncmVnYXRpb25IZWxwZXIiLCJDcml0aWNhbGl0eSIsImNyaXRpY2FsaXR5UHJvcGVydHkiLCJpc1Byb3BlcnR5QWdncmVnYXRhYmxlIiwiY3JpdGljYWxpdHlQYXRoIiwicGF0aCIsImNyaXRpY2FsaXR5VmFsdWUiLCJNZXNzYWdlVHlwZSIsIk5vbmUiLCJnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUiLCJDcml0aWNhbGl0eUNhbGN1bGF0aW9uIiwiY3JpdGljYWxpdHlDYWxjdWxhdGlvbk1vZGUiLCJJbXByb3ZlbWVudERpcmVjdGlvbiIsImNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzIiwicHVzaCIsIkRldmlhdGlvblJhbmdlTG93VmFsdWUiLCJUb2xlcmFuY2VSYW5nZUxvd1ZhbHVlIiwiQWNjZXB0YW5jZVJhbmdlTG93VmFsdWUiLCJBY2NlcHRhbmNlUmFuZ2VIaWdoVmFsdWUiLCJUb2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZSIsIkRldmlhdGlvblJhbmdlSGlnaFZhbHVlIiwidXBkYXRlVHJlbmQiLCJUcmVuZCIsInRyZW5kUHJvcGVydHkiLCJ0cmVuZFBhdGgiLCJ0cmVuZFZhbHVlIiwiVHJlbmRDYWxjdWxhdGlvbiIsInRyZW5kQ2FsY3VsYXRpb25Jc1JlbGF0aXZlIiwiSXNSZWxhdGl2ZURpZmZlcmVuY2UiLCJSZWZlcmVuY2VWYWx1ZSIsInJlZmVyZW5jZVByb3BlcnR5IiwidHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVBhdGgiLCJ0cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlVmFsdWUiLCJ0cmVuZENhbGN1bGF0aW9uVHJlc2hvbGRzIiwiU3Ryb25nRG93bkRpZmZlcmVuY2UiLCJEb3duRGlmZmVyZW5jZSIsIlVwRGlmZmVyZW5jZSIsIlN0cm9uZ1VwRGlmZmVyZW5jZSIsInVwZGF0ZVRhcmdldCIsIlRhcmdldFZhbHVlIiwidGFyZ2V0UHJvcGVydHkiLCJ0YXJnZXRQYXRoIiwidGFyZ2V0VmFsdWUiLCJnZXROYXZpZ2F0aW9uSW5mb0Zyb21Qcm9wZXJ0eSIsInByb3BlcnR5Iiwic2VtYW50aWNPYmplY3RBbm5vdGF0aW9uIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJhbm5vdGF0aW9uS2V5IiwiYW5ub3RhdGlvbiIsInRlcm0iLCJxdWFsaWZpZXIiLCJyZXN1bHQiLCJzZW1hbnRpY09iamVjdCIsInVuYXZhaWxhYmxlQWN0aW9ucyIsImtleSIsImNyZWF0ZUtQSURlZmluaXRpb24iLCJrcGlOYW1lIiwia3BpQ29uZmlnIiwiY29udmVydGVyQ29udGV4dCIsImtwaUNvbnZlcnRlckNvbnRleHQiLCJnZXRDb252ZXJ0ZXJDb250ZXh0Rm9yIiwiZW50aXR5U2V0IiwiQWdncmVnYXRpb25IZWxwZXIiLCJnZXRFbnRpdHlUeXBlIiwiaXNBbmFseXRpY3NTdXBwb3J0ZWQiLCJnZXREaWFnbm9zdGljcyIsImFkZElzc3VlIiwiSXNzdWVDYXRlZ29yeSIsIkFubm90YXRpb24iLCJJc3N1ZVNldmVyaXR5IiwiTWVkaXVtIiwiSXNzdWVUeXBlIiwiS1BJX0lTU1VFUyIsIk5PX0FOQUxZVElDUyIsInNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uIiwibmF2aWdhdGlvbkluZm8iLCJhS1BJQW5ub3RhdGlvbnMiLCJnZXRBbm5vdGF0aW9uc0J5VGVybSIsInRhcmdldEtQSSIsImtwaSIsIkRhdGFQb2ludCIsIlNlbGVjdGlvblZhcmlhbnQiLCJEZXRhaWwiLCJEZWZhdWx0UHJlc2VudGF0aW9uVmFyaWFudCIsIlZpc3VhbGl6YXRpb25zIiwidml6IiwiJFR5cGUiLCJTZW1hbnRpY09iamVjdCIsImFjdGlvbiIsIkFjdGlvbiIsImFTUFZBbm5vdGF0aW9ucyIsInRhcmdldFNQViIsInNwdiIsIlByZXNlbnRhdGlvblZhcmlhbnQiLCJLUElfTk9UX0ZPVU5EIiwiS1BJX0RFVEFJTF9OT1RfRk9VTkQiLCJkYXRhcG9pbnRQcm9wZXJ0eSIsIk1BSU5fUFJPUEVSVFlfTk9UX0FHR1JFR0FUQUJMRSIsImNoYXJ0RGVmIiwiaWQiLCJnZXRLUElJRCIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInRpdGxlIiwiVGl0bGUiLCJkZXNjcmlwdGlvbiIsIkRlc2NyaXB0aW9uIiwic2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zIiwiZ2V0RmlsdGVyRGVmaW5pdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudCIsImNoYXJ0IiwiZGV0YWlsTmF2aWdhdGlvbiIsIm91dGJvdW5kTmF2aWdhdGlvbiIsIm5hdmlnYXRpb24iLCJnZXRLUElEZWZpbml0aW9ucyIsImtwaUNvbmZpZ3MiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXRLUElDb25maWd1cmF0aW9uIiwia3BpRGVmcyIsIm9EZWYiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIktQSS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFubm90YXRpb25UZXJtLCBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb24sIFByb3BlcnR5LCBQcm9wZXJ0eVBhdGggfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgU2VtYW50aWNPYmplY3QgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NvbW1vblwiO1xuaW1wb3J0IHsgQ29tbW9uQW5ub3RhdGlvblRlcm1zIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tb25cIjtcbmltcG9ydCB0eXBlIHtcblx0Q2hhcnQsXG5cdENyaXRpY2FsaXR5VHlwZSxcblx0RGF0YVBvaW50LFxuXHREYXRhUG9pbnRUeXBlLFxuXHRJbXByb3ZlbWVudERpcmVjdGlvblR5cGUsXG5cdEtQSSxcblx0UHJlc2VudGF0aW9uVmFyaWFudFR5cGUsXG5cdFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQsXG5cdFNlbGVjdGlvblZhcmlhbnRUeXBlLFxuXHRUcmVuZFR5cGVcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHsgVUlBbm5vdGF0aW9uVGVybXMsIFVJQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHR5cGUgQ29udmVydGVyQ29udGV4dCBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5LCBJc3N1ZVNldmVyaXR5LCBJc3N1ZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHR5cGUgeyBGaWx0ZXJEZWZpbml0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9TZWxlY3Rpb25WYXJpYW50SGVscGVyXCI7XG5pbXBvcnQgeyBnZXRGaWx0ZXJEZWZpbml0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9TZWxlY3Rpb25WYXJpYW50SGVscGVyXCI7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL1RhYmxlRm9ybWF0dGVyVHlwZXNcIjtcbmltcG9ydCB7IGlzUGF0aEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Qcm9wZXJ0eUhlbHBlclwiO1xuaW1wb3J0IHsgQWdncmVnYXRpb25IZWxwZXIgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9BZ2dyZWdhdGlvblwiO1xuaW1wb3J0IHsgZ2V0S1BJSUQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9JRFwiO1xuaW1wb3J0IHR5cGUgeyBLUElDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IGdldE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5VHlwZSB9IGZyb20gXCIuL0NyaXRpY2FsaXR5XCI7XG5cbmV4cG9ydCB0eXBlIE5hdmlnYXRpb25JbmZvID0ge1xuXHRzZW1hbnRpY09iamVjdD86IHN0cmluZztcblx0YWN0aW9uPzogc3RyaW5nO1xuXHR1bmF2YWlsYWJsZUFjdGlvbnM/OiBzdHJpbmdbXTtcblx0b3V0Ym91bmROYXZpZ2F0aW9uPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgS1BJQ2hhcnREZWZpbml0aW9uID0ge1xuXHRjaGFydFR5cGU6IHN0cmluZztcblx0ZGltZW5zaW9uczogeyBuYW1lOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJvbGU/OiBzdHJpbmcgfVtdO1xuXHRtZWFzdXJlczogeyBuYW1lOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJvbGU/OiBzdHJpbmcgfVtdO1xuXHRzb3J0T3JkZXI/OiB7IG5hbWU6IHN0cmluZzsgZGVzY2VuZGluZzogYm9vbGVhbiB9W107XG5cdG1heEl0ZW1zPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgS1BJRGVmaW5pdGlvbiA9IHtcblx0aWQ6IHN0cmluZztcblx0ZW50aXR5U2V0OiBzdHJpbmc7XG5cdGRhdGFwb2ludDoge1xuXHRcdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdFx0cHJvcGVydHlQYXRoOiBzdHJpbmc7XG5cdFx0dW5pdD86IHtcblx0XHRcdHZhbHVlOiBzdHJpbmc7XG5cdFx0XHRpc1BhdGg6IGJvb2xlYW47XG5cdFx0XHRpc0N1cnJlbmN5OiBib29sZWFuO1xuXHRcdH07XG5cdFx0Y3JpdGljYWxpdHlQYXRoPzogc3RyaW5nO1xuXHRcdGNyaXRpY2FsaXR5VmFsdWU/OiBNZXNzYWdlVHlwZTtcblx0XHRjcml0aWNhbGl0eUNhbGN1bGF0aW9uTW9kZT86IEltcHJvdmVtZW50RGlyZWN0aW9uVHlwZTtcblx0XHRjcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcz86IChudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsKVtdO1xuXHRcdHRpdGxlPzogc3RyaW5nO1xuXHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXHRcdHRyZW5kUGF0aD86IHN0cmluZztcblx0XHR0cmVuZFZhbHVlPzogc3RyaW5nO1xuXHRcdHRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VWYWx1ZT86IG51bWJlcjtcblx0XHR0cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlUGF0aD86IHN0cmluZztcblx0XHR0cmVuZENhbGN1bGF0aW9uVHJlc2hvbGRzPzogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW107XG5cdFx0dHJlbmRDYWxjdWxhdGlvbklzUmVsYXRpdmU/OiBib29sZWFuO1xuXHRcdHRhcmdldFZhbHVlPzogbnVtYmVyO1xuXHRcdHRhcmdldFBhdGg/OiBzdHJpbmc7XG5cdH07XG5cdGNoYXJ0OiBLUElDaGFydERlZmluaXRpb247XG5cdHNlbGVjdGlvblZhcmlhbnRGaWx0ZXJEZWZpbml0aW9ucz86IEZpbHRlckRlZmluaXRpb25bXTtcblx0bmF2aWdhdGlvbj86IE5hdmlnYXRpb25JbmZvO1xufTtcblxuY29uc3QgRGV2aWF0aW9uSW5kaWNhdG9yRnJvbVRyZW5kVHlwZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcblx0XCJVSS5UcmVuZFR5cGUvU3Ryb25nVXBcIjogXCJVcFwiLFxuXHRcIlVJLlRyZW5kVHlwZS9VcFwiOiBcIlVwXCIsXG5cdFwiVUkuVHJlbmRUeXBlL1N0cm9uZ0Rvd25cIjogXCJEb3duXCIsXG5cdFwiVUkuVHJlbmRUeXBlL0Rvd25cIjogXCJEb3duXCIsXG5cdFwiVUkuVHJlbmRUeXBlL1NpZGV3YXlzXCI6IFwiTm9uZVwiXG59O1xuXG5jb25zdCBLUElDaGFydFR5cGVGcm9tVUk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFwiVUkuQ2hhcnRUeXBlL0NvbHVtblN0YWNrZWRcIjogXCJTdGFja2VkQ29sdW1uXCIsXG5cdFwiVUkuQ2hhcnRUeXBlL0JhclN0YWNrZWRcIjogXCJTdGFja2VkQmFyXCIsXG5cdFwiVUkuQ2hhcnRUeXBlL0RvbnV0XCI6IFwiRG9udXRcIixcblx0XCJVSS5DaGFydFR5cGUvTGluZVwiOiBcIkxpbmVcIixcblx0XCJVSS5DaGFydFR5cGUvQnViYmxlXCI6IFwiYnViYmxlXCIsXG5cdFwiVUkuQ2hhcnRUeXBlL0NvbHVtblwiOiBcImNvbHVtblwiLFxuXHRcIlVJLkNoYXJ0VHlwZS9CYXJcIjogXCJiYXJcIixcblx0XCJVSS5DaGFydFR5cGUvVmVydGljYWxCdWxsZXRcIjogXCJ2ZXJ0aWNhbF9idWxsZXRcIixcblx0XCJVSS5DaGFydFR5cGUvQ29tYmluYXRpb25cIjogXCJjb21iaW5hdGlvblwiLFxuXHRcIlVJLkNoYXJ0VHlwZS9TY2F0dGVyXCI6IFwic2NhdHRlclwiXG59O1xuXG5mdW5jdGlvbiBjb252ZXJ0S1BJQ2hhcnQoY2hhcnRBbm5vdGF0aW9uOiBDaGFydCwgcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb246IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlKTogS1BJQ2hhcnREZWZpbml0aW9uIHwgdW5kZWZpbmVkIHtcblx0aWYgKGNoYXJ0QW5ub3RhdGlvbi5NZWFzdXJlcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Ly8gV2UgbmVlZCBhdCBsZWFzdCAxIG1lYXN1cmUgKGJ1dCBubyBkaW1lbnNpb24gaXMgYWxsb3dlZCwgZS5nLiBmb3IgYnViYmxlIGNoYXJ0KVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHRjb25zdCBjaGFyRGltZW5zaW9ucyA9IGNoYXJ0QW5ub3RhdGlvbi5EaW1lbnNpb25zXG5cdFx0PyBjaGFydEFubm90YXRpb24uRGltZW5zaW9ucy5tYXAoKHByb3BlcnR5UGF0aCkgPT4ge1xuXHRcdFx0XHRjb25zdCBkaW1BdHRyaWJ1dGUgPSBjaGFydEFubm90YXRpb24uRGltZW5zaW9uQXR0cmlidXRlcz8uZmluZCgoYXR0cmlidXRlKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZS5EaW1lbnNpb24/LnZhbHVlID09PSBwcm9wZXJ0eVBhdGgudmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdG5hbWU6IHByb3BlcnR5UGF0aC52YWx1ZSxcblx0XHRcdFx0XHRsYWJlbDogcHJvcGVydHlQYXRoLiR0YXJnZXQuYW5ub3RhdGlvbnMuQ29tbW9uPy5MYWJlbD8udG9TdHJpbmcoKSB8fCBwcm9wZXJ0eVBhdGgudmFsdWUsXG5cdFx0XHRcdFx0cm9sZTogZGltQXR0cmlidXRlPy5Sb2xlPy5yZXBsYWNlKFwiVUkuQ2hhcnREaW1lbnNpb25Sb2xlVHlwZS9cIiwgXCJcIilcblx0XHRcdFx0fTtcblx0XHQgIH0pXG5cdFx0OiBbXTtcblxuXHRjb25zdCBjaGFydE1lYXN1cmVzID0gY2hhcnRBbm5vdGF0aW9uLk1lYXN1cmVzLm1hcCgocHJvcGVydHlQYXRoKSA9PiB7XG5cdFx0Y29uc3QgbWVhc3VyZUF0dHJpYnV0ZSA9IGNoYXJ0QW5ub3RhdGlvbi5NZWFzdXJlQXR0cmlidXRlcz8uZmluZCgoYXR0cmlidXRlKSA9PiB7XG5cdFx0XHRyZXR1cm4gYXR0cmlidXRlLk1lYXN1cmU/LnZhbHVlID09PSBwcm9wZXJ0eVBhdGgudmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6IHByb3BlcnR5UGF0aC52YWx1ZSxcblx0XHRcdGxhYmVsOiBwcm9wZXJ0eVBhdGguJHRhcmdldC5hbm5vdGF0aW9ucy5Db21tb24/LkxhYmVsPy50b1N0cmluZygpIHx8IHByb3BlcnR5UGF0aC52YWx1ZSxcblx0XHRcdHJvbGU6IG1lYXN1cmVBdHRyaWJ1dGU/LlJvbGU/LnJlcGxhY2UoXCJVSS5DaGFydE1lYXN1cmVSb2xlVHlwZS9cIiwgXCJcIilcblx0XHR9O1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdGNoYXJ0VHlwZTogS1BJQ2hhcnRUeXBlRnJvbVVJW2NoYXJ0QW5ub3RhdGlvbi5DaGFydFR5cGVdIHx8IFwiTGluZVwiLFxuXHRcdGRpbWVuc2lvbnM6IGNoYXJEaW1lbnNpb25zLFxuXHRcdG1lYXN1cmVzOiBjaGFydE1lYXN1cmVzLFxuXHRcdHNvcnRPcmRlcjogcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/LlNvcnRPcmRlcj8ubWFwKChzb3J0T3JkZXIpID0+IHtcblx0XHRcdHJldHVybiB7IG5hbWU6IHNvcnRPcmRlci5Qcm9wZXJ0eT8udmFsdWUgfHwgXCJcIiwgZGVzY2VuZGluZzogISFzb3J0T3JkZXIuRGVzY2VuZGluZyB9O1xuXHRcdH0pLFxuXHRcdG1heEl0ZW1zOiBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uTWF4SXRlbXM/LnZhbHVlT2YoKSBhcyBudW1iZXJcblx0fTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ3VycmVuY3koZGF0YXBvaW50QW5ub3RhdGlvbjogRGF0YVBvaW50VHlwZSwga3BpRGVmOiBLUElEZWZpbml0aW9uKTogdm9pZCB7XG5cdGNvbnN0IHRhcmdldFZhbHVlUHJvcGVydHkgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlZhbHVlLiR0YXJnZXQgYXMgUHJvcGVydHk7XG5cdGlmICh0YXJnZXRWYWx1ZVByb3BlcnR5LmFubm90YXRpb25zLk1lYXN1cmVzPy5JU09DdXJyZW5jeSkge1xuXHRcdGNvbnN0IGN1cnJlbmN5ID0gdGFyZ2V0VmFsdWVQcm9wZXJ0eS5hbm5vdGF0aW9ucy5NZWFzdXJlcz8uSVNPQ3VycmVuY3k7XG5cdFx0aWYgKGlzUGF0aEV4cHJlc3Npb24oY3VycmVuY3kpKSB7XG5cdFx0XHRrcGlEZWYuZGF0YXBvaW50LnVuaXQgPSB7XG5cdFx0XHRcdHZhbHVlOiAoY3VycmVuY3kuJHRhcmdldCBhcyB1bmtub3duIGFzIFByb3BlcnR5KS5uYW1lLFxuXHRcdFx0XHRpc0N1cnJlbmN5OiB0cnVlLFxuXHRcdFx0XHRpc1BhdGg6IHRydWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudW5pdCA9IHtcblx0XHRcdFx0dmFsdWU6IGN1cnJlbmN5LnRvU3RyaW5nKCksXG5cdFx0XHRcdGlzQ3VycmVuY3k6IHRydWUsXG5cdFx0XHRcdGlzUGF0aDogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHRhcmdldFZhbHVlUHJvcGVydHkuYW5ub3RhdGlvbnMuTWVhc3VyZXM/LlVuaXQpIHtcblx0XHRjb25zdCB1bml0ID0gdGFyZ2V0VmFsdWVQcm9wZXJ0eS5hbm5vdGF0aW9ucy5NZWFzdXJlcz8uVW5pdDtcblx0XHRpZiAoaXNQYXRoRXhwcmVzc2lvbih1bml0KSkge1xuXHRcdFx0a3BpRGVmLmRhdGFwb2ludC51bml0ID0ge1xuXHRcdFx0XHR2YWx1ZTogKHVuaXQuJHRhcmdldCBhcyB1bmtub3duIGFzIFByb3BlcnR5KS5uYW1lLFxuXHRcdFx0XHRpc0N1cnJlbmN5OiBmYWxzZSxcblx0XHRcdFx0aXNQYXRoOiB0cnVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRrcGlEZWYuZGF0YXBvaW50LnVuaXQgPSB7XG5cdFx0XHRcdHZhbHVlOiB1bml0LnRvU3RyaW5nKCksXG5cdFx0XHRcdGlzQ3VycmVuY3k6IGZhbHNlLFxuXHRcdFx0XHRpc1BhdGg6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDcml0aWNhbGl0eShkYXRhcG9pbnRBbm5vdGF0aW9uOiBEYXRhUG9pbnRUeXBlLCBhZ2dyZWdhdGlvbkhlbHBlcjogQWdncmVnYXRpb25IZWxwZXIsIGtwaURlZjogS1BJRGVmaW5pdGlvbik6IHZvaWQge1xuXHRpZiAoZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eSkge1xuXHRcdGlmICh0eXBlb2YgZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gQ3JpdGljYWxpdHkgaXMgYSBwYXRoIC0tPiBjaGVjayBpZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBpcyBhZ2dyZWdhdGFibGVcblx0XHRcdGNvbnN0IGNyaXRpY2FsaXR5UHJvcGVydHkgPSAoZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eSBhcyBhbnkgYXMgUHJvcGVydHlQYXRoKS4kdGFyZ2V0O1xuXHRcdFx0aWYgKGFnZ3JlZ2F0aW9uSGVscGVyLmlzUHJvcGVydHlBZ2dyZWdhdGFibGUoY3JpdGljYWxpdHlQcm9wZXJ0eSkpIHtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eVBhdGggPSAoZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eSBhcyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248Q3JpdGljYWxpdHlUeXBlPikucGF0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRoZSBwcm9wZXJ0eSBpc24ndCBhZ2dyZWdhdGFibGUgLS0+IHdlIGlnbm9yZSBpdFxuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5VmFsdWUgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBDcml0aWNhbGl0eSBpcyBhbiBlbnVtIFZhbHVlIC0tPiBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RhdGljIHZhbHVlXG5cdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5VmFsdWUgPSBnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUoZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eSk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbikge1xuXHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvbk1vZGUgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uSW1wcm92ZW1lbnREaXJlY3Rpb247XG5cdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcyA9IFtdO1xuXHRcdHN3aXRjaCAoa3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uTW9kZSkge1xuXHRcdFx0Y2FzZSBcIlVJLkltcHJvdmVtZW50RGlyZWN0aW9uVHlwZS9UYXJnZXRcIjpcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5EZXZpYXRpb25SYW5nZUxvd1ZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5Ub2xlcmFuY2VSYW5nZUxvd1ZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5BY2NlcHRhbmNlUmFuZ2VMb3dWYWx1ZSk7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5Ub2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZSk7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uRGV2aWF0aW9uUmFuZ2VIaWdoVmFsdWUpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIlVJLkltcHJvdmVtZW50RGlyZWN0aW9uVHlwZS9NaW5pbWl6ZVwiOlxuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzLnB1c2goZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkFjY2VwdGFuY2VSYW5nZUhpZ2hWYWx1ZSk7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uVG9sZXJhbmNlUmFuZ2VIaWdoVmFsdWUpO1xuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzLnB1c2goZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkRldmlhdGlvblJhbmdlSGlnaFZhbHVlKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJVSS5JbXByb3ZlbWVudERpcmVjdGlvblR5cGUvTWF4aW1pemVcIjpcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uRGV2aWF0aW9uUmFuZ2VMb3dWYWx1ZSk7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uVG9sZXJhbmNlUmFuZ2VMb3dWYWx1ZSk7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uQWNjZXB0YW5jZVJhbmdlTG93VmFsdWUpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5VmFsdWUgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRyZW5kKGRhdGFwb2ludEFubm90YXRpb246IERhdGFQb2ludFR5cGUsIGFnZ3JlZ2F0aW9uSGVscGVyOiBBZ2dyZWdhdGlvbkhlbHBlciwga3BpRGVmOiBLUElEZWZpbml0aW9uKTogdm9pZCB7XG5cdGlmIChkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kKSB7XG5cdFx0aWYgKHR5cGVvZiBkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHQvLyBUcmVuZCBpcyBhIHBhdGggLS0+IGNoZWNrIGlmIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IGlzIGFnZ3JlZ2F0YWJsZVxuXHRcdFx0Y29uc3QgdHJlbmRQcm9wZXJ0eSA9IChkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kIGFzIGFueSBhcyBQcm9wZXJ0eVBhdGgpLiR0YXJnZXQ7XG5cdFx0XHRpZiAoYWdncmVnYXRpb25IZWxwZXIuaXNQcm9wZXJ0eUFnZ3JlZ2F0YWJsZSh0cmVuZFByb3BlcnR5KSkge1xuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LnRyZW5kUGF0aCA9IChkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kIGFzIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxUcmVuZFR5cGU+KS5wYXRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVGhlIHByb3BlcnR5IGlzbid0IGFnZ3JlZ2F0YWJsZSAtLT4gd2UgaWdub3JlIGl0XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRWYWx1ZSA9IFwiTm9uZVwiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUcmVuZCBpcyBhbiBlbnVtIFZhbHVlIC0tPiBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RhdGljIHZhbHVlXG5cdFx0XHRrcGlEZWYuZGF0YXBvaW50LnRyZW5kVmFsdWUgPSBEZXZpYXRpb25JbmRpY2F0b3JGcm9tVHJlbmRUeXBlW2RhdGFwb2ludEFubm90YXRpb24uVHJlbmRdIHx8IFwiTm9uZVwiO1xuXHRcdH1cblx0fSBlbHNlIGlmIChkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24pIHtcblx0XHRrcGlEZWYuZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25Jc1JlbGF0aXZlID0gZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZENhbGN1bGF0aW9uLklzUmVsYXRpdmVEaWZmZXJlbmNlID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdGlmIChkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24uUmVmZXJlbmNlVmFsdWUuJHRhcmdldCkge1xuXHRcdFx0Ly8gUmVmZXJlbmNlIHZhbHVlIGlzIGEgcGF0aCAtLT4gY2hlY2sgaWYgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgaXMgYWdncmVnYXRhYmxlXG5cdFx0XHRjb25zdCByZWZlcmVuY2VQcm9wZXJ0eSA9IGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbi5SZWZlcmVuY2VWYWx1ZS4kdGFyZ2V0IGFzIFByb3BlcnR5O1xuXHRcdFx0aWYgKGFnZ3JlZ2F0aW9uSGVscGVyLmlzUHJvcGVydHlBZ2dyZWdhdGFibGUocmVmZXJlbmNlUHJvcGVydHkpKSB7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVBhdGggPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24uUmVmZXJlbmNlVmFsdWUucGF0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRoZSBwcm9wZXJ0eSBpc24ndCBhZ2dyZWdhdGFibGUgLS0+IHdlIGlnbm9yZSBpdCBhbmQgc3dpdGNoIGJhY2sgdG8gdHJlbmQgJ05vbmUnXG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRWYWx1ZSA9IFwiTm9uZVwiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBSZWZlcmVuY2UgdmFsdWUgaXMgYSBzdGF0aWMgdmFsdWVcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVZhbHVlID0gZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZENhbGN1bGF0aW9uLlJlZmVyZW5jZVZhbHVlO1xuXHRcdH1cblx0XHRpZiAoa3BpRGVmLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlUGF0aCAhPT0gdW5kZWZpbmVkIHx8IGtwaURlZi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblRyZXNob2xkcyA9IFtcblx0XHRcdFx0ZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZENhbGN1bGF0aW9uLlN0cm9uZ0Rvd25EaWZmZXJlbmNlLnZhbHVlT2YoKSBhcyBudW1iZXIsXG5cdFx0XHRcdGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbi5Eb3duRGlmZmVyZW5jZS52YWx1ZU9mKCkgYXMgbnVtYmVyLFxuXHRcdFx0XHRkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24uVXBEaWZmZXJlbmNlLnZhbHVlT2YoKSBhcyBudW1iZXIsXG5cdFx0XHRcdGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbi5TdHJvbmdVcERpZmZlcmVuY2UudmFsdWVPZigpIGFzIG51bWJlclxuXHRcdFx0XTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0a3BpRGVmLmRhdGFwb2ludC50cmVuZFZhbHVlID0gXCJOb25lXCI7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGFyZ2V0KGRhdGFwb2ludEFubm90YXRpb246IERhdGFQb2ludFR5cGUsIGFnZ3JlZ2F0aW9uSGVscGVyOiBBZ2dyZWdhdGlvbkhlbHBlciwga3BpRGVmOiBLUElEZWZpbml0aW9uKTogdm9pZCB7XG5cdGlmIChkYXRhcG9pbnRBbm5vdGF0aW9uLlRhcmdldFZhbHVlKSB7XG5cdFx0aWYgKGRhdGFwb2ludEFubm90YXRpb24uVGFyZ2V0VmFsdWUuJHRhcmdldCkge1xuXHRcdFx0Ly8gVGFyZ2V0IHZhbHVlIGlzIGEgcGF0aCAtLT4gY2hlY2sgaWYgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgaXMgYWdncmVnYXRhYmxlIChvdGhlcndpc2UgaWdub3JlKVxuXHRcdFx0Y29uc3QgdGFyZ2V0UHJvcGVydHkgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlRhcmdldFZhbHVlLiR0YXJnZXQgYXMgUHJvcGVydHk7XG5cdFx0XHRpZiAoYWdncmVnYXRpb25IZWxwZXIuaXNQcm9wZXJ0eUFnZ3JlZ2F0YWJsZSh0YXJnZXRQcm9wZXJ0eSkpIHtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC50YXJnZXRQYXRoID0gZGF0YXBvaW50QW5ub3RhdGlvbi5UYXJnZXRWYWx1ZS5wYXRoO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUYXJnZXQgdmFsdWUgaXMgYSBzdGF0aWMgdmFsdWVcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudGFyZ2V0VmFsdWUgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlRhcmdldFZhbHVlO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBnZXROYXZpZ2F0aW9uSW5mb0Zyb21Qcm9wZXJ0eShwcm9wZXJ0eTogUHJvcGVydHkpOiBOYXZpZ2F0aW9uSW5mbyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IGFubm90YXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBBbm5vdGF0aW9uVGVybTxhbnk+PiA9IHByb3BlcnR5LmFubm90YXRpb25zW1wiQ29tbW9uXCJdIHx8IHt9O1xuXG5cdC8vIExvb2sgZm9yIHRoZSBzZW1hbnRpY09iamVjdCBhbm5vdGF0aW9uIChpZiBhbnkpXG5cdGxldCBzZW1hbnRpY09iamVjdEFubm90YXRpb246IFNlbWFudGljT2JqZWN0IHwgdW5kZWZpbmVkO1xuXHRPYmplY3Qua2V5cyhhbm5vdGF0aW9ucykuZm9yRWFjaCgoYW5ub3RhdGlvbktleSkgPT4ge1xuXHRcdGNvbnN0IGFubm90YXRpb24gPSBhbm5vdGF0aW9uc1thbm5vdGF0aW9uS2V5XTtcblx0XHRpZiAoYW5ub3RhdGlvbi50ZXJtID09PSBDb21tb25Bbm5vdGF0aW9uVGVybXMuU2VtYW50aWNPYmplY3QpIHtcblx0XHRcdGlmICghYW5ub3RhdGlvbi5xdWFsaWZpZXIgfHwgIXNlbWFudGljT2JqZWN0QW5ub3RhdGlvbikge1xuXHRcdFx0XHQvLyBXZSBhbHdheXMgdGFrZSB0aGUgYW5ub3RhdGlvbiB3aXRob3V0IHF1YWxpZmllciBpZiB0aGVyZSdzIG9uZSwgb3RoZXJ3aXNlIHdlIHRha2UgdGhlIGZpcnN0IG9uZVxuXHRcdFx0XHRzZW1hbnRpY09iamVjdEFubm90YXRpb24gPSBhbm5vdGF0aW9uO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0aWYgKHNlbWFudGljT2JqZWN0QW5ub3RhdGlvbikge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHtcblx0XHRcdHNlbWFudGljT2JqZWN0OiBzZW1hbnRpY09iamVjdEFubm90YXRpb24udG9TdHJpbmcoKSxcblx0XHRcdHVuYXZhaWxhYmxlQWN0aW9uczogW11cblx0XHR9O1xuXG5cdFx0Ly8gTG9vayBmb3IgdGhlIHVuYXZhaWxhYmxlIGFjdGlvbnMgKGlmIGFueSlcblx0XHRjb25zdCBhbm5vdGF0aW9uS2V5ID0gT2JqZWN0LmtleXMoYW5ub3RhdGlvbnMpLmZpbmQoKGtleSkgPT4ge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YW5ub3RhdGlvbnNba2V5XS50ZXJtID09PSBDb21tb25Bbm5vdGF0aW9uVGVybXMuU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMgJiZcblx0XHRcdFx0YW5ub3RhdGlvbnNba2V5XS5xdWFsaWZpZXIgPT09IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvbj8ucXVhbGlmaWVyXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHRcdGlmIChhbm5vdGF0aW9uS2V5KSB7XG5cdFx0XHRyZXN1bHQudW5hdmFpbGFibGVBY3Rpb25zID0gYW5ub3RhdGlvbnNbYW5ub3RhdGlvbktleV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUtQSURlZmluaXRpb24oa3BpTmFtZTogc3RyaW5nLCBrcGlDb25maWc6IEtQSUNvbmZpZ3VyYXRpb24sIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBLUElEZWZpbml0aW9uIHwgdW5kZWZpbmVkIHtcblx0Y29uc3Qga3BpQ29udmVydGVyQ29udGV4dCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihgLyR7a3BpQ29uZmlnLmVudGl0eVNldH1gKTtcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoa3BpQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIGtwaUNvbnZlcnRlckNvbnRleHQpO1xuXG5cdGlmICghYWdncmVnYXRpb25IZWxwZXIuaXNBbmFseXRpY3NTdXBwb3J0ZWQoKSkge1xuXHRcdC8vIFRoZSBlbnRpdHkgZG9lc24ndCBzdXBwb3J0IGFuYWx5dGljYWwgcXVlcmllc1xuXHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHQuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5Lk1lZGl1bSwgSXNzdWVUeXBlLktQSV9JU1NVRVMuTk9fQU5BTFlUSUNTICsga3BpQ29uZmlnLmVudGl0eVNldCk7XG5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0bGV0IHNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uOiBTZWxlY3Rpb25WYXJpYW50VHlwZSB8IHVuZGVmaW5lZDtcblx0bGV0IGRhdGFwb2ludEFubm90YXRpb246IERhdGFQb2ludFR5cGUgfCB1bmRlZmluZWQ7XG5cdGxldCBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbjogUHJlc2VudGF0aW9uVmFyaWFudFR5cGUgfCB1bmRlZmluZWQ7XG5cdGxldCBjaGFydEFubm90YXRpb246IENoYXJ0IHwgdW5kZWZpbmVkO1xuXHRsZXQgbmF2aWdhdGlvbkluZm86IE5hdmlnYXRpb25JbmZvIHwgdW5kZWZpbmVkO1xuXG5cdC8vIFNlYXJjaCBmb3IgYSBLUEkgd2l0aCB0aGUgcXVhbGlmaWVyIGZybW8gdGhlIG1hbmlmZXN0XG5cdGNvbnN0IGFLUElBbm5vdGF0aW9ucyA9IGtwaUNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXCJVSVwiLCBVSUFubm90YXRpb25UZXJtcy5LUEkpIGFzIEtQSVtdO1xuXHRjb25zdCB0YXJnZXRLUEkgPSBhS1BJQW5ub3RhdGlvbnMuZmluZCgoa3BpKSA9PiB7XG5cdFx0cmV0dXJuIGtwaS5xdWFsaWZpZXIgPT09IGtwaUNvbmZpZy5xdWFsaWZpZXI7XG5cdH0pO1xuXHRpZiAodGFyZ2V0S1BJKSB7XG5cdFx0ZGF0YXBvaW50QW5ub3RhdGlvbiA9IHRhcmdldEtQSS5EYXRhUG9pbnQ7XG5cdFx0c2VsZWN0aW9uVmFyaWFudEFubm90YXRpb24gPSB0YXJnZXRLUEkuU2VsZWN0aW9uVmFyaWFudDtcblx0XHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiA9IHRhcmdldEtQSS5EZXRhaWw/LkRlZmF1bHRQcmVzZW50YXRpb25WYXJpYW50O1xuXHRcdGNoYXJ0QW5ub3RhdGlvbiA9IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5WaXN1YWxpemF0aW9ucz8uZmluZCgodml6OiBhbnkpID0+IHtcblx0XHRcdHJldHVybiB2aXouJHRhcmdldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ2hhcnREZWZpbml0aW9uVHlwZTtcblx0XHR9KT8uJHRhcmdldCBhcyBDaGFydDtcblxuXHRcdGlmICh0YXJnZXRLUEkuRGV0YWlsPy5TZW1hbnRpY09iamVjdCkge1xuXHRcdFx0bmF2aWdhdGlvbkluZm8gPSB7XG5cdFx0XHRcdHNlbWFudGljT2JqZWN0OiB0YXJnZXRLUEkuRGV0YWlsLlNlbWFudGljT2JqZWN0LnRvU3RyaW5nKCksXG5cdFx0XHRcdGFjdGlvbjogdGFyZ2V0S1BJLkRldGFpbC5BY3Rpb24/LnRvU3RyaW5nKCksXG5cdFx0XHRcdHVuYXZhaWxhYmxlQWN0aW9uczogW11cblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIEZhbGxiYWNrOiB0cnkgdG8gZmluZCBhIFNQViB3aXRoIHRoZSBzYW1lIHF1YWxpZmllclxuXHRcdGNvbnN0IGFTUFZBbm5vdGF0aW9ucyA9IGtwaUNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXG5cdFx0XHRcIlVJXCIsXG5cdFx0XHRVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50XG5cdFx0KSBhcyBTZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50W107XG5cdFx0Y29uc3QgdGFyZ2V0U1BWID0gYVNQVkFubm90YXRpb25zLmZpbmQoKHNwdikgPT4ge1xuXHRcdFx0cmV0dXJuIHNwdi5xdWFsaWZpZXIgPT09IGtwaUNvbmZpZy5xdWFsaWZpZXI7XG5cdFx0fSk7XG5cdFx0aWYgKHRhcmdldFNQVikge1xuXHRcdFx0c2VsZWN0aW9uVmFyaWFudEFubm90YXRpb24gPSB0YXJnZXRTUFYuU2VsZWN0aW9uVmFyaWFudDtcblx0XHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uID0gdGFyZ2V0U1BWLlByZXNlbnRhdGlvblZhcmlhbnQ7XG5cdFx0XHRkYXRhcG9pbnRBbm5vdGF0aW9uID0gcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/LlZpc3VhbGl6YXRpb25zPy5maW5kKCh2aXo6IGFueSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdml6LiR0YXJnZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGU7XG5cdFx0XHR9KT8uJHRhcmdldCBhcyBEYXRhUG9pbnQ7XG5cdFx0XHRjaGFydEFubm90YXRpb24gPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uVmlzdWFsaXphdGlvbnM/LmZpbmQoKHZpejogYW55KSA9PiB7XG5cdFx0XHRcdHJldHVybiB2aXouJHRhcmdldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ2hhcnREZWZpbml0aW9uVHlwZTtcblx0XHRcdH0pPy4kdGFyZ2V0IGFzIENoYXJ0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBDb3VsZG4ndCBmaW5kIGEgS1BJIG9yIGEgU1BWIGFubm90YXRpb24gd2l0aCB0aGUgcXVhbGlmaWVyIGZyb20gdGhlIG1hbmlmZXN0XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuTWVkaXVtLCBJc3N1ZVR5cGUuS1BJX0lTU1VFUy5LUElfTk9UX0ZPVU5EICsga3BpQ29uZmlnLnF1YWxpZmllcik7XG5cblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiB8fCAhZGF0YXBvaW50QW5ub3RhdGlvbiB8fCAhY2hhcnRBbm5vdGF0aW9uKSB7XG5cdFx0Ly8gQ291bGRuJ3QgZmluZCBhIGNoYXJ0IG9yIGRhdGFwb2ludCBkZWZpbml0aW9uXG5cdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuTWVkaXVtLCBJc3N1ZVR5cGUuS1BJX0lTU1VFUy5LUElfREVUQUlMX05PVF9GT1VORCArIGtwaUNvbmZpZy5xdWFsaWZpZXIpO1xuXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGNvbnN0IGRhdGFwb2ludFByb3BlcnR5ID0gZGF0YXBvaW50QW5ub3RhdGlvbi5WYWx1ZS4kdGFyZ2V0IGFzIFByb3BlcnR5O1xuXHRpZiAoIWFnZ3JlZ2F0aW9uSGVscGVyLmlzUHJvcGVydHlBZ2dyZWdhdGFibGUoZGF0YXBvaW50UHJvcGVydHkpKSB7XG5cdFx0Ly8gVGhlIG1haW4gcHJvcGVydHkgb2YgdGhlIEtQSSBpcyBub3QgYWdncmVnYXRhYmxlIC0tPiBXZSBjYW4ndCBjYWxjdWxhdGUgaXRzIHZhbHVlIHNvIHdlIGlnbm9yZSB0aGUgS1BJXG5cdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdC5hZGRJc3N1ZShcblx0XHRcdFx0SXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRJc3N1ZVNldmVyaXR5Lk1lZGl1bSxcblx0XHRcdFx0SXNzdWVUeXBlLktQSV9JU1NVRVMuTUFJTl9QUk9QRVJUWV9OT1RfQUdHUkVHQVRBQkxFICsga3BpQ29uZmlnLnF1YWxpZmllclxuXHRcdFx0KTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gQ2hhcnQgZGVmaW5pdGlvblxuXHRjb25zdCBjaGFydERlZiA9IGNvbnZlcnRLUElDaGFydChjaGFydEFubm90YXRpb24sIHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uKTtcblx0aWYgKCFjaGFydERlZikge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHRjb25zdCBrcGlEZWY6IEtQSURlZmluaXRpb24gPSB7XG5cdFx0aWQ6IGdldEtQSUlEKGtwaU5hbWUpLFxuXHRcdGVudGl0eVNldDoga3BpQ29uZmlnLmVudGl0eVNldCxcblx0XHRkYXRhcG9pbnQ6IHtcblx0XHRcdHByb3BlcnR5UGF0aDogZGF0YXBvaW50QW5ub3RhdGlvbi5WYWx1ZS5wYXRoLFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IGtwaUNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhcG9pbnRBbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHR0aXRsZTogZGF0YXBvaW50QW5ub3RhdGlvbi5UaXRsZT8udG9TdHJpbmcoKSxcblx0XHRcdGRlc2NyaXB0aW9uOiBkYXRhcG9pbnRBbm5vdGF0aW9uLkRlc2NyaXB0aW9uPy50b1N0cmluZygpXG5cdFx0fSxcblx0XHRzZWxlY3Rpb25WYXJpYW50RmlsdGVyRGVmaW5pdGlvbnM6IHNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uXG5cdFx0XHQ/IGdldEZpbHRlckRlZmluaXRpb25zRnJvbVNlbGVjdGlvblZhcmlhbnQoc2VsZWN0aW9uVmFyaWFudEFubm90YXRpb24pXG5cdFx0XHQ6IHVuZGVmaW5lZCxcblx0XHRjaGFydDogY2hhcnREZWZcblx0fTtcblxuXHQvLyBOYXZpZ2F0aW9uXG5cdGlmICghbmF2aWdhdGlvbkluZm8pIHtcblx0XHQvLyBObyBuYXZpZ2F0aW9uSW5mbyB3YXMgZm91bmQgaW4gdGhlIEtQSSBhbm5vdGF0aW9uIC0tPiB0cnkgdGhlIG91dGJvdW5kIG5hdmlnYXRpb24gZnJvbSB0aGUgbWFuaWZlc3Rcblx0XHRpZiAoa3BpQ29uZmlnLmRldGFpbE5hdmlnYXRpb24pIHtcblx0XHRcdG5hdmlnYXRpb25JbmZvID0ge1xuXHRcdFx0XHRvdXRib3VuZE5hdmlnYXRpb246IGtwaUNvbmZpZy5kZXRhaWxOYXZpZ2F0aW9uXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBObyBvdXRib3VuZCBuYXZpZ2F0aW9uIGluIHRoZSBtYW5pZmVzdCAtLT4gdHJ5IHRoZSBzZW1hbnRpYyBvYmplY3Qgb24gdGhlIERhdGFwb2ludCB2YWx1ZVxuXHRcdFx0bmF2aWdhdGlvbkluZm8gPSBnZXROYXZpZ2F0aW9uSW5mb0Zyb21Qcm9wZXJ0eShkYXRhcG9pbnRQcm9wZXJ0eSk7XG5cdFx0fVxuXHR9XG5cdGlmIChuYXZpZ2F0aW9uSW5mbykge1xuXHRcdGtwaURlZi5uYXZpZ2F0aW9uID0gbmF2aWdhdGlvbkluZm87XG5cdH1cblxuXHR1cGRhdGVDdXJyZW5jeShkYXRhcG9pbnRBbm5vdGF0aW9uLCBrcGlEZWYpO1xuXHR1cGRhdGVDcml0aWNhbGl0eShkYXRhcG9pbnRBbm5vdGF0aW9uLCBhZ2dyZWdhdGlvbkhlbHBlciwga3BpRGVmKTtcblx0dXBkYXRlVHJlbmQoZGF0YXBvaW50QW5ub3RhdGlvbiwgYWdncmVnYXRpb25IZWxwZXIsIGtwaURlZik7XG5cdHVwZGF0ZVRhcmdldChkYXRhcG9pbnRBbm5vdGF0aW9uLCBhZ2dyZWdhdGlvbkhlbHBlciwga3BpRGVmKTtcblxuXHRyZXR1cm4ga3BpRGVmO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIEtQSSBkZWZpbml0aW9ucyBmcm9tIHRoZSBtYW5pZmVzdCBhbmQgdGhlIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dCBmb3IgdGhlIHBhZ2VcbiAqIEByZXR1cm5zIFJldHVybnMgYW4gYXJyYXkgb2YgS1BJIGRlZmluaXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRLUElEZWZpbml0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogS1BJRGVmaW5pdGlvbltdIHtcblx0Y29uc3Qga3BpQ29uZmlncyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0S1BJQ29uZmlndXJhdGlvbigpLFxuXHRcdGtwaURlZnM6IEtQSURlZmluaXRpb25bXSA9IFtdO1xuXG5cdE9iamVjdC5rZXlzKGtwaUNvbmZpZ3MpLmZvckVhY2goKGtwaU5hbWUpID0+IHtcblx0XHRjb25zdCBvRGVmID0gY3JlYXRlS1BJRGVmaW5pdGlvbihrcGlOYW1lLCBrcGlDb25maWdzW2twaU5hbWVdLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRpZiAob0RlZikge1xuXHRcdFx0a3BpRGVmcy5wdXNoKG9EZWYpO1xuXHRcdH1cblx0fSk7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