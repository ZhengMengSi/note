/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/macros/internal/valuehelp/ValueListHelperNew", "sap/m/inputUtils/highlightDOMElements", "sap/ui/mdc/condition/Condition", "sap/ui/mdc/enum/ConditionValidated", "sap/ui/mdc/odata/v4/ValueHelpDelegate", "sap/ui/mdc/p13n/StateUtil"], function (Log, CommonUtils, ValueListHelperNew, highlightDOMElements, Condition, ConditionValidated, ValueHelpDelegate, StateUtil) {
  "use strict";

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var FeCoreControlsFilterBar = "sap.fe.core.controls.FilterBar";
  var MdcFilterbarFilterBarBase = "sap.ui.mdc.filterbar.FilterBarBase";
  var oAfterRenderDelegate = {
    onAfterRendering: function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var oTable = args[0].srcControl;
      var aTableCellsDomRef = oTable.$().find("tbody .sapMText");
      highlightDOMElements(aTableCellsDomRef, oTable.getParent().getFilterValue(), true);
    }
  };
  return Object.assign({}, ValueHelpDelegate, {
    /**
     * Requests the content of the value help.
     *
     * This function is called when the value help is opened or a key or description is requested.
     *
     * So, depending on the value help content used, all content controls and data need to be assigned.
     * Once they are assigned and the data is set, the returned <code>Promise</code> needs to be resolved.
     * Only then does the value help continue opening or reading data.
     *
     * @param payload Payload for delegate
     * @param container Container instance
     * @param contentId Id of the content shown after this call to retrieveContent
     * @returns Promise that is resolved if all content is available
     */
    retrieveContent: function (payload, container, contentId) {
      return ValueListHelperNew.showValueList(payload, container, contentId);
    },

    /**
     * Callback invoked everytime a {@link sap.ui.mdc.ValueHelp ValueHelp} fires a select event or the vlaue of the corresponding field changes
     * This callback may be used to update external fields.
     *
     * @param payload Payload for delegate
     * @param valueHelp ValueHelp control instance receiving the <code>controlChange</code>
     * @param reason Reason why the method was invoked
     * @param config Current configuration provided by the calling control
     * @since 1.101.0
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onConditionPropagation: function (payload, valueHelp, reason, config) {
      if (reason !== "ControlChange") {
        /* handle only ControlChange reason */
        return;
      }

      var qualifier = payload.qualifiers[payload.valueHelpQualifier];
      var outParameters = qualifier.vhParameters && ValueListHelperNew.getOutParameters(qualifier.vhParameters) || [],
          field = valueHelp.getControl(),
          filterBar = field.getParent(),
          filterBarVH = valueHelp.getParent();
      var filterItemsVH = filterBarVH.isA(FeCoreControlsFilterBar) && filterBarVH.getFilterItems();
      var aconditions = field.getConditions();
      aconditions = aconditions.filter(function (condition) {
        var conditionPayloadMap = condition.payload && condition.payload || {};
        return conditionPayloadMap[payload.valueHelpQualifier];
      });

      if (filterBar.isA(MdcFilterbarFilterBarBase)) {
        StateUtil.retrieveExternalState(filterBar).then(function (state) {
          aconditions.forEach(function (condition) {
            var conditionPayloadMap = condition.payload,
                aKeys = conditionPayloadMap && Object.keys(conditionPayloadMap),
                aConditionPayload = outParameters.length && !!aKeys ? conditionPayloadMap[aKeys[0]] : [];

            if (!aConditionPayload) {
              return;
            }

            var _iterator = _createForOfIteratorHelper(outParameters),
                _step;

            try {
              var _loop = function () {
                var outParameter = _step.value;
                var filterTarget = outParameter.source.split("/").pop() || "";
                /* Propagate Out-Parameter only if filter field visible in the LR-Filterbar */

                if (
                /* LR FilterBar or /* LR AdaptFilter */
                filterItemsVH && filterItemsVH.find(function (item) {
                  return item.getId().split("::").pop() === filterTarget;
                })) {
                  aConditionPayload.forEach(function (conditionPayload) {
                    var newCondition = Condition.createCondition("EQ", [conditionPayload[outParameter.helpPath]], null, null, ConditionValidated.Validated);
                    state.filter[filterTarget] = state.filter && state.filter[filterTarget] || [];
                    state.filter[filterTarget].push(newCondition);
                  });
                }
                /* LR SettingsDialog or OP SettingsDialog shall not propagate value to the dialog-filterfields */

                /* OP Settings Dialog shall not propagate value to context */

              };

              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                _loop();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          });
          StateUtil.applyExternalState(filterBar, state);
        }).catch(function (err) {
          Log.error("ValueHelpDelegate: ".concat(err.message));
        });
      } else {
        aconditions.forEach(function (condition) {
          var conditionPayloadMap = condition.payload,
              aKeys = conditionPayloadMap && Object.keys(conditionPayloadMap),
              aConditionPayload = outParameters.length && !!aKeys ? conditionPayloadMap[aKeys[0]] : [];

          if (!aConditionPayload) {
            return;
          }

          var context = valueHelp.getBindingContext();

          if (context) {
            outParameters.forEach(function (outParameter) {
              var target = outParameter.source;

              if ((aConditionPayload === null || aConditionPayload === void 0 ? void 0 : aConditionPayload.length) === 1) {
                var outValues = aConditionPayload[0];
                context.setProperty(target, outValues[outParameter.helpPath]);
              } else if (aConditionPayload !== null && aConditionPayload !== void 0 && aConditionPayload.length && (aConditionPayload === null || aConditionPayload === void 0 ? void 0 : aConditionPayload.length) > 1) {
                Log.warning("ValueHelpDelegate: ParamterOut in multi-value-field not supported");
              }
            });
          }
        });
      }
    },
    _createInitialFilterCondition: function (value, initialValueFilterEmpty) {
      var condition;

      if (value === undefined || value === null) {
        Log.error("ValueHelpDelegate: value of the property could not be requested");
      } else if (value === "") {
        if (initialValueFilterEmpty) {
          condition = Condition.createCondition("Empty", [], null, null, ConditionValidated.Validated);
        }
      } else {
        condition = Condition.createCondition("EQ", [value], null, null, ConditionValidated.Validated);
      }

      return condition;
    },
    _getInitialFilterConditionsFromBinding: function (inConditions, control, inParameters) {
      try {
        var _this2 = this;

        var propertiesToRequest = inParameters.map(function (inParameter) {
          return inParameter.source;
        });
        var bindingContext = control.getBindingContext();

        if (!bindingContext) {
          Log.error("ValueHelpDelegate: No BindingContext");
          return Promise.resolve(inConditions);
        } // According to odata v4 api documentation for requestProperty: Property values that are not cached yet are requested from the back end


        return Promise.resolve(bindingContext.requestProperty(propertiesToRequest)).then(function (values) {
          for (var i = 0; i < inParameters.length; i++) {
            var inParameter = inParameters[i];

            var condition = _this2._createInitialFilterCondition(values[i], inParameter.initialValueFilterEmpty);

            if (condition) {
              inConditions[inParameter.helpPath] = [condition];
            }
          }

          return inConditions;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _getInitialFilterConditionsFromFilterBar: function (inConditions, control, inParameters) {
      try {
        var filterBar = control.getParent();
        return Promise.resolve(StateUtil.retrieveExternalState(filterBar)).then(function (state) {
          var _iterator2 = _createForOfIteratorHelper(inParameters),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var inParameter = _step2.value;
              var sourceField = inParameter.source.split("/").pop();
              var conditions = state.filter[sourceField];

              if (conditions) {
                inConditions[inParameter.helpPath] = conditions;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return inConditions;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _partitionInParameters: function (inParameters) {
      var inParameterMap = {
        constant: [],
        binding: [],
        filter: []
      };

      var _iterator3 = _createForOfIteratorHelper(inParameters),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var inParameter = _step3.value;

          if (inParameter.constantValue !== undefined) {
            inParameterMap.constant.push(inParameter);
          } else if (inParameter.source.indexOf("$filter") === 0) {
            inParameterMap.filter.push(inParameter);
          } else {
            inParameterMap.binding.push(inParameter);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return inParameterMap;
    },

    /**
     * Provides an initial condition configuration everytime a value help content is shown.
     *
     * @param payload Payload for delegate
     * @param content ValueHelp content requesting conditions configuration
     * @param control Instance of the calling control
     * @returns Returns a map of conditions suitable for a sap.ui.mdc.FilterBar control
     * @since 1.101.0
     */
    getInitialFilterConditions: function (payload, content, control) {
      try {
        var _this4 = this;

        function _temp4() {
          var _temp = function () {
            if (inParameterMap.filter.length) {
              return Promise.resolve(_this4._getInitialFilterConditionsFromFilterBar(inConditions, control, inParameterMap.filter)).then(function () {});
            }
          }();

          return _temp && _temp.then ? _temp.then(function () {
            return inConditions;
          }) : inConditions;
        }

        // highlight text in ValueHelp popover
        if (content !== null && content !== void 0 && content.isA("sap.ui.mdc.valuehelp.content.MTable")) {
          var oPopoverTable = content.getTable();
          oPopoverTable === null || oPopoverTable === void 0 ? void 0 : oPopoverTable.removeEventDelegate(oAfterRenderDelegate);
          oPopoverTable === null || oPopoverTable === void 0 ? void 0 : oPopoverTable.addEventDelegate(oAfterRenderDelegate, _this4);
        }

        var inConditions = {};

        if (!control) {
          Log.error("ValueHelpDelegate: Control undefined");
          return Promise.resolve(inConditions);
        }

        var qualifier = payload.qualifiers[payload.valueHelpQualifier];
        var inParameters = qualifier.vhParameters && ValueListHelperNew.getInParameters(qualifier.vhParameters) || [];

        var inParameterMap = _this4._partitionInParameters(inParameters);

        var isObjectPage = control.getBindingContext();

        var _iterator4 = _createForOfIteratorHelper(inParameterMap.constant),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var inParameter = _step4.value;

            var condition = _this4._createInitialFilterCondition(inParameter.constantValue, isObjectPage ? inParameter.initialValueFilterEmpty : false // no filter with "empty" on ListReport
            );

            if (condition) {
              inConditions[inParameter.helpPath] = [condition];
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        var _temp5 = function () {
          if (inParameterMap.binding.length) {
            return Promise.resolve(_this4._getInitialFilterConditionsFromBinding(inConditions, control, inParameterMap.binding)).then(function () {});
          }
        }();

        return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5));
      } catch (e) {
        return Promise.reject(e);
      }
    },

    /**
     * Provides the possibility to convey custom data in conditions.
     * This enables an application to enhance conditions with data relevant for combined key or outparameter scenarios.
     *
     * @param payload Payload for delegate
     * @param content ValueHelp content instance
     * @param values Description pair for the condition which is to be created
     * @param context Optional additional context
     * @returns Optionally returns a serializeable object to be stored in the condition payload field
     * @since 1.101.0
     */
    createConditionPayload: function (payload, content, values, context) {
      var qualifier = payload.qualifiers[payload.valueHelpQualifier],
          entry = {},
          conditionPayload = {};
      var control = content.getControl();
      var isMultiValueField = control === null || control === void 0 ? void 0 : control.isA("sap.ui.mdc.MultiValueField");

      if (!qualifier.vhKeys || qualifier.vhKeys.length === 1 || isMultiValueField) {
        return;
      }

      qualifier.vhKeys.forEach(function (vhKey) {
        var value = context.getObject(vhKey);

        if (value != null) {
          entry[vhKey] = (value === null || value === void 0 ? void 0 : value.length) === 0 ? "" : value;
        }
      });

      if (Object.keys(entry).length) {
        /* vh qualifier as key for relevant condition */
        conditionPayload[payload.valueHelpQualifier] = [entry];
      }

      return conditionPayload;
    },

    /**
     * Changes the search string.
     *
     * If <code>$search</code> is used, depending on which back-end service is used, the search string might need to be escaped.
     *
     * @param payload Payload for delegate
     * @param typeahead `true` if the search is called for a type-ahead
     * @param search Search string
     * @returns Search string to use
     */
    adjustSearch: function (payload, typeahead, search) {
      return CommonUtils.normalizeSearchTerm(search);
    },

    /**
     * Provides the possibility to customize selections in 'Select from list' scenarios.
     * By default, only condition keys are considered. This may be extended with payload dependent filters.
     *
     * @param payload Payload for delegate
     * @param content ValueHelp content instance
     * @param item Entry of a given list
     * @param conditions Current conditions
     * @returns True, if item is selected
     * @since 1.101.0
     */
    isFilterableListItemSelected: function (payload, content, item, conditions) {
      var context = item.getBindingContext();
      var selectedCondition = conditions.find(function (condition) {
        var _conditionPayloadMap$;

        var conditionPayloadMap = condition.payload,
            valueHelpQualifier = payload.valueHelpQualifier || "";

        if (!conditionPayloadMap && Object.keys(payload.qualifiers)[0] === valueHelpQualifier) {
          var keyPath = content.getKeyPath();
          return (context === null || context === void 0 ? void 0 : context.getObject(keyPath)) === (condition === null || condition === void 0 ? void 0 : condition.values[0]);
        }

        var conditionSelectedRow = (conditionPayloadMap === null || conditionPayloadMap === void 0 ? void 0 : (_conditionPayloadMap$ = conditionPayloadMap[valueHelpQualifier]) === null || _conditionPayloadMap$ === void 0 ? void 0 : _conditionPayloadMap$[0]) || {},
            selectedKeys = Object.keys(conditionSelectedRow);

        if (selectedKeys.length) {
          return selectedKeys.every(function (key) {
            return conditionSelectedRow[key] === (context === null || context === void 0 ? void 0 : context.getObject(key));
          });
        }

        return false;
      });
      return selectedCondition ? true : false;
    }
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGZUNvcmVDb250cm9sc0ZpbHRlckJhciIsIk1kY0ZpbHRlcmJhckZpbHRlckJhckJhc2UiLCJvQWZ0ZXJSZW5kZXJEZWxlZ2F0ZSIsIm9uQWZ0ZXJSZW5kZXJpbmciLCJhcmdzIiwib1RhYmxlIiwic3JjQ29udHJvbCIsImFUYWJsZUNlbGxzRG9tUmVmIiwiJCIsImZpbmQiLCJoaWdobGlnaHRET01FbGVtZW50cyIsImdldFBhcmVudCIsImdldEZpbHRlclZhbHVlIiwiT2JqZWN0IiwiYXNzaWduIiwiVmFsdWVIZWxwRGVsZWdhdGUiLCJyZXRyaWV2ZUNvbnRlbnQiLCJwYXlsb2FkIiwiY29udGFpbmVyIiwiY29udGVudElkIiwiVmFsdWVMaXN0SGVscGVyTmV3Iiwic2hvd1ZhbHVlTGlzdCIsIm9uQ29uZGl0aW9uUHJvcGFnYXRpb24iLCJ2YWx1ZUhlbHAiLCJyZWFzb24iLCJjb25maWciLCJxdWFsaWZpZXIiLCJxdWFsaWZpZXJzIiwidmFsdWVIZWxwUXVhbGlmaWVyIiwib3V0UGFyYW1ldGVycyIsInZoUGFyYW1ldGVycyIsImdldE91dFBhcmFtZXRlcnMiLCJmaWVsZCIsImdldENvbnRyb2wiLCJmaWx0ZXJCYXIiLCJmaWx0ZXJCYXJWSCIsImZpbHRlckl0ZW1zVkgiLCJpc0EiLCJnZXRGaWx0ZXJJdGVtcyIsImFjb25kaXRpb25zIiwiZ2V0Q29uZGl0aW9ucyIsImZpbHRlciIsImNvbmRpdGlvbiIsImNvbmRpdGlvblBheWxvYWRNYXAiLCJTdGF0ZVV0aWwiLCJyZXRyaWV2ZUV4dGVybmFsU3RhdGUiLCJ0aGVuIiwic3RhdGUiLCJmb3JFYWNoIiwiYUtleXMiLCJrZXlzIiwiYUNvbmRpdGlvblBheWxvYWQiLCJsZW5ndGgiLCJvdXRQYXJhbWV0ZXIiLCJmaWx0ZXJUYXJnZXQiLCJzb3VyY2UiLCJzcGxpdCIsInBvcCIsIml0ZW0iLCJnZXRJZCIsImNvbmRpdGlvblBheWxvYWQiLCJuZXdDb25kaXRpb24iLCJDb25kaXRpb24iLCJjcmVhdGVDb25kaXRpb24iLCJoZWxwUGF0aCIsIkNvbmRpdGlvblZhbGlkYXRlZCIsIlZhbGlkYXRlZCIsInB1c2giLCJhcHBseUV4dGVybmFsU3RhdGUiLCJjYXRjaCIsImVyciIsIkxvZyIsImVycm9yIiwibWVzc2FnZSIsImNvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsInRhcmdldCIsIm91dFZhbHVlcyIsInNldFByb3BlcnR5Iiwid2FybmluZyIsIl9jcmVhdGVJbml0aWFsRmlsdGVyQ29uZGl0aW9uIiwidmFsdWUiLCJpbml0aWFsVmFsdWVGaWx0ZXJFbXB0eSIsInVuZGVmaW5lZCIsIl9nZXRJbml0aWFsRmlsdGVyQ29uZGl0aW9uc0Zyb21CaW5kaW5nIiwiaW5Db25kaXRpb25zIiwiY29udHJvbCIsImluUGFyYW1ldGVycyIsInByb3BlcnRpZXNUb1JlcXVlc3QiLCJtYXAiLCJpblBhcmFtZXRlciIsImJpbmRpbmdDb250ZXh0IiwicmVxdWVzdFByb3BlcnR5IiwidmFsdWVzIiwiaSIsIl9nZXRJbml0aWFsRmlsdGVyQ29uZGl0aW9uc0Zyb21GaWx0ZXJCYXIiLCJzb3VyY2VGaWVsZCIsImNvbmRpdGlvbnMiLCJfcGFydGl0aW9uSW5QYXJhbWV0ZXJzIiwiaW5QYXJhbWV0ZXJNYXAiLCJjb25zdGFudCIsImJpbmRpbmciLCJjb25zdGFudFZhbHVlIiwiaW5kZXhPZiIsImdldEluaXRpYWxGaWx0ZXJDb25kaXRpb25zIiwiY29udGVudCIsIm9Qb3BvdmVyVGFibGUiLCJnZXRUYWJsZSIsInJlbW92ZUV2ZW50RGVsZWdhdGUiLCJhZGRFdmVudERlbGVnYXRlIiwiZ2V0SW5QYXJhbWV0ZXJzIiwiaXNPYmplY3RQYWdlIiwiY3JlYXRlQ29uZGl0aW9uUGF5bG9hZCIsImVudHJ5IiwiaXNNdWx0aVZhbHVlRmllbGQiLCJ2aEtleXMiLCJ2aEtleSIsImdldE9iamVjdCIsImFkanVzdFNlYXJjaCIsInR5cGVhaGVhZCIsInNlYXJjaCIsIkNvbW1vblV0aWxzIiwibm9ybWFsaXplU2VhcmNoVGVybSIsImlzRmlsdGVyYWJsZUxpc3RJdGVtU2VsZWN0ZWQiLCJzZWxlY3RlZENvbmRpdGlvbiIsImtleVBhdGgiLCJnZXRLZXlQYXRoIiwiY29uZGl0aW9uU2VsZWN0ZWRSb3ciLCJzZWxlY3RlZEtleXMiLCJldmVyeSIsImtleSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVmFsdWVIZWxwRGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IEludGVybmFsTW9kZWxDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgSW5PdXRQYXJhbWV0ZXIsIFZhbHVlSGVscFBheWxvYWQgfSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9pbnRlcm5hbC92YWx1ZWhlbHAvVmFsdWVMaXN0SGVscGVyTmV3XCI7XG5pbXBvcnQgVmFsdWVMaXN0SGVscGVyTmV3IGZyb20gXCJzYXAvZmUvbWFjcm9zL2ludGVybmFsL3ZhbHVlaGVscC9WYWx1ZUxpc3RIZWxwZXJOZXdcIjtcbmltcG9ydCBoaWdobGlnaHRET01FbGVtZW50cyBmcm9tIFwic2FwL20vaW5wdXRVdGlscy9oaWdobGlnaHRET01FbGVtZW50c1wiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IHR5cGUgeyBDb25kaXRpb25PYmplY3QgfSBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vQ29uZGl0aW9uXCI7XG5pbXBvcnQgQ29uZGl0aW9uIGZyb20gXCJzYXAvdWkvbWRjL2NvbmRpdGlvbi9Db25kaXRpb25cIjtcbmltcG9ydCBDb25kaXRpb25WYWxpZGF0ZWQgZnJvbSBcInNhcC91aS9tZGMvZW51bS9Db25kaXRpb25WYWxpZGF0ZWRcIjtcbmltcG9ydCB0eXBlIEZpZWxkQmFzZSBmcm9tIFwic2FwL3VpL21kYy9maWVsZC9GaWVsZEJhc2VcIjtcbmltcG9ydCB0eXBlIEZpbHRlckJhckJhc2UgZnJvbSBcInNhcC91aS9tZGMvZmlsdGVyYmFyL0ZpbHRlckJhckJhc2VcIjtcbmltcG9ydCBWYWx1ZUhlbHBEZWxlZ2F0ZSBmcm9tIFwic2FwL3VpL21kYy9vZGF0YS92NC9WYWx1ZUhlbHBEZWxlZ2F0ZVwiO1xuaW1wb3J0IFN0YXRlVXRpbCBmcm9tIFwic2FwL3VpL21kYy9wMTNuL1N0YXRlVXRpbFwiO1xuaW1wb3J0IHR5cGUgVmFsdWVIZWxwIGZyb20gXCJzYXAvdWkvbWRjL1ZhbHVlSGVscFwiO1xuaW1wb3J0IHR5cGUgQ29udGFpbmVyIGZyb20gXCJzYXAvdWkvbWRjL3ZhbHVlaGVscC9iYXNlL0NvbnRhaW5lclwiO1xuaW1wb3J0IHR5cGUgQ29udGVudCBmcm9tIFwic2FwL3VpL21kYy92YWx1ZWhlbHAvYmFzZS9Db250ZW50XCI7XG5pbXBvcnQgdHlwZSBNVGFibGUgZnJvbSBcInNhcC91aS9tZGMvdmFsdWVoZWxwL2NvbnRlbnQvTVRhYmxlXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuXG5jb25zdCBGZUNvcmVDb250cm9sc0ZpbHRlckJhciA9IFwic2FwLmZlLmNvcmUuY29udHJvbHMuRmlsdGVyQmFyXCI7XG5jb25zdCBNZGNGaWx0ZXJiYXJGaWx0ZXJCYXJCYXNlID0gXCJzYXAudWkubWRjLmZpbHRlcmJhci5GaWx0ZXJCYXJCYXNlXCI7XG5jb25zdCBvQWZ0ZXJSZW5kZXJEZWxlZ2F0ZSA9IHtcblx0b25BZnRlclJlbmRlcmluZzogZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0Y29uc3Qgb1RhYmxlID0gYXJnc1swXS5zcmNDb250cm9sO1xuXHRcdGNvbnN0IGFUYWJsZUNlbGxzRG9tUmVmID0gb1RhYmxlLiQoKS5maW5kKFwidGJvZHkgLnNhcE1UZXh0XCIpO1xuXHRcdGhpZ2hsaWdodERPTUVsZW1lbnRzKGFUYWJsZUNlbGxzRG9tUmVmLCBvVGFibGUuZ2V0UGFyZW50KCkuZ2V0RmlsdGVyVmFsdWUoKSwgdHJ1ZSk7XG5cdH1cbn07XG5cbnR5cGUgQ29uZGl0aW9uT2JqZWN0TWFwID0gUmVjb3JkPHN0cmluZywgQ29uZGl0aW9uT2JqZWN0W10+O1xuXG50eXBlIEV4dGVybmFsU3RhdGVUeXBlID0ge1xuXHRpdGVtczogeyBuYW1lOiBzdHJpbmcgfVtdO1xuXHRmaWx0ZXI6IENvbmRpdGlvbk9iamVjdE1hcDtcbn07XG5cbnR5cGUgQ29uZGl0aW9uUGF5bG9hZFR5cGUgPSB7IFtuYW1lIGluIHN0cmluZ106IHN0cmluZyB9O1xuXG50eXBlIENvbmRpdGlvblBheWxvYWRNYXAgPSB7IFtwYXRoIGluIHN0cmluZ106IENvbmRpdGlvblBheWxvYWRUeXBlW10gfTtcblxuZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmFzc2lnbih7fSwgVmFsdWVIZWxwRGVsZWdhdGUsIHtcblx0LyoqXG5cdCAqIFJlcXVlc3RzIHRoZSBjb250ZW50IG9mIHRoZSB2YWx1ZSBoZWxwLlxuXHQgKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSB2YWx1ZSBoZWxwIGlzIG9wZW5lZCBvciBhIGtleSBvciBkZXNjcmlwdGlvbiBpcyByZXF1ZXN0ZWQuXG5cdCAqXG5cdCAqIFNvLCBkZXBlbmRpbmcgb24gdGhlIHZhbHVlIGhlbHAgY29udGVudCB1c2VkLCBhbGwgY29udGVudCBjb250cm9scyBhbmQgZGF0YSBuZWVkIHRvIGJlIGFzc2lnbmVkLlxuXHQgKiBPbmNlIHRoZXkgYXJlIGFzc2lnbmVkIGFuZCB0aGUgZGF0YSBpcyBzZXQsIHRoZSByZXR1cm5lZCA8Y29kZT5Qcm9taXNlPC9jb2RlPiBuZWVkcyB0byBiZSByZXNvbHZlZC5cblx0ICogT25seSB0aGVuIGRvZXMgdGhlIHZhbHVlIGhlbHAgY29udGludWUgb3BlbmluZyBvciByZWFkaW5nIGRhdGEuXG5cdCAqXG5cdCAqIEBwYXJhbSBwYXlsb2FkIFBheWxvYWQgZm9yIGRlbGVnYXRlXG5cdCAqIEBwYXJhbSBjb250YWluZXIgQ29udGFpbmVyIGluc3RhbmNlXG5cdCAqIEBwYXJhbSBjb250ZW50SWQgSWQgb2YgdGhlIGNvbnRlbnQgc2hvd24gYWZ0ZXIgdGhpcyBjYWxsIHRvIHJldHJpZXZlQ29udGVudFxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgaWYgYWxsIGNvbnRlbnQgaXMgYXZhaWxhYmxlXG5cdCAqL1xuXHRyZXRyaWV2ZUNvbnRlbnQ6IGZ1bmN0aW9uIChwYXlsb2FkOiBWYWx1ZUhlbHBQYXlsb2FkLCBjb250YWluZXI6IENvbnRhaW5lciwgY29udGVudElkOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gVmFsdWVMaXN0SGVscGVyTmV3LnNob3dWYWx1ZUxpc3QocGF5bG9hZCwgY29udGFpbmVyLCBjb250ZW50SWQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDYWxsYmFjayBpbnZva2VkIGV2ZXJ5dGltZSBhIHtAbGluayBzYXAudWkubWRjLlZhbHVlSGVscCBWYWx1ZUhlbHB9IGZpcmVzIGEgc2VsZWN0IGV2ZW50IG9yIHRoZSB2bGF1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBmaWVsZCBjaGFuZ2VzXG5cdCAqIFRoaXMgY2FsbGJhY2sgbWF5IGJlIHVzZWQgdG8gdXBkYXRlIGV4dGVybmFsIGZpZWxkcy5cblx0ICpcblx0ICogQHBhcmFtIHBheWxvYWQgUGF5bG9hZCBmb3IgZGVsZWdhdGVcblx0ICogQHBhcmFtIHZhbHVlSGVscCBWYWx1ZUhlbHAgY29udHJvbCBpbnN0YW5jZSByZWNlaXZpbmcgdGhlIDxjb2RlPmNvbnRyb2xDaGFuZ2U8L2NvZGU+XG5cdCAqIEBwYXJhbSByZWFzb24gUmVhc29uIHdoeSB0aGUgbWV0aG9kIHdhcyBpbnZva2VkXG5cdCAqIEBwYXJhbSBjb25maWcgQ3VycmVudCBjb25maWd1cmF0aW9uIHByb3ZpZGVkIGJ5IHRoZSBjYWxsaW5nIGNvbnRyb2xcblx0ICogQHNpbmNlIDEuMTAxLjBcblx0ICovXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0b25Db25kaXRpb25Qcm9wYWdhdGlvbjogZnVuY3Rpb24gKHBheWxvYWQ6IFZhbHVlSGVscFBheWxvYWQsIHZhbHVlSGVscDogVmFsdWVIZWxwLCByZWFzb246IHN0cmluZywgY29uZmlnOiBhbnkpIHtcblx0XHRpZiAocmVhc29uICE9PSBcIkNvbnRyb2xDaGFuZ2VcIikge1xuXHRcdFx0LyogaGFuZGxlIG9ubHkgQ29udHJvbENoYW5nZSByZWFzb24gKi9cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgcXVhbGlmaWVyID0gcGF5bG9hZC5xdWFsaWZpZXJzW3BheWxvYWQudmFsdWVIZWxwUXVhbGlmaWVyXTtcblx0XHRjb25zdCBvdXRQYXJhbWV0ZXJzID0gKHF1YWxpZmllci52aFBhcmFtZXRlcnMgJiYgVmFsdWVMaXN0SGVscGVyTmV3LmdldE91dFBhcmFtZXRlcnMocXVhbGlmaWVyLnZoUGFyYW1ldGVycykpIHx8IFtdLFxuXHRcdFx0ZmllbGQgPSB2YWx1ZUhlbHAuZ2V0Q29udHJvbCgpIGFzIEZpZWxkQmFzZSxcblx0XHRcdGZpbHRlckJhciA9IGZpZWxkLmdldFBhcmVudCgpIGFzIEZpbHRlckJhckJhc2UsXG5cdFx0XHRmaWx0ZXJCYXJWSCA9IHZhbHVlSGVscC5nZXRQYXJlbnQoKSBhcyBGaWx0ZXJCYXJCYXNlO1xuXHRcdGNvbnN0IGZpbHRlckl0ZW1zVkggPSAoZmlsdGVyQmFyVkguaXNBKEZlQ29yZUNvbnRyb2xzRmlsdGVyQmFyKSBhcyBCb29sZWFuKSAmJiBmaWx0ZXJCYXJWSC5nZXRGaWx0ZXJJdGVtcygpO1xuXHRcdGxldCBhY29uZGl0aW9ucyA9IGZpZWxkLmdldENvbmRpdGlvbnMoKSBhcyBDb25kaXRpb25PYmplY3RbXTtcblx0XHRhY29uZGl0aW9ucyA9IGFjb25kaXRpb25zLmZpbHRlcihmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG5cdFx0XHRjb25zdCBjb25kaXRpb25QYXlsb2FkTWFwID0gKGNvbmRpdGlvbi5wYXlsb2FkICYmIChjb25kaXRpb24ucGF5bG9hZCBhcyBDb25kaXRpb25QYXlsb2FkTWFwKSkgfHwge307XG5cdFx0XHRyZXR1cm4gY29uZGl0aW9uUGF5bG9hZE1hcFtwYXlsb2FkLnZhbHVlSGVscFF1YWxpZmllcl07XG5cdFx0fSk7XG5cblx0XHRpZiAoZmlsdGVyQmFyLmlzQShNZGNGaWx0ZXJiYXJGaWx0ZXJCYXJCYXNlKSkge1xuXHRcdFx0U3RhdGVVdGlsLnJldHJpZXZlRXh0ZXJuYWxTdGF0ZShmaWx0ZXJCYXIpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChzdGF0ZTogRXh0ZXJuYWxTdGF0ZVR5cGUpIHtcblx0XHRcdFx0XHRhY29uZGl0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChjb25kaXRpb24pIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNvbmRpdGlvblBheWxvYWRNYXAgPSBjb25kaXRpb24ucGF5bG9hZCBhcyBDb25kaXRpb25QYXlsb2FkTWFwLFxuXHRcdFx0XHRcdFx0XHRhS2V5cyA9IGNvbmRpdGlvblBheWxvYWRNYXAgJiYgT2JqZWN0LmtleXMoY29uZGl0aW9uUGF5bG9hZE1hcCksXG5cdFx0XHRcdFx0XHRcdGFDb25kaXRpb25QYXlsb2FkID0gb3V0UGFyYW1ldGVycy5sZW5ndGggJiYgISFhS2V5cyA/IGNvbmRpdGlvblBheWxvYWRNYXBbYUtleXNbMF1dIDogW107XG5cdFx0XHRcdFx0XHRpZiAoIWFDb25kaXRpb25QYXlsb2FkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZvciAoY29uc3Qgb3V0UGFyYW1ldGVyIG9mIG91dFBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVGFyZ2V0ID0gb3V0UGFyYW1ldGVyLnNvdXJjZS5zcGxpdChcIi9cIikucG9wKCkgfHwgXCJcIjtcblx0XHRcdFx0XHRcdFx0LyogUHJvcGFnYXRlIE91dC1QYXJhbWV0ZXIgb25seSBpZiBmaWx0ZXIgZmllbGQgdmlzaWJsZSBpbiB0aGUgTFItRmlsdGVyYmFyICovXG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHQvKiBMUiBGaWx0ZXJCYXIgb3IgLyogTFIgQWRhcHRGaWx0ZXIgKi9cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJJdGVtc1ZIICYmXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVySXRlbXNWSC5maW5kKChpdGVtKSA9PiBpdGVtLmdldElkKCkuc3BsaXQoXCI6OlwiKS5wb3AoKSA9PT0gZmlsdGVyVGFyZ2V0KVxuXHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRhQ29uZGl0aW9uUGF5bG9hZC5mb3JFYWNoKGZ1bmN0aW9uIChjb25kaXRpb25QYXlsb2FkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBuZXdDb25kaXRpb24gPSBDb25kaXRpb24uY3JlYXRlQ29uZGl0aW9uKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcIkVRXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFtjb25kaXRpb25QYXlsb2FkW291dFBhcmFtZXRlci5oZWxwUGF0aF1dLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhdGUuZmlsdGVyW2ZpbHRlclRhcmdldF0gPSAoc3RhdGUuZmlsdGVyICYmIHN0YXRlLmZpbHRlcltmaWx0ZXJUYXJnZXRdKSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlLmZpbHRlcltmaWx0ZXJUYXJnZXRdLnB1c2gobmV3Q29uZGl0aW9uKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvKiBMUiBTZXR0aW5nc0RpYWxvZyBvciBPUCBTZXR0aW5nc0RpYWxvZyBzaGFsbCBub3QgcHJvcGFnYXRlIHZhbHVlIHRvIHRoZSBkaWFsb2ctZmlsdGVyZmllbGRzICovXG5cdFx0XHRcdFx0XHRcdC8qIE9QIFNldHRpbmdzIERpYWxvZyBzaGFsbCBub3QgcHJvcGFnYXRlIHZhbHVlIHRvIGNvbnRleHQgKi9cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRTdGF0ZVV0aWwuYXBwbHlFeHRlcm5hbFN0YXRlKGZpbHRlckJhciwgc3RhdGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycjogRXJyb3IpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoYFZhbHVlSGVscERlbGVnYXRlOiAke2Vyci5tZXNzYWdlfWApO1xuXHRcdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YWNvbmRpdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG5cdFx0XHRcdGNvbnN0IGNvbmRpdGlvblBheWxvYWRNYXAgPSBjb25kaXRpb24ucGF5bG9hZCBhcyBDb25kaXRpb25QYXlsb2FkTWFwLFxuXHRcdFx0XHRcdGFLZXlzID0gY29uZGl0aW9uUGF5bG9hZE1hcCAmJiBPYmplY3Qua2V5cyhjb25kaXRpb25QYXlsb2FkTWFwKSxcblx0XHRcdFx0XHRhQ29uZGl0aW9uUGF5bG9hZCA9IG91dFBhcmFtZXRlcnMubGVuZ3RoICYmICEhYUtleXMgPyBjb25kaXRpb25QYXlsb2FkTWFwW2FLZXlzWzBdXSA6IFtdO1xuXHRcdFx0XHRpZiAoIWFDb25kaXRpb25QYXlsb2FkKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGNvbnRleHQgPSB2YWx1ZUhlbHAuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0XHRcdFx0aWYgKGNvbnRleHQpIHtcblx0XHRcdFx0XHRvdXRQYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKG91dFBhcmFtZXRlcikge1xuXHRcdFx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gb3V0UGFyYW1ldGVyLnNvdXJjZTtcblx0XHRcdFx0XHRcdGlmIChhQ29uZGl0aW9uUGF5bG9hZD8ubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG91dFZhbHVlcyA9IGFDb25kaXRpb25QYXlsb2FkWzBdO1xuXHRcdFx0XHRcdFx0XHQoY29udGV4dCBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dCkuc2V0UHJvcGVydHkodGFyZ2V0LCBvdXRWYWx1ZXNbb3V0UGFyYW1ldGVyLmhlbHBQYXRoXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFDb25kaXRpb25QYXlsb2FkPy5sZW5ndGggJiYgYUNvbmRpdGlvblBheWxvYWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0TG9nLndhcm5pbmcoXCJWYWx1ZUhlbHBEZWxlZ2F0ZTogUGFyYW10ZXJPdXQgaW4gbXVsdGktdmFsdWUtZmllbGQgbm90IHN1cHBvcnRlZFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdF9jcmVhdGVJbml0aWFsRmlsdGVyQ29uZGl0aW9uOiBmdW5jdGlvbiAodmFsdWU6IGFueSwgaW5pdGlhbFZhbHVlRmlsdGVyRW1wdHk6IGJvb2xlYW4pIHtcblx0XHRsZXQgY29uZGl0aW9uOiBDb25kaXRpb25PYmplY3QgfCB1bmRlZmluZWQ7XG5cblx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0TG9nLmVycm9yKFwiVmFsdWVIZWxwRGVsZWdhdGU6IHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSBjb3VsZCBub3QgYmUgcmVxdWVzdGVkXCIpO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09IFwiXCIpIHtcblx0XHRcdGlmIChpbml0aWFsVmFsdWVGaWx0ZXJFbXB0eSkge1xuXHRcdFx0XHRjb25kaXRpb24gPSBDb25kaXRpb24uY3JlYXRlQ29uZGl0aW9uKFwiRW1wdHlcIiwgW10sIG51bGwsIG51bGwsIENvbmRpdGlvblZhbGlkYXRlZC5WYWxpZGF0ZWQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25kaXRpb24gPSBDb25kaXRpb24uY3JlYXRlQ29uZGl0aW9uKFwiRVFcIiwgW3ZhbHVlXSwgbnVsbCwgbnVsbCwgQ29uZGl0aW9uVmFsaWRhdGVkLlZhbGlkYXRlZCk7XG5cdFx0fVxuXHRcdHJldHVybiBjb25kaXRpb247XG5cdH0sXG5cblx0X2dldEluaXRpYWxGaWx0ZXJDb25kaXRpb25zRnJvbUJpbmRpbmc6IGFzeW5jIGZ1bmN0aW9uIChcblx0XHRpbkNvbmRpdGlvbnM6IENvbmRpdGlvbk9iamVjdE1hcCxcblx0XHRjb250cm9sOiBDb250cm9sLFxuXHRcdGluUGFyYW1ldGVyczogSW5PdXRQYXJhbWV0ZXJbXVxuXHQpIHtcblx0XHRjb25zdCBwcm9wZXJ0aWVzVG9SZXF1ZXN0ID0gaW5QYXJhbWV0ZXJzLm1hcCgoaW5QYXJhbWV0ZXIpID0+IGluUGFyYW1ldGVyLnNvdXJjZSk7XG5cdFx0Y29uc3QgYmluZGluZ0NvbnRleHQgPSBjb250cm9sLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dDtcblxuXHRcdGlmICghYmluZGluZ0NvbnRleHQpIHtcblx0XHRcdExvZy5lcnJvcihcIlZhbHVlSGVscERlbGVnYXRlOiBObyBCaW5kaW5nQ29udGV4dFwiKTtcblx0XHRcdHJldHVybiBpbkNvbmRpdGlvbnM7XG5cdFx0fVxuXG5cdFx0Ly8gQWNjb3JkaW5nIHRvIG9kYXRhIHY0IGFwaSBkb2N1bWVudGF0aW9uIGZvciByZXF1ZXN0UHJvcGVydHk6IFByb3BlcnR5IHZhbHVlcyB0aGF0IGFyZSBub3QgY2FjaGVkIHlldCBhcmUgcmVxdWVzdGVkIGZyb20gdGhlIGJhY2sgZW5kXG5cdFx0Y29uc3QgdmFsdWVzID0gYXdhaXQgYmluZGluZ0NvbnRleHQucmVxdWVzdFByb3BlcnR5KHByb3BlcnRpZXNUb1JlcXVlc3QpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpblBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGluUGFyYW1ldGVyID0gaW5QYXJhbWV0ZXJzW2ldO1xuXHRcdFx0Y29uc3QgY29uZGl0aW9uID0gdGhpcy5fY3JlYXRlSW5pdGlhbEZpbHRlckNvbmRpdGlvbih2YWx1ZXNbaV0sIGluUGFyYW1ldGVyLmluaXRpYWxWYWx1ZUZpbHRlckVtcHR5KTtcblxuXHRcdFx0aWYgKGNvbmRpdGlvbikge1xuXHRcdFx0XHRpbkNvbmRpdGlvbnNbaW5QYXJhbWV0ZXIuaGVscFBhdGhdID0gW2NvbmRpdGlvbl07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBpbkNvbmRpdGlvbnM7XG5cdH0sXG5cblx0X2dldEluaXRpYWxGaWx0ZXJDb25kaXRpb25zRnJvbUZpbHRlckJhcjogYXN5bmMgZnVuY3Rpb24gKFxuXHRcdGluQ29uZGl0aW9uczogQ29uZGl0aW9uT2JqZWN0TWFwLFxuXHRcdGNvbnRyb2w6IENvbnRyb2wsXG5cdFx0aW5QYXJhbWV0ZXJzOiBJbk91dFBhcmFtZXRlcltdXG5cdCkge1xuXHRcdGNvbnN0IGZpbHRlckJhciA9IGNvbnRyb2wuZ2V0UGFyZW50KCkgYXMgRmlsdGVyQmFyQmFzZTtcblx0XHRjb25zdCBzdGF0ZTogRXh0ZXJuYWxTdGF0ZVR5cGUgPSBhd2FpdCBTdGF0ZVV0aWwucmV0cmlldmVFeHRlcm5hbFN0YXRlKGZpbHRlckJhcik7XG5cblx0XHRmb3IgKGNvbnN0IGluUGFyYW1ldGVyIG9mIGluUGFyYW1ldGVycykge1xuXHRcdFx0Y29uc3Qgc291cmNlRmllbGQgPSBpblBhcmFtZXRlci5zb3VyY2Uuc3BsaXQoXCIvXCIpLnBvcCgpIGFzIHN0cmluZztcblx0XHRcdGNvbnN0IGNvbmRpdGlvbnMgPSBzdGF0ZS5maWx0ZXJbc291cmNlRmllbGRdO1xuXG5cdFx0XHRpZiAoY29uZGl0aW9ucykge1xuXHRcdFx0XHRpbkNvbmRpdGlvbnNbaW5QYXJhbWV0ZXIuaGVscFBhdGhdID0gY29uZGl0aW9ucztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGluQ29uZGl0aW9ucztcblx0fSxcblxuXHRfcGFydGl0aW9uSW5QYXJhbWV0ZXJzOiBmdW5jdGlvbiAoaW5QYXJhbWV0ZXJzOiBJbk91dFBhcmFtZXRlcltdKSB7XG5cdFx0Y29uc3QgaW5QYXJhbWV0ZXJNYXA6IFJlY29yZDxzdHJpbmcsIEluT3V0UGFyYW1ldGVyW10+ID0ge1xuXHRcdFx0Y29uc3RhbnQ6IFtdLFxuXHRcdFx0YmluZGluZzogW10sXG5cdFx0XHRmaWx0ZXI6IFtdXG5cdFx0fTtcblxuXHRcdGZvciAoY29uc3QgaW5QYXJhbWV0ZXIgb2YgaW5QYXJhbWV0ZXJzKSB7XG5cdFx0XHRpZiAoaW5QYXJhbWV0ZXIuY29uc3RhbnRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGluUGFyYW1ldGVyTWFwLmNvbnN0YW50LnB1c2goaW5QYXJhbWV0ZXIpO1xuXHRcdFx0fSBlbHNlIGlmIChpblBhcmFtZXRlci5zb3VyY2UuaW5kZXhPZihcIiRmaWx0ZXJcIikgPT09IDApIHtcblx0XHRcdFx0aW5QYXJhbWV0ZXJNYXAuZmlsdGVyLnB1c2goaW5QYXJhbWV0ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5QYXJhbWV0ZXJNYXAuYmluZGluZy5wdXNoKGluUGFyYW1ldGVyKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGluUGFyYW1ldGVyTWFwO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm92aWRlcyBhbiBpbml0aWFsIGNvbmRpdGlvbiBjb25maWd1cmF0aW9uIGV2ZXJ5dGltZSBhIHZhbHVlIGhlbHAgY29udGVudCBpcyBzaG93bi5cblx0ICpcblx0ICogQHBhcmFtIHBheWxvYWQgUGF5bG9hZCBmb3IgZGVsZWdhdGVcblx0ICogQHBhcmFtIGNvbnRlbnQgVmFsdWVIZWxwIGNvbnRlbnQgcmVxdWVzdGluZyBjb25kaXRpb25zIGNvbmZpZ3VyYXRpb25cblx0ICogQHBhcmFtIGNvbnRyb2wgSW5zdGFuY2Ugb2YgdGhlIGNhbGxpbmcgY29udHJvbFxuXHQgKiBAcmV0dXJucyBSZXR1cm5zIGEgbWFwIG9mIGNvbmRpdGlvbnMgc3VpdGFibGUgZm9yIGEgc2FwLnVpLm1kYy5GaWx0ZXJCYXIgY29udHJvbFxuXHQgKiBAc2luY2UgMS4xMDEuMFxuXHQgKi9cblx0Z2V0SW5pdGlhbEZpbHRlckNvbmRpdGlvbnM6IGFzeW5jIGZ1bmN0aW9uIChwYXlsb2FkOiBWYWx1ZUhlbHBQYXlsb2FkLCBjb250ZW50OiBDb250ZW50LCBjb250cm9sOiBDb250cm9sIHwgdW5kZWZpbmVkKSB7XG5cdFx0Ly8gaGlnaGxpZ2h0IHRleHQgaW4gVmFsdWVIZWxwIHBvcG92ZXJcblx0XHRpZiAoY29udGVudD8uaXNBKFwic2FwLnVpLm1kYy52YWx1ZWhlbHAuY29udGVudC5NVGFibGVcIikpIHtcblx0XHRcdGNvbnN0IG9Qb3BvdmVyVGFibGUgPSAoY29udGVudCBhcyBNVGFibGUpLmdldFRhYmxlKCk7XG5cdFx0XHRvUG9wb3ZlclRhYmxlPy5yZW1vdmVFdmVudERlbGVnYXRlKG9BZnRlclJlbmRlckRlbGVnYXRlKTtcblx0XHRcdG9Qb3BvdmVyVGFibGU/LmFkZEV2ZW50RGVsZWdhdGUob0FmdGVyUmVuZGVyRGVsZWdhdGUsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluQ29uZGl0aW9uczogQ29uZGl0aW9uT2JqZWN0TWFwID0ge307XG5cblx0XHRpZiAoIWNvbnRyb2wpIHtcblx0XHRcdExvZy5lcnJvcihcIlZhbHVlSGVscERlbGVnYXRlOiBDb250cm9sIHVuZGVmaW5lZFwiKTtcblx0XHRcdHJldHVybiBpbkNvbmRpdGlvbnM7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcXVhbGlmaWVyID0gcGF5bG9hZC5xdWFsaWZpZXJzW3BheWxvYWQudmFsdWVIZWxwUXVhbGlmaWVyXTtcblx0XHRjb25zdCBpblBhcmFtZXRlcnMgPSAocXVhbGlmaWVyLnZoUGFyYW1ldGVycyAmJiBWYWx1ZUxpc3RIZWxwZXJOZXcuZ2V0SW5QYXJhbWV0ZXJzKHF1YWxpZmllci52aFBhcmFtZXRlcnMpKSB8fCBbXTtcblx0XHRjb25zdCBpblBhcmFtZXRlck1hcCA9IHRoaXMuX3BhcnRpdGlvbkluUGFyYW1ldGVycyhpblBhcmFtZXRlcnMpO1xuXHRcdGNvbnN0IGlzT2JqZWN0UGFnZSA9IGNvbnRyb2wuZ2V0QmluZGluZ0NvbnRleHQoKTtcblxuXHRcdGZvciAoY29uc3QgaW5QYXJhbWV0ZXIgb2YgaW5QYXJhbWV0ZXJNYXAuY29uc3RhbnQpIHtcblx0XHRcdGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuX2NyZWF0ZUluaXRpYWxGaWx0ZXJDb25kaXRpb24oXG5cdFx0XHRcdGluUGFyYW1ldGVyLmNvbnN0YW50VmFsdWUsXG5cdFx0XHRcdGlzT2JqZWN0UGFnZSA/IGluUGFyYW1ldGVyLmluaXRpYWxWYWx1ZUZpbHRlckVtcHR5IDogZmFsc2UgLy8gbm8gZmlsdGVyIHdpdGggXCJlbXB0eVwiIG9uIExpc3RSZXBvcnRcblx0XHRcdCk7XG5cdFx0XHRpZiAoY29uZGl0aW9uKSB7XG5cdFx0XHRcdGluQ29uZGl0aW9uc1tpblBhcmFtZXRlci5oZWxwUGF0aF0gPSBbY29uZGl0aW9uXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoaW5QYXJhbWV0ZXJNYXAuYmluZGluZy5sZW5ndGgpIHtcblx0XHRcdGF3YWl0IHRoaXMuX2dldEluaXRpYWxGaWx0ZXJDb25kaXRpb25zRnJvbUJpbmRpbmcoaW5Db25kaXRpb25zLCBjb250cm9sLCBpblBhcmFtZXRlck1hcC5iaW5kaW5nKTtcblx0XHR9XG5cblx0XHRpZiAoaW5QYXJhbWV0ZXJNYXAuZmlsdGVyLmxlbmd0aCkge1xuXHRcdFx0YXdhaXQgdGhpcy5fZ2V0SW5pdGlhbEZpbHRlckNvbmRpdGlvbnNGcm9tRmlsdGVyQmFyKGluQ29uZGl0aW9ucywgY29udHJvbCwgaW5QYXJhbWV0ZXJNYXAuZmlsdGVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGluQ29uZGl0aW9ucztcblx0fSxcblxuXHQvKipcblx0ICogUHJvdmlkZXMgdGhlIHBvc3NpYmlsaXR5IHRvIGNvbnZleSBjdXN0b20gZGF0YSBpbiBjb25kaXRpb25zLlxuXHQgKiBUaGlzIGVuYWJsZXMgYW4gYXBwbGljYXRpb24gdG8gZW5oYW5jZSBjb25kaXRpb25zIHdpdGggZGF0YSByZWxldmFudCBmb3IgY29tYmluZWQga2V5IG9yIG91dHBhcmFtZXRlciBzY2VuYXJpb3MuXG5cdCAqXG5cdCAqIEBwYXJhbSBwYXlsb2FkIFBheWxvYWQgZm9yIGRlbGVnYXRlXG5cdCAqIEBwYXJhbSBjb250ZW50IFZhbHVlSGVscCBjb250ZW50IGluc3RhbmNlXG5cdCAqIEBwYXJhbSB2YWx1ZXMgRGVzY3JpcHRpb24gcGFpciBmb3IgdGhlIGNvbmRpdGlvbiB3aGljaCBpcyB0byBiZSBjcmVhdGVkXG5cdCAqIEBwYXJhbSBjb250ZXh0IE9wdGlvbmFsIGFkZGl0aW9uYWwgY29udGV4dFxuXHQgKiBAcmV0dXJucyBPcHRpb25hbGx5IHJldHVybnMgYSBzZXJpYWxpemVhYmxlIG9iamVjdCB0byBiZSBzdG9yZWQgaW4gdGhlIGNvbmRpdGlvbiBwYXlsb2FkIGZpZWxkXG5cdCAqIEBzaW5jZSAxLjEwMS4wXG5cdCAqL1xuXHRjcmVhdGVDb25kaXRpb25QYXlsb2FkOiBmdW5jdGlvbiAocGF5bG9hZDogVmFsdWVIZWxwUGF5bG9hZCwgY29udGVudDogQ29udGVudCwgdmFsdWVzOiBhbnlbXSwgY29udGV4dDogQ29udGV4dCkge1xuXHRcdGNvbnN0IHF1YWxpZmllciA9IHBheWxvYWQucXVhbGlmaWVyc1twYXlsb2FkLnZhbHVlSGVscFF1YWxpZmllcl0sXG5cdFx0XHRlbnRyeTogQ29uZGl0aW9uUGF5bG9hZFR5cGUgPSB7fSxcblx0XHRcdGNvbmRpdGlvblBheWxvYWQ6IENvbmRpdGlvblBheWxvYWRNYXAgPSB7fTtcblx0XHRjb25zdCBjb250cm9sID0gY29udGVudC5nZXRDb250cm9sKCk7XG5cdFx0Y29uc3QgaXNNdWx0aVZhbHVlRmllbGQgPSBjb250cm9sPy5pc0EoXCJzYXAudWkubWRjLk11bHRpVmFsdWVGaWVsZFwiKTtcblx0XHRpZiAoIXF1YWxpZmllci52aEtleXMgfHwgcXVhbGlmaWVyLnZoS2V5cy5sZW5ndGggPT09IDEgfHwgaXNNdWx0aVZhbHVlRmllbGQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0cXVhbGlmaWVyLnZoS2V5cy5mb3JFYWNoKGZ1bmN0aW9uICh2aEtleSkge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBjb250ZXh0LmdldE9iamVjdCh2aEtleSk7XG5cdFx0XHRpZiAodmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0XHRlbnRyeVt2aEtleV0gPSB2YWx1ZT8ubGVuZ3RoID09PSAwID8gXCJcIiA6IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhlbnRyeSkubGVuZ3RoKSB7XG5cdFx0XHQvKiB2aCBxdWFsaWZpZXIgYXMga2V5IGZvciByZWxldmFudCBjb25kaXRpb24gKi9cblx0XHRcdGNvbmRpdGlvblBheWxvYWRbcGF5bG9hZC52YWx1ZUhlbHBRdWFsaWZpZXJdID0gW2VudHJ5XTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbmRpdGlvblBheWxvYWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoYW5nZXMgdGhlIHNlYXJjaCBzdHJpbmcuXG5cdCAqXG5cdCAqIElmIDxjb2RlPiRzZWFyY2g8L2NvZGU+IGlzIHVzZWQsIGRlcGVuZGluZyBvbiB3aGljaCBiYWNrLWVuZCBzZXJ2aWNlIGlzIHVzZWQsIHRoZSBzZWFyY2ggc3RyaW5nIG1pZ2h0IG5lZWQgdG8gYmUgZXNjYXBlZC5cblx0ICpcblx0ICogQHBhcmFtIHBheWxvYWQgUGF5bG9hZCBmb3IgZGVsZWdhdGVcblx0ICogQHBhcmFtIHR5cGVhaGVhZCBgdHJ1ZWAgaWYgdGhlIHNlYXJjaCBpcyBjYWxsZWQgZm9yIGEgdHlwZS1haGVhZFxuXHQgKiBAcGFyYW0gc2VhcmNoIFNlYXJjaCBzdHJpbmdcblx0ICogQHJldHVybnMgU2VhcmNoIHN0cmluZyB0byB1c2Vcblx0ICovXG5cdGFkanVzdFNlYXJjaDogZnVuY3Rpb24gKHBheWxvYWQ6IFZhbHVlSGVscFBheWxvYWQsIHR5cGVhaGVhZDogYm9vbGVhbiwgc2VhcmNoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gQ29tbW9uVXRpbHMubm9ybWFsaXplU2VhcmNoVGVybShzZWFyY2gpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm92aWRlcyB0aGUgcG9zc2liaWxpdHkgdG8gY3VzdG9taXplIHNlbGVjdGlvbnMgaW4gJ1NlbGVjdCBmcm9tIGxpc3QnIHNjZW5hcmlvcy5cblx0ICogQnkgZGVmYXVsdCwgb25seSBjb25kaXRpb24ga2V5cyBhcmUgY29uc2lkZXJlZC4gVGhpcyBtYXkgYmUgZXh0ZW5kZWQgd2l0aCBwYXlsb2FkIGRlcGVuZGVudCBmaWx0ZXJzLlxuXHQgKlxuXHQgKiBAcGFyYW0gcGF5bG9hZCBQYXlsb2FkIGZvciBkZWxlZ2F0ZVxuXHQgKiBAcGFyYW0gY29udGVudCBWYWx1ZUhlbHAgY29udGVudCBpbnN0YW5jZVxuXHQgKiBAcGFyYW0gaXRlbSBFbnRyeSBvZiBhIGdpdmVuIGxpc3Rcblx0ICogQHBhcmFtIGNvbmRpdGlvbnMgQ3VycmVudCBjb25kaXRpb25zXG5cdCAqIEByZXR1cm5zIFRydWUsIGlmIGl0ZW0gaXMgc2VsZWN0ZWRcblx0ICogQHNpbmNlIDEuMTAxLjBcblx0ICovXG5cdGlzRmlsdGVyYWJsZUxpc3RJdGVtU2VsZWN0ZWQ6IGZ1bmN0aW9uIChwYXlsb2FkOiBWYWx1ZUhlbHBQYXlsb2FkLCBjb250ZW50OiBDb250ZW50LCBpdGVtOiBDb250cm9sLCBjb25kaXRpb25zOiBDb25kaXRpb25PYmplY3RbXSkge1xuXHRcdGNvbnN0IGNvbnRleHQgPSBpdGVtLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb25kaXRpb24gPSBjb25kaXRpb25zLmZpbmQoZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuXHRcdFx0Y29uc3QgY29uZGl0aW9uUGF5bG9hZE1hcCA9IGNvbmRpdGlvbi5wYXlsb2FkIGFzIENvbmRpdGlvblBheWxvYWRNYXAsXG5cdFx0XHRcdHZhbHVlSGVscFF1YWxpZmllciA9IHBheWxvYWQudmFsdWVIZWxwUXVhbGlmaWVyIHx8IFwiXCI7XG5cdFx0XHRpZiAoIWNvbmRpdGlvblBheWxvYWRNYXAgJiYgT2JqZWN0LmtleXMocGF5bG9hZC5xdWFsaWZpZXJzKVswXSA9PT0gdmFsdWVIZWxwUXVhbGlmaWVyKSB7XG5cdFx0XHRcdGNvbnN0IGtleVBhdGggPSBjb250ZW50LmdldEtleVBhdGgoKTtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQ/LmdldE9iamVjdChrZXlQYXRoKSA9PT0gY29uZGl0aW9uPy52YWx1ZXNbMF07XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBjb25kaXRpb25TZWxlY3RlZFJvdyA9IGNvbmRpdGlvblBheWxvYWRNYXA/Llt2YWx1ZUhlbHBRdWFsaWZpZXJdPy5bMF0gfHwge30sXG5cdFx0XHRcdHNlbGVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbmRpdGlvblNlbGVjdGVkUm93KTtcblx0XHRcdGlmIChzZWxlY3RlZEtleXMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZEtleXMuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdHJldHVybiAoY29uZGl0aW9uU2VsZWN0ZWRSb3dba2V5XSBhcyBhbnkpID09PSBjb250ZXh0Py5nZXRPYmplY3Qoa2V5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gc2VsZWN0ZWRDb25kaXRpb24gPyB0cnVlIDogZmFsc2U7XG5cdH1cbn0pO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7O0VBb0JBLElBQU1BLHVCQUF1QixHQUFHLGdDQUFoQztFQUNBLElBQU1DLHlCQUF5QixHQUFHLG9DQUFsQztFQUNBLElB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