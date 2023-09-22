/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var oUrlParser = sap.ushell.Container.getService("URLParsing");
  var oUrlParams = oUrlParser.parseParameters(window.location.search);
  var sFioriToolsRtaMode = "fiori-tools-rta-mode";
  var sFioriToolsRtaModeValue = oUrlParams[sFioriToolsRtaMode] && oUrlParams[sFioriToolsRtaMode][0].toLowerCase(); // To enable all actions, remove the propagateMetadata function. Or, remove this file and its entry in AppComponent.js referring 'designTime'.

  var AppComponentDesignTime = {
    actions: "not-adaptable",
    aggregations: {
      rootControl: {
        actions: "not-adaptable",
        propagateMetadata: function (oElement) {
          // allow list of controls for which we want to enable DesignTime
          var mAllowList = {};

          var isOnDynamicPage = function (oSubElement) {
            if (oSubElement.getMetadata().getName() === "sap.f.DynamicPage") {
              return true;
            } else {
              var oParent = oSubElement.getParent();
              return oParent ? isOnDynamicPage(oParent) : false;
            }
          };

          if (sFioriToolsRtaModeValue === "true") {
            // allow list for the Fiori tools
            if (isOnDynamicPage(oElement)) {
              mAllowList = {
                "sap.ui.fl.variants.VariantManagement": true,
                "sap.fe.core.controls.FilterBar": true,
                "sap.ui.mdc.Table": true
              };
            }
          } else {
            // allow list for key users
            mAllowList = {
              "sap.fe.templates.ObjectPage.controls.StashableVBox": true,
              "sap.fe.templates.ObjectPage.controls.StashableHBox": true,
              "sap.uxap.ObjectPageLayout": true,
              "sap.uxap.AnchorBar": true,
              "sap.uxap.ObjectPageSection": true,
              "sap.uxap.ObjectPageSubSection": true,
              "sap.m.Button": true,
              "sap.m.MenuButton": true,
              "sap.m.FlexBox": true,
              "sap.ui.fl.util.IFrame": true,
              "sap.ui.layout.form.Form": true,
              "sap.ui.layout.form.FormContainer": true,
              "sap.ui.layout.form.FormElement": true,
              "sap.ui.fl.variants.VariantManagement": true,
              "sap.fe.core.controls.FilterBar": true,
              "sap.ui.mdc.Table": true,
              "sap.m.IconTabBar": true
            };

            if (oElement.getMetadata().getName() === "sap.m.MenuButton" && oElement.getParent().sParentAggregationName !== "_anchorBar") {
              mAllowList["sap.m.MenuButton"] = false;
            }

            if (oElement.getMetadata().getName() === "sap.m.Button" && oElement.getParent().sParentAggregationName !== "_anchorBar") {
              mAllowList["sap.m.Button"] = false;
            }

            if (oElement.getMetadata().getName() === "sap.m.FlexBox" && oElement.getId().indexOf("--fe::HeaderContentContainer") < 0) {
              mAllowList["sap.m.FlexBox"] = false;
            }
          }

          if (mAllowList[oElement.getMetadata().getName()]) {
            return {};
          } else {
            return {
              actions: "not-adaptable"
            };
          }
        }
      }
    },
    tool: {
      start: function (oComponent) {
        oComponent.getEnvironmentCapabilities().setCapability("AppState", false);
      },
      stop: function (oComponent) {
        oComponent.getEnvironmentCapabilities().setCapability("AppState", true);
      }
    }
  };
  return AppComponentDesignTime;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvVXJsUGFyc2VyIiwic2FwIiwidXNoZWxsIiwiQ29udGFpbmVyIiwiZ2V0U2VydmljZSIsIm9VcmxQYXJhbXMiLCJwYXJzZVBhcmFtZXRlcnMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInNGaW9yaVRvb2xzUnRhTW9kZSIsInNGaW9yaVRvb2xzUnRhTW9kZVZhbHVlIiwidG9Mb3dlckNhc2UiLCJBcHBDb21wb25lbnREZXNpZ25UaW1lIiwiYWN0aW9ucyIsImFnZ3JlZ2F0aW9ucyIsInJvb3RDb250cm9sIiwicHJvcGFnYXRlTWV0YWRhdGEiLCJvRWxlbWVudCIsIm1BbGxvd0xpc3QiLCJpc09uRHluYW1pY1BhZ2UiLCJvU3ViRWxlbWVudCIsImdldE1ldGFkYXRhIiwiZ2V0TmFtZSIsIm9QYXJlbnQiLCJnZXRQYXJlbnQiLCJzUGFyZW50QWdncmVnYXRpb25OYW1lIiwiZ2V0SWQiLCJpbmRleE9mIiwidG9vbCIsInN0YXJ0Iiwib0NvbXBvbmVudCIsImdldEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwic2V0Q2FwYWJpbGl0eSIsInN0b3AiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkFwcENvbXBvbmVudC5kZXNpZ250aW1lLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIEFwcENvbXBvbmVudCBmcm9tIFwic2FwL2ZlL2NvcmUvQXBwQ29tcG9uZW50XCI7XG5cbmNvbnN0IG9VcmxQYXJzZXIgPSBzYXAudXNoZWxsLkNvbnRhaW5lci5nZXRTZXJ2aWNlKFwiVVJMUGFyc2luZ1wiKTtcbmNvbnN0IG9VcmxQYXJhbXMgPSBvVXJsUGFyc2VyLnBhcnNlUGFyYW1ldGVycyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbmNvbnN0IHNGaW9yaVRvb2xzUnRhTW9kZSA9IFwiZmlvcmktdG9vbHMtcnRhLW1vZGVcIjtcbmNvbnN0IHNGaW9yaVRvb2xzUnRhTW9kZVZhbHVlID0gb1VybFBhcmFtc1tzRmlvcmlUb29sc1J0YU1vZGVdICYmIG9VcmxQYXJhbXNbc0Zpb3JpVG9vbHNSdGFNb2RlXVswXS50b0xvd2VyQ2FzZSgpO1xuLy8gVG8gZW5hYmxlIGFsbCBhY3Rpb25zLCByZW1vdmUgdGhlIHByb3BhZ2F0ZU1ldGFkYXRhIGZ1bmN0aW9uLiBPciwgcmVtb3ZlIHRoaXMgZmlsZSBhbmQgaXRzIGVudHJ5IGluIEFwcENvbXBvbmVudC5qcyByZWZlcnJpbmcgJ2Rlc2lnblRpbWUnLlxuY29uc3QgQXBwQ29tcG9uZW50RGVzaWduVGltZSA9IHtcblx0YWN0aW9uczogXCJub3QtYWRhcHRhYmxlXCIsXG5cdGFnZ3JlZ2F0aW9uczoge1xuXHRcdHJvb3RDb250cm9sOiB7XG5cdFx0XHRhY3Rpb25zOiBcIm5vdC1hZGFwdGFibGVcIixcblx0XHRcdHByb3BhZ2F0ZU1ldGFkYXRhOiBmdW5jdGlvbiAob0VsZW1lbnQ6IGFueSkge1xuXHRcdFx0XHQvLyBhbGxvdyBsaXN0IG9mIGNvbnRyb2xzIGZvciB3aGljaCB3ZSB3YW50IHRvIGVuYWJsZSBEZXNpZ25UaW1lXG5cdFx0XHRcdGxldCBtQWxsb3dMaXN0OiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xuXHRcdFx0XHRjb25zdCBpc09uRHluYW1pY1BhZ2UgPSBmdW5jdGlvbiAob1N1YkVsZW1lbnQ6IGFueSk6IGJvb2xlYW4ge1xuXHRcdFx0XHRcdGlmIChvU3ViRWxlbWVudC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSA9PT0gXCJzYXAuZi5EeW5hbWljUGFnZVwiKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb1BhcmVudCA9IG9TdWJFbGVtZW50LmdldFBhcmVudCgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9QYXJlbnQgPyBpc09uRHluYW1pY1BhZ2Uob1BhcmVudCkgOiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmIChzRmlvcmlUb29sc1J0YU1vZGVWYWx1ZSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHQvLyBhbGxvdyBsaXN0IGZvciB0aGUgRmlvcmkgdG9vbHNcblx0XHRcdFx0XHRpZiAoaXNPbkR5bmFtaWNQYWdlKG9FbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0bUFsbG93TGlzdCA9IHtcblx0XHRcdFx0XHRcdFx0XCJzYXAudWkuZmwudmFyaWFudHMuVmFyaWFudE1hbmFnZW1lbnRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJzYXAuZmUuY29yZS5jb250cm9scy5GaWx0ZXJCYXJcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJzYXAudWkubWRjLlRhYmxlXCI6IHRydWVcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGFsbG93IGxpc3QgZm9yIGtleSB1c2Vyc1xuXHRcdFx0XHRcdG1BbGxvd0xpc3QgPSB7XG5cdFx0XHRcdFx0XHRcInNhcC5mZS50ZW1wbGF0ZXMuT2JqZWN0UGFnZS5jb250cm9scy5TdGFzaGFibGVWQm94XCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC5mZS50ZW1wbGF0ZXMuT2JqZWN0UGFnZS5jb250cm9scy5TdGFzaGFibGVIQm94XCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51eGFwLk9iamVjdFBhZ2VMYXlvdXRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFwic2FwLnV4YXAuQW5jaG9yQmFyXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51eGFwLk9iamVjdFBhZ2VTZWN0aW9uXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51eGFwLk9iamVjdFBhZ2VTdWJTZWN0aW9uXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC5tLkJ1dHRvblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XCJzYXAubS5NZW51QnV0dG9uXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC5tLkZsZXhCb3hcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFwic2FwLnVpLmZsLnV0aWwuSUZyYW1lXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51aS5sYXlvdXQuZm9ybS5Gb3JtXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51aS5sYXlvdXQuZm9ybS5Gb3JtQ29udGFpbmVyXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51aS5sYXlvdXQuZm9ybS5Gb3JtRWxlbWVudFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XCJzYXAudWkuZmwudmFyaWFudHMuVmFyaWFudE1hbmFnZW1lbnRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFwic2FwLmZlLmNvcmUuY29udHJvbHMuRmlsdGVyQmFyXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcInNhcC51aS5tZGMuVGFibGVcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFwic2FwLm0uSWNvblRhYkJhclwiOiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvRWxlbWVudC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSA9PT0gXCJzYXAubS5NZW51QnV0dG9uXCIgJiZcblx0XHRcdFx0XHRcdG9FbGVtZW50LmdldFBhcmVudCgpLnNQYXJlbnRBZ2dyZWdhdGlvbk5hbWUgIT09IFwiX2FuY2hvckJhclwiXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRtQWxsb3dMaXN0W1wic2FwLm0uTWVudUJ1dHRvblwiXSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvRWxlbWVudC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSA9PT0gXCJzYXAubS5CdXR0b25cIiAmJlxuXHRcdFx0XHRcdFx0b0VsZW1lbnQuZ2V0UGFyZW50KCkuc1BhcmVudEFnZ3JlZ2F0aW9uTmFtZSAhPT0gXCJfYW5jaG9yQmFyXCJcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdG1BbGxvd0xpc3RbXCJzYXAubS5CdXR0b25cIl0gPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0b0VsZW1lbnQuZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCkgPT09IFwic2FwLm0uRmxleEJveFwiICYmXG5cdFx0XHRcdFx0XHRvRWxlbWVudC5nZXRJZCgpLmluZGV4T2YoXCItLWZlOjpIZWFkZXJDb250ZW50Q29udGFpbmVyXCIpIDwgMFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0bUFsbG93TGlzdFtcInNhcC5tLkZsZXhCb3hcIl0gPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG1BbGxvd0xpc3Rbb0VsZW1lbnQuZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCldKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHt9O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBcIm5vdC1hZGFwdGFibGVcIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHRvb2w6IHtcblx0XHRzdGFydDogZnVuY3Rpb24gKG9Db21wb25lbnQ6IEFwcENvbXBvbmVudCkge1xuXHRcdFx0b0NvbXBvbmVudC5nZXRFbnZpcm9ubWVudENhcGFiaWxpdGllcygpLnNldENhcGFiaWxpdHkoXCJBcHBTdGF0ZVwiLCBmYWxzZSk7XG5cdFx0fSxcblx0XHRzdG9wOiBmdW5jdGlvbiAob0NvbXBvbmVudDogQXBwQ29tcG9uZW50KSB7XG5cdFx0XHRvQ29tcG9uZW50LmdldEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKCkuc2V0Q2FwYWJpbGl0eShcIkFwcFN0YXRlXCIsIHRydWUpO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29tcG9uZW50RGVzaWduVGltZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQUVBLElBQU1BLFVBQVUsR0FBR0MsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFNBQVgsQ0FBcUJDLFVBQXJCLENBQWdDLFlBQWhDLENBQW5CO0VBQ0Es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