/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var IssueSeverity;

  (function (IssueSeverity) {
    IssueSeverity[IssueSeverity["High"] = 0] = "High";
    IssueSeverity[IssueSeverity["Low"] = 1] = "Low";
    IssueSeverity[IssueSeverity["Medium"] = 2] = "Medium";
  })(IssueSeverity || (IssueSeverity = {}));

  _exports.IssueSeverity = IssueSeverity;
  var IssueCategoryType = {
    Facets: {
      MissingID: "MissingID",
      UnSupportedLevel: "UnsupportedLevel"
    },
    AnnotationColumns: {
      InvalidKey: "InvalidKey"
    },
    Annotations: {
      IgnoredAnnotation: "IgnoredAnnotation"
    }
  };
  _exports.IssueCategoryType = IssueCategoryType;
  var IssueCategory;

  (function (IssueCategory) {
    IssueCategory["Annotation"] = "Annotation";
    IssueCategory["Template"] = "Template";
    IssueCategory["Manifest"] = "Manifest";
    IssueCategory["Facets"] = "Facets";
  })(IssueCategory || (IssueCategory = {}));

  _exports.IssueCategory = IssueCategory;
  var IssueType = {
    MISSING_LINEITEM: "We couldn't find a line item annotation for the current entitySet, you should consider adding one.",
    MISSING_SELECTIONFIELD: "Defined Selection Field is not found",
    MALFORMED_DATAFIELD_FOR_IBN: {
      REQUIRESCONTEXT: "DataFieldForIntentBasedNavigation cannot use requires context in form/header.",
      INLINE: "DataFieldForIntentBasedNavigation cannot use Inline in form/header.",
      DETERMINING: "DataFieldForIntentBasedNavigation cannot use Determining in form/header."
    },
    MALFORMED_VISUALFILTERS: {
      VALUELIST: "ValueList Path mentioned in the manifest is not found",
      PRESENTATIONVARIANT: "Presentation Variant Annotation is missing for the VisualFilters",
      CHART: "Chart Annotation is missing from the PV configured for the VisualFilters",
      VALUELISTCONFIG: "ValueList is not been configured inside the Visual Filter Settings"
    },
    FULLSCREENMODE_NOT_ON_LISTREPORT: "enableFullScreenMode is not supported on list report pages.",
    KPI_ISSUES: {
      KPI_NOT_FOUND: "Couldn't find KPI or SPV with qualifier ",
      KPI_DETAIL_NOT_FOUND: "Can't find proper datapoint or chart definition for KPI ",
      NO_ANALYTICS: "The following entitySet used in a KPI definition doesn't support $apply queries:",
      MAIN_PROPERTY_NOT_AGGREGATABLE: "Main property used in KPI cannot be aggregated "
    }
  };
  _exports.IssueType = IssueType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJc3N1ZVNldmVyaXR5IiwiSXNzdWVDYXRlZ29yeVR5cGUiLCJGYWNldHMiLCJNaXNzaW5nSUQiLCJVblN1cHBvcnRlZExldmVsIiwiQW5ub3RhdGlvbkNvbHVtbnMiLCJJbnZhbGlkS2V5IiwiQW5ub3RhdGlvbnMiLCJJZ25vcmVkQW5ub3RhdGlvbiIsIklzc3VlQ2F0ZWdvcnkiLCJJc3N1ZVR5cGUiLCJNSVNTSU5HX0xJTkVJVEVNIiwiTUlTU0lOR19TRUxFQ1RJT05GSUVMRCIsIk1BTEZPUk1FRF9EQVRBRklFTERfRk9SX0lCTiIsIlJFUVVJUkVTQ09OVEVYVCIsIklOTElORSIsIkRFVEVSTUlOSU5HIiwiTUFMRk9STUVEX1ZJU1VBTEZJTFRFUlMiLCJWQUxVRUxJU1QiLCJQUkVTRU5UQVRJT05WQVJJQU5UIiwiQ0hBUlQiLCJWQUxVRUxJU1RDT05GSUciLCJGVUxMU0NSRUVOTU9ERV9OT1RfT05fTElTVFJFUE9SVCIsIktQSV9JU1NVRVMiLCJLUElfTk9UX0ZPVU5EIiwiS1BJX0RFVEFJTF9OT1RfRk9VTkQiLCJOT19BTkFMWVRJQ1MiLCJNQUlOX1BST1BFUlRZX05PVF9BR0dSRUdBVEFCTEUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIklzc3VlTWFuYWdlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBJc3N1ZVNldmVyaXR5IHtcblx0SGlnaCxcblx0TG93LFxuXHRNZWRpdW1cbn1cblxuZXhwb3J0IGNvbnN0IElzc3VlQ2F0ZWdvcnlUeXBlID0ge1xuXHRGYWNldHM6IHtcblx0XHRNaXNzaW5nSUQ6IFwiTWlzc2luZ0lEXCIsXG5cdFx0VW5TdXBwb3J0ZWRMZXZlbDogXCJVbnN1cHBvcnRlZExldmVsXCJcblx0fSxcblx0QW5ub3RhdGlvbkNvbHVtbnM6IHtcblx0XHRJbnZhbGlkS2V5OiBcIkludmFsaWRLZXlcIlxuXHR9LFxuXHRBbm5vdGF0aW9uczoge1xuXHRcdElnbm9yZWRBbm5vdGF0aW9uOiBcIklnbm9yZWRBbm5vdGF0aW9uXCJcblx0fVxufTtcblxuZXhwb3J0IGVudW0gSXNzdWVDYXRlZ29yeSB7XG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIixcblx0VGVtcGxhdGUgPSBcIlRlbXBsYXRlXCIsXG5cdE1hbmlmZXN0ID0gXCJNYW5pZmVzdFwiLFxuXHRGYWNldHMgPSBcIkZhY2V0c1wiXG59XG5leHBvcnQgY29uc3QgSXNzdWVUeXBlID0ge1xuXHRNSVNTSU5HX0xJTkVJVEVNOiBcIldlIGNvdWxkbid0IGZpbmQgYSBsaW5lIGl0ZW0gYW5ub3RhdGlvbiBmb3IgdGhlIGN1cnJlbnQgZW50aXR5U2V0LCB5b3Ugc2hvdWxkIGNvbnNpZGVyIGFkZGluZyBvbmUuXCIsXG5cdE1JU1NJTkdfU0VMRUNUSU9ORklFTEQ6IFwiRGVmaW5lZCBTZWxlY3Rpb24gRmllbGQgaXMgbm90IGZvdW5kXCIsXG5cdE1BTEZPUk1FRF9EQVRBRklFTERfRk9SX0lCTjoge1xuXHRcdFJFUVVJUkVTQ09OVEVYVDogXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gY2Fubm90IHVzZSByZXF1aXJlcyBjb250ZXh0IGluIGZvcm0vaGVhZGVyLlwiLFxuXHRcdElOTElORTogXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gY2Fubm90IHVzZSBJbmxpbmUgaW4gZm9ybS9oZWFkZXIuXCIsXG5cdFx0REVURVJNSU5JTkc6IFwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIGNhbm5vdCB1c2UgRGV0ZXJtaW5pbmcgaW4gZm9ybS9oZWFkZXIuXCJcblx0fSxcblx0TUFMRk9STUVEX1ZJU1VBTEZJTFRFUlM6IHtcblx0XHRWQUxVRUxJU1Q6IFwiVmFsdWVMaXN0IFBhdGggbWVudGlvbmVkIGluIHRoZSBtYW5pZmVzdCBpcyBub3QgZm91bmRcIixcblx0XHRQUkVTRU5UQVRJT05WQVJJQU5UOiBcIlByZXNlbnRhdGlvbiBWYXJpYW50IEFubm90YXRpb24gaXMgbWlzc2luZyBmb3IgdGhlIFZpc3VhbEZpbHRlcnNcIixcblx0XHRDSEFSVDogXCJDaGFydCBBbm5vdGF0aW9uIGlzIG1pc3NpbmcgZnJvbSB0aGUgUFYgY29uZmlndXJlZCBmb3IgdGhlIFZpc3VhbEZpbHRlcnNcIixcblx0XHRWQUxVRUxJU1RDT05GSUc6IFwiVmFsdWVMaXN0IGlzIG5vdCBiZWVuIGNvbmZpZ3VyZWQgaW5zaWRlIHRoZSBWaXN1YWwgRmlsdGVyIFNldHRpbmdzXCJcblx0fSxcblx0RlVMTFNDUkVFTk1PREVfTk9UX09OX0xJU1RSRVBPUlQ6IFwiZW5hYmxlRnVsbFNjcmVlbk1vZGUgaXMgbm90IHN1cHBvcnRlZCBvbiBsaXN0IHJlcG9ydCBwYWdlcy5cIixcblx0S1BJX0lTU1VFUzoge1xuXHRcdEtQSV9OT1RfRk9VTkQ6IFwiQ291bGRuJ3QgZmluZCBLUEkgb3IgU1BWIHdpdGggcXVhbGlmaWVyIFwiLFxuXHRcdEtQSV9ERVRBSUxfTk9UX0ZPVU5EOiBcIkNhbid0IGZpbmQgcHJvcGVyIGRhdGFwb2ludCBvciBjaGFydCBkZWZpbml0aW9uIGZvciBLUEkgXCIsXG5cdFx0Tk9fQU5BTFlUSUNTOiBcIlRoZSBmb2xsb3dpbmcgZW50aXR5U2V0IHVzZWQgaW4gYSBLUEkgZGVmaW5pdGlvbiBkb2Vzbid0IHN1cHBvcnQgJGFwcGx5IHF1ZXJpZXM6XCIsXG5cdFx0TUFJTl9QUk9QRVJUWV9OT1RfQUdHUkVHQVRBQkxFOiBcIk1haW4gcHJvcGVydHkgdXNlZCBpbiBLUEkgY2Fubm90IGJlIGFnZ3JlZ2F0ZWQgXCJcblx0fVxufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7O01BQVlBLGE7O2FBQUFBLGE7SUFBQUEsYSxDQUFBQSxhO0lBQUFBLGEsQ0FBQUEsYTtJQUFBQSxhLENBQUFBLGE7S0FBQUEsYSxLQUFBQSxhOzs7RUFNTCxJQUFNQyxpQkFBaUIsR0FBRztJQUNoQ0MsTUFBTSxFQUFFO01BQ1BDLFNBQVMsRUFBRSxXQURKO01BRVBDLGdCQUFnQixFQUFFO0lBRlgsQ0FEd0I7SUFLaENDLGlCQUFpQixFQUFFO01BQ2xCQyxVQUFVLEVBQUU7SUFETSxDQUxhO0lBUWhDQyxXQUFXLEVBQUU7TUFDWkMsaUJBQWlCLEVBQUU7SUFEUDtFQVJtQixDQUExQjs7TUFhS0MsYTs7YUFBQUEsYTtJQUFBQSxhO0lBQUFBLGE7SUFBQUEsYTtJQUFBQSxhO0tBQUFBLGEsS0FBQUEsYTs7O0VBTUwsSUFBTUMsU0FBUyxHQUFHO0lBQ3hCQyxnQkFBZ0IsRUFBRSxvR0FETTtJQUV4QkMsc0JBQXNCLEVBQUUsc0NBRkE7SUFHeEJDLDJCQUEyQixFQUFFO01BQzVCQyxlQUFlLEVBQUUsK0VBRFc7TUFFNUJDLE1BQU0sRUFBRSxxRUFGb0I7TUFHNUJDLFdBQVcsRUFBRTtJQUhlLENBSEw7SUFReEJDLHVCQUF1QixFQUFFO01BQ3hCQyxTQUFTLEVBQUUsdURBRGE7TUFFeEJDLG1CQUFtQixFQUFFLGtFQUZHO01BR3hCQyxLQUFLLEVBQUUsMEVBSGlCO01BSXhCQyxlQUFlLEVBQUU7SUFKTyxDQVJEO0lBY3hCQyxnQ0FBZ0MsRUFBRSw2REFkVjtJQWV4QkMsVUFBVSxFQUFFO01BQ1hDLGFBQWEsRUFBRSwwQ0FESjtNQUVYQyxvQkFBb0IsRUFBRSwwREFGWDtNQUdYQyxZQUFZLEVBQUUsa0ZBSEg7TUFJWEMsOEJBQThCLEVBQUU7SUFKckI7RUFmWSxDQUFsQiJ9