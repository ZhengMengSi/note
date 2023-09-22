/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/formatters/FPMFormatter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/StableIdHelper"], function (BindingHelper, ConfigurableObject, ID, ManifestSettings, fpmFormatter, BindingToolkit, StableIdHelper) {
  "use strict";

  var _exports = {};
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var isConstant = BindingToolkit.isConstant;
  var ifElse = BindingToolkit.ifElse;
  var greaterOrEqual = BindingToolkit.greaterOrEqual;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var equal = BindingToolkit.equal;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  var ActionType = ManifestSettings.ActionType;
  var getCustomActionID = ID.getCustomActionID;
  var Placement = ConfigurableObject.Placement;
  var bindingContextPathVisitor = BindingHelper.bindingContextPathVisitor;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var ButtonType;

  (function (ButtonType) {
    ButtonType["Accept"] = "Accept";
    ButtonType["Attention"] = "Attention";
    ButtonType["Back"] = "Back";
    ButtonType["Critical"] = "Critical";
    ButtonType["Default"] = "Default";
    ButtonType["Emphasized"] = "Emphasized";
    ButtonType["Ghost"] = "Ghost";
    ButtonType["Negative"] = "Negative";
    ButtonType["Neutral"] = "Neutral";
    ButtonType["Reject"] = "Reject";
    ButtonType["Success"] = "Success";
    ButtonType["Transparent"] = "Transparent";
    ButtonType["Unstyled"] = "Unstyled";
    ButtonType["Up"] = "Up";
  })(ButtonType || (ButtonType = {}));

  _exports.ButtonType = ButtonType;

  /**
   * Maps an action by its key, based on the given annotation actions and manifest configuration. The result already represents the
   * merged action from both configuration sources.
   *
   * This function also returns an indication whether the action can be a menu item, saying whether it is visible or of a specific type
   * that allows this.
   *
   * @param manifestActions Actions defined in the manifest
   * @param annotationActions Actions defined through annotations
   * @param hiddenActions Actions that are configured as hidden (additional to the visible property)
   * @param actionKey Key to look up
   * @returns Merged action and indicator whether it can be a menu item
   */
  function mapActionByKey(manifestActions, annotationActions, hiddenActions, actionKey) {
    var annotationAction = annotationActions.find(function (action) {
      return action.key === actionKey;
    });
    var manifestAction = manifestActions[actionKey];

    var resultAction = _objectSpread({}, annotationAction !== null && annotationAction !== void 0 ? annotationAction : manifestAction); // Annotation action and manifest configuration already has to be merged here as insertCustomElements only considers top-level actions


    if (annotationAction) {
      var _manifestAction$enabl, _manifestAction$visib;

      // If enabled or visible is not set in the manifest, use the annotation value and hence do not overwrite
      resultAction.enabled = (_manifestAction$enabl = manifestAction === null || manifestAction === void 0 ? void 0 : manifestAction.enabled) !== null && _manifestAction$enabl !== void 0 ? _manifestAction$enabl : annotationAction.enabled;
      resultAction.visible = (_manifestAction$visib = manifestAction === null || manifestAction === void 0 ? void 0 : manifestAction.visible) !== null && _manifestAction$visib !== void 0 ? _manifestAction$visib : annotationAction.visible;

      for (var prop in manifestAction || {}) {
        if (!annotationAction[prop] && prop !== "menu") {
          resultAction[prop] = manifestAction[prop];
        }
      }
    }

    var canBeMenuItem = ((resultAction === null || resultAction === void 0 ? void 0 : resultAction.visible) || (resultAction === null || resultAction === void 0 ? void 0 : resultAction.type) === ActionType.DataFieldForAction || (resultAction === null || resultAction === void 0 ? void 0 : resultAction.type) === ActionType.DataFieldForIntentBasedNavigation) && !hiddenActions.find(function (hiddenAction) {
      return hiddenAction.key === (resultAction === null || resultAction === void 0 ? void 0 : resultAction.key);
    });
    return {
      action: resultAction,
      canBeMenuItem: canBeMenuItem
    };
  }
  /**
   * Map the default action key of a menu to its actual action configuration and identify whether this default action is a command.
   *
   * @param menuAction Menu action to map the default action for
   * @param manifestActions Actions defined in the manifest
   * @param annotationActions Actions defined through annotations
   * @param commandActions Array of command actions to push the default action to if applicable
   * @param hiddenActions Actions that are configured as hidden (additional to the visible property)
   */


  function mapMenuDefaultAction(menuAction, manifestActions, annotationActions, commandActions, hiddenActions) {
    var _mapActionByKey = mapActionByKey(manifestActions, annotationActions, hiddenActions, menuAction.defaultAction),
        action = _mapActionByKey.action,
        canBeMenuItem = _mapActionByKey.canBeMenuItem;

    if (canBeMenuItem) {
      menuAction.defaultAction = action;
    }

    if (action.command) {
      commandActions[action.key] = action;
    }
  }
  /**
   * Map the menu item keys of a menu to their actual action configurations and identify whether they are commands.
   *
   * @param menuAction Menu action to map the menu items for
   * @param manifestActions Actions defined in the manifest
   * @param annotationActions Actions defined through annotations
   * @param commandActions Array of command actions to push the menu item actions to if applicable
   * @param hiddenActions Actions that are configured as hidden (additional to the visible property)
   */


  function mapMenuItems(menuAction, manifestActions, annotationActions, commandActions, hiddenActions) {
    var _menuAction$menu;

    var mappedMenuItems = [];

    var _iterator = _createForOfIteratorHelper((_menuAction$menu = menuAction.menu) !== null && _menuAction$menu !== void 0 ? _menuAction$menu : []),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var menuItemKey = _step.value;

        var _mapActionByKey2 = mapActionByKey(manifestActions, annotationActions, hiddenActions, menuItemKey),
            action = _mapActionByKey2.action,
            canBeMenuItem = _mapActionByKey2.canBeMenuItem;

        if (canBeMenuItem) {
          mappedMenuItems.push(action);
        }

        if (action.command) {
          commandActions[menuItemKey] = action;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    menuAction.menu = mappedMenuItems; // If the menu is set to invisible, it should be invisible, otherwise the visibility should be calculated from the items

    var visibleExpressions = mappedMenuItems.map(function (menuItem) {
      return resolveBindingString(menuItem.visible, "boolean");
    });
    menuAction.visible = compileExpression(and(resolveBindingString(menuAction.visible, "boolean"), or.apply(void 0, _toConsumableArray(visibleExpressions))));
  }
  /**
   * Transforms the flat collection of actions into a nested structures of menus. The result is a record of actions that are either menus or
   * ones that do not appear in menus as menu items. It also returns a list of actions that have an assigned command.
   *
   * Note that menu items are already the merged result of annotation actions and their manifest configuration, as {@link insertCustomElements}
   * only considers root-level actions.
   *
   * @param manifestActions Actions defined in the manifest
   * @param annotationActions Actions defined through annotations
   * @param hiddenActions Actions that are configured as hidden (additional to the visible property)
   * @returns The transformed actions from the manifest and a list of command actions
   */


  function transformMenuActionsAndIdentifyCommands(manifestActions, annotationActions, hiddenActions) {
    var allActions = {};
    var actionKeysToDelete = [];
    var commandActions = {};

    for (var actionKey in manifestActions) {
      var manifestAction = manifestActions[actionKey];

      if (manifestAction.defaultAction !== undefined) {
        mapMenuDefaultAction(manifestAction, manifestActions, annotationActions, commandActions, hiddenActions);
      }

      if (manifestAction.type === ActionType.Menu) {
        var _manifestAction$menu;

        // Menu items should not appear as top-level actions themselves
        actionKeysToDelete.push.apply(actionKeysToDelete, _toConsumableArray(manifestAction.menu));
        mapMenuItems(manifestAction, manifestActions, annotationActions, commandActions, hiddenActions); // Menu has no visible items, so remove it

        if (!((_manifestAction$menu = manifestAction.menu) !== null && _manifestAction$menu !== void 0 && _manifestAction$menu.length)) {
          actionKeysToDelete.push(manifestAction.key);
        }
      }

      if (manifestAction.command) {
        commandActions[actionKey] = manifestAction;
      }

      allActions[actionKey] = manifestAction;
    }

    actionKeysToDelete.forEach(function (actionKey) {
      return delete allActions[actionKey];
    });
    return {
      actions: allActions,
      commandActions: commandActions
    };
  }
  /**
   * Gets the binding expression for the enablement of a manifest action.
   *
   * @param manifestAction The action configured in the manifest
   * @param isAnnotationAction Whether the action, defined in manifest, corresponds to an existing annotation action.
   * @param converterContext
   * @returns Determined property value for the enablement
   */


  var _getManifestEnabled = function (manifestAction, isAnnotationAction, converterContext) {
    if (isAnnotationAction && manifestAction.enabled === undefined) {
      // If annotation action has no property defined in manifest,
      // do not overwrite it with manifest action's default value.
      return undefined;
    }

    var result = getManifestActionBooleanPropertyWithFormatter(manifestAction.enabled, converterContext); // Consider requiresSelection property to include selectedContexts in the binding expression

    return compileExpression(ifElse(manifestAction.requiresSelection === true, and(greaterOrEqual(pathInModel("numberOfSelectedContexts", "internal"), 1), result), result));
  };
  /**
   * Gets the binding expression for the visibility of a manifest action.
   *
   * @param manifestAction The action configured in the manifest
   * @param isAnnotationAction Whether the action, defined in manifest, corresponds to an existing annotation action.
   * @param converterContext
   * @returns Determined property value for the visibility
   */


  var _getManifestVisible = function (manifestAction, isAnnotationAction, converterContext) {
    if (isAnnotationAction && manifestAction.visible === undefined) {
      // If annotation action has no property defined in manifest,
      // do not overwrite it with manifest action's default value.
      return undefined;
    }

    var result = getManifestActionBooleanPropertyWithFormatter(manifestAction.visible, converterContext);
    return compileExpression(result);
  };
  /**
   * As some properties should not be overridable by the manifest, make sure that the manifest configuration gets the annotation values for these.
   *
   * @param manifestAction Action defined in the manifest
   * @param annotationAction Action defined through annotations
   */


  function overrideManifestConfigurationWithAnnotation(manifestAction, annotationAction) {
    var _manifestAction$enabl2, _manifestAction$visib2;

    if (!annotationAction) {
      return;
    } // Do not override the 'type' given in an annotation action


    manifestAction.type = annotationAction.type;
    manifestAction.annotationPath = annotationAction.annotationPath;
    manifestAction.press = annotationAction.press; // Only use the annotation values for enablement and visibility if not set in the manifest

    manifestAction.enabled = (_manifestAction$enabl2 = manifestAction.enabled) !== null && _manifestAction$enabl2 !== void 0 ? _manifestAction$enabl2 : annotationAction.enabled;
    manifestAction.visible = (_manifestAction$visib2 = manifestAction.visible) !== null && _manifestAction$visib2 !== void 0 ? _manifestAction$visib2 : annotationAction.visible;
  }
  /**
   * Hide an action if it is a hidden header action.
   *
   * @param action The action to hide
   * @param hiddenActions Actions that are configured as hidden (additional to the visible property)
   */


  function hideActionIfHiddenAction(action, hiddenActions) {
    if (hiddenActions !== null && hiddenActions !== void 0 && hiddenActions.find(function (hiddenAction) {
      return hiddenAction.key === action.key;
    })) {
      action.visible = "false";
    }
  }
  /**
   * Creates the action configuration based on the manifest settings.
   *
   * @param manifestActions The manifest actions
   * @param converterContext The converter context
   * @param annotationActions The annotation actions definition
   * @param navigationSettings The navigation settings
   * @param considerNavigationSettings The navigation settings to be considered
   * @param hiddenActions Actions that are configured as hidden (additional to the visible property)
   * @param facetName The facet where an action is displayed if it is inline
   * @returns The actions from the manifest
   */


  function getActionsFromManifest(manifestActions, converterContext, annotationActions, navigationSettings, considerNavigationSettings, hiddenActions, facetName) {
    var actions = {};

    var _loop = function (actionKey) {
      var _manifestAction$press, _manifestAction$posit, _manifestAction$menu2;

      var manifestAction = manifestActions[actionKey];
      var lastDotIndex = ((_manifestAction$press = manifestAction.press) === null || _manifestAction$press === void 0 ? void 0 : _manifestAction$press.lastIndexOf(".")) || -1;
      var oAnnotationAction = annotationActions === null || annotationActions === void 0 ? void 0 : annotationActions.find(function (obj) {
        return obj.key === actionKey;
      }); // To identify the annotation action property overwrite via manifest use-case.

      var isAnnotationAction = !!oAnnotationAction;

      if (manifestAction.facetName) {
        facetName = manifestAction.facetName;
      }

      actions[actionKey] = {
        id: oAnnotationAction ? actionKey : getCustomActionID(actionKey),
        type: manifestAction.menu ? ActionType.Menu : ActionType.Default,
        visible: _getManifestVisible(manifestAction, isAnnotationAction, converterContext),
        enabled: _getManifestEnabled(manifestAction, isAnnotationAction, converterContext),
        handlerModule: manifestAction.press && manifestAction.press.substring(0, lastDotIndex).replace(/\./gi, "/"),
        handlerMethod: manifestAction.press && manifestAction.press.substring(lastDotIndex + 1),
        press: manifestAction.press,
        text: manifestAction.text,
        noWrap: manifestAction.__noWrap,
        key: replaceSpecialChars(actionKey),
        enableOnSelect: manifestAction.enableOnSelect,
        defaultValuesExtensionFunction: manifestAction.defaultValuesFunction,
        position: {
          anchor: (_manifestAction$posit = manifestAction.position) === null || _manifestAction$posit === void 0 ? void 0 : _manifestAction$posit.anchor,
          placement: manifestAction.position === undefined ? Placement.After : manifestAction.position.placement
        },
        isNavigable: isActionNavigable(manifestAction, navigationSettings, considerNavigationSettings),
        command: manifestAction.command,
        requiresSelection: manifestAction.requiresSelection === undefined ? false : manifestAction.requiresSelection,
        enableAutoScroll: enableAutoScroll(manifestAction),
        menu: (_manifestAction$menu2 = manifestAction.menu) !== null && _manifestAction$menu2 !== void 0 ? _manifestAction$menu2 : [],
        facetName: manifestAction.inline ? facetName : undefined,
        defaultAction: manifestAction.defaultAction
      };
      overrideManifestConfigurationWithAnnotation(actions[actionKey], oAnnotationAction);
      hideActionIfHiddenAction(actions[actionKey], hiddenActions);
    };

    for (var actionKey in manifestActions) {
      _loop(actionKey);
    }

    return transformMenuActionsAndIdentifyCommands(actions, annotationActions !== null && annotationActions !== void 0 ? annotationActions : [], hiddenActions !== null && hiddenActions !== void 0 ? hiddenActions : []);
  }
  /**
   * Gets a binding expression representing a Boolean manifest property that can either be represented by a static value, a binding string,
   * or a runtime formatter function.
   *
   * @param propertyValue String representing the configured property value
   * @param converterContext
   * @returns A binding expression representing the property
   */


  _exports.getActionsFromManifest = getActionsFromManifest;

  function getManifestActionBooleanPropertyWithFormatter(propertyValue, converterContext) {
    var resolvedBinding = resolveBindingString(propertyValue, "boolean");
    var result;

    if (isConstant(resolvedBinding) && resolvedBinding.value === undefined) {
      // No property value configured in manifest for the custom action --> default value is true
      result = true;
    } else if (isConstant(resolvedBinding) && typeof resolvedBinding.value === "boolean") {
      // true / false
      result = resolvedBinding.value;
    } else if (resolvedBinding._type !== "EmbeddedBinding" && resolvedBinding._type !== "EmbeddedExpressionBinding") {
      // Then it's a module-method reference "sap.xxx.yyy.doSomething"
      var methodPath = resolvedBinding.value; // FIXME: The custom "isEnabled" check does not trigger (because none of the bound values changes)

      result = formatResult([pathInModel("/", "$view"), methodPath, pathInModel("selectedContexts", "internal")], fpmFormatter.customBooleanPropertyCheck, converterContext.getEntityType());
    } else {
      // then it's a binding
      result = resolvedBinding;
    }

    return result;
  }

  var removeDuplicateActions = function (actions) {
    var oMenuItemKeys = {};
    actions.forEach(function (action) {
      var _action$menu;

      if (action !== null && action !== void 0 && (_action$menu = action.menu) !== null && _action$menu !== void 0 && _action$menu.length) {
        oMenuItemKeys = action.menu.reduce(function (item, _ref) {
          var key = _ref.key;

          if (key && !item[key]) {
            item[key] = true;
          }

          return item;
        }, oMenuItemKeys);
      }
    });
    return actions.filter(function (action) {
      return !oMenuItemKeys[action.key];
    });
  };
  /**
   * Method to determine the value of the 'enabled' property of an annotation-based action.
   *
   * @param converterContext The instance of the converter context
   * @param actionTarget The instance of the action
   * @returns The binding expression for the 'enabled' property of the action button.
   */


  _exports.removeDuplicateActions = removeDuplicateActions;

  function getEnabledForAnnotationAction(converterContext, actionTarget) {
    var _actionTarget$paramet;

    if ((actionTarget === null || actionTarget === void 0 ? void 0 : actionTarget.isBound) !== true) {
      return "true";
    }

    if (actionTarget !== null && actionTarget !== void 0 && (_actionTarget$paramet = actionTarget.parameters) !== null && _actionTarget$paramet !== void 0 && _actionTarget$paramet.length) {
      var _actionTarget$annotat, _actionTarget$annotat2;

      var bindingParameterFullName = actionTarget === null || actionTarget === void 0 ? void 0 : actionTarget.parameters[0].fullyQualifiedName,
          operationAvailableExpression = getExpressionFromAnnotation(actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat = actionTarget.annotations.Core) === null || _actionTarget$annotat === void 0 ? void 0 : _actionTarget$annotat.OperationAvailable, [], undefined, function (path) {
        return bindingContextPathVisitor(path, converterContext, bindingParameterFullName);
      });

      if ((actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat2 = actionTarget.annotations.Core) === null || _actionTarget$annotat2 === void 0 ? void 0 : _actionTarget$annotat2.OperationAvailable) !== undefined) {
        return compileExpression(equal(operationAvailableExpression, true));
      }
    }

    return "true";
  }

  _exports.getEnabledForAnnotationAction = getEnabledForAnnotationAction;

  function getSemanticObjectMapping(aMappings) {
    var aSemanticObjectMappings = [];
    aMappings.forEach(function (oMapping) {
      var oSOMapping = {
        "LocalProperty": {
          "$PropertyPath": oMapping.LocalProperty.value
        },
        "SemanticObjectProperty": oMapping.SemanticObjectProperty
      };
      aSemanticObjectMappings.push(oSOMapping);
    });
    return aSemanticObjectMappings;
  }

  _exports.getSemanticObjectMapping = getSemanticObjectMapping;

  function isActionNavigable(action, navigationSettings, considerNavigationSettings) {
    var _action$afterExecutio, _action$afterExecutio2;

    var bIsNavigationConfigured = true;

    if (considerNavigationSettings) {
      var detailOrDisplay = navigationSettings && (navigationSettings.detail || navigationSettings.display);
      bIsNavigationConfigured = detailOrDisplay !== null && detailOrDisplay !== void 0 && detailOrDisplay.route ? true : false;
    } // when enableAutoScroll is true the navigateToInstance feature is disabled


    if (action && action.afterExecution && (((_action$afterExecutio = action.afterExecution) === null || _action$afterExecutio === void 0 ? void 0 : _action$afterExecutio.navigateToInstance) === false || ((_action$afterExecutio2 = action.afterExecution) === null || _action$afterExecutio2 === void 0 ? void 0 : _action$afterExecutio2.enableAutoScroll) === true) || !bIsNavigationConfigured) {
      return false;
    }

    return true;
  }

  _exports.isActionNavigable = isActionNavigable;

  function enableAutoScroll(action) {
    var _action$afterExecutio3;

    return (action === null || action === void 0 ? void 0 : (_action$afterExecutio3 = action.afterExecution) === null || _action$afterExecutio3 === void 0 ? void 0 : _action$afterExecutio3.enableAutoScroll) === true;
  }

  _exports.enableAutoScroll = enableAutoScroll;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCdXR0b25UeXBlIiwibWFwQWN0aW9uQnlLZXkiLCJtYW5pZmVzdEFjdGlvbnMiLCJhbm5vdGF0aW9uQWN0aW9ucyIsImhpZGRlbkFjdGlvbnMiLCJhY3Rpb25LZXkiLCJhbm5vdGF0aW9uQWN0aW9uIiwiZmluZCIsImFjdGlvbiIsImtleSIsIm1hbmlmZXN0QWN0aW9uIiwicmVzdWx0QWN0aW9uIiwiZW5hYmxlZCIsInZpc2libGUiLCJwcm9wIiwiY2FuQmVNZW51SXRlbSIsInR5cGUiLCJBY3Rpb25UeXBlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiaGlkZGVuQWN0aW9uIiwibWFwTWVudURlZmF1bHRBY3Rpb24iLCJtZW51QWN0aW9uIiwiY29tbWFuZEFjdGlvbnMiLCJkZWZhdWx0QWN0aW9uIiwiY29tbWFuZCIsIm1hcE1lbnVJdGVtcyIsIm1hcHBlZE1lbnVJdGVtcyIsIm1lbnUiLCJtZW51SXRlbUtleSIsInB1c2giLCJ2aXNpYmxlRXhwcmVzc2lvbnMiLCJtYXAiLCJtZW51SXRlbSIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiY29tcGlsZUV4cHJlc3Npb24iLCJhbmQiLCJvciIsInRyYW5zZm9ybU1lbnVBY3Rpb25zQW5kSWRlbnRpZnlDb21tYW5kcyIsImFsbEFjdGlvbnMiLCJhY3Rpb25LZXlzVG9EZWxldGUiLCJ1bmRlZmluZWQiLCJNZW51IiwibGVuZ3RoIiwiZm9yRWFjaCIsImFjdGlvbnMiLCJfZ2V0TWFuaWZlc3RFbmFibGVkIiwiaXNBbm5vdGF0aW9uQWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsInJlc3VsdCIsImdldE1hbmlmZXN0QWN0aW9uQm9vbGVhblByb3BlcnR5V2l0aEZvcm1hdHRlciIsImlmRWxzZSIsInJlcXVpcmVzU2VsZWN0aW9uIiwiZ3JlYXRlck9yRXF1YWwiLCJwYXRoSW5Nb2RlbCIsIl9nZXRNYW5pZmVzdFZpc2libGUiLCJvdmVycmlkZU1hbmlmZXN0Q29uZmlndXJhdGlvbldpdGhBbm5vdGF0aW9uIiwiYW5ub3RhdGlvblBhdGgiLCJwcmVzcyIsImhpZGVBY3Rpb25JZkhpZGRlbkFjdGlvbiIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJuYXZpZ2F0aW9uU2V0dGluZ3MiLCJjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncyIsImZhY2V0TmFtZSIsImxhc3REb3RJbmRleCIsImxhc3RJbmRleE9mIiwib0Fubm90YXRpb25BY3Rpb24iLCJvYmoiLCJpZCIsImdldEN1c3RvbUFjdGlvbklEIiwiRGVmYXVsdCIsImhhbmRsZXJNb2R1bGUiLCJzdWJzdHJpbmciLCJyZXBsYWNlIiwiaGFuZGxlck1ldGhvZCIsInRleHQiLCJub1dyYXAiLCJfX25vV3JhcCIsInJlcGxhY2VTcGVjaWFsQ2hhcnMiLCJlbmFibGVPblNlbGVjdCIsImRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbiIsImRlZmF1bHRWYWx1ZXNGdW5jdGlvbiIsInBvc2l0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJpc05hdmlnYWJsZSIsImlzQWN0aW9uTmF2aWdhYmxlIiwiZW5hYmxlQXV0b1Njcm9sbCIsImlubGluZSIsInByb3BlcnR5VmFsdWUiLCJyZXNvbHZlZEJpbmRpbmciLCJpc0NvbnN0YW50IiwidmFsdWUiLCJfdHlwZSIsIm1ldGhvZFBhdGgiLCJmb3JtYXRSZXN1bHQiLCJmcG1Gb3JtYXR0ZXIiLCJjdXN0b21Cb29sZWFuUHJvcGVydHlDaGVjayIsImdldEVudGl0eVR5cGUiLCJyZW1vdmVEdXBsaWNhdGVBY3Rpb25zIiwib01lbnVJdGVtS2V5cyIsInJlZHVjZSIsIml0ZW0iLCJmaWx0ZXIiLCJnZXRFbmFibGVkRm9yQW5ub3RhdGlvbkFjdGlvbiIsImFjdGlvblRhcmdldCIsImlzQm91bmQiLCJwYXJhbWV0ZXJzIiwiYmluZGluZ1BhcmFtZXRlckZ1bGxOYW1lIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwib3BlcmF0aW9uQXZhaWxhYmxlRXhwcmVzc2lvbiIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsImFubm90YXRpb25zIiwiQ29yZSIsIk9wZXJhdGlvbkF2YWlsYWJsZSIsInBhdGgiLCJiaW5kaW5nQ29udGV4dFBhdGhWaXNpdG9yIiwiZXF1YWwiLCJnZXRTZW1hbnRpY09iamVjdE1hcHBpbmciLCJhTWFwcGluZ3MiLCJhU2VtYW50aWNPYmplY3RNYXBwaW5ncyIsIm9NYXBwaW5nIiwib1NPTWFwcGluZyIsIkxvY2FsUHJvcGVydHkiLCJTZW1hbnRpY09iamVjdFByb3BlcnR5IiwiYklzTmF2aWdhdGlvbkNvbmZpZ3VyZWQiLCJkZXRhaWxPckRpc3BsYXkiLCJkZXRhaWwiLCJkaXNwbGF5Iiwicm91dGUiLCJhZnRlckV4ZWN1dGlvbiIsIm5hdmlnYXRlVG9JbnN0YW5jZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiQWN0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQWN0aW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBiaW5kaW5nQ29udGV4dFBhdGhWaXNpdG9yIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9CaW5kaW5nSGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IENvbmZpZ3VyYWJsZU9iamVjdCwgQ3VzdG9tRWxlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBQbGFjZW1lbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgZ2V0Q3VzdG9tQWN0aW9uSUQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lEXCI7XG5pbXBvcnQgdHlwZSB7XG5cdEN1c3RvbURlZmluZWRUYWJsZUNvbHVtbkZvck92ZXJyaWRlLFxuXHRNYW5pZmVzdEFjdGlvbixcblx0TmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IGZwbUZvcm1hdHRlciBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9GUE1Gb3JtYXR0ZXJcIjtcbmltcG9ydCB0eXBlIHsgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uLCBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQge1xuXHRhbmQsXG5cdGNvbXBpbGVFeHByZXNzaW9uLFxuXHRlcXVhbCxcblx0Zm9ybWF0UmVzdWx0LFxuXHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24sXG5cdGdyZWF0ZXJPckVxdWFsLFxuXHRpZkVsc2UsXG5cdGlzQ29uc3RhbnQsXG5cdG9yLFxuXHRwYXRoSW5Nb2RlbCxcblx0cmVzb2x2ZUJpbmRpbmdTdHJpbmdcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7IHJlcGxhY2VTcGVjaWFsQ2hhcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IHR5cGUgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vLi4vQ29udmVydGVyQ29udGV4dFwiO1xuXG5leHBvcnQgZW51bSBCdXR0b25UeXBlIHtcblx0QWNjZXB0ID0gXCJBY2NlcHRcIixcblx0QXR0ZW50aW9uID0gXCJBdHRlbnRpb25cIixcblx0QmFjayA9IFwiQmFja1wiLFxuXHRDcml0aWNhbCA9IFwiQ3JpdGljYWxcIixcblx0RGVmYXVsdCA9IFwiRGVmYXVsdFwiLFxuXHRFbXBoYXNpemVkID0gXCJFbXBoYXNpemVkXCIsXG5cdEdob3N0ID0gXCJHaG9zdFwiLFxuXHROZWdhdGl2ZSA9IFwiTmVnYXRpdmVcIixcblx0TmV1dHJhbCA9IFwiTmV1dHJhbFwiLFxuXHRSZWplY3QgPSBcIlJlamVjdFwiLFxuXHRTdWNjZXNzID0gXCJTdWNjZXNzXCIsXG5cdFRyYW5zcGFyZW50ID0gXCJUcmFuc3BhcmVudFwiLFxuXHRVbnN0eWxlZCA9IFwiVW5zdHlsZWRcIixcblx0VXAgPSBcIlVwXCJcbn1cblxuZXhwb3J0IHR5cGUgQmFzZUFjdGlvbiA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0aWQ/OiBzdHJpbmc7XG5cdHRleHQ/OiBzdHJpbmc7XG5cdHR5cGU/OiBBY3Rpb25UeXBlO1xuXHRwcmVzcz86IHN0cmluZztcblx0ZW5hYmxlZD86IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHR2aXNpYmxlPzogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdGVuYWJsZU9uU2VsZWN0Pzogc3RyaW5nO1xuXHRhbm5vdGF0aW9uUGF0aD86IHN0cmluZztcblx0ZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uPzogc3RyaW5nO1xuXHRpc05hdmlnYWJsZT86IGJvb2xlYW47XG5cdGVuYWJsZUF1dG9TY3JvbGw/OiBib29sZWFuO1xuXHRyZXF1aXJlc0RpYWxvZz86IHN0cmluZztcblx0YmluZGluZz86IHN0cmluZztcblx0YnV0dG9uVHlwZT86IEJ1dHRvblR5cGUuR2hvc3QgfCBCdXR0b25UeXBlLlRyYW5zcGFyZW50IHwgc3RyaW5nO1xuXHRwYXJlbnRFbnRpdHlEZWxldGVFbmFibGVkPzogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdG1lbnU/OiAoc3RyaW5nIHwgQ3VzdG9tQWN0aW9uIHwgQmFzZUFjdGlvbilbXTtcblx0ZmFjZXROYW1lPzogc3RyaW5nO1xuXHRjb21tYW5kPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvbkFjdGlvbiA9IEJhc2VBY3Rpb24gJiB7XG5cdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIHwgQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb247XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdGlkPzogc3RyaW5nO1xuXHRjdXN0b21EYXRhPzogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBEZWZpbml0aW9uIGZvciBjdXN0b20gYWN0aW9uc1xuICpcbiAqIEB0eXBlZGVmIEN1c3RvbUFjdGlvblxuICovXG5leHBvcnQgdHlwZSBDdXN0b21BY3Rpb24gPSBDdXN0b21FbGVtZW50PFxuXHRCYXNlQWN0aW9uICYge1xuXHRcdHR5cGU/OiBBY3Rpb25UeXBlO1xuXHRcdGhhbmRsZXJNZXRob2Q/OiBzdHJpbmc7XG5cdFx0aGFuZGxlck1vZHVsZT86IHN0cmluZztcblx0XHRtZW51PzogKHN0cmluZyB8IEN1c3RvbUFjdGlvbiB8IEJhc2VBY3Rpb24pW107XG5cdFx0bm9XcmFwPzogYm9vbGVhbjsgLy8gSW5kaWNhdGVzIHRoYXQgd2Ugd2FudCB0byBhdm9pZCB0aGUgd3JhcHBpbmcgZnJvbSB0aGUgRlBNSGVscGVyXG5cdFx0cmVxdWlyZXNTZWxlY3Rpb24/OiBib29sZWFuO1xuXHRcdGRlZmF1bHRBY3Rpb24/OiBzdHJpbmcgfCBDdXN0b21BY3Rpb24gfCBCYXNlQWN0aW9uOyAvL0luZGljYXRlcyB3aGV0aGVyIGEgZGVmYXVsdCBhY3Rpb24gZXhpc3RzIGluIHRoaXMgY29udGV4dFxuXHR9XG4+O1xuXG4vLyBSZXVzZSBvZiBDb25maWd1cmFibGVPYmplY3QgYW5kIEN1c3RvbUVsZW1lbnQgaXMgZG9uZSBmb3Igb3JkZXJpbmdcbmV4cG9ydCB0eXBlIENvbnZlcnRlckFjdGlvbiA9IEFubm90YXRpb25BY3Rpb24gfCBDdXN0b21BY3Rpb247XG5cbmV4cG9ydCB0eXBlIENvbWJpbmVkQWN0aW9uID0ge1xuXHRhY3Rpb25zOiBCYXNlQWN0aW9uW107XG5cdGNvbW1hbmRBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+O1xufTtcblxuLyoqXG4gKiBNYXBzIGFuIGFjdGlvbiBieSBpdHMga2V5LCBiYXNlZCBvbiB0aGUgZ2l2ZW4gYW5ub3RhdGlvbiBhY3Rpb25zIGFuZCBtYW5pZmVzdCBjb25maWd1cmF0aW9uLiBUaGUgcmVzdWx0IGFscmVhZHkgcmVwcmVzZW50cyB0aGVcbiAqIG1lcmdlZCBhY3Rpb24gZnJvbSBib3RoIGNvbmZpZ3VyYXRpb24gc291cmNlcy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGFsc28gcmV0dXJucyBhbiBpbmRpY2F0aW9uIHdoZXRoZXIgdGhlIGFjdGlvbiBjYW4gYmUgYSBtZW51IGl0ZW0sIHNheWluZyB3aGV0aGVyIGl0IGlzIHZpc2libGUgb3Igb2YgYSBzcGVjaWZpYyB0eXBlXG4gKiB0aGF0IGFsbG93cyB0aGlzLlxuICpcbiAqIEBwYXJhbSBtYW5pZmVzdEFjdGlvbnMgQWN0aW9ucyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIGFubm90YXRpb25BY3Rpb25zIEFjdGlvbnMgZGVmaW5lZCB0aHJvdWdoIGFubm90YXRpb25zXG4gKiBAcGFyYW0gaGlkZGVuQWN0aW9ucyBBY3Rpb25zIHRoYXQgYXJlIGNvbmZpZ3VyZWQgYXMgaGlkZGVuIChhZGRpdGlvbmFsIHRvIHRoZSB2aXNpYmxlIHByb3BlcnR5KVxuICogQHBhcmFtIGFjdGlvbktleSBLZXkgdG8gbG9vayB1cFxuICogQHJldHVybnMgTWVyZ2VkIGFjdGlvbiBhbmQgaW5kaWNhdG9yIHdoZXRoZXIgaXQgY2FuIGJlIGEgbWVudSBpdGVtXG4gKi9cbmZ1bmN0aW9uIG1hcEFjdGlvbkJ5S2V5KFxuXHRtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4sXG5cdGFubm90YXRpb25BY3Rpb25zOiBCYXNlQWN0aW9uW10sXG5cdGhpZGRlbkFjdGlvbnM6IEJhc2VBY3Rpb25bXSxcblx0YWN0aW9uS2V5OiBzdHJpbmdcbikge1xuXHRjb25zdCBhbm5vdGF0aW9uQWN0aW9uOiBCYXNlQWN0aW9uIHwgQ3VzdG9tQWN0aW9uIHwgdW5kZWZpbmVkID0gYW5ub3RhdGlvbkFjdGlvbnMuZmluZChcblx0XHQoYWN0aW9uOiBCYXNlQWN0aW9uKSA9PiBhY3Rpb24ua2V5ID09PSBhY3Rpb25LZXlcblx0KTtcblx0Y29uc3QgbWFuaWZlc3RBY3Rpb24gPSBtYW5pZmVzdEFjdGlvbnNbYWN0aW9uS2V5XTtcblx0Y29uc3QgcmVzdWx0QWN0aW9uID0geyAuLi4oYW5ub3RhdGlvbkFjdGlvbiA/PyBtYW5pZmVzdEFjdGlvbikgfTtcblxuXHQvLyBBbm5vdGF0aW9uIGFjdGlvbiBhbmQgbWFuaWZlc3QgY29uZmlndXJhdGlvbiBhbHJlYWR5IGhhcyB0byBiZSBtZXJnZWQgaGVyZSBhcyBpbnNlcnRDdXN0b21FbGVtZW50cyBvbmx5IGNvbnNpZGVycyB0b3AtbGV2ZWwgYWN0aW9uc1xuXHRpZiAoYW5ub3RhdGlvbkFjdGlvbikge1xuXHRcdC8vIElmIGVuYWJsZWQgb3IgdmlzaWJsZSBpcyBub3Qgc2V0IGluIHRoZSBtYW5pZmVzdCwgdXNlIHRoZSBhbm5vdGF0aW9uIHZhbHVlIGFuZCBoZW5jZSBkbyBub3Qgb3ZlcndyaXRlXG5cdFx0cmVzdWx0QWN0aW9uLmVuYWJsZWQgPSBtYW5pZmVzdEFjdGlvbj8uZW5hYmxlZCA/PyBhbm5vdGF0aW9uQWN0aW9uLmVuYWJsZWQ7XG5cdFx0cmVzdWx0QWN0aW9uLnZpc2libGUgPSBtYW5pZmVzdEFjdGlvbj8udmlzaWJsZSA/PyBhbm5vdGF0aW9uQWN0aW9uLnZpc2libGU7XG5cblx0XHRmb3IgKGNvbnN0IHByb3AgaW4gbWFuaWZlc3RBY3Rpb24gfHwge30pIHtcblx0XHRcdGlmICghKGFubm90YXRpb25BY3Rpb24gYXMgYW55KVtwcm9wXSAmJiBwcm9wICE9PSBcIm1lbnVcIikge1xuXHRcdFx0XHQocmVzdWx0QWN0aW9uIGFzIGFueSlbcHJvcF0gPSAobWFuaWZlc3RBY3Rpb24gYXMgYW55KVtwcm9wXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCBjYW5CZU1lbnVJdGVtID1cblx0XHQocmVzdWx0QWN0aW9uPy52aXNpYmxlIHx8XG5cdFx0XHRyZXN1bHRBY3Rpb24/LnR5cGUgPT09IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uIHx8XG5cdFx0XHRyZXN1bHRBY3Rpb24/LnR5cGUgPT09IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uKSAmJlxuXHRcdCFoaWRkZW5BY3Rpb25zLmZpbmQoKGhpZGRlbkFjdGlvbikgPT4gaGlkZGVuQWN0aW9uLmtleSA9PT0gcmVzdWx0QWN0aW9uPy5rZXkpO1xuXG5cdHJldHVybiB7XG5cdFx0YWN0aW9uOiByZXN1bHRBY3Rpb24sXG5cdFx0Y2FuQmVNZW51SXRlbVxuXHR9O1xufVxuXG4vKipcbiAqIE1hcCB0aGUgZGVmYXVsdCBhY3Rpb24ga2V5IG9mIGEgbWVudSB0byBpdHMgYWN0dWFsIGFjdGlvbiBjb25maWd1cmF0aW9uIGFuZCBpZGVudGlmeSB3aGV0aGVyIHRoaXMgZGVmYXVsdCBhY3Rpb24gaXMgYSBjb21tYW5kLlxuICpcbiAqIEBwYXJhbSBtZW51QWN0aW9uIE1lbnUgYWN0aW9uIHRvIG1hcCB0aGUgZGVmYXVsdCBhY3Rpb24gZm9yXG4gKiBAcGFyYW0gbWFuaWZlc3RBY3Rpb25zIEFjdGlvbnMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3RcbiAqIEBwYXJhbSBhbm5vdGF0aW9uQWN0aW9ucyBBY3Rpb25zIGRlZmluZWQgdGhyb3VnaCBhbm5vdGF0aW9uc1xuICogQHBhcmFtIGNvbW1hbmRBY3Rpb25zIEFycmF5IG9mIGNvbW1hbmQgYWN0aW9ucyB0byBwdXNoIHRoZSBkZWZhdWx0IGFjdGlvbiB0byBpZiBhcHBsaWNhYmxlXG4gKiBAcGFyYW0gaGlkZGVuQWN0aW9ucyBBY3Rpb25zIHRoYXQgYXJlIGNvbmZpZ3VyZWQgYXMgaGlkZGVuIChhZGRpdGlvbmFsIHRvIHRoZSB2aXNpYmxlIHByb3BlcnR5KVxuICovXG5mdW5jdGlvbiBtYXBNZW51RGVmYXVsdEFjdGlvbihcblx0bWVudUFjdGlvbjogQ3VzdG9tQWN0aW9uLFxuXHRtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4sXG5cdGFubm90YXRpb25BY3Rpb25zOiBCYXNlQWN0aW9uW10sXG5cdGNvbW1hbmRBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+LFxuXHRoaWRkZW5BY3Rpb25zOiBCYXNlQWN0aW9uW11cbikge1xuXHRjb25zdCB7IGFjdGlvbiwgY2FuQmVNZW51SXRlbSB9ID0gbWFwQWN0aW9uQnlLZXkobWFuaWZlc3RBY3Rpb25zLCBhbm5vdGF0aW9uQWN0aW9ucywgaGlkZGVuQWN0aW9ucywgbWVudUFjdGlvbi5kZWZhdWx0QWN0aW9uIGFzIHN0cmluZyk7XG5cblx0aWYgKGNhbkJlTWVudUl0ZW0pIHtcblx0XHRtZW51QWN0aW9uLmRlZmF1bHRBY3Rpb24gPSBhY3Rpb247XG5cdH1cblxuXHRpZiAoYWN0aW9uLmNvbW1hbmQpIHtcblx0XHQoY29tbWFuZEFjdGlvbnMgYXMgYW55KVthY3Rpb24ua2V5XSA9IGFjdGlvbjtcblx0fVxufVxuXG4vKipcbiAqIE1hcCB0aGUgbWVudSBpdGVtIGtleXMgb2YgYSBtZW51IHRvIHRoZWlyIGFjdHVhbCBhY3Rpb24gY29uZmlndXJhdGlvbnMgYW5kIGlkZW50aWZ5IHdoZXRoZXIgdGhleSBhcmUgY29tbWFuZHMuXG4gKlxuICogQHBhcmFtIG1lbnVBY3Rpb24gTWVudSBhY3Rpb24gdG8gbWFwIHRoZSBtZW51IGl0ZW1zIGZvclxuICogQHBhcmFtIG1hbmlmZXN0QWN0aW9ucyBBY3Rpb25zIGRlZmluZWQgaW4gdGhlIG1hbmlmZXN0XG4gKiBAcGFyYW0gYW5ub3RhdGlvbkFjdGlvbnMgQWN0aW9ucyBkZWZpbmVkIHRocm91Z2ggYW5ub3RhdGlvbnNcbiAqIEBwYXJhbSBjb21tYW5kQWN0aW9ucyBBcnJheSBvZiBjb21tYW5kIGFjdGlvbnMgdG8gcHVzaCB0aGUgbWVudSBpdGVtIGFjdGlvbnMgdG8gaWYgYXBwbGljYWJsZVxuICogQHBhcmFtIGhpZGRlbkFjdGlvbnMgQWN0aW9ucyB0aGF0IGFyZSBjb25maWd1cmVkIGFzIGhpZGRlbiAoYWRkaXRpb25hbCB0byB0aGUgdmlzaWJsZSBwcm9wZXJ0eSlcbiAqL1xuZnVuY3Rpb24gbWFwTWVudUl0ZW1zKFxuXHRtZW51QWN0aW9uOiBDdXN0b21BY3Rpb24sXG5cdG1hbmlmZXN0QWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPixcblx0YW5ub3RhdGlvbkFjdGlvbnM6IEJhc2VBY3Rpb25bXSxcblx0Y29tbWFuZEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4sXG5cdGhpZGRlbkFjdGlvbnM6IEJhc2VBY3Rpb25bXVxuKSB7XG5cdGNvbnN0IG1hcHBlZE1lbnVJdGVtczogKEN1c3RvbUFjdGlvbiB8IEJhc2VBY3Rpb24pW10gPSBbXTtcblxuXHRmb3IgKGNvbnN0IG1lbnVJdGVtS2V5IG9mIG1lbnVBY3Rpb24ubWVudSA/PyBbXSkge1xuXHRcdGNvbnN0IHsgYWN0aW9uLCBjYW5CZU1lbnVJdGVtIH0gPSBtYXBBY3Rpb25CeUtleShtYW5pZmVzdEFjdGlvbnMsIGFubm90YXRpb25BY3Rpb25zLCBoaWRkZW5BY3Rpb25zLCBtZW51SXRlbUtleSk7XG5cblx0XHRpZiAoY2FuQmVNZW51SXRlbSkge1xuXHRcdFx0bWFwcGVkTWVudUl0ZW1zLnB1c2goYWN0aW9uKTtcblx0XHR9XG5cblx0XHRpZiAoYWN0aW9uLmNvbW1hbmQpIHtcblx0XHRcdChjb21tYW5kQWN0aW9ucyBhcyBhbnkpW21lbnVJdGVtS2V5XSA9IGFjdGlvbjtcblx0XHR9XG5cdH1cblxuXHRtZW51QWN0aW9uLm1lbnUgPSBtYXBwZWRNZW51SXRlbXM7XG5cblx0Ly8gSWYgdGhlIG1lbnUgaXMgc2V0IHRvIGludmlzaWJsZSwgaXQgc2hvdWxkIGJlIGludmlzaWJsZSwgb3RoZXJ3aXNlIHRoZSB2aXNpYmlsaXR5IHNob3VsZCBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGl0ZW1zXG5cdGNvbnN0IHZpc2libGVFeHByZXNzaW9uczogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+W10gPSBtYXBwZWRNZW51SXRlbXMubWFwKChtZW51SXRlbSkgPT5cblx0XHRyZXNvbHZlQmluZGluZ1N0cmluZyhtZW51SXRlbS52aXNpYmxlIGFzIHN0cmluZywgXCJib29sZWFuXCIpXG5cdCk7XG5cdG1lbnVBY3Rpb24udmlzaWJsZSA9IGNvbXBpbGVFeHByZXNzaW9uKGFuZChyZXNvbHZlQmluZGluZ1N0cmluZyhtZW51QWN0aW9uLnZpc2libGUgYXMgc3RyaW5nLCBcImJvb2xlYW5cIiksIG9yKC4uLnZpc2libGVFeHByZXNzaW9ucykpKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBmbGF0IGNvbGxlY3Rpb24gb2YgYWN0aW9ucyBpbnRvIGEgbmVzdGVkIHN0cnVjdHVyZXMgb2YgbWVudXMuIFRoZSByZXN1bHQgaXMgYSByZWNvcmQgb2YgYWN0aW9ucyB0aGF0IGFyZSBlaXRoZXIgbWVudXMgb3JcbiAqIG9uZXMgdGhhdCBkbyBub3QgYXBwZWFyIGluIG1lbnVzIGFzIG1lbnUgaXRlbXMuIEl0IGFsc28gcmV0dXJucyBhIGxpc3Qgb2YgYWN0aW9ucyB0aGF0IGhhdmUgYW4gYXNzaWduZWQgY29tbWFuZC5cbiAqXG4gKiBOb3RlIHRoYXQgbWVudSBpdGVtcyBhcmUgYWxyZWFkeSB0aGUgbWVyZ2VkIHJlc3VsdCBvZiBhbm5vdGF0aW9uIGFjdGlvbnMgYW5kIHRoZWlyIG1hbmlmZXN0IGNvbmZpZ3VyYXRpb24sIGFzIHtAbGluayBpbnNlcnRDdXN0b21FbGVtZW50c31cbiAqIG9ubHkgY29uc2lkZXJzIHJvb3QtbGV2ZWwgYWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gbWFuaWZlc3RBY3Rpb25zIEFjdGlvbnMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3RcbiAqIEBwYXJhbSBhbm5vdGF0aW9uQWN0aW9ucyBBY3Rpb25zIGRlZmluZWQgdGhyb3VnaCBhbm5vdGF0aW9uc1xuICogQHBhcmFtIGhpZGRlbkFjdGlvbnMgQWN0aW9ucyB0aGF0IGFyZSBjb25maWd1cmVkIGFzIGhpZGRlbiAoYWRkaXRpb25hbCB0byB0aGUgdmlzaWJsZSBwcm9wZXJ0eSlcbiAqIEByZXR1cm5zIFRoZSB0cmFuc2Zvcm1lZCBhY3Rpb25zIGZyb20gdGhlIG1hbmlmZXN0IGFuZCBhIGxpc3Qgb2YgY29tbWFuZCBhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybU1lbnVBY3Rpb25zQW5kSWRlbnRpZnlDb21tYW5kcyhcblx0bWFuaWZlc3RBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+LFxuXHRhbm5vdGF0aW9uQWN0aW9uczogQmFzZUFjdGlvbltdLFxuXHRoaWRkZW5BY3Rpb25zOiBCYXNlQWN0aW9uW11cbik6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4+IHtcblx0Y29uc3QgYWxsQWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPiA9IHt9O1xuXHRjb25zdCBhY3Rpb25LZXlzVG9EZWxldGU6IHN0cmluZ1tdID0gW107XG5cdGNvbnN0IGNvbW1hbmRBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+ID0ge307XG5cblx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gbWFuaWZlc3RBY3Rpb25zKSB7XG5cdFx0Y29uc3QgbWFuaWZlc3RBY3Rpb246IEN1c3RvbUFjdGlvbiA9IG1hbmlmZXN0QWN0aW9uc1thY3Rpb25LZXldO1xuXG5cdFx0aWYgKG1hbmlmZXN0QWN0aW9uLmRlZmF1bHRBY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0bWFwTWVudURlZmF1bHRBY3Rpb24obWFuaWZlc3RBY3Rpb24sIG1hbmlmZXN0QWN0aW9ucywgYW5ub3RhdGlvbkFjdGlvbnMsIGNvbW1hbmRBY3Rpb25zLCBoaWRkZW5BY3Rpb25zKTtcblx0XHR9XG5cblx0XHRpZiAobWFuaWZlc3RBY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZS5NZW51KSB7XG5cdFx0XHQvLyBNZW51IGl0ZW1zIHNob3VsZCBub3QgYXBwZWFyIGFzIHRvcC1sZXZlbCBhY3Rpb25zIHRoZW1zZWx2ZXNcblx0XHRcdGFjdGlvbktleXNUb0RlbGV0ZS5wdXNoKC4uLihtYW5pZmVzdEFjdGlvbi5tZW51IGFzIHN0cmluZ1tdKSk7XG5cblx0XHRcdG1hcE1lbnVJdGVtcyhtYW5pZmVzdEFjdGlvbiwgbWFuaWZlc3RBY3Rpb25zLCBhbm5vdGF0aW9uQWN0aW9ucywgY29tbWFuZEFjdGlvbnMsIGhpZGRlbkFjdGlvbnMpO1xuXG5cdFx0XHQvLyBNZW51IGhhcyBubyB2aXNpYmxlIGl0ZW1zLCBzbyByZW1vdmUgaXRcblx0XHRcdGlmICghbWFuaWZlc3RBY3Rpb24ubWVudT8ubGVuZ3RoKSB7XG5cdFx0XHRcdGFjdGlvbktleXNUb0RlbGV0ZS5wdXNoKG1hbmlmZXN0QWN0aW9uLmtleSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKG1hbmlmZXN0QWN0aW9uLmNvbW1hbmQpIHtcblx0XHRcdGNvbW1hbmRBY3Rpb25zW2FjdGlvbktleV0gPSBtYW5pZmVzdEFjdGlvbjtcblx0XHR9XG5cblx0XHRhbGxBY3Rpb25zW2FjdGlvbktleV0gPSBtYW5pZmVzdEFjdGlvbjtcblx0fVxuXG5cdGFjdGlvbktleXNUb0RlbGV0ZS5mb3JFYWNoKChhY3Rpb25LZXk6IHN0cmluZykgPT4gZGVsZXRlIGFsbEFjdGlvbnNbYWN0aW9uS2V5XSk7XG5cblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiBhbGxBY3Rpb25zLFxuXHRcdGNvbW1hbmRBY3Rpb25zOiBjb21tYW5kQWN0aW9uc1xuXHR9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIGVuYWJsZW1lbnQgb2YgYSBtYW5pZmVzdCBhY3Rpb24uXG4gKlxuICogQHBhcmFtIG1hbmlmZXN0QWN0aW9uIFRoZSBhY3Rpb24gY29uZmlndXJlZCBpbiB0aGUgbWFuaWZlc3RcbiAqIEBwYXJhbSBpc0Fubm90YXRpb25BY3Rpb24gV2hldGhlciB0aGUgYWN0aW9uLCBkZWZpbmVkIGluIG1hbmlmZXN0LCBjb3JyZXNwb25kcyB0byBhbiBleGlzdGluZyBhbm5vdGF0aW9uIGFjdGlvbi5cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyBEZXRlcm1pbmVkIHByb3BlcnR5IHZhbHVlIGZvciB0aGUgZW5hYmxlbWVudFxuICovXG5jb25zdCBfZ2V0TWFuaWZlc3RFbmFibGVkID0gZnVuY3Rpb24gKFxuXHRtYW5pZmVzdEFjdGlvbjogTWFuaWZlc3RBY3Rpb24sXG5cdGlzQW5ub3RhdGlvbkFjdGlvbjogYm9vbGVhbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfCB1bmRlZmluZWQge1xuXHRpZiAoaXNBbm5vdGF0aW9uQWN0aW9uICYmIG1hbmlmZXN0QWN0aW9uLmVuYWJsZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdC8vIElmIGFubm90YXRpb24gYWN0aW9uIGhhcyBubyBwcm9wZXJ0eSBkZWZpbmVkIGluIG1hbmlmZXN0LFxuXHRcdC8vIGRvIG5vdCBvdmVyd3JpdGUgaXQgd2l0aCBtYW5pZmVzdCBhY3Rpb24ncyBkZWZhdWx0IHZhbHVlLlxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHRjb25zdCByZXN1bHQgPSBnZXRNYW5pZmVzdEFjdGlvbkJvb2xlYW5Qcm9wZXJ0eVdpdGhGb3JtYXR0ZXIobWFuaWZlc3RBY3Rpb24uZW5hYmxlZCwgY29udmVydGVyQ29udGV4dCk7XG5cblx0Ly8gQ29uc2lkZXIgcmVxdWlyZXNTZWxlY3Rpb24gcHJvcGVydHkgdG8gaW5jbHVkZSBzZWxlY3RlZENvbnRleHRzIGluIHRoZSBiaW5kaW5nIGV4cHJlc3Npb25cblx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdGlmRWxzZShcblx0XHRcdG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uID09PSB0cnVlLFxuXHRcdFx0YW5kKGdyZWF0ZXJPckVxdWFsKHBhdGhJbk1vZGVsKFwibnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzXCIsIFwiaW50ZXJuYWxcIiksIDEpLCByZXN1bHQpLFxuXHRcdFx0cmVzdWx0XG5cdFx0KVxuXHQpO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSB2aXNpYmlsaXR5IG9mIGEgbWFuaWZlc3QgYWN0aW9uLlxuICpcbiAqIEBwYXJhbSBtYW5pZmVzdEFjdGlvbiBUaGUgYWN0aW9uIGNvbmZpZ3VyZWQgaW4gdGhlIG1hbmlmZXN0XG4gKiBAcGFyYW0gaXNBbm5vdGF0aW9uQWN0aW9uIFdoZXRoZXIgdGhlIGFjdGlvbiwgZGVmaW5lZCBpbiBtYW5pZmVzdCwgY29ycmVzcG9uZHMgdG8gYW4gZXhpc3RpbmcgYW5ub3RhdGlvbiBhY3Rpb24uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMgRGV0ZXJtaW5lZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIHZpc2liaWxpdHlcbiAqL1xuY29uc3QgX2dldE1hbmlmZXN0VmlzaWJsZSA9IGZ1bmN0aW9uIChcblx0bWFuaWZlc3RBY3Rpb246IE1hbmlmZXN0QWN0aW9uLFxuXHRpc0Fubm90YXRpb25BY3Rpb246IGJvb2xlYW4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcblx0aWYgKGlzQW5ub3RhdGlvbkFjdGlvbiAmJiBtYW5pZmVzdEFjdGlvbi52aXNpYmxlID09PSB1bmRlZmluZWQpIHtcblx0XHQvLyBJZiBhbm5vdGF0aW9uIGFjdGlvbiBoYXMgbm8gcHJvcGVydHkgZGVmaW5lZCBpbiBtYW5pZmVzdCxcblx0XHQvLyBkbyBub3Qgb3ZlcndyaXRlIGl0IHdpdGggbWFuaWZlc3QgYWN0aW9uJ3MgZGVmYXVsdCB2YWx1ZS5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Y29uc3QgcmVzdWx0ID0gZ2V0TWFuaWZlc3RBY3Rpb25Cb29sZWFuUHJvcGVydHlXaXRoRm9ybWF0dGVyKG1hbmlmZXN0QWN0aW9uLnZpc2libGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24ocmVzdWx0KTtcbn07XG5cbi8qKlxuICogQXMgc29tZSBwcm9wZXJ0aWVzIHNob3VsZCBub3QgYmUgb3ZlcnJpZGFibGUgYnkgdGhlIG1hbmlmZXN0LCBtYWtlIHN1cmUgdGhhdCB0aGUgbWFuaWZlc3QgY29uZmlndXJhdGlvbiBnZXRzIHRoZSBhbm5vdGF0aW9uIHZhbHVlcyBmb3IgdGhlc2UuXG4gKlxuICogQHBhcmFtIG1hbmlmZXN0QWN0aW9uIEFjdGlvbiBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIGFubm90YXRpb25BY3Rpb24gQWN0aW9uIGRlZmluZWQgdGhyb3VnaCBhbm5vdGF0aW9uc1xuICovXG5mdW5jdGlvbiBvdmVycmlkZU1hbmlmZXN0Q29uZmlndXJhdGlvbldpdGhBbm5vdGF0aW9uKG1hbmlmZXN0QWN0aW9uOiBDdXN0b21BY3Rpb24sIGFubm90YXRpb25BY3Rpb24/OiBCYXNlQWN0aW9uKSB7XG5cdGlmICghYW5ub3RhdGlvbkFjdGlvbikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIERvIG5vdCBvdmVycmlkZSB0aGUgJ3R5cGUnIGdpdmVuIGluIGFuIGFubm90YXRpb24gYWN0aW9uXG5cdG1hbmlmZXN0QWN0aW9uLnR5cGUgPSBhbm5vdGF0aW9uQWN0aW9uLnR5cGU7XG5cdG1hbmlmZXN0QWN0aW9uLmFubm90YXRpb25QYXRoID0gYW5ub3RhdGlvbkFjdGlvbi5hbm5vdGF0aW9uUGF0aDtcblx0bWFuaWZlc3RBY3Rpb24ucHJlc3MgPSBhbm5vdGF0aW9uQWN0aW9uLnByZXNzO1xuXG5cdC8vIE9ubHkgdXNlIHRoZSBhbm5vdGF0aW9uIHZhbHVlcyBmb3IgZW5hYmxlbWVudCBhbmQgdmlzaWJpbGl0eSBpZiBub3Qgc2V0IGluIHRoZSBtYW5pZmVzdFxuXHRtYW5pZmVzdEFjdGlvbi5lbmFibGVkID0gbWFuaWZlc3RBY3Rpb24uZW5hYmxlZCA/PyBhbm5vdGF0aW9uQWN0aW9uLmVuYWJsZWQ7XG5cdG1hbmlmZXN0QWN0aW9uLnZpc2libGUgPSBtYW5pZmVzdEFjdGlvbi52aXNpYmxlID8/IGFubm90YXRpb25BY3Rpb24udmlzaWJsZTtcbn1cblxuLyoqXG4gKiBIaWRlIGFuIGFjdGlvbiBpZiBpdCBpcyBhIGhpZGRlbiBoZWFkZXIgYWN0aW9uLlxuICpcbiAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiB0byBoaWRlXG4gKiBAcGFyYW0gaGlkZGVuQWN0aW9ucyBBY3Rpb25zIHRoYXQgYXJlIGNvbmZpZ3VyZWQgYXMgaGlkZGVuIChhZGRpdGlvbmFsIHRvIHRoZSB2aXNpYmxlIHByb3BlcnR5KVxuICovXG5mdW5jdGlvbiBoaWRlQWN0aW9uSWZIaWRkZW5BY3Rpb24oYWN0aW9uOiBDdXN0b21BY3Rpb24sIGhpZGRlbkFjdGlvbnM/OiBCYXNlQWN0aW9uW10pIHtcblx0aWYgKGhpZGRlbkFjdGlvbnM/LmZpbmQoKGhpZGRlbkFjdGlvbikgPT4gaGlkZGVuQWN0aW9uLmtleSA9PT0gYWN0aW9uLmtleSkpIHtcblx0XHRhY3Rpb24udmlzaWJsZSA9IFwiZmFsc2VcIjtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGFjdGlvbiBjb25maWd1cmF0aW9uIGJhc2VkIG9uIHRoZSBtYW5pZmVzdCBzZXR0aW5ncy5cbiAqXG4gKiBAcGFyYW0gbWFuaWZlc3RBY3Rpb25zIFRoZSBtYW5pZmVzdCBhY3Rpb25zXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBhbm5vdGF0aW9uQWN0aW9ucyBUaGUgYW5ub3RhdGlvbiBhY3Rpb25zIGRlZmluaXRpb25cbiAqIEBwYXJhbSBuYXZpZ2F0aW9uU2V0dGluZ3MgVGhlIG5hdmlnYXRpb24gc2V0dGluZ3NcbiAqIEBwYXJhbSBjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncyBUaGUgbmF2aWdhdGlvbiBzZXR0aW5ncyB0byBiZSBjb25zaWRlcmVkXG4gKiBAcGFyYW0gaGlkZGVuQWN0aW9ucyBBY3Rpb25zIHRoYXQgYXJlIGNvbmZpZ3VyZWQgYXMgaGlkZGVuIChhZGRpdGlvbmFsIHRvIHRoZSB2aXNpYmxlIHByb3BlcnR5KVxuICogQHBhcmFtIGZhY2V0TmFtZSBUaGUgZmFjZXQgd2hlcmUgYW4gYWN0aW9uIGlzIGRpc3BsYXllZCBpZiBpdCBpcyBpbmxpbmVcbiAqIEByZXR1cm5zIFRoZSBhY3Rpb25zIGZyb20gdGhlIG1hbmlmZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0QWN0aW9uPiB8IHVuZGVmaW5lZCxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0YW5ub3RhdGlvbkFjdGlvbnM/OiBCYXNlQWN0aW9uW10sXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzPzogYm9vbGVhbixcblx0aGlkZGVuQWN0aW9ucz86IEJhc2VBY3Rpb25bXSxcblx0ZmFjZXROYW1lPzogc3RyaW5nXG4pOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+PiB7XG5cdGNvbnN0IGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4gPSB7fTtcblx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gbWFuaWZlc3RBY3Rpb25zKSB7XG5cdFx0Y29uc3QgbWFuaWZlc3RBY3Rpb246IE1hbmlmZXN0QWN0aW9uID0gbWFuaWZlc3RBY3Rpb25zW2FjdGlvbktleV07XG5cdFx0Y29uc3QgbGFzdERvdEluZGV4ID0gbWFuaWZlc3RBY3Rpb24ucHJlc3M/Lmxhc3RJbmRleE9mKFwiLlwiKSB8fCAtMTtcblx0XHRjb25zdCBvQW5ub3RhdGlvbkFjdGlvbiA9IGFubm90YXRpb25BY3Rpb25zPy5maW5kKChvYmopID0+IG9iai5rZXkgPT09IGFjdGlvbktleSk7XG5cblx0XHQvLyBUbyBpZGVudGlmeSB0aGUgYW5ub3RhdGlvbiBhY3Rpb24gcHJvcGVydHkgb3ZlcndyaXRlIHZpYSBtYW5pZmVzdCB1c2UtY2FzZS5cblx0XHRjb25zdCBpc0Fubm90YXRpb25BY3Rpb24gPSAhIW9Bbm5vdGF0aW9uQWN0aW9uO1xuXHRcdGlmIChtYW5pZmVzdEFjdGlvbi5mYWNldE5hbWUpIHtcblx0XHRcdGZhY2V0TmFtZSA9IG1hbmlmZXN0QWN0aW9uLmZhY2V0TmFtZTtcblx0XHR9XG5cblx0XHRhY3Rpb25zW2FjdGlvbktleV0gPSB7XG5cdFx0XHRpZDogb0Fubm90YXRpb25BY3Rpb24gPyBhY3Rpb25LZXkgOiBnZXRDdXN0b21BY3Rpb25JRChhY3Rpb25LZXkpLFxuXHRcdFx0dHlwZTogbWFuaWZlc3RBY3Rpb24ubWVudSA/IEFjdGlvblR5cGUuTWVudSA6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdHZpc2libGU6IF9nZXRNYW5pZmVzdFZpc2libGUobWFuaWZlc3RBY3Rpb24sIGlzQW5ub3RhdGlvbkFjdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRlbmFibGVkOiBfZ2V0TWFuaWZlc3RFbmFibGVkKG1hbmlmZXN0QWN0aW9uLCBpc0Fubm90YXRpb25BY3Rpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0aGFuZGxlck1vZHVsZTogbWFuaWZlc3RBY3Rpb24ucHJlc3MgJiYgbWFuaWZlc3RBY3Rpb24ucHJlc3Muc3Vic3RyaW5nKDAsIGxhc3REb3RJbmRleCkucmVwbGFjZSgvXFwuL2dpLCBcIi9cIiksXG5cdFx0XHRoYW5kbGVyTWV0aG9kOiBtYW5pZmVzdEFjdGlvbi5wcmVzcyAmJiBtYW5pZmVzdEFjdGlvbi5wcmVzcy5zdWJzdHJpbmcobGFzdERvdEluZGV4ICsgMSksXG5cdFx0XHRwcmVzczogbWFuaWZlc3RBY3Rpb24ucHJlc3MsXG5cdFx0XHR0ZXh0OiBtYW5pZmVzdEFjdGlvbi50ZXh0LFxuXHRcdFx0bm9XcmFwOiBtYW5pZmVzdEFjdGlvbi5fX25vV3JhcCxcblx0XHRcdGtleTogcmVwbGFjZVNwZWNpYWxDaGFycyhhY3Rpb25LZXkpLFxuXHRcdFx0ZW5hYmxlT25TZWxlY3Q6IG1hbmlmZXN0QWN0aW9uLmVuYWJsZU9uU2VsZWN0LFxuXHRcdFx0ZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uOiBtYW5pZmVzdEFjdGlvbi5kZWZhdWx0VmFsdWVzRnVuY3Rpb24sXG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRhbmNob3I6IG1hbmlmZXN0QWN0aW9uLnBvc2l0aW9uPy5hbmNob3IsXG5cdFx0XHRcdHBsYWNlbWVudDogbWFuaWZlc3RBY3Rpb24ucG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IFBsYWNlbWVudC5BZnRlciA6IG1hbmlmZXN0QWN0aW9uLnBvc2l0aW9uLnBsYWNlbWVudFxuXHRcdFx0fSxcblx0XHRcdGlzTmF2aWdhYmxlOiBpc0FjdGlvbk5hdmlnYWJsZShtYW5pZmVzdEFjdGlvbiwgbmF2aWdhdGlvblNldHRpbmdzLCBjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncyksXG5cdFx0XHRjb21tYW5kOiBtYW5pZmVzdEFjdGlvbi5jb21tYW5kLFxuXHRcdFx0cmVxdWlyZXNTZWxlY3Rpb246IG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uLFxuXHRcdFx0ZW5hYmxlQXV0b1Njcm9sbDogZW5hYmxlQXV0b1Njcm9sbChtYW5pZmVzdEFjdGlvbiksXG5cdFx0XHRtZW51OiBtYW5pZmVzdEFjdGlvbi5tZW51ID8/IFtdLFxuXHRcdFx0ZmFjZXROYW1lOiBtYW5pZmVzdEFjdGlvbi5pbmxpbmUgPyBmYWNldE5hbWUgOiB1bmRlZmluZWQsXG5cdFx0XHRkZWZhdWx0QWN0aW9uOiBtYW5pZmVzdEFjdGlvbi5kZWZhdWx0QWN0aW9uXG5cdFx0fTtcblxuXHRcdG92ZXJyaWRlTWFuaWZlc3RDb25maWd1cmF0aW9uV2l0aEFubm90YXRpb24oYWN0aW9uc1thY3Rpb25LZXldLCBvQW5ub3RhdGlvbkFjdGlvbik7XG5cdFx0aGlkZUFjdGlvbklmSGlkZGVuQWN0aW9uKGFjdGlvbnNbYWN0aW9uS2V5XSwgaGlkZGVuQWN0aW9ucyk7XG5cdH1cblxuXHRyZXR1cm4gdHJhbnNmb3JtTWVudUFjdGlvbnNBbmRJZGVudGlmeUNvbW1hbmRzKGFjdGlvbnMsIGFubm90YXRpb25BY3Rpb25zID8/IFtdLCBoaWRkZW5BY3Rpb25zID8/IFtdKTtcbn1cblxuLyoqXG4gKiBHZXRzIGEgYmluZGluZyBleHByZXNzaW9uIHJlcHJlc2VudGluZyBhIEJvb2xlYW4gbWFuaWZlc3QgcHJvcGVydHkgdGhhdCBjYW4gZWl0aGVyIGJlIHJlcHJlc2VudGVkIGJ5IGEgc3RhdGljIHZhbHVlLCBhIGJpbmRpbmcgc3RyaW5nLFxuICogb3IgYSBydW50aW1lIGZvcm1hdHRlciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gcHJvcGVydHlWYWx1ZSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmVkIHByb3BlcnR5IHZhbHVlXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMgQSBiaW5kaW5nIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBwcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBnZXRNYW5pZmVzdEFjdGlvbkJvb2xlYW5Qcm9wZXJ0eVdpdGhGb3JtYXR0ZXIoXG5cdHByb3BlcnR5VmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHwgYm9vbGVhbiB7XG5cdGNvbnN0IHJlc29sdmVkQmluZGluZyA9IHJlc29sdmVCaW5kaW5nU3RyaW5nKHByb3BlcnR5VmFsdWUgYXMgc3RyaW5nLCBcImJvb2xlYW5cIik7XG5cdGxldCByZXN1bHQ6IGFueTtcblx0aWYgKGlzQ29uc3RhbnQocmVzb2x2ZWRCaW5kaW5nKSAmJiByZXNvbHZlZEJpbmRpbmcudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdC8vIE5vIHByb3BlcnR5IHZhbHVlIGNvbmZpZ3VyZWQgaW4gbWFuaWZlc3QgZm9yIHRoZSBjdXN0b20gYWN0aW9uIC0tPiBkZWZhdWx0IHZhbHVlIGlzIHRydWVcblx0XHRyZXN1bHQgPSB0cnVlO1xuXHR9IGVsc2UgaWYgKGlzQ29uc3RhbnQocmVzb2x2ZWRCaW5kaW5nKSAmJiB0eXBlb2YgcmVzb2x2ZWRCaW5kaW5nLnZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdC8vIHRydWUgLyBmYWxzZVxuXHRcdHJlc3VsdCA9IHJlc29sdmVkQmluZGluZy52YWx1ZTtcblx0fSBlbHNlIGlmIChyZXNvbHZlZEJpbmRpbmcuX3R5cGUgIT09IFwiRW1iZWRkZWRCaW5kaW5nXCIgJiYgcmVzb2x2ZWRCaW5kaW5nLl90eXBlICE9PSBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIikge1xuXHRcdC8vIFRoZW4gaXQncyBhIG1vZHVsZS1tZXRob2QgcmVmZXJlbmNlIFwic2FwLnh4eC55eXkuZG9Tb21ldGhpbmdcIlxuXHRcdGNvbnN0IG1ldGhvZFBhdGggPSByZXNvbHZlZEJpbmRpbmcudmFsdWUgYXMgc3RyaW5nO1xuXHRcdC8vIEZJWE1FOiBUaGUgY3VzdG9tIFwiaXNFbmFibGVkXCIgY2hlY2sgZG9lcyBub3QgdHJpZ2dlciAoYmVjYXVzZSBub25lIG9mIHRoZSBib3VuZCB2YWx1ZXMgY2hhbmdlcylcblx0XHRyZXN1bHQgPSBmb3JtYXRSZXN1bHQoXG5cdFx0XHRbcGF0aEluTW9kZWwoXCIvXCIsIFwiJHZpZXdcIiksIG1ldGhvZFBhdGgsIHBhdGhJbk1vZGVsKFwic2VsZWN0ZWRDb250ZXh0c1wiLCBcImludGVybmFsXCIpXSxcblx0XHRcdGZwbUZvcm1hdHRlci5jdXN0b21Cb29sZWFuUHJvcGVydHlDaGVjayBhcyBhbnksXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKVxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gdGhlbiBpdCdzIGEgYmluZGluZ1xuXHRcdHJlc3VsdCA9IHJlc29sdmVkQmluZGluZztcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEdXBsaWNhdGVBY3Rpb25zID0gKGFjdGlvbnM6IEJhc2VBY3Rpb25bXSk6IEJhc2VBY3Rpb25bXSA9PiB7XG5cdGxldCBvTWVudUl0ZW1LZXlzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cdGFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG5cdFx0aWYgKGFjdGlvbj8ubWVudT8ubGVuZ3RoKSB7XG5cdFx0XHRvTWVudUl0ZW1LZXlzID0gYWN0aW9uLm1lbnUucmVkdWNlKChpdGVtLCB7IGtleSB9OiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKGtleSAmJiAhaXRlbVtrZXldKSB7XG5cdFx0XHRcdFx0aXRlbVtrZXldID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH0sIG9NZW51SXRlbUtleXMpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBhY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiAhb01lbnVJdGVtS2V5c1thY3Rpb24ua2V5XSk7XG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSAnZW5hYmxlZCcgcHJvcGVydHkgb2YgYW4gYW5ub3RhdGlvbi1iYXNlZCBhY3Rpb24uXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGFjdGlvblRhcmdldCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGFjdGlvblxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlICdlbmFibGVkJyBwcm9wZXJ0eSBvZiB0aGUgYWN0aW9uIGJ1dHRvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVuYWJsZWRGb3JBbm5vdGF0aW9uQWN0aW9uKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRhY3Rpb25UYXJnZXQ6IEFjdGlvbiB8IHVuZGVmaW5lZFxuKTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24ge1xuXHRpZiAoYWN0aW9uVGFyZ2V0Py5pc0JvdW5kICE9PSB0cnVlKSB7XG5cdFx0cmV0dXJuIFwidHJ1ZVwiO1xuXHR9XG5cdGlmIChhY3Rpb25UYXJnZXQ/LnBhcmFtZXRlcnM/Lmxlbmd0aCkge1xuXHRcdGNvbnN0IGJpbmRpbmdQYXJhbWV0ZXJGdWxsTmFtZSA9IGFjdGlvblRhcmdldD8ucGFyYW1ldGVyc1swXS5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRvcGVyYXRpb25BdmFpbGFibGVFeHByZXNzaW9uID0gZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKFxuXHRcdFx0XHRhY3Rpb25UYXJnZXQ/LmFubm90YXRpb25zLkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSxcblx0XHRcdFx0W10sXG5cdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0KHBhdGg6IHN0cmluZykgPT4gYmluZGluZ0NvbnRleHRQYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBiaW5kaW5nUGFyYW1ldGVyRnVsbE5hbWUpXG5cdFx0XHQpO1xuXHRcdGlmIChhY3Rpb25UYXJnZXQ/LmFubm90YXRpb25zLkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oZXF1YWwob3BlcmF0aW9uQXZhaWxhYmxlRXhwcmVzc2lvbiwgdHJ1ZSkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gXCJ0cnVlXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZW1hbnRpY09iamVjdE1hcHBpbmcoYU1hcHBpbmdzOiBhbnlbXSk6IGFueVtdIHtcblx0Y29uc3QgYVNlbWFudGljT2JqZWN0TWFwcGluZ3M6IGFueVtdID0gW107XG5cdGFNYXBwaW5ncy5mb3JFYWNoKChvTWFwcGluZykgPT4ge1xuXHRcdGNvbnN0IG9TT01hcHBpbmcgPSB7XG5cdFx0XHRcIkxvY2FsUHJvcGVydHlcIjoge1xuXHRcdFx0XHRcIiRQcm9wZXJ0eVBhdGhcIjogb01hcHBpbmcuTG9jYWxQcm9wZXJ0eS52YWx1ZVxuXHRcdFx0fSxcblx0XHRcdFwiU2VtYW50aWNPYmplY3RQcm9wZXJ0eVwiOiBvTWFwcGluZy5TZW1hbnRpY09iamVjdFByb3BlcnR5XG5cdFx0fTtcblx0XHRhU2VtYW50aWNPYmplY3RNYXBwaW5ncy5wdXNoKG9TT01hcHBpbmcpO1xuXHR9KTtcblx0cmV0dXJuIGFTZW1hbnRpY09iamVjdE1hcHBpbmdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBY3Rpb25OYXZpZ2FibGUoXG5cdGFjdGlvbjogTWFuaWZlc3RBY3Rpb24gfCBDdXN0b21EZWZpbmVkVGFibGVDb2x1bW5Gb3JPdmVycmlkZSxcblx0bmF2aWdhdGlvblNldHRpbmdzPzogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0Y29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3M/OiBib29sZWFuXG4pOiBib29sZWFuIHtcblx0bGV0IGJJc05hdmlnYXRpb25Db25maWd1cmVkOiBib29sZWFuID0gdHJ1ZTtcblx0aWYgKGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzKSB7XG5cdFx0Y29uc3QgZGV0YWlsT3JEaXNwbGF5ID0gbmF2aWdhdGlvblNldHRpbmdzICYmIChuYXZpZ2F0aW9uU2V0dGluZ3MuZGV0YWlsIHx8IG5hdmlnYXRpb25TZXR0aW5ncy5kaXNwbGF5KTtcblx0XHRiSXNOYXZpZ2F0aW9uQ29uZmlndXJlZCA9IGRldGFpbE9yRGlzcGxheT8ucm91dGUgPyB0cnVlIDogZmFsc2U7XG5cdH1cblx0Ly8gd2hlbiBlbmFibGVBdXRvU2Nyb2xsIGlzIHRydWUgdGhlIG5hdmlnYXRlVG9JbnN0YW5jZSBmZWF0dXJlIGlzIGRpc2FibGVkXG5cdGlmIChcblx0XHQoYWN0aW9uICYmXG5cdFx0XHRhY3Rpb24uYWZ0ZXJFeGVjdXRpb24gJiZcblx0XHRcdChhY3Rpb24uYWZ0ZXJFeGVjdXRpb24/Lm5hdmlnYXRlVG9JbnN0YW5jZSA9PT0gZmFsc2UgfHwgYWN0aW9uLmFmdGVyRXhlY3V0aW9uPy5lbmFibGVBdXRvU2Nyb2xsID09PSB0cnVlKSkgfHxcblx0XHQhYklzTmF2aWdhdGlvbkNvbmZpZ3VyZWRcblx0KSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlQXV0b1Njcm9sbChhY3Rpb246IE1hbmlmZXN0QWN0aW9uKTogYm9vbGVhbiB7XG5cdHJldHVybiBhY3Rpb24/LmFmdGVyRXhlY3V0aW9uPy5lbmFibGVBdXRvU2Nyb2xsID09PSB0cnVlO1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE2QllBLFU7O2FBQUFBLFU7SUFBQUEsVTtJQUFBQSxVO0lBQUFBLFU7SUFBQUEsVTtJQUFBQSxVO0lBQUFBLFU7SUFBQUEsVTtJQUFBQSxVO0lBQUFBLFU7SUFBQUEsVTtJQUFBQSxVO0lBQUFBLFU7SUFBQUEsVTtJQUFBQSxVO0tBQUFBLFUsS0FBQUEsVTs7OztFQXNFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNBLFNBQVNDLGNBQVQsQ0FDQ0MsZUFERCxFQUVDQyxpQkFGRCxFQUdDQyxhQUhELEVBSUNDLFNBSkQsRUFLRTtJQUNELElBQU1DLGdCQUF1RCxHQUFHSCxpQkFBaUIsQ0FBQ0ksSUFBbEIsQ0FDL0QsVUFBQ0MsTUFBRDtNQUFBLE9BQXdCQSxNQUFNLENBQUNDLEdBQVAsS0FBZUosU0FBdkM7SUFBQSxDQUQrRCxDQUFoRTtJQUdBLElBQU1LLGNBQWMsR0FBR1IsZUFBZSxDQUFDRyxTQUFELENBQXRDOztJQUNBLElBQU1NLFlBQVkscUJBQVNMLGdCQUFULGFBQVNBLGdCQUFULGNBQVNBLGdCQUFULEdBQTZCSSxjQUE3QixDQUFsQixDQUxDLENBT0Q7OztJQUNBLElBQUlKLGdCQUFKLEVBQXNCO01BQUE7O01BQ3JCO01BQ0FLLFlBQVksQ0FBQ0MsT0FBYiw0QkFBdUJGLGNBQXZCLGFBQXVCQSxjQUF2Qix1QkFBdUJBLGNBQWMsQ0FBRUUsT0FBdkMseUVBQWtETixnQkFBZ0IsQ0FBQ00sT0FBbkU7TUFDQUQsWUFBWSxDQUFDRSxPQUFiLDRCQUF1QkgsY0FBdkIsYUFBdUJBLGNBQXZCLHVCQUF1QkEsY0FBYyxDQUFFRyxPQUF2Qyx5RUFBa0RQLGdCQUFnQixDQUFDTyxPQUFuRTs7TUFFQSxLQUFLLElBQU1DLElBQVgsSUFBbUJKLGNBQWMsSUFBSSxFQUFyQyxFQUF5QztRQUN4QyxJQUFJLENBQUVKLGdCQUFELENBQTBCUSxJQUExQixDQUFELElBQW9DQSxJQUFJLEtBQUssTUFBakQsRUFBeUQ7VUFDdkRILFlBQUQsQ0FBc0JHLElBQXRCLElBQStCSixjQUFELENBQXdCSSxJQUF4QixDQUE5QjtRQUNBO01BQ0Q7SUFDRDs7SUFFRCxJQUFNQyxhQUFhLEdBQ2xCLENBQUMsQ0FBQUosWUFBWSxTQUFaLElBQUFBLFlBQVksV0FBWixZQUFBQSxZQUFZLENBQUVFLE9BQWQsS0FDQSxDQUFBRixZQUFZLFNBQVosSUFBQUEsWUFBWSxXQUFaLFlBQUFBLFlBQVksQ0FBRUssSUFBZCxNQUF1QkMsVUFBVSxDQUFDQyxrQkFEbEMsSUFFQSxDQUFBUCxZQUFZLFNBQVosSUFBQUEsWUFBWSxXQUFaLFlBQUFBLFlBQVksQ0FBRUssSUFBZCxNQUF1QkMsVUFBVSxDQUFDRSxpQ0FGbkMsS0FHQSxDQUFDZixhQUFhLENBQUNHLElBQWQsQ0FBbUIsVUFBQ2EsWUFBRDtNQUFBLE9BQWtCQSxZQUFZLENBQUNYLEdBQWIsTUFBcUJFLFlBQXJCLGFBQXFCQSxZQUFyQix1QkFBcUJBLFlBQVksQ0FBRUYsR0FBbkMsQ0FBbEI7SUFBQSxDQUFuQixDQUpGO0lBTUEsT0FBTztNQUNORCxNQUFNLEVBQUVHLFlBREY7TUFFTkksYUFBYSxFQUFiQTtJQUZNLENBQVA7RUFJQTtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0VBQ0EsU0FBU00sb0JBQVQsQ0FDQ0MsVUFERCxFQUVDcEIsZUFGRCxFQUdDQyxpQkFIRCxFQUlDb0IsY0FKRCxFQUtDbkIsYUFMRCxFQU1FO0lBQ0Qsc0JBQWtDSCxjQUFjLENBQUNDLGVBQUQsRUFBa0JDLGlCQUFsQixFQUFxQ0MsYUFBckMsRUFBb0RrQixVQUFVLENBQUNFLGFBQS9ELENBQWhEO0lBQUEsSUFBUWhCLE1BQVIsbUJBQVFBLE1BQVI7SUFBQSxJQUFnQk8sYUFBaEIsbUJBQWdCQSxhQUFoQjs7SUFFQSxJQUFJQSxhQUFKLEVBQW1CO01BQ2xCTyxVQUFVLENBQUNFLGFBQVgsR0FBMkJoQixNQUEzQjtJQUNBOztJQUVELElBQUlBLE1BQU0sQ0FBQ2lCLE9BQVgsRUFBb0I7TUFDbEJGLGNBQUQsQ0FBd0JmLE1BQU0sQ0FBQ0MsR0FBL0IsSUFBc0NELE1BQXRDO0lBQ0E7RUFDRDtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0VBQ0EsU0FBU2tCLFlBQVQsQ0FDQ0osVUFERCxFQUVDcEIsZUFGRCxFQUdDQyxpQkFIRCxFQUlDb0IsY0FKRCxFQUtDbkIsYUFMRCxFQU1FO0lBQUE7O0lBQ0QsSUFBTXVCLGVBQThDLEdBQUcsRUFBdkQ7O0lBREMsK0RBR3lCTCxVQUFVLENBQUNNLElBSHBDLCtEQUc0QyxFQUg1QztJQUFBOztJQUFBO01BR0Qsb0RBQWlEO1FBQUEsSUFBdENDLFdBQXNDOztRQUNoRCx1QkFBa0M1QixjQUFjLENBQUNDLGVBQUQsRUFBa0JDLGlCQUFsQixFQUFxQ0MsYUFBckMsRUFBb0R5QixXQUFwRCxDQUFoRDtRQUFBLElBQVFyQixNQUFSLG9CQUFRQSxNQUFSO1FBQUEsSUFBZ0JPLGFBQWhCLG9CQUFnQkEsYUFBaEI7O1FBRUEsSUFBSUEsYUFBSixFQUFtQjtVQUNsQlksZUFBZSxDQUFDRyxJQUFoQixDQUFxQnRCLE1BQXJCO1FBQ0E7O1FBRUQsSUFBSUEsTUFBTSxDQUFDaUIsT0FBWCxFQUFvQjtVQUNsQkYsY0FBRCxDQUF3Qk0sV0FBeEIsSUFBdUNyQixNQUF2QztRQUNBO01BQ0Q7SUFiQTtNQUFBO0lBQUE7TUFBQTtJQUFBOztJQWVEYyxVQUFVLENBQUNNLElBQVgsR0FBa0JELGVBQWxCLENBZkMsQ0FpQkQ7O0lBQ0EsSUFBTUksa0JBQXVELEdBQUdKLGVBQWUsQ0FBQ0ssR0FBaEIsQ0FBb0IsVUFBQ0MsUUFBRDtNQUFBLE9BQ25GQyxvQkFBb0IsQ0FBQ0QsUUFBUSxDQUFDcEIsT0FBVixFQUE2QixTQUE3QixDQUQrRDtJQUFBLENBQXBCLENBQWhFO0lBR0FTLFVBQVUsQ0FBQ1QsT0FBWCxHQUFxQnNCLGlCQUFpQixDQUFDQyxHQUFHLENBQUNGLG9CQUFvQixDQUFDWixVQUFVLENBQUNULE9BQVosRUFBK0IsU0FBL0IsQ0FBckIsRUFBZ0V3QixFQUFFLE1BQUYsNEJBQU1OLGtCQUFOLEVBQWhFLENBQUosQ0FBdEM7RUFDQTtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0VBQ0EsU0FBU08sdUNBQVQsQ0FDQ3BDLGVBREQsRUFFQ0MsaUJBRkQsRUFHQ0MsYUFIRCxFQUlnRDtJQUMvQyxJQUFNbUMsVUFBd0MsR0FBRyxFQUFqRDtJQUNBLElBQU1DLGtCQUE0QixHQUFHLEVBQXJDO0lBQ0EsSUFBTWpCLGNBQTRDLEdBQUcsRUFBckQ7O0lBRUEsS0FBSyxJQUFNbEIsU0FBWCxJQUF3QkgsZUFBeEIsRUFBeUM7TUFDeEMsSUFBTVEsY0FBNEIsR0FBR1IsZUFBZSxDQUFDRyxTQUFELENBQXBEOztNQUVBLElBQUlLLGNBQWMsQ0FBQ2MsYUFBZixLQUFpQ2lCLFNBQXJDLEVBQWdEO1FBQy9DcEIsb0JBQW9CLENBQUNYLGNBQUQsRUFBaUJSLGVBQWpCLEVBQWtDQyxpQkFBbEMsRUFBcURvQixjQUFyRCxFQUFxRW5CLGFBQXJFLENBQXBCO01BQ0E7O01BRUQsSUFBSU0sY0FBYyxDQUFDTSxJQUFmLEtBQXdCQyxVQUFVLENBQUN5QixJQUF2QyxFQUE2QztRQUFBOztRQUM1QztRQUNBRixrQkFBa0IsQ0FBQ1YsSUFBbkIsT0FBQVUsa0JBQWtCLHFCQUFVOUIsY0FBYyxDQUFDa0IsSUFBekIsRUFBbEI7UUFFQUYsWUFBWSxDQUFDaEIsY0FBRCxFQUFpQlIsZUFBakIsRUFBa0NDLGlCQUFsQyxFQUFxRG9CLGNBQXJELEVBQXFFbkIsYUFBckUsQ0FBWixDQUo0QyxDQU01Qzs7UUFDQSxJQUFJLDBCQUFDTSxjQUFjLENBQUNrQixJQUFoQixpREFBQyxxQkFBcUJlLE1BQXRCLENBQUosRUFBa0M7VUFDakNILGtCQUFrQixDQUFDVixJQUFuQixDQUF3QnBCLGNBQWMsQ0FBQ0QsR0FBdkM7UUFDQTtNQUNEOztNQUVELElBQUlDLGNBQWMsQ0FBQ2UsT0FBbkIsRUFBNEI7UUFDM0JGLGNBQWMsQ0FBQ2xCLFNBQUQsQ0FBZCxHQUE0QkssY0FBNUI7TUFDQTs7TUFFRDZCLFVBQVUsQ0FBQ2xDLFNBQUQsQ0FBVixHQUF3QkssY0FBeEI7SUFDQTs7SUFFRDhCLGtCQUFrQixDQUFDSSxPQUFuQixDQUEyQixVQUFDdkMsU0FBRDtNQUFBLE9BQXVCLE9BQU9rQyxVQUFVLENBQUNsQyxTQUFELENBQXhDO0lBQUEsQ0FBM0I7SUFFQSxPQUFPO01BQ053QyxPQUFPLEVBQUVOLFVBREg7TUFFTmhCLGNBQWMsRUFBRUE7SUFGVixDQUFQO0VBSUE7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7RUFDQSxJQUFNdUIsbUJBQW1CLEdBQUcsVUFDM0JwQyxjQUQyQixFQUUzQnFDLGtCQUYyQixFQUczQkMsZ0JBSDJCLEVBSW9CO0lBQy9DLElBQUlELGtCQUFrQixJQUFJckMsY0FBYyxDQUFDRSxPQUFmLEtBQTJCNkIsU0FBckQsRUFBZ0U7TUFDL0Q7TUFDQTtNQUNBLE9BQU9BLFNBQVA7SUFDQTs7SUFFRCxJQUFNUSxNQUFNLEdBQUdDLDZDQUE2QyxDQUFDeEMsY0FBYyxDQUFDRSxPQUFoQixFQUF5Qm9DLGdCQUF6QixDQUE1RCxDQVArQyxDQVMvQzs7SUFDQSxPQUFPYixpQkFBaUIsQ0FDdkJnQixNQUFNLENBQ0x6QyxjQUFjLENBQUMwQyxpQkFBZixLQUFxQyxJQURoQyxFQUVMaEIsR0FBRyxDQUFDaUIsY0FBYyxDQUFDQyxXQUFXLENBQUMsMEJBQUQsRUFBNkIsVUFBN0IsQ0FBWixFQUFzRCxDQUF0RCxDQUFmLEVBQXlFTCxNQUF6RSxDQUZFLEVBR0xBLE1BSEssQ0FEaUIsQ0FBeEI7RUFPQSxDQXJCRDtFQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7RUFDQSxJQUFNTSxtQkFBbUIsR0FBRyxVQUMzQjdDLGNBRDJCLEVBRTNCcUMsa0JBRjJCLEVBRzNCQyxnQkFIMkIsRUFJb0I7SUFDL0MsSUFBSUQsa0JBQWtCLElBQUlyQyxjQUFjLENBQUNHLE9BQWYsS0FBMkI0QixTQUFyRCxFQUFnRTtNQUMvRDtNQUNBO01BQ0EsT0FBT0EsU0FBUDtJQUNBOztJQUVELElBQU1RLE1BQU0sR0FBR0MsNkNBQTZDLENBQUN4QyxjQUFjLENBQUNHLE9BQWhCLEVBQXlCbUMsZ0JBQXpCLENBQTVEO0lBQ0EsT0FBT2IsaUJBQWlCLENBQUNjLE1BQUQsQ0FBeEI7RUFDQSxDQWJEO0VBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7RUFDQSxTQUFTTywyQ0FBVCxDQUFxRDlDLGNBQXJELEVBQW1GSixnQkFBbkYsRUFBa0g7SUFBQTs7SUFDakgsSUFBSSxDQUFDQSxnQkFBTCxFQUF1QjtNQUN0QjtJQUNBLENBSGdILENBS2pIOzs7SUFDQUksY0FBYyxDQUFDTSxJQUFmLEdBQXNCVixnQkFBZ0IsQ0FBQ1UsSUFBdkM7SUFDQU4sY0FBYyxDQUFDK0MsY0FBZixHQUFnQ25ELGdCQUFnQixDQUFDbUQsY0FBakQ7SUFDQS9DLGNBQWMsQ0FBQ2dELEtBQWYsR0FBdUJwRCxnQkFBZ0IsQ0FBQ29ELEtBQXhDLENBUmlILENBVWpIOztJQUNBaEQsY0FBYyxDQUFDRSxPQUFmLDZCQUF5QkYsY0FBYyxDQUFDRSxPQUF4QywyRUFBbUROLGdCQUFnQixDQUFDTSxPQUFwRTtJQUNBRixjQUFjLENBQUNHLE9BQWYsNkJBQXlCSCxjQUFjLENBQUNHLE9BQXhDLDJFQUFtRFAsZ0JBQWdCLENBQUNPLE9BQXBFO0VBQ0E7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztFQUNBLFNBQVM4Qyx3QkFBVCxDQUFrQ25ELE1BQWxDLEVBQXdESixhQUF4RCxFQUFzRjtJQUNyRixJQUFJQSxhQUFKLGFBQUlBLGFBQUosZUFBSUEsYUFBYSxDQUFFRyxJQUFmLENBQW9CLFVBQUNhLFlBQUQ7TUFBQSxPQUFrQkEsWUFBWSxDQUFDWCxHQUFiLEtBQXFCRCxNQUFNLENBQUNDLEdBQTlDO0lBQUEsQ0FBcEIsQ0FBSixFQUE0RTtNQUMzRUQsTUFBTSxDQUFDSyxPQUFQLEdBQWlCLE9BQWpCO0lBQ0E7RUFDRDtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0VBQ08sU0FBUytDLHNCQUFULENBQ04xRCxlQURNLEVBRU44QyxnQkFGTSxFQUdON0MsaUJBSE0sRUFJTjBELGtCQUpNLEVBS05DLDBCQUxNLEVBTU4xRCxhQU5NLEVBT04yRCxTQVBNLEVBUXlDO0lBQy9DLElBQU1sQixPQUFxQyxHQUFHLEVBQTlDOztJQUQrQyxzQkFFcEN4QyxTQUZvQztNQUFBOztNQUc5QyxJQUFNSyxjQUE4QixHQUFHUixlQUFlLENBQUNHLFNBQUQsQ0FBdEQ7TUFDQSxJQUFNMkQsWUFBWSxHQUFHLDBCQUFBdEQsY0FBYyxDQUFDZ0QsS0FBZixnRkFBc0JPLFdBQXRCLENBQWtDLEdBQWxDLE1BQTBDLENBQUMsQ0FBaEU7TUFDQSxJQUFNQyxpQkFBaUIsR0FBRy9ELGlCQUFILGFBQUdBLGlCQUFILHVCQUFHQSxpQkFBaUIsQ0FBRUksSUFBbkIsQ0FBd0IsVUFBQzRELEdBQUQ7UUFBQSxPQUFTQSxHQUFHLENBQUMxRCxHQUFKLEtBQVlKLFNBQXJCO01BQUEsQ0FBeEIsQ0FBMUIsQ0FMOEMsQ0FPOUM7O01BQ0EsSUFBTTBDLGtCQUFrQixHQUFHLENBQUMsQ0FBQ21CLGlCQUE3Qjs7TUFDQSxJQUFJeEQsY0FBYyxDQUFDcUQsU0FBbkIsRUFBOEI7UUFDN0JBLFNBQVMsR0FBR3JELGNBQWMsQ0FBQ3FELFNBQTNCO01BQ0E7O01BRURsQixPQUFPLENBQUN4QyxTQUFELENBQVAsR0FBcUI7UUFDcEIrRCxFQUFFLEVBQUVGLGlCQUFpQixHQUFHN0QsU0FBSCxHQUFlZ0UsaUJBQWlCLENBQUNoRSxTQUFELENBRGpDO1FBRXBCVyxJQUFJLEVBQUVOLGNBQWMsQ0FBQ2tCLElBQWYsR0FBc0JYLFVBQVUsQ0FBQ3lCLElBQWpDLEdBQXdDekIsVUFBVSxDQUFDcUQsT0FGckM7UUFHcEJ6RCxPQUFPLEVBQUUwQyxtQkFBbUIsQ0FBQzdDLGNBQUQsRUFBaUJxQyxrQkFBakIsRUFBcUNDLGdCQUFyQyxDQUhSO1FBSXBCcEMsT0FBTyxFQUFFa0MsbUJBQW1CLENBQUNwQyxjQUFELEVBQWlCcUMsa0JBQWpCLEVBQXFDQyxnQkFBckMsQ0FKUjtRQUtwQnVCLGFBQWEsRUFBRTdELGNBQWMsQ0FBQ2dELEtBQWYsSUFBd0JoRCxjQUFjLENBQUNnRCxLQUFmLENBQXFCYyxTQUFyQixDQUErQixDQUEvQixFQUFrQ1IsWUFBbEMsRUFBZ0RTLE9BQWhELENBQXdELE1BQXhELEVBQWdFLEdBQWhFLENBTG5CO1FBTXBCQyxhQUFhLEVBQUVoRSxjQUFjLENBQUNnRCxLQUFmLElBQXdCaEQsY0FBYyxDQUFDZ0QsS0FBZixDQUFxQmMsU0FBckIsQ0FBK0JSLFlBQVksR0FBRyxDQUE5QyxDQU5uQjtRQU9wQk4sS0FBSyxFQUFFaEQsY0FBYyxDQUFDZ0QsS0FQRjtRQVFwQmlCLElBQUksRUFBRWpFLGNBQWMsQ0FBQ2lFLElBUkQ7UUFTcEJDLE1BQU0sRUFBRWxFLGNBQWMsQ0FBQ21FLFFBVEg7UUFVcEJwRSxHQUFHLEVBQUVxRSxtQkFBbUIsQ0FBQ3pFLFNBQUQsQ0FWSjtRQVdwQjBFLGNBQWMsRUFBRXJFLGNBQWMsQ0FBQ3FFLGNBWFg7UUFZcEJDLDhCQUE4QixFQUFFdEUsY0FBYyxDQUFDdUUscUJBWjNCO1FBYXBCQyxRQUFRLEVBQUU7VUFDVEMsTUFBTSwyQkFBRXpFLGNBQWMsQ0FBQ3dFLFFBQWpCLDBEQUFFLHNCQUF5QkMsTUFEeEI7VUFFVEMsU0FBUyxFQUFFMUUsY0FBYyxDQUFDd0UsUUFBZixLQUE0QnpDLFNBQTVCLEdBQXdDNEMsU0FBUyxDQUFDQyxLQUFsRCxHQUEwRDVFLGNBQWMsQ0FBQ3dFLFFBQWYsQ0FBd0JFO1FBRnBGLENBYlU7UUFpQnBCRyxXQUFXLEVBQUVDLGlCQUFpQixDQUFDOUUsY0FBRCxFQUFpQm1ELGtCQUFqQixFQUFxQ0MsMEJBQXJDLENBakJWO1FBa0JwQnJDLE9BQU8sRUFBRWYsY0FBYyxDQUFDZSxPQWxCSjtRQW1CcEIyQixpQkFBaUIsRUFBRTFDLGNBQWMsQ0FBQzBDLGlCQUFmLEtBQXFDWCxTQUFyQyxHQUFpRCxLQUFqRCxHQUF5RC9CLGNBQWMsQ0FBQzBDLGlCQW5CdkU7UUFvQnBCcUMsZ0JBQWdCLEVBQUVBLGdCQUFnQixDQUFDL0UsY0FBRCxDQXBCZDtRQXFCcEJrQixJQUFJLDJCQUFFbEIsY0FBYyxDQUFDa0IsSUFBakIseUVBQXlCLEVBckJUO1FBc0JwQm1DLFNBQVMsRUFBRXJELGNBQWMsQ0FBQ2dGLE1BQWYsR0FBd0IzQixTQUF4QixHQUFvQ3RCLFNBdEIzQjtRQXVCcEJqQixhQUFhLEVBQUVkLGNBQWMsQ0FBQ2M7TUF2QlYsQ0FBckI7TUEwQkFnQywyQ0FBMkMsQ0FBQ1gsT0FBTyxDQUFDeEMsU0FBRCxDQUFSLEVBQXFCNkQsaUJBQXJCLENBQTNDO01BQ0FQLHdCQUF3QixDQUFDZCxPQUFPLENBQUN4QyxTQUFELENBQVIsRUFBcUJELGFBQXJCLENBQXhCO0lBeEM4Qzs7SUFFL0MsS0FBSyxJQUFNQyxTQUFYLElBQXdCSCxlQUF4QixFQUF5QztNQUFBLE1BQTlCRyxTQUE4QjtJQXVDeEM7O0lBRUQsT0FBT2lDLHVDQUF1QyxDQUFDTyxPQUFELEVBQVUxQyxpQkFBVixhQUFVQSxpQkFBVixjQUFVQSxpQkFBVixHQUErQixFQUEvQixFQUFtQ0MsYUFBbkMsYUFBbUNBLGFBQW5DLGNBQW1DQSxhQUFuQyxHQUFvRCxFQUFwRCxDQUE5QztFQUNBO0VBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDQSxTQUFTOEMsNkNBQVQsQ0FDQ3lDLGFBREQsRUFFQzNDLGdCQUZELEVBRytDO0lBQzlDLElBQU00QyxlQUFlLEdBQUcxRCxvQkFBb0IsQ0FBQ3lELGFBQUQsRUFBMEIsU0FBMUIsQ0FBNUM7SUFDQSxJQUFJMUMsTUFBSjs7SUFDQSxJQUFJNEMsVUFBVSxDQUFDRCxlQUFELENBQVYsSUFBK0JBLGVBQWUsQ0FBQ0UsS0FBaEIsS0FBMEJyRCxTQUE3RCxFQUF3RTtNQUN2RTtNQUNBUSxNQUFNLEdBQUcsSUFBVDtJQUNBLENBSEQsTUFHTyxJQUFJNEMsVUFBVSxDQUFDRCxlQUFELENBQVYsSUFBK0IsT0FBT0EsZUFBZSxDQUFDRSxLQUF2QixLQUFpQyxTQUFwRSxFQUErRTtNQUNyRjtNQUNBN0MsTUFBTSxHQUFHMkMsZUFBZSxDQUFDRSxLQUF6QjtJQUNBLENBSE0sTUFHQSxJQUFJRixlQUFlLENBQUNHLEtBQWhCLEtBQTBCLGlCQUExQixJQUErQ0gsZUFBZSxDQUFDRyxLQUFoQixLQUEwQiwyQkFBN0UsRUFBMEc7TUFDaEg7TUFDQSxJQUFNQyxVQUFVLEdBQUdKLGVBQWUsQ0FBQ0UsS0FBbkMsQ0FGZ0gsQ0FHaEg7O01BQ0E3QyxNQUFNLEdBQUdnRCxZQUFZLENBQ3BCLENBQUMzQyxXQUFXLENBQUMsR0FBRCxFQUFNLE9BQU4sQ0FBWixFQUE0QjBDLFVBQTVCLEVBQXdDMUMsV0FBVyxDQUFDLGtCQUFELEVBQXFCLFVBQXJCLENBQW5ELENBRG9CLEVBRXBCNEMsWUFBWSxDQUFDQywwQkFGTyxFQUdwQm5ELGdCQUFnQixDQUFDb0QsYUFBakIsRUFIb0IsQ0FBckI7SUFLQSxDQVRNLE1BU0E7TUFDTjtNQUNBbkQsTUFBTSxHQUFHMkMsZUFBVDtJQUNBOztJQUVELE9BQU8zQyxNQUFQO0VBQ0E7O0VBRU0sSUFBTW9ELHNCQUFzQixHQUFHLFVBQUN4RCxPQUFELEVBQXlDO0lBQzlFLElBQUl5RCxhQUFxQyxHQUFHLEVBQTVDO0lBQ0F6RCxPQUFPLENBQUNELE9BQVIsQ0FBZ0IsVUFBQ3BDLE1BQUQsRUFBWTtNQUFBOztNQUMzQixJQUFJQSxNQUFKLGFBQUlBLE1BQUosK0JBQUlBLE1BQU0sQ0FBRW9CLElBQVoseUNBQUksYUFBY2UsTUFBbEIsRUFBMEI7UUFDekIyRCxhQUFhLEdBQUc5RixNQUFNLENBQUNvQixJQUFQLENBQVkyRSxNQUFaLENBQW1CLFVBQUNDLElBQUQsUUFBd0I7VUFBQSxJQUFmL0YsR0FBZSxRQUFmQSxHQUFlOztVQUMxRCxJQUFJQSxHQUFHLElBQUksQ0FBQytGLElBQUksQ0FBQy9GLEdBQUQsQ0FBaEIsRUFBdUI7WUFDdEIrRixJQUFJLENBQUMvRixHQUFELENBQUosR0FBWSxJQUFaO1VBQ0E7O1VBQ0QsT0FBTytGLElBQVA7UUFDQSxDQUxlLEVBS2JGLGFBTGEsQ0FBaEI7TUFNQTtJQUNELENBVEQ7SUFVQSxPQUFPekQsT0FBTyxDQUFDNEQsTUFBUixDQUFlLFVBQUNqRyxNQUFEO01BQUEsT0FBWSxDQUFDOEYsYUFBYSxDQUFDOUYsTUFBTSxDQUFDQyxHQUFSLENBQTFCO0lBQUEsQ0FBZixDQUFQO0VBQ0EsQ0FiTTtFQWVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztFQUNPLFNBQVNpRyw2QkFBVCxDQUNOMUQsZ0JBRE0sRUFFTjJELFlBRk0sRUFHNkI7SUFBQTs7SUFDbkMsSUFBSSxDQUFBQSxZQUFZLFNBQVosSUFBQUEsWUFBWSxXQUFaLFlBQUFBLFlBQVksQ0FBRUMsT0FBZCxNQUEwQixJQUE5QixFQUFvQztNQUNuQyxPQUFPLE1BQVA7SUFDQTs7SUFDRCxJQUFJRCxZQUFKLGFBQUlBLFlBQUosd0NBQUlBLFlBQVksQ0FBRUUsVUFBbEIsa0RBQUksc0JBQTBCbEUsTUFBOUIsRUFBc0M7TUFBQTs7TUFDckMsSUFBTW1FLHdCQUF3QixHQUFHSCxZQUFILGFBQUdBLFlBQUgsdUJBQUdBLFlBQVksQ0FBRUUsVUFBZCxDQUF5QixDQUF6QixFQUE0QkUsa0JBQTdEO01BQUEsSUFDQ0MsNEJBQTRCLEdBQUdDLDJCQUEyQixDQUN6RE4sWUFEeUQsYUFDekRBLFlBRHlELGdEQUN6REEsWUFBWSxDQUFFTyxXQUFkLENBQTBCQyxJQUQrQiwwREFDekQsc0JBQWdDQyxrQkFEeUIsRUFFekQsRUFGeUQsRUFHekQzRSxTQUh5RCxFQUl6RCxVQUFDNEUsSUFBRDtRQUFBLE9BQWtCQyx5QkFBeUIsQ0FBQ0QsSUFBRCxFQUFPckUsZ0JBQVAsRUFBeUI4RCx3QkFBekIsQ0FBM0M7TUFBQSxDQUp5RCxDQUQzRDs7TUFPQSxJQUFJLENBQUFILFlBQVksU0FBWixJQUFBQSxZQUFZLFdBQVosc0NBQUFBLFlBQVksQ0FBRU8sV0FBZCxDQUEwQkMsSUFBMUIsa0ZBQWdDQyxrQkFBaEMsTUFBdUQzRSxTQUEzRCxFQUFzRTtRQUNyRSxPQUFPTixpQkFBaUIsQ0FBQ29GLEtBQUssQ0FBQ1AsNEJBQUQsRUFBK0IsSUFBL0IsQ0FBTixDQUF4QjtNQUNBO0lBQ0Q7O0lBQ0QsT0FBTyxNQUFQO0VBQ0E7Ozs7RUFFTSxTQUFTUSx3QkFBVCxDQUFrQ0MsU0FBbEMsRUFBMkQ7SUFDakUsSUFBTUMsdUJBQThCLEdBQUcsRUFBdkM7SUFDQUQsU0FBUyxDQUFDN0UsT0FBVixDQUFrQixVQUFDK0UsUUFBRCxFQUFjO01BQy9CLElBQU1DLFVBQVUsR0FBRztRQUNsQixpQkFBaUI7VUFDaEIsaUJBQWlCRCxRQUFRLENBQUNFLGFBQVQsQ0FBdUIvQjtRQUR4QixDQURDO1FBSWxCLDBCQUEwQjZCLFFBQVEsQ0FBQ0c7TUFKakIsQ0FBbkI7TUFNQUosdUJBQXVCLENBQUM1RixJQUF4QixDQUE2QjhGLFVBQTdCO0lBQ0EsQ0FSRDtJQVNBLE9BQU9GLHVCQUFQO0VBQ0E7Ozs7RUFFTSxTQUFTbEMsaUJBQVQsQ0FDTmhGLE1BRE0sRUFFTnFELGtCQUZNLEVBR05DLDBCQUhNLEVBSUk7SUFBQTs7SUFDVixJQUFJaUUsdUJBQWdDLEdBQUcsSUFBdkM7O0lBQ0EsSUFBSWpFLDBCQUFKLEVBQWdDO01BQy9CLElBQU1rRSxlQUFlLEdBQUduRSxrQkFBa0IsS0FBS0Esa0JBQWtCLENBQUNvRSxNQUFuQixJQUE2QnBFLGtCQUFrQixDQUFDcUUsT0FBckQsQ0FBMUM7TUFDQUgsdUJBQXVCLEdBQUdDLGVBQWUsU0FBZixJQUFBQSxlQUFlLFdBQWYsSUFBQUEsZUFBZSxDQUFFRyxLQUFqQixHQUF5QixJQUF6QixHQUFnQyxLQUExRDtJQUNBLENBTFMsQ0FNVjs7O0lBQ0EsSUFDRTNILE1BQU0sSUFDTkEsTUFBTSxDQUFDNEgsY0FEUCxLQUVDLDBCQUFBNUgsTUFBTSxDQUFDNEgsY0FBUCxnRkFBdUJDLGtCQUF2QixNQUE4QyxLQUE5QyxJQUF1RCwyQkFBQTdILE1BQU0sQ0FBQzRILGNBQVAsa0ZBQXVCM0MsZ0JBQXZCLE1BQTRDLElBRnBHLENBQUQsSUFHQSxDQUFDc0MsdUJBSkYsRUFLRTtNQUNELE9BQU8sS0FBUDtJQUNBOztJQUNELE9BQU8sSUFBUDtFQUNBOzs7O0VBRU0sU0FBU3RDLGdCQUFULENBQTBCakYsTUFBMUIsRUFBMkQ7SUFBQTs7SUFDakUsT0FBTyxDQUFBQSxNQUFNLFNBQU4sSUFBQUEsTUFBTSxXQUFOLHNDQUFBQSxNQUFNLENBQUU0SCxjQUFSLGtGQUF3QjNDLGdCQUF4QixNQUE2QyxJQUFwRDtFQUNBIn0=