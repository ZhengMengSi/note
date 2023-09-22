/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/converters/controls/Common/DataVisualization", "sap/fe/macros/CommonHelper", "sap/fe/macros/internal/helpers/ActionHelper", "sap/fe/macros/ODataMetaModelUtil", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v4/AnnotationHelper"], function (Log, DataVisualization, CommonHelper, ActionHelper, ODataMetaModelUtil, JSONModel, ODataModelAnnotationHelper) {
  "use strict";

  var getUiControl = DataVisualization.getUiControl;

  function formatJSONToString(oCrit) {
    if (!oCrit) {
      return undefined;
    }

    var sCriticality = JSON.stringify(oCrit);
    sCriticality = sCriticality.replace(new RegExp("{", "g"), "\\{");
    sCriticality = sCriticality.replace(new RegExp("}", "g"), "\\}");
    return sCriticality;
  }

  function getEntitySetPath(oAnnotationContext) {
    var sAnnoPath = oAnnotationContext.getPath(),
        sPathEntitySetPath = sAnnoPath.replace(/@com.sap.vocabularies.UI.v1.(Chart|PresentationVariant).*/, "");
    return sPathEntitySetPath;
  }

  var mChartType = {
    "com.sap.vocabularies.UI.v1.ChartType/Column": "column",
    "com.sap.vocabularies.UI.v1.ChartType/ColumnStacked": "stacked_column",
    "com.sap.vocabularies.UI.v1.ChartType/ColumnDual": "dual_column",
    "com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual": "dual_stacked_column",
    "com.sap.vocabularies.UI.v1.ChartType/ColumnStacked100": "100_stacked_column",
    "com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual100": "100_dual_stacked_column",
    "com.sap.vocabularies.UI.v1.ChartType/Bar": "bar",
    "com.sap.vocabularies.UI.v1.ChartType/BarStacked": "stacked_bar",
    "com.sap.vocabularies.UI.v1.ChartType/BarDual": "dual_bar",
    "com.sap.vocabularies.UI.v1.ChartType/BarStackedDual": "dual_stacked_bar",
    "com.sap.vocabularies.UI.v1.ChartType/BarStacked100": "100_stacked_bar",
    "com.sap.vocabularies.UI.v1.ChartType/BarStackedDual100": "100_dual_stacked_bar",
    "com.sap.vocabularies.UI.v1.ChartType/Area": "area",
    "com.sap.vocabularies.UI.v1.ChartType/AreaStacked": "stacked_column",
    "com.sap.vocabularies.UI.v1.ChartType/AreaStacked100": "100_stacked_column",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalArea": "bar",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked": "stacked_bar",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked100": "100_stacked_bar",
    "com.sap.vocabularies.UI.v1.ChartType/Line": "line",
    "com.sap.vocabularies.UI.v1.ChartType/LineDual": "dual_line",
    "com.sap.vocabularies.UI.v1.ChartType/Combination": "combination",
    "com.sap.vocabularies.UI.v1.ChartType/CombinationStacked": "stacked_combination",
    "com.sap.vocabularies.UI.v1.ChartType/CombinationDual": "dual_combination",
    "com.sap.vocabularies.UI.v1.ChartType/CombinationStackedDual": "dual_stacked_combination",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStacked": "horizontal_stacked_combination",
    "com.sap.vocabularies.UI.v1.ChartType/Pie": "pie",
    "com.sap.vocabularies.UI.v1.ChartType/Donut": "donut",
    "com.sap.vocabularies.UI.v1.ChartType/Scatter": "scatter",
    "com.sap.vocabularies.UI.v1.ChartType/Bubble": "bubble",
    "com.sap.vocabularies.UI.v1.ChartType/Radar": "line",
    "com.sap.vocabularies.UI.v1.ChartType/HeatMap": "heatmap",
    "com.sap.vocabularies.UI.v1.ChartType/TreeMap": "treemap",
    "com.sap.vocabularies.UI.v1.ChartType/Waterfall": "waterfall",
    "com.sap.vocabularies.UI.v1.ChartType/Bullet": "bullet",
    "com.sap.vocabularies.UI.v1.ChartType/VerticalBullet": "vertical_bullet",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalWaterfall": "horizontal_waterfall",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationDual": "dual_horizontal_combination",
    "com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStackedDual": "dual_horizontal_stacked_combination"
  };
  var mDimensionRole = {
    "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category": "category",
    "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series": "series",
    "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category2": "category2"
  };
  /**
   * Helper class for sap.fe.macros Chart phantom control for prepecosseing.
   * <h3><b>Note:</b></h3>
   * The class is experimental and the API/behaviour is not finalised
   * and hence this should not be used for productive usage.
   * Especially this class is not intended to be used for the FE scenario,
   * here we shall use sap.fe.macros.ChartHelper that is especially tailored for V4
   * meta model
   *
   * @author SAP SE
   * @private
   * @experimental
   * @since 1.62
   * @alias sap.fe.macros.ChartHelper
   */

  var ChartHelper = {
    getP13nMode: function (oViewData) {
      var aPersonalization = [],
          bVariantManagement = oViewData.variantManagement && (oViewData.variantManagement === "Page" || oViewData.variantManagement === "Control"),
          personalization = true; // by default enabled

      if (bVariantManagement && personalization) {
        if (personalization) {
          // full personalization scope
          return "Sort,Type,Item";
        } else if (typeof personalization === "object") {
          if (personalization.type) {
            aPersonalization.push("Type");
          }

          if (personalization.sort) {
            aPersonalization.push("Sort");
          }

          return aPersonalization.join(",");
        }
      }
    },
    formatChartType: function (oChartType) {
      return mChartType[oChartType.$EnumMember];
    },
    formatDimensions: function (oAnnotationContext) {
      var oAnnotation = oAnnotationContext.getObject("./"),
          oMetaModel = oAnnotationContext.getModel(),
          sEntitySetPath = getEntitySetPath(oAnnotationContext),
          aDimensions = [];
      var i, j;
      var bIsNavigationText = false; //perhaps there are no dimension attributes

      oAnnotation.DimensionAttributes = oAnnotation.DimensionAttributes || [];

      for (i = 0; i < oAnnotation.Dimensions.length; i++) {
        var sKey = oAnnotation.Dimensions[i].$PropertyPath;
        var oText = oMetaModel.getObject("".concat(sEntitySetPath + sKey, "@com.sap.vocabularies.Common.v1.Text")) || {};

        if (sKey.indexOf("/") > -1) {
          Log.error("$expand is not yet supported. Dimension: ".concat(sKey, " from an association cannot be used"));
        }

        if (oText.$Path && oText.$Path.indexOf("/") > -1) {
          Log.error("$expand is not yet supported. Text Property: ".concat(oText.$Path, " from an association cannot be used for the dimension ").concat(sKey));
          bIsNavigationText = true;
        }

        var oDimension = {
          key: sKey,
          textPath: !bIsNavigationText ? oText.$Path : undefined,
          label: oMetaModel.getObject("".concat(sEntitySetPath + sKey, "@com.sap.vocabularies.Common.v1.Label")),
          role: "category"
        };

        for (j = 0; j < oAnnotation.DimensionAttributes.length; j++) {
          var oAttribute = oAnnotation.DimensionAttributes[j];

          if (oDimension.key === oAttribute.Dimension.$PropertyPath) {
            oDimension.role = mDimensionRole[oAttribute.Role.$EnumMember] || oDimension.role;
            break;
          }
        }

        oDimension.criticality = ODataMetaModelUtil.fetchCriticality(oMetaModel, oMetaModel.createBindingContext(sEntitySetPath + sKey)).then(formatJSONToString);
        aDimensions.push(oDimension);
      }

      var oDimensionModel = new JSONModel(aDimensions);
      oDimensionModel.$$valueAsPromise = true;
      return oDimensionModel.createBindingContext("/");
    },
    formatMeasures: function (oAnnotationContext) {
      return oAnnotationContext.getModel().getObject().measures;
    },
    getUiChart: function (oPresentationContext) {
      return getUiControl(oPresentationContext, "@com.sap.vocabularies.UI.v1.Chart");
    },
    getOperationAvailableMap: function (oChartContext, oContext) {
      var aChartCollection = oChartContext.Actions || [];
      return JSON.stringify(ActionHelper.getOperationAvailableMap(aChartCollection, "chart", oContext));
    },

    /**
     * Returns a stringified JSON object containing Presentation Variant sort conditions.
     *
     * @param oContext
     * @param oPresentationVariant Presentation Variant annotation
     * @param sPresentationVariantPath
     * @param oApplySupported
     * @returns Stringified JSON object
     */
    getSortConditions: function (oContext, oPresentationVariant, sPresentationVariantPath, oApplySupported) {
      if (oPresentationVariant && CommonHelper._isPresentationVariantAnnotation(sPresentationVariantPath) && oPresentationVariant.SortOrder) {
        var aSortConditions = {
          sorters: []
        };
        var sEntityPath = oContext.getPath(0).split("@")[0];
        oPresentationVariant.SortOrder.forEach(function () {
          var oCondition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var oSortProperty = "";
          var oSorter = {};

          if (oCondition.DynamicProperty) {
            var _oContext$getModel$ge;

            oSortProperty = "_fe_aggregatable_" + ((_oContext$getModel$ge = oContext.getModel(0).getObject(sEntityPath + oCondition.DynamicProperty.$AnnotationPath)) === null || _oContext$getModel$ge === void 0 ? void 0 : _oContext$getModel$ge.Name);
          } else if (oCondition.Property) {
            var aGroupableProperties = oApplySupported.GroupableProperties;

            if (aGroupableProperties && aGroupableProperties.length) {
              for (var i = 0; i < aGroupableProperties.length; i++) {
                if (aGroupableProperties[i].$PropertyPath === oCondition.Property.$PropertyPath) {
                  oSortProperty = "_fe_groupable_" + oCondition.Property.$PropertyPath;
                  break;
                }

                if (!oSortProperty) {
                  oSortProperty = "_fe_aggregatable_" + oCondition.Property.$PropertyPath;
                }
              }
            } else if (oContext.getModel(0).getObject(sEntityPath + oCondition.Property.$PropertyPath + "@Org.OData.Aggregation.V1.Groupable")) {
              oSortProperty = "_fe_groupable_" + oCondition.Property.$PropertyPath;
            } else {
              oSortProperty = "_fe_aggregatable_" + oCondition.Property.$PropertyPath;
            }
          }

          if (oSortProperty) {
            oSorter.name = oSortProperty;
            oSorter.descending = !!oCondition.Descending;
            aSortConditions.sorters.push(oSorter);
          } else {
            throw new Error("Please define the right path to the sort property");
          }
        });
        return JSON.stringify(aSortConditions);
      }

      return undefined;
    },
    getBindingData: function (sTargetCollection, oContext, aActions) {
      var aOperationAvailablePath = [];
      var sSelect;

      for (var i in aActions) {
        if (aActions[i].$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
          var sActionName = aActions[i].Action;
          var oActionOperationAvailable = CommonHelper.getActionPath(oContext, false, sActionName, true);

          if (oActionOperationAvailable && oActionOperationAvailable.$Path) {
            aOperationAvailablePath.push("'".concat(oActionOperationAvailable.$Path, "'"));
          } else if (oActionOperationAvailable === null) {// We disabled action advertisement but kept it in the code for the time being
            //aOperationAvailablePath.push(sActionName);
          }
        }
      }

      if (aOperationAvailablePath.length > 0) {
        //TODO: request fails with $select. check this with odata v4 model
        sSelect = " $select: '" + aOperationAvailablePath.join() + "'";
      }

      return "'{path: '" + (oContext.getObject("$kind") === "EntitySet" ? "/" : "") + oContext.getObject("@sapui.name") + "'" + (sSelect ? ",parameters:{" + sSelect + "}" : "") + "}'";
    },
    _getModel: function (oCollection, oInterface) {
      return oInterface.context;
    },
    // TODO: combine this one with the one from the table
    isDataFieldForActionButtonEnabled: function (bIsBound, sAction, oCollection, sOperationAvailableMap, sEnableSelectOn) {
      if (bIsBound !== true) {
        return "true";
      }

      var oModel = oCollection.getModel();
      var sNavPath = oCollection.getPath();
      var sPartner = oModel.getObject(sNavPath).$Partner;
      var oOperationAvailableMap = sOperationAvailableMap && JSON.parse(sOperationAvailableMap);
      var aPath = oOperationAvailableMap && oOperationAvailableMap[sAction] && oOperationAvailableMap[sAction].split("/");
      var sNumberOfSelectedContexts = ActionHelper.getNumberOfContextsExpression(sEnableSelectOn);

      if (aPath && aPath[0] === sPartner) {
        var sPath = oOperationAvailableMap[sAction].replace(sPartner + "/", "");
        return "{= ${" + sNumberOfSelectedContexts + " && ${" + sPath + "}}";
      } else {
        return "{= ${" + sNumberOfSelectedContexts + "}";
      }
    },
    getHiddenPathExpressionForTableActionsAndIBN: function (sHiddenPath, oDetails) {
      var oContext = oDetails.context,
          sPropertyPath = oContext.getPath(),
          sEntitySetPath = ODataModelAnnotationHelper.getNavigationPath(sPropertyPath);

      if (sHiddenPath.indexOf("/") > 0) {
        var aSplitHiddenPath = sHiddenPath.split("/");
        var sNavigationPath = aSplitHiddenPath[0]; // supports visiblity based on the property from the partner association

        if (oContext.getObject(sEntitySetPath + "/$Partner") === sNavigationPath) {
          return "{= !%{" + aSplitHiddenPath.slice(1).join("/") + "} }";
        } // any other association will be ignored and the button will be made visible

      }

      return true;
    },

    /**
     * Method to get press event for DataFieldForActionButton.
     *
     * @function
     * @name getPressEventForDataFieldForActionButton
     * @param sId Id of the current control
     * @param oAction Action model
     * @param sOperationAvailableMap OperationAvailableMap Stringified JSON object
     * @returns A binding expression for press property of DataFieldForActionButton
     */
    getPressEventForDataFieldForActionButton: function (sId, oAction, sOperationAvailableMap) {
      var oParams = {
        contexts: "${internal>selectedContexts}"
      };
      return ActionHelper.getPressEventDataFieldForActionButton(sId, oAction, oParams, sOperationAvailableMap);
    },

    /**
     * @function
     * @name getActionType
     * @param oAction Action model
     * @returns A Boolean value depending on the action type
     */
    getActionType: function (oAction) {
      return (oAction["$Type"].indexOf("com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") > -1 || oAction["$Type"].indexOf("com.sap.vocabularies.UI.v1.DataFieldForAction") > -1) && oAction["Inline"];
    },
    getCollectionName: function (sCollection) {
      return sCollection.split("/")[sCollection.split("/").length - 1];
    }
  };
  ChartHelper.getSortConditions.requiresIContext = true;
  return ChartHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmb3JtYXRKU09OVG9TdHJpbmciLCJvQ3JpdCIsInVuZGVmaW5lZCIsInNDcml0aWNhbGl0eSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXBsYWNlIiwiUmVnRXhwIiwiZ2V0RW50aXR5U2V0UGF0aCIsIm9Bbm5vdGF0aW9uQ29udGV4dCIsInNBbm5vUGF0aCIsImdldFBhdGgiLCJzUGF0aEVudGl0eVNldFBhdGgiLCJtQ2hhcnRUeXBlIiwibURpbWVuc2lvblJvbGUiLCJDaGFydEhlbHBlciIsImdldFAxM25Nb2RlIiwib1ZpZXdEYXRhIiwiYVBlcnNvbmFsaXphdGlvbiIsImJWYXJpYW50TWFuYWdlbWVudCIsInZhcmlhbnRNYW5hZ2VtZW50IiwicGVyc29uYWxpemF0aW9uIiwidHlwZSIsInB1c2giLCJzb3J0Iiwiam9pbiIsImZvcm1hdENoYXJ0VHlwZSIsIm9DaGFydFR5cGUiLCIkRW51bU1lbWJlciIsImZvcm1hdERpbWVuc2lvbnMiLCJvQW5ub3RhdGlvbiIsImdldE9iamVjdCIsIm9NZXRhTW9kZWwiLCJnZXRNb2RlbCIsInNFbnRpdHlTZXRQYXRoIiwiYURpbWVuc2lvbnMiLCJpIiwiaiIsImJJc05hdmlnYXRpb25UZXh0IiwiRGltZW5zaW9uQXR0cmlidXRlcyIsIkRpbWVuc2lvbnMiLCJsZW5ndGgiLCJzS2V5IiwiJFByb3BlcnR5UGF0aCIsIm9UZXh0IiwiaW5kZXhPZiIsIkxvZyIsImVycm9yIiwiJFBhdGgiLCJvRGltZW5zaW9uIiwia2V5IiwidGV4dFBhdGgiLCJsYWJlbCIsInJvbGUiLCJvQXR0cmlidXRlIiwiRGltZW5zaW9uIiwiUm9sZSIsImNyaXRpY2FsaXR5IiwiT0RhdGFNZXRhTW9kZWxVdGlsIiwiZmV0Y2hDcml0aWNhbGl0eSIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwidGhlbiIsIm9EaW1lbnNpb25Nb2RlbCIsIkpTT05Nb2RlbCIsIiQkdmFsdWVBc1Byb21pc2UiLCJmb3JtYXRNZWFzdXJlcyIsIm1lYXN1cmVzIiwiZ2V0VWlDaGFydCIsIm9QcmVzZW50YXRpb25Db250ZXh0IiwiZ2V0VWlDb250cm9sIiwiZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwib0NoYXJ0Q29udGV4dCIsIm9Db250ZXh0IiwiYUNoYXJ0Q29sbGVjdGlvbiIsIkFjdGlvbnMiLCJBY3Rpb25IZWxwZXIiLCJnZXRTb3J0Q29uZGl0aW9ucyIsIm9QcmVzZW50YXRpb25WYXJpYW50Iiwic1ByZXNlbnRhdGlvblZhcmlhbnRQYXRoIiwib0FwcGx5U3VwcG9ydGVkIiwiQ29tbW9uSGVscGVyIiwiX2lzUHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24iLCJTb3J0T3JkZXIiLCJhU29ydENvbmRpdGlvbnMiLCJzb3J0ZXJzIiwic0VudGl0eVBhdGgiLCJzcGxpdCIsImZvckVhY2giLCJvQ29uZGl0aW9uIiwib1NvcnRQcm9wZXJ0eSIsIm9Tb3J0ZXIiLCJEeW5hbWljUHJvcGVydHkiLCIkQW5ub3RhdGlvblBhdGgiLCJOYW1lIiwiUHJvcGVydHkiLCJhR3JvdXBhYmxlUHJvcGVydGllcyIsIkdyb3VwYWJsZVByb3BlcnRpZXMiLCJuYW1lIiwiZGVzY2VuZGluZyIsIkRlc2NlbmRpbmciLCJFcnJvciIsImdldEJpbmRpbmdEYXRhIiwic1RhcmdldENvbGxlY3Rpb24iLCJhQWN0aW9ucyIsImFPcGVyYXRpb25BdmFpbGFibGVQYXRoIiwic1NlbGVjdCIsIiRUeXBlIiwic0FjdGlvbk5hbWUiLCJBY3Rpb24iLCJvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlIiwiZ2V0QWN0aW9uUGF0aCIsIl9nZXRNb2RlbCIsIm9Db2xsZWN0aW9uIiwib0ludGVyZmFjZSIsImNvbnRleHQiLCJpc0RhdGFGaWVsZEZvckFjdGlvbkJ1dHRvbkVuYWJsZWQiLCJiSXNCb3VuZCIsInNBY3Rpb24iLCJzT3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwic0VuYWJsZVNlbGVjdE9uIiwib01vZGVsIiwic05hdlBhdGgiLCJzUGFydG5lciIsIiRQYXJ0bmVyIiwib09wZXJhdGlvbkF2YWlsYWJsZU1hcCIsInBhcnNlIiwiYVBhdGgiLCJzTnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzIiwiZ2V0TnVtYmVyT2ZDb250ZXh0c0V4cHJlc3Npb24iLCJzUGF0aCIsImdldEhpZGRlblBhdGhFeHByZXNzaW9uRm9yVGFibGVBY3Rpb25zQW5kSUJOIiwic0hpZGRlblBhdGgiLCJvRGV0YWlscyIsInNQcm9wZXJ0eVBhdGgiLCJPRGF0YU1vZGVsQW5ub3RhdGlvbkhlbHBlciIsImdldE5hdmlnYXRpb25QYXRoIiwiYVNwbGl0SGlkZGVuUGF0aCIsInNOYXZpZ2F0aW9uUGF0aCIsInNsaWNlIiwiZ2V0UHJlc3NFdmVudEZvckRhdGFGaWVsZEZvckFjdGlvbkJ1dHRvbiIsInNJZCIsIm9BY3Rpb24iLCJvUGFyYW1zIiwiY29udGV4dHMiLCJnZXRQcmVzc0V2ZW50RGF0YUZpZWxkRm9yQWN0aW9uQnV0dG9uIiwiZ2V0QWN0aW9uVHlwZSIsImdldENvbGxlY3Rpb25OYW1lIiwic0NvbGxlY3Rpb24iLCJyZXF1aXJlc0lDb250ZXh0Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJDaGFydEhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB7IGdldFVpQ29udHJvbCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IENvbW1vbkhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9Db21tb25IZWxwZXJcIjtcbmltcG9ydCBBY3Rpb25IZWxwZXIgZnJvbSBcInNhcC9mZS9tYWNyb3MvaW50ZXJuYWwvaGVscGVycy9BY3Rpb25IZWxwZXJcIjtcbmltcG9ydCBPRGF0YU1ldGFNb2RlbFV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvT0RhdGFNZXRhTW9kZWxVdGlsXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvQ29udGV4dFwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgT0RhdGFNb2RlbEFubm90YXRpb25IZWxwZXIgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Bbm5vdGF0aW9uSGVscGVyXCI7XG5mdW5jdGlvbiBmb3JtYXRKU09OVG9TdHJpbmcob0NyaXQ6IGFueSkge1xuXHRpZiAoIW9Dcml0KSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGxldCBzQ3JpdGljYWxpdHkgPSBKU09OLnN0cmluZ2lmeShvQ3JpdCk7XG5cdHNDcml0aWNhbGl0eSA9IHNDcml0aWNhbGl0eS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJ7XCIsIFwiZ1wiKSwgXCJcXFxce1wiKTtcblx0c0NyaXRpY2FsaXR5ID0gc0NyaXRpY2FsaXR5LnJlcGxhY2UobmV3IFJlZ0V4cChcIn1cIiwgXCJnXCIpLCBcIlxcXFx9XCIpO1xuXHRyZXR1cm4gc0NyaXRpY2FsaXR5O1xufVxuZnVuY3Rpb24gZ2V0RW50aXR5U2V0UGF0aChvQW5ub3RhdGlvbkNvbnRleHQ6IGFueSkge1xuXHRjb25zdCBzQW5ub1BhdGggPSBvQW5ub3RhdGlvbkNvbnRleHQuZ2V0UGF0aCgpLFxuXHRcdHNQYXRoRW50aXR5U2V0UGF0aCA9IHNBbm5vUGF0aC5yZXBsYWNlKC9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuKENoYXJ0fFByZXNlbnRhdGlvblZhcmlhbnQpLiovLCBcIlwiKTtcblxuXHRyZXR1cm4gc1BhdGhFbnRpdHlTZXRQYXRoO1xufVxuXG5jb25zdCBtQ2hhcnRUeXBlID0ge1xuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Db2x1bW5cIjogXCJjb2x1bW5cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQ29sdW1uU3RhY2tlZFwiOiBcInN0YWNrZWRfY29sdW1uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0NvbHVtbkR1YWxcIjogXCJkdWFsX2NvbHVtblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Db2x1bW5TdGFja2VkRHVhbFwiOiBcImR1YWxfc3RhY2tlZF9jb2x1bW5cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQ29sdW1uU3RhY2tlZDEwMFwiOiBcIjEwMF9zdGFja2VkX2NvbHVtblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Db2x1bW5TdGFja2VkRHVhbDEwMFwiOiBcIjEwMF9kdWFsX3N0YWNrZWRfY29sdW1uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0JhclwiOiBcImJhclwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9CYXJTdGFja2VkXCI6IFwic3RhY2tlZF9iYXJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQmFyRHVhbFwiOiBcImR1YWxfYmFyXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0JhclN0YWNrZWREdWFsXCI6IFwiZHVhbF9zdGFja2VkX2JhclwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9CYXJTdGFja2VkMTAwXCI6IFwiMTAwX3N0YWNrZWRfYmFyXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0JhclN0YWNrZWREdWFsMTAwXCI6IFwiMTAwX2R1YWxfc3RhY2tlZF9iYXJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQXJlYVwiOiBcImFyZWFcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQXJlYVN0YWNrZWRcIjogXCJzdGFja2VkX2NvbHVtblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9BcmVhU3RhY2tlZDEwMFwiOiBcIjEwMF9zdGFja2VkX2NvbHVtblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Ib3Jpem9udGFsQXJlYVwiOiBcImJhclwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Ib3Jpem9udGFsQXJlYVN0YWNrZWRcIjogXCJzdGFja2VkX2JhclwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Ib3Jpem9udGFsQXJlYVN0YWNrZWQxMDBcIjogXCIxMDBfc3RhY2tlZF9iYXJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvTGluZVwiOiBcImxpbmVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvTGluZUR1YWxcIjogXCJkdWFsX2xpbmVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQ29tYmluYXRpb25cIjogXCJjb21iaW5hdGlvblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Db21iaW5hdGlvblN0YWNrZWRcIjogXCJzdGFja2VkX2NvbWJpbmF0aW9uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0NvbWJpbmF0aW9uRHVhbFwiOiBcImR1YWxfY29tYmluYXRpb25cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvQ29tYmluYXRpb25TdGFja2VkRHVhbFwiOiBcImR1YWxfc3RhY2tlZF9jb21iaW5hdGlvblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Ib3Jpem9udGFsQ29tYmluYXRpb25TdGFja2VkXCI6IFwiaG9yaXpvbnRhbF9zdGFja2VkX2NvbWJpbmF0aW9uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL1BpZVwiOiBcInBpZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Eb251dFwiOiBcImRvbnV0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL1NjYXR0ZXJcIjogXCJzY2F0dGVyXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0J1YmJsZVwiOiBcImJ1YmJsZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9SYWRhclwiOiBcImxpbmVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvSGVhdE1hcFwiOiBcImhlYXRtYXBcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvVHJlZU1hcFwiOiBcInRyZWVtYXBcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvV2F0ZXJmYWxsXCI6IFwid2F0ZXJmYWxsXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRUeXBlL0J1bGxldFwiOiBcImJ1bGxldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9WZXJ0aWNhbEJ1bGxldFwiOiBcInZlcnRpY2FsX2J1bGxldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Ib3Jpem9udGFsV2F0ZXJmYWxsXCI6IFwiaG9yaXpvbnRhbF93YXRlcmZhbGxcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFR5cGUvSG9yaXpvbnRhbENvbWJpbmF0aW9uRHVhbFwiOiBcImR1YWxfaG9yaXpvbnRhbF9jb21iaW5hdGlvblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0VHlwZS9Ib3Jpem9udGFsQ29tYmluYXRpb25TdGFja2VkRHVhbFwiOiBcImR1YWxfaG9yaXpvbnRhbF9zdGFja2VkX2NvbWJpbmF0aW9uXCJcbn07XG5jb25zdCBtRGltZW5zaW9uUm9sZSA9IHtcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydERpbWVuc2lvblJvbGVUeXBlL0NhdGVnb3J5XCI6IFwiY2F0ZWdvcnlcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydERpbWVuc2lvblJvbGVUeXBlL1Nlcmllc1wiOiBcInNlcmllc1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0RGltZW5zaW9uUm9sZVR5cGUvQ2F0ZWdvcnkyXCI6IFwiY2F0ZWdvcnkyXCJcbn07XG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3Igc2FwLmZlLm1hY3JvcyBDaGFydCBwaGFudG9tIGNvbnRyb2wgZm9yIHByZXBlY29zc2VpbmcuXG4gKiA8aDM+PGI+Tm90ZTo8L2I+PC9oMz5cbiAqIFRoZSBjbGFzcyBpcyBleHBlcmltZW50YWwgYW5kIHRoZSBBUEkvYmVoYXZpb3VyIGlzIG5vdCBmaW5hbGlzZWRcbiAqIGFuZCBoZW5jZSB0aGlzIHNob3VsZCBub3QgYmUgdXNlZCBmb3IgcHJvZHVjdGl2ZSB1c2FnZS5cbiAqIEVzcGVjaWFsbHkgdGhpcyBjbGFzcyBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCBmb3IgdGhlIEZFIHNjZW5hcmlvLFxuICogaGVyZSB3ZSBzaGFsbCB1c2Ugc2FwLmZlLm1hY3Jvcy5DaGFydEhlbHBlciB0aGF0IGlzIGVzcGVjaWFsbHkgdGFpbG9yZWQgZm9yIFY0XG4gKiBtZXRhIG1vZGVsXG4gKlxuICogQGF1dGhvciBTQVAgU0VcbiAqIEBwcml2YXRlXG4gKiBAZXhwZXJpbWVudGFsXG4gKiBAc2luY2UgMS42MlxuICogQGFsaWFzIHNhcC5mZS5tYWNyb3MuQ2hhcnRIZWxwZXJcbiAqL1xuY29uc3QgQ2hhcnRIZWxwZXIgPSB7XG5cdGdldFAxM25Nb2RlKG9WaWV3RGF0YTogYW55KSB7XG5cdFx0Y29uc3QgYVBlcnNvbmFsaXphdGlvbiA9IFtdLFxuXHRcdFx0YlZhcmlhbnRNYW5hZ2VtZW50ID1cblx0XHRcdFx0b1ZpZXdEYXRhLnZhcmlhbnRNYW5hZ2VtZW50ICYmIChvVmlld0RhdGEudmFyaWFudE1hbmFnZW1lbnQgPT09IFwiUGFnZVwiIHx8IG9WaWV3RGF0YS52YXJpYW50TWFuYWdlbWVudCA9PT0gXCJDb250cm9sXCIpLFxuXHRcdFx0cGVyc29uYWxpemF0aW9uID0gdHJ1ZTsgLy8gYnkgZGVmYXVsdCBlbmFibGVkXG5cdFx0aWYgKGJWYXJpYW50TWFuYWdlbWVudCAmJiBwZXJzb25hbGl6YXRpb24pIHtcblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24pIHtcblx0XHRcdFx0Ly8gZnVsbCBwZXJzb25hbGl6YXRpb24gc2NvcGVcblx0XHRcdFx0cmV0dXJuIFwiU29ydCxUeXBlLEl0ZW1cIjtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHBlcnNvbmFsaXphdGlvbiA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRpZiAoKHBlcnNvbmFsaXphdGlvbiBhcyBhbnkpLnR5cGUpIHtcblx0XHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJUeXBlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgocGVyc29uYWxpemF0aW9uIGFzIGFueSkuc29ydCkge1xuXHRcdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlNvcnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmb3JtYXRDaGFydFR5cGUob0NoYXJ0VHlwZTogYW55KSB7XG5cdFx0cmV0dXJuIChtQ2hhcnRUeXBlIGFzIGFueSlbb0NoYXJ0VHlwZS4kRW51bU1lbWJlcl07XG5cdH0sXG5cdGZvcm1hdERpbWVuc2lvbnMob0Fubm90YXRpb25Db250ZXh0OiBhbnkpIHtcblx0XHRjb25zdCBvQW5ub3RhdGlvbiA9IG9Bbm5vdGF0aW9uQ29udGV4dC5nZXRPYmplY3QoXCIuL1wiKSxcblx0XHRcdG9NZXRhTW9kZWwgPSBvQW5ub3RhdGlvbkNvbnRleHQuZ2V0TW9kZWwoKSxcblx0XHRcdHNFbnRpdHlTZXRQYXRoID0gZ2V0RW50aXR5U2V0UGF0aChvQW5ub3RhdGlvbkNvbnRleHQpLFxuXHRcdFx0YURpbWVuc2lvbnMgPSBbXTtcblx0XHRsZXQgaSwgajtcblx0XHRsZXQgYklzTmF2aWdhdGlvblRleHQgPSBmYWxzZTtcblxuXHRcdC8vcGVyaGFwcyB0aGVyZSBhcmUgbm8gZGltZW5zaW9uIGF0dHJpYnV0ZXNcblx0XHRvQW5ub3RhdGlvbi5EaW1lbnNpb25BdHRyaWJ1dGVzID0gb0Fubm90YXRpb24uRGltZW5zaW9uQXR0cmlidXRlcyB8fCBbXTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBvQW5ub3RhdGlvbi5EaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBzS2V5ID0gb0Fubm90YXRpb24uRGltZW5zaW9uc1tpXS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0Y29uc3Qgb1RleHQgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzRW50aXR5U2V0UGF0aCArIHNLZXl9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0YCkgfHwge307XG5cdFx0XHRpZiAoc0tleS5pbmRleE9mKFwiL1wiKSA+IC0xKSB7XG5cdFx0XHRcdExvZy5lcnJvcihgJGV4cGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC4gRGltZW5zaW9uOiAke3NLZXl9IGZyb20gYW4gYXNzb2NpYXRpb24gY2Fubm90IGJlIHVzZWRgKTtcblx0XHRcdH1cblx0XHRcdGlmIChvVGV4dC4kUGF0aCAmJiBvVGV4dC4kUGF0aC5pbmRleE9mKFwiL1wiKSA+IC0xKSB7XG5cdFx0XHRcdExvZy5lcnJvcihcblx0XHRcdFx0XHRgJGV4cGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC4gVGV4dCBQcm9wZXJ0eTogJHtvVGV4dC4kUGF0aH0gZnJvbSBhbiBhc3NvY2lhdGlvbiBjYW5ub3QgYmUgdXNlZCBmb3IgdGhlIGRpbWVuc2lvbiAke3NLZXl9YFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRiSXNOYXZpZ2F0aW9uVGV4dCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBvRGltZW5zaW9uOiBhbnkgPSB7XG5cdFx0XHRcdGtleTogc0tleSxcblx0XHRcdFx0dGV4dFBhdGg6ICFiSXNOYXZpZ2F0aW9uVGV4dCA/IG9UZXh0LiRQYXRoIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRsYWJlbDogb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGggKyBzS2V5fUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTGFiZWxgKSxcblx0XHRcdFx0cm9sZTogXCJjYXRlZ29yeVwiXG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgb0Fubm90YXRpb24uRGltZW5zaW9uQXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRjb25zdCBvQXR0cmlidXRlID0gb0Fubm90YXRpb24uRGltZW5zaW9uQXR0cmlidXRlc1tqXTtcblxuXHRcdFx0XHRpZiAob0RpbWVuc2lvbi5rZXkgPT09IG9BdHRyaWJ1dGUuRGltZW5zaW9uLiRQcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0XHRvRGltZW5zaW9uLnJvbGUgPSBtRGltZW5zaW9uUm9sZVtvQXR0cmlidXRlLlJvbGUuJEVudW1NZW1iZXIgYXMga2V5b2YgdHlwZW9mIG1EaW1lbnNpb25Sb2xlXSB8fCBvRGltZW5zaW9uLnJvbGU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b0RpbWVuc2lvbi5jcml0aWNhbGl0eSA9IE9EYXRhTWV0YU1vZGVsVXRpbC5mZXRjaENyaXRpY2FsaXR5KFxuXHRcdFx0XHRvTWV0YU1vZGVsLFxuXHRcdFx0XHRvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNFbnRpdHlTZXRQYXRoICsgc0tleSlcblx0XHRcdCkudGhlbihmb3JtYXRKU09OVG9TdHJpbmcpO1xuXG5cdFx0XHRhRGltZW5zaW9ucy5wdXNoKG9EaW1lbnNpb24pO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9EaW1lbnNpb25Nb2RlbCA9IG5ldyBKU09OTW9kZWwoYURpbWVuc2lvbnMpO1xuXHRcdChvRGltZW5zaW9uTW9kZWwgYXMgYW55KS4kJHZhbHVlQXNQcm9taXNlID0gdHJ1ZTtcblx0XHRyZXR1cm4gb0RpbWVuc2lvbk1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKTtcblx0fSxcblxuXHRmb3JtYXRNZWFzdXJlcyhvQW5ub3RhdGlvbkNvbnRleHQ6IGFueSkge1xuXHRcdHJldHVybiBvQW5ub3RhdGlvbkNvbnRleHQuZ2V0TW9kZWwoKS5nZXRPYmplY3QoKS5tZWFzdXJlcztcblx0fSxcblxuXHRnZXRVaUNoYXJ0KG9QcmVzZW50YXRpb25Db250ZXh0OiBhbnkpIHtcblx0XHRyZXR1cm4gZ2V0VWlDb250cm9sKG9QcmVzZW50YXRpb25Db250ZXh0LCBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiKTtcblx0fSxcblx0Z2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwKG9DaGFydENvbnRleHQ6IGFueSwgb0NvbnRleHQ6IGFueSkge1xuXHRcdGNvbnN0IGFDaGFydENvbGxlY3Rpb24gPSBvQ2hhcnRDb250ZXh0LkFjdGlvbnMgfHwgW107XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KEFjdGlvbkhlbHBlci5nZXRPcGVyYXRpb25BdmFpbGFibGVNYXAoYUNoYXJ0Q29sbGVjdGlvbiwgXCJjaGFydFwiLCBvQ29udGV4dCkpO1xuXHR9LFxuXHQvKipcblx0ICogUmV0dXJucyBhIHN0cmluZ2lmaWVkIEpTT04gb2JqZWN0IGNvbnRhaW5pbmcgUHJlc2VudGF0aW9uIFZhcmlhbnQgc29ydCBjb25kaXRpb25zLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRleHRcblx0ICogQHBhcmFtIG9QcmVzZW50YXRpb25WYXJpYW50IFByZXNlbnRhdGlvbiBWYXJpYW50IGFubm90YXRpb25cblx0ICogQHBhcmFtIHNQcmVzZW50YXRpb25WYXJpYW50UGF0aFxuXHQgKiBAcGFyYW0gb0FwcGx5U3VwcG9ydGVkXG5cdCAqIEByZXR1cm5zIFN0cmluZ2lmaWVkIEpTT04gb2JqZWN0XG5cdCAqL1xuXHRnZXRTb3J0Q29uZGl0aW9uczogZnVuY3Rpb24gKG9Db250ZXh0OiBhbnksIG9QcmVzZW50YXRpb25WYXJpYW50OiBhbnksIHNQcmVzZW50YXRpb25WYXJpYW50UGF0aDogc3RyaW5nLCBvQXBwbHlTdXBwb3J0ZWQ6IGFueSkge1xuXHRcdGlmIChcblx0XHRcdG9QcmVzZW50YXRpb25WYXJpYW50ICYmXG5cdFx0XHRDb21tb25IZWxwZXIuX2lzUHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24oc1ByZXNlbnRhdGlvblZhcmlhbnRQYXRoKSAmJlxuXHRcdFx0b1ByZXNlbnRhdGlvblZhcmlhbnQuU29ydE9yZGVyXG5cdFx0KSB7XG5cdFx0XHRjb25zdCBhU29ydENvbmRpdGlvbnM6IGFueSA9IHtcblx0XHRcdFx0c29ydGVyczogW11cblx0XHRcdH07XG5cdFx0XHRjb25zdCBzRW50aXR5UGF0aCA9IG9Db250ZXh0LmdldFBhdGgoMCkuc3BsaXQoXCJAXCIpWzBdO1xuXHRcdFx0b1ByZXNlbnRhdGlvblZhcmlhbnQuU29ydE9yZGVyLmZvckVhY2goZnVuY3Rpb24gKG9Db25kaXRpb246IGFueSA9IHt9KSB7XG5cdFx0XHRcdGxldCBvU29ydFByb3BlcnR5OiBhbnkgPSBcIlwiO1xuXHRcdFx0XHRjb25zdCBvU29ydGVyOiBhbnkgPSB7fTtcblx0XHRcdFx0aWYgKG9Db25kaXRpb24uRHluYW1pY1Byb3BlcnR5KSB7XG5cdFx0XHRcdFx0b1NvcnRQcm9wZXJ0eSA9XG5cdFx0XHRcdFx0XHRcIl9mZV9hZ2dyZWdhdGFibGVfXCIgK1xuXHRcdFx0XHRcdFx0b0NvbnRleHQuZ2V0TW9kZWwoMCkuZ2V0T2JqZWN0KHNFbnRpdHlQYXRoICsgb0NvbmRpdGlvbi5EeW5hbWljUHJvcGVydHkuJEFubm90YXRpb25QYXRoKT8uTmFtZTtcblx0XHRcdFx0fSBlbHNlIGlmIChvQ29uZGl0aW9uLlByb3BlcnR5KSB7XG5cdFx0XHRcdFx0Y29uc3QgYUdyb3VwYWJsZVByb3BlcnRpZXMgPSBvQXBwbHlTdXBwb3J0ZWQuR3JvdXBhYmxlUHJvcGVydGllcztcblx0XHRcdFx0XHRpZiAoYUdyb3VwYWJsZVByb3BlcnRpZXMgJiYgYUdyb3VwYWJsZVByb3BlcnRpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFHcm91cGFibGVQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhR3JvdXBhYmxlUHJvcGVydGllc1tpXS4kUHJvcGVydHlQYXRoID09PSBvQ29uZGl0aW9uLlByb3BlcnR5LiRQcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0XHRcdFx0XHRvU29ydFByb3BlcnR5ID0gXCJfZmVfZ3JvdXBhYmxlX1wiICsgb0NvbmRpdGlvbi5Qcm9wZXJ0eS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghb1NvcnRQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRcdG9Tb3J0UHJvcGVydHkgPSBcIl9mZV9hZ2dyZWdhdGFibGVfXCIgKyBvQ29uZGl0aW9uLlByb3BlcnR5LiRQcm9wZXJ0eVBhdGg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRcdFx0b0NvbnRleHRcblx0XHRcdFx0XHRcdFx0LmdldE1vZGVsKDApXG5cdFx0XHRcdFx0XHRcdC5nZXRPYmplY3Qoc0VudGl0eVBhdGggKyBvQ29uZGl0aW9uLlByb3BlcnR5LiRQcm9wZXJ0eVBhdGggKyBcIkBPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuR3JvdXBhYmxlXCIpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRvU29ydFByb3BlcnR5ID0gXCJfZmVfZ3JvdXBhYmxlX1wiICsgb0NvbmRpdGlvbi5Qcm9wZXJ0eS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvU29ydFByb3BlcnR5ID0gXCJfZmVfYWdncmVnYXRhYmxlX1wiICsgb0NvbmRpdGlvbi5Qcm9wZXJ0eS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob1NvcnRQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdG9Tb3J0ZXIubmFtZSA9IG9Tb3J0UHJvcGVydHk7XG5cdFx0XHRcdFx0b1NvcnRlci5kZXNjZW5kaW5nID0gISFvQ29uZGl0aW9uLkRlc2NlbmRpbmc7XG5cdFx0XHRcdFx0YVNvcnRDb25kaXRpb25zLnNvcnRlcnMucHVzaChvU29ydGVyKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgZGVmaW5lIHRoZSByaWdodCBwYXRoIHRvIHRoZSBzb3J0IHByb3BlcnR5XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShhU29ydENvbmRpdGlvbnMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9LFxuXHRnZXRCaW5kaW5nRGF0YShzVGFyZ2V0Q29sbGVjdGlvbjogYW55LCBvQ29udGV4dDogYW55LCBhQWN0aW9uczogYW55KSB7XG5cdFx0Y29uc3QgYU9wZXJhdGlvbkF2YWlsYWJsZVBhdGggPSBbXTtcblx0XHRsZXQgc1NlbGVjdDtcblx0XHRmb3IgKGNvbnN0IGkgaW4gYUFjdGlvbnMpIHtcblx0XHRcdGlmIChhQWN0aW9uc1tpXS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIikge1xuXHRcdFx0XHRjb25zdCBzQWN0aW9uTmFtZSA9IGFBY3Rpb25zW2ldLkFjdGlvbjtcblx0XHRcdFx0Y29uc3Qgb0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZSA9IENvbW1vbkhlbHBlci5nZXRBY3Rpb25QYXRoKG9Db250ZXh0LCBmYWxzZSwgc0FjdGlvbk5hbWUsIHRydWUpO1xuXHRcdFx0XHRpZiAob0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZSAmJiBvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlLiRQYXRoKSB7XG5cdFx0XHRcdFx0YU9wZXJhdGlvbkF2YWlsYWJsZVBhdGgucHVzaChgJyR7b0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZS4kUGF0aH0nYCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAob0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdC8vIFdlIGRpc2FibGVkIGFjdGlvbiBhZHZlcnRpc2VtZW50IGJ1dCBrZXB0IGl0IGluIHRoZSBjb2RlIGZvciB0aGUgdGltZSBiZWluZ1xuXHRcdFx0XHRcdC8vYU9wZXJhdGlvbkF2YWlsYWJsZVBhdGgucHVzaChzQWN0aW9uTmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGFPcGVyYXRpb25BdmFpbGFibGVQYXRoLmxlbmd0aCA+IDApIHtcblx0XHRcdC8vVE9ETzogcmVxdWVzdCBmYWlscyB3aXRoICRzZWxlY3QuIGNoZWNrIHRoaXMgd2l0aCBvZGF0YSB2NCBtb2RlbFxuXHRcdFx0c1NlbGVjdCA9IFwiICRzZWxlY3Q6ICdcIiArIGFPcGVyYXRpb25BdmFpbGFibGVQYXRoLmpvaW4oKSArIFwiJ1wiO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdFx0XCIne3BhdGg6ICdcIiArXG5cdFx0XHQob0NvbnRleHQuZ2V0T2JqZWN0KFwiJGtpbmRcIikgPT09IFwiRW50aXR5U2V0XCIgPyBcIi9cIiA6IFwiXCIpICtcblx0XHRcdG9Db250ZXh0LmdldE9iamVjdChcIkBzYXB1aS5uYW1lXCIpICtcblx0XHRcdFwiJ1wiICtcblx0XHRcdChzU2VsZWN0ID8gXCIscGFyYW1ldGVyczp7XCIgKyBzU2VsZWN0ICsgXCJ9XCIgOiBcIlwiKSArXG5cdFx0XHRcIn0nXCJcblx0XHQpO1xuXHR9LFxuXHRfZ2V0TW9kZWwob0NvbGxlY3Rpb246IGFueSwgb0ludGVyZmFjZTogYW55KSB7XG5cdFx0cmV0dXJuIG9JbnRlcmZhY2UuY29udGV4dDtcblx0fSxcblx0Ly8gVE9ETzogY29tYmluZSB0aGlzIG9uZSB3aXRoIHRoZSBvbmUgZnJvbSB0aGUgdGFibGVcblx0aXNEYXRhRmllbGRGb3JBY3Rpb25CdXR0b25FbmFibGVkKFxuXHRcdGJJc0JvdW5kOiBib29sZWFuLFxuXHRcdHNBY3Rpb246IHN0cmluZyxcblx0XHRvQ29sbGVjdGlvbjogQ29udGV4dCxcblx0XHRzT3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBzdHJpbmcsXG5cdFx0c0VuYWJsZVNlbGVjdE9uOiBzdHJpbmdcblx0KSB7XG5cdFx0aWYgKGJJc0JvdW5kICE9PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gXCJ0cnVlXCI7XG5cdFx0fVxuXHRcdGNvbnN0IG9Nb2RlbCA9IG9Db2xsZWN0aW9uLmdldE1vZGVsKCk7XG5cdFx0Y29uc3Qgc05hdlBhdGggPSBvQ29sbGVjdGlvbi5nZXRQYXRoKCk7XG5cdFx0Y29uc3Qgc1BhcnRuZXIgPSBvTW9kZWwuZ2V0T2JqZWN0KHNOYXZQYXRoKS4kUGFydG5lcjtcblx0XHRjb25zdCBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gc09wZXJhdGlvbkF2YWlsYWJsZU1hcCAmJiBKU09OLnBhcnNlKHNPcGVyYXRpb25BdmFpbGFibGVNYXApO1xuXHRcdGNvbnN0IGFQYXRoID0gb09wZXJhdGlvbkF2YWlsYWJsZU1hcCAmJiBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwW3NBY3Rpb25dICYmIG9PcGVyYXRpb25BdmFpbGFibGVNYXBbc0FjdGlvbl0uc3BsaXQoXCIvXCIpO1xuXHRcdGNvbnN0IHNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgPSBBY3Rpb25IZWxwZXIuZ2V0TnVtYmVyT2ZDb250ZXh0c0V4cHJlc3Npb24oc0VuYWJsZVNlbGVjdE9uKTtcblx0XHRpZiAoYVBhdGggJiYgYVBhdGhbMF0gPT09IHNQYXJ0bmVyKSB7XG5cdFx0XHRjb25zdCBzUGF0aCA9IG9PcGVyYXRpb25BdmFpbGFibGVNYXBbc0FjdGlvbl0ucmVwbGFjZShzUGFydG5lciArIFwiL1wiLCBcIlwiKTtcblx0XHRcdHJldHVybiBcIns9ICR7XCIgKyBzTnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzICsgXCIgJiYgJHtcIiArIHNQYXRoICsgXCJ9fVwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJ7PSAke1wiICsgc051bWJlck9mU2VsZWN0ZWRDb250ZXh0cyArIFwifVwiO1xuXHRcdH1cblx0fSxcblx0Z2V0SGlkZGVuUGF0aEV4cHJlc3Npb25Gb3JUYWJsZUFjdGlvbnNBbmRJQk4oc0hpZGRlblBhdGg6IGFueSwgb0RldGFpbHM6IGFueSkge1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gb0RldGFpbHMuY29udGV4dCxcblx0XHRcdHNQcm9wZXJ0eVBhdGggPSBvQ29udGV4dC5nZXRQYXRoKCksXG5cdFx0XHRzRW50aXR5U2V0UGF0aCA9IE9EYXRhTW9kZWxBbm5vdGF0aW9uSGVscGVyLmdldE5hdmlnYXRpb25QYXRoKHNQcm9wZXJ0eVBhdGgpO1xuXHRcdGlmIChzSGlkZGVuUGF0aC5pbmRleE9mKFwiL1wiKSA+IDApIHtcblx0XHRcdGNvbnN0IGFTcGxpdEhpZGRlblBhdGggPSBzSGlkZGVuUGF0aC5zcGxpdChcIi9cIik7XG5cdFx0XHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBhU3BsaXRIaWRkZW5QYXRoWzBdO1xuXHRcdFx0Ly8gc3VwcG9ydHMgdmlzaWJsaXR5IGJhc2VkIG9uIHRoZSBwcm9wZXJ0eSBmcm9tIHRoZSBwYXJ0bmVyIGFzc29jaWF0aW9uXG5cdFx0XHRpZiAob0NvbnRleHQuZ2V0T2JqZWN0KHNFbnRpdHlTZXRQYXRoICsgXCIvJFBhcnRuZXJcIikgPT09IHNOYXZpZ2F0aW9uUGF0aCkge1xuXHRcdFx0XHRyZXR1cm4gXCJ7PSAhJXtcIiArIGFTcGxpdEhpZGRlblBhdGguc2xpY2UoMSkuam9pbihcIi9cIikgKyBcIn0gfVwiO1xuXHRcdFx0fVxuXHRcdFx0Ly8gYW55IG90aGVyIGFzc29jaWF0aW9uIHdpbGwgYmUgaWdub3JlZCBhbmQgdGhlIGJ1dHRvbiB3aWxsIGJlIG1hZGUgdmlzaWJsZVxuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZXQgcHJlc3MgZXZlbnQgZm9yIERhdGFGaWVsZEZvckFjdGlvbkJ1dHRvbi5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGdldFByZXNzRXZlbnRGb3JEYXRhRmllbGRGb3JBY3Rpb25CdXR0b25cblx0ICogQHBhcmFtIHNJZCBJZCBvZiB0aGUgY3VycmVudCBjb250cm9sXG5cdCAqIEBwYXJhbSBvQWN0aW9uIEFjdGlvbiBtb2RlbFxuXHQgKiBAcGFyYW0gc09wZXJhdGlvbkF2YWlsYWJsZU1hcCBPcGVyYXRpb25BdmFpbGFibGVNYXAgU3RyaW5naWZpZWQgSlNPTiBvYmplY3Rcblx0ICogQHJldHVybnMgQSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHByZXNzIHByb3BlcnR5IG9mIERhdGFGaWVsZEZvckFjdGlvbkJ1dHRvblxuXHQgKi9cblx0Z2V0UHJlc3NFdmVudEZvckRhdGFGaWVsZEZvckFjdGlvbkJ1dHRvbihzSWQ6IHN0cmluZywgb0FjdGlvbjogYW55LCBzT3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBzdHJpbmcpIHtcblx0XHRjb25zdCBvUGFyYW1zID0ge1xuXHRcdFx0Y29udGV4dHM6IFwiJHtpbnRlcm5hbD5zZWxlY3RlZENvbnRleHRzfVwiXG5cdFx0fTtcblx0XHRyZXR1cm4gQWN0aW9uSGVscGVyLmdldFByZXNzRXZlbnREYXRhRmllbGRGb3JBY3Rpb25CdXR0b24oc0lkLCBvQWN0aW9uLCBvUGFyYW1zLCBzT3BlcmF0aW9uQXZhaWxhYmxlTWFwKTtcblx0fSxcblx0LyoqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBnZXRBY3Rpb25UeXBlXG5cdCAqIEBwYXJhbSBvQWN0aW9uIEFjdGlvbiBtb2RlbFxuXHQgKiBAcmV0dXJucyBBIEJvb2xlYW4gdmFsdWUgZGVwZW5kaW5nIG9uIHRoZSBhY3Rpb24gdHlwZVxuXHQgKi9cblx0Z2V0QWN0aW9uVHlwZShvQWN0aW9uOiBhbnkpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0KG9BY3Rpb25bXCIkVHlwZVwiXS5pbmRleE9mKFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCIpID4gLTEgfHxcblx0XHRcdFx0b0FjdGlvbltcIiRUeXBlXCJdLmluZGV4T2YoXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIikgPiAtMSkgJiZcblx0XHRcdG9BY3Rpb25bXCJJbmxpbmVcIl1cblx0XHQpO1xuXHR9LFxuXHRnZXRDb2xsZWN0aW9uTmFtZShzQ29sbGVjdGlvbjogYW55KSB7XG5cdFx0cmV0dXJuIHNDb2xsZWN0aW9uLnNwbGl0KFwiL1wiKVtzQ29sbGVjdGlvbi5zcGxpdChcIi9cIikubGVuZ3RoIC0gMV07XG5cdH1cbn07XG4oQ2hhcnRIZWxwZXIuZ2V0U29ydENvbmRpdGlvbnMgYXMgYW55KS5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhcnRIZWxwZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQVFBLFNBQVNBLGtCQUFULENBQTRCQyxLQUE1QixFQUF3QztJQUN2QyxJQUFJLENBQUNBLEtBQUwsRUFBWTtNQUNYLE9BQU9DLFNBQVA7SUFDQTs7SUFFRCxJQUFJQyxZQUFZLEdBQUdDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSixLQUFmLENBQW5CO0lBQ0FFLFlB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