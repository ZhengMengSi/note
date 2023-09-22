/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
  "use strict";

  var ExcelFormatHelper = {
    /**
     * Method for converting JS Date format to Excel custom date format.
     *
     * @returns Format for the Date column to be used on excel.
     */
    getExcelDatefromJSDate: function () {
      // Get date Format(pattern), which will be used for date format mapping between sapui5 and excel.
      // UI5_ANY
      var sJSDateFormat = DateFormat.getDateInstance().oFormatOptions.pattern.toLowerCase();

      if (sJSDateFormat) {
        // Checking for the existence of single 'y' in the pattern.
        var regex = /^[^y]*y[^y]*$/m;

        if (regex.exec(sJSDateFormat)) {
          sJSDateFormat = sJSDateFormat.replace("y", "yyyy");
        }
      }

      return sJSDateFormat;
    },
    getExcelDateTimefromJSDateTime: function () {
      // Get date Format(pattern), which will be used for date time format mapping between sapui5 and excel.
      // UI5_ANY
      var sJSDateTimeFormat = DateFormat.getDateTimeInstance().oFormatOptions.pattern.toLowerCase();

      if (sJSDateTimeFormat) {
        // Checking for the existence of single 'y' in the pattern.
        var regexYear = /^[^y]*y[^y]*$/m;

        if (regexYear.exec(sJSDateTimeFormat)) {
          sJSDateTimeFormat = sJSDateTimeFormat.replace("y", "yyyy");
        }

        if (sJSDateTimeFormat.includes("a")) {
          sJSDateTimeFormat = sJSDateTimeFormat.replace("a", "AM/PM");
        }
      }

      return sJSDateTimeFormat;
    },
    getExcelTimefromJSTime: function () {
      // Get date Format(pattern), which will be used for date time format mapping between sapui5 and excel.
      // UI5_ANY
      var sJSTimeFormat = DateFormat.getTimeInstance().oFormatOptions.pattern;

      if (sJSTimeFormat && sJSTimeFormat.includes("a")) {
        sJSTimeFormat = sJSTimeFormat.replace("a", "AM/PM");
      }

      return sJSTimeFormat;
    }
  };
  return ExcelFormatHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFeGNlbEZvcm1hdEhlbHBlciIsImdldEV4Y2VsRGF0ZWZyb21KU0RhdGUiLCJzSlNEYXRlRm9ybWF0IiwiRGF0ZUZvcm1hdCIsImdldERhdGVJbnN0YW5jZSIsIm9Gb3JtYXRPcHRpb25zIiwicGF0dGVybiIsInRvTG93ZXJDYXNlIiwicmVnZXgiLCJleGVjIiwicmVwbGFjZSIsImdldEV4Y2VsRGF0ZVRpbWVmcm9tSlNEYXRlVGltZSIsInNKU0RhdGVUaW1lRm9ybWF0IiwiZ2V0RGF0ZVRpbWVJbnN0YW5jZSIsInJlZ2V4WWVhciIsImluY2x1ZGVzIiwiZ2V0RXhjZWxUaW1lZnJvbUpTVGltZSIsInNKU1RpbWVGb3JtYXQiLCJnZXRUaW1lSW5zdGFuY2UiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkV4Y2VsRm9ybWF0SGVscGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRlRm9ybWF0IGZyb20gXCJzYXAvdWkvY29yZS9mb3JtYXQvRGF0ZUZvcm1hdFwiO1xuXG5jb25zdCBFeGNlbEZvcm1hdEhlbHBlciA9IHtcblx0LyoqXG5cdCAqIE1ldGhvZCBmb3IgY29udmVydGluZyBKUyBEYXRlIGZvcm1hdCB0byBFeGNlbCBjdXN0b20gZGF0ZSBmb3JtYXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIEZvcm1hdCBmb3IgdGhlIERhdGUgY29sdW1uIHRvIGJlIHVzZWQgb24gZXhjZWwuXG5cdCAqL1xuXHRnZXRFeGNlbERhdGVmcm9tSlNEYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gR2V0IGRhdGUgRm9ybWF0KHBhdHRlcm4pLCB3aGljaCB3aWxsIGJlIHVzZWQgZm9yIGRhdGUgZm9ybWF0IG1hcHBpbmcgYmV0d2VlbiBzYXB1aTUgYW5kIGV4Y2VsLlxuXHRcdC8vIFVJNV9BTllcblx0XHRsZXQgc0pTRGF0ZUZvcm1hdCA9IChEYXRlRm9ybWF0LmdldERhdGVJbnN0YW5jZSgpIGFzIGFueSkub0Zvcm1hdE9wdGlvbnMucGF0dGVybi50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmIChzSlNEYXRlRm9ybWF0KSB7XG5cdFx0XHQvLyBDaGVja2luZyBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBzaW5nbGUgJ3knIGluIHRoZSBwYXR0ZXJuLlxuXHRcdFx0Y29uc3QgcmVnZXggPSAvXlteeV0qeVteeV0qJC9tO1xuXHRcdFx0aWYgKHJlZ2V4LmV4ZWMoc0pTRGF0ZUZvcm1hdCkpIHtcblx0XHRcdFx0c0pTRGF0ZUZvcm1hdCA9IHNKU0RhdGVGb3JtYXQucmVwbGFjZShcInlcIiwgXCJ5eXl5XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gc0pTRGF0ZUZvcm1hdDtcblx0fSxcblx0Z2V0RXhjZWxEYXRlVGltZWZyb21KU0RhdGVUaW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gR2V0IGRhdGUgRm9ybWF0KHBhdHRlcm4pLCB3aGljaCB3aWxsIGJlIHVzZWQgZm9yIGRhdGUgdGltZSBmb3JtYXQgbWFwcGluZyBiZXR3ZWVuIHNhcHVpNSBhbmQgZXhjZWwuXG5cdFx0Ly8gVUk1X0FOWVxuXHRcdGxldCBzSlNEYXRlVGltZUZvcm1hdCA9IChEYXRlRm9ybWF0LmdldERhdGVUaW1lSW5zdGFuY2UoKSBhcyBhbnkpLm9Gb3JtYXRPcHRpb25zLnBhdHRlcm4udG9Mb3dlckNhc2UoKTtcblx0XHRpZiAoc0pTRGF0ZVRpbWVGb3JtYXQpIHtcblx0XHRcdC8vIENoZWNraW5nIGZvciB0aGUgZXhpc3RlbmNlIG9mIHNpbmdsZSAneScgaW4gdGhlIHBhdHRlcm4uXG5cdFx0XHRjb25zdCByZWdleFllYXIgPSAvXlteeV0qeVteeV0qJC9tO1xuXHRcdFx0aWYgKHJlZ2V4WWVhci5leGVjKHNKU0RhdGVUaW1lRm9ybWF0KSkge1xuXHRcdFx0XHRzSlNEYXRlVGltZUZvcm1hdCA9IHNKU0RhdGVUaW1lRm9ybWF0LnJlcGxhY2UoXCJ5XCIsIFwieXl5eVwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChzSlNEYXRlVGltZUZvcm1hdC5pbmNsdWRlcyhcImFcIikpIHtcblx0XHRcdFx0c0pTRGF0ZVRpbWVGb3JtYXQgPSBzSlNEYXRlVGltZUZvcm1hdC5yZXBsYWNlKFwiYVwiLCBcIkFNL1BNXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gc0pTRGF0ZVRpbWVGb3JtYXQ7XG5cdH0sXG5cdGdldEV4Y2VsVGltZWZyb21KU1RpbWU6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBHZXQgZGF0ZSBGb3JtYXQocGF0dGVybiksIHdoaWNoIHdpbGwgYmUgdXNlZCBmb3IgZGF0ZSB0aW1lIGZvcm1hdCBtYXBwaW5nIGJldHdlZW4gc2FwdWk1IGFuZCBleGNlbC5cblx0XHQvLyBVSTVfQU5ZXG5cdFx0bGV0IHNKU1RpbWVGb3JtYXQgPSAoRGF0ZUZvcm1hdC5nZXRUaW1lSW5zdGFuY2UoKSBhcyBhbnkpLm9Gb3JtYXRPcHRpb25zLnBhdHRlcm47XG5cdFx0aWYgKHNKU1RpbWVGb3JtYXQgJiYgc0pTVGltZUZvcm1hdC5pbmNsdWRlcyhcImFcIikpIHtcblx0XHRcdHNKU1RpbWVGb3JtYXQgPSBzSlNUaW1lRm9ybWF0LnJlcGxhY2UoXCJhXCIsIFwiQU0vUE1cIik7XG5cdFx0fVxuXHRcdHJldHVybiBzSlNUaW1lRm9ybWF0O1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBFeGNlbEZvcm1hdEhlbHBlcjtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQUVBLElBQU1BLGlCQUFpQixHQUFHO0lBQ3pCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7SUFDQ0Msc0JBQXNCLEVBQUUsWUFBWTtNQUNuQztNQUNBO01BQ0EsSUFBSUMsYUFBYSxHQUFJQyxVQUFVLENBQUNDLGVBQVgsRUFBRCxDQUFzQ0MsY0FBdEMsQ0FBcURDLE9BQXJELENBQTZEQyxXQUE3RCxFQUFwQjs7TUFDQSxJQUFJTCxhQUFKLEVBQW1CO1FBQ2xCO1FBQ0EsSUFBTU0sS0FBSyxHQUFHLGdCQUFkOztRQUNBLElBQUlBLEtBQUssQ0FBQ0MsSUFBTixDQUFXUCxhQUFYLENBQUosRUFBK0I7VUFDOUJBLGFBQWEsR0FBR0EsYUFBYSxDQUFDUSxPQUFkLENBQXNCLEdBQXRCLEVBQTJCLE1BQTNCLENBQWhCO1FBQ0E7TUFDRDs7TUFDRCxPQUFPUixhQUFQO0lBQ0EsQ0FsQndCO0lBbUJ6QlMsOEJBQThCLEVBQUUsWUFBWTtNQUMzQztNQUNBO01BQ0EsSUFBSUMsaUJBQWlCLEdBQUlULFVBQVUsQ0FBQ1UsbUJBQVgsRUFBRCxDQUEwQ1IsY0FBMUMsQ0FBeURDLE9BQXpELENBQWlFQyxXQUFqRSxFQUF4Qjs7TUFDQSxJQUFJSyxpQkFBSixFQUF1QjtRQUN0QjtRQUNBLElBQU1FLFNBQVMsR0FBRyxnQkFBbEI7O1FBQ0EsSUFBSUEsU0FBUyxDQUFDTCxJQUFWLENBQWVHLGlCQUFmLENBQUosRUFBdUM7VUFDdENBLGlCQUFpQixHQUFHQSxpQkFBaUIsQ0FBQ0YsT0FBbEIsQ0FBMEIsR0FBMUIsRUFBK0IsTUFBL0IsQ0FBcEI7UUFDQTs7UUFDRCxJQUFJRSxpQkFBaUIsQ0FBQ0csUUFBbEIsQ0FBMkIsR0FBM0IsQ0FBSixFQUFxQztVQUNwQ0gsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDRixPQUFsQixDQUEwQixHQUExQixFQUErQixPQUEvQixDQUFwQjtRQUNBO01BQ0Q7O01BQ0QsT0FBT0UsaUJBQVA7SUFDQSxDQWxDd0I7SUFtQ3pCSSxzQkFBc0IsRUFBRSxZQUFZO01BQ25DO01BQ0E7TUFDQSxJQUFJQyxhQUFhLEdBQUlkLFVBQVUsQ0FBQ2UsZUFBWCxFQUFELENBQXNDYixjQUF0QyxDQUFxREMsT0FBekU7O01BQ0EsSUFBSVcsYUFBYSxJQUFJQSxhQUFhLENBQUNGLFFBQWQsQ0FBdUIsR0FBdkIsQ0FBckIsRUFBa0Q7UUFDakRFLGFBQWEsR0FBR0EsYUFBYSxDQUFDUCxPQUFkLENBQXNCLEdBQXRCLEVBQTJCLE9BQTNCLENBQWhCO01BQ0E7O01BQ0QsT0FBT08sYUFBUDtJQUNBO0VBM0N3QixDQUExQjtTQThDZWpCLGlCIn0=