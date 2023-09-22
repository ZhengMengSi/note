/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/helpers/BindingToolkit", "sap/fe/macros/CommonHelper"], function (BindingHelper, BindingToolkit, CommonHelper) {
  "use strict";

  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var bindingContextPathVisitor = BindingHelper.bindingContextPathVisitor;

  var ActionHelper = {
    /**
     * Returns an array of actions that are not enabled with a multiple selection.
     *
     * @function
     * @name getMultiSelectDisabledActions
     * @param aCollection Array of records
     * @param oContext The context object of the control
     * @returns An array of action paths
     * @ui5-restricted
     */
    getMultiSelectDisabledActions: function (aCollection, oContext) {
      var aMultiSelectDisabledActions = [];
      var sActionPath, sActionName, sAnnotationPath, oParameterAnnotations, oAction;

      if (aCollection) {
        var aActionMetadata = aCollection.filter(function (oItem) {
          return oItem.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction";
        });
        aActionMetadata.forEach(function (oActionMetadata) {
          sActionName = oActionMetadata.Action;
          sActionPath = CommonHelper.getActionPath(oContext.context, true, sActionName, false);
          oAction = oContext.context.getObject("".concat(sActionPath, "/@$ui5.overload/0"));

          if (oAction && oAction.$Parameter && oAction.$IsBound) {
            for (var n in oAction.$Parameter) {
              sAnnotationPath = "".concat(sActionPath, "/").concat(oAction.$Parameter[n].$Name, "@");
              oParameterAnnotations = oContext.context.getObject(sAnnotationPath);

              if (oParameterAnnotations && (oParameterAnnotations["@com.sap.vocabularies.UI.v1.Hidden"] && oParameterAnnotations["@com.sap.vocabularies.UI.v1.Hidden"].$Path || oParameterAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"] && oParameterAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"].$Path)) {
                aMultiSelectDisabledActions.push(sActionName);
                break;
              }
            }
          }
        });
      }

      return aMultiSelectDisabledActions;
    },

    /**
     * Method to get the expression for the 'press' event for the DataFieldForActionButton.
     *
     * @function
     * @name getPressEventDataFieldForActionButton
     * @param sId Control ID
     * @param oAction Action object
     * @param oParams Parameters
     * @param sOperationAvailableMap OperationAvailableMap as stringified JSON object
     * @returns The binding expression
     */
    getPressEventDataFieldForActionButton: function (sId, oAction, oParams, sOperationAvailableMap) {
      var sInvocationGrouping = oAction.InvocationGrouping && oAction.InvocationGrouping.$EnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated";
      oParams = oParams || {};
      oParams["invocationGrouping"] = CommonHelper.addSingleQuotes(sInvocationGrouping);
      oParams["controlId"] = CommonHelper.addSingleQuotes(sId);
      oParams["operationAvailableMap"] = CommonHelper.addSingleQuotes(sOperationAvailableMap);
      oParams["model"] = "${$source>/}.getModel()";
      oParams["label"] = oAction.Label && CommonHelper.addSingleQuotes(oAction.Label, true);
      return CommonHelper.generateFunction(".editFlow.invokeAction", CommonHelper.addSingleQuotes(oAction.Action), CommonHelper.objectToString(oParams));
    },

    /**
     * Return Number of contexts expression.
     *
     * @function
     * @name getNumberOfContextsExpression
     * @param vActionEnabled Status of action (single or multiselect)
     * @returns Number of contexts expression
     */
    getNumberOfContextsExpression: function (vActionEnabled) {
      var sNumberOfSelectedContexts;

      if (vActionEnabled === "single") {
        sNumberOfSelectedContexts = "${internal>numberOfSelectedContexts} === 1";
      } else {
        sNumberOfSelectedContexts = "${internal>numberOfSelectedContexts} > 0";
      }

      return sNumberOfSelectedContexts;
    },

    /**
     * Return UI Control (LineItem/Chart) Operation Available Map.
     *
     * @function
     * @name getOperationAvailableMap
     * @param aCollection Array of records
     * @param sControl Control name (lineItem / chart)
     * @param oContext Converter context
     * @returns The record containing all action names and their corresponding Core.OperationAvailable property paths
     */
    getOperationAvailableMap: function (aCollection, sControl, oContext) {
      var _this = this;

      var oOperationAvailableMap = {};

      if (aCollection) {
        aCollection.forEach(function (oRecord) {
          if (oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
            if (oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
              var actionName = oRecord.Action;

              if ((actionName === null || actionName === void 0 ? void 0 : actionName.indexOf("/")) < 0 && !oRecord.Determining) {
                if (sControl === "table") {
                  oOperationAvailableMap = _this._getOperationAvailableMapOfTable(oRecord, actionName, oOperationAvailableMap, oContext);
                } else if (sControl === "chart") {
                  oOperationAvailableMap = _this._getOperationAvailableMapOfChart(actionName, oOperationAvailableMap, oContext);
                }
              }
            }
          }
        });
      }

      return oOperationAvailableMap;
    },

    /**
     * Return LineItem Action Operation Available Map.
     *
     * @function
     * @name _getOperationAvailableMapOfTable
     * @private
     * @param oDataFieldForAction Data field for action object
     * @param sActionName Action name
     * @param oOperationAvailableMap Operation available map object
     * @param oConverterContext Converter context object
     * @returns The record containing all action name of line item and the corresponding Core.OperationAvailable property path
     */
    _getOperationAvailableMapOfTable: function (oDataFieldForAction, sActionName, oOperationAvailableMap, oConverterContext) {
      var _actionTarget$annotat, _actionTarget$annotat2, _actionTarget$paramet;

      var actionTarget = oDataFieldForAction.ActionTarget;

      if ((actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat = actionTarget.annotations) === null || _actionTarget$annotat === void 0 ? void 0 : (_actionTarget$annotat2 = _actionTarget$annotat.Core) === null || _actionTarget$annotat2 === void 0 ? void 0 : _actionTarget$annotat2.OperationAvailable) === null) {// We disabled action advertisement but kept it in the code for the time being
        //oOperationAvailableMap = this._addToMap(sActionName, null, oOperationAvailableMap);
      } else if (actionTarget !== null && actionTarget !== void 0 && (_actionTarget$paramet = actionTarget.parameters) !== null && _actionTarget$paramet !== void 0 && _actionTarget$paramet.length) {
        var _actionTarget$annotat3, _actionTarget$annotat4, _actionTarget$annotat5, _actionTarget$annotat6;

        var bindingParameterFullName = actionTarget.parameters[0].fullyQualifiedName,
            targetExpression = getExpressionFromAnnotation(actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat3 = actionTarget.annotations) === null || _actionTarget$annotat3 === void 0 ? void 0 : (_actionTarget$annotat4 = _actionTarget$annotat3.Core) === null || _actionTarget$annotat4 === void 0 ? void 0 : _actionTarget$annotat4.OperationAvailable, [], undefined, function (path) {
          return bindingContextPathVisitor(path, oConverterContext, bindingParameterFullName);
        });

        if (isPathInModelExpression(targetExpression)) {
          oOperationAvailableMap = this._addToMap(sActionName, targetExpression.path, oOperationAvailableMap);
        } else if ((actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat5 = actionTarget.annotations) === null || _actionTarget$annotat5 === void 0 ? void 0 : (_actionTarget$annotat6 = _actionTarget$annotat5.Core) === null || _actionTarget$annotat6 === void 0 ? void 0 : _actionTarget$annotat6.OperationAvailable) !== undefined) {
          oOperationAvailableMap = this._addToMap(sActionName, targetExpression, oOperationAvailableMap);
        }
      }

      return oOperationAvailableMap;
    },

    /**
     * Return LineItem Action Operation Available Map.
     *
     * @function
     * @name _getOperationAvailableMapOfChart
     * @private
     * @param sActionName Action name
     * @param oOperationAvailableMap Operation available map object
     * @param oContext Context object
     * @returns The record containing all action name of chart and the corresponding Core.OperationAvailable property path
     */
    _getOperationAvailableMapOfChart: function (sActionName, oOperationAvailableMap, oContext) {
      var oResult = CommonHelper.getActionPath(oContext.context, false, sActionName, true);

      if (oResult === null) {
        oOperationAvailableMap = this._addToMap(sActionName, null, oOperationAvailableMap);
      } else {
        oResult = CommonHelper.getActionPath(oContext.context, false, sActionName);

        if (oResult.sProperty) {
          oOperationAvailableMap = this._addToMap(sActionName, oResult.sProperty.substr(oResult.sBindingParameter.length + 1), oOperationAvailableMap);
        }
      }

      return oOperationAvailableMap;
    },

    /**
     * Return Map.
     *
     * @function
     * @name _addToMap
     * @private
     * @param sKey Key
     * @param oValue Value
     * @param oMap Map object
     * @returns Map object
     */
    _addToMap: function (sKey, oValue, oMap) {
      if (sKey && oMap) {
        oMap[sKey] = oValue;
      }

      return oMap;
    }
  };
  return ActionHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBY3Rpb25IZWxwZXIiLCJnZXRNdWx0aVNlbGVjdERpc2FibGVkQWN0aW9ucyIsImFDb2xsZWN0aW9uIiwib0NvbnRleHQiLCJhTXVsdGlTZWxlY3REaXNhYmxlZEFjdGlvbnMiLCJzQWN0aW9uUGF0aCIsInNBY3Rpb25OYW1lIiwic0Fubm90YXRpb25QYXRoIiwib1BhcmFtZXRlckFubm90YXRpb25zIiwib0FjdGlvbiIsImFBY3Rpb25NZXRhZGF0YSIsImZpbHRlciIsIm9JdGVtIiwiJFR5cGUiLCJmb3JFYWNoIiwib0FjdGlvbk1ldGFkYXRhIiwiQWN0aW9uIiwiQ29tbW9uSGVscGVyIiwiZ2V0QWN0aW9uUGF0aCIsImNvbnRleHQiLCJnZXRPYmplY3QiLCIkUGFyYW1ldGVyIiwiJElzQm91bmQiLCJuIiwiJE5hbWUiLCIkUGF0aCIsInB1c2giLCJnZXRQcmVzc0V2ZW50RGF0YUZpZWxkRm9yQWN0aW9uQnV0dG9uIiwic0lkIiwib1BhcmFtcyIsInNPcGVyYXRpb25BdmFpbGFibGVNYXAiLCJzSW52b2NhdGlvbkdyb3VwaW5nIiwiSW52b2NhdGlvbkdyb3VwaW5nIiwiJEVudW1NZW1iZXIiLCJhZGRTaW5nbGVRdW90ZXMiLCJMYWJlbCIsImdlbmVyYXRlRnVuY3Rpb24iLCJvYmplY3RUb1N0cmluZyIsImdldE51bWJlck9mQ29udGV4dHNFeHByZXNzaW9uIiwidkFjdGlvbkVuYWJsZWQiLCJzTnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzIiwiZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwic0NvbnRyb2wiLCJvT3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwib1JlY29yZCIsImFjdGlvbk5hbWUiLCJpbmRleE9mIiwiRGV0ZXJtaW5pbmciLCJfZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwT2ZUYWJsZSIsIl9nZXRPcGVyYXRpb25BdmFpbGFibGVNYXBPZkNoYXJ0Iiwib0RhdGFGaWVsZEZvckFjdGlvbiIsIm9Db252ZXJ0ZXJDb250ZXh0IiwiYWN0aW9uVGFyZ2V0IiwiQWN0aW9uVGFyZ2V0IiwiYW5ub3RhdGlvbnMiLCJDb3JlIiwiT3BlcmF0aW9uQXZhaWxhYmxlIiwicGFyYW1ldGVycyIsImxlbmd0aCIsImJpbmRpbmdQYXJhbWV0ZXJGdWxsTmFtZSIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInRhcmdldEV4cHJlc3Npb24iLCJnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24iLCJ1bmRlZmluZWQiLCJwYXRoIiwiYmluZGluZ0NvbnRleHRQYXRoVmlzaXRvciIsImlzUGF0aEluTW9kZWxFeHByZXNzaW9uIiwiX2FkZFRvTWFwIiwib1Jlc3VsdCIsInNQcm9wZXJ0eSIsInN1YnN0ciIsInNCaW5kaW5nUGFyYW1ldGVyIiwic0tleSIsIm9WYWx1ZSIsIm9NYXAiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkFjdGlvbkhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVSUFubm90YXRpb25UeXBlcywgdHlwZSBEYXRhRmllbGRGb3JBY3Rpb24gfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgdHlwZSBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IGJpbmRpbmdDb250ZXh0UGF0aFZpc2l0b3IgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCB7IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiwgaXNQYXRoSW5Nb2RlbEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IENvbW1vbkhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9Db21tb25IZWxwZXJcIjtcblxuY29uc3QgQWN0aW9uSGVscGVyID0ge1xuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiBhY3Rpb25zIHRoYXQgYXJlIG5vdCBlbmFibGVkIHdpdGggYSBtdWx0aXBsZSBzZWxlY3Rpb24uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBnZXRNdWx0aVNlbGVjdERpc2FibGVkQWN0aW9uc1xuXHQgKiBAcGFyYW0gYUNvbGxlY3Rpb24gQXJyYXkgb2YgcmVjb3Jkc1xuXHQgKiBAcGFyYW0gb0NvbnRleHQgVGhlIGNvbnRleHQgb2JqZWN0IG9mIHRoZSBjb250cm9sXG5cdCAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGFjdGlvbiBwYXRoc1xuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdGdldE11bHRpU2VsZWN0RGlzYWJsZWRBY3Rpb25zKGFDb2xsZWN0aW9uOiBhbnksIG9Db250ZXh0OiBhbnkpIHtcblx0XHRjb25zdCBhTXVsdGlTZWxlY3REaXNhYmxlZEFjdGlvbnM6IGFueVtdID0gW107XG5cdFx0bGV0IHNBY3Rpb25QYXRoLCBzQWN0aW9uTmFtZSwgc0Fubm90YXRpb25QYXRoLCBvUGFyYW1ldGVyQW5ub3RhdGlvbnMsIG9BY3Rpb247XG5cdFx0aWYgKGFDb2xsZWN0aW9uKSB7XG5cdFx0XHRjb25zdCBhQWN0aW9uTWV0YWRhdGEgPSBhQ29sbGVjdGlvbi5maWx0ZXIoZnVuY3Rpb24gKG9JdGVtOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG9JdGVtLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiO1xuXHRcdFx0fSk7XG5cdFx0XHRhQWN0aW9uTWV0YWRhdGEuZm9yRWFjaChmdW5jdGlvbiAob0FjdGlvbk1ldGFkYXRhOiBhbnkpIHtcblx0XHRcdFx0c0FjdGlvbk5hbWUgPSBvQWN0aW9uTWV0YWRhdGEuQWN0aW9uO1xuXHRcdFx0XHRzQWN0aW9uUGF0aCA9IENvbW1vbkhlbHBlci5nZXRBY3Rpb25QYXRoKG9Db250ZXh0LmNvbnRleHQsIHRydWUsIHNBY3Rpb25OYW1lLCBmYWxzZSk7XG5cdFx0XHRcdG9BY3Rpb24gPSBvQ29udGV4dC5jb250ZXh0LmdldE9iamVjdChgJHtzQWN0aW9uUGF0aH0vQCR1aTUub3ZlcmxvYWQvMGApO1xuXHRcdFx0XHRpZiAob0FjdGlvbiAmJiBvQWN0aW9uLiRQYXJhbWV0ZXIgJiYgb0FjdGlvbi4kSXNCb3VuZCkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgbiBpbiBvQWN0aW9uLiRQYXJhbWV0ZXIpIHtcblx0XHRcdFx0XHRcdHNBbm5vdGF0aW9uUGF0aCA9IGAke3NBY3Rpb25QYXRofS8ke29BY3Rpb24uJFBhcmFtZXRlcltuXS4kTmFtZX1AYDtcblx0XHRcdFx0XHRcdG9QYXJhbWV0ZXJBbm5vdGF0aW9ucyA9IG9Db250ZXh0LmNvbnRleHQuZ2V0T2JqZWN0KHNBbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdG9QYXJhbWV0ZXJBbm5vdGF0aW9ucyAmJlxuXHRcdFx0XHRcdFx0XHQoKG9QYXJhbWV0ZXJBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5cIl0gJiZcblx0XHRcdFx0XHRcdFx0XHRvUGFyYW1ldGVyQW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuXCJdLiRQYXRoKSB8fFxuXHRcdFx0XHRcdFx0XHRcdChvUGFyYW1ldGVyQW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpZWxkQ29udHJvbFwiXSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0b1BhcmFtZXRlckFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWVsZENvbnRyb2xcIl0uJFBhdGgpKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdGFNdWx0aVNlbGVjdERpc2FibGVkQWN0aW9ucy5wdXNoKHNBY3Rpb25OYW1lKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFNdWx0aVNlbGVjdERpc2FibGVkQWN0aW9ucztcblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGdldCB0aGUgZXhwcmVzc2lvbiBmb3IgdGhlICdwcmVzcycgZXZlbnQgZm9yIHRoZSBEYXRhRmllbGRGb3JBY3Rpb25CdXR0b24uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBnZXRQcmVzc0V2ZW50RGF0YUZpZWxkRm9yQWN0aW9uQnV0dG9uXG5cdCAqIEBwYXJhbSBzSWQgQ29udHJvbCBJRFxuXHQgKiBAcGFyYW0gb0FjdGlvbiBBY3Rpb24gb2JqZWN0XG5cdCAqIEBwYXJhbSBvUGFyYW1zIFBhcmFtZXRlcnNcblx0ICogQHBhcmFtIHNPcGVyYXRpb25BdmFpbGFibGVNYXAgT3BlcmF0aW9uQXZhaWxhYmxlTWFwIGFzIHN0cmluZ2lmaWVkIEpTT04gb2JqZWN0XG5cdCAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb25cblx0ICovXG5cdGdldFByZXNzRXZlbnREYXRhRmllbGRGb3JBY3Rpb25CdXR0b24oc0lkOiBzdHJpbmcsIG9BY3Rpb246IGFueSwgb1BhcmFtczogYW55LCBzT3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBzdHJpbmcpIHtcblx0XHRjb25zdCBzSW52b2NhdGlvbkdyb3VwaW5nID1cblx0XHRcdG9BY3Rpb24uSW52b2NhdGlvbkdyb3VwaW5nICYmXG5cdFx0XHRvQWN0aW9uLkludm9jYXRpb25Hcm91cGluZy4kRW51bU1lbWJlciA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5PcGVyYXRpb25Hcm91cGluZ1R5cGUvQ2hhbmdlU2V0XCJcblx0XHRcdFx0PyBcIkNoYW5nZVNldFwiXG5cdFx0XHRcdDogXCJJc29sYXRlZFwiO1xuXHRcdG9QYXJhbXMgPSBvUGFyYW1zIHx8IHt9O1xuXHRcdG9QYXJhbXNbXCJpbnZvY2F0aW9uR3JvdXBpbmdcIl0gPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKHNJbnZvY2F0aW9uR3JvdXBpbmcpO1xuXHRcdG9QYXJhbXNbXCJjb250cm9sSWRcIl0gPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKHNJZCk7XG5cdFx0b1BhcmFtc1tcIm9wZXJhdGlvbkF2YWlsYWJsZU1hcFwiXSA9IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMoc09wZXJhdGlvbkF2YWlsYWJsZU1hcCk7XG5cdFx0b1BhcmFtc1tcIm1vZGVsXCJdID0gXCIkeyRzb3VyY2U+L30uZ2V0TW9kZWwoKVwiO1xuXHRcdG9QYXJhbXNbXCJsYWJlbFwiXSA9IG9BY3Rpb24uTGFiZWwgJiYgQ29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3RlcyhvQWN0aW9uLkxhYmVsLCB0cnVlKTtcblxuXHRcdHJldHVybiBDb21tb25IZWxwZXIuZ2VuZXJhdGVGdW5jdGlvbihcblx0XHRcdFwiLmVkaXRGbG93Lmludm9rZUFjdGlvblwiLFxuXHRcdFx0Q29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3RlcyhvQWN0aW9uLkFjdGlvbiksXG5cdFx0XHRDb21tb25IZWxwZXIub2JqZWN0VG9TdHJpbmcob1BhcmFtcylcblx0XHQpO1xuXHR9LFxuXHQvKipcblx0ICogUmV0dXJuIE51bWJlciBvZiBjb250ZXh0cyBleHByZXNzaW9uLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0TnVtYmVyT2ZDb250ZXh0c0V4cHJlc3Npb25cblx0ICogQHBhcmFtIHZBY3Rpb25FbmFibGVkIFN0YXR1cyBvZiBhY3Rpb24gKHNpbmdsZSBvciBtdWx0aXNlbGVjdClcblx0ICogQHJldHVybnMgTnVtYmVyIG9mIGNvbnRleHRzIGV4cHJlc3Npb25cblx0ICovXG5cdGdldE51bWJlck9mQ29udGV4dHNFeHByZXNzaW9uKHZBY3Rpb25FbmFibGVkOiBTdHJpbmcpIHtcblx0XHRsZXQgc051bWJlck9mU2VsZWN0ZWRDb250ZXh0cztcblx0XHRpZiAodkFjdGlvbkVuYWJsZWQgPT09IFwic2luZ2xlXCIpIHtcblx0XHRcdHNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgPSBcIiR7aW50ZXJuYWw+bnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzfSA9PT0gMVwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzTnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzID0gXCIke2ludGVybmFsPm51bWJlck9mU2VsZWN0ZWRDb250ZXh0c30gPiAwXCI7XG5cdFx0fVxuXHRcdHJldHVybiBzTnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzO1xuXHR9LFxuXHQvKipcblx0ICogUmV0dXJuIFVJIENvbnRyb2wgKExpbmVJdGVtL0NoYXJ0KSBPcGVyYXRpb24gQXZhaWxhYmxlIE1hcC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGdldE9wZXJhdGlvbkF2YWlsYWJsZU1hcFxuXHQgKiBAcGFyYW0gYUNvbGxlY3Rpb24gQXJyYXkgb2YgcmVjb3Jkc1xuXHQgKiBAcGFyYW0gc0NvbnRyb2wgQ29udHJvbCBuYW1lIChsaW5lSXRlbSAvIGNoYXJ0KVxuXHQgKiBAcGFyYW0gb0NvbnRleHQgQ29udmVydGVyIGNvbnRleHRcblx0ICogQHJldHVybnMgVGhlIHJlY29yZCBjb250YWluaW5nIGFsbCBhY3Rpb24gbmFtZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgQ29yZS5PcGVyYXRpb25BdmFpbGFibGUgcHJvcGVydHkgcGF0aHNcblx0ICovXG5cdGdldE9wZXJhdGlvbkF2YWlsYWJsZU1hcChhQ29sbGVjdGlvbjogYW55LCBzQ29udHJvbDogc3RyaW5nLCBvQ29udGV4dDogYW55KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG5cdFx0bGV0IG9PcGVyYXRpb25BdmFpbGFibGVNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblx0XHRpZiAoYUNvbGxlY3Rpb24pIHtcblx0XHRcdGFDb2xsZWN0aW9uLmZvckVhY2goKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAob1JlY29yZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uKSB7XG5cdFx0XHRcdFx0aWYgKG9SZWNvcmQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbikge1xuXHRcdFx0XHRcdFx0Y29uc3QgYWN0aW9uTmFtZSA9IG9SZWNvcmQuQWN0aW9uIGFzIHN0cmluZztcblx0XHRcdFx0XHRcdGlmIChhY3Rpb25OYW1lPy5pbmRleE9mKFwiL1wiKSA8IDAgJiYgIW9SZWNvcmQuRGV0ZXJtaW5pbmcpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNDb250cm9sID09PSBcInRhYmxlXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRvT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gdGhpcy5fZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwT2ZUYWJsZShcblx0XHRcdFx0XHRcdFx0XHRcdG9SZWNvcmQsXG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb25OYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0b09wZXJhdGlvbkF2YWlsYWJsZU1hcCxcblx0XHRcdFx0XHRcdFx0XHRcdG9Db250ZXh0XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzQ29udHJvbCA9PT0gXCJjaGFydFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0b09wZXJhdGlvbkF2YWlsYWJsZU1hcCA9IHRoaXMuX2dldE9wZXJhdGlvbkF2YWlsYWJsZU1hcE9mQ2hhcnQoXG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb25OYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0b09wZXJhdGlvbkF2YWlsYWJsZU1hcCxcblx0XHRcdFx0XHRcdFx0XHRcdG9Db250ZXh0XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gTGluZUl0ZW0gQWN0aW9uIE9wZXJhdGlvbiBBdmFpbGFibGUgTWFwLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2dldE9wZXJhdGlvbkF2YWlsYWJsZU1hcE9mVGFibGVcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIG9EYXRhRmllbGRGb3JBY3Rpb24gRGF0YSBmaWVsZCBmb3IgYWN0aW9uIG9iamVjdFxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgQWN0aW9uIG5hbWVcblx0ICogQHBhcmFtIG9PcGVyYXRpb25BdmFpbGFibGVNYXAgT3BlcmF0aW9uIGF2YWlsYWJsZSBtYXAgb2JqZWN0XG5cdCAqIEBwYXJhbSBvQ29udmVydGVyQ29udGV4dCBDb252ZXJ0ZXIgY29udGV4dCBvYmplY3Rcblx0ICogQHJldHVybnMgVGhlIHJlY29yZCBjb250YWluaW5nIGFsbCBhY3Rpb24gbmFtZSBvZiBsaW5lIGl0ZW0gYW5kIHRoZSBjb3JyZXNwb25kaW5nIENvcmUuT3BlcmF0aW9uQXZhaWxhYmxlIHByb3BlcnR5IHBhdGhcblx0ICovXG5cdF9nZXRPcGVyYXRpb25BdmFpbGFibGVNYXBPZlRhYmxlKFxuXHRcdG9EYXRhRmllbGRGb3JBY3Rpb246IERhdGFGaWVsZEZvckFjdGlvbixcblx0XHRzQWN0aW9uTmFtZTogc3RyaW5nLFxuXHRcdG9PcGVyYXRpb25BdmFpbGFibGVNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4sXG5cdFx0b0NvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcblx0KSB7XG5cdFx0Y29uc3QgYWN0aW9uVGFyZ2V0ID0gb0RhdGFGaWVsZEZvckFjdGlvbi5BY3Rpb25UYXJnZXQ7XG5cdFx0aWYgKGFjdGlvblRhcmdldD8uYW5ub3RhdGlvbnM/LkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSA9PT0gbnVsbCkge1xuXHRcdFx0Ly8gV2UgZGlzYWJsZWQgYWN0aW9uIGFkdmVydGlzZW1lbnQgYnV0IGtlcHQgaXQgaW4gdGhlIGNvZGUgZm9yIHRoZSB0aW1lIGJlaW5nXG5cdFx0XHQvL29PcGVyYXRpb25BdmFpbGFibGVNYXAgPSB0aGlzLl9hZGRUb01hcChzQWN0aW9uTmFtZSwgbnVsbCwgb09wZXJhdGlvbkF2YWlsYWJsZU1hcCk7XG5cdFx0fSBlbHNlIGlmIChhY3Rpb25UYXJnZXQ/LnBhcmFtZXRlcnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYmluZGluZ1BhcmFtZXRlckZ1bGxOYW1lID0gYWN0aW9uVGFyZ2V0LnBhcmFtZXRlcnNbMF0uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHR0YXJnZXRFeHByZXNzaW9uID0gZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKFxuXHRcdFx0XHRcdGFjdGlvblRhcmdldD8uYW5ub3RhdGlvbnM/LkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSxcblx0XHRcdFx0XHRbXSxcblx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0KHBhdGg6IHN0cmluZykgPT4gYmluZGluZ0NvbnRleHRQYXRoVmlzaXRvcihwYXRoLCBvQ29udmVydGVyQ29udGV4dCwgYmluZGluZ1BhcmFtZXRlckZ1bGxOYW1lKVxuXHRcdFx0XHQpO1xuXHRcdFx0aWYgKGlzUGF0aEluTW9kZWxFeHByZXNzaW9uKHRhcmdldEV4cHJlc3Npb24pKSB7XG5cdFx0XHRcdG9PcGVyYXRpb25BdmFpbGFibGVNYXAgPSB0aGlzLl9hZGRUb01hcChzQWN0aW9uTmFtZSwgdGFyZ2V0RXhwcmVzc2lvbi5wYXRoLCBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwKTtcblx0XHRcdH0gZWxzZSBpZiAoYWN0aW9uVGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0b09wZXJhdGlvbkF2YWlsYWJsZU1hcCA9IHRoaXMuX2FkZFRvTWFwKHNBY3Rpb25OYW1lLCB0YXJnZXRFeHByZXNzaW9uLCBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9PcGVyYXRpb25BdmFpbGFibGVNYXA7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHVybiBMaW5lSXRlbSBBY3Rpb24gT3BlcmF0aW9uIEF2YWlsYWJsZSBNYXAuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwT2ZDaGFydFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgQWN0aW9uIG5hbWVcblx0ICogQHBhcmFtIG9PcGVyYXRpb25BdmFpbGFibGVNYXAgT3BlcmF0aW9uIGF2YWlsYWJsZSBtYXAgb2JqZWN0XG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9iamVjdFxuXHQgKiBAcmV0dXJucyBUaGUgcmVjb3JkIGNvbnRhaW5pbmcgYWxsIGFjdGlvbiBuYW1lIG9mIGNoYXJ0IGFuZCB0aGUgY29ycmVzcG9uZGluZyBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBwcm9wZXJ0eSBwYXRoXG5cdCAqL1xuXHRfZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwT2ZDaGFydChzQWN0aW9uTmFtZTogc3RyaW5nLCBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvQ29udGV4dDogYW55KSB7XG5cdFx0bGV0IG9SZXN1bHQgPSBDb21tb25IZWxwZXIuZ2V0QWN0aW9uUGF0aChvQ29udGV4dC5jb250ZXh0LCBmYWxzZSwgc0FjdGlvbk5hbWUsIHRydWUpO1xuXHRcdGlmIChvUmVzdWx0ID09PSBudWxsKSB7XG5cdFx0XHRvT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gdGhpcy5fYWRkVG9NYXAoc0FjdGlvbk5hbWUsIG51bGwsIG9PcGVyYXRpb25BdmFpbGFibGVNYXApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUmVzdWx0ID0gQ29tbW9uSGVscGVyLmdldEFjdGlvblBhdGgob0NvbnRleHQuY29udGV4dCwgZmFsc2UsIHNBY3Rpb25OYW1lKTtcblx0XHRcdGlmIChvUmVzdWx0LnNQcm9wZXJ0eSkge1xuXHRcdFx0XHRvT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gdGhpcy5fYWRkVG9NYXAoXG5cdFx0XHRcdFx0c0FjdGlvbk5hbWUsXG5cdFx0XHRcdFx0b1Jlc3VsdC5zUHJvcGVydHkuc3Vic3RyKG9SZXN1bHQuc0JpbmRpbmdQYXJhbWV0ZXIubGVuZ3RoICsgMSksXG5cdFx0XHRcdFx0b09wZXJhdGlvbkF2YWlsYWJsZU1hcFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb09wZXJhdGlvbkF2YWlsYWJsZU1hcDtcblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJuIE1hcC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9hZGRUb01hcFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0gc0tleSBLZXlcblx0ICogQHBhcmFtIG9WYWx1ZSBWYWx1ZVxuXHQgKiBAcGFyYW0gb01hcCBNYXAgb2JqZWN0XG5cdCAqIEByZXR1cm5zIE1hcCBvYmplY3Rcblx0ICovXG5cdF9hZGRUb01hcChzS2V5OiBzdHJpbmcsIG9WYWx1ZTogYW55LCBvTWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cdFx0aWYgKHNLZXkgJiYgb01hcCkge1xuXHRcdFx0b01hcFtzS2V5XSA9IG9WYWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIG9NYXA7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbkhlbHBlcjtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7RUFNQSxJQUFNQSxZQUFZLEdBQUc7SUFDcEI7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDQ0MsNkJBWG9CLFlBV1VDLFdBWFYsRUFXNEJDLFFBWDVCLEVBVzJDO01BQzlELElBQU1DLDJCQUFrQyxHQUFHLEVBQTNDO01BQ0EsSUFBSUMsV0FBSixFQUFpQkMsV0FBakIsRUFBOEJDLGVBQTlCLEVBQStDQyxx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