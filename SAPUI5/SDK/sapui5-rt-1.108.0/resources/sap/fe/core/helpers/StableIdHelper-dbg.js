/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  /**
   * Stable Id helper
   */

  /**
   * Copy for the Core.isValid function to be independent.
   *
   * @param vValue String to validate
   * @returns Whether the value is valid or not
   */
  function isValid(vValue) {
    return /^([A-Za-z_][-A-Za-z0-9_.:]*)$/.test(vValue);
  }

  function replaceSpecialChars(sId) {
    if (sId.indexOf(" ") >= 0) {
      // Log.error(sId + " - Spaces are not allowed in ID parts.");
      throw "".concat(sId, " - Spaces are not allowed in ID parts.");
    }

    sId = sId.replace(/^\/|^@|^#|^\*/, "") // remove special characters from the beginning of the string
    .replace(/\/$|@$|#$|\*$/, "") // remove special characters from the end of the string
    .replace(/\/|@|\(|\)|#|\*/g, "::"); // replace special characters with ::
    // Replace double occurrences of the separator with a single separator

    while (sId.indexOf("::::") > -1) {
      sId = sId.replace("::::", "::");
    } // If there is a :: at the end of the ID remove it


    if (sId.slice(-2) == "::") {
      sId = sId.slice(0, -2);
    }

    return sId;
  }

  _exports.replaceSpecialChars = replaceSpecialChars;

  function removeNamespaces(sId) {
    sId = sId.replace("com.sap.vocabularies.UI.v1.", "");
    sId = sId.replace("com.sap.vocabularies.Communication.v1.", "");
    return sId;
  }

  function getStableIdPartFromValue(oValue) {
    if (oValue && oValue.$Path || oValue.path) {
      return oValue.$Path || oValue.path;
    }

    if (oValue && oValue.$Apply && oValue.$Function === "odata.concat") {
      var sPathConcat = "";

      for (var i = 0; i < oValue.$Apply.length; i++) {
        if (oValue.$Apply[i].$Path) {
          if (sPathConcat) {
            sPathConcat += "::";
          }

          sPathConcat += oValue.$Apply[i].$Path;
        }
      }

      return sPathConcat;
    }

    if (oValue) {
      return replaceSpecialChars(oValue.replace(/ /g, "_"));
    }
  }
  /**
   * Generates Stable Id based on the given parameters
   *
   * parameters are combined in the same order that they are provided and are separated by '::'
   * special characters (@, /, #) are replaced by '::' if they are in the middle of the Stable Id and removed all together if the are part at the beginning or end
   * Example:
   * // Get Constant Stable Id
   * generate(['Stable', 'Id']) would result in 'Stable::Id' as the Stable Id
   *
   * // Get Paramerterized Stable Id from a Collection Facet
   * var oParameter = {
   * 		Facet: {
   * 			$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
   * 			Label: "General Info Facet Label",
   * 			ID: 'GeneralInformation'
   * 		}
   * };
   * generate(['section', oParameter]) would result in 'section::GeneralInformation' as the Stable Id
   *
   * oParameter is and object of Metadata contexts available while templating which will be used to generate Stable IDs.
   * oParameter object keys define the type of metadata context.
   * For example, the key 'Facet'in the above example tells the Stable Id Helper that the context is a Facet (could be reference or collection facet)
   *
   * Currently supported metadata context is Collection/Reference facet identified by 'Facet' key.
   *
   * @param aStableIdParts Array of strings and objects
   * @returns Stable Id constructed from the provided parameters
   */


  var generate = function (aStableIdParts) {
    var sStableId = "",
        vElement,
        sFacetId;

    for (var i = 0; i < aStableIdParts.length; i++) {
      vElement = aStableIdParts[i];

      if (!vElement) {
        continue;
      }

      sStableId += sStableId !== "" ? "::" : "";

      if (vElement["Facet"] && vElement["Facet"]["$Type"] && vElement["Facet"]["$Type"] == "com.sap.vocabularies.UI.v1.CollectionFacet") {
        sStableId += vElement["Facet"]["ID"];
      } else if (typeof vElement === "string") {
        if (vElement) {
          sStableId += vElement;
        }
      } else if (typeof vElement === "object") {
        // handle parameters
        if (vElement && vElement.Facet) {
          if (vElement.Facet.$Type && vElement.Facet.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
            if (vElement.Facet.ID) {
              sFacetId = vElement.Facet.ID;
            }
          } else if (vElement.Facet.$Type && vElement.Facet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
            if (vElement.Facet.ID) {
              sFacetId = vElement.Facet.ID;
            } else {
              sFacetId = vElement.Facet.Target.$AnnotationPath || vElement.Facet.Target.value; // Compliant with Converters
            }
          } else if (vElement.Facet.$Type && vElement.Facet.$Type === "com.sap.vocabularies.UI.v1.FieldGroupType") {
            if (vElement.Facet.Label) {
              sFacetId = vElement.Facet.Label;
            }
          }

          if (sFacetId) {
            sStableId += sFacetId;
          }
        }

        if (vElement && vElement["$Type"] && vElement["$Type"].indexOf("com.sap.vocabularies.UI.v1.DataField") > -1) {
          sStableId += getStableIdPartFromDataField(vElement);
        }
      }
    }

    sStableId = prepareId(sStableId);
    return sStableId;
  };

  _exports.generate = generate;

  var getStableIdPartFromSemanticObjectAndAction = function (oDataField) {
    var sIdPart = "";

    if (typeof oDataField.SemanticObject == "string") {
      sIdPart += oDataField.SemanticObject;
    } else if (oDataField.SemanticObject.$Path) {
      sIdPart += oDataField.SemanticObject.$Path;
    }

    if (typeof oDataField.Action == "string") {
      sIdPart += "::".concat(oDataField.Action);
    } else if (oDataField.Action && oDataField.Action.$Path) {
      sIdPart += "::".concat(oDataField.Action.$Path);
    }

    if (oDataField["RequiresContext"] && oDataField["RequiresContext"] == true) {
      sIdPart += "::RequiresContext";
    }

    return sIdPart;
  };

  _exports.getStableIdPartFromSemanticObjectAndAction = getStableIdPartFromSemanticObjectAndAction;

  var getStableIdPartFromDataField = function (oDataField) {
    var mParameter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var sIdPart = "";

    if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
      sIdPart = "DataFieldForAction::";
      sIdPart += oDataField.Action;
      return prepareId(sIdPart);
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
      sIdPart = "DataFieldForIntentBasedNavigation::";
      sIdPart += getStableIdPartFromSemanticObjectAndAction(oDataField);
      return sIdPart;
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      sIdPart = "DataFieldForAnnotation::";
      sIdPart += prepareId(oDataField.Target.$AnnotationPath || oDataField.Target.value);
      return sIdPart;
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction") {
      sIdPart = "DataFieldWithAction::";

      if (oDataField.Value) {
        sIdPart += "".concat(getStableIdPartFromValue(oDataField.Value), "::");
      }

      sIdPart += oDataField.Action;
      return prepareId(sIdPart);
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
      sIdPart = "DataField::";
      sIdPart += getStableIdPartFromValue(oDataField.Value);
      return prepareId(sIdPart);
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation") {
      sIdPart = "DataFieldWithIntentBasedNavigation::";
      sIdPart += "".concat(getStableIdPartFromValue(oDataField.Value), "::");
      sIdPart += getStableIdPartFromSemanticObjectAndAction(oDataField);
      return prepareId(sIdPart);
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") {
      sIdPart = "DataFieldWithNavigationPath::";
      sIdPart += getStableIdPartFromValue(oDataField.Value);

      if (oDataField.Target && oDataField.Target["$NavigationPropertyPath"]) {
        sIdPart += "::".concat(oDataField.Target["$NavigationPropertyPath"]);
      }

      return prepareId(sIdPart);
    } else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      sIdPart = "DataFieldWithUrl::";
      sIdPart += getStableIdPartFromValue(oDataField.Value);
      return prepareId(sIdPart);
    } else if (mParameter && mParameter.context && mParameter.context.getObject("@sapui.name")) {
      // the context is not referring to da data field but directly to a property, return the property name
      return prepareId(mParameter.context.getObject("@sapui.name").toString());
    } else {// In case of a string or unknown property
      // Log.error("Stable ID Helper: Unable to create a stable ID. Please check the annotations.");
    }

    return undefined;
  };

  _exports.getStableIdPartFromDataField = getStableIdPartFromDataField;

  var prepareId = function (sId) {
    sId = replaceSpecialChars(removeNamespaces(sId));

    if (isValid(sId)) {
      return sId;
    } else {
      // Log.error(sId + " - Stable Id could not be generated due to insufficient information.");
      throw "".concat(sId, " - Stable Id could not be generated due to insufficient information.");
    }
  };

  _exports.prepareId = prepareId;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc1ZhbGlkIiwidlZhbHVlIiwidGVzdCIsInJlcGxhY2VTcGVjaWFsQ2hhcnMiLCJzSWQiLCJpbmRleE9mIiwicmVwbGFjZSIsInNsaWNlIiwicmVtb3ZlTmFtZXNwYWNlcyIsImdldFN0YWJsZUlkUGFydEZyb21WYWx1ZSIsIm9WYWx1ZSIsIiRQYXRoIiwicGF0aCIsIiRBcHBseSIsIiRGdW5jdGlvbiIsInNQYXRoQ29uY2F0IiwiaSIsImxlbmd0aCIsImdlbmVyYXRlIiwiYVN0YWJsZUlkUGFydHMiLCJzU3RhYmxlSWQiLCJ2RWxlbWVudCIsInNGYWNldElkIiwiRmFjZXQiLCIkVHlwZSIsIklEIiwiVGFyZ2V0IiwiJEFubm90YXRpb25QYXRoIiwidmFsdWUiLCJMYWJlbCIsImdldFN0YWJsZUlkUGFydEZyb21EYXRhRmllbGQiLCJwcmVwYXJlSWQiLCJnZXRTdGFibGVJZFBhcnRGcm9tU2VtYW50aWNPYmplY3RBbmRBY3Rpb24iLCJvRGF0YUZpZWxkIiwic0lkUGFydCIsIlNlbWFudGljT2JqZWN0IiwiQWN0aW9uIiwibVBhcmFtZXRlciIsIlZhbHVlIiwiY29udGV4dCIsImdldE9iamVjdCIsInRvU3RyaW5nIiwidW5kZWZpbmVkIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJTdGFibGVJZEhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvQ29udGV4dFwiO1xuXG4vKipcbiAqIFN0YWJsZSBJZCBoZWxwZXJcbiAqL1xuXG4vKipcbiAqIENvcHkgZm9yIHRoZSBDb3JlLmlzVmFsaWQgZnVuY3Rpb24gdG8gYmUgaW5kZXBlbmRlbnQuXG4gKlxuICogQHBhcmFtIHZWYWx1ZSBTdHJpbmcgdG8gdmFsaWRhdGVcbiAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIHZhbHVlIGlzIHZhbGlkIG9yIG5vdFxuICovXG5mdW5jdGlvbiBpc1ZhbGlkKHZWYWx1ZTogc3RyaW5nKSB7XG5cdHJldHVybiAvXihbQS1aYS16X11bLUEtWmEtejAtOV8uOl0qKSQvLnRlc3QodlZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VTcGVjaWFsQ2hhcnMoc0lkOiBzdHJpbmcpIHtcblx0aWYgKHNJZC5pbmRleE9mKFwiIFwiKSA+PSAwKSB7XG5cdFx0Ly8gTG9nLmVycm9yKHNJZCArIFwiIC0gU3BhY2VzIGFyZSBub3QgYWxsb3dlZCBpbiBJRCBwYXJ0cy5cIik7XG5cdFx0dGhyb3cgYCR7c0lkfSAtIFNwYWNlcyBhcmUgbm90IGFsbG93ZWQgaW4gSUQgcGFydHMuYDtcblx0fVxuXHRzSWQgPSBzSWRcblx0XHQucmVwbGFjZSgvXlxcL3xeQHxeI3xeXFwqLywgXCJcIikgLy8gcmVtb3ZlIHNwZWNpYWwgY2hhcmFjdGVycyBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZ1xuXHRcdC5yZXBsYWNlKC9cXC8kfEAkfCMkfFxcKiQvLCBcIlwiKSAvLyByZW1vdmUgc3BlY2lhbCBjaGFyYWN0ZXJzIGZyb20gdGhlIGVuZCBvZiB0aGUgc3RyaW5nXG5cdFx0LnJlcGxhY2UoL1xcL3xAfFxcKHxcXCl8I3xcXCovZywgXCI6OlwiKTsgLy8gcmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnMgd2l0aCA6OlxuXG5cdC8vIFJlcGxhY2UgZG91YmxlIG9jY3VycmVuY2VzIG9mIHRoZSBzZXBhcmF0b3Igd2l0aCBhIHNpbmdsZSBzZXBhcmF0b3Jcblx0d2hpbGUgKHNJZC5pbmRleE9mKFwiOjo6OlwiKSA+IC0xKSB7XG5cdFx0c0lkID0gc0lkLnJlcGxhY2UoXCI6Ojo6XCIsIFwiOjpcIik7XG5cdH1cblxuXHQvLyBJZiB0aGVyZSBpcyBhIDo6IGF0IHRoZSBlbmQgb2YgdGhlIElEIHJlbW92ZSBpdFxuXHRpZiAoc0lkLnNsaWNlKC0yKSA9PSBcIjo6XCIpIHtcblx0XHRzSWQgPSBzSWQuc2xpY2UoMCwgLTIpO1xuXHR9XG5cblx0cmV0dXJuIHNJZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlcyhzSWQ6IHN0cmluZykge1xuXHRzSWQgPSBzSWQucmVwbGFjZShcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlwiLCBcIlwiKTtcblx0c0lkID0gc0lkLnJlcGxhY2UoXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLlwiLCBcIlwiKTtcblx0cmV0dXJuIHNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0U3RhYmxlSWRQYXJ0RnJvbVZhbHVlKG9WYWx1ZTogYW55KSB7XG5cdGlmICgob1ZhbHVlICYmIG9WYWx1ZS4kUGF0aCkgfHwgb1ZhbHVlLnBhdGgpIHtcblx0XHRyZXR1cm4gb1ZhbHVlLiRQYXRoIHx8IG9WYWx1ZS5wYXRoO1xuXHR9XG5cblx0aWYgKG9WYWx1ZSAmJiBvVmFsdWUuJEFwcGx5ICYmIG9WYWx1ZS4kRnVuY3Rpb24gPT09IFwib2RhdGEuY29uY2F0XCIpIHtcblx0XHRsZXQgc1BhdGhDb25jYXQgPSBcIlwiO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgb1ZhbHVlLiRBcHBseS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKG9WYWx1ZS4kQXBwbHlbaV0uJFBhdGgpIHtcblx0XHRcdFx0aWYgKHNQYXRoQ29uY2F0KSB7XG5cdFx0XHRcdFx0c1BhdGhDb25jYXQgKz0gXCI6OlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNQYXRoQ29uY2F0ICs9IG9WYWx1ZS4kQXBwbHlbaV0uJFBhdGg7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBzUGF0aENvbmNhdDtcblx0fVxuXG5cdGlmIChvVmFsdWUpIHtcblx0XHRyZXR1cm4gcmVwbGFjZVNwZWNpYWxDaGFycyhvVmFsdWUucmVwbGFjZSgvIC9nLCBcIl9cIikpO1xuXHR9XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIFN0YWJsZSBJZCBiYXNlZCBvbiB0aGUgZ2l2ZW4gcGFyYW1ldGVyc1xuICpcbiAqIHBhcmFtZXRlcnMgYXJlIGNvbWJpbmVkIGluIHRoZSBzYW1lIG9yZGVyIHRoYXQgdGhleSBhcmUgcHJvdmlkZWQgYW5kIGFyZSBzZXBhcmF0ZWQgYnkgJzo6J1xuICogc3BlY2lhbCBjaGFyYWN0ZXJzIChALCAvLCAjKSBhcmUgcmVwbGFjZWQgYnkgJzo6JyBpZiB0aGV5IGFyZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBTdGFibGUgSWQgYW5kIHJlbW92ZWQgYWxsIHRvZ2V0aGVyIGlmIHRoZSBhcmUgcGFydCBhdCB0aGUgYmVnaW5uaW5nIG9yIGVuZFxuICogRXhhbXBsZTpcbiAqIC8vIEdldCBDb25zdGFudCBTdGFibGUgSWRcbiAqIGdlbmVyYXRlKFsnU3RhYmxlJywgJ0lkJ10pIHdvdWxkIHJlc3VsdCBpbiAnU3RhYmxlOjpJZCcgYXMgdGhlIFN0YWJsZSBJZFxuICpcbiAqIC8vIEdldCBQYXJhbWVydGVyaXplZCBTdGFibGUgSWQgZnJvbSBhIENvbGxlY3Rpb24gRmFjZXRcbiAqIHZhciBvUGFyYW1ldGVyID0ge1xuICogXHRcdEZhY2V0OiB7XG4gKiBcdFx0XHQkVHlwZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db2xsZWN0aW9uRmFjZXRcIixcbiAqIFx0XHRcdExhYmVsOiBcIkdlbmVyYWwgSW5mbyBGYWNldCBMYWJlbFwiLFxuICogXHRcdFx0SUQ6ICdHZW5lcmFsSW5mb3JtYXRpb24nXG4gKiBcdFx0fVxuICogfTtcbiAqIGdlbmVyYXRlKFsnc2VjdGlvbicsIG9QYXJhbWV0ZXJdKSB3b3VsZCByZXN1bHQgaW4gJ3NlY3Rpb246OkdlbmVyYWxJbmZvcm1hdGlvbicgYXMgdGhlIFN0YWJsZSBJZFxuICpcbiAqIG9QYXJhbWV0ZXIgaXMgYW5kIG9iamVjdCBvZiBNZXRhZGF0YSBjb250ZXh0cyBhdmFpbGFibGUgd2hpbGUgdGVtcGxhdGluZyB3aGljaCB3aWxsIGJlIHVzZWQgdG8gZ2VuZXJhdGUgU3RhYmxlIElEcy5cbiAqIG9QYXJhbWV0ZXIgb2JqZWN0IGtleXMgZGVmaW5lIHRoZSB0eXBlIG9mIG1ldGFkYXRhIGNvbnRleHQuXG4gKiBGb3IgZXhhbXBsZSwgdGhlIGtleSAnRmFjZXQnaW4gdGhlIGFib3ZlIGV4YW1wbGUgdGVsbHMgdGhlIFN0YWJsZSBJZCBIZWxwZXIgdGhhdCB0aGUgY29udGV4dCBpcyBhIEZhY2V0IChjb3VsZCBiZSByZWZlcmVuY2Ugb3IgY29sbGVjdGlvbiBmYWNldClcbiAqXG4gKiBDdXJyZW50bHkgc3VwcG9ydGVkIG1ldGFkYXRhIGNvbnRleHQgaXMgQ29sbGVjdGlvbi9SZWZlcmVuY2UgZmFjZXQgaWRlbnRpZmllZCBieSAnRmFjZXQnIGtleS5cbiAqXG4gKiBAcGFyYW0gYVN0YWJsZUlkUGFydHMgQXJyYXkgb2Ygc3RyaW5ncyBhbmQgb2JqZWN0c1xuICogQHJldHVybnMgU3RhYmxlIElkIGNvbnN0cnVjdGVkIGZyb20gdGhlIHByb3ZpZGVkIHBhcmFtZXRlcnNcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlID0gZnVuY3Rpb24gKGFTdGFibGVJZFBhcnRzOiBBcnJheTxzdHJpbmcgfCBvYmplY3Q+KSB7XG5cdGxldCBzU3RhYmxlSWQgPSBcIlwiLFxuXHRcdHZFbGVtZW50OiBhbnksXG5cdFx0c0ZhY2V0SWQ7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhU3RhYmxlSWRQYXJ0cy5sZW5ndGg7IGkrKykge1xuXHRcdHZFbGVtZW50ID0gYVN0YWJsZUlkUGFydHNbaV07XG5cdFx0aWYgKCF2RWxlbWVudCkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdHNTdGFibGVJZCArPSBzU3RhYmxlSWQgIT09IFwiXCIgPyBcIjo6XCIgOiBcIlwiO1xuXHRcdGlmICh2RWxlbWVudFtcIkZhY2V0XCJdICYmIHZFbGVtZW50W1wiRmFjZXRcIl1bXCIkVHlwZVwiXSAmJiB2RWxlbWVudFtcIkZhY2V0XCJdW1wiJFR5cGVcIl0gPT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db2xsZWN0aW9uRmFjZXRcIikge1xuXHRcdFx0c1N0YWJsZUlkICs9IHZFbGVtZW50W1wiRmFjZXRcIl1bXCJJRFwiXTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiB2RWxlbWVudCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0aWYgKHZFbGVtZW50KSB7XG5cdFx0XHRcdHNTdGFibGVJZCArPSB2RWxlbWVudDtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGVvZiB2RWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gaGFuZGxlIHBhcmFtZXRlcnNcblx0XHRcdGlmICh2RWxlbWVudCAmJiB2RWxlbWVudC5GYWNldCkge1xuXHRcdFx0XHRpZiAodkVsZW1lbnQuRmFjZXQuJFR5cGUgJiYgdkVsZW1lbnQuRmFjZXQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ29sbGVjdGlvbkZhY2V0XCIpIHtcblx0XHRcdFx0XHRpZiAodkVsZW1lbnQuRmFjZXQuSUQpIHtcblx0XHRcdFx0XHRcdHNGYWNldElkID0gdkVsZW1lbnQuRmFjZXQuSUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHZFbGVtZW50LkZhY2V0LiRUeXBlICYmIHZFbGVtZW50LkZhY2V0LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlZmVyZW5jZUZhY2V0XCIpIHtcblx0XHRcdFx0XHRpZiAodkVsZW1lbnQuRmFjZXQuSUQpIHtcblx0XHRcdFx0XHRcdHNGYWNldElkID0gdkVsZW1lbnQuRmFjZXQuSUQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNGYWNldElkID0gdkVsZW1lbnQuRmFjZXQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aCB8fCB2RWxlbWVudC5GYWNldC5UYXJnZXQudmFsdWU7IC8vIENvbXBsaWFudCB3aXRoIENvbnZlcnRlcnNcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAodkVsZW1lbnQuRmFjZXQuJFR5cGUgJiYgdkVsZW1lbnQuRmFjZXQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFR5cGVcIikge1xuXHRcdFx0XHRcdGlmICh2RWxlbWVudC5GYWNldC5MYWJlbCkge1xuXHRcdFx0XHRcdFx0c0ZhY2V0SWQgPSB2RWxlbWVudC5GYWNldC5MYWJlbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNGYWNldElkKSB7XG5cdFx0XHRcdFx0c1N0YWJsZUlkICs9IHNGYWNldElkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodkVsZW1lbnQgJiYgdkVsZW1lbnRbXCIkVHlwZVwiXSAmJiB2RWxlbWVudFtcIiRUeXBlXCJdLmluZGV4T2YoXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRcIikgPiAtMSkge1xuXHRcdFx0XHRzU3RhYmxlSWQgKz0gZ2V0U3RhYmxlSWRQYXJ0RnJvbURhdGFGaWVsZCh2RWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHNTdGFibGVJZCA9IHByZXBhcmVJZChzU3RhYmxlSWQpO1xuXHRyZXR1cm4gc1N0YWJsZUlkO1xufTtcbmV4cG9ydCBjb25zdCBnZXRTdGFibGVJZFBhcnRGcm9tU2VtYW50aWNPYmplY3RBbmRBY3Rpb24gPSBmdW5jdGlvbiAob0RhdGFGaWVsZDogYW55KTogc3RyaW5nIHtcblx0bGV0IHNJZFBhcnQgPSBcIlwiO1xuXHRpZiAodHlwZW9mIG9EYXRhRmllbGQuU2VtYW50aWNPYmplY3QgPT0gXCJzdHJpbmdcIikge1xuXHRcdHNJZFBhcnQgKz0gb0RhdGFGaWVsZC5TZW1hbnRpY09iamVjdDtcblx0fSBlbHNlIGlmIChvRGF0YUZpZWxkLlNlbWFudGljT2JqZWN0LiRQYXRoKSB7XG5cdFx0c0lkUGFydCArPSBvRGF0YUZpZWxkLlNlbWFudGljT2JqZWN0LiRQYXRoO1xuXHR9XG5cdGlmICh0eXBlb2Ygb0RhdGFGaWVsZC5BY3Rpb24gPT0gXCJzdHJpbmdcIikge1xuXHRcdHNJZFBhcnQgKz0gYDo6JHtvRGF0YUZpZWxkLkFjdGlvbn1gO1xuXHR9IGVsc2UgaWYgKG9EYXRhRmllbGQuQWN0aW9uICYmIG9EYXRhRmllbGQuQWN0aW9uLiRQYXRoKSB7XG5cdFx0c0lkUGFydCArPSBgOjoke29EYXRhRmllbGQuQWN0aW9uLiRQYXRofWA7XG5cdH1cblx0aWYgKG9EYXRhRmllbGRbXCJSZXF1aXJlc0NvbnRleHRcIl0gJiYgb0RhdGFGaWVsZFtcIlJlcXVpcmVzQ29udGV4dFwiXSA9PSB0cnVlKSB7XG5cdFx0c0lkUGFydCArPSBcIjo6UmVxdWlyZXNDb250ZXh0XCI7XG5cdH1cblx0cmV0dXJuIHNJZFBhcnQ7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U3RhYmxlSWRQYXJ0RnJvbURhdGFGaWVsZCA9IGZ1bmN0aW9uIChvRGF0YUZpZWxkOiBhbnksIG1QYXJhbWV0ZXI6IHsgY29udGV4dD86IENvbnRleHQgfSA9IHt9KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0bGV0IHNJZFBhcnQgPSBcIlwiO1xuXG5cdGlmIChvRGF0YUZpZWxkLiRUeXBlICYmIG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRGb3JBY3Rpb246OlwiO1xuXHRcdHNJZFBhcnQgKz0gb0RhdGFGaWVsZC5BY3Rpb247XG5cdFx0cmV0dXJuIHByZXBhcmVJZChzSWRQYXJ0KTtcblx0fSBlbHNlIGlmIChvRGF0YUZpZWxkLiRUeXBlICYmIG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246OlwiO1xuXHRcdHNJZFBhcnQgKz0gZ2V0U3RhYmxlSWRQYXJ0RnJvbVNlbWFudGljT2JqZWN0QW5kQWN0aW9uKG9EYXRhRmllbGQpO1xuXHRcdHJldHVybiBzSWRQYXJ0O1xuXHR9IGVsc2UgaWYgKG9EYXRhRmllbGQuJFR5cGUgJiYgb0RhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBbm5vdGF0aW9uXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRGb3JBbm5vdGF0aW9uOjpcIjtcblx0XHRzSWRQYXJ0ICs9IHByZXBhcmVJZChvRGF0YUZpZWxkLlRhcmdldC4kQW5ub3RhdGlvblBhdGggfHwgb0RhdGFGaWVsZC5UYXJnZXQudmFsdWUpO1xuXHRcdHJldHVybiBzSWRQYXJ0O1xuXHR9IGVsc2UgaWYgKG9EYXRhRmllbGQuJFR5cGUgJiYgb0RhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoQWN0aW9uXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRXaXRoQWN0aW9uOjpcIjtcblx0XHRpZiAob0RhdGFGaWVsZC5WYWx1ZSkge1xuXHRcdFx0c0lkUGFydCArPSBgJHtnZXRTdGFibGVJZFBhcnRGcm9tVmFsdWUob0RhdGFGaWVsZC5WYWx1ZSl9OjpgO1xuXHRcdH1cblx0XHRzSWRQYXJ0ICs9IG9EYXRhRmllbGQuQWN0aW9uO1xuXHRcdHJldHVybiBwcmVwYXJlSWQoc0lkUGFydCk7XG5cdH0gZWxzZSBpZiAob0RhdGFGaWVsZC4kVHlwZSAmJiBvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiKSB7XG5cdFx0c0lkUGFydCA9IFwiRGF0YUZpZWxkOjpcIjtcblx0XHRzSWRQYXJ0ICs9IGdldFN0YWJsZUlkUGFydEZyb21WYWx1ZShvRGF0YUZpZWxkLlZhbHVlKTtcblx0XHRyZXR1cm4gcHJlcGFyZUlkKHNJZFBhcnQpO1xuXHR9IGVsc2UgaWYgKG9EYXRhRmllbGQuJFR5cGUgJiYgb0RhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOjpcIjtcblx0XHRzSWRQYXJ0ICs9IGAke2dldFN0YWJsZUlkUGFydEZyb21WYWx1ZShvRGF0YUZpZWxkLlZhbHVlKX06OmA7XG5cdFx0c0lkUGFydCArPSBnZXRTdGFibGVJZFBhcnRGcm9tU2VtYW50aWNPYmplY3RBbmRBY3Rpb24ob0RhdGFGaWVsZCk7XG5cdFx0cmV0dXJuIHByZXBhcmVJZChzSWRQYXJ0KTtcblx0fSBlbHNlIGlmIChvRGF0YUZpZWxkLiRUeXBlICYmIG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGg6OlwiO1xuXHRcdHNJZFBhcnQgKz0gZ2V0U3RhYmxlSWRQYXJ0RnJvbVZhbHVlKG9EYXRhRmllbGQuVmFsdWUpO1xuXHRcdGlmIChvRGF0YUZpZWxkLlRhcmdldCAmJiBvRGF0YUZpZWxkLlRhcmdldFtcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCJdKSB7XG5cdFx0XHRzSWRQYXJ0ICs9IGA6OiR7b0RhdGFGaWVsZC5UYXJnZXRbXCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiXX1gO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJlcGFyZUlkKHNJZFBhcnQpO1xuXHR9IGVsc2UgaWYgKG9EYXRhRmllbGQuJFR5cGUgJiYgb0RhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoVXJsXCIpIHtcblx0XHRzSWRQYXJ0ID0gXCJEYXRhRmllbGRXaXRoVXJsOjpcIjtcblx0XHRzSWRQYXJ0ICs9IGdldFN0YWJsZUlkUGFydEZyb21WYWx1ZShvRGF0YUZpZWxkLlZhbHVlKTtcblx0XHRyZXR1cm4gcHJlcGFyZUlkKHNJZFBhcnQpO1xuXHR9IGVsc2UgaWYgKG1QYXJhbWV0ZXIgJiYgbVBhcmFtZXRlci5jb250ZXh0ICYmIG1QYXJhbWV0ZXIuY29udGV4dC5nZXRPYmplY3QoXCJAc2FwdWkubmFtZVwiKSkge1xuXHRcdC8vIHRoZSBjb250ZXh0IGlzIG5vdCByZWZlcnJpbmcgdG8gZGEgZGF0YSBmaWVsZCBidXQgZGlyZWN0bHkgdG8gYSBwcm9wZXJ0eSwgcmV0dXJuIHRoZSBwcm9wZXJ0eSBuYW1lXG5cdFx0cmV0dXJuIHByZXBhcmVJZChtUGFyYW1ldGVyLmNvbnRleHQuZ2V0T2JqZWN0KFwiQHNhcHVpLm5hbWVcIikudG9TdHJpbmcoKSk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gSW4gY2FzZSBvZiBhIHN0cmluZyBvciB1bmtub3duIHByb3BlcnR5XG5cdFx0Ly8gTG9nLmVycm9yKFwiU3RhYmxlIElEIEhlbHBlcjogVW5hYmxlIHRvIGNyZWF0ZSBhIHN0YWJsZSBJRC4gUGxlYXNlIGNoZWNrIHRoZSBhbm5vdGF0aW9ucy5cIik7XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwcmVwYXJlSWQgPSBmdW5jdGlvbiAoc0lkOiBzdHJpbmcpIHtcblx0c0lkID0gcmVwbGFjZVNwZWNpYWxDaGFycyhyZW1vdmVOYW1lc3BhY2VzKHNJZCkpO1xuXHRpZiAoaXNWYWxpZChzSWQpKSB7XG5cdFx0cmV0dXJuIHNJZDtcblx0fSBlbHNlIHtcblx0XHQvLyBMb2cuZXJyb3Ioc0lkICsgXCIgLSBTdGFibGUgSWQgY291bGQgbm90IGJlIGdlbmVyYXRlZCBkdWUgdG8gaW5zdWZmaWNpZW50IGluZm9ybWF0aW9uLlwiKTtcblx0XHR0aHJvdyBgJHtzSWR9IC0gU3RhYmxlIElkIGNvdWxkIG5vdCBiZSBnZW5lcmF0ZWQgZHVlIHRvIGluc3VmZmljaWVudCBpbmZvcm1hdGlvbi5gO1xuXHR9XG59O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUFFQTtBQUNBO0FBQ0E7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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