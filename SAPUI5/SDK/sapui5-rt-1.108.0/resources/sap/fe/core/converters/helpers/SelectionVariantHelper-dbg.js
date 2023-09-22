/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function getRangeDefinition(range, propertyType) {
    var operator;
    var bInclude = range.Sign === "UI.SelectionRangeSignType/I" ? true : false;

    switch (range.Option) {
      case "UI.SelectionRangeOptionType/BT":
        operator = bInclude ? "BT" : "NB";
        break;

      case "UI.SelectionRangeOptionType/CP":
        operator = bInclude ? "Contains" : "NotContains";
        break;

      case "UI.SelectionRangeOptionType/EQ":
        operator = bInclude ? "EQ" : "NE";
        break;

      case "UI.SelectionRangeOptionType/GE":
        operator = bInclude ? "GE" : "LT";
        break;

      case "UI.SelectionRangeOptionType/GT":
        operator = bInclude ? "GT" : "LE";
        break;

      case "UI.SelectionRangeOptionType/LE":
        operator = bInclude ? "LE" : "GT";
        break;

      case "UI.SelectionRangeOptionType/LT":
        operator = bInclude ? "LT" : "GE";
        break;

      case "UI.SelectionRangeOptionType/NB":
        operator = bInclude ? "NB" : "BT";
        break;

      case "UI.SelectionRangeOptionType/NE":
        operator = bInclude ? "NE" : "EQ";
        break;

      case "UI.SelectionRangeOptionType/NP":
        operator = bInclude ? "NotContains" : "Contains";
        break;

      default:
        operator = "EQ";
    }

    return {
      operator: operator,
      rangeLow: propertyType && propertyType.indexOf("Edm.Date") === 0 ? new Date(range.Low) : range.Low,
      rangeHigh: range.High && propertyType && propertyType.indexOf("Edm.Date") === 0 ? new Date(range.High) : range.High
    };
  }
  /**
   * Parses a SelectionVariant annotations and creates the corresponding filter definitions.
   *
   * @param selectionVariant SelectionVariant annotation
   * @returns Returns an array of filter definitions corresponding to the SelectionVariant.
   */


  function getFilterDefinitionsFromSelectionVariant(selectionVariant) {
    var aFilterDefs = [];

    if (selectionVariant.SelectOptions) {
      selectionVariant.SelectOptions.forEach(function (selectOption) {
        if (selectOption.PropertyName && selectOption.Ranges.length > 0) {
          aFilterDefs.push({
            propertyPath: selectOption.PropertyName.value,
            propertyType: selectOption.PropertyName.$target.type,
            ranges: selectOption.Ranges.map(function (range) {
              var _selectOption$Propert;

              return getRangeDefinition(range, (_selectOption$Propert = selectOption.PropertyName) === null || _selectOption$Propert === void 0 ? void 0 : _selectOption$Propert.$target.type);
            })
          });
        }
      });
    }

    return aFilterDefs;
  }

  _exports.getFilterDefinitionsFromSelectionVariant = getFilterDefinitionsFromSelectionVariant;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRSYW5nZURlZmluaXRpb24iLCJyYW5nZSIsInByb3BlcnR5VHlwZSIsIm9wZXJhdG9yIiwiYkluY2x1ZGUiLCJTaWduIiwiT3B0aW9uIiwicmFuZ2VMb3ciLCJpbmRleE9mIiwiRGF0ZSIsIkxvdyIsInJhbmdlSGlnaCIsIkhpZ2giLCJnZXRGaWx0ZXJEZWZpbml0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50Iiwic2VsZWN0aW9uVmFyaWFudCIsImFGaWx0ZXJEZWZzIiwiU2VsZWN0T3B0aW9ucyIsImZvckVhY2giLCJzZWxlY3RPcHRpb24iLCJQcm9wZXJ0eU5hbWUiLCJSYW5nZXMiLCJsZW5ndGgiLCJwdXNoIiwicHJvcGVydHlQYXRoIiwidmFsdWUiLCIkdGFyZ2V0IiwidHlwZSIsInJhbmdlcyIsIm1hcCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2VsZWN0aW9uVmFyaWFudEhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNlbGVjdGlvblJhbmdlVHlwZSwgU2VsZWN0aW9uVmFyaWFudFR5cGUgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5cbmV4cG9ydCB0eXBlIFJhbmdlRGVmaW5pdGlvbiA9IHtcblx0b3BlcmF0b3I6IHN0cmluZztcblx0cmFuZ2VMb3c6IGFueTtcblx0cmFuZ2VIaWdoPzogYW55O1xufTtcblxuZXhwb3J0IHR5cGUgRmlsdGVyRGVmaW5pdGlvbiA9IHtcblx0cHJvcGVydHlQYXRoOiBzdHJpbmc7XG5cdHByb3BlcnR5VHlwZTogc3RyaW5nO1xuXHRyYW5nZXM6IFJhbmdlRGVmaW5pdGlvbltdO1xufTtcblxuZnVuY3Rpb24gZ2V0UmFuZ2VEZWZpbml0aW9uKHJhbmdlOiBTZWxlY3Rpb25SYW5nZVR5cGUsIHByb3BlcnR5VHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogUmFuZ2VEZWZpbml0aW9uIHtcblx0bGV0IG9wZXJhdG9yOiBTdHJpbmc7XG5cdGNvbnN0IGJJbmNsdWRlID0gcmFuZ2UuU2lnbiA9PT0gXCJVSS5TZWxlY3Rpb25SYW5nZVNpZ25UeXBlL0lcIiA/IHRydWUgOiBmYWxzZTtcblxuXHRzd2l0Y2ggKHJhbmdlLk9wdGlvbiBhcyBzdHJpbmcpIHtcblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0JUXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJCVFwiIDogXCJOQlwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0NQXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJDb250YWluc1wiIDogXCJOb3RDb250YWluc1wiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0VRXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJFUVwiIDogXCJORVwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0dFXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJHRVwiIDogXCJMVFwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0dUXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJHVFwiIDogXCJMRVwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0xFXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJMRVwiIDogXCJHVFwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL0xUXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJMVFwiIDogXCJHRVwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL05CXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJOQlwiIDogXCJCVFwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL05FXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJORVwiIDogXCJFUVwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiVUkuU2VsZWN0aW9uUmFuZ2VPcHRpb25UeXBlL05QXCI6XG5cdFx0XHRvcGVyYXRvciA9IGJJbmNsdWRlID8gXCJOb3RDb250YWluc1wiIDogXCJDb250YWluc1wiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0b3BlcmF0b3IgPSBcIkVRXCI7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG9wZXJhdG9yOiBvcGVyYXRvciBhcyBzdHJpbmcsXG5cdFx0cmFuZ2VMb3c6IHByb3BlcnR5VHlwZSAmJiBwcm9wZXJ0eVR5cGUuaW5kZXhPZihcIkVkbS5EYXRlXCIpID09PSAwID8gbmV3IERhdGUocmFuZ2UuTG93KSA6IHJhbmdlLkxvdyxcblx0XHRyYW5nZUhpZ2g6IHJhbmdlLkhpZ2ggJiYgcHJvcGVydHlUeXBlICYmIHByb3BlcnR5VHlwZS5pbmRleE9mKFwiRWRtLkRhdGVcIikgPT09IDAgPyBuZXcgRGF0ZShyYW5nZS5IaWdoKSA6IHJhbmdlLkhpZ2hcblx0fTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBTZWxlY3Rpb25WYXJpYW50IGFubm90YXRpb25zIGFuZCBjcmVhdGVzIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBkZWZpbml0aW9ucy5cbiAqXG4gKiBAcGFyYW0gc2VsZWN0aW9uVmFyaWFudCBTZWxlY3Rpb25WYXJpYW50IGFubm90YXRpb25cbiAqIEByZXR1cm5zIFJldHVybnMgYW4gYXJyYXkgb2YgZmlsdGVyIGRlZmluaXRpb25zIGNvcnJlc3BvbmRpbmcgdG8gdGhlIFNlbGVjdGlvblZhcmlhbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJEZWZpbml0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50KHNlbGVjdGlvblZhcmlhbnQ6IFNlbGVjdGlvblZhcmlhbnRUeXBlKTogRmlsdGVyRGVmaW5pdGlvbltdIHtcblx0Y29uc3QgYUZpbHRlckRlZnM6IEZpbHRlckRlZmluaXRpb25bXSA9IFtdO1xuXG5cdGlmIChzZWxlY3Rpb25WYXJpYW50LlNlbGVjdE9wdGlvbnMpIHtcblx0XHRzZWxlY3Rpb25WYXJpYW50LlNlbGVjdE9wdGlvbnMuZm9yRWFjaCgoc2VsZWN0T3B0aW9uKSA9PiB7XG5cdFx0XHRpZiAoc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZSAmJiBzZWxlY3RPcHRpb24uUmFuZ2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0YUZpbHRlckRlZnMucHVzaCh7XG5cdFx0XHRcdFx0cHJvcGVydHlQYXRoOiBzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lLnZhbHVlLFxuXHRcdFx0XHRcdHByb3BlcnR5VHlwZTogc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZS4kdGFyZ2V0LnR5cGUsXG5cdFx0XHRcdFx0cmFuZ2VzOiBzZWxlY3RPcHRpb24uUmFuZ2VzLm1hcCgocmFuZ2UpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBnZXRSYW5nZURlZmluaXRpb24ocmFuZ2UsIHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWU/LiR0YXJnZXQudHlwZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gYUZpbHRlckRlZnM7XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQWNBLFNBQVNBLGtCQUFULENBQTRCQyxLQUE1QixFQUF1REMsWUFBdkQsRUFBMEc7SUFDekcsSUFBSUMsUUFBSjtJQUNBLElBQU1DLFFBQVEsR0FBR0gsS0FBSyxDQUFDSSxJQUFOLEtBQWUsNkJBQWYsR0FBK0MsSUFBL0MsR0FBc0QsS0FBdkU7O0lBRUEsUUFBUUosS0FBSyxDQUFDSyxNQUFkO01BQ0MsS0FBSyxnQ0FBTDtRQUNDSCxRQUFRLEdBQUdDLFFBQVEsR0FBRyxJQUFILEdBQVUsSUFBN0I7UUFDQTs7TUFFRCxLQUFLLGdDQUFMO1FBQ0NELFFBQVEsR0FBR0MsUUFBUSxHQUFHLFVBQUgsR0FBZ0IsYUFBbkM7UUFDQTs7TUFFRCxLQUFLLGdDQUFMO1FBQ0NELFFBQVEsR0FBR0MsUUFBUSxHQUFHLElBQUgsR0FBVSxJQUE3QjtRQUNBOztNQUVELEtBQUssZ0NBQUw7UUFDQ0QsUUFBUSxHQUFHQyxRQUFRLEdBQUcsSUFBSCxHQUFVLElBQTdCO1FBQ0E7O01BRUQsS0FBSyxnQ0FBTDtRQUNDRCxRQUFRLEdBQUdDLFFBQVEsR0FBRyxJQUFILEdBQVUsSUFBN0I7UUFDQTs7TUFFRCxLQUFLLGdDQUFMO1FBQ0NELFFBQVEsR0FBR0MsUUFBUSxHQUFHLElBQUgsR0FBVSxJQUE3QjtRQUNBOztNQUVELEtBQUssZ0NBQUw7UUFDQ0QsUUFBUSxHQUFHQyxRQUFRLEdBQUcsSUFBSCxHQUFVLElBQTdCO1FBQ0E7O01BRUQsS0FBSyxnQ0FBTDtRQUNDRCxRQUFRLEdBQUdDLFFBQVEsR0FBRyxJQUFILEdBQVUsSUFBN0I7UUFDQTs7TUFFRCxLQUFLLGdDQUFMO1FBQ0NELFFBQVEsR0FBR0MsUUFBUSxHQUFHLElBQUgsR0FBVSxJQUE3QjtRQUNBOztNQUVELEtBQUssZ0NBQUw7UUFDQ0QsUUFBUSxHQUFHQyxRQUFRLEdBQUcsYUFBSCxHQUFtQixVQUF0QztRQUNBOztNQUVEO1FBQ0NELFFBQVEsR0FBRyxJQUFYO0lBMUNGOztJQTZDQSxPQUFPO01BQ05BLFFBQVEsRUFBRUEsUUFESjtNQUVOSSxRQUFRLEVBQUVMLFlBQVksSUFBSUEsWUFBWSxDQUFDTSxPQUFiLENBQXFCLFVBQXJCLE1BQXFDLENBQXJELEdBQXlELElBQUlDLElBQUosQ0FBU1IsS0FBSyxDQUFDUyxHQUFmLENBQXpELEdBQStFVCxLQUFLLENBQUNTLEdBRnpGO01BR05DLFNBQVMsRUFBRVYsS0FBSyxDQUFDVyxJQUFOLElBQWNWLFlBQWQsSUFBOEJBLFlBQVksQ0FBQ00sT0FBYixDQUFxQixVQUFyQixNQUFxQyxDQUFuRSxHQUF1RSxJQUFJQyxJQUFKLENBQVNSLEtBQUssQ0FBQ1csSUFBZixDQUF2RSxHQUE4RlgsS0FBSyxDQUFDVztJQUh6RyxDQUFQO0VBS0E7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztFQUNPLFNBQVNDLHdDQUFULENBQWtEQyxnQkFBbEQsRUFBOEc7SUFDcEgsSUFBTUMsV0FBK0IsR0FBRyxFQUF4Qzs7SUFFQSxJQUFJRCxnQkFBZ0IsQ0FBQ0UsYUFBckIsRUFBb0M7TUFDbkNGLGdCQUFnQixDQUFDRSxhQUFqQixDQUErQkMsT0FBL0IsQ0FBdUMsVUFBQ0MsWUFBRCxFQUFrQjtRQUN4RCxJQUFJQSxZQUFZLENBQUNDLFlBQWIsSUFBNkJELFlBQVksQ0FBQ0UsTUFBYixDQUFvQkMsTUFBcEIsR0FBNkIsQ0FBOUQsRUFBaUU7VUFDaEVOLFdBQVcsQ0FBQ08sSUFBWixDQUFpQjtZQUNoQkMsWUFBWSxFQUFFTCxZQUFZLENBQUNDLFlBQWIsQ0FBMEJLLEtBRHhCO1lBRWhCdEIsWUFBWSxFQUFFZ0IsWUFBWSxDQUFDQyxZQUFiLENBQTBCTSxPQUExQixDQUFrQ0MsSUFGaEM7WUFHaEJDLE1BQU0sRUFBRVQsWUFBWSxDQUFDRSxNQUFiLENBQW9CUSxHQUFwQixDQUF3QixVQUFDM0IsS0FBRCxFQUFXO2NBQUE7O2NBQzFDLE9BQU9ELGtCQUFrQixDQUFDQyxLQUFELDJCQUFRaUIsWUFBWSxDQUFDQyxZQUFyQiwwREFBUSxzQkFBMkJNLE9BQTNCLENBQW1DQyxJQUEzQyxDQUF6QjtZQUNBLENBRk87VUFIUSxDQUFqQjtRQU9BO01BQ0QsQ0FWRDtJQVdBOztJQUVELE9BQU9YLFdBQVA7RUFDQSJ9