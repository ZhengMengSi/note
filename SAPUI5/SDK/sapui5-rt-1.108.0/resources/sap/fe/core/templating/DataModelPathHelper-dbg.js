/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingToolkit", "sap/fe/core/templating/PropertyHelper"], function (BindingToolkit, PropertyHelper) {
  "use strict";

  var _exports = {};
  var isPathExpression = PropertyHelper.isPathExpression;
  var isAnnotationPathExpression = PropertyHelper.isAnnotationPathExpression;
  var unresolveableExpression = BindingToolkit.unresolveableExpression;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;

  /**
   * Function that returns the relative path to the property from the DataModelObjectPath.
   *
   * @param contextPath The DataModelObjectPath object to the property
   * @returns The path from the root entity set.
   */
  var getRelativePaths = function (contextPath) {
    return getPathRelativeLocation(contextPath === null || contextPath === void 0 ? void 0 : contextPath.contextLocation, contextPath === null || contextPath === void 0 ? void 0 : contextPath.navigationProperties).map(function (np) {
      return np.name;
    });
  };

  _exports.getRelativePaths = getRelativePaths;

  var getPathRelativeLocation = function (contextPath) {
    var visitedNavProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!contextPath) {
      return visitedNavProps;
    } else if (visitedNavProps.length >= contextPath.navigationProperties.length) {
      var remainingNavProps = [];
      contextPath.navigationProperties.forEach(function (navProp, navIndex) {
        if (visitedNavProps[navIndex] !== navProp) {
          remainingNavProps.push(visitedNavProps[navIndex]);
        }
      });
      remainingNavProps = remainingNavProps.concat(visitedNavProps.slice(contextPath.navigationProperties.length)); // Clean up NavProp -> Owner

      var currentIdx = 0;

      while (remainingNavProps.length > 1 && currentIdx != remainingNavProps.length - 1) {
        var currentNav = remainingNavProps[currentIdx];
        var nextNavProp = remainingNavProps[currentIdx + 1];

        if (currentNav.partner === nextNavProp.name) {
          remainingNavProps.splice(0, 2);
        } else {
          currentIdx++;
        }
      }

      return remainingNavProps;
    } else {
      var extraNavProp = [];
      visitedNavProps.forEach(function (navProp, navIndex) {
        if (contextPath.navigationProperties[navIndex] !== navProp) {
          extraNavProp.push(visitedNavProps[navIndex]);
        }
      });
      extraNavProp = extraNavProp.concat(contextPath.navigationProperties.slice(visitedNavProps.length)); // Clean up NavProp -> Owner

      var _currentIdx = 0;

      while (extraNavProp.length > 1 && _currentIdx != extraNavProp.length - 1) {
        var _currentNav = extraNavProp[_currentIdx];
        var _nextNavProp = extraNavProp[_currentIdx + 1];

        if (_currentNav.partner === _nextNavProp.name) {
          extraNavProp.splice(0, 2);
        } else {
          _currentIdx++;
        }
      }

      extraNavProp = extraNavProp.map(function (navProp) {
        return navProp.targetType.navigationProperties.find(function (np) {
          return np.name === navProp.partner;
        });
      });
      return extraNavProp;
    }
  };

  _exports.getPathRelativeLocation = getPathRelativeLocation;

  var enhanceDataModelPath = function (dataModelObjectPath, propertyPath) {
    var sPropertyPath = "";

    if ((isPathExpression(propertyPath) || isAnnotationPathExpression(propertyPath)) && propertyPath.path) {
      sPropertyPath = propertyPath.path;
    } else if (typeof propertyPath === "string") {
      sPropertyPath = propertyPath;
    }

    var oTarget;

    if (isPathExpression(propertyPath) || isAnnotationPathExpression(propertyPath)) {
      oTarget = propertyPath.$target;
    } else if (dataModelObjectPath.targetEntityType) {
      oTarget = dataModelObjectPath.targetEntityType.resolvePath(sPropertyPath);
    } else {
      oTarget = dataModelObjectPath.targetObject;
    }

    var aPathSplit = sPropertyPath.split("/");
    var currentEntitySet = dataModelObjectPath.targetEntitySet;
    var currentEntityType = dataModelObjectPath.targetEntityType;
    var navigationProperties = dataModelObjectPath.navigationProperties.concat(); // Process only if we have to go through navigation properties

    var reducedEntityType = dataModelObjectPath.targetEntityType;
    aPathSplit.forEach(function (pathPart) {
      if (!reducedEntityType) {
        return;
      }

      var potentialNavProp = reducedEntityType.navigationProperties.find(function (navProp) {
        return navProp.name === pathPart;
      });

      if (potentialNavProp) {
        navigationProperties.push(potentialNavProp);
        currentEntityType = potentialNavProp.targetType;

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(pathPart)) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[pathPart];
        }

        reducedEntityType = currentEntityType;
      } else {
        reducedEntityType = undefined;
      }
    });
    return {
      startingEntitySet: dataModelObjectPath.startingEntitySet,
      navigationProperties: navigationProperties,
      contextLocation: dataModelObjectPath.contextLocation,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: oTarget,
      convertedTypes: dataModelObjectPath.convertedTypes
    };
  };

  _exports.enhanceDataModelPath = enhanceDataModelPath;

  var getTargetEntitySetPath = function (dataModelObjectPath) {
    var targetEntitySetPath = "/".concat(dataModelObjectPath.startingEntitySet.name);
    var currentEntitySet = dataModelObjectPath.startingEntitySet;
    var navigatedPaths = [];
    dataModelObjectPath.navigationProperties.forEach(function (navProp) {
      navigatedPaths.push(navProp.name);

      if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
        targetEntitySetPath += "/$NavigationPropertyBinding/".concat(navigatedPaths.join("/"), "/$");
        currentEntitySet = currentEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
        navigatedPaths = [];
      }
    });
    return targetEntitySetPath;
  };

  _exports.getTargetEntitySetPath = getTargetEntitySetPath;

  var getTargetObjectPath = function (dataModelObjectPath) {
    var bRelative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var path = "";

    if (!dataModelObjectPath.startingEntitySet) {
      return "/";
    }

    if (!bRelative) {
      path += "/".concat(dataModelObjectPath.startingEntitySet.name);
    }

    if (dataModelObjectPath.navigationProperties.length > 0) {
      if (path.length > 0) {
        path += "/";
      }

      path += dataModelObjectPath.navigationProperties.map(function (navProp) {
        return navProp.name;
      }).join("/");
    }

    if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.name && dataModelObjectPath.targetObject._type !== "NavigationProperty" && dataModelObjectPath.targetObject._type !== "EntityType" && dataModelObjectPath.targetObject._type !== "EntitySet" && dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet) {
      if (!path.endsWith("/")) {
        path += "/";
      }

      path += "".concat(dataModelObjectPath.targetObject.name);
    } else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "@".concat(dataModelObjectPath.targetObject.term);

      if (dataModelObjectPath.targetObject.hasOwnProperty("qualifier") && !!dataModelObjectPath.targetObject.qualifier) {
        path += "#".concat(dataModelObjectPath.targetObject.qualifier);
      }
    }

    return path;
  };

  _exports.getTargetObjectPath = getTargetObjectPath;

  var getContextRelativeTargetObjectPath = function (dataModelObjectPath) {
    var _dataModelObjectPath$;

    var forBindingExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (((_dataModelObjectPath$ = dataModelObjectPath.contextLocation) === null || _dataModelObjectPath$ === void 0 ? void 0 : _dataModelObjectPath$.startingEntitySet) !== dataModelObjectPath.startingEntitySet) {
      return getTargetObjectPath(dataModelObjectPath);
    }

    return _getContextRelativeTargetObjectPath(dataModelObjectPath, forBindingExpression);
  };

  _exports.getContextRelativeTargetObjectPath = getContextRelativeTargetObjectPath;

  var _getContextRelativeTargetObjectPath = function (dataModelObjectPath) {
    var forBindingExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var navProperties = getPathRelativeLocation(dataModelObjectPath.contextLocation, dataModelObjectPath.navigationProperties);

    if (forBindingExpression) {
      if (navProperties.find(function (np) {
        return np.isCollection;
      })) {
        return undefined;
      }
    }

    var path = navProperties.map(function (np) {
      return np.name;
    }).join("/");

    if (dataModelObjectPath.targetObject && (dataModelObjectPath.targetObject.name || dataModelObjectPath.targetObject.type === "PropertyPath" && dataModelObjectPath.targetObject.value) && dataModelObjectPath.targetObject._type !== "NavigationProperty" && dataModelObjectPath.targetObject._type !== "EntityType" && dataModelObjectPath.targetObject._type !== "EntitySet" && dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += dataModelObjectPath.targetObject.type === "PropertyPath" ? "".concat(dataModelObjectPath.targetObject.value) : "".concat(dataModelObjectPath.targetObject.name);
    } else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "@".concat(dataModelObjectPath.targetObject.term);

      if (dataModelObjectPath.targetObject.hasOwnProperty("qualifier") && !!dataModelObjectPath.targetObject.qualifier) {
        path += "#".concat(dataModelObjectPath.targetObject.qualifier);
      }
    } else if (!dataModelObjectPath.targetObject) {
      return undefined;
    }

    return path;
  };

  var isPathUpdatable = function (dataModelObjectPath, extractionParametersOnPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Upd;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Upd = annotationObject.UpdateRestrictions) === null || _annotationObject$Upd === void 0 ? void 0 : _annotationObject$Upd.Updatable;
    }, extractionParametersOnPath);
  };

  _exports.isPathUpdatable = isPathUpdatable;

  var isPathSearchable = function (dataModelObjectPath, extractionParametersOnPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Sea;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Sea = annotationObject.SearchRestrictions) === null || _annotationObject$Sea === void 0 ? void 0 : _annotationObject$Sea.Searchable;
    }, extractionParametersOnPath);
  };

  _exports.isPathSearchable = isPathSearchable;

  var isPathDeletable = function (dataModelObjectPath, extractionParametersOnPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Del;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Del = annotationObject.DeleteRestrictions) === null || _annotationObject$Del === void 0 ? void 0 : _annotationObject$Del.Deletable;
    }, extractionParametersOnPath);
  };

  _exports.isPathDeletable = isPathDeletable;

  var isPathInsertable = function (dataModelObjectPath, extractionParametersOnPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Ins;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Ins = annotationObject.InsertRestrictions) === null || _annotationObject$Ins === void 0 ? void 0 : _annotationObject$Ins.Insertable;
    }, extractionParametersOnPath);
  };

  _exports.isPathInsertable = isPathInsertable;

  var checkFilterExpressionRestrictions = function (dataModelObjectPath, allowedExpression) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      if (annotationObject && "FilterRestrictions" in annotationObject) {
        var _annotationObject$Fil;

        var filterExpressionRestrictions = (annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Fil = annotationObject.FilterRestrictions) === null || _annotationObject$Fil === void 0 ? void 0 : _annotationObject$Fil.FilterExpressionRestrictions) || [];
        var currentObjectRestriction = filterExpressionRestrictions.find(function (restriction) {
          return restriction.Property.$target === dataModelObjectPath.targetObject;
        });

        if (currentObjectRestriction) {
          var _currentObjectRestric;

          return allowedExpression.indexOf(currentObjectRestriction === null || currentObjectRestriction === void 0 ? void 0 : (_currentObjectRestric = currentObjectRestriction.AllowedExpressions) === null || _currentObjectRestric === void 0 ? void 0 : _currentObjectRestric.toString()) !== -1;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  };

  _exports.checkFilterExpressionRestrictions = checkFilterExpressionRestrictions;

  var checkOnPath = function (dataModelObjectPath, checkFunction, extractionParametersOnPath) {
    if (!dataModelObjectPath || !dataModelObjectPath.startingEntitySet) {
      return constant(true);
    }

    dataModelObjectPath = enhanceDataModelPath(dataModelObjectPath, extractionParametersOnPath === null || extractionParametersOnPath === void 0 ? void 0 : extractionParametersOnPath.propertyPath);
    var currentEntitySet = dataModelObjectPath.startingEntitySet;
    var parentEntitySet = null;
    var visitedNavigationPropsName = [];
    var allVisitedNavigationProps = [];
    var targetEntitySet = currentEntitySet;
    var targetEntityType = dataModelObjectPath.targetEntityType;
    var resetVisitedNavProps = false;
    dataModelObjectPath.navigationProperties.forEach(function (navigationProperty) {
      if (resetVisitedNavProps) {
        visitedNavigationPropsName = [];
      }

      visitedNavigationPropsName.push(navigationProperty.name);
      allVisitedNavigationProps.push(navigationProperty);

      if (!navigationProperty.containsTarget) {
        // We should have a navigationPropertyBinding associated with the path so far which can consist of ([ContainmentNavProp]/)*[NavProp]
        var _fullNavigationPath = visitedNavigationPropsName.join("/");

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(_fullNavigationPath)) {
          parentEntitySet = currentEntitySet;
          currentEntitySet = currentEntitySet.navigationPropertyBinding[_fullNavigationPath];
          targetEntitySet = currentEntitySet; // If we reached a navigation property with a navigationpropertybinding, we need to reset the visited path on the next iteration (if there is one)

          resetVisitedNavProps = true;
        } else {
          // We really should not end up here but at least let's try to avoid incorrect behavior
          parentEntitySet = currentEntitySet;
          currentEntitySet = null;
          resetVisitedNavProps = true;
        }
      } else {
        parentEntitySet = currentEntitySet;
        targetEntitySet = null;
      }
    }); // At this point we have navigated down all the nav prop and we should have
    // The target entitySet pointing to either null (in case of containment navprop a last part), or the actual target (non containment as target)
    // The parent entitySet pointing to the previous entitySet used in the path
    // VisitedNavigationPath should contain the path up to this property
    // Restrictions should then be evaluated as ParentEntitySet.NavRestrictions[NavPropertyPath] || TargetEntitySet.Restrictions

    var fullNavigationPath = visitedNavigationPropsName.join("/");
    var restrictions, visitedNavProps;

    if (parentEntitySet !== null) {
      var _parentEntitySet$anno, _parentEntitySet$anno2, _parentEntitySet$anno3;

      var _parentEntitySet = parentEntitySet;
      (_parentEntitySet$anno = _parentEntitySet.annotations) === null || _parentEntitySet$anno === void 0 ? void 0 : (_parentEntitySet$anno2 = _parentEntitySet$anno.Capabilities) === null || _parentEntitySet$anno2 === void 0 ? void 0 : (_parentEntitySet$anno3 = _parentEntitySet$anno2.NavigationRestrictions) === null || _parentEntitySet$anno3 === void 0 ? void 0 : _parentEntitySet$anno3.RestrictedProperties.forEach(function (restrictedNavProp) {
        var _restrictedNavProp$Na;

        if (((_restrictedNavProp$Na = restrictedNavProp.NavigationProperty) === null || _restrictedNavProp$Na === void 0 ? void 0 : _restrictedNavProp$Na.type) === "NavigationPropertyPath") {
          var restrictionDefinition = checkFunction(restrictedNavProp);

          if (fullNavigationPath === restrictedNavProp.NavigationProperty.value && restrictionDefinition !== undefined) {
            var _dataModelObjectPath;

            var _allVisitedNavigationProps = allVisitedNavigationProps.slice(0, -1);

            visitedNavProps = _allVisitedNavigationProps;
            var pathRelativeLocation = getPathRelativeLocation((_dataModelObjectPath = dataModelObjectPath) === null || _dataModelObjectPath === void 0 ? void 0 : _dataModelObjectPath.contextLocation, visitedNavProps).map(function (np) {
              return np.name;
            });
            var pathVisitorFunction = extractionParametersOnPath !== null && extractionParametersOnPath !== void 0 && extractionParametersOnPath.pathVisitor ? getPathVisitorForSingleton(extractionParametersOnPath.pathVisitor, pathRelativeLocation) : undefined; // send pathVisitor function only when it is defined and only send function or defined as a parameter

            restrictions = equal(getExpressionFromAnnotation(restrictionDefinition, pathRelativeLocation, undefined, pathVisitorFunction), true);
          }
        }
      });
    }

    var targetRestrictions;

    if (!(extractionParametersOnPath !== null && extractionParametersOnPath !== void 0 && extractionParametersOnPath.ignoreTargetCollection)) {
      var _targetEntitySet, _targetEntitySet$anno;

      var restrictionDefinition = checkFunction((_targetEntitySet = targetEntitySet) === null || _targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno = _targetEntitySet.annotations) === null || _targetEntitySet$anno === void 0 ? void 0 : _targetEntitySet$anno.Capabilities);

      if (targetEntitySet === null && restrictionDefinition === undefined) {
        var _targetEntityType$ann;

        restrictionDefinition = checkFunction(targetEntityType === null || targetEntityType === void 0 ? void 0 : (_targetEntityType$ann = targetEntityType.annotations) === null || _targetEntityType$ann === void 0 ? void 0 : _targetEntityType$ann.Capabilities);
      }

      if (restrictionDefinition !== undefined) {
        var pathRelativeLocation = getPathRelativeLocation(dataModelObjectPath.contextLocation, allVisitedNavigationProps).map(function (np) {
          return np.name;
        });
        var pathVisitorFunction = extractionParametersOnPath !== null && extractionParametersOnPath !== void 0 && extractionParametersOnPath.pathVisitor ? getPathVisitorForSingleton(extractionParametersOnPath.pathVisitor, pathRelativeLocation) : undefined;
        targetRestrictions = equal(getExpressionFromAnnotation(restrictionDefinition, pathRelativeLocation, undefined, pathVisitorFunction), true);
      }
    }

    return restrictions || targetRestrictions || (extractionParametersOnPath !== null && extractionParametersOnPath !== void 0 && extractionParametersOnPath.authorizeUnresolvable ? unresolveableExpression : constant(true));
  }; // This helper method is used to add relative path location argument to singletonPathVisitorFunction i.e. pathVisitor
  // pathVisitor method is used later to get the correct bindings for singleton entity
  // method is invoked later in pathInModel() method to get the correct binding.


  _exports.checkOnPath = checkOnPath;

  var getPathVisitorForSingleton = function (pathVisitor, pathRelativeLocation) {
    return function (path) {
      return pathVisitor(path, pathRelativeLocation);
    };
  };

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRSZWxhdGl2ZVBhdGhzIiwiY29udGV4dFBhdGgiLCJnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbiIsImNvbnRleHRMb2NhdGlvbiIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwibWFwIiwibnAiLCJuYW1lIiwidmlzaXRlZE5hdlByb3BzIiwibGVuZ3RoIiwicmVtYWluaW5nTmF2UHJvcHMiLCJmb3JFYWNoIiwibmF2UHJvcCIsIm5hdkluZGV4IiwicHVzaCIsImNvbmNhdCIsInNsaWNlIiwiY3VycmVudElkeCIsImN1cnJlbnROYXYiLCJuZXh0TmF2UHJvcCIsInBhcnRuZXIiLCJzcGxpY2UiLCJleHRyYU5hdlByb3AiLCJ0YXJnZXRUeXBlIiwiZmluZCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwiZGF0YU1vZGVsT2JqZWN0UGF0aCIsInByb3BlcnR5UGF0aCIsInNQcm9wZXJ0eVBhdGgiLCJpc1BhdGhFeHByZXNzaW9uIiwiaXNBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb24iLCJwYXRoIiwib1RhcmdldCIsIiR0YXJnZXQiLCJ0YXJnZXRFbnRpdHlUeXBlIiwicmVzb2x2ZVBhdGgiLCJ0YXJnZXRPYmplY3QiLCJhUGF0aFNwbGl0Iiwic3BsaXQiLCJjdXJyZW50RW50aXR5U2V0IiwidGFyZ2V0RW50aXR5U2V0IiwiY3VycmVudEVudGl0eVR5cGUiLCJyZWR1Y2VkRW50aXR5VHlwZSIsInBhdGhQYXJ0IiwicG90ZW50aWFsTmF2UHJvcCIsIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmciLCJoYXNPd25Qcm9wZXJ0eSIsInVuZGVmaW5lZCIsInN0YXJ0aW5nRW50aXR5U2V0IiwiY29udmVydGVkVHlwZXMiLCJnZXRUYXJnZXRFbnRpdHlTZXRQYXRoIiwidGFyZ2V0RW50aXR5U2V0UGF0aCIsIm5hdmlnYXRlZFBhdGhzIiwiam9pbiIsImdldFRhcmdldE9iamVjdFBhdGgiLCJiUmVsYXRpdmUiLCJfdHlwZSIsImVuZHNXaXRoIiwidGVybSIsInF1YWxpZmllciIsImdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgiLCJmb3JCaW5kaW5nRXhwcmVzc2lvbiIsIl9nZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoIiwibmF2UHJvcGVydGllcyIsImlzQ29sbGVjdGlvbiIsInR5cGUiLCJ2YWx1ZSIsImlzUGF0aFVwZGF0YWJsZSIsImV4dHJhY3Rpb25QYXJhbWV0ZXJzT25QYXRoIiwiY2hlY2tPblBhdGgiLCJhbm5vdGF0aW9uT2JqZWN0IiwiVXBkYXRlUmVzdHJpY3Rpb25zIiwiVXBkYXRhYmxlIiwiaXNQYXRoU2VhcmNoYWJsZSIsIlNlYXJjaFJlc3RyaWN0aW9ucyIsIlNlYXJjaGFibGUiLCJpc1BhdGhEZWxldGFibGUiLCJEZWxldGVSZXN0cmljdGlvbnMiLCJEZWxldGFibGUiLCJpc1BhdGhJbnNlcnRhYmxlIiwiSW5zZXJ0UmVzdHJpY3Rpb25zIiwiSW5zZXJ0YWJsZSIsImNoZWNrRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImFsbG93ZWRFeHByZXNzaW9uIiwiZmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsIkZpbHRlclJlc3RyaWN0aW9ucyIsIkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMiLCJjdXJyZW50T2JqZWN0UmVzdHJpY3Rpb24iLCJyZXN0cmljdGlvbiIsIlByb3BlcnR5IiwiaW5kZXhPZiIsIkFsbG93ZWRFeHByZXNzaW9ucyIsInRvU3RyaW5nIiwiY2hlY2tGdW5jdGlvbiIsImNvbnN0YW50IiwicGFyZW50RW50aXR5U2V0IiwidmlzaXRlZE5hdmlnYXRpb25Qcm9wc05hbWUiLCJhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzIiwicmVzZXRWaXNpdGVkTmF2UHJvcHMiLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJjb250YWluc1RhcmdldCIsImZ1bGxOYXZpZ2F0aW9uUGF0aCIsInJlc3RyaWN0aW9ucyIsIl9wYXJlbnRFbnRpdHlTZXQiLCJhbm5vdGF0aW9ucyIsIkNhcGFiaWxpdGllcyIsIk5hdmlnYXRpb25SZXN0cmljdGlvbnMiLCJSZXN0cmljdGVkUHJvcGVydGllcyIsInJlc3RyaWN0ZWROYXZQcm9wIiwiTmF2aWdhdGlvblByb3BlcnR5IiwicmVzdHJpY3Rpb25EZWZpbml0aW9uIiwiX2FsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHMiLCJwYXRoUmVsYXRpdmVMb2NhdGlvbiIsInBhdGhWaXNpdG9yRnVuY3Rpb24iLCJwYXRoVmlzaXRvciIsImdldFBhdGhWaXNpdG9yRm9yU2luZ2xldG9uIiwiZXF1YWwiLCJnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24iLCJ0YXJnZXRSZXN0cmljdGlvbnMiLCJpZ25vcmVUYXJnZXRDb2xsZWN0aW9uIiwiYXV0aG9yaXplVW5yZXNvbHZhYmxlIiwidW5yZXNvbHZlYWJsZUV4cHJlc3Npb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkRhdGFNb2RlbFBhdGhIZWxwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuXHRDb252ZXJ0ZWRNZXRhZGF0YSxcblx0RW50aXR5U2V0LFxuXHRFbnRpdHlUeXBlLFxuXHROYXZpZ2F0aW9uUHJvcGVydHksXG5cdFByb3BlcnR5LFxuXHRQcm9wZXJ0eVBhdGgsXG5cdFNpbmdsZXRvblxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB0eXBlIHtcblx0RmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uVHlwZVR5cGVzLFxuXHROYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvbixcblx0TmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NhcGFiaWxpdGllc1wiO1xuaW1wb3J0IHR5cGUge1xuXHRFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMsXG5cdEVudGl0eVR5cGVBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXNcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9DYXBhYmlsaXRpZXNfRWRtXCI7XG5pbXBvcnQgdHlwZSB7IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgeyBjb25zdGFudCwgZXF1YWwsIGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiwgdW5yZXNvbHZlYWJsZUV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IHR5cGUgeyBQcm9wZXJ0eU9yUGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0Rpc3BsYXlNb2RlRm9ybWF0dGVyXCI7XG5pbXBvcnQgeyBpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbiwgaXNQYXRoRXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5cbmV4cG9ydCB0eXBlIERhdGFNb2RlbE9iamVjdFBhdGggPSB7XG5cdHN0YXJ0aW5nRW50aXR5U2V0OiBTaW5nbGV0b24gfCBFbnRpdHlTZXQ7XG5cdGNvbnRleHRMb2NhdGlvbj86IERhdGFNb2RlbE9iamVjdFBhdGg7XG5cdG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBOYXZpZ2F0aW9uUHJvcGVydHlbXTtcblx0dGFyZ2V0RW50aXR5U2V0PzogU2luZ2xldG9uIHwgRW50aXR5U2V0O1xuXHR0YXJnZXRFbnRpdHlUeXBlOiBFbnRpdHlUeXBlO1xuXHR0YXJnZXRPYmplY3Q6IGFueTtcblx0Y29udmVydGVkVHlwZXM6IENvbnZlcnRlZE1ldGFkYXRhO1xufTtcblxudHlwZSBFeHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aCA9IHtcblx0cHJvcGVydHlQYXRoPzogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+O1xuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uO1xuXHRpZ25vcmVUYXJnZXRDb2xsZWN0aW9uPzogYm9vbGVhbjtcblx0YXV0aG9yaXplVW5yZXNvbHZhYmxlPzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBwcm9wZXJ0eSBmcm9tIHRoZSBEYXRhTW9kZWxPYmplY3RQYXRoLlxuICpcbiAqIEBwYXJhbSBjb250ZXh0UGF0aCBUaGUgRGF0YU1vZGVsT2JqZWN0UGF0aCBvYmplY3QgdG8gdGhlIHByb3BlcnR5XG4gKiBAcmV0dXJucyBUaGUgcGF0aCBmcm9tIHRoZSByb290IGVudGl0eSBzZXQuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRSZWxhdGl2ZVBhdGhzID0gZnVuY3Rpb24gKGNvbnRleHRQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKSB7XG5cdHJldHVybiBnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbihjb250ZXh0UGF0aD8uY29udGV4dExvY2F0aW9uLCBjb250ZXh0UGF0aD8ubmF2aWdhdGlvblByb3BlcnRpZXMpLm1hcChcblx0XHQobnA6IE5hdmlnYXRpb25Qcm9wZXJ0eSkgPT4gbnAubmFtZVxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uID0gZnVuY3Rpb24gKFxuXHRjb250ZXh0UGF0aD86IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHZpc2l0ZWROYXZQcm9wczogTmF2aWdhdGlvblByb3BlcnR5W10gPSBbXVxuKTogTmF2aWdhdGlvblByb3BlcnR5W10ge1xuXHRpZiAoIWNvbnRleHRQYXRoKSB7XG5cdFx0cmV0dXJuIHZpc2l0ZWROYXZQcm9wcztcblx0fSBlbHNlIGlmICh2aXNpdGVkTmF2UHJvcHMubGVuZ3RoID49IGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmxlbmd0aCkge1xuXHRcdGxldCByZW1haW5pbmdOYXZQcm9wczogTmF2aWdhdGlvblByb3BlcnR5W10gPSBbXTtcblx0XHRjb250ZXh0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKChuYXZQcm9wLCBuYXZJbmRleCkgPT4ge1xuXHRcdFx0aWYgKHZpc2l0ZWROYXZQcm9wc1tuYXZJbmRleF0gIT09IG5hdlByb3ApIHtcblx0XHRcdFx0cmVtYWluaW5nTmF2UHJvcHMucHVzaCh2aXNpdGVkTmF2UHJvcHNbbmF2SW5kZXhdKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZW1haW5pbmdOYXZQcm9wcyA9IHJlbWFpbmluZ05hdlByb3BzLmNvbmNhdCh2aXNpdGVkTmF2UHJvcHMuc2xpY2UoY29udGV4dFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoKSk7XG5cdFx0Ly8gQ2xlYW4gdXAgTmF2UHJvcCAtPiBPd25lclxuXHRcdGxldCBjdXJyZW50SWR4ID0gMDtcblx0XHR3aGlsZSAocmVtYWluaW5nTmF2UHJvcHMubGVuZ3RoID4gMSAmJiBjdXJyZW50SWR4ICE9IHJlbWFpbmluZ05hdlByb3BzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnROYXYgPSByZW1haW5pbmdOYXZQcm9wc1tjdXJyZW50SWR4XTtcblx0XHRcdGNvbnN0IG5leHROYXZQcm9wID0gcmVtYWluaW5nTmF2UHJvcHNbY3VycmVudElkeCArIDFdO1xuXHRcdFx0aWYgKGN1cnJlbnROYXYucGFydG5lciA9PT0gbmV4dE5hdlByb3AubmFtZSkge1xuXHRcdFx0XHRyZW1haW5pbmdOYXZQcm9wcy5zcGxpY2UoMCwgMik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJyZW50SWR4Kys7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZW1haW5pbmdOYXZQcm9wcztcblx0fSBlbHNlIHtcblx0XHRsZXQgZXh0cmFOYXZQcm9wOiBOYXZpZ2F0aW9uUHJvcGVydHlbXSA9IFtdO1xuXHRcdHZpc2l0ZWROYXZQcm9wcy5mb3JFYWNoKChuYXZQcm9wLCBuYXZJbmRleCkgPT4ge1xuXHRcdFx0aWYgKGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzW25hdkluZGV4XSAhPT0gbmF2UHJvcCkge1xuXHRcdFx0XHRleHRyYU5hdlByb3AucHVzaCh2aXNpdGVkTmF2UHJvcHNbbmF2SW5kZXhdKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRleHRyYU5hdlByb3AgPSBleHRyYU5hdlByb3AuY29uY2F0KGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLnNsaWNlKHZpc2l0ZWROYXZQcm9wcy5sZW5ndGgpKTtcblx0XHQvLyBDbGVhbiB1cCBOYXZQcm9wIC0+IE93bmVyXG5cdFx0bGV0IGN1cnJlbnRJZHggPSAwO1xuXHRcdHdoaWxlIChleHRyYU5hdlByb3AubGVuZ3RoID4gMSAmJiBjdXJyZW50SWR4ICE9IGV4dHJhTmF2UHJvcC5sZW5ndGggLSAxKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50TmF2ID0gZXh0cmFOYXZQcm9wW2N1cnJlbnRJZHhdO1xuXHRcdFx0Y29uc3QgbmV4dE5hdlByb3AgPSBleHRyYU5hdlByb3BbY3VycmVudElkeCArIDFdO1xuXHRcdFx0aWYgKGN1cnJlbnROYXYucGFydG5lciA9PT0gbmV4dE5hdlByb3AubmFtZSkge1xuXHRcdFx0XHRleHRyYU5hdlByb3Auc3BsaWNlKDAsIDIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3VycmVudElkeCsrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRleHRyYU5hdlByb3AgPSBleHRyYU5hdlByb3AubWFwKChuYXZQcm9wKSA9PiB7XG5cdFx0XHRyZXR1cm4gbmF2UHJvcC50YXJnZXRUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZpbmQoKG5wKSA9PiBucC5uYW1lID09PSBuYXZQcm9wLnBhcnRuZXIpIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZXh0cmFOYXZQcm9wO1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgZW5oYW5jZURhdGFNb2RlbFBhdGggPSBmdW5jdGlvbiAoXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5UGF0aD86IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5PlxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGxldCBzUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBcIlwiO1xuXHRpZiAoKGlzUGF0aEV4cHJlc3Npb24ocHJvcGVydHlQYXRoKSB8fCBpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbihwcm9wZXJ0eVBhdGgpKSAmJiBwcm9wZXJ0eVBhdGgucGF0aCkge1xuXHRcdHNQcm9wZXJ0eVBhdGggPSBwcm9wZXJ0eVBhdGgucGF0aDtcblx0fSBlbHNlIGlmICh0eXBlb2YgcHJvcGVydHlQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0c1Byb3BlcnR5UGF0aCA9IHByb3BlcnR5UGF0aDtcblx0fVxuXHRsZXQgb1RhcmdldDtcblx0aWYgKGlzUGF0aEV4cHJlc3Npb24ocHJvcGVydHlQYXRoKSB8fCBpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbihwcm9wZXJ0eVBhdGgpKSB7XG5cdFx0b1RhcmdldCA9IHByb3BlcnR5UGF0aC4kdGFyZ2V0O1xuXHR9IGVsc2UgaWYgKGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5VHlwZSkge1xuXHRcdG9UYXJnZXQgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUucmVzb2x2ZVBhdGgoc1Byb3BlcnR5UGF0aCk7XG5cdH0gZWxzZSB7XG5cdFx0b1RhcmdldCA9IGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0O1xuXHR9XG5cdGNvbnN0IGFQYXRoU3BsaXQgPSBzUHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IGN1cnJlbnRFbnRpdHlTZXQgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVNldDtcblx0bGV0IGN1cnJlbnRFbnRpdHlUeXBlID0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlUeXBlO1xuXHRjb25zdCBuYXZpZ2F0aW9uUHJvcGVydGllcyA9IGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMuY29uY2F0KCk7XG5cdC8vIFByb2Nlc3Mgb25seSBpZiB3ZSBoYXZlIHRvIGdvIHRocm91Z2ggbmF2aWdhdGlvbiBwcm9wZXJ0aWVzXG5cblx0bGV0IHJlZHVjZWRFbnRpdHlUeXBlOiBFbnRpdHlUeXBlIHwgdW5kZWZpbmVkID0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlUeXBlO1xuXHRhUGF0aFNwbGl0LmZvckVhY2goKHBhdGhQYXJ0OiBzdHJpbmcpID0+IHtcblx0XHRpZiAoIXJlZHVjZWRFbnRpdHlUeXBlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IHBvdGVudGlhbE5hdlByb3AgPSByZWR1Y2VkRW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5maW5kKChuYXZQcm9wKSA9PiBuYXZQcm9wLm5hbWUgPT09IHBhdGhQYXJ0KTtcblx0XHRpZiAocG90ZW50aWFsTmF2UHJvcCkge1xuXHRcdFx0bmF2aWdhdGlvblByb3BlcnRpZXMucHVzaChwb3RlbnRpYWxOYXZQcm9wKTtcblx0XHRcdGN1cnJlbnRFbnRpdHlUeXBlID0gcG90ZW50aWFsTmF2UHJvcC50YXJnZXRUeXBlO1xuXHRcdFx0aWYgKGN1cnJlbnRFbnRpdHlTZXQgJiYgY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLmhhc093blByb3BlcnR5KHBhdGhQYXJ0KSkge1xuXHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW3BhdGhQYXJ0XSBhcyBFbnRpdHlTZXQ7XG5cdFx0XHR9XG5cdFx0XHRyZWR1Y2VkRW50aXR5VHlwZSA9IGN1cnJlbnRFbnRpdHlUeXBlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWR1Y2VkRW50aXR5VHlwZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQsXG5cdFx0bmF2aWdhdGlvblByb3BlcnRpZXM6IG5hdmlnYXRpb25Qcm9wZXJ0aWVzLFxuXHRcdGNvbnRleHRMb2NhdGlvbjogZGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24sXG5cdFx0dGFyZ2V0RW50aXR5U2V0OiBjdXJyZW50RW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVR5cGU6IGN1cnJlbnRFbnRpdHlUeXBlLFxuXHRcdHRhcmdldE9iamVjdDogb1RhcmdldCxcblx0XHRjb252ZXJ0ZWRUeXBlczogZGF0YU1vZGVsT2JqZWN0UGF0aC5jb252ZXJ0ZWRUeXBlc1xuXHR9O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRhcmdldEVudGl0eVNldFBhdGggPSBmdW5jdGlvbiAoZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCk6IHN0cmluZyB7XG5cdGxldCB0YXJnZXRFbnRpdHlTZXRQYXRoOiBzdHJpbmcgPSBgLyR7ZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldC5uYW1lfWA7XG5cdGxldCBjdXJyZW50RW50aXR5U2V0ID0gZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldDtcblx0bGV0IG5hdmlnYXRlZFBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuXHRkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2goKG5hdlByb3ApID0+IHtcblx0XHRuYXZpZ2F0ZWRQYXRocy5wdXNoKG5hdlByb3AubmFtZSk7XG5cdFx0aWYgKGN1cnJlbnRFbnRpdHlTZXQgJiYgY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLmhhc093blByb3BlcnR5KG5hdmlnYXRlZFBhdGhzLmpvaW4oXCIvXCIpKSkge1xuXHRcdFx0dGFyZ2V0RW50aXR5U2V0UGF0aCArPSBgLyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLyR7bmF2aWdhdGVkUGF0aHMuam9pbihcIi9cIil9LyRgO1xuXHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKV0gYXMgRW50aXR5U2V0O1xuXHRcdFx0bmF2aWdhdGVkUGF0aHMgPSBbXTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gdGFyZ2V0RW50aXR5U2V0UGF0aDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUYXJnZXRPYmplY3RQYXRoID0gZnVuY3Rpb24gKGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsIGJSZWxhdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcblx0bGV0IHBhdGggPSBcIlwiO1xuXHRpZiAoIWRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQpIHtcblx0XHRyZXR1cm4gXCIvXCI7XG5cdH1cblx0aWYgKCFiUmVsYXRpdmUpIHtcblx0XHRwYXRoICs9IGAvJHtkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWV9YDtcblx0fVxuXHRpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMCkge1xuXHRcdFx0cGF0aCArPSBcIi9cIjtcblx0XHR9XG5cdFx0cGF0aCArPSBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLm1hcCgobmF2UHJvcCkgPT4gbmF2UHJvcC5uYW1lKS5qb2luKFwiL1wiKTtcblx0fVxuXG5cdGlmIChcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lm5hbWUgJiZcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5fdHlwZSAhPT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlICE9PSBcIkVudGl0eVR5cGVcIiAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlICE9PSBcIkVudGl0eVNldFwiICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgIT09IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXRcblx0KSB7XG5cdFx0aWYgKCFwYXRoLmVuZHNXaXRoKFwiL1wiKSkge1xuXHRcdFx0cGF0aCArPSBcIi9cIjtcblx0XHR9XG5cdFx0cGF0aCArPSBgJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5uYW1lfWA7XG5cdH0gZWxzZSBpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgJiYgZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJ0ZXJtXCIpKSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMCAmJiAhcGF0aC5lbmRzV2l0aChcIi9cIikpIHtcblx0XHRcdHBhdGggKz0gXCIvXCI7XG5cdFx0fVxuXHRcdHBhdGggKz0gYEAke2RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnRlcm19YDtcblx0XHRpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJxdWFsaWZpZXJcIikgJiYgISFkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5xdWFsaWZpZXIpIHtcblx0XHRcdHBhdGggKz0gYCMke2RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnF1YWxpZmllcn1gO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcGF0aDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoID0gZnVuY3Rpb24gKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmb3JCaW5kaW5nRXhwcmVzc2lvbjogYm9vbGVhbiA9IGZhbHNlXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24/LnN0YXJ0aW5nRW50aXR5U2V0ICE9PSBkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0KSB7XG5cdFx0cmV0dXJuIGdldFRhcmdldE9iamVjdFBhdGgoZGF0YU1vZGVsT2JqZWN0UGF0aCk7XG5cdH1cblx0cmV0dXJuIF9nZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoKGRhdGFNb2RlbE9iamVjdFBhdGgsIGZvckJpbmRpbmdFeHByZXNzaW9uKTtcbn07XG5cbmNvbnN0IF9nZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoID0gZnVuY3Rpb24gKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmb3JCaW5kaW5nRXhwcmVzc2lvbjogYm9vbGVhbiA9IGZhbHNlXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRjb25zdCBuYXZQcm9wZXJ0aWVzID0gZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24oZGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24sIGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMpO1xuXHRpZiAoZm9yQmluZGluZ0V4cHJlc3Npb24pIHtcblx0XHRpZiAobmF2UHJvcGVydGllcy5maW5kKChucCkgPT4gbnAuaXNDb2xsZWN0aW9uKSkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0bGV0IHBhdGggPSBuYXZQcm9wZXJ0aWVzLm1hcCgobnApID0+IG5wLm5hbWUpLmpvaW4oXCIvXCIpO1xuXHRpZiAoXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgJiZcblx0XHQoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QubmFtZSB8fFxuXHRcdFx0KGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCIgJiYgZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QudmFsdWUpKSAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlICE9PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuX3R5cGUgIT09IFwiRW50aXR5VHlwZVwiICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuX3R5cGUgIT09IFwiRW50aXR5U2V0XCIgJiZcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCAhPT0gZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldFxuXHQpIHtcblx0XHRpZiAocGF0aC5sZW5ndGggPiAwICYmICFwYXRoLmVuZHNXaXRoKFwiL1wiKSkge1xuXHRcdFx0cGF0aCArPSBcIi9cIjtcblx0XHR9XG5cdFx0cGF0aCArPVxuXHRcdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QudHlwZSA9PT0gXCJQcm9wZXJ0eVBhdGhcIlxuXHRcdFx0XHQ/IGAke2RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnZhbHVlfWBcblx0XHRcdFx0OiBgJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5uYW1lfWA7XG5cdH0gZWxzZSBpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgJiYgZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJ0ZXJtXCIpKSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMCAmJiAhcGF0aC5lbmRzV2l0aChcIi9cIikpIHtcblx0XHRcdHBhdGggKz0gXCIvXCI7XG5cdFx0fVxuXHRcdHBhdGggKz0gYEAke2RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnRlcm19YDtcblx0XHRpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJxdWFsaWZpZXJcIikgJiYgISFkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5xdWFsaWZpZXIpIHtcblx0XHRcdHBhdGggKz0gYCMke2RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnF1YWxpZmllcn1gO1xuXHRcdH1cblx0fSBlbHNlIGlmICghZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdHJldHVybiBwYXRoO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUGF0aFVwZGF0YWJsZSA9IGZ1bmN0aW9uIChcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0ZXh0cmFjdGlvblBhcmFtZXRlcnNPblBhdGg/OiBFeHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0KGFubm90YXRpb25PYmplY3Q6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uIHwgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdD8uVXBkYXRlUmVzdHJpY3Rpb25zPy5VcGRhdGFibGU7XG5cdFx0fSxcblx0XHRleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aFxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUGF0aFNlYXJjaGFibGUgPSBmdW5jdGlvbiAoXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGggfCB1bmRlZmluZWQsXG5cdGV4dHJhY3Rpb25QYXJhbWV0ZXJzT25QYXRoPzogRXh0cmFjdGlvblBhcmFtZXRlcnNPblBhdGhcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjaGVja09uUGF0aChcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdChhbm5vdGF0aW9uT2JqZWN0OiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvbiB8IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcykgPT4ge1xuXHRcdFx0cmV0dXJuIGFubm90YXRpb25PYmplY3Q/LlNlYXJjaFJlc3RyaWN0aW9ucz8uU2VhcmNoYWJsZTtcblx0XHR9LFxuXHRcdGV4dHJhY3Rpb25QYXJhbWV0ZXJzT25QYXRoXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQYXRoRGVsZXRhYmxlID0gZnVuY3Rpb24gKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgdW5kZWZpbmVkLFxuXHRleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aD86IEV4dHJhY3Rpb25QYXJhbWV0ZXJzT25QYXRoXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY2hlY2tPblBhdGgoXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0XHQoYW5ub3RhdGlvbk9iamVjdDogTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb24gfCBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMpID0+IHtcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uT2JqZWN0Py5EZWxldGVSZXN0cmljdGlvbnM/LkRlbGV0YWJsZTtcblx0XHR9LFxuXHRcdGV4dHJhY3Rpb25QYXJhbWV0ZXJzT25QYXRoXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQYXRoSW5zZXJ0YWJsZSA9IGZ1bmN0aW9uIChcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0ZXh0cmFjdGlvblBhcmFtZXRlcnNPblBhdGg/OiBFeHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0KGFubm90YXRpb25PYmplY3Q6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uIHwgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdD8uSW5zZXJ0UmVzdHJpY3Rpb25zPy5JbnNlcnRhYmxlO1xuXHRcdH0sXG5cdFx0ZXh0cmFjdGlvblBhcmFtZXRlcnNPblBhdGhcblx0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMgPSBmdW5jdGlvbiAoXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGFsbG93ZWRFeHByZXNzaW9uOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdXG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY2hlY2tPblBhdGgoXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0XHQoYW5ub3RhdGlvbk9iamVjdDogTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb24gfCBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMgfCBFbnRpdHlUeXBlQW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdCAmJiBcIkZpbHRlclJlc3RyaWN0aW9uc1wiIGluIGFubm90YXRpb25PYmplY3QpIHtcblx0XHRcdFx0Y29uc3QgZmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uczogRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uVHlwZVR5cGVzW10gPVxuXHRcdFx0XHRcdChhbm5vdGF0aW9uT2JqZWN0Py5GaWx0ZXJSZXN0cmljdGlvbnM/LkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMgYXMgRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uVHlwZVR5cGVzW10pIHx8IFtdO1xuXHRcdFx0XHRjb25zdCBjdXJyZW50T2JqZWN0UmVzdHJpY3Rpb24gPSBmaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zLmZpbmQoKHJlc3RyaWN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIChyZXN0cmljdGlvbi5Qcm9wZXJ0eSBhcyBQcm9wZXJ0eVBhdGgpLiR0YXJnZXQgPT09IGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKGN1cnJlbnRPYmplY3RSZXN0cmljdGlvbikge1xuXHRcdFx0XHRcdHJldHVybiBhbGxvd2VkRXhwcmVzc2lvbi5pbmRleE9mKGN1cnJlbnRPYmplY3RSZXN0cmljdGlvbj8uQWxsb3dlZEV4cHJlc3Npb25zPy50b1N0cmluZygpKSAhPT0gLTE7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNoZWNrT25QYXRoID0gZnVuY3Rpb24gKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgdW5kZWZpbmVkLFxuXHRjaGVja0Z1bmN0aW9uOiBGdW5jdGlvbixcblx0ZXh0cmFjdGlvblBhcmFtZXRlcnNPblBhdGg/OiBFeHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0aWYgKCFkYXRhTW9kZWxPYmplY3RQYXRoIHx8ICFkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0KSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xuXHR9XG5cblx0ZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGRhdGFNb2RlbE9iamVjdFBhdGgsIGV4dHJhY3Rpb25QYXJhbWV0ZXJzT25QYXRoPy5wcm9wZXJ0eVBhdGgpO1xuXG5cdGxldCBjdXJyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgfCBTaW5nbGV0b24gfCBudWxsID0gZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldDtcblx0bGV0IHBhcmVudEVudGl0eVNldDogRW50aXR5U2V0IHwgU2luZ2xldG9uIHwgbnVsbCA9IG51bGw7XG5cdGxldCB2aXNpdGVkTmF2aWdhdGlvblByb3BzTmFtZTogc3RyaW5nW10gPSBbXTtcblx0Y29uc3QgYWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wczogTmF2aWdhdGlvblByb3BlcnR5W10gPSBbXTtcblx0bGV0IHRhcmdldEVudGl0eVNldDogRW50aXR5U2V0IHwgU2luZ2xldG9uIHwgbnVsbCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdGNvbnN0IHRhcmdldEVudGl0eVR5cGU6IEVudGl0eVR5cGUgfCBudWxsID0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlUeXBlO1xuXHRsZXQgcmVzZXRWaXNpdGVkTmF2UHJvcHMgPSBmYWxzZTtcblxuXHRkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2goKG5hdmlnYXRpb25Qcm9wZXJ0eTogTmF2aWdhdGlvblByb3BlcnR5KSA9PiB7XG5cdFx0aWYgKHJlc2V0VmlzaXRlZE5hdlByb3BzKSB7XG5cdFx0XHR2aXNpdGVkTmF2aWdhdGlvblByb3BzTmFtZSA9IFtdO1xuXHRcdH1cblx0XHR2aXNpdGVkTmF2aWdhdGlvblByb3BzTmFtZS5wdXNoKG5hdmlnYXRpb25Qcm9wZXJ0eS5uYW1lKTtcblx0XHRhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzLnB1c2gobmF2aWdhdGlvblByb3BlcnR5KTtcblx0XHRpZiAoIW5hdmlnYXRpb25Qcm9wZXJ0eS5jb250YWluc1RhcmdldCkge1xuXHRcdFx0Ly8gV2Ugc2hvdWxkIGhhdmUgYSBuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIGFzc29jaWF0ZWQgd2l0aCB0aGUgcGF0aCBzbyBmYXIgd2hpY2ggY2FuIGNvbnNpc3Qgb2YgKFtDb250YWlubWVudE5hdlByb3BdLykqW05hdlByb3BdXG5cdFx0XHRjb25zdCBmdWxsTmF2aWdhdGlvblBhdGggPSB2aXNpdGVkTmF2aWdhdGlvblByb3BzTmFtZS5qb2luKFwiL1wiKTtcblx0XHRcdGlmIChjdXJyZW50RW50aXR5U2V0ICYmIGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5oYXNPd25Qcm9wZXJ0eShmdWxsTmF2aWdhdGlvblBhdGgpKSB7XG5cdFx0XHRcdHBhcmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdbZnVsbE5hdmlnYXRpb25QYXRoXTtcblx0XHRcdFx0dGFyZ2V0RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldDtcblx0XHRcdFx0Ly8gSWYgd2UgcmVhY2hlZCBhIG5hdmlnYXRpb24gcHJvcGVydHkgd2l0aCBhIG5hdmlnYXRpb25wcm9wZXJ0eWJpbmRpbmcsIHdlIG5lZWQgdG8gcmVzZXQgdGhlIHZpc2l0ZWQgcGF0aCBvbiB0aGUgbmV4dCBpdGVyYXRpb24gKGlmIHRoZXJlIGlzIG9uZSlcblx0XHRcdFx0cmVzZXRWaXNpdGVkTmF2UHJvcHMgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gV2UgcmVhbGx5IHNob3VsZCBub3QgZW5kIHVwIGhlcmUgYnV0IGF0IGxlYXN0IGxldCdzIHRyeSB0byBhdm9pZCBpbmNvcnJlY3QgYmVoYXZpb3Jcblx0XHRcdFx0cGFyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldDtcblx0XHRcdFx0Y3VycmVudEVudGl0eVNldCA9IG51bGw7XG5cdFx0XHRcdHJlc2V0VmlzaXRlZE5hdlByb3BzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldDtcblx0XHRcdHRhcmdldEVudGl0eVNldCA9IG51bGw7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBBdCB0aGlzIHBvaW50IHdlIGhhdmUgbmF2aWdhdGVkIGRvd24gYWxsIHRoZSBuYXYgcHJvcCBhbmQgd2Ugc2hvdWxkIGhhdmVcblx0Ly8gVGhlIHRhcmdldCBlbnRpdHlTZXQgcG9pbnRpbmcgdG8gZWl0aGVyIG51bGwgKGluIGNhc2Ugb2YgY29udGFpbm1lbnQgbmF2cHJvcCBhIGxhc3QgcGFydCksIG9yIHRoZSBhY3R1YWwgdGFyZ2V0IChub24gY29udGFpbm1lbnQgYXMgdGFyZ2V0KVxuXHQvLyBUaGUgcGFyZW50IGVudGl0eVNldCBwb2ludGluZyB0byB0aGUgcHJldmlvdXMgZW50aXR5U2V0IHVzZWQgaW4gdGhlIHBhdGhcblx0Ly8gVmlzaXRlZE5hdmlnYXRpb25QYXRoIHNob3VsZCBjb250YWluIHRoZSBwYXRoIHVwIHRvIHRoaXMgcHJvcGVydHlcblxuXHQvLyBSZXN0cmljdGlvbnMgc2hvdWxkIHRoZW4gYmUgZXZhbHVhdGVkIGFzIFBhcmVudEVudGl0eVNldC5OYXZSZXN0cmljdGlvbnNbTmF2UHJvcGVydHlQYXRoXSB8fCBUYXJnZXRFbnRpdHlTZXQuUmVzdHJpY3Rpb25zXG5cdGNvbnN0IGZ1bGxOYXZpZ2F0aW9uUGF0aCA9IHZpc2l0ZWROYXZpZ2F0aW9uUHJvcHNOYW1lLmpvaW4oXCIvXCIpO1xuXHRsZXQgcmVzdHJpY3Rpb25zLCB2aXNpdGVkTmF2UHJvcHM7XG5cdGlmIChwYXJlbnRFbnRpdHlTZXQgIT09IG51bGwpIHtcblx0XHRjb25zdCBfcGFyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgPSBwYXJlbnRFbnRpdHlTZXQ7XG5cdFx0X3BhcmVudEVudGl0eVNldC5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zPy5SZXN0cmljdGVkUHJvcGVydGllcy5mb3JFYWNoKFxuXHRcdFx0KHJlc3RyaWN0ZWROYXZQcm9wOiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvblR5cGVzKSA9PiB7XG5cdFx0XHRcdGlmIChyZXN0cmljdGVkTmF2UHJvcC5OYXZpZ2F0aW9uUHJvcGVydHk/LnR5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiKSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdHJpY3Rpb25EZWZpbml0aW9uID0gY2hlY2tGdW5jdGlvbihyZXN0cmljdGVkTmF2UHJvcCk7XG5cdFx0XHRcdFx0aWYgKGZ1bGxOYXZpZ2F0aW9uUGF0aCA9PT0gcmVzdHJpY3RlZE5hdlByb3AuTmF2aWdhdGlvblByb3BlcnR5LnZhbHVlICYmIHJlc3RyaWN0aW9uRGVmaW5pdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBfYWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wcyA9IGFsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHMuc2xpY2UoMCwgLTEpO1xuXHRcdFx0XHRcdFx0dmlzaXRlZE5hdlByb3BzID0gX2FsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHM7XG5cdFx0XHRcdFx0XHRjb25zdCBwYXRoUmVsYXRpdmVMb2NhdGlvbiA9IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGg/LmNvbnRleHRMb2NhdGlvbiwgdmlzaXRlZE5hdlByb3BzKS5tYXAoXG5cdFx0XHRcdFx0XHRcdChucCkgPT4gbnAubmFtZVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGNvbnN0IHBhdGhWaXNpdG9yRnVuY3Rpb24gPSBleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aD8ucGF0aFZpc2l0b3Jcblx0XHRcdFx0XHRcdFx0PyBnZXRQYXRoVmlzaXRvckZvclNpbmdsZXRvbihleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aC5wYXRoVmlzaXRvciwgcGF0aFJlbGF0aXZlTG9jYXRpb24pXG5cdFx0XHRcdFx0XHRcdDogdW5kZWZpbmVkOyAvLyBzZW5kIHBhdGhWaXNpdG9yIGZ1bmN0aW9uIG9ubHkgd2hlbiBpdCBpcyBkZWZpbmVkIGFuZCBvbmx5IHNlbmQgZnVuY3Rpb24gb3IgZGVmaW5lZCBhcyBhIHBhcmFtZXRlclxuXHRcdFx0XHRcdFx0cmVzdHJpY3Rpb25zID0gZXF1YWwoXG5cdFx0XHRcdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihyZXN0cmljdGlvbkRlZmluaXRpb24sIHBhdGhSZWxhdGl2ZUxvY2F0aW9uLCB1bmRlZmluZWQsIHBhdGhWaXNpdG9yRnVuY3Rpb24pLFxuXHRcdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblx0bGV0IHRhcmdldFJlc3RyaWN0aW9ucztcblx0aWYgKCFleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aD8uaWdub3JlVGFyZ2V0Q29sbGVjdGlvbikge1xuXHRcdGxldCByZXN0cmljdGlvbkRlZmluaXRpb24gPSBjaGVja0Z1bmN0aW9uKHRhcmdldEVudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcyk7XG5cdFx0aWYgKHRhcmdldEVudGl0eVNldCA9PT0gbnVsbCAmJiByZXN0cmljdGlvbkRlZmluaXRpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmVzdHJpY3Rpb25EZWZpbml0aW9uID0gY2hlY2tGdW5jdGlvbih0YXJnZXRFbnRpdHlUeXBlPy5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzKTtcblx0XHR9XG5cdFx0aWYgKHJlc3RyaWN0aW9uRGVmaW5pdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBwYXRoUmVsYXRpdmVMb2NhdGlvbiA9IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGguY29udGV4dExvY2F0aW9uLCBhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzKS5tYXAoXG5cdFx0XHRcdChucCkgPT4gbnAubmFtZVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHBhdGhWaXNpdG9yRnVuY3Rpb24gPSBleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aD8ucGF0aFZpc2l0b3Jcblx0XHRcdFx0PyBnZXRQYXRoVmlzaXRvckZvclNpbmdsZXRvbihleHRyYWN0aW9uUGFyYW1ldGVyc09uUGF0aC5wYXRoVmlzaXRvciwgcGF0aFJlbGF0aXZlTG9jYXRpb24pXG5cdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0dGFyZ2V0UmVzdHJpY3Rpb25zID0gZXF1YWwoXG5cdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihyZXN0cmljdGlvbkRlZmluaXRpb24sIHBhdGhSZWxhdGl2ZUxvY2F0aW9uLCB1bmRlZmluZWQsIHBhdGhWaXNpdG9yRnVuY3Rpb24pLFxuXHRcdFx0XHR0cnVlXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiAoXG5cdFx0cmVzdHJpY3Rpb25zIHx8IHRhcmdldFJlc3RyaWN0aW9ucyB8fCAoZXh0cmFjdGlvblBhcmFtZXRlcnNPblBhdGg/LmF1dGhvcml6ZVVucmVzb2x2YWJsZSA/IHVucmVzb2x2ZWFibGVFeHByZXNzaW9uIDogY29uc3RhbnQodHJ1ZSkpXG5cdCk7XG59O1xuLy8gVGhpcyBoZWxwZXIgbWV0aG9kIGlzIHVzZWQgdG8gYWRkIHJlbGF0aXZlIHBhdGggbG9jYXRpb24gYXJndW1lbnQgdG8gc2luZ2xldG9uUGF0aFZpc2l0b3JGdW5jdGlvbiBpLmUuIHBhdGhWaXNpdG9yXG4vLyBwYXRoVmlzaXRvciBtZXRob2QgaXMgdXNlZCBsYXRlciB0byBnZXQgdGhlIGNvcnJlY3QgYmluZGluZ3MgZm9yIHNpbmdsZXRvbiBlbnRpdHlcbi8vIG1ldGhvZCBpcyBpbnZva2VkIGxhdGVyIGluIHBhdGhJbk1vZGVsKCkgbWV0aG9kIHRvIGdldCB0aGUgY29ycmVjdCBiaW5kaW5nLlxuY29uc3QgZ2V0UGF0aFZpc2l0b3JGb3JTaW5nbGV0b24gPSBmdW5jdGlvbiAocGF0aFZpc2l0b3I6IEZ1bmN0aW9uLCBwYXRoUmVsYXRpdmVMb2NhdGlvbjogc3RyaW5nW10pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gcGF0aFZpc2l0b3IocGF0aCwgcGF0aFJlbGF0aXZlTG9jYXRpb24pO1xuXHR9O1xufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0VBd0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNPLElBQU1BLGdCQUFnQixHQUFHLFVBQVVDLFdBQVYsRUFBNEM7SUFDM0UsT0FBT0MsdUJBQXVCLENBQUNELFdBQUQsYUFBQ0EsV0FBRCx1QkFBQ0EsV0FBVyxDQUFFRSxlQUFkLEVBQStCRixXQUEvQixhQUErQkEsV0FBL0IsdUJBQStCQSxXQUFXLENBQUVHLG9CQUE1QyxDQUF2QixDQUF5RkMsR0FBekYsQ0FDTixVQUFDQyxFQUFEO01BQUEsT0FBNEJBLEVBQUUsQ0FBQ0MsSUFBL0I7SUFBQSxDQURNLENBQVA7RUFHQSxDQUpNOzs7O0VBTUEsSUFBTUwsdUJBQXVCLEdBQUcsVUFDdENELFdBRHNDLEVBR2Y7SUFBQSxJQUR2Qk8sZUFDdUIsdUVBRGlCLEVBQ2pCOztJQUN2QixJQUFJLENBQUNQLFdBQUwsRUFBa0I7TUFDakIsT0FBT08sZUFBUDtJQUNBLENBRkQsTUFFTyxJQUFJQSxlQUFlLENBQUNDLE1BQWhCLElBQTBCUixXQUFXLENBQUNHLG9CQUFaLENBQWlDSyxNQUEvRCxFQUF1RTtNQUM3RSxJQUFJQyxpQkFBdUMsR0FBRyxFQUE5QztNQUNBVCxXQUFXLENBQUNHLG9CQUFaLENBQWlDTyxPQUFq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