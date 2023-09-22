/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/ObjectPath", "sap/base/util/UriParameters", "sap/fe/core/helpers/ClassSupport", "sap/fe/placeholder/library", "sap/ui/core/Core", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/Placeholder"], function (ObjectPath, UriParameters, ClassSupport, _library, Core, ControllerExtension, Placeholder) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * {@link sap.ui.core.mvc.ControllerExtension Controller extension} for Placeholder
   *
   * @namespace
   * @alias sap.fe.core.controllerextensions.Placeholder
   */
  var PlaceholderControllerExtension = (_dec = defineUI5Class("sap.fe.core.controllerextensions.Placeholder"), _dec2 = publicExtension(), _dec3 = publicExtension(), _dec4 = publicExtension(), _dec5 = publicExtension(), _dec6 = publicExtension(), _dec7 = publicExtension(), _dec8 = publicExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(PlaceholderControllerExtension, _ControllerExtension);

    function PlaceholderControllerExtension() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = PlaceholderControllerExtension.prototype;

    _proto.attachHideCallback = function attachHideCallback() {
      if (this.isPlaceholderEnabled()) {
        var oView = this.base.getView();
        var oPage = oView.getParent() && oView.getParent().oContainer;
        var oNavContainer = oPage && oPage.getParent();

        if (!oNavContainer) {
          return;
        }

        var _fnContainerDelegate = {
          onAfterShow: function (oEvent) {
            if (oEvent.isBackToPage) {
              oNavContainer.hidePlaceholder();
            } else if (UriParameters.fromQuery(window.location.hash.replace(/#.*\?/, "")).get("restoreHistory") === "true") {
              // in case we navigate to the listreport using the shell
              oNavContainer.hidePlaceholder();
            }
          }
        };
        oPage.addEventDelegate(_fnContainerDelegate);
        var oPageReady = oView.getController().pageReady; //In case of objectPage, the placeholder should be hidden when heroes requests are received
        // But for some scenario like "Create item", heroes requests are not sent .
        // The pageReady event is then used as fallback

        var aAttachEvents = ["pageReady"];

        if (oView.getControllerName() === "sap.fe.templates.ObjectPage.ObjectPageController") {
          aAttachEvents.push("heroesBatchReceived");
        }

        aAttachEvents.forEach(function (sEvent) {
          oPageReady.attachEvent(sEvent, null, function () {
            oNavContainer.hidePlaceholder();
          }, null);
        });
      }
    };

    _proto.attachRouteMatchers = function attachRouteMatchers() {
      this._init();
    };

    _proto._init = function _init() {
      this.oAppComponent = this.base.getAppComponent();
      this.oRootContainer = this.oAppComponent.getRootContainer();
      this.oPlaceholders = {}; // eslint-disable-next-line no-constant-condition

      if (this.isPlaceholderEnabled()) {
        Placeholder.registerProvider(function (oConfig) {
          switch (oConfig.name) {
            case "sap.fe.templates.ListReport":
              return {
                html: "sap/fe/placeholder/view/PlaceholderLR.fragment.html",
                autoClose: false
              };

            case "sap.fe.templates.ObjectPage":
              return {
                html: "sap/fe/placeholder/view/PlaceholderOP.fragment.html",
                autoClose: false
              };

            default:
          }
        });
      }

      if (this.isPlaceholderDebugEnabled()) {
        this.initPlaceholderDebug();
      }
    };

    _proto.initPlaceholderDebug = function initPlaceholderDebug() {
      var _this = this;

      this.resetPlaceholderDebugStats();
      var handler = {
        apply: function (target) {
          if (_this.oRootContainer._placeholder && _this.oRootContainer._placeholder.placeholder) {
            _this.debugStats.iHidePlaceholderTimestamp = Date.now();
          }

          return target.bind(_this.oRootContainer)();
        }
      }; // eslint-disable-next-line no-undef

      var proxy1 = new Proxy(this.oRootContainer.hidePlaceholder, handler);
      this.oRootContainer.hidePlaceholder = proxy1;
    };

    _proto.isPlaceholderDebugEnabled = function isPlaceholderDebugEnabled() {
      if (UriParameters.fromQuery(window.location.search).get("sap-ui-xx-placeholder-debug") === "true") {
        return true;
      }

      return false;
    };

    _proto.resetPlaceholderDebugStats = function resetPlaceholderDebugStats() {
      this.debugStats = {
        iHidePlaceholderTimestamp: 0,
        iPageReadyEventTimestamp: 0,
        iHeroesBatchReceivedEventTimestamp: 0
      };
    };

    _proto.getPlaceholderDebugStats = function getPlaceholderDebugStats() {
      return this.debugStats;
    };

    _proto.isPlaceholderEnabled = function isPlaceholderEnabled() {
      var bPlaceholderEnabledInFLP = ObjectPath.get("sap-ushell-config.apps.placeholder.enabled");

      if (bPlaceholderEnabledInFLP === false) {
        return false;
      }

      return Core.getConfiguration().getPlaceholder();
    };

    return PlaceholderControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "attachHideCallback", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "attachHideCallback"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachRouteMatchers", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "attachRouteMatchers"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "initPlaceholderDebug", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "initPlaceholderDebug"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPlaceholderDebugEnabled", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "isPlaceholderDebugEnabled"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "resetPlaceholderDebugStats", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "resetPlaceholderDebugStats"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getPlaceholderDebugStats", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "getPlaceholderDebugStats"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPlaceholderEnabled", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "isPlaceholderEnabled"), _class2.prototype)), _class2)) || _class);
  return PlaceholderControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQbGFjZWhvbGRlckNvbnRyb2xsZXJFeHRlbnNpb24iLCJkZWZpbmVVSTVDbGFzcyIsInB1YmxpY0V4dGVuc2lvbiIsImF0dGFjaEhpZGVDYWxsYmFjayIsImlzUGxhY2Vob2xkZXJFbmFibGVkIiwib1ZpZXciLCJiYXNlIiwiZ2V0VmlldyIsIm9QYWdlIiwiZ2V0UGFyZW50Iiwib0NvbnRhaW5lciIsIm9OYXZDb250YWluZXIiLCJfZm5Db250YWluZXJEZWxlZ2F0ZSIsIm9uQWZ0ZXJTaG93Iiwib0V2ZW50IiwiaXNCYWNrVG9QYWdlIiwiaGlkZVBsYWNlaG9sZGVyIiwiVXJpUGFyYW1ldGVycyIsImZyb21RdWVyeSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsInJlcGxhY2UiLCJnZXQiLCJhZGRFdmVudERlbGVnYXRlIiwib1BhZ2VSZWFkeSIsImdldENvbnRyb2xsZXIiLCJwYWdlUmVhZHkiLCJhQXR0YWNoRXZlbnRzIiwiZ2V0Q29udHJvbGxlck5hbWUiLCJwdXNoIiwiZm9yRWFjaCIsInNFdmVudCIsImF0dGFjaEV2ZW50IiwiYXR0YWNoUm91dGVNYXRjaGVycyIsIl9pbml0Iiwib0FwcENvbXBvbmVudCIsImdldEFwcENvbXBvbmVudCIsIm9Sb290Q29udGFpbmVyIiwiZ2V0Um9vdENvbnRhaW5lciIsIm9QbGFjZWhvbGRlcnMiLCJQbGFjZWhvbGRlciIsInJlZ2lzdGVyUHJvdmlkZXIiLCJvQ29uZmlnIiwibmFtZSIsImh0bWwiLCJhdXRvQ2xvc2UiLCJpc1BsYWNlaG9sZGVyRGVidWdFbmFibGVkIiwiaW5pdFBsYWNlaG9sZGVyRGVidWciLCJyZXNldFBsYWNlaG9sZGVyRGVidWdTdGF0cyIsImhhbmRsZXIiLCJhcHBseSIsInRhcmdldCIsIl9wbGFjZWhvbGRlciIsInBsYWNlaG9sZGVyIiwiZGVidWdTdGF0cyIsImlIaWRlUGxhY2Vob2xkZXJUaW1lc3RhbXAiLCJEYXRlIiwibm93IiwiYmluZCIsInByb3h5MSIsIlByb3h5Iiwic2VhcmNoIiwiaVBhZ2VSZWFkeUV2ZW50VGltZXN0YW1wIiwiaUhlcm9lc0JhdGNoUmVjZWl2ZWRFdmVudFRpbWVzdGFtcCIsImdldFBsYWNlaG9sZGVyRGVidWdTdGF0cyIsImJQbGFjZWhvbGRlckVuYWJsZWRJbkZMUCIsIk9iamVjdFBhdGgiLCJDb3JlIiwiZ2V0Q29uZmlndXJhdGlvbiIsImdldFBsYWNlaG9sZGVyIiwiQ29udHJvbGxlckV4dGVuc2lvbiJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiUGxhY2Vob2xkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9iamVjdFBhdGggZnJvbSBcInNhcC9iYXNlL3V0aWwvT2JqZWN0UGF0aFwiO1xuaW1wb3J0IFVyaVBhcmFtZXRlcnMgZnJvbSBcInNhcC9iYXNlL3V0aWwvVXJpUGFyYW1ldGVyc1wiO1xuaW1wb3J0IHR5cGUgQXBwQ29tcG9uZW50IGZyb20gXCJzYXAvZmUvY29yZS9BcHBDb21wb25lbnRcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBwdWJsaWNFeHRlbnNpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCB0eXBlIFBhZ2VDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvY29yZS9QYWdlQ29udHJvbGxlclwiO1xuaW1wb3J0IFwic2FwL2ZlL3BsYWNlaG9sZGVyL2xpYnJhcnlcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgQ29udHJvbGxlckV4dGVuc2lvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL0NvbnRyb2xsZXJFeHRlbnNpb25cIjtcbmltcG9ydCBQbGFjZWhvbGRlciBmcm9tIFwic2FwL3VpL2NvcmUvUGxhY2Vob2xkZXJcIjtcbi8qKlxuICoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5Db250cm9sbGVyRXh0ZW5zaW9uIENvbnRyb2xsZXIgZXh0ZW5zaW9ufSBmb3IgUGxhY2Vob2xkZXJcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGxhY2Vob2xkZXJcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGxhY2Vob2xkZXJcIilcbmNsYXNzIFBsYWNlaG9sZGVyQ29udHJvbGxlckV4dGVuc2lvbiBleHRlbmRzIENvbnRyb2xsZXJFeHRlbnNpb24ge1xuXHRwcml2YXRlIGJhc2UhOiBQYWdlQ29udHJvbGxlcjtcblx0cHJpdmF0ZSBvQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRwcml2YXRlIG9Sb290Q29udGFpbmVyOiBhbnk7XG5cdHByaXZhdGUgb1BsYWNlaG9sZGVyczogYW55O1xuXHRwcml2YXRlIGRlYnVnU3RhdHM6IGFueTtcblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0cHVibGljIGF0dGFjaEhpZGVDYWxsYmFjaygpIHtcblx0XHRpZiAodGhpcy5pc1BsYWNlaG9sZGVyRW5hYmxlZCgpKSB7XG5cdFx0XHRjb25zdCBvVmlldyA9IHRoaXMuYmFzZS5nZXRWaWV3KCk7XG5cdFx0XHRjb25zdCBvUGFnZSA9IG9WaWV3LmdldFBhcmVudCgpICYmIChvVmlldy5nZXRQYXJlbnQoKSBhcyBhbnkpLm9Db250YWluZXI7XG5cdFx0XHRjb25zdCBvTmF2Q29udGFpbmVyID0gb1BhZ2UgJiYgb1BhZ2UuZ2V0UGFyZW50KCk7XG5cblx0XHRcdGlmICghb05hdkNvbnRhaW5lcikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBfZm5Db250YWluZXJEZWxlZ2F0ZSA9IHtcblx0XHRcdFx0b25BZnRlclNob3c6IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdFx0XHRcdGlmIChvRXZlbnQuaXNCYWNrVG9QYWdlKSB7XG5cdFx0XHRcdFx0XHRvTmF2Q29udGFpbmVyLmhpZGVQbGFjZWhvbGRlcigpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoVXJpUGFyYW1ldGVycy5mcm9tUXVlcnkod2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgvIy4qXFw/LywgXCJcIikpLmdldChcInJlc3RvcmVIaXN0b3J5XCIpID09PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0Ly8gaW4gY2FzZSB3ZSBuYXZpZ2F0ZSB0byB0aGUgbGlzdHJlcG9ydCB1c2luZyB0aGUgc2hlbGxcblx0XHRcdFx0XHRcdG9OYXZDb250YWluZXIuaGlkZVBsYWNlaG9sZGVyKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b1BhZ2UuYWRkRXZlbnREZWxlZ2F0ZShfZm5Db250YWluZXJEZWxlZ2F0ZSk7XG5cblx0XHRcdGNvbnN0IG9QYWdlUmVhZHkgPSAob1ZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIFBhZ2VDb250cm9sbGVyKS5wYWdlUmVhZHk7XG5cdFx0XHQvL0luIGNhc2Ugb2Ygb2JqZWN0UGFnZSwgdGhlIHBsYWNlaG9sZGVyIHNob3VsZCBiZSBoaWRkZW4gd2hlbiBoZXJvZXMgcmVxdWVzdHMgYXJlIHJlY2VpdmVkXG5cdFx0XHQvLyBCdXQgZm9yIHNvbWUgc2NlbmFyaW8gbGlrZSBcIkNyZWF0ZSBpdGVtXCIsIGhlcm9lcyByZXF1ZXN0cyBhcmUgbm90IHNlbnQgLlxuXHRcdFx0Ly8gVGhlIHBhZ2VSZWFkeSBldmVudCBpcyB0aGVuIHVzZWQgYXMgZmFsbGJhY2tcblxuXHRcdFx0Y29uc3QgYUF0dGFjaEV2ZW50cyA9IFtcInBhZ2VSZWFkeVwiXTtcblx0XHRcdGlmIChvVmlldy5nZXRDb250cm9sbGVyTmFtZSgpID09PSBcInNhcC5mZS50ZW1wbGF0ZXMuT2JqZWN0UGFnZS5PYmplY3RQYWdlQ29udHJvbGxlclwiKSB7XG5cdFx0XHRcdGFBdHRhY2hFdmVudHMucHVzaChcImhlcm9lc0JhdGNoUmVjZWl2ZWRcIik7XG5cdFx0XHR9XG5cdFx0XHRhQXR0YWNoRXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNFdmVudDogc3RyaW5nKSB7XG5cdFx0XHRcdG9QYWdlUmVhZHkuYXR0YWNoRXZlbnQoXG5cdFx0XHRcdFx0c0V2ZW50LFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0b05hdkNvbnRhaW5lci5oaWRlUGxhY2Vob2xkZXIoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG51bGxcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0YXR0YWNoUm91dGVNYXRjaGVycygpIHtcblx0XHR0aGlzLl9pbml0KCk7XG5cdH1cblxuXHRfaW5pdCgpIHtcblx0XHR0aGlzLm9BcHBDb21wb25lbnQgPSB0aGlzLmJhc2UuZ2V0QXBwQ29tcG9uZW50KCk7XG5cdFx0dGhpcy5vUm9vdENvbnRhaW5lciA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRSb290Q29udGFpbmVyKCk7XG5cdFx0dGhpcy5vUGxhY2Vob2xkZXJzID0ge307XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG5cdFx0aWYgKHRoaXMuaXNQbGFjZWhvbGRlckVuYWJsZWQoKSkge1xuXHRcdFx0UGxhY2Vob2xkZXIucmVnaXN0ZXJQcm92aWRlcihmdW5jdGlvbiAob0NvbmZpZzogYW55KSB7XG5cdFx0XHRcdHN3aXRjaCAob0NvbmZpZy5uYW1lKSB7XG5cdFx0XHRcdFx0Y2FzZSBcInNhcC5mZS50ZW1wbGF0ZXMuTGlzdFJlcG9ydFwiOlxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0aHRtbDogXCJzYXAvZmUvcGxhY2Vob2xkZXIvdmlldy9QbGFjZWhvbGRlckxSLmZyYWdtZW50Lmh0bWxcIixcblx0XHRcdFx0XHRcdFx0YXV0b0Nsb3NlOiBmYWxzZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRjYXNlIFwic2FwLmZlLnRlbXBsYXRlcy5PYmplY3RQYWdlXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRodG1sOiBcInNhcC9mZS9wbGFjZWhvbGRlci92aWV3L1BsYWNlaG9sZGVyT1AuZnJhZ21lbnQuaHRtbFwiLFxuXHRcdFx0XHRcdFx0XHRhdXRvQ2xvc2U6IGZhbHNlXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZiAodGhpcy5pc1BsYWNlaG9sZGVyRGVidWdFbmFibGVkKCkpIHtcblx0XHRcdHRoaXMuaW5pdFBsYWNlaG9sZGVyRGVidWcoKTtcblx0XHR9XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0aW5pdFBsYWNlaG9sZGVyRGVidWcoKSB7XG5cdFx0dGhpcy5yZXNldFBsYWNlaG9sZGVyRGVidWdTdGF0cygpO1xuXHRcdGNvbnN0IGhhbmRsZXIgPSB7XG5cdFx0XHRhcHBseTogKHRhcmdldDogYW55KSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLm9Sb290Q29udGFpbmVyLl9wbGFjZWhvbGRlciAmJiB0aGlzLm9Sb290Q29udGFpbmVyLl9wbGFjZWhvbGRlci5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHRcdHRoaXMuZGVidWdTdGF0cy5pSGlkZVBsYWNlaG9sZGVyVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGFyZ2V0LmJpbmQodGhpcy5vUm9vdENvbnRhaW5lcikoKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHRcdGNvbnN0IHByb3h5MSA9IG5ldyBQcm94eSh0aGlzLm9Sb290Q29udGFpbmVyLmhpZGVQbGFjZWhvbGRlciwgaGFuZGxlcik7XG5cdFx0dGhpcy5vUm9vdENvbnRhaW5lci5oaWRlUGxhY2Vob2xkZXIgPSBwcm94eTE7XG5cdH1cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdGlzUGxhY2Vob2xkZXJEZWJ1Z0VuYWJsZWQoKSB7XG5cdFx0aWYgKFVyaVBhcmFtZXRlcnMuZnJvbVF1ZXJ5KHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldChcInNhcC11aS14eC1wbGFjZWhvbGRlci1kZWJ1Z1wiKSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0cmVzZXRQbGFjZWhvbGRlckRlYnVnU3RhdHMoKSB7XG5cdFx0dGhpcy5kZWJ1Z1N0YXRzID0ge1xuXHRcdFx0aUhpZGVQbGFjZWhvbGRlclRpbWVzdGFtcDogMCxcblx0XHRcdGlQYWdlUmVhZHlFdmVudFRpbWVzdGFtcDogMCxcblx0XHRcdGlIZXJvZXNCYXRjaFJlY2VpdmVkRXZlbnRUaW1lc3RhbXA6IDBcblx0XHR9O1xuXHR9XG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRnZXRQbGFjZWhvbGRlckRlYnVnU3RhdHMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGVidWdTdGF0cztcblx0fVxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0aXNQbGFjZWhvbGRlckVuYWJsZWQoKSB7XG5cdFx0Y29uc3QgYlBsYWNlaG9sZGVyRW5hYmxlZEluRkxQID0gT2JqZWN0UGF0aC5nZXQoXCJzYXAtdXNoZWxsLWNvbmZpZy5hcHBzLnBsYWNlaG9sZGVyLmVuYWJsZWRcIik7XG5cdFx0aWYgKGJQbGFjZWhvbGRlckVuYWJsZWRJbkZMUCA9PT0gZmFsc2UpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gQ29yZS5nZXRDb25maWd1cmF0aW9uKCkuZ2V0UGxhY2Vob2xkZXIoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGFjZWhvbGRlckNvbnRyb2xsZXJFeHRlbnNpb247XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztFQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUVNQSw4QixXQURMQyxjQUFjLENBQUMsOENBQUQsQyxV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