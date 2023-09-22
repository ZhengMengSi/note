/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  // This list needs to come from AVT
  var ENUM_VALUES = {
    "com.sap.vocabularies.Common.v1.FieldControlType": {
      "Mandatory": 7,
      "Optional": 3,
      "ReadOnly": 0,
      "Inapplicable": 0,
      "Disabled": 1
    }
  };

  var resolveEnumValue = function (enumName) {
    var _enumName$split = enumName.split("/"),
        _enumName$split2 = _slicedToArray(_enumName$split, 2),
        termName = _enumName$split2[0],
        value = _enumName$split2[1];

    if (ENUM_VALUES.hasOwnProperty(termName)) {
      return ENUM_VALUES[termName][value];
    } else {
      return false;
    }
  };

  _exports.resolveEnumValue = resolveEnumValue;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFTlVNX1ZBTFVFUyIsInJlc29sdmVFbnVtVmFsdWUiLCJlbnVtTmFtZSIsInNwbGl0IiwidGVybU5hbWUiLCJ2YWx1ZSIsImhhc093blByb3BlcnR5Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJBbm5vdGF0aW9uRW51bS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGxpc3QgbmVlZHMgdG8gY29tZSBmcm9tIEFWVFxuY29uc3QgRU5VTV9WQUxVRVMgPSB7XG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpZWxkQ29udHJvbFR5cGVcIjoge1xuXHRcdFwiTWFuZGF0b3J5XCI6IDcsXG5cdFx0XCJPcHRpb25hbFwiOiAzLFxuXHRcdFwiUmVhZE9ubHlcIjogMCxcblx0XHRcIkluYXBwbGljYWJsZVwiOiAwLFxuXHRcdFwiRGlzYWJsZWRcIjogMVxuXHR9XG59O1xuZXhwb3J0IGNvbnN0IHJlc29sdmVFbnVtVmFsdWUgPSBmdW5jdGlvbihlbnVtTmFtZTogc3RyaW5nKSB7XG5cdGNvbnN0IFt0ZXJtTmFtZSwgdmFsdWVdID0gZW51bU5hbWUuc3BsaXQoXCIvXCIpO1xuXHRpZiAoRU5VTV9WQUxVRVMuaGFzT3duUHJvcGVydHkodGVybU5hbWUpKSB7XG5cdFx0cmV0dXJuIChFTlVNX1ZBTFVFUyBhcyBhbnkpW3Rlcm1OYW1lXVt2YWx1ZV07XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTtFQUNBLElBQU1BLFdBQVcsR0FBRztJQUNuQixtREFBbUQ7TUFDbEQsYUFBYSxDQURxQztNQUVsRCxZQUFZLENBRnNDO01BR2xELFlBQVksQ0FIc0M7TUFJbEQsZ0JBQWdCLENBSmtDO01BS2xELFlBQVk7SUFMc0M7RUFEaEMsQ0FBcEI7O0VBU08sSUFBTUMsZ0JBQWdCLEdBQUcsVUFBU0MsUUFBVCxFQUEyQjtJQUMxRCxzQkFBMEJBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlLEdBQWYsQ0FBMUI7SUFBQTtJQUFBLElBQU9DLFFBQVA7SUFBQSxJQUFpQkMsS0FBakI7O0lBQ0EsSUFBSUwsV0FBVyxDQUFDTSxjQUFaLENBQTJCRixRQUEzQixDQUFKLEVBQTBDO01BQ3pDLE9BQVFKLFdBQUQsQ0FBcUJJLFFBQXJCLEVBQStCQyxLQUEvQixDQUFQO0lBQ0EsQ0FGRCxNQUVPO01BQ04sT0FBTyxLQUFQO0lBQ0E7RUFDRCxDQVBNIn0=