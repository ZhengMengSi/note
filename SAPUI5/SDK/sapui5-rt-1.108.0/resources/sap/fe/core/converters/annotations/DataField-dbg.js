/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/templating/DisplayModeFormatter", "sap/fe/core/templating/PropertyHelper"], function (DisplayModeFormatter, PropertyHelper) {
  "use strict";

  var _exports = {};
  var isProperty = PropertyHelper.isProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedTimezoneProperty = PropertyHelper.getAssociatedTimezoneProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getDisplayMode = DisplayModeFormatter.getDisplayMode;

  /**
   * Identifies if the given dataFieldAbstract that is passed is a "DataFieldForActionAbstract".
   * DataFieldForActionAbstract has an inline action defined.
   *
   * @param dataField DataField to be evaluated
   * @returns Validates that dataField is a DataFieldForActionAbstractType
   */
  function isDataFieldForActionAbstract(dataField) {
    return dataField.hasOwnProperty("Action");
  }
  /**
   * Identifies if the given dataFieldAbstract that is passed is a "DataField".
   * DataField has a value defined.
   *
   * @param dataField DataField to be evaluated
   * @returns Validate that dataField is a DataFieldTypes
   */


  _exports.isDataFieldForActionAbstract = isDataFieldForActionAbstract;

  function isDataFieldTypes(dataField) {
    return dataField.hasOwnProperty("Value");
  }
  /**
   * Returns whether given DataField has a static hidden annotation.
   *
   * @param dataField The DataField to check
   * @returns `true` if DataField or referenced property has a static Hidden annotation, false else
   * @private
   */


  _exports.isDataFieldTypes = isDataFieldTypes;

  function isDataFieldAlwaysHidden(dataField) {
    var _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3;

    return ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true || isDataFieldTypes(dataField) && ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : _dataField$Value$$tar3.Hidden) === true;
  }

  _exports.isDataFieldAlwaysHidden = isDataFieldAlwaysHidden;

  function getSemanticObjectPath(converterContext, object) {
    if (typeof object === "object") {
      var _object$Value;

      if (isDataFieldTypes(object) && (_object$Value = object.Value) !== null && _object$Value !== void 0 && _object$Value.$target) {
        var _object$Value2, _property$annotations, _property$annotations2;

        var property = (_object$Value2 = object.Value) === null || _object$Value2 === void 0 ? void 0 : _object$Value2.$target;

        if ((property === null || property === void 0 ? void 0 : (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Common) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.SemanticObject) !== undefined) {
          return converterContext.getEntitySetBasedAnnotationPath(property === null || property === void 0 ? void 0 : property.fullyQualifiedName);
        }
      } else if (isProperty(object)) {
        var _object$annotations, _object$annotations$C;

        if ((object === null || object === void 0 ? void 0 : (_object$annotations = object.annotations) === null || _object$annotations === void 0 ? void 0 : (_object$annotations$C = _object$annotations.Common) === null || _object$annotations$C === void 0 ? void 0 : _object$annotations$C.SemanticObject) !== undefined) {
          return converterContext.getEntitySetBasedAnnotationPath(object === null || object === void 0 ? void 0 : object.fullyQualifiedName);
        }
      }
    }

    return undefined;
  }
  /**
   * Returns the navigation path prefix for a property path.
   *
   * @param path The property path For e.g. /EntityType/Navigation/Property
   * @returns The navigation path prefix For e.g. /EntityType/Navigation/
   */


  _exports.getSemanticObjectPath = getSemanticObjectPath;

  function _getNavigationPathPrefix(path) {
    return path.indexOf("/") > -1 ? path.substring(0, path.lastIndexOf("/") + 1) : "";
  }
  /**
   * Collect additional properties for the ALP table use-case.
   *
   * For e.g. If UI.Hidden points to a property, include this property in the additionalProperties of ComplexPropertyInfo object.
   *
   * @param target Property or DataField being processed
   * @param navigationPathPrefix Navigation path prefix, applicable in case of navigation properties.
   * @param tableType Table type.
   * @param relatedProperties The related properties identified so far.
   * @returns The related properties identified.
   */


  function _collectAdditionalPropertiesForAnalyticalTable(target, navigationPathPrefix, tableType, relatedProperties) {
    if (tableType === "AnalyticalTable") {
      var _target$annotations, _target$annotations$U, _hiddenAnnotation$$ta;

      var hiddenAnnotation = (_target$annotations = target.annotations) === null || _target$annotations === void 0 ? void 0 : (_target$annotations$U = _target$annotations.UI) === null || _target$annotations$U === void 0 ? void 0 : _target$annotations$U.Hidden;

      if (hiddenAnnotation !== null && hiddenAnnotation !== void 0 && hiddenAnnotation.path && ((_hiddenAnnotation$$ta = hiddenAnnotation.$target) === null || _hiddenAnnotation$$ta === void 0 ? void 0 : _hiddenAnnotation$$ta._type) === "Property") {
        var hiddenAnnotationPropertyPath = navigationPathPrefix + hiddenAnnotation.path; // This property should be added to additionalProperties map for the ALP table use-case.

        relatedProperties.additionalProperties[hiddenAnnotationPropertyPath] = hiddenAnnotation.$target;
      }
    }

    return relatedProperties;
  }
  /**
   * Collect related properties from a property's annotations.
   *
   * @param path The property path
   * @param property The property to be considered
   * @param converterContext The converter context
   * @param ignoreSelf Whether to exclude the same property from related properties.
   * @param tableType The table type.
   * @param relatedProperties The related properties identified so far.
   * @param addUnitInTemplate True if the unit/currency property needs to be added in the export template
   * @returns The related properties identified.
   */


  function collectRelatedProperties(path, property, converterContext, ignoreSelf, tableType) {
    var relatedProperties = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
      properties: {},
      additionalProperties: {}
    };
    var addUnitInTemplate = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    /**
     * Helper to push unique related properties.
     *
     * @param key The property path
     * @param value The properties object containing value property, description property...
     * @returns Index at which the property is available
     */
    function _pushUnique(key, value) {
      if (!relatedProperties.properties.hasOwnProperty(key)) {
        relatedProperties.properties[key] = value;
      }

      return Object.keys(relatedProperties.properties).indexOf(key);
    }
    /**
     * Helper to append the export settings template with a formatted text.
     *
     * @param value Formatted text
     */


    function _appendTemplate(value) {
      relatedProperties.exportSettingsTemplate = relatedProperties.exportSettingsTemplate ? "".concat(relatedProperties.exportSettingsTemplate).concat(value) : "".concat(value);
    }

    if (path && property) {
      var _property$annotations3, _property$annotations4;

      var navigationPathPrefix = _getNavigationPathPrefix(path); // Check for Text annotation.


      var textAnnotation = (_property$annotations3 = property.annotations) === null || _property$annotations3 === void 0 ? void 0 : (_property$annotations4 = _property$annotations3.Common) === null || _property$annotations4 === void 0 ? void 0 : _property$annotations4.Text;
      var valueIndex;
      var targetValue;
      var currencyOrUoMIndex;
      var timezoneOrUoMIndex;

      if (relatedProperties.exportSettingsTemplate) {
        // FieldGroup use-case. Need to add each Field in new line.
        _appendTemplate("\n");

        relatedProperties.exportSettingsWrapping = true;
      }

      if (textAnnotation !== null && textAnnotation !== void 0 && textAnnotation.path && textAnnotation !== null && textAnnotation !== void 0 && textAnnotation.$target) {
        // Check for Text Arrangement.
        var dataModelObjectPath = converterContext.getDataModelObjectPath();
        var textAnnotationPropertyPath = navigationPathPrefix + textAnnotation.path;
        var displayMode = getDisplayMode(property, dataModelObjectPath);
        var descriptionIndex;

        switch (displayMode) {
          case "Value":
            valueIndex = _pushUnique(path, property);

            _appendTemplate("{".concat(valueIndex, "}"));

            break;

          case "Description":
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);

            _appendTemplate("{".concat(descriptionIndex, "}"));

            break;

          case "ValueDescription":
            valueIndex = _pushUnique(path, property);
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);

            _appendTemplate("{".concat(valueIndex, "} ({").concat(descriptionIndex, "})"));

            break;

          case "DescriptionValue":
            valueIndex = _pushUnique(path, property);
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);

            _appendTemplate("{".concat(descriptionIndex, "} ({").concat(valueIndex, "})"));

            break;
          // no default
        }
      } else {
        var _property$annotations5, _property$annotations6, _property$annotations7, _property$annotations8, _property$annotations9, _property$annotations10, _property$Target, _property$Target$$tar, _property$annotations11, _property$annotations12, _property$annotations13, _property$annotations14, _property$annotations15;

        // Check for field containing Currency Or Unit Properties or Timezone
        var currencyOrUoMProperty = getAssociatedCurrencyProperty(property) || getAssociatedUnitProperty(property);
        var currencyOrUnitAnnotation = (property === null || property === void 0 ? void 0 : (_property$annotations5 = property.annotations) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.Measures) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.ISOCurrency) || (property === null || property === void 0 ? void 0 : (_property$annotations7 = property.annotations) === null || _property$annotations7 === void 0 ? void 0 : (_property$annotations8 = _property$annotations7.Measures) === null || _property$annotations8 === void 0 ? void 0 : _property$annotations8.Unit);
        var timezoneProperty = getAssociatedTimezoneProperty(property);
        var timezoneAnnotation = property === null || property === void 0 ? void 0 : (_property$annotations9 = property.annotations) === null || _property$annotations9 === void 0 ? void 0 : (_property$annotations10 = _property$annotations9.Common) === null || _property$annotations10 === void 0 ? void 0 : _property$annotations10.Timezone;

        if (currencyOrUoMProperty && currencyOrUnitAnnotation !== null && currencyOrUnitAnnotation !== void 0 && currencyOrUnitAnnotation.$target) {
          valueIndex = _pushUnique(path, property);
          currencyOrUoMIndex = _pushUnique(currencyOrUoMProperty.name, currencyOrUnitAnnotation.$target);

          if (addUnitInTemplate) {
            _appendTemplate("{".concat(valueIndex, "}  {").concat(currencyOrUoMIndex, "}"));
          } else {
            relatedProperties.exportUnitName = currencyOrUoMProperty.name;
          }
        } else if (timezoneProperty && timezoneAnnotation !== null && timezoneAnnotation !== void 0 && timezoneAnnotation.$target) {
          valueIndex = _pushUnique(path, property);
          timezoneOrUoMIndex = _pushUnique(timezoneProperty.name, timezoneAnnotation.$target);

          if (addUnitInTemplate) {
            _appendTemplate("{".concat(valueIndex, "}  {").concat(timezoneOrUoMIndex, "}"));
          } else {
            relatedProperties.exportTimezoneName = timezoneProperty.name;
          }
        } else if ((_property$Target = property.Target) !== null && _property$Target !== void 0 && (_property$Target$$tar = _property$Target.$target) !== null && _property$Target$$tar !== void 0 && _property$Target$$tar.Visualization) {
          var dataPointProperty = property.Target.$target.Value.$target;
          valueIndex = _pushUnique(path, dataPointProperty); // New fake property created for the Rating/Progress Target Value. It'll be used for the export on split mode.

          _pushUnique(property.Target.value, property.Target.$target);

          targetValue = (property.Target.$target.TargetValue || property.Target.$target.MaximumValue).toString();

          _appendTemplate("{".concat(valueIndex, "}/").concat(targetValue));
        } else if (((_property$annotations11 = property.annotations) === null || _property$annotations11 === void 0 ? void 0 : (_property$annotations12 = _property$annotations11.UI) === null || _property$annotations12 === void 0 ? void 0 : (_property$annotations13 = _property$annotations12.DataFieldDefault) === null || _property$annotations13 === void 0 ? void 0 : (_property$annotations14 = _property$annotations13.Target) === null || _property$annotations14 === void 0 ? void 0 : (_property$annotations15 = _property$annotations14.$target) === null || _property$annotations15 === void 0 ? void 0 : _property$annotations15.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
          // DataPoint use-case using DataFieldDefault.
          var dataPointDefaultProperty = property.annotations.UI.DataFieldDefault;
          valueIndex = _pushUnique(path, property); // New fake property created for the Rating/Progress Target Value. It'll be used for the export on split mode.

          _pushUnique(dataPointDefaultProperty.Target.value, property);

          targetValue = (dataPointDefaultProperty.Target.$target.TargetValue || dataPointDefaultProperty.Target.$target.TargetValue.MaximumValue).toString();

          _appendTemplate("{".concat(valueIndex, "}/").concat(targetValue));
        } else if (property.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
          var _property$fn, _property$fn2;

          var contactProperty = (_property$fn = property.fn) === null || _property$fn === void 0 ? void 0 : _property$fn.$target;
          var contactPropertyPath = (_property$fn2 = property.fn) === null || _property$fn2 === void 0 ? void 0 : _property$fn2.path;
          valueIndex = _pushUnique(navigationPathPrefix ? navigationPathPrefix + contactPropertyPath : contactPropertyPath, contactProperty);

          _appendTemplate("{".concat(valueIndex, "}"));
        } else if (!ignoreSelf) {
          // Collect underlying property
          valueIndex = _pushUnique(path, property);

          _appendTemplate("{".concat(valueIndex, "}"));

          if (currencyOrUnitAnnotation) {
            relatedProperties.exportUnitString = "".concat(currencyOrUnitAnnotation); // Hard-coded currency/unit
          } else if (timezoneAnnotation) {
            relatedProperties.exportTimezoneString = "".concat(timezoneAnnotation); // Hard-coded timezone
          }
        }
      }

      relatedProperties = _collectAdditionalPropertiesForAnalyticalTable(property, navigationPathPrefix, tableType, relatedProperties);

      if (Object.keys(relatedProperties.additionalProperties).length > 0 && Object.keys(relatedProperties.properties).length === 0) {
        // Collect underlying property if not collected already.
        // This is to ensure that additionalProperties are made available only to complex property infos.
        valueIndex = _pushUnique(path, property);

        _appendTemplate("{".concat(valueIndex, "}"));
      }
    }

    return relatedProperties;
  }
  /**
   * Collect properties consumed by a DataField.
   * This is for populating the ComplexPropertyInfos of the table delegate.
   *
   * @param dataField The DataField for which the properties need to be identified.
   * @param converterContext The converter context.
   * @param tableType The table type.
   * @param relatedProperties The properties identified so far.
   * @param isEmbedded True if the DataField is embedded in another annotation (e.g. FieldGroup).
   * @returns The properties related to the DataField.
   */


  _exports.collectRelatedProperties = collectRelatedProperties;

  function collectRelatedPropertiesRecursively(dataField, converterContext, tableType) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    var relatedProperties = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      properties: {},
      additionalProperties: {}
    };
    var isEmbedded = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    switch (dataField === null || dataField === void 0 ? void 0 : dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        var property = dataField.Value;
        relatedProperties = collectRelatedProperties(property.path, property.$target, converterContext, false, tableType, relatedProperties, isEmbedded);

        var navigationPathPrefix = _getNavigationPathPrefix(property.path);

        relatedProperties = _collectAdditionalPropertiesForAnalyticalTable(dataField, navigationPathPrefix, tableType, relatedProperties);
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        switch ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : _dataField$Target$$ta.$Type) {
          case "com.sap.vocabularies.UI.v1.FieldGroupType":
            (_dataField$Target$$ta2 = dataField.Target.$target.Data) === null || _dataField$Target$$ta2 === void 0 ? void 0 : _dataField$Target$$ta2.forEach(function (innerDataField) {
              relatedProperties = collectRelatedPropertiesRecursively(innerDataField, converterContext, tableType, relatedProperties, true);
            });
            break;

          case "com.sap.vocabularies.UI.v1.DataPointType":
            relatedProperties = collectRelatedProperties(dataField.Target.$target.Value.path, dataField, converterContext, false, tableType, relatedProperties, isEmbedded);
            break;

          case "com.sap.vocabularies.Communication.v1.ContactType":
            var dataFieldContact = dataField.Target.$target;
            relatedProperties = collectRelatedProperties(dataField.Target.value, dataFieldContact, converterContext, false, tableType, relatedProperties, isEmbedded);
            break;

          default:
            break;
        }

        break;

      default:
        break;
    }

    return relatedProperties;
  }

  _exports.collectRelatedPropertiesRecursively = collectRelatedPropertiesRecursively;

  var getDataFieldDataType = function (oDataField) {
    var _Value, _Value$$target, _Target;

    var sDataType = oDataField.$Type;

    switch (sDataType) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        sDataType = undefined;
        break;

      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        sDataType = oDataField === null || oDataField === void 0 ? void 0 : (_Value = oDataField.Value) === null || _Value === void 0 ? void 0 : (_Value$$target = _Value.$target) === null || _Value$$target === void 0 ? void 0 : _Value$$target.type;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
      default:
        var sDataTypeForDataFieldForAnnotation = (_Target = oDataField.Target) === null || _Target === void 0 ? void 0 : _Target.$target.$Type;

        if (sDataTypeForDataFieldForAnnotation) {
          var _Target2, _Target4;

          if (((_Target2 = oDataField.Target) === null || _Target2 === void 0 ? void 0 : _Target2.$target.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
            var _$target, _Target3, _Target3$$target;

            sDataType = (_$target = ((_Target3 = oDataField.Target) === null || _Target3 === void 0 ? void 0 : (_Target3$$target = _Target3.$target) === null || _Target3$$target === void 0 ? void 0 : _Target3$$target.fn).$target) === null || _$target === void 0 ? void 0 : _$target.type;
          } else if (((_Target4 = oDataField.Target) === null || _Target4 === void 0 ? void 0 : _Target4.$target.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
            var _Target5, _Target5$$target, _Target5$$target$Valu, _Target5$$target$Valu2, _Target6, _Target6$$target, _Target6$$target$Valu;

            sDataType = ((_Target5 = oDataField.Target) === null || _Target5 === void 0 ? void 0 : (_Target5$$target = _Target5.$target) === null || _Target5$$target === void 0 ? void 0 : (_Target5$$target$Valu = _Target5$$target.Value) === null || _Target5$$target$Valu === void 0 ? void 0 : (_Target5$$target$Valu2 = _Target5$$target$Valu.$Path) === null || _Target5$$target$Valu2 === void 0 ? void 0 : _Target5$$target$Valu2.$Type) || ((_Target6 = oDataField.Target) === null || _Target6 === void 0 ? void 0 : (_Target6$$target = _Target6.$target) === null || _Target6$$target === void 0 ? void 0 : (_Target6$$target$Valu = _Target6$$target.Value) === null || _Target6$$target$Valu === void 0 ? void 0 : _Target6$$target$Valu.$target.type);
          } else {
            var _Target7;

            // e.g. FieldGroup or Chart
            // FieldGroup Properties have no type, so we define it as a boolean type to prevent exceptions during the calculation of the width
            sDataType = ((_Target7 = oDataField.Target) === null || _Target7 === void 0 ? void 0 : _Target7.$target.$Type) === "com.sap.vocabularies.UI.v1.ChartDefinitionType" ? undefined : "Edm.Boolean";
          }
        } else {
          sDataType = undefined;
        }

        break;
    }

    return sDataType;
  };

  _exports.getDataFieldDataType = getDataFieldDataType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0IiwiZGF0YUZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJpc0RhdGFGaWVsZFR5cGVzIiwiaXNEYXRhRmllbGRBbHdheXNIaWRkZW4iLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsIlZhbHVlIiwiJHRhcmdldCIsImdldFNlbWFudGljT2JqZWN0UGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJvYmplY3QiLCJwcm9wZXJ0eSIsIkNvbW1vbiIsIlNlbWFudGljT2JqZWN0IiwidW5kZWZpbmVkIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImlzUHJvcGVydHkiLCJfZ2V0TmF2aWdhdGlvblBhdGhQcmVmaXgiLCJwYXRoIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwiX2NvbGxlY3RBZGRpdGlvbmFsUHJvcGVydGllc0ZvckFuYWx5dGljYWxUYWJsZSIsInRhcmdldCIsIm5hdmlnYXRpb25QYXRoUHJlZml4IiwidGFibGVUeXBlIiwicmVsYXRlZFByb3BlcnRpZXMiLCJoaWRkZW5Bbm5vdGF0aW9uIiwiX3R5cGUiLCJoaWRkZW5Bbm5vdGF0aW9uUHJvcGVydHlQYXRoIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMiLCJpZ25vcmVTZWxmIiwicHJvcGVydGllcyIsImFkZFVuaXRJblRlbXBsYXRlIiwiX3B1c2hVbmlxdWUiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImtleXMiLCJfYXBwZW5kVGVtcGxhdGUiLCJleHBvcnRTZXR0aW5nc1RlbXBsYXRlIiwidGV4dEFubm90YXRpb24iLCJUZXh0IiwidmFsdWVJbmRleCIsInRhcmdldFZhbHVlIiwiY3VycmVuY3lPclVvTUluZGV4IiwidGltZXpvbmVPclVvTUluZGV4IiwiZXhwb3J0U2V0dGluZ3NXcmFwcGluZyIsImRhdGFNb2RlbE9iamVjdFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgiLCJkaXNwbGF5TW9kZSIsImdldERpc3BsYXlNb2RlIiwiZGVzY3JpcHRpb25JbmRleCIsImN1cnJlbmN5T3JVb01Qcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSIsImN1cnJlbmN5T3JVbml0QW5ub3RhdGlvbiIsIk1lYXN1cmVzIiwiSVNPQ3VycmVuY3kiLCJVbml0IiwidGltZXpvbmVQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRUaW1lem9uZVByb3BlcnR5IiwidGltZXpvbmVBbm5vdGF0aW9uIiwiVGltZXpvbmUiLCJuYW1lIiwiZXhwb3J0VW5pdE5hbWUiLCJleHBvcnRUaW1lem9uZU5hbWUiLCJUYXJnZXQiLCJWaXN1YWxpemF0aW9uIiwiZGF0YVBvaW50UHJvcGVydHkiLCJUYXJnZXRWYWx1ZSIsIk1heGltdW1WYWx1ZSIsInRvU3RyaW5nIiwiRGF0YUZpZWxkRGVmYXVsdCIsIiRUeXBlIiwiZGF0YVBvaW50RGVmYXVsdFByb3BlcnR5IiwiY29udGFjdFByb3BlcnR5IiwiZm4iLCJjb250YWN0UHJvcGVydHlQYXRoIiwiZXhwb3J0VW5pdFN0cmluZyIsImV4cG9ydFRpbWV6b25lU3RyaW5nIiwibGVuZ3RoIiwiY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHkiLCJpc0VtYmVkZGVkIiwiRGF0YSIsImZvckVhY2giLCJpbm5lckRhdGFGaWVsZCIsImRhdGFGaWVsZENvbnRhY3QiLCJnZXREYXRhRmllbGREYXRhVHlwZSIsIm9EYXRhRmllbGQiLCJzRGF0YVR5cGUiLCJ0eXBlIiwic0RhdGFUeXBlRm9yRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiIsIiRQYXRoIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJEYXRhRmllbGQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQcmltaXRpdmVUeXBlLCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBDb250YWN0IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tdW5pY2F0aW9uXCI7XG5pbXBvcnQgeyBDb21tdW5pY2F0aW9uQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tdW5pY2F0aW9uXCI7XG5pbXBvcnQgdHlwZSB7XG5cdERhdGFGaWVsZCxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlcyxcblx0RGF0YUZpZWxkRm9yQW5ub3RhdGlvbixcblx0RGF0YUZpZWxkVHlwZXMsXG5cdERhdGFQb2ludFxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgeyBVSUFubm90YXRpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB0eXBlIHsgVGFibGVUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5pbXBvcnQgeyBnZXREaXNwbGF5TW9kZSB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0Rpc3BsYXlNb2RlRm9ybWF0dGVyXCI7XG5pbXBvcnQge1xuXHRnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSxcblx0Z2V0QXNzb2NpYXRlZFRpbWV6b25lUHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHksXG5cdGlzUHJvcGVydHlcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcbmltcG9ydCB0eXBlIENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uL0NvbnZlcnRlckNvbnRleHRcIjtcblxuZXhwb3J0IHR5cGUgQ29tcGxleFByb3BlcnR5SW5mbyA9IHtcblx0cHJvcGVydGllczogUmVjb3JkPHN0cmluZywgUHJvcGVydHk+O1xuXHRhZGRpdGlvbmFsUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgUHJvcGVydHk+O1xuXHRleHBvcnRTZXR0aW5nc1RlbXBsYXRlPzogc3RyaW5nO1xuXHRleHBvcnRTZXR0aW5nc1dyYXBwaW5nPzogYm9vbGVhbjtcblx0ZXhwb3J0VW5pdE5hbWU/OiBzdHJpbmc7XG5cdGV4cG9ydFVuaXRTdHJpbmc/OiBzdHJpbmc7XG5cdGV4cG9ydFRpbWV6b25lTmFtZT86IHN0cmluZztcblx0ZXhwb3J0VGltZXpvbmVTdHJpbmc/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIElkZW50aWZpZXMgaWYgdGhlIGdpdmVuIGRhdGFGaWVsZEFic3RyYWN0IHRoYXQgaXMgcGFzc2VkIGlzIGEgXCJEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdFwiLlxuICogRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QgaGFzIGFuIGlubGluZSBhY3Rpb24gZGVmaW5lZC5cbiAqXG4gKiBAcGFyYW0gZGF0YUZpZWxkIERhdGFGaWVsZCB0byBiZSBldmFsdWF0ZWRcbiAqIEByZXR1cm5zIFZhbGlkYXRlcyB0aGF0IGRhdGFGaWVsZCBpcyBhIERhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0VHlwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBkYXRhRmllbGQgaXMgRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlcyB7XG5cdHJldHVybiAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0VHlwZXMpLmhhc093blByb3BlcnR5KFwiQWN0aW9uXCIpO1xufVxuXG4vKipcbiAqIElkZW50aWZpZXMgaWYgdGhlIGdpdmVuIGRhdGFGaWVsZEFic3RyYWN0IHRoYXQgaXMgcGFzc2VkIGlzIGEgXCJEYXRhRmllbGRcIi5cbiAqIERhdGFGaWVsZCBoYXMgYSB2YWx1ZSBkZWZpbmVkLlxuICpcbiAqIEBwYXJhbSBkYXRhRmllbGQgRGF0YUZpZWxkIHRvIGJlIGV2YWx1YXRlZFxuICogQHJldHVybnMgVmFsaWRhdGUgdGhhdCBkYXRhRmllbGQgaXMgYSBEYXRhRmllbGRUeXBlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhRmllbGRUeXBlcyhkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBkYXRhRmllbGQgaXMgRGF0YUZpZWxkVHlwZXMge1xuXHRyZXR1cm4gKGRhdGFGaWVsZCBhcyBEYXRhRmllbGRUeXBlcykuaGFzT3duUHJvcGVydHkoXCJWYWx1ZVwiKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgZ2l2ZW4gRGF0YUZpZWxkIGhhcyBhIHN0YXRpYyBoaWRkZW4gYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gZGF0YUZpZWxkIFRoZSBEYXRhRmllbGQgdG8gY2hlY2tcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBEYXRhRmllbGQgb3IgcmVmZXJlbmNlZCBwcm9wZXJ0eSBoYXMgYSBzdGF0aWMgSGlkZGVuIGFubm90YXRpb24sIGZhbHNlIGVsc2VcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbihkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHRkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSB8fFxuXHRcdChpc0RhdGFGaWVsZFR5cGVzKGRhdGFGaWVsZCkgJiYgZGF0YUZpZWxkLlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiA9PT0gdHJ1ZSlcblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbWFudGljT2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCBvYmplY3Q6IGFueSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICh0eXBlb2Ygb2JqZWN0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYgKGlzRGF0YUZpZWxkVHlwZXMob2JqZWN0KSAmJiBvYmplY3QuVmFsdWU/LiR0YXJnZXQpIHtcblx0XHRcdGNvbnN0IHByb3BlcnR5ID0gb2JqZWN0LlZhbHVlPy4kdGFyZ2V0O1xuXHRcdFx0aWYgKHByb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY09iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgocHJvcGVydHk/LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChpc1Byb3BlcnR5KG9iamVjdCkpIHtcblx0XHRcdGlmIChvYmplY3Q/LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChvYmplY3Q/LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmF2aWdhdGlvbiBwYXRoIHByZWZpeCBmb3IgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwYXJhbSBwYXRoIFRoZSBwcm9wZXJ0eSBwYXRoIEZvciBlLmcuIC9FbnRpdHlUeXBlL05hdmlnYXRpb24vUHJvcGVydHlcbiAqIEByZXR1cm5zIFRoZSBuYXZpZ2F0aW9uIHBhdGggcHJlZml4IEZvciBlLmcuIC9FbnRpdHlUeXBlL05hdmlnYXRpb24vXG4gKi9cbmZ1bmN0aW9uIF9nZXROYXZpZ2F0aW9uUGF0aFByZWZpeChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gcGF0aC5pbmRleE9mKFwiL1wiKSA+IC0xID8gcGF0aC5zdWJzdHJpbmcoMCwgcGF0aC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKSA6IFwiXCI7XG59XG5cbi8qKlxuICogQ29sbGVjdCBhZGRpdGlvbmFsIHByb3BlcnRpZXMgZm9yIHRoZSBBTFAgdGFibGUgdXNlLWNhc2UuXG4gKlxuICogRm9yIGUuZy4gSWYgVUkuSGlkZGVuIHBvaW50cyB0byBhIHByb3BlcnR5LCBpbmNsdWRlIHRoaXMgcHJvcGVydHkgaW4gdGhlIGFkZGl0aW9uYWxQcm9wZXJ0aWVzIG9mIENvbXBsZXhQcm9wZXJ0eUluZm8gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgUHJvcGVydHkgb3IgRGF0YUZpZWxkIGJlaW5nIHByb2Nlc3NlZFxuICogQHBhcmFtIG5hdmlnYXRpb25QYXRoUHJlZml4IE5hdmlnYXRpb24gcGF0aCBwcmVmaXgsIGFwcGxpY2FibGUgaW4gY2FzZSBvZiBuYXZpZ2F0aW9uIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0gdGFibGVUeXBlIFRhYmxlIHR5cGUuXG4gKiBAcGFyYW0gcmVsYXRlZFByb3BlcnRpZXMgVGhlIHJlbGF0ZWQgcHJvcGVydGllcyBpZGVudGlmaWVkIHNvIGZhci5cbiAqIEByZXR1cm5zIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZC5cbiAqL1xuZnVuY3Rpb24gX2NvbGxlY3RBZGRpdGlvbmFsUHJvcGVydGllc0ZvckFuYWx5dGljYWxUYWJsZShcblx0dGFyZ2V0OiBQcmltaXRpdmVUeXBlLFxuXHRuYXZpZ2F0aW9uUGF0aFByZWZpeDogc3RyaW5nLFxuXHR0YWJsZVR5cGU6IFRhYmxlVHlwZSxcblx0cmVsYXRlZFByb3BlcnRpZXM6IENvbXBsZXhQcm9wZXJ0eUluZm9cbik6IENvbXBsZXhQcm9wZXJ0eUluZm8ge1xuXHRpZiAodGFibGVUeXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiKSB7XG5cdFx0Y29uc3QgaGlkZGVuQW5ub3RhdGlvbiA9IHRhcmdldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbjtcblx0XHRpZiAoaGlkZGVuQW5ub3RhdGlvbj8ucGF0aCAmJiBoaWRkZW5Bbm5vdGF0aW9uLiR0YXJnZXQ/Ll90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRcdGNvbnN0IGhpZGRlbkFubm90YXRpb25Qcm9wZXJ0eVBhdGggPSBuYXZpZ2F0aW9uUGF0aFByZWZpeCArIGhpZGRlbkFubm90YXRpb24ucGF0aDtcblx0XHRcdC8vIFRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGFkZGVkIHRvIGFkZGl0aW9uYWxQcm9wZXJ0aWVzIG1hcCBmb3IgdGhlIEFMUCB0YWJsZSB1c2UtY2FzZS5cblx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmFkZGl0aW9uYWxQcm9wZXJ0aWVzW2hpZGRlbkFubm90YXRpb25Qcm9wZXJ0eVBhdGhdID0gaGlkZGVuQW5ub3RhdGlvbi4kdGFyZ2V0O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVsYXRlZFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogQ29sbGVjdCByZWxhdGVkIHByb3BlcnRpZXMgZnJvbSBhIHByb3BlcnR5J3MgYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIHBhdGggVGhlIHByb3BlcnR5IHBhdGhcbiAqIEBwYXJhbSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gYmUgY29uc2lkZXJlZFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gaWdub3JlU2VsZiBXaGV0aGVyIHRvIGV4Y2x1ZGUgdGhlIHNhbWUgcHJvcGVydHkgZnJvbSByZWxhdGVkIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0gdGFibGVUeXBlIFRoZSB0YWJsZSB0eXBlLlxuICogQHBhcmFtIHJlbGF0ZWRQcm9wZXJ0aWVzIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZCBzbyBmYXIuXG4gKiBAcGFyYW0gYWRkVW5pdEluVGVtcGxhdGUgVHJ1ZSBpZiB0aGUgdW5pdC9jdXJyZW5jeSBwcm9wZXJ0eSBuZWVkcyB0byBiZSBhZGRlZCBpbiB0aGUgZXhwb3J0IHRlbXBsYXRlXG4gKiBAcmV0dXJucyBUaGUgcmVsYXRlZCBwcm9wZXJ0aWVzIGlkZW50aWZpZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdHBhdGg6IHN0cmluZyxcblx0cHJvcGVydHk6IFByaW1pdGl2ZVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGlnbm9yZVNlbGY6IGJvb2xlYW4sXG5cdHRhYmxlVHlwZTogVGFibGVUeXBlLFxuXHRyZWxhdGVkUHJvcGVydGllczogQ29tcGxleFByb3BlcnR5SW5mbyA9IHsgcHJvcGVydGllczoge30sIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7fSB9LFxuXHRhZGRVbml0SW5UZW1wbGF0ZTogYm9vbGVhbiA9IGZhbHNlXG4pOiBDb21wbGV4UHJvcGVydHlJbmZvIHtcblx0LyoqXG5cdCAqIEhlbHBlciB0byBwdXNoIHVuaXF1ZSByZWxhdGVkIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIHByb3BlcnR5IHBhdGhcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBwcm9wZXJ0aWVzIG9iamVjdCBjb250YWluaW5nIHZhbHVlIHByb3BlcnR5LCBkZXNjcmlwdGlvbiBwcm9wZXJ0eS4uLlxuXHQgKiBAcmV0dXJucyBJbmRleCBhdCB3aGljaCB0aGUgcHJvcGVydHkgaXMgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBfcHVzaFVuaXF1ZShrZXk6IHN0cmluZywgdmFsdWU6IFByb3BlcnR5KTogbnVtYmVyIHtcblx0XHRpZiAoIXJlbGF0ZWRQcm9wZXJ0aWVzLnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0cmVsYXRlZFByb3BlcnRpZXMucHJvcGVydGllc1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHRcdHJldHVybiBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzKS5pbmRleE9mKGtleSk7XG5cdH1cblxuXHQvKipcblx0ICogSGVscGVyIHRvIGFwcGVuZCB0aGUgZXhwb3J0IHNldHRpbmdzIHRlbXBsYXRlIHdpdGggYSBmb3JtYXR0ZWQgdGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIEZvcm1hdHRlZCB0ZXh0XG5cdCAqL1xuXHRmdW5jdGlvbiBfYXBwZW5kVGVtcGxhdGUodmFsdWU6IHN0cmluZykge1xuXHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGUgPSByZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc1RlbXBsYXRlXG5cdFx0XHQ/IGAke3JlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGV9JHt2YWx1ZX1gXG5cdFx0XHQ6IGAke3ZhbHVlfWA7XG5cdH1cblxuXHRpZiAocGF0aCAmJiBwcm9wZXJ0eSkge1xuXHRcdGNvbnN0IG5hdmlnYXRpb25QYXRoUHJlZml4ID0gX2dldE5hdmlnYXRpb25QYXRoUHJlZml4KHBhdGgpO1xuXG5cdFx0Ly8gQ2hlY2sgZm9yIFRleHQgYW5ub3RhdGlvbi5cblx0XHRjb25zdCB0ZXh0QW5ub3RhdGlvbiA9IHByb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQ7XG5cdFx0bGV0IHZhbHVlSW5kZXg6IG51bWJlcjtcblx0XHRsZXQgdGFyZ2V0VmFsdWU6IHN0cmluZztcblx0XHRsZXQgY3VycmVuY3lPclVvTUluZGV4OiBudW1iZXI7XG5cdFx0bGV0IHRpbWV6b25lT3JVb01JbmRleDogbnVtYmVyO1xuXG5cdFx0aWYgKHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGUpIHtcblx0XHRcdC8vIEZpZWxkR3JvdXAgdXNlLWNhc2UuIE5lZWQgdG8gYWRkIGVhY2ggRmllbGQgaW4gbmV3IGxpbmUuXG5cdFx0XHRfYXBwZW5kVGVtcGxhdGUoXCJcXG5cIik7XG5cdFx0XHRyZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc1dyYXBwaW5nID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAodGV4dEFubm90YXRpb24/LnBhdGggJiYgdGV4dEFubm90YXRpb24/LiR0YXJnZXQpIHtcblx0XHRcdC8vIENoZWNrIGZvciBUZXh0IEFycmFuZ2VtZW50LlxuXHRcdFx0Y29uc3QgZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRcdFx0Y29uc3QgdGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGggPSBuYXZpZ2F0aW9uUGF0aFByZWZpeCArIHRleHRBbm5vdGF0aW9uLnBhdGg7XG5cdFx0XHRjb25zdCBkaXNwbGF5TW9kZSA9IGdldERpc3BsYXlNb2RlKHByb3BlcnR5LCBkYXRhTW9kZWxPYmplY3RQYXRoKTtcblx0XHRcdGxldCBkZXNjcmlwdGlvbkluZGV4OiBudW1iZXI7XG5cdFx0XHRzd2l0Y2ggKGRpc3BsYXlNb2RlKSB7XG5cdFx0XHRcdGNhc2UgXCJWYWx1ZVwiOlxuXHRcdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX1gKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25cIjpcblx0XHRcdFx0XHRkZXNjcmlwdGlvbkluZGV4ID0gX3B1c2hVbmlxdWUodGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgsIHRleHRBbm5vdGF0aW9uLiR0YXJnZXQpO1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7ZGVzY3JpcHRpb25JbmRleH19YCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIlZhbHVlRGVzY3JpcHRpb25cIjpcblx0XHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgcHJvcGVydHkpO1xuXHRcdFx0XHRcdGRlc2NyaXB0aW9uSW5kZXggPSBfcHVzaFVuaXF1ZSh0ZXh0QW5ub3RhdGlvblByb3BlcnR5UGF0aCwgdGV4dEFubm90YXRpb24uJHRhcmdldCk7XG5cdFx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX0gKHske2Rlc2NyaXB0aW9uSW5kZXh9fSlgKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25WYWx1ZVwiOlxuXHRcdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25JbmRleCA9IF9wdXNoVW5pcXVlKHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoLCB0ZXh0QW5ub3RhdGlvbi4kdGFyZ2V0KTtcblx0XHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske2Rlc2NyaXB0aW9uSW5kZXh9fSAoeyR7dmFsdWVJbmRleH19KWApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHQvLyBubyBkZWZhdWx0XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIENoZWNrIGZvciBmaWVsZCBjb250YWluaW5nIEN1cnJlbmN5IE9yIFVuaXQgUHJvcGVydGllcyBvciBUaW1lem9uZVxuXHRcdFx0Y29uc3QgY3VycmVuY3lPclVvTVByb3BlcnR5ID0gZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkocHJvcGVydHkpIHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkocHJvcGVydHkpO1xuXHRcdFx0Y29uc3QgY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uID0gcHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgcHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0XHRcdGNvbnN0IHRpbWV6b25lUHJvcGVydHkgPSBnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eShwcm9wZXJ0eSk7XG5cdFx0XHRjb25zdCB0aW1lem9uZUFubm90YXRpb24gPSBwcm9wZXJ0eT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGltZXpvbmU7XG5cblx0XHRcdGlmIChjdXJyZW5jeU9yVW9NUHJvcGVydHkgJiYgY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uPy4kdGFyZ2V0KSB7XG5cdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdGN1cnJlbmN5T3JVb01JbmRleCA9IF9wdXNoVW5pcXVlKGN1cnJlbmN5T3JVb01Qcm9wZXJ0eS5uYW1lLCBjdXJyZW5jeU9yVW5pdEFubm90YXRpb24uJHRhcmdldCk7XG5cdFx0XHRcdGlmIChhZGRVbml0SW5UZW1wbGF0ZSkge1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19ICB7JHtjdXJyZW5jeU9yVW9NSW5kZXh9fWApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFVuaXROYW1lID0gY3VycmVuY3lPclVvTVByb3BlcnR5Lm5hbWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodGltZXpvbmVQcm9wZXJ0eSAmJiB0aW1lem9uZUFubm90YXRpb24/LiR0YXJnZXQpIHtcblx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHByb3BlcnR5KTtcblx0XHRcdFx0dGltZXpvbmVPclVvTUluZGV4ID0gX3B1c2hVbmlxdWUodGltZXpvbmVQcm9wZXJ0eS5uYW1lLCB0aW1lem9uZUFubm90YXRpb24uJHRhcmdldCk7XG5cdFx0XHRcdGlmIChhZGRVbml0SW5UZW1wbGF0ZSkge1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19ICB7JHt0aW1lem9uZU9yVW9NSW5kZXh9fWApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFRpbWV6b25lTmFtZSA9IHRpbWV6b25lUHJvcGVydHkubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5UYXJnZXQ/LiR0YXJnZXQ/LlZpc3VhbGl6YXRpb24pIHtcblx0XHRcdFx0Y29uc3QgZGF0YVBvaW50UHJvcGVydHk6IFByaW1pdGl2ZVR5cGUgPSBwcm9wZXJ0eS5UYXJnZXQuJHRhcmdldC5WYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgZGF0YVBvaW50UHJvcGVydHkpO1xuXHRcdFx0XHQvLyBOZXcgZmFrZSBwcm9wZXJ0eSBjcmVhdGVkIGZvciB0aGUgUmF0aW5nL1Byb2dyZXNzIFRhcmdldCBWYWx1ZS4gSXQnbGwgYmUgdXNlZCBmb3IgdGhlIGV4cG9ydCBvbiBzcGxpdCBtb2RlLlxuXHRcdFx0XHRfcHVzaFVuaXF1ZShwcm9wZXJ0eS5UYXJnZXQudmFsdWUsIHByb3BlcnR5LlRhcmdldC4kdGFyZ2V0KTtcblx0XHRcdFx0dGFyZ2V0VmFsdWUgPSAocHJvcGVydHkuVGFyZ2V0LiR0YXJnZXQuVGFyZ2V0VmFsdWUgfHwgcHJvcGVydHkuVGFyZ2V0LiR0YXJnZXQuTWF4aW11bVZhbHVlKS50b1N0cmluZygpO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fS8ke3RhcmdldFZhbHVlfWApO1xuXHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkRhdGFGaWVsZERlZmF1bHQ/LlRhcmdldD8uJHRhcmdldD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGUpIHtcblx0XHRcdFx0Ly8gRGF0YVBvaW50IHVzZS1jYXNlIHVzaW5nIERhdGFGaWVsZERlZmF1bHQuXG5cdFx0XHRcdGNvbnN0IGRhdGFQb2ludERlZmF1bHRQcm9wZXJ0eTogUHJpbWl0aXZlVHlwZSA9IHByb3BlcnR5LmFubm90YXRpb25zLlVJLkRhdGFGaWVsZERlZmF1bHQ7XG5cdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdC8vIE5ldyBmYWtlIHByb3BlcnR5IGNyZWF0ZWQgZm9yIHRoZSBSYXRpbmcvUHJvZ3Jlc3MgVGFyZ2V0IFZhbHVlLiBJdCdsbCBiZSB1c2VkIGZvciB0aGUgZXhwb3J0IG9uIHNwbGl0IG1vZGUuXG5cdFx0XHRcdF9wdXNoVW5pcXVlKGRhdGFQb2ludERlZmF1bHRQcm9wZXJ0eS5UYXJnZXQudmFsdWUsIHByb3BlcnR5KTtcblx0XHRcdFx0dGFyZ2V0VmFsdWUgPSAoXG5cdFx0XHRcdFx0ZGF0YVBvaW50RGVmYXVsdFByb3BlcnR5LlRhcmdldC4kdGFyZ2V0LlRhcmdldFZhbHVlIHx8IGRhdGFQb2ludERlZmF1bHRQcm9wZXJ0eS5UYXJnZXQuJHRhcmdldC5UYXJnZXRWYWx1ZS5NYXhpbXVtVmFsdWVcblx0XHRcdFx0KS50b1N0cmluZygpO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fS8ke3RhcmdldFZhbHVlfWApO1xuXHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS4kVHlwZSA9PT0gQ29tbXVuaWNhdGlvbkFubm90YXRpb25UeXBlcy5Db250YWN0VHlwZSkge1xuXHRcdFx0XHRjb25zdCBjb250YWN0UHJvcGVydHkgPSBwcm9wZXJ0eS5mbj8uJHRhcmdldDtcblx0XHRcdFx0Y29uc3QgY29udGFjdFByb3BlcnR5UGF0aCA9IHByb3BlcnR5LmZuPy5wYXRoO1xuXHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUoXG5cdFx0XHRcdFx0bmF2aWdhdGlvblBhdGhQcmVmaXggPyBuYXZpZ2F0aW9uUGF0aFByZWZpeCArIGNvbnRhY3RQcm9wZXJ0eVBhdGggOiBjb250YWN0UHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGNvbnRhY3RQcm9wZXJ0eVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fWApO1xuXHRcdFx0fSBlbHNlIGlmICghaWdub3JlU2VsZikge1xuXHRcdFx0XHQvLyBDb2xsZWN0IHVuZGVybHlpbmcgcHJvcGVydHlcblx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHByb3BlcnR5KTtcblx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX1gKTtcblx0XHRcdFx0aWYgKGN1cnJlbmN5T3JVbml0QW5ub3RhdGlvbikge1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFVuaXRTdHJpbmcgPSBgJHtjdXJyZW5jeU9yVW5pdEFubm90YXRpb259YDsgLy8gSGFyZC1jb2RlZCBjdXJyZW5jeS91bml0XG5cdFx0XHRcdH0gZWxzZSBpZiAodGltZXpvbmVBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0cmVsYXRlZFByb3BlcnRpZXMuZXhwb3J0VGltZXpvbmVTdHJpbmcgPSBgJHt0aW1lem9uZUFubm90YXRpb259YDsgLy8gSGFyZC1jb2RlZCB0aW1lem9uZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmVsYXRlZFByb3BlcnRpZXMgPSBfY29sbGVjdEFkZGl0aW9uYWxQcm9wZXJ0aWVzRm9yQW5hbHl0aWNhbFRhYmxlKHByb3BlcnR5LCBuYXZpZ2F0aW9uUGF0aFByZWZpeCwgdGFibGVUeXBlLCByZWxhdGVkUHJvcGVydGllcyk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKHJlbGF0ZWRQcm9wZXJ0aWVzLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKS5sZW5ndGggPiAwICYmIE9iamVjdC5rZXlzKHJlbGF0ZWRQcm9wZXJ0aWVzLnByb3BlcnRpZXMpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Ly8gQ29sbGVjdCB1bmRlcmx5aW5nIHByb3BlcnR5IGlmIG5vdCBjb2xsZWN0ZWQgYWxyZWFkeS5cblx0XHRcdC8vIFRoaXMgaXMgdG8gZW5zdXJlIHRoYXQgYWRkaXRpb25hbFByb3BlcnRpZXMgYXJlIG1hZGUgYXZhaWxhYmxlIG9ubHkgdG8gY29tcGxleCBwcm9wZXJ0eSBpbmZvcy5cblx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fWApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZWxhdGVkUHJvcGVydGllcztcbn1cblxuLyoqXG4gKiBDb2xsZWN0IHByb3BlcnRpZXMgY29uc3VtZWQgYnkgYSBEYXRhRmllbGQuXG4gKiBUaGlzIGlzIGZvciBwb3B1bGF0aW5nIHRoZSBDb21wbGV4UHJvcGVydHlJbmZvcyBvZiB0aGUgdGFibGUgZGVsZWdhdGUuXG4gKlxuICogQHBhcmFtIGRhdGFGaWVsZCBUaGUgRGF0YUZpZWxkIGZvciB3aGljaCB0aGUgcHJvcGVydGllcyBuZWVkIHRvIGJlIGlkZW50aWZpZWQuXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHQuXG4gKiBAcGFyYW0gdGFibGVUeXBlIFRoZSB0YWJsZSB0eXBlLlxuICogQHBhcmFtIHJlbGF0ZWRQcm9wZXJ0aWVzIFRoZSBwcm9wZXJ0aWVzIGlkZW50aWZpZWQgc28gZmFyLlxuICogQHBhcmFtIGlzRW1iZWRkZWQgVHJ1ZSBpZiB0aGUgRGF0YUZpZWxkIGlzIGVtYmVkZGVkIGluIGFub3RoZXIgYW5ub3RhdGlvbiAoZS5nLiBGaWVsZEdyb3VwKS5cbiAqIEByZXR1cm5zIFRoZSBwcm9wZXJ0aWVzIHJlbGF0ZWQgdG8gdGhlIERhdGFGaWVsZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KFxuXHRkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHRhYmxlVHlwZTogVGFibGVUeXBlLFxuXHRyZWxhdGVkUHJvcGVydGllczogQ29tcGxleFByb3BlcnR5SW5mbyA9IHsgcHJvcGVydGllczoge30sIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7fSB9LFxuXHRpc0VtYmVkZGVkOiBib29sZWFuID0gZmFsc2Vcbik6IENvbXBsZXhQcm9wZXJ0eUluZm8ge1xuXHRzd2l0Y2ggKGRhdGFGaWVsZD8uJFR5cGUpIHtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGg6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbjpcblx0XHRcdGNvbnN0IHByb3BlcnR5ID0gZGF0YUZpZWxkLlZhbHVlO1xuXHRcdFx0cmVsYXRlZFByb3BlcnRpZXMgPSBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdFx0XHRcdHByb3BlcnR5LnBhdGgsXG5cdFx0XHRcdHByb3BlcnR5LiR0YXJnZXQsXG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHR0YWJsZVR5cGUsXG5cdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLFxuXHRcdFx0XHRpc0VtYmVkZGVkXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgbmF2aWdhdGlvblBhdGhQcmVmaXggPSBfZ2V0TmF2aWdhdGlvblBhdGhQcmVmaXgocHJvcGVydHkucGF0aCk7XG5cdFx0XHRyZWxhdGVkUHJvcGVydGllcyA9IF9jb2xsZWN0QWRkaXRpb25hbFByb3BlcnRpZXNGb3JBbmFseXRpY2FsVGFibGUoXG5cdFx0XHRcdGRhdGFGaWVsZCxcblx0XHRcdFx0bmF2aWdhdGlvblBhdGhQcmVmaXgsXG5cdFx0XHRcdHRhYmxlVHlwZSxcblx0XHRcdFx0cmVsYXRlZFByb3BlcnRpZXNcblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb246XG5cdFx0XHRzd2l0Y2ggKGRhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlKSB7XG5cdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRmllbGRHcm91cFR5cGU6XG5cdFx0XHRcdFx0ZGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0LkRhdGE/LmZvckVhY2goKGlubmVyRGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KFxuXHRcdFx0XHRcdFx0XHRpbm5lckRhdGFGaWVsZCxcblx0XHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRcdFx0dGFibGVUeXBlLFxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcyxcblx0XHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGU6XG5cdFx0XHRcdFx0cmVsYXRlZFByb3BlcnRpZXMgPSBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdFx0XHRcdFx0XHRkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQuVmFsdWUucGF0aCxcblx0XHRcdFx0XHRcdGRhdGFGaWVsZCxcblx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdHRhYmxlVHlwZSxcblx0XHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdFx0aXNFbWJlZGRlZFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBDb21tdW5pY2F0aW9uQW5ub3RhdGlvblR5cGVzLkNvbnRhY3RUeXBlOlxuXHRcdFx0XHRcdGNvbnN0IGRhdGFGaWVsZENvbnRhY3QgPSBkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQgYXMgQ29udGFjdDtcblx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyhcblx0XHRcdFx0XHRcdGRhdGFGaWVsZC5UYXJnZXQudmFsdWUsXG5cdFx0XHRcdFx0XHRkYXRhRmllbGRDb250YWN0LFxuXHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdFx0dGFibGVUeXBlLFxuXHRcdFx0XHRcdFx0cmVsYXRlZFByb3BlcnRpZXMsXG5cdFx0XHRcdFx0XHRpc0VtYmVkZGVkXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHJlbGF0ZWRQcm9wZXJ0aWVzO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0RGF0YUZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbiAob0RhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB8IFByb3BlcnR5KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0bGV0IHNEYXRhVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gKG9EYXRhRmllbGQgYXMgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykuJFR5cGU7XG5cdHN3aXRjaCAoc0RhdGFUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRzRGF0YVR5cGUgPSB1bmRlZmluZWQ7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uOlxuXHRcdFx0c0RhdGFUeXBlID0gKG9EYXRhRmllbGQgYXMgRGF0YUZpZWxkKT8uVmFsdWU/LiR0YXJnZXQ/LnR5cGU7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjpcblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc3Qgc0RhdGFUeXBlRm9yRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiA9IChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pLlRhcmdldD8uJHRhcmdldC4kVHlwZTtcblx0XHRcdGlmIChzRGF0YVR5cGVGb3JEYXRhRmllbGRGb3JBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdGlmICgob0RhdGFGaWVsZCBhcyBEYXRhRmllbGRGb3JBbm5vdGF0aW9uKS5UYXJnZXQ/LiR0YXJnZXQuJFR5cGUgPT09IENvbW11bmljYXRpb25Bbm5vdGF0aW9uVHlwZXMuQ29udGFjdFR5cGUpIHtcblx0XHRcdFx0XHRzRGF0YVR5cGUgPSAoKChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pLlRhcmdldD8uJHRhcmdldCBhcyBDb250YWN0KT8uZm4gYXMgYW55KS4kdGFyZ2V0Py50eXBlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pLlRhcmdldD8uJHRhcmdldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZSkge1xuXHRcdFx0XHRcdHNEYXRhVHlwZSA9XG5cdFx0XHRcdFx0XHQoKG9EYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikuVGFyZ2V0Py4kdGFyZ2V0IGFzIERhdGFQb2ludCk/LlZhbHVlPy4kUGF0aD8uJFR5cGUgfHxcblx0XHRcdFx0XHRcdCgob0RhdGFGaWVsZCBhcyBEYXRhRmllbGRGb3JBbm5vdGF0aW9uKS5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmFsdWU/LiR0YXJnZXQudHlwZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBlLmcuIEZpZWxkR3JvdXAgb3IgQ2hhcnRcblx0XHRcdFx0XHQvLyBGaWVsZEdyb3VwIFByb3BlcnRpZXMgaGF2ZSBubyB0eXBlLCBzbyB3ZSBkZWZpbmUgaXQgYXMgYSBib29sZWFuIHR5cGUgdG8gcHJldmVudCBleGNlcHRpb25zIGR1cmluZyB0aGUgY2FsY3VsYXRpb24gb2YgdGhlIHdpZHRoXG5cdFx0XHRcdFx0c0RhdGFUeXBlID1cblx0XHRcdFx0XHRcdChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pLlRhcmdldD8uJHRhcmdldC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydERlZmluaXRpb25UeXBlXCJcblx0XHRcdFx0XHRcdFx0PyB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0OiBcIkVkbS5Cb29sZWFuXCI7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNEYXRhVHlwZSA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHNEYXRhVHlwZTtcbn07XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7O0VBaUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sU0FBU0EsNEJBQVQsQ0FBc0NDLFNBQXRDLEVBQXVIO0lBQzdILE9BQVFBLFNBQUQsQ0FBK0NDLGNBQS9DLENBQThELFFBQTlELENBQVA7RUFDQTtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztFQUNPLFNBQVNDLGdCQUFULENBQTBCRixTQUExQixFQUEwRjtJQUNoRyxPQUFRQSxTQUFELENBQThCQyxjQUE5QixDQUE2QyxPQUE3QyxDQUFQO0VBQ0E7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTRSx1QkFBVCxDQUFpQ0gsU0FBakMsRUFBNkU7SUFBQTs7SUFDbkYsT0FDQywwQkFBQUEsU0FBUyxDQUFDSSxXQUFWLDBHQUF1QkMsRUFBdkIsNEdBQTJCQyxNQUEzQixrRkFBbUNDLE9BQW5DLFFBQWlELElBQWpELElBQ0NMLGdCQUFnQixDQUFDRixTQUFELENBQWhCLElBQStCLHFCQUFBQSxTQUFTLENBQUNRLEtBQVYsK0ZBQWlCQyxPQUFqQiwwR0FBMEJMLFdBQTFCLDRHQUF1Q0MsRUFBdkMsa0ZBQTJDQyxNQUEzQyxNQUFzRCxJQUZ2RjtFQUlBOzs7O0VBRU0sU0FBU0kscUJBQVQsQ0FBK0JDLGdCQUEvQixFQUFtRUMsTUFBbkUsRUFBb0c7SUFDMUcsSUFBSSxPQUFPQSxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO01BQUE7O01BQy9CLElBQUlWLGdCQUFnQixDQUFDVSxNQUFELENBQWhCLHFCQUE0QkEsTUFBTSxDQUFDSixLQUFuQywwQ0FBNEIsY0FBY0MsT0FBOUMsRUFBdUQ7UUFBQTs7UUFDdEQsSUFBTUksUUFBUSxxQkFBR0QsTUFBTSxDQUFDSixLQUFWLG1EQUFHLGVBQWNDLE9B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