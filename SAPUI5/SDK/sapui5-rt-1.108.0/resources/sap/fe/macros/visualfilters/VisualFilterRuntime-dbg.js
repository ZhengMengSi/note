/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/controls/filterbar/utils/VisualFilterUtils", "sap/fe/core/templating/FilterHelper", "sap/fe/macros/CommonHelper", "sap/fe/macros/filter/FilterUtils", "sap/ui/core/Core", "sap/ui/mdc/condition/Condition", "sap/fe/core/type/TypeUtil", "sap/ui/mdc/util/FilterUtil", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Log, VisualFilterUtils, FilterHelper, CommonHelper, FilterUtils, Core, Condition, TypeUtil, MdcFilterUtil, Filter, FilterOperator) {
  "use strict";

  var getFiltersConditionsFromSelectionVariant = FilterHelper.getFiltersConditionsFromSelectionVariant;

  /**
   * Static class used by Visual Filter during runtime
   *
   * @private
   * @experimental This module is only for internal/experimental use!
   */
  var VisualFilterRuntime = {
    selectionChanged: function (oEvent) {
      var oInteractiveChart = oEvent.getSource();
      var sOutParameter = oInteractiveChart.data("outParameter");
      var sDimension = oInteractiveChart.data("dimension");
      var sDimensionText = oInteractiveChart.data("dimensionText");
      var bMultipleSelectionAllowed = oInteractiveChart.data("multipleSelectionAllowed");
      var sDimensionType = oInteractiveChart.data("dimensionType");
      var oSelectedAggregation = oEvent.getParameter("bar") || oEvent.getParameter("point") || oEvent.getParameter("segment");
      var bIsAggregationSelected = oEvent.getParameter("selected");
      var oConditionModel = oInteractiveChart.getModel("$field");
      var aConditions = oConditionModel.getProperty("/conditions");

      if (!sOutParameter || sOutParameter !== sDimension) {
        Log.error("VisualFilter: Cannot sync values with regular filter as out parameter is not configured properly!");
      } else {
        var sSelectionChangedValue = oSelectedAggregation.getBindingContext().getObject(sOutParameter);

        if (sSelectionChangedValue) {
          var sSelectionChangedValueText = oSelectedAggregation.getBindingContext().getObject(sDimensionText);

          if (typeof sSelectionChangedValueText !== "string" && !(sSelectionChangedValueText instanceof String)) {
            sSelectionChangedValueText = undefined;
          } // if selection has been done on the aggregation then add to conditions


          if (bIsAggregationSelected) {
            if (bMultipleSelectionAllowed === "false") {
              aConditions = [];
            }

            if (sDimensionType === "Edm.DateTimeOffset") {
              sSelectionChangedValue = VisualFilterUtils._parseDateTime(sSelectionChangedValue);
            }

            var oCondition = Condition.createItemCondition(sSelectionChangedValue, sSelectionChangedValueText || undefined, {}, {});
            aConditions.push(oCondition);
          } else {
            // because selection was removed on the aggregation hence remove this from conditions
            aConditions = aConditions.filter(function (oCondition) {
              if (sDimensionType === "Edm.DateTimeOffset") {
                return oCondition.operator !== "EQ" || Date.parse(oCondition.values[0]) !== Date.parse(sSelectionChangedValue);
              }

              return oCondition.operator !== "EQ" || oCondition.values[0] !== sSelectionChangedValue;
            });
          }

          oConditionModel.setProperty("/conditions", aConditions);
        } else {
          Log.error("VisualFilter: No vaue found for the outParameter");
        }
      }
    },
    // THIS IS A FORMATTER
    getAggregationSelected: function (aConditions) {
      var _this$getBindingConte;

      var aSelectableValues = [];

      if (!this.getBindingContext()) {
        return;
      }

      for (var i = 0; i <= aConditions.length - 1; i++) {
        var oCondition = aConditions[i]; // 1. get conditions with EQ operator (since visual filter can only deal with EQ operators) and get their values

        if (oCondition.operator === "EQ") {
          aSelectableValues.push(oCondition.values[0]);
        }
      } // access the interactive chart from the control.


      var oInteractiveChart = this.getParent();
      var sDimension = oInteractiveChart.data("dimension");
      var sDimensionType = oInteractiveChart.data("dimensionType");
      var sDimensionValue = (_this$getBindingConte = this.getBindingContext()) === null || _this$getBindingConte === void 0 ? void 0 : _this$getBindingConte.getObject(sDimension);

      if (sDimensionType === "Edm.DateTimeOffset") {
        sDimensionValue = VisualFilterUtils._parseDateTime(sDimensionValue);
      }

      return aSelectableValues.indexOf(sDimensionValue) > -1;
    },
    // THIS IS A FORMATTER
    getFiltersFromConditions: function () {
      for (var _len = arguments.length, aArguments = new Array(_len), _key = 0; _key < _len; _key++) {
        aArguments[_key] = arguments[_key];
      }

      var oInteractiveChart = this.getParent();
      var oFilterBar = oInteractiveChart.getParent().getParent().getParent().getParent();
      var aInParameters = oInteractiveChart.data("inParameters").customData;
      var bIsDraftSupported = oInteractiveChart.data("draftSupported") === "true";
      var aPropertyInfoSet = oFilterBar.getPropertyInfo();
      var mConditions = {};
      var aValueListPropertyInfoSet = [];
      var oFilters;
      var aFilters = [];
      var aParameters = oInteractiveChart.data("parameters").customData;
      var oSelectionVariantAnnotation = CommonHelper.parseCustomData(oInteractiveChart.data("selectionVariantAnnotation"));
      var oInteractiveChartListBinding = oInteractiveChart.getBinding("bars") || oInteractiveChart.getBinding("points") || oInteractiveChart.getBinding("segments");
      var sPath = oInteractiveChartListBinding.getPath();
      var oMetaModel = oInteractiveChart.getModel().getMetaModel();
      var sEntitySetPath = oInteractiveChartListBinding.getPath();
      var filterConditions = getFiltersConditionsFromSelectionVariant(sEntitySetPath, oMetaModel, oSelectionVariantAnnotation, VisualFilterUtils.getCustomConditions.bind(VisualFilterUtils));

      for (var i in aPropertyInfoSet) {
        aPropertyInfoSet[i].typeConfig = TypeUtil.getTypeConfig(aPropertyInfoSet[i].dataType, {}, {});
      }

      var oSelectionVariantConditions = VisualFilterUtils.convertFilterCondions(filterConditions); // aInParameters and the bindings to in parameters are in the same order so we can rely on it to create our conditions

      Object.keys(oSelectionVariantConditions).forEach(function (sKey) {
        mConditions[sKey] = oSelectionVariantConditions[sKey]; //fetch localDataProperty if selection variant key is based on vaue list property

        var inParameterForKey = aInParameters.find(function (inParameter) {
          return inParameter.valueListProperty === sKey;
        });
        var localDataProperty = inParameterForKey ? inParameterForKey.localDataProperty : sKey;

        if (!aParameters || aParameters && aParameters.indexOf(sKey) === -1) {
          for (var _i in aPropertyInfoSet) {
            var propertyInfoSet = aPropertyInfoSet[_i];

            if (localDataProperty === propertyInfoSet.name) {
              if (propertyInfoSet.typeConfig.baseType === "DateTime") {
                if (mConditions[sKey]) {
                  mConditions[sKey].forEach(function (condition) {
                    condition.values[0] = VisualFilterUtils._formatDateTime(condition.values[0]);
                  });
                }
              }

              aValueListPropertyInfoSet.push({
                name: sKey,
                typeConfig: propertyInfoSet.typeConfig
              });
            }
          }
        }
      });
      aInParameters.forEach(function (oInParameter, index) {
        if (aArguments[index].length > 0) {
          // store conditions with value list property since we are filtering on the value list collection path
          mConditions[oInParameter.valueListProperty] = aArguments[index];

          if (!aParameters || aParameters && aParameters.indexOf(oInParameter.valueListProperty) === -1) {
            // aPropertyInfoSet is list of properties from the filter bar but we need to create conditions for the value list
            // which could have a different collectionPath.
            // Only typeConfig from aPropertyInfoSet is required for getting the converted filters from conditions
            // so we update aPropertyInfoSet to have the valueListProperties only
            // This way conditions will be converted to sap.ui.model.Filter for the value list
            // This works because for in parameter mapping the property from the main entity type should be of the same type as the value list entity type
            // TODO: Follow up with MDC to check if they can provide a clean api to convert conditions into filters
            for (var _i2 in aPropertyInfoSet) {
              // store conditions with value list property since we are filtering on the value list collection path
              var propertyInfoSet = aPropertyInfoSet[_i2];

              if (propertyInfoSet.name === oInParameter.localDataProperty) {
                if (propertyInfoSet.typeConfig.baseType === "DateTime") {
                  if (mConditions[oInParameter.valueListProperty]) {
                    mConditions[oInParameter.valueListProperty].forEach(function (condition) {
                      condition.values[0] = VisualFilterUtils._formatDateTime(condition.values[0]);
                    });
                  }
                }

                aValueListPropertyInfoSet.push({
                  name: oInParameter.valueListProperty,
                  typeConfig: propertyInfoSet.typeConfig
                });
              }
            }
          }
        }
      });
      var oInternalModelContext = oInteractiveChart.getBindingContext("internal");
      var sInfoPath = oInteractiveChart.data("infoPath");
      var bEnableBinding;
      var oResourceBundle = Core.getLibraryResourceBundle("sap.fe.macros");
      var aRequiredProperties = CommonHelper.parseCustomData(oInteractiveChart.data("requiredProperties"));

      if (aRequiredProperties.length) {
        var aConditions = Object.keys(mConditions) || [];
        var aNotMatchedConditions = [];
        aRequiredProperties.forEach(function (requiredPropertyPath) {
          if (aConditions.indexOf(requiredPropertyPath) === -1) {
            aNotMatchedConditions.push(requiredPropertyPath);
          }
        });

        if (!aNotMatchedConditions.length) {
          bEnableBinding = oInternalModelContext.getProperty("".concat(sInfoPath, "/showError"));
          oInternalModelContext.setProperty(sInfoPath, {
            "errorMessageTitle": "",
            "errorMessage": "",
            "showError": false
          });
        } else if (aNotMatchedConditions.length > 1) {
          oInternalModelContext.setProperty(sInfoPath, {
            "errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
            "errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_MULTIPLEVF"),
            "showError": true
          });
          return;
        } else {
          var sLabel = oMetaModel.getObject("".concat(sEntitySetPath, "/").concat(aNotMatchedConditions[0], "@com.sap.vocabularies.Common.v1.Label")) || aNotMatchedConditions[0];
          oInternalModelContext.setProperty(sInfoPath, {
            "errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
            "errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_SINGLEVF", sLabel),
            "showError": true
          });
          return;
        }
      } else {
        bEnableBinding = oInternalModelContext.getProperty("".concat(sInfoPath, "/showError"));
        oInternalModelContext.setProperty(sInfoPath, {
          "errorMessageTitle": "",
          "errorMessage": "",
          "showError": false
        });
      }

      var sFilterEntityName = oFilterBar.data("entityType").split("/")[1];
      var sChartEntityName = sPath.split("/")[1].split("(")[0];

      if (aParameters && aParameters.length && sFilterEntityName === sChartEntityName) {
        var sBindingPath = bEnableBinding ? FilterUtils.getBindingPathForParameters(oFilterBar, mConditions, aPropertyInfoSet, aParameters) : undefined;

        if (sBindingPath) {
          oInteractiveChartListBinding.sPath = sBindingPath;
        }
      }

      if (aParameters && aParameters.length) {
        //Remove parameters from mConditions since it should not be a part of $filter
        aParameters.forEach(function (parameter) {
          if (mConditions[parameter]) {
            delete mConditions[parameter];
          }
        });
      } //Only keep the actual value of filters and remove type informations


      Object.keys(mConditions).forEach(function (key) {
        mConditions[key].forEach(function (condition) {
          if (condition.values.length > 1) {
            condition.values = condition.values.slice(0, 1);
          }
        });
      }); // On InitialLoad when initiallayout is visual, aPropertyInfoSet is always empty and we cannot get filters from MDCFilterUtil.
      // Also when SVQualifier is there then we should not change the listbinding filters to empty as we are not getting filters from MDCFilterUtil but
      // instead we need to not call listbinding.filter and use the template time binding itself.

      if (Object.keys(mConditions).length > 0 && aValueListPropertyInfoSet.length) {
        oFilters = MdcFilterUtil.getFilterInfo(oFilterBar, mConditions, aValueListPropertyInfoSet, []).filters;

        if (oFilters) {
          if (!oFilters.aFilters) {
            aFilters.push(oFilters);
          } else if (oFilters.aFilters) {
            aFilters = oFilters.aFilters;
          }
        }
      }

      if (bIsDraftSupported) {
        aFilters.push(new Filter("IsActiveEntity", FilterOperator.EQ, true));
      }

      if (aFilters && aFilters.length > 0) {
        oInteractiveChartListBinding.filter(aFilters);
      } else if (!Object.keys(mConditions).length) {
        oInteractiveChartListBinding.filter();
      } // update the interactive chart binding


      if (bEnableBinding && oInteractiveChartListBinding.isSuspended()) {
        oInteractiveChartListBinding.resume();
      }

      return aFilters;
    },
    getFilterCounts: function (oConditions) {
      if (oConditions.length > 0) {
        return "(".concat(oConditions.length, ")");
      } else {
        return undefined;
      }
    },
    scaleVisualFilterValue: function (oValue, scaleFactor, numberOfFractionalDigits, currency, oRawValue) {
      // ScaleFactor if defined is priority for formatting
      if (scaleFactor) {
        return VisualFilterUtils.getFormattedNumber(oRawValue, scaleFactor, numberOfFractionalDigits); // If Scale Factor is not defined, use currency formatting
      } else if (currency) {
        return VisualFilterUtils.getFormattedNumber(oRawValue, undefined, undefined, currency); // No ScaleFactor and no Currency, use numberOfFractionalDigits defined in DataPoint
      } else if (numberOfFractionalDigits > 0) {
        // Number of fractional digits shall not exceed 2, unless required by currency
        numberOfFractionalDigits = numberOfFractionalDigits > 2 ? 2 : numberOfFractionalDigits;
        return VisualFilterUtils.getFormattedNumber(oRawValue, undefined, numberOfFractionalDigits);
      } else {
        return oValue;
      }
    },
    fireValueHelp: function (oEvent) {
      oEvent.getSource().getParent().getParent().getParent().fireValueHelpRequest();
    }
  };
  /**
   * @global
   */

  return VisualFilterRuntime;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJWaXN1YWxGaWx0ZXJSdW50aW1lIiwic2VsZWN0aW9uQ2hhbmdlZCIsIm9FdmVudCIsIm9JbnRlcmFjdGl2ZUNoYXJ0IiwiZ2V0U291cmNlIiwic091dFBhcmFtZXRlciIsImRhdGEiLCJzRGltZW5zaW9uIiwic0RpbWVuc2lvblRleHQiLCJiTXVsdGlwbGVTZWxlY3Rpb25BbGxvd2VkIiwic0RpbWVuc2lvblR5cGUiLCJvU2VsZWN0ZWRBZ2dyZWdhdGlvbiIsImdldFBhcmFtZXRlciIsImJJc0FnZ3JlZ2F0aW9uU2VsZWN0ZWQiLCJvQ29uZGl0aW9uTW9kZWwiLCJnZXRNb2RlbCIsImFDb25kaXRpb25zIiwiZ2V0UHJvcGVydHkiLCJMb2ciLCJlcnJvciIsInNTZWxlY3Rpb25DaGFuZ2VkVmFsdWUiLCJnZXRCaW5kaW5nQ29udGV4dCIsImdldE9iamVjdCIsInNTZWxlY3Rpb25DaGFuZ2VkVmFsdWVUZXh0IiwiU3RyaW5nIiwidW5kZWZpbmVkIiwiVmlzdWFsRmlsdGVyVXRpbHMiLCJfcGFyc2VEYXRlVGltZSIsIm9Db25kaXRpb24iLCJDb25kaXRpb24iLCJjcmVhdGVJdGVtQ29uZGl0aW9uIiwicHVzaCIsImZpbHRlciIsIm9wZXJhdG9yIiwiRGF0ZSIsInBhcnNlIiwidmFsdWVzIiwic2V0UHJvcGVydHkiLCJnZXRBZ2dyZWdhdGlvblNlbGVjdGVkIiwiYVNlbGVjdGFibGVWYWx1ZXMiLCJpIiwibGVuZ3RoIiwiZ2V0UGFyZW50Iiwic0RpbWVuc2lvblZhbHVlIiwiaW5kZXhPZiIsImdldEZpbHRlcnNGcm9tQ29uZGl0aW9ucyIsImFBcmd1bWVudHMiLCJvRmlsdGVyQmFyIiwiYUluUGFyYW1ldGVycyIsImN1c3RvbURhdGEiLCJiSXNEcmFmdFN1cHBvcnRlZCIsImFQcm9wZXJ0eUluZm9TZXQiLCJnZXRQcm9wZXJ0eUluZm8iLCJtQ29uZGl0aW9ucyIsImFWYWx1ZUxpc3RQcm9wZXJ0eUluZm9TZXQiLCJvRmlsdGVycyIsImFGaWx0ZXJzIiwiYVBhcmFtZXRlcnMiLCJvU2VsZWN0aW9uVmFyaWFudEFubm90YXRpb24iLCJDb21tb25IZWxwZXIiLCJwYXJzZUN1c3RvbURhdGEiLCJvSW50ZXJhY3RpdmVDaGFydExpc3RCaW5kaW5nIiwiZ2V0QmluZGluZyIsInNQYXRoIiwiZ2V0UGF0aCIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzRW50aXR5U2V0UGF0aCIsImZpbHRlckNvbmRpdGlvbnMiLCJnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50IiwiZ2V0Q3VzdG9tQ29uZGl0aW9ucyIsImJpbmQiLCJ0eXBlQ29uZmlnIiwiVHlwZVV0aWwiLCJnZXRUeXBlQ29uZmlnIiwiZGF0YVR5cGUiLCJvU2VsZWN0aW9uVmFyaWFudENvbmRpdGlvbnMiLCJjb252ZXJ0RmlsdGVyQ29uZGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInNLZXkiLCJpblBhcmFtZXRlckZvcktleSIsImZpbmQiLCJpblBhcmFtZXRlciIsInZhbHVlTGlzdFByb3BlcnR5IiwibG9jYWxEYXRhUHJvcGVydHkiLCJwcm9wZXJ0eUluZm9TZXQiLCJuYW1lIiwiYmFzZVR5cGUiLCJjb25kaXRpb24iLCJfZm9ybWF0RGF0ZVRpbWUiLCJvSW5QYXJhbWV0ZXIiLCJpbmRleCIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsInNJbmZvUGF0aCIsImJFbmFibGVCaW5kaW5nIiwib1Jlc291cmNlQnVuZGxlIiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImFSZXF1aXJlZFByb3BlcnRpZXMiLCJhTm90TWF0Y2hlZENvbmRpdGlvbnMiLCJyZXF1aXJlZFByb3BlcnR5UGF0aCIsImdldFRleHQiLCJzTGFiZWwiLCJzRmlsdGVyRW50aXR5TmFtZSIsInNwbGl0Iiwic0NoYXJ0RW50aXR5TmFtZSIsInNCaW5kaW5nUGF0aCIsIkZpbHRlclV0aWxzIiwiZ2V0QmluZGluZ1BhdGhGb3JQYXJhbWV0ZXJzIiwicGFyYW1ldGVyIiwia2V5Iiwic2xpY2UiLCJNZGNGaWx0ZXJVdGlsIiwiZ2V0RmlsdGVySW5mbyIsImZpbHRlcnMiLCJGaWx0ZXIiLCJGaWx0ZXJPcGVyYXRvciIsIkVRIiwiaXNTdXNwZW5kZWQiLCJyZXN1bWUiLCJnZXRGaWx0ZXJDb3VudHMiLCJvQ29uZGl0aW9ucyIsInNjYWxlVmlzdWFsRmlsdGVyVmFsdWUiLCJvVmFsdWUiLCJzY2FsZUZhY3RvciIsIm51bWJlck9mRnJhY3Rpb25hbERpZ2l0cyIsImN1cnJlbmN5Iiwib1Jhd1ZhbHVlIiwiZ2V0Rm9ybWF0dGVkTnVtYmVyIiwiZmlyZVZhbHVlSGVscCIsImZpcmVWYWx1ZUhlbHBSZXF1ZXN0Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJWaXN1YWxGaWx0ZXJSdW50aW1lLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IFZpc3VhbEZpbHRlclV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9scy9maWx0ZXJiYXIvdXRpbHMvVmlzdWFsRmlsdGVyVXRpbHNcIjtcbmltcG9ydCB0eXBlIHsgSW50ZXJuYWxNb2RlbENvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IHsgZ2V0RmlsdGVyc0NvbmRpdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0ZpbHRlckhlbHBlclwiO1xuaW1wb3J0IENvbW1vbkhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9Db21tb25IZWxwZXJcIjtcbmltcG9ydCBGaWx0ZXJVdGlscyBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWx0ZXIvRmlsdGVyVXRpbHNcIjtcbmltcG9ydCB0eXBlIE1hbmFnZWRPYmplY3QgZnJvbSBcInNhcC91aS9iYXNlL01hbmFnZWRPYmplY3RcIjtcbmltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgQ29uZGl0aW9uIGZyb20gXCJzYXAvdWkvbWRjL2NvbmRpdGlvbi9Db25kaXRpb25cIjtcbmltcG9ydCBUeXBlVXRpbCBmcm9tIFwic2FwL2ZlL2NvcmUvdHlwZS9UeXBlVXRpbFwiO1xuaW1wb3J0IE1kY0ZpbHRlclV0aWwgZnJvbSBcInNhcC91aS9tZGMvdXRpbC9GaWx0ZXJVdGlsXCI7XG5pbXBvcnQgRmlsdGVyIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyXCI7XG5pbXBvcnQgRmlsdGVyT3BlcmF0b3IgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJPcGVyYXRvclwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuXG4vKipcbiAqIFN0YXRpYyBjbGFzcyB1c2VkIGJ5IFZpc3VhbCBGaWx0ZXIgZHVyaW5nIHJ1bnRpbWVcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGV4cGVyaW1lbnRhbCBUaGlzIG1vZHVsZSBpcyBvbmx5IGZvciBpbnRlcm5hbC9leHBlcmltZW50YWwgdXNlIVxuICovXG5jb25zdCBWaXN1YWxGaWx0ZXJSdW50aW1lID0ge1xuXHRzZWxlY3Rpb25DaGFuZ2VkKG9FdmVudDogYW55KSB7XG5cdFx0Y29uc3Qgb0ludGVyYWN0aXZlQ2hhcnQgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdFx0Y29uc3Qgc091dFBhcmFtZXRlciA9IG9JbnRlcmFjdGl2ZUNoYXJ0LmRhdGEoXCJvdXRQYXJhbWV0ZXJcIik7XG5cdFx0Y29uc3Qgc0RpbWVuc2lvbiA9IG9JbnRlcmFjdGl2ZUNoYXJ0LmRhdGEoXCJkaW1lbnNpb25cIik7XG5cdFx0Y29uc3Qgc0RpbWVuc2lvblRleHQgPSBvSW50ZXJhY3RpdmVDaGFydC5kYXRhKFwiZGltZW5zaW9uVGV4dFwiKTtcblx0XHRjb25zdCBiTXVsdGlwbGVTZWxlY3Rpb25BbGxvd2VkID0gb0ludGVyYWN0aXZlQ2hhcnQuZGF0YShcIm11bHRpcGxlU2VsZWN0aW9uQWxsb3dlZFwiKTtcblx0XHRjb25zdCBzRGltZW5zaW9uVHlwZSA9IG9JbnRlcmFjdGl2ZUNoYXJ0LmRhdGEoXCJkaW1lbnNpb25UeXBlXCIpO1xuXHRcdGNvbnN0IG9TZWxlY3RlZEFnZ3JlZ2F0aW9uID0gb0V2ZW50LmdldFBhcmFtZXRlcihcImJhclwiKSB8fCBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwicG9pbnRcIikgfHwgb0V2ZW50LmdldFBhcmFtZXRlcihcInNlZ21lbnRcIik7XG5cdFx0Y29uc3QgYklzQWdncmVnYXRpb25TZWxlY3RlZCA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJzZWxlY3RlZFwiKTtcblx0XHRjb25zdCBvQ29uZGl0aW9uTW9kZWwgPSBvSW50ZXJhY3RpdmVDaGFydC5nZXRNb2RlbChcIiRmaWVsZFwiKTtcblx0XHRsZXQgYUNvbmRpdGlvbnMgPSBvQ29uZGl0aW9uTW9kZWwuZ2V0UHJvcGVydHkoXCIvY29uZGl0aW9uc1wiKTtcblxuXHRcdGlmICghc091dFBhcmFtZXRlciB8fCBzT3V0UGFyYW1ldGVyICE9PSBzRGltZW5zaW9uKSB7XG5cdFx0XHRMb2cuZXJyb3IoXCJWaXN1YWxGaWx0ZXI6IENhbm5vdCBzeW5jIHZhbHVlcyB3aXRoIHJlZ3VsYXIgZmlsdGVyIGFzIG91dCBwYXJhbWV0ZXIgaXMgbm90IGNvbmZpZ3VyZWQgcHJvcGVybHkhXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgc1NlbGVjdGlvbkNoYW5nZWRWYWx1ZSA9IG9TZWxlY3RlZEFnZ3JlZ2F0aW9uLmdldEJpbmRpbmdDb250ZXh0KCkuZ2V0T2JqZWN0KHNPdXRQYXJhbWV0ZXIpO1xuXHRcdFx0aWYgKHNTZWxlY3Rpb25DaGFuZ2VkVmFsdWUpIHtcblx0XHRcdFx0bGV0IHNTZWxlY3Rpb25DaGFuZ2VkVmFsdWVUZXh0ID0gb1NlbGVjdGVkQWdncmVnYXRpb24uZ2V0QmluZGluZ0NvbnRleHQoKS5nZXRPYmplY3Qoc0RpbWVuc2lvblRleHQpO1xuXHRcdFx0XHRpZiAodHlwZW9mIHNTZWxlY3Rpb25DaGFuZ2VkVmFsdWVUZXh0ICE9PSBcInN0cmluZ1wiICYmICEoc1NlbGVjdGlvbkNoYW5nZWRWYWx1ZVRleHQgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG5cdFx0XHRcdFx0c1NlbGVjdGlvbkNoYW5nZWRWYWx1ZVRleHQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaWYgc2VsZWN0aW9uIGhhcyBiZWVuIGRvbmUgb24gdGhlIGFnZ3JlZ2F0aW9uIHRoZW4gYWRkIHRvIGNvbmRpdGlvbnNcblx0XHRcdFx0aWYgKGJJc0FnZ3JlZ2F0aW9uU2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRpZiAoYk11bHRpcGxlU2VsZWN0aW9uQWxsb3dlZCA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdFx0XHRhQ29uZGl0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc0RpbWVuc2lvblR5cGUgPT09IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIpIHtcblx0XHRcdFx0XHRcdHNTZWxlY3Rpb25DaGFuZ2VkVmFsdWUgPSBWaXN1YWxGaWx0ZXJVdGlscy5fcGFyc2VEYXRlVGltZShzU2VsZWN0aW9uQ2hhbmdlZFZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3Qgb0NvbmRpdGlvbiA9IENvbmRpdGlvbi5jcmVhdGVJdGVtQ29uZGl0aW9uKFxuXHRcdFx0XHRcdFx0c1NlbGVjdGlvbkNoYW5nZWRWYWx1ZSxcblx0XHRcdFx0XHRcdHNTZWxlY3Rpb25DaGFuZ2VkVmFsdWVUZXh0IHx8IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdHt9LFxuXHRcdFx0XHRcdFx0e31cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGFDb25kaXRpb25zLnB1c2gob0NvbmRpdGlvbik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gYmVjYXVzZSBzZWxlY3Rpb24gd2FzIHJlbW92ZWQgb24gdGhlIGFnZ3JlZ2F0aW9uIGhlbmNlIHJlbW92ZSB0aGlzIGZyb20gY29uZGl0aW9uc1xuXHRcdFx0XHRcdGFDb25kaXRpb25zID0gYUNvbmRpdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChvQ29uZGl0aW9uOiBhbnkpIHtcblx0XHRcdFx0XHRcdGlmIChzRGltZW5zaW9uVHlwZSA9PT0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0NvbmRpdGlvbi5vcGVyYXRvciAhPT0gXCJFUVwiIHx8IERhdGUucGFyc2Uob0NvbmRpdGlvbi52YWx1ZXNbMF0pICE9PSBEYXRlLnBhcnNlKHNTZWxlY3Rpb25DaGFuZ2VkVmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIG9Db25kaXRpb24ub3BlcmF0b3IgIT09IFwiRVFcIiB8fCBvQ29uZGl0aW9uLnZhbHVlc1swXSAhPT0gc1NlbGVjdGlvbkNoYW5nZWRWYWx1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvQ29uZGl0aW9uTW9kZWwuc2V0UHJvcGVydHkoXCIvY29uZGl0aW9uc1wiLCBhQ29uZGl0aW9ucyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJWaXN1YWxGaWx0ZXI6IE5vIHZhdWUgZm91bmQgZm9yIHRoZSBvdXRQYXJhbWV0ZXJcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHQvLyBUSElTIElTIEEgRk9STUFUVEVSXG5cdGdldEFnZ3JlZ2F0aW9uU2VsZWN0ZWQodGhpczogTWFuYWdlZE9iamVjdCwgYUNvbmRpdGlvbnM6IGFueSkge1xuXHRcdGNvbnN0IGFTZWxlY3RhYmxlVmFsdWVzID0gW107XG5cdFx0aWYgKCF0aGlzLmdldEJpbmRpbmdDb250ZXh0KCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gYUNvbmRpdGlvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG5cdFx0XHRjb25zdCBvQ29uZGl0aW9uID0gYUNvbmRpdGlvbnNbaV07XG5cdFx0XHQvLyAxLiBnZXQgY29uZGl0aW9ucyB3aXRoIEVRIG9wZXJhdG9yIChzaW5jZSB2aXN1YWwgZmlsdGVyIGNhbiBvbmx5IGRlYWwgd2l0aCBFUSBvcGVyYXRvcnMpIGFuZCBnZXQgdGhlaXIgdmFsdWVzXG5cdFx0XHRpZiAob0NvbmRpdGlvbi5vcGVyYXRvciA9PT0gXCJFUVwiKSB7XG5cdFx0XHRcdGFTZWxlY3RhYmxlVmFsdWVzLnB1c2gob0NvbmRpdGlvbi52YWx1ZXNbMF0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGFjY2VzcyB0aGUgaW50ZXJhY3RpdmUgY2hhcnQgZnJvbSB0aGUgY29udHJvbC5cblx0XHRjb25zdCBvSW50ZXJhY3RpdmVDaGFydCA9IHRoaXMuZ2V0UGFyZW50KCkgYXMgQ29udHJvbDtcblx0XHRjb25zdCBzRGltZW5zaW9uID0gb0ludGVyYWN0aXZlQ2hhcnQuZGF0YShcImRpbWVuc2lvblwiKTtcblx0XHRjb25zdCBzRGltZW5zaW9uVHlwZSA9IG9JbnRlcmFjdGl2ZUNoYXJ0LmRhdGEoXCJkaW1lbnNpb25UeXBlXCIpO1xuXHRcdGxldCBzRGltZW5zaW9uVmFsdWUgPSB0aGlzLmdldEJpbmRpbmdDb250ZXh0KCk/LmdldE9iamVjdChzRGltZW5zaW9uKTtcblx0XHRpZiAoc0RpbWVuc2lvblR5cGUgPT09IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIpIHtcblx0XHRcdHNEaW1lbnNpb25WYWx1ZSA9IFZpc3VhbEZpbHRlclV0aWxzLl9wYXJzZURhdGVUaW1lKHNEaW1lbnNpb25WYWx1ZSkgYXMgYW55O1xuXHRcdH1cblx0XHRyZXR1cm4gYVNlbGVjdGFibGVWYWx1ZXMuaW5kZXhPZihzRGltZW5zaW9uVmFsdWUpID4gLTE7XG5cdH0sXG5cdC8vIFRISVMgSVMgQSBGT1JNQVRURVJcblx0Z2V0RmlsdGVyc0Zyb21Db25kaXRpb25zKHRoaXM6IE1hbmFnZWRPYmplY3QsIC4uLmFBcmd1bWVudHM6IGFueVtdKSB7XG5cdFx0Y29uc3Qgb0ludGVyYWN0aXZlQ2hhcnQgPSB0aGlzLmdldFBhcmVudCgpIGFzIENvbnRyb2w7XG5cdFx0Y29uc3Qgb0ZpbHRlckJhciA9IG9JbnRlcmFjdGl2ZUNoYXJ0LmdldFBhcmVudCgpLmdldFBhcmVudCgpLmdldFBhcmVudCgpLmdldFBhcmVudCgpIGFzIGFueTtcblx0XHRjb25zdCBhSW5QYXJhbWV0ZXJzID0gb0ludGVyYWN0aXZlQ2hhcnQuZGF0YShcImluUGFyYW1ldGVyc1wiKS5jdXN0b21EYXRhO1xuXHRcdGNvbnN0IGJJc0RyYWZ0U3VwcG9ydGVkID0gb0ludGVyYWN0aXZlQ2hhcnQuZGF0YShcImRyYWZ0U3VwcG9ydGVkXCIpID09PSBcInRydWVcIjtcblx0XHRjb25zdCBhUHJvcGVydHlJbmZvU2V0ID0gb0ZpbHRlckJhci5nZXRQcm9wZXJ0eUluZm8oKTtcblx0XHRjb25zdCBtQ29uZGl0aW9uczogYW55ID0ge307XG5cdFx0Y29uc3QgYVZhbHVlTGlzdFByb3BlcnR5SW5mb1NldDogYW55W10gPSBbXTtcblx0XHRsZXQgb0ZpbHRlcnM7XG5cdFx0bGV0IGFGaWx0ZXJzID0gW107XG5cdFx0Y29uc3QgYVBhcmFtZXRlcnMgPSBvSW50ZXJhY3RpdmVDaGFydC5kYXRhKFwicGFyYW1ldGVyc1wiKS5jdXN0b21EYXRhO1xuXHRcdGNvbnN0IG9TZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbiA9IENvbW1vbkhlbHBlci5wYXJzZUN1c3RvbURhdGEob0ludGVyYWN0aXZlQ2hhcnQuZGF0YShcInNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uXCIpKTtcblx0XHRjb25zdCBvSW50ZXJhY3RpdmVDaGFydExpc3RCaW5kaW5nID0gKG9JbnRlcmFjdGl2ZUNoYXJ0LmdldEJpbmRpbmcoXCJiYXJzXCIpIHx8XG5cdFx0XHRvSW50ZXJhY3RpdmVDaGFydC5nZXRCaW5kaW5nKFwicG9pbnRzXCIpIHx8XG5cdFx0XHRvSW50ZXJhY3RpdmVDaGFydC5nZXRCaW5kaW5nKFwic2VnbWVudHNcIikpIGFzIGFueTtcblx0XHRjb25zdCBzUGF0aCA9IG9JbnRlcmFjdGl2ZUNoYXJ0TGlzdEJpbmRpbmcuZ2V0UGF0aCgpO1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvSW50ZXJhY3RpdmVDaGFydC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsO1xuXHRcdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gb0ludGVyYWN0aXZlQ2hhcnRMaXN0QmluZGluZy5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgZmlsdGVyQ29uZGl0aW9ucyA9IGdldEZpbHRlcnNDb25kaXRpb25zRnJvbVNlbGVjdGlvblZhcmlhbnQoXG5cdFx0XHRzRW50aXR5U2V0UGF0aCxcblx0XHRcdG9NZXRhTW9kZWwsXG5cdFx0XHRvU2VsZWN0aW9uVmFyaWFudEFubm90YXRpb24sXG5cdFx0XHRWaXN1YWxGaWx0ZXJVdGlscy5nZXRDdXN0b21Db25kaXRpb25zLmJpbmQoVmlzdWFsRmlsdGVyVXRpbHMpXG5cdFx0KTtcblx0XHRmb3IgKGNvbnN0IGkgaW4gYVByb3BlcnR5SW5mb1NldCkge1xuXHRcdFx0YVByb3BlcnR5SW5mb1NldFtpXS50eXBlQ29uZmlnID0gVHlwZVV0aWwuZ2V0VHlwZUNvbmZpZyhhUHJvcGVydHlJbmZvU2V0W2ldLmRhdGFUeXBlLCB7fSwge30pO1xuXHRcdH1cblx0XHRjb25zdCBvU2VsZWN0aW9uVmFyaWFudENvbmRpdGlvbnMgPSBWaXN1YWxGaWx0ZXJVdGlscy5jb252ZXJ0RmlsdGVyQ29uZGlvbnMoZmlsdGVyQ29uZGl0aW9ucyk7XG5cdFx0Ly8gYUluUGFyYW1ldGVycyBhbmQgdGhlIGJpbmRpbmdzIHRvIGluIHBhcmFtZXRlcnMgYXJlIGluIHRoZSBzYW1lIG9yZGVyIHNvIHdlIGNhbiByZWx5IG9uIGl0IHRvIGNyZWF0ZSBvdXIgY29uZGl0aW9uc1xuXHRcdE9iamVjdC5rZXlzKG9TZWxlY3Rpb25WYXJpYW50Q29uZGl0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoc0tleTogc3RyaW5nKSB7XG5cdFx0XHRtQ29uZGl0aW9uc1tzS2V5XSA9IG9TZWxlY3Rpb25WYXJpYW50Q29uZGl0aW9uc1tzS2V5XTtcblx0XHRcdC8vZmV0Y2ggbG9jYWxEYXRhUHJvcGVydHkgaWYgc2VsZWN0aW9uIHZhcmlhbnQga2V5IGlzIGJhc2VkIG9uIHZhdWUgbGlzdCBwcm9wZXJ0eVxuXHRcdFx0Y29uc3QgaW5QYXJhbWV0ZXJGb3JLZXkgPSBhSW5QYXJhbWV0ZXJzLmZpbmQoZnVuY3Rpb24gKGluUGFyYW1ldGVyOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGluUGFyYW1ldGVyLnZhbHVlTGlzdFByb3BlcnR5ID09PSBzS2V5O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBsb2NhbERhdGFQcm9wZXJ0eSA9IGluUGFyYW1ldGVyRm9yS2V5ID8gaW5QYXJhbWV0ZXJGb3JLZXkubG9jYWxEYXRhUHJvcGVydHkgOiBzS2V5O1xuXHRcdFx0aWYgKCFhUGFyYW1ldGVycyB8fCAoYVBhcmFtZXRlcnMgJiYgYVBhcmFtZXRlcnMuaW5kZXhPZihzS2V5KSA9PT0gLTEpKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgaSBpbiBhUHJvcGVydHlJbmZvU2V0KSB7XG5cdFx0XHRcdFx0Y29uc3QgcHJvcGVydHlJbmZvU2V0ID0gYVByb3BlcnR5SW5mb1NldFtpXTtcblx0XHRcdFx0XHRpZiAobG9jYWxEYXRhUHJvcGVydHkgPT09IHByb3BlcnR5SW5mb1NldC5uYW1lKSB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHlJbmZvU2V0LnR5cGVDb25maWcuYmFzZVR5cGUgPT09IFwiRGF0ZVRpbWVcIikge1xuXHRcdFx0XHRcdFx0XHRpZiAobUNvbmRpdGlvbnNbc0tleV0pIHtcblx0XHRcdFx0XHRcdFx0XHRtQ29uZGl0aW9uc1tzS2V5XS5mb3JFYWNoKGZ1bmN0aW9uIChjb25kaXRpb246IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uZGl0aW9uLnZhbHVlc1swXSA9IFZpc3VhbEZpbHRlclV0aWxzLl9mb3JtYXREYXRlVGltZShjb25kaXRpb24udmFsdWVzWzBdKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YVZhbHVlTGlzdFByb3BlcnR5SW5mb1NldC5wdXNoKHtcblx0XHRcdFx0XHRcdFx0bmFtZTogc0tleSxcblx0XHRcdFx0XHRcdFx0dHlwZUNvbmZpZzogcHJvcGVydHlJbmZvU2V0LnR5cGVDb25maWdcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGFJblBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAob0luUGFyYW1ldGVyOiBhbnksIGluZGV4OiBhbnkpIHtcblx0XHRcdGlmIChhQXJndW1lbnRzW2luZGV4XS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdC8vIHN0b3JlIGNvbmRpdGlvbnMgd2l0aCB2YWx1ZSBsaXN0IHByb3BlcnR5IHNpbmNlIHdlIGFyZSBmaWx0ZXJpbmcgb24gdGhlIHZhbHVlIGxpc3QgY29sbGVjdGlvbiBwYXRoXG5cdFx0XHRcdG1Db25kaXRpb25zW29JblBhcmFtZXRlci52YWx1ZUxpc3RQcm9wZXJ0eV0gPSBhQXJndW1lbnRzW2luZGV4XTtcblx0XHRcdFx0aWYgKCFhUGFyYW1ldGVycyB8fCAoYVBhcmFtZXRlcnMgJiYgYVBhcmFtZXRlcnMuaW5kZXhPZihvSW5QYXJhbWV0ZXIudmFsdWVMaXN0UHJvcGVydHkpID09PSAtMSkpIHtcblx0XHRcdFx0XHQvLyBhUHJvcGVydHlJbmZvU2V0IGlzIGxpc3Qgb2YgcHJvcGVydGllcyBmcm9tIHRoZSBmaWx0ZXIgYmFyIGJ1dCB3ZSBuZWVkIHRvIGNyZWF0ZSBjb25kaXRpb25zIGZvciB0aGUgdmFsdWUgbGlzdFxuXHRcdFx0XHRcdC8vIHdoaWNoIGNvdWxkIGhhdmUgYSBkaWZmZXJlbnQgY29sbGVjdGlvblBhdGguXG5cdFx0XHRcdFx0Ly8gT25seSB0eXBlQ29uZmlnIGZyb20gYVByb3BlcnR5SW5mb1NldCBpcyByZXF1aXJlZCBmb3IgZ2V0dGluZyB0aGUgY29udmVydGVkIGZpbHRlcnMgZnJvbSBjb25kaXRpb25zXG5cdFx0XHRcdFx0Ly8gc28gd2UgdXBkYXRlIGFQcm9wZXJ0eUluZm9TZXQgdG8gaGF2ZSB0aGUgdmFsdWVMaXN0UHJvcGVydGllcyBvbmx5XG5cdFx0XHRcdFx0Ly8gVGhpcyB3YXkgY29uZGl0aW9ucyB3aWxsIGJlIGNvbnZlcnRlZCB0byBzYXAudWkubW9kZWwuRmlsdGVyIGZvciB0aGUgdmFsdWUgbGlzdFxuXHRcdFx0XHRcdC8vIFRoaXMgd29ya3MgYmVjYXVzZSBmb3IgaW4gcGFyYW1ldGVyIG1hcHBpbmcgdGhlIHByb3BlcnR5IGZyb20gdGhlIG1haW4gZW50aXR5IHR5cGUgc2hvdWxkIGJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgdGhlIHZhbHVlIGxpc3QgZW50aXR5IHR5cGVcblx0XHRcdFx0XHQvLyBUT0RPOiBGb2xsb3cgdXAgd2l0aCBNREMgdG8gY2hlY2sgaWYgdGhleSBjYW4gcHJvdmlkZSBhIGNsZWFuIGFwaSB0byBjb252ZXJ0IGNvbmRpdGlvbnMgaW50byBmaWx0ZXJzXG5cdFx0XHRcdFx0Zm9yIChjb25zdCBpIGluIGFQcm9wZXJ0eUluZm9TZXQpIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGNvbmRpdGlvbnMgd2l0aCB2YWx1ZSBsaXN0IHByb3BlcnR5IHNpbmNlIHdlIGFyZSBmaWx0ZXJpbmcgb24gdGhlIHZhbHVlIGxpc3QgY29sbGVjdGlvbiBwYXRoXG5cdFx0XHRcdFx0XHRjb25zdCBwcm9wZXJ0eUluZm9TZXQgPSBhUHJvcGVydHlJbmZvU2V0W2ldO1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5SW5mb1NldC5uYW1lID09PSBvSW5QYXJhbWV0ZXIubG9jYWxEYXRhUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5SW5mb1NldC50eXBlQ29uZmlnLmJhc2VUeXBlID09PSBcIkRhdGVUaW1lXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAobUNvbmRpdGlvbnNbb0luUGFyYW1ldGVyLnZhbHVlTGlzdFByb3BlcnR5XSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bUNvbmRpdGlvbnNbb0luUGFyYW1ldGVyLnZhbHVlTGlzdFByb3BlcnR5XS5mb3JFYWNoKGZ1bmN0aW9uIChjb25kaXRpb246IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25kaXRpb24udmFsdWVzWzBdID0gVmlzdWFsRmlsdGVyVXRpbHMuX2Zvcm1hdERhdGVUaW1lKGNvbmRpdGlvbi52YWx1ZXNbMF0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGFWYWx1ZUxpc3RQcm9wZXJ0eUluZm9TZXQucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogb0luUGFyYW1ldGVyLnZhbHVlTGlzdFByb3BlcnR5LFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVDb25maWc6IHByb3BlcnR5SW5mb1NldC50eXBlQ29uZmlnXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb0ludGVyYWN0aXZlQ2hhcnQuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRjb25zdCBzSW5mb1BhdGggPSBvSW50ZXJhY3RpdmVDaGFydC5kYXRhKFwiaW5mb1BhdGhcIik7XG5cdFx0bGV0IGJFbmFibGVCaW5kaW5nO1xuXHRcdGNvbnN0IG9SZXNvdXJjZUJ1bmRsZSA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLm1hY3Jvc1wiKTtcblx0XHRjb25zdCBhUmVxdWlyZWRQcm9wZXJ0aWVzID0gQ29tbW9uSGVscGVyLnBhcnNlQ3VzdG9tRGF0YShvSW50ZXJhY3RpdmVDaGFydC5kYXRhKFwicmVxdWlyZWRQcm9wZXJ0aWVzXCIpKTtcblx0XHRpZiAoYVJlcXVpcmVkUHJvcGVydGllcy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGFDb25kaXRpb25zID0gT2JqZWN0LmtleXMobUNvbmRpdGlvbnMpIHx8IFtdO1xuXHRcdFx0Y29uc3QgYU5vdE1hdGNoZWRDb25kaXRpb25zOiBhbnlbXSA9IFtdO1xuXHRcdFx0YVJlcXVpcmVkUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXF1aXJlZFByb3BlcnR5UGF0aDogYW55KSB7XG5cdFx0XHRcdGlmIChhQ29uZGl0aW9ucy5pbmRleE9mKHJlcXVpcmVkUHJvcGVydHlQYXRoKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRhTm90TWF0Y2hlZENvbmRpdGlvbnMucHVzaChyZXF1aXJlZFByb3BlcnR5UGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFhTm90TWF0Y2hlZENvbmRpdGlvbnMubGVuZ3RoKSB7XG5cdFx0XHRcdGJFbmFibGVCaW5kaW5nID0gb0ludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KGAke3NJbmZvUGF0aH0vc2hvd0Vycm9yYCk7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShzSW5mb1BhdGgsIHtcblx0XHRcdFx0XHRcImVycm9yTWVzc2FnZVRpdGxlXCI6IFwiXCIsXG5cdFx0XHRcdFx0XCJlcnJvck1lc3NhZ2VcIjogXCJcIixcblx0XHRcdFx0XHRcInNob3dFcnJvclwiOiBmYWxzZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoYU5vdE1hdGNoZWRDb25kaXRpb25zLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KHNJbmZvUGF0aCwge1xuXHRcdFx0XHRcdFwiZXJyb3JNZXNzYWdlVGl0bGVcIjogb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJNX1ZJU1VBTF9GSUxURVJTX0VSUk9SX01FU1NBR0VfVElUTEVcIiksXG5cdFx0XHRcdFx0XCJlcnJvck1lc3NhZ2VcIjogb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJNX1ZJU1VBTF9GSUxURVJTX1BST1ZJREVfRklMVEVSX1ZBTF9NVUxUSVBMRVZGXCIpLFxuXHRcdFx0XHRcdFwic2hvd0Vycm9yXCI6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHNMYWJlbCA9XG5cdFx0XHRcdFx0b01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGh9LyR7YU5vdE1hdGNoZWRDb25kaXRpb25zWzBdfUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTGFiZWxgKSB8fFxuXHRcdFx0XHRcdGFOb3RNYXRjaGVkQ29uZGl0aW9uc1swXTtcblx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KHNJbmZvUGF0aCwge1xuXHRcdFx0XHRcdFwiZXJyb3JNZXNzYWdlVGl0bGVcIjogb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJNX1ZJU1VBTF9GSUxURVJTX0VSUk9SX01FU1NBR0VfVElUTEVcIiksXG5cdFx0XHRcdFx0XCJlcnJvck1lc3NhZ2VcIjogb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJNX1ZJU1VBTF9GSUxURVJTX1BST1ZJREVfRklMVEVSX1ZBTF9TSU5HTEVWRlwiLCBzTGFiZWwpLFxuXHRcdFx0XHRcdFwic2hvd0Vycm9yXCI6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0YkVuYWJsZUJpbmRpbmcgPSBvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoYCR7c0luZm9QYXRofS9zaG93RXJyb3JgKTtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShzSW5mb1BhdGgsIHsgXCJlcnJvck1lc3NhZ2VUaXRsZVwiOiBcIlwiLCBcImVycm9yTWVzc2FnZVwiOiBcIlwiLCBcInNob3dFcnJvclwiOiBmYWxzZSB9KTtcblx0XHR9XG5cblx0XHRjb25zdCBzRmlsdGVyRW50aXR5TmFtZSA9IG9GaWx0ZXJCYXIuZGF0YShcImVudGl0eVR5cGVcIikuc3BsaXQoXCIvXCIpWzFdO1xuXHRcdGNvbnN0IHNDaGFydEVudGl0eU5hbWUgPSBzUGF0aC5zcGxpdChcIi9cIilbMV0uc3BsaXQoXCIoXCIpWzBdO1xuXHRcdGlmIChhUGFyYW1ldGVycyAmJiBhUGFyYW1ldGVycy5sZW5ndGggJiYgc0ZpbHRlckVudGl0eU5hbWUgPT09IHNDaGFydEVudGl0eU5hbWUpIHtcblx0XHRcdGNvbnN0IHNCaW5kaW5nUGF0aCA9IGJFbmFibGVCaW5kaW5nXG5cdFx0XHRcdD8gRmlsdGVyVXRpbHMuZ2V0QmluZGluZ1BhdGhGb3JQYXJhbWV0ZXJzKG9GaWx0ZXJCYXIsIG1Db25kaXRpb25zLCBhUHJvcGVydHlJbmZvU2V0LCBhUGFyYW1ldGVycylcblx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cblx0XHRcdGlmIChzQmluZGluZ1BhdGgpIHtcblx0XHRcdFx0b0ludGVyYWN0aXZlQ2hhcnRMaXN0QmluZGluZy5zUGF0aCA9IHNCaW5kaW5nUGF0aDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoYVBhcmFtZXRlcnMgJiYgYVBhcmFtZXRlcnMubGVuZ3RoKSB7XG5cdFx0XHQvL1JlbW92ZSBwYXJhbWV0ZXJzIGZyb20gbUNvbmRpdGlvbnMgc2luY2UgaXQgc2hvdWxkIG5vdCBiZSBhIHBhcnQgb2YgJGZpbHRlclxuXHRcdFx0YVBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW1ldGVyOiBhbnkpIHtcblx0XHRcdFx0aWYgKG1Db25kaXRpb25zW3BhcmFtZXRlcl0pIHtcblx0XHRcdFx0XHRkZWxldGUgbUNvbmRpdGlvbnNbcGFyYW1ldGVyXTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly9Pbmx5IGtlZXAgdGhlIGFjdHVhbCB2YWx1ZSBvZiBmaWx0ZXJzIGFuZCByZW1vdmUgdHlwZSBpbmZvcm1hdGlvbnNcblx0XHRPYmplY3Qua2V5cyhtQ29uZGl0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5OiBzdHJpbmcpIHtcblx0XHRcdG1Db25kaXRpb25zW2tleV0uZm9yRWFjaChmdW5jdGlvbiAoY29uZGl0aW9uOiBhbnkpIHtcblx0XHRcdFx0aWYgKGNvbmRpdGlvbi52YWx1ZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdGNvbmRpdGlvbi52YWx1ZXMgPSBjb25kaXRpb24udmFsdWVzLnNsaWNlKDAsIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHQvLyBPbiBJbml0aWFsTG9hZCB3aGVuIGluaXRpYWxsYXlvdXQgaXMgdmlzdWFsLCBhUHJvcGVydHlJbmZvU2V0IGlzIGFsd2F5cyBlbXB0eSBhbmQgd2UgY2Fubm90IGdldCBmaWx0ZXJzIGZyb20gTURDRmlsdGVyVXRpbC5cblx0XHQvLyBBbHNvIHdoZW4gU1ZRdWFsaWZpZXIgaXMgdGhlcmUgdGhlbiB3ZSBzaG91bGQgbm90IGNoYW5nZSB0aGUgbGlzdGJpbmRpbmcgZmlsdGVycyB0byBlbXB0eSBhcyB3ZSBhcmUgbm90IGdldHRpbmcgZmlsdGVycyBmcm9tIE1EQ0ZpbHRlclV0aWwgYnV0XG5cdFx0Ly8gaW5zdGVhZCB3ZSBuZWVkIHRvIG5vdCBjYWxsIGxpc3RiaW5kaW5nLmZpbHRlciBhbmQgdXNlIHRoZSB0ZW1wbGF0ZSB0aW1lIGJpbmRpbmcgaXRzZWxmLlxuXHRcdGlmIChPYmplY3Qua2V5cyhtQ29uZGl0aW9ucykubGVuZ3RoID4gMCAmJiBhVmFsdWVMaXN0UHJvcGVydHlJbmZvU2V0Lmxlbmd0aCkge1xuXHRcdFx0b0ZpbHRlcnMgPSAoTWRjRmlsdGVyVXRpbC5nZXRGaWx0ZXJJbmZvKG9GaWx0ZXJCYXIsIG1Db25kaXRpb25zLCBhVmFsdWVMaXN0UHJvcGVydHlJbmZvU2V0LCBbXSkgYXMgYW55KS5maWx0ZXJzO1xuXHRcdFx0aWYgKG9GaWx0ZXJzKSB7XG5cdFx0XHRcdGlmICghb0ZpbHRlcnMuYUZpbHRlcnMpIHtcblx0XHRcdFx0XHRhRmlsdGVycy5wdXNoKG9GaWx0ZXJzKTtcblx0XHRcdFx0fSBlbHNlIGlmIChvRmlsdGVycy5hRmlsdGVycykge1xuXHRcdFx0XHRcdGFGaWx0ZXJzID0gb0ZpbHRlcnMuYUZpbHRlcnM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGJJc0RyYWZ0U3VwcG9ydGVkKSB7XG5cdFx0XHRhRmlsdGVycy5wdXNoKG5ldyBGaWx0ZXIoXCJJc0FjdGl2ZUVudGl0eVwiLCBGaWx0ZXJPcGVyYXRvci5FUSwgdHJ1ZSkpO1xuXHRcdH1cblx0XHRpZiAoYUZpbHRlcnMgJiYgYUZpbHRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0b0ludGVyYWN0aXZlQ2hhcnRMaXN0QmluZGluZy5maWx0ZXIoYUZpbHRlcnMpO1xuXHRcdH0gZWxzZSBpZiAoIU9iamVjdC5rZXlzKG1Db25kaXRpb25zKS5sZW5ndGgpIHtcblx0XHRcdG9JbnRlcmFjdGl2ZUNoYXJ0TGlzdEJpbmRpbmcuZmlsdGVyKCk7XG5cdFx0fVxuXHRcdC8vIHVwZGF0ZSB0aGUgaW50ZXJhY3RpdmUgY2hhcnQgYmluZGluZ1xuXHRcdGlmIChiRW5hYmxlQmluZGluZyAmJiBvSW50ZXJhY3RpdmVDaGFydExpc3RCaW5kaW5nLmlzU3VzcGVuZGVkKCkpIHtcblx0XHRcdG9JbnRlcmFjdGl2ZUNoYXJ0TGlzdEJpbmRpbmcucmVzdW1lKCk7XG5cdFx0fVxuXHRcdHJldHVybiBhRmlsdGVycztcblx0fSxcblx0Z2V0RmlsdGVyQ291bnRzKG9Db25kaXRpb25zOiBhbnkpIHtcblx0XHRpZiAob0NvbmRpdGlvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGAoJHtvQ29uZGl0aW9ucy5sZW5ndGh9KWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9LFxuXG5cdHNjYWxlVmlzdWFsRmlsdGVyVmFsdWUob1ZhbHVlOiBhbnksIHNjYWxlRmFjdG9yOiBhbnksIG51bWJlck9mRnJhY3Rpb25hbERpZ2l0czogYW55LCBjdXJyZW5jeTogYW55LCBvUmF3VmFsdWU6IGFueSkge1xuXHRcdC8vIFNjYWxlRmFjdG9yIGlmIGRlZmluZWQgaXMgcHJpb3JpdHkgZm9yIGZvcm1hdHRpbmdcblx0XHRpZiAoc2NhbGVGYWN0b3IpIHtcblx0XHRcdHJldHVybiBWaXN1YWxGaWx0ZXJVdGlscy5nZXRGb3JtYXR0ZWROdW1iZXIob1Jhd1ZhbHVlLCBzY2FsZUZhY3RvciwgbnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzKTtcblx0XHRcdC8vIElmIFNjYWxlIEZhY3RvciBpcyBub3QgZGVmaW5lZCwgdXNlIGN1cnJlbmN5IGZvcm1hdHRpbmdcblx0XHR9IGVsc2UgaWYgKGN1cnJlbmN5KSB7XG5cdFx0XHRyZXR1cm4gVmlzdWFsRmlsdGVyVXRpbHMuZ2V0Rm9ybWF0dGVkTnVtYmVyKG9SYXdWYWx1ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGN1cnJlbmN5KTtcblx0XHRcdC8vIE5vIFNjYWxlRmFjdG9yIGFuZCBubyBDdXJyZW5jeSwgdXNlIG51bWJlck9mRnJhY3Rpb25hbERpZ2l0cyBkZWZpbmVkIGluIERhdGFQb2ludFxuXHRcdH0gZWxzZSBpZiAobnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzID4gMCkge1xuXHRcdFx0Ly8gTnVtYmVyIG9mIGZyYWN0aW9uYWwgZGlnaXRzIHNoYWxsIG5vdCBleGNlZWQgMiwgdW5sZXNzIHJlcXVpcmVkIGJ5IGN1cnJlbmN5XG5cdFx0XHRudW1iZXJPZkZyYWN0aW9uYWxEaWdpdHMgPSBudW1iZXJPZkZyYWN0aW9uYWxEaWdpdHMgPiAyID8gMiA6IG51bWJlck9mRnJhY3Rpb25hbERpZ2l0cztcblx0XHRcdHJldHVybiBWaXN1YWxGaWx0ZXJVdGlscy5nZXRGb3JtYXR0ZWROdW1iZXIob1Jhd1ZhbHVlLCB1bmRlZmluZWQsIG51bWJlck9mRnJhY3Rpb25hbERpZ2l0cyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBvVmFsdWU7XG5cdFx0fVxuXHR9LFxuXHRmaXJlVmFsdWVIZWxwKG9FdmVudDogYW55KSB7XG5cdFx0b0V2ZW50LmdldFNvdXJjZSgpLmdldFBhcmVudCgpLmdldFBhcmVudCgpLmdldFBhcmVudCgpLmZpcmVWYWx1ZUhlbHBSZXF1ZXN0KCk7XG5cdH1cbn07XG5cbi8qKlxuICogQGdsb2JhbFxuICovXG5leHBvcnQgZGVmYXVsdCBWaXN1YWxGaWx0ZXJSdW50aW1lO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsSUFBTUEsbUJBQW1CLEdBQUc7SUFDM0JDLGdCQUQyQixZQUNWQyxNQURVLEVBQ0c7TUFDN0IsSUFBTUMsaUJBQWlCLEdBQUdELE1BQU0sQ0FBQ0UsU0FBUCxFQUExQjtNQUNBLElBQU1DLGFBQWEsR0FBR0YsaUJBQWlCLENBQUNHLElBQWxCLENBQXVCLGNBQXZCLENBQXRCO01BQ0EsSUFBTUMsVUFBVSxHQUFHSixpQkFBaUIsQ0FBQ0csSUFBbEIsQ0FBdUIsV0FBdkIsQ0FBbkI7TUFDQSxJQUFNRSxjQUFjLEdBQUdMLGlCQUFpQixDQUFDRyxJQUFsQixDQUF1QixlQUF2QixDQUF2QjtNQUNBLElBQU1HLHlCQUF5QixHQUFHTixpQkFBaUIsQ0FBQ0csSUFBbEIsQ0FBdUIsMEJBQXZCLENBQWxDO01BQ0EsSUFBTUksY0FBYyxHQUFHUCxpQkFBaUIsQ0FBQ0csSUFBbEIsQ0FBdUIsZUFBdkIsQ0FBdkI7TUFDQSxJQUFNSyxvQkFBb0IsR0FBR1QsTUFBTSxDQUFDVSxZQUFQLENBQW9CLEtBQXBCLEtBQThCVixNQUFNLENBQUNVLFlBQVAsQ0FBb0IsT0FBcEIsQ0FBOUIsSUFBOERWLE1BQU0sQ0FBQ1UsWUFBUCxDQUFvQixTQUFwQixDQUEzRjtNQUNBLElBQU1DLHNCQUFzQixHQUFHWCxNQUFNLENBQUNVLFlBQVAsQ0FBb0IsVUFBcEIsQ0FBL0I7TUFDQSxJQUFNRSxlQUFlLEdBQUdY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