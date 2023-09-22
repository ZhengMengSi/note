/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/AppStateHandler", "sap/fe/core/controllerextensions/routing/RouterProxy", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/library", "sap/fe/core/support/Diagnostics", "sap/fe/macros/internal/valuehelp/ValueListHelper", "sap/ui/core/Core", "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "./converters/MetaModelConverter", "./helpers/SemanticDateOperators"], function (Log, AppStateHandler, RouterProxy, ClassSupport, ModelHelper, library, Diagnostics, ValueListHelper, Core, UIComponent, JSONModel, MetaModelConverter, SemanticDateOperators) {
  "use strict";

  var _dec, _class, _class2;

  var deleteModelCacheData = MetaModelConverter.deleteModelCacheData;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var StartupMode = library.StartupMode;
  var NAVCONF = {
    FCL: {
      VIEWNAME: "sap.fe.core.rootView.Fcl",
      VIEWNAME_COMPATIBILITY: "sap.fe.templates.RootContainer.view.Fcl",
      ROUTERCLASS: "sap.f.routing.Router"
    },
    NAVCONTAINER: {
      VIEWNAME: "sap.fe.core.rootView.NavContainer",
      VIEWNAME_COMPATIBILITY: "sap.fe.templates.RootContainer.view.NavContainer",
      ROUTERCLASS: "sap.m.routing.Router"
    }
  };
  /**
   * Main class for components used for an application in SAP Fiori elements.
   *
   * Application developers using the templates and building blocks provided by SAP Fiori elements should create their apps by extending this component.
   * This ensures that all the necessary services that you need for the building blocks and templates to work properly are started.
   *
   * When you use sap.fe.core.AppComponent as the base component, you also need to use a rootView. SAP Fiori elements provides two options: <br/>
   *  - sap.fe.core.rootView.NavContainer when using sap.m.routing.Router <br/>
   *  - sap.fe.core.rootView.Fcl when using sap.f.routing.Router (FCL use case) <br/>
   *
   * @hideconstructor
   * @public
   * @name sap.fe.core.AppComponent
   */

  var AppComponent = (_dec = defineUI5Class("sap.fe.core.AppComponent", {
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
    config: {
      fullWidth: true
    },
    manifest: {
      "sap.ui5": {
        services: {
          resourceModel: {
            factoryName: "sap.fe.core.services.ResourceModelService",
            "startup": "waitFor",
            "settings": {
              "bundles": ["sap.fe.core.messagebundle"],
              "modelName": "sap.fe.i18n"
            }
          },
          routingService: {
            factoryName: "sap.fe.core.services.RoutingService",
            startup: "waitFor"
          },
          shellServices: {
            factoryName: "sap.fe.core.services.ShellServices",
            startup: "waitFor"
          },
          ShellUIService: {
            factoryName: "sap.ushell.ui5service.ShellUIService"
          },
          navigationService: {
            factoryName: "sap.fe.core.services.NavigationService",
            startup: "waitFor"
          },
          environmentCapabilities: {
            factoryName: "sap.fe.core.services.EnvironmentService",
            startup: "waitFor"
          },
          sideEffectsService: {
            factoryName: "sap.fe.core.services.SideEffectsService",
            startup: "waitFor"
          },
          asyncComponentService: {
            factoryName: "sap.fe.core.services.AsyncComponentService",
            startup: "waitFor"
          }
        },
        rootView: {
          viewName: NAVCONF.NAVCONTAINER.VIEWNAME,
          type: "XML",
          async: true,
          id: "appRootView"
        },
        routing: {
          config: {
            controlId: "appContent",
            routerClass: NAVCONF.NAVCONTAINER.ROUTERCLASS,
            viewType: "XML",
            controlAggregation: "pages",
            async: true,
            containerOptions: {
              propagateModel: true
            }
          }
        }
      }
    },
    designtime: "sap/fe/core/designtime/AppComponent.designtime",
    library: "sap.fe.core"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_UIComponent) {
    _inheritsLoose(AppComponent, _UIComponent);

    function AppComponent() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _UIComponent.call.apply(_UIComponent, [this].concat(args)) || this;
      _this.startupMode = StartupMode.Normal;
      return _this;
    }

    var _proto = AppComponent.prototype;

    /**
     * @private
     * @name sap.fe.core.AppComponent.getMetadata
     * @function
     */
    _proto._isFclEnabled = function _isFclEnabled() {
      var _oManifestUI5$rootVie, _oManifestUI5$rootVie2;

      var oManifestUI5 = this.getManifestEntry("/sap.ui5");
      return (oManifestUI5 === null || oManifestUI5 === void 0 ? void 0 : (_oManifestUI5$rootVie = oManifestUI5.rootView) === null || _oManifestUI5$rootVie === void 0 ? void 0 : _oManifestUI5$rootVie.viewName) === NAVCONF.FCL.VIEWNAME || (oManifestUI5 === null || oManifestUI5 === void 0 ? void 0 : (_oManifestUI5$rootVie2 = oManifestUI5.rootView) === null || _oManifestUI5$rootVie2 === void 0 ? void 0 : _oManifestUI5$rootVie2.viewName) === NAVCONF.FCL.VIEWNAME_COMPATIBILITY;
    }
    /**
     * Get a reference to the RouterProxy.
     *
     * @function
     * @name sap.fe.core.AppComponent#getRouterProxy
     * @memberof sap.fe.core.AppComponent
     * @returns A Reference to the RouterProxy
     * @ui5-restricted
     * @final
     */
    ;

    _proto.getRouterProxy = function getRouterProxy() {
      return this._oRouterProxy;
    }
    /**
     * Get a reference to the AppStateHandler.
     *
     * @function
     * @name sap.fe.core.AppComponent#getAppStateHandler
     * @memberof sap.fe.core.AppComponent
     * @returns A reference to the AppStateHandler
     * @ui5-restricted
     * @final
     */
    ;

    _proto.getAppStateHandler = function getAppStateHandler() {
      return this._oAppStateHandler;
    }
    /**
     * Get a reference to the nav/FCL Controller.
     *
     * @function
     * @name sap.fe.core.AppComponent#getRootViewController
     * @memberof sap.fe.core.AppComponent
     * @returns  A reference to the FCL Controller
     * @ui5-restricted
     * @final
     */
    ;

    _proto.getRootViewController = function getRootViewController() {
      return this.getRootControl().getController();
    }
    /**
     * Get the NavContainer control or the FCL control.
     *
     * @function
     * @name sap.fe.core.AppComponent#getRootContainer
     * @memberof sap.fe.core.AppComponent
     * @returns  A reference to NavContainer control or the FCL control
     * @ui5-restricted
     * @final
     */
    ;

    _proto.getRootContainer = function getRootContainer() {
      return this.getRootControl().getContent()[0];
    }
    /**
     * Get the startup mode of the app.
     *
     * @returns The startup mode
     * @private
     */
    ;

    _proto.getStartupMode = function getStartupMode() {
      return this.startupMode;
    }
    /**
     * Set the startup mode for the app to 'Create'.
     *
     * @private
     */
    ;

    _proto.setStartupModeCreate = function setStartupModeCreate() {
      this.startupMode = StartupMode.Create;
    }
    /**
     * Set the startup mode for the app to 'AutoCreate'.
     *
     * @private
     */
    ;

    _proto.setStartupModeAutoCreate = function setStartupModeAutoCreate() {
      this.startupMode = StartupMode.AutoCreate;
    }
    /**
     * Set the startup mode for the app to 'Deeplink'.
     *
     * @private
     */
    ;

    _proto.setStartupModeDeeplink = function setStartupModeDeeplink() {
      this.startupMode = StartupMode.Deeplink;
    };

    _proto.init = function init() {
      var _oModel$isA, _oManifestUI5$rootVie3;

      var uiModel = new JSONModel({
        editMode: library.EditMode.Display,
        isEditable: false,
        draftStatus: library.DraftStatus.Clear,
        busy: false,
        busyLocal: {},
        pages: {}
      });
      var oInternalModel = new JSONModel({
        pages: {}
      }); // set the binding OneWay for uiModel to prevent changes if controller extensions modify a bound property of a control

      uiModel.setDefaultBindingMode("OneWay"); // for internal model binding needs to be two way

      ModelHelper.enhanceUiJSONModel(uiModel, library);
      ModelHelper.enhanceInternalJSONModel(oInternalModel);
      this.setModel(uiModel, "ui");
      this.setModel(oInternalModel, "internal");
      this.bInitializeRouting = this.bInitializeRouting !== undefined ? this.bInitializeRouting : true;
      this._oRouterProxy = new RouterProxy();
      this._oAppStateHandler = new AppStateHandler(this);
      this._oDiagnostics = new Diagnostics();
      var oModel = this.getModel();

      if (oModel !== null && oModel !== void 0 && (_oModel$isA = oModel.isA) !== null && _oModel$isA !== void 0 && _oModel$isA.call(oModel, "sap.ui.model.odata.v4.ODataModel")) {
        this.entityContainer = oModel.getMetaModel().requestObject("/$EntityContainer/");
      } else {
        // not an OData v4 service
        this.entityContainer = Promise.resolve();
      }

      var oManifestUI5 = this.getManifest()["sap.ui5"];

      if (oManifestUI5 !== null && oManifestUI5 !== void 0 && (_oManifestUI5$rootVie3 = oManifestUI5.rootView) !== null && _oManifestUI5$rootVie3 !== void 0 && _oManifestUI5$rootVie3.viewName) {
        // The application specified an own root view in the manifest
        // Root View was moved from sap.fe.templates to sap.fe.core - keep it compatible
        if (oManifestUI5.rootView.viewName === NAVCONF.FCL.VIEWNAME_COMPATIBILITY) {
          oManifestUI5.rootView.viewName = NAVCONF.FCL.VIEWNAME;
        } else if ((oManifestUI5 === null || oManifestUI5 === void 0 ? void 0 : oManifestUI5.rootView.viewName) === NAVCONF.NAVCONTAINER.VIEWNAME_COMPATIBILITY) {
          oManifestUI5.rootView.viewName = NAVCONF.NAVCONTAINER.VIEWNAME;
        }

        if (oManifestUI5.rootView.viewName === NAVCONF.FCL.VIEWNAME && oManifestUI5.routing.config.routerClass === NAVCONF.FCL.ROUTERCLASS) {
          Log.info("Rootcontainer: \"".concat(NAVCONF.FCL.VIEWNAME, "\" - Routerclass: \"").concat(NAVCONF.FCL.ROUTERCLASS, "\""));
        } else if (oManifestUI5.rootView.viewName === NAVCONF.NAVCONTAINER.VIEWNAME && oManifestUI5.routing.config.routerClass === NAVCONF.NAVCONTAINER.ROUTERCLASS) {
          Log.info("Rootcontainer: \"".concat(NAVCONF.NAVCONTAINER.VIEWNAME, "\" - Routerclass: \"").concat(NAVCONF.NAVCONTAINER.ROUTERCLASS, "\""));
        } else if (oManifestUI5.rootView.viewName.indexOf("sap.fe.core.rootView") !== -1) {
          throw Error("\nWrong configuration for the couple (rootView/routerClass) in manifest file.\n" + "Current values are :(".concat(oManifestUI5.rootView.viewName, "/").concat(oManifestUI5.routing.config.routerClass, ")\n") + "Expected values are \n" + "\t - (".concat(NAVCONF.NAVCONTAINER.VIEWNAME, "/").concat(NAVCONF.NAVCONTAINER.ROUTERCLASS, ")\n") + "\t - (".concat(NAVCONF.FCL.VIEWNAME, "/").concat(NAVCONF.FCL.ROUTERCLASS, ")"));
        } else {
          Log.info("Rootcontainer: \"".concat(oManifestUI5.rootView.viewName, "\" - Routerclass: \"").concat(NAVCONF.NAVCONTAINER.ROUTERCLASS, "\""));
        }
      } // Adding Semantic Date Operators
      // Commenting since it is not needed for SingleRange


      SemanticDateOperators.addSemanticDateOperators(); // the init function configures the routing according to the settings above
      // it will call the createContent function to instantiate the RootView and add it to the UIComponent aggregations

      _UIComponent.prototype.init.call(this);

      AppComponent.instanceMap[this.getId()] = this;
    };

    _proto.onServicesStarted = function onServicesStarted() {
      var _this2 = this;

      //router must be started once the rootcontainer is initialized
      //starting of the router
      var finalizedRoutingInitialization = function () {
        _this2.entityContainer.then(function () {
          if (_this2.getRootViewController().attachRouteMatchers) {
            _this2.getRootViewController().attachRouteMatchers();
          }

          _this2.getRouter().initialize();

          _this2.getRouterProxy().init(_this2, _this2._isFclEnabled());
        }).catch(function (error) {
          var oResourceBundle = Core.getLibraryResourceBundle("sap.fe.core");

          _this2.getRootViewController().displayMessagePage(oResourceBundle.getText("C_APP_COMPONENT_SAPFE_APPSTART_TECHNICAL_ISSUES"), {
            title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
            description: error.message,
            FCLLevel: 0
          });
        });
      };

      if (this.bInitializeRouting) {
        return this.getRoutingService().initializeRouting().then(function () {
          if (_this2.getRootViewController()) {
            return finalizedRoutingInitialization();
          } else {
            _this2.getRootControl().attachAfterInit(function () {
              finalizedRoutingInitialization();
            });
          }
        }).catch(function (err) {
          Log.error("cannot cannot initialize routing: ".concat(err));
        });
      }
    };

    _proto.exit = function exit() {
      this._oAppStateHandler.destroy();

      this._oRouterProxy.destroy(); // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore


      delete this._oAppStateHandler; // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      delete this._oRouterProxy;
      deleteModelCacheData(this.getMetaModel());
      this.getModel("ui").destroy();
    };

    _proto.getMetaModel = function getMetaModel() {
      return this.getModel().getMetaModel();
    };

    _proto.getDiagnostics = function getDiagnostics() {
      return this._oDiagnostics;
    };

    _proto.destroy = function destroy() {
      var _this$getRoutingServi, _UIComponent$prototyp;

      // LEAKS, with workaround for some Flex / MDC issue
      try {
        // 	// This one is only a leak if you don't go back to the same component in the long run
        //delete sap.ui.fl.FlexControllerFactory._componentInstantiationPromises[this.getId()];
        ValueListHelper.initializeCachedValueHelp();
        delete AppComponent.instanceMap[this.getId()]; // 	var oRegistry = sap.ui.mdc.p13n.Engine.getInstance()._getRegistry();
        // 	Object.keys(oRegistry).forEach(function(sKey) {
        // 		Object.keys(oRegistry[sKey].controller).forEach(function(sControllerKey) {
        // 			oRegistry[sKey].controller[sControllerKey].destroy();
        // 		});
        // 	});
        // 	sap.ui.mdc.p13n.Engine.getInstance().destroy();

        delete window._routing;
      } catch (e) {
        Log.info(e);
      } //WORKAROUND for sticky discard request : due to async callback, request triggered by the exitApplication will be send after the UIComponent.prototype.destroy
      //so we need to copy the Requestor headers as it will be destroy
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore


      var oMainModel = this.oModels[undefined];
      var oHeaders;

      if (oMainModel.oRequestor) {
        oHeaders = jQuery.extend({}, oMainModel.oRequestor.mHeaders);
      } // As we need to cleanup the application / handle the dirty object we need to call our cleanup before the models are destroyed


      (_this$getRoutingServi = this.getRoutingService()) === null || _this$getRoutingServi === void 0 ? void 0 : _this$getRoutingServi.beforeExit();

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_UIComponent$prototyp = _UIComponent.prototype.destroy).call.apply(_UIComponent$prototyp, [this].concat(args));

      if (oHeaders && oMainModel.oRequestor) {
        oMainModel.oRequestor.mHeaders = oHeaders;
      }
    };

    _proto.getComponentData = function getComponentData() {
      return _UIComponent.prototype.getComponentData.call(this);
    };

    _proto.getRoutingService = function getRoutingService() {
      return {}; // overriden at runtime
    };

    _proto.getShellServices = function getShellServices() {
      return {}; // overriden at runtime
    };

    _proto.getNavigationService = function getNavigationService() {
      return {}; // overriden at runtime
    };

    _proto.getSideEffectsService = function getSideEffectsService() {
      return {};
    };

    _proto.getEnvironmentCapabilities = function getEnvironmentCapabilities() {
      return {};
    };

    _proto.getStartupParameters = function getStartupParameters() {
      var oComponentData = this.getComponentData();
      var oStartUpParameters = oComponentData && oComponentData.startupParameters || {};
      return Promise.resolve(oStartUpParameters);
    };

    _proto.restore = function restore() {
      // called by FLP when app sap-keep-alive is enabled and app is restored
      this.getRootViewController().viewState.onRestore();
    };

    _proto.suspend = function suspend() {
      // called by FLP when app sap-keep-alive is enabled and app is suspended
      this.getRootViewController().viewState.onSuspend();
    };

    return AppComponent;
  }(UIComponent), _class2.instanceMap = {}, _class2)) || _class);
  return AppComponent;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdGFydHVwTW9kZSIsImxpYnJhcnkiLCJOQVZDT05GIiwiRkNMIiwiVklFV05BTUUiLCJWSUVXTkFNRV9DT01QQVRJQklMSVRZIiwiUk9VVEVSQ0xBU1MiLCJOQVZDT05UQUlORVIiLCJBcHBDb21wb25lbnQiLCJkZWZpbmVVSTVDbGFzcyIsImludGVyZmFjZXMiLCJjb25maWciLCJmdWxsV2lkdGgiLCJtYW5pZmVzdCIsInNlcnZpY2VzIiwicmVzb3VyY2VNb2RlbCIsImZhY3RvcnlOYW1lIiwicm91dGluZ1NlcnZpY2UiLCJzdGFydHVwIiwic2hlbGxTZXJ2aWNlcyIsIlNoZWxsVUlTZXJ2aWNlIiwibmF2aWdhdGlvblNlcnZpY2UiLCJlbnZpcm9ubWVudENhcGFiaWxpdGllcyIsInNpZGVFZmZlY3RzU2VydmljZSIsImFzeW5jQ29tcG9uZW50U2VydmljZSIsInJvb3RWaWV3Iiwidmlld05hbWUiLCJ0eXBlIiwiYXN5bmMiLCJpZCIsInJvdXRpbmciLCJjb250cm9sSWQiLCJyb3V0ZXJDbGFzcyIsInZpZXdUeXBlIiwiY29udHJvbEFnZ3JlZ2F0aW9uIiwiY29udGFpbmVyT3B0aW9ucyIsInByb3BhZ2F0ZU1vZGVsIiwiZGVzaWdudGltZSIsInN0YXJ0dXBNb2RlIiwiTm9ybWFsIiwiX2lzRmNsRW5hYmxlZCIsIm9NYW5pZmVzdFVJNSIsImdldE1hbmlmZXN0RW50cnkiLCJnZXRSb3V0ZXJQcm94eSIsIl9vUm91dGVyUHJveHkiLCJnZXRBcHBTdGF0ZUhhbmRsZXIiLCJfb0FwcFN0YXRlSGFuZGxlciIsImdldFJvb3RWaWV3Q29udHJvbGxlciIsImdldFJvb3RDb250cm9sIiwiZ2V0Q29udHJvbGxlciIsImdldFJvb3RDb250YWluZXIiLCJnZXRDb250ZW50IiwiZ2V0U3RhcnR1cE1vZGUiLCJzZXRTdGFydHVwTW9kZUNyZWF0ZSIsIkNyZWF0ZSIsInNldFN0YXJ0dXBNb2RlQXV0b0NyZWF0ZSIsIkF1dG9DcmVhdGUiLCJzZXRTdGFydHVwTW9kZURlZXBsaW5rIiwiRGVlcGxpbmsiLCJpbml0IiwidWlNb2RlbCIsIkpTT05Nb2RlbCIsImVkaXRNb2RlIiwiRWRpdE1vZGUiLCJEaXNwbGF5IiwiaXNFZGl0YWJsZSIsImRyYWZ0U3RhdHVzIiwiRHJhZnRTdGF0dXMiLCJDbGVhciIsImJ1c3kiLCJidXN5TG9jYWwiLCJwYWdlcyIsIm9JbnRlcm5hbE1vZGVsIiwic2V0RGVmYXVsdEJpbmRpbmdNb2RlIiwiTW9kZWxIZWxwZXIiLCJlbmhhbmNlVWlKU09OTW9kZWwiLCJlbmhhbmNlSW50ZXJuYWxKU09OTW9kZWwiLCJzZXRNb2RlbCIsImJJbml0aWFsaXplUm91dGluZyIsInVuZGVmaW5lZCIsIlJvdXRlclByb3h5IiwiQXBwU3RhdGVIYW5kbGVyIiwiX29EaWFnbm9zdGljcyIsIkRpYWdub3N0aWNzIiwib01vZGVsIiwiZ2V0TW9kZWwiLCJpc0EiLCJlbnRpdHlDb250YWluZXIiLCJnZXRNZXRhTW9kZWwiLCJyZXF1ZXN0T2JqZWN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRNYW5pZmVzdCIsIkxvZyIsImluZm8iLCJpbmRleE9mIiwiRXJyb3IiLCJTZW1hbnRpY0RhdGVPcGVyYXRvcnMiLCJhZGRTZW1hbnRpY0RhdGVPcGVyYXRvcnMiLCJpbnN0YW5jZU1hcCIsImdldElkIiwib25TZXJ2aWNlc1N0YXJ0ZWQiLCJmaW5hbGl6ZWRSb3V0aW5nSW5pdGlhbGl6YXRpb24iLCJ0aGVuIiwiYXR0YWNoUm91dGVNYXRjaGVycyIsImdldFJvdXRlciIsImluaXRpYWxpemUiLCJjYXRjaCIsImVycm9yIiwib1Jlc291cmNlQnVuZGxlIiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImRpc3BsYXlNZXNzYWdlUGFnZSIsImdldFRleHQiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwibWVzc2FnZSIsIkZDTExldmVsIiwiZ2V0Um91dGluZ1NlcnZpY2UiLCJpbml0aWFsaXplUm91dGluZyIsImF0dGFjaEFmdGVySW5pdCIsImVyciIsImV4aXQiLCJkZXN0cm95IiwiZGVsZXRlTW9kZWxDYWNoZURhdGEiLCJnZXREaWFnbm9zdGljcyIsIlZhbHVlTGlzdEhlbHBlciIsImluaXRpYWxpemVDYWNoZWRWYWx1ZUhlbHAiLCJ3aW5kb3ciLCJfcm91dGluZyIsImUiLCJvTWFpbk1vZGVsIiwib01vZGVscyIsIm9IZWFkZXJzIiwib1JlcXVlc3RvciIsImpRdWVyeSIsImV4dGVuZCIsIm1IZWFkZXJzIiwiYmVmb3JlRXhpdCIsImFyZ3MiLCJnZXRDb21wb25lbnREYXRhIiwiZ2V0U2hlbGxTZXJ2aWNlcyIsImdldE5hdmlnYXRpb25TZXJ2aWNlIiwiZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlIiwiZ2V0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJnZXRTdGFydHVwUGFyYW1ldGVycyIsIm9Db21wb25lbnREYXRhIiwib1N0YXJ0VXBQYXJhbWV0ZXJzIiwic3RhcnR1cFBhcmFtZXRlcnMiLCJyZXN0b3JlIiwidmlld1N0YXRlIiwib25SZXN0b3JlIiwic3VzcGVuZCIsIm9uU3VzcGVuZCIsIlVJQ29tcG9uZW50Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJBcHBDb21wb25lbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQXBwU3RhdGVIYW5kbGVyIGZyb20gXCJzYXAvZmUvY29yZS9BcHBTdGF0ZUhhbmRsZXJcIjtcbmltcG9ydCBSb3V0ZXJQcm94eSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvcm91dGluZy9Sb3V0ZXJQcm94eVwiO1xuaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IGxpYnJhcnkgZnJvbSBcInNhcC9mZS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCB0eXBlIHsgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3NlcnZpY2VzL0Vudmlyb25tZW50U2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCB0eXBlIHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvTmF2aWdhdGlvblNlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgdHlwZSB7IFJvdXRpbmdTZXJ2aWNlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3NlcnZpY2VzL1JvdXRpbmdTZXJ2aWNlRmFjdG9yeVwiO1xuaW1wb3J0IHR5cGUgeyBJU2hlbGxTZXJ2aWNlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9TaGVsbFNlcnZpY2VzRmFjdG9yeVwiO1xuaW1wb3J0IHR5cGUgeyBTaWRlRWZmZWN0c1NlcnZpY2UgfSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvU2lkZUVmZmVjdHNTZXJ2aWNlRmFjdG9yeVwiO1xuaW1wb3J0IERpYWdub3N0aWNzIGZyb20gXCJzYXAvZmUvY29yZS9zdXBwb3J0L0RpYWdub3N0aWNzXCI7XG5pbXBvcnQgVmFsdWVMaXN0SGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL2ludGVybmFsL3ZhbHVlaGVscC9WYWx1ZUxpc3RIZWxwZXJcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgdHlwZSBWaWV3IGZyb20gXCJzYXAvdWkvY29yZS9tdmMvVmlld1wiO1xuaW1wb3J0IFVJQ29tcG9uZW50IGZyb20gXCJzYXAvdWkvY29yZS9VSUNvbXBvbmVudFwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgQmFzZUNvbnRyb2xsZXIgZnJvbSBcIi4vQmFzZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IGRlbGV0ZU1vZGVsQ2FjaGVEYXRhIH0gZnJvbSBcIi4vY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCBTZW1hbnRpY0RhdGVPcGVyYXRvcnMgZnJvbSBcIi4vaGVscGVycy9TZW1hbnRpY0RhdGVPcGVyYXRvcnNcIjtcblxuY29uc3QgU3RhcnR1cE1vZGUgPSBsaWJyYXJ5LlN0YXJ0dXBNb2RlO1xuXG5jb25zdCBOQVZDT05GID0ge1xuXHRGQ0w6IHtcblx0XHRWSUVXTkFNRTogXCJzYXAuZmUuY29yZS5yb290Vmlldy5GY2xcIixcblx0XHRWSUVXTkFNRV9DT01QQVRJQklMSVRZOiBcInNhcC5mZS50ZW1wbGF0ZXMuUm9vdENvbnRhaW5lci52aWV3LkZjbFwiLFxuXHRcdFJPVVRFUkNMQVNTOiBcInNhcC5mLnJvdXRpbmcuUm91dGVyXCJcblx0fSxcblx0TkFWQ09OVEFJTkVSOiB7XG5cdFx0VklFV05BTUU6IFwic2FwLmZlLmNvcmUucm9vdFZpZXcuTmF2Q29udGFpbmVyXCIsXG5cdFx0VklFV05BTUVfQ09NUEFUSUJJTElUWTogXCJzYXAuZmUudGVtcGxhdGVzLlJvb3RDb250YWluZXIudmlldy5OYXZDb250YWluZXJcIixcblx0XHRST1VURVJDTEFTUzogXCJzYXAubS5yb3V0aW5nLlJvdXRlclwiXG5cdH1cbn07XG5cbi8qKlxuICogTWFpbiBjbGFzcyBmb3IgY29tcG9uZW50cyB1c2VkIGZvciBhbiBhcHBsaWNhdGlvbiBpbiBTQVAgRmlvcmkgZWxlbWVudHMuXG4gKlxuICogQXBwbGljYXRpb24gZGV2ZWxvcGVycyB1c2luZyB0aGUgdGVtcGxhdGVzIGFuZCBidWlsZGluZyBibG9ja3MgcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzIHNob3VsZCBjcmVhdGUgdGhlaXIgYXBwcyBieSBleHRlbmRpbmcgdGhpcyBjb21wb25lbnQuXG4gKiBUaGlzIGVuc3VyZXMgdGhhdCBhbGwgdGhlIG5lY2Vzc2FyeSBzZXJ2aWNlcyB0aGF0IHlvdSBuZWVkIGZvciB0aGUgYnVpbGRpbmcgYmxvY2tzIGFuZCB0ZW1wbGF0ZXMgdG8gd29yayBwcm9wZXJseSBhcmUgc3RhcnRlZC5cbiAqXG4gKiBXaGVuIHlvdSB1c2Ugc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50IGFzIHRoZSBiYXNlIGNvbXBvbmVudCwgeW91IGFsc28gbmVlZCB0byB1c2UgYSByb290Vmlldy4gU0FQIEZpb3JpIGVsZW1lbnRzIHByb3ZpZGVzIHR3byBvcHRpb25zOiA8YnIvPlxuICogIC0gc2FwLmZlLmNvcmUucm9vdFZpZXcuTmF2Q29udGFpbmVyIHdoZW4gdXNpbmcgc2FwLm0ucm91dGluZy5Sb3V0ZXIgPGJyLz5cbiAqICAtIHNhcC5mZS5jb3JlLnJvb3RWaWV3LkZjbCB3aGVuIHVzaW5nIHNhcC5mLnJvdXRpbmcuUm91dGVyIChGQ0wgdXNlIGNhc2UpIDxici8+XG4gKlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICogQG5hbWUgc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50XG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5jb3JlLkFwcENvbXBvbmVudFwiLCB7XG5cdGludGVyZmFjZXM6IFtcInNhcC51aS5jb3JlLklBc3luY0NvbnRlbnRDcmVhdGlvblwiXSxcblx0Y29uZmlnOiB7XG5cdFx0ZnVsbFdpZHRoOiB0cnVlXG5cdH0sXG5cdG1hbmlmZXN0OiB7XG5cdFx0XCJzYXAudWk1XCI6IHtcblx0XHRcdHNlcnZpY2VzOiB7XG5cdFx0XHRcdHJlc291cmNlTW9kZWw6IHtcblx0XHRcdFx0XHRmYWN0b3J5TmFtZTogXCJzYXAuZmUuY29yZS5zZXJ2aWNlcy5SZXNvdXJjZU1vZGVsU2VydmljZVwiLFxuXHRcdFx0XHRcdFwic3RhcnR1cFwiOiBcIndhaXRGb3JcIixcblx0XHRcdFx0XHRcInNldHRpbmdzXCI6IHtcblx0XHRcdFx0XHRcdFwiYnVuZGxlc1wiOiBbXCJzYXAuZmUuY29yZS5tZXNzYWdlYnVuZGxlXCJdLFxuXHRcdFx0XHRcdFx0XCJtb2RlbE5hbWVcIjogXCJzYXAuZmUuaTE4blwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyb3V0aW5nU2VydmljZToge1xuXHRcdFx0XHRcdGZhY3RvcnlOYW1lOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlJvdXRpbmdTZXJ2aWNlXCIsXG5cdFx0XHRcdFx0c3RhcnR1cDogXCJ3YWl0Rm9yXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hlbGxTZXJ2aWNlczoge1xuXHRcdFx0XHRcdGZhY3RvcnlOYW1lOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlNoZWxsU2VydmljZXNcIixcblx0XHRcdFx0XHRzdGFydHVwOiBcIndhaXRGb3JcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRTaGVsbFVJU2VydmljZToge1xuXHRcdFx0XHRcdGZhY3RvcnlOYW1lOiBcInNhcC51c2hlbGwudWk1c2VydmljZS5TaGVsbFVJU2VydmljZVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG5hdmlnYXRpb25TZXJ2aWNlOiB7XG5cdFx0XHRcdFx0ZmFjdG9yeU5hbWU6IFwic2FwLmZlLmNvcmUuc2VydmljZXMuTmF2aWdhdGlvblNlcnZpY2VcIixcblx0XHRcdFx0XHRzdGFydHVwOiBcIndhaXRGb3JcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlbnZpcm9ubWVudENhcGFiaWxpdGllczoge1xuXHRcdFx0XHRcdGZhY3RvcnlOYW1lOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLkVudmlyb25tZW50U2VydmljZVwiLFxuXHRcdFx0XHRcdHN0YXJ0dXA6IFwid2FpdEZvclwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNpZGVFZmZlY3RzU2VydmljZToge1xuXHRcdFx0XHRcdGZhY3RvcnlOYW1lOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlNpZGVFZmZlY3RzU2VydmljZVwiLFxuXHRcdFx0XHRcdHN0YXJ0dXA6IFwid2FpdEZvclwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFzeW5jQ29tcG9uZW50U2VydmljZToge1xuXHRcdFx0XHRcdGZhY3RvcnlOYW1lOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLkFzeW5jQ29tcG9uZW50U2VydmljZVwiLFxuXHRcdFx0XHRcdHN0YXJ0dXA6IFwid2FpdEZvclwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyb290Vmlldzoge1xuXHRcdFx0XHR2aWV3TmFtZTogTkFWQ09ORi5OQVZDT05UQUlORVIuVklFV05BTUUsXG5cdFx0XHRcdHR5cGU6IFwiWE1MXCIsXG5cdFx0XHRcdGFzeW5jOiB0cnVlLFxuXHRcdFx0XHRpZDogXCJhcHBSb290Vmlld1wiXG5cdFx0XHR9LFxuXHRcdFx0cm91dGluZzoge1xuXHRcdFx0XHRjb25maWc6IHtcblx0XHRcdFx0XHRjb250cm9sSWQ6IFwiYXBwQ29udGVudFwiLFxuXHRcdFx0XHRcdHJvdXRlckNsYXNzOiBOQVZDT05GLk5BVkNPTlRBSU5FUi5ST1VURVJDTEFTUyxcblx0XHRcdFx0XHR2aWV3VHlwZTogXCJYTUxcIixcblx0XHRcdFx0XHRjb250cm9sQWdncmVnYXRpb246IFwicGFnZXNcIixcblx0XHRcdFx0XHRhc3luYzogdHJ1ZSxcblx0XHRcdFx0XHRjb250YWluZXJPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRwcm9wYWdhdGVNb2RlbDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZGVzaWdudGltZTogXCJzYXAvZmUvY29yZS9kZXNpZ250aW1lL0FwcENvbXBvbmVudC5kZXNpZ250aW1lXCIsXG5cblx0bGlicmFyeTogXCJzYXAuZmUuY29yZVwiXG59KVxuY2xhc3MgQXBwQ29tcG9uZW50IGV4dGVuZHMgVUlDb21wb25lbnQge1xuXHRzdGF0aWMgaW5zdGFuY2VNYXA6IFJlY29yZDxzdHJpbmcsIEFwcENvbXBvbmVudD4gPSB7fTtcblx0cHJpdmF0ZSBfb1JvdXRlclByb3h5ITogUm91dGVyUHJveHk7XG5cdHByaXZhdGUgX29BcHBTdGF0ZUhhbmRsZXIhOiBBcHBTdGF0ZUhhbmRsZXI7XG5cdHByaXZhdGUgYkluaXRpYWxpemVSb3V0aW5nPzogYm9vbGVhbjtcblx0cHJpdmF0ZSBfb0RpYWdub3N0aWNzITogRGlhZ25vc3RpY3M7XG5cdHByaXZhdGUgZW50aXR5Q29udGFpbmVyOiBhbnk7XG5cdHByaXZhdGUgc3RhcnR1cE1vZGU6IHN0cmluZyA9IFN0YXJ0dXBNb2RlLk5vcm1hbDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50LmdldE1ldGFkYXRhXG5cdCAqIEBmdW5jdGlvblxuXHQgKi9cblxuXHRfaXNGY2xFbmFibGVkKCkge1xuXHRcdGNvbnN0IG9NYW5pZmVzdFVJNSA9IHRoaXMuZ2V0TWFuaWZlc3RFbnRyeShcIi9zYXAudWk1XCIpO1xuXHRcdHJldHVybiAoXG5cdFx0XHRvTWFuaWZlc3RVSTU/LnJvb3RWaWV3Py52aWV3TmFtZSA9PT0gTkFWQ09ORi5GQ0wuVklFV05BTUUgfHxcblx0XHRcdG9NYW5pZmVzdFVJNT8ucm9vdFZpZXc/LnZpZXdOYW1lID09PSBOQVZDT05GLkZDTC5WSUVXTkFNRV9DT01QQVRJQklMSVRZXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSByZWZlcmVuY2UgdG8gdGhlIFJvdXRlclByb3h5LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50I2dldFJvdXRlclByb3h5XG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5BcHBDb21wb25lbnRcblx0ICogQHJldHVybnMgQSBSZWZlcmVuY2UgdG8gdGhlIFJvdXRlclByb3h5XG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdGdldFJvdXRlclByb3h5KCk6IFJvdXRlclByb3h5IHtcblx0XHRyZXR1cm4gdGhpcy5fb1JvdXRlclByb3h5O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhIHJlZmVyZW5jZSB0byB0aGUgQXBwU3RhdGVIYW5kbGVyLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50I2dldEFwcFN0YXRlSGFuZGxlclxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50XG5cdCAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBBcHBTdGF0ZUhhbmRsZXJcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0Z2V0QXBwU3RhdGVIYW5kbGVyKCkge1xuXHRcdHJldHVybiB0aGlzLl9vQXBwU3RhdGVIYW5kbGVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhIHJlZmVyZW5jZSB0byB0aGUgbmF2L0ZDTCBDb250cm9sbGVyLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50I2dldFJvb3RWaWV3Q29udHJvbGxlclxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50XG5cdCAqIEByZXR1cm5zICBBIHJlZmVyZW5jZSB0byB0aGUgRkNMIENvbnRyb2xsZXJcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0Z2V0Um9vdFZpZXdDb250cm9sbGVyKCk6IEJhc2VDb250cm9sbGVyIHtcblx0XHRyZXR1cm4gKHRoaXMuZ2V0Um9vdENvbnRyb2woKSBhcyBWaWV3KS5nZXRDb250cm9sbGVyKCkgYXMgQmFzZUNvbnRyb2xsZXI7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBOYXZDb250YWluZXIgY29udHJvbCBvciB0aGUgRkNMIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBzYXAuZmUuY29yZS5BcHBDb21wb25lbnQjZ2V0Um9vdENvbnRhaW5lclxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50XG5cdCAqIEByZXR1cm5zICBBIHJlZmVyZW5jZSB0byBOYXZDb250YWluZXIgY29udHJvbCBvciB0aGUgRkNMIGNvbnRyb2xcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0Z2V0Um9vdENvbnRhaW5lcigpIHtcblx0XHRyZXR1cm4gKHRoaXMuZ2V0Um9vdENvbnRyb2woKSBhcyBWaWV3KS5nZXRDb250ZW50KClbMF07XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBzdGFydHVwIG1vZGUgb2YgdGhlIGFwcC5cblx0ICpcblx0ICogQHJldHVybnMgVGhlIHN0YXJ0dXAgbW9kZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Z2V0U3RhcnR1cE1vZGUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5zdGFydHVwTW9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIHN0YXJ0dXAgbW9kZSBmb3IgdGhlIGFwcCB0byAnQ3JlYXRlJy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHNldFN0YXJ0dXBNb2RlQ3JlYXRlKCkge1xuXHRcdHRoaXMuc3RhcnR1cE1vZGUgPSBTdGFydHVwTW9kZS5DcmVhdGU7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBzdGFydHVwIG1vZGUgZm9yIHRoZSBhcHAgdG8gJ0F1dG9DcmVhdGUnLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0c2V0U3RhcnR1cE1vZGVBdXRvQ3JlYXRlKCkge1xuXHRcdHRoaXMuc3RhcnR1cE1vZGUgPSBTdGFydHVwTW9kZS5BdXRvQ3JlYXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgc3RhcnR1cCBtb2RlIGZvciB0aGUgYXBwIHRvICdEZWVwbGluaycuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRzZXRTdGFydHVwTW9kZURlZXBsaW5rKCkge1xuXHRcdHRoaXMuc3RhcnR1cE1vZGUgPSBTdGFydHVwTW9kZS5EZWVwbGluaztcblx0fVxuXG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgdWlNb2RlbCA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0ZWRpdE1vZGU6IGxpYnJhcnkuRWRpdE1vZGUuRGlzcGxheSxcblx0XHRcdGlzRWRpdGFibGU6IGZhbHNlLFxuXHRcdFx0ZHJhZnRTdGF0dXM6IGxpYnJhcnkuRHJhZnRTdGF0dXMuQ2xlYXIsXG5cdFx0XHRidXN5OiBmYWxzZSxcblx0XHRcdGJ1c3lMb2NhbDoge30sXG5cdFx0XHRwYWdlczoge31cblx0XHR9KTtcblx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbCA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0cGFnZXM6IHt9XG5cdFx0fSk7XG5cdFx0Ly8gc2V0IHRoZSBiaW5kaW5nIE9uZVdheSBmb3IgdWlNb2RlbCB0byBwcmV2ZW50IGNoYW5nZXMgaWYgY29udHJvbGxlciBleHRlbnNpb25zIG1vZGlmeSBhIGJvdW5kIHByb3BlcnR5IG9mIGEgY29udHJvbFxuXHRcdHVpTW9kZWwuc2V0RGVmYXVsdEJpbmRpbmdNb2RlKFwiT25lV2F5XCIpO1xuXHRcdC8vIGZvciBpbnRlcm5hbCBtb2RlbCBiaW5kaW5nIG5lZWRzIHRvIGJlIHR3byB3YXlcblx0XHRNb2RlbEhlbHBlci5lbmhhbmNlVWlKU09OTW9kZWwodWlNb2RlbCwgbGlicmFyeSk7XG5cdFx0TW9kZWxIZWxwZXIuZW5oYW5jZUludGVybmFsSlNPTk1vZGVsKG9JbnRlcm5hbE1vZGVsKTtcblxuXHRcdHRoaXMuc2V0TW9kZWwodWlNb2RlbCwgXCJ1aVwiKTtcblx0XHR0aGlzLnNldE1vZGVsKG9JbnRlcm5hbE1vZGVsLCBcImludGVybmFsXCIpO1xuXG5cdFx0dGhpcy5iSW5pdGlhbGl6ZVJvdXRpbmcgPSB0aGlzLmJJbml0aWFsaXplUm91dGluZyAhPT0gdW5kZWZpbmVkID8gdGhpcy5iSW5pdGlhbGl6ZVJvdXRpbmcgOiB0cnVlO1xuXHRcdHRoaXMuX29Sb3V0ZXJQcm94eSA9IG5ldyBSb3V0ZXJQcm94eSgpO1xuXHRcdHRoaXMuX29BcHBTdGF0ZUhhbmRsZXIgPSBuZXcgQXBwU3RhdGVIYW5kbGVyKHRoaXMpO1xuXHRcdHRoaXMuX29EaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuXG5cdFx0Y29uc3Qgb01vZGVsID0gdGhpcy5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWw7XG5cdFx0aWYgKG9Nb2RlbD8uaXNBPy4oXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFNb2RlbFwiKSkge1xuXHRcdFx0dGhpcy5lbnRpdHlDb250YWluZXIgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCkucmVxdWVzdE9iamVjdChcIi8kRW50aXR5Q29udGFpbmVyL1wiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gbm90IGFuIE9EYXRhIHY0IHNlcnZpY2Vcblx0XHRcdHRoaXMuZW50aXR5Q29udGFpbmVyID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb01hbmlmZXN0VUk1ID0gKHRoaXMuZ2V0TWFuaWZlc3QoKSBhcyBhbnkpW1wic2FwLnVpNVwiXTtcblx0XHRpZiAob01hbmlmZXN0VUk1Py5yb290Vmlldz8udmlld05hbWUpIHtcblx0XHRcdC8vIFRoZSBhcHBsaWNhdGlvbiBzcGVjaWZpZWQgYW4gb3duIHJvb3QgdmlldyBpbiB0aGUgbWFuaWZlc3RcblxuXHRcdFx0Ly8gUm9vdCBWaWV3IHdhcyBtb3ZlZCBmcm9tIHNhcC5mZS50ZW1wbGF0ZXMgdG8gc2FwLmZlLmNvcmUgLSBrZWVwIGl0IGNvbXBhdGlibGVcblx0XHRcdGlmIChvTWFuaWZlc3RVSTUucm9vdFZpZXcudmlld05hbWUgPT09IE5BVkNPTkYuRkNMLlZJRVdOQU1FX0NPTVBBVElCSUxJVFkpIHtcblx0XHRcdFx0b01hbmlmZXN0VUk1LnJvb3RWaWV3LnZpZXdOYW1lID0gTkFWQ09ORi5GQ0wuVklFV05BTUU7XG5cdFx0XHR9IGVsc2UgaWYgKG9NYW5pZmVzdFVJNT8ucm9vdFZpZXcudmlld05hbWUgPT09IE5BVkNPTkYuTkFWQ09OVEFJTkVSLlZJRVdOQU1FX0NPTVBBVElCSUxJVFkpIHtcblx0XHRcdFx0b01hbmlmZXN0VUk1LnJvb3RWaWV3LnZpZXdOYW1lID0gTkFWQ09ORi5OQVZDT05UQUlORVIuVklFV05BTUU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0b01hbmlmZXN0VUk1LnJvb3RWaWV3LnZpZXdOYW1lID09PSBOQVZDT05GLkZDTC5WSUVXTkFNRSAmJlxuXHRcdFx0XHRvTWFuaWZlc3RVSTUucm91dGluZy5jb25maWcucm91dGVyQ2xhc3MgPT09IE5BVkNPTkYuRkNMLlJPVVRFUkNMQVNTXG5cdFx0XHQpIHtcblx0XHRcdFx0TG9nLmluZm8oYFJvb3Rjb250YWluZXI6IFwiJHtOQVZDT05GLkZDTC5WSUVXTkFNRX1cIiAtIFJvdXRlcmNsYXNzOiBcIiR7TkFWQ09ORi5GQ0wuUk9VVEVSQ0xBU1N9XCJgKTtcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdG9NYW5pZmVzdFVJNS5yb290Vmlldy52aWV3TmFtZSA9PT0gTkFWQ09ORi5OQVZDT05UQUlORVIuVklFV05BTUUgJiZcblx0XHRcdFx0b01hbmlmZXN0VUk1LnJvdXRpbmcuY29uZmlnLnJvdXRlckNsYXNzID09PSBOQVZDT05GLk5BVkNPTlRBSU5FUi5ST1VURVJDTEFTU1xuXHRcdFx0KSB7XG5cdFx0XHRcdExvZy5pbmZvKGBSb290Y29udGFpbmVyOiBcIiR7TkFWQ09ORi5OQVZDT05UQUlORVIuVklFV05BTUV9XCIgLSBSb3V0ZXJjbGFzczogXCIke05BVkNPTkYuTkFWQ09OVEFJTkVSLlJPVVRFUkNMQVNTfVwiYCk7XG5cdFx0XHR9IGVsc2UgaWYgKG9NYW5pZmVzdFVJNS5yb290Vmlldy52aWV3TmFtZS5pbmRleE9mKFwic2FwLmZlLmNvcmUucm9vdFZpZXdcIikgIT09IC0xKSB7XG5cdFx0XHRcdHRocm93IEVycm9yKFxuXHRcdFx0XHRcdGBcXG5Xcm9uZyBjb25maWd1cmF0aW9uIGZvciB0aGUgY291cGxlIChyb290Vmlldy9yb3V0ZXJDbGFzcykgaW4gbWFuaWZlc3QgZmlsZS5cXG5gICtcblx0XHRcdFx0XHRcdGBDdXJyZW50IHZhbHVlcyBhcmUgOigke29NYW5pZmVzdFVJNS5yb290Vmlldy52aWV3TmFtZX0vJHtvTWFuaWZlc3RVSTUucm91dGluZy5jb25maWcucm91dGVyQ2xhc3N9KVxcbmAgK1xuXHRcdFx0XHRcdFx0YEV4cGVjdGVkIHZhbHVlcyBhcmUgXFxuYCArXG5cdFx0XHRcdFx0XHRgXFx0IC0gKCR7TkFWQ09ORi5OQVZDT05UQUlORVIuVklFV05BTUV9LyR7TkFWQ09ORi5OQVZDT05UQUlORVIuUk9VVEVSQ0xBU1N9KVxcbmAgK1xuXHRcdFx0XHRcdFx0YFxcdCAtICgke05BVkNPTkYuRkNMLlZJRVdOQU1FfS8ke05BVkNPTkYuRkNMLlJPVVRFUkNMQVNTfSlgXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRMb2cuaW5mbyhgUm9vdGNvbnRhaW5lcjogXCIke29NYW5pZmVzdFVJNS5yb290Vmlldy52aWV3TmFtZX1cIiAtIFJvdXRlcmNsYXNzOiBcIiR7TkFWQ09ORi5OQVZDT05UQUlORVIuUk9VVEVSQ0xBU1N9XCJgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBZGRpbmcgU2VtYW50aWMgRGF0ZSBPcGVyYXRvcnNcblx0XHQvLyBDb21tZW50aW5nIHNpbmNlIGl0IGlzIG5vdCBuZWVkZWQgZm9yIFNpbmdsZVJhbmdlXG5cdFx0U2VtYW50aWNEYXRlT3BlcmF0b3JzLmFkZFNlbWFudGljRGF0ZU9wZXJhdG9ycygpO1xuXG5cdFx0Ly8gdGhlIGluaXQgZnVuY3Rpb24gY29uZmlndXJlcyB0aGUgcm91dGluZyBhY2NvcmRpbmcgdG8gdGhlIHNldHRpbmdzIGFib3ZlXG5cdFx0Ly8gaXQgd2lsbCBjYWxsIHRoZSBjcmVhdGVDb250ZW50IGZ1bmN0aW9uIHRvIGluc3RhbnRpYXRlIHRoZSBSb290VmlldyBhbmQgYWRkIGl0IHRvIHRoZSBVSUNvbXBvbmVudCBhZ2dyZWdhdGlvbnNcblxuXHRcdHN1cGVyLmluaXQoKTtcblx0XHRBcHBDb21wb25lbnQuaW5zdGFuY2VNYXBbdGhpcy5nZXRJZCgpXSA9IHRoaXM7XG5cdH1cblx0b25TZXJ2aWNlc1N0YXJ0ZWQoKSB7XG5cdFx0Ly9yb3V0ZXIgbXVzdCBiZSBzdGFydGVkIG9uY2UgdGhlIHJvb3Rjb250YWluZXIgaXMgaW5pdGlhbGl6ZWRcblx0XHQvL3N0YXJ0aW5nIG9mIHRoZSByb3V0ZXJcblx0XHRjb25zdCBmaW5hbGl6ZWRSb3V0aW5nSW5pdGlhbGl6YXRpb24gPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmVudGl0eUNvbnRhaW5lclxuXHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCh0aGlzLmdldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIGFueSkuYXR0YWNoUm91dGVNYXRjaGVycykge1xuXHRcdFx0XHRcdFx0KHRoaXMuZ2V0Um9vdFZpZXdDb250cm9sbGVyKCkgYXMgYW55KS5hdHRhY2hSb3V0ZU1hdGNoZXJzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuZ2V0Um91dGVyKCkuaW5pdGlhbGl6ZSgpO1xuXHRcdFx0XHRcdHRoaXMuZ2V0Um91dGVyUHJveHkoKS5pbml0KHRoaXMsIHRoaXMuX2lzRmNsRW5hYmxlZCgpKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKChlcnJvcjogYW55KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgb1Jlc291cmNlQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblxuXHRcdFx0XHRcdCh0aGlzLmdldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIGFueSkuZGlzcGxheU1lc3NhZ2VQYWdlKFxuXHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX0FQUF9DT01QT05FTlRfU0FQRkVfQVBQU1RBUlRfVEVDSE5JQ0FMX0lTU1VFU1wiKSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGl0bGU6IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiQ19DT01NT05fU0FQRkVfRVJST1JcIiksXG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBlcnJvci5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0XHRGQ0xMZXZlbDogMFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRpZiAodGhpcy5iSW5pdGlhbGl6ZVJvdXRpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFJvdXRpbmdTZXJ2aWNlKClcblx0XHRcdFx0LmluaXRpYWxpemVSb3V0aW5nKClcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdGlmICh0aGlzLmdldFJvb3RWaWV3Q29udHJvbGxlcigpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmluYWxpemVkUm91dGluZ0luaXRpYWxpemF0aW9uKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCh0aGlzLmdldFJvb3RDb250cm9sKCkgYXMgYW55KS5hdHRhY2hBZnRlckluaXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRmaW5hbGl6ZWRSb3V0aW5nSW5pdGlhbGl6YXRpb24oKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnI6IGFueSkge1xuXHRcdFx0XHRcdExvZy5lcnJvcihgY2Fubm90IGNhbm5vdCBpbml0aWFsaXplIHJvdXRpbmc6ICR7ZXJyfWApO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0ZXhpdCgpIHtcblx0XHR0aGlzLl9vQXBwU3RhdGVIYW5kbGVyLmRlc3Ryb3koKTtcblx0XHR0aGlzLl9vUm91dGVyUHJveHkuZGVzdHJveSgpO1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuX29BcHBTdGF0ZUhhbmRsZXI7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkZWxldGUgdGhpcy5fb1JvdXRlclByb3h5O1xuXHRcdGRlbGV0ZU1vZGVsQ2FjaGVEYXRhKHRoaXMuZ2V0TWV0YU1vZGVsKCkpO1xuXHRcdHRoaXMuZ2V0TW9kZWwoXCJ1aVwiKS5kZXN0cm95KCk7XG5cdH1cblx0Z2V0TWV0YU1vZGVsKCk6IE9EYXRhTWV0YU1vZGVsIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsO1xuXHR9XG5cdGdldERpYWdub3N0aWNzKCkge1xuXHRcdHJldHVybiB0aGlzLl9vRGlhZ25vc3RpY3M7XG5cdH1cblx0ZGVzdHJveSguLi5hcmdzOiBhbnlbXSkge1xuXHRcdC8vIExFQUtTLCB3aXRoIHdvcmthcm91bmQgZm9yIHNvbWUgRmxleCAvIE1EQyBpc3N1ZVxuXHRcdHRyeSB7XG5cdFx0XHQvLyBcdC8vIFRoaXMgb25lIGlzIG9ubHkgYSBsZWFrIGlmIHlvdSBkb24ndCBnbyBiYWNrIHRvIHRoZSBzYW1lIGNvbXBvbmVudCBpbiB0aGUgbG9uZyBydW5cblx0XHRcdC8vZGVsZXRlIHNhcC51aS5mbC5GbGV4Q29udHJvbGxlckZhY3RvcnkuX2NvbXBvbmVudEluc3RhbnRpYXRpb25Qcm9taXNlc1t0aGlzLmdldElkKCldO1xuXG5cdFx0XHRWYWx1ZUxpc3RIZWxwZXIuaW5pdGlhbGl6ZUNhY2hlZFZhbHVlSGVscCgpO1xuXG5cdFx0XHRkZWxldGUgQXBwQ29tcG9uZW50Lmluc3RhbmNlTWFwW3RoaXMuZ2V0SWQoKV07XG5cblx0XHRcdC8vIFx0dmFyIG9SZWdpc3RyeSA9IHNhcC51aS5tZGMucDEzbi5FbmdpbmUuZ2V0SW5zdGFuY2UoKS5fZ2V0UmVnaXN0cnkoKTtcblx0XHRcdC8vIFx0T2JqZWN0LmtleXMob1JlZ2lzdHJ5KS5mb3JFYWNoKGZ1bmN0aW9uKHNLZXkpIHtcblx0XHRcdC8vIFx0XHRPYmplY3Qua2V5cyhvUmVnaXN0cnlbc0tleV0uY29udHJvbGxlcikuZm9yRWFjaChmdW5jdGlvbihzQ29udHJvbGxlcktleSkge1xuXHRcdFx0Ly8gXHRcdFx0b1JlZ2lzdHJ5W3NLZXldLmNvbnRyb2xsZXJbc0NvbnRyb2xsZXJLZXldLmRlc3Ryb3koKTtcblx0XHRcdC8vIFx0XHR9KTtcblx0XHRcdC8vIFx0fSk7XG5cdFx0XHQvLyBcdHNhcC51aS5tZGMucDEzbi5FbmdpbmUuZ2V0SW5zdGFuY2UoKS5kZXN0cm95KCk7XG5cdFx0XHRkZWxldGUgKHdpbmRvdyBhcyBhbnkpLl9yb3V0aW5nO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdExvZy5pbmZvKGUgYXMgc3RyaW5nKTtcblx0XHR9XG5cblx0XHQvL1dPUktBUk9VTkQgZm9yIHN0aWNreSBkaXNjYXJkIHJlcXVlc3QgOiBkdWUgdG8gYXN5bmMgY2FsbGJhY2ssIHJlcXVlc3QgdHJpZ2dlcmVkIGJ5IHRoZSBleGl0QXBwbGljYXRpb24gd2lsbCBiZSBzZW5kIGFmdGVyIHRoZSBVSUNvbXBvbmVudC5wcm90b3R5cGUuZGVzdHJveVxuXHRcdC8vc28gd2UgbmVlZCB0byBjb3B5IHRoZSBSZXF1ZXN0b3IgaGVhZGVycyBhcyBpdCB3aWxsIGJlIGRlc3Ryb3lcblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0Y29uc3Qgb01haW5Nb2RlbCA9ICh0aGlzIGFzIGFueSkub01vZGVsc1t1bmRlZmluZWRdO1xuXHRcdGxldCBvSGVhZGVycztcblx0XHRpZiAob01haW5Nb2RlbC5vUmVxdWVzdG9yKSB7XG5cdFx0XHRvSGVhZGVycyA9IGpRdWVyeS5leHRlbmQoe30sIG9NYWluTW9kZWwub1JlcXVlc3Rvci5tSGVhZGVycyk7XG5cdFx0fVxuXG5cdFx0Ly8gQXMgd2UgbmVlZCB0byBjbGVhbnVwIHRoZSBhcHBsaWNhdGlvbiAvIGhhbmRsZSB0aGUgZGlydHkgb2JqZWN0IHdlIG5lZWQgdG8gY2FsbCBvdXIgY2xlYW51cCBiZWZvcmUgdGhlIG1vZGVscyBhcmUgZGVzdHJveWVkXG5cdFx0dGhpcy5nZXRSb3V0aW5nU2VydmljZSgpPy5iZWZvcmVFeGl0KCk7XG5cdFx0c3VwZXIuZGVzdHJveSguLi5hcmdzKTtcblx0XHRpZiAob0hlYWRlcnMgJiYgb01haW5Nb2RlbC5vUmVxdWVzdG9yKSB7XG5cdFx0XHRvTWFpbk1vZGVsLm9SZXF1ZXN0b3IubUhlYWRlcnMgPSBvSGVhZGVycztcblx0XHR9XG5cdH1cblx0Z2V0Q29tcG9uZW50RGF0YSgpOiBhbnkge1xuXHRcdHJldHVybiBzdXBlci5nZXRDb21wb25lbnREYXRhKCk7XG5cdH1cblx0Z2V0Um91dGluZ1NlcnZpY2UoKTogUm91dGluZ1NlcnZpY2Uge1xuXHRcdHJldHVybiB7fSBhcyBSb3V0aW5nU2VydmljZTsgLy8gb3ZlcnJpZGVuIGF0IHJ1bnRpbWVcblx0fVxuXHRnZXRTaGVsbFNlcnZpY2VzKCk6IElTaGVsbFNlcnZpY2VzIHtcblx0XHRyZXR1cm4ge30gYXMgSVNoZWxsU2VydmljZXM7IC8vIG92ZXJyaWRlbiBhdCBydW50aW1lXG5cdH1cblx0Z2V0TmF2aWdhdGlvblNlcnZpY2UoKTogTmF2aWdhdGlvblNlcnZpY2Uge1xuXHRcdHJldHVybiB7fSBhcyBOYXZpZ2F0aW9uU2VydmljZTsgLy8gb3ZlcnJpZGVuIGF0IHJ1bnRpbWVcblx0fVxuXHRnZXRTaWRlRWZmZWN0c1NlcnZpY2UoKTogU2lkZUVmZmVjdHNTZXJ2aWNlIHtcblx0XHRyZXR1cm4ge30gYXMgU2lkZUVmZmVjdHNTZXJ2aWNlO1xuXHR9XG5cdGdldEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKCk6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZSB7XG5cdFx0cmV0dXJuIHt9IGFzIEVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZTtcblx0fVxuXG5cdGdldFN0YXJ0dXBQYXJhbWV0ZXJzKCkge1xuXHRcdGNvbnN0IG9Db21wb25lbnREYXRhID0gdGhpcy5nZXRDb21wb25lbnREYXRhKCk7XG5cdFx0Y29uc3Qgb1N0YXJ0VXBQYXJhbWV0ZXJzID0gKG9Db21wb25lbnREYXRhICYmIG9Db21wb25lbnREYXRhLnN0YXJ0dXBQYXJhbWV0ZXJzKSB8fCB7fTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG9TdGFydFVwUGFyYW1ldGVycyk7XG5cdH1cblx0cmVzdG9yZSgpIHtcblx0XHQvLyBjYWxsZWQgYnkgRkxQIHdoZW4gYXBwIHNhcC1rZWVwLWFsaXZlIGlzIGVuYWJsZWQgYW5kIGFwcCBpcyByZXN0b3JlZFxuXHRcdCh0aGlzLmdldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIGFueSkudmlld1N0YXRlLm9uUmVzdG9yZSgpO1xuXHR9XG5cdHN1c3BlbmQoKSB7XG5cdFx0Ly8gY2FsbGVkIGJ5IEZMUCB3aGVuIGFwcCBzYXAta2VlcC1hbGl2ZSBpcyBlbmFibGVkIGFuZCBhcHAgaXMgc3VzcGVuZGVkXG5cdFx0KHRoaXMuZ2V0Um9vdFZpZXdDb250cm9sbGVyKCkgYXMgYW55KS52aWV3U3RhdGUub25TdXNwZW5kKCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O0VBdUJBLElBQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDRCxXQUE1QjtFQUVBLElBQU1FLE9BQU8sR0FBRztJQUNmQyxHQUFHLEVBQUU7TUFDSkMsUUFBUSxFQUFFLDBCQUROO01BRUpDLHNCQUFzQixFQUFFLHlDQUZwQjtNQUdKQyxXQUFXLEVBQUU7SUFIVCxDQURVO0lBTWZDLFlBQVksRUFBRTtNQUNiSCxRQUFRLEVBQUUsbUNBREc7TUFFYkMsc0JBQXNCLEVBQUUsa0RB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