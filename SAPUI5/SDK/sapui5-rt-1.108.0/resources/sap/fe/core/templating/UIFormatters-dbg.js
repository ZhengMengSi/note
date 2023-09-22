/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/DisplayModeFormatter", "sap/fe/core/templating/FieldControlHelper", "sap/fe/core/templating/PropertyHelper"], function (BindingHelper, MetaModelConverter, valueFormatters, BindingToolkit, DataModelPathHelper, DisplayModeFormatter, FieldControlHelper, PropertyHelper) {
  "use strict";

  var _exports = {};
  var isProperty = PropertyHelper.isProperty;
  var isPathExpression = PropertyHelper.isPathExpression;
  var isKey = PropertyHelper.isKey;
  var isImmutable = PropertyHelper.isImmutable;
  var isComputed = PropertyHelper.isComputed;
  var hasValueHelp = PropertyHelper.hasValueHelp;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var isRequiredExpression = FieldControlHelper.isRequiredExpression;
  var isReadOnlyExpression = FieldControlHelper.isReadOnlyExpression;
  var isNonEditableExpression = FieldControlHelper.isNonEditableExpression;
  var isDisabledExpression = FieldControlHelper.isDisabledExpression;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getRelativePaths = DataModelPathHelper.getRelativePaths;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var notEqual = BindingToolkit.notEqual;
  var not = BindingToolkit.not;
  var isTruthy = BindingToolkit.isTruthy;
  var isConstant = BindingToolkit.isConstant;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  var addTypeInformation = BindingToolkit.addTypeInformation;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var convertMetaModelContext = MetaModelConverter.convertMetaModelContext;
  var UI = BindingHelper.UI;
  var singletonPathVisitor = BindingHelper.singletonPathVisitor;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var EDM_TYPE_MAPPING = DisplayModeFormatter.EDM_TYPE_MAPPING;
  _exports.EDM_TYPE_MAPPING = EDM_TYPE_MAPPING;

  var getDisplayMode = function (oDataModelObjectPath) {
    return DisplayModeFormatter.getDisplayMode(oDataModelObjectPath.targetObject, oDataModelObjectPath);
  };

  _exports.getDisplayMode = getDisplayMode;

  var getEditableExpressionAsObject = function (oPropertyPath) {
    var oDataFieldConverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var oDataModelObjectPath = arguments.length > 2 ? arguments[2] : undefined;
    var isEditable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : UI.IsEditable;
    return getEditableExpression(oPropertyPath, oDataFieldConverted, oDataModelObjectPath, true, isEditable);
  };
  /**
   * Create the expression to generate an "editable" boolean value.
   *
   * @param oPropertyPath The input property
   * @param oDataFieldConverted The DataFieldConverted object to read the fieldControl annotation
   * @param oDataModelObjectPath The path to this property object
   * @param bAsObject Whether or not this should be returned as an object or a binding string
   * @param isEditable Whether or not UI.IsEditable be considered.
   * @returns The binding expression used to determine if a property is editable or not
   */


  _exports.getEditableExpressionAsObject = getEditableExpressionAsObject;

  var getEditableExpression = function (oPropertyPath) {
    var oDataFieldConverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var oDataModelObjectPath = arguments.length > 2 ? arguments[2] : undefined;
    var bAsObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var isEditable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : UI.IsEditable;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return compileExpression(false);
    }

    var dataFieldEditableExpression = constant(true);

    if (oDataFieldConverted !== null) {
      dataFieldEditableExpression = ifElse(isNonEditableExpression(oDataFieldConverted), false, isEditable);
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    var relativePath = getRelativePaths(oDataModelObjectPath); // Editability depends on the field control expression
    // If the Field control is statically in ReadOnly or Inapplicable (disabled) -> not editable
    // If the property is a key -> not editable except in creation if not computed
    // If the property is computed -> not editable
    // If the property is not updatable -> not editable
    // If the property is immutable -> not editable except in creation
    // If the Field control is a path resolving to ReadOnly or Inapplicable (disabled) (<= 1) -> not editable
    // Else, to be editable you need
    // immutable and key while in the creation row
    // ui/isEditable

    var isPathUpdatableExpression = isPathUpdatable(oDataModelObjectPath, {
      propertyPath: oPropertyPath,
      pathVisitor: function (path, navigationPaths) {
        return singletonPathVisitor(path, oDataModelObjectPath.convertedTypes, navigationPaths);
      }
    });
    var editableExpression = ifElse(or(not(isPathUpdatableExpression), isComputed(oProperty), isKey(oProperty), isImmutable(oProperty), isNonEditableExpression(oProperty, relativePath)), ifElse(or(isComputed(oProperty), isNonEditableExpression(oProperty, relativePath)), false, UI.IsTransientBinding), isEditable);

    if (bAsObject) {
      return and(editableExpression, dataFieldEditableExpression);
    }

    return compileExpression(and(editableExpression, dataFieldEditableExpression));
  };

  _exports.getEditableExpression = getEditableExpression;

  var getCollaborationExpression = function (dataModelObjectPath, formatter) {
    var _dataModelObjectPath$;

    var objectPath = getTargetObjectPath(dataModelObjectPath);
    var activityExpression = pathInModel("/collaboration/activities".concat(objectPath), "internal");
    var keys = dataModelObjectPath === null || dataModelObjectPath === void 0 ? void 0 : (_dataModelObjectPath$ = dataModelObjectPath.targetEntityType) === null || _dataModelObjectPath$ === void 0 ? void 0 : _dataModelObjectPath$.keys;
    var keysExpressions = [];
    keys === null || keys === void 0 ? void 0 : keys.forEach(function (key) {
      var keyExpression = pathInModel(key.name);
      keysExpressions.push(keyExpression);
    });
    return formatResult([activityExpression].concat(keysExpressions), formatter);
  };

  _exports.getCollaborationExpression = getCollaborationExpression;

  var getEnabledExpressionAsObject = function (oPropertyPath, oDataFieldConverted, oDataModelObjectPath) {
    return getEnabledExpression(oPropertyPath, oDataFieldConverted, true, oDataModelObjectPath);
  };
  /**
   * Create the expression to generate an "enabled" Boolean value.
   *
   * @param oPropertyPath The input property
   * @param oDataFieldConverted The DataFieldConverted Object to read the fieldControl annotation
   * @param bAsObject Whether or not this should be returned as an object or a binding string
   * @param oDataModelObjectPath
   * @returns The binding expression to determine if a property is enabled or not
   */


  _exports.getEnabledExpressionAsObject = getEnabledExpressionAsObject;

  var getEnabledExpression = function (oPropertyPath, oDataFieldConverted) {
    var bAsObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var oDataModelObjectPath = arguments.length > 3 ? arguments[3] : undefined;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return compileExpression(true);
    }

    var relativePath;

    if (oDataModelObjectPath) {
      relativePath = getRelativePaths(oDataModelObjectPath);
    }

    var dataFieldEnabledExpression = constant(true);

    if (oDataFieldConverted !== null) {
      dataFieldEnabledExpression = ifElse(isDisabledExpression(oDataFieldConverted), false, true);
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath; // Enablement depends on the field control expression
    // If the Field control is statically in Inapplicable (disabled) -> not enabled

    var enabledExpression = ifElse(isDisabledExpression(oProperty, relativePath), false, true);

    if (bAsObject) {
      return and(enabledExpression, dataFieldEnabledExpression);
    }

    return compileExpression(and(enabledExpression, dataFieldEnabledExpression));
  };
  /**
   * Create the expression to generate an "editMode" enum value.
   *
   * @param oPropertyPath The input property
   * @param oDataModelObjectPath The list of data model objects that are involved to reach that property
   * @param bMeasureReadOnly Whether we should set UoM / currency field mode to read only
   * @param bAsObject Whether we should return this as an expression or as a string
   * @param oDataFieldConverted The dataField object
   * @param isEditable Whether or not UI.IsEditable be considered.
   * @returns The binding expression representing the current property edit mode, compliant with the MDC Field definition of editMode.
   */


  _exports.getEnabledExpression = getEnabledExpression;

  var getEditMode = function (oPropertyPath, oDataModelObjectPath) {
    var bMeasureReadOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var bAsObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var oDataFieldConverted = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var isEditable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : UI.IsEditable;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return "Display";
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    var relativePath = getRelativePaths(oDataModelObjectPath); // if the property is not enabled => Disabled
    // if the property is enabled && not editable => ReadOnly
    // if the property is enabled && editable => Editable
    // If there is an associated unit, and it has a field control also use consider the following
    // if the unit field control is readonly -> EditableReadOnly
    // otherwise -> Editable

    var editableExpression = getEditableExpressionAsObject(oPropertyPath, oDataFieldConverted, oDataModelObjectPath, isEditable);
    var enabledExpression = getEnabledExpressionAsObject(oPropertyPath, oDataFieldConverted, oDataModelObjectPath);
    var associatedCurrencyProperty = getAssociatedCurrencyProperty(oProperty);
    var unitProperty = associatedCurrencyProperty || getAssociatedUnitProperty(oProperty);
    var resultExpression = constant("Editable");

    if (unitProperty) {
      var isUnitReadOnly = isReadOnlyExpression(unitProperty, relativePath);
      resultExpression = ifElse(or(isUnitReadOnly, isComputed(unitProperty), bMeasureReadOnly), ifElse(!isConstant(isUnitReadOnly) && isUnitReadOnly, "EditableReadOnly", "EditableDisplay"), "Editable");
    }

    var readOnlyExpression = or(isReadOnlyExpression(oProperty, relativePath), isReadOnlyExpression(oDataFieldConverted)); // if the property is from a non-updatable entity => Read only mode, previously calculated edit Mode is ignored
    // if the property is from an updatable entity => previously calculated edit Mode expression

    var editModeExpression = ifElse(enabledExpression, ifElse(editableExpression, resultExpression, ifElse(and(!isConstant(readOnlyExpression) && readOnlyExpression, isEditable), "ReadOnly", "Display")), ifElse(isEditable, "Disabled", "Display"));

    if (bAsObject) {
      return editModeExpression;
    }

    return compileExpression(editModeExpression);
  };

  _exports.getEditMode = getEditMode;

  var hasValidAnalyticalCurrencyOrUnit = function (oPropertyDataModelObjectPath) {
    var _oPropertyDefinition$, _oPropertyDefinition$2, _oPropertyDefinition$3, _oPropertyDefinition$4;

    var oPropertyDefinition = oPropertyDataModelObjectPath.targetObject;
    var currency = (_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Measures) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.ISOCurrency;
    var measure = currency ? currency : (_oPropertyDefinition$3 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$3 === void 0 ? void 0 : (_oPropertyDefinition$4 = _oPropertyDefinition$3.Measures) === null || _oPropertyDefinition$4 === void 0 ? void 0 : _oPropertyDefinition$4.Unit;

    if (measure) {
      return compileExpression(or(isTruthy(getExpressionFromAnnotation(measure)), not(UI.IsTotal)));
    } else {
      return compileExpression(constant(true));
    }
  };

  _exports.hasValidAnalyticalCurrencyOrUnit = hasValidAnalyticalCurrencyOrUnit;

  var ifUnitEditable = function (oPropertyPath, sEditableValue, sNonEditableValue) {
    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    var unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);

    if (!unitProperty) {
      return compileExpression(sNonEditableValue);
    }

    var isUnitReadOnly = isReadOnlyExpression(unitProperty);
    var editableExpression = and(or(!isConstant(isUnitReadOnly), not(isUnitReadOnly)), not(isComputed(unitProperty)));
    return compileExpression(ifElse(editableExpression, sEditableValue, sNonEditableValue));
  };

  _exports.ifUnitEditable = ifUnitEditable;

  var getFieldDisplay = function (oPropertyPath, sTargetDisplayMode, oComputedEditMode) {
    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    return hasValueHelp(oProperty) ? compileExpression(sTargetDisplayMode) : compileExpression(ifElse(equal(oComputedEditMode, "Editable"), "Value", sTargetDisplayMode));
  };

  _exports.getFieldDisplay = getFieldDisplay;

  var formatWithTypeInformation = function (oProperty, propertyBindingExpression) {
    var ignoreConstraints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var outExpression = propertyBindingExpression;

    if (oProperty._type === "Property") {
      var oTargetMapping = EDM_TYPE_MAPPING[oProperty.type];

      if (oTargetMapping) {
        var _outExpression$type, _outExpression$type2, _outExpression$type3;

        outExpression.type = oTargetMapping.type;

        if (oTargetMapping.constraints && !ignoreConstraints) {
          var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3, _oProperty$annotation4;

          outExpression.constraints = {};

          if (oTargetMapping.constraints.$Scale && oProperty.scale !== undefined) {
            outExpression.constraints.scale = oProperty.scale;
          }

          if (oTargetMapping.constraints.$Precision && oProperty.precision !== undefined) {
            outExpression.constraints.precision = oProperty.precision;
          }

          if (oTargetMapping.constraints.$MaxLength && oProperty.maxLength !== undefined) {
            outExpression.constraints.maxLength = oProperty.maxLength;
          }

          if (oProperty.nullable === false) {
            outExpression.constraints.nullable = oProperty.nullable;
          }

          if (oTargetMapping.constraints["@Org.OData.Validation.V1.Minimum/$Decimal"] && ((_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.Validation) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.Minimum) !== undefined && !isNaN(oProperty.annotations.Validation.Minimum)) {
            outExpression.constraints.minimum = "".concat(oProperty.annotations.Validation.Minimum);
          }

          if (oTargetMapping.constraints["@Org.OData.Validation.V1.Maximum/$Decimal"] && ((_oProperty$annotation3 = oProperty.annotations) === null || _oProperty$annotation3 === void 0 ? void 0 : (_oProperty$annotation4 = _oProperty$annotation3.Validation) === null || _oProperty$annotation4 === void 0 ? void 0 : _oProperty$annotation4.Maximum) !== undefined && !isNaN(oProperty.annotations.Validation.Maximum)) {
            outExpression.constraints.maximum = "".concat(oProperty.annotations.Validation.Maximum);
          }
        } else if (oProperty.nullable === false) {
          outExpression.constraints = {};
          outExpression.constraints.nullable = oProperty.nullable;
        }

        if ((outExpression === null || outExpression === void 0 ? void 0 : (_outExpression$type = outExpression.type) === null || _outExpression$type === void 0 ? void 0 : _outExpression$type.indexOf("sap.ui.model.odata.type.Int")) === 0) {
          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
            parseAsString: false,
            emptyString: ""
          });
        }

        if (outExpression.type === "sap.ui.model.odata.type.String") {
          var _oTargetMapping$const, _oProperty$annotation5, _oProperty$annotation6;

          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions.parseKeepsEmptyString = true;

          if ((_oTargetMapping$const = oTargetMapping.constraints) !== null && _oTargetMapping$const !== void 0 && _oTargetMapping$const["@com.sap.vocabularies.Common.v1.IsDigitSequence"] && (_oProperty$annotation5 = oProperty.annotations) !== null && _oProperty$annotation5 !== void 0 && (_oProperty$annotation6 = _oProperty$annotation5.Common) !== null && _oProperty$annotation6 !== void 0 && _oProperty$annotation6.IsDigitSequence) {
            outExpression.constraints.isDigitSequence = true;
          }
        }

        if ((outExpression === null || outExpression === void 0 ? void 0 : (_outExpression$type2 = outExpression.type) === null || _outExpression$type2 === void 0 ? void 0 : _outExpression$type2.indexOf("sap.ui.model.odata.type.Double")) === 0) {
          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
            parseAsString: false,
            emptyString: ""
          });
        }

        if ((outExpression === null || outExpression === void 0 ? void 0 : (_outExpression$type3 = outExpression.type) === null || _outExpression$type3 === void 0 ? void 0 : _outExpression$type3.indexOf("sap.ui.model.odata.type.DateTimeOffset")) === 0) {
          outExpression.constraints.V4 = true;
        }
      }
    }

    return outExpression;
  };

  _exports.formatWithTypeInformation = formatWithTypeInformation;

  var getTypeConfig = function (oProperty, dataType) {
    var _propertyTypeConfig$t, _propertyTypeConfig$t2, _propertyTypeConfig$t3, _propertyTypeConfig$t4;

    var oTargetMapping = EDM_TYPE_MAPPING[oProperty === null || oProperty === void 0 ? void 0 : oProperty.type] || (dataType ? EDM_TYPE_MAPPING[dataType] : undefined);
    var propertyTypeConfig = {
      type: oTargetMapping.type,
      constraints: {},
      formatOptions: {}
    };

    if (isProperty(oProperty)) {
      var _oTargetMapping$const2, _oTargetMapping$const3, _oTargetMapping$const4, _oTargetMapping$const5, _oTargetMapping$const6, _oProperty$annotation7, _oProperty$annotation8, _oProperty$annotation9, _oProperty$annotation10, _oTargetMapping$const7, _oProperty$annotation11, _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14, _oTargetMapping$const8, _oProperty$annotation15, _oProperty$annotation16, _oTargetMapping$const9;

      propertyTypeConfig.constraints = {
        scale: (_oTargetMapping$const2 = oTargetMapping.constraints) !== null && _oTargetMapping$const2 !== void 0 && _oTargetMapping$const2.$Scale ? oProperty.scale : undefined,
        precision: (_oTargetMapping$const3 = oTargetMapping.constraints) !== null && _oTargetMapping$const3 !== void 0 && _oTargetMapping$const3.$Precision ? oProperty.precision : undefined,
        maxLength: (_oTargetMapping$const4 = oTargetMapping.constraints) !== null && _oTargetMapping$const4 !== void 0 && _oTargetMapping$const4.$MaxLength ? oProperty.maxLength : undefined,
        nullable: (_oTargetMapping$const5 = oTargetMapping.constraints) !== null && _oTargetMapping$const5 !== void 0 && _oTargetMapping$const5.$Nullable ? oProperty.nullable : undefined,
        minimum: (_oTargetMapping$const6 = oTargetMapping.constraints) !== null && _oTargetMapping$const6 !== void 0 && _oTargetMapping$const6["@Org.OData.Validation.V1.Minimum/$Decimal"] && !isNaN((_oProperty$annotation7 = oProperty.annotations) === null || _oProperty$annotation7 === void 0 ? void 0 : (_oProperty$annotation8 = _oProperty$annotation7.Validation) === null || _oProperty$annotation8 === void 0 ? void 0 : _oProperty$annotation8.Minimum) ? "".concat((_oProperty$annotation9 = oProperty.annotations) === null || _oProperty$annotation9 === void 0 ? void 0 : (_oProperty$annotation10 = _oProperty$annotation9.Validation) === null || _oProperty$annotation10 === void 0 ? void 0 : _oProperty$annotation10.Minimum) : undefined,
        maximum: (_oTargetMapping$const7 = oTargetMapping.constraints) !== null && _oTargetMapping$const7 !== void 0 && _oTargetMapping$const7["@Org.OData.Validation.V1.Maximum/$Decimal"] && !isNaN((_oProperty$annotation11 = oProperty.annotations) === null || _oProperty$annotation11 === void 0 ? void 0 : (_oProperty$annotation12 = _oProperty$annotation11.Validation) === null || _oProperty$annotation12 === void 0 ? void 0 : _oProperty$annotation12.Maximum) ? "".concat((_oProperty$annotation13 = oProperty.annotations) === null || _oProperty$annotation13 === void 0 ? void 0 : (_oProperty$annotation14 = _oProperty$annotation13.Validation) === null || _oProperty$annotation14 === void 0 ? void 0 : _oProperty$annotation14.Maximum) : undefined,
        isDigitSequence: propertyTypeConfig.type === "sap.ui.model.odata.type.String" && (_oTargetMapping$const8 = oTargetMapping.constraints) !== null && _oTargetMapping$const8 !== void 0 && _oTargetMapping$const8["@com.sap.vocabularies.Common.v1.IsDigitSequence"] && (_oProperty$annotation15 = oProperty.annotations) !== null && _oProperty$annotation15 !== void 0 && (_oProperty$annotation16 = _oProperty$annotation15.Common) !== null && _oProperty$annotation16 !== void 0 && _oProperty$annotation16.IsDigitSequence ? true : undefined,
        V4: (_oTargetMapping$const9 = oTargetMapping.constraints) !== null && _oTargetMapping$const9 !== void 0 && _oTargetMapping$const9.$V4 ? true : undefined
      };
    }

    propertyTypeConfig.formatOptions = {
      parseAsString: (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t = propertyTypeConfig.type) === null || _propertyTypeConfig$t === void 0 ? void 0 : _propertyTypeConfig$t.indexOf("sap.ui.model.odata.type.Int")) === 0 || (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t2 = propertyTypeConfig.type) === null || _propertyTypeConfig$t2 === void 0 ? void 0 : _propertyTypeConfig$t2.indexOf("sap.ui.model.odata.type.Double")) === 0 ? false : undefined,
      emptyString: (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t3 = propertyTypeConfig.type) === null || _propertyTypeConfig$t3 === void 0 ? void 0 : _propertyTypeConfig$t3.indexOf("sap.ui.model.odata.type.Int")) === 0 || (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t4 = propertyTypeConfig.type) === null || _propertyTypeConfig$t4 === void 0 ? void 0 : _propertyTypeConfig$t4.indexOf("sap.ui.model.odata.type.Double")) === 0 ? "" : undefined,
      parseKeepsEmptyString: propertyTypeConfig.type === "sap.ui.model.odata.type.String" ? true : undefined
    };
    return propertyTypeConfig;
  };

  _exports.getTypeConfig = getTypeConfig;

  var getBindingWithUnitOrCurrency = function (oPropertyDataModelPath, propertyBindingExpression, ignoreUnitConstraint, formatOptions) {
    var _oPropertyDefinition$5, _oPropertyDefinition$6, _unit, _oPropertyDefinition$7, _oPropertyDefinition$8;

    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var unit = (_oPropertyDefinition$5 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$5 === void 0 ? void 0 : (_oPropertyDefinition$6 = _oPropertyDefinition$5.Measures) === null || _oPropertyDefinition$6 === void 0 ? void 0 : _oPropertyDefinition$6.Unit;
    var relativeLocation = getRelativePaths(oPropertyDataModelPath);
    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);

    if (((_unit = unit) === null || _unit === void 0 ? void 0 : _unit.toString()) === "%") {
      return formatResult([propertyBindingExpression], valueFormatters.formatWithPercentage);
    }

    var complexType = unit ? "sap.ui.model.odata.type.Unit" : "sap.ui.model.odata.type.Currency";
    unit = unit ? unit : (_oPropertyDefinition$7 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$7 === void 0 ? void 0 : (_oPropertyDefinition$8 = _oPropertyDefinition$7.Measures) === null || _oPropertyDefinition$8 === void 0 ? void 0 : _oPropertyDefinition$8.ISOCurrency;
    var unitBindingExpression = unit.$target ? formatWithTypeInformation(unit.$target, getExpressionFromAnnotation(unit, relativeLocation), ignoreUnitConstraint) : getExpressionFromAnnotation(unit, relativeLocation);
    return addTypeInformation([propertyBindingExpression, unitBindingExpression], complexType, undefined, formatOptions);
  };

  _exports.getBindingWithUnitOrCurrency = getBindingWithUnitOrCurrency;

  var getBindingForUnitOrCurrency = function (oPropertyDataModelPath) {
    var _oPropertyDefinition$9, _oPropertyDefinition$10, _unit2, _oPropertyDefinition$11, _oPropertyDefinition$12;

    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var unit = (_oPropertyDefinition$9 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$9 === void 0 ? void 0 : (_oPropertyDefinition$10 = _oPropertyDefinition$9.Measures) === null || _oPropertyDefinition$10 === void 0 ? void 0 : _oPropertyDefinition$10.Unit;

    if (((_unit2 = unit) === null || _unit2 === void 0 ? void 0 : _unit2.toString()) === "%") {
      return constant("%");
    }

    var relativeLocation = getRelativePaths(oPropertyDataModelPath);
    var complexType = unit ? "sap.ui.model.odata.type.Unit" : "sap.ui.model.odata.type.Currency";
    unit = unit ? unit : (_oPropertyDefinition$11 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$11 === void 0 ? void 0 : (_oPropertyDefinition$12 = _oPropertyDefinition$11.Measures) === null || _oPropertyDefinition$12 === void 0 ? void 0 : _oPropertyDefinition$12.ISOCurrency;
    var unitBindingExpression = unit.$target ? formatWithTypeInformation(unit.$target, getExpressionFromAnnotation(unit, relativeLocation)) : getExpressionFromAnnotation(unit, relativeLocation);
    var propertyBindingExpression = pathInModel(getContextRelativeTargetObjectPath(oPropertyDataModelPath));
    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression, true);
    return addTypeInformation([propertyBindingExpression, unitBindingExpression], complexType, undefined, {
      parseKeepsEmptyString: true,
      emptyString: "",
      showNumber: false
    });
  };

  _exports.getBindingForUnitOrCurrency = getBindingForUnitOrCurrency;

  var getBindingWithTimezone = function (oPropertyDataModelPath, propertyBindingExpression) {
    var _oPropertyDefinition$13, _oPropertyDefinition$14;

    var ignoreUnitConstraint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var hideTimezoneForEmptyValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var timezone = (_oPropertyDefinition$13 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$13 === void 0 ? void 0 : (_oPropertyDefinition$14 = _oPropertyDefinition$13.Common) === null || _oPropertyDefinition$14 === void 0 ? void 0 : _oPropertyDefinition$14.Timezone;
    var relativeLocation = getRelativePaths(oPropertyDataModelPath);
    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);
    var complexType = "sap.fe.core.type.DateTimeWithTimezone";
    var unitBindingExpression = timezone.$target ? formatWithTypeInformation(timezone.$target, getExpressionFromAnnotation(timezone, relativeLocation), ignoreUnitConstraint) : getExpressionFromAnnotation(timezone, relativeLocation);
    var formatOptions;

    if (hideTimezoneForEmptyValues) {
      formatOptions = {
        showTimezoneForEmptyValues: false
      };
    }

    return addTypeInformation([propertyBindingExpression, unitBindingExpression], complexType, undefined, formatOptions);
  };

  _exports.getBindingWithTimezone = getBindingWithTimezone;

  var getAlignmentExpression = function (oComputedEditMode) {
    var sAlignDisplay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Begin";
    var sAlignEdit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Begin";
    return compileExpression(ifElse(equal(oComputedEditMode, "Display"), sAlignDisplay, sAlignEdit));
  };
  /**
   * Formatter helper to retrieve the converterContext from the metamodel context.
   *
   * @param oContext The original metamodel context
   * @param oInterface The current templating context
   * @returns The ConverterContext representing that object
   */


  _exports.getAlignmentExpression = getAlignmentExpression;

  var getConverterContext = function (oContext, oInterface) {
    if (oInterface && oInterface.context) {
      return convertMetaModelContext(oInterface.context);
    }

    return null;
  };

  getConverterContext.requiresIContext = true;
  /**
   * Formatter helper to retrieve the data model objects that are involved from the metamodel context.
   *
   * @param oContext The original ODataMetaModel context
   * @param oInterface The current templating context
   * @returns An array of entitysets and navproperties that are involved to get to a specific object in the metamodel
   */

  _exports.getConverterContext = getConverterContext;

  var getDataModelObjectPath = function (oContext, oInterface) {
    if (oInterface && oInterface.context) {
      return getInvolvedDataModelObjects(oInterface.context);
    }

    return null;
  };

  getDataModelObjectPath.requiresIContext = true;
  _exports.getDataModelObjectPath = getDataModelObjectPath;

  var isCollectionField = function (oDataModelPath) {
    var _oDataModelPath$navig;

    if ((_oDataModelPath$navig = oDataModelPath.navigationProperties) !== null && _oDataModelPath$navig !== void 0 && _oDataModelPath$navig.length) {
      var hasOneToManyNavigation = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : oDataModelPath.navigationProperties.findIndex(function (oNav) {
        if (oNav.isCollection) {
          var _oDataModelPath$conte, _oDataModelPath$conte2;

          if ((_oDataModelPath$conte = oDataModelPath.contextLocation) !== null && _oDataModelPath$conte !== void 0 && (_oDataModelPath$conte2 = _oDataModelPath$conte.navigationProperties) !== null && _oDataModelPath$conte2 !== void 0 && _oDataModelPath$conte2.length) {
            var _oDataModelPath$conte3;

            //we check the one to many nav is not already part of the context
            return ((_oDataModelPath$conte3 = oDataModelPath.contextLocation) === null || _oDataModelPath$conte3 === void 0 ? void 0 : _oDataModelPath$conte3.navigationProperties.findIndex(function (oContextNav) {
              return oContextNav.name === oNav.name;
            })) === -1;
          }

          return true;
        }

        return false;
      })) > -1;

      if (hasOneToManyNavigation) {
        return true;
      }
    }

    return false;
  };

  _exports.isCollectionField = isCollectionField;

  var getRequiredExpressionAsObject = function (oPropertyPath, oDataFieldConverted) {
    var forceEditMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return getRequiredExpression(oPropertyPath, oDataFieldConverted, forceEditMode, true);
  };

  _exports.getRequiredExpressionAsObject = getRequiredExpressionAsObject;

  var getRequiredExpression = function (oPropertyPath, oDataFieldConverted) {
    var forceEditMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var bAsObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var oRequiredProperties = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var dataModelObjectPath = arguments.length > 5 ? arguments[5] : undefined;
    var returnExpression;
    var aRequiredPropertiesFromInsertRestrictions = oRequiredProperties.requiredPropertiesFromInsertRestrictions || [];
    var aRequiredPropertiesFromUpdateRestrictions = oRequiredProperties.requiredPropertiesFromUpdateRestrictions || [];

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      returnExpression = constant(false);
    } else {
      var relativePath;

      if (dataModelObjectPath) {
        relativePath = getRelativePaths(dataModelObjectPath);
      }

      var dataFieldRequiredExpression = constant(true);

      if (oDataFieldConverted !== null) {
        dataFieldRequiredExpression = isRequiredExpression(oDataFieldConverted);
      }

      var requiredPropertyFromInsertRestrictionsExpression = constant(false);
      var requiredPropertyFromUpdateRestrictionsExpression = constant(false);
      var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath; // Enablement depends on the field control expression
      // If the Field control is statically in Inapplicable (disabled) -> not enabled

      var requiredExpression = isRequiredExpression(oProperty, relativePath);
      var editMode = forceEditMode || UI.IsEditable;

      if (aRequiredPropertiesFromInsertRestrictions.length && aRequiredPropertiesFromInsertRestrictions.includes(oPropertyPath.name)) {
        requiredPropertyFromInsertRestrictionsExpression = and(constant(true), UI.IsCreateMode);
      }

      if (aRequiredPropertiesFromUpdateRestrictions.length && aRequiredPropertiesFromUpdateRestrictions.includes(oPropertyPath.name)) {
        requiredPropertyFromUpdateRestrictionsExpression = and(constant(true), notEqual(UI.IsCreateMode, true));
      }

      returnExpression = or(and(or(requiredExpression, dataFieldRequiredExpression), editMode), requiredPropertyFromInsertRestrictionsExpression, requiredPropertyFromUpdateRestrictionsExpression);
    }

    if (bAsObject) {
      return returnExpression;
    }

    return compileExpression(returnExpression);
  };

  _exports.getRequiredExpression = getRequiredExpression;

  var getRequiredExpressionForConnectedDataField = function (dataFieldObjectPath) {
    var _dataFieldObjectPath$, _dataFieldObjectPath$2;

    var data = dataFieldObjectPath === null || dataFieldObjectPath === void 0 ? void 0 : (_dataFieldObjectPath$ = dataFieldObjectPath.targetObject) === null || _dataFieldObjectPath$ === void 0 ? void 0 : (_dataFieldObjectPath$2 = _dataFieldObjectPath$.$target) === null || _dataFieldObjectPath$2 === void 0 ? void 0 : _dataFieldObjectPath$2.Data;
    var keys = Object.keys(data);
    var dataFields = [];
    var propertyPath;
    var isRequiredExpressions = [];

    for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
      var key = _keys[_i];

      if (data[key]["$Type"] && data[key]["$Type"].indexOf("DataField") > -1) {
        dataFields.push(data[key]);
      }
    }

    for (var _i2 = 0, _dataFields = dataFields; _i2 < _dataFields.length; _i2++) {
      var dataField = _dataFields[_i2];

      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
          if (typeof dataField.Value === "object") {
            propertyPath = dataField.Value.$target;
          }

          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          if (dataField.Target.$target) {
            if (dataField.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataField" || dataField.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
              if (typeof dataField.Target.$target.Value === "object") {
                propertyPath = dataField.Target.$target.Value.$target;
              }
            } else {
              if (typeof dataField.Target === "object") {
                propertyPath = dataField.Target.$target;
              }

              break;
            }
          }

          break;
        // no default
      }

      isRequiredExpressions.push(getRequiredExpressionAsObject(propertyPath, dataField, false));
    }

    return compileExpression(or.apply(void 0, _toConsumableArray(isRequiredExpressions)));
  };

  _exports.getRequiredExpressionForConnectedDataField = getRequiredExpressionForConnectedDataField;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFRE1fVFlQRV9NQVBQSU5HIiwiRGlzcGxheU1vZGVGb3JtYXR0ZXIiLCJnZXREaXNwbGF5TW9kZSIsIm9EYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0T2JqZWN0IiwiZ2V0RWRpdGFibGVFeHByZXNzaW9uQXNPYmplY3QiLCJvUHJvcGVydHlQYXRoIiwib0RhdGFGaWVsZENvbnZlcnRlZCIsImlzRWRpdGFibGUiLCJVSSIsIklzRWRpdGFibGUiLCJnZXRFZGl0YWJsZUV4cHJlc3Npb24iLCJiQXNPYmplY3QiLCJjb21waWxlRXhwcmVzc2lvbiIsImRhdGFGaWVsZEVkaXRhYmxlRXhwcmVzc2lvbiIsImNvbnN0YW50IiwiaWZFbHNlIiwiaXNOb25FZGl0YWJsZUV4cHJlc3Npb24iLCJvUHJvcGVydHkiLCJpc1BhdGhFeHByZXNzaW9uIiwiJHRhcmdldCIsInJlbGF0aXZlUGF0aCIsImdldFJlbGF0aXZlUGF0aHMiLCJpc1BhdGhVcGRhdGFibGVFeHByZXNzaW9uIiwiaXNQYXRoVXBkYXRhYmxlIiwicHJvcGVydHlQYXRoIiwicGF0aFZpc2l0b3IiLCJwYXRoIiwibmF2aWdhdGlvblBhdGhzIiwic2luZ2xldG9uUGF0aFZpc2l0b3IiLCJjb252ZXJ0ZWRUeXBlcyIsImVkaXRhYmxlRXhwcmVzc2lvbiIsIm9yIiwibm90IiwiaXNDb21wdXRlZCIsImlzS2V5IiwiaXNJbW11dGFibGUiLCJJc1RyYW5zaWVudEJpbmRpbmciLCJhbmQiLCJnZXRDb2xsYWJvcmF0aW9uRXhwcmVzc2lvbiIsImRhdGFNb2RlbE9iamVjdFBhdGgiLCJmb3JtYXR0ZXIiLCJvYmplY3RQYXRoIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsImFjdGl2aXR5RXhwcmVzc2lvbiIsInBhdGhJbk1vZGVsIiwia2V5cyIsInRhcmdldEVudGl0eVR5cGUiLCJrZXlzRXhwcmVzc2lvbnMiLCJmb3JFYWNoIiwia2V5Iiwia2V5RXhwcmVzc2lvbiIsIm5hbWUiLCJwdXNoIiwiZm9ybWF0UmVzdWx0IiwiZ2V0RW5hYmxlZEV4cHJlc3Npb25Bc09iamVjdCIsImdldEVuYWJsZWRFeHByZXNzaW9uIiwiZGF0YUZpZWxkRW5hYmxlZEV4cHJlc3Npb24iLCJpc0Rpc2FibGVkRXhwcmVzc2lvbiIsImVuYWJsZWRFeHByZXNzaW9uIiwiZ2V0RWRpdE1vZGUiLCJiTWVhc3VyZVJlYWRPbmx5IiwiYXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsInVuaXRQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJyZXN1bHRFeHByZXNzaW9uIiwiaXNVbml0UmVhZE9ubHkiLCJpc1JlYWRPbmx5RXhwcmVzc2lvbiIsImlzQ29uc3RhbnQiLCJyZWFkT25seUV4cHJlc3Npb24iLCJlZGl0TW9kZUV4cHJlc3Npb24iLCJoYXNWYWxpZEFuYWx5dGljYWxDdXJyZW5jeU9yVW5pdCIsIm9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgiLCJvUHJvcGVydHlEZWZpbml0aW9uIiwiY3VycmVuY3kiLCJhbm5vdGF0aW9ucyIsIk1lYXN1cmVzIiwiSVNPQ3VycmVuY3kiLCJtZWFzdXJlIiwiVW5pdCIsImlzVHJ1dGh5IiwiZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uIiwiSXNUb3RhbCIsImlmVW5pdEVkaXRhYmxlIiwic0VkaXRhYmxlVmFsdWUiLCJzTm9uRWRpdGFibGVWYWx1ZSIsImdldEZpZWxkRGlzcGxheSIsInNUYXJnZXREaXNwbGF5TW9kZSIsIm9Db21wdXRlZEVkaXRNb2RlIiwiaGFzVmFsdWVIZWxwIiwiZXF1YWwiLCJmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uIiwicHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiIsImlnbm9yZUNvbnN0cmFpbnRzIiwib3V0RXhwcmVzc2lvbiIsIl90eXBlIiwib1RhcmdldE1hcHBpbmciLCJ0eXBlIiwiY29uc3RyYWludHMiLCIkU2NhbGUiLCJzY2FsZSIsInVuZGVmaW5lZCIsIiRQcmVjaXNpb24iLCJwcmVjaXNpb24iLCIkTWF4TGVuZ3RoIiwibWF4TGVuZ3RoIiwibnVsbGFibGUiLCJWYWxpZGF0aW9uIiwiTWluaW11bSIsImlzTmFOIiwibWluaW11bSIsIk1heGltdW0iLCJtYXhpbXVtIiwiaW5kZXhPZiIsImZvcm1hdE9wdGlvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJwYXJzZUFzU3RyaW5nIiwiZW1wdHlTdHJpbmciLCJwYXJzZUtlZXBzRW1wdHlTdHJpbmciLCJDb21tb24iLCJJc0RpZ2l0U2VxdWVuY2UiLCJpc0RpZ2l0U2VxdWVuY2UiLCJWNCIsImdldFR5cGVDb25maWciLCJkYXRhVHlwZSIsInByb3BlcnR5VHlwZUNvbmZpZyIsImlzUHJvcGVydHkiLCIkTnVsbGFibGUiLCIkVjQiLCJnZXRCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5Iiwib1Byb3BlcnR5RGF0YU1vZGVsUGF0aCIsImlnbm9yZVVuaXRDb25zdHJhaW50IiwidW5pdCIsInJlbGF0aXZlTG9jYXRpb24iLCJ0b1N0cmluZyIsInZhbHVlRm9ybWF0dGVycyIsImZvcm1hdFdpdGhQZXJjZW50YWdlIiwiY29tcGxleFR5cGUiLCJ1bml0QmluZGluZ0V4cHJlc3Npb24iLCJhZGRUeXBlSW5mb3JtYXRpb24iLCJnZXRCaW5kaW5nRm9yVW5pdE9yQ3VycmVuY3kiLCJnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoIiwic2hvd051bWJlciIsImdldEJpbmRpbmdXaXRoVGltZXpvbmUiLCJoaWRlVGltZXpvbmVGb3JFbXB0eVZhbHVlcyIsInRpbWV6b25lIiwiVGltZXpvbmUiLCJzaG93VGltZXpvbmVGb3JFbXB0eVZhbHVlcyIsImdldEFsaWdubWVudEV4cHJlc3Npb24iLCJzQWxpZ25EaXNwbGF5Iiwic0FsaWduRWRpdCIsImdldENvbnZlcnRlckNvbnRleHQiLCJvQ29udGV4dCIsIm9JbnRlcmZhY2UiLCJjb250ZXh0IiwiY29udmVydE1ldGFNb2RlbENvbnRleHQiLCJyZXF1aXJlc0lDb250ZXh0IiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsImlzQ29sbGVjdGlvbkZpZWxkIiwib0RhdGFNb2RlbFBhdGgiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsImxlbmd0aCIsImhhc09uZVRvTWFueU5hdmlnYXRpb24iLCJmaW5kSW5kZXgiLCJvTmF2IiwiaXNDb2xsZWN0aW9uIiwiY29udGV4dExvY2F0aW9uIiwib0NvbnRleHROYXYiLCJnZXRSZXF1aXJlZEV4cHJlc3Npb25Bc09iamVjdCIsImZvcmNlRWRpdE1vZGUiLCJnZXRSZXF1aXJlZEV4cHJlc3Npb24iLCJvUmVxdWlyZWRQcm9wZXJ0aWVzIiwicmV0dXJuRXhwcmVzc2lvbiIsImFSZXF1aXJlZFByb3BlcnRpZXNGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zIiwicmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyIsImFSZXF1aXJlZFByb3BlcnRpZXNGcm9tVXBkYXRlUmVzdHJpY3Rpb25zIiwicmVxdWlyZWRQcm9wZXJ0aWVzRnJvbVVwZGF0ZVJlc3RyaWN0aW9ucyIsImRhdGFGaWVsZFJlcXVpcmVkRXhwcmVzc2lvbiIsImlzUmVxdWlyZWRFeHByZXNzaW9uIiwicmVxdWlyZWRQcm9wZXJ0eUZyb21JbnNlcnRSZXN0cmljdGlvbnNFeHByZXNzaW9uIiwicmVxdWlyZWRQcm9wZXJ0eUZyb21VcGRhdGVSZXN0cmljdGlvbnNFeHByZXNzaW9uIiwicmVxdWlyZWRFeHByZXNzaW9uIiwiZWRpdE1vZGUiLCJpbmNsdWRlcyIsIklzQ3JlYXRlTW9kZSIsIm5vdEVxdWFsIiwiZ2V0UmVxdWlyZWRFeHByZXNzaW9uRm9yQ29ubmVjdGVkRGF0YUZpZWxkIiwiZGF0YUZpZWxkT2JqZWN0UGF0aCIsImRhdGEiLCJEYXRhIiwiZGF0YUZpZWxkcyIsImlzUmVxdWlyZWRFeHByZXNzaW9ucyIsImRhdGFGaWVsZCIsIiRUeXBlIiwiVmFsdWUiLCJUYXJnZXQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlVJRm9ybWF0dGVycy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5hdmlnYXRpb25Qcm9wZXJ0eSwgUGF0aEFubm90YXRpb25FeHByZXNzaW9uLCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHsgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgeyBzaW5nbGV0b25QYXRoVmlzaXRvciwgVUkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCB7IGNvbnZlcnRNZXRhTW9kZWxDb250ZXh0LCBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCB2YWx1ZUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVmFsdWVGb3JtYXR0ZXJcIjtcbmltcG9ydCB0eXBlIHsgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uLCBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiwgUGF0aEluTW9kZWxFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7XG5cdGFkZFR5cGVJbmZvcm1hdGlvbixcblx0YW5kLFxuXHRjb21waWxlRXhwcmVzc2lvbixcblx0Y29uc3RhbnQsXG5cdGVxdWFsLFxuXHRmb3JtYXRSZXN1bHQsXG5cdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbixcblx0aWZFbHNlLFxuXHRpc0NvbnN0YW50LFxuXHRpc1RydXRoeSxcblx0bm90LFxuXHRub3RFcXVhbCxcblx0b3IsXG5cdHBhdGhJbk1vZGVsXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQge1xuXHREYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoLFxuXHRnZXRSZWxhdGl2ZVBhdGhzLFxuXHRnZXRUYXJnZXRPYmplY3RQYXRoLFxuXHRpc1BhdGhVcGRhdGFibGVcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0ICogYXMgRGlzcGxheU1vZGVGb3JtYXR0ZXIgZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGlzcGxheU1vZGVGb3JtYXR0ZXJcIjtcbmltcG9ydCB7XG5cdGlzRGlzYWJsZWRFeHByZXNzaW9uLFxuXHRpc05vbkVkaXRhYmxlRXhwcmVzc2lvbixcblx0aXNSZWFkT25seUV4cHJlc3Npb24sXG5cdGlzUmVxdWlyZWRFeHByZXNzaW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0ZpZWxkQ29udHJvbEhlbHBlclwiO1xuaW1wb3J0IHtcblx0Z2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHksXG5cdGhhc1ZhbHVlSGVscCxcblx0aXNDb21wdXRlZCxcblx0aXNJbW11dGFibGUsXG5cdGlzS2V5LFxuXHRpc1BhdGhFeHByZXNzaW9uLFxuXHRpc1Byb3BlcnR5XG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuXG4vLyBJbXBvcnQtZXhwb3J0IG1ldGhvZCB1c2VkIGJ5IHRoZSBjb252ZXJ0ZXIgdG8gdXNlIHRoZW0gaW4gdGhlIHRlbXBsYXRpbmcgdGhyb3VnaCB0aGUgVUlGb3JtYXR0ZXJzLlxuZXhwb3J0IHR5cGUgRGlzcGxheU1vZGUgPSBEaXNwbGF5TW9kZUZvcm1hdHRlci5EaXNwbGF5TW9kZTtcblxuZXhwb3J0IGNvbnN0IEVETV9UWVBFX01BUFBJTkcgPSBEaXNwbGF5TW9kZUZvcm1hdHRlci5FRE1fVFlQRV9NQVBQSU5HO1xuXG5leHBvcnQgdHlwZSBQcm9wZXJ0eU9yUGF0aDxQPiA9IHN0cmluZyB8IFAgfCBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248UD47XG5leHBvcnQgdHlwZSBNZXRhTW9kZWxDb250ZXh0ID0ge1xuXHQka2luZDogc3RyaW5nO1xufTtcbmV4cG9ydCB0eXBlIENvbXB1dGVkQW5ub3RhdGlvbkludGVyZmFjZSA9IHtcblx0Y29udGV4dDogQ29udGV4dDtcblx0YXJndW1lbnRzPzogYW55W107XG5cdCQkdmFsdWVBc1Byb21pc2U/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgY29uZmlnVHlwZUNvbnN0cmFpbnRzID0ge1xuXHRzY2FsZT86IG51bWJlcjtcblx0cHJlY2lzaW9uPzogbnVtYmVyO1xuXHRtYXhMZW5ndGg/OiBudW1iZXI7XG5cdG51bGxhYmxlPzogYm9vbGVhbjtcblx0bWluaW11bT86IHN0cmluZztcblx0bWF4aW11bT86IHN0cmluZztcblx0aXNEaWdpdFNlcXVlbmNlPzogYm9vbGVhbjtcblx0VjQ/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgY29uZmlnVHlwZWZvcm1hdE9wdGlvbnMgPSB7XG5cdHBhcnNlQXNTdHJpbmc/OiBib29sZWFuO1xuXHRlbXB0eVN0cmluZz86IHN0cmluZztcblx0cGFyc2VLZWVwc0VtcHR5U3RyaW5nPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIGNvbmZpZ1R5cGUgPSB7XG5cdHR5cGU6IHN0cmluZztcblx0Y29uc3RyYWludHM6IGNvbmZpZ1R5cGVDb25zdHJhaW50cztcblx0Zm9ybWF0T3B0aW9uczogY29uZmlnVHlwZWZvcm1hdE9wdGlvbnM7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGlzcGxheU1vZGUgPSBmdW5jdGlvbiAob0RhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBEaXNwbGF5TW9kZSB7XG5cdHJldHVybiBEaXNwbGF5TW9kZUZvcm1hdHRlci5nZXREaXNwbGF5TW9kZShvRGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QsIG9EYXRhTW9kZWxPYmplY3RQYXRoKTtcbn07XG5leHBvcnQgY29uc3QgZ2V0RWRpdGFibGVFeHByZXNzaW9uQXNPYmplY3QgPSBmdW5jdGlvbiAoXG5cdG9Qcm9wZXJ0eVBhdGg6IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0b0RhdGFGaWVsZENvbnZlcnRlZDogYW55ID0gbnVsbCxcblx0b0RhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGlzRWRpdGFibGU6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiA9IFVJLklzRWRpdGFibGVcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBnZXRFZGl0YWJsZUV4cHJlc3Npb24oXG5cdFx0b1Byb3BlcnR5UGF0aCxcblx0XHRvRGF0YUZpZWxkQ29udmVydGVkLFxuXHRcdG9EYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdHRydWUsXG5cdFx0aXNFZGl0YWJsZVxuXHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPjtcbn07XG4vKipcbiAqIENyZWF0ZSB0aGUgZXhwcmVzc2lvbiB0byBnZW5lcmF0ZSBhbiBcImVkaXRhYmxlXCIgYm9vbGVhbiB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5UGF0aCBUaGUgaW5wdXQgcHJvcGVydHlcbiAqIEBwYXJhbSBvRGF0YUZpZWxkQ29udmVydGVkIFRoZSBEYXRhRmllbGRDb252ZXJ0ZWQgb2JqZWN0IHRvIHJlYWQgdGhlIGZpZWxkQ29udHJvbCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gb0RhdGFNb2RlbE9iamVjdFBhdGggVGhlIHBhdGggdG8gdGhpcyBwcm9wZXJ0eSBvYmplY3RcbiAqIEBwYXJhbSBiQXNPYmplY3QgV2hldGhlciBvciBub3QgdGhpcyBzaG91bGQgYmUgcmV0dXJuZWQgYXMgYW4gb2JqZWN0IG9yIGEgYmluZGluZyBzdHJpbmdcbiAqIEBwYXJhbSBpc0VkaXRhYmxlIFdoZXRoZXIgb3Igbm90IFVJLklzRWRpdGFibGUgYmUgY29uc2lkZXJlZC5cbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBwcm9wZXJ0eSBpcyBlZGl0YWJsZSBvciBub3RcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEVkaXRhYmxlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRvRGF0YUZpZWxkQ29udmVydGVkOiBhbnkgPSBudWxsLFxuXHRvRGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0YkFzT2JqZWN0OiBib29sZWFuID0gZmFsc2UsXG5cdGlzRWRpdGFibGU6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiA9IFVJLklzRWRpdGFibGVcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHwgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0aWYgKCFvUHJvcGVydHlQYXRoIHx8IHR5cGVvZiBvUHJvcGVydHlQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKGZhbHNlKTtcblx0fVxuXHRsZXQgZGF0YUZpZWxkRWRpdGFibGVFeHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4gPSBjb25zdGFudCh0cnVlKTtcblx0aWYgKG9EYXRhRmllbGRDb252ZXJ0ZWQgIT09IG51bGwpIHtcblx0XHRkYXRhRmllbGRFZGl0YWJsZUV4cHJlc3Npb24gPSBpZkVsc2UoaXNOb25FZGl0YWJsZUV4cHJlc3Npb24ob0RhdGFGaWVsZENvbnZlcnRlZCksIGZhbHNlLCBpc0VkaXRhYmxlKTtcblx0fVxuXG5cdGNvbnN0IG9Qcm9wZXJ0eTogUHJvcGVydHkgPSAoaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHlQYXRoKSAmJiBvUHJvcGVydHlQYXRoLiR0YXJnZXQpIHx8IChvUHJvcGVydHlQYXRoIGFzIFByb3BlcnR5KTtcblx0Y29uc3QgcmVsYXRpdmVQYXRoID0gZ2V0UmVsYXRpdmVQYXRocyhvRGF0YU1vZGVsT2JqZWN0UGF0aCk7XG5cdC8vIEVkaXRhYmlsaXR5IGRlcGVuZHMgb24gdGhlIGZpZWxkIGNvbnRyb2wgZXhwcmVzc2lvblxuXHQvLyBJZiB0aGUgRmllbGQgY29udHJvbCBpcyBzdGF0aWNhbGx5IGluIFJlYWRPbmx5IG9yIEluYXBwbGljYWJsZSAoZGlzYWJsZWQpIC0+IG5vdCBlZGl0YWJsZVxuXHQvLyBJZiB0aGUgcHJvcGVydHkgaXMgYSBrZXkgLT4gbm90IGVkaXRhYmxlIGV4Y2VwdCBpbiBjcmVhdGlvbiBpZiBub3QgY29tcHV0ZWRcblx0Ly8gSWYgdGhlIHByb3BlcnR5IGlzIGNvbXB1dGVkIC0+IG5vdCBlZGl0YWJsZVxuXHQvLyBJZiB0aGUgcHJvcGVydHkgaXMgbm90IHVwZGF0YWJsZSAtPiBub3QgZWRpdGFibGVcblx0Ly8gSWYgdGhlIHByb3BlcnR5IGlzIGltbXV0YWJsZSAtPiBub3QgZWRpdGFibGUgZXhjZXB0IGluIGNyZWF0aW9uXG5cdC8vIElmIHRoZSBGaWVsZCBjb250cm9sIGlzIGEgcGF0aCByZXNvbHZpbmcgdG8gUmVhZE9ubHkgb3IgSW5hcHBsaWNhYmxlIChkaXNhYmxlZCkgKDw9IDEpIC0+IG5vdCBlZGl0YWJsZVxuXHQvLyBFbHNlLCB0byBiZSBlZGl0YWJsZSB5b3UgbmVlZFxuXHQvLyBpbW11dGFibGUgYW5kIGtleSB3aGlsZSBpbiB0aGUgY3JlYXRpb24gcm93XG5cdC8vIHVpL2lzRWRpdGFibGVcblx0Y29uc3QgaXNQYXRoVXBkYXRhYmxlRXhwcmVzc2lvbiA9IGlzUGF0aFVwZGF0YWJsZShvRGF0YU1vZGVsT2JqZWN0UGF0aCwge1xuXHRcdHByb3BlcnR5UGF0aDogb1Byb3BlcnR5UGF0aCxcblx0XHRwYXRoVmlzaXRvcjogKHBhdGg6IHN0cmluZywgbmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSkgPT5cblx0XHRcdHNpbmdsZXRvblBhdGhWaXNpdG9yKHBhdGgsIG9EYXRhTW9kZWxPYmplY3RQYXRoLmNvbnZlcnRlZFR5cGVzLCBuYXZpZ2F0aW9uUGF0aHMpXG5cdH0pO1xuXHRjb25zdCBlZGl0YWJsZUV4cHJlc3Npb24gPSBpZkVsc2UoXG5cdFx0b3IoXG5cdFx0XHRub3QoaXNQYXRoVXBkYXRhYmxlRXhwcmVzc2lvbiksXG5cdFx0XHRpc0NvbXB1dGVkKG9Qcm9wZXJ0eSksXG5cdFx0XHRpc0tleShvUHJvcGVydHkpLFxuXHRcdFx0aXNJbW11dGFibGUob1Byb3BlcnR5KSxcblx0XHRcdGlzTm9uRWRpdGFibGVFeHByZXNzaW9uKG9Qcm9wZXJ0eSwgcmVsYXRpdmVQYXRoKVxuXHRcdCksXG5cdFx0aWZFbHNlKG9yKGlzQ29tcHV0ZWQob1Byb3BlcnR5KSwgaXNOb25FZGl0YWJsZUV4cHJlc3Npb24ob1Byb3BlcnR5LCByZWxhdGl2ZVBhdGgpKSwgZmFsc2UsIFVJLklzVHJhbnNpZW50QmluZGluZyksXG5cdFx0aXNFZGl0YWJsZVxuXHQpO1xuXHRpZiAoYkFzT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGFuZChlZGl0YWJsZUV4cHJlc3Npb24sIGRhdGFGaWVsZEVkaXRhYmxlRXhwcmVzc2lvbik7XG5cdH1cblx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKGFuZChlZGl0YWJsZUV4cHJlc3Npb24sIGRhdGFGaWVsZEVkaXRhYmxlRXhwcmVzc2lvbikpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENvbGxhYm9yYXRpb25FeHByZXNzaW9uID0gZnVuY3Rpb24gKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmb3JtYXR0ZXI6IGFueVxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4ge1xuXHRjb25zdCBvYmplY3RQYXRoID0gZ2V0VGFyZ2V0T2JqZWN0UGF0aChkYXRhTW9kZWxPYmplY3RQYXRoKTtcblx0Y29uc3QgYWN0aXZpdHlFeHByZXNzaW9uID0gcGF0aEluTW9kZWwoYC9jb2xsYWJvcmF0aW9uL2FjdGl2aXRpZXMke29iamVjdFBhdGh9YCwgXCJpbnRlcm5hbFwiKTtcblx0Y29uc3Qga2V5cyA9IGRhdGFNb2RlbE9iamVjdFBhdGg/LnRhcmdldEVudGl0eVR5cGU/LmtleXM7XG5cdGNvbnN0IGtleXNFeHByZXNzaW9uczogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT5bXSA9IFtdO1xuXHRrZXlzPy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRjb25zdCBrZXlFeHByZXNzaW9uID0gcGF0aEluTW9kZWwoa2V5Lm5hbWUpO1xuXHRcdGtleXNFeHByZXNzaW9ucy5wdXNoKGtleUV4cHJlc3Npb24pO1xuXHR9KTtcblx0cmV0dXJuIGZvcm1hdFJlc3VsdChbYWN0aXZpdHlFeHByZXNzaW9uLCAuLi5rZXlzRXhwcmVzc2lvbnNdLCBmb3JtYXR0ZXIpO1xufTtcbmV4cG9ydCBjb25zdCBnZXRFbmFibGVkRXhwcmVzc2lvbkFzT2JqZWN0ID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdG9EYXRhRmllbGRDb252ZXJ0ZWQ/OiBhbnksXG5cdG9EYXRhTW9kZWxPYmplY3RQYXRoPzogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGdldEVuYWJsZWRFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgsIG9EYXRhRmllbGRDb252ZXJ0ZWQsIHRydWUsIG9EYXRhTW9kZWxPYmplY3RQYXRoKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj47XG59O1xuLyoqXG4gKiBDcmVhdGUgdGhlIGV4cHJlc3Npb24gdG8gZ2VuZXJhdGUgYW4gXCJlbmFibGVkXCIgQm9vbGVhbiB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5UGF0aCBUaGUgaW5wdXQgcHJvcGVydHlcbiAqIEBwYXJhbSBvRGF0YUZpZWxkQ29udmVydGVkIFRoZSBEYXRhRmllbGRDb252ZXJ0ZWQgT2JqZWN0IHRvIHJlYWQgdGhlIGZpZWxkQ29udHJvbCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gYkFzT2JqZWN0IFdoZXRoZXIgb3Igbm90IHRoaXMgc2hvdWxkIGJlIHJldHVybmVkIGFzIGFuIG9iamVjdCBvciBhIGJpbmRpbmcgc3RyaW5nXG4gKiBAcGFyYW0gb0RhdGFNb2RlbE9iamVjdFBhdGhcbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gZGV0ZXJtaW5lIGlmIGEgcHJvcGVydHkgaXMgZW5hYmxlZCBvciBub3RcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEVuYWJsZWRFeHByZXNzaW9uID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdG9EYXRhRmllbGRDb252ZXJ0ZWQ/OiBhbnksXG5cdGJBc09iamVjdDogYm9vbGVhbiA9IGZhbHNlLFxuXHRvRGF0YU1vZGVsT2JqZWN0UGF0aD86IERhdGFNb2RlbE9iamVjdFBhdGhcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHwgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0aWYgKCFvUHJvcGVydHlQYXRoIHx8IHR5cGVvZiBvUHJvcGVydHlQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKHRydWUpO1xuXHR9XG5cdGxldCByZWxhdGl2ZVBhdGg7XG5cdGlmIChvRGF0YU1vZGVsT2JqZWN0UGF0aCkge1xuXHRcdHJlbGF0aXZlUGF0aCA9IGdldFJlbGF0aXZlUGF0aHMob0RhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHR9XG5cdGxldCBkYXRhRmllbGRFbmFibGVkRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+ID0gY29uc3RhbnQodHJ1ZSk7XG5cdGlmIChvRGF0YUZpZWxkQ29udmVydGVkICE9PSBudWxsKSB7XG5cdFx0ZGF0YUZpZWxkRW5hYmxlZEV4cHJlc3Npb24gPSBpZkVsc2UoaXNEaXNhYmxlZEV4cHJlc3Npb24ob0RhdGFGaWVsZENvbnZlcnRlZCksIGZhbHNlLCB0cnVlKTtcblx0fVxuXG5cdGNvbnN0IG9Qcm9wZXJ0eTogUHJvcGVydHkgPSAoaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHlQYXRoKSAmJiBvUHJvcGVydHlQYXRoLiR0YXJnZXQpIHx8IChvUHJvcGVydHlQYXRoIGFzIFByb3BlcnR5KTtcblx0Ly8gRW5hYmxlbWVudCBkZXBlbmRzIG9uIHRoZSBmaWVsZCBjb250cm9sIGV4cHJlc3Npb25cblx0Ly8gSWYgdGhlIEZpZWxkIGNvbnRyb2wgaXMgc3RhdGljYWxseSBpbiBJbmFwcGxpY2FibGUgKGRpc2FibGVkKSAtPiBub3QgZW5hYmxlZFxuXHRjb25zdCBlbmFibGVkRXhwcmVzc2lvbiA9IGlmRWxzZShpc0Rpc2FibGVkRXhwcmVzc2lvbihvUHJvcGVydHksIHJlbGF0aXZlUGF0aCksIGZhbHNlLCB0cnVlKTtcblx0aWYgKGJBc09iamVjdCkge1xuXHRcdHJldHVybiBhbmQoZW5hYmxlZEV4cHJlc3Npb24sIGRhdGFGaWVsZEVuYWJsZWRFeHByZXNzaW9uKTtcblx0fVxuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oYW5kKGVuYWJsZWRFeHByZXNzaW9uLCBkYXRhRmllbGRFbmFibGVkRXhwcmVzc2lvbikpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGV4cHJlc3Npb24gdG8gZ2VuZXJhdGUgYW4gXCJlZGl0TW9kZVwiIGVudW0gdmFsdWUuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eVBhdGggVGhlIGlucHV0IHByb3BlcnR5XG4gKiBAcGFyYW0gb0RhdGFNb2RlbE9iamVjdFBhdGggVGhlIGxpc3Qgb2YgZGF0YSBtb2RlbCBvYmplY3RzIHRoYXQgYXJlIGludm9sdmVkIHRvIHJlYWNoIHRoYXQgcHJvcGVydHlcbiAqIEBwYXJhbSBiTWVhc3VyZVJlYWRPbmx5IFdoZXRoZXIgd2Ugc2hvdWxkIHNldCBVb00gLyBjdXJyZW5jeSBmaWVsZCBtb2RlIHRvIHJlYWQgb25seVxuICogQHBhcmFtIGJBc09iamVjdCBXaGV0aGVyIHdlIHNob3VsZCByZXR1cm4gdGhpcyBhcyBhbiBleHByZXNzaW9uIG9yIGFzIGEgc3RyaW5nXG4gKiBAcGFyYW0gb0RhdGFGaWVsZENvbnZlcnRlZCBUaGUgZGF0YUZpZWxkIG9iamVjdFxuICogQHBhcmFtIGlzRWRpdGFibGUgV2hldGhlciBvciBub3QgVUkuSXNFZGl0YWJsZSBiZSBjb25zaWRlcmVkLlxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgcHJvcGVydHkgZWRpdCBtb2RlLCBjb21wbGlhbnQgd2l0aCB0aGUgTURDIEZpZWxkIGRlZmluaXRpb24gb2YgZWRpdE1vZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFZGl0TW9kZSA9IGZ1bmN0aW9uIChcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRvRGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Yk1lYXN1cmVSZWFkT25seTogYm9vbGVhbiA9IGZhbHNlLFxuXHRiQXNPYmplY3Q6IGJvb2xlYW4gPSBmYWxzZSxcblx0b0RhdGFGaWVsZENvbnZlcnRlZDogYW55ID0gbnVsbCxcblx0aXNFZGl0YWJsZTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+ID0gVUkuSXNFZGl0YWJsZVxuKTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfCBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBcIkRpc3BsYXlcIjtcblx0fVxuXHRjb25zdCBvUHJvcGVydHk6IFByb3BlcnR5ID0gKGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCkgJiYgb1Byb3BlcnR5UGF0aC4kdGFyZ2V0KSB8fCAob1Byb3BlcnR5UGF0aCBhcyBQcm9wZXJ0eSk7XG5cdGNvbnN0IHJlbGF0aXZlUGF0aCA9IGdldFJlbGF0aXZlUGF0aHMob0RhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHQvLyBpZiB0aGUgcHJvcGVydHkgaXMgbm90IGVuYWJsZWQgPT4gRGlzYWJsZWRcblx0Ly8gaWYgdGhlIHByb3BlcnR5IGlzIGVuYWJsZWQgJiYgbm90IGVkaXRhYmxlID0+IFJlYWRPbmx5XG5cdC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBlbmFibGVkICYmIGVkaXRhYmxlID0+IEVkaXRhYmxlXG5cdC8vIElmIHRoZXJlIGlzIGFuIGFzc29jaWF0ZWQgdW5pdCwgYW5kIGl0IGhhcyBhIGZpZWxkIGNvbnRyb2wgYWxzbyB1c2UgY29uc2lkZXIgdGhlIGZvbGxvd2luZ1xuXHQvLyBpZiB0aGUgdW5pdCBmaWVsZCBjb250cm9sIGlzIHJlYWRvbmx5IC0+IEVkaXRhYmxlUmVhZE9ubHlcblx0Ly8gb3RoZXJ3aXNlIC0+IEVkaXRhYmxlXG5cdGNvbnN0IGVkaXRhYmxlRXhwcmVzc2lvbiA9IGdldEVkaXRhYmxlRXhwcmVzc2lvbkFzT2JqZWN0KG9Qcm9wZXJ0eVBhdGgsIG9EYXRhRmllbGRDb252ZXJ0ZWQsIG9EYXRhTW9kZWxPYmplY3RQYXRoLCBpc0VkaXRhYmxlKTtcblxuXHRjb25zdCBlbmFibGVkRXhwcmVzc2lvbiA9IGdldEVuYWJsZWRFeHByZXNzaW9uQXNPYmplY3Qob1Byb3BlcnR5UGF0aCwgb0RhdGFGaWVsZENvbnZlcnRlZCwgb0RhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRjb25zdCBhc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eSk7XG5cdGNvbnN0IHVuaXRQcm9wZXJ0eSA9IGFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KTtcblx0bGV0IHJlc3VsdEV4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+ID0gY29uc3RhbnQoXCJFZGl0YWJsZVwiKTtcblx0aWYgKHVuaXRQcm9wZXJ0eSkge1xuXHRcdGNvbnN0IGlzVW5pdFJlYWRPbmx5ID0gaXNSZWFkT25seUV4cHJlc3Npb24odW5pdFByb3BlcnR5LCByZWxhdGl2ZVBhdGgpO1xuXHRcdHJlc3VsdEV4cHJlc3Npb24gPSBpZkVsc2UoXG5cdFx0XHRvcihpc1VuaXRSZWFkT25seSwgaXNDb21wdXRlZCh1bml0UHJvcGVydHkpLCBiTWVhc3VyZVJlYWRPbmx5KSxcblx0XHRcdGlmRWxzZSghaXNDb25zdGFudChpc1VuaXRSZWFkT25seSkgJiYgaXNVbml0UmVhZE9ubHksIFwiRWRpdGFibGVSZWFkT25seVwiLCBcIkVkaXRhYmxlRGlzcGxheVwiKSxcblx0XHRcdFwiRWRpdGFibGVcIlxuXHRcdCk7XG5cdH1cblx0Y29uc3QgcmVhZE9ubHlFeHByZXNzaW9uID0gb3IoaXNSZWFkT25seUV4cHJlc3Npb24ob1Byb3BlcnR5LCByZWxhdGl2ZVBhdGgpLCBpc1JlYWRPbmx5RXhwcmVzc2lvbihvRGF0YUZpZWxkQ29udmVydGVkKSk7XG5cblx0Ly8gaWYgdGhlIHByb3BlcnR5IGlzIGZyb20gYSBub24tdXBkYXRhYmxlIGVudGl0eSA9PiBSZWFkIG9ubHkgbW9kZSwgcHJldmlvdXNseSBjYWxjdWxhdGVkIGVkaXQgTW9kZSBpcyBpZ25vcmVkXG5cdC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBmcm9tIGFuIHVwZGF0YWJsZSBlbnRpdHkgPT4gcHJldmlvdXNseSBjYWxjdWxhdGVkIGVkaXQgTW9kZSBleHByZXNzaW9uXG5cdGNvbnN0IGVkaXRNb2RlRXhwcmVzc2lvbiA9IGlmRWxzZShcblx0XHRlbmFibGVkRXhwcmVzc2lvbixcblx0XHRpZkVsc2UoXG5cdFx0XHRlZGl0YWJsZUV4cHJlc3Npb24sXG5cdFx0XHRyZXN1bHRFeHByZXNzaW9uLFxuXHRcdFx0aWZFbHNlKGFuZCghaXNDb25zdGFudChyZWFkT25seUV4cHJlc3Npb24pICYmIHJlYWRPbmx5RXhwcmVzc2lvbiwgaXNFZGl0YWJsZSksIFwiUmVhZE9ubHlcIiwgXCJEaXNwbGF5XCIpXG5cdFx0KSxcblx0XHRpZkVsc2UoaXNFZGl0YWJsZSwgXCJEaXNhYmxlZFwiLCBcIkRpc3BsYXlcIilcblx0KTtcblx0aWYgKGJBc09iamVjdCkge1xuXHRcdHJldHVybiBlZGl0TW9kZUV4cHJlc3Npb247XG5cdH1cblx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKGVkaXRNb2RlRXhwcmVzc2lvbik7XG59O1xuXG5leHBvcnQgY29uc3QgaGFzVmFsaWRBbmFseXRpY2FsQ3VycmVuY3lPclVuaXQgPSBmdW5jdGlvbiAoXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGhcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHtcblx0Y29uc3Qgb1Byb3BlcnR5RGVmaW5pdGlvbiA9IG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0IGFzIFByb3BlcnR5O1xuXHRjb25zdCBjdXJyZW5jeSA9IG9Qcm9wZXJ0eURlZmluaXRpb24uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeTtcblx0Y29uc3QgbWVhc3VyZSA9IGN1cnJlbmN5ID8gY3VycmVuY3kgOiBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0aWYgKG1lYXN1cmUpIHtcblx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24ob3IoaXNUcnV0aHkoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKG1lYXN1cmUpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+KSwgbm90KFVJLklzVG90YWwpKSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKGNvbnN0YW50KHRydWUpKTtcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGlmVW5pdEVkaXRhYmxlID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdHNFZGl0YWJsZVZhbHVlOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiB8IHN0cmluZyxcblx0c05vbkVkaXRhYmxlVmFsdWU6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+IHwgc3RyaW5nXG4pOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB7XG5cdGNvbnN0IG9Qcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHRjb25zdCB1bml0UHJvcGVydHkgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShvUHJvcGVydHkpIHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KTtcblx0aWYgKCF1bml0UHJvcGVydHkpIHtcblx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oc05vbkVkaXRhYmxlVmFsdWUpO1xuXHR9XG5cdGNvbnN0IGlzVW5pdFJlYWRPbmx5ID0gaXNSZWFkT25seUV4cHJlc3Npb24odW5pdFByb3BlcnR5KTtcblx0Y29uc3QgZWRpdGFibGVFeHByZXNzaW9uID0gYW5kKG9yKCFpc0NvbnN0YW50KGlzVW5pdFJlYWRPbmx5KSwgbm90KGlzVW5pdFJlYWRPbmx5KSksIG5vdChpc0NvbXB1dGVkKHVuaXRQcm9wZXJ0eSkpKTtcblx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKGlmRWxzZShlZGl0YWJsZUV4cHJlc3Npb24sIHNFZGl0YWJsZVZhbHVlLCBzTm9uRWRpdGFibGVWYWx1ZSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpZWxkRGlzcGxheSA9IGZ1bmN0aW9uIChcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRzVGFyZ2V0RGlzcGxheU1vZGU6IHN0cmluZyxcblx0b0NvbXB1dGVkRWRpdE1vZGU6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+XG4pOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB7XG5cdGNvbnN0IG9Qcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXG5cdHJldHVybiBoYXNWYWx1ZUhlbHAob1Byb3BlcnR5KVxuXHRcdD8gY29tcGlsZUV4cHJlc3Npb24oc1RhcmdldERpc3BsYXlNb2RlKVxuXHRcdDogY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKGVxdWFsKG9Db21wdXRlZEVkaXRNb2RlLCBcIkVkaXRhYmxlXCIpLCBcIlZhbHVlXCIsIHNUYXJnZXREaXNwbGF5TW9kZSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoXG5cdG9Qcm9wZXJ0eTogUHJvcGVydHksXG5cdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+LFxuXHRpZ25vcmVDb25zdHJhaW50cyA9IGZhbHNlXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdGNvbnN0IG91dEV4cHJlc3Npb246IFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxhbnk+ID0gcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiBhcyBQYXRoSW5Nb2RlbEV4cHJlc3Npb248YW55Pjtcblx0aWYgKG9Qcm9wZXJ0eS5fdHlwZSA9PT0gXCJQcm9wZXJ0eVwiKSB7XG5cdFx0Y29uc3Qgb1RhcmdldE1hcHBpbmcgPSBFRE1fVFlQRV9NQVBQSU5HW29Qcm9wZXJ0eS50eXBlXTtcblx0XHRpZiAob1RhcmdldE1hcHBpbmcpIHtcblx0XHRcdG91dEV4cHJlc3Npb24udHlwZSA9IG9UYXJnZXRNYXBwaW5nLnR5cGU7XG5cdFx0XHRpZiAob1RhcmdldE1hcHBpbmcuY29uc3RyYWludHMgJiYgIWlnbm9yZUNvbnN0cmFpbnRzKSB7XG5cdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMgPSB7fTtcblx0XHRcdFx0aWYgKG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzLiRTY2FsZSAmJiBvUHJvcGVydHkuc2NhbGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMuc2NhbGUgPSBvUHJvcGVydHkuc2NhbGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzLiRQcmVjaXNpb24gJiYgb1Byb3BlcnR5LnByZWNpc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cy5wcmVjaXNpb24gPSBvUHJvcGVydHkucHJlY2lzaW9uO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cy4kTWF4TGVuZ3RoICYmIG9Qcm9wZXJ0eS5tYXhMZW5ndGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMubWF4TGVuZ3RoID0gb1Byb3BlcnR5Lm1heExlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob1Byb3BlcnR5Lm51bGxhYmxlID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMubnVsbGFibGUgPSBvUHJvcGVydHkubnVsbGFibGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0XHRvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlZhbGlkYXRpb24/Lk1pbmltdW0gIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRcdCFpc05hTihvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NaW5pbXVtKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLm1pbmltdW0gPSBgJHtvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NaW5pbXVtfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0XHRvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlZhbGlkYXRpb24/Lk1heGltdW0gIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRcdCFpc05hTihvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NYXhpbXVtKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLm1heGltdW0gPSBgJHtvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NYXhpbXVtfWA7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAob1Byb3BlcnR5Lm51bGxhYmxlID09PSBmYWxzZSkge1xuXHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzID0ge307XG5cdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMubnVsbGFibGUgPSBvUHJvcGVydHkubnVsbGFibGU7XG5cdFx0XHR9XG5cdFx0XHRpZiAob3V0RXhwcmVzc2lvbj8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludFwiKSA9PT0gMCkge1xuXHRcdFx0XHRpZiAoIW91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucykge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zLCB7XG5cdFx0XHRcdFx0cGFyc2VBc1N0cmluZzogZmFsc2UsXG5cdFx0XHRcdFx0ZW1wdHlTdHJpbmc6IFwiXCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob3V0RXhwcmVzc2lvbi50eXBlID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmluZ1wiKSB7XG5cdFx0XHRcdGlmICghb3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0ge307XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zLnBhcnNlS2VlcHNFbXB0eVN0cmluZyA9IHRydWU7XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy5bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGlnaXRTZXF1ZW5jZVwiXSAmJlxuXHRcdFx0XHRcdG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc0RpZ2l0U2VxdWVuY2Vcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cy5pc0RpZ2l0U2VxdWVuY2UgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAob3V0RXhwcmVzc2lvbj8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRvdWJsZVwiKSA9PT0gMCkge1xuXHRcdFx0XHRpZiAoIW91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucykge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dEV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zLCB7XG5cdFx0XHRcdFx0cGFyc2VBc1N0cmluZzogZmFsc2UsXG5cdFx0XHRcdFx0ZW1wdHlTdHJpbmc6IFwiXCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob3V0RXhwcmVzc2lvbj8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRhdGVUaW1lT2Zmc2V0XCIpID09PSAwKSB7XG5cdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMuVjQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gb3V0RXhwcmVzc2lvbjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUeXBlQ29uZmlnID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogUHJvcGVydHkgfCBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBkYXRhVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYW55IHtcblx0Y29uc3Qgb1RhcmdldE1hcHBpbmcgPSBFRE1fVFlQRV9NQVBQSU5HWyhvUHJvcGVydHkgYXMgUHJvcGVydHkpPy50eXBlXSB8fCAoZGF0YVR5cGUgPyBFRE1fVFlQRV9NQVBQSU5HW2RhdGFUeXBlXSA6IHVuZGVmaW5lZCk7XG5cdGNvbnN0IHByb3BlcnR5VHlwZUNvbmZpZzogY29uZmlnVHlwZSA9IHtcblx0XHR0eXBlOiBvVGFyZ2V0TWFwcGluZy50eXBlLFxuXHRcdGNvbnN0cmFpbnRzOiB7fSxcblx0XHRmb3JtYXRPcHRpb25zOiB7fVxuXHR9O1xuXHRpZiAoaXNQcm9wZXJ0eShvUHJvcGVydHkpKSB7XG5cdFx0cHJvcGVydHlUeXBlQ29uZmlnLmNvbnN0cmFpbnRzID0ge1xuXHRcdFx0c2NhbGU6IG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy4kU2NhbGUgPyBvUHJvcGVydHkuc2NhbGUgOiB1bmRlZmluZWQsXG5cdFx0XHRwcmVjaXNpb246IG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy4kUHJlY2lzaW9uID8gb1Byb3BlcnR5LnByZWNpc2lvbiA6IHVuZGVmaW5lZCxcblx0XHRcdG1heExlbmd0aDogb1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LiRNYXhMZW5ndGggPyBvUHJvcGVydHkubWF4TGVuZ3RoIDogdW5kZWZpbmVkLFxuXHRcdFx0bnVsbGFibGU6IG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy4kTnVsbGFibGUgPyBvUHJvcGVydHkubnVsbGFibGUgOiB1bmRlZmluZWQsXG5cdFx0XHRtaW5pbXVtOlxuXHRcdFx0XHRvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cz8uW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0IWlzTmFOKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWluaW11bSlcblx0XHRcdFx0XHQ/IGAke29Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWluaW11bX1gXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0XHRtYXhpbXVtOlxuXHRcdFx0XHRvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cz8uW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0IWlzTmFOKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWF4aW11bSlcblx0XHRcdFx0XHQ/IGAke29Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWF4aW11bX1gXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0XHRpc0RpZ2l0U2VxdWVuY2U6XG5cdFx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZy50eXBlID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmluZ1wiICYmXG5cdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy5bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGlnaXRTZXF1ZW5jZVwiXSAmJlxuXHRcdFx0XHRvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uSXNEaWdpdFNlcXVlbmNlXG5cdFx0XHRcdFx0PyB0cnVlXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0XHRWNDogb1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LiRWNCA/IHRydWUgOiB1bmRlZmluZWRcblx0XHR9O1xuXHR9XG5cdHByb3BlcnR5VHlwZUNvbmZpZy5mb3JtYXRPcHRpb25zID0ge1xuXHRcdHBhcnNlQXNTdHJpbmc6XG5cdFx0XHRwcm9wZXJ0eVR5cGVDb25maWc/LnR5cGU/LmluZGV4T2YoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5JbnRcIikgPT09IDAgfHxcblx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZz8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRvdWJsZVwiKSA9PT0gMFxuXHRcdFx0XHQ/IGZhbHNlXG5cdFx0XHRcdDogdW5kZWZpbmVkLFxuXHRcdGVtcHR5U3RyaW5nOlxuXHRcdFx0cHJvcGVydHlUeXBlQ29uZmlnPy50eXBlPy5pbmRleE9mKFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50XCIpID09PSAwIHx8XG5cdFx0XHRwcm9wZXJ0eVR5cGVDb25maWc/LnR5cGU/LmluZGV4T2YoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5Eb3VibGVcIikgPT09IDBcblx0XHRcdFx0PyBcIlwiXG5cdFx0XHRcdDogdW5kZWZpbmVkLFxuXHRcdHBhcnNlS2VlcHNFbXB0eVN0cmluZzogcHJvcGVydHlUeXBlQ29uZmlnLnR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCIgPyB0cnVlIDogdW5kZWZpbmVkXG5cdH07XG5cdHJldHVybiBwcm9wZXJ0eVR5cGVDb25maWc7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeSA9IGZ1bmN0aW9uIChcblx0b1Byb3BlcnR5RGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4sXG5cdGlnbm9yZVVuaXRDb25zdHJhaW50PzogYm9vbGVhbixcblx0Zm9ybWF0T3B0aW9ucz86IGFueVxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBvUHJvcGVydHlEZWZpbml0aW9uID0gb1Byb3BlcnR5RGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHk7XG5cdGxldCB1bml0ID0gb1Byb3BlcnR5RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LlVuaXQ7XG5cdGNvbnN0IHJlbGF0aXZlTG9jYXRpb24gPSBnZXRSZWxhdGl2ZVBhdGhzKG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgpO1xuXHRwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uID0gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihvUHJvcGVydHlEZWZpbml0aW9uLCBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uKTtcblx0aWYgKHVuaXQ/LnRvU3RyaW5nKCkgPT09IFwiJVwiKSB7XG5cdFx0cmV0dXJuIGZvcm1hdFJlc3VsdChbcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbl0sIHZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoUGVyY2VudGFnZSk7XG5cdH1cblx0Y29uc3QgY29tcGxleFR5cGUgPSB1bml0ID8gXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5Vbml0XCIgOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkN1cnJlbmN5XCI7XG5cdHVuaXQgPSB1bml0ID8gdW5pdCA6IChvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgYXMgYW55KTtcblx0Y29uc3QgdW5pdEJpbmRpbmdFeHByZXNzaW9uID0gKHVuaXQgYXMgYW55KS4kdGFyZ2V0XG5cdFx0PyBmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uKFxuXHRcdFx0XHQodW5pdCBhcyBhbnkpLiR0YXJnZXQsXG5cdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbih1bml0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPixcblx0XHRcdFx0aWdub3JlVW5pdENvbnN0cmFpbnRcblx0XHQgIClcblx0XHQ6IChnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24odW5pdCwgcmVsYXRpdmVMb2NhdGlvbikgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4pO1xuXG5cdHJldHVybiBhZGRUeXBlSW5mb3JtYXRpb24oW3Byb3BlcnR5QmluZGluZ0V4cHJlc3Npb24sIHVuaXRCaW5kaW5nRXhwcmVzc2lvbl0sIGNvbXBsZXhUeXBlLCB1bmRlZmluZWQsIGZvcm1hdE9wdGlvbnMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEJpbmRpbmdGb3JVbml0T3JDdXJyZW5jeSA9IGZ1bmN0aW9uIChcblx0b1Byb3BlcnR5RGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4gfCBzdHJpbmcge1xuXHRjb25zdCBvUHJvcGVydHlEZWZpbml0aW9uID0gb1Byb3BlcnR5RGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHk7XG5cblx0bGV0IHVuaXQgPSBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0aWYgKHVuaXQ/LnRvU3RyaW5nKCkgPT09IFwiJVwiKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KFwiJVwiKTtcblx0fVxuXHRjb25zdCByZWxhdGl2ZUxvY2F0aW9uID0gZ2V0UmVsYXRpdmVQYXRocyhvUHJvcGVydHlEYXRhTW9kZWxQYXRoKTtcblxuXHRjb25zdCBjb21wbGV4VHlwZSA9IHVuaXQgPyBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlVuaXRcIiA6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQ3VycmVuY3lcIjtcblx0dW5pdCA9IHVuaXQgPyB1bml0IDogKG9Qcm9wZXJ0eURlZmluaXRpb24uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSBhcyBhbnkpO1xuXHRjb25zdCB1bml0QmluZGluZ0V4cHJlc3Npb24gPSAodW5pdCBhcyBhbnkpLiR0YXJnZXRcblx0XHQ/IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24oXG5cdFx0XHRcdCh1bml0IGFzIGFueSkuJHRhcmdldCxcblx0XHRcdFx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHVuaXQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+XG5cdFx0ICApXG5cdFx0OiAoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHVuaXQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+KTtcblxuXHRsZXQgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiA9IHBhdGhJbk1vZGVsKFxuXHRcdGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsUGF0aClcblx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPjtcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiA9IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24ob1Byb3BlcnR5RGVmaW5pdGlvbiwgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiwgdHJ1ZSk7XG5cdHJldHVybiBhZGRUeXBlSW5mb3JtYXRpb24oW3Byb3BlcnR5QmluZGluZ0V4cHJlc3Npb24sIHVuaXRCaW5kaW5nRXhwcmVzc2lvbl0sIGNvbXBsZXhUeXBlLCB1bmRlZmluZWQsIHtcblx0XHRwYXJzZUtlZXBzRW1wdHlTdHJpbmc6IHRydWUsXG5cdFx0ZW1wdHlTdHJpbmc6IFwiXCIsXG5cdFx0c2hvd051bWJlcjogZmFsc2Vcblx0fSk7XG59O1xuZXhwb3J0IGNvbnN0IGdldEJpbmRpbmdXaXRoVGltZXpvbmUgPSBmdW5jdGlvbiAoXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+LFxuXHRpZ25vcmVVbml0Q29uc3RyYWludCA9IGZhbHNlLFxuXHRoaWRlVGltZXpvbmVGb3JFbXB0eVZhbHVlcyA9IGZhbHNlXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdGNvbnN0IG9Qcm9wZXJ0eURlZmluaXRpb24gPSBvUHJvcGVydHlEYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdCBhcyBQcm9wZXJ0eTtcblx0Y29uc3QgdGltZXpvbmUgPSBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5Db21tb24/LlRpbWV6b25lO1xuXHRjb25zdCByZWxhdGl2ZUxvY2F0aW9uID0gZ2V0UmVsYXRpdmVQYXRocyhvUHJvcGVydHlEYXRhTW9kZWxQYXRoKTtcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiA9IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24ob1Byb3BlcnR5RGVmaW5pdGlvbiwgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbik7XG5cblx0Y29uc3QgY29tcGxleFR5cGUgPSBcInNhcC5mZS5jb3JlLnR5cGUuRGF0ZVRpbWVXaXRoVGltZXpvbmVcIjtcblx0Y29uc3QgdW5pdEJpbmRpbmdFeHByZXNzaW9uID0gKHRpbWV6b25lIGFzIGFueSkuJHRhcmdldFxuXHRcdD8gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihcblx0XHRcdFx0KHRpbWV6b25lIGFzIGFueSkuJHRhcmdldCxcblx0XHRcdFx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHRpbWV6b25lLCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPixcblx0XHRcdFx0aWdub3JlVW5pdENvbnN0cmFpbnRcblx0XHQgIClcblx0XHQ6IChnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24odGltZXpvbmUsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+KTtcblx0bGV0IGZvcm1hdE9wdGlvbnM7XG5cdGlmIChoaWRlVGltZXpvbmVGb3JFbXB0eVZhbHVlcykge1xuXHRcdGZvcm1hdE9wdGlvbnMgPSB7XG5cdFx0XHRzaG93VGltZXpvbmVGb3JFbXB0eVZhbHVlczogZmFsc2Vcblx0XHR9O1xuXHR9XG5cdHJldHVybiBhZGRUeXBlSW5mb3JtYXRpb24oW3Byb3BlcnR5QmluZGluZ0V4cHJlc3Npb24sIHVuaXRCaW5kaW5nRXhwcmVzc2lvbl0sIGNvbXBsZXhUeXBlLCB1bmRlZmluZWQsIGZvcm1hdE9wdGlvbnMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEFsaWdubWVudEV4cHJlc3Npb24gPSBmdW5jdGlvbiAoXG5cdG9Db21wdXRlZEVkaXRNb2RlOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPixcblx0c0FsaWduRGlzcGxheTogc3RyaW5nID0gXCJCZWdpblwiLFxuXHRzQWxpZ25FZGl0OiBzdHJpbmcgPSBcIkJlZ2luXCJcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHwgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKGVxdWFsKG9Db21wdXRlZEVkaXRNb2RlLCBcIkRpc3BsYXlcIiksIHNBbGlnbkRpc3BsYXksIHNBbGlnbkVkaXQpKTtcbn07XG5cbi8qKlxuICogRm9ybWF0dGVyIGhlbHBlciB0byByZXRyaWV2ZSB0aGUgY29udmVydGVyQ29udGV4dCBmcm9tIHRoZSBtZXRhbW9kZWwgY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gb0NvbnRleHQgVGhlIG9yaWdpbmFsIG1ldGFtb2RlbCBjb250ZXh0XG4gKiBAcGFyYW0gb0ludGVyZmFjZSBUaGUgY3VycmVudCB0ZW1wbGF0aW5nIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBDb252ZXJ0ZXJDb250ZXh0IHJlcHJlc2VudGluZyB0aGF0IG9iamVjdFxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29udmVydGVyQ29udGV4dCA9IGZ1bmN0aW9uIChvQ29udGV4dDogTWV0YU1vZGVsQ29udGV4dCwgb0ludGVyZmFjZTogQ29tcHV0ZWRBbm5vdGF0aW9uSW50ZXJmYWNlKTogb2JqZWN0IHwgbnVsbCB7XG5cdGlmIChvSW50ZXJmYWNlICYmIG9JbnRlcmZhY2UuY29udGV4dCkge1xuXHRcdHJldHVybiBjb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvSW50ZXJmYWNlLmNvbnRleHQpO1xuXHR9XG5cdHJldHVybiBudWxsO1xufTtcbmdldENvbnZlcnRlckNvbnRleHQucmVxdWlyZXNJQ29udGV4dCA9IHRydWU7XG5cbi8qKlxuICogRm9ybWF0dGVyIGhlbHBlciB0byByZXRyaWV2ZSB0aGUgZGF0YSBtb2RlbCBvYmplY3RzIHRoYXQgYXJlIGludm9sdmVkIGZyb20gdGhlIG1ldGFtb2RlbCBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSBvQ29udGV4dCBUaGUgb3JpZ2luYWwgT0RhdGFNZXRhTW9kZWwgY29udGV4dFxuICogQHBhcmFtIG9JbnRlcmZhY2UgVGhlIGN1cnJlbnQgdGVtcGxhdGluZyBjb250ZXh0XG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBlbnRpdHlzZXRzIGFuZCBuYXZwcm9wZXJ0aWVzIHRoYXQgYXJlIGludm9sdmVkIHRvIGdldCB0byBhIHNwZWNpZmljIG9iamVjdCBpbiB0aGUgbWV0YW1vZGVsXG4gKi9cbmV4cG9ydCBjb25zdCBnZXREYXRhTW9kZWxPYmplY3RQYXRoID0gZnVuY3Rpb24gKFxuXHRvQ29udGV4dDogTWV0YU1vZGVsQ29udGV4dCxcblx0b0ludGVyZmFjZTogQ29tcHV0ZWRBbm5vdGF0aW9uSW50ZXJmYWNlXG4pOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgbnVsbCB7XG5cdGlmIChvSW50ZXJmYWNlICYmIG9JbnRlcmZhY2UuY29udGV4dCkge1xuXHRcdHJldHVybiBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob0ludGVyZmFjZS5jb250ZXh0KTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn07XG5nZXREYXRhTW9kZWxPYmplY3RQYXRoLnJlcXVpcmVzSUNvbnRleHQgPSB0cnVlO1xuXG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uRmllbGQgPSBmdW5jdGlvbiAob0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBib29sZWFuIHtcblx0aWYgKG9EYXRhTW9kZWxQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzPy5sZW5ndGgpIHtcblx0XHRjb25zdCBoYXNPbmVUb01hbnlOYXZpZ2F0aW9uID1cblx0XHRcdG9EYXRhTW9kZWxQYXRoPy5uYXZpZ2F0aW9uUHJvcGVydGllcy5maW5kSW5kZXgoKG9OYXY6IE5hdmlnYXRpb25Qcm9wZXJ0eSkgPT4ge1xuXHRcdFx0XHRpZiAob05hdi5pc0NvbGxlY3Rpb24pIHtcblx0XHRcdFx0XHRpZiAob0RhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uPy5uYXZpZ2F0aW9uUHJvcGVydGllcz8ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHQvL3dlIGNoZWNrIHRoZSBvbmUgdG8gbWFueSBuYXYgaXMgbm90IGFscmVhZHkgcGFydCBvZiB0aGUgY29udGV4dFxuXHRcdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFx0b0RhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uPy5uYXZpZ2F0aW9uUHJvcGVydGllcy5maW5kSW5kZXgoXG5cdFx0XHRcdFx0XHRcdFx0KG9Db250ZXh0TmF2OiBOYXZpZ2F0aW9uUHJvcGVydHkpID0+IG9Db250ZXh0TmF2Lm5hbWUgPT09IG9OYXYubmFtZVxuXHRcdFx0XHRcdFx0XHQpID09PSAtMVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSkgPiAtMTtcblx0XHRpZiAoaGFzT25lVG9NYW55TmF2aWdhdGlvbikge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG5leHBvcnQgY29uc3QgZ2V0UmVxdWlyZWRFeHByZXNzaW9uQXNPYmplY3QgPSBmdW5jdGlvbiAoXG5cdG9Qcm9wZXJ0eVBhdGg6IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0b0RhdGFGaWVsZENvbnZlcnRlZD86IGFueSxcblx0Zm9yY2VFZGl0TW9kZTogYm9vbGVhbiA9IGZhbHNlXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gZ2V0UmVxdWlyZWRFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgsIG9EYXRhRmllbGRDb252ZXJ0ZWQsIGZvcmNlRWRpdE1vZGUsIHRydWUpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPjtcbn07XG5leHBvcnQgY29uc3QgZ2V0UmVxdWlyZWRFeHByZXNzaW9uID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdG9EYXRhRmllbGRDb252ZXJ0ZWQ/OiBhbnksXG5cdGZvcmNlRWRpdE1vZGU6IGJvb2xlYW4gPSBmYWxzZSxcblx0YkFzT2JqZWN0OiBib29sZWFuID0gZmFsc2UsXG5cdG9SZXF1aXJlZFByb3BlcnRpZXM6IGFueSA9IHt9LFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoPzogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfCBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRsZXQgcmV0dXJuRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRjb25zdCBhUmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyA9IG9SZXF1aXJlZFByb3BlcnRpZXMucmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyB8fCBbXTtcblx0Y29uc3QgYVJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMgPSBvUmVxdWlyZWRQcm9wZXJ0aWVzLnJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMgfHwgW107XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybkV4cHJlc3Npb24gPSBjb25zdGFudChmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0bGV0IHJlbGF0aXZlUGF0aDtcblx0XHRpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aCkge1xuXHRcdFx0cmVsYXRpdmVQYXRoID0gZ2V0UmVsYXRpdmVQYXRocyhkYXRhTW9kZWxPYmplY3RQYXRoKTtcblx0XHR9XG5cdFx0bGV0IGRhdGFGaWVsZFJlcXVpcmVkRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+ID0gY29uc3RhbnQodHJ1ZSk7XG5cdFx0aWYgKG9EYXRhRmllbGRDb252ZXJ0ZWQgIT09IG51bGwpIHtcblx0XHRcdGRhdGFGaWVsZFJlcXVpcmVkRXhwcmVzc2lvbiA9IGlzUmVxdWlyZWRFeHByZXNzaW9uKG9EYXRhRmllbGRDb252ZXJ0ZWQpO1xuXHRcdH1cblx0XHRsZXQgcmVxdWlyZWRQcm9wZXJ0eUZyb21JbnNlcnRSZXN0cmljdGlvbnNFeHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4gPSBjb25zdGFudChmYWxzZSk7XG5cdFx0bGV0IHJlcXVpcmVkUHJvcGVydHlGcm9tVXBkYXRlUmVzdHJpY3Rpb25zRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+ID0gY29uc3RhbnQoZmFsc2UpO1xuXG5cdFx0Y29uc3Qgb1Byb3BlcnR5OiBQcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHRcdC8vIEVuYWJsZW1lbnQgZGVwZW5kcyBvbiB0aGUgZmllbGQgY29udHJvbCBleHByZXNzaW9uXG5cdFx0Ly8gSWYgdGhlIEZpZWxkIGNvbnRyb2wgaXMgc3RhdGljYWxseSBpbiBJbmFwcGxpY2FibGUgKGRpc2FibGVkKSAtPiBub3QgZW5hYmxlZFxuXHRcdGNvbnN0IHJlcXVpcmVkRXhwcmVzc2lvbiA9IGlzUmVxdWlyZWRFeHByZXNzaW9uKG9Qcm9wZXJ0eSwgcmVsYXRpdmVQYXRoKTtcblx0XHRjb25zdCBlZGl0TW9kZSA9IGZvcmNlRWRpdE1vZGUgfHwgVUkuSXNFZGl0YWJsZTtcblx0XHRpZiAoXG5cdFx0XHRhUmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucy5sZW5ndGggJiZcblx0XHRcdGFSZXF1aXJlZFByb3BlcnRpZXNGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zLmluY2x1ZGVzKChvUHJvcGVydHlQYXRoIGFzIGFueSkubmFtZSlcblx0XHQpIHtcblx0XHRcdHJlcXVpcmVkUHJvcGVydHlGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zRXhwcmVzc2lvbiA9IGFuZChjb25zdGFudCh0cnVlKSwgVUkuSXNDcmVhdGVNb2RlKTtcblx0XHR9XG5cdFx0aWYgKFxuXHRcdFx0YVJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMubGVuZ3RoICYmXG5cdFx0XHRhUmVxdWlyZWRQcm9wZXJ0aWVzRnJvbVVwZGF0ZVJlc3RyaWN0aW9ucy5pbmNsdWRlcygob1Byb3BlcnR5UGF0aCBhcyBhbnkpLm5hbWUpXG5cdFx0KSB7XG5cdFx0XHRyZXF1aXJlZFByb3BlcnR5RnJvbVVwZGF0ZVJlc3RyaWN0aW9uc0V4cHJlc3Npb24gPSBhbmQoY29uc3RhbnQodHJ1ZSksIG5vdEVxdWFsKFVJLklzQ3JlYXRlTW9kZSwgdHJ1ZSkpO1xuXHRcdH1cblx0XHRyZXR1cm5FeHByZXNzaW9uID0gb3IoXG5cdFx0XHRhbmQob3IocmVxdWlyZWRFeHByZXNzaW9uLCBkYXRhRmllbGRSZXF1aXJlZEV4cHJlc3Npb24pLCBlZGl0TW9kZSksXG5cdFx0XHRyZXF1aXJlZFByb3BlcnR5RnJvbUluc2VydFJlc3RyaWN0aW9uc0V4cHJlc3Npb24sXG5cdFx0XHRyZXF1aXJlZFByb3BlcnR5RnJvbVVwZGF0ZVJlc3RyaWN0aW9uc0V4cHJlc3Npb25cblx0XHQpO1xuXHR9XG5cblx0aWYgKGJBc09iamVjdCkge1xuXHRcdHJldHVybiByZXR1cm5FeHByZXNzaW9uO1xuXHR9XG5cdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihyZXR1cm5FeHByZXNzaW9uKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSZXF1aXJlZEV4cHJlc3Npb25Gb3JDb25uZWN0ZWREYXRhRmllbGQgPSBmdW5jdGlvbiAoXG5cdGRhdGFGaWVsZE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGhcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHtcblx0Y29uc3QgZGF0YSA9IGRhdGFGaWVsZE9iamVjdFBhdGg/LnRhcmdldE9iamVjdD8uJHRhcmdldD8uRGF0YTtcblx0Y29uc3Qga2V5czogQXJyYXk8c3RyaW5nPiA9IE9iamVjdC5rZXlzKGRhdGEpO1xuXHRjb25zdCBkYXRhRmllbGRzID0gW107XG5cdGxldCBwcm9wZXJ0eVBhdGg7XG5cdGNvbnN0IGlzUmVxdWlyZWRFeHByZXNzaW9uczogKENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHwgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+KVtdIHwgdW5kZWZpbmVkID0gW107XG5cdGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcblx0XHRpZiAoZGF0YVtrZXldW1wiJFR5cGVcIl0gJiYgZGF0YVtrZXldW1wiJFR5cGVcIl0uaW5kZXhPZihcIkRhdGFGaWVsZFwiKSA+IC0xKSB7XG5cdFx0XHRkYXRhRmllbGRzLnB1c2goZGF0YVtrZXldKTtcblx0XHR9XG5cdH1cblx0Zm9yIChjb25zdCBkYXRhRmllbGQgb2YgZGF0YUZpZWxkcykge1xuXHRcdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uOlxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGFGaWVsZC5WYWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdHByb3BlcnR5UGF0aCA9IGRhdGFGaWVsZC5WYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0KSB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0ZGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQgfHxcblx0XHRcdFx0XHRcdGRhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQuVmFsdWUgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlQYXRoID0gZGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0LlZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZGF0YUZpZWxkLlRhcmdldCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0XHRwcm9wZXJ0eVBhdGggPSBkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHQvLyBubyBkZWZhdWx0XG5cdFx0fVxuXHRcdGlzUmVxdWlyZWRFeHByZXNzaW9ucy5wdXNoKGdldFJlcXVpcmVkRXhwcmVzc2lvbkFzT2JqZWN0KHByb3BlcnR5UGF0aCwgZGF0YUZpZWxkLCBmYWxzZSkpO1xuXHR9XG5cdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihvciguLi4oaXNSZXF1aXJlZEV4cHJlc3Npb25zIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPltd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