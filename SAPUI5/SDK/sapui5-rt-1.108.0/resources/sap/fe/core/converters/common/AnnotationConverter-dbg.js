/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
 sap.ui.define([], function() {
    /*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var AnnotationConverter;
/******/

(function () {
  // webpackBootstrap

  /******/
  "use strict";
  /******/

  var __webpack_modules__ = {
    /***/
    875:
    /***/
    function (__unused_webpack_module, exports, __webpack_require__) {
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.convert = void 0;

      var utils_1 = __webpack_require__(69);
      /**
       *
       */


      var Path =
      /**
       * @param pathExpression
       * @param targetName
       * @param annotationsTerm
       * @param term
       */
      function Path(pathExpression, targetName, annotationsTerm, term) {
        this.path = pathExpression.Path;
        this.type = 'Path';
        this.$target = targetName;
        this.term = term;
        this.annotationsTerm = annotationsTerm;
      };
      /**
       * Creates a Map based on the fullyQualifiedName of each object part of the metadata.
       *
       * @param rawMetadata the rawMetadata we're working against
       * @returns the objectmap for easy access to the different object of the metadata
       */


      function buildObjectMap(rawMetadata) {
        var _a;

        var objectMap = {};

        if ((_a = rawMetadata.schema.entityContainer) === null || _a === void 0 ? void 0 : _a.fullyQualifiedName) {
          objectMap[rawMetadata.schema.entityContainer.fullyQualifiedName] = rawMetadata.schema.entityContainer;
        }

        rawMetadata.schema.entitySets.forEach(function (entitySet) {
          objectMap[entitySet.fullyQualifiedName] = entitySet;
        });
        rawMetadata.schema.singletons.forEach(function (singleton) {
          objectMap[singleton.fullyQualifiedName] = singleton;
        });
        rawMetadata.schema.actions.forEach(function (action) {
          objectMap[action.fullyQualifiedName] = action;

          if (action.isBound) {
            var unBoundActionName = action.fullyQualifiedName.split('(')[0];

            if (!objectMap[unBoundActionName]) {
              objectMap[unBoundActionName] = {
                _type: 'UnboundGenericAction',
                actions: []
              };
            }

            objectMap[unBoundActionName].actions.push(action);
            var actionSplit = action.fullyQualifiedName.split('(');
            objectMap["".concat(actionSplit[1].split(')')[0], "/").concat(actionSplit[0])] = action;
          }

          action.parameters.forEach(function (parameter) {
            objectMap[parameter.fullyQualifiedName] = parameter;
          });
        });
        rawMetadata.schema.complexTypes.forEach(function (complexType) {
          objectMap[complexType.fullyQualifiedName] = complexType;
          complexType.properties.forEach(function (property) {
            objectMap[property.fullyQualifiedName] = property;
          });
        });
        rawMetadata.schema.typeDefinitions.forEach(function (typeDefinition) {
          objectMap[typeDefinition.fullyQualifiedName] = typeDefinition;
        });
        rawMetadata.schema.entityTypes.forEach(function (entityType) {
          entityType.annotations = {}; // 'annotations' property is mandatory

          objectMap[entityType.fullyQualifiedName] = entityType;
          objectMap["Collection(".concat(entityType.fullyQualifiedName, ")")] = entityType;
          entityType.entityProperties.forEach(function (property) {
            objectMap[property.fullyQualifiedName] = property; // Handle complex types

            var complexTypeDefinition = objectMap[property.type];

            if ((0, utils_1.isComplexTypeDefinition)(complexTypeDefinition)) {
              complexTypeDefinition.properties.forEach(function (complexTypeProp) {
                var complexTypePropTarget = Object.assign(complexTypeProp, {
                  _type: 'Property',
                  fullyQualifiedName: property.fullyQualifiedName + '/' + complexTypeProp.name
                });
                objectMap[complexTypePropTarget.fullyQualifiedName] = complexTypePropTarget;
              });
            }
          });
          entityType.navigationProperties.forEach(function (navProperty) {
            objectMap[navProperty.fullyQualifiedName] = navProperty;
          });
        });
        Object.keys(rawMetadata.schema.annotations).forEach(function (annotationSource) {
          rawMetadata.schema.annotations[annotationSource].forEach(function (annotationList) {
            var currentTargetName = (0, utils_1.unalias)(rawMetadata.references, annotationList.target);
            annotationList.annotations.forEach(function (annotation) {
              var annotationFQN = "".concat(currentTargetName, "@").concat((0, utils_1.unalias)(rawMetadata.references, annotation.term));

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
      /**
       * Combine two strings representing path in the metamodel while ensuring their specificities (annotation...) are respected.
       *
       * @param currentTarget the current path
       * @param path the part we want to append
       * @returns the complete path including the extension.
       */


      function combinePath(currentTarget, path) {
        if (path.startsWith('@')) {
          return currentTarget + (0, utils_1.unalias)(utils_1.defaultReferences, path);
        } else {
          return currentTarget + '/' + path;
        }
      }

      var ALL_ANNOTATION_ERRORS = {};
      var ANNOTATION_ERRORS = [];
      /**
       * @param path
       * @param oErrorMsg
       */

      function addAnnotationErrorMessage(path, oErrorMsg) {
        if (!ALL_ANNOTATION_ERRORS[path]) {
          ALL_ANNOTATION_ERRORS[path] = [oErrorMsg];
        } else {
          ALL_ANNOTATION_ERRORS[path].push(oErrorMsg);
        }
      }
      /**
       * Resolves a specific path based on the objectMap.
       *
       * @param objectMap
       * @param currentTarget
       * @param path
       * @param pathOnly
       * @param includeVisitedObjects
       * @param annotationsTerm
       * @returns the resolved object
       */


      function _resolveTarget(objectMap, currentTarget, path) {
        var pathOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var includeVisitedObjects = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var annotationsTerm = arguments.length > 5 ? arguments[5] : undefined;
        var oErrorMsg;

        if (!path) {
          return undefined;
        }

        var aVisitedObjects = [];

        if (currentTarget && currentTarget._type === 'Property') {
          currentTarget = objectMap[currentTarget.fullyQualifiedName.split('/')[0]];
        }

        path = combinePath(currentTarget.fullyQualifiedName, path);
        var pathSplit = path.split('/');
        var targetPathSplit = [];
        pathSplit.forEach(function (pathPart) {
          // Separate out the annotation
          if (pathPart.indexOf('@') !== -1) {
            var _pathPart$split = pathPart.split('@'),
                _pathPart$split2 = _slicedToArray(_pathPart$split, 2),
                splittedPath = _pathPart$split2[0],
                annotationPath = _pathPart$split2[1];

            targetPathSplit.push(splittedPath);
            targetPathSplit.push("@".concat(annotationPath));
          } else {
            targetPathSplit.push(pathPart);
          }
        });
        var currentPath = path;
        var currentContext = currentTarget;
        var target = targetPathSplit.reduce(function (currentValue, pathPart) {
          if (pathPart === '$Type' && currentValue._type === 'EntityType') {
            return currentValue;
          }

          if (pathPart === '$' && currentValue._type === 'EntitySet') {
            return currentValue;
          }

          if ((pathPart === '@$ui5.overload' || pathPart === '0') && currentValue._type === 'Action') {
            return currentValue;
          }

          if (pathPart.length === 0) {
            // Empty Path after an entitySet means entityType
            if (currentValue && (currentValue._type === 'EntitySet' || currentValue._type === 'Singleton') && currentValue.entityType) {
              if (includeVisitedObjects) {
                aVisitedObjects.push(currentValue);
              }

              currentValue = currentValue.entityType;
            }

            if (currentValue && currentValue._type === 'NavigationProperty' && currentValue.targetType) {
              if (includeVisitedObjects) {
                aVisitedObjects.push(currentValue);
              }

              currentValue = currentValue.targetType;
            }

            return currentValue;
          }

          if (includeVisitedObjects && currentValue !== null && currentValue !== undefined) {
            aVisitedObjects.push(currentValue);
          }

          if (!currentValue) {
            currentPath = pathPart;
          } else if ((currentValue._type === 'EntitySet' || currentValue._type === 'Singleton') && pathPart === '$Type') {
            currentValue = currentValue.targetType;
            return currentValue;
          } else if ((currentValue._type === 'EntitySet' || currentValue._type === 'Singleton') && pathPart === '$NavigationPropertyBinding') {
            currentValue = currentValue.navigationPropertyBinding;
            return currentValue;
          } else if ((currentValue._type === 'EntitySet' || currentValue._type === 'Singleton') && currentValue.entityType) {
            currentPath = combinePath(currentValue.entityTypeName, pathPart);
          } else if (currentValue._type === 'NavigationProperty') {
            currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

            if (!objectMap[currentPath]) {
              // Fallback log error
              currentPath = combinePath(currentValue.targetTypeName, pathPart);
            }
          } else if (currentValue._type === 'Property') {
            // ComplexType or Property
            if (currentValue.targetType) {
              currentPath = combinePath(currentValue.targetType.fullyQualifiedName, pathPart);
            } else {
              currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);
            }
          } else if (currentValue._type === 'Action' && currentValue.isBound) {
            currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

            if (pathPart === '$Parameter') {
              return currentValue.parameters;
            }

            if (!objectMap[currentPath]) {
              currentPath = combinePath(currentValue.sourceType, pathPart);
            }
          } else if (currentValue._type === 'ActionParameter') {
            currentPath = combinePath(currentTarget.fullyQualifiedName.substring(0, currentTarget.fullyQualifiedName.lastIndexOf('/')), pathPart);

            if (!objectMap[currentPath]) {
              var lastIdx = currentTarget.fullyQualifiedName.lastIndexOf('/');

              if (lastIdx === -1) {
                lastIdx = currentTarget.fullyQualifiedName.length;
              }

              currentPath = combinePath(objectMap[currentTarget.fullyQualifiedName.substring(0, lastIdx)].sourceType, pathPart);
            }
          } else {
            currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

            if (pathPart !== 'name' && currentValue[pathPart] !== undefined) {
              return currentValue[pathPart];
            } else if (pathPart === '$AnnotationPath' && currentValue.$target) {
              var contextToResolve = objectMap[currentValue.fullyQualifiedName.split('@')[0]];

              var subTarget = _resolveTarget(objectMap, contextToResolve, currentValue.value, false, true);

              subTarget.visitedObjects.forEach(function (visitedSubObject) {
                if (aVisitedObjects.indexOf(visitedSubObject) === -1) {
                  aVisitedObjects.push(visitedSubObject);
                }
              });
              return subTarget.target;
            } else if (pathPart === '$Path' && currentValue.$target) {
              currentContext = aVisitedObjects.concat().reverse().find(function (obj) {
                return obj._type === 'EntityType' || obj._type === 'EntitySet' || obj._type === 'Singleton' || obj._type === 'NavigationProperty';
              });

              if (currentContext) {
                var _subTarget = _resolveTarget(objectMap, currentContext, currentValue.path, false, true);

                _subTarget.visitedObjects.forEach(function (visitedSubObject) {
                  if (aVisitedObjects.indexOf(visitedSubObject) === -1) {
                    aVisitedObjects.push(visitedSubObject);
                  }
                });

                return _subTarget.target;
              }

              return currentValue.$target;
            } else if (pathPart.startsWith('$Path') && currentValue.$target) {
              var intermediateTarget = currentValue.$target;
              currentPath = combinePath(intermediateTarget.fullyQualifiedName, pathPart.substring(5));
            } else if (currentValue.hasOwnProperty('$Type') && !objectMap[currentPath]) {
              // This is now an annotation value
              var entityType = objectMap[currentValue.fullyQualifiedName.split('@')[0]];

              if (entityType) {
                currentPath = combinePath(entityType.fullyQualifiedName, pathPart);
              }
            }
          }

          return objectMap[currentPath];
        }, null);

        if (!target) {
          if (annotationsTerm) {
            var annotationType = inferTypeFromTerm(annotationsTerm, currentTarget);
            oErrorMsg = {
              message: 'Unable to resolve the path expression: ' + '\n' + path + '\n' + '\n' + 'Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n' + '<Annotation Term = ' + annotationsTerm + '>' + '\n' + '<Record Type = ' + annotationType + '>' + '\n' + '<AnnotationPath = ' + path + '>'
            };
            addAnnotationErrorMessage(path, oErrorMsg);
          } else {
            oErrorMsg = {
              message: 'Unable to resolve the path expression: ' + path + '\n' + '\n' + 'Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n' + '<Annotation Term = ' + pathSplit[0] + '>' + '\n' + '<PropertyValue  Path= ' + pathSplit[1] + '>'
            };
            addAnnotationErrorMessage(path, oErrorMsg);
          }
        }

        if (pathOnly) {
          return currentPath;
        }

        if (includeVisitedObjects) {
          return {
            visitedObjects: aVisitedObjects,
            target: target
          };
        }

        return target;
      }
      /**
       * Typeguard to check if the path contains an annotation.
       *
       * @param pathStr the path to evaluate
       * @returns true if there is an annotation in the path.
       */


      function isAnnotationPath(pathStr) {
        return pathStr.indexOf('@') !== -1;
      }

      function parseValue(propertyValue, valueFQN, objectMap, context) {
        if (propertyValue === undefined) {
          return undefined;
        }

        switch (propertyValue.type) {
          case 'String':
            return propertyValue.String;

          case 'Int':
            return propertyValue.Int;

          case 'Bool':
            return propertyValue.Bool;

          case 'Decimal':
            return (0, utils_1.Decimal)(propertyValue.Decimal);

          case 'Date':
            return propertyValue.Date;

          case 'EnumMember':
            return (0, utils_1.alias)(context.rawMetadata.references, propertyValue.EnumMember);

          case 'PropertyPath':
            return {
              type: 'PropertyPath',
              value: propertyValue.PropertyPath,
              fullyQualifiedName: valueFQN,
              $target: _resolveTarget(objectMap, context.currentTarget, propertyValue.PropertyPath, false, false, context.currentTerm)
            };

          case 'NavigationPropertyPath':
            return {
              type: 'NavigationPropertyPath',
              value: propertyValue.NavigationPropertyPath,
              fullyQualifiedName: valueFQN,
              $target: _resolveTarget(objectMap, context.currentTarget, propertyValue.NavigationPropertyPath, false, false, context.currentTerm)
            };

          case 'AnnotationPath':
            var annotationTarget = _resolveTarget(objectMap, context.currentTarget, (0, utils_1.unalias)(context.rawMetadata.references, propertyValue.AnnotationPath), true, false, context.currentTerm);

            var annotationPath = {
              type: 'AnnotationPath',
              value: propertyValue.AnnotationPath,
              fullyQualifiedName: valueFQN,
              $target: annotationTarget,
              annotationsTerm: context.currentTerm,
              term: '',
              path: ''
            };
            context.unresolvedAnnotations.push({
              inline: false,
              toResolve: annotationPath
            });
            return annotationPath;

          case 'Path':
            var $target = _resolveTarget(objectMap, context.currentTarget, propertyValue.Path, true, false, context.currentTerm);

            var path = new Path(propertyValue, $target, context.currentTerm, '');
            context.unresolvedAnnotations.push({
              inline: isAnnotationPath(propertyValue.Path),
              toResolve: path
            });
            return path;

          case 'Record':
            return parseRecord(propertyValue.Record, valueFQN, objectMap, context);

          case 'Collection':
            return parseCollection(propertyValue.Collection, valueFQN, objectMap, context);

          case 'Apply':
          case 'Null':
          case 'Not':
          case 'Eq':
          case 'Ne':
          case 'Gt':
          case 'Ge':
          case 'Lt':
          case 'Le':
          case 'If':
          case 'And':
          case 'Or':
          default:
            return propertyValue;
        }
      }
      /**
       * Infer the type of a term based on its type.
       *
       * @param annotationsTerm The annotation term
       * @param annotationTarget the annotation target
       * @returns the inferred type.
       */


      function inferTypeFromTerm(annotationsTerm, annotationTarget) {
        var targetType = utils_1.TermToTypes[annotationsTerm];
        var oErrorMsg = {
          isError: false,
          message: "The type of the record used within the term ".concat(annotationsTerm, " was not defined and was inferred as ").concat(targetType, ".\nHint: If possible, try to maintain the Type property for each Record.\n<Annotations Target=\"").concat(annotationTarget, "\">\n\t<Annotation Term=\"").concat(annotationsTerm, "\">\n\t\t<Record>...</Record>\n\t</Annotation>\n</Annotations>")
        };
        addAnnotationErrorMessage(annotationTarget + '/' + annotationsTerm, oErrorMsg);
        return targetType;
      }

      function isDataFieldWithForAction(annotationContent, annotationTerm) {
        return annotationContent.hasOwnProperty('Action') && (annotationTerm.$Type === 'com.sap.vocabularies.UI.v1.DataFieldForAction' || annotationTerm.$Type === 'com.sap.vocabularies.UI.v1.DataFieldWithAction');
      }

      function parseRecordType(recordDefinition, context) {
        var targetType;

        if (!recordDefinition.type && context.currentTerm) {
          targetType = inferTypeFromTerm(context.currentTerm, context.currentTarget.fullyQualifiedName);
        } else {
          targetType = (0, utils_1.unalias)(context.rawMetadata.references, recordDefinition.type);
        }

        return targetType;
      }

      function parseRecord(recordDefinition, currentFQN, objectMap, context) {
        var targetType = parseRecordType(recordDefinition, context);
        var annotationTerm = {
          $Type: targetType,
          fullyQualifiedName: currentFQN,
          annotations: {}
        };
        var annotationContent = {};

        if (Array.isArray(recordDefinition.annotations)) {
          var subAnnotationList = {
            target: currentFQN,
            annotations: recordDefinition.annotations,
            __source: context.currentSource
          };
          context.additionalAnnotations.push(subAnnotationList);
        }

        if (recordDefinition.propertyValues) {
          recordDefinition.propertyValues.forEach(function (propertyValue) {
            annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(currentFQN, "/").concat(propertyValue.name), objectMap, context);

            if (Array.isArray(propertyValue.annotations)) {
              var _subAnnotationList = {
                target: "".concat(currentFQN, "/").concat(propertyValue.name),
                annotations: propertyValue.annotations,
                __source: context.currentSource
              };
              context.additionalAnnotations.push(_subAnnotationList);
            }

            if (isDataFieldWithForAction(annotationContent, annotationTerm)) {
              annotationContent.ActionTarget = context.currentTarget.actions && context.currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

              if (!annotationContent.ActionTarget) {
                // Add to diagnostics debugger;
                ANNOTATION_ERRORS.push({
                  message: 'Unable to resolve the action ' + annotationContent.Action + ' defined for ' + annotationTerm.fullyQualifiedName
                });
              }
            }
          });
        }

        return Object.assign(annotationTerm, annotationContent);
      }
      /**
       * Retrieve or infer the collection type based on its content.
       *
       * @param collectionDefinition
       * @returns the type of the collection
       */


      function getOrInferCollectionType(collectionDefinition) {
        var type = collectionDefinition.type;

        if (type === undefined && collectionDefinition.length > 0) {
          var firstColItem = collectionDefinition[0];

          if (firstColItem.hasOwnProperty('PropertyPath')) {
            type = 'PropertyPath';
          } else if (firstColItem.hasOwnProperty('Path')) {
            type = 'Path';
          } else if (firstColItem.hasOwnProperty('AnnotationPath')) {
            type = 'AnnotationPath';
          } else if (firstColItem.hasOwnProperty('NavigationPropertyPath')) {
            type = 'NavigationPropertyPath';
          } else if (typeof firstColItem === 'object' && (firstColItem.hasOwnProperty('type') || firstColItem.hasOwnProperty('propertyValues'))) {
            type = 'Record';
          } else if (typeof firstColItem === 'string') {
            type = 'String';
          }
        } else if (type === undefined) {
          type = 'EmptyCollection';
        }

        return type;
      }

      function parseCollection(collectionDefinition, parentFQN, objectMap, context) {
        var collectionDefinitionType = getOrInferCollectionType(collectionDefinition);

        switch (collectionDefinitionType) {
          case 'PropertyPath':
            return collectionDefinition.map(function (propertyPath, propertyIdx) {
              return {
                type: 'PropertyPath',
                value: propertyPath.PropertyPath,
                fullyQualifiedName: "".concat(parentFQN, "/").concat(propertyIdx),
                $target: _resolveTarget(objectMap, context.currentTarget, propertyPath.PropertyPath, false, false, context.currentTerm)
              };
            });

          case 'Path':
            return collectionDefinition.map(function (pathValue) {
              var $target = _resolveTarget(objectMap, context.currentTarget, pathValue.Path, true, false, context.currentTerm);

              var path = new Path(pathValue, $target, context.currentTerm, '');
              context.unresolvedAnnotations.push({
                inline: isAnnotationPath(pathValue.Path),
                toResolve: path
              });
              return path;
            });

          case 'AnnotationPath':
            return collectionDefinition.map(function (annotationPath, annotationIdx) {
              var annotationTarget = _resolveTarget(objectMap, context.currentTarget, annotationPath.AnnotationPath, true, false, context.currentTerm);

              var annotationCollectionElement = {
                type: 'AnnotationPath',
                value: annotationPath.AnnotationPath,
                fullyQualifiedName: "".concat(parentFQN, "/").concat(annotationIdx),
                $target: annotationTarget,
                annotationsTerm: context.currentTerm,
                term: '',
                path: ''
              };
              context.unresolvedAnnotations.push({
                inline: false,
                toResolve: annotationCollectionElement
              });
              return annotationCollectionElement;
            });

          case 'NavigationPropertyPath':
            return collectionDefinition.map(function (navPropertyPath, navPropIdx) {
              return {
                type: 'NavigationPropertyPath',
                value: navPropertyPath.NavigationPropertyPath,
                fullyQualifiedName: "".concat(parentFQN, "/").concat(navPropIdx),
                $target: _resolveTarget(objectMap, context.currentTarget, navPropertyPath.NavigationPropertyPath, false, false, context.currentTerm)
              };
            });

          case 'Record':
            return collectionDefinition.map(function (recordDefinition, recordIdx) {
              return parseRecord(recordDefinition, "".concat(parentFQN, "/").concat(recordIdx), objectMap, context);
            });

          case 'Apply':
          case 'Null':
          case 'If':
          case 'Eq':
          case 'Ne':
          case 'Lt':
          case 'Gt':
          case 'Le':
          case 'Ge':
          case 'Not':
          case 'And':
          case 'Or':
            return collectionDefinition.map(function (ifValue) {
              return ifValue;
            });

          case 'String':
            return collectionDefinition.map(function (stringValue) {
              if (typeof stringValue === 'string') {
                return stringValue;
              } else if (stringValue === undefined) {
                return stringValue;
              } else {
                return stringValue.String;
              }
            });

          default:
            if (collectionDefinition.length === 0) {
              return [];
            }

            throw new Error('Unsupported case');
        }
      }

      function convertAnnotation(annotation, objectMap, context) {
        if (annotation.record) {
          return parseRecord(annotation.record, annotation.fullyQualifiedName, objectMap, context);
        } else if (annotation.collection === undefined) {
          if (annotation.value) {
            return parseValue(annotation.value, annotation.fullyQualifiedName, objectMap, context);
          } else {
            return true;
          }
        } else if (annotation.collection) {
          var collection = parseCollection(annotation.collection, annotation.fullyQualifiedName, objectMap, context);
          collection.fullyQualifiedName = annotation.fullyQualifiedName;
          return collection;
        } else {
          throw new Error('Unsupported case');
        }
      }
      /**
       * Creates a resolvePath function for a given entityType.
       *
       * @param entityType The entityType for which the function should be created
       * @param objectMap The current objectMap
       * @returns the resolvePath function that starts at the entityType
       */


      function createResolvePathFn(entityType, objectMap) {
        return function (relativePath, includeVisitedObjects) {
          var annotationTerm = '';
          return _resolveTarget(objectMap, entityType, relativePath, false, includeVisitedObjects, annotationTerm);
        };
      }

      function resolveV2NavigationProperty(navProp, associations, objectMap, outNavProp) {
        var targetAssociation = associations.find(function (association) {
          return association.fullyQualifiedName === navProp.relationship;
        });

        if (targetAssociation) {
          var associationEnd = targetAssociation.associationEnd.find(function (end) {
            return end.role === navProp.toRole;
          });

          if (associationEnd) {
            outNavProp.targetType = objectMap[associationEnd.type];
            outNavProp.isCollection = associationEnd.multiplicity === '*';
          }
        }

        outNavProp.referentialConstraint = navProp.referentialConstraint || [];
      }

      function resolveV4NavigationProperty(navProp, objectMap, outNavProp) {
        outNavProp.targetType = objectMap[navProp.targetTypeName];
        outNavProp.partner = navProp.partner;
        outNavProp.isCollection = navProp.isCollection;
        outNavProp.containsTarget = navProp.containsTarget;
        outNavProp.referentialConstraint = navProp.referentialConstraint;
      }

      function isV4NavigationProperty(navProp) {
        return !!navProp.targetTypeName;
      }

      function prepareNavigationProperties(navigationProperties, associations, objectMap) {
        return navigationProperties.map(function (navProp) {
          var outNavProp = {
            _type: 'NavigationProperty',
            name: navProp.name,
            fullyQualifiedName: navProp.fullyQualifiedName,
            isCollection: false,
            containsTarget: false,
            referentialConstraint: [],
            annotations: {},
            partner: '',
            targetType: undefined,
            targetTypeName: ''
          };

          if (isV4NavigationProperty(navProp)) {
            resolveV4NavigationProperty(navProp, objectMap, outNavProp);
          } else {
            resolveV2NavigationProperty(navProp, associations, objectMap, outNavProp);
          }

          if (outNavProp.targetType) {
            outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
          }

          objectMap[outNavProp.fullyQualifiedName] = outNavProp;
          return outNavProp;
        });
      }
      /**
       * @param entityTypes
       * @param associations
       * @param objectMap
       */


      function resolveNavigationProperties(entityTypes, associations, objectMap) {
        entityTypes.forEach(function (entityType) {
          entityType.navigationProperties = prepareNavigationProperties(entityType.navigationProperties, associations, objectMap);
          entityType.resolvePath = createResolvePathFn(entityType, objectMap);
        });
      }
      /**
       * @param namespace
       * @param actions
       * @param objectMap
       */


      function linkActionsToEntityType(namespace, actions, objectMap) {
        actions.forEach(function (action) {
          if (!action.annotations) {
            action.annotations = {};
          }

          if (action.isBound) {
            var sourceEntityType = objectMap[action.sourceType];
            action.sourceEntityType = sourceEntityType;

            if (sourceEntityType) {
              if (!sourceEntityType.actions) {
                sourceEntityType.actions = {};
              }

              sourceEntityType.actions[action.name] = action;
              sourceEntityType.actions["".concat(namespace, ".").concat(action.name)] = action;
            }

            action.returnEntityType = objectMap[action.returnType];
          }
        });
      }
      /**
       * @param entitySets
       * @param objectMap
       * @param references
       */


      function linkEntityTypeToEntitySet(entitySets, objectMap, references) {
        entitySets.forEach(function (entitySet) {
          entitySet.entityType = objectMap[entitySet.entityTypeName];

          if (!entitySet.entityType) {
            entitySet.entityType = objectMap[(0, utils_1.unalias)(references, entitySet.entityTypeName)];
          }

          if (!entitySet.annotations) {
            entitySet.annotations = {};
          }

          if (!entitySet.entityType.annotations) {
            entitySet.entityType.annotations = {};
          }

          entitySet.entityType.keys.forEach(function (keyProp) {
            keyProp.isKey = true;
          });
        });
      }
      /**
       * @param singletons
       * @param objectMap
       * @param references
       */


      function linkEntityTypeToSingleton(singletons, objectMap, references) {
        singletons.forEach(function (singleton) {
          singleton.entityType = objectMap[singleton.entityTypeName];

          if (!singleton.entityType) {
            singleton.entityType = objectMap[(0, utils_1.unalias)(references, singleton.entityTypeName)];
          }

          if (!singleton.annotations) {
            singleton.annotations = {};
          }

          if (!singleton.entityType.annotations) {
            singleton.entityType.annotations = {};
          }

          singleton.entityType.keys.forEach(function (keyProp) {
            keyProp.isKey = true;
          });
        });
      }
      /**
       * @param entityTypes
       * @param objectMap
       */


      function linkPropertiesToComplexTypes(entityTypes, objectMap) {
        /**
         * @param property
         */
        function link(property) {
          if (!property.annotations) {
            property.annotations = {};
          }

          try {
            if (property.type.indexOf('Edm') !== 0) {
              var complexType;

              if (property.type.startsWith('Collection')) {
                var complexTypeName = property.type.substring(11, property.type.length - 1);
                complexType = objectMap[complexTypeName];
              } else {
                complexType = objectMap[property.type];
              }

              if (complexType) {
                property.targetType = complexType;

                if (complexType.properties) {
                  complexType.properties.forEach(link);
                }
              }
            }
          } catch (sError) {
            throw new Error('Property Type is not defined');
          }
        }

        entityTypes.forEach(function (entityType) {
          entityType.entityProperties.forEach(link);
        });
      }
      /**
       * @param complexTypes
       * @param associations
       * @param objectMap
       */


      function prepareComplexTypes(complexTypes, associations, objectMap) {
        complexTypes.forEach(function (complexType) {
          complexType.annotations = {};
          complexType.properties.forEach(function (property) {
            if (!property.annotations) {
              property.annotations = {};
            }
          });
          complexType.navigationProperties = prepareNavigationProperties(complexType.navigationProperties, associations, objectMap);
        });
      }
      /**
       * Split the alias from the term value.
       *
       * @param references the current set of references
       * @param termValue the value of the term
       * @returns the term alias and the actual term value
       */


      function splitTerm(references, termValue) {
        var aliasedTerm = (0, utils_1.alias)(references, termValue);
        var lastDot = aliasedTerm.lastIndexOf('.');
        var termAlias = aliasedTerm.substring(0, lastDot);
        var term = aliasedTerm.substring(lastDot + 1);
        return [termAlias, term];
      }
      /**
       * Creates the function that will resolve a specific path.
       *
       * @param convertedOutput
       * @param objectMap
       * @returns the function that will allow to resolve element globally.
       */


      function createGlobalResolve(convertedOutput, objectMap) {
        return function resolvePath(sPath) {
          var resolveDirectly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          if (resolveDirectly) {
            var targetPath = sPath;

            if (!sPath.startsWith('/')) {
              targetPath = "/".concat(sPath);
            }

            var targetResolution = _resolveTarget(objectMap, convertedOutput, targetPath, false, true);

            if (targetResolution.target) {
              targetResolution.visitedObjects.push(targetResolution.target);
            }

            return {
              target: targetResolution.target,
              objectPath: targetResolution.visitedObjects
            };
          }

          var aPathSplit = sPath.split('/');

          if (aPathSplit.shift() !== '') {
            throw new Error('Cannot deal with relative path');
          }

          var entitySetName = aPathSplit.shift();
          var entitySet = convertedOutput.entitySets.find(function (et) {
            return et.name === entitySetName;
          });
          var singleton = convertedOutput.singletons.find(function (et) {
            return et.name === entitySetName;
          });

          if (!entitySet && !singleton) {
            return {
              target: convertedOutput.entityContainer,
              objectPath: [convertedOutput.entityContainer]
            };
          }

          if (aPathSplit.length === 0) {
            return {
              target: entitySet || singleton,
              objectPath: [convertedOutput.entityContainer, entitySet || singleton]
            };
          } else {
            var _targetResolution = _resolveTarget(objectMap, entitySet || singleton, '/' + aPathSplit.join('/'), false, true);

            if (_targetResolution.target) {
              _targetResolution.visitedObjects.push(_targetResolution.target);
            }

            return {
              target: _targetResolution.target,
              objectPath: _targetResolution.visitedObjects
            };
          }
        };
      }

      function ensureAnnotations(currentTarget, vocAlias) {
        if (!currentTarget.annotations) {
          currentTarget.annotations = {};
        }

        if (!currentTarget.annotations[vocAlias]) {
          currentTarget.annotations[vocAlias] = {};
        }

        if (!currentTarget.annotations._annotations) {
          currentTarget.annotations._annotations = {};
        }
      }

      function processAnnotations(currentContext, annotationList, objectMap, bOverrideExisting) {
        var currentTarget = currentContext.currentTarget;
        var currentTargetName = currentTarget.fullyQualifiedName;
        annotationList.annotations.forEach(function (annotation) {
          var _a, _b;

          currentContext.currentSource = annotation.__source || annotationList.__source;

          var _splitTerm = splitTerm(utils_1.defaultReferences, annotation.term),
              _splitTerm2 = _slicedToArray(_splitTerm, 2),
              vocAlias = _splitTerm2[0],
              vocTerm = _splitTerm2[1];

          ensureAnnotations(currentTarget, vocAlias);
          var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? '#' + annotation.qualifier : '');

          if (!bOverrideExisting && ((_b = (_a = currentTarget.annotations) === null || _a === void 0 ? void 0 : _a[vocAlias]) === null || _b === void 0 ? void 0 : _b[vocTermWithQualifier]) !== undefined) {
            return;
          }

          currentContext.currentTerm = annotation.term;
          currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, objectMap, currentContext);

          switch (typeof currentTarget.annotations[vocAlias][vocTermWithQualifier]) {
            case 'string':
              // eslint-disable-next-line no-new-wrappers
              currentTarget.annotations[vocAlias][vocTermWithQualifier] = new String(currentTarget.annotations[vocAlias][vocTermWithQualifier]);
              break;

            case 'boolean':
              // eslint-disable-next-line no-new-wrappers
              currentTarget.annotations[vocAlias][vocTermWithQualifier] = new Boolean(currentTarget.annotations[vocAlias][vocTermWithQualifier]);
              break;

            default:
              // do nothing
              break;
          }

          if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === 'object' && !currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations) {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations = {};
          }

          if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === 'object') {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].term = (0, utils_1.unalias)(utils_1.defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
            currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
            currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = currentContext.currentSource;
          }

          var annotationTarget = "".concat(currentTargetName, "@").concat((0, utils_1.unalias)(utils_1.defaultReferences, vocAlias + '.' + vocTermWithQualifier));

          if (Array.isArray(annotation.annotations)) {
            var subAnnotationList = {
              target: annotationTarget,
              annotations: annotation.annotations,
              __source: currentContext.currentSource
            };
            currentContext.additionalAnnotations.push(subAnnotationList);
          } else if (annotation.annotations && !currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations) {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations = annotation.annotations;
          }

          currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations._annotations[(0, utils_1.unalias)(utils_1.defaultReferences, "".concat(vocAlias, ".").concat(vocTermWithQualifier))] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          objectMap[annotationTarget] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
        });
      }
      /**
       * Process all the unresolved targets so far to try and see if they are resolveable in the end.
       *
       * @param unresolvedTargets
       * @param objectMap
       */


      function processUnresolvedTargets(unresolvedTargets, objectMap) {
        unresolvedTargets.forEach(function (resolvable) {
          var targetToResolve = resolvable.toResolve;
          var targetStr = targetToResolve.$target;
          var resolvedTarget = objectMap[targetStr];
          var annotationsTerm = targetToResolve.annotationsTerm,
              annotationType = targetToResolve.annotationType;
          delete targetToResolve.annotationType;
          delete targetToResolve.annotationsTerm;

          if (resolvable.inline && !(resolvedTarget instanceof String)) {
            // inline the resolved target
            var keys;

            for (keys in targetToResolve) {
              delete targetToResolve[keys];
            }

            Object.assign(targetToResolve, resolvedTarget);
          } else {
            // assign the resolved target
            targetToResolve.$target = resolvedTarget;
          }

          if (!resolvedTarget) {
            targetToResolve.targetString = targetStr;

            if (annotationsTerm && annotationType) {
              var oErrorMsg = {
                message: 'Unable to resolve the path expression: ' + targetStr + '\n' + '\n' + 'Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n' + '<Annotation Term = ' + annotationsTerm + '>' + '\n' + '<Record Type = ' + annotationType + '>' + '\n' + '<AnnotationPath = ' + targetStr + '>'
              };
              addAnnotationErrorMessage(targetStr, oErrorMsg);
            } else {
              var property = targetToResolve.term;
              var path = targetToResolve.path;
              var termInfo = targetStr ? targetStr.split('/')[0] : targetStr;
              var _oErrorMsg = {
                message: 'Unable to resolve the path expression: ' + targetStr + '\n' + '\n' + 'Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n' + '<Annotation Term = ' + termInfo + '>' + '\n' + '<PropertyValue Property = ' + property + '        Path= ' + path + '>'
              };
              addAnnotationErrorMessage(targetStr, _oErrorMsg);
            }
          }
        });
      }
      /**
       * Merge annotation from different source together by overwriting at the term level.
       *
       * @param rawMetadata
       * @returns the resulting merged annotations
       */


      function mergeAnnotations(rawMetadata) {
        var annotationListPerTarget = {};
        Object.keys(rawMetadata.schema.annotations).forEach(function (annotationSource) {
          rawMetadata.schema.annotations[annotationSource].forEach(function (annotationList) {
            var currentTargetName = (0, utils_1.unalias)(rawMetadata.references, annotationList.target);
            annotationList.__source = annotationSource;

            if (!annotationListPerTarget[currentTargetName]) {
              annotationListPerTarget[currentTargetName] = {
                annotations: annotationList.annotations.concat(),
                target: currentTargetName
              };
              annotationListPerTarget[currentTargetName].__source = annotationSource;
            } else {
              annotationList.annotations.forEach(function (annotation) {
                var findIndex = annotationListPerTarget[currentTargetName].annotations.findIndex(function (referenceAnnotation) {
                  return referenceAnnotation.term === annotation.term && referenceAnnotation.qualifier === annotation.qualifier;
                });
                annotation.__source = annotationSource;

                if (findIndex !== -1) {
                  annotationListPerTarget[currentTargetName].annotations.splice(findIndex, 1, annotation);
                } else {
                  annotationListPerTarget[currentTargetName].annotations.push(annotation);
                }
              });
            }
          });
        });
        return annotationListPerTarget;
      }
      /**
       * Convert a RawMetadata into an object representation to be used to easily navigate a metadata object and its annotation.
       *
       * @param rawMetadata
       * @returns the converted representation of the metadata.
       */


      function convert(rawMetadata) {
        ANNOTATION_ERRORS = [];
        var objectMap = buildObjectMap(rawMetadata);
        resolveNavigationProperties(rawMetadata.schema.entityTypes, rawMetadata.schema.associations, objectMap);
        rawMetadata.schema.entityContainer.annotations = {};
        linkActionsToEntityType(rawMetadata.schema.namespace, rawMetadata.schema.actions, objectMap);
        linkEntityTypeToEntitySet(rawMetadata.schema.entitySets, objectMap, rawMetadata.references);
        linkEntityTypeToSingleton(rawMetadata.schema.singletons, objectMap, rawMetadata.references);
        linkPropertiesToComplexTypes(rawMetadata.schema.entityTypes, objectMap);
        prepareComplexTypes(rawMetadata.schema.complexTypes, rawMetadata.schema.associations, objectMap);
        var unresolvedTargets = [];
        var unresolvedAnnotations = [];
        var annotationListPerTarget = mergeAnnotations(rawMetadata);
        Object.keys(annotationListPerTarget).forEach(function (currentTargetName) {
          var annotationList = annotationListPerTarget[currentTargetName];
          var objectMapElement = objectMap[currentTargetName];

          if (!objectMapElement && (currentTargetName === null || currentTargetName === void 0 ? void 0 : currentTargetName.indexOf('@')) > 0) {
            unresolvedAnnotations.push(annotationList);
          } else if (objectMapElement) {
            var allTargets = [objectMapElement];
            var bOverrideExisting = true;

            if (objectMapElement._type === 'UnboundGenericAction') {
              allTargets = objectMapElement.actions;
              bOverrideExisting = false;
            }

            allTargets.forEach(function (currentTarget) {
              var currentContext = {
                additionalAnnotations: unresolvedAnnotations,
                currentSource: annotationList.__source,
                currentTarget: currentTarget,
                currentTerm: '',
                rawMetadata: rawMetadata,
                unresolvedAnnotations: unresolvedTargets
              };
              processAnnotations(currentContext, annotationList, objectMap, bOverrideExisting);
            });
          }
        });
        var extraUnresolvedAnnotations = [];
        unresolvedAnnotations.forEach(function (annotationList) {
          var currentTargetName = (0, utils_1.unalias)(rawMetadata.references, annotationList.target);

          var _currentTargetName$sp = currentTargetName.split('@'),
              _currentTargetName$sp2 = _slicedToArray(_currentTargetName$sp, 2),
              baseObj = _currentTargetName$sp2[0],
              annotationPart = _currentTargetName$sp2[1];

          var targetSplit = annotationPart.split('/');
          baseObj = baseObj + '@' + targetSplit[0];
          var currentTarget = targetSplit.slice(1).reduce(function (currentObj, path) {
            return currentObj === null || currentObj === void 0 ? void 0 : currentObj[path];
          }, objectMap[baseObj]);

          if (!currentTarget || typeof currentTarget !== 'object') {
            ANNOTATION_ERRORS.push({
              message: 'The following annotation target was not found on the service ' + currentTargetName
            });
          } else {
            var currentContext = {
              additionalAnnotations: extraUnresolvedAnnotations,
              currentSource: annotationList.__source,
              currentTarget: currentTarget,
              currentTerm: '',
              rawMetadata: rawMetadata,
              unresolvedAnnotations: unresolvedTargets
            };
            processAnnotations(currentContext, annotationList, objectMap, false);
          }
        });
        processUnresolvedTargets(unresolvedTargets, objectMap);

        for (var property in ALL_ANNOTATION_ERRORS) {
          ANNOTATION_ERRORS.push(ALL_ANNOTATION_ERRORS[property][0]);
        }

        rawMetadata.entitySets = rawMetadata.schema.entitySets;
        var extraReferences = rawMetadata.references.filter(function (reference) {
          return utils_1.defaultReferences.find(function (defaultRef) {
            return defaultRef.namespace === reference.namespace;
          }) === undefined;
        });
        var convertedOutput = {
          version: rawMetadata.version,
          annotations: rawMetadata.schema.annotations,
          namespace: rawMetadata.schema.namespace,
          entityContainer: rawMetadata.schema.entityContainer,
          actions: rawMetadata.schema.actions,
          entitySets: rawMetadata.schema.entitySets,
          singletons: rawMetadata.schema.singletons,
          entityTypes: rawMetadata.schema.entityTypes,
          complexTypes: rawMetadata.schema.complexTypes,
          typeDefinitions: rawMetadata.schema.typeDefinitions,
          references: utils_1.defaultReferences.concat(extraReferences),
          diagnostics: ANNOTATION_ERRORS.concat()
        };
        convertedOutput.resolvePath = createGlobalResolve(convertedOutput, objectMap);
        return convertedOutput;
      }

      exports.convert = convert;
      /***/
    },

    /***/
    759:
    /***/
    function (__unused_webpack_module, exports, __webpack_require__) {
      var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);

        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            }
          };
        }

        Object.defineProperty(o, k2, desc);
      } : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });

      var __exportStar = this && this.__exportStar || function (m, exports) {
        for (var p in m) {
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        }
      };

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      __exportStar(__webpack_require__(875), exports);

      __exportStar(__webpack_require__(426), exports);

      __exportStar(__webpack_require__(69), exports);
      /***/

    },

    /***/
    69:
    /***/
    function (__unused_webpack_module, exports) {
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Decimal = exports.isComplexTypeDefinition = exports.TermToTypes = exports.unalias = exports.alias = exports.defaultReferences = void 0;
      exports.defaultReferences = [{
        alias: 'Capabilities',
        namespace: 'Org.OData.Capabilities.V1',
        uri: ''
      }, {
        alias: 'Aggregation',
        namespace: 'Org.OData.Aggregation.V1',
        uri: ''
      }, {
        alias: 'Validation',
        namespace: 'Org.OData.Validation.V1',
        uri: ''
      }, {
        namespace: 'Org.OData.Core.V1',
        alias: 'Core',
        uri: ''
      }, {
        namespace: 'Org.OData.Measures.V1',
        alias: 'Measures',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.Common.v1',
        alias: 'Common',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.UI.v1',
        alias: 'UI',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.Session.v1',
        alias: 'Session',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.Analytics.v1',
        alias: 'Analytics',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.CodeList.v1',
        alias: 'CodeList',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.PersonalData.v1',
        alias: 'PersonalData',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.Communication.v1',
        alias: 'Communication',
        uri: ''
      }, {
        namespace: 'com.sap.vocabularies.HTML5.v1',
        alias: 'HTML5',
        uri: ''
      }];
      /**
       * Transform an unaliased string representation annotation to the aliased version.
       *
       * @param references currentReferences for the project
       * @param unaliasedValue the unaliased value
       * @returns the aliased string representing the same
       */

      function alias(references, unaliasedValue) {
        if (!references.reverseReferenceMap) {
          references.reverseReferenceMap = references.reduce(function (map, ref) {
            map[ref.namespace] = ref;
            return map;
          }, {});
        }

        if (!unaliasedValue) {
          return unaliasedValue;
        }

        var lastDotIndex = unaliasedValue.lastIndexOf('.');
        var namespace = unaliasedValue.substring(0, lastDotIndex);
        var value = unaliasedValue.substring(lastDotIndex + 1);
        var reference = references.reverseReferenceMap[namespace];

        if (reference) {
          return "".concat(reference.alias, ".").concat(value);
        } else if (unaliasedValue.indexOf('@') !== -1) {
          // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
          var _unaliasedValue$split = unaliasedValue.split('@'),
              _unaliasedValue$split2 = _toArray(_unaliasedValue$split),
              preAlias = _unaliasedValue$split2[0],
              postAlias = _unaliasedValue$split2.slice(1);

          return "".concat(preAlias, "@").concat(alias(references, postAlias.join('@')));
        } else {
          return unaliasedValue;
        }
      }

      exports.alias = alias;
      /**
       * Transform an aliased string representation annotation to the unaliased version.
       *
       * @param references currentReferences for the project
       * @param aliasedValue the aliased value
       * @returns the unaliased string representing the same
       */

      function unalias(references, aliasedValue) {
        if (!references.referenceMap) {
          references.referenceMap = references.reduce(function (map, ref) {
            map[ref.alias] = ref;
            return map;
          }, {});
        }

        if (!aliasedValue) {
          return aliasedValue;
        }

        var _aliasedValue$split = aliasedValue.split('.'),
            _aliasedValue$split2 = _toArray(_aliasedValue$split),
            vocAlias = _aliasedValue$split2[0],
            value = _aliasedValue$split2.slice(1);

        var reference = references.referenceMap[vocAlias];

        if (reference) {
          return "".concat(reference.namespace, ".").concat(value.join('.'));
        } else if (aliasedValue.indexOf('@') !== -1) {
          // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
          var _aliasedValue$split3 = aliasedValue.split('@'),
              _aliasedValue$split4 = _toArray(_aliasedValue$split3),
              preAlias = _aliasedValue$split4[0],
              postAlias = _aliasedValue$split4.slice(1);

          return "".concat(preAlias, "@").concat(unalias(references, postAlias.join('@')));
        } else {
          return aliasedValue;
        }
      }

      exports.unalias = unalias;
      var TermToTypes;

      (function (TermToTypes) {
        TermToTypes["Org.OData.Authorization.V1.SecuritySchemes"] = "Org.OData.Authorization.V1.SecurityScheme";
        TermToTypes["Org.OData.Authorization.V1.Authorizations"] = "Org.OData.Authorization.V1.Authorization";
        TermToTypes["Org.OData.Core.V1.Revisions"] = "Org.OData.Core.V1.RevisionType";
        TermToTypes["Org.OData.Core.V1.Links"] = "Org.OData.Core.V1.Link";
        TermToTypes["Org.OData.Core.V1.Example"] = "Org.OData.Core.V1.ExampleValue";
        TermToTypes["Org.OData.Core.V1.Messages"] = "Org.OData.Core.V1.MessageType";
        TermToTypes["Org.OData.Core.V1.ValueException"] = "Org.OData.Core.V1.ValueExceptionType";
        TermToTypes["Org.OData.Core.V1.ResourceException"] = "Org.OData.Core.V1.ResourceExceptionType";
        TermToTypes["Org.OData.Core.V1.DataModificationException"] = "Org.OData.Core.V1.DataModificationExceptionType";
        TermToTypes["Org.OData.Core.V1.IsLanguageDependent"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.DereferenceableIDs"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.ConventionalIDs"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.Permissions"] = "Org.OData.Core.V1.Permission";
        TermToTypes["Org.OData.Core.V1.DefaultNamespace"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.Immutable"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.Computed"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.ComputedDefaultValue"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.IsURL"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.IsMediaType"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.ContentDisposition"] = "Org.OData.Core.V1.ContentDispositionType";
        TermToTypes["Org.OData.Core.V1.OptimisticConcurrency"] = "Edm.PropertyPath";
        TermToTypes["Org.OData.Core.V1.AdditionalProperties"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.AutoExpand"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.AutoExpandReferences"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.MayImplement"] = "Org.OData.Core.V1.QualifiedTypeName";
        TermToTypes["Org.OData.Core.V1.Ordered"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.PositionalInsert"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Core.V1.AlternateKeys"] = "Org.OData.Core.V1.AlternateKey";
        TermToTypes["Org.OData.Core.V1.OptionalParameter"] = "Org.OData.Core.V1.OptionalParameterType";
        TermToTypes["Org.OData.Core.V1.OperationAvailable"] = "Edm.Boolean";
        TermToTypes["Org.OData.Core.V1.SymbolicName"] = "Org.OData.Core.V1.SimpleIdentifier";
        TermToTypes["Org.OData.Capabilities.V1.ConformanceLevel"] = "Org.OData.Capabilities.V1.ConformanceLevelType";
        TermToTypes["Org.OData.Capabilities.V1.AsynchronousRequestsSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.BatchContinueOnErrorSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.IsolationSupported"] = "Org.OData.Capabilities.V1.IsolationLevel";
        TermToTypes["Org.OData.Capabilities.V1.CrossJoinSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.CallbackSupported"] = "Org.OData.Capabilities.V1.CallbackType";
        TermToTypes["Org.OData.Capabilities.V1.ChangeTracking"] = "Org.OData.Capabilities.V1.ChangeTrackingType";
        TermToTypes["Org.OData.Capabilities.V1.CountRestrictions"] = "Org.OData.Capabilities.V1.CountRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.NavigationRestrictions"] = "Org.OData.Capabilities.V1.NavigationRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.IndexableByKey"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.TopSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.SkipSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.ComputeSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.SelectSupport"] = "Org.OData.Capabilities.V1.SelectSupportType";
        TermToTypes["Org.OData.Capabilities.V1.BatchSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.BatchSupport"] = "Org.OData.Capabilities.V1.BatchSupportType";
        TermToTypes["Org.OData.Capabilities.V1.FilterRestrictions"] = "Org.OData.Capabilities.V1.FilterRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.SortRestrictions"] = "Org.OData.Capabilities.V1.SortRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.ExpandRestrictions"] = "Org.OData.Capabilities.V1.ExpandRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.SearchRestrictions"] = "Org.OData.Capabilities.V1.SearchRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.KeyAsSegmentSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.QuerySegmentSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.InsertRestrictions"] = "Org.OData.Capabilities.V1.InsertRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.DeepInsertSupport"] = "Org.OData.Capabilities.V1.DeepInsertSupportType";
        TermToTypes["Org.OData.Capabilities.V1.UpdateRestrictions"] = "Org.OData.Capabilities.V1.UpdateRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.DeepUpdateSupport"] = "Org.OData.Capabilities.V1.DeepUpdateSupportType";
        TermToTypes["Org.OData.Capabilities.V1.DeleteRestrictions"] = "Org.OData.Capabilities.V1.DeleteRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.CollectionPropertyRestrictions"] = "Org.OData.Capabilities.V1.CollectionPropertyRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.OperationRestrictions"] = "Org.OData.Capabilities.V1.OperationRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.AnnotationValuesInQuerySupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Capabilities.V1.ModificationQueryOptions"] = "Org.OData.Capabilities.V1.ModificationQueryOptionsType";
        TermToTypes["Org.OData.Capabilities.V1.ReadRestrictions"] = "Org.OData.Capabilities.V1.ReadRestrictionsType";
        TermToTypes["Org.OData.Capabilities.V1.CustomHeaders"] = "Org.OData.Capabilities.V1.CustomParameter";
        TermToTypes["Org.OData.Capabilities.V1.CustomQueryOptions"] = "Org.OData.Capabilities.V1.CustomParameter";
        TermToTypes["Org.OData.Capabilities.V1.MediaLocationUpdateSupported"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Aggregation.V1.ApplySupported"] = "Org.OData.Aggregation.V1.ApplySupportedType";
        TermToTypes["Org.OData.Aggregation.V1.Groupable"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Aggregation.V1.Aggregatable"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Aggregation.V1.ContextDefiningProperties"] = "Edm.PropertyPath";
        TermToTypes["Org.OData.Aggregation.V1.LeveledHierarchy"] = "Edm.PropertyPath";
        TermToTypes["Org.OData.Aggregation.V1.RecursiveHierarchy"] = "Org.OData.Aggregation.V1.RecursiveHierarchyType";
        TermToTypes["Org.OData.Aggregation.V1.AvailableOnAggregates"] = "Org.OData.Aggregation.V1.AvailableOnAggregatesType";
        TermToTypes["Org.OData.Validation.V1.Minimum"] = "Edm.PrimitiveType";
        TermToTypes["Org.OData.Validation.V1.Maximum"] = "Edm.PrimitiveType";
        TermToTypes["Org.OData.Validation.V1.Exclusive"] = "Org.OData.Core.V1.Tag";
        TermToTypes["Org.OData.Validation.V1.AllowedValues"] = "Org.OData.Validation.V1.AllowedValue";
        TermToTypes["Org.OData.Validation.V1.MultipleOf"] = "Edm.Decimal";
        TermToTypes["Org.OData.Validation.V1.Constraint"] = "Org.OData.Validation.V1.ConstraintType";
        TermToTypes["Org.OData.Validation.V1.ItemsOf"] = "Org.OData.Validation.V1.ItemsOfType";
        TermToTypes["Org.OData.Validation.V1.OpenPropertyTypeConstraint"] = "Org.OData.Core.V1.QualifiedTypeName";
        TermToTypes["Org.OData.Validation.V1.DerivedTypeConstraint"] = "Org.OData.Core.V1.QualifiedTypeName";
        TermToTypes["Org.OData.Validation.V1.AllowedTerms"] = "Org.OData.Core.V1.QualifiedTermName";
        TermToTypes["Org.OData.Validation.V1.ApplicableTerms"] = "Org.OData.Core.V1.QualifiedTermName";
        TermToTypes["Org.OData.Validation.V1.MaxItems"] = "Edm.Int64";
        TermToTypes["Org.OData.Validation.V1.MinItems"] = "Edm.Int64";
        TermToTypes["Org.OData.Measures.V1.Scale"] = "Edm.Byte";
        TermToTypes["Org.OData.Measures.V1.DurationGranularity"] = "Org.OData.Measures.V1.DurationGranularityType";
        TermToTypes["com.sap.vocabularies.Analytics.v1.Dimension"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Analytics.v1.Measure"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Analytics.v1.AccumulativeMeasure"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Analytics.v1.RolledUpPropertyCount"] = "Edm.Int16";
        TermToTypes["com.sap.vocabularies.Analytics.v1.PlanningAction"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Analytics.v1.AggregatedProperties"] = "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType";
        TermToTypes["com.sap.vocabularies.Common.v1.ServiceVersion"] = "Edm.Int32";
        TermToTypes["com.sap.vocabularies.Common.v1.ServiceSchemaVersion"] = "Edm.Int32";
        TermToTypes["com.sap.vocabularies.Common.v1.TextFor"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.IsLanguageIdentifier"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.TextFormat"] = "com.sap.vocabularies.Common.v1.TextFormatType";
        TermToTypes["com.sap.vocabularies.Common.v1.IsDigitSequence"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsUpperCase"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCurrency"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsUnit"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.UnitSpecificScale"] = "Edm.PrimitiveType";
        TermToTypes["com.sap.vocabularies.Common.v1.UnitSpecificPrecision"] = "Edm.PrimitiveType";
        TermToTypes["com.sap.vocabularies.Common.v1.SecondaryKey"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.MinOccurs"] = "Edm.Int64";
        TermToTypes["com.sap.vocabularies.Common.v1.MaxOccurs"] = "Edm.Int64";
        TermToTypes["com.sap.vocabularies.Common.v1.AssociationEntity"] = "Edm.NavigationPropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.DerivedNavigation"] = "Edm.NavigationPropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.Masked"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.MaskedAlways"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.SemanticObjectMapping"] = "com.sap.vocabularies.Common.v1.SemanticObjectMappingType";
        TermToTypes["com.sap.vocabularies.Common.v1.IsInstanceAnnotation"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.FilterExpressionRestrictions"] = "com.sap.vocabularies.Common.v1.FilterExpressionRestrictionType";
        TermToTypes["com.sap.vocabularies.Common.v1.FieldControl"] = "com.sap.vocabularies.Common.v1.FieldControlType";
        TermToTypes["com.sap.vocabularies.Common.v1.Application"] = "com.sap.vocabularies.Common.v1.ApplicationType";
        TermToTypes["com.sap.vocabularies.Common.v1.Timestamp"] = "Edm.DateTimeOffset";
        TermToTypes["com.sap.vocabularies.Common.v1.ErrorResolution"] = "com.sap.vocabularies.Common.v1.ErrorResolutionType";
        TermToTypes["com.sap.vocabularies.Common.v1.Messages"] = "Edm.ComplexType";
        TermToTypes["com.sap.vocabularies.Common.v1.numericSeverity"] = "com.sap.vocabularies.Common.v1.NumericMessageSeverityType";
        TermToTypes["com.sap.vocabularies.Common.v1.MaximumNumericMessageSeverity"] = "com.sap.vocabularies.Common.v1.NumericMessageSeverityType";
        TermToTypes["com.sap.vocabularies.Common.v1.IsActionCritical"] = "Edm.Boolean";
        TermToTypes["com.sap.vocabularies.Common.v1.Attributes"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.RelatedRecursiveHierarchy"] = "Edm.AnnotationPath";
        TermToTypes["com.sap.vocabularies.Common.v1.Interval"] = "com.sap.vocabularies.Common.v1.IntervalType";
        TermToTypes["com.sap.vocabularies.Common.v1.ResultContext"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.WeakReferentialConstraint"] = "com.sap.vocabularies.Common.v1.WeakReferentialConstraintType";
        TermToTypes["com.sap.vocabularies.Common.v1.IsNaturalPerson"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.ValueList"] = "com.sap.vocabularies.Common.v1.ValueListType";
        TermToTypes["com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"] = "com.sap.vocabularies.Common.v1.SimpleIdentifier";
        TermToTypes["com.sap.vocabularies.Common.v1.ValueListWithFixedValues"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.ValueListMapping"] = "com.sap.vocabularies.Common.v1.ValueListMappingType";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYear"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarHalfyear"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarQuarter"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarMonth"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarWeek"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfCalendarMonth"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfCalendarYear"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearHalfyear"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarDate"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYear"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalPeriod"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearPeriod"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalQuarter"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearQuarter"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalWeek"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearWeek"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfFiscalYear"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearVariant"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.MutuallyExclusiveTerm"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Common.v1.DraftRoot"] = "com.sap.vocabularies.Common.v1.DraftRootType";
        TermToTypes["com.sap.vocabularies.Common.v1.DraftNode"] = "com.sap.vocabularies.Common.v1.DraftNodeType";
        TermToTypes["com.sap.vocabularies.Common.v1.DraftActivationVia"] = "com.sap.vocabularies.Common.v1.SimpleIdentifier";
        TermToTypes["com.sap.vocabularies.Common.v1.EditableFieldFor"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.SemanticKey"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.Common.v1.SideEffects"] = "com.sap.vocabularies.Common.v1.SideEffectsType";
        TermToTypes["com.sap.vocabularies.Common.v1.DefaultValuesFunction"] = "com.sap.vocabularies.Common.v1.QualifiedName";
        TermToTypes["com.sap.vocabularies.Common.v1.FilterDefaultValue"] = "Edm.PrimitiveType";
        TermToTypes["com.sap.vocabularies.Common.v1.FilterDefaultValueHigh"] = "Edm.PrimitiveType";
        TermToTypes["com.sap.vocabularies.Common.v1.SortOrder"] = "com.sap.vocabularies.Common.v1.SortOrderType";
        TermToTypes["com.sap.vocabularies.Common.v1.RecursiveHierarchy"] = "com.sap.vocabularies.Common.v1.RecursiveHierarchyType";
        TermToTypes["com.sap.vocabularies.Common.v1.CreatedAt"] = "Edm.DateTimeOffset";
        TermToTypes["com.sap.vocabularies.Common.v1.CreatedBy"] = "com.sap.vocabularies.Common.v1.UserID";
        TermToTypes["com.sap.vocabularies.Common.v1.ChangedAt"] = "Edm.DateTimeOffset";
        TermToTypes["com.sap.vocabularies.Common.v1.ChangedBy"] = "com.sap.vocabularies.Common.v1.UserID";
        TermToTypes["com.sap.vocabularies.Common.v1.ApplyMultiUnitBehaviorForSortingAndFiltering"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.CodeList.v1.CurrencyCodes"] = "com.sap.vocabularies.CodeList.v1.CodeListSource";
        TermToTypes["com.sap.vocabularies.CodeList.v1.UnitsOfMeasure"] = "com.sap.vocabularies.CodeList.v1.CodeListSource";
        TermToTypes["com.sap.vocabularies.CodeList.v1.StandardCode"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.CodeList.v1.ExternalCode"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.CodeList.v1.IsConfigurationDeprecationCode"] = "Edm.Boolean";
        TermToTypes["com.sap.vocabularies.Communication.v1.Contact"] = "com.sap.vocabularies.Communication.v1.ContactType";
        TermToTypes["com.sap.vocabularies.Communication.v1.Address"] = "com.sap.vocabularies.Communication.v1.AddressType";
        TermToTypes["com.sap.vocabularies.Communication.v1.IsEmailAddress"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Communication.v1.IsPhoneNumber"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Communication.v1.Event"] = "com.sap.vocabularies.Communication.v1.EventData";
        TermToTypes["com.sap.vocabularies.Communication.v1.Task"] = "com.sap.vocabularies.Communication.v1.TaskData";
        TermToTypes["com.sap.vocabularies.Communication.v1.Message"] = "com.sap.vocabularies.Communication.v1.MessageData";
        TermToTypes["com.sap.vocabularies.Hierarchy.v1.RecursiveHierarchy"] = "com.sap.vocabularies.Hierarchy.v1.RecursiveHierarchyType";
        TermToTypes["com.sap.vocabularies.PersonalData.v1.EntitySemantics"] = "com.sap.vocabularies.PersonalData.v1.EntitySemanticsType";
        TermToTypes["com.sap.vocabularies.PersonalData.v1.FieldSemantics"] = "com.sap.vocabularies.PersonalData.v1.FieldSemanticsType";
        TermToTypes["com.sap.vocabularies.PersonalData.v1.IsPotentiallyPersonal"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.Session.v1.StickySessionSupported"] = "com.sap.vocabularies.Session.v1.StickySessionSupportedType";
        TermToTypes["com.sap.vocabularies.UI.v1.HeaderInfo"] = "com.sap.vocabularies.UI.v1.HeaderInfoType";
        TermToTypes["com.sap.vocabularies.UI.v1.Identification"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
        TermToTypes["com.sap.vocabularies.UI.v1.Badge"] = "com.sap.vocabularies.UI.v1.BadgeType";
        TermToTypes["com.sap.vocabularies.UI.v1.LineItem"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
        TermToTypes["com.sap.vocabularies.UI.v1.StatusInfo"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
        TermToTypes["com.sap.vocabularies.UI.v1.FieldGroup"] = "com.sap.vocabularies.UI.v1.FieldGroupType";
        TermToTypes["com.sap.vocabularies.UI.v1.ConnectedFields"] = "com.sap.vocabularies.UI.v1.ConnectedFieldsType";
        TermToTypes["com.sap.vocabularies.UI.v1.GeoLocations"] = "com.sap.vocabularies.UI.v1.GeoLocationType";
        TermToTypes["com.sap.vocabularies.UI.v1.GeoLocation"] = "com.sap.vocabularies.UI.v1.GeoLocationType";
        TermToTypes["com.sap.vocabularies.UI.v1.Contacts"] = "Edm.AnnotationPath";
        TermToTypes["com.sap.vocabularies.UI.v1.MediaResource"] = "com.sap.vocabularies.UI.v1.MediaResourceType";
        TermToTypes["com.sap.vocabularies.UI.v1.DataPoint"] = "com.sap.vocabularies.UI.v1.DataPointType";
        TermToTypes["com.sap.vocabularies.UI.v1.KPI"] = "com.sap.vocabularies.UI.v1.KPIType";
        TermToTypes["com.sap.vocabularies.UI.v1.Chart"] = "com.sap.vocabularies.UI.v1.ChartDefinitionType";
        TermToTypes["com.sap.vocabularies.UI.v1.ValueCriticality"] = "com.sap.vocabularies.UI.v1.ValueCriticalityType";
        TermToTypes["com.sap.vocabularies.UI.v1.CriticalityLabels"] = "com.sap.vocabularies.UI.v1.CriticalityLabelType";
        TermToTypes["com.sap.vocabularies.UI.v1.SelectionFields"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.UI.v1.Facets"] = "com.sap.vocabularies.UI.v1.Facet";
        TermToTypes["com.sap.vocabularies.UI.v1.HeaderFacets"] = "com.sap.vocabularies.UI.v1.Facet";
        TermToTypes["com.sap.vocabularies.UI.v1.QuickViewFacets"] = "com.sap.vocabularies.UI.v1.Facet";
        TermToTypes["com.sap.vocabularies.UI.v1.QuickCreateFacets"] = "com.sap.vocabularies.UI.v1.Facet";
        TermToTypes["com.sap.vocabularies.UI.v1.FilterFacets"] = "com.sap.vocabularies.UI.v1.ReferenceFacet";
        TermToTypes["com.sap.vocabularies.UI.v1.SelectionPresentationVariant"] = "com.sap.vocabularies.UI.v1.SelectionPresentationVariantType";
        TermToTypes["com.sap.vocabularies.UI.v1.PresentationVariant"] = "com.sap.vocabularies.UI.v1.PresentationVariantType";
        TermToTypes["com.sap.vocabularies.UI.v1.SelectionVariant"] = "com.sap.vocabularies.UI.v1.SelectionVariantType";
        TermToTypes["com.sap.vocabularies.UI.v1.ThingPerspective"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.IsSummary"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.PartOfPreview"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.Map"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.Gallery"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.IsImageURL"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.IsImage"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.MultiLineText"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.TextArrangement"] = "com.sap.vocabularies.UI.v1.TextArrangementType";
        TermToTypes["com.sap.vocabularies.UI.v1.Importance"] = "com.sap.vocabularies.UI.v1.ImportanceType";
        TermToTypes["com.sap.vocabularies.UI.v1.Hidden"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.CreateHidden"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.UpdateHidden"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.DeleteHidden"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.HiddenFilter"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.DataFieldDefault"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
        TermToTypes["com.sap.vocabularies.UI.v1.Criticality"] = "com.sap.vocabularies.UI.v1.CriticalityType";
        TermToTypes["com.sap.vocabularies.UI.v1.CriticalityCalculation"] = "com.sap.vocabularies.UI.v1.CriticalityCalculationType";
        TermToTypes["com.sap.vocabularies.UI.v1.Emphasized"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.UI.v1.OrderBy"] = "Edm.PropertyPath";
        TermToTypes["com.sap.vocabularies.UI.v1.ParameterDefaultValue"] = "Edm.PrimitiveType";
        TermToTypes["com.sap.vocabularies.UI.v1.RecommendationState"] = "com.sap.vocabularies.UI.v1.RecommendationStateType";
        TermToTypes["com.sap.vocabularies.UI.v1.RecommendationList"] = "com.sap.vocabularies.UI.v1.RecommendationListType";
        TermToTypes["com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] = "Org.OData.Core.V1.Tag";
        TermToTypes["com.sap.vocabularies.HTML5.v1.CssDefaults"] = "com.sap.vocabularies.HTML5.v1.CssDefaultsType";
      })(TermToTypes = exports.TermToTypes || (exports.TermToTypes = {}));
      /**
       * Differentiate between a ComplexType and a TypeDefinition.
       * @param complexTypeDefinition
       * @returns true if the value is a complex type
       */


      function isComplexTypeDefinition(complexTypeDefinition) {
        return !!complexTypeDefinition && complexTypeDefinition._type === 'ComplexType' && !!complexTypeDefinition.properties;
      }

      exports.isComplexTypeDefinition = isComplexTypeDefinition;

      function Decimal(value) {
        return {
          isDecimal: function () {
            return true;
          },
          valueOf: function () {
            return value;
          },
          toString: function () {
            return value.toString();
          }
        };
      }

      exports.Decimal = Decimal;
      /***/
    },

    /***/
    426:
    /***/
    function (__unused_webpack_module, exports, __webpack_require__) {
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.revertTermToGenericType = void 0;

      var utils_1 = __webpack_require__(69);
      /**
       * Revert an object to its raw type equivalent.
       *
       * @param references the current reference
       * @param value the value to revert
       * @returns the raw value
       */


      function revertObjectToRawType(references, value) {
        var _a, _b;

        var result;

        if (Array.isArray(value)) {
          result = {
            type: 'Collection',
            Collection: value.map(function (anno) {
              return revertCollectionItemToRawType(references, anno);
            })
          };
        } else if ((_a = value.isDecimal) === null || _a === void 0 ? void 0 : _a.call(value)) {
          result = {
            type: 'Decimal',
            Decimal: value.valueOf()
          };
        } else if ((_b = value.isString) === null || _b === void 0 ? void 0 : _b.call(value)) {
          var valueMatches = value.split('.');

          if (valueMatches.length > 1 && references.find(function (ref) {
            return ref.alias === valueMatches[0];
          })) {
            result = {
              type: 'EnumMember',
              EnumMember: value.valueOf()
            };
          } else {
            result = {
              type: 'String',
              String: value.valueOf()
            };
          }
        } else if (value.type === 'Path') {
          result = {
            type: 'Path',
            Path: value.path
          };
        } else if (value.type === 'AnnotationPath') {
          result = {
            type: 'AnnotationPath',
            AnnotationPath: value.value
          };
        } else if (value.type === 'Apply') {
          result = {
            type: 'Apply',
            Apply: value.Apply
          };
        } else if (value.type === 'Null') {
          result = {
            type: 'Null'
          };
        } else if (value.type === 'PropertyPath') {
          result = {
            type: 'PropertyPath',
            PropertyPath: value.value
          };
        } else if (value.type === 'NavigationPropertyPath') {
          result = {
            type: 'NavigationPropertyPath',
            NavigationPropertyPath: value.value
          };
        } else if (Object.prototype.hasOwnProperty.call(value, '$Type')) {
          result = {
            type: 'Record',
            Record: revertCollectionItemToRawType(references, value)
          };
        }

        return result;
      }
      /**
       * Revert a value to its raw value depending on its type.
       *
       * @param references the current set of reference
       * @param value the value to revert
       * @returns the raw expression
       */


      function revertValueToRawType(references, value) {
        var result;
        var valueConstructor = value === null || value === void 0 ? void 0 : value.constructor.name;

        switch (valueConstructor) {
          case 'String':
          case 'string':
            var valueMatches = value.toString().split('.');

            if (valueMatches.length > 1 && references.find(function (ref) {
              return ref.alias === valueMatches[0];
            })) {
              result = {
                type: 'EnumMember',
                EnumMember: value.toString()
              };
            } else {
              result = {
                type: 'String',
                String: value.toString()
              };
            }

            break;

          case 'Boolean':
          case 'boolean':
            result = {
              type: 'Bool',
              Bool: value.valueOf()
            };
            break;

          case 'Number':
          case 'number':
            if (value.toString() === value.toFixed()) {
              result = {
                type: 'Int',
                Int: value.valueOf()
              };
            } else {
              result = {
                type: 'Decimal',
                Decimal: value.valueOf()
              };
            }

            break;

          case 'object':
          default:
            result = revertObjectToRawType(references, value);
            break;
        }

        return result;
      }

      var restrictedKeys = ['$Type', 'term', '__source', 'qualifier', 'ActionTarget', 'fullyQualifiedName', 'annotations'];
      /**
       * Revert the current embedded annotations to their raw type.
       *
       * @param references the current set of reference
       * @param currentAnnotations the collection item to evaluate
       * @param targetAnnotations the place where we need to add the annotation
       */

      function revertAnnotationsToRawType(references, currentAnnotations, targetAnnotations) {
        Object.keys(currentAnnotations).filter(function (key) {
          return key !== '_annotations';
        }).forEach(function (key) {
          Object.keys(currentAnnotations[key]).forEach(function (term) {
            var parsedAnnotation = revertTermToGenericType(references, currentAnnotations[key][term]);

            if (!parsedAnnotation.term) {
              var unaliasedTerm = (0, utils_1.unalias)(references, "".concat(key, ".").concat(term));

              if (unaliasedTerm) {
                var qualifiedSplit = unaliasedTerm.split('#');
                parsedAnnotation.term = qualifiedSplit[0];

                if (qualifiedSplit.length > 1) {
                  // Sub Annotation with a qualifier, not sure when that can happen in real scenarios
                  parsedAnnotation.qualifier = qualifiedSplit[1];
                }
              }
            }

            targetAnnotations.push(parsedAnnotation);
          });
        });
      }
      /**
       * Revert the current collection item to the corresponding raw annotation.
       *
       * @param references the current set of reference
       * @param collectionItem the collection item to evaluate
       * @returns the raw type equivalent
       */


      function revertCollectionItemToRawType(references, collectionItem) {
        if (typeof collectionItem === 'string') {
          return collectionItem;
        } else if (typeof collectionItem === 'object') {
          if (collectionItem.hasOwnProperty('$Type')) {
            // Annotation Record
            var outItem = {
              type: collectionItem.$Type,
              propertyValues: []
            }; // Could validate keys and type based on $Type

            Object.keys(collectionItem).forEach(function (collectionKey) {
              if (restrictedKeys.indexOf(collectionKey) === -1) {
                var value = collectionItem[collectionKey];
                outItem.propertyValues.push({
                  name: collectionKey,
                  value: revertValueToRawType(references, value)
                });
              } else if (collectionKey === 'annotations' && Object.keys(collectionItem[collectionKey]).length > 0) {
                outItem.annotations = [];
                revertAnnotationsToRawType(references, collectionItem[collectionKey], outItem.annotations);
              }
            });
            return outItem;
          } else if (collectionItem.type === 'PropertyPath') {
            return {
              type: 'PropertyPath',
              PropertyPath: collectionItem.value
            };
          } else if (collectionItem.type === 'AnnotationPath') {
            return {
              type: 'AnnotationPath',
              AnnotationPath: collectionItem.value
            };
          } else if (collectionItem.type === 'NavigationPropertyPath') {
            return {
              type: 'NavigationPropertyPath',
              NavigationPropertyPath: collectionItem.value
            };
          }
        }
      }
      /**
       * Revert an annotation term to it's generic or raw equivalent.
       *
       * @param references the reference of the current context
       * @param annotation the annotation term to revert
       * @returns the raw annotation
       */


      function revertTermToGenericType(references, annotation) {
        var baseAnnotation = {
          term: annotation.term,
          qualifier: annotation.qualifier
        };

        if (Array.isArray(annotation)) {
          // Collection
          if (annotation.hasOwnProperty('annotations') && Object.keys(annotation.annotations).length > 0) {
            // Annotation on a collection itself, not sure when that happens if at all
            baseAnnotation.annotations = [];
            revertAnnotationsToRawType(references, annotation.annotations, baseAnnotation.annotations);
          }

          return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
            collection: annotation.map(function (anno) {
              return revertCollectionItemToRawType(references, anno);
            })
          });
        } else if (annotation.hasOwnProperty('$Type')) {
          return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
            record: revertCollectionItemToRawType(references, annotation)
          });
        } else {
          return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
            value: revertValueToRawType(references, annotation)
          });
        }
      }

      exports.revertTermToGenericType = revertTermToGenericType;
      /***/
    }
    /******/

  };
  /************************************************************************/

  /******/
  // The module cache

  /******/

  var __webpack_module_cache__ = {};
  /******/

  /******/
  // The require function

  /******/

  function __webpack_require__(moduleId) {
    /******/
    // Check if module is in cache

    /******/
    var cachedModule = __webpack_module_cache__[moduleId];
    /******/

    if (cachedModule !== undefined) {
      /******/
      return cachedModule.exports;
      /******/
    }
    /******/
    // Create a new module (and put it into the cache)

    /******/


    var module = __webpack_module_cache__[moduleId] = {
      /******/
      // no module.id needed

      /******/
      // no module.loaded needed

      /******/
      exports: {}
      /******/

    };
    /******/

    /******/
    // Execute the module function

    /******/

    __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/

    /******/
    // Return the exports of the module

    /******/


    return module.exports;
    /******/
  }
  /******/

  /************************************************************************/

  /******/

  /******/
  // startup

  /******/
  // Load entry module and return exports

  /******/
  // This entry module is referenced by other modules so it can't be inlined

  /******/


  var __webpack_exports__ = __webpack_require__(759);
  /******/


  AnnotationConverter = __webpack_exports__;
  /******/

  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBbm5vdGF0aW9uQ29udmVydGVyIiwiX193ZWJwYWNrX21vZHVsZXNfXyIsIl9fdW51c2VkX3dlYnBhY2tfbW9kdWxlIiwiZXhwb3J0cyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY29udmVydCIsInV0aWxzXzEiLCJQYXRoIiwicGF0aEV4cHJlc3Npb24iLCJ0YXJnZXROYW1lIiwiYW5ub3RhdGlvbnNUZXJtIiwidGVybSIsInBhdGgiLCJ0eXBlIiwiJHRhcmdldCIsImJ1aWxkT2JqZWN0TWFwIiwicmF3TWV0YWRhdGEiLCJfYSIsIm9iamVjdE1hcCIsInNjaGVtYSIsImVudGl0eUNvbnRhaW5lciIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImVudGl0eVNldHMiLCJmb3JFYWNoIiwiZW50aXR5U2V0Iiwic2luZ2xldG9ucyIsInNpbmdsZXRvbiIsImFjdGlvbnMiLCJhY3Rpb24iLCJpc0JvdW5kIiwidW5Cb3VuZEFjdGlvbk5hbWUiLCJzcGxpdCIsIl90eXBlIiwicHVzaCIsImFjdGlvblNwbGl0IiwicGFyYW1ldGVycyIsInBhcmFtZXRlciIsImNvbXBsZXhUeXBlcyIsImNvbXBsZXhUeXBlIiwicHJvcGVydGllcyIsInByb3BlcnR5IiwidHlwZURlZmluaXRpb25zIiwidHlwZURlZmluaXRpb24iLCJlbnRpdHlUeXBlcyIsImVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsImVudGl0eVByb3BlcnRpZXMiLCJjb21wbGV4VHlwZURlZmluaXRpb24iLCJpc0NvbXBsZXhUeXBlRGVmaW5pdGlvbiIsImNvbXBsZXhUeXBlUHJvcCIsImNvbXBsZXhUeXBlUHJvcFRhcmdldCIsImFzc2lnbiIsIm5hbWUiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsIm5hdlByb3BlcnR5Iiwia2V5cyIsImFubm90YXRpb25Tb3VyY2UiLCJhbm5vdGF0aW9uTGlzdCIsImN1cnJlbnRUYXJnZXROYW1lIiwidW5hbGlhcyIsInJlZmVyZW5jZXMiLCJ0YXJnZXQiLCJhbm5vdGF0aW9uIiwiYW5ub3RhdGlvbkZRTiIsInF1YWxpZmllciIsImNvbWJpbmVQYXRoIiwiY3VycmVudFRhcmdldCIsInN0YXJ0c1dpdGgiLCJkZWZhdWx0UmVmZXJlbmNlcyIsIkFMTF9BTk5PVEFUSU9OX0VSUk9SUyIsIkFOTk9UQVRJT05fRVJST1JTIiwiYWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZSIsIm9FcnJvck1zZyIsIl9yZXNvbHZlVGFyZ2V0IiwicGF0aE9ubHkiLCJpbmNsdWRlVmlzaXRlZE9iamVjdHMiLCJ1bmRlZmluZWQiLCJhVmlzaXRlZE9iamVjdHMiLCJwYXRoU3BsaXQiLCJ0YXJnZXRQYXRoU3BsaXQiLCJwYXRoUGFydCIsImluZGV4T2YiLCJzcGxpdHRlZFBhdGgiLCJhbm5vdGF0aW9uUGF0aCIsImN1cnJlbnRQYXRoIiwiY3VycmVudENvbnRleHQiLCJyZWR1Y2UiLCJjdXJyZW50VmFsdWUiLCJsZW5ndGgiLCJ0YXJnZXRUeXBlIiwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZyIsImVudGl0eVR5cGVOYW1lIiwidGFyZ2V0VHlwZU5hbWUiLCJzb3VyY2VUeXBlIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJsYXN0SWR4IiwiY29udGV4dFRvUmVzb2x2ZSIsInN1YlRhcmdldCIsInZpc2l0ZWRPYmplY3RzIiwidmlzaXRlZFN1Yk9iamVjdCIsImNvbmNhdCIsInJldmVyc2UiLCJmaW5kIiwib2JqIiwiaW50ZXJtZWRpYXRlVGFyZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJhbm5vdGF0aW9uVHlwZSIsImluZmVyVHlwZUZyb21UZXJtIiwibWVzc2FnZSIsImlzQW5ub3RhdGlvblBhdGgiLCJwYXRoU3RyIiwicGFyc2VWYWx1ZSIsInByb3BlcnR5VmFsdWUiLCJ2YWx1ZUZRTiIsImNvbnRleHQiLCJTdHJpbmciLCJJbnQiLCJCb29sIiwiRGVjaW1hbCIsIkRhdGUiLCJhbGlhcyIsIkVudW1NZW1iZXIiLCJQcm9wZXJ0eVBhdGgiLCJjdXJyZW50VGVybSIsIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJhbm5vdGF0aW9uVGFyZ2V0IiwiQW5ub3RhdGlvblBhdGgiLCJ1bnJlc29sdmVkQW5ub3RhdGlvbnMiLCJpbmxpbmUiLCJ0b1Jlc29sdmUiLCJwYXJzZVJlY29yZCIsIlJlY29yZCIsInBhcnNlQ29sbGVjdGlvbiIsIkNvbGxlY3Rpb24iLCJUZXJtVG9UeXBlcyIsImlzRXJyb3IiLCJpc0RhdGFGaWVsZFdpdGhGb3JBY3Rpb24iLCJhbm5vdGF0aW9uQ29udGVudCIsImFubm90YXRpb25UZXJtIiwiJFR5cGUiLCJwYXJzZVJlY29yZFR5cGUiLCJyZWNvcmREZWZpbml0aW9uIiwiY3VycmVudEZRTiIsIkFycmF5IiwiaXNBcnJheSIsInN1YkFubm90YXRpb25MaXN0IiwiX19zb3VyY2UiLCJjdXJyZW50U291cmNlIiwiYWRkaXRpb25hbEFubm90YXRpb25zIiwicHJvcGVydHlWYWx1ZXMiLCJBY3Rpb25UYXJnZXQiLCJBY3Rpb24iLCJnZXRPckluZmVyQ29sbGVjdGlvblR5cGUiLCJjb2xsZWN0aW9uRGVmaW5pdGlvbiIsImZpcnN0Q29sSXRlbSIsInBhcmVudEZRTiIsImNvbGxlY3Rpb25EZWZpbml0aW9uVHlwZSIsIm1hcCIsInByb3BlcnR5UGF0aCIsInByb3BlcnR5SWR4IiwicGF0aFZhbHVlIiwiYW5ub3RhdGlvbklkeCIsImFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudCIsIm5hdlByb3BlcnR5UGF0aCIsIm5hdlByb3BJZHgiLCJyZWNvcmRJZHgiLCJpZlZhbHVlIiwic3RyaW5nVmFsdWUiLCJFcnJvciIsImNvbnZlcnRBbm5vdGF0aW9uIiwicmVjb3JkIiwiY29sbGVjdGlvbiIsImNyZWF0ZVJlc29sdmVQYXRoRm4iLCJyZWxhdGl2ZVBhdGgiLCJyZXNvbHZlVjJOYXZpZ2F0aW9uUHJvcGVydHkiLCJuYXZQcm9wIiwiYXNzb2NpYXRpb25zIiwib3V0TmF2UHJvcCIsInRhcmdldEFzc29jaWF0aW9uIiwiYXNzb2NpYXRpb24iLCJyZWxhdGlvbnNoaXAiLCJhc3NvY2lhdGlvbkVuZCIsImVuZCIsInJvbGUiLCJ0b1JvbGUiLCJpc0NvbGxlY3Rpb24iLCJtdWx0aXBsaWNpdHkiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJyZXNvbHZlVjROYXZpZ2F0aW9uUHJvcGVydHkiLCJwYXJ0bmVyIiwiY29udGFpbnNUYXJnZXQiLCJpc1Y0TmF2aWdhdGlvblByb3BlcnR5IiwicHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwicmVzb2x2ZU5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwicmVzb2x2ZVBhdGgiLCJsaW5rQWN0aW9uc1RvRW50aXR5VHlwZSIsIm5hbWVzcGFjZSIsInNvdXJjZUVudGl0eVR5cGUiLCJyZXR1cm5FbnRpdHlUeXBlIiwicmV0dXJuVHlwZSIsImxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQiLCJrZXlQcm9wIiwiaXNLZXkiLCJsaW5rRW50aXR5VHlwZVRvU2luZ2xldG9uIiwibGlua1Byb3BlcnRpZXNUb0NvbXBsZXhUeXBlcyIsImxpbmsiLCJjb21wbGV4VHlwZU5hbWUiLCJzRXJyb3IiLCJwcmVwYXJlQ29tcGxleFR5cGVzIiwic3BsaXRUZXJtIiwidGVybVZhbHVlIiwiYWxpYXNlZFRlcm0iLCJsYXN0RG90IiwidGVybUFsaWFzIiwiY3JlYXRlR2xvYmFsUmVzb2x2ZSIsImNvbnZlcnRlZE91dHB1dCIsInNQYXRoIiwicmVzb2x2ZURpcmVjdGx5IiwidGFyZ2V0UGF0aCIsInRhcmdldFJlc29sdXRpb24iLCJvYmplY3RQYXRoIiwiYVBhdGhTcGxpdCIsInNoaWZ0IiwiZW50aXR5U2V0TmFtZSIsImV0Iiwiam9pbiIsImVuc3VyZUFubm90YXRpb25zIiwidm9jQWxpYXMiLCJfYW5ub3RhdGlvbnMiLCJwcm9jZXNzQW5ub3RhdGlvbnMiLCJiT3ZlcnJpZGVFeGlzdGluZyIsIl9iIiwidm9jVGVybSIsInZvY1Rlcm1XaXRoUXVhbGlmaWVyIiwiQm9vbGVhbiIsInByb2Nlc3NVbnJlc29sdmVkVGFyZ2V0cyIsInVucmVzb2x2ZWRUYXJnZXRzIiwicmVzb2x2YWJsZSIsInRhcmdldFRvUmVzb2x2ZSIsInRhcmdldFN0ciIsInJlc29sdmVkVGFyZ2V0IiwidGFyZ2V0U3RyaW5nIiwidGVybUluZm8iLCJtZXJnZUFubm90YXRpb25zIiwiYW5ub3RhdGlvbkxpc3RQZXJUYXJnZXQiLCJmaW5kSW5kZXgiLCJyZWZlcmVuY2VBbm5vdGF0aW9uIiwic3BsaWNlIiwib2JqZWN0TWFwRWxlbWVudCIsImFsbFRhcmdldHMiLCJleHRyYVVucmVzb2x2ZWRBbm5vdGF0aW9ucyIsImJhc2VPYmoiLCJhbm5vdGF0aW9uUGFydCIsInRhcmdldFNwbGl0Iiwic2xpY2UiLCJjdXJyZW50T2JqIiwiZXh0cmFSZWZlcmVuY2VzIiwiZmlsdGVyIiwicmVmZXJlbmNlIiwiZGVmYXVsdFJlZiIsInZlcnNpb24iLCJkaWFnbm9zdGljcyIsIl9fY3JlYXRlQmluZGluZyIsImNyZWF0ZSIsIm8iLCJtIiwiayIsImsyIiwiZGVzYyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIl9fZXNNb2R1bGUiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJfX2V4cG9ydFN0YXIiLCJwIiwicHJvdG90eXBlIiwiY2FsbCIsInVyaSIsInVuYWxpYXNlZFZhbHVlIiwicmV2ZXJzZVJlZmVyZW5jZU1hcCIsInJlZiIsImxhc3REb3RJbmRleCIsInByZUFsaWFzIiwicG9zdEFsaWFzIiwiYWxpYXNlZFZhbHVlIiwicmVmZXJlbmNlTWFwIiwiaXNEZWNpbWFsIiwidmFsdWVPZiIsInRvU3RyaW5nIiwicmV2ZXJ0VGVybVRvR2VuZXJpY1R5cGUiLCJyZXZlcnRPYmplY3RUb1Jhd1R5cGUiLCJyZXN1bHQiLCJhbm5vIiwicmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub1Jhd1R5cGUiLCJpc1N0cmluZyIsInZhbHVlTWF0Y2hlcyIsIkFwcGx5IiwicmV2ZXJ0VmFsdWVUb1Jhd1R5cGUiLCJ2YWx1ZUNvbnN0cnVjdG9yIiwiY29uc3RydWN0b3IiLCJ0b0ZpeGVkIiwicmVzdHJpY3RlZEtleXMiLCJyZXZlcnRBbm5vdGF0aW9uc1RvUmF3VHlwZSIsImN1cnJlbnRBbm5vdGF0aW9ucyIsInRhcmdldEFubm90YXRpb25zIiwia2V5IiwicGFyc2VkQW5ub3RhdGlvbiIsInVuYWxpYXNlZFRlcm0iLCJxdWFsaWZpZWRTcGxpdCIsImNvbGxlY3Rpb25JdGVtIiwib3V0SXRlbSIsImNvbGxlY3Rpb25LZXkiLCJiYXNlQW5ub3RhdGlvbiIsIl9fd2VicGFja19tb2R1bGVfY2FjaGVfXyIsIm1vZHVsZUlkIiwiY2FjaGVkTW9kdWxlIiwibW9kdWxlIiwiX193ZWJwYWNrX2V4cG9ydHNfXyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiLi4vZGlzdC9Bbm5vdGF0aW9uQ29udmVydGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBBbm5vdGF0aW9uQ29udmVydGVyO1xuLyoqKioqKi8gKGZ1bmN0aW9uKCkgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZXNfXyA9ICh7XG5cbi8qKiovIDg3NTpcbi8qKiovIChmdW5jdGlvbihfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgKHsgdmFsdWU6IHRydWUgfSkpO1xuZXhwb3J0cy5jb252ZXJ0ID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IF9fd2VicGFja19yZXF1aXJlX18oNjkpO1xuLyoqXG4gKlxuICovXG5jbGFzcyBQYXRoIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcGF0aEV4cHJlc3Npb25cbiAgICAgKiBAcGFyYW0gdGFyZ2V0TmFtZVxuICAgICAqIEBwYXJhbSBhbm5vdGF0aW9uc1Rlcm1cbiAgICAgKiBAcGFyYW0gdGVybVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhdGhFeHByZXNzaW9uLCB0YXJnZXROYW1lLCBhbm5vdGF0aW9uc1Rlcm0sIHRlcm0pIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aEV4cHJlc3Npb24uUGF0aDtcbiAgICAgICAgdGhpcy50eXBlID0gJ1BhdGgnO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSB0YXJnZXROYW1lO1xuICAgICAgICB0aGlzLnRlcm0gPSB0ZXJtO1xuICAgICAgICB0aGlzLmFubm90YXRpb25zVGVybSA9IGFubm90YXRpb25zVGVybTtcbiAgICB9XG59XG4vKipcbiAqIENyZWF0ZXMgYSBNYXAgYmFzZWQgb24gdGhlIGZ1bGx5UXVhbGlmaWVkTmFtZSBvZiBlYWNoIG9iamVjdCBwYXJ0IG9mIHRoZSBtZXRhZGF0YS5cbiAqXG4gKiBAcGFyYW0gcmF3TWV0YWRhdGEgdGhlIHJhd01ldGFkYXRhIHdlJ3JlIHdvcmtpbmcgYWdhaW5zdFxuICogQHJldHVybnMgdGhlIG9iamVjdG1hcCBmb3IgZWFzeSBhY2Nlc3MgdG8gdGhlIGRpZmZlcmVudCBvYmplY3Qgb2YgdGhlIG1ldGFkYXRhXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0TWFwKHJhd01ldGFkYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG9iamVjdE1hcCA9IHt9O1xuICAgIGlmICgoX2EgPSByYXdNZXRhZGF0YS5zY2hlbWEuZW50aXR5Q29udGFpbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZnVsbHlRdWFsaWZpZWROYW1lKSB7XG4gICAgICAgIG9iamVjdE1hcFtyYXdNZXRhZGF0YS5zY2hlbWEuZW50aXR5Q29udGFpbmVyLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSByYXdNZXRhZGF0YS5zY2hlbWEuZW50aXR5Q29udGFpbmVyO1xuICAgIH1cbiAgICByYXdNZXRhZGF0YS5zY2hlbWEuZW50aXR5U2V0cy5mb3JFYWNoKChlbnRpdHlTZXQpID0+IHtcbiAgICAgICAgb2JqZWN0TWFwW2VudGl0eVNldC5mdWxseVF1YWxpZmllZE5hbWVdID0gZW50aXR5U2V0O1xuICAgIH0pO1xuICAgIHJhd01ldGFkYXRhLnNjaGVtYS5zaW5nbGV0b25zLmZvckVhY2goKHNpbmdsZXRvbikgPT4ge1xuICAgICAgICBvYmplY3RNYXBbc2luZ2xldG9uLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBzaW5nbGV0b247XG4gICAgfSk7XG4gICAgcmF3TWV0YWRhdGEuc2NoZW1hLmFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICAgIG9iamVjdE1hcFthY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lXSA9IGFjdGlvbjtcbiAgICAgICAgaWYgKGFjdGlvbi5pc0JvdW5kKSB7XG4gICAgICAgICAgICBjb25zdCB1bkJvdW5kQWN0aW9uTmFtZSA9IGFjdGlvbi5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoJygnKVswXTtcbiAgICAgICAgICAgIGlmICghb2JqZWN0TWFwW3VuQm91bmRBY3Rpb25OYW1lXSkge1xuICAgICAgICAgICAgICAgIG9iamVjdE1hcFt1bkJvdW5kQWN0aW9uTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIF90eXBlOiAnVW5ib3VuZEdlbmVyaWNBY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmplY3RNYXBbdW5Cb3VuZEFjdGlvbk5hbWVdLmFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICAgICAgY29uc3QgYWN0aW9uU3BsaXQgPSBhY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KCcoJyk7XG4gICAgICAgICAgICBvYmplY3RNYXBbYCR7YWN0aW9uU3BsaXRbMV0uc3BsaXQoJyknKVswXX0vJHthY3Rpb25TcGxpdFswXX1gXSA9IGFjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb24ucGFyYW1ldGVycy5mb3JFYWNoKChwYXJhbWV0ZXIpID0+IHtcbiAgICAgICAgICAgIG9iamVjdE1hcFtwYXJhbWV0ZXIuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHBhcmFtZXRlcjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmF3TWV0YWRhdGEuc2NoZW1hLmNvbXBsZXhUeXBlcy5mb3JFYWNoKChjb21wbGV4VHlwZSkgPT4ge1xuICAgICAgICBvYmplY3RNYXBbY29tcGxleFR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXSA9IGNvbXBsZXhUeXBlO1xuICAgICAgICBjb21wbGV4VHlwZS5wcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgICBvYmplY3RNYXBbcHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHByb3BlcnR5O1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByYXdNZXRhZGF0YS5zY2hlbWEudHlwZURlZmluaXRpb25zLmZvckVhY2goKHR5cGVEZWZpbml0aW9uKSA9PiB7XG4gICAgICAgIG9iamVjdE1hcFt0eXBlRGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWVdID0gdHlwZURlZmluaXRpb247XG4gICAgfSk7XG4gICAgcmF3TWV0YWRhdGEuc2NoZW1hLmVudGl0eVR5cGVzLmZvckVhY2goKGVudGl0eVR5cGUpID0+IHtcbiAgICAgICAgZW50aXR5VHlwZS5hbm5vdGF0aW9ucyA9IHt9OyAvLyAnYW5ub3RhdGlvbnMnIHByb3BlcnR5IGlzIG1hbmRhdG9yeVxuICAgICAgICBvYmplY3RNYXBbZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdID0gZW50aXR5VHlwZTtcbiAgICAgICAgb2JqZWN0TWFwW2BDb2xsZWN0aW9uKCR7ZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWV9KWBdID0gZW50aXR5VHlwZTtcbiAgICAgICAgZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgICBvYmplY3RNYXBbcHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHByb3BlcnR5O1xuICAgICAgICAgICAgLy8gSGFuZGxlIGNvbXBsZXggdHlwZXNcbiAgICAgICAgICAgIGNvbnN0IGNvbXBsZXhUeXBlRGVmaW5pdGlvbiA9IG9iamVjdE1hcFtwcm9wZXJ0eS50eXBlXTtcbiAgICAgICAgICAgIGlmICgoMCwgdXRpbHNfMS5pc0NvbXBsZXhUeXBlRGVmaW5pdGlvbikoY29tcGxleFR5cGVEZWZpbml0aW9uKSkge1xuICAgICAgICAgICAgICAgIGNvbXBsZXhUeXBlRGVmaW5pdGlvbi5wcm9wZXJ0aWVzLmZvckVhY2goKGNvbXBsZXhUeXBlUHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wbGV4VHlwZVByb3BUYXJnZXQgPSBPYmplY3QuYXNzaWduKGNvbXBsZXhUeXBlUHJvcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3R5cGU6ICdQcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxseVF1YWxpZmllZE5hbWU6IHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSArICcvJyArIGNvbXBsZXhUeXBlUHJvcC5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RNYXBbY29tcGxleFR5cGVQcm9wVGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBjb21wbGV4VHlwZVByb3BUYXJnZXQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbnRpdHlUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2goKG5hdlByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgICBvYmplY3RNYXBbbmF2UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IG5hdlByb3BlcnR5O1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBPYmplY3Qua2V5cyhyYXdNZXRhZGF0YS5zY2hlbWEuYW5ub3RhdGlvbnMpLmZvckVhY2goKGFubm90YXRpb25Tb3VyY2UpID0+IHtcbiAgICAgICAgcmF3TWV0YWRhdGEuc2NoZW1hLmFubm90YXRpb25zW2Fubm90YXRpb25Tb3VyY2VdLmZvckVhY2goKGFubm90YXRpb25MaXN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VGFyZ2V0TmFtZSA9ICgwLCB1dGlsc18xLnVuYWxpYXMpKHJhd01ldGFkYXRhLnJlZmVyZW5jZXMsIGFubm90YXRpb25MaXN0LnRhcmdldCk7XG4gICAgICAgICAgICBhbm5vdGF0aW9uTGlzdC5hbm5vdGF0aW9ucy5mb3JFYWNoKChhbm5vdGF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGFubm90YXRpb25GUU4gPSBgJHtjdXJyZW50VGFyZ2V0TmFtZX1AJHsoMCwgdXRpbHNfMS51bmFsaWFzKShyYXdNZXRhZGF0YS5yZWZlcmVuY2VzLCBhbm5vdGF0aW9uLnRlcm0pfWA7XG4gICAgICAgICAgICAgICAgaWYgKGFubm90YXRpb24ucXVhbGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFubm90YXRpb25GUU4gKz0gYCMke2Fubm90YXRpb24ucXVhbGlmaWVyfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdE1hcFthbm5vdGF0aW9uRlFOXSA9IGFubm90YXRpb247XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgPSBhbm5vdGF0aW9uRlFOO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RNYXA7XG59XG4vKipcbiAqIENvbWJpbmUgdHdvIHN0cmluZ3MgcmVwcmVzZW50aW5nIHBhdGggaW4gdGhlIG1ldGFtb2RlbCB3aGlsZSBlbnN1cmluZyB0aGVpciBzcGVjaWZpY2l0aWVzIChhbm5vdGF0aW9uLi4uKSBhcmUgcmVzcGVjdGVkLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50VGFyZ2V0IHRoZSBjdXJyZW50IHBhdGhcbiAqIEBwYXJhbSBwYXRoIHRoZSBwYXJ0IHdlIHdhbnQgdG8gYXBwZW5kXG4gKiBAcmV0dXJucyB0aGUgY29tcGxldGUgcGF0aCBpbmNsdWRpbmcgdGhlIGV4dGVuc2lvbi5cbiAqL1xuZnVuY3Rpb24gY29tYmluZVBhdGgoY3VycmVudFRhcmdldCwgcGF0aCkge1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFRhcmdldCArICgwLCB1dGlsc18xLnVuYWxpYXMpKHV0aWxzXzEuZGVmYXVsdFJlZmVyZW5jZXMsIHBhdGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRUYXJnZXQgKyAnLycgKyBwYXRoO1xuICAgIH1cbn1cbmNvbnN0IEFMTF9BTk5PVEFUSU9OX0VSUk9SUyA9IHt9O1xubGV0IEFOTk9UQVRJT05fRVJST1JTID0gW107XG4vKipcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcGFyYW0gb0Vycm9yTXNnXG4gKi9cbmZ1bmN0aW9uIGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UocGF0aCwgb0Vycm9yTXNnKSB7XG4gICAgaWYgKCFBTExfQU5OT1RBVElPTl9FUlJPUlNbcGF0aF0pIHtcbiAgICAgICAgQUxMX0FOTk9UQVRJT05fRVJST1JTW3BhdGhdID0gW29FcnJvck1zZ107XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBBTExfQU5OT1RBVElPTl9FUlJPUlNbcGF0aF0ucHVzaChvRXJyb3JNc2cpO1xuICAgIH1cbn1cbi8qKlxuICogUmVzb2x2ZXMgYSBzcGVjaWZpYyBwYXRoIGJhc2VkIG9uIHRoZSBvYmplY3RNYXAuXG4gKlxuICogQHBhcmFtIG9iamVjdE1hcFxuICogQHBhcmFtIGN1cnJlbnRUYXJnZXRcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcGFyYW0gcGF0aE9ubHlcbiAqIEBwYXJhbSBpbmNsdWRlVmlzaXRlZE9iamVjdHNcbiAqIEBwYXJhbSBhbm5vdGF0aW9uc1Rlcm1cbiAqIEByZXR1cm5zIHRoZSByZXNvbHZlZCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gX3Jlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjdXJyZW50VGFyZ2V0LCBwYXRoLCBwYXRoT25seSA9IGZhbHNlLCBpbmNsdWRlVmlzaXRlZE9iamVjdHMgPSBmYWxzZSwgYW5ub3RhdGlvbnNUZXJtKSB7XG4gICAgbGV0IG9FcnJvck1zZztcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgYVZpc2l0ZWRPYmplY3RzID0gW107XG4gICAgaWYgKGN1cnJlbnRUYXJnZXQgJiYgY3VycmVudFRhcmdldC5fdHlwZSA9PT0gJ1Byb3BlcnR5Jykge1xuICAgICAgICBjdXJyZW50VGFyZ2V0ID0gb2JqZWN0TWFwW2N1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KCcvJylbMF1dO1xuICAgIH1cbiAgICBwYXRoID0gY29tYmluZVBhdGgoY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGgpO1xuICAgIGNvbnN0IHBhdGhTcGxpdCA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICBjb25zdCB0YXJnZXRQYXRoU3BsaXQgPSBbXTtcbiAgICBwYXRoU3BsaXQuZm9yRWFjaCgocGF0aFBhcnQpID0+IHtcbiAgICAgICAgLy8gU2VwYXJhdGUgb3V0IHRoZSBhbm5vdGF0aW9uXG4gICAgICAgIGlmIChwYXRoUGFydC5pbmRleE9mKCdAJykgIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBbc3BsaXR0ZWRQYXRoLCBhbm5vdGF0aW9uUGF0aF0gPSBwYXRoUGFydC5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgdGFyZ2V0UGF0aFNwbGl0LnB1c2goc3BsaXR0ZWRQYXRoKTtcbiAgICAgICAgICAgIHRhcmdldFBhdGhTcGxpdC5wdXNoKGBAJHthbm5vdGF0aW9uUGF0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFBhdGhTcGxpdC5wdXNoKHBhdGhQYXJ0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGxldCBjdXJyZW50UGF0aCA9IHBhdGg7XG4gICAgbGV0IGN1cnJlbnRDb250ZXh0ID0gY3VycmVudFRhcmdldDtcbiAgICBjb25zdCB0YXJnZXQgPSB0YXJnZXRQYXRoU3BsaXQucmVkdWNlKChjdXJyZW50VmFsdWUsIHBhdGhQYXJ0KSA9PiB7XG4gICAgICAgIGlmIChwYXRoUGFydCA9PT0gJyRUeXBlJyAmJiBjdXJyZW50VmFsdWUuX3R5cGUgPT09ICdFbnRpdHlUeXBlJykge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aFBhcnQgPT09ICckJyAmJiBjdXJyZW50VmFsdWUuX3R5cGUgPT09ICdFbnRpdHlTZXQnKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgocGF0aFBhcnQgPT09ICdAJHVpNS5vdmVybG9hZCcgfHwgcGF0aFBhcnQgPT09ICcwJykgJiYgY3VycmVudFZhbHVlLl90eXBlID09PSAnQWN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aFBhcnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBFbXB0eSBQYXRoIGFmdGVyIGFuIGVudGl0eVNldCBtZWFucyBlbnRpdHlUeXBlXG4gICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlICYmXG4gICAgICAgICAgICAgICAgKGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gJ0VudGl0eVNldCcgfHwgY3VycmVudFZhbHVlLl90eXBlID09PSAnU2luZ2xldG9uJykgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUuZW50aXR5VHlwZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlVmlzaXRlZE9iamVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYVZpc2l0ZWRPYmplY3RzLnB1c2goY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlLmVudGl0eVR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gJ05hdmlnYXRpb25Qcm9wZXJ0eScgJiYgY3VycmVudFZhbHVlLnRhcmdldFR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFWaXNpdGVkT2JqZWN0cy5wdXNoKGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5jbHVkZVZpc2l0ZWRPYmplY3RzICYmIGN1cnJlbnRWYWx1ZSAhPT0gbnVsbCAmJiBjdXJyZW50VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYVZpc2l0ZWRPYmplY3RzLnB1c2goY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgY3VycmVudFBhdGggPSBwYXRoUGFydDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoY3VycmVudFZhbHVlLl90eXBlID09PSAnRW50aXR5U2V0JyB8fCBjdXJyZW50VmFsdWUuX3R5cGUgPT09ICdTaW5nbGV0b24nKSAmJiBwYXRoUGFydCA9PT0gJyRUeXBlJykge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlLnRhcmdldFR5cGU7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChjdXJyZW50VmFsdWUuX3R5cGUgPT09ICdFbnRpdHlTZXQnIHx8IGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gJ1NpbmdsZXRvbicpICYmXG4gICAgICAgICAgICBwYXRoUGFydCA9PT0gJyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nJykge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlLm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmc7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChjdXJyZW50VmFsdWUuX3R5cGUgPT09ICdFbnRpdHlTZXQnIHx8IGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gJ1NpbmdsZXRvbicpICYmXG4gICAgICAgICAgICBjdXJyZW50VmFsdWUuZW50aXR5VHlwZSkge1xuICAgICAgICAgICAgY3VycmVudFBhdGggPSBjb21iaW5lUGF0aChjdXJyZW50VmFsdWUuZW50aXR5VHlwZU5hbWUsIHBhdGhQYXJ0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09ICdOYXZpZ2F0aW9uUHJvcGVydHknKSB7XG4gICAgICAgICAgICBjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcbiAgICAgICAgICAgIGlmICghb2JqZWN0TWFwW2N1cnJlbnRQYXRoXSkge1xuICAgICAgICAgICAgICAgIC8vIEZhbGxiYWNrIGxvZyBlcnJvclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLnRhcmdldFR5cGVOYW1lLCBwYXRoUGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSAnUHJvcGVydHknKSB7XG4gICAgICAgICAgICAvLyBDb21wbGV4VHlwZSBvciBQcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhdGggPSBjb21iaW5lUGF0aChjdXJyZW50VmFsdWUudGFyZ2V0VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gJ0FjdGlvbicgJiYgY3VycmVudFZhbHVlLmlzQm91bmQpIHtcbiAgICAgICAgICAgIGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuICAgICAgICAgICAgaWYgKHBhdGhQYXJ0ID09PSAnJFBhcmFtZXRlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlLnBhcmFtZXRlcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW9iamVjdE1hcFtjdXJyZW50UGF0aF0pIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5zb3VyY2VUeXBlLCBwYXRoUGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSAnQWN0aW9uUGFyYW1ldGVyJykge1xuICAgICAgICAgICAgY3VycmVudFBhdGggPSBjb21iaW5lUGF0aChjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zdWJzdHJpbmcoMCwgY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoJy8nKSksIHBhdGhQYXJ0KTtcbiAgICAgICAgICAgIGlmICghb2JqZWN0TWFwW2N1cnJlbnRQYXRoXSkge1xuICAgICAgICAgICAgICAgIGxldCBsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdElkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdElkeCA9IGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudFBhdGggPSBjb21iaW5lUGF0aChvYmplY3RNYXBbY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUuc3Vic3RyaW5nKDAsIGxhc3RJZHgpXS5zb3VyY2VUeXBlLCBwYXRoUGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcbiAgICAgICAgICAgIGlmIChwYXRoUGFydCAhPT0gJ25hbWUnICYmIGN1cnJlbnRWYWx1ZVtwYXRoUGFydF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50VmFsdWVbcGF0aFBhcnRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocGF0aFBhcnQgPT09ICckQW5ub3RhdGlvblBhdGgnICYmIGN1cnJlbnRWYWx1ZS4kdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGV4dFRvUmVzb2x2ZSA9IG9iamVjdE1hcFtjdXJyZW50VmFsdWUuZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KCdAJylbMF1dO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YlRhcmdldCA9IF9yZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgY29udGV4dFRvUmVzb2x2ZSwgY3VycmVudFZhbHVlLnZhbHVlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgc3ViVGFyZ2V0LnZpc2l0ZWRPYmplY3RzLmZvckVhY2goKHZpc2l0ZWRTdWJPYmplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFWaXNpdGVkT2JqZWN0cy5pbmRleE9mKHZpc2l0ZWRTdWJPYmplY3QpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYVZpc2l0ZWRPYmplY3RzLnB1c2godmlzaXRlZFN1Yk9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3ViVGFyZ2V0LnRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHBhdGhQYXJ0ID09PSAnJFBhdGgnICYmIGN1cnJlbnRWYWx1ZS4kdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRleHQgPSBhVmlzaXRlZE9iamVjdHNcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCgpXG4gICAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoKG9iaikgPT4gb2JqLl90eXBlID09PSAnRW50aXR5VHlwZScgfHxcbiAgICAgICAgICAgICAgICAgICAgb2JqLl90eXBlID09PSAnRW50aXR5U2V0JyB8fFxuICAgICAgICAgICAgICAgICAgICBvYmouX3R5cGUgPT09ICdTaW5nbGV0b24nIHx8XG4gICAgICAgICAgICAgICAgICAgIG9iai5fdHlwZSA9PT0gJ05hdmlnYXRpb25Qcm9wZXJ0eScpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJUYXJnZXQgPSBfcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGN1cnJlbnRDb250ZXh0LCBjdXJyZW50VmFsdWUucGF0aCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBzdWJUYXJnZXQudmlzaXRlZE9iamVjdHMuZm9yRWFjaCgodmlzaXRlZFN1Yk9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFWaXNpdGVkT2JqZWN0cy5pbmRleE9mKHZpc2l0ZWRTdWJPYmplY3QpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFWaXNpdGVkT2JqZWN0cy5wdXNoKHZpc2l0ZWRTdWJPYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1YlRhcmdldC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50VmFsdWUuJHRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHBhdGhQYXJ0LnN0YXJ0c1dpdGgoJyRQYXRoJykgJiYgY3VycmVudFZhbHVlLiR0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnRlcm1lZGlhdGVUYXJnZXQgPSBjdXJyZW50VmFsdWUuJHRhcmdldDtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGludGVybWVkaWF0ZVRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0LnN1YnN0cmluZyg1KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VmFsdWUuaGFzT3duUHJvcGVydHkoJyRUeXBlJykgJiYgIW9iamVjdE1hcFtjdXJyZW50UGF0aF0pIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIG5vdyBhbiBhbm5vdGF0aW9uIHZhbHVlXG4gICAgICAgICAgICAgICAgY29uc3QgZW50aXR5VHlwZSA9IG9iamVjdE1hcFtjdXJyZW50VmFsdWUuZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KCdAJylbMF1dO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHlUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdE1hcFtjdXJyZW50UGF0aF07XG4gICAgfSwgbnVsbCk7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgaWYgKGFubm90YXRpb25zVGVybSkge1xuICAgICAgICAgICAgY29uc3QgYW5ub3RhdGlvblR5cGUgPSBpbmZlclR5cGVGcm9tVGVybShhbm5vdGF0aW9uc1Rlcm0sIGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgb0Vycm9yTXNnID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICBwYXRoICtcbiAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICc8QW5ub3RhdGlvbiBUZXJtID0gJyArXG4gICAgICAgICAgICAgICAgICAgIGFubm90YXRpb25zVGVybSArXG4gICAgICAgICAgICAgICAgICAgICc+JyArXG4gICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxSZWNvcmQgVHlwZSA9ICcgK1xuICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uVHlwZSArXG4gICAgICAgICAgICAgICAgICAgICc+JyArXG4gICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxBbm5vdGF0aW9uUGF0aCA9ICcgK1xuICAgICAgICAgICAgICAgICAgICBwYXRoICtcbiAgICAgICAgICAgICAgICAgICAgJz4nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZShwYXRoLCBvRXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb0Vycm9yTXNnID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiAnICtcbiAgICAgICAgICAgICAgICAgICAgcGF0aCArXG4gICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAnSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcbicgK1xuICAgICAgICAgICAgICAgICAgICAnPEFubm90YXRpb24gVGVybSA9ICcgK1xuICAgICAgICAgICAgICAgICAgICBwYXRoU3BsaXRbMF0gK1xuICAgICAgICAgICAgICAgICAgICAnPicgK1xuICAgICAgICAgICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICc8UHJvcGVydHlWYWx1ZSAgUGF0aD0gJyArXG4gICAgICAgICAgICAgICAgICAgIHBhdGhTcGxpdFsxXSArXG4gICAgICAgICAgICAgICAgICAgICc+J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UocGF0aCwgb0Vycm9yTXNnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocGF0aE9ubHkpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQYXRoO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2aXNpdGVkT2JqZWN0czogYVZpc2l0ZWRPYmplY3RzLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbi8qKlxuICogVHlwZWd1YXJkIHRvIGNoZWNrIGlmIHRoZSBwYXRoIGNvbnRhaW5zIGFuIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIHBhdGhTdHIgdGhlIHBhdGggdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgYW4gYW5ub3RhdGlvbiBpbiB0aGUgcGF0aC5cbiAqL1xuZnVuY3Rpb24gaXNBbm5vdGF0aW9uUGF0aChwYXRoU3RyKSB7XG4gICAgcmV0dXJuIHBhdGhTdHIuaW5kZXhPZignQCcpICE9PSAtMTtcbn1cbmZ1bmN0aW9uIHBhcnNlVmFsdWUocHJvcGVydHlWYWx1ZSwgdmFsdWVGUU4sIG9iamVjdE1hcCwgY29udGV4dCkge1xuICAgIGlmIChwcm9wZXJ0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc3dpdGNoIChwcm9wZXJ0eVZhbHVlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlLlN0cmluZztcbiAgICAgICAgY2FzZSAnSW50JzpcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlLkludDtcbiAgICAgICAgY2FzZSAnQm9vbCc6XG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZS5Cb29sO1xuICAgICAgICBjYXNlICdEZWNpbWFsJzpcbiAgICAgICAgICAgIHJldHVybiAoMCwgdXRpbHNfMS5EZWNpbWFsKShwcm9wZXJ0eVZhbHVlLkRlY2ltYWwpO1xuICAgICAgICBjYXNlICdEYXRlJzpcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlLkRhdGU7XG4gICAgICAgIGNhc2UgJ0VudW1NZW1iZXInOlxuICAgICAgICAgICAgcmV0dXJuICgwLCB1dGlsc18xLmFsaWFzKShjb250ZXh0LnJhd01ldGFkYXRhLnJlZmVyZW5jZXMsIHByb3BlcnR5VmFsdWUuRW51bU1lbWJlcik7XG4gICAgICAgIGNhc2UgJ1Byb3BlcnR5UGF0aCc6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQcm9wZXJ0eVBhdGgnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0eVZhbHVlLlByb3BlcnR5UGF0aCxcbiAgICAgICAgICAgICAgICBmdWxseVF1YWxpZmllZE5hbWU6IHZhbHVlRlFOLFxuICAgICAgICAgICAgICAgICR0YXJnZXQ6IF9yZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgY29udGV4dC5jdXJyZW50VGFyZ2V0LCBwcm9wZXJ0eVZhbHVlLlByb3BlcnR5UGF0aCwgZmFsc2UsIGZhbHNlLCBjb250ZXh0LmN1cnJlbnRUZXJtKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAnTmF2aWdhdGlvblByb3BlcnR5UGF0aCc6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdOYXZpZ2F0aW9uUHJvcGVydHlQYXRoJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcHJvcGVydHlWYWx1ZS5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuICAgICAgICAgICAgICAgIGZ1bGx5UXVhbGlmaWVkTmFtZTogdmFsdWVGUU4sXG4gICAgICAgICAgICAgICAgJHRhcmdldDogX3Jlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjb250ZXh0LmN1cnJlbnRUYXJnZXQsIHByb3BlcnR5VmFsdWUuTmF2aWdhdGlvblByb3BlcnR5UGF0aCwgZmFsc2UsIGZhbHNlLCBjb250ZXh0LmN1cnJlbnRUZXJtKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAnQW5ub3RhdGlvblBhdGgnOlxuICAgICAgICAgICAgY29uc3QgYW5ub3RhdGlvblRhcmdldCA9IF9yZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgY29udGV4dC5jdXJyZW50VGFyZ2V0LCAoMCwgdXRpbHNfMS51bmFsaWFzKShjb250ZXh0LnJhd01ldGFkYXRhLnJlZmVyZW5jZXMsIHByb3BlcnR5VmFsdWUuQW5ub3RhdGlvblBhdGgpLCB0cnVlLCBmYWxzZSwgY29udGV4dC5jdXJyZW50VGVybSk7XG4gICAgICAgICAgICBjb25zdCBhbm5vdGF0aW9uUGF0aCA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnQW5ub3RhdGlvblBhdGgnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0eVZhbHVlLkFubm90YXRpb25QYXRoLFxuICAgICAgICAgICAgICAgIGZ1bGx5UXVhbGlmaWVkTmFtZTogdmFsdWVGUU4sXG4gICAgICAgICAgICAgICAgJHRhcmdldDogYW5ub3RhdGlvblRhcmdldCxcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uc1Rlcm06IGNvbnRleHQuY3VycmVudFRlcm0sXG4gICAgICAgICAgICAgICAgdGVybTogJycsXG4gICAgICAgICAgICAgICAgcGF0aDogJydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb250ZXh0LnVucmVzb2x2ZWRBbm5vdGF0aW9ucy5wdXNoKHsgaW5saW5lOiBmYWxzZSwgdG9SZXNvbHZlOiBhbm5vdGF0aW9uUGF0aCB9KTtcbiAgICAgICAgICAgIHJldHVybiBhbm5vdGF0aW9uUGF0aDtcbiAgICAgICAgY2FzZSAnUGF0aCc6XG4gICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gX3Jlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjb250ZXh0LmN1cnJlbnRUYXJnZXQsIHByb3BlcnR5VmFsdWUuUGF0aCwgdHJ1ZSwgZmFsc2UsIGNvbnRleHQuY3VycmVudFRlcm0pO1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBQYXRoKHByb3BlcnR5VmFsdWUsICR0YXJnZXQsIGNvbnRleHQuY3VycmVudFRlcm0sICcnKTtcbiAgICAgICAgICAgIGNvbnRleHQudW5yZXNvbHZlZEFubm90YXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIGlubGluZTogaXNBbm5vdGF0aW9uUGF0aChwcm9wZXJ0eVZhbHVlLlBhdGgpLFxuICAgICAgICAgICAgICAgIHRvUmVzb2x2ZTogcGF0aFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgY2FzZSAnUmVjb3JkJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVJlY29yZChwcm9wZXJ0eVZhbHVlLlJlY29yZCwgdmFsdWVGUU4sIG9iamVjdE1hcCwgY29udGV4dCk7XG4gICAgICAgIGNhc2UgJ0NvbGxlY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlQ29sbGVjdGlvbihwcm9wZXJ0eVZhbHVlLkNvbGxlY3Rpb24sIHZhbHVlRlFOLCBvYmplY3RNYXAsIGNvbnRleHQpO1xuICAgICAgICBjYXNlICdBcHBseSc6XG4gICAgICAgIGNhc2UgJ051bGwnOlxuICAgICAgICBjYXNlICdOb3QnOlxuICAgICAgICBjYXNlICdFcSc6XG4gICAgICAgIGNhc2UgJ05lJzpcbiAgICAgICAgY2FzZSAnR3QnOlxuICAgICAgICBjYXNlICdHZSc6XG4gICAgICAgIGNhc2UgJ0x0JzpcbiAgICAgICAgY2FzZSAnTGUnOlxuICAgICAgICBjYXNlICdJZic6XG4gICAgICAgIGNhc2UgJ0FuZCc6XG4gICAgICAgIGNhc2UgJ09yJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgIH1cbn1cbi8qKlxuICogSW5mZXIgdGhlIHR5cGUgb2YgYSB0ZXJtIGJhc2VkIG9uIGl0cyB0eXBlLlxuICpcbiAqIEBwYXJhbSBhbm5vdGF0aW9uc1Rlcm0gVGhlIGFubm90YXRpb24gdGVybVxuICogQHBhcmFtIGFubm90YXRpb25UYXJnZXQgdGhlIGFubm90YXRpb24gdGFyZ2V0XG4gKiBAcmV0dXJucyB0aGUgaW5mZXJyZWQgdHlwZS5cbiAqL1xuZnVuY3Rpb24gaW5mZXJUeXBlRnJvbVRlcm0oYW5ub3RhdGlvbnNUZXJtLCBhbm5vdGF0aW9uVGFyZ2V0KSB7XG4gICAgY29uc3QgdGFyZ2V0VHlwZSA9IHV0aWxzXzEuVGVybVRvVHlwZXNbYW5ub3RhdGlvbnNUZXJtXTtcbiAgICBjb25zdCBvRXJyb3JNc2cgPSB7XG4gICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBgVGhlIHR5cGUgb2YgdGhlIHJlY29yZCB1c2VkIHdpdGhpbiB0aGUgdGVybSAke2Fubm90YXRpb25zVGVybX0gd2FzIG5vdCBkZWZpbmVkIGFuZCB3YXMgaW5mZXJyZWQgYXMgJHt0YXJnZXRUeXBlfS5cbkhpbnQ6IElmIHBvc3NpYmxlLCB0cnkgdG8gbWFpbnRhaW4gdGhlIFR5cGUgcHJvcGVydHkgZm9yIGVhY2ggUmVjb3JkLlxuPEFubm90YXRpb25zIFRhcmdldD1cIiR7YW5ub3RhdGlvblRhcmdldH1cIj5cblx0PEFubm90YXRpb24gVGVybT1cIiR7YW5ub3RhdGlvbnNUZXJtfVwiPlxuXHRcdDxSZWNvcmQ+Li4uPC9SZWNvcmQ+XG5cdDwvQW5ub3RhdGlvbj5cbjwvQW5ub3RhdGlvbnM+YFxuICAgIH07XG4gICAgYWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZShhbm5vdGF0aW9uVGFyZ2V0ICsgJy8nICsgYW5ub3RhdGlvbnNUZXJtLCBvRXJyb3JNc2cpO1xuICAgIHJldHVybiB0YXJnZXRUeXBlO1xufVxuZnVuY3Rpb24gaXNEYXRhRmllbGRXaXRoRm9yQWN0aW9uKGFubm90YXRpb25Db250ZW50LCBhbm5vdGF0aW9uVGVybSkge1xuICAgIHJldHVybiAoYW5ub3RhdGlvbkNvbnRlbnQuaGFzT3duUHJvcGVydHkoJ0FjdGlvbicpICYmXG4gICAgICAgIChhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gJ2NvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvbicgfHxcbiAgICAgICAgICAgIGFubm90YXRpb25UZXJtLiRUeXBlID09PSAnY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aEFjdGlvbicpKTtcbn1cbmZ1bmN0aW9uIHBhcnNlUmVjb3JkVHlwZShyZWNvcmREZWZpbml0aW9uLCBjb250ZXh0KSB7XG4gICAgbGV0IHRhcmdldFR5cGU7XG4gICAgaWYgKCFyZWNvcmREZWZpbml0aW9uLnR5cGUgJiYgY29udGV4dC5jdXJyZW50VGVybSkge1xuICAgICAgICB0YXJnZXRUeXBlID0gaW5mZXJUeXBlRnJvbVRlcm0oY29udGV4dC5jdXJyZW50VGVybSwgY29udGV4dC5jdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0YXJnZXRUeXBlID0gKDAsIHV0aWxzXzEudW5hbGlhcykoY29udGV4dC5yYXdNZXRhZGF0YS5yZWZlcmVuY2VzLCByZWNvcmREZWZpbml0aW9uLnR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0VHlwZTtcbn1cbmZ1bmN0aW9uIHBhcnNlUmVjb3JkKHJlY29yZERlZmluaXRpb24sIGN1cnJlbnRGUU4sIG9iamVjdE1hcCwgY29udGV4dCkge1xuICAgIGNvbnN0IHRhcmdldFR5cGUgPSBwYXJzZVJlY29yZFR5cGUocmVjb3JkRGVmaW5pdGlvbiwgY29udGV4dCk7XG4gICAgY29uc3QgYW5ub3RhdGlvblRlcm0gPSB7XG4gICAgICAgICRUeXBlOiB0YXJnZXRUeXBlLFxuICAgICAgICBmdWxseVF1YWxpZmllZE5hbWU6IGN1cnJlbnRGUU4sXG4gICAgICAgIGFubm90YXRpb25zOiB7fVxuICAgIH07XG4gICAgY29uc3QgYW5ub3RhdGlvbkNvbnRlbnQgPSB7fTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWNvcmREZWZpbml0aW9uLmFubm90YXRpb25zKSkge1xuICAgICAgICBjb25zdCBzdWJBbm5vdGF0aW9uTGlzdCA9IHtcbiAgICAgICAgICAgIHRhcmdldDogY3VycmVudEZRTixcbiAgICAgICAgICAgIGFubm90YXRpb25zOiByZWNvcmREZWZpbml0aW9uLmFubm90YXRpb25zLFxuICAgICAgICAgICAgX19zb3VyY2U6IGNvbnRleHQuY3VycmVudFNvdXJjZVxuICAgICAgICB9O1xuICAgICAgICBjb250ZXh0LmFkZGl0aW9uYWxBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcbiAgICB9XG4gICAgaWYgKHJlY29yZERlZmluaXRpb24ucHJvcGVydHlWYWx1ZXMpIHtcbiAgICAgICAgcmVjb3JkRGVmaW5pdGlvbi5wcm9wZXJ0eVZhbHVlcy5mb3JFYWNoKChwcm9wZXJ0eVZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhbm5vdGF0aW9uQ29udGVudFtwcm9wZXJ0eVZhbHVlLm5hbWVdID0gcGFyc2VWYWx1ZShwcm9wZXJ0eVZhbHVlLnZhbHVlLCBgJHtjdXJyZW50RlFOfS8ke3Byb3BlcnR5VmFsdWUubmFtZX1gLCBvYmplY3RNYXAsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcGVydHlWYWx1ZS5hbm5vdGF0aW9ucykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJBbm5vdGF0aW9uTGlzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBgJHtjdXJyZW50RlFOfS8ke3Byb3BlcnR5VmFsdWUubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uczogcHJvcGVydHlWYWx1ZS5hbm5vdGF0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgX19zb3VyY2U6IGNvbnRleHQuY3VycmVudFNvdXJjZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29udGV4dC5hZGRpdGlvbmFsQW5ub3RhdGlvbnMucHVzaChzdWJBbm5vdGF0aW9uTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNEYXRhRmllbGRXaXRoRm9yQWN0aW9uKGFubm90YXRpb25Db250ZW50LCBhbm5vdGF0aW9uVGVybSkpIHtcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uQ29udGVudC5BY3Rpb25UYXJnZXQgPVxuICAgICAgICAgICAgICAgICAgICAoY29udGV4dC5jdXJyZW50VGFyZ2V0LmFjdGlvbnMgJiYgY29udGV4dC5jdXJyZW50VGFyZ2V0LmFjdGlvbnNbYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uXSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdE1hcFthbm5vdGF0aW9uQ29udGVudC5BY3Rpb25dO1xuICAgICAgICAgICAgICAgIGlmICghYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0byBkaWFnbm9zdGljcyBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgQU5OT1RBVElPTl9FUlJPUlMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJlc29sdmUgdGhlIGFjdGlvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uQ29udGVudC5BY3Rpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgZGVmaW5lZCBmb3IgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ub3RhdGlvblRlcm0uZnVsbHlRdWFsaWZpZWROYW1lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFubm90YXRpb25UZXJtLCBhbm5vdGF0aW9uQ29udGVudCk7XG59XG4vKipcbiAqIFJldHJpZXZlIG9yIGluZmVyIHRoZSBjb2xsZWN0aW9uIHR5cGUgYmFzZWQgb24gaXRzIGNvbnRlbnQuXG4gKlxuICogQHBhcmFtIGNvbGxlY3Rpb25EZWZpbml0aW9uXG4gKiBAcmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgY29sbGVjdGlvblxuICovXG5mdW5jdGlvbiBnZXRPckluZmVyQ29sbGVjdGlvblR5cGUoY29sbGVjdGlvbkRlZmluaXRpb24pIHtcbiAgICBsZXQgdHlwZSA9IGNvbGxlY3Rpb25EZWZpbml0aW9uLnR5cGU7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCAmJiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0Q29sSXRlbSA9IGNvbGxlY3Rpb25EZWZpbml0aW9uWzBdO1xuICAgICAgICBpZiAoZmlyc3RDb2xJdGVtLmhhc093blByb3BlcnR5KCdQcm9wZXJ0eVBhdGgnKSkge1xuICAgICAgICAgICAgdHlwZSA9ICdQcm9wZXJ0eVBhdGgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eSgnUGF0aCcpKSB7XG4gICAgICAgICAgICB0eXBlID0gJ1BhdGgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eSgnQW5ub3RhdGlvblBhdGgnKSkge1xuICAgICAgICAgICAgdHlwZSA9ICdBbm5vdGF0aW9uUGF0aCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmlyc3RDb2xJdGVtLmhhc093blByb3BlcnR5KCdOYXZpZ2F0aW9uUHJvcGVydHlQYXRoJykpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnTmF2aWdhdGlvblByb3BlcnR5UGF0aCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGZpcnN0Q29sSXRlbSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoJ3R5cGUnKSB8fCBmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoJ3Byb3BlcnR5VmFsdWVzJykpKSB7XG4gICAgICAgICAgICB0eXBlID0gJ1JlY29yZCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGZpcnN0Q29sSXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnU3RyaW5nJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdHlwZSA9ICdFbXB0eUNvbGxlY3Rpb24nO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZTtcbn1cbmZ1bmN0aW9uIHBhcnNlQ29sbGVjdGlvbihjb2xsZWN0aW9uRGVmaW5pdGlvbiwgcGFyZW50RlFOLCBvYmplY3RNYXAsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uRGVmaW5pdGlvblR5cGUgPSBnZXRPckluZmVyQ29sbGVjdGlvblR5cGUoY29sbGVjdGlvbkRlZmluaXRpb24pO1xuICAgIHN3aXRjaCAoY29sbGVjdGlvbkRlZmluaXRpb25UeXBlKSB7XG4gICAgICAgIGNhc2UgJ1Byb3BlcnR5UGF0aCc6XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChwcm9wZXJ0eVBhdGgsIHByb3BlcnR5SWR4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1Byb3BlcnR5UGF0aCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuICAgICAgICAgICAgICAgICAgICBmdWxseVF1YWxpZmllZE5hbWU6IGAke3BhcmVudEZRTn0vJHtwcm9wZXJ0eUlkeH1gLFxuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0OiBfcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGNvbnRleHQuY3VycmVudFRhcmdldCwgcHJvcGVydHlQYXRoLlByb3BlcnR5UGF0aCwgZmFsc2UsIGZhbHNlLCBjb250ZXh0LmN1cnJlbnRUZXJtKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnUGF0aCc6XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChwYXRoVmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gX3Jlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBjb250ZXh0LmN1cnJlbnRUYXJnZXQsIHBhdGhWYWx1ZS5QYXRoLCB0cnVlLCBmYWxzZSwgY29udGV4dC5jdXJyZW50VGVybSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBQYXRoKHBhdGhWYWx1ZSwgJHRhcmdldCwgY29udGV4dC5jdXJyZW50VGVybSwgJycpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQudW5yZXNvbHZlZEFubm90YXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpbmxpbmU6IGlzQW5ub3RhdGlvblBhdGgocGF0aFZhbHVlLlBhdGgpLFxuICAgICAgICAgICAgICAgICAgICB0b1Jlc29sdmU6IHBhdGhcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdBbm5vdGF0aW9uUGF0aCc6XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChhbm5vdGF0aW9uUGF0aCwgYW5ub3RhdGlvbklkeCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFubm90YXRpb25UYXJnZXQgPSBfcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGNvbnRleHQuY3VycmVudFRhcmdldCwgYW5ub3RhdGlvblBhdGguQW5ub3RhdGlvblBhdGgsIHRydWUsIGZhbHNlLCBjb250ZXh0LmN1cnJlbnRUZXJtKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbm5vdGF0aW9uQ29sbGVjdGlvbkVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdBbm5vdGF0aW9uUGF0aCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhbm5vdGF0aW9uUGF0aC5Bbm5vdGF0aW9uUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtwYXJlbnRGUU59LyR7YW5ub3RhdGlvbklkeH1gLFxuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0OiBhbm5vdGF0aW9uVGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uc1Rlcm06IGNvbnRleHQuY3VycmVudFRlcm0sXG4gICAgICAgICAgICAgICAgICAgIHRlcm06ICcnLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29udGV4dC51bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlubGluZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHRvUmVzb2x2ZTogYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdOYXZpZ2F0aW9uUHJvcGVydHlQYXRoJzpcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKG5hdlByb3BlcnR5UGF0aCwgbmF2UHJvcElkeCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdOYXZpZ2F0aW9uUHJvcGVydHlQYXRoJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG5hdlByb3BlcnR5UGF0aC5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuICAgICAgICAgICAgICAgICAgICBmdWxseVF1YWxpZmllZE5hbWU6IGAke3BhcmVudEZRTn0vJHtuYXZQcm9wSWR4fWAsXG4gICAgICAgICAgICAgICAgICAgICR0YXJnZXQ6IF9yZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgY29udGV4dC5jdXJyZW50VGFyZ2V0LCBuYXZQcm9wZXJ0eVBhdGguTmF2aWdhdGlvblByb3BlcnR5UGF0aCwgZmFsc2UsIGZhbHNlLCBjb250ZXh0LmN1cnJlbnRUZXJtKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnUmVjb3JkJzpcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKHJlY29yZERlZmluaXRpb24sIHJlY29yZElkeCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVJlY29yZChyZWNvcmREZWZpbml0aW9uLCBgJHtwYXJlbnRGUU59LyR7cmVjb3JkSWR4fWAsIG9iamVjdE1hcCwgY29udGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnQXBwbHknOlxuICAgICAgICBjYXNlICdOdWxsJzpcbiAgICAgICAgY2FzZSAnSWYnOlxuICAgICAgICBjYXNlICdFcSc6XG4gICAgICAgIGNhc2UgJ05lJzpcbiAgICAgICAgY2FzZSAnTHQnOlxuICAgICAgICBjYXNlICdHdCc6XG4gICAgICAgIGNhc2UgJ0xlJzpcbiAgICAgICAgY2FzZSAnR2UnOlxuICAgICAgICBjYXNlICdOb3QnOlxuICAgICAgICBjYXNlICdBbmQnOlxuICAgICAgICBjYXNlICdPcic6XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChpZlZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmVmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKHN0cmluZ1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJpbmdWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ1ZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzdHJpbmdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdWYWx1ZS5TdHJpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbkRlZmluaXRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBjYXNlJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gY29udmVydEFubm90YXRpb24oYW5ub3RhdGlvbiwgb2JqZWN0TWFwLCBjb250ZXh0KSB7XG4gICAgaWYgKGFubm90YXRpb24ucmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBwYXJzZVJlY29yZChhbm5vdGF0aW9uLnJlY29yZCwgYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsIG9iamVjdE1hcCwgY29udGV4dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFubm90YXRpb24uY29sbGVjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChhbm5vdGF0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VWYWx1ZShhbm5vdGF0aW9uLnZhbHVlLCBhbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSwgb2JqZWN0TWFwLCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGFubm90YXRpb24uY29sbGVjdGlvbikge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gcGFyc2VDb2xsZWN0aW9uKGFubm90YXRpb24uY29sbGVjdGlvbiwgYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsIG9iamVjdE1hcCwgY29udGV4dCk7XG4gICAgICAgIGNvbGxlY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lID0gYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWU7XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBjYXNlJyk7XG4gICAgfVxufVxuLyoqXG4gKiBDcmVhdGVzIGEgcmVzb2x2ZVBhdGggZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gZW50aXR5VHlwZS5cbiAqXG4gKiBAcGFyYW0gZW50aXR5VHlwZSBUaGUgZW50aXR5VHlwZSBmb3Igd2hpY2ggdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBjcmVhdGVkXG4gKiBAcGFyYW0gb2JqZWN0TWFwIFRoZSBjdXJyZW50IG9iamVjdE1hcFxuICogQHJldHVybnMgdGhlIHJlc29sdmVQYXRoIGZ1bmN0aW9uIHRoYXQgc3RhcnRzIGF0IHRoZSBlbnRpdHlUeXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJlc29sdmVQYXRoRm4oZW50aXR5VHlwZSwgb2JqZWN0TWFwKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZWxhdGl2ZVBhdGgsIGluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuICAgICAgICBjb25zdCBhbm5vdGF0aW9uVGVybSA9ICcnO1xuICAgICAgICByZXR1cm4gX3Jlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBlbnRpdHlUeXBlLCByZWxhdGl2ZVBhdGgsIGZhbHNlLCBpbmNsdWRlVmlzaXRlZE9iamVjdHMsIGFubm90YXRpb25UZXJtKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVYyTmF2aWdhdGlvblByb3BlcnR5KG5hdlByb3AsIGFzc29jaWF0aW9ucywgb2JqZWN0TWFwLCBvdXROYXZQcm9wKSB7XG4gICAgY29uc3QgdGFyZ2V0QXNzb2NpYXRpb24gPSBhc3NvY2lhdGlvbnMuZmluZCgoYXNzb2NpYXRpb24pID0+IGFzc29jaWF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSA9PT0gbmF2UHJvcC5yZWxhdGlvbnNoaXApO1xuICAgIGlmICh0YXJnZXRBc3NvY2lhdGlvbikge1xuICAgICAgICBjb25zdCBhc3NvY2lhdGlvbkVuZCA9IHRhcmdldEFzc29jaWF0aW9uLmFzc29jaWF0aW9uRW5kLmZpbmQoKGVuZCkgPT4gZW5kLnJvbGUgPT09IG5hdlByb3AudG9Sb2xlKTtcbiAgICAgICAgaWYgKGFzc29jaWF0aW9uRW5kKSB7XG4gICAgICAgICAgICBvdXROYXZQcm9wLnRhcmdldFR5cGUgPSBvYmplY3RNYXBbYXNzb2NpYXRpb25FbmQudHlwZV07XG4gICAgICAgICAgICBvdXROYXZQcm9wLmlzQ29sbGVjdGlvbiA9IGFzc29jaWF0aW9uRW5kLm11bHRpcGxpY2l0eSA9PT0gJyonO1xuICAgICAgICB9XG4gICAgfVxuICAgIG91dE5hdlByb3AucmVmZXJlbnRpYWxDb25zdHJhaW50ID0gbmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQgfHwgW107XG59XG5mdW5jdGlvbiByZXNvbHZlVjROYXZpZ2F0aW9uUHJvcGVydHkobmF2UHJvcCwgb2JqZWN0TWFwLCBvdXROYXZQcm9wKSB7XG4gICAgb3V0TmF2UHJvcC50YXJnZXRUeXBlID0gb2JqZWN0TWFwW25hdlByb3AudGFyZ2V0VHlwZU5hbWVdO1xuICAgIG91dE5hdlByb3AucGFydG5lciA9IG5hdlByb3AucGFydG5lcjtcbiAgICBvdXROYXZQcm9wLmlzQ29sbGVjdGlvbiA9IG5hdlByb3AuaXNDb2xsZWN0aW9uO1xuICAgIG91dE5hdlByb3AuY29udGFpbnNUYXJnZXQgPSBuYXZQcm9wLmNvbnRhaW5zVGFyZ2V0O1xuICAgIG91dE5hdlByb3AucmVmZXJlbnRpYWxDb25zdHJhaW50ID0gbmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQ7XG59XG5mdW5jdGlvbiBpc1Y0TmF2aWdhdGlvblByb3BlcnR5KG5hdlByb3ApIHtcbiAgICByZXR1cm4gISFuYXZQcm9wLnRhcmdldFR5cGVOYW1lO1xufVxuZnVuY3Rpb24gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0aWVzKG5hdmlnYXRpb25Qcm9wZXJ0aWVzLCBhc3NvY2lhdGlvbnMsIG9iamVjdE1hcCkge1xuICAgIHJldHVybiBuYXZpZ2F0aW9uUHJvcGVydGllcy5tYXAoKG5hdlByb3ApID0+IHtcbiAgICAgICAgY29uc3Qgb3V0TmF2UHJvcCA9IHtcbiAgICAgICAgICAgIF90eXBlOiAnTmF2aWdhdGlvblByb3BlcnR5JyxcbiAgICAgICAgICAgIG5hbWU6IG5hdlByb3AubmFtZSxcbiAgICAgICAgICAgIGZ1bGx5UXVhbGlmaWVkTmFtZTogbmF2UHJvcC5mdWxseVF1YWxpZmllZE5hbWUsXG4gICAgICAgICAgICBpc0NvbGxlY3Rpb246IGZhbHNlLFxuICAgICAgICAgICAgY29udGFpbnNUYXJnZXQ6IGZhbHNlLFxuICAgICAgICAgICAgcmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXSxcbiAgICAgICAgICAgIGFubm90YXRpb25zOiB7fSxcbiAgICAgICAgICAgIHBhcnRuZXI6ICcnLFxuICAgICAgICAgICAgdGFyZ2V0VHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdGFyZ2V0VHlwZU5hbWU6ICcnXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpc1Y0TmF2aWdhdGlvblByb3BlcnR5KG5hdlByb3ApKSB7XG4gICAgICAgICAgICByZXNvbHZlVjROYXZpZ2F0aW9uUHJvcGVydHkobmF2UHJvcCwgb2JqZWN0TWFwLCBvdXROYXZQcm9wKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmVWMk5hdmlnYXRpb25Qcm9wZXJ0eShuYXZQcm9wLCBhc3NvY2lhdGlvbnMsIG9iamVjdE1hcCwgb3V0TmF2UHJvcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dE5hdlByb3AudGFyZ2V0VHlwZSkge1xuICAgICAgICAgICAgb3V0TmF2UHJvcC50YXJnZXRUeXBlTmFtZSA9IG91dE5hdlByb3AudGFyZ2V0VHlwZS5mdWxseVF1YWxpZmllZE5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0TWFwW291dE5hdlByb3AuZnVsbHlRdWFsaWZpZWROYW1lXSA9IG91dE5hdlByb3A7XG4gICAgICAgIHJldHVybiBvdXROYXZQcm9wO1xuICAgIH0pO1xufVxuLyoqXG4gKiBAcGFyYW0gZW50aXR5VHlwZXNcbiAqIEBwYXJhbSBhc3NvY2lhdGlvbnNcbiAqIEBwYXJhbSBvYmplY3RNYXBcbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZU5hdmlnYXRpb25Qcm9wZXJ0aWVzKGVudGl0eVR5cGVzLCBhc3NvY2lhdGlvbnMsIG9iamVjdE1hcCkge1xuICAgIGVudGl0eVR5cGVzLmZvckVhY2goKGVudGl0eVR5cGUpID0+IHtcbiAgICAgICAgZW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IHByZXBhcmVOYXZpZ2F0aW9uUHJvcGVydGllcyhlbnRpdHlUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLCBhc3NvY2lhdGlvbnMsIG9iamVjdE1hcCk7XG4gICAgICAgIGVudGl0eVR5cGUucmVzb2x2ZVBhdGggPSBjcmVhdGVSZXNvbHZlUGF0aEZuKGVudGl0eVR5cGUsIG9iamVjdE1hcCk7XG4gICAgfSk7XG59XG4vKipcbiAqIEBwYXJhbSBuYW1lc3BhY2VcbiAqIEBwYXJhbSBhY3Rpb25zXG4gKiBAcGFyYW0gb2JqZWN0TWFwXG4gKi9cbmZ1bmN0aW9uIGxpbmtBY3Rpb25zVG9FbnRpdHlUeXBlKG5hbWVzcGFjZSwgYWN0aW9ucywgb2JqZWN0TWFwKSB7XG4gICAgYWN0aW9ucy5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgICAgaWYgKCFhY3Rpb24uYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgIGFjdGlvbi5hbm5vdGF0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24uaXNCb3VuZCkge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlRW50aXR5VHlwZSA9IG9iamVjdE1hcFthY3Rpb24uc291cmNlVHlwZV07XG4gICAgICAgICAgICBhY3Rpb24uc291cmNlRW50aXR5VHlwZSA9IHNvdXJjZUVudGl0eVR5cGU7XG4gICAgICAgICAgICBpZiAoc291cmNlRW50aXR5VHlwZSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRW50aXR5VHlwZS5hY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUVudGl0eVR5cGUuYWN0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnNbYWN0aW9uLm5hbWVdID0gYWN0aW9uO1xuICAgICAgICAgICAgICAgIHNvdXJjZUVudGl0eVR5cGUuYWN0aW9uc1tgJHtuYW1lc3BhY2V9LiR7YWN0aW9uLm5hbWV9YF0gPSBhY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY3Rpb24ucmV0dXJuRW50aXR5VHlwZSA9IG9iamVjdE1hcFthY3Rpb24ucmV0dXJuVHlwZV07XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qKlxuICogQHBhcmFtIGVudGl0eVNldHNcbiAqIEBwYXJhbSBvYmplY3RNYXBcbiAqIEBwYXJhbSByZWZlcmVuY2VzXG4gKi9cbmZ1bmN0aW9uIGxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQoZW50aXR5U2V0cywgb2JqZWN0TWFwLCByZWZlcmVuY2VzKSB7XG4gICAgZW50aXR5U2V0cy5mb3JFYWNoKChlbnRpdHlTZXQpID0+IHtcbiAgICAgICAgZW50aXR5U2V0LmVudGl0eVR5cGUgPSBvYmplY3RNYXBbZW50aXR5U2V0LmVudGl0eVR5cGVOYW1lXTtcbiAgICAgICAgaWYgKCFlbnRpdHlTZXQuZW50aXR5VHlwZSkge1xuICAgICAgICAgICAgZW50aXR5U2V0LmVudGl0eVR5cGUgPSBvYmplY3RNYXBbKDAsIHV0aWxzXzEudW5hbGlhcykocmVmZXJlbmNlcywgZW50aXR5U2V0LmVudGl0eVR5cGVOYW1lKV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbnRpdHlTZXQuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgIGVudGl0eVNldC5hbm5vdGF0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW50aXR5U2V0LmVudGl0eVR5cGUuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgIGVudGl0eVNldC5lbnRpdHlUeXBlLmFubm90YXRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5U2V0LmVudGl0eVR5cGUua2V5cy5mb3JFYWNoKChrZXlQcm9wKSA9PiB7XG4gICAgICAgICAgICBrZXlQcm9wLmlzS2V5ID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vKipcbiAqIEBwYXJhbSBzaW5nbGV0b25zXG4gKiBAcGFyYW0gb2JqZWN0TWFwXG4gKiBAcGFyYW0gcmVmZXJlbmNlc1xuICovXG5mdW5jdGlvbiBsaW5rRW50aXR5VHlwZVRvU2luZ2xldG9uKHNpbmdsZXRvbnMsIG9iamVjdE1hcCwgcmVmZXJlbmNlcykge1xuICAgIHNpbmdsZXRvbnMuZm9yRWFjaCgoc2luZ2xldG9uKSA9PiB7XG4gICAgICAgIHNpbmdsZXRvbi5lbnRpdHlUeXBlID0gb2JqZWN0TWFwW3NpbmdsZXRvbi5lbnRpdHlUeXBlTmFtZV07XG4gICAgICAgIGlmICghc2luZ2xldG9uLmVudGl0eVR5cGUpIHtcbiAgICAgICAgICAgIHNpbmdsZXRvbi5lbnRpdHlUeXBlID0gb2JqZWN0TWFwWygwLCB1dGlsc18xLnVuYWxpYXMpKHJlZmVyZW5jZXMsIHNpbmdsZXRvbi5lbnRpdHlUeXBlTmFtZSldO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2luZ2xldG9uLmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICBzaW5nbGV0b24uYW5ub3RhdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNpbmdsZXRvbi5lbnRpdHlUeXBlLmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICBzaW5nbGV0b24uZW50aXR5VHlwZS5hbm5vdGF0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHNpbmdsZXRvbi5lbnRpdHlUeXBlLmtleXMuZm9yRWFjaCgoa2V5UHJvcCkgPT4ge1xuICAgICAgICAgICAga2V5UHJvcC5pc0tleSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBAcGFyYW0gZW50aXR5VHlwZXNcbiAqIEBwYXJhbSBvYmplY3RNYXBcbiAqL1xuZnVuY3Rpb24gbGlua1Byb3BlcnRpZXNUb0NvbXBsZXhUeXBlcyhlbnRpdHlUeXBlcywgb2JqZWN0TWFwKSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHByb3BlcnR5XG4gICAgICovXG4gICAgZnVuY3Rpb24gbGluayhwcm9wZXJ0eSkge1xuICAgICAgICBpZiAoIXByb3BlcnR5LmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eS5hbm5vdGF0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkudHlwZS5pbmRleE9mKCdFZG0nKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxldCBjb21wbGV4VHlwZTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkudHlwZS5zdGFydHNXaXRoKCdDb2xsZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcGxleFR5cGVOYW1lID0gcHJvcGVydHkudHlwZS5zdWJzdHJpbmcoMTEsIHByb3BlcnR5LnR5cGUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXhUeXBlID0gb2JqZWN0TWFwW2NvbXBsZXhUeXBlTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV4VHlwZSA9IG9iamVjdE1hcFtwcm9wZXJ0eS50eXBlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LnRhcmdldFR5cGUgPSBjb21wbGV4VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhUeXBlLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhUeXBlLnByb3BlcnRpZXMuZm9yRWFjaChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoc0Vycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IFR5cGUgaXMgbm90IGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbnRpdHlUeXBlcy5mb3JFYWNoKChlbnRpdHlUeXBlKSA9PiB7XG4gICAgICAgIGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5mb3JFYWNoKGxpbmspO1xuICAgIH0pO1xufVxuLyoqXG4gKiBAcGFyYW0gY29tcGxleFR5cGVzXG4gKiBAcGFyYW0gYXNzb2NpYXRpb25zXG4gKiBAcGFyYW0gb2JqZWN0TWFwXG4gKi9cbmZ1bmN0aW9uIHByZXBhcmVDb21wbGV4VHlwZXMoY29tcGxleFR5cGVzLCBhc3NvY2lhdGlvbnMsIG9iamVjdE1hcCkge1xuICAgIGNvbXBsZXhUeXBlcy5mb3JFYWNoKChjb21wbGV4VHlwZSkgPT4ge1xuICAgICAgICBjb21wbGV4VHlwZS5hbm5vdGF0aW9ucyA9IHt9O1xuICAgICAgICBjb21wbGV4VHlwZS5wcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkuYW5ub3RhdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbXBsZXhUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0aWVzKGNvbXBsZXhUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLCBhc3NvY2lhdGlvbnMsIG9iamVjdE1hcCk7XG4gICAgfSk7XG59XG4vKipcbiAqIFNwbGl0IHRoZSBhbGlhcyBmcm9tIHRoZSB0ZXJtIHZhbHVlLlxuICpcbiAqIEBwYXJhbSByZWZlcmVuY2VzIHRoZSBjdXJyZW50IHNldCBvZiByZWZlcmVuY2VzXG4gKiBAcGFyYW0gdGVybVZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgdGVybVxuICogQHJldHVybnMgdGhlIHRlcm0gYWxpYXMgYW5kIHRoZSBhY3R1YWwgdGVybSB2YWx1ZVxuICovXG5mdW5jdGlvbiBzcGxpdFRlcm0ocmVmZXJlbmNlcywgdGVybVZhbHVlKSB7XG4gICAgY29uc3QgYWxpYXNlZFRlcm0gPSAoMCwgdXRpbHNfMS5hbGlhcykocmVmZXJlbmNlcywgdGVybVZhbHVlKTtcbiAgICBjb25zdCBsYXN0RG90ID0gYWxpYXNlZFRlcm0ubGFzdEluZGV4T2YoJy4nKTtcbiAgICBjb25zdCB0ZXJtQWxpYXMgPSBhbGlhc2VkVGVybS5zdWJzdHJpbmcoMCwgbGFzdERvdCk7XG4gICAgY29uc3QgdGVybSA9IGFsaWFzZWRUZXJtLnN1YnN0cmluZyhsYXN0RG90ICsgMSk7XG4gICAgcmV0dXJuIFt0ZXJtQWxpYXMsIHRlcm1dO1xufVxuLyoqXG4gKiBDcmVhdGVzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgcmVzb2x2ZSBhIHNwZWNpZmljIHBhdGguXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlZE91dHB1dFxuICogQHBhcmFtIG9iamVjdE1hcFxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBhbGxvdyB0byByZXNvbHZlIGVsZW1lbnQgZ2xvYmFsbHkuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUdsb2JhbFJlc29sdmUoY29udmVydGVkT3V0cHV0LCBvYmplY3RNYXApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVzb2x2ZVBhdGgoc1BhdGgsIHJlc29sdmVEaXJlY3RseSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChyZXNvbHZlRGlyZWN0bHkpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRQYXRoID0gc1BhdGg7XG4gICAgICAgICAgICBpZiAoIXNQYXRoLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFBhdGggPSBgLyR7c1BhdGh9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFJlc29sdXRpb24gPSBfcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGNvbnZlcnRlZE91dHB1dCwgdGFyZ2V0UGF0aCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgaWYgKHRhcmdldFJlc29sdXRpb24udGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0UmVzb2x1dGlvbi52aXNpdGVkT2JqZWN0cy5wdXNoKHRhcmdldFJlc29sdXRpb24udGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXRSZXNvbHV0aW9uLnRhcmdldCxcbiAgICAgICAgICAgICAgICBvYmplY3RQYXRoOiB0YXJnZXRSZXNvbHV0aW9uLnZpc2l0ZWRPYmplY3RzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFQYXRoU3BsaXQgPSBzUGF0aC5zcGxpdCgnLycpO1xuICAgICAgICBpZiAoYVBhdGhTcGxpdC5zaGlmdCgpICE9PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVhbCB3aXRoIHJlbGF0aXZlIHBhdGgnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbnRpdHlTZXROYW1lID0gYVBhdGhTcGxpdC5zaGlmdCgpO1xuICAgICAgICBjb25zdCBlbnRpdHlTZXQgPSBjb252ZXJ0ZWRPdXRwdXQuZW50aXR5U2V0cy5maW5kKChldCkgPT4gZXQubmFtZSA9PT0gZW50aXR5U2V0TmFtZSk7XG4gICAgICAgIGNvbnN0IHNpbmdsZXRvbiA9IGNvbnZlcnRlZE91dHB1dC5zaW5nbGV0b25zLmZpbmQoKGV0KSA9PiBldC5uYW1lID09PSBlbnRpdHlTZXROYW1lKTtcbiAgICAgICAgaWYgKCFlbnRpdHlTZXQgJiYgIXNpbmdsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGNvbnZlcnRlZE91dHB1dC5lbnRpdHlDb250YWluZXIsXG4gICAgICAgICAgICAgICAgb2JqZWN0UGF0aDogW2NvbnZlcnRlZE91dHB1dC5lbnRpdHlDb250YWluZXJdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhUGF0aFNwbGl0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGVudGl0eVNldCB8fCBzaW5nbGV0b24sXG4gICAgICAgICAgICAgICAgb2JqZWN0UGF0aDogW2NvbnZlcnRlZE91dHB1dC5lbnRpdHlDb250YWluZXIsIGVudGl0eVNldCB8fCBzaW5nbGV0b25dXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UmVzb2x1dGlvbiA9IF9yZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgZW50aXR5U2V0IHx8IHNpbmdsZXRvbiwgJy8nICsgYVBhdGhTcGxpdC5qb2luKCcvJyksIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRSZXNvbHV0aW9uLnRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRhcmdldFJlc29sdXRpb24udmlzaXRlZE9iamVjdHMucHVzaCh0YXJnZXRSZXNvbHV0aW9uLnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0UmVzb2x1dGlvbi50YXJnZXQsXG4gICAgICAgICAgICAgICAgb2JqZWN0UGF0aDogdGFyZ2V0UmVzb2x1dGlvbi52aXNpdGVkT2JqZWN0c1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBlbnN1cmVBbm5vdGF0aW9ucyhjdXJyZW50VGFyZ2V0LCB2b2NBbGlhcykge1xuICAgIGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucykge1xuICAgICAgICBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zID0ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10pIHtcbiAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10gPSB7fTtcbiAgICB9XG4gICAgaWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucykge1xuICAgICAgICBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucyA9IHt9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIHByb2Nlc3NBbm5vdGF0aW9ucyhjdXJyZW50Q29udGV4dCwgYW5ub3RhdGlvbkxpc3QsIG9iamVjdE1hcCwgYk92ZXJyaWRlRXhpc3RpbmcpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gY3VycmVudENvbnRleHQuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0TmFtZSA9IGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lO1xuICAgIGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goKGFubm90YXRpb24pID0+IHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgY3VycmVudENvbnRleHQuY3VycmVudFNvdXJjZSA9IGFubm90YXRpb24uX19zb3VyY2UgfHwgYW5ub3RhdGlvbkxpc3QuX19zb3VyY2U7XG4gICAgICAgIGNvbnN0IFt2b2NBbGlhcywgdm9jVGVybV0gPSBzcGxpdFRlcm0odXRpbHNfMS5kZWZhdWx0UmVmZXJlbmNlcywgYW5ub3RhdGlvbi50ZXJtKTtcbiAgICAgICAgZW5zdXJlQW5ub3RhdGlvbnMoY3VycmVudFRhcmdldCwgdm9jQWxpYXMpO1xuICAgICAgICBjb25zdCB2b2NUZXJtV2l0aFF1YWxpZmllciA9IGAke3ZvY1Rlcm19JHthbm5vdGF0aW9uLnF1YWxpZmllciA/ICcjJyArIGFubm90YXRpb24ucXVhbGlmaWVyIDogJyd9YDtcbiAgICAgICAgaWYgKCFiT3ZlcnJpZGVFeGlzdGluZyAmJiAoKF9iID0gKF9hID0gY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW3ZvY0FsaWFzXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRDb250ZXh0LmN1cnJlbnRUZXJtID0gYW5ub3RhdGlvbi50ZXJtO1xuICAgICAgICBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPSBjb252ZXJ0QW5ub3RhdGlvbihhbm5vdGF0aW9uLCBvYmplY3RNYXAsIGN1cnJlbnRDb250ZXh0KTtcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdKSB7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctd3JhcHBlcnNcbiAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPSBuZXcgU3RyaW5nKGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LXdyYXBwZXJzXG4gICAgICAgICAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID0gbmV3IEJvb2xlYW4oY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gIT09IG51bGwgJiZcbiAgICAgICAgICAgIHR5cGVvZiBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAhY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0uYW5ub3RhdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdICE9PSBudWxsICYmXG4gICAgICAgICAgICB0eXBlb2YgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnRlcm0gPSAoMCwgdXRpbHNfMS51bmFsaWFzKSh1dGlsc18xLmRlZmF1bHRSZWZlcmVuY2VzLCBgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWApO1xuICAgICAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnF1YWxpZmllciA9IGFubm90YXRpb24ucXVhbGlmaWVyO1xuICAgICAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLl9fc291cmNlID0gY3VycmVudENvbnRleHQuY3VycmVudFNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gYCR7Y3VycmVudFRhcmdldE5hbWV9QCR7KDAsIHV0aWxzXzEudW5hbGlhcykodXRpbHNfMS5kZWZhdWx0UmVmZXJlbmNlcywgdm9jQWxpYXMgKyAnLicgKyB2b2NUZXJtV2l0aFF1YWxpZmllcil9YDtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbi5hbm5vdGF0aW9ucykpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YkFubm90YXRpb25MaXN0ID0ge1xuICAgICAgICAgICAgICAgIHRhcmdldDogYW5ub3RhdGlvblRhcmdldCxcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uczogYW5ub3RhdGlvbi5hbm5vdGF0aW9ucyxcbiAgICAgICAgICAgICAgICBfX3NvdXJjZTogY3VycmVudENvbnRleHQuY3VycmVudFNvdXJjZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0LmFkZGl0aW9uYWxBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhbm5vdGF0aW9uLmFubm90YXRpb25zICYmICFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0uYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5hbm5vdGF0aW9ucyA9IGFubm90YXRpb24uYW5ub3RhdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnNbYCR7dm9jQWxpYXN9LiR7dm9jVGVybVdpdGhRdWFsaWZpZXJ9YF0gPVxuICAgICAgICAgICAgY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnNbKDAsIHV0aWxzXzEudW5hbGlhcykodXRpbHNfMS5kZWZhdWx0UmVmZXJlbmNlcywgYCR7dm9jQWxpYXN9LiR7dm9jVGVybVdpdGhRdWFsaWZpZXJ9YCldID1cbiAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl07XG4gICAgICAgIG9iamVjdE1hcFthbm5vdGF0aW9uVGFyZ2V0XSA9IGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXTtcbiAgICB9KTtcbn1cbi8qKlxuICogUHJvY2VzcyBhbGwgdGhlIHVucmVzb2x2ZWQgdGFyZ2V0cyBzbyBmYXIgdG8gdHJ5IGFuZCBzZWUgaWYgdGhleSBhcmUgcmVzb2x2ZWFibGUgaW4gdGhlIGVuZC5cbiAqXG4gKiBAcGFyYW0gdW5yZXNvbHZlZFRhcmdldHNcbiAqIEBwYXJhbSBvYmplY3RNYXBcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc1VucmVzb2x2ZWRUYXJnZXRzKHVucmVzb2x2ZWRUYXJnZXRzLCBvYmplY3RNYXApIHtcbiAgICB1bnJlc29sdmVkVGFyZ2V0cy5mb3JFYWNoKChyZXNvbHZhYmxlKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldFRvUmVzb2x2ZSA9IHJlc29sdmFibGUudG9SZXNvbHZlO1xuICAgICAgICBjb25zdCB0YXJnZXRTdHIgPSB0YXJnZXRUb1Jlc29sdmUuJHRhcmdldDtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRUYXJnZXQgPSBvYmplY3RNYXBbdGFyZ2V0U3RyXTtcbiAgICAgICAgY29uc3QgeyBhbm5vdGF0aW9uc1Rlcm0sIGFubm90YXRpb25UeXBlIH0gPSB0YXJnZXRUb1Jlc29sdmU7XG4gICAgICAgIGRlbGV0ZSB0YXJnZXRUb1Jlc29sdmUuYW5ub3RhdGlvblR5cGU7XG4gICAgICAgIGRlbGV0ZSB0YXJnZXRUb1Jlc29sdmUuYW5ub3RhdGlvbnNUZXJtO1xuICAgICAgICBpZiAocmVzb2x2YWJsZS5pbmxpbmUgJiYgIShyZXNvbHZlZFRhcmdldCBpbnN0YW5jZW9mIFN0cmluZykpIHtcbiAgICAgICAgICAgIC8vIGlubGluZSB0aGUgcmVzb2x2ZWQgdGFyZ2V0XG4gICAgICAgICAgICBsZXQga2V5cztcbiAgICAgICAgICAgIGZvciAoa2V5cyBpbiB0YXJnZXRUb1Jlc29sdmUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGFyZ2V0VG9SZXNvbHZlW2tleXNdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0YXJnZXRUb1Jlc29sdmUsIHJlc29sdmVkVGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFzc2lnbiB0aGUgcmVzb2x2ZWQgdGFyZ2V0XG4gICAgICAgICAgICB0YXJnZXRUb1Jlc29sdmUuJHRhcmdldCA9IHJlc29sdmVkVGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzb2x2ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHRhcmdldFRvUmVzb2x2ZS50YXJnZXRTdHJpbmcgPSB0YXJnZXRTdHI7XG4gICAgICAgICAgICBpZiAoYW5ub3RhdGlvbnNUZXJtICYmIGFubm90YXRpb25UeXBlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb0Vycm9yTXNnID0ge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJlc29sdmUgdGhlIHBhdGggZXhwcmVzc2lvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdHIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0hpbnQ6IENoZWNrIGFuZCBjb3JyZWN0IHRoZSBwYXRoIHZhbHVlcyB1bmRlciB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZSBpbiB0aGUgbWV0YWRhdGEgKGFubm90YXRpb24ueG1sIGZpbGUgb3IgQ0RTIGFubm90YXRpb25zIGZvciB0aGUgYXBwbGljYXRpb24pOiBcXG5cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8QW5ub3RhdGlvbiBUZXJtID0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uc1Rlcm0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgJz4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8UmVjb3JkIFR5cGUgPSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFubm90YXRpb25UeXBlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPEFubm90YXRpb25QYXRoID0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdHIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJz4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHRhcmdldFN0ciwgb0Vycm9yTXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gdGFyZ2V0VG9SZXNvbHZlLnRlcm07XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRhcmdldFRvUmVzb2x2ZS5wYXRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1JbmZvID0gdGFyZ2V0U3RyID8gdGFyZ2V0U3RyLnNwbGl0KCcvJylbMF0gOiB0YXJnZXRTdHI7XG4gICAgICAgICAgICAgICAgY29uc3Qgb0Vycm9yTXNnID0ge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJlc29sdmUgdGhlIHBhdGggZXhwcmVzc2lvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdHIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0hpbnQ6IENoZWNrIGFuZCBjb3JyZWN0IHRoZSBwYXRoIHZhbHVlcyB1bmRlciB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZSBpbiB0aGUgbWV0YWRhdGEgKGFubm90YXRpb24ueG1sIGZpbGUgb3IgQ0RTIGFubm90YXRpb25zIGZvciB0aGUgYXBwbGljYXRpb24pOiBcXG5cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8QW5ub3RhdGlvbiBUZXJtID0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXJtSW5mbyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5ID0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnICAgICAgICBQYXRoPSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgJz4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHRhcmdldFN0ciwgb0Vycm9yTXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuLyoqXG4gKiBNZXJnZSBhbm5vdGF0aW9uIGZyb20gZGlmZmVyZW50IHNvdXJjZSB0b2dldGhlciBieSBvdmVyd3JpdGluZyBhdCB0aGUgdGVybSBsZXZlbC5cbiAqXG4gKiBAcGFyYW0gcmF3TWV0YWRhdGFcbiAqIEByZXR1cm5zIHRoZSByZXN1bHRpbmcgbWVyZ2VkIGFubm90YXRpb25zXG4gKi9cbmZ1bmN0aW9uIG1lcmdlQW5ub3RhdGlvbnMocmF3TWV0YWRhdGEpIHtcbiAgICBjb25zdCBhbm5vdGF0aW9uTGlzdFBlclRhcmdldCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHJhd01ldGFkYXRhLnNjaGVtYS5hbm5vdGF0aW9ucykuZm9yRWFjaCgoYW5ub3RhdGlvblNvdXJjZSkgPT4ge1xuICAgICAgICByYXdNZXRhZGF0YS5zY2hlbWEuYW5ub3RhdGlvbnNbYW5ub3RhdGlvblNvdXJjZV0uZm9yRWFjaCgoYW5ub3RhdGlvbkxpc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYXJnZXROYW1lID0gKDAsIHV0aWxzXzEudW5hbGlhcykocmF3TWV0YWRhdGEucmVmZXJlbmNlcywgYW5ub3RhdGlvbkxpc3QudGFyZ2V0KTtcbiAgICAgICAgICAgIGFubm90YXRpb25MaXN0Ll9fc291cmNlID0gYW5ub3RhdGlvblNvdXJjZTtcbiAgICAgICAgICAgIGlmICghYW5ub3RhdGlvbkxpc3RQZXJUYXJnZXRbY3VycmVudFRhcmdldE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbkxpc3RQZXJUYXJnZXRbY3VycmVudFRhcmdldE5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uczogYW5ub3RhdGlvbkxpc3QuYW5ub3RhdGlvbnMuY29uY2F0KCksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogY3VycmVudFRhcmdldE5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFubm90YXRpb25MaXN0UGVyVGFyZ2V0W2N1cnJlbnRUYXJnZXROYW1lXS5fX3NvdXJjZSA9IGFubm90YXRpb25Tb3VyY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uTGlzdC5hbm5vdGF0aW9ucy5mb3JFYWNoKChhbm5vdGF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IGFubm90YXRpb25MaXN0UGVyVGFyZ2V0W2N1cnJlbnRUYXJnZXROYW1lXS5hbm5vdGF0aW9ucy5maW5kSW5kZXgoKHJlZmVyZW5jZUFubm90YXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAocmVmZXJlbmNlQW5ub3RhdGlvbi50ZXJtID09PSBhbm5vdGF0aW9uLnRlcm0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VBbm5vdGF0aW9uLnF1YWxpZmllciA9PT0gYW5ub3RhdGlvbi5xdWFsaWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYW5ub3RhdGlvbi5fX3NvdXJjZSA9IGFubm90YXRpb25Tb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaW5kSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uTGlzdFBlclRhcmdldFtjdXJyZW50VGFyZ2V0TmFtZV0uYW5ub3RhdGlvbnMuc3BsaWNlKGZpbmRJbmRleCwgMSwgYW5ub3RhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uTGlzdFBlclRhcmdldFtjdXJyZW50VGFyZ2V0TmFtZV0uYW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYW5ub3RhdGlvbkxpc3RQZXJUYXJnZXQ7XG59XG4vKipcbiAqIENvbnZlcnQgYSBSYXdNZXRhZGF0YSBpbnRvIGFuIG9iamVjdCByZXByZXNlbnRhdGlvbiB0byBiZSB1c2VkIHRvIGVhc2lseSBuYXZpZ2F0ZSBhIG1ldGFkYXRhIG9iamVjdCBhbmQgaXRzIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIHJhd01ldGFkYXRhXG4gKiBAcmV0dXJucyB0aGUgY29udmVydGVkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtZXRhZGF0YS5cbiAqL1xuZnVuY3Rpb24gY29udmVydChyYXdNZXRhZGF0YSkge1xuICAgIEFOTk9UQVRJT05fRVJST1JTID0gW107XG4gICAgY29uc3Qgb2JqZWN0TWFwID0gYnVpbGRPYmplY3RNYXAocmF3TWV0YWRhdGEpO1xuICAgIHJlc29sdmVOYXZpZ2F0aW9uUHJvcGVydGllcyhyYXdNZXRhZGF0YS5zY2hlbWEuZW50aXR5VHlwZXMsIHJhd01ldGFkYXRhLnNjaGVtYS5hc3NvY2lhdGlvbnMsIG9iamVjdE1hcCk7XG4gICAgcmF3TWV0YWRhdGEuc2NoZW1hLmVudGl0eUNvbnRhaW5lci5hbm5vdGF0aW9ucyA9IHt9O1xuICAgIGxpbmtBY3Rpb25zVG9FbnRpdHlUeXBlKHJhd01ldGFkYXRhLnNjaGVtYS5uYW1lc3BhY2UsIHJhd01ldGFkYXRhLnNjaGVtYS5hY3Rpb25zLCBvYmplY3RNYXApO1xuICAgIGxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQocmF3TWV0YWRhdGEuc2NoZW1hLmVudGl0eVNldHMsIG9iamVjdE1hcCwgcmF3TWV0YWRhdGEucmVmZXJlbmNlcyk7XG4gICAgbGlua0VudGl0eVR5cGVUb1NpbmdsZXRvbihyYXdNZXRhZGF0YS5zY2hlbWEuc2luZ2xldG9ucywgb2JqZWN0TWFwLCByYXdNZXRhZGF0YS5yZWZlcmVuY2VzKTtcbiAgICBsaW5rUHJvcGVydGllc1RvQ29tcGxleFR5cGVzKHJhd01ldGFkYXRhLnNjaGVtYS5lbnRpdHlUeXBlcywgb2JqZWN0TWFwKTtcbiAgICBwcmVwYXJlQ29tcGxleFR5cGVzKHJhd01ldGFkYXRhLnNjaGVtYS5jb21wbGV4VHlwZXMsIHJhd01ldGFkYXRhLnNjaGVtYS5hc3NvY2lhdGlvbnMsIG9iamVjdE1hcCk7XG4gICAgY29uc3QgdW5yZXNvbHZlZFRhcmdldHMgPSBbXTtcbiAgICBjb25zdCB1bnJlc29sdmVkQW5ub3RhdGlvbnMgPSBbXTtcbiAgICBjb25zdCBhbm5vdGF0aW9uTGlzdFBlclRhcmdldCA9IG1lcmdlQW5ub3RhdGlvbnMocmF3TWV0YWRhdGEpO1xuICAgIE9iamVjdC5rZXlzKGFubm90YXRpb25MaXN0UGVyVGFyZ2V0KS5mb3JFYWNoKChjdXJyZW50VGFyZ2V0TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBhbm5vdGF0aW9uTGlzdCA9IGFubm90YXRpb25MaXN0UGVyVGFyZ2V0W2N1cnJlbnRUYXJnZXROYW1lXTtcbiAgICAgICAgY29uc3Qgb2JqZWN0TWFwRWxlbWVudCA9IG9iamVjdE1hcFtjdXJyZW50VGFyZ2V0TmFtZV07XG4gICAgICAgIGlmICghb2JqZWN0TWFwRWxlbWVudCAmJiAoY3VycmVudFRhcmdldE5hbWUgPT09IG51bGwgfHwgY3VycmVudFRhcmdldE5hbWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRUYXJnZXROYW1lLmluZGV4T2YoJ0AnKSkgPiAwKSB7XG4gICAgICAgICAgICB1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uTGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JqZWN0TWFwRWxlbWVudCkge1xuICAgICAgICAgICAgbGV0IGFsbFRhcmdldHMgPSBbb2JqZWN0TWFwRWxlbWVudF07XG4gICAgICAgICAgICBsZXQgYk92ZXJyaWRlRXhpc3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9iamVjdE1hcEVsZW1lbnQuX3R5cGUgPT09ICdVbmJvdW5kR2VuZXJpY0FjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBhbGxUYXJnZXRzID0gb2JqZWN0TWFwRWxlbWVudC5hY3Rpb25zO1xuICAgICAgICAgICAgICAgIGJPdmVycmlkZUV4aXN0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGxUYXJnZXRzLmZvckVhY2goKGN1cnJlbnRUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbEFubm90YXRpb25zOiB1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTb3VyY2U6IGFubm90YXRpb25MaXN0Ll9fc291cmNlLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiBjdXJyZW50VGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGVybTogJycsXG4gICAgICAgICAgICAgICAgICAgIHJhd01ldGFkYXRhOiByYXdNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZEFubm90YXRpb25zOiB1bnJlc29sdmVkVGFyZ2V0c1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcHJvY2Vzc0Fubm90YXRpb25zKGN1cnJlbnRDb250ZXh0LCBhbm5vdGF0aW9uTGlzdCwgb2JqZWN0TWFwLCBiT3ZlcnJpZGVFeGlzdGluZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGV4dHJhVW5yZXNvbHZlZEFubm90YXRpb25zID0gW107XG4gICAgdW5yZXNvbHZlZEFubm90YXRpb25zLmZvckVhY2goKGFubm90YXRpb25MaXN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXJnZXROYW1lID0gKDAsIHV0aWxzXzEudW5hbGlhcykocmF3TWV0YWRhdGEucmVmZXJlbmNlcywgYW5ub3RhdGlvbkxpc3QudGFyZ2V0KTtcbiAgICAgICAgbGV0IFtiYXNlT2JqLCBhbm5vdGF0aW9uUGFydF0gPSBjdXJyZW50VGFyZ2V0TmFtZS5zcGxpdCgnQCcpO1xuICAgICAgICBjb25zdCB0YXJnZXRTcGxpdCA9IGFubm90YXRpb25QYXJ0LnNwbGl0KCcvJyk7XG4gICAgICAgIGJhc2VPYmogPSBiYXNlT2JqICsgJ0AnICsgdGFyZ2V0U3BsaXRbMF07XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXJnZXQgPSB0YXJnZXRTcGxpdC5zbGljZSgxKS5yZWR1Y2UoKGN1cnJlbnRPYmosIHBhdGgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50T2JqID09PSBudWxsIHx8IGN1cnJlbnRPYmogPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRPYmpbcGF0aF07XG4gICAgICAgIH0sIG9iamVjdE1hcFtiYXNlT2JqXSk7XG4gICAgICAgIGlmICghY3VycmVudFRhcmdldCB8fCB0eXBlb2YgY3VycmVudFRhcmdldCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGUgZm9sbG93aW5nIGFubm90YXRpb24gdGFyZ2V0IHdhcyBub3QgZm91bmQgb24gdGhlIHNlcnZpY2UgJyArIGN1cnJlbnRUYXJnZXROYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxBbm5vdGF0aW9uczogZXh0cmFVbnJlc29sdmVkQW5ub3RhdGlvbnMsXG4gICAgICAgICAgICAgICAgY3VycmVudFNvdXJjZTogYW5ub3RhdGlvbkxpc3QuX19zb3VyY2UsXG4gICAgICAgICAgICAgICAgY3VycmVudFRhcmdldDogY3VycmVudFRhcmdldCxcbiAgICAgICAgICAgICAgICBjdXJyZW50VGVybTogJycsXG4gICAgICAgICAgICAgICAgcmF3TWV0YWRhdGE6IHJhd01ldGFkYXRhLFxuICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRBbm5vdGF0aW9uczogdW5yZXNvbHZlZFRhcmdldHNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBwcm9jZXNzQW5ub3RhdGlvbnMoY3VycmVudENvbnRleHQsIGFubm90YXRpb25MaXN0LCBvYmplY3RNYXAsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHByb2Nlc3NVbnJlc29sdmVkVGFyZ2V0cyh1bnJlc29sdmVkVGFyZ2V0cywgb2JqZWN0TWFwKTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIEFMTF9BTk5PVEFUSU9OX0VSUk9SUykge1xuICAgICAgICBBTk5PVEFUSU9OX0VSUk9SUy5wdXNoKEFMTF9BTk5PVEFUSU9OX0VSUk9SU1twcm9wZXJ0eV1bMF0pO1xuICAgIH1cbiAgICByYXdNZXRhZGF0YS5lbnRpdHlTZXRzID0gcmF3TWV0YWRhdGEuc2NoZW1hLmVudGl0eVNldHM7XG4gICAgY29uc3QgZXh0cmFSZWZlcmVuY2VzID0gcmF3TWV0YWRhdGEucmVmZXJlbmNlcy5maWx0ZXIoKHJlZmVyZW5jZSkgPT4ge1xuICAgICAgICByZXR1cm4gdXRpbHNfMS5kZWZhdWx0UmVmZXJlbmNlcy5maW5kKChkZWZhdWx0UmVmKSA9PiBkZWZhdWx0UmVmLm5hbWVzcGFjZSA9PT0gcmVmZXJlbmNlLm5hbWVzcGFjZSkgPT09IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBjb25zdCBjb252ZXJ0ZWRPdXRwdXQgPSB7XG4gICAgICAgIHZlcnNpb246IHJhd01ldGFkYXRhLnZlcnNpb24sXG4gICAgICAgIGFubm90YXRpb25zOiByYXdNZXRhZGF0YS5zY2hlbWEuYW5ub3RhdGlvbnMsXG4gICAgICAgIG5hbWVzcGFjZTogcmF3TWV0YWRhdGEuc2NoZW1hLm5hbWVzcGFjZSxcbiAgICAgICAgZW50aXR5Q29udGFpbmVyOiByYXdNZXRhZGF0YS5zY2hlbWEuZW50aXR5Q29udGFpbmVyLFxuICAgICAgICBhY3Rpb25zOiByYXdNZXRhZGF0YS5zY2hlbWEuYWN0aW9ucyxcbiAgICAgICAgZW50aXR5U2V0czogcmF3TWV0YWRhdGEuc2NoZW1hLmVudGl0eVNldHMsXG4gICAgICAgIHNpbmdsZXRvbnM6IHJhd01ldGFkYXRhLnNjaGVtYS5zaW5nbGV0b25zLFxuICAgICAgICBlbnRpdHlUeXBlczogcmF3TWV0YWRhdGEuc2NoZW1hLmVudGl0eVR5cGVzLFxuICAgICAgICBjb21wbGV4VHlwZXM6IHJhd01ldGFkYXRhLnNjaGVtYS5jb21wbGV4VHlwZXMsXG4gICAgICAgIHR5cGVEZWZpbml0aW9uczogcmF3TWV0YWRhdGEuc2NoZW1hLnR5cGVEZWZpbml0aW9ucyxcbiAgICAgICAgcmVmZXJlbmNlczogdXRpbHNfMS5kZWZhdWx0UmVmZXJlbmNlcy5jb25jYXQoZXh0cmFSZWZlcmVuY2VzKSxcbiAgICAgICAgZGlhZ25vc3RpY3M6IEFOTk9UQVRJT05fRVJST1JTLmNvbmNhdCgpXG4gICAgfTtcbiAgICBjb252ZXJ0ZWRPdXRwdXQucmVzb2x2ZVBhdGggPSBjcmVhdGVHbG9iYWxSZXNvbHZlKGNvbnZlcnRlZE91dHB1dCwgb2JqZWN0TWFwKTtcbiAgICByZXR1cm4gY29udmVydGVkT3V0cHV0O1xufVxuZXhwb3J0cy5jb252ZXJ0ID0gY29udmVydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnZlcnRlci5qcy5tYXBcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCAoeyB2YWx1ZTogdHJ1ZSB9KSk7XG5fX2V4cG9ydFN0YXIoX193ZWJwYWNrX3JlcXVpcmVfXyg4NzUpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihfX3dlYnBhY2tfcmVxdWlyZV9fKDQyNiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKF9fd2VicGFja19yZXF1aXJlX18oNjkpLCBleHBvcnRzKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuXG4vKioqLyB9KSxcblxuLyoqKi8gNjk6XG4vKioqLyAoZnVuY3Rpb24oX191bnVzZWRfd2VicGFja19tb2R1bGUsIGV4cG9ydHMpIHtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsICh7IHZhbHVlOiB0cnVlIH0pKTtcbmV4cG9ydHMuRGVjaW1hbCA9IGV4cG9ydHMuaXNDb21wbGV4VHlwZURlZmluaXRpb24gPSBleHBvcnRzLlRlcm1Ub1R5cGVzID0gZXhwb3J0cy51bmFsaWFzID0gZXhwb3J0cy5hbGlhcyA9IGV4cG9ydHMuZGVmYXVsdFJlZmVyZW5jZXMgPSB2b2lkIDA7XG5leHBvcnRzLmRlZmF1bHRSZWZlcmVuY2VzID0gW1xuICAgIHsgYWxpYXM6ICdDYXBhYmlsaXRpZXMnLCBuYW1lc3BhY2U6ICdPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxJywgdXJpOiAnJyB9LFxuICAgIHsgYWxpYXM6ICdBZ2dyZWdhdGlvbicsIG5hbWVzcGFjZTogJ09yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMScsIHVyaTogJycgfSxcbiAgICB7IGFsaWFzOiAnVmFsaWRhdGlvbicsIG5hbWVzcGFjZTogJ09yZy5PRGF0YS5WYWxpZGF0aW9uLlYxJywgdXJpOiAnJyB9LFxuICAgIHsgbmFtZXNwYWNlOiAnT3JnLk9EYXRhLkNvcmUuVjEnLCBhbGlhczogJ0NvcmUnLCB1cmk6ICcnIH0sXG4gICAgeyBuYW1lc3BhY2U6ICdPcmcuT0RhdGEuTWVhc3VyZXMuVjEnLCBhbGlhczogJ01lYXN1cmVzJywgdXJpOiAnJyB9LFxuICAgIHsgbmFtZXNwYWNlOiAnY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxJywgYWxpYXM6ICdDb21tb24nLCB1cmk6ICcnIH0sXG4gICAgeyBuYW1lc3BhY2U6ICdjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MScsIGFsaWFzOiAnVUknLCB1cmk6ICcnIH0sXG4gICAgeyBuYW1lc3BhY2U6ICdjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxJywgYWxpYXM6ICdTZXNzaW9uJywgdXJpOiAnJyB9LFxuICAgIHsgbmFtZXNwYWNlOiAnY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxJywgYWxpYXM6ICdBbmFseXRpY3MnLCB1cmk6ICcnIH0sXG4gICAgeyBuYW1lc3BhY2U6ICdjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MScsIGFsaWFzOiAnQ29kZUxpc3QnLCB1cmk6ICcnIH0sXG4gICAgeyBuYW1lc3BhY2U6ICdjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEnLCBhbGlhczogJ1BlcnNvbmFsRGF0YScsIHVyaTogJycgfSxcbiAgICB7IG5hbWVzcGFjZTogJ2NvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEnLCBhbGlhczogJ0NvbW11bmljYXRpb24nLCB1cmk6ICcnIH0sXG4gICAgeyBuYW1lc3BhY2U6ICdjb20uc2FwLnZvY2FidWxhcmllcy5IVE1MNS52MScsIGFsaWFzOiAnSFRNTDUnLCB1cmk6ICcnIH1cbl07XG4vKipcbiAqIFRyYW5zZm9ybSBhbiB1bmFsaWFzZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGFubm90YXRpb24gdG8gdGhlIGFsaWFzZWQgdmVyc2lvbi5cbiAqXG4gKiBAcGFyYW0gcmVmZXJlbmNlcyBjdXJyZW50UmVmZXJlbmNlcyBmb3IgdGhlIHByb2plY3RcbiAqIEBwYXJhbSB1bmFsaWFzZWRWYWx1ZSB0aGUgdW5hbGlhc2VkIHZhbHVlXG4gKiBAcmV0dXJucyB0aGUgYWxpYXNlZCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBzYW1lXG4gKi9cbmZ1bmN0aW9uIGFsaWFzKHJlZmVyZW5jZXMsIHVuYWxpYXNlZFZhbHVlKSB7XG4gICAgaWYgKCFyZWZlcmVuY2VzLnJldmVyc2VSZWZlcmVuY2VNYXApIHtcbiAgICAgICAgcmVmZXJlbmNlcy5yZXZlcnNlUmVmZXJlbmNlTWFwID0gcmVmZXJlbmNlcy5yZWR1Y2UoKG1hcCwgcmVmKSA9PiB7XG4gICAgICAgICAgICBtYXBbcmVmLm5hbWVzcGFjZV0gPSByZWY7XG4gICAgICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgICB9LCB7fSk7XG4gICAgfVxuICAgIGlmICghdW5hbGlhc2VkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHVuYWxpYXNlZFZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBsYXN0RG90SW5kZXggPSB1bmFsaWFzZWRWYWx1ZS5sYXN0SW5kZXhPZignLicpO1xuICAgIGNvbnN0IG5hbWVzcGFjZSA9IHVuYWxpYXNlZFZhbHVlLnN1YnN0cmluZygwLCBsYXN0RG90SW5kZXgpO1xuICAgIGNvbnN0IHZhbHVlID0gdW5hbGlhc2VkVmFsdWUuc3Vic3RyaW5nKGxhc3REb3RJbmRleCArIDEpO1xuICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXMucmV2ZXJzZVJlZmVyZW5jZU1hcFtuYW1lc3BhY2VdO1xuICAgIGlmIChyZWZlcmVuY2UpIHtcbiAgICAgICAgcmV0dXJuIGAke3JlZmVyZW5jZS5hbGlhc30uJHt2YWx1ZX1gO1xuICAgIH1cbiAgICBlbHNlIGlmICh1bmFsaWFzZWRWYWx1ZS5pbmRleE9mKCdAJykgIT09IC0xKSB7XG4gICAgICAgIC8vIFRyeSB0byBzZWUgaWYgaXQncyBhbiBhbm5vdGF0aW9uIFBhdGggbGlrZSB0b19TYWxlc09yZGVyL0BVSS5MaW5lSXRlbVxuICAgICAgICBjb25zdCBbcHJlQWxpYXMsIC4uLnBvc3RBbGlhc10gPSB1bmFsaWFzZWRWYWx1ZS5zcGxpdCgnQCcpO1xuICAgICAgICByZXR1cm4gYCR7cHJlQWxpYXN9QCR7YWxpYXMocmVmZXJlbmNlcywgcG9zdEFsaWFzLmpvaW4oJ0AnKSl9YDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmFsaWFzZWRWYWx1ZTtcbiAgICB9XG59XG5leHBvcnRzLmFsaWFzID0gYWxpYXM7XG4vKipcbiAqIFRyYW5zZm9ybSBhbiBhbGlhc2VkIHN0cmluZyByZXByZXNlbnRhdGlvbiBhbm5vdGF0aW9uIHRvIHRoZSB1bmFsaWFzZWQgdmVyc2lvbi5cbiAqXG4gKiBAcGFyYW0gcmVmZXJlbmNlcyBjdXJyZW50UmVmZXJlbmNlcyBmb3IgdGhlIHByb2plY3RcbiAqIEBwYXJhbSBhbGlhc2VkVmFsdWUgdGhlIGFsaWFzZWQgdmFsdWVcbiAqIEByZXR1cm5zIHRoZSB1bmFsaWFzZWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgc2FtZVxuICovXG5mdW5jdGlvbiB1bmFsaWFzKHJlZmVyZW5jZXMsIGFsaWFzZWRWYWx1ZSkge1xuICAgIGlmICghcmVmZXJlbmNlcy5yZWZlcmVuY2VNYXApIHtcbiAgICAgICAgcmVmZXJlbmNlcy5yZWZlcmVuY2VNYXAgPSByZWZlcmVuY2VzLnJlZHVjZSgobWFwLCByZWYpID0+IHtcbiAgICAgICAgICAgIG1hcFtyZWYuYWxpYXNdID0gcmVmO1xuICAgICAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgICAgfSwge30pO1xuICAgIH1cbiAgICBpZiAoIWFsaWFzZWRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZFZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBbdm9jQWxpYXMsIC4uLnZhbHVlXSA9IGFsaWFzZWRWYWx1ZS5zcGxpdCgnLicpO1xuICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXMucmVmZXJlbmNlTWFwW3ZvY0FsaWFzXTtcbiAgICBpZiAocmVmZXJlbmNlKSB7XG4gICAgICAgIHJldHVybiBgJHtyZWZlcmVuY2UubmFtZXNwYWNlfS4ke3ZhbHVlLmpvaW4oJy4nKX1gO1xuICAgIH1cbiAgICBlbHNlIGlmIChhbGlhc2VkVmFsdWUuaW5kZXhPZignQCcpICE9PSAtMSkge1xuICAgICAgICAvLyBUcnkgdG8gc2VlIGlmIGl0J3MgYW4gYW5ub3RhdGlvbiBQYXRoIGxpa2UgdG9fU2FsZXNPcmRlci9AVUkuTGluZUl0ZW1cbiAgICAgICAgY29uc3QgW3ByZUFsaWFzLCAuLi5wb3N0QWxpYXNdID0gYWxpYXNlZFZhbHVlLnNwbGl0KCdAJyk7XG4gICAgICAgIHJldHVybiBgJHtwcmVBbGlhc31AJHt1bmFsaWFzKHJlZmVyZW5jZXMsIHBvc3RBbGlhcy5qb2luKCdAJykpfWA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gYWxpYXNlZFZhbHVlO1xuICAgIH1cbn1cbmV4cG9ydHMudW5hbGlhcyA9IHVuYWxpYXM7XG52YXIgVGVybVRvVHlwZXM7XG4oZnVuY3Rpb24gKFRlcm1Ub1R5cGVzKSB7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQXV0aG9yaXphdGlvbi5WMS5TZWN1cml0eVNjaGVtZXNcIl0gPSBcIk9yZy5PRGF0YS5BdXRob3JpemF0aW9uLlYxLlNlY3VyaXR5U2NoZW1lXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQXV0aG9yaXphdGlvbi5WMS5BdXRob3JpemF0aW9uc1wiXSA9IFwiT3JnLk9EYXRhLkF1dGhvcml6YXRpb24uVjEuQXV0aG9yaXphdGlvblwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuUmV2aXNpb25zXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5SZXZpc2lvblR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLkxpbmtzXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5MaW5rXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ29yZS5WMS5FeGFtcGxlXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5FeGFtcGxlVmFsdWVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLk1lc3NhZ2VzXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5NZXNzYWdlVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuVmFsdWVFeGNlcHRpb25cIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlZhbHVlRXhjZXB0aW9uVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuUmVzb3VyY2VFeGNlcHRpb25cIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlJlc291cmNlRXhjZXB0aW9uVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuRGF0YU1vZGlmaWNhdGlvbkV4Y2VwdGlvblwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuRGF0YU1vZGlmaWNhdGlvbkV4Y2VwdGlvblR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLklzTGFuZ3VhZ2VEZXBlbmRlbnRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuRGVyZWZlcmVuY2VhYmxlSURzXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbnZlbnRpb25hbElEc1wiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ29yZS5WMS5QZXJtaXNzaW9uc1wiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUGVybWlzc2lvblwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuRGVmYXVsdE5hbWVzcGFjZVwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ29yZS5WMS5JbW11dGFibGVcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuQ29tcHV0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuQ29tcHV0ZWREZWZhdWx0VmFsdWVcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuSXNVUkxcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuSXNNZWRpYVR5cGVcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuQ29udGVudERpc3Bvc2l0aW9uXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5Db250ZW50RGlzcG9zaXRpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ29yZS5WMS5PcHRpbWlzdGljQ29uY3VycmVuY3lcIl0gPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLkFkZGl0aW9uYWxQcm9wZXJ0aWVzXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLkF1dG9FeHBhbmRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuQXV0b0V4cGFuZFJlZmVyZW5jZXNcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuTWF5SW1wbGVtZW50XCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5RdWFsaWZpZWRUeXBlTmFtZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuT3JkZXJlZFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ29yZS5WMS5Qb3NpdGlvbmFsSW5zZXJ0XCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5Db3JlLlYxLkFsdGVybmF0ZUtleXNcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLkFsdGVybmF0ZUtleVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuT3B0aW9uYWxQYXJhbWV0ZXJcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLk9wdGlvbmFsUGFyYW1ldGVyVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuT3BlcmF0aW9uQXZhaWxhYmxlXCJdID0gXCJFZG0uQm9vbGVhblwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNvcmUuVjEuU3ltYm9saWNOYW1lXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5TaW1wbGVJZGVudGlmaWVyXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbmZvcm1hbmNlTGV2ZWxcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ29uZm9ybWFuY2VMZXZlbFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQXN5bmNocm9ub3VzUmVxdWVzdHNTdXBwb3J0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5CYXRjaENvbnRpbnVlT25FcnJvclN1cHBvcnRlZFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLklzb2xhdGlvblN1cHBvcnRlZFwiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Jc29sYXRpb25MZXZlbFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Dcm9zc0pvaW5TdXBwb3J0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DYWxsYmFja1N1cHBvcnRlZFwiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DYWxsYmFja1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ2hhbmdlVHJhY2tpbmdcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ2hhbmdlVHJhY2tpbmdUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvdW50UmVzdHJpY3Rpb25zXCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvdW50UmVzdHJpY3Rpb25zVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zXCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk5hdmlnYXRpb25SZXN0cmljdGlvbnNUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkluZGV4YWJsZUJ5S2V5XCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVG9wU3VwcG9ydGVkXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU2tpcFN1cHBvcnRlZFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbXB1dGVTdXBwb3J0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWxlY3RTdXBwb3J0XCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNlbGVjdFN1cHBvcnRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkJhdGNoU3VwcG9ydGVkXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQmF0Y2hTdXBwb3J0XCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkJhdGNoU3VwcG9ydFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRmlsdGVyUmVzdHJpY3Rpb25zXCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkZpbHRlclJlc3RyaWN0aW9uc1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU29ydFJlc3RyaWN0aW9uc1wiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Tb3J0UmVzdHJpY3Rpb25zVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5FeHBhbmRSZXN0cmljdGlvbnNcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRXhwYW5kUmVzdHJpY3Rpb25zVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWFyY2hSZXN0cmljdGlvbnNcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU2VhcmNoUmVzdHJpY3Rpb25zVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5LZXlBc1NlZ21lbnRTdXBwb3J0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5RdWVyeVNlZ21lbnRTdXBwb3J0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5JbnNlcnRSZXN0cmljdGlvbnNcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSW5zZXJ0UmVzdHJpY3Rpb25zVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWVwSW5zZXJ0U3VwcG9ydFwiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWVwSW5zZXJ0U3VwcG9ydFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVXBkYXRlUmVzdHJpY3Rpb25zXCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlVwZGF0ZVJlc3RyaWN0aW9uc1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVlcFVwZGF0ZVN1cHBvcnRcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVlcFVwZGF0ZVN1cHBvcnRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkRlbGV0ZVJlc3RyaWN0aW9uc1wiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWxldGVSZXN0cmljdGlvbnNUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbGxlY3Rpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uc1wiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Db2xsZWN0aW9uUHJvcGVydHlSZXN0cmljdGlvbnNUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk9wZXJhdGlvblJlc3RyaWN0aW9uc1wiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5PcGVyYXRpb25SZXN0cmljdGlvbnNUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkFubm90YXRpb25WYWx1ZXNJblF1ZXJ5U3VwcG9ydGVkXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuTW9kaWZpY2F0aW9uUXVlcnlPcHRpb25zXCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk1vZGlmaWNhdGlvblF1ZXJ5T3B0aW9uc1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuUmVhZFJlc3RyaWN0aW9uc1wiXSA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5SZWFkUmVzdHJpY3Rpb25zVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DdXN0b21IZWFkZXJzXCJdID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkN1c3RvbVBhcmFtZXRlclwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DdXN0b21RdWVyeU9wdGlvbnNcIl0gPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ3VzdG9tUGFyYW1ldGVyXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk1lZGlhTG9jYXRpb25VcGRhdGVTdXBwb3J0ZWRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkFwcGx5U3VwcG9ydGVkXCJdID0gXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQXBwbHlTdXBwb3J0ZWRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuR3JvdXBhYmxlXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5BZ2dyZWdhdGFibGVcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXNcIl0gPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5MZXZlbGVkSGllcmFyY2h5XCJdID0gXCJFZG0uUHJvcGVydHlQYXRoXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuUmVjdXJzaXZlSGllcmFyY2h5XCJdID0gXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuUmVjdXJzaXZlSGllcmFyY2h5VHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkF2YWlsYWJsZU9uQWdncmVnYXRlc1wiXSA9IFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkF2YWlsYWJsZU9uQWdncmVnYXRlc1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW1cIl0gPSBcIkVkbS5QcmltaXRpdmVUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhpbXVtXCJdID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuRXhjbHVzaXZlXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkFsbG93ZWRWYWx1ZXNcIl0gPSBcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkFsbG93ZWRWYWx1ZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTXVsdGlwbGVPZlwiXSA9IFwiRWRtLkRlY2ltYWxcIjtcbiAgICBUZXJtVG9UeXBlc1tcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkNvbnN0cmFpbnRcIl0gPSBcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkNvbnN0cmFpbnRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5JdGVtc09mXCJdID0gXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5JdGVtc09mVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuT3BlblByb3BlcnR5VHlwZUNvbnN0cmFpbnRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlF1YWxpZmllZFR5cGVOYW1lXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5EZXJpdmVkVHlwZUNvbnN0cmFpbnRcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlF1YWxpZmllZFR5cGVOYW1lXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5BbGxvd2VkVGVybXNcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlF1YWxpZmllZFRlcm1OYW1lXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5BcHBsaWNhYmxlVGVybXNcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlF1YWxpZmllZFRlcm1OYW1lXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhJdGVtc1wiXSA9IFwiRWRtLkludDY0XCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NaW5JdGVtc1wiXSA9IFwiRWRtLkludDY0XCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuTWVhc3VyZXMuVjEuU2NhbGVcIl0gPSBcIkVkbS5CeXRlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJPcmcuT0RhdGEuTWVhc3VyZXMuVjEuRHVyYXRpb25HcmFudWxhcml0eVwiXSA9IFwiT3JnLk9EYXRhLk1lYXN1cmVzLlYxLkR1cmF0aW9uR3JhbnVsYXJpdHlUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjEuRGltZW5zaW9uXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5NZWFzdXJlXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5BY2N1bXVsYXRpdmVNZWFzdXJlXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5Sb2xsZWRVcFByb3BlcnR5Q291bnRcIl0gPSBcIkVkbS5JbnQxNlwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLlBsYW5uaW5nQWN0aW9uXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5BZ2dyZWdhdGVkUHJvcGVydGllc1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLkFnZ3JlZ2F0ZWRQcm9wZXJ0eVR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZXJ2aWNlVmVyc2lvblwiXSA9IFwiRWRtLkludDMyXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2VydmljZVNjaGVtYVZlcnNpb25cIl0gPSBcIkVkbS5JbnQzMlwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRGb3JcIl0gPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0xhbmd1YWdlSWRlbnRpZmllclwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dEZvcm1hdFwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRGb3JtYXRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNEaWdpdFNlcXVlbmNlXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc1VwcGVyQ2FzZVwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDdXJyZW5jeVwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNVbml0XCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Vbml0U3BlY2lmaWNTY2FsZVwiXSA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Vbml0U3BlY2lmaWNQcmVjaXNpb25cIl0gPSBcIkVkbS5QcmltaXRpdmVUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2Vjb25kYXJ5S2V5XCJdID0gXCJFZG0uUHJvcGVydHlQYXRoXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWluT2NjdXJzXCJdID0gXCJFZG0uSW50NjRcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NYXhPY2N1cnNcIl0gPSBcIkVkbS5JbnQ2NFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFzc29jaWF0aW9uRW50aXR5XCJdID0gXCJFZG0uTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRlcml2ZWROYXZpZ2F0aW9uXCJdID0gXCJFZG0uTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk1hc2tlZFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWFza2VkQWx3YXlzXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY09iamVjdE1hcHBpbmdcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY09iamVjdE1hcHBpbmdUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNJbnN0YW5jZUFubm90YXRpb25cIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnNcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmllbGRDb250cm9sXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmllbGRDb250cm9sVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFwcGxpY2F0aW9uXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQXBwbGljYXRpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGltZXN0YW1wXCJdID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5FcnJvclJlc29sdXRpb25cIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5FcnJvclJlc29sdXRpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWVzc2FnZXNcIl0gPSBcIkVkbS5Db21wbGV4VHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLm51bWVyaWNTZXZlcml0eVwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk51bWVyaWNNZXNzYWdlU2V2ZXJpdHlUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWF4aW11bU51bWVyaWNNZXNzYWdlU2V2ZXJpdHlcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5OdW1lcmljTWVzc2FnZVNldmVyaXR5VHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQWN0aW9uQ3JpdGljYWxcIl0gPSBcIkVkbS5Cb29sZWFuXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQXR0cmlidXRlc1wiXSA9IFwiRWRtLlByb3BlcnR5UGF0aFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlJlbGF0ZWRSZWN1cnNpdmVIaWVyYXJjaHlcIl0gPSBcIkVkbS5Bbm5vdGF0aW9uUGF0aFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkludGVydmFsXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSW50ZXJ2YWxUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVzdWx0Q29udGV4dFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuV2Vha1JlZmVyZW50aWFsQ29uc3RyYWludFwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLldlYWtSZWZlcmVudGlhbENvbnN0cmFpbnRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNOYXR1cmFsUGVyc29uXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0UmVsZXZhbnRRdWFsaWZpZXJzXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2ltcGxlSWRlbnRpZmllclwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFdpdGhGaXhlZFZhbHVlc1wiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0TWFwcGluZ1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdE1hcHBpbmdUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhclllYXJcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJIYWxmeWVhclwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhclF1YXJ0ZXJcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJNb250aFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhcldlZWtcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGF5T2ZDYWxlbmRhck1vbnRoXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0RheU9mQ2FsZW5kYXJZZWFyXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyWWVhckhhbGZ5ZWFyXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyWWVhclF1YXJ0ZXJcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJZZWFyTW9udGhcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJZZWFyV2Vla1wiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhckRhdGVcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhclwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxQZXJpb2RcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhclBlcmlvZFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxRdWFydGVyXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFllYXJRdWFydGVyXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFdlZWtcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhcldlZWtcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGF5T2ZGaXNjYWxZZWFyXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFllYXJWYXJpYW50XCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NdXR1YWxseUV4Y2x1c2l2ZVRlcm1cIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdE5vZGVcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdE5vZGVUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRBY3RpdmF0aW9uVmlhXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2ltcGxlSWRlbnRpZmllclwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkVkaXRhYmxlRmllbGRGb3JcIl0gPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY0tleVwiXSA9IFwiRWRtLlByb3BlcnR5UGF0aFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNpZGVFZmZlY3RzXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2lkZUVmZmVjdHNUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRGVmYXVsdFZhbHVlc0Z1bmN0aW9uXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUXVhbGlmaWVkTmFtZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckRlZmF1bHRWYWx1ZVwiXSA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWx0ZXJEZWZhdWx0VmFsdWVIaWdoXCJdID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNvcnRPcmRlclwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNvcnRPcmRlclR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5SZWN1cnNpdmVIaWVyYXJjaHlcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5SZWN1cnNpdmVIaWVyYXJjaHlUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQ3JlYXRlZEF0XCJdID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5DcmVhdGVkQnlcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Vc2VySURcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5DaGFuZ2VkQXRcIl0gPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkNoYW5nZWRCeVwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlVzZXJJRFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFwcGx5TXVsdGlVbml0QmVoYXZpb3JGb3JTb3J0aW5nQW5kRmlsdGVyaW5nXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLkN1cnJlbmN5Q29kZXNcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLkNvZGVMaXN0U291cmNlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5Vbml0c09mTWVhc3VyZVwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjEuQ29kZUxpc3RTb3VyY2VcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLlN0YW5kYXJkQ29kZVwiXSA9IFwiRWRtLlByb3BlcnR5UGF0aFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjEuRXh0ZXJuYWxDb2RlXCJdID0gXCJFZG0uUHJvcGVydHlQYXRoXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5Jc0NvbmZpZ3VyYXRpb25EZXByZWNhdGlvbkNvZGVcIl0gPSBcIkVkbS5Cb29sZWFuXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkNvbnRhY3RcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQWRkcmVzc1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5BZGRyZXNzVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5Jc0VtYWlsQWRkcmVzc1wiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLklzUGhvbmVOdW1iZXJcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5FdmVudFwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5FdmVudERhdGFcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuVGFza1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5UYXNrRGF0YVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5NZXNzYWdlXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLk1lc3NhZ2VEYXRhXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5IaWVyYXJjaHkudjEuUmVjdXJzaXZlSGllcmFyY2h5XCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5IaWVyYXJjaHkudjEuUmVjdXJzaXZlSGllcmFyY2h5VHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLkVudGl0eVNlbWFudGljc1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLkVudGl0eVNlbWFudGljc1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlBlcnNvbmFsRGF0YS52MS5GaWVsZFNlbWFudGljc1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLkZpZWxkU2VtYW50aWNzVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLklzUG90ZW50aWFsbHlQZXJzb25hbFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEuSXNQb3RlbnRpYWxseVNlbnNpdGl2ZVwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxLlN0aWNreVNlc3Npb25TdXBwb3J0ZWRcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjEuU3RpY2t5U2Vzc2lvblN1cHBvcnRlZFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckluZm9cIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckluZm9UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkQWJzdHJhY3RcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkJhZGdlXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5CYWRnZVR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRBYnN0cmFjdFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU3RhdHVzSW5mb1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkQWJzdHJhY3RcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db25uZWN0ZWRGaWVsZHNcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNvbm5lY3RlZEZpZWxkc1R5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkdlb0xvY2F0aW9uc1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuR2VvTG9jYXRpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5HZW9Mb2NhdGlvblwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuR2VvTG9jYXRpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db250YWN0c1wiXSA9IFwiRWRtLkFubm90YXRpb25QYXRoXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5NZWRpYVJlc291cmNlXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5NZWRpYVJlc291cmNlVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50XCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5LUElcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLktQSVR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydERlZmluaXRpb25UeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5WYWx1ZUNyaXRpY2FsaXR5XCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5WYWx1ZUNyaXRpY2FsaXR5VHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlMYWJlbHNcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNyaXRpY2FsaXR5TGFiZWxUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIl0gPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZhY2V0c1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmFjZXRcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckZhY2V0c1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmFjZXRcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlF1aWNrVmlld0ZhY2V0c1wiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmFjZXRcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlF1aWNrQ3JlYXRlRmFjZXRzXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GYWNldFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmlsdGVyRmFjZXRzXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWZlcmVuY2VGYWNldFwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlByZXNlbnRhdGlvblZhcmlhbnRcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlByZXNlbnRhdGlvblZhcmlhbnRUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25WYXJpYW50XCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25WYXJpYW50VHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGhpbmdQZXJzcGVjdGl2ZVwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Jc1N1bW1hcnlcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUGFydE9mUHJldmlld1wiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5NYXBcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuR2FsbGVyeVwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Jc0ltYWdlVVJMXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklzSW1hZ2VcIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTXVsdGlMaW5lVGV4dFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFR5cGVcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkltcG9ydGFuY2VcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkltcG9ydGFuY2VUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5cIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JlYXRlSGlkZGVuXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlVwZGF0ZUhpZGRlblwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EZWxldGVIaWRkZW5cIl0gPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuRmlsdGVyXCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZERlZmF1bHRcIl0gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEFic3RyYWN0XCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eVwiXSA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRW1waGFzaXplZFwiXSA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5PcmRlckJ5XCJdID0gXCJFZG0uUHJvcGVydHlQYXRoXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5QYXJhbWV0ZXJEZWZhdWx0VmFsdWVcIl0gPSBcIkVkbS5QcmltaXRpdmVUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWNvbW1lbmRhdGlvblN0YXRlXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWNvbW1lbmRhdGlvblN0YXRlVHlwZVwiO1xuICAgIFRlcm1Ub1R5cGVzW1wiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUmVjb21tZW5kYXRpb25MaXN0XCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWNvbW1lbmRhdGlvbkxpc3RUeXBlXCI7XG4gICAgVGVybVRvVHlwZXNbXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5FeGNsdWRlRnJvbU5hdmlnYXRpb25Db250ZXh0XCJdID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIjtcbiAgICBUZXJtVG9UeXBlc1tcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkhUTUw1LnYxLkNzc0RlZmF1bHRzXCJdID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5IVE1MNS52MS5Dc3NEZWZhdWx0c1R5cGVcIjtcbn0pKFRlcm1Ub1R5cGVzID0gZXhwb3J0cy5UZXJtVG9UeXBlcyB8fCAoZXhwb3J0cy5UZXJtVG9UeXBlcyA9IHt9KSk7XG4vKipcbiAqIERpZmZlcmVudGlhdGUgYmV0d2VlbiBhIENvbXBsZXhUeXBlIGFuZCBhIFR5cGVEZWZpbml0aW9uLlxuICogQHBhcmFtIGNvbXBsZXhUeXBlRGVmaW5pdGlvblxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYSBjb21wbGV4IHR5cGVcbiAqL1xuZnVuY3Rpb24gaXNDb21wbGV4VHlwZURlZmluaXRpb24oY29tcGxleFR5cGVEZWZpbml0aW9uKSB7XG4gICAgcmV0dXJuICghIWNvbXBsZXhUeXBlRGVmaW5pdGlvbiAmJiBjb21wbGV4VHlwZURlZmluaXRpb24uX3R5cGUgPT09ICdDb21wbGV4VHlwZScgJiYgISFjb21wbGV4VHlwZURlZmluaXRpb24ucHJvcGVydGllcyk7XG59XG5leHBvcnRzLmlzQ29tcGxleFR5cGVEZWZpbml0aW9uID0gaXNDb21wbGV4VHlwZURlZmluaXRpb247XG5mdW5jdGlvbiBEZWNpbWFsKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXNEZWNpbWFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlT2YoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5EZWNpbWFsID0gRGVjaW1hbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcFxuXG4vKioqLyB9KSxcblxuLyoqKi8gNDI2OlxuLyoqKi8gKGZ1bmN0aW9uKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCAoeyB2YWx1ZTogdHJ1ZSB9KSk7XG5leHBvcnRzLnJldmVydFRlcm1Ub0dlbmVyaWNUeXBlID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IF9fd2VicGFja19yZXF1aXJlX18oNjkpO1xuLyoqXG4gKiBSZXZlcnQgYW4gb2JqZWN0IHRvIGl0cyByYXcgdHlwZSBlcXVpdmFsZW50LlxuICpcbiAqIEBwYXJhbSByZWZlcmVuY2VzIHRoZSBjdXJyZW50IHJlZmVyZW5jZVxuICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byByZXZlcnRcbiAqIEByZXR1cm5zIHRoZSByYXcgdmFsdWVcbiAqL1xuZnVuY3Rpb24gcmV2ZXJ0T2JqZWN0VG9SYXdUeXBlKHJlZmVyZW5jZXMsIHZhbHVlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICB0eXBlOiAnQ29sbGVjdGlvbicsXG4gICAgICAgICAgICBDb2xsZWN0aW9uOiB2YWx1ZS5tYXAoKGFubm8pID0+IHJldmVydENvbGxlY3Rpb25JdGVtVG9SYXdUeXBlKHJlZmVyZW5jZXMsIGFubm8pKVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmICgoX2EgPSB2YWx1ZS5pc0RlY2ltYWwpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHZhbHVlKSkge1xuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICB0eXBlOiAnRGVjaW1hbCcsXG4gICAgICAgICAgICBEZWNpbWFsOiB2YWx1ZS52YWx1ZU9mKClcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoKF9iID0gdmFsdWUuaXNTdHJpbmcpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKHZhbHVlKSkge1xuICAgICAgICBjb25zdCB2YWx1ZU1hdGNoZXMgPSB2YWx1ZS5zcGxpdCgnLicpO1xuICAgICAgICBpZiAodmFsdWVNYXRjaGVzLmxlbmd0aCA+IDEgJiYgcmVmZXJlbmNlcy5maW5kKChyZWYpID0+IHJlZi5hbGlhcyA9PT0gdmFsdWVNYXRjaGVzWzBdKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdFbnVtTWVtYmVyJyxcbiAgICAgICAgICAgICAgICBFbnVtTWVtYmVyOiB2YWx1ZS52YWx1ZU9mKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgICAgICAgU3RyaW5nOiB2YWx1ZS52YWx1ZU9mKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gJ1BhdGgnKSB7XG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdQYXRoJyxcbiAgICAgICAgICAgIFBhdGg6IHZhbHVlLnBhdGhcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gJ0Fubm90YXRpb25QYXRoJykge1xuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICB0eXBlOiAnQW5ub3RhdGlvblBhdGgnLFxuICAgICAgICAgICAgQW5ub3RhdGlvblBhdGg6IHZhbHVlLnZhbHVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlLnR5cGUgPT09ICdBcHBseScpIHtcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgdHlwZTogJ0FwcGx5JyxcbiAgICAgICAgICAgIEFwcGx5OiB2YWx1ZS5BcHBseVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZS50eXBlID09PSAnTnVsbCcpIHtcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgdHlwZTogJ051bGwnXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlLnR5cGUgPT09ICdQcm9wZXJ0eVBhdGgnKSB7XG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdQcm9wZXJ0eVBhdGgnLFxuICAgICAgICAgICAgUHJvcGVydHlQYXRoOiB2YWx1ZS52YWx1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZS50eXBlID09PSAnTmF2aWdhdGlvblByb3BlcnR5UGF0aCcpIHtcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgdHlwZTogJ05hdmlnYXRpb25Qcm9wZXJ0eVBhdGgnLFxuICAgICAgICAgICAgTmF2aWdhdGlvblByb3BlcnR5UGF0aDogdmFsdWUudmFsdWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnJFR5cGUnKSkge1xuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICB0eXBlOiAnUmVjb3JkJyxcbiAgICAgICAgICAgIFJlY29yZDogcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub1Jhd1R5cGUocmVmZXJlbmNlcywgdmFsdWUpXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIFJldmVydCBhIHZhbHVlIHRvIGl0cyByYXcgdmFsdWUgZGVwZW5kaW5nIG9uIGl0cyB0eXBlLlxuICpcbiAqIEBwYXJhbSByZWZlcmVuY2VzIHRoZSBjdXJyZW50IHNldCBvZiByZWZlcmVuY2VcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gcmV2ZXJ0XG4gKiBAcmV0dXJucyB0aGUgcmF3IGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gcmV2ZXJ0VmFsdWVUb1Jhd1R5cGUocmVmZXJlbmNlcywgdmFsdWUpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGNvbnN0IHZhbHVlQ29uc3RydWN0b3IgPSB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgICBzd2l0Y2ggKHZhbHVlQ29uc3RydWN0b3IpIHtcbiAgICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTWF0Y2hlcyA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZU1hdGNoZXMubGVuZ3RoID4gMSAmJiByZWZlcmVuY2VzLmZpbmQoKHJlZikgPT4gcmVmLmFsaWFzID09PSB2YWx1ZU1hdGNoZXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnRW51bU1lbWJlcicsXG4gICAgICAgICAgICAgICAgICAgIEVudW1NZW1iZXI6IHZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgU3RyaW5nOiB2YWx1ZS50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0Jvb2wnLFxuICAgICAgICAgICAgICAgIEJvb2w6IHZhbHVlLnZhbHVlT2YoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdOdW1iZXInOlxuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgaWYgKHZhbHVlLnRvU3RyaW5nKCkgPT09IHZhbHVlLnRvRml4ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0ludCcsXG4gICAgICAgICAgICAgICAgICAgIEludDogdmFsdWUudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0RlY2ltYWwnLFxuICAgICAgICAgICAgICAgICAgICBEZWNpbWFsOiB2YWx1ZS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXN1bHQgPSByZXZlcnRPYmplY3RUb1Jhd1R5cGUocmVmZXJlbmNlcywgdmFsdWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5jb25zdCByZXN0cmljdGVkS2V5cyA9IFsnJFR5cGUnLCAndGVybScsICdfX3NvdXJjZScsICdxdWFsaWZpZXInLCAnQWN0aW9uVGFyZ2V0JywgJ2Z1bGx5UXVhbGlmaWVkTmFtZScsICdhbm5vdGF0aW9ucyddO1xuLyoqXG4gKiBSZXZlcnQgdGhlIGN1cnJlbnQgZW1iZWRkZWQgYW5ub3RhdGlvbnMgdG8gdGhlaXIgcmF3IHR5cGUuXG4gKlxuICogQHBhcmFtIHJlZmVyZW5jZXMgdGhlIGN1cnJlbnQgc2V0IG9mIHJlZmVyZW5jZVxuICogQHBhcmFtIGN1cnJlbnRBbm5vdGF0aW9ucyB0aGUgY29sbGVjdGlvbiBpdGVtIHRvIGV2YWx1YXRlXG4gKiBAcGFyYW0gdGFyZ2V0QW5ub3RhdGlvbnMgdGhlIHBsYWNlIHdoZXJlIHdlIG5lZWQgdG8gYWRkIHRoZSBhbm5vdGF0aW9uXG4gKi9cbmZ1bmN0aW9uIHJldmVydEFubm90YXRpb25zVG9SYXdUeXBlKHJlZmVyZW5jZXMsIGN1cnJlbnRBbm5vdGF0aW9ucywgdGFyZ2V0QW5ub3RhdGlvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhjdXJyZW50QW5ub3RhdGlvbnMpXG4gICAgICAgIC5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSAnX2Fubm90YXRpb25zJylcbiAgICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50QW5ub3RhdGlvbnNba2V5XSkuZm9yRWFjaCgodGVybSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkQW5ub3RhdGlvbiA9IHJldmVydFRlcm1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGN1cnJlbnRBbm5vdGF0aW9uc1trZXldW3Rlcm1dKTtcbiAgICAgICAgICAgIGlmICghcGFyc2VkQW5ub3RhdGlvbi50ZXJtKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5hbGlhc2VkVGVybSA9ICgwLCB1dGlsc18xLnVuYWxpYXMpKHJlZmVyZW5jZXMsIGAke2tleX0uJHt0ZXJtfWApO1xuICAgICAgICAgICAgICAgIGlmICh1bmFsaWFzZWRUZXJtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1YWxpZmllZFNwbGl0ID0gdW5hbGlhc2VkVGVybS5zcGxpdCgnIycpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRBbm5vdGF0aW9uLnRlcm0gPSBxdWFsaWZpZWRTcGxpdFswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1YWxpZmllZFNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1YiBBbm5vdGF0aW9uIHdpdGggYSBxdWFsaWZpZXIsIG5vdCBzdXJlIHdoZW4gdGhhdCBjYW4gaGFwcGVuIGluIHJlYWwgc2NlbmFyaW9zXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRBbm5vdGF0aW9uLnF1YWxpZmllciA9IHF1YWxpZmllZFNwbGl0WzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0QW5ub3RhdGlvbnMucHVzaChwYXJzZWRBbm5vdGF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vKipcbiAqIFJldmVydCB0aGUgY3VycmVudCBjb2xsZWN0aW9uIGl0ZW0gdG8gdGhlIGNvcnJlc3BvbmRpbmcgcmF3IGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIHJlZmVyZW5jZXMgdGhlIGN1cnJlbnQgc2V0IG9mIHJlZmVyZW5jZVxuICogQHBhcmFtIGNvbGxlY3Rpb25JdGVtIHRoZSBjb2xsZWN0aW9uIGl0ZW0gdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIHRoZSByYXcgdHlwZSBlcXVpdmFsZW50XG4gKi9cbmZ1bmN0aW9uIHJldmVydENvbGxlY3Rpb25JdGVtVG9SYXdUeXBlKHJlZmVyZW5jZXMsIGNvbGxlY3Rpb25JdGVtKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xsZWN0aW9uSXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25JdGVtO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgY29sbGVjdGlvbkl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uSXRlbS5oYXNPd25Qcm9wZXJ0eSgnJFR5cGUnKSkge1xuICAgICAgICAgICAgLy8gQW5ub3RhdGlvbiBSZWNvcmRcbiAgICAgICAgICAgIGNvbnN0IG91dEl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogY29sbGVjdGlvbkl0ZW0uJFR5cGUsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZXM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gQ291bGQgdmFsaWRhdGUga2V5cyBhbmQgdHlwZSBiYXNlZCBvbiAkVHlwZVxuICAgICAgICAgICAgT2JqZWN0LmtleXMoY29sbGVjdGlvbkl0ZW0pLmZvckVhY2goKGNvbGxlY3Rpb25LZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdHJpY3RlZEtleXMuaW5kZXhPZihjb2xsZWN0aW9uS2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb2xsZWN0aW9uSXRlbVtjb2xsZWN0aW9uS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgb3V0SXRlbS5wcm9wZXJ0eVZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbGxlY3Rpb25LZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmV2ZXJ0VmFsdWVUb1Jhd1R5cGUocmVmZXJlbmNlcywgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjb2xsZWN0aW9uS2V5ID09PSAnYW5ub3RhdGlvbnMnICYmIE9iamVjdC5rZXlzKGNvbGxlY3Rpb25JdGVtW2NvbGxlY3Rpb25LZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dEl0ZW0uYW5ub3RhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJ0QW5ub3RhdGlvbnNUb1Jhd1R5cGUocmVmZXJlbmNlcywgY29sbGVjdGlvbkl0ZW1bY29sbGVjdGlvbktleV0sIG91dEl0ZW0uYW5ub3RhdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG91dEl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29sbGVjdGlvbkl0ZW0udHlwZSA9PT0gJ1Byb3BlcnR5UGF0aCcpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1Byb3BlcnR5UGF0aCcsXG4gICAgICAgICAgICAgICAgUHJvcGVydHlQYXRoOiBjb2xsZWN0aW9uSXRlbS52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2xsZWN0aW9uSXRlbS50eXBlID09PSAnQW5ub3RhdGlvblBhdGgnKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdBbm5vdGF0aW9uUGF0aCcsXG4gICAgICAgICAgICAgICAgQW5ub3RhdGlvblBhdGg6IGNvbGxlY3Rpb25JdGVtLnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbGxlY3Rpb25JdGVtLnR5cGUgPT09ICdOYXZpZ2F0aW9uUHJvcGVydHlQYXRoJykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnTmF2aWdhdGlvblByb3BlcnR5UGF0aCcsXG4gICAgICAgICAgICAgICAgTmF2aWdhdGlvblByb3BlcnR5UGF0aDogY29sbGVjdGlvbkl0ZW0udmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIFJldmVydCBhbiBhbm5vdGF0aW9uIHRlcm0gdG8gaXQncyBnZW5lcmljIG9yIHJhdyBlcXVpdmFsZW50LlxuICpcbiAqIEBwYXJhbSByZWZlcmVuY2VzIHRoZSByZWZlcmVuY2Ugb2YgdGhlIGN1cnJlbnQgY29udGV4dFxuICogQHBhcmFtIGFubm90YXRpb24gdGhlIGFubm90YXRpb24gdGVybSB0byByZXZlcnRcbiAqIEByZXR1cm5zIHRoZSByYXcgYW5ub3RhdGlvblxuICovXG5mdW5jdGlvbiByZXZlcnRUZXJtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCBhbm5vdGF0aW9uKSB7XG4gICAgY29uc3QgYmFzZUFubm90YXRpb24gPSB7XG4gICAgICAgIHRlcm06IGFubm90YXRpb24udGVybSxcbiAgICAgICAgcXVhbGlmaWVyOiBhbm5vdGF0aW9uLnF1YWxpZmllclxuICAgIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbikpIHtcbiAgICAgICAgLy8gQ29sbGVjdGlvblxuICAgICAgICBpZiAoYW5ub3RhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnYW5ub3RhdGlvbnMnKSAmJiBPYmplY3Qua2V5cyhhbm5vdGF0aW9uLmFubm90YXRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBBbm5vdGF0aW9uIG9uIGEgY29sbGVjdGlvbiBpdHNlbGYsIG5vdCBzdXJlIHdoZW4gdGhhdCBoYXBwZW5zIGlmIGF0IGFsbFxuICAgICAgICAgICAgYmFzZUFubm90YXRpb24uYW5ub3RhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIHJldmVydEFubm90YXRpb25zVG9SYXdUeXBlKHJlZmVyZW5jZXMsIGFubm90YXRpb24uYW5ub3RhdGlvbnMsIGJhc2VBbm5vdGF0aW9uLmFubm90YXRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uYmFzZUFubm90YXRpb24sXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBhbm5vdGF0aW9uLm1hcCgoYW5ubykgPT4gcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub1Jhd1R5cGUocmVmZXJlbmNlcywgYW5ubykpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGFubm90YXRpb24uaGFzT3duUHJvcGVydHkoJyRUeXBlJykpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uYmFzZUFubm90YXRpb24sIHJlY29yZDogcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub1Jhd1R5cGUocmVmZXJlbmNlcywgYW5ub3RhdGlvbikgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLmJhc2VBbm5vdGF0aW9uLCB2YWx1ZTogcmV2ZXJ0VmFsdWVUb1Jhd1R5cGUocmVmZXJlbmNlcywgYW5ub3RhdGlvbikgfTtcbiAgICB9XG59XG5leHBvcnRzLnJldmVydFRlcm1Ub0dlbmVyaWNUeXBlID0gcmV2ZXJ0VGVybVRvR2VuZXJpY1R5cGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD13cml0ZWJhY2suanMubWFwXG5cbi8qKiovIH0pXG5cbi8qKioqKiovIFx0fSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvLyBzdGFydHVwXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHQvLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oNzU5KTtcbi8qKioqKiovIFx0QW5ub3RhdGlvbkNvbnZlcnRlciA9IF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyBcdFxuLyoqKioqKi8gfSkoKVxuOyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLG1CQUFKO0FBQ0E7O0FBQVMsQ0FBQyxZQUFXO0VBQUU7O0VBQ3ZCO0VBQVU7RUFDVjs7RUFBVSxJQUFJQyxtQkFBbUIsR0FBSTtJQUVyQztJQUFNO0lBQ047SUFBTyxVQUFTQyx1QkFBVCxFQUFrQ0MsT0FBbEMsRUFBMkNDLG1CQUEzQyxFQUFnRTtNQUd2RUMsTUFBTSxDQUFDQyxjQUFQLENBQXNCSCxPQUF0QixFQUErQixZQUEvQixFQUE4QztRQUFFSSxLQUFLLEVBQUU7TUFBVCxDQUE5QztNQUNBSixPQUFPLENBQUNLLE9BQVIsR0FBa0IsS0FBSyxDQUF2Qjs7TUFDQSxJQUFNQyxPQUFPLEdBQUdMLG1CQUFtQixDQUFDLEVBQUQsQ0FBbkM7TUFDQTtBQUNBO0FBQ0E7OztNQVJ1RSxJQVNqRU0sSUFUaUU7TUFVbkU7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
    return AnnotationConverter;
    },true);
