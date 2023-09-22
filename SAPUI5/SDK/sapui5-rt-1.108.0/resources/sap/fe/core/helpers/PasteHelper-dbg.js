/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/m/MessageBox", "sap/ui/core/Core", "sap/ui/core/util/PasteHelper"], function (Log, MessageBox, Core, CorePasteHelper) {
  "use strict";

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var getInfoForEntityProperty = function (propertyPath, rowBindingPath, metaContext, metaModel) {
    var property = metaContext.getProperty(propertyPath),
        formatOptions = {
      parseKeepsEmptyString: true
    },
        type = metaModel.getUI5Type("".concat(rowBindingPath, "/").concat(propertyPath), formatOptions),
        isIgnored = !property || metaContext.getProperty("".concat(propertyPath, "@Org.OData.Core.V1.Computed"));
    return {
      property: propertyPath,
      ignore: isIgnored,
      type: type
    };
  };

  var displayErrorMessages = function (errorMessages) {
    var messageDetails = _toConsumableArray(errorMessages);

    var resourceBundle = Core.getLibraryResourceBundle("sap.fe.core"),
        errorCorrectionMessage = resourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_CORRECTION_MESSAGE"),
        noteMessage = resourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_CORRECTION_NOTE");
    var pasteErrorMessage;

    if (messageDetails.length > 1) {
      pasteErrorMessage = resourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_MESSAGE_PLURAL", [messageDetails.length]);
    } else {
      pasteErrorMessage = resourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_MESSAGE_SINGULAR");
    }

    messageDetails.unshift(""); // To show space between the short text and the list of errors

    messageDetails.unshift(noteMessage);
    messageDetails.unshift(errorCorrectionMessage);
    MessageBox.error(pasteErrorMessage, {
      title: resourceBundle.getText("C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_TITLE_ERROR"),
      details: messageDetails.join("<br>")
    });
  };

  var PasteHelper = {
    displayErrorMessages: displayErrorMessages,
    formatCustomMessage: function (validationMessages, iRowNumber) {
      var errorMessage = "";
      var numberMessages = validationMessages.length;
      var resourceBundle = Core.getLibraryResourceBundle("sap.fe.core"),
          i18nRow = resourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_ROW");

      if (numberMessages > 0) {
        errorMessage += "".concat(i18nRow, " ").concat(iRowNumber, ": ");
        validationMessages.forEach(function (message, indexMessage) {
          if (message.messageText) {
            errorMessage += message.messageText + (indexMessage + 1 !== numberMessages ? " " : "");
          }
        });
      }

      return errorMessage;
    },
    getColumnInfo: function (table) {
      var _this = this;

      var model = table.getRowBinding().getModel(),
          metaModel = model.getMetaModel(),
          rowBindingPath = model.resolve(table.getRowBinding().getPath(), table.getRowBinding().getContext()),
          metaContext = metaModel.getMetaContext(rowBindingPath);
      return table.getControlDelegate().fetchProperties(table).then(function (propertyInfo) {
        var PropertyInfoDict = Object.assign.apply(Object, [{}].concat(_toConsumableArray(propertyInfo.map(function (property) {
          return _defineProperty({}, property.name, property);
        }))));
        var columnInfos = [];
        table.getColumns().forEach(function (column) {
          var infoProperty = PropertyInfoDict[column.getDataProperty()]; // Check if it's a complex property (property associated to multiple simple properties)

          if (infoProperty.propertyInfos) {
            // Get data from simple property
            infoProperty.propertyInfos.forEach(function (property) {
              var dataProperty = PropertyInfoDict[property]; // Check if there is a simple property associated to a Rating or Progress ComplexProperty --> ignore
              // Or check a navigation property within the current Complex property --> ignore
              // A fake property was created into the propertyInfos to include the Target Value
              // from the DataPoint (path includes the @com.sap.vocabularies.UI.v1.DataPoint annotation)

              if (dataProperty && dataProperty.path.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 || property.indexOf("/") > -1) {
                columnInfos.push({
                  property: dataProperty.path,
                  ignore: true
                });
              } else {
                columnInfos.push(_this.getInfoForEntityProperty(dataProperty.path, rowBindingPath, metaContext, metaModel));
              }
            });
          } else if (infoProperty.path) {
            columnInfos.push(_this.getInfoForEntityProperty(infoProperty.path, rowBindingPath, metaContext, metaModel));
          } else {
            // Empty column --> ignore
            columnInfos.push({
              property: "unused",
              type: null,
              ignore: true
            });
          }
        });
        return columnInfos;
      });
    },
    getInfoForEntityProperty: getInfoForEntityProperty,
    parsePastedData: function (rawData, table) {
      var _this2 = this;

      return this.getColumnInfo(table).then(function (pasteInfos) {
        // Check if we have data for at least the first editable column
        var pastedColumnCount = rawData.length ? rawData[0].length : 0;
        var firstEditableColumnIndex = -1;

        for (var I = 0; I < pasteInfos.length && firstEditableColumnIndex < 0; I++) {
          if (!pasteInfos[I].ignore) {
            firstEditableColumnIndex = I;
          }
        }

        return firstEditableColumnIndex < 0 || firstEditableColumnIndex > pastedColumnCount - 1 ? Promise.resolve({}) // We don't have data for an editable column --> return empty parsed data
        : CorePasteHelper.parse(rawData, pasteInfos);
      }).then(function (parseResult) {
        if (parseResult.errors) {
          var errorMessages = parseResult.errors.map(function (oElement) {
            return oElement.message;
          });

          _this2.displayErrorMessages(errorMessages);

          return []; // Errors --> return nothing
        } else {
          return parseResult.parsedData ? parseResult.parsedData : [];
        }
      });
    },
    pasteData: function (rawData, table, controller) {
      var _this3 = this;

      var oInternalEditFlow = controller._editFlow;
      var tableDefinition = table.getParent().getTableDefinition();
      var aData = [];
      return this.parsePastedData(rawData, table).then(function (aParsedData) {
        aData = aParsedData || [];
        return Promise.all(aData.map(function (mData) {
          var _tableDefinition$cont;

          return oInternalEditFlow.getTransactionHelper().validateDocument(table.getBindingContext(), {
            data: mData,
            customValidationFunction: tableDefinition === null || tableDefinition === void 0 ? void 0 : (_tableDefinition$cont = tableDefinition.control) === null || _tableDefinition$cont === void 0 ? void 0 : _tableDefinition$cont.customValidationFunction
          }, controller.getView());
        }));
      }).then(function (aValidationMessages) {
        var aErrorMessages = aValidationMessages.reduce(function (aMessages, aCustomMessages, index) {
          if (aCustomMessages.length > 0) {
            aMessages.push({
              messages: aCustomMessages,
              row: index + 1
            });
          }

          return aMessages;
        }, []);

        if (aErrorMessages.length > 0) {
          var aRowMessages = aErrorMessages.map(function (mError) {
            return _this3.formatCustomMessage(mError.messages, mError.row);
          });

          _this3.displayErrorMessages(aRowMessages);

          return [];
        }

        return aData;
      }).then(function (aValidatedData) {
        var _tableDefinition$cont2;

        return aValidatedData.length > 0 ? oInternalEditFlow.createMultipleDocuments(table.getRowBinding(), aValidatedData, tableDefinition === null || tableDefinition === void 0 ? void 0 : (_tableDefinition$cont2 = tableDefinition.control) === null || _tableDefinition$cont2 === void 0 ? void 0 : _tableDefinition$cont2.createAtEnd, true, controller.editFlow.onBeforeCreate) : undefined;
      }).catch(function (oError) {
        Log.error("Error while pasting data", oError);
      });
    }
  };
  return PasteHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRJbmZvRm9yRW50aXR5UHJvcGVydHkiLCJwcm9wZXJ0eVBhdGgiLCJyb3dCaW5kaW5nUGF0aCIsIm1ldGFDb250ZXh0IiwibWV0YU1vZGVsIiwicHJvcGVydHkiLCJnZXRQcm9wZXJ0eSIsImZvcm1hdE9wdGlvbnMiLCJwYXJzZUtlZXBzRW1wdHlTdHJpbmciLCJ0eXBlIiwiZ2V0VUk1VHlwZSIsImlzSWdub3JlZCIsImlnbm9yZSIsImRpc3BsYXlFcnJvck1lc3NhZ2VzIiwiZXJyb3JNZXNzYWdlcyIsIm1lc3NhZ2VEZXRhaWxzIiwicmVzb3VyY2VCdW5kbGUiLCJDb3JlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiZXJyb3JDb3JyZWN0aW9uTWVzc2FnZSIsImdldFRleHQiLCJub3RlTWVzc2FnZSIsInBhc3RlRXJyb3JNZXNzYWdlIiwibGVuZ3RoIiwidW5zaGlmdCIsIk1lc3NhZ2VCb3giLCJlcnJvciIsInRpdGxlIiwiZGV0YWlscyIsImpvaW4iLCJQYXN0ZUhlbHBlciIsImZvcm1hdEN1c3RvbU1lc3NhZ2UiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpUm93TnVtYmVyIiwiZXJyb3JNZXNzYWdlIiwibnVtYmVyTWVzc2FnZXMiLCJpMThuUm93IiwiZm9yRWFjaCIsIm1lc3NhZ2UiLCJpbmRleE1lc3NhZ2UiLCJtZXNzYWdlVGV4dCIsImdldENvbHVtbkluZm8iLCJ0YWJsZSIsIm1vZGVsIiwiZ2V0Um93QmluZGluZyIsImdldE1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwicmVzb2x2ZSIsImdldFBhdGgiLCJnZXRDb250ZXh0IiwiZ2V0TWV0YUNvbnRleHQiLCJnZXRDb250cm9sRGVsZWdhdGUiLCJmZXRjaFByb3BlcnRpZXMiLCJ0aGVuIiwicHJvcGVydHlJbmZvIiwiUHJvcGVydHlJbmZvRGljdCIsIk9iamVjdCIsImFzc2lnbiIsIm1hcCIsIm5hbWUiLCJjb2x1bW5JbmZvcyIsImdldENvbHVtbnMiLCJjb2x1bW4iLCJpbmZvUHJvcGVydHkiLCJnZXREYXRhUHJvcGVydHkiLCJwcm9wZXJ0eUluZm9zIiwiZGF0YVByb3BlcnR5IiwicGF0aCIsImluZGV4T2YiLCJwdXNoIiwicGFyc2VQYXN0ZWREYXRhIiwicmF3RGF0YSIsInBhc3RlSW5mb3MiLCJwYXN0ZWRDb2x1bW5Db3VudCIsImZpcnN0RWRpdGFibGVDb2x1bW5JbmRleCIsIkkiLCJQcm9taXNlIiwiQ29yZVBhc3RlSGVscGVyIiwicGFyc2UiLCJwYXJzZVJlc3VsdCIsImVycm9ycyIsIm9FbGVtZW50IiwicGFyc2VkRGF0YSIsInBhc3RlRGF0YSIsImNvbnRyb2xsZXIiLCJvSW50ZXJuYWxFZGl0RmxvdyIsIl9lZGl0RmxvdyIsInRhYmxlRGVmaW5pdGlvbiIsImdldFBhcmVudCIsImdldFRhYmxlRGVmaW5pdGlvbiIsImFEYXRhIiwiYVBhcnNlZERhdGEiLCJhbGwiLCJtRGF0YSIsImdldFRyYW5zYWN0aW9uSGVscGVyIiwidmFsaWRhdGVEb2N1bWVudCIsImdldEJpbmRpbmdDb250ZXh0IiwiZGF0YSIsImN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbiIsImNvbnRyb2wiLCJnZXRWaWV3IiwiYVZhbGlkYXRpb25NZXNzYWdlcyIsImFFcnJvck1lc3NhZ2VzIiwicmVkdWNlIiwiYU1lc3NhZ2VzIiwiYUN1c3RvbU1lc3NhZ2VzIiwiaW5kZXgiLCJtZXNzYWdlcyIsInJvdyIsImFSb3dNZXNzYWdlcyIsIm1FcnJvciIsImFWYWxpZGF0ZWREYXRhIiwiY3JlYXRlTXVsdGlwbGVEb2N1bWVudHMiLCJjcmVhdGVBdEVuZCIsImVkaXRGbG93Iiwib25CZWZvcmVDcmVhdGUiLCJ1bmRlZmluZWQiLCJjYXRjaCIsIm9FcnJvciIsIkxvZyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiUGFzdGVIZWxwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBNZXNzYWdlQm94IGZyb20gXCJzYXAvbS9NZXNzYWdlQm94XCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0ICogYXMgQ29yZVBhc3RlSGVscGVyIGZyb20gXCJzYXAvdWkvY29yZS91dGlsL1Bhc3RlSGVscGVyXCI7XG5cbmV4cG9ydCB0eXBlIGN1c3RvbVZhbGlkYXRpb25NZXNzYWdlID0ge1xuXHRtZXNzYWdlVGV4dD86IHN0cmluZztcblx0bWVzc2FnZVRhcmdldD86IHN0cmluZztcbn07XG5cbmNvbnN0IGdldEluZm9Gb3JFbnRpdHlQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eVBhdGg6IGFueSwgcm93QmluZGluZ1BhdGg6IGFueSwgbWV0YUNvbnRleHQ6IGFueSwgbWV0YU1vZGVsOiBhbnkpOiBhbnkge1xuXHRjb25zdCBwcm9wZXJ0eSA9IG1ldGFDb250ZXh0LmdldFByb3BlcnR5KHByb3BlcnR5UGF0aCksXG5cdFx0Zm9ybWF0T3B0aW9ucyA9IHsgcGFyc2VLZWVwc0VtcHR5U3RyaW5nOiB0cnVlIH0sXG5cdFx0dHlwZSA9IG1ldGFNb2RlbC5nZXRVSTVUeXBlKGAke3Jvd0JpbmRpbmdQYXRofS8ke3Byb3BlcnR5UGF0aH1gLCBmb3JtYXRPcHRpb25zKSxcblx0XHRpc0lnbm9yZWQgPSAhcHJvcGVydHkgfHwgbWV0YUNvbnRleHQuZ2V0UHJvcGVydHkoYCR7cHJvcGVydHlQYXRofUBPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZGApO1xuXHRyZXR1cm4ge1xuXHRcdHByb3BlcnR5OiBwcm9wZXJ0eVBhdGgsXG5cdFx0aWdub3JlOiBpc0lnbm9yZWQsXG5cdFx0dHlwZTogdHlwZVxuXHR9O1xufTtcblxuY29uc3QgZGlzcGxheUVycm9yTWVzc2FnZXMgPSBmdW5jdGlvbiAoZXJyb3JNZXNzYWdlczogc3RyaW5nW10pOiB2b2lkIHtcblx0Y29uc3QgbWVzc2FnZURldGFpbHMgPSBbLi4uZXJyb3JNZXNzYWdlc107XG5cdGNvbnN0IHJlc291cmNlQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKSxcblx0XHRlcnJvckNvcnJlY3Rpb25NZXNzYWdlID0gcmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfUEFTVEVfSEVMUEVSX1NBUEZFX1BBU1RFX0VSUk9SX0NPUlJFQ1RJT05fTUVTU0FHRVwiKSxcblx0XHRub3RlTWVzc2FnZSA9IHJlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX1BBU1RFX0hFTFBFUl9TQVBGRV9QQVNURV9FUlJPUl9DT1JSRUNUSU9OX05PVEVcIik7XG5cdGxldCBwYXN0ZUVycm9yTWVzc2FnZTtcblxuXHRpZiAobWVzc2FnZURldGFpbHMubGVuZ3RoID4gMSkge1xuXHRcdHBhc3RlRXJyb3JNZXNzYWdlID0gcmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfUEFTVEVfSEVMUEVSX1NBUEZFX1BBU1RFX0VSUk9SX01FU1NBR0VfUExVUkFMXCIsIFttZXNzYWdlRGV0YWlscy5sZW5ndGhdKTtcblx0fSBlbHNlIHtcblx0XHRwYXN0ZUVycm9yTWVzc2FnZSA9IHJlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX1BBU1RFX0hFTFBFUl9TQVBGRV9QQVNURV9FUlJPUl9NRVNTQUdFX1NJTkdVTEFSXCIpO1xuXHR9XG5cdG1lc3NhZ2VEZXRhaWxzLnVuc2hpZnQoXCJcIik7IC8vIFRvIHNob3cgc3BhY2UgYmV0d2VlbiB0aGUgc2hvcnQgdGV4dCBhbmQgdGhlIGxpc3Qgb2YgZXJyb3JzXG5cdG1lc3NhZ2VEZXRhaWxzLnVuc2hpZnQobm90ZU1lc3NhZ2UpO1xuXHRtZXNzYWdlRGV0YWlscy51bnNoaWZ0KGVycm9yQ29ycmVjdGlvbk1lc3NhZ2UpO1xuXHRNZXNzYWdlQm94LmVycm9yKHBhc3RlRXJyb3JNZXNzYWdlLCB7XG5cdFx0dGl0bGU6IHJlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX0NPTU1PTl9TQVBGRV9FUlJPUl9NRVNTQUdFU19QQUdFX1RJVExFX0VSUk9SXCIpLFxuXHRcdGRldGFpbHM6IG1lc3NhZ2VEZXRhaWxzLmpvaW4oXCI8YnI+XCIpXG5cdH0pO1xufTtcblxuY29uc3QgUGFzdGVIZWxwZXIgPSB7XG5cdGRpc3BsYXlFcnJvck1lc3NhZ2VzOiBkaXNwbGF5RXJyb3JNZXNzYWdlcyxcblx0Zm9ybWF0Q3VzdG9tTWVzc2FnZTogZnVuY3Rpb24gKHZhbGlkYXRpb25NZXNzYWdlczogY3VzdG9tVmFsaWRhdGlvbk1lc3NhZ2VbXSwgaVJvd051bWJlcjogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRsZXQgZXJyb3JNZXNzYWdlID0gXCJcIjtcblx0XHRjb25zdCBudW1iZXJNZXNzYWdlcyA9IHZhbGlkYXRpb25NZXNzYWdlcy5sZW5ndGg7XG5cdFx0Y29uc3QgcmVzb3VyY2VCdW5kbGUgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpLFxuXHRcdFx0aTE4blJvdyA9IHJlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX01FU1NBR0VfR1JPVVBfREVTQ1JJUFRJT05fVEFCTEVfUk9XXCIpO1xuXHRcdGlmIChudW1iZXJNZXNzYWdlcyA+IDApIHtcblx0XHRcdGVycm9yTWVzc2FnZSArPSBgJHtpMThuUm93fSAke2lSb3dOdW1iZXJ9OiBgO1xuXHRcdFx0dmFsaWRhdGlvbk1lc3NhZ2VzLmZvckVhY2goKG1lc3NhZ2UsIGluZGV4TWVzc2FnZSkgPT4ge1xuXHRcdFx0XHRpZiAobWVzc2FnZS5tZXNzYWdlVGV4dCkge1xuXHRcdFx0XHRcdGVycm9yTWVzc2FnZSArPSBtZXNzYWdlLm1lc3NhZ2VUZXh0ICsgKGluZGV4TWVzc2FnZSArIDEgIT09IG51bWJlck1lc3NhZ2VzID8gXCIgXCIgOiBcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBlcnJvck1lc3NhZ2U7XG5cdH0sXG5cdGdldENvbHVtbkluZm86IGZ1bmN0aW9uICh0YWJsZTogYW55KTogUHJvbWlzZTxhbnlbXT4ge1xuXHRcdGNvbnN0IG1vZGVsID0gdGFibGUuZ2V0Um93QmluZGluZygpLmdldE1vZGVsKCksXG5cdFx0XHRtZXRhTW9kZWwgPSBtb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdHJvd0JpbmRpbmdQYXRoID0gbW9kZWwucmVzb2x2ZSh0YWJsZS5nZXRSb3dCaW5kaW5nKCkuZ2V0UGF0aCgpLCB0YWJsZS5nZXRSb3dCaW5kaW5nKCkuZ2V0Q29udGV4dCgpKSxcblx0XHRcdG1ldGFDb250ZXh0ID0gbWV0YU1vZGVsLmdldE1ldGFDb250ZXh0KHJvd0JpbmRpbmdQYXRoKTtcblx0XHRyZXR1cm4gdGFibGVcblx0XHRcdC5nZXRDb250cm9sRGVsZWdhdGUoKVxuXHRcdFx0LmZldGNoUHJvcGVydGllcyh0YWJsZSlcblx0XHRcdC50aGVuKChwcm9wZXJ0eUluZm86IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBQcm9wZXJ0eUluZm9EaWN0ID0gT2JqZWN0LmFzc2lnbih7fSwgLi4ucHJvcGVydHlJbmZvLm1hcCgocHJvcGVydHk6IGFueSkgPT4gKHsgW3Byb3BlcnR5Lm5hbWVdOiBwcm9wZXJ0eSB9KSkpO1xuXHRcdFx0XHRjb25zdCBjb2x1bW5JbmZvczogYW55W10gPSBbXTtcblx0XHRcdFx0dGFibGUuZ2V0Q29sdW1ucygpLmZvckVhY2goKGNvbHVtbjogYW55KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgaW5mb1Byb3BlcnR5ID0gUHJvcGVydHlJbmZvRGljdFtjb2x1bW4uZ2V0RGF0YVByb3BlcnR5KCldO1xuXHRcdFx0XHRcdC8vIENoZWNrIGlmIGl0J3MgYSBjb21wbGV4IHByb3BlcnR5IChwcm9wZXJ0eSBhc3NvY2lhdGVkIHRvIG11bHRpcGxlIHNpbXBsZSBwcm9wZXJ0aWVzKVxuXHRcdFx0XHRcdGlmIChpbmZvUHJvcGVydHkucHJvcGVydHlJbmZvcykge1xuXHRcdFx0XHRcdFx0Ly8gR2V0IGRhdGEgZnJvbSBzaW1wbGUgcHJvcGVydHlcblx0XHRcdFx0XHRcdGluZm9Qcm9wZXJ0eS5wcm9wZXJ0eUluZm9zLmZvckVhY2goKHByb3BlcnR5OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZGF0YVByb3BlcnR5ID0gUHJvcGVydHlJbmZvRGljdFtwcm9wZXJ0eV07XG5cblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBzaW1wbGUgcHJvcGVydHkgYXNzb2NpYXRlZCB0byBhIFJhdGluZyBvciBQcm9ncmVzcyBDb21wbGV4UHJvcGVydHkgLS0+IGlnbm9yZVxuXHRcdFx0XHRcdFx0XHQvLyBPciBjaGVjayBhIG5hdmlnYXRpb24gcHJvcGVydHkgd2l0aGluIHRoZSBjdXJyZW50IENvbXBsZXggcHJvcGVydHkgLS0+IGlnbm9yZVxuXHRcdFx0XHRcdFx0XHQvLyBBIGZha2UgcHJvcGVydHkgd2FzIGNyZWF0ZWQgaW50byB0aGUgcHJvcGVydHlJbmZvcyB0byBpbmNsdWRlIHRoZSBUYXJnZXQgVmFsdWVcblx0XHRcdFx0XHRcdFx0Ly8gZnJvbSB0aGUgRGF0YVBvaW50IChwYXRoIGluY2x1ZGVzIHRoZSBAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50IGFubm90YXRpb24pXG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHQoZGF0YVByb3BlcnR5ICYmIGRhdGFQcm9wZXJ0eS5wYXRoLmluZGV4T2YoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50XCIpID4gLTEpIHx8XG5cdFx0XHRcdFx0XHRcdFx0cHJvcGVydHkuaW5kZXhPZihcIi9cIikgPiAtMVxuXHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRjb2x1bW5JbmZvcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5OiBkYXRhUHJvcGVydHkucGF0aCxcblx0XHRcdFx0XHRcdFx0XHRcdGlnbm9yZTogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbkluZm9zLnB1c2godGhpcy5nZXRJbmZvRm9yRW50aXR5UHJvcGVydHkoZGF0YVByb3BlcnR5LnBhdGgsIHJvd0JpbmRpbmdQYXRoLCBtZXRhQ29udGV4dCwgbWV0YU1vZGVsKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5mb1Byb3BlcnR5LnBhdGgpIHtcblx0XHRcdFx0XHRcdGNvbHVtbkluZm9zLnB1c2godGhpcy5nZXRJbmZvRm9yRW50aXR5UHJvcGVydHkoaW5mb1Byb3BlcnR5LnBhdGgsIHJvd0JpbmRpbmdQYXRoLCBtZXRhQ29udGV4dCwgbWV0YU1vZGVsKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEVtcHR5IGNvbHVtbiAtLT4gaWdub3JlXG5cdFx0XHRcdFx0XHRjb2x1bW5JbmZvcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0cHJvcGVydHk6IFwidW51c2VkXCIsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IG51bGwsXG5cdFx0XHRcdFx0XHRcdGlnbm9yZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGNvbHVtbkluZm9zO1xuXHRcdFx0fSk7XG5cdH0sXG5cdGdldEluZm9Gb3JFbnRpdHlQcm9wZXJ0eTogZ2V0SW5mb0ZvckVudGl0eVByb3BlcnR5LFxuXG5cdHBhcnNlUGFzdGVkRGF0YTogZnVuY3Rpb24gKHJhd0RhdGE6IGFueSwgdGFibGU6IGFueSk6IFByb21pc2U8YW55W10+IHtcblx0XHRyZXR1cm4gdGhpcy5nZXRDb2x1bW5JbmZvKHRhYmxlKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHBhc3RlSW5mb3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIENoZWNrIGlmIHdlIGhhdmUgZGF0YSBmb3IgYXQgbGVhc3QgdGhlIGZpcnN0IGVkaXRhYmxlIGNvbHVtblxuXHRcdFx0XHRjb25zdCBwYXN0ZWRDb2x1bW5Db3VudCA9IHJhd0RhdGEubGVuZ3RoID8gcmF3RGF0YVswXS5sZW5ndGggOiAwO1xuXHRcdFx0XHRsZXQgZmlyc3RFZGl0YWJsZUNvbHVtbkluZGV4ID0gLTE7XG5cdFx0XHRcdGZvciAobGV0IEkgPSAwOyBJIDwgcGFzdGVJbmZvcy5sZW5ndGggJiYgZmlyc3RFZGl0YWJsZUNvbHVtbkluZGV4IDwgMDsgSSsrKSB7XG5cdFx0XHRcdFx0aWYgKCFwYXN0ZUluZm9zW0ldLmlnbm9yZSkge1xuXHRcdFx0XHRcdFx0Zmlyc3RFZGl0YWJsZUNvbHVtbkluZGV4ID0gSTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZpcnN0RWRpdGFibGVDb2x1bW5JbmRleCA8IDAgfHwgZmlyc3RFZGl0YWJsZUNvbHVtbkluZGV4ID4gcGFzdGVkQ29sdW1uQ291bnQgLSAxXG5cdFx0XHRcdFx0PyBQcm9taXNlLnJlc29sdmUoe30pIC8vIFdlIGRvbid0IGhhdmUgZGF0YSBmb3IgYW4gZWRpdGFibGUgY29sdW1uIC0tPiByZXR1cm4gZW1wdHkgcGFyc2VkIGRhdGFcblx0XHRcdFx0XHQ6IChDb3JlUGFzdGVIZWxwZXIgYXMgYW55KS5wYXJzZShyYXdEYXRhLCBwYXN0ZUluZm9zKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigocGFyc2VSZXN1bHQ6IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAocGFyc2VSZXN1bHQuZXJyb3JzKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlcyA9IHBhcnNlUmVzdWx0LmVycm9ycy5tYXAoZnVuY3Rpb24gKG9FbGVtZW50OiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBvRWxlbWVudC5tZXNzYWdlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuZGlzcGxheUVycm9yTWVzc2FnZXMoZXJyb3JNZXNzYWdlcyk7XG5cdFx0XHRcdFx0cmV0dXJuIFtdOyAvLyBFcnJvcnMgLS0+IHJldHVybiBub3RoaW5nXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlUmVzdWx0LnBhcnNlZERhdGEgPyBwYXJzZVJlc3VsdC5wYXJzZWREYXRhIDogW107XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9LFxuXHRwYXN0ZURhdGE6IGZ1bmN0aW9uIChyYXdEYXRhOiBhbnksIHRhYmxlOiBhbnksIGNvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyKTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBvSW50ZXJuYWxFZGl0RmxvdyA9IChjb250cm9sbGVyIGFzIGFueSkuX2VkaXRGbG93O1xuXHRcdGNvbnN0IHRhYmxlRGVmaW5pdGlvbiA9IHRhYmxlLmdldFBhcmVudCgpLmdldFRhYmxlRGVmaW5pdGlvbigpO1xuXHRcdGxldCBhRGF0YTogYW55W10gPSBbXTtcblx0XHRyZXR1cm4gdGhpcy5wYXJzZVBhc3RlZERhdGEocmF3RGF0YSwgdGFibGUpXG5cdFx0XHQudGhlbigoYVBhcnNlZERhdGEpID0+IHtcblx0XHRcdFx0YURhdGEgPSBhUGFyc2VkRGF0YSB8fCBbXTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKFxuXHRcdFx0XHRcdGFEYXRhLm1hcCgobURhdGEpID0+XG5cdFx0XHRcdFx0XHRvSW50ZXJuYWxFZGl0Rmxvdy5nZXRUcmFuc2FjdGlvbkhlbHBlcigpLnZhbGlkYXRlRG9jdW1lbnQoXG5cdFx0XHRcdFx0XHRcdHRhYmxlLmdldEJpbmRpbmdDb250ZXh0KCksXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBtRGF0YSxcblx0XHRcdFx0XHRcdFx0XHRjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb246IHRhYmxlRGVmaW5pdGlvbj8uY29udHJvbD8uY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIuZ2V0VmlldygpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKChhVmFsaWRhdGlvbk1lc3NhZ2VzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGFFcnJvck1lc3NhZ2VzID0gYVZhbGlkYXRpb25NZXNzYWdlcy5yZWR1Y2UoZnVuY3Rpb24gKGFNZXNzYWdlcywgYUN1c3RvbU1lc3NhZ2VzLCBpbmRleCkge1xuXHRcdFx0XHRcdGlmIChhQ3VzdG9tTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0YU1lc3NhZ2VzLnB1c2goeyBtZXNzYWdlczogYUN1c3RvbU1lc3NhZ2VzLCByb3c6IGluZGV4ICsgMSB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGFNZXNzYWdlcztcblx0XHRcdFx0fSwgW10pO1xuXHRcdFx0XHRpZiAoYUVycm9yTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGNvbnN0IGFSb3dNZXNzYWdlcyA9IGFFcnJvck1lc3NhZ2VzLm1hcCgobUVycm9yOiBhbnkpID0+IHRoaXMuZm9ybWF0Q3VzdG9tTWVzc2FnZShtRXJyb3IubWVzc2FnZXMsIG1FcnJvci5yb3cpKTtcblx0XHRcdFx0XHR0aGlzLmRpc3BsYXlFcnJvck1lc3NhZ2VzKGFSb3dNZXNzYWdlcyk7XG5cdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBhRGF0YTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoYVZhbGlkYXRlZERhdGEpID0+IHtcblx0XHRcdFx0cmV0dXJuIGFWYWxpZGF0ZWREYXRhLmxlbmd0aCA+IDBcblx0XHRcdFx0XHQ/IG9JbnRlcm5hbEVkaXRGbG93LmNyZWF0ZU11bHRpcGxlRG9jdW1lbnRzKFxuXHRcdFx0XHRcdFx0XHR0YWJsZS5nZXRSb3dCaW5kaW5nKCksXG5cdFx0XHRcdFx0XHRcdGFWYWxpZGF0ZWREYXRhLFxuXHRcdFx0XHRcdFx0XHR0YWJsZURlZmluaXRpb24/LmNvbnRyb2w/LmNyZWF0ZUF0RW5kLFxuXHRcdFx0XHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRcdFx0XHQoY29udHJvbGxlciBhcyBhbnkpLmVkaXRGbG93Lm9uQmVmb3JlQ3JlYXRlXG5cdFx0XHRcdFx0ICApXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKChvRXJyb3IpID0+IHtcblx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgcGFzdGluZyBkYXRhXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGFzdGVIZWxwZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQVdBLElBQU1BLHdCQUF3QixHQUFHLFVBQVVDLFlBQVYsRUFBNkJDLGNBQTdCLEVBQWtEQyxXQUFsRCxFQUFvRUMsU0FBcEUsRUFBeUY7SUFDekgsSUFBTUMsUUFBUSxHQUFHRixXQUFXLENBQUNHLFdBQVosQ0FBd0JMLFlBQXhCLENBQWpCO0lBQUEsSUFDQ00sYUFBYSxHQUFHO01BQUVDLHFCQUFxQixFQUFFO0lBQXpCLENBRGpCO0lBQUEsSUFFQ0MsSUFBSSxHQUFHTCxTQUFTLENBQUNNLFVBQVYsV0FBd0JSLGNBQXhCLGNBQTBDRCxZQUExQyxHQUEwRE0sYUFBMUQsQ0FGUjtJQUFBLElBR0NJLFNBQVMsR0FBRyxDQUFDTixRQUFELElBQWFGLFdBQVcsQ0FBQ0csV0FBWixXQUEyQkwsWUFBM0IsaUNBSDFCO0lBSUEsT0FBTztNQUNOSSxRQUFRLEVBQUVKLFlBREo7TUFFTlcsTUFBTSxFQUFFRCxTQUZGO01BR05GLElBQUksRUFBRUE7SUFIQSxDQUFQO0VBS0EsQ0FWRDs7RUFZQSxJQUFNSSxvQkFBb0IsR0FBRyxVQUFVQyxhQUFWLEVBQXlDO0lBQ3JFLElBQU1DLGNBQWMsc0JBQU9ELGFBQVAsQ0FBcEI7O0lBQ0EsSUFBTUUsY0FBYyxHQUFHQyxJQUFJLENBQUNDLHdCQUFMLENBQThCLGFBQTlCLENBQXZCO0lBQUEsSUFDQ0Msc0JBQXNCLEdBQUdILGNBQWMsQ0FBQ0ksT0FBZixDQUF1QixxREFBdkIsQ0FEMUI7SUFBQSxJQUVD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