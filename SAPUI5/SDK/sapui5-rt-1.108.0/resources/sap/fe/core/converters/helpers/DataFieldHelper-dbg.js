/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"], function (Log) {
  "use strict";

  var _exports = {};

  //function to check for statically hidden reference properties
  function isReferencePropertyStaticallyHidden(property) {
    var _property$annotations, _property$annotations2, _property$annotations3, _property$Value, _property$Value$$targ, _property$Value$$targ2, _property$Value$$targ3, _property$Value$$targ4, _property$Value3, _property$Value3$$tar, _propertyValueAnnotat, _propertyValueAnnotat2, _property$annotations4, _property$annotations5, _property$annotations6;

    if (property) {
      switch (property.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          return isAnnotationFieldStaticallyHidden(property);

        case "com.sap.vocabularies.UI.v1.DataField":
          if (property.annotations && ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) === true) {
            var _UI, _UI$HiddenFilter;

            if (property.annotations && ((_UI = property.annotations.UI) === null || _UI === void 0 ? void 0 : (_UI$HiddenFilter = _UI.HiddenFilter) === null || _UI$HiddenFilter === void 0 ? void 0 : _UI$HiddenFilter.valueOf()) === true) {
              Log.warning("Warning: Property " + property.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
            }

            return true;
          } else if (property.Value.$target && ((_property$Value = property.Value) === null || _property$Value === void 0 ? void 0 : (_property$Value$$targ = _property$Value.$target) === null || _property$Value$$targ === void 0 ? void 0 : (_property$Value$$targ2 = _property$Value$$targ.annotations) === null || _property$Value$$targ2 === void 0 ? void 0 : (_property$Value$$targ3 = _property$Value$$targ2.UI) === null || _property$Value$$targ3 === void 0 ? void 0 : (_property$Value$$targ4 = _property$Value$$targ3.Hidden) === null || _property$Value$$targ4 === void 0 ? void 0 : _property$Value$$targ4.valueOf()) === true) {
            var _property$Value2, _property$Value2$$tar, _property$Value2$$tar2, _property$Value2$$tar3, _property$Value2$$tar4;

            if (((_property$Value2 = property.Value) === null || _property$Value2 === void 0 ? void 0 : (_property$Value2$$tar = _property$Value2.$target) === null || _property$Value2$$tar === void 0 ? void 0 : (_property$Value2$$tar2 = _property$Value2$$tar.annotations) === null || _property$Value2$$tar2 === void 0 ? void 0 : (_property$Value2$$tar3 = _property$Value2$$tar2.UI) === null || _property$Value2$$tar3 === void 0 ? void 0 : (_property$Value2$$tar4 = _property$Value2$$tar3.HiddenFilter) === null || _property$Value2$$tar4 === void 0 ? void 0 : _property$Value2$$tar4.valueOf()) === true) Log.warning("Warning: Property " + property.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
            return true;
          } else {
            return false;
          }

        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
          var propertyValueAnnotation = (_property$Value3 = property.Value) === null || _property$Value3 === void 0 ? void 0 : (_property$Value3$$tar = _property$Value3.$target) === null || _property$Value3$$tar === void 0 ? void 0 : _property$Value3$$tar.annotations;

          if ((propertyValueAnnotation === null || propertyValueAnnotation === void 0 ? void 0 : (_propertyValueAnnotat = propertyValueAnnotation.UI) === null || _propertyValueAnnotat === void 0 ? void 0 : (_propertyValueAnnotat2 = _propertyValueAnnotat.Hidden) === null || _propertyValueAnnotat2 === void 0 ? void 0 : _propertyValueAnnotat2.valueOf()) === true) {
            var _propertyValueAnnotat3, _propertyValueAnnotat4;

            if ((propertyValueAnnotation === null || propertyValueAnnotation === void 0 ? void 0 : (_propertyValueAnnotat3 = propertyValueAnnotation.UI) === null || _propertyValueAnnotat3 === void 0 ? void 0 : (_propertyValueAnnotat4 = _propertyValueAnnotat3.HiddenFilter) === null || _propertyValueAnnotat4 === void 0 ? void 0 : _propertyValueAnnotat4.valueOf()) === true) {
              Log.warning("Warning: Property " + property.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
            }

            return true;
          } else {
            return false;
          }

        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
          if (((_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.UI) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.Hidden) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.valueOf()) === true) {
            var _UI2, _UI2$HiddenFilter;

            if (property.annotations && ((_UI2 = property.annotations.UI) === null || _UI2 === void 0 ? void 0 : (_UI2$HiddenFilter = _UI2.HiddenFilter) === null || _UI2$HiddenFilter === void 0 ? void 0 : _UI2$HiddenFilter.valueOf()) === true) {
              Log.warning("Warning: Property " + property.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
            }

            return true;
          } else {
            return false;
          }

        default:
      }
    }
  }

  _exports.isReferencePropertyStaticallyHidden = isReferencePropertyStaticallyHidden;

  function isAnnotationFieldStaticallyHidden(annotationProperty) {
    var _propertyValueAnnotat5, _propertyValueAnnotat6, _propertyValueAnnotat7;

    var target = annotationProperty.Target.$target.term; // let ChartAnnotation: Chart, ConnectedFieldsAnnotation: ConnectedFields, FieldGroupAnnotation: FieldGroup, DataPointAnnotation: DataPoint;

    switch (target) {
      case "com.sap.vocabularies.UI.v1.Chart":
        var ischartMeasureHidden;
        annotationProperty.Target.$target.Measures.forEach(function (chartMeasure) {
          var _chartMeasure$$target, _chartMeasure$$target2, _chartMeasure$$target3;

          if (((_chartMeasure$$target = chartMeasure.$target.annotations) === null || _chartMeasure$$target === void 0 ? void 0 : (_chartMeasure$$target2 = _chartMeasure$$target.UI) === null || _chartMeasure$$target2 === void 0 ? void 0 : (_chartMeasure$$target3 = _chartMeasure$$target2.Hidden) === null || _chartMeasure$$target3 === void 0 ? void 0 : _chartMeasure$$target3.valueOf()) === true) {
            var _UI3, _UI3$HiddenFilter;

            Log.warning("Warning: Measure attribute for Chart " + chartMeasure.$target.name + " is statically hidden hence chart can't be rendered");

            if (chartMeasure.$target.annotations && ((_UI3 = chartMeasure.$target.annotations.UI) === null || _UI3 === void 0 ? void 0 : (_UI3$HiddenFilter = _UI3.HiddenFilter) === null || _UI3$HiddenFilter === void 0 ? void 0 : _UI3$HiddenFilter.valueOf()) === true) {
              Log.warning("Warning: Property " + chartMeasure.$target.name + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
            }

            ischartMeasureHidden = true;
          }
        });

        if (ischartMeasureHidden === true) {
          return true;
        } else {
          return false;
        }

      case "com.sap.vocabularies.UI.v1.ConnectedFields":
        if (annotationProperty) {
          var _annotationProperty$a, _annotationProperty$a2, _annotationProperty$a3;

          if (((_annotationProperty$a = annotationProperty.annotations) === null || _annotationProperty$a === void 0 ? void 0 : (_annotationProperty$a2 = _annotationProperty$a.UI) === null || _annotationProperty$a2 === void 0 ? void 0 : (_annotationProperty$a3 = _annotationProperty$a2.Hidden) === null || _annotationProperty$a3 === void 0 ? void 0 : _annotationProperty$a3.valueOf()) === true) {
            var _UI4, _UI4$HiddenFilter;

            if (annotationProperty.annotations && ((_UI4 = annotationProperty.annotations.UI) === null || _UI4 === void 0 ? void 0 : (_UI4$HiddenFilter = _UI4.HiddenFilter) === null || _UI4$HiddenFilter === void 0 ? void 0 : _UI4$HiddenFilter.valueOf()) === true) {
              Log.warning("Warning: Property " + annotationProperty.Target.$target.qualifier + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
            }

            return true;
          } else {
            return false;
          }
        }

        break;

      case "com.sap.vocabularies.UI.v1.FieldGroup":
        if (annotationProperty) {
          annotationProperty.Target.$target.Data.forEach(function (field) {
            return isReferencePropertyStaticallyHidden(field);
          });
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataPoint":
        var propertyValueAnnotation = annotationProperty.Target.$target.Value.$target;

        if (((_propertyValueAnnotat5 = propertyValueAnnotation.annotations) === null || _propertyValueAnnotat5 === void 0 ? void 0 : (_propertyValueAnnotat6 = _propertyValueAnnotat5.UI) === null || _propertyValueAnnotat6 === void 0 ? void 0 : (_propertyValueAnnotat7 = _propertyValueAnnotat6.Hidden) === null || _propertyValueAnnotat7 === void 0 ? void 0 : _propertyValueAnnotat7.valueOf()) === true) {
          var _propertyValueAnnotat8, _propertyValueAnnotat9, _propertyValueAnnotat10;

          if (((_propertyValueAnnotat8 = propertyValueAnnotation.annotations) === null || _propertyValueAnnotat8 === void 0 ? void 0 : (_propertyValueAnnotat9 = _propertyValueAnnotat8.UI) === null || _propertyValueAnnotat9 === void 0 ? void 0 : (_propertyValueAnnotat10 = _propertyValueAnnotat9.HiddenFilter) === null || _propertyValueAnnotat10 === void 0 ? void 0 : _propertyValueAnnotat10.valueOf()) === true) {
            Log.warning("Warning: Property " + annotationProperty.Target.$target.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
          }

          return true;
        } else {
          return false;
        }

      default:
    }
  }

  _exports.isAnnotationFieldStaticallyHidden = isAnnotationFieldStaticallyHidden;

  function isHeaderStaticallyHidden(property) {
    if (property.targetObject) {
      var _headerInfoAnnotation, _headerInfoAnnotation2, _headerInfoAnnotation3, _headerInfoAnnotation9, _headerInfoAnnotation10, _headerInfoAnnotation11, _headerInfoAnnotation12, _headerInfoAnnotation13, _headerInfoAnnotation14;

      var headerInfoAnnotation = property.targetObject;

      if (headerInfoAnnotation.annotations && ((_headerInfoAnnotation = headerInfoAnnotation.annotations) === null || _headerInfoAnnotation === void 0 ? void 0 : (_headerInfoAnnotation2 = _headerInfoAnnotation.UI) === null || _headerInfoAnnotation2 === void 0 ? void 0 : (_headerInfoAnnotation3 = _headerInfoAnnotation2.Hidden) === null || _headerInfoAnnotation3 === void 0 ? void 0 : _headerInfoAnnotation3.valueOf()) === true) {
        var _headerInfoAnnotation4, _headerInfoAnnotation5, _headerInfoAnnotation6, _headerInfoAnnotation7, _headerInfoAnnotation8;

        if (((_headerInfoAnnotation4 = headerInfoAnnotation.Value) === null || _headerInfoAnnotation4 === void 0 ? void 0 : (_headerInfoAnnotation5 = _headerInfoAnnotation4.$target) === null || _headerInfoAnnotation5 === void 0 ? void 0 : (_headerInfoAnnotation6 = _headerInfoAnnotation5.annotations) === null || _headerInfoAnnotation6 === void 0 ? void 0 : (_headerInfoAnnotation7 = _headerInfoAnnotation6.UI) === null || _headerInfoAnnotation7 === void 0 ? void 0 : (_headerInfoAnnotation8 = _headerInfoAnnotation7.HiddenFilter) === null || _headerInfoAnnotation8 === void 0 ? void 0 : _headerInfoAnnotation8.valueOf()) === true) {
          Log.warning("Warning: Property " + headerInfoAnnotation.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
        }

        return true;
      } else if (headerInfoAnnotation !== null && headerInfoAnnotation !== void 0 && (_headerInfoAnnotation9 = headerInfoAnnotation.Value) !== null && _headerInfoAnnotation9 !== void 0 && _headerInfoAnnotation9.$target && (headerInfoAnnotation === null || headerInfoAnnotation === void 0 ? void 0 : (_headerInfoAnnotation10 = headerInfoAnnotation.Value) === null || _headerInfoAnnotation10 === void 0 ? void 0 : (_headerInfoAnnotation11 = _headerInfoAnnotation10.$target) === null || _headerInfoAnnotation11 === void 0 ? void 0 : (_headerInfoAnnotation12 = _headerInfoAnnotation11.annotations) === null || _headerInfoAnnotation12 === void 0 ? void 0 : (_headerInfoAnnotation13 = _headerInfoAnnotation12.UI) === null || _headerInfoAnnotation13 === void 0 ? void 0 : (_headerInfoAnnotation14 = _headerInfoAnnotation13.Hidden) === null || _headerInfoAnnotation14 === void 0 ? void 0 : _headerInfoAnnotation14.valueOf()) === true) {
        var _headerInfoAnnotation15, _headerInfoAnnotation16, _headerInfoAnnotation17, _headerInfoAnnotation18, _headerInfoAnnotation19;

        if ((headerInfoAnnotation === null || headerInfoAnnotation === void 0 ? void 0 : (_headerInfoAnnotation15 = headerInfoAnnotation.Value) === null || _headerInfoAnnotation15 === void 0 ? void 0 : (_headerInfoAnnotation16 = _headerInfoAnnotation15.$target) === null || _headerInfoAnnotation16 === void 0 ? void 0 : (_headerInfoAnnotation17 = _headerInfoAnnotation16.annotations) === null || _headerInfoAnnotation17 === void 0 ? void 0 : (_headerInfoAnnotation18 = _headerInfoAnnotation17.UI) === null || _headerInfoAnnotation18 === void 0 ? void 0 : (_headerInfoAnnotation19 = _headerInfoAnnotation18.HiddenFilter) === null || _headerInfoAnnotation19 === void 0 ? void 0 : _headerInfoAnnotation19.valueOf()) === true) {
          Log.warning("Warning: Property " + headerInfoAnnotation.Value.path + " is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");
        }

        return true;
      } else {
        return false;
      }
    }
  }

  _exports.isHeaderStaticallyHidden = isHeaderStaticallyHidden;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc1JlZmVyZW5jZVByb3BlcnR5U3RhdGljYWxseUhpZGRlbiIsInByb3BlcnR5IiwiJFR5cGUiLCJpc0Fubm90YXRpb25GaWVsZFN0YXRpY2FsbHlIaWRkZW4iLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsIkhpZGRlbkZpbHRlciIsIkxvZyIsIndhcm5pbmciLCJWYWx1ZSIsInBhdGgiLCIkdGFyZ2V0IiwicHJvcGVydHlWYWx1ZUFubm90YXRpb24iLCJhbm5vdGF0aW9uUHJvcGVydHkiLCJ0YXJnZXQiLCJUYXJnZXQiLCJ0ZXJtIiwiaXNjaGFydE1lYXN1cmVIaWRkZW4iLCJNZWFzdXJlcyIsImZvckVhY2giLCJjaGFydE1lYXN1cmUiLCJuYW1lIiwicXVhbGlmaWVyIiwiRGF0YSIsImZpZWxkIiwiaXNIZWFkZXJTdGF0aWNhbGx5SGlkZGVuIiwidGFyZ2V0T2JqZWN0IiwiaGVhZGVySW5mb0Fubm90YXRpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkRhdGFGaWVsZEhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHREYXRhRmllbGRBYnN0cmFjdFR5cGVzLFxuXHREYXRhRmllbGRGb3JBbm5vdGF0aW9uVHlwZXMsXG5cdFVJQW5ub3RhdGlvblRlcm1zLFxuXHRVSUFubm90YXRpb25UeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcblxuLy9mdW5jdGlvbiB0byBjaGVjayBmb3Igc3RhdGljYWxseSBoaWRkZW4gcmVmZXJlbmNlIHByb3BlcnRpZXNcbmV4cG9ydCBmdW5jdGlvbiBpc1JlZmVyZW5jZVByb3BlcnR5U3RhdGljYWxseUhpZGRlbihwcm9wZXJ0eT86IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCB1bmRlZmluZWQpIHtcblx0aWYgKHByb3BlcnR5KSB7XG5cdFx0c3dpdGNoIChwcm9wZXJ0eS4kVHlwZSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdFx0XHRyZXR1cm4gaXNBbm5vdGF0aW9uRmllbGRTdGF0aWNhbGx5SGlkZGVuKHByb3BlcnR5KTtcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkOlxuXHRcdFx0XHRpZiAocHJvcGVydHkuYW5ub3RhdGlvbnMgJiYgcHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eS5hbm5vdGF0aW9ucyAmJiAocHJvcGVydHkuYW5ub3RhdGlvbnMgYXMgYW55KS5VST8uSGlkZGVuRmlsdGVyPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdExvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFx0XHRcIldhcm5pbmc6IFByb3BlcnR5IFwiICtcblx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eS5WYWx1ZS5wYXRoICtcblx0XHRcdFx0XHRcdFx0XHRcIiBpcyBzZXQgd2l0aCBib3RoIFVJLkhpZGRlbiBhbmQgVUkuSGlkZGVuRmlsdGVyIC0gcGxlYXNlIHNldCBvbmx5IG9uZSBvZiB0aGVzZSEgVUkuSGlkZGVuRmlsdGVyIGlzIGlnbm9yZWQgY3VycmVudGx5IVwiXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5WYWx1ZS4kdGFyZ2V0ICYmIHByb3BlcnR5LlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5LlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbkZpbHRlcj8udmFsdWVPZigpID09PSB0cnVlKVxuXHRcdFx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0XHRcdFwiV2FybmluZzogUHJvcGVydHkgXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5LlZhbHVlLnBhdGggK1xuXHRcdFx0XHRcdFx0XHRcdFwiIGlzIHNldCB3aXRoIGJvdGggVUkuSGlkZGVuIGFuZCBVSS5IaWRkZW5GaWx0ZXIgLSBwbGVhc2Ugc2V0IG9ubHkgb25lIG9mIHRoZXNlISBVSS5IaWRkZW5GaWx0ZXIgaXMgaWdub3JlZCBjdXJyZW50bHkhXCJcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRcdFx0Y29uc3QgcHJvcGVydHlWYWx1ZUFubm90YXRpb24gPSBwcm9wZXJ0eS5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eVZhbHVlQW5ub3RhdGlvbj8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5VmFsdWVBbm5vdGF0aW9uPy5VST8uSGlkZGVuRmlsdGVyPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdExvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFx0XHRcIldhcm5pbmc6IFByb3BlcnR5IFwiICtcblx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eS5WYWx1ZS5wYXRoICtcblx0XHRcdFx0XHRcdFx0XHRcIiBpcyBzZXQgd2l0aCBib3RoIFVJLkhpZGRlbiBhbmQgVUkuSGlkZGVuRmlsdGVyIC0gcGxlYXNlIHNldCBvbmx5IG9uZSBvZiB0aGVzZSEgVUkuSGlkZGVuRmlsdGVyIGlzIGlnbm9yZWQgY3VycmVudGx5IVwiXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRcdFx0aWYgKHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHkuYW5ub3RhdGlvbnMgJiYgKHByb3BlcnR5LmFubm90YXRpb25zIGFzIGFueSkuVUk/LkhpZGRlbkZpbHRlcj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRMb2cud2FybmluZyhcblx0XHRcdFx0XHRcdFx0XCJXYXJuaW5nOiBQcm9wZXJ0eSBcIiArXG5cdFx0XHRcdFx0XHRcdFx0cHJvcGVydHkuVmFsdWUucGF0aCArXG5cdFx0XHRcdFx0XHRcdFx0XCIgaXMgc2V0IHdpdGggYm90aCBVSS5IaWRkZW4gYW5kIFVJLkhpZGRlbkZpbHRlciAtIHBsZWFzZSBzZXQgb25seSBvbmUgb2YgdGhlc2UhIFVJLkhpZGRlbkZpbHRlciBpcyBpZ25vcmVkIGN1cnJlbnRseSFcIlxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRkZWZhdWx0OlxuXHRcdH1cblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQW5ub3RhdGlvbkZpZWxkU3RhdGljYWxseUhpZGRlbihhbm5vdGF0aW9uUHJvcGVydHk6IERhdGFGaWVsZEZvckFubm90YXRpb25UeXBlcykge1xuXHRjb25zdCB0YXJnZXQgPSBhbm5vdGF0aW9uUHJvcGVydHkuVGFyZ2V0LiR0YXJnZXQudGVybTtcblx0Ly8gbGV0IENoYXJ0QW5ub3RhdGlvbjogQ2hhcnQsIENvbm5lY3RlZEZpZWxkc0Fubm90YXRpb246IENvbm5lY3RlZEZpZWxkcywgRmllbGRHcm91cEFubm90YXRpb246IEZpZWxkR3JvdXAsIERhdGFQb2ludEFubm90YXRpb246IERhdGFQb2ludDtcblx0c3dpdGNoICh0YXJnZXQpIHtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLkNoYXJ0OlxuXHRcdFx0bGV0IGlzY2hhcnRNZWFzdXJlSGlkZGVuO1xuXHRcdFx0YW5ub3RhdGlvblByb3BlcnR5LlRhcmdldC4kdGFyZ2V0Lk1lYXN1cmVzLmZvckVhY2goKGNoYXJ0TWVhc3VyZSkgPT4ge1xuXHRcdFx0XHRpZiAoY2hhcnRNZWFzdXJlLiR0YXJnZXQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdExvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFx0XCJXYXJuaW5nOiBNZWFzdXJlIGF0dHJpYnV0ZSBmb3IgQ2hhcnQgXCIgK1xuXHRcdFx0XHRcdFx0XHRjaGFydE1lYXN1cmUuJHRhcmdldC5uYW1lICtcblx0XHRcdFx0XHRcdFx0XCIgaXMgc3RhdGljYWxseSBoaWRkZW4gaGVuY2UgY2hhcnQgY2FuJ3QgYmUgcmVuZGVyZWRcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0Y2hhcnRNZWFzdXJlLiR0YXJnZXQuYW5ub3RhdGlvbnMgJiZcblx0XHRcdFx0XHRcdChjaGFydE1lYXN1cmUuJHRhcmdldC5hbm5vdGF0aW9ucyBhcyBhbnkpLlVJPy5IaWRkZW5GaWx0ZXI/LnZhbHVlT2YoKSA9PT0gdHJ1ZVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0XHRcdFwiV2FybmluZzogUHJvcGVydHkgXCIgK1xuXHRcdFx0XHRcdFx0XHRcdGNoYXJ0TWVhc3VyZS4kdGFyZ2V0Lm5hbWUgK1xuXHRcdFx0XHRcdFx0XHRcdFwiIGlzIHNldCB3aXRoIGJvdGggVUkuSGlkZGVuIGFuZCBVSS5IaWRkZW5GaWx0ZXIgLSBwbGVhc2Ugc2V0IG9ubHkgb25lIG9mIHRoZXNlISBVSS5IaWRkZW5GaWx0ZXIgaXMgaWdub3JlZCBjdXJyZW50bHkhXCJcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlzY2hhcnRNZWFzdXJlSGlkZGVuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoaXNjaGFydE1lYXN1cmVIaWRkZW4gPT09IHRydWUpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5Db25uZWN0ZWRGaWVsZHM6XG5cdFx0XHRpZiAoYW5ub3RhdGlvblByb3BlcnR5KSB7XG5cdFx0XHRcdGlmIChhbm5vdGF0aW9uUHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGlmIChhbm5vdGF0aW9uUHJvcGVydHkuYW5ub3RhdGlvbnMgJiYgKGFubm90YXRpb25Qcm9wZXJ0eS5hbm5vdGF0aW9ucyBhcyBhbnkpLlVJPy5IaWRkZW5GaWx0ZXI/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0XHRcdFwiV2FybmluZzogUHJvcGVydHkgXCIgK1xuXHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25Qcm9wZXJ0eS5UYXJnZXQuJHRhcmdldC5xdWFsaWZpZXIgK1xuXHRcdFx0XHRcdFx0XHRcdFwiIGlzIHNldCB3aXRoIGJvdGggVUkuSGlkZGVuIGFuZCBVSS5IaWRkZW5GaWx0ZXIgLSBwbGVhc2Ugc2V0IG9ubHkgb25lIG9mIHRoZXNlISBVSS5IaWRkZW5GaWx0ZXIgaXMgaWdub3JlZCBjdXJyZW50bHkhXCJcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0aWYgKGFubm90YXRpb25Qcm9wZXJ0eSkge1xuXHRcdFx0XHQoYW5ub3RhdGlvblByb3BlcnR5IGFzIGFueSkuVGFyZ2V0LiR0YXJnZXQuRGF0YS5mb3JFYWNoKChmaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykgPT5cblx0XHRcdFx0XHRpc1JlZmVyZW5jZVByb3BlcnR5U3RhdGljYWxseUhpZGRlbihmaWVsZClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuRGF0YVBvaW50OlxuXHRcdFx0Y29uc3QgcHJvcGVydHlWYWx1ZUFubm90YXRpb24gPSAoYW5ub3RhdGlvblByb3BlcnR5LlRhcmdldC4kdGFyZ2V0IGFzIGFueSkuVmFsdWUuJHRhcmdldDtcblx0XHRcdGlmIChwcm9wZXJ0eVZhbHVlQW5ub3RhdGlvbi5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eVZhbHVlQW5ub3RhdGlvbi5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbkZpbHRlcj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0XHRcIldhcm5pbmc6IFByb3BlcnR5IFwiICtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblByb3BlcnR5LlRhcmdldC4kdGFyZ2V0LlZhbHVlLnBhdGggK1xuXHRcdFx0XHRcdFx0XHRcIiBpcyBzZXQgd2l0aCBib3RoIFVJLkhpZGRlbiBhbmQgVUkuSGlkZGVuRmlsdGVyIC0gcGxlYXNlIHNldCBvbmx5IG9uZSBvZiB0aGVzZSEgVUkuSGlkZGVuRmlsdGVyIGlzIGlnbm9yZWQgY3VycmVudGx5IVwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRkZWZhdWx0OlxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0hlYWRlclN0YXRpY2FsbHlIaWRkZW4ocHJvcGVydHk/OiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSB7XG5cdGlmICgocHJvcGVydHkgYXMgYW55KS50YXJnZXRPYmplY3QpIHtcblx0XHRjb25zdCBoZWFkZXJJbmZvQW5ub3RhdGlvbiA9IChwcm9wZXJ0eSBhcyBhbnkpLnRhcmdldE9iamVjdDtcblx0XHRpZiAoaGVhZGVySW5mb0Fubm90YXRpb24uYW5ub3RhdGlvbnMgJiYgaGVhZGVySW5mb0Fubm90YXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0aWYgKGhlYWRlckluZm9Bbm5vdGF0aW9uLlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbkZpbHRlcj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdExvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFwiV2FybmluZzogUHJvcGVydHkgXCIgK1xuXHRcdFx0XHRcdFx0aGVhZGVySW5mb0Fubm90YXRpb24uVmFsdWUucGF0aCArXG5cdFx0XHRcdFx0XHRcIiBpcyBzZXQgd2l0aCBib3RoIFVJLkhpZGRlbiBhbmQgVUkuSGlkZGVuRmlsdGVyIC0gcGxlYXNlIHNldCBvbmx5IG9uZSBvZiB0aGVzZSEgVUkuSGlkZGVuRmlsdGVyIGlzIGlnbm9yZWQgY3VycmVudGx5IVwiXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0aGVhZGVySW5mb0Fubm90YXRpb24/LlZhbHVlPy4kdGFyZ2V0ICYmXG5cdFx0XHRoZWFkZXJJbmZvQW5ub3RhdGlvbj8uVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWVcblx0XHQpIHtcblx0XHRcdGlmIChoZWFkZXJJbmZvQW5ub3RhdGlvbj8uVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuRmlsdGVyPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0XCJXYXJuaW5nOiBQcm9wZXJ0eSBcIiArXG5cdFx0XHRcdFx0XHRoZWFkZXJJbmZvQW5ub3RhdGlvbi5WYWx1ZS5wYXRoICtcblx0XHRcdFx0XHRcdFwiIGlzIHNldCB3aXRoIGJvdGggVUkuSGlkZGVuIGFuZCBVSS5IaWRkZW5GaWx0ZXIgLSBwbGVhc2Ugc2V0IG9ubHkgb25lIG9mIHRoZXNlISBVSS5IaWRkZW5GaWx0ZXIgaXMgaWdub3JlZCBjdXJyZW50bHkhXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQVFBO0VBQ08sU0FBU0EsbUNBQVQsQ0FBNkNDLFFBQTdDLEVBQTRGO0lBQUE7O0lBQ2xHLElBQUlBLFFBQUosRUFBYztNQUNiLFFBQVFBLFFBQVEsQ0FBQ0MsS0FBakI7UUFDQztVQUNDLE9BQU9DLGlDQUFpQyxDQUFDRixRQUFELENBQXhDOztRQUNEO1VBQ0MsSUFBSUEsUUFBUSxDQUFDRyxXQUFULElBQXdCLDBCQUFBSCxRQUFRLENBQUNHLFdBQVQsMEdBQXNCQyxFQUF0Qiw0R0FBMEJDLE1BQTFCLGtGQUFrQ0MsT0FBbEMsUUFBZ0QsSUFBNUUsRUFBa0Y7WUFBQTs7WUFDakYsSUFBSU4sUUFBUSxDQUFDRyxXQUFULElBQXdCLFFBQUNILFFBQVEsQ0FBQ0csV0FBVixDQUE4QkMsRUFBOUIsZ0VBQWtDRyxZQUFsQyxzRUFBZ0RELE9BQWhELFFBQThELElBQTFGLEVBQWdHO2NBQy9G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