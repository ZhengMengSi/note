/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/Key"], function (Key) {
  "use strict";

  var _exports = {};
  var KeyHelper = Key.KeyHelper;

  var ActionType;

  (function (ActionType) {
    ActionType["Default"] = "Default";
  })(ActionType || (ActionType = {}));

  var getVisibilityEnablementFormMenuActions = function (actions) {
    var menuActionVisible, menuActionVisiblePaths;
    actions.forEach(function (menuActions) {
      var _menuActions$menu;

      menuActionVisible = false;
      menuActionVisiblePaths = [];

      if (menuActions !== null && menuActions !== void 0 && (_menuActions$menu = menuActions.menu) !== null && _menuActions$menu !== void 0 && _menuActions$menu.length) {
        var _menuActions$menu2;

        menuActions === null || menuActions === void 0 ? void 0 : (_menuActions$menu2 = menuActions.menu) === null || _menuActions$menu2 === void 0 ? void 0 : _menuActions$menu2.forEach(function (menuItem) {
          var menuItemVisible = menuItem.visible;

          if (!menuActionVisible) {
            if (menuItemVisible && typeof menuItemVisible === "boolean" || menuItemVisible.valueOf() === "true") {
              menuActionVisible = true;
            } else if (menuItemVisible && menuItemVisible.valueOf() !== "false") {
              menuActionVisiblePaths.push(menuItemVisible.valueOf());
            }
          }
        });

        if (menuActionVisiblePaths.length) {
          menuActions.visible = menuActionVisiblePaths;
        } else {
          menuActions.visible = menuActionVisible.toString();
        }
      }
    });
    return actions;
  };

  _exports.getVisibilityEnablementFormMenuActions = getVisibilityEnablementFormMenuActions;

  var mergeFormActions = function (source, target) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }

    return source;
  };

  _exports.mergeFormActions = mergeFormActions;

  var getFormHiddenActions = function (facetDefinition, converterContext) {
    var _converterContext$get, _converterContext$get2;

    var formActions = getFormActions(facetDefinition, converterContext) || [],
        annotations = converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get = converterContext.getEntityType()) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotations) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.UI;
    var hiddenFormActions = [];

    for (var property in annotations) {
      var _annotations$property, _annotations$property3, _annotations$property4;

      if (((_annotations$property = annotations[property]) === null || _annotations$property === void 0 ? void 0 : _annotations$property.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
        var _annotations$property2;

        (_annotations$property2 = annotations[property]) === null || _annotations$property2 === void 0 ? void 0 : _annotations$property2.Data.forEach(function (dataField) {
          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && formActions.hasOwnProperty("DataFieldForAction::".concat(dataField.Action))) {
            var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::".concat(dataField.Action))) {
            var _dataField$annotation4, _dataField$annotation5, _dataField$annotation6;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.Hidden) === null || _dataField$annotation6 === void 0 ? void 0 : _dataField$annotation6.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          }
        });
      } else if (((_annotations$property3 = annotations[property]) === null || _annotations$property3 === void 0 ? void 0 : _annotations$property3.term) === "com.sap.vocabularies.UI.v1.Identification" || ((_annotations$property4 = annotations[property]) === null || _annotations$property4 === void 0 ? void 0 : _annotations$property4.term) === "@com.sap.vocabularies.UI.v1.StatusInfo") {
        var _annotations$property5;

        (_annotations$property5 = annotations[property]) === null || _annotations$property5 === void 0 ? void 0 : _annotations$property5.forEach(function (dataField) {
          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && formActions.hasOwnProperty("DataFieldForAction::".concat(dataField.Action))) {
            var _dataField$annotation7, _dataField$annotation8, _dataField$annotation9;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation7 = dataField.annotations) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.UI) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.Hidden) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::".concat(dataField.Action))) {
            var _dataField$annotation10, _dataField$annotation11, _dataField$annotation12;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : (_dataField$annotation12 = _dataField$annotation11.Hidden) === null || _dataField$annotation12 === void 0 ? void 0 : _dataField$annotation12.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          }
        });
      }
    }

    return hiddenFormActions;
  };

  _exports.getFormHiddenActions = getFormHiddenActions;

  var getFormActions = function (facetDefinition, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var targetValue, manifestFormContainer;
    var actions = {};

    if ((facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.$Type) === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      if (facetDefinition !== null && facetDefinition !== void 0 && facetDefinition.Facets) {
        facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.Facets.forEach(function (facet) {
          var _facet$Target, _manifestFormContaine;

          targetValue = facet === null || facet === void 0 ? void 0 : (_facet$Target = facet.Target) === null || _facet$Target === void 0 ? void 0 : _facet$Target.value;
          manifestFormContainer = manifestWrapper.getFormContainer(targetValue);

          if ((_manifestFormContaine = manifestFormContainer) !== null && _manifestFormContaine !== void 0 && _manifestFormContaine.actions) {
            var _manifestFormContaine2;

            for (var actionKey in manifestFormContainer.actions) {
              // store the correct facet an action is belonging to for the case it's an inline form action
              manifestFormContainer.actions[actionKey].facetName = facet.fullyQualifiedName;
            }

            actions = mergeFormActions((_manifestFormContaine2 = manifestFormContainer) === null || _manifestFormContaine2 === void 0 ? void 0 : _manifestFormContaine2.actions, actions);
          }
        });
      }
    } else if ((facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.$Type) === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
      var _facetDefinition$Targ, _manifestFormContaine3;

      targetValue = facetDefinition === null || facetDefinition === void 0 ? void 0 : (_facetDefinition$Targ = facetDefinition.Target) === null || _facetDefinition$Targ === void 0 ? void 0 : _facetDefinition$Targ.value;
      manifestFormContainer = manifestWrapper.getFormContainer(targetValue);

      if ((_manifestFormContaine3 = manifestFormContainer) !== null && _manifestFormContaine3 !== void 0 && _manifestFormContaine3.actions) {
        for (var actionKey in manifestFormContainer.actions) {
          // store the correct facet an action is belonging to for the case it's an inline form action
          manifestFormContainer.actions[actionKey].facetName = facetDefinition.fullyQualifiedName;
        }

        actions = manifestFormContainer.actions;
      }
    }

    return actions;
  };

  _exports.getFormActions = getFormActions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBY3Rpb25UeXBlIiwiZ2V0VmlzaWJpbGl0eUVuYWJsZW1lbnRGb3JtTWVudUFjdGlvbnMiLCJhY3Rpb25zIiwibWVudUFjdGlvblZpc2libGUiLCJtZW51QWN0aW9uVmlzaWJsZVBhdGhzIiwiZm9yRWFjaCIsIm1lbnVBY3Rpb25zIiwibWVudSIsImxlbmd0aCIsIm1lbnVJdGVtIiwibWVudUl0ZW1WaXNpYmxlIiwidmlzaWJsZSIsInZhbHVlT2YiLCJwdXNoIiwidG9TdHJpbmciLCJtZXJnZUZvcm1BY3Rpb25zIiwic291cmNlIiwidGFyZ2V0Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJnZXRGb3JtSGlkZGVuQWN0aW9ucyIsImZhY2V0RGVmaW5pdGlvbiIsImNvbnZlcnRlckNvbnRleHQiLCJmb3JtQWN0aW9ucyIsImdldEZvcm1BY3Rpb25zIiwiYW5ub3RhdGlvbnMiLCJnZXRFbnRpdHlUeXBlIiwiVUkiLCJoaWRkZW5Gb3JtQWN0aW9ucyIsInByb3BlcnR5IiwiJFR5cGUiLCJEYXRhIiwiZGF0YUZpZWxkIiwiQWN0aW9uIiwiSGlkZGVuIiwidHlwZSIsIkRlZmF1bHQiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJ0ZXJtIiwibWFuaWZlc3RXcmFwcGVyIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwidGFyZ2V0VmFsdWUiLCJtYW5pZmVzdEZvcm1Db250YWluZXIiLCJGYWNldHMiLCJmYWNldCIsIlRhcmdldCIsInZhbHVlIiwiZ2V0Rm9ybUNvbnRhaW5lciIsImFjdGlvbktleSIsImZhY2V0TmFtZSIsImZ1bGx5UXVhbGlmaWVkTmFtZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRm9ybU1lbnVBY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRmFjZXRUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB0eXBlIHsgQmFzZUFjdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB0eXBlIHsgQ29uZmlndXJhYmxlUmVjb3JkLCBQb3NpdGlvbmFibGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB0eXBlIHsgTWFuaWZlc3RBY3Rpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgdHlwZSBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCIuLi9Db252ZXJ0ZXJDb250ZXh0XCI7XG5cbmVudW0gQWN0aW9uVHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIlxufVxudHlwZSBGb3JtTWFuaWZlc3RDb25maWd1cmF0aW9uID0ge1xuXHRmaWVsZHM6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEZvcm1FbGVtZW50Pjtcblx0YWN0aW9ucz86IENvbmZpZ3VyYWJsZVJlY29yZDxCYXNlQWN0aW9uPjtcbn07XG50eXBlIE1hbmlmZXN0Rm9ybUVsZW1lbnQgPSBQb3NpdGlvbmFibGUgJiB7XG5cdHRlbXBsYXRlOiBzdHJpbmc7XG5cdGxhYmVsPzogc3RyaW5nO1xufTtcbnR5cGUgRm9ybU1lbnVBY3Rpb24gPVxuXHR8IEJhc2VBY3Rpb25cblx0fCB7XG5cdFx0XHR2aXNpYmxlPzogc3RyaW5nW107XG5cdFx0XHRlbmFibGVkPzogc3RyaW5nW107XG5cdFx0XHRtZW51PzogKHN0cmluZyB8IEJhc2VBY3Rpb24pW107XG5cdCAgfTtcblxuZXhwb3J0IGNvbnN0IGdldFZpc2liaWxpdHlFbmFibGVtZW50Rm9ybU1lbnVBY3Rpb25zID0gKGFjdGlvbnM6IEJhc2VBY3Rpb25bXSk6IEJhc2VBY3Rpb25bXSA9PiB7XG5cdGxldCBtZW51QWN0aW9uVmlzaWJsZTogc3RyaW5nIHwgYm9vbGVhbiwgbWVudUFjdGlvblZpc2libGVQYXRoczogc3RyaW5nW107XG5cdGFjdGlvbnMuZm9yRWFjaCgobWVudUFjdGlvbnM6IEZvcm1NZW51QWN0aW9uKSA9PiB7XG5cdFx0bWVudUFjdGlvblZpc2libGUgPSBmYWxzZTtcblx0XHRtZW51QWN0aW9uVmlzaWJsZVBhdGhzID0gW107XG5cdFx0aWYgKG1lbnVBY3Rpb25zPy5tZW51Py5sZW5ndGgpIHtcblx0XHRcdG1lbnVBY3Rpb25zPy5tZW51Py5mb3JFYWNoKChtZW51SXRlbTogYW55KSA9PiB7XG5cdFx0XHRcdGNvbnN0IG1lbnVJdGVtVmlzaWJsZSA9IG1lbnVJdGVtLnZpc2libGU7XG5cdFx0XHRcdGlmICghbWVudUFjdGlvblZpc2libGUpIHtcblx0XHRcdFx0XHRpZiAoKG1lbnVJdGVtVmlzaWJsZSAmJiB0eXBlb2YgbWVudUl0ZW1WaXNpYmxlID09PSBcImJvb2xlYW5cIikgfHwgbWVudUl0ZW1WaXNpYmxlLnZhbHVlT2YoKSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRcdG1lbnVBY3Rpb25WaXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG1lbnVJdGVtVmlzaWJsZSAmJiBtZW51SXRlbVZpc2libGUudmFsdWVPZigpICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdFx0XHRcdG1lbnVBY3Rpb25WaXNpYmxlUGF0aHMucHVzaChtZW51SXRlbVZpc2libGUudmFsdWVPZigpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKG1lbnVBY3Rpb25WaXNpYmxlUGF0aHMubGVuZ3RoKSB7XG5cdFx0XHRcdG1lbnVBY3Rpb25zLnZpc2libGUgPSBtZW51QWN0aW9uVmlzaWJsZVBhdGhzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVudUFjdGlvbnMudmlzaWJsZSA9IG1lbnVBY3Rpb25WaXNpYmxlLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGFjdGlvbnM7XG59O1xuXG5leHBvcnQgY29uc3QgbWVyZ2VGb3JtQWN0aW9ucyA9IChcblx0c291cmNlOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+LFxuXHR0YXJnZXQ6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj5cbik6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj4gPT4ge1xuXHRmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcblx0XHRpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzb3VyY2U7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rm9ybUhpZGRlbkFjdGlvbnMgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdID0+IHtcblx0Y29uc3QgZm9ybUFjdGlvbnM6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj4gPSBnZXRGb3JtQWN0aW9ucyhmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpIHx8IFtdLFxuXHRcdGFubm90YXRpb25zOiBhbnkgPSBjb252ZXJ0ZXJDb250ZXh0Py5nZXRFbnRpdHlUeXBlKCk/LmFubm90YXRpb25zPy5VSTtcblx0Y29uc3QgaGlkZGVuRm9ybUFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRmb3IgKGNvbnN0IHByb3BlcnR5IGluIGFubm90YXRpb25zKSB7XG5cdFx0aWYgKGFubm90YXRpb25zW3Byb3BlcnR5XT8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFR5cGVcIikge1xuXHRcdFx0YW5ub3RhdGlvbnNbcHJvcGVydHldPy5EYXRhLmZvckVhY2goKGRhdGFGaWVsZDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIgJiZcblx0XHRcdFx0XHRmb3JtQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShgRGF0YUZpZWxkRm9yQWN0aW9uOjoke2RhdGFGaWVsZC5BY3Rpb259YClcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0aGlkZGVuRm9ybUFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCIgJiZcblx0XHRcdFx0XHRmb3JtQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOjoke2RhdGFGaWVsZC5BY3Rpb259YClcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0aGlkZGVuRm9ybUFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdGFubm90YXRpb25zW3Byb3BlcnR5XT8udGVybSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiIHx8XG5cdFx0XHRhbm5vdGF0aW9uc1twcm9wZXJ0eV0/LnRlcm0gPT09IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlN0YXR1c0luZm9cIlxuXHRcdCkge1xuXHRcdFx0YW5ub3RhdGlvbnNbcHJvcGVydHldPy5mb3JFYWNoKChkYXRhRmllbGQ6IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiICYmXG5cdFx0XHRcdFx0Zm9ybUFjdGlvbnMuaGFzT3duUHJvcGVydHkoYERhdGFGaWVsZEZvckFjdGlvbjo6JHtkYXRhRmllbGQuQWN0aW9ufWApXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChkYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGhpZGRlbkZvcm1BY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRlZmF1bHQsXG5cdFx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiICYmXG5cdFx0XHRcdFx0Zm9ybUFjdGlvbnMuaGFzT3duUHJvcGVydHkoYERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjo6JHtkYXRhRmllbGQuQWN0aW9ufWApXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChkYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGhpZGRlbkZvcm1BY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRlZmF1bHQsXG5cdFx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaGlkZGVuRm9ybUFjdGlvbnM7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rm9ybUFjdGlvbnMgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0QWN0aW9uPiA9PiB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGxldCB0YXJnZXRWYWx1ZTogc3RyaW5nLCBtYW5pZmVzdEZvcm1Db250YWluZXI6IEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb247XG5cdGxldCBhY3Rpb25zOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0ge307XG5cdGlmIChmYWNldERlZmluaXRpb24/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNvbGxlY3Rpb25GYWNldFwiKSB7XG5cdFx0aWYgKGZhY2V0RGVmaW5pdGlvbj8uRmFjZXRzKSB7XG5cdFx0XHRmYWNldERlZmluaXRpb24/LkZhY2V0cy5mb3JFYWNoKChmYWNldDogYW55KSA9PiB7XG5cdFx0XHRcdHRhcmdldFZhbHVlID0gZmFjZXQ/LlRhcmdldD8udmFsdWU7XG5cdFx0XHRcdG1hbmlmZXN0Rm9ybUNvbnRhaW5lciA9IG1hbmlmZXN0V3JhcHBlci5nZXRGb3JtQ29udGFpbmVyKHRhcmdldFZhbHVlKTtcblx0XHRcdFx0aWYgKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uYWN0aW9ucykge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgYWN0aW9uS2V5IGluIG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5hY3Rpb25zKSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSB0aGUgY29ycmVjdCBmYWNldCBhbiBhY3Rpb24gaXMgYmVsb25naW5nIHRvIGZvciB0aGUgY2FzZSBpdCdzIGFuIGlubGluZSBmb3JtIGFjdGlvblxuXHRcdFx0XHRcdFx0bWFuaWZlc3RGb3JtQ29udGFpbmVyLmFjdGlvbnNbYWN0aW9uS2V5XS5mYWNldE5hbWUgPSBmYWNldC5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFjdGlvbnMgPSBtZXJnZUZvcm1BY3Rpb25zKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uYWN0aW9ucyBhcyBhbnksIGFjdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoZmFjZXREZWZpbml0aW9uPy4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWZlcmVuY2VGYWNldFwiKSB7XG5cdFx0dGFyZ2V0VmFsdWUgPSBmYWNldERlZmluaXRpb24/LlRhcmdldD8udmFsdWU7XG5cdFx0bWFuaWZlc3RGb3JtQ29udGFpbmVyID0gbWFuaWZlc3RXcmFwcGVyLmdldEZvcm1Db250YWluZXIodGFyZ2V0VmFsdWUpO1xuXHRcdGlmIChtYW5pZmVzdEZvcm1Db250YWluZXI/LmFjdGlvbnMpIHtcblx0XHRcdGZvciAoY29uc3QgYWN0aW9uS2V5IGluIG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5hY3Rpb25zKSB7XG5cdFx0XHRcdC8vIHN0b3JlIHRoZSBjb3JyZWN0IGZhY2V0IGFuIGFjdGlvbiBpcyBiZWxvbmdpbmcgdG8gZm9yIHRoZSBjYXNlIGl0J3MgYW4gaW5saW5lIGZvcm0gYWN0aW9uXG5cdFx0XHRcdG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5hY3Rpb25zW2FjdGlvbktleV0uZmFjZXROYW1lID0gZmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdH1cblx0XHRcdGFjdGlvbnMgPSBtYW5pZmVzdEZvcm1Db250YWluZXIuYWN0aW9ucyBhcyBhbnk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBhY3Rpb25zO1xufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7OztNQU9LQSxVOzthQUFBQSxVO0lBQUFBLFU7S0FBQUEsVSxLQUFBQSxVOztFQW1CRSxJQUFNQyxzQ0FBc0MsR0FBRyxVQUFDQyxPQUFELEVBQXlDO0lBQzlGLElBQUlDLGlCQUFKLEVBQXlDQyxzQkFBekM7SUFDQUYsT0FBTyxDQUFDRyxPQUFSLENBQWdCLFVBQUNDLFdBQUQsRUFBaUM7TUFBQTs7TUFDaERILGlCQUFpQixHQUFHLEtBQXBCO01BQ0FDLHNCQUFzQixHQUFHLEVBQXpCOztNQUNBLElBQUlFLFdBQUosYUFBSUEsV0FBSixvQ0FBSUEsV0FBVyxDQUFFQyxJQUFqQiw4Q0FBSSxrQkFBbUJDLE1BQXZCLEVBQStCO1FBQUE7O1FBQzlCRixXQUFXLFNBQVgsSUFBQUEsV0FBVyxXQUFYLGtDQUFBQSxXQUFXLENBQUVDLElBQWIsMEVBQW1CRixPQUFuQixDQUEyQixVQUFDSSxRQUFELEVBQW1CO1VBQzdDLElBQU1DLGVBQWUsR0FBR0QsUUFBUSxDQUFDRSxPQUFqQzs7VUFDQSxJQUFJLENBQUNSLGlCQUFMLEVBQXdCO1lBQ3ZCLElBQUtPLGVBQWUsSUFBSSxPQUFPQSxlQUFQLEtBQTJCLFNBQS9DLElBQTZEQSxlQUFlLENBQUNFLE9BQWhCLE9BQThCLE1BQS9GLEVB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