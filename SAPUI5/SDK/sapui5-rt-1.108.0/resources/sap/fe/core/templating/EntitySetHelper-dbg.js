/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ModelHelper"], function (ModelHelper) {
  "use strict";

  var _exports = {};

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var isEntitySet = function (dataObject) {
    return dataObject && dataObject.hasOwnProperty("_type") && dataObject._type === "EntitySet";
  };

  _exports.isEntitySet = isEntitySet;

  var getFilterExpressionRestrictions = function (entitySet) {
    var _entitySet$annotation, _entitySet$annotation2, _entitySet$annotation3;

    return ((_entitySet$annotation = entitySet.annotations) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.Capabilities) === null || _entitySet$annotation2 === void 0 ? void 0 : (_entitySet$annotation3 = _entitySet$annotation2.FilterRestrictions) === null || _entitySet$annotation3 === void 0 ? void 0 : _entitySet$annotation3.FilterExpressionRestrictions) || [];
  };
  /**
   * Reads all SortRestrictions of the main entity and the (first level) navigation restrictions.
   * This does not work for more than one level of navigation.
   *
   * @param entitySet Entity set to be analyzed
   * @returns Array containing the property names of all non-sortable properties
   */


  _exports.getFilterExpressionRestrictions = getFilterExpressionRestrictions;

  var getNonSortablePropertiesRestrictions = function (entitySet) {
    var _annotations, _annotations$Capabili, _annotations$Capabili2, _entitySet$annotation4, _entitySet$annotation5, _entitySet$annotation6, _entitySet$annotation7;

    var nonSortableProperties = []; // Check annotations for main entity

    if (ModelHelper.isSingleton(entitySet)) {
      return [];
    } else if ((entitySet === null || entitySet === void 0 ? void 0 : (_annotations = entitySet.annotations) === null || _annotations === void 0 ? void 0 : (_annotations$Capabili = _annotations.Capabilities) === null || _annotations$Capabili === void 0 ? void 0 : (_annotations$Capabili2 = _annotations$Capabili.SortRestrictions) === null || _annotations$Capabili2 === void 0 ? void 0 : _annotations$Capabili2.Sortable) === false) {
      var _nonSortablePropertie;

      // add all properties of the entity to the nonSortableProperties
      (_nonSortablePropertie = nonSortableProperties).push.apply(_nonSortablePropertie, _toConsumableArray(entitySet.entityType.entityProperties.map(function (property) {
        return property.name;
      })));
    } else {
      var _annotations2, _annotations2$Capabil, _annotations2$Capabil2, _annotations2$Capabil3;

      nonSortableProperties = (entitySet === null || entitySet === void 0 ? void 0 : (_annotations2 = entitySet.annotations) === null || _annotations2 === void 0 ? void 0 : (_annotations2$Capabil = _annotations2.Capabilities) === null || _annotations2$Capabil === void 0 ? void 0 : (_annotations2$Capabil2 = _annotations2$Capabil.SortRestrictions) === null || _annotations2$Capabil2 === void 0 ? void 0 : (_annotations2$Capabil3 = _annotations2$Capabil2.NonSortableProperties) === null || _annotations2$Capabil3 === void 0 ? void 0 : _annotations2$Capabil3.map(function (property) {
        return property.value;
      })) || [];
    } // Check for every navigationRestriction if it has sortRestrictions


    entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation4 = entitySet.annotations) === null || _entitySet$annotation4 === void 0 ? void 0 : (_entitySet$annotation5 = _entitySet$annotation4.Capabilities) === null || _entitySet$annotation5 === void 0 ? void 0 : (_entitySet$annotation6 = _entitySet$annotation5.NavigationRestrictions) === null || _entitySet$annotation6 === void 0 ? void 0 : (_entitySet$annotation7 = _entitySet$annotation6.RestrictedProperties) === null || _entitySet$annotation7 === void 0 ? void 0 : _entitySet$annotation7.forEach(function (navigationRestriction) {
      var _navigationRestrictio;

      if ((navigationRestriction === null || navigationRestriction === void 0 ? void 0 : (_navigationRestrictio = navigationRestriction.SortRestrictions) === null || _navigationRestrictio === void 0 ? void 0 : _navigationRestrictio.Sortable) === false) {
        var _entitySet$entityType, _entitySet$entityType2;

        // find correct navigation property
        var navigationProperty = entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$entityType = entitySet.entityType) === null || _entitySet$entityType === void 0 ? void 0 : (_entitySet$entityType2 = _entitySet$entityType.navigationProperties) === null || _entitySet$entityType2 === void 0 ? void 0 : _entitySet$entityType2.filter(function (navProperty) {
          var _navigationRestrictio2;

          return navProperty.name === (navigationRestriction === null || navigationRestriction === void 0 ? void 0 : (_navigationRestrictio2 = navigationRestriction.NavigationProperty) === null || _navigationRestrictio2 === void 0 ? void 0 : _navigationRestrictio2.value);
        });

        if (navigationProperty[0]) {
          var _nonSortablePropertie2, _navigationProperty$;

          // add all properties of the navigation property to the nonSortableProperties
          (_nonSortablePropertie2 = nonSortableProperties).push.apply(_nonSortablePropertie2, _toConsumableArray((_navigationProperty$ = navigationProperty[0].targetType) === null || _navigationProperty$ === void 0 ? void 0 : _navigationProperty$.entityProperties.map(function (property) {
            return "".concat(navigationProperty[0].name, "/").concat(property.name);
          })));
        }
      } else {
        var _navigationRestrictio3, _navigationRestrictio4;

        // leave the property path unchanged (it is relative to the annotation target!)
        var nonSortableNavigationProperties = navigationRestriction === null || navigationRestriction === void 0 ? void 0 : (_navigationRestrictio3 = navigationRestriction.SortRestrictions) === null || _navigationRestrictio3 === void 0 ? void 0 : (_navigationRestrictio4 = _navigationRestrictio3.NonSortableProperties) === null || _navigationRestrictio4 === void 0 ? void 0 : _navigationRestrictio4.map(function (property) {
          return property.value;
        });

        if (nonSortableNavigationProperties) {
          var _nonSortablePropertie3;

          (_nonSortablePropertie3 = nonSortableProperties).push.apply(_nonSortablePropertie3, _toConsumableArray(nonSortableNavigationProperties));
        }
      }
    });
    return nonSortableProperties;
  };

  _exports.getNonSortablePropertiesRestrictions = getNonSortablePropertiesRestrictions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc0VudGl0eVNldCIsImRhdGFPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsIl90eXBlIiwiZ2V0RmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImVudGl0eVNldCIsImFubm90YXRpb25zIiwiQ2FwYWJpbGl0aWVzIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImdldE5vblNvcnRhYmxlUHJvcGVydGllc1Jlc3RyaWN0aW9ucyIsIm5vblNvcnRhYmxlUHJvcGVydGllcyIsIk1vZGVsSGVscGVyIiwiaXNTaW5nbGV0b24iLCJTb3J0UmVzdHJpY3Rpb25zIiwiU29ydGFibGUiLCJwdXNoIiwiZW50aXR5VHlwZSIsImVudGl0eVByb3BlcnRpZXMiLCJtYXAiLCJwcm9wZXJ0eSIsIm5hbWUiLCJOb25Tb3J0YWJsZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIk5hdmlnYXRpb25SZXN0cmljdGlvbnMiLCJSZXN0cmljdGVkUHJvcGVydGllcyIsImZvckVhY2giLCJuYXZpZ2F0aW9uUmVzdHJpY3Rpb24iLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsImZpbHRlciIsIm5hdlByb3BlcnR5IiwiTmF2aWdhdGlvblByb3BlcnR5IiwidGFyZ2V0VHlwZSIsIm5vblNvcnRhYmxlTmF2aWdhdGlvblByb3BlcnRpZXMiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkVudGl0eVNldEhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVudGl0eVNldCwgU2luZ2xldG9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcblxuZXhwb3J0IGNvbnN0IGlzRW50aXR5U2V0ID0gZnVuY3Rpb24gKGRhdGFPYmplY3Q6IGFueSk6IGRhdGFPYmplY3QgaXMgRW50aXR5U2V0IHtcblx0cmV0dXJuIGRhdGFPYmplY3QgJiYgZGF0YU9iamVjdC5oYXNPd25Qcm9wZXJ0eShcIl90eXBlXCIpICYmIGRhdGFPYmplY3QuX3R5cGUgPT09IFwiRW50aXR5U2V0XCI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyA9IGZ1bmN0aW9uIChlbnRpdHlTZXQ6IEVudGl0eVNldCkge1xuXHRyZXR1cm4gZW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkZpbHRlclJlc3RyaWN0aW9ucz8uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyB8fCBbXTtcbn07XG5cbi8qKlxuICogUmVhZHMgYWxsIFNvcnRSZXN0cmljdGlvbnMgb2YgdGhlIG1haW4gZW50aXR5IGFuZCB0aGUgKGZpcnN0IGxldmVsKSBuYXZpZ2F0aW9uIHJlc3RyaWN0aW9ucy5cbiAqIFRoaXMgZG9lcyBub3Qgd29yayBmb3IgbW9yZSB0aGFuIG9uZSBsZXZlbCBvZiBuYXZpZ2F0aW9uLlxuICpcbiAqIEBwYXJhbSBlbnRpdHlTZXQgRW50aXR5IHNldCB0byBiZSBhbmFseXplZFxuICogQHJldHVybnMgQXJyYXkgY29udGFpbmluZyB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYWxsIG5vbi1zb3J0YWJsZSBwcm9wZXJ0aWVzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXROb25Tb3J0YWJsZVByb3BlcnRpZXNSZXN0cmljdGlvbnMgPSBmdW5jdGlvbiAoZW50aXR5U2V0OiBFbnRpdHlTZXQgfCBTaW5nbGV0b24gfCB1bmRlZmluZWQpOiBzdHJpbmdbXSB7XG5cdGxldCBub25Tb3J0YWJsZVByb3BlcnRpZXMgPSBbXTtcblx0Ly8gQ2hlY2sgYW5ub3RhdGlvbnMgZm9yIG1haW4gZW50aXR5XG5cdGlmIChNb2RlbEhlbHBlci5pc1NpbmdsZXRvbihlbnRpdHlTZXQpKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9IGVsc2UgaWYgKChlbnRpdHlTZXQgYXMgRW50aXR5U2V0KT8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcz8uU29ydFJlc3RyaWN0aW9ucz8uU29ydGFibGUgPT09IGZhbHNlKSB7XG5cdFx0Ly8gYWRkIGFsbCBwcm9wZXJ0aWVzIG9mIHRoZSBlbnRpdHkgdG8gdGhlIG5vblNvcnRhYmxlUHJvcGVydGllc1xuXHRcdG5vblNvcnRhYmxlUHJvcGVydGllcy5wdXNoKC4uLihlbnRpdHlTZXQgYXMgRW50aXR5U2V0KS5lbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gcHJvcGVydHkubmFtZSkpO1xuXHR9IGVsc2Uge1xuXHRcdG5vblNvcnRhYmxlUHJvcGVydGllcyA9XG5cdFx0XHQoZW50aXR5U2V0IGFzIEVudGl0eVNldCk/LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LlNvcnRSZXN0cmljdGlvbnM/Lk5vblNvcnRhYmxlUHJvcGVydGllcz8ubWFwKFxuXHRcdFx0XHQocHJvcGVydHkpID0+IHByb3BlcnR5LnZhbHVlXG5cdFx0XHQpIHx8IFtdO1xuXHR9XG5cdC8vIENoZWNrIGZvciBldmVyeSBuYXZpZ2F0aW9uUmVzdHJpY3Rpb24gaWYgaXQgaGFzIHNvcnRSZXN0cmljdGlvbnNcblx0ZW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zPy5SZXN0cmljdGVkUHJvcGVydGllcz8uZm9yRWFjaCgobmF2aWdhdGlvblJlc3RyaWN0aW9uKSA9PiB7XG5cdFx0aWYgKG5hdmlnYXRpb25SZXN0cmljdGlvbj8uU29ydFJlc3RyaWN0aW9ucz8uU29ydGFibGUgPT09IGZhbHNlKSB7XG5cdFx0XHQvLyBmaW5kIGNvcnJlY3QgbmF2aWdhdGlvbiBwcm9wZXJ0eVxuXHRcdFx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnR5ID0gZW50aXR5U2V0Py5lbnRpdHlUeXBlPy5uYXZpZ2F0aW9uUHJvcGVydGllcz8uZmlsdGVyKFxuXHRcdFx0XHQobmF2UHJvcGVydHkpID0+IG5hdlByb3BlcnR5Lm5hbWUgPT09IG5hdmlnYXRpb25SZXN0cmljdGlvbj8uTmF2aWdhdGlvblByb3BlcnR5Py52YWx1ZVxuXHRcdFx0KTtcblx0XHRcdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlbMF0pIHtcblx0XHRcdFx0Ly8gYWRkIGFsbCBwcm9wZXJ0aWVzIG9mIHRoZSBuYXZpZ2F0aW9uIHByb3BlcnR5IHRvIHRoZSBub25Tb3J0YWJsZVByb3BlcnRpZXNcblx0XHRcdFx0bm9uU29ydGFibGVQcm9wZXJ0aWVzLnB1c2goXG5cdFx0XHRcdFx0Li4ubmF2aWdhdGlvblByb3BlcnR5WzBdLnRhcmdldFR5cGU/LmVudGl0eVByb3BlcnRpZXMubWFwKFxuXHRcdFx0XHRcdFx0KHByb3BlcnR5KSA9PiBgJHtuYXZpZ2F0aW9uUHJvcGVydHlbMF0ubmFtZX0vJHtwcm9wZXJ0eS5uYW1lfWBcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGxlYXZlIHRoZSBwcm9wZXJ0eSBwYXRoIHVuY2hhbmdlZCAoaXQgaXMgcmVsYXRpdmUgdG8gdGhlIGFubm90YXRpb24gdGFyZ2V0ISlcblx0XHRcdGNvbnN0IG5vblNvcnRhYmxlTmF2aWdhdGlvblByb3BlcnRpZXMgPSBuYXZpZ2F0aW9uUmVzdHJpY3Rpb24/LlNvcnRSZXN0cmljdGlvbnM/Lk5vblNvcnRhYmxlUHJvcGVydGllcz8ubWFwKFxuXHRcdFx0XHQocHJvcGVydHkpID0+IHByb3BlcnR5LnZhbHVlXG5cdFx0XHQpO1xuXHRcdFx0aWYgKG5vblNvcnRhYmxlTmF2aWdhdGlvblByb3BlcnRpZXMpIHtcblx0XHRcdFx0bm9uU29ydGFibGVQcm9wZXJ0aWVzLnB1c2goLi4ubm9uU29ydGFibGVOYXZpZ2F0aW9uUHJvcGVydGllcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG5vblNvcnRhYmxlUHJvcGVydGllcztcbn07XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FB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