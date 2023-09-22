sap.ui.define(["./ObjectPageConverter", "sap/fe/core/converters/common/AnnotationConverter"], function (ObjectPageConverter, AnnotationConverter) {
  "use strict";

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var VOCABULARY_ALIAS = {
    "Org.OData.Capabilities.V1": "Capabilities",
    "Org.OData.Core.V1": "Core",
    "Org.OData.Measures.V1": "Measures",
    "com.sap.vocabularies.Common.v1": "Common",
    "com.sap.vocabularies.UI.v1": "UI",
    "com.sap.vocabularies.Analytics.v1": "Analytics",
    "com.sap.vocabularies.PersonalData.v1": "PersonalData",
    "com.sap.vocabularies.Communication.v1": "Communication"
  };
  var MetaModelConverter = {
    parsePropertyValue: function (annotationObject, propertyKey, currentTarget, annotationsLists) {
      var _this = this;

      var value;
      var currentPropertyTarget = currentTarget + "/" + propertyKey;

      if (typeof annotationObject === "string") {
        value = {
          type: "String",
          String: annotationObject
        };
      } else if (typeof annotationObject === "boolean") {
        value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeof annotationObject === "number") {
        value = {
          type: "Int",
          Int: annotationObject
        };
      } else if (Array.isArray(annotationObject)) {
        value = {
          type: "Collection",
          Collection: annotationObject.map(function (subAnnotationObject, subAnnotationObjectIndex) {
            return _this.parseAnnotationObject(subAnnotationObject, currentPropertyTarget + "/" + subAnnotationObjectIndex, annotationsLists);
          })
        };

        if (annotationObject[0].$PropertyPath) {
          value.Collection.type = "PropertyPath";
        } else if (annotationObject[0].$NavigationPropertyPath) {
          value.Collection.type = "NavigationPropertyPath";
        } else if (annotationObject[0].$AnnotationPath) {
          value.Collection.type = "AnnotationPath";
        } else if (annotationObject[0].$Type) {
          value.Collection.type = "Record";
        } else {
          value.Collection.type = "String";
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
      } else if (annotationObject.$AnnotationPath !== undefined) {
        value = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        value = {
          type: "EnumMember",
          EnumMember: this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (annotationObject.$Type) {
        value = {
          type: "Record",
          Record: this.parseAnnotationObject(annotationObject, currentTarget, annotationsLists)
        };
      }

      return {
        name: propertyKey,
        value: value
      };
    },
    mapNameToAlias: function (annotationName) {
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
      return pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)] + "." + annoPart.substr(lastDot + 1);
    },
    parseAnnotationObject: function (annotationObject, currentObjectTarget, annotationsLists) {
      var _this2 = this;

      var parsedAnnotationObject = {};
      var isCollection = false;

      if (typeof annotationObject === "string") {
        parsedAnnotationObject = {
          type: "String",
          String: annotationObject
        };
      } else if (typeof annotationObject === "boolean") {
        parsedAnnotationObject = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeof annotationObject === "number") {
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
      } else if (annotationObject.$NavigationPropertyPath !== undefined) {
        parsedAnnotationObject = {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: annotationObject.$NavigationPropertyPath
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        parsedAnnotationObject = {
          type: "EnumMember",
          EnumMember: this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (Array.isArray(annotationObject)) {
        isCollection = true;
        var parsedAnnotationCollection = parsedAnnotationObject;
        parsedAnnotationCollection.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
          return _this2.parseAnnotationObject(subAnnotationObject, currentObjectTarget + "/" + subAnnotationIndex, annotationsLists);
        });

        if (annotationObject[0].$PropertyPath) {
          parsedAnnotationCollection.collection.type = "PropertyPath";
        } else if (annotationObject[0].$NavigationPropertyPath) {
          parsedAnnotationCollection.collection.type = "NavigationPropertyPath";
        } else if (annotationObject[0].$AnnotationPath) {
          parsedAnnotationCollection.collection.type = "AnnotationPath";
        } else if (annotationObject[0].$Type) {
          parsedAnnotationCollection.collection.type = "Record";
        } else {
          parsedAnnotationCollection.collection.type = "String";
        }
      } else {
        if (annotationObject.$Type) {
          var typeValue = annotationObject.$Type;
          var typeAlias = VOCABULARY_ALIAS[typeValue.substr(0, typeValue.lastIndexOf("."))];
          var typeTerm = typeValue.substr(typeValue.lastIndexOf(".") + 1);
          parsedAnnotationObject.type = "".concat(typeAlias, ".").concat(typeTerm);
        }

        var propertyValues = [];
        Object.keys(annotationObject).forEach(function (propertyKey) {
          if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
            propertyValues.push(_this2.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists));
          } else if (propertyKey.startsWith("@")) {
            // Annotation of annotation
            var annotationQualifierSplit = propertyKey.split("#");
            var qualifier = annotationQualifierSplit[1];
            var annotationKey = annotationQualifierSplit[0]; // Check for annotation of annotation

            var currentOutAnnotationObject = _this2.getOrCreateAnnotationList(currentObjectTarget, annotationsLists);

            currentOutAnnotationObject.annotations.push({
              term: _this2.mapNameToAlias(annotationKey.substr(1)),
              qualifier: qualifier,
              value: _this2.parseAnnotationObject(annotationObject[propertyKey], currentObjectTarget, annotationsLists),
              isCollection: false
            });
          }
        });
        parsedAnnotationObject.propertyValues = propertyValues;
      }

      return parsedAnnotationObject;
    },
    getOrCreateAnnotationList: function (target, annotationsLists) {
      var potentialTarget = annotationsLists.find(function (annotationList) {
        return annotationList.target === target;
      });

      if (!potentialTarget) {
        potentialTarget = {
          target: target,
          annotations: []
        };
        annotationsLists.push(potentialTarget);
      }

      return potentialTarget;
    },
    createAnnotationLists: function (oMetaModel, annotationObjects, annotationTarget, annotationLists) {
      var _this3 = this;

      var outAnnotationObject = {
        target: annotationTarget,
        annotations: []
      };
      Object.keys(annotationObjects).forEach(function (annotationKey) {
        var currentOutAnnotationObject = outAnnotationObject;
        var annotationObject = annotationObjects[annotationKey];
        var annotationQualifierSplit = annotationKey.split("#");
        var qualifier = annotationQualifierSplit[1];
        annotationKey = annotationQualifierSplit[0]; // Check for annotation of annotation

        var annotationOfAnnotationSplit = annotationKey.split("@");

        if (annotationOfAnnotationSplit.length > 2) {
          currentOutAnnotationObject = _this3.getOrCreateAnnotationList(annotationTarget + "@" + _this3.mapNameToAlias(annotationOfAnnotationSplit[1]), annotationLists);
          annotationKey = annotationOfAnnotationSplit[2];
        } else {
          annotationKey = annotationOfAnnotationSplit[1];
        }

        var annotationAlias = VOCABULARY_ALIAS[annotationKey.substr(0, annotationKey.lastIndexOf("."))];
        var annotationTerm = annotationKey.substr(annotationKey.lastIndexOf(".") + 1);
        var parsedAnnotationObject = {
          term: "".concat(annotationAlias, ".").concat(annotationTerm),
          qualifier: qualifier
        };
        var currentAnnotationTarget = annotationTarget + "@" + parsedAnnotationObject.term;

        if (qualifier) {
          currentAnnotationTarget += "#" + qualifier;
        }

        var isCollection = false;

        if (typeof annotationObject === "string") {
          parsedAnnotationObject.value = {
            type: "String",
            String: annotationObject
          };
        } else if (typeof annotationObject === "boolean") {
          parsedAnnotationObject.value = {
            type: "Bool",
            Bool: annotationObject
          };
        } else if (typeof annotationObject === "number") {
          parsedAnnotationObject.value = {
            type: "Int",
            Int: annotationObject
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
            EnumMember: _this3.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
          };
        } else if (Array.isArray(annotationObject)) {
          isCollection = true;
          parsedAnnotationObject.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
            return _this3.parseAnnotationObject(subAnnotationObject, currentAnnotationTarget + "/" + subAnnotationIndex, annotationLists);
          });

          if (annotationObject[0].$PropertyPath) {
            parsedAnnotationObject.collection.type = "PropertyPath";
          } else if (annotationObject[0].$NavigationPropertyPath) {
            parsedAnnotationObject.collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].$AnnotationPath) {
            parsedAnnotationObject.collection.type = "AnnotationPath";
          } else if (annotationObject[0].$Type) {
            parsedAnnotationObject.collection.type = "Record";
          } else {
            parsedAnnotationObject.collection.type = "String";
          }
        } else {
          var record = {
            propertyValues: []
          };

          if (annotationObject.$Type) {
            var typeValue = annotationObject.$Type;
            var typeAlias = VOCABULARY_ALIAS[typeValue.substr(0, typeValue.lastIndexOf("."))];
            var typeTerm = typeValue.substr(typeValue.lastIndexOf(".") + 1);
            record.type = "".concat(typeAlias, ".").concat(typeTerm);
          }

          var propertyValues = [];
          Object.keys(annotationObject).forEach(function (propertyKey) {
            if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
              propertyValues.push(_this3.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentAnnotationTarget, annotationLists));
            } else if (propertyKey.startsWith("@")) {
              // Annotation of record
              annotationLists.push({
                target: currentAnnotationTarget,
                annotations: [{
                  value: _this3.parseAnnotationObject(annotationObject[propertyKey], currentAnnotationTarget, annotationLists)
                }]
              });
            }
          });
          record.propertyValues = propertyValues;
          parsedAnnotationObject.record = record;
        }

        parsedAnnotationObject.isCollection = isCollection;
        currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
      });

      if (outAnnotationObject.annotations.length > 0) {
        annotationLists.push(outAnnotationObject);
      }
    },
    parseProperty: function (oMetaModel, entityTypeObject, propertyName, annotationLists) {
      var propertyAnnotation = oMetaModel.getObject("/".concat(entityTypeObject.name, "/").concat(propertyName, "@"));
      var propertyDefinition = oMetaModel.getObject("/".concat(entityTypeObject.name, "/").concat(propertyName));
      var propertyObject = {
        _type: "Property",
        name: propertyName,
        fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName),
        type: propertyDefinition.$Type,
        maxLength: propertyDefinition.$MaxLength,
        precision: propertyDefinition.$Precision,
        scale: propertyDefinition.$Scale,
        nullable: propertyDefinition.$Nullable,
        annotations: {}
      };
      this.createAnnotationLists(oMetaModel, propertyAnnotation, propertyObject.fullyQualifiedName, annotationLists);
      return propertyObject;
    },
    parseNavigationProperty: function (oMetaModel, entityTypeObject, navPropertyName, annotationLists) {
      var navPropertyAnnotation = oMetaModel.getObject("/".concat(entityTypeObject.name, "/").concat(navPropertyName, "@"));
      var navPropertyDefinition = oMetaModel.getObject("/".concat(entityTypeObject.name, "/").concat(navPropertyName));
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
        targetTypeName: navPropertyDefinition.$Type,
        referentialConstraint: referentialConstraint,
        annotations: {}
      };
      this.createAnnotationLists(oMetaModel, navPropertyAnnotation, navigationProperty.fullyQualifiedName, annotationLists);
      return navigationProperty;
    },
    parseEntityType: function (oMetaModel, entitySetName, annotationLists) {
      var _this4 = this;

      var entitySetDefinition = oMetaModel.getObject("/".concat(entitySetName));
      var entitySetAnnotation = oMetaModel.getObject("/".concat(entitySetName, "@"));
      var entityTypeAnnotation = oMetaModel.getObject("/".concat(entitySetName, "/@"));
      var entityTypeDefinition = oMetaModel.getObject("/".concat(entitySetName, "/"));
      var entityKeys = entityTypeDefinition.$Key;
      var entityTypeObject = {
        _type: "EntityType",
        name: entitySetName,
        fullyQualifiedName: entitySetDefinition.$Type,
        keys: [],
        entityProperties: [],
        navigationProperties: [],
        annotations: {
          getAnnotation: function (annotationName) {
            return entityTypeObject.annotations[annotationName];
          }
        }
      };
      this.createAnnotationLists(oMetaModel, entityTypeAnnotation, entityTypeObject.fullyQualifiedName, annotationLists);
      this.createAnnotationLists(oMetaModel, entitySetAnnotation, "EntityContainer/".concat(entitySetName), annotationLists);
      var entityProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
        }
      }).map(function (propertyName) {
        return _this4.parseProperty(oMetaModel, entityTypeObject, propertyName, annotationLists);
      });
      var navigationProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
        }
      }).map(function (navPropertyName) {
        return _this4.parseNavigationProperty(oMetaModel, entityTypeObject, navPropertyName, annotationLists);
      });
      entityTypeObject.keys = entityKeys.map(function (entityKey) {
        return entityProperties.find(function (property) {
          return property.name === entityKey;
        });
      });
      entityTypeObject.entityProperties = entityProperties;
      entityTypeObject.navigationProperties = navigationProperties;
      return entityTypeObject;
    },
    parseEntityTypes: function (oMetaModel) {
      var _this5 = this;

      var oEntitySets = oMetaModel.getObject("/");
      var annotationLists = [];
      var entityTypes = Object.keys(oEntitySets).filter(function (entitySetName) {
        return entitySetName !== "$kind" && oEntitySets[entitySetName].$kind === "EntitySet";
      }).map(function (entitySetName) {
        return _this5.parseEntityType(oMetaModel, entitySetName, annotationLists);
      });

      var unaliasFn = function (aliasedValue) {
        if (!aliasedValue) {
          return aliasedValue;
        }

        var _aliasedValue$split = aliasedValue.split("."),
            _aliasedValue$split2 = _slicedToArray(_aliasedValue$split, 2),
            alias = _aliasedValue$split2[0],
            value = _aliasedValue$split2[1];

        var namespace = Object.keys(VOCABULARY_ALIAS).find(function (originalName) {
          return VOCABULARY_ALIAS[originalName] === alias;
        });

        if (namespace) {
          return "".concat(namespace, ".").concat(value);
        } else {
          if (aliasedValue.indexOf("@") !== -1) {
            var _aliasedValue$split3 = aliasedValue.split("@"),
                _aliasedValue$split4 = _slicedToArray(_aliasedValue$split3, 2),
                preAlias = _aliasedValue$split4[0],
                postAlias = _aliasedValue$split4[1];

            return "".concat(preAlias, "@").concat(unaliasFn(postAlias));
          } else {
            return aliasedValue;
          }
        }
      };

      return {
        identification: "metamodelResult",
        version: "4.0",
        schema: {
          entityContainer: {},
          entitySets: [],
          entityTypes: entityTypes,
          associations: [],
          actions: [],
          namespace: "",
          annotations: {
            "metamodelResult": annotationLists
          }
        },
        references: [],
        unalias: unaliasFn
      };
    },
    convertTypes: function (oMetaModel) {
      var parsedOutput = this.parseEntityTypes(oMetaModel);
      return AnnotationConverter.convertTypes(parsedOutput);
    },
    convertPage: function (oMetaModel, oManifestSettings) {
      var serviceObject = this.convertTypes(oMetaModel);
      var sEntitySet = oManifestSettings.entitySet;
      var targetEntityType = serviceObject.schema.entityTypes.find(function (entityType) {
        return entityType.name === sEntitySet;
      });

      if (targetEntityType) {
        var oContext = oMetaModel.createBindingContext("/" + sEntitySet);
        return _defineProperty({}, sEntitySet, ObjectPageConverter.convertPage(targetEntityType, oContext, oManifestSettings, serviceObject.unalias));
      }
    }
  };
  return MetaModelConverter;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldGFNb2RlbENvbnZlcnRlci50cyJdLCJuYW1lcyI6WyJWT0NBQlVMQVJZX0FMSUFTIiwiTWV0YU1vZGVsQ29udmVydGVyIiwicGFyc2VQcm9wZXJ0eVZhbHVlIiwiYW5ub3RhdGlvbk9iamVjdCIsInByb3BlcnR5S2V5IiwiY3VycmVudFRhcmdldCIsImFubm90YXRpb25zTGlzdHMiLCJ2YWx1ZSIsImN1cnJlbnRQcm9wZXJ0eVRhcmdldCIsInR5cGUiLCJTdHJpbmciLCJCb29sIiwiSW50IiwiQXJyYXkiLCJpc0FycmF5IiwiQ29sbGVjdGlvbiIsIm1hcCIsInN1YkFubm90YXRpb25PYmplY3QiLCJzdWJBbm5vdGF0aW9uT2JqZWN0SW5kZXgiLCJwYXJzZUFubm90YXRpb25PYmplY3QiLCIkUHJvcGVydHlQYXRoIiwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCIkQW5ub3RhdGlvblBhdGgiLCIkVHlwZSIsIiRQYXRoIiwidW5kZWZpbmVkIiwiUGF0aCIsIiREZWNpbWFsIiwiRGVjaW1hbCIsInBhcnNlRmxvYXQiLCJQcm9wZXJ0eVBhdGgiLCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiQW5ub3RhdGlvblBhdGgiLCIkRW51bU1lbWJlciIsIkVudW1NZW1iZXIiLCJtYXBOYW1lVG9BbGlhcyIsInNwbGl0IiwiUmVjb3JkIiwibmFtZSIsImFubm90YXRpb25OYW1lIiwicGF0aFBhcnQiLCJhbm5vUGFydCIsImxhc3REb3QiLCJsYXN0SW5kZXhPZiIsInN1YnN0ciIsImN1cnJlbnRPYmplY3RUYXJnZXQiLCJwYXJzZWRBbm5vdGF0aW9uT2JqZWN0IiwiaXNDb2xsZWN0aW9uIiwicGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwic3ViQW5ub3RhdGlvbkluZGV4IiwidHlwZVZhbHVlIiwidHlwZUFsaWFzIiwidHlwZVRlcm0iLCJwcm9wZXJ0eVZhbHVlcyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwic3RhcnRzV2l0aCIsInB1c2giLCJhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQiLCJxdWFsaWZpZXIiLCJhbm5vdGF0aW9uS2V5IiwiY3VycmVudE91dEFubm90YXRpb25PYmplY3QiLCJnZXRPckNyZWF0ZUFubm90YXRpb25MaXN0IiwiYW5ub3RhdGlvbnMiLCJ0ZXJtIiwidGFyZ2V0IiwicG90ZW50aWFsVGFyZ2V0IiwiZmluZCIsImFubm90YXRpb25MaXN0IiwiY3JlYXRlQW5ub3RhdGlvbkxpc3RzIiwib01ldGFNb2RlbCIsImFubm90YXRpb25PYmplY3RzIiwiYW5ub3RhdGlvblRhcmdldCIsImFubm90YXRpb25MaXN0cyIsIm91dEFubm90YXRpb25PYmplY3QiLCJhbm5vdGF0aW9uT2ZBbm5vdGF0aW9uU3BsaXQiLCJsZW5ndGgiLCJhbm5vdGF0aW9uQWxpYXMiLCJhbm5vdGF0aW9uVGVybSIsImN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0IiwicmVjb3JkIiwicGFyc2VQcm9wZXJ0eSIsImVudGl0eVR5cGVPYmplY3QiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eUFubm90YXRpb24iLCJnZXRPYmplY3QiLCJwcm9wZXJ0eURlZmluaXRpb24iLCJwcm9wZXJ0eU9iamVjdCIsIl90eXBlIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwibWF4TGVuZ3RoIiwiJE1heExlbmd0aCIsInByZWNpc2lvbiIsIiRQcmVjaXNpb24iLCJzY2FsZSIsIiRTY2FsZSIsIm51bGxhYmxlIiwiJE51bGxhYmxlIiwicGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkiLCJuYXZQcm9wZXJ0eU5hbWUiLCJuYXZQcm9wZXJ0eUFubm90YXRpb24iLCJuYXZQcm9wZXJ0eURlZmluaXRpb24iLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCIkUmVmZXJlbnRpYWxDb25zdHJhaW50Iiwic291cmNlUHJvcGVydHlOYW1lIiwic291cmNlVHlwZU5hbWUiLCJzb3VyY2VQcm9wZXJ0eSIsInRhcmdldFR5cGVOYW1lIiwidGFyZ2V0UHJvcGVydHkiLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJwYXJ0bmVyIiwiJFBhcnRuZXIiLCIkaXNDb2xsZWN0aW9uIiwicGFyc2VFbnRpdHlUeXBlIiwiZW50aXR5U2V0TmFtZSIsImVudGl0eVNldERlZmluaXRpb24iLCJlbnRpdHlTZXRBbm5vdGF0aW9uIiwiZW50aXR5VHlwZUFubm90YXRpb24iLCJlbnRpdHlUeXBlRGVmaW5pdGlvbiIsImVudGl0eUtleXMiLCIkS2V5IiwiZW50aXR5UHJvcGVydGllcyIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwiZ2V0QW5ub3RhdGlvbiIsImZpbHRlciIsInByb3BlcnR5TmFtZU9yTm90IiwiJGtpbmQiLCJlbnRpdHlLZXkiLCJwcm9wZXJ0eSIsInBhcnNlRW50aXR5VHlwZXMiLCJvRW50aXR5U2V0cyIsImVudGl0eVR5cGVzIiwidW5hbGlhc0ZuIiwiYWxpYXNlZFZhbHVlIiwiYWxpYXMiLCJuYW1lc3BhY2UiLCJvcmlnaW5hbE5hbWUiLCJpbmRleE9mIiwicHJlQWxpYXMiLCJwb3N0QWxpYXMiLCJpZGVudGlmaWNhdGlvbiIsInZlcnNpb24iLCJzY2hlbWEiLCJlbnRpdHlDb250YWluZXIiLCJlbnRpdHlTZXRzIiwiYXNzb2NpYXRpb25zIiwiYWN0aW9ucyIsInJlZmVyZW5jZXMiLCJ1bmFsaWFzIiwiY29udmVydFR5cGVzIiwicGFyc2VkT3V0cHV0IiwiQW5ub3RhdGlvbkNvbnZlcnRlciIsImNvbnZlcnRQYWdlIiwib01hbmlmZXN0U2V0dGluZ3MiLCJzZXJ2aWNlT2JqZWN0Iiwic0VudGl0eVNldCIsImVudGl0eVNldCIsInRhcmdldEVudGl0eVR5cGUiLCJlbnRpdHlUeXBlIiwib0NvbnRleHQiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsIk9iamVjdFBhZ2VDb252ZXJ0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLE1BQU1BLGdCQUFxQixHQUFHO0FBQzdCLGlDQUE2QixjQURBO0FBRTdCLHlCQUFxQixNQUZRO0FBRzdCLDZCQUF5QixVQUhJO0FBSTdCLHNDQUFrQyxR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dEFubm90YXRpb25MaXN0LFxuXHRBbm5vdGF0aW9uUmVjb3JkLFxuXHRFbnRpdHlUeXBlLFxuXHRFeHByZXNzaW9uLFxuXHRQYXJzZXJPdXRwdXQsXG5cdFByb3BlcnR5LFxuXHRSZWZlcmVudGlhbENvbnN0cmFpbnQsXG5cdFY0TmF2aWdhdGlvblByb3BlcnR5XG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IE9iamVjdFBhZ2VDb252ZXJ0ZXIgZnJvbSBcIi4vT2JqZWN0UGFnZUNvbnZlcnRlclwiO1xuLy8gVGhpcyBmaWxlIGlzIHJldHJpZXZlZCBmcm9tIEBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXIsIHNoYXJlZCBjb2RlIHdpdGggdG9vbCBzdWl0ZVxuaW1wb3J0IHsgQW5ub3RhdGlvbkNvbnZlcnRlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbW1vblwiO1xuaW1wb3J0IHsgTWFuaWZlc3RTZXR0aW5ncywgT2JqZWN0UGFnZU1hbmlmZXN0U2V0dGluZ3MgfSBmcm9tIFwiLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5cbmNvbnN0IFZPQ0FCVUxBUllfQUxJQVM6IGFueSA9IHtcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxXCI6IFwiQ2FwYWJpbGl0aWVzXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjFcIjogXCJDb3JlXCIsXG5cdFwiT3JnLk9EYXRhLk1lYXN1cmVzLlYxXCI6IFwiTWVhc3VyZXNcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjFcIjogXCJDb21tb25cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MVwiOiBcIlVJXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxXCI6IFwiQW5hbHl0aWNzXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxXCI6IFwiUGVyc29uYWxEYXRhXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MVwiOiBcIkNvbW11bmljYXRpb25cIlxufTtcblxuY29uc3QgTWV0YU1vZGVsQ29udmVydGVyID0ge1xuXHRwYXJzZVByb3BlcnR5VmFsdWUoYW5ub3RhdGlvbk9iamVjdDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nLCBjdXJyZW50VGFyZ2V0OiBzdHJpbmcsIGFubm90YXRpb25zTGlzdHM6IGFueVtdKTogYW55IHtcblx0XHRsZXQgdmFsdWU7XG5cdFx0bGV0IGN1cnJlbnRQcm9wZXJ0eVRhcmdldDogc3RyaW5nID0gY3VycmVudFRhcmdldCArIFwiL1wiICsgcHJvcGVydHlLZXk7XG5cdFx0aWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJTdHJpbmdcIiwgU3RyaW5nOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdCA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIkludFwiLCBJbnQ6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbk9iamVjdCkpIHtcblx0XHRcdHZhbHVlID0ge1xuXHRcdFx0XHR0eXBlOiBcIkNvbGxlY3Rpb25cIixcblx0XHRcdFx0Q29sbGVjdGlvbjogYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25PYmplY3RJbmRleCkgPT5cblx0XHRcdFx0XHR0aGlzLnBhcnNlQW5ub3RhdGlvbk9iamVjdChcblx0XHRcdFx0XHRcdHN1YkFubm90YXRpb25PYmplY3QsXG5cdFx0XHRcdFx0XHRjdXJyZW50UHJvcGVydHlUYXJnZXQgKyBcIi9cIiArIHN1YkFubm90YXRpb25PYmplY3RJbmRleCxcblx0XHRcdFx0XHRcdGFubm90YXRpb25zTGlzdHNcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdH07XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS4kUHJvcGVydHlQYXRoKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uJEFubm90YXRpb25QYXRoKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS4kVHlwZSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJTdHJpbmdcIjtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiUGF0aFwiLCBQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQYXRoIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIkRlY2ltYWxcIiwgRGVjaW1hbDogcGFyc2VGbG9hdChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsKSB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kUHJvcGVydHlQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHtcblx0XHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRcdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLCBBbm5vdGF0aW9uUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7XG5cdFx0XHRcdHR5cGU6IFwiRW51bU1lbWJlclwiLFxuXHRcdFx0XHRFbnVtTWVtYmVyOlxuXHRcdFx0XHRcdHRoaXMubWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMF0pICsgXCIvXCIgKyBhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXVxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFR5cGUpIHtcblx0XHRcdHZhbHVlID0ge1xuXHRcdFx0XHR0eXBlOiBcIlJlY29yZFwiLFxuXHRcdFx0XHRSZWNvcmQ6IHRoaXMucGFyc2VBbm5vdGF0aW9uT2JqZWN0KGFubm90YXRpb25PYmplY3QsIGN1cnJlbnRUYXJnZXQsIGFubm90YXRpb25zTGlzdHMpXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0bmFtZTogcHJvcGVydHlLZXksXG5cdFx0XHR2YWx1ZVxuXHRcdH07XG5cdH0sXG5cdG1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25OYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGxldCBbcGF0aFBhcnQsIGFubm9QYXJ0XSA9IGFubm90YXRpb25OYW1lLnNwbGl0KFwiQFwiKTtcblx0XHRpZiAoIWFubm9QYXJ0KSB7XG5cdFx0XHRhbm5vUGFydCA9IHBhdGhQYXJ0O1xuXHRcdFx0cGF0aFBhcnQgPSBcIlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXRoUGFydCArPSBcIkBcIjtcblx0XHR9XG5cdFx0Y29uc3QgbGFzdERvdCA9IGFubm9QYXJ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcblx0XHRyZXR1cm4gcGF0aFBhcnQgKyBWT0NBQlVMQVJZX0FMSUFTW2Fubm9QYXJ0LnN1YnN0cigwLCBsYXN0RG90KV0gKyBcIi5cIiArIGFubm9QYXJ0LnN1YnN0cihsYXN0RG90ICsgMSk7XG5cdH0sXG5cdHBhcnNlQW5ub3RhdGlvbk9iamVjdChcblx0XHRhbm5vdGF0aW9uT2JqZWN0OiBhbnksXG5cdFx0Y3VycmVudE9iamVjdFRhcmdldDogc3RyaW5nLFxuXHRcdGFubm90YXRpb25zTGlzdHM6IGFueVtdXG5cdCk6IEV4cHJlc3Npb24gfCBBbm5vdGF0aW9uUmVjb3JkIHwgQW5ub3RhdGlvbiB7XG5cdFx0bGV0IHBhcnNlZEFubm90YXRpb25PYmplY3Q6IGFueSA9IHt9O1xuXHRcdGxldCBpc0NvbGxlY3Rpb24gPSBmYWxzZTtcblx0XHRpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiSW50XCIsIEludDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLCBBbm5vdGF0aW9uUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJQYXRoXCIsIFBhdGg6IGFubm90YXRpb25PYmplY3QuJFBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJERlY2ltYWwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0TmF2aWdhdGlvblByb3BlcnR5UGF0aDogYW5ub3RhdGlvbk9iamVjdC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aFxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHtcblx0XHRcdFx0dHlwZTogXCJFbnVtTWVtYmVyXCIsXG5cdFx0XHRcdEVudW1NZW1iZXI6XG5cdFx0XHRcdFx0dGhpcy5tYXBOYW1lVG9BbGlhcyhhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVswXSkgKyBcIi9cIiArIGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzFdXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhbm5vdGF0aW9uT2JqZWN0KSkge1xuXHRcdFx0aXNDb2xsZWN0aW9uID0gdHJ1ZTtcblx0XHRcdGNvbnN0IHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uID0gcGFyc2VkQW5ub3RhdGlvbk9iamVjdCBhcyBhbnk7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uID0gYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25JbmRleCkgPT5cblx0XHRcdFx0dGhpcy5wYXJzZUFubm90YXRpb25PYmplY3Qoc3ViQW5ub3RhdGlvbk9iamVjdCwgY3VycmVudE9iamVjdFRhcmdldCArIFwiL1wiICsgc3ViQW5ub3RhdGlvbkluZGV4LCBhbm5vdGF0aW9uc0xpc3RzKVxuXHRcdFx0KTtcblx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLiRQcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJQcm9wZXJ0eVBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCkge1xuXHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS4kQW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbm5vdGF0aW9uUGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLiRUeXBlKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC4kVHlwZSkge1xuXHRcdFx0XHRjb25zdCB0eXBlVmFsdWUgPSBhbm5vdGF0aW9uT2JqZWN0LiRUeXBlO1xuXHRcdFx0XHRjb25zdCB0eXBlQWxpYXMgPSBWT0NBQlVMQVJZX0FMSUFTW3R5cGVWYWx1ZS5zdWJzdHIoMCwgdHlwZVZhbHVlLmxhc3RJbmRleE9mKFwiLlwiKSldO1xuXHRcdFx0XHRjb25zdCB0eXBlVGVybSA9IHR5cGVWYWx1ZS5zdWJzdHIodHlwZVZhbHVlLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnR5cGUgPSBgJHt0eXBlQWxpYXN9LiR7dHlwZVRlcm19YDtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHByb3BlcnR5VmFsdWVzOiBhbnkgPSBbXTtcblx0XHRcdE9iamVjdC5rZXlzKGFubm90YXRpb25PYmplY3QpLmZvckVhY2gocHJvcGVydHlLZXkgPT4ge1xuXHRcdFx0XHRpZiAocHJvcGVydHlLZXkgIT09IFwiJFR5cGVcIiAmJiAhcHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlcy5wdXNoKFxuXHRcdFx0XHRcdFx0dGhpcy5wYXJzZVByb3BlcnR5VmFsdWUoYW5ub3RhdGlvbk9iamVjdFtwcm9wZXJ0eUtleV0sIHByb3BlcnR5S2V5LCBjdXJyZW50T2JqZWN0VGFyZ2V0LCBhbm5vdGF0aW9uc0xpc3RzKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHQvLyBBbm5vdGF0aW9uIG9mIGFubm90YXRpb25cblx0XHRcdFx0XHRjb25zdCBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQgPSBwcm9wZXJ0eUtleS5zcGxpdChcIiNcIik7XG5cdFx0XHRcdFx0Y29uc3QgcXVhbGlmaWVyID0gYW5ub3RhdGlvblF1YWxpZmllclNwbGl0WzFdO1xuXHRcdFx0XHRcdGxldCBhbm5vdGF0aW9uS2V5ID0gYW5ub3RhdGlvblF1YWxpZmllclNwbGl0WzBdO1xuXHRcdFx0XHRcdC8vIENoZWNrIGZvciBhbm5vdGF0aW9uIG9mIGFubm90YXRpb25cblx0XHRcdFx0XHRsZXQgY3VycmVudE91dEFubm90YXRpb25PYmplY3QgPSB0aGlzLmdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QoY3VycmVudE9iamVjdFRhcmdldCwgYW5ub3RhdGlvbnNMaXN0cyk7XG5cdFx0XHRcdFx0Y3VycmVudE91dEFubm90YXRpb25PYmplY3QuYW5ub3RhdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0XHR0ZXJtOiB0aGlzLm1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25LZXkuc3Vic3RyKDEpKSxcblx0XHRcdFx0XHRcdHF1YWxpZmllcjogcXVhbGlmaWVyLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHRoaXMucGFyc2VBbm5vdGF0aW9uT2JqZWN0KFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSxcblx0XHRcdFx0XHRcdFx0Y3VycmVudE9iamVjdFRhcmdldCxcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNMaXN0c1xuXHRcdFx0XHRcdFx0KSBhcyBFeHByZXNzaW9uLFxuXHRcdFx0XHRcdFx0aXNDb2xsZWN0aW9uOiBmYWxzZVxuXHRcdFx0XHRcdH0gYXMgQW5ub3RhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5wcm9wZXJ0eVZhbHVlcyA9IHByb3BlcnR5VmFsdWVzO1xuXHRcdH1cblx0XHRyZXR1cm4gcGFyc2VkQW5ub3RhdGlvbk9iamVjdDtcblx0fSxcblx0Z2V0T3JDcmVhdGVBbm5vdGF0aW9uTGlzdCh0YXJnZXQ6IHN0cmluZywgYW5ub3RhdGlvbnNMaXN0czogQW5ub3RhdGlvbkxpc3RbXSk6IEFubm90YXRpb25MaXN0IHtcblx0XHRsZXQgcG90ZW50aWFsVGFyZ2V0ID0gYW5ub3RhdGlvbnNMaXN0cy5maW5kKGFubm90YXRpb25MaXN0ID0+IGFubm90YXRpb25MaXN0LnRhcmdldCA9PT0gdGFyZ2V0KTtcblx0XHRpZiAoIXBvdGVudGlhbFRhcmdldCkge1xuXHRcdFx0cG90ZW50aWFsVGFyZ2V0ID0ge1xuXHRcdFx0XHR0YXJnZXQ6IHRhcmdldCxcblx0XHRcdFx0YW5ub3RhdGlvbnM6IFtdXG5cdFx0XHR9O1xuXHRcdFx0YW5ub3RhdGlvbnNMaXN0cy5wdXNoKHBvdGVudGlhbFRhcmdldCk7XG5cdFx0fVxuXHRcdHJldHVybiBwb3RlbnRpYWxUYXJnZXQ7XG5cdH0sXG5cblx0Y3JlYXRlQW5ub3RhdGlvbkxpc3RzKFxuXHRcdG9NZXRhTW9kZWw6IHR5cGVvZiBzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFNZXRhTW9kZWwsXG5cdFx0YW5ub3RhdGlvbk9iamVjdHM6IGFueSxcblx0XHRhbm5vdGF0aW9uVGFyZ2V0OiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbkxpc3RzOiBhbnlbXVxuXHQpIHtcblx0XHRjb25zdCBvdXRBbm5vdGF0aW9uT2JqZWN0OiBhbnkgPSB7XG5cdFx0XHR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRhbm5vdGF0aW9uczogW11cblx0XHR9O1xuXHRcdE9iamVjdC5rZXlzKGFubm90YXRpb25PYmplY3RzKS5mb3JFYWNoKGFubm90YXRpb25LZXkgPT4ge1xuXHRcdFx0bGV0IGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0ID0gb3V0QW5ub3RhdGlvbk9iamVjdDtcblx0XHRcdGNvbnN0IGFubm90YXRpb25PYmplY3QgPSBhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XTtcblx0XHRcdGNvbnN0IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdCA9IGFubm90YXRpb25LZXkuc3BsaXQoXCIjXCIpO1xuXHRcdFx0Y29uc3QgcXVhbGlmaWVyID0gYW5ub3RhdGlvblF1YWxpZmllclNwbGl0WzFdO1xuXHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdFswXTtcblx0XHRcdC8vIENoZWNrIGZvciBhbm5vdGF0aW9uIG9mIGFubm90YXRpb25cblx0XHRcdGNvbnN0IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdCA9IGFubm90YXRpb25LZXkuc3BsaXQoXCJAXCIpO1xuXHRcdFx0aWYgKGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdC5sZW5ndGggPiAyKSB7XG5cdFx0XHRcdGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0ID0gdGhpcy5nZXRPckNyZWF0ZUFubm90YXRpb25MaXN0KFxuXHRcdFx0XHRcdGFubm90YXRpb25UYXJnZXQgKyBcIkBcIiArIHRoaXMubWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0WzFdKSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uTGlzdHNcblx0XHRcdFx0KTtcblx0XHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsyXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFubm90YXRpb25LZXkgPSBhbm5vdGF0aW9uT2ZBbm5vdGF0aW9uU3BsaXRbMV07XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGFubm90YXRpb25BbGlhcyA9IFZPQ0FCVUxBUllfQUxJQVNbYW5ub3RhdGlvbktleS5zdWJzdHIoMCwgYW5ub3RhdGlvbktleS5sYXN0SW5kZXhPZihcIi5cIikpXTtcblx0XHRcdGNvbnN0IGFubm90YXRpb25UZXJtID0gYW5ub3RhdGlvbktleS5zdWJzdHIoYW5ub3RhdGlvbktleS5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcblx0XHRcdGNvbnN0IHBhcnNlZEFubm90YXRpb25PYmplY3Q6IGFueSA9IHtcblx0XHRcdFx0dGVybTogYCR7YW5ub3RhdGlvbkFsaWFzfS4ke2Fubm90YXRpb25UZXJtfWAsXG5cdFx0XHRcdHF1YWxpZmllcjogcXVhbGlmaWVyXG5cdFx0XHR9O1xuXHRcdFx0bGV0IGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0ID0gYW5ub3RhdGlvblRhcmdldCArIFwiQFwiICsgcGFyc2VkQW5ub3RhdGlvbk9iamVjdC50ZXJtO1xuXHRcdFx0aWYgKHF1YWxpZmllcikge1xuXHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCArPSBcIiNcIiArIHF1YWxpZmllcjtcblx0XHRcdH1cblx0XHRcdGxldCBpc0NvbGxlY3Rpb24gPSBmYWxzZTtcblx0XHRcdGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIlN0cmluZ1wiLCBTdHJpbmc6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQm9vbFwiLCBCb29sOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiSW50XCIsIEludDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJQYXRoXCIsIFBhdGg6IGFubm90YXRpb25PYmplY3QuJFBhdGggfTtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsIEFubm90YXRpb25QYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCB9O1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7XG5cdFx0XHRcdFx0dHlwZTogXCJFbnVtTWVtYmVyXCIsXG5cdFx0XHRcdFx0RW51bU1lbWJlcjpcblx0XHRcdFx0XHRcdHRoaXMubWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMF0pICsgXCIvXCIgKyBhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0XHRcdGlzQ29sbGVjdGlvbiA9IHRydWU7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiA9IGFubm90YXRpb25PYmplY3QubWFwKChzdWJBbm5vdGF0aW9uT2JqZWN0LCBzdWJBbm5vdGF0aW9uSW5kZXgpID0+XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUFubm90YXRpb25PYmplY3Qoc3ViQW5ub3RhdGlvbk9iamVjdCwgY3VycmVudEFubm90YXRpb25UYXJnZXQgKyBcIi9cIiArIHN1YkFubm90YXRpb25JbmRleCwgYW5ub3RhdGlvbkxpc3RzKVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS4kUHJvcGVydHlQYXRoKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uJEFubm90YXRpb25QYXRoKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFubm90YXRpb25QYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS4kVHlwZSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiU3RyaW5nXCI7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlY29yZDogQW5ub3RhdGlvblJlY29yZCA9IHtcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QuJFR5cGUpIHtcblx0XHRcdFx0XHRjb25zdCB0eXBlVmFsdWUgPSBhbm5vdGF0aW9uT2JqZWN0LiRUeXBlO1xuXHRcdFx0XHRcdGNvbnN0IHR5cGVBbGlhcyA9IFZPQ0FCVUxBUllfQUxJQVNbdHlwZVZhbHVlLnN1YnN0cigwLCB0eXBlVmFsdWUubGFzdEluZGV4T2YoXCIuXCIpKV07XG5cdFx0XHRcdFx0Y29uc3QgdHlwZVRlcm0gPSB0eXBlVmFsdWUuc3Vic3RyKHR5cGVWYWx1ZS5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcblx0XHRcdFx0XHRyZWNvcmQudHlwZSA9IGAke3R5cGVBbGlhc30uJHt0eXBlVGVybX1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5VmFsdWVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9uT2JqZWN0KS5mb3JFYWNoKHByb3BlcnR5S2V5ID0+IHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHlLZXkgIT09IFwiJFR5cGVcIiAmJiAhcHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHRcdHByb3BlcnR5VmFsdWVzLnB1c2goXG5cdFx0XHRcdFx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0eVZhbHVlKGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldLCBwcm9wZXJ0eUtleSwgY3VycmVudEFubm90YXRpb25UYXJnZXQsIGFubm90YXRpb25MaXN0cylcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eUtleS5zdGFydHNXaXRoKFwiQFwiKSkge1xuXHRcdFx0XHRcdFx0Ly8gQW5ub3RhdGlvbiBvZiByZWNvcmRcblx0XHRcdFx0XHRcdGFubm90YXRpb25MaXN0cy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0OiBjdXJyZW50QW5ub3RhdGlvblRhcmdldCxcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbnM6IFtcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogdGhpcy5wYXJzZUFubm90YXRpb25PYmplY3QoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZWNvcmQucHJvcGVydHlWYWx1ZXMgPSBwcm9wZXJ0eVZhbHVlcztcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5yZWNvcmQgPSByZWNvcmQ7XG5cdFx0XHR9XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmlzQ29sbGVjdGlvbiA9IGlzQ29sbGVjdGlvbjtcblx0XHRcdGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0LmFubm90YXRpb25zLnB1c2gocGFyc2VkQW5ub3RhdGlvbk9iamVjdCk7XG5cdFx0fSk7XG5cdFx0aWYgKG91dEFubm90YXRpb25PYmplY3QuYW5ub3RhdGlvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0YW5ub3RhdGlvbkxpc3RzLnB1c2gob3V0QW5ub3RhdGlvbk9iamVjdCk7XG5cdFx0fVxuXHR9LFxuXHRwYXJzZVByb3BlcnR5KG9NZXRhTW9kZWw6IGFueSwgZW50aXR5VHlwZU9iamVjdDogRW50aXR5VHlwZSwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSk6IFByb3BlcnR5IHtcblx0XHRjb25zdCBwcm9wZXJ0eUFubm90YXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU9iamVjdC5uYW1lfS8ke3Byb3BlcnR5TmFtZX1AYCk7XG5cdFx0Y29uc3QgcHJvcGVydHlEZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVPYmplY3QubmFtZX0vJHtwcm9wZXJ0eU5hbWV9YCk7XG5cblx0XHRjb25zdCBwcm9wZXJ0eU9iamVjdDogUHJvcGVydHkgPSB7XG5cdFx0XHRfdHlwZTogXCJQcm9wZXJ0eVwiLFxuXHRcdFx0bmFtZTogcHJvcGVydHlOYW1lLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtwcm9wZXJ0eU5hbWV9YCxcblx0XHRcdHR5cGU6IHByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdG1heExlbmd0aDogcHJvcGVydHlEZWZpbml0aW9uLiRNYXhMZW5ndGgsXG5cdFx0XHRwcmVjaXNpb246IHByb3BlcnR5RGVmaW5pdGlvbi4kUHJlY2lzaW9uLFxuXHRcdFx0c2NhbGU6IHByb3BlcnR5RGVmaW5pdGlvbi4kU2NhbGUsXG5cdFx0XHRudWxsYWJsZTogcHJvcGVydHlEZWZpbml0aW9uLiROdWxsYWJsZSxcblx0XHRcdGFubm90YXRpb25zOiB7fVxuXHRcdH07XG5cblx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhvTWV0YU1vZGVsLCBwcm9wZXJ0eUFubm90YXRpb24sIHByb3BlcnR5T2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgYW5ub3RhdGlvbkxpc3RzKTtcblxuXHRcdHJldHVybiBwcm9wZXJ0eU9iamVjdDtcblx0fSxcblx0cGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkoXG5cdFx0b01ldGFNb2RlbDogYW55LFxuXHRcdGVudGl0eVR5cGVPYmplY3Q6IEVudGl0eVR5cGUsXG5cdFx0bmF2UHJvcGVydHlOYW1lOiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbkxpc3RzOiBBbm5vdGF0aW9uTGlzdFtdXG5cdCk6IFY0TmF2aWdhdGlvblByb3BlcnR5IHtcblx0XHRjb25zdCBuYXZQcm9wZXJ0eUFubm90YXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU9iamVjdC5uYW1lfS8ke25hdlByb3BlcnR5TmFtZX1AYCk7XG5cdFx0Y29uc3QgbmF2UHJvcGVydHlEZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVPYmplY3QubmFtZX0vJHtuYXZQcm9wZXJ0eU5hbWV9YCk7XG5cblx0XHRsZXQgcmVmZXJlbnRpYWxDb25zdHJhaW50OiBSZWZlcmVudGlhbENvbnN0cmFpbnRbXSA9IFtdO1xuXHRcdGlmIChuYXZQcm9wZXJ0eURlZmluaXRpb24uJFJlZmVyZW50aWFsQ29uc3RyYWludCkge1xuXHRcdFx0cmVmZXJlbnRpYWxDb25zdHJhaW50ID0gT2JqZWN0LmtleXMobmF2UHJvcGVydHlEZWZpbml0aW9uLiRSZWZlcmVudGlhbENvbnN0cmFpbnQpLm1hcChzb3VyY2VQcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHNvdXJjZVR5cGVOYW1lOiBlbnRpdHlUeXBlT2JqZWN0Lm5hbWUsXG5cdFx0XHRcdFx0c291cmNlUHJvcGVydHk6IHNvdXJjZVByb3BlcnR5TmFtZSxcblx0XHRcdFx0XHR0YXJnZXRUeXBlTmFtZTogbmF2UHJvcGVydHlEZWZpbml0aW9uLiRUeXBlLFxuXHRcdFx0XHRcdHRhcmdldFByb3BlcnR5OiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJFJlZmVyZW50aWFsQ29uc3RyYWludFtzb3VyY2VQcm9wZXJ0eU5hbWVdXG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnR5OiBWNE5hdmlnYXRpb25Qcm9wZXJ0eSA9IHtcblx0XHRcdF90eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiLFxuXHRcdFx0bmFtZTogbmF2UHJvcGVydHlOYW1lLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtuYXZQcm9wZXJ0eU5hbWV9YCxcblx0XHRcdHBhcnRuZXI6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUGFydG5lcixcblx0XHRcdGlzQ29sbGVjdGlvbjogbmF2UHJvcGVydHlEZWZpbml0aW9uLiRpc0NvbGxlY3Rpb24gPyBuYXZQcm9wZXJ0eURlZmluaXRpb24uJGlzQ29sbGVjdGlvbiA6IGZhbHNlLFxuXHRcdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludCxcblx0XHRcdGFubm90YXRpb25zOiB7fVxuXHRcdH07XG5cblx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhvTWV0YU1vZGVsLCBuYXZQcm9wZXJ0eUFubm90YXRpb24sIG5hdmlnYXRpb25Qcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUsIGFubm90YXRpb25MaXN0cyk7XG5cblx0XHRyZXR1cm4gbmF2aWdhdGlvblByb3BlcnR5O1xuXHR9LFxuXHRwYXJzZUVudGl0eVR5cGUob01ldGFNb2RlbDogYW55LCBlbnRpdHlTZXROYW1lOiBzdHJpbmcsIGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSk6IEVudGl0eVR5cGUge1xuXHRcdGNvbnN0IGVudGl0eVNldERlZmluaXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5U2V0TmFtZX1gKTtcblx0XHRjb25zdCBlbnRpdHlTZXRBbm5vdGF0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVNldE5hbWV9QGApO1xuXHRcdGNvbnN0IGVudGl0eVR5cGVBbm5vdGF0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVNldE5hbWV9L0BgKTtcblx0XHRjb25zdCBlbnRpdHlUeXBlRGVmaW5pdGlvbiA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtlbnRpdHlTZXROYW1lfS9gKTtcblx0XHRjb25zdCBlbnRpdHlLZXlzID0gZW50aXR5VHlwZURlZmluaXRpb24uJEtleTtcblx0XHRjb25zdCBlbnRpdHlUeXBlT2JqZWN0OiBFbnRpdHlUeXBlID0ge1xuXHRcdFx0X3R5cGU6IFwiRW50aXR5VHlwZVwiLFxuXHRcdFx0bmFtZTogZW50aXR5U2V0TmFtZSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogZW50aXR5U2V0RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdGtleXM6IFtdLFxuXHRcdFx0ZW50aXR5UHJvcGVydGllczogW10sXG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogW10sXG5cdFx0XHRhbm5vdGF0aW9uczoge1xuXHRcdFx0XHRnZXRBbm5vdGF0aW9uKGFubm90YXRpb25OYW1lOiBzdHJpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGVudGl0eVR5cGVPYmplY3QuYW5ub3RhdGlvbnMgYXMgYW55KVthbm5vdGF0aW9uTmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKG9NZXRhTW9kZWwsIGVudGl0eVR5cGVBbm5vdGF0aW9uLCBlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgYW5ub3RhdGlvbkxpc3RzKTtcblx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhvTWV0YU1vZGVsLCBlbnRpdHlTZXRBbm5vdGF0aW9uLCBgRW50aXR5Q29udGFpbmVyLyR7ZW50aXR5U2V0TmFtZX1gLCBhbm5vdGF0aW9uTGlzdHMpO1xuXHRcdGNvbnN0IGVudGl0eVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbilcblx0XHRcdC5maWx0ZXIocHJvcGVydHlOYW1lT3JOb3QgPT4ge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lm1hcChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVByb3BlcnR5KG9NZXRhTW9kZWwsIGVudGl0eVR5cGVPYmplY3QsIHByb3BlcnR5TmFtZSwgYW5ub3RhdGlvbkxpc3RzKTtcblx0XHRcdH0pO1xuXG5cdFx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbilcblx0XHRcdC5maWx0ZXIocHJvcGVydHlOYW1lT3JOb3QgPT4ge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5tYXAobmF2UHJvcGVydHlOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkob01ldGFNb2RlbCwgZW50aXR5VHlwZU9iamVjdCwgbmF2UHJvcGVydHlOYW1lLCBhbm5vdGF0aW9uTGlzdHMpO1xuXHRcdFx0fSk7XG5cblx0XHRlbnRpdHlUeXBlT2JqZWN0LmtleXMgPSBlbnRpdHlLZXlzLm1hcCgoZW50aXR5S2V5OiBzdHJpbmcpID0+XG5cdFx0XHRlbnRpdHlQcm9wZXJ0aWVzLmZpbmQoKHByb3BlcnR5OiBQcm9wZXJ0eSkgPT4gcHJvcGVydHkubmFtZSA9PT0gZW50aXR5S2V5KVxuXHRcdCk7XG5cdFx0ZW50aXR5VHlwZU9iamVjdC5lbnRpdHlQcm9wZXJ0aWVzID0gZW50aXR5UHJvcGVydGllcztcblx0XHRlbnRpdHlUeXBlT2JqZWN0Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gbmF2aWdhdGlvblByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gZW50aXR5VHlwZU9iamVjdDtcblx0fSxcblx0cGFyc2VFbnRpdHlUeXBlcyhvTWV0YU1vZGVsOiBhbnkpOiBQYXJzZXJPdXRwdXQge1xuXHRcdGNvbnN0IG9FbnRpdHlTZXRzID0gb01ldGFNb2RlbC5nZXRPYmplY3QoXCIvXCIpO1xuXHRcdGNvbnN0IGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSA9IFtdO1xuXHRcdGNvbnN0IGVudGl0eVR5cGVzID0gT2JqZWN0LmtleXMob0VudGl0eVNldHMpXG5cdFx0XHQuZmlsdGVyKGVudGl0eVNldE5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZW50aXR5U2V0TmFtZSAhPT0gXCIka2luZFwiICYmIG9FbnRpdHlTZXRzW2VudGl0eVNldE5hbWVdLiRraW5kID09PSBcIkVudGl0eVNldFwiO1xuXHRcdFx0fSlcblx0XHRcdC5tYXAoZW50aXR5U2V0TmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlRW50aXR5VHlwZShvTWV0YU1vZGVsLCBlbnRpdHlTZXROYW1lLCBhbm5vdGF0aW9uTGlzdHMpO1xuXHRcdFx0fSk7XG5cblx0XHRjb25zdCB1bmFsaWFzRm4gPSAoYWxpYXNlZFZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRcdFx0aWYgKCFhbGlhc2VkVmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIGFsaWFzZWRWYWx1ZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IFthbGlhcywgdmFsdWVdID0gYWxpYXNlZFZhbHVlLnNwbGl0KFwiLlwiKTtcblx0XHRcdGNvbnN0IG5hbWVzcGFjZSA9IE9iamVjdC5rZXlzKFZPQ0FCVUxBUllfQUxJQVMpLmZpbmQob3JpZ2luYWxOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIFZPQ0FCVUxBUllfQUxJQVNbb3JpZ2luYWxOYW1lXSA9PT0gYWxpYXM7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChuYW1lc3BhY2UpIHtcblx0XHRcdFx0cmV0dXJuIGAke25hbWVzcGFjZX0uJHt2YWx1ZX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGFsaWFzZWRWYWx1ZS5pbmRleE9mKFwiQFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRjb25zdCBbcHJlQWxpYXMsIHBvc3RBbGlhc10gPSBhbGlhc2VkVmFsdWUuc3BsaXQoXCJAXCIpO1xuXHRcdFx0XHRcdHJldHVybiBgJHtwcmVBbGlhc31AJHt1bmFsaWFzRm4ocG9zdEFsaWFzKX1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBhbGlhc2VkVmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRpZGVudGlmaWNhdGlvbjogXCJtZXRhbW9kZWxSZXN1bHRcIixcblx0XHRcdHZlcnNpb246IFwiNC4wXCIsXG5cdFx0XHRzY2hlbWE6IHtcblx0XHRcdFx0ZW50aXR5Q29udGFpbmVyOiB7fSxcblx0XHRcdFx0ZW50aXR5U2V0czogW10sXG5cdFx0XHRcdGVudGl0eVR5cGVzLFxuXHRcdFx0XHRhc3NvY2lhdGlvbnM6IFtdLFxuXHRcdFx0XHRhY3Rpb25zOiBbXSxcblx0XHRcdFx0bmFtZXNwYWNlOiBcIlwiLFxuXHRcdFx0XHRhbm5vdGF0aW9uczoge1xuXHRcdFx0XHRcdFwibWV0YW1vZGVsUmVzdWx0XCI6IGFubm90YXRpb25MaXN0c1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cmVmZXJlbmNlczogW10sXG5cdFx0XHR1bmFsaWFzOiB1bmFsaWFzRm5cblx0XHR9O1xuXHR9LFxuXHRjb252ZXJ0VHlwZXMob01ldGFNb2RlbDogYW55KSB7XG5cdFx0Y29uc3QgcGFyc2VkT3V0cHV0ID0gdGhpcy5wYXJzZUVudGl0eVR5cGVzKG9NZXRhTW9kZWwpO1xuXG5cdFx0cmV0dXJuIEFubm90YXRpb25Db252ZXJ0ZXIuY29udmVydFR5cGVzKHBhcnNlZE91dHB1dCk7XG5cdH0sXG5cdGNvbnZlcnRQYWdlKG9NZXRhTW9kZWw6IGFueSwgb01hbmlmZXN0U2V0dGluZ3M6IE1hbmlmZXN0U2V0dGluZ3MpIHtcblx0XHRjb25zdCBzZXJ2aWNlT2JqZWN0ID0gdGhpcy5jb252ZXJ0VHlwZXMob01ldGFNb2RlbCk7XG5cdFx0Y29uc3Qgc0VudGl0eVNldCA9IG9NYW5pZmVzdFNldHRpbmdzLmVudGl0eVNldDtcblx0XHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlOiBFbnRpdHlUeXBlIHwgdW5kZWZpbmVkID0gc2VydmljZU9iamVjdC5zY2hlbWEuZW50aXR5VHlwZXMuZmluZChcblx0XHRcdChlbnRpdHlUeXBlOiBFbnRpdHlUeXBlKSA9PiBlbnRpdHlUeXBlLm5hbWUgPT09IHNFbnRpdHlTZXRcblx0XHQpO1xuXHRcdGlmICh0YXJnZXRFbnRpdHlUeXBlKSB7XG5cdFx0XHRjb25zdCBvQ29udGV4dCA9IG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIgKyBzRW50aXR5U2V0KTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFtzRW50aXR5U2V0XTogT2JqZWN0UGFnZUNvbnZlcnRlci5jb252ZXJ0UGFnZShcblx0XHRcdFx0XHR0YXJnZXRFbnRpdHlUeXBlLFxuXHRcdFx0XHRcdG9Db250ZXh0LFxuXHRcdFx0XHRcdG9NYW5pZmVzdFNldHRpbmdzIGFzIE9iamVjdFBhZ2VNYW5pZmVzdFNldHRpbmdzLFxuXHRcdFx0XHRcdHNlcnZpY2VPYmplY3QudW5hbGlhc1xuXHRcdFx0XHQpXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgTWV0YU1vZGVsQ29udmVydGVyO1xuIl19