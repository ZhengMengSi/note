/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/deepEqual", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/ToES6Promise", "sap/fe/navigation/library", "sap/ui/base/Object", "./controllerextensions/BusyLocker", "./helpers/ModelHelper"], function (Log, deepEqual, ClassSupport, toES6Promise, library, BaseObject, BusyLocker, ModelHelper) {
  "use strict";

  var _dec, _class;

  var defineUI5Class = ClassSupport.defineUI5Class;

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }

    if (result && result.then) {
      return result.then(void 0, recover);
    }

    return result;
  }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var NavType = library.NavType;
  var AppStateHandler = (_dec = defineUI5Class("sap.fe.core.AppStateHandler"), _dec(_class = /*#__PURE__*/function (_BaseObject) {
    _inheritsLoose(AppStateHandler, _BaseObject);

    // AppComponent
    function AppStateHandler(oAppComponent) {
      var _this;

      _this = _BaseObject.call(this) || this;
      _this._mCurrentAppState = {};
      _this.oAppComponent = oAppComponent;
      _this.sId = "".concat(oAppComponent.getId(), "/AppStateHandler");
      _this.bNoRouteChange = false;
      Log.info("APPSTATE : Appstate handler initialized");
      return _this;
    }

    var _proto = AppStateHandler.prototype;

    _proto.getId = function getId() {
      return this.sId;
    }
    /**
     * Creates/updates the appstate.
     *
     * @returns A promise resolving the stored data
     * @ui5-restricted
     */
    ;

    _proto.createAppState = function createAppState() {
      try {
        var _this3 = this;

        if (!_this3.oAppComponent.getEnvironmentCapabilities().getCapabilities().AppState || BusyLocker.isLocked(_this3)) {
          return Promise.resolve();
        }

        var oNavigationService = _this3.oAppComponent.getNavigationService(),
            oRouterProxy = _this3.oAppComponent.getRouterProxy(),
            sHash = oRouterProxy.getHash(),
            oController = _this3.oAppComponent.getRootControl().getController(),
            bIsStickyMode = ModelHelper.isStickySessionSupported(_this3.oAppComponent.getMetaModel());

        if (!oController.viewState) {
          throw new Error("viewState controller extension not available for controller: ".concat(oController.getMetadata().getName()));
        }

        return Promise.resolve(oController.viewState.retrieveViewState()).then(function (mInnerAppState) {
          var oStoreData = {
            appState: mInnerAppState
          };

          var _temp2 = function () {
            if (mInnerAppState && !deepEqual(_this3._mCurrentAppState, mInnerAppState)) {
              _this3._mCurrentAppState = mInnerAppState;

              var _temp3 = _catch(function () {
                return Promise.resolve(oNavigationService.storeInnerAppStateAsync(oStoreData, true, true)).then(function (sAppStateKey) {
                  Log.info("APPSTATE: Appstate stored");
                  var sNewHash = oNavigationService.replaceInnerAppStateKey(sHash, sAppStateKey);

                  if (sNewHash !== sHash) {
                    oRouterProxy.navToHash(sNewHash, null, null, null, !bIsStickyMode);
                    _this3.bNoRouteChange = true;
                  }

                  Log.info("APPSTATE: navToHash");
                });
              }, function (oError) {
                Log.error(oError);
              });

              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            }
          }();

          return _temp2 && _temp2.then ? _temp2.then(function () {
            return oStoreData;
          }) : oStoreData;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._createNavigationParameters = function _createNavigationParameters(oAppData, sNavType) {
      return Object.assign({}, oAppData, {
        selectionVariantDefaults: oAppData.oDefaultedSelectionVariant,
        selectionVariant: oAppData.oSelectionVariant,
        requiresStandardVariant: !oAppData.bNavSelVarHasDefaultsOnly,
        navigationType: sNavType
      });
    }
    /**
     * Applies an appstate by fetching appdata and passing it to _applyAppstateToPage.
     *
     * @function
     * @static
     * @memberof sap.fe.core.AppStateHandler
     * @returns A promise for async handling
     * @private
     * @ui5-restricted
     */
    ;

    _proto.applyAppState = function applyAppState() {
      var _this4 = this;

      if (!this.oAppComponent.getEnvironmentCapabilities().getCapabilities().AppState || BusyLocker.isLocked(this)) {
        return Promise.resolve();
      }

      BusyLocker.lock(this); // Done for busy indicator

      BusyLocker.lock(this.oAppComponent.getRootControl());
      var oNavigationService = this.oAppComponent.getNavigationService(); // TODO oNavigationService.parseNavigation() should return ES6 promise instead jQuery.promise

      return toES6Promise(oNavigationService.parseNavigation()).catch(function (aErrorData) {
        if (!aErrorData) {
          aErrorData = [];
        }

        Log.warning("APPSTATE: Parse Navigation failed", aErrorData[0]);
        return [{
          /* app data */
        }, aErrorData[1], aErrorData[2]];
      }).then(function (aResults) {
        Log.info("APPSTATE: Parse Navigation done"); // aResults[1] => oStartupParameters (not evaluated)

        var oAppData = aResults[0] || {},
            sNavType = aResults[2] || NavType.initial,
            oRootController = _this4.oAppComponent.getRootControl().getController();

        _this4._mCurrentAppState = sNavType === NavType.iAppState ? oAppData && oAppData.appState : undefined;

        if (!oRootController.viewState) {
          throw new Error("viewState extension required for controller ".concat(oRootController.getMetadata().getName()));
        }

        if (!oAppData && sNavType == NavType.iAppState) {
          return {};
        }

        return oRootController.viewState.applyViewState(_this4._mCurrentAppState, _this4._createNavigationParameters(oAppData, sNavType));
      }).catch(function (oError) {
        Log.error("appState could not be applied", oError);
        throw oError;
      }).finally(function () {
        BusyLocker.unlock(_this4);
        BusyLocker.unlock(_this4.oAppComponent.getRootControl());
      });
    }
    /**
     * To check is route is changed by change in the iAPPState.
     *
     * @returns `true` if the route has chnaged
     */
    ;

    _proto.checkIfRouteChangedByIApp = function checkIfRouteChangedByIApp() {
      return this.bNoRouteChange;
    }
    /**
     * Reset the route changed by iAPPState.
     */
    ;

    _proto.resetRouteChangedByIApp = function resetRouteChangedByIApp() {
      if (this.bNoRouteChange) {
        this.bNoRouteChange = false;
      }
    };

    _proto._isListBasedComponent = function _isListBasedComponent(oComponent) {
      return oComponent.isA("sap.fe.templates.ListComponent");
    };

    return AppStateHandler;
  }(BaseObject)) || _class);
  /**
   * @global
   */

  return AppStateHandler;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiTmF2VHlwZSIsImxpYnJhcnkiLCJBcHBTdGF0ZUhhbmRsZXIiLCJkZWZpbmVVSTVDbGFzcyIsIm9BcHBDb21wb25lbnQiLCJfbUN1cnJlbnRBcHBTdGF0ZSIsInNJZCIsImdldElkIiwiYk5vUm91dGVDaGFuZ2UiLCJMb2ciLCJpbmZvIiwiY3JlYXRlQXBwU3RhdGUiLCJnZXRFbnZpcm9ubWVudENhcGFiaWxpdGllcyIsImdldENhcGFiaWxpdGllcyIsIkFwcFN0YXRlIiwiQnVzeUxvY2tlciIsImlzTG9ja2VkIiwib05hdmlnYXRpb25TZXJ2aWNlIiwiZ2V0TmF2aWdhdGlvblNlcnZpY2UiLCJvUm91dGVyUHJveHkiLCJnZXRSb3V0ZXJQcm94eSIsInNIYXNoIiwiZ2V0SGFzaCIsIm9Db250cm9sbGVyIiwiZ2V0Um9vdENvbnRyb2wiLCJnZXRDb250cm9sbGVyIiwiYklzU3RpY2t5TW9kZSIsIk1vZGVsSGVscGVyIiwiaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwiZ2V0TWV0YU1vZGVsIiwidmlld1N0YXRlIiwiRXJyb3IiLCJnZXRNZXRhZGF0YSIsImdldE5hbWUiLCJyZXRyaWV2ZVZpZXdTdGF0ZSIsIm1Jbm5lckFwcFN0YXRlIiwib1N0b3JlRGF0YSIsImFwcFN0YXRlIiwiZGVlcEVxdWFsIiwic3RvcmVJbm5lckFwcFN0YXRlQXN5bmMiLCJzQXBwU3RhdGVLZXkiLCJzTmV3SGFzaCIsInJlcGxhY2VJbm5lckFwcFN0YXRlS2V5IiwibmF2VG9IYXNoIiwib0Vycm9yIiwiZXJyb3IiLCJfY3JlYXRlTmF2aWdhdGlvblBhcmFtZXRlcnMiLCJvQXBwRGF0YSIsInNOYXZUeXBlIiwiT2JqZWN0IiwiYXNzaWduIiwic2VsZWN0aW9uVmFyaWFudERlZmF1bHRzIiwib0RlZmF1bHRlZFNlbGVjdGlvblZhcmlhbnQiLCJzZWxlY3Rpb25WYXJpYW50Iiwib1NlbGVjdGlvblZhcmlhbnQiLCJyZXF1aXJlc1N0YW5kYXJkVmFyaWFudCIsImJOYXZTZWxWYXJIYXNEZWZhdWx0c09ubHkiLCJuYXZpZ2F0aW9uVHlwZSIsImFwcGx5QXBwU3RhdGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImxvY2siLCJ0b0VTNlByb21pc2UiLCJwYXJzZU5hdmlnYXRpb24iLCJjYXRjaCIsImFFcnJvckRhdGEiLCJ3YXJuaW5nIiwiYVJlc3VsdHMiLCJpbml0aWFsIiwib1Jvb3RDb250cm9sbGVyIiwiaUFwcFN0YXRlIiwidW5kZWZpbmVkIiwiYXBwbHlWaWV3U3RhdGUiLCJmaW5hbGx5IiwidW5sb2NrIiwiY2hlY2tJZlJvdXRlQ2hhbmdlZEJ5SUFwcCIsInJlc2V0Um91dGVDaGFuZ2VkQnlJQXBwIiwiX2lzTGlzdEJhc2VkQ29tcG9uZW50Iiwib0NvbXBvbmVudCIsImlzQSIsIkJhc2VPYmplY3QiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkFwcFN0YXRlSGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSBcInNhcC9iYXNlL3V0aWwvZGVlcEVxdWFsXCI7XG5pbXBvcnQgeyBkZWZpbmVVSTVDbGFzcyB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHRvRVM2UHJvbWlzZSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Ub0VTNlByb21pc2VcIjtcbmltcG9ydCBsaWJyYXJ5IGZyb20gXCJzYXAvZmUvbmF2aWdhdGlvbi9saWJyYXJ5XCI7XG5pbXBvcnQgQmFzZU9iamVjdCBmcm9tIFwic2FwL3VpL2Jhc2UvT2JqZWN0XCI7XG5pbXBvcnQgQnVzeUxvY2tlciBmcm9tIFwiLi9jb250cm9sbGVyZXh0ZW5zaW9ucy9CdXN5TG9ja2VyXCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcIi4vaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuXG5jb25zdCBOYXZUeXBlID0gbGlicmFyeS5OYXZUeXBlO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5BcHBTdGF0ZUhhbmRsZXJcIilcbmNsYXNzIEFwcFN0YXRlSGFuZGxlciBleHRlbmRzIEJhc2VPYmplY3Qge1xuXHRwdWJsaWMgc0lkOiBzdHJpbmc7XG5cdHB1YmxpYyBvQXBwQ29tcG9uZW50OiBhbnk7IC8vIEFwcENvbXBvbmVudFxuXHRwdWJsaWMgYk5vUm91dGVDaGFuZ2U6IGJvb2xlYW47XG5cdHByaXZhdGUgX21DdXJyZW50QXBwU3RhdGU6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblx0Y29uc3RydWN0b3Iob0FwcENvbXBvbmVudDogYW55KSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm9BcHBDb21wb25lbnQgPSBvQXBwQ29tcG9uZW50O1xuXHRcdHRoaXMuc0lkID0gYCR7b0FwcENvbXBvbmVudC5nZXRJZCgpfS9BcHBTdGF0ZUhhbmRsZXJgO1xuXG5cdFx0dGhpcy5iTm9Sb3V0ZUNoYW5nZSA9IGZhbHNlO1xuXHRcdExvZy5pbmZvKFwiQVBQU1RBVEUgOiBBcHBzdGF0ZSBoYW5kbGVyIGluaXRpYWxpemVkXCIpO1xuXHR9XG5cdGdldElkKCkge1xuXHRcdHJldHVybiB0aGlzLnNJZDtcblx0fVxuXHQvKipcblx0ICogQ3JlYXRlcy91cGRhdGVzIHRoZSBhcHBzdGF0ZS5cblx0ICpcblx0ICogQHJldHVybnMgQSBwcm9taXNlIHJlc29sdmluZyB0aGUgc3RvcmVkIGRhdGFcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRhc3luYyBjcmVhdGVBcHBTdGF0ZSgpOiBQcm9taXNlPHZvaWQgfCBhbnk+IHtcblx0XHRpZiAoIXRoaXMub0FwcENvbXBvbmVudC5nZXRFbnZpcm9ubWVudENhcGFiaWxpdGllcygpLmdldENhcGFiaWxpdGllcygpLkFwcFN0YXRlIHx8IEJ1c3lMb2NrZXIuaXNMb2NrZWQodGhpcykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBvTmF2aWdhdGlvblNlcnZpY2UgPSB0aGlzLm9BcHBDb21wb25lbnQuZ2V0TmF2aWdhdGlvblNlcnZpY2UoKSxcblx0XHRcdG9Sb3V0ZXJQcm94eSA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRSb3V0ZXJQcm94eSgpLFxuXHRcdFx0c0hhc2ggPSBvUm91dGVyUHJveHkuZ2V0SGFzaCgpLFxuXHRcdFx0b0NvbnRyb2xsZXIgPSB0aGlzLm9BcHBDb21wb25lbnQuZ2V0Um9vdENvbnRyb2woKS5nZXRDb250cm9sbGVyKCksXG5cdFx0XHRiSXNTdGlja3lNb2RlID0gTW9kZWxIZWxwZXIuaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkKHRoaXMub0FwcENvbXBvbmVudC5nZXRNZXRhTW9kZWwoKSk7XG5cblx0XHRpZiAoIW9Db250cm9sbGVyLnZpZXdTdGF0ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGB2aWV3U3RhdGUgY29udHJvbGxlciBleHRlbnNpb24gbm90IGF2YWlsYWJsZSBmb3IgY29udHJvbGxlcjogJHtvQ29udHJvbGxlci5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBtSW5uZXJBcHBTdGF0ZSA9IGF3YWl0IG9Db250cm9sbGVyLnZpZXdTdGF0ZS5yZXRyaWV2ZVZpZXdTdGF0ZSgpO1xuXHRcdGNvbnN0IG9TdG9yZURhdGEgPSB7IGFwcFN0YXRlOiBtSW5uZXJBcHBTdGF0ZSB9O1xuXHRcdGlmIChtSW5uZXJBcHBTdGF0ZSAmJiAhZGVlcEVxdWFsKHRoaXMuX21DdXJyZW50QXBwU3RhdGUsIG1Jbm5lckFwcFN0YXRlKSkge1xuXHRcdFx0dGhpcy5fbUN1cnJlbnRBcHBTdGF0ZSA9IG1Jbm5lckFwcFN0YXRlO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3Qgc0FwcFN0YXRlS2V5ID0gYXdhaXQgb05hdmlnYXRpb25TZXJ2aWNlLnN0b3JlSW5uZXJBcHBTdGF0ZUFzeW5jKG9TdG9yZURhdGEsIHRydWUsIHRydWUpO1xuXHRcdFx0XHRMb2cuaW5mbyhcIkFQUFNUQVRFOiBBcHBzdGF0ZSBzdG9yZWRcIik7XG5cdFx0XHRcdGNvbnN0IHNOZXdIYXNoID0gb05hdmlnYXRpb25TZXJ2aWNlLnJlcGxhY2VJbm5lckFwcFN0YXRlS2V5KHNIYXNoLCBzQXBwU3RhdGVLZXkpO1xuXHRcdFx0XHRpZiAoc05ld0hhc2ggIT09IHNIYXNoKSB7XG5cdFx0XHRcdFx0b1JvdXRlclByb3h5Lm5hdlRvSGFzaChzTmV3SGFzaCwgbnVsbCwgbnVsbCwgbnVsbCwgIWJJc1N0aWNreU1vZGUpO1xuXHRcdFx0XHRcdHRoaXMuYk5vUm91dGVDaGFuZ2UgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdExvZy5pbmZvKFwiQVBQU1RBVEU6IG5hdlRvSGFzaFwiKTtcblx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihvRXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvU3RvcmVEYXRhO1xuXHR9XG5cblx0X2NyZWF0ZU5hdmlnYXRpb25QYXJhbWV0ZXJzKG9BcHBEYXRhOiBhbnksIHNOYXZUeXBlOiBhbnkpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgb0FwcERhdGEsIHtcblx0XHRcdHNlbGVjdGlvblZhcmlhbnREZWZhdWx0czogb0FwcERhdGEub0RlZmF1bHRlZFNlbGVjdGlvblZhcmlhbnQsXG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50OiBvQXBwRGF0YS5vU2VsZWN0aW9uVmFyaWFudCxcblx0XHRcdHJlcXVpcmVzU3RhbmRhcmRWYXJpYW50OiAhb0FwcERhdGEuYk5hdlNlbFZhckhhc0RlZmF1bHRzT25seSxcblx0XHRcdG5hdmlnYXRpb25UeXBlOiBzTmF2VHlwZVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgYW4gYXBwc3RhdGUgYnkgZmV0Y2hpbmcgYXBwZGF0YSBhbmQgcGFzc2luZyBpdCB0byBfYXBwbHlBcHBzdGF0ZVRvUGFnZS5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLkFwcFN0YXRlSGFuZGxlclxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgZm9yIGFzeW5jIGhhbmRsaW5nXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0YXBwbHlBcHBTdGF0ZSgpIHtcblx0XHRpZiAoIXRoaXMub0FwcENvbXBvbmVudC5nZXRFbnZpcm9ubWVudENhcGFiaWxpdGllcygpLmdldENhcGFiaWxpdGllcygpLkFwcFN0YXRlIHx8IEJ1c3lMb2NrZXIuaXNMb2NrZWQodGhpcykpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0QnVzeUxvY2tlci5sb2NrKHRoaXMpO1xuXHRcdC8vIERvbmUgZm9yIGJ1c3kgaW5kaWNhdG9yXG5cdFx0QnVzeUxvY2tlci5sb2NrKHRoaXMub0FwcENvbXBvbmVudC5nZXRSb290Q29udHJvbCgpKTtcblxuXHRcdGNvbnN0IG9OYXZpZ2F0aW9uU2VydmljZSA9IHRoaXMub0FwcENvbXBvbmVudC5nZXROYXZpZ2F0aW9uU2VydmljZSgpO1xuXHRcdC8vIFRPRE8gb05hdmlnYXRpb25TZXJ2aWNlLnBhcnNlTmF2aWdhdGlvbigpIHNob3VsZCByZXR1cm4gRVM2IHByb21pc2UgaW5zdGVhZCBqUXVlcnkucHJvbWlzZVxuXHRcdHJldHVybiB0b0VTNlByb21pc2Uob05hdmlnYXRpb25TZXJ2aWNlLnBhcnNlTmF2aWdhdGlvbigpKVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChhRXJyb3JEYXRhOiBhbnkpIHtcblx0XHRcdFx0aWYgKCFhRXJyb3JEYXRhKSB7XG5cdFx0XHRcdFx0YUVycm9yRGF0YSA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdExvZy53YXJuaW5nKFwiQVBQU1RBVEU6IFBhcnNlIE5hdmlnYXRpb24gZmFpbGVkXCIsIGFFcnJvckRhdGFbMF0pO1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8qIGFwcCBkYXRhICovXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRhRXJyb3JEYXRhWzFdLFxuXHRcdFx0XHRcdGFFcnJvckRhdGFbMl1cblx0XHRcdFx0XTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoYVJlc3VsdHM6IGFueSkgPT4ge1xuXHRcdFx0XHRMb2cuaW5mbyhcIkFQUFNUQVRFOiBQYXJzZSBOYXZpZ2F0aW9uIGRvbmVcIik7XG5cblx0XHRcdFx0Ly8gYVJlc3VsdHNbMV0gPT4gb1N0YXJ0dXBQYXJhbWV0ZXJzIChub3QgZXZhbHVhdGVkKVxuXHRcdFx0XHRjb25zdCBvQXBwRGF0YSA9IGFSZXN1bHRzWzBdIHx8IHt9LFxuXHRcdFx0XHRcdHNOYXZUeXBlID0gYVJlc3VsdHNbMl0gfHwgTmF2VHlwZS5pbml0aWFsLFxuXHRcdFx0XHRcdG9Sb290Q29udHJvbGxlciA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRSb290Q29udHJvbCgpLmdldENvbnRyb2xsZXIoKTtcblxuXHRcdFx0XHR0aGlzLl9tQ3VycmVudEFwcFN0YXRlID0gc05hdlR5cGUgPT09IE5hdlR5cGUuaUFwcFN0YXRlID8gb0FwcERhdGEgJiYgb0FwcERhdGEuYXBwU3RhdGUgOiB1bmRlZmluZWQ7XG5cblx0XHRcdFx0aWYgKCFvUm9vdENvbnRyb2xsZXIudmlld1N0YXRlKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGB2aWV3U3RhdGUgZXh0ZW5zaW9uIHJlcXVpcmVkIGZvciBjb250cm9sbGVyICR7b1Jvb3RDb250cm9sbGVyLmdldE1ldGFkYXRhKCkuZ2V0TmFtZSgpfWApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghb0FwcERhdGEgJiYgc05hdlR5cGUgPT0gTmF2VHlwZS5pQXBwU3RhdGUpIHtcblx0XHRcdFx0XHRyZXR1cm4ge307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG9Sb290Q29udHJvbGxlci52aWV3U3RhdGUuYXBwbHlWaWV3U3RhdGUoXG5cdFx0XHRcdFx0dGhpcy5fbUN1cnJlbnRBcHBTdGF0ZSxcblx0XHRcdFx0XHR0aGlzLl9jcmVhdGVOYXZpZ2F0aW9uUGFyYW1ldGVycyhvQXBwRGF0YSwgc05hdlR5cGUpXG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJhcHBTdGF0ZSBjb3VsZCBub3QgYmUgYXBwbGllZFwiLCBvRXJyb3IpO1xuXHRcdFx0XHR0aHJvdyBvRXJyb3I7XG5cdFx0XHR9KVxuXHRcdFx0LmZpbmFsbHkoKCkgPT4ge1xuXHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayh0aGlzKTtcblx0XHRcdFx0QnVzeUxvY2tlci51bmxvY2sodGhpcy5vQXBwQ29tcG9uZW50LmdldFJvb3RDb250cm9sKCkpO1xuXHRcdFx0fSk7XG5cdH1cblx0LyoqXG5cdCAqIFRvIGNoZWNrIGlzIHJvdXRlIGlzIGNoYW5nZWQgYnkgY2hhbmdlIGluIHRoZSBpQVBQU3RhdGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgcm91dGUgaGFzIGNobmFnZWRcblx0ICovXG5cdGNoZWNrSWZSb3V0ZUNoYW5nZWRCeUlBcHAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYk5vUm91dGVDaGFuZ2U7XG5cdH1cblx0LyoqXG5cdCAqIFJlc2V0IHRoZSByb3V0ZSBjaGFuZ2VkIGJ5IGlBUFBTdGF0ZS5cblx0ICovXG5cdHJlc2V0Um91dGVDaGFuZ2VkQnlJQXBwKCkge1xuXHRcdGlmICh0aGlzLmJOb1JvdXRlQ2hhbmdlKSB7XG5cdFx0XHR0aGlzLmJOb1JvdXRlQ2hhbmdlID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdF9pc0xpc3RCYXNlZENvbXBvbmVudChvQ29tcG9uZW50OiBhbnkpIHtcblx0XHRyZXR1cm4gb0NvbXBvbmVudC5pc0EoXCJzYXAuZmUudGVtcGxhdGVzLkxpc3RDb21wb25lbnRcIik7XG5cdH1cbn1cblxuLyoqXG4gKiBAZ2xvYmFsXG4gKi9cbmV4cG9ydCBk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