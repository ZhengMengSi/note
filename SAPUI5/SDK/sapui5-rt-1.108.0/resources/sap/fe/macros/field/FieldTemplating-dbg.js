/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/templating/CommonFormatters", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/FieldControlHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/templating/UIFormatters", "sap/ui/model/json/JSONModel"], function (BindingHelper, BindingToolkit, CommonFormatters, DataModelPathHelper, FieldControlHelper, PropertyHelper, UIFormatters, JSONModel) {
  "use strict";

  var _exports = {};
  var isReadOnlyExpression = FieldControlHelper.isReadOnlyExpression;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var transformRecursively = BindingToolkit.transformRecursively;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var not = BindingToolkit.not;
  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var isComplexTypeExpression = BindingToolkit.isComplexTypeExpression;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  var UI = BindingHelper.UI;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Recursively add the text arrangement to a binding expression.
   *
   * @param bindingExpressionToEnhance The binding expression to be enhanced
   * @param fullContextPath The current context path we're on (to properly resolve the text arrangement properties)
   * @returns An updated expression containing the text arrangement binding.
   */
  var addTextArrangementToBindingExpression = function (bindingExpressionToEnhance, fullContextPath) {
    return transformRecursively(bindingExpressionToEnhance, "PathInModel", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = CommonFormatters.getBindingWithTextArrangement(oPropertyDataModelPath, expression);
      }

      return outExpression;
    });
  };

  _exports.addTextArrangementToBindingExpression = addTextArrangementToBindingExpression;

  var formatValueRecursively = function (bindingExpressionToEnhance, fullContextPath) {
    return transformRecursively(bindingExpressionToEnhance, "PathInModel", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = UIFormatters.formatWithTypeInformation(oPropertyDataModelPath.targetObject, expression);
      }

      return outExpression;
    });
  };

  _exports.formatValueRecursively = formatValueRecursively;

  var getTextBindingExpression = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    return getTextBinding(oPropertyDataModelObjectPath, fieldFormatOptions, true);
  };

  _exports.getTextBindingExpression = getTextBindingExpression;

  var getTextBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var _oPropertyDataModelOb, _oPropertyDataModelOb2, _oPropertyDataModelOb3, _oPropertyDataModelOb4, _oPropertyDataModelOb5, _oPropertyDataModelOb6, _oPropertyDataModelOb7, _oPropertyDataModelOb8, _oPropertyDataModelOb9, _oPropertyDataModelOb10, _oPropertyDataModelOb11, _oPropertyDataModelOb12, _oPropertyDataModelOb13, _oPropertyDataModelOb14, _oPropertyDataModelOb15;

    var asObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (((_oPropertyDataModelOb = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb === void 0 ? void 0 : _oPropertyDataModelOb.$Type) === "com.sap.vocabularies.UI.v1.DataField" || ((_oPropertyDataModelOb2 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb2 === void 0 ? void 0 : _oPropertyDataModelOb2.$Type) === "com.sap.vocabularies.UI.v1.DataPointType" || ((_oPropertyDataModelOb3 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb3 === void 0 ? void 0 : _oPropertyDataModelOb3.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" || ((_oPropertyDataModelOb4 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb4 === void 0 ? void 0 : _oPropertyDataModelOb4.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" || ((_oPropertyDataModelOb5 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb5 === void 0 ? void 0 : _oPropertyDataModelOb5.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" || ((_oPropertyDataModelOb6 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb6 === void 0 ? void 0 : _oPropertyDataModelOb6.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithAction") {
      // If there is no resolved property, the value is returned as a constant
      var fieldValue = oPropertyDataModelObjectPath.targetObject.Value || "";
      return compileExpression(constant(fieldValue));
    }

    if (PropertyHelper.isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
      oPropertyDataModelObjectPath = enhanceDataModelPath(oPropertyDataModelObjectPath, oPropertyDataModelObjectPath.targetObject.path);
    }

    var oBindingExpression = pathInModel(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
    var oTargetBinding;

    if ((_oPropertyDataModelOb7 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb7 !== void 0 && (_oPropertyDataModelOb8 = _oPropertyDataModelOb7.annotations) !== null && _oPropertyDataModelOb8 !== void 0 && (_oPropertyDataModelOb9 = _oPropertyDataModelOb8.Measures) !== null && _oPropertyDataModelOb9 !== void 0 && _oPropertyDataModelOb9.Unit || (_oPropertyDataModelOb10 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb10 !== void 0 && (_oPropertyDataModelOb11 = _oPropertyDataModelOb10.annotations) !== null && _oPropertyDataModelOb11 !== void 0 && (_oPropertyDataModelOb12 = _oPropertyDataModelOb11.Measures) !== null && _oPropertyDataModelOb12 !== void 0 && _oPropertyDataModelOb12.ISOCurrency) {
      oTargetBinding = UIFormatters.getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);

      if ((fieldFormatOptions === null || fieldFormatOptions === void 0 ? void 0 : fieldFormatOptions.measureDisplayMode) === "Hidden" && isComplexTypeExpression(oTargetBinding)) {
        // TODO: Refactor once types are less generic here
        oTargetBinding.formatOptions = _objectSpread(_objectSpread({}, oTargetBinding.formatOptions), {}, {
          showMeasure: false
        });
      }
    } else if ((_oPropertyDataModelOb13 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb13 !== void 0 && (_oPropertyDataModelOb14 = _oPropertyDataModelOb13.annotations) !== null && _oPropertyDataModelOb14 !== void 0 && (_oPropertyDataModelOb15 = _oPropertyDataModelOb14.Common) !== null && _oPropertyDataModelOb15 !== void 0 && _oPropertyDataModelOb15.Timezone) {
      oTargetBinding = UIFormatters.getBindingWithTimezone(oPropertyDataModelObjectPath, oBindingExpression, false, true);
    } else {
      oTargetBinding = CommonFormatters.getBindingWithTextArrangement(oPropertyDataModelObjectPath, oBindingExpression, fieldFormatOptions);
    }

    if (asObject) {
      return oTargetBinding;
    } // We don't include $$nopatch and parseKeepEmptyString as they make no sense in the text binding case


    return compileExpression(oTargetBinding);
  };

  _exports.getTextBinding = getTextBinding;

  var getValueBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var ignoreUnit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var ignoreFormatting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var bindingParameters = arguments.length > 4 ? arguments[4] : undefined;
    var targetTypeAny = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var keepUnit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    if (PropertyHelper.isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
      var oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
      oPropertyDataModelObjectPath.targetObject = oNavPath.target;
      oNavPath.visitedObjects.forEach(function (oNavObj) {
        if (oNavObj && oNavObj._type === "NavigationProperty") {
          oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
        }
      });
    }

    var targetObject = oPropertyDataModelObjectPath.targetObject;

    if (PropertyHelper.isProperty(targetObject)) {
      var oBindingExpression = pathInModel(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));

      if (isPathInModelExpression(oBindingExpression)) {
        var _targetObject$annotat, _targetObject$annotat2, _targetObject$annotat3, _targetObject$annotat4, _targetObject$annotat5, _targetObject$annotat6;

        if ((_targetObject$annotat = targetObject.annotations) !== null && _targetObject$annotat !== void 0 && (_targetObject$annotat2 = _targetObject$annotat.Communication) !== null && _targetObject$annotat2 !== void 0 && _targetObject$annotat2.IsEmailAddress) {
          oBindingExpression.type = "sap.fe.core.type.Email";
        } else if (!ignoreUnit && ((_targetObject$annotat3 = targetObject.annotations) !== null && _targetObject$annotat3 !== void 0 && (_targetObject$annotat4 = _targetObject$annotat3.Measures) !== null && _targetObject$annotat4 !== void 0 && _targetObject$annotat4.ISOCurrency || (_targetObject$annotat5 = targetObject.annotations) !== null && _targetObject$annotat5 !== void 0 && (_targetObject$annotat6 = _targetObject$annotat5.Measures) !== null && _targetObject$annotat6 !== void 0 && _targetObject$annotat6.Unit)) {
          oBindingExpression = UIFormatters.getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression, true, keepUnit ? undefined : {
            showMeasure: false
          });
        } else {
          var _oPropertyDataModelOb16, _oPropertyDataModelOb17;

          var oTimezone = (_oPropertyDataModelOb16 = oPropertyDataModelObjectPath.targetObject.annotations) === null || _oPropertyDataModelOb16 === void 0 ? void 0 : (_oPropertyDataModelOb17 = _oPropertyDataModelOb16.Common) === null || _oPropertyDataModelOb17 === void 0 ? void 0 : _oPropertyDataModelOb17.Timezone;

          if (oTimezone) {
            oBindingExpression = UIFormatters.getBindingWithTimezone(oPropertyDataModelObjectPath, oBindingExpression, true);
          } else {
            oBindingExpression = UIFormatters.formatWithTypeInformation(targetObject, oBindingExpression);
          }

          if (isPathInModelExpression(oBindingExpression) && oBindingExpression.type === "sap.ui.model.odata.type.String") {
            oBindingExpression.formatOptions = {
              parseKeepsEmptyString: true
            };
          }
        }

        if (isPathInModelExpression(oBindingExpression)) {
          if (ignoreFormatting) {
            delete oBindingExpression.formatOptions;
            delete oBindingExpression.constraints;
            delete oBindingExpression.type;
          }

          if (bindingParameters) {
            oBindingExpression.parameters = bindingParameters;
          }

          if (targetTypeAny) {
            oBindingExpression.targetType = "any";
          }
        }

        return compileExpression(oBindingExpression);
      } else {
        // if somehow we could not compile the binding -> return empty string
        return "";
      }
    } else if ((targetObject === null || targetObject === void 0 ? void 0 : targetObject.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" || (targetObject === null || targetObject === void 0 ? void 0 : targetObject.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") {
      return compileExpression(getExpressionFromAnnotation(targetObject.Value));
    } else {
      return "";
    }
  };

  _exports.getValueBinding = getValueBinding;

  var getAssociatedTextBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var textPropertyPath = PropertyHelper.getAssociatedTextPropertyPath(oPropertyDataModelObjectPath.targetObject);

    if (textPropertyPath) {
      var oTextPropertyPath = enhanceDataModelPath(oPropertyDataModelObjectPath, textPropertyPath);
      return getValueBinding(oTextPropertyPath, fieldFormatOptions, true, true, {
        $$noPatch: true
      });
    }

    return undefined;
  };

  _exports.getAssociatedTextBinding = getAssociatedTextBinding;

  var isUsedInNavigationWithQuickViewFacets = function (oDataModelPath, oProperty) {
    var _oDataModelPath$targe, _oDataModelPath$targe2, _oDataModelPath$targe3, _oDataModelPath$targe4;

    var aNavigationProperties = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe = oDataModelPath.targetEntityType) === null || _oDataModelPath$targe === void 0 ? void 0 : _oDataModelPath$targe.navigationProperties) || [];
    var aSemanticObjects = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe2 = oDataModelPath.targetEntityType) === null || _oDataModelPath$targe2 === void 0 ? void 0 : (_oDataModelPath$targe3 = _oDataModelPath$targe2.annotations) === null || _oDataModelPath$targe3 === void 0 ? void 0 : (_oDataModelPath$targe4 = _oDataModelPath$targe3.Common) === null || _oDataModelPath$targe4 === void 0 ? void 0 : _oDataModelPath$targe4.SemanticKey) || [];
    var bIsUsedInNavigationWithQuickViewFacets = false;
    aNavigationProperties.forEach(function (oNavProp) {
      if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
        oNavProp.referentialConstraint.forEach(function (oRefConstraint) {
          if ((oRefConstraint === null || oRefConstraint === void 0 ? void 0 : oRefConstraint.sourceProperty) === oProperty.name) {
            var _oNavProp$targetType, _oNavProp$targetType$, _oNavProp$targetType$2;

            if (oNavProp !== null && oNavProp !== void 0 && (_oNavProp$targetType = oNavProp.targetType) !== null && _oNavProp$targetType !== void 0 && (_oNavProp$targetType$ = _oNavProp$targetType.annotations) !== null && _oNavProp$targetType$ !== void 0 && (_oNavProp$targetType$2 = _oNavProp$targetType$.UI) !== null && _oNavProp$targetType$2 !== void 0 && _oNavProp$targetType$2.QuickViewFacets) {
              bIsUsedInNavigationWithQuickViewFacets = true;
            }
          }
        });
      }
    });

    if (oDataModelPath.startingEntitySet !== oDataModelPath.targetEntitySet) {
      var _oDataModelPath$targe5, _oDataModelPath$targe6, _oDataModelPath$targe7, _oDataModelPath$navig, _oDataModelPath$navig2, _oDataModelPath$navig3;

      var aIsTargetSemanticKey = aSemanticObjects.some(function (oSemantic) {
        var _oSemantic$$target;

        return (oSemantic === null || oSemantic === void 0 ? void 0 : (_oSemantic$$target = oSemantic.$target) === null || _oSemantic$$target === void 0 ? void 0 : _oSemantic$$target.name) === oProperty.name;
      });

      if ((aIsTargetSemanticKey || oProperty.isKey) && oDataModelPath !== null && oDataModelPath !== void 0 && (_oDataModelPath$targe5 = oDataModelPath.targetEntityType) !== null && _oDataModelPath$targe5 !== void 0 && (_oDataModelPath$targe6 = _oDataModelPath$targe5.annotations) !== null && _oDataModelPath$targe6 !== void 0 && (_oDataModelPath$targe7 = _oDataModelPath$targe6.UI) !== null && _oDataModelPath$targe7 !== void 0 && _oDataModelPath$targe7.QuickViewFacets && !(oDataModelPath !== null && oDataModelPath !== void 0 && (_oDataModelPath$navig = oDataModelPath.navigationProperties[0]) !== null && _oDataModelPath$navig !== void 0 && (_oDataModelPath$navig2 = _oDataModelPath$navig.annotations) !== null && _oDataModelPath$navig2 !== void 0 && (_oDataModelPath$navig3 = _oDataModelPath$navig2.Common) !== null && _oDataModelPath$navig3 !== void 0 && _oDataModelPath$navig3.SemanticObject)) {
        bIsUsedInNavigationWithQuickViewFacets = true;
      }
    }

    return bIsUsedInNavigationWithQuickViewFacets;
  };

  _exports.isUsedInNavigationWithQuickViewFacets = isUsedInNavigationWithQuickViewFacets;

  var isRetrieveTextFromValueListEnabled = function (oPropertyPath, fieldFormatOptions) {
    var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3;

    var oProperty = PropertyHelper.isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;

    if (!((_oProperty$annotation = oProperty.annotations) !== null && _oProperty$annotation !== void 0 && (_oProperty$annotation2 = _oProperty$annotation.Common) !== null && _oProperty$annotation2 !== void 0 && _oProperty$annotation2.Text) && !((_oProperty$annotation3 = oProperty.annotations) !== null && _oProperty$annotation3 !== void 0 && _oProperty$annotation3.Measures) && PropertyHelper.hasValueHelp(oProperty) && fieldFormatOptions.textAlignMode === "Form") {
      return true;
    }

    return false;
  };
  /**
   * Returns the binding expression to evaluate the visibility of a DataField or DataPoint annotation.
   *
   * SAP Fiori elements will evaluate either the UI.Hidden annotation defined on the annotation itself or on the target property.
   *
   * @param dataFieldModelPath The metapath referring to the annotation we are evaluating.
   * @param [formatOptions] FormatOptions optional.
   * @param formatOptions.isAnalytics This flag is set when using an analytical table.
   * @returns An expression that you can bind to the UI.
   */


  _exports.isRetrieveTextFromValueListEnabled = isRetrieveTextFromValueListEnabled;

  var getVisibleExpression = function (dataFieldModelPath, formatOptions) {
    var _targetObject$Target, _targetObject$Target$, _targetObject$annotat7, _targetObject$annotat8, _propertyValue$annota, _propertyValue$annota2;

    var targetObject = dataFieldModelPath.targetObject;
    var propertyValue;

    if (targetObject) {
      switch (targetObject.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        case "com.sap.vocabularies.UI.v1.DataPointType":
          propertyValue = targetObject.Value.$target;
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          // if it is a DataFieldForAnnotation pointing to a DataPoint we look at the dataPoint's value
          if ((targetObject === null || targetObject === void 0 ? void 0 : (_targetObject$Target = targetObject.Target) === null || _targetObject$Target === void 0 ? void 0 : (_targetObject$Target$ = _targetObject$Target.$target) === null || _targetObject$Target$ === void 0 ? void 0 : _targetObject$Target$.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
            var _targetObject$Target$2;

            propertyValue = (_targetObject$Target$2 = targetObject.Target.$target) === null || _targetObject$Target$2 === void 0 ? void 0 : _targetObject$Target$2.Value.$target;
            break;
          }

        // eslint-disable-next-line no-fallthrough

        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
        default:
          propertyValue = undefined;
      }
    }

    var isAnalyticalGroupHeaderExpanded = formatOptions !== null && formatOptions !== void 0 && formatOptions.isAnalytics ? UI.IsExpanded : constant(false);
    var isAnalyticalLeaf = formatOptions !== null && formatOptions !== void 0 && formatOptions.isAnalytics ? equal(UI.NodeLevel, 0) : constant(false); // A data field is visible if:
    // - the UI.Hidden expression in the original annotation does not evaluate to 'true'
    // - the UI.Hidden expression in the target property does not evaluate to 'true'
    // - in case of Analytics it's not visible for an expanded GroupHeader

    return compileExpression(and.apply(void 0, [not(equal(getExpressionFromAnnotation(targetObject === null || targetObject === void 0 ? void 0 : (_targetObject$annotat7 = targetObject.annotations) === null || _targetObject$annotat7 === void 0 ? void 0 : (_targetObject$annotat8 = _targetObject$annotat7.UI) === null || _targetObject$annotat8 === void 0 ? void 0 : _targetObject$annotat8.Hidden), true)), ifElse(!!propertyValue, propertyValue && not(equal(getExpressionFromAnnotation((_propertyValue$annota = propertyValue.annotations) === null || _propertyValue$annota === void 0 ? void 0 : (_propertyValue$annota2 = _propertyValue$annota.UI) === null || _propertyValue$annota2 === void 0 ? void 0 : _propertyValue$annota2.Hidden), true)), true), or(not(isAnalyticalGroupHeaderExpanded), isAnalyticalLeaf)]));
  };

  _exports.getVisibleExpression = getVisibleExpression;

  var QVTextBinding = function (oPropertyDataModelObjectPath, oPropertyValueDataModelObjectPath, fieldFormatOptions) {
    var asObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var returnValue = getValueBinding(oPropertyDataModelObjectPath, fieldFormatOptions, asObject);

    if (returnValue === "") {
      returnValue = getTextBinding(oPropertyValueDataModelObjectPath, fieldFormatOptions, asObject);
    }

    return returnValue;
  };

  _exports.QVTextBinding = QVTextBinding;

  var getQuickViewType = function (oPropertyDataModelObjectPath) {
    var _targetObject$$target, _targetObject$$target2, _targetObject$$target3, _targetObject$$target4, _targetObject$$target5, _targetObject$$target6;

    var targetObject = oPropertyDataModelObjectPath.targetObject;

    if (targetObject !== null && targetObject !== void 0 && (_targetObject$$target = targetObject.$target) !== null && _targetObject$$target !== void 0 && (_targetObject$$target2 = _targetObject$$target.annotations) !== null && _targetObject$$target2 !== void 0 && (_targetObject$$target3 = _targetObject$$target2.Communication) !== null && _targetObject$$target3 !== void 0 && _targetObject$$target3.IsEmailAddress) {
      return "email";
    }

    if (targetObject !== null && targetObject !== void 0 && (_targetObject$$target4 = targetObject.$target) !== null && _targetObject$$target4 !== void 0 && (_targetObject$$target5 = _targetObject$$target4.annotations) !== null && _targetObject$$target5 !== void 0 && (_targetObject$$target6 = _targetObject$$target5.Communication) !== null && _targetObject$$target6 !== void 0 && _targetObject$$target6.IsPhoneNumber) {
      return "phone";
    }

    return "text";
  };

  _exports.getQuickViewType = getQuickViewType;

  var getSemanticObjectExpressionToResolve = function (oAnnotations) {
    var aSemObjExprToResolve = [];

    if (oAnnotations) {
      var aSemObjkeys = Object.keys(oAnnotations).filter(function (element) {
        return element === "SemanticObject" || element.startsWith("SemanticObject#");
      });

      for (var iSemObjCount = 0; iSemObjCount < aSemObjkeys.length; iSemObjCount++) {
        var sSemObjExpression = compileExpression(getExpressionFromAnnotation(oAnnotations[aSemObjkeys[iSemObjCount]]));
        aSemObjExprToResolve.push({
          key: (sSemObjExpression === null || sSemObjExpression === void 0 ? void 0 : sSemObjExpression.indexOf("{")) === -1 ? sSemObjExpression : sSemObjExpression === null || sSemObjExpression === void 0 ? void 0 : sSemObjExpression.split("{")[1].split("}")[0],
          value: sSemObjExpression
        });
      }
    }

    return aSemObjExprToResolve;
  };

  _exports.getSemanticObjectExpressionToResolve = getSemanticObjectExpressionToResolve;

  var getSemanticObjects = function (aSemObjExprToResolve) {
    if (aSemObjExprToResolve.length > 0) {
      var sCustomDataKey = "";
      var sCustomDataValue = "";
      var aSemObjCustomData = [];

      for (var iSemObjCount = 0; iSemObjCount < aSemObjExprToResolve.length; iSemObjCount++) {
        sCustomDataKey = aSemObjExprToResolve[iSemObjCount].key;
        sCustomDataValue = compileExpression(getExpressionFromAnnotation(aSemObjExprToResolve[iSemObjCount].value));
        aSemObjCustomData.push({
          key: sCustomDataKey,
          value: sCustomDataValue
        });
      }

      var oSemanticObjectsModel = new JSONModel(aSemObjCustomData);
      oSemanticObjectsModel.$$valueAsPromise = true;
      var oSemObjBindingContext = oSemanticObjectsModel.createBindingContext("/");
      return oSemObjBindingContext;
    } else {
      return new JSONModel([]).createBindingContext("/");
    }
  };
  /**
   * Method to get MultipleLines for a DataField.
   *
   * @name getMultipleLinesForDataField
   * @param {any} oThis The current object
   * @param {string} sPropertyType The property type
   * @param {boolean} isMultiLineText The property isMultiLineText
   * @returns {CompiledBindingToolkitExpression<string>} The binding expression to determine if a data field should be a MultiLineText or not
   * @public
   */


  _exports.getSemanticObjects = getSemanticObjects;

  var getMultipleLinesForDataField = function (oThis, sPropertyType, isMultiLineText) {
    if (oThis.wrap === "false") {
      return false;
    }

    if (sPropertyType !== "Edm.String") {
      return isMultiLineText;
    }

    if (oThis.editMode === "Display") {
      return true;
    }

    if (oThis.editMode.indexOf("{") > -1) {
      // If the editMode is computed then we just care about the page editMode to determine if the multiline property should be taken into account
      return compileExpression(or(not(UI.IsEditable), isMultiLineText));
    }

    return isMultiLineText;
  };

  _exports.getMultipleLinesForDataField = getMultipleLinesForDataField;

  var _getDraftAdministrativeDataType = function (oMetaModel, sEntityType) {
    return oMetaModel.requestObject("/".concat(sEntityType, "/DraftAdministrativeData/"));
  };

  _exports._getDraftAdministrativeDataType = _getDraftAdministrativeDataType;

  var getBindingForDraftAdminBlockInline = function (iContext, sEntityType) {
    return _getDraftAdministrativeDataType(iContext.getModel(), sEntityType).then(function (oDADEntityType) {
      var aBindings = [];

      if (oDADEntityType.InProcessByUserDescription) {
        aBindings.push(pathInModel("DraftAdministrativeData/InProcessByUserDescription"));
      }

      aBindings.push(pathInModel("DraftAdministrativeData/InProcessByUser"));

      if (oDADEntityType.LastChangedByUserDescription) {
        aBindings.push(pathInModel("DraftAdministrativeData/LastChangedByUserDescription"));
      }

      aBindings.push(pathInModel("DraftAdministrativeData/LastChangedByUser"));
      return compileExpression(ifElse(pathInModel("HasDraftEntity"), or.apply(void 0, aBindings), resolveBindingString("")));
    });
  };

  _exports.getBindingForDraftAdminBlockInline = getBindingForDraftAdminBlockInline;

  var _hasValueHelpToShow = function (oProperty, measureDisplayMode) {
    // we show a value help if teh property has one or if its visible unit has one
    var oPropertyUnit = PropertyHelper.getAssociatedUnitProperty(oProperty);
    var oPropertyCurrency = PropertyHelper.getAssociatedCurrencyProperty(oProperty);
    return PropertyHelper.hasValueHelp(oProperty) && oProperty.type !== "Edm.Boolean" || measureDisplayMode !== "Hidden" && (oPropertyUnit && PropertyHelper.hasValueHelp(oPropertyUnit) || oPropertyCurrency && PropertyHelper.hasValueHelp(oPropertyCurrency));
  };
  /**
   * Sets Edit Style properties for Field in case of Macro Field(Field.metadata.ts) and MassEditDialog fields.
   *
   * @param oProps Field Properties for the Macro Field.
   * @param oDataField DataField Object.
   * @param oDataModelPath DataModel Object Path to the property.
   * @param onlyEditStyle To add only editStyle.
   */


  var setEditStyleProperties = function (oProps, oDataField, oDataModelPath, onlyEditStyle) {
    var _oDataField$Target, _oDataField$Target$$t, _oProps$formatOptions, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6, _oProperty$annotation7, _oProperty$annotation8, _oProperty$annotation9, _oProperty$annotation10, _oProperty$annotation11, _oProperty$annotation12;

    var oProperty = oDataModelPath.targetObject;

    if (!PropertyHelper.isProperty(oProperty)) {
      oProps.editStyle = null;
      return;
    }

    if (!onlyEditStyle) {
      oProps.valueBindingExpression = getValueBinding(oDataModelPath, oProps.formatOptions);
    }

    switch (oDataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        if (((_oDataField$Target = oDataField.Target) === null || _oDataField$Target === void 0 ? void 0 : (_oDataField$Target$$t = _oDataField$Target.$target) === null || _oDataField$Target$$t === void 0 ? void 0 : _oDataField$Target$$t.Visualization) === "UI.VisualizationType/Rating") {
          oProps.editStyle = "RatingIndicator";
          return;
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataPointType":
        if ((oDataField === null || oDataField === void 0 ? void 0 : oDataField.Visualization) === "UI.VisualizationType/Rating") {
          oProps.editStyle = "RatingIndicator";
          return;
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        oProps.editStyle = null;
        return;

      default:
    }

    if (_hasValueHelpToShow(oProperty, (_oProps$formatOptions = oProps.formatOptions) === null || _oProps$formatOptions === void 0 ? void 0 : _oProps$formatOptions.measureDisplayMode)) {
      if (!onlyEditStyle) {
        var _oProps$formatOptions2;

        oProps.textBindingExpression = getAssociatedTextBinding(oDataModelPath, oProps.formatOptions);

        if (((_oProps$formatOptions2 = oProps.formatOptions) === null || _oProps$formatOptions2 === void 0 ? void 0 : _oProps$formatOptions2.measureDisplayMode) !== "Hidden") {
          // for the MDC Field we need to keep the unit inside the valueBindingExpression
          oProps.valueBindingExpression = getValueBinding(oDataModelPath, oProps.formatOptions, false, false, undefined, false, true);
        }
      }

      oProps.editStyle = "InputWithValueHelp";
      return;
    }

    switch (oProperty.type) {
      case "Edm.Date":
        oProps.editStyle = "DatePicker";
        return;

      case "Edm.Time":
      case "Edm.TimeOfDay":
        oProps.editStyle = "TimePicker";
        return;

      case "Edm.DateTime":
      case "Edm.DateTimeOffset":
        oProps.editStyle = "DateTimePicker"; // No timezone defined. Also for compatibility reasons.

        if (!((_oProperty$annotation4 = oProperty.annotations) !== null && _oProperty$annotation4 !== void 0 && (_oProperty$annotation5 = _oProperty$annotation4.Common) !== null && _oProperty$annotation5 !== void 0 && _oProperty$annotation5.Timezone)) {
          oProps.showTimezone = undefined;
        } else {
          oProps.showTimezone = true;
        }

        return;

      case "Edm.Boolean":
        oProps.editStyle = "CheckBox";
        return;

      case "Edm.Stream":
        oProps.editStyle = "File";
        return;

      case "Edm.String":
        if ((_oProperty$annotation6 = oProperty.annotations) !== null && _oProperty$annotation6 !== void 0 && (_oProperty$annotation7 = _oProperty$annotation6.UI) !== null && _oProperty$annotation7 !== void 0 && (_oProperty$annotation8 = _oProperty$annotation7.MultiLineText) !== null && _oProperty$annotation8 !== void 0 && _oProperty$annotation8.valueOf()) {
          oProps.editStyle = "TextArea";
          return;
        }

        break;

      default:
        oProps.editStyle = "Input";
    }

    if ((_oProperty$annotation9 = oProperty.annotations) !== null && _oProperty$annotation9 !== void 0 && (_oProperty$annotation10 = _oProperty$annotation9.Measures) !== null && _oProperty$annotation10 !== void 0 && _oProperty$annotation10.ISOCurrency || (_oProperty$annotation11 = oProperty.annotations) !== null && _oProperty$annotation11 !== void 0 && (_oProperty$annotation12 = _oProperty$annotation11.Measures) !== null && _oProperty$annotation12 !== void 0 && _oProperty$annotation12.Unit) {
      if (!onlyEditStyle) {
        oProps.unitBindingExpression = compileExpression(UIFormatters.getBindingForUnitOrCurrency(oDataModelPath));
        oProps.descriptionBindingExpression = UIFormatters.ifUnitEditable(oProperty, "", UIFormatters.getBindingForUnitOrCurrency(oDataModelPath));
        var unitProperty = PropertyHelper.getAssociatedCurrencyProperty(oProperty) || PropertyHelper.getAssociatedUnitProperty(oProperty);
        oProps.unitEditable = compileExpression(not(isReadOnlyExpression(unitProperty)));
      }

      oProps.editStyle = "InputWithUnit";
      return;
    }

    oProps.editStyle = "Input";
  };

  getBindingForDraftAdminBlockInline.requiresIContext = true;
  _exports.setEditStyleProperties = setEditStyleProperties;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb25Ub0VuaGFuY2UiLCJmdWxsQ29udGV4dFBhdGgiLCJ0cmFuc2Zvcm1SZWN1cnNpdmVseSIsImV4cHJlc3Npb24iLCJvdXRFeHByZXNzaW9uIiwibW9kZWxOYW1lIiwidW5kZWZpbmVkIiwib1Byb3BlcnR5RGF0YU1vZGVsUGF0aCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwicGF0aCIsIkNvbW1vbkZvcm1hdHRlcnMiLCJnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudCIsImZvcm1hdFZhbHVlUmVjdXJzaXZlbHkiLCJVSUZvcm1hdHRlcnMiLCJmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uIiwidGFyZ2V0T2JqZWN0IiwiZ2V0VGV4dEJpbmRpbmdFeHByZXNzaW9uIiwib1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCIsImZpZWxkRm9ybWF0T3B0aW9ucyIsImdldFRleHRCaW5kaW5nIiwiYXNPYmplY3QiLCIkVHlwZSIsImZpZWxkVmFsdWUiLCJWYWx1ZSIsImNvbXBpbGVFeHByZXNzaW9uIiwiY29uc3RhbnQiLCJQcm9wZXJ0eUhlbHBlciIsImlzUGF0aEV4cHJlc3Npb24iLCIkdGFyZ2V0Iiwib0JpbmRpbmdFeHByZXNzaW9uIiwicGF0aEluTW9kZWwiLCJnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoIiwib1RhcmdldEJpbmRpbmciLCJhbm5vdGF0aW9ucyIsIk1lYXN1cmVzIiwiVW5pdCIsIklTT0N1cnJlbmN5IiwiZ2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeSIsIm1lYXN1cmVEaXNwbGF5TW9kZSIsImlzQ29tcGxleFR5cGVFeHByZXNzaW9uIiwiZm9ybWF0T3B0aW9ucyIsInNob3dNZWFzdXJlIiwiQ29tbW9uIiwiVGltZXpvbmUiLCJnZXRCaW5kaW5nV2l0aFRpbWV6b25lIiwiZ2V0VmFsdWVCaW5kaW5nIiwiaWdub3JlVW5pdCIsImlnbm9yZUZvcm1hdHRpbmciLCJiaW5kaW5nUGFyYW1ldGVycyIsInRhcmdldFR5cGVBbnkiLCJrZWVwVW5pdCIsIm9OYXZQYXRoIiwidGFyZ2V0RW50aXR5VHlwZSIsInJlc29sdmVQYXRoIiwidGFyZ2V0IiwidmlzaXRlZE9iamVjdHMiLCJmb3JFYWNoIiwib05hdk9iaiIsIl90eXBlIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJwdXNoIiwiaXNQcm9wZXJ0eSIsImlzUGF0aEluTW9kZWxFeHByZXNzaW9uIiwiQ29tbXVuaWNhdGlvbiIsIklzRW1haWxBZGRyZXNzIiwidHlwZSIsIm9UaW1lem9uZSIsInBhcnNlS2VlcHNFbXB0eVN0cmluZyIsImNvbnN0cmFpbnRzIiwicGFyYW1ldGVycyIsInRhcmdldFR5cGUiLCJnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24iLCJnZXRBc3NvY2lhdGVkVGV4dEJpbmRpbmciLCJ0ZXh0UHJvcGVydHlQYXRoIiwiZ2V0QXNzb2NpYXRlZFRleHRQcm9wZXJ0eVBhdGgiLCJvVGV4dFByb3BlcnR5UGF0aCIsIiQkbm9QYXRjaCIsImlzVXNlZEluTmF2aWdhdGlvbldpdGhRdWlja1ZpZXdGYWNldHMiLCJvRGF0YU1vZGVsUGF0aCIsIm9Qcm9wZXJ0eSIsImFOYXZpZ2F0aW9uUHJvcGVydGllcyIsImFTZW1hbnRpY09iamVjdHMiLCJTZW1hbnRpY0tleSIsImJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzIiwib05hdlByb3AiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJsZW5ndGgiLCJvUmVmQ29uc3RyYWludCIsInNvdXJjZVByb3BlcnR5IiwibmFtZSIsIlVJIiwiUXVpY2tWaWV3RmFjZXRzIiwic3RhcnRpbmdFbnRpdHlTZXQiLCJ0YXJnZXRFbnRpdHlTZXQiLCJhSXNUYXJnZXRTZW1hbnRpY0tleSIsInNvbWUiLCJvU2VtYW50aWMiLCJpc0tleSIsIlNlbWFudGljT2JqZWN0IiwiaXNSZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0RW5hYmxlZCIsIm9Qcm9wZXJ0eVBhdGgiLCJUZXh0IiwiaGFzVmFsdWVIZWxwIiwidGV4dEFsaWduTW9kZSIsImdldFZpc2libGVFeHByZXNzaW9uIiwiZGF0YUZpZWxkTW9kZWxQYXRoIiwicHJvcGVydHlWYWx1ZSIsIlRhcmdldCIsImlzQW5hbHl0aWNhbEdyb3VwSGVhZGVyRXhwYW5kZWQiLCJpc0FuYWx5dGljcyIsIklzRXhwYW5kZWQiLCJpc0FuYWx5dGljYWxMZWFmIiwiZXF1YWwiLCJOb2RlTGV2ZWwiLCJhbmQiLCJub3QiLCJIaWRkZW4iLCJpZkVsc2UiLCJvciIsIlFWVGV4dEJpbmRpbmciLCJvUHJvcGVydHlWYWx1ZURhdGFNb2RlbE9iamVjdFBhdGgiLCJyZXR1cm5WYWx1ZSIsImdldFF1aWNrVmlld1R5cGUiLCJJc1Bob25lTnVtYmVyIiwiZ2V0U2VtYW50aWNPYmplY3RFeHByZXNzaW9uVG9SZXNvbHZlIiwib0Fubm90YXRpb25zIiwiYVNlbU9iakV4cHJUb1Jlc29sdmUiLCJhU2VtT2Jqa2V5cyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJlbGVtZW50Iiwic3RhcnRzV2l0aCIsImlTZW1PYmpDb3VudCIsInNTZW1PYmpFeHByZXNzaW9uIiwia2V5IiwiaW5kZXhPZiIsInNwbGl0IiwidmFsdWUiLCJnZXRTZW1hbnRpY09iamVjdHMiLCJzQ3VzdG9tRGF0YUtleSIsInNDdXN0b21EYXRhVmFsdWUiLCJhU2VtT2JqQ3VzdG9tRGF0YSIsIm9TZW1hbnRpY09iamVjdHNNb2RlbCIsIkpTT05Nb2RlbCIsIiQkdmFsdWVBc1Byb21pc2UiLCJvU2VtT2JqQmluZGluZ0NvbnRleHQiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsImdldE11bHRpcGxlTGluZXNGb3JEYXRhRmllbGQiLCJvVGhpcyIsInNQcm9wZXJ0eVR5cGUiLCJpc011bHRpTGluZVRleHQiLCJ3cmFwIiwiZWRpdE1vZGUiLCJJc0VkaXRhYmxlIiwiX2dldERyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhVHlwZSIsIm9NZXRhTW9kZWwiLCJzRW50aXR5VHlwZSIsInJlcXVlc3RPYmplY3QiLCJnZXRCaW5kaW5nRm9yRHJhZnRBZG1pbkJsb2NrSW5saW5lIiwiaUNvbnRleHQiLCJnZXRNb2RlbCIsInRoZW4iLCJvREFERW50aXR5VHlwZSIsImFCaW5kaW5ncyIsIkluUHJvY2Vzc0J5VXNlckRlc2NyaXB0aW9uIiwiTGFzdENoYW5nZWRCeVVzZXJEZXNjcmlwdGlvbiIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiX2hhc1ZhbHVlSGVscFRvU2hvdyIsIm9Qcm9wZXJ0eVVuaXQiLCJnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5Iiwib1Byb3BlcnR5Q3VycmVuY3kiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsInNldEVkaXRTdHlsZVByb3BlcnRpZXMiLCJvUHJvcHMiLCJvRGF0YUZpZWxkIiwib25seUVkaXRTdHlsZSIsImVkaXRTdHlsZSIsInZhbHVlQmluZGluZ0V4cHJlc3Npb24iLCJWaXN1YWxpemF0aW9uIiwidGV4dEJpbmRpbmdFeHByZXNzaW9uIiwic2hvd1RpbWV6b25lIiwiTXVsdGlMaW5lVGV4dCIsInZhbHVlT2YiLCJ1bml0QmluZGluZ0V4cHJlc3Npb24iLCJnZXRCaW5kaW5nRm9yVW5pdE9yQ3VycmVuY3kiLCJkZXNjcmlwdGlvbkJpbmRpbmdFeHByZXNzaW9uIiwiaWZVbml0RWRpdGFibGUiLCJ1bml0UHJvcGVydHkiLCJ1bml0RWRpdGFibGUiLCJpc1JlYWRPbmx5RXhwcmVzc2lvbiIsInJlcXVpcmVzSUNvbnRleHQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkZpZWxkVGVtcGxhdGluZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5hdmlnYXRpb25Qcm9wZXJ0eSwgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcywgRGF0YUZpZWxkV2l0aFVybCwgRGF0YVBvaW50VHlwZVR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHsgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgeyBVSSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQmluZGluZ0hlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24sIENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7XG5cdGFuZCxcblx0Y29tcGlsZUV4cHJlc3Npb24sXG5cdGNvbnN0YW50LFxuXHRlcXVhbCxcblx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uLFxuXHRpZkVsc2UsXG5cdGlzQ29tcGxleFR5cGVFeHByZXNzaW9uLFxuXHRpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbixcblx0bm90LFxuXHRvcixcblx0cGF0aEluTW9kZWwsXG5cdHJlc29sdmVCaW5kaW5nU3RyaW5nLFxuXHR0cmFuc2Zvcm1SZWN1cnNpdmVseVxufSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0ICogYXMgQ29tbW9uRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Db21tb25Gb3JtYXR0ZXJzXCI7XG5pbXBvcnQgdHlwZSB7IERhdGFNb2RlbE9iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyBlbmhhbmNlRGF0YU1vZGVsUGF0aCwgZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGlzUmVhZE9ubHlFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRmllbGRDb250cm9sSGVscGVyXCI7XG5pbXBvcnQgKiBhcyBQcm9wZXJ0eUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Qcm9wZXJ0eUhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBEaXNwbGF5TW9kZSwgUHJvcGVydHlPclBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9VSUZvcm1hdHRlcnNcIjtcbmltcG9ydCAqIGFzIFVJRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9VSUZvcm1hdHRlcnNcIjtcbmltcG9ydCB0eXBlIHsgRmllbGRQcm9wZXJ0aWVzIH0gZnJvbSBcInNhcC9mZS9tYWNyb3MvaW50ZXJuYWwvRmllbGQubWV0YWRhdGFcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGFkZCB0aGUgdGV4dCBhcnJhbmdlbWVudCB0byBhIGJpbmRpbmcgZXhwcmVzc2lvbi5cbiAqXG4gKiBAcGFyYW0gYmluZGluZ0V4cHJlc3Npb25Ub0VuaGFuY2UgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiB0byBiZSBlbmhhbmNlZFxuICogQHBhcmFtIGZ1bGxDb250ZXh0UGF0aCBUaGUgY3VycmVudCBjb250ZXh0IHBhdGggd2UncmUgb24gKHRvIHByb3Blcmx5IHJlc29sdmUgdGhlIHRleHQgYXJyYW5nZW1lbnQgcHJvcGVydGllcylcbiAqIEByZXR1cm5zIEFuIHVwZGF0ZWQgZXhwcmVzc2lvbiBjb250YWluaW5nIHRoZSB0ZXh0IGFycmFuZ2VtZW50IGJpbmRpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uID0gZnVuY3Rpb24gKFxuXHRiaW5kaW5nRXhwcmVzc2lvblRvRW5oYW5jZTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4sXG5cdGZ1bGxDb250ZXh0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4ge1xuXHRyZXR1cm4gdHJhbnNmb3JtUmVjdXJzaXZlbHkoYmluZGluZ0V4cHJlc3Npb25Ub0VuaGFuY2UsIFwiUGF0aEluTW9kZWxcIiwgKGV4cHJlc3Npb24pID0+IHtcblx0XHRsZXQgb3V0RXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4gPSBleHByZXNzaW9uO1xuXHRcdGlmIChleHByZXNzaW9uLm1vZGVsTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBJbiBjYXNlIG9mIGRlZmF1bHQgbW9kZWwgd2UgdGhlbiBuZWVkIHRvIHJlc29sdmUgdGhlIHRleHQgYXJyYW5nZW1lbnQgcHJvcGVydHlcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGggPSBlbmhhbmNlRGF0YU1vZGVsUGF0aChmdWxsQ29udGV4dFBhdGgsIGV4cHJlc3Npb24ucGF0aCk7XG5cdFx0XHRvdXRFeHByZXNzaW9uID0gQ29tbW9uRm9ybWF0dGVycy5nZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChvUHJvcGVydHlEYXRhTW9kZWxQYXRoLCBleHByZXNzaW9uKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dEV4cHJlc3Npb247XG5cdH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdFZhbHVlUmVjdXJzaXZlbHkgPSBmdW5jdGlvbiAoXG5cdGJpbmRpbmdFeHByZXNzaW9uVG9FbmhhbmNlOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55Pixcblx0ZnVsbENvbnRleHRQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PiB7XG5cdHJldHVybiB0cmFuc2Zvcm1SZWN1cnNpdmVseShiaW5kaW5nRXhwcmVzc2lvblRvRW5oYW5jZSwgXCJQYXRoSW5Nb2RlbFwiLCAoZXhwcmVzc2lvbikgPT4ge1xuXHRcdGxldCBvdXRFeHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PiA9IGV4cHJlc3Npb247XG5cdFx0aWYgKGV4cHJlc3Npb24ubW9kZWxOYW1lID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEluIGNhc2Ugb2YgZGVmYXVsdCBtb2RlbCB3ZSB0aGVuIG5lZWQgdG8gcmVzb2x2ZSB0aGUgdGV4dCBhcnJhbmdlbWVudCBwcm9wZXJ0eVxuXHRcdFx0Y29uc3Qgb1Byb3BlcnR5RGF0YU1vZGVsUGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGZ1bGxDb250ZXh0UGF0aCwgZXhwcmVzc2lvbi5wYXRoKTtcblx0XHRcdG91dEV4cHJlc3Npb24gPSBVSUZvcm1hdHRlcnMuZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihvUHJvcGVydHlEYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdCwgZXhwcmVzc2lvbik7XG5cdFx0fVxuXHRcdHJldHVybiBvdXRFeHByZXNzaW9uO1xuXHR9KTtcbn07XG5leHBvcnQgY29uc3QgZ2V0VGV4dEJpbmRpbmdFeHByZXNzaW9uID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmaWVsZEZvcm1hdE9wdGlvbnM6IHsgZGlzcGxheU1vZGU/OiBEaXNwbGF5TW9kZTsgbWVhc3VyZURpc3BsYXlNb2RlPzogc3RyaW5nIH1cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0cmV0dXJuIGdldFRleHRCaW5kaW5nKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIGZpZWxkRm9ybWF0T3B0aW9ucywgdHJ1ZSkgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz47XG59O1xuZXhwb3J0IGNvbnN0IGdldFRleHRCaW5kaW5nID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmaWVsZEZvcm1hdE9wdGlvbnM6IHsgZGlzcGxheU1vZGU/OiBEaXNwbGF5TW9kZTsgbWVhc3VyZURpc3BsYXlNb2RlPzogc3RyaW5nIH0sXG5cdGFzT2JqZWN0OiBib29sZWFuID0gZmFsc2Vcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+IHwgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24ge1xuXHRpZiAoXG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiIHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFR5cGVcIiB8fFxuXHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Py4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGhcIiB8fFxuXHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Py4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoVXJsXCIgfHxcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvblwiIHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhBY3Rpb25cIlxuXHQpIHtcblx0XHQvLyBJZiB0aGVyZSBpcyBubyByZXNvbHZlZCBwcm9wZXJ0eSwgdGhlIHZhbHVlIGlzIHJldHVybmVkIGFzIGEgY29uc3RhbnRcblx0XHRjb25zdCBmaWVsZFZhbHVlID0gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuVmFsdWUgfHwgXCJcIjtcblx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oY29uc3RhbnQoZmllbGRWYWx1ZSkpO1xuXHR9XG5cdGlmIChQcm9wZXJ0eUhlbHBlci5pc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KSAmJiBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0KSB7XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnBhdGgpO1xuXHR9XG5cdGNvbnN0IG9CaW5kaW5nRXhwcmVzc2lvbiA9IHBhdGhJbk1vZGVsKGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCkpO1xuXHRsZXQgb1RhcmdldEJpbmRpbmc7XG5cdGlmIChcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0IHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3lcblx0KSB7XG5cdFx0b1RhcmdldEJpbmRpbmcgPSBVSUZvcm1hdHRlcnMuZ2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeShvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLCBvQmluZGluZ0V4cHJlc3Npb24pO1xuXHRcdGlmIChmaWVsZEZvcm1hdE9wdGlvbnM/Lm1lYXN1cmVEaXNwbGF5TW9kZSA9PT0gXCJIaWRkZW5cIiAmJiBpc0NvbXBsZXhUeXBlRXhwcmVzc2lvbihvVGFyZ2V0QmluZGluZykpIHtcblx0XHRcdC8vIFRPRE86IFJlZmFjdG9yIG9uY2UgdHlwZXMgYXJlIGxlc3MgZ2VuZXJpYyBoZXJlXG5cdFx0XHRvVGFyZ2V0QmluZGluZy5mb3JtYXRPcHRpb25zID0ge1xuXHRcdFx0XHQuLi5vVGFyZ2V0QmluZGluZy5mb3JtYXRPcHRpb25zLFxuXHRcdFx0XHRzaG93TWVhc3VyZTogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UaW1lem9uZSkge1xuXHRcdG9UYXJnZXRCaW5kaW5nID0gVUlGb3JtYXR0ZXJzLmdldEJpbmRpbmdXaXRoVGltZXpvbmUob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgb0JpbmRpbmdFeHByZXNzaW9uLCBmYWxzZSwgdHJ1ZSk7XG5cdH0gZWxzZSB7XG5cdFx0b1RhcmdldEJpbmRpbmcgPSBDb21tb25Gb3JtYXR0ZXJzLmdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50KFxuXHRcdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbixcblx0XHRcdGZpZWxkRm9ybWF0T3B0aW9uc1xuXHRcdCk7XG5cdH1cblx0aWYgKGFzT2JqZWN0KSB7XG5cdFx0cmV0dXJuIG9UYXJnZXRCaW5kaW5nO1xuXHR9XG5cdC8vIFdlIGRvbid0IGluY2x1ZGUgJCRub3BhdGNoIGFuZCBwYXJzZUtlZXBFbXB0eVN0cmluZyBhcyB0aGV5IG1ha2Ugbm8gc2Vuc2UgaW4gdGhlIHRleHQgYmluZGluZyBjYXNlXG5cdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihvVGFyZ2V0QmluZGluZyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VmFsdWVCaW5kaW5nID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmaWVsZEZvcm1hdE9wdGlvbnM6IHsgbWVhc3VyZURpc3BsYXlNb2RlPzogc3RyaW5nIH0sXG5cdGlnbm9yZVVuaXQ6IGJvb2xlYW4gPSBmYWxzZSxcblx0aWdub3JlRm9ybWF0dGluZzogYm9vbGVhbiA9IGZhbHNlLFxuXHRiaW5kaW5nUGFyYW1ldGVycz86IG9iamVjdCxcblx0dGFyZ2V0VHlwZUFueSA9IGZhbHNlLFxuXHRrZWVwVW5pdCA9IGZhbHNlXG4pOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB7XG5cdGlmIChQcm9wZXJ0eUhlbHBlci5pc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KSAmJiBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0KSB7XG5cdFx0Y29uc3Qgb05hdlBhdGggPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUucmVzb2x2ZVBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QucGF0aCwgdHJ1ZSk7XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgPSBvTmF2UGF0aC50YXJnZXQ7XG5cdFx0b05hdlBhdGgudmlzaXRlZE9iamVjdHMuZm9yRWFjaCgob05hdk9iajogYW55KSA9PiB7XG5cdFx0XHRpZiAob05hdk9iaiAmJiBvTmF2T2JqLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMucHVzaChvTmF2T2JqKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGNvbnN0IHRhcmdldE9iamVjdCA9IG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRpZiAoUHJvcGVydHlIZWxwZXIuaXNQcm9wZXJ0eSh0YXJnZXRPYmplY3QpKSB7XG5cdFx0bGV0IG9CaW5kaW5nRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4gPSBwYXRoSW5Nb2RlbChcblx0XHRcdGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aClcblx0XHQpO1xuXHRcdGlmIChpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbihvQmluZGluZ0V4cHJlc3Npb24pKSB7XG5cdFx0XHRpZiAodGFyZ2V0T2JqZWN0LmFubm90YXRpb25zPy5Db21tdW5pY2F0aW9uPy5Jc0VtYWlsQWRkcmVzcykge1xuXHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24udHlwZSA9IFwic2FwLmZlLmNvcmUudHlwZS5FbWFpbFwiO1xuXHRcdFx0fSBlbHNlIGlmICghaWdub3JlVW5pdCAmJiAodGFyZ2V0T2JqZWN0LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgdGFyZ2V0T2JqZWN0LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdCkpIHtcblx0XHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uID0gVUlGb3JtYXR0ZXJzLmdldEJpbmRpbmdXaXRoVW5pdE9yQ3VycmVuY3koXG5cdFx0XHRcdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0XHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24sXG5cdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRrZWVwVW5pdCA/IHVuZGVmaW5lZCA6IHsgc2hvd01lYXN1cmU6IGZhbHNlIH1cblx0XHRcdFx0KSBhcyBhbnk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBvVGltZXpvbmUgPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UaW1lem9uZTtcblx0XHRcdFx0aWYgKG9UaW1lem9uZSkge1xuXHRcdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbiA9IFVJRm9ybWF0dGVycy5nZXRCaW5kaW5nV2l0aFRpbWV6b25lKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIG9CaW5kaW5nRXhwcmVzc2lvbiwgdHJ1ZSkgYXMgYW55O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbiA9IFVJRm9ybWF0dGVycy5mb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uKHRhcmdldE9iamVjdCwgb0JpbmRpbmdFeHByZXNzaW9uKSBhcyBhbnk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGlzUGF0aEluTW9kZWxFeHByZXNzaW9uKG9CaW5kaW5nRXhwcmVzc2lvbikgJiYgb0JpbmRpbmdFeHByZXNzaW9uLnR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCIpIHtcblx0XHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdHBhcnNlS2VlcHNFbXB0eVN0cmluZzogdHJ1ZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbihvQmluZGluZ0V4cHJlc3Npb24pKSB7XG5cdFx0XHRcdGlmIChpZ25vcmVGb3JtYXR0aW5nKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIG9CaW5kaW5nRXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zO1xuXHRcdFx0XHRcdGRlbGV0ZSBvQmluZGluZ0V4cHJlc3Npb24uY29uc3RyYWludHM7XG5cdFx0XHRcdFx0ZGVsZXRlIG9CaW5kaW5nRXhwcmVzc2lvbi50eXBlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChiaW5kaW5nUGFyYW1ldGVycykge1xuXHRcdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbi5wYXJhbWV0ZXJzID0gYmluZGluZ1BhcmFtZXRlcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRhcmdldFR5cGVBbnkpIHtcblx0XHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24udGFyZ2V0VHlwZSA9IFwiYW55XCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihvQmluZGluZ0V4cHJlc3Npb24pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpZiBzb21laG93IHdlIGNvdWxkIG5vdCBjb21waWxlIHRoZSBiaW5kaW5nIC0+IHJldHVybiBlbXB0eSBzdHJpbmdcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fSBlbHNlIGlmIChcblx0XHR0YXJnZXRPYmplY3Q/LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsIHx8XG5cdFx0dGFyZ2V0T2JqZWN0Py4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoXG5cdCkge1xuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oKHRhcmdldE9iamVjdCBhcyBEYXRhRmllbGRXaXRoVXJsKS5WYWx1ZSkpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZFRleHRCaW5kaW5nID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmaWVsZEZvcm1hdE9wdGlvbnM6IHsgbWVhc3VyZURpc3BsYXlNb2RlPzogc3RyaW5nIH1cbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHtcblx0Y29uc3QgdGV4dFByb3BlcnR5UGF0aCA9IFByb3BlcnR5SGVscGVyLmdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0aWYgKHRleHRQcm9wZXJ0eVBhdGgpIHtcblx0XHRjb25zdCBvVGV4dFByb3BlcnR5UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIHRleHRQcm9wZXJ0eVBhdGgpO1xuXHRcdHJldHVybiBnZXRWYWx1ZUJpbmRpbmcob1RleHRQcm9wZXJ0eVBhdGgsIGZpZWxkRm9ybWF0T3B0aW9ucywgdHJ1ZSwgdHJ1ZSwgeyAkJG5vUGF0Y2g6IHRydWUgfSk7XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzID0gZnVuY3Rpb24gKG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLCBvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdGNvbnN0IGFOYXZpZ2F0aW9uUHJvcGVydGllcyA9IG9EYXRhTW9kZWxQYXRoPy50YXJnZXRFbnRpdHlUeXBlPy5uYXZpZ2F0aW9uUHJvcGVydGllcyB8fCBbXTtcblx0Y29uc3QgYVNlbWFudGljT2JqZWN0cyA9IG9EYXRhTW9kZWxQYXRoPy50YXJnZXRFbnRpdHlUeXBlPy5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY0tleSB8fCBbXTtcblx0bGV0IGJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzID0gZmFsc2U7XG5cdGFOYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKChvTmF2UHJvcDogTmF2aWdhdGlvblByb3BlcnR5KSA9PiB7XG5cdFx0aWYgKG9OYXZQcm9wLnJlZmVyZW50aWFsQ29uc3RyYWludCAmJiBvTmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQubGVuZ3RoKSB7XG5cdFx0XHRvTmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQuZm9yRWFjaCgob1JlZkNvbnN0cmFpbnQpID0+IHtcblx0XHRcdFx0aWYgKG9SZWZDb25zdHJhaW50Py5zb3VyY2VQcm9wZXJ0eSA9PT0gb1Byb3BlcnR5Lm5hbWUpIHtcblx0XHRcdFx0XHRpZiAob05hdlByb3A/LnRhcmdldFR5cGU/LmFubm90YXRpb25zPy5VST8uUXVpY2tWaWV3RmFjZXRzKSB7XG5cdFx0XHRcdFx0XHRiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXHRpZiAob0RhdGFNb2RlbFBhdGguc3RhcnRpbmdFbnRpdHlTZXQgIT09IG9EYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldCkge1xuXHRcdGNvbnN0IGFJc1RhcmdldFNlbWFudGljS2V5ID0gYVNlbWFudGljT2JqZWN0cy5zb21lKGZ1bmN0aW9uIChvU2VtYW50aWMpIHtcblx0XHRcdHJldHVybiBvU2VtYW50aWM/LiR0YXJnZXQ/Lm5hbWUgPT09IG9Qcm9wZXJ0eS5uYW1lO1xuXHRcdH0pO1xuXHRcdGlmIChcblx0XHRcdChhSXNUYXJnZXRTZW1hbnRpY0tleSB8fCBvUHJvcGVydHkuaXNLZXkpICYmXG5cdFx0XHRvRGF0YU1vZGVsUGF0aD8udGFyZ2V0RW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LlVJPy5RdWlja1ZpZXdGYWNldHMgJiZcblx0XHRcdCFvRGF0YU1vZGVsUGF0aD8ubmF2aWdhdGlvblByb3BlcnRpZXNbMF0/LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0XG5cdFx0KSB7XG5cdFx0XHRiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cyA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cztcbn07XG5cbmV4cG9ydCBjb25zdCBpc1JldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3RFbmFibGVkID0gZnVuY3Rpb24gKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdGZpZWxkRm9ybWF0T3B0aW9uczogeyBkaXNwbGF5TW9kZT86IERpc3BsYXlNb2RlOyB0ZXh0QWxpZ25Nb2RlPzogc3RyaW5nIH1cbik6IGJvb2xlYW4ge1xuXHRjb25zdCBvUHJvcGVydHk6IFByb3BlcnR5ID0gKFByb3BlcnR5SGVscGVyLmlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCkgJiYgb1Byb3BlcnR5UGF0aC4kdGFyZ2V0KSB8fCAob1Byb3BlcnR5UGF0aCBhcyBQcm9wZXJ0eSk7XG5cdGlmIChcblx0XHQhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQgJiZcblx0XHQhb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcyAmJlxuXHRcdFByb3BlcnR5SGVscGVyLmhhc1ZhbHVlSGVscChvUHJvcGVydHkpICYmXG5cdFx0ZmllbGRGb3JtYXRPcHRpb25zLnRleHRBbGlnbk1vZGUgPT09IFwiRm9ybVwiXG5cdCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGV2YWx1YXRlIHRoZSB2aXNpYmlsaXR5IG9mIGEgRGF0YUZpZWxkIG9yIERhdGFQb2ludCBhbm5vdGF0aW9uLlxuICpcbiAqIFNBUCBGaW9yaSBlbGVtZW50cyB3aWxsIGV2YWx1YXRlIGVpdGhlciB0aGUgVUkuSGlkZGVuIGFubm90YXRpb24gZGVmaW5lZCBvbiB0aGUgYW5ub3RhdGlvbiBpdHNlbGYgb3Igb24gdGhlIHRhcmdldCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gZGF0YUZpZWxkTW9kZWxQYXRoIFRoZSBtZXRhcGF0aCByZWZlcnJpbmcgdG8gdGhlIGFubm90YXRpb24gd2UgYXJlIGV2YWx1YXRpbmcuXG4gKiBAcGFyYW0gW2Zvcm1hdE9wdGlvbnNdIEZvcm1hdE9wdGlvbnMgb3B0aW9uYWwuXG4gKiBAcGFyYW0gZm9ybWF0T3B0aW9ucy5pc0FuYWx5dGljcyBUaGlzIGZsYWcgaXMgc2V0IHdoZW4gdXNpbmcgYW4gYW5hbHl0aWNhbCB0YWJsZS5cbiAqIEByZXR1cm5zIEFuIGV4cHJlc3Npb24gdGhhdCB5b3UgY2FuIGJpbmQgdG8gdGhlIFVJLlxuICovXG5leHBvcnQgY29uc3QgZ2V0VmlzaWJsZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoXG5cdGRhdGFGaWVsZE1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Zm9ybWF0T3B0aW9ucz86IHsgaXNBbmFseXRpY3M/OiBib29sZWFuIH1cbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHtcblx0Y29uc3QgdGFyZ2V0T2JqZWN0OiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIHwgRGF0YVBvaW50VHlwZVR5cGVzID0gZGF0YUZpZWxkTW9kZWxQYXRoLnRhcmdldE9iamVjdDtcblx0bGV0IHByb3BlcnR5VmFsdWU7XG5cdGlmICh0YXJnZXRPYmplY3QpIHtcblx0XHRzd2l0Y2ggKHRhcmdldE9iamVjdC4kVHlwZSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbjpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZTpcblx0XHRcdFx0cHJvcGVydHlWYWx1ZSA9IHRhcmdldE9iamVjdC5WYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjpcblx0XHRcdFx0Ly8gaWYgaXQgaXMgYSBEYXRhRmllbGRGb3JBbm5vdGF0aW9uIHBvaW50aW5nIHRvIGEgRGF0YVBvaW50IHdlIGxvb2sgYXQgdGhlIGRhdGFQb2ludCdzIHZhbHVlXG5cdFx0XHRcdGlmICh0YXJnZXRPYmplY3Q/LlRhcmdldD8uJHRhcmdldD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGUpIHtcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlID0gdGFyZ2V0T2JqZWN0LlRhcmdldC4kdGFyZ2V0Py5WYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZmFsbHRocm91Z2hcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb246XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXHRjb25zdCBpc0FuYWx5dGljYWxHcm91cEhlYWRlckV4cGFuZGVkID0gZm9ybWF0T3B0aW9ucz8uaXNBbmFseXRpY3MgPyBVSS5Jc0V4cGFuZGVkIDogY29uc3RhbnQoZmFsc2UpO1xuXHRjb25zdCBpc0FuYWx5dGljYWxMZWFmID0gZm9ybWF0T3B0aW9ucz8uaXNBbmFseXRpY3MgPyBlcXVhbChVSS5Ob2RlTGV2ZWwsIDApIDogY29uc3RhbnQoZmFsc2UpO1xuXG5cdC8vIEEgZGF0YSBmaWVsZCBpcyB2aXNpYmxlIGlmOlxuXHQvLyAtIHRoZSBVSS5IaWRkZW4gZXhwcmVzc2lvbiBpbiB0aGUgb3JpZ2luYWwgYW5ub3RhdGlvbiBkb2VzIG5vdCBldmFsdWF0ZSB0byAndHJ1ZSdcblx0Ly8gLSB0aGUgVUkuSGlkZGVuIGV4cHJlc3Npb24gaW4gdGhlIHRhcmdldCBwcm9wZXJ0eSBkb2VzIG5vdCBldmFsdWF0ZSB0byAndHJ1ZSdcblx0Ly8gLSBpbiBjYXNlIG9mIEFuYWx5dGljcyBpdCdzIG5vdCB2aXNpYmxlIGZvciBhbiBleHBhbmRlZCBHcm91cEhlYWRlclxuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oXG5cdFx0YW5kKFxuXHRcdFx0Li4uW1xuXHRcdFx0XHRub3QoZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSksXG5cdFx0XHRcdGlmRWxzZShcblx0XHRcdFx0XHQhIXByb3BlcnR5VmFsdWUsXG5cdFx0XHRcdFx0cHJvcGVydHlWYWx1ZSAmJiBub3QoZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKHByb3BlcnR5VmFsdWUuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSksXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRvcihub3QoaXNBbmFseXRpY2FsR3JvdXBIZWFkZXJFeHBhbmRlZCksIGlzQW5hbHl0aWNhbExlYWYpXG5cdFx0XHRdXG5cdFx0KVxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IFFWVGV4dEJpbmRpbmcgPSBmdW5jdGlvbiAoXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdG9Qcm9wZXJ0eVZhbHVlRGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0ZmllbGRGb3JtYXRPcHRpb25zOiB7IGRpc3BsYXlNb2RlPzogRGlzcGxheU1vZGU7IG1lYXN1cmVEaXNwbGF5TW9kZT86IHN0cmluZyB9LFxuXHRhc09iamVjdDogYm9vbGVhbiA9IGZhbHNlXG4pIHtcblx0bGV0IHJldHVyblZhbHVlOiBhbnkgPSBnZXRWYWx1ZUJpbmRpbmcob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgZmllbGRGb3JtYXRPcHRpb25zLCBhc09iamVjdCk7XG5cdGlmIChyZXR1cm5WYWx1ZSA9PT0gXCJcIikge1xuXHRcdHJldHVyblZhbHVlID0gZ2V0VGV4dEJpbmRpbmcob1Byb3BlcnR5VmFsdWVEYXRhTW9kZWxPYmplY3RQYXRoLCBmaWVsZEZvcm1hdE9wdGlvbnMsIGFzT2JqZWN0KTtcblx0fVxuXHRyZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UXVpY2tWaWV3VHlwZSA9IGZ1bmN0aW9uIChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKTogc3RyaW5nIHtcblx0Y29uc3QgdGFyZ2V0T2JqZWN0ID0gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q7XG5cdGlmICh0YXJnZXRPYmplY3Q/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tdW5pY2F0aW9uPy5Jc0VtYWlsQWRkcmVzcykge1xuXHRcdHJldHVybiBcImVtYWlsXCI7XG5cdH1cblx0aWYgKHRhcmdldE9iamVjdD8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzUGhvbmVOdW1iZXIpIHtcblx0XHRyZXR1cm4gXCJwaG9uZVwiO1xuXHR9XG5cdHJldHVybiBcInRleHRcIjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTZW1hbnRpY09iamVjdEV4cHJlc3Npb25Ub1Jlc29sdmUgPSBmdW5jdGlvbiAob0Fubm90YXRpb25zOiBhbnkpOiBhbnlbXSB7XG5cdGNvbnN0IGFTZW1PYmpFeHByVG9SZXNvbHZlOiBhbnlbXSA9IFtdO1xuXHRpZiAob0Fubm90YXRpb25zKSB7XG5cdFx0Y29uc3QgYVNlbU9iamtleXMgPSBPYmplY3Qua2V5cyhvQW5ub3RhdGlvbnMpLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQgPT09IFwiU2VtYW50aWNPYmplY3RcIiB8fCBlbGVtZW50LnN0YXJ0c1dpdGgoXCJTZW1hbnRpY09iamVjdCNcIik7XG5cdFx0fSk7XG5cdFx0Zm9yIChsZXQgaVNlbU9iakNvdW50ID0gMDsgaVNlbU9iakNvdW50IDwgYVNlbU9iamtleXMubGVuZ3RoOyBpU2VtT2JqQ291bnQrKykge1xuXHRcdFx0Y29uc3Qgc1NlbU9iakV4cHJlc3Npb24gPSBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ob0Fubm90YXRpb25zW2FTZW1PYmprZXlzW2lTZW1PYmpDb3VudF1dKSk7XG5cdFx0XHRhU2VtT2JqRXhwclRvUmVzb2x2ZS5wdXNoKHtcblx0XHRcdFx0a2V5OiBzU2VtT2JqRXhwcmVzc2lvbj8uaW5kZXhPZihcIntcIikgPT09IC0xID8gc1NlbU9iakV4cHJlc3Npb24gOiBzU2VtT2JqRXhwcmVzc2lvbj8uc3BsaXQoXCJ7XCIpWzFdLnNwbGl0KFwifVwiKVswXSxcblx0XHRcdFx0dmFsdWU6IHNTZW1PYmpFeHByZXNzaW9uXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGFTZW1PYmpFeHByVG9SZXNvbHZlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNlbWFudGljT2JqZWN0cyA9IGZ1bmN0aW9uIChhU2VtT2JqRXhwclRvUmVzb2x2ZTogYW55W10pOiBhbnkge1xuXHRpZiAoYVNlbU9iakV4cHJUb1Jlc29sdmUubGVuZ3RoID4gMCkge1xuXHRcdGxldCBzQ3VzdG9tRGF0YUtleTogc3RyaW5nID0gXCJcIjtcblx0XHRsZXQgc0N1c3RvbURhdGFWYWx1ZTogYW55ID0gXCJcIjtcblx0XHRjb25zdCBhU2VtT2JqQ3VzdG9tRGF0YTogYW55W10gPSBbXTtcblx0XHRmb3IgKGxldCBpU2VtT2JqQ291bnQgPSAwOyBpU2VtT2JqQ291bnQgPCBhU2VtT2JqRXhwclRvUmVzb2x2ZS5sZW5ndGg7IGlTZW1PYmpDb3VudCsrKSB7XG5cdFx0XHRzQ3VzdG9tRGF0YUtleSA9IGFTZW1PYmpFeHByVG9SZXNvbHZlW2lTZW1PYmpDb3VudF0ua2V5O1xuXHRcdFx0c0N1c3RvbURhdGFWYWx1ZSA9IGNvbXBpbGVFeHByZXNzaW9uKGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihhU2VtT2JqRXhwclRvUmVzb2x2ZVtpU2VtT2JqQ291bnRdLnZhbHVlKSk7XG5cdFx0XHRhU2VtT2JqQ3VzdG9tRGF0YS5wdXNoKHtcblx0XHRcdFx0a2V5OiBzQ3VzdG9tRGF0YUtleSxcblx0XHRcdFx0dmFsdWU6IHNDdXN0b21EYXRhVmFsdWVcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjb25zdCBvU2VtYW50aWNPYmplY3RzTW9kZWw6IGFueSA9IG5ldyBKU09OTW9kZWwoYVNlbU9iakN1c3RvbURhdGEpO1xuXHRcdG9TZW1hbnRpY09iamVjdHNNb2RlbC4kJHZhbHVlQXNQcm9taXNlID0gdHJ1ZTtcblx0XHRjb25zdCBvU2VtT2JqQmluZGluZ0NvbnRleHQ6IGFueSA9IG9TZW1hbnRpY09iamVjdHNNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIik7XG5cdFx0cmV0dXJuIG9TZW1PYmpCaW5kaW5nQ29udGV4dDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbmV3IEpTT05Nb2RlbChbXSkuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpO1xuXHR9XG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byBnZXQgTXVsdGlwbGVMaW5lcyBmb3IgYSBEYXRhRmllbGQuXG4gKlxuICogQG5hbWUgZ2V0TXVsdGlwbGVMaW5lc0ZvckRhdGFGaWVsZFxuICogQHBhcmFtIHthbnl9IG9UaGlzIFRoZSBjdXJyZW50IG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IHNQcm9wZXJ0eVR5cGUgVGhlIHByb3BlcnR5IHR5cGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNNdWx0aUxpbmVUZXh0IFRoZSBwcm9wZXJ0eSBpc011bHRpTGluZVRleHRcbiAqIEByZXR1cm5zIHtDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+fSBUaGUgYmluZGluZyBleHByZXNzaW9uIHRvIGRldGVybWluZSBpZiBhIGRhdGEgZmllbGQgc2hvdWxkIGJlIGEgTXVsdGlMaW5lVGV4dCBvciBub3RcbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnQgY29uc3QgZ2V0TXVsdGlwbGVMaW5lc0ZvckRhdGFGaWVsZCA9IGZ1bmN0aW9uIChvVGhpczogYW55LCBzUHJvcGVydHlUeXBlOiBzdHJpbmcsIGlzTXVsdGlMaW5lVGV4dDogYm9vbGVhbik6IGFueSB7XG5cdGlmIChvVGhpcy53cmFwID09PSBcImZhbHNlXCIpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKHNQcm9wZXJ0eVR5cGUgIT09IFwiRWRtLlN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGlzTXVsdGlMaW5lVGV4dDtcblx0fVxuXHRpZiAob1RoaXMuZWRpdE1vZGUgPT09IFwiRGlzcGxheVwiKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0aWYgKG9UaGlzLmVkaXRNb2RlLmluZGV4T2YoXCJ7XCIpID4gLTEpIHtcblx0XHQvLyBJZiB0aGUgZWRpdE1vZGUgaXMgY29tcHV0ZWQgdGhlbiB3ZSBqdXN0IGNhcmUgYWJvdXQgdGhlIHBhZ2UgZWRpdE1vZGUgdG8gZGV0ZXJtaW5lIGlmIHRoZSBtdWx0aWxpbmUgcHJvcGVydHkgc2hvdWxkIGJlIHRha2VuIGludG8gYWNjb3VudFxuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihvcihub3QoVUkuSXNFZGl0YWJsZSksIGlzTXVsdGlMaW5lVGV4dCkpO1xuXHR9XG5cdHJldHVybiBpc011bHRpTGluZVRleHQ7XG59O1xuXG5leHBvcnQgY29uc3QgX2dldERyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhVHlwZSA9IGZ1bmN0aW9uIChvTWV0YU1vZGVsOiBhbnksIHNFbnRpdHlUeXBlOiBzdHJpbmcpIHtcblx0cmV0dXJuIG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChgLyR7c0VudGl0eVR5cGV9L0RyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhL2ApO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEJpbmRpbmdGb3JEcmFmdEFkbWluQmxvY2tJbmxpbmUgPSBmdW5jdGlvbiAoaUNvbnRleHQ6IGFueSwgc0VudGl0eVR5cGU6IHN0cmluZyk6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHtcblx0cmV0dXJuIF9nZXREcmFmdEFkbWluaXN0cmF0aXZlRGF0YVR5cGUoaUNvbnRleHQuZ2V0TW9kZWwoKSwgc0VudGl0eVR5cGUpLnRoZW4oZnVuY3Rpb24gKG9EQURFbnRpdHlUeXBlOiBhbnkpIHtcblx0XHRjb25zdCBhQmluZGluZ3MgPSBbXTtcblxuXHRcdGlmIChvREFERW50aXR5VHlwZS5JblByb2Nlc3NCeVVzZXJEZXNjcmlwdGlvbikge1xuXHRcdFx0YUJpbmRpbmdzLnB1c2gocGF0aEluTW9kZWwoXCJEcmFmdEFkbWluaXN0cmF0aXZlRGF0YS9JblByb2Nlc3NCeVVzZXJEZXNjcmlwdGlvblwiKSk7XG5cdFx0fVxuXG5cdFx0YUJpbmRpbmdzLnB1c2gocGF0aEluTW9kZWwoXCJEcmFmdEFkbWluaXN0cmF0aXZlRGF0YS9JblByb2Nlc3NCeVVzZXJcIikpO1xuXG5cdFx0aWYgKG9EQURFbnRpdHlUeXBlLkxhc3RDaGFuZ2VkQnlVc2VyRGVzY3JpcHRpb24pIHtcblx0XHRcdGFCaW5kaW5ncy5wdXNoKHBhdGhJbk1vZGVsKFwiRHJhZnRBZG1pbmlzdHJhdGl2ZURhdGEvTGFzdENoYW5nZWRCeVVzZXJEZXNjcmlwdGlvblwiKSk7XG5cdFx0fVxuXG5cdFx0YUJpbmRpbmdzLnB1c2gocGF0aEluTW9kZWwoXCJEcmFmdEFkbWluaXN0cmF0aXZlRGF0YS9MYXN0Q2hhbmdlZEJ5VXNlclwiKSk7XG5cblx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKHBhdGhJbk1vZGVsKFwiSGFzRHJhZnRFbnRpdHlcIiksIG9yKC4uLmFCaW5kaW5ncyksIHJlc29sdmVCaW5kaW5nU3RyaW5nKFwiXCIpKSk7XG5cdH0pO1xufTtcblxuY29uc3QgX2hhc1ZhbHVlSGVscFRvU2hvdyA9IGZ1bmN0aW9uIChvUHJvcGVydHk6IFByb3BlcnR5LCBtZWFzdXJlRGlzcGxheU1vZGU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXHQvLyB3ZSBzaG93IGEgdmFsdWUgaGVscCBpZiB0ZWggcHJvcGVydHkgaGFzIG9uZSBvciBpZiBpdHMgdmlzaWJsZSB1bml0IGhhcyBvbmVcblx0Y29uc3Qgb1Byb3BlcnR5VW5pdCA9IFByb3BlcnR5SGVscGVyLmdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KTtcblx0Y29uc3Qgb1Byb3BlcnR5Q3VycmVuY3kgPSBQcm9wZXJ0eUhlbHBlci5nZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShvUHJvcGVydHkpO1xuXHRyZXR1cm4gKFxuXHRcdChQcm9wZXJ0eUhlbHBlci5oYXNWYWx1ZUhlbHAob1Byb3BlcnR5KSAmJiBvUHJvcGVydHkudHlwZSAhPT0gXCJFZG0uQm9vbGVhblwiKSB8fFxuXHRcdChtZWFzdXJlRGlzcGxheU1vZGUgIT09IFwiSGlkZGVuXCIgJiZcblx0XHRcdCgob1Byb3BlcnR5VW5pdCAmJiBQcm9wZXJ0eUhlbHBlci5oYXNWYWx1ZUhlbHAob1Byb3BlcnR5VW5pdCkpIHx8XG5cdFx0XHRcdChvUHJvcGVydHlDdXJyZW5jeSAmJiBQcm9wZXJ0eUhlbHBlci5oYXNWYWx1ZUhlbHAob1Byb3BlcnR5Q3VycmVuY3kpKSkpXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgRWRpdCBTdHlsZSBwcm9wZXJ0aWVzIGZvciBGaWVsZCBpbiBjYXNlIG9mIE1hY3JvIEZpZWxkKEZpZWxkLm1ldGFkYXRhLnRzKSBhbmQgTWFzc0VkaXREaWFsb2cgZmllbGRzLlxuICpcbiAqIEBwYXJhbSBvUHJvcHMgRmllbGQgUHJvcGVydGllcyBmb3IgdGhlIE1hY3JvIEZpZWxkLlxuICogQHBhcmFtIG9EYXRhRmllbGQgRGF0YUZpZWxkIE9iamVjdC5cbiAqIEBwYXJhbSBvRGF0YU1vZGVsUGF0aCBEYXRhTW9kZWwgT2JqZWN0IFBhdGggdG8gdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIG9ubHlFZGl0U3R5bGUgVG8gYWRkIG9ubHkgZWRpdFN0eWxlLlxuICovXG5leHBvcnQgY29uc3Qgc2V0RWRpdFN0eWxlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChcblx0b1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsXG5cdG9EYXRhRmllbGQ6IGFueSxcblx0b0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdG9ubHlFZGl0U3R5bGU/OiBib29sZWFuXG4pOiB2b2lkIHtcblx0Y29uc3Qgb1Byb3BlcnR5ID0gb0RhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRpZiAoIVByb3BlcnR5SGVscGVyLmlzUHJvcGVydHkob1Byb3BlcnR5KSkge1xuXHRcdG9Qcm9wcy5lZGl0U3R5bGUgPSBudWxsO1xuXHRcdHJldHVybjtcblx0fVxuXHRpZiAoIW9ubHlFZGl0U3R5bGUpIHtcblx0XHRvUHJvcHMudmFsdWVCaW5kaW5nRXhwcmVzc2lvbiA9IGdldFZhbHVlQmluZGluZyhvRGF0YU1vZGVsUGF0aCwgb1Byb3BzLmZvcm1hdE9wdGlvbnMpO1xuXHR9XG5cblx0c3dpdGNoIChvRGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdFx0aWYgKG9EYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py5WaXN1YWxpemF0aW9uID09PSBcIlVJLlZpc3VhbGl6YXRpb25UeXBlL1JhdGluZ1wiKSB7XG5cdFx0XHRcdG9Qcm9wcy5lZGl0U3R5bGUgPSBcIlJhdGluZ0luZGljYXRvclwiO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGU6XG5cdFx0XHRpZiAob0RhdGFGaWVsZD8uVmlzdWFsaXphdGlvbiA9PT0gXCJVSS5WaXN1YWxpemF0aW9uVHlwZS9SYXRpbmdcIikge1xuXHRcdFx0XHRvUHJvcHMuZWRpdFN0eWxlID0gXCJSYXRpbmdJbmRpY2F0b3JcIjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGg6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRvUHJvcHMuZWRpdFN0eWxlID0gbnVsbDtcblx0XHRcdHJldHVybjtcblx0XHRkZWZhdWx0OlxuXHR9XG5cdGlmIChfaGFzVmFsdWVIZWxwVG9TaG93KG9Qcm9wZXJ0eSwgb1Byb3BzLmZvcm1hdE9wdGlvbnM/Lm1lYXN1cmVEaXNwbGF5TW9kZSkpIHtcblx0XHRpZiAoIW9ubHlFZGl0U3R5bGUpIHtcblx0XHRcdG9Qcm9wcy50ZXh0QmluZGluZ0V4cHJlc3Npb24gPSBnZXRBc3NvY2lhdGVkVGV4dEJpbmRpbmcob0RhdGFNb2RlbFBhdGgsIG9Qcm9wcy5mb3JtYXRPcHRpb25zKTtcblx0XHRcdGlmIChvUHJvcHMuZm9ybWF0T3B0aW9ucz8ubWVhc3VyZURpc3BsYXlNb2RlICE9PSBcIkhpZGRlblwiKSB7XG5cdFx0XHRcdC8vIGZvciB0aGUgTURDIEZpZWxkIHdlIG5lZWQgdG8ga2VlcCB0aGUgdW5pdCBpbnNpZGUgdGhlIHZhbHVlQmluZGluZ0V4cHJlc3Npb25cblx0XHRcdFx0b1Byb3BzLnZhbHVlQmluZGluZ0V4cHJlc3Npb24gPSBnZXRWYWx1ZUJpbmRpbmcob0RhdGFNb2RlbFBhdGgsIG9Qcm9wcy5mb3JtYXRPcHRpb25zLCBmYWxzZSwgZmFsc2UsIHVuZGVmaW5lZCwgZmFsc2UsIHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRvUHJvcHMuZWRpdFN0eWxlID0gXCJJbnB1dFdpdGhWYWx1ZUhlbHBcIjtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzd2l0Y2ggKG9Qcm9wZXJ0eS50eXBlKSB7XG5cdFx0Y2FzZSBcIkVkbS5EYXRlXCI6XG5cdFx0XHRvUHJvcHMuZWRpdFN0eWxlID0gXCJEYXRlUGlja2VyXCI7XG5cdFx0XHRyZXR1cm47XG5cdFx0Y2FzZSBcIkVkbS5UaW1lXCI6XG5cdFx0Y2FzZSBcIkVkbS5UaW1lT2ZEYXlcIjpcblx0XHRcdG9Qcm9wcy5lZGl0U3R5bGUgPSBcIlRpbWVQaWNrZXJcIjtcblx0XHRcdHJldHVybjtcblx0XHRjYXNlIFwiRWRtLkRhdGVUaW1lXCI6XG5cdFx0Y2FzZSBcIkVkbS5EYXRlVGltZU9mZnNldFwiOlxuXHRcdFx0b1Byb3BzLmVkaXRTdHlsZSA9IFwiRGF0ZVRpbWVQaWNrZXJcIjtcblx0XHRcdC8vIE5vIHRpbWV6b25lIGRlZmluZWQuIEFsc28gZm9yIGNvbXBhdGliaWxpdHkgcmVhc29ucy5cblx0XHRcdGlmICghb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRpbWV6b25lKSB7XG5cdFx0XHRcdG9Qcm9wcy5zaG93VGltZXpvbmUgPSB1bmRlZmluZWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvUHJvcHMuc2hvd1RpbWV6b25lID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHRjYXNlIFwiRWRtLkJvb2xlYW5cIjpcblx0XHRcdG9Qcm9wcy5lZGl0U3R5bGUgPSBcIkNoZWNrQm94XCI7XG5cdFx0XHRyZXR1cm47XG5cdFx0Y2FzZSBcIkVkbS5TdHJlYW1cIjpcblx0XHRcdG9Qcm9wcy5lZGl0U3R5bGUgPSBcIkZpbGVcIjtcblx0XHRcdHJldHVybjtcblx0XHRjYXNlIFwiRWRtLlN0cmluZ1wiOlxuXHRcdFx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQ/LnZhbHVlT2YoKSkge1xuXHRcdFx0XHRvUHJvcHMuZWRpdFN0eWxlID0gXCJUZXh0QXJlYVwiO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0b1Byb3BzLmVkaXRTdHlsZSA9IFwiSW5wdXRcIjtcblx0fVxuXHRpZiAob1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdCkge1xuXHRcdGlmICghb25seUVkaXRTdHlsZSkge1xuXHRcdFx0b1Byb3BzLnVuaXRCaW5kaW5nRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKFVJRm9ybWF0dGVycy5nZXRCaW5kaW5nRm9yVW5pdE9yQ3VycmVuY3kob0RhdGFNb2RlbFBhdGgpKTtcblx0XHRcdG9Qcm9wcy5kZXNjcmlwdGlvbkJpbmRpbmdFeHByZXNzaW9uID0gVUlGb3JtYXR0ZXJzLmlmVW5pdEVkaXRhYmxlKFxuXHRcdFx0XHRvUHJvcGVydHksXG5cdFx0XHRcdFwiXCIsXG5cdFx0XHRcdFVJRm9ybWF0dGVycy5nZXRCaW5kaW5nRm9yVW5pdE9yQ3VycmVuY3kob0RhdGFNb2RlbFBhdGgpXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgdW5pdFByb3BlcnR5ID1cblx0XHRcdFx0UHJvcGVydHlIZWxwZXIuZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkob1Byb3BlcnR5KSB8fCBQcm9wZXJ0eUhlbHBlci5nZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5KG9Qcm9wZXJ0eSk7XG5cdFx0XHRvUHJvcHMudW5pdEVkaXRhYmxlID0gY29tcGlsZUV4cHJlc3Npb24obm90KGlzUmVhZE9ubHlFeHByZXNzaW9uKHVuaXRQcm9wZXJ0eSkpKTtcblx0XHR9XG5cdFx0b1Byb3BzLmVkaXRTdHlsZSA9IFwiSW5wdXRXaXRoVW5pdFwiO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG9Qcm9wcy5lZGl0U3R5bGUgPSBcIklucHV0XCI7XG59O1xuXG5nZXRCaW5kaW5nRm9yRHJhZnRBZG1pbkJsb2NrSW5saW5lLnJlcXVpcmVzSUNvbnRleHQgPSB0cnVlO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQThCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNPLElBQU1BLHFDQUFxQyxHQUFHLFVBQ3BEQywwQkFEb0QsRUFFcERDLGVBRm9ELEVBR3BCO0lBQ2hDLE9BQU9DLG9CQUFvQixDQUFDRiwwQkFBRCxFQUE2QixhQUE3QixFQUE0QyxVQUFDRyxVQUFELEVBQWdCO01BQ3RGLElBQUlDLGFBQTRDLEdBQUdELFVBQW5EOztNQUNBLElBQUlBLFVBQVUsQ0FBQ0UsU0FBWCxLQUF5QkMsU0FBN0IsRUFBd0M7UUFDdkM7UUFDQSxJQUFNQyxzQkFBc0IsR0FBR0Msb0JBQW9CLENBQUNQLGVBQUQsRUFBa0JFLFVBQVUsQ0FBQ00sSUFBN0IsQ0FBbkQ7UUFDQUwsYUFBYSxHQUFHTSxnQkFBZ0IsQ0FBQ0MsNkJBQWpCLENBQStDSixzQkFBL0MsRUFBdUVKLFVBQXZFLENBQWhCO01BQ0E7O01BQ0QsT0FBT0MsYUFBUDtJQUNBLENBUjBCLENBQTNCO0VBU0EsQ0FiTTs7OztFQWVBLElBQU1RLHNCQUFzQixHQUFHLFVBQ3JDWiwwQkFEcUMsRUFFckNDLGVBRnFDLEVBR0w7SUFDaEMsT0FBT0Msb0JBQW9CLENBQUNGLDBCQUFELEVBQTZCLGFBQTdCLEVBQTRDLFVBQUNHLFVBQUQsRUFBZ0I7TUFDdEYsSUFBSUMsYUFBNEMsR0FBR0QsVUFBbkQ7O01BQ0EsSUFBSUEsVUFBVSxDQUFDRSxTQUFYLEtBQXlCQyxTQUE3QixFQUF3QztRQUN2QztRQUNBLElBQU1DLHNCQUFzQixHQUFHQyxvQkFBb0IsQ0FBQ1AsZUFBRCxFQUFrQkUsVUFBVSxDQUFDTSxJQUE3QixDQUFuRDtRQUNBTCxhQUFhLEdBQUdTLFlBQVksQ0FBQ0MseUJBQWIsQ0FB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