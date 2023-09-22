/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/SemanticDateOperators", "sap/ui/base/ManagedObjectObserver", "sap/ui/core/Control", "sap/ui/mdc/condition/Condition", "sap/ui/mdc/enum/ConditionValidated", "sap/ui/mdc/field/ConditionsType", "sap/ui/model/json/JSONModel"], function (ClassSupport, SemanticDateOperators, ManagedObjectObserver, Control, Condition, ConditionValidated, ConditionsType, JSONModel) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3;

  var _exports = {};
  var property = ClassSupport.property;
  var implementInterface = ClassSupport.implementInterface;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var CustomFilterFieldContentWrapper = (
  /**
   * @class
   * Creates an <code>sap.fe.core.controls.CustomFilterFieldContentWrapper</code> object.
   * This is used in the {@link sap.ui.mdc.FilterField FilterField} as a filter content.
   * @extends sap.ui.core.Control
   * @private
   * @alias sap.fe.core.controls.CustomFilterFieldContentWrapper
   */
  _dec = defineUI5Class("sap.fe.core.controls.CustomFilterFieldContentWrapper"), _dec2 = implementInterface("sap.ui.core.IFormContent"), _dec3 = property({
    type: "sap.ui.core.CSSSize",
    defaultValue: null
  }), _dec4 = property({
    type: "boolean",
    defaultValue: false
  }), _dec5 = property({
    type: "object[]",
    defaultValue: []
  }), _dec6 = aggregation({
    type: "sap.ui.core.Control",
    multiple: false,
    isDefault: true
  }), _dec7 = event(), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_Control) {
    _inheritsLoose(CustomFilterFieldContentWrapper, _Control);

    function CustomFilterFieldContentWrapper() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Control.call.apply(_Control, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "__implements__sap_ui_core_IFormContent", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "width", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "formDoNotAdjustWidth", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "conditions", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "content", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "conditionsChange", _descriptor6, _assertThisInitialized(_this));

      return _this;
    }

    _exports = CustomFilterFieldContentWrapper;

    CustomFilterFieldContentWrapper.render = function render(renderManager, control) {
      renderManager.openStart("div", control);
      renderManager.style("min-height", "1rem");
      renderManager.style("width", control.width);
      renderManager.openEnd();
      renderManager.renderControl(control.getContent()); // render the child Control

      renderManager.close("div"); // end of the complete Control
    }
    /**
     * Maps an array of filter values to an array of conditions.
     *
     * @param filterValues Array of filter value bindings or a filter value string
     * @param [operator] The operator to be used (optional) - if not set, the default operator (EQ) will be used
     * @private
     * @returns Array of filter conditions
     */
    ;

    CustomFilterFieldContentWrapper._filterValuesToConditions = function _filterValuesToConditions(filterValues, operator) {
      var formatOptions = {
        operators: []
      },
          conditions = [];

      if (operator) {
        formatOptions = {
          operators: [operator]
        };
      }

      if (filterValues === "") {
        filterValues = [];
      } else if (typeof filterValues === "object" && filterValues.hasOwnProperty("operator") && filterValues.hasOwnProperty("values")) {
        formatOptions = {
          operators: [filterValues.operator]
        };
        filterValues = filterValues.values;
      } else if (filterValues !== undefined && typeof filterValues !== "object" && typeof filterValues !== "string") {
        throw new Error("FilterUtils.js#_filterValuesToConditions: Unexpected type of input parameter vValues: ".concat(typeof filterValues));
      }

      var conditionsType = new ConditionsType(formatOptions);
      var conditionValues = Array.isArray(filterValues) ? filterValues : [filterValues]; // Shortcut for operator without values and semantic date operations

      if (typeof operator === "string" && (conditionValues.length === 0 || SemanticDateOperators.getSemanticDateOperations().includes(operator))) {
        conditions = [Condition.createCondition(operator, conditionValues, null, null, ConditionValidated.NotValidated)];
      } else {
        conditions = conditionValues.map(function (conditionValue) {
          var stringValue = conditionValue === null || conditionValue === void 0 ? void 0 : conditionValue.toString(),
              parsedConditions = conditionsType.parseValue(stringValue, "any");
          return parsedConditions === null || parsedConditions === void 0 ? void 0 : parsedConditions[0];
        }).filter(function (conditionValue) {
          return conditionValue !== undefined;
        });
      }

      return conditions;
    }
    /**
     * Maps an array of conditions to a comma separated list of filter values.
     *
     * @param conditions Array of filter conditions
     * @param formatOptions Format options that specifies a condition type
     * @private
     * @returns Concatenated string of filter values
     */
    ;

    CustomFilterFieldContentWrapper._conditionsToFilterModelString = function _conditionsToFilterModelString(conditions, formatOptions) {
      var conditionsType = new ConditionsType(formatOptions);
      return conditions.map(function (condition) {
        return conditionsType.formatValue([condition], "any") || "";
      }).filter(function (stringValue) {
        return stringValue !== "";
      }).join(",");
    }
    /**
     * Listens to filter model changes and updates wrapper property "conditions".
     *
     * @param changeEvent Event triggered by a filter model change
     * @private
     */
    ;

    var _proto = CustomFilterFieldContentWrapper.prototype;

    _proto._handleFilterModelChange = function _handleFilterModelChange(changeEvent) {
      var propertyPath = this.getObjectBinding("filterValues").getPath(),
          values = changeEvent.getSource().getProperty(propertyPath);
      this.updateConditionsByFilterValues(values, "");
    }
    /**
     * Listens to "conditions" changes and updates the filter model.
     *
     * @param conditions Event triggered by a "conditions" change
     * @private
     */
    ;

    _proto._handleConditionsChange = function _handleConditionsChange(conditions) {
      this.updateFilterModelByConditions(conditions);
    }
    /**
     * Initialize CustomFilterFieldContentWrapper control and register observer.
     */
    ;

    _proto.init = function init() {
      _Control.prototype.init.call(this);

      this._conditionsObserver = new ManagedObjectObserver(this._observeChanges.bind(this));

      this._conditionsObserver.observe(this, {
        properties: ["conditions"]
      });

      this._filterModel = new JSONModel();

      this._filterModel.attachPropertyChange(this._handleFilterModelChange, this);

      this.setModel(this._filterModel, CustomFilterFieldContentWrapper.FILTER_MODEL_ALIAS);
    }
    /**
     * Overrides {@link sap.ui.core.Control#clone Control.clone} to clone additional
     * internal states.
     *
     * @param [sIdSuffix] A suffix to be appended to the cloned control id
     * @param [aLocalIds] An array of local IDs within the cloned hierarchy (internally used)
     * @returns Reference to the newly created clone
     * @protected
     */
    ;

    _proto.clone = function clone(sIdSuffix, aLocalIds) {
      var clone = _Control.prototype.clone.call(this, sIdSuffix, aLocalIds); // During cloning, the old model will be copied and overwrites any new model (same alias) that
      // you introduce during init(); hence you need to overwrite it again by the new one that you've
      // created during init() (i.e. clone._filterModel); that standard behaviour of super.clone()
      // can't even be suppressed in an own constructor; for a detailed investigation of the cloning,
      // please overwrite the setModel() method and check the list of callers and steps induced by them.


      clone.setModel(clone._filterModel, CustomFilterFieldContentWrapper.FILTER_MODEL_ALIAS);
      return clone;
    }
    /**
     * Listens to property changes.
     *
     * @param changes Property changes
     * @private
     */
    ;

    _proto._observeChanges = function _observeChanges(changes) {
      if (changes.name === "conditions") {
        this._handleConditionsChange(changes.current);
      }
    }
    /**
     * Gets the content of this wrapper control.
     *
     * @returns The wrapper content
     * @private
     */
    ;

    _proto.getContent = function getContent() {
      return this.getAggregation("content");
    }
    /**
     * Gets the value for control property 'conditions'.
     *
     * @returns Array of filter conditions
     * @private
     */
    ;

    _proto.getConditions = function getConditions() {
      return this.getProperty("conditions");
    }
    /**
     * Sets the value for control property 'conditions'.
     *
     * @param [conditions] Array of filter conditions
     * @returns Reference to this wrapper
     * @private
     */
    ;

    _proto.setConditions = function setConditions(conditions) {
      this.setProperty("conditions", conditions || []);
      return this;
    }
    /**
     * Gets the filter model alias 'filterValues'.
     *
     * @returns The filter model
     * @private
     */
    ;

    _proto.getFilterModelAlias = function getFilterModelAlias() {
      return CustomFilterFieldContentWrapper.FILTER_MODEL_ALIAS;
    }
    /**
     * Updates the property "conditions" with filter values
     * sent by ExtensionAPI#setFilterValues().
     *
     * @param values The filter values
     * @param [operator] The operator name
     * @private
     */
    ;

    _proto.updateConditionsByFilterValues = function updateConditionsByFilterValues(values, operator) {
      var conditions = CustomFilterFieldContentWrapper._filterValuesToConditions(values, operator);

      this.setConditions(conditions);
    }
    /**
     * Updates filter model with conditions
     * sent by the {@link sap.ui.mdc.FilterField FilterField}.
     *
     * @param conditions Array of filter conditions
     * @private
     */
    ;

    _proto.updateFilterModelByConditions = function updateFilterModelByConditions(conditions) {
      var _conditions$;

      var operator = ((_conditions$ = conditions[0]) === null || _conditions$ === void 0 ? void 0 : _conditions$.operator) || "";
      var formatOptions = operator !== "" ? {
        operators: [operator]
      } : {
        operators: []
      };

      if (this.getBindingContext(CustomFilterFieldContentWrapper.FILTER_MODEL_ALIAS)) {
        var _this$getBindingConte;

        var stringValue = CustomFilterFieldContentWrapper._conditionsToFilterModelString(conditions, formatOptions);

        this._filterModel.setProperty((_this$getBindingConte = this.getBindingContext(CustomFilterFieldContentWrapper.FILTER_MODEL_ALIAS)) === null || _this$getBindingConte === void 0 ? void 0 : _this$getBindingConte.getPath(), stringValue);
      }
    };

    _proto.getAccessibilityInfo = function getAccessibilityInfo() {
      var _content$getAccessibi;

      var content = this.getContent();
      return (content === null || content === void 0 ? void 0 : (_content$getAccessibi = content.getAccessibilityInfo) === null || _content$getAccessibi === void 0 ? void 0 : _content$getAccessibi.call(content)) || {};
    };

    return CustomFilterFieldContentWrapper;
  }(Control), _class3.FILTER_MODEL_ALIAS = "filterValues", _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "__implements__sap_ui_core_IFormContent", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "width", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "formDoNotAdjustWidth", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "conditions", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "conditionsChange", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  _exports = CustomFilterFieldContentWrapper;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyIiwiZGVmaW5lVUk1Q2xhc3MiLCJpbXBsZW1lbnRJbnRlcmZhY2UiLCJwcm9wZXJ0eSIsInR5cGUiLCJkZWZhdWx0VmFsdWUiLCJhZ2dyZWdhdGlvbiIsIm11bHRpcGxlIiwiaXNEZWZhdWx0IiwiZXZlbnQiLCJyZW5kZXIiLCJyZW5kZXJNYW5hZ2VyIiwiY29udHJvbCIsIm9wZW5TdGFydCIsInN0eWxlIiwid2lkdGgiLCJvcGVuRW5kIiwicmVuZGVyQ29udHJvbCIsImdldENvbnRlbnQiLCJjbG9zZSIsIl9maWx0ZXJWYWx1ZXNUb0NvbmRpdGlvbnMiLCJmaWx0ZXJWYWx1ZXMiLCJvcGVyYXRvciIsImZvcm1hdE9wdGlvbnMiLCJvcGVyYXRvcnMiLCJjb25kaXRpb25zIiwiaGFzT3duUHJvcGVydHkiLCJ2YWx1ZXMiLCJ1bmRlZmluZWQiLCJFcnJvciIsImNvbmRpdGlvbnNUeXBlIiwiQ29uZGl0aW9uc1R5cGUiLCJjb25kaXRpb25WYWx1ZXMiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJTZW1hbnRpY0RhdGVPcGVyYXRvcnMiLCJnZXRTZW1hbnRpY0RhdGVPcGVyYXRpb25zIiwiaW5jbHVkZXMiLCJDb25kaXRpb24iLCJjcmVhdGVDb25kaXRpb24iLCJDb25kaXRpb25WYWxpZGF0ZWQiLCJOb3RWYWxpZGF0ZWQiLCJtYXAiLCJjb25kaXRpb25WYWx1ZSIsInN0cmluZ1ZhbHVlIiwidG9TdHJpbmciLCJwYXJzZWRDb25kaXRpb25zIiwicGFyc2VWYWx1ZSIsImZpbHRlciIsIl9jb25kaXRpb25zVG9GaWx0ZXJNb2RlbFN0cmluZyIsImNvbmRpdGlvbiIsImZvcm1hdFZhbHVlIiwiam9pbiIsIl9oYW5kbGVGaWx0ZXJNb2RlbENoYW5nZSIsImNoYW5nZUV2ZW50IiwicHJvcGVydHlQYXRoIiwiZ2V0T2JqZWN0QmluZGluZyIsImdldFBhdGgiLCJnZXRTb3VyY2UiLCJnZXRQcm9wZXJ0eSIsInVwZGF0ZUNvbmRpdGlvbnNCeUZpbHRlclZhbHVlcyIsIl9oYW5kbGVDb25kaXRpb25zQ2hhbmdlIiwidXBkYXRlRmlsdGVyTW9kZWxCeUNvbmRpdGlvbnMiLCJpbml0IiwiX2NvbmRpdGlvbnNPYnNlcnZlciIsIk1hbmFnZWRPYmplY3RPYnNlcnZlciIsIl9vYnNlcnZlQ2hhbmdlcyIsImJpbmQiLCJvYnNlcnZlIiwicHJvcGVydGllcyIsIl9maWx0ZXJNb2RlbCIsIkpTT05Nb2RlbCIsImF0dGFjaFByb3BlcnR5Q2hhbmdlIiwic2V0TW9kZWwiLCJGSUxURVJfTU9ERUxfQUxJQVMiLCJjbG9uZSIsInNJZFN1ZmZpeCIsImFMb2NhbElkcyIsImNoYW5nZXMiLCJuYW1lIiwiY3VycmVudCIsImdldEFnZ3JlZ2F0aW9uIiwiZ2V0Q29uZGl0aW9ucyIsInNldENvbmRpdGlvbnMiLCJzZXRQcm9wZXJ0eSIsImdldEZpbHRlck1vZGVsQWxpYXMiLCJnZXRCaW5kaW5nQ29udGV4dCIsImdldEFjY2Vzc2liaWxpdHlJbmZvIiwiY29udGVudCIsIkNvbnRyb2wiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkN1c3RvbUZpbHRlckZpZWxkQ29udGVudFdyYXBwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYWdncmVnYXRpb24sIGRlZmluZVVJNUNsYXNzLCBldmVudCwgaW1wbGVtZW50SW50ZXJmYWNlLCBwcm9wZXJ0eSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IFNlbWFudGljRGF0ZU9wZXJhdG9ycyBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TZW1hbnRpY0RhdGVPcGVyYXRvcnNcIjtcbmltcG9ydCBNYW5hZ2VkT2JqZWN0T2JzZXJ2ZXIgZnJvbSBcInNhcC91aS9iYXNlL01hbmFnZWRPYmplY3RPYnNlcnZlclwiO1xuaW1wb3J0IENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjsgLy9pbXBvcnQgQ29udHJvbCBmcm9tIFwic2FwL3VpL21kYy9maWVsZC9GaWVsZEJhc2VcIjtcbmltcG9ydCB0eXBlIHsgSUZvcm1Db250ZW50IH0gZnJvbSBcInNhcC91aS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCB0eXBlIFJlbmRlck1hbmFnZXIgZnJvbSBcInNhcC91aS9jb3JlL1JlbmRlck1hbmFnZXJcIjtcbmltcG9ydCB0eXBlIHsgQ29uZGl0aW9uT2JqZWN0IH0gZnJvbSBcInNhcC91aS9tZGMvY29uZGl0aW9uL0NvbmRpdGlvblwiO1xuaW1wb3J0IENvbmRpdGlvbiBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vQ29uZGl0aW9uXCI7XG5pbXBvcnQgQ29uZGl0aW9uVmFsaWRhdGVkIGZyb20gXCJzYXAvdWkvbWRjL2VudW0vQ29uZGl0aW9uVmFsaWRhdGVkXCI7XG5pbXBvcnQgQ29uZGl0aW9uc1R5cGUgZnJvbSBcInNhcC91aS9tZGMvZmllbGQvQ29uZGl0aW9uc1R5cGVcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuXG4vKipcbiAqIFR5cGUgdXNlZCBmb3IgZm9ybWF0IG9wdGlvbnNcbiAqXG4gKiBAdHlwZWRlZiBGb3JtYXRPcHRpb25zVHlwZVxuICovXG50eXBlIEZvcm1hdE9wdGlvbnNUeXBlID0ge1xuXHRvcGVyYXRvcnM6IHN0cmluZ1tdO1xufTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIENyZWF0ZXMgYW4gPGNvZGU+c2FwLmZlLmNvcmUuY29udHJvbHMuQ3VzdG9tRmlsdGVyRmllbGRDb250ZW50V3JhcHBlcjwvY29kZT4gb2JqZWN0LlxuICogVGhpcyBpcyB1c2VkIGluIHRoZSB7QGxpbmsgc2FwLnVpLm1kYy5GaWx0ZXJGaWVsZCBGaWx0ZXJGaWVsZH0gYXMgYSBmaWx0ZXIgY29udGVudC5cbiAqIEBleHRlbmRzIHNhcC51aS5jb3JlLkNvbnRyb2xcbiAqIEBwcml2YXRlXG4gKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbHMuQ3VzdG9tRmlsdGVyRmllbGRDb250ZW50V3JhcHBlclxuICovXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5jb250cm9scy5DdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyIGV4dGVuZHMgQ29udHJvbCBpbXBsZW1lbnRzIElGb3JtQ29udGVudCB7XG5cdEBpbXBsZW1lbnRJbnRlcmZhY2UoXCJzYXAudWkuY29yZS5JRm9ybUNvbnRlbnRcIilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRfX2ltcGxlbWVudHNfX3NhcF91aV9jb3JlX0lGb3JtQ29udGVudCA9IHRydWU7XG5cblx0QHByb3BlcnR5KHsgdHlwZTogXCJzYXAudWkuY29yZS5DU1NTaXplXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCB9KVxuXHR3aWR0aCE6IHN0cmluZztcblxuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KVxuXHRmb3JtRG9Ob3RBZGp1c3RXaWR0aCE6IGJvb2xlYW47XG5cblx0QHByb3BlcnR5KHsgdHlwZTogXCJvYmplY3RbXVwiLCBkZWZhdWx0VmFsdWU6IFtdIH0pXG5cdGNvbmRpdGlvbnMhOiBDb25kaXRpb25PYmplY3RbXTtcblxuXHRAYWdncmVnYXRpb24oeyB0eXBlOiBcInNhcC51aS5jb3JlLkNvbnRyb2xcIiwgbXVsdGlwbGU6IGZhbHNlLCBpc0RlZmF1bHQ6IHRydWUgfSlcblx0Y29udGVudCE6IENvbnRyb2w7XG5cblx0QGV2ZW50KClcblx0Y29uZGl0aW9uc0NoYW5nZSE6IEZ1bmN0aW9uO1xuXG5cdC8vIE5vdGU6IEZpZWxkQmFzZSBtaWdodCBiZSB1c2VkIGFzIGJhc2UgY29udHJvbCAoaW5zdGVhZCBvZiBDb250cm9sKSBpbiBhIGxhdGVyIHZlcnNpb247XG5cdC8vIGluIHRoYXQgY2FzZSwgeW91IHNob3VsZCBhZGQgYSAnY2hhbmdlJyBldmVudCBhbmQgYnViYmxlIGl0IHRvIHRoZSBjb3JyZXNwb25kaW5nIGhhbmRsZXJzXG5cblx0cHJpdmF0ZSBfZmlsdGVyTW9kZWw6IGFueTtcblx0cHJpdmF0ZSBfY29uZGl0aW9uc09ic2VydmVyOiBhbnk7XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTFRFUl9NT0RFTF9BTElBUyA9IFwiZmlsdGVyVmFsdWVzXCI7XG5cblx0c3RhdGljIHJlbmRlcihyZW5kZXJNYW5hZ2VyOiBSZW5kZXJNYW5hZ2VyLCBjb250cm9sOiBDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyKTogdm9pZCB7XG5cdFx0cmVuZGVyTWFuYWdlci5vcGVuU3RhcnQoXCJkaXZcIiwgY29udHJvbCk7XG5cdFx0cmVuZGVyTWFuYWdlci5zdHlsZShcIm1pbi1oZWlnaHRcIiwgXCIxcmVtXCIpO1xuXHRcdHJlbmRlck1hbmFnZXIuc3R5bGUoXCJ3aWR0aFwiLCBjb250cm9sLndpZHRoKTtcblx0XHRyZW5kZXJNYW5hZ2VyLm9wZW5FbmQoKTtcblx0XHRyZW5kZXJNYW5hZ2VyLnJlbmRlckNvbnRyb2woY29udHJvbC5nZXRDb250ZW50KCkpOyAvLyByZW5kZXIgdGhlIGNoaWxkIENvbnRyb2xcblx0XHRyZW5kZXJNYW5hZ2VyLmNsb3NlKFwiZGl2XCIpOyAvLyBlbmQgb2YgdGhlIGNvbXBsZXRlIENvbnRyb2xcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIGFuIGFycmF5IG9mIGZpbHRlciB2YWx1ZXMgdG8gYW4gYXJyYXkgb2YgY29uZGl0aW9ucy5cblx0ICpcblx0ICogQHBhcmFtIGZpbHRlclZhbHVlcyBBcnJheSBvZiBmaWx0ZXIgdmFsdWUgYmluZGluZ3Mgb3IgYSBmaWx0ZXIgdmFsdWUgc3RyaW5nXG5cdCAqIEBwYXJhbSBbb3BlcmF0b3JdIFRoZSBvcGVyYXRvciB0byBiZSB1c2VkIChvcHRpb25hbCkgLSBpZiBub3Qgc2V0LCB0aGUgZGVmYXVsdCBvcGVyYXRvciAoRVEpIHdpbGwgYmUgdXNlZFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBmaWx0ZXIgY29uZGl0aW9uc1xuXHQgKi9cblx0c3RhdGljIF9maWx0ZXJWYWx1ZXNUb0NvbmRpdGlvbnMoZmlsdGVyVmFsdWVzOiBhbnkgfCBhbnlbXSwgb3BlcmF0b3I/OiBzdHJpbmcpOiBDb25kaXRpb25PYmplY3RbXSB7XG5cdFx0bGV0IGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnNUeXBlID0geyBvcGVyYXRvcnM6IFtdIH0sXG5cdFx0XHRjb25kaXRpb25zID0gW107XG5cblx0XHRpZiAob3BlcmF0b3IpIHtcblx0XHRcdGZvcm1hdE9wdGlvbnMgPSB7IG9wZXJhdG9yczogW29wZXJhdG9yXSB9O1xuXHRcdH1cblx0XHRpZiAoZmlsdGVyVmFsdWVzID09PSBcIlwiKSB7XG5cdFx0XHRmaWx0ZXJWYWx1ZXMgPSBbXTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmaWx0ZXJWYWx1ZXMgPT09IFwib2JqZWN0XCIgJiYgZmlsdGVyVmFsdWVzLmhhc093blByb3BlcnR5KFwib3BlcmF0b3JcIikgJiYgZmlsdGVyVmFsdWVzLmhhc093blByb3BlcnR5KFwidmFsdWVzXCIpKSB7XG5cdFx0XHRmb3JtYXRPcHRpb25zID0geyBvcGVyYXRvcnM6IFtmaWx0ZXJWYWx1ZXMub3BlcmF0b3JdIH07XG5cdFx0XHRmaWx0ZXJWYWx1ZXMgPSBmaWx0ZXJWYWx1ZXMudmFsdWVzO1xuXHRcdH0gZWxzZSBpZiAoZmlsdGVyVmFsdWVzICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGZpbHRlclZhbHVlcyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZmlsdGVyVmFsdWVzICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZpbHRlclV0aWxzLmpzI19maWx0ZXJWYWx1ZXNUb0NvbmRpdGlvbnM6IFVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dCBwYXJhbWV0ZXIgdlZhbHVlczogJHt0eXBlb2YgZmlsdGVyVmFsdWVzfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbmRpdGlvbnNUeXBlOiBhbnkgPSBuZXcgQ29uZGl0aW9uc1R5cGUoZm9ybWF0T3B0aW9ucyk7XG5cdFx0Y29uc3QgY29uZGl0aW9uVmFsdWVzID0gQXJyYXkuaXNBcnJheShmaWx0ZXJWYWx1ZXMpID8gZmlsdGVyVmFsdWVzIDogW2ZpbHRlclZhbHVlc107XG5cblx0XHQvLyBTaG9ydGN1dCBmb3Igb3BlcmF0b3Igd2l0aG91dCB2YWx1ZXMgYW5kIHNlbWFudGljIGRhdGUgb3BlcmF0aW9uc1xuXHRcdGlmIChcblx0XHRcdHR5cGVvZiBvcGVyYXRvciA9PT0gXCJzdHJpbmdcIiAmJlxuXHRcdFx0KGNvbmRpdGlvblZhbHVlcy5sZW5ndGggPT09IDAgfHwgU2VtYW50aWNEYXRlT3BlcmF0b3JzLmdldFNlbWFudGljRGF0ZU9wZXJhdGlvbnMoKS5pbmNsdWRlcyhvcGVyYXRvcikpXG5cdFx0KSB7XG5cdFx0XHRjb25kaXRpb25zID0gW0NvbmRpdGlvbi5jcmVhdGVDb25kaXRpb24ob3BlcmF0b3IsIGNvbmRpdGlvblZhbHVlcywgbnVsbCwgbnVsbCwgQ29uZGl0aW9uVmFsaWRhdGVkLk5vdFZhbGlkYXRlZCldO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25kaXRpb25zID0gY29uZGl0aW9uVmFsdWVzXG5cdFx0XHRcdC5tYXAoKGNvbmRpdGlvblZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RyaW5nVmFsdWUgPSBjb25kaXRpb25WYWx1ZT8udG9TdHJpbmcoKSxcblx0XHRcdFx0XHRcdHBhcnNlZENvbmRpdGlvbnMgPSBjb25kaXRpb25zVHlwZS5wYXJzZVZhbHVlKHN0cmluZ1ZhbHVlLCBcImFueVwiKTtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VkQ29uZGl0aW9ucz8uWzBdO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmlsdGVyKChjb25kaXRpb25WYWx1ZSkgPT4gY29uZGl0aW9uVmFsdWUgIT09IHVuZGVmaW5lZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbmRpdGlvbnM7XG5cdH1cblxuXHQvKipcblx0ICogTWFwcyBhbiBhcnJheSBvZiBjb25kaXRpb25zIHRvIGEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgZmlsdGVyIHZhbHVlcy5cblx0ICpcblx0ICogQHBhcmFtIGNvbmRpdGlvbnMgQXJyYXkgb2YgZmlsdGVyIGNvbmRpdGlvbnNcblx0ICogQHBhcmFtIGZvcm1hdE9wdGlvbnMgRm9ybWF0IG9wdGlvbnMgdGhhdCBzcGVjaWZpZXMgYSBjb25kaXRpb24gdHlwZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcmV0dXJucyBDb25jYXRlbmF0ZWQgc3RyaW5nIG9mIGZpbHRlciB2YWx1ZXNcblx0ICovXG5cdHN0YXRpYyBfY29uZGl0aW9uc1RvRmlsdGVyTW9kZWxTdHJpbmcoY29uZGl0aW9uczogb2JqZWN0W10sIGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnNUeXBlKTogc3RyaW5nIHtcblx0XHRjb25zdCBjb25kaXRpb25zVHlwZSA9IG5ldyBDb25kaXRpb25zVHlwZShmb3JtYXRPcHRpb25zKTtcblxuXHRcdHJldHVybiBjb25kaXRpb25zXG5cdFx0XHQubWFwKChjb25kaXRpb24pID0+IHtcblx0XHRcdFx0cmV0dXJuIGNvbmRpdGlvbnNUeXBlLmZvcm1hdFZhbHVlKFtjb25kaXRpb25dLCBcImFueVwiKSB8fCBcIlwiO1xuXHRcdFx0fSlcblx0XHRcdC5maWx0ZXIoKHN0cmluZ1ZhbHVlKSA9PiB7XG5cdFx0XHRcdHJldHVybiBzdHJpbmdWYWx1ZSAhPT0gXCJcIjtcblx0XHRcdH0pXG5cdFx0XHQuam9pbihcIixcIik7XG5cdH1cblxuXHQvKipcblx0ICogTGlzdGVucyB0byBmaWx0ZXIgbW9kZWwgY2hhbmdlcyBhbmQgdXBkYXRlcyB3cmFwcGVyIHByb3BlcnR5IFwiY29uZGl0aW9uc1wiLlxuXHQgKlxuXHQgKiBAcGFyYW0gY2hhbmdlRXZlbnQgRXZlbnQgdHJpZ2dlcmVkIGJ5IGEgZmlsdGVyIG1vZGVsIGNoYW5nZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2hhbmRsZUZpbHRlck1vZGVsQ2hhbmdlKGNoYW5nZUV2ZW50OiBhbnkpOiB2b2lkIHtcblx0XHRjb25zdCBwcm9wZXJ0eVBhdGggPSB0aGlzLmdldE9iamVjdEJpbmRpbmcoXCJmaWx0ZXJWYWx1ZXNcIikuZ2V0UGF0aCgpLFxuXHRcdFx0dmFsdWVzID0gY2hhbmdlRXZlbnQuZ2V0U291cmNlKCkuZ2V0UHJvcGVydHkocHJvcGVydHlQYXRoKTtcblx0XHR0aGlzLnVwZGF0ZUNvbmRpdGlvbnNCeUZpbHRlclZhbHVlcyh2YWx1ZXMsIFwiXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExpc3RlbnMgdG8gXCJjb25kaXRpb25zXCIgY2hhbmdlcyBhbmQgdXBkYXRlcyB0aGUgZmlsdGVyIG1vZGVsLlxuXHQgKlxuXHQgKiBAcGFyYW0gY29uZGl0aW9ucyBFdmVudCB0cmlnZ2VyZWQgYnkgYSBcImNvbmRpdGlvbnNcIiBjaGFuZ2Vcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9oYW5kbGVDb25kaXRpb25zQ2hhbmdlKGNvbmRpdGlvbnM6IGFueSk6IHZvaWQge1xuXHRcdHRoaXMudXBkYXRlRmlsdGVyTW9kZWxCeUNvbmRpdGlvbnMoY29uZGl0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSBDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyIGNvbnRyb2wgYW5kIHJlZ2lzdGVyIG9ic2VydmVyLlxuXHQgKi9cblx0aW5pdCgpOiB2b2lkIHtcblx0XHRzdXBlci5pbml0KCk7XG5cdFx0dGhpcy5fY29uZGl0aW9uc09ic2VydmVyID0gbmV3IE1hbmFnZWRPYmplY3RPYnNlcnZlcih0aGlzLl9vYnNlcnZlQ2hhbmdlcy5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLl9jb25kaXRpb25zT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCB7XG5cdFx0XHRwcm9wZXJ0aWVzOiBbXCJjb25kaXRpb25zXCJdXG5cdFx0fSk7XG5cdFx0dGhpcy5fZmlsdGVyTW9kZWwgPSBuZXcgSlNPTk1vZGVsKCk7XG5cdFx0dGhpcy5fZmlsdGVyTW9kZWwuYXR0YWNoUHJvcGVydHlDaGFuZ2UodGhpcy5faGFuZGxlRmlsdGVyTW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHRcdHRoaXMuc2V0TW9kZWwodGhpcy5fZmlsdGVyTW9kZWwsIEN1c3RvbUZpbHRlckZpZWxkQ29udGVudFdyYXBwZXIuRklMVEVSX01PREVMX0FMSUFTKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPdmVycmlkZXMge0BsaW5rIHNhcC51aS5jb3JlLkNvbnRyb2wjY2xvbmUgQ29udHJvbC5jbG9uZX0gdG8gY2xvbmUgYWRkaXRpb25hbFxuXHQgKiBpbnRlcm5hbCBzdGF0ZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSBbc0lkU3VmZml4XSBBIHN1ZmZpeCB0byBiZSBhcHBlbmRlZCB0byB0aGUgY2xvbmVkIGNvbnRyb2wgaWRcblx0ICogQHBhcmFtIFthTG9jYWxJZHNdIEFuIGFycmF5IG9mIGxvY2FsIElEcyB3aXRoaW4gdGhlIGNsb25lZCBoaWVyYXJjaHkgKGludGVybmFsbHkgdXNlZClcblx0ICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseSBjcmVhdGVkIGNsb25lXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdGNsb25lKHNJZFN1ZmZpeDogc3RyaW5nIHwgdW5kZWZpbmVkLCBhTG9jYWxJZHM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkKTogdGhpcyB7XG5cdFx0Y29uc3QgY2xvbmUgPSBzdXBlci5jbG9uZShzSWRTdWZmaXgsIGFMb2NhbElkcyk7XG5cdFx0Ly8gRHVyaW5nIGNsb25pbmcsIHRoZSBvbGQgbW9kZWwgd2lsbCBiZSBjb3BpZWQgYW5kIG92ZXJ3cml0ZXMgYW55IG5ldyBtb2RlbCAoc2FtZSBhbGlhcykgdGhhdFxuXHRcdC8vIHlvdSBpbnRyb2R1Y2UgZHVyaW5nIGluaXQoKTsgaGVuY2UgeW91IG5lZWQgdG8gb3ZlcndyaXRlIGl0IGFnYWluIGJ5IHRoZSBuZXcgb25lIHRoYXQgeW91J3ZlXG5cdFx0Ly8gY3JlYXRlZCBkdXJpbmcgaW5pdCgpIChpLmUuIGNsb25lLl9maWx0ZXJNb2RlbCk7IHRoYXQgc3RhbmRhcmQgYmVoYXZpb3VyIG9mIHN1cGVyLmNsb25lKClcblx0XHQvLyBjYW4ndCBldmVuIGJlIHN1cHByZXNzZWQgaW4gYW4gb3duIGNvbnN0cnVjdG9yOyBmb3IgYSBkZXRhaWxlZCBpbnZlc3RpZ2F0aW9uIG9mIHRoZSBjbG9uaW5nLFxuXHRcdC8vIHBsZWFzZSBvdmVyd3JpdGUgdGhlIHNldE1vZGVsKCkgbWV0aG9kIGFuZCBjaGVjayB0aGUgbGlzdCBvZiBjYWxsZXJzIGFuZCBzdGVwcyBpbmR1Y2VkIGJ5IHRoZW0uXG5cdFx0Y2xvbmUuc2V0TW9kZWwoY2xvbmUuX2ZpbHRlck1vZGVsLCBDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyLkZJTFRFUl9NT0RFTF9BTElBUyk7XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9XG5cblx0LyoqXG5cdCAqIExpc3RlbnMgdG8gcHJvcGVydHkgY2hhbmdlcy5cblx0ICpcblx0ICogQHBhcmFtIGNoYW5nZXMgUHJvcGVydHkgY2hhbmdlc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X29ic2VydmVDaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xuXHRcdGlmIChjaGFuZ2VzLm5hbWUgPT09IFwiY29uZGl0aW9uc1wiKSB7XG5cdFx0XHR0aGlzLl9oYW5kbGVDb25kaXRpb25zQ2hhbmdlKGNoYW5nZXMuY3VycmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvbnRlbnQgb2YgdGhpcyB3cmFwcGVyIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSB3cmFwcGVyIGNvbnRlbnRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGdldENvbnRlbnQoKTogQ29udHJvbCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0QWdncmVnYXRpb24oXCJjb250ZW50XCIpIGFzIENvbnRyb2w7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgdmFsdWUgZm9yIGNvbnRyb2wgcHJvcGVydHkgJ2NvbmRpdGlvbnMnLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBmaWx0ZXIgY29uZGl0aW9uc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Z2V0Q29uZGl0aW9ucygpOiBvYmplY3RbXSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UHJvcGVydHkoXCJjb25kaXRpb25zXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHZhbHVlIGZvciBjb250cm9sIHByb3BlcnR5ICdjb25kaXRpb25zJy5cblx0ICpcblx0ICogQHBhcmFtIFtjb25kaXRpb25zXSBBcnJheSBvZiBmaWx0ZXIgY29uZGl0aW9uc1xuXHQgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhpcyB3cmFwcGVyXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRzZXRDb25kaXRpb25zKGNvbmRpdGlvbnM6IG9iamVjdFtdKTogdGhpcyB7XG5cdFx0dGhpcy5zZXRQcm9wZXJ0eShcImNvbmRpdGlvbnNcIiwgY29uZGl0aW9ucyB8fCBbXSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZmlsdGVyIG1vZGVsIGFsaWFzICdmaWx0ZXJWYWx1ZXMnLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBUaGUgZmlsdGVyIG1vZGVsXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRnZXRGaWx0ZXJNb2RlbEFsaWFzKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIEN1c3RvbUZpbHRlckZpZWxkQ29udGVudFdyYXBwZXIuRklMVEVSX01PREVMX0FMSUFTO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHByb3BlcnR5IFwiY29uZGl0aW9uc1wiIHdpdGggZmlsdGVyIHZhbHVlc1xuXHQgKiBzZW50IGJ5IEV4dGVuc2lvbkFQSSNzZXRGaWx0ZXJWYWx1ZXMoKS5cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlcyBUaGUgZmlsdGVyIHZhbHVlc1xuXHQgKiBAcGFyYW0gW29wZXJhdG9yXSBUaGUgb3BlcmF0b3IgbmFtZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0dXBkYXRlQ29uZGl0aW9uc0J5RmlsdGVyVmFsdWVzKHZhbHVlczogYW55LCBvcGVyYXRvcj86IHN0cmluZyk6IHZvaWQge1xuXHRcdGNvbnN0IGNvbmRpdGlvbnMgPSBDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyLl9maWx0ZXJWYWx1ZXNUb0NvbmRpdGlvbnModmFsdWVzLCBvcGVyYXRvcik7XG5cdFx0dGhpcy5zZXRDb25kaXRpb25zKGNvbmRpdGlvbnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgZmlsdGVyIG1vZGVsIHdpdGggY29uZGl0aW9uc1xuXHQgKiBzZW50IGJ5IHRoZSB7QGxpbmsgc2FwLnVpLm1kYy5GaWx0ZXJGaWVsZCBGaWx0ZXJGaWVsZH0uXG5cdCAqXG5cdCAqIEBwYXJhbSBjb25kaXRpb25zIEFycmF5IG9mIGZpbHRlciBjb25kaXRpb25zXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHR1cGRhdGVGaWx0ZXJNb2RlbEJ5Q29uZGl0aW9ucyhjb25kaXRpb25zOiBhbnlbXSk6IHZvaWQge1xuXHRcdGNvbnN0IG9wZXJhdG9yID0gY29uZGl0aW9uc1swXT8ub3BlcmF0b3IgfHwgXCJcIjtcblx0XHRjb25zdCBmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zVHlwZSA9IG9wZXJhdG9yICE9PSBcIlwiID8geyBvcGVyYXRvcnM6IFtvcGVyYXRvcl0gfSA6IHsgb3BlcmF0b3JzOiBbXSB9O1xuXHRcdGlmICh0aGlzLmdldEJpbmRpbmdDb250ZXh0KEN1c3RvbUZpbHRlckZpZWxkQ29udGVudFdyYXBwZXIuRklMVEVSX01PREVMX0FMSUFTKSkge1xuXHRcdFx0Y29uc3Qgc3RyaW5nVmFsdWUgPSBDdXN0b21GaWx0ZXJGaWVsZENvbnRlbnRXcmFwcGVyLl9jb25kaXRpb25zVG9GaWx0ZXJNb2RlbFN0cmluZyhjb25kaXRpb25zLCBmb3JtYXRPcHRpb25zKTtcblx0XHRcdHRoaXMuX2ZpbHRlck1vZGVsLnNldFByb3BlcnR5KFxuXHRcdFx0XHR0aGlzLmdldEJpbmRpbmdDb250ZXh0KEN1c3RvbUZpbHRlckZpZWxkQ29udGVudFdyYXBwZXIuRklMVEVSX01PREVMX0FMSUFTKT8uZ2V0UGF0aCgpLFxuXHRcdFx0XHRzdHJpbmdWYWx1ZVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRnZXRBY2Nlc3NpYmlsaXR5SW5mbygpOiBhbnkge1xuXHRcdGNvbnN0IGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKTtcblx0XHRyZXR1cm4gY29udGVudD8uZ2V0QWNjZXNzaWJpbGl0eUluZm8/LigpIHx8IHt9O1xuXHR9XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QnFCQSwrQjtFQVRyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO1NBQ0NDLGNBQWMsQ0FBQyxzREFBRCxDLFVBRWJDLGtCQUFrQixDQUFDLDBCQUFELEMsVUFJbEJDLFFBQVEsQ0FBQztJQUFFQyxJQUFJLEVBQUUscUJBQVI7SUFBK0JDLFlBQVksRUFBRTtFQUE3QyxDQUFELEMsVUFHUkYsUUFBUSxDQUFDO0lBQUVDLElBQUksRUFBRSxTQUFSO0lBQW1CQyxZQUFZLEVBQUU7RUFBakMsQ0FBRCxDLFVBR1JGLFFBQVEsQ0FBQztJQUFFQyxJQUFJLEVBQUUsVUFBUjtJQUFvQkMsWUFBWSxFQUFFO0VBQWxDLENBQUQsQyxVQUdSQyxXQUFXLENBQUM7SUFBRUYsSUFBSSxFQUFFLHFCQUFSO0lBQStCRyxRQUFRLEVBQUUsS0FBekM7SUFBZ0RDLFNBQVMsRUFBRTtFQUEzRCxDQUFELEMsVUFHWEMsS0FBSyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQ0FVQ0MsTSxHQUFQLGdCQUFjQyxhQUFkLEVBQTRDQyxPQUE1QyxFQUE0RjtNQUMzRkQsYUFBYSxDQUFDRSxTQUFkLENBQXdCLEtB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