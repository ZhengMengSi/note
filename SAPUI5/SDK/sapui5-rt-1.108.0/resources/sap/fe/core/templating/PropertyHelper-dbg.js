/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  /**
   * Identify if the given property passed is a "Property" (has a _type).
   *
   * @param property A target property to evaluate
   * @returns Validate that property is a Property
   */
  function isProperty(property) {
    return property && property.hasOwnProperty("_type") && property._type === "Property";
  }
  /**
   * Check whether the property has the Core.Computed annotation or not.
   *
   * @param oProperty The target property
   * @returns `true` if the property is computed
   */


  _exports.isProperty = isProperty;

  var isComputed = function (oProperty) {
    var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3;

    return !!((_oProperty$annotation = oProperty.annotations) !== null && _oProperty$annotation !== void 0 && (_oProperty$annotation2 = _oProperty$annotation.Core) !== null && _oProperty$annotation2 !== void 0 && (_oProperty$annotation3 = _oProperty$annotation2.Computed) !== null && _oProperty$annotation3 !== void 0 && _oProperty$annotation3.valueOf());
  };
  /**
   * Identify if the given property passed is a "NavigationProperty".
   *
   * @param property A target property to evaluate
   * @returns Validate that property is a NavigationProperty
   */


  _exports.isComputed = isComputed;

  function isNavigationProperty(property) {
    return property && property.hasOwnProperty("_type") && property._type === "NavigationProperty";
  }
  /**
   * Check whether the property has the Core.Immutable annotation or not.
   *
   * @param oProperty The target property
   * @returns `true` if it's immutable
   */


  _exports.isNavigationProperty = isNavigationProperty;

  var isImmutable = function (oProperty) {
    var _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6;

    return !!((_oProperty$annotation4 = oProperty.annotations) !== null && _oProperty$annotation4 !== void 0 && (_oProperty$annotation5 = _oProperty$annotation4.Core) !== null && _oProperty$annotation5 !== void 0 && (_oProperty$annotation6 = _oProperty$annotation5.Immutable) !== null && _oProperty$annotation6 !== void 0 && _oProperty$annotation6.valueOf());
  };
  /**
   * Check whether the property is a key or not.
   *
   * @param oProperty The target property
   * @returns `true` if it's a key
   */


  _exports.isImmutable = isImmutable;

  var isKey = function (oProperty) {
    return !!oProperty.isKey;
  };
  /**
   * Checks whether the property has a date time or not.
   *
   * @param oProperty
   * @returns `true` if it is of type date / datetime / datetimeoffset
   */


  _exports.isKey = isKey;

  var hasDateType = function (oProperty) {
    return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset"].indexOf(oProperty.type) !== -1;
  };
  /**
   * Retrieve the label annotation.
   *
   * @param oProperty The target property
   * @returns The label string
   */


  _exports.hasDateType = hasDateType;

  var getLabel = function (oProperty) {
    var _oProperty$annotation7, _oProperty$annotation8, _oProperty$annotation9;

    return ((_oProperty$annotation7 = oProperty.annotations) === null || _oProperty$annotation7 === void 0 ? void 0 : (_oProperty$annotation8 = _oProperty$annotation7.Common) === null || _oProperty$annotation8 === void 0 ? void 0 : (_oProperty$annotation9 = _oProperty$annotation8.Label) === null || _oProperty$annotation9 === void 0 ? void 0 : _oProperty$annotation9.toString()) || "";
  };
  /**
   * Check whether the property has a semantic object defined or not.
   *
   * @param oProperty The target property
   * @returns `true` if it has a semantic object
   */


  _exports.getLabel = getLabel;

  var hasSemanticObject = function (oProperty) {
    var _oProperty$annotation10, _oProperty$annotation11;

    return !!((_oProperty$annotation10 = oProperty.annotations) !== null && _oProperty$annotation10 !== void 0 && (_oProperty$annotation11 = _oProperty$annotation10.Common) !== null && _oProperty$annotation11 !== void 0 && _oProperty$annotation11.SemanticObject);
  };

  _exports.hasSemanticObject = hasSemanticObject;

  var isPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "Path";
  };

  _exports.isPathExpression = isPathExpression;

  var isPropertyPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "PropertyPath";
  };

  _exports.isPropertyPathExpression = isPropertyPathExpression;

  var isAnnotationPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "AnnotationPath";
  };
  /**
   * Retrieves the timezone property associated to the property, if applicable.
   *
   * @param oProperty The target property
   * @returns The timezone property, if it exists
   */


  _exports.isAnnotationPathExpression = isAnnotationPathExpression;

  var getAssociatedTimezoneProperty = function (oProperty) {
    var _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation12 = oProperty.annotations) === null || _oProperty$annotation12 === void 0 ? void 0 : (_oProperty$annotation13 = _oProperty$annotation12.Common) === null || _oProperty$annotation13 === void 0 ? void 0 : _oProperty$annotation13.Timezone) ? (_oProperty$annotation14 = oProperty.annotations) === null || _oProperty$annotation14 === void 0 ? void 0 : (_oProperty$annotation15 = _oProperty$annotation14.Common) === null || _oProperty$annotation15 === void 0 ? void 0 : _oProperty$annotation15.Timezone.$target : undefined;
  };
  /**
   * Retrieves the timezone property path associated to the property, if applicable.
   *
   * @param oProperty The target property
   * @returns The timezone property path, if it exists
   */


  _exports.getAssociatedTimezoneProperty = getAssociatedTimezoneProperty;

  var getAssociatedTimezonePropertyPath = function (oProperty) {
    var _oProperty$annotation16, _oProperty$annotation17, _oProperty$annotation18, _oProperty$annotation19, _oProperty$annotation20;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation16 = oProperty.annotations) === null || _oProperty$annotation16 === void 0 ? void 0 : (_oProperty$annotation17 = _oProperty$annotation16.Common) === null || _oProperty$annotation17 === void 0 ? void 0 : _oProperty$annotation17.Timezone) ? oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation18 = oProperty.annotations) === null || _oProperty$annotation18 === void 0 ? void 0 : (_oProperty$annotation19 = _oProperty$annotation18.Common) === null || _oProperty$annotation19 === void 0 ? void 0 : (_oProperty$annotation20 = _oProperty$annotation19.Timezone) === null || _oProperty$annotation20 === void 0 ? void 0 : _oProperty$annotation20.path : undefined;
  };
  /**
   * Retrieves the associated text property for that property, if it exists.
   *
   * @param oProperty The target property
   * @returns The text property, if it exists
   */


  _exports.getAssociatedTimezonePropertyPath = getAssociatedTimezonePropertyPath;

  var getAssociatedTextProperty = function (oProperty) {
    var _oProperty$annotation21, _oProperty$annotation22, _oProperty$annotation23, _oProperty$annotation24;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation21 = oProperty.annotations) === null || _oProperty$annotation21 === void 0 ? void 0 : (_oProperty$annotation22 = _oProperty$annotation21.Common) === null || _oProperty$annotation22 === void 0 ? void 0 : _oProperty$annotation22.Text) ? (_oProperty$annotation23 = oProperty.annotations) === null || _oProperty$annotation23 === void 0 ? void 0 : (_oProperty$annotation24 = _oProperty$annotation23.Common) === null || _oProperty$annotation24 === void 0 ? void 0 : _oProperty$annotation24.Text.$target : undefined;
  };
  /**
   * Retrieves the unit property associated to the property, if applicable.
   *
   * @param oProperty The target property
   * @returns The unit property, if it exists
   */


  _exports.getAssociatedTextProperty = getAssociatedTextProperty;

  var getAssociatedUnitProperty = function (oProperty) {
    var _oProperty$annotation25, _oProperty$annotation26, _oProperty$annotation27, _oProperty$annotation28;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation25 = oProperty.annotations) === null || _oProperty$annotation25 === void 0 ? void 0 : (_oProperty$annotation26 = _oProperty$annotation25.Measures) === null || _oProperty$annotation26 === void 0 ? void 0 : _oProperty$annotation26.Unit) ? (_oProperty$annotation27 = oProperty.annotations) === null || _oProperty$annotation27 === void 0 ? void 0 : (_oProperty$annotation28 = _oProperty$annotation27.Measures) === null || _oProperty$annotation28 === void 0 ? void 0 : _oProperty$annotation28.Unit.$target : undefined;
  };

  _exports.getAssociatedUnitProperty = getAssociatedUnitProperty;

  var getAssociatedUnitPropertyPath = function (oProperty) {
    var _oProperty$annotation29, _oProperty$annotation30, _oProperty$annotation31, _oProperty$annotation32;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation29 = oProperty.annotations) === null || _oProperty$annotation29 === void 0 ? void 0 : (_oProperty$annotation30 = _oProperty$annotation29.Measures) === null || _oProperty$annotation30 === void 0 ? void 0 : _oProperty$annotation30.Unit) ? (_oProperty$annotation31 = oProperty.annotations) === null || _oProperty$annotation31 === void 0 ? void 0 : (_oProperty$annotation32 = _oProperty$annotation31.Measures) === null || _oProperty$annotation32 === void 0 ? void 0 : _oProperty$annotation32.Unit.path : undefined;
  };
  /**
   * Retrieves the associated currency property for that property if it exists.
   *
   * @param oProperty The target property
   * @returns The unit property, if it exists
   */


  _exports.getAssociatedUnitPropertyPath = getAssociatedUnitPropertyPath;

  var getAssociatedCurrencyProperty = function (oProperty) {
    var _oProperty$annotation33, _oProperty$annotation34, _oProperty$annotation35, _oProperty$annotation36;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation33 = oProperty.annotations) === null || _oProperty$annotation33 === void 0 ? void 0 : (_oProperty$annotation34 = _oProperty$annotation33.Measures) === null || _oProperty$annotation34 === void 0 ? void 0 : _oProperty$annotation34.ISOCurrency) ? (_oProperty$annotation35 = oProperty.annotations) === null || _oProperty$annotation35 === void 0 ? void 0 : (_oProperty$annotation36 = _oProperty$annotation35.Measures) === null || _oProperty$annotation36 === void 0 ? void 0 : _oProperty$annotation36.ISOCurrency.$target : undefined;
  };

  _exports.getAssociatedCurrencyProperty = getAssociatedCurrencyProperty;

  var getAssociatedCurrencyPropertyPath = function (oProperty) {
    var _oProperty$annotation37, _oProperty$annotation38, _oProperty$annotation39, _oProperty$annotation40;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation37 = oProperty.annotations) === null || _oProperty$annotation37 === void 0 ? void 0 : (_oProperty$annotation38 = _oProperty$annotation37.Measures) === null || _oProperty$annotation38 === void 0 ? void 0 : _oProperty$annotation38.ISOCurrency) ? (_oProperty$annotation39 = oProperty.annotations) === null || _oProperty$annotation39 === void 0 ? void 0 : (_oProperty$annotation40 = _oProperty$annotation39.Measures) === null || _oProperty$annotation40 === void 0 ? void 0 : _oProperty$annotation40.ISOCurrency.path : undefined;
  };
  /**
   * Retrieves the Common.Text property path if it exists.
   *
   * @param oProperty The target property
   * @returns The Common.Text property path or undefined if it does not exist
   */


  _exports.getAssociatedCurrencyPropertyPath = getAssociatedCurrencyPropertyPath;

  var getAssociatedTextPropertyPath = function (oProperty) {
    var _oProperty$annotation41, _oProperty$annotation42, _oProperty$annotation43, _oProperty$annotation44;

    return isPathExpression((_oProperty$annotation41 = oProperty.annotations) === null || _oProperty$annotation41 === void 0 ? void 0 : (_oProperty$annotation42 = _oProperty$annotation41.Common) === null || _oProperty$annotation42 === void 0 ? void 0 : _oProperty$annotation42.Text) ? (_oProperty$annotation43 = oProperty.annotations) === null || _oProperty$annotation43 === void 0 ? void 0 : (_oProperty$annotation44 = _oProperty$annotation43.Common) === null || _oProperty$annotation44 === void 0 ? void 0 : _oProperty$annotation44.Text.path : undefined;
  };
  /**
   * Retrieves the TargetValue from the DataPoint.
   *
   * @param {Property} oProperty the target property or DataPoint
   * @returns {string | undefined} The TargetValue
   */


  _exports.getAssociatedTextPropertyPath = getAssociatedTextPropertyPath;

  var getTargetValueOnDataPoint = function (oProperty) {
    var _oProperty$annotation45, _oProperty$annotation46, _oProperty$annotation47, _oProperty$annotation48, _oProperty$annotation49, _oProperty$annotation50, _oProperty$TargetValu;

    var sTargetValue = ((_oProperty$annotation45 = oProperty.annotations) === null || _oProperty$annotation45 === void 0 ? void 0 : (_oProperty$annotation46 = _oProperty$annotation45.UI) === null || _oProperty$annotation46 === void 0 ? void 0 : (_oProperty$annotation47 = _oProperty$annotation46.DataFieldDefault) === null || _oProperty$annotation47 === void 0 ? void 0 : (_oProperty$annotation48 = _oProperty$annotation47.Target) === null || _oProperty$annotation48 === void 0 ? void 0 : (_oProperty$annotation49 = _oProperty$annotation48.$target) === null || _oProperty$annotation49 === void 0 ? void 0 : (_oProperty$annotation50 = _oProperty$annotation49.TargetValue) === null || _oProperty$annotation50 === void 0 ? void 0 : _oProperty$annotation50.toString()) || ((_oProperty$TargetValu = oProperty.TargetValue) === null || _oProperty$TargetValu === void 0 ? void 0 : _oProperty$TargetValu.toString());
    return sTargetValue ? sTargetValue : undefined;
  };
  /**
   * Check whether the property has a value help annotation defined or not.
   *
   * @param oProperty The target property
   * @returns `true` if it has a value help
   */


  _exports.getTargetValueOnDataPoint = getTargetValueOnDataPoint;

  var hasValueHelp = function (oProperty) {
    var _oProperty$annotation51, _oProperty$annotation52, _oProperty$annotation53, _oProperty$annotation54, _oProperty$annotation55, _oProperty$annotation56, _oProperty$annotation57, _oProperty$annotation58;

    return !!((_oProperty$annotation51 = oProperty.annotations) !== null && _oProperty$annotation51 !== void 0 && (_oProperty$annotation52 = _oProperty$annotation51.Common) !== null && _oProperty$annotation52 !== void 0 && _oProperty$annotation52.ValueList) || !!((_oProperty$annotation53 = oProperty.annotations) !== null && _oProperty$annotation53 !== void 0 && (_oProperty$annotation54 = _oProperty$annotation53.Common) !== null && _oProperty$annotation54 !== void 0 && _oProperty$annotation54.ValueListReferences) || !!((_oProperty$annotation55 = oProperty.annotations) !== null && _oProperty$annotation55 !== void 0 && (_oProperty$annotation56 = _oProperty$annotation55.Common) !== null && _oProperty$annotation56 !== void 0 && _oProperty$annotation56.ValueListWithFixedValues) || !!((_oProperty$annotation57 = oProperty.annotations) !== null && _oProperty$annotation57 !== void 0 && (_oProperty$annotation58 = _oProperty$annotation57.Common) !== null && _oProperty$annotation58 !== void 0 && _oProperty$annotation58.ValueListMapping);
  };
  /**
   * Check whether the property has a value help with fixed value annotation defined or not.
   *
   * @param oProperty The target property
   * @returns `true` if it has a value help
   */


  _exports.hasValueHelp = hasValueHelp;

  var hasValueHelpWithFixedValues = function (oProperty) {
    var _oProperty$annotation59, _oProperty$annotation60, _oProperty$annotation61;

    return !!(oProperty !== null && oProperty !== void 0 && (_oProperty$annotation59 = oProperty.annotations) !== null && _oProperty$annotation59 !== void 0 && (_oProperty$annotation60 = _oProperty$annotation59.Common) !== null && _oProperty$annotation60 !== void 0 && (_oProperty$annotation61 = _oProperty$annotation60.ValueListWithFixedValues) !== null && _oProperty$annotation61 !== void 0 && _oProperty$annotation61.valueOf());
  };
  /**
   * Check whether the property has a value help for validation annotation defined or not.
   *
   * @param oProperty The target property
   * @returns `true` if it has a value help
   */


  _exports.hasValueHelpWithFixedValues = hasValueHelpWithFixedValues;

  var hasValueListForValidation = function (oProperty) {
    var _oProperty$annotation62, _oProperty$annotation63;

    return ((_oProperty$annotation62 = oProperty.annotations) === null || _oProperty$annotation62 === void 0 ? void 0 : (_oProperty$annotation63 = _oProperty$annotation62.Common) === null || _oProperty$annotation63 === void 0 ? void 0 : _oProperty$annotation63.ValueListForValidation) !== undefined;
  };

  _exports.hasValueListForValidation = hasValueListForValidation;

  var hasTimezone = function (oProperty) {
    var _oProperty$annotation64, _oProperty$annotation65;

    return ((_oProperty$annotation64 = oProperty.annotations) === null || _oProperty$annotation64 === void 0 ? void 0 : (_oProperty$annotation65 = _oProperty$annotation64.Common) === null || _oProperty$annotation65 === void 0 ? void 0 : _oProperty$annotation65.Timezone) !== undefined;
  };
  /**
   * Checks whether the property is a unit property.
   *
   * @param oProperty The property to check
   * @returns `true` if it is a unit
   */


  _exports.hasTimezone = hasTimezone;

  var isUnit = function (oProperty) {
    var _oProperty$annotation66, _oProperty$annotation67, _oProperty$annotation68;

    return !!((_oProperty$annotation66 = oProperty.annotations) !== null && _oProperty$annotation66 !== void 0 && (_oProperty$annotation67 = _oProperty$annotation66.Common) !== null && _oProperty$annotation67 !== void 0 && (_oProperty$annotation68 = _oProperty$annotation67.IsUnit) !== null && _oProperty$annotation68 !== void 0 && _oProperty$annotation68.valueOf());
  };
  /**
   * Checks whether the property has a unit property.
   *
   * @param oProperty The property to check
   * @returns `true` if it has a unit
   */


  _exports.isUnit = isUnit;

  var hasUnit = function (oProperty) {
    var _oProperty$annotation69, _oProperty$annotation70;

    return ((_oProperty$annotation69 = oProperty.annotations) === null || _oProperty$annotation69 === void 0 ? void 0 : (_oProperty$annotation70 = _oProperty$annotation69.Measures) === null || _oProperty$annotation70 === void 0 ? void 0 : _oProperty$annotation70.Unit) !== undefined;
  };
  /**
   * Checks whether the property is a currency property.
   *
   * @param oProperty The property to check
   * @returns `true` if it is a currency
   */


  _exports.hasUnit = hasUnit;

  var isCurrency = function (oProperty) {
    var _oProperty$annotation71, _oProperty$annotation72, _oProperty$annotation73;

    return !!((_oProperty$annotation71 = oProperty.annotations) !== null && _oProperty$annotation71 !== void 0 && (_oProperty$annotation72 = _oProperty$annotation71.Common) !== null && _oProperty$annotation72 !== void 0 && (_oProperty$annotation73 = _oProperty$annotation72.IsCurrency) !== null && _oProperty$annotation73 !== void 0 && _oProperty$annotation73.valueOf());
  };
  /**
   * Checks whether the property has a currency property.
   *
   * @param oProperty The property to check
   * @returns `true` if it has a currency
   */


  _exports.isCurrency = isCurrency;

  var hasCurrency = function (oProperty) {
    var _oProperty$annotation74, _oProperty$annotation75;

    return ((_oProperty$annotation74 = oProperty.annotations) === null || _oProperty$annotation74 === void 0 ? void 0 : (_oProperty$annotation75 = _oProperty$annotation74.Measures) === null || _oProperty$annotation75 === void 0 ? void 0 : _oProperty$annotation75.ISOCurrency) !== undefined;
  };

  _exports.hasCurrency = hasCurrency;

  var hasStaticPercentUnit = function (oProperty) {
    var _oProperty$annotation76, _oProperty$annotation77, _oProperty$annotation78;

    return (oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation76 = oProperty.annotations) === null || _oProperty$annotation76 === void 0 ? void 0 : (_oProperty$annotation77 = _oProperty$annotation76.Measures) === null || _oProperty$annotation77 === void 0 ? void 0 : (_oProperty$annotation78 = _oProperty$annotation77.Unit) === null || _oProperty$annotation78 === void 0 ? void 0 : _oProperty$annotation78.toString()) === "%";
  };

  _exports.hasStaticPercentUnit = hasStaticPercentUnit;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc1Byb3BlcnR5IiwicHJvcGVydHkiLCJoYXNPd25Qcm9wZXJ0eSIsIl90eXBlIiwiaXNDb21wdXRlZCIsIm9Qcm9wZXJ0eSIsImFubm90YXRpb25zIiwiQ29yZSIsIkNvbXB1dGVkIiwidmFsdWVPZiIsImlzTmF2aWdhdGlvblByb3BlcnR5IiwiaXNJbW11dGFibGUiLCJJbW11dGFibGUiLCJpc0tleSIsImhhc0RhdGVUeXBlIiwiaW5kZXhPZiIsInR5cGUiLCJnZXRMYWJlbCIsIkNvbW1vbiIsIkxhYmVsIiwidG9TdHJpbmciLCJoYXNTZW1hbnRpY09iamVjdCIsIlNlbWFudGljT2JqZWN0IiwiaXNQYXRoRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJ1bmRlZmluZWQiLCJpc1Byb3BlcnR5UGF0aEV4cHJlc3Npb24iLCJpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbiIsImdldEFzc29jaWF0ZWRUaW1lem9uZVByb3BlcnR5IiwiVGltZXpvbmUiLCIkdGFyZ2V0IiwiZ2V0QXNzb2NpYXRlZFRpbWV6b25lUHJvcGVydHlQYXRoIiwicGF0aCIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHkiLCJUZXh0IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSIsIk1lYXN1cmVzIiwiVW5pdCIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHlQYXRoIiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJJU09DdXJyZW5jeSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5UGF0aCIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoIiwiZ2V0VGFyZ2V0VmFsdWVPbkRhdGFQb2ludCIsInNUYXJnZXRWYWx1ZSIsIlVJIiwiRGF0YUZpZWxkRGVmYXVsdCIsIlRhcmdldCIsIlRhcmdldFZhbHVlIiwiaGFzVmFsdWVIZWxwIiwiVmFsdWVMaXN0IiwiVmFsdWVMaXN0UmVmZXJlbmNlcyIsIlZhbHVlTGlzdFdpdGhGaXhlZFZhbHVlcyIsIlZhbHVlTGlzdE1hcHBpbmciLCJoYXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMiLCJoYXNWYWx1ZUxpc3RGb3JWYWxpZGF0aW9uIiwiVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiIsImhhc1RpbWV6b25lIiwiaXNVbml0IiwiSXNVbml0IiwiaGFzVW5pdCIsImlzQ3VycmVuY3kiLCJJc0N1cnJlbmN5IiwiaGFzQ3VycmVuY3kiLCJoYXNTdGF0aWNQZXJjZW50VW5pdCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiUHJvcGVydHlIZWxwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOYXZpZ2F0aW9uUHJvcGVydHksIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbiwgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcblxuLyoqXG4gKiBJZGVudGlmeSBpZiB0aGUgZ2l2ZW4gcHJvcGVydHkgcGFzc2VkIGlzIGEgXCJQcm9wZXJ0eVwiIChoYXMgYSBfdHlwZSkuXG4gKlxuICogQHBhcmFtIHByb3BlcnR5IEEgdGFyZ2V0IHByb3BlcnR5IHRvIGV2YWx1YXRlXG4gKiBAcmV0dXJucyBWYWxpZGF0ZSB0aGF0IHByb3BlcnR5IGlzIGEgUHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvcGVydHkocHJvcGVydHk6IGFueSk6IHByb3BlcnR5IGlzIFByb3BlcnR5IHtcblx0cmV0dXJuIHByb3BlcnR5ICYmIChwcm9wZXJ0eSBhcyBQcm9wZXJ0eSkuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiAocHJvcGVydHkgYXMgUHJvcGVydHkpLl90eXBlID09PSBcIlByb3BlcnR5XCI7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIHRoZSBDb3JlLkNvbXB1dGVkIGFubm90YXRpb24gb3Igbm90LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSBpcyBjb21wdXRlZFxuICovXG5leHBvcnQgY29uc3QgaXNDb21wdXRlZCA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29yZT8uQ29tcHV0ZWQ/LnZhbHVlT2YoKTtcbn07XG5cbi8qKlxuICogSWRlbnRpZnkgaWYgdGhlIGdpdmVuIHByb3BlcnR5IHBhc3NlZCBpcyBhIFwiTmF2aWdhdGlvblByb3BlcnR5XCIuXG4gKlxuICogQHBhcmFtIHByb3BlcnR5IEEgdGFyZ2V0IHByb3BlcnR5IHRvIGV2YWx1YXRlXG4gKiBAcmV0dXJucyBWYWxpZGF0ZSB0aGF0IHByb3BlcnR5IGlzIGEgTmF2aWdhdGlvblByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hdmlnYXRpb25Qcm9wZXJ0eShwcm9wZXJ0eTogYW55KTogcHJvcGVydHkgaXMgTmF2aWdhdGlvblByb3BlcnR5IHtcblx0cmV0dXJuIChcblx0XHRwcm9wZXJ0eSAmJlxuXHRcdChwcm9wZXJ0eSBhcyBOYXZpZ2F0aW9uUHJvcGVydHkpLmhhc093blByb3BlcnR5KFwiX3R5cGVcIikgJiZcblx0XHQocHJvcGVydHkgYXMgTmF2aWdhdGlvblByb3BlcnR5KS5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIlxuXHQpO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyB0aGUgQ29yZS5JbW11dGFibGUgYW5ub3RhdGlvbiBvciBub3QuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQncyBpbW11dGFibGVcbiAqL1xuZXhwb3J0IGNvbnN0IGlzSW1tdXRhYmxlID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db3JlPy5JbW11dGFibGU/LnZhbHVlT2YoKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaXMgYSBrZXkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMgYHRydWVgIGlmIGl0J3MgYSBrZXlcbiAqL1xuZXhwb3J0IGNvbnN0IGlzS2V5ID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmlzS2V5O1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgZGF0ZSB0aW1lIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5XG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgb2YgdHlwZSBkYXRlIC8gZGF0ZXRpbWUgLyBkYXRldGltZW9mZnNldFxuICovXG5leHBvcnQgY29uc3QgaGFzRGF0ZVR5cGUgPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gW1wiRWRtLkRhdGVcIiwgXCJFZG0uRGF0ZVRpbWVcIiwgXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIl0uaW5kZXhPZihvUHJvcGVydHkudHlwZSkgIT09IC0xO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgbGFiZWwgYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIFRoZSBsYWJlbCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGdldExhYmVsID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBzdHJpbmcge1xuXHRyZXR1cm4gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy50b1N0cmluZygpIHx8IFwiXCI7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIHNlbWFudGljIG9iamVjdCBkZWZpbmVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBpdCBoYXMgYSBzZW1hbnRpYyBvYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1NlbWFudGljT2JqZWN0ID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0O1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUGF0aEV4cHJlc3Npb24gPSBmdW5jdGlvbiA8VD4oZXhwcmVzc2lvbjogYW55KTogZXhwcmVzc2lvbiBpcyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gISFleHByZXNzaW9uICYmIGV4cHJlc3Npb24udHlwZSAhPT0gdW5kZWZpbmVkICYmIGV4cHJlc3Npb24udHlwZSA9PT0gXCJQYXRoXCI7XG59O1xuZXhwb3J0IGNvbnN0IGlzUHJvcGVydHlQYXRoRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIDxUPihleHByZXNzaW9uOiBhbnkpOiBleHByZXNzaW9uIGlzIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiAhIWV4cHJlc3Npb24gJiYgZXhwcmVzc2lvbi50eXBlICE9PSB1bmRlZmluZWQgJiYgZXhwcmVzc2lvbi50eXBlID09PSBcIlByb3BlcnR5UGF0aFwiO1xufTtcbmV4cG9ydCBjb25zdCBpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIDxUPihleHByZXNzaW9uOiBhbnkpOiBleHByZXNzaW9uIGlzIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiAhIWV4cHJlc3Npb24gJiYgZXhwcmVzc2lvbi50eXBlICE9PSB1bmRlZmluZWQgJiYgZXhwcmVzc2lvbi50eXBlID09PSBcIkFubm90YXRpb25QYXRoXCI7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgdGltZXpvbmUgcHJvcGVydHkgYXNzb2NpYXRlZCB0byB0aGUgcHJvcGVydHksIGlmIGFwcGxpY2FibGUuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyBUaGUgdGltZXpvbmUgcHJvcGVydHksIGlmIGl0IGV4aXN0c1xuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZFRpbWV6b25lUHJvcGVydHkgPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IFByb3BlcnR5IHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UaW1lem9uZSlcblx0XHQ/IChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGltZXpvbmUuJHRhcmdldCBhcyB1bmtub3duIGFzIFByb3BlcnR5KVxuXHRcdDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHRpbWV6b25lIHByb3BlcnR5IHBhdGggYXNzb2NpYXRlZCB0byB0aGUgcHJvcGVydHksIGlmIGFwcGxpY2FibGUuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyBUaGUgdGltZXpvbmUgcHJvcGVydHkgcGF0aCwgaWYgaXQgZXhpc3RzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eVBhdGggPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGltZXpvbmUpID8gb1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UaW1lem9uZT8ucGF0aCA6IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBhc3NvY2lhdGVkIHRleHQgcHJvcGVydHkgZm9yIHRoYXQgcHJvcGVydHksIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIFRoZSB0ZXh0IHByb3BlcnR5LCBpZiBpdCBleGlzdHNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHkgPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IFByb3BlcnR5IHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0KVxuXHRcdD8gKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0LiR0YXJnZXQgYXMgdW5rbm93biBhcyBQcm9wZXJ0eSlcblx0XHQ6IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB1bml0IHByb3BlcnR5IGFzc29jaWF0ZWQgdG8gdGhlIHByb3BlcnR5LCBpZiBhcHBsaWNhYmxlLlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMgVGhlIHVuaXQgcHJvcGVydHksIGlmIGl0IGV4aXN0c1xuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogUHJvcGVydHkgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdClcblx0XHQ/IChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0LiR0YXJnZXQgYXMgdW5rbm93biBhcyBQcm9wZXJ0eSlcblx0XHQ6IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5UGF0aCA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LlVuaXQpID8gb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdC5wYXRoIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGFzc29jaWF0ZWQgY3VycmVuY3kgcHJvcGVydHkgZm9yIHRoYXQgcHJvcGVydHkgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMgVGhlIHVuaXQgcHJvcGVydHksIGlmIGl0IGV4aXN0c1xuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkgPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IFByb3BlcnR5IHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5KVxuXHRcdD8gKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5LiR0YXJnZXQgYXMgdW5rbm93biBhcyBQcm9wZXJ0eSlcblx0XHQ6IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGggPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eT8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSkgPyBvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeS5wYXRoIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIENvbW1vbi5UZXh0IHByb3BlcnR5IHBhdGggaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMgVGhlIENvbW1vbi5UZXh0IHByb3BlcnR5IHBhdGggb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXMgbm90IGV4aXN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkVGV4dFByb3BlcnR5UGF0aCA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQpID8gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQucGF0aCA6IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBUYXJnZXRWYWx1ZSBmcm9tIHRoZSBEYXRhUG9pbnQuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHkgb3IgRGF0YVBvaW50XG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfSBUaGUgVGFyZ2V0VmFsdWVcbiAqL1xuXG5leHBvcnQgY29uc3QgZ2V0VGFyZ2V0VmFsdWVPbkRhdGFQb2ludCA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IGFueSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IHNUYXJnZXRWYWx1ZSA9XG5cdFx0b1Byb3BlcnR5LmFubm90YXRpb25zPy5VST8uRGF0YUZpZWxkRGVmYXVsdD8uVGFyZ2V0Py4kdGFyZ2V0Py5UYXJnZXRWYWx1ZT8udG9TdHJpbmcoKSB8fCBvUHJvcGVydHkuVGFyZ2V0VmFsdWU/LnRvU3RyaW5nKCk7XG5cdHJldHVybiBzVGFyZ2V0VmFsdWUgPyBzVGFyZ2V0VmFsdWUgOiB1bmRlZmluZWQ7XG59O1xuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIGFubm90YXRpb24gZGVmaW5lZCBvciBub3QuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaGFzIGEgdmFsdWUgaGVscFxuICovXG5leHBvcnQgY29uc3QgaGFzVmFsdWVIZWxwID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3QgfHxcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RSZWZlcmVuY2VzIHx8XG5cdFx0ISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzIHx8XG5cdFx0ISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0TWFwcGluZ1xuXHQpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIHdpdGggZml4ZWQgdmFsdWUgYW5ub3RhdGlvbiBkZWZpbmVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBpdCBoYXMgYSB2YWx1ZSBoZWxwXG4gKi9cbmV4cG9ydCBjb25zdCBoYXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMgPSBmdW5jdGlvbiAob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LlZhbHVlTGlzdFdpdGhGaXhlZFZhbHVlcz8udmFsdWVPZigpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIGZvciB2YWxpZGF0aW9uIGFubm90YXRpb24gZGVmaW5lZCBvciBub3QuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaGFzIGEgdmFsdWUgaGVscFxuICovXG5leHBvcnQgY29uc3QgaGFzVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiAhPT0gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhc1RpbWV6b25lID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UaW1lem9uZSAhPT0gdW5kZWZpbmVkO1xufTtcbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3BlcnR5IGlzIGEgdW5pdCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVja1xuICogQHJldHVybnMgYHRydWVgIGlmIGl0IGlzIGEgdW5pdFxuICovXG5leHBvcnQgY29uc3QgaXNVbml0ID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LklzVW5pdD8udmFsdWVPZigpO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgdW5pdCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVja1xuICogQHJldHVybnMgYHRydWVgIGlmIGl0IGhhcyBhIHVuaXRcbiAqL1xuXG5leHBvcnQgY29uc3QgaGFzVW5pdCA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0ICE9PSB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBpcyBhIGN1cnJlbmN5IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgYSBjdXJyZW5jeVxuICovXG5leHBvcnQgY29uc3QgaXNDdXJyZW5jeSA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc0N1cnJlbmN5Py52YWx1ZU9mKCk7XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSBjdXJyZW5jeSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVja1xuICogQHJldHVybnMgYHRydWVgIGlmIGl0IGhhcyBhIGN1cnJlbmN5XG4gKi9cbmV4cG9ydCBjb25zdCBoYXNDdXJyZW5jeSA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSAhPT0gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhc1N0YXRpY1BlcmNlbnRVbml0ID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIG9Qcm9wZXJ0eT8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0Py50b1N0cmluZygpID09PSBcIiVcIjtcbn07XG4i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