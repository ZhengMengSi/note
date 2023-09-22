/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/ValueFormatter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/templating/UIFormatters", "sap/ui/model/odata/v4/AnnotationHelper"], function (valueFormatters, BindingToolkit, DataModelPathHelper, PropertyHelper, UIFormatters, AnnotationHelper) {
  "use strict";

  var _exports = {};
  var getDisplayMode = UIFormatters.getDisplayMode;
  var getBindingWithUnitOrCurrency = UIFormatters.getBindingWithUnitOrCurrency;
  var getBindingWithTimezone = UIFormatters.getBindingWithTimezone;
  var formatWithTypeInformation = UIFormatters.formatWithTypeInformation;
  var EDM_TYPE_MAPPING = UIFormatters.EDM_TYPE_MAPPING;
  var isProperty = PropertyHelper.isProperty;
  var hasStaticPercentUnit = PropertyHelper.hasStaticPercentUnit;
  var getRelativePaths = DataModelPathHelper.getRelativePaths;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var unresolveableExpression = BindingToolkit.unresolveableExpression;
  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var compileExpression = BindingToolkit.compileExpression;

  var getDataPointTargetExpression = function (oDataModelPath) {
    return oDataModelPath !== null && oDataModelPath !== void 0 && oDataModelPath.TargetValue ? getExpressionFromAnnotation(oDataModelPath.TargetValue) : unresolveableExpression;
  };

  var oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");

  var buildExpressionForProgressIndicatorDisplayValue = function (oPropertyDataModelObjectPath) {
    var _oPropertyDataModelOb;

    var fieldValue = (oPropertyDataModelObjectPath === null || oPropertyDataModelObjectPath === void 0 ? void 0 : (_oPropertyDataModelOb = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb === void 0 ? void 0 : _oPropertyDataModelOb.Value) || "";
    var relativeLocation = getRelativePaths(oPropertyDataModelObjectPath);
    var fieldValueExpression = getExpressionFromAnnotation(fieldValue, relativeLocation);
    var TargetExpression = getDataPointTargetExpression(oPropertyDataModelObjectPath.targetObject);

    if (fieldValueExpression && TargetExpression) {
      var _targetObject$annotat, _targetObject$annotat2, _targetObject$annotat3, _targetObject$annotat4;

      var targetObject = oPropertyDataModelObjectPath.targetObject.Value;

      if (!isProperty(targetObject)) {
        targetObject = oPropertyDataModelObjectPath.targetObject.Value.$target;
      }

      var unit = ((_targetObject$annotat = targetObject.annotations) === null || _targetObject$annotat === void 0 ? void 0 : (_targetObject$annotat2 = _targetObject$annotat.Measures) === null || _targetObject$annotat2 === void 0 ? void 0 : _targetObject$annotat2.Unit) || ((_targetObject$annotat3 = targetObject.annotations) === null || _targetObject$annotat3 === void 0 ? void 0 : (_targetObject$annotat4 = _targetObject$annotat3.Measures) === null || _targetObject$annotat4 === void 0 ? void 0 : _targetObject$annotat4.ISOCurrency);

      if (!unit) {
        return oResourceModel.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [compileExpression(fieldValueExpression), compileExpression(TargetExpression)]);
      } // If the unit isn't a path, we check for a % sign as it is a special case.


      if (hasStaticPercentUnit(fieldValue === null || fieldValue === void 0 ? void 0 : fieldValue.$target)) {
        return "".concat(compileExpression(fieldValueExpression), " %");
      }

      fieldValueExpression = formatWithTypeInformation(targetObject, fieldValueExpression);
      var unitBindingExpression = unit.$target ? formatWithTypeInformation(unit.$target, getExpressionFromAnnotation(unit, relativeLocation)) : getExpressionFromAnnotation(unit, relativeLocation);
      return compileExpression(formatResult([fieldValueExpression, TargetExpression, unitBindingExpression], valueFormatters.formatProgressIndicatorText));
    }

    return undefined;
  };

  _exports.buildExpressionForProgressIndicatorDisplayValue = buildExpressionForProgressIndicatorDisplayValue;

  var buildUnitBindingExpression = function (dataPoint) {
    var _dataPoint$targetObje, _dataPoint$targetObje2, _targetObject$annotat5, _targetObject$annotat6, _targetObject$annotat7, _targetObject$annotat8;

    var relativeLocation = getRelativePaths(dataPoint);
    var targetObject = dataPoint === null || dataPoint === void 0 ? void 0 : (_dataPoint$targetObje = dataPoint.targetObject) === null || _dataPoint$targetObje === void 0 ? void 0 : (_dataPoint$targetObje2 = _dataPoint$targetObje.Value) === null || _dataPoint$targetObje2 === void 0 ? void 0 : _dataPoint$targetObje2.$target;

    if (!isProperty(targetObject)) {
      return "";
    }

    var unit = ((_targetObject$annotat5 = targetObject.annotations) === null || _targetObject$annotat5 === void 0 ? void 0 : (_targetObject$annotat6 = _targetObject$annotat5.Measures) === null || _targetObject$annotat6 === void 0 ? void 0 : _targetObject$annotat6.Unit) || ((_targetObject$annotat7 = targetObject.annotations) === null || _targetObject$annotat7 === void 0 ? void 0 : (_targetObject$annotat8 = _targetObject$annotat7.Measures) === null || _targetObject$annotat8 === void 0 ? void 0 : _targetObject$annotat8.ISOCurrency);
    return unit ? compileExpression(getExpressionFromAnnotation(unit, relativeLocation)) : "";
  };

  _exports.buildUnitBindingExpression = buildUnitBindingExpression;

  var buildRatingIndicatorSubtitleExpression = function (oContext, mSampleSize) {
    if (mSampleSize) {
      return formatRatingIndicatorSubTitle(AnnotationHelper.value(mSampleSize, {
        context: oContext
      }));
    }
  }; // returns the text for the Rating Indicator Subtitle (e.g. '7 reviews')


  var formatRatingIndicatorSubTitle = function (iSampleSizeValue) {
    if (iSampleSizeValue) {
      var sSubTitleLabel = iSampleSizeValue > 1 ? oResourceModel.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE_LABEL_PLURAL") : oResourceModel.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE_LABEL");
      return oResourceModel.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE", [String(iSampleSizeValue), sSubTitleLabel]);
    }
  };
  /**
   * This function is used to get the header text of rating indicator.
   *
   * @param oContext
   * @param oDataPoint
   * @function param {object} oContext context of interface
   * param {object} oDataPoint data point object
   * @returns Expression binding for rating indicator text
   */


  var getHeaderRatingIndicatorText = function (oContext, oDataPoint) {
    if (oDataPoint && oDataPoint.SampleSize) {
      return buildRatingIndicatorSubtitleExpression(oContext, oDataPoint.SampleSize);
    } else if (oDataPoint && oDataPoint.Description) {
      var sModelValue = AnnotationHelper.value(oDataPoint.Description, {
        context: oContext
      });
      return "${path:" + sModelValue + "}";
    }
  };

  getHeaderRatingIndicatorText.requiresIContext = true;
  _exports.getHeaderRatingIndicatorText = getHeaderRatingIndicatorText;

  var buildExpressionForDescription = function (fieldValue) {
    var _fieldValue$targetObj, _fieldValue$targetObj2, _fieldValue$targetObj3;

    var relativeLocation = getRelativePaths(fieldValue);

    if (fieldValue !== null && fieldValue !== void 0 && (_fieldValue$targetObj = fieldValue.targetObject) !== null && _fieldValue$targetObj !== void 0 && (_fieldValue$targetObj2 = _fieldValue$targetObj.annotations) !== null && _fieldValue$targetObj2 !== void 0 && (_fieldValue$targetObj3 = _fieldValue$targetObj2.Common) !== null && _fieldValue$targetObj3 !== void 0 && _fieldValue$targetObj3.Text) {
      var _fieldValue$targetObj4, _fieldValue$targetObj5;

      var oTextExpression = getExpressionFromAnnotation(fieldValue === null || fieldValue === void 0 ? void 0 : (_fieldValue$targetObj4 = fieldValue.targetObject.annotations) === null || _fieldValue$targetObj4 === void 0 ? void 0 : (_fieldValue$targetObj5 = _fieldValue$targetObj4.Common) === null || _fieldValue$targetObj5 === void 0 ? void 0 : _fieldValue$targetObj5.Text, relativeLocation);

      if (isPathInModelExpression(oTextExpression)) {
        oTextExpression.parameters = {
          "$$noPatch": true
        };
      }

      return oTextExpression;
    }

    return undefined;
  };

  var getDecimalFormat = function (outExpression, fieldValue, sNumberOfFractionalDigits) {
    if (!outExpression.constraints) {
      outExpression.constraints = {};
    }

    outExpression.constraints = Object.assign(outExpression.constraints, {
      precision: fieldValue.$target.precision,
      scale: sNumberOfFractionalDigits ? sNumberOfFractionalDigits : fieldValue.$target.scale
    }); // sNumberOfFractionalDigits is only defined in getValueFormatted when NumberOfFractionalDigits is defined.
    // In that case, we need to instance the preserveDecimals parameter because of a change MDC side

    if (sNumberOfFractionalDigits) {
      if (!outExpression.formatOptions) {
        outExpression.formatOptions = {};
      }

      outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
        preserveDecimals: false
      });
    }

    return outExpression;
  };

  var getValueFormatted = function (oPropertyDataModelPath, fieldValue, sPropertyType, sNumberOfFractionalDigits) {
    var _fieldValue$path;

    var outExpression;
    var relativeLocation = (fieldValue === null || fieldValue === void 0 ? void 0 : (_fieldValue$path = fieldValue.path) === null || _fieldValue$path === void 0 ? void 0 : _fieldValue$path.indexOf("/")) === -1 ? getRelativePaths(oPropertyDataModelPath) : [];
    outExpression = getExpressionFromAnnotation(fieldValue, relativeLocation);
    var oPropertyDefinition = oPropertyDataModelPath.targetObject;

    if (sPropertyType && isPathInModelExpression(outExpression)) {
      var _EDM_TYPE_MAPPING$sPr;

      formatWithTypeInformation(oPropertyDefinition, outExpression);
      outExpression.type = (_EDM_TYPE_MAPPING$sPr = EDM_TYPE_MAPPING[sPropertyType]) === null || _EDM_TYPE_MAPPING$sPr === void 0 ? void 0 : _EDM_TYPE_MAPPING$sPr.type;

      switch (sPropertyType) {
        case "Edm.Decimal":
          // for the listReport, the decimal fields are formatted by returning a string
          // for the facets of the OP, the decimal fields are formatted by returning a promise, so we manage all the cases
          outExpression = getDecimalFormat(outExpression, fieldValue, sNumberOfFractionalDigits);
          break;

        default:
      }
    }

    return outExpression;
  };

  var buildFieldBindingExpression = function (oDataModelPath, dataPointFormatOptions, bHideMeasure) {
    var _oDataPointValue$$tar, _oPropertyDataModelOb2, _oPropertyDataModelOb3, _oPropertyDataModelOb4;

    var oDataPoint = oDataModelPath.targetObject;
    var oDataPointValue = (oDataPoint === null || oDataPoint === void 0 ? void 0 : oDataPoint.Value) || "";
    var sPropertyType = oDataPointValue === null || oDataPointValue === void 0 ? void 0 : (_oDataPointValue$$tar = oDataPointValue.$target) === null || _oDataPointValue$$tar === void 0 ? void 0 : _oDataPointValue$$tar.type;
    var sNumberOfFractionalDigits;

    if (sPropertyType === "Edm.Decimal" && oDataPoint.ValueFormat) {
      if (oDataPoint.ValueFormat.NumberOfFractionalDigits) {
        sNumberOfFractionalDigits = oDataPoint.ValueFormat.NumberOfFractionalDigits;
      }
    }

    var oPropertyDataModelObjectPath = enhanceDataModelPath(oDataModelPath, oDataPointValue.path);
    var oDescription = oPropertyDataModelObjectPath ? buildExpressionForDescription(oPropertyDataModelObjectPath) : undefined;
    var oFormattedValue = getValueFormatted(oPropertyDataModelObjectPath, oDataPointValue, sPropertyType, sNumberOfFractionalDigits);
    var sDisplayMode = oDescription ? dataPointFormatOptions.displayMode || getDisplayMode(oPropertyDataModelObjectPath) : "Value";
    var oBindingExpression;

    switch (sDisplayMode) {
      case "Description":
        oBindingExpression = oDescription;
        break;

      case "ValueDescription":
        oBindingExpression = formatResult([oFormattedValue, oDescription], valueFormatters.formatWithBrackets);
        break;

      case "DescriptionValue":
        oBindingExpression = formatResult([oDescription, oFormattedValue], valueFormatters.formatWithBrackets);
        break;

      default:
        if ((_oPropertyDataModelOb2 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb2 !== void 0 && (_oPropertyDataModelOb3 = _oPropertyDataModelOb2.annotations) !== null && _oPropertyDataModelOb3 !== void 0 && (_oPropertyDataModelOb4 = _oPropertyDataModelOb3.Common) !== null && _oPropertyDataModelOb4 !== void 0 && _oPropertyDataModelOb4.Timezone) {
          oBindingExpression = getBindingWithTimezone(oPropertyDataModelObjectPath, oFormattedValue);
        } else {
          oBindingExpression = _computeBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oFormattedValue, bHideMeasure || (dataPointFormatOptions === null || dataPointFormatOptions === void 0 ? void 0 : dataPointFormatOptions.measureDisplayMode) === "Hidden");
        }

    }

    return compileExpression(oBindingExpression);
  };

  _exports.buildFieldBindingExpression = buildFieldBindingExpression;

  var _computeBindingWithUnitOrCurrency = function (propertyDataModelObjectPath, formattedValue, hideMeasure) {
    var _propertyDataModelObj, _propertyDataModelObj2, _propertyDataModelObj3, _propertyDataModelObj4, _propertyDataModelObj5, _propertyDataModelObj6;

    if ((_propertyDataModelObj = propertyDataModelObjectPath.targetObject) !== null && _propertyDataModelObj !== void 0 && (_propertyDataModelObj2 = _propertyDataModelObj.annotations) !== null && _propertyDataModelObj2 !== void 0 && (_propertyDataModelObj3 = _propertyDataModelObj2.Measures) !== null && _propertyDataModelObj3 !== void 0 && _propertyDataModelObj3.Unit || (_propertyDataModelObj4 = propertyDataModelObjectPath.targetObject) !== null && _propertyDataModelObj4 !== void 0 && (_propertyDataModelObj5 = _propertyDataModelObj4.annotations) !== null && _propertyDataModelObj5 !== void 0 && (_propertyDataModelObj6 = _propertyDataModelObj5.Measures) !== null && _propertyDataModelObj6 !== void 0 && _propertyDataModelObj6.ISOCurrency) {
      if (hideMeasure && hasStaticPercentUnit(propertyDataModelObjectPath.targetObject)) {
        return formattedValue;
      }

      return getBindingWithUnitOrCurrency(propertyDataModelObjectPath, formattedValue, undefined, hideMeasure ? {
        showMeasure: false
      } : undefined);
    }

    return formattedValue;
  };
  /**
   * Method to calculate the percentage value of Progress Indicator. Basic formula is Value/Target * 100.
   *
   * @param oPropertyDataModelObjectPath
   * @returns The expression binding used to calculate the percentage value, which is shown in the progress indicator based on the formula given above.
   */


  _exports._computeBindingWithUnitOrCurrency = _computeBindingWithUnitOrCurrency;

  var buildExpressionForProgressIndicatorPercentValue = function (oPropertyDataModelObjectPath) {
    var _oPropertyDataModelOb5, _oPropertyDefinition$, _oPropertyDefinition$2, _oPropertyDefinition$3, _oPropertyDefinition$4;

    var fieldValue = (oPropertyDataModelObjectPath === null || oPropertyDataModelObjectPath === void 0 ? void 0 : (_oPropertyDataModelOb5 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb5 === void 0 ? void 0 : _oPropertyDataModelOb5.Value) || "";
    var relativeLocation = getRelativePaths(oPropertyDataModelObjectPath);
    var fieldValueExpression = getExpressionFromAnnotation(fieldValue, relativeLocation);
    var TargetExpression = getDataPointTargetExpression(oPropertyDataModelObjectPath.targetObject);
    var oPropertyDefinition = fieldValue.$target;
    var unit = ((_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Measures) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.Unit) || ((_oPropertyDefinition$3 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$3 === void 0 ? void 0 : (_oPropertyDefinition$4 = _oPropertyDefinition$3.Measures) === null || _oPropertyDefinition$4 === void 0 ? void 0 : _oPropertyDefinition$4.ISOCurrency);

    if (unit) {
      var unitBindingExpression = unit.$target ? formatWithTypeInformation(unit.$target, getExpressionFromAnnotation(unit, relativeLocation)) : getExpressionFromAnnotation(unit, relativeLocation);
      return compileExpression(formatResult([fieldValueExpression, TargetExpression, unitBindingExpression], valueFormatters.computePercentage));
    }

    return compileExpression(formatResult([fieldValueExpression, TargetExpression, ""], valueFormatters.computePercentage));
  };

  _exports.buildExpressionForProgressIndicatorPercentValue = buildExpressionForProgressIndicatorPercentValue;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXREYXRhUG9pbnRUYXJnZXRFeHByZXNzaW9uIiwib0RhdGFNb2RlbFBhdGgiLCJUYXJnZXRWYWx1ZSIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsInVucmVzb2x2ZWFibGVFeHByZXNzaW9uIiwib1Jlc291cmNlTW9kZWwiLCJzYXAiLCJ1aSIsImdldENvcmUiLCJnZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUiLCJidWlsZEV4cHJlc3Npb25Gb3JQcm9ncmVzc0luZGljYXRvckRpc3BsYXlWYWx1ZSIsIm9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgiLCJmaWVsZFZhbHVlIiwidGFyZ2V0T2JqZWN0IiwiVmFsdWUiLCJyZWxhdGl2ZUxvY2F0aW9uIiwiZ2V0UmVsYXRpdmVQYXRocyIsImZpZWxkVmFsdWVFeHByZXNzaW9uIiwiVGFyZ2V0RXhwcmVzc2lvbiIsImlzUHJvcGVydHkiLCIkdGFyZ2V0IiwidW5pdCIsImFubm90YXRpb25zIiwiTWVhc3VyZXMiLCJVbml0IiwiSVNPQ3VycmVuY3kiLCJnZXRUZXh0IiwiY29tcGlsZUV4cHJlc3Npb24iLCJoYXNTdGF0aWNQZXJjZW50VW5pdCIsImZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24iLCJ1bml0QmluZGluZ0V4cHJlc3Npb24iLCJmb3JtYXRSZXN1bHQiLCJ2YWx1ZUZvcm1hdHRlcnMiLCJmb3JtYXRQcm9ncmVzc0luZGljYXRvclRleHQiLCJ1bmRlZmluZWQiLCJidWlsZFVuaXRCaW5kaW5nRXhwcmVzc2lvbiIsImRhdGFQb2ludCIsImJ1aWxkUmF0aW5nSW5kaWNhdG9yU3VidGl0bGVFeHByZXNzaW9uIiwib0NvbnRleHQiLCJtU2FtcGxlU2l6ZSIsImZvcm1hdFJhdGluZ0luZGljYXRvclN1YlRpdGxlIiwiQW5ub3RhdGlvbkhlbHBlciIsInZhbHVlIiwiY29udGV4dCIsImlTYW1wbGVTaXplVmFsdWUiLCJzU3ViVGl0bGVMYWJlbCIsIlN0cmluZyIsImdldEhlYWRlclJhdGluZ0luZGljYXRvclRleHQiLCJvRGF0YVBvaW50IiwiU2FtcGxlU2l6ZSIsIkRlc2NyaXB0aW9uIiwic01vZGVsVmFsdWUiLCJyZXF1aXJlc0lDb250ZXh0IiwiYnVpbGRFeHByZXNzaW9uRm9yRGVzY3JpcHRpb24iLCJDb21tb24iLCJUZXh0Iiwib1RleHRFeHByZXNzaW9uIiwiaXNQYXRoSW5Nb2RlbEV4cHJlc3Npb24iLCJwYXJhbWV0ZXJzIiwiZ2V0RGVjaW1hbEZvcm1hdCIsIm91dEV4cHJlc3Npb24iLCJzTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzIiwiY29uc3RyYWludHMiLCJPYmplY3QiLCJhc3NpZ24iLCJwcmVjaXNpb24iLCJzY2FsZSIsImZvcm1hdE9wdGlvbnMiLCJwcmVzZXJ2ZURlY2ltYWxzIiwiZ2V0VmFsdWVGb3JtYXR0ZWQiLCJvUHJvcGVydHlEYXRhTW9kZWxQYXRoIiwic1Byb3BlcnR5VHlwZSIsInBhdGgiLCJpbmRleE9mIiwib1Byb3BlcnR5RGVmaW5pdGlvbiIsInR5cGUiLCJFRE1fVFlQRV9NQVBQSU5HIiwiYnVpbGRGaWVsZEJpbmRpbmdFeHByZXNzaW9uIiwiZGF0YVBvaW50Rm9ybWF0T3B0aW9ucyIsImJIaWRlTWVhc3VyZSIsIm9EYXRhUG9pbnRWYWx1ZSIsIlZhbHVlRm9ybWF0IiwiTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzIiwiZW5oYW5jZURhdGFNb2RlbFBhdGgiLCJvRGVzY3JpcHRpb24iLCJvRm9ybWF0dGVkVmFsdWUiLCJzRGlzcGxheU1vZGUiLCJkaXNwbGF5TW9kZSIsImdldERpc3BsYXlNb2RlIiwib0JpbmRpbmdFeHByZXNzaW9uIiwiZm9ybWF0V2l0aEJyYWNrZXRzIiwiVGltZXpvbmUiLCJnZXRCaW5kaW5nV2l0aFRpbWV6b25lIiwiX2NvbXB1dGVCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5IiwibWVhc3VyZURpc3BsYXlNb2RlIiwicHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoIiwiZm9ybWF0dGVkVmFsdWUiLCJoaWRlTWVhc3VyZSIsImdldEJpbmRpbmdXaXRoVW5pdE9yQ3VycmVuY3kiLCJzaG93TWVhc3VyZSIsImJ1aWxkRXhwcmVzc2lvbkZvclByb2dyZXNzSW5kaWNhdG9yUGVyY2VudFZhbHVlIiwiY29tcHV0ZVBlcmNlbnRhZ2UiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkRhdGFQb2ludFRlbXBsYXRpbmcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHZhbHVlRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9WYWx1ZUZvcm1hdHRlclwiO1xuaW1wb3J0IHR5cGUgeyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24sIENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uLCBQYXRoSW5Nb2RlbEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IHtcblx0Y29tcGlsZUV4cHJlc3Npb24sXG5cdGZvcm1hdFJlc3VsdCxcblx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uLFxuXHRpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbixcblx0dW5yZXNvbHZlYWJsZUV4cHJlc3Npb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB0eXBlIHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGVuaGFuY2VEYXRhTW9kZWxQYXRoLCBnZXRSZWxhdGl2ZVBhdGhzIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgaGFzU3RhdGljUGVyY2VudFVuaXQsIGlzUHJvcGVydHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Qcm9wZXJ0eUhlbHBlclwiO1xuaW1wb3J0IHtcblx0RURNX1RZUEVfTUFQUElORyxcblx0Zm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbixcblx0Z2V0QmluZGluZ1dpdGhUaW1lem9uZSxcblx0Z2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeSxcblx0Z2V0RGlzcGxheU1vZGVcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgQW5ub3RhdGlvbkhlbHBlciBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L0Fubm90YXRpb25IZWxwZXJcIjtcblxuZXhwb3J0IHR5cGUgRGF0YVBvaW50Rm9ybWF0T3B0aW9ucyA9IFBhcnRpYWw8e1xuXHRtZWFzdXJlRGlzcGxheU1vZGU6IHN0cmluZztcblx0ZGlzcGxheU1vZGU6IHN0cmluZztcbn0+O1xuXG5jb25zdCBnZXREYXRhUG9pbnRUYXJnZXRFeHByZXNzaW9uID0gKG9EYXRhTW9kZWxQYXRoOiBhbnkpOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiA9PiB7XG5cdHJldHVybiBvRGF0YU1vZGVsUGF0aD8uVGFyZ2V0VmFsdWUgPyBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ob0RhdGFNb2RlbFBhdGguVGFyZ2V0VmFsdWUpIDogdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG59O1xuXG5jb25zdCBvUmVzb3VyY2VNb2RlbCA9IHNhcC51aS5nZXRDb3JlKCkuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLm1hY3Jvc1wiKTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkRXhwcmVzc2lvbkZvclByb2dyZXNzSW5kaWNhdG9yRGlzcGxheVZhbHVlID0gKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoXG4pOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiA9PiB7XG5cdGNvbnN0IGZpZWxkVmFsdWUgPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoPy50YXJnZXRPYmplY3Q/LlZhbHVlIHx8IFwiXCI7XG5cdGNvbnN0IHJlbGF0aXZlTG9jYXRpb24gPSBnZXRSZWxhdGl2ZVBhdGhzKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRsZXQgZmllbGRWYWx1ZUV4cHJlc3Npb24gPSBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZmllbGRWYWx1ZSwgcmVsYXRpdmVMb2NhdGlvbikgYXMgYW55O1xuXHRjb25zdCBUYXJnZXRFeHByZXNzaW9uID0gZ2V0RGF0YVBvaW50VGFyZ2V0RXhwcmVzc2lvbihvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCkgYXMgYW55O1xuXG5cdGlmIChmaWVsZFZhbHVlRXhwcmVzc2lvbiAmJiBUYXJnZXRFeHByZXNzaW9uKSB7XG5cdFx0bGV0IHRhcmdldE9iamVjdCA9IG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LlZhbHVlO1xuXHRcdGlmICghaXNQcm9wZXJ0eSh0YXJnZXRPYmplY3QpKSB7XG5cdFx0XHR0YXJnZXRPYmplY3QgPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5WYWx1ZS4kdGFyZ2V0O1xuXHRcdH1cblx0XHRjb25zdCB1bml0ID0gdGFyZ2V0T2JqZWN0LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdCB8fCB0YXJnZXRPYmplY3QuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeTtcblxuXHRcdGlmICghdW5pdCkge1xuXHRcdFx0cmV0dXJuIG9SZXNvdXJjZU1vZGVsLmdldFRleHQoXCJUX0NPTU1PTl9QUk9HUkVTU19JTkRJQ0FUT1JfRElTUExBWV9WQUxVRV9OT19VT01cIiwgW1xuXHRcdFx0XHRjb21waWxlRXhwcmVzc2lvbihmaWVsZFZhbHVlRXhwcmVzc2lvbikgYXMgc3RyaW5nLFxuXHRcdFx0XHRjb21waWxlRXhwcmVzc2lvbihUYXJnZXRFeHByZXNzaW9uKSBhcyBzdHJpbmdcblx0XHRcdF0pO1xuXHRcdH1cblx0XHQvLyBJZiB0aGUgdW5pdCBpc24ndCBhIHBhdGgsIHdlIGNoZWNrIGZvciBhICUgc2lnbiBhcyBpdCBpcyBhIHNwZWNpYWwgY2FzZS5cblx0XHRpZiAoaGFzU3RhdGljUGVyY2VudFVuaXQoZmllbGRWYWx1ZT8uJHRhcmdldCkpIHtcblx0XHRcdHJldHVybiBgJHtjb21waWxlRXhwcmVzc2lvbihmaWVsZFZhbHVlRXhwcmVzc2lvbikgYXMgc3RyaW5nfSAlYDtcblx0XHR9XG5cblx0XHRmaWVsZFZhbHVlRXhwcmVzc2lvbiA9IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24odGFyZ2V0T2JqZWN0LCBmaWVsZFZhbHVlRXhwcmVzc2lvbik7XG5cdFx0Y29uc3QgdW5pdEJpbmRpbmdFeHByZXNzaW9uID0gdW5pdC4kdGFyZ2V0XG5cdFx0XHQ/IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24odW5pdC4kdGFyZ2V0LCBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24odW5pdCwgcmVsYXRpdmVMb2NhdGlvbikpXG5cdFx0XHQ6IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbih1bml0LCByZWxhdGl2ZUxvY2F0aW9uKTtcblxuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihcblx0XHRcdGZvcm1hdFJlc3VsdChbZmllbGRWYWx1ZUV4cHJlc3Npb24sIFRhcmdldEV4cHJlc3Npb24sIHVuaXRCaW5kaW5nRXhwcmVzc2lvbl0sIHZhbHVlRm9ybWF0dGVycy5mb3JtYXRQcm9ncmVzc0luZGljYXRvclRleHQpXG5cdFx0KTtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVW5pdEJpbmRpbmdFeHByZXNzaW9uID0gKGRhdGFQb2ludDogRGF0YU1vZGVsT2JqZWN0UGF0aCk6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uID0+IHtcblx0Y29uc3QgcmVsYXRpdmVMb2NhdGlvbiA9IGdldFJlbGF0aXZlUGF0aHMoZGF0YVBvaW50KTtcblxuXHRjb25zdCB0YXJnZXRPYmplY3QgPSBkYXRhUG9pbnQ/LnRhcmdldE9iamVjdD8uVmFsdWU/LiR0YXJnZXQ7XG5cdGlmICghaXNQcm9wZXJ0eSh0YXJnZXRPYmplY3QpKSB7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblx0Y29uc3QgdW5pdCA9IHRhcmdldE9iamVjdC5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LlVuaXQgfHwgdGFyZ2V0T2JqZWN0LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3k7XG5cdHJldHVybiB1bml0ID8gY29tcGlsZUV4cHJlc3Npb24oZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHVuaXQsIHJlbGF0aXZlTG9jYXRpb24pKSA6IFwiXCI7XG59O1xuXG5jb25zdCBidWlsZFJhdGluZ0luZGljYXRvclN1YnRpdGxlRXhwcmVzc2lvbiA9IChvQ29udGV4dDogYW55LCBtU2FtcGxlU2l6ZTogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcblx0aWYgKG1TYW1wbGVTaXplKSB7XG5cdFx0cmV0dXJuIGZvcm1hdFJhdGluZ0luZGljYXRvclN1YlRpdGxlKEFubm90YXRpb25IZWxwZXIudmFsdWUobVNhbXBsZVNpemUsIHsgY29udGV4dDogb0NvbnRleHQgfSkgYXMgYW55KTtcblx0fVxufTtcbi8vIHJldHVybnMgdGhlIHRleHQgZm9yIHRoZSBSYXRpbmcgSW5kaWNhdG9yIFN1YnRpdGxlIChlLmcuICc3IHJldmlld3MnKVxuY29uc3QgZm9ybWF0UmF0aW5nSW5kaWNhdG9yU3ViVGl0bGUgPSAoaVNhbXBsZVNpemVWYWx1ZTogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcblx0aWYgKGlTYW1wbGVTaXplVmFsdWUpIHtcblx0XHRjb25zdCBzU3ViVGl0bGVMYWJlbCA9XG5cdFx0XHRpU2FtcGxlU2l6ZVZhbHVlID4gMVxuXHRcdFx0XHQ/IG9SZXNvdXJjZU1vZGVsLmdldFRleHQoXCJUX0FOTk9UQVRJT05fSEVMUEVSX1JBVElOR19JTkRJQ0FUT1JfU1VCVElUTEVfTEFCRUxfUExVUkFMXCIpXG5cdFx0XHRcdDogb1Jlc291cmNlTW9kZWwuZ2V0VGV4dChcIlRfQU5OT1RBVElPTl9IRUxQRVJfUkFUSU5HX0lORElDQVRPUl9TVUJUSVRMRV9MQUJFTFwiKTtcblx0XHRyZXR1cm4gb1Jlc291cmNlTW9kZWwuZ2V0VGV4dChcIlRfQU5OT1RBVElPTl9IRUxQRVJfUkFUSU5HX0lORElDQVRPUl9TVUJUSVRMRVwiLCBbU3RyaW5nKGlTYW1wbGVTaXplVmFsdWUpLCBzU3ViVGl0bGVMYWJlbF0pO1xuXHR9XG59O1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBnZXQgdGhlIGhlYWRlciB0ZXh0IG9mIHJhdGluZyBpbmRpY2F0b3IuXG4gKlxuICogQHBhcmFtIG9Db250ZXh0XG4gKiBAcGFyYW0gb0RhdGFQb2ludFxuICogQGZ1bmN0aW9uIHBhcmFtIHtvYmplY3R9IG9Db250ZXh0IGNvbnRleHQgb2YgaW50ZXJmYWNlXG4gKiBwYXJhbSB7b2JqZWN0fSBvRGF0YVBvaW50IGRhdGEgcG9pbnQgb2JqZWN0XG4gKiBAcmV0dXJucyBFeHByZXNzaW9uIGJpbmRpbmcgZm9yIHJhdGluZyBpbmRpY2F0b3IgdGV4dFxuICovXG5leHBvcnQgY29uc3QgZ2V0SGVhZGVyUmF0aW5nSW5kaWNhdG9yVGV4dCA9IChvQ29udGV4dDogYW55LCBvRGF0YVBvaW50OiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRpZiAob0RhdGFQb2ludCAmJiBvRGF0YVBvaW50LlNhbXBsZVNpemUpIHtcblx0XHRyZXR1cm4gYnVpbGRSYXRpbmdJbmRpY2F0b3JTdWJ0aXRsZUV4cHJlc3Npb24ob0NvbnRleHQsIG9EYXRhUG9pbnQuU2FtcGxlU2l6ZSk7XG5cdH0gZWxzZSBpZiAob0RhdGFQb2ludCAmJiBvRGF0YVBvaW50LkRlc2NyaXB0aW9uKSB7XG5cdFx0Y29uc3Qgc01vZGVsVmFsdWUgPSBBbm5vdGF0aW9uSGVscGVyLnZhbHVlKG9EYXRhUG9pbnQuRGVzY3JpcHRpb24sIHsgY29udGV4dDogb0NvbnRleHQgfSk7XG5cdFx0cmV0dXJuIFwiJHtwYXRoOlwiICsgc01vZGVsVmFsdWUgKyBcIn1cIjtcblx0fVxufTtcbmdldEhlYWRlclJhdGluZ0luZGljYXRvclRleHQucmVxdWlyZXNJQ29udGV4dCA9IHRydWU7XG5cbmNvbnN0IGJ1aWxkRXhwcmVzc2lvbkZvckRlc2NyaXB0aW9uID0gKGZpZWxkVmFsdWU6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PiB8IHVuZGVmaW5lZCA9PiB7XG5cdGNvbnN0IHJlbGF0aXZlTG9jYXRpb24gPSBnZXRSZWxhdGl2ZVBhdGhzKGZpZWxkVmFsdWUpO1xuXHRpZiAoZmllbGRWYWx1ZT8udGFyZ2V0T2JqZWN0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0KSB7XG5cdFx0Y29uc3Qgb1RleHRFeHByZXNzaW9uID0gZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGZpZWxkVmFsdWU/LnRhcmdldE9iamVjdC5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKTtcblx0XHRpZiAoaXNQYXRoSW5Nb2RlbEV4cHJlc3Npb24ob1RleHRFeHByZXNzaW9uKSkge1xuXHRcdFx0b1RleHRFeHByZXNzaW9uLnBhcmFtZXRlcnMgPSB7IFwiJCRub1BhdGNoXCI6IHRydWUgfTtcblx0XHR9XG5cdFx0cmV0dXJuIG9UZXh0RXhwcmVzc2lvbjtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuY29uc3QgZ2V0RGVjaW1hbEZvcm1hdCA9IChcblx0b3V0RXhwcmVzc2lvbjogUGF0aEluTW9kZWxFeHByZXNzaW9uPGFueT4sXG5cdGZpZWxkVmFsdWU6IGFueSxcblx0c051bWJlck9mRnJhY3Rpb25hbERpZ2l0czogc3RyaW5nXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PiA9PiB7XG5cdGlmICghb3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cykge1xuXHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMgPSB7fTtcblx0fVxuXHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzID0gT2JqZWN0LmFzc2lnbihvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLCB7XG5cdFx0cHJlY2lzaW9uOiBmaWVsZFZhbHVlLiR0YXJnZXQucHJlY2lzaW9uLFxuXHRcdHNjYWxlOiBzTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzID8gc051bWJlck9mRnJhY3Rpb25hbERpZ2l0cyA6IGZpZWxkVmFsdWUuJHRhcmdldC5zY2FsZVxuXHR9KTtcblx0Ly8gc051bWJlck9mRnJhY3Rpb25hbERpZ2l0cyBpcyBvbmx5IGRlZmluZWQgaW4gZ2V0VmFsdWVGb3JtYXR0ZWQgd2hlbiBOdW1iZXJPZkZyYWN0aW9uYWxEaWdpdHMgaXMgZGVmaW5lZC5cblx0Ly8gSW4gdGhhdCBjYXNlLCB3ZSBuZWVkIHRvIGluc3RhbmNlIHRoZSBwcmVzZXJ2ZURlY2ltYWxzIHBhcmFtZXRlciBiZWNhdXNlIG9mIGEgY2hhbmdlIE1EQyBzaWRlXG5cdGlmIChzTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzKSB7XG5cdFx0aWYgKCFvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpIHtcblx0XHRcdG91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHRvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucywge1xuXHRcdFx0cHJlc2VydmVEZWNpbWFsczogZmFsc2Vcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gb3V0RXhwcmVzc2lvbjtcbn07XG5cbmNvbnN0IGdldFZhbHVlRm9ybWF0dGVkID0gKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmaWVsZFZhbHVlOiBhbnksXG5cdHNQcm9wZXJ0eVR5cGU6IHN0cmluZyxcblx0c051bWJlck9mRnJhY3Rpb25hbERpZ2l0czogc3RyaW5nXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiA9PiB7XG5cdGxldCBvdXRFeHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55Pjtcblx0Y29uc3QgcmVsYXRpdmVMb2NhdGlvbiA9IGZpZWxkVmFsdWU/LnBhdGg/LmluZGV4T2YoXCIvXCIpID09PSAtMSA/IGdldFJlbGF0aXZlUGF0aHMob1Byb3BlcnR5RGF0YU1vZGVsUGF0aCkgOiBbXTtcblx0b3V0RXhwcmVzc2lvbiA9IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihmaWVsZFZhbHVlLCByZWxhdGl2ZUxvY2F0aW9uKTtcblx0Y29uc3Qgb1Byb3BlcnR5RGVmaW5pdGlvbiA9IG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0IGFzIFByb3BlcnR5O1xuXHRpZiAoc1Byb3BlcnR5VHlwZSAmJiBpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbihvdXRFeHByZXNzaW9uKSkge1xuXHRcdGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24ob1Byb3BlcnR5RGVmaW5pdGlvbiwgb3V0RXhwcmVzc2lvbik7XG5cdFx0b3V0RXhwcmVzc2lvbi50eXBlID0gRURNX1RZUEVfTUFQUElOR1tzUHJvcGVydHlUeXBlXT8udHlwZTtcblx0XHRzd2l0Y2ggKHNQcm9wZXJ0eVR5cGUpIHtcblx0XHRcdGNhc2UgXCJFZG0uRGVjaW1hbFwiOlxuXHRcdFx0XHQvLyBmb3IgdGhlIGxpc3RSZXBvcnQsIHRoZSBkZWNpbWFsIGZpZWxkcyBhcmUgZm9ybWF0dGVkIGJ5IHJldHVybmluZyBhIHN0cmluZ1xuXHRcdFx0XHQvLyBmb3IgdGhlIGZhY2V0cyBvZiB0aGUgT1AsIHRoZSBkZWNpbWFsIGZpZWxkcyBhcmUgZm9ybWF0dGVkIGJ5IHJldHVybmluZyBhIHByb21pc2UsIHNvIHdlIG1hbmFnZSBhbGwgdGhlIGNhc2VzXG5cdFx0XHRcdG91dEV4cHJlc3Npb24gPSBnZXREZWNpbWFsRm9ybWF0KG91dEV4cHJlc3Npb24sIGZpZWxkVmFsdWUsIHNOdW1iZXJPZkZyYWN0aW9uYWxEaWdpdHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG91dEV4cHJlc3Npb247XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRGaWVsZEJpbmRpbmdFeHByZXNzaW9uID0gKFxuXHRvRGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0ZGF0YVBvaW50Rm9ybWF0T3B0aW9uczogRGF0YVBvaW50Rm9ybWF0T3B0aW9ucyxcblx0YkhpZGVNZWFzdXJlOiBib29sZWFuXG4pOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiA9PiB7XG5cdGNvbnN0IG9EYXRhUG9pbnQgPSBvRGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3Q7XG5cdGNvbnN0IG9EYXRhUG9pbnRWYWx1ZSA9IG9EYXRhUG9pbnQ/LlZhbHVlIHx8IFwiXCI7XG5cdGNvbnN0IHNQcm9wZXJ0eVR5cGUgPSBvRGF0YVBvaW50VmFsdWU/LiR0YXJnZXQ/LnR5cGU7XG5cdGxldCBzTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzO1xuXG5cdGlmIChzUHJvcGVydHlUeXBlID09PSBcIkVkbS5EZWNpbWFsXCIgJiYgb0RhdGFQb2ludC5WYWx1ZUZvcm1hdCkge1xuXHRcdGlmIChvRGF0YVBvaW50LlZhbHVlRm9ybWF0Lk51bWJlck9mRnJhY3Rpb25hbERpZ2l0cykge1xuXHRcdFx0c051bWJlck9mRnJhY3Rpb25hbERpZ2l0cyA9IG9EYXRhUG9pbnQuVmFsdWVGb3JtYXQuTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzO1xuXHRcdH1cblx0fVxuXHRjb25zdCBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgob0RhdGFNb2RlbFBhdGgsIG9EYXRhUG9pbnRWYWx1ZS5wYXRoKTtcblx0Y29uc3Qgb0Rlc2NyaXB0aW9uID0gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCA/IGJ1aWxkRXhwcmVzc2lvbkZvckRlc2NyaXB0aW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpIDogdW5kZWZpbmVkO1xuXHRjb25zdCBvRm9ybWF0dGVkVmFsdWUgPSBnZXRWYWx1ZUZvcm1hdHRlZChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLCBvRGF0YVBvaW50VmFsdWUsIHNQcm9wZXJ0eVR5cGUsIHNOdW1iZXJPZkZyYWN0aW9uYWxEaWdpdHMpO1xuXHRjb25zdCBzRGlzcGxheU1vZGUgPSBvRGVzY3JpcHRpb24gPyBkYXRhUG9pbnRGb3JtYXRPcHRpb25zLmRpc3BsYXlNb2RlIHx8IGdldERpc3BsYXlNb2RlKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpIDogXCJWYWx1ZVwiO1xuXHRsZXQgb0JpbmRpbmdFeHByZXNzaW9uOiBhbnk7XG5cdHN3aXRjaCAoc0Rpc3BsYXlNb2RlKSB7XG5cdFx0Y2FzZSBcIkRlc2NyaXB0aW9uXCI6XG5cdFx0XHRvQmluZGluZ0V4cHJlc3Npb24gPSBvRGVzY3JpcHRpb247XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFtvRm9ybWF0dGVkVmFsdWUsIG9EZXNjcmlwdGlvbl0sIHZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoQnJhY2tldHMpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkRlc2NyaXB0aW9uVmFsdWVcIjpcblx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbiA9IGZvcm1hdFJlc3VsdChbb0Rlc2NyaXB0aW9uLCBvRm9ybWF0dGVkVmFsdWVdLCB2YWx1ZUZvcm1hdHRlcnMuZm9ybWF0V2l0aEJyYWNrZXRzKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LmFubm90YXRpb25zPy5Db21tb24/LlRpbWV6b25lKSB7XG5cdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbiA9IGdldEJpbmRpbmdXaXRoVGltZXpvbmUob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgb0Zvcm1hdHRlZFZhbHVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbiA9IF9jb21wdXRlQmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeShcblx0XHRcdFx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdFx0XHRcdG9Gb3JtYXR0ZWRWYWx1ZSxcblx0XHRcdFx0XHRiSGlkZU1lYXN1cmUgfHwgZGF0YVBvaW50Rm9ybWF0T3B0aW9ucz8ubWVhc3VyZURpc3BsYXlNb2RlID09PSBcIkhpZGRlblwiXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdH1cblx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKG9CaW5kaW5nRXhwcmVzc2lvbik7XG59O1xuXG5leHBvcnQgY29uc3QgX2NvbXB1dGVCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5ID0gKFxuXHRwcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGZvcm1hdHRlZFZhbHVlOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPixcblx0aGlkZU1lYXN1cmU6IGJvb2xlYW5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+ID0+IHtcblx0aWYgKFxuXHRcdHByb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdCB8fFxuXHRcdHByb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3lcblx0KSB7XG5cdFx0aWYgKGhpZGVNZWFzdXJlICYmIGhhc1N0YXRpY1BlcmNlbnRVbml0KHByb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QpKSB7XG5cdFx0XHRyZXR1cm4gZm9ybWF0dGVkVmFsdWU7XG5cdFx0fVxuXHRcdHJldHVybiBnZXRCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5KFxuXHRcdFx0cHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdFx0Zm9ybWF0dGVkVmFsdWUsXG5cdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRoaWRlTWVhc3VyZSA/IHsgc2hvd01lYXN1cmU6IGZhbHNlIH0gOiB1bmRlZmluZWRcblx0XHQpO1xuXHR9XG5cdHJldHVybiBmb3JtYXR0ZWRWYWx1ZTtcbn07XG5cbi8qKlxuICogTWV0aG9kIHRvIGNhbGN1bGF0ZSB0aGUgcGVyY2VudGFnZSB2YWx1ZSBvZiBQcm9ncmVzcyBJbmRpY2F0b3IuIEJhc2ljIGZvcm11bGEgaXMgVmFsdWUvVGFyZ2V0ICogMTAwLlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoXG4gKiBAcmV0dXJucyBUaGUgZXhwcmVzc2lvbiBiaW5kaW5nIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBwZXJjZW50YWdlIHZhbHVlLCB3aGljaCBpcyBzaG93biBpbiB0aGUgcHJvZ3Jlc3MgaW5kaWNhdG9yIGJhc2VkIG9uIHRoZSBmb3JtdWxhIGdpdmVuIGFib3ZlLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRFeHByZXNzaW9uRm9yUHJvZ3Jlc3NJbmRpY2F0b3JQZXJjZW50VmFsdWUgPSAob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG5cdGNvbnN0IGZpZWxkVmFsdWUgPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoPy50YXJnZXRPYmplY3Q/LlZhbHVlIHx8IFwiXCI7XG5cdGNvbnN0IHJlbGF0aXZlTG9jYXRpb24gPSBnZXRSZWxhdGl2ZVBhdGhzKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRjb25zdCBmaWVsZFZhbHVlRXhwcmVzc2lvbiA9IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihmaWVsZFZhbHVlLCByZWxhdGl2ZUxvY2F0aW9uKTtcblx0Y29uc3QgVGFyZ2V0RXhwcmVzc2lvbiA9IGdldERhdGFQb2ludFRhcmdldEV4cHJlc3Npb24ob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QpO1xuXG5cdGNvbnN0IG9Qcm9wZXJ0eURlZmluaXRpb24gPSBmaWVsZFZhbHVlLiR0YXJnZXQgYXMgUHJvcGVydHk7XG5cdGNvbnN0IHVuaXQgPSBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdCB8fCBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3k7XG5cdGlmICh1bml0KSB7XG5cdFx0Y29uc3QgdW5pdEJpbmRpbmdFeHByZXNzaW9uID0gKHVuaXQgYXMgYW55KS4kdGFyZ2V0XG5cdFx0XHQ/IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24oXG5cdFx0XHRcdFx0KHVuaXQgYXMgYW55KS4kdGFyZ2V0LFxuXHRcdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbih1bml0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPlxuXHRcdFx0ICApXG5cdFx0XHQ6IChnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24odW5pdCwgcmVsYXRpdmVMb2NhdGlvbikgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4pO1xuXG5cdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0Zm9ybWF0UmVzdWx0KFtmaWVsZFZhbHVlRXhwcmVzc2lvbiwgVGFyZ2V0RXhwcmVzc2lvbiwgdW5pdEJpbmRpbmdFeHByZXNzaW9uXSwgdmFsdWVGb3JtYXR0ZXJzLmNvbXB1dGVQZXJjZW50YWdlKVxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oZm9ybWF0UmVzdWx0KFtmaWVsZFZhbHVlRXhwcmVzc2lvbiwgVGFyZ2V0RXhwcmVzc2lvbiwgXCJcIl0sIHZhbHVlRm9ybWF0dGVycy5jb21wdXRlUGVyY2VudGFnZSkpO1xufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUEyQkEsSUFBTUEsNEJBQTRCLEdBQUcsVUFBQ0MsY0FBRCxFQUEyRDtJQUMvRixPQUFPQSxjQUFjLFNBQWQsSUFBQUEsY0FBYyxXQUFkLElBQUFBLGNBQWMsQ0FBRUMsV0FBaEIsR0FBOEJDLDJCQUEyQixDQUFDRixjQUFjLENBQUNDLFdBQWhCLENBQXpELEdBQXdGRSx1QkFBL0Y7RUFDQSxDQUZEOztFQUlBLElBQU1DLGNBQWMsR0FBR0MsR0FBRyxDQUFDQyxFQUFKLENBQU9DLE9BQVAsR0FBaUJDLHdCQUFqQixDQUEwQyxlQUExQyxDQUF2Qjs7RUFFTyxJQUFNQywrQ0FBK0MsR0FBRyxVQUM5REMsNEJBRDhELEVBRXhCO0lBQUE7O0lBQ3RDLElBQU1DLFVBQVUsR0FBRyxDQUFBRCw0QkFBNEIsU0FBNUIsSUFBQUEsNEJBQTRCLFdBQTVCLHFDQUFBQSw0QkFBNEIsQ0FBRUUsWUFBOUIsZ0ZBQTRDQyxLQUE1QyxLQUFxRCxFQUF4RTtJQUNBLElBQU1DLGdCQUFnQixHQUFHQyxnQkFBZ0IsQ0FBQ0wsNEJBQUQsQ0FBekM7SUFDQSxJQUFJTSxvQkFBb0IsR0FBR2QsMkJBQTJCLENBQUNTLFVBQUQsRUFBYUcsZ0JBQWIsQ0FBdEQ7SUFDQSxJQUFNRyxnQkFBZ0IsR0FBR2xCLDRCQUE0QixDQUFDVyw0QkFBNEIsQ0FBQ0UsWUFBOUIsQ0FBckQ7O0lBRUEsSUFBSUksb0JBQW9CLElBQUlDLGdCQUE1QixFQUE4QztNQUFBOztNQUM3QyxJQUFJTCxZQUFZLEdBQUdGLDRCQUE0QixDQUFDRSxZQUE3QixDQUEwQ0MsS0FBN0Q7O01B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