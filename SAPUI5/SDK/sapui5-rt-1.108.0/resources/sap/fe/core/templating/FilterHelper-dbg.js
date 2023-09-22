/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/ui/mdc/condition/Condition", "sap/ui/mdc/enum/ConditionValidated"], function (Log, Condition, ConditionValidated) {
  "use strict";

  var _exports = {};

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var aValidTypes = ["Edm.Boolean", "Edm.Byte", "Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.Decimal", "Edm.Double", "Edm.Float", "Edm.Guid", "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.SByte", "Edm.Single", "Edm.String", "Edm.Time", "Edm.TimeOfDay"];
  var oExcludeMap = {
    "Contains": "NotContains",
    "StartsWith": "NotStartsWith",
    "EndsWith": "NotEndsWith",
    "Empty": "NotEmpty",
    "NotEmpty": "Empty",
    "LE": "NOTLE",
    "GE": "NOTGE",
    "LT": "NOTLT",
    "GT": "NOTGT",
    "BT": "NOTBT",
    "NE": "EQ",
    "EQ": "NE"
  };

  function _getDateTimeOffsetCompliantValue(sValue) {
    var oValue;

    if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)) {
      oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)[0];
    } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)) {
      oValue = "".concat(sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0], "+0000");
    } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)) {
      oValue = "".concat(sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0], "T00:00:00+0000");
    } else if (sValue.indexOf("Z") === sValue.length - 1) {
      oValue = "".concat(sValue.split("Z")[0], "+0100");
    } else {
      oValue = undefined;
    }

    return oValue;
  }

  _exports._getDateTimeOffsetCompliantValue = _getDateTimeOffsetCompliantValue;

  function _getDateCompliantValue(sValue) {
    return sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/) ? sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] : sValue.match(/^(\d{8})/) && sValue.match(/^(\d{8})/)[0];
  }
  /**
   * Method to get the compliant value type based on the data type.
   *
   * @param  sValue Raw value
   * @param  sType The property type
   * @returns Value to be propagated to the condition.
   */


  _exports._getDateCompliantValue = _getDateCompliantValue;

  function getTypeCompliantValue(sValue, sType) {
    var oValue;

    if (aValidTypes.indexOf(sType) === -1) {
      return undefined;
    }

    oValue = sValue;

    switch (sType) {
      case "Edm.Boolean":
        oValue = sValue === "true" || (sValue === "false" ? false : undefined);
        break;

      case "Edm.Double":
      case "Edm.Single":
        oValue = isNaN(sValue) ? undefined : parseFloat(sValue);
        break;

      case "Edm.Byte":
      case "Edm.Int16":
      case "Edm.Int32":
      case "Edm.SByte":
        oValue = isNaN(sValue) ? undefined : parseInt(sValue, 10);
        break;

      case "Edm.Date":
        oValue = _getDateCompliantValue(sValue);
        break;

      case "Edm.DateTimeOffset":
        oValue = _getDateTimeOffsetCompliantValue(sValue);
        break;

      case "Edm.TimeOfDay":
        oValue = sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) ? sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] : undefined;
        break;

      default:
    }

    return oValue === null ? undefined : oValue;
  }
  /**
   * Method to create a condition.
   *
   * @param  sOption Operator to be used.
   * @param  oV1 Lower value
   * @param  oV2 Higher value
   * @param sSign
   * @returns Condition to be created
   */


  _exports.getTypeCompliantValue = getTypeCompliantValue;

  function resolveConditionValues(sOption, oV1, oV2, sSign) {
    var oValue = oV1,
        oValue2,
        sInternalOperation;
    var oCondition = {};
    oCondition.values = [];
    oCondition.isEmpty = null;

    if (oV1 === undefined || oV1 === null) {
      return;
    }

    switch (sOption) {
      case "CP":
        sInternalOperation = "Contains";

        if (oValue) {
          var nIndexOf = oValue.indexOf("*");
          var nLastIndex = oValue.lastIndexOf("*"); // only when there are '*' at all

          if (nIndexOf > -1) {
            if (nIndexOf === 0 && nLastIndex !== oValue.length - 1) {
              sInternalOperation = "EndsWith";
              oValue = oValue.substring(1, oValue.length);
            } else if (nIndexOf !== 0 && nLastIndex === oValue.length - 1) {
              sInternalOperation = "StartsWith";
              oValue = oValue.substring(0, oValue.length - 1);
            } else {
              oValue = oValue.substring(1, oValue.length - 1);
            }
          } else {
            Log.warning("Contains Option cannot be used without '*'.");
            return;
          }
        }

        break;

      case "EQ":
        sInternalOperation = oV1 === "" ? "Empty" : sOption;
        break;

      case "NE":
        sInternalOperation = oV1 === "" ? "NotEmpty" : sOption;
        break;

      case "BT":
        if (oV2 === undefined || oV2 === null) {
          return;
        }

        oValue2 = oV2;
        sInternalOperation = sOption;
        break;

      case "LE":
      case "GE":
      case "GT":
      case "LT":
        sInternalOperation = sOption;
        break;

      default:
        Log.warning("Selection Option is not supported : '".concat(sOption, "'"));
        return;
    }

    if (sSign === "E") {
      sInternalOperation = oExcludeMap[sInternalOperation];
    }

    oCondition.operator = sInternalOperation;

    if (sInternalOperation !== "Empty") {
      oCondition.values.push(oValue);

      if (oValue2) {
        oCondition.values.push(oValue2);
      }
    }

    return oCondition;
  }
  /* Method to get the Range property from the Selection Option */


  _exports.resolveConditionValues = resolveConditionValues;

  function getRangeProperty(sProperty) {
    return sProperty.indexOf("/") > 0 ? sProperty.split("/")[1] : sProperty;
  }

  _exports.getRangeProperty = getRangeProperty;

  function _buildConditionsFromSelectionRanges(Ranges, oProperty, sPropertyName, getCustomConditions) {
    var aConditions = [];
    Ranges === null || Ranges === void 0 ? void 0 : Ranges.forEach(function (Range) {
      var oCondition = getCustomConditions ? getCustomConditions(Range, oProperty, sPropertyName) : getConditions(Range, oProperty);

      if (oCondition) {
        aConditions.push(oCondition);
      }
    });
    return aConditions;
  }

  function _getProperty(propertyName, metaModel, entitySetPath) {
    var lastSlashIndex = propertyName.lastIndexOf("/");
    var navigationPath = lastSlashIndex > -1 ? propertyName.substring(0, propertyName.lastIndexOf("/") + 1) : "";
    var collection = metaModel.getObject("".concat(entitySetPath, "/").concat(navigationPath));
    return collection === null || collection === void 0 ? void 0 : collection[propertyName.replace(navigationPath, "")];
  }

  function _buildFiltersConditionsFromSelectOption(selectOption, metaModel, entitySetPath, getCustomConditions) {
    var propertyName = selectOption.PropertyName,
        filterConditions = {},
        propertyPath = propertyName.value || propertyName.$PropertyPath,
        Ranges = selectOption.Ranges;

    var targetProperty = _getProperty(propertyPath, metaModel, entitySetPath);

    if (targetProperty) {
      var conditions = _buildConditionsFromSelectionRanges(Ranges, targetProperty, propertyPath, getCustomConditions);

      if (conditions.length) {
        filterConditions[propertyPath] = (filterConditions[propertyPath] || []).concat(conditions);
      }
    }

    return filterConditions;
  }

  function getFiltersConditionsFromSelectionVariant(sEntitySetPath, oMetaModel, selectionVariant, getCustomConditions) {
    var oFilterConditions = {};

    if (!selectionVariant) {
      return oFilterConditions;
    }

    var aSelectOptions = selectionVariant.SelectOptions,
        aParameters = selectionVariant.Parameters;
    aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
      var propertyName = selectOption.PropertyName,
          sPropertyName = propertyName.value || propertyName.$PropertyPath;

      if (Object.keys(oFilterConditions).includes(sPropertyName)) {
        oFilterConditions[sPropertyName] = oFilterConditions[sPropertyName].concat(_buildFiltersConditionsFromSelectOption(selectOption, oMetaModel, sEntitySetPath, getCustomConditions)[sPropertyName]);
      } else {
        oFilterConditions = _objectSpread(_objectSpread({}, oFilterConditions), _buildFiltersConditionsFromSelectOption(selectOption, oMetaModel, sEntitySetPath, getCustomConditions));
      }
    });
    aParameters === null || aParameters === void 0 ? void 0 : aParameters.forEach(function (parameter) {
      var sPropertyPath = parameter.PropertyName.value || parameter.PropertyName.$PropertyPath;
      var oCondition = getCustomConditions ? {
        operator: "EQ",
        value1: parameter.PropertyValue,
        value2: null,
        path: sPropertyPath,
        isParameter: true
      } : {
        operator: "EQ",
        values: [parameter.PropertyValue],
        isEmpty: null,
        validated: ConditionValidated.Validated,
        isParameter: true
      };
      oFilterConditions[sPropertyPath] = [oCondition];
    });
    return oFilterConditions;
  }

  _exports.getFiltersConditionsFromSelectionVariant = getFiltersConditionsFromSelectionVariant;

  function getConditions(Range, oValidProperty) {
    var oCondition;
    var sign = Range.Sign ? getRangeProperty(Range.Sign) : undefined;
    var sOption = Range.Option ? getRangeProperty(Range.Option) : undefined;
    var oValue1 = getTypeCompliantValue(Range.Low, oValidProperty.$Type || oValidProperty.type);
    var oValue2 = Range.High ? getTypeCompliantValue(Range.High, oValidProperty.$Type || oValidProperty.type) : undefined;
    var oConditionValues = resolveConditionValues(sOption, oValue1, oValue2, sign);

    if (oConditionValues) {
      oCondition = Condition.createCondition(oConditionValues.operator, oConditionValues.values, null, null, ConditionValidated.Validated);
    }

    return oCondition;
  }

  _exports.getConditions = getConditions;

  var getDefaultValueFilters = function (oContext, properties) {
    var filterConditions = {};
    var entitySetPath = oContext.getInterface(1).getPath(),
        oMetaModel = oContext.getInterface(1).getModel();

    if (properties) {
      for (var key in properties) {
        var defaultFilterValue = oMetaModel.getObject("".concat(entitySetPath, "/").concat(key, "@com.sap.vocabularies.Common.v1.FilterDefaultValue"));

        if (defaultFilterValue !== undefined) {
          var PropertyName = key;
          filterConditions[PropertyName] = [Condition.createCondition("EQ", [defaultFilterValue], null, null, ConditionValidated.Validated)];
        }
      }
    }

    return filterConditions;
  };

  var getDefaultSemanticDateFilters = function (oContext, properties, defaultSemanticDates) {
    var filterConditions = {};
    var oInterface = oContext.getInterface(1);
    var oMetaModel = oInterface.getModel();
    var sEntityTypePath = oInterface.getPath();

    for (var key in defaultSemanticDates) {
      if (defaultSemanticDates[key][0]) {
        var aPropertyPathParts = key.split("::");
        var sPath = "";
        var iPropertyPathLength = aPropertyPathParts.length;
        var sNavigationPath = aPropertyPathParts.slice(0, aPropertyPathParts.length - 1).join("/");
        var sProperty = aPropertyPathParts[iPropertyPathLength - 1];

        if (sNavigationPath) {
          //Create Proper Condition Path e.g. _Item*/Property or _Item/Property
          var vProperty = oMetaModel.getObject(sEntityTypePath + "/" + sNavigationPath);

          if (vProperty.$kind === "NavigationProperty" && vProperty.$isCollection) {
            sPath += "".concat(sNavigationPath, "*/");
          } else if (vProperty.$kind === "NavigationProperty") {
            sPath += "".concat(sNavigationPath, "/");
          }
        }

        sPath += sProperty;
        var operatorParamsArr = "values" in defaultSemanticDates[key][0] ? defaultSemanticDates[key][0].values : [];
        filterConditions[sPath] = [Condition.createCondition(defaultSemanticDates[key][0].operator, operatorParamsArr, null, null, null)];
      }
    }

    return filterConditions;
  };

  function getEditStatusFilter() {
    var ofilterConditions = {};
    ofilterConditions["$editState"] = [Condition.createCondition("DRAFT_EDIT_STATE", ["ALL"], null, null, ConditionValidated.Validated)];
    return ofilterConditions;
  }

  function getFilterConditions(oContext, filterConditions) {
    var _filterConditions, _filterConditions2;

    var editStateFilter;
    var entitySetPath = oContext.getInterface(1).getPath(),
        oMetaModel = oContext.getInterface(1).getModel(),
        entityTypeAnnotations = oMetaModel.getObject("".concat(entitySetPath, "@")),
        entityTypeProperties = oMetaModel.getObject("".concat(entitySetPath, "/"));

    if (entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftRoot"] || entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftNode"]) {
      editStateFilter = getEditStatusFilter();
    }

    var selectionVariant = (_filterConditions = filterConditions) === null || _filterConditions === void 0 ? void 0 : _filterConditions.selectionVariant;
    var defaultSemanticDates = ((_filterConditions2 = filterConditions) === null || _filterConditions2 === void 0 ? void 0 : _filterConditions2.defaultSemanticDates) || {};
    var defaultFilters = getDefaultValueFilters(oContext, entityTypeProperties);
    var defaultSemanticDateFilters = getDefaultSemanticDateFilters(oContext, entityTypeProperties, defaultSemanticDates);

    if (selectionVariant) {
      filterConditions = getFiltersConditionsFromSelectionVariant(entitySetPath, oMetaModel, selectionVariant);
    } else if (defaultFilters) {
      filterConditions = defaultFilters;
    }

    if (defaultSemanticDateFilters) {
      // only for semantic date:
      // 1. value from manifest get merged with SV
      // 2. manifest value is given preference when there is same semantic date property in SV and manifest
      filterConditions = _objectSpread(_objectSpread({}, filterConditions), defaultSemanticDateFilters);
    }

    if (editStateFilter) {
      filterConditions = _objectSpread(_objectSpread({}, filterConditions), editStateFilter);
    }

    return Object.keys(filterConditions).length > 0 ? JSON.stringify(filterConditions).replace(/([\{\}])/g, "\\$1") : undefined;
  }

  _exports.getFilterConditions = getFilterConditions;
  getFilterConditions.requiresIContext = true;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhVmFsaWRUeXBlcyIsIm9FeGNsdWRlTWFwIiwiX2dldERhdGVUaW1lT2Zmc2V0Q29tcGxpYW50VmFsdWUiLCJzVmFsdWUiLCJvVmFsdWUiLCJtYXRjaCIsImluZGV4T2YiLCJsZW5ndGgiLCJzcGxpdCIsInVuZGVmaW5lZCIsIl9nZXREYXRlQ29tcGxpYW50VmFsdWUiLCJnZXRUeXBlQ29tcGxpYW50VmFsdWUiLCJzVHlwZSIsImlzTmFOIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwicmVzb2x2ZUNvbmRpdGlvblZhbHVlcyIsInNPcHRpb24iLCJvVjEiLCJvVjIiLCJzU2lnbiIsIm9WYWx1ZTIiLCJzSW50ZXJuYWxPcGVyYXRpb24iLCJvQ29uZGl0aW9uIiwidmFsdWVzIiwiaXNFbXB0eSIsIm5JbmRleE9mIiwibkxhc3RJbmRleCIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiTG9nIiwid2FybmluZyIsIm9wZXJhdG9yIiwicHVzaCIsImdldFJhbmdlUHJvcGVydHkiLCJzUHJvcGVydHkiLCJfYnVpbGRDb25kaXRpb25zRnJvbVNlbGVjdGlvblJhbmdlcyIsIlJhbmdlcyIsIm9Qcm9wZXJ0eSIsInNQcm9wZXJ0eU5hbWUiLCJnZXRDdXN0b21Db25kaXRpb25zIiwiYUNvbmRpdGlvbnMiLCJmb3JFYWNoIiwiUmFuZ2UiLCJnZXRDb25kaXRpb25zIiwiX2dldFByb3BlcnR5IiwicHJvcGVydHlOYW1lIiwibWV0YU1vZGVsIiwiZW50aXR5U2V0UGF0aCIsImxhc3RTbGFzaEluZGV4IiwibmF2aWdhdGlvblBhdGgiLCJjb2xsZWN0aW9uIiwiZ2V0T2JqZWN0IiwicmVwbGFjZSIsIl9idWlsZEZpbHRlcnNDb25kaXRpb25zRnJvbVNlbGVjdE9wdGlvbiIsInNlbGVjdE9wdGlvbiIsIlByb3BlcnR5TmFtZSIsImZpbHRlckNvbmRpdGlvbnMiLCJwcm9wZXJ0eVBhdGgiLCJ2YWx1ZSIsIiRQcm9wZXJ0eVBhdGgiLCJ0YXJnZXRQcm9wZXJ0eSIsImNvbmRpdGlvbnMiLCJjb25jYXQiLCJnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50Iiwic0VudGl0eVNldFBhdGgiLCJvTWV0YU1vZGVsIiwic2VsZWN0aW9uVmFyaWFudCIsIm9GaWx0ZXJDb25kaXRpb25zIiwiYVNlbGVjdE9wdGlvbnMiLCJTZWxlY3RPcHRpb25zIiwiYVBhcmFtZXRlcnMiLCJQYXJhbWV0ZXJzIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwicGFyYW1ldGVyIiwic1Byb3BlcnR5UGF0aCIsInZhbHVlMSIsIlByb3BlcnR5VmFsdWUiLCJ2YWx1ZTIiLCJwYXRoIiwiaXNQYXJhbWV0ZXIiLCJ2YWxpZGF0ZWQiLCJDb25kaXRpb25WYWxpZGF0ZWQiLCJWYWxpZGF0ZWQiLCJvVmFsaWRQcm9wZXJ0eSIsInNpZ24iLCJTaWduIiwiT3B0aW9uIiwib1ZhbHVlMSIsIkxvdyIsIiRUeXBlIiwidHlwZSIsIkhpZ2giLCJvQ29uZGl0aW9uVmFsdWVzIiwiQ29uZGl0aW9uIiwiY3JlYXRlQ29uZGl0aW9uIiwiZ2V0RGVmYXVsdFZhbHVlRmlsdGVycyIsIm9Db250ZXh0IiwicHJvcGVydGllcyIsImdldEludGVyZmFjZSIsImdldFBhdGgiLCJnZXRNb2RlbCIsImtleSIsImRlZmF1bHRGaWx0ZXJWYWx1ZSIsImdldERlZmF1bHRTZW1hbnRpY0RhdGVGaWx0ZXJzIiwiZGVmYXVsdFNlbWFudGljRGF0ZXMiLCJvSW50ZXJmYWNlIiwic0VudGl0eVR5cGVQYXRoIiwiYVByb3BlcnR5UGF0aFBhcnRzIiwic1BhdGgiLCJpUHJvcGVydHlQYXRoTGVuZ3RoIiwic05hdmlnYXRpb25QYXRoIiwic2xpY2UiLCJqb2luIiwidlByb3BlcnR5IiwiJGtpbmQiLCIkaXNDb2xsZWN0aW9uIiwib3BlcmF0b3JQYXJhbXNBcnIiLCJnZXRFZGl0U3RhdHVzRmlsdGVyIiwib2ZpbHRlckNvbmRpdGlvbnMiLCJnZXRGaWx0ZXJDb25kaXRpb25zIiwiZWRpdFN0YXRlRmlsdGVyIiwiZW50aXR5VHlwZUFubm90YXRpb25zIiwiZW50aXR5VHlwZVByb3BlcnRpZXMiLCJkZWZhdWx0RmlsdGVycyIsImRlZmF1bHRTZW1hbnRpY0RhdGVGaWx0ZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcXVpcmVzSUNvbnRleHQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkZpbHRlckhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNlbGVjdGlvblJhbmdlVHlwZVR5cGVzLCBTZWxlY3Rpb25WYXJpYW50VHlwZVR5cGVzLCBTZWxlY3RPcHRpb25UeXBlIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSB7IENvbmRpdGlvbk9iamVjdCB9IGZyb20gXCJzYXAvdWkvbWRjL2NvbmRpdGlvbi9Db25kaXRpb25cIjtcbmltcG9ydCBDb25kaXRpb24gZnJvbSBcInNhcC91aS9tZGMvY29uZGl0aW9uL0NvbmRpdGlvblwiO1xuaW1wb3J0IENvbmRpdGlvblZhbGlkYXRlZCBmcm9tIFwic2FwL3VpL21kYy9lbnVtL0NvbmRpdGlvblZhbGlkYXRlZFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuZXhwb3J0IHR5cGUgRmlsdGVyQ29uZGl0aW9ucyA9IHtcblx0b3BlcmF0b3I6IHN0cmluZztcblx0dmFsdWVzOiBBcnJheTxzdHJpbmc+O1xuXHRpc0VtcHR5PzogYm9vbGVhbiB8IG51bGw7XG5cdHZhbGlkYXRlZD86IHN0cmluZztcbn07XG5cbmNvbnN0IGFWYWxpZFR5cGVzID0gW1xuXHRcIkVkbS5Cb29sZWFuXCIsXG5cdFwiRWRtLkJ5dGVcIixcblx0XCJFZG0uRGF0ZVwiLFxuXHRcIkVkbS5EYXRlVGltZVwiLFxuXHRcIkVkbS5EYXRlVGltZU9mZnNldFwiLFxuXHRcIkVkbS5EZWNpbWFsXCIsXG5cdFwiRWRtLkRvdWJsZVwiLFxuXHRcIkVkbS5GbG9hdFwiLFxuXHRcIkVkbS5HdWlkXCIsXG5cdFwiRWRtLkludDE2XCIsXG5cdFwiRWRtLkludDMyXCIsXG5cdFwiRWRtLkludDY0XCIsXG5cdFwiRWRtLlNCeXRlXCIsXG5cdFwiRWRtLlNpbmdsZVwiLFxuXHRcIkVkbS5TdHJpbmdcIixcblx0XCJFZG0uVGltZVwiLFxuXHRcIkVkbS5UaW1lT2ZEYXlcIlxuXTtcblxuY29uc3Qgb0V4Y2x1ZGVNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG5cdFwiQ29udGFpbnNcIjogXCJOb3RDb250YWluc1wiLFxuXHRcIlN0YXJ0c1dpdGhcIjogXCJOb3RTdGFydHNXaXRoXCIsXG5cdFwiRW5kc1dpdGhcIjogXCJOb3RFbmRzV2l0aFwiLFxuXHRcIkVtcHR5XCI6IFwiTm90RW1wdHlcIixcblx0XCJOb3RFbXB0eVwiOiBcIkVtcHR5XCIsXG5cdFwiTEVcIjogXCJOT1RMRVwiLFxuXHRcIkdFXCI6IFwiTk9UR0VcIixcblx0XCJMVFwiOiBcIk5PVExUXCIsXG5cdFwiR1RcIjogXCJOT1RHVFwiLFxuXHRcIkJUXCI6IFwiTk9UQlRcIixcblx0XCJORVwiOiBcIkVRXCIsXG5cdFwiRVFcIjogXCJORVwiXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX2dldERhdGVUaW1lT2Zmc2V0Q29tcGxpYW50VmFsdWUoc1ZhbHVlOiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRsZXQgb1ZhbHVlO1xuXHRpZiAoc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pXFwrKFxcZHsxLDR9KS8pKSB7XG5cdFx0b1ZhbHVlID0gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pXFwrKFxcZHsxLDR9KS8pWzBdO1xuXHR9IGVsc2UgaWYgKHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KVQoXFxkezEsMn0pOihcXGR7MSwyfSk6KFxcZHsxLDJ9KS8pKSB7XG5cdFx0b1ZhbHVlID0gYCR7c1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLylbMF19KzAwMDBgO1xuXHR9IGVsc2UgaWYgKHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pKSB7XG5cdFx0b1ZhbHVlID0gYCR7c1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLylbMF19VDAwOjAwOjAwKzAwMDBgO1xuXHR9IGVsc2UgaWYgKHNWYWx1ZS5pbmRleE9mKFwiWlwiKSA9PT0gc1ZhbHVlLmxlbmd0aCAtIDEpIHtcblx0XHRvVmFsdWUgPSBgJHtzVmFsdWUuc3BsaXQoXCJaXCIpWzBdfSswMTAwYDtcblx0fSBlbHNlIHtcblx0XHRvVmFsdWUgPSB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIG9WYWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXREYXRlQ29tcGxpYW50VmFsdWUoc1ZhbHVlOiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLylcblx0XHQ/IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pWzBdXG5cdFx0OiBzVmFsdWUubWF0Y2goL14oXFxkezh9KS8pICYmIHNWYWx1ZS5tYXRjaCgvXihcXGR7OH0pLylbMF07XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIGdldCB0aGUgY29tcGxpYW50IHZhbHVlIHR5cGUgYmFzZWQgb24gdGhlIGRhdGEgdHlwZS5cbiAqXG4gKiBAcGFyYW0gIHNWYWx1ZSBSYXcgdmFsdWVcbiAqIEBwYXJhbSAgc1R5cGUgVGhlIHByb3BlcnR5IHR5cGVcbiAqIEByZXR1cm5zIFZhbHVlIHRvIGJlIHByb3BhZ2F0ZWQgdG8gdGhlIGNvbmRpdGlvbi5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZUNvbXBsaWFudFZhbHVlKHNWYWx1ZTogYW55LCBzVHlwZTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0bGV0IG9WYWx1ZTtcblx0aWYgKGFWYWxpZFR5cGVzLmluZGV4T2Yoc1R5cGUpID09PSAtMSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0b1ZhbHVlID0gc1ZhbHVlO1xuXHRzd2l0Y2ggKHNUeXBlKSB7XG5cdFx0Y2FzZSBcIkVkbS5Cb29sZWFuXCI6XG5cdFx0XHRvVmFsdWUgPSBzVmFsdWUgPT09IFwidHJ1ZVwiIHx8IChzVmFsdWUgPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogdW5kZWZpbmVkKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJFZG0uRG91YmxlXCI6XG5cdFx0Y2FzZSBcIkVkbS5TaW5nbGVcIjpcblx0XHRcdG9WYWx1ZSA9IGlzTmFOKHNWYWx1ZSkgPyB1bmRlZmluZWQgOiBwYXJzZUZsb2F0KHNWYWx1ZSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiRWRtLkJ5dGVcIjpcblx0XHRjYXNlIFwiRWRtLkludDE2XCI6XG5cdFx0Y2FzZSBcIkVkbS5JbnQzMlwiOlxuXHRcdGNhc2UgXCJFZG0uU0J5dGVcIjpcblx0XHRcdG9WYWx1ZSA9IGlzTmFOKHNWYWx1ZSkgPyB1bmRlZmluZWQgOiBwYXJzZUludChzVmFsdWUsIDEwKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJFZG0uRGF0ZVwiOlxuXHRcdFx0b1ZhbHVlID0gX2dldERhdGVDb21wbGlhbnRWYWx1ZShzVmFsdWUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkVkbS5EYXRlVGltZU9mZnNldFwiOlxuXHRcdFx0b1ZhbHVlID0gX2dldERhdGVUaW1lT2Zmc2V0Q29tcGxpYW50VmFsdWUoc1ZhbHVlKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJFZG0uVGltZU9mRGF5XCI6XG5cdFx0XHRvVmFsdWUgPSBzVmFsdWUubWF0Y2goLyhcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLykgPyBzVmFsdWUubWF0Y2goLyhcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLylbMF0gOiB1bmRlZmluZWQ7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHR9XG5cblx0cmV0dXJuIG9WYWx1ZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9WYWx1ZTtcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gY3JlYXRlIGEgY29uZGl0aW9uLlxuICpcbiAqIEBwYXJhbSAgc09wdGlvbiBPcGVyYXRvciB0byBiZSB1c2VkLlxuICogQHBhcmFtICBvVjEgTG93ZXIgdmFsdWVcbiAqIEBwYXJhbSAgb1YyIEhpZ2hlciB2YWx1ZVxuICogQHBhcmFtIHNTaWduXG4gKiBAcmV0dXJucyBDb25kaXRpb24gdG8gYmUgY3JlYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUNvbmRpdGlvblZhbHVlcyhzT3B0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQsIG9WMTogYW55LCBvVjI6IGFueSwgc1NpZ246IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuXHRsZXQgb1ZhbHVlID0gb1YxLFxuXHRcdG9WYWx1ZTIsXG5cdFx0c0ludGVybmFsT3BlcmF0aW9uOiBhbnk7XG5cdGNvbnN0IG9Db25kaXRpb246IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4gPSB7fTtcblx0b0NvbmRpdGlvbi52YWx1ZXMgPSBbXTtcblx0b0NvbmRpdGlvbi5pc0VtcHR5ID0gbnVsbCBhcyBhbnk7XG5cdGlmIChvVjEgPT09IHVuZGVmaW5lZCB8fCBvVjEgPT09IG51bGwpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzd2l0Y2ggKHNPcHRpb24pIHtcblx0XHRjYXNlIFwiQ1BcIjpcblx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IFwiQ29udGFpbnNcIjtcblx0XHRcdGlmIChvVmFsdWUpIHtcblx0XHRcdFx0Y29uc3QgbkluZGV4T2YgPSBvVmFsdWUuaW5kZXhPZihcIipcIik7XG5cdFx0XHRcdGNvbnN0IG5MYXN0SW5kZXggPSBvVmFsdWUubGFzdEluZGV4T2YoXCIqXCIpO1xuXG5cdFx0XHRcdC8vIG9ubHkgd2hlbiB0aGVyZSBhcmUgJyonIGF0IGFsbFxuXHRcdFx0XHRpZiAobkluZGV4T2YgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChuSW5kZXhPZiA9PT0gMCAmJiBuTGFzdEluZGV4ICE9PSBvVmFsdWUubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gXCJFbmRzV2l0aFwiO1xuXHRcdFx0XHRcdFx0b1ZhbHVlID0gb1ZhbHVlLnN1YnN0cmluZygxLCBvVmFsdWUubGVuZ3RoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG5JbmRleE9mICE9PSAwICYmIG5MYXN0SW5kZXggPT09IG9WYWx1ZS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBcIlN0YXJ0c1dpdGhcIjtcblx0XHRcdFx0XHRcdG9WYWx1ZSA9IG9WYWx1ZS5zdWJzdHJpbmcoMCwgb1ZhbHVlLmxlbmd0aCAtIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvVmFsdWUgPSBvVmFsdWUuc3Vic3RyaW5nKDEsIG9WYWx1ZS5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0TG9nLndhcm5pbmcoXCJDb250YWlucyBPcHRpb24gY2Fubm90IGJlIHVzZWQgd2l0aG91dCAnKicuXCIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkVRXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBvVjEgPT09IFwiXCIgPyBcIkVtcHR5XCIgOiBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIk5FXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBvVjEgPT09IFwiXCIgPyBcIk5vdEVtcHR5XCIgOiBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkJUXCI6XG5cdFx0XHRpZiAob1YyID09PSB1bmRlZmluZWQgfHwgb1YyID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdG9WYWx1ZTIgPSBvVjI7XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkxFXCI6XG5cdFx0Y2FzZSBcIkdFXCI6XG5cdFx0Y2FzZSBcIkdUXCI6XG5cdFx0Y2FzZSBcIkxUXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdExvZy53YXJuaW5nKGBTZWxlY3Rpb24gT3B0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgOiAnJHtzT3B0aW9ufSdgKTtcblx0XHRcdHJldHVybjtcblx0fVxuXHRpZiAoc1NpZ24gPT09IFwiRVwiKSB7XG5cdFx0c0ludGVybmFsT3BlcmF0aW9uID0gb0V4Y2x1ZGVNYXBbc0ludGVybmFsT3BlcmF0aW9uXTtcblx0fVxuXHRvQ29uZGl0aW9uLm9wZXJhdG9yID0gc0ludGVybmFsT3BlcmF0aW9uO1xuXHRpZiAoc0ludGVybmFsT3BlcmF0aW9uICE9PSBcIkVtcHR5XCIpIHtcblx0XHRvQ29uZGl0aW9uLnZhbHVlcy5wdXNoKG9WYWx1ZSk7XG5cdFx0aWYgKG9WYWx1ZTIpIHtcblx0XHRcdG9Db25kaXRpb24udmFsdWVzLnB1c2gob1ZhbHVlMik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvQ29uZGl0aW9uO1xufVxuXG4vKiBNZXRob2QgdG8gZ2V0IHRoZSBSYW5nZSBwcm9wZXJ0eSBmcm9tIHRoZSBTZWxlY3Rpb24gT3B0aW9uICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZ2VQcm9wZXJ0eShzUHJvcGVydHk6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBzUHJvcGVydHkuaW5kZXhPZihcIi9cIikgPiAwID8gc1Byb3BlcnR5LnNwbGl0KFwiL1wiKVsxXSA6IHNQcm9wZXJ0eTtcbn1cblxuZnVuY3Rpb24gX2J1aWxkQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25SYW5nZXMoXG5cdFJhbmdlczogU2VsZWN0aW9uUmFuZ2VUeXBlVHlwZXNbXSxcblx0b1Byb3BlcnR5OiBSZWNvcmQ8c3RyaW5nLCBvYmplY3Q+LFxuXHRzUHJvcGVydHlOYW1lOiBzdHJpbmcsXG5cdGdldEN1c3RvbUNvbmRpdGlvbnM/OiBGdW5jdGlvblxuKTogYW55W10ge1xuXHRjb25zdCBhQ29uZGl0aW9uczogYW55W10gPSBbXTtcblx0UmFuZ2VzPy5mb3JFYWNoKChSYW5nZTogYW55KSA9PiB7XG5cdFx0Y29uc3Qgb0NvbmRpdGlvbiA9IGdldEN1c3RvbUNvbmRpdGlvbnMgPyBnZXRDdXN0b21Db25kaXRpb25zKFJhbmdlLCBvUHJvcGVydHksIHNQcm9wZXJ0eU5hbWUpIDogZ2V0Q29uZGl0aW9ucyhSYW5nZSwgb1Byb3BlcnR5KTtcblx0XHRpZiAob0NvbmRpdGlvbikge1xuXHRcdFx0YUNvbmRpdGlvbnMucHVzaChvQ29uZGl0aW9uKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYUNvbmRpdGlvbnM7XG59XG5cbmZ1bmN0aW9uIF9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZywgbWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCwgZW50aXR5U2V0UGF0aDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgb2JqZWN0PiB7XG5cdGNvbnN0IGxhc3RTbGFzaEluZGV4ID0gcHJvcGVydHlOYW1lLmxhc3RJbmRleE9mKFwiL1wiKTtcblx0Y29uc3QgbmF2aWdhdGlvblBhdGggPSBsYXN0U2xhc2hJbmRleCA+IC0xID8gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCBwcm9wZXJ0eU5hbWUubGFzdEluZGV4T2YoXCIvXCIpICsgMSkgOiBcIlwiO1xuXHRjb25zdCBjb2xsZWN0aW9uID0gbWV0YU1vZGVsLmdldE9iamVjdChgJHtlbnRpdHlTZXRQYXRofS8ke25hdmlnYXRpb25QYXRofWApO1xuXHRyZXR1cm4gY29sbGVjdGlvbj8uW3Byb3BlcnR5TmFtZS5yZXBsYWNlKG5hdmlnYXRpb25QYXRoLCBcIlwiKV07XG59XG5cbmZ1bmN0aW9uIF9idWlsZEZpbHRlcnNDb25kaXRpb25zRnJvbVNlbGVjdE9wdGlvbihcblx0c2VsZWN0T3B0aW9uOiBTZWxlY3RPcHRpb25UeXBlLFxuXHRtZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLFxuXHRlbnRpdHlTZXRQYXRoOiBzdHJpbmcsXG5cdGdldEN1c3RvbUNvbmRpdGlvbnM/OiBGdW5jdGlvblxuKTogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiB7XG5cdGNvbnN0IHByb3BlcnR5TmFtZTogYW55ID0gc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZSxcblx0XHRmaWx0ZXJDb25kaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge30sXG5cdFx0cHJvcGVydHlQYXRoOiBzdHJpbmcgPSBwcm9wZXJ0eU5hbWUudmFsdWUgfHwgcHJvcGVydHlOYW1lLiRQcm9wZXJ0eVBhdGgsXG5cdFx0UmFuZ2VzOiBTZWxlY3Rpb25SYW5nZVR5cGVUeXBlc1tdID0gc2VsZWN0T3B0aW9uLlJhbmdlcztcblx0Y29uc3QgdGFyZ2V0UHJvcGVydHkgPSBfZ2V0UHJvcGVydHkocHJvcGVydHlQYXRoLCBtZXRhTW9kZWwsIGVudGl0eVNldFBhdGgpO1xuXHRpZiAodGFyZ2V0UHJvcGVydHkpIHtcblx0XHRjb25zdCBjb25kaXRpb25zOiBhbnlbXSA9IF9idWlsZENvbmRpdGlvbnNGcm9tU2VsZWN0aW9uUmFuZ2VzKFJhbmdlcywgdGFyZ2V0UHJvcGVydHksIHByb3BlcnR5UGF0aCwgZ2V0Q3VzdG9tQ29uZGl0aW9ucyk7XG5cdFx0aWYgKGNvbmRpdGlvbnMubGVuZ3RoKSB7XG5cdFx0XHRmaWx0ZXJDb25kaXRpb25zW3Byb3BlcnR5UGF0aF0gPSAoZmlsdGVyQ29uZGl0aW9uc1twcm9wZXJ0eVBhdGhdIHx8IFtdKS5jb25jYXQoY29uZGl0aW9ucyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmaWx0ZXJDb25kaXRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyc0NvbmRpdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudChcblx0c0VudGl0eVNldFBhdGg6IHN0cmluZyxcblx0b01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwsXG5cdHNlbGVjdGlvblZhcmlhbnQ6IFNlbGVjdGlvblZhcmlhbnRUeXBlVHlwZXMsXG5cdGdldEN1c3RvbUNvbmRpdGlvbnM/OiBGdW5jdGlvblxuKTogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiB7XG5cdGxldCBvRmlsdGVyQ29uZGl0aW9uczogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiA9IHt9O1xuXHRpZiAoIXNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRyZXR1cm4gb0ZpbHRlckNvbmRpdGlvbnM7XG5cdH1cblx0Y29uc3QgYVNlbGVjdE9wdGlvbnMgPSBzZWxlY3Rpb25WYXJpYW50LlNlbGVjdE9wdGlvbnMsXG5cdFx0YVBhcmFtZXRlcnMgPSBzZWxlY3Rpb25WYXJpYW50LlBhcmFtZXRlcnM7XG5cdGFTZWxlY3RPcHRpb25zPy5mb3JFYWNoKChzZWxlY3RPcHRpb246IFNlbGVjdE9wdGlvblR5cGUpID0+IHtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWU6IGFueSA9IHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWUsXG5cdFx0XHRzUHJvcGVydHlOYW1lOiBzdHJpbmcgPSBwcm9wZXJ0eU5hbWUudmFsdWUgfHwgcHJvcGVydHlOYW1lLiRQcm9wZXJ0eVBhdGg7XG5cdFx0aWYgKE9iamVjdC5rZXlzKG9GaWx0ZXJDb25kaXRpb25zKS5pbmNsdWRlcyhzUHJvcGVydHlOYW1lKSkge1xuXHRcdFx0b0ZpbHRlckNvbmRpdGlvbnNbc1Byb3BlcnR5TmFtZV0gPSBvRmlsdGVyQ29uZGl0aW9uc1tzUHJvcGVydHlOYW1lXS5jb25jYXQoXG5cdFx0XHRcdF9idWlsZEZpbHRlcnNDb25kaXRpb25zRnJvbVNlbGVjdE9wdGlvbihzZWxlY3RPcHRpb24sIG9NZXRhTW9kZWwsIHNFbnRpdHlTZXRQYXRoLCBnZXRDdXN0b21Db25kaXRpb25zKVtzUHJvcGVydHlOYW1lXVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b0ZpbHRlckNvbmRpdGlvbnMgPSB7XG5cdFx0XHRcdC4uLm9GaWx0ZXJDb25kaXRpb25zLFxuXHRcdFx0XHQuLi5fYnVpbGRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3RPcHRpb24oc2VsZWN0T3B0aW9uLCBvTWV0YU1vZGVsLCBzRW50aXR5U2V0UGF0aCwgZ2V0Q3VzdG9tQ29uZGl0aW9ucylcblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblx0YVBhcmFtZXRlcnM/LmZvckVhY2goKHBhcmFtZXRlcjogYW55KSA9PiB7XG5cdFx0Y29uc3Qgc1Byb3BlcnR5UGF0aCA9IHBhcmFtZXRlci5Qcm9wZXJ0eU5hbWUudmFsdWUgfHwgcGFyYW1ldGVyLlByb3BlcnR5TmFtZS4kUHJvcGVydHlQYXRoO1xuXHRcdGNvbnN0IG9Db25kaXRpb246IGFueSA9IGdldEN1c3RvbUNvbmRpdGlvbnNcblx0XHRcdD8geyBvcGVyYXRvcjogXCJFUVwiLCB2YWx1ZTE6IHBhcmFtZXRlci5Qcm9wZXJ0eVZhbHVlLCB2YWx1ZTI6IG51bGwsIHBhdGg6IHNQcm9wZXJ0eVBhdGgsIGlzUGFyYW1ldGVyOiB0cnVlIH1cblx0XHRcdDoge1xuXHRcdFx0XHRcdG9wZXJhdG9yOiBcIkVRXCIsXG5cdFx0XHRcdFx0dmFsdWVzOiBbcGFyYW1ldGVyLlByb3BlcnR5VmFsdWVdLFxuXHRcdFx0XHRcdGlzRW1wdHk6IG51bGwsXG5cdFx0XHRcdFx0dmFsaWRhdGVkOiBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkLFxuXHRcdFx0XHRcdGlzUGFyYW1ldGVyOiB0cnVlXG5cdFx0XHQgIH07XG5cdFx0b0ZpbHRlckNvbmRpdGlvbnNbc1Byb3BlcnR5UGF0aF0gPSBbb0NvbmRpdGlvbl07XG5cdH0pO1xuXG5cdHJldHVybiBvRmlsdGVyQ29uZGl0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmRpdGlvbnMoUmFuZ2U6IGFueSwgb1ZhbGlkUHJvcGVydHk6IGFueSk6IENvbmRpdGlvbk9iamVjdCB8IHVuZGVmaW5lZCB7XG5cdGxldCBvQ29uZGl0aW9uO1xuXHRjb25zdCBzaWduOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBSYW5nZS5TaWduID8gZ2V0UmFuZ2VQcm9wZXJ0eShSYW5nZS5TaWduKSA6IHVuZGVmaW5lZDtcblx0Y29uc3Qgc09wdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gUmFuZ2UuT3B0aW9uID8gZ2V0UmFuZ2VQcm9wZXJ0eShSYW5nZS5PcHRpb24pIDogdW5kZWZpbmVkO1xuXHRjb25zdCBvVmFsdWUxOiBhbnkgPSBnZXRUeXBlQ29tcGxpYW50VmFsdWUoUmFuZ2UuTG93LCBvVmFsaWRQcm9wZXJ0eS4kVHlwZSB8fCBvVmFsaWRQcm9wZXJ0eS50eXBlKTtcblx0Y29uc3Qgb1ZhbHVlMjogYW55ID0gUmFuZ2UuSGlnaCA/IGdldFR5cGVDb21wbGlhbnRWYWx1ZShSYW5nZS5IaWdoLCBvVmFsaWRQcm9wZXJ0eS4kVHlwZSB8fCBvVmFsaWRQcm9wZXJ0eS50eXBlKSA6IHVuZGVmaW5lZDtcblx0Y29uc3Qgb0NvbmRpdGlvblZhbHVlcyA9IHJlc29sdmVDb25kaXRpb25WYWx1ZXMoc09wdGlvbiwgb1ZhbHVlMSwgb1ZhbHVlMiwgc2lnbikgYXMgYW55O1xuXHRpZiAob0NvbmRpdGlvblZhbHVlcykge1xuXHRcdG9Db25kaXRpb24gPSBDb25kaXRpb24uY3JlYXRlQ29uZGl0aW9uKFxuXHRcdFx0b0NvbmRpdGlvblZhbHVlcy5vcGVyYXRvcixcblx0XHRcdG9Db25kaXRpb25WYWx1ZXMudmFsdWVzLFxuXHRcdFx0bnVsbCxcblx0XHRcdG51bGwsXG5cdFx0XHRDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkXG5cdFx0KTtcblx0fVxuXHRyZXR1cm4gb0NvbmRpdGlvbjtcbn1cblxuY29uc3QgZ2V0RGVmYXVsdFZhbHVlRmlsdGVycyA9IGZ1bmN0aW9uIChvQ29udGV4dDogYW55LCBwcm9wZXJ0aWVzOiBhbnkpOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3QgZmlsdGVyQ29uZGl0aW9uczogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiA9IHt9O1xuXHRjb25zdCBlbnRpdHlTZXRQYXRoID0gb0NvbnRleHQuZ2V0SW50ZXJmYWNlKDEpLmdldFBhdGgoKSxcblx0XHRvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0SW50ZXJmYWNlKDEpLmdldE1vZGVsKCk7XG5cdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gcHJvcGVydGllcykge1xuXHRcdFx0Y29uc3QgZGVmYXVsdEZpbHRlclZhbHVlID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7ZW50aXR5U2V0UGF0aH0vJHtrZXl9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWx0ZXJEZWZhdWx0VmFsdWVgKTtcblx0XHRcdGlmIChkZWZhdWx0RmlsdGVyVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb25zdCBQcm9wZXJ0eU5hbWUgPSBrZXk7XG5cdFx0XHRcdGZpbHRlckNvbmRpdGlvbnNbUHJvcGVydHlOYW1lXSA9IFtcblx0XHRcdFx0XHRDb25kaXRpb24uY3JlYXRlQ29uZGl0aW9uKFwiRVFcIiwgW2RlZmF1bHRGaWx0ZXJWYWx1ZV0sIG51bGwsIG51bGwsIENvbmRpdGlvblZhbGlkYXRlZC5WYWxpZGF0ZWQpIGFzIEZpbHRlckNvbmRpdGlvbnNcblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGZpbHRlckNvbmRpdGlvbnM7XG59O1xuXG5jb25zdCBnZXREZWZhdWx0U2VtYW50aWNEYXRlRmlsdGVycyA9IGZ1bmN0aW9uIChcblx0b0NvbnRleHQ6IGFueSxcblx0cHJvcGVydGllczogYW55LFxuXHRkZWZhdWx0U2VtYW50aWNEYXRlczogYW55XG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3QgZmlsdGVyQ29uZGl0aW9uczogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiA9IHt9O1xuXHRjb25zdCBvSW50ZXJmYWNlID0gb0NvbnRleHQuZ2V0SW50ZXJmYWNlKDEpO1xuXHRjb25zdCBvTWV0YU1vZGVsID0gb0ludGVyZmFjZS5nZXRNb2RlbCgpO1xuXHRjb25zdCBzRW50aXR5VHlwZVBhdGggPSBvSW50ZXJmYWNlLmdldFBhdGgoKTtcblx0Zm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNlbWFudGljRGF0ZXMpIHtcblx0XHRpZiAoZGVmYXVsdFNlbWFudGljRGF0ZXNba2V5XVswXSkge1xuXHRcdFx0Y29uc3QgYVByb3BlcnR5UGF0aFBhcnRzID0ga2V5LnNwbGl0KFwiOjpcIik7XG5cdFx0XHRsZXQgc1BhdGggPSBcIlwiO1xuXHRcdFx0Y29uc3QgaVByb3BlcnR5UGF0aExlbmd0aCA9IGFQcm9wZXJ0eVBhdGhQYXJ0cy5sZW5ndGg7XG5cdFx0XHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBhUHJvcGVydHlQYXRoUGFydHMuc2xpY2UoMCwgYVByb3BlcnR5UGF0aFBhcnRzLmxlbmd0aCAtIDEpLmpvaW4oXCIvXCIpO1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5ID0gYVByb3BlcnR5UGF0aFBhcnRzW2lQcm9wZXJ0eVBhdGhMZW5ndGggLSAxXTtcblx0XHRcdGlmIChzTmF2aWdhdGlvblBhdGgpIHtcblx0XHRcdFx0Ly9DcmVhdGUgUHJvcGVyIENvbmRpdGlvbiBQYXRoIGUuZy4gX0l0ZW0qL1Byb3BlcnR5IG9yIF9JdGVtL1Byb3BlcnR5XG5cdFx0XHRcdGNvbnN0IHZQcm9wZXJ0eSA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KHNFbnRpdHlUeXBlUGF0aCArIFwiL1wiICsgc05hdmlnYXRpb25QYXRoKTtcblx0XHRcdFx0aWYgKHZQcm9wZXJ0eS4ka2luZCA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJiB2UHJvcGVydHkuJGlzQ29sbGVjdGlvbikge1xuXHRcdFx0XHRcdHNQYXRoICs9IGAke3NOYXZpZ2F0aW9uUGF0aH0qL2A7XG5cdFx0XHRcdH0gZWxzZSBpZiAodlByb3BlcnR5LiRraW5kID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdFx0c1BhdGggKz0gYCR7c05hdmlnYXRpb25QYXRofS9gO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzUGF0aCArPSBzUHJvcGVydHk7XG5cdFx0XHRjb25zdCBvcGVyYXRvclBhcmFtc0FyciA9IFwidmFsdWVzXCIgaW4gZGVmYXVsdFNlbWFudGljRGF0ZXNba2V5XVswXSA/IGRlZmF1bHRTZW1hbnRpY0RhdGVzW2tleV1bMF0udmFsdWVzIDogW107XG5cdFx0XHRmaWx0ZXJDb25kaXRpb25zW3NQYXRoXSA9IFtcblx0XHRcdFx0Q29uZGl0aW9uLmNyZWF0ZUNvbmRpdGlvbihkZWZhdWx0U2VtYW50aWNEYXRlc1trZXldWzBdLm9wZXJhdG9yLCBvcGVyYXRvclBhcmFtc0FyciwgbnVsbCwgbnVsbCwgbnVsbCkgYXMgRmlsdGVyQ29uZGl0aW9uc1xuXHRcdFx0XTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZpbHRlckNvbmRpdGlvbnM7XG59O1xuXG5mdW5jdGlvbiBnZXRFZGl0U3RhdHVzRmlsdGVyKCk6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4ge1xuXHRjb25zdCBvZmlsdGVyQ29uZGl0aW9uczogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiA9IHt9O1xuXHRvZmlsdGVyQ29uZGl0aW9uc1tcIiRlZGl0U3RhdGVcIl0gPSBbXG5cdFx0Q29uZGl0aW9uLmNyZWF0ZUNvbmRpdGlvbihcIkRSQUZUX0VESVRfU1RBVEVcIiwgW1wiQUxMXCJdLCBudWxsLCBudWxsLCBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkKSBhcyBGaWx0ZXJDb25kaXRpb25zXG5cdF07XG5cdHJldHVybiBvZmlsdGVyQ29uZGl0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlckNvbmRpdGlvbnMob0NvbnRleHQ6IGFueSwgZmlsdGVyQ29uZGl0aW9uczogYW55KTogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiB7XG5cdGxldCBlZGl0U3RhdGVGaWx0ZXI7XG5cdGNvbnN0IGVudGl0eVNldFBhdGggPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0UGF0aCgpLFxuXHRcdG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0TW9kZWwoKSxcblx0XHRlbnRpdHlUeXBlQW5ub3RhdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtlbnRpdHlTZXRQYXRofUBgKSxcblx0XHRlbnRpdHlUeXBlUHJvcGVydGllcyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke2VudGl0eVNldFBhdGh9L2ApO1xuXHRpZiAoXG5cdFx0ZW50aXR5VHlwZUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdFJvb3RcIl0gfHxcblx0XHRlbnRpdHlUeXBlQW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Tm9kZVwiXVxuXHQpIHtcblx0XHRlZGl0U3RhdGVGaWx0ZXIgPSBnZXRFZGl0U3RhdHVzRmlsdGVyKCk7XG5cdH1cblx0Y29uc3Qgc2VsZWN0aW9uVmFyaWFudCA9IGZpbHRlckNvbmRpdGlvbnM/LnNlbGVjdGlvblZhcmlhbnQ7XG5cdGNvbnN0IGRlZmF1bHRTZW1hbnRpY0RhdGVzID0gZmlsdGVyQ29uZGl0aW9ucz8uZGVmYXVsdFNlbWFudGljRGF0ZXMgfHwge307XG5cdGNvbnN0IGRlZmF1bHRGaWx0ZXJzID0gZ2V0RGVmYXVsdFZhbHVlRmlsdGVycyhvQ29udGV4dCwgZW50aXR5VHlwZVByb3BlcnRpZXMpO1xuXHRjb25zdCBkZWZhdWx0U2VtYW50aWNEYXRlRmlsdGVycyA9IGdldERlZmF1bHRTZW1hbnRpY0RhdGVGaWx0ZXJzKG9Db250ZXh0LCBlbnRpdHlUeXBlUHJvcGVydGllcywgZGVmYXVsdFNlbWFudGljRGF0ZXMpO1xuXHRpZiAoc2VsZWN0aW9uVmFyaWFudCkge1xuXHRcdGZpbHRlckNvbmRpdGlvbnMgPSBnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50KGVudGl0eVNldFBhdGgsIG9NZXRhTW9kZWwsIHNlbGVjdGlvblZhcmlhbnQpO1xuXHR9IGVsc2UgaWYgKGRlZmF1bHRGaWx0ZXJzKSB7XG5cdFx0ZmlsdGVyQ29uZGl0aW9ucyA9IGRlZmF1bHRGaWx0ZXJzO1xuXHR9XG5cdGlmIChkZWZhdWx0U2VtYW50aWNEYXRlRmlsdGVycykge1xuXHRcdC8vIG9ubHkgZm9yIHNlbWFudGljIGRhdGU6XG5cdFx0Ly8gMS4gdmFsdWUgZnJvbSBtYW5pZmVzdCBnZXQgbWVyZ2VkIHdpdGggU1Zcblx0XHQvLyAyLiBtYW5pZmVzdCB2YWx1ZSBpcyBnaXZlbiBwcmVmZXJlbmNlIHdoZW4gdGhlcmUgaXMgc2FtZSBzZW1hbnRpYyBkYXRlIHByb3BlcnR5IGluIFNWIGFuZCBtYW5pZmVzdFxuXHRcdGZpbHRlckNvbmRpdGlvbnMgPSB7IC4uLmZpbHRlckNvbmRpdGlvbnMsIC4uLmRlZmF1bHRTZW1hbnRpY0RhdGVGaWx0ZXJzIH07XG5cdH1cblx0aWYgKGVkaXRTdGF0ZUZpbHRlcikge1xuXHRcdGZpbHRlckNvbmRpdGlvbnMgPSB7IC4uLmZpbHRlckNvbmRpdGlvbnMsIC4uLmVkaXRTdGF0ZUZpbHRlciB9O1xuXHR9XG5cdHJldHVybiAoT2JqZWN0LmtleXMoZmlsdGVyQ29uZGl0aW9ucykubGVuZ3RoID4gMCA/IEpTT04uc3RyaW5naWZ5KGZpbHRlckNvbmRpdGlvbnMpLnJlcGxhY2UoLyhbXFx7XFx9XSkvZywgXCJcXFxcJDFcIikgOiB1bmRlZmluZWQpIGFzIGFueTtcbn1cblxuZ2V0RmlsdGVyQ29uZGl0aW9ucy5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0VBYUEsSUFBTUEsV0FBVyxHQUFHLENBQ25CLGFBRG1CLEVBRW5CLFVBRm1CLEVBR25CLFVBSG1CLEVBSW5CLGNBSm1CLEVBS25CLG9CQUxtQixFQU1uQixhQU5tQixFQU9uQixZQVBtQixFQVFuQixXQVJtQixFQVNuQixVQVRtQixFQVVuQixXQVZtQixFQVduQixXQVhtQixFQVluQixXQVptQixFQWFuQixXQWJtQixFQWNuQixZQWRtQixFQWVuQixZQWZtQixFQWdCbkIsVUFoQm1CLEVBaUJuQixlQWpCbUIsQ0FBcEI7RUFvQkEsSUFBTUMsV0FBZ0MsR0FBRztJQUN4QyxZQUFZLGFBRDRCO0lBRXhDLGNBQWMsZUFGMEI7SUFHeEMsWUFBWSxhQUg0QjtJQUl4QyxTQUFTLFVBSitCO0lBS3hDLFlBQVksT0FMNEI7SUFNeEMsTUFBTSxPQU5rQztJQU94QyxNQUFNLE9BUGtDO0lBUXhDLE1BQU0sT0FSa0M7SUFTeEMsTUFBTSxPQVRrQztJQVV4QyxNQUFNLE9BVmtDO0lBV3hDLE1BQU0sSUFYa0M7SUFZeEMsTUFBTTtFQVprQyxDQUF6Qzs7RUFlTyxTQUFTQyxnQ0FBVCxDQUEwQ0MsTUFBMUMsRUFBMkU7SUFDakYsSUFBSUMsTUFBSjs7SUFDQSxJQUFJRCxNQUFNLENBQUNFLEtBQVAsQ0FBYSx1RUFBYixDQUFKLEVBQTJGO01BQzFGRCxNQUFNLEdBQUdELE1BQU0sQ0FBQ0UsS0FBUCxDQUFhLHVFQUFiLEVBQXNGLENBQXRGLENBQVQ7SUFDQSxDQUZELE1BRU8sSUFBSUYsTUFBTSxDQUFD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