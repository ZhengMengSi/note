/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/fe/macros/filter/type/Value"], function (ClassSupport, Value) {
  "use strict";

  var _dec, _class;

  var _exports = {};
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var MultiValue = (
  /**
   * Handle format/parse of multi value filters.
   */
  _dec = defineUI5Class("sap.fe.macros.filter.type.MultiValue"), _dec(_class = /*#__PURE__*/function (_Value) {
    _inheritsLoose(MultiValue, _Value);

    function MultiValue() {
      return _Value.apply(this, arguments) || this;
    }

    _exports = MultiValue;
    var _proto = MultiValue.prototype;

    /**
     * Returns the unchanged values.
     *
     * @param values Input condition value
     * @returns First value of array or input
     * @protected
     */
    _proto.formatConditionValues = function formatConditionValues(values) {
      return values;
    }
    /**
     * Returns the string value parsed to the external value type.
     *
     * @param internalValue The internal string value to be formatted
     * @param externalValueType The external value type, e.g. int, float[], string, etc.
     * @returns The formatted value
     * @protected
     */
    ;

    _proto.formatValue = function formatValue(internalValue, externalValueType) {
      var _this = this;

      var result = internalValue;

      if (typeof result === "string") {
        result = result.split(",");
      }

      if (Array.isArray(result)) {
        result = result.map(function (value) {
          return _Value.prototype.formatValue.call(_this, value, _this.getElementTypeName(externalValueType));
        }).filter(function (value) {
          return value !== undefined;
        });
      }

      return result || [];
    }
    /**
     * Returns the value parsed to the internal string value.
     *
     * @param externalValue The value to be parsed
     * @param externalValueType The external value type, e.g. int, float[], string, etc.
     * @returns The parsed value
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto.parseValue = function parseValue(externalValue, externalValueType) {
      var _this2 = this;

      if (!externalValue) {
        externalValue = [];
      }

      return externalValue.map(function (value) {
        return _this2.operator.format({
          values: value || []
        });
      });
    };

    return MultiValue;
  }(Value)) || _class);
  _exports = MultiValue;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNdWx0aVZhbHVlIiwiZGVmaW5lVUk1Q2xhc3MiLCJmb3JtYXRDb25kaXRpb25WYWx1ZXMiLCJ2YWx1ZXMiLCJmb3JtYXRWYWx1ZSIsImludGVybmFsVmFsdWUiLCJleHRlcm5hbFZhbHVlVHlwZSIsInJlc3VsdCIsInNwbGl0IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwidmFsdWUiLCJnZXRFbGVtZW50VHlwZU5hbWUiLCJmaWx0ZXIiLCJ1bmRlZmluZWQiLCJwYXJzZVZhbHVlIiwiZXh0ZXJuYWxWYWx1ZSIsIm9wZXJhdG9yIiwiZm9ybWF0IiwiVmFsdWUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIk11bHRpVmFsdWUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBWYWx1ZSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWx0ZXIvdHlwZS9WYWx1ZVwiO1xuaW1wb3J0IHR5cGUgeyBDb25kaXRpb25PYmplY3QgfSBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vQ29uZGl0aW9uXCI7XG5cbi8qKlxuICogSGFuZGxlIGZvcm1hdC9wYXJzZSBvZiBtdWx0aSB2YWx1ZSBmaWx0ZXJzLlxuICovXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUubWFjcm9zLmZpbHRlci50eXBlLk11bHRpVmFsdWVcIilcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB1bmNoYW5nZWQgdmFsdWVzLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWVzIElucHV0IGNvbmRpdGlvbiB2YWx1ZVxuXHQgKiBAcmV0dXJucyBGaXJzdCB2YWx1ZSBvZiBhcnJheSBvciBpbnB1dFxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRmb3JtYXRDb25kaXRpb25WYWx1ZXModmFsdWVzOiBzdHJpbmdbXSB8IHN0cmluZyk6IHN0cmluZ1tdIHwgc3RyaW5nIHtcblx0XHRyZXR1cm4gdmFsdWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHN0cmluZyB2YWx1ZSBwYXJzZWQgdG8gdGhlIGV4dGVybmFsIHZhbHVlIHR5cGUuXG5cdCAqXG5cdCAqIEBwYXJhbSBpbnRlcm5hbFZhbHVlIFRoZSBpbnRlcm5hbCBzdHJpbmcgdmFsdWUgdG8gYmUgZm9ybWF0dGVkXG5cdCAqIEBwYXJhbSBleHRlcm5hbFZhbHVlVHlwZSBUaGUgZXh0ZXJuYWwgdmFsdWUgdHlwZSwgZS5nLiBpbnQsIGZsb2F0W10sIHN0cmluZywgZXRjLlxuXHQgKiBAcmV0dXJucyBUaGUgZm9ybWF0dGVkIHZhbHVlXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdGZvcm1hdFZhbHVlKGludGVybmFsVmFsdWU6IGFueSB8IHVuZGVmaW5lZCwgZXh0ZXJuYWxWYWx1ZVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IGFueSB7XG5cdFx0bGV0IHJlc3VsdCA9IGludGVybmFsVmFsdWU7XG5cblx0XHRpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0cmVzdWx0ID0gcmVzdWx0LnNwbGl0KFwiLFwiKTtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG5cdFx0XHRyZXN1bHQgPSByZXN1bHRcblx0XHRcdFx0Lm1hcCgodmFsdWU6IHN0cmluZykgPT4gc3VwZXIuZm9ybWF0VmFsdWUodmFsdWUsIHRoaXMuZ2V0RWxlbWVudFR5cGVOYW1lKGV4dGVybmFsVmFsdWVUeXBlKSkpXG5cdFx0XHRcdC5maWx0ZXIoKHZhbHVlOiBzdHJpbmcpID0+IHZhbHVlICE9PSB1bmRlZmluZWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQgfHwgW107XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdmFsdWUgcGFyc2VkIHRvIHRoZSBpbnRlcm5hbCBzdHJpbmcgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBleHRlcm5hbFZhbHVlIFRoZSB2YWx1ZSB0byBiZSBwYXJzZWRcblx0ICogQHBhcmFtIGV4dGVybmFsVmFsdWVUeXBlIFRoZSBleHRlcm5hbCB2YWx1ZSB0eXBlLCBlLmcuIGludCwgZmxvYXRbXSwgc3RyaW5nLCBldGMuXG5cdCAqIEByZXR1cm5zIFRoZSBwYXJzZWQgdmFsdWVcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRwYXJzZVZhbHVlKGV4dGVybmFsVmFsdWU6IGFueSB8IHVuZGVmaW5lZCwgZXh0ZXJuYWxWYWx1ZVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IGFueSB7XG5cdFx0aWYgKCFleHRlcm5hbFZhbHVlKSB7XG5cdFx0XHRleHRlcm5hbFZhbHVlID0gW107XG5cdFx0fVxuXHRcdHJldHVybiBleHRlcm5hbFZhbHVlLm1hcCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMub3BlcmF0b3IuZm9ybWF0KHsgdmFsdWVzOiB2YWx1ZSB8fCBbXSB9IGFzIENvbmRpdGlvbk9iamVjdCk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7OztNQVFxQkEsVTtFQUpyQjtBQUNBO0FBQ0E7U0FDQ0MsY0FBYyxDQUFDLHNDQUFELEM7Ozs7Ozs7Ozs7SUFFZDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtXQUNDQyxxQixHQUFBLCtCQUFzQkMsTUFBdEIsRUFBb0U7TUFDbkUsT0FBT0EsTUFBUDtJQUNBO0lBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1dBQ0NDLFcsR0FBQSxxQkFBWUMsYUFBWixFQUE0Q0MsaUJBQTVDLEVBQXdGO01BQUE7O01BQ3ZGLElBQUlDLE1BQU0sR0FBR0YsYUFBYjs7TUFFQSxJQUFJLE9BQU9FLE1BQVAsS0FBa0IsUUFBdEIsRUFBZ0M7UUFDL0JBLE1BQU0sR0FBR0EsTUFBTSxDQUFDQyxLQUFQLENBQWEsR0FBYixDQUFUO01BQ0E7O01BRUQsSUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNILE1BQWQsQ0FBSixFQUEyQjtRQUMxQkEsTUFBTSxHQUFHQSxNQUFNLENBQ2JJLEdBRE8sQ0FDSCxVQUFDQyxLQUFEO1VBQUEsd0JBQXlCUixXQUF6QixhQUFxQ1EsS0FBckMsRUFBNEMsS0FBSSxDQUFDQyxrQkFBTCxDQUF3QlAsaUJBQXhCLENBQTVDO1FBQUEsQ0FERyxFQUVQUSxNQUZPLENBRUEsVUFBQ0YsS0FBRDtVQUFBLE9BQW1CQSxLQUFLLEtBQUtHLFNBQTdCO1FBQUEsQ0FGQSxDQUFUO01BR0E7O01BRUQsT0FBT1IsTUFBTSxJQUFJLEVBQWpCO0lBQ0E7SUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0M7OztXQUNBUyxVLEdBQUEsb0JBQVdDLGFBQVgsRUFBMkNYLGlCQUEzQyxFQUF1RjtNQUFBOztNQUN0RixJQUFJLENBQUNXLGFBQUwsRUFBb0I7UUFDbkJBLGFBQWEsR0FBRyxFQUFoQjtNQUNBOztNQUNELE9BQU9BLGFBQWEsQ0FBQ04sR0FBZCxDQUFrQixVQUFDQyxLQUFELEVBQWdCO1FBQ3hDLE9BQU8sTUFBSSxDQUFDTSxRQUFMLENBQWNDLE1BQWQsQ0FBcUI7VUFBRWhCLE1BQU0sRUFBRVMsS0FBSyxJQUFJO1FBQW5CLENBQXJCLENBQVA7TUFDQSxDQUZNLENBQVA7SUFHQSxDOzs7SUFwRHNDUSxLIn0=