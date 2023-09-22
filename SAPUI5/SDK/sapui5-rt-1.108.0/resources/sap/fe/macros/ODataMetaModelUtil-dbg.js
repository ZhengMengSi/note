/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var mType = {
    "Edm.Binary": "boolean",
    "Edm.Boolean": "boolean",
    "Edm.Byte": "boolean",
    "Edm.Date": "date",
    "Edm.DateTimeOffset": "dateTime",
    "Edm.Decimal": "int",
    "Edm.Double": "boolean",
    "Edm.Duration": "float",
    "Edm.Guid": "string",
    "Edm.Int16": "int",
    "Edm.Int32": "int",
    "Edm.Int64": "int",
    "Edm.SByte": "boolean",
    "Edm.Single": "float",
    "Edm.String": "string",
    "Edm.TimeOfDay": "time"
  };
  /**
   * Utitlity class for metadata interpretation inside delegate classes.
   *
   * @private
   * @since 1.62
   */

  var ODataMetaModelUtil = {
    fetchAllAnnotations: function (oMetaModel, sEntityPath) {
      var oCtx = oMetaModel.getMetaContext(sEntityPath);
      return oMetaModel.requestObject("@", oCtx).then(function (mAnnos) {
        return mAnnos;
      });
    },

    /**
     * The mapping of all annotations of a given entity set.
     *
     * @param mAnnos A list of annotations of the entity set
     * @returns A map to the custom aggregates keyed by their qualifiers
     */
    getAllCustomAggregates: function (mAnnos) {
      var mCustomAggregates = {};
      var sAnno;

      for (var sAnnoKey in mAnnos) {
        if (sAnnoKey.startsWith("@Org.OData.Aggregation.V1.CustomAggregate")) {
          sAnno = sAnnoKey.replace("@Org.OData.Aggregation.V1.CustomAggregate#", "");
          var aAnno = sAnno.split("@");

          if (aAnno.length == 2) {
            //inner annotation that is not part of 	Validation.AggregatableTerms
            if (aAnno[1] == "Org.OData.Aggregation.V1.ContextDefiningProperties") {
              mCustomAggregates[aAnno[0]].contextDefiningProperties = mAnnos[sAnnoKey];
            }

            if (aAnno[1] == "com.sap.vocabularies.Common.v1.Label") {
              mCustomAggregates[aAnno[0]].label = mAnnos[sAnnoKey];
            }
          } else if (aAnno.length == 1) {
            mCustomAggregates[aAnno[0]] = {
              name: aAnno[0],
              propertyPath: aAnno[0],
              label: "Custom Aggregate (".concat(sAnno, ")"),
              sortable: true,
              sortOrder: "both",
              custom: true
            };
          }
        }
      }

      return mCustomAggregates;
    },
    getAllAggregatableProperties: function (mAnnos) {
      var mAggregatableProperties = {};
      var aProperties, oProperty;

      if (mAnnos["@com.sap.vocabularies.Analytics.v1.AggregatedProperties"]) {
        aProperties = mAnnos["@com.sap.vocabularies.Analytics.v1.AggregatedProperties"];

        for (var i = 0; i < aProperties.length; i++) {
          oProperty = aProperties[i];
          mAggregatableProperties[oProperty.Name] = {
            name: oProperty.Name,
            propertyPath: oProperty.AggregatableProperty.$PropertyPath,
            aggregationMethod: oProperty.AggregationMethod,
            label: oProperty["@com.sap.vocabularies.Common.v1.Label"] || "Aggregatable property (".concat(oProperty.Name, ")"),
            sortable: true,
            sortOrder: "both",
            custom: false
          };
        }
      }

      return mAggregatableProperties;
    },

    /**
     * Retrieve and order all data points by their property and qualifier.
     *
     * @param mAnnos A named map of annotations from a given entity set
     * @returns A keyed mapped ordered by
     * <ul>
     *     <li> The properties value path </li>
     *     <li> The qualifier of the data point <(li>
     * </ul>
     */
    getAllDataPoints: function (mAnnos) {
      var mDataPoints = {};

      for (var sAnnoKey in mAnnos) {
        if (sAnnoKey.startsWith("@com.sap.vocabularies.UI.v1.DataPoint")) {
          var sQualifier = sAnnoKey.replace("@com.sap.vocabularies.UI.v1.DataPoint#", "");
          var sValue = mAnnos[sAnnoKey].Value.$Path;
          mDataPoints[sValue] = mDataPoints[sValue] || {};
          mDataPoints[sValue][sQualifier] = ODataMetaModelUtil.createDataPointProperty(mAnnos[sAnnoKey]);
        }
      }

      return mDataPoints;
    },

    /**
     * Format the data point as a JSON object.
     *
     * @param oDataPointAnno
     * @returns The formatted json object
     */
    createDataPointProperty: function (oDataPointAnno) {
      var oDataPoint = {};

      if (oDataPointAnno.TargetValue) {
        oDataPoint.targetValue = oDataPointAnno.TargetValue.$Path;
      }

      if (oDataPointAnno.ForeCastValue) {
        oDataPoint.foreCastValue = oDataPointAnno.ForeCastValue.$Path;
      }

      var oCriticality = null;

      if (oDataPointAnno.Criticality) {
        if (oDataPointAnno.Criticality.$Path) {
          //will be an aggregated property or custom aggregate
          oCriticality = {
            Calculated: oDataPointAnno.Criticality.$Path
          };
        } else {
          oCriticality = {
            Static: oDataPointAnno.Criticality.$EnumMember.replace("com.sap.vocabularies.UI.v1.CriticalityType/", "")
          };
        }
      } else if (oDataPointAnno.CriticalityCalculation) {
        var oThresholds = {};

        var bConstant = ODataMetaModelUtil._buildThresholds(oThresholds, oDataPointAnno.CriticalityCalculation);

        if (bConstant) {
          oCriticality = {
            ConstantThresholds: oThresholds
          };
        } else {
          oCriticality = {
            DynamicThresholds: oThresholds
          };
        }
      }

      if (oCriticality) {
        oDataPoint.criticality = oCriticality;
      }

      return oDataPoint;
    },

    /**
     * Checks whether the thresholds are dynamic or constant.
     *
     * @param oThresholds The threshold skeleton
     * @param oCriticalityCalculation The UI.DataPoint.CriticalityCalculation annotation
     * @returns `true` if the threshold should be supplied as ConstantThresholds, <code>false</code> if the threshold should
     * be supplied as DynamicThresholds
     * @private
     */
    _buildThresholds: function (oThresholds, oCriticalityCalculation) {
      var aKeys = ["AcceptanceRangeLowValue", "AcceptanceRangeHighValue", "ToleranceRangeLowValue", "ToleranceRangeHighValue", "DeviationRangeLowValue", "DeviationRangeHighValue"];
      var bConstant = true,
          sKey,
          i,
          j;
      oThresholds.ImprovementDirection = oCriticalityCalculation.ImprovementDirection.$EnumMember.replace("com.sap.vocabularies.UI.v1.ImprovementDirectionType/", "");
      var oDynamicThresholds = {
        oneSupplied: false,
        usedMeasures: [] // combination to check whether at least one is supplied

      };
      var oConstantThresholds = {
        oneSupplied: false // combination to check whether at least one is supplied

      };

      for (i = 0; i < aKeys.length; i++) {
        sKey = aKeys[i];
        oDynamicThresholds[sKey] = oCriticalityCalculation[sKey] ? oCriticalityCalculation[sKey].$Path : undefined;
        oDynamicThresholds.oneSupplied = oDynamicThresholds.oneSupplied || oDynamicThresholds[sKey];

        if (!oDynamicThresholds.oneSupplied) {
          // only consider in case no dynamic threshold is supplied
          oConstantThresholds[sKey] = oCriticalityCalculation[sKey];
          oConstantThresholds.oneSupplied = oConstantThresholds.oneSupplied || oConstantThresholds[sKey];
        } else if (oDynamicThresholds[sKey]) {
          oDynamicThresholds.usedMeasures.push(oDynamicThresholds[sKey]);
        }
      } // dynamic definition shall overrule constant definition


      if (oDynamicThresholds.oneSupplied) {
        bConstant = false;

        for (i = 0; i < aKeys.length; i++) {
          if (oDynamicThresholds[aKeys[i]]) {
            oThresholds[aKeys[i]] = oDynamicThresholds[aKeys[i]];
          }
        }

        oThresholds.usedMeasures = oDynamicThresholds.usedMeasures;
      } else {
        var oAggregationLevel;
        oThresholds.AggregationLevels = []; // check if at least one static value is supplied

        if (oConstantThresholds.oneSupplied) {
          // add one entry in the aggregation level
          oAggregationLevel = {
            VisibleDimensions: null
          };

          for (i = 0; i < aKeys.length; i++) {
            if (oConstantThresholds[aKeys[i]]) {
              oAggregationLevel[aKeys[i]] = oConstantThresholds[aKeys[i]];
            }
          }

          oThresholds.AggregationLevels.push(oAggregationLevel);
        } // further check for ConstantThresholds


        if (oCriticalityCalculation.ConstantThresholds && oCriticalityCalculation.ConstantThresholds.length > 0) {
          for (i = 0; i < oCriticalityCalculation.ConstantThresholds.length; i++) {
            var oAggregationLevelInfo = oCriticalityCalculation.ConstantThresholds[i];
            var aVisibleDimensions = oAggregationLevelInfo.AggregationLevel ? [] : null;

            if (oAggregationLevelInfo.AggregationLevel && oAggregationLevelInfo.AggregationLevel.length > 0) {
              for (j = 0; j < oAggregationLevelInfo.AggregationLevel.length; j++) {
                aVisibleDimensions.push(oAggregationLevelInfo.AggregationLevel[j].$PropertyPath);
              }
            }

            oAggregationLevel = {
              VisibleDimensions: aVisibleDimensions
            };

            for (j = 0; j < aKeys.length; j++) {
              var nValue = oAggregationLevelInfo[aKeys[j]];

              if (nValue) {
                oAggregationLevel[aKeys[j]] = nValue;
              }
            }

            oThresholds.AggregationLevels.push(oAggregationLevel);
          }
        }
      }

      return bConstant;
    },

    /**
     * Determines the sorting information from the restriction annotation.
     *
     * @param oSortRestrictions The sort restrictions annotation
     * @returns An object containing the sort restriction information
     */
    getSortRestrictionsInfo: function (oSortRestrictions) {
      var i, sPropertyName;
      var oSortRestrictionsInfo = {
        sortable: true,
        propertyInfo: {}
      };

      if (oSortRestrictions) {
        oSortRestrictionsInfo.sortable = oSortRestrictions.Sortable != null ? oSortRestrictions.Sortable : true;

        if (oSortRestrictions.NonSortableProperties) {
          for (i = 0; i < oSortRestrictions.NonSortableProperties.length; i++) {
            sPropertyName = oSortRestrictions.NonSortableProperties[i].$PropertyPath;
            oSortRestrictionsInfo[sPropertyName] = {
              sortable: false
            };
          }
        }

        if (oSortRestrictions.AscendingOnlyProperties) {
          for (i = 0; i < oSortRestrictions.AscendingOnlyProperties.length; i++) {
            sPropertyName = oSortRestrictions.AscendingOnlyProperties[i].$PropertyPath;
            oSortRestrictionsInfo[sPropertyName] = {
              sortable: true,
              sortDirection: "asc"
            };
          }
        }

        if (oSortRestrictions.AscendingOnlyProperties) {
          for (i = 0; i < oSortRestrictions.DescendingOnlyProperties.length; i++) {
            sPropertyName = oSortRestrictions.DescendingOnlyProperties[i].$PropertyPath;
            oSortRestrictionsInfo[sPropertyName] = {
              sortable: true,
              sortDirection: "desc"
            };
          }
        }
      }

      return oSortRestrictionsInfo;
    },

    /**
     *
     * @param oProperty The Entity Property
     * @param oSortRestrictionInfo The SortInformation restrictions
     */
    addSortInfoForProperty: function (oProperty, oSortRestrictionInfo) {
      var oPropertyInfo = oSortRestrictionInfo[oProperty.name];
      oProperty.sortable = oSortRestrictionInfo.sortable && oPropertyInfo ? oPropertyInfo.sortable : true;

      if (oProperty.sortable) {
        oProperty.sortDirection = oPropertyInfo ? oPropertyInfo.sortDirection : "both";
      }
    },

    /**
     * Determines the filter information based on the filter restrictions annoation.
     *
     * @param oFilterRestrictions The filter restrictions annotation
     * @returns An object containing the filter restriction information
     */
    getFilterRestrictionsInfo: function (oFilterRestrictions) {
      var i, sPropertyName;
      var oFilterRestrictionsInfo = {
        filterable: true,
        propertyInfo: {}
      };

      if (oFilterRestrictions) {
        oFilterRestrictionsInfo.filterable = oFilterRestrictions.Filterable != null ? oFilterRestrictions.Filterable : true;
        oFilterRestrictionsInfo.requiresFilter = oFilterRestrictions.RequiresFilter != null ? oFilterRestrictions.RequiresFilter : false; //Hierarchical Case

        oFilterRestrictionsInfo.requiredProperties = [];

        if (oFilterRestrictionsInfo.RequiredProperties) {
          for (i = 0; i < oFilterRestrictions.RequiredProperties.length; i++) {
            sPropertyName = oFilterRestrictions.RequiredProperties[i].$PropertyPath;
            oFilterRestrictionsInfo.requiredProperties.push(sPropertyName);
          }
        }

        if (oFilterRestrictions.NonFilterableProperties) {
          for (i = 0; i < oFilterRestrictions.NonFilterableProperties.length; i++) {
            sPropertyName = oFilterRestrictions.NonFilterableProperties[i].$PropertyPath;
            oFilterRestrictionsInfo[sPropertyName] = {
              filterable: false
            };
          }
        }

        if (oFilterRestrictions.FilterExpressionRestrictions) {
          //TBD
          for (i = 0; i < oFilterRestrictions.FilterExpressionRestrictions.length; i++) {
            sPropertyName = oFilterRestrictions.FilterExpressionRestrictions[i].$PropertyPath;
            oFilterRestrictionsInfo[sPropertyName] = {
              filterable: true,
              allowedExpressions: oFilterRestrictions.FilterExpressionRestrictions[i].AllowedExpressions
            };
          }
        }
      }

      return oFilterRestrictionsInfo;
    },

    /**
     * Provides the information if the FilterExpression is a multiValue Filter Expression.
     *
     * @param sFilterExpression The FilterExpressionType
     * @returns A boolean value wether it is a multiValue Filter Expression or not
     */
    isMultiValueFilterExpression: function (sFilterExpression) {
      var bIsMultiValue = true; //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

      switch (sFilterExpression) {
        case "SearchExpression":
        case "SingleRange":
        case "SingleValue":
          bIsMultiValue = false;
          break;

        default:
          break;
      }

      return bIsMultiValue;
    },

    /**
     *
     * @param oProperty The entity property
     * @param oFilterRestrictionInfo The filter restrictions
     */
    addFilterInfoForProperty: function (oProperty, oFilterRestrictionInfo) {
      var oPropertyInfo = oFilterRestrictionInfo[oProperty.name];
      oProperty.filterable = oFilterRestrictionInfo.filterable && oPropertyInfo ? oPropertyInfo.filterable : true;

      if (oProperty.filterable) {
        oProperty.allowedExpressions = oPropertyInfo ? oPropertyInfo.allowedExpressions : null;
      }
    },

    /**
     * Retrieve the java script type of the property.
     *
     * @param sEdmType The Edm type, like Edm.String, Edm.Int16...
     * @returns The data type.
     */
    getType: function (sEdmType) {
      return mType[sEdmType] || "object";
    },
    fetchCalendarTag: function (oMetaModel, oCtx) {
      var COMMON = "@com.sap.vocabularies.Common.v1.";
      return Promise.all([oMetaModel.requestObject("".concat(COMMON, "IsCalendarYear"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarHalfyear"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarQuarter"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarMonth"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarWeek"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsDayOfCalendarMonth"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsDayOfCalendarYear"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarYearHalfyear"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarYearQuarter"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarYearMonth"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarYearWeek"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsCalendarDate"), oCtx)]).then(function (aTag) {
        if (aTag[0]) {
          return "year";
        }

        if (aTag[1]) {
          return "halfYear";
        }

        if (aTag[2]) {
          return "quarter";
        }

        if (aTag[3]) {
          return "month";
        }

        if (aTag[4]) {
          return "week";
        }

        if (aTag[5]) {
          return "dayOfMonth";
        }

        if (aTag[6]) {
          return "dayOfYear";
        }

        if (aTag[7]) {
          return "yearHalfYear";
        }

        if (aTag[8]) {
          return "yearQuarter";
        }

        if (aTag[9]) {
          return "yearMonth";
        }

        if (aTag[10]) {
          return "yearWeek";
        }

        if (aTag[11]) {
          return "date";
        }

        return undefined;
      });
    },
    fetchFiscalTag: function (oMetaModel, oCtx) {
      var COMMON = "@com.sap.vocabularies.Common.v1.";
      return Promise.all([oMetaModel.requestObject("".concat(COMMON, "IsFiscalYear"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalPeriod"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalYearPeriod"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalQuarter"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalYearQuarter"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalWeek"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalYearWeek"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsDayOfFiscalYear"), oCtx), oMetaModel.requestObject("".concat(COMMON, "IsFiscalYearVariant"), oCtx)]).then(function (aTag) {
        if (aTag[0]) {
          return "year";
        }

        if (aTag[1]) {
          return "period";
        }

        if (aTag[2]) {
          return "yearPeriod";
        }

        if (aTag[3]) {
          return "quarter";
        }

        if (aTag[4]) {
          return "yearQuarter";
        }

        if (aTag[5]) {
          return "week";
        }

        if (aTag[6]) {
          return "yearWeek";
        }

        if (aTag[7]) {
          return "dayOfYear";
        }

        if (aTag[8]) {
          return "yearVariant";
        }

        return undefined;
      });
    },
    fetchCriticality: function (oMetaModel, oCtx) {
      var UI = "@com.sap.vocabularies.UI.v1";
      return oMetaModel.requestObject("".concat(UI, ".ValueCriticality"), oCtx).then(function (aValueCriticality) {
        var oCriticality, oValueCriticality;

        if (aValueCriticality) {
          oCriticality = {
            VeryPositive: [],
            Positive: [],
            Critical: [],
            VeryNegative: [],
            Negative: [],
            Neutral: []
          };

          for (var i = 0; i < aValueCriticality.length; i++) {
            oValueCriticality = aValueCriticality[i];

            if (oValueCriticality.Criticality.$EnumMember.endsWith("VeryPositive")) {
              oCriticality.VeryPositive.push(oValueCriticality.Value);
            } else if (oValueCriticality.Criticality.$EnumMember.endsWith("Positive")) {
              oCriticality.Positive.push(oValueCriticality.Value);
            } else if (oValueCriticality.Criticality.$EnumMember.endsWith("Critical")) {
              oCriticality.Critical.push(oValueCriticality.Value);
            } else if (oValueCriticality.Criticality.$EnumMember.endsWith("VeryNegative")) {
              oCriticality.VeryNegative.push(oValueCriticality.Value);
            } else if (oValueCriticality.Criticality.$EnumMember.endsWith("Negative")) {
              oCriticality.Negative.push(oValueCriticality.Value);
            } else {
              oCriticality.Neutral.push(oValueCriticality.Value);
            }
          }

          for (var sKey in oCriticality) {
            if (oCriticality[sKey].length == 0) {
              delete oCriticality[sKey];
            }
          }
        }

        return oCriticality;
      });
    }
  };
  return ODataMetaModelUtil;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtVHlwZSIsIk9EYXRhTWV0YU1vZGVsVXRpbCIsImZldGNoQWxsQW5ub3RhdGlvbnMiLCJvTWV0YU1vZGVsIiwic0VudGl0eVBhdGgiLCJvQ3R4IiwiZ2V0TWV0YUNvbnRleHQiLCJyZXF1ZXN0T2JqZWN0IiwidGhlbiIsIm1Bbm5vcyIsImdldEFsbEN1c3RvbUFnZ3JlZ2F0ZXMiLCJtQ3VzdG9tQWdncmVnYXRlcyIsInNBbm5vIiwic0Fubm9LZXkiLCJzdGFydHNXaXRoIiwicmVwbGFjZSIsImFBbm5vIiwic3BsaXQiLCJsZW5ndGgiLCJjb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwibGFiZWwiLCJuYW1lIiwicHJvcGVydHlQYXRoIiwic29ydGFibGUiLCJzb3J0T3JkZXIiLCJjdXN0b20iLCJnZXRBbGxBZ2dyZWdhdGFibGVQcm9wZXJ0aWVzIiwibUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhUHJvcGVydGllcyIsIm9Qcm9wZXJ0eSIsImkiLCJOYW1lIiwiQWdncmVnYXRhYmxlUHJvcGVydHkiLCIkUHJvcGVydHlQYXRoIiwiYWdncmVnYXRpb25NZXRob2QiLCJBZ2dyZWdhdGlvbk1ldGhvZCIsImdldEFsbERhdGFQb2ludHMiLCJtRGF0YVBvaW50cyIsInNRdWFsaWZpZXIiLCJzVmFsdWUiLCJWYWx1ZSIsIiRQYXRoIiwiY3JlYXRlRGF0YVBvaW50UHJvcGVydHkiLCJvRGF0YVBvaW50QW5ubyIsIm9EYXRhUG9pbnQiLCJUYXJnZXRWYWx1ZSIsInRhcmdldFZhbHVlIiwiRm9yZUNhc3RWYWx1ZSIsImZvcmVDYXN0VmFsdWUiLCJvQ3JpdGljYWxpdHkiLCJDcml0aWNhbGl0eSIsIkNhbGN1bGF0ZWQiLCJTdGF0aWMiLCIkRW51bU1lbWJlciIsIkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24iLCJvVGhyZXNob2xkcyIsImJDb25zdGFudCIsIl9idWlsZFRocmVzaG9sZHMiLCJDb25zdGFudFRocmVzaG9sZHMiLCJEeW5hbWljVGhyZXNob2xkcyIsImNyaXRpY2FsaXR5Iiwib0NyaXRpY2FsaXR5Q2FsY3VsYXRpb24iLCJhS2V5cyIsInNLZXkiLCJqIiwiSW1wcm92ZW1lbnREaXJlY3Rpb24iLCJvRHluYW1pY1RocmVzaG9sZHMiLCJvbmVTdXBwbGllZCIsInVzZWRNZWFzdXJlcyIsIm9Db25zdGFudFRocmVzaG9sZHMiLCJ1bmRlZmluZWQiLCJwdXNoIiwib0FnZ3JlZ2F0aW9uTGV2ZWwiLCJBZ2dyZWdhdGlvbkxldmVscyIsIlZpc2libGVEaW1lbnNpb25zIiwib0FnZ3JlZ2F0aW9uTGV2ZWxJbmZvIiwiYVZpc2libGVEaW1lbnNpb25zIiwiQWdncmVnYXRpb25MZXZlbCIsIm5WYWx1ZSIsImdldFNvcnRSZXN0cmljdGlvbnNJbmZvIiwib1NvcnRSZXN0cmljdGlvbnMiLCJzUHJvcGVydHlOYW1lIiwib1NvcnRSZXN0cmljdGlvbnNJbmZvIiwicHJvcGVydHlJbmZvIiwiU29ydGFibGUiLCJOb25Tb3J0YWJsZVByb3BlcnRpZXMiLCJBc2NlbmRpbmdPbmx5UHJvcGVydGllcyIsInNvcnREaXJlY3Rpb24iLCJEZXNjZW5kaW5nT25seVByb3BlcnRpZXMiLCJhZGRTb3J0SW5mb0ZvclByb3BlcnR5Iiwib1NvcnRSZXN0cmljdGlvbkluZm8iLCJvUHJvcGVydHlJbmZvIiwiZ2V0RmlsdGVyUmVzdHJpY3Rpb25zSW5mbyIsIm9GaWx0ZXJSZXN0cmljdGlvbnMiLCJvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbyIsImZpbHRlcmFibGUiLCJGaWx0ZXJhYmxlIiwicmVxdWlyZXNGaWx0ZXIiLCJSZXF1aXJlc0ZpbHRlciIsInJlcXVpcmVkUHJvcGVydGllcyIsIlJlcXVpcmVkUHJvcGVydGllcyIsIk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzIiwiRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImFsbG93ZWRFeHByZXNzaW9ucyIsIkFsbG93ZWRFeHByZXNzaW9ucyIsImlzTXVsdGlWYWx1ZUZpbHRlckV4cHJlc3Npb24iLCJzRmlsdGVyRXhwcmVzc2lvbiIsImJJc011bHRpVmFsdWUiLCJhZGRGaWx0ZXJJbmZvRm9yUHJvcGVydHkiLCJvRmlsdGVyUmVzdHJpY3Rpb25JbmZvIiwiZ2V0VHlwZSIsInNFZG1UeXBlIiwiZmV0Y2hDYWxlbmRhclRhZyIsIkNPTU1PTiIsIlByb21pc2UiLCJhbGwiLCJhVGFnIiwiZmV0Y2hGaXNjYWxUYWciLCJmZXRjaENyaXRpY2FsaXR5IiwiVUkiLCJhVmFsdWVDcml0aWNhbGl0eSIsIm9WYWx1ZUNyaXRpY2FsaXR5IiwiVmVyeVBvc2l0aXZlIiwiUG9zaXRpdmUiLCJDcml0aWNhbCIsIlZlcnlOZWdhdGl2ZSIsIk5lZ2F0aXZlIiwiTmV1dHJhbCIsImVuZHNXaXRoIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJPRGF0YU1ldGFNb2RlbFV0aWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbVR5cGUgPSB7XG5cdFwiRWRtLkJpbmFyeVwiOiBcImJvb2xlYW5cIixcblx0XCJFZG0uQm9vbGVhblwiOiBcImJvb2xlYW5cIixcblx0XCJFZG0uQnl0ZVwiOiBcImJvb2xlYW5cIixcblx0XCJFZG0uRGF0ZVwiOiBcImRhdGVcIixcblx0XCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjogXCJkYXRlVGltZVwiLFxuXHRcIkVkbS5EZWNpbWFsXCI6IFwiaW50XCIsXG5cdFwiRWRtLkRvdWJsZVwiOiBcImJvb2xlYW5cIixcblx0XCJFZG0uRHVyYXRpb25cIjogXCJmbG9hdFwiLFxuXHRcIkVkbS5HdWlkXCI6IFwic3RyaW5nXCIsXG5cdFwiRWRtLkludDE2XCI6IFwiaW50XCIsXG5cdFwiRWRtLkludDMyXCI6IFwiaW50XCIsXG5cdFwiRWRtLkludDY0XCI6IFwiaW50XCIsXG5cdFwiRWRtLlNCeXRlXCI6IFwiYm9vbGVhblwiLFxuXHRcIkVkbS5TaW5nbGVcIjogXCJmbG9hdFwiLFxuXHRcIkVkbS5TdHJpbmdcIjogXCJzdHJpbmdcIixcblx0XCJFZG0uVGltZU9mRGF5XCI6IFwidGltZVwiXG59O1xuLyoqXG4gKiBVdGl0bGl0eSBjbGFzcyBmb3IgbWV0YWRhdGEgaW50ZXJwcmV0YXRpb24gaW5zaWRlIGRlbGVnYXRlIGNsYXNzZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBzaW5jZSAxLjYyXG4gKi9cbmNvbnN0IE9EYXRhTWV0YU1vZGVsVXRpbCA9IHtcblx0ZmV0Y2hBbGxBbm5vdGF0aW9ucyhvTWV0YU1vZGVsOiBhbnksIHNFbnRpdHlQYXRoOiBhbnkpIHtcblx0XHRjb25zdCBvQ3R4ID0gb01ldGFNb2RlbC5nZXRNZXRhQ29udGV4dChzRW50aXR5UGF0aCk7XG5cdFx0cmV0dXJuIG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChcIkBcIiwgb0N0eCkudGhlbihmdW5jdGlvbiAobUFubm9zOiBhbnkpIHtcblx0XHRcdHJldHVybiBtQW5ub3M7XG5cdFx0fSk7XG5cdH0sXG5cdC8qKlxuXHQgKiBUaGUgbWFwcGluZyBvZiBhbGwgYW5ub3RhdGlvbnMgb2YgYSBnaXZlbiBlbnRpdHkgc2V0LlxuXHQgKlxuXHQgKiBAcGFyYW0gbUFubm9zIEEgbGlzdCBvZiBhbm5vdGF0aW9ucyBvZiB0aGUgZW50aXR5IHNldFxuXHQgKiBAcmV0dXJucyBBIG1hcCB0byB0aGUgY3VzdG9tIGFnZ3JlZ2F0ZXMga2V5ZWQgYnkgdGhlaXIgcXVhbGlmaWVyc1xuXHQgKi9cblx0Z2V0QWxsQ3VzdG9tQWdncmVnYXRlcyhtQW5ub3M6IGFueSkge1xuXHRcdGNvbnN0IG1DdXN0b21BZ2dyZWdhdGVzOiBhbnkgPSB7fTtcblx0XHRsZXQgc0Fubm87XG5cdFx0Zm9yIChjb25zdCBzQW5ub0tleSBpbiBtQW5ub3MpIHtcblx0XHRcdGlmIChzQW5ub0tleS5zdGFydHNXaXRoKFwiQE9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5DdXN0b21BZ2dyZWdhdGVcIikpIHtcblx0XHRcdFx0c0Fubm8gPSBzQW5ub0tleS5yZXBsYWNlKFwiQE9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5DdXN0b21BZ2dyZWdhdGUjXCIsIFwiXCIpO1xuXHRcdFx0XHRjb25zdCBhQW5ubyA9IHNBbm5vLnNwbGl0KFwiQFwiKTtcblxuXHRcdFx0XHRpZiAoYUFubm8ubGVuZ3RoID09IDIpIHtcblx0XHRcdFx0XHQvL2lubmVyIGFubm90YXRpb24gdGhhdCBpcyBub3QgcGFydCBvZiBcdFZhbGlkYXRpb24uQWdncmVnYXRhYmxlVGVybXNcblx0XHRcdFx0XHRpZiAoYUFubm9bMV0gPT0gXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQ29udGV4dERlZmluaW5nUHJvcGVydGllc1wiKSB7XG5cdFx0XHRcdFx0XHRtQ3VzdG9tQWdncmVnYXRlc1thQW5ub1swXV0uY29udGV4dERlZmluaW5nUHJvcGVydGllcyA9IG1Bbm5vc1tzQW5ub0tleV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGFBbm5vWzFdID09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkxhYmVsXCIpIHtcblx0XHRcdFx0XHRcdG1DdXN0b21BZ2dyZWdhdGVzW2FBbm5vWzBdXS5sYWJlbCA9IG1Bbm5vc1tzQW5ub0tleV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKGFBbm5vLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHRcdFx0bUN1c3RvbUFnZ3JlZ2F0ZXNbYUFubm9bMF1dID0ge1xuXHRcdFx0XHRcdFx0bmFtZTogYUFubm9bMF0sXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVBhdGg6IGFBbm5vWzBdLFxuXHRcdFx0XHRcdFx0bGFiZWw6IGBDdXN0b20gQWdncmVnYXRlICgke3NBbm5vfSlgLFxuXHRcdFx0XHRcdFx0c29ydGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRzb3J0T3JkZXI6IFwiYm90aFwiLFxuXHRcdFx0XHRcdFx0Y3VzdG9tOiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBtQ3VzdG9tQWdncmVnYXRlcztcblx0fSxcblx0Z2V0QWxsQWdncmVnYXRhYmxlUHJvcGVydGllcyhtQW5ub3M6IGFueSkge1xuXHRcdGNvbnN0IG1BZ2dyZWdhdGFibGVQcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblx0XHRsZXQgYVByb3BlcnRpZXMsIG9Qcm9wZXJ0eTtcblx0XHRpZiAobUFubm9zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5BZ2dyZWdhdGVkUHJvcGVydGllc1wiXSkge1xuXHRcdFx0YVByb3BlcnRpZXMgPSBtQW5ub3NbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLkFnZ3JlZ2F0ZWRQcm9wZXJ0aWVzXCJdO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdG9Qcm9wZXJ0eSA9IGFQcm9wZXJ0aWVzW2ldO1xuXG5cdFx0XHRcdG1BZ2dyZWdhdGFibGVQcm9wZXJ0aWVzW29Qcm9wZXJ0eS5OYW1lXSA9IHtcblx0XHRcdFx0XHRuYW1lOiBvUHJvcGVydHkuTmFtZSxcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGg6IG9Qcm9wZXJ0eS5BZ2dyZWdhdGFibGVQcm9wZXJ0eS4kUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGFnZ3JlZ2F0aW9uTWV0aG9kOiBvUHJvcGVydHkuQWdncmVnYXRpb25NZXRob2QsXG5cdFx0XHRcdFx0bGFiZWw6IG9Qcm9wZXJ0eVtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTGFiZWxcIl0gfHwgYEFnZ3JlZ2F0YWJsZSBwcm9wZXJ0eSAoJHtvUHJvcGVydHkuTmFtZX0pYCxcblx0XHRcdFx0XHRzb3J0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRzb3J0T3JkZXI6IFwiYm90aFwiLFxuXHRcdFx0XHRcdGN1c3RvbTogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXM7XG5cdH0sXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbmQgb3JkZXIgYWxsIGRhdGEgcG9pbnRzIGJ5IHRoZWlyIHByb3BlcnR5IGFuZCBxdWFsaWZpZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBtQW5ub3MgQSBuYW1lZCBtYXAgb2YgYW5ub3RhdGlvbnMgZnJvbSBhIGdpdmVuIGVudGl0eSBzZXRcblx0ICogQHJldHVybnMgQSBrZXllZCBtYXBwZWQgb3JkZXJlZCBieVxuXHQgKiA8dWw+XG5cdCAqICAgICA8bGk+IFRoZSBwcm9wZXJ0aWVzIHZhbHVlIHBhdGggPC9saT5cblx0ICogICAgIDxsaT4gVGhlIHF1YWxpZmllciBvZiB0aGUgZGF0YSBwb2ludCA8KGxpPlxuXHQgKiA8L3VsPlxuXHQgKi9cblx0Z2V0QWxsRGF0YVBvaW50cyhtQW5ub3M6IGFueVtdKSB7XG5cdFx0Y29uc3QgbURhdGFQb2ludHM6IGFueSA9IHt9O1xuXHRcdGZvciAoY29uc3Qgc0Fubm9LZXkgaW4gbUFubm9zKSB7XG5cdFx0XHRpZiAoc0Fubm9LZXkuc3RhcnRzV2l0aChcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIikpIHtcblx0XHRcdFx0Y29uc3Qgc1F1YWxpZmllciA9IHNBbm5vS2V5LnJlcGxhY2UoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50I1wiLCBcIlwiKTtcblx0XHRcdFx0Y29uc3Qgc1ZhbHVlID0gbUFubm9zW3NBbm5vS2V5XS5WYWx1ZS4kUGF0aDtcblx0XHRcdFx0bURhdGFQb2ludHNbc1ZhbHVlXSA9IG1EYXRhUG9pbnRzW3NWYWx1ZV0gfHwge307XG5cdFx0XHRcdG1EYXRhUG9pbnRzW3NWYWx1ZV1bc1F1YWxpZmllcl0gPSBPRGF0YU1ldGFNb2RlbFV0aWwuY3JlYXRlRGF0YVBvaW50UHJvcGVydHkobUFubm9zW3NBbm5vS2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1EYXRhUG9pbnRzO1xuXHR9LFxuXHQvKipcblx0ICogRm9ybWF0IHRoZSBkYXRhIHBvaW50IGFzIGEgSlNPTiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRGF0YVBvaW50QW5ub1xuXHQgKiBAcmV0dXJucyBUaGUgZm9ybWF0dGVkIGpzb24gb2JqZWN0XG5cdCAqL1xuXHRjcmVhdGVEYXRhUG9pbnRQcm9wZXJ0eShvRGF0YVBvaW50QW5ubzogYW55KSB7XG5cdFx0Y29uc3Qgb0RhdGFQb2ludDogYW55ID0ge307XG5cblx0XHRpZiAob0RhdGFQb2ludEFubm8uVGFyZ2V0VmFsdWUpIHtcblx0XHRcdG9EYXRhUG9pbnQudGFyZ2V0VmFsdWUgPSBvRGF0YVBvaW50QW5uby5UYXJnZXRWYWx1ZS4kUGF0aDtcblx0XHR9XG5cblx0XHRpZiAob0RhdGFQb2ludEFubm8uRm9yZUNhc3RWYWx1ZSkge1xuXHRcdFx0b0RhdGFQb2ludC5mb3JlQ2FzdFZhbHVlID0gb0RhdGFQb2ludEFubm8uRm9yZUNhc3RWYWx1ZS4kUGF0aDtcblx0XHR9XG5cblx0XHRsZXQgb0NyaXRpY2FsaXR5ID0gbnVsbDtcblx0XHRpZiAob0RhdGFQb2ludEFubm8uQ3JpdGljYWxpdHkpIHtcblx0XHRcdGlmIChvRGF0YVBvaW50QW5uby5Dcml0aWNhbGl0eS4kUGF0aCkge1xuXHRcdFx0XHQvL3dpbGwgYmUgYW4gYWdncmVnYXRlZCBwcm9wZXJ0eSBvciBjdXN0b20gYWdncmVnYXRlXG5cdFx0XHRcdG9Dcml0aWNhbGl0eSA9IHtcblx0XHRcdFx0XHRDYWxjdWxhdGVkOiBvRGF0YVBvaW50QW5uby5Dcml0aWNhbGl0eS4kUGF0aFxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b0NyaXRpY2FsaXR5ID0ge1xuXHRcdFx0XHRcdFN0YXRpYzogb0RhdGFQb2ludEFubm8uQ3JpdGljYWxpdHkuJEVudW1NZW1iZXIucmVwbGFjZShcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNyaXRpY2FsaXR5VHlwZS9cIiwgXCJcIilcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9EYXRhUG9pbnRBbm5vLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24pIHtcblx0XHRcdGNvbnN0IG9UaHJlc2hvbGRzID0ge307XG5cdFx0XHRjb25zdCBiQ29uc3RhbnQgPSBPRGF0YU1ldGFNb2RlbFV0aWwuX2J1aWxkVGhyZXNob2xkcyhvVGhyZXNob2xkcywgb0RhdGFQb2ludEFubm8uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbik7XG5cblx0XHRcdGlmIChiQ29uc3RhbnQpIHtcblx0XHRcdFx0b0NyaXRpY2FsaXR5ID0ge1xuXHRcdFx0XHRcdENvbnN0YW50VGhyZXNob2xkczogb1RocmVzaG9sZHNcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9Dcml0aWNhbGl0eSA9IHtcblx0XHRcdFx0XHREeW5hbWljVGhyZXNob2xkczogb1RocmVzaG9sZHNcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAob0NyaXRpY2FsaXR5KSB7XG5cdFx0XHRvRGF0YVBvaW50LmNyaXRpY2FsaXR5ID0gb0NyaXRpY2FsaXR5O1xuXHRcdH1cblxuXHRcdHJldHVybiBvRGF0YVBvaW50O1xuXHR9LFxuXHQvKipcblx0ICogQ2hlY2tzIHdoZXRoZXIgdGhlIHRocmVzaG9sZHMgYXJlIGR5bmFtaWMgb3IgY29uc3RhbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvVGhyZXNob2xkcyBUaGUgdGhyZXNob2xkIHNrZWxldG9uXG5cdCAqIEBwYXJhbSBvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbiBUaGUgVUkuRGF0YVBvaW50LkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24gYW5ub3RhdGlvblxuXHQgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHRocmVzaG9sZCBzaG91bGQgYmUgc3VwcGxpZWQgYXMgQ29uc3RhbnRUaHJlc2hvbGRzLCA8Y29kZT5mYWxzZTwvY29kZT4gaWYgdGhlIHRocmVzaG9sZCBzaG91bGRcblx0ICogYmUgc3VwcGxpZWQgYXMgRHluYW1pY1RocmVzaG9sZHNcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9idWlsZFRocmVzaG9sZHMob1RocmVzaG9sZHM6IGFueSwgb0NyaXRpY2FsaXR5Q2FsY3VsYXRpb246IGFueSkge1xuXHRcdGNvbnN0IGFLZXlzID0gW1xuXHRcdFx0XCJBY2NlcHRhbmNlUmFuZ2VMb3dWYWx1ZVwiLFxuXHRcdFx0XCJBY2NlcHRhbmNlUmFuZ2VIaWdoVmFsdWVcIixcblx0XHRcdFwiVG9sZXJhbmNlUmFuZ2VMb3dWYWx1ZVwiLFxuXHRcdFx0XCJUb2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZVwiLFxuXHRcdFx0XCJEZXZpYXRpb25SYW5nZUxvd1ZhbHVlXCIsXG5cdFx0XHRcIkRldmlhdGlvblJhbmdlSGlnaFZhbHVlXCJcblx0XHRdO1xuXHRcdGxldCBiQ29uc3RhbnQgPSB0cnVlLFxuXHRcdFx0c0tleSxcblx0XHRcdGksXG5cdFx0XHRqO1xuXG5cdFx0b1RocmVzaG9sZHMuSW1wcm92ZW1lbnREaXJlY3Rpb24gPSBvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5JbXByb3ZlbWVudERpcmVjdGlvbi4kRW51bU1lbWJlci5yZXBsYWNlKFxuXHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JbXByb3ZlbWVudERpcmVjdGlvblR5cGUvXCIsXG5cdFx0XHRcIlwiXG5cdFx0KTtcblxuXHRcdGNvbnN0IG9EeW5hbWljVGhyZXNob2xkczogYW55ID0ge1xuXHRcdFx0b25lU3VwcGxpZWQ6IGZhbHNlLFxuXHRcdFx0dXNlZE1lYXN1cmVzOiBbXVxuXHRcdFx0Ly8gY29tYmluYXRpb24gdG8gY2hlY2sgd2hldGhlciBhdCBsZWFzdCBvbmUgaXMgc3VwcGxpZWRcblx0XHR9O1xuXHRcdGNvbnN0IG9Db25zdGFudFRocmVzaG9sZHM6IGFueSA9IHtcblx0XHRcdG9uZVN1cHBsaWVkOiBmYWxzZVxuXHRcdFx0Ly8gY29tYmluYXRpb24gdG8gY2hlY2sgd2hldGhlciBhdCBsZWFzdCBvbmUgaXMgc3VwcGxpZWRcblx0XHR9O1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGFLZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzS2V5ID0gYUtleXNbaV07XG5cdFx0XHRvRHluYW1pY1RocmVzaG9sZHNbc0tleV0gPSBvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbltzS2V5XSA/IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uW3NLZXldLiRQYXRoIDogdW5kZWZpbmVkO1xuXHRcdFx0b0R5bmFtaWNUaHJlc2hvbGRzLm9uZVN1cHBsaWVkID0gb0R5bmFtaWNUaHJlc2hvbGRzLm9uZVN1cHBsaWVkIHx8IG9EeW5hbWljVGhyZXNob2xkc1tzS2V5XTtcblxuXHRcdFx0aWYgKCFvRHluYW1pY1RocmVzaG9sZHMub25lU3VwcGxpZWQpIHtcblx0XHRcdFx0Ly8gb25seSBjb25zaWRlciBpbiBjYXNlIG5vIGR5bmFtaWMgdGhyZXNob2xkIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9Db25zdGFudFRocmVzaG9sZHNbc0tleV0gPSBvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbltzS2V5XTtcblx0XHRcdFx0b0NvbnN0YW50VGhyZXNob2xkcy5vbmVTdXBwbGllZCA9IG9Db25zdGFudFRocmVzaG9sZHMub25lU3VwcGxpZWQgfHwgb0NvbnN0YW50VGhyZXNob2xkc1tzS2V5XTtcblx0XHRcdH0gZWxzZSBpZiAob0R5bmFtaWNUaHJlc2hvbGRzW3NLZXldKSB7XG5cdFx0XHRcdG9EeW5hbWljVGhyZXNob2xkcy51c2VkTWVhc3VyZXMucHVzaChvRHluYW1pY1RocmVzaG9sZHNbc0tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGR5bmFtaWMgZGVmaW5pdGlvbiBzaGFsbCBvdmVycnVsZSBjb25zdGFudCBkZWZpbml0aW9uXG5cdFx0aWYgKG9EeW5hbWljVGhyZXNob2xkcy5vbmVTdXBwbGllZCkge1xuXHRcdFx0YkNvbnN0YW50ID0gZmFsc2U7XG5cblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhS2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAob0R5bmFtaWNUaHJlc2hvbGRzW2FLZXlzW2ldXSkge1xuXHRcdFx0XHRcdG9UaHJlc2hvbGRzW2FLZXlzW2ldXSA9IG9EeW5hbWljVGhyZXNob2xkc1thS2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9UaHJlc2hvbGRzLnVzZWRNZWFzdXJlcyA9IG9EeW5hbWljVGhyZXNob2xkcy51c2VkTWVhc3VyZXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBvQWdncmVnYXRpb25MZXZlbDogYW55O1xuXHRcdFx0b1RocmVzaG9sZHMuQWdncmVnYXRpb25MZXZlbHMgPSBbXTtcblxuXHRcdFx0Ly8gY2hlY2sgaWYgYXQgbGVhc3Qgb25lIHN0YXRpYyB2YWx1ZSBpcyBzdXBwbGllZFxuXHRcdFx0aWYgKG9Db25zdGFudFRocmVzaG9sZHMub25lU3VwcGxpZWQpIHtcblx0XHRcdFx0Ly8gYWRkIG9uZSBlbnRyeSBpbiB0aGUgYWdncmVnYXRpb24gbGV2ZWxcblx0XHRcdFx0b0FnZ3JlZ2F0aW9uTGV2ZWwgPSB7XG5cdFx0XHRcdFx0VmlzaWJsZURpbWVuc2lvbnM6IG51bGxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYUtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAob0NvbnN0YW50VGhyZXNob2xkc1thS2V5c1tpXV0pIHtcblx0XHRcdFx0XHRcdG9BZ2dyZWdhdGlvbkxldmVsW2FLZXlzW2ldXSA9IG9Db25zdGFudFRocmVzaG9sZHNbYUtleXNbaV1dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9UaHJlc2hvbGRzLkFnZ3JlZ2F0aW9uTGV2ZWxzLnB1c2gob0FnZ3JlZ2F0aW9uTGV2ZWwpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmdXJ0aGVyIGNoZWNrIGZvciBDb25zdGFudFRocmVzaG9sZHNcblx0XHRcdGlmIChvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5Db25zdGFudFRocmVzaG9sZHMgJiYgb0NyaXRpY2FsaXR5Q2FsY3VsYXRpb24uQ29uc3RhbnRUaHJlc2hvbGRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkNvbnN0YW50VGhyZXNob2xkcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IG9BZ2dyZWdhdGlvbkxldmVsSW5mbyA9IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkNvbnN0YW50VGhyZXNob2xkc1tpXTtcblxuXHRcdFx0XHRcdGNvbnN0IGFWaXNpYmxlRGltZW5zaW9uczogYW55ID0gb0FnZ3JlZ2F0aW9uTGV2ZWxJbmZvLkFnZ3JlZ2F0aW9uTGV2ZWwgPyBbXSA6IG51bGw7XG5cblx0XHRcdFx0XHRpZiAob0FnZ3JlZ2F0aW9uTGV2ZWxJbmZvLkFnZ3JlZ2F0aW9uTGV2ZWwgJiYgb0FnZ3JlZ2F0aW9uTGV2ZWxJbmZvLkFnZ3JlZ2F0aW9uTGV2ZWwubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG9BZ2dyZWdhdGlvbkxldmVsSW5mby5BZ2dyZWdhdGlvbkxldmVsLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdGFWaXNpYmxlRGltZW5zaW9ucy5wdXNoKG9BZ2dyZWdhdGlvbkxldmVsSW5mby5BZ2dyZWdhdGlvbkxldmVsW2pdLiRQcm9wZXJ0eVBhdGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG9BZ2dyZWdhdGlvbkxldmVsID0ge1xuXHRcdFx0XHRcdFx0VmlzaWJsZURpbWVuc2lvbnM6IGFWaXNpYmxlRGltZW5zaW9uc1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgYUtleXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IG5WYWx1ZSA9IG9BZ2dyZWdhdGlvbkxldmVsSW5mb1thS2V5c1tqXV07XG5cdFx0XHRcdFx0XHRpZiAoblZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdG9BZ2dyZWdhdGlvbkxldmVsW2FLZXlzW2pdXSA9IG5WYWx1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvVGhyZXNob2xkcy5BZ2dyZWdhdGlvbkxldmVscy5wdXNoKG9BZ2dyZWdhdGlvbkxldmVsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBiQ29uc3RhbnQ7XG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHRoZSBzb3J0aW5nIGluZm9ybWF0aW9uIGZyb20gdGhlIHJlc3RyaWN0aW9uIGFubm90YXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBvU29ydFJlc3RyaWN0aW9ucyBUaGUgc29ydCByZXN0cmljdGlvbnMgYW5ub3RhdGlvblxuXHQgKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgc29ydCByZXN0cmljdGlvbiBpbmZvcm1hdGlvblxuXHQgKi9cblx0Z2V0U29ydFJlc3RyaWN0aW9uc0luZm8ob1NvcnRSZXN0cmljdGlvbnM6IGFueSkge1xuXHRcdGxldCBpLCBzUHJvcGVydHlOYW1lO1xuXHRcdGNvbnN0IG9Tb3J0UmVzdHJpY3Rpb25zSW5mbzogYW55ID0ge1xuXHRcdFx0c29ydGFibGU6IHRydWUsXG5cdFx0XHRwcm9wZXJ0eUluZm86IHt9XG5cdFx0fTtcblxuXHRcdGlmIChvU29ydFJlc3RyaWN0aW9ucykge1xuXHRcdFx0b1NvcnRSZXN0cmljdGlvbnNJbmZvLnNvcnRhYmxlID0gb1NvcnRSZXN0cmljdGlvbnMuU29ydGFibGUgIT0gbnVsbCA/IG9Tb3J0UmVzdHJpY3Rpb25zLlNvcnRhYmxlIDogdHJ1ZTtcblx0XHRcdGlmIChvU29ydFJlc3RyaWN0aW9ucy5Ob25Tb3J0YWJsZVByb3BlcnRpZXMpIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG9Tb3J0UmVzdHJpY3Rpb25zLk5vblNvcnRhYmxlUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHNQcm9wZXJ0eU5hbWUgPSBvU29ydFJlc3RyaWN0aW9ucy5Ob25Tb3J0YWJsZVByb3BlcnRpZXNbaV0uJFByb3BlcnR5UGF0aDtcblx0XHRcdFx0XHRvU29ydFJlc3RyaWN0aW9uc0luZm9bc1Byb3BlcnR5TmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRzb3J0YWJsZTogZmFsc2Vcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAob1NvcnRSZXN0cmljdGlvbnMuQXNjZW5kaW5nT25seVByb3BlcnRpZXMpIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG9Tb3J0UmVzdHJpY3Rpb25zLkFzY2VuZGluZ09ubHlQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0c1Byb3BlcnR5TmFtZSA9IG9Tb3J0UmVzdHJpY3Rpb25zLkFzY2VuZGluZ09ubHlQcm9wZXJ0aWVzW2ldLiRQcm9wZXJ0eVBhdGg7XG5cdFx0XHRcdFx0b1NvcnRSZXN0cmljdGlvbnNJbmZvW3NQcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0XHRcdFx0c29ydGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRzb3J0RGlyZWN0aW9uOiBcImFzY1wiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAob1NvcnRSZXN0cmljdGlvbnMuQXNjZW5kaW5nT25seVByb3BlcnRpZXMpIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG9Tb3J0UmVzdHJpY3Rpb25zLkRlc2NlbmRpbmdPbmx5UHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHNQcm9wZXJ0eU5hbWUgPSBvU29ydFJlc3RyaWN0aW9ucy5EZXNjZW5kaW5nT25seVByb3BlcnRpZXNbaV0uJFByb3BlcnR5UGF0aDtcblx0XHRcdFx0XHRvU29ydFJlc3RyaWN0aW9uc0luZm9bc1Byb3BlcnR5TmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRzb3J0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvU29ydFJlc3RyaWN0aW9uc0luZm87XG5cdH0sXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSBFbnRpdHkgUHJvcGVydHlcblx0ICogQHBhcmFtIG9Tb3J0UmVzdHJpY3Rpb25JbmZvIFRoZSBTb3J0SW5mb3JtYXRpb24gcmVzdHJpY3Rpb25zXG5cdCAqL1xuXHRhZGRTb3J0SW5mb0ZvclByb3BlcnR5KG9Qcm9wZXJ0eTogYW55LCBvU29ydFJlc3RyaWN0aW9uSW5mbzogYW55KSB7XG5cdFx0Y29uc3Qgb1Byb3BlcnR5SW5mbyA9IG9Tb3J0UmVzdHJpY3Rpb25JbmZvW29Qcm9wZXJ0eS5uYW1lXTtcblx0XHRvUHJvcGVydHkuc29ydGFibGUgPSBvU29ydFJlc3RyaWN0aW9uSW5mby5zb3J0YWJsZSAmJiBvUHJvcGVydHlJbmZvID8gb1Byb3BlcnR5SW5mby5zb3J0YWJsZSA6IHRydWU7XG5cblx0XHRpZiAob1Byb3BlcnR5LnNvcnRhYmxlKSB7XG5cdFx0XHRvUHJvcGVydHkuc29ydERpcmVjdGlvbiA9IG9Qcm9wZXJ0eUluZm8gPyBvUHJvcGVydHlJbmZvLnNvcnREaXJlY3Rpb24gOiBcImJvdGhcIjtcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHRoZSBmaWx0ZXIgaW5mb3JtYXRpb24gYmFzZWQgb24gdGhlIGZpbHRlciByZXN0cmljdGlvbnMgYW5ub2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0ZpbHRlclJlc3RyaWN0aW9ucyBUaGUgZmlsdGVyIHJlc3RyaWN0aW9ucyBhbm5vdGF0aW9uXG5cdCAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmaWx0ZXIgcmVzdHJpY3Rpb24gaW5mb3JtYXRpb25cblx0ICovXG5cdGdldEZpbHRlclJlc3RyaWN0aW9uc0luZm8ob0ZpbHRlclJlc3RyaWN0aW9uczogYW55KSB7XG5cdFx0bGV0IGksIHNQcm9wZXJ0eU5hbWU7XG5cdFx0Y29uc3Qgb0ZpbHRlclJlc3RyaWN0aW9uc0luZm86IGFueSA9IHtcblx0XHRcdGZpbHRlcmFibGU6IHRydWUsXG5cdFx0XHRwcm9wZXJ0eUluZm86IHt9XG5cdFx0fTtcblxuXHRcdGlmIChvRmlsdGVyUmVzdHJpY3Rpb25zKSB7XG5cdFx0XHRvRmlsdGVyUmVzdHJpY3Rpb25zSW5mby5maWx0ZXJhYmxlID0gb0ZpbHRlclJlc3RyaWN0aW9ucy5GaWx0ZXJhYmxlICE9IG51bGwgPyBvRmlsdGVyUmVzdHJpY3Rpb25zLkZpbHRlcmFibGUgOiB0cnVlO1xuXHRcdFx0b0ZpbHRlclJlc3RyaWN0aW9uc0luZm8ucmVxdWlyZXNGaWx0ZXIgPVxuXHRcdFx0XHRvRmlsdGVyUmVzdHJpY3Rpb25zLlJlcXVpcmVzRmlsdGVyICE9IG51bGwgPyBvRmlsdGVyUmVzdHJpY3Rpb25zLlJlcXVpcmVzRmlsdGVyIDogZmFsc2U7XG5cblx0XHRcdC8vSGllcmFyY2hpY2FsIENhc2Vcblx0XHRcdG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvLnJlcXVpcmVkUHJvcGVydGllcyA9IFtdO1xuXHRcdFx0aWYgKG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvLlJlcXVpcmVkUHJvcGVydGllcykge1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgb0ZpbHRlclJlc3RyaWN0aW9ucy5SZXF1aXJlZFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRzUHJvcGVydHlOYW1lID0gb0ZpbHRlclJlc3RyaWN0aW9ucy5SZXF1aXJlZFByb3BlcnRpZXNbaV0uJFByb3BlcnR5UGF0aDtcblx0XHRcdFx0XHRvRmlsdGVyUmVzdHJpY3Rpb25zSW5mby5yZXF1aXJlZFByb3BlcnRpZXMucHVzaChzUHJvcGVydHlOYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAob0ZpbHRlclJlc3RyaWN0aW9ucy5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcykge1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgb0ZpbHRlclJlc3RyaWN0aW9ucy5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHNQcm9wZXJ0eU5hbWUgPSBvRmlsdGVyUmVzdHJpY3Rpb25zLk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzW2ldLiRQcm9wZXJ0eVBhdGg7XG5cdFx0XHRcdFx0b0ZpbHRlclJlc3RyaWN0aW9uc0luZm9bc1Byb3BlcnR5TmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJhYmxlOiBmYWxzZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG9GaWx0ZXJSZXN0cmljdGlvbnMuRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucykge1xuXHRcdFx0XHQvL1RCRFxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgb0ZpbHRlclJlc3RyaWN0aW9ucy5GaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0c1Byb3BlcnR5TmFtZSA9IG9GaWx0ZXJSZXN0cmljdGlvbnMuRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uc1tpXS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRcdG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvW3NQcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0XHRcdFx0ZmlsdGVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGFsbG93ZWRFeHByZXNzaW9uczogb0ZpbHRlclJlc3RyaWN0aW9ucy5GaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zW2ldLkFsbG93ZWRFeHByZXNzaW9uc1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb0ZpbHRlclJlc3RyaWN0aW9uc0luZm87XG5cdH0sXG5cdC8qKlxuXHQgKiBQcm92aWRlcyB0aGUgaW5mb3JtYXRpb24gaWYgdGhlIEZpbHRlckV4cHJlc3Npb24gaXMgYSBtdWx0aVZhbHVlIEZpbHRlciBFeHByZXNzaW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gc0ZpbHRlckV4cHJlc3Npb24gVGhlIEZpbHRlckV4cHJlc3Npb25UeXBlXG5cdCAqIEByZXR1cm5zIEEgYm9vbGVhbiB2YWx1ZSB3ZXRoZXIgaXQgaXMgYSBtdWx0aVZhbHVlIEZpbHRlciBFeHByZXNzaW9uIG9yIG5vdFxuXHQgKi9cblx0aXNNdWx0aVZhbHVlRmlsdGVyRXhwcmVzc2lvbihzRmlsdGVyRXhwcmVzc2lvbjogU3RyaW5nKSB7XG5cdFx0bGV0IGJJc011bHRpVmFsdWUgPSB0cnVlO1xuXG5cdFx0Ly9TaW5nbGVWYWx1ZSB8IE11bHRpVmFsdWUgfCBTaW5nbGVSYW5nZSB8IE11bHRpUmFuZ2UgfCBTZWFyY2hFeHByZXNzaW9uIHwgTXVsdGlSYW5nZU9yU2VhcmNoRXhwcmVzc2lvblxuXG5cdFx0c3dpdGNoIChzRmlsdGVyRXhwcmVzc2lvbikge1xuXHRcdFx0Y2FzZSBcIlNlYXJjaEV4cHJlc3Npb25cIjpcblx0XHRcdGNhc2UgXCJTaW5nbGVSYW5nZVwiOlxuXHRcdFx0Y2FzZSBcIlNpbmdsZVZhbHVlXCI6XG5cdFx0XHRcdGJJc011bHRpVmFsdWUgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gYklzTXVsdGlWYWx1ZTtcblx0fSxcblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIGVudGl0eSBwcm9wZXJ0eVxuXHQgKiBAcGFyYW0gb0ZpbHRlclJlc3RyaWN0aW9uSW5mbyBUaGUgZmlsdGVyIHJlc3RyaWN0aW9uc1xuXHQgKi9cblx0YWRkRmlsdGVySW5mb0ZvclByb3BlcnR5KG9Qcm9wZXJ0eTogYW55LCBvRmlsdGVyUmVzdHJpY3Rpb25JbmZvOiBhbnkpIHtcblx0XHRjb25zdCBvUHJvcGVydHlJbmZvID0gb0ZpbHRlclJlc3RyaWN0aW9uSW5mb1tvUHJvcGVydHkubmFtZV07XG5cdFx0b1Byb3BlcnR5LmZpbHRlcmFibGUgPSBvRmlsdGVyUmVzdHJpY3Rpb25JbmZvLmZpbHRlcmFibGUgJiYgb1Byb3BlcnR5SW5mbyA/IG9Qcm9wZXJ0eUluZm8uZmlsdGVyYWJsZSA6IHRydWU7XG5cblx0XHRpZiAob1Byb3BlcnR5LmZpbHRlcmFibGUpIHtcblx0XHRcdG9Qcm9wZXJ0eS5hbGxvd2VkRXhwcmVzc2lvbnMgPSBvUHJvcGVydHlJbmZvID8gb1Byb3BlcnR5SW5mby5hbGxvd2VkRXhwcmVzc2lvbnMgOiBudWxsO1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSBqYXZhIHNjcmlwdCB0eXBlIG9mIHRoZSBwcm9wZXJ0eS5cblx0ICpcblx0ICogQHBhcmFtIHNFZG1UeXBlIFRoZSBFZG0gdHlwZSwgbGlrZSBFZG0uU3RyaW5nLCBFZG0uSW50MTYuLi5cblx0ICogQHJldHVybnMgVGhlIGRhdGEgdHlwZS5cblx0ICovXG5cdGdldFR5cGUoc0VkbVR5cGU6IGtleW9mIHR5cGVvZiBtVHlwZSkge1xuXHRcdHJldHVybiBtVHlwZVtzRWRtVHlwZV0gfHwgXCJvYmplY3RcIjtcblx0fSxcblx0ZmV0Y2hDYWxlbmRhclRhZyhvTWV0YU1vZGVsOiBhbnksIG9DdHg6IGFueSkge1xuXHRcdGNvbnN0IENPTU1PTiA9IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5cIjtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW1xuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0NhbGVuZGFyWWVhcmAsIG9DdHgpLFxuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0NhbGVuZGFySGFsZnllYXJgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNDYWxlbmRhclF1YXJ0ZXJgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNDYWxlbmRhck1vbnRoYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzQ2FsZW5kYXJXZWVrYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzRGF5T2ZDYWxlbmRhck1vbnRoYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzRGF5T2ZDYWxlbmRhclllYXJgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNDYWxlbmRhclllYXJIYWxmeWVhcmAsIG9DdHgpLFxuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0NhbGVuZGFyWWVhclF1YXJ0ZXJgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNDYWxlbmRhclllYXJNb250aGAsIG9DdHgpLFxuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0NhbGVuZGFyWWVhcldlZWtgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNDYWxlbmRhckRhdGVgLCBvQ3R4KVxuXHRcdF0pLnRoZW4oZnVuY3Rpb24gKGFUYWc6IGFueVtdKSB7XG5cdFx0XHRpZiAoYVRhZ1swXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJ5ZWFyXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzFdKSB7XG5cdFx0XHRcdHJldHVybiBcImhhbGZZZWFyXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcInF1YXJ0ZXJcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbM10pIHtcblx0XHRcdFx0cmV0dXJuIFwibW9udGhcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbNF0pIHtcblx0XHRcdFx0cmV0dXJuIFwid2Vla1wiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVRhZ1s1XSkge1xuXHRcdFx0XHRyZXR1cm4gXCJkYXlPZk1vbnRoXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzZdKSB7XG5cdFx0XHRcdHJldHVybiBcImRheU9mWWVhclwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVRhZ1s3XSkge1xuXHRcdFx0XHRyZXR1cm4gXCJ5ZWFySGFsZlllYXJcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbOF0pIHtcblx0XHRcdFx0cmV0dXJuIFwieWVhclF1YXJ0ZXJcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbOV0pIHtcblx0XHRcdFx0cmV0dXJuIFwieWVhck1vbnRoXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzEwXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJ5ZWFyV2Vla1wiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVRhZ1sxMV0pIHtcblx0XHRcdFx0cmV0dXJuIFwiZGF0ZVwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH0pO1xuXHR9LFxuXHRmZXRjaEZpc2NhbFRhZyhvTWV0YU1vZGVsOiBhbnksIG9DdHg6IGFueSkge1xuXHRcdGNvbnN0IENPTU1PTiA9IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5cIjtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW1xuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0Zpc2NhbFllYXJgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNGaXNjYWxQZXJpb2RgLCBvQ3R4KSxcblx0XHRcdG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtDT01NT059SXNGaXNjYWxZZWFyUGVyaW9kYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzRmlzY2FsUXVhcnRlcmAsIG9DdHgpLFxuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0Zpc2NhbFllYXJRdWFydGVyYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzRmlzY2FsV2Vla2AsIG9DdHgpLFxuXHRcdFx0b01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke0NPTU1PTn1Jc0Zpc2NhbFllYXJXZWVrYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzRGF5T2ZGaXNjYWxZZWFyYCwgb0N0eCksXG5cdFx0XHRvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoYCR7Q09NTU9OfUlzRmlzY2FsWWVhclZhcmlhbnRgLCBvQ3R4KVxuXHRcdF0pLnRoZW4oZnVuY3Rpb24gKGFUYWc6IFthbnksIGFueSwgYW55LCBhbnksIGFueSwgYW55LCBhbnksIGFueSwgYW55XSkge1xuXHRcdFx0aWYgKGFUYWdbMF0pIHtcblx0XHRcdFx0cmV0dXJuIFwieWVhclwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVRhZ1sxXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJwZXJpb2RcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwieWVhclBlcmlvZFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYVRhZ1szXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJxdWFydGVyXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzRdKSB7XG5cdFx0XHRcdHJldHVybiBcInllYXJRdWFydGVyXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzVdKSB7XG5cdFx0XHRcdHJldHVybiBcIndlZWtcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbNl0pIHtcblx0XHRcdFx0cmV0dXJuIFwieWVhcldlZWtcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFUYWdbN10pIHtcblx0XHRcdFx0cmV0dXJuIFwiZGF5T2ZZZWFyXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhVGFnWzhdKSB7XG5cdFx0XHRcdHJldHVybiBcInllYXJWYXJpYW50XCI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fSk7XG5cdH0sXG5cdGZldGNoQ3JpdGljYWxpdHkob01ldGFNb2RlbDogYW55LCBvQ3R4OiBhbnkpIHtcblx0XHRjb25zdCBVSSA9IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxXCI7XG5cdFx0cmV0dXJuIG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgJHtVSX0uVmFsdWVDcml0aWNhbGl0eWAsIG9DdHgpLnRoZW4oZnVuY3Rpb24gKGFWYWx1ZUNyaXRpY2FsaXR5OiBhbnkpIHtcblx0XHRcdGxldCBvQ3JpdGljYWxpdHksIG9WYWx1ZUNyaXRpY2FsaXR5OiBhbnk7XG5cblx0XHRcdGlmIChhVmFsdWVDcml0aWNhbGl0eSkge1xuXHRcdFx0XHRvQ3JpdGljYWxpdHkgPSB7XG5cdFx0XHRcdFx0VmVyeVBvc2l0aXZlOiBbXSxcblx0XHRcdFx0XHRQb3NpdGl2ZTogW10sXG5cdFx0XHRcdFx0Q3JpdGljYWw6IFtdLFxuXHRcdFx0XHRcdFZlcnlOZWdhdGl2ZTogW10sXG5cdFx0XHRcdFx0TmVnYXRpdmU6IFtdLFxuXHRcdFx0XHRcdE5ldXRyYWw6IFtdXG5cdFx0XHRcdH0gYXMgYW55O1xuXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYVZhbHVlQ3JpdGljYWxpdHkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvVmFsdWVDcml0aWNhbGl0eSA9IGFWYWx1ZUNyaXRpY2FsaXR5W2ldO1xuXG5cdFx0XHRcdFx0aWYgKG9WYWx1ZUNyaXRpY2FsaXR5LkNyaXRpY2FsaXR5LiRFbnVtTWVtYmVyLmVuZHNXaXRoKFwiVmVyeVBvc2l0aXZlXCIpKSB7XG5cdFx0XHRcdFx0XHRvQ3JpdGljYWxpdHkuVmVyeVBvc2l0aXZlLnB1c2gob1ZhbHVlQ3JpdGljYWxpdHkuVmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAob1ZhbHVlQ3JpdGljYWxpdHkuQ3JpdGljYWxpdHkuJEVudW1NZW1iZXIuZW5kc1dpdGgoXCJQb3NpdGl2ZVwiKSkge1xuXHRcdFx0XHRcdFx0b0NyaXRpY2FsaXR5LlBvc2l0aXZlLnB1c2gob1ZhbHVlQ3JpdGljYWxpdHkuVmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAob1ZhbHVlQ3JpdGljYWxpdHkuQ3JpdGljYWxpdHkuJEVudW1NZW1iZXIuZW5kc1dpdGgoXCJDcml0aWNhbFwiKSkge1xuXHRcdFx0XHRcdFx0b0NyaXRpY2FsaXR5LkNyaXRpY2FsLnB1c2gob1ZhbHVlQ3JpdGljYWxpdHkuVmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAob1ZhbHVlQ3JpdGljYWxpdHkuQ3JpdGljYWxpdHkuJEVudW1NZW1iZXIuZW5kc1dpdGgoXCJWZXJ5TmVnYXRpdmVcIikpIHtcblx0XHRcdFx0XHRcdG9Dcml0aWNhbGl0eS5WZXJ5TmVnYXRpdmUucHVzaChvVmFsdWVDcml0aWNhbGl0eS5WYWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChvVmFsdWVDcml0aWNhbGl0eS5Dcml0aWNhbGl0eS4kRW51bU1lbWJlci5lbmRzV2l0aChcIk5lZ2F0aXZlXCIpKSB7XG5cdFx0XHRcdFx0XHRvQ3JpdGljYWxpdHkuTmVnYXRpdmUucHVzaChvVmFsdWVDcml0aWNhbGl0eS5WYWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9Dcml0aWNhbGl0eS5OZXV0cmFsLnB1c2gob1ZhbHVlQ3JpdGljYWxpdHkuVmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAoY29uc3Qgc0tleSBpbiBvQ3JpdGljYWxpdHkpIHtcblx0XHRcdFx0XHRpZiAob0NyaXRpY2FsaXR5W3NLZXldLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgb0NyaXRpY2FsaXR5W3NLZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb0NyaXRpY2FsaXR5O1xuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPRGF0YU1ldGFNb2RlbFV0aWw7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtB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