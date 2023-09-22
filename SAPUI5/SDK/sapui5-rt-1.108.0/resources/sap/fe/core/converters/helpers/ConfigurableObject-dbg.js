/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"], function (Log) {
  "use strict";

  var _exports = {};

  var Placement;

  (function (Placement) {
    Placement["After"] = "After";
    Placement["Before"] = "Before";
    Placement["End"] = "End";
  })(Placement || (Placement = {}));

  _exports.Placement = Placement;

  /**
   * Recursive method that order the keys based on a position information.
   *
   * @param positioningItems
   * @param anchor
   * @param sorted
   * @param visited
   * @returns The order of the current item
   */
  var orderPositioningItemRecursively = function (positioningItems, anchor, sorted, visited) {
    var insertIndex = sorted.indexOf(anchor);

    if (insertIndex !== -1) {
      return insertIndex;
    }

    var anchorItem = positioningItems[anchor];

    if (anchorItem === undefined) {
      var anchorText = anchor.split("::"),
          manifestItem = Object.keys(visited)[0];
      Log.warning("Position anchor '".concat(anchorText[anchorText.length - 1], "' not found for item '").concat(manifestItem, "'. Please check manifest settings."));
      return sorted.length; // throw new Error(`position anchor not found: ${anchor}`);
    }

    visited[anchor] = anchorItem;

    if (anchorItem && !(anchorItem.anchor in visited)) {
      insertIndex = orderPositioningItemRecursively(positioningItems, anchorItem.anchor, sorted, visited);

      if (anchorItem.placement !== Placement.Before) {
        ++insertIndex;
      }
    } else {
      insertIndex = sorted.length;
    }

    sorted.splice(insertIndex, 0, anchor);
    return insertIndex;
  };

  function isArrayConfig(config) {
    return typeof config === "object";
  }

  function applyOverride(overwritableKeys, sourceItem, customElement) {
    var outItem = sourceItem || customElement;

    for (var overwritableKey in overwritableKeys) {
      if (Object.hasOwnProperty.call(overwritableKeys, overwritableKey)) {
        var overrideConfig = overwritableKeys[overwritableKey];

        if (sourceItem !== null) {
          switch (overrideConfig) {
            case "overwrite":
              if (customElement.hasOwnProperty(overwritableKey) && customElement[overwritableKey] !== undefined) {
                sourceItem[overwritableKey] = customElement[overwritableKey];
              }

              break;

            case "merge":
            default:
              var subItem = sourceItem[overwritableKey] || [];
              var subConfig = {};

              if (isArrayConfig(overrideConfig)) {
                subConfig = overrideConfig;
              }

              if (Array.isArray(subItem)) {
                sourceItem[overwritableKey] = insertCustomElements(subItem, customElement && customElement[overwritableKey] || {}, subConfig);
              }

              break;
          }
        } else {
          switch (overrideConfig) {
            case "overwrite":
              if (customElement.hasOwnProperty(overwritableKey) && customElement[overwritableKey] !== undefined) {
                outItem[overwritableKey] = customElement[overwritableKey];
              }

              break;

            case "merge":
            default:
              var _subConfig = {};

              if (isArrayConfig(overrideConfig)) {
                _subConfig = overrideConfig;
              }

              outItem[overwritableKey] = insertCustomElements([], customElement && customElement[overwritableKey] || {}, _subConfig);
              break;
          }
        }
      }
    }

    return outItem;
  }
  /**
   * Insert a set of custom elements in the right position in an original collection.
   *
   * Parameters for overwritableKeys and their implications:
   * "overwrite": The whole object gets overwritten - if the customElements include a default, this will overrule the whole rootElements configuration.
   * "merge": This is similar to calling insertCustomElements itself. You must include the
   * full CustomElement syntax within the customElements, including anchors, for example.
   * "ignore": There are no additions and no combinations. Only the rootElements object is used.
   *
   * Note - Proceed as follows in case you have defined customElements and do not want to overwrite their values with defaults:
   * Hand the rootElements into the creation function of the customElement.
   * Depending on the existence of both rootElement-configuration and customElement-configuration,
   * you must set the customElements property, for which the "overwrite"-property is set, explicitly to undefined.
   *
   * @template T
   * @param rootElements A list of "ConfigurableObject" which means object that have a unique "key"
   * @param customElements An object containing extra object to add, they are indexed by a key and have a "position" object
   * @param overwritableKeys The list of keys from the original object that can be overwritten in case a custom element has the same "key"
   * @returns An ordered array of elements including the custom ones
   */


  function insertCustomElements(rootElements, customElements) {
    var overwritableKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var firstAnchor = rootElements.length ? rootElements[0].key : null;
    var rootElementsWithoutLast = rootElements.filter(function (rootElement) {
      var _rootElement$position;

      return ((_rootElement$position = rootElement.position) === null || _rootElement$position === void 0 ? void 0 : _rootElement$position.placement) !== Placement.End;
    });
    var lastAnchor = rootElements.length ? rootElements[rootElementsWithoutLast.length - 1].key : null;
    var endElement;
    var positioningItems = {};
    var itemsPerKey = {};
    rootElements.forEach(function (rootElement) {
      var _rootElement$position2;

      if (((_rootElement$position2 = rootElement.position) === null || _rootElement$position2 === void 0 ? void 0 : _rootElement$position2.placement) === Placement.End && !endElement) {
        endElement = rootElement;
      } else {
        var _rootElement$position3, _rootElement$position4;

        positioningItems[rootElement.key] = {
          anchor: ((_rootElement$position3 = rootElement.position) === null || _rootElement$position3 === void 0 ? void 0 : _rootElement$position3.anchor) || rootElement.key,
          placement: ((_rootElement$position4 = rootElement.position) === null || _rootElement$position4 === void 0 ? void 0 : _rootElement$position4.placement) || Placement.After
        };
      }

      itemsPerKey[rootElement.key] = rootElement;
    });
    Object.keys(customElements).forEach(function (customElementKey) {
      var _customElement$menu;

      var customElement = customElements[customElementKey];
      var anchor = customElement.position.anchor; // If no placement defined we are After

      if (!customElement.position.placement) {
        customElement.position.placement = Placement.After;
      } // If no anchor we're either After the last anchor or Before the first


      if (!anchor) {
        var potentialAnchor = customElement.position.placement === Placement.After ? lastAnchor : firstAnchor;
        customElement.position.anchor = potentialAnchor ? potentialAnchor : customElementKey;
      } // Adding bound/unbound actions to menu


      customElement.menu = customElement === null || customElement === void 0 ? void 0 : (_customElement$menu = customElement.menu) === null || _customElement$menu === void 0 ? void 0 : _customElement$menu.map(function (menu) {
        var _itemsPerKey$menu$key;

        return (_itemsPerKey$menu$key = itemsPerKey[menu.key]) !== null && _itemsPerKey$menu$key !== void 0 ? _itemsPerKey$menu$key : menu;
      });

      if (itemsPerKey[customElement.key]) {
        itemsPerKey[customElement.key] = applyOverride(overwritableKeys, itemsPerKey[customElement.key], customElement); //Position is overwritten for filter fields if there is a change in manifest

        if (anchor && customElement.position && overwritableKeys.position && overwritableKeys.position === "overwrite") {
          positioningItems[customElement.key] = itemsPerKey[customElement.key].position;
        }
        /**
         * anchor check is added to make sure change in properties in the manifest does not affect the position of the field.
         * Otherwise, when no position is mentioned in manifest for an altered field, the position is changed as
         * per the potential anchor
         */

      } else {
        itemsPerKey[customElement.key] = applyOverride(overwritableKeys, null, customElement);
        positioningItems[customElement.key] = customElement.position;
      }
    });
    var sortedKeys = [];
    Object.keys(positioningItems).forEach(function (positionItemKey) {
      orderPositioningItemRecursively(positioningItems, positionItemKey, sortedKeys, {});
    });
    var outElements = sortedKeys.map(function (key) {
      return itemsPerKey[key];
    });

    if (endElement) {
      outElements.push(endElement);
    }

    return outElements;
  }

  _exports.insertCustomElements = insertCustomElements;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQbGFjZW1lbnQiLCJvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5IiwicG9zaXRpb25pbmdJdGVtcyIsImFuY2hvciIsInNvcnRlZCIsInZpc2l0ZWQiLCJpbnNlcnRJbmRleCIsImluZGV4T2YiLCJhbmNob3JJdGVtIiwidW5kZWZpbmVkIiwiYW5jaG9yVGV4dCIsInNwbGl0IiwibWFuaWZlc3RJdGVtIiwiT2JqZWN0Iiwia2V5cyIsIkxvZyIsIndhcm5pbmciLCJsZW5ndGgiLCJwbGFjZW1lbnQiLCJCZWZvcmUiLCJzcGxpY2UiLCJpc0FycmF5Q29uZmlnIiwiY29uZmlnIiwiYXBwbHlPdmVycmlkZSIsIm92ZXJ3cml0YWJsZUtleXMiLCJzb3VyY2VJdGVtIiwiY3VzdG9tRWxlbWVudCIsIm91dEl0ZW0iLCJvdmVyd3JpdGFibGVLZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJvdmVycmlkZUNvbmZpZyIsInN1Ykl0ZW0iLCJzdWJDb25maWciLCJBcnJheSIsImlzQXJyYXkiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsInJvb3RFbGVtZW50cyIsImN1c3RvbUVsZW1lbnRzIiwiZmlyc3RBbmNob3IiLCJrZXkiLCJyb290RWxlbWVudHNXaXRob3V0TGFzdCIsImZpbHRlciIsInJvb3RFbGVtZW50IiwicG9zaXRpb24iLCJFbmQiLCJsYXN0QW5jaG9yIiwiZW5kRWxlbWVudCIsIml0ZW1zUGVyS2V5IiwiZm9yRWFjaCIsIkFmdGVyIiwiY3VzdG9tRWxlbWVudEtleSIsInBvdGVudGlhbEFuY2hvciIsIm1lbnUiLCJtYXAiLCJzb3J0ZWRLZXlzIiwicG9zaXRpb25JdGVtS2V5Iiwib3V0RWxlbWVudHMiLCJwdXNoIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJDb25maWd1cmFibGVPYmplY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5cbmV4cG9ydCB0eXBlIFBvc2l0aW9uID0ge1xuXHRhbmNob3I/OiBzdHJpbmc7XG5cdHBsYWNlbWVudDogUGxhY2VtZW50O1xufTtcblxuZXhwb3J0IGVudW0gUGxhY2VtZW50IHtcblx0QWZ0ZXIgPSBcIkFmdGVyXCIsXG5cdEJlZm9yZSA9IFwiQmVmb3JlXCIsXG5cdEVuZCA9IFwiRW5kXCJcbn1cbmV4cG9ydCB0eXBlIENvbmZpZ3VyYWJsZU9iamVjdEtleSA9IHN0cmluZztcbmV4cG9ydCB0eXBlIENvbmZpZ3VyYWJsZU9iamVjdCA9IFBvc2l0aW9uYWJsZSAmIHtcblx0a2V5OiBDb25maWd1cmFibGVPYmplY3RLZXk7XG59O1xuXG5leHBvcnQgdHlwZSBDdXN0b21FbGVtZW50PFQgZXh0ZW5kcyBDb25maWd1cmFibGVPYmplY3Q+ID0gVCAmIHtcblx0cG9zaXRpb246IFBvc2l0aW9uO1xuXHRtZW51PzogYW55W10gfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgdHlwZSBQb3NpdGlvbmFibGUgPSB7XG5cdHBvc2l0aW9uPzogUG9zaXRpb247XG59O1xuXG5leHBvcnQgdHlwZSBDb25maWd1cmFibGVSZWNvcmQ8VD4gPSBSZWNvcmQ8Q29uZmlndXJhYmxlT2JqZWN0S2V5LCBUPjtcblxuLyoqXG4gKiBSZWN1cnNpdmUgbWV0aG9kIHRoYXQgb3JkZXIgdGhlIGtleXMgYmFzZWQgb24gYSBwb3NpdGlvbiBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0gcG9zaXRpb25pbmdJdGVtc1xuICogQHBhcmFtIGFuY2hvclxuICogQHBhcmFtIHNvcnRlZFxuICogQHBhcmFtIHZpc2l0ZWRcbiAqIEByZXR1cm5zIFRoZSBvcmRlciBvZiB0aGUgY3VycmVudCBpdGVtXG4gKi9cbmNvbnN0IG9yZGVyUG9zaXRpb25pbmdJdGVtUmVjdXJzaXZlbHkgPSAoXG5cdHBvc2l0aW9uaW5nSXRlbXM6IFJlY29yZDxzdHJpbmcsIFJlcXVpcmVkPFBvc2l0aW9uPj4sXG5cdGFuY2hvcjogc3RyaW5nLFxuXHRzb3J0ZWQ6IHN0cmluZ1tdLFxuXHR2aXNpdGVkOiBSZWNvcmQ8c3RyaW5nLCBSZXF1aXJlZDxQb3NpdGlvbj4+XG4pOiBudW1iZXIgPT4ge1xuXHRsZXQgaW5zZXJ0SW5kZXggPSBzb3J0ZWQuaW5kZXhPZihhbmNob3IpO1xuXHRpZiAoaW5zZXJ0SW5kZXggIT09IC0xKSB7XG5cdFx0cmV0dXJuIGluc2VydEluZGV4O1xuXHR9XG5cdGNvbnN0IGFuY2hvckl0ZW06IFJlcXVpcmVkPFBvc2l0aW9uPiA9IHBvc2l0aW9uaW5nSXRlbXNbYW5jaG9yXTtcblx0aWYgKGFuY2hvckl0ZW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGFuY2hvclRleHQ6IEFycmF5PHN0cmluZz4gPSBhbmNob3Iuc3BsaXQoXCI6OlwiKSxcblx0XHRcdG1hbmlmZXN0SXRlbTogc3RyaW5nID0gT2JqZWN0LmtleXModmlzaXRlZClbMF07XG5cblx0XHRMb2cud2FybmluZyhcblx0XHRcdGBQb3NpdGlvbiBhbmNob3IgJyR7YW5jaG9yVGV4dFthbmNob3JUZXh0Lmxlbmd0aCAtIDFdfScgbm90IGZvdW5kIGZvciBpdGVtICcke21hbmlmZXN0SXRlbX0nLiBQbGVhc2UgY2hlY2sgbWFuaWZlc3Qgc2V0dGluZ3MuYFxuXHRcdCk7XG5cdFx0cmV0dXJuIHNvcnRlZC5sZW5ndGg7XG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKGBwb3NpdGlvbiBhbmNob3Igbm90IGZvdW5kOiAke2FuY2hvcn1gKTtcblx0fVxuXG5cdHZpc2l0ZWRbYW5jaG9yXSA9IGFuY2hvckl0ZW07XG5cdGlmIChhbmNob3JJdGVtICYmICEoYW5jaG9ySXRlbS5hbmNob3IgaW4gdmlzaXRlZCkpIHtcblx0XHRpbnNlcnRJbmRleCA9IG9yZGVyUG9zaXRpb25pbmdJdGVtUmVjdXJzaXZlbHkocG9zaXRpb25pbmdJdGVtcywgYW5jaG9ySXRlbS5hbmNob3IsIHNvcnRlZCwgdmlzaXRlZCk7XG5cdFx0aWYgKGFuY2hvckl0ZW0ucGxhY2VtZW50ICE9PSBQbGFjZW1lbnQuQmVmb3JlKSB7XG5cdFx0XHQrK2luc2VydEluZGV4O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpbnNlcnRJbmRleCA9IHNvcnRlZC5sZW5ndGg7XG5cdH1cblxuXHRzb3J0ZWQuc3BsaWNlKGluc2VydEluZGV4LCAwLCBhbmNob3IpO1xuXHRyZXR1cm4gaW5zZXJ0SW5kZXg7XG59O1xuXG50eXBlIE92ZXJyaWRlVHlwZSA9IFwibWVyZ2VcIiB8IFwib3ZlcndyaXRlXCIgfCBcImlnbm9yZVwiO1xudHlwZSBBcnJheU92ZXJyaWRlVHlwZTxBcnJheVR5cGU+ID0gT3ZlcnJpZGVLZXlzPEFycmF5VHlwZT47XG5cbnR5cGUgRWxlbWVudFR5cGU8VD4gPSBUIGV4dGVuZHMgYW55W10gPyBUW251bWJlcl0gOiBUO1xudHlwZSBPdmVycmlkZUtleXM8VD4gPSB7XG5cdFtQIGluIGtleW9mIFRdPzogT3ZlcnJpZGVUeXBlIHwgQXJyYXlPdmVycmlkZVR5cGU8RWxlbWVudFR5cGU8VFtQXT4+O1xufTtcblxuZnVuY3Rpb24gaXNBcnJheUNvbmZpZzxUPihjb25maWc6IE92ZXJyaWRlVHlwZSB8IEFycmF5T3ZlcnJpZGVUeXBlPFQ+IHwgdW5kZWZpbmVkKTogY29uZmlnIGlzIEFycmF5T3ZlcnJpZGVUeXBlPFQ+IHtcblx0cmV0dXJuIHR5cGVvZiBjb25maWcgPT09IFwib2JqZWN0XCI7XG59XG5cbmZ1bmN0aW9uIGFwcGx5T3ZlcnJpZGU8VCBleHRlbmRzIE9iamVjdD4ob3ZlcndyaXRhYmxlS2V5czogT3ZlcnJpZGVLZXlzPFQ+LCBzb3VyY2VJdGVtOiBUIHwgbnVsbCwgY3VzdG9tRWxlbWVudDogVCk6IFQge1xuXHRjb25zdCBvdXRJdGVtOiBUID0gc291cmNlSXRlbSB8fCBjdXN0b21FbGVtZW50O1xuXHRmb3IgKGNvbnN0IG92ZXJ3cml0YWJsZUtleSBpbiBvdmVyd3JpdGFibGVLZXlzKSB7XG5cdFx0aWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJ3cml0YWJsZUtleXMsIG92ZXJ3cml0YWJsZUtleSkpIHtcblx0XHRcdGNvbnN0IG92ZXJyaWRlQ29uZmlnID0gb3ZlcndyaXRhYmxlS2V5c1tvdmVyd3JpdGFibGVLZXldO1xuXHRcdFx0aWYgKHNvdXJjZUl0ZW0gIT09IG51bGwpIHtcblx0XHRcdFx0c3dpdGNoIChvdmVycmlkZUNvbmZpZykge1xuXHRcdFx0XHRcdGNhc2UgXCJvdmVyd3JpdGVcIjpcblx0XHRcdFx0XHRcdGlmIChjdXN0b21FbGVtZW50Lmhhc093blByb3BlcnR5KG92ZXJ3cml0YWJsZUtleSkgJiYgY3VzdG9tRWxlbWVudFtvdmVyd3JpdGFibGVLZXldICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0c291cmNlSXRlbVtvdmVyd3JpdGFibGVLZXldID0gY3VzdG9tRWxlbWVudFtvdmVyd3JpdGFibGVLZXldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIm1lcmdlXCI6XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGNvbnN0IHN1Ykl0ZW0gPSBzb3VyY2VJdGVtW292ZXJ3cml0YWJsZUtleV0gfHwgKFtdIGFzIGFueVtdKTtcblx0XHRcdFx0XHRcdGxldCBzdWJDb25maWcgPSB7fTtcblx0XHRcdFx0XHRcdGlmIChpc0FycmF5Q29uZmlnKG92ZXJyaWRlQ29uZmlnKSkge1xuXHRcdFx0XHRcdFx0XHRzdWJDb25maWcgPSBvdmVycmlkZUNvbmZpZztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHN1Ykl0ZW0pKSB7XG5cdFx0XHRcdFx0XHRcdHNvdXJjZUl0ZW1bb3ZlcndyaXRhYmxlS2V5XSA9IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdFx0XHRcdFx0XHRcdHN1Ykl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0KGN1c3RvbUVsZW1lbnQgJiYgKGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50PGFueT4+KSkgfHwge30sXG5cdFx0XHRcdFx0XHRcdFx0c3ViQ29uZmlnXG5cdFx0XHRcdFx0XHRcdCkgYXMgYW55O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN3aXRjaCAob3ZlcnJpZGVDb25maWcpIHtcblx0XHRcdFx0XHRjYXNlIFwib3ZlcndyaXRlXCI6XG5cdFx0XHRcdFx0XHRpZiAoY3VzdG9tRWxlbWVudC5oYXNPd25Qcm9wZXJ0eShvdmVyd3JpdGFibGVLZXkpICYmIGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdG91dEl0ZW1bb3ZlcndyaXRhYmxlS2V5XSA9IGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJtZXJnZVwiOlxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRsZXQgc3ViQ29uZmlnID0ge307XG5cdFx0XHRcdFx0XHRpZiAoaXNBcnJheUNvbmZpZyhvdmVycmlkZUNvbmZpZykpIHtcblx0XHRcdFx0XHRcdFx0c3ViQ29uZmlnID0gb3ZlcnJpZGVDb25maWc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvdXRJdGVtW292ZXJ3cml0YWJsZUtleV0gPSBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRcdFx0XHRcdFx0W10gYXMgYW55W10sXG5cdFx0XHRcdFx0XHRcdChjdXN0b21FbGVtZW50ICYmIChjdXN0b21FbGVtZW50W292ZXJ3cml0YWJsZUtleV0gYXMgUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudDxhbnk+PikpIHx8IHt9LFxuXHRcdFx0XHRcdFx0XHRzdWJDb25maWdcblx0XHRcdFx0XHRcdCkgYXMgYW55O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dEl0ZW07XG59XG5cbi8qKlxuICogSW5zZXJ0IGEgc2V0IG9mIGN1c3RvbSBlbGVtZW50cyBpbiB0aGUgcmlnaHQgcG9zaXRpb24gaW4gYW4gb3JpZ2luYWwgY29sbGVjdGlvbi5cbiAqXG4gKiBQYXJhbWV0ZXJzIGZvciBvdmVyd3JpdGFibGVLZXlzIGFuZCB0aGVpciBpbXBsaWNhdGlvbnM6XG4gKiBcIm92ZXJ3cml0ZVwiOiBUaGUgd2hvbGUgb2JqZWN0IGdldHMgb3ZlcndyaXR0ZW4gLSBpZiB0aGUgY3VzdG9tRWxlbWVudHMgaW5jbHVkZSBhIGRlZmF1bHQsIHRoaXMgd2lsbCBvdmVycnVsZSB0aGUgd2hvbGUgcm9vdEVsZW1lbnRzIGNvbmZpZ3VyYXRpb24uXG4gKiBcIm1lcmdlXCI6IFRoaXMgaXMgc2ltaWxhciB0byBjYWxsaW5nIGluc2VydEN1c3RvbUVsZW1lbnRzIGl0c2VsZi4gWW91IG11c3QgaW5jbHVkZSB0aGVcbiAqIGZ1bGwgQ3VzdG9tRWxlbWVudCBzeW50YXggd2l0aGluIHRoZSBjdXN0b21FbGVtZW50cywgaW5jbHVkaW5nIGFuY2hvcnMsIGZvciBleGFtcGxlLlxuICogXCJpZ25vcmVcIjogVGhlcmUgYXJlIG5vIGFkZGl0aW9ucyBhbmQgbm8gY29tYmluYXRpb25zLiBPbmx5IHRoZSByb290RWxlbWVudHMgb2JqZWN0IGlzIHVzZWQuXG4gKlxuICogTm90ZSAtIFByb2NlZWQgYXMgZm9sbG93cyBpbiBjYXNlIHlvdSBoYXZlIGRlZmluZWQgY3VzdG9tRWxlbWVudHMgYW5kIGRvIG5vdCB3YW50IHRvIG92ZXJ3cml0ZSB0aGVpciB2YWx1ZXMgd2l0aCBkZWZhdWx0czpcbiAqIEhhbmQgdGhlIHJvb3RFbGVtZW50cyBpbnRvIHRoZSBjcmVhdGlvbiBmdW5jdGlvbiBvZiB0aGUgY3VzdG9tRWxlbWVudC5cbiAqIERlcGVuZGluZyBvbiB0aGUgZXhpc3RlbmNlIG9mIGJvdGggcm9vdEVsZW1lbnQtY29uZmlndXJhdGlvbiBhbmQgY3VzdG9tRWxlbWVudC1jb25maWd1cmF0aW9uLFxuICogeW91IG11c3Qgc2V0IHRoZSBjdXN0b21FbGVtZW50cyBwcm9wZXJ0eSwgZm9yIHdoaWNoIHRoZSBcIm92ZXJ3cml0ZVwiLXByb3BlcnR5IGlzIHNldCwgZXhwbGljaXRseSB0byB1bmRlZmluZWQuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSByb290RWxlbWVudHMgQSBsaXN0IG9mIFwiQ29uZmlndXJhYmxlT2JqZWN0XCIgd2hpY2ggbWVhbnMgb2JqZWN0IHRoYXQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiXG4gKiBAcGFyYW0gY3VzdG9tRWxlbWVudHMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgZXh0cmEgb2JqZWN0IHRvIGFkZCwgdGhleSBhcmUgaW5kZXhlZCBieSBhIGtleSBhbmQgaGF2ZSBhIFwicG9zaXRpb25cIiBvYmplY3RcbiAqIEBwYXJhbSBvdmVyd3JpdGFibGVLZXlzIFRoZSBsaXN0IG9mIGtleXMgZnJvbSB0aGUgb3JpZ2luYWwgb2JqZWN0IHRoYXQgY2FuIGJlIG92ZXJ3cml0dGVuIGluIGNhc2UgYSBjdXN0b20gZWxlbWVudCBoYXMgdGhlIHNhbWUgXCJrZXlcIlxuICogQHJldHVybnMgQW4gb3JkZXJlZCBhcnJheSBvZiBlbGVtZW50cyBpbmNsdWRpbmcgdGhlIGN1c3RvbSBvbmVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRDdXN0b21FbGVtZW50czxUIGV4dGVuZHMgQ29uZmlndXJhYmxlT2JqZWN0Pihcblx0cm9vdEVsZW1lbnRzOiBUW10sXG5cdGN1c3RvbUVsZW1lbnRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50PFQ+Pixcblx0b3ZlcndyaXRhYmxlS2V5czogT3ZlcnJpZGVLZXlzPFQ+ID0ge31cbik6IFRbXSB7XG5cdGNvbnN0IGZpcnN0QW5jaG9yID0gcm9vdEVsZW1lbnRzLmxlbmd0aCA/IHJvb3RFbGVtZW50c1swXS5rZXkgOiBudWxsO1xuXHRjb25zdCByb290RWxlbWVudHNXaXRob3V0TGFzdCA9IHJvb3RFbGVtZW50cy5maWx0ZXIoKHJvb3RFbGVtZW50KSA9PiB7XG5cdFx0cmV0dXJuIHJvb3RFbGVtZW50LnBvc2l0aW9uPy5wbGFjZW1lbnQgIT09IFBsYWNlbWVudC5FbmQ7XG5cdH0pO1xuXHRjb25zdCBsYXN0QW5jaG9yID0gcm9vdEVsZW1lbnRzLmxlbmd0aCA/IHJvb3RFbGVtZW50c1tyb290RWxlbWVudHNXaXRob3V0TGFzdC5sZW5ndGggLSAxXS5rZXkgOiBudWxsO1xuXHRsZXQgZW5kRWxlbWVudDogVCB8IHVuZGVmaW5lZDtcblx0Y29uc3QgcG9zaXRpb25pbmdJdGVtczogUmVjb3JkPHN0cmluZywgUmVxdWlyZWQ8UG9zaXRpb24+PiA9IHt9O1xuXHRjb25zdCBpdGVtc1BlcktleTogUmVjb3JkPHN0cmluZywgVD4gPSB7fTtcblx0cm9vdEVsZW1lbnRzLmZvckVhY2goKHJvb3RFbGVtZW50KSA9PiB7XG5cdFx0aWYgKHJvb3RFbGVtZW50LnBvc2l0aW9uPy5wbGFjZW1lbnQgPT09IFBsYWNlbWVudC5FbmQgJiYgIWVuZEVsZW1lbnQpIHtcblx0XHRcdGVuZEVsZW1lbnQgPSByb290RWxlbWVudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cG9zaXRpb25pbmdJdGVtc1tyb290RWxlbWVudC5rZXldID0ge1xuXHRcdFx0XHRhbmNob3I6IHJvb3RFbGVtZW50LnBvc2l0aW9uPy5hbmNob3IgfHwgcm9vdEVsZW1lbnQua2V5LFxuXHRcdFx0XHRwbGFjZW1lbnQ6IHJvb3RFbGVtZW50LnBvc2l0aW9uPy5wbGFjZW1lbnQgfHwgUGxhY2VtZW50LkFmdGVyXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRpdGVtc1BlcktleVtyb290RWxlbWVudC5rZXldID0gcm9vdEVsZW1lbnQ7XG5cdH0pO1xuXHRPYmplY3Qua2V5cyhjdXN0b21FbGVtZW50cykuZm9yRWFjaCgoY3VzdG9tRWxlbWVudEtleSkgPT4ge1xuXHRcdGNvbnN0IGN1c3RvbUVsZW1lbnQgPSBjdXN0b21FbGVtZW50c1tjdXN0b21FbGVtZW50S2V5XTtcblx0XHRjb25zdCBhbmNob3IgPSBjdXN0b21FbGVtZW50LnBvc2l0aW9uLmFuY2hvcjtcblx0XHQvLyBJZiBubyBwbGFjZW1lbnQgZGVmaW5lZCB3ZSBhcmUgQWZ0ZXJcblx0XHRpZiAoIWN1c3RvbUVsZW1lbnQucG9zaXRpb24ucGxhY2VtZW50KSB7XG5cdFx0XHRjdXN0b21FbGVtZW50LnBvc2l0aW9uLnBsYWNlbWVudCA9IFBsYWNlbWVudC5BZnRlcjtcblx0XHR9XG5cdFx0Ly8gSWYgbm8gYW5jaG9yIHdlJ3JlIGVpdGhlciBBZnRlciB0aGUgbGFzdCBhbmNob3Igb3IgQmVmb3JlIHRoZSBmaXJzdFxuXHRcdGlmICghYW5jaG9yKSB7XG5cdFx0XHRjb25zdCBwb3RlbnRpYWxBbmNob3IgPSBjdXN0b21FbGVtZW50LnBvc2l0aW9uLnBsYWNlbWVudCA9PT0gUGxhY2VtZW50LkFmdGVyID8gbGFzdEFuY2hvciA6IGZpcnN0QW5jaG9yO1xuXHRcdFx0Y3VzdG9tRWxlbWVudC5wb3NpdGlvbi5hbmNob3IgPSBwb3RlbnRpYWxBbmNob3IgPyBwb3RlbnRpYWxBbmNob3IgOiBjdXN0b21FbGVtZW50S2V5O1xuXHRcdH1cblxuXHRcdC8vIEFkZGluZyBib3VuZC91bmJvdW5kIGFjdGlvbnMgdG8gbWVudVxuXHRcdGN1c3RvbUVsZW1lbnQubWVudSA9IGN1c3RvbUVsZW1lbnQ/Lm1lbnU/Lm1hcCgobWVudSkgPT4ge1xuXHRcdFx0cmV0dXJuIGl0ZW1zUGVyS2V5W21lbnUua2V5XSA/PyBtZW51O1xuXHRcdH0pO1xuXG5cdFx0aWYgKGl0ZW1zUGVyS2V5W2N1c3RvbUVsZW1lbnQua2V5XSkge1xuXHRcdFx0aXRlbXNQZXJLZXlbY3VzdG9tRWxlbWVudC5rZXldID0gYXBwbHlPdmVycmlkZShvdmVyd3JpdGFibGVLZXlzLCBpdGVtc1BlcktleVtjdXN0b21FbGVtZW50LmtleV0sIGN1c3RvbUVsZW1lbnQpO1xuXG5cdFx0XHQvL1Bvc2l0aW9uIGlzIG92ZXJ3cml0dGVuIGZvciBmaWx0ZXIgZmllbGRzIGlmIHRoZXJlIGlzIGEgY2hhbmdlIGluIG1hbmlmZXN0XG5cdFx0XHRpZiAoYW5jaG9yICYmIGN1c3RvbUVsZW1lbnQucG9zaXRpb24gJiYgb3ZlcndyaXRhYmxlS2V5cy5wb3NpdGlvbiAmJiBvdmVyd3JpdGFibGVLZXlzLnBvc2l0aW9uID09PSBcIm92ZXJ3cml0ZVwiKSB7XG5cdFx0XHRcdHBvc2l0aW9uaW5nSXRlbXNbY3VzdG9tRWxlbWVudC5rZXldID0gaXRlbXNQZXJLZXlbY3VzdG9tRWxlbWVudC5rZXldLnBvc2l0aW9uIGFzIFJlcXVpcmVkPFBvc2l0aW9uPjtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogYW5jaG9yIGNoZWNrIGlzIGFkZGVkIHRvIG1ha2Ugc3VyZSBjaGFuZ2UgaW4gcHJvcGVydGllcyBpbiB0aGUgbWFuaWZlc3QgZG9lcyBub3QgYWZmZWN0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZmllbGQuXG5cdFx0XHQgKiBPdGhlcndpc2UsIHdoZW4gbm8gcG9zaXRpb24gaXMgbWVudGlvbmVkIGluIG1hbmlmZXN0IGZvciBhbiBhbHRlcmVkIGZpZWxkLCB0aGUgcG9zaXRpb24gaXMgY2hhbmdlZCBhc1xuXHRcdFx0ICogcGVyIHRoZSBwb3RlbnRpYWwgYW5jaG9yXG5cdFx0XHQgKi9cblx0XHR9IGVsc2Uge1xuXHRcdFx0aXRlbXNQZXJLZXlbY3VzdG9tRWxlbWVudC5rZXldID0gYXBwbHlPdmVycmlkZShvdmVyd3JpdGFibGVLZXlzLCBudWxsLCBjdXN0b21FbGVtZW50KTtcblx0XHRcdHBvc2l0aW9uaW5nSXRlbXNbY3VzdG9tRWxlbWVudC5rZXldID0gY3VzdG9tRWxlbWVudC5wb3NpdGlvbiBhcyBSZXF1aXJlZDxQb3NpdGlvbj47XG5cdFx0fVxuXHR9KTtcblx0Y29uc3Qgc29ydGVkS2V5czogc3RyaW5nW10gPSBbXTtcblxuXHRPYmplY3Qua2V5cyhwb3NpdGlvbmluZ0l0ZW1zKS5mb3JFYWNoKChwb3NpdGlvbkl0ZW1LZXkpID0+IHtcblx0XHRvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5KHBvc2l0aW9uaW5nSXRlbXMsIHBvc2l0aW9uSXRlbUtleSwgc29ydGVkS2V5cywge30pO1xuXHR9KTtcblxuXHRjb25zdCBvdXRFbGVtZW50cyA9IHNvcnRlZEtleXMubWFwKChrZXkpID0+IGl0ZW1zUGVyS2V5W2tleV0pO1xuXHRpZiAoZW5kRWxlbWVudCkge1xuXHRcdG91dEVsZW1lbnRzLnB1c2goZW5kRWxlbWVudCk7XG5cdH1cblx0cmV0dXJuIG91dEVsZW1lbnRzO1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7TUFPWUEsUzs7YUFBQUEsUztJQUFBQSxTO0lBQUFBLFM7SUFBQUEsUztLQUFBQSxTLEtBQUFBLFM7Ozs7RUFxQlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsSUFBTUMsK0JBQStCLEdBQUcsVUFDdkNDLGdCQUR1QyxFQUV2Q0MsTUFGdUMsRUFHdkNDLE1BSHVDLEVBSXZDQyxPQUp1QyxFQUszQjtJQUNaLElBQUlDLFdBQVcsR0FBR0YsTUFBTSxDQUFDRyxPQUFQLENBQWVKLE1BQWYsQ0FBbEI7O0lBQ0EsSUFBSUcsV0FBVyxLQUFLLENBQUMsQ0FBckIsRUFBd0I7TUFDdkIsT0FBT0EsV0FBUDtJQUNBOztJQUNELElBQU1FLFVBQThCLEdBQUdOLGdCQUFnQixDQUFDQyxNQUFELENBQXZEOztJQUNBLElBQUlLLFVBQVUsS0FBS0MsU0FBbkIsRUFBOEI7TUFDN0IsSUFBTUMsVUFBeUIsR0FBR1AsTUFBTSxDQUFDUSxLQUFQLENBQWEsSUFBYixDQUFsQztNQUFBLElBQ0NDLFlBQW9CLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZVCxPQUFaLEVBQXFCLENBQXJCLENBRHhCO01BR0FVLEdBQUcsQ0FBQ0MsT0FBSiw0QkFDcUJOLFVBQVUsQ0FBQ0EsVUFBVSxDQUFDTyxNQUFYLEdBQW9CLENBQXJCLENBRC9CLG1DQUMrRUwsWUFEL0U7TUFHQSxPQUFPUixNQUFNLENBQUNhLE1BQWQsQ0FQNkIsQ0FRN0I7SUFD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