/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/Aggregation", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/FilterTemplating"], function (Aggregation, IssueManager, BindingToolkit, ModelHelper, DataModelPathHelper, FilterTemplating) {
  "use strict";

  var _exports = {};
  var isPropertyFilterable = FilterTemplating.isPropertyFilterable;
  var getIsRequired = FilterTemplating.getIsRequired;
  var checkFilterExpressionRestrictions = DataModelPathHelper.checkFilterExpressionRestrictions;
  var compileExpression = BindingToolkit.compileExpression;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var AggregationHelper = Aggregation.AggregationHelper;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * Checks that measures and dimensions of the visual filter chart can be aggregated and grouped.
   *
   * @param converterContext The converter context
   * @param chartAnnotation The chart annotation
   * @param aggregationHelper The aggregation helper
   * @returns `true` if the measure can be grouped and aggregated
   */
  var _checkVFAggregation = function (converterContext, chartAnnotation, aggregationHelper) {
    var _chartAnnotation$$tar, _chartAnnotation$$tar8, _chartAnnotation$$tar11, _chartAnnotation$$tar12;

    var sMeasurePath, bGroupable, bAggregatable;
    var sMeasure;
    var customAggregates = aggregationHelper.getCustomAggregateDefinitions();
    var aTransAggregations = aggregationHelper.getTransAggregations();
    var aCustAggMeasure = []; // if the chart definition has custom aggregates, then consider them, else fall back to the measures with transformation aggregates

    if (chartAnnotation !== null && chartAnnotation !== void 0 && (_chartAnnotation$$tar = chartAnnotation.$target) !== null && _chartAnnotation$$tar !== void 0 && _chartAnnotation$$tar.Measures) {
      var _chartAnnotation$$tar5, _chartAnnotation$$tar6, _chartAnnotation$$tar7;

      aCustAggMeasure = customAggregates.filter(function (custAgg) {
        var _chartAnnotation$$tar2, _chartAnnotation$$tar3, _chartAnnotation$$tar4;

        return custAgg.qualifier === (chartAnnotation === null || chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar2 = chartAnnotation.$target) === null || _chartAnnotation$$tar2 === void 0 ? void 0 : (_chartAnnotation$$tar3 = _chartAnnotation$$tar2.Measures) === null || _chartAnnotation$$tar3 === void 0 ? void 0 : (_chartAnnotation$$tar4 = _chartAnnotation$$tar3[0]) === null || _chartAnnotation$$tar4 === void 0 ? void 0 : _chartAnnotation$$tar4.value);
      });
      sMeasure = aCustAggMeasure.length > 0 ? aCustAggMeasure[0].qualifier : chartAnnotation === null || chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar5 = chartAnnotation.$target) === null || _chartAnnotation$$tar5 === void 0 ? void 0 : (_chartAnnotation$$tar6 = _chartAnnotation$$tar5.Measures) === null || _chartAnnotation$$tar6 === void 0 ? void 0 : (_chartAnnotation$$tar7 = _chartAnnotation$$tar6[0]) === null || _chartAnnotation$$tar7 === void 0 ? void 0 : _chartAnnotation$$tar7.value;
    } // consider dynamic measures only if there are no measures with custom aggregates


    if (!aCustAggMeasure[0] && chartAnnotation !== null && chartAnnotation !== void 0 && (_chartAnnotation$$tar8 = chartAnnotation.$target) !== null && _chartAnnotation$$tar8 !== void 0 && _chartAnnotation$$tar8.DynamicMeasures) {
      var _chartAnnotation$$tar9, _chartAnnotation$$tar10;

      sMeasure = converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath((_chartAnnotation$$tar9 = chartAnnotation.$target.DynamicMeasures) === null || _chartAnnotation$$tar9 === void 0 ? void 0 : (_chartAnnotation$$tar10 = _chartAnnotation$$tar9[0]) === null || _chartAnnotation$$tar10 === void 0 ? void 0 : _chartAnnotation$$tar10.value)).getDataModelObjectPath().targetObject.Name;
      aTransAggregations = aggregationHelper.getAggregatedProperties("AggregatedProperty");
    } else {
      aTransAggregations = aggregationHelper.getAggregatedProperties("AggregatedProperties")[0];
    }

    var sDimension = chartAnnotation === null || chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar11 = chartAnnotation.$target) === null || _chartAnnotation$$tar11 === void 0 ? void 0 : (_chartAnnotation$$tar12 = _chartAnnotation$$tar11.Dimensions[0]) === null || _chartAnnotation$$tar12 === void 0 ? void 0 : _chartAnnotation$$tar12.value;

    if (customAggregates.some(function (custAgg) {
      return custAgg.qualifier === sMeasure;
    })) {
      sMeasurePath = sMeasure;
    } else if (aTransAggregations && aTransAggregations[0]) {
      aTransAggregations.some(function (oAggregate) {
        if (oAggregate.Name === sMeasure) {
          sMeasurePath = oAggregate === null || oAggregate === void 0 ? void 0 : oAggregate.AggregatableProperty.value;
        }
      });
    }

    var aAggregatablePropsFromContainer = aggregationHelper.getAggregatableProperties();
    var aGroupablePropsFromContainer = aggregationHelper.getGroupableProperties();

    if (aAggregatablePropsFromContainer && aAggregatablePropsFromContainer.length) {
      var _iterator = _createForOfIteratorHelper(aAggregatablePropsFromContainer),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _aggregatableProp$Pro;

          var aggregatableProp = _step.value;

          if ((aggregatableProp === null || aggregatableProp === void 0 ? void 0 : (_aggregatableProp$Pro = aggregatableProp.Property) === null || _aggregatableProp$Pro === void 0 ? void 0 : _aggregatableProp$Pro.value) === sMeasurePath) {
            bAggregatable = true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    if (aGroupablePropsFromContainer && aGroupablePropsFromContainer.length) {
      var _iterator2 = _createForOfIteratorHelper(aGroupablePropsFromContainer),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var groupableProp = _step2.value;

          if ((groupableProp === null || groupableProp === void 0 ? void 0 : groupableProp.value) === sDimension) {
            bGroupable = true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    return bAggregatable && bGroupable;
  };
  /**
   * Method to get the visual filters object for a property.
   *
   * @param entityType The converter context
   * @param converterContext The chart annotation
   * @param sPropertyPath The aggregation helper
   * @param FilterFields The aggregation helper
   * @returns The visual filters
   */


  function getVisualFilters(entityType, converterContext, sPropertyPath, FilterFields) {
    var _oVisualFilter$visual;

    var visualFilter = {};
    var oVisualFilter = FilterFields[sPropertyPath];

    if (oVisualFilter !== null && oVisualFilter !== void 0 && (_oVisualFilter$visual = oVisualFilter.visualFilter) !== null && _oVisualFilter$visual !== void 0 && _oVisualFilter$visual.valueList) {
      var _oVisualFilter$visual2, _property$annotations;

      var oVFPath = oVisualFilter === null || oVisualFilter === void 0 ? void 0 : (_oVisualFilter$visual2 = oVisualFilter.visualFilter) === null || _oVisualFilter$visual2 === void 0 ? void 0 : _oVisualFilter$visual2.valueList;
      var annotationQualifierSplit = oVFPath.split("#");
      var qualifierVL = annotationQualifierSplit.length > 1 ? "ValueList#".concat(annotationQualifierSplit[1]) : annotationQualifierSplit[0];
      var property = entityType.resolvePath(sPropertyPath);
      var valueList = property === null || property === void 0 ? void 0 : (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : _property$annotations.Common[qualifierVL];

      if (valueList) {
        var _converterContext$get, _collectionPathConver;

        var collectionPath = valueList === null || valueList === void 0 ? void 0 : valueList.CollectionPath;
        var collectionPathConverterContext = converterContext.getConverterContextFor("/".concat(collectionPath || ((_converterContext$get = converterContext.getEntitySet()) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.name)));
        var valueListParams = valueList === null || valueList === void 0 ? void 0 : valueList.Parameters;
        var outParameter;
        var inParameters = [];
        var aParameters = [];
        var parameterEntityType = collectionPathConverterContext.getParameterEntityType();
        aParameters = parameterEntityType ? parameterEntityType.keys.map(function (key) {
          return key.name;
        }) : [];

        if (converterContext.getContextPath() === collectionPathConverterContext.getContextPath()) {
          aParameters.forEach(function (parameter) {
            inParameters.push({
              localDataProperty: parameter,
              valueListProperty: parameter
            });
          });
        }

        if (valueListParams) {
          var _iterator3 = _createForOfIteratorHelper(valueListParams),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _valueListParam$Local;

              var valueListParam = _step3.value;
              var localDataProperty = (_valueListParam$Local = valueListParam.LocalDataProperty) === null || _valueListParam$Local === void 0 ? void 0 : _valueListParam$Local.value;
              var valueListProperty = valueListParam.ValueListProperty;

              if (((valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || (valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterOut") && sPropertyPath === localDataProperty) {
                outParameter = valueListParam;
              }

              if (((valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || (valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterIn") && sPropertyPath !== localDataProperty) {
                var bNotFilterable = isPropertyFilterable(collectionPathConverterContext, valueListProperty);

                if (!bNotFilterable) {
                  inParameters.push({
                    localDataProperty: localDataProperty,
                    valueListProperty: valueListProperty
                  });
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }

        if (inParameters && inParameters.length) {
          inParameters.forEach(function (oInParameter) {
            var mainEntitySetInMappingAllowedExpression = compileExpression(checkFilterExpressionRestrictions(converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(oInParameter === null || oInParameter === void 0 ? void 0 : oInParameter.localDataProperty)).getDataModelObjectPath(), ["SingleValue"]));
            var valueListEntitySetInMappingAllowedExpression = compileExpression(checkFilterExpressionRestrictions(collectionPathConverterContext.getConverterContextFor(collectionPathConverterContext.getAbsoluteAnnotationPath(oInParameter === null || oInParameter === void 0 ? void 0 : oInParameter.valueListProperty)).getDataModelObjectPath(), ["SingleValue"]));

            if (valueListEntitySetInMappingAllowedExpression === "true" && mainEntitySetInMappingAllowedExpression === "false") {
              throw new Error("FilterRestrictions of ".concat(sPropertyPath, " in MainEntitySet and ValueListEntitySet are different"));
            }
          });
        }

        var pvQualifier = valueList === null || valueList === void 0 ? void 0 : valueList.PresentationVariantQualifier;
        var svQualifier = valueList === null || valueList === void 0 ? void 0 : valueList.SelectionVariantQualifier;
        var pvAnnotation = collectionPathConverterContext === null || collectionPathConverterContext === void 0 ? void 0 : (_collectionPathConver = collectionPathConverterContext.getEntityTypeAnnotation("@UI.PresentationVariant#".concat(pvQualifier))) === null || _collectionPathConver === void 0 ? void 0 : _collectionPathConver.annotation;
        var aggregationHelper = new AggregationHelper(collectionPathConverterContext.getEntityType(), collectionPathConverterContext);

        if (!aggregationHelper.isAnalyticsSupported()) {
          return;
        }

        if (pvAnnotation) {
          var _collectionPathConver2;

          var aVisualizations = pvAnnotation === null || pvAnnotation === void 0 ? void 0 : pvAnnotation.Visualizations;
          var contextPath = "/".concat(valueList === null || valueList === void 0 ? void 0 : valueList.CollectionPath) || "/".concat(collectionPathConverterContext === null || collectionPathConverterContext === void 0 ? void 0 : (_collectionPathConver2 = collectionPathConverterContext.getEntitySet()) === null || _collectionPathConver2 === void 0 ? void 0 : _collectionPathConver2.name);
          visualFilter.contextPath = contextPath;
          var chartAnnotation;

          var _iterator4 = _createForOfIteratorHelper(aVisualizations),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _visualization$$targe;

              var visualization = _step4.value;

              if (((_visualization$$targe = visualization.$target) === null || _visualization$$targe === void 0 ? void 0 : _visualization$$targe.term) === "com.sap.vocabularies.UI.v1.Chart") {
                chartAnnotation = visualization;
                break;
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          if (chartAnnotation) {
            var _chartAnnotation, _chartAnnotation$$tar13, _chartAnnotation$$tar14, _chartAnnotation$$tar15, _chartAnnotation$$tar16, _chartAnnotation$$tar17, _chartAnnotation$$tar18, _chartAnnotation2, _chartAnnotation2$$ta, _chartAnnotation2$$ta2, _chartAnnotation2$$ta3, _chartAnnotation2$$ta4, _chartAnnotation2$$ta5, _chartAnnotation2$$ta6;

            var _bgetVFAggregation = _checkVFAggregation(collectionPathConverterContext, chartAnnotation, aggregationHelper);

            if (!_bgetVFAggregation) {
              return;
            }

            var bDimensionHidden = (_chartAnnotation = chartAnnotation) === null || _chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar13 = _chartAnnotation.$target) === null || _chartAnnotation$$tar13 === void 0 ? void 0 : (_chartAnnotation$$tar14 = _chartAnnotation$$tar13.Dimensions[0]) === null || _chartAnnotation$$tar14 === void 0 ? void 0 : (_chartAnnotation$$tar15 = _chartAnnotation$$tar14.$target) === null || _chartAnnotation$$tar15 === void 0 ? void 0 : (_chartAnnotation$$tar16 = _chartAnnotation$$tar15.annotations) === null || _chartAnnotation$$tar16 === void 0 ? void 0 : (_chartAnnotation$$tar17 = _chartAnnotation$$tar16.UI) === null || _chartAnnotation$$tar17 === void 0 ? void 0 : (_chartAnnotation$$tar18 = _chartAnnotation$$tar17.Hidden) === null || _chartAnnotation$$tar18 === void 0 ? void 0 : _chartAnnotation$$tar18.valueOf();
            var bDimensionHiddenFilter = (_chartAnnotation2 = chartAnnotation) === null || _chartAnnotation2 === void 0 ? void 0 : (_chartAnnotation2$$ta = _chartAnnotation2.$target) === null || _chartAnnotation2$$ta === void 0 ? void 0 : (_chartAnnotation2$$ta2 = _chartAnnotation2$$ta.Dimensions[0]) === null || _chartAnnotation2$$ta2 === void 0 ? void 0 : (_chartAnnotation2$$ta3 = _chartAnnotation2$$ta2.$target) === null || _chartAnnotation2$$ta3 === void 0 ? void 0 : (_chartAnnotation2$$ta4 = _chartAnnotation2$$ta3.annotations) === null || _chartAnnotation2$$ta4 === void 0 ? void 0 : (_chartAnnotation2$$ta5 = _chartAnnotation2$$ta4.UI) === null || _chartAnnotation2$$ta5 === void 0 ? void 0 : (_chartAnnotation2$$ta6 = _chartAnnotation2$$ta5.HiddenFilter) === null || _chartAnnotation2$$ta6 === void 0 ? void 0 : _chartAnnotation2$$ta6.valueOf();

            if (bDimensionHidden === true || bDimensionHiddenFilter === true) {
              return;
            } else if (aVisualizations && aVisualizations.length) {
              var _outParameter, _outParameter$LocalDa, _requiredProperties, _visualFilter$require, _chartAnnotation3, _chartAnnotation3$$ta, _chartAnnotation3$$ta2, _chartAnnotation3$$ta3;

              visualFilter.chartAnnotation = chartAnnotation ? collectionPathConverterContext === null || collectionPathConverterContext === void 0 ? void 0 : collectionPathConverterContext.getAbsoluteAnnotationPath("".concat(chartAnnotation.fullyQualifiedName, "/$AnnotationPath/")) : undefined;
              visualFilter.presentationAnnotation = pvAnnotation ? collectionPathConverterContext === null || collectionPathConverterContext === void 0 ? void 0 : collectionPathConverterContext.getAbsoluteAnnotationPath("".concat(pvAnnotation.fullyQualifiedName, "/")) : undefined;
              visualFilter.outParameter = (_outParameter = outParameter) === null || _outParameter === void 0 ? void 0 : (_outParameter$LocalDa = _outParameter.LocalDataProperty) === null || _outParameter$LocalDa === void 0 ? void 0 : _outParameter$LocalDa.value;
              visualFilter.inParameters = inParameters;
              var bIsRange = checkFilterExpressionRestrictions(converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(sPropertyPath)).getDataModelObjectPath(), ["SingleRange", "MultiRange"]);

              if (compileExpression(bIsRange) === "true") {
                throw new Error("Range AllowedExpression is not supported for visual filters");
              }

              var bIsMainEntitySetSingleSelection = checkFilterExpressionRestrictions(converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(sPropertyPath)).getDataModelObjectPath(), ["SingleValue"]);
              visualFilter.multipleSelectionAllowed = compileExpression(!bIsMainEntitySetSingleSelection.value);
              visualFilter.required = getIsRequired(converterContext, sPropertyPath);
              var svAnnotation;

              if (svQualifier) {
                var _collectionPathConver3;

                svAnnotation = collectionPathConverterContext === null || collectionPathConverterContext === void 0 ? void 0 : (_collectionPathConver3 = collectionPathConverterContext.getEntityTypeAnnotation("@UI.SelectionVariant#".concat(svQualifier))) === null || _collectionPathConver3 === void 0 ? void 0 : _collectionPathConver3.annotation;
                visualFilter.selectionVariantAnnotation = svAnnotation ? collectionPathConverterContext === null || collectionPathConverterContext === void 0 ? void 0 : collectionPathConverterContext.getAbsoluteAnnotationPath("".concat(svAnnotation.fullyQualifiedName, "/")) : undefined;
              }

              var requiredProperties = [];

              if (parameterEntityType) {
                var _oEntitySetConverterC, _oEntitySetConverterC2, _oEntitySetConverterC3, _oEntitySetConverterC4, _oRestrictedProperty$;

                var sEntitySet = collectionPath.split("/")[0];
                var sNavigationProperty = collectionPath.split("/")[1];
                var oEntitySetConverterContext = converterContext.getConverterContextFor("/".concat(sEntitySet));
                var aRestrictedProperties = oEntitySetConverterContext === null || oEntitySetConverterContext === void 0 ? void 0 : (_oEntitySetConverterC = oEntitySetConverterContext.getDataModelObjectPath().startingEntitySet) === null || _oEntitySetConverterC === void 0 ? void 0 : (_oEntitySetConverterC2 = _oEntitySetConverterC.annotations) === null || _oEntitySetConverterC2 === void 0 ? void 0 : (_oEntitySetConverterC3 = _oEntitySetConverterC2.Capabilities) === null || _oEntitySetConverterC3 === void 0 ? void 0 : (_oEntitySetConverterC4 = _oEntitySetConverterC3.NavigationRestrictions) === null || _oEntitySetConverterC4 === void 0 ? void 0 : _oEntitySetConverterC4.RestrictedProperties;
                var oRestrictedProperty = aRestrictedProperties === null || aRestrictedProperties === void 0 ? void 0 : aRestrictedProperties.find(function (restrictedNavProp) {
                  var _restrictedNavProp$Na;

                  if (((_restrictedNavProp$Na = restrictedNavProp.NavigationProperty) === null || _restrictedNavProp$Na === void 0 ? void 0 : _restrictedNavProp$Na.type) === "NavigationPropertyPath") {
                    return restrictedNavProp.NavigationProperty.value === sNavigationProperty;
                  }
                });
                requiredProperties = oRestrictedProperty === null || oRestrictedProperty === void 0 ? void 0 : (_oRestrictedProperty$ = oRestrictedProperty.FilterRestrictions) === null || _oRestrictedProperty$ === void 0 ? void 0 : _oRestrictedProperty$.RequiredProperties;
              } else {
                var _collectionPathConver4;

                var entitySetAnnotations = (_collectionPathConver4 = collectionPathConverterContext.getEntitySet()) === null || _collectionPathConver4 === void 0 ? void 0 : _collectionPathConver4.annotations;

                if (!ModelHelper.isSingleton(collectionPathConverterContext.getEntitySet())) {
                  var _entitySetAnnotations, _entitySetAnnotations2;

                  requiredProperties = entitySetAnnotations === null || entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations = entitySetAnnotations.Capabilities) === null || _entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations2 = _entitySetAnnotations.FilterRestrictions) === null || _entitySetAnnotations2 === void 0 ? void 0 : _entitySetAnnotations2.RequiredProperties;
                }
              }

              var requiredPropertyPaths = [];

              if ((_requiredProperties = requiredProperties) !== null && _requiredProperties !== void 0 && _requiredProperties.length) {
                requiredProperties.forEach(function (oRequireProperty) {
                  requiredPropertyPaths.push(oRequireProperty.value);
                });
              }

              requiredPropertyPaths = requiredPropertyPaths.concat(aParameters);
              visualFilter.requiredProperties = requiredPropertyPaths;

              if ((_visualFilter$require = visualFilter.requiredProperties) !== null && _visualFilter$require !== void 0 && _visualFilter$require.length) {
                if (!visualFilter.inParameters || !visualFilter.inParameters.length) {
                  if (!visualFilter.selectionVariantAnnotation) {
                    visualFilter.showOverlayInitially = true;
                  } else {
                    var _svAnnotation, _svAnnotation$SelectO, _svAnnotation2, _svAnnotation2$Parame;

                    var selectOptions = ((_svAnnotation = svAnnotation) === null || _svAnnotation === void 0 ? void 0 : (_svAnnotation$SelectO = _svAnnotation.SelectOptions) === null || _svAnnotation$SelectO === void 0 ? void 0 : _svAnnotation$SelectO.map(function (oSelectOption) {
                      return oSelectOption.PropertyName.value;
                    })) || [];
                    var parameterOptions = ((_svAnnotation2 = svAnnotation) === null || _svAnnotation2 === void 0 ? void 0 : (_svAnnotation2$Parame = _svAnnotation2.Parameters) === null || _svAnnotation2$Parame === void 0 ? void 0 : _svAnnotation2$Parame.map(function (oParameterOption) {
                      return oParameterOption.PropertyName.value;
                    })) || [];
                    selectOptions = selectOptions.concat(parameterOptions);
                    requiredPropertyPaths = requiredPropertyPaths.sort();
                    selectOptions = selectOptions.sort();
                    visualFilter.showOverlayInitially = requiredPropertyPaths.some(function (sPath) {
                      return selectOptions.indexOf(sPath) === -1;
                    });
                  }
                } else {
                  visualFilter.showOverlayInitially = false;
                }
              } else {
                visualFilter.showOverlayInitially = false;
              }

              var sDimensionType = (_chartAnnotation3 = chartAnnotation) === null || _chartAnnotation3 === void 0 ? void 0 : (_chartAnnotation3$$ta = _chartAnnotation3.$target) === null || _chartAnnotation3$$ta === void 0 ? void 0 : (_chartAnnotation3$$ta2 = _chartAnnotation3$$ta.Dimensions[0]) === null || _chartAnnotation3$$ta2 === void 0 ? void 0 : (_chartAnnotation3$$ta3 = _chartAnnotation3$$ta2.$target) === null || _chartAnnotation3$$ta3 === void 0 ? void 0 : _chartAnnotation3$$ta3.type;

              if (!(sDimensionType === "Edm.DateTimeOffset" || sDimensionType === "Edm.Date" || sDimensionType === "Edm.TimeOfDay") && chartAnnotation.$target.ChartType === "UI.ChartType/Line") {
                visualFilter.renderLineChart = false;
              } else {
                visualFilter.renderLineChart = true;
              }
            }
          } else {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.CHART);
          }
        } else {
          converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.PRESENTATIONVARIANT);
        }
      } else {
        converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.VALUELIST);
      }
    } else {
      converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.VALUELIST);
    }

    if (Object.keys(visualFilter).length > 1) {
      return visualFilter;
    }
  }

  _exports.getVisualFilters = getVisualFilters;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY2hlY2tWRkFnZ3JlZ2F0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImNoYXJ0QW5ub3RhdGlvbiIsImFnZ3JlZ2F0aW9uSGVscGVyIiwic01lYXN1cmVQYXRoIiwiYkdyb3VwYWJsZSIsImJBZ2dyZWdhdGFibGUiLCJzTWVhc3VyZSIsImN1c3RvbUFnZ3JlZ2F0ZXMiLCJnZXRDdXN0b21BZ2dyZWdhdGVEZWZpbml0aW9ucyIsImFUcmFuc0FnZ3JlZ2F0aW9ucyIsImdldFRyYW5zQWdncmVnYXRpb25zIiwiYUN1c3RBZ2dNZWFzdXJlIiwiJHRhcmdldCIsIk1lYXN1cmVzIiwiZmlsdGVyIiwiY3VzdEFnZyIsInF1YWxpZmllciIsInZhbHVlIiwibGVuZ3RoIiwiRHluYW1pY01lYXN1cmVzIiwiZ2V0Q29udmVydGVyQ29udGV4dEZvciIsImdldEFic29sdXRlQW5ub3RhdGlvblBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0T2JqZWN0IiwiTmFtZSIsImdldEFnZ3JlZ2F0ZWRQcm9wZXJ0aWVzIiwic0RpbWVuc2lvbiIsIkRpbWVuc2lvbnMiLCJzb21lIiwib0FnZ3JlZ2F0ZSIsIkFnZ3JlZ2F0YWJsZVByb3BlcnR5IiwiYUFnZ3JlZ2F0YWJsZVByb3BzRnJvbUNvbnRhaW5lciIsImdldEFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhR3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyIiwiZ2V0R3JvdXBhYmxlUHJvcGVydGllcyIsImFnZ3JlZ2F0YWJsZVByb3AiLCJQcm9wZXJ0eSIsImdyb3VwYWJsZVByb3AiLCJnZXRWaXN1YWxGaWx0ZXJzIiwiZW50aXR5VHlwZSIsInNQcm9wZXJ0eVBhdGgiLCJGaWx0ZXJGaWVsZHMiLCJ2aXN1YWxGaWx0ZXIiLCJvVmlzdWFsRmlsdGVyIiwidmFsdWVMaXN0Iiwib1ZGUGF0aCIsImFubm90YXRpb25RdWFsaWZpZXJTcGxpdCIsInNwbGl0IiwicXVhbGlmaWVyVkwiLCJwcm9wZXJ0eSIsInJlc29sdmVQYXRoIiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJjb2xsZWN0aW9uUGF0aCIsIkNvbGxlY3Rpb25QYXRoIiwiY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0IiwiZ2V0RW50aXR5U2V0IiwibmFtZSIsInZhbHVlTGlzdFBhcmFtcyIsIlBhcmFtZXRlcnMiLCJvdXRQYXJhbWV0ZXIiLCJpblBhcmFtZXRlcnMiLCJhUGFyYW1ldGVycyIsInBhcmFtZXRlckVudGl0eVR5cGUiLCJnZXRQYXJhbWV0ZXJFbnRpdHlUeXBlIiwia2V5cyIsIm1hcCIsImtleSIsImdldENvbnRleHRQYXRoIiwiZm9yRWFjaCIsInBhcmFtZXRlciIsInB1c2giLCJsb2NhbERhdGFQcm9wZXJ0eSIsInZhbHVlTGlzdFByb3BlcnR5IiwidmFsdWVMaXN0UGFyYW0iLCJMb2NhbERhdGFQcm9wZXJ0eSIsIlZhbHVlTGlzdFByb3BlcnR5IiwiJFR5cGUiLCJiTm90RmlsdGVyYWJsZSIsImlzUHJvcGVydHlGaWx0ZXJhYmxlIiwib0luUGFyYW1ldGVyIiwibWFpbkVudGl0eVNldEluTWFwcGluZ0FsbG93ZWRFeHByZXNzaW9uIiwiY29tcGlsZUV4cHJlc3Npb24iLCJjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMiLCJ2YWx1ZUxpc3RFbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiIsIkVycm9yIiwicHZRdWFsaWZpZXIiLCJQcmVzZW50YXRpb25WYXJpYW50UXVhbGlmaWVyIiwic3ZRdWFsaWZpZXIiLCJTZWxlY3Rpb25WYXJpYW50UXVhbGlmaWVyIiwicHZBbm5vdGF0aW9uIiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJhbm5vdGF0aW9uIiwiQWdncmVnYXRpb25IZWxwZXIiLCJnZXRFbnRpdHlUeXBlIiwiaXNBbmFseXRpY3NTdXBwb3J0ZWQiLCJhVmlzdWFsaXphdGlvbnMiLCJWaXN1YWxpemF0aW9ucyIsImNvbnRleHRQYXRoIiwidmlzdWFsaXphdGlvbiIsInRlcm0iLCJfYmdldFZGQWdncmVnYXRpb24iLCJiRGltZW5zaW9uSGlkZGVuIiwiVUkiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwiYkRpbWVuc2lvbkhpZGRlbkZpbHRlciIsIkhpZGRlbkZpbHRlciIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInVuZGVmaW5lZCIsInByZXNlbnRhdGlvbkFubm90YXRpb24iLCJiSXNSYW5nZSIsImJJc01haW5FbnRpdHlTZXRTaW5nbGVTZWxlY3Rpb24iLCJtdWx0aXBsZVNlbGVjdGlvbkFsbG93ZWQiLCJyZXF1aXJlZCIsImdldElzUmVxdWlyZWQiLCJzdkFubm90YXRpb24iLCJzZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbiIsInJlcXVpcmVkUHJvcGVydGllcyIsInNFbnRpdHlTZXQiLCJzTmF2aWdhdGlvblByb3BlcnR5Iiwib0VudGl0eVNldENvbnZlcnRlckNvbnRleHQiLCJhUmVzdHJpY3RlZFByb3BlcnRpZXMiLCJzdGFydGluZ0VudGl0eVNldCIsIkNhcGFiaWxpdGllcyIsIk5hdmlnYXRpb25SZXN0cmljdGlvbnMiLCJSZXN0cmljdGVkUHJvcGVydGllcyIsIm9SZXN0cmljdGVkUHJvcGVydHkiLCJmaW5kIiwicmVzdHJpY3RlZE5hdlByb3AiLCJOYXZpZ2F0aW9uUHJvcGVydHkiLCJ0eXBlIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiUmVxdWlyZWRQcm9wZXJ0aWVzIiwiZW50aXR5U2V0QW5ub3RhdGlvbnMiLCJNb2RlbEhlbHBlciIsImlzU2luZ2xldG9uIiwicmVxdWlyZWRQcm9wZXJ0eVBhdGhzIiwib1JlcXVpcmVQcm9wZXJ0eSIsImNvbmNhdCIsInNob3dPdmVybGF5SW5pdGlhbGx5Iiwic2VsZWN0T3B0aW9ucyIsIlNlbGVjdE9wdGlvbnMiLCJvU2VsZWN0T3B0aW9uIiwiUHJvcGVydHlOYW1lIiwicGFyYW1ldGVyT3B0aW9ucyIsIm9QYXJhbWV0ZXJPcHRpb24iLCJzb3J0Iiwic1BhdGgiLCJpbmRleE9mIiwic0RpbWVuc2lvblR5cGUiLCJDaGFydFR5cGUiLCJyZW5kZXJMaW5lQ2hhcnQiLCJnZXREaWFnbm9zdGljcyIsImFkZElzc3VlIiwiSXNzdWVDYXRlZ29yeSIsIkFubm90YXRpb24iLCJJc3N1ZVNldmVyaXR5IiwiSGlnaCIsIklzc3VlVHlwZSIsIk1BTEZPUk1FRF9WSVNVQUxGSUxURVJTIiwiQ0hBUlQiLCJQUkVTRU5UQVRJT05WQVJJQU5UIiwiVkFMVUVMSVNUIiwiTWFuaWZlc3QiLCJPYmplY3QiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlZpc3VhbEZpbHRlcnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFbnRpdHlUeXBlIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEN1c3RvbUFnZ3JlZ2F0ZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQWdncmVnYXRpb25cIjtcbmltcG9ydCB0eXBlIHsgTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQ2FwYWJpbGl0aWVzXCI7XG5pbXBvcnQgeyBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NhcGFiaWxpdGllc19FZG1cIjtcbmltcG9ydCB0eXBlIENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgQWdncmVnYXRpb25IZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0FnZ3JlZ2F0aW9uXCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5LCBJc3N1ZVNldmVyaXR5LCBJc3N1ZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHR5cGUgeyBGaWx0ZXJGaWVsZE1hbmlmZXN0Q29uZmlndXJhdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IHsgY2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgZ2V0SXNSZXF1aXJlZCwgaXNQcm9wZXJ0eUZpbHRlcmFibGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9GaWx0ZXJUZW1wbGF0aW5nXCI7XG5cbmV4cG9ydCB0eXBlIFZpc3VhbEZpbHRlcnMgPSB7XG5cdGRpbWVuc2lvblBhdGg/OiBzdHJpbmc7XG5cdG1lYXN1cmVQYXRoPzogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0Y2hhcnRBbm5vdGF0aW9uPzogc3RyaW5nO1xuXHRwcmVzZW50YXRpb25Bbm5vdGF0aW9uPzogc3RyaW5nO1xuXHR2aXNpYmxlPzogYm9vbGVhbjtcblx0b3V0UGFyYW1ldGVyPzogc3RyaW5nO1xuXHRpblBhcmFtZXRlcnM/OiBvYmplY3RbXTtcblx0Y29udGV4dFBhdGg/OiBzdHJpbmc7XG5cdHNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uPzogc3RyaW5nO1xuXHRtdWx0aXBsZVNlbGVjdGlvbkFsbG93ZWQ/OiBib29sZWFuO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG5cdHNob3dPdmVybGF5SW5pdGlhbGx5PzogYm9vbGVhbjtcblx0cmVuZGVyTGluZUNoYXJ0PzogYm9vbGVhbjtcblx0cmVxdWlyZWRQcm9wZXJ0aWVzPzogb2JqZWN0W107XG59O1xuXG4vKipcbiAqIENoZWNrcyB0aGF0IG1lYXN1cmVzIGFuZCBkaW1lbnNpb25zIG9mIHRoZSB2aXN1YWwgZmlsdGVyIGNoYXJ0IGNhbiBiZSBhZ2dyZWdhdGVkIGFuZCBncm91cGVkLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGNoYXJ0QW5ub3RhdGlvbiBUaGUgY2hhcnQgYW5ub3RhdGlvblxuICogQHBhcmFtIGFnZ3JlZ2F0aW9uSGVscGVyIFRoZSBhZ2dyZWdhdGlvbiBoZWxwZXJcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWVhc3VyZSBjYW4gYmUgZ3JvdXBlZCBhbmQgYWdncmVnYXRlZFxuICovXG5jb25zdCBfY2hlY2tWRkFnZ3JlZ2F0aW9uID0gZnVuY3Rpb24gKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRjaGFydEFubm90YXRpb246IGFueSxcblx0YWdncmVnYXRpb25IZWxwZXI6IGFueVxuKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG5cdGxldCBzTWVhc3VyZVBhdGgsIGJHcm91cGFibGUsIGJBZ2dyZWdhdGFibGU7XG5cdGxldCBzTWVhc3VyZTogYW55O1xuXHRjb25zdCBjdXN0b21BZ2dyZWdhdGVzID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMoKTtcblx0bGV0IGFUcmFuc0FnZ3JlZ2F0aW9ucyA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldFRyYW5zQWdncmVnYXRpb25zKCk7XG5cdGxldCBhQ3VzdEFnZ01lYXN1cmUgPSBbXSBhcyBBcnJheTxDdXN0b21BZ2dyZWdhdGU+O1xuXHQvLyBpZiB0aGUgY2hhcnQgZGVmaW5pdGlvbiBoYXMgY3VzdG9tIGFnZ3JlZ2F0ZXMsIHRoZW4gY29uc2lkZXIgdGhlbSwgZWxzZSBmYWxsIGJhY2sgdG8gdGhlIG1lYXN1cmVzIHdpdGggdHJhbnNmb3JtYXRpb24gYWdncmVnYXRlc1xuXHRpZiAoY2hhcnRBbm5vdGF0aW9uPy4kdGFyZ2V0Py5NZWFzdXJlcykge1xuXHRcdGFDdXN0QWdnTWVhc3VyZSA9IGN1c3RvbUFnZ3JlZ2F0ZXMuZmlsdGVyKGZ1bmN0aW9uIChjdXN0QWdnOiBDdXN0b21BZ2dyZWdhdGUpIHtcblx0XHRcdHJldHVybiBjdXN0QWdnLnF1YWxpZmllciA9PT0gY2hhcnRBbm5vdGF0aW9uPy4kdGFyZ2V0Py5NZWFzdXJlcz8uWzBdPy52YWx1ZTtcblx0XHR9KTtcblx0XHRzTWVhc3VyZSA9IGFDdXN0QWdnTWVhc3VyZS5sZW5ndGggPiAwID8gYUN1c3RBZ2dNZWFzdXJlWzBdLnF1YWxpZmllciA6IGNoYXJ0QW5ub3RhdGlvbj8uJHRhcmdldD8uTWVhc3VyZXM/LlswXT8udmFsdWU7XG5cdH1cblx0Ly8gY29uc2lkZXIgZHluYW1pYyBtZWFzdXJlcyBvbmx5IGlmIHRoZXJlIGFyZSBubyBtZWFzdXJlcyB3aXRoIGN1c3RvbSBhZ2dyZWdhdGVzXG5cdGlmICghYUN1c3RBZ2dNZWFzdXJlWzBdICYmIGNoYXJ0QW5ub3RhdGlvbj8uJHRhcmdldD8uRHluYW1pY01lYXN1cmVzKSB7XG5cdFx0c01lYXN1cmUgPSBjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihjb252ZXJ0ZXJDb250ZXh0LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoY2hhcnRBbm5vdGF0aW9uLiR0YXJnZXQuRHluYW1pY01lYXN1cmVzPy5bMF0/LnZhbHVlKSlcblx0XHRcdC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkudGFyZ2V0T2JqZWN0Lk5hbWU7XG5cdFx0YVRyYW5zQWdncmVnYXRpb25zID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0QWdncmVnYXRlZFByb3BlcnRpZXMoXCJBZ2dyZWdhdGVkUHJvcGVydHlcIik7XG5cdH0gZWxzZSB7XG5cdFx0YVRyYW5zQWdncmVnYXRpb25zID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0QWdncmVnYXRlZFByb3BlcnRpZXMoXCJBZ2dyZWdhdGVkUHJvcGVydGllc1wiKVswXTtcblx0fVxuXG5cdGNvbnN0IHNEaW1lbnNpb246IHN0cmluZyA9IGNoYXJ0QW5ub3RhdGlvbj8uJHRhcmdldD8uRGltZW5zaW9uc1swXT8udmFsdWU7XG5cblx0aWYgKFxuXHRcdGN1c3RvbUFnZ3JlZ2F0ZXMuc29tZShmdW5jdGlvbiAoY3VzdEFnZzogQ3VzdG9tQWdncmVnYXRlKSB7XG5cdFx0XHRyZXR1cm4gY3VzdEFnZy5xdWFsaWZpZXIgPT09IHNNZWFzdXJlO1xuXHRcdH0pXG5cdCkge1xuXHRcdHNNZWFzdXJlUGF0aCA9IHNNZWFzdXJlO1xuXHR9IGVsc2UgaWYgKGFUcmFuc0FnZ3JlZ2F0aW9ucyAmJiBhVHJhbnNBZ2dyZWdhdGlvbnNbMF0pIHtcblx0XHRhVHJhbnNBZ2dyZWdhdGlvbnMuc29tZShmdW5jdGlvbiAob0FnZ3JlZ2F0ZTogYW55KSB7XG5cdFx0XHRpZiAob0FnZ3JlZ2F0ZS5OYW1lID09PSBzTWVhc3VyZSkge1xuXHRcdFx0XHRzTWVhc3VyZVBhdGggPSBvQWdncmVnYXRlPy5BZ2dyZWdhdGFibGVQcm9wZXJ0eS52YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRjb25zdCBhQWdncmVnYXRhYmxlUHJvcHNGcm9tQ29udGFpbmVyID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0QWdncmVnYXRhYmxlUHJvcGVydGllcygpO1xuXHRjb25zdCBhR3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0R3JvdXBhYmxlUHJvcGVydGllcygpO1xuXHRpZiAoYUFnZ3JlZ2F0YWJsZVByb3BzRnJvbUNvbnRhaW5lciAmJiBhQWdncmVnYXRhYmxlUHJvcHNGcm9tQ29udGFpbmVyLmxlbmd0aCkge1xuXHRcdGZvciAoY29uc3QgYWdncmVnYXRhYmxlUHJvcCBvZiBhQWdncmVnYXRhYmxlUHJvcHNGcm9tQ29udGFpbmVyKSB7XG5cdFx0XHRpZiAoYWdncmVnYXRhYmxlUHJvcD8uUHJvcGVydHk/LnZhbHVlID09PSBzTWVhc3VyZVBhdGgpIHtcblx0XHRcdFx0YkFnZ3JlZ2F0YWJsZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGlmIChhR3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyICYmIGFHcm91cGFibGVQcm9wc0Zyb21Db250YWluZXIubGVuZ3RoKSB7XG5cdFx0Zm9yIChjb25zdCBncm91cGFibGVQcm9wIG9mIGFHcm91cGFibGVQcm9wc0Zyb21Db250YWluZXIpIHtcblx0XHRcdGlmIChncm91cGFibGVQcm9wPy52YWx1ZSA9PT0gc0RpbWVuc2lvbikge1xuXHRcdFx0XHRiR3JvdXBhYmxlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGJBZ2dyZWdhdGFibGUgJiYgYkdyb3VwYWJsZTtcbn07XG5cbi8qKlxuICogTWV0aG9kIHRvIGdldCB0aGUgdmlzdWFsIGZpbHRlcnMgb2JqZWN0IGZvciBhIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNoYXJ0IGFubm90YXRpb25cbiAqIEBwYXJhbSBzUHJvcGVydHlQYXRoIFRoZSBhZ2dyZWdhdGlvbiBoZWxwZXJcbiAqIEBwYXJhbSBGaWx0ZXJGaWVsZHMgVGhlIGFnZ3JlZ2F0aW9uIGhlbHBlclxuICogQHJldHVybnMgVGhlIHZpc3VhbCBmaWx0ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWaXN1YWxGaWx0ZXJzKFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzUHJvcGVydHlQYXRoOiBzdHJpbmcsXG5cdEZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24+XG4pOiBWaXN1YWxGaWx0ZXJzIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgdmlzdWFsRmlsdGVyOiBWaXN1YWxGaWx0ZXJzID0ge307XG5cdGNvbnN0IG9WaXN1YWxGaWx0ZXI6IEZpbHRlckZpZWxkTWFuaWZlc3RDb25maWd1cmF0aW9uID0gRmlsdGVyRmllbGRzW3NQcm9wZXJ0eVBhdGhdO1xuXHRpZiAob1Zpc3VhbEZpbHRlcj8udmlzdWFsRmlsdGVyPy52YWx1ZUxpc3QpIHtcblx0XHRjb25zdCBvVkZQYXRoID0gb1Zpc3VhbEZpbHRlcj8udmlzdWFsRmlsdGVyPy52YWx1ZUxpc3Q7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblF1YWxpZmllclNwbGl0ID0gb1ZGUGF0aC5zcGxpdChcIiNcIik7XG5cdFx0Y29uc3QgcXVhbGlmaWVyVkwgPSBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQubGVuZ3RoID4gMSA/IGBWYWx1ZUxpc3QjJHthbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXRbMV19YCA6IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdFswXTtcblx0XHRjb25zdCBwcm9wZXJ0eSA9IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgoc1Byb3BlcnR5UGF0aCk7XG5cdFx0Y29uc3QgdmFsdWVMaXN0OiBhbnkgPSBwcm9wZXJ0eT8uYW5ub3RhdGlvbnM/LkNvbW1vbltxdWFsaWZpZXJWTF07XG5cdFx0aWYgKHZhbHVlTGlzdCkge1xuXHRcdFx0Y29uc3QgY29sbGVjdGlvblBhdGggPSB2YWx1ZUxpc3Q/LkNvbGxlY3Rpb25QYXRoO1xuXHRcdFx0Y29uc3QgY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0ID0gY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKFxuXHRcdFx0XHRgLyR7Y29sbGVjdGlvblBhdGggfHwgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8ubmFtZX1gXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgdmFsdWVMaXN0UGFyYW1zID0gdmFsdWVMaXN0Py5QYXJhbWV0ZXJzO1xuXHRcdFx0bGV0IG91dFBhcmFtZXRlcjogYW55O1xuXHRcdFx0Y29uc3QgaW5QYXJhbWV0ZXJzOiBBcnJheTxvYmplY3Q+ID0gW107XG5cdFx0XHRsZXQgYVBhcmFtZXRlcnM6IEFycmF5PHN0cmluZz4gPSBbXTtcblx0XHRcdGNvbnN0IHBhcmFtZXRlckVudGl0eVR5cGUgPSBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQuZ2V0UGFyYW1ldGVyRW50aXR5VHlwZSgpO1xuXHRcdFx0YVBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJFbnRpdHlUeXBlXG5cdFx0XHRcdD8gcGFyYW1ldGVyRW50aXR5VHlwZS5rZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ga2V5Lm5hbWU7XG5cdFx0XHRcdCAgfSlcblx0XHRcdFx0OiBbXTtcblx0XHRcdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldENvbnRleHRQYXRoKCkgPT09IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dC5nZXRDb250ZXh0UGF0aCgpKSB7XG5cdFx0XHRcdGFQYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtZXRlcjogYW55KSB7XG5cdFx0XHRcdFx0aW5QYXJhbWV0ZXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0bG9jYWxEYXRhUHJvcGVydHk6IHBhcmFtZXRlcixcblx0XHRcdFx0XHRcdHZhbHVlTGlzdFByb3BlcnR5OiBwYXJhbWV0ZXJcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsdWVMaXN0UGFyYW1zKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFsdWVMaXN0UGFyYW0gb2YgdmFsdWVMaXN0UGFyYW1zKSB7XG5cdFx0XHRcdFx0Y29uc3QgbG9jYWxEYXRhUHJvcGVydHkgPSB2YWx1ZUxpc3RQYXJhbS5Mb2NhbERhdGFQcm9wZXJ0eT8udmFsdWU7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWVMaXN0UHJvcGVydHkgPSB2YWx1ZUxpc3RQYXJhbS5WYWx1ZUxpc3RQcm9wZXJ0eTtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQodmFsdWVMaXN0UGFyYW0/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiIHx8XG5cdFx0XHRcdFx0XHRcdHZhbHVlTGlzdFBhcmFtPy4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0UGFyYW1ldGVyT3V0XCIpICYmXG5cdFx0XHRcdFx0XHRzUHJvcGVydHlQYXRoID09PSBsb2NhbERhdGFQcm9wZXJ0eVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0b3V0UGFyYW1ldGVyID0gdmFsdWVMaXN0UGFyYW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCh2YWx1ZUxpc3RQYXJhbT8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCIgfHxcblx0XHRcdFx0XHRcdFx0dmFsdWVMaXN0UGFyYW0/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RQYXJhbWV0ZXJJblwiKSAmJlxuXHRcdFx0XHRcdFx0c1Byb3BlcnR5UGF0aCAhPT0gbG9jYWxEYXRhUHJvcGVydHlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGJOb3RGaWx0ZXJhYmxlID0gaXNQcm9wZXJ0eUZpbHRlcmFibGUoY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0LCB2YWx1ZUxpc3RQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0XHRpZiAoIWJOb3RGaWx0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdGluUGFyYW1ldGVycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRsb2NhbERhdGFQcm9wZXJ0eTogbG9jYWxEYXRhUHJvcGVydHksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVMaXN0UHJvcGVydHk6IHZhbHVlTGlzdFByb3BlcnR5XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGluUGFyYW1ldGVycyAmJiBpblBhcmFtZXRlcnMubGVuZ3RoKSB7XG5cdFx0XHRcdGluUGFyYW1ldGVycy5mb3JFYWNoKGZ1bmN0aW9uIChvSW5QYXJhbWV0ZXI6IGFueSkge1xuXHRcdFx0XHRcdGNvbnN0IG1haW5FbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0XHRcdFx0Y2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zKFxuXHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHRcdFx0LmdldENvbnZlcnRlckNvbnRleHRGb3IoY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKG9JblBhcmFtZXRlcj8ubG9jYWxEYXRhUHJvcGVydHkpKVxuXHRcdFx0XHRcdFx0XHRcdC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0XHRcdFx0XHRcdFtcIlNpbmdsZVZhbHVlXCJdXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZUxpc3RFbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0XHRcdFx0Y2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zKFxuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdFx0XHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihcblx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKG9JblBhcmFtZXRlcj8udmFsdWVMaXN0UHJvcGVydHkpXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0XHRcdFx0XHRcdFtcIlNpbmdsZVZhbHVlXCJdXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAodmFsdWVMaXN0RW50aXR5U2V0SW5NYXBwaW5nQWxsb3dlZEV4cHJlc3Npb24gPT09IFwidHJ1ZVwiICYmIG1haW5FbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZpbHRlclJlc3RyaWN0aW9ucyBvZiAke3NQcm9wZXJ0eVBhdGh9IGluIE1haW5FbnRpdHlTZXQgYW5kIFZhbHVlTGlzdEVudGl0eVNldCBhcmUgZGlmZmVyZW50YCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHB2UXVhbGlmaWVyID0gdmFsdWVMaXN0Py5QcmVzZW50YXRpb25WYXJpYW50UXVhbGlmaWVyO1xuXHRcdFx0Y29uc3Qgc3ZRdWFsaWZpZXIgPSB2YWx1ZUxpc3Q/LlNlbGVjdGlvblZhcmlhbnRRdWFsaWZpZXI7XG5cdFx0XHRjb25zdCBwdkFubm90YXRpb246IGFueSA9IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dD8uZ2V0RW50aXR5VHlwZUFubm90YXRpb24oXG5cdFx0XHRcdGBAVUkuUHJlc2VudGF0aW9uVmFyaWFudCMke3B2UXVhbGlmaWVyfWBcblx0XHRcdCk/LmFubm90YXRpb247XG5cdFx0XHRjb25zdCBhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0aWYgKCFhZ2dyZWdhdGlvbkhlbHBlci5pc0FuYWx5dGljc1N1cHBvcnRlZCgpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChwdkFubm90YXRpb24pIHtcblx0XHRcdFx0Y29uc3QgYVZpc3VhbGl6YXRpb25zID0gcHZBbm5vdGF0aW9uPy5WaXN1YWxpemF0aW9ucztcblx0XHRcdFx0Y29uc3QgY29udGV4dFBhdGggPSBgLyR7dmFsdWVMaXN0Py5Db2xsZWN0aW9uUGF0aH1gIHx8IGAvJHtjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQ/LmdldEVudGl0eVNldCgpPy5uYW1lfWA7XG5cdFx0XHRcdHZpc3VhbEZpbHRlci5jb250ZXh0UGF0aCA9IGNvbnRleHRQYXRoO1xuXHRcdFx0XHRsZXQgY2hhcnRBbm5vdGF0aW9uO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHZpc3VhbGl6YXRpb24gb2YgYVZpc3VhbGl6YXRpb25zKSB7XG5cdFx0XHRcdFx0aWYgKHZpc3VhbGl6YXRpb24uJHRhcmdldD8udGVybSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiKSB7XG5cdFx0XHRcdFx0XHRjaGFydEFubm90YXRpb24gPSB2aXN1YWxpemF0aW9uO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjaGFydEFubm90YXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCBfYmdldFZGQWdncmVnYXRpb246IGJvb2xlYW4gfCB1bmRlZmluZWQgPSBfY2hlY2tWRkFnZ3JlZ2F0aW9uKFxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdFx0Y2hhcnRBbm5vdGF0aW9uLFxuXHRcdFx0XHRcdFx0YWdncmVnYXRpb25IZWxwZXJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmICghX2JnZXRWRkFnZ3JlZ2F0aW9uKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnN0IGJEaW1lbnNpb25IaWRkZW46IGJvb2xlYW4gPSBjaGFydEFubm90YXRpb24/LiR0YXJnZXQ/LkRpbWVuc2lvbnNbMF0/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCk7XG5cdFx0XHRcdFx0Y29uc3QgYkRpbWVuc2lvbkhpZGRlbkZpbHRlcjogYm9vbGVhbiA9XG5cdFx0XHRcdFx0XHRjaGFydEFubm90YXRpb24/LiR0YXJnZXQ/LkRpbWVuc2lvbnNbMF0/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuRmlsdGVyPy52YWx1ZU9mKCk7XG5cdFx0XHRcdFx0aWYgKGJEaW1lbnNpb25IaWRkZW4gPT09IHRydWUgfHwgYkRpbWVuc2lvbkhpZGRlbkZpbHRlciA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYVZpc3VhbGl6YXRpb25zICYmIGFWaXN1YWxpemF0aW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5jaGFydEFubm90YXRpb24gPSBjaGFydEFubm90YXRpb25cblx0XHRcdFx0XHRcdFx0PyBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQ/LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoXG5cdFx0XHRcdFx0XHRcdFx0XHRgJHtjaGFydEFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lfS8kQW5ub3RhdGlvblBhdGgvYFxuXHRcdFx0XHRcdFx0XHQgIClcblx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIucHJlc2VudGF0aW9uQW5ub3RhdGlvbiA9IHB2QW5ub3RhdGlvblxuXHRcdFx0XHRcdFx0XHQ/IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dD8uZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aChgJHtwdkFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lfS9gKVxuXHRcdFx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5vdXRQYXJhbWV0ZXIgPSBvdXRQYXJhbWV0ZXI/LkxvY2FsRGF0YVByb3BlcnR5Py52YWx1ZTtcblx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5pblBhcmFtZXRlcnMgPSBpblBhcmFtZXRlcnM7XG5cdFx0XHRcdFx0XHRjb25zdCBiSXNSYW5nZSA9IGNoZWNrRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyhcblx0XHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdFx0XHRcdC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKGNvbnZlcnRlckNvbnRleHQuZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aChzUHJvcGVydHlQYXRoKSlcblx0XHRcdFx0XHRcdFx0XHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLFxuXHRcdFx0XHRcdFx0XHRbXCJTaW5nbGVSYW5nZVwiLCBcIk11bHRpUmFuZ2VcIl1cblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdGlmIChjb21waWxlRXhwcmVzc2lvbihiSXNSYW5nZSkgPT09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJhbmdlIEFsbG93ZWRFeHByZXNzaW9uIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHZpc3VhbCBmaWx0ZXJzXCIpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBiSXNNYWluRW50aXR5U2V0U2luZ2xlU2VsZWN0aW9uOiBhbnkgPSBjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMoXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdFx0XHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihjb252ZXJ0ZXJDb250ZXh0LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoc1Byb3BlcnR5UGF0aCkpXG5cdFx0XHRcdFx0XHRcdFx0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSxcblx0XHRcdFx0XHRcdFx0W1wiU2luZ2xlVmFsdWVcIl1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIubXVsdGlwbGVTZWxlY3Rpb25BbGxvd2VkID0gY29tcGlsZUV4cHJlc3Npb24oIWJJc01haW5FbnRpdHlTZXRTaW5nbGVTZWxlY3Rpb24udmFsdWUpIGFzIGFueTtcblx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5yZXF1aXJlZCA9IGdldElzUmVxdWlyZWQoY29udmVydGVyQ29udGV4dCwgc1Byb3BlcnR5UGF0aCk7XG5cdFx0XHRcdFx0XHRsZXQgc3ZBbm5vdGF0aW9uOiBhbnk7XG5cdFx0XHRcdFx0XHRpZiAoc3ZRdWFsaWZpZXIpIHtcblx0XHRcdFx0XHRcdFx0c3ZBbm5vdGF0aW9uID0gY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0Py5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihcblx0XHRcdFx0XHRcdFx0XHRgQFVJLlNlbGVjdGlvblZhcmlhbnQjJHtzdlF1YWxpZmllcn1gXG5cdFx0XHRcdFx0XHRcdCk/LmFubm90YXRpb247XG5cdFx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5zZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbiA9IHN2QW5ub3RhdGlvblxuXHRcdFx0XHRcdFx0XHRcdD8gY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0Py5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKGAke3N2QW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWV9L2ApXG5cdFx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRsZXQgcmVxdWlyZWRQcm9wZXJ0aWVzID0gW107XG5cdFx0XHRcdFx0XHRpZiAocGFyYW1ldGVyRW50aXR5VHlwZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzRW50aXR5U2V0ID0gY29sbGVjdGlvblBhdGguc3BsaXQoXCIvXCIpWzBdO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzTmF2aWdhdGlvblByb3BlcnR5ID0gY29sbGVjdGlvblBhdGguc3BsaXQoXCIvXCIpWzFdO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvRW50aXR5U2V0Q29udmVydGVyQ29udGV4dCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihgLyR7c0VudGl0eVNldH1gKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgYVJlc3RyaWN0ZWRQcm9wZXJ0aWVzID1cblx0XHRcdFx0XHRcdFx0XHRvRW50aXR5U2V0Q29udmVydGVyQ29udGV4dD8uZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnN0YXJ0aW5nRW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdFx0XHRcdFx0XHQ/Lk5hdmlnYXRpb25SZXN0cmljdGlvbnM/LlJlc3RyaWN0ZWRQcm9wZXJ0aWVzO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvUmVzdHJpY3RlZFByb3BlcnR5ID0gYVJlc3RyaWN0ZWRQcm9wZXJ0aWVzPy5maW5kKFxuXHRcdFx0XHRcdFx0XHRcdChyZXN0cmljdGVkTmF2UHJvcDogTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlcykgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlc3RyaWN0ZWROYXZQcm9wLk5hdmlnYXRpb25Qcm9wZXJ0eT8udHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3RyaWN0ZWROYXZQcm9wLk5hdmlnYXRpb25Qcm9wZXJ0eS52YWx1ZSA9PT0gc05hdmlnYXRpb25Qcm9wZXJ0eTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydGllcyA9IG9SZXN0cmljdGVkUHJvcGVydHk/LkZpbHRlclJlc3RyaWN0aW9ucz8uUmVxdWlyZWRQcm9wZXJ0aWVzIGFzIGFueVtdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZW50aXR5U2V0QW5ub3RhdGlvbnMgPSBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zO1xuXHRcdFx0XHRcdFx0XHRpZiAoIU1vZGVsSGVscGVyLmlzU2luZ2xldG9uKGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSkpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXF1aXJlZFByb3BlcnRpZXMgPSAoZW50aXR5U2V0QW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcyBhcyBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMpXG5cdFx0XHRcdFx0XHRcdFx0XHQ/LkZpbHRlclJlc3RyaWN0aW9ucz8uUmVxdWlyZWRQcm9wZXJ0aWVzIGFzIGFueVtdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRsZXQgcmVxdWlyZWRQcm9wZXJ0eVBhdGhzOiBBcnJheTxvYmplY3Q+ID0gW107XG5cdFx0XHRcdFx0XHRpZiAocmVxdWlyZWRQcm9wZXJ0aWVzPy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0cmVxdWlyZWRQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKG9SZXF1aXJlUHJvcGVydHk6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydHlQYXRocy5wdXNoKG9SZXF1aXJlUHJvcGVydHkudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydHlQYXRocyA9IHJlcXVpcmVkUHJvcGVydHlQYXRocy5jb25jYXQoYVBhcmFtZXRlcnMpO1xuXHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnJlcXVpcmVkUHJvcGVydGllcyA9IHJlcXVpcmVkUHJvcGVydHlQYXRocztcblx0XHRcdFx0XHRcdGlmICh2aXN1YWxGaWx0ZXIucmVxdWlyZWRQcm9wZXJ0aWVzPy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF2aXN1YWxGaWx0ZXIuaW5QYXJhbWV0ZXJzIHx8ICF2aXN1YWxGaWx0ZXIuaW5QYXJhbWV0ZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICghdmlzdWFsRmlsdGVyLnNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIuc2hvd092ZXJsYXlJbml0aWFsbHkgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc2VsZWN0T3B0aW9ucyA9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN2QW5ub3RhdGlvbj8uU2VsZWN0T3B0aW9ucz8ubWFwKChvU2VsZWN0T3B0aW9uOiBhbnkpID0+IG9TZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lLnZhbHVlKSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHBhcmFtZXRlck9wdGlvbnMgPVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdkFubm90YXRpb24/LlBhcmFtZXRlcnM/Lm1hcCgob1BhcmFtZXRlck9wdGlvbjogYW55KSA9PiBvUGFyYW1ldGVyT3B0aW9uLlByb3BlcnR5TmFtZS52YWx1ZSkgfHwgW107XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RPcHRpb25zID0gc2VsZWN0T3B0aW9ucy5jb25jYXQocGFyYW1ldGVyT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXF1aXJlZFByb3BlcnR5UGF0aHMgPSByZXF1aXJlZFByb3BlcnR5UGF0aHMuc29ydCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0T3B0aW9ucyA9IHNlbGVjdE9wdGlvbnMuc29ydCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnNob3dPdmVybGF5SW5pdGlhbGx5ID0gcmVxdWlyZWRQcm9wZXJ0eVBhdGhzLnNvbWUoZnVuY3Rpb24gKHNQYXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzZWxlY3RPcHRpb25zLmluZGV4T2Yoc1BhdGgpID09PSAtMTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIuc2hvd092ZXJsYXlJbml0aWFsbHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnNob3dPdmVybGF5SW5pdGlhbGx5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25zdCBzRGltZW5zaW9uVHlwZSA9IGNoYXJ0QW5ub3RhdGlvbj8uJHRhcmdldD8uRGltZW5zaW9uc1swXT8uJHRhcmdldD8udHlwZTtcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0IShcblx0XHRcdFx0XHRcdFx0XHRzRGltZW5zaW9uVHlwZSA9PT0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIiB8fFxuXHRcdFx0XHRcdFx0XHRcdHNEaW1lbnNpb25UeXBlID09PSBcIkVkbS5EYXRlXCIgfHxcblx0XHRcdFx0XHRcdFx0XHRzRGltZW5zaW9uVHlwZSA9PT0gXCJFZG0uVGltZU9mRGF5XCJcblx0XHRcdFx0XHRcdFx0KSAmJlxuXHRcdFx0XHRcdFx0XHRjaGFydEFubm90YXRpb24uJHRhcmdldC5DaGFydFR5cGUgPT09IFwiVUkuQ2hhcnRUeXBlL0xpbmVcIlxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5yZW5kZXJMaW5lQ2hhcnQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5yZW5kZXJMaW5lQ2hhcnQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5IaWdoLCBJc3N1ZVR5cGUuTUFMRk9STUVEX1ZJU1VBTEZJTFRFUlMuQ0hBUlQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0XHQuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5LkhpZ2gsIElzc3VlVHlwZS5NQUxGT1JNRURfVklTVUFMRklMVEVSUy5QUkVTRU5UQVRJT05WQVJJQU5UKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHQuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5LkhpZ2gsIElzc3VlVHlwZS5NQUxGT1JNRURfVklTVUFMRklMVEVSUy5WQUxVRUxJU1QpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldERpYWdub3N0aWNzKCkuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5NYW5pZmVzdCwgSXNzdWVTZXZlcml0eS5IaWdoLCBJc3N1ZVR5cGUuTUFMRk9STUVEX1ZJU1VBTEZJTFRFUlMuVkFMVUVMSVNUKTtcblx0fVxuXHRpZiAoT2JqZWN0LmtleXModmlzdWFsRmlsdGVyKS5sZW5ndGggPiAxKSB7XG5cdFx0cmV0dXJuIHZpc3VhbEZpbHRlcjtcblx0fVxufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQStCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsSUFBTUEsbUJBQW1CLEdBQUcsVUFDM0JDLGdCQUQyQixFQUUzQkMsZUFGMkIsRUFHM0JDLGlCQUgyQixFQUlMO0lBQUE7O0lBQ3RCLElBQUlDLFlBQUosRUFBa0JDLFVBQWxCLEVBQThCQyxhQUE5QjtJQUNBLElBQUlDLFFBQUo7SUFDQSxJQUFNQyxnQkFBZ0IsR0FBR0wsaUJBQWlCLENBQUNNLDZCQUFsQixFQUF6QjtJQUNBLElBQUlDLGtCQUFrQixHQUFHUCxpQkFBaUIsQ0FBQ1Esb0JBQWxCLEVBQXpCO0lBQ0EsSUFBSUMsZUFBZSxHQUFHLEVBQXRCLENBTHNCLENBTXRCOztJQUNBLElBQUlWLGVBQUosYUFBSUEsZUFBSix3Q0FBSUEsZUFBZSxDQUFFVyxPQUFyQixrREFBSSxzQkFBMEJDLFFBQTlCLEVBQXdDO01BQUE7O01BQ3ZDRixlQUFlLEdBQUdKLGdCQUFnQixDQUFDTyxNQUFqQixDQUF3QixVQUFVQyxPQUFWLEVBQW9DO1FBQUE7O1FBQzdFLE9BQU9BLE9BQU8sQ0FBQ0MsU0FBUixNQUFzQmYsZUFBdEIsYUFBc0JBLGVBQXRCLGlEQUFzQkEsZUFBZSxDQUFFVyxPQUF2QyxxRkFBc0IsdUJBQTBCQyxRQUFoRCxxRkFBc0IsdUJBQXFDLENBQXJDLENBQXRCLDJEQUFzQix1QkFBeUNJLEtBQS9ELENBQVA7TUFDQSxDQUZpQixDQUFsQjtNQUdBWCxRQUFRLEdBQUdLLGVBQWUsQ0FBQ08sTUFBaEIsR0FBeUIsQ0FBekIsR0FBNkJQLGVBQWUsQ0FBQyxDQUFELENBQWYsQ0FBbUJLLFNBQWhELEdBQTREZixlQUE1RCxhQUE0REEsZUFBNUQsaURBQTREQSxlQUFlLENBQUVXLE9BQTdFLHFGQUE0RCx1QkFBMEJDLFFBQXRGLHFGQUE0RCx1QkFBcUMsQ0FBckMsQ0FBNUQsMkRBQTRELHVCQUF5Q0ksS0FBaEg7SUFDQSxDQVpxQixDQWF0Qjs7O0lBQ0EsSUFBSSxDQUFDTixlQUFlLENBQUMsQ0FBRCxDQUFoQixJQUF1QlYsZUFBdkIsYUFBdUJBLGVBQXZCLHlDQUF1QkEsZUFBZSxDQUFFVyxPQUF4QyxtREFBdUIsdUJBQTBCTyxlQUFyRCxFQUFzRTtNQUFBOztNQUNyRWIsUUFBUSxHQUFHTixnQkFBZ0IsQ0FDekJvQixzQkFEUyxDQUNjcEIsZ0JBQWdCLENBQUNxQix5QkFBakIsMkJBQTJDcEIsZUFBZSxDQUFDVyxPQUFoQixDQUF3Qk8sZUFBbkUsc0ZBQTJDLHVCQUEwQyxDQUExQyxDQUEzQyw0REFBMkMsd0JBQThDRixLQUF6RixDQURkLEVBRVRLLHNCQUZTLEdBRWdCQyxZQUZoQixDQUU2QkMsSUFGeEM7TUFHQWYsa0JBQWtCLEdBQUdQLGlCQUFpQixDQUFDdUIsdUJBQWxCLENBQTBDLG9CQUExQyxDQUFyQjtJQUNBLENBTEQsTUFLTztNQUNOaEIsa0JBQWtCLEdBQUdQLGlCQUFpQixDQUFDdUIsdUJBQWxCLENBQTBDLHNCQUExQyxFQUFrRSxDQUFsRSxDQUFyQjtJQUNBOztJQUVELElBQU1DLFVBQWtCLEdBQUd6QixlQUFILGFBQUdBLGVBQUgsa0RBQUdBLGVBQWUsQ0FBRVcsT0FBcEIsdUZBQUcsd0JBQTBCZSxVQUExQixDQUFxQyxDQUFyQyxDQUFILDREQUFHLHdCQUF5Q1YsS0FBcEU7O0lBRUEsSUFDQ1YsZ0JBQWdCLENBQUNxQixJQUFqQixDQUFzQixVQUFVYixPQUFWLEVBQW9DO01BQ3pELE9BQU9BLE9BQU8sQ0FBQ0MsU0FBUixLQUFzQlYsUUFBN0I7SUFDQSxDQUZELENBREQsRUFJRTtNQUNESCxZQUFZLEdBQUdHLFFBQWY7SUFDQSxDQU5ELE1BTU8sSUFBSUcsa0JBQWtCLElBQUlBLGtCQUFrQixDQUFDLENBQUQsQ0FBNUMsRUFBaUQ7TUFDdkRBLGtCQUFrQixDQUFDbUIsSUFBbkIsQ0FBd0IsVUFBVUMsVUFBVixFQUEyQjtRQUNsRCxJQUFJQSxVQUFVLENBQUNMLElBQVgsS0FBb0JsQixRQUF4QixFQUFrQztVQUNqQ0gsWUFBWSxHQUFHMEIsVUFBSCxhQUFHQSxVQUFILHVCQUFHQSxVQUFVLENBQUVDLG9CQUFaLENBQWlDYixLQUFoRDtRQUNBO01BQ0QsQ0FKRDtJQUtBOztJQUNELElBQU1jLCtCQUErQixHQUFHN0IsaUJBQWlCLENBQUM4Qix5QkFBbEIsRUFBeEM7SUFDQSxJQUFNQyw0QkFBNEIsR0FBRy9CLGlCQUFpQixDQUFDZ0Msc0JBQWxCLEVBQXJDOztJQUNBLElBQUlILCtCQUErQixJQUFJQSwrQkFBK0IsQ0FBQ2IsTUFBdkUsRUFBK0U7TUFBQSwyQ0FDL0NhLCtCQUQrQztNQUFBOztNQUFBO1FBQzlFLG9EQUFnRTtVQUFBOztVQUFBLElBQXJESSxnQkFBcUQ7O1VBQy9ELElBQUksQ0FBQUEsZ0JBQWdCLFNBQWhCLElBQUFBLGdCQUFnQixXQUFoQixxQ0FBQUEsZ0JBQWdCLENBQUVDLFFBQWxCLGdGQUE0Qm5CLEtBQTVCLE1BQXNDZCxZQUExQyxFQUF3RDtZQUN2REUsYUFBYSxHQUFHLElBQWhCO1VBQ0E7UUFDRDtNQUw2RTtRQUFBO01BQUE7UUFBQTtNQUFBO0lBTTlFOztJQUNELElBQUk0Qiw0QkFBNEIsSUFBSUEsNEJBQTRCLENBQUNmLE1BQWpFLEVBQXlFO01BQUEsNENBQzVDZSw0QkFENEM7TUFBQTs7TUFBQTtRQUN4RSx1REFBMEQ7VUFBQSxJQUEvQ0ksYUFBK0M7O1VBQ3pELElBQUksQ0FBQUEsYUFBYSxTQUFiLElBQUFBLGFBQWEsV0FBYixZQUFBQSxhQUFhLENBQUVwQixLQUFmLE1BQXlCUyxVQUE3QixFQUF5QztZQUN4Q3RCLFVBQVUsR0FBRyxJQUFiO1VBQ0E7UUFDRDtNQUx1RTtRQUFBO01BQUE7UUFBQTtNQUFBO0lBTXhFOztJQUNELE9BQU9DLGFBQWEsSUFBSUQsVUFBeEI7RUFDQSxDQTNERDtFQTZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztFQUNPLFNBQVNrQyxnQkFBVCxDQUNOQyxVQURNLEVBRU52QyxnQkFGTSxFQUdOd0MsYUFITSxFQUlOQyxZQUpNLEVBS3NCO0lBQUE7O0lBQzVCLElBQU1DLFlBQTJCLEdBQUcsRUFBcEM7SUFDQSxJQUFNQyxhQUErQyxHQUFHRixZQUFZLENBQUNELGFBQUQsQ0FBcEU7O0lBQ0EsSUFBSUcsYUFBSixhQUFJQSxhQUFKLHdDQUFJQSxhQUFhLENBQUVELFlBQW5CLGtEQUFJLHNCQUE2QkUsU0FBakMsRUFBNEM7TUFBQTs7TUFDM0MsSUFBTUMsT0FBTyxHQUFHRixhQUFILGFBQUdBLGFBQUgsaURBQUdBLGFBQWEsQ0FBRUQsWUFBbEIsMkRBQUcsdUJBQTZCRSxTQUE3QztNQUNBLElBQU1FLHdCQUF3QixHQUFHRCxPQUFPLENBQUNFLEtBQVIsQ0FBYyxHQUFkLENBQWpDO01BQ0EsSUFBTUMsV0FBVyxHQUFHRix3QkFBd0IsQ0FBQzVCLE1BQXpCLEdBQWtDLENBQWxDLHVCQUFtRDRCLHdCQUF3QixDQUFDLENBQUQsQ0FBM0UsSUFBbUZBLHdCQUF3QixDQUFDLENBQUQsQ0FBL0g7TUFDQSxJQUFNRyxRQUFRLEdBQUdWLFVBQVUsQ0FBQ1csV0FBWCxDQUF1QlYsYUFBdkIsQ0FBakI7TUFDQSxJQUFNSSxTQUFjLEdBQUdLLFFBQUgsYUFBR0EsUUFBSCxnREFBR0EsUUFBUSxDQUFFRSxXQUFiLDBEQUFHLHNCQUF1QkMsTUFBdkIsQ0FBOEJKLFdBQTlCLENBQXZCOztNQUNBLElBQUlKLFNBQUosRUFBZTtRQUFBOztRQUNkLElBQU1TLGNBQWMsR0FBR1QsU0FBSCxhQUFHQSxTQUFILHVCQUFHQSxTQUFTLENBQUVVLGNBQWxDO1FBQ0EsSUFBTUMsOEJBQThCLEdBQUd2RCxnQkFBZ0IsQ0FBQ29CLHNCQUFqQixZQUNsQ2lDLGNBQWMsOEJBQUlyRCxnQkFBZ0IsQ0FBQ3dELFlBQWpCLEVBQUosMERBQUksc0JBQWlDQyxJQUFyQyxDQURvQixFQUF2QztRQUdBLElBQU1DLGVBQWUsR0FBR2QsU0FBSCxhQUFHQSxTQUFILHVCQUFHQSxTQUFTLENBQUVlLFVBQW5DO1FBQ0EsSUFBSUMsWUFBSjtRQUNBLElBQU1DLFlBQTJCLEdBQUcsRUFBcEM7UUFDQSxJQUFJQyxXQUEwQixHQUFHLEVBQWpDO1FBQ0EsSUFBTUMsbUJBQW1CLEdBQUdSLDhCQUE4QixDQUFDUyxzQkFBL0IsRUFBNUI7UUFDQUYsV0FBVyxHQUFHQyxtQkFBbUIsR0FDOUJBLG1CQUFtQixDQUFDRSxJQUFwQixDQUF5QkMsR0FBekIsQ0FBNkIsVUFBVUMsR0FBVixFQUFlO1VBQzVDLE9BQU9BLEdBQUcsQ0FBQ1YsSUFBWDtRQUNDLENBRkQsQ0FEOEIsR0FJOUIsRUFKSDs7UUFLQSxJQUFJekQsZ0JBQWdCLENBQUNvRSxjQUFqQixPQUFzQ2IsOEJBQThCLENBQUNhLGNBQS9CLEVBQTFDLEVBQTJGO1VBQzFGTixXQUFXLENBQUNPLE9BQVosQ0FBb0IsVUFBVUMsU0FBVixFQUEwQjtZQUM3Q1QsWUFBWSxDQUFDVSxJQUFiLENBQWtCO2NBQ2pCQyxpQkFBaUIsRUFBRUYsU0FERjtjQUVqQkcsaUJBQWlCLEVBQUVIO1lBRkYsQ0FBbEI7VUFJQSxDQUxEO1FBTUE7O1FBQ0QsSUFBSVosZUFBSixFQUFxQjtVQUFBLDRDQUNTQSxlQURUO1VBQUE7O1VBQUE7WUFDcEIsdURBQThDO2NBQUE7O2NBQUEsSUFBbkNnQixjQUFtQztjQUM3QyxJQUFNRixpQkFBaUIsNEJBQUdFLGNBQWMsQ0FBQ0MsaUJBQWxCLDBEQUFHLHNCQUFrQzFELEtBQTVEO2NBQ0EsSUFBTXdELGlCQUFpQixHQUFHQyxjQUFjLENBQUNFLGlCQUF6Qzs7Y0FDQSxJQUNDLENBQUMsQ0FBQUYsY0FBYyxTQUFkLElBQUFBLGNBQWMsV0FBZCxZQUFBQSxjQUFjLENBQUVHLEtBQWhCLE1BQTBCLHdEQUExQixJQUNBLENBQUFILGNBQWMsU0FBZCxJQUFBQSxjQUFjLFdBQWQsWUFBQUEsY0FBYyxDQUFFRyxLQUFoQixNQUEwQixzREFEM0IsS0FFQXJDLGFBQWEsS0FBS2dDLGlCQUhuQixFQUlFO2dCQUNEWixZQUFZLEdBQUdjLGNBQWY7Y0FDQTs7Y0FDRCxJQUNDLENBQUMsQ0FBQUEsY0FBYyxTQUFkLElBQUFBLGNBQWMsV0FBZCxZQUFBQSxjQUFjLENBQUVHLEtBQWhCLE1BQTBCLHdEQUExQixJQUNBLENBQUFILGNBQWMsU0FBZCxJQUFBQSxjQUFjLFdBQWQsWUFBQUEsY0FBYyxDQUFFRyxLQUFoQixNQUEwQixxREFEM0IsS0FFQXJDLGFBQWEsS0FBS2dDLGlCQUhuQixFQUlFO2dCQUNELElBQU1NLGNBQWMsR0FBR0Msb0JBQW9CLENBQUN4Qiw4QkFBRCxFQUFpQ2tCLGlCQUFqQyxDQUEzQzs7Z0JBQ0EsSUFBSSxDQUFDSyxjQUFMLEVBQXFCO2tCQUNwQmpCLFlBQVksQ0FBQ1UsSUFBYixDQUFrQjtvQkFDakJDLGlCQUFpQixFQUFFQSxpQkFERjtvQkFFakJDLGlCQUFpQixFQUFFQTtrQkFGRixDQUFsQjtnQkFJQTtjQUNEO1lBQ0Q7VUF4Qm1CO1lBQUE7VUFBQTtZQUFBO1VBQUE7UUF5QnBCOztRQUNELElBQUlaLFlBQVksSUFBSUEsWUFBWSxDQUFDM0MsTUFBakMsRUFBeUM7VUFDeEMyQyxZQUFZLENBQUNRLE9BQWIsQ0FBcUIsVUFBVVcsWUFBVixFQUE2QjtZQUNqRCxJQUFNQyx1Q0FBdUMsR0FBR0MsaUJBQWlCLENBQ2hFQyxpQ0FBaUMsQ0FDaENuRixnQkFBZ0IsQ0FDZG9CLHNCQURGLENBQ3lCcEIsZ0JBQWdCLENBQUNxQix5QkFBakIsQ0FBMkMyRCxZQUEzQyxhQUEyQ0EsWUFBM0MsdUJBQTJDQSxZQUFZLENBQUVSLGlCQUF6RCxDQUR6QixFQUVFbEQsc0JBRkYsRUFEZ0MsRUFJaEMsQ0FBQyxhQUFELENBSmdDLENBRCtCLENBQWpFO1lBUUEsSUFBTThELDRDQUE0QyxHQUFHRixpQkFBaUIsQ0FDckVDLGlDQUFpQyxDQUNoQzVCLDhCQUE4QixDQUM1Qm5DLHNCQURGLENBRUVtQyw4QkFBOEIsQ0FBQ2xDLHlCQUEvQixDQUF5RDJELFlBQXpELGFBQXlEQSxZQUF6RCx1QkFBeURBLFlBQVksQ0FBRVAsaUJBQXZFLENBRkYsRUFJRW5ELHNCQUpGLEVBRGdDLEVBTWhDLENBQUMsYUFBRCxDQU5nQyxDQURvQyxDQUF0RTs7WUFVQSxJQUFJOEQsNENBQTRDLEtBQUssTUFBakQsSUFBMkRILHVDQUF1QyxLQUFLLE9BQTNHLEVBQW9IO2NBQ25ILE1BQU0sSUFBSUksS0FBSixpQ0FBbUM3QyxhQUFuQyw0REFBTjtZQUNBO1VBQ0QsQ0F0QkQ7UUF1QkE7O1FBQ0QsSUFBTThDLFdBQVcsR0FBRzFDLFNBQUgsYUFBR0EsU0FBSCx1QkFBR0EsU0FBUyxDQUFFMkMsNEJBQS9CO1FBQ0EsSUFBTUMsV0FBVyxHQUFHNUMsU0FBSCxhQUFHQSxTQUFILHVCQUFHQSxTQUFTLENBQUU2Qyx5QkFBL0I7UUFDQSxJQUFNQyxZQUFpQixHQUFHbkMsOEJBQUgsYUFBR0EsOEJBQUgsZ0RBQUdBLDhCQUE4QixDQUFFb0MsdUJBQWhDLG1DQUNFTCxXQURGLEVBQUgsMERBQUcsc0JBRXZCTSxVQUZIO1FBR0EsSUFBTTFGLGlCQUFpQixHQUFHLElBQUkyRixpQkFBSixDQUFzQnRDLDhCQUE4QixDQUFDdUMsYUFBL0IsRUFBdEIsRUFBc0V2Qyw4QkFBdEUsQ0FBMUI7O1FBQ0EsSUFBSSxDQUFDckQsaUJBQWlCLENBQUM2RixvQkFBbEIsRUFBTCxFQUErQztVQUM5QztRQUNBOztRQUNELElBQUlMLFlBQUosRUFBa0I7VUFBQTs7VUFDakIsSUFBTU0sZUFBZSxHQUFHTixZQUFILGFBQUdBLFlBQUgsdUJBQUdBLFlBQVksQ0FBRU8sY0FBdEM7VUFDQSxJQUFNQyxXQUFXLEdBQUcsV0FBSXRELFNBQUosYUFBSUEsU0FBSix1QkFBSUEsU0FBUyxDQUFFVSxjQUFmLGdCQUF1Q0MsOEJBQXZDLGFBQXVDQSw4QkFBdkMsaURBQXVDQSw4QkFBOEIsQ0FBRUMsWUFBaEMsRUFBdkMsMkRBQXVDLHVCQUFnREMsSUFBdkYsQ0FBcEI7VUFDQWYsWUFBWSxDQUFDd0QsV0FBYixHQUEyQkEsV0FBM0I7VUFDQSxJQUFJakcsZUFBSjs7VUFKaUIsNENBS1crRixlQUxYO1VBQUE7O1VBQUE7WUFLakIsdURBQTZDO2NBQUE7O2NBQUEsSUFBbENHLGFBQWtDOztjQUM1QyxJQUFJLDBCQUFBQSxhQUFhLENBQUN2RixPQUFkLGdGQUF1QndGLElBQXZCLE1BQWdDLGtDQUFwQyxFQUF3RTtnQkFDdkVuRyxlQUFlLEdBQUdrRyxhQUFsQjtnQkFDQTtjQUNBO1lBQ0Q7VUFWZ0I7WUFBQTtVQUFBO1lBQUE7VUFBQTs7VUFXakIsSUFBSWxHLGVBQUosRUFBcUI7WUFBQTs7WUFDcEIsSUFBTW9HLGtCQUF1QyxHQUFHdEcsbUJBQW1CLENBQ2xFd0QsOEJBRGtFLEVBRWxFdEQsZUFGa0UsRUFHbEVDLGlCQUhrRSxDQUFuRTs7WUFLQSxJQUFJLENBQUNtRyxrQkFBTCxFQUF5QjtjQUN4QjtZQUNBOztZQUNELElBQU1DLGdCQUF5Qix1QkFBR3JHLGVBQUgsZ0ZBQUcsaUJBQWlCVyxPQUFwQix1RkFBRyx3QkFBMEJlLFVBQTFCLENBQXFDLENBQXJDLENBQUgsdUZBQUcsd0JBQXlDZixPQUE1Qyx1RkFBRyx3QkFBa0R1QyxXQUFyRCx1RkFBRyx3QkFBK0RvRCxFQUFsRSx1RkFBRyx3QkFBbUVDLE1BQXRFLDREQUFHLHdCQUEyRUMsT0FBM0UsRUFBbEM7WUFDQSxJQUFNQyxzQkFBK0Isd0JBQ3BDekcsZUFEb0MsK0VBQ3BDLGtCQUFpQlcsT0FEbUIsb0ZBQ3BDLHNCQUEwQmUsVUFBMUIsQ0FBcUMsQ0FBckMsQ0FEb0MscUZBQ3BDLHVCQUF5Q2YsT0FETCxxRkFDcEMsdUJBQWtEdUMsV0FEZCxxRkFDcEMsdUJBQStEb0QsRUFEM0IscUZBQ3BDLHVCQUFtRUksWUFEL0IsMkRBQ3BDLHVCQUFpRkYsT0FBakYsRUFERDs7WUFFQSxJQUFJSCxnQkFBZ0IsS0FBSyxJQUFyQixJQUE2Qkksc0JBQXNCLEtBQUssSUFBNUQsRUFBa0U7Y0FDakU7WUFDQSxDQUZELE1BRU8sSUFBSVYsZUFBZSxJQUFJQSxlQUFlLENBQUM5RSxNQUF2QyxFQUErQztjQUFBOztjQUNyRHdCLFlBQVksQ0FBQ3pDLGVBQWIsR0FBK0JBLGVBQWUsR0FDM0NzRCw4QkFEMkMsYUFDM0NBLDhCQUQyQyx1QkFDM0NBLDhCQUE4QixDQUFFbEMseUJBQWhDLFdBQ0dwQixlQUFlLENBQUMyRyxrQkFEbkIsdUJBRDJDLEdBSTNDQyxTQUpIO2NBS0FuRSxZQUFZLENBQUNvRSxzQkFBYixHQUFzQ3BCLFlBQVksR0FDL0NuQyw4QkFEK0MsYUFDL0NBLDhCQUQrQyx1QkFDL0NBLDhCQUE4QixDQUFFbEMseUJBQWhDLFdBQTZEcUUsWUFBWSxDQUFDa0Isa0JBQTFFLE9BRCtDLEdBRS9DQyxTQUZIO2NBR0FuRSxZQUFZLENBQUNrQixZQUFiLG9CQUE0QkEsWUFBNUIsMkVBQTRCLGNBQWNlLGlCQUExQywwREFBNEIsc0JBQWlDMUQsS0FBN0Q7Y0FDQXlCLFlBQVksQ0FBQ21CLFlBQWIsR0FBNEJBLFlBQTVCO2NBQ0EsSUFBTWtELFFBQVEsR0FBRzVCLGlDQUFpQyxDQUNqRG5GLGdCQUFnQixDQUNkb0Isc0JBREYsQ0FDeUJwQixnQkFBZ0IsQ0FBQ3FCLHlCQUFqQixDQUEyQ21CLGFBQTNDLENBRHpCLEVBRUVsQixzQkFGRixFQURpRCxFQUlqRCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsQ0FKaUQsQ0FBbEQ7O2NBT0EsSUFBSTRELGlCQUFpQixDQUFDNkIsUUFBRCxDQUFqQixLQUFnQyxNQUFwQyxFQUE0QztnQkFDM0MsTUFBTSxJQUFJMUIsS0FBSixDQUFVLDZEQUFWLENBQU47Y0FDQTs7Y0FFRCxJQUFNMkIsK0JBQW9DLEdBQUc3QixpQ0FBaUMsQ0FDN0VuRixnQkFBZ0IsQ0FDZG9CLHNCQURGLENBQ3lCcEIsZ0JBQWdCLENBQUNxQix5QkFBakIsQ0FBMkNtQixhQUEzQyxDQUR6QixFQUVFbEIsc0JBRkYsRUFENkUsRUFJN0UsQ0FBQyxhQUFELENBSjZFLENBQTlFO2NBTUFvQixZQUFZLENBQUN1RSx3QkFBYixHQUF3Qy9CLGlCQUFpQixDQUFDLENBQUM4QiwrQkFBK0IsQ0FBQy9GLEtBQWxDLENBQXpEO2NBQ0F5QixZQUFZLENBQUN3RSxRQUFiLEdBQXdCQyxhQUFhLENBQUNuSCxnQkFBRCxFQUFtQndDLGFBQW5CLENBQXJDO2NBQ0EsSUFBSTRFLFlBQUo7O2NBQ0EsSUFBSTVCLFdBQUosRUFBaUI7Z0JBQUE7O2dCQUNoQjRCLFlBQVksR0FBRzdELDhCQUFILGFBQUdBLDhCQUFILGlEQUFHQSw4QkFBOEIsQ0FBRW9DLHVCQUFoQyxnQ0FDVUgsV0FEVixFQUFILDJEQUFHLHVCQUVaSSxVQUZIO2dCQUdBbEQsWUFBWSxDQUFDMkUsMEJBQWIsR0FBMENELFlBQVksR0FDbkQ3RCw4QkFEbUQsYUFDbkRBLDhCQURtRCx1QkFDbkRBLDhCQUE4QixDQUFFbEMseUJBQWhDLFdBQTZEK0YsWUFBWSxDQUFDUixrQkFBMUUsT0FEbUQsR0FFbkRDLFNBRkg7Y0FHQTs7Y0FDRCxJQUFJUyxrQkFBa0IsR0FBRyxFQUF6Qjs7Y0FDQSxJQUFJdkQsbUJBQUosRUFBeUI7Z0JBQUE7O2dCQUN4QixJQUFNd0QsVUFBVSxHQUFHbEUsY0FBYyxDQUFDTixLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQW5CO2dCQUNBLElBQU15RSxtQkFBbUIsR0FBR25FLGNBQWMsQ0FBQ04sS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixDQUE1QjtnQkFDQSxJQUFNMEUsMEJBQTBCLEdBQUd6SCxnQkFBZ0IsQ0FBQ29CLHNCQUFqQixZQUE0Q21HLFVBQTVDLEVBQW5DO2dCQUNBLElBQU1HLHFCQUFxQixHQUMxQkQsMEJBRDBCLGFBQzFCQSwwQkFEMEIsZ0RBQzFCQSwwQkFBMEIsQ0FBRW5HLHNCQUE1QixHQUFxRHFHLGlCQUQzQixvRkFDMUIsc0JBQXdFeEUsV0FEOUMscUZBQzFCLHVCQUFxRnlFLFlBRDNELHFGQUMxQix1QkFDR0Msc0JBRnVCLDJEQUMxQix1QkFDMkJDLG9CQUY1QjtnQkFHQSxJQUFNQyxtQkFBbUIsR0FBR0wscUJBQUgsYUFBR0EscUJBQUgsdUJBQUdBLHFCQUFxQixDQUFFTSxJQUF2QixDQUMzQixVQUFDQyxpQkFBRCxFQUEyRDtrQkFBQTs7a0JBQzFELElBQUksMEJBQUFBLGlCQUFpQixDQUFDQyxrQkFBbEIsZ0ZBQXNDQyxJQUF0QyxNQUErQyx3QkFBbkQsRUFBNkU7b0JBQzVFLE9BQU9GLGlCQUFpQixDQUFDQyxrQkFBbEIsQ0FBcUNqSCxLQUFyQyxLQUErQ3VHLG1CQUF0RDtrQkFDQTtnQkFDRCxDQUwwQixDQUE1QjtnQkFPQUYsa0JBQWtCLEdBQUdTLG1CQUFILGFBQUdBLG1CQUFILGdEQUFHQSxtQkFBbUIsQ0FBRUssa0JBQXhCLDBEQUFHLHNCQUF5Q0Msa0JBQTlEO2NBQ0EsQ0FmRCxNQWVPO2dCQUFBOztnQkFDTixJQUFNQyxvQkFBb0IsNkJBQUcvRSw4QkFBOEIsQ0FBQ0MsWUFBL0IsRUFBSCwyREFBRyx1QkFBK0NMLFdBQTVFOztnQkFDQSxJQUFJLENBQUNvRixXQUFXLENBQUNDLFdBQVosQ0FBd0JqRiw4QkFBOEIsQ0FBQ0MsWUFBL0IsRUFBeEIsQ0FBTCxFQUE2RTtrQkFBQTs7a0JBQzVFOEQsa0JBQWtCLEdBQUlnQixvQkFBSixhQUFJQSxvQkFBSixnREFBSUEsb0JBQW9CLENBQUVWLFlBQTFCLG9GQUFHLHNCQUNsQlEsa0JBRGUsMkRBQUcsdUJBQ0VDLGtCQUR2QjtnQkFFQTtjQUNEOztjQUNELElBQUlJLHFCQUFvQyxHQUFHLEVBQTNDOztjQUNBLDJCQUFJbkIsa0JBQUosZ0RBQUksb0JBQW9CcEcsTUFBeEIsRUFBZ0M7Z0JBQy9Cb0csa0JBQWtCLENBQUNqRCxPQUFuQixDQUEyQixVQUFVcUUsZ0JBQVYsRUFBaUM7a0JBQzNERCxxQkFBcUIsQ0FBQ2xFLElBQXRCLENBQTJCbUUsZ0JBQWdCLENBQUN6SCxLQUE1QztnQkFDQSxDQUZEO2NBR0E7O2NBQ0R3SCxxQkFBcUIsR0FBR0EscUJBQXFCLENBQUNFLE1BQXRCLENBQTZCN0UsV0FBN0IsQ0FBeEI7Y0FDQXBCLFlBQVksQ0FBQzRFLGtCQUFiLEdBQWtDbUIscUJBQWxDOztjQUNBLDZCQUFJL0YsWUFBWSxDQUFDNEUsa0JBQWpCLGtEQUFJLHNCQUFpQ3BHLE1BQXJDLEVBQTZDO2dCQUM1QyxJQUFJLENBQUN3QixZQUFZLENBQUNtQixZQUFkLElBQThCLENBQUNuQixZQUFZLENBQUNtQixZQUFiLENBQTBCM0MsTUFBN0QsRUFBcUU7a0JBQ3BFLElBQUksQ0FBQ3dCLFlBQVksQ0FBQzJFLDBCQUFsQixFQUE4QztvQkFDN0MzRSxZQUFZLENBQUNrRyxvQkFBYixHQUFvQyxJQUFwQztrQkFDQSxDQUZELE1BRU87b0JBQUE7O29CQUNOLElBQUlDLGFBQWEsR0FDaEIsa0JBQUF6QixZQUFZLFVBQVosK0VBQWMwQixhQUFkLGdGQUE2QjVFLEdBQTdCLENBQWlDLFVBQUM2RSxhQUFEO3NCQUFBLE9BQXdCQSxhQUFhLENBQUNDLFlBQWQsQ0FBMkIvSCxLQUFuRDtvQkFBQSxDQUFqQyxNQUE4RixFQUQvRjtvQkFFQSxJQUFNZ0ksZ0JBQWdCLEdBQ3JCLG1CQUFBN0IsWUFBWSxVQUFaLGlGQUFjekQsVUFBZCxnRkFBMEJPLEdBQTFCLENBQThCLFVBQUNnRixnQkFBRDtzQkFBQSxPQUEyQkEsZ0JBQWdCLENBQUNGLFlBQWpCLENBQThCL0gsS0FBekQ7b0JBQUEsQ0FBOUIsTUFBaUcsRUFEbEc7b0JBRUE0SCxhQUFhLEdBQUdBLGFBQWEsQ0FBQ0YsTUFBZCxDQUFxQk0sZ0JBQXJCLENBQWhCO29CQUNBUixxQkFBcUIsR0FBR0EscUJBQXFCLENBQUNVLElBQXRCLEVBQXhCO29CQUNBTixhQUFhLEdBQUdBLGFBQWEsQ0FBQ00sSUFBZCxFQUFoQjtvQkFDQXpHLFlBQVksQ0FBQ2tHLG9CQUFiLEdBQW9DSCxxQkFBcUIsQ0FBQzdHLElBQXRCLENBQTJCLFVBQVV3SCxLQUFWLEVBQWlCO3NCQUMvRSxPQUFPUCxhQUFhLENBQUNRLE9BQWQsQ0FBc0JELEtBQXRCLE1BQWlDLENBQUMsQ0FBekM7b0JBQ0EsQ0FGbUMsQ0FBcEM7a0JBR0E7Z0JBQ0QsQ0FmRCxNQWVPO2tCQUNOMUcsWUFBWSxDQUFDa0csb0JBQWIsR0FBb0MsS0FBcEM7Z0JBQ0E7Y0FDRCxDQW5CRCxNQW1CTztnQkFDTmxHLFlBQVksQ0FBQ2tHLG9CQUFiLEdBQW9DLEtBQXBDO2NBQ0E7O2NBQ0QsSUFBTVUsY0FBYyx3QkFBR3JKLGVBQUgsK0VBQUcsa0JBQWlCVyxPQUFwQixvRkFBRyxzQkFBMEJlLFVBQTFCLENBQXFDLENBQXJDLENBQUgscUZBQUcsdUJBQXlDZixPQUE1QywyREFBRyx1QkFBa0R1SCxJQUF6RTs7Y0FDQSxJQUNDLEVBQ0NtQixjQUFjLEtBQUssb0JBQW5CLElBQ0FBLGNBQWMsS0FBSyxVQURuQixJQUVBQSxjQUFjLEtBQUssZUFIcEIsS0FLQXJKLGVBQWUsQ0FBQ1csT0FBaEIsQ0FBd0IySSxTQUF4QixLQUFzQyxtQkFOdkMsRUFPRTtnQkFDRDdHLFlBQVksQ0FBQzhHLGVBQWIsR0FBK0IsS0FBL0I7Y0FDQSxDQVRELE1BU087Z0JBQ045RyxZQUFZLENBQUM4RyxlQUFiLEdBQStCLElBQS9CO2NBQ0E7WUFDRDtVQUNELENBeEhELE1Bd0hPO1lBQ054SixnQkFBZ0IsQ0FDZHlKLGNBREYsR0FFRUMsUUFGRixDQUVXQyxhQUFhLENBQUNDLFVBRnpCLEVBRXFDQyxhQUFhLENBQUNDLElBRm5ELEVBRXlEQyxTQUFTLENBQUNDLHVCQUFWLENBQWtDQyxLQUYzRjtVQUdBO1FBQ0QsQ0F4SUQsTUF3SU87VUFDTmpLLGdCQUFnQixDQUNkeUosY0FERixHQUVFQyxRQUZGLENBRVdDLGFBQWEsQ0FBQ0MsVUFGekIsRUFFcUNDLGFBQWEsQ0FBQ0MsSUFGbkQsRUFFeURDLFNBQVMsQ0FBQ0MsdUJBQVYsQ0FBa0NFLG1CQUYzRjtRQUdBO01BQ0QsQ0FoT0QsTUFnT087UUFDTmxLLGdCQUFnQixDQUNkeUosY0FERixHQUVFQyxRQUZGLENBRVdDLGFBQWEsQ0FBQ0MsVUFGekIsRUFFcUNDLGFBQWEsQ0FBQ0MsSUFGbkQsRUFFeURDLFNBQVMsQ0FBQ0MsdUJBQVYsQ0FBa0NHLFNBRjNGO01BR0E7SUFDRCxDQTNPRCxNQTJPTztNQUNObkssZ0JBQWdCLENBQUN5SixjQUFqQixHQUFrQ0MsUUFBbEMsQ0FBMkNDLGFBQWEsQ0FBQ1MsUUFBekQsRUFBbUVQLGFBQWEsQ0FBQ0MsSUFBakYsRUFBdUZDLFNBQVMsQ0FBQ0MsdUJBQVYsQ0FBa0NHLFNBQXpIO0lBQ0E7O0lBQ0QsSUFBSUUsTUFBTSxDQUFDcEcsSUFBUCxDQUFZdkIsWUFBWixFQUEwQnhCLE1BQTFCLEdBQW1DLENBQXZDLEVBQTBDO01BQ3pDLE9BQU93QixZQUFQO0lBQ0E7RUFDRCJ9