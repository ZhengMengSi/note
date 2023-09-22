/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingToolkit", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/macros/field/FieldTemplating"], function (BindingToolkit, DataModelPathHelper, FieldTemplating) {
  "use strict";

  var _exports = {};
  var getTextBindingExpression = FieldTemplating.getTextBindingExpression;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var constant = BindingToolkit.constant;
  var concat = BindingToolkit.concat;
  var compileExpression = BindingToolkit.compileExpression;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var connectedFieldsTemplateRegex = /(?:({[^}]+})[^{]*)/g;
  var connectedFieldsTemplateSubRegex = /{([^}]+)}(.*)/;

  var getLabelForConnectedFields = function (oConnectedFieldsPath) {
    var compileBindingExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var oConnectedFields = oConnectedFieldsPath.targetObject; // First we separate each group of `{TemplatePart} xxx`

    var aTemplateMatches = oConnectedFields.Template.toString().match(connectedFieldsTemplateRegex);

    if (aTemplateMatches) {
      var aPartsToConcat = aTemplateMatches.reduce(function (aSubPartsToConcat, oMatch) {
        // Then for each sub-group, we retrieve the name of the data object and the remaining text, if it exists
        var aSubMatch = oMatch.match(connectedFieldsTemplateSubRegex);

        if (aSubMatch && aSubMatch.length > 1) {
          var targetValue = aSubMatch[1];

          if (oConnectedFields.Data[targetValue]) {
            var oDataFieldPath = enhanceDataModelPath(oConnectedFieldsPath, // TODO Better type for the Edm.Dictionary
            oConnectedFields.Data[targetValue].fullyQualifiedName.replace(oConnectedFieldsPath.targetEntityType.fullyQualifiedName, ""));
            oDataFieldPath.targetObject = oDataFieldPath.targetObject.Value;
            aSubPartsToConcat.push(getTextBindingExpression(oDataFieldPath, {}));

            if (aSubMatch.length > 2) {
              aSubPartsToConcat.push(constant(aSubMatch[2]));
            }
          }
        }

        return aSubPartsToConcat;
      }, []);
      return compileBindingExpression ? compileExpression(concat.apply(void 0, _toConsumableArray(aPartsToConcat))) : concat.apply(void 0, _toConsumableArray(aPartsToConcat));
    }

    return "";
  };

  _exports.getLabelForConnectedFields = getLabelForConnectedFields;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb25uZWN0ZWRGaWVsZHNUZW1wbGF0ZVJlZ2V4IiwiY29ubmVjdGVkRmllbGRzVGVtcGxhdGVTdWJSZWdleCIsImdldExhYmVsRm9yQ29ubmVjdGVkRmllbGRzIiwib0Nvbm5lY3RlZEZpZWxkc1BhdGgiLCJjb21waWxlQmluZGluZ0V4cHJlc3Npb24iLCJvQ29ubmVjdGVkRmllbGRzIiwidGFyZ2V0T2JqZWN0IiwiYVRlbXBsYXRlTWF0Y2hlcyIsIlRlbXBsYXRlIiwidG9TdHJpbmciLCJtYXRjaCIsImFQYXJ0c1RvQ29uY2F0IiwicmVkdWNlIiwiYVN1YlBhcnRzVG9Db25jYXQiLCJvTWF0Y2giLCJhU3ViTWF0Y2giLCJsZW5ndGgiLCJ0YXJnZXRWYWx1ZSIsIkRhdGEiLCJvRGF0YUZpZWxkUGF0aCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwicmVwbGFjZSIsInRhcmdldEVudGl0eVR5cGUiLCJWYWx1ZSIsInB1c2giLCJnZXRUZXh0QmluZGluZ0V4cHJlc3Npb24iLCJjb25zdGFudCIsImNvbXBpbGVFeHByZXNzaW9uIiwiY29uY2F0Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJGb3JtVGVtcGxhdGluZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbm5lY3RlZEZpZWxkc1R5cGVUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB0eXBlIHsgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBjb25jYXQsIGNvbnN0YW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB0eXBlIHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGVuaGFuY2VEYXRhTW9kZWxQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgZ2V0VGV4dEJpbmRpbmdFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9tYWNyb3MvZmllbGQvRmllbGRUZW1wbGF0aW5nXCI7XG5cbmNvbnN0IGNvbm5lY3RlZEZpZWxkc1RlbXBsYXRlUmVnZXggPSAvKD86KHtbXn1dK30pW157XSopL2c7XG5jb25zdCBjb25uZWN0ZWRGaWVsZHNUZW1wbGF0ZVN1YlJlZ2V4ID0gL3soW159XSspfSguKikvO1xuZXhwb3J0IGNvbnN0IGdldExhYmVsRm9yQ29ubmVjdGVkRmllbGRzID0gZnVuY3Rpb24gKG9Db25uZWN0ZWRGaWVsZHNQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLCBjb21waWxlQmluZGluZ0V4cHJlc3Npb246IGJvb2xlYW4gPSB0cnVlKSB7XG5cdGNvbnN0IG9Db25uZWN0ZWRGaWVsZHM6IENvbm5lY3RlZEZpZWxkc1R5cGVUeXBlcyA9IG9Db25uZWN0ZWRGaWVsZHNQYXRoLnRhcmdldE9iamVjdDtcblx0Ly8gRmlyc3Qgd2Ugc2VwYXJhdGUgZWFjaCBncm91cCBvZiBge1RlbXBsYXRlUGFydH0geHh4YFxuXHRjb25zdCBhVGVtcGxhdGVNYXRjaGVzID0gb0Nvbm5lY3RlZEZpZWxkcy5UZW1wbGF0ZS50b1N0cmluZygpLm1hdGNoKGNvbm5lY3RlZEZpZWxkc1RlbXBsYXRlUmVnZXgpO1xuXHRpZiAoYVRlbXBsYXRlTWF0Y2hlcykge1xuXHRcdGNvbnN0IGFQYXJ0c1RvQ29uY2F0ID0gYVRlbXBsYXRlTWF0Y2hlcy5yZWR1Y2UoKGFTdWJQYXJ0c1RvQ29uY2F0OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPltdLCBvTWF0Y2gpID0+IHtcblx0XHRcdC8vIFRoZW4gZm9yIGVhY2ggc3ViLWdyb3VwLCB3ZSByZXRyaWV2ZSB0aGUgbmFtZSBvZiB0aGUgZGF0YSBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgdGV4dCwgaWYgaXQgZXhpc3RzXG5cdFx0XHRjb25zdCBhU3ViTWF0Y2ggPSBvTWF0Y2gubWF0Y2goY29ubmVjdGVkRmllbGRzVGVtcGxhdGVTdWJSZWdleCk7XG5cdFx0XHRpZiAoYVN1Yk1hdGNoICYmIGFTdWJNYXRjaC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldFZhbHVlID0gYVN1Yk1hdGNoWzFdO1xuXHRcdFx0XHRpZiAoKG9Db25uZWN0ZWRGaWVsZHMuRGF0YSBhcyBhbnkpW3RhcmdldFZhbHVlXSkge1xuXHRcdFx0XHRcdGNvbnN0IG9EYXRhRmllbGRQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgoXG5cdFx0XHRcdFx0XHRvQ29ubmVjdGVkRmllbGRzUGF0aCxcblx0XHRcdFx0XHRcdC8vIFRPRE8gQmV0dGVyIHR5cGUgZm9yIHRoZSBFZG0uRGljdGlvbmFyeVxuXHRcdFx0XHRcdFx0KG9Db25uZWN0ZWRGaWVsZHMuRGF0YSBhcyBhbnkpW3RhcmdldFZhbHVlXS5mdWxseVF1YWxpZmllZE5hbWUucmVwbGFjZShcblx0XHRcdFx0XHRcdFx0b0Nvbm5lY3RlZEZpZWxkc1BhdGgudGFyZ2V0RW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdFx0XHRcdFwiXCJcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdG9EYXRhRmllbGRQYXRoLnRhcmdldE9iamVjdCA9IG9EYXRhRmllbGRQYXRoLnRhcmdldE9iamVjdC5WYWx1ZTtcblx0XHRcdFx0XHRhU3ViUGFydHNUb0NvbmNhdC5wdXNoKGdldFRleHRCaW5kaW5nRXhwcmVzc2lvbihvRGF0YUZpZWxkUGF0aCwge30pKTtcblx0XHRcdFx0XHRpZiAoYVN1Yk1hdGNoLmxlbmd0aCA+IDIpIHtcblx0XHRcdFx0XHRcdGFTdWJQYXJ0c1RvQ29uY2F0LnB1c2goY29uc3RhbnQoYVN1Yk1hdGNoWzJdKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYVN1YlBhcnRzVG9Db25jYXQ7XG5cdFx0fSwgW10pO1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZ0V4cHJlc3Npb24gPyBjb21waWxlRXhwcmVzc2lvbihjb25jYXQoLi4uYVBhcnRzVG9Db25jYXQpKSA6IGNvbmNhdCguLi5hUGFydHNUb0NvbmNhdCk7XG5cdH1cblxuXHRyZXR1cm4gXCJcIjtcbn07XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBT0EsSUFBTUEsNEJBQTRCLEdBQUcscUJBQXJDO0VBQ0EsSUFBTUMsK0JBQStCLEdBQUcsZUFBeEM7O0VBQ08sSUFBTUMsMEJBQTBCLEdBQUcsVUFBVUMsb0JBQVYsRUFBK0Y7SUFBQSxJQUExQ0Msd0JBQTBDLHVFQUFOLElBQU07SUFDeEksSUFBTUMsZ0JBQTBDLEdBQUdGLG9CQUFvQixDQUFDRyxZQUF4RSxDQUR3SSxDQUV4STs7SUFDQSxJQUFNQyxnQkFBZ0IsR0FBR0YsZ0JBQWdCLENBQUNHLFFBQWpCLENBQTBCQyxRQUExQixHQUFxQ0MsS0FBckMsQ0FBMkNWLDRCQUEzQyxDQUF6Qjs7SUFDQSxJQUFJTyxnQkFBSixFQUFzQjtNQUNyQixJQUFNSSxjQUFjLEdBQUdKLGdCQUFnQixDQUFDSyxNQUFqQixDQUF3QixVQUFDQyxpQkFBRCxFQUF3REMsTUFBeEQsRUFBbUU7UUFDakg7UUFDQSxJQUFNQyxTQUFTLEdBQUdELE1BQU0sQ0FBQ0osS0FBUCxDQUFhVCwrQkFBYixDQUFsQjs7UUFDQSxJQUFJYyxTQUFTLElBQUlBLFNBQVMsQ0FBQ0MsTUFBVixHQUFtQixDQUFwQyxFQUF1QztVQUN0QyxJQUFNQyxXQUFXLEdBQUdGLFNBQVMsQ0FBQyxDQUFELENBQTdCOztVQUNBLElBQUtWLGdCQUFnQixDQUFDYSxJQUFsQixDQUErQkQsV0FBL0IsQ0FBSixFQUFpRDtZQUNoRCxJQUFNRSxjQUFjLEdBQUdDLG9CQUFvQixDQUMxQ2pCLG9CQUQwQyxFQUUxQztZQUNDRSxnQkFBZ0IsQ0FBQ2EsSUFBbEIsQ0FBK0JELFdBQS9CLEVBQTRDSSxrQkFBNUMsQ0FBK0RDLE9BQS9ELENBQ0NuQixvQkFBb0IsQ0FBQ29CLGdCQUFyQixDQUFzQ0Ysa0JBRHZDLEVBRUMsRUFGRCxDQUgwQyxDQUEzQztZQVFBRixjQUFjLENBQUNiLFlBQWYsR0FBOEJhLGNBQWMsQ0FBQ2IsWUFBZixDQUE0QmtCLEtBQTFEO1lBQ0FYLGlCQUFpQixDQUFDWSxJQUFsQixDQUF1QkMsd0JBQXdCLENBQUNQLGNBQUQsRUFBaUIsRUFBakIsQ0FBL0M7O1lBQ0EsSUFBSUosU0FBUyxDQUFDQyxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO2NBQ3pCSCxpQkFBaUIsQ0FBQ1ksSUFBbEIsQ0FBdUJFLFFBQVEsQ0FBQ1osU0FBUyxDQUFDLENBQUQsQ0FBVixDQUEvQjtZQUNBO1VBQ0Q7UUFDRDs7UUFDRCxPQUFPRixpQkFBUDtNQUNBLENBdEJzQixFQXNCcEIsRUF0Qm9CLENBQXZCO01BdUJBLE9BQU9ULHdCQUF3QixHQUFHd0IsaUJBQWlCLENBQUNDLE1BQU0sTUFBTiw0QkFBVWxCLGNBQVYsRUFBRCxDQUFwQixHQUFrRGtCLE1BQU0sTUFBTiw0QkFBVWxCLGNBQVYsRUFBakY7SUFDQTs7SUFFRCxPQUFPLEVBQVA7RUFDQSxDQWhDTSJ9