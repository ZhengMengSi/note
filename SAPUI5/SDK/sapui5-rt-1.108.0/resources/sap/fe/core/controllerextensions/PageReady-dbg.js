/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/controllerextensions/pageReady/DataQueryWatcher", "sap/fe/core/services/TemplatedViewServiceFactory", "sap/ui/base/EventProvider", "sap/ui/core/Component", "sap/ui/core/Core", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "../CommonUtils", "../helpers/ClassSupport"], function (DataQueryWatcher, TemplatedViewServiceFactory, EventProvider, Component, Core, ControllerExtension, OverrideExecution, CommonUtils, ClassSupport) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var methodOverride = ClassSupport.methodOverride;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var PageReadyControllerExtension = (_dec = defineUI5Class("sap.fe.core.controllerextensions.PageReady"), _dec2 = methodOverride(), _dec3 = methodOverride(), _dec4 = publicExtension(), _dec5 = finalExtension(), _dec6 = methodOverride("_routing"), _dec7 = methodOverride("_routing"), _dec8 = methodOverride("_routing"), _dec9 = publicExtension(), _dec10 = finalExtension(), _dec11 = publicExtension(), _dec12 = finalExtension(), _dec13 = publicExtension(), _dec14 = finalExtension(), _dec15 = publicExtension(), _dec16 = finalExtension(), _dec17 = publicExtension(), _dec18 = finalExtension(), _dec19 = privateExtension(), _dec20 = extensible(OverrideExecution.Instead), _dec21 = publicExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(PageReadyControllerExtension, _ControllerExtension);

    function PageReadyControllerExtension() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = PageReadyControllerExtension.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this._nbWaits = 0;
      this._oEventProvider = this._oEventProvider ? this._oEventProvider : new EventProvider();
      this._oView = this.base.getView();
      this._oAppComponent = CommonUtils.getAppComponent(this._oView);
      this._oPageComponent = Component.getOwnerComponentFor(this._oView);

      if (this._oPageComponent && this._oPageComponent.attachContainerDefined) {
        this._oPageComponent.attachContainerDefined(function (oEvent) {
          return _this.registerContainer(oEvent.getParameter("container"));
        });
      } else {
        this.registerContainer(this._oView);
      }

      var oRootControlController = this._oAppComponent.getRootControl().getController();

      var oPlaceholder = oRootControlController.getPlaceholder && oRootControlController.getPlaceholder();

      if (oPlaceholder !== null && oPlaceholder !== void 0 && oPlaceholder.isPlaceholderDebugEnabled()) {
        this.attachEvent("pageReady", null, function () {
          oPlaceholder.getPlaceholderDebugStats().iPageReadyEventTimestamp = Date.now();
        }, this);
        this.attachEvent("heroesBatchReceived", null, function () {
          oPlaceholder.getPlaceholderDebugStats().iHeroesBatchReceivedEventTimestamp = Date.now();
        }, this);
      }

      this.queryWatcher = new DataQueryWatcher(this._oEventProvider, this.checkPageReadyDebounced.bind(this));
    };

    _proto.onExit = function onExit() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete this._oAppComponent;

      if (this._oContainer) {
        this._oContainer.removeEventDelegate(this._fnContainerDelegate);
      }
    };

    _proto.waitFor = function waitFor(oPromise) {
      var _this2 = this;

      this._nbWaits++;
      oPromise.finally(function () {
        setTimeout(function () {
          _this2._nbWaits--;
        }, 0);
      }).catch(null);
    };

    _proto.onRouteMatched = function onRouteMatched() {
      this._bIsPageReady = false;
    };

    _proto.onRouteMatchedFinished = function onRouteMatchedFinished() {
      try {
        var _this4 = this;

        return Promise.resolve(_this4.onAfterBindingPromise).then(function () {
          _this4.checkPageReadyDebounced();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.registerAggregatedControls = function registerAggregatedControls(mainBindingContext) {
      var _this5 = this;

      if (mainBindingContext) {
        var mainObjectBinding = mainBindingContext.getBinding();
        this.queryWatcher.registerBinding(mainObjectBinding);
      }

      var aPromises = [];
      var aControls = this.getView().findAggregatedObjects(true);
      aControls.forEach(function (oElement) {
        var oObjectBinding = oElement.getObjectBinding();

        if (oObjectBinding) {
          // Register on all object binding (mostly used on object pages)
          _this5.queryWatcher.registerBinding(oObjectBinding);
        } else {
          var aBindingKeys = Object.keys(oElement.mBindingInfos);
          aBindingKeys.forEach(function (sPropertyName) {
            var oListBinding = oElement.mBindingInfos[sPropertyName].binding;

            if (oListBinding && oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
              _this5.queryWatcher.registerBinding(oListBinding);
            }
          });
        } // This is dirty but MDCTables and MDCCharts have a weird loading lifecycle


        if (oElement.isA("sap.ui.mdc.Table") || oElement.isA("sap.ui.mdc.Chart")) {
          _this5.bTablesChartsLoaded = false;
          aPromises.push(_this5.queryWatcher.registerTableOrChart(oElement));
        } else if (oElement.isA("sap.fe.core.controls.FilterBar")) {
          _this5.queryWatcher.registerFilterBar(oElement);
        }
      });
      return aPromises;
    };

    _proto.onAfterBinding = function onAfterBinding(oBindingContext) {
      var _this7 = this;

      var _this6 = this;

      if (this._bAfterBindingAlreadyApplied) {
        return;
      }

      this._bAfterBindingAlreadyApplied = true;

      if (this.isContextExpected() && oBindingContext === undefined) {
        // Force to mention we are expecting data
        this.bHasContext = false;
        return;
      } else {
        this.bHasContext = true;
      }

      this.attachEventOnce("pageReady", null, function () {
        _this6._bAfterBindingAlreadyApplied = false;

        _this6.queryWatcher.reset();
      }, null);
      this.onAfterBindingPromise = new Promise(function (resolve) {
        try {
          var aTableChartInitializedPromises = _this7.registerAggregatedControls(oBindingContext);

          var _temp2 = function () {
            if (aTableChartInitializedPromises.length > 0) {
              return Promise.resolve(Promise.all(aTableChartInitializedPromises)).then(function () {
                _this7.bTablesChartsLoaded = true;

                _this7.checkPageReadyDebounced();

                resolve();
              });
            } else {
              _this7.checkPageReadyDebounced();

              resolve();
            }
          }();

          return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    _proto.isPageReady = function isPageReady() {
      return this._bIsPageReady;
    };

    _proto.waitPageReady = function waitPageReady() {
      var _this8 = this;

      return new Promise(function (resolve) {
        if (_this8.isPageReady()) {
          resolve();
        } else {
          _this8.attachEventOnce("pageReady", null, function () {
            resolve();
          }, _this8);
        }
      });
    };

    _proto.attachEventOnce = function attachEventOnce(sEventId, oData, fnFunction, oListener) {
      // eslint-disable-next-line prefer-rest-params
      return this._oEventProvider.attachEventOnce(sEventId, oData, fnFunction, oListener);
    };

    _proto.attachEvent = function attachEvent(sEventId, oData, fnFunction, oListener) {
      // eslint-disable-next-line prefer-rest-params
      return this._oEventProvider.attachEvent(sEventId, oData, fnFunction, oListener);
    };

    _proto.detachEvent = function detachEvent(sEventId, fnFunction) {
      // eslint-disable-next-line prefer-rest-params
      return this._oEventProvider.detachEvent(sEventId, fnFunction);
    };

    _proto.registerContainer = function registerContainer(oContainer) {
      var _this9 = this;

      this._oContainer = oContainer;
      this._fnContainerDelegate = {
        onBeforeShow: function () {
          _this9.bShown = false;
          _this9._bIsPageReady = false;
        },
        onBeforeHide: function () {
          _this9.bShown = false;
          _this9._bIsPageReady = false;
        },
        onAfterShow: function () {
          var _this9$onAfterBinding;

          _this9.bShown = true;
          (_this9$onAfterBinding = _this9.onAfterBindingPromise) === null || _this9$onAfterBinding === void 0 ? void 0 : _this9$onAfterBinding.then(function () {
            _this9._checkPageReady(true);
          });
        }
      };

      this._oContainer.addEventDelegate(this._fnContainerDelegate, this);
    };

    _proto.isContextExpected = function isContextExpected() {
      return false;
    };

    _proto.checkPageReadyDebounced = function checkPageReadyDebounced() {
      var _this10 = this;

      if (this.pageReadyTimer) {
        clearTimeout(this.pageReadyTimer);
      }

      this.pageReadyTimer = setTimeout(function () {
        _this10._checkPageReady();
      }, 200);
    };

    _proto._checkPageReady = function _checkPageReady() {
      var _this11 = this;

      var bFromNav = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var fnUIUpdated = function () {
        // Wait until the UI is no longer dirty
        if (!Core.getUIDirty()) {
          Core.detachEvent("UIUpdated", fnUIUpdated);
          _this11._bWaitingForRefresh = false;
          setTimeout(function () {
            _this11._checkPageReady();
          }, 20);
        }
      }; // In case UIUpdate does not get called, check if UI is not dirty and then call _checkPageReady


      var checkUIUpdated = function () {
        if (Core.getUIDirty()) {
          setTimeout(checkUIUpdated, 500);
        } else if (_this11._bWaitingForRefresh) {
          _this11._bWaitingForRefresh = false;
          Core.detachEvent("UIUpdated", fnUIUpdated);

          _this11._checkPageReady();
        }
      };

      if (this.bShown && this.queryWatcher.isDataReceived() !== false && this.bTablesChartsLoaded !== false && (!this.isContextExpected() || this.bHasContext) // Either no context is expected or there is one
      ) {
        if (this.queryWatcher.isDataReceived() === true && !bFromNav && !this._bWaitingForRefresh && Core.getUIDirty()) {
          // If we requested data we get notified as soon as the data arrived, so before the next rendering tick
          this.queryWatcher.resetDataReceived();
          this._bWaitingForRefresh = true;
          Core.attachEvent("UIUpdated", fnUIUpdated);
          setTimeout(checkUIUpdated, 500);
        } else if (!this._bWaitingForRefresh && Core.getUIDirty() || this._nbWaits !== 0 || TemplatedViewServiceFactory.getNumberOfViewsInCreationState() > 0 || this.queryWatcher.isSearchPending()) {
          this._bWaitingForRefresh = true;
          Core.attachEvent("UIUpdated", fnUIUpdated);
          setTimeout(checkUIUpdated, 500);
        } else if (!this._bWaitingForRefresh) {
          // In the case we're not waiting for any data (navigating back to a page we already have loaded)
          // just wait for a frame to fire the event.
          this._bIsPageReady = true;

          this._oEventProvider.fireEvent("pageReady");
        }
      }
    };

    return PageReadyControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "waitFor", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "waitFor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatched", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatched"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatchedFinished", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatchedFinished"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onAfterBinding", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "onAfterBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPageReady", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "isPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "waitPageReady", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "waitPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEventOnce", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEventOnce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEvent", [_dec15, _dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "detachEvent", [_dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "detachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isContextExpected", [_dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "isContextExpected"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "checkPageReadyDebounced", [_dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "checkPageReadyDebounced"), _class2.prototype)), _class2)) || _class);
  return PageReadyControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uIiwiZGVmaW5lVUk1Q2xhc3MiLCJtZXRob2RPdmVycmlkZSIsInB1YmxpY0V4dGVuc2lvbiIsImZpbmFsRXh0ZW5zaW9uIiwicHJpdmF0ZUV4dGVuc2lvbiIsImV4dGVuc2libGUiLCJPdmVycmlkZUV4ZWN1dGlvbiIsIkluc3RlYWQiLCJvbkluaXQiLCJfbmJXYWl0cyIsIl9vRXZlbnRQcm92aWRlciIsIkV2ZW50UHJvdmlkZXIiLCJfb1ZpZXciLCJiYXNlIiwiZ2V0VmlldyIsIl9vQXBwQ29tcG9uZW50IiwiQ29tbW9uVXRpbHMiLCJnZXRBcHBDb21wb25lbnQiLCJfb1BhZ2VDb21wb25lbnQiLCJDb21wb25lbnQiLCJnZXRPd25lckNvbXBvbmVudEZvciIsImF0dGFjaENvbnRhaW5lckRlZmluZWQiLCJvRXZlbnQiLCJyZWdpc3RlckNvbnRhaW5lciIsImdldFBhcmFtZXRlciIsIm9Sb290Q29udHJvbENvbnRyb2xsZXIiLCJnZXRSb290Q29udHJvbCIsImdldENvbnRyb2xsZXIiLCJvUGxhY2Vob2xkZXIiLCJnZXRQbGFjZWhvbGRlciIsImlzUGxhY2Vob2xkZXJEZWJ1Z0VuYWJsZWQiLCJhdHRhY2hFdmVudCIsImdldFBsYWNlaG9sZGVyRGVidWdTdGF0cyIsImlQYWdlUmVhZHlFdmVudFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJpSGVyb2VzQmF0Y2hSZWNlaXZlZEV2ZW50VGltZXN0YW1wIiwicXVlcnlXYXRjaGVyIiwiRGF0YVF1ZXJ5V2F0Y2hlciIsImNoZWNrUGFnZVJlYWR5RGVib3VuY2VkIiwiYmluZCIsIm9uRXhpdCIsIl9vQ29udGFpbmVyIiwicmVtb3ZlRXZlbnREZWxlZ2F0ZSIsIl9mbkNvbnRhaW5lckRlbGVnYXRlIiwid2FpdEZvciIsIm9Qcm9taXNlIiwiZmluYWxseSIsInNldFRpbWVvdXQiLCJjYXRjaCIsIm9uUm91dGVNYXRjaGVkIiwiX2JJc1BhZ2VSZWFkeSIsIm9uUm91dGVNYXRjaGVkRmluaXNoZWQiLCJvbkFmdGVyQmluZGluZ1Byb21pc2UiLCJyZWdpc3RlckFnZ3JlZ2F0ZWRDb250cm9scyIsIm1haW5CaW5kaW5nQ29udGV4dCIsIm1haW5PYmplY3RCaW5kaW5nIiwiZ2V0QmluZGluZyIsInJlZ2lzdGVyQmluZGluZyIsImFQcm9taXNlcyIsImFDb250cm9scyIsImZpbmRBZ2dyZWdhdGVkT2JqZWN0cyIsImZvckVhY2giLCJvRWxlbWVudCIsIm9PYmplY3RCaW5kaW5nIiwiZ2V0T2JqZWN0QmluZGluZyIsImFCaW5kaW5nS2V5cyIsIk9iamVjdCIsImtleXMiLCJtQmluZGluZ0luZm9zIiwic1Byb3BlcnR5TmFtZSIsIm9MaXN0QmluZGluZyIsImJpbmRpbmciLCJpc0EiLCJiVGFibGVzQ2hhcnRzTG9hZGVkIiwicHVzaCIsInJlZ2lzdGVyVGFibGVPckNoYXJ0IiwicmVnaXN0ZXJGaWx0ZXJCYXIiLCJvbkFmdGVyQmluZGluZyIsIm9CaW5kaW5nQ29udGV4dCIsIl9iQWZ0ZXJCaW5kaW5nQWxyZWFkeUFwcGxpZWQiLCJpc0NvbnRleHRFeHBlY3RlZCIsInVuZGVmaW5lZCIsImJIYXNDb250ZXh0IiwiYXR0YWNoRXZlbnRPbmNlIiwicmVzZXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImFUYWJsZUNoYXJ0SW5pdGlhbGl6ZWRQcm9taXNlcyIsImxlbmd0aCIsImFsbCIsImlzUGFnZVJlYWR5Iiwid2FpdFBhZ2VSZWFkeSIsInNFdmVudElkIiwib0RhdGEiLCJmbkZ1bmN0aW9uIiwib0xpc3RlbmVyIiwiZGV0YWNoRXZlbnQiLCJvQ29udGFpbmVyIiwib25CZWZvcmVTaG93IiwiYlNob3duIiwib25CZWZvcmVIaWRlIiwib25BZnRlclNob3ciLCJ0aGVuIiwiX2NoZWNrUGFnZVJlYWR5IiwiYWRkRXZlbnREZWxlZ2F0ZSIsInBhZ2VSZWFkeVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiYkZyb21OYXYiLCJmblVJVXBkYXRlZCIsIkNvcmUiLCJnZXRVSURpcnR5IiwiX2JXYWl0aW5nRm9yUmVmcmVzaCIsImNoZWNrVUlVcGRhdGVkIiwiaXNEYXRhUmVjZWl2ZWQiLCJyZXNldERhdGFSZWNlaXZlZCIsIlRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeSIsImdldE51bWJlck9mVmlld3NJbkNyZWF0aW9uU3RhdGUiLCJpc1NlYXJjaFBlbmRpbmciLCJmaXJlRXZlbnQiLCJDb250cm9sbGVyRXh0ZW5zaW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJQYWdlUmVhZHkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgQXBwQ29tcG9uZW50IGZyb20gXCJzYXAvZmUvY29yZS9BcHBDb21wb25lbnRcIjtcbmltcG9ydCBEYXRhUXVlcnlXYXRjaGVyIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9wYWdlUmVhZHkvRGF0YVF1ZXJ5V2F0Y2hlclwiO1xuaW1wb3J0IFBhZ2VDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvY29yZS9QYWdlQ29udHJvbGxlclwiO1xuaW1wb3J0IFRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvVGVtcGxhdGVkVmlld1NlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgdHlwZSBFdmVudCBmcm9tIFwic2FwL3VpL2Jhc2UvRXZlbnRcIjtcbmltcG9ydCBFdmVudFByb3ZpZGVyIGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFByb3ZpZGVyXCI7XG5pbXBvcnQgdHlwZSBNYW5hZ2VkT2JqZWN0IGZyb20gXCJzYXAvdWkvYmFzZS9NYW5hZ2VkT2JqZWN0XCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJzYXAvdWkvY29yZS9Db21wb25lbnRcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgQ29udHJvbGxlckV4dGVuc2lvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL0NvbnRyb2xsZXJFeHRlbnNpb25cIjtcbmltcG9ydCBPdmVycmlkZUV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL092ZXJyaWRlRXhlY3V0aW9uXCI7XG5pbXBvcnQgdHlwZSBWaWV3IGZyb20gXCJzYXAvdWkvY29yZS9tdmMvVmlld1wiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L0NvbnRleHRcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwiLi4vQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBleHRlbnNpYmxlLCBmaW5hbEV4dGVuc2lvbiwgbWV0aG9kT3ZlcnJpZGUsIHByaXZhdGVFeHRlbnNpb24sIHB1YmxpY0V4dGVuc2lvbiB9IGZyb20gXCIuLi9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5QYWdlUmVhZHlcIilcbmNsYXNzIFBhZ2VSZWFkeUNvbnRyb2xsZXJFeHRlbnNpb24gZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJvdGVjdGVkIGJhc2UhOiBQYWdlQ29udHJvbGxlcjtcblx0cHJpdmF0ZSBfb0V2ZW50UHJvdmlkZXIhOiBFdmVudFByb3ZpZGVyO1xuXHRwcml2YXRlIF9vVmlldz86IFZpZXc7XG5cdHByaXZhdGUgX29BcHBDb21wb25lbnQhOiBBcHBDb21wb25lbnQ7XG5cdHByaXZhdGUgX29QYWdlQ29tcG9uZW50ITogYW55O1xuXHRwcml2YXRlIF9vQ29udGFpbmVyITogYW55O1xuXHRwcml2YXRlIF9iQWZ0ZXJCaW5kaW5nQWxyZWFkeUFwcGxpZWQhOiBib29sZWFuO1xuXHRwcml2YXRlIF9mbkNvbnRhaW5lckRlbGVnYXRlOiBhbnk7XG5cdHByaXZhdGUgX25iV2FpdHMhOiBudW1iZXI7XG5cdHByaXZhdGUgX2JJc1BhZ2VSZWFkeSE6IGJvb2xlYW47XG5cdHByaXZhdGUgX2JXYWl0aW5nRm9yUmVmcmVzaCE6IGJvb2xlYW47XG5cdHByaXZhdGUgYlNob3duITogYm9vbGVhbjtcblx0cHJpdmF0ZSBiSGFzQ29udGV4dCE6IGJvb2xlYW47XG5cdHByaXZhdGUgYlRhYmxlc0NoYXJ0c0xvYWRlZD86IGJvb2xlYW47XG5cdHByaXZhdGUgcGFnZVJlYWR5VGltZXI6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkO1xuXHRwcml2YXRlIHF1ZXJ5V2F0Y2hlciE6IERhdGFRdWVyeVdhdGNoZXI7XG5cdHByaXZhdGUgb25BZnRlckJpbmRpbmdQcm9taXNlITogUHJvbWlzZTx2b2lkPjtcblxuXHRAbWV0aG9kT3ZlcnJpZGUoKVxuXHRwdWJsaWMgb25Jbml0KCkge1xuXHRcdHRoaXMuX25iV2FpdHMgPSAwO1xuXHRcdHRoaXMuX29FdmVudFByb3ZpZGVyID0gdGhpcy5fb0V2ZW50UHJvdmlkZXIgPyB0aGlzLl9vRXZlbnRQcm92aWRlciA6IG5ldyBFdmVudFByb3ZpZGVyKCk7XG5cdFx0dGhpcy5fb1ZpZXcgPSB0aGlzLmJhc2UuZ2V0VmlldygpO1xuXHRcdHRoaXMuX29BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQodGhpcy5fb1ZpZXcpO1xuXHRcdHRoaXMuX29QYWdlQ29tcG9uZW50ID0gQ29tcG9uZW50LmdldE93bmVyQ29tcG9uZW50Rm9yKHRoaXMuX29WaWV3KTtcblxuXHRcdGlmICh0aGlzLl9vUGFnZUNvbXBvbmVudCAmJiB0aGlzLl9vUGFnZUNvbXBvbmVudC5hdHRhY2hDb250YWluZXJEZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9vUGFnZUNvbXBvbmVudC5hdHRhY2hDb250YWluZXJEZWZpbmVkKChvRXZlbnQ6IEV2ZW50KSA9PiB0aGlzLnJlZ2lzdGVyQ29udGFpbmVyKG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJjb250YWluZXJcIikpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yZWdpc3RlckNvbnRhaW5lcih0aGlzLl9vVmlldyk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb1Jvb3RDb250cm9sQ29udHJvbGxlciA9ICh0aGlzLl9vQXBwQ29tcG9uZW50LmdldFJvb3RDb250cm9sKCkgYXMgVmlldykuZ2V0Q29udHJvbGxlcigpIGFzIGFueTtcblx0XHRjb25zdCBvUGxhY2Vob2xkZXIgPSBvUm9vdENvbnRyb2xDb250cm9sbGVyLmdldFBsYWNlaG9sZGVyICYmIG9Sb290Q29udHJvbENvbnRyb2xsZXIuZ2V0UGxhY2Vob2xkZXIoKTtcblx0XHRpZiAob1BsYWNlaG9sZGVyPy5pc1BsYWNlaG9sZGVyRGVidWdFbmFibGVkKCkpIHtcblx0XHRcdHRoaXMuYXR0YWNoRXZlbnQoXG5cdFx0XHRcdFwicGFnZVJlYWR5XCIsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRvUGxhY2Vob2xkZXIuZ2V0UGxhY2Vob2xkZXJEZWJ1Z1N0YXRzKCkuaVBhZ2VSZWFkeUV2ZW50VGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dGhpc1xuXHRcdFx0KTtcblx0XHRcdHRoaXMuYXR0YWNoRXZlbnQoXG5cdFx0XHRcdFwiaGVyb2VzQmF0Y2hSZWNlaXZlZFwiLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0b1BsYWNlaG9sZGVyLmdldFBsYWNlaG9sZGVyRGVidWdTdGF0cygpLmlIZXJvZXNCYXRjaFJlY2VpdmVkRXZlbnRUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aGlzXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHRoaXMucXVlcnlXYXRjaGVyID0gbmV3IERhdGFRdWVyeVdhdGNoZXIodGhpcy5fb0V2ZW50UHJvdmlkZXIsIHRoaXMuY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQuYmluZCh0aGlzKSk7XG5cdH1cblxuXHRAbWV0aG9kT3ZlcnJpZGUoKVxuXHRwdWJsaWMgb25FeGl0KCkge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuX29BcHBDb21wb25lbnQ7XG5cdFx0aWYgKHRoaXMuX29Db250YWluZXIpIHtcblx0XHRcdHRoaXMuX29Db250YWluZXIucmVtb3ZlRXZlbnREZWxlZ2F0ZSh0aGlzLl9mbkNvbnRhaW5lckRlbGVnYXRlKTtcblx0XHR9XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIHdhaXRGb3Iob1Byb21pc2U6IGFueSkge1xuXHRcdHRoaXMuX25iV2FpdHMrKztcblx0XHRvUHJvbWlzZVxuXHRcdFx0LmZpbmFsbHkoKCkgPT4ge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9uYldhaXRzLS07XG5cdFx0XHRcdH0sIDApO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChudWxsKTtcblx0fVxuXHRAbWV0aG9kT3ZlcnJpZGUoXCJfcm91dGluZ1wiKVxuXHRvblJvdXRlTWF0Y2hlZCgpIHtcblx0XHR0aGlzLl9iSXNQYWdlUmVhZHkgPSBmYWxzZTtcblx0fVxuXHRAbWV0aG9kT3ZlcnJpZGUoXCJfcm91dGluZ1wiKVxuXHRhc3luYyBvblJvdXRlTWF0Y2hlZEZpbmlzaGVkKCkge1xuXHRcdGF3YWl0IHRoaXMub25BZnRlckJpbmRpbmdQcm9taXNlO1xuXHRcdHRoaXMuY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQoKTtcblx0fVxuXG5cdHB1YmxpYyByZWdpc3RlckFnZ3JlZ2F0ZWRDb250cm9scyhtYWluQmluZGluZ0NvbnRleHQ/OiBDb250ZXh0KTogUHJvbWlzZTx2b2lkPltdIHtcblx0XHRpZiAobWFpbkJpbmRpbmdDb250ZXh0KSB7XG5cdFx0XHRjb25zdCBtYWluT2JqZWN0QmluZGluZyA9IG1haW5CaW5kaW5nQ29udGV4dC5nZXRCaW5kaW5nKCk7XG5cdFx0XHR0aGlzLnF1ZXJ5V2F0Y2hlci5yZWdpc3RlckJpbmRpbmcobWFpbk9iamVjdEJpbmRpbmcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFQcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XG5cdFx0Y29uc3QgYUNvbnRyb2xzID0gdGhpcy5nZXRWaWV3KCkuZmluZEFnZ3JlZ2F0ZWRPYmplY3RzKHRydWUpO1xuXG5cdFx0YUNvbnRyb2xzLmZvckVhY2goKG9FbGVtZW50OiBhbnkpID0+IHtcblx0XHRcdGNvbnN0IG9PYmplY3RCaW5kaW5nID0gb0VsZW1lbnQuZ2V0T2JqZWN0QmluZGluZygpO1xuXHRcdFx0aWYgKG9PYmplY3RCaW5kaW5nKSB7XG5cdFx0XHRcdC8vIFJlZ2lzdGVyIG9uIGFsbCBvYmplY3QgYmluZGluZyAobW9zdGx5IHVzZWQgb24gb2JqZWN0IHBhZ2VzKVxuXHRcdFx0XHR0aGlzLnF1ZXJ5V2F0Y2hlci5yZWdpc3RlckJpbmRpbmcob09iamVjdEJpbmRpbmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgYUJpbmRpbmdLZXlzID0gT2JqZWN0LmtleXMob0VsZW1lbnQubUJpbmRpbmdJbmZvcyk7XG5cdFx0XHRcdGFCaW5kaW5nS2V5cy5mb3JFYWNoKChzUHJvcGVydHlOYW1lKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgb0xpc3RCaW5kaW5nID0gb0VsZW1lbnQubUJpbmRpbmdJbmZvc1tzUHJvcGVydHlOYW1lXS5iaW5kaW5nO1xuXG5cdFx0XHRcdFx0aWYgKG9MaXN0QmluZGluZyAmJiBvTGlzdEJpbmRpbmcuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIikpIHtcblx0XHRcdFx0XHRcdHRoaXMucXVlcnlXYXRjaGVyLnJlZ2lzdGVyQmluZGluZyhvTGlzdEJpbmRpbmcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBUaGlzIGlzIGRpcnR5IGJ1dCBNRENUYWJsZXMgYW5kIE1EQ0NoYXJ0cyBoYXZlIGEgd2VpcmQgbG9hZGluZyBsaWZlY3ljbGVcblx0XHRcdGlmIChvRWxlbWVudC5pc0EoXCJzYXAudWkubWRjLlRhYmxlXCIpIHx8IG9FbGVtZW50LmlzQShcInNhcC51aS5tZGMuQ2hhcnRcIikpIHtcblx0XHRcdFx0dGhpcy5iVGFibGVzQ2hhcnRzTG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdGFQcm9taXNlcy5wdXNoKHRoaXMucXVlcnlXYXRjaGVyLnJlZ2lzdGVyVGFibGVPckNoYXJ0KG9FbGVtZW50KSk7XG5cdFx0XHR9IGVsc2UgaWYgKG9FbGVtZW50LmlzQShcInNhcC5mZS5jb3JlLmNvbnRyb2xzLkZpbHRlckJhclwiKSkge1xuXHRcdFx0XHR0aGlzLnF1ZXJ5V2F0Y2hlci5yZWdpc3RlckZpbHRlckJhcihvRWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYVByb21pc2VzO1xuXHR9XG5cblx0QG1ldGhvZE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25BZnRlckJpbmRpbmcob0JpbmRpbmdDb250ZXh0PzogQ29udGV4dCkge1xuXHRcdGlmICh0aGlzLl9iQWZ0ZXJCaW5kaW5nQWxyZWFkeUFwcGxpZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9iQWZ0ZXJCaW5kaW5nQWxyZWFkeUFwcGxpZWQgPSB0cnVlO1xuXHRcdGlmICh0aGlzLmlzQ29udGV4dEV4cGVjdGVkKCkgJiYgb0JpbmRpbmdDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEZvcmNlIHRvIG1lbnRpb24gd2UgYXJlIGV4cGVjdGluZyBkYXRhXG5cdFx0XHR0aGlzLmJIYXNDb250ZXh0ID0gZmFsc2U7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYkhhc0NvbnRleHQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMuYXR0YWNoRXZlbnRPbmNlKFxuXHRcdFx0XCJwYWdlUmVhZHlcIixcblx0XHRcdG51bGwsXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX2JBZnRlckJpbmRpbmdBbHJlYWR5QXBwbGllZCA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLnF1ZXJ5V2F0Y2hlci5yZXNldCgpO1xuXHRcdFx0fSxcblx0XHRcdG51bGxcblx0XHQpO1xuXG5cdFx0dGhpcy5vbkFmdGVyQmluZGluZ1Byb21pc2UgPSBuZXcgUHJvbWlzZTx2b2lkPihhc3luYyAocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Y29uc3QgYVRhYmxlQ2hhcnRJbml0aWFsaXplZFByb21pc2VzID0gdGhpcy5yZWdpc3RlckFnZ3JlZ2F0ZWRDb250cm9scyhvQmluZGluZ0NvbnRleHQpO1xuXG5cdFx0XHRpZiAoYVRhYmxlQ2hhcnRJbml0aWFsaXplZFByb21pc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoYVRhYmxlQ2hhcnRJbml0aWFsaXplZFByb21pc2VzKTtcblx0XHRcdFx0dGhpcy5iVGFibGVzQ2hhcnRzTG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5jaGVja1BhZ2VSZWFkeURlYm91bmNlZCgpO1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRwdWJsaWMgaXNQYWdlUmVhZHkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2JJc1BhZ2VSZWFkeTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRwdWJsaWMgd2FpdFBhZ2VSZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzUGFnZVJlYWR5KCkpIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hdHRhY2hFdmVudE9uY2UoXG5cdFx0XHRcdFx0XCJwYWdlUmVhZHlcIixcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRoaXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRwdWJsaWMgYXR0YWNoRXZlbnRPbmNlKHNFdmVudElkOiBzdHJpbmcsIG9EYXRhOiBhbnksIGZuRnVuY3Rpb24/OiBGdW5jdGlvbiwgb0xpc3RlbmVyPzogYW55KSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1yZXN0LXBhcmFtc1xuXHRcdHJldHVybiB0aGlzLl9vRXZlbnRQcm92aWRlci5hdHRhY2hFdmVudE9uY2Uoc0V2ZW50SWQsIG9EYXRhLCBmbkZ1bmN0aW9uIGFzIEZ1bmN0aW9uLCBvTGlzdGVuZXIpO1xuXHR9XG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRwdWJsaWMgYXR0YWNoRXZlbnQoc0V2ZW50SWQ6IHN0cmluZywgb0RhdGE6IGFueSwgZm5GdW5jdGlvbjogRnVuY3Rpb24sIG9MaXN0ZW5lcjogYW55KSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1yZXN0LXBhcmFtc1xuXHRcdHJldHVybiB0aGlzLl9vRXZlbnRQcm92aWRlci5hdHRhY2hFdmVudChzRXZlbnRJZCwgb0RhdGEsIGZuRnVuY3Rpb24sIG9MaXN0ZW5lcik7XG5cdH1cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHB1YmxpYyBkZXRhY2hFdmVudChzRXZlbnRJZDogc3RyaW5nLCBmbkZ1bmN0aW9uOiBGdW5jdGlvbikge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcblx0XHRyZXR1cm4gdGhpcy5fb0V2ZW50UHJvdmlkZXIuZGV0YWNoRXZlbnQoc0V2ZW50SWQsIGZuRnVuY3Rpb24pO1xuXHR9XG5cdHByaXZhdGUgcmVnaXN0ZXJDb250YWluZXIob0NvbnRhaW5lcjogTWFuYWdlZE9iamVjdCkge1xuXHRcdHRoaXMuX29Db250YWluZXIgPSBvQ29udGFpbmVyO1xuXHRcdHRoaXMuX2ZuQ29udGFpbmVyRGVsZWdhdGUgPSB7XG5cdFx0XHRvbkJlZm9yZVNob3c6ICgpID0+IHtcblx0XHRcdFx0dGhpcy5iU2hvd24gPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0b25CZWZvcmVIaWRlOiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2JJc1BhZ2VSZWFkeSA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdG9uQWZ0ZXJTaG93OiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5vbkFmdGVyQmluZGluZ1Byb21pc2U/LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KHRydWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMuX29Db250YWluZXIuYWRkRXZlbnREZWxlZ2F0ZSh0aGlzLl9mbkNvbnRhaW5lckRlbGVnYXRlLCB0aGlzKTtcblx0fVxuXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uSW5zdGVhZClcblx0cHVibGljIGlzQ29udGV4dEV4cGVjdGVkKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRwdWJsaWMgY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQoKSB7XG5cdFx0aWYgKHRoaXMucGFnZVJlYWR5VGltZXIpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnBhZ2VSZWFkeVRpbWVyKTtcblx0XHR9XG5cdFx0dGhpcy5wYWdlUmVhZHlUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5fY2hlY2tQYWdlUmVhZHkoKTtcblx0XHR9LCAyMDApO1xuXHR9XG5cblx0cHVibGljIF9jaGVja1BhZ2VSZWFkeShiRnJvbU5hdjogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgZm5VSVVwZGF0ZWQgPSAoKSA9PiB7XG5cdFx0XHQvLyBXYWl0IHVudGlsIHRoZSBVSSBpcyBubyBsb25nZXIgZGlydHlcblx0XHRcdGlmICghQ29yZS5nZXRVSURpcnR5KCkpIHtcblx0XHRcdFx0Q29yZS5kZXRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHRoaXMuX2JXYWl0aW5nRm9yUmVmcmVzaCA9IGZhbHNlO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9jaGVja1BhZ2VSZWFkeSgpO1xuXHRcdFx0XHR9LCAyMCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIEluIGNhc2UgVUlVcGRhdGUgZG9lcyBub3QgZ2V0IGNhbGxlZCwgY2hlY2sgaWYgVUkgaXMgbm90IGRpcnR5IGFuZCB0aGVuIGNhbGwgX2NoZWNrUGFnZVJlYWR5XG5cdFx0Y29uc3QgY2hlY2tVSVVwZGF0ZWQgPSAoKSA9PiB7XG5cdFx0XHRpZiAoQ29yZS5nZXRVSURpcnR5KCkpIHtcblx0XHRcdFx0c2V0VGltZW91dChjaGVja1VJVXBkYXRlZCwgNTAwKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoKSB7XG5cdFx0XHRcdHRoaXMuX2JXYWl0aW5nRm9yUmVmcmVzaCA9IGZhbHNlO1xuXHRcdFx0XHRDb3JlLmRldGFjaEV2ZW50KFwiVUlVcGRhdGVkXCIsIGZuVUlVcGRhdGVkKTtcblx0XHRcdFx0dGhpcy5fY2hlY2tQYWdlUmVhZHkoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKFxuXHRcdFx0dGhpcy5iU2hvd24gJiZcblx0XHRcdHRoaXMucXVlcnlXYXRjaGVyLmlzRGF0YVJlY2VpdmVkKCkgIT09IGZhbHNlICYmXG5cdFx0XHR0aGlzLmJUYWJsZXNDaGFydHNMb2FkZWQgIT09IGZhbHNlICYmXG5cdFx0XHQoIXRoaXMuaXNDb250ZXh0RXhwZWN0ZWQoKSB8fCB0aGlzLmJIYXNDb250ZXh0KSAvLyBFaXRoZXIgbm8gY29udGV4dCBpcyBleHBlY3RlZCBvciB0aGVyZSBpcyBvbmVcblx0XHQpIHtcblx0XHRcdGlmICh0aGlzLnF1ZXJ5V2F0Y2hlci5pc0RhdGFSZWNlaXZlZCgpID09PSB0cnVlICYmICFiRnJvbU5hdiAmJiAhdGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoICYmIENvcmUuZ2V0VUlEaXJ0eSgpKSB7XG5cdFx0XHRcdC8vIElmIHdlIHJlcXVlc3RlZCBkYXRhIHdlIGdldCBub3RpZmllZCBhcyBzb29uIGFzIHRoZSBkYXRhIGFycml2ZWQsIHNvIGJlZm9yZSB0aGUgbmV4dCByZW5kZXJpbmcgdGlja1xuXHRcdFx0XHR0aGlzLnF1ZXJ5V2F0Y2hlci5yZXNldERhdGFSZWNlaXZlZCgpO1xuXHRcdFx0XHR0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggPSB0cnVlO1xuXHRcdFx0XHRDb3JlLmF0dGFjaEV2ZW50KFwiVUlVcGRhdGVkXCIsIGZuVUlVcGRhdGVkKTtcblx0XHRcdFx0c2V0VGltZW91dChjaGVja1VJVXBkYXRlZCwgNTAwKTtcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdCghdGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoICYmIENvcmUuZ2V0VUlEaXJ0eSgpKSB8fFxuXHRcdFx0XHR0aGlzLl9uYldhaXRzICE9PSAwIHx8XG5cdFx0XHRcdFRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeS5nZXROdW1iZXJPZlZpZXdzSW5DcmVhdGlvblN0YXRlKCkgPiAwIHx8XG5cdFx0XHRcdHRoaXMucXVlcnlXYXRjaGVyLmlzU2VhcmNoUGVuZGluZygpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gdHJ1ZTtcblx0XHRcdFx0Q29yZS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2gpIHtcblx0XHRcdFx0Ly8gSW4gdGhlIGNhc2Ugd2UncmUgbm90IHdhaXRpbmcgZm9yIGFueSBkYXRhIChuYXZpZ2F0aW5nIGJhY2sgdG8gYSBwYWdlIHdlIGFscmVhZHkgaGF2ZSBsb2FkZWQpXG5cdFx0XHRcdC8vIGp1c3Qgd2FpdCBmb3IgYSBmcmFtZSB0byBmaXJlIHRoZSBldmVudC5cblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwicGFnZVJlYWR5XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUJNQSw0QixXQURMQyxjQUFjLENBQUMsNENBQUQsQyxVQW9CYkMsY0FBYyxFLFVBc0NkQSxjQUFjLEUsVUFVZEMsZUFBZSxFLFVBQ2ZDLGNBQWMsRSxVQVdkRixjQUFjLENBQUMsVUFBRCxDLFVBSWRBLGNBQWMsQ0FBQyxVQUFELEMsVUEwQ2RBLGNBQWMsQ0FBQyxVQUFELEMsVUF3Q2RDLGVBQWUsRSxXQUNmQyxjQUFjLEUsV0FLZEQsZUFBZSxFLFdBQ2ZDLGNBQWMsRSxXQWtCZEQsZUFBZSxFLFdBQ2ZDLGNBQWMsRSxXQUtkRCxlQUFlLEUsV0FDZkMsY0FBYyxFLFdBS2RELGVBQWUsRSxXQUNmQyxjQUFjLEUsV0EwQmRDLGdCQUFnQixFLFdBQ2hCQyxVQUFVLENB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