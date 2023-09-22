/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/helpers/ModelHelper", "sap/fe/macros/internal/valuehelp/ValueListHelperNew", "sap/ui/core/Core"], function (Log, ModelHelper, ValueListHelper, Core) {
  "use strict";

  var MassEditHandlers = {
    /**
     * Called for property change in the transient context.
     *
     * @function
     * @param newValue New value of the property.
     * @param dataProperty Final context returned after the paginator action
     * @param mdcFieldId Final context returned after the paginator action
     */
    contextPropertyChange: function (newValue, dataProperty, mdcFieldId) {
      // Called for
      // 1. Out Parameters.
      // 2. Transient context property change.
      var source = Core.byId(mdcFieldId);
      var transCtx = source && source.getBindingContext();
      var fieldInfoModel = source && source.getModel("fieldsInfo");
      var values = fieldInfoModel.getProperty("/values/".concat(dataProperty)) || fieldInfoModel.getProperty("/unitData/".concat(dataProperty)) || [];

      if (transCtx && (values.inputType === "InputWithValueHelp" || values.inputType === "InputWithUnit") && !values.valueListInfo) {
        MassEditHandlers._setValueListInfo(transCtx, source, fieldInfoModel, dataProperty);
      }

      var isDialogOpen = fieldInfoModel && fieldInfoModel.getProperty("/isOpen");

      if (!isDialogOpen || !source.getVisible()) {
        return;
      }

      MassEditHandlers._updateSelectKey(source, dataProperty, newValue);
    },

    /**
     * Called for change in the MDC field.
     * This is called on selection done through VHD.
     * This is not called on change of the dropdown as we are using a custom MassEditSelect control and not general Select.
     *
     * @function
     * @param event Event object for change.
     * @param propertyName Property path.
     */
    handleMDCFieldChange: function (event, propertyName) {
      // Called for
      // 1. VHD property change.
      var source = event && event.getSource();
      var changePromise = event && event.getParameter("promise");
      var comboBox = source.getContent();

      if (!comboBox || !propertyName) {
        return;
      }

      changePromise.then(MassEditHandlers._updateSelectKeyForMDCFieldChange.bind(MassEditHandlers, source, propertyName)).catch(function (err) {
        Log.warning("VHD selection couldn't be populated in the mass edit field.".concat(err));
      });
    },

    /**
     * Called for selection change through the drop down.
     *
     * @function
     * @param event Event object for change.
     */
    handleSelectionChange: function (event) {
      // Called for Manual selection from dropdown(comboBox or select)
      // 1. VHD select.
      // 2. Any value change in the control.
      var source = event && event.getSource();
      var key = source.getSelectedKey();
      var params = source && key && key.split("/");
      var propertyName;

      if (params[0] === "UseValueHelpValue") {
        var prevItem = event.getParameter("previousSelectedItem");
        var selectKey = prevItem.getKey();
        propertyName = params.slice(1).join("/");

        MassEditHandlers._onVHSelect(source, propertyName, selectKey);

        return;
      }

      var fieldInfoModel = source && source.getModel("fieldsInfo");
      propertyName = MassEditHandlers._getPropertyNameFromKey(key);

      MassEditHandlers._updateSuggestionForFieldsWithInParameters(fieldInfoModel, propertyName, key.startsWith("Default/") || key.startsWith("ClearFieldValue/"), true);

      MassEditHandlers._updateSuggestionForFieldsWithOutParameters(fieldInfoModel, propertyName, key.startsWith("Default/") || key.startsWith("ClearFieldValue/"), false);

      MassEditHandlers._updateResults(source, params, true);
    },

    /**
     * Update selections to results and the suggests in drop downs.
     *
     * @function
     * @param source MDC field that was changed.
     * @param propertyName Property path.
     * @param value New value.
     */
    _updateSelectKeyForMDCFieldChange: function (source, propertyName, value) {
      var transCtx = source && source.getBindingContext();
      var fieldInfoModel = source && source.getModel("fieldsInfo");
      var values = fieldInfoModel.getProperty("/values/".concat(propertyName)) || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) || [];

      if (transCtx && (values.inputType === "InputWithValueHelp" || values.inputType === "InputWithUnit") && !values.valueListInfo) {
        MassEditHandlers._setValueListInfo(transCtx, source, fieldInfoModel, propertyName);
      }

      MassEditHandlers._updateSuggestionForFieldsWithOutParameters(fieldInfoModel, propertyName, false, true);

      MassEditHandlers._updateSuggestionForFieldsWithInParameters(fieldInfoModel, propertyName, false, true);

      var formattedValue = source.getFormFormattedValue();

      MassEditHandlers._updateSelectKey(source, propertyName, value, formattedValue);
    },

    /**
     * Update suggests for all drop downs with InParameter as the propertyName.
     *
     * @function
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param propertyName Property path.
     * @param resetValues Should the values be reset to original state.
     * @param keepExistingSelection Should the existing selection before update remain.
     */
    _updateSuggestionForFieldsWithInParameters: function (fieldInfoModel, propertyName, resetValues, keepExistingSelection) {
      var values = fieldInfoModel.getProperty("/values");
      var unitData = fieldInfoModel.getProperty("/unitData");
      var fieldPaths = Object.keys(values);
      var unitFieldPaths = Object.keys(unitData);
      fieldPaths.forEach(MassEditHandlers._updateInParameterSuggetions.bind(MassEditHandlers, fieldInfoModel, "/values/", propertyName, resetValues, keepExistingSelection));
      unitFieldPaths.forEach(MassEditHandlers._updateInParameterSuggetions.bind(MassEditHandlers, fieldInfoModel, "/unitData/", propertyName, resetValues, keepExistingSelection));
    },

    /**
     * Update suggests for a drop down with InParameter as the srcPropertyName.
     *
     * @function
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param pathPrefix Path in the runtime model.
     * @param srcPropertyName The InParameter Property path.
     * @param resetValues Should the values be reset to original state.
     * @param keepExistingSelection Should the existing selection before update remain.
     * @param propertyName Property path that needs update of suggestions.
     */
    _updateInParameterSuggetions: function (fieldInfoModel, pathPrefix, srcPropertyName, resetValues, keepExistingSelection, propertyName) {
      var valueListInfo = fieldInfoModel.getProperty("".concat(pathPrefix + propertyName, "/valueListInfo"));

      if (valueListInfo && srcPropertyName != propertyName) {
        var inParameters = valueListInfo.inParameters;

        if (inParameters && inParameters.length > 0 && inParameters.includes(srcPropertyName)) {
          MassEditHandlers._updateFieldPathSuggestions(fieldInfoModel, pathPrefix + propertyName, resetValues, keepExistingSelection);
        }
      }
    },

    /**
     * Update suggests for all OutParameter's drop downs of the propertyName.
     *
     * @function
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param propertyName Property path.
     * @param resetValues Should the values be reset to original state.
     * @param keepExistingSelection Should the existing selection before update remain.
     */
    _updateSuggestionForFieldsWithOutParameters: function (fieldInfoModel, propertyName, resetValues, keepExistingSelection) {
      var valueListInfo = fieldInfoModel.getProperty("/values/".concat(propertyName, "/valueListInfo")) || fieldInfoModel.getProperty("/unitData/".concat(propertyName, "/valueListInfo"));

      if (valueListInfo && valueListInfo.outParameters) {
        var outParameters = valueListInfo.outParameters;

        if (outParameters.length && outParameters.length > 0) {
          MassEditHandlers._updateOutParameterSuggetions(outParameters, fieldInfoModel, resetValues, keepExistingSelection);

          var pathPrefix = fieldInfoModel.getProperty("/values/".concat(propertyName)) && "/values/".concat(propertyName) || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) && "/unitData/".concat(propertyName);

          if (pathPrefix) {
            MassEditHandlers._updateFieldPathSuggestions(fieldInfoModel, pathPrefix, false, true);
          }
        }
      }
    },

    /**
     * Update suggests for a drop down with InParameter as the srcPropertyName.
     *
     * @function
     * @param outParameters String arrary of OutParameter property paths.
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param resetValues Should the values be reset to original state.
     * @param keepExistingSelection Should the existing selection before update remain.
     */
    _updateOutParameterSuggetions: function (outParameters, fieldInfoModel, resetValues, keepExistingSelection) {
      var values = fieldInfoModel.getProperty("/values");
      var unitData = fieldInfoModel.getProperty("/unitData");
      var fieldPaths = Object.keys(values);
      var unitFieldPaths = Object.keys(unitData);
      outParameters.forEach(function (outParameter) {
        if (fieldPaths.includes(outParameter)) {
          MassEditHandlers._updateFieldPathSuggestions(fieldInfoModel, "/values/".concat(outParameter), resetValues, keepExistingSelection);
        } else if (unitFieldPaths.includes(outParameter)) {
          MassEditHandlers._updateFieldPathSuggestions(fieldInfoModel, "/unitData/".concat(outParameter), resetValues, keepExistingSelection);
        }
      });
    },

    /**
     * Update suggests for a drop down of a field.
     *
     * @function
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param fieldPathAbsolute Complete runtime property path.
     * @param resetValues Should the values be reset to original state.
     * @param keepExistingSelection Should the existing selection before update remain.
     */
    _updateFieldPathSuggestions: function (fieldInfoModel, fieldPathAbsolute, resetValues, keepExistingSelection) {
      var options = fieldInfoModel.getProperty(fieldPathAbsolute);
      var defaultOptions = options.defaultOptions;
      var selectedKey = fieldInfoModel.getProperty("".concat(fieldPathAbsolute, "/selectedKey"));
      var existingSelection = keepExistingSelection && options.find(function (option) {
        return option.key === selectedKey;
      });

      if (resetValues) {
        var selectOptions = options.selectOptions;
        options.length = 0;
        defaultOptions.forEach(function (defaultOption) {
          return options.push(defaultOption);
        });
        selectOptions.forEach(function (selectOption) {
          return options.push(selectOption);
        });
      } else {
        options.length = 0;
        defaultOptions.forEach(function (defaultOption) {
          return options.push(defaultOption);
        });
      }

      fieldInfoModel.setProperty(fieldPathAbsolute, options);

      if (existingSelection && !options.includes(existingSelection)) {
        options.push(existingSelection);
        fieldInfoModel.setProperty("".concat(fieldPathAbsolute, "/selectedKey"), selectedKey);
      }
    },

    /**
     * Update In and Out Parameters in the MED.
     *
     * @function
     * @param transCtx The transient context of the MED.
     * @param source MDC field.
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param propertyName Property path.
     */
    _setValueListInfo: function (transCtx, source, fieldInfoModel, propertyName) {
      var propPath = fieldInfoModel.getProperty("/values/".concat(propertyName)) && "/values/" || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) && "/unitData/";

      if (fieldInfoModel.getProperty("".concat(propPath).concat(propertyName, "/valueListInfo"))) {
        return;
      }

      var valueListInfo = fieldInfoModel.getProperty("".concat(propPath).concat(propertyName, "/valueListInfo"));

      if (!valueListInfo) {
        MassEditHandlers._requestValueList(transCtx, source, fieldInfoModel, propertyName);
      }
    },

    /**
     * Request and update In and Out Parameters in the MED.
     *
     * @function
     * @param transCtx The transient context of the MED.
     * @param source MDC field.
     * @param fieldInfoModel Runtime model with parameters store information.
     * @param propertyName Property path.
     */
    _requestValueList: function (transCtx, source, fieldInfoModel, propertyName) {
      var _fieldValueHelp$getDe;

      var metaPath = ModelHelper.getMetaPathForContext(transCtx);
      var propertyPath = metaPath && "".concat(metaPath, "/").concat(propertyName);
      var dependents = source === null || source === void 0 ? void 0 : source.getDependents();
      var fieldHelp = source === null || source === void 0 ? void 0 : source.getFieldHelp();
      var fieldValueHelp = dependents === null || dependents === void 0 ? void 0 : dependents.find(function (dependent) {
        return dependent.getId() === fieldHelp;
      });
      var payload = (_fieldValueHelp$getDe = fieldValueHelp.getDelegate()) === null || _fieldValueHelp$getDe === void 0 ? void 0 : _fieldValueHelp$getDe.payload;

      if (!(fieldValueHelp !== null && fieldValueHelp !== void 0 && fieldValueHelp.getBindingContext())) {
        fieldValueHelp === null || fieldValueHelp === void 0 ? void 0 : fieldValueHelp.setBindingContext(transCtx);
      }

      var metaModel = transCtx.getModel().getMetaModel();
      ValueListHelper.createVHUIModel(fieldValueHelp, propertyPath, metaModel);
      var valueListInfo = ValueListHelper.getValueListInfo(fieldValueHelp, propertyPath, payload);
      valueListInfo.then(function (vLinfos) {
        var vLinfo = vLinfos[0];
        var propPath = fieldInfoModel.getProperty("/values/".concat(propertyName)) && "/values/" || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) && "/unitData/";
        var info = {
          inParameters: vLinfo.vhParameters && ValueListHelper.getInParameters(vLinfo.vhParameters).map(function (inParam) {
            return inParam.helpPath;
          }),
          outParameters: vLinfo.vhParameters && ValueListHelper.getOutParameters(vLinfo.vhParameters).map(function (outParam) {
            return outParam.helpPath;
          })
        };
        fieldInfoModel.setProperty("".concat(propPath).concat(propertyName, "/valueListInfo"), info);

        if (info.outParameters.length > 0) {
          MassEditHandlers._updateFieldPathSuggestions(fieldInfoModel, "/values/".concat(propertyName), false, true);
        }
      }).catch(function () {
        Log.warning("Mass Edit: Couldn't load valueList info for ".concat(propertyPath));
      });
    },

    /**
     * Get field help control from MDC field.
     *
     * @function
     * @param transCtx The transient context of the MED.
     * @param source MDC field.
     * @returns Field Help control.
     */
    _getValueHelp: function (transCtx, source) {
      var dependents = source === null || source === void 0 ? void 0 : source.getDependents();
      var fieldHelp = source === null || source === void 0 ? void 0 : source.getFieldHelp();
      return dependents === null || dependents === void 0 ? void 0 : dependents.find(function (dependent) {
        return dependent.getId() === fieldHelp;
      });
    },

    /**
     * Colled on drop down selection of VHD option.
     *
     * @function
     * @param source Custom Mass Edit Select control.
     * @param propertyName Property path.
     * @param selectKey Previous key before the VHD was selected.
     */
    _onVHSelect: function (source, propertyName, selectKey) {
      // Called for
      // 1. VHD selected.
      var fieldInfoModel = source && source.getModel("fieldsInfo");
      var propPath = fieldInfoModel.getProperty("/values/".concat(propertyName)) && "/values/" || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) && "/unitData/";
      var transCtx = source.getBindingContext();

      var fieldValueHelp = MassEditHandlers._getValueHelp(transCtx, source.getParent());

      if (!(fieldValueHelp !== null && fieldValueHelp !== void 0 && fieldValueHelp.getBindingContext())) {
        fieldValueHelp === null || fieldValueHelp === void 0 ? void 0 : fieldValueHelp.setBindingContext(transCtx);
      }

      source.fireValueHelpRequest();
      fieldInfoModel.setProperty("".concat(propPath + propertyName, "/selectedKey"), selectKey);
    },

    /**
     * Gets Property name from selection key.
     *
     * @function
     * @param key Selection key.
     * @returns Property name.
     */
    _getPropertyNameFromKey: function (key) {
      var propertyName = "";

      if (key.startsWith("Default/") || key.startsWith("ClearFieldValue/") || key.startsWith("UseValueHelpValue/")) {
        propertyName = key.substring(key.indexOf("/") + 1);
      } else {
        propertyName = key.substring(0, key.lastIndexOf("/"));
      }

      return propertyName;
    },

    /**
     * Update selection to Custom Mass Edit Select from MDC field.
     *
     * @function
     * @param source MDC field.
     * @param propertyName Property path.
     * @param value Value to update.
     * @param fullText Full text to use.
     */
    _updateSelectKey: function (source, propertyName, value, fullText) {
      // Called for
      // 1. VHD property change
      // 2. Out Parameters.
      // 3. Transient context property change.
      var comboBox = source.getContent();

      if (!comboBox || !propertyName) {
        return;
      }

      var key = comboBox.getSelectedKey();

      if ((key.startsWith("Default/") || key.startsWith("ClearFieldValue/")) && !value) {
        return;
      }

      var formattedText = MassEditHandlers._valueExists(fullText) ? fullText : value;
      var fieldInfoModel = source && source.getModel("fieldsInfo");
      var values = fieldInfoModel.getProperty("/values/".concat(propertyName)) || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) || [];
      var propPath = fieldInfoModel.getProperty("/values/".concat(propertyName)) && "/values/" || fieldInfoModel.getProperty("/unitData/".concat(propertyName)) && "/unitData/";
      var relatedField = values.find(function (fieldData) {
        var _fieldData$textInfo;

        return (fieldData === null || fieldData === void 0 ? void 0 : (_fieldData$textInfo = fieldData.textInfo) === null || _fieldData$textInfo === void 0 ? void 0 : _fieldData$textInfo.value) === value || fieldData.text === value;
      });

      if (relatedField) {
        if (fullText && relatedField.textInfo && relatedField.textInfo.descriptionPath && (relatedField.text != formattedText || relatedField.textInfo.fullText != formattedText)) {
          // Update the full text only when provided.
          relatedField.text = formattedText;
          relatedField.textInfo.fullText = formattedText;
          relatedField.textInfo.description = source.getAdditionalValue();
        }

        if (relatedField.key === key) {
          fieldInfoModel.setProperty("".concat(propPath + propertyName, "/selectedKey"), key);
          return;
        }

        key = relatedField.key;
      } else if ([undefined, null, ""].indexOf(value) === -1) {
        key = "".concat(propertyName, "/").concat(value);
        var selectionInfo = {
          text: formattedText,
          key: key,
          textInfo: {
            description: source.getAdditionalValue(),
            descriptionPath: values && values.textInfo && values.textInfo.descriptionPath,
            fullText: formattedText,
            textArrangement: source.getDisplay(),
            value: source.getValue(),
            valuePath: propertyName
          }
        };
        values.push(selectionInfo);
        values.selectOptions = values.selectOptions || [];
        values.selectOptions.push(selectionInfo);
        fieldInfoModel.setProperty(propPath + propertyName, values);
      } else {
        key = "Default/".concat(propertyName);
      }

      fieldInfoModel.setProperty("".concat(propPath + propertyName, "/selectedKey"), key);

      MassEditHandlers._updateResults(comboBox);
    },

    /**
     * Get Value from Drop down.
     *
     * @function
     * @param source Drop down control.
     * @returns Value of selection.
     */
    _getValue: function (source) {
      var _getSelectedItem;

      return source.getMetadata().getName() === "sap.fe.core.controls.MassEditSelect" ? (_getSelectedItem = source.getSelectedItem()) === null || _getSelectedItem === void 0 ? void 0 : _getSelectedItem.getText() : source.getValue();
    },
    _getValueOnEmpty: function (oSource, fieldsInfoModel, value, sPropertyName) {
      if (!value) {
        var values = fieldsInfoModel.getProperty("/values/".concat(sPropertyName)) || fieldsInfoModel.getProperty("/unitData/".concat(sPropertyName)) || [];

        if (values.unitProperty) {
          value = 0;
          oSource.setValue(value);
        } else if (values.inputType === "CheckBox") {
          value = false;
        }
      }

      return value;
    },
    _valueExists: function (value) {
      return value != undefined && value != null;
    },

    /**
     * Updates selections to runtime model.
     *
     * @function
     * @param oSource Drop down control.
     * @param aParams Parts of key in runtime model.
     * @param updateTransCtx Should transient context be updated with the value.
     */
    _updateResults: function (oSource) {
      var aParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var updateTransCtx = arguments.length > 2 ? arguments[2] : undefined;
      // Called for
      // 1. VHD property change.
      // 2. Out parameter.
      // 3. transient context property change.
      var fieldsInfoModel = oSource && oSource.getModel("fieldsInfo");
      var oFieldsInfoData = fieldsInfoModel && fieldsInfoModel.getData();

      var value = MassEditHandlers._getValue(oSource);

      aParams = aParams.length > 0 ? aParams : oSource && oSource.getSelectedKey() && oSource.getSelectedKey().split("/");
      var oDataObject;
      var sPropertyName = oSource.data("fieldPath");

      if (aParams[0] === "Default") {
        oDataObject = {
          keyValue: aParams[1],
          value: aParams[0]
        };
      } else if (aParams[0] === "ClearFieldValue") {
        value = "";
        value = MassEditHandlers._getValueOnEmpty(oSource, fieldsInfoModel, value, sPropertyName);
        oDataObject = {
          keyValue: aParams[1],
          value: value
        };
      } else if (!aParams) {
        value = MassEditHandlers._getValueOnEmpty(oSource, fieldsInfoModel, value, sPropertyName);
        oDataObject = {
          keyValue: sPropertyName,
          value: value
        };
      } else {
        var propertyName = aParams.slice(0, -1).join("/");
        var propertyValues = fieldsInfoModel.getProperty("/values/".concat(propertyName)) || fieldsInfoModel.getProperty("/unitData/".concat(propertyName)) || [];
        var relatedField = (propertyValues || []).find(function (oFieldData) {
          var _oFieldData$textInfo;

          return (oFieldData === null || oFieldData === void 0 ? void 0 : (_oFieldData$textInfo = oFieldData.textInfo) === null || _oFieldData$textInfo === void 0 ? void 0 : _oFieldData$textInfo.value) === value || oFieldData.text === value;
        });
        oDataObject = {
          keyValue: propertyName,
          value: relatedField.textInfo && MassEditHandlers._valueExists(relatedField.textInfo.value) ? relatedField.textInfo.value : relatedField.text
        };
      }

      var bExistingElementindex = -1;

      for (var i = 0; i < oFieldsInfoData.results.length; i++) {
        if (oFieldsInfoData.results[i].keyValue === oDataObject.keyValue) {
          bExistingElementindex = i;
        }
      }

      if (bExistingElementindex !== -1) {
        oFieldsInfoData.results[bExistingElementindex] = oDataObject;
      } else {
        oFieldsInfoData.results.push(oDataObject);
      }

      if (updateTransCtx && !oDataObject.keyValue.includes("/")) {
        var transCtx = oSource.getBindingContext();

        if (aParams[0] === "Default" || aParams[0] === "ClearFieldValue") {
          transCtx.setProperty(oDataObject.keyValue, null);
        } else if (oDataObject) {
          transCtx.setProperty(oDataObject.keyValue, oDataObject.value);
        }
      }
    }
  };
  return MassEditHandlers;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNYXNzRWRpdEhhbmRsZXJzIiwiY29udGV4dFByb3BlcnR5Q2hhbmdlIiwibmV3VmFsdWUiLCJkYXRhUHJvcGVydHkiLCJtZGNGaWVsZElkIiwic291cmNlIiwiQ29yZSIsImJ5SWQiLCJ0cmFuc0N0eCIsImdldEJpbmRpbmdDb250ZXh0IiwiZmllbGRJbmZvTW9kZWwiLCJnZXRNb2RlbCIsInZhbHVlcyIsImdldFByb3BlcnR5IiwiaW5wdXRUeXBlIiwidmFsdWVMaXN0SW5mbyIsIl9zZXRWYWx1ZUxpc3RJbmZvIiwiaXNEaWFsb2dPcGVuIiwiZ2V0VmlzaWJsZSIsIl91cGRhdGVTZWxlY3RLZXkiLCJoYW5kbGVNRENGaWVsZENoYW5nZSIsImV2ZW50IiwicHJvcGVydHlOYW1lIiwiZ2V0U291cmNlIiwiY2hhbmdlUHJvbWlzZSIsImdldFBhcmFtZXRlciIsImNvbWJvQm94IiwiZ2V0Q29udGVudCIsInRoZW4iLCJfdXBkYXRlU2VsZWN0S2V5Rm9yTURDRmllbGRDaGFuZ2UiLCJiaW5kIiwiY2F0Y2giLCJlcnIiLCJMb2ciLCJ3YXJuaW5nIiwiaGFuZGxlU2VsZWN0aW9uQ2hhbmdlIiwia2V5IiwiZ2V0U2VsZWN0ZWRLZXkiLCJwYXJhbXMiLCJzcGxpdCIsInByZXZJdGVtIiwic2VsZWN0S2V5IiwiZ2V0S2V5Iiwic2xpY2UiLCJqb2luIiwiX29uVkhTZWxlY3QiLCJfZ2V0UHJvcGVydHlOYW1lRnJvbUtleSIsIl91cGRhdGVTdWdnZXN0aW9uRm9yRmllbGRzV2l0aEluUGFyYW1ldGVycyIsInN0YXJ0c1dpdGgiLCJfdXBkYXRlU3VnZ2VzdGlvbkZvckZpZWxkc1dpdGhPdXRQYXJhbWV0ZXJzIiwiX3VwZGF0ZVJlc3VsdHMiLCJ2YWx1ZSIsImZvcm1hdHRlZFZhbHVlIiwiZ2V0Rm9ybUZvcm1hdHRlZFZhbHVlIiwicmVzZXRWYWx1ZXMiLCJrZWVwRXhpc3RpbmdTZWxlY3Rpb24iLCJ1bml0RGF0YSIsImZpZWxkUGF0aHMiLCJPYmplY3QiLCJrZXlzIiwidW5pdEZpZWxkUGF0aHMiLCJmb3JFYWNoIiwiX3VwZGF0ZUluUGFyYW1ldGVyU3VnZ2V0aW9ucyIsInBhdGhQcmVmaXgiLCJzcmNQcm9wZXJ0eU5hbWUiLCJpblBhcmFtZXRlcnMiLCJsZW5ndGgiLCJpbmNsdWRlcyIsIl91cGRhdGVGaWVsZFBhdGhTdWdnZXN0aW9ucyIsIm91dFBhcmFtZXRlcnMiLCJfdXBkYXRlT3V0UGFyYW1ldGVyU3VnZ2V0aW9ucyIsIm91dFBhcmFtZXRlciIsImZpZWxkUGF0aEFic29sdXRlIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwic2VsZWN0ZWRLZXkiLCJleGlzdGluZ1NlbGVjdGlvbiIsImZpbmQiLCJvcHRpb24iLCJzZWxlY3RPcHRpb25zIiwiZGVmYXVsdE9wdGlvbiIsInB1c2giLCJzZWxlY3RPcHRpb24iLCJzZXRQcm9wZXJ0eSIsInByb3BQYXRoIiwiX3JlcXVlc3RWYWx1ZUxpc3QiLCJtZXRhUGF0aCIsIk1vZGVsSGVscGVyIiwiZ2V0TWV0YVBhdGhGb3JDb250ZXh0IiwicHJvcGVydHlQYXRoIiwiZGVwZW5kZW50cyIsImdldERlcGVuZGVudHMiLCJmaWVsZEhlbHAiLCJnZXRGaWVsZEhlbHAiLCJmaWVsZFZhbHVlSGVscCIsImRlcGVuZGVudCIsImdldElkIiwicGF5bG9hZCIsImdldERlbGVnYXRlIiwic2V0QmluZGluZ0NvbnRleHQiLCJtZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJWYWx1ZUxpc3RIZWxwZXIiLCJjcmVhdGVWSFVJTW9kZWwiLCJnZXRWYWx1ZUxpc3RJbmZvIiwidkxpbmZvcyIsInZMaW5mbyIsImluZm8iLCJ2aFBhcmFtZXRlcnMiLCJnZXRJblBhcmFtZXRlcnMiLCJtYXAiLCJpblBhcmFtIiwiaGVscFBhdGgiLCJnZXRPdXRQYXJhbWV0ZXJzIiwib3V0UGFyYW0iLCJfZ2V0VmFsdWVIZWxwIiwiZ2V0UGFyZW50IiwiZmlyZVZhbHVlSGVscFJlcXVlc3QiLCJzdWJzdHJpbmciLCJpbmRleE9mIiwibGFzdEluZGV4T2YiLCJmdWxsVGV4dCIsImZvcm1hdHRlZFRleHQiLCJfdmFsdWVFeGlzdHMiLCJyZWxhdGVkRmllbGQiLCJmaWVsZERhdGEiLCJ0ZXh0SW5mbyIsInRleHQiLCJkZXNjcmlwdGlvblBhdGgiLCJkZXNjcmlwdGlvbiIsImdldEFkZGl0aW9uYWxWYWx1ZSIsInVuZGVmaW5lZCIsInNlbGVjdGlvbkluZm8iLCJ0ZXh0QXJyYW5nZW1lbnQiLCJnZXREaXNwbGF5IiwiZ2V0VmFsdWUiLCJ2YWx1ZVBhdGgiLCJfZ2V0VmFsdWUiLCJnZXRNZXRhZGF0YSIsImdldE5hbWUiLCJnZXRTZWxlY3RlZEl0ZW0iLCJnZXRUZXh0IiwiX2dldFZhbHVlT25FbXB0eSIsIm9Tb3VyY2UiLCJmaWVsZHNJbmZvTW9kZWwiLCJzUHJvcGVydHlOYW1lIiwidW5pdFByb3BlcnR5Iiwic2V0VmFsdWUiLCJhUGFyYW1zIiwidXBkYXRlVHJhbnNDdHgiLCJvRmllbGRzSW5mb0RhdGEiLCJnZXREYXRhIiwib0RhdGFPYmplY3QiLCJkYXRhIiwia2V5VmFsdWUiLCJwcm9wZXJ0eVZhbHVlcyIsIm9GaWVsZERhdGEiLCJiRXhpc3RpbmdFbGVtZW50aW5kZXgiLCJpIiwicmVzdWx0cyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiTWFzc0VkaXRIYW5kbGVycy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnN0cnVjdG9yIGZvciBhIG5ldyBWaXN1YWwgRmlsdGVyIENvbnRhaW5lci5cbiAqIFVzZWQgZm9yIHZpc3VhbCBmaWx0ZXJzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtzSWRdIElEIGZvciB0aGUgbmV3IGNvbnRyb2wsIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGlmIG5vIElEIGlzIGdpdmVuXG4gKiBAZXh0ZW5kcyBzYXAudWkubWRjLmZpbHRlcmJhci5JRmlsdGVyQ29udGFpbmVyXG4gKiBAY2xhc3NcbiAqIEBwcml2YXRlXG4gKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbHMuZmlsdGVyYmFyLlZpc3VhbEZpbHRlckNvbnRhaW5lclxuICovXG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IFZhbHVlTGlzdEhlbHBlciwgeyBWYWx1ZUhlbHBQYXlsb2FkLCBWYWx1ZUxpc3RJbmZvIH0gZnJvbSBcInNhcC9mZS9tYWNyb3MvaW50ZXJuYWwvdmFsdWVoZWxwL1ZhbHVlTGlzdEhlbHBlck5ld1wiO1xuaW1wb3J0IHR5cGUgQ29tYm9Cb3ggZnJvbSBcInNhcC9tL0NvbWJvQm94XCI7XG5pbXBvcnQgdHlwZSBTZWxlY3QgZnJvbSBcInNhcC9tL1NlbGVjdFwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCB0eXBlIEZpZWxkIGZyb20gXCJzYXAvdWkvbWRjL0ZpZWxkXCI7XG5pbXBvcnQgVmFsdWVIZWxwIGZyb20gXCJzYXAvdWkvbWRjL1ZhbHVlSGVscFwiO1xuaW1wb3J0IHR5cGUgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuXG5jb25zdCBNYXNzRWRpdEhhbmRsZXJzOiBhbnkgPSB7XG5cdC8qKlxuXHQgKiBDYWxsZWQgZm9yIHByb3BlcnR5IGNoYW5nZSBpbiB0aGUgdHJhbnNpZW50IGNvbnRleHQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gbmV3VmFsdWUgTmV3IHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cblx0ICogQHBhcmFtIGRhdGFQcm9wZXJ0eSBGaW5hbCBjb250ZXh0IHJldHVybmVkIGFmdGVyIHRoZSBwYWdpbmF0b3IgYWN0aW9uXG5cdCAqIEBwYXJhbSBtZGNGaWVsZElkIEZpbmFsIGNvbnRleHQgcmV0dXJuZWQgYWZ0ZXIgdGhlIHBhZ2luYXRvciBhY3Rpb25cblx0ICovXG5cdGNvbnRleHRQcm9wZXJ0eUNoYW5nZTogZnVuY3Rpb24gKG5ld1ZhbHVlOiBhbnksIGRhdGFQcm9wZXJ0eTogc3RyaW5nLCBtZGNGaWVsZElkOiBzdHJpbmcpIHtcblx0XHQvLyBDYWxsZWQgZm9yXG5cdFx0Ly8gMS4gT3V0IFBhcmFtZXRlcnMuXG5cdFx0Ly8gMi4gVHJhbnNpZW50IGNvbnRleHQgcHJvcGVydHkgY2hhbmdlLlxuXG5cdFx0Y29uc3Qgc291cmNlID0gQ29yZS5ieUlkKG1kY0ZpZWxkSWQpIGFzIEZpZWxkO1xuXHRcdGNvbnN0IHRyYW5zQ3R4ID0gc291cmNlICYmIChzb3VyY2UuZ2V0QmluZGluZ0NvbnRleHQoKSBhcyBDb250ZXh0KTtcblx0XHRjb25zdCBmaWVsZEluZm9Nb2RlbCA9IHNvdXJjZSAmJiAoc291cmNlLmdldE1vZGVsKFwiZmllbGRzSW5mb1wiKSBhcyBKU09OTW9kZWwpO1xuXHRcdGNvbnN0IHZhbHVlcyA9XG5cdFx0XHRmaWVsZEluZm9Nb2RlbC5nZXRQcm9wZXJ0eShgL3ZhbHVlcy8ke2RhdGFQcm9wZXJ0eX1gKSB8fCBmaWVsZEluZm9Nb2RlbC5nZXRQcm9wZXJ0eShgL3VuaXREYXRhLyR7ZGF0YVByb3BlcnR5fWApIHx8IFtdO1xuXG5cdFx0aWYgKHRyYW5zQ3R4ICYmICh2YWx1ZXMuaW5wdXRUeXBlID09PSBcIklucHV0V2l0aFZhbHVlSGVscFwiIHx8IHZhbHVlcy5pbnB1dFR5cGUgPT09IFwiSW5wdXRXaXRoVW5pdFwiKSAmJiAhdmFsdWVzLnZhbHVlTGlzdEluZm8pIHtcblx0XHRcdE1hc3NFZGl0SGFuZGxlcnMuX3NldFZhbHVlTGlzdEluZm8odHJhbnNDdHgsIHNvdXJjZSwgZmllbGRJbmZvTW9kZWwsIGRhdGFQcm9wZXJ0eSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNEaWFsb2dPcGVuID0gZmllbGRJbmZvTW9kZWwgJiYgZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoXCIvaXNPcGVuXCIpO1xuXHRcdGlmICghaXNEaWFsb2dPcGVuIHx8ICFzb3VyY2UuZ2V0VmlzaWJsZSgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0TWFzc0VkaXRIYW5kbGVycy5fdXBkYXRlU2VsZWN0S2V5KHNvdXJjZSwgZGF0YVByb3BlcnR5LCBuZXdWYWx1ZSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENhbGxlZCBmb3IgY2hhbmdlIGluIHRoZSBNREMgZmllbGQuXG5cdCAqIFRoaXMgaXMgY2FsbGVkIG9uIHNlbGVjdGlvbiBkb25lIHRocm91Z2ggVkhELlxuXHQgKiBUaGlzIGlzIG5vdCBjYWxsZWQgb24gY2hhbmdlIG9mIHRoZSBkcm9wZG93biBhcyB3ZSBhcmUgdXNpbmcgYSBjdXN0b20gTWFzc0VkaXRTZWxlY3QgY29udHJvbCBhbmQgbm90IGdlbmVyYWwgU2VsZWN0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIGV2ZW50IEV2ZW50IG9iamVjdCBmb3IgY2hhbmdlLlxuXHQgKiBAcGFyYW0gcHJvcGVydHlOYW1lIFByb3BlcnR5IHBhdGguXG5cdCAqL1xuXHRoYW5kbGVNRENGaWVsZENoYW5nZTogZnVuY3Rpb24gKGV2ZW50OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XG5cdFx0Ly8gQ2FsbGVkIGZvclxuXHRcdC8vIDEuIFZIRCBwcm9wZXJ0eSBjaGFuZ2UuXG5cblx0XHRjb25zdCBzb3VyY2UgPSBldmVudCAmJiBldmVudC5nZXRTb3VyY2UoKTtcblx0XHRjb25zdCBjaGFuZ2VQcm9taXNlID0gZXZlbnQgJiYgZXZlbnQuZ2V0UGFyYW1ldGVyKFwicHJvbWlzZVwiKTtcblx0XHRjb25zdCBjb21ib0JveCA9IHNvdXJjZS5nZXRDb250ZW50KCk7XG5cdFx0aWYgKCFjb21ib0JveCB8fCAhcHJvcGVydHlOYW1lKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y2hhbmdlUHJvbWlzZVxuXHRcdFx0LnRoZW4oTWFzc0VkaXRIYW5kbGVycy5fdXBkYXRlU2VsZWN0S2V5Rm9yTURDRmllbGRDaGFuZ2UuYmluZChNYXNzRWRpdEhhbmRsZXJzLCBzb3VyY2UsIHByb3BlcnR5TmFtZSkpXG5cdFx0XHQuY2F0Y2goKGVycjogYW55KSA9PiB7XG5cdFx0XHRcdExvZy53YXJuaW5nKGBWSEQgc2VsZWN0aW9uIGNvdWxkbid0IGJlIHBvcHVsYXRlZCBpbiB0aGUgbWFzcyBlZGl0IGZpZWxkLiR7ZXJyfWApO1xuXHRcdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENhbGxlZCBmb3Igc2VsZWN0aW9uIGNoYW5nZSB0aHJvdWdoIHRoZSBkcm9wIGRvd24uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gZXZlbnQgRXZlbnQgb2JqZWN0IGZvciBjaGFuZ2UuXG5cdCAqL1xuXHRoYW5kbGVTZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIChldmVudDogYW55KSB7XG5cdFx0Ly8gQ2FsbGVkIGZvciBNYW51YWwgc2VsZWN0aW9uIGZyb20gZHJvcGRvd24oY29tYm9Cb3ggb3Igc2VsZWN0KVxuXHRcdC8vIDEuIFZIRCBzZWxlY3QuXG5cdFx0Ly8gMi4gQW55IHZhbHVlIGNoYW5nZSBpbiB0aGUgY29udHJvbC5cblxuXHRcdGNvbnN0IHNvdXJjZSA9IGV2ZW50ICYmIGV2ZW50LmdldFNvdXJjZSgpO1xuXHRcdGNvbnN0IGtleSA9IHNvdXJjZS5nZXRTZWxlY3RlZEtleSgpIGFzIHN0cmluZztcblx0XHRjb25zdCBwYXJhbXMgPSBzb3VyY2UgJiYga2V5ICYmIGtleS5zcGxpdChcIi9cIik7XG5cdFx0bGV0IHByb3BlcnR5TmFtZTtcblxuXHRcdGlmIChwYXJhbXNbMF0gPT09IFwiVXNlVmFsdWVIZWxwVmFsdWVcIikge1xuXHRcdFx0Y29uc3QgcHJldkl0ZW0gPSBldmVudC5nZXRQYXJhbWV0ZXIoXCJwcmV2aW91c1NlbGVjdGVkSXRlbVwiKTtcblx0XHRcdGNvbnN0IHNlbGVjdEtleSA9IHByZXZJdGVtLmdldEtleSgpO1xuXHRcdFx0cHJvcGVydHlOYW1lID0gcGFyYW1zLnNsaWNlKDEpLmpvaW4oXCIvXCIpO1xuXHRcdFx0TWFzc0VkaXRIYW5kbGVycy5fb25WSFNlbGVjdChzb3VyY2UsIHByb3BlcnR5TmFtZSwgc2VsZWN0S2V5KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZEluZm9Nb2RlbCA9IHNvdXJjZSAmJiAoc291cmNlLmdldE1vZGVsKFwiZmllbGRzSW5mb1wiKSBhcyBKU09OTW9kZWwpO1xuXHRcdHByb3BlcnR5TmFtZSA9IE1hc3NFZGl0SGFuZGxlcnMuX2dldFByb3BlcnR5TmFtZUZyb21LZXkoa2V5KTtcblx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVTdWdnZXN0aW9uRm9yRmllbGRzV2l0aEluUGFyYW1ldGVycyhcblx0XHRcdGZpZWxkSW5mb01vZGVsLFxuXHRcdFx0cHJvcGVydHlOYW1lLFxuXHRcdFx0a2V5LnN0YXJ0c1dpdGgoXCJEZWZhdWx0L1wiKSB8fCBrZXkuc3RhcnRzV2l0aChcIkNsZWFyRmllbGRWYWx1ZS9cIiksXG5cdFx0XHR0cnVlXG5cdFx0KTtcblx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVTdWdnZXN0aW9uRm9yRmllbGRzV2l0aE91dFBhcmFtZXRlcnMoXG5cdFx0XHRmaWVsZEluZm9Nb2RlbCxcblx0XHRcdHByb3BlcnR5TmFtZSxcblx0XHRcdGtleS5zdGFydHNXaXRoKFwiRGVmYXVsdC9cIikgfHwga2V5LnN0YXJ0c1dpdGgoXCJDbGVhckZpZWxkVmFsdWUvXCIpLFxuXHRcdFx0ZmFsc2Vcblx0XHQpO1xuXHRcdE1hc3NFZGl0SGFuZGxlcnMuX3VwZGF0ZVJlc3VsdHMoc291cmNlLCBwYXJhbXMsIHRydWUpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgc2VsZWN0aW9ucyB0byByZXN1bHRzIGFuZCB0aGUgc3VnZ2VzdHMgaW4gZHJvcCBkb3ducy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBzb3VyY2UgTURDIGZpZWxkIHRoYXQgd2FzIGNoYW5nZWQuXG5cdCAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgUHJvcGVydHkgcGF0aC5cblx0ICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZS5cblx0ICovXG5cdF91cGRhdGVTZWxlY3RLZXlGb3JNRENGaWVsZENoYW5nZTogZnVuY3Rpb24gKHNvdXJjZTogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuXHRcdGNvbnN0IHRyYW5zQ3R4ID0gc291cmNlICYmIHNvdXJjZS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGNvbnN0IGZpZWxkSW5mb01vZGVsID0gc291cmNlICYmIChzb3VyY2UuZ2V0TW9kZWwoXCJmaWVsZHNJbmZvXCIpIGFzIEpTT05Nb2RlbCk7XG5cdFx0Y29uc3QgdmFsdWVzID1cblx0XHRcdGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApIHx8IGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdW5pdERhdGEvJHtwcm9wZXJ0eU5hbWV9YCkgfHwgW107XG5cblx0XHRpZiAodHJhbnNDdHggJiYgKHZhbHVlcy5pbnB1dFR5cGUgPT09IFwiSW5wdXRXaXRoVmFsdWVIZWxwXCIgfHwgdmFsdWVzLmlucHV0VHlwZSA9PT0gXCJJbnB1dFdpdGhVbml0XCIpICYmICF2YWx1ZXMudmFsdWVMaXN0SW5mbykge1xuXHRcdFx0TWFzc0VkaXRIYW5kbGVycy5fc2V0VmFsdWVMaXN0SW5mbyh0cmFuc0N0eCwgc291cmNlLCBmaWVsZEluZm9Nb2RlbCwgcHJvcGVydHlOYW1lKTtcblx0XHR9XG5cblx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVTdWdnZXN0aW9uRm9yRmllbGRzV2l0aE91dFBhcmFtZXRlcnMoZmllbGRJbmZvTW9kZWwsIHByb3BlcnR5TmFtZSwgZmFsc2UsIHRydWUpO1xuXHRcdE1hc3NFZGl0SGFuZGxlcnMuX3VwZGF0ZVN1Z2dlc3Rpb25Gb3JGaWVsZHNXaXRoSW5QYXJhbWV0ZXJzKGZpZWxkSW5mb01vZGVsLCBwcm9wZXJ0eU5hbWUsIGZhbHNlLCB0cnVlKTtcblxuXHRcdGNvbnN0IGZvcm1hdHRlZFZhbHVlID0gc291cmNlLmdldEZvcm1Gb3JtYXR0ZWRWYWx1ZSgpO1xuXHRcdE1hc3NFZGl0SGFuZGxlcnMuX3VwZGF0ZVNlbGVjdEtleShzb3VyY2UsIHByb3BlcnR5TmFtZSwgdmFsdWUsIGZvcm1hdHRlZFZhbHVlKTtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIHN1Z2dlc3RzIGZvciBhbGwgZHJvcCBkb3ducyB3aXRoIEluUGFyYW1ldGVyIGFzIHRoZSBwcm9wZXJ0eU5hbWUuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gZmllbGRJbmZvTW9kZWwgUnVudGltZSBtb2RlbCB3aXRoIHBhcmFtZXRlcnMgc3RvcmUgaW5mb3JtYXRpb24uXG5cdCAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgUHJvcGVydHkgcGF0aC5cblx0ICogQHBhcmFtIHJlc2V0VmFsdWVzIFNob3VsZCB0aGUgdmFsdWVzIGJlIHJlc2V0IHRvIG9yaWdpbmFsIHN0YXRlLlxuXHQgKiBAcGFyYW0ga2VlcEV4aXN0aW5nU2VsZWN0aW9uIFNob3VsZCB0aGUgZXhpc3Rpbmcgc2VsZWN0aW9uIGJlZm9yZSB1cGRhdGUgcmVtYWluLlxuXHQgKi9cblx0X3VwZGF0ZVN1Z2dlc3Rpb25Gb3JGaWVsZHNXaXRoSW5QYXJhbWV0ZXJzOiBmdW5jdGlvbiAoXG5cdFx0ZmllbGRJbmZvTW9kZWw6IEpTT05Nb2RlbCxcblx0XHRwcm9wZXJ0eU5hbWU6IHN0cmluZyxcblx0XHRyZXNldFZhbHVlczogYm9vbGVhbixcblx0XHRrZWVwRXhpc3RpbmdTZWxlY3Rpb246IGJvb2xlYW5cblx0KTogdm9pZCB7XG5cdFx0Y29uc3QgdmFsdWVzID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoXCIvdmFsdWVzXCIpO1xuXHRcdGNvbnN0IHVuaXREYXRhID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoXCIvdW5pdERhdGFcIik7XG5cdFx0Y29uc3QgZmllbGRQYXRocyA9IE9iamVjdC5rZXlzKHZhbHVlcyk7XG5cdFx0Y29uc3QgdW5pdEZpZWxkUGF0aHMgPSBPYmplY3Qua2V5cyh1bml0RGF0YSk7XG5cblx0XHRmaWVsZFBhdGhzLmZvckVhY2goXG5cdFx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVJblBhcmFtZXRlclN1Z2dldGlvbnMuYmluZChcblx0XHRcdFx0TWFzc0VkaXRIYW5kbGVycyxcblx0XHRcdFx0ZmllbGRJbmZvTW9kZWwsXG5cdFx0XHRcdFwiL3ZhbHVlcy9cIixcblx0XHRcdFx0cHJvcGVydHlOYW1lLFxuXHRcdFx0XHRyZXNldFZhbHVlcyxcblx0XHRcdFx0a2VlcEV4aXN0aW5nU2VsZWN0aW9uXG5cdFx0XHQpXG5cdFx0KTtcblx0XHR1bml0RmllbGRQYXRocy5mb3JFYWNoKFxuXHRcdFx0TWFzc0VkaXRIYW5kbGVycy5fdXBkYXRlSW5QYXJhbWV0ZXJTdWdnZXRpb25zLmJpbmQoXG5cdFx0XHRcdE1hc3NFZGl0SGFuZGxlcnMsXG5cdFx0XHRcdGZpZWxkSW5mb01vZGVsLFxuXHRcdFx0XHRcIi91bml0RGF0YS9cIixcblx0XHRcdFx0cHJvcGVydHlOYW1lLFxuXHRcdFx0XHRyZXNldFZhbHVlcyxcblx0XHRcdFx0a2VlcEV4aXN0aW5nU2VsZWN0aW9uXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIHN1Z2dlc3RzIGZvciBhIGRyb3AgZG93biB3aXRoIEluUGFyYW1ldGVyIGFzIHRoZSBzcmNQcm9wZXJ0eU5hbWUuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gZmllbGRJbmZvTW9kZWwgUnVudGltZSBtb2RlbCB3aXRoIHBhcmFtZXRlcnMgc3RvcmUgaW5mb3JtYXRpb24uXG5cdCAqIEBwYXJhbSBwYXRoUHJlZml4IFBhdGggaW4gdGhlIHJ1bnRpbWUgbW9kZWwuXG5cdCAqIEBwYXJhbSBzcmNQcm9wZXJ0eU5hbWUgVGhlIEluUGFyYW1ldGVyIFByb3BlcnR5IHBhdGguXG5cdCAqIEBwYXJhbSByZXNldFZhbHVlcyBTaG91bGQgdGhlIHZhbHVlcyBiZSByZXNldCB0byBvcmlnaW5hbCBzdGF0ZS5cblx0ICogQHBhcmFtIGtlZXBFeGlzdGluZ1NlbGVjdGlvbiBTaG91bGQgdGhlIGV4aXN0aW5nIHNlbGVjdGlvbiBiZWZvcmUgdXBkYXRlIHJlbWFpbi5cblx0ICogQHBhcmFtIHByb3BlcnR5TmFtZSBQcm9wZXJ0eSBwYXRoIHRoYXQgbmVlZHMgdXBkYXRlIG9mIHN1Z2dlc3Rpb25zLlxuXHQgKi9cblx0X3VwZGF0ZUluUGFyYW1ldGVyU3VnZ2V0aW9uczogZnVuY3Rpb24gKFxuXHRcdGZpZWxkSW5mb01vZGVsOiBKU09OTW9kZWwsXG5cdFx0cGF0aFByZWZpeDogc3RyaW5nLFxuXHRcdHNyY1Byb3BlcnR5TmFtZTogc3RyaW5nLFxuXHRcdHJlc2V0VmFsdWVzOiBib29sZWFuLFxuXHRcdGtlZXBFeGlzdGluZ1NlbGVjdGlvbjogYm9vbGVhbixcblx0XHRwcm9wZXJ0eU5hbWU6IHN0cmluZ1xuXHQpIHtcblx0XHRjb25zdCB2YWx1ZUxpc3RJbmZvID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYCR7cGF0aFByZWZpeCArIHByb3BlcnR5TmFtZX0vdmFsdWVMaXN0SW5mb2ApO1xuXHRcdGlmICh2YWx1ZUxpc3RJbmZvICYmIHNyY1Byb3BlcnR5TmFtZSAhPSBwcm9wZXJ0eU5hbWUpIHtcblx0XHRcdGNvbnN0IGluUGFyYW1ldGVycyA9IHZhbHVlTGlzdEluZm8uaW5QYXJhbWV0ZXJzO1xuXHRcdFx0aWYgKGluUGFyYW1ldGVycyAmJiBpblBhcmFtZXRlcnMubGVuZ3RoID4gMCAmJiBpblBhcmFtZXRlcnMuaW5jbHVkZXMoc3JjUHJvcGVydHlOYW1lKSkge1xuXHRcdFx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVGaWVsZFBhdGhTdWdnZXN0aW9ucyhmaWVsZEluZm9Nb2RlbCwgcGF0aFByZWZpeCArIHByb3BlcnR5TmFtZSwgcmVzZXRWYWx1ZXMsIGtlZXBFeGlzdGluZ1NlbGVjdGlvbik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgc3VnZ2VzdHMgZm9yIGFsbCBPdXRQYXJhbWV0ZXIncyBkcm9wIGRvd25zIG9mIHRoZSBwcm9wZXJ0eU5hbWUuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gZmllbGRJbmZvTW9kZWwgUnVudGltZSBtb2RlbCB3aXRoIHBhcmFtZXRlcnMgc3RvcmUgaW5mb3JtYXRpb24uXG5cdCAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgUHJvcGVydHkgcGF0aC5cblx0ICogQHBhcmFtIHJlc2V0VmFsdWVzIFNob3VsZCB0aGUgdmFsdWVzIGJlIHJlc2V0IHRvIG9yaWdpbmFsIHN0YXRlLlxuXHQgKiBAcGFyYW0ga2VlcEV4aXN0aW5nU2VsZWN0aW9uIFNob3VsZCB0aGUgZXhpc3Rpbmcgc2VsZWN0aW9uIGJlZm9yZSB1cGRhdGUgcmVtYWluLlxuXHQgKi9cblx0X3VwZGF0ZVN1Z2dlc3Rpb25Gb3JGaWVsZHNXaXRoT3V0UGFyYW1ldGVyczogZnVuY3Rpb24gKFxuXHRcdGZpZWxkSW5mb01vZGVsOiBKU09OTW9kZWwsXG5cdFx0cHJvcGVydHlOYW1lOiBzdHJpbmcsXG5cdFx0cmVzZXRWYWx1ZXM6IGJvb2xlYW4sXG5cdFx0a2VlcEV4aXN0aW5nU2VsZWN0aW9uOiBib29sZWFuXG5cdCk6IHZvaWQge1xuXHRcdGNvbnN0IHZhbHVlTGlzdEluZm8gPVxuXHRcdFx0ZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYC92YWx1ZXMvJHtwcm9wZXJ0eU5hbWV9L3ZhbHVlTGlzdEluZm9gKSB8fFxuXHRcdFx0ZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYC91bml0RGF0YS8ke3Byb3BlcnR5TmFtZX0vdmFsdWVMaXN0SW5mb2ApO1xuXG5cdFx0aWYgKHZhbHVlTGlzdEluZm8gJiYgdmFsdWVMaXN0SW5mby5vdXRQYXJhbWV0ZXJzKSB7XG5cdFx0XHRjb25zdCBvdXRQYXJhbWV0ZXJzID0gdmFsdWVMaXN0SW5mby5vdXRQYXJhbWV0ZXJzO1xuXHRcdFx0aWYgKG91dFBhcmFtZXRlcnMubGVuZ3RoICYmIG91dFBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVPdXRQYXJhbWV0ZXJTdWdnZXRpb25zKG91dFBhcmFtZXRlcnMsIGZpZWxkSW5mb01vZGVsLCByZXNldFZhbHVlcywga2VlcEV4aXN0aW5nU2VsZWN0aW9uKTtcblx0XHRcdFx0Y29uc3QgcGF0aFByZWZpeCA9XG5cdFx0XHRcdFx0KGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApICYmIGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApIHx8XG5cdFx0XHRcdFx0KGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdW5pdERhdGEvJHtwcm9wZXJ0eU5hbWV9YCkgJiYgYC91bml0RGF0YS8ke3Byb3BlcnR5TmFtZX1gKTtcblx0XHRcdFx0aWYgKHBhdGhQcmVmaXgpIHtcblx0XHRcdFx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVGaWVsZFBhdGhTdWdnZXN0aW9ucyhmaWVsZEluZm9Nb2RlbCwgcGF0aFByZWZpeCwgZmFsc2UsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgc3VnZ2VzdHMgZm9yIGEgZHJvcCBkb3duIHdpdGggSW5QYXJhbWV0ZXIgYXMgdGhlIHNyY1Byb3BlcnR5TmFtZS5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBvdXRQYXJhbWV0ZXJzIFN0cmluZyBhcnJhcnkgb2YgT3V0UGFyYW1ldGVyIHByb3BlcnR5IHBhdGhzLlxuXHQgKiBAcGFyYW0gZmllbGRJbmZvTW9kZWwgUnVudGltZSBtb2RlbCB3aXRoIHBhcmFtZXRlcnMgc3RvcmUgaW5mb3JtYXRpb24uXG5cdCAqIEBwYXJhbSByZXNldFZhbHVlcyBTaG91bGQgdGhlIHZhbHVlcyBiZSByZXNldCB0byBvcmlnaW5hbCBzdGF0ZS5cblx0ICogQHBhcmFtIGtlZXBFeGlzdGluZ1NlbGVjdGlvbiBTaG91bGQgdGhlIGV4aXN0aW5nIHNlbGVjdGlvbiBiZWZvcmUgdXBkYXRlIHJlbWFpbi5cblx0ICovXG5cdF91cGRhdGVPdXRQYXJhbWV0ZXJTdWdnZXRpb25zOiBmdW5jdGlvbiAoXG5cdFx0b3V0UGFyYW1ldGVyczogc3RyaW5nW10sXG5cdFx0ZmllbGRJbmZvTW9kZWw6IEpTT05Nb2RlbCxcblx0XHRyZXNldFZhbHVlczogYm9vbGVhbixcblx0XHRrZWVwRXhpc3RpbmdTZWxlY3Rpb246IGJvb2xlYW5cblx0KSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoXCIvdmFsdWVzXCIpO1xuXHRcdGNvbnN0IHVuaXREYXRhID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoXCIvdW5pdERhdGFcIik7XG5cdFx0Y29uc3QgZmllbGRQYXRocyA9IE9iamVjdC5rZXlzKHZhbHVlcyk7XG5cdFx0Y29uc3QgdW5pdEZpZWxkUGF0aHMgPSBPYmplY3Qua2V5cyh1bml0RGF0YSk7XG5cblx0XHRvdXRQYXJhbWV0ZXJzLmZvckVhY2goKG91dFBhcmFtZXRlcjogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoZmllbGRQYXRocy5pbmNsdWRlcyhvdXRQYXJhbWV0ZXIpKSB7XG5cdFx0XHRcdE1hc3NFZGl0SGFuZGxlcnMuX3VwZGF0ZUZpZWxkUGF0aFN1Z2dlc3Rpb25zKGZpZWxkSW5mb01vZGVsLCBgL3ZhbHVlcy8ke291dFBhcmFtZXRlcn1gLCByZXNldFZhbHVlcywga2VlcEV4aXN0aW5nU2VsZWN0aW9uKTtcblx0XHRcdH0gZWxzZSBpZiAodW5pdEZpZWxkUGF0aHMuaW5jbHVkZXMob3V0UGFyYW1ldGVyKSkge1xuXHRcdFx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVGaWVsZFBhdGhTdWdnZXN0aW9ucyhcblx0XHRcdFx0XHRmaWVsZEluZm9Nb2RlbCxcblx0XHRcdFx0XHRgL3VuaXREYXRhLyR7b3V0UGFyYW1ldGVyfWAsXG5cdFx0XHRcdFx0cmVzZXRWYWx1ZXMsXG5cdFx0XHRcdFx0a2VlcEV4aXN0aW5nU2VsZWN0aW9uXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFVwZGF0ZSBzdWdnZXN0cyBmb3IgYSBkcm9wIGRvd24gb2YgYSBmaWVsZC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBmaWVsZEluZm9Nb2RlbCBSdW50aW1lIG1vZGVsIHdpdGggcGFyYW1ldGVycyBzdG9yZSBpbmZvcm1hdGlvbi5cblx0ICogQHBhcmFtIGZpZWxkUGF0aEFic29sdXRlIENvbXBsZXRlIHJ1bnRpbWUgcHJvcGVydHkgcGF0aC5cblx0ICogQHBhcmFtIHJlc2V0VmFsdWVzIFNob3VsZCB0aGUgdmFsdWVzIGJlIHJlc2V0IHRvIG9yaWdpbmFsIHN0YXRlLlxuXHQgKiBAcGFyYW0ga2VlcEV4aXN0aW5nU2VsZWN0aW9uIFNob3VsZCB0aGUgZXhpc3Rpbmcgc2VsZWN0aW9uIGJlZm9yZSB1cGRhdGUgcmVtYWluLlxuXHQgKi9cblx0X3VwZGF0ZUZpZWxkUGF0aFN1Z2dlc3Rpb25zOiBmdW5jdGlvbiAoXG5cdFx0ZmllbGRJbmZvTW9kZWw6IEpTT05Nb2RlbCxcblx0XHRmaWVsZFBhdGhBYnNvbHV0ZTogc3RyaW5nLFxuXHRcdHJlc2V0VmFsdWVzOiBib29sZWFuLFxuXHRcdGtlZXBFeGlzdGluZ1NlbGVjdGlvbjogYm9vbGVhblxuXHQpIHtcblx0XHRjb25zdCBvcHRpb25zID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoZmllbGRQYXRoQWJzb2x1dGUpO1xuXHRcdGNvbnN0IGRlZmF1bHRPcHRpb25zID0gb3B0aW9ucy5kZWZhdWx0T3B0aW9ucztcblx0XHRjb25zdCBzZWxlY3RlZEtleSA9IGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAke2ZpZWxkUGF0aEFic29sdXRlfS9zZWxlY3RlZEtleWApO1xuXHRcdGNvbnN0IGV4aXN0aW5nU2VsZWN0aW9uID0ga2VlcEV4aXN0aW5nU2VsZWN0aW9uICYmIG9wdGlvbnMuZmluZCgob3B0aW9uOiBhbnkpID0+IG9wdGlvbi5rZXkgPT09IHNlbGVjdGVkS2V5KTtcblx0XHRpZiAocmVzZXRWYWx1ZXMpIHtcblx0XHRcdGNvbnN0IHNlbGVjdE9wdGlvbnMgPSBvcHRpb25zLnNlbGVjdE9wdGlvbnM7XG5cdFx0XHRvcHRpb25zLmxlbmd0aCA9IDA7XG5cdFx0XHRkZWZhdWx0T3B0aW9ucy5mb3JFYWNoKChkZWZhdWx0T3B0aW9uOiBhbnkpID0+IG9wdGlvbnMucHVzaChkZWZhdWx0T3B0aW9uKSk7XG5cdFx0XHRzZWxlY3RPcHRpb25zLmZvckVhY2goKHNlbGVjdE9wdGlvbjogYW55KSA9PiBvcHRpb25zLnB1c2goc2VsZWN0T3B0aW9uKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9wdGlvbnMubGVuZ3RoID0gMDtcblx0XHRcdGRlZmF1bHRPcHRpb25zLmZvckVhY2goKGRlZmF1bHRPcHRpb246IGFueSkgPT4gb3B0aW9ucy5wdXNoKGRlZmF1bHRPcHRpb24pKTtcblx0XHR9XG5cblx0XHRmaWVsZEluZm9Nb2RlbC5zZXRQcm9wZXJ0eShmaWVsZFBhdGhBYnNvbHV0ZSwgb3B0aW9ucyk7XG5cblx0XHRpZiAoZXhpc3RpbmdTZWxlY3Rpb24gJiYgIW9wdGlvbnMuaW5jbHVkZXMoZXhpc3RpbmdTZWxlY3Rpb24pKSB7XG5cdFx0XHRvcHRpb25zLnB1c2goZXhpc3RpbmdTZWxlY3Rpb24pO1xuXHRcdFx0ZmllbGRJbmZvTW9kZWwuc2V0UHJvcGVydHkoYCR7ZmllbGRQYXRoQWJzb2x1dGV9L3NlbGVjdGVkS2V5YCwgc2VsZWN0ZWRLZXkpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIEluIGFuZCBPdXQgUGFyYW1ldGVycyBpbiB0aGUgTUVELlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIHRyYW5zQ3R4IFRoZSB0cmFuc2llbnQgY29udGV4dCBvZiB0aGUgTUVELlxuXHQgKiBAcGFyYW0gc291cmNlIE1EQyBmaWVsZC5cblx0ICogQHBhcmFtIGZpZWxkSW5mb01vZGVsIFJ1bnRpbWUgbW9kZWwgd2l0aCBwYXJhbWV0ZXJzIHN0b3JlIGluZm9ybWF0aW9uLlxuXHQgKiBAcGFyYW0gcHJvcGVydHlOYW1lIFByb3BlcnR5IHBhdGguXG5cdCAqL1xuXHRfc2V0VmFsdWVMaXN0SW5mbzogZnVuY3Rpb24gKHRyYW5zQ3R4OiBDb250ZXh0LCBzb3VyY2U6IEZpZWxkLCBmaWVsZEluZm9Nb2RlbDogSlNPTk1vZGVsLCBwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHZvaWQge1xuXHRcdGNvbnN0IHByb3BQYXRoID1cblx0XHRcdChmaWVsZEluZm9Nb2RlbC5nZXRQcm9wZXJ0eShgL3ZhbHVlcy8ke3Byb3BlcnR5TmFtZX1gKSAmJiBcIi92YWx1ZXMvXCIpIHx8XG5cdFx0XHQoZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYC91bml0RGF0YS8ke3Byb3BlcnR5TmFtZX1gKSAmJiBcIi91bml0RGF0YS9cIik7XG5cblx0XHRpZiAoZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYCR7cHJvcFBhdGh9JHtwcm9wZXJ0eU5hbWV9L3ZhbHVlTGlzdEluZm9gKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCB2YWx1ZUxpc3RJbmZvID0gZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYCR7cHJvcFBhdGh9JHtwcm9wZXJ0eU5hbWV9L3ZhbHVlTGlzdEluZm9gKTtcblxuXHRcdGlmICghdmFsdWVMaXN0SW5mbykge1xuXHRcdFx0TWFzc0VkaXRIYW5kbGVycy5fcmVxdWVzdFZhbHVlTGlzdCh0cmFuc0N0eCwgc291cmNlLCBmaWVsZEluZm9Nb2RlbCwgcHJvcGVydHlOYW1lKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlcXVlc3QgYW5kIHVwZGF0ZSBJbiBhbmQgT3V0IFBhcmFtZXRlcnMgaW4gdGhlIE1FRC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSB0cmFuc0N0eCBUaGUgdHJhbnNpZW50IGNvbnRleHQgb2YgdGhlIE1FRC5cblx0ICogQHBhcmFtIHNvdXJjZSBNREMgZmllbGQuXG5cdCAqIEBwYXJhbSBmaWVsZEluZm9Nb2RlbCBSdW50aW1lIG1vZGVsIHdpdGggcGFyYW1ldGVycyBzdG9yZSBpbmZvcm1hdGlvbi5cblx0ICogQHBhcmFtIHByb3BlcnR5TmFtZSBQcm9wZXJ0eSBwYXRoLlxuXHQgKi9cblx0X3JlcXVlc3RWYWx1ZUxpc3Q6IGZ1bmN0aW9uICh0cmFuc0N0eDogQ29udGV4dCwgc291cmNlOiBGaWVsZCwgZmllbGRJbmZvTW9kZWw6IEpTT05Nb2RlbCwgcHJvcGVydHlOYW1lOiBzdHJpbmcpOiB2b2lkIHtcblx0XHRjb25zdCBtZXRhUGF0aCA9IE1vZGVsSGVscGVyLmdldE1ldGFQYXRoRm9yQ29udGV4dCh0cmFuc0N0eCk7XG5cdFx0Y29uc3QgcHJvcGVydHlQYXRoID0gKG1ldGFQYXRoICYmIGAke21ldGFQYXRofS8ke3Byb3BlcnR5TmFtZX1gKSBhcyBzdHJpbmc7XG5cdFx0Y29uc3QgZGVwZW5kZW50cyA9IHNvdXJjZT8uZ2V0RGVwZW5kZW50cygpO1xuXHRcdGNvbnN0IGZpZWxkSGVscCA9IHNvdXJjZT8uZ2V0RmllbGRIZWxwKCk7XG5cdFx0Y29uc3QgZmllbGRWYWx1ZUhlbHAgPSBkZXBlbmRlbnRzPy5maW5kKChkZXBlbmRlbnQ6IGFueSkgPT4gZGVwZW5kZW50LmdldElkKCkgPT09IGZpZWxkSGVscCkgYXMgVmFsdWVIZWxwO1xuXHRcdGNvbnN0IHBheWxvYWQgPSAoZmllbGRWYWx1ZUhlbHAuZ2V0RGVsZWdhdGUoKSBhcyBhbnkpPy5wYXlsb2FkIGFzIFZhbHVlSGVscFBheWxvYWQ7XG5cdFx0aWYgKCFmaWVsZFZhbHVlSGVscD8uZ2V0QmluZGluZ0NvbnRleHQoKSkge1xuXHRcdFx0ZmllbGRWYWx1ZUhlbHA/LnNldEJpbmRpbmdDb250ZXh0KHRyYW5zQ3R4KTtcblx0XHR9XG5cdFx0Y29uc3QgbWV0YU1vZGVsID0gdHJhbnNDdHguZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbDtcblx0XHRWYWx1ZUxpc3RIZWxwZXIuY3JlYXRlVkhVSU1vZGVsKGZpZWxkVmFsdWVIZWxwLCBwcm9wZXJ0eVBhdGgsIG1ldGFNb2RlbCk7XG5cdFx0Y29uc3QgdmFsdWVMaXN0SW5mbyA9IFZhbHVlTGlzdEhlbHBlci5nZXRWYWx1ZUxpc3RJbmZvKGZpZWxkVmFsdWVIZWxwLCBwcm9wZXJ0eVBhdGgsIHBheWxvYWQpO1xuXG5cdFx0dmFsdWVMaXN0SW5mb1xuXHRcdFx0LnRoZW4oKHZMaW5mb3M6IFZhbHVlTGlzdEluZm9bXSkgPT4ge1xuXHRcdFx0XHRjb25zdCB2TGluZm8gPSB2TGluZm9zWzBdO1xuXHRcdFx0XHRjb25zdCBwcm9wUGF0aCA9XG5cdFx0XHRcdFx0KGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApICYmIFwiL3ZhbHVlcy9cIikgfHxcblx0XHRcdFx0XHQoZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYC91bml0RGF0YS8ke3Byb3BlcnR5TmFtZX1gKSAmJiBcIi91bml0RGF0YS9cIik7XG5cdFx0XHRcdGNvbnN0IGluZm86IGFueSA9IHtcblx0XHRcdFx0XHRpblBhcmFtZXRlcnM6XG5cdFx0XHRcdFx0XHR2TGluZm8udmhQYXJhbWV0ZXJzICYmIFZhbHVlTGlzdEhlbHBlci5nZXRJblBhcmFtZXRlcnModkxpbmZvLnZoUGFyYW1ldGVycykubWFwKChpblBhcmFtOiBhbnkpID0+IGluUGFyYW0uaGVscFBhdGgpLFxuXHRcdFx0XHRcdG91dFBhcmFtZXRlcnM6XG5cdFx0XHRcdFx0XHR2TGluZm8udmhQYXJhbWV0ZXJzICYmXG5cdFx0XHRcdFx0XHRWYWx1ZUxpc3RIZWxwZXIuZ2V0T3V0UGFyYW1ldGVycyh2TGluZm8udmhQYXJhbWV0ZXJzKS5tYXAoKG91dFBhcmFtOiBhbnkpID0+IG91dFBhcmFtLmhlbHBQYXRoKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRmaWVsZEluZm9Nb2RlbC5zZXRQcm9wZXJ0eShgJHtwcm9wUGF0aH0ke3Byb3BlcnR5TmFtZX0vdmFsdWVMaXN0SW5mb2AsIGluZm8pO1xuXHRcdFx0XHRpZiAoaW5mby5vdXRQYXJhbWV0ZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRNYXNzRWRpdEhhbmRsZXJzLl91cGRhdGVGaWVsZFBhdGhTdWdnZXN0aW9ucyhmaWVsZEluZm9Nb2RlbCwgYC92YWx1ZXMvJHtwcm9wZXJ0eU5hbWV9YCwgZmFsc2UsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKCgpID0+IHtcblx0XHRcdFx0TG9nLndhcm5pbmcoYE1hc3MgRWRpdDogQ291bGRuJ3QgbG9hZCB2YWx1ZUxpc3QgaW5mbyBmb3IgJHtwcm9wZXJ0eVBhdGh9YCk7XG5cdFx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IGZpZWxkIGhlbHAgY29udHJvbCBmcm9tIE1EQyBmaWVsZC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSB0cmFuc0N0eCBUaGUgdHJhbnNpZW50IGNvbnRleHQgb2YgdGhlIE1FRC5cblx0ICogQHBhcmFtIHNvdXJjZSBNREMgZmllbGQuXG5cdCAqIEByZXR1cm5zIEZpZWxkIEhlbHAgY29udHJvbC5cblx0ICovXG5cdF9nZXRWYWx1ZUhlbHA6IGZ1bmN0aW9uICh0cmFuc0N0eDogQ29udGV4dCwgc291cmNlOiBGaWVsZCk6IGFueSB7XG5cdFx0Y29uc3QgZGVwZW5kZW50cyA9IHNvdXJjZT8uZ2V0RGVwZW5kZW50cygpO1xuXHRcdGNvbnN0IGZpZWxkSGVscCA9IHNvdXJjZT8uZ2V0RmllbGRIZWxwKCk7XG5cdFx0cmV0dXJuIGRlcGVuZGVudHM/LmZpbmQoKGRlcGVuZGVudDogYW55KSA9PiBkZXBlbmRlbnQuZ2V0SWQoKSA9PT0gZmllbGRIZWxwKTtcblx0fSxcblxuXHQvKipcblx0ICogQ29sbGVkIG9uIGRyb3AgZG93biBzZWxlY3Rpb24gb2YgVkhEIG9wdGlvbi5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBzb3VyY2UgQ3VzdG9tIE1hc3MgRWRpdCBTZWxlY3QgY29udHJvbC5cblx0ICogQHBhcmFtIHByb3BlcnR5TmFtZSBQcm9wZXJ0eSBwYXRoLlxuXHQgKiBAcGFyYW0gc2VsZWN0S2V5IFByZXZpb3VzIGtleSBiZWZvcmUgdGhlIFZIRCB3YXMgc2VsZWN0ZWQuXG5cdCAqL1xuXHRfb25WSFNlbGVjdDogZnVuY3Rpb24gKHNvdXJjZTogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgc2VsZWN0S2V5OiBzdHJpbmcpOiB2b2lkIHtcblx0XHQvLyBDYWxsZWQgZm9yXG5cdFx0Ly8gMS4gVkhEIHNlbGVjdGVkLlxuXG5cdFx0Y29uc3QgZmllbGRJbmZvTW9kZWwgPSBzb3VyY2UgJiYgc291cmNlLmdldE1vZGVsKFwiZmllbGRzSW5mb1wiKTtcblx0XHRjb25zdCBwcm9wUGF0aCA9XG5cdFx0XHQoZmllbGRJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYC92YWx1ZXMvJHtwcm9wZXJ0eU5hbWV9YCkgJiYgXCIvdmFsdWVzL1wiKSB8fFxuXHRcdFx0KGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdW5pdERhdGEvJHtwcm9wZXJ0eU5hbWV9YCkgJiYgXCIvdW5pdERhdGEvXCIpO1xuXHRcdGNvbnN0IHRyYW5zQ3R4ID0gc291cmNlLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0Y29uc3QgZmllbGRWYWx1ZUhlbHAgPSBNYXNzRWRpdEhhbmRsZXJzLl9nZXRWYWx1ZUhlbHAodHJhbnNDdHgsIHNvdXJjZS5nZXRQYXJlbnQoKSk7XG5cdFx0aWYgKCFmaWVsZFZhbHVlSGVscD8uZ2V0QmluZGluZ0NvbnRleHQoKSkge1xuXHRcdFx0ZmllbGRWYWx1ZUhlbHA/LnNldEJpbmRpbmdDb250ZXh0KHRyYW5zQ3R4KTtcblx0XHR9XG5cdFx0c291cmNlLmZpcmVWYWx1ZUhlbHBSZXF1ZXN0KCk7XG5cblx0XHRmaWVsZEluZm9Nb2RlbC5zZXRQcm9wZXJ0eShgJHtwcm9wUGF0aCArIHByb3BlcnR5TmFtZX0vc2VsZWN0ZWRLZXlgLCBzZWxlY3RLZXkpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXRzIFByb3BlcnR5IG5hbWUgZnJvbSBzZWxlY3Rpb24ga2V5LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIGtleSBTZWxlY3Rpb24ga2V5LlxuXHQgKiBAcmV0dXJucyBQcm9wZXJ0eSBuYW1lLlxuXHQgKi9cblx0X2dldFByb3BlcnR5TmFtZUZyb21LZXk6IGZ1bmN0aW9uIChrZXk6IHN0cmluZykge1xuXHRcdGxldCBwcm9wZXJ0eU5hbWUgPSBcIlwiO1xuXHRcdGlmIChrZXkuc3RhcnRzV2l0aChcIkRlZmF1bHQvXCIpIHx8IGtleS5zdGFydHNXaXRoKFwiQ2xlYXJGaWVsZFZhbHVlL1wiKSB8fCBrZXkuc3RhcnRzV2l0aChcIlVzZVZhbHVlSGVscFZhbHVlL1wiKSkge1xuXHRcdFx0cHJvcGVydHlOYW1lID0ga2V5LnN1YnN0cmluZyhrZXkuaW5kZXhPZihcIi9cIikgKyAxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJvcGVydHlOYW1lID0ga2V5LnN1YnN0cmluZygwLCBrZXkubGFzdEluZGV4T2YoXCIvXCIpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHByb3BlcnR5TmFtZTtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIHNlbGVjdGlvbiB0byBDdXN0b20gTWFzcyBFZGl0IFNlbGVjdCBmcm9tIE1EQyBmaWVsZC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBzb3VyY2UgTURDIGZpZWxkLlxuXHQgKiBAcGFyYW0gcHJvcGVydHlOYW1lIFByb3BlcnR5IHBhdGguXG5cdCAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB1cGRhdGUuXG5cdCAqIEBwYXJhbSBmdWxsVGV4dCBGdWxsIHRleHQgdG8gdXNlLlxuXHQgKi9cblx0X3VwZGF0ZVNlbGVjdEtleTogZnVuY3Rpb24gKHNvdXJjZTogRmllbGQsIHByb3BlcnR5TmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBmdWxsVGV4dD86IGFueSk6IHZvaWQge1xuXHRcdC8vIENhbGxlZCBmb3Jcblx0XHQvLyAxLiBWSEQgcHJvcGVydHkgY2hhbmdlXG5cdFx0Ly8gMi4gT3V0IFBhcmFtZXRlcnMuXG5cdFx0Ly8gMy4gVHJhbnNpZW50IGNvbnRleHQgcHJvcGVydHkgY2hhbmdlLlxuXG5cdFx0Y29uc3QgY29tYm9Cb3ggPSBzb3VyY2UuZ2V0Q29udGVudCgpIGFzIENvbWJvQm94O1xuXHRcdGlmICghY29tYm9Cb3ggfHwgIXByb3BlcnR5TmFtZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQga2V5OiBzdHJpbmcgPSBjb21ib0JveC5nZXRTZWxlY3RlZEtleSgpO1xuXHRcdGlmICgoa2V5LnN0YXJ0c1dpdGgoXCJEZWZhdWx0L1wiKSB8fCBrZXkuc3RhcnRzV2l0aChcIkNsZWFyRmllbGRWYWx1ZS9cIikpICYmICF2YWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvcm1hdHRlZFRleHQgPSBNYXNzRWRpdEhhbmRsZXJzLl92YWx1ZUV4aXN0cyhmdWxsVGV4dCkgPyBmdWxsVGV4dCA6IHZhbHVlO1xuXHRcdGNvbnN0IGZpZWxkSW5mb01vZGVsID0gc291cmNlICYmIChzb3VyY2UuZ2V0TW9kZWwoXCJmaWVsZHNJbmZvXCIpIGFzIEpTT05Nb2RlbCk7XG5cdFx0Y29uc3QgdmFsdWVzID1cblx0XHRcdGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApIHx8IGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdW5pdERhdGEvJHtwcm9wZXJ0eU5hbWV9YCkgfHwgW107XG5cdFx0Y29uc3QgcHJvcFBhdGggPVxuXHRcdFx0KGZpZWxkSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApICYmIFwiL3ZhbHVlcy9cIikgfHxcblx0XHRcdChmaWVsZEluZm9Nb2RlbC5nZXRQcm9wZXJ0eShgL3VuaXREYXRhLyR7cHJvcGVydHlOYW1lfWApICYmIFwiL3VuaXREYXRhL1wiKTtcblxuXHRcdGNvbnN0IHJlbGF0ZWRGaWVsZCA9IHZhbHVlcy5maW5kKChmaWVsZERhdGE6IGFueSkgPT4gZmllbGREYXRhPy50ZXh0SW5mbz8udmFsdWUgPT09IHZhbHVlIHx8IGZpZWxkRGF0YS50ZXh0ID09PSB2YWx1ZSk7XG5cblx0XHRpZiAocmVsYXRlZEZpZWxkKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGZ1bGxUZXh0ICYmXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZC50ZXh0SW5mbyAmJlxuXHRcdFx0XHRyZWxhdGVkRmllbGQudGV4dEluZm8uZGVzY3JpcHRpb25QYXRoICYmXG5cdFx0XHRcdChyZWxhdGVkRmllbGQudGV4dCAhPSBmb3JtYXR0ZWRUZXh0IHx8IHJlbGF0ZWRGaWVsZC50ZXh0SW5mby5mdWxsVGV4dCAhPSBmb3JtYXR0ZWRUZXh0KVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgZnVsbCB0ZXh0IG9ubHkgd2hlbiBwcm92aWRlZC5cblx0XHRcdFx0cmVsYXRlZEZpZWxkLnRleHQgPSBmb3JtYXR0ZWRUZXh0O1xuXHRcdFx0XHRyZWxhdGVkRmllbGQudGV4dEluZm8uZnVsbFRleHQgPSBmb3JtYXR0ZWRUZXh0O1xuXHRcdFx0XHRyZWxhdGVkRmllbGQudGV4dEluZm8uZGVzY3JpcHRpb24gPSBzb3VyY2UuZ2V0QWRkaXRpb25hbFZhbHVlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVsYXRlZEZpZWxkLmtleSA9PT0ga2V5KSB7XG5cdFx0XHRcdGZpZWxkSW5mb01vZGVsLnNldFByb3BlcnR5KGAke3Byb3BQYXRoICsgcHJvcGVydHlOYW1lfS9zZWxlY3RlZEtleWAsIGtleSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGtleSA9IHJlbGF0ZWRGaWVsZC5rZXk7XG5cdFx0fSBlbHNlIGlmIChbdW5kZWZpbmVkLCBudWxsLCBcIlwiXS5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcblx0XHRcdGtleSA9IGAke3Byb3BlcnR5TmFtZX0vJHt2YWx1ZX1gO1xuXHRcdFx0Y29uc3Qgc2VsZWN0aW9uSW5mbyA9IHtcblx0XHRcdFx0dGV4dDogZm9ybWF0dGVkVGV4dCxcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR0ZXh0SW5mbzoge1xuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBzb3VyY2UuZ2V0QWRkaXRpb25hbFZhbHVlKCksXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25QYXRoOiB2YWx1ZXMgJiYgdmFsdWVzLnRleHRJbmZvICYmIHZhbHVlcy50ZXh0SW5mby5kZXNjcmlwdGlvblBhdGgsXG5cdFx0XHRcdFx0ZnVsbFRleHQ6IGZvcm1hdHRlZFRleHQsXG5cdFx0XHRcdFx0dGV4dEFycmFuZ2VtZW50OiBzb3VyY2UuZ2V0RGlzcGxheSgpLFxuXHRcdFx0XHRcdHZhbHVlOiBzb3VyY2UuZ2V0VmFsdWUoKSxcblx0XHRcdFx0XHR2YWx1ZVBhdGg6IHByb3BlcnR5TmFtZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0dmFsdWVzLnB1c2goc2VsZWN0aW9uSW5mbyk7XG5cdFx0XHR2YWx1ZXMuc2VsZWN0T3B0aW9ucyA9IHZhbHVlcy5zZWxlY3RPcHRpb25zIHx8IFtdO1xuXHRcdFx0dmFsdWVzLnNlbGVjdE9wdGlvbnMucHVzaChzZWxlY3Rpb25JbmZvKTtcblx0XHRcdGZpZWxkSW5mb01vZGVsLnNldFByb3BlcnR5KHByb3BQYXRoICsgcHJvcGVydHlOYW1lLCB2YWx1ZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRrZXkgPSBgRGVmYXVsdC8ke3Byb3BlcnR5TmFtZX1gO1xuXHRcdH1cblxuXHRcdGZpZWxkSW5mb01vZGVsLnNldFByb3BlcnR5KGAke3Byb3BQYXRoICsgcHJvcGVydHlOYW1lfS9zZWxlY3RlZEtleWAsIGtleSk7XG5cdFx0TWFzc0VkaXRIYW5kbGVycy5fdXBkYXRlUmVzdWx0cyhjb21ib0JveCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBWYWx1ZSBmcm9tIERyb3AgZG93bi5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBzb3VyY2UgRHJvcCBkb3duIGNvbnRyb2wuXG5cdCAqIEByZXR1cm5zIFZhbHVlIG9mIHNlbGVjdGlvbi5cblx0ICovXG5cdF9nZXRWYWx1ZTogZnVuY3Rpb24gKHNvdXJjZTogQ29udHJvbCkge1xuXHRcdHJldHVybiBzb3VyY2UuZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCkgPT09IFwic2FwLmZlLmNvcmUuY29udHJvbHMuTWFzc0VkaXRTZWxlY3RcIlxuXHRcdFx0PyAoc291cmNlIGFzIFNlbGVjdCkuZ2V0U2VsZWN0ZWRJdGVtKCk/LmdldFRleHQoKVxuXHRcdFx0OiAoc291cmNlIGFzIENvbWJvQm94KS5nZXRWYWx1ZSgpO1xuXHR9LFxuXG5cdF9nZXRWYWx1ZU9uRW1wdHk6IGZ1bmN0aW9uIChvU291cmNlOiBhbnksIGZpZWxkc0luZm9Nb2RlbDogSlNPTk1vZGVsLCB2YWx1ZTogYW55LCBzUHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcblx0XHRpZiAoIXZhbHVlKSB7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPVxuXHRcdFx0XHRmaWVsZHNJbmZvTW9kZWwuZ2V0UHJvcGVydHkoYC92YWx1ZXMvJHtzUHJvcGVydHlOYW1lfWApIHx8IGZpZWxkc0luZm9Nb2RlbC5nZXRQcm9wZXJ0eShgL3VuaXREYXRhLyR7c1Byb3BlcnR5TmFtZX1gKSB8fCBbXTtcblx0XHRcdGlmICh2YWx1ZXMudW5pdFByb3BlcnR5KSB7XG5cdFx0XHRcdHZhbHVlID0gMDtcblx0XHRcdFx0b1NvdXJjZS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHZhbHVlcy5pbnB1dFR5cGUgPT09IFwiQ2hlY2tCb3hcIikge1xuXHRcdFx0XHR2YWx1ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH0sXG5cblx0X3ZhbHVlRXhpc3RzOiBmdW5jdGlvbiAodmFsdWU6IGFueSkge1xuXHRcdHJldHVybiB2YWx1ZSAhPSB1bmRlZmluZWQgJiYgdmFsdWUgIT0gbnVsbDtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlcyBzZWxlY3Rpb25zIHRvIHJ1bnRpbWUgbW9kZWwuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gb1NvdXJjZSBEcm9wIGRvd24gY29udHJvbC5cblx0ICogQHBhcmFtIGFQYXJhbXMgUGFydHMgb2Yga2V5IGluIHJ1bnRpbWUgbW9kZWwuXG5cdCAqIEBwYXJhbSB1cGRhdGVUcmFuc0N0eCBTaG91bGQgdHJhbnNpZW50IGNvbnRleHQgYmUgdXBkYXRlZCB3aXRoIHRoZSB2YWx1ZS5cblx0ICovXG5cdF91cGRhdGVSZXN1bHRzOiBmdW5jdGlvbiAob1NvdXJjZTogYW55LCBhUGFyYW1zOiBBcnJheTxzdHJpbmc+ID0gW10sIHVwZGF0ZVRyYW5zQ3R4OiBib29sZWFuKSB7XG5cdFx0Ly8gQ2FsbGVkIGZvclxuXHRcdC8vIDEuIFZIRCBwcm9wZXJ0eSBjaGFuZ2UuXG5cdFx0Ly8gMi4gT3V0IHBhcmFtZXRlci5cblx0XHQvLyAzLiB0cmFuc2llbnQgY29udGV4dCBwcm9wZXJ0eSBjaGFuZ2UuXG5cdFx0Y29uc3QgZmllbGRzSW5mb01vZGVsID0gb1NvdXJjZSAmJiBvU291cmNlLmdldE1vZGVsKFwiZmllbGRzSW5mb1wiKTtcblx0XHRjb25zdCBvRmllbGRzSW5mb0RhdGEgPSBmaWVsZHNJbmZvTW9kZWwgJiYgZmllbGRzSW5mb01vZGVsLmdldERhdGEoKTtcblx0XHRsZXQgdmFsdWUgPSBNYXNzRWRpdEhhbmRsZXJzLl9nZXRWYWx1ZShvU291cmNlIGFzIENvbnRyb2wpO1xuXHRcdGFQYXJhbXMgPSBhUGFyYW1zLmxlbmd0aCA+IDAgPyBhUGFyYW1zIDogb1NvdXJjZSAmJiBvU291cmNlLmdldFNlbGVjdGVkS2V5KCkgJiYgb1NvdXJjZS5nZXRTZWxlY3RlZEtleSgpLnNwbGl0KFwiL1wiKTtcblxuXHRcdGxldCBvRGF0YU9iamVjdDtcblx0XHRjb25zdCBzUHJvcGVydHlOYW1lID0gb1NvdXJjZS5kYXRhKFwiZmllbGRQYXRoXCIpO1xuXG5cdFx0aWYgKGFQYXJhbXNbMF0gPT09IFwiRGVmYXVsdFwiKSB7XG5cdFx0XHRvRGF0YU9iamVjdCA9IHtcblx0XHRcdFx0a2V5VmFsdWU6IGFQYXJhbXNbMV0sXG5cdFx0XHRcdHZhbHVlOiBhUGFyYW1zWzBdXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoYVBhcmFtc1swXSA9PT0gXCJDbGVhckZpZWxkVmFsdWVcIikge1xuXHRcdFx0dmFsdWUgPSBcIlwiO1xuXHRcdFx0dmFsdWUgPSBNYXNzRWRpdEhhbmRsZXJzLl9nZXRWYWx1ZU9uRW1wdHkob1NvdXJjZSwgZmllbGRzSW5mb01vZGVsLCB2YWx1ZSwgc1Byb3BlcnR5TmFtZSk7XG5cdFx0XHRvRGF0YU9iamVjdCA9IHtcblx0XHRcdFx0a2V5VmFsdWU6IGFQYXJhbXNbMV0sXG5cdFx0XHRcdHZhbHVlOiB2YWx1ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKCFhUGFyYW1zKSB7XG5cdFx0XHR2YWx1ZSA9IE1hc3NFZGl0SGFuZGxlcnMuX2dldFZhbHVlT25FbXB0eShvU291cmNlLCBmaWVsZHNJbmZvTW9kZWwsIHZhbHVlLCBzUHJvcGVydHlOYW1lKTtcblx0XHRcdG9EYXRhT2JqZWN0ID0ge1xuXHRcdFx0XHRrZXlWYWx1ZTogc1Byb3BlcnR5TmFtZSxcblx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBhUGFyYW1zLnNsaWNlKDAsIC0xKS5qb2luKFwiL1wiKTtcblx0XHRcdGNvbnN0IHByb3BlcnR5VmFsdWVzID1cblx0XHRcdFx0ZmllbGRzSW5mb01vZGVsLmdldFByb3BlcnR5KGAvdmFsdWVzLyR7cHJvcGVydHlOYW1lfWApIHx8IGZpZWxkc0luZm9Nb2RlbC5nZXRQcm9wZXJ0eShgL3VuaXREYXRhLyR7cHJvcGVydHlOYW1lfWApIHx8IFtdO1xuXG5cdFx0XHRjb25zdCByZWxhdGVkRmllbGQgPSAocHJvcGVydHlWYWx1ZXMgfHwgW10pLmZpbmQoZnVuY3Rpb24gKG9GaWVsZERhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gb0ZpZWxkRGF0YT8udGV4dEluZm8/LnZhbHVlID09PSB2YWx1ZSB8fCBvRmllbGREYXRhLnRleHQgPT09IHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0XHRvRGF0YU9iamVjdCA9IHtcblx0XHRcdFx0a2V5VmFsdWU6IHByb3BlcnR5TmFtZSxcblx0XHRcdFx0dmFsdWU6XG5cdFx0XHRcdFx0cmVsYXRlZEZpZWxkLnRleHRJbmZvICYmIE1hc3NFZGl0SGFuZGxlcnMuX3ZhbHVlRXhpc3RzKHJlbGF0ZWRGaWVsZC50ZXh0SW5mby52YWx1ZSlcblx0XHRcdFx0XHRcdD8gcmVsYXRlZEZpZWxkLnRleHRJbmZvLnZhbHVlXG5cdFx0XHRcdFx0XHQ6IHJlbGF0ZWRGaWVsZC50ZXh0XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRsZXQgYkV4aXN0aW5nRWxlbWVudGluZGV4ID0gLTE7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvRmllbGRzSW5mb0RhdGEucmVzdWx0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKG9GaWVsZHNJbmZvRGF0YS5yZXN1bHRzW2ldLmtleVZhbHVlID09PSBvRGF0YU9iamVjdC5rZXlWYWx1ZSkge1xuXHRcdFx0XHRiRXhpc3RpbmdFbGVtZW50aW5kZXggPSBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoYkV4aXN0aW5nRWxlbWVudGluZGV4ICE9PSAtMSkge1xuXHRcdFx0b0ZpZWxkc0luZm9EYXRhLnJlc3VsdHNbYkV4aXN0aW5nRWxlbWVudGluZGV4XSA9IG9EYXRhT2JqZWN0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvRmllbGRzSW5mb0RhdGEucmVzdWx0cy5wdXNoKG9EYXRhT2JqZWN0KTtcblx0XHR9XG5cdFx0aWYgKHVwZGF0ZVRyYW5zQ3R4ICYmICFvRGF0YU9iamVjdC5rZXlWYWx1ZS5pbmNsdWRlcyhcIi9cIikpIHtcblx0XHRcdGNvbnN0IHRyYW5zQ3R4ID0gb1NvdXJjZS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdFx0aWYgKGFQYXJhbXNbMF0gPT09IFwiRGVmYXVsdFwiIHx8IGFQYXJhbXNbMF0gPT09IFwiQ2xlYXJGaWVsZFZhbHVlXCIpIHtcblx0XHRcdFx0dHJhbnNDdHguc2V0UHJvcGVydHkob0RhdGFPYmplY3Qua2V5VmFsdWUsIG51bGwpO1xuXHRcdFx0fSBlbHNlIGlmIChvRGF0YU9iamVjdCkge1xuXHRcdFx0XHR0cmFuc0N0eC5zZXRQcm9wZXJ0eShvRGF0YU9iamVjdC5rZXlWYWx1ZSwgb0RhdGFPYmplY3QudmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgTWFzc0VkaXRIYW5kbGVycztcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQXVCQSxJQUFNQSxnQkFBcUIsR0FBRztJQUM3QjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0NDLHFCQUFxQixFQUFFLFVBQVVDLFFBQVYsRUFBeUJDLFlBQXpCLEVBQStDQyxVQUEvQyxFQUFtRTtNQUN6RjtNQUNBO01BQ0E7TUFFQSxJQUFNQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVSCxVQUFWLENBQWY7TUFDQSxJQUFNSSxRQUFRLEdBQUdILE1BQU0sSUFBS0EsTUFBTSxDQUFDSSxpQkFBUCxFQUE1QjtNQUNBLElBQU1DLGNBQWMsR0FBR0wsTUFBTSxJQUFLQSxNQUFNLENBQUNNLFFBQVAsQ0FBZ0IsWUFBaEIsQ0FBbEM7TUFDQSxJQUFNQyxNQUFN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