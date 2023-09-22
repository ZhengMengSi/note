/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/filter/FilterUtils", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (FilterUtil, Filter, FilterOperator) {
  "use strict";

  var aPrevDrillStack = [];
  var ChartUtils = {
    /**
     * Method to check if selections exist in the chart.
     *
     * @param oMdcChart The MDC chart control
     * @param oInSource The control that has to apply chart filters
     * @returns `true` if chart selection exists, false otherwise
     */
    getChartSelectionsExist: function (oMdcChart, oInSource) {
      // consider chart selections in the current drill stack or on any further drill downs
      var oSource = oInSource || oMdcChart;

      if (oMdcChart) {
        try {
          var oChart = oMdcChart.getControlDelegate()._getChart(oMdcChart);

          if (oChart) {
            var aDimensions = this.getDimensionsFromDrillStack(oChart);
            var bIsDrillDown = aDimensions.length > aPrevDrillStack.length;
            var bIsDrillUp = aDimensions.length < aPrevDrillStack.length;
            var bNoChange = aDimensions.toString() === aPrevDrillStack.toString();
            var aFilters;

            if (bIsDrillUp && aDimensions.length === 1) {
              // drilling up to level0 would clear all selections
              aFilters = this.getChartSelections(oMdcChart, true);
            } else {
              // apply filters of selections of previous drillstack when drilling up/down
              // to the chart and table
              aFilters = this.getChartSelections(oMdcChart);
            }

            if (bIsDrillDown || bIsDrillUp) {
              // update the drillstack on a drill up/ drill down
              aPrevDrillStack = aDimensions;
              return aFilters.length > 0;
            } else if (bNoChange && oSource.isA("sap.ui.mdc.Table")) {
              // bNoChange is true when chart is selected
              return aFilters.length > 0;
            }
          }
        } catch (sError) {
          return false;
        }
      }

      return false;
    },

    /**
     * Method that returns the chart filters stored in the UI model.
     *
     * @param oMdcChart The MDC chart control
     * @param bClearSelections Clears chart selections in the UI model if true
     * @returns The chart selections
     */
    getChartSelections: function (oMdcChart, bClearSelections) {
      // get chart selections
      if (bClearSelections) {
        this.getChartModel(oMdcChart, "", {});
      }

      var aVizSelections = this.getChartModel(oMdcChart, "filters");
      return aVizSelections || [];
    },

    /**
     * Method that returns the chart selections as a filter.
     *
     * @param oMdcChart The MDC chart control
     * @returns Filter containing chart selections
     */
    getChartFilters: function (oMdcChart) {
      // get chart selections as a filter
      var aFilters = this.getChartSelections(oMdcChart) || [];
      return new Filter(aFilters);
    },

    /**
     * Method that sets the chart selections as in the UI model.
     *
     * @param oMdcChart The MDC chart control
     */
    setChartFilters: function (oMdcChart) {
      // saving selections in each drill stack for future use
      var oDrillStack = this.getChartModel(oMdcChart, "drillStack") || {};

      var oChart = oMdcChart.getControlDelegate()._getChart(oMdcChart);

      var aChartFilters = [];
      var aVisibleDimensions;

      function addChartFilters(aSelectedData) {
        for (var item in aSelectedData) {
          var aDimFilters = [];

          for (var i in aVisibleDimensions) {
            var sPath = aVisibleDimensions[i];
            var sValue = aSelectedData[item].data[sPath];

            if (sValue !== undefined) {
              aDimFilters.push(new Filter({
                path: sPath,
                operator: FilterOperator.EQ,
                value1: sValue
              }));
            }
          }

          if (aDimFilters.length > 0) {
            aChartFilters.push(new Filter(aDimFilters, true));
          }
        }
      }

      if (oChart) {
        var aVizSelections = this.getVizSelection(oChart);
        aVisibleDimensions = oChart.getVisibleDimensions();
        var aDimensions = this.getDimensionsFromDrillStack(oChart);

        if (aDimensions.length > 0) {
          this.getChartModel(oMdcChart, "drillStack", {});
          oDrillStack[aDimensions.toString()] = aVizSelections;
          this.getChartModel(oMdcChart, "drillStack", oDrillStack);
        }

        if (aVizSelections.length > 0) {
          // creating filters with selections in the current drillstack
          addChartFilters(aVizSelections);
        } else {
          // creating filters with selections in the previous drillstack when there are no selections in the current drillstack
          var aDrillStackKeys = Object.keys(oDrillStack) || [];
          var aPrevDrillStackData = oDrillStack[aDrillStackKeys[aDrillStackKeys.length - 2]] || [];
          addChartFilters(aPrevDrillStackData);
        }

        this.getChartModel(oMdcChart, "filters", aChartFilters);
      }
    },

    /**
     * Method that returns the chart selections as a filter.
     *
     * @param oChart The inner chart control
     * @returns The filters in the filter bar
     */
    getFilterBarFilterInfo: function (oChart) {
      return FilterUtil.getFilterInfo(oChart.getFilter(), {
        targetControl: oChart
      });
    },

    /**
     * Method that returns the filters for the chart and filter bar.
     *
     * @param oChart The inner chart control
     * @returns The new filter containing the filters for both the chart and the filter bar
     */
    getAllFilterInfo: function (oChart) {
      var oFilters = this.getFilterBarFilterInfo(oChart);
      var aChartFilters = this.getChartFilters(oChart);

      if (aChartFilters && aChartFilters.aFilters && aChartFilters.aFilters.length) {
        oFilters.filters.push(aChartFilters);
      } // filterbar + chart filters


      return oFilters;
    },

    /**
     * Method that returns selected data in the chart.
     *
     * @param oChart The inner chart control
     * @returns The selected chart data
     */
    getChartSelectedData: function (oChart) {
      var aSelectedPoints = []; // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check

      switch (oChart.getSelectionBehavior()) {
        case "DATAPOINT":
          aSelectedPoints = oChart.getSelectedDataPoints().dataPoints;
          break;

        case "CATEGORY":
          aSelectedPoints = oChart.getSelectedCategories().categories;
          break;

        case "SERIES":
          aSelectedPoints = oChart.getSelectedSeries().series;
          break;
      }

      return aSelectedPoints;
    },

    /**
     * Method to get filters, drillstack and selected contexts in the UI model.
     * Can also be used to set data in the model.
     *
     * @param oMdcChart The MDC chart control
     * @param sPath The path in the UI model from which chart data is to be set/fetched
     * @param vData The chart info to be set
     * @returns The chart info (filters/drillstack/selectedContexts)
     */
    getChartModel: function (oMdcChart, sPath, vData) {
      var oInternalModelContext = oMdcChart.getBindingContext("internal");

      if (!oInternalModelContext) {
        return false;
      }

      if (vData) {
        oInternalModelContext.setProperty(sPath, vData);
      }

      return oInternalModelContext && oInternalModelContext.getObject(sPath);
    },

    /**
     * Method to fetch the current drillstack dimensions.
     *
     * @param oChart The inner chart control
     * @returns The current drillstack dimensions
     */
    getDimensionsFromDrillStack: function (oChart) {
      var aCurrentDrillStack = oChart.getDrillStack() || [];
      var aCurrentDrillView = aCurrentDrillStack.pop() || {};
      return aCurrentDrillView.dimension || [];
    },

    /**
     * Method to fetch chart selections.
     *
     * @param oChart The inner chart control
     * @returns The chart selections
     */
    getVizSelection: function (oChart) {
      return oChart && oChart._getVizFrame() && oChart._getVizFrame().vizSelection() || [];
    }
  };
  return ChartUtils;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhUHJldkRyaWxsU3RhY2siLCJDaGFydFV0aWxzIiwiZ2V0Q2hhcnRTZWxlY3Rpb25zRXhpc3QiLCJvTWRjQ2hhcnQiLCJvSW5Tb3VyY2UiLCJvU291cmNlIiwib0NoYXJ0IiwiZ2V0Q29udHJvbERlbGVnYXRlIiwiX2dldENoYXJ0IiwiYURpbWVuc2lvbnMiLCJnZXREaW1lbnNpb25zRnJvbURyaWxsU3RhY2siLCJiSXNEcmlsbERvd24iLCJsZW5ndGgiLCJiSXNEcmlsbFVwIiwiYk5vQ2hhbmdlIiwidG9TdHJpbmciLCJhRmlsdGVycyIsImdldENoYXJ0U2VsZWN0aW9ucyIsImlzQSIsInNFcnJvciIsImJDbGVhclNlbGVjdGlvbnMiLCJnZXRDaGFydE1vZGVsIiwiYVZpelNlbGVjdGlvbnMiLCJnZXRDaGFydEZpbHRlcnMiLCJGaWx0ZXIiLCJzZXRDaGFydEZpbHRlcnMiLCJvRHJpbGxTdGFjayIsImFDaGFydEZpbHRlcnMiLCJhVmlzaWJsZURpbWVuc2lvbnMiLCJhZGRDaGFydEZpbHRlcnMiLCJhU2VsZWN0ZWREYXRhIiwiaXRlbSIsImFEaW1GaWx0ZXJzIiwiaSIsInNQYXRoIiwic1ZhbHVlIiwiZGF0YSIsInVuZGVmaW5lZCIsInB1c2giLCJwYXRoIiwib3BlcmF0b3IiLCJGaWx0ZXJPcGVyYXRvciIsIkVRIiwidmFsdWUxIiwiZ2V0Vml6U2VsZWN0aW9uIiwiZ2V0VmlzaWJsZURpbWVuc2lvbnMiLCJhRHJpbGxTdGFja0tleXMiLCJPYmplY3QiLCJrZXlzIiwiYVByZXZEcmlsbFN0YWNrRGF0YSIsImdldEZpbHRlckJhckZpbHRlckluZm8iLCJGaWx0ZXJVdGlsIiwiZ2V0RmlsdGVySW5mbyIsImdldEZpbHRlciIsInRhcmdldENvbnRyb2wiLCJnZXRBbGxGaWx0ZXJJbmZvIiwib0ZpbHRlcnMiLCJmaWx0ZXJzIiwiZ2V0Q2hhcnRTZWxlY3RlZERhdGEiLCJhU2VsZWN0ZWRQb2ludHMiLCJnZXRTZWxlY3Rpb25CZWhhdmlvciIsImdldFNlbGVjdGVkRGF0YVBvaW50cyIsImRhdGFQb2ludHMiLCJnZXRTZWxlY3RlZENhdGVnb3JpZXMiLCJjYXRlZ29yaWVzIiwiZ2V0U2VsZWN0ZWRTZXJpZXMiLCJzZXJpZXMiLCJ2RGF0YSIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0Iiwic2V0UHJvcGVydHkiLCJnZXRPYmplY3QiLCJhQ3VycmVudERyaWxsU3RhY2siLCJnZXREcmlsbFN0YWNrIiwiYUN1cnJlbnREcmlsbFZpZXciLCJwb3AiLCJkaW1lbnNpb24iLCJfZ2V0Vml6RnJhbWUiLCJ2aXpTZWxlY3Rpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkNoYXJ0VXRpbHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgQ2hhcnQgZnJvbSBcInNhcC9jaGFydC9DaGFydFwiO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbE1vZGVsQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgRmlsdGVyVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWx0ZXIvRmlsdGVyVXRpbHNcIjtcbmltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCB0eXBlIE1EQ0NoYXJ0IGZyb20gXCJzYXAvdWkvbWRjL0NoYXJ0XCI7XG5pbXBvcnQgRmlsdGVyIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyXCI7XG5pbXBvcnQgRmlsdGVyT3BlcmF0b3IgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJPcGVyYXRvclwiO1xubGV0IGFQcmV2RHJpbGxTdGFjazogYW55W10gPSBbXTtcbmNvbnN0IENoYXJ0VXRpbHMgPSB7XG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gY2hlY2sgaWYgc2VsZWN0aW9ucyBleGlzdCBpbiB0aGUgY2hhcnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvTWRjQ2hhcnQgVGhlIE1EQyBjaGFydCBjb250cm9sXG5cdCAqIEBwYXJhbSBvSW5Tb3VyY2UgVGhlIGNvbnRyb2wgdGhhdCBoYXMgdG8gYXBwbHkgY2hhcnQgZmlsdGVyc1xuXHQgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgY2hhcnQgc2VsZWN0aW9uIGV4aXN0cywgZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRnZXRDaGFydFNlbGVjdGlvbnNFeGlzdDogZnVuY3Rpb24gKG9NZGNDaGFydDogTURDQ2hhcnQsIG9JblNvdXJjZT86IENvbnRyb2wpIHtcblx0XHQvLyBjb25zaWRlciBjaGFydCBzZWxlY3Rpb25zIGluIHRoZSBjdXJyZW50IGRyaWxsIHN0YWNrIG9yIG9uIGFueSBmdXJ0aGVyIGRyaWxsIGRvd25zXG5cdFx0Y29uc3Qgb1NvdXJjZSA9IG9JblNvdXJjZSB8fCBvTWRjQ2hhcnQ7XG5cdFx0aWYgKG9NZGNDaGFydCkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3Qgb0NoYXJ0ID0gKG9NZGNDaGFydCBhcyBhbnkpLmdldENvbnRyb2xEZWxlZ2F0ZSgpLl9nZXRDaGFydChvTWRjQ2hhcnQpIGFzIENoYXJ0O1xuXHRcdFx0XHRpZiAob0NoYXJ0KSB7XG5cdFx0XHRcdFx0Y29uc3QgYURpbWVuc2lvbnMgPSB0aGlzLmdldERpbWVuc2lvbnNGcm9tRHJpbGxTdGFjayhvQ2hhcnQpO1xuXHRcdFx0XHRcdGNvbnN0IGJJc0RyaWxsRG93biA9IGFEaW1lbnNpb25zLmxlbmd0aCA+IGFQcmV2RHJpbGxTdGFjay5sZW5ndGg7XG5cdFx0XHRcdFx0Y29uc3QgYklzRHJpbGxVcCA9IGFEaW1lbnNpb25zLmxlbmd0aCA8IGFQcmV2RHJpbGxTdGFjay5sZW5ndGg7XG5cdFx0XHRcdFx0Y29uc3QgYk5vQ2hhbmdlID0gYURpbWVuc2lvbnMudG9TdHJpbmcoKSA9PT0gYVByZXZEcmlsbFN0YWNrLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0bGV0IGFGaWx0ZXJzOiBhbnlbXTtcblx0XHRcdFx0XHRpZiAoYklzRHJpbGxVcCAmJiBhRGltZW5zaW9ucy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRcdC8vIGRyaWxsaW5nIHVwIHRvIGxldmVsMCB3b3VsZCBjbGVhciBhbGwgc2VsZWN0aW9uc1xuXHRcdFx0XHRcdFx0YUZpbHRlcnMgPSB0aGlzLmdldENoYXJ0U2VsZWN0aW9ucyhvTWRjQ2hhcnQsIHRydWUpIGFzIGFueVtdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBhcHBseSBmaWx0ZXJzIG9mIHNlbGVjdGlvbnMgb2YgcHJldmlvdXMgZHJpbGxzdGFjayB3aGVuIGRyaWxsaW5nIHVwL2Rvd25cblx0XHRcdFx0XHRcdC8vIHRvIHRoZSBjaGFydCBhbmQgdGFibGVcblx0XHRcdFx0XHRcdGFGaWx0ZXJzID0gdGhpcy5nZXRDaGFydFNlbGVjdGlvbnMob01kY0NoYXJ0KSBhcyBhbnlbXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGJJc0RyaWxsRG93biB8fCBiSXNEcmlsbFVwKSB7XG5cdFx0XHRcdFx0XHQvLyB1cGRhdGUgdGhlIGRyaWxsc3RhY2sgb24gYSBkcmlsbCB1cC8gZHJpbGwgZG93blxuXHRcdFx0XHRcdFx0YVByZXZEcmlsbFN0YWNrID0gYURpbWVuc2lvbnM7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYUZpbHRlcnMubGVuZ3RoID4gMDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGJOb0NoYW5nZSAmJiBvU291cmNlLmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdFx0XHRcdC8vIGJOb0NoYW5nZSBpcyB0cnVlIHdoZW4gY2hhcnQgaXMgc2VsZWN0ZWRcblx0XHRcdFx0XHRcdHJldHVybiBhRmlsdGVycy5sZW5ndGggPiAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoc0Vycm9yKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHQvKipcblx0ICogTWV0aG9kIHRoYXQgcmV0dXJucyB0aGUgY2hhcnQgZmlsdGVycyBzdG9yZWQgaW4gdGhlIFVJIG1vZGVsLlxuXHQgKlxuXHQgKiBAcGFyYW0gb01kY0NoYXJ0IFRoZSBNREMgY2hhcnQgY29udHJvbFxuXHQgKiBAcGFyYW0gYkNsZWFyU2VsZWN0aW9ucyBDbGVhcnMgY2hhcnQgc2VsZWN0aW9ucyBpbiB0aGUgVUkgbW9kZWwgaWYgdHJ1ZVxuXHQgKiBAcmV0dXJucyBUaGUgY2hhcnQgc2VsZWN0aW9uc1xuXHQgKi9cblx0Z2V0Q2hhcnRTZWxlY3Rpb25zOiBmdW5jdGlvbiAob01kY0NoYXJ0OiBNRENDaGFydCwgYkNsZWFyU2VsZWN0aW9ucz86IGJvb2xlYW4pIHtcblx0XHQvLyBnZXQgY2hhcnQgc2VsZWN0aW9uc1xuXHRcdGlmIChiQ2xlYXJTZWxlY3Rpb25zKSB7XG5cdFx0XHR0aGlzLmdldENoYXJ0TW9kZWwob01kY0NoYXJ0LCBcIlwiLCB7fSk7XG5cdFx0fVxuXHRcdGNvbnN0IGFWaXpTZWxlY3Rpb25zID0gdGhpcy5nZXRDaGFydE1vZGVsKG9NZGNDaGFydCwgXCJmaWx0ZXJzXCIpO1xuXHRcdHJldHVybiBhVml6U2VsZWN0aW9ucyB8fCBbXTtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0aGF0IHJldHVybnMgdGhlIGNoYXJ0IHNlbGVjdGlvbnMgYXMgYSBmaWx0ZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBvTWRjQ2hhcnQgVGhlIE1EQyBjaGFydCBjb250cm9sXG5cdCAqIEByZXR1cm5zIEZpbHRlciBjb250YWluaW5nIGNoYXJ0IHNlbGVjdGlvbnNcblx0ICovXG5cdGdldENoYXJ0RmlsdGVyczogZnVuY3Rpb24gKG9NZGNDaGFydDogTURDQ2hhcnQpIHtcblx0XHQvLyBnZXQgY2hhcnQgc2VsZWN0aW9ucyBhcyBhIGZpbHRlclxuXHRcdGNvbnN0IGFGaWx0ZXJzID0gdGhpcy5nZXRDaGFydFNlbGVjdGlvbnMob01kY0NoYXJ0KSB8fCBbXTtcblx0XHRyZXR1cm4gbmV3IEZpbHRlcihhRmlsdGVycyk7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdGhhdCBzZXRzIHRoZSBjaGFydCBzZWxlY3Rpb25zIGFzIGluIHRoZSBVSSBtb2RlbC5cblx0ICpcblx0ICogQHBhcmFtIG9NZGNDaGFydCBUaGUgTURDIGNoYXJ0IGNvbnRyb2xcblx0ICovXG5cdHNldENoYXJ0RmlsdGVyczogZnVuY3Rpb24gKG9NZGNDaGFydDogTURDQ2hhcnQpIHtcblx0XHQvLyBzYXZpbmcgc2VsZWN0aW9ucyBpbiBlYWNoIGRyaWxsIHN0YWNrIGZvciBmdXR1cmUgdXNlXG5cdFx0Y29uc3Qgb0RyaWxsU3RhY2sgPSB0aGlzLmdldENoYXJ0TW9kZWwob01kY0NoYXJ0LCBcImRyaWxsU3RhY2tcIikgfHwgKHt9IGFzIGFueSk7XG5cdFx0Y29uc3Qgb0NoYXJ0ID0gKG9NZGNDaGFydCBhcyBhbnkpLmdldENvbnRyb2xEZWxlZ2F0ZSgpLl9nZXRDaGFydChvTWRjQ2hhcnQpO1xuXHRcdGNvbnN0IGFDaGFydEZpbHRlcnM6IGFueVtdID0gW107XG5cdFx0bGV0IGFWaXNpYmxlRGltZW5zaW9uczogYW55O1xuXG5cdFx0ZnVuY3Rpb24gYWRkQ2hhcnRGaWx0ZXJzKGFTZWxlY3RlZERhdGE6IGFueSkge1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIGluIGFTZWxlY3RlZERhdGEpIHtcblx0XHRcdFx0Y29uc3QgYURpbUZpbHRlcnMgPSBbXTtcblx0XHRcdFx0Zm9yIChjb25zdCBpIGluIGFWaXNpYmxlRGltZW5zaW9ucykge1xuXHRcdFx0XHRcdGNvbnN0IHNQYXRoID0gYVZpc2libGVEaW1lbnNpb25zW2ldO1xuXHRcdFx0XHRcdGNvbnN0IHNWYWx1ZSA9IGFTZWxlY3RlZERhdGFbaXRlbV0uZGF0YVtzUGF0aF07XG5cdFx0XHRcdFx0aWYgKHNWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRhRGltRmlsdGVycy5wdXNoKFxuXHRcdFx0XHRcdFx0XHRuZXcgRmlsdGVyKHtcblx0XHRcdFx0XHRcdFx0XHRwYXRoOiBzUGF0aCxcblx0XHRcdFx0XHRcdFx0XHRvcGVyYXRvcjogRmlsdGVyT3BlcmF0b3IuRVEsXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUxOiBzVmFsdWVcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChhRGltRmlsdGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0YUNoYXJ0RmlsdGVycy5wdXNoKG5ldyBGaWx0ZXIoYURpbUZpbHRlcnMsIHRydWUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAob0NoYXJ0KSB7XG5cdFx0XHRjb25zdCBhVml6U2VsZWN0aW9ucyA9IHRoaXMuZ2V0Vml6U2VsZWN0aW9uKG9DaGFydCk7XG5cdFx0XHRhVmlzaWJsZURpbWVuc2lvbnMgPSBvQ2hhcnQuZ2V0VmlzaWJsZURpbWVuc2lvbnMoKTtcblx0XHRcdGNvbnN0IGFEaW1lbnNpb25zID0gdGhpcy5nZXREaW1lbnNpb25zRnJvbURyaWxsU3RhY2sob0NoYXJ0KTtcblx0XHRcdGlmIChhRGltZW5zaW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHRoaXMuZ2V0Q2hhcnRNb2RlbChvTWRjQ2hhcnQsIFwiZHJpbGxTdGFja1wiLCB7fSk7XG5cdFx0XHRcdG9EcmlsbFN0YWNrW2FEaW1lbnNpb25zLnRvU3RyaW5nKCldID0gYVZpelNlbGVjdGlvbnM7XG5cdFx0XHRcdHRoaXMuZ2V0Q2hhcnRNb2RlbChvTWRjQ2hhcnQsIFwiZHJpbGxTdGFja1wiLCBvRHJpbGxTdGFjayk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYVZpelNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHQvLyBjcmVhdGluZyBmaWx0ZXJzIHdpdGggc2VsZWN0aW9ucyBpbiB0aGUgY3VycmVudCBkcmlsbHN0YWNrXG5cdFx0XHRcdGFkZENoYXJ0RmlsdGVycyhhVml6U2VsZWN0aW9ucyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBjcmVhdGluZyBmaWx0ZXJzIHdpdGggc2VsZWN0aW9ucyBpbiB0aGUgcHJldmlvdXMgZHJpbGxzdGFjayB3aGVuIHRoZXJlIGFyZSBubyBzZWxlY3Rpb25zIGluIHRoZSBjdXJyZW50IGRyaWxsc3RhY2tcblx0XHRcdFx0Y29uc3QgYURyaWxsU3RhY2tLZXlzID0gT2JqZWN0LmtleXMob0RyaWxsU3RhY2spIHx8IFtdO1xuXHRcdFx0XHRjb25zdCBhUHJldkRyaWxsU3RhY2tEYXRhID0gb0RyaWxsU3RhY2tbYURyaWxsU3RhY2tLZXlzW2FEcmlsbFN0YWNrS2V5cy5sZW5ndGggLSAyXV0gfHwgW107XG5cdFx0XHRcdGFkZENoYXJ0RmlsdGVycyhhUHJldkRyaWxsU3RhY2tEYXRhKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZ2V0Q2hhcnRNb2RlbChvTWRjQ2hhcnQsIFwiZmlsdGVyc1wiLCBhQ2hhcnRGaWx0ZXJzKTtcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdGhhdCByZXR1cm5zIHRoZSBjaGFydCBzZWxlY3Rpb25zIGFzIGEgZmlsdGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NoYXJ0IFRoZSBpbm5lciBjaGFydCBjb250cm9sXG5cdCAqIEByZXR1cm5zIFRoZSBmaWx0ZXJzIGluIHRoZSBmaWx0ZXIgYmFyXG5cdCAqL1xuXHRnZXRGaWx0ZXJCYXJGaWx0ZXJJbmZvOiBmdW5jdGlvbiAob0NoYXJ0OiBNRENDaGFydCkge1xuXHRcdHJldHVybiBGaWx0ZXJVdGlsLmdldEZpbHRlckluZm8ob0NoYXJ0LmdldEZpbHRlcigpLCB7XG5cdFx0XHR0YXJnZXRDb250cm9sOiBvQ2hhcnRcblx0XHR9KTtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0aGF0IHJldHVybnMgdGhlIGZpbHRlcnMgZm9yIHRoZSBjaGFydCBhbmQgZmlsdGVyIGJhci5cblx0ICpcblx0ICogQHBhcmFtIG9DaGFydCBUaGUgaW5uZXIgY2hhcnQgY29udHJvbFxuXHQgKiBAcmV0dXJucyBUaGUgbmV3IGZpbHRlciBjb250YWluaW5nIHRoZSBmaWx0ZXJzIGZvciBib3RoIHRoZSBjaGFydCBhbmQgdGhlIGZpbHRlciBiYXJcblx0ICovXG5cdGdldEFsbEZpbHRlckluZm86IGZ1bmN0aW9uIChvQ2hhcnQ6IE1EQ0NoYXJ0KSB7XG5cdFx0Y29uc3Qgb0ZpbHRlcnMgPSB0aGlzLmdldEZpbHRlckJhckZpbHRlckluZm8ob0NoYXJ0KTtcblx0XHRjb25zdCBhQ2hhcnRGaWx0ZXJzID0gdGhpcy5nZXRDaGFydEZpbHRlcnMob0NoYXJ0KSBhcyBhbnk7XG5cblx0XHRpZiAoYUNoYXJ0RmlsdGVycyAmJiBhQ2hhcnRGaWx0ZXJzLmFGaWx0ZXJzICYmIGFDaGFydEZpbHRlcnMuYUZpbHRlcnMubGVuZ3RoKSB7XG5cdFx0XHRvRmlsdGVycy5maWx0ZXJzLnB1c2goYUNoYXJ0RmlsdGVycyk7XG5cdFx0fVxuXHRcdC8vIGZpbHRlcmJhciArIGNoYXJ0IGZpbHRlcnNcblx0XHRyZXR1cm4gb0ZpbHRlcnM7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdGhhdCByZXR1cm5zIHNlbGVjdGVkIGRhdGEgaW4gdGhlIGNoYXJ0LlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NoYXJ0IFRoZSBpbm5lciBjaGFydCBjb250cm9sXG5cdCAqIEByZXR1cm5zIFRoZSBzZWxlY3RlZCBjaGFydCBkYXRhXG5cdCAqL1xuXHRnZXRDaGFydFNlbGVjdGVkRGF0YTogZnVuY3Rpb24gKG9DaGFydDogQ2hhcnQpIHtcblx0XHRsZXQgYVNlbGVjdGVkUG9pbnRzID0gW107XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9zd2l0Y2gtZXhoYXVzdGl2ZW5lc3MtY2hlY2tcblx0XHRzd2l0Y2ggKG9DaGFydC5nZXRTZWxlY3Rpb25CZWhhdmlvcigpKSB7XG5cdFx0XHRjYXNlIFwiREFUQVBPSU5UXCI6XG5cdFx0XHRcdGFTZWxlY3RlZFBvaW50cyA9IChvQ2hhcnQuZ2V0U2VsZWN0ZWREYXRhUG9pbnRzKCkgYXMgYW55KS5kYXRhUG9pbnRzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJDQVRFR09SWVwiOlxuXHRcdFx0XHRhU2VsZWN0ZWRQb2ludHMgPSAob0NoYXJ0LmdldFNlbGVjdGVkQ2F0ZWdvcmllcygpIGFzIGFueSkuY2F0ZWdvcmllcztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiU0VSSUVTXCI6XG5cdFx0XHRcdGFTZWxlY3RlZFBvaW50cyA9IChvQ2hhcnQuZ2V0U2VsZWN0ZWRTZXJpZXMoKSBhcyBhbnkpLnNlcmllcztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHJldHVybiBhU2VsZWN0ZWRQb2ludHM7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2V0IGZpbHRlcnMsIGRyaWxsc3RhY2sgYW5kIHNlbGVjdGVkIGNvbnRleHRzIGluIHRoZSBVSSBtb2RlbC5cblx0ICogQ2FuIGFsc28gYmUgdXNlZCB0byBzZXQgZGF0YSBpbiB0aGUgbW9kZWwuXG5cdCAqXG5cdCAqIEBwYXJhbSBvTWRjQ2hhcnQgVGhlIE1EQyBjaGFydCBjb250cm9sXG5cdCAqIEBwYXJhbSBzUGF0aCBUaGUgcGF0aCBpbiB0aGUgVUkgbW9kZWwgZnJvbSB3aGljaCBjaGFydCBkYXRhIGlzIHRvIGJlIHNldC9mZXRjaGVkXG5cdCAqIEBwYXJhbSB2RGF0YSBUaGUgY2hhcnQgaW5mbyB0byBiZSBzZXRcblx0ICogQHJldHVybnMgVGhlIGNoYXJ0IGluZm8gKGZpbHRlcnMvZHJpbGxzdGFjay9zZWxlY3RlZENvbnRleHRzKVxuXHQgKi9cblx0Z2V0Q2hhcnRNb2RlbDogZnVuY3Rpb24gKG9NZGNDaGFydDogTURDQ2hhcnQsIHNQYXRoOiBzdHJpbmcsIHZEYXRhPzogb2JqZWN0IHwgYW55W10pIHtcblx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvTWRjQ2hhcnQuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRpZiAoIW9JbnRlcm5hbE1vZGVsQ29udGV4dCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh2RGF0YSkge1xuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KHNQYXRoLCB2RGF0YSk7XG5cdFx0fVxuXHRcdHJldHVybiBvSW50ZXJuYWxNb2RlbENvbnRleHQgJiYgb0ludGVybmFsTW9kZWxDb250ZXh0LmdldE9iamVjdChzUGF0aCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZmV0Y2ggdGhlIGN1cnJlbnQgZHJpbGxzdGFjayBkaW1lbnNpb25zLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NoYXJ0IFRoZSBpbm5lciBjaGFydCBjb250cm9sXG5cdCAqIEByZXR1cm5zIFRoZSBjdXJyZW50IGRyaWxsc3RhY2sgZGltZW5zaW9uc1xuXHQgKi9cblx0Z2V0RGltZW5zaW9uc0Zyb21EcmlsbFN0YWNrOiBmdW5jdGlvbiAob0NoYXJ0OiBDaGFydCkge1xuXHRcdGNvbnN0IGFDdXJyZW50RHJpbGxTdGFjayA9IG9DaGFydC5nZXREcmlsbFN0YWNrKCkgfHwgW107XG5cdFx0Y29uc3QgYUN1cnJlbnREcmlsbFZpZXcgPSBhQ3VycmVudERyaWxsU3RhY2sucG9wKCkgfHwgKHt9IGFzIGFueSk7XG5cdFx0cmV0dXJuIGFDdXJyZW50RHJpbGxWaWV3LmRpbWVuc2lvbiB8fCBbXTtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBmZXRjaCBjaGFydCBzZWxlY3Rpb25zLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NoYXJ0IFRoZSBpbm5lciBjaGFydCBjb250cm9sXG5cdCAqIEByZXR1cm5zIFRoZSBjaGFydCBzZWxlY3Rpb25zXG5cdCAqL1xuXHRnZXRWaXpTZWxlY3Rpb246IGZ1bmN0aW9uIChvQ2hhcnQ6IGFueSkge1xuXHRcdHJldHVybiAob0NoYXJ0ICYmIG9DaGFydC5fZ2V0Vml6RnJhbWUoKSAmJiBvQ2hhcnQuX2dldFZpekZyYW1lKCkudml6U2VsZWN0aW9uKCkpIHx8IFtdO1xuXHR9XG59O1xuXG5leHBv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