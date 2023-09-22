/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  /**
   * Collection of formatters needed for the collaboration draft.
   *
   * @param {object} this The context
   * @param {string} sName The inner function name
   * @param {object[]} oArgs The inner function parameters
   * @returns {object} The value from the inner function
   */
  var collaborationFormatters = function (sName) {
    if (collaborationFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return collaborationFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  var hasCollaborationActivity = function (activities) {
    for (var _len2 = arguments.length, keys = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      keys[_key2 - 1] = arguments[_key2];
    }

    return !!getCollaborationActivity.apply(void 0, [activities].concat(keys));
  };

  hasCollaborationActivity.__functionName = "sap.fe.core.formatters.CollaborationFormatter#hasCollaborationActivity";
  _exports.hasCollaborationActivity = hasCollaborationActivity;

  var getCollaborationActivityInitials = function (activities) {
    for (var _len3 = arguments.length, keys = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      keys[_key3 - 1] = arguments[_key3];
    }

    var activity = getCollaborationActivity.apply(void 0, [activities].concat(keys));
    return (activity === null || activity === void 0 ? void 0 : activity.initials) || undefined;
  };

  getCollaborationActivityInitials.__functionName = "sap.fe.core.formatters.CollaborationFormatter#getCollaborationActivityInitials";
  _exports.getCollaborationActivityInitials = getCollaborationActivityInitials;

  var getCollaborationActivityColor = function (activities) {
    for (var _len4 = arguments.length, keys = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      keys[_key4 - 1] = arguments[_key4];
    }

    var activity = getCollaborationActivity.apply(void 0, [activities].concat(keys));
    return activity !== null && activity !== void 0 && activity.color ? "Accent".concat(activity.color) : undefined;
  };

  getCollaborationActivityColor.__functionName = "sap.fe.core.formatters.CollaborationFormatter#getCollaborationActivityColor";
  _exports.getCollaborationActivityColor = getCollaborationActivityColor;

  function getCollaborationActivity(activities) {
    for (var _len5 = arguments.length, keys = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      keys[_key5 - 1] = arguments[_key5];
    }

    if (activities && activities.length > 0) {
      return activities.find(function (activity) {
        var _activity$key;

        var activityKeys = (activity === null || activity === void 0 ? void 0 : (_activity$key = activity.key) === null || _activity$key === void 0 ? void 0 : _activity$key.split(",")) || [];
        var compareKey = "";
        var splitKeys;

        for (var i = 0; i < activityKeys.length; i++) {
          var _keys$i;

          // take care on short and full notation
          splitKeys = activityKeys[i].split("=");
          compareKey = (splitKeys[1] || splitKeys[0]).split("'").join("");

          if (compareKey !== ((_keys$i = keys[i]) === null || _keys$i === void 0 ? void 0 : _keys$i.toString())) {
            return false;
          }
        }

        return true;
      });
    }
  }

  collaborationFormatters.hasCollaborationActivity = hasCollaborationActivity;
  collaborationFormatters.getCollaborationActivityInitials = getCollaborationActivityInitials;
  collaborationFormatters.getCollaborationActivityColor = getCollaborationActivityColor;
  /**
   * @global
   */

  return collaborationFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb2xsYWJvcmF0aW9uRm9ybWF0dGVycyIsInNOYW1lIiwiaGFzT3duUHJvcGVydHkiLCJvQXJncyIsImFwcGx5IiwiaGFzQ29sbGFib3JhdGlvbkFjdGl2aXR5IiwiYWN0aXZpdGllcyIsImtleXMiLCJnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHkiLCJfX2Z1bmN0aW9uTmFtZSIsImdldENvbGxhYm9yYXRpb25BY3Rpdml0eUluaXRpYWxzIiwiYWN0aXZpdHkiLCJpbml0aWFscyIsInVuZGVmaW5lZCIsImdldENvbGxhYm9yYXRpb25BY3Rpdml0eUNvbG9yIiwiY29sb3IiLCJsZW5ndGgiLCJmaW5kIiwiYWN0aXZpdHlLZXlzIiwia2V5Iiwic3BsaXQiLCJjb21wYXJlS2V5Iiwic3BsaXRLZXlzIiwiaSIsImpvaW4iLCJ0b1N0cmluZyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiQ29sbGFib3JhdGlvbkZvcm1hdHRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbGxlY3Rpb24gb2YgZm9ybWF0dGVycyBuZWVkZWQgZm9yIHRoZSBjb2xsYWJvcmF0aW9uIGRyYWZ0LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0aGlzIFRoZSBjb250ZXh0XG4gKiBAcGFyYW0ge3N0cmluZ30gc05hbWUgVGhlIGlubmVyIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSB7b2JqZWN0W119IG9BcmdzIFRoZSBpbm5lciBmdW5jdGlvbiBwYXJhbWV0ZXJzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgdmFsdWUgZnJvbSB0aGUgaW5uZXIgZnVuY3Rpb25cbiAqL1xuXG5jb25zdCBjb2xsYWJvcmF0aW9uRm9ybWF0dGVycyA9IGZ1bmN0aW9uICh0aGlzOiBvYmplY3QsIHNOYW1lOiBzdHJpbmcsIC4uLm9BcmdzOiBhbnlbXSk6IGFueSB7XG5cdGlmIChjb2xsYWJvcmF0aW9uRm9ybWF0dGVycy5oYXNPd25Qcm9wZXJ0eShzTmFtZSkpIHtcblx0XHRyZXR1cm4gKGNvbGxhYm9yYXRpb25Gb3JtYXR0ZXJzIGFzIGFueSlbc05hbWVdLmFwcGx5KHRoaXMsIG9BcmdzKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxufTtcbmV4cG9ydCBjb25zdCBoYXNDb2xsYWJvcmF0aW9uQWN0aXZpdHkgPSAoYWN0aXZpdGllczogYW55LCAuLi5rZXlzOiBhbnlbXSk6IGJvb2xlYW4gfCB1bmRlZmluZWQgPT4ge1xuXHRyZXR1cm4gISFnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHkoYWN0aXZpdGllcywgLi4ua2V5cyk7XG59O1xuaGFzQ29sbGFib3JhdGlvbkFjdGl2aXR5Ll9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLkNvbGxhYm9yYXRpb25Gb3JtYXR0ZXIjaGFzQ29sbGFib3JhdGlvbkFjdGl2aXR5XCI7XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHlJbml0aWFscyA9IChhY3Rpdml0aWVzOiBhbnksIC4uLmtleXM6IGFueVtdKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcblx0Y29uc3QgYWN0aXZpdHkgPSBnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHkoYWN0aXZpdGllcywgLi4ua2V5cyk7XG5cdHJldHVybiBhY3Rpdml0eT8uaW5pdGlhbHMgfHwgdW5kZWZpbmVkO1xufTtcbmdldENvbGxhYm9yYXRpb25BY3Rpdml0eUluaXRpYWxzLl9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLkNvbGxhYm9yYXRpb25Gb3JtYXR0ZXIjZ2V0Q29sbGFib3JhdGlvbkFjdGl2aXR5SW5pdGlhbHNcIjtcblxuZXhwb3J0IGNvbnN0IGdldENvbGxhYm9yYXRpb25BY3Rpdml0eUNvbG9yID0gKGFjdGl2aXRpZXM6IGFueSwgLi4ua2V5czogYW55W10pOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRjb25zdCBhY3Rpdml0eSA9IGdldENvbGxhYm9yYXRpb25BY3Rpdml0eShhY3Rpdml0aWVzLCAuLi5rZXlzKTtcblx0cmV0dXJuIGFjdGl2aXR5Py5jb2xvciA/IGBBY2NlbnQke2FjdGl2aXR5LmNvbG9yfWAgOiB1bmRlZmluZWQ7XG59O1xuZ2V0Q29sbGFib3JhdGlvbkFjdGl2aXR5Q29sb3IuX19mdW5jdGlvbk5hbWUgPSBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuQ29sbGFib3JhdGlvbkZvcm1hdHRlciNnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHlDb2xvclwiO1xuXG5mdW5jdGlvbiBnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHkoYWN0aXZpdGllczogYW55LCAuLi5rZXlzOiBhbnlbXSkge1xuXHRpZiAoYWN0aXZpdGllcyAmJiBhY3Rpdml0aWVzLmxlbmd0aCA+IDApIHtcblx0XHRyZXR1cm4gYWN0aXZpdGllcy5maW5kKGZ1bmN0aW9uIChhY3Rpdml0eTogYW55KSB7XG5cdFx0XHRjb25zdCBhY3Rpdml0eUtleXMgPSBhY3Rpdml0eT8ua2V5Py5zcGxpdChcIixcIikgfHwgW107XG5cdFx0XHRsZXQgY29tcGFyZUtleSA9IFwiXCI7XG5cdFx0XHRsZXQgc3BsaXRLZXlzOiBzdHJpbmdbXTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhY3Rpdml0eUtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Ly8gdGFrZSBjYXJlIG9uIHNob3J0IGFuZCBmdWxsIG5vdGF0aW9uXG5cdFx0XHRcdHNwbGl0S2V5cyA9IGFjdGl2aXR5S2V5c1tpXS5zcGxpdChcIj1cIik7XG5cdFx0XHRcdGNvbXBhcmVLZXkgPSAoc3BsaXRLZXlzWzFdIHx8IHNwbGl0S2V5c1swXSkuc3BsaXQoXCInXCIpLmpvaW4oXCJcIik7XG5cdFx0XHRcdGlmIChjb21wYXJlS2V5ICE9PSBrZXlzW2ldPy50b1N0cmluZygpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTtcblx0fVxufVxuXG5jb2xsYWJvcmF0aW9uRm9ybWF0dGVycy5oYXNDb2xsYWJvcmF0aW9uQWN0aXZpdHkgPSBoYXNDb2xsYWJvcmF0aW9uQWN0aXZpdHk7XG5jb2xsYWJvcmF0aW9uRm9ybWF0dGVycy5nZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHlJbml0aWFscyA9IGdldENvbGxhYm9yYXRpb25BY3Rpdml0eUluaXRpYWxzO1xuY29sbGFib3JhdGlvbkZvcm1hdHRlcnMuZ2V0Q29sbGFib3JhdGlvbkFjdGl2aXR5Q29sb3IgPSBnZXRDb2xsYWJvcmF0aW9uQWN0aXZpdHlDb2xvcjtcbi8qKlxuICogQGdsb2JhbFxuICovXG5leHBvcnQgZGVmYXVsdCBjb2xsYWJvcmF0aW9uRm9ybWF0dGVycztcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7O0VBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUVBLElBQU1BLHVCQUF1QixHQUFHLFVBQXdCQyxLQUF4QixFQUE2RDtJQUM1RixJQUFJRCx1QkFBdUIsQ0FBQ0UsY0FBeEIsQ0FBdUNELEtBQXZDLENBQUosRUFBbUQ7TUFBQSxrQ0FEc0JFLEtBQ3RCO1FBRHNCQSxLQUN0QjtNQUFBOztNQUNsRCxPQUFRSCx1QkFBRCxDQUFpQ0MsS0FBakMsRUFBd0NHLEtBQXhDLENBQThDLElBQTlDLEVBQW9ERCxLQUFwRCxDQUFQO0lBQ0EsQ0FGRCxNQUVPO01BQ04sT0FBTyxFQUFQO0lBQ0E7RUFDRCxDQU5EOztFQU9PLElBQU1FLHdCQUF3QixHQUFHLFVBQUNDLFVBQUQsRUFBMEQ7SUFBQSxtQ0FBckNDLElBQXFDO01BQXJDQSxJQUFxQztJQUFBOztJQUNqRyxPQUFPLENBQUMsQ0FBQ0Msd0JBQXdCLE1BQXhCLFVBQXlCRixVQUF6QixTQUF3Q0MsSUFBeEMsRUFBVDtFQUNBLENBRk07O0VBR1BGLHdCQUF3QixDQUFDSSxjQUF6QixHQUEwQyx3RUFBMUM7OztFQUVPLElBQU1DLGdDQUFnQyxHQUFHLFVBQUNKLFVBQUQsRUFBeUQ7SUFBQSxtQ0FBcENDLElBQW9DO01BQXBDQSxJQUFvQztJQUFBOztJQUN4RyxJQUFNSSxRQUFRLEdBQUdILHdCQUF3QixNQUF4QixVQUF5QkYsVUFBekIsU0FBd0NDLElBQXhDLEVBQWpCO0lBQ0EsT0FBTyxDQUFBSSxRQUFRLFNBQVIsSUFBQUEsUUFBUSxXQUFSLFlBQUFBLFFBQVEsQ0FBRUMsUUFBVixLQUFzQkMsU0FBN0I7RUFDQSxDQUhNOztFQUlQSCxnQ0FBZ0MsQ0FBQ0QsY0FBakMsR0FBa0QsZ0ZBQWxEOzs7RUFFTyxJQUFNSyw2QkFBNkIsR0FBRyxVQUFDUixVQUFELEVBQXlEO0lBQUEsbUNBQXBDQyxJQUFvQztNQUFwQ0EsSUFBb0M7SUFBQTs7SUFDckcsSUFBTUksUUFBUSxHQUFHSCx3QkFBd0IsTUFBeEIsVUFBeUJGLFVBQXpCLFNBQXdDQyxJQUF4QyxFQUFqQjtJQUNBLE9BQU9JLFFBQVEsU0FBUixJQUFBQSxRQUFRLFdBQVIsSUFBQUEsUUFBUSxDQUFFSSxLQUFWLG1CQUEyQkosUUFBUSxDQUFDSSxLQUFwQyxJQUE4Q0YsU0FBckQ7RUFDQSxDQUhNOztFQUlQQyw2QkFBNkIsQ0FBQ0wsY0FBOUIsR0FBK0MsNkVBQS9DOzs7RUFFQSxTQUFTRCx3QkFBVCxDQUFrQ0YsVUFBbEMsRUFBbUU7SUFBQSxtQ0FBYkMsSUFBYTtNQUFiQSxJQUFhO0lBQUE7O0lBQ2xFLElBQUlELFVBQVUsSUFBSUEsVUFBVSxDQUFDVSxNQUFYLEdBQW9CLENBQXRDLEVBQXlDO01BQ3hDLE9BQU9WLFVBQVUsQ0FBQ1csSUFBWCxDQUFnQixVQUFVTixRQUFWLEVBQXlCO1FBQUE7O1FBQy9DLElBQU1PLFlBQVksR0FBRyxDQUFBUCxRQUFRLFNBQVIsSUFBQUEsUUFBUSxXQUFSLDZCQUFBQSxRQUFRLENBQUVRLEdBQVYsZ0VBQWVDLEtBQWYsQ0FBcUIsR0FBckIsTUFBNkIsRUFBbEQ7UUFDQSxJQUFJQyxVQUFVLEdBQUcsRUFBakI7UUFDQSxJQUFJQyxTQUFKOztRQUVBLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0wsWUFBWSxDQUFDRixNQUFqQyxFQUF5Q08sQ0FBQyxFQUExQyxFQUE4QztVQUFBOztVQUM3QztVQUNBRCxTQUFTLEdBQUdKLFlBQVksQ0FBQ0ssQ0FBRCxDQUFaLENBQWdCSCxLQUFoQixDQUFzQixHQUF0QixDQUFaO1VBQ0FDLFVBQVUsR0FBRyxDQUFDQyxTQUFTLENBQUMsQ0FBRCxDQUFULElBQWdCQSxTQUFTLENBQUMsQ0FBRCxDQUExQixFQUErQkYsS0FBL0IsQ0FBcUMsR0FBckMsRUFBMENJLElBQTFDLENBQStDLEVBQS9DLENBQWI7O1VBQ0EsSUFBSUgsVUFBVSxpQkFBS2QsSUFBSSxDQUFDZ0IsQ0FBRCxDQUFULDRDQUFLLFFBQVNFLFFBQVQsRUFBTCxDQUFkLEVBQXdDO1lBQ3ZDLE9BQU8sS0FBUDtVQUNBO1FBQ0Q7O1FBQ0QsT0FBTyxJQUFQO01BQ0EsQ0FkTSxDQUFQO0lBZUE7RUFDRDs7RUFFRHpCLHVCQUF1QixDQUFDSyx3QkFBeEIsR0FBbURBLHdCQUFuRDtFQUNBTCx1QkFBdUIsQ0FBQ1UsZ0NBQXhCLEdBQTJEQSxnQ0FBM0Q7RUFDQVYsdUJBQXVCLENBQUNjLDZCQUF4QixHQUF3REEsNkJBQXhEO0VBQ0E7QUFDQTtBQUNBOztTQUNlZCx1QiJ9