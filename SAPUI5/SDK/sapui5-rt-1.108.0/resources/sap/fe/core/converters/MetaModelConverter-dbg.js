/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/common/AnnotationConverter", "../helpers/StableIdHelper"], function (AnnotationConverter, StableIdHelper) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var VOCABULARY_ALIAS = {
    "Org.OData.Capabilities.V1": "Capabilities",
    "Org.OData.Core.V1": "Core",
    "Org.OData.Measures.V1": "Measures",
    "com.sap.vocabularies.Common.v1": "Common",
    "com.sap.vocabularies.UI.v1": "UI",
    "com.sap.vocabularies.Session.v1": "Session",
    "com.sap.vocabularies.Analytics.v1": "Analytics",
    "com.sap.vocabularies.PersonalData.v1": "PersonalData",
    "com.sap.vocabularies.Communication.v1": "Communication"
  };
  var DefaultEnvironmentCapabilities = {
    Chart: true,
    MicroChart: true,
    UShell: true,
    IntentBasedNavigation: true,
    AppState: true
  };
  _exports.DefaultEnvironmentCapabilities = DefaultEnvironmentCapabilities;

  function parsePropertyValue(annotationObject, propertyKey, currentTarget, annotationsLists, oCapabilities) {
    var value;
    var currentPropertyTarget = "".concat(currentTarget, "/").concat(propertyKey);
    var typeOfAnnotation = typeof annotationObject;

    if (annotationObject === null) {
      value = {
        type: "Null",
        Null: null
      };
    } else if (typeOfAnnotation === "string") {
      value = {
        type: "String",
        String: annotationObject
      };
    } else if (typeOfAnnotation === "boolean") {
      value = {
        type: "Bool",
        Bool: annotationObject
      };
    } else if (typeOfAnnotation === "number") {
      value = {
        type: "Int",
        Int: annotationObject
      };
    } else if (Array.isArray(annotationObject)) {
      value = {
        type: "Collection",
        Collection: annotationObject.map(function (subAnnotationObject, subAnnotationObjectIndex) {
          return parseAnnotationObject(subAnnotationObject, "".concat(currentPropertyTarget, "/").concat(subAnnotationObjectIndex), annotationsLists, oCapabilities);
        })
      };

      if (annotationObject.length > 0) {
        if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
          value.Collection.type = "PropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$Path")) {
          value.Collection.type = "Path";
        } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
          value.Collection.type = "NavigationPropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
          value.Collection.type = "AnnotationPath";
        } else if (annotationObject[0].hasOwnProperty("$Type")) {
          value.Collection.type = "Record";
        } else if (annotationObject[0].hasOwnProperty("$If")) {
          value.Collection.type = "If";
        } else if (annotationObject[0].hasOwnProperty("$Or")) {
          value.Collection.type = "Or";
        } else if (annotationObject[0].hasOwnProperty("$And")) {
          value.Collection.type = "And";
        } else if (annotationObject[0].hasOwnProperty("$Eq")) {
          value.Collection.type = "Eq";
        } else if (annotationObject[0].hasOwnProperty("$Ne")) {
          value.Collection.type = "Ne";
        } else if (annotationObject[0].hasOwnProperty("$Not")) {
          value.Collection.type = "Not";
        } else if (annotationObject[0].hasOwnProperty("$Gt")) {
          value.Collection.type = "Gt";
        } else if (annotationObject[0].hasOwnProperty("$Ge")) {
          value.Collection.type = "Ge";
        } else if (annotationObject[0].hasOwnProperty("$Lt")) {
          value.Collection.type = "Lt";
        } else if (annotationObject[0].hasOwnProperty("$Le")) {
          value.Collection.type = "Le";
        } else if (annotationObject[0].hasOwnProperty("$Apply")) {
          value.Collection.type = "Apply";
        } else if (typeof annotationObject[0] === "object") {
          // $Type is optional...
          value.Collection.type = "Record";
        } else {
          value.Collection.type = "String";
        }
      }
    } else if (annotationObject.$Path !== undefined) {
      value = {
        type: "Path",
        Path: annotationObject.$Path
      };
    } else if (annotationObject.$Decimal !== undefined) {
      value = {
        type: "Decimal",
        Decimal: parseFloat(annotationObject.$Decimal)
      };
    } else if (annotationObject.$PropertyPath !== undefined) {
      value = {
        type: "PropertyPath",
        PropertyPath: annotationObject.$PropertyPath
      };
    } else if (annotationObject.$NavigationPropertyPath !== undefined) {
      value = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: annotationObject.$NavigationPropertyPath
      };
    } else if (annotationObject.$If !== undefined) {
      value = {
        type: "If",
        If: annotationObject.$If
      };
    } else if (annotationObject.$And !== undefined) {
      value = {
        type: "And",
        And: annotationObject.$And
      };
    } else if (annotationObject.$Or !== undefined) {
      value = {
        type: "Or",
        Or: annotationObject.$Or
      };
    } else if (annotationObject.$Not !== undefined) {
      value = {
        type: "Not",
        Not: annotationObject.$Not
      };
    } else if (annotationObject.$Eq !== undefined) {
      value = {
        type: "Eq",
        Eq: annotationObject.$Eq
      };
    } else if (annotationObject.$Ne !== undefined) {
      value = {
        type: "Ne",
        Ne: annotationObject.$Ne
      };
    } else if (annotationObject.$Gt !== undefined) {
      value = {
        type: "Gt",
        Gt: annotationObject.$Gt
      };
    } else if (annotationObject.$Ge !== undefined) {
      value = {
        type: "Ge",
        Ge: annotationObject.$Ge
      };
    } else if (annotationObject.$Lt !== undefined) {
      value = {
        type: "Lt",
        Lt: annotationObject.$Lt
      };
    } else if (annotationObject.$Le !== undefined) {
      value = {
        type: "Le",
        Le: annotationObject.$Le
      };
    } else if (annotationObject.$Apply !== undefined) {
      value = {
        type: "Apply",
        Apply: annotationObject.$Apply,
        Function: annotationObject.$Function
      };
    } else if (annotationObject.$AnnotationPath !== undefined) {
      value = {
        type: "AnnotationPath",
        AnnotationPath: annotationObject.$AnnotationPath
      };
    } else if (annotationObject.$EnumMember !== undefined) {
      value = {
        type: "EnumMember",
        EnumMember: "".concat(mapNameToAlias(annotationObject.$EnumMember.split("/")[0]), "/").concat(annotationObject.$EnumMember.split("/")[1])
      };
    } else if (annotationObject.$Type) {
      value = {
        type: "Record",
        Record: parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
      };
    } else {
      value = {
        type: "Record",
        Record: parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
      };
    }

    return {
      name: propertyKey,
      value: value
    };
  }

  function mapNameToAlias(annotationName) {
    var _annotationName$split = annotationName.split("@"),
        _annotationName$split2 = _slicedToArray(_annotationName$split, 2),
        pathPart = _annotationName$split2[0],
        annoPart = _annotationName$split2[1];

    if (!annoPart) {
      annoPart = pathPart;
      pathPart = "";
    } else {
      pathPart += "@";
    }

    var lastDot = annoPart.lastIndexOf(".");
    return "".concat(pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)], ".").concat(annoPart.substr(lastDot + 1));
  }

  function parseAnnotationObject(annotationObject, currentObjectTarget, annotationsLists, oCapabilities) {
    var parsedAnnotationObject = {};
    var typeOfObject = typeof annotationObject;

    if (annotationObject === null) {
      parsedAnnotationObject = {
        type: "Null",
        Null: null
      };
    } else if (typeOfObject === "string") {
      parsedAnnotationObject = {
        type: "String",
        String: annotationObject
      };
    } else if (typeOfObject === "boolean") {
      parsedAnnotationObject = {
        type: "Bool",
        Bool: annotationObject
      };
    } else if (typeOfObject === "number") {
      parsedAnnotationObject = {
        type: "Int",
        Int: annotationObject
      };
    } else if (annotationObject.$AnnotationPath !== undefined) {
      parsedAnnotationObject = {
        type: "AnnotationPath",
        AnnotationPath: annotationObject.$AnnotationPath
      };
    } else if (annotationObject.$Path !== undefined) {
      parsedAnnotationObject = {
        type: "Path",
        Path: annotationObject.$Path
      };
    } else if (annotationObject.$Decimal !== undefined) {
      parsedAnnotationObject = {
        type: "Decimal",
        Decimal: parseFloat(annotationObject.$Decimal)
      };
    } else if (annotationObject.$PropertyPath !== undefined) {
      parsedAnnotationObject = {
        type: "PropertyPath",
        PropertyPath: annotationObject.$PropertyPath
      };
    } else if (annotationObject.$If !== undefined) {
      parsedAnnotationObject = {
        type: "If",
        If: annotationObject.$If
      };
    } else if (annotationObject.$And !== undefined) {
      parsedAnnotationObject = {
        type: "And",
        And: annotationObject.$And
      };
    } else if (annotationObject.$Or !== undefined) {
      parsedAnnotationObject = {
        type: "Or",
        Or: annotationObject.$Or
      };
    } else if (annotationObject.$Not !== undefined) {
      parsedAnnotationObject = {
        type: "Not",
        Not: annotationObject.$Not
      };
    } else if (annotationObject.$Eq !== undefined) {
      parsedAnnotationObject = {
        type: "Eq",
        Eq: annotationObject.$Eq
      };
    } else if (annotationObject.$Ne !== undefined) {
      parsedAnnotationObject = {
        type: "Ne",
        Ne: annotationObject.$Ne
      };
    } else if (annotationObject.$Gt !== undefined) {
      parsedAnnotationObject = {
        type: "Gt",
        Gt: annotationObject.$Gt
      };
    } else if (annotationObject.$Ge !== undefined) {
      parsedAnnotationObject = {
        type: "Ge",
        Ge: annotationObject.$Ge
      };
    } else if (annotationObject.$Lt !== undefined) {
      parsedAnnotationObject = {
        type: "Lt",
        Lt: annotationObject.$Lt
      };
    } else if (annotationObject.$Le !== undefined) {
      parsedAnnotationObject = {
        type: "Le",
        Le: annotationObject.$Le
      };
    } else if (annotationObject.$Apply !== undefined) {
      parsedAnnotationObject = {
        type: "Apply",
        Apply: annotationObject.$Apply,
        Function: annotationObject.$Function
      };
    } else if (annotationObject.$NavigationPropertyPath !== undefined) {
      parsedAnnotationObject = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: annotationObject.$NavigationPropertyPath
      };
    } else if (annotationObject.$EnumMember !== undefined) {
      parsedAnnotationObject = {
        type: "EnumMember",
        EnumMember: "".concat(mapNameToAlias(annotationObject.$EnumMember.split("/")[0]), "/").concat(annotationObject.$EnumMember.split("/")[1])
      };
    } else if (Array.isArray(annotationObject)) {
      var parsedAnnotationCollection = parsedAnnotationObject;
      parsedAnnotationCollection.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
        return parseAnnotationObject(subAnnotationObject, "".concat(currentObjectTarget, "/").concat(subAnnotationIndex), annotationsLists, oCapabilities);
      });

      if (annotationObject.length > 0) {
        if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
          parsedAnnotationCollection.collection.type = "PropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$Path")) {
          parsedAnnotationCollection.collection.type = "Path";
        } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
          parsedAnnotationCollection.collection.type = "NavigationPropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
          parsedAnnotationCollection.collection.type = "AnnotationPath";
        } else if (annotationObject[0].hasOwnProperty("$Type")) {
          parsedAnnotationCollection.collection.type = "Record";
        } else if (annotationObject[0].hasOwnProperty("$If")) {
          parsedAnnotationCollection.collection.type = "If";
        } else if (annotationObject[0].hasOwnProperty("$And")) {
          parsedAnnotationCollection.collection.type = "And";
        } else if (annotationObject[0].hasOwnProperty("$Or")) {
          parsedAnnotationCollection.collection.type = "Or";
        } else if (annotationObject[0].hasOwnProperty("$Eq")) {
          parsedAnnotationCollection.collection.type = "Eq";
        } else if (annotationObject[0].hasOwnProperty("$Ne")) {
          parsedAnnotationCollection.collection.type = "Ne";
        } else if (annotationObject[0].hasOwnProperty("$Not")) {
          parsedAnnotationCollection.collection.type = "Not";
        } else if (annotationObject[0].hasOwnProperty("$Gt")) {
          parsedAnnotationCollection.collection.type = "Gt";
        } else if (annotationObject[0].hasOwnProperty("$Ge")) {
          parsedAnnotationCollection.collection.type = "Ge";
        } else if (annotationObject[0].hasOwnProperty("$Lt")) {
          parsedAnnotationCollection.collection.type = "Lt";
        } else if (annotationObject[0].hasOwnProperty("$Le")) {
          parsedAnnotationCollection.collection.type = "Le";
        } else if (annotationObject[0].hasOwnProperty("$Apply")) {
          parsedAnnotationCollection.collection.type = "Apply";
        } else if (typeof annotationObject[0] === "object") {
          parsedAnnotationCollection.collection.type = "Record";
        } else {
          parsedAnnotationCollection.collection.type = "String";
        }
      }
    } else {
      if (annotationObject.$Type) {
        var typeValue = annotationObject.$Type;
        parsedAnnotationObject.type = typeValue; //`${typeAlias}.${typeTerm}`;
      }

      var propertyValues = [];
      Object.keys(annotationObject).forEach(function (propertyKey) {
        if (propertyKey !== "$Type" && propertyKey !== "$If" && propertyKey !== "$Apply" && propertyKey !== "$And" && propertyKey !== "$Or" && propertyKey !== "$Ne" && propertyKey !== "$Gt" && propertyKey !== "$Ge" && propertyKey !== "$Lt" && propertyKey !== "$Le" && propertyKey !== "$Not" && propertyKey !== "$Eq" && !propertyKey.startsWith("@")) {
          propertyValues.push(parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists, oCapabilities));
        } else if (propertyKey.startsWith("@")) {
          // Annotation of annotation
          createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentObjectTarget, annotationsLists, oCapabilities);
        }
      });
      parsedAnnotationObject.propertyValues = propertyValues;
    }

    return parsedAnnotationObject;
  }

  function getOrCreateAnnotationList(target, annotationsLists) {
    if (!annotationsLists.hasOwnProperty(target)) {
      annotationsLists[target] = {
        target: target,
        annotations: []
      };
    }

    return annotationsLists[target];
  }

  function removeChartAnnotations(annotationObject) {
    return annotationObject.filter(function (oRecord) {
      if (oRecord.Target && oRecord.Target.$AnnotationPath) {
        return oRecord.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") === -1;
      } else {
        return true;
      }
    });
  }

  function removeIBNAnnotations(annotationObject) {
    return annotationObject.filter(function (oRecord) {
      return oRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
    });
  }

  function handlePresentationVariant(annotationObject) {
    return annotationObject.filter(function (oRecord) {
      return oRecord.$AnnotationPath !== "@com.sap.vocabularies.UI.v1.Chart";
    });
  }

  function createAnnotationLists(annotationObjects, annotationTarget, annotationLists, oCapabilities) {
    if (Object.keys(annotationObjects).length === 0) {
      return;
    }

    var outAnnotationObject = getOrCreateAnnotationList(annotationTarget, annotationLists);

    if (!oCapabilities.MicroChart) {
      delete annotationObjects["@com.sap.vocabularies.UI.v1.Chart"];
    }

    var _loop = function (_annotationKey) {
      var annotationObject = annotationObjects[_annotationKey];

      switch (_annotationKey) {
        case "@com.sap.vocabularies.UI.v1.HeaderFacets":
          if (!oCapabilities.MicroChart) {
            annotationObject = removeChartAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.Identification":
          if (!oCapabilities.IntentBasedNavigation) {
            annotationObject = removeIBNAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.LineItem":
          if (!oCapabilities.IntentBasedNavigation) {
            annotationObject = removeIBNAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          if (!oCapabilities.MicroChart) {
            annotationObject = removeChartAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.FieldGroup":
          if (!oCapabilities.IntentBasedNavigation) {
            annotationObject.Data = removeIBNAnnotations(annotationObject.Data);
            annotationObjects[_annotationKey] = annotationObject;
          }

          if (!oCapabilities.MicroChart) {
            annotationObject.Data = removeChartAnnotations(annotationObject.Data);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.PresentationVariant":
          if (!oCapabilities.Chart && annotationObject.Visualizations) {
            annotationObject.Visualizations = handlePresentationVariant(annotationObject.Visualizations);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        default:
          break;
      }

      var currentOutAnnotationObject = outAnnotationObject; // Check for annotation of annotation

      var annotationOfAnnotationSplit = _annotationKey.split("@");

      if (annotationOfAnnotationSplit.length > 2) {
        currentOutAnnotationObject = getOrCreateAnnotationList("".concat(annotationTarget, "@").concat(annotationOfAnnotationSplit[1]), annotationLists);
        _annotationKey = annotationOfAnnotationSplit[2];
      } else {
        _annotationKey = annotationOfAnnotationSplit[1];
      }

      var annotationQualifierSplit = _annotationKey.split("#");

      var qualifier = annotationQualifierSplit[1];
      _annotationKey = annotationQualifierSplit[0];
      var parsedAnnotationObject = {
        term: "".concat(_annotationKey),
        qualifier: qualifier
      };
      var currentAnnotationTarget = "".concat(annotationTarget, "@").concat(parsedAnnotationObject.term);

      if (qualifier) {
        currentAnnotationTarget += "#".concat(qualifier);
      }

      var isCollection = false;
      var typeofAnnotation = typeof annotationObject;

      if (annotationObject === null) {
        parsedAnnotationObject.value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeofAnnotation === "string") {
        parsedAnnotationObject.value = {
          type: "String",
          String: annotationObject
        };
      } else if (typeofAnnotation === "boolean") {
        parsedAnnotationObject.value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeofAnnotation === "number") {
        parsedAnnotationObject.value = {
          type: "Int",
          Int: annotationObject
        };
      } else if (annotationObject.$If !== undefined) {
        parsedAnnotationObject.value = {
          type: "If",
          If: annotationObject.$If
        };
      } else if (annotationObject.$And !== undefined) {
        parsedAnnotationObject.value = {
          type: "And",
          And: annotationObject.$And
        };
      } else if (annotationObject.$Or !== undefined) {
        parsedAnnotationObject.value = {
          type: "Or",
          Or: annotationObject.$Or
        };
      } else if (annotationObject.$Not !== undefined) {
        parsedAnnotationObject.value = {
          type: "Not",
          Not: annotationObject.$Not
        };
      } else if (annotationObject.$Eq !== undefined) {
        parsedAnnotationObject.value = {
          type: "Eq",
          Eq: annotationObject.$Eq
        };
      } else if (annotationObject.$Ne !== undefined) {
        parsedAnnotationObject.value = {
          type: "Ne",
          Ne: annotationObject.$Ne
        };
      } else if (annotationObject.$Gt !== undefined) {
        parsedAnnotationObject.value = {
          type: "Gt",
          Gt: annotationObject.$Gt
        };
      } else if (annotationObject.$Ge !== undefined) {
        parsedAnnotationObject.value = {
          type: "Ge",
          Ge: annotationObject.$Ge
        };
      } else if (annotationObject.$Lt !== undefined) {
        parsedAnnotationObject.value = {
          type: "Lt",
          Lt: annotationObject.$Lt
        };
      } else if (annotationObject.$Le !== undefined) {
        parsedAnnotationObject.value = {
          type: "Le",
          Le: annotationObject.$Le
        };
      } else if (annotationObject.$Apply !== undefined) {
        parsedAnnotationObject.value = {
          type: "Apply",
          Apply: annotationObject.$Apply,
          Function: annotationObject.$Function
        };
      } else if (annotationObject.$Path !== undefined) {
        parsedAnnotationObject.value = {
          type: "Path",
          Path: annotationObject.$Path
        };
      } else if (annotationObject.$AnnotationPath !== undefined) {
        parsedAnnotationObject.value = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$Decimal !== undefined) {
        parsedAnnotationObject.value = {
          type: "Decimal",
          Decimal: parseFloat(annotationObject.$Decimal)
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        parsedAnnotationObject.value = {
          type: "EnumMember",
          EnumMember: "".concat(mapNameToAlias(annotationObject.$EnumMember.split("/")[0]), "/").concat(annotationObject.$EnumMember.split("/")[1])
        };
      } else if (Array.isArray(annotationObject)) {
        isCollection = true;
        parsedAnnotationObject.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
          return parseAnnotationObject(subAnnotationObject, "".concat(currentAnnotationTarget, "/").concat(subAnnotationIndex), annotationLists, oCapabilities);
        });

        if (annotationObject.length > 0) {
          if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
            parsedAnnotationObject.collection.type = "PropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$Path")) {
            parsedAnnotationObject.collection.type = "Path";
          } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
            parsedAnnotationObject.collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
            parsedAnnotationObject.collection.type = "AnnotationPath";
          } else if (annotationObject[0].hasOwnProperty("$Type")) {
            parsedAnnotationObject.collection.type = "Record";
          } else if (annotationObject[0].hasOwnProperty("$If")) {
            parsedAnnotationObject.collection.type = "If";
          } else if (annotationObject[0].hasOwnProperty("$Or")) {
            parsedAnnotationObject.collection.type = "Or";
          } else if (annotationObject[0].hasOwnProperty("$Eq")) {
            parsedAnnotationObject.collection.type = "Eq";
          } else if (annotationObject[0].hasOwnProperty("$Ne")) {
            parsedAnnotationObject.collection.type = "Ne";
          } else if (annotationObject[0].hasOwnProperty("$Not")) {
            parsedAnnotationObject.collection.type = "Not";
          } else if (annotationObject[0].hasOwnProperty("$Gt")) {
            parsedAnnotationObject.collection.type = "Gt";
          } else if (annotationObject[0].hasOwnProperty("$Ge")) {
            parsedAnnotationObject.collection.type = "Ge";
          } else if (annotationObject[0].hasOwnProperty("$Lt")) {
            parsedAnnotationObject.collection.type = "Lt";
          } else if (annotationObject[0].hasOwnProperty("$Le")) {
            parsedAnnotationObject.collection.type = "Le";
          } else if (annotationObject[0].hasOwnProperty("$And")) {
            parsedAnnotationObject.collection.type = "And";
          } else if (annotationObject[0].hasOwnProperty("$Apply")) {
            parsedAnnotationObject.collection.type = "Apply";
          } else if (typeof annotationObject[0] === "object") {
            parsedAnnotationObject.collection.type = "Record";
          } else {
            parsedAnnotationObject.collection.type = "String";
          }
        }
      } else {
        var record = {
          propertyValues: []
        };

        if (annotationObject.$Type) {
          var typeValue = annotationObject.$Type;
          record.type = "".concat(typeValue);
        }

        var propertyValues = [];

        for (var propertyKey in annotationObject) {
          if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
            propertyValues.push(parsePropertyValue(annotationObject[propertyKey], propertyKey, currentAnnotationTarget, annotationLists, oCapabilities));
          } else if (propertyKey.startsWith("@")) {
            // Annotation of record
            createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentAnnotationTarget, annotationLists, oCapabilities);
          }
        }

        record.propertyValues = propertyValues;
        parsedAnnotationObject.record = record;
      }

      parsedAnnotationObject.isCollection = isCollection;
      currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
      annotationKey = _annotationKey;
    };

    for (var annotationKey in annotationObjects) {
      _loop(annotationKey);
    }
  }

  function prepareProperty(propertyDefinition, entityTypeObject, propertyName) {
    var propertyObject = {
      _type: "Property",
      name: propertyName,
      fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName),
      type: propertyDefinition.$Type,
      maxLength: propertyDefinition.$MaxLength,
      precision: propertyDefinition.$Precision,
      scale: propertyDefinition.$Scale,
      nullable: propertyDefinition.$Nullable
    };
    return propertyObject;
  }

  function prepareNavigationProperty(navPropertyDefinition, entityTypeObject, navPropertyName) {
    var referentialConstraint = [];

    if (navPropertyDefinition.$ReferentialConstraint) {
      referentialConstraint = Object.keys(navPropertyDefinition.$ReferentialConstraint).map(function (sourcePropertyName) {
        return {
          sourceTypeName: entityTypeObject.name,
          sourceProperty: sourcePropertyName,
          targetTypeName: navPropertyDefinition.$Type,
          targetProperty: navPropertyDefinition.$ReferentialConstraint[sourcePropertyName]
        };
      });
    }

    var navigationProperty = {
      _type: "NavigationProperty",
      name: navPropertyName,
      fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName),
      partner: navPropertyDefinition.$Partner,
      isCollection: navPropertyDefinition.$isCollection ? navPropertyDefinition.$isCollection : false,
      containsTarget: navPropertyDefinition.$ContainsTarget,
      targetTypeName: navPropertyDefinition.$Type,
      referentialConstraint: referentialConstraint
    };
    return navigationProperty;
  }

  function prepareEntitySet(entitySetDefinition, entitySetName, entityContainerName) {
    var entitySetObject = {
      _type: "EntitySet",
      name: entitySetName,
      navigationPropertyBinding: {},
      entityTypeName: entitySetDefinition.$Type,
      fullyQualifiedName: "".concat(entityContainerName, "/").concat(entitySetName)
    };
    return entitySetObject;
  }

  function prepareSingleton(singletonDefinition, singletonName, entityContainerName) {
    return {
      _type: "Singleton",
      name: singletonName,
      navigationPropertyBinding: {},
      entityTypeName: singletonDefinition.$Type,
      fullyQualifiedName: "".concat(entityContainerName, "/").concat(singletonName),
      nullable: true
    };
  }

  function prepareTypeDefinition(typeDefinition, typeName, namespace) {
    var typeObject = {
      _type: "TypeDefinition",
      name: typeName.replace("".concat(namespace, "."), ""),
      fullyQualifiedName: typeName,
      underlyingType: typeDefinition.$UnderlyingType
    };
    return typeObject;
  }

  function prepareComplexType(complexTypeDefinition, complexTypeName, namespace) {
    var complexTypeObject = {
      _type: "ComplexType",
      name: complexTypeName.replace("".concat(namespace, "."), ""),
      fullyQualifiedName: complexTypeName,
      properties: [],
      navigationProperties: []
    };
    var complexTypeProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return complexTypeDefinition[propertyNameOrNot].$kind === "Property";
      }
    }).sort(function (a, b) {
      return a > b ? 1 : -1;
    }).map(function (propertyName) {
      return prepareProperty(complexTypeDefinition[propertyName], complexTypeObject, propertyName);
    });
    complexTypeObject.properties = complexTypeProperties;
    var complexTypeNavigationProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return complexTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
      }
    }).sort(function (a, b) {
      return a > b ? 1 : -1;
    }).map(function (navPropertyName) {
      return prepareNavigationProperty(complexTypeDefinition[navPropertyName], complexTypeObject, navPropertyName);
    });
    complexTypeObject.navigationProperties = complexTypeNavigationProperties;
    return complexTypeObject;
  }

  function prepareEntityKeys(entityTypeDefinition, oMetaModelData) {
    if (!entityTypeDefinition.$Key && entityTypeDefinition.$BaseType) {
      return prepareEntityKeys(oMetaModelData["".concat(entityTypeDefinition.$BaseType)], oMetaModelData);
    }

    return entityTypeDefinition.$Key || []; //handling of entity types without key as well as basetype
  }

  function prepareEntityType(entityTypeDefinition, entityTypeName, namespace, metaModelData) {
    var entityKeys = prepareEntityKeys(entityTypeDefinition, metaModelData);
    var entityTypeObject = {
      _type: "EntityType",
      name: entityTypeName.replace("".concat(namespace, "."), ""),
      fullyQualifiedName: entityTypeName,
      keys: [],
      entityProperties: [],
      navigationProperties: [],
      actions: {}
    };
    var entityProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
      }
    }).map(function (propertyName) {
      return prepareProperty(entityTypeDefinition[propertyName], entityTypeObject, propertyName);
    });
    var navigationProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
      }
    }).map(function (navPropertyName) {
      return prepareNavigationProperty(entityTypeDefinition[navPropertyName], entityTypeObject, navPropertyName);
    });
    entityTypeObject.keys = entityKeys.map(function (entityKey) {
      return entityProperties.find(function (property) {
        return property.name === entityKey;
      });
    }).filter(function (property) {
      return property !== undefined;
    });
    entityTypeObject.entityProperties = entityProperties;
    entityTypeObject.navigationProperties = navigationProperties;
    return entityTypeObject;
  }

  function prepareAction(actionName, actionRawData, namespace, entityContainerName) {
    var actionEntityType = "";
    var actionFQN = "".concat(actionName);
    var actionShortName = actionName.substr(namespace.length + 1);

    if (actionRawData.$IsBound) {
      var bindingParameter = actionRawData.$Parameter[0];
      actionEntityType = bindingParameter.$Type;

      if (bindingParameter.$isCollection === true) {
        actionFQN = "".concat(actionName, "(Collection(").concat(actionEntityType, "))");
      } else {
        actionFQN = "".concat(actionName, "(").concat(actionEntityType, ")");
      }
    } else {
      actionFQN = "".concat(entityContainerName, "/").concat(actionShortName);
    }

    var parameters = actionRawData.$Parameter || [];
    return {
      _type: "Action",
      name: actionShortName,
      fullyQualifiedName: actionFQN,
      isBound: actionRawData.$IsBound,
      isFunction: false,
      sourceType: actionEntityType,
      returnType: actionRawData.$ReturnType ? actionRawData.$ReturnType.$Type : "",
      parameters: parameters.map(function (param) {
        var _param$$isCollection;

        return {
          _type: "ActionParameter",
          fullyQualifiedName: "".concat(actionFQN, "/").concat(param.$Name),
          isCollection: (_param$$isCollection = param.$isCollection) !== null && _param$$isCollection !== void 0 ? _param$$isCollection : false,
          name: param.$Name,
          type: param.$Type
        };
      })
    };
  }

  function prepareEntityTypes(oMetaModel) {
    var oCapabilities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultEnvironmentCapabilities;
    var oMetaModelData = oMetaModel.getObject("/$");
    var annotationLists = {};
    var entityTypes = [];
    var entitySets = [];
    var singletons = [];
    var complexTypes = [];
    var typeDefinitions = [];
    var entityContainerName = oMetaModelData.$EntityContainer;
    var namespace = "";
    var schemaKeys = Object.keys(oMetaModelData).filter(function (metamodelKey) {
      return oMetaModelData[metamodelKey].$kind === "Schema";
    });

    if (schemaKeys && schemaKeys.length > 0) {
      namespace = schemaKeys[0].substr(0, schemaKeys[0].length - 1);
    } else if (entityTypes && entityTypes.length) {
      namespace = entityTypes[0].fullyQualifiedName.replace(entityTypes[0].name, "");
      namespace = namespace.substr(0, namespace.length - 1);
    }

    Object.keys(oMetaModelData).forEach(function (sObjectName) {
      if (sObjectName !== "$kind") {
        switch (oMetaModelData[sObjectName].$kind) {
          case "EntityType":
            var entityType = prepareEntityType(oMetaModelData[sObjectName], sObjectName, namespace, oMetaModelData); // Check if there are filter facets defined for the entityType and if yes, check if all of them have an ID
            // The ID is optional, but it is internally taken for grouping filter fields and if it's not present
            // a fallback ID needs to be generated here.

            if (oMetaModelData.$Annotations[entityType.fullyQualifiedName] && oMetaModelData.$Annotations[entityType.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.FilterFacets"]) {
              oMetaModelData.$Annotations[entityType.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.FilterFacets"].forEach(function (filterFacetAnnotation) {
                filterFacetAnnotation.ID = filterFacetAnnotation.ID || generate([{
                  Facet: filterFacetAnnotation
                }]);
              });
            }

            entityType.entityProperties.forEach(function (entityProperty) {
              if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]) {
                oMetaModelData.$Annotations[entityProperty.fullyQualifiedName] = {};
              }

              if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"]) {
                oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"] = {
                  $Type: "com.sap.vocabularies.UI.v1.DataField",
                  Value: {
                    $Path: entityProperty.name
                  }
                };
              }
            });
            entityTypes.push(entityType);
            break;

          case "ComplexType":
            var complexType = prepareComplexType(oMetaModelData[sObjectName], sObjectName, namespace);
            complexTypes.push(complexType);
            break;

          case "TypeDefinition":
            var typeDefinition = prepareTypeDefinition(oMetaModelData[sObjectName], sObjectName, namespace);
            typeDefinitions.push(typeDefinition);
            break;
        }
      }
    });
    var oEntityContainer = oMetaModelData[entityContainerName];
    Object.keys(oEntityContainer).forEach(function (sObjectName) {
      if (sObjectName !== "$kind") {
        switch (oEntityContainer[sObjectName].$kind) {
          case "EntitySet":
            var entitySet = prepareEntitySet(oEntityContainer[sObjectName], sObjectName, entityContainerName);
            entitySets.push(entitySet);
            break;

          case "Singleton":
            var singleton = prepareSingleton(oEntityContainer[sObjectName], sObjectName, entityContainerName);
            singletons.push(singleton);
            break;
        }
      }
    });
    var entityContainer = {
      _type: "EntityContainer",
      name: "",
      fullyQualifiedName: ""
    };

    if (entityContainerName) {
      entityContainer = {
        _type: "EntityContainer",
        name: entityContainerName.replace("".concat(namespace, "."), ""),
        fullyQualifiedName: entityContainerName
      };
    }

    entitySets.forEach(function (entitySet) {
      var navPropertyBindings = oEntityContainer[entitySet.name].$NavigationPropertyBinding;

      if (navPropertyBindings) {
        Object.keys(navPropertyBindings).forEach(function (navPropName) {
          var targetEntitySet = entitySets.find(function (entitySetName) {
            return entitySetName.name === navPropertyBindings[navPropName];
          });

          if (targetEntitySet) {
            entitySet.navigationPropertyBinding[navPropName] = targetEntitySet;
          }
        });
      }
    });
    var actions = Object.keys(oMetaModelData).filter(function (key) {
      return Array.isArray(oMetaModelData[key]) && oMetaModelData[key].length > 0 && oMetaModelData[key][0].$kind === "Action";
    }).reduce(function (outActions, actionName) {
      var innerActions = oMetaModelData[actionName];
      innerActions.forEach(function (action) {
        outActions.push(prepareAction(actionName, action, namespace, entityContainerName));
      });
      return outActions;
    }, []);

    for (var target in oMetaModelData.$Annotations) {
      createAnnotationLists(oMetaModelData.$Annotations[target], target, annotationLists, oCapabilities);
    } // Sort by target length


    var outAnnotationLists = Object.keys(annotationLists).sort(function (a, b) {
      return a.length >= b.length ? 1 : -1;
    }).map(function (sAnnotationName) {
      return annotationLists[sAnnotationName];
    });
    var references = [];
    return {
      identification: "metamodelResult",
      version: "4.0",
      schema: {
        entityContainer: entityContainer,
        entitySets: entitySets,
        entityTypes: entityTypes,
        complexTypes: complexTypes,
        typeDefinitions: typeDefinitions,
        singletons: singletons,
        associations: [],
        associationSets: [],
        actions: actions,
        namespace: namespace,
        annotations: {
          "metamodelResult": outAnnotationLists
        }
      },
      references: references
    };
  }

  _exports.prepareEntityTypes = prepareEntityTypes;
  var mMetaModelMap = {};
  /**
   * Convert the ODataMetaModel into another format that allow for easy manipulation of the annotations.
   *
   * @param oMetaModel The ODataMetaModel
   * @param oCapabilities The current capabilities
   * @returns An object containing object-like annotations
   */

  function convertTypes(oMetaModel, oCapabilities) {
    var sMetaModelId = oMetaModel.id;

    if (!mMetaModelMap.hasOwnProperty(sMetaModelId)) {
      var parsedOutput = prepareEntityTypes(oMetaModel, oCapabilities);

      try {
        mMetaModelMap[sMetaModelId] = AnnotationConverter.convert(parsedOutput);
      } catch (oError) {
        throw new Error(oError);
      }
    }

    return mMetaModelMap[sMetaModelId];
  }

  _exports.convertTypes = convertTypes;

  function getConvertedTypes(oContext) {
    var oMetaModel = oContext.getModel();

    if (!oMetaModel.isA("sap.ui.model.odata.v4.ODataMetaModel")) {
      throw new Error("This should only be called on a ODataMetaModel");
    }

    return convertTypes(oMetaModel);
  }

  _exports.getConvertedTypes = getConvertedTypes;

  function deleteModelCacheData(oMetaModel) {
    delete mMetaModelMap[oMetaModel.id];
  }

  _exports.deleteModelCacheData = deleteModelCacheData;

  function convertMetaModelContext(oMetaModelContext) {
    var bIncludeVisitedObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var oConvertedMetadata = convertTypes(oMetaModelContext.getModel());
    var sPath = oMetaModelContext.getPath();
    var aPathSplit = sPath.split("/");
    var firstPart = aPathSplit[1];
    var beginIndex = 2;

    if (oConvertedMetadata.entityContainer.fullyQualifiedName === firstPart) {
      firstPart = aPathSplit[2];
      beginIndex++;
    }

    var targetEntitySet = oConvertedMetadata.entitySets.find(function (entitySet) {
      return entitySet.name === firstPart;
    });

    if (!targetEntitySet) {
      targetEntitySet = oConvertedMetadata.singletons.find(function (singleton) {
        return singleton.name === firstPart;
      });
    }

    var relativePath = aPathSplit.slice(beginIndex).join("/");
    var localObjects = [targetEntitySet];

    while (relativePath && relativePath.length > 0 && relativePath.startsWith("$NavigationPropertyBinding")) {
      var _sNavPropToCheck;

      var relativeSplit = relativePath.split("/");
      var idx = 0;
      var currentEntitySet = void 0,
          sNavPropToCheck = void 0;
      relativeSplit = relativeSplit.slice(1); // Removing "$NavigationPropertyBinding"

      while (!currentEntitySet && relativeSplit.length > idx) {
        if (relativeSplit[idx] !== "$NavigationPropertyBinding") {
          // Finding the correct entitySet for the navigaiton property binding example: "Set/_SalesOrder"
          sNavPropToCheck = relativeSplit.slice(0, idx + 1).join("/").replace("/$NavigationPropertyBinding", "");
          currentEntitySet = targetEntitySet && targetEntitySet.navigationPropertyBinding[sNavPropToCheck];
        }

        idx++;
      }

      if (!currentEntitySet) {
        // Fall back to Single nav prop if entitySet is not found.
        sNavPropToCheck = relativeSplit[0];
      }

      var aNavProps = ((_sNavPropToCheck = sNavPropToCheck) === null || _sNavPropToCheck === void 0 ? void 0 : _sNavPropToCheck.split("/")) || [];
      var targetEntityType = targetEntitySet && targetEntitySet.entityType;

      var _iterator = _createForOfIteratorHelper(aNavProps),
          _step;

      try {
        var _loop2 = function () {
          var sNavProp = _step.value;
          // Pushing all nav props to the visited objects. example: "Set", "_SalesOrder" for "Set/_SalesOrder"(in NavigationPropertyBinding)
          var targetNavProp = targetEntityType && targetEntityType.navigationProperties.find(function (navProp) {
            return navProp.name === sNavProp;
          });

          if (targetNavProp) {
            localObjects.push(targetNavProp);
            targetEntityType = targetNavProp.targetType;
          } else {
            return "break";
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _ret = _loop2();

          if (_ret === "break") break;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      targetEntitySet = targetEntitySet && currentEntitySet || targetEntitySet && targetEntitySet.navigationPropertyBinding[relativeSplit[0]];

      if (targetEntitySet) {
        // Pushing the target entitySet to visited objects
        localObjects.push(targetEntitySet);
      } // Re-calculating the relative path
      // As each navigation name is enclosed between '$NavigationPropertyBinding' and '$' (to be able to access the entityset easily in the metamodel)
      // we need to remove the closing '$' to be able to switch to the next navigation


      relativeSplit = relativeSplit.slice(aNavProps.length || 1);

      if (relativeSplit.length && relativeSplit[0] === "$") {
        relativeSplit.shift();
      }

      relativePath = relativeSplit.join("/");
    }

    if (relativePath.startsWith("$Type")) {
      // As $Type@ is allowed as well
      if (relativePath.startsWith("$Type@")) {
        relativePath = relativePath.replace("$Type", "");
      } else {
        // We're anyway going to look on the entityType...
        relativePath = aPathSplit.slice(3).join("/");
      }
    }

    if (targetEntitySet && relativePath.length) {
      var oTarget = targetEntitySet.entityType.resolvePath(relativePath, bIncludeVisitedObjects);

      if (oTarget) {
        if (bIncludeVisitedObjects) {
          oTarget.visitedObjects = localObjects.concat(oTarget.visitedObjects);
        }
      } else if (targetEntitySet.entityType && targetEntitySet.entityType.actions) {
        // if target is an action or an action parameter
        var actions = targetEntitySet.entityType && targetEntitySet.entityType.actions;

        var _relativeSplit = relativePath.split("/");

        if (actions[_relativeSplit[0]]) {
          var action = actions[_relativeSplit[0]];

          if (_relativeSplit[1] && action.parameters) {
            var parameterName = _relativeSplit[1];
            return action.parameters.find(function (parameter) {
              return parameter.fullyQualifiedName.endsWith("/".concat(parameterName));
            });
          } else if (relativePath.length === 1) {
            return action;
          }
        }
      }

      return oTarget;
    } else {
      if (bIncludeVisitedObjects) {
        return {
          target: targetEntitySet,
          visitedObjects: localObjects
        };
      }

      return targetEntitySet;
    }
  }

  _exports.convertMetaModelContext = convertMetaModelContext;

  function getInvolvedDataModelObjects(oMetaModelContext, oEntitySetMetaModelContext) {
    var oConvertedMetadata = convertTypes(oMetaModelContext.getModel());
    var metaModelContext = convertMetaModelContext(oMetaModelContext, true);
    var targetEntitySetLocation;

    if (oEntitySetMetaModelContext && oEntitySetMetaModelContext.getPath() !== "/") {
      targetEntitySetLocation = getInvolvedDataModelObjects(oEntitySetMetaModelContext);
    }

    return getInvolvedDataModelObjectFromPath(metaModelContext, oConvertedMetadata, targetEntitySetLocation);
  }

  _exports.getInvolvedDataModelObjects = getInvolvedDataModelObjects;

  function getInvolvedDataModelObjectFromPath(metaModelContext, convertedTypes, targetEntitySetLocation, onlyServiceObjects) {
    var _outDataModelPath$tar;

    var dataModelObjects = metaModelContext.visitedObjects.filter(function (visitedObject) {
      return visitedObject && visitedObject.hasOwnProperty("_type") && visitedObject._type !== "EntityType" && visitedObject._type !== "EntityContainer";
    });

    if (metaModelContext.target && metaModelContext.target.hasOwnProperty("_type") && metaModelContext.target._type !== "EntityType" && dataModelObjects[dataModelObjects.length - 1] !== metaModelContext.target && !onlyServiceObjects) {
      dataModelObjects.push(metaModelContext.target);
    }

    var navigationProperties = [];
    var rootEntitySet = dataModelObjects[0];
    var currentEntitySet = rootEntitySet;
    var currentEntityType = rootEntitySet.entityType;
    var currentObject;
    var navigatedPath = [];

    for (var i = 1; i < dataModelObjects.length; i++) {
      currentObject = dataModelObjects[i];

      if (currentObject._type === "NavigationProperty") {
        var _currentEntitySet;

        navigatedPath.push(currentObject.name);
        navigationProperties.push(currentObject);
        currentEntityType = currentObject.targetType;
        var boundEntitySet = (_currentEntitySet = currentEntitySet) === null || _currentEntitySet === void 0 ? void 0 : _currentEntitySet.navigationPropertyBinding[navigatedPath.join("/")];

        if (boundEntitySet) {
          currentEntitySet = boundEntitySet;
          navigatedPath = [];
        }
      }

      if (currentObject._type === "EntitySet" || currentObject._type === "Singleton") {
        currentEntitySet = currentObject;
        currentEntityType = currentEntitySet.entityType;
      }
    }

    if (navigatedPath.length > 0) {
      // Path without NavigationPropertyBinding --> no target entity set
      currentEntitySet = undefined;
    }

    if (targetEntitySetLocation && targetEntitySetLocation.startingEntitySet !== rootEntitySet) {
      // In case the entityset is not starting from the same location it may mean that we are doing too much work earlier for some reason
      // As such we need to redefine the context source for the targetEntitySetLocation
      var startingIndex = dataModelObjects.indexOf(targetEntitySetLocation.startingEntitySet);

      if (startingIndex !== -1) {
        // If it's not found I don't know what we can do (probably nothing)
        var requiredDataModelObjects = dataModelObjects.slice(0, startingIndex);
        targetEntitySetLocation.startingEntitySet = rootEntitySet;
        targetEntitySetLocation.navigationProperties = requiredDataModelObjects.filter(function (object) {
          return object._type === "NavigationProperty";
        }).concat(targetEntitySetLocation.navigationProperties);
      }
    }

    var outDataModelPath = {
      startingEntitySet: rootEntitySet,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: metaModelContext.target,
      navigationProperties: navigationProperties,
      contextLocation: targetEntitySetLocation,
      convertedTypes: convertedTypes
    };

    if (!((_outDataModelPath$tar = outDataModelPath.targetObject) !== null && _outDataModelPath$tar !== void 0 && _outDataModelPath$tar.hasOwnProperty("_type")) && onlyServiceObjects) {
      outDataModelPath.targetObject = currentObject;
    }

    if (!outDataModelPath.contextLocation) {
      outDataModelPath.contextLocation = outDataModelPath;
    }

    return outDataModelPath;
  }

  _exports.getInvolvedDataModelObjectFromPath = getInvolvedDataModelObjectFromPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJWT0NBQlVMQVJZX0FMSUFTIiwiRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwiQ2hhcnQiLCJNaWNyb0NoYXJ0IiwiVVNoZWxsIiwiSW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiQXBwU3RhdGUiLCJwYXJzZVByb3BlcnR5VmFsdWUiLCJhbm5vdGF0aW9uT2JqZWN0IiwicHJvcGVydHlLZXkiLCJjdXJyZW50VGFyZ2V0IiwiYW5ub3RhdGlvbnNMaXN0cyIsIm9DYXBhYmlsaXRpZXMiLCJ2YWx1ZSIsImN1cnJlbnRQcm9wZXJ0eVRhcmdldCIsInR5cGVPZkFubm90YXRpb24iLCJ0eXBlIiwiTnVsbCIsIlN0cmluZyIsIkJvb2wiLCJJbnQiLCJBcnJheSIsImlzQXJyYXkiLCJDb2xsZWN0aW9uIiwibWFwIiwic3ViQW5ub3RhdGlvbk9iamVjdCIsInN1YkFubm90YXRpb25PYmplY3RJbmRleCIsInBhcnNlQW5ub3RhdGlvbk9iamVjdCIsImxlbmd0aCIsImhhc093blByb3BlcnR5IiwiJFBhdGgiLCJ1bmRlZmluZWQiLCJQYXRoIiwiJERlY2ltYWwiLCJEZWNpbWFsIiwicGFyc2VGbG9hdCIsIiRQcm9wZXJ0eVBhdGgiLCJQcm9wZXJ0eVBhdGgiLCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCIkSWYiLCJJZiIsIiRBbmQiLCJBbmQiLCIkT3IiLCJPciIsIiROb3QiLCJOb3QiLCIkRXEiLCJFcSIsIiROZSIsIk5lIiwiJEd0IiwiR3QiLCIkR2UiLCJHZSIsIiRMdCIsIkx0IiwiJExlIiwiTGUiLCIkQXBwbHkiLCJBcHBseSIsIkZ1bmN0aW9uIiwiJEZ1bmN0aW9uIiwiJEFubm90YXRpb25QYXRoIiwiQW5ub3RhdGlvblBhdGgiLCIkRW51bU1lbWJlciIsIkVudW1NZW1iZXIiLCJtYXBOYW1lVG9BbGlhcyIsInNwbGl0IiwiJFR5cGUiLCJSZWNvcmQiLCJuYW1lIiwiYW5ub3RhdGlvbk5hbWUiLCJwYXRoUGFydCIsImFubm9QYXJ0IiwibGFzdERvdCIsImxhc3RJbmRleE9mIiwic3Vic3RyIiwiY3VycmVudE9iamVjdFRhcmdldCIsInBhcnNlZEFubm90YXRpb25PYmplY3QiLCJ0eXBlT2ZPYmplY3QiLCJwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJzdWJBbm5vdGF0aW9uSW5kZXgiLCJ0eXBlVmFsdWUiLCJwcm9wZXJ0eVZhbHVlcyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwic3RhcnRzV2l0aCIsInB1c2giLCJjcmVhdGVBbm5vdGF0aW9uTGlzdHMiLCJnZXRPckNyZWF0ZUFubm90YXRpb25MaXN0IiwidGFyZ2V0IiwiYW5ub3RhdGlvbnMiLCJyZW1vdmVDaGFydEFubm90YXRpb25zIiwiZmlsdGVyIiwib1JlY29yZCIsIlRhcmdldCIsImluZGV4T2YiLCJyZW1vdmVJQk5Bbm5vdGF0aW9ucyIsImhhbmRsZVByZXNlbnRhdGlvblZhcmlhbnQiLCJhbm5vdGF0aW9uT2JqZWN0cyIsImFubm90YXRpb25UYXJnZXQiLCJhbm5vdGF0aW9uTGlzdHMiLCJvdXRBbm5vdGF0aW9uT2JqZWN0IiwiYW5ub3RhdGlvbktleSIsIkRhdGEiLCJWaXN1YWxpemF0aW9ucyIsImN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0IiwiYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0IiwiYW5ub3RhdGlvblF1YWxpZmllclNwbGl0IiwicXVhbGlmaWVyIiwidGVybSIsImN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0IiwiaXNDb2xsZWN0aW9uIiwidHlwZW9mQW5ub3RhdGlvbiIsInJlY29yZCIsInByZXBhcmVQcm9wZXJ0eSIsInByb3BlcnR5RGVmaW5pdGlvbiIsImVudGl0eVR5cGVPYmplY3QiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eU9iamVjdCIsIl90eXBlIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwibWF4TGVuZ3RoIiwiJE1heExlbmd0aCIsInByZWNpc2lvbiIsIiRQcmVjaXNpb24iLCJzY2FsZSIsIiRTY2FsZSIsIm51bGxhYmxlIiwiJE51bGxhYmxlIiwicHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0eSIsIm5hdlByb3BlcnR5RGVmaW5pdGlvbiIsIm5hdlByb3BlcnR5TmFtZSIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsIiRSZWZlcmVudGlhbENvbnN0cmFpbnQiLCJzb3VyY2VQcm9wZXJ0eU5hbWUiLCJzb3VyY2VUeXBlTmFtZSIsInNvdXJjZVByb3BlcnR5IiwidGFyZ2V0VHlwZU5hbWUiLCJ0YXJnZXRQcm9wZXJ0eSIsIm5hdmlnYXRpb25Qcm9wZXJ0eSIsInBhcnRuZXIiLCIkUGFydG5lciIsIiRpc0NvbGxlY3Rpb24iLCJjb250YWluc1RhcmdldCIsIiRDb250YWluc1RhcmdldCIsInByZXBhcmVFbnRpdHlTZXQiLCJlbnRpdHlTZXREZWZpbml0aW9uIiwiZW50aXR5U2V0TmFtZSIsImVudGl0eUNvbnRhaW5lck5hbWUiLCJlbnRpdHlTZXRPYmplY3QiLCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwiZW50aXR5VHlwZU5hbWUiLCJwcmVwYXJlU2luZ2xldG9uIiwic2luZ2xldG9uRGVmaW5pdGlvbiIsInNpbmdsZXRvbk5hbWUiLCJwcmVwYXJlVHlwZURlZmluaXRpb24iLCJ0eXBlRGVmaW5pdGlvbiIsInR5cGVOYW1lIiwibmFtZXNwYWNlIiwidHlwZU9iamVjdCIsInJlcGxhY2UiLCJ1bmRlcmx5aW5nVHlwZSIsIiRVbmRlcmx5aW5nVHlwZSIsInByZXBhcmVDb21wbGV4VHlwZSIsImNvbXBsZXhUeXBlRGVmaW5pdGlvbiIsImNvbXBsZXhUeXBlTmFtZSIsImNvbXBsZXhUeXBlT2JqZWN0IiwicHJvcGVydGllcyIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwiY29tcGxleFR5cGVQcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lT3JOb3QiLCIka2luZCIsInNvcnQiLCJhIiwiYiIsImNvbXBsZXhUeXBlTmF2aWdhdGlvblByb3BlcnRpZXMiLCJwcmVwYXJlRW50aXR5S2V5cyIsImVudGl0eVR5cGVEZWZpbml0aW9uIiwib01ldGFNb2RlbERhdGEiLCIkS2V5IiwiJEJhc2VUeXBlIiwicHJlcGFyZUVudGl0eVR5cGUiLCJtZXRhTW9kZWxEYXRhIiwiZW50aXR5S2V5cyIsImVudGl0eVByb3BlcnRpZXMiLCJhY3Rpb25zIiwiZW50aXR5S2V5IiwiZmluZCIsInByb3BlcnR5IiwicHJlcGFyZUFjdGlvbiIsImFjdGlvbk5hbWUiLCJhY3Rpb25SYXdEYXRhIiwiYWN0aW9uRW50aXR5VHlwZSIsImFjdGlvbkZRTiIsImFjdGlvblNob3J0TmFtZSIsIiRJc0JvdW5kIiwiYmluZGluZ1BhcmFtZXRlciIsIiRQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJzIiwiaXNCb3VuZCIsImlzRnVuY3Rpb24iLCJzb3VyY2VUeXBlIiwicmV0dXJuVHlwZSIsIiRSZXR1cm5UeXBlIiwicGFyYW0iLCIkTmFtZSIsInByZXBhcmVFbnRpdHlUeXBlcyIsIm9NZXRhTW9kZWwiLCJnZXRPYmplY3QiLCJlbnRpdHlUeXBlcyIsImVudGl0eVNldHMiLCJzaW5nbGV0b25zIiwiY29tcGxleFR5cGVzIiwidHlwZURlZmluaXRpb25zIiwiJEVudGl0eUNvbnRhaW5lciIsInNjaGVtYUtleXMiLCJtZXRhbW9kZWxLZXkiLCJzT2JqZWN0TmFtZSIsImVudGl0eVR5cGUiLCIkQW5ub3RhdGlvbnMiLCJmaWx0ZXJGYWNldEFubm90YXRpb24iLCJJRCIsImdlbmVyYXRlIiwiRmFjZXQiLCJlbnRpdHlQcm9wZXJ0eSIsIlZhbHVlIiwiY29tcGxleFR5cGUiLCJvRW50aXR5Q29udGFpbmVyIiwiZW50aXR5U2V0Iiwic2luZ2xldG9uIiwiZW50aXR5Q29udGFpbmVyIiwibmF2UHJvcGVydHlCaW5kaW5ncyIsIiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwibmF2UHJvcE5hbWUiLCJ0YXJnZXRFbnRpdHlTZXQiLCJrZXkiLCJyZWR1Y2UiLCJvdXRBY3Rpb25zIiwiaW5uZXJBY3Rpb25zIiwiYWN0aW9uIiwib3V0QW5ub3RhdGlvbkxpc3RzIiwic0Fubm90YXRpb25OYW1lIiwicmVmZXJlbmNlcyIsImlkZW50aWZpY2F0aW9uIiwidmVyc2lvbiIsInNjaGVtYSIsImFzc29jaWF0aW9ucyIsImFzc29jaWF0aW9uU2V0cyIsIm1NZXRhTW9kZWxNYXAiLCJjb252ZXJ0VHlwZXMiLCJzTWV0YU1vZGVsSWQiLCJpZCIsInBhcnNlZE91dHB1dCIsIkFubm90YXRpb25Db252ZXJ0ZXIiLCJjb252ZXJ0Iiwib0Vycm9yIiwiRXJyb3IiLCJnZXRDb252ZXJ0ZWRUeXBlcyIsIm9Db250ZXh0IiwiZ2V0TW9kZWwiLCJpc0EiLCJkZWxldGVNb2RlbENhY2hlRGF0YSIsImNvbnZlcnRNZXRhTW9kZWxDb250ZXh0Iiwib01ldGFNb2RlbENvbnRleHQiLCJiSW5jbHVkZVZpc2l0ZWRPYmplY3RzIiwib0NvbnZlcnRlZE1ldGFkYXRhIiwic1BhdGgiLCJnZXRQYXRoIiwiYVBhdGhTcGxpdCIsImZpcnN0UGFydCIsImJlZ2luSW5kZXgiLCJyZWxhdGl2ZVBhdGgiLCJzbGljZSIsImpvaW4iLCJsb2NhbE9iamVjdHMiLCJyZWxhdGl2ZVNwbGl0IiwiaWR4IiwiY3VycmVudEVudGl0eVNldCIsInNOYXZQcm9wVG9DaGVjayIsImFOYXZQcm9wcyIsInRhcmdldEVudGl0eVR5cGUiLCJzTmF2UHJvcCIsInRhcmdldE5hdlByb3AiLCJuYXZQcm9wIiwidGFyZ2V0VHlwZSIsInNoaWZ0Iiwib1RhcmdldCIsInJlc29sdmVQYXRoIiwidmlzaXRlZE9iamVjdHMiLCJjb25jYXQiLCJwYXJhbWV0ZXJOYW1lIiwicGFyYW1ldGVyIiwiZW5kc1dpdGgiLCJnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMiLCJvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCIsIm1ldGFNb2RlbENvbnRleHQiLCJ0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgiLCJjb252ZXJ0ZWRUeXBlcyIsIm9ubHlTZXJ2aWNlT2JqZWN0cyIsImRhdGFNb2RlbE9iamVjdHMiLCJ2aXNpdGVkT2JqZWN0Iiwicm9vdEVudGl0eVNldCIsImN1cnJlbnRFbnRpdHlUeXBlIiwiY3VycmVudE9iamVjdCIsIm5hdmlnYXRlZFBhdGgiLCJpIiwiYm91bmRFbnRpdHlTZXQiLCJzdGFydGluZ0VudGl0eVNldCIsInN0YXJ0aW5nSW5kZXgiLCJyZXF1aXJlZERhdGFNb2RlbE9iamVjdHMiLCJvYmplY3QiLCJvdXREYXRhTW9kZWxQYXRoIiwidGFyZ2V0T2JqZWN0IiwiY29udGV4dExvY2F0aW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJNZXRhTW9kZWxDb252ZXJ0ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGlzIHJldHJpZXZlZCBmcm9tIEBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXIsIHNoYXJlZCBjb2RlIHdpdGggdG9vbCBzdWl0ZVxuXG5pbXBvcnQgdHlwZSB7XG5cdEFubm90YXRpb24sXG5cdEFubm90YXRpb25MaXN0LFxuXHRBbm5vdGF0aW9uUmVjb3JkLFxuXHRDb252ZXJ0ZWRNZXRhZGF0YSxcblx0RW50aXR5U2V0LFxuXHRFbnRpdHlUeXBlLFxuXHRFeHByZXNzaW9uLFxuXHROYXZpZ2F0aW9uUHJvcGVydHksXG5cdFByb3BlcnR5LFxuXHRSYXdBY3Rpb24sXG5cdFJhd0NvbXBsZXhUeXBlLFxuXHRSYXdFbnRpdHlDb250YWluZXIsXG5cdFJhd0VudGl0eVNldCxcblx0UmF3RW50aXR5VHlwZSxcblx0UmF3TWV0YWRhdGEsXG5cdFJhd1Byb3BlcnR5LFxuXHRSYXdTaW5nbGV0b24sXG5cdFJhd1R5cGVEZWZpbml0aW9uLFxuXHRSYXdWNE5hdmlnYXRpb25Qcm9wZXJ0eSxcblx0UmVmZXJlbmNlLFxuXHRSZWZlcmVudGlhbENvbnN0cmFpbnQsXG5cdFNlcnZpY2VPYmplY3QsXG5cdFNpbmdsZXRvblxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IEFubm90YXRpb25Db252ZXJ0ZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb21tb25cIjtcbmltcG9ydCB0eXBlIHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCIuLi9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5cbmNvbnN0IFZPQ0FCVUxBUllfQUxJQVM6IGFueSA9IHtcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxXCI6IFwiQ2FwYWJpbGl0aWVzXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjFcIjogXCJDb3JlXCIsXG5cdFwiT3JnLk9EYXRhLk1lYXN1cmVzLlYxXCI6IFwiTWVhc3VyZXNcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjFcIjogXCJDb21tb25cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MVwiOiBcIlVJXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuU2Vzc2lvbi52MVwiOiBcIlNlc3Npb25cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjFcIjogXCJBbmFseXRpY3NcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjFcIjogXCJQZXJzb25hbERhdGFcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxXCI6IFwiQ29tbXVuaWNhdGlvblwiXG59O1xuXG5leHBvcnQgdHlwZSBFbnZpcm9ubWVudENhcGFiaWxpdGllcyA9IHtcblx0Q2hhcnQ6IGJvb2xlYW47XG5cdE1pY3JvQ2hhcnQ6IGJvb2xlYW47XG5cdFVTaGVsbDogYm9vbGVhbjtcblx0SW50ZW50QmFzZWROYXZpZ2F0aW9uOiBib29sZWFuO1xuXHRBcHBTdGF0ZTogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSB7XG5cdENoYXJ0OiB0cnVlLFxuXHRNaWNyb0NoYXJ0OiB0cnVlLFxuXHRVU2hlbGw6IHRydWUsXG5cdEludGVudEJhc2VkTmF2aWdhdGlvbjogdHJ1ZSxcblx0QXBwU3RhdGU6IHRydWVcbn07XG5cbnR5cGUgTWV0YU1vZGVsQWN0aW9uID0ge1xuXHQka2luZDogXCJBY3Rpb25cIjtcblx0JElzQm91bmQ6IGJvb2xlYW47XG5cdCRFbnRpdHlTZXRQYXRoOiBzdHJpbmc7XG5cdCRQYXJhbWV0ZXI6IHtcblx0XHQkVHlwZTogc3RyaW5nO1xuXHRcdCROYW1lOiBzdHJpbmc7XG5cdFx0JE51bGxhYmxlPzogYm9vbGVhbjtcblx0XHQkTWF4TGVuZ3RoPzogbnVtYmVyO1xuXHRcdCRQcmVjaXNpb24/OiBudW1iZXI7XG5cdFx0JFNjYWxlPzogbnVtYmVyO1xuXHRcdCRpc0NvbGxlY3Rpb24/OiBib29sZWFuO1xuXHR9W107XG5cdCRSZXR1cm5UeXBlOiB7XG5cdFx0JFR5cGU6IHN0cmluZztcblx0fTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlUHJvcGVydHlWYWx1ZShcblx0YW5ub3RhdGlvbk9iamVjdDogYW55LFxuXHRwcm9wZXJ0eUtleTogc3RyaW5nLFxuXHRjdXJyZW50VGFyZ2V0OiBzdHJpbmcsXG5cdGFubm90YXRpb25zTGlzdHM6IFJlY29yZDxzdHJpbmcsIEFubm90YXRpb25MaXN0Pixcblx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcbik6IGFueSB7XG5cdGxldCB2YWx1ZTtcblx0Y29uc3QgY3VycmVudFByb3BlcnR5VGFyZ2V0OiBzdHJpbmcgPSBgJHtjdXJyZW50VGFyZ2V0fS8ke3Byb3BlcnR5S2V5fWA7XG5cdGNvbnN0IHR5cGVPZkFubm90YXRpb24gPSB0eXBlb2YgYW5ub3RhdGlvbk9iamVjdDtcblx0aWYgKGFubm90YXRpb25PYmplY3QgPT09IG51bGwpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJOdWxsXCIsIE51bGw6IG51bGwgfTtcblx0fSBlbHNlIGlmICh0eXBlT2ZBbm5vdGF0aW9uID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHR9IGVsc2UgaWYgKHR5cGVPZkFubm90YXRpb24gPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiQm9vbFwiLCBCb29sOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdH0gZWxzZSBpZiAodHlwZU9mQW5ub3RhdGlvbiA9PT0gXCJudW1iZXJcIikge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIkludFwiLCBJbnQ6IGFubm90YXRpb25PYmplY3QgfTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiBcIkNvbGxlY3Rpb25cIixcblx0XHRcdENvbGxlY3Rpb246IGFubm90YXRpb25PYmplY3QubWFwKChzdWJBbm5vdGF0aW9uT2JqZWN0LCBzdWJBbm5vdGF0aW9uT2JqZWN0SW5kZXgpID0+XG5cdFx0XHRcdHBhcnNlQW5ub3RhdGlvbk9iamVjdChcblx0XHRcdFx0XHRzdWJBbm5vdGF0aW9uT2JqZWN0LFxuXHRcdFx0XHRcdGAke2N1cnJlbnRQcm9wZXJ0eVRhcmdldH0vJHtzdWJBbm5vdGF0aW9uT2JqZWN0SW5kZXh9YCxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc0xpc3RzLFxuXHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdH07XG5cdFx0aWYgKGFubm90YXRpb25PYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUGF0aFwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFubm90YXRpb25QYXRoXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJJZlwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE9yXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiT3JcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBbmRcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbmRcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRFcVwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkVxXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTmVcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOZVwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5vdFwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5vdFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEd0XCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiR3RcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRHZVwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkdlXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTHRcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJMdFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJExlXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTGVcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFwcGx5XCI7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0WzBdID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdC8vICRUeXBlIGlzIG9wdGlvbmFsLi4uXG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJQYXRoXCIsIFBhdGg6IGFubm90YXRpb25PYmplY3QuJFBhdGggfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0ge1xuXHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXG5cdFx0fTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRJZiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiSWZcIiwgSWY6IGFubm90YXRpb25PYmplY3QuJElmIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5kICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJBbmRcIiwgQW5kOiBhbm5vdGF0aW9uT2JqZWN0LiRBbmQgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRPciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiT3JcIiwgT3I6IGFubm90YXRpb25PYmplY3QuJE9yIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTm90ICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJOb3RcIiwgTm90OiBhbm5vdGF0aW9uT2JqZWN0LiROb3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFcSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiRXFcIiwgRXE6IGFubm90YXRpb25PYmplY3QuJEVxIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIk5lXCIsIE5lOiBhbm5vdGF0aW9uT2JqZWN0LiROZSB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEd0ICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJHdFwiLCBHdDogYW5ub3RhdGlvbk9iamVjdC4kR3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRHZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiR2VcIiwgR2U6IGFubm90YXRpb25PYmplY3QuJEdlIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIkx0XCIsIEx0OiBhbm5vdGF0aW9uT2JqZWN0LiRMdCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJExlICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJMZVwiLCBMZTogYW5ub3RhdGlvbk9iamVjdC4kTGUgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiQXBwbHlcIiwgQXBwbHk6IGFubm90YXRpb25PYmplY3QuJEFwcGx5LCBGdW5jdGlvbjogYW5ub3RhdGlvbk9iamVjdC4kRnVuY3Rpb24gfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIiwgQW5ub3RhdGlvblBhdGg6IGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdEVudW1NZW1iZXI6IGAke21hcE5hbWVUb0FsaWFzKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzBdKX0vJHthbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXX1gXG5cdFx0fTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRUeXBlKSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiBcIlJlY29yZFwiLFxuXHRcdFx0UmVjb3JkOiBwYXJzZUFubm90YXRpb25PYmplY3QoYW5ub3RhdGlvbk9iamVjdCwgY3VycmVudFRhcmdldCwgYW5ub3RhdGlvbnNMaXN0cywgb0NhcGFiaWxpdGllcylcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHZhbHVlID0ge1xuXHRcdFx0dHlwZTogXCJSZWNvcmRcIixcblx0XHRcdFJlY29yZDogcGFyc2VBbm5vdGF0aW9uT2JqZWN0KGFubm90YXRpb25PYmplY3QsIGN1cnJlbnRUYXJnZXQsIGFubm90YXRpb25zTGlzdHMsIG9DYXBhYmlsaXRpZXMpXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bmFtZTogcHJvcGVydHlLZXksXG5cdFx0dmFsdWVcblx0fTtcbn1cbmZ1bmN0aW9uIG1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25OYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRsZXQgW3BhdGhQYXJ0LCBhbm5vUGFydF0gPSBhbm5vdGF0aW9uTmFtZS5zcGxpdChcIkBcIik7XG5cdGlmICghYW5ub1BhcnQpIHtcblx0XHRhbm5vUGFydCA9IHBhdGhQYXJ0O1xuXHRcdHBhdGhQYXJ0ID0gXCJcIjtcblx0fSBlbHNlIHtcblx0XHRwYXRoUGFydCArPSBcIkBcIjtcblx0fVxuXHRjb25zdCBsYXN0RG90ID0gYW5ub1BhcnQubGFzdEluZGV4T2YoXCIuXCIpO1xuXHRyZXR1cm4gYCR7cGF0aFBhcnQgKyBWT0NBQlVMQVJZX0FMSUFTW2Fubm9QYXJ0LnN1YnN0cigwLCBsYXN0RG90KV19LiR7YW5ub1BhcnQuc3Vic3RyKGxhc3REb3QgKyAxKX1gO1xufVxuZnVuY3Rpb24gcGFyc2VBbm5vdGF0aW9uT2JqZWN0KFxuXHRhbm5vdGF0aW9uT2JqZWN0OiBhbnksXG5cdGN1cnJlbnRPYmplY3RUYXJnZXQ6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNMaXN0czogUmVjb3JkPHN0cmluZywgQW5ub3RhdGlvbkxpc3Q+LFxuXHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuKTogRXhwcmVzc2lvbiB8IEFubm90YXRpb25SZWNvcmQgfCBBbm5vdGF0aW9uIHtcblx0bGV0IHBhcnNlZEFubm90YXRpb25PYmplY3Q6IGFueSA9IHt9O1xuXHRjb25zdCB0eXBlT2ZPYmplY3QgPSB0eXBlb2YgYW5ub3RhdGlvbk9iamVjdDtcblx0aWYgKGFubm90YXRpb25PYmplY3QgPT09IG51bGwpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIk51bGxcIiwgTnVsbDogbnVsbCB9O1xuXHR9IGVsc2UgaWYgKHR5cGVPZk9iamVjdCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHR9IGVsc2UgaWYgKHR5cGVPZk9iamVjdCA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHR9IGVsc2UgaWYgKHR5cGVPZk9iamVjdCA9PT0gXCJudW1iZXJcIikge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiSW50XCIsIEludDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsIEFubm90YXRpb25QYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiUGF0aFwiLCBQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQYXRoIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiUHJvcGVydHlQYXRoXCIsIFByb3BlcnR5UGF0aDogYW5ub3RhdGlvbk9iamVjdC4kUHJvcGVydHlQYXRoIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kSWYgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiSWZcIiwgSWY6IGFubm90YXRpb25PYmplY3QuJElmIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5kICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkFuZFwiLCBBbmQ6IGFubm90YXRpb25PYmplY3QuJEFuZCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE9yICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIk9yXCIsIE9yOiBhbm5vdGF0aW9uT2JqZWN0LiRPciB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE5vdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJOb3RcIiwgTm90OiBhbm5vdGF0aW9uT2JqZWN0LiROb3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFcSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJFcVwiLCBFcTogYW5ub3RhdGlvbk9iamVjdC4kRXEgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiROZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJOZVwiLCBOZTogYW5ub3RhdGlvbk9iamVjdC4kTmUgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRHdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJHdFwiLCBHdDogYW5ub3RhdGlvbk9iamVjdC4kR3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRHZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJHZVwiLCBHZTogYW5ub3RhdGlvbk9iamVjdC4kR2UgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRMdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJMdFwiLCBMdDogYW5ub3RhdGlvbk9iamVjdC4kTHQgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRMZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJMZVwiLCBMZTogYW5ub3RhdGlvbk9iamVjdC4kTGUgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJBcHBseVwiLCBBcHBseTogYW5ub3RhdGlvbk9iamVjdC4kQXBwbHksIEZ1bmN0aW9uOiBhbm5vdGF0aW9uT2JqZWN0LiRGdW5jdGlvbiB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7XG5cdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7XG5cdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdEVudW1NZW1iZXI6IGAke21hcE5hbWVUb0FsaWFzKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzBdKX0vJHthbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXX1gXG5cdFx0fTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0Y29uc3QgcGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24gPSBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0O1xuXHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gPSBhbm5vdGF0aW9uT2JqZWN0Lm1hcCgoc3ViQW5ub3RhdGlvbk9iamVjdCwgc3ViQW5ub3RhdGlvbkluZGV4KSA9PlxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uT2JqZWN0KHN1YkFubm90YXRpb25PYmplY3QsIGAke2N1cnJlbnRPYmplY3RUYXJnZXR9LyR7c3ViQW5ub3RhdGlvbkluZGV4fWAsIGFubm90YXRpb25zTGlzdHMsIG9DYXBhYmlsaXRpZXMpXG5cdFx0KTtcblx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJQcm9wZXJ0eVBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiUGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5ub3RhdGlvblBhdGhcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJBbm5vdGF0aW9uUGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uLnR5cGUgPSBcIklmXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5kXCIpKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiQW5kXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkT3JcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJPclwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEVxXCIpKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiRXFcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROZVwiKSkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uLnR5cGUgPSBcIk5lXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTm90XCIpKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiTm90XCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkR3RcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJHdFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEdlXCIpKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiR2VcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRMdFwiKSkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uLnR5cGUgPSBcIkx0XCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTGVcIikpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJMZVwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFwcGx5XCIpKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiQXBwbHlcIjtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3RbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbi50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24udHlwZSA9IFwiU3RyaW5nXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0LiRUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlVmFsdWUgPSBhbm5vdGF0aW9uT2JqZWN0LiRUeXBlO1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC50eXBlID0gdHlwZVZhbHVlOyAvL2Ake3R5cGVBbGlhc30uJHt0eXBlVGVybX1gO1xuXHRcdH1cblx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlczogYW55ID0gW107XG5cdFx0T2JqZWN0LmtleXMoYW5ub3RhdGlvbk9iamVjdCkuZm9yRWFjaCgocHJvcGVydHlLZXkpID0+IHtcblx0XHRcdGlmIChcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJFR5cGVcIiAmJlxuXHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkSWZcIiAmJlxuXHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkQXBwbHlcIiAmJlxuXHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkQW5kXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJE9yXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJE5lXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJEd0XCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJEdlXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJEx0XCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJExlXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJE5vdFwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRFcVwiICYmXG5cdFx0XHRcdCFwcm9wZXJ0eUtleS5zdGFydHNXaXRoKFwiQFwiKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHByb3BlcnR5VmFsdWVzLnB1c2goXG5cdFx0XHRcdFx0cGFyc2VQcm9wZXJ0eVZhbHVlKGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldLCBwcm9wZXJ0eUtleSwgY3VycmVudE9iamVjdFRhcmdldCwgYW5ub3RhdGlvbnNMaXN0cywgb0NhcGFiaWxpdGllcylcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0Ly8gQW5ub3RhdGlvbiBvZiBhbm5vdGF0aW9uXG5cdFx0XHRcdGNyZWF0ZUFubm90YXRpb25MaXN0cyhcblx0XHRcdFx0XHR7IFtwcm9wZXJ0eUtleV06IGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldIH0sXG5cdFx0XHRcdFx0Y3VycmVudE9iamVjdFRhcmdldCxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc0xpc3RzLFxuXHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnByb3BlcnR5VmFsdWVzID0gcHJvcGVydHlWYWx1ZXM7XG5cdH1cblx0cmV0dXJuIHBhcnNlZEFubm90YXRpb25PYmplY3Q7XG59XG5mdW5jdGlvbiBnZXRPckNyZWF0ZUFubm90YXRpb25MaXN0KHRhcmdldDogc3RyaW5nLCBhbm5vdGF0aW9uc0xpc3RzOiBSZWNvcmQ8c3RyaW5nLCBBbm5vdGF0aW9uTGlzdD4pOiBBbm5vdGF0aW9uTGlzdCB7XG5cdGlmICghYW5ub3RhdGlvbnNMaXN0cy5oYXNPd25Qcm9wZXJ0eSh0YXJnZXQpKSB7XG5cdFx0YW5ub3RhdGlvbnNMaXN0c1t0YXJnZXRdID0ge1xuXHRcdFx0dGFyZ2V0OiB0YXJnZXQsXG5cdFx0XHRhbm5vdGF0aW9uczogW11cblx0XHR9O1xuXHR9XG5cdHJldHVybiBhbm5vdGF0aW9uc0xpc3RzW3RhcmdldF07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoYXJ0QW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdDogYW55KSB7XG5cdHJldHVybiBhbm5vdGF0aW9uT2JqZWN0LmZpbHRlcigob1JlY29yZDogYW55KSA9PiB7XG5cdFx0aWYgKG9SZWNvcmQuVGFyZ2V0ICYmIG9SZWNvcmQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0cmV0dXJuIG9SZWNvcmQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aC5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCIpID09PSAtMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSUJOQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdDogYW55KSB7XG5cdHJldHVybiBhbm5vdGF0aW9uT2JqZWN0LmZpbHRlcigob1JlY29yZDogYW55KSA9PiB7XG5cdFx0cmV0dXJuIG9SZWNvcmQuJFR5cGUgIT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCI7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQcmVzZW50YXRpb25WYXJpYW50KGFubm90YXRpb25PYmplY3Q6IGFueSkge1xuXHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdC5maWx0ZXIoKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdHJldHVybiBvUmVjb3JkLiRBbm5vdGF0aW9uUGF0aCAhPT0gXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIjtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFubm90YXRpb25MaXN0cyhcblx0YW5ub3RhdGlvbk9iamVjdHM6IGFueSxcblx0YW5ub3RhdGlvblRhcmdldDogc3RyaW5nLFxuXHRhbm5vdGF0aW9uTGlzdHM6IFJlY29yZDxzdHJpbmcsIEFubm90YXRpb25MaXN0Pixcblx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcbikge1xuXHRpZiAoT2JqZWN0LmtleXMoYW5ub3RhdGlvbk9iamVjdHMpLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybjtcblx0fVxuXHRjb25zdCBvdXRBbm5vdGF0aW9uT2JqZWN0ID0gZ2V0T3JDcmVhdGVBbm5vdGF0aW9uTGlzdChhbm5vdGF0aW9uVGFyZ2V0LCBhbm5vdGF0aW9uTGlzdHMpO1xuXHRpZiAoIW9DYXBhYmlsaXRpZXMuTWljcm9DaGFydCkge1xuXHRcdGRlbGV0ZSBhbm5vdGF0aW9uT2JqZWN0c1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiXTtcblx0fVxuXG5cdGZvciAobGV0IGFubm90YXRpb25LZXkgaW4gYW5ub3RhdGlvbk9iamVjdHMpIHtcblx0XHRsZXQgYW5ub3RhdGlvbk9iamVjdCA9IGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldO1xuXHRcdHN3aXRjaCAoYW5ub3RhdGlvbktleSkge1xuXHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IZWFkZXJGYWNldHNcIjpcblx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0ID0gcmVtb3ZlQ2hhcnRBbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0KTtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XSA9IGFubm90YXRpb25PYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklkZW50aWZpY2F0aW9uXCI6XG5cdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5JbnRlbnRCYXNlZE5hdmlnYXRpb24pIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0ID0gcmVtb3ZlSUJOQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdCk7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV0gPSBhbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOlxuXHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuSW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdCA9IHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QpO1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldID0gYW5ub3RhdGlvbk9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuTWljcm9DaGFydCkge1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QgPSByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QpO1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldID0gYW5ub3RhdGlvbk9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFwiOlxuXHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuSW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdC5EYXRhID0gcmVtb3ZlSUJOQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdC5EYXRhKTtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XSA9IGFubm90YXRpb25PYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0LkRhdGEgPSByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QuRGF0YSk7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV0gPSBhbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5QcmVzZW50YXRpb25WYXJpYW50XCI6XG5cdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5DaGFydCAmJiBhbm5vdGF0aW9uT2JqZWN0LlZpc3VhbGl6YXRpb25zKSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdC5WaXN1YWxpemF0aW9ucyA9IGhhbmRsZVByZXNlbnRhdGlvblZhcmlhbnQoYW5ub3RhdGlvbk9iamVjdC5WaXN1YWxpemF0aW9ucyk7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV0gPSBhbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0bGV0IGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0ID0gb3V0QW5ub3RhdGlvbk9iamVjdDtcblxuXHRcdC8vIENoZWNrIGZvciBhbm5vdGF0aW9uIG9mIGFubm90YXRpb25cblx0XHRjb25zdCBhbm5vdGF0aW9uT2ZBbm5vdGF0aW9uU3BsaXQgPSBhbm5vdGF0aW9uS2V5LnNwbGl0KFwiQFwiKTtcblx0XHRpZiAoYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0Lmxlbmd0aCA+IDIpIHtcblx0XHRcdGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0ID0gZ2V0T3JDcmVhdGVBbm5vdGF0aW9uTGlzdChcblx0XHRcdFx0YCR7YW5ub3RhdGlvblRhcmdldH1AJHthbm5vdGF0aW9uT2ZBbm5vdGF0aW9uU3BsaXRbMV19YCxcblx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzXG5cdFx0XHQpO1xuXHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsyXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsxXTtcblx0XHR9XG5cblx0XHRjb25zdCBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQgPSBhbm5vdGF0aW9uS2V5LnNwbGl0KFwiI1wiKTtcblx0XHRjb25zdCBxdWFsaWZpZXIgPSBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXRbMV07XG5cdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdFswXTtcblxuXHRcdGNvbnN0IHBhcnNlZEFubm90YXRpb25PYmplY3Q6IGFueSA9IHtcblx0XHRcdHRlcm06IGAke2Fubm90YXRpb25LZXl9YCxcblx0XHRcdHF1YWxpZmllcjogcXVhbGlmaWVyXG5cdFx0fTtcblx0XHRsZXQgY3VycmVudEFubm90YXRpb25UYXJnZXQgPSBgJHthbm5vdGF0aW9uVGFyZ2V0fUAke3BhcnNlZEFubm90YXRpb25PYmplY3QudGVybX1gO1xuXHRcdGlmIChxdWFsaWZpZXIpIHtcblx0XHRcdGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0ICs9IGAjJHtxdWFsaWZpZXJ9YDtcblx0XHR9XG5cdFx0bGV0IGlzQ29sbGVjdGlvbiA9IGZhbHNlO1xuXHRcdGNvbnN0IHR5cGVvZkFubm90YXRpb24gPSB0eXBlb2YgYW5ub3RhdGlvbk9iamVjdDtcblx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdCA9PT0gbnVsbCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJCb29sXCIsIEJvb2w6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZkFubm90YXRpb24gPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mQW5ub3RhdGlvbiA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQm9vbFwiLCBCb29sOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0fSBlbHNlIGlmICh0eXBlb2ZBbm5vdGF0aW9uID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkludFwiLCBJbnQ6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJElmICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiSWZcIiwgSWY6IGFubm90YXRpb25PYmplY3QuJElmIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbmQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJBbmRcIiwgQW5kOiBhbm5vdGF0aW9uT2JqZWN0LiRBbmQgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE9yICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiT3JcIiwgT3I6IGFubm90YXRpb25PYmplY3QuJE9yIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiROb3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJOb3RcIiwgTm90OiBhbm5vdGF0aW9uT2JqZWN0LiROb3QgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEVxICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiRXFcIiwgRXE6IGFubm90YXRpb25PYmplY3QuJEVxIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiROZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIk5lXCIsIE5lOiBhbm5vdGF0aW9uT2JqZWN0LiROZSB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kR3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJHdFwiLCBHdDogYW5ub3RhdGlvbk9iamVjdC4kR3QgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEdlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiR2VcIiwgR2U6IGFubm90YXRpb25PYmplY3QuJEdlIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRMdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkx0XCIsIEx0OiBhbm5vdGF0aW9uT2JqZWN0LiRMdCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJMZVwiLCBMZTogYW5ub3RhdGlvbk9iamVjdC4kTGUgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFwcGx5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQXBwbHlcIiwgQXBwbHk6IGFubm90YXRpb25PYmplY3QuJEFwcGx5LCBGdW5jdGlvbjogYW5ub3RhdGlvbk9iamVjdC4kRnVuY3Rpb24gfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJQYXRoXCIsIFBhdGg6IGFubm90YXRpb25PYmplY3QuJFBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0QW5ub3RhdGlvblBhdGg6IGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkRlY2ltYWxcIiwgRGVjaW1hbDogcGFyc2VGbG9hdChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsKSB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0ge1xuXHRcdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdFx0RW51bU1lbWJlcjogYCR7bWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMF0pfS8ke2Fubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzFdfWBcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0XHRpc0NvbGxlY3Rpb24gPSB0cnVlO1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uID0gYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25JbmRleCkgPT5cblx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uT2JqZWN0KFxuXHRcdFx0XHRcdHN1YkFubm90YXRpb25PYmplY3QsXG5cdFx0XHRcdFx0YCR7Y3VycmVudEFubm90YXRpb25UYXJnZXR9LyR7c3ViQW5ub3RhdGlvbkluZGV4fWAsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzLFxuXHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0Lmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIlByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUGF0aFwiKSkge1xuXHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbi50eXBlID0gXCJQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFubm90YXRpb25QYXRoXCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIkFubm90YXRpb25QYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24udHlwZSA9IFwiSWZcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE9yXCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIk9yXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRFcVwiKSkge1xuXHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbi50eXBlID0gXCJFcVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTmVcIikpIHtcblx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24udHlwZSA9IFwiTmVcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5vdFwiKSkge1xuXHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbi50eXBlID0gXCJOb3RcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEd0XCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIkd0XCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRHZVwiKSkge1xuXHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbi50eXBlID0gXCJHZVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTHRcIikpIHtcblx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24udHlwZSA9IFwiTHRcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJExlXCIpKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIkxlXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBbmRcIikpIHtcblx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24udHlwZSA9IFwiQW5kXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbi50eXBlID0gXCJBcHBseVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0WzBdID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbi50eXBlID0gXCJTdHJpbmdcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCByZWNvcmQ6IEFubm90YXRpb25SZWNvcmQgPSB7XG5cdFx0XHRcdHByb3BlcnR5VmFsdWVzOiBbXVxuXHRcdFx0fTtcblx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0LiRUeXBlKSB7XG5cdFx0XHRcdGNvbnN0IHR5cGVWYWx1ZSA9IGFubm90YXRpb25PYmplY3QuJFR5cGU7XG5cdFx0XHRcdHJlY29yZC50eXBlID0gYCR7dHlwZVZhbHVlfWA7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlczogYW55W10gPSBbXTtcblx0XHRcdGZvciAoY29uc3QgcHJvcGVydHlLZXkgaW4gYW5ub3RhdGlvbk9iamVjdCkge1xuXHRcdFx0XHRpZiAocHJvcGVydHlLZXkgIT09IFwiJFR5cGVcIiAmJiAhcHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlcy5wdXNoKFxuXHRcdFx0XHRcdFx0cGFyc2VQcm9wZXJ0eVZhbHVlKFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSxcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlLZXksXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uTGlzdHMsXG5cdFx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHByb3BlcnR5S2V5LnN0YXJ0c1dpdGgoXCJAXCIpKSB7XG5cdFx0XHRcdFx0Ly8gQW5ub3RhdGlvbiBvZiByZWNvcmRcblx0XHRcdFx0XHRjcmVhdGVBbm5vdGF0aW9uTGlzdHMoXG5cdFx0XHRcdFx0XHR7IFtwcm9wZXJ0eUtleV06IGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldIH0sXG5cdFx0XHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCxcblx0XHRcdFx0XHRcdGFubm90YXRpb25MaXN0cyxcblx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZWNvcmQucHJvcGVydHlWYWx1ZXMgPSBwcm9wZXJ0eVZhbHVlcztcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QucmVjb3JkID0gcmVjb3JkO1xuXHRcdH1cblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmlzQ29sbGVjdGlvbiA9IGlzQ29sbGVjdGlvbjtcblx0XHRjdXJyZW50T3V0QW5ub3RhdGlvbk9iamVjdC5hbm5vdGF0aW9ucy5wdXNoKHBhcnNlZEFubm90YXRpb25PYmplY3QpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVQcm9wZXJ0eShwcm9wZXJ0eURlZmluaXRpb246IGFueSwgZW50aXR5VHlwZU9iamVjdDogUmF3RW50aXR5VHlwZSB8IFJhd0NvbXBsZXhUeXBlLCBwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IFJhd1Byb3BlcnR5IHtcblx0Y29uc3QgcHJvcGVydHlPYmplY3Q6IFJhd1Byb3BlcnR5ID0ge1xuXHRcdF90eXBlOiBcIlByb3BlcnR5XCIsXG5cdFx0bmFtZTogcHJvcGVydHlOYW1lLFxuXHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7cHJvcGVydHlOYW1lfWAsXG5cdFx0dHlwZTogcHJvcGVydHlEZWZpbml0aW9uLiRUeXBlLFxuXHRcdG1heExlbmd0aDogcHJvcGVydHlEZWZpbml0aW9uLiRNYXhMZW5ndGgsXG5cdFx0cHJlY2lzaW9uOiBwcm9wZXJ0eURlZmluaXRpb24uJFByZWNpc2lvbixcblx0XHRzY2FsZTogcHJvcGVydHlEZWZpbml0aW9uLiRTY2FsZSxcblx0XHRudWxsYWJsZTogcHJvcGVydHlEZWZpbml0aW9uLiROdWxsYWJsZVxuXHR9O1xuXHRyZXR1cm4gcHJvcGVydHlPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVOYXZpZ2F0aW9uUHJvcGVydHkoXG5cdG5hdlByb3BlcnR5RGVmaW5pdGlvbjogYW55LFxuXHRlbnRpdHlUeXBlT2JqZWN0OiBSYXdFbnRpdHlUeXBlIHwgUmF3Q29tcGxleFR5cGUsXG5cdG5hdlByb3BlcnR5TmFtZTogc3RyaW5nXG4pOiBSYXdWNE5hdmlnYXRpb25Qcm9wZXJ0eSB7XG5cdGxldCByZWZlcmVudGlhbENvbnN0cmFpbnQ6IFJlZmVyZW50aWFsQ29uc3RyYWludFtdID0gW107XG5cdGlmIChuYXZQcm9wZXJ0eURlZmluaXRpb24uJFJlZmVyZW50aWFsQ29uc3RyYWludCkge1xuXHRcdHJlZmVyZW50aWFsQ29uc3RyYWludCA9IE9iamVjdC5rZXlzKG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50KS5tYXAoKHNvdXJjZVByb3BlcnR5TmFtZSkgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c291cmNlVHlwZU5hbWU6IGVudGl0eVR5cGVPYmplY3QubmFtZSxcblx0XHRcdFx0c291cmNlUHJvcGVydHk6IHNvdXJjZVByb3BlcnR5TmFtZSxcblx0XHRcdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdFx0dGFyZ2V0UHJvcGVydHk6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50W3NvdXJjZVByb3BlcnR5TmFtZV1cblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnR5OiBSYXdWNE5hdmlnYXRpb25Qcm9wZXJ0eSA9IHtcblx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRuYW1lOiBuYXZQcm9wZXJ0eU5hbWUsXG5cdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtuYXZQcm9wZXJ0eU5hbWV9YCxcblx0XHRwYXJ0bmVyOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJFBhcnRuZXIsXG5cdFx0aXNDb2xsZWN0aW9uOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJGlzQ29sbGVjdGlvbiA/IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kaXNDb2xsZWN0aW9uIDogZmFsc2UsXG5cdFx0Y29udGFpbnNUYXJnZXQ6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kQ29udGFpbnNUYXJnZXQsXG5cdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnRcblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvblByb3BlcnR5O1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW50aXR5U2V0KGVudGl0eVNldERlZmluaXRpb246IGFueSwgZW50aXR5U2V0TmFtZTogc3RyaW5nLCBlbnRpdHlDb250YWluZXJOYW1lOiBzdHJpbmcpOiBSYXdFbnRpdHlTZXQge1xuXHRjb25zdCBlbnRpdHlTZXRPYmplY3Q6IFJhd0VudGl0eVNldCA9IHtcblx0XHRfdHlwZTogXCJFbnRpdHlTZXRcIixcblx0XHRuYW1lOiBlbnRpdHlTZXROYW1lLFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmc6IHt9LFxuXHRcdGVudGl0eVR5cGVOYW1lOiBlbnRpdHlTZXREZWZpbml0aW9uLiRUeXBlLFxuXHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7ZW50aXR5Q29udGFpbmVyTmFtZX0vJHtlbnRpdHlTZXROYW1lfWBcblx0fTtcblx0cmV0dXJuIGVudGl0eVNldE9iamVjdDtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVNpbmdsZXRvbihzaW5nbGV0b25EZWZpbml0aW9uOiBhbnksIHNpbmdsZXRvbk5hbWU6IHN0cmluZywgZW50aXR5Q29udGFpbmVyTmFtZTogc3RyaW5nKTogUmF3U2luZ2xldG9uIHtcblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJTaW5nbGV0b25cIixcblx0XHRuYW1lOiBzaW5nbGV0b25OYW1lLFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmc6IHt9LFxuXHRcdGVudGl0eVR5cGVOYW1lOiBzaW5nbGV0b25EZWZpbml0aW9uLiRUeXBlLFxuXHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7ZW50aXR5Q29udGFpbmVyTmFtZX0vJHtzaW5nbGV0b25OYW1lfWAsXG5cdFx0bnVsbGFibGU6IHRydWVcblx0fTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVR5cGVEZWZpbml0aW9uKHR5cGVEZWZpbml0aW9uOiBhbnksIHR5cGVOYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nKTogUmF3VHlwZURlZmluaXRpb24ge1xuXHRjb25zdCB0eXBlT2JqZWN0OiBSYXdUeXBlRGVmaW5pdGlvbiA9IHtcblx0XHRfdHlwZTogXCJUeXBlRGVmaW5pdGlvblwiLFxuXHRcdG5hbWU6IHR5cGVOYW1lLnJlcGxhY2UoYCR7bmFtZXNwYWNlfS5gLCBcIlwiKSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHR5cGVOYW1lLFxuXHRcdHVuZGVybHlpbmdUeXBlOiB0eXBlRGVmaW5pdGlvbi4kVW5kZXJseWluZ1R5cGVcblx0fTtcblx0cmV0dXJuIHR5cGVPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDb21wbGV4VHlwZShjb21wbGV4VHlwZURlZmluaXRpb246IGFueSwgY29tcGxleFR5cGVOYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nKTogUmF3Q29tcGxleFR5cGUge1xuXHRjb25zdCBjb21wbGV4VHlwZU9iamVjdDogUmF3Q29tcGxleFR5cGUgPSB7XG5cdFx0X3R5cGU6IFwiQ29tcGxleFR5cGVcIixcblx0XHRuYW1lOiBjb21wbGV4VHlwZU5hbWUucmVwbGFjZShgJHtuYW1lc3BhY2V9LmAsIFwiXCIpLFxuXHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogY29tcGxleFR5cGVOYW1lLFxuXHRcdHByb3BlcnRpZXM6IFtdLFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBbXVxuXHR9O1xuXG5cdGNvbnN0IGNvbXBsZXhUeXBlUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKGNvbXBsZXhUeXBlRGVmaW5pdGlvbilcblx0XHQuZmlsdGVyKChwcm9wZXJ0eU5hbWVPck5vdCkgPT4ge1xuXHRcdFx0aWYgKHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJEtleVwiICYmIHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJGtpbmRcIikge1xuXHRcdFx0XHRyZXR1cm4gY29tcGxleFR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnNvcnQoKGEsIGIpID0+IChhID4gYiA/IDEgOiAtMSkpXG5cdFx0Lm1hcCgocHJvcGVydHlOYW1lKSA9PiB7XG5cdFx0XHRyZXR1cm4gcHJlcGFyZVByb3BlcnR5KGNvbXBsZXhUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVdLCBjb21wbGV4VHlwZU9iamVjdCwgcHJvcGVydHlOYW1lKTtcblx0XHR9KTtcblxuXHRjb21wbGV4VHlwZU9iamVjdC5wcm9wZXJ0aWVzID0gY29tcGxleFR5cGVQcm9wZXJ0aWVzO1xuXHRjb25zdCBjb21wbGV4VHlwZU5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29tcGxleFR5cGVEZWZpbml0aW9uKVxuXHRcdC5maWx0ZXIoKHByb3BlcnR5TmFtZU9yTm90KSA9PiB7XG5cdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdHJldHVybiBjb21wbGV4VHlwZURlZmluaXRpb25bcHJvcGVydHlOYW1lT3JOb3RdLiRraW5kID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnNvcnQoKGEsIGIpID0+IChhID4gYiA/IDEgOiAtMSkpXG5cdFx0Lm1hcCgobmF2UHJvcGVydHlOYW1lKSA9PiB7XG5cdFx0XHRyZXR1cm4gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0eShjb21wbGV4VHlwZURlZmluaXRpb25bbmF2UHJvcGVydHlOYW1lXSwgY29tcGxleFR5cGVPYmplY3QsIG5hdlByb3BlcnR5TmFtZSk7XG5cdFx0fSk7XG5cdGNvbXBsZXhUeXBlT2JqZWN0Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gY29tcGxleFR5cGVOYXZpZ2F0aW9uUHJvcGVydGllcztcblx0cmV0dXJuIGNvbXBsZXhUeXBlT2JqZWN0O1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW50aXR5S2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbjogYW55LCBvTWV0YU1vZGVsRGF0YTogYW55KTogYW55IHtcblx0aWYgKCFlbnRpdHlUeXBlRGVmaW5pdGlvbi4kS2V5ICYmIGVudGl0eVR5cGVEZWZpbml0aW9uLiRCYXNlVHlwZSkge1xuXHRcdHJldHVybiBwcmVwYXJlRW50aXR5S2V5cyhvTWV0YU1vZGVsRGF0YVtgJHtlbnRpdHlUeXBlRGVmaW5pdGlvbi4kQmFzZVR5cGV9YF0sIG9NZXRhTW9kZWxEYXRhKTtcblx0fVxuXHRyZXR1cm4gZW50aXR5VHlwZURlZmluaXRpb24uJEtleSB8fCBbXTsgLy9oYW5kbGluZyBvZiBlbnRpdHkgdHlwZXMgd2l0aG91dCBrZXkgYXMgd2VsbCBhcyBiYXNldHlwZVxufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW50aXR5VHlwZShlbnRpdHlUeXBlRGVmaW5pdGlvbjogYW55LCBlbnRpdHlUeXBlTmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZywgbWV0YU1vZGVsRGF0YTogYW55KTogUmF3RW50aXR5VHlwZSB7XG5cdGNvbnN0IGVudGl0eUtleXM6IGFueSA9IHByZXBhcmVFbnRpdHlLZXlzKGVudGl0eVR5cGVEZWZpbml0aW9uLCBtZXRhTW9kZWxEYXRhKTtcblxuXHRjb25zdCBlbnRpdHlUeXBlT2JqZWN0OiBSYXdFbnRpdHlUeXBlID0ge1xuXHRcdF90eXBlOiBcIkVudGl0eVR5cGVcIixcblx0XHRuYW1lOiBlbnRpdHlUeXBlTmFtZS5yZXBsYWNlKGAke25hbWVzcGFjZX0uYCwgXCJcIiksXG5cdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBlbnRpdHlUeXBlTmFtZSxcblx0XHRrZXlzOiBbXSxcblx0XHRlbnRpdHlQcm9wZXJ0aWVzOiBbXSxcblx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogW10sXG5cdFx0YWN0aW9uczoge31cblx0fTtcblxuXHRjb25zdCBlbnRpdHlQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoZW50aXR5VHlwZURlZmluaXRpb24pXG5cdFx0LmZpbHRlcigocHJvcGVydHlOYW1lT3JOb3QpID0+IHtcblx0XHRcdGlmIChwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRLZXlcIiAmJiBwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRraW5kXCIpIHtcblx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0Lm1hcCgocHJvcGVydHlOYW1lKSA9PiB7XG5cdFx0XHRyZXR1cm4gcHJlcGFyZVByb3BlcnR5KGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZV0sIGVudGl0eVR5cGVPYmplY3QsIHByb3BlcnR5TmFtZSk7XG5cdFx0fSk7XG5cblx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbilcblx0XHQuZmlsdGVyKChwcm9wZXJ0eU5hbWVPck5vdCkgPT4ge1xuXHRcdFx0aWYgKHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJEtleVwiICYmIHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJGtpbmRcIikge1xuXHRcdFx0XHRyZXR1cm4gZW50aXR5VHlwZURlZmluaXRpb25bcHJvcGVydHlOYW1lT3JOb3RdLiRraW5kID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0Lm1hcCgobmF2UHJvcGVydHlOYW1lKSA9PiB7XG5cdFx0XHRyZXR1cm4gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0eShlbnRpdHlUeXBlRGVmaW5pdGlvbltuYXZQcm9wZXJ0eU5hbWVdLCBlbnRpdHlUeXBlT2JqZWN0LCBuYXZQcm9wZXJ0eU5hbWUpO1xuXHRcdH0pO1xuXG5cdGVudGl0eVR5cGVPYmplY3Qua2V5cyA9IGVudGl0eUtleXNcblx0XHQubWFwKChlbnRpdHlLZXk6IHN0cmluZykgPT4gZW50aXR5UHJvcGVydGllcy5maW5kKChwcm9wZXJ0eTogUmF3UHJvcGVydHkpID0+IHByb3BlcnR5Lm5hbWUgPT09IGVudGl0eUtleSkpXG5cdFx0LmZpbHRlcigocHJvcGVydHk6IFByb3BlcnR5KSA9PiBwcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKTtcblx0ZW50aXR5VHlwZU9iamVjdC5lbnRpdHlQcm9wZXJ0aWVzID0gZW50aXR5UHJvcGVydGllcztcblx0ZW50aXR5VHlwZU9iamVjdC5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IG5hdmlnYXRpb25Qcm9wZXJ0aWVzO1xuXG5cdHJldHVybiBlbnRpdHlUeXBlT2JqZWN0O1xufVxuZnVuY3Rpb24gcHJlcGFyZUFjdGlvbihhY3Rpb25OYW1lOiBzdHJpbmcsIGFjdGlvblJhd0RhdGE6IE1ldGFNb2RlbEFjdGlvbiwgbmFtZXNwYWNlOiBzdHJpbmcsIGVudGl0eUNvbnRhaW5lck5hbWU6IHN0cmluZyk6IFJhd0FjdGlvbiB7XG5cdGxldCBhY3Rpb25FbnRpdHlUeXBlOiBzdHJpbmcgPSBcIlwiO1xuXHRsZXQgYWN0aW9uRlFOID0gYCR7YWN0aW9uTmFtZX1gO1xuXHRjb25zdCBhY3Rpb25TaG9ydE5hbWUgPSBhY3Rpb25OYW1lLnN1YnN0cihuYW1lc3BhY2UubGVuZ3RoICsgMSk7XG5cdGlmIChhY3Rpb25SYXdEYXRhLiRJc0JvdW5kKSB7XG5cdFx0Y29uc3QgYmluZGluZ1BhcmFtZXRlciA9IGFjdGlvblJhd0RhdGEuJFBhcmFtZXRlclswXTtcblx0XHRhY3Rpb25FbnRpdHlUeXBlID0gYmluZGluZ1BhcmFtZXRlci4kVHlwZTtcblx0XHRpZiAoYmluZGluZ1BhcmFtZXRlci4kaXNDb2xsZWN0aW9uID09PSB0cnVlKSB7XG5cdFx0XHRhY3Rpb25GUU4gPSBgJHthY3Rpb25OYW1lfShDb2xsZWN0aW9uKCR7YWN0aW9uRW50aXR5VHlwZX0pKWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFjdGlvbkZRTiA9IGAke2FjdGlvbk5hbWV9KCR7YWN0aW9uRW50aXR5VHlwZX0pYDtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uRlFOID0gYCR7ZW50aXR5Q29udGFpbmVyTmFtZX0vJHthY3Rpb25TaG9ydE5hbWV9YDtcblx0fVxuXHRjb25zdCBwYXJhbWV0ZXJzID0gYWN0aW9uUmF3RGF0YS4kUGFyYW1ldGVyIHx8IFtdO1xuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkFjdGlvblwiLFxuXHRcdG5hbWU6IGFjdGlvblNob3J0TmFtZSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGFjdGlvbkZRTixcblx0XHRpc0JvdW5kOiBhY3Rpb25SYXdEYXRhLiRJc0JvdW5kLFxuXHRcdGlzRnVuY3Rpb246IGZhbHNlLFxuXHRcdHNvdXJjZVR5cGU6IGFjdGlvbkVudGl0eVR5cGUsXG5cdFx0cmV0dXJuVHlwZTogYWN0aW9uUmF3RGF0YS4kUmV0dXJuVHlwZSA/IGFjdGlvblJhd0RhdGEuJFJldHVyblR5cGUuJFR5cGUgOiBcIlwiLFxuXHRcdHBhcmFtZXRlcnM6IHBhcmFtZXRlcnMubWFwKChwYXJhbSkgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0X3R5cGU6IFwiQWN0aW9uUGFyYW1ldGVyXCIsXG5cdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7YWN0aW9uRlFOfS8ke3BhcmFtLiROYW1lfWAsXG5cdFx0XHRcdGlzQ29sbGVjdGlvbjogcGFyYW0uJGlzQ29sbGVjdGlvbiA/PyBmYWxzZSxcblx0XHRcdFx0bmFtZTogcGFyYW0uJE5hbWUsXG5cdFx0XHRcdHR5cGU6IHBhcmFtLiRUeXBlXG5cdFx0XHR9O1xuXHRcdH0pXG5cdH07XG59XG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUVudGl0eVR5cGVzKFxuXHRvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCxcblx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcbik6IFJhd01ldGFkYXRhIHtcblx0Y29uc3Qgb01ldGFNb2RlbERhdGEgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcIi8kXCIpO1xuXHRjb25zdCBhbm5vdGF0aW9uTGlzdHM6IFJlY29yZDxzdHJpbmcsIEFubm90YXRpb25MaXN0PiA9IHt9O1xuXHRjb25zdCBlbnRpdHlUeXBlczogUmF3RW50aXR5VHlwZVtdID0gW107XG5cdGNvbnN0IGVudGl0eVNldHM6IFJhd0VudGl0eVNldFtdID0gW107XG5cdGNvbnN0IHNpbmdsZXRvbnM6IFJhd1NpbmdsZXRvbltdID0gW107XG5cdGNvbnN0IGNvbXBsZXhUeXBlczogUmF3Q29tcGxleFR5cGVbXSA9IFtdO1xuXHRjb25zdCB0eXBlRGVmaW5pdGlvbnM6IFJhd1R5cGVEZWZpbml0aW9uW10gPSBbXTtcblx0Y29uc3QgZW50aXR5Q29udGFpbmVyTmFtZSA9IG9NZXRhTW9kZWxEYXRhLiRFbnRpdHlDb250YWluZXI7XG5cdGxldCBuYW1lc3BhY2UgPSBcIlwiO1xuXHRjb25zdCBzY2hlbWFLZXlzID0gT2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpLmZpbHRlcigobWV0YW1vZGVsS2V5KSA9PiBvTWV0YU1vZGVsRGF0YVttZXRhbW9kZWxLZXldLiRraW5kID09PSBcIlNjaGVtYVwiKTtcblx0aWYgKHNjaGVtYUtleXMgJiYgc2NoZW1hS2V5cy5sZW5ndGggPiAwKSB7XG5cdFx0bmFtZXNwYWNlID0gc2NoZW1hS2V5c1swXS5zdWJzdHIoMCwgc2NoZW1hS2V5c1swXS5sZW5ndGggLSAxKTtcblx0fSBlbHNlIGlmIChlbnRpdHlUeXBlcyAmJiBlbnRpdHlUeXBlcy5sZW5ndGgpIHtcblx0XHRuYW1lc3BhY2UgPSBlbnRpdHlUeXBlc1swXS5mdWxseVF1YWxpZmllZE5hbWUucmVwbGFjZShlbnRpdHlUeXBlc1swXS5uYW1lLCBcIlwiKTtcblx0XHRuYW1lc3BhY2UgPSBuYW1lc3BhY2Uuc3Vic3RyKDAsIG5hbWVzcGFjZS5sZW5ndGggLSAxKTtcblx0fVxuXHRPYmplY3Qua2V5cyhvTWV0YU1vZGVsRGF0YSkuZm9yRWFjaCgoc09iamVjdE5hbWUpID0+IHtcblx0XHRpZiAoc09iamVjdE5hbWUgIT09IFwiJGtpbmRcIikge1xuXHRcdFx0c3dpdGNoIChvTWV0YU1vZGVsRGF0YVtzT2JqZWN0TmFtZV0uJGtpbmQpIHtcblx0XHRcdFx0Y2FzZSBcIkVudGl0eVR5cGVcIjpcblx0XHRcdFx0XHRjb25zdCBlbnRpdHlUeXBlID0gcHJlcGFyZUVudGl0eVR5cGUob01ldGFNb2RlbERhdGFbc09iamVjdE5hbWVdLCBzT2JqZWN0TmFtZSwgbmFtZXNwYWNlLCBvTWV0YU1vZGVsRGF0YSk7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgYXJlIGZpbHRlciBmYWNldHMgZGVmaW5lZCBmb3IgdGhlIGVudGl0eVR5cGUgYW5kIGlmIHllcywgY2hlY2sgaWYgYWxsIG9mIHRoZW0gaGF2ZSBhbiBJRFxuXHRcdFx0XHRcdC8vIFRoZSBJRCBpcyBvcHRpb25hbCwgYnV0IGl0IGlzIGludGVybmFsbHkgdGFrZW4gZm9yIGdyb3VwaW5nIGZpbHRlciBmaWVsZHMgYW5kIGlmIGl0J3Mgbm90IHByZXNlbnRcblx0XHRcdFx0XHQvLyBhIGZhbGxiYWNrIElEIG5lZWRzIHRvIGJlIGdlbmVyYXRlZCBoZXJlLlxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1tlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZV0gJiZcblx0XHRcdFx0XHRcdG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1tlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZV1bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmlsdGVyRmFjZXRzXCJdXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpbHRlckZhY2V0c1wiXS5mb3JFYWNoKFxuXHRcdFx0XHRcdFx0XHQoZmlsdGVyRmFjZXRBbm5vdGF0aW9uOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJGYWNldEFubm90YXRpb24uSUQgPSBmaWx0ZXJGYWNldEFubm90YXRpb24uSUQgfHwgZ2VuZXJhdGUoW3sgRmFjZXQ6IGZpbHRlckZhY2V0QW5ub3RhdGlvbiB9XSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5mb3JFYWNoKChlbnRpdHlQcm9wZXJ0eSkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKCFvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHt9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHQhb01ldGFNb2RlbERhdGEuJEFubm90YXRpb25zW2VudGl0eVByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZV1bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRGVmYXVsdFwiXVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1tlbnRpdHlQcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZERlZmF1bHRcIl0gPVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdCRUeXBlOiBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0VmFsdWU6IHsgJFBhdGg6IGVudGl0eVByb3BlcnR5Lm5hbWUgfVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0ZW50aXR5VHlwZXMucHVzaChlbnRpdHlUeXBlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkNvbXBsZXhUeXBlXCI6XG5cdFx0XHRcdFx0Y29uc3QgY29tcGxleFR5cGUgPSBwcmVwYXJlQ29tcGxleFR5cGUob01ldGFNb2RlbERhdGFbc09iamVjdE5hbWVdLCBzT2JqZWN0TmFtZSwgbmFtZXNwYWNlKTtcblx0XHRcdFx0XHRjb21wbGV4VHlwZXMucHVzaChjb21wbGV4VHlwZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJUeXBlRGVmaW5pdGlvblwiOlxuXHRcdFx0XHRcdGNvbnN0IHR5cGVEZWZpbml0aW9uID0gcHJlcGFyZVR5cGVEZWZpbml0aW9uKG9NZXRhTW9kZWxEYXRhW3NPYmplY3ROYW1lXSwgc09iamVjdE5hbWUsIG5hbWVzcGFjZSk7XG5cdFx0XHRcdFx0dHlwZURlZmluaXRpb25zLnB1c2godHlwZURlZmluaXRpb24pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Y29uc3Qgb0VudGl0eUNvbnRhaW5lciA9IG9NZXRhTW9kZWxEYXRhW2VudGl0eUNvbnRhaW5lck5hbWVdO1xuXHRPYmplY3Qua2V5cyhvRW50aXR5Q29udGFpbmVyKS5mb3JFYWNoKChzT2JqZWN0TmFtZSkgPT4ge1xuXHRcdGlmIChzT2JqZWN0TmFtZSAhPT0gXCIka2luZFwiKSB7XG5cdFx0XHRzd2l0Y2ggKG9FbnRpdHlDb250YWluZXJbc09iamVjdE5hbWVdLiRraW5kKSB7XG5cdFx0XHRcdGNhc2UgXCJFbnRpdHlTZXRcIjpcblx0XHRcdFx0XHRjb25zdCBlbnRpdHlTZXQgPSBwcmVwYXJlRW50aXR5U2V0KG9FbnRpdHlDb250YWluZXJbc09iamVjdE5hbWVdLCBzT2JqZWN0TmFtZSwgZW50aXR5Q29udGFpbmVyTmFtZSk7XG5cdFx0XHRcdFx0ZW50aXR5U2V0cy5wdXNoKGVudGl0eVNldCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJTaW5nbGV0b25cIjpcblx0XHRcdFx0XHRjb25zdCBzaW5nbGV0b24gPSBwcmVwYXJlU2luZ2xldG9uKG9FbnRpdHlDb250YWluZXJbc09iamVjdE5hbWVdLCBzT2JqZWN0TmFtZSwgZW50aXR5Q29udGFpbmVyTmFtZSk7XG5cdFx0XHRcdFx0c2luZ2xldG9ucy5wdXNoKHNpbmdsZXRvbik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRsZXQgZW50aXR5Q29udGFpbmVyOiBSYXdFbnRpdHlDb250YWluZXIgPSB7XG5cdFx0X3R5cGU6IFwiRW50aXR5Q29udGFpbmVyXCIsXG5cdFx0bmFtZTogXCJcIixcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IFwiXCJcblx0fTtcblx0aWYgKGVudGl0eUNvbnRhaW5lck5hbWUpIHtcblx0XHRlbnRpdHlDb250YWluZXIgPSB7XG5cdFx0XHRfdHlwZTogXCJFbnRpdHlDb250YWluZXJcIixcblx0XHRcdG5hbWU6IGVudGl0eUNvbnRhaW5lck5hbWUucmVwbGFjZShgJHtuYW1lc3BhY2V9LmAsIFwiXCIpLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBlbnRpdHlDb250YWluZXJOYW1lXG5cdFx0fTtcblx0fVxuXHRlbnRpdHlTZXRzLmZvckVhY2goKGVudGl0eVNldCkgPT4ge1xuXHRcdGNvbnN0IG5hdlByb3BlcnR5QmluZGluZ3MgPSBvRW50aXR5Q29udGFpbmVyW2VudGl0eVNldC5uYW1lXS4kTmF2aWdhdGlvblByb3BlcnR5QmluZGluZztcblx0XHRpZiAobmF2UHJvcGVydHlCaW5kaW5ncykge1xuXHRcdFx0T2JqZWN0LmtleXMobmF2UHJvcGVydHlCaW5kaW5ncykuZm9yRWFjaCgobmF2UHJvcE5hbWUpID0+IHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0RW50aXR5U2V0ID0gZW50aXR5U2V0cy5maW5kKChlbnRpdHlTZXROYW1lKSA9PiBlbnRpdHlTZXROYW1lLm5hbWUgPT09IG5hdlByb3BlcnR5QmluZGluZ3NbbmF2UHJvcE5hbWVdKTtcblx0XHRcdFx0aWYgKHRhcmdldEVudGl0eVNldCkge1xuXHRcdFx0XHRcdGVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW25hdlByb3BOYW1lXSA9IHRhcmdldEVudGl0eVNldDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxuXHRjb25zdCBhY3Rpb25zOiBSYXdBY3Rpb25bXSA9IE9iamVjdC5rZXlzKG9NZXRhTW9kZWxEYXRhKVxuXHRcdC5maWx0ZXIoKGtleSkgPT4ge1xuXHRcdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkob01ldGFNb2RlbERhdGFba2V5XSkgJiYgb01ldGFNb2RlbERhdGFba2V5XS5sZW5ndGggPiAwICYmIG9NZXRhTW9kZWxEYXRhW2tleV1bMF0uJGtpbmQgPT09IFwiQWN0aW9uXCI7XG5cdFx0fSlcblx0XHQucmVkdWNlKChvdXRBY3Rpb25zOiBSYXdBY3Rpb25bXSwgYWN0aW9uTmFtZSkgPT4ge1xuXHRcdFx0Y29uc3QgaW5uZXJBY3Rpb25zID0gb01ldGFNb2RlbERhdGFbYWN0aW9uTmFtZV07XG5cdFx0XHRpbm5lckFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uOiBNZXRhTW9kZWxBY3Rpb24pID0+IHtcblx0XHRcdFx0b3V0QWN0aW9ucy5wdXNoKHByZXBhcmVBY3Rpb24oYWN0aW9uTmFtZSwgYWN0aW9uLCBuYW1lc3BhY2UsIGVudGl0eUNvbnRhaW5lck5hbWUpKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG91dEFjdGlvbnM7XG5cdFx0fSwgW10pO1xuXG5cdGZvciAoY29uc3QgdGFyZ2V0IGluIG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9ucykge1xuXHRcdGNyZWF0ZUFubm90YXRpb25MaXN0cyhvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbdGFyZ2V0XSwgdGFyZ2V0LCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXHR9XG5cblx0Ly8gU29ydCBieSB0YXJnZXQgbGVuZ3RoXG5cdGNvbnN0IG91dEFubm90YXRpb25MaXN0cyA9IE9iamVjdC5rZXlzKGFubm90YXRpb25MaXN0cylcblx0XHQuc29ydCgoYSwgYikgPT4gKGEubGVuZ3RoID49IGIubGVuZ3RoID8gMSA6IC0xKSlcblx0XHQubWFwKChzQW5ub3RhdGlvbk5hbWUpID0+IGFubm90YXRpb25MaXN0c1tzQW5ub3RhdGlvbk5hbWVdKTtcblx0Y29uc3QgcmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcblx0cmV0dXJuIHtcblx0XHRpZGVudGlmaWNhdGlvbjogXCJtZXRhbW9kZWxSZXN1bHRcIixcblx0XHR2ZXJzaW9uOiBcIjQuMFwiLFxuXHRcdHNjaGVtYToge1xuXHRcdFx0ZW50aXR5Q29udGFpbmVyLFxuXHRcdFx0ZW50aXR5U2V0cyxcblx0XHRcdGVudGl0eVR5cGVzLFxuXHRcdFx0Y29tcGxleFR5cGVzLFxuXHRcdFx0dHlwZURlZmluaXRpb25zLFxuXHRcdFx0c2luZ2xldG9ucyxcblx0XHRcdGFzc29jaWF0aW9uczogW10sXG5cdFx0XHRhc3NvY2lhdGlvblNldHM6IFtdLFxuXHRcdFx0YWN0aW9ucyxcblx0XHRcdG5hbWVzcGFjZSxcblx0XHRcdGFubm90YXRpb25zOiB7XG5cdFx0XHRcdFwibWV0YW1vZGVsUmVzdWx0XCI6IG91dEFubm90YXRpb25MaXN0c1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVmZXJlbmNlczogcmVmZXJlbmNlc1xuXHR9O1xufVxuXG5jb25zdCBtTWV0YU1vZGVsTWFwOiBSZWNvcmQ8c3RyaW5nLCBDb252ZXJ0ZWRNZXRhZGF0YT4gPSB7fTtcblxuLyoqXG4gKiBDb252ZXJ0IHRoZSBPRGF0YU1ldGFNb2RlbCBpbnRvIGFub3RoZXIgZm9ybWF0IHRoYXQgYWxsb3cgZm9yIGVhc3kgbWFuaXB1bGF0aW9uIG9mIHRoZSBhbm5vdGF0aW9ucy5cbiAqXG4gKiBAcGFyYW0gb01ldGFNb2RlbCBUaGUgT0RhdGFNZXRhTW9kZWxcbiAqIEBwYXJhbSBvQ2FwYWJpbGl0aWVzIFRoZSBjdXJyZW50IGNhcGFiaWxpdGllc1xuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgb2JqZWN0LWxpa2UgYW5ub3RhdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCwgb0NhcGFiaWxpdGllcz86IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKTogQ29udmVydGVkTWV0YWRhdGEge1xuXHRjb25zdCBzTWV0YU1vZGVsSWQgPSAob01ldGFNb2RlbCBhcyBhbnkpLmlkO1xuXHRpZiAoIW1NZXRhTW9kZWxNYXAuaGFzT3duUHJvcGVydHkoc01ldGFNb2RlbElkKSkge1xuXHRcdGNvbnN0IHBhcnNlZE91dHB1dCA9IHByZXBhcmVFbnRpdHlUeXBlcyhvTWV0YU1vZGVsLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHR0cnkge1xuXHRcdFx0bU1ldGFNb2RlbE1hcFtzTWV0YU1vZGVsSWRdID0gQW5ub3RhdGlvbkNvbnZlcnRlci5jb252ZXJ0KHBhcnNlZE91dHB1dCk7XG5cdFx0fSBjYXRjaCAob0Vycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3Iob0Vycm9yIGFzIGFueSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBtTWV0YU1vZGVsTWFwW3NNZXRhTW9kZWxJZF0gYXMgYW55IGFzIENvbnZlcnRlZE1ldGFkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udmVydGVkVHlwZXMob0NvbnRleHQ6IENvbnRleHQpIHtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCkgYXMgdW5rbm93biBhcyBPRGF0YU1ldGFNb2RlbDtcblx0aWYgKCFvTWV0YU1vZGVsLmlzQShcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YU1ldGFNb2RlbFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uIGEgT0RhdGFNZXRhTW9kZWxcIik7XG5cdH1cblx0cmV0dXJuIGNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU1vZGVsQ2FjaGVEYXRhKG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsKSB7XG5cdGRlbGV0ZSBtTWV0YU1vZGVsTWFwWyhvTWV0YU1vZGVsIGFzIGFueSkuaWRdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydE1ldGFNb2RlbENvbnRleHQob01ldGFNb2RlbENvbnRleHQ6IENvbnRleHQsIGJJbmNsdWRlVmlzaXRlZE9iamVjdHM6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XG5cdGNvbnN0IG9Db252ZXJ0ZWRNZXRhZGF0YSA9IGNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsQ29udGV4dC5nZXRNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsKTtcblx0Y29uc3Qgc1BhdGggPSBvTWV0YU1vZGVsQ29udGV4dC5nZXRQYXRoKCk7XG5cblx0Y29uc3QgYVBhdGhTcGxpdCA9IHNQYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IGZpcnN0UGFydCA9IGFQYXRoU3BsaXRbMV07XG5cdGxldCBiZWdpbkluZGV4ID0gMjtcblx0aWYgKG9Db252ZXJ0ZWRNZXRhZGF0YS5lbnRpdHlDb250YWluZXIuZnVsbHlRdWFsaWZpZWROYW1lID09PSBmaXJzdFBhcnQpIHtcblx0XHRmaXJzdFBhcnQgPSBhUGF0aFNwbGl0WzJdO1xuXHRcdGJlZ2luSW5kZXgrKztcblx0fVxuXHRsZXQgdGFyZ2V0RW50aXR5U2V0OiBFbnRpdHlTZXQgfCBTaW5nbGV0b24gPSBvQ29udmVydGVkTWV0YWRhdGEuZW50aXR5U2V0cy5maW5kKFxuXHRcdChlbnRpdHlTZXQpID0+IGVudGl0eVNldC5uYW1lID09PSBmaXJzdFBhcnRcblx0KSBhcyBFbnRpdHlTZXQ7XG5cdGlmICghdGFyZ2V0RW50aXR5U2V0KSB7XG5cdFx0dGFyZ2V0RW50aXR5U2V0ID0gb0NvbnZlcnRlZE1ldGFkYXRhLnNpbmdsZXRvbnMuZmluZCgoc2luZ2xldG9uKSA9PiBzaW5nbGV0b24ubmFtZSA9PT0gZmlyc3RQYXJ0KSBhcyBTaW5nbGV0b247XG5cdH1cblx0bGV0IHJlbGF0aXZlUGF0aCA9IGFQYXRoU3BsaXQuc2xpY2UoYmVnaW5JbmRleCkuam9pbihcIi9cIik7XG5cblx0Y29uc3QgbG9jYWxPYmplY3RzOiBhbnlbXSA9IFt0YXJnZXRFbnRpdHlTZXRdO1xuXHR3aGlsZSAocmVsYXRpdmVQYXRoICYmIHJlbGF0aXZlUGF0aC5sZW5ndGggPiAwICYmIHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIikpIHtcblx0XHRsZXQgcmVsYXRpdmVTcGxpdCA9IHJlbGF0aXZlUGF0aC5zcGxpdChcIi9cIik7XG5cdFx0bGV0IGlkeCA9IDA7XG5cdFx0bGV0IGN1cnJlbnRFbnRpdHlTZXQsIHNOYXZQcm9wVG9DaGVjaztcblxuXHRcdHJlbGF0aXZlU3BsaXQgPSByZWxhdGl2ZVNwbGl0LnNsaWNlKDEpOyAvLyBSZW1vdmluZyBcIiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCJcblx0XHR3aGlsZSAoIWN1cnJlbnRFbnRpdHlTZXQgJiYgcmVsYXRpdmVTcGxpdC5sZW5ndGggPiBpZHgpIHtcblx0XHRcdGlmIChyZWxhdGl2ZVNwbGl0W2lkeF0gIT09IFwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIikge1xuXHRcdFx0XHQvLyBGaW5kaW5nIHRoZSBjb3JyZWN0IGVudGl0eVNldCBmb3IgdGhlIG5hdmlnYWl0b24gcHJvcGVydHkgYmluZGluZyBleGFtcGxlOiBcIlNldC9fU2FsZXNPcmRlclwiXG5cdFx0XHRcdHNOYXZQcm9wVG9DaGVjayA9IHJlbGF0aXZlU3BsaXRcblx0XHRcdFx0XHQuc2xpY2UoMCwgaWR4ICsgMSlcblx0XHRcdFx0XHQuam9pbihcIi9cIilcblx0XHRcdFx0XHQucmVwbGFjZShcIi8kTmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiLCBcIlwiKTtcblx0XHRcdFx0Y3VycmVudEVudGl0eVNldCA9IHRhcmdldEVudGl0eVNldCAmJiB0YXJnZXRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tzTmF2UHJvcFRvQ2hlY2tdO1xuXHRcdFx0fVxuXHRcdFx0aWR4Kys7XG5cdFx0fVxuXHRcdGlmICghY3VycmVudEVudGl0eVNldCkge1xuXHRcdFx0Ly8gRmFsbCBiYWNrIHRvIFNpbmdsZSBuYXYgcHJvcCBpZiBlbnRpdHlTZXQgaXMgbm90IGZvdW5kLlxuXHRcdFx0c05hdlByb3BUb0NoZWNrID0gcmVsYXRpdmVTcGxpdFswXTtcblx0XHR9XG5cdFx0Y29uc3QgYU5hdlByb3BzID0gc05hdlByb3BUb0NoZWNrPy5zcGxpdChcIi9cIikgfHwgW107XG5cdFx0bGV0IHRhcmdldEVudGl0eVR5cGUgPSB0YXJnZXRFbnRpdHlTZXQgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGU7XG5cdFx0Zm9yIChjb25zdCBzTmF2UHJvcCBvZiBhTmF2UHJvcHMpIHtcblx0XHRcdC8vIFB1c2hpbmcgYWxsIG5hdiBwcm9wcyB0byB0aGUgdmlzaXRlZCBvYmplY3RzLiBleGFtcGxlOiBcIlNldFwiLCBcIl9TYWxlc09yZGVyXCIgZm9yIFwiU2V0L19TYWxlc09yZGVyXCIoaW4gTmF2aWdhdGlvblByb3BlcnR5QmluZGluZylcblx0XHRcdGNvbnN0IHRhcmdldE5hdlByb3AgPSB0YXJnZXRFbnRpdHlUeXBlICYmIHRhcmdldEVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZCgobmF2UHJvcCkgPT4gbmF2UHJvcC5uYW1lID09PSBzTmF2UHJvcCk7XG5cdFx0XHRpZiAodGFyZ2V0TmF2UHJvcCkge1xuXHRcdFx0XHRsb2NhbE9iamVjdHMucHVzaCh0YXJnZXROYXZQcm9wKTtcblx0XHRcdFx0dGFyZ2V0RW50aXR5VHlwZSA9IHRhcmdldE5hdlByb3AudGFyZ2V0VHlwZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0YXJnZXRFbnRpdHlTZXQgPVxuXHRcdFx0KHRhcmdldEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0KSB8fCAodGFyZ2V0RW50aXR5U2V0ICYmIHRhcmdldEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW3JlbGF0aXZlU3BsaXRbMF1dKTtcblx0XHRpZiAodGFyZ2V0RW50aXR5U2V0KSB7XG5cdFx0XHQvLyBQdXNoaW5nIHRoZSB0YXJnZXQgZW50aXR5U2V0IHRvIHZpc2l0ZWQgb2JqZWN0c1xuXHRcdFx0bG9jYWxPYmplY3RzLnB1c2godGFyZ2V0RW50aXR5U2V0KTtcblx0XHR9XG5cdFx0Ly8gUmUtY2FsY3VsYXRpbmcgdGhlIHJlbGF0aXZlIHBhdGhcblx0XHQvLyBBcyBlYWNoIG5hdmlnYXRpb24gbmFtZSBpcyBlbmNsb3NlZCBiZXR3ZWVuICckTmF2aWdhdGlvblByb3BlcnR5QmluZGluZycgYW5kICckJyAodG8gYmUgYWJsZSB0byBhY2Nlc3MgdGhlIGVudGl0eXNldCBlYXNpbHkgaW4gdGhlIG1ldGFtb2RlbClcblx0XHQvLyB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgY2xvc2luZyAnJCcgdG8gYmUgYWJsZSB0byBzd2l0Y2ggdG8gdGhlIG5leHQgbmF2aWdhdGlvblxuXHRcdHJlbGF0aXZlU3BsaXQgPSByZWxhdGl2ZVNwbGl0LnNsaWNlKGFOYXZQcm9wcy5sZW5ndGggfHwgMSk7XG5cdFx0aWYgKHJlbGF0aXZlU3BsaXQubGVuZ3RoICYmIHJlbGF0aXZlU3BsaXRbMF0gPT09IFwiJFwiKSB7XG5cdFx0XHRyZWxhdGl2ZVNwbGl0LnNoaWZ0KCk7XG5cdFx0fVxuXHRcdHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlU3BsaXQuam9pbihcIi9cIik7XG5cdH1cblx0aWYgKHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJFR5cGVcIikpIHtcblx0XHQvLyBBcyAkVHlwZUAgaXMgYWxsb3dlZCBhcyB3ZWxsXG5cdFx0aWYgKHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJFR5cGVAXCIpKSB7XG5cdFx0XHRyZWxhdGl2ZVBhdGggPSByZWxhdGl2ZVBhdGgucmVwbGFjZShcIiRUeXBlXCIsIFwiXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBXZSdyZSBhbnl3YXkgZ29pbmcgdG8gbG9vayBvbiB0aGUgZW50aXR5VHlwZS4uLlxuXHRcdFx0cmVsYXRpdmVQYXRoID0gYVBhdGhTcGxpdC5zbGljZSgzKS5qb2luKFwiL1wiKTtcblx0XHR9XG5cdH1cblx0aWYgKHRhcmdldEVudGl0eVNldCAmJiByZWxhdGl2ZVBhdGgubGVuZ3RoKSB7XG5cdFx0Y29uc3Qgb1RhcmdldCA9IHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlLnJlc29sdmVQYXRoKHJlbGF0aXZlUGF0aCwgYkluY2x1ZGVWaXNpdGVkT2JqZWN0cyk7XG5cdFx0aWYgKG9UYXJnZXQpIHtcblx0XHRcdGlmIChiSW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG5cdFx0XHRcdG9UYXJnZXQudmlzaXRlZE9iamVjdHMgPSBsb2NhbE9iamVjdHMuY29uY2F0KG9UYXJnZXQudmlzaXRlZE9iamVjdHMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYWN0aW9ucykge1xuXHRcdFx0Ly8gaWYgdGFyZ2V0IGlzIGFuIGFjdGlvbiBvciBhbiBhY3Rpb24gcGFyYW1ldGVyXG5cdFx0XHRjb25zdCBhY3Rpb25zID0gdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYWN0aW9ucztcblx0XHRcdGNvbnN0IHJlbGF0aXZlU3BsaXQgPSByZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0aWYgKGFjdGlvbnNbcmVsYXRpdmVTcGxpdFswXV0pIHtcblx0XHRcdFx0Y29uc3QgYWN0aW9uID0gYWN0aW9uc1tyZWxhdGl2ZVNwbGl0WzBdXTtcblx0XHRcdFx0aWYgKHJlbGF0aXZlU3BsaXRbMV0gJiYgYWN0aW9uLnBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRjb25zdCBwYXJhbWV0ZXJOYW1lID0gcmVsYXRpdmVTcGxpdFsxXTtcblx0XHRcdFx0XHRyZXR1cm4gYWN0aW9uLnBhcmFtZXRlcnMuZmluZCgocGFyYW1ldGVyKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyYW1ldGVyLmZ1bGx5UXVhbGlmaWVkTmFtZS5lbmRzV2l0aChgLyR7cGFyYW1ldGVyTmFtZX1gKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZWxhdGl2ZVBhdGgubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFjdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb1RhcmdldDtcblx0fSBlbHNlIHtcblx0XHRpZiAoYkluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dGFyZ2V0OiB0YXJnZXRFbnRpdHlTZXQsXG5cdFx0XHRcdHZpc2l0ZWRPYmplY3RzOiBsb2NhbE9iamVjdHNcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB0YXJnZXRFbnRpdHlTZXQ7XG5cdH1cbn1cblxuZXhwb3J0IHR5cGUgUmVzb2x2ZWRUYXJnZXQgPSB7XG5cdHRhcmdldD86IFNlcnZpY2VPYmplY3Q7XG5cdHZpc2l0ZWRPYmplY3RzOiAoU2VydmljZU9iamVjdCB8IFNpbmdsZXRvbilbXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob01ldGFNb2RlbENvbnRleHQ6IENvbnRleHQsIG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0PzogQ29udGV4dCk6IERhdGFNb2RlbE9iamVjdFBhdGgge1xuXHRjb25zdCBvQ29udmVydGVkTWV0YWRhdGEgPSBjb252ZXJ0VHlwZXMob01ldGFNb2RlbENvbnRleHQuZ2V0TW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbCk7XG5cdGNvbnN0IG1ldGFNb2RlbENvbnRleHQgPSBjb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvTWV0YU1vZGVsQ29udGV4dCwgdHJ1ZSk7XG5cdGxldCB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbjtcblx0aWYgKG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0ICYmIG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0LmdldFBhdGgoKSAhPT0gXCIvXCIpIHtcblx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiA9IGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCk7XG5cdH1cblx0cmV0dXJuIGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgobWV0YU1vZGVsQ29udGV4dCwgb0NvbnZlcnRlZE1ldGFkYXRhLCB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdEZyb21QYXRoKFxuXHRtZXRhTW9kZWxDb250ZXh0OiBSZXNvbHZlZFRhcmdldCxcblx0Y29udmVydGVkVHlwZXM6IENvbnZlcnRlZE1ldGFkYXRhLFxuXHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbj86IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdG9ubHlTZXJ2aWNlT2JqZWN0cz86IGJvb2xlYW5cbik6IERhdGFNb2RlbE9iamVjdFBhdGgge1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RzID0gbWV0YU1vZGVsQ29udGV4dC52aXNpdGVkT2JqZWN0cy5maWx0ZXIoXG5cdFx0KHZpc2l0ZWRPYmplY3Q6IGFueSkgPT5cblx0XHRcdHZpc2l0ZWRPYmplY3QgJiZcblx0XHRcdHZpc2l0ZWRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJlxuXHRcdFx0dmlzaXRlZE9iamVjdC5fdHlwZSAhPT0gXCJFbnRpdHlUeXBlXCIgJiZcblx0XHRcdHZpc2l0ZWRPYmplY3QuX3R5cGUgIT09IFwiRW50aXR5Q29udGFpbmVyXCJcblx0KTtcblx0aWYgKFxuXHRcdG1ldGFNb2RlbENvbnRleHQudGFyZ2V0ICYmXG5cdFx0bWV0YU1vZGVsQ29udGV4dC50YXJnZXQuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJlxuXHRcdG1ldGFNb2RlbENvbnRleHQudGFyZ2V0Ll90eXBlICE9PSBcIkVudGl0eVR5cGVcIiAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdHNbZGF0YU1vZGVsT2JqZWN0cy5sZW5ndGggLSAxXSAhPT0gbWV0YU1vZGVsQ29udGV4dC50YXJnZXQgJiZcblx0XHQhb25seVNlcnZpY2VPYmplY3RzXG5cdCkge1xuXHRcdGRhdGFNb2RlbE9iamVjdHMucHVzaChtZXRhTW9kZWxDb250ZXh0LnRhcmdldCk7XG5cdH1cblxuXHRjb25zdCBuYXZpZ2F0aW9uUHJvcGVydGllczogTmF2aWdhdGlvblByb3BlcnR5W10gPSBbXTtcblx0Y29uc3Qgcm9vdEVudGl0eVNldDogRW50aXR5U2V0ID0gZGF0YU1vZGVsT2JqZWN0c1swXSBhcyBFbnRpdHlTZXQ7XG5cblx0bGV0IGN1cnJlbnRFbnRpdHlTZXQ6IEVudGl0eVNldCB8IFNpbmdsZXRvbiB8IHVuZGVmaW5lZCA9IHJvb3RFbnRpdHlTZXQ7XG5cdGxldCBjdXJyZW50RW50aXR5VHlwZTogRW50aXR5VHlwZSA9IHJvb3RFbnRpdHlTZXQuZW50aXR5VHlwZTtcblx0bGV0IGN1cnJlbnRPYmplY3Q6IFNlcnZpY2VPYmplY3QgfCB1bmRlZmluZWQ7XG5cdGxldCBuYXZpZ2F0ZWRQYXRoID0gW107XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBkYXRhTW9kZWxPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y3VycmVudE9iamVjdCA9IGRhdGFNb2RlbE9iamVjdHNbaV07XG5cblx0XHRpZiAoY3VycmVudE9iamVjdC5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0bmF2aWdhdGVkUGF0aC5wdXNoKGN1cnJlbnRPYmplY3QubmFtZSk7XG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xuXHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSBjdXJyZW50T2JqZWN0LnRhcmdldFR5cGU7XG5cdFx0XHRjb25zdCBib3VuZEVudGl0eVNldDogRW50aXR5U2V0IHwgU2luZ2xldG9uIHwgdW5kZWZpbmVkID0gY3VycmVudEVudGl0eVNldD8ubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZpZ2F0ZWRQYXRoLmpvaW4oXCIvXCIpXTtcblx0XHRcdGlmIChib3VuZEVudGl0eVNldCkge1xuXHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gYm91bmRFbnRpdHlTZXQ7XG5cdFx0XHRcdG5hdmlnYXRlZFBhdGggPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGN1cnJlbnRPYmplY3QuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgfHwgY3VycmVudE9iamVjdC5fdHlwZSA9PT0gXCJTaW5nbGV0b25cIikge1xuXHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRPYmplY3Q7XG5cdFx0XHRjdXJyZW50RW50aXR5VHlwZSA9IGN1cnJlbnRFbnRpdHlTZXQuZW50aXR5VHlwZTtcblx0XHR9XG5cdH1cblxuXHRpZiAobmF2aWdhdGVkUGF0aC5sZW5ndGggPiAwKSB7XG5cdFx0Ly8gUGF0aCB3aXRob3V0IE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcgLS0+IG5vIHRhcmdldCBlbnRpdHkgc2V0XG5cdFx0Y3VycmVudEVudGl0eVNldCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdGlmICh0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiAmJiB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5zdGFydGluZ0VudGl0eVNldCAhPT0gcm9vdEVudGl0eVNldCkge1xuXHRcdC8vIEluIGNhc2UgdGhlIGVudGl0eXNldCBpcyBub3Qgc3RhcnRpbmcgZnJvbSB0aGUgc2FtZSBsb2NhdGlvbiBpdCBtYXkgbWVhbiB0aGF0IHdlIGFyZSBkb2luZyB0b28gbXVjaCB3b3JrIGVhcmxpZXIgZm9yIHNvbWUgcmVhc29uXG5cdFx0Ly8gQXMgc3VjaCB3ZSBuZWVkIHRvIHJlZGVmaW5lIHRoZSBjb250ZXh0IHNvdXJjZSBmb3IgdGhlIHRhcmdldEVudGl0eVNldExvY2F0aW9uXG5cdFx0Y29uc3Qgc3RhcnRpbmdJbmRleCA9IGRhdGFNb2RlbE9iamVjdHMuaW5kZXhPZih0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5zdGFydGluZ0VudGl0eVNldCk7XG5cdFx0aWYgKHN0YXJ0aW5nSW5kZXggIT09IC0xKSB7XG5cdFx0XHQvLyBJZiBpdCdzIG5vdCBmb3VuZCBJIGRvbid0IGtub3cgd2hhdCB3ZSBjYW4gZG8gKHByb2JhYmx5IG5vdGhpbmcpXG5cdFx0XHRjb25zdCByZXF1aXJlZERhdGFNb2RlbE9iamVjdHMgPSBkYXRhTW9kZWxPYmplY3RzLnNsaWNlKDAsIHN0YXJ0aW5nSW5kZXgpO1xuXHRcdFx0dGFyZ2V0RW50aXR5U2V0TG9jYXRpb24uc3RhcnRpbmdFbnRpdHlTZXQgPSByb290RW50aXR5U2V0O1xuXHRcdFx0dGFyZ2V0RW50aXR5U2V0TG9jYXRpb24ubmF2aWdhdGlvblByb3BlcnRpZXMgPSByZXF1aXJlZERhdGFNb2RlbE9iamVjdHNcblx0XHRcdFx0LmZpbHRlcigob2JqZWN0OiBhbnkpID0+IG9iamVjdC5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIilcblx0XHRcdFx0LmNvbmNhdCh0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5uYXZpZ2F0aW9uUHJvcGVydGllcykgYXMgTmF2aWdhdGlvblByb3BlcnR5W107XG5cdFx0fVxuXHR9XG5cdGNvbnN0IG91dERhdGFNb2RlbFBhdGggPSB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IHJvb3RFbnRpdHlTZXQsXG5cdFx0dGFyZ2V0RW50aXR5U2V0OiBjdXJyZW50RW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVR5cGU6IGN1cnJlbnRFbnRpdHlUeXBlLFxuXHRcdHRhcmdldE9iamVjdDogbWV0YU1vZGVsQ29udGV4dC50YXJnZXQsXG5cdFx0bmF2aWdhdGlvblByb3BlcnRpZXMsXG5cdFx0Y29udGV4dExvY2F0aW9uOiB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbixcblx0XHRjb252ZXJ0ZWRUeXBlczogY29udmVydGVkVHlwZXNcblx0fTtcblx0aWYgKCFvdXREYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdD8uaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiBvbmx5U2VydmljZU9iamVjdHMpIHtcblx0XHRvdXREYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdCA9IGN1cnJlbnRPYmplY3Q7XG5cdH1cblx0aWYgKCFvdXREYXRhTW9kZWxQYXRoLmNvbnRleHRMb2NhdGlvbikge1xuXHRcdG91dERhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uID0gb3V0RGF0YU1vZGVsUGF0aDtcblx0fVxuXHRyZXR1cm4gb3V0RGF0YU1vZGVsUGF0aDtcbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpQ0EsSUFBTUEsZ0JBQXFCLEdBQUc7SUFDN0IsNkJBQTZCLGNBREE7SUFFN0IscUJBQXFCLE1BRlE7SUFHN0IseUJBQXlCLFVBSEk7SUFJN0Isa0NBQWtDLFFBSkw7SUFLN0IsOEJBQThCLElBTEQ7SUFNN0IsbUNBQW1DLFNBTk47SUFPN0IscUNBQXFDLFdBUFI7SUFRN0Isd0NBQXdDLGNBUlg7SUFTN0IseUNBQXlDO0VBVFosQ0FBOUI7RUFvQk8sSUFBTUMsOEJBQThCLEdBQUc7SUFDN0NDLEtBQUssRUFBRSxJQURzQztJQUU3Q0MsVUFBVSxFQUFFLElBRmlDO0lBRzdDQyxNQUFNLEVBQUUsSUFIcUM7SUFJN0NDLHFCQUFxQixFQUFFLElBSnNCO0lBSzdDQyxRQUFRLEVBQUU7RUFMbUMsQ0FBdkM7OztFQTBCUCxTQUFTQyxrQkFBVCxDQUNDQyxnQkFERCxFQUVDQyxXQUZELEVBR0NDLGFBSEQsRUFJQ0MsZ0JBSkQsRUFLQ0MsYUFMRCxFQU1PO0lBQ04sSUFBSUMsS0FBSjtJQUNBLElBQU1DLHFCQUE2QixhQUFNSixhQUFOLGNBQXVCRCxXQUF2QixDQUFuQztJQUNBLElBQU1NLGdCQUFnQixHQUFHLE9BQU9QLGdCQUFoQzs7SUFDQSxJQUFJQSxnQkFBZ0IsS0FBSyxJQUF6QixFQUErQjtNQUM5QkssS0FBSyxHQUFHO1FBQUVHLElBQUksRUFBRSxNQUFSO1FBQWdCQyxJQUFJLEVBQUU7TUFBdEIs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