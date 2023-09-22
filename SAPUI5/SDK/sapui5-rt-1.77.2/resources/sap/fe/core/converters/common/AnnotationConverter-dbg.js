sap.ui.define("sap/fe/core/converters/common/AnnotationConverter", [], function () {
  "use strict";

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Path = function Path(pathExpression, targetName) {
    _classCallCheck(this, Path);

    this.path = pathExpression.Path;
    this.type = "Path";
    this.$target = targetName;
  };

  function buildObjectMap(parserOutput) {
    var objectMap = {};

    if (parserOutput.schema.entityContainer && parserOutput.schema.entityContainer.fullyQualifiedName) {
      objectMap[parserOutput.schema.entityContainer.fullyQualifiedName] = parserOutput.schema.entityContainer;
    }

    parserOutput.schema.entitySets.forEach(function (entitySet) {
      objectMap[entitySet.fullyQualifiedName] = entitySet;
    });
    parserOutput.schema.actions.forEach(function (action) {
      objectMap[action.fullyQualifiedName] = action;
      action.parameters.forEach(function (parameter) {
        objectMap[parameter.fullyQualifiedName] = parameter;
      });
    });
    parserOutput.schema.entityTypes.forEach(function (entityType) {
      objectMap[entityType.fullyQualifiedName] = entityType;
      entityType.entityProperties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;
      });
      entityType.navigationProperties.forEach(function (navProperty) {
        objectMap[navProperty.fullyQualifiedName] = navProperty;
      });
    });
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = parserOutput.unalias(annotationList.target);
        annotationList.annotations.forEach(function (annotation) {
          var annotationFQN = "".concat(currentTargetName, "/@").concat(parserOutput.unalias(annotation.term));

          if (annotation.qualifier) {
            annotationFQN += "#".concat(annotation.qualifier);
          }

          objectMap[annotationFQN] = annotation;
          annotation.fullyQualifiedName = annotationFQN;
        });
      });
    });
    return objectMap;
  }

  function resolveTarget(objectMap, currentTarget, path) {
    var pathOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    path = currentTarget.fullyQualifiedName + "/" + path;
    var pathSplit = path.split("/");
    var currentPath = path;
    var target = pathSplit.reduce(function (currentValue, pathPart) {
      if (!currentValue) {
        currentPath = pathPart;
      } else if (currentValue._type === "EntitySet" && currentValue.entityType) {
        currentPath = currentValue.entityType + "/" + pathPart;
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetTypeName) {
        currentPath = currentValue.targetTypeName + "/" + pathPart;
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetType) {
        currentPath = currentValue.targetType.fullyQualifiedName + "/" + pathPart;
      } else if (currentValue._type === "Property") {
        currentPath = currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/")) + "/" + pathPart;
      } else if (currentValue._type === "Action" && currentValue.isBound) {
        currentPath = currentValue.fullyQualifiedName + "/" + pathPart;

        if (!objectMap[currentPath]) {
          currentPath = currentValue.sourceType + "/" + pathPart;
        }
      } else if (currentValue._type === "ActionParameter" && currentValue.isEntitySet) {
        currentPath = currentValue.type + "/" + pathPart;
      } else if (currentValue._type === "ActionParameter" && !currentValue.isEntitySet) {
        currentPath = currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/")) + "/" + pathPart;

        if (!objectMap[currentPath]) {
          currentPath = objectMap[currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/"))].sourceType + "/" + pathPart;
        }
      } else {
        currentPath = currentValue.fullyQualifiedName + "/" + pathPart;
      }

      return objectMap[currentPath];
    }, null);

    if (!target) {// console.log("Missing target " + path);
    }

    if (pathOnly) {
      return currentPath;
    }

    return target;
  }

  function parseValue(propertyValue, parserOutput, currentTarget, objectMap, toResolve) {
    if (propertyValue === undefined) {
      return undefined;
    }

    switch (propertyValue.type) {
      case "String":
        return propertyValue.String;

      case "Int":
        return propertyValue.Int;

      case "Bool":
        return propertyValue.Bool;

      case "Decimal":
        return propertyValue.Decimal;

      case "Date":
        return propertyValue.Date;

      case "EnumMember":
        return propertyValue.EnumMember;

      case "PropertyPath":
        return {
          type: "PropertyPath",
          value: propertyValue.PropertyPath,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.PropertyPath)
        };

      case "NavigationPropertyPath":
        return {
          type: "NavigationPropertyPath",
          value: propertyValue.NavigationPropertyPath,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.NavigationPropertyPath)
        };

      case "AnnotationPath":
        var annotationTarget = resolveTarget(objectMap, currentTarget, parserOutput.unalias(propertyValue.AnnotationPath), true);
        var annotationPath = {
          type: "AnnotationPath",
          value: propertyValue.AnnotationPath,
          $target: annotationTarget
        };
        toResolve.push(annotationPath);
        return annotationPath;

      case "Path":
        var $target = resolveTarget(objectMap, currentTarget, propertyValue.Path, true);
        var path = new Path(propertyValue, $target);
        toResolve.push(path);
        return path;

      case "Record":
        return parseRecord(propertyValue.Record, parserOutput, currentTarget, objectMap, toResolve);

      case "Collection":
        return parseCollection(propertyValue.Collection, parserOutput, currentTarget, objectMap, toResolve);

      case "Apply":
        return propertyValue;
    }
  }

  function parseRecord(recordDefinition, parserOutput, currentTarget, objectMap, toResolve) {
    var annotationTerm = {
      $Type: parserOutput.unalias(recordDefinition.type)
    };
    var annotationContent = {};
    recordDefinition.propertyValues.forEach(function (propertyValue) {
      annotationContent[propertyValue.name] = parseValue(propertyValue.value, parserOutput, currentTarget, objectMap, toResolve);
    });
    return Object.assign(annotationTerm, annotationContent);
  }

  function parseCollection(collectionDefinition, parserOutput, currentTarget, objectMap, toResolve) {
    switch (collectionDefinition.type) {
      case "PropertyPath":
        return collectionDefinition.map(function (propertyPath) {
          return {
            type: "PropertyPath",
            value: propertyPath.PropertyPath,
            $target: resolveTarget(objectMap, currentTarget, propertyPath.PropertyPath)
          };
        });

      case "Path":
        return collectionDefinition.map(function (pathValue) {
          var $target = resolveTarget(objectMap, currentTarget, pathValue.Path, true);
          var path = new Path(pathValue, $target);
          toResolve.push(path);
          return path;
        });

      case "AnnotationPath":
        return collectionDefinition.map(function (annotationPath) {
          var annotationTarget = resolveTarget(objectMap, currentTarget, annotationPath.AnnotationPath, true);
          var annotationCollectionElement = {
            type: "AnnotationPath",
            value: annotationPath.AnnotationPath,
            $target: annotationTarget
          };
          toResolve.push(annotationCollectionElement);
          return annotationCollectionElement;
        });

      case "NavigationPropertyPath":
        return collectionDefinition.map(function (navPropertyPath) {
          return {
            type: "NavigationPropertyPath",
            value: navPropertyPath.NavigationPropertyPath,
            $target: resolveTarget(objectMap, currentTarget, navPropertyPath.NavigationPropertyPath)
          };
        });

      case "Record":
        return collectionDefinition.map(function (recordDefinition) {
          return parseRecord(recordDefinition, parserOutput, currentTarget, objectMap, toResolve);
        });

      case "String":
        return collectionDefinition.map(function (stringValue) {
          return stringValue;
        });

      default:
        if (collectionDefinition.length === 0) {
          return [];
        }

        throw new Error("Unsupported case");
    }
  }

  function convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve) {
    if (annotation.record) {
      var annotationTerm = {
        $Type: parserOutput.unalias(annotation.record.type),
        fullyQualifiedName: annotation.fullyQualifiedName,
        qualifier: annotation.qualifier
      };
      var annotationContent = {};
      annotation.record.propertyValues.forEach(function (propertyValue) {
        annotationContent[propertyValue.name] = parseValue(propertyValue.value, parserOutput, currentTarget, objectMap, toResolve);
      });
      return Object.assign(annotationTerm, annotationContent);
    } else if (!annotation.isCollection) {
      if (annotation.value) {
        return parseValue(annotation.value, parserOutput, currentTarget, objectMap, toResolve);
      } else {
        return true;
      }
    } else if (annotation.collection) {
      var collection = parseCollection(annotation.collection, parserOutput, currentTarget, objectMap, toResolve);
      collection.fullyQualifiedName = annotation.fullyQualifiedName;
      return collection;
    } else {
      throw new Error("Unsupported case");
    }
  }

  function createResolvePathFn(entityType, objectMap) {
    return function (relativePath) {
      return resolveTarget(objectMap, entityType, relativePath);
    };
  }

  function resolveNavigationProperties(parserOutput, objectMap) {
    parserOutput.schema.entityTypes.forEach(function (entityType) {
      entityType.navigationProperties.forEach(function (navProp) {
        if (navProp.targetTypeName) {
          navProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = parserOutput.schema.associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              navProp.targetType = objectMap[associationEnd.type];
            }
          }
        }
      });
      entityType.resolvePath = createResolvePathFn(entityType, objectMap);
    });
  }

  function convertTypes(parserOutput) {
    var objectMap = buildObjectMap(parserOutput);
    resolveNavigationProperties(parserOutput, objectMap);
    var toResolve = [];
    var unresolvedAnnotations = [];
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = parserOutput.unalias(annotationList.target);
        var currentTarget = objectMap[currentTargetName];

        if (!currentTarget) {
          if (currentTargetName.indexOf("@") !== -1) {
            unresolvedAnnotations.push(annotationList);
          }
        } else {
          if (!currentTarget.annotations) {
            currentTarget.annotations = {};
          }

          annotationList.annotations.forEach(function (annotation) {
            var _annotation$term$spli = annotation.term.split("."),
                _annotation$term$spli2 = _slicedToArray(_annotation$term$spli, 2),
                vocAlias = _annotation$term$spli2[0],
                vocTerm = _annotation$term$spli2[1];

            if (!currentTarget.annotations[vocAlias]) {
              currentTarget.annotations[vocAlias] = {};
            }

            if (!currentTarget.annotations._annotations) {
              currentTarget.annotations._annotations = {};
            }

            var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
            currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve);

            if (typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
              currentTarget.annotations[vocAlias][vocTermWithQualifier].term = parserOutput.unalias("".concat(vocAlias, ".").concat(vocTerm));
              currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
            }

            currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
            objectMap["".concat(currentTargetName, "@").concat(parserOutput.unalias(vocAlias + "." + vocTermWithQualifier))] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          });
        }
      });
    });
    unresolvedAnnotations.forEach(function (annotationList) {
      var currentTargetName = parserOutput.unalias(annotationList.target);

      var _currentTargetName$sp = currentTargetName.split("@"),
          _currentTargetName$sp2 = _slicedToArray(_currentTargetName$sp, 2),
          baseObj = _currentTargetName$sp2[0],
          annotationPart = _currentTargetName$sp2[1];

      var targetSplit = annotationPart.split("/");
      baseObj = baseObj + "@" + targetSplit[0];
      var currentTarget = targetSplit.slice(1).reduce(function (currentObj, path) {
        if (!currentObj) {
          return null;
        }

        return currentObj[path];
      }, objectMap[baseObj]);

      if (!currentTarget) {// console.log("Missing target again " + currentTargetName);
      } else {
        if (!currentTarget.annotations) {
          currentTarget.annotations = {};
        }

        annotationList.annotations.forEach(function (annotation) {
          var _annotation$term$spli3 = annotation.term.split("."),
              _annotation$term$spli4 = _slicedToArray(_annotation$term$spli3, 2),
              vocAlias = _annotation$term$spli4[0],
              vocTerm = _annotation$term$spli4[1];

          if (!currentTarget.annotations[vocAlias]) {
            currentTarget.annotations[vocAlias] = {};
          }

          if (!currentTarget.annotations._annotations) {
            currentTarget.annotations._annotations = {};
          }

          var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
          currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve);

          if (typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].term = parserOutput.unalias("".concat(vocAlias, ".").concat(vocTerm));
            currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
          }

          currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          objectMap["".concat(currentTargetName, "@").concat(parserOutput.unalias(vocAlias + "." + vocTermWithQualifier))] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
        });
      }
    });
    toResolve.forEach(function (resolveable) {
      resolveable.$target = objectMap[resolveable.$target];
    });
    return parserOutput;
  }

  var AnnotationConverter = {
    convertTypes: convertTypes
  };
  return AnnotationConverter;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbW1vbi9Bbm5vdGF0aW9uQ29udmVydGVyLnRzIl0sIm5hbWVzIjpbIlBhdGgiLCJwYXRoRXhwcmVzc2lvbiIsInRhcmdldE5hbWUiLCJwYXRoIiwidHlwZSIsIiR0YXJnZXQiLCJidWlsZE9iamVjdE1hcCIsInBhcnNlck91dHB1dCIsIm9iamVjdE1hcCIsInNjaGVtYSIsImVudGl0eUNvbnRhaW5lciIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImVudGl0eVNldHMiLCJmb3JFYWNoIiwiZW50aXR5U2V0IiwiYWN0aW9ucyIsImFjdGlvbiIsInBhcmFtZXRlcnMiLCJwYXJhbWV0ZXIiLCJlbnRpdHlUeXBlcyIsImVudGl0eVR5cGUiLCJlbnRpdHlQcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsIm5hdlByb3BlcnR5IiwiT2JqZWN0Iiwia2V5cyIsImFubm90YXRpb25zIiwiYW5ub3RhdGlvblNvdXJjZSIsImFubm90YXRpb25MaXN0IiwiY3VycmVudFRhcmdldE5hbWUiLCJ1bmFsaWFzIiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsImFubm90YXRpb25GUU4iLCJ0ZXJtIiwicXVhbGlmaWVyIiwicmVzb2x2ZVRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJwYXRoT25seSIsInBhdGhTcGxpdCIsInNwbGl0IiwiY3VycmVudFBhdGgiLCJyZWR1Y2UiLCJjdXJyZW50VmFsdWUiLCJwYXRoUGFydCIsIl90eXBlIiwidGFyZ2V0VHlwZU5hbWUiLCJ0YXJnZXRUeXBlIiwic3Vic3RyIiwibGFzdEluZGV4T2YiLCJpc0JvdW5kIiwic291cmNlVHlwZSIsImlzRW50aXR5U2V0IiwicGFyc2VWYWx1ZSIsInByb3BlcnR5VmFsdWUiLCJ0b1Jlc29sdmUiLCJ1bmRlZmluZWQiLCJTdHJpbmciLCJJbnQiLCJCb29sIiwiRGVjaW1hbCIsIkRhdGUiLCJFbnVtTWVtYmVyIiwidmFsdWUiLCJQcm9wZXJ0eVBhdGgiLCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiYW5ub3RhdGlvblRhcmdldCIsIkFubm90YXRpb25QYXRoIiwiYW5ub3RhdGlvblBhdGgiLCJwdXNoIiwicGFyc2VSZWNvcmQiLCJSZWNvcmQiLCJwYXJzZUNvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwicmVjb3JkRGVmaW5pdGlvbiIsImFubm90YXRpb25UZXJtIiwiJFR5cGUiLCJhbm5vdGF0aW9uQ29udGVudCIsInByb3BlcnR5VmFsdWVzIiwibmFtZSIsImFzc2lnbiIsImNvbGxlY3Rpb25EZWZpbml0aW9uIiwibWFwIiwicHJvcGVydHlQYXRoIiwicGF0aFZhbHVlIiwiYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50IiwibmF2UHJvcGVydHlQYXRoIiwic3RyaW5nVmFsdWUiLCJsZW5ndGgiLCJFcnJvciIsImNvbnZlcnRBbm5vdGF0aW9uIiwicmVjb3JkIiwiaXNDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNyZWF0ZVJlc29sdmVQYXRoRm4iLCJyZWxhdGl2ZVBhdGgiLCJyZXNvbHZlTmF2aWdhdGlvblByb3BlcnRpZXMiLCJuYXZQcm9wIiwicmVsYXRpb25zaGlwIiwidGFyZ2V0QXNzb2NpYXRpb24iLCJhc3NvY2lhdGlvbnMiLCJmaW5kIiwiYXNzb2NpYXRpb24iLCJhc3NvY2lhdGlvbkVuZCIsImVuZCIsInJvbGUiLCJ0b1JvbGUiLCJyZXNvbHZlUGF0aCIsImNvbnZlcnRUeXBlcyIsInVucmVzb2x2ZWRBbm5vdGF0aW9ucyIsImluZGV4T2YiLCJ2b2NBbGlhcyIsInZvY1Rlcm0iLCJfYW5ub3RhdGlvbnMiLCJ2b2NUZXJtV2l0aFF1YWxpZmllciIsImJhc2VPYmoiLCJhbm5vdGF0aW9uUGFydCIsInRhcmdldFNwbGl0Iiwic2xpY2UiLCJjdXJyZW50T2JqIiwicmVzb2x2ZWFibGUiLCJBbm5vdGF0aW9uQ29udmVydGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztNQWNNQSxJLEdBS0wsY0FBWUMsY0FBWixFQUE0Q0MsVUFBNUMsRUFBZ0U7QUFBQTs7QUFDL0QsU0FBS0MsSUFBTCxHQUFZRixjQUFjLENBQUNELElBQTNCO0FBQ0EsU0FBS0ksSUFBTCxHQUFZLE1BQVo7QUFDQSxTQUFLQyxPQUFMLEdBQWVILFVBQWY7QUFDQSxHOztBQUdGLFdBQVNJLGNBQVQsQ0FBd0JDLFlBQXhCLEVBQXlFO0FBQ3hFLFFBQU1DLFNBQWMsR0FBRyxFQUF2Qjs7QUFDQSxRQUFJRCxZQUFZLENBQUNFLE1BQWIsQ0FBb0JDLGVBQXBCLElBQXVDSCxZQUFZLENBQUNFLE1BQWIsQ0FBb0JDLGVBQXBCLENBQW9DQyxrQkFBL0UsRUFBbUc7QUFDbEdILE1BQUFBLFNBQVMsQ0FBQ0QsWUFBWSxDQUFDRSxNQUFiLENBQW9CQyxlQUFwQixDQUFvQ0Msa0JBQXJDLENBQVQsR0FBb0VKLFlBQVksQ0FBQ0UsTUFBYixDQUFvQkMsZUFBeEY7QUFDQTs7QUFDREgsSUFBQUEsWUFBWSxDQUFDRSxNQUFiLENBQW9CRyxVQUFwQixDQUErQkMsT0FBL0IsQ0FBdUMsVUFBQUMsU0FBUyxFQUFJO0FBQ25ETixNQUFBQSxTQUFTLENBQUNNLFNBQVMsQ0FBQ0gsa0JBQVgsQ0FBVCxHQUEwQ0csU0FBMUM7QUFDQSxLQUZEO0FBR0FQLElBQUFBLFlBQVksQ0FBQ0UsTUFBYixDQUFvQk0sT0FBcEIsQ0FBNEJGLE9BQTVCLENBQW9DLFVBQUFHLE1BQU0sRUFBSTtBQUM3Q1IsTUFBQUEsU0FBUyxDQUFDUSxNQUFNLENBQUNMLGtCQUFSLENBQVQsR0FBdUNLLE1BQXZDO0FBQ0FBLE1BQUFBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkosT0FBbEIsQ0FBMEIsVUFBQUssU0FBUyxFQUFJO0FBQ3RDVixRQUFBQSxTQUFTLENBQUNVLFNBQVMsQ0FBQ1Asa0JBQVgsQ0FBVCxHQUEwQ08sU0FBMUM7QUFDQSxPQUZEO0FBR0EsS0FMRDtBQU1BWCxJQUFBQSxZQUFZLENBQUNFLE1BQWIsQ0FBb0JVLFdBQXBCLENBQWdDTixPQUFoQyxDQUF3QyxVQUFBTyxVQUFVLEVBQUk7QUFDckRaLE1BQUFBLFNBQVMsQ0FBQ1ksVUFBVSxDQUFDVCxrQkFBWixDQUFULEdBQTJDUyxVQUEzQztBQUNBQSxNQUFBQSxVQUFVLENBQUNDLGdCQUFYLENBQTRCUixPQUE1QixDQUFvQyxVQUFBUyxRQUFRLEVBQUk7QUFDL0NkLFFBQUFBLFNBQVMsQ0FBQ2MsUUFBUSxDQUFDWCxrQkFBVixDQUFULEdBQXlDVyxRQUF6QztBQUNBLE9BRkQ7QUFHQUYsTUFBQUEsVUFBVSxDQUFDRyxvQkFBWCxDQUFnQ1YsT0FBaEMsQ0FBd0MsVUFBQVcsV0FBVyxFQUFJO0FBQ3REaEIsUUFBQUEsU0FBUyxDQUFDZ0IsV0FBVyxDQUFDYixrQkFBYixDQUFULEdBQTRDYSxXQUE1QztBQUNBLE9BRkQ7QUFHQSxLQVJEO0FBU0FDLElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZbkIsWUFBWSxDQUFDRSxNQUFiLENBQW9Ca0IsV0FBaEMsRUFBNkNkLE9BQTdDLENBQXFELFVBQUFlLGdCQUFnQixFQUFJO0FBQ3hFckIsTUFBQUEsWUFBWSxDQUFDRSxNQUFiLENBQW9Ca0IsV0FBcEIsQ0FBZ0NDLGdCQUFoQyxFQUFrRGYsT0FBbEQsQ0FBMEQsVUFBQWdCLGNBQWMsRUFBSTtBQUMzRSxZQUFNQyxpQkFBaUIsR0FBR3ZCLFlBQVksQ0FBQ3dCLE9BQWIsQ0FBcUJGLGNBQWMsQ0FBQ0csTUFBcEMsQ0FBMUI7QUFDQUgsUUFBQUEsY0FBYyxDQUFDRixXQUFmLENBQTJCZCxPQUEzQixDQUFtQyxVQUFBb0IsVUFBVSxFQUFJO0FBQ2hELGNBQUlDLGFBQWEsYUFBTUosaUJBQU4sZUFBNEJ2QixZQUFZLENBQUN3QixPQUFiLENBQXFCRSxVQUFVLENBQUNFLElBQWhDLENBQTVCLENBQWpCOztBQUNBLGNBQUlGLFVBQVUsQ0FBQ0csU0FBZixFQUEwQjtBQUN6QkYsWUFBQUEsYUFBYSxlQUFRRCxVQUFVLENBQUNHLFNBQW5CLENBQWI7QUFDQTs7QUFDRDVCLFVBQUFBLFNBQVMsQ0FBQzBCLGFBQUQsQ0FBVCxHQUEyQkQsVUFBM0I7QUFDQUEsVUFBQUEsVUFBVSxDQUFDdEIsa0JBQVgsR0FBZ0N1QixhQUFoQztBQUNBLFNBUEQ7QUFRQSxPQVZEO0FBV0EsS0FaRDtBQWFBLFdBQU8xQixTQUFQO0FBQ0E7O0FBRUQsV0FBUzZCLGFBQVQsQ0FBdUI3QixTQUF2QixFQUF1QzhCLGFBQXZDLEVBQTJEbkMsSUFBM0QsRUFBb0c7QUFBQSxRQUEzQm9DLFFBQTJCLHVFQUFQLEtBQU87QUFDbkdwQyxJQUFBQSxJQUFJLEdBQUdtQyxhQUFhLENBQUMzQixrQkFBZCxHQUFtQyxHQUFuQyxHQUF5Q1IsSUFBaEQ7QUFDQSxRQUFNcUMsU0FBUyxHQUFHckMsSUFBSSxDQUFDc0MsS0FBTCxDQUFXLEdBQVgsQ0FBbEI7QUFDQSxRQUFJQyxXQUFXLEdBQUd2QyxJQUFsQjtBQUNBLFFBQU02QixNQUFNLEdBQUdRLFNBQVMsQ0FBQ0csTUFBVixDQUFpQixVQUFDQyxZQUFELEVBQW9CQyxRQUFwQixFQUFpQztBQUNoRSxVQUFJLENBQUNELFlBQUwsRUFBbUI7QUFDbEJGLFFBQUFBLFdBQVcsR0FBR0csUUFBZDtBQUNBLE9BRkQsTUFFTyxJQUFJRCxZQUFZLENBQUNFLEtBQWIsS0FBdUIsV0FBdkIsSUFBc0NGLFlBQVksQ0FBQ3hCLFVBQXZELEVBQW1FO0FBQ3pFc0IsUUFBQUEsV0FBVyxHQUFHRSxZQUFZLENBQUN4QixVQUFiLEdBQTBCLEdBQTFCLEdBQWdDeUIsUUFBOUM7QUFDQSxPQUZNLE1BRUEsSUFBSUQsWUFBWSxDQUFDRSxLQUFiLEtBQXVCLG9CQUF2QixJQUErQ0YsWUFBWSxDQUFDRyxjQUFoRSxFQUFnRjtBQUN0RkwsUUFBQUEsV0FBVyxHQUFHRSxZQUFZLENBQUNHLGNBQWIsR0FBOEIsR0FBOUIsR0FBb0NGLFFBQWxEO0FBQ0EsT0FGTSxNQUVBLElBQUlELFlBQVksQ0FBQ0UsS0FBYixLQUF1QixvQkFBdkIsSUFBK0NGLFlBQVksQ0FBQ0ksVUFBaEUsRUFBNEU7QUFDbEZOLFFBQUFBLFdBQVcsR0FBR0UsWUFBWSxDQUFDSSxVQUFiLENBQXdCckMsa0JBQXhCLEdBQTZDLEdBQTdDLEdBQW1Ea0MsUUFBakU7QUFDQSxPQUZNLE1BRUEsSUFBSUQsWUFBWSxDQUFDRSxLQUFiLEtBQXVCLFVBQTNCLEVBQXVDO0FBQzdDSixRQUFBQSxXQUFXLEdBQ1ZKLGFBQWEsQ0FBQzNCLGtCQUFkLENBQWlDc0MsTUFBakMsQ0FBd0MsQ0FBeEMsRUFBMkNYLGFBQWEsQ0FBQzNCLGtCQUFkLENBQWlDdUMsV0FBakMsQ0FBNkMsR0FBN0MsQ0FBM0MsSUFDQSxHQURBLEdBRUFMLFFBSEQ7QUFJQSxPQUxNLE1BS0EsSUFBSUQsWUFBWSxDQUFDRSxLQUFiLEtBQXVCLFFBQXZCLElBQW1DRixZQUFZLENBQUNPLE9BQXBELEVBQTZEO0FBQ25FVCxRQUFBQSxXQUFXLEdBQUdFLFlBQVksQ0FBQ2pDLGtCQUFiLEdBQWtDLEdBQWxDLEdBQXdDa0MsUUFBdEQ7O0FBQ0EsWUFBSSxDQUFDckMsU0FBUyxDQUFDa0MsV0FBRCxDQUFkLEVBQTZCO0FBQzVCQSxVQUFBQSxXQUFXLEdBQUdFLFlBQVksQ0FBQ1EsVUFBYixHQUEwQixHQUExQixHQUFnQ1AsUUFBOUM7QUFDQTtBQUNELE9BTE0sTUFLQSxJQUFJRCxZQUFZLENBQUNFLEtBQWIsS0FBdUIsaUJBQXZCLElBQTRDRixZQUFZLENBQUNTLFdBQTdELEVBQTBFO0FBQ2hGWCxRQUFBQSxXQUFXLEdBQUdFLFlBQVksQ0FBQ3hDLElBQWIsR0FBb0IsR0FBcEIsR0FBMEJ5QyxRQUF4QztBQUNBLE9BRk0sTUFFQSxJQUFJRCxZQUFZLENBQUNFLEtBQWIsS0FBdUIsaUJBQXZCLElBQTRDLENBQUNGLFlBQVksQ0FBQ1MsV0FBOUQsRUFBMkU7QUFDakZYLFFBQUFBLFdBQVcsR0FDVkosYUFBYSxDQUFDM0Isa0JBQWQsQ0FBaUNzQyxNQUFqQyxDQUF3QyxDQUF4QyxFQUEyQ1gsYUFBYSxDQUFDM0Isa0JBQWQsQ0FBaUN1QyxXQUFqQyxDQUE2QyxHQUE3QyxDQUEzQyxJQUNBLEdBREEsR0FFQUwsUUFIRDs7QUFJQSxZQUFJLENBQUNyQyxTQUFTLENBQUNrQyxXQUFELENBQWQsRUFBNkI7QUFDNUJBLFVBQUFBLFdBQVcsR0FDVGxDLFNBQVMsQ0FDVDhCLGFBQWEsQ0FBQzNCLGtCQUFkLENBQWlDc0MsTUFBakMsQ0FBd0MsQ0FBeEMsRUFBMkNYLGFBQWEsQ0FBQzNCLGtCQUFkLENBQWlDdUMsV0FBakMsQ0FBNkMsR0FBN0MsQ0FBM0MsQ0FEUyxDQUFWLENBRWFFLFVBRmIsR0FHQSxHQUhBLEdBSUFQLFFBTEQ7QUFNQTtBQUNELE9BYk0sTUFhQTtBQUNOSCxRQUFBQSxXQUFXLEdBQUdFLFlBQVksQ0FBQ2pDLGtCQUFiLEdBQWtDLEdBQWxDLEdBQXdDa0MsUUFBdEQ7QUFDQTs7QUFDRCxhQUFPckMsU0FBUyxDQUFDa0MsV0FBRCxDQUFoQjtBQUNBLEtBdENjLEVBc0NaLElBdENZLENBQWY7O0FBdUNBLFFBQUksQ0FBQ1YsTUFBTCxFQUFhLENBQ1o7QUFDQTs7QUFDRCxRQUFJTyxRQUFKLEVBQWM7QUFDYixhQUFPRyxXQUFQO0FBQ0E7O0FBQ0QsV0FBT1YsTUFBUDtBQUNBOztBQUVELFdBQVNzQixVQUFULENBQ0NDLGFBREQsRUFFQ2hELFlBRkQsRUFHQytCLGFBSEQsRUFJQzlCLFNBSkQsRUFLQ2dELFNBTEQsRUFNRTtBQUNELFFBQUlELGFBQWEsS0FBS0UsU0FBdEIsRUFBaUM7QUFDaEMsYUFBT0EsU0FBUDtBQUNBOztBQUNELFlBQVFGLGFBQWEsQ0FBQ25ELElBQXRCO0FBQ0MsV0FBSyxRQUFMO0FBQ0MsZUFBT21ELGFBQWEsQ0FBQ0csTUFBckI7O0FBQ0QsV0FBSyxLQUFMO0FBQ0MsZUFBT0gsYUFBYSxDQUFDSSxHQUFyQjs7QUFDRCxXQUFLLE1BQUw7QUFDQyxlQUFPSixhQUFhLENBQUNLLElBQXJCOztBQUNELFdBQUssU0FBTDtBQUNDLGVBQU9MLGFBQWEsQ0FBQ00sT0FBckI7O0FBQ0QsV0FBSyxNQUFMO0FBQ0MsZUFBT04sYUFBYSxDQUFDTyxJQUFyQjs7QUFDRCxXQUFLLFlBQUw7QUFDQyxlQUFPUCxhQUFhLENBQUNRLFVBQXJCOztBQUNELFdBQUssY0FBTDtBQUNDLGVBQU87QUFDTjNELFVBQUFBLElBQUksRUFBRSxjQURBO0FBRU40RCxVQUFBQSxLQUFLLEVBQUVULGFBQWEsQ0FBQ1UsWUFGZjtBQUdONUQsVUFBQUEsT0FBTyxFQUFFZ0MsYUFBYSxDQUFDN0IsU0FBRCxFQUFZOEIsYUFBWixFQUEyQmlCLGFBQWEsQ0FBQ1UsWUFBekM7QUFIaEIsU0FBUDs7QUFLRCxXQUFLLHdCQUFMO0FBQ0MsZUFBTztBQUNON0QsVUFBQUEsSUFBSSxFQUFFLHdCQURBO0FBRU40RCxVQUFBQSxLQUFLLEVBQUVULGFBQWEsQ0FBQ1csc0JBRmY7QUFHTjdELFVBQUFBLE9BQU8sRUFBRWdDLGFBQWEsQ0FBQzdCLFNBQUQsRUFBWThCLGFBQVosRUFBMkJpQixhQUFhLENBQUNXLHNCQUF6QztBQUhoQixTQUFQOztBQUtELFdBQUssZ0JBQUw7QUFDQyxZQUFNQyxnQkFBZ0IsR0FBRzlCLGFBQWEsQ0FDckM3QixTQURxQyxFQUVyQzhCLGFBRnFDLEVBR3JDL0IsWUFBWSxDQUFDd0IsT0FBYixDQUFxQndCLGFBQWEsQ0FBQ2EsY0FBbkMsQ0FIcUMsRUFJckMsSUFKcUMsQ0FBdEM7QUFNQSxZQUFNQyxjQUFjLEdBQUc7QUFDdEJqRSxVQUFBQSxJQUFJLEVBQUUsZ0JBRGdCO0FBRXRCNEQsVUFBQUEsS0FBSyxFQUFFVCxhQUFhLENBQUNhLGNBRkM7QUFHdEIvRCxVQUFBQSxPQUFPLEVBQUU4RDtBQUhhLFNBQXZCO0FBS0FYLFFBQUFBLFNBQVMsQ0FBQ2MsSUFBVixDQUFlRCxjQUFmO0FBQ0EsZUFBT0EsY0FBUDs7QUFDRCxXQUFLLE1BQUw7QUFDQyxZQUFNaEUsT0FBTyxHQUFHZ0MsYUFBYSxDQUFDN0IsU0FBRCxFQUFZOEIsYUFBWixFQUEyQmlCLGFBQWEsQ0FBQ3ZELElBQXpDLEVBQStDLElBQS9DLENBQTdCO0FBQ0EsWUFBTUcsSUFBSSxHQUFHLElBQUlILElBQUosQ0FBU3VELGFBQVQsRUFBd0JsRCxPQUF4QixDQUFiO0FBQ0FtRCxRQUFBQSxTQUFTLENBQUNjLElBQVYsQ0FBZW5FLElBQWY7QUFDQSxlQUFPQSxJQUFQOztBQUNELFdBQUssUUFBTDtBQUNDLGVBQU9vRSxXQUFXLENBQUNoQixhQUFhLENBQUNpQixNQUFmLEVBQXVCakUsWUFBdkIsRUFBcUMrQixhQUFyQyxFQUFvRDlCLFNBQXBELEVBQStEZ0QsU0FBL0QsQ0FBbEI7O0FBQ0QsV0FBSyxZQUFMO0FBQ0MsZUFBT2lCLGVBQWUsQ0FBQ2xCLGFBQWEsQ0FBQ21CLFVBQWYsRUFBMkJuRSxZQUEzQixFQUF5QytCLGFBQXpDLEVBQXdEOUIsU0FBeEQsRUFBbUVnRCxTQUFuRSxDQUF0Qjs7QUFDRCxXQUFLLE9BQUw7QUFDQyxlQUFPRCxhQUFQO0FBakRGO0FBbURBOztBQUVELFdBQVNnQixXQUFULENBQ0NJLGdCQURELEVBRUNwRSxZQUZELEVBR0MrQixhQUhELEVBSUM5QixTQUpELEVBS0NnRCxTQUxELEVBTUU7QUFDRCxRQUFNb0IsY0FBbUIsR0FBRztBQUMzQkMsTUFBQUEsS0FBSyxFQUFFdEUsWUFBWSxDQUFDd0IsT0FBYixDQUFxQjRDLGdCQUFnQixDQUFDdkUsSUFBdEM7QUFEb0IsS0FBNUI7QUFHQSxRQUFNMEUsaUJBQXNCLEdBQUcsRUFBL0I7QUFDQUgsSUFBQUEsZ0JBQWdCLENBQUNJLGNBQWpCLENBQWdDbEUsT0FBaEMsQ0FBd0MsVUFBQzBDLGFBQUQsRUFBa0M7QUFDekV1QixNQUFBQSxpQkFBaUIsQ0FBQ3ZCLGFBQWEsQ0FBQ3lCLElBQWYsQ0FBakIsR0FBd0MxQixVQUFVLENBQ2pEQyxhQUFhLENBQUNTLEtBRG1DLEVBRWpEekQsWUFGaUQsRUFHakQrQixhQUhpRCxFQUlqRDlCLFNBSmlELEVBS2pEZ0QsU0FMaUQsQ0FBbEQ7QUFPQSxLQVJEO0FBU0EsV0FBTy9CLE1BQU0sQ0FBQ3dELE1BQVAsQ0FBY0wsY0FBZCxFQUE4QkUsaUJBQTlCLENBQVA7QUFDQTs7QUFFRCxXQUFTTCxlQUFULENBQ0NTLG9CQURELEVBRUMzRSxZQUZELEVBR0MrQixhQUhELEVBSUM5QixTQUpELEVBS0NnRCxTQUxELEVBTUU7QUFDRCxZQUFTMEIsb0JBQUQsQ0FBOEI5RSxJQUF0QztBQUNDLFdBQUssY0FBTDtBQUNDLGVBQU84RSxvQkFBb0IsQ0FBQ0MsR0FBckIsQ0FBeUIsVUFBQUMsWUFBWSxFQUFJO0FBQy9DLGlCQUFPO0FBQ05oRixZQUFBQSxJQUFJLEVBQUUsY0FEQTtBQUVONEQsWUFBQUEsS0FBSyxFQUFFb0IsWUFBWSxDQUFDbkIsWUFGZDtBQUdONUQsWUFBQUEsT0FBTyxFQUFFZ0MsYUFBYSxDQUFDN0IsU0FBRCxFQUFZOEIsYUFBWixFQUEyQjhDLFlBQVksQ0FBQ25CLFlBQXhDO0FBSGhCLFdBQVA7QUFLQSxTQU5NLENBQVA7O0FBT0QsV0FBSyxNQUFMO0FBQ0MsZUFBT2lCLG9CQUFvQixDQUFDQyxHQUFyQixDQUF5QixVQUFBRSxTQUFTLEVBQUk7QUFDNUMsY0FBTWhGLE9BQU8sR0FBR2dDLGFBQWEsQ0FBQzdCLFNBQUQsRUFBWThCLGFBQVosRUFBMkIrQyxTQUFTLENBQUNyRixJQUFyQyxFQUEyQyxJQUEzQyxDQUE3QjtBQUNBLGNBQU1HLElBQUksR0FBRyxJQUFJSCxJQUFKLENBQVNxRixTQUFULEVBQW9CaEYsT0FBcEIsQ0FBYjtBQUNBbUQsVUFBQUEsU0FBUyxDQUFDYyxJQUFWLENBQWVuRSxJQUFmO0FBQ0EsaUJBQU9BLElBQVA7QUFDQSxTQUxNLENBQVA7O0FBTUQsV0FBSyxnQkFBTDtBQUNDLGVBQU8rRSxvQkFBb0IsQ0FBQ0MsR0FBckIsQ0FBeUIsVUFBQWQsY0FBYyxFQUFJO0FBQ2pELGNBQU1GLGdCQUFnQixHQUFHOUIsYUFBYSxDQUFDN0IsU0FBRCxFQUFZOEIsYUFBWixFQUEyQitCLGNBQWMsQ0FBQ0QsY0FBMUMsRUFBMEQsSUFBMUQsQ0FBdEM7QUFDQSxjQUFNa0IsMkJBQTJCLEdBQUc7QUFDbkNsRixZQUFBQSxJQUFJLEVBQUUsZ0JBRDZCO0FBRW5DNEQsWUFBQUEsS0FBSyxFQUFFSyxjQUFjLENBQUNELGNBRmE7QUFHbkMvRCxZQUFBQSxPQUFPLEVBQUU4RDtBQUgwQixXQUFwQztBQUtBWCxVQUFBQSxTQUFTLENBQUNjLElBQVYsQ0FBZWdCLDJCQUFmO0FBQ0EsaUJBQU9BLDJCQUFQO0FBQ0EsU0FUTSxDQUFQOztBQVVELFdBQUssd0JBQUw7QUFDQyxlQUFPSixvQkFBb0IsQ0FBQ0MsR0FBckIsQ0FBeUIsVUFBQUksZUFBZSxFQUFJO0FBQ2xELGlCQUFPO0FBQ05uRixZQUFBQSxJQUFJLEVBQUUsd0JBREE7QUFFTjRELFlBQUFBLEtBQUssRUFBRXVCLGVBQWUsQ0FBQ3JCLHNCQUZqQjtBQUdON0QsWUFBQUEsT0FBTyxFQUFFZ0MsYUFBYSxDQUFDN0IsU0FBRCxFQUFZOEIsYUFBWixFQUEyQmlELGVBQWUsQ0FBQ3JCLHNCQUEzQztBQUhoQixXQUFQO0FBS0EsU0FOTSxDQUFQOztBQU9ELFdBQUssUUFBTDtBQUNDLGVBQU9nQixvQkFBb0IsQ0FBQ0MsR0FBckIsQ0FBeUIsVUFBQVIsZ0JBQWdCLEVBQUk7QUFDbkQsaUJBQU9KLFdBQVcsQ0FBQ0ksZ0JBQUQsRUFBbUJwRSxZQUFuQixFQUFpQytCLGFBQWpDLEVBQWdEOUIsU0FBaEQsRUFBMkRnRCxTQUEzRCxDQUFsQjtBQUNBLFNBRk0sQ0FBUDs7QUFHRCxXQUFLLFFBQUw7QUFDQyxlQUFPMEIsb0JBQW9CLENBQUNDLEdBQXJCLENBQXlCLFVBQUFLLFdBQVcsRUFBSTtBQUM5QyxpQkFBT0EsV0FBUDtBQUNBLFNBRk0sQ0FBUDs7QUFHRDtBQUNDLFlBQUlOLG9CQUFvQixDQUFDTyxNQUFyQixLQUFnQyxDQUFwQyxFQUF1QztBQUN0QyxpQkFBTyxFQUFQO0FBQ0E7O0FBQ0QsY0FBTSxJQUFJQyxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQS9DRjtBQWlEQTs7QUFNRCxXQUFTQyxpQkFBVCxDQUNDMUQsVUFERCxFQUVDMUIsWUFGRCxFQUdDK0IsYUFIRCxFQUlDOUIsU0FKRCxFQUtDZ0QsU0FMRCxFQU1PO0FBQ04sUUFBSXZCLFVBQVUsQ0FBQzJELE1BQWYsRUFBdUI7QUFDdEIsVUFBTWhCLGNBQW1CLEdBQUc7QUFDM0JDLFFBQUFBLEtBQUssRUFBRXRFLFlBQVksQ0FBQ3dCLE9BQWIsQ0FBcUJFLFVBQVUsQ0FBQzJELE1BQVgsQ0FBa0J4RixJQUF2QyxDQURvQjtBQUUzQk8sUUFBQUEsa0JBQWtCLEVBQUVzQixVQUFVLENBQUN0QixrQkFGSjtBQUczQnlCLFFBQUFBLFNBQVMsRUFBRUgsVUFBVSxDQUFDRztBQUhLLE9BQTVCO0FBS0EsVUFBTTBDLGlCQUFzQixHQUFHLEVBQS9CO0FBQ0E3QyxNQUFBQSxVQUFVLENBQUMyRCxNQUFYLENBQWtCYixjQUFsQixDQUFpQ2xFLE9BQWpDLENBQXlDLFVBQUMwQyxhQUFELEVBQWtDO0FBQzFFdUIsUUFBQUEsaUJBQWlCLENBQUN2QixhQUFhLENBQUN5QixJQUFmLENBQWpCLEdBQXdDMUIsVUFBVSxDQUNqREMsYUFBYSxDQUFDUyxLQURtQyxFQUVqRHpELFlBRmlELEVBR2pEK0IsYUFIaUQsRUFJakQ5QixTQUppRCxFQUtqRGdELFNBTGlELENBQWxEO0FBT0EsT0FSRDtBQVNBLGFBQU8vQixNQUFNLENBQUN3RCxNQUFQLENBQWNMLGNBQWQsRUFBOEJFLGlCQUE5QixDQUFQO0FBQ0EsS0FqQkQsTUFpQk8sSUFBSSxDQUFDN0MsVUFBVSxDQUFDNEQsWUFBaEIsRUFBOEI7QUFDcEMsVUFBSTVELFVBQVUsQ0FBQytCLEtBQWYsRUFBc0I7QUFDckIsZUFBT1YsVUFBVSxDQUFDckIsVUFBVSxDQUFDK0IsS0FBWixFQUFtQnpELFlBQW5CLEVBQWlDK0IsYUFBakMsRUFBZ0Q5QixTQUFoRCxFQUEyRGdELFNBQTNELENBQWpCO0FBQ0EsT0FGRCxNQUVPO0FBQ04sZUFBTyxJQUFQO0FBQ0E7QUFDRCxLQU5NLE1BTUEsSUFBSXZCLFVBQVUsQ0FBQzZELFVBQWYsRUFBMkI7QUFDakMsVUFBTUEsVUFBZSxHQUFHckIsZUFBZSxDQUN0Q3hDLFVBQVUsQ0FBQzZELFVBRDJCLEVBRXRDdkYsWUFGc0MsRUFHdEMrQixhQUhzQyxFQUl0QzlCLFNBSnNDLEVBS3RDZ0QsU0FMc0MsQ0FBdkM7QUFPQXNDLE1BQUFBLFVBQVUsQ0FBQ25GLGtCQUFYLEdBQWdDc0IsVUFBVSxDQUFDdEIsa0JBQTNDO0FBQ0EsYUFBT21GLFVBQVA7QUFDQSxLQVZNLE1BVUE7QUFDTixZQUFNLElBQUlKLEtBQUosQ0FBVSxrQkFBVixDQUFOO0FBQ0E7QUFDRDs7QUFFRCxXQUFTSyxtQkFBVCxDQUE2QjNFLFVBQTdCLEVBQXFEWixTQUFyRCxFQUFxRjtBQUNwRixXQUFPLFVBQVN3RixZQUFULEVBQW9DO0FBQzFDLGFBQU8zRCxhQUFhLENBQUM3QixTQUFELEVBQVlZLFVBQVosRUFBd0I0RSxZQUF4QixDQUFwQjtBQUNBLEtBRkQ7QUFHQTs7QUFFRCxXQUFTQywyQkFBVCxDQUFxQzFGLFlBQXJDLEVBQWlFQyxTQUFqRSxFQUF1RztBQUN0R0QsSUFBQUEsWUFBWSxDQUFDRSxNQUFiLENBQW9CVSxXQUFwQixDQUFnQ04sT0FBaEMsQ0FBd0MsVUFBQU8sVUFBVSxFQUFJO0FBQ3JEQSxNQUFBQSxVQUFVLENBQUNHLG9CQUFYLENBQWdDVixPQUFoQyxDQUF3QyxVQUFBcUYsT0FBTyxFQUFJO0FBQ2xELFlBQUtBLE9BQUQsQ0FBa0NuRCxjQUF0QyxFQUFzRDtBQUNwRG1ELFVBQUFBLE9BQUQsQ0FBa0NsRCxVQUFsQyxHQUNDeEMsU0FBUyxDQUFFMEYsT0FBRCxDQUFrQ25ELGNBQW5DLENBRFY7QUFFQSxTQUhELE1BR08sSUFBS21ELE9BQUQsQ0FBa0NDLFlBQXRDLEVBQW9EO0FBQzFELGNBQU1DLGlCQUFpQixHQUFHN0YsWUFBWSxDQUFDRSxNQUFiLENBQW9CNEYsWUFBcEIsQ0FBaUNDLElBQWpDLENBQ3pCLFVBQUFDLFdBQVc7QUFBQSxtQkFBSUEsV0FBVyxDQUFDNUYsa0JBQVosS0FBb0N1RixPQUFELENBQWtDQyxZQUF6RTtBQUFBLFdBRGMsQ0FBMUI7O0FBR0EsY0FBSUMsaUJBQUosRUFBdUI7QUFDdEIsZ0JBQU1JLGNBQWMsR0FBR0osaUJBQWlCLENBQUNJLGNBQWxCLENBQWlDRixJQUFqQyxDQUN0QixVQUFBRyxHQUFHO0FBQUEscUJBQUlBLEdBQUcsQ0FBQ0MsSUFBSixLQUFjUixPQUFELENBQWtDUyxNQUFuRDtBQUFBLGFBRG1CLENBQXZCOztBQUdBLGdCQUFJSCxjQUFKLEVBQW9CO0FBQ2xCTixjQUFBQSxPQUFELENBQWtDbEQsVUFBbEMsR0FBK0N4QyxTQUFTLENBQUNnRyxjQUFjLENBQUNwRyxJQUFoQixDQUF4RDtBQUNBO0FBQ0Q7QUFDRDtBQUNELE9BakJEO0FBa0JBZ0IsTUFBQUEsVUFBVSxDQUFDd0YsV0FBWCxHQUF5QmIsbUJBQW1CLENBQUMzRSxVQUFELEVBQWFaLFNBQWIsQ0FBNUM7QUFDQSxLQXBCRDtBQXFCQTs7QUFFRCxXQUFTcUcsWUFBVCxDQUFzQnRHLFlBQXRCLEVBQWdFO0FBQy9ELFFBQU1DLFNBQVMsR0FBR0YsY0FBYyxDQUFDQyxZQUFELENBQWhDO0FBQ0EwRixJQUFBQSwyQkFBMkIsQ0FBQzFGLFlBQUQsRUFBZUMsU0FBZixDQUEzQjtBQUNBLFFBQU1nRCxTQUF3QixHQUFHLEVBQWpDO0FBQ0EsUUFBTXNELHFCQUF1QyxHQUFHLEVBQWhEO0FBQ0FyRixJQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWW5CLFlBQVksQ0FBQ0UsTUFBYixDQUFvQmtCLFdBQWhDLEVBQTZDZCxPQUE3QyxDQUFxRCxVQUFBZSxnQkFBZ0IsRUFBSTtBQUN4RXJCLE1BQUFBLFlBQVksQ0FBQ0UsTUFBYixDQUFvQmtCLFdBQXBCLENBQWdDQyxnQkFBaEMsRUFBa0RmLE9BQWxELENBQTBELFVBQUFnQixjQUFjLEVBQUk7QUFDM0UsWUFBTUMsaUJBQWlCLEdBQUd2QixZQUFZLENBQUN3QixPQUFiLENBQXFCRixjQUFjLENBQUNHLE1BQXBDLENBQTFCO0FBQ0EsWUFBTU0sYUFBYSxHQUFHOUIsU0FBUyxDQUFDc0IsaUJBQUQsQ0FBL0I7O0FBQ0EsWUFBSSxDQUFDUSxhQUFMLEVBQW9CO0FBQ25CLGNBQUlSLGlCQUFpQixDQUFDaUYsT0FBbEIsQ0FBMEIsR0FBMUIsTUFBbUMsQ0FBQyxDQUF4QyxFQUEyQztBQUMxQ0QsWUFBQUEscUJBQXFCLENBQUN4QyxJQUF0QixDQUEyQnpDLGNBQTNCO0FBQ0E7QUFDRCxTQUpELE1BSU87QUFDTixjQUFJLENBQUNTLGFBQWEsQ0FBQ1gsV0FBbkIsRUFBZ0M7QUFDL0JXLFlBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxHQUE0QixFQUE1QjtBQUNBOztBQUNERSxVQUFBQSxjQUFjLENBQUNGLFdBQWYsQ0FBMkJkLE9BQTNCLENBQW1DLFVBQUFvQixVQUFVLEVBQUk7QUFBQSx3Q0FDcEJBLFVBQVUsQ0FBQ0UsSUFBWCxDQUFnQk0sS0FBaEIsQ0FBc0IsR0FBdEIsQ0FEb0I7QUFBQTtBQUFBLGdCQUN6Q3VFLFFBRHlDO0FBQUEsZ0JBQy9CQyxPQUQrQjs7QUFFaEQsZ0JBQUksQ0FBQzNFLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLENBQUwsRUFBMEM7QUFDekMxRSxjQUFBQSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJxRixRQUExQixJQUFzQyxFQUF0QztBQUNBOztBQUNELGdCQUFJLENBQUMxRSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJ1RixZQUEvQixFQUE2QztBQUM1QzVFLGNBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnVGLFlBQTFCLEdBQXlDLEVBQXpDO0FBQ0E7O0FBRUQsZ0JBQU1DLG9CQUFvQixhQUFNRixPQUFOLFNBQWdCaEYsVUFBVSxDQUFDRyxTQUFYLGNBQTJCSCxVQUFVLENBQUNHLFNBQXRDLElBQW9ELEVBQXBFLENBQTFCO0FBQ0FFLFlBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsSUFBNER4QixpQkFBaUIsQ0FDNUUxRCxVQUQ0RSxFQUU1RTFCLFlBRjRFLEVBRzVFK0IsYUFINEUsRUFJNUU5QixTQUo0RSxFQUs1RWdELFNBTDRFLENBQTdFOztBQU9BLGdCQUFJLE9BQU9sQixhQUFhLENBQUNYLFdBQWQsQ0FBMEJxRixRQUExQixFQUFvQ0csb0JBQXBDLENBQVAsS0FBcUUsUUFBekUsRUFBbUY7QUFDbEY3RSxjQUFBQSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJxRixRQUExQixFQUFvQ0csb0JBQXBDLEVBQTBEaEYsSUFBMUQsR0FBaUU1QixZQUFZLENBQUN3QixPQUFiLFdBQzdEaUYsUUFENkQsY0FDakRDLE9BRGlELEVBQWpFO0FBR0EzRSxjQUFBQSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJxRixRQUExQixFQUFvQ0csb0JBQXBDLEVBQTBEL0UsU0FBMUQsR0FBc0VILFVBQVUsQ0FBQ0csU0FBakY7QUFDQTs7QUFDREUsWUFBQUEsYUFBYSxDQUFDWCxXQUFkLENBQTBCdUYsWUFBMUIsV0FBMENGLFFBQTFDLGNBQXNERyxvQkFBdEQsS0FDQzdFLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsQ0FERDtBQUVBM0csWUFBQUEsU0FBUyxXQUFJc0IsaUJBQUosY0FBeUJ2QixZQUFZLENBQUN3QixPQUFiLENBQXFCaUYsUUFBUSxHQUFHLEdBQVgsR0FBaUJHLG9CQUF0QyxDQUF6QixFQUFULEdBQ0M3RSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJxRixRQUExQixFQUFvQ0csb0JBQXBDLENBREQ7QUFFQSxXQTNCRDtBQTRCQTtBQUNELE9BeENEO0FBeUNBLEtBMUNEO0FBMkNBTCxJQUFBQSxxQkFBcUIsQ0FBQ2pHLE9BQXRCLENBQThCLFVBQUFnQixjQUFjLEVBQUk7QUFDL0MsVUFBTUMsaUJBQWlCLEdBQUd2QixZQUFZLENBQUN3QixPQUFiLENBQXFCRixjQUFjLENBQUNHLE1BQXBDLENBQTFCOztBQUQrQyxrQ0FFZkYsaUJBQWlCLENBQUNXLEtBQWxCLENBQXdCLEdBQXhCLENBRmU7QUFBQTtBQUFBLFVBRTFDMkUsT0FGMEM7QUFBQSxVQUVqQ0MsY0FGaUM7O0FBRy9DLFVBQU1DLFdBQVcsR0FBR0QsY0FBYyxDQUFDNUUsS0FBZixDQUFxQixHQUFyQixDQUFwQjtBQUNBMkUsTUFBQUEsT0FBTyxHQUFHQSxPQUFPLEdBQUcsR0FBVixHQUFnQkUsV0FBVyxDQUFDLENBQUQsQ0FBckM7QUFDQSxVQUFNaEYsYUFBYSxHQUFHZ0YsV0FBVyxDQUFDQyxLQUFaLENBQWtCLENBQWxCLEVBQXFCNUUsTUFBckIsQ0FBNEIsVUFBQzZFLFVBQUQsRUFBYXJILElBQWIsRUFBc0I7QUFDdkUsWUFBSSxDQUFDcUgsVUFBTCxFQUFpQjtBQUNoQixpQkFBTyxJQUFQO0FBQ0E7O0FBQ0QsZUFBT0EsVUFBVSxDQUFDckgsSUFBRCxDQUFqQjtBQUNBLE9BTHFCLEVBS25CSyxTQUFTLENBQUM0RyxPQUFELENBTFUsQ0FBdEI7O0FBTUEsVUFBSSxDQUFDOUUsYUFBTCxFQUFvQixDQUNuQjtBQUNBLE9BRkQsTUFFTztBQUNOLFlBQUksQ0FBQ0EsYUFBYSxDQUFDWCxXQUFuQixFQUFnQztBQUMvQlcsVUFBQUEsYUFBYSxDQUFDWCxXQUFkLEdBQTRCLEVBQTVCO0FBQ0E7O0FBQ0RFLFFBQUFBLGNBQWMsQ0FBQ0YsV0FBZixDQUEyQmQsT0FBM0IsQ0FBbUMsVUFBQW9CLFVBQVUsRUFBSTtBQUFBLHVDQUNwQkEsVUFBVSxDQUFDRSxJQUFYLENBQWdCTSxLQUFoQixDQUFzQixHQUF0QixDQURvQjtBQUFBO0FBQUEsY0FDekN1RSxRQUR5QztBQUFBLGNBQy9CQyxPQUQrQjs7QUFFaEQsY0FBSSxDQUFDM0UsYUFBYSxDQUFDWCxXQUFkLENBQTBCcUYsUUFBMUIsQ0FBTCxFQUEwQztBQUN6QzFFLFlBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLElBQXNDLEVBQXRDO0FBQ0E7O0FBQ0QsY0FBSSxDQUFDMUUsYUFBYSxDQUFDWCxXQUFkLENBQTBCdUYsWUFBL0IsRUFBNkM7QUFDNUM1RSxZQUFBQSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJ1RixZQUExQixHQUF5QyxFQUF6QztBQUNBOztBQUVELGNBQU1DLG9CQUFvQixhQUFNRixPQUFOLFNBQWdCaEYsVUFBVSxDQUFDRyxTQUFYLGNBQTJCSCxVQUFVLENBQUNHLFNBQXRDLElBQW9ELEVBQXBFLENBQTFCO0FBQ0FFLFVBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsSUFBNER4QixpQkFBaUIsQ0FDNUUxRCxVQUQ0RSxFQUU1RTFCLFlBRjRFLEVBRzVFK0IsYUFINEUsRUFJNUU5QixTQUo0RSxFQUs1RWdELFNBTDRFLENBQTdFOztBQU9BLGNBQUksT0FBT2xCLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsQ0FBUCxLQUFxRSxRQUF6RSxFQUFtRjtBQUNsRjdFLFlBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsRUFBMERoRixJQUExRCxHQUFpRTVCLFlBQVksQ0FBQ3dCLE9BQWIsV0FDN0RpRixRQUQ2RCxjQUNqREMsT0FEaUQsRUFBakU7QUFHQTNFLFlBQUFBLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsRUFBMEQvRSxTQUExRCxHQUFzRUgsVUFBVSxDQUFDRyxTQUFqRjtBQUNBOztBQUNERSxVQUFBQSxhQUFhLENBQUNYLFdBQWQsQ0FBMEJ1RixZQUExQixXQUEwQ0YsUUFBMUMsY0FBc0RHLG9CQUF0RCxLQUNDN0UsYUFBYSxDQUFDWCxXQUFkLENBQTBCcUYsUUFBMUIsRUFBb0NHLG9CQUFwQyxDQUREO0FBRUEzRyxVQUFBQSxTQUFTLFdBQUlzQixpQkFBSixjQUF5QnZCLFlBQVksQ0FBQ3dCLE9BQWIsQ0FBcUJpRixRQUFRLEdBQUcsR0FBWCxHQUFpQkcsb0JBQXRDLENBQXpCLEVBQVQsR0FDQzdFLGFBQWEsQ0FBQ1gsV0FBZCxDQUEwQnFGLFFBQTFCLEVBQW9DRyxvQkFBcEMsQ0FERDtBQUVBLFNBM0JEO0FBNEJBO0FBQ0QsS0E5Q0Q7QUErQ0EzRCxJQUFBQSxTQUFTLENBQUMzQyxPQUFWLENBQWtCLFVBQUE0RyxXQUFXLEVBQUk7QUFDaENBLE1BQUFBLFdBQVcsQ0FBQ3BILE9BQVosR0FBc0JHLFNBQVMsQ0FBQ2lILFdBQVcsQ0FBQ3BILE9BQWIsQ0FBL0I7QUFDQSxLQUZEO0FBSUEsV0FBT0UsWUFBUDtBQUNBOztBQUVELE1BQU1tSCxtQkFBbUIsR0FBRztBQUMzQmIsSUFBQUEsWUFBWSxFQUFaQTtBQUQyQixHQUE1QjtTQUllYSxtQiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWN0aW9uLFxuXHRBbm5vdGF0aW9uLFxuXHRBbm5vdGF0aW9uTGlzdCxcblx0QW5ub3RhdGlvblJlY29yZCxcblx0RW50aXR5VHlwZSxcblx0RXhwcmVzc2lvbixcblx0UGFyc2VyT3V0cHV0LFxuXHRQYXRoRXhwcmVzc2lvbixcblx0UHJvcGVydHlWYWx1ZSxcblx0VjJOYXZpZ2F0aW9uUHJvcGVydHksXG5cdFY0TmF2aWdhdGlvblByb3BlcnR5XG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuXG5jbGFzcyBQYXRoIHtcblx0cGF0aDogc3RyaW5nO1xuXHQkdGFyZ2V0OiBzdHJpbmc7XG5cdHR5cGU6IHN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihwYXRoRXhwcmVzc2lvbjogUGF0aEV4cHJlc3Npb24sIHRhcmdldE5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMucGF0aCA9IHBhdGhFeHByZXNzaW9uLlBhdGg7XG5cdFx0dGhpcy50eXBlID0gXCJQYXRoXCI7XG5cdFx0dGhpcy4kdGFyZ2V0ID0gdGFyZ2V0TmFtZTtcblx0fVxufVxuXG5mdW5jdGlvbiBidWlsZE9iamVjdE1hcChwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuXHRjb25zdCBvYmplY3RNYXA6IGFueSA9IHt9O1xuXHRpZiAocGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlDb250YWluZXIgJiYgcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlDb250YWluZXIuZnVsbHlRdWFsaWZpZWROYW1lKSB7XG5cdFx0b2JqZWN0TWFwW3BhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lcjtcblx0fVxuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVNldHMuZm9yRWFjaChlbnRpdHlTZXQgPT4ge1xuXHRcdG9iamVjdE1hcFtlbnRpdHlTZXQuZnVsbHlRdWFsaWZpZWROYW1lXSA9IGVudGl0eVNldDtcblx0fSk7XG5cdHBhcnNlck91dHB1dC5zY2hlbWEuYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG5cdFx0b2JqZWN0TWFwW2FjdGlvbi5mdWxseVF1YWxpZmllZE5hbWVdID0gYWN0aW9uO1xuXHRcdGFjdGlvbi5wYXJhbWV0ZXJzLmZvckVhY2gocGFyYW1ldGVyID0+IHtcblx0XHRcdG9iamVjdE1hcFtwYXJhbWV0ZXIuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHBhcmFtZXRlcjtcblx0XHR9KTtcblx0fSk7XG5cdHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5VHlwZXMuZm9yRWFjaChlbnRpdHlUeXBlID0+IHtcblx0XHRvYmplY3RNYXBbZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdID0gZW50aXR5VHlwZTtcblx0XHRlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG5cdFx0XHRvYmplY3RNYXBbcHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHByb3BlcnR5O1xuXHRcdH0pO1xuXHRcdGVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZm9yRWFjaChuYXZQcm9wZXJ0eSA9PiB7XG5cdFx0XHRvYmplY3RNYXBbbmF2UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IG5hdlByb3BlcnR5O1xuXHRcdH0pO1xuXHR9KTtcblx0T2JqZWN0LmtleXMocGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9ucykuZm9yRWFjaChhbm5vdGF0aW9uU291cmNlID0+IHtcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFubm90YXRpb25zW2Fubm90YXRpb25Tb3VyY2VdLmZvckVhY2goYW5ub3RhdGlvbkxpc3QgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudFRhcmdldE5hbWUgPSBwYXJzZXJPdXRwdXQudW5hbGlhcyhhbm5vdGF0aW9uTGlzdC50YXJnZXQpO1xuXHRcdFx0YW5ub3RhdGlvbkxpc3QuYW5ub3RhdGlvbnMuZm9yRWFjaChhbm5vdGF0aW9uID0+IHtcblx0XHRcdFx0bGV0IGFubm90YXRpb25GUU4gPSBgJHtjdXJyZW50VGFyZ2V0TmFtZX0vQCR7cGFyc2VyT3V0cHV0LnVuYWxpYXMoYW5ub3RhdGlvbi50ZXJtKX1gO1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbi5xdWFsaWZpZXIpIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uRlFOICs9IGAjJHthbm5vdGF0aW9uLnF1YWxpZmllcn1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9iamVjdE1hcFthbm5vdGF0aW9uRlFOXSA9IGFubm90YXRpb247XG5cdFx0XHRcdGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lID0gYW5ub3RhdGlvbkZRTjtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuIG9iamVjdE1hcDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldChvYmplY3RNYXA6IGFueSwgY3VycmVudFRhcmdldDogYW55LCBwYXRoOiBzdHJpbmcsIHBhdGhPbmx5OiBib29sZWFuID0gZmFsc2UpIHtcblx0cGF0aCA9IGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lICsgXCIvXCIgKyBwYXRoO1xuXHRjb25zdCBwYXRoU3BsaXQgPSBwYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IGN1cnJlbnRQYXRoID0gcGF0aDtcblx0Y29uc3QgdGFyZ2V0ID0gcGF0aFNwbGl0LnJlZHVjZSgoY3VycmVudFZhbHVlOiBhbnksIHBhdGhQYXJ0KSA9PiB7XG5cdFx0aWYgKCFjdXJyZW50VmFsdWUpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gcGF0aFBhcnQ7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgJiYgY3VycmVudFZhbHVlLmVudGl0eVR5cGUpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gY3VycmVudFZhbHVlLmVudGl0eVR5cGUgKyBcIi9cIiArIHBhdGhQYXJ0O1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmIGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlTmFtZSkge1xuXHRcdFx0Y3VycmVudFBhdGggPSBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZU5hbWUgKyBcIi9cIiArIHBhdGhQYXJ0O1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmIGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSArIFwiL1wiICsgcGF0aFBhcnQ7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdFx0Y3VycmVudFBhdGggPVxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zdWJzdHIoMCwgY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoXCIvXCIpKSArXG5cdFx0XHRcdFwiL1wiICtcblx0XHRcdFx0cGF0aFBhcnQ7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uXCIgJiYgY3VycmVudFZhbHVlLmlzQm91bmQpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gY3VycmVudFZhbHVlLmZ1bGx5UXVhbGlmaWVkTmFtZSArIFwiL1wiICsgcGF0aFBhcnQ7XG5cdFx0XHRpZiAoIW9iamVjdE1hcFtjdXJyZW50UGF0aF0pIHtcblx0XHRcdFx0Y3VycmVudFBhdGggPSBjdXJyZW50VmFsdWUuc291cmNlVHlwZSArIFwiL1wiICsgcGF0aFBhcnQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgY3VycmVudFZhbHVlLmlzRW50aXR5U2V0KSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGN1cnJlbnRWYWx1ZS50eXBlICsgXCIvXCIgKyBwYXRoUGFydDtcblx0XHR9IGVsc2UgaWYgKGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gXCJBY3Rpb25QYXJhbWV0ZXJcIiAmJiAhY3VycmVudFZhbHVlLmlzRW50aXR5U2V0KSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLnN1YnN0cigwLCBjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5sYXN0SW5kZXhPZihcIi9cIikpICtcblx0XHRcdFx0XCIvXCIgK1xuXHRcdFx0XHRwYXRoUGFydDtcblx0XHRcdGlmICghb2JqZWN0TWFwW2N1cnJlbnRQYXRoXSkge1xuXHRcdFx0XHRjdXJyZW50UGF0aCA9XG5cdFx0XHRcdFx0KG9iamVjdE1hcFtcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLnN1YnN0cigwLCBjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5sYXN0SW5kZXhPZihcIi9cIikpXG5cdFx0XHRcdFx0XSBhcyBBY3Rpb24pLnNvdXJjZVR5cGUgK1xuXHRcdFx0XHRcdFwiL1wiICtcblx0XHRcdFx0XHRwYXRoUGFydDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudFBhdGggPSBjdXJyZW50VmFsdWUuZnVsbHlRdWFsaWZpZWROYW1lICsgXCIvXCIgKyBwYXRoUGFydDtcblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdE1hcFtjdXJyZW50UGF0aF07XG5cdH0sIG51bGwpO1xuXHRpZiAoIXRhcmdldCkge1xuXHRcdC8vIGNvbnNvbGUubG9nKFwiTWlzc2luZyB0YXJnZXQgXCIgKyBwYXRoKTtcblx0fVxuXHRpZiAocGF0aE9ubHkpIHtcblx0XHRyZXR1cm4gY3VycmVudFBhdGg7XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZShcblx0cHJvcGVydHlWYWx1ZTogRXhwcmVzc2lvbixcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXVxuKSB7XG5cdGlmIChwcm9wZXJ0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdHN3aXRjaCAocHJvcGVydHlWYWx1ZS50eXBlKSB7XG5cdFx0Y2FzZSBcIlN0cmluZ1wiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuU3RyaW5nO1xuXHRcdGNhc2UgXCJJbnRcIjpcblx0XHRcdHJldHVybiBwcm9wZXJ0eVZhbHVlLkludDtcblx0XHRjYXNlIFwiQm9vbFwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuQm9vbDtcblx0XHRjYXNlIFwiRGVjaW1hbFwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuRGVjaW1hbDtcblx0XHRjYXNlIFwiRGF0ZVwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuRGF0ZTtcblx0XHRjYXNlIFwiRW51bU1lbWJlclwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuRW51bU1lbWJlcjtcblx0XHRjYXNlIFwiUHJvcGVydHlQYXRoXCI6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHR2YWx1ZTogcHJvcGVydHlWYWx1ZS5Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdCR0YXJnZXQ6IHJlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjdXJyZW50VGFyZ2V0LCBwcm9wZXJ0eVZhbHVlLlByb3BlcnR5UGF0aClcblx0XHRcdH07XG5cdFx0Y2FzZSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHR2YWx1ZTogcHJvcGVydHlWYWx1ZS5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuXHRcdFx0XHQkdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgY3VycmVudFRhcmdldCwgcHJvcGVydHlWYWx1ZS5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoKVxuXHRcdFx0fTtcblx0XHRjYXNlIFwiQW5ub3RhdGlvblBhdGhcIjpcblx0XHRcdGNvbnN0IGFubm90YXRpb25UYXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdHBhcnNlck91dHB1dC51bmFsaWFzKHByb3BlcnR5VmFsdWUuQW5ub3RhdGlvblBhdGgpLFxuXHRcdFx0XHR0cnVlXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblBhdGggPSB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuQW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdCR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXRcblx0XHRcdH07XG5cdFx0XHR0b1Jlc29sdmUucHVzaChhbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvblBhdGg7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgY3VycmVudFRhcmdldCwgcHJvcGVydHlWYWx1ZS5QYXRoLCB0cnVlKTtcblx0XHRcdGNvbnN0IHBhdGggPSBuZXcgUGF0aChwcm9wZXJ0eVZhbHVlLCAkdGFyZ2V0KTtcblx0XHRcdHRvUmVzb2x2ZS5wdXNoKHBhdGgpO1xuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0Y2FzZSBcIlJlY29yZFwiOlxuXHRcdFx0cmV0dXJuIHBhcnNlUmVjb3JkKHByb3BlcnR5VmFsdWUuUmVjb3JkLCBwYXJzZXJPdXRwdXQsIGN1cnJlbnRUYXJnZXQsIG9iamVjdE1hcCwgdG9SZXNvbHZlKTtcblx0XHRjYXNlIFwiQ29sbGVjdGlvblwiOlxuXHRcdFx0cmV0dXJuIHBhcnNlQ29sbGVjdGlvbihwcm9wZXJ0eVZhbHVlLkNvbGxlY3Rpb24sIHBhcnNlck91dHB1dCwgY3VycmVudFRhcmdldCwgb2JqZWN0TWFwLCB0b1Jlc29sdmUpO1xuXHRcdGNhc2UgXCJBcHBseVwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSZWNvcmQoXG5cdHJlY29yZERlZmluaXRpb246IEFubm90YXRpb25SZWNvcmQsXG5cdHBhcnNlck91dHB1dDogUGFyc2VyT3V0cHV0LFxuXHRjdXJyZW50VGFyZ2V0OiBhbnksXG5cdG9iamVjdE1hcDogYW55LFxuXHR0b1Jlc29sdmU6IFJlc29sdmVhYmxlW11cbikge1xuXHRjb25zdCBhbm5vdGF0aW9uVGVybTogYW55ID0ge1xuXHRcdCRUeXBlOiBwYXJzZXJPdXRwdXQudW5hbGlhcyhyZWNvcmREZWZpbml0aW9uLnR5cGUpXG5cdH07XG5cdGNvbnN0IGFubm90YXRpb25Db250ZW50OiBhbnkgPSB7fTtcblx0cmVjb3JkRGVmaW5pdGlvbi5wcm9wZXJ0eVZhbHVlcy5mb3JFYWNoKChwcm9wZXJ0eVZhbHVlOiBQcm9wZXJ0eVZhbHVlKSA9PiB7XG5cdFx0YW5ub3RhdGlvbkNvbnRlbnRbcHJvcGVydHlWYWx1ZS5uYW1lXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRwcm9wZXJ0eVZhbHVlLnZhbHVlLFxuXHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdG9iamVjdE1hcCxcblx0XHRcdHRvUmVzb2x2ZVxuXHRcdCk7XG5cdH0pO1xuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihhbm5vdGF0aW9uVGVybSwgYW5ub3RhdGlvbkNvbnRlbnQpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUNvbGxlY3Rpb24oXG5cdGNvbGxlY3Rpb25EZWZpbml0aW9uOiBhbnlbXSxcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXVxuKSB7XG5cdHN3aXRjaCAoKGNvbGxlY3Rpb25EZWZpbml0aW9uIGFzIGFueSkudHlwZSkge1xuXHRcdGNhc2UgXCJQcm9wZXJ0eVBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAocHJvcGVydHlQYXRoID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHRcdHZhbHVlOiBwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdCR0YXJnZXQ6IHJlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjdXJyZW50VGFyZ2V0LCBwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoKVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAocGF0aFZhbHVlID0+IHtcblx0XHRcdFx0Y29uc3QgJHRhcmdldCA9IHJlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjdXJyZW50VGFyZ2V0LCBwYXRoVmFsdWUuUGF0aCwgdHJ1ZSk7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBuZXcgUGF0aChwYXRoVmFsdWUsICR0YXJnZXQpO1xuXHRcdFx0XHR0b1Jlc29sdmUucHVzaChwYXRoKTtcblx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiQW5ub3RhdGlvblBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoYW5ub3RhdGlvblBhdGggPT4ge1xuXHRcdFx0XHRjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGN1cnJlbnRUYXJnZXQsIGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLCB0cnVlKTtcblx0XHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50ID0ge1xuXHRcdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0XHR2YWx1ZTogYW5ub3RhdGlvblBhdGguQW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0JHRhcmdldDogYW5ub3RhdGlvblRhcmdldFxuXHRcdFx0XHR9O1xuXHRcdFx0XHR0b1Jlc29sdmUucHVzaChhbm5vdGF0aW9uQ29sbGVjdGlvbkVsZW1lbnQpO1xuXHRcdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAobmF2UHJvcGVydHlQYXRoID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0XHR2YWx1ZTogbmF2UHJvcGVydHlQYXRoLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGN1cnJlbnRUYXJnZXQsIG5hdlByb3BlcnR5UGF0aC5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoKVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlJlY29yZFwiOlxuXHRcdFx0cmV0dXJuIGNvbGxlY3Rpb25EZWZpbml0aW9uLm1hcChyZWNvcmREZWZpbml0aW9uID0+IHtcblx0XHRcdFx0cmV0dXJuIHBhcnNlUmVjb3JkKHJlY29yZERlZmluaXRpb24sIHBhcnNlck91dHB1dCwgY3VycmVudFRhcmdldCwgb2JqZWN0TWFwLCB0b1Jlc29sdmUpO1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlN0cmluZ1wiOlxuXHRcdFx0cmV0dXJuIGNvbGxlY3Rpb25EZWZpbml0aW9uLm1hcChzdHJpbmdWYWx1ZSA9PiB7XG5cdFx0XHRcdHJldHVybiBzdHJpbmdWYWx1ZTtcblx0XHRcdH0pO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAoY29sbGVjdGlvbkRlZmluaXRpb24ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGNhc2VcIik7XG5cdH1cbn1cblxudHlwZSBSZXNvbHZlYWJsZSA9IHtcblx0JHRhcmdldDogc3RyaW5nO1xufTtcblxuZnVuY3Rpb24gY29udmVydEFubm90YXRpb24oXG5cdGFubm90YXRpb246IEFubm90YXRpb24sXG5cdHBhcnNlck91dHB1dDogUGFyc2VyT3V0cHV0LFxuXHRjdXJyZW50VGFyZ2V0OiBhbnksXG5cdG9iamVjdE1hcDogYW55LFxuXHR0b1Jlc29sdmU6IFJlc29sdmVhYmxlW11cbik6IGFueSB7XG5cdGlmIChhbm5vdGF0aW9uLnJlY29yZCkge1xuXHRcdGNvbnN0IGFubm90YXRpb25UZXJtOiBhbnkgPSB7XG5cdFx0XHQkVHlwZTogcGFyc2VyT3V0cHV0LnVuYWxpYXMoYW5ub3RhdGlvbi5yZWNvcmQudHlwZSksXG5cdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0cXVhbGlmaWVyOiBhbm5vdGF0aW9uLnF1YWxpZmllclxuXHRcdH07XG5cdFx0Y29uc3QgYW5ub3RhdGlvbkNvbnRlbnQ6IGFueSA9IHt9O1xuXHRcdGFubm90YXRpb24ucmVjb3JkLnByb3BlcnR5VmFsdWVzLmZvckVhY2goKHByb3BlcnR5VmFsdWU6IFByb3BlcnR5VmFsdWUpID0+IHtcblx0XHRcdGFubm90YXRpb25Db250ZW50W3Byb3BlcnR5VmFsdWUubmFtZV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlLnZhbHVlLFxuXHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0dG9SZXNvbHZlXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKGFubm90YXRpb25UZXJtLCBhbm5vdGF0aW9uQ29udGVudCk7XG5cdH0gZWxzZSBpZiAoIWFubm90YXRpb24uaXNDb2xsZWN0aW9uKSB7XG5cdFx0aWYgKGFubm90YXRpb24udmFsdWUpIHtcblx0XHRcdHJldHVybiBwYXJzZVZhbHVlKGFubm90YXRpb24udmFsdWUsIHBhcnNlck91dHB1dCwgY3VycmVudFRhcmdldCwgb2JqZWN0TWFwLCB0b1Jlc29sdmUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbi5jb2xsZWN0aW9uKSB7XG5cdFx0Y29uc3QgY29sbGVjdGlvbjogYW55ID0gcGFyc2VDb2xsZWN0aW9uKFxuXHRcdFx0YW5ub3RhdGlvbi5jb2xsZWN0aW9uLFxuXHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdG9iamVjdE1hcCxcblx0XHRcdHRvUmVzb2x2ZVxuXHRcdCk7XG5cdFx0Y29sbGVjdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgPSBhbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRyZXR1cm4gY29sbGVjdGlvbjtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBjYXNlXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlc29sdmVQYXRoRm4oZW50aXR5VHlwZTogRW50aXR5VHlwZSwgb2JqZWN0TWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cdHJldHVybiBmdW5jdGlvbihyZWxhdGl2ZVBhdGg6IHN0cmluZyk6IGFueSB7XG5cdFx0cmV0dXJuIHJlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBlbnRpdHlUeXBlLCByZWxhdGl2ZVBhdGgpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlTmF2aWdhdGlvblByb3BlcnRpZXMocGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsIG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVR5cGVzLmZvckVhY2goZW50aXR5VHlwZSA9PiB7XG5cdFx0ZW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKG5hdlByb3AgPT4ge1xuXHRcdFx0aWYgKChuYXZQcm9wIGFzIFY0TmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZSkge1xuXHRcdFx0XHQobmF2UHJvcCBhcyBWNE5hdmlnYXRpb25Qcm9wZXJ0eSkudGFyZ2V0VHlwZSA9XG5cdFx0XHRcdFx0b2JqZWN0TWFwWyhuYXZQcm9wIGFzIFY0TmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZV07XG5cdFx0XHR9IGVsc2UgaWYgKChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS5yZWxhdGlvbnNoaXApIHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0QXNzb2NpYXRpb24gPSBwYXJzZXJPdXRwdXQuc2NoZW1hLmFzc29jaWF0aW9ucy5maW5kKFxuXHRcdFx0XHRcdGFzc29jaWF0aW9uID0+IGFzc29jaWF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSA9PT0gKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGFyZ2V0QXNzb2NpYXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCBhc3NvY2lhdGlvbkVuZCA9IHRhcmdldEFzc29jaWF0aW9uLmFzc29jaWF0aW9uRW5kLmZpbmQoXG5cdFx0XHRcdFx0XHRlbmQgPT4gZW5kLnJvbGUgPT09IChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS50b1JvbGVcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmIChhc3NvY2lhdGlvbkVuZCkge1xuXHRcdFx0XHRcdFx0KG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGUgPSBvYmplY3RNYXBbYXNzb2NpYXRpb25FbmQudHlwZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZW50aXR5VHlwZS5yZXNvbHZlUGF0aCA9IGNyZWF0ZVJlc29sdmVQYXRoRm4oZW50aXR5VHlwZSwgb2JqZWN0TWFwKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUeXBlcyhwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCk6IFBhcnNlck91dHB1dCB7XG5cdGNvbnN0IG9iamVjdE1hcCA9IGJ1aWxkT2JqZWN0TWFwKHBhcnNlck91dHB1dCk7XG5cdHJlc29sdmVOYXZpZ2F0aW9uUHJvcGVydGllcyhwYXJzZXJPdXRwdXQsIG9iamVjdE1hcCk7XG5cdGNvbnN0IHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSA9IFtdO1xuXHRjb25zdCB1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10gPSBbXTtcblx0T2JqZWN0LmtleXMocGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9ucykuZm9yRWFjaChhbm5vdGF0aW9uU291cmNlID0+IHtcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFubm90YXRpb25zW2Fubm90YXRpb25Tb3VyY2VdLmZvckVhY2goYW5ub3RhdGlvbkxpc3QgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudFRhcmdldE5hbWUgPSBwYXJzZXJPdXRwdXQudW5hbGlhcyhhbm5vdGF0aW9uTGlzdC50YXJnZXQpIGFzIHN0cmluZztcblx0XHRcdGNvbnN0IGN1cnJlbnRUYXJnZXQgPSBvYmplY3RNYXBbY3VycmVudFRhcmdldE5hbWVdO1xuXHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0KSB7XG5cdFx0XHRcdGlmIChjdXJyZW50VGFyZ2V0TmFtZS5pbmRleE9mKFwiQFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uTGlzdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucykge1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhbm5vdGF0aW9uTGlzdC5hbm5vdGF0aW9ucy5mb3JFYWNoKGFubm90YXRpb24gPT4ge1xuXHRcdFx0XHRcdGNvbnN0IFt2b2NBbGlhcywgdm9jVGVybV0gPSBhbm5vdGF0aW9uLnRlcm0uc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10pIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdID0ge307XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zID0ge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc3Qgdm9jVGVybVdpdGhRdWFsaWZpZXIgPSBgJHt2b2NUZXJtfSR7YW5ub3RhdGlvbi5xdWFsaWZpZXIgPyBgIyR7YW5ub3RhdGlvbi5xdWFsaWZpZXJ9YCA6IFwiXCJ9YDtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPSBjb252ZXJ0QW5ub3RhdGlvbihcblx0XHRcdFx0XHRcdGFubm90YXRpb24sXG5cdFx0XHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdFx0dG9SZXNvbHZlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnRlcm0gPSBwYXJzZXJPdXRwdXQudW5hbGlhcyhcblx0XHRcdFx0XHRcdFx0YCR7dm9jQWxpYXN9LiR7dm9jVGVybX1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnF1YWxpZmllciA9IGFubm90YXRpb24ucXVhbGlmaWVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9uc1tgJHt2b2NBbGlhc30uJHt2b2NUZXJtV2l0aFF1YWxpZmllcn1gXSA9XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl07XG5cdFx0XHRcdFx0b2JqZWN0TWFwW2Ake2N1cnJlbnRUYXJnZXROYW1lfUAke3BhcnNlck91dHB1dC51bmFsaWFzKHZvY0FsaWFzICsgXCIuXCIgKyB2b2NUZXJtV2l0aFF1YWxpZmllcil9YF0gPVxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5mb3JFYWNoKGFubm90YXRpb25MaXN0ID0+IHtcblx0XHRjb25zdCBjdXJyZW50VGFyZ2V0TmFtZSA9IHBhcnNlck91dHB1dC51bmFsaWFzKGFubm90YXRpb25MaXN0LnRhcmdldCkgYXMgc3RyaW5nO1xuXHRcdGxldCBbYmFzZU9iaiwgYW5ub3RhdGlvblBhcnRdID0gY3VycmVudFRhcmdldE5hbWUuc3BsaXQoXCJAXCIpO1xuXHRcdGNvbnN0IHRhcmdldFNwbGl0ID0gYW5ub3RhdGlvblBhcnQuc3BsaXQoXCIvXCIpO1xuXHRcdGJhc2VPYmogPSBiYXNlT2JqICsgXCJAXCIgKyB0YXJnZXRTcGxpdFswXTtcblx0XHRjb25zdCBjdXJyZW50VGFyZ2V0ID0gdGFyZ2V0U3BsaXQuc2xpY2UoMSkucmVkdWNlKChjdXJyZW50T2JqLCBwYXRoKSA9PiB7XG5cdFx0XHRpZiAoIWN1cnJlbnRPYmopIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY3VycmVudE9ialtwYXRoXTtcblx0XHR9LCBvYmplY3RNYXBbYmFzZU9ial0pO1xuXHRcdGlmICghY3VycmVudFRhcmdldCkge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJNaXNzaW5nIHRhcmdldCBhZ2FpbiBcIiArIGN1cnJlbnRUYXJnZXROYW1lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zKSB7XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdH1cblx0XHRcdGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goYW5ub3RhdGlvbiA9PiB7XG5cdFx0XHRcdGNvbnN0IFt2b2NBbGlhcywgdm9jVGVybV0gPSBhbm5vdGF0aW9uLnRlcm0uc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRpZiAoIWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdKSB7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10gPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zKSB7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHZvY1Rlcm1XaXRoUXVhbGlmaWVyID0gYCR7dm9jVGVybX0ke2Fubm90YXRpb24ucXVhbGlmaWVyID8gYCMke2Fubm90YXRpb24ucXVhbGlmaWVyfWAgOiBcIlwifWA7XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9IGNvbnZlcnRBbm5vdGF0aW9uKFxuXHRcdFx0XHRcdGFubm90YXRpb24sXG5cdFx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdHRvUmVzb2x2ZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodHlwZW9mIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS50ZXJtID0gcGFyc2VyT3V0cHV0LnVuYWxpYXMoXG5cdFx0XHRcdFx0XHRgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5xdWFsaWZpZXIgPSBhbm5vdGF0aW9uLnF1YWxpZmllcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9uc1tgJHt2b2NBbGlhc30uJHt2b2NUZXJtV2l0aFF1YWxpZmllcn1gXSA9XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0XHRvYmplY3RNYXBbYCR7Y3VycmVudFRhcmdldE5hbWV9QCR7cGFyc2VyT3V0cHV0LnVuYWxpYXModm9jQWxpYXMgKyBcIi5cIiArIHZvY1Rlcm1XaXRoUXVhbGlmaWVyKX1gXSA9XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblx0dG9SZXNvbHZlLmZvckVhY2gocmVzb2x2ZWFibGUgPT4ge1xuXHRcdHJlc29sdmVhYmxlLiR0YXJnZXQgPSBvYmplY3RNYXBbcmVzb2x2ZWFibGUuJHRhcmdldF07XG5cdH0pO1xuXG5cdHJldHVybiBwYXJzZXJPdXRwdXQ7XG59XG5cbmNvbnN0IEFubm90YXRpb25Db252ZXJ0ZXIgPSB7XG5cdGNvbnZlcnRUeXBlc1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5ub3RhdGlvbkNvbnZlcnRlcjtcbiJdfQ==