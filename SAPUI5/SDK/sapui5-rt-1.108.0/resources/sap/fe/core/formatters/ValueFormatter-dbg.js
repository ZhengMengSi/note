/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core", "sap/ui/core/format/DateFormat"], function (Core, DateFormat) {
  "use strict";

  var _exports = {};

  /**
   * Collection of table formatters.
   *
   * @param this The context
   * @param sName The inner function name
   * @param oArgs The inner function parameters
   * @returns The value from the inner function
   */
  var valueFormatters = function (sName) {
    if (valueFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return valueFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  var formatWithBrackets = function (firstPart, secondPart) {
    if (firstPart && secondPart) {
      return Core.getLibraryResourceBundle("sap.fe.core").getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [firstPart, secondPart]);
    } else {
      return firstPart || secondPart || "";
    }
  };

  formatWithBrackets.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithBrackets";

  var formatOPTitle = function (hasActiveEntity, isActiveEntity, firstPart, secondPart) {
    var result = formatWithBrackets(firstPart, secondPart);

    if (!result) {
      result = !isActiveEntity && !hasActiveEntity ? Core.getLibraryResourceBundle("sap.fe.templates").getText("T_NEW_OBJECT") : Core.getLibraryResourceBundle("sap.fe.templates").getText("T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO");
    }

    return result;
  };

  formatOPTitle.__functionName = "sap.fe.core.formatters.ValueFormatter#formatOPTitle";

  var formatWithPercentage = function (sValue) {
    return sValue !== null && sValue !== undefined ? "".concat(sValue, " %") : "";
  };

  formatWithPercentage.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithPercentage";

  var computePercentage = function (value, target, sUnit) {
    var sPercentString;
    var iValue = typeof value === "string" ? parseFloat(value) : value;
    var iTarget = typeof target === "string" ? parseFloat(target) : target;

    if (sUnit === "%") {
      if (iValue > 100) {
        sPercentString = "100";
      } else if (iValue <= 0) {
        sPercentString = "0";
      } else {
        sPercentString = typeof value === "string" ? value : value === null || value === void 0 ? void 0 : value.toString();
      }
    } else if (iValue > iTarget) {
      sPercentString = "100";
    } else if (iValue <= 0) {
      sPercentString = "0";
    } else {
      sPercentString = iValue && iTarget ? (iValue / iTarget * 100).toString() : "0";
    }

    return sPercentString;
  };

  computePercentage.__functionName = "sap.fe.core.formatters.ValueFormatter#computePercentage";

  var formatCriticalityIcon = function (val) {
    var sIcon;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sIcon = "sap-icon://message-error";
    } else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
      sIcon = "sap-icon://message-warning";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sIcon = "sap-icon://message-success";
    } else if (val === "UI.CriticalityType/Information" || val === "5" || val === 5) {
      sIcon = "sap-icon://message-information";
    } else {
      sIcon = "";
    }

    return sIcon;
  };

  formatCriticalityIcon.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityIcon";
  _exports.formatCriticalityIcon = formatCriticalityIcon;

  var formatCriticalityValueState = function (val) {
    var sValueState;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sValueState = "Error";
    } else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
      sValueState = "Warning";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sValueState = "Success";
    } else if (val === "UI.CriticalityType/Information" || val === "5" || val === 5) {
      sValueState = "Information";
    } else {
      sValueState = "None";
    }

    return sValueState;
  };

  formatCriticalityValueState.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityValueState";
  _exports.formatCriticalityValueState = formatCriticalityValueState;

  var formatCriticalityButtonType = function (val) {
    var sType;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sType = "Reject";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sType = "Accept";
    } else {
      sType = "Default";
    }

    return sType;
  };

  formatCriticalityButtonType.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityButtonType";
  _exports.formatCriticalityButtonType = formatCriticalityButtonType;

  var formatCriticalityColorMicroChart = function (val) {
    var sColor;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sColor = "Error";
    } else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
      sColor = "Critical";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sColor = "Good";
    } else {
      sColor = "Neutral";
    }

    return sColor;
  };

  formatCriticalityColorMicroChart.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityColorMicroChart";
  _exports.formatCriticalityColorMicroChart = formatCriticalityColorMicroChart;

  var formatProgressIndicatorText = function (value, target, unit) {
    if (value && target && unit) {
      var _localeData$dateField, _localeData$units, _localeData$units$sho;

      var unitSplit = unit.split("-");
      var searchUnit = "".concat(unitSplit[1] === undefined ? unit : unitSplit[1], "-narrow");
      var dateFormat = DateFormat.getDateInstance();
      var localeData = dateFormat.oLocaleData.mData;
      var oResourceModel = Core.getLibraryResourceBundle("sap.fe.macros");
      var unitDisplayed = unit;

      if (localeData !== null && localeData !== void 0 && (_localeData$dateField = localeData.dateFields[searchUnit]) !== null && _localeData$dateField !== void 0 && _localeData$dateField.displayName) {
        unitDisplayed = localeData.dateFields[searchUnit].displayName;
      } else if (localeData !== null && localeData !== void 0 && (_localeData$units = localeData.units) !== null && _localeData$units !== void 0 && (_localeData$units$sho = _localeData$units.short[unit]) !== null && _localeData$units$sho !== void 0 && _localeData$units$sho.displayName) {
        unitDisplayed = localeData.units.short[unit].displayName;
      }

      return oResourceModel.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_WITH_UOM", [value, target, unitDisplayed]);
    }
  };

  formatProgressIndicatorText.__functionName = "sap.fe.core.formatters.ValueFormatter#formatProgressIndicatorText";
  _exports.formatProgressIndicatorText = formatProgressIndicatorText;
  valueFormatters.formatWithBrackets = formatWithBrackets;
  valueFormatters.formatOPTitle = formatOPTitle;
  valueFormatters.formatWithPercentage = formatWithPercentage;
  valueFormatters.computePercentage = computePercentage;
  valueFormatters.formatCriticalityIcon = formatCriticalityIcon;
  valueFormatters.formatCriticalityValueState = formatCriticalityValueState;
  valueFormatters.formatCriticalityButtonType = formatCriticalityButtonType;
  valueFormatters.formatCriticalityColorMicroChart = formatCriticalityColorMicroChart;
  valueFormatters.formatProgressIndicatorText = formatProgressIndicatorText;
  /**
   * @global
   */

  return valueFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ2YWx1ZUZvcm1hdHRlcnMiLCJzTmFtZSIsImhhc093blByb3BlcnR5Iiwib0FyZ3MiLCJhcHBseSIsImZvcm1hdFdpdGhCcmFja2V0cyIsImZpcnN0UGFydCIsInNlY29uZFBhcnQiLCJDb3JlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiZ2V0VGV4dCIsIl9fZnVuY3Rpb25OYW1lIiwiZm9ybWF0T1BUaXRsZSIsImhhc0FjdGl2ZUVudGl0eSIsImlzQWN0aXZlRW50aXR5IiwicmVzdWx0IiwiZm9ybWF0V2l0aFBlcmNlbnRhZ2UiLCJzVmFsdWUiLCJ1bmRlZmluZWQiLCJjb21wdXRlUGVyY2VudGFnZSIsInZhbHVlIiwidGFyZ2V0Iiwic1VuaXQiLCJzUGVyY2VudFN0cmluZyIsImlWYWx1ZSIsInBhcnNlRmxvYXQiLCJpVGFyZ2V0IiwidG9TdHJpbmciLCJmb3JtYXRDcml0aWNhbGl0eUljb24iLCJ2YWwiLCJzSWNvbiIsImZvcm1hdENyaXRpY2FsaXR5VmFsdWVTdGF0ZSIsInNWYWx1ZVN0YXRlIiwiZm9ybWF0Q3JpdGljYWxpdHlCdXR0b25UeXBlIiwic1R5cGUiLCJmb3JtYXRDcml0aWNhbGl0eUNvbG9yTWljcm9DaGFydCIsInNDb2xvciIsImZvcm1hdFByb2dyZXNzSW5kaWNhdG9yVGV4dCIsInVuaXQiLCJ1bml0U3BsaXQiLCJzcGxpdCIsInNlYXJjaFVuaXQiLCJkYXRlRm9ybWF0IiwiRGF0ZUZvcm1hdCIsImdldERhdGVJbnN0YW5jZSIsImxvY2FsZURhdGEiLCJvTG9jYWxlRGF0YSIsIm1EYXRhIiwib1Jlc291cmNlTW9kZWwiLCJ1bml0RGlzcGxheWVkIiwiZGF0ZUZpZWxkcyIsImRpc3BsYXlOYW1lIiwidW5pdHMiLCJzaG9ydCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVmFsdWVGb3JtYXR0ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCBEYXRlRm9ybWF0IGZyb20gXCJzYXAvdWkvY29yZS9mb3JtYXQvRGF0ZUZvcm1hdFwiO1xuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHRhYmxlIGZvcm1hdHRlcnMuXG4gKlxuICogQHBhcmFtIHRoaXMgVGhlIGNvbnRleHRcbiAqIEBwYXJhbSBzTmFtZSBUaGUgaW5uZXIgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIG9BcmdzIFRoZSBpbm5lciBmdW5jdGlvbiBwYXJhbWV0ZXJzXG4gKiBAcmV0dXJucyBUaGUgdmFsdWUgZnJvbSB0aGUgaW5uZXIgZnVuY3Rpb25cbiAqL1xuY29uc3QgdmFsdWVGb3JtYXR0ZXJzID0gZnVuY3Rpb24gKHRoaXM6IG9iamVjdCwgc05hbWU6IHN0cmluZywgLi4ub0FyZ3M6IGFueVtdKTogYW55IHtcblx0aWYgKHZhbHVlRm9ybWF0dGVycy5oYXNPd25Qcm9wZXJ0eShzTmFtZSkpIHtcblx0XHRyZXR1cm4gKHZhbHVlRm9ybWF0dGVycyBhcyBhbnkpW3NOYW1lXS5hcHBseSh0aGlzLCBvQXJncyk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cbn07XG5cbmNvbnN0IGZvcm1hdFdpdGhCcmFja2V0cyA9IChmaXJzdFBhcnQ/OiBzdHJpbmcsIHNlY29uZFBhcnQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRpZiAoZmlyc3RQYXJ0ICYmIHNlY29uZFBhcnQpIHtcblx0XHRyZXR1cm4gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKS5nZXRUZXh0KFwiQ19GT1JNQVRfRk9SX1RFWFRfQVJSQU5HRU1FTlRcIiwgW2ZpcnN0UGFydCwgc2Vjb25kUGFydF0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmaXJzdFBhcnQgfHwgc2Vjb25kUGFydCB8fCBcIlwiO1xuXHR9XG59O1xuZm9ybWF0V2l0aEJyYWNrZXRzLl9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlZhbHVlRm9ybWF0dGVyI2Zvcm1hdFdpdGhCcmFja2V0c1wiO1xuXG5jb25zdCBmb3JtYXRPUFRpdGxlID0gKGhhc0FjdGl2ZUVudGl0eTogYm9vbGVhbiwgaXNBY3RpdmVFbnRpdHk6IGJvb2xlYW4sIGZpcnN0UGFydD86IHN0cmluZywgc2Vjb25kUGFydD86IHN0cmluZyk6IHN0cmluZyA9PiB7XG5cdGxldCByZXN1bHQgPSBmb3JtYXRXaXRoQnJhY2tldHMoZmlyc3RQYXJ0LCBzZWNvbmRQYXJ0KTtcblx0aWYgKCFyZXN1bHQpIHtcblx0XHRyZXN1bHQgPVxuXHRcdFx0IWlzQWN0aXZlRW50aXR5ICYmICFoYXNBY3RpdmVFbnRpdHlcblx0XHRcdFx0PyBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS50ZW1wbGF0ZXNcIikuZ2V0VGV4dChcIlRfTkVXX09CSkVDVFwiKVxuXHRcdFx0XHQ6IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLnRlbXBsYXRlc1wiKS5nZXRUZXh0KFxuXHRcdFx0XHRcdFx0XCJUX0FOTk9UQVRJT05fSEVMUEVSX0RFRkFVTFRfT0JKRUNUX1BBR0VfSEVBREVSX1RJVExFX05PX0hFQURFUl9JTkZPXCJcblx0XHRcdFx0ICApO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59O1xuZm9ybWF0T1BUaXRsZS5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRPUFRpdGxlXCI7XG5cbmNvbnN0IGZvcm1hdFdpdGhQZXJjZW50YWdlID0gKHNWYWx1ZT86IHN0cmluZyk6IHN0cmluZyA9PiB7XG5cdHJldHVybiBzVmFsdWUgIT09IG51bGwgJiYgc1ZhbHVlICE9PSB1bmRlZmluZWQgPyBgJHtzVmFsdWV9ICVgIDogXCJcIjtcbn07XG5mb3JtYXRXaXRoUGVyY2VudGFnZS5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRXaXRoUGVyY2VudGFnZVwiO1xuXG5jb25zdCBjb21wdXRlUGVyY2VudGFnZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCB0YXJnZXQ6IHN0cmluZyB8IG51bWJlciwgc1VuaXQ/OiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRsZXQgc1BlcmNlbnRTdHJpbmc6IHN0cmluZztcblx0Y29uc3QgaVZhbHVlOiBudW1iZXIgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyBwYXJzZUZsb2F0KHZhbHVlKSA6IHZhbHVlO1xuXHRjb25zdCBpVGFyZ2V0OiBudW1iZXIgPSB0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiID8gcGFyc2VGbG9hdCh0YXJnZXQpIDogdGFyZ2V0O1xuXG5cdGlmIChzVW5pdCA9PT0gXCIlXCIpIHtcblx0XHRpZiAoaVZhbHVlID4gMTAwKSB7XG5cdFx0XHRzUGVyY2VudFN0cmluZyA9IFwiMTAwXCI7XG5cdFx0fSBlbHNlIGlmIChpVmFsdWUgPD0gMCkge1xuXHRcdFx0c1BlcmNlbnRTdHJpbmcgPSBcIjBcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c1BlcmNlbnRTdHJpbmcgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB2YWx1ZSA6IHZhbHVlPy50b1N0cmluZygpO1xuXHRcdH1cblx0fSBlbHNlIGlmIChpVmFsdWUgPiBpVGFyZ2V0KSB7XG5cdFx0c1BlcmNlbnRTdHJpbmcgPSBcIjEwMFwiO1xuXHR9IGVsc2UgaWYgKGlWYWx1ZSA8PSAwKSB7XG5cdFx0c1BlcmNlbnRTdHJpbmcgPSBcIjBcIjtcblx0fSBlbHNlIHtcblx0XHRzUGVyY2VudFN0cmluZyA9IGlWYWx1ZSAmJiBpVGFyZ2V0ID8gKChpVmFsdWUgLyBpVGFyZ2V0KSAqIDEwMCkudG9TdHJpbmcoKSA6IFwiMFwiO1xuXHR9XG5cdHJldHVybiBzUGVyY2VudFN0cmluZztcbn07XG5jb21wdXRlUGVyY2VudGFnZS5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNjb21wdXRlUGVyY2VudGFnZVwiO1xuXG5leHBvcnQgY29uc3QgZm9ybWF0Q3JpdGljYWxpdHlJY29uID0gKHZhbD86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG5cdGxldCBzSWNvbjogc3RyaW5nO1xuXHRpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9OZWdhdGl2ZVwiIHx8IHZhbCA9PT0gXCIxXCIgfHwgdmFsID09PSAxKSB7XG5cdFx0c0ljb24gPSBcInNhcC1pY29uOi8vbWVzc2FnZS1lcnJvclwiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvQ3JpdGljYWxcIiB8fCB2YWwgPT09IFwiMlwiIHx8IHZhbCA9PT0gMikge1xuXHRcdHNJY29uID0gXCJzYXAtaWNvbjovL21lc3NhZ2Utd2FybmluZ1wiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIiB8fCB2YWwgPT09IFwiM1wiIHx8IHZhbCA9PT0gMykge1xuXHRcdHNJY29uID0gXCJzYXAtaWNvbjovL21lc3NhZ2Utc3VjY2Vzc1wiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvSW5mb3JtYXRpb25cIiB8fCB2YWwgPT09IFwiNVwiIHx8IHZhbCA9PT0gNSkge1xuXHRcdHNJY29uID0gXCJzYXAtaWNvbjovL21lc3NhZ2UtaW5mb3JtYXRpb25cIjtcblx0fSBlbHNlIHtcblx0XHRzSWNvbiA9IFwiXCI7XG5cdH1cblx0cmV0dXJuIHNJY29uO1xufTtcbmZvcm1hdENyaXRpY2FsaXR5SWNvbi5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRDcml0aWNhbGl0eUljb25cIjtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdENyaXRpY2FsaXR5VmFsdWVTdGF0ZSA9ICh2YWw/OiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRsZXQgc1ZhbHVlU3RhdGU6IHN0cmluZztcblx0aWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvTmVnYXRpdmVcIiB8fCB2YWwgPT09IFwiMVwiIHx8IHZhbCA9PT0gMSkge1xuXHRcdHNWYWx1ZVN0YXRlID0gXCJFcnJvclwiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvQ3JpdGljYWxcIiB8fCB2YWwgPT09IFwiMlwiIHx8IHZhbCA9PT0gMikge1xuXHRcdHNWYWx1ZVN0YXRlID0gXCJXYXJuaW5nXCI7XG5cdH0gZWxzZSBpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Qb3NpdGl2ZVwiIHx8IHZhbCA9PT0gXCIzXCIgfHwgdmFsID09PSAzKSB7XG5cdFx0c1ZhbHVlU3RhdGUgPSBcIlN1Y2Nlc3NcIjtcblx0fSBlbHNlIGlmICh2YWwgPT09IFwiVUkuQ3JpdGljYWxpdHlUeXBlL0luZm9ybWF0aW9uXCIgfHwgdmFsID09PSBcIjVcIiB8fCB2YWwgPT09IDUpIHtcblx0XHRzVmFsdWVTdGF0ZSA9IFwiSW5mb3JtYXRpb25cIjtcblx0fSBlbHNlIHtcblx0XHRzVmFsdWVTdGF0ZSA9IFwiTm9uZVwiO1xuXHR9XG5cdHJldHVybiBzVmFsdWVTdGF0ZTtcbn07XG5mb3JtYXRDcml0aWNhbGl0eVZhbHVlU3RhdGUuX19mdW5jdGlvbk5hbWUgPSBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuVmFsdWVGb3JtYXR0ZXIjZm9ybWF0Q3JpdGljYWxpdHlWYWx1ZVN0YXRlXCI7XG5cbmV4cG9ydCBjb25zdCBmb3JtYXRDcml0aWNhbGl0eUJ1dHRvblR5cGUgPSAodmFsPzogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcblx0bGV0IHNUeXBlOiBzdHJpbmc7XG5cdGlmICh2YWwgPT09IFwiVUkuQ3JpdGljYWxpdHlUeXBlL05lZ2F0aXZlXCIgfHwgdmFsID09PSBcIjFcIiB8fCB2YWwgPT09IDEpIHtcblx0XHRzVHlwZSA9IFwiUmVqZWN0XCI7XG5cdH0gZWxzZSBpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Qb3NpdGl2ZVwiIHx8IHZhbCA9PT0gXCIzXCIgfHwgdmFsID09PSAzKSB7XG5cdFx0c1R5cGUgPSBcIkFjY2VwdFwiO1xuXHR9IGVsc2Uge1xuXHRcdHNUeXBlID0gXCJEZWZhdWx0XCI7XG5cdH1cblx0cmV0dXJuIHNUeXBlO1xufTtcbmZvcm1hdENyaXRpY2FsaXR5QnV0dG9uVHlwZS5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRDcml0aWNhbGl0eUJ1dHRvblR5cGVcIjtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdENyaXRpY2FsaXR5Q29sb3JNaWNyb0NoYXJ0ID0gKHZhbD86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG5cdGxldCBzQ29sb3I6IHN0cmluZztcblx0aWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvTmVnYXRpdmVcIiB8fCB2YWwgPT09IFwiMVwiIHx8IHZhbCA9PT0gMSkge1xuXHRcdHNDb2xvciA9IFwiRXJyb3JcIjtcblx0fSBlbHNlIGlmICh2YWwgPT09IFwiVUkuQ3JpdGljYWxpdHlUeXBlL0NyaXRpY2FsXCIgfHwgdmFsID09PSBcIjJcIiB8fCB2YWwgPT09IDIpIHtcblx0XHRzQ29sb3IgPSBcIkNyaXRpY2FsXCI7XG5cdH0gZWxzZSBpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Qb3NpdGl2ZVwiIHx8IHZhbCA9PT0gXCIzXCIgfHwgdmFsID09PSAzKSB7XG5cdFx0c0NvbG9yID0gXCJHb29kXCI7XG5cdH0gZWxzZSB7XG5cdFx0c0NvbG9yID0gXCJOZXV0cmFsXCI7XG5cdH1cblx0cmV0dXJuIHNDb2xvcjtcbn07XG5mb3JtYXRDcml0aWNhbGl0eUNvbG9yTWljcm9DaGFydC5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRDcml0aWNhbGl0eUNvbG9yTWljcm9DaGFydFwiO1xuXG5leHBvcnQgY29uc3QgZm9ybWF0UHJvZ3Jlc3NJbmRpY2F0b3JUZXh0ID0gKHZhbHVlOiBhbnksIHRhcmdldDogYW55LCB1bml0OiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRpZiAodmFsdWUgJiYgdGFyZ2V0ICYmIHVuaXQpIHtcblx0XHRjb25zdCB1bml0U3BsaXQgPSB1bml0LnNwbGl0KFwiLVwiKTtcblx0XHRjb25zdCBzZWFyY2hVbml0ID0gYCR7dW5pdFNwbGl0WzFdID09PSB1bmRlZmluZWQgPyB1bml0IDogdW5pdFNwbGl0WzFdfS1uYXJyb3dgO1xuXHRcdGNvbnN0IGRhdGVGb3JtYXQgPSBEYXRlRm9ybWF0LmdldERhdGVJbnN0YW5jZSgpIGFzIGFueTtcblx0XHRjb25zdCBsb2NhbGVEYXRhID0gZGF0ZUZvcm1hdC5vTG9jYWxlRGF0YS5tRGF0YTtcblx0XHRjb25zdCBvUmVzb3VyY2VNb2RlbCA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLm1hY3Jvc1wiKTtcblx0XHRsZXQgdW5pdERpc3BsYXllZCA9IHVuaXQ7XG5cdFx0aWYgKGxvY2FsZURhdGE/LmRhdGVGaWVsZHNbc2VhcmNoVW5pdF0/LmRpc3BsYXlOYW1lKSB7XG5cdFx0XHR1bml0RGlzcGxheWVkID0gbG9jYWxlRGF0YS5kYXRlRmllbGRzW3NlYXJjaFVuaXRdLmRpc3BsYXlOYW1lO1xuXHRcdH0gZWxzZSBpZiAobG9jYWxlRGF0YT8udW5pdHM/LnNob3J0W3VuaXRdPy5kaXNwbGF5TmFtZSkge1xuXHRcdFx0dW5pdERpc3BsYXllZCA9IGxvY2FsZURhdGEudW5pdHMuc2hvcnRbdW5pdF0uZGlzcGxheU5hbWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9SZXNvdXJjZU1vZGVsLmdldFRleHQoXCJUX0NPTU1PTl9QUk9HUkVTU19JTkRJQ0FUT1JfRElTUExBWV9WQUxVRV9XSVRIX1VPTVwiLCBbdmFsdWUsIHRhcmdldCwgdW5pdERpc3BsYXllZF0pO1xuXHR9XG59O1xuZm9ybWF0UHJvZ3Jlc3NJbmRpY2F0b3JUZXh0Ll9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlZhbHVlRm9ybWF0dGVyI2Zvcm1hdFByb2dyZXNzSW5kaWNhdG9yVGV4dFwiO1xuXG52YWx1ZUZvcm1hdHRlcnMuZm9ybWF0V2l0aEJyYWNrZXRzID0gZm9ybWF0V2l0aEJyYWNrZXRzO1xudmFsdWVGb3JtYXR0ZXJzLmZvcm1hdE9QVGl0bGUgPSBmb3JtYXRPUFRpdGxlO1xudmFsdWVGb3JtYXR0ZXJzLmZvcm1hdFdpdGhQZXJjZW50YWdlID0gZm9ybWF0V2l0aFBlcmNlbnRhZ2U7XG52YWx1ZUZvcm1hdHRlcnMuY29tcHV0ZVBlcmNlbnRhZ2UgPSBjb21wdXRlUGVyY2VudGFnZTtcbnZhbHVlRm9ybWF0dGVycy5mb3JtYXRDcml0aWNhbGl0eUljb24gPSBmb3JtYXRDcml0aWNhbGl0eUljb247XG52YWx1ZUZvcm1hdHRlcnMuZm9ybWF0Q3JpdGljYWxpdHlWYWx1ZVN0YXRlID0gZm9ybWF0Q3JpdGljYWxpdHlWYWx1ZVN0YXRlO1xudmFsdWVGb3JtYXR0ZXJzLmZvcm1hdENyaXRpY2FsaXR5QnV0dG9uVHlwZSA9IGZvcm1hdENyaXRpY2FsaXR5QnV0dG9uVHlwZTtcbnZhbHVlRm9ybWF0dGVycy5mb3JtYXRDcml0aWNhbGl0eUNvbG9yTWljcm9DaGFydCA9IGZvcm1hdENyaXRpY2FsaXR5Q29sb3JNaWNyb0NoYXJ0O1xudmFsdWVGb3JtYXR0ZXJzLmZvcm1hdFByb2dyZXNzSW5kaWNhdG9yVGV4dCA9IGZvcm1hdFByb2dyZXNzSW5kaWNhdG9yVGV4dDtcbi8qKlxuICogQGdsb2JhbFxuICovXG5leHBvcnQgZGVmYXVsdCB2YWx1ZUZvcm1hdHRlcnM7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQUVBO0FBQ0E7QUFDQTtB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