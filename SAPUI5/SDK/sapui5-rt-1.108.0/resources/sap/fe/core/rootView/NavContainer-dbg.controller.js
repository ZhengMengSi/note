/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/ViewState", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/KeepAliveHelper", "sap/m/Link", "sap/m/MessageBox", "sap/m/MessagePage", "./RootViewBaseController"], function (Log, CommonUtils, ViewState, ClassSupport, KeepAliveHelper, Link, MessageBox, MessagePage, BaseController) {
  "use strict";

  var _dec, _dec2, _class, _class2, _descriptor;

  var Icon = MessageBox.Icon;
  var Action = MessageBox.Action;
  var usingExtension = ClassSupport.usingExtension;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Base controller class for your own root view with a sap.m.NavContainer control.
   *
   * By using or extending this controller you can use your own root view with the sap.fe.core.AppComponent and
   * you can make use of SAP Fiori elements pages and SAP Fiori elements building blocks.
   *
   * @hideconstructor
   * @public
   * @since 1.108.0
   */
  var NavContainerController = (_dec = defineUI5Class("sap.fe.core.rootView.NavContainer"), _dec2 = usingExtension(ViewState.override({
    applyInitialStateOnly: function () {
      return false;
    },
    adaptBindingRefreshControls: function (aControls) {
      var oView = this.getView(),
          oController = oView.getController();
      aControls.push(oController._getCurrentPage(oView));
    },
    adaptStateControls: function (aStateControls) {
      var oView = this.getView(),
          oController = oView.getController();
      aStateControls.push(oController._getCurrentPage(oView));
    },
    onRestore: function () {
      var oView = this.getView(),
          oController = oView.getController(),
          oNavContainer = oController.getAppContentContainer(oView);
      var oInternalModel = oNavContainer.getModel("internal");
      var oPages = oInternalModel.getProperty("/pages");

      for (var sComponentId in oPages) {
        oInternalModel.setProperty("/pages/".concat(sComponentId, "/restoreStatus"), "pending");
      }

      oController.onContainerReady();
    },
    onSuspend: function () {
      var oView = this.getView(),
          oNavController = oView.getController(),
          oNavContainer = oNavController.getAppContentContainer(oView);
      var aPages = oNavContainer.getPages();
      aPages.forEach(function (oPage) {
        var oTargetView = CommonUtils.getTargetView(oPage);
        var oController = oTargetView && oTargetView.getController();

        if (oController && oController.viewState && oController.viewState.onSuspend) {
          oController.viewState.onSuspend();
        }
      });
    }
  })), _dec(_class = (_class2 = /*#__PURE__*/function (_BaseController) {
    _inheritsLoose(NavContainerController, _BaseController);

    function NavContainerController() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _BaseController.call.apply(_BaseController, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "viewState", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    var _proto = NavContainerController.prototype;

    _proto.onContainerReady = function onContainerReady() {
      // Restore views if neccessary.
      var oView = this.getView(),
          oPagePromise = this._getCurrentPage(oView);

      return oPagePromise.then(function (oCurrentPage) {
        var oTargetView = CommonUtils.getTargetView(oCurrentPage);
        return KeepAliveHelper.restoreView(oTargetView);
      });
    };

    _proto._getCurrentPage = function _getCurrentPage(oView) {
      var oNavContainer = this.getAppContentContainer(oView);
      return new Promise(function (resolve) {
        var oCurrentPage = oNavContainer.getCurrentPage();

        if (oCurrentPage && oCurrentPage.getController && oCurrentPage.getController().isPlaceholder && oCurrentPage.getController().isPlaceholder()) {
          oCurrentPage.getController().attachEventOnce("targetPageInsertedInContainer", function (oEvent) {
            var oTargetPage = oEvent.getParameter("targetpage");
            var oTargetView = CommonUtils.getTargetView(oTargetPage);
            resolve(oTargetView !== oView && oTargetView);
          });
        } else {
          var oTargetView = CommonUtils.getTargetView(oCurrentPage);
          resolve(oTargetView !== oView && oTargetView);
        }
      });
    }
    /**
     * @private
     * @name sap.fe.core.rootView.NavContainer.getMetadata
     * @function
     */
    ;

    _proto._getNavContainer = function _getNavContainer() {
      return this.getView().getContent()[0];
    }
    /**
     * Gets the instanced views in the navContainer component.
     *
     * @returns {Array} Return the views.
     */
    ;

    _proto.getInstancedViews = function getInstancedViews() {
      return this._getNavContainer().getPages().map(function (oPage) {
        return oPage.getComponentInstance().getRootControl();
      });
    }
    /**
     * Check if the FCL component is enabled.
     *
     * @function
     * @name sap.fe.core.rootView.NavContainer.controller#isFclEnabled
     * @memberof sap.fe.core.rootView.NavContainer.controller
     * @returns `false` since we are not in FCL scenario
     * @ui5-restricted
     * @final
     */
    ;

    _proto.isFclEnabled = function isFclEnabled() {
      return false;
    };

    _proto._scrollTablesToLastNavigatedItems = function _scrollTablesToLastNavigatedItems() {// Do nothing
    };

    _proto.displayMessagePage = function displayMessagePage(sErrorMessage, mParameters) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          var oNavContainer = _this2._getNavContainer();

          if (!_this2.oMessagePage) {
            _this2.oMessagePage = new MessagePage({
              showHeader: false,
              icon: "sap-icon://message-error"
            });
            oNavContainer.addPage(_this2.oMessagePage);
          }

          _this2.oMessagePage.setText(sErrorMessage);

          if (mParameters.technicalMessage) {
            _this2.oMessagePage.setCustomDescription(new Link({
              text: mParameters.description || mParameters.technicalMessage,
              press: function () {
                MessageBox.show(mParameters.technicalMessage, {
                  icon: Icon.ERROR,
                  title: mParameters.title,
                  actions: [Action.OK],
                  defaultAction: Action.OK,
                  details: mParameters.technicalDetails || "",
                  contentWidth: "60%"
                });
              }
            }));
          } else {
            _this2.oMessagePage.setDescription(mParameters.description || "");
          }

          if (mParameters.handleShellBack) {
            var oErrorOriginPage = oNavContainer.getCurrentPage(),
                oAppComponent = CommonUtils.getAppComponent(oNavContainer.getCurrentPage());
            oAppComponent.getShellServices().setBackNavigation(function () {
              oNavContainer.to(oErrorOriginPage.getId());
              oAppComponent.getShellServices().setBackNavigation();
            });
          }

          oNavContainer.attachAfterNavigate(function () {
            resolve(true);
          });
          oNavContainer.to(_this2.oMessagePage.getId());
        } catch (e) {
          reject(false);
          Log.info(e);
        }
      });
    };

    return NavContainerController;
  }(BaseController), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "viewState", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return NavContainerController;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOYXZDb250YWluZXJDb250cm9sbGVyIiwiZGVmaW5lVUk1Q2xhc3MiLCJ1c2luZ0V4dGVuc2lvbiIsIlZpZXdTdGF0ZSIsIm92ZXJyaWRlIiwiYXBwbHlJbml0aWFsU3RhdGVPbmx5IiwiYWRhcHRCaW5kaW5nUmVmcmVzaENvbnRyb2xzIiwiYUNvbnRyb2xzIiwib1ZpZXciLCJnZXRWaWV3Iiwib0NvbnRyb2xsZXIiLCJnZXRDb250cm9sbGVyIiwicHVzaCIsIl9nZXRDdXJyZW50UGFnZSIsImFkYXB0U3RhdGVDb250cm9scyIsImFTdGF0ZUNvbnRyb2xzIiwib25SZXN0b3JlIiwib05hdkNvbnRhaW5lciIsImdldEFwcENvbnRlbnRDb250YWluZXIiLCJvSW50ZXJuYWxNb2RlbCIsImdldE1vZGVsIiwib1BhZ2VzIiwiZ2V0UHJvcGVydHkiLCJzQ29tcG9uZW50SWQiLCJzZXRQcm9wZXJ0eSIsIm9uQ29udGFpbmVyUmVhZHkiLCJvblN1c3BlbmQiLCJvTmF2Q29udHJvbGxlciIsImFQYWdlcyIsImdldFBhZ2VzIiwiZm9yRWFjaCIsIm9QYWdlIiwib1RhcmdldFZpZXciLCJDb21tb25VdGlscyIsImdldFRhcmdldFZpZXciLCJ2aWV3U3RhdGUiLCJvUGFnZVByb21pc2UiLCJ0aGVuIiwib0N1cnJlbnRQYWdlIiwiS2VlcEFsaXZlSGVscGVyIiwicmVzdG9yZVZpZXciLCJQcm9taXNlIiwicmVzb2x2ZSIsImdldEN1cnJlbnRQYWdlIiwiaXNQbGFjZWhvbGRlciIsImF0dGFjaEV2ZW50T25jZSIsIm9FdmVudCIsIm9UYXJnZXRQYWdlIiwiZ2V0UGFyYW1ldGVyIiwiX2dldE5hdkNvbnRhaW5lciIsImdldENvbnRlbnQiLCJnZXRJbnN0YW5jZWRWaWV3cyIsIm1hcCIsImdldENvbXBvbmVudEluc3RhbmNlIiwiZ2V0Um9vdENvbnRyb2wiLCJpc0ZjbEVuYWJsZWQiLCJfc2Nyb2xsVGFibGVzVG9MYXN0TmF2aWdhdGVkSXRlbXMiLCJkaXNwbGF5TWVzc2FnZVBhZ2UiLCJzRXJyb3JNZXNzYWdlIiwibVBhcmFtZXRlcnMiLCJyZWplY3QiLCJvTWVzc2FnZVBhZ2UiLCJNZXNzYWdlUGFnZSIsInNob3dIZWFkZXIiLCJpY29uIiwiYWRkUGFnZSIsInNldFRleHQiLCJ0ZWNobmljYWxNZXNzYWdlIiwic2V0Q3VzdG9tRGVzY3JpcHRpb24iLCJMaW5rIiwidGV4dCIsImRlc2NyaXB0aW9uIiwicHJlc3MiLCJNZXNzYWdlQm94Iiwic2hvdyIsIkljb24iLCJFUlJPUiIsInRpdGxlIiwiYWN0aW9ucyIsIkFjdGlvbiIsIk9LIiwiZGVmYXVsdEFjdGlvbiIsImRldGFpbHMiLCJ0ZWNobmljYWxEZXRhaWxzIiwiY29udGVudFdpZHRoIiwic2V0RGVzY3JpcHRpb24iLCJoYW5kbGVTaGVsbEJhY2siLCJvRXJyb3JPcmlnaW5QYWdlIiwib0FwcENvbXBvbmVudCIsImdldEFwcENvbXBvbmVudCIsImdldFNoZWxsU2VydmljZXMiLCJzZXRCYWNrTmF2aWdhdGlvbiIsInRvIiwiZ2V0SWQiLCJhdHRhY2hBZnRlck5hdmlnYXRlIiwiZSIsIkxvZyIsImluZm8iLCJCYXNlQ29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiTmF2Q29udGFpbmVyLmNvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgVmlld1N0YXRlIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9WaWV3U3RhdGVcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCB1c2luZ0V4dGVuc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IEtlZXBBbGl2ZUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9LZWVwQWxpdmVIZWxwZXJcIjtcbmltcG9ydCBMaW5rIGZyb20gXCJzYXAvbS9MaW5rXCI7XG5pbXBvcnQgTWVzc2FnZUJveCwgeyBBY3Rpb24sIEljb24gfSBmcm9tIFwic2FwL20vTWVzc2FnZUJveFwiO1xuaW1wb3J0IE1lc3NhZ2VQYWdlIGZyb20gXCJzYXAvbS9NZXNzYWdlUGFnZVwiO1xuaW1wb3J0IHR5cGUgTmF2Q29udGFpbmVyIGZyb20gXCJzYXAvbS9OYXZDb250YWluZXJcIjtcbmltcG9ydCBDb21wb25lbnRDb250YWluZXIgZnJvbSBcInNhcC91aS9jb3JlL0NvbXBvbmVudENvbnRhaW5lclwiO1xuaW1wb3J0IFhNTFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9YTUxWaWV3XCI7XG5pbXBvcnQgdHlwZSBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IEJhc2VDb250cm9sbGVyIGZyb20gXCIuL1Jvb3RWaWV3QmFzZUNvbnRyb2xsZXJcIjtcblxuLyoqXG4gKiBCYXNlIGNvbnRyb2xsZXIgY2xhc3MgZm9yIHlvdXIgb3duIHJvb3QgdmlldyB3aXRoIGEgc2FwLm0uTmF2Q29udGFpbmVyIGNvbnRyb2wuXG4gKlxuICogQnkgdXNpbmcgb3IgZXh0ZW5kaW5nIHRoaXMgY29udHJvbGxlciB5b3UgY2FuIHVzZSB5b3VyIG93biByb290IHZpZXcgd2l0aCB0aGUgc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50IGFuZFxuICogeW91IGNhbiBtYWtlIHVzZSBvZiBTQVAgRmlvcmkgZWxlbWVudHMgcGFnZXMgYW5kIFNBUCBGaW9yaSBlbGVtZW50cyBidWlsZGluZyBibG9ja3MuXG4gKlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICogQHNpbmNlIDEuMTA4LjBcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUucm9vdFZpZXcuTmF2Q29udGFpbmVyXCIpXG5jbGFzcyBOYXZDb250YWluZXJDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXIge1xuXHRAdXNpbmdFeHRlbnNpb24oXG5cdFx0Vmlld1N0YXRlLm92ZXJyaWRlKHtcblx0XHRcdGFwcGx5SW5pdGlhbFN0YXRlT25seTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0YWRhcHRCaW5kaW5nUmVmcmVzaENvbnRyb2xzOiBmdW5jdGlvbiAodGhpczogVmlld1N0YXRlLCBhQ29udHJvbHM6IGFueSkge1xuXHRcdFx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0XHRcdG9Db250cm9sbGVyID0gb1ZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIE5hdkNvbnRhaW5lckNvbnRyb2xsZXI7XG5cdFx0XHRcdGFDb250cm9scy5wdXNoKG9Db250cm9sbGVyLl9nZXRDdXJyZW50UGFnZShvVmlldykpO1xuXHRcdFx0fSxcblx0XHRcdGFkYXB0U3RhdGVDb250cm9sczogZnVuY3Rpb24gKHRoaXM6IFZpZXdTdGF0ZSwgYVN0YXRlQ29udHJvbHM6IGFueSkge1xuXHRcdFx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0XHRcdG9Db250cm9sbGVyID0gb1ZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIE5hdkNvbnRhaW5lckNvbnRyb2xsZXI7XG5cdFx0XHRcdGFTdGF0ZUNvbnRyb2xzLnB1c2gob0NvbnRyb2xsZXIuX2dldEN1cnJlbnRQYWdlKG9WaWV3KSk7XG5cdFx0XHR9LFxuXHRcdFx0b25SZXN0b3JlOiBmdW5jdGlvbiAodGhpczogVmlld1N0YXRlKSB7XG5cdFx0XHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCksXG5cdFx0XHRcdFx0b0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgTmF2Q29udGFpbmVyQ29udHJvbGxlcixcblx0XHRcdFx0XHRvTmF2Q29udGFpbmVyID0gb0NvbnRyb2xsZXIuZ2V0QXBwQ29udGVudENvbnRhaW5lcihvVmlldyk7XG5cdFx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsID0gb05hdkNvbnRhaW5lci5nZXRNb2RlbChcImludGVybmFsXCIpIGFzIEpTT05Nb2RlbDtcblx0XHRcdFx0Y29uc3Qgb1BhZ2VzID0gb0ludGVybmFsTW9kZWwuZ2V0UHJvcGVydHkoXCIvcGFnZXNcIik7XG5cblx0XHRcdFx0Zm9yIChjb25zdCBzQ29tcG9uZW50SWQgaW4gb1BhZ2VzKSB7XG5cdFx0XHRcdFx0b0ludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoYC9wYWdlcy8ke3NDb21wb25lbnRJZH0vcmVzdG9yZVN0YXR1c2AsIFwicGVuZGluZ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvQ29udHJvbGxlci5vbkNvbnRhaW5lclJlYWR5KCk7XG5cdFx0XHR9LFxuXHRcdFx0b25TdXNwZW5kOiBmdW5jdGlvbiAodGhpczogVmlld1N0YXRlKSB7XG5cdFx0XHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCksXG5cdFx0XHRcdFx0b05hdkNvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgTmF2Q29udGFpbmVyQ29udHJvbGxlcixcblx0XHRcdFx0XHRvTmF2Q29udGFpbmVyID0gb05hdkNvbnRyb2xsZXIuZ2V0QXBwQ29udGVudENvbnRhaW5lcihvVmlldykgYXMgTmF2Q29udGFpbmVyO1xuXHRcdFx0XHRjb25zdCBhUGFnZXMgPSBvTmF2Q29udGFpbmVyLmdldFBhZ2VzKCk7XG5cdFx0XHRcdGFQYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChvUGFnZTogYW55KSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1RhcmdldFZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KG9QYWdlKTtcblxuXHRcdFx0XHRcdGNvbnN0IG9Db250cm9sbGVyID0gb1RhcmdldFZpZXcgJiYgb1RhcmdldFZpZXcuZ2V0Q29udHJvbGxlcigpO1xuXHRcdFx0XHRcdGlmIChvQ29udHJvbGxlciAmJiBvQ29udHJvbGxlci52aWV3U3RhdGUgJiYgb0NvbnRyb2xsZXIudmlld1N0YXRlLm9uU3VzcGVuZCkge1xuXHRcdFx0XHRcdFx0b0NvbnRyb2xsZXIudmlld1N0YXRlLm9uU3VzcGVuZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0KVxuXHR2aWV3U3RhdGUhOiBWaWV3U3RhdGU7XG5cdHByaXZhdGUgb01lc3NhZ2VQYWdlPzogTWVzc2FnZVBhZ2U7XG5cblx0b25Db250YWluZXJSZWFkeSgpIHtcblx0XHQvLyBSZXN0b3JlIHZpZXdzIGlmIG5lY2Nlc3NhcnkuXG5cdFx0Y29uc3Qgb1ZpZXcgPSB0aGlzLmdldFZpZXcoKSxcblx0XHRcdG9QYWdlUHJvbWlzZSA9IHRoaXMuX2dldEN1cnJlbnRQYWdlKG9WaWV3KTtcblxuXHRcdHJldHVybiBvUGFnZVByb21pc2UudGhlbihmdW5jdGlvbiAob0N1cnJlbnRQYWdlOiBhbnkpIHtcblx0XHRcdGNvbnN0IG9UYXJnZXRWaWV3ID0gQ29tbW9uVXRpbHMuZ2V0VGFyZ2V0VmlldyhvQ3VycmVudFBhZ2UpO1xuXHRcdFx0cmV0dXJuIEtlZXBBbGl2ZUhlbHBlci5yZXN0b3JlVmlldyhvVGFyZ2V0Vmlldyk7XG5cdFx0fSk7XG5cdH1cblxuXHRfZ2V0Q3VycmVudFBhZ2UodGhpczogTmF2Q29udGFpbmVyQ29udHJvbGxlciwgb1ZpZXc6IGFueSkge1xuXHRcdGNvbnN0IG9OYXZDb250YWluZXIgPSB0aGlzLmdldEFwcENvbnRlbnRDb250YWluZXIob1ZpZXcpIGFzIE5hdkNvbnRhaW5lcjtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG5cdFx0XHRjb25zdCBvQ3VycmVudFBhZ2UgPSBvTmF2Q29udGFpbmVyLmdldEN1cnJlbnRQYWdlKCkgYXMgYW55O1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRvQ3VycmVudFBhZ2UgJiZcblx0XHRcdFx0b0N1cnJlbnRQYWdlLmdldENvbnRyb2xsZXIgJiZcblx0XHRcdFx0b0N1cnJlbnRQYWdlLmdldENvbnRyb2xsZXIoKS5pc1BsYWNlaG9sZGVyICYmXG5cdFx0XHRcdG9DdXJyZW50UGFnZS5nZXRDb250cm9sbGVyKCkuaXNQbGFjZWhvbGRlcigpXG5cdFx0XHQpIHtcblx0XHRcdFx0b0N1cnJlbnRQYWdlLmdldENvbnRyb2xsZXIoKS5hdHRhY2hFdmVudE9uY2UoXCJ0YXJnZXRQYWdlSW5zZXJ0ZWRJbkNvbnRhaW5lclwiLCBmdW5jdGlvbiAob0V2ZW50OiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBvVGFyZ2V0UGFnZSA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJ0YXJnZXRwYWdlXCIpO1xuXHRcdFx0XHRcdGNvbnN0IG9UYXJnZXRWaWV3ID0gQ29tbW9uVXRpbHMuZ2V0VGFyZ2V0VmlldyhvVGFyZ2V0UGFnZSk7XG5cdFx0XHRcdFx0cmVzb2x2ZShvVGFyZ2V0VmlldyAhPT0gb1ZpZXcgJiYgb1RhcmdldFZpZXcpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG9UYXJnZXRWaWV3ID0gQ29tbW9uVXRpbHMuZ2V0VGFyZ2V0VmlldyhvQ3VycmVudFBhZ2UpO1xuXHRcdFx0XHRyZXNvbHZlKG9UYXJnZXRWaWV3ICE9PSBvVmlldyAmJiBvVGFyZ2V0Vmlldyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUucm9vdFZpZXcuTmF2Q29udGFpbmVyLmdldE1ldGFkYXRhXG5cdCAqIEBmdW5jdGlvblxuXHQgKi9cblxuXHRfZ2V0TmF2Q29udGFpbmVyKCkge1xuXHRcdHJldHVybiB0aGlzLmdldFZpZXcoKS5nZXRDb250ZW50KClbMF07XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgaW5zdGFuY2VkIHZpZXdzIGluIHRoZSBuYXZDb250YWluZXIgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybiB0aGUgdmlld3MuXG5cdCAqL1xuXHRnZXRJbnN0YW5jZWRWaWV3cygpOiBYTUxWaWV3W10ge1xuXHRcdHJldHVybiAoKHRoaXMuX2dldE5hdkNvbnRhaW5lcigpIGFzIE5hdkNvbnRhaW5lcikuZ2V0UGFnZXMoKSBhcyBDb21wb25lbnRDb250YWluZXJbXSkubWFwKChvUGFnZSkgPT5cblx0XHRcdChvUGFnZSBhcyBhbnkpLmdldENvbXBvbmVudEluc3RhbmNlKCkuZ2V0Um9vdENvbnRyb2woKVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlIEZDTCBjb21wb25lbnQgaXMgZW5hYmxlZC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLnJvb3RWaWV3Lk5hdkNvbnRhaW5lci5jb250cm9sbGVyI2lzRmNsRW5hYmxlZFxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUucm9vdFZpZXcuTmF2Q29udGFpbmVyLmNvbnRyb2xsZXJcblx0ICogQHJldHVybnMgYGZhbHNlYCBzaW5jZSB3ZSBhcmUgbm90IGluIEZDTCBzY2VuYXJpb1xuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQGZpbmFsXG5cdCAqL1xuXHRpc0ZjbEVuYWJsZWQoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0X3Njcm9sbFRhYmxlc1RvTGFzdE5hdmlnYXRlZEl0ZW1zKCkge1xuXHRcdC8vIERvIG5vdGhpbmdcblx0fVxuXG5cdGRpc3BsYXlNZXNzYWdlUGFnZShzRXJyb3JNZXNzYWdlOiBhbnksIG1QYXJhbWV0ZXJzOiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IG9OYXZDb250YWluZXIgPSB0aGlzLl9nZXROYXZDb250YWluZXIoKSBhcyBOYXZDb250YWluZXI7XG5cblx0XHRcdFx0aWYgKCF0aGlzLm9NZXNzYWdlUGFnZSkge1xuXHRcdFx0XHRcdHRoaXMub01lc3NhZ2VQYWdlID0gbmV3IE1lc3NhZ2VQYWdlKHtcblx0XHRcdFx0XHRcdHNob3dIZWFkZXI6IGZhbHNlLFxuXHRcdFx0XHRcdFx0aWNvbjogXCJzYXAtaWNvbjovL21lc3NhZ2UtZXJyb3JcIlxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0b05hdkNvbnRhaW5lci5hZGRQYWdlKHRoaXMub01lc3NhZ2VQYWdlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMub01lc3NhZ2VQYWdlLnNldFRleHQoc0Vycm9yTWVzc2FnZSk7XG5cblx0XHRcdFx0aWYgKG1QYXJhbWV0ZXJzLnRlY2huaWNhbE1lc3NhZ2UpIHtcblx0XHRcdFx0XHR0aGlzLm9NZXNzYWdlUGFnZS5zZXRDdXN0b21EZXNjcmlwdGlvbihcblx0XHRcdFx0XHRcdG5ldyBMaW5rKHtcblx0XHRcdFx0XHRcdFx0dGV4dDogbVBhcmFtZXRlcnMuZGVzY3JpcHRpb24gfHwgbVBhcmFtZXRlcnMudGVjaG5pY2FsTWVzc2FnZSxcblx0XHRcdFx0XHRcdFx0cHJlc3M6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRNZXNzYWdlQm94LnNob3cobVBhcmFtZXRlcnMudGVjaG5pY2FsTWVzc2FnZSwge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogSWNvbi5FUlJPUixcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBtUGFyYW1ldGVycy50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGFjdGlvbnM6IFtBY3Rpb24uT0tdLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVmYXVsdEFjdGlvbjogQWN0aW9uLk9LLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGV0YWlsczogbVBhcmFtZXRlcnMudGVjaG5pY2FsRGV0YWlscyB8fCBcIlwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGVudFdpZHRoOiBcIjYwJVwiXG5cdFx0XHRcdFx0XHRcdFx0fSBhcyBhbnkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5vTWVzc2FnZVBhZ2Uuc2V0RGVzY3JpcHRpb24obVBhcmFtZXRlcnMuZGVzY3JpcHRpb24gfHwgXCJcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobVBhcmFtZXRlcnMuaGFuZGxlU2hlbGxCYWNrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb0Vycm9yT3JpZ2luUGFnZSA9IG9OYXZDb250YWluZXIuZ2V0Q3VycmVudFBhZ2UoKSxcblx0XHRcdFx0XHRcdG9BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQob05hdkNvbnRhaW5lci5nZXRDdXJyZW50UGFnZSgpKTtcblx0XHRcdFx0XHRvQXBwQ29tcG9uZW50LmdldFNoZWxsU2VydmljZXMoKS5zZXRCYWNrTmF2aWdhdGlvbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQob05hdkNvbnRhaW5lciBhcyBhbnkpLnRvKG9FcnJvck9yaWdpblBhZ2UuZ2V0SWQoKSk7XG5cdFx0XHRcdFx0XHRvQXBwQ29tcG9uZW50LmdldFNoZWxsU2VydmljZXMoKS5zZXRCYWNrTmF2aWdhdGlvbigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9OYXZDb250YWluZXIuYXR0YWNoQWZ0ZXJOYXZpZ2F0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdChvTmF2Q29udGFpbmVyIGFzIGFueSkudG8odGhpcy5vTWVzc2FnZVBhZ2UuZ2V0SWQoKSk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHJlamVjdChmYWxzZSk7XG5cdFx0XHRcdExvZy5pbmZvKGUgYXMgYW55KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYXZDb250YWluZXJDb250cm9sbGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7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