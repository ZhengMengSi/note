/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["./AnnotationEnum"], function (AnnotationEnum) {
  "use strict";

  var _exports = {};
  var resolveEnumValue = AnnotationEnum.resolveEnumValue;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var unresolveableExpression = {
    _type: "Unresolvable"
  };
  _exports.unresolveableExpression = unresolveableExpression;

  function escapeXmlAttribute(inputString) {
    return inputString.replace(/'/g, "\\'");
  }

  function hasUnresolveableExpression() {
    for (var _len = arguments.length, expressions = new Array(_len), _key = 0; _key < _len; _key++) {
      expressions[_key] = arguments[_key];
    }

    return expressions.find(function (expr) {
      return expr._type === "Unresolvable";
    }) !== undefined;
  }
  /**
   * Check two expressions for (deep) equality.
   *
   * @param a
   * @param b
   * @returns `true` if the two expressions are equal
   * @private
   */


  _exports.hasUnresolveableExpression = hasUnresolveableExpression;

  function _checkExpressionsAreEqual(a, b) {
    if (a._type !== b._type) {
      return false;
    }

    switch (a._type) {
      case "Unresolvable":
        return false;
      // Unresolvable is never equal to anything even itself

      case "Constant":
      case "EmbeddedBinding":
      case "EmbeddedExpressionBinding":
        return a.value === b.value;

      case "Not":
        return _checkExpressionsAreEqual(a.operand, b.operand);

      case "Truthy":
        return _checkExpressionsAreEqual(a.operand, b.operand);

      case "Set":
        return a.operator === b.operator && a.operands.length === b.operands.length && a.operands.every(function (expression) {
          return b.operands.some(function (otherExpression) {
            return _checkExpressionsAreEqual(expression, otherExpression);
          });
        });

      case "IfElse":
        return _checkExpressionsAreEqual(a.condition, b.condition) && _checkExpressionsAreEqual(a.onTrue, b.onTrue) && _checkExpressionsAreEqual(a.onFalse, b.onFalse);

      case "Comparison":
        return a.operator === b.operator && _checkExpressionsAreEqual(a.operand1, b.operand1) && _checkExpressionsAreEqual(a.operand2, b.operand2);

      case "Concat":
        var aExpressions = a.expressions;
        var bExpressions = b.expressions;

        if (aExpressions.length !== bExpressions.length) {
          return false;
        }

        return aExpressions.every(function (expression, index) {
          return _checkExpressionsAreEqual(expression, bExpressions[index]);
        });

      case "Length":
        return _checkExpressionsAreEqual(a.pathInModel, b.pathInModel);

      case "PathInModel":
        return a.modelName === b.modelName && a.path === b.path && a.targetEntitySet === b.targetEntitySet;

      case "Formatter":
        return a.fn === b.fn && a.parameters.length === b.parameters.length && a.parameters.every(function (value, index) {
          return _checkExpressionsAreEqual(b.parameters[index], value);
        });

      case "ComplexType":
        return a.type === b.type && a.bindingParameters.length === b.bindingParameters.length && a.bindingParameters.every(function (value, index) {
          return _checkExpressionsAreEqual(b.bindingParameters[index], value);
        });

      case "Function":
        var otherFunction = b;

        if (a.obj === undefined || otherFunction.obj === undefined) {
          return a.obj === otherFunction;
        }

        return a.fn === otherFunction.fn && _checkExpressionsAreEqual(a.obj, otherFunction.obj) && a.parameters.length === otherFunction.parameters.length && a.parameters.every(function (value, index) {
          return _checkExpressionsAreEqual(otherFunction.parameters[index], value);
        });

      case "Ref":
        return a.ref === b.ref;
    }

    return false;
  }
  /**
   * Converts a nested SetExpression by inlining operands of type SetExpression with the same operator.
   *
   * @param expression The expression to flatten
   * @returns A new SetExpression with the same operator
   */


  _exports._checkExpressionsAreEqual = _checkExpressionsAreEqual;

  function flattenSetExpression(expression) {
    return expression.operands.reduce(function (result, operand) {
      var candidatesForFlattening = operand._type === "Set" && operand.operator === expression.operator ? operand.operands : [operand];
      candidatesForFlattening.forEach(function (candidate) {
        if (result.operands.every(function (e) {
          return !_checkExpressionsAreEqual(e, candidate);
        })) {
          result.operands.push(candidate);
        }
      });
      return result;
    }, {
      _type: "Set",
      operator: expression.operator,
      operands: []
    });
  }
  /**
   * Detects whether an array of boolean expressions contains an expression and its negation.
   *
   * @param expressions Array of expressions
   * @returns `true` if the set of expressions contains an expression and its negation
   */


  function hasOppositeExpressions(expressions) {
    var negatedExpressions = expressions.map(not);
    return expressions.some(function (expression, index) {
      for (var i = index + 1; i < negatedExpressions.length; i++) {
        if (_checkExpressionsAreEqual(expression, negatedExpressions[i])) {
          return true;
        }
      }

      return false;
    });
  }
  /**
   * Logical `and` expression.
   *
   * The expression is simplified to false if this can be decided statically (that is, if one operand is a constant
   * false or if the expression contains an operand and its negation).
   *
   * @param operands Expressions to connect by `and`
   * @returns Expression evaluating to boolean
   */


  function and() {
    for (var _len2 = arguments.length, operands = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      operands[_key2] = arguments[_key2];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "&&",
      operands: operands.map(wrapPrimitive)
    }).operands;

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(expressions))) {
      return unresolveableExpression;
    }

    var isStaticFalse = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isFalse(expression)) {
        isStaticFalse = true;
      }

      return !isConstant(expression);
    });

    if (isStaticFalse) {
      return constant(false);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (result, expression) {
        return result && isTrue(expression);
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (hasOppositeExpressions(nonTrivialExpression)) {
      return constant(false);
    } else {
      return {
        _type: "Set",
        operator: "&&",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `or` expression.
   *
   * The expression is simplified to true if this can be decided statically (that is, if one operand is a constant
   * true or if the expression contains an operand and its negation).
   *
   * @param operands Expressions to connect by `or`
   * @returns Expression evaluating to boolean
   */


  _exports.and = and;

  function or() {
    for (var _len3 = arguments.length, operands = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      operands[_key3] = arguments[_key3];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "||",
      operands: operands.map(wrapPrimitive)
    }).operands;

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(expressions))) {
      return unresolveableExpression;
    }

    var isStaticTrue = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isTrue(expression)) {
        isStaticTrue = true;
      }

      return !isConstant(expression) || expression.value;
    });

    if (isStaticTrue) {
      return constant(true);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (result, expression) {
        return result && isTrue(expression);
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (hasOppositeExpressions(nonTrivialExpression)) {
      return constant(true);
    } else {
      return {
        _type: "Set",
        operator: "||",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `not` operator.
   *
   * @param operand The expression to reverse
   * @returns The resulting expression that evaluates to boolean
   */


  _exports.or = or;

  function not(operand) {
    operand = wrapPrimitive(operand);

    if (hasUnresolveableExpression(operand)) {
      return unresolveableExpression;
    } else if (isConstant(operand)) {
      return constant(!operand.value);
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "||" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return and.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "&&" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return or.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (isComparison(operand)) {
      // Create the reverse comparison
      switch (operand.operator) {
        case "!==":
          return _objectSpread(_objectSpread({}, operand), {}, {
            operator: "==="
          });

        case "<":
          return _objectSpread(_objectSpread({}, operand), {}, {
            operator: ">="
          });

        case "<=":
          return _objectSpread(_objectSpread({}, operand), {}, {
            operator: ">"
          });

        case "===":
          return _objectSpread(_objectSpread({}, operand), {}, {
            operator: "!=="
          });

        case ">":
          return _objectSpread(_objectSpread({}, operand), {}, {
            operator: "<="
          });

        case ">=":
          return _objectSpread(_objectSpread({}, operand), {}, {
            operator: "<"
          });
      }
    } else if (operand._type === "Not") {
      return operand.operand;
    }

    return {
      _type: "Not",
      operand: operand
    };
  }
  /**
   * Evaluates whether a binding expression is equal to true with a loose equality.
   *
   * @param operand The expression to check
   * @returns The resulting expression that evaluates to boolean
   */


  _exports.not = not;

  function isTruthy(operand) {
    if (isConstant(operand)) {
      return constant(!!operand.value);
    } else {
      return {
        _type: "Truthy",
        operand: operand
      };
    }
  }
  /**
   * Creates a binding expression that will be evaluated by the corresponding model.
   *
   * @param path
   * @param modelName
   * @param visitedNavigationPaths
   * @param pathVisitor
   * @returns An expression representating that path in the model
   * @deprecated use pathInModel instead
   */


  _exports.isTruthy = isTruthy;

  function bindingExpression(path, modelName) {
    var visitedNavigationPaths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var pathVisitor = arguments.length > 3 ? arguments[3] : undefined;
    return pathInModel(path, modelName, visitedNavigationPaths, pathVisitor);
  }
  /**
   * Creates a binding expression that will be evaluated by the corresponding model.
   *
   * @template TargetType
   * @param path The path on the model
   * @param [modelName] The name of the model
   * @param [visitedNavigationPaths] The paths from the root entitySet
   * @param [pathVisitor] A function to modify the resulting path
   * @returns An expression representating that path in the model
   */


  _exports.bindingExpression = bindingExpression;

  function pathInModel(path, modelName) {
    var visitedNavigationPaths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var pathVisitor = arguments.length > 3 ? arguments[3] : undefined;

    if (path === undefined) {
      return unresolveableExpression;
    }

    var targetPath;

    if (pathVisitor) {
      targetPath = pathVisitor(path);

      if (targetPath === undefined) {
        return unresolveableExpression;
      }
    } else {
      var localPath = visitedNavigationPaths.concat();
      localPath.push(path);
      targetPath = localPath.join("/");
    }

    return {
      _type: "PathInModel",
      modelName: modelName,
      path: targetPath
    };
  }

  _exports.pathInModel = pathInModel;

  /**
   * Creates a constant expression based on a primitive value.
   *
   * @template T
   * @param value The constant to wrap in an expression
   * @returns The constant expression
   */
  function constant(value) {
    var constantValue;

    if (typeof value === "object" && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        constantValue = value.map(wrapPrimitive);
      } else if (isPrimitiveObject(value)) {
        constantValue = value.valueOf();
      } else {
        constantValue = Object.entries(value).reduce(function (plainExpression, _ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          var wrappedValue = wrapPrimitive(val);

          if (wrappedValue._type !== "Constant" || wrappedValue.value !== undefined) {
            plainExpression[key] = wrappedValue;
          }

          return plainExpression;
        }, {});
      }
    } else {
      constantValue = value;
    }

    return {
      _type: "Constant",
      value: constantValue
    };
  }

  _exports.constant = constant;

  function resolveBindingString(value, targetType) {
    if (value !== undefined && typeof value === "string" && value.startsWith("{")) {
      if (value.startsWith("{=")) {
        // Expression binding, we can just remove the outer binding things
        return {
          _type: "EmbeddedExpressionBinding",
          value: value
        };
      } else {
        return {
          _type: "EmbeddedBinding",
          value: value
        };
      }
    } else if (targetType === "boolean" && typeof value === "string" && (value === "true" || value === "false")) {
      return constant(value === "true");
    } else if (targetType === "number" && typeof value === "string" && (!isNaN(Number(value)) || value === "NaN")) {
      return constant(Number(value));
    } else {
      return constant(value);
    }
  }
  /**
   * A named reference.
   *
   * @see fn
   * @param reference Reference
   * @returns The object reference binding part
   */


  _exports.resolveBindingString = resolveBindingString;

  function ref(reference) {
    return {
      _type: "Ref",
      ref: reference
    };
  }
  /**
   * Determine whether the type is an expression.
   *
   * Every object having a property named `_type` of some value is considered an expression, even if there is actually
   * no such expression type supported.
   *
   * @param something Type to check
   * @returns `true` if the type is considered to be an expression
   */


  _exports.ref = ref;

  function isExpression(something) {
    return something !== null && typeof something === "object" && something._type !== undefined;
  }
  /**
   * Wrap a primitive into a constant expression if it is not already an expression.
   *
   * @template T
   * @param something The object to wrap in a Constant expression
   * @returns Either the original object or the wrapped one depending on the case
   */


  function wrapPrimitive(something) {
    if (isExpression(something)) {
      return something;
    }

    return constant(something);
  }
  /**
   * Checks if the expression or value provided is constant or not.
   *
   * @template T The target type
   * @param  maybeConstant The expression or primitive value that is to be checked
   * @returns `true` if it is constant
   */


  function isConstant(maybeConstant) {
    return typeof maybeConstant !== "object" || maybeConstant._type === "Constant";
  }

  _exports.isConstant = isConstant;

  function isTrue(expression) {
    return isConstant(expression) && expression.value === true;
  }

  function isFalse(expression) {
    return isConstant(expression) && expression.value === false;
  }
  /**
   * Checks if the expression or value provided is a path in model expression or not.
   *
   * @template T The target type
   * @param  maybeBinding The expression or primitive value that is to be checked
   * @returns `true` if it is a path in model expression
   */


  function isPathInModelExpression(maybeBinding) {
    return typeof maybeBinding === "object" && maybeBinding._type === "PathInModel";
  }
  /**
   * Checks if the expression or value provided is a complex type expression.
   *
   * @template T The target type
   * @param  maybeBinding The expression or primitive value that is to be checked
   * @returns `true` if it is a path in model expression
   */


  _exports.isPathInModelExpression = isPathInModelExpression;

  function isComplexTypeExpression(maybeBinding) {
    return typeof maybeBinding === "object" && maybeBinding._type === "ComplexType";
  }
  /**
   * Checks if the expression or value provided is a concat expression or not.
   *
   * @param expression
   * @returns `true` if the expression is a ConcatExpression
   */


  _exports.isComplexTypeExpression = isComplexTypeExpression;

  function isConcatExpression(expression) {
    return typeof expression === "object" && expression._type === "Concat";
  }
  /**
   * Checks if the expression provided is a comparison or not.
   *
   * @template T The target type
   * @param expression The expression
   * @returns `true` if the expression is a ComparisonExpression
   */


  function isComparison(expression) {
    return expression._type === "Comparison";
  }

  function isPrimitiveObject(objectType) {
    switch (objectType.constructor.name) {
      case "String":
      case "Number":
      case "Boolean":
        return true;

      default:
        return false;
    }
  }
  /**
   * Check if the passed annotation annotationValue is a ComplexAnnotationExpression.
   *
   * @template T The target type
   * @param  annotationValue The annotation annotationValue to evaluate
   * @returns `true` if the object is a {ComplexAnnotationExpression}
   */


  function isComplexAnnotationExpression(annotationValue) {
    return typeof annotationValue === "object" && !isPrimitiveObject(annotationValue);
  }
  /**
   * Generate the corresponding annotationValue for a given annotation annotationValue.
   *
   * @template T The target type
   * @param annotationValue The source annotation annotationValue
   * @param visitedNavigationPaths The path from the root entity set
   * @param defaultValue Default value if the annotationValue is undefined
   * @param pathVisitor A function to modify the resulting path
   * @returns The annotationValue equivalent to that annotation annotationValue
   * @deprecated use getExpressionFromAnnotation instead
   */


  function annotationExpression(annotationValue) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var defaultValue = arguments.length > 2 ? arguments[2] : undefined;
    var pathVisitor = arguments.length > 3 ? arguments[3] : undefined;
    return getExpressionFromAnnotation(annotationValue, visitedNavigationPaths, defaultValue, pathVisitor);
  }
  /**
   * Generate the corresponding annotationValue for a given annotation annotationValue.
   *
   * @template T The target type
   * @param annotationValue The source annotation annotationValue
   * @param visitedNavigationPaths The path from the root entity set
   * @param defaultValue Default value if the annotationValue is undefined
   * @param pathVisitor A function to modify the resulting path
   * @returns The annotationValue equivalent to that annotation annotationValue
   */


  _exports.annotationExpression = annotationExpression;

  function getExpressionFromAnnotation(annotationValue) {
    var _annotationValue;

    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var defaultValue = arguments.length > 2 ? arguments[2] : undefined;
    var pathVisitor = arguments.length > 3 ? arguments[3] : undefined;

    if (annotationValue === undefined) {
      return wrapPrimitive(defaultValue);
    }

    annotationValue = (_annotationValue = annotationValue) === null || _annotationValue === void 0 ? void 0 : _annotationValue.valueOf();

    if (!isComplexAnnotationExpression(annotationValue)) {
      return constant(annotationValue);
    }

    switch (annotationValue.type) {
      case "Path":
        return pathInModel(annotationValue.path, undefined, visitedNavigationPaths, pathVisitor);

      case "If":
        return annotationIfExpression(annotationValue.If, visitedNavigationPaths, pathVisitor);

      case "Not":
        return not(parseAnnotationCondition(annotationValue.Not, visitedNavigationPaths, pathVisitor));

      case "Eq":
        return equal(parseAnnotationCondition(annotationValue.Eq[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.Eq[1], visitedNavigationPaths, pathVisitor));

      case "Ne":
        return notEqual(parseAnnotationCondition(annotationValue.Ne[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.Ne[1], visitedNavigationPaths, pathVisitor));

      case "Gt":
        return greaterThan(parseAnnotationCondition(annotationValue.Gt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.Gt[1], visitedNavigationPaths, pathVisitor));

      case "Ge":
        return greaterOrEqual(parseAnnotationCondition(annotationValue.Ge[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.Ge[1], visitedNavigationPaths, pathVisitor));

      case "Lt":
        return lessThan(parseAnnotationCondition(annotationValue.Lt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.Lt[1], visitedNavigationPaths, pathVisitor));

      case "Le":
        return lessOrEqual(parseAnnotationCondition(annotationValue.Le[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.Le[1], visitedNavigationPaths, pathVisitor));

      case "Or":
        return or.apply(void 0, _toConsumableArray(annotationValue.Or.map(function (orCondition) {
          return parseAnnotationCondition(orCondition, visitedNavigationPaths, pathVisitor);
        })));

      case "And":
        return and.apply(void 0, _toConsumableArray(annotationValue.And.map(function (andCondition) {
          return parseAnnotationCondition(andCondition, visitedNavigationPaths, pathVisitor);
        })));

      case "Apply":
        return annotationApplyExpression(annotationValue, visitedNavigationPaths, pathVisitor);
    }

    return unresolveableExpression;
  }
  /**
   * Parse the annotation condition into an expression.
   *
   * @template T The target type
   * @param annotationValue The condition or value from the annotation
   * @param visitedNavigationPaths The path from the root entity set
   * @param pathVisitor A function to modify the resulting path
   * @returns An equivalent expression
   */


  _exports.getExpressionFromAnnotation = getExpressionFromAnnotation;

  function parseAnnotationCondition(annotationValue) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathVisitor = arguments.length > 2 ? arguments[2] : undefined;

    if (annotationValue === null || typeof annotationValue !== "object") {
      return constant(annotationValue);
    } else if (annotationValue.hasOwnProperty("$Or")) {
      return or.apply(void 0, _toConsumableArray(annotationValue.$Or.map(function (orCondition) {
        return parseAnnotationCondition(orCondition, visitedNavigationPaths, pathVisitor);
      })));
    } else if (annotationValue.hasOwnProperty("$And")) {
      return and.apply(void 0, _toConsumableArray(annotationValue.$And.map(function (andCondition) {
        return parseAnnotationCondition(andCondition, visitedNavigationPaths, pathVisitor);
      })));
    } else if (annotationValue.hasOwnProperty("$Not")) {
      return not(parseAnnotationCondition(annotationValue.$Not, visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Eq")) {
      return equal(parseAnnotationCondition(annotationValue.$Eq[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Eq[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Ne")) {
      return notEqual(parseAnnotationCondition(annotationValue.$Ne[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Ne[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Gt")) {
      return greaterThan(parseAnnotationCondition(annotationValue.$Gt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Gt[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Ge")) {
      return greaterOrEqual(parseAnnotationCondition(annotationValue.$Ge[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Ge[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Lt")) {
      return lessThan(parseAnnotationCondition(annotationValue.$Lt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Lt[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Le")) {
      return lessOrEqual(parseAnnotationCondition(annotationValue.$Le[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Le[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Path")) {
      return pathInModel(annotationValue.$Path, undefined, visitedNavigationPaths, pathVisitor);
    } else if (annotationValue.hasOwnProperty("$Apply")) {
      return getExpressionFromAnnotation({
        type: "Apply",
        Function: annotationValue.$Function,
        Apply: annotationValue.$Apply
      }, visitedNavigationPaths, undefined, pathVisitor);
    } else if (annotationValue.hasOwnProperty("$If")) {
      return getExpressionFromAnnotation({
        type: "If",
        If: annotationValue.$If
      }, visitedNavigationPaths, undefined, pathVisitor);
    } else if (annotationValue.hasOwnProperty("$EnumMember")) {
      return constant(resolveEnumValue(annotationValue.$EnumMember));
    }

    return constant(false);
  }
  /**
   * Process the {IfAnnotationExpressionValue} into an expression.
   *
   * @template T The target type
   * @param annotationValue An If expression returning the type T
   * @param visitedNavigationPaths The path from the root entity set
   * @param pathVisitor A function to modify the resulting path
   * @returns The equivalent ifElse expression
   */


  function annotationIfExpression(annotationValue) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathVisitor = arguments.length > 2 ? arguments[2] : undefined;
    return ifElse(parseAnnotationCondition(annotationValue[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue[1], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue[2], visitedNavigationPaths, pathVisitor));
  }

  _exports.annotationIfExpression = annotationIfExpression;

  function annotationApplyExpression(applyExpression) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathVisitor = arguments.length > 2 ? arguments[2] : undefined;

    switch (applyExpression.Function) {
      case "odata.concat":
        return concat.apply(void 0, _toConsumableArray(applyExpression.Apply.map(function (applyParam) {
          var applyParamConverted = applyParam;

          if (applyParam.hasOwnProperty("$Path")) {
            applyParamConverted = {
              type: "Path",
              path: applyParam.$Path
            };
          } else if (applyParam.hasOwnProperty("$If")) {
            applyParamConverted = {
              type: "If",
              If: applyParam.$If
            };
          } else if (applyParam.hasOwnProperty("$Apply")) {
            applyParamConverted = {
              type: "Apply",
              Function: applyParam.$Function,
              Apply: applyParam.$Apply
            };
          }

          return getExpressionFromAnnotation(applyParamConverted, visitedNavigationPaths, undefined, pathVisitor);
        })));
    }

    return unresolveableExpression;
  }
  /**
   * Generic helper for the comparison operations (equal, notEqual, ...).
   *
   * @template T The target type
   * @param operator The operator to apply
   * @param leftOperand The operand on the left side of the operator
   * @param rightOperand The operand on the right side of the operator
   * @returns An expression representing the comparison
   */


  _exports.annotationApplyExpression = annotationApplyExpression;

  function comparison(operator, leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (hasUnresolveableExpression(leftExpression, rightExpression)) {
      return unresolveableExpression;
    }

    if (isConstant(leftExpression) && isConstant(rightExpression)) {
      switch (operator) {
        case "!==":
          return constant(leftExpression.value !== rightExpression.value);

        case "<":
          return constant(leftExpression.value < rightExpression.value);

        case "<=":
          return constant(leftExpression.value <= rightExpression.value);

        case ">":
          return constant(leftExpression.value > rightExpression.value);

        case ">=":
          return constant(leftExpression.value >= rightExpression.value);

        case "===":
          return constant(leftExpression.value === rightExpression.value);
      }
    } else {
      return {
        _type: "Comparison",
        operator: operator,
        operand1: leftExpression,
        operand2: rightExpression
      };
    }
  }

  function length(expression) {
    if (expression._type === "Unresolvable") {
      return expression;
    }

    return {
      _type: "Length",
      pathInModel: expression
    };
  }
  /**
   * Comparison: "equal" (===).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns An expression representing the comparison
   */


  _exports.length = length;

  function equal(leftOperand, rightOperand) {
    var _reduce;

    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (hasUnresolveableExpression(leftExpression, rightExpression)) {
      return unresolveableExpression;
    }

    if (_checkExpressionsAreEqual(leftExpression, rightExpression)) {
      return constant(true);
    }

    function reduce(left, right) {
      if (left._type === "Comparison" && isTrue(right)) {
        // compare(a, b) === true ~~> compare(a, b)
        return left;
      } else if (left._type === "Comparison" && isFalse(right)) {
        // compare(a, b) === false ~~> !compare(a, b)
        return not(left);
      } else if (left._type === "IfElse" && _checkExpressionsAreEqual(left.onTrue, right)) {
        // (if (x) { a } else { b }) === a ~~> x || (b === a)
        return or(left.condition, equal(left.onFalse, right));
      } else if (left._type === "IfElse" && _checkExpressionsAreEqual(left.onFalse, right)) {
        // (if (x) { a } else { b }) === b ~~> !x || (a === b)
        return or(not(left.condition), equal(left.onTrue, right));
      } else if (left._type === "IfElse" && isConstant(left.onTrue) && isConstant(left.onFalse) && isConstant(right) && !_checkExpressionsAreEqual(left.onTrue, right) && !_checkExpressionsAreEqual(left.onFalse, right)) {
        return constant(false);
      }

      return undefined;
    } // exploit symmetry: a === b <~> b === a


    var reduced = (_reduce = reduce(leftExpression, rightExpression)) !== null && _reduce !== void 0 ? _reduce : reduce(rightExpression, leftExpression);
    return reduced !== null && reduced !== void 0 ? reduced : comparison("===", leftExpression, rightExpression);
  }
  /**
   * Comparison: "not equal" (!==).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns An expression representing the comparison
   */


  _exports.equal = equal;

  function notEqual(leftOperand, rightOperand) {
    return not(equal(leftOperand, rightOperand));
  }
  /**
   * Comparison: "greater or equal" (>=).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns An expression representing the comparison
   */


  _exports.notEqual = notEqual;

  function greaterOrEqual(leftOperand, rightOperand) {
    return comparison(">=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "greater than" (>).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns An expression representing the comparison
   */


  _exports.greaterOrEqual = greaterOrEqual;

  function greaterThan(leftOperand, rightOperand) {
    return comparison(">", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less or equal" (<=).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns An expression representing the comparison
   */


  _exports.greaterThan = greaterThan;

  function lessOrEqual(leftOperand, rightOperand) {
    return comparison("<=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less than" (<).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns An expression representing the comparison
   */


  _exports.lessOrEqual = lessOrEqual;

  function lessThan(leftOperand, rightOperand) {
    return comparison("<", leftOperand, rightOperand);
  }
  /**
   * If-then-else expression.
   *
   * Evaluates to onTrue if the condition evaluates to true, else evaluates to onFalse.
   *
   * @template T The target type
   * @param condition The condition to evaluate
   * @param onTrue Expression result if the condition evaluates to true
   * @param onFalse Expression result if the condition evaluates to false
   * @returns The expression that represents this conditional check
   */


  _exports.lessThan = lessThan;

  function ifElse(condition, onTrue, onFalse) {
    var conditionExpression = wrapPrimitive(condition);
    var onTrueExpression = wrapPrimitive(onTrue);
    var onFalseExpression = wrapPrimitive(onFalse);

    if (hasUnresolveableExpression(conditionExpression, onTrueExpression, onFalseExpression)) {
      return unresolveableExpression;
    } // swap branches if the condition is a negation


    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref3 = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref3[0];
      onFalseExpression = _ref3[1];
      conditionExpression = not(conditionExpression);
    } // inline nested if-else expressions: onTrue branch
    // ifElse(X, ifElse(X, a, b), c) ==> ifElse(X, a, c)


    if (onTrueExpression._type === "IfElse" && _checkExpressionsAreEqual(conditionExpression, onTrueExpression.condition)) {
      onTrueExpression = onTrueExpression.onTrue;
    } // inline nested if-else expressions: onFalse branch
    // ifElse(X, a, ifElse(X, b, c)) ==> ifElse(X, a, c)


    if (onFalseExpression._type === "IfElse" && _checkExpressionsAreEqual(conditionExpression, onFalseExpression.condition)) {
      onFalseExpression = onFalseExpression.onFalse;
    } // (if true then a else b)  ~~> a
    // (if false then a else b) ~~> b


    if (isConstant(conditionExpression)) {
      return conditionExpression.value ? onTrueExpression : onFalseExpression;
    } // if (isConstantBoolean(onTrueExpression) || isConstantBoolean(onFalseExpression)) {
    // 	return or(and(condition, onTrueExpression as Expression<boolean>), and(not(condition), onFalseExpression as Expression<boolean>)) as Expression<T>
    // }
    // (if X then a else a) ~~> a


    if (_checkExpressionsAreEqual(onTrueExpression, onFalseExpression)) {
      return onTrueExpression;
    } // if X then a else false ~~> X && a


    if (isFalse(onFalseExpression)) {
      return and(conditionExpression, onTrueExpression);
    } // if X then a else true ~~> !X || a


    if (isTrue(onFalseExpression)) {
      return or(not(conditionExpression), onTrueExpression);
    } // if X then false else a ~~> !X && a


    if (isFalse(onTrueExpression)) {
      return and(not(conditionExpression), onFalseExpression);
    } // if X then true else a ~~> X || a


    if (isTrue(onTrueExpression)) {
      return or(conditionExpression, onFalseExpression);
    }

    if (isComplexTypeExpression(condition) || isComplexTypeExpression(onTrue) || isComplexTypeExpression(onFalse)) {
      var pathIdx = 0;
      var myIfElseExpression = formatResult([condition, onTrue, onFalse], "sap.fe.core.formatters.StandardFormatter#ifElse");
      var allParts = [];
      transformRecursively(myIfElseExpression, "PathInModel", function (constantPath) {
        allParts.push(constantPath);
        return pathInModel("$".concat(pathIdx++), "$");
      }, true);
      allParts.unshift(constant(JSON.stringify(myIfElseExpression)));
      return formatResult(allParts, "sap.fe.core.formatters.StandardFormatter#evaluateComplexExpression", undefined, true);
    }

    return {
      _type: "IfElse",
      condition: conditionExpression,
      onTrue: onTrueExpression,
      onFalse: onFalseExpression
    };
  }
  /**
   * Checks whether the current expression has a reference to the default model (undefined).
   *
   * @param expression The expression to evaluate
   * @returns `true` if there is a reference to the default context
   */


  _exports.ifElse = ifElse;

  function hasReferenceToDefaultContext(expression) {
    switch (expression._type) {
      case "Constant":
      case "Formatter":
      case "ComplexType":
        return false;

      case "Set":
        return expression.operands.some(hasReferenceToDefaultContext);

      case "PathInModel":
        return expression.modelName === undefined;

      case "Comparison":
        return hasReferenceToDefaultContext(expression.operand1) || hasReferenceToDefaultContext(expression.operand2);

      case "IfElse":
        return hasReferenceToDefaultContext(expression.condition) || hasReferenceToDefaultContext(expression.onTrue) || hasReferenceToDefaultContext(expression.onFalse);

      case "Not":
      case "Truthy":
        return hasReferenceToDefaultContext(expression.operand);

      default:
        return false;
    }
  }

  /**
   * Calls a formatter function to process the parameters.
   * If requireContext is set to true and no context is passed a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters The list of parameter that should match the type and number of the formatter function
   * @param formatterFunction The function to call
   * @param [contextEntityType] The context entity type to consider
   * @param [ignoreComplexType] Whether to ignore the transgformation to the StandardFormatter or not
   * @returns The corresponding expression
   */
  function formatResult(parameters, formatterFunction, contextEntityType) {
    var ignoreComplexType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var parameterExpressions = parameters.map(wrapPrimitive);

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(parameterExpressions))) {
      return unresolveableExpression;
    }

    if (contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(pathInModel(key.name, ""));
        });
      }
    }

    var functionName = "";

    if (typeof formatterFunction === "string") {
      functionName = formatterFunction;
    } else {
      functionName = formatterFunction.__functionName;
    } // FormatterName can be of format sap.fe.core.xxx#methodName to have multiple formatter in one class


    var _functionName$split = functionName.split("#"),
        _functionName$split2 = _slicedToArray(_functionName$split, 2),
        formatterClass = _functionName$split2[0],
        formatterName = _functionName$split2[1]; // In some case we also cannot call directly a function because of too complex input, in that case we need to convert to a simpler function call


    if (!ignoreComplexType && (parameterExpressions.some(isComplexTypeExpression) || parameterExpressions.some(isConcatExpression))) {
      var pathIdx = 0;
      var myFormatExpression = formatResult(parameterExpressions, functionName, undefined, true);
      var allParts = [];
      transformRecursively(myFormatExpression, "PathInModel", function (constantPath) {
        allParts.push(constantPath);
        return pathInModel("$".concat(pathIdx++), "$");
      });
      allParts.unshift(constant(JSON.stringify(myFormatExpression)));
      return formatResult(allParts, "sap.fe.core.formatters.StandardFormatter#evaluateComplexExpression", undefined, true);
    } else if (!!formatterName && formatterName.length > 0) {
      parameterExpressions.unshift(constant(formatterName));
    }

    return {
      _type: "Formatter",
      fn: formatterClass,
      parameters: parameterExpressions
    };
  }
  /**
   * Calls a complex type to process the parameters.
   * If requireContext is set to true and no context is passed, a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters The list of parameters that should match the type for the complex type=
   * @param type The complex type to use
   * @param [contextEntityType] The context entity type to consider
   * @param oFormatOptions
   * @returns The corresponding expression
   */


  _exports.formatResult = formatResult;

  function addTypeInformation(parameters, type, contextEntityType, oFormatOptions) {
    var _parameters$, _parameters$$type, _parameters$2, _parameters$2$type, _parameters$3, _parameters$3$type;

    var parameterExpressions = parameters.map(wrapPrimitive);

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(parameterExpressions))) {
      return unresolveableExpression;
    } // If there is only one parameter and it is a constant and we don't expect the context then return the constant


    if (parameterExpressions.length === 1 && isConstant(parameterExpressions[0]) && !contextEntityType) {
      return parameterExpressions[0];
    } else if (contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(pathInModel(key.name, ""));
        });
      }
    } // if showMeasure is set to false we want to not parse as string to see the 0
    // we do that also for all bindings because otherwise the mdc Field isn't editable


    if (!(oFormatOptions && oFormatOptions.showNumber === false) && (((_parameters$ = parameters[0]) === null || _parameters$ === void 0 ? void 0 : (_parameters$$type = _parameters$.type) === null || _parameters$$type === void 0 ? void 0 : _parameters$$type.indexOf("sap.ui.model.odata.type.Int")) === 0 || ((_parameters$2 = parameters[0]) === null || _parameters$2 === void 0 ? void 0 : (_parameters$2$type = _parameters$2.type) === null || _parameters$2$type === void 0 ? void 0 : _parameters$2$type.indexOf("sap.ui.model.odata.type.Decimal")) === 0 || ((_parameters$3 = parameters[0]) === null || _parameters$3 === void 0 ? void 0 : (_parameters$3$type = _parameters$3.type) === null || _parameters$3$type === void 0 ? void 0 : _parameters$3$type.indexOf("sap.ui.model.odata.type.Double")) === 0)) {
      var _parameters$4, _parameters$5;

      if (((_parameters$4 = parameters[0]) === null || _parameters$4 === void 0 ? void 0 : _parameters$4.type) === "sap.ui.model.odata.type.Int64" || ((_parameters$5 = parameters[0]) === null || _parameters$5 === void 0 ? void 0 : _parameters$5.type) === "sap.ui.model.odata.type.Decimal") {
        var _oFormatOptions;

        //sap.ui.model.odata.type.Int64 do not support parseAsString false
        oFormatOptions = ((_oFormatOptions = oFormatOptions) === null || _oFormatOptions === void 0 ? void 0 : _oFormatOptions.showMeasure) === false ? {
          emptyString: "",
          showMeasure: false
        } : {
          emptyString: ""
        };
      } else {
        var _oFormatOptions2;

        oFormatOptions = ((_oFormatOptions2 = oFormatOptions) === null || _oFormatOptions2 === void 0 ? void 0 : _oFormatOptions2.showMeasure) === false ? {
          parseAsString: false,
          emptyString: "",
          showMeasure: false
        } : {
          parseAsString: false,
          emptyString: ""
        };
      }
    }

    if (type === "sap.ui.model.odata.type.Unit") {
      var uomPath = pathInModel("/##@@requestUnitsOfMeasure");
      uomPath.targetType = "any";
      uomPath.mode = "OneTime";
      parameterExpressions.push(uomPath);
    } else if (type === "sap.ui.model.odata.type.Currency") {
      var currencyPath = pathInModel("/##@@requestCurrencyCodes");
      currencyPath.targetType = "any";
      currencyPath.mode = "OneTime";
      parameterExpressions.push(currencyPath);
    }

    return {
      _type: "ComplexType",
      type: type,
      formatOptions: oFormatOptions || {},
      parameters: {},
      bindingParameters: parameterExpressions
    };
  }
  /**
   * Function call, optionally with arguments.
   *
   * @param func Function name or reference to function
   * @param parameters Arguments
   * @param on Object to call the function on
   * @returns Expression representing the function call (not the result of the function call!)
   */


  _exports.addTypeInformation = addTypeInformation;

  function fn(func, parameters, on) {
    var functionName = typeof func === "string" ? func : func.__functionName;
    return {
      _type: "Function",
      obj: on !== undefined ? wrapPrimitive(on) : undefined,
      fn: functionName,
      parameters: parameters.map(wrapPrimitive)
    };
  }
  /**
   * Shortcut function to determine if a binding value is null, undefined or empty.
   *
   * @param expression
   * @returns A Boolean expression evaluating the fact that the current element is empty
   */


  _exports.fn = fn;

  function isEmpty(expression) {
    var aBindings = [];
    transformRecursively(expression, "PathInModel", function (expr) {
      aBindings.push(or(equal(expr, ""), equal(expr, undefined), equal(expr, null)));
      return expr;
    });
    return and.apply(void 0, aBindings);
  }

  _exports.isEmpty = isEmpty;

  function concat() {
    for (var _len4 = arguments.length, inExpressions = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      inExpressions[_key4] = arguments[_key4];
    }

    var expressions = inExpressions.map(wrapPrimitive);

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(expressions))) {
      return unresolveableExpression;
    }

    if (expressions.every(isConstant)) {
      return constant(expressions.reduce(function (concatenated, value) {
        if (value.value !== undefined) {
          return concatenated + value.value.toString();
        }

        return concatenated;
      }, ""));
    } else if (expressions.some(isComplexTypeExpression)) {
      var pathIdx = 0;
      var myConcatExpression = formatResult(expressions, "sap.fe.core.formatters.StandardFormatter#concat", undefined, true);
      var allParts = [];
      transformRecursively(myConcatExpression, "PathInModel", function (constantPath) {
        allParts.push(constantPath);
        return pathInModel("$".concat(pathIdx++), "$");
      });
      allParts.unshift(constant(JSON.stringify(myConcatExpression)));
      return formatResult(allParts, "sap.fe.core.formatters.StandardFormatter#evaluateComplexExpression", undefined, true);
    }

    return {
      _type: "Concat",
      expressions: expressions
    };
  }

  _exports.concat = concat;

  function transformRecursively(inExpression, expressionType, transformFunction) {
    var includeAllExpression = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var expression = inExpression;

    switch (expression._type) {
      case "Function":
      case "Formatter":
        expression.parameters = expression.parameters.map(function (parameter) {
          return transformRecursively(parameter, expressionType, transformFunction, includeAllExpression);
        });
        break;

      case "Concat":
        expression.expressions = expression.expressions.map(function (subExpression) {
          return transformRecursively(subExpression, expressionType, transformFunction, includeAllExpression);
        });
        expression = concat.apply(void 0, _toConsumableArray(expression.expressions));
        break;

      case "ComplexType":
        expression.bindingParameters = expression.bindingParameters.map(function (bindingParameter) {
          return transformRecursively(bindingParameter, expressionType, transformFunction, includeAllExpression);
        });
        break;

      case "IfElse":
        var onTrue = transformRecursively(expression.onTrue, expressionType, transformFunction, includeAllExpression);
        var onFalse = transformRecursively(expression.onFalse, expressionType, transformFunction, includeAllExpression);
        var condition = expression.condition;

        if (includeAllExpression) {
          condition = transformRecursively(expression.condition, expressionType, transformFunction, includeAllExpression);
        }

        expression = ifElse(condition, onTrue, onFalse);
        break;

      case "Not":
        if (includeAllExpression) {
          var operand = transformRecursively(expression.operand, expressionType, transformFunction, includeAllExpression);
          expression = not(operand);
        }

        break;

      case "Truthy":
        break;

      case "Set":
        if (includeAllExpression) {
          var operands = expression.operands.map(function (operand) {
            return transformRecursively(operand, expressionType, transformFunction, includeAllExpression);
          });
          expression = expression.operator === "||" ? or.apply(void 0, _toConsumableArray(operands)) : and.apply(void 0, _toConsumableArray(operands));
        }

        break;

      case "Comparison":
        if (includeAllExpression) {
          var operand1 = transformRecursively(expression.operand1, expressionType, transformFunction, includeAllExpression);
          var operand2 = transformRecursively(expression.operand2, expressionType, transformFunction, includeAllExpression);
          expression = comparison(expression.operator, operand1, operand2);
        }

        break;

      case "Ref":
      case "Length":
      case "PathInModel":
      case "Constant":
      case "EmbeddedBinding":
      case "EmbeddedExpressionBinding":
      case "Unresolvable":
        // Do nothing
        break;
    }

    if (expressionType === expression._type) {
      expression = transformFunction(inExpression);
    }

    return expression;
  }

  _exports.transformRecursively = transformRecursively;

  var needParenthesis = function (expr) {
    return !isConstant(expr) && !isPathInModelExpression(expr) && isExpression(expr) && expr._type !== "IfElse" && expr._type !== "Function";
  };
  /**
   * Compiles a constant object to a string.
   *
   * @param expr
   * @param isNullable
   * @returns The compiled string
   */


  function compileConstantObject(expr) {
    var isNullable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (isNullable && Object.keys(expr.value).length === 0) {
      return "";
    } // Objects


    var o = expr.value;
    var properties = [];
    Object.keys(o).forEach(function (key) {
      var value = o[key];
      var childResult = compileExpression(value, true, false, isNullable);

      if (childResult && childResult.length > 0) {
        properties.push("".concat(key, ": ").concat(childResult));
      }
    });
    return "{".concat(properties.join(", "), "}");
  }
  /**
   * Compiles a Constant Binding Expression.
   *
   * @param expr
   * @param embeddedInBinding
   * @param isNullable
   * @param doNotStringify
   * @returns The compiled string
   */


  function compileConstant(expr, embeddedInBinding) {
    var isNullable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var doNotStringify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (expr.value === null) {
      return doNotStringify ? null : "null";
    }

    if (expr.value === undefined) {
      return doNotStringify ? undefined : "undefined";
    }

    if (typeof expr.value === "object") {
      if (Array.isArray(expr.value)) {
        var entries = expr.value.map(function (expression) {
          return compileExpression(expression, true);
        });
        return "[".concat(entries.join(", "), "]");
      } else {
        return compileConstantObject(expr, isNullable);
      }
    }

    if (embeddedInBinding) {
      switch (typeof expr.value) {
        case "number":
        case "bigint":
        case "boolean":
          return expr.value.toString();

        case "string":
          return "'".concat(escapeXmlAttribute(expr.value.toString()), "'");

        default:
          return "";
      }
    } else {
      return doNotStringify ? expr.value : expr.value.toString();
    }
  }
  /**
   * Generates the binding string for a Binding expression.
   *
   * @param expressionForBinding The expression to compile
   * @param embeddedInBinding Whether the expression to compile is embedded into another expression
   * @param embeddedSeparator The binding value evaluator ($ or % depending on whether we want to force the type or not)
   * @returns The corresponding expression binding
   */


  _exports.compileConstant = compileConstant;

  function compilePathInModelExpression(expressionForBinding, embeddedInBinding, embeddedSeparator) {
    if (expressionForBinding.type || expressionForBinding.parameters || expressionForBinding.targetType || expressionForBinding.formatOptions || expressionForBinding.constraints) {
      // This is now a complex binding definition, let's prepare for it
      var complexBindingDefinition = {
        path: compilePathInModel(expressionForBinding),
        type: expressionForBinding.type,
        targetType: expressionForBinding.targetType,
        parameters: expressionForBinding.parameters,
        formatOptions: expressionForBinding.formatOptions,
        constraints: expressionForBinding.constraints
      };
      var outBinding = compileExpression(complexBindingDefinition, false, false, true);

      if (embeddedInBinding) {
        return "".concat(embeddedSeparator).concat(outBinding);
      }

      return outBinding;
    } else if (embeddedInBinding) {
      return "".concat(embeddedSeparator, "{").concat(compilePathInModel(expressionForBinding), "}");
    } else {
      return "{".concat(compilePathInModel(expressionForBinding), "}");
    }
  }

  function compileComplexTypeExpression(expression) {
    if (expression.bindingParameters.length === 1) {
      return "{".concat(compilePathParameter(expression.bindingParameters[0], true), ", type: '").concat(expression.type, "'}");
    }

    var outputEnd = "], type: '".concat(expression.type, "'");

    if (hasElements(expression.formatOptions)) {
      outputEnd += ", formatOptions: ".concat(compileExpression(expression.formatOptions));
    }

    if (hasElements(expression.parameters)) {
      outputEnd += ", parameters: ".concat(compileExpression(expression.parameters));
    }

    outputEnd += "}";
    return "{mode:'TwoWay', parts:[".concat(expression.bindingParameters.map(function (param) {
      return compilePathParameter(param);
    }).join(",")).concat(outputEnd);
  }
  /**
   * Wrap the compiled binding string as required dependening on its context.
   *
   * @param expression The compiled expression
   * @param embeddedInBinding True if the compiled expression is to be embedded in a binding
   * @param parenthesisRequired True if the embedded binding needs to be wrapped in parethesis so that it is evaluated as one
   * @returns Finalized compiled expression
   */


  function wrapBindingExpression(expression, embeddedInBinding) {
    var parenthesisRequired = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (embeddedInBinding) {
      if (parenthesisRequired) {
        return "(".concat(expression, ")");
      } else {
        return expression;
      }
    } else {
      return "{= ".concat(expression, "}");
    }
  }
  /**
   * Compile an expression into an expression binding.
   *
   * @template T The target type
   * @param expression The expression to compile
   * @param embeddedInBinding Whether the expression to compile is embedded into another expression
   * @param keepTargetType Keep the target type of the embedded bindings instead of casting them to any
   * @param isNullable Whether binding expression can resolve to empty string or not
   * @returns The corresponding expression binding
   */


  function compileExpression(expression) {
    var embeddedInBinding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var keepTargetType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isNullable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var expr = wrapPrimitive(expression);
    var embeddedSeparator = keepTargetType ? "$" : "%";

    switch (expr._type) {
      case "Unresolvable":
        return undefined;

      case "Constant":
        return compileConstant(expr, embeddedInBinding, isNullable);

      case "Ref":
        return expr.ref || "null";

      case "Function":
        var argumentString = "".concat(expr.parameters.map(function (arg) {
          return compileExpression(arg, true);
        }).join(", "));
        return expr.obj === undefined ? "".concat(expr.fn, "(").concat(argumentString, ")") : "".concat(compileExpression(expr.obj, true), ".").concat(expr.fn, "(").concat(argumentString, ")");

      case "EmbeddedExpressionBinding":
        return embeddedInBinding ? "(".concat(expr.value.substr(2, expr.value.length - 3), ")") : "".concat(expr.value);

      case "EmbeddedBinding":
        return embeddedInBinding ? "".concat(embeddedSeparator).concat(expr.value) : "".concat(expr.value);

      case "PathInModel":
        return compilePathInModelExpression(expr, embeddedInBinding, embeddedSeparator);

      case "Comparison":
        var comparisonExpression = compileComparisonExpression(expr);
        return wrapBindingExpression(comparisonExpression, embeddedInBinding);

      case "IfElse":
        var ifElseExpression = "".concat(compileExpression(expr.condition, true), " ? ").concat(compileExpression(expr.onTrue, true), " : ").concat(compileExpression(expr.onFalse, true));
        return wrapBindingExpression(ifElseExpression, embeddedInBinding, true);

      case "Set":
        var setExpression = expr.operands.map(function (operand) {
          return compileExpression(operand, true);
        }).join(" ".concat(expr.operator, " "));
        return wrapBindingExpression(setExpression, embeddedInBinding, true);

      case "Concat":
        var concatExpression = expr.expressions.map(function (nestedExpression) {
          return compileExpression(nestedExpression, true, true);
        }).join(" + ");
        return wrapBindingExpression(concatExpression, embeddedInBinding);

      case "Length":
        var lengthExpression = "".concat(compileExpression(expr.pathInModel, true), ".length");
        return wrapBindingExpression(lengthExpression, embeddedInBinding);

      case "Not":
        var notExpression = "!".concat(compileExpression(expr.operand, true));
        return wrapBindingExpression(notExpression, embeddedInBinding);

      case "Truthy":
        var truthyExpression = "!!".concat(compileExpression(expr.operand, true));
        return wrapBindingExpression(truthyExpression, embeddedInBinding);

      case "Formatter":
        var formatterExpression = compileFormatterExpression(expr);
        return embeddedInBinding ? "$".concat(formatterExpression) : formatterExpression;

      case "ComplexType":
        var complexTypeExpression = compileComplexTypeExpression(expr);
        return embeddedInBinding ? "$".concat(complexTypeExpression) : complexTypeExpression;

      default:
        return "";
    }
  }
  /**
   * Compile a comparison expression.
   *
   * @param expression The comparison expression.
   * @returns The compiled expression. Needs wrapping before it can be used as an expression binding.
   */


  _exports.compileExpression = compileExpression;

  function compileComparisonExpression(expression) {
    function compileOperand(operand) {
      var _compileExpression;

      var compiledOperand = (_compileExpression = compileExpression(operand, true)) !== null && _compileExpression !== void 0 ? _compileExpression : "undefined";
      return wrapBindingExpression(compiledOperand, true, needParenthesis(operand));
    }

    return "".concat(compileOperand(expression.operand1), " ").concat(expression.operator, " ").concat(compileOperand(expression.operand2));
  }
  /**
   * Compile a formatter expression.
   *
   * @param expression The formatter expression.
   * @returns The compiled expression.
   */


  function compileFormatterExpression(expression) {
    if (expression.parameters.length === 1) {
      return "{".concat(compilePathParameter(expression.parameters[0], true), ", formatter: '").concat(expression.fn, "'}");
    } else {
      var parts = expression.parameters.map(function (param) {
        if (param._type === "ComplexType") {
          return compileComplexTypeExpression(param);
        } else {
          return compilePathParameter(param);
        }
      });
      return "{parts: [".concat(parts.join(", "), "], formatter: '").concat(expression.fn, "'}");
    }
  }
  /**
   * Compile the path parameter of a formatter call.
   *
   * @param expression The binding part to evaluate
   * @param singlePath Whether there is one or multiple path to consider
   * @returns The string snippet to include in the overall binding definition
   */


  function compilePathParameter(expression) {
    var singlePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var outValue = "";

    if (expression._type === "Constant") {
      if (expression.value === undefined) {
        // Special case otherwise the JSTokenizer complains about incorrect content
        outValue = "value: 'undefined'";
      } else {
        outValue = "value: ".concat(compileConstant(expression, true));
      }
    } else if (expression._type === "PathInModel") {
      outValue = "path: '".concat(compilePathInModel(expression), "'");
      outValue += expression.type ? ", type: '".concat(expression.type, "'") : ", targetType: 'any'";

      if (hasElements(expression.mode)) {
        outValue += ", mode: '".concat(compileExpression(expression.mode), "'");
      }

      if (hasElements(expression.constraints)) {
        outValue += ", constraints: ".concat(compileExpression(expression.constraints));
      }

      if (hasElements(expression.formatOptions)) {
        outValue += ", formatOptions: ".concat(compileExpression(expression.formatOptions));
      }

      if (hasElements(expression.parameters)) {
        outValue += ", parameters: ".concat(compileExpression(expression.parameters));
      }
    } else {
      return "";
    }

    return singlePath ? outValue : "{".concat(outValue, "}");
  }

  function hasElements(obj) {
    return obj && Object.keys(obj).length > 0;
  }
  /**
   * Compile a binding expression path.
   *
   * @param expression The expression to compile.
   * @returns The compiled path.
   */


  function compilePathInModel(expression) {
    return "".concat(expression.modelName ? "".concat(expression.modelName, ">") : "").concat(expression.path);
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1bnJlc29sdmVhYmxlRXhwcmVzc2lvbiIsIl90eXBlIiwiZXNjYXBlWG1sQXR0cmlidXRlIiwiaW5wdXRTdHJpbmciLCJyZXBsYWNlIiwiaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24iLCJleHByZXNzaW9ucyIsImZpbmQiLCJleHByIiwidW5kZWZpbmVkIiwiX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbCIsImEiLCJiIiwidmFsdWUiLCJvcGVyYW5kIiwib3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlbmd0aCIsImV2ZXJ5IiwiZXhwcmVzc2lvbiIsInNvbWUiLCJvdGhlckV4cHJlc3Npb24iLCJjb25kaXRpb24iLCJvblRydWUiLCJvbkZhbHNlIiwib3BlcmFuZDEiLCJvcGVyYW5kMiIsImFFeHByZXNzaW9ucyIsImJFeHByZXNzaW9ucyIsImluZGV4IiwicGF0aEluTW9kZWwiLCJtb2RlbE5hbWUiLCJwYXRoIiwidGFyZ2V0RW50aXR5U2V0IiwiZm4iLCJwYXJhbWV0ZXJzIiwidHlwZSIsImJpbmRpbmdQYXJhbWV0ZXJzIiwib3RoZXJGdW5jdGlvbiIsIm9iaiIsInJlZiIsImZsYXR0ZW5TZXRFeHByZXNzaW9uIiwicmVkdWNlIiwicmVzdWx0IiwiY2FuZGlkYXRlc0ZvckZsYXR0ZW5pbmciLCJmb3JFYWNoIiwiY2FuZGlkYXRlIiwiZSIsInB1c2giLCJoYXNPcHBvc2l0ZUV4cHJlc3Npb25zIiwibmVnYXRlZEV4cHJlc3Npb25zIiwibWFwIiwibm90IiwiaSIsImFuZCIsIndyYXBQcmltaXRpdmUiLCJpc1N0YXRpY0ZhbHNlIiwibm9uVHJpdmlhbEV4cHJlc3Npb24iLCJmaWx0ZXIiLCJpc0ZhbHNlIiwiaXNDb25zdGFudCIsImNvbnN0YW50IiwiaXNWYWxpZCIsImlzVHJ1ZSIsIm9yIiwiaXNTdGF0aWNUcnVlIiwiaXNDb21wYXJpc29uIiwiaXNUcnV0aHkiLCJiaW5kaW5nRXhwcmVzc2lvbiIsInZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMiLCJwYXRoVmlzaXRvciIsInRhcmdldFBhdGgiLCJsb2NhbFBhdGgiLCJjb25jYXQiLCJqb2luIiwiY29uc3RhbnRWYWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImlzUHJpbWl0aXZlT2JqZWN0IiwidmFsdWVPZiIsIk9iamVjdCIsImVudHJpZXMiLCJwbGFpbkV4cHJlc3Npb24iLCJrZXkiLCJ2YWwiLCJ3cmFwcGVkVmFsdWUiLCJyZXNvbHZlQmluZGluZ1N0cmluZyIsInRhcmdldFR5cGUiLCJzdGFydHNXaXRoIiwiaXNOYU4iLCJOdW1iZXIiLCJyZWZlcmVuY2UiLCJpc0V4cHJlc3Npb24iLCJzb21ldGhpbmciLCJtYXliZUNvbnN0YW50IiwiaXNQYXRoSW5Nb2RlbEV4cHJlc3Npb24iLCJtYXliZUJpbmRpbmciLCJpc0NvbXBsZXhUeXBlRXhwcmVzc2lvbiIsImlzQ29uY2F0RXhwcmVzc2lvbiIsIm9iamVjdFR5cGUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJpc0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbiIsImFubm90YXRpb25WYWx1ZSIsImFubm90YXRpb25FeHByZXNzaW9uIiwiZGVmYXVsdFZhbHVlIiwiZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uIiwiYW5ub3RhdGlvbklmRXhwcmVzc2lvbiIsIklmIiwicGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uIiwiTm90IiwiZXF1YWwiLCJFcSIsIm5vdEVxdWFsIiwiTmUiLCJncmVhdGVyVGhhbiIsIkd0IiwiZ3JlYXRlck9yRXF1YWwiLCJHZSIsImxlc3NUaGFuIiwiTHQiLCJsZXNzT3JFcXVhbCIsIkxlIiwiT3IiLCJvckNvbmRpdGlvbiIsIkFuZCIsImFuZENvbmRpdGlvbiIsImFubm90YXRpb25BcHBseUV4cHJlc3Npb24iLCJoYXNPd25Qcm9wZXJ0eSIsIiRPciIsIiRBbmQiLCIkTm90IiwiJEVxIiwiJE5lIiwiJEd0IiwiJEdlIiwiJEx0IiwiJExlIiwiJFBhdGgiLCJGdW5jdGlvbiIsIiRGdW5jdGlvbiIsIkFwcGx5IiwiJEFwcGx5IiwiJElmIiwicmVzb2x2ZUVudW1WYWx1ZSIsIiRFbnVtTWVtYmVyIiwiaWZFbHNlIiwiYXBwbHlFeHByZXNzaW9uIiwiYXBwbHlQYXJhbSIsImFwcGx5UGFyYW1Db252ZXJ0ZWQiLCJjb21wYXJpc29uIiwibGVmdE9wZXJhbmQiLCJyaWdodE9wZXJhbmQiLCJsZWZ0RXhwcmVzc2lvbiIsInJpZ2h0RXhwcmVzc2lvbiIsImxlZnQiLCJyaWdodCIsInJlZHVjZWQiLCJjb25kaXRpb25FeHByZXNzaW9uIiwib25UcnVlRXhwcmVzc2lvbiIsIm9uRmFsc2VFeHByZXNzaW9uIiwicGF0aElkeCIsIm15SWZFbHNlRXhwcmVzc2lvbiIsImZvcm1hdFJlc3VsdCIsImFsbFBhcnRzIiwidHJhbnNmb3JtUmVjdXJzaXZlbHkiLCJjb25zdGFudFBhdGgiLCJ1bnNoaWZ0IiwiSlNPTiIsInN0cmluZ2lmeSIsImhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQiLCJmb3JtYXR0ZXJGdW5jdGlvbiIsImNvbnRleHRFbnRpdHlUeXBlIiwiaWdub3JlQ29tcGxleFR5cGUiLCJwYXJhbWV0ZXJFeHByZXNzaW9ucyIsImtleXMiLCJmdW5jdGlvbk5hbWUiLCJfX2Z1bmN0aW9uTmFtZSIsInNwbGl0IiwiZm9ybWF0dGVyQ2xhc3MiLCJmb3JtYXR0ZXJOYW1lIiwibXlGb3JtYXRFeHByZXNzaW9uIiwiYWRkVHlwZUluZm9ybWF0aW9uIiwib0Zvcm1hdE9wdGlvbnMiLCJzaG93TnVtYmVyIiwiaW5kZXhPZiIsInNob3dNZWFzdXJlIiwiZW1wdHlTdHJpbmciLCJwYXJzZUFzU3RyaW5nIiwidW9tUGF0aCIsIm1vZGUiLCJjdXJyZW5jeVBhdGgiLCJmb3JtYXRPcHRpb25zIiwiZnVuYyIsIm9uIiwiaXNFbXB0eSIsImFCaW5kaW5ncyIsImluRXhwcmVzc2lvbnMiLCJjb25jYXRlbmF0ZWQiLCJ0b1N0cmluZyIsIm15Q29uY2F0RXhwcmVzc2lvbiIsImluRXhwcmVzc2lvbiIsImV4cHJlc3Npb25UeXBlIiwidHJhbnNmb3JtRnVuY3Rpb24iLCJpbmNsdWRlQWxsRXhwcmVzc2lvbiIsInBhcmFtZXRlciIsInN1YkV4cHJlc3Npb24iLCJiaW5kaW5nUGFyYW1ldGVyIiwibmVlZFBhcmVudGhlc2lzIiwiY29tcGlsZUNvbnN0YW50T2JqZWN0IiwiaXNOdWxsYWJsZSIsIm8iLCJwcm9wZXJ0aWVzIiwiY2hpbGRSZXN1bHQiLCJjb21waWxlRXhwcmVzc2lvbiIsImNvbXBpbGVDb25zdGFudCIsImVtYmVkZGVkSW5CaW5kaW5nIiwiZG9Ob3RTdHJpbmdpZnkiLCJjb21waWxlUGF0aEluTW9kZWxFeHByZXNzaW9uIiwiZXhwcmVzc2lvbkZvckJpbmRpbmciLCJlbWJlZGRlZFNlcGFyYXRvciIsImNvbnN0cmFpbnRzIiwiY29tcGxleEJpbmRpbmdEZWZpbml0aW9uIiwiY29tcGlsZVBhdGhJbk1vZGVsIiwib3V0QmluZGluZyIsImNvbXBpbGVDb21wbGV4VHlwZUV4cHJlc3Npb24iLCJjb21waWxlUGF0aFBhcmFtZXRlciIsIm91dHB1dEVuZCIsImhhc0VsZW1lbnRzIiwicGFyYW0iLCJ3cmFwQmluZGluZ0V4cHJlc3Npb24iLCJwYXJlbnRoZXNpc1JlcXVpcmVkIiwia2VlcFRhcmdldFR5cGUiLCJhcmd1bWVudFN0cmluZyIsImFyZyIsInN1YnN0ciIsImNvbXBhcmlzb25FeHByZXNzaW9uIiwiY29tcGlsZUNvbXBhcmlzb25FeHByZXNzaW9uIiwiaWZFbHNlRXhwcmVzc2lvbiIsInNldEV4cHJlc3Npb24iLCJjb25jYXRFeHByZXNzaW9uIiwibmVzdGVkRXhwcmVzc2lvbiIsImxlbmd0aEV4cHJlc3Npb24iLCJub3RFeHByZXNzaW9uIiwidHJ1dGh5RXhwcmVzc2lvbiIsImZvcm1hdHRlckV4cHJlc3Npb24iLCJjb21waWxlRm9ybWF0dGVyRXhwcmVzc2lvbiIsImNvbXBsZXhUeXBlRXhwcmVzc2lvbiIsImNvbXBpbGVPcGVyYW5kIiwiY29tcGlsZWRPcGVyYW5kIiwicGFydHMiLCJzaW5nbGVQYXRoIiwib3V0VmFsdWUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkJpbmRpbmdUb29sa2l0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcblx0QW5kQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdEFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0QXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0Q29uZGl0aW9uYWxDaGVja09yVmFsdWUsXG5cdEVudGl0eVNldCxcblx0RW50aXR5VHlwZSxcblx0RXFBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0RXFDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdEdlQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdEdlQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRHdEFubm90YXRpb25FeHByZXNzaW9uLFxuXHRHdENvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0SWZBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0SWZBbm5vdGF0aW9uRXhwcmVzc2lvblZhbHVlLFxuXHRMZUFubm90YXRpb25FeHByZXNzaW9uLFxuXHRMZUNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0THRBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0THRDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdE5lQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdE5lQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHROb3RBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0Tm90Q29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRPckFubm90YXRpb25FeHByZXNzaW9uLFxuXHRPckNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0UGF0aEFubm90YXRpb25FeHByZXNzaW9uLFxuXHRQYXRoQ29uZGl0aW9uRXhwcmVzc2lvbixcblx0UHJvcGVydHlBbm5vdGF0aW9uVmFsdWVcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyByZXNvbHZlRW51bVZhbHVlIH0gZnJvbSBcIi4vQW5ub3RhdGlvbkVudW1cIjtcblxudHlwZSBQcmltaXRpdmVUeXBlID0gc3RyaW5nIHwgbnVtYmVyIHwgYmlnaW50IHwgYm9vbGVhbiB8IG9iamVjdCB8IG51bGwgfCB1bmRlZmluZWQ7XG50eXBlIFByaW1pdGl2ZVR5cGVDYXN0PFA+ID1cblx0fCAoUCBleHRlbmRzIEJvb2xlYW4gPyBib29sZWFuIDogbmV2ZXIpXG5cdHwgKFAgZXh0ZW5kcyBOdW1iZXIgPyBudW1iZXIgOiBuZXZlcilcblx0fCAoUCBleHRlbmRzIFN0cmluZyA/IHN0cmluZyA6IG5ldmVyKVxuXHR8IFA7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG50eXBlIEJhc2VFeHByZXNzaW9uPFQ+ID0ge1xuXHRfdHlwZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQ29uc3RhbnRFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkNvbnN0YW50XCI7XG5cdHZhbHVlOiBUO1xufTtcblxudHlwZSBTZXRPcGVyYXRvciA9IFwiJiZcIiB8IFwifHxcIjtcbmV4cG9ydCB0eXBlIFNldEV4cHJlc3Npb24gPSBCYXNlRXhwcmVzc2lvbjxib29sZWFuPiAmIHtcblx0X3R5cGU6IFwiU2V0XCI7XG5cdG9wZXJhdG9yOiBTZXRPcGVyYXRvcjtcblx0b3BlcmFuZHM6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPltdO1xufTtcblxuZXhwb3J0IHR5cGUgTm90RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJOb3RcIjtcblx0b3BlcmFuZDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+O1xufTtcblxuZXhwb3J0IHR5cGUgVHJ1dGh5RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJUcnV0aHlcIjtcblx0b3BlcmFuZDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz47XG59O1xuXG5leHBvcnQgdHlwZSBSZWZlcmVuY2VFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248b2JqZWN0PiAmIHtcblx0X3R5cGU6IFwiUmVmXCI7XG5cdHJlZjogc3RyaW5nIHwgbnVsbDtcbn07XG5cbmV4cG9ydCB0eXBlIEZvcm1hdHRlckV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiRm9ybWF0dGVyXCI7XG5cdGZuOiBzdHJpbmc7XG5cdHBhcmFtZXRlcnM6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+W107XG59O1xuXG50eXBlIENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJDb21wbGV4VHlwZVwiO1xuXHR0eXBlOiBzdHJpbmc7XG5cdGZvcm1hdE9wdGlvbnM6IGFueTtcblx0cGFyYW1ldGVyczogb2JqZWN0O1xuXHRiaW5kaW5nUGFyYW1ldGVyczogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT5bXTtcbn07XG5cbmV4cG9ydCB0eXBlIEZ1bmN0aW9uRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJGdW5jdGlvblwiO1xuXHRvYmo/OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248b2JqZWN0Pjtcblx0Zm46IHN0cmluZztcblx0cGFyYW1ldGVyczogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT5bXTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbmNhdEV4cHJlc3Npb24gPSBCYXNlRXhwcmVzc2lvbjxzdHJpbmc+ICYge1xuXHRfdHlwZTogXCJDb25jYXRcIjtcblx0ZXhwcmVzc2lvbnM6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+W107XG59O1xuXG5leHBvcnQgdHlwZSBMZW5ndGhFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248c3RyaW5nPiAmIHtcblx0X3R5cGU6IFwiTGVuZ3RoXCI7XG5cdHBhdGhJbk1vZGVsOiBQYXRoSW5Nb2RlbEV4cHJlc3Npb248YW55Pjtcbn07XG5cbnR5cGUgVW5yZXNvbHZlYWJsZVBhdGhFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248c3RyaW5nPiAmIHtcblx0X3R5cGU6IFwiVW5yZXNvbHZhYmxlXCI7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIFBhdGhJbk1vZGVsRXhwcmVzc2lvblxuICovXG5leHBvcnQgdHlwZSBQYXRoSW5Nb2RlbEV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiUGF0aEluTW9kZWxcIjtcblx0bW9kZWxOYW1lPzogc3RyaW5nO1xuXHRwYXRoOiBzdHJpbmc7XG5cdHRhcmdldEVudGl0eVNldD86IEVudGl0eVNldDtcblx0dHlwZT86IHN0cmluZztcblx0Y29uc3RyYWludHM/OiBhbnk7XG5cdHBhcmFtZXRlcnM/OiBhbnk7XG5cdHRhcmdldFR5cGU/OiBzdHJpbmc7XG5cdG1vZGU/OiBzdHJpbmc7XG5cdGZvcm1hdE9wdGlvbnM/OiBhbnk7XG59O1xuXG5leHBvcnQgdHlwZSBFbWJlZGRlZFVJNUJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkVtYmVkZGVkQmluZGluZ1wiO1xuXHR2YWx1ZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgRW1iZWRkZWRVSTVFeHByZXNzaW9uQmluZGluZ0V4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiO1xuXHR2YWx1ZTogc3RyaW5nO1xufTtcblxudHlwZSBDb21wYXJpc29uT3BlcmF0b3IgPSBcIj09PVwiIHwgXCIhPT1cIiB8IFwiPj1cIiB8IFwiPlwiIHwgXCI8PVwiIHwgXCI8XCI7XG5leHBvcnQgdHlwZSBDb21wYXJpc29uRXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJDb21wYXJpc29uXCI7XG5cdG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3I7XG5cdG9wZXJhbmQxOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55Pjtcblx0b3BlcmFuZDI6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+O1xufTtcblxuZXhwb3J0IHR5cGUgSWZFbHNlRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJJZkVsc2VcIjtcblx0Y29uZGl0aW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj47XG5cdG9uVHJ1ZTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHRvbkZhbHNlOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG59O1xuXG4vKipcbiAqIEFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdHlwZSBULlxuICpcbiAqIEB0eXBlZGVmIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvblxuICovXG5leHBvcnQgdHlwZSBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD4gPVxuXHR8IFVucmVzb2x2ZWFibGVQYXRoRXhwcmVzc2lvblxuXHR8IENvbnN0YW50RXhwcmVzc2lvbjxUPlxuXHR8IFNldEV4cHJlc3Npb25cblx0fCBOb3RFeHByZXNzaW9uXG5cdHwgVHJ1dGh5RXhwcmVzc2lvblxuXHR8IENvbmNhdEV4cHJlc3Npb25cblx0fCBMZW5ndGhFeHByZXNzaW9uXG5cdHwgUGF0aEluTW9kZWxFeHByZXNzaW9uPFQ+XG5cdHwgRW1iZWRkZWRVSTVCaW5kaW5nRXhwcmVzc2lvbjxUPlxuXHR8IEVtYmVkZGVkVUk1RXhwcmVzc2lvbkJpbmRpbmdFeHByZXNzaW9uPFQ+XG5cdHwgQ29tcGFyaXNvbkV4cHJlc3Npb25cblx0fCBJZkVsc2VFeHByZXNzaW9uPFQ+XG5cdHwgRm9ybWF0dGVyRXhwcmVzc2lvbjxUPlxuXHR8IENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPlxuXHR8IFJlZmVyZW5jZUV4cHJlc3Npb25cblx0fCBGdW5jdGlvbkV4cHJlc3Npb248VD47XG5cbi8qKlxuICogQW4gZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byB0eXBlIFQsIG9yIGEgY29uc3RhbnQgdmFsdWUgb2YgdHlwZSBUXG4gKi9cbnR5cGUgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPiA9IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPiB8IFQ7XG5cbmV4cG9ydCBjb25zdCB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjogVW5yZXNvbHZlYWJsZVBhdGhFeHByZXNzaW9uID0ge1xuXHRfdHlwZTogXCJVbnJlc29sdmFibGVcIlxufTtcblxuZnVuY3Rpb24gZXNjYXBlWG1sQXR0cmlidXRlKGlucHV0U3RyaW5nOiBzdHJpbmcpIHtcblx0cmV0dXJuIGlucHV0U3RyaW5nLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKC4uLmV4cHJlc3Npb25zOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PltdKTogYm9vbGVhbiB7XG5cdHJldHVybiBleHByZXNzaW9ucy5maW5kKChleHByKSA9PiBleHByLl90eXBlID09PSBcIlVucmVzb2x2YWJsZVwiKSAhPT0gdW5kZWZpbmVkO1xufVxuLyoqXG4gKiBDaGVjayB0d28gZXhwcmVzc2lvbnMgZm9yIChkZWVwKSBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0gYVxuICogQHBhcmFtIGJcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgdHdvIGV4cHJlc3Npb25zIGFyZSBlcXVhbFxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWw8VD4oYTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+LCBiOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD4pOiBib29sZWFuIHtcblx0aWYgKGEuX3R5cGUgIT09IGIuX3R5cGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRzd2l0Y2ggKGEuX3R5cGUpIHtcblx0XHRjYXNlIFwiVW5yZXNvbHZhYmxlXCI6XG5cdFx0XHRyZXR1cm4gZmFsc2U7IC8vIFVucmVzb2x2YWJsZSBpcyBuZXZlciBlcXVhbCB0byBhbnl0aGluZyBldmVuIGl0c2VsZlxuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdGNhc2UgXCJFbWJlZGRlZEJpbmRpbmdcIjpcblx0XHRjYXNlIFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiOlxuXHRcdFx0cmV0dXJuIGEudmFsdWUgPT09IChiIGFzIENvbnN0YW50RXhwcmVzc2lvbjxUPikudmFsdWU7XG5cblx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRyZXR1cm4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLm9wZXJhbmQsIChiIGFzIE5vdEV4cHJlc3Npb24pLm9wZXJhbmQpO1xuXHRcdGNhc2UgXCJUcnV0aHlcIjpcblx0XHRcdHJldHVybiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGEub3BlcmFuZCwgKGIgYXMgVHJ1dGh5RXhwcmVzc2lvbikub3BlcmFuZCk7XG5cdFx0Y2FzZSBcIlNldFwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS5vcGVyYXRvciA9PT0gKGIgYXMgU2V0RXhwcmVzc2lvbikub3BlcmF0b3IgJiZcblx0XHRcdFx0YS5vcGVyYW5kcy5sZW5ndGggPT09IChiIGFzIFNldEV4cHJlc3Npb24pLm9wZXJhbmRzLmxlbmd0aCAmJlxuXHRcdFx0XHRhLm9wZXJhbmRzLmV2ZXJ5KChleHByZXNzaW9uKSA9PlxuXHRcdFx0XHRcdChiIGFzIFNldEV4cHJlc3Npb24pLm9wZXJhbmRzLnNvbWUoKG90aGVyRXhwcmVzc2lvbikgPT4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChleHByZXNzaW9uLCBvdGhlckV4cHJlc3Npb24pKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIklmRWxzZVwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0X2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLmNvbmRpdGlvbiwgKGIgYXMgSWZFbHNlRXhwcmVzc2lvbjxUPikuY29uZGl0aW9uKSAmJlxuXHRcdFx0XHRfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGEub25UcnVlLCAoYiBhcyBJZkVsc2VFeHByZXNzaW9uPFQ+KS5vblRydWUpICYmXG5cdFx0XHRcdF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoYS5vbkZhbHNlLCAoYiBhcyBJZkVsc2VFeHByZXNzaW9uPFQ+KS5vbkZhbHNlKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm9wZXJhdG9yID09PSAoYiBhcyBDb21wYXJpc29uRXhwcmVzc2lvbikub3BlcmF0b3IgJiZcblx0XHRcdFx0X2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLm9wZXJhbmQxLCAoYiBhcyBDb21wYXJpc29uRXhwcmVzc2lvbikub3BlcmFuZDEpICYmXG5cdFx0XHRcdF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoYS5vcGVyYW5kMiwgKGIgYXMgQ29tcGFyaXNvbkV4cHJlc3Npb24pLm9wZXJhbmQyKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJDb25jYXRcIjpcblx0XHRcdGNvbnN0IGFFeHByZXNzaW9ucyA9IGEuZXhwcmVzc2lvbnM7XG5cdFx0XHRjb25zdCBiRXhwcmVzc2lvbnMgPSAoYiBhcyBDb25jYXRFeHByZXNzaW9uKS5leHByZXNzaW9ucztcblx0XHRcdGlmIChhRXhwcmVzc2lvbnMubGVuZ3RoICE9PSBiRXhwcmVzc2lvbnMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhRXhwcmVzc2lvbnMuZXZlcnkoKGV4cHJlc3Npb24sIGluZGV4KSA9PiB7XG5cdFx0XHRcdHJldHVybiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGV4cHJlc3Npb24sIGJFeHByZXNzaW9uc1tpbmRleF0pO1xuXHRcdFx0fSk7XG5cblx0XHRjYXNlIFwiTGVuZ3RoXCI6XG5cdFx0XHRyZXR1cm4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLnBhdGhJbk1vZGVsLCAoYiBhcyBMZW5ndGhFeHByZXNzaW9uKS5wYXRoSW5Nb2RlbCk7XG5cblx0XHRjYXNlIFwiUGF0aEluTW9kZWxcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEubW9kZWxOYW1lID09PSAoYiBhcyBQYXRoSW5Nb2RlbEV4cHJlc3Npb248VD4pLm1vZGVsTmFtZSAmJlxuXHRcdFx0XHRhLnBhdGggPT09IChiIGFzIFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxUPikucGF0aCAmJlxuXHRcdFx0XHRhLnRhcmdldEVudGl0eVNldCA9PT0gKGIgYXMgUGF0aEluTW9kZWxFeHByZXNzaW9uPFQ+KS50YXJnZXRFbnRpdHlTZXRcblx0XHRcdCk7XG5cblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLmZuID09PSAoYiBhcyBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KS5mbiAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMubGVuZ3RoID09PSAoYiBhcyBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KS5wYXJhbWV0ZXJzLmxlbmd0aCAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbCgoYiBhcyBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KS5wYXJhbWV0ZXJzW2luZGV4XSwgdmFsdWUpKVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiQ29tcGxleFR5cGVcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEudHlwZSA9PT0gKGIgYXMgQ29tcGxleFR5cGVFeHByZXNzaW9uPFQ+KS50eXBlICYmXG5cdFx0XHRcdGEuYmluZGluZ1BhcmFtZXRlcnMubGVuZ3RoID09PSAoYiBhcyBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4pLmJpbmRpbmdQYXJhbWV0ZXJzLmxlbmd0aCAmJlxuXHRcdFx0XHRhLmJpbmRpbmdQYXJhbWV0ZXJzLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+XG5cdFx0XHRcdFx0X2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbCgoYiBhcyBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4pLmJpbmRpbmdQYXJhbWV0ZXJzW2luZGV4XSwgdmFsdWUpXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0Y2FzZSBcIkZ1bmN0aW9uXCI6XG5cdFx0XHRjb25zdCBvdGhlckZ1bmN0aW9uID0gYiBhcyBGdW5jdGlvbkV4cHJlc3Npb248VD47XG5cdFx0XHRpZiAoYS5vYmogPT09IHVuZGVmaW5lZCB8fCBvdGhlckZ1bmN0aW9uLm9iaiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBhLm9iaiA9PT0gb3RoZXJGdW5jdGlvbjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS5mbiA9PT0gb3RoZXJGdW5jdGlvbi5mbiAmJlxuXHRcdFx0XHRfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGEub2JqLCBvdGhlckZ1bmN0aW9uLm9iaikgJiZcblx0XHRcdFx0YS5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gb3RoZXJGdW5jdGlvbi5wYXJhbWV0ZXJzLmxlbmd0aCAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChvdGhlckZ1bmN0aW9uLnBhcmFtZXRlcnNbaW5kZXhdLCB2YWx1ZSkpXG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIlJlZlwiOlxuXHRcdFx0cmV0dXJuIGEucmVmID09PSAoYiBhcyBSZWZlcmVuY2VFeHByZXNzaW9uKS5yZWY7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgbmVzdGVkIFNldEV4cHJlc3Npb24gYnkgaW5saW5pbmcgb3BlcmFuZHMgb2YgdHlwZSBTZXRFeHByZXNzaW9uIHdpdGggdGhlIHNhbWUgb3BlcmF0b3IuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gZmxhdHRlblxuICogQHJldHVybnMgQSBuZXcgU2V0RXhwcmVzc2lvbiB3aXRoIHRoZSBzYW1lIG9wZXJhdG9yXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW5TZXRFeHByZXNzaW9uKGV4cHJlc3Npb246IFNldEV4cHJlc3Npb24pOiBTZXRFeHByZXNzaW9uIHtcblx0cmV0dXJuIGV4cHJlc3Npb24ub3BlcmFuZHMucmVkdWNlKFxuXHRcdChyZXN1bHQ6IFNldEV4cHJlc3Npb24sIG9wZXJhbmQpID0+IHtcblx0XHRcdGNvbnN0IGNhbmRpZGF0ZXNGb3JGbGF0dGVuaW5nID1cblx0XHRcdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJiBvcGVyYW5kLm9wZXJhdG9yID09PSBleHByZXNzaW9uLm9wZXJhdG9yID8gb3BlcmFuZC5vcGVyYW5kcyA6IFtvcGVyYW5kXTtcblx0XHRcdGNhbmRpZGF0ZXNGb3JGbGF0dGVuaW5nLmZvckVhY2goKGNhbmRpZGF0ZSkgPT4ge1xuXHRcdFx0XHRpZiAocmVzdWx0Lm9wZXJhbmRzLmV2ZXJ5KChlKSA9PiAhX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChlLCBjYW5kaWRhdGUpKSkge1xuXHRcdFx0XHRcdHJlc3VsdC5vcGVyYW5kcy5wdXNoKGNhbmRpZGF0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LFxuXHRcdHsgX3R5cGU6IFwiU2V0XCIsIG9wZXJhdG9yOiBleHByZXNzaW9uLm9wZXJhdG9yLCBvcGVyYW5kczogW10gfVxuXHQpO1xufVxuXG4vKipcbiAqIERldGVjdHMgd2hldGhlciBhbiBhcnJheSBvZiBib29sZWFuIGV4cHJlc3Npb25zIGNvbnRhaW5zIGFuIGV4cHJlc3Npb24gYW5kIGl0cyBuZWdhdGlvbi5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbnMgQXJyYXkgb2YgZXhwcmVzc2lvbnNcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgc2V0IG9mIGV4cHJlc3Npb25zIGNvbnRhaW5zIGFuIGV4cHJlc3Npb24gYW5kIGl0cyBuZWdhdGlvblxuICovXG5mdW5jdGlvbiBoYXNPcHBvc2l0ZUV4cHJlc3Npb25zKGV4cHJlc3Npb25zOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5bXSk6IGJvb2xlYW4ge1xuXHRjb25zdCBuZWdhdGVkRXhwcmVzc2lvbnMgPSBleHByZXNzaW9ucy5tYXAobm90KTtcblx0cmV0dXJuIGV4cHJlc3Npb25zLnNvbWUoKGV4cHJlc3Npb24sIGluZGV4KSA9PiB7XG5cdFx0Zm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IG5lZ2F0ZWRFeHByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoZXhwcmVzc2lvbiwgbmVnYXRlZEV4cHJlc3Npb25zW2ldKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBMb2dpY2FsIGBhbmRgIGV4cHJlc3Npb24uXG4gKlxuICogVGhlIGV4cHJlc3Npb24gaXMgc2ltcGxpZmllZCB0byBmYWxzZSBpZiB0aGlzIGNhbiBiZSBkZWNpZGVkIHN0YXRpY2FsbHkgKHRoYXQgaXMsIGlmIG9uZSBvcGVyYW5kIGlzIGEgY29uc3RhbnRcbiAqIGZhbHNlIG9yIGlmIHRoZSBleHByZXNzaW9uIGNvbnRhaW5zIGFuIG9wZXJhbmQgYW5kIGl0cyBuZWdhdGlvbikuXG4gKlxuICogQHBhcmFtIG9wZXJhbmRzIEV4cHJlc3Npb25zIHRvIGNvbm5lY3QgYnkgYGFuZGBcbiAqIEByZXR1cm5zIEV4cHJlc3Npb24gZXZhbHVhdGluZyB0byBib29sZWFuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmQoLi4ub3BlcmFuZHM6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPltdKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgZXhwcmVzc2lvbnMgPSBmbGF0dGVuU2V0RXhwcmVzc2lvbih7XG5cdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0b3BlcmF0b3I6IFwiJiZcIixcblx0XHRvcGVyYW5kczogb3BlcmFuZHMubWFwKHdyYXBQcmltaXRpdmUpXG5cdH0pLm9wZXJhbmRzO1xuXG5cdGlmIChoYXNVbnJlc29sdmVhYmxlRXhwcmVzc2lvbiguLi5leHByZXNzaW9ucykpIHtcblx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdH1cblx0bGV0IGlzU3RhdGljRmFsc2UgPSBmYWxzZTtcblx0Y29uc3Qgbm9uVHJpdmlhbEV4cHJlc3Npb24gPSBleHByZXNzaW9ucy5maWx0ZXIoKGV4cHJlc3Npb24pID0+IHtcblx0XHRpZiAoaXNGYWxzZShleHByZXNzaW9uKSkge1xuXHRcdFx0aXNTdGF0aWNGYWxzZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAhaXNDb25zdGFudChleHByZXNzaW9uKTtcblx0fSk7XG5cdGlmIChpc1N0YXRpY0ZhbHNlKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDApIHtcblx0XHQvLyBSZXNvbHZlIHRoZSBjb25zdGFudCB0aGVuXG5cdFx0Y29uc3QgaXNWYWxpZCA9IGV4cHJlc3Npb25zLnJlZHVjZSgocmVzdWx0LCBleHByZXNzaW9uKSA9PiByZXN1bHQgJiYgaXNUcnVlKGV4cHJlc3Npb24pLCB0cnVlKTtcblx0XHRyZXR1cm4gY29uc3RhbnQoaXNWYWxpZCk7XG5cdH0gZWxzZSBpZiAobm9uVHJpdmlhbEV4cHJlc3Npb24ubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIG5vblRyaXZpYWxFeHByZXNzaW9uWzBdO1xuXHR9IGVsc2UgaWYgKGhhc09wcG9zaXRlRXhwcmVzc2lvbnMobm9uVHJpdmlhbEV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0XHRvcGVyYXRvcjogXCImJlwiLFxuXHRcdFx0b3BlcmFuZHM6IG5vblRyaXZpYWxFeHByZXNzaW9uXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIExvZ2ljYWwgYG9yYCBleHByZXNzaW9uLlxuICpcbiAqIFRoZSBleHByZXNzaW9uIGlzIHNpbXBsaWZpZWQgdG8gdHJ1ZSBpZiB0aGlzIGNhbiBiZSBkZWNpZGVkIHN0YXRpY2FsbHkgKHRoYXQgaXMsIGlmIG9uZSBvcGVyYW5kIGlzIGEgY29uc3RhbnRcbiAqIHRydWUgb3IgaWYgdGhlIGV4cHJlc3Npb24gY29udGFpbnMgYW4gb3BlcmFuZCBhbmQgaXRzIG5lZ2F0aW9uKS5cbiAqXG4gKiBAcGFyYW0gb3BlcmFuZHMgRXhwcmVzc2lvbnMgdG8gY29ubmVjdCBieSBgb3JgXG4gKiBAcmV0dXJucyBFeHByZXNzaW9uIGV2YWx1YXRpbmcgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gb3IoLi4ub3BlcmFuZHM6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPltdKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgZXhwcmVzc2lvbnMgPSBmbGF0dGVuU2V0RXhwcmVzc2lvbih7XG5cdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0b3BlcmF0b3I6IFwifHxcIixcblx0XHRvcGVyYW5kczogb3BlcmFuZHMubWFwKHdyYXBQcmltaXRpdmUpXG5cdH0pLm9wZXJhbmRzO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24oLi4uZXhwcmVzc2lvbnMpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9XG5cdGxldCBpc1N0YXRpY1RydWUgPSBmYWxzZTtcblx0Y29uc3Qgbm9uVHJpdmlhbEV4cHJlc3Npb24gPSBleHByZXNzaW9ucy5maWx0ZXIoKGV4cHJlc3Npb24pID0+IHtcblx0XHRpZiAoaXNUcnVlKGV4cHJlc3Npb24pKSB7XG5cdFx0XHRpc1N0YXRpY1RydWUgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gIWlzQ29uc3RhbnQoZXhwcmVzc2lvbikgfHwgZXhwcmVzc2lvbi52YWx1ZTtcblx0fSk7XG5cdGlmIChpc1N0YXRpY1RydWUpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH0gZWxzZSBpZiAobm9uVHJpdmlhbEV4cHJlc3Npb24ubGVuZ3RoID09PSAwKSB7XG5cdFx0Ly8gUmVzb2x2ZSB0aGUgY29uc3RhbnQgdGhlblxuXHRcdGNvbnN0IGlzVmFsaWQgPSBleHByZXNzaW9ucy5yZWR1Y2UoKHJlc3VsdCwgZXhwcmVzc2lvbikgPT4gcmVzdWx0ICYmIGlzVHJ1ZShleHByZXNzaW9uKSwgdHJ1ZSk7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGlzVmFsaWQpO1xuXHR9IGVsc2UgaWYgKG5vblRyaXZpYWxFeHByZXNzaW9uLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBub25Ucml2aWFsRXhwcmVzc2lvblswXTtcblx0fSBlbHNlIGlmIChoYXNPcHBvc2l0ZUV4cHJlc3Npb25zKG5vblRyaXZpYWxFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0XHRvcGVyYXRvcjogXCJ8fFwiLFxuXHRcdFx0b3BlcmFuZHM6IG5vblRyaXZpYWxFeHByZXNzaW9uXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIExvZ2ljYWwgYG5vdGAgb3BlcmF0b3IuXG4gKlxuICogQHBhcmFtIG9wZXJhbmQgVGhlIGV4cHJlc3Npb24gdG8gcmV2ZXJzZVxuICogQHJldHVybnMgVGhlIHJlc3VsdGluZyBleHByZXNzaW9uIHRoYXQgZXZhbHVhdGVzIHRvIGJvb2xlYW5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdChvcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRvcGVyYW5kID0gd3JhcFByaW1pdGl2ZShvcGVyYW5kKTtcblx0aWYgKGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKG9wZXJhbmQpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9IGVsc2UgaWYgKGlzQ29uc3RhbnQob3BlcmFuZCkpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoIW9wZXJhbmQudmFsdWUpO1xuXHR9IGVsc2UgaWYgKFxuXHRcdHR5cGVvZiBvcGVyYW5kID09PSBcIm9iamVjdFwiICYmXG5cdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmF0b3IgPT09IFwifHxcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmFuZHMuZXZlcnkoKGV4cHJlc3Npb24pID0+IGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgfHwgaXNDb21wYXJpc29uKGV4cHJlc3Npb24pKVxuXHQpIHtcblx0XHRyZXR1cm4gYW5kKC4uLm9wZXJhbmQub3BlcmFuZHMubWFwKChleHByZXNzaW9uKSA9PiBub3QoZXhwcmVzc2lvbikpKTtcblx0fSBlbHNlIGlmIChcblx0XHR0eXBlb2Ygb3BlcmFuZCA9PT0gXCJvYmplY3RcIiAmJlxuXHRcdG9wZXJhbmQuX3R5cGUgPT09IFwiU2V0XCIgJiZcblx0XHRvcGVyYW5kLm9wZXJhdG9yID09PSBcIiYmXCIgJiZcblx0XHRvcGVyYW5kLm9wZXJhbmRzLmV2ZXJ5KChleHByZXNzaW9uKSA9PiBpc0NvbnN0YW50KGV4cHJlc3Npb24pIHx8IGlzQ29tcGFyaXNvbihleHByZXNzaW9uKSlcblx0KSB7XG5cdFx0cmV0dXJuIG9yKC4uLm9wZXJhbmQub3BlcmFuZHMubWFwKChleHByZXNzaW9uKSA9PiBub3QoZXhwcmVzc2lvbikpKTtcblx0fSBlbHNlIGlmIChpc0NvbXBhcmlzb24ob3BlcmFuZCkpIHtcblx0XHQvLyBDcmVhdGUgdGhlIHJldmVyc2UgY29tcGFyaXNvblxuXHRcdHN3aXRjaCAob3BlcmFuZC5vcGVyYXRvcikge1xuXHRcdFx0Y2FzZSBcIiE9PVwiOlxuXHRcdFx0XHRyZXR1cm4geyAuLi5vcGVyYW5kLCBvcGVyYXRvcjogXCI9PT1cIiB9O1xuXHRcdFx0Y2FzZSBcIjxcIjpcblx0XHRcdFx0cmV0dXJuIHsgLi4ub3BlcmFuZCwgb3BlcmF0b3I6IFwiPj1cIiB9O1xuXHRcdFx0Y2FzZSBcIjw9XCI6XG5cdFx0XHRcdHJldHVybiB7IC4uLm9wZXJhbmQsIG9wZXJhdG9yOiBcIj5cIiB9O1xuXHRcdFx0Y2FzZSBcIj09PVwiOlxuXHRcdFx0XHRyZXR1cm4geyAuLi5vcGVyYW5kLCBvcGVyYXRvcjogXCIhPT1cIiB9O1xuXHRcdFx0Y2FzZSBcIj5cIjpcblx0XHRcdFx0cmV0dXJuIHsgLi4ub3BlcmFuZCwgb3BlcmF0b3I6IFwiPD1cIiB9O1xuXHRcdFx0Y2FzZSBcIj49XCI6XG5cdFx0XHRcdHJldHVybiB7IC4uLm9wZXJhbmQsIG9wZXJhdG9yOiBcIjxcIiB9O1xuXHRcdH1cblx0fSBlbHNlIGlmIChvcGVyYW5kLl90eXBlID09PSBcIk5vdFwiKSB7XG5cdFx0cmV0dXJuIG9wZXJhbmQub3BlcmFuZDtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiTm90XCIsXG5cdFx0b3BlcmFuZDogb3BlcmFuZFxuXHR9O1xufVxuXG4vKipcbiAqIEV2YWx1YXRlcyB3aGV0aGVyIGEgYmluZGluZyBleHByZXNzaW9uIGlzIGVxdWFsIHRvIHRydWUgd2l0aCBhIGxvb3NlIGVxdWFsaXR5LlxuICpcbiAqIEBwYXJhbSBvcGVyYW5kIFRoZSBleHByZXNzaW9uIHRvIGNoZWNrXG4gKiBAcmV0dXJucyBUaGUgcmVzdWx0aW5nIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUcnV0aHkob3BlcmFuZDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRpZiAoaXNDb25zdGFudChvcGVyYW5kKSkge1xuXHRcdHJldHVybiBjb25zdGFudCghIW9wZXJhbmQudmFsdWUpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7XG5cdFx0XHRfdHlwZTogXCJUcnV0aHlcIixcblx0XHRcdG9wZXJhbmQ6IG9wZXJhbmRcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJpbmRpbmcgZXhwcmVzc2lvbiB0aGF0IHdpbGwgYmUgZXZhbHVhdGVkIGJ5IHRoZSBjb3JyZXNwb25kaW5nIG1vZGVsLlxuICpcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcGFyYW0gbW9kZWxOYW1lXG4gKiBAcGFyYW0gdmlzaXRlZE5hdmlnYXRpb25QYXRoc1xuICogQHBhcmFtIHBhdGhWaXNpdG9yXG4gKiBAcmV0dXJucyBBbiBleHByZXNzaW9uIHJlcHJlc2VudGF0aW5nIHRoYXQgcGF0aCBpbiB0aGUgbW9kZWxcbiAqIEBkZXByZWNhdGVkIHVzZSBwYXRoSW5Nb2RlbCBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kaW5nRXhwcmVzc2lvbjxUYXJnZXRUeXBlIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdHBhdGg6IGFueSxcblx0bW9kZWxOYW1lPzogc3RyaW5nLFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBQYXRoSW5Nb2RlbEV4cHJlc3Npb248VGFyZ2V0VHlwZT4gfCBVbnJlc29sdmVhYmxlUGF0aEV4cHJlc3Npb24ge1xuXHRyZXR1cm4gcGF0aEluTW9kZWwocGF0aCwgbW9kZWxOYW1lLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcik7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJpbmRpbmcgZXhwcmVzc2lvbiB0aGF0IHdpbGwgYmUgZXZhbHVhdGVkIGJ5IHRoZSBjb3JyZXNwb25kaW5nIG1vZGVsLlxuICpcbiAqIEB0ZW1wbGF0ZSBUYXJnZXRUeXBlXG4gKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCBvbiB0aGUgbW9kZWxcbiAqIEBwYXJhbSBbbW9kZWxOYW1lXSBUaGUgbmFtZSBvZiB0aGUgbW9kZWxcbiAqIEBwYXJhbSBbdmlzaXRlZE5hdmlnYXRpb25QYXRoc10gVGhlIHBhdGhzIGZyb20gdGhlIHJvb3QgZW50aXR5U2V0XG4gKiBAcGFyYW0gW3BhdGhWaXNpdG9yXSBBIGZ1bmN0aW9uIHRvIG1vZGlmeSB0aGUgcmVzdWx0aW5nIHBhdGhcbiAqIEByZXR1cm5zIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50YXRpbmcgdGhhdCBwYXRoIGluIHRoZSBtb2RlbFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aEluTW9kZWwoXG5cdHBhdGg6IHVuZGVmaW5lZCxcblx0bW9kZWxOYW1lPzogc3RyaW5nLFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzPzogc3RyaW5nW10sXG5cdHBhdGhWaXNpdG9yPzogRnVuY3Rpb25cbik6IFVucmVzb2x2ZWFibGVQYXRoRXhwcmVzc2lvbjtcbmV4cG9ydCBmdW5jdGlvbiBwYXRoSW5Nb2RlbDxUYXJnZXRUeXBlIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdHBhdGg6IHN0cmluZyxcblx0bW9kZWxOYW1lPzogc3RyaW5nLFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzPzogc3RyaW5nW10sXG5cdHBhdGhWaXNpdG9yPzogdW5kZWZpbmVkXG4pOiBQYXRoSW5Nb2RlbEV4cHJlc3Npb248VGFyZ2V0VHlwZT47XG5leHBvcnQgZnVuY3Rpb24gcGF0aEluTW9kZWw8VGFyZ2V0VHlwZSBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRwYXRoOiBzdHJpbmcsXG5cdG1vZGVsTmFtZT86IHN0cmluZyxcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRocz86IHN0cmluZ1tdLFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBVbnJlc29sdmVhYmxlUGF0aEV4cHJlc3Npb24gfCBQYXRoSW5Nb2RlbEV4cHJlc3Npb248VGFyZ2V0VHlwZT47XG5leHBvcnQgZnVuY3Rpb24gcGF0aEluTW9kZWw8VGFyZ2V0VHlwZSBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQsXG5cdG1vZGVsTmFtZT86IHN0cmluZyxcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRocz86IHN0cmluZ1tdLFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBVbnJlc29sdmVhYmxlUGF0aEV4cHJlc3Npb24gfCBQYXRoSW5Nb2RlbEV4cHJlc3Npb248VGFyZ2V0VHlwZT47XG5leHBvcnQgZnVuY3Rpb24gcGF0aEluTW9kZWw8VGFyZ2V0VHlwZSBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQsXG5cdG1vZGVsTmFtZT86IHN0cmluZyxcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW10gPSBbXSxcblx0cGF0aFZpc2l0b3I/OiBGdW5jdGlvblxuKTogVW5yZXNvbHZlYWJsZVBhdGhFeHByZXNzaW9uIHwgUGF0aEluTW9kZWxFeHByZXNzaW9uPFRhcmdldFR5cGU+IHtcblx0aWYgKHBhdGggPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0fVxuXHRsZXQgdGFyZ2V0UGF0aDtcblx0aWYgKHBhdGhWaXNpdG9yKSB7XG5cdFx0dGFyZ2V0UGF0aCA9IHBhdGhWaXNpdG9yKHBhdGgpO1xuXHRcdGlmICh0YXJnZXRQYXRoID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgbG9jYWxQYXRoID0gdmlzaXRlZE5hdmlnYXRpb25QYXRocy5jb25jYXQoKTtcblx0XHRsb2NhbFBhdGgucHVzaChwYXRoKTtcblx0XHR0YXJnZXRQYXRoID0gbG9jYWxQYXRoLmpvaW4oXCIvXCIpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiUGF0aEluTW9kZWxcIixcblx0XHRtb2RlbE5hbWU6IG1vZGVsTmFtZSxcblx0XHRwYXRoOiB0YXJnZXRQYXRoXG5cdH07XG59XG5cbnR5cGUgUGxhaW5FeHByZXNzaW9uT2JqZWN0ID0geyBbaW5kZXg6IHN0cmluZ106IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+IH07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvbnN0YW50IGV4cHJlc3Npb24gYmFzZWQgb24gYSBwcmltaXRpdmUgdmFsdWUuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgY29uc3RhbnQgdG8gd3JhcCBpbiBhbiBleHByZXNzaW9uXG4gKiBAcmV0dXJucyBUaGUgY29uc3RhbnQgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY29uc3RhbnQ8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KHZhbHVlOiBUKTogQ29uc3RhbnRFeHByZXNzaW9uPFQ+IHtcblx0bGV0IGNvbnN0YW50VmFsdWU6IFQ7XG5cblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRjb25zdGFudFZhbHVlID0gdmFsdWUubWFwKHdyYXBQcmltaXRpdmUpIGFzIFQ7XG5cdFx0fSBlbHNlIGlmIChpc1ByaW1pdGl2ZU9iamVjdCh2YWx1ZSkpIHtcblx0XHRcdGNvbnN0YW50VmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCkgYXMgVDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3RhbnRWYWx1ZSA9IE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoKHBsYWluRXhwcmVzc2lvbiwgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0XHRjb25zdCB3cmFwcGVkVmFsdWUgPSB3cmFwUHJpbWl0aXZlKHZhbCk7XG5cdFx0XHRcdGlmICh3cmFwcGVkVmFsdWUuX3R5cGUgIT09IFwiQ29uc3RhbnRcIiB8fCB3cmFwcGVkVmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHBsYWluRXhwcmVzc2lvbltrZXldID0gd3JhcHBlZFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwbGFpbkV4cHJlc3Npb247XG5cdFx0XHR9LCB7fSBhcyBQbGFpbkV4cHJlc3Npb25PYmplY3QpIGFzIFQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0YW50VmFsdWUgPSB2YWx1ZTtcblx0fVxuXG5cdHJldHVybiB7IF90eXBlOiBcIkNvbnN0YW50XCIsIHZhbHVlOiBjb25zdGFudFZhbHVlIH07XG59XG5cbnR5cGUgRXZhbHVhdGlvblR5cGUgPSBcImJvb2xlYW5cIiB8IFwibnVtYmVyXCI7XG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUJpbmRpbmdTdHJpbmc8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHR2YWx1ZTogc3RyaW5nIHwgYm9vbGVhbiB8IG51bWJlcixcblx0dGFyZ2V0VHlwZT86IEV2YWx1YXRpb25UeXBlXG4pOiBDb25zdGFudEV4cHJlc3Npb248VD4gfCBFbWJlZGRlZFVJNUJpbmRpbmdFeHByZXNzaW9uPFQ+IHwgRW1iZWRkZWRVSTVFeHByZXNzaW9uQmluZGluZ0V4cHJlc3Npb248VD4ge1xuXHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUuc3RhcnRzV2l0aChcIntcIikpIHtcblx0XHRpZiAodmFsdWUuc3RhcnRzV2l0aChcIns9XCIpKSB7XG5cdFx0XHQvLyBFeHByZXNzaW9uIGJpbmRpbmcsIHdlIGNhbiBqdXN0IHJlbW92ZSB0aGUgb3V0ZXIgYmluZGluZyB0aGluZ3Ncblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdF90eXBlOiBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIixcblx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRfdHlwZTogXCJFbWJlZGRlZEJpbmRpbmdcIixcblx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0YXJnZXRUeXBlID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgKHZhbHVlID09PSBcInRydWVcIiB8fCB2YWx1ZSA9PT0gXCJmYWxzZVwiKSkge1xuXHRcdHJldHVybiBjb25zdGFudCh2YWx1ZSA9PT0gXCJ0cnVlXCIpIGFzIENvbnN0YW50RXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmICh0YXJnZXRUeXBlID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAoIWlzTmFOKE51bWJlcih2YWx1ZSkpIHx8IHZhbHVlID09PSBcIk5hTlwiKSkge1xuXHRcdHJldHVybiBjb25zdGFudChOdW1iZXIodmFsdWUpKSBhcyBDb25zdGFudEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KHZhbHVlKSBhcyBDb25zdGFudEV4cHJlc3Npb248VD47XG5cdH1cbn1cblxuLyoqXG4gKiBBIG5hbWVkIHJlZmVyZW5jZS5cbiAqXG4gKiBAc2VlIGZuXG4gKiBAcGFyYW0gcmVmZXJlbmNlIFJlZmVyZW5jZVxuICogQHJldHVybnMgVGhlIG9iamVjdCByZWZlcmVuY2UgYmluZGluZyBwYXJ0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWYocmVmZXJlbmNlOiBzdHJpbmcgfCBudWxsKTogUmVmZXJlbmNlRXhwcmVzc2lvbiB7XG5cdHJldHVybiB7IF90eXBlOiBcIlJlZlwiLCByZWY6IHJlZmVyZW5jZSB9O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSB0eXBlIGlzIGFuIGV4cHJlc3Npb24uXG4gKlxuICogRXZlcnkgb2JqZWN0IGhhdmluZyBhIHByb3BlcnR5IG5hbWVkIGBfdHlwZWAgb2Ygc29tZSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFuIGV4cHJlc3Npb24sIGV2ZW4gaWYgdGhlcmUgaXMgYWN0dWFsbHlcbiAqIG5vIHN1Y2ggZXhwcmVzc2lvbiB0eXBlIHN1cHBvcnRlZC5cbiAqXG4gKiBAcGFyYW0gc29tZXRoaW5nIFR5cGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgdHlwZSBpcyBjb25zaWRlcmVkIHRvIGJlIGFuIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gaXNFeHByZXNzaW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihzb21ldGhpbmc6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPik6IHNvbWV0aGluZyBpcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gc29tZXRoaW5nICE9PSBudWxsICYmIHR5cGVvZiBzb21ldGhpbmcgPT09IFwib2JqZWN0XCIgJiYgKHNvbWV0aGluZyBhcyBCYXNlRXhwcmVzc2lvbjxUPikuX3R5cGUgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBXcmFwIGEgcHJpbWl0aXZlIGludG8gYSBjb25zdGFudCBleHByZXNzaW9uIGlmIGl0IGlzIG5vdCBhbHJlYWR5IGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBzb21ldGhpbmcgVGhlIG9iamVjdCB0byB3cmFwIGluIGEgQ29uc3RhbnQgZXhwcmVzc2lvblxuICogQHJldHVybnMgRWl0aGVyIHRoZSBvcmlnaW5hbCBvYmplY3Qgb3IgdGhlIHdyYXBwZWQgb25lIGRlcGVuZGluZyBvbiB0aGUgY2FzZVxuICovXG5mdW5jdGlvbiB3cmFwUHJpbWl0aXZlPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihzb21ldGhpbmc6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPiB7XG5cdGlmIChpc0V4cHJlc3Npb24oc29tZXRoaW5nKSkge1xuXHRcdHJldHVybiBzb21ldGhpbmc7XG5cdH1cblxuXHRyZXR1cm4gY29uc3RhbnQoc29tZXRoaW5nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGV4cHJlc3Npb24gb3IgdmFsdWUgcHJvdmlkZWQgaXMgY29uc3RhbnQgb3Igbm90LlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtICBtYXliZUNvbnN0YW50IFRoZSBleHByZXNzaW9uIG9yIHByaW1pdGl2ZSB2YWx1ZSB0aGF0IGlzIHRvIGJlIGNoZWNrZWRcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBpdCBpcyBjb25zdGFudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDb25zdGFudDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4obWF5YmVDb25zdGFudDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogbWF5YmVDb25zdGFudCBpcyBDb25zdGFudEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gdHlwZW9mIG1heWJlQ29uc3RhbnQgIT09IFwib2JqZWN0XCIgfHwgKG1heWJlQ29uc3RhbnQgYXMgQmFzZUV4cHJlc3Npb248VD4pLl90eXBlID09PSBcIkNvbnN0YW50XCI7XG59XG5cbmZ1bmN0aW9uIGlzVHJ1ZShleHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248UHJpbWl0aXZlVHlwZT4pIHtcblx0cmV0dXJuIGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvbi52YWx1ZSA9PT0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNGYWxzZShleHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248UHJpbWl0aXZlVHlwZT4pIHtcblx0cmV0dXJuIGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvbi52YWx1ZSA9PT0gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBleHByZXNzaW9uIG9yIHZhbHVlIHByb3ZpZGVkIGlzIGEgcGF0aCBpbiBtb2RlbCBleHByZXNzaW9uIG9yIG5vdC5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSAgbWF5YmVCaW5kaW5nIFRoZSBleHByZXNzaW9uIG9yIHByaW1pdGl2ZSB2YWx1ZSB0aGF0IGlzIHRvIGJlIGNoZWNrZWRcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBpdCBpcyBhIHBhdGggaW4gbW9kZWwgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQYXRoSW5Nb2RlbEV4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRtYXliZUJpbmRpbmc6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogbWF5YmVCaW5kaW5nIGlzIFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiB0eXBlb2YgbWF5YmVCaW5kaW5nID09PSBcIm9iamVjdFwiICYmIChtYXliZUJpbmRpbmcgYXMgQmFzZUV4cHJlc3Npb248VD4pLl90eXBlID09PSBcIlBhdGhJbk1vZGVsXCI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBleHByZXNzaW9uIG9yIHZhbHVlIHByb3ZpZGVkIGlzIGEgY29tcGxleCB0eXBlIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gIG1heWJlQmluZGluZyBUaGUgZXhwcmVzc2lvbiBvciBwcmltaXRpdmUgdmFsdWUgdGhhdCBpcyB0byBiZSBjaGVja2VkXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgYSBwYXRoIGluIG1vZGVsIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcGxleFR5cGVFeHByZXNzaW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bWF5YmVCaW5kaW5nOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IG1heWJlQmluZGluZyBpcyBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gdHlwZW9mIG1heWJlQmluZGluZyA9PT0gXCJvYmplY3RcIiAmJiAobWF5YmVCaW5kaW5nIGFzIEJhc2VFeHByZXNzaW9uPFQ+KS5fdHlwZSA9PT0gXCJDb21wbGV4VHlwZVwiO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZXhwcmVzc2lvbiBvciB2YWx1ZSBwcm92aWRlZCBpcyBhIGNvbmNhdCBleHByZXNzaW9uIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvblxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBleHByZXNzaW9uIGlzIGEgQ29uY2F0RXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBpc0NvbmNhdEV4cHJlc3Npb24oZXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFByaW1pdGl2ZVR5cGU+KTogZXhwcmVzc2lvbiBpcyBDb25jYXRFeHByZXNzaW9uIHtcblx0cmV0dXJuIHR5cGVvZiBleHByZXNzaW9uID09PSBcIm9iamVjdFwiICYmIChleHByZXNzaW9uIGFzIEJhc2VFeHByZXNzaW9uPFByaW1pdGl2ZVR5cGU+KS5fdHlwZSA9PT0gXCJDb25jYXRcIjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGV4cHJlc3Npb24gcHJvdmlkZWQgaXMgYSBjb21wYXJpc29uIG9yIG5vdC5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGV4cHJlc3Npb24gaXMgYSBDb21wYXJpc29uRXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBpc0NvbXBhcmlzb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KGV4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPik6IGV4cHJlc3Npb24gaXMgQ29tcGFyaXNvbkV4cHJlc3Npb24ge1xuXHRyZXR1cm4gZXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJDb21wYXJpc29uXCI7XG59XG5cbnR5cGUgQ29tcGxleEFubm90YXRpb25FeHByZXNzaW9uPFA+ID1cblx0fCBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBBcHBseUFubm90YXRpb25FeHByZXNzaW9uPFA+XG5cdHwgSWZBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IE9yQW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBBbmRBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IE5lQW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBFcUFubm90YXRpb25FeHByZXNzaW9uPFA+XG5cdHwgTm90QW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBHdEFubm90YXRpb25FeHByZXNzaW9uPFA+XG5cdHwgR2VBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IExlQW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBMdEFubm90YXRpb25FeHByZXNzaW9uPFA+O1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZU9iamVjdChvYmplY3RUeXBlOiBvYmplY3QpOiBib29sZWFuIHtcblx0c3dpdGNoIChvYmplY3RUeXBlLmNvbnN0cnVjdG9yLm5hbWUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0Y2FzZSBcIk51bWJlclwiOlxuXHRcdGNhc2UgXCJCb29sZWFuXCI6XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4vKipcbiAqIENoZWNrIGlmIHRoZSBwYXNzZWQgYW5ub3RhdGlvbiBhbm5vdGF0aW9uVmFsdWUgaXMgYSBDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gIGFubm90YXRpb25WYWx1ZSBUaGUgYW5ub3RhdGlvbiBhbm5vdGF0aW9uVmFsdWUgdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0IGlzIGEge0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbn1cbiAqL1xuZnVuY3Rpb24gaXNDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb248VD4oYW5ub3RhdGlvblZhbHVlOiBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxUPik6IGFubm90YXRpb25WYWx1ZSBpcyBDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gdHlwZW9mIGFubm90YXRpb25WYWx1ZSA9PT0gXCJvYmplY3RcIiAmJiAhaXNQcmltaXRpdmVPYmplY3QoYW5ub3RhdGlvblZhbHVlIGFzIG9iamVjdCk7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIGNvcnJlc3BvbmRpbmcgYW5ub3RhdGlvblZhbHVlIGZvciBhIGdpdmVuIGFubm90YXRpb24gYW5ub3RhdGlvblZhbHVlLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGFubm90YXRpb25WYWx1ZSBUaGUgc291cmNlIGFubm90YXRpb24gYW5ub3RhdGlvblZhbHVlXG4gKiBAcGFyYW0gdmlzaXRlZE5hdmlnYXRpb25QYXRocyBUaGUgcGF0aCBmcm9tIHRoZSByb290IGVudGl0eSBzZXRcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgRGVmYXVsdCB2YWx1ZSBpZiB0aGUgYW5ub3RhdGlvblZhbHVlIGlzIHVuZGVmaW5lZFxuICogQHBhcmFtIHBhdGhWaXNpdG9yIEEgZnVuY3Rpb24gdG8gbW9kaWZ5IHRoZSByZXN1bHRpbmcgcGF0aFxuICogQHJldHVybnMgVGhlIGFubm90YXRpb25WYWx1ZSBlcXVpdmFsZW50IHRvIHRoYXQgYW5ub3RhdGlvbiBhbm5vdGF0aW9uVmFsdWVcbiAqIEBkZXByZWNhdGVkIHVzZSBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24gaW5zdGVhZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5ub3RhdGlvbkV4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRhbm5vdGF0aW9uVmFsdWU6IFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPFQ+LFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRkZWZhdWx0VmFsdWU/OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHBhdGhWaXNpdG9yPzogRnVuY3Rpb25cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxQcmltaXRpdmVUeXBlQ2FzdDxUPj4ge1xuXHRyZXR1cm4gZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGFubm90YXRpb25WYWx1ZSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgZGVmYXVsdFZhbHVlLCBwYXRoVmlzaXRvcik7XG59XG4vKipcbiAqIEdlbmVyYXRlIHRoZSBjb3JyZXNwb25kaW5nIGFubm90YXRpb25WYWx1ZSBmb3IgYSBnaXZlbiBhbm5vdGF0aW9uIGFubm90YXRpb25WYWx1ZS5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBhbm5vdGF0aW9uVmFsdWUgVGhlIHNvdXJjZSBhbm5vdGF0aW9uIGFubm90YXRpb25WYWx1ZVxuICogQHBhcmFtIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgVGhlIHBhdGggZnJvbSB0aGUgcm9vdCBlbnRpdHkgc2V0XG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIERlZmF1bHQgdmFsdWUgaWYgdGhlIGFubm90YXRpb25WYWx1ZSBpcyB1bmRlZmluZWRcbiAqIEBwYXJhbSBwYXRoVmlzaXRvciBBIGZ1bmN0aW9uIHRvIG1vZGlmeSB0aGUgcmVzdWx0aW5nIHBhdGhcbiAqIEByZXR1cm5zIFRoZSBhbm5vdGF0aW9uVmFsdWUgZXF1aXZhbGVudCB0byB0aGF0IGFubm90YXRpb24gYW5ub3RhdGlvblZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRhbm5vdGF0aW9uVmFsdWU6IFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPFQ+LFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRkZWZhdWx0VmFsdWU/OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHBhdGhWaXNpdG9yPzogRnVuY3Rpb25cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxQcmltaXRpdmVUeXBlQ2FzdDxUPj4ge1xuXHRpZiAoYW5ub3RhdGlvblZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gd3JhcFByaW1pdGl2ZShkZWZhdWx0VmFsdWUgYXMgVCk7XG5cdH1cblx0YW5ub3RhdGlvblZhbHVlID0gYW5ub3RhdGlvblZhbHVlPy52YWx1ZU9mKCkgYXMgUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8VD47XG5cdGlmICghaXNDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb24oYW5ub3RhdGlvblZhbHVlKSkge1xuXHRcdHJldHVybiBjb25zdGFudChhbm5vdGF0aW9uVmFsdWUpO1xuXHR9XG5cblx0c3dpdGNoIChhbm5vdGF0aW9uVmFsdWUudHlwZSkge1xuXHRcdGNhc2UgXCJQYXRoXCI6XG5cdFx0XHRyZXR1cm4gcGF0aEluTW9kZWwoYW5ub3RhdGlvblZhbHVlLnBhdGgsIHVuZGVmaW5lZCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdGNhc2UgXCJJZlwiOlxuXHRcdFx0cmV0dXJuIGFubm90YXRpb25JZkV4cHJlc3Npb24oYW5ub3RhdGlvblZhbHVlLklmLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcik7XG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdFx0cmV0dXJuIG5vdChwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvblZhbHVlLk5vdCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdFx0Y2FzZSBcIkVxXCI6XG5cdFx0XHRyZXR1cm4gZXF1YWwoXG5cdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uVmFsdWUuRXFbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25WYWx1ZS5FcVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0XHRjYXNlIFwiTmVcIjpcblx0XHRcdHJldHVybiBub3RFcXVhbChcblx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25WYWx1ZS5OZVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvblZhbHVlLk5lWzFdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0XHRcdCkgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHRcdGNhc2UgXCJHdFwiOlxuXHRcdFx0cmV0dXJuIGdyZWF0ZXJUaGFuKFxuXHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvblZhbHVlLkd0WzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uVmFsdWUuR3RbMV0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKVxuXHRcdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdFx0Y2FzZSBcIkdlXCI6XG5cdFx0XHRyZXR1cm4gZ3JlYXRlck9yRXF1YWwoXG5cdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uVmFsdWUuR2VbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25WYWx1ZS5HZVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0XHRjYXNlIFwiTHRcIjpcblx0XHRcdHJldHVybiBsZXNzVGhhbihcblx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25WYWx1ZS5MdFswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvblZhbHVlLkx0WzFdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0XHRcdCkgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHRcdGNhc2UgXCJMZVwiOlxuXHRcdFx0cmV0dXJuIGxlc3NPckVxdWFsKFxuXHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvblZhbHVlLkxlWzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uVmFsdWUuTGVbMV0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKVxuXHRcdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdFx0Y2FzZSBcIk9yXCI6XG5cdFx0XHRyZXR1cm4gb3IoXG5cdFx0XHRcdC4uLmFubm90YXRpb25WYWx1ZS5Pci5tYXAoZnVuY3Rpb24gKG9yQ29uZGl0aW9uKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbjxib29sZWFuPihvckNvbmRpdGlvbiwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0XHR9KVxuXHRcdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdFx0Y2FzZSBcIkFuZFwiOlxuXHRcdFx0cmV0dXJuIGFuZChcblx0XHRcdFx0Li4uYW5ub3RhdGlvblZhbHVlLkFuZC5tYXAoZnVuY3Rpb24gKGFuZENvbmRpdGlvbikge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUFubm90YXRpb25Db25kaXRpb248Ym9vbGVhbj4oYW5kQ29uZGl0aW9uLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcik7XG5cdFx0XHRcdH0pXG5cdFx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0XHRjYXNlIFwiQXBwbHlcIjpcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uKFxuXHRcdFx0XHRhbm5vdGF0aW9uVmFsdWUgYXMgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbjxzdHJpbmc+LFxuXHRcdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzLFxuXHRcdFx0XHRwYXRoVmlzaXRvclxuXHRcdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH1cblx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBhbm5vdGF0aW9uIGNvbmRpdGlvbiBpbnRvIGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gYW5ub3RhdGlvblZhbHVlIFRoZSBjb25kaXRpb24gb3IgdmFsdWUgZnJvbSB0aGUgYW5ub3RhdGlvblxuICogQHBhcmFtIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgVGhlIHBhdGggZnJvbSB0aGUgcm9vdCBlbnRpdHkgc2V0XG4gKiBAcGFyYW0gcGF0aFZpc2l0b3IgQSBmdW5jdGlvbiB0byBtb2RpZnkgdGhlIHJlc3VsdGluZyBwYXRoXG4gKiBAcmV0dXJucyBBbiBlcXVpdmFsZW50IGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gcGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0YW5ub3RhdGlvblZhbHVlOiBDb25kaXRpb25hbENoZWNrT3JWYWx1ZSxcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW10gPSBbXSxcblx0cGF0aFZpc2l0b3I/OiBGdW5jdGlvblxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGFubm90YXRpb25WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYW5ub3RhdGlvblZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGFubm90YXRpb25WYWx1ZSBhcyBUKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkT3JcIikpIHtcblx0XHRyZXR1cm4gb3IoXG5cdFx0XHQuLi4oKGFubm90YXRpb25WYWx1ZSBhcyBPckNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE9yLm1hcChmdW5jdGlvbiAob3JDb25kaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuIHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihvckNvbmRpdGlvbiwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0fSkgYXMgdW5rbm93biBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5bXSlcblx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkQW5kXCIpKSB7XG5cdFx0cmV0dXJuIGFuZChcblx0XHRcdC4uLigoYW5ub3RhdGlvblZhbHVlIGFzIEFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEFuZC5tYXAoZnVuY3Rpb24gKGFuZENvbmRpdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gcGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFuZENvbmRpdGlvbiwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0fSkgYXMgdW5rbm93biBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5bXSlcblx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTm90XCIpKSB7XG5cdFx0cmV0dXJuIG5vdChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIE5vdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5vdCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEVxXCIpKSB7XG5cdFx0cmV0dXJuIGVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgRXFDb25kaXRpb25hbEV4cHJlc3Npb24pLiRFcVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgRXFDb25kaXRpb25hbEV4cHJlc3Npb24pLiRFcVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJE5lXCIpKSB7XG5cdFx0cmV0dXJuIG5vdEVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTmVDb25kaXRpb25hbEV4cHJlc3Npb24pLiROZVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTmVDb25kaXRpb25hbEV4cHJlc3Npb24pLiROZVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEd0XCIpKSB7XG5cdFx0cmV0dXJuIGdyZWF0ZXJUaGFuKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR3RDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHdFswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR3RDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHdFsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEdlXCIpKSB7XG5cdFx0cmV0dXJuIGdyZWF0ZXJPckVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR2VDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHZVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR2VDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHZVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEx0XCIpKSB7XG5cdFx0cmV0dXJuIGxlc3NUaGFuKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTHRDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMdFswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTHRDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMdFsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJExlXCIpKSB7XG5cdFx0cmV0dXJuIGxlc3NPckVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTGVDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMZVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTGVDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMZVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJFBhdGhcIikpIHtcblx0XHRyZXR1cm4gcGF0aEluTW9kZWwoKGFubm90YXRpb25WYWx1ZSBhcyBQYXRoQ29uZGl0aW9uRXhwcmVzc2lvbjxUPikuJFBhdGgsIHVuZGVmaW5lZCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdHJldHVybiBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oXG5cdFx0XHR7XG5cdFx0XHRcdHR5cGU6IFwiQXBwbHlcIixcblx0XHRcdFx0RnVuY3Rpb246IChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kRnVuY3Rpb24sXG5cdFx0XHRcdEFwcGx5OiAoYW5ub3RhdGlvblZhbHVlIGFzIGFueSkuJEFwcGx5XG5cdFx0XHR9IGFzIFQsXG5cdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0cGF0aFZpc2l0b3Jcblx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRyZXR1cm4gZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKFxuXHRcdFx0e1xuXHRcdFx0XHR0eXBlOiBcIklmXCIsXG5cdFx0XHRcdElmOiAoYW5ub3RhdGlvblZhbHVlIGFzIGFueSkuJElmXG5cdFx0XHR9IGFzIFQsXG5cdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0cGF0aFZpc2l0b3Jcblx0XHQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkRW51bU1lbWJlclwiKSkge1xuXHRcdHJldHVybiBjb25zdGFudChyZXNvbHZlRW51bVZhbHVlKChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kRW51bU1lbWJlcikgYXMgVCk7XG5cdH1cblx0cmV0dXJuIGNvbnN0YW50KGZhbHNlIGFzIFQpO1xufVxuXG4vKipcbiAqIFByb2Nlc3MgdGhlIHtJZkFubm90YXRpb25FeHByZXNzaW9uVmFsdWV9IGludG8gYW4gZXhwcmVzc2lvbi5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBhbm5vdGF0aW9uVmFsdWUgQW4gSWYgZXhwcmVzc2lvbiByZXR1cm5pbmcgdGhlIHR5cGUgVFxuICogQHBhcmFtIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgVGhlIHBhdGggZnJvbSB0aGUgcm9vdCBlbnRpdHkgc2V0XG4gKiBAcGFyYW0gcGF0aFZpc2l0b3IgQSBmdW5jdGlvbiB0byBtb2RpZnkgdGhlIHJlc3VsdGluZyBwYXRoXG4gKiBAcmV0dXJucyBUaGUgZXF1aXZhbGVudCBpZkVsc2UgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5ub3RhdGlvbklmRXhwcmVzc2lvbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGFubm90YXRpb25WYWx1ZTogSWZBbm5vdGF0aW9uRXhwcmVzc2lvblZhbHVlPFQ+LFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gaWZFbHNlKFxuXHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uVmFsdWVbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvblZhbHVlWzFdIGFzIGFueSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uVmFsdWVbMl0gYXMgYW55LCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRpb25BcHBseUV4cHJlc3Npb24oXG5cdGFwcGx5RXhwcmVzc2lvbjogQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbjxzdHJpbmc+LFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdHN3aXRjaCAoYXBwbHlFeHByZXNzaW9uLkZ1bmN0aW9uKSB7XG5cdFx0Y2FzZSBcIm9kYXRhLmNvbmNhdFwiOlxuXHRcdFx0cmV0dXJuIGNvbmNhdChcblx0XHRcdFx0Li4uYXBwbHlFeHByZXNzaW9uLkFwcGx5Lm1hcCgoYXBwbHlQYXJhbTogYW55KSA9PiB7XG5cdFx0XHRcdFx0bGV0IGFwcGx5UGFyYW1Db252ZXJ0ZWQgPSBhcHBseVBhcmFtO1xuXHRcdFx0XHRcdGlmIChhcHBseVBhcmFtLmhhc093blByb3BlcnR5KFwiJFBhdGhcIikpIHtcblx0XHRcdFx0XHRcdGFwcGx5UGFyYW1Db252ZXJ0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiUGF0aFwiLFxuXHRcdFx0XHRcdFx0XHRwYXRoOiBhcHBseVBhcmFtLiRQYXRoXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYXBwbHlQYXJhbS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdFx0XHRcdFx0YXBwbHlQYXJhbUNvbnZlcnRlZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJJZlwiLFxuXHRcdFx0XHRcdFx0XHRJZjogYXBwbHlQYXJhbS4kSWZcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhcHBseVBhcmFtLmhhc093blByb3BlcnR5KFwiJEFwcGx5XCIpKSB7XG5cdFx0XHRcdFx0XHRhcHBseVBhcmFtQ29udmVydGVkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkFwcGx5XCIsXG5cdFx0XHRcdFx0XHRcdEZ1bmN0aW9uOiBhcHBseVBhcmFtLiRGdW5jdGlvbixcblx0XHRcdFx0XHRcdFx0QXBwbHk6IGFwcGx5UGFyYW0uJEFwcGx5XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGFwcGx5UGFyYW1Db252ZXJ0ZWQsIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHVuZGVmaW5lZCwgcGF0aFZpc2l0b3IpO1xuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0fVxuXHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG59XG5cbi8qKlxuICogR2VuZXJpYyBoZWxwZXIgZm9yIHRoZSBjb21wYXJpc29uIG9wZXJhdGlvbnMgKGVxdWFsLCBub3RFcXVhbCwgLi4uKS5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBvcGVyYXRvciBUaGUgb3BlcmF0b3IgdG8gYXBwbHlcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBvcGVyYXRvclxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgb3BlcmF0b3JcbiAqIEByZXR1cm5zIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmlzb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRvcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yLFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgbGVmdEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKGxlZnRPcGVyYW5kKTtcblx0Y29uc3QgcmlnaHRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShyaWdodE9wZXJhbmQpO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24obGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdH1cblx0aWYgKGlzQ29uc3RhbnQobGVmdEV4cHJlc3Npb24pICYmIGlzQ29uc3RhbnQocmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHN3aXRjaCAob3BlcmF0b3IpIHtcblx0XHRcdGNhc2UgXCIhPT1cIjpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlICE9PSByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIjxcIjpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlIDwgcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHRcdGNhc2UgXCI8PVwiOlxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgPD0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHRcdGNhc2UgXCI+XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA+IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPj1cIjpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlID49IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPT09XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA9PT0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIkNvbXBhcmlzb25cIixcblx0XHRcdG9wZXJhdG9yOiBvcGVyYXRvcixcblx0XHRcdG9wZXJhbmQxOiBsZWZ0RXhwcmVzc2lvbixcblx0XHRcdG9wZXJhbmQyOiByaWdodEV4cHJlc3Npb25cblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsZW5ndGgoZXhwcmVzc2lvbjogUGF0aEluTW9kZWxFeHByZXNzaW9uPGFueT4gfCBVbnJlc29sdmVhYmxlUGF0aEV4cHJlc3Npb24pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248bnVtYmVyPiB7XG5cdGlmIChleHByZXNzaW9uLl90eXBlID09PSBcIlVucmVzb2x2YWJsZVwiKSB7XG5cdFx0cmV0dXJuIGV4cHJlc3Npb247XG5cdH1cblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJMZW5ndGhcIixcblx0XHRwYXRoSW5Nb2RlbDogZXhwcmVzc2lvblxuXHR9O1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwiZXF1YWxcIiAoPT09KS5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlXG4gKiBAcGFyYW0gcmlnaHRPcGVyYW5kIFRoZSBvcGVyYW5kIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBjb21wYXJpc29uXG4gKiBAcmV0dXJucyBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgbGVmdEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKGxlZnRPcGVyYW5kKTtcblx0Y29uc3QgcmlnaHRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShyaWdodE9wZXJhbmQpO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24obGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdH1cblx0aWYgKF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWR1Y2UobGVmdDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+LCByaWdodDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+KSB7XG5cdFx0aWYgKGxlZnQuX3R5cGUgPT09IFwiQ29tcGFyaXNvblwiICYmIGlzVHJ1ZShyaWdodCkpIHtcblx0XHRcdC8vIGNvbXBhcmUoYSwgYikgPT09IHRydWUgfn4+IGNvbXBhcmUoYSwgYilcblx0XHRcdHJldHVybiBsZWZ0O1xuXHRcdH0gZWxzZSBpZiAobGVmdC5fdHlwZSA9PT0gXCJDb21wYXJpc29uXCIgJiYgaXNGYWxzZShyaWdodCkpIHtcblx0XHRcdC8vIGNvbXBhcmUoYSwgYikgPT09IGZhbHNlIH5+PiAhY29tcGFyZShhLCBiKVxuXHRcdFx0cmV0dXJuIG5vdChsZWZ0KTtcblx0XHR9IGVsc2UgaWYgKGxlZnQuX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChsZWZ0Lm9uVHJ1ZSwgcmlnaHQpKSB7XG5cdFx0XHQvLyAoaWYgKHgpIHsgYSB9IGVsc2UgeyBiIH0pID09PSBhIH5+PiB4IHx8IChiID09PSBhKVxuXHRcdFx0cmV0dXJuIG9yKGxlZnQuY29uZGl0aW9uLCBlcXVhbChsZWZ0Lm9uRmFsc2UsIHJpZ2h0KSk7XG5cdFx0fSBlbHNlIGlmIChsZWZ0Ll90eXBlID09PSBcIklmRWxzZVwiICYmIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdC5vbkZhbHNlLCByaWdodCkpIHtcblx0XHRcdC8vIChpZiAoeCkgeyBhIH0gZWxzZSB7IGIgfSkgPT09IGIgfn4+ICF4IHx8IChhID09PSBiKVxuXHRcdFx0cmV0dXJuIG9yKG5vdChsZWZ0LmNvbmRpdGlvbiksIGVxdWFsKGxlZnQub25UcnVlLCByaWdodCkpO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRsZWZ0Ll90eXBlID09PSBcIklmRWxzZVwiICYmXG5cdFx0XHRpc0NvbnN0YW50KGxlZnQub25UcnVlKSAmJlxuXHRcdFx0aXNDb25zdGFudChsZWZ0Lm9uRmFsc2UpICYmXG5cdFx0XHRpc0NvbnN0YW50KHJpZ2h0KSAmJlxuXHRcdFx0IV9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdC5vblRydWUsIHJpZ2h0KSAmJlxuXHRcdFx0IV9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdC5vbkZhbHNlLCByaWdodClcblx0XHQpIHtcblx0XHRcdHJldHVybiBjb25zdGFudChmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBleHBsb2l0IHN5bW1ldHJ5OiBhID09PSBiIDx+PiBiID09PSBhXG5cdGNvbnN0IHJlZHVjZWQgPSByZWR1Y2UobGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikgPz8gcmVkdWNlKHJpZ2h0RXhwcmVzc2lvbiwgbGVmdEV4cHJlc3Npb24pO1xuXHRyZXR1cm4gcmVkdWNlZCA/PyBjb21wYXJpc29uKFwiPT09XCIsIGxlZnRFeHByZXNzaW9uLCByaWdodEV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwibm90IGVxdWFsXCIgKCE9PSkuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMgQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdEVxdWFsPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBub3QoZXF1YWwobGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCkpO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwiZ3JlYXRlciBvciBlcXVhbFwiICg+PSkuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMgQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyZWF0ZXJPckVxdWFsPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPj1cIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJncmVhdGVyIHRoYW5cIiAoPikuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMgQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyZWF0ZXJUaGFuPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPlwiLCBsZWZ0T3BlcmFuZCwgcmlnaHRPcGVyYW5kKTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImxlc3Mgb3IgZXF1YWxcIiAoPD0pLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZXNzT3JFcXVhbDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY29tcGFyaXNvbihcIjw9XCIsIGxlZnRPcGVyYW5kLCByaWdodE9wZXJhbmQpO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwibGVzcyB0aGFuXCIgKDwpLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZXNzVGhhbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY29tcGFyaXNvbihcIjxcIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogSWYtdGhlbi1lbHNlIGV4cHJlc3Npb24uXG4gKlxuICogRXZhbHVhdGVzIHRvIG9uVHJ1ZSBpZiB0aGUgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlLCBlbHNlIGV2YWx1YXRlcyB0byBvbkZhbHNlLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGNvbmRpdGlvbiBUaGUgY29uZGl0aW9uIHRvIGV2YWx1YXRlXG4gKiBAcGFyYW0gb25UcnVlIEV4cHJlc3Npb24gcmVzdWx0IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWVcbiAqIEBwYXJhbSBvbkZhbHNlIEV4cHJlc3Npb24gcmVzdWx0IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIGZhbHNlXG4gKiBAcmV0dXJucyBUaGUgZXhwcmVzc2lvbiB0aGF0IHJlcHJlc2VudHMgdGhpcyBjb25kaXRpb25hbCBjaGVja1xuICovXG5leHBvcnQgZnVuY3Rpb24gaWZFbHNlPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0Y29uZGl0aW9uOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4sXG5cdG9uVHJ1ZTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRvbkZhbHNlOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPiB7XG5cdGxldCBjb25kaXRpb25FeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShjb25kaXRpb24pO1xuXHRsZXQgb25UcnVlRXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUob25UcnVlKTtcblx0bGV0IG9uRmFsc2VFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShvbkZhbHNlKTtcblxuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24oY29uZGl0aW9uRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbiwgb25GYWxzZUV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9XG5cdC8vIHN3YXAgYnJhbmNoZXMgaWYgdGhlIGNvbmRpdGlvbiBpcyBhIG5lZ2F0aW9uXG5cdGlmIChjb25kaXRpb25FeHByZXNzaW9uLl90eXBlID09PSBcIk5vdFwiKSB7XG5cdFx0Ly8gaWZFbHNlKG5vdChYKSwgYSwgYikgLS0+IGlmRWxzZShYLCBiLCBhKVxuXHRcdFtvblRydWVFeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbl0gPSBbb25GYWxzZUV4cHJlc3Npb24sIG9uVHJ1ZUV4cHJlc3Npb25dO1xuXHRcdGNvbmRpdGlvbkV4cHJlc3Npb24gPSBub3QoY29uZGl0aW9uRXhwcmVzc2lvbik7XG5cdH1cblxuXHQvLyBpbmxpbmUgbmVzdGVkIGlmLWVsc2UgZXhwcmVzc2lvbnM6IG9uVHJ1ZSBicmFuY2hcblx0Ly8gaWZFbHNlKFgsIGlmRWxzZShYLCBhLCBiKSwgYykgPT0+IGlmRWxzZShYLCBhLCBjKVxuXHRpZiAob25UcnVlRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGNvbmRpdGlvbkV4cHJlc3Npb24sIG9uVHJ1ZUV4cHJlc3Npb24uY29uZGl0aW9uKSkge1xuXHRcdG9uVHJ1ZUV4cHJlc3Npb24gPSBvblRydWVFeHByZXNzaW9uLm9uVHJ1ZTtcblx0fVxuXG5cdC8vIGlubGluZSBuZXN0ZWQgaWYtZWxzZSBleHByZXNzaW9uczogb25GYWxzZSBicmFuY2hcblx0Ly8gaWZFbHNlKFgsIGEsIGlmRWxzZShYLCBiLCBjKSkgPT0+IGlmRWxzZShYLCBhLCBjKVxuXHRpZiAob25GYWxzZUV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChjb25kaXRpb25FeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbi5jb25kaXRpb24pKSB7XG5cdFx0b25GYWxzZUV4cHJlc3Npb24gPSBvbkZhbHNlRXhwcmVzc2lvbi5vbkZhbHNlO1xuXHR9XG5cblx0Ly8gKGlmIHRydWUgdGhlbiBhIGVsc2UgYikgIH5+PiBhXG5cdC8vIChpZiBmYWxzZSB0aGVuIGEgZWxzZSBiKSB+fj4gYlxuXHRpZiAoaXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25kaXRpb25FeHByZXNzaW9uLnZhbHVlID8gb25UcnVlRXhwcmVzc2lvbiA6IG9uRmFsc2VFeHByZXNzaW9uO1xuXHR9XG5cblx0Ly8gaWYgKGlzQ29uc3RhbnRCb29sZWFuKG9uVHJ1ZUV4cHJlc3Npb24pIHx8IGlzQ29uc3RhbnRCb29sZWFuKG9uRmFsc2VFeHByZXNzaW9uKSkge1xuXHQvLyBcdHJldHVybiBvcihhbmQoY29uZGl0aW9uLCBvblRydWVFeHByZXNzaW9uIGFzIEV4cHJlc3Npb248Ym9vbGVhbj4pLCBhbmQobm90KGNvbmRpdGlvbiksIG9uRmFsc2VFeHByZXNzaW9uIGFzIEV4cHJlc3Npb248Ym9vbGVhbj4pKSBhcyBFeHByZXNzaW9uPFQ+XG5cdC8vIH1cblx0Ly8gKGlmIFggdGhlbiBhIGVsc2UgYSkgfn4+IGFcblx0aWYgKF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwob25UcnVlRXhwcmVzc2lvbiwgb25GYWxzZUV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIG9uVHJ1ZUV4cHJlc3Npb247XG5cdH1cblxuXHQvLyBpZiBYIHRoZW4gYSBlbHNlIGZhbHNlIH5+PiBYICYmIGFcblx0aWYgKGlzRmFsc2Uob25GYWxzZUV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGFuZChjb25kaXRpb25FeHByZXNzaW9uLCBvblRydWVFeHByZXNzaW9uIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPikgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHR9XG5cblx0Ly8gaWYgWCB0aGVuIGEgZWxzZSB0cnVlIH5+PiAhWCB8fCBhXG5cdGlmIChpc1RydWUob25GYWxzZUV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIG9yKG5vdChjb25kaXRpb25FeHByZXNzaW9uKSwgb25UcnVlRXhwcmVzc2lvbiBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0fVxuXG5cdC8vIGlmIFggdGhlbiBmYWxzZSBlbHNlIGEgfn4+ICFYICYmIGFcblx0aWYgKGlzRmFsc2Uob25UcnVlRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gYW5kKG5vdChjb25kaXRpb25FeHByZXNzaW9uKSwgb25GYWxzZUV4cHJlc3Npb24gYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+KSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdH1cblxuXHQvLyBpZiBYIHRoZW4gdHJ1ZSBlbHNlIGEgfn4+IFggfHwgYVxuXHRpZiAoaXNUcnVlKG9uVHJ1ZUV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIG9yKGNvbmRpdGlvbkV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPikgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHR9XG5cdGlmIChpc0NvbXBsZXhUeXBlRXhwcmVzc2lvbihjb25kaXRpb24pIHx8IGlzQ29tcGxleFR5cGVFeHByZXNzaW9uKG9uVHJ1ZSkgfHwgaXNDb21wbGV4VHlwZUV4cHJlc3Npb24ob25GYWxzZSkpIHtcblx0XHRsZXQgcGF0aElkeCA9IDA7XG5cdFx0Y29uc3QgbXlJZkVsc2VFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFtjb25kaXRpb24sIG9uVHJ1ZSwgb25GYWxzZV0sIFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5TdGFuZGFyZEZvcm1hdHRlciNpZkVsc2VcIik7XG5cdFx0Y29uc3QgYWxsUGFydHMgPSBbXTtcblx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShcblx0XHRcdG15SWZFbHNlRXhwcmVzc2lvbixcblx0XHRcdFwiUGF0aEluTW9kZWxcIixcblx0XHRcdChjb25zdGFudFBhdGg6IFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxhbnk+KSA9PiB7XG5cdFx0XHRcdGFsbFBhcnRzLnB1c2goY29uc3RhbnRQYXRoKTtcblx0XHRcdFx0cmV0dXJuIHBhdGhJbk1vZGVsKGBcXCQke3BhdGhJZHgrK31gLCBcIiRcIik7XG5cdFx0XHR9LFxuXHRcdFx0dHJ1ZVxuXHRcdCk7XG5cdFx0YWxsUGFydHMudW5zaGlmdChjb25zdGFudChKU09OLnN0cmluZ2lmeShteUlmRWxzZUV4cHJlc3Npb24pKSk7XG5cdFx0cmV0dXJuIGZvcm1hdFJlc3VsdChhbGxQYXJ0cywgXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlN0YW5kYXJkRm9ybWF0dGVyI2V2YWx1YXRlQ29tcGxleEV4cHJlc3Npb25cIiwgdW5kZWZpbmVkLCB0cnVlKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIklmRWxzZVwiLFxuXHRcdGNvbmRpdGlvbjogY29uZGl0aW9uRXhwcmVzc2lvbixcblx0XHRvblRydWU6IG9uVHJ1ZUV4cHJlc3Npb24sXG5cdFx0b25GYWxzZTogb25GYWxzZUV4cHJlc3Npb25cblx0fTtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBleHByZXNzaW9uIGhhcyBhIHJlZmVyZW5jZSB0byB0aGUgZGVmYXVsdCBtb2RlbCAodW5kZWZpbmVkKS5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZVxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBkZWZhdWx0IGNvbnRleHRcbiAqL1xuZnVuY3Rpb24gaGFzUmVmZXJlbmNlVG9EZWZhdWx0Q29udGV4dChleHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55Pik6IGJvb2xlYW4ge1xuXHRzd2l0Y2ggKGV4cHJlc3Npb24uX3R5cGUpIHtcblx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0Y2FzZSBcIkNvbXBsZXhUeXBlXCI6XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0Y2FzZSBcIlNldFwiOlxuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb24ub3BlcmFuZHMuc29tZShoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KTtcblx0XHRjYXNlIFwiUGF0aEluTW9kZWxcIjpcblx0XHRcdHJldHVybiBleHByZXNzaW9uLm1vZGVsTmFtZSA9PT0gdW5kZWZpbmVkO1xuXHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRyZXR1cm4gaGFzUmVmZXJlbmNlVG9EZWZhdWx0Q29udGV4dChleHByZXNzaW9uLm9wZXJhbmQxKSB8fCBoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub3BlcmFuZDIpO1xuXHRcdGNhc2UgXCJJZkVsc2VcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5jb25kaXRpb24pIHx8XG5cdFx0XHRcdGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vblRydWUpIHx8XG5cdFx0XHRcdGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vbkZhbHNlKVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiTm90XCI6XG5cdFx0Y2FzZSBcIlRydXRoeVwiOlxuXHRcdFx0cmV0dXJuIGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vcGVyYW5kKTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbnR5cGUgRm48VD4gPSAoKC4uLnBhcmFtczogYW55KSA9PiBUKSAmIHtcblx0X19mdW5jdGlvbk5hbWU6IHN0cmluZztcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgV3JhcHBlZFR1cGxlXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbi8vIEB0cy1pZ25vcmVcbnR5cGUgV3JhcHBlZFR1cGxlPFQ+ID0geyBbSyBpbiBrZXlvZiBUXTogV3JhcHBlZFR1cGxlPFRbS10+IHwgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFRbS10+IH07XG5cbi8vIFNvLCB0aGlzIHdvcmtzIGJ1dCBJIGNhbm5vdCBnZXQgaXQgdG8gY29tcGlsZSA6RCwgYnV0IGl0IHN0aWxsIGRvZXMgd2hhdCBpcyBleHBlY3RlZC4uLlxuXG4vKipcbiAqIEEgZnVuY3Rpb24gcmVmZXJlbmNlIG9yIGEgZnVuY3Rpb24gbmFtZS5cbiAqL1xudHlwZSBGdW5jdGlvbk9yTmFtZTxUPiA9IEZuPFQ+IHwgc3RyaW5nO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHBhcmFtZXRlcnMsIGVpdGhlciBkZXJpdmVkIGZyb20gdGhlIGZ1bmN0aW9uIG9yIGFuIHVudHlwZWQgYXJyYXkuXG4gKi9cbnR5cGUgRnVuY3Rpb25QYXJhbWV0ZXJzPFQsIEYgZXh0ZW5kcyBGdW5jdGlvbk9yTmFtZTxUPj4gPSBGIGV4dGVuZHMgRm48VD4gPyBQYXJhbWV0ZXJzPEY+IDogYW55W107XG5cbi8qKlxuICogQ2FsbHMgYSBmb3JtYXR0ZXIgZnVuY3Rpb24gdG8gcHJvY2VzcyB0aGUgcGFyYW1ldGVycy5cbiAqIElmIHJlcXVpcmVDb250ZXh0IGlzIHNldCB0byB0cnVlIGFuZCBubyBjb250ZXh0IGlzIHBhc3NlZCBhIGRlZmF1bHQgY29udGV4dCB3aWxsIGJlIGFkZGVkIGF1dG9tYXRpY2FsbHkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEB0ZW1wbGF0ZSBVXG4gKiBAcGFyYW0gcGFyYW1ldGVycyBUaGUgbGlzdCBvZiBwYXJhbWV0ZXIgdGhhdCBzaG91bGQgbWF0Y2ggdGhlIHR5cGUgYW5kIG51bWJlciBvZiB0aGUgZm9ybWF0dGVyIGZ1bmN0aW9uXG4gKiBAcGFyYW0gZm9ybWF0dGVyRnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSBbY29udGV4dEVudGl0eVR5cGVdIFRoZSBjb250ZXh0IGVudGl0eSB0eXBlIHRvIGNvbnNpZGVyXG4gKiBAcGFyYW0gW2lnbm9yZUNvbXBsZXhUeXBlXSBXaGV0aGVyIHRvIGlnbm9yZSB0aGUgdHJhbnNnZm9ybWF0aW9uIHRvIHRoZSBTdGFuZGFyZEZvcm1hdHRlciBvciBub3RcbiAqIEByZXR1cm5zIFRoZSBjb3JyZXNwb25kaW5nIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFJlc3VsdDxULCBVIGV4dGVuZHMgRm48VD4+KFxuXHRwYXJhbWV0ZXJzOiBXcmFwcGVkVHVwbGU8UGFyYW1ldGVyczxVPj4sXG5cdGZvcm1hdHRlckZ1bmN0aW9uOiBVIHwgc3RyaW5nLFxuXHRjb250ZXh0RW50aXR5VHlwZT86IEVudGl0eVR5cGUsXG5cdGlnbm9yZUNvbXBsZXhUeXBlID0gZmFsc2Vcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPiB7XG5cdGNvbnN0IHBhcmFtZXRlckV4cHJlc3Npb25zID0gKHBhcmFtZXRlcnMgYXMgYW55W10pLm1hcCh3cmFwUHJpbWl0aXZlKTtcblxuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24oLi4ucGFyYW1ldGVyRXhwcmVzc2lvbnMpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9XG5cdGlmIChjb250ZXh0RW50aXR5VHlwZSkge1xuXHRcdC8vIE90aGVyd2lzZSwgaWYgdGhlIGNvbnRleHQgaXMgcmVxdWlyZWQgYW5kIG5vIGNvbnRleHQgaXMgcHJvdmlkZWQgbWFrZSBzdXJlIHRvIGFkZCB0aGUgZGVmYXVsdCBiaW5kaW5nXG5cdFx0aWYgKCFwYXJhbWV0ZXJFeHByZXNzaW9ucy5zb21lKGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQpKSB7XG5cdFx0XHRjb250ZXh0RW50aXR5VHlwZS5rZXlzLmZvckVhY2goKGtleSkgPT4gcGFyYW1ldGVyRXhwcmVzc2lvbnMucHVzaChwYXRoSW5Nb2RlbChrZXkubmFtZSwgXCJcIikpKTtcblx0XHR9XG5cdH1cblx0bGV0IGZ1bmN0aW9uTmFtZSA9IFwiXCI7XG5cdGlmICh0eXBlb2YgZm9ybWF0dGVyRnVuY3Rpb24gPT09IFwic3RyaW5nXCIpIHtcblx0XHRmdW5jdGlvbk5hbWUgPSBmb3JtYXR0ZXJGdW5jdGlvbjtcblx0fSBlbHNlIHtcblx0XHRmdW5jdGlvbk5hbWUgPSBmb3JtYXR0ZXJGdW5jdGlvbi5fX2Z1bmN0aW9uTmFtZTtcblx0fVxuXHQvLyBGb3JtYXR0ZXJOYW1lIGNhbiBiZSBvZiBmb3JtYXQgc2FwLmZlLmNvcmUueHh4I21ldGhvZE5hbWUgdG8gaGF2ZSBtdWx0aXBsZSBmb3JtYXR0ZXIgaW4gb25lIGNsYXNzXG5cdGNvbnN0IFtmb3JtYXR0ZXJDbGFzcywgZm9ybWF0dGVyTmFtZV0gPSBmdW5jdGlvbk5hbWUuc3BsaXQoXCIjXCIpO1xuXG5cdC8vIEluIHNvbWUgY2FzZSB3ZSBhbHNvIGNhbm5vdCBjYWxsIGRpcmVjdGx5IGEgZnVuY3Rpb24gYmVjYXVzZSBvZiB0b28gY29tcGxleCBpbnB1dCwgaW4gdGhhdCBjYXNlIHdlIG5lZWQgdG8gY29udmVydCB0byBhIHNpbXBsZXIgZnVuY3Rpb24gY2FsbFxuXHRpZiAoIWlnbm9yZUNvbXBsZXhUeXBlICYmIChwYXJhbWV0ZXJFeHByZXNzaW9ucy5zb21lKGlzQ29tcGxleFR5cGVFeHByZXNzaW9uKSB8fCBwYXJhbWV0ZXJFeHByZXNzaW9ucy5zb21lKGlzQ29uY2F0RXhwcmVzc2lvbikpKSB7XG5cdFx0bGV0IHBhdGhJZHggPSAwO1xuXHRcdGNvbnN0IG15Rm9ybWF0RXhwcmVzc2lvbiA9IGZvcm1hdFJlc3VsdChwYXJhbWV0ZXJFeHByZXNzaW9ucywgZnVuY3Rpb25OYW1lLCB1bmRlZmluZWQsIHRydWUpO1xuXHRcdGNvbnN0IGFsbFBhcnRzID0gW107XG5cdFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkobXlGb3JtYXRFeHByZXNzaW9uLCBcIlBhdGhJbk1vZGVsXCIsIChjb25zdGFudFBhdGg6IFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxhbnk+KSA9PiB7XG5cdFx0XHRhbGxQYXJ0cy5wdXNoKGNvbnN0YW50UGF0aCk7XG5cdFx0XHRyZXR1cm4gcGF0aEluTW9kZWwoYFxcJCR7cGF0aElkeCsrfWAsIFwiJFwiKTtcblx0XHR9KTtcblx0XHRhbGxQYXJ0cy51bnNoaWZ0KGNvbnN0YW50KEpTT04uc3RyaW5naWZ5KG15Rm9ybWF0RXhwcmVzc2lvbikpKTtcblx0XHRyZXR1cm4gZm9ybWF0UmVzdWx0KGFsbFBhcnRzLCBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuU3RhbmRhcmRGb3JtYXR0ZXIjZXZhbHVhdGVDb21wbGV4RXhwcmVzc2lvblwiLCB1bmRlZmluZWQsIHRydWUpO1xuXHR9IGVsc2UgaWYgKCEhZm9ybWF0dGVyTmFtZSAmJiBmb3JtYXR0ZXJOYW1lLmxlbmd0aCA+IDApIHtcblx0XHRwYXJhbWV0ZXJFeHByZXNzaW9ucy51bnNoaWZ0KGNvbnN0YW50KGZvcm1hdHRlck5hbWUpKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiRm9ybWF0dGVyXCIsXG5cdFx0Zm46IGZvcm1hdHRlckNsYXNzLFxuXHRcdHBhcmFtZXRlcnM6IHBhcmFtZXRlckV4cHJlc3Npb25zXG5cdH07XG59XG5cbi8qKlxuICogQ2FsbHMgYSBjb21wbGV4IHR5cGUgdG8gcHJvY2VzcyB0aGUgcGFyYW1ldGVycy5cbiAqIElmIHJlcXVpcmVDb250ZXh0IGlzIHNldCB0byB0cnVlIGFuZCBubyBjb250ZXh0IGlzIHBhc3NlZCwgYSBkZWZhdWx0IGNvbnRleHQgd2lsbCBiZSBhZGRlZCBhdXRvbWF0aWNhbGx5LlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdGVtcGxhdGUgVVxuICogQHBhcmFtIHBhcmFtZXRlcnMgVGhlIGxpc3Qgb2YgcGFyYW1ldGVycyB0aGF0IHNob3VsZCBtYXRjaCB0aGUgdHlwZSBmb3IgdGhlIGNvbXBsZXggdHlwZT1cbiAqIEBwYXJhbSB0eXBlIFRoZSBjb21wbGV4IHR5cGUgdG8gdXNlXG4gKiBAcGFyYW0gW2NvbnRleHRFbnRpdHlUeXBlXSBUaGUgY29udGV4dCBlbnRpdHkgdHlwZSB0byBjb25zaWRlclxuICogQHBhcmFtIG9Gb3JtYXRPcHRpb25zXG4gKiBAcmV0dXJucyBUaGUgY29ycmVzcG9uZGluZyBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUeXBlSW5mb3JtYXRpb248VCwgVSBleHRlbmRzIEZuPFQ+Pihcblx0cGFyYW1ldGVyczogV3JhcHBlZFR1cGxlPFBhcmFtZXRlcnM8VT4+LFxuXHR0eXBlOiBzdHJpbmcsXG5cdGNvbnRleHRFbnRpdHlUeXBlPzogRW50aXR5VHlwZSxcblx0b0Zvcm1hdE9wdGlvbnM/OiBhbnlcbik6IFVucmVzb2x2ZWFibGVQYXRoRXhwcmVzc2lvbiB8IENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPiB8IENvbnN0YW50RXhwcmVzc2lvbjxUPiB7XG5cdGNvbnN0IHBhcmFtZXRlckV4cHJlc3Npb25zID0gKHBhcmFtZXRlcnMgYXMgYW55W10pLm1hcCh3cmFwUHJpbWl0aXZlKTtcblx0aWYgKGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKC4uLnBhcmFtZXRlckV4cHJlc3Npb25zKSkge1xuXHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0fVxuXHQvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBwYXJhbWV0ZXIgYW5kIGl0IGlzIGEgY29uc3RhbnQgYW5kIHdlIGRvbid0IGV4cGVjdCB0aGUgY29udGV4dCB0aGVuIHJldHVybiB0aGUgY29uc3RhbnRcblx0aWYgKHBhcmFtZXRlckV4cHJlc3Npb25zLmxlbmd0aCA9PT0gMSAmJiBpc0NvbnN0YW50KHBhcmFtZXRlckV4cHJlc3Npb25zWzBdKSAmJiAhY29udGV4dEVudGl0eVR5cGUpIHtcblx0XHRyZXR1cm4gcGFyYW1ldGVyRXhwcmVzc2lvbnNbMF07XG5cdH0gZWxzZSBpZiAoY29udGV4dEVudGl0eVR5cGUpIHtcblx0XHQvLyBPdGhlcndpc2UsIGlmIHRoZSBjb250ZXh0IGlzIHJlcXVpcmVkIGFuZCBubyBjb250ZXh0IGlzIHByb3ZpZGVkIG1ha2Ugc3VyZSB0byBhZGQgdGhlIGRlZmF1bHQgYmluZGluZ1xuXHRcdGlmICghcGFyYW1ldGVyRXhwcmVzc2lvbnMuc29tZShoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KSkge1xuXHRcdFx0Y29udGV4dEVudGl0eVR5cGUua2V5cy5mb3JFYWNoKChrZXkpID0+IHBhcmFtZXRlckV4cHJlc3Npb25zLnB1c2gocGF0aEluTW9kZWwoa2V5Lm5hbWUsIFwiXCIpKSk7XG5cdFx0fVxuXHR9XG5cdC8vIGlmIHNob3dNZWFzdXJlIGlzIHNldCB0byBmYWxzZSB3ZSB3YW50IHRvIG5vdCBwYXJzZSBhcyBzdHJpbmcgdG8gc2VlIHRoZSAwXG5cdC8vIHdlIGRvIHRoYXQgYWxzbyBmb3IgYWxsIGJpbmRpbmdzIGJlY2F1c2Ugb3RoZXJ3aXNlIHRoZSBtZGMgRmllbGQgaXNuJ3QgZWRpdGFibGVcblx0aWYgKFxuXHRcdCEob0Zvcm1hdE9wdGlvbnMgJiYgb0Zvcm1hdE9wdGlvbnMuc2hvd051bWJlciA9PT0gZmFsc2UpICYmXG5cdFx0KChwYXJhbWV0ZXJzWzBdIGFzIGFueSk/LnR5cGU/LmluZGV4T2YoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5JbnRcIikgPT09IDAgfHxcblx0XHRcdChwYXJhbWV0ZXJzWzBdIGFzIGFueSk/LnR5cGU/LmluZGV4T2YoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5EZWNpbWFsXCIpID09PSAwIHx8XG5cdFx0XHQocGFyYW1ldGVyc1swXSBhcyBhbnkpPy50eXBlPy5pbmRleE9mKFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuRG91YmxlXCIpID09PSAwKVxuXHQpIHtcblx0XHRpZiAoXG5cdFx0XHQocGFyYW1ldGVyc1swXSBhcyBhbnkpPy50eXBlID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludDY0XCIgfHxcblx0XHRcdChwYXJhbWV0ZXJzWzBdIGFzIGFueSk/LnR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuRGVjaW1hbFwiXG5cdFx0KSB7XG5cdFx0XHQvL3NhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludDY0IGRvIG5vdCBzdXBwb3J0IHBhcnNlQXNTdHJpbmcgZmFsc2Vcblx0XHRcdG9Gb3JtYXRPcHRpb25zID0gb0Zvcm1hdE9wdGlvbnM/LnNob3dNZWFzdXJlID09PSBmYWxzZSA/IHsgZW1wdHlTdHJpbmc6IFwiXCIsIHNob3dNZWFzdXJlOiBmYWxzZSB9IDogeyBlbXB0eVN0cmluZzogXCJcIiB9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvRm9ybWF0T3B0aW9ucyA9XG5cdFx0XHRcdG9Gb3JtYXRPcHRpb25zPy5zaG93TWVhc3VyZSA9PT0gZmFsc2Vcblx0XHRcdFx0XHQ/IHsgcGFyc2VBc1N0cmluZzogZmFsc2UsIGVtcHR5U3RyaW5nOiBcIlwiLCBzaG93TWVhc3VyZTogZmFsc2UgfVxuXHRcdFx0XHRcdDogeyBwYXJzZUFzU3RyaW5nOiBmYWxzZSwgZW1wdHlTdHJpbmc6IFwiXCIgfTtcblx0XHR9XG5cdH1cblx0aWYgKHR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuVW5pdFwiKSB7XG5cdFx0Y29uc3QgdW9tUGF0aCA9IHBhdGhJbk1vZGVsKFwiLyMjQEByZXF1ZXN0VW5pdHNPZk1lYXN1cmVcIik7XG5cdFx0dW9tUGF0aC50YXJnZXRUeXBlID0gXCJhbnlcIjtcblx0XHR1b21QYXRoLm1vZGUgPSBcIk9uZVRpbWVcIjtcblx0XHRwYXJhbWV0ZXJFeHByZXNzaW9ucy5wdXNoKHVvbVBhdGgpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQ3VycmVuY3lcIikge1xuXHRcdGNvbnN0IGN1cnJlbmN5UGF0aCA9IHBhdGhJbk1vZGVsKFwiLyMjQEByZXF1ZXN0Q3VycmVuY3lDb2Rlc1wiKTtcblx0XHRjdXJyZW5jeVBhdGgudGFyZ2V0VHlwZSA9IFwiYW55XCI7XG5cdFx0Y3VycmVuY3lQYXRoLm1vZGUgPSBcIk9uZVRpbWVcIjtcblx0XHRwYXJhbWV0ZXJFeHByZXNzaW9ucy5wdXNoKGN1cnJlbmN5UGF0aCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkNvbXBsZXhUeXBlXCIsXG5cdFx0dHlwZTogdHlwZSxcblx0XHRmb3JtYXRPcHRpb25zOiBvRm9ybWF0T3B0aW9ucyB8fCB7fSxcblx0XHRwYXJhbWV0ZXJzOiB7fSxcblx0XHRiaW5kaW5nUGFyYW1ldGVyczogcGFyYW1ldGVyRXhwcmVzc2lvbnNcblx0fTtcbn1cbi8qKlxuICogRnVuY3Rpb24gY2FsbCwgb3B0aW9uYWxseSB3aXRoIGFyZ3VtZW50cy5cbiAqXG4gKiBAcGFyYW0gZnVuYyBGdW5jdGlvbiBuYW1lIG9yIHJlZmVyZW5jZSB0byBmdW5jdGlvblxuICogQHBhcmFtIHBhcmFtZXRlcnMgQXJndW1lbnRzXG4gKiBAcGFyYW0gb24gT2JqZWN0IHRvIGNhbGwgdGhlIGZ1bmN0aW9uIG9uXG4gKiBAcmV0dXJucyBFeHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgZnVuY3Rpb24gY2FsbCAobm90IHRoZSByZXN1bHQgb2YgdGhlIGZ1bmN0aW9uIGNhbGwhKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm48VCwgVSBleHRlbmRzIEZ1bmN0aW9uT3JOYW1lPFQ+Pihcblx0ZnVuYzogVSxcblx0cGFyYW1ldGVyczogV3JhcHBlZFR1cGxlPEZ1bmN0aW9uUGFyYW1ldGVyczxULCBVPj4sXG5cdG9uPzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPG9iamVjdD5cbik6IEZ1bmN0aW9uRXhwcmVzc2lvbjxUPiB7XG5cdGNvbnN0IGZ1bmN0aW9uTmFtZSA9IHR5cGVvZiBmdW5jID09PSBcInN0cmluZ1wiID8gZnVuYyA6IGZ1bmMuX19mdW5jdGlvbk5hbWU7XG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiRnVuY3Rpb25cIixcblx0XHRvYmo6IG9uICE9PSB1bmRlZmluZWQgPyB3cmFwUHJpbWl0aXZlKG9uKSA6IHVuZGVmaW5lZCxcblx0XHRmbjogZnVuY3Rpb25OYW1lLFxuXHRcdHBhcmFtZXRlcnM6IChwYXJhbWV0ZXJzIGFzIGFueVtdKS5tYXAod3JhcFByaW1pdGl2ZSlcblx0fTtcbn1cblxuLyoqXG4gKiBTaG9ydGN1dCBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBiaW5kaW5nIHZhbHVlIGlzIG51bGwsIHVuZGVmaW5lZCBvciBlbXB0eS5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvblxuICogQHJldHVybnMgQSBCb29sZWFuIGV4cHJlc3Npb24gZXZhbHVhdGluZyB0aGUgZmFjdCB0aGF0IHRoZSBjdXJyZW50IGVsZW1lbnQgaXMgZW1wdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHkoZXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBhQmluZGluZ3M6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPltdID0gW107XG5cdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24sIFwiUGF0aEluTW9kZWxcIiwgKGV4cHIpID0+IHtcblx0XHRhQmluZGluZ3MucHVzaChvcihlcXVhbChleHByLCBcIlwiKSwgZXF1YWwoZXhwciwgdW5kZWZpbmVkKSwgZXF1YWwoZXhwciwgbnVsbCkpKTtcblx0XHRyZXR1cm4gZXhwcjtcblx0fSk7XG5cdHJldHVybiBhbmQoLi4uYUJpbmRpbmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdCguLi5pbkV4cHJlc3Npb25zOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8c3RyaW5nPltdKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBleHByZXNzaW9ucyA9IGluRXhwcmVzc2lvbnMubWFwKHdyYXBQcmltaXRpdmUpO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24oLi4uZXhwcmVzc2lvbnMpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9XG5cdGlmIChleHByZXNzaW9ucy5ldmVyeShpc0NvbnN0YW50KSkge1xuXHRcdHJldHVybiBjb25zdGFudChcblx0XHRcdGV4cHJlc3Npb25zLnJlZHVjZSgoY29uY2F0ZW5hdGVkOiBzdHJpbmcsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmICh2YWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbmNhdGVuYXRlZCArICh2YWx1ZSBhcyBDb25zdGFudEV4cHJlc3Npb248YW55PikudmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY29uY2F0ZW5hdGVkO1xuXHRcdFx0fSwgXCJcIilcblx0XHQpO1xuXHR9IGVsc2UgaWYgKGV4cHJlc3Npb25zLnNvbWUoaXNDb21wbGV4VHlwZUV4cHJlc3Npb24pKSB7XG5cdFx0bGV0IHBhdGhJZHggPSAwO1xuXHRcdGNvbnN0IG15Q29uY2F0RXhwcmVzc2lvbiA9IGZvcm1hdFJlc3VsdChleHByZXNzaW9ucywgXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlN0YW5kYXJkRm9ybWF0dGVyI2NvbmNhdFwiLCB1bmRlZmluZWQsIHRydWUpO1xuXHRcdGNvbnN0IGFsbFBhcnRzID0gW107XG5cdFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkobXlDb25jYXRFeHByZXNzaW9uLCBcIlBhdGhJbk1vZGVsXCIsIChjb25zdGFudFBhdGg6IFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxhbnk+KSA9PiB7XG5cdFx0XHRhbGxQYXJ0cy5wdXNoKGNvbnN0YW50UGF0aCk7XG5cdFx0XHRyZXR1cm4gcGF0aEluTW9kZWwoYFxcJCR7cGF0aElkeCsrfWAsIFwiJFwiKTtcblx0XHR9KTtcblx0XHRhbGxQYXJ0cy51bnNoaWZ0KGNvbnN0YW50KEpTT04uc3RyaW5naWZ5KG15Q29uY2F0RXhwcmVzc2lvbikpKTtcblx0XHRyZXR1cm4gZm9ybWF0UmVzdWx0KGFsbFBhcnRzLCBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuU3RhbmRhcmRGb3JtYXR0ZXIjZXZhbHVhdGVDb21wbGV4RXhwcmVzc2lvblwiLCB1bmRlZmluZWQsIHRydWUpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiQ29uY2F0XCIsXG5cdFx0ZXhwcmVzc2lvbnM6IGV4cHJlc3Npb25zXG5cdH07XG59XG5cbmV4cG9ydCB0eXBlIFRyYW5zZm9ybUZ1bmN0aW9uID0gPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlIHwgdW5rbm93bj4oZXhwcmVzc2lvblBhcnQ6IGFueSkgPT4gQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuZXhwb3J0IHR5cGUgRXhwcmVzc2lvblR5cGUgPSBQaWNrPEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+LCBcIl90eXBlXCI+W1wiX3R5cGVcIl07XG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUmVjdXJzaXZlbHk8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGUgfCB1bmtub3duPihcblx0aW5FeHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD4sXG5cdGV4cHJlc3Npb25UeXBlOiBFeHByZXNzaW9uVHlwZSxcblx0dHJhbnNmb3JtRnVuY3Rpb246IFRyYW5zZm9ybUZ1bmN0aW9uLFxuXHRpbmNsdWRlQWxsRXhwcmVzc2lvbiA9IGZhbHNlXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD4ge1xuXHRsZXQgZXhwcmVzc2lvbiA9IGluRXhwcmVzc2lvbjtcblx0c3dpdGNoIChleHByZXNzaW9uLl90eXBlKSB7XG5cdFx0Y2FzZSBcIkZ1bmN0aW9uXCI6XG5cdFx0Y2FzZSBcIkZvcm1hdHRlclwiOlxuXHRcdFx0ZXhwcmVzc2lvbi5wYXJhbWV0ZXJzID0gZXhwcmVzc2lvbi5wYXJhbWV0ZXJzLm1hcCgocGFyYW1ldGVyKSA9PlxuXHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShwYXJhbWV0ZXIsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pXG5cdFx0XHQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkNvbmNhdFwiOlxuXHRcdFx0ZXhwcmVzc2lvbi5leHByZXNzaW9ucyA9IGV4cHJlc3Npb24uZXhwcmVzc2lvbnMubWFwKChzdWJFeHByZXNzaW9uKSA9PlxuXHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShzdWJFeHByZXNzaW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24sIGluY2x1ZGVBbGxFeHByZXNzaW9uKVxuXHRcdFx0KTtcblx0XHRcdGV4cHJlc3Npb24gPSBjb25jYXQoLi4uZXhwcmVzc2lvbi5leHByZXNzaW9ucykgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkNvbXBsZXhUeXBlXCI6XG5cdFx0XHRleHByZXNzaW9uLmJpbmRpbmdQYXJhbWV0ZXJzID0gZXhwcmVzc2lvbi5iaW5kaW5nUGFyYW1ldGVycy5tYXAoKGJpbmRpbmdQYXJhbWV0ZXIpID0+XG5cdFx0XHRcdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGJpbmRpbmdQYXJhbWV0ZXIsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pXG5cdFx0XHQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIklmRWxzZVwiOlxuXHRcdFx0Y29uc3Qgb25UcnVlID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vblRydWUsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pO1xuXHRcdFx0Y29uc3Qgb25GYWxzZSA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub25GYWxzZSwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbik7XG5cdFx0XHRsZXQgY29uZGl0aW9uID0gZXhwcmVzc2lvbi5jb25kaXRpb247XG5cdFx0XHRpZiAoaW5jbHVkZUFsbEV4cHJlc3Npb24pIHtcblx0XHRcdFx0Y29uZGl0aW9uID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5jb25kaXRpb24sIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pO1xuXHRcdFx0fVxuXHRcdFx0ZXhwcmVzc2lvbiA9IGlmRWxzZShjb25kaXRpb24sIG9uVHJ1ZSwgb25GYWxzZSkgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+O1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdFx0aWYgKGluY2x1ZGVBbGxFeHByZXNzaW9uKSB7XG5cdFx0XHRcdGNvbnN0IG9wZXJhbmQgPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLm9wZXJhbmQsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pO1xuXHRcdFx0XHRleHByZXNzaW9uID0gbm90KG9wZXJhbmQpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPjtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJUcnV0aHlcIjpcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJTZXRcIjpcblx0XHRcdGlmIChpbmNsdWRlQWxsRXhwcmVzc2lvbikge1xuXHRcdFx0XHRjb25zdCBvcGVyYW5kcyA9IGV4cHJlc3Npb24ub3BlcmFuZHMubWFwKChvcGVyYW5kKSA9PlxuXHRcdFx0XHRcdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KG9wZXJhbmQsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGV4cHJlc3Npb24gPVxuXHRcdFx0XHRcdGV4cHJlc3Npb24ub3BlcmF0b3IgPT09IFwifHxcIlxuXHRcdFx0XHRcdFx0PyAob3IoLi4ub3BlcmFuZHMpIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxUPilcblx0XHRcdFx0XHRcdDogKGFuZCguLi5vcGVyYW5kcykgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPFQ+KTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRpZiAoaW5jbHVkZUFsbEV4cHJlc3Npb24pIHtcblx0XHRcdFx0Y29uc3Qgb3BlcmFuZDEgPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLm9wZXJhbmQxLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24sIGluY2x1ZGVBbGxFeHByZXNzaW9uKTtcblx0XHRcdFx0Y29uc3Qgb3BlcmFuZDIgPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLm9wZXJhbmQyLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24sIGluY2x1ZGVBbGxFeHByZXNzaW9uKTtcblx0XHRcdFx0ZXhwcmVzc2lvbiA9IGNvbXBhcmlzb24oZXhwcmVzc2lvbi5vcGVyYXRvciwgb3BlcmFuZDEsIG9wZXJhbmQyKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248VD47XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiUmVmXCI6XG5cdFx0Y2FzZSBcIkxlbmd0aFwiOlxuXHRcdGNhc2UgXCJQYXRoSW5Nb2RlbFwiOlxuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdGNhc2UgXCJFbWJlZGRlZEJpbmRpbmdcIjpcblx0XHRjYXNlIFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiOlxuXHRcdGNhc2UgXCJVbnJlc29sdmFibGVcIjpcblx0XHRcdC8vIERvIG5vdGhpbmdcblx0XHRcdGJyZWFrO1xuXHR9XG5cdGlmIChleHByZXNzaW9uVHlwZSA9PT0gZXhwcmVzc2lvbi5fdHlwZSkge1xuXHRcdGV4cHJlc3Npb24gPSB0cmFuc2Zvcm1GdW5jdGlvbihpbkV4cHJlc3Npb24pO1xuXHR9XG5cdHJldHVybiBleHByZXNzaW9uO1xufVxuXG5leHBvcnQgdHlwZSBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiA9IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuY29uc3QgbmVlZFBhcmVudGhlc2lzID0gZnVuY3Rpb24gPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihleHByOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4pOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHQhaXNDb25zdGFudChleHByKSAmJiAhaXNQYXRoSW5Nb2RlbEV4cHJlc3Npb24oZXhwcikgJiYgaXNFeHByZXNzaW9uKGV4cHIpICYmIGV4cHIuX3R5cGUgIT09IFwiSWZFbHNlXCIgJiYgZXhwci5fdHlwZSAhPT0gXCJGdW5jdGlvblwiXG5cdCk7XG59O1xuXG4vKipcbiAqIENvbXBpbGVzIGEgY29uc3RhbnQgb2JqZWN0IHRvIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSBleHByXG4gKiBAcGFyYW0gaXNOdWxsYWJsZVxuICogQHJldHVybnMgVGhlIGNvbXBpbGVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBjb21waWxlQ29uc3RhbnRPYmplY3QoZXhwcjogQ29uc3RhbnRFeHByZXNzaW9uPG9iamVjdD4sIGlzTnVsbGFibGUgPSBmYWxzZSkge1xuXHRpZiAoaXNOdWxsYWJsZSAmJiBPYmplY3Qua2V5cyhleHByLnZhbHVlKS5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHQvLyBPYmplY3RzXG5cdGNvbnN0IG8gPSBleHByLnZhbHVlIGFzIFBsYWluRXhwcmVzc2lvbk9iamVjdDtcblx0Y29uc3QgcHJvcGVydGllczogc3RyaW5nW10gPSBbXTtcblx0T2JqZWN0LmtleXMobykuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBvW2tleV07XG5cdFx0Y29uc3QgY2hpbGRSZXN1bHQgPSBjb21waWxlRXhwcmVzc2lvbih2YWx1ZSwgdHJ1ZSwgZmFsc2UsIGlzTnVsbGFibGUpO1xuXHRcdGlmIChjaGlsZFJlc3VsdCAmJiBjaGlsZFJlc3VsdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRwcm9wZXJ0aWVzLnB1c2goYCR7a2V5fTogJHtjaGlsZFJlc3VsdH1gKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYHske3Byb3BlcnRpZXMuam9pbihcIiwgXCIpfX1gO1xufVxuXG4vKipcbiAqIENvbXBpbGVzIGEgQ29uc3RhbnQgQmluZGluZyBFeHByZXNzaW9uLlxuICpcbiAqIEBwYXJhbSBleHByXG4gKiBAcGFyYW0gZW1iZWRkZWRJbkJpbmRpbmdcbiAqIEBwYXJhbSBpc051bGxhYmxlXG4gKiBAcGFyYW0gZG9Ob3RTdHJpbmdpZnlcbiAqIEByZXR1cm5zIFRoZSBjb21waWxlZCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVDb25zdGFudDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGV4cHI6IENvbnN0YW50RXhwcmVzc2lvbjxUPixcblx0ZW1iZWRkZWRJbkJpbmRpbmc6IGJvb2xlYW4sXG5cdGlzTnVsbGFibGU/OiBib29sZWFuLFxuXHRkb05vdFN0cmluZ2lmeT86IGZhbHNlXG4pOiBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUNvbnN0YW50PFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0ZXhwcjogQ29uc3RhbnRFeHByZXNzaW9uPFQ+LFxuXHRlbWJlZGRlZEluQmluZGluZzogYm9vbGVhbixcblx0aXNOdWxsYWJsZT86IGJvb2xlYW4sXG5cdGRvTm90U3RyaW5naWZ5PzogdHJ1ZVxuKTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVDb25zdGFudDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGV4cHI6IENvbnN0YW50RXhwcmVzc2lvbjxUPixcblx0ZW1iZWRkZWRJbkJpbmRpbmc6IGJvb2xlYW4sXG5cdGlzTnVsbGFibGUgPSBmYWxzZSxcblx0ZG9Ob3RTdHJpbmdpZnk6IGJvb2xlYW4gPSBmYWxzZVxuKTogc3RyaW5nIHwgYW55IHtcblx0aWYgKGV4cHIudmFsdWUgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gZG9Ob3RTdHJpbmdpZnkgPyBudWxsIDogXCJudWxsXCI7XG5cdH1cblx0aWYgKGV4cHIudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBkb05vdFN0cmluZ2lmeSA/IHVuZGVmaW5lZCA6IFwidW5kZWZpbmVkXCI7XG5cdH1cblx0aWYgKHR5cGVvZiBleHByLnZhbHVlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZXhwci52YWx1ZSkpIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSBleHByLnZhbHVlLm1hcCgoZXhwcmVzc2lvbikgPT4gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbiwgdHJ1ZSkpO1xuXHRcdFx0cmV0dXJuIGBbJHtlbnRyaWVzLmpvaW4oXCIsIFwiKX1dYDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVDb25zdGFudE9iamVjdChleHByIGFzIENvbnN0YW50RXhwcmVzc2lvbjxvYmplY3Q+LCBpc051bGxhYmxlKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRzd2l0Y2ggKHR5cGVvZiBleHByLnZhbHVlKSB7XG5cdFx0XHRjYXNlIFwibnVtYmVyXCI6XG5cdFx0XHRjYXNlIFwiYmlnaW50XCI6XG5cdFx0XHRjYXNlIFwiYm9vbGVhblwiOlxuXHRcdFx0XHRyZXR1cm4gZXhwci52YWx1ZS50b1N0cmluZygpO1xuXHRcdFx0Y2FzZSBcInN0cmluZ1wiOlxuXHRcdFx0XHRyZXR1cm4gYCcke2VzY2FwZVhtbEF0dHJpYnV0ZShleHByLnZhbHVlLnRvU3RyaW5nKCkpfSdgO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBkb05vdFN0cmluZ2lmeSA/IGV4cHIudmFsdWUgOiBleHByLnZhbHVlLnRvU3RyaW5nKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgdGhlIGJpbmRpbmcgc3RyaW5nIGZvciBhIEJpbmRpbmcgZXhwcmVzc2lvbi5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbkZvckJpbmRpbmcgVGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZVxuICogQHBhcmFtIGVtYmVkZGVkSW5CaW5kaW5nIFdoZXRoZXIgdGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZSBpcyBlbWJlZGRlZCBpbnRvIGFub3RoZXIgZXhwcmVzc2lvblxuICogQHBhcmFtIGVtYmVkZGVkU2VwYXJhdG9yIFRoZSBiaW5kaW5nIHZhbHVlIGV2YWx1YXRvciAoJCBvciAlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHdlIHdhbnQgdG8gZm9yY2UgdGhlIHR5cGUgb3Igbm90KVxuICogQHJldHVybnMgVGhlIGNvcnJlc3BvbmRpbmcgZXhwcmVzc2lvbiBiaW5kaW5nXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoSW5Nb2RlbEV4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRleHByZXNzaW9uRm9yQmluZGluZzogUGF0aEluTW9kZWxFeHByZXNzaW9uPFQ+LFxuXHRlbWJlZGRlZEluQmluZGluZzogYm9vbGVhbixcblx0ZW1iZWRkZWRTZXBhcmF0b3I6IHN0cmluZ1xuKSB7XG5cdGlmIChcblx0XHRleHByZXNzaW9uRm9yQmluZGluZy50eXBlIHx8XG5cdFx0ZXhwcmVzc2lvbkZvckJpbmRpbmcucGFyYW1ldGVycyB8fFxuXHRcdGV4cHJlc3Npb25Gb3JCaW5kaW5nLnRhcmdldFR5cGUgfHxcblx0XHRleHByZXNzaW9uRm9yQmluZGluZy5mb3JtYXRPcHRpb25zIHx8XG5cdFx0ZXhwcmVzc2lvbkZvckJpbmRpbmcuY29uc3RyYWludHNcblx0KSB7XG5cdFx0Ly8gVGhpcyBpcyBub3cgYSBjb21wbGV4IGJpbmRpbmcgZGVmaW5pdGlvbiwgbGV0J3MgcHJlcGFyZSBmb3IgaXRcblx0XHRjb25zdCBjb21wbGV4QmluZGluZ0RlZmluaXRpb24gPSB7XG5cdFx0XHRwYXRoOiBjb21waWxlUGF0aEluTW9kZWwoZXhwcmVzc2lvbkZvckJpbmRpbmcpLFxuXHRcdFx0dHlwZTogZXhwcmVzc2lvbkZvckJpbmRpbmcudHlwZSxcblx0XHRcdHRhcmdldFR5cGU6IGV4cHJlc3Npb25Gb3JCaW5kaW5nLnRhcmdldFR5cGUsXG5cdFx0XHRwYXJhbWV0ZXJzOiBleHByZXNzaW9uRm9yQmluZGluZy5wYXJhbWV0ZXJzLFxuXHRcdFx0Zm9ybWF0T3B0aW9uczogZXhwcmVzc2lvbkZvckJpbmRpbmcuZm9ybWF0T3B0aW9ucyxcblx0XHRcdGNvbnN0cmFpbnRzOiBleHByZXNzaW9uRm9yQmluZGluZy5jb25zdHJhaW50c1xuXHRcdH07XG5cdFx0Y29uc3Qgb3V0QmluZGluZyA9IGNvbXBpbGVFeHByZXNzaW9uKGNvbXBsZXhCaW5kaW5nRGVmaW5pdGlvbiwgZmFsc2UsIGZhbHNlLCB0cnVlKTtcblx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdHJldHVybiBgJHtlbWJlZGRlZFNlcGFyYXRvcn0ke291dEJpbmRpbmd9YDtcblx0XHR9XG5cdFx0cmV0dXJuIG91dEJpbmRpbmc7XG5cdH0gZWxzZSBpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRyZXR1cm4gYCR7ZW1iZWRkZWRTZXBhcmF0b3J9eyR7Y29tcGlsZVBhdGhJbk1vZGVsKGV4cHJlc3Npb25Gb3JCaW5kaW5nKX19YDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gYHske2NvbXBpbGVQYXRoSW5Nb2RlbChleHByZXNzaW9uRm9yQmluZGluZyl9fWA7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZUNvbXBsZXhUeXBlRXhwcmVzc2lvbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oZXhwcmVzc2lvbjogQ29tcGxleFR5cGVFeHByZXNzaW9uPFQ+KSB7XG5cdGlmIChleHByZXNzaW9uLmJpbmRpbmdQYXJhbWV0ZXJzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBgeyR7Y29tcGlsZVBhdGhQYXJhbWV0ZXIoZXhwcmVzc2lvbi5iaW5kaW5nUGFyYW1ldGVyc1swXSwgdHJ1ZSl9LCB0eXBlOiAnJHtleHByZXNzaW9uLnR5cGV9J31gO1xuXHR9XG5cblx0bGV0IG91dHB1dEVuZCA9IGBdLCB0eXBlOiAnJHtleHByZXNzaW9uLnR5cGV9J2A7XG5cdGlmIChoYXNFbGVtZW50cyhleHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpKSB7XG5cdFx0b3V0cHV0RW5kICs9IGAsIGZvcm1hdE9wdGlvbnM6ICR7Y29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zKX1gO1xuXHR9XG5cdGlmIChoYXNFbGVtZW50cyhleHByZXNzaW9uLnBhcmFtZXRlcnMpKSB7XG5cdFx0b3V0cHV0RW5kICs9IGAsIHBhcmFtZXRlcnM6ICR7Y29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbi5wYXJhbWV0ZXJzKX1gO1xuXHR9XG5cdG91dHB1dEVuZCArPSBcIn1cIjtcblxuXHRyZXR1cm4gYHttb2RlOidUd29XYXknLCBwYXJ0czpbJHtleHByZXNzaW9uLmJpbmRpbmdQYXJhbWV0ZXJzLm1hcCgocGFyYW06IGFueSkgPT4gY29tcGlsZVBhdGhQYXJhbWV0ZXIocGFyYW0pKS5qb2luKFwiLFwiKX0ke291dHB1dEVuZH1gO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIGNvbXBpbGVkIGJpbmRpbmcgc3RyaW5nIGFzIHJlcXVpcmVkIGRlcGVuZGVuaW5nIG9uIGl0cyBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uIFRoZSBjb21waWxlZCBleHByZXNzaW9uXG4gKiBAcGFyYW0gZW1iZWRkZWRJbkJpbmRpbmcgVHJ1ZSBpZiB0aGUgY29tcGlsZWQgZXhwcmVzc2lvbiBpcyB0byBiZSBlbWJlZGRlZCBpbiBhIGJpbmRpbmdcbiAqIEBwYXJhbSBwYXJlbnRoZXNpc1JlcXVpcmVkIFRydWUgaWYgdGhlIGVtYmVkZGVkIGJpbmRpbmcgbmVlZHMgdG8gYmUgd3JhcHBlZCBpbiBwYXJldGhlc2lzIHNvIHRoYXQgaXQgaXMgZXZhbHVhdGVkIGFzIG9uZVxuICogQHJldHVybnMgRmluYWxpemVkIGNvbXBpbGVkIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gd3JhcEJpbmRpbmdFeHByZXNzaW9uKFxuXHRleHByZXNzaW9uOiBzdHJpbmcsXG5cdGVtYmVkZGVkSW5CaW5kaW5nOiBib29sZWFuLFxuXHRwYXJlbnRoZXNpc1JlcXVpcmVkID0gZmFsc2Vcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHtcblx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0aWYgKHBhcmVudGhlc2lzUmVxdWlyZWQpIHtcblx0XHRcdHJldHVybiBgKCR7ZXhwcmVzc2lvbn0pYDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb247XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBgez0gJHtleHByZXNzaW9ufX1gO1xuXHR9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhbiBleHByZXNzaW9uIGludG8gYW4gZXhwcmVzc2lvbiBiaW5kaW5nLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZVxuICogQHBhcmFtIGVtYmVkZGVkSW5CaW5kaW5nIFdoZXRoZXIgdGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZSBpcyBlbWJlZGRlZCBpbnRvIGFub3RoZXIgZXhwcmVzc2lvblxuICogQHBhcmFtIGtlZXBUYXJnZXRUeXBlIEtlZXAgdGhlIHRhcmdldCB0eXBlIG9mIHRoZSBlbWJlZGRlZCBiaW5kaW5ncyBpbnN0ZWFkIG9mIGNhc3RpbmcgdGhlbSB0byBhbnlcbiAqIEBwYXJhbSBpc051bGxhYmxlIFdoZXRoZXIgYmluZGluZyBleHByZXNzaW9uIGNhbiByZXNvbHZlIHRvIGVtcHR5IHN0cmluZyBvciBub3RcbiAqIEByZXR1cm5zIFRoZSBjb3JyZXNwb25kaW5nIGV4cHJlc3Npb24gYmluZGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUV4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRleHByZXNzaW9uOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdGVtYmVkZGVkSW5CaW5kaW5nID0gZmFsc2UsXG5cdGtlZXBUYXJnZXRUeXBlID0gZmFsc2UsXG5cdGlzTnVsbGFibGUgPSBmYWxzZVxuKTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24ge1xuXHRjb25zdCBleHByID0gd3JhcFByaW1pdGl2ZShleHByZXNzaW9uKTtcblx0Y29uc3QgZW1iZWRkZWRTZXBhcmF0b3IgPSBrZWVwVGFyZ2V0VHlwZSA/IFwiJFwiIDogXCIlXCI7XG5cblx0c3dpdGNoIChleHByLl90eXBlKSB7XG5cdFx0Y2FzZSBcIlVucmVzb2x2YWJsZVwiOlxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdFx0cmV0dXJuIGNvbXBpbGVDb25zdGFudChleHByLCBlbWJlZGRlZEluQmluZGluZywgaXNOdWxsYWJsZSk7XG5cblx0XHRjYXNlIFwiUmVmXCI6XG5cdFx0XHRyZXR1cm4gZXhwci5yZWYgfHwgXCJudWxsXCI7XG5cblx0XHRjYXNlIFwiRnVuY3Rpb25cIjpcblx0XHRcdGNvbnN0IGFyZ3VtZW50U3RyaW5nID0gYCR7ZXhwci5wYXJhbWV0ZXJzLm1hcCgoYXJnKSA9PiBjb21waWxlRXhwcmVzc2lvbihhcmcsIHRydWUpKS5qb2luKFwiLCBcIil9YDtcblx0XHRcdHJldHVybiBleHByLm9iaiA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdD8gYCR7ZXhwci5mbn0oJHthcmd1bWVudFN0cmluZ30pYFxuXHRcdFx0XHQ6IGAke2NvbXBpbGVFeHByZXNzaW9uKGV4cHIub2JqLCB0cnVlKX0uJHtleHByLmZufSgke2FyZ3VtZW50U3RyaW5nfSlgO1xuXG5cdFx0Y2FzZSBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIjpcblx0XHRcdHJldHVybiBlbWJlZGRlZEluQmluZGluZyA/IGAoJHtleHByLnZhbHVlLnN1YnN0cigyLCBleHByLnZhbHVlLmxlbmd0aCAtIDMpfSlgIDogYCR7ZXhwci52YWx1ZX1gO1xuXG5cdFx0Y2FzZSBcIkVtYmVkZGVkQmluZGluZ1wiOlxuXHRcdFx0cmV0dXJuIGVtYmVkZGVkSW5CaW5kaW5nID8gYCR7ZW1iZWRkZWRTZXBhcmF0b3J9JHtleHByLnZhbHVlfWAgOiBgJHtleHByLnZhbHVlfWA7XG5cblx0XHRjYXNlIFwiUGF0aEluTW9kZWxcIjpcblx0XHRcdHJldHVybiBjb21waWxlUGF0aEluTW9kZWxFeHByZXNzaW9uKGV4cHIsIGVtYmVkZGVkSW5CaW5kaW5nLCBlbWJlZGRlZFNlcGFyYXRvcik7XG5cblx0XHRjYXNlIFwiQ29tcGFyaXNvblwiOlxuXHRcdFx0Y29uc3QgY29tcGFyaXNvbkV4cHJlc3Npb24gPSBjb21waWxlQ29tcGFyaXNvbkV4cHJlc3Npb24oZXhwcik7XG5cdFx0XHRyZXR1cm4gd3JhcEJpbmRpbmdFeHByZXNzaW9uKGNvbXBhcmlzb25FeHByZXNzaW9uLCBlbWJlZGRlZEluQmluZGluZyk7XG5cblx0XHRjYXNlIFwiSWZFbHNlXCI6XG5cdFx0XHRjb25zdCBpZkVsc2VFeHByZXNzaW9uID0gYCR7Y29tcGlsZUV4cHJlc3Npb24oZXhwci5jb25kaXRpb24sIHRydWUpfSA/ICR7Y29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRcdGV4cHIub25UcnVlLFxuXHRcdFx0XHR0cnVlXG5cdFx0XHQpfSA6ICR7Y29tcGlsZUV4cHJlc3Npb24oZXhwci5vbkZhbHNlLCB0cnVlKX1gO1xuXHRcdFx0cmV0dXJuIHdyYXBCaW5kaW5nRXhwcmVzc2lvbihpZkVsc2VFeHByZXNzaW9uLCBlbWJlZGRlZEluQmluZGluZywgdHJ1ZSk7XG5cblx0XHRjYXNlIFwiU2V0XCI6XG5cdFx0XHRjb25zdCBzZXRFeHByZXNzaW9uID0gZXhwci5vcGVyYW5kcy5tYXAoKG9wZXJhbmQpID0+IGNvbXBpbGVFeHByZXNzaW9uKG9wZXJhbmQsIHRydWUpKS5qb2luKGAgJHtleHByLm9wZXJhdG9yfSBgKTtcblx0XHRcdHJldHVybiB3cmFwQmluZGluZ0V4cHJlc3Npb24oc2V0RXhwcmVzc2lvbiwgZW1iZWRkZWRJbkJpbmRpbmcsIHRydWUpO1xuXG5cdFx0Y2FzZSBcIkNvbmNhdFwiOlxuXHRcdFx0Y29uc3QgY29uY2F0RXhwcmVzc2lvbiA9IGV4cHIuZXhwcmVzc2lvbnNcblx0XHRcdFx0Lm1hcCgobmVzdGVkRXhwcmVzc2lvbikgPT4gY29tcGlsZUV4cHJlc3Npb24obmVzdGVkRXhwcmVzc2lvbiwgdHJ1ZSwgdHJ1ZSkpXG5cdFx0XHRcdC5qb2luKFwiICsgXCIpO1xuXHRcdFx0cmV0dXJuIHdyYXBCaW5kaW5nRXhwcmVzc2lvbihjb25jYXRFeHByZXNzaW9uLCBlbWJlZGRlZEluQmluZGluZyk7XG5cblx0XHRjYXNlIFwiTGVuZ3RoXCI6XG5cdFx0XHRjb25zdCBsZW5ndGhFeHByZXNzaW9uID0gYCR7Y29tcGlsZUV4cHJlc3Npb24oZXhwci5wYXRoSW5Nb2RlbCwgdHJ1ZSl9Lmxlbmd0aGA7XG5cdFx0XHRyZXR1cm4gd3JhcEJpbmRpbmdFeHByZXNzaW9uKGxlbmd0aEV4cHJlc3Npb24sIGVtYmVkZGVkSW5CaW5kaW5nKTtcblxuXHRcdGNhc2UgXCJOb3RcIjpcblx0XHRcdGNvbnN0IG5vdEV4cHJlc3Npb24gPSBgISR7Y29tcGlsZUV4cHJlc3Npb24oZXhwci5vcGVyYW5kLCB0cnVlKX1gO1xuXHRcdFx0cmV0dXJuIHdyYXBCaW5kaW5nRXhwcmVzc2lvbihub3RFeHByZXNzaW9uLCBlbWJlZGRlZEluQmluZGluZyk7XG5cblx0XHRjYXNlIFwiVHJ1dGh5XCI6XG5cdFx0XHRjb25zdCB0cnV0aHlFeHByZXNzaW9uID0gYCEhJHtjb21waWxlRXhwcmVzc2lvbihleHByLm9wZXJhbmQsIHRydWUpfWA7XG5cdFx0XHRyZXR1cm4gd3JhcEJpbmRpbmdFeHByZXNzaW9uKHRydXRoeUV4cHJlc3Npb24sIGVtYmVkZGVkSW5CaW5kaW5nKTtcblxuXHRcdGNhc2UgXCJGb3JtYXR0ZXJcIjpcblx0XHRcdGNvbnN0IGZvcm1hdHRlckV4cHJlc3Npb24gPSBjb21waWxlRm9ybWF0dGVyRXhwcmVzc2lvbihleHByKTtcblx0XHRcdHJldHVybiBlbWJlZGRlZEluQmluZGluZyA/IGBcXCQke2Zvcm1hdHRlckV4cHJlc3Npb259YCA6IGZvcm1hdHRlckV4cHJlc3Npb247XG5cblx0XHRjYXNlIFwiQ29tcGxleFR5cGVcIjpcblx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlRXhwcmVzc2lvbiA9IGNvbXBpbGVDb21wbGV4VHlwZUV4cHJlc3Npb24oZXhwcik7XG5cdFx0XHRyZXR1cm4gZW1iZWRkZWRJbkJpbmRpbmcgPyBgXFwkJHtjb21wbGV4VHlwZUV4cHJlc3Npb259YCA6IGNvbXBsZXhUeXBlRXhwcmVzc2lvbjtcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0fVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSBjb21wYXJpc29uIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGNvbXBhcmlzb24gZXhwcmVzc2lvbi5cbiAqIEByZXR1cm5zIFRoZSBjb21waWxlZCBleHByZXNzaW9uLiBOZWVkcyB3cmFwcGluZyBiZWZvcmUgaXQgY2FuIGJlIHVzZWQgYXMgYW4gZXhwcmVzc2lvbiBiaW5kaW5nLlxuICovXG5mdW5jdGlvbiBjb21waWxlQ29tcGFyaXNvbkV4cHJlc3Npb24oZXhwcmVzc2lvbjogQ29tcGFyaXNvbkV4cHJlc3Npb24pIHtcblx0ZnVuY3Rpb24gY29tcGlsZU9wZXJhbmQob3BlcmFuZDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGFueT4pIHtcblx0XHRjb25zdCBjb21waWxlZE9wZXJhbmQgPSBjb21waWxlRXhwcmVzc2lvbihvcGVyYW5kLCB0cnVlKSA/PyBcInVuZGVmaW5lZFwiO1xuXHRcdHJldHVybiB3cmFwQmluZGluZ0V4cHJlc3Npb24oY29tcGlsZWRPcGVyYW5kLCB0cnVlLCBuZWVkUGFyZW50aGVzaXMob3BlcmFuZCkpO1xuXHR9XG5cblx0cmV0dXJuIGAke2NvbXBpbGVPcGVyYW5kKGV4cHJlc3Npb24ub3BlcmFuZDEpfSAke2V4cHJlc3Npb24ub3BlcmF0b3J9ICR7Y29tcGlsZU9wZXJhbmQoZXhwcmVzc2lvbi5vcGVyYW5kMil9YDtcbn1cblxuLyoqXG4gKiBDb21waWxlIGEgZm9ybWF0dGVyIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGZvcm1hdHRlciBleHByZXNzaW9uLlxuICogQHJldHVybnMgVGhlIGNvbXBpbGVkIGV4cHJlc3Npb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVGb3JtYXR0ZXJFeHByZXNzaW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihleHByZXNzaW9uOiBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KSB7XG5cdGlmIChleHByZXNzaW9uLnBhcmFtZXRlcnMubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIGB7JHtjb21waWxlUGF0aFBhcmFtZXRlcihleHByZXNzaW9uLnBhcmFtZXRlcnNbMF0sIHRydWUpfSwgZm9ybWF0dGVyOiAnJHtleHByZXNzaW9uLmZufSd9YDtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBwYXJ0cyA9IGV4cHJlc3Npb24ucGFyYW1ldGVycy5tYXAoKHBhcmFtKSA9PiB7XG5cdFx0XHRpZiAocGFyYW0uX3R5cGUgPT09IFwiQ29tcGxleFR5cGVcIikge1xuXHRcdFx0XHRyZXR1cm4gY29tcGlsZUNvbXBsZXhUeXBlRXhwcmVzc2lvbihwYXJhbSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29tcGlsZVBhdGhQYXJhbWV0ZXIocGFyYW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBge3BhcnRzOiBbJHtwYXJ0cy5qb2luKFwiLCBcIil9XSwgZm9ybWF0dGVyOiAnJHtleHByZXNzaW9uLmZufSd9YDtcblx0fVxufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIHBhdGggcGFyYW1ldGVyIG9mIGEgZm9ybWF0dGVyIGNhbGwuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGJpbmRpbmcgcGFydCB0byBldmFsdWF0ZVxuICogQHBhcmFtIHNpbmdsZVBhdGggV2hldGhlciB0aGVyZSBpcyBvbmUgb3IgbXVsdGlwbGUgcGF0aCB0byBjb25zaWRlclxuICogQHJldHVybnMgVGhlIHN0cmluZyBzbmlwcGV0IHRvIGluY2x1ZGUgaW4gdGhlIG92ZXJhbGwgYmluZGluZyBkZWZpbml0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoUGFyYW1ldGVyKGV4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+LCBzaW5nbGVQYXRoID0gZmFsc2UpOiBzdHJpbmcge1xuXHRsZXQgb3V0VmFsdWUgPSBcIlwiO1xuXHRpZiAoZXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJDb25zdGFudFwiKSB7XG5cdFx0aWYgKGV4cHJlc3Npb24udmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIG90aGVyd2lzZSB0aGUgSlNUb2tlbml6ZXIgY29tcGxhaW5zIGFib3V0IGluY29ycmVjdCBjb250ZW50XG5cdFx0XHRvdXRWYWx1ZSA9IGB2YWx1ZTogJ3VuZGVmaW5lZCdgO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXRWYWx1ZSA9IGB2YWx1ZTogJHtjb21waWxlQ29uc3RhbnQoZXhwcmVzc2lvbiwgdHJ1ZSl9YDtcblx0XHR9XG5cdH0gZWxzZSBpZiAoZXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJQYXRoSW5Nb2RlbFwiKSB7XG5cdFx0b3V0VmFsdWUgPSBgcGF0aDogJyR7Y29tcGlsZVBhdGhJbk1vZGVsKGV4cHJlc3Npb24pfSdgO1xuXG5cdFx0b3V0VmFsdWUgKz0gZXhwcmVzc2lvbi50eXBlID8gYCwgdHlwZTogJyR7ZXhwcmVzc2lvbi50eXBlfSdgIDogYCwgdGFyZ2V0VHlwZTogJ2FueSdgO1xuXHRcdGlmIChoYXNFbGVtZW50cyhleHByZXNzaW9uLm1vZGUpKSB7XG5cdFx0XHRvdXRWYWx1ZSArPSBgLCBtb2RlOiAnJHtjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uLm1vZGUpfSdgO1xuXHRcdH1cblx0XHRpZiAoaGFzRWxlbWVudHMoZXhwcmVzc2lvbi5jb25zdHJhaW50cykpIHtcblx0XHRcdG91dFZhbHVlICs9IGAsIGNvbnN0cmFpbnRzOiAke2NvbXBpbGVFeHByZXNzaW9uKGV4cHJlc3Npb24uY29uc3RyYWludHMpfWA7XG5cdFx0fVxuXHRcdGlmIChoYXNFbGVtZW50cyhleHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpKSB7XG5cdFx0XHRvdXRWYWx1ZSArPSBgLCBmb3JtYXRPcHRpb25zOiAke2NvbXBpbGVFeHByZXNzaW9uKGV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyl9YDtcblx0XHR9XG5cdFx0aWYgKGhhc0VsZW1lbnRzKGV4cHJlc3Npb24ucGFyYW1ldGVycykpIHtcblx0XHRcdG91dFZhbHVlICs9IGAsIHBhcmFtZXRlcnM6ICR7Y29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbi5wYXJhbWV0ZXJzKX1gO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHRyZXR1cm4gc2luZ2xlUGF0aCA/IG91dFZhbHVlIDogYHske291dFZhbHVlfX1gO1xufVxuXG5mdW5jdGlvbiBoYXNFbGVtZW50cyhvYmo6IGFueSkge1xuXHRyZXR1cm4gb2JqICYmIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBDb21waWxlIGEgYmluZGluZyBleHByZXNzaW9uIHBhdGguXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZS5cbiAqIEByZXR1cm5zIFRoZSBjb21waWxlZCBwYXRoLlxuICovXG5mdW5jdGlvbiBjb21waWxlUGF0aEluTW9kZWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KGV4cHJlc3Npb246IFBhdGhJbk1vZGVsRXhwcmVzc2lvbjxUPikge1xuXHRyZXR1cm4gYCR7ZXhwcmVzc2lvbi5tb2RlbE5hbWUgPyBgJHtleHByZXNzaW9uLm1vZGVsTmFtZX0+YCA6IFwiXCJ9JHtleHByZXNzaW9uLnBhdGh9YDtcbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNktPLElBQU1BLHVCQUFvRCxHQUFHO0lBQ25F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