/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/ObjectPath"], function (Log, ObjectPath) {
  "use strict";

  var _exports = {};

  function applyChange(manifest, change) {
    var _manifest$sapUi, _manifest$sapUi$routi;

    var changeContent = change.getContent();
    var pageID = changeContent === null || changeContent === void 0 ? void 0 : changeContent.page;
    var targets = ((_manifest$sapUi = manifest["sap.ui5"]) === null || _manifest$sapUi === void 0 ? void 0 : (_manifest$sapUi$routi = _manifest$sapUi.routing) === null || _manifest$sapUi$routi === void 0 ? void 0 : _manifest$sapUi$routi.targets) || {};
    var pageSettings;
    var propertyChange = changeContent === null || changeContent === void 0 ? void 0 : changeContent.entityPropertyChange; // return unmodified manifest in case change not valid

    if ((propertyChange === null || propertyChange === void 0 ? void 0 : propertyChange.operation) !== "UPSERT" || !(propertyChange !== null && propertyChange !== void 0 && propertyChange.propertyPath) || (propertyChange === null || propertyChange === void 0 ? void 0 : propertyChange.propertyValue) === undefined || propertyChange !== null && propertyChange !== void 0 && propertyChange.propertyPath.startsWith("/")) {
      Log.error("Change content is not a valid");
      return manifest;
    }

    for (var p in targets) {
      if (targets[p].id === pageID) {
        var _targets$p$name;

        if ((_targets$p$name = targets[p].name) !== null && _targets$p$name !== void 0 && _targets$p$name.startsWith("sap.fe.templates.")) {
          var _targets$p, _targets$p$options;

          pageSettings = ((_targets$p = targets[p]) === null || _targets$p === void 0 ? void 0 : (_targets$p$options = _targets$p.options) === null || _targets$p$options === void 0 ? void 0 : _targets$p$options.settings) || {};
          break;
        }
      }
    }

    if (!pageSettings) {
      Log.error("No Fiori elements page with ID ".concat(pageID, " found in routing targets."));
      return manifest;
    }

    var propertyPath = propertyChange.propertyPath.split("/");

    if (propertyPath[0] === "controlConfiguration") {
      var annotationPath = ""; // the annotation path in the control configuration has to stay together. For now rely on the fact the @ is in the last part

      for (var i = 1; i < propertyPath.length; i++) {
        annotationPath += (i > 1 ? "/" : "") + propertyPath[i];

        if (annotationPath.indexOf("@") > -1) {
          propertyPath = ["controlConfiguration", annotationPath].concat(propertyPath.slice(i + 1));
          break;
        }
      }
    }

    ObjectPath.set(propertyPath, propertyChange.propertyValue, pageSettings);
    return manifest;
  }

  _exports.applyChange = applyChange;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhcHBseUNoYW5nZSIsIm1hbmlmZXN0IiwiY2hhbmdlIiwiY2hhbmdlQ29udGVudCIsImdldENvbnRlbnQiLCJwYWdlSUQiLCJwYWdlIiwidGFyZ2V0cyIsInJvdXRpbmciLCJwYWdlU2V0dGluZ3MiLCJwcm9wZXJ0eUNoYW5nZSIsImVudGl0eVByb3BlcnR5Q2hhbmdlIiwib3BlcmF0aW9uIiwicHJvcGVydHlQYXRoIiwicHJvcGVydHlWYWx1ZSIsInVuZGVmaW5lZCIsInN0YXJ0c1dpdGgiLCJMb2ciLCJlcnJvciIsInAiLCJpZCIsIm5hbWUiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJzcGxpdCIsImFubm90YXRpb25QYXRoIiwiaSIsImxlbmd0aCIsImluZGV4T2YiLCJjb25jYXQiLCJzbGljZSIsIk9iamVjdFBhdGgiLCJzZXQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkNoYW5nZVBhZ2VDb25maWd1cmF0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IE9iamVjdFBhdGggZnJvbSBcInNhcC9iYXNlL3V0aWwvT2JqZWN0UGF0aFwiO1xuXG5leHBvcnQgdHlwZSBDaGFuZ2UgPSB7XG5cdGdldENvbnRlbnQoKTogQ2hhbmdlQ29udGVudDtcbn07XG5cbnR5cGUgQ2hhbmdlQ29udGVudCA9IHtcblx0cGFnZTogc3RyaW5nOyAvLyBJRCBvZiB0aGUgcGFnZSB0byBiZSBjaGFuZ2VkXG5cdGVudGl0eVByb3BlcnR5Q2hhbmdlOiBFbnRpdHlQcm9wZXJ0eUNoYW5nZTtcbn07XG5cbnR5cGUgRW50aXR5UHJvcGVydHlDaGFuZ2UgPSB7XG5cdHByb3BlcnR5UGF0aDogc3RyaW5nOyAvLyBwYXRoIHRvIHRoZSBwcm9wZXJ0eSB0byBiZSBjaGFuZ2VkXG5cdG9wZXJhdGlvbjogc3RyaW5nOyAvLyBvbmx5IFVQU0VSVCBzdXBwb3J0ZWRcblx0cHJvcGVydHlWYWx1ZTogc3RyaW5nIHwgT2JqZWN0OyAvL3doYXQgdG8gYmUgY2hhbmdlZFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q2hhbmdlKG1hbmlmZXN0OiBhbnksIGNoYW5nZTogQ2hhbmdlKTogYW55IHtcblx0Y29uc3QgY2hhbmdlQ29udGVudCA9IGNoYW5nZS5nZXRDb250ZW50KCk7XG5cdGNvbnN0IHBhZ2VJRCA9IGNoYW5nZUNvbnRlbnQ/LnBhZ2U7XG5cdGNvbnN0IHRhcmdldHMgPSBtYW5pZmVzdFtcInNhcC51aTVcIl0/LnJvdXRpbmc/LnRhcmdldHMgfHwge307XG5cdGxldCBwYWdlU2V0dGluZ3M7XG5cdGNvbnN0IHByb3BlcnR5Q2hhbmdlID0gY2hhbmdlQ29udGVudD8uZW50aXR5UHJvcGVydHlDaGFuZ2U7XG5cblx0Ly8gcmV0dXJuIHVubW9kaWZpZWQgbWFuaWZlc3QgaW4gY2FzZSBjaGFuZ2Ugbm90IHZhbGlkXG5cdGlmIChcblx0XHRwcm9wZXJ0eUNoYW5nZT8ub3BlcmF0aW9uICE9PSBcIlVQU0VSVFwiIHx8XG5cdFx0IXByb3BlcnR5Q2hhbmdlPy5wcm9wZXJ0eVBhdGggfHxcblx0XHRwcm9wZXJ0eUNoYW5nZT8ucHJvcGVydHlWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0cHJvcGVydHlDaGFuZ2U/LnByb3BlcnR5UGF0aC5zdGFydHNXaXRoKFwiL1wiKVxuXHQpIHtcblx0XHRMb2cuZXJyb3IoXCJDaGFuZ2UgY29udGVudCBpcyBub3QgYSB2YWxpZFwiKTtcblx0XHRyZXR1cm4gbWFuaWZlc3Q7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHAgaW4gdGFyZ2V0cykge1xuXHRcdGlmICh0YXJnZXRzW3BdLmlkID09PSBwYWdlSUQpIHtcblx0XHRcdGlmICh0YXJnZXRzW3BdLm5hbWU/LnN0YXJ0c1dpdGgoXCJzYXAuZmUudGVtcGxhdGVzLlwiKSkge1xuXHRcdFx0XHRwYWdlU2V0dGluZ3MgPSB0YXJnZXRzW3BdPy5vcHRpb25zPy5zZXR0aW5ncyB8fCB7fTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFwYWdlU2V0dGluZ3MpIHtcblx0XHRMb2cuZXJyb3IoYE5vIEZpb3JpIGVsZW1lbnRzIHBhZ2Ugd2l0aCBJRCAke3BhZ2VJRH0gZm91bmQgaW4gcm91dGluZyB0YXJnZXRzLmApO1xuXHRcdHJldHVybiBtYW5pZmVzdDtcblx0fVxuXG5cdGxldCBwcm9wZXJ0eVBhdGggPSBwcm9wZXJ0eUNoYW5nZS5wcm9wZXJ0eVBhdGguc3BsaXQoXCIvXCIpO1xuXHRpZiAocHJvcGVydHlQYXRoWzBdID09PSBcImNvbnRyb2xDb25maWd1cmF0aW9uXCIpIHtcblx0XHRsZXQgYW5ub3RhdGlvblBhdGggPSBcIlwiO1xuXHRcdC8vIHRoZSBhbm5vdGF0aW9uIHBhdGggaW4gdGhlIGNvbnRyb2wgY29uZmlndXJhdGlvbiBoYXMgdG8gc3RheSB0b2dldGhlci4gRm9yIG5vdyByZWx5IG9uIHRoZSBmYWN0IHRoZSBAIGlzIGluIHRoZSBsYXN0IHBhcnRcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHByb3BlcnR5UGF0aC5sZW5ndGg7IGkrKykge1xuXHRcdFx0YW5ub3RhdGlvblBhdGggKz0gKGkgPiAxID8gXCIvXCIgOiBcIlwiKSArIHByb3BlcnR5UGF0aFtpXTtcblx0XHRcdGlmIChhbm5vdGF0aW9uUGF0aC5pbmRleE9mKFwiQFwiKSA+IC0xKSB7XG5cdFx0XHRcdHByb3BlcnR5UGF0aCA9IFtcImNvbnRyb2xDb25maWd1cmF0aW9uXCIsIGFubm90YXRpb25QYXRoXS5jb25jYXQocHJvcGVydHlQYXRoLnNsaWNlKGkgKyAxKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRPYmplY3RQYXRoLnNldChwcm9wZXJ0eVBhdGgsIHByb3BlcnR5Q2hhbmdlLnByb3BlcnR5VmFsdWUsIHBhZ2VTZXR0aW5ncyk7XG5cblx0cmV0dXJuIG1hbmlmZXN0O1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUFrQk8sU0FBU0EsV0FB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