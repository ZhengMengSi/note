/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/ui/mdc/odata/v4/FieldBaseDelegate", "sap/ui/model/Filter"], function (Log, CommonUtils, FieldBaseDelegate, Filter) {
  "use strict";

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * Determine all parameters in a value help that use a specific property.
   *
   * @param oValueList Value help that is used
   * @param sPropertyName Name of the property
   * @returns List of all found parameters
   */
  function _getValueListParameter(oValueList, sPropertyName) {
    //determine path to value list property
    return oValueList.Parameters.filter(function (entry) {
      if (entry.LocalDataProperty) {
        return entry.LocalDataProperty.$PropertyPath === sPropertyName;
      } else {
        return false;
      }
    });
  }
  /**
   * Build filters for each in-parameter.
   *
   * @param oValueList Value help that is used
   * @param sPropertyName Name of the property
   * @param sValueHelpProperty Name of the value help property
   * @param vKey Value of the property
   * @param vhPayload Payload of the value help
   * @returns List of filters
   */


  function _getFilter(oValueList, sPropertyName, sValueHelpProperty, vKey, vhPayload) {
    var aFilters = [];
    var parameters = oValueList.Parameters.filter(function (parameter) {
      return parameter.$Type.indexOf("In") > 48;
    });

    var _iterator = _createForOfIteratorHelper(parameters),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var parameter = _step.value;

        if (parameter.LocalDataProperty.$PropertyPath === sPropertyName) {
          aFilters.push(new Filter({
            path: sValueHelpProperty,
            operator: "EQ",
            value1: vKey
          }));
        } else if (parameter.$Type.indexOf("In") > 48 && vhPayload !== null && vhPayload !== void 0 && vhPayload.isActionParameterDialog) {
          var apdFieldPath = "APD_::".concat(parameter.LocalDataProperty.$PropertyPath);
          var apdField = sap.ui.getCore().byId(apdFieldPath);
          var apdFieldValue = apdField === null || apdField === void 0 ? void 0 : apdField.getValue();

          if (apdFieldValue != null) {
            aFilters.push(new Filter({
              path: parameter.ValueListProperty,
              operator: "EQ",
              value1: apdFieldValue
            }));
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return aFilters;
  }

  return Object.assign({}, FieldBaseDelegate, {
    getDescription: function (oPayload, oFieldHelp, vKey) {
      //JIRA: FIORITECHP1-22022 . The MDC field should not  tries to determine description with the initial GET of the data.
      // it should rely on the data we already received from the backend
      // But The getDescription function is also called in the FilterField case if a variant is loaded.
      // As the description text could be language dependent it is not stored in the variant, so it needs to be read on rendering.
      if (oPayload !== null && oPayload !== void 0 && oPayload.retrieveTextFromValueList || oPayload !== null && oPayload !== void 0 && oPayload.isFilterField) {
        var oODataModel = oFieldHelp.getModel();
        var oMetaModel = oODataModel ? oODataModel.getMetaModel() : CommonUtils.getAppComponent(oFieldHelp).getModel().getMetaModel();
        var vhPayload = oFieldHelp === null || oFieldHelp === void 0 ? void 0 : oFieldHelp.getPayload();
        var sPropertyPath = vhPayload === null || vhPayload === void 0 ? void 0 : vhPayload.propertyPath;
        var sTextProperty;
        return oMetaModel.requestValueListInfo(sPropertyPath, true, oFieldHelp.getBindingContext()).then(function (mValueListInfo) {
          var sPropertyName = oMetaModel.getObject("".concat(sPropertyPath, "@sapui.name")); // take the first value list annotation - alternatively take the one without qualifier or the first one

          var oValueList = mValueListInfo[Object.keys(mValueListInfo)[0]];
          var sValueHelpProperty;

          var aValueHelpParameters = _getValueListParameter(oValueList, sPropertyName);

          if (aValueHelpParameters && aValueHelpParameters[0]) {
            sValueHelpProperty = aValueHelpParameters[0].ValueListProperty;
          } else {
            return Promise.reject("Inconsistent value help annotation for ".concat(sPropertyName));
          } // get text annotation for this value list property


          var oModel = oValueList.$model;
          var oTextAnnotation = oModel.getMetaModel().getObject("/".concat(oValueList.CollectionPath, "/").concat(sValueHelpProperty, "@com.sap.vocabularies.Common.v1.Text"));

          if (oTextAnnotation && oTextAnnotation.$Path) {
            sTextProperty = oTextAnnotation.$Path;
            /* Build the filter for each in-parameter */

            var aFilters = _getFilter(oValueList, sPropertyName, sValueHelpProperty, vKey, vhPayload);

            var oListBinding = oModel.bindList("/".concat(oValueList.CollectionPath), undefined, undefined, aFilters, {
              "$select": sTextProperty
            });
            return oListBinding.requestContexts(0, 2);
          } else {
            return Promise.reject("Text Annotation for ".concat(sValueHelpProperty, "is not defined"));
          }
        }).then(function (aContexts) {
          return aContexts && aContexts[0] ? aContexts[0].getObject()[sTextProperty] : "";
        }).catch(function (e) {
          var sMsg = e.status && e.status === 404 ? "Metadata not found (".concat(e.status, ") for value help of property ").concat(sPropertyPath) : e.message;
          Log.error(sMsg);
        });
      }
    }
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZ2V0VmFsdWVMaXN0UGFyYW1ldGVyIiwib1ZhbHVlTGlzdCIsInNQcm9wZXJ0eU5hbWUiLCJQYXJhbWV0ZXJzIiwiZmlsdGVyIiwiZW50cnkiLCJMb2NhbERhdGFQcm9wZXJ0eSIsIiRQcm9wZXJ0eVBhdGgiLCJfZ2V0RmlsdGVyIiwic1ZhbHVlSGVscFByb3BlcnR5IiwidktleSIsInZoUGF5bG9hZCIsImFGaWx0ZXJzIiwicGFyYW1ldGVycyIsInBhcmFtZXRlciIsIiRUeXBlIiwiaW5kZXhPZiIsInB1c2giLCJGaWx0ZXIiLCJwYXRoIiwib3BlcmF0b3IiLCJ2YWx1ZTEiLCJpc0FjdGlvblBhcmFtZXRlckRpYWxvZyIsImFwZEZpZWxkUGF0aCIsImFwZEZpZWxkIiwic2FwIiwidWkiLCJnZXRDb3JlIiwiYnlJZCIsImFwZEZpZWxkVmFsdWUiLCJnZXRWYWx1ZSIsIlZhbHVlTGlzdFByb3BlcnR5IiwiT2JqZWN0IiwiYXNzaWduIiwiRmllbGRCYXNlRGVsZWdhdGUiLCJnZXREZXNjcmlwdGlvbiIsIm9QYXlsb2FkIiwib0ZpZWxkSGVscCIsInJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3QiLCJpc0ZpbHRlckZpZWxkIiwib09EYXRhTW9kZWwiLCJnZXRNb2RlbCIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJDb21tb25VdGlscyIsImdldEFwcENvbXBvbmVudCIsImdldFBheWxvYWQiLCJzUHJvcGVydHlQYXRoIiwicHJvcGVydHlQYXRoIiwic1RleHRQcm9wZXJ0eSIsInJlcXVlc3RWYWx1ZUxpc3RJbmZvIiwiZ2V0QmluZGluZ0NvbnRleHQiLCJ0aGVuIiwibVZhbHVlTGlzdEluZm8iLCJnZXRPYmplY3QiLCJrZXlzIiwiYVZhbHVlSGVscFBhcmFtZXRlcnMiLCJQcm9taXNlIiwicmVqZWN0Iiwib01vZGVsIiwiJG1vZGVsIiwib1RleHRBbm5vdGF0aW9uIiwiQ29sbGVjdGlvblBhdGgiLCIkUGF0aCIsIm9MaXN0QmluZGluZyIsImJpbmRMaXN0IiwidW5kZWZpbmVkIiwicmVxdWVzdENvbnRleHRzIiwiYUNvbnRleHRzIiwiY2F0Y2giLCJlIiwic01zZyIsInN0YXR1cyIsIm1lc3NhZ2UiLCJMb2ciLCJlcnJvciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRmllbGRCYXNlRGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXIsIFZhbHVlSGVscFBheWxvYWQgfSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9pbnRlcm5hbC92YWx1ZWhlbHAvVmFsdWVMaXN0SGVscGVyTmV3XCI7XG5pbXBvcnQgRmllbGQgZnJvbSBcInNhcC91aS9tZGMvRmllbGRcIjtcbmltcG9ydCBGaWVsZEJhc2VEZWxlZ2F0ZSBmcm9tIFwic2FwL3VpL21kYy9vZGF0YS92NC9GaWVsZEJhc2VEZWxlZ2F0ZVwiO1xuaW1wb3J0IEZpbHRlciBmcm9tIFwic2FwL3VpL21vZGVsL0ZpbHRlclwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTW9kZWxcIjtcblxudHlwZSBWYWx1ZUxpc3QgPSB7XG5cdENvbGxlY3Rpb25QYXRoOiBzdHJpbmc7XG5cdFBhcmFtZXRlcnM6IFtBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVyXTtcblx0JG1vZGVsOiBPRGF0YU1vZGVsO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgYWxsIHBhcmFtZXRlcnMgaW4gYSB2YWx1ZSBoZWxwIHRoYXQgdXNlIGEgc3BlY2lmaWMgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIG9WYWx1ZUxpc3QgVmFsdWUgaGVscCB0aGF0IGlzIHVzZWRcbiAqIEBwYXJhbSBzUHJvcGVydHlOYW1lIE5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcmV0dXJucyBMaXN0IG9mIGFsbCBmb3VuZCBwYXJhbWV0ZXJzXG4gKi9cbmZ1bmN0aW9uIF9nZXRWYWx1ZUxpc3RQYXJhbWV0ZXIob1ZhbHVlTGlzdDogVmFsdWVMaXN0LCBzUHJvcGVydHlOYW1lOiBvYmplY3QpIHtcblx0Ly9kZXRlcm1pbmUgcGF0aCB0byB2YWx1ZSBsaXN0IHByb3BlcnR5XG5cdHJldHVybiBvVmFsdWVMaXN0LlBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChlbnRyeTogYW55KSB7XG5cdFx0aWYgKGVudHJ5LkxvY2FsRGF0YVByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gZW50cnkuTG9jYWxEYXRhUHJvcGVydHkuJFByb3BlcnR5UGF0aCA9PT0gc1Byb3BlcnR5TmFtZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG4vKipcbiAqIEJ1aWxkIGZpbHRlcnMgZm9yIGVhY2ggaW4tcGFyYW1ldGVyLlxuICpcbiAqIEBwYXJhbSBvVmFsdWVMaXN0IFZhbHVlIGhlbHAgdGhhdCBpcyB1c2VkXG4gKiBAcGFyYW0gc1Byb3BlcnR5TmFtZSBOYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHNWYWx1ZUhlbHBQcm9wZXJ0eSBOYW1lIG9mIHRoZSB2YWx1ZSBoZWxwIHByb3BlcnR5XG4gKiBAcGFyYW0gdktleSBWYWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB2aFBheWxvYWQgUGF5bG9hZCBvZiB0aGUgdmFsdWUgaGVscFxuICogQHJldHVybnMgTGlzdCBvZiBmaWx0ZXJzXG4gKi9cbmZ1bmN0aW9uIF9nZXRGaWx0ZXIob1ZhbHVlTGlzdDogVmFsdWVMaXN0LCBzUHJvcGVydHlOYW1lOiBzdHJpbmcsIHNWYWx1ZUhlbHBQcm9wZXJ0eTogc3RyaW5nLCB2S2V5OiBzdHJpbmcsIHZoUGF5bG9hZDogVmFsdWVIZWxwUGF5bG9hZCkge1xuXHRjb25zdCBhRmlsdGVycyA9IFtdO1xuXHRjb25zdCBwYXJhbWV0ZXJzID0gb1ZhbHVlTGlzdC5QYXJhbWV0ZXJzLmZpbHRlcihmdW5jdGlvbiAocGFyYW1ldGVyOiBhbnkpIHtcblx0XHRyZXR1cm4gcGFyYW1ldGVyLiRUeXBlLmluZGV4T2YoXCJJblwiKSA+IDQ4O1xuXHR9KTtcblx0Zm9yIChjb25zdCBwYXJhbWV0ZXIgb2YgcGFyYW1ldGVycykge1xuXHRcdGlmIChwYXJhbWV0ZXIuTG9jYWxEYXRhUHJvcGVydHkuJFByb3BlcnR5UGF0aCA9PT0gc1Byb3BlcnR5TmFtZSkge1xuXHRcdFx0YUZpbHRlcnMucHVzaChuZXcgRmlsdGVyKHsgcGF0aDogc1ZhbHVlSGVscFByb3BlcnR5LCBvcGVyYXRvcjogXCJFUVwiLCB2YWx1ZTE6IHZLZXkgfSkpO1xuXHRcdH0gZWxzZSBpZiAocGFyYW1ldGVyLiRUeXBlLmluZGV4T2YoXCJJblwiKSA+IDQ4ICYmIHZoUGF5bG9hZD8uaXNBY3Rpb25QYXJhbWV0ZXJEaWFsb2cpIHtcblx0XHRcdGNvbnN0IGFwZEZpZWxkUGF0aCA9IGBBUERfOjoke3BhcmFtZXRlci5Mb2NhbERhdGFQcm9wZXJ0eS4kUHJvcGVydHlQYXRofWA7XG5cdFx0XHRjb25zdCBhcGRGaWVsZCA9IHNhcC51aS5nZXRDb3JlKCkuYnlJZChhcGRGaWVsZFBhdGgpIGFzIEZpZWxkO1xuXHRcdFx0Y29uc3QgYXBkRmllbGRWYWx1ZSA9IGFwZEZpZWxkPy5nZXRWYWx1ZSgpO1xuXHRcdFx0aWYgKGFwZEZpZWxkVmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0XHRhRmlsdGVycy5wdXNoKG5ldyBGaWx0ZXIoeyBwYXRoOiBwYXJhbWV0ZXIuVmFsdWVMaXN0UHJvcGVydHksIG9wZXJhdG9yOiBcIkVRXCIsIHZhbHVlMTogYXBkRmllbGRWYWx1ZSB9KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBhRmlsdGVycztcbn1cblxuZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmFzc2lnbih7fSwgRmllbGRCYXNlRGVsZWdhdGUsIHtcblx0Z2V0RGVzY3JpcHRpb246IGZ1bmN0aW9uIChvUGF5bG9hZDogYW55LCBvRmllbGRIZWxwOiBhbnksIHZLZXk6IHN0cmluZykge1xuXHRcdC8vSklSQTogRklPUklURUNIUDEtMjIwMjIgLiBUaGUgTURDIGZpZWxkIHNob3VsZCBub3QgIHRyaWVzIHRvIGRldGVybWluZSBkZXNjcmlwdGlvbiB3aXRoIHRoZSBpbml0aWFsIEdFVCBvZiB0aGUgZGF0YS5cblx0XHQvLyBpdCBzaG91bGQgcmVseSBvbiB0aGUgZGF0YSB3ZSBhbHJlYWR5IHJlY2VpdmVkIGZyb20gdGhlIGJhY2tlbmRcblx0XHQvLyBCdXQgVGhlIGdldERlc2NyaXB0aW9uIGZ1bmN0aW9uIGlzIGFsc28gY2FsbGVkIGluIHRoZSBGaWx0ZXJGaWVsZCBjYXNlIGlmIGEgdmFyaWFudCBpcyBsb2FkZWQuXG5cdFx0Ly8gQXMgdGhlIGRlc2NyaXB0aW9uIHRleHQgY291bGQgYmUgbGFuZ3VhZ2UgZGVwZW5kZW50IGl0IGlzIG5vdCBzdG9yZWQgaW4gdGhlIHZhcmlhbnQsIHNvIGl0IG5lZWRzIHRvIGJlIHJlYWQgb24gcmVuZGVyaW5nLlxuXG5cdFx0aWYgKG9QYXlsb2FkPy5yZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0IHx8IG9QYXlsb2FkPy5pc0ZpbHRlckZpZWxkKSB7XG5cdFx0XHRjb25zdCBvT0RhdGFNb2RlbCA9IG9GaWVsZEhlbHAuZ2V0TW9kZWwoKTtcblx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvT0RhdGFNb2RlbCA/IG9PRGF0YU1vZGVsLmdldE1ldGFNb2RlbCgpIDogQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KG9GaWVsZEhlbHApLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0XHRjb25zdCB2aFBheWxvYWQgPSBvRmllbGRIZWxwPy5nZXRQYXlsb2FkKCk7XG5cdFx0XHRjb25zdCBzUHJvcGVydHlQYXRoID0gdmhQYXlsb2FkPy5wcm9wZXJ0eVBhdGg7XG5cdFx0XHRsZXQgc1RleHRQcm9wZXJ0eTogc3RyaW5nO1xuXHRcdFx0cmV0dXJuIG9NZXRhTW9kZWxcblx0XHRcdFx0LnJlcXVlc3RWYWx1ZUxpc3RJbmZvKHNQcm9wZXJ0eVBhdGgsIHRydWUsIG9GaWVsZEhlbHAuZ2V0QmluZGluZ0NvbnRleHQoKSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKG1WYWx1ZUxpc3RJbmZvOiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBzUHJvcGVydHlOYW1lID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c1Byb3BlcnR5UGF0aH1Ac2FwdWkubmFtZWApO1xuXHRcdFx0XHRcdC8vIHRha2UgdGhlIGZpcnN0IHZhbHVlIGxpc3QgYW5ub3RhdGlvbiAtIGFsdGVybmF0aXZlbHkgdGFrZSB0aGUgb25lIHdpdGhvdXQgcXVhbGlmaWVyIG9yIHRoZSBmaXJzdCBvbmVcblx0XHRcdFx0XHRjb25zdCBvVmFsdWVMaXN0ID0gbVZhbHVlTGlzdEluZm9bT2JqZWN0LmtleXMobVZhbHVlTGlzdEluZm8pWzBdXTtcblx0XHRcdFx0XHRsZXQgc1ZhbHVlSGVscFByb3BlcnR5O1xuXHRcdFx0XHRcdGNvbnN0IGFWYWx1ZUhlbHBQYXJhbWV0ZXJzID0gX2dldFZhbHVlTGlzdFBhcmFtZXRlcihvVmFsdWVMaXN0LCBzUHJvcGVydHlOYW1lKTtcblx0XHRcdFx0XHRpZiAoYVZhbHVlSGVscFBhcmFtZXRlcnMgJiYgYVZhbHVlSGVscFBhcmFtZXRlcnNbMF0pIHtcblx0XHRcdFx0XHRcdHNWYWx1ZUhlbHBQcm9wZXJ0eSA9IGFWYWx1ZUhlbHBQYXJhbWV0ZXJzWzBdLlZhbHVlTGlzdFByb3BlcnR5O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYEluY29uc2lzdGVudCB2YWx1ZSBoZWxwIGFubm90YXRpb24gZm9yICR7c1Byb3BlcnR5TmFtZX1gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gZ2V0IHRleHQgYW5ub3RhdGlvbiBmb3IgdGhpcyB2YWx1ZSBsaXN0IHByb3BlcnR5XG5cdFx0XHRcdFx0Y29uc3Qgb01vZGVsID0gb1ZhbHVlTGlzdC4kbW9kZWw7XG5cdFx0XHRcdFx0Y29uc3Qgb1RleHRBbm5vdGF0aW9uID0gb01vZGVsXG5cdFx0XHRcdFx0XHQuZ2V0TWV0YU1vZGVsKClcblx0XHRcdFx0XHRcdC5nZXRPYmplY3QoYC8ke29WYWx1ZUxpc3QuQ29sbGVjdGlvblBhdGh9LyR7c1ZhbHVlSGVscFByb3BlcnR5fUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dGApO1xuXHRcdFx0XHRcdGlmIChvVGV4dEFubm90YXRpb24gJiYgb1RleHRBbm5vdGF0aW9uLiRQYXRoKSB7XG5cdFx0XHRcdFx0XHRzVGV4dFByb3BlcnR5ID0gb1RleHRBbm5vdGF0aW9uLiRQYXRoO1xuXHRcdFx0XHRcdFx0LyogQnVpbGQgdGhlIGZpbHRlciBmb3IgZWFjaCBpbi1wYXJhbWV0ZXIgKi9cblx0XHRcdFx0XHRcdGNvbnN0IGFGaWx0ZXJzID0gX2dldEZpbHRlcihvVmFsdWVMaXN0LCBzUHJvcGVydHlOYW1lLCBzVmFsdWVIZWxwUHJvcGVydHksIHZLZXksIHZoUGF5bG9hZCk7XG5cdFx0XHRcdFx0XHRjb25zdCBvTGlzdEJpbmRpbmcgPSBvTW9kZWwuYmluZExpc3QoYC8ke29WYWx1ZUxpc3QuQ29sbGVjdGlvblBhdGh9YCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGFGaWx0ZXJzLCB7XG5cdFx0XHRcdFx0XHRcdFwiJHNlbGVjdFwiOiBzVGV4dFByb3BlcnR5XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybiBvTGlzdEJpbmRpbmcucmVxdWVzdENvbnRleHRzKDAsIDIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYFRleHQgQW5ub3RhdGlvbiBmb3IgJHtzVmFsdWVIZWxwUHJvcGVydHl9aXMgbm90IGRlZmluZWRgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChhQ29udGV4dHM6IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBhQ29udGV4dHMgJiYgYUNvbnRleHRzWzBdID8gYUNvbnRleHRzWzBdLmdldE9iamVjdCgpW3NUZXh0UHJvcGVydHldIDogXCJcIjtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBzTXNnID1cblx0XHRcdFx0XHRcdGUuc3RhdHVzICYmIGUuc3RhdHVzID09PSA0MDRcblx0XHRcdFx0XHRcdFx0PyBgTWV0YWRhdGEgbm90IGZvdW5kICgke2Uuc3RhdHVzfSkgZm9yIHZhbHVlIGhlbHAgb2YgcHJvcGVydHkgJHtzUHJvcGVydHlQYXRofWBcblx0XHRcdFx0XHRcdFx0OiBlLm1lc3NhZ2U7XG5cdFx0XHRcdFx0TG9nLmVycm9yKHNNc2cpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cbn0pO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7O0VBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxTQUFTQSxzQkFBVCxDQUFnQ0MsVUFBaEMsRUFBdURDLGFBQXZELEVBQThFO0lBQzdFO0lBQ0EsT0FBT0QsVUFBVSxDQUFDRSxVQUFYLENBQXNCQyxNQUF0QixDQUE2QixVQUFVQyxLQUFWLEVBQXNCO01BQ3pELElBQUlBLEtBQUssQ0FBQ0MsaUJBQVYsRUFBNkI7UUFDNUIsT0FBT0QsS0FBSyxDQUFDQyxpQkFBTixDQUF3QkMsYUFBeEIsS0FBMENMLGFBQWpEO01BQ0EsQ0FGRCxNQUVPO1FBQ04sT0FBTyxLQUFQO01BQ0E7SUFDRCxDQU5NLENBQVA7RUFPQTtFQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7RUFDQSxTQUFTTSxVQUFULENBQW9CUCxVQUFwQixFQUEyQ0MsYUFBM0MsRUFBa0VPLGtCQUFsRSxFQUE4RkMsSUFBOUYsRUFBNEdDLFNBQTVHLEVBQXlJO0lBQ3hJLElBQU1DLFFBQVEsR0FB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