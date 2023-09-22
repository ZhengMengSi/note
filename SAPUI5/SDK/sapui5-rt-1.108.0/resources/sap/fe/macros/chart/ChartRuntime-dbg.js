/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/ActionRuntime", "sap/fe/macros/chart/ChartUtils", "sap/fe/macros/DelegateUtil"], function (ActionRuntime, ChartUtils, DelegateUtil) {
  "use strict";

  /**
   * Static class used by MDC Chart during runtime
   *
   * @private
   * @experimental This module is only for internal/experimental use!
   */
  var ChartRuntime = {
    /**
     * Updates the chart after selection or deselection of data points.
     *
     * @function
     * @static
     * @name sap.fe.macros.chart.ChartRuntime.fnUpdateChart
     * @memberof sap.fe.macros.chart.ChartRuntime
     * @param oEvent Event triggered after selection or deselection of data points on chart
     * @ui5-restricted
     */
    fnUpdateChart: function (oEvent) {
      var oMdcChart = oEvent.getSource().getContent(),
          oInnerChart = oMdcChart.getControlDelegate()._getChart(oMdcChart);

      var sActionsMultiselectDisabled,
          oActionOperationAvailableMap = {},
          aActionsMultiselectDisabled = []; // changing drill stack changes order of custom data, looping through all

      oMdcChart.getCustomData().forEach(function (oCustomData) {
        if (oCustomData.getKey() === "operationAvailableMap") {
          oActionOperationAvailableMap = JSON.parse(DelegateUtil.getCustomData(oMdcChart, "operationAvailableMap") && DelegateUtil.getCustomData(oMdcChart, "operationAvailableMap").customData);
        } else if (oCustomData.getKey() === "multiSelectDisabledActions") {
          sActionsMultiselectDisabled = oCustomData.getValue();
          aActionsMultiselectDisabled = sActionsMultiselectDisabled ? sActionsMultiselectDisabled.split(",") : [];
        }
      });
      var oInternalModelContext = oMdcChart.getBindingContext("internal");
      var aSelectedContexts = [];
      var oModelObject;
      var aSelectedDataPoints = ChartUtils.getChartSelectedData(oInnerChart);

      for (var i = 0; i < aSelectedDataPoints.length; i++) {
        aSelectedContexts.push(aSelectedDataPoints[i].context);
      }

      oInternalModelContext.setProperty("selectedContexts", aSelectedContexts);
      oInternalModelContext.getModel().setProperty("".concat(oInternalModelContext.getPath(), "/numberOfSelectedContexts"), oInnerChart.getSelectedDataPoints().count);

      for (var j = 0; j < aSelectedContexts.length; j++) {
        var oSelectedContext = aSelectedContexts[j];
        var oContextData = oSelectedContext.getObject();

        for (var key in oContextData) {
          if (key.indexOf("#") === 0) {
            var sActionPath = key;
            sActionPath = sActionPath.substring(1, sActionPath.length);
            oModelObject = oInternalModelContext.getObject();
            oModelObject[sActionPath] = true;
            oInternalModelContext.setProperty("", oModelObject);
          }
        }

        oModelObject = oInternalModelContext.getObject();
      }

      ActionRuntime.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts, "chart");

      if (aSelectedContexts.length > 1) {
        aActionsMultiselectDisabled.forEach(function (sAction) {
          oInternalModelContext.setProperty(sAction, false);
        });
      }
    }
  };
  return ChartRuntime;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGFydFJ1bnRpbWUiLCJmblVwZGF0ZUNoYXJ0Iiwib0V2ZW50Iiwib01kY0NoYXJ0IiwiZ2V0U291cmNlIiwiZ2V0Q29udGVudCIsIm9Jbm5lckNoYXJ0IiwiZ2V0Q29udHJvbERlbGVnYXRlIiwiX2dldENoYXJ0Iiwic0FjdGlvbnNNdWx0aXNlbGVjdERpc2FibGVkIiwib0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZU1hcCIsImFBY3Rpb25zTXVsdGlzZWxlY3REaXNhYmxlZCIsImdldEN1c3RvbURhdGEiLCJmb3JFYWNoIiwib0N1c3RvbURhdGEiLCJnZXRLZXkiLCJKU09OIiwicGFyc2UiLCJEZWxlZ2F0ZVV0aWwiLCJjdXN0b21EYXRhIiwiZ2V0VmFsdWUiLCJzcGxpdCIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0IiwiYVNlbGVjdGVkQ29udGV4dHMiLCJvTW9kZWxPYmplY3QiLCJhU2VsZWN0ZWREYXRhUG9pbnRzIiwiQ2hhcnRVdGlscyIsImdldENoYXJ0U2VsZWN0ZWREYXRhIiwiaSIsImxlbmd0aCIsInB1c2giLCJjb250ZXh0Iiwic2V0UHJvcGVydHkiLCJnZXRNb2RlbCIsImdldFBhdGgiLCJnZXRTZWxlY3RlZERhdGFQb2ludHMiLCJjb3VudCIsImoiLCJvU2VsZWN0ZWRDb250ZXh0Iiwib0NvbnRleHREYXRhIiwiZ2V0T2JqZWN0Iiwia2V5IiwiaW5kZXhPZiIsInNBY3Rpb25QYXRoIiwic3Vic3RyaW5nIiwiQWN0aW9uUnVudGltZSIsInNldEFjdGlvbkVuYWJsZW1lbnQiLCJzQWN0aW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJDaGFydFJ1bnRpbWUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGlvblJ1bnRpbWUgZnJvbSBcInNhcC9mZS9jb3JlL0FjdGlvblJ1bnRpbWVcIjtcbmltcG9ydCBDaGFydFV0aWxzIGZyb20gXCJzYXAvZmUvbWFjcm9zL2NoYXJ0L0NoYXJ0VXRpbHNcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgdHlwZSBFdmVudCBmcm9tIFwic2FwL3VpL2Jhc2UvRXZlbnRcIjtcbi8qKlxuICogU3RhdGljIGNsYXNzIHVzZWQgYnkgTURDIENoYXJ0IGR1cmluZyBydW50aW1lXG4gKlxuICogQHByaXZhdGVcbiAqIEBleHBlcmltZW50YWwgVGhpcyBtb2R1bGUgaXMgb25seSBmb3IgaW50ZXJuYWwvZXhwZXJpbWVudGFsIHVzZSFcbiAqL1xuY29uc3QgQ2hhcnRSdW50aW1lID0ge1xuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgY2hhcnQgYWZ0ZXIgc2VsZWN0aW9uIG9yIGRlc2VsZWN0aW9uIG9mIGRhdGEgcG9pbnRzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHN0YXRpY1xuXHQgKiBAbmFtZSBzYXAuZmUubWFjcm9zLmNoYXJ0LkNoYXJ0UnVudGltZS5mblVwZGF0ZUNoYXJ0XG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUubWFjcm9zLmNoYXJ0LkNoYXJ0UnVudGltZVxuXHQgKiBAcGFyYW0gb0V2ZW50IEV2ZW50IHRyaWdnZXJlZCBhZnRlciBzZWxlY3Rpb24gb3IgZGVzZWxlY3Rpb24gb2YgZGF0YSBwb2ludHMgb24gY2hhcnRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRmblVwZGF0ZUNoYXJ0OiBmdW5jdGlvbiAob0V2ZW50OiBFdmVudCkge1xuXHRcdGNvbnN0IG9NZGNDaGFydCA9IChvRXZlbnQuZ2V0U291cmNlKCkgYXMgYW55KS5nZXRDb250ZW50KCksXG5cdFx0XHRvSW5uZXJDaGFydCA9IG9NZGNDaGFydC5nZXRDb250cm9sRGVsZWdhdGUoKS5fZ2V0Q2hhcnQob01kY0NoYXJ0KTtcblx0XHRsZXQgc0FjdGlvbnNNdWx0aXNlbGVjdERpc2FibGVkLFxuXHRcdFx0b0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZU1hcCA9IHt9LFxuXHRcdFx0YUFjdGlvbnNNdWx0aXNlbGVjdERpc2FibGVkOiBhbnlbXSA9IFtdO1xuXHRcdC8vIGNoYW5naW5nIGRyaWxsIHN0YWNrIGNoYW5nZXMgb3JkZXIgb2YgY3VzdG9tIGRhdGEsIGxvb3BpbmcgdGhyb3VnaCBhbGxcblx0XHRvTWRjQ2hhcnQuZ2V0Q3VzdG9tRGF0YSgpLmZvckVhY2goZnVuY3Rpb24gKG9DdXN0b21EYXRhOiBhbnkpIHtcblx0XHRcdGlmIChvQ3VzdG9tRGF0YS5nZXRLZXkoKSA9PT0gXCJvcGVyYXRpb25BdmFpbGFibGVNYXBcIikge1xuXHRcdFx0XHRvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gSlNPTi5wYXJzZShcblx0XHRcdFx0XHREZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvTWRjQ2hhcnQsIFwib3BlcmF0aW9uQXZhaWxhYmxlTWFwXCIpICYmXG5cdFx0XHRcdFx0XHREZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvTWRjQ2hhcnQsIFwib3BlcmF0aW9uQXZhaWxhYmxlTWFwXCIpLmN1c3RvbURhdGFcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSBpZiAob0N1c3RvbURhdGEuZ2V0S2V5KCkgPT09IFwibXVsdGlTZWxlY3REaXNhYmxlZEFjdGlvbnNcIikge1xuXHRcdFx0XHRzQWN0aW9uc011bHRpc2VsZWN0RGlzYWJsZWQgPSBvQ3VzdG9tRGF0YS5nZXRWYWx1ZSgpO1xuXHRcdFx0XHRhQWN0aW9uc011bHRpc2VsZWN0RGlzYWJsZWQgPSBzQWN0aW9uc011bHRpc2VsZWN0RGlzYWJsZWQgPyBzQWN0aW9uc011bHRpc2VsZWN0RGlzYWJsZWQuc3BsaXQoXCIsXCIpIDogW107XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb01kY0NoYXJ0LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cblx0XHRjb25zdCBhU2VsZWN0ZWRDb250ZXh0cyA9IFtdO1xuXHRcdGxldCBvTW9kZWxPYmplY3Q7XG5cdFx0Y29uc3QgYVNlbGVjdGVkRGF0YVBvaW50cyA9IENoYXJ0VXRpbHMuZ2V0Q2hhcnRTZWxlY3RlZERhdGEob0lubmVyQ2hhcnQpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYVNlbGVjdGVkRGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0YVNlbGVjdGVkQ29udGV4dHMucHVzaChhU2VsZWN0ZWREYXRhUG9pbnRzW2ldLmNvbnRleHQpO1xuXHRcdH1cblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJzZWxlY3RlZENvbnRleHRzXCIsIGFTZWxlY3RlZENvbnRleHRzKTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHRcblx0XHRcdC5nZXRNb2RlbCgpXG5cdFx0XHQuc2V0UHJvcGVydHkoYCR7b0ludGVybmFsTW9kZWxDb250ZXh0LmdldFBhdGgoKX0vbnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzYCwgb0lubmVyQ2hhcnQuZ2V0U2VsZWN0ZWREYXRhUG9pbnRzKCkuY291bnQpO1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgYVNlbGVjdGVkQ29udGV4dHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGNvbnN0IG9TZWxlY3RlZENvbnRleHQgPSBhU2VsZWN0ZWRDb250ZXh0c1tqXTtcblx0XHRcdGNvbnN0IG9Db250ZXh0RGF0YSA9IG9TZWxlY3RlZENvbnRleHQuZ2V0T2JqZWN0KCk7XG5cdFx0XHRmb3IgKGNvbnN0IGtleSBpbiBvQ29udGV4dERhdGEpIHtcblx0XHRcdFx0aWYgKGtleS5pbmRleE9mKFwiI1wiKSA9PT0gMCkge1xuXHRcdFx0XHRcdGxldCBzQWN0aW9uUGF0aCA9IGtleTtcblx0XHRcdFx0XHRzQWN0aW9uUGF0aCA9IHNBY3Rpb25QYXRoLnN1YnN0cmluZygxLCBzQWN0aW9uUGF0aC5sZW5ndGgpO1xuXHRcdFx0XHRcdG9Nb2RlbE9iamVjdCA9IG9JbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRPYmplY3QoKTtcblx0XHRcdFx0XHRvTW9kZWxPYmplY3Rbc0FjdGlvblBhdGhdID0gdHJ1ZTtcblx0XHRcdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJcIiwgb01vZGVsT2JqZWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0b01vZGVsT2JqZWN0ID0gb0ludGVybmFsTW9kZWxDb250ZXh0LmdldE9iamVjdCgpO1xuXHRcdH1cblxuXHRcdEFjdGlvblJ1bnRpbWUuc2V0QWN0aW9uRW5hYmxlbWVudChvSW50ZXJuYWxNb2RlbENvbnRleHQsIG9BY3Rpb25PcGVyYXRpb25BdmFpbGFibGVNYXAsIGFTZWxlY3RlZENvbnRleHRzLCBcImNoYXJ0XCIpO1xuXG5cdFx0aWYgKGFTZWxlY3RlZENvbnRleHRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFBY3Rpb25zTXVsdGlzZWxlY3REaXNhYmxlZC5mb3JFYWNoKGZ1bmN0aW9uIChzQWN0aW9uOiBhbnkpIHtcblx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KHNBY3Rpb24sIGZhbHNlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhcnRSdW50aW1lO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsSUFBTUEsWUFBWSxHQUFHO0lBQ3BCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0NDLGFBQWEsRUFBRSxVQUFVQyxNQUFWLEVBQXlCO01BQ3ZDLElBQU1DLFNBQVMsR0FBSUQsTUFBTSxDQUFDRSxTQUFQLEVBQUQsQ0FBNEJDLFVBQTVCLEVBQWxCO01BQUEsSUFDQ0MsV0FBVyxHQUFHSCxTQUFTLENBQUNJLGtCQUFWLEdBQStCQyxTQUEvQixDQUF5Q0wsU0FBekMsQ0FEZjs7TUFFQSxJQUFJTSwyQkFBSjtNQUFBLElBQ0NDLDRCQUE0QixHQUFHLEVBRGhDO01BQUEsSUFFQ0MsMkJBQWtDLEdBQUcsRUFG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