/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/helpers/ClassSupport", "sap/ui/mdc/condition/FilterOperatorUtil", "sap/ui/mdc/condition/Operator", "sap/ui/mdc/enum/FieldDisplay", "sap/ui/model/SimpleType", "sap/ui/model/type/Boolean", "sap/ui/model/type/Date", "sap/ui/model/type/Float", "sap/ui/model/type/Integer", "sap/ui/model/type/String"], function (Log, ClassSupport, FilterOperatorUtil, Operator, FieldDisplay, SimpleType, BooleanType, DateType, FloatType, IntegerType, StringType) {
  "use strict";

  var _dec, _class, _class2;

  var _exports = {};
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var Value = (
  /**
   * Handle format/parse single filter value.
   */
  _dec = defineUI5Class("sap.fe.macros.filter.type.Value"), _dec(_class = (_class2 = /*#__PURE__*/function (_SimpleType) {
    _inheritsLoose(Value, _SimpleType);

    /**
     * Creates a new value type instance with the given parameters.
     *
     * @param formatOptions Format options for this value type
     * @param formatOptions.operator The name of a (possibly custom) operator to use
     * @param constraints Constraints for this value type
     * @protected
     */
    function Value(formatOptions, constraints) {
      var _this;

      _this = _SimpleType.call(this, formatOptions, constraints) || this;

      var operatorName = (formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.operator) || _this.getDefaultOperatorName();

      _this.operator = FilterOperatorUtil.getOperator(operatorName);

      if (!_this.operator && operatorName.includes(".")) {
        _this._registerCustomOperator(operatorName);
      }

      return _this;
    }
    /**
     * Registers a custom binding operator.
     *
     * @param operatorName The binding operator name
     * @private
     */


    _exports = Value;
    var _proto = Value.prototype;

    _proto._registerCustomOperator = function _registerCustomOperator(operatorName) {
      var _this2 = this;

      var handlerFileName = operatorName.substring(0, operatorName.lastIndexOf(".")).replace(/\./g, "/"),
          methodName = operatorName.substring(operatorName.lastIndexOf(".") + 1);

      sap.ui.require([handlerFileName], function (customOperatorHandler) {
        if (!customOperatorHandler) {
          return;
        }

        _this2.operator = new Operator({
          filterOperator: "",
          tokenFormat: "",
          name: operatorName,
          valueTypes: ["self"],
          tokenParse: "^(.*)$",
          format: function (value) {
            return _this2.formatConditionValues(value.values);
          },
          parse: function (text, type, displayFormat, defaultOperator) {
            if (typeof text === "object") {
              if (text.operator !== operatorName) {
                throw Error("not matching operator");
              }

              return text.values;
            }

            return Operator.prototype.parse.apply(this, [text, type, displayFormat, defaultOperator]);
          },
          getModelFilter: function (condition) {
            return customOperatorHandler[methodName].call(customOperatorHandler, _this2.formatConditionValues(condition.values));
          }
        });
        FilterOperatorUtil.addOperator(_this2.operator);
      });
    }
    /**
     * Returns whether the specified operator is a multi-value operator.
     *
     * @param operator The binding operator
     * @returns `true`, if multi-value operator (`false` otherwise)
     * @private
     */
    ;

    _proto._isMultiValueOperator = function _isMultiValueOperator(operator) {
      return operator.valueTypes.filter(function (valueType) {
        return !!valueType && valueType !== Value.OPERATOR_VALUE_TYPE_STATIC;
      }).length > 1;
    }
    /**
     * Returns whether the specified operator is a custom operator.
     *
     * @returns `true`, if custom operator (`false` otherwise)
     * @private
     */
    ;

    _proto.hasCustomOperator = function hasCustomOperator() {
      return this.operator.name.includes(".");
    }
    /**
     * Parses the internal string value to the external value of type 'externalValueType'.
     *
     * @param value The internal string value to be parsed
     * @param externalValueType The external value type, e.g. int, float[], string, etc.
     * @returns The parsed value
     * @private
     */
    ;

    _proto._stringToExternal = function _stringToExternal(value, externalValueType) {
      var externalValue;

      var externalType = this._getTypeInstance(externalValueType);

      if (externalValueType && Value._isArrayType(externalValueType)) {
        if (!Array.isArray(value)) {
          value = [value];
        }

        externalValue = value.map(function (valueElement) {
          return externalType ? externalType.parseValue(valueElement, Value.INTERNAL_VALUE_TYPE) : valueElement;
        });
      } else {
        externalValue = externalType ? externalType.parseValue(value, Value.INTERNAL_VALUE_TYPE) : value;
      }

      return externalValue;
    }
    /**
     * Returns whether target type is an array.
     *
     * @param targetType The target type name
     * @returns `true`, if array type (`false` otherwise)
     * @private
     */
    ;

    Value._isArrayType = function _isArrayType(targetType) {
      if (!targetType) {
        return false;
      }

      return targetType === "array" || targetType.endsWith("[]");
    }
    /**
     * Returns the external value formatted as the internal string value.
     *
     * @param externalValue The value to be parsed
     * @param externalValueType The external value type, e.g. int, float[], string, etc.
     * @returns The formatted value
     * @private
     */
    ;

    _proto._externalToString = function _externalToString(externalValue, externalValueType) {
      var value;

      var externalType = this._getTypeInstance(externalValueType);

      if (externalValueType && Value._isArrayType(externalValueType)) {
        if (!Array.isArray(externalValue)) {
          externalValue = [externalValue];
        }

        value = externalValue.map(function (valueElement) {
          return externalType ? externalType.formatValue(valueElement, Value.INTERNAL_VALUE_TYPE) : valueElement;
        });
      } else {
        value = externalType ? externalType.formatValue(externalValue, Value.INTERNAL_VALUE_TYPE) : externalValue;
      }

      return value;
    }
    /**
     * Retrieves the default type instance for given type name.
     *
     * @param typeName The name of the type
     * @returns The type instance
     * @private
     */
    ;

    _proto._getTypeInstance = function _getTypeInstance(typeName) {
      typeName = this.getElementTypeName(typeName) || typeName;

      switch (typeName) {
        case "string":
          return new StringType();

        case "number":
        case "int":
          return new IntegerType();

        case "float":
          return new FloatType();

        case "date":
          return new DateType();

        case "boolean":
          return new BooleanType();

        default:
          Log.error("Unexpected filter type");
          throw new Error("Unexpected filter type");
      }
    }
    /**
     * Returns the default operator name ("EQ").
     * Should be overridden on demand.
     *
     * @returns The default operator name
     * @protected
     */
    ;

    _proto.getDefaultOperatorName = function getDefaultOperatorName() {
      return FilterOperatorUtil.getEQOperator().name;
    }
    /**
     * Returns first value of array or input.
     *
     * @param values Input condition value
     * @returns Unchanged input condition value
     * @protected
     */
    ;

    _proto.formatConditionValues = function formatConditionValues(values) {
      return Array.isArray(values) && values.length ? values[0] : values;
    }
    /**
     * Returns the element type name.
     *
     * @param typeName The actual type name
     * @returns The type of its elements
     * @protected
     */
    ;

    _proto.getElementTypeName = function getElementTypeName(typeName) {
      if (typeName !== null && typeName !== void 0 && typeName.endsWith("[]")) {
        return typeName.substring(0, typeName.length - 2);
      }

      return undefined;
    }
    /**
     * Returns the string value parsed to the external value type 'this.operator'.
     *
     * @param internalValue The internal string value to be formatted
     * @param externalValueType The external value type, e.g. int, float[], string, etc.
     * @returns The formatted value
     * @protected
     */
    ;

    _proto.formatValue = function formatValue(internalValue, externalValueType) {
      if (!internalValue) {
        return undefined;
      }

      var isMultiValueOperator = this._isMultiValueOperator(this.operator),
          internalType = this._getTypeInstance(Value.INTERNAL_VALUE_TYPE); //  from internal model string with operator


      var values = this.operator.parse(internalValue || "", internalType, FieldDisplay.Value, false);
      var value = !isMultiValueOperator && Array.isArray(values) ? values[0] : values;
      return this._stringToExternal(value, externalValueType); // The value bound to a custom filter
    }
    /**
     * Returns the value parsed to the internal string value.
     *
     * @param externalValue The value to be parsed
     * @param externalValueType The external value type, e.g. int, float[], string, etc.
     * @returns The parsed value
     * @protected
     */
    ;

    _proto.parseValue = function parseValue(externalValue, externalValueType) {
      if (!externalValue) {
        return undefined;
      }

      var isMultiValueOperator = this._isMultiValueOperator(this.operator),
          externalType = this._getTypeInstance(externalValueType);

      var value = this._externalToString(externalValue, externalValueType); // Format to internal model string with operator


      var values = isMultiValueOperator ? value : [value];

      if (this.hasCustomOperator()) {
        // Return a complex object while parsing the bound value in sap.ui.model.PropertyBinding.js#_externalToRaw()
        return {
          operator: this.operator.name,
          values: [this.operator.format({
            values: values
          }, externalType)],
          validated: undefined
        };
      } // Return a simple string value to be stored in the internal 'filterValues' model


      return this.operator.format({
        values: values
      }, externalType);
    }
    /**
     * Validates whether the given value in model representation is valid.
     *
     * @param externalValue The value to be validated
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto.validateValue = function validateValue(externalValue) {
      /* Do Nothing */
    };

    return Value;
  }(SimpleType), _class2.INTERNAL_VALUE_TYPE = "string", _class2.OPERATOR_VALUE_TYPE_STATIC = "static", _class2)) || _class);
  _exports = Value;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJWYWx1ZSIsImRlZmluZVVJNUNsYXNzIiwiZm9ybWF0T3B0aW9ucyIsImNvbnN0cmFpbnRzIiwib3BlcmF0b3JOYW1lIiwib3BlcmF0b3IiLCJnZXREZWZhdWx0T3BlcmF0b3JOYW1lIiwiRmlsdGVyT3BlcmF0b3JVdGlsIiwiZ2V0T3BlcmF0b3IiLCJpbmNsdWRlcyIsIl9yZWdpc3RlckN1c3RvbU9wZXJhdG9yIiwiaGFuZGxlckZpbGVOYW1lIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJyZXBsYWNlIiwibWV0aG9kTmFtZSIsInNhcCIsInVpIiwicmVxdWlyZSIsImN1c3RvbU9wZXJhdG9ySGFuZGxlciIsIk9wZXJhdG9yIiwiZmlsdGVyT3BlcmF0b3IiLCJ0b2tlbkZvcm1hdCIsIm5hbWUiLCJ2YWx1ZVR5cGVzIiwidG9rZW5QYXJzZSIsImZvcm1hdCIsInZhbHVlIiwiZm9ybWF0Q29uZGl0aW9uVmFsdWVzIiwidmFsdWVzIiwicGFyc2UiLCJ0ZXh0IiwidHlwZSIsImRpc3BsYXlGb3JtYXQiLCJkZWZhdWx0T3BlcmF0b3IiLCJFcnJvciIsInByb3RvdHlwZSIsImFwcGx5IiwiZ2V0TW9kZWxGaWx0ZXIiLCJjb25kaXRpb24iLCJjYWxsIiwiYWRkT3BlcmF0b3IiLCJfaXNNdWx0aVZhbHVlT3BlcmF0b3IiLCJmaWx0ZXIiLCJ2YWx1ZVR5cGUiLCJPUEVSQVRPUl9WQUxVRV9UWVBFX1NUQVRJQyIsImxlbmd0aCIsImhhc0N1c3RvbU9wZXJhdG9yIiwiX3N0cmluZ1RvRXh0ZXJuYWwiLCJleHRlcm5hbFZhbHVlVHlwZSIsImV4dGVybmFsVmFsdWUiLCJleHRlcm5hbFR5cGUiLCJfZ2V0VHlwZUluc3RhbmNlIiwiX2lzQXJyYXlUeXBlIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwidmFsdWVFbGVtZW50IiwicGFyc2VWYWx1ZSIsIklOVEVSTkFMX1ZBTFVFX1RZUEUiLCJ0YXJnZXRUeXBlIiwiZW5kc1dpdGgiLCJfZXh0ZXJuYWxUb1N0cmluZyIsImZvcm1hdFZhbHVlIiwidHlwZU5hbWUiLCJnZXRFbGVtZW50VHlwZU5hbWUiLCJTdHJpbmdUeXBlIiwiSW50ZWdlclR5cGUiLCJGbG9hdFR5cGUiLCJEYXRlVHlwZSIsIkJvb2xlYW5UeXBlIiwiTG9nIiwiZXJyb3IiLCJnZXRFUU9wZXJhdG9yIiwidW5kZWZpbmVkIiwiaW50ZXJuYWxWYWx1ZSIsImlzTXVsdGlWYWx1ZU9wZXJhdG9yIiwiaW50ZXJuYWxUeXBlIiwiRmllbGREaXNwbGF5IiwidmFsaWRhdGVkIiwidmFsaWRhdGVWYWx1ZSIsIlNpbXBsZVR5cGUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlZhbHVlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCB0eXBlIHsgQ29uZGl0aW9uT2JqZWN0IH0gZnJvbSBcInNhcC91aS9tZGMvY29uZGl0aW9uL0NvbmRpdGlvblwiO1xuaW1wb3J0IEZpbHRlck9wZXJhdG9yVXRpbCBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vRmlsdGVyT3BlcmF0b3JVdGlsXCI7XG5pbXBvcnQgT3BlcmF0b3IgZnJvbSBcInNhcC91aS9tZGMvY29uZGl0aW9uL09wZXJhdG9yXCI7XG5pbXBvcnQgRmllbGREaXNwbGF5IGZyb20gXCJzYXAvdWkvbWRjL2VudW0vRmllbGREaXNwbGF5XCI7XG5pbXBvcnQgdHlwZSBGaWx0ZXIgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJcIjtcbmltcG9ydCBTaW1wbGVUeXBlIGZyb20gXCJzYXAvdWkvbW9kZWwvU2ltcGxlVHlwZVwiO1xuaW1wb3J0IHR5cGUgVHlwZSBmcm9tIFwic2FwL3VpL21vZGVsL1R5cGVcIjtcbmltcG9ydCBCb29sZWFuVHlwZSBmcm9tIFwic2FwL3VpL21vZGVsL3R5cGUvQm9vbGVhblwiO1xuaW1wb3J0IERhdGVUeXBlIGZyb20gXCJzYXAvdWkvbW9kZWwvdHlwZS9EYXRlXCI7XG5pbXBvcnQgRmxvYXRUeXBlIGZyb20gXCJzYXAvdWkvbW9kZWwvdHlwZS9GbG9hdFwiO1xuaW1wb3J0IEludGVnZXJUeXBlIGZyb20gXCJzYXAvdWkvbW9kZWwvdHlwZS9JbnRlZ2VyXCI7XG5pbXBvcnQgU3RyaW5nVHlwZSBmcm9tIFwic2FwL3VpL21vZGVsL3R5cGUvU3RyaW5nXCI7XG5cbi8qKlxuICogVHlwZSB1c2VkIHRvIGV4dGVuZCB0aGUgTURDIG9wZXJhdG9yIHR5cGUgd2l0aCBoaWRkZW4gZmllbGRzXG4gKlxuICogQHR5cGVkZWYgQXVnbWVudGVkT3BlcmF0b3JcbiAqL1xudHlwZSBBdWdtZW50ZWRPcGVyYXRvciA9IE9wZXJhdG9yICYge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHZhbHVlVHlwZXM6IHN0cmluZ1tdO1xufTtcblxuLyoqXG4gKiBIYW5kbGUgZm9ybWF0L3BhcnNlIHNpbmdsZSBmaWx0ZXIgdmFsdWUuXG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5tYWNyb3MuZmlsdGVyLnR5cGUuVmFsdWVcIilcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZhbHVlIGV4dGVuZHMgU2ltcGxlVHlwZSB7XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IElOVEVSTkFMX1ZBTFVFX1RZUEUgPSBcInN0cmluZ1wiO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBPUEVSQVRPUl9WQUxVRV9UWVBFX1NUQVRJQyA9IFwic3RhdGljXCI7XG5cdHByb3RlY3RlZCBvcGVyYXRvcjogQXVnbWVudGVkT3BlcmF0b3I7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgdmFsdWUgdHlwZSBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBwYXJhbWV0ZXJzLlxuXHQgKlxuXHQgKiBAcGFyYW0gZm9ybWF0T3B0aW9ucyBGb3JtYXQgb3B0aW9ucyBmb3IgdGhpcyB2YWx1ZSB0eXBlXG5cdCAqIEBwYXJhbSBmb3JtYXRPcHRpb25zLm9wZXJhdG9yIFRoZSBuYW1lIG9mIGEgKHBvc3NpYmx5IGN1c3RvbSkgb3BlcmF0b3IgdG8gdXNlXG5cdCAqIEBwYXJhbSBjb25zdHJhaW50cyBDb25zdHJhaW50cyBmb3IgdGhpcyB2YWx1ZSB0eXBlXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdGNvbnN0cnVjdG9yKGZvcm1hdE9wdGlvbnM6IHsgb3BlcmF0b3I/OiBzdHJpbmcgfSwgY29uc3RyYWludHM6IG9iamVjdCkge1xuXHRcdHN1cGVyKGZvcm1hdE9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcblx0XHRjb25zdCBvcGVyYXRvck5hbWUgPSBmb3JtYXRPcHRpb25zPy5vcGVyYXRvciB8fCB0aGlzLmdldERlZmF1bHRPcGVyYXRvck5hbWUoKTtcblx0XHR0aGlzLm9wZXJhdG9yID0gRmlsdGVyT3BlcmF0b3JVdGlsLmdldE9wZXJhdG9yKG9wZXJhdG9yTmFtZSkgYXMgQXVnbWVudGVkT3BlcmF0b3I7XG5cblx0XHRpZiAoIXRoaXMub3BlcmF0b3IgJiYgb3BlcmF0b3JOYW1lLmluY2x1ZGVzKFwiLlwiKSkge1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJDdXN0b21PcGVyYXRvcihvcGVyYXRvck5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBjdXN0b20gYmluZGluZyBvcGVyYXRvci5cblx0ICpcblx0ICogQHBhcmFtIG9wZXJhdG9yTmFtZSBUaGUgYmluZGluZyBvcGVyYXRvciBuYW1lXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIF9yZWdpc3RlckN1c3RvbU9wZXJhdG9yKG9wZXJhdG9yTmFtZTogc3RyaW5nKTogdm9pZCB7XG5cdFx0Y29uc3QgaGFuZGxlckZpbGVOYW1lID0gb3BlcmF0b3JOYW1lLnN1YnN0cmluZygwLCBvcGVyYXRvck5hbWUubGFzdEluZGV4T2YoXCIuXCIpKS5yZXBsYWNlKC9cXC4vZywgXCIvXCIpLFxuXHRcdFx0bWV0aG9kTmFtZSA9IG9wZXJhdG9yTmFtZS5zdWJzdHJpbmcob3BlcmF0b3JOYW1lLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xuXG5cdFx0c2FwLnVpLnJlcXVpcmUoW2hhbmRsZXJGaWxlTmFtZV0sIChjdXN0b21PcGVyYXRvckhhbmRsZXI6IHsgW2tleTogc3RyaW5nXTogKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4gRmlsdGVyIH0pID0+IHtcblx0XHRcdGlmICghY3VzdG9tT3BlcmF0b3JIYW5kbGVyKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vcGVyYXRvciA9IG5ldyBPcGVyYXRvcih7XG5cdFx0XHRcdGZpbHRlck9wZXJhdG9yOiBcIlwiLFxuXHRcdFx0XHR0b2tlbkZvcm1hdDogXCJcIixcblx0XHRcdFx0bmFtZTogb3BlcmF0b3JOYW1lLFxuXHRcdFx0XHR2YWx1ZVR5cGVzOiBbXCJzZWxmXCJdLFxuXHRcdFx0XHR0b2tlblBhcnNlOiBcIl4oLiopJFwiLFxuXHRcdFx0XHRmb3JtYXQ6ICh2YWx1ZTogQ29uZGl0aW9uT2JqZWN0KTogc3RyaW5nIHwgc3RyaW5nW10gPT4ge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZvcm1hdENvbmRpdGlvblZhbHVlcyh2YWx1ZS52YWx1ZXMgYXMgc3RyaW5nW10pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwYXJzZTogZnVuY3Rpb24gKHRleHQ6IENvbmRpdGlvbk9iamVjdCwgdHlwZTogVHlwZSwgZGlzcGxheUZvcm1hdDogRmllbGREaXNwbGF5LCBkZWZhdWx0T3BlcmF0b3I6IGJvb2xlYW4pIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHRleHQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdGlmICh0ZXh0Lm9wZXJhdG9yICE9PSBvcGVyYXRvck5hbWUpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJub3QgbWF0Y2hpbmcgb3BlcmF0b3JcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGV4dC52YWx1ZXM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBPcGVyYXRvci5wcm90b3R5cGUucGFyc2UuYXBwbHkodGhpcywgW3RleHQsIHR5cGUsIGRpc3BsYXlGb3JtYXQsIGRlZmF1bHRPcGVyYXRvcl0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXRNb2RlbEZpbHRlcjogKGNvbmRpdGlvbjogQ29uZGl0aW9uT2JqZWN0KTogRmlsdGVyID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gY3VzdG9tT3BlcmF0b3JIYW5kbGVyW21ldGhvZE5hbWVdLmNhbGwoY3VzdG9tT3BlcmF0b3JIYW5kbGVyLCB0aGlzLmZvcm1hdENvbmRpdGlvblZhbHVlcyhjb25kaXRpb24udmFsdWVzKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pIGFzIEF1Z21lbnRlZE9wZXJhdG9yO1xuXHRcdFx0RmlsdGVyT3BlcmF0b3JVdGlsLmFkZE9wZXJhdG9yKHRoaXMub3BlcmF0b3IpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgd2hldGhlciB0aGUgc3BlY2lmaWVkIG9wZXJhdG9yIGlzIGEgbXVsdGktdmFsdWUgb3BlcmF0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSBvcGVyYXRvciBUaGUgYmluZGluZyBvcGVyYXRvclxuXHQgKiBAcmV0dXJucyBgdHJ1ZWAsIGlmIG11bHRpLXZhbHVlIG9wZXJhdG9yIChgZmFsc2VgIG90aGVyd2lzZSlcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2lzTXVsdGlWYWx1ZU9wZXJhdG9yKG9wZXJhdG9yOiBBdWdtZW50ZWRPcGVyYXRvcik6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRvcGVyYXRvci52YWx1ZVR5cGVzLmZpbHRlcihmdW5jdGlvbiAodmFsdWVUeXBlOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICEhdmFsdWVUeXBlICYmIHZhbHVlVHlwZSAhPT0gVmFsdWUuT1BFUkFUT1JfVkFMVUVfVFlQRV9TVEFUSUM7XG5cdFx0XHR9KS5sZW5ndGggPiAxXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBvcGVyYXRvciBpcyBhIGN1c3RvbSBvcGVyYXRvci5cblx0ICpcblx0ICogQHJldHVybnMgYHRydWVgLCBpZiBjdXN0b20gb3BlcmF0b3IgKGBmYWxzZWAgb3RoZXJ3aXNlKVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBoYXNDdXN0b21PcGVyYXRvcigpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5vcGVyYXRvci5uYW1lLmluY2x1ZGVzKFwiLlwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIGludGVybmFsIHN0cmluZyB2YWx1ZSB0byB0aGUgZXh0ZXJuYWwgdmFsdWUgb2YgdHlwZSAnZXh0ZXJuYWxWYWx1ZVR5cGUnLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIGludGVybmFsIHN0cmluZyB2YWx1ZSB0byBiZSBwYXJzZWRcblx0ICogQHBhcmFtIGV4dGVybmFsVmFsdWVUeXBlIFRoZSBleHRlcm5hbCB2YWx1ZSB0eXBlLCBlLmcuIGludCwgZmxvYXRbXSwgc3RyaW5nLCBldGMuXG5cdCAqIEByZXR1cm5zIFRoZSBwYXJzZWQgdmFsdWVcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX3N0cmluZ1RvRXh0ZXJuYWwodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdLCBleHRlcm5hbFZhbHVlVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nW10ge1xuXHRcdGxldCBleHRlcm5hbFZhbHVlO1xuXHRcdGNvbnN0IGV4dGVybmFsVHlwZSA9IHRoaXMuX2dldFR5cGVJbnN0YW5jZShleHRlcm5hbFZhbHVlVHlwZSk7XG5cblx0XHRpZiAoZXh0ZXJuYWxWYWx1ZVR5cGUgJiYgVmFsdWUuX2lzQXJyYXlUeXBlKGV4dGVybmFsVmFsdWVUeXBlKSkge1xuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV07XG5cdFx0XHR9XG5cdFx0XHRleHRlcm5hbFZhbHVlID0gdmFsdWUubWFwKCh2YWx1ZUVsZW1lbnQ6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZXh0ZXJuYWxUeXBlID8gZXh0ZXJuYWxUeXBlLnBhcnNlVmFsdWUodmFsdWVFbGVtZW50LCBWYWx1ZS5JTlRFUk5BTF9WQUxVRV9UWVBFKSA6IHZhbHVlRWxlbWVudDtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRleHRlcm5hbFZhbHVlID0gZXh0ZXJuYWxUeXBlID8gZXh0ZXJuYWxUeXBlLnBhcnNlVmFsdWUodmFsdWUgYXMgc3RyaW5nLCBWYWx1ZS5JTlRFUk5BTF9WQUxVRV9UWVBFKSA6IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBleHRlcm5hbFZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgd2hldGhlciB0YXJnZXQgdHlwZSBpcyBhbiBhcnJheS5cblx0ICpcblx0ICogQHBhcmFtIHRhcmdldFR5cGUgVGhlIHRhcmdldCB0eXBlIG5hbWVcblx0ICogQHJldHVybnMgYHRydWVgLCBpZiBhcnJheSB0eXBlIChgZmFsc2VgIG90aGVyd2lzZSlcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9pc0FycmF5VHlwZSh0YXJnZXRUeXBlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRpZiAoIXRhcmdldFR5cGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldFR5cGUgPT09IFwiYXJyYXlcIiB8fCB0YXJnZXRUeXBlLmVuZHNXaXRoKFwiW11cIik7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZXh0ZXJuYWwgdmFsdWUgZm9ybWF0dGVkIGFzIHRoZSBpbnRlcm5hbCBzdHJpbmcgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBleHRlcm5hbFZhbHVlIFRoZSB2YWx1ZSB0byBiZSBwYXJzZWRcblx0ICogQHBhcmFtIGV4dGVybmFsVmFsdWVUeXBlIFRoZSBleHRlcm5hbCB2YWx1ZSB0eXBlLCBlLmcuIGludCwgZmxvYXRbXSwgc3RyaW5nLCBldGMuXG5cdCAqIEByZXR1cm5zIFRoZSBmb3JtYXR0ZWQgdmFsdWVcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2V4dGVybmFsVG9TdHJpbmcoZXh0ZXJuYWxWYWx1ZTogc3RyaW5nIHwgc3RyaW5nW10sIGV4dGVybmFsVmFsdWVUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuXHRcdGxldCB2YWx1ZTtcblx0XHRjb25zdCBleHRlcm5hbFR5cGUgPSB0aGlzLl9nZXRUeXBlSW5zdGFuY2UoZXh0ZXJuYWxWYWx1ZVR5cGUpO1xuXG5cdFx0aWYgKGV4dGVybmFsVmFsdWVUeXBlICYmIFZhbHVlLl9pc0FycmF5VHlwZShleHRlcm5hbFZhbHVlVHlwZSkpIHtcblx0XHRcdGlmICghQXJyYXkuaXNBcnJheShleHRlcm5hbFZhbHVlKSkge1xuXHRcdFx0XHRleHRlcm5hbFZhbHVlID0gW2V4dGVybmFsVmFsdWVdO1xuXHRcdFx0fVxuXHRcdFx0dmFsdWUgPSBleHRlcm5hbFZhbHVlLm1hcCgodmFsdWVFbGVtZW50OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIGV4dGVybmFsVHlwZSA/IGV4dGVybmFsVHlwZS5mb3JtYXRWYWx1ZSh2YWx1ZUVsZW1lbnQsIFZhbHVlLklOVEVSTkFMX1ZBTFVFX1RZUEUpIDogdmFsdWVFbGVtZW50O1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhbHVlID0gZXh0ZXJuYWxUeXBlID8gZXh0ZXJuYWxUeXBlLmZvcm1hdFZhbHVlKGV4dGVybmFsVmFsdWUgYXMgc3RyaW5nLCBWYWx1ZS5JTlRFUk5BTF9WQUxVRV9UWVBFKSA6IGV4dGVybmFsVmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgZGVmYXVsdCB0eXBlIGluc3RhbmNlIGZvciBnaXZlbiB0eXBlIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB0eXBlTmFtZSBUaGUgbmFtZSBvZiB0aGUgdHlwZVxuXHQgKiBAcmV0dXJucyBUaGUgdHlwZSBpbnN0YW5jZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfZ2V0VHlwZUluc3RhbmNlKHR5cGVOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBTaW1wbGVUeXBlIHtcblx0XHR0eXBlTmFtZSA9IHRoaXMuZ2V0RWxlbWVudFR5cGVOYW1lKHR5cGVOYW1lKSB8fCB0eXBlTmFtZTtcblxuXHRcdHN3aXRjaCAodHlwZU5hbWUpIHtcblx0XHRcdGNhc2UgXCJzdHJpbmdcIjpcblx0XHRcdFx0cmV0dXJuIG5ldyBTdHJpbmdUeXBlKCk7XG5cdFx0XHRjYXNlIFwibnVtYmVyXCI6XG5cdFx0XHRjYXNlIFwiaW50XCI6XG5cdFx0XHRcdHJldHVybiBuZXcgSW50ZWdlclR5cGUoKTtcblx0XHRcdGNhc2UgXCJmbG9hdFwiOlxuXHRcdFx0XHRyZXR1cm4gbmV3IEZsb2F0VHlwZSgpO1xuXHRcdFx0Y2FzZSBcImRhdGVcIjpcblx0XHRcdFx0cmV0dXJuIG5ldyBEYXRlVHlwZSgpO1xuXHRcdFx0Y2FzZSBcImJvb2xlYW5cIjpcblx0XHRcdFx0cmV0dXJuIG5ldyBCb29sZWFuVHlwZSgpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0TG9nLmVycm9yKFwiVW5leHBlY3RlZCBmaWx0ZXIgdHlwZVwiKTtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBmaWx0ZXIgdHlwZVwiKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZGVmYXVsdCBvcGVyYXRvciBuYW1lIChcIkVRXCIpLlxuXHQgKiBTaG91bGQgYmUgb3ZlcnJpZGRlbiBvbiBkZW1hbmQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBkZWZhdWx0IG9wZXJhdG9yIG5hbWVcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0Z2V0RGVmYXVsdE9wZXJhdG9yTmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiAoRmlsdGVyT3BlcmF0b3JVdGlsLmdldEVRT3BlcmF0b3IoKSBhcyBBdWdtZW50ZWRPcGVyYXRvcikubmFtZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGZpcnN0IHZhbHVlIG9mIGFycmF5IG9yIGlucHV0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWVzIElucHV0IGNvbmRpdGlvbiB2YWx1ZVxuXHQgKiBAcmV0dXJucyBVbmNoYW5nZWQgaW5wdXQgY29uZGl0aW9uIHZhbHVlXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdGZvcm1hdENvbmRpdGlvblZhbHVlcyh2YWx1ZXM6IHN0cmluZ1tdIHwgc3RyaW5nKTogc3RyaW5nW10gfCBzdHJpbmcge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlcykgJiYgdmFsdWVzLmxlbmd0aCA/IHZhbHVlc1swXSA6ICh2YWx1ZXMgYXMgc3RyaW5nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBlbGVtZW50IHR5cGUgbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHR5cGVOYW1lIFRoZSBhY3R1YWwgdHlwZSBuYW1lXG5cdCAqIEByZXR1cm5zIFRoZSB0eXBlIG9mIGl0cyBlbGVtZW50c1xuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRnZXRFbGVtZW50VHlwZU5hbWUodHlwZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKHR5cGVOYW1lPy5lbmRzV2l0aChcIltdXCIpKSB7XG5cdFx0XHRyZXR1cm4gdHlwZU5hbWUuc3Vic3RyaW5nKDAsIHR5cGVOYW1lLmxlbmd0aCAtIDIpO1xuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHN0cmluZyB2YWx1ZSBwYXJzZWQgdG8gdGhlIGV4dGVybmFsIHZhbHVlIHR5cGUgJ3RoaXMub3BlcmF0b3InLlxuXHQgKlxuXHQgKiBAcGFyYW0gaW50ZXJuYWxWYWx1ZSBUaGUgaW50ZXJuYWwgc3RyaW5nIHZhbHVlIHRvIGJlIGZvcm1hdHRlZFxuXHQgKiBAcGFyYW0gZXh0ZXJuYWxWYWx1ZVR5cGUgVGhlIGV4dGVybmFsIHZhbHVlIHR5cGUsIGUuZy4gaW50LCBmbG9hdFtdLCBzdHJpbmcsIGV0Yy5cblx0ICogQHJldHVybnMgVGhlIGZvcm1hdHRlZCB2YWx1ZVxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRmb3JtYXRWYWx1ZShpbnRlcm5hbFZhbHVlOiBhbnkgfCB1bmRlZmluZWQsIGV4dGVybmFsVmFsdWVUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBhbnkge1xuXHRcdGlmICghaW50ZXJuYWxWYWx1ZSkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0Y29uc3QgaXNNdWx0aVZhbHVlT3BlcmF0b3IgPSB0aGlzLl9pc011bHRpVmFsdWVPcGVyYXRvcih0aGlzLm9wZXJhdG9yKSxcblx0XHRcdGludGVybmFsVHlwZSA9IHRoaXMuX2dldFR5cGVJbnN0YW5jZShWYWx1ZS5JTlRFUk5BTF9WQUxVRV9UWVBFKTtcblxuXHRcdC8vICBmcm9tIGludGVybmFsIG1vZGVsIHN0cmluZyB3aXRoIG9wZXJhdG9yXG5cdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5vcGVyYXRvci5wYXJzZShpbnRlcm5hbFZhbHVlIHx8IFwiXCIsIGludGVybmFsVHlwZSwgRmllbGREaXNwbGF5LlZhbHVlLCBmYWxzZSk7XG5cdFx0Y29uc3QgdmFsdWUgPSAhaXNNdWx0aVZhbHVlT3BlcmF0b3IgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzWzBdIDogdmFsdWVzO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3N0cmluZ1RvRXh0ZXJuYWwodmFsdWUsIGV4dGVybmFsVmFsdWVUeXBlKTsgLy8gVGhlIHZhbHVlIGJvdW5kIHRvIGEgY3VzdG9tIGZpbHRlclxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHZhbHVlIHBhcnNlZCB0byB0aGUgaW50ZXJuYWwgc3RyaW5nIHZhbHVlLlxuXHQgKlxuXHQgKiBAcGFyYW0gZXh0ZXJuYWxWYWx1ZSBUaGUgdmFsdWUgdG8gYmUgcGFyc2VkXG5cdCAqIEBwYXJhbSBleHRlcm5hbFZhbHVlVHlwZSBUaGUgZXh0ZXJuYWwgdmFsdWUgdHlwZSwgZS5nLiBpbnQsIGZsb2F0W10sIHN0cmluZywgZXRjLlxuXHQgKiBAcmV0dXJucyBUaGUgcGFyc2VkIHZhbHVlXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHBhcnNlVmFsdWUoZXh0ZXJuYWxWYWx1ZTogYW55IHwgdW5kZWZpbmVkLCBleHRlcm5hbFZhbHVlVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYW55IHtcblx0XHRpZiAoIWV4dGVybmFsVmFsdWUpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGNvbnN0IGlzTXVsdGlWYWx1ZU9wZXJhdG9yID0gdGhpcy5faXNNdWx0aVZhbHVlT3BlcmF0b3IodGhpcy5vcGVyYXRvciksXG5cdFx0XHRleHRlcm5hbFR5cGUgPSB0aGlzLl9nZXRUeXBlSW5zdGFuY2UoZXh0ZXJuYWxWYWx1ZVR5cGUpO1xuXG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLl9leHRlcm5hbFRvU3RyaW5nKGV4dGVybmFsVmFsdWUsIGV4dGVybmFsVmFsdWVUeXBlKTtcblxuXHRcdC8vIEZvcm1hdCB0byBpbnRlcm5hbCBtb2RlbCBzdHJpbmcgd2l0aCBvcGVyYXRvclxuXHRcdGNvbnN0IHZhbHVlcyA9IGlzTXVsdGlWYWx1ZU9wZXJhdG9yID8gdmFsdWUgOiBbdmFsdWVdO1xuXG5cdFx0aWYgKHRoaXMuaGFzQ3VzdG9tT3BlcmF0b3IoKSkge1xuXHRcdFx0Ly8gUmV0dXJuIGEgY29tcGxleCBvYmplY3Qgd2hpbGUgcGFyc2luZyB0aGUgYm91bmQgdmFsdWUgaW4gc2FwLnVpLm1vZGVsLlByb3BlcnR5QmluZGluZy5qcyNfZXh0ZXJuYWxUb1JhdygpXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRvcGVyYXRvcjogdGhpcy5vcGVyYXRvci5uYW1lLFxuXHRcdFx0XHR2YWx1ZXM6IFt0aGlzLm9wZXJhdG9yLmZvcm1hdCh7IHZhbHVlczogdmFsdWVzIH0gYXMgQ29uZGl0aW9uT2JqZWN0LCBleHRlcm5hbFR5cGUpXSxcblx0XHRcdFx0dmFsaWRhdGVkOiB1bmRlZmluZWRcblx0XHRcdH07XG5cdFx0fVxuXHRcdC8vIFJldHVybiBhIHNpbXBsZSBzdHJpbmcgdmFsdWUgdG8gYmUgc3RvcmVkIGluIHRoZSBpbnRlcm5hbCAnZmlsdGVyVmFsdWVzJyBtb2RlbFxuXHRcdHJldHVybiB0aGlzLm9wZXJhdG9yLmZvcm1hdCh7IHZhbHVlczogdmFsdWVzIH0gYXMgQ29uZGl0aW9uT2JqZWN0LCBleHRlcm5hbFR5cGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFZhbGlkYXRlcyB3aGV0aGVyIHRoZSBnaXZlbiB2YWx1ZSBpbiBtb2RlbCByZXByZXNlbnRhdGlvbiBpcyB2YWxpZC5cblx0ICpcblx0ICogQHBhcmFtIGV4dGVybmFsVmFsdWUgVGhlIHZhbHVlIHRvIGJlIHZhbGlkYXRlZFxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdHZhbGlkYXRlVmFsdWUoZXh0ZXJuYWxWYWx1ZTogdW5rbm93bik6IHZvaWQge1xuXHRcdC8qIERvIE5vdGhpbmcgKi9cblx0fVxufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O01BNkJxQkEsSztFQUpyQjtBQUNBO0FBQ0E7U0FDQ0MsY0FBYyxDQUFDLGlDQUFELEM7OztJQU1kO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDQyxlQUFZQyxhQUFaLEVBQWtEQyxXQUFsRCxFQUF1RTtNQUFBOztNQUN0RSwrQkFBTUQsYUFBTixFQUFxQkMsV0FBckI7O01BQ0EsSUFBTUMs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