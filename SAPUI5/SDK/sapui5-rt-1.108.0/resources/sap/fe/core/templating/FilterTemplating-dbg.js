/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ModelHelper"], function (modelHelper) {
  "use strict";

  var _exports = {};

  function getIsRequired(converterContext, sPropertyPath) {
    var _capabilities, _capabilities$FilterR;

    var entitySet = converterContext.getEntitySet();
    var entitySetAnnotations = entitySet === null || entitySet === void 0 ? void 0 : entitySet.annotations;
    var capabilities;

    if (!modelHelper.isSingleton(entitySet)) {
      capabilities = entitySetAnnotations === null || entitySetAnnotations === void 0 ? void 0 : entitySetAnnotations.Capabilities;
    }

    var aRequiredProperties = (_capabilities = capabilities) === null || _capabilities === void 0 ? void 0 : (_capabilities$FilterR = _capabilities.FilterRestrictions) === null || _capabilities$FilterR === void 0 ? void 0 : _capabilities$FilterR.RequiredProperties;
    var bIsRequired = false;

    if (aRequiredProperties) {
      aRequiredProperties.forEach(function (oRequiredProperty) {
        if (sPropertyPath === (oRequiredProperty === null || oRequiredProperty === void 0 ? void 0 : oRequiredProperty.value)) {
          bIsRequired = true;
        }
      });
    }

    return bIsRequired;
  }

  _exports.getIsRequired = getIsRequired;

  function isPropertyFilterable(converterContext, valueListProperty) {
    var _capabilities2, _capabilities2$Filter;

    var bNotFilterable, bHidden;
    var entityType = converterContext.getEntityType();
    var entitySet = converterContext.getEntitySet();
    var entitySetAnnotations = entitySet === null || entitySet === void 0 ? void 0 : entitySet.annotations;
    var capabilities;

    if (!modelHelper.isSingleton(entitySet)) {
      capabilities = entitySetAnnotations === null || entitySetAnnotations === void 0 ? void 0 : entitySetAnnotations.Capabilities;
    }

    var nonFilterableProperties = (_capabilities2 = capabilities) === null || _capabilities2 === void 0 ? void 0 : (_capabilities2$Filter = _capabilities2.FilterRestrictions) === null || _capabilities2$Filter === void 0 ? void 0 : _capabilities2$Filter.NonFilterableProperties;
    var properties = entityType.entityProperties;
    properties.forEach(function (property) {
      var PropertyPath = property.name;

      if (PropertyPath === valueListProperty) {
        var _property$annotations, _property$annotations2, _property$annotations3;

        bHidden = (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf();
      }
    });

    if (nonFilterableProperties && nonFilterableProperties.length > 0) {
      for (var i = 0; i < nonFilterableProperties.length; i++) {
        var _nonFilterablePropert;

        var sPropertyName = (_nonFilterablePropert = nonFilterableProperties[i]) === null || _nonFilterablePropert === void 0 ? void 0 : _nonFilterablePropert.value;

        if (sPropertyName === valueListProperty) {
          bNotFilterable = true;
        }
      }
    }

    return bNotFilterable || bHidden;
  }

  _exports.isPropertyFilterable = isPropertyFilterable;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRJc1JlcXVpcmVkIiwiY29udmVydGVyQ29udGV4dCIsInNQcm9wZXJ0eVBhdGgiLCJlbnRpdHlTZXQiLCJnZXRFbnRpdHlTZXQiLCJlbnRpdHlTZXRBbm5vdGF0aW9ucyIsImFubm90YXRpb25zIiwiY2FwYWJpbGl0aWVzIiwibW9kZWxIZWxwZXIiLCJpc1NpbmdsZXRvbiIsIkNhcGFiaWxpdGllcyIsImFSZXF1aXJlZFByb3BlcnRpZXMiLCJGaWx0ZXJSZXN0cmljdGlvbnMiLCJSZXF1aXJlZFByb3BlcnRpZXMiLCJiSXNSZXF1aXJlZCIsImZvckVhY2giLCJvUmVxdWlyZWRQcm9wZXJ0eSIsInZhbHVlIiwiaXNQcm9wZXJ0eUZpbHRlcmFibGUiLCJ2YWx1ZUxpc3RQcm9wZXJ0eSIsImJOb3RGaWx0ZXJhYmxlIiwiYkhpZGRlbiIsImVudGl0eVR5cGUiLCJnZXRFbnRpdHlUeXBlIiwibm9uRmlsdGVyYWJsZVByb3BlcnRpZXMiLCJOb25GaWx0ZXJhYmxlUHJvcGVydGllcyIsInByb3BlcnRpZXMiLCJlbnRpdHlQcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJQcm9wZXJ0eVBhdGgiLCJuYW1lIiwiVUkiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwibGVuZ3RoIiwiaSIsInNQcm9wZXJ0eU5hbWUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkZpbHRlclRlbXBsYXRpbmcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9DYXBhYmlsaXRpZXNfRWRtXCI7XG5pbXBvcnQgdHlwZSBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCBtb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXNSZXF1aXJlZChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCBzUHJvcGVydHlQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0Y29uc3QgZW50aXR5U2V0QW5ub3RhdGlvbnMgPSBlbnRpdHlTZXQ/LmFubm90YXRpb25zO1xuXHRsZXQgY2FwYWJpbGl0aWVzO1xuXG5cdGlmICghbW9kZWxIZWxwZXIuaXNTaW5nbGV0b24oZW50aXR5U2V0KSkge1xuXHRcdGNhcGFiaWxpdGllcyA9IGVudGl0eVNldEFubm90YXRpb25zPy5DYXBhYmlsaXRpZXMgYXMgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzO1xuXHR9XG5cdGNvbnN0IGFSZXF1aXJlZFByb3BlcnRpZXMgPSBjYXBhYmlsaXRpZXM/LkZpbHRlclJlc3RyaWN0aW9ucz8uUmVxdWlyZWRQcm9wZXJ0aWVzIGFzIGFueVtdO1xuXHRsZXQgYklzUmVxdWlyZWQgPSBmYWxzZTtcblx0aWYgKGFSZXF1aXJlZFByb3BlcnRpZXMpIHtcblx0XHRhUmVxdWlyZWRQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKG9SZXF1aXJlZFByb3BlcnR5KSB7XG5cdFx0XHRpZiAoc1Byb3BlcnR5UGF0aCA9PT0gb1JlcXVpcmVkUHJvcGVydHk/LnZhbHVlKSB7XG5cdFx0XHRcdGJJc1JlcXVpcmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYklzUmVxdWlyZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5RmlsdGVyYWJsZShjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCB2YWx1ZUxpc3RQcm9wZXJ0eTogc3RyaW5nKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG5cdGxldCBiTm90RmlsdGVyYWJsZSwgYkhpZGRlbjtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBlbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRjb25zdCBlbnRpdHlTZXRBbm5vdGF0aW9ucyA9IGVudGl0eVNldD8uYW5ub3RhdGlvbnM7XG5cdGxldCBjYXBhYmlsaXRpZXM7XG5cdGlmICghbW9kZWxIZWxwZXIuaXNTaW5nbGV0b24oZW50aXR5U2V0KSkge1xuXHRcdGNhcGFiaWxpdGllcyA9IGVudGl0eVNldEFubm90YXRpb25zPy5DYXBhYmlsaXRpZXMgYXMgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzO1xuXHR9XG5cdGNvbnN0IG5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzID0gY2FwYWJpbGl0aWVzPy5GaWx0ZXJSZXN0cmljdGlvbnM/Lk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzIGFzIGFueVtdO1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzO1xuXHRwcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5OiBQcm9wZXJ0eSkgPT4ge1xuXHRcdGNvbnN0IFByb3BlcnR5UGF0aCA9IHByb3BlcnR5Lm5hbWU7XG5cdFx0aWYgKFByb3BlcnR5UGF0aCA9PT0gdmFsdWVMaXN0UHJvcGVydHkpIHtcblx0XHRcdGJIaWRkZW4gPSBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpO1xuXHRcdH1cblx0fSk7XG5cdGlmIChub25GaWx0ZXJhYmxlUHJvcGVydGllcyAmJiBub25GaWx0ZXJhYmxlUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBub25GaWx0ZXJhYmxlUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5TmFtZSA9IG5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzW2ldPy52YWx1ZTtcblx0XHRcdGlmIChzUHJvcGVydHlOYW1lID09PSB2YWx1ZUxpc3RQcm9wZXJ0eSkge1xuXHRcdFx0XHRiTm90RmlsdGVyYWJsZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBiTm90RmlsdGVyYWJsZSB8fCBiSGlkZGVuO1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUFLTyxTQUFTQSxhQUFULENBQXVCQyxnQkFBdkIsRUFBMkRDLGFBQTNELEVBQTJGO0lBQUE7O0lBQ2pHLElBQU1DLFNBQVMsR0FBR0YsZ0JBQWdCLENBQUNHLFlBQWpCLEVBQWxCO0lBQ0EsSUFBTUMsb0JBQW9CLEdBQUdGLFNBQUgsYUFBR0EsU0FBSCx1QkFBR0EsU0FBUyxDQUFFRyxXQUF4QztJQUNBLElBQUlDLFlBQUo7O0lBRUEsSUFBSSxDQUFDQyxXQUFXLENBQUNDLFdBQVosQ0FBd0JOLFNBQXhCLENBQUwsRUFBeUM7TUFDeENJLFlBQVksR0FBR0Ysb0JBQUgsYUFBR0Esb0JBQUgsdUJBQUdBLG9CQUFvQixDQUFFSyxZQUFyQztJQUNBOztJQUNELElBQU1DLG1CQUFtQixvQkFBR0osWUFBSCwyRUFBRyxjQUFjSyxrQkFBakIsMERBQUcsc0JBQWtDQyxrQkFBOUQ7SUFDQSxJQUFJQyxXQUFXLEdBQUcsS0FBbEI7O0lBQ0EsSUFBSUgsbUJBQUosRUFBeUI7TUFDeEJBLG1CQUFtQixDQUFDSSxPQUFwQixDQUE0QixVQUFVQyxpQkFBVixFQUE2QjtRQUN4RCxJQUFJZCxhQUFhLE1BQUtjLGlCQUFMLGFBQUtBLGlCQUFMLHVCQUFLQSxpQkFBaUIsQ0FBRUMsS0FBeEIsQ0FBakIsRUFBZ0Q7VUFDL0NILFdBQVcsR0FBRyxJQUFkO1FBQ0E7TUFDRCxDQUpEO0lBS0E7O0lBQ0QsT0FBT0EsV0FBUDtFQUNBOzs7O0VBRU0sU0FBU0ksb0JBQVQsQ0FBOEJqQixnQkFBOUIsRUFBa0VrQixpQkFBbEUsRUFBa0g7SUFBQTs7SUFDeEgsSUFBSUMsY0FBSixFQUFvQkMsT0FBcEI7SUFDQSxJQUFNQyxVQUFVLEdBQUdyQixnQkFBZ0IsQ0FBQ3NCLGFBQWpCLEVBQW5CO0lBQ0EsSUFBTXBCLFNBQVMsR0FBR0YsZ0JBQWdCLENBQUNHLFlBQWpCLEVBQWxCO0lBQ0EsSUFBTUMsb0JBQW9CLEdBQUdGLFNBQUgsYUFBR0EsU0FBSCx1QkFBR0EsU0FBUyxDQUFFRyxXQUF4QztJQUNBLElBQUlDLFlBQUo7O0lBQ0EsSUFBSSxDQUFDQyxXQUFXLENBQUNDLFdBQVosQ0FBd0JOLFNBQXhCLENBQUwsRUFBeUM7TUFDeENJLFlBQVksR0FBR0Ysb0JBQUgsYUFBR0Esb0JBQUgsdUJBQUdBLG9CQUFvQixDQUFFSyxZQUFyQztJQUNBOztJQUNELElBQU1jLHVCQUF1QixxQkFBR2pCLFlBQUgsNEVBQUcsZUFBY0ssa0JBQWpCLDBEQUFHLHNCQUFrQ2EsdUJBQWxFO0lBQ0EsSUFBTUMsVUFBVSxHQUFHSixVQUFVLENBQUNLLGdCQUE5QjtJQUNBRCxVQUFVLENBQUNYLE9BQVgsQ0FBbUIsVUFBQ2EsUUFBRCxFQUF3QjtNQUMxQyxJQUFNQyxZQUFZLEdBQUdELFFBQVEsQ0FBQ0UsSUFBOUI7O01BQ0EsSUFBSUQsWUFBWSxLQUFLVixpQkFBckIsRUFBd0M7UUFBQTs7UUFDdkNFLE9BQU8sNEJBQUdPLFFBQVEsQ0FBQ3RCLFdBQVosb0ZBQUcsc0JBQXNCeUIsRUFBekIscUZBQUcsdUJBQTBCQyxNQUE3QiwyREFBRyx1QkFBa0NDLE9BQWxDLEVBQVY7TUFDQTtJQUNELENBTEQ7O0lBTUEsSUFBSVQsdUJBQXVCLElBQUlBLHVCQUF1QixDQUFDVSxNQUF4QixHQUFpQyxDQUFoRSxFQUFtRTtNQUNsRSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdYLHVCQUF1QixDQUFDVSxNQUE1QyxFQUFvREMsQ0FBQyxFQUFyRCxFQUF5RDtRQUFBOztRQUN4RCxJQUFNQyxhQUFhLDRCQUFHWix1QkFBdUIsQ0FBQ1csQ0FBRCxDQUExQiwwREFBRyxzQkFBNEJsQixLQUFsRDs7UUFDQSxJQUFJbUIsYUFBYSxLQUFLakIsaUJBQXRCLEVBQXlDO1VBQ3hDQyxjQUFjLEdBQUcsSUFBakI7UUFDQTtNQUNEO0lBQ0Q7O0lBQ0QsT0FBT0EsY0FBYyxJQUFJQyxPQUF6QjtFQUNBIn0=