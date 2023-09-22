/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/CommonHelper", "sap/fe/macros/table/TableHelper", "sap/fe/templates/ObjectPage/ObjectPageTemplating", "sap/m/library"], function (CommonHelper, Table, OP, library) {
  "use strict";

  var MenuButtonMode = library.MenuButtonMode;

  var DefaultActionHandler = {
    /**
     * The default action group handler that is invoked when adding the menu button handling appropriately.
     *
     * @param oCtx The current context in which the handler is called
     * @param oAction The current action context
     * @param oDataFieldForDefaultAction The current dataField for the default action
     * @param defaultActionContextOrEntitySet The current context for the default action
     * @param mode The optional parameter for the handler mode; default setting is Table
     * @returns The appropriate expression string
     */
    getDefaultActionHandler: function (oCtx, oAction, oDataFieldForDefaultAction, defaultActionContextOrEntitySet) {
      var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "Table";

      if (oAction.defaultAction) {
        try {
          switch (oAction.defaultAction.type) {
            case "ForAction":
              {
                if (mode === "Table") {
                  return Table.pressEventDataFieldForActionButton(oCtx, oDataFieldForDefaultAction, oCtx.collection.getObject("@sapui.name"), oCtx.tableDefinition.getObject("operationAvailableMap"), defaultActionContextOrEntitySet, oAction.isNavigable, oAction.enableAutoScroll, oAction.defaultValuesExtensionFunction);
                } else if (mode === "ObjectPage") {
                  return OP.getPressExpressionForEdit(oDataFieldForDefaultAction, defaultActionContextOrEntitySet, oAction.defaultAction);
                }

                return undefined;
              }

            case "ForNavigation":
              {
                switch (mode) {
                  case "Table":
                    {
                      return CommonHelper.getPressHandlerForDataFieldForIBN(oDataFieldForDefaultAction, "${internal>selectedContexts}", !oCtx.tableDefinition.getObject("enableAnalytics"));
                    }

                  case "ObjectPage":
                    {
                      if (oAction.defaultAction.command) {
                        return "cmd:" + oAction.defaultAction.command;
                      } else {
                        return oAction.defaultAction.press;
                      }
                    }
                }

                return undefined;
              }

            default:
              {
                if (oAction.defaultAction.command) {
                  return "cmd:" + oAction.defaultAction.command;
                }

                if (oAction.defaultAction.noWrap) {
                  return oAction.defaultAction.press;
                } else {
                  switch (mode) {
                    case "Table":
                      {
                        return CommonHelper.buildActionWrapper(oAction.defaultAction, oCtx);
                      }

                    case "ObjectPage":
                      {
                        return CommonHelper.buildActionWrapper(oAction.defaultAction, {
                          id: "forTheObjectPage"
                        });
                      }

                    case "Form":
                      {
                        return CommonHelper.buildActionWrapper(oAction.defaultAction, {
                          id: "forTheForm"
                        });
                      }
                  }
                }
              }
          }
        } catch (ioEx) {
          return "binding for the default action is not working as expected";
        }
      }

      return undefined;
    },

    /**
     * The function determines during templating whether to use the defaultActionOnly
     * setting for the sap.m.MenuButton control in case a defaultAction is provided.
     *
     * @param oAction The current action context
     * @returns A Boolean value
     */
    getUseDefaultActionOnly: function (oAction) {
      if (oAction.defaultAction) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * The function determines during templating whether to use the 'Split'
     * or 'Regular' MenuButtonMode for the sap.m.MenuButton control
     * in case a defaultAction is available.
     *
     * @param oAction The current action context
     * @returns The MenuButtonMode
     */
    getButtonMode: function (oAction) {
      if (oAction.defaultAction) {
        return MenuButtonMode.Split;
      } else {
        return MenuButtonMode.Regular;
      }
    }
  };
  return DefaultActionHandler;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEZWZhdWx0QWN0aW9uSGFuZGxlciIsImdldERlZmF1bHRBY3Rpb25IYW5kbGVyIiwib0N0eCIsIm9BY3Rpb24iLCJvRGF0YUZpZWxkRm9yRGVmYXVsdEFjdGlvbiIsImRlZmF1bHRBY3Rpb25Db250ZXh0T3JFbnRpdHlTZXQiLCJtb2RlIiwiZGVmYXVsdEFjdGlvbiIsInR5cGUiLCJUYWJsZSIsInByZXNzRXZlbnREYXRhRmllbGRGb3JBY3Rpb25CdXR0b24iLCJjb2xsZWN0aW9uIiwiZ2V0T2JqZWN0IiwidGFibGVEZWZpbml0aW9uIiwiaXNOYXZpZ2FibGUiLCJlbmFibGVBdXRvU2Nyb2xsIiwiZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uIiwiT1AiLCJnZXRQcmVzc0V4cHJlc3Npb25Gb3JFZGl0IiwidW5kZWZpbmVkIiwiQ29tbW9uSGVscGVyIiwiZ2V0UHJlc3NIYW5kbGVyRm9yRGF0YUZpZWxkRm9ySUJOIiwiY29tbWFuZCIsInByZXNzIiwibm9XcmFwIiwiYnVpbGRBY3Rpb25XcmFwcGVyIiwiaWQiLCJpb0V4IiwiZ2V0VXNlRGVmYXVsdEFjdGlvbk9ubHkiLCJnZXRCdXR0b25Nb2RlIiwiTWVudUJ1dHRvbk1vZGUiLCJTcGxpdCIsIlJlZ3VsYXIiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkRlZmF1bHRBY3Rpb25IYW5kbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tb25IZWxwZXIgZnJvbSBcInNhcC9mZS9tYWNyb3MvQ29tbW9uSGVscGVyXCI7XG5pbXBvcnQgVGFibGUgZnJvbSBcInNhcC9mZS9tYWNyb3MvdGFibGUvVGFibGVIZWxwZXJcIjtcbi8vaW1wb3J0IHsgZ2V0UHJlc3NFeHByZXNzaW9uRm9yRWRpdCB9IGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL09iamVjdFBhZ2UvT2JqZWN0UGFnZVRlbXBsYXRpbmdcIjtcbmltcG9ydCAqIGFzIE9QIGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL09iamVjdFBhZ2UvT2JqZWN0UGFnZVRlbXBsYXRpbmdcIjtcbmltcG9ydCB7IE1lbnVCdXR0b25Nb2RlIH0gZnJvbSBcInNhcC9tL2xpYnJhcnlcIjtcblxuY29uc3QgRGVmYXVsdEFjdGlvbkhhbmRsZXIgPSB7XG5cdC8qKlxuXHQgKiBUaGUgZGVmYXVsdCBhY3Rpb24gZ3JvdXAgaGFuZGxlciB0aGF0IGlzIGludm9rZWQgd2hlbiBhZGRpbmcgdGhlIG1lbnUgYnV0dG9uIGhhbmRsaW5nIGFwcHJvcHJpYXRlbHkuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ3R4IFRoZSBjdXJyZW50IGNvbnRleHQgaW4gd2hpY2ggdGhlIGhhbmRsZXIgaXMgY2FsbGVkXG5cdCAqIEBwYXJhbSBvQWN0aW9uIFRoZSBjdXJyZW50IGFjdGlvbiBjb250ZXh0XG5cdCAqIEBwYXJhbSBvRGF0YUZpZWxkRm9yRGVmYXVsdEFjdGlvbiBUaGUgY3VycmVudCBkYXRhRmllbGQgZm9yIHRoZSBkZWZhdWx0IGFjdGlvblxuXHQgKiBAcGFyYW0gZGVmYXVsdEFjdGlvbkNvbnRleHRPckVudGl0eVNldCBUaGUgY3VycmVudCBjb250ZXh0IGZvciB0aGUgZGVmYXVsdCBhY3Rpb25cblx0ICogQHBhcmFtIG1vZGUgVGhlIG9wdGlvbmFsIHBhcmFtZXRlciBmb3IgdGhlIGhhbmRsZXIgbW9kZTsgZGVmYXVsdCBzZXR0aW5nIGlzIFRhYmxlXG5cdCAqIEByZXR1cm5zIFRoZSBhcHByb3ByaWF0ZSBleHByZXNzaW9uIHN0cmluZ1xuXHQgKi9cblx0Z2V0RGVmYXVsdEFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uIChcblx0XHRvQ3R4OiBhbnksXG5cdFx0b0FjdGlvbjogYW55LFxuXHRcdG9EYXRhRmllbGRGb3JEZWZhdWx0QWN0aW9uOiBhbnksXG5cdFx0ZGVmYXVsdEFjdGlvbkNvbnRleHRPckVudGl0eVNldDogYW55LFxuXHRcdG1vZGUgPSBcIlRhYmxlXCJcblx0KSB7XG5cdFx0aWYgKG9BY3Rpb24uZGVmYXVsdEFjdGlvbikge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0c3dpdGNoIChvQWN0aW9uLmRlZmF1bHRBY3Rpb24udHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJGb3JBY3Rpb25cIjoge1xuXHRcdFx0XHRcdFx0aWYgKG1vZGUgPT09IFwiVGFibGVcIikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gVGFibGUucHJlc3NFdmVudERhdGFGaWVsZEZvckFjdGlvbkJ1dHRvbihcblx0XHRcdFx0XHRcdFx0XHRvQ3R4LFxuXHRcdFx0XHRcdFx0XHRcdG9EYXRhRmllbGRGb3JEZWZhdWx0QWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdG9DdHguY29sbGVjdGlvbi5nZXRPYmplY3QoXCJAc2FwdWkubmFtZVwiKSxcblx0XHRcdFx0XHRcdFx0XHRvQ3R4LnRhYmxlRGVmaW5pdGlvbi5nZXRPYmplY3QoXCJvcGVyYXRpb25BdmFpbGFibGVNYXBcIiksXG5cdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdEFjdGlvbkNvbnRleHRPckVudGl0eVNldCxcblx0XHRcdFx0XHRcdFx0XHRvQWN0aW9uLmlzTmF2aWdhYmxlLFxuXHRcdFx0XHRcdFx0XHRcdG9BY3Rpb24uZW5hYmxlQXV0b1Njcm9sbCxcblx0XHRcdFx0XHRcdFx0XHRvQWN0aW9uLmRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvblxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSBcIk9iamVjdFBhZ2VcIikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gT1AuZ2V0UHJlc3NFeHByZXNzaW9uRm9yRWRpdChcblx0XHRcdFx0XHRcdFx0XHRvRGF0YUZpZWxkRm9yRGVmYXVsdEFjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0QWN0aW9uQ29udGV4dE9yRW50aXR5U2V0LFxuXHRcdFx0XHRcdFx0XHRcdG9BY3Rpb24uZGVmYXVsdEFjdGlvblxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2FzZSBcIkZvck5hdmlnYXRpb25cIjoge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChtb2RlKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJUYWJsZVwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbW1vbkhlbHBlci5nZXRQcmVzc0hhbmRsZXJGb3JEYXRhRmllbGRGb3JJQk4oXG5cdFx0XHRcdFx0XHRcdFx0XHRvRGF0YUZpZWxkRm9yRGVmYXVsdEFjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRcdFwiJHtpbnRlcm5hbD5zZWxlY3RlZENvbnRleHRzfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0IW9DdHgudGFibGVEZWZpbml0aW9uLmdldE9iamVjdChcImVuYWJsZUFuYWx5dGljc1wiKVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y2FzZSBcIk9iamVjdFBhZ2VcIjoge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChvQWN0aW9uLmRlZmF1bHRBY3Rpb24uY29tbWFuZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiY21kOlwiICsgb0FjdGlvbi5kZWZhdWx0QWN0aW9uLmNvbW1hbmQ7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvQWN0aW9uLmRlZmF1bHRBY3Rpb24ucHJlc3M7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkZWZhdWx0OiB7XG5cdFx0XHRcdFx0XHRpZiAob0FjdGlvbi5kZWZhdWx0QWN0aW9uLmNvbW1hbmQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiY21kOlwiICsgb0FjdGlvbi5kZWZhdWx0QWN0aW9uLmNvbW1hbmQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAob0FjdGlvbi5kZWZhdWx0QWN0aW9uLm5vV3JhcCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0FjdGlvbi5kZWZhdWx0QWN0aW9uLnByZXNzO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChtb2RlKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIlRhYmxlXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb21tb25IZWxwZXIuYnVpbGRBY3Rpb25XcmFwcGVyKG9BY3Rpb24uZGVmYXVsdEFjdGlvbiwgb0N0eCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJPYmplY3RQYWdlXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb21tb25IZWxwZXIuYnVpbGRBY3Rpb25XcmFwcGVyKG9BY3Rpb24uZGVmYXVsdEFjdGlvbiwgeyBpZDogXCJmb3JUaGVPYmplY3RQYWdlXCIgfSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJGb3JtXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb21tb25IZWxwZXIuYnVpbGRBY3Rpb25XcmFwcGVyKG9BY3Rpb24uZGVmYXVsdEFjdGlvbiwgeyBpZDogXCJmb3JUaGVGb3JtXCIgfSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChpb0V4KSB7XG5cdFx0XHRcdHJldHVybiBcImJpbmRpbmcgZm9yIHRoZSBkZWZhdWx0IGFjdGlvbiBpcyBub3Qgd29ya2luZyBhcyBleHBlY3RlZFwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBUaGUgZnVuY3Rpb24gZGV0ZXJtaW5lcyBkdXJpbmcgdGVtcGxhdGluZyB3aGV0aGVyIHRvIHVzZSB0aGUgZGVmYXVsdEFjdGlvbk9ubHlcblx0ICogc2V0dGluZyBmb3IgdGhlIHNhcC5tLk1lbnVCdXR0b24gY29udHJvbCBpbiBjYXNlIGEgZGVmYXVsdEFjdGlvbiBpcyBwcm92aWRlZC5cblx0ICpcblx0ICogQHBhcmFtIG9BY3Rpb24gVGhlIGN1cnJlbnQgYWN0aW9uIGNvbnRleHRcblx0ICogQHJldHVybnMgQSBCb29sZWFuIHZhbHVlXG5cdCAqL1xuXHRnZXRVc2VEZWZhdWx0QWN0aW9uT25seTogZnVuY3Rpb24gKG9BY3Rpb246IGFueSkge1xuXHRcdGlmIChvQWN0aW9uLmRlZmF1bHRBY3Rpb24pIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBUaGUgZnVuY3Rpb24gZGV0ZXJtaW5lcyBkdXJpbmcgdGVtcGxhdGluZyB3aGV0aGVyIHRvIHVzZSB0aGUgJ1NwbGl0J1xuXHQgKiBvciAnUmVndWxhcicgTWVudUJ1dHRvbk1vZGUgZm9yIHRoZSBzYXAubS5NZW51QnV0dG9uIGNvbnRyb2xcblx0ICogaW4gY2FzZSBhIGRlZmF1bHRBY3Rpb24gaXMgYXZhaWxhYmxlLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0FjdGlvbiBUaGUgY3VycmVudCBhY3Rpb24gY29udGV4dFxuXHQgKiBAcmV0dXJucyBUaGUgTWVudUJ1dHRvbk1vZGVcblx0ICovXG5cdGdldEJ1dHRvbk1vZGU6IGZ1bmN0aW9uIChvQWN0aW9uOiBhbnkpIHtcblx0XHRpZiAob0FjdGlvbi5kZWZhdWx0QWN0aW9uKSB7XG5cdFx0XHRyZXR1cm4gTWVudUJ1dHRvbk1vZGUuU3BsaXQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBNZW51QnV0dG9uTW9kZS5SZWd1bGFyO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdEFjdGlvbkhhbmRsZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQU1BLElBQU1BLG9CQUFvQixHQUFH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