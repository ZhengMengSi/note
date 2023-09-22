/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/UriParameters", "sap/fe/core/helpers/LoaderUtils", "sap/fe/core/TemplateModel", "sap/ui/core/cache/CacheManager", "sap/ui/core/Component", "sap/ui/core/Core", "sap/ui/core/mvc/View", "sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory", "sap/ui/core/service/ServiceFactoryRegistry", "sap/ui/Device", "sap/ui/model/base/ManagedObjectModel", "sap/ui/model/json/JSONModel", "sap/ui/VersionInfo", "../helpers/DynamicAnnotationPathHelper"], function (Log, UriParameters, LoaderUtils, TemplateModel, CacheManager, Component, Core, View, Service, ServiceFactory, ServiceFactoryRegistry, Device, ManagedObjectModel, JSONModel, VersionInfo, DynamicAnnotationPathHelper) {
  "use strict";

  var resolveDynamicExpression = DynamicAnnotationPathHelper.resolveDynamicExpression;
  var requireDependencies = LoaderUtils.requireDependencies;

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

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var TemplatedViewService = /*#__PURE__*/function (_Service) {
    _inheritsLoose(TemplatedViewService, _Service);

    function TemplatedViewService() {
      return _Service.apply(this, arguments) || this;
    }

    var _proto = TemplatedViewService.prototype;

    _proto.init = function init() {
      var _this2 = this;

      var _this = this;

      var aServiceDependencies = [];
      var oContext = this.getContext();
      var oComponent = oContext.scopeObject;
      var oAppComponent = Component.getOwnerComponentFor(oComponent);
      var oMetaModel = oAppComponent.getMetaModel();
      var sStableId = "".concat(oAppComponent.getMetadata().getComponentName(), "::").concat(oAppComponent.getLocalId(oComponent.getId()));
      var aEnhanceI18n = oComponent.getEnhanceI18n() || [];
      var sAppNamespace;
      this.oFactory = oContext.factory;

      if (aEnhanceI18n) {
        sAppNamespace = oAppComponent.getMetadata().getComponentName();

        for (var i = 0; i < aEnhanceI18n.length; i++) {
          // In order to support text-verticalization applications can also passs a resource model defined in the manifest
          // UI5 takes care of text-verticalization for resource models defined in the manifest
          // Hence check if the given key is a resource model defined in the manifest
          // if so this model should be used to enhance the sap.fe resource model so pass it as it is
          var oResourceModel = oAppComponent.getModel(aEnhanceI18n[i]);

          if (oResourceModel && oResourceModel.isA("sap.ui.model.resource.ResourceModel")) {
            aEnhanceI18n[i] = oResourceModel;
          } else {
            aEnhanceI18n[i] = "".concat(sAppNamespace, ".").concat(aEnhanceI18n[i].replace(".properties", ""));
          }
        }
      }

      var sCacheIdentifier = "".concat(oAppComponent.getMetadata().getName(), "_").concat(sStableId, "_").concat(sap.ui.getCore().getConfiguration().getLanguageTag());
      aServiceDependencies.push(ServiceFactoryRegistry.get("sap.fe.core.services.ResourceModelService").createInstance({
        scopeType: "component",
        scopeObject: oComponent,
        settings: {
          bundles: ["sap.fe.core.messagebundle", "sap.fe.macros.messagebundle", "sap.fe.templates.messagebundle"],
          enhanceI18n: aEnhanceI18n,
          modelName: "sap.fe.i18n"
        }
      }).then(function (oResourceModelService) {
        _this.oResourceModelService = oResourceModelService;
        return oResourceModelService.getResourceModel();
      }));
      aServiceDependencies.push(ServiceFactoryRegistry.get("sap.fe.core.services.CacheHandlerService").createInstance({
        settings: {
          metaModel: oMetaModel,
          appComponent: oAppComponent,
          component: oComponent
        }
      }).then(function (oCacheHandlerService) {
        _this.oCacheHandlerService = oCacheHandlerService;
        return oCacheHandlerService.validateCacheKey(sCacheIdentifier, oComponent);
      }));
      aServiceDependencies.push(VersionInfo.load().then(function (oInfo) {
        var sTimestamp = "";

        if (!oInfo.libraries) {
          sTimestamp = sap.ui.buildinfo.buildtime;
        } else {
          oInfo.libraries.forEach(function (oLibrary) {
            sTimestamp += oLibrary.buildTimestamp;
          });
        }

        return sTimestamp;
      }).catch(function () {
        return "<NOVALUE>";
      }));
      var sPageModelCacheKey;
      this.initPromise = Promise.all(aServiceDependencies).then(function (aDependenciesResult) {
        var sCacheKey = aDependenciesResult[1];
        var sVersionInfo = aDependenciesResult[2];
        var oShellServices = oAppComponent.getShellServices();
        var oSideEffectsServices = oAppComponent.getSideEffectsService();
        oSideEffectsServices.initializeSideEffects(oAppComponent.getEnvironmentCapabilities().getCapabilities()); // In case there is no cache key we ignore the view cache

        sPageModelCacheKey = sCacheKey ? "".concat(sCacheKey, "-").concat(sVersionInfo, "-").concat(sStableId, "-").concat(oShellServices.instanceType, "-pageModel") : undefined;
        return Promise.all(aDependenciesResult.concat([_this._getCachedModel(sPageModelCacheKey)]));
      }).then(function (aDependenciesResult) {
        try {
          var _oResourceModel = aDependenciesResult[0];
          var sCacheKey = aDependenciesResult[1];
          var oPageModelCache = aDependenciesResult[3];
          return Promise.resolve(requireDependencies(["sap/fe/core/converters/TemplateConverter", "sap/fe/core/converters/MetaModelConverter"])).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                TemplateConverter = _ref2[0],
                MetaModelConverter = _ref2[1];

            return _this2.createView(_oResourceModel, sStableId, sCacheKey, sPageModelCacheKey, oPageModelCache, TemplateConverter, MetaModelConverter);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }).then(function (sCacheKey) {
        var oCacheHandlerService = ServiceFactoryRegistry.get("sap.fe.core.services.CacheHandlerService").getInstance(oMetaModel);
        oCacheHandlerService.invalidateIfNeeded(sCacheKey, sCacheIdentifier, oComponent);
      });
    };

    _proto._getCachedModel = function _getCachedModel(sCacheKey) {
      if (sCacheKey && Core.getConfiguration().getViewCache()) {
        return CacheManager.get(sCacheKey);
      }

      return undefined;
    };

    _proto._setCachedModel = function _setCachedModel(sCacheKey, oCacheModel) {
      if (sCacheKey && Core.getConfiguration().getViewCache()) {
        CacheManager.set(sCacheKey, oCacheModel);
      }

      return undefined;
    }
    /**
     * Refresh the current view using the same configuration as before.
     * This is useful for our demokit !
     *
     * @param oComponent
     * @returns A promise indicating when the view is refreshed
     * @private
     */
    ;

    _proto.refreshView = function refreshView(oComponent) {
      var oRootView = oComponent.getRootControl();

      if (oRootView) {
        oRootView.destroy();
      } else if (this.oView) {
        this.oView.destroy();
      }

      return this.createView(this.resourceModel, this.stableId, "", "", undefined, this.TemplateConverter, this.MetaModelConverter).then(function () {
        oComponent.oContainer.invalidate();
      }).catch(function (oError) {
        oComponent.oContainer.invalidate();
        Log.error(oError);
      });
    };

    _proto.createView = function createView(oResourceModel, sStableId, sCacheKey, sPageModelCacheKey, oPageModelCache, TemplateConverter, MetaModelConverter) {
      try {
        var _this4 = this;

        _this4.resourceModel = oResourceModel;
        _this4.stableId = sStableId;
        _this4.TemplateConverter = TemplateConverter;
        _this4.MetaModelConverter = MetaModelConverter;

        var oContext = _this4.getContext();

        var mServiceSettings = oContext.settings;
        var sConverterType = mServiceSettings.converterType;
        var oComponent = oContext.scopeObject;
        var oAppComponent = Component.getOwnerComponentFor(oComponent);
        var sFullContextPath = oAppComponent.getRoutingService().getTargetInformationFor(oComponent).options.settings.fullContextPath;
        var oMetaModel = oAppComponent.getMetaModel();
        var oManifestContent = oAppComponent.getManifest();
        var oDeviceModel = new JSONModel(Device).setDefaultBindingMode("OneWay");
        var oManifestModel = new JSONModel(oManifestContent);
        var bError = false;

        // Load the index for the additional building blocks which is responsible for initializing them
        function getViewSettings() {
          var aSplitPath = sFullContextPath.split("/");
          var sEntitySetPath = aSplitPath.reduce(function (sPathSoFar, sNextPathPart) {
            if (sNextPathPart === "") {
              return sPathSoFar;
            }

            if (sPathSoFar === "") {
              sPathSoFar = "/".concat(sNextPathPart);
            } else {
              var oTarget = oMetaModel.getObject("".concat(sPathSoFar, "/$NavigationPropertyBinding/").concat(sNextPathPart));

              if (oTarget && Object.keys(oTarget).length > 0) {
                sPathSoFar += "/$NavigationPropertyBinding";
              }

              sPathSoFar += "/".concat(sNextPathPart);
            }

            return sPathSoFar;
          }, "");
          var viewType = mServiceSettings.viewType || oComponent.getViewType() || "XML";

          if (viewType !== "XML") {
            viewType = undefined;
          }

          return {
            type: viewType,
            preprocessors: {
              xml: {
                bindingContexts: {
                  entitySet: sEntitySetPath ? oMetaModel.createBindingContext(sEntitySetPath) : null,
                  fullContextPath: sFullContextPath ? oMetaModel.createBindingContext(sFullContextPath) : null,
                  contextPath: sFullContextPath ? oMetaModel.createBindingContext(sFullContextPath) : null,
                  converterContext: oPageModel.createBindingContext("/", undefined, {
                    noResolve: true
                  }),
                  viewData: mViewData ? oViewDataModel.createBindingContext("/") : null
                },
                models: {
                  entitySet: oMetaModel,
                  fullContextPath: oMetaModel,
                  contextPath: oMetaModel,
                  "sap.fe.i18n": oResourceModel,
                  metaModel: oMetaModel,
                  "device": oDeviceModel,
                  manifest: oManifestModel,
                  converterContext: oPageModel,
                  viewData: oViewDataModel
                },
                appComponent: oAppComponent
              }
            },
            id: sStableId,
            viewName: mServiceSettings.viewName || oComponent.getViewName(),
            viewData: mViewData,
            cache: {
              keys: [sCacheKey]
            },
            models: {
              "sap.fe.i18n": oResourceModel
            },
            height: "100%"
          };
        }

        var oPageModel, oViewDataModel, oViewSettings, mViewData;

        var createErrorPage = function (reason) {
          // just replace the view name and add an additional model containing the reason, but
          // keep the other settings
          Log.error(reason.message, reason);
          oViewSettings.viewName = mServiceSettings.errorViewName || "sap.fe.core.services.view.TemplatingErrorPage";
          oViewSettings.preprocessors.xml.models["error"] = new JSONModel(reason);
          return oComponent.runAsOwner(function () {
            return View.create(oViewSettings).then(function (oView) {
              _this4.oView = oView;

              _this4.oView.setModel(new ManagedObjectModel(_this4.oView), "$view");

              oComponent.setAggregation("rootControl", _this4.oView);
              return sCacheKey;
            });
          });
        };

        return Promise.resolve(_catch(function () {
          return Promise.resolve(oAppComponent.getService("routingService")).then(function (oRoutingService) {
            var _oManifestContent$sap;

            // Retrieve the viewLevel for the component
            var oTargetInfo = oRoutingService.getTargetInformationFor(oComponent);
            var mOutbounds = oManifestContent["sap.app"] && oManifestContent["sap.app"].crossNavigation && oManifestContent["sap.app"].crossNavigation.outbounds || {};
            var mNavigation = oComponent.getNavigation() || {};
            Object.keys(mNavigation).forEach(function (navigationObjectKey) {
              var navigationObject = mNavigation[navigationObjectKey];
              var outboundConfig;

              if (navigationObject.detail && navigationObject.detail.outbound && mOutbounds[navigationObject.detail.outbound]) {
                outboundConfig = mOutbounds[navigationObject.detail.outbound];
                navigationObject.detail.outboundDetail = {
                  semanticObject: outboundConfig.semanticObject,
                  action: outboundConfig.action,
                  parameters: outboundConfig.parameters
                };
              }

              if (navigationObject.create && navigationObject.create.outbound && mOutbounds[navigationObject.create.outbound]) {
                outboundConfig = mOutbounds[navigationObject.create.outbound];
                navigationObject.create.outboundDetail = {
                  semanticObject: outboundConfig.semanticObject,
                  action: outboundConfig.action,
                  parameters: outboundConfig.parameters
                };
              }
            });
            mViewData = {
              navigation: mNavigation,
              viewLevel: oTargetInfo.viewLevel,
              stableId: sStableId,
              contentDensities: (_oManifestContent$sap = oManifestContent["sap.ui5"]) === null || _oManifestContent$sap === void 0 ? void 0 : _oManifestContent$sap.contentDensities,
              resourceBundle: oResourceModel.__bundle,
              fullContextPath: sFullContextPath,
              isDesktop: Device.system.desktop,
              isPhone: Device.system.phone
            };

            if (oComponent.getViewData) {
              Object.assign(mViewData, oComponent.getViewData());
            }

            var oShellServices = oAppComponent.getShellServices();
            mViewData.converterType = sConverterType;
            mViewData.shellContentDensity = oShellServices.getContentDensity();
            mViewData.useNewLazyLoading = UriParameters.fromQuery(window.location.search).get("sap-fe-xx-lazyloadingtest") === "true";
            mViewData.retrieveTextFromValueList = oManifestContent["sap.fe"] && oManifestContent["sap.fe"].form ? oManifestContent["sap.fe"].form.retrieveTextFromValueList : undefined;
            oViewDataModel = new JSONModel(mViewData);

            if (mViewData && mViewData.controlConfiguration) {
              Object.keys(mViewData.controlConfiguration).forEach(function (sAnnotationPath) {
                if (sAnnotationPath.indexOf("[") !== -1) {
                  var sTargetAnnotationPath = resolveDynamicExpression(sAnnotationPath, oMetaModel);
                  mViewData.controlConfiguration[sTargetAnnotationPath] = mViewData.controlConfiguration[sAnnotationPath];
                }
              });
            }

            MetaModelConverter.convertTypes(oMetaModel, oAppComponent.getEnvironmentCapabilities().getCapabilities());
            oPageModel = new TemplateModel(function () {
              try {
                if (oPageModelCache) {
                  return oPageModelCache;
                } else {
                  var oDiagnostics = oAppComponent.getDiagnostics();
                  var iIssueCount = oDiagnostics.getIssues().length;
                  var oConverterPageModel = TemplateConverter.convertPage(sConverterType, oMetaModel, mViewData, oDiagnostics, sFullContextPath, oAppComponent.getEnvironmentCapabilities().getCapabilities());
                  var aIssues = oDiagnostics.getIssues();
                  var aAddedIssues = aIssues.slice(iIssueCount);

                  if (aAddedIssues.length > 0) {
                    Log.warning("Some issues have been detected in your project, please check the UI5 support assistant rule for sap.fe.core");
                  }

                  return oConverterPageModel;
                }
              } catch (error) {
                Log.error(error, error);
                return {};
              }
            }, oMetaModel);

            if (!bError) {
              oViewSettings = getViewSettings(); // Setting the pageModel on the component for potential reuse

              oComponent.setModel(oPageModel, "_pageModel");
              return oComponent.runAsOwner(function () {
                return View.create(oViewSettings).catch(createErrorPage).then(function (oView) {
                  _this4.oView = oView;

                  _this4.oView.setModel(new ManagedObjectModel(_this4.oView), "$view");

                  _this4.oView.setModel(oViewDataModel, "viewData");

                  oComponent.setAggregation("rootControl", _this4.oView); // Fire and forget in the cache

                  if (!oPageModelCache) {
                    _this4._setCachedModel(sPageModelCacheKey, oPageModel.getData());
                  }

                  return sCacheKey;
                }).catch(function (e) {
                  return Log.error(e.message, e);
                });
              });
            }
          });
        }, function (error) {
          Log.error(error.message, error);
          throw new Error("Error while creating view : ".concat(error));
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.getView = function getView() {
      return this.oView;
    };

    _proto.getInterface = function getInterface() {
      return this;
    };

    _proto.exit = function exit() {
      // Deregister global instance
      if (this.oResourceModelService) {
        this.oResourceModelService.destroy();
      }

      if (this.oCacheHandlerService) {
        this.oCacheHandlerService.destroy();
      }

      this.oFactory.removeGlobalInstance();
    };

    return TemplatedViewService;
  }(Service);

  var TemplatedViewServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inheritsLoose(TemplatedViewServiceFactory, _ServiceFactory);

    function TemplatedViewServiceFactory() {
      var _this5;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this5 = _ServiceFactory.call.apply(_ServiceFactory, [this].concat(args)) || this;
      _this5._oInstanceRegistry = {};
      return _this5;
    }

    var _proto2 = TemplatedViewServiceFactory.prototype;

    _proto2.createInstance = function createInstance(oServiceContext) {
      TemplatedViewServiceFactory.iCreatingViews++;
      var oTemplatedViewService = new TemplatedViewService(Object.assign({
        factory: this
      }, oServiceContext));
      return oTemplatedViewService.initPromise.then(function () {
        TemplatedViewServiceFactory.iCreatingViews--;
        return oTemplatedViewService;
      });
    };

    _proto2.removeGlobalInstance = function removeGlobalInstance() {
      this._oInstanceRegistry = {};
    };

    TemplatedViewServiceFactory.getNumberOfViewsInCreationState = function getNumberOfViewsInCreationState() {
      return TemplatedViewServiceFactory.iCreatingViews;
    };

    return TemplatedViewServiceFactory;
  }(ServiceFactory);

  return TemplatedViewServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiVGVtcGxhdGVkVmlld1NlcnZpY2UiLCJpbml0IiwiYVNlcnZpY2VEZXBlbmRlbmNpZXMiLCJvQ29udGV4dCIsImdldENvbnRleHQiLCJvQ29tcG9uZW50Iiwic2NvcGVPYmplY3QiLCJvQXBwQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiZ2V0T3duZXJDb21wb25lbnRGb3IiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwic1N0YWJsZUlkIiwiZ2V0TWV0YWRhdGEiLCJnZXRDb21wb25lbnROYW1lIiwiZ2V0TG9jYWxJZCIsImdldElkIiwiYUVuaGFuY2VJMThuIiwiZ2V0RW5oYW5jZUkxOG4iLCJzQXBwTmFtZXNwYWNlIiwib0ZhY3RvcnkiLCJmYWN0b3J5IiwiaSIsImxlbmd0aCIsIm9SZXNvdXJjZU1vZGVsIiwiZ2V0TW9kZWwiLCJpc0EiLCJyZXBsYWNlIiwic0NhY2hlSWRlbnRpZmllciIsImdldE5hbWUiLCJzYXAiLCJ1aSIsImdldENvcmUiLCJnZXRDb25maWd1cmF0aW9uIiwiZ2V0TGFuZ3VhZ2VUYWciLCJwdXNoIiwiU2VydmljZUZhY3RvcnlSZWdpc3RyeSIsImdldCIsImNyZWF0ZUluc3RhbmNlIiwic2NvcGVUeXBlIiwic2V0dGluZ3MiLCJidW5kbGVzIiwiZW5oYW5jZUkxOG4iLCJtb2RlbE5hbWUiLCJvUmVzb3VyY2VNb2RlbFNlcnZpY2UiLCJnZXRSZXNvdXJjZU1vZGVsIiwibWV0YU1vZGVsIiwiYXBwQ29tcG9uZW50IiwiY29tcG9uZW50Iiwib0NhY2hlSGFuZGxlclNlcnZpY2UiLCJ2YWxpZGF0ZUNhY2hlS2V5IiwiVmVyc2lvbkluZm8iLCJsb2FkIiwib0luZm8iLCJzVGltZXN0YW1wIiwibGlicmFyaWVzIiwiYnVpbGRpbmZvIiwiYnVpbGR0aW1lIiwiZm9yRWFjaCIsIm9MaWJyYXJ5IiwiYnVpbGRUaW1lc3RhbXAiLCJjYXRjaCIsInNQYWdlTW9kZWxDYWNoZUtleSIsImluaXRQcm9taXNlIiwiUHJvbWlzZSIsImFsbCIsImFEZXBlbmRlbmNpZXNSZXN1bHQiLCJzQ2FjaGVLZXkiLCJzVmVyc2lvbkluZm8iLCJvU2hlbGxTZXJ2aWNlcyIsImdldFNoZWxsU2VydmljZXMiLCJvU2lkZUVmZmVjdHNTZXJ2aWNlcyIsImdldFNpZGVFZmZlY3RzU2VydmljZSIsImluaXRpYWxpemVTaWRlRWZmZWN0cyIsImdldEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwiZ2V0Q2FwYWJpbGl0aWVzIiwiaW5zdGFuY2VUeXBlIiwidW5kZWZpbmVkIiwiY29uY2F0IiwiX2dldENhY2hlZE1vZGVsIiwib1BhZ2VNb2RlbENhY2hlIiwicmVxdWlyZURlcGVuZGVuY2llcyIsIlRlbXBsYXRlQ29udmVydGVyIiwiTWV0YU1vZGVsQ29udmVydGVyIiwiY3JlYXRlVmlldyIsImdldEluc3RhbmNlIiwiaW52YWxpZGF0ZUlmTmVlZGVkIiwiQ29yZSIsImdldFZpZXdDYWNoZSIsIkNhY2hlTWFuYWdlciIsIl9zZXRDYWNoZWRNb2RlbCIsIm9DYWNoZU1vZGVsIiwic2V0IiwicmVmcmVzaFZpZXciLCJvUm9vdFZpZXciLCJnZXRSb290Q29udHJvbCIsImRlc3Ryb3kiLCJvVmlldyIsInJlc291cmNlTW9kZWwiLCJzdGFibGVJZCIsIm9Db250YWluZXIiLCJpbnZhbGlkYXRlIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJtU2VydmljZVNldHRpbmdzIiwic0NvbnZlcnRlclR5cGUiLCJjb252ZXJ0ZXJUeXBlIiwic0Z1bGxDb250ZXh0UGF0aCIsImdldFJvdXRpbmdTZXJ2aWNlIiwiZ2V0VGFyZ2V0SW5mb3JtYXRpb25Gb3IiLCJvcHRpb25zIiwiZnVsbENvbnRleHRQYXRoIiwib01hbmlmZXN0Q29udGVudCIsImdldE1hbmlmZXN0Iiwib0RldmljZU1vZGVsIiwiSlNPTk1vZGVsIiwiRGV2aWNlIiwic2V0RGVmYXVsdEJpbmRpbmdNb2RlIiwib01hbmlmZXN0TW9kZWwiLCJiRXJyb3IiLCJnZXRWaWV3U2V0dGluZ3MiLCJhU3BsaXRQYXRoIiwic3BsaXQiLCJzRW50aXR5U2V0UGF0aCIsInJlZHVjZSIsInNQYXRoU29GYXIiLCJzTmV4dFBhdGhQYXJ0Iiwib1RhcmdldCIsImdldE9iamVjdCIsIk9iamVjdCIsImtleXMiLCJ2aWV3VHlwZSIsImdldFZpZXdUeXBlIiwidHlwZSIsInByZXByb2Nlc3NvcnMiLCJ4bWwiLCJiaW5kaW5nQ29udGV4dHMiLCJlbnRpdHlTZXQiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsImNvbnRleHRQYXRoIiwiY29udmVydGVyQ29udGV4dCIsIm9QYWdlTW9kZWwiLCJub1Jlc29sdmUiLCJ2aWV3RGF0YSIsIm1WaWV3RGF0YSIsIm9WaWV3RGF0YU1vZGVsIiwibW9kZWxzIiwibWFuaWZlc3QiLCJpZCIsInZpZXdOYW1lIiwiZ2V0Vmlld05hbWUiLCJjYWNoZSIsImhlaWdodCIsIm9WaWV3U2V0dGluZ3MiLCJjcmVhdGVFcnJvclBhZ2UiLCJyZWFzb24iLCJtZXNzYWdlIiwiZXJyb3JWaWV3TmFtZSIsInJ1bkFzT3duZXIiLCJWaWV3IiwiY3JlYXRlIiwic2V0TW9kZWwiLCJNYW5hZ2VkT2JqZWN0TW9kZWwiLCJzZXRBZ2dyZWdhdGlvbiIsImdldFNlcnZpY2UiLCJvUm91dGluZ1NlcnZpY2UiLCJvVGFyZ2V0SW5mbyIsIm1PdXRib3VuZHMiLCJjcm9zc05hdmlnYXRpb24iLCJvdXRib3VuZHMiLCJtTmF2aWdhdGlvbiIsImdldE5hdmlnYXRpb24iLCJuYXZpZ2F0aW9uT2JqZWN0S2V5IiwibmF2aWdhdGlvbk9iamVjdCIsIm91dGJvdW5kQ29uZmlnIiwiZGV0YWlsIiwib3V0Ym91bmQiLCJvdXRib3VuZERldGFpbCIsInNlbWFudGljT2JqZWN0IiwiYWN0aW9uIiwicGFyYW1ldGVycyIsIm5hdmlnYXRpb24iLCJ2aWV3TGV2ZWwiLCJjb250ZW50RGVuc2l0aWVzIiwicmVzb3VyY2VCdW5kbGUiLCJfX2J1bmRsZSIsImlzRGVza3RvcCIsInN5c3RlbSIsImRlc2t0b3AiLCJpc1Bob25lIiwicGhvbmUiLCJnZXRWaWV3RGF0YSIsImFzc2lnbiIsInNoZWxsQ29udGVudERlbnNpdHkiLCJnZXRDb250ZW50RGVuc2l0eSIsInVzZU5ld0xhenlMb2FkaW5nIiwiVXJpUGFyYW1ldGVycyIsImZyb21RdWVyeSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwicmV0cmlldmVUZXh0RnJvbVZhbHVlTGlzdCIsImZvcm0iLCJjb250cm9sQ29uZmlndXJhdGlvbiIsInNBbm5vdGF0aW9uUGF0aCIsImluZGV4T2YiLCJzVGFyZ2V0QW5ub3RhdGlvblBhdGgiLCJyZXNvbHZlRHluYW1pY0V4cHJlc3Npb24iLCJjb252ZXJ0VHlwZXMiLCJUZW1wbGF0ZU1vZGVsIiwib0RpYWdub3N0aWNzIiwiZ2V0RGlhZ25vc3RpY3MiLCJpSXNzdWVDb3VudCIsImdldElzc3VlcyIsIm9Db252ZXJ0ZXJQYWdlTW9kZWwiLCJjb252ZXJ0UGFnZSIsImFJc3N1ZXMiLCJhQWRkZWRJc3N1ZXMiLCJzbGljZSIsIndhcm5pbmciLCJnZXREYXRhIiwiRXJyb3IiLCJnZXRWaWV3IiwiZ2V0SW50ZXJmYWNlIiwiZXhpdCIsInJlbW92ZUdsb2JhbEluc3RhbmNlIiwiU2VydmljZSIsIlRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeSIsIl9vSW5zdGFuY2VSZWdpc3RyeSIsIm9TZXJ2aWNlQ29udGV4dCIsImlDcmVhdGluZ1ZpZXdzIiwib1RlbXBsYXRlZFZpZXdTZXJ2aWNlIiwiZ2V0TnVtYmVyT2ZWaWV3c0luQ3JlYXRpb25TdGF0ZSIsIlNlcnZpY2VGYWN0b3J5Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJUZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgVXJpUGFyYW1ldGVycyBmcm9tIFwic2FwL2Jhc2UvdXRpbC9VcmlQYXJhbWV0ZXJzXCI7XG5pbXBvcnQgdHlwZSBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IHsgcmVxdWlyZURlcGVuZGVuY2llcyB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0xvYWRlclV0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IENhY2hlSGFuZGxlclNlcnZpY2UgfSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvQ2FjaGVIYW5kbGVyU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBUZW1wbGF0ZU1vZGVsIGZyb20gXCJzYXAvZmUvY29yZS9UZW1wbGF0ZU1vZGVsXCI7XG5pbXBvcnQgdHlwZSBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvZmUvbWFjcm9zL1Jlc291cmNlTW9kZWxcIjtcbmltcG9ydCBDYWNoZU1hbmFnZXIgZnJvbSBcInNhcC91aS9jb3JlL2NhY2hlL0NhY2hlTWFuYWdlclwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwic2FwL3VpL2NvcmUvQ29tcG9uZW50XCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgU2VydmljZSBmcm9tIFwic2FwL3VpL2NvcmUvc2VydmljZS9TZXJ2aWNlXCI7XG5pbXBvcnQgU2VydmljZUZhY3RvcnkgZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2UvU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBTZXJ2aWNlRmFjdG9yeVJlZ2lzdHJ5IGZyb20gXCJzYXAvdWkvY29yZS9zZXJ2aWNlL1NlcnZpY2VGYWN0b3J5UmVnaXN0cnlcIjtcbmltcG9ydCBEZXZpY2UgZnJvbSBcInNhcC91aS9EZXZpY2VcIjtcbmltcG9ydCBNYW5hZ2VkT2JqZWN0TW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9iYXNlL01hbmFnZWRPYmplY3RNb2RlbFwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL01vZGVsXCI7XG5pbXBvcnQgVmVyc2lvbkluZm8gZnJvbSBcInNhcC91aS9WZXJzaW9uSW5mb1wiO1xuaW1wb3J0IHR5cGUgeyBTZXJ2aWNlQ29udGV4dCB9IGZyb20gXCJ0eXBlcy9leHRlbnNpb25fdHlwZXNcIjtcbmltcG9ydCB7IHJlc29sdmVEeW5hbWljRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9oZWxwZXJzL0R5bmFtaWNBbm5vdGF0aW9uUGF0aEhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBSZXNvdXJjZU1vZGVsU2VydmljZSB9IGZyb20gXCIuL1Jlc291cmNlTW9kZWxTZXJ2aWNlRmFjdG9yeVwiO1xuXG50eXBlIFRlbXBsYXRlZFZpZXdTZXJ2aWNlU2V0dGluZ3MgPSB7fTtcbnR5cGUgTWFuaWZlc3RDb250ZW50ID0ge1xuXHRcInNhcC5hcHBcIj86IHtcblx0XHRcImNyb3NzTmF2aWdhdGlvblwiPzoge1xuXHRcdFx0XCJvdXRib3VuZHNcIj86IFJlY29yZDxcblx0XHRcdFx0c3RyaW5nLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IHN0cmluZztcblx0XHRcdFx0XHRhY3Rpb246IHN0cmluZztcblx0XHRcdFx0XHRwYXJhbWV0ZXJzOiBzdHJpbmc7XG5cdFx0XHRcdH1cblx0XHRcdD47XG5cdFx0fTtcblx0fTtcblx0XCJzYXAudWk1XCI/OiB7XG5cdFx0XCJjb250ZW50RGVuc2l0aWVzXCI/OiBzdHJpbmc7XG5cdH07XG5cdFwic2FwLmZlXCI/OiB7XG5cdFx0XCJmb3JtXCI/OiB7XG5cdFx0XHRcInJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3RcIj86IGJvb2xlYW47XG5cdFx0fTtcblx0fTtcbn07XG5jbGFzcyBUZW1wbGF0ZWRWaWV3U2VydmljZSBleHRlbmRzIFNlcnZpY2U8VGVtcGxhdGVkVmlld1NlcnZpY2VTZXR0aW5ncz4ge1xuXHRpbml0UHJvbWlzZSE6IFByb21pc2U8YW55Pjtcblx0b1ZpZXchOiBWaWV3O1xuXHRvUmVzb3VyY2VNb2RlbFNlcnZpY2UhOiBSZXNvdXJjZU1vZGVsU2VydmljZTtcblx0b0NhY2hlSGFuZGxlclNlcnZpY2UhOiBDYWNoZUhhbmRsZXJTZXJ2aWNlO1xuXHRvRmFjdG9yeSE6IFRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeTtcblx0cmVzb3VyY2VNb2RlbCE6IHR5cGVvZiBSZXNvdXJjZU1vZGVsO1xuXHRzdGFibGVJZCE6IHN0cmluZztcblx0VGVtcGxhdGVDb252ZXJ0ZXI6IGFueTtcblx0TWV0YU1vZGVsQ29udmVydGVyOiBhbnk7XG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgYVNlcnZpY2VEZXBlbmRlbmNpZXMgPSBbXTtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdGNvbnN0IG9Db21wb25lbnQgPSBvQ29udGV4dC5zY29wZU9iamVjdDtcblx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tcG9uZW50LmdldE93bmVyQ29tcG9uZW50Rm9yKG9Db21wb25lbnQpIGFzIEFwcENvbXBvbmVudDtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb0FwcENvbXBvbmVudC5nZXRNZXRhTW9kZWwoKTtcblx0XHRjb25zdCBzU3RhYmxlSWQgPSBgJHtvQXBwQ29tcG9uZW50LmdldE1ldGFkYXRhKCkuZ2V0Q29tcG9uZW50TmFtZSgpfTo6JHtvQXBwQ29tcG9uZW50LmdldExvY2FsSWQob0NvbXBvbmVudC5nZXRJZCgpKX1gO1xuXHRcdGNvbnN0IGFFbmhhbmNlSTE4biA9IG9Db21wb25lbnQuZ2V0RW5oYW5jZUkxOG4oKSB8fCBbXTtcblx0XHRsZXQgc0FwcE5hbWVzcGFjZTtcblx0XHR0aGlzLm9GYWN0b3J5ID0gb0NvbnRleHQuZmFjdG9yeTtcblx0XHRpZiAoYUVuaGFuY2VJMThuKSB7XG5cdFx0XHRzQXBwTmFtZXNwYWNlID0gb0FwcENvbXBvbmVudC5nZXRNZXRhZGF0YSgpLmdldENvbXBvbmVudE5hbWUoKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYUVuaGFuY2VJMThuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdC8vIEluIG9yZGVyIHRvIHN1cHBvcnQgdGV4dC12ZXJ0aWNhbGl6YXRpb24gYXBwbGljYXRpb25zIGNhbiBhbHNvIHBhc3NzIGEgcmVzb3VyY2UgbW9kZWwgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3Rcblx0XHRcdFx0Ly8gVUk1IHRha2VzIGNhcmUgb2YgdGV4dC12ZXJ0aWNhbGl6YXRpb24gZm9yIHJlc291cmNlIG1vZGVscyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuXHRcdFx0XHQvLyBIZW5jZSBjaGVjayBpZiB0aGUgZ2l2ZW4ga2V5IGlzIGEgcmVzb3VyY2UgbW9kZWwgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3Rcblx0XHRcdFx0Ly8gaWYgc28gdGhpcyBtb2RlbCBzaG91bGQgYmUgdXNlZCB0byBlbmhhbmNlIHRoZSBzYXAuZmUgcmVzb3VyY2UgbW9kZWwgc28gcGFzcyBpdCBhcyBpdCBpc1xuXHRcdFx0XHRjb25zdCBvUmVzb3VyY2VNb2RlbCA9IG9BcHBDb21wb25lbnQuZ2V0TW9kZWwoYUVuaGFuY2VJMThuW2ldKTtcblx0XHRcdFx0aWYgKG9SZXNvdXJjZU1vZGVsICYmIG9SZXNvdXJjZU1vZGVsLmlzQShcInNhcC51aS5tb2RlbC5yZXNvdXJjZS5SZXNvdXJjZU1vZGVsXCIpKSB7XG5cdFx0XHRcdFx0YUVuaGFuY2VJMThuW2ldID0gb1Jlc291cmNlTW9kZWw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YUVuaGFuY2VJMThuW2ldID0gYCR7c0FwcE5hbWVzcGFjZX0uJHthRW5oYW5jZUkxOG5baV0ucmVwbGFjZShcIi5wcm9wZXJ0aWVzXCIsIFwiXCIpfWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCBzQ2FjaGVJZGVudGlmaWVyID0gYCR7b0FwcENvbXBvbmVudC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKX1fJHtzU3RhYmxlSWR9XyR7c2FwLnVpXG5cdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHQuZ2V0Q29uZmlndXJhdGlvbigpXG5cdFx0XHQuZ2V0TGFuZ3VhZ2VUYWcoKX1gO1xuXHRcdGFTZXJ2aWNlRGVwZW5kZW5jaWVzLnB1c2goXG5cdFx0XHRTZXJ2aWNlRmFjdG9yeVJlZ2lzdHJ5LmdldChcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlJlc291cmNlTW9kZWxTZXJ2aWNlXCIpXG5cdFx0XHRcdC5jcmVhdGVJbnN0YW5jZSh7XG5cdFx0XHRcdFx0c2NvcGVUeXBlOiBcImNvbXBvbmVudFwiLFxuXHRcdFx0XHRcdHNjb3BlT2JqZWN0OiBvQ29tcG9uZW50LFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRidW5kbGVzOiBbXCJzYXAuZmUuY29yZS5tZXNzYWdlYnVuZGxlXCIsIFwic2FwLmZlLm1hY3Jvcy5tZXNzYWdlYnVuZGxlXCIsIFwic2FwLmZlLnRlbXBsYXRlcy5tZXNzYWdlYnVuZGxlXCJdLFxuXHRcdFx0XHRcdFx0ZW5oYW5jZUkxOG46IGFFbmhhbmNlSTE4bixcblx0XHRcdFx0XHRcdG1vZGVsTmFtZTogXCJzYXAuZmUuaTE4blwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbigob1Jlc291cmNlTW9kZWxTZXJ2aWNlOiBSZXNvdXJjZU1vZGVsU2VydmljZSkgPT4ge1xuXHRcdFx0XHRcdHRoaXMub1Jlc291cmNlTW9kZWxTZXJ2aWNlID0gb1Jlc291cmNlTW9kZWxTZXJ2aWNlO1xuXHRcdFx0XHRcdHJldHVybiBvUmVzb3VyY2VNb2RlbFNlcnZpY2UuZ2V0UmVzb3VyY2VNb2RlbCgpO1xuXHRcdFx0XHR9KVxuXHRcdCk7XG5cblx0XHRhU2VydmljZURlcGVuZGVuY2llcy5wdXNoKFxuXHRcdFx0U2VydmljZUZhY3RvcnlSZWdpc3RyeS5nZXQoXCJzYXAuZmUuY29yZS5zZXJ2aWNlcy5DYWNoZUhhbmRsZXJTZXJ2aWNlXCIpXG5cdFx0XHRcdC5jcmVhdGVJbnN0YW5jZSh7XG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdG1ldGFNb2RlbDogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRcdGFwcENvbXBvbmVudDogb0FwcENvbXBvbmVudCxcblx0XHRcdFx0XHRcdGNvbXBvbmVudDogb0NvbXBvbmVudFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oKG9DYWNoZUhhbmRsZXJTZXJ2aWNlOiBhbnkpID0+IHtcblx0XHRcdFx0XHR0aGlzLm9DYWNoZUhhbmRsZXJTZXJ2aWNlID0gb0NhY2hlSGFuZGxlclNlcnZpY2U7XG5cdFx0XHRcdFx0cmV0dXJuIG9DYWNoZUhhbmRsZXJTZXJ2aWNlLnZhbGlkYXRlQ2FjaGVLZXkoc0NhY2hlSWRlbnRpZmllciwgb0NvbXBvbmVudCk7XG5cdFx0XHRcdH0pXG5cdFx0KTtcblx0XHRhU2VydmljZURlcGVuZGVuY2llcy5wdXNoKFxuXHRcdFx0KFZlcnNpb25JbmZvIGFzIGFueSlcblx0XHRcdFx0LmxvYWQoKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAob0luZm86IGFueSkge1xuXHRcdFx0XHRcdGxldCBzVGltZXN0YW1wID0gXCJcIjtcblx0XHRcdFx0XHRpZiAoIW9JbmZvLmxpYnJhcmllcykge1xuXHRcdFx0XHRcdFx0c1RpbWVzdGFtcCA9IChzYXAudWkgYXMgYW55KS5idWlsZGluZm8uYnVpbGR0aW1lO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvSW5mby5saWJyYXJpZXMuZm9yRWFjaChmdW5jdGlvbiAob0xpYnJhcnk6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRzVGltZXN0YW1wICs9IG9MaWJyYXJ5LmJ1aWxkVGltZXN0YW1wO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBzVGltZXN0YW1wO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBcIjxOT1ZBTFVFPlwiO1xuXHRcdFx0XHR9KVxuXHRcdCk7XG5cblx0XHRsZXQgc1BhZ2VNb2RlbENhY2hlS2V5OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0dGhpcy5pbml0UHJvbWlzZSA9IFByb21pc2UuYWxsKGFTZXJ2aWNlRGVwZW5kZW5jaWVzKVxuXHRcdFx0LnRoZW4oKGFEZXBlbmRlbmNpZXNSZXN1bHQ6IGFueVtdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHNDYWNoZUtleSA9IGFEZXBlbmRlbmNpZXNSZXN1bHRbMV07XG5cdFx0XHRcdGNvbnN0IHNWZXJzaW9uSW5mbyA9IGFEZXBlbmRlbmNpZXNSZXN1bHRbMl07XG5cdFx0XHRcdGNvbnN0IG9TaGVsbFNlcnZpY2VzID0gb0FwcENvbXBvbmVudC5nZXRTaGVsbFNlcnZpY2VzKCk7XG5cdFx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0c1NlcnZpY2VzID0gb0FwcENvbXBvbmVudC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKTtcblxuXHRcdFx0XHRvU2lkZUVmZmVjdHNTZXJ2aWNlcy5pbml0aWFsaXplU2lkZUVmZmVjdHMob0FwcENvbXBvbmVudC5nZXRFbnZpcm9ubWVudENhcGFiaWxpdGllcygpLmdldENhcGFiaWxpdGllcygpKTtcblxuXHRcdFx0XHQvLyBJbiBjYXNlIHRoZXJlIGlzIG5vIGNhY2hlIGtleSB3ZSBpZ25vcmUgdGhlIHZpZXcgY2FjaGVcblx0XHRcdFx0c1BhZ2VNb2RlbENhY2hlS2V5ID0gc0NhY2hlS2V5XG5cdFx0XHRcdFx0PyBgJHtzQ2FjaGVLZXl9LSR7c1ZlcnNpb25JbmZvfS0ke3NTdGFibGVJZH0tJHtvU2hlbGxTZXJ2aWNlcy5pbnN0YW5jZVR5cGV9LXBhZ2VNb2RlbGBcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKGFEZXBlbmRlbmNpZXNSZXN1bHQuY29uY2F0KFt0aGlzLl9nZXRDYWNoZWRNb2RlbChzUGFnZU1vZGVsQ2FjaGVLZXkpXSkpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChhRGVwZW5kZW5jaWVzUmVzdWx0OiBhbnlbXSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvUmVzb3VyY2VNb2RlbCA9IGFEZXBlbmRlbmNpZXNSZXN1bHRbMF07XG5cdFx0XHRcdGNvbnN0IHNDYWNoZUtleSA9IGFEZXBlbmRlbmNpZXNSZXN1bHRbMV07XG5cdFx0XHRcdGNvbnN0IG9QYWdlTW9kZWxDYWNoZSA9IGFEZXBlbmRlbmNpZXNSZXN1bHRbM107XG5cdFx0XHRcdGNvbnN0IFtUZW1wbGF0ZUNvbnZlcnRlciwgTWV0YU1vZGVsQ29udmVydGVyXSA9IGF3YWl0IHJlcXVpcmVEZXBlbmRlbmNpZXMoW1xuXHRcdFx0XHRcdFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9UZW1wbGF0ZUNvbnZlcnRlclwiLFxuXHRcdFx0XHRcdFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIlxuXHRcdFx0XHRdKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlVmlldyhcblx0XHRcdFx0XHRvUmVzb3VyY2VNb2RlbCxcblx0XHRcdFx0XHRzU3RhYmxlSWQsXG5cdFx0XHRcdFx0c0NhY2hlS2V5LFxuXHRcdFx0XHRcdHNQYWdlTW9kZWxDYWNoZUtleSxcblx0XHRcdFx0XHRvUGFnZU1vZGVsQ2FjaGUsXG5cdFx0XHRcdFx0VGVtcGxhdGVDb252ZXJ0ZXIsXG5cdFx0XHRcdFx0TWV0YU1vZGVsQ29udmVydGVyXG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHNDYWNoZUtleTogYW55KSB7XG5cdFx0XHRcdGNvbnN0IG9DYWNoZUhhbmRsZXJTZXJ2aWNlID0gU2VydmljZUZhY3RvcnlSZWdpc3RyeS5nZXQoXCJzYXAuZmUuY29yZS5zZXJ2aWNlcy5DYWNoZUhhbmRsZXJTZXJ2aWNlXCIpLmdldEluc3RhbmNlKG9NZXRhTW9kZWwpO1xuXHRcdFx0XHRvQ2FjaGVIYW5kbGVyU2VydmljZS5pbnZhbGlkYXRlSWZOZWVkZWQoc0NhY2hlS2V5LCBzQ2FjaGVJZGVudGlmaWVyLCBvQ29tcG9uZW50KTtcblx0XHRcdH0pO1xuXHR9XG5cdF9nZXRDYWNoZWRNb2RlbChzQ2FjaGVLZXk6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuXHRcdGlmIChzQ2FjaGVLZXkgJiYgQ29yZS5nZXRDb25maWd1cmF0aW9uKCkuZ2V0Vmlld0NhY2hlKCkpIHtcblx0XHRcdHJldHVybiBDYWNoZU1hbmFnZXIuZ2V0KHNDYWNoZUtleSk7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0X3NldENhY2hlZE1vZGVsKHNDYWNoZUtleTogc3RyaW5nIHwgdW5kZWZpbmVkLCBvQ2FjaGVNb2RlbDogYW55KSB7XG5cdFx0aWYgKHNDYWNoZUtleSAmJiBDb3JlLmdldENvbmZpZ3VyYXRpb24oKS5nZXRWaWV3Q2FjaGUoKSkge1xuXHRcdFx0Q2FjaGVNYW5hZ2VyLnNldChzQ2FjaGVLZXksIG9DYWNoZU1vZGVsKTtcblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHQvKipcblx0ICogUmVmcmVzaCB0aGUgY3VycmVudCB2aWV3IHVzaW5nIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gYXMgYmVmb3JlLlxuXHQgKiBUaGlzIGlzIHVzZWZ1bCBmb3Igb3VyIGRlbW9raXQgIVxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbXBvbmVudFxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgaW5kaWNhdGluZyB3aGVuIHRoZSB2aWV3IGlzIHJlZnJlc2hlZFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cmVmcmVzaFZpZXcob0NvbXBvbmVudDogYW55KSB7XG5cdFx0Y29uc3Qgb1Jvb3RWaWV3ID0gb0NvbXBvbmVudC5nZXRSb290Q29udHJvbCgpO1xuXHRcdGlmIChvUm9vdFZpZXcpIHtcblx0XHRcdG9Sb290Vmlldy5kZXN0cm95KCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLm9WaWV3KSB7XG5cdFx0XHR0aGlzLm9WaWV3LmRlc3Ryb3koKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuY3JlYXRlVmlldyh0aGlzLnJlc291cmNlTW9kZWwsIHRoaXMuc3RhYmxlSWQsIFwiXCIsIFwiXCIsIHVuZGVmaW5lZCwgdGhpcy5UZW1wbGF0ZUNvbnZlcnRlciwgdGhpcy5NZXRhTW9kZWxDb252ZXJ0ZXIpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG9Db21wb25lbnQub0NvbnRhaW5lci5pbnZhbGlkYXRlKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRvQ29tcG9uZW50Lm9Db250YWluZXIuaW52YWxpZGF0ZSgpO1xuXHRcdFx0XHRMb2cuZXJyb3Iob0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cdGFzeW5jIGNyZWF0ZVZpZXcoXG5cdFx0b1Jlc291cmNlTW9kZWw6IGFueSxcblx0XHRzU3RhYmxlSWQ6IGFueSxcblx0XHRzQ2FjaGVLZXk6IGFueSxcblx0XHRzUGFnZU1vZGVsQ2FjaGVLZXk6IHN0cmluZyB8IHVuZGVmaW5lZCxcblx0XHRvUGFnZU1vZGVsQ2FjaGU6IGFueSxcblx0XHRUZW1wbGF0ZUNvbnZlcnRlcjogYW55LFxuXHRcdE1ldGFNb2RlbENvbnZlcnRlcjogYW55XG5cdCk6IFByb21pc2U8YW55IHwgdm9pZD4ge1xuXHRcdHRoaXMucmVzb3VyY2VNb2RlbCA9IG9SZXNvdXJjZU1vZGVsO1xuXHRcdHRoaXMuc3RhYmxlSWQgPSBzU3RhYmxlSWQ7XG5cdFx0dGhpcy5UZW1wbGF0ZUNvbnZlcnRlciA9IFRlbXBsYXRlQ29udmVydGVyO1xuXHRcdHRoaXMuTWV0YU1vZGVsQ29udmVydGVyID0gTWV0YU1vZGVsQ29udmVydGVyO1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdFx0Y29uc3QgbVNlcnZpY2VTZXR0aW5ncyA9IG9Db250ZXh0LnNldHRpbmdzO1xuXHRcdGNvbnN0IHNDb252ZXJ0ZXJUeXBlID0gbVNlcnZpY2VTZXR0aW5ncy5jb252ZXJ0ZXJUeXBlO1xuXHRcdGNvbnN0IG9Db21wb25lbnQgPSBvQ29udGV4dC5zY29wZU9iamVjdDtcblx0XHRjb25zdCBvQXBwQ29tcG9uZW50OiBBcHBDb21wb25lbnQgPSBDb21wb25lbnQuZ2V0T3duZXJDb21wb25lbnRGb3Iob0NvbXBvbmVudCkgYXMgQXBwQ29tcG9uZW50O1xuXHRcdGNvbnN0IHNGdWxsQ29udGV4dFBhdGggPSBvQXBwQ29tcG9uZW50LmdldFJvdXRpbmdTZXJ2aWNlKCkuZ2V0VGFyZ2V0SW5mb3JtYXRpb25Gb3Iob0NvbXBvbmVudCkub3B0aW9ucy5zZXR0aW5ncy5mdWxsQ29udGV4dFBhdGg7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9BcHBDb21wb25lbnQuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0Y29uc3Qgb01hbmlmZXN0Q29udGVudDogTWFuaWZlc3RDb250ZW50ID0gb0FwcENvbXBvbmVudC5nZXRNYW5pZmVzdCgpO1xuXHRcdGNvbnN0IG9EZXZpY2VNb2RlbCA9IG5ldyBKU09OTW9kZWwoRGV2aWNlKS5zZXREZWZhdWx0QmluZGluZ01vZGUoXCJPbmVXYXlcIik7XG5cdFx0Y29uc3Qgb01hbmlmZXN0TW9kZWwgPSBuZXcgSlNPTk1vZGVsKG9NYW5pZmVzdENvbnRlbnQpO1xuXHRcdGNvbnN0IGJFcnJvciA9IGZhbHNlO1xuXHRcdGxldCBvUGFnZU1vZGVsOiBUZW1wbGF0ZU1vZGVsLCBvVmlld0RhdGFNb2RlbDogTW9kZWwsIG9WaWV3U2V0dGluZ3M6IGFueSwgbVZpZXdEYXRhOiBhbnk7XG5cdFx0Ly8gTG9hZCB0aGUgaW5kZXggZm9yIHRoZSBhZGRpdGlvbmFsIGJ1aWxkaW5nIGJsb2NrcyB3aGljaCBpcyByZXNwb25zaWJsZSBmb3IgaW5pdGlhbGl6aW5nIHRoZW1cblx0XHRmdW5jdGlvbiBnZXRWaWV3U2V0dGluZ3MoKSB7XG5cdFx0XHRjb25zdCBhU3BsaXRQYXRoID0gc0Z1bGxDb250ZXh0UGF0aC5zcGxpdChcIi9cIik7XG5cdFx0XHRjb25zdCBzRW50aXR5U2V0UGF0aCA9IGFTcGxpdFBhdGgucmVkdWNlKGZ1bmN0aW9uIChzUGF0aFNvRmFyOiBhbnksIHNOZXh0UGF0aFBhcnQ6IGFueSkge1xuXHRcdFx0XHRpZiAoc05leHRQYXRoUGFydCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdHJldHVybiBzUGF0aFNvRmFyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzUGF0aFNvRmFyID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0c1BhdGhTb0ZhciA9IGAvJHtzTmV4dFBhdGhQYXJ0fWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1RhcmdldCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXRoU29GYXJ9LyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLyR7c05leHRQYXRoUGFydH1gKTtcblx0XHRcdFx0XHRpZiAob1RhcmdldCAmJiBPYmplY3Qua2V5cyhvVGFyZ2V0KS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRzUGF0aFNvRmFyICs9IFwiLyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNQYXRoU29GYXIgKz0gYC8ke3NOZXh0UGF0aFBhcnR9YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc1BhdGhTb0Zhcjtcblx0XHRcdH0sIFwiXCIpO1xuXHRcdFx0bGV0IHZpZXdUeXBlID0gbVNlcnZpY2VTZXR0aW5ncy52aWV3VHlwZSB8fCBvQ29tcG9uZW50LmdldFZpZXdUeXBlKCkgfHwgXCJYTUxcIjtcblx0XHRcdGlmICh2aWV3VHlwZSAhPT0gXCJYTUxcIikge1xuXHRcdFx0XHR2aWV3VHlwZSA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IHZpZXdUeXBlLFxuXHRcdFx0XHRwcmVwcm9jZXNzb3JzOiB7XG5cdFx0XHRcdFx0eG1sOiB7XG5cdFx0XHRcdFx0XHRiaW5kaW5nQ29udGV4dHM6IHtcblx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0OiBzRW50aXR5U2V0UGF0aCA/IG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoc0VudGl0eVNldFBhdGgpIDogbnVsbCxcblx0XHRcdFx0XHRcdFx0ZnVsbENvbnRleHRQYXRoOiBzRnVsbENvbnRleHRQYXRoID8gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzRnVsbENvbnRleHRQYXRoKSA6IG51bGwsXG5cdFx0XHRcdFx0XHRcdGNvbnRleHRQYXRoOiBzRnVsbENvbnRleHRQYXRoID8gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzRnVsbENvbnRleHRQYXRoKSA6IG51bGwsXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQ6IG9QYWdlTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIsIHVuZGVmaW5lZCwgeyBub1Jlc29sdmU6IHRydWUgfSksXG5cdFx0XHRcdFx0XHRcdHZpZXdEYXRhOiBtVmlld0RhdGEgPyBvVmlld0RhdGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIikgOiBudWxsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bW9kZWxzOiB7XG5cdFx0XHRcdFx0XHRcdGVudGl0eVNldDogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRcdFx0ZnVsbENvbnRleHRQYXRoOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRjb250ZXh0UGF0aDogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRcdFx0XCJzYXAuZmUuaTE4blwiOiBvUmVzb3VyY2VNb2RlbCxcblx0XHRcdFx0XHRcdFx0bWV0YU1vZGVsOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcImRldmljZVwiOiBvRGV2aWNlTW9kZWwsXG5cdFx0XHRcdFx0XHRcdG1hbmlmZXN0OiBvTWFuaWZlc3RNb2RlbCxcblx0XHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dDogb1BhZ2VNb2RlbCxcblx0XHRcdFx0XHRcdFx0dmlld0RhdGE6IG9WaWV3RGF0YU1vZGVsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YXBwQ29tcG9uZW50OiBvQXBwQ29tcG9uZW50XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpZDogc1N0YWJsZUlkLFxuXHRcdFx0XHR2aWV3TmFtZTogbVNlcnZpY2VTZXR0aW5ncy52aWV3TmFtZSB8fCBvQ29tcG9uZW50LmdldFZpZXdOYW1lKCksXG5cdFx0XHRcdHZpZXdEYXRhOiBtVmlld0RhdGEsXG5cdFx0XHRcdGNhY2hlOiB7IGtleXM6IFtzQ2FjaGVLZXldIH0sXG5cdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFwic2FwLmZlLmkxOG5cIjogb1Jlc291cmNlTW9kZWxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVpZ2h0OiBcIjEwMCVcIlxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc3QgY3JlYXRlRXJyb3JQYWdlID0gKHJlYXNvbjogYW55KSA9PiB7XG5cdFx0XHQvLyBqdXN0IHJlcGxhY2UgdGhlIHZpZXcgbmFtZSBhbmQgYWRkIGFuIGFkZGl0aW9uYWwgbW9kZWwgY29udGFpbmluZyB0aGUgcmVhc29uLCBidXRcblx0XHRcdC8vIGtlZXAgdGhlIG90aGVyIHNldHRpbmdzXG5cdFx0XHRMb2cuZXJyb3IocmVhc29uLm1lc3NhZ2UsIHJlYXNvbik7XG5cdFx0XHRvVmlld1NldHRpbmdzLnZpZXdOYW1lID0gbVNlcnZpY2VTZXR0aW5ncy5lcnJvclZpZXdOYW1lIHx8IFwic2FwLmZlLmNvcmUuc2VydmljZXMudmlldy5UZW1wbGF0aW5nRXJyb3JQYWdlXCI7XG5cdFx0XHRvVmlld1NldHRpbmdzLnByZXByb2Nlc3NvcnMueG1sLm1vZGVsc1tcImVycm9yXCJdID0gbmV3IEpTT05Nb2RlbChyZWFzb24pO1xuXG5cdFx0XHRyZXR1cm4gb0NvbXBvbmVudC5ydW5Bc093bmVyKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIFZpZXcuY3JlYXRlKG9WaWV3U2V0dGluZ3MpLnRoZW4oKG9WaWV3OiBhbnkpID0+IHtcblx0XHRcdFx0XHR0aGlzLm9WaWV3ID0gb1ZpZXc7XG5cdFx0XHRcdFx0dGhpcy5vVmlldy5zZXRNb2RlbChuZXcgTWFuYWdlZE9iamVjdE1vZGVsKHRoaXMub1ZpZXcpLCBcIiR2aWV3XCIpO1xuXHRcdFx0XHRcdG9Db21wb25lbnQuc2V0QWdncmVnYXRpb24oXCJyb290Q29udHJvbFwiLCB0aGlzLm9WaWV3KTtcblx0XHRcdFx0XHRyZXR1cm4gc0NhY2hlS2V5O1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgb1JvdXRpbmdTZXJ2aWNlID0gYXdhaXQgb0FwcENvbXBvbmVudC5nZXRTZXJ2aWNlKFwicm91dGluZ1NlcnZpY2VcIik7XG5cdFx0XHQvLyBSZXRyaWV2ZSB0aGUgdmlld0xldmVsIGZvciB0aGUgY29tcG9uZW50XG5cdFx0XHRjb25zdCBvVGFyZ2V0SW5mbyA9IG9Sb3V0aW5nU2VydmljZS5nZXRUYXJnZXRJbmZvcm1hdGlvbkZvcihvQ29tcG9uZW50KTtcblx0XHRcdGNvbnN0IG1PdXRib3VuZHMgPVxuXHRcdFx0XHQob01hbmlmZXN0Q29udGVudFtcInNhcC5hcHBcIl0gJiZcblx0XHRcdFx0XHRvTWFuaWZlc3RDb250ZW50W1wic2FwLmFwcFwiXS5jcm9zc05hdmlnYXRpb24gJiZcblx0XHRcdFx0XHRvTWFuaWZlc3RDb250ZW50W1wic2FwLmFwcFwiXS5jcm9zc05hdmlnYXRpb24ub3V0Ym91bmRzKSB8fFxuXHRcdFx0XHR7fTtcblx0XHRcdGNvbnN0IG1OYXZpZ2F0aW9uID0gb0NvbXBvbmVudC5nZXROYXZpZ2F0aW9uKCkgfHwge307XG5cdFx0XHRPYmplY3Qua2V5cyhtTmF2aWdhdGlvbikuZm9yRWFjaChmdW5jdGlvbiAobmF2aWdhdGlvbk9iamVjdEtleTogc3RyaW5nKSB7XG5cdFx0XHRcdGNvbnN0IG5hdmlnYXRpb25PYmplY3QgPSBtTmF2aWdhdGlvbltuYXZpZ2F0aW9uT2JqZWN0S2V5XTtcblx0XHRcdFx0bGV0IG91dGJvdW5kQ29uZmlnO1xuXHRcdFx0XHRpZiAobmF2aWdhdGlvbk9iamVjdC5kZXRhaWwgJiYgbmF2aWdhdGlvbk9iamVjdC5kZXRhaWwub3V0Ym91bmQgJiYgbU91dGJvdW5kc1tuYXZpZ2F0aW9uT2JqZWN0LmRldGFpbC5vdXRib3VuZF0pIHtcblx0XHRcdFx0XHRvdXRib3VuZENvbmZpZyA9IG1PdXRib3VuZHNbbmF2aWdhdGlvbk9iamVjdC5kZXRhaWwub3V0Ym91bmRdO1xuXHRcdFx0XHRcdG5hdmlnYXRpb25PYmplY3QuZGV0YWlsLm91dGJvdW5kRGV0YWlsID0ge1xuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IG91dGJvdW5kQ29uZmlnLnNlbWFudGljT2JqZWN0LFxuXHRcdFx0XHRcdFx0YWN0aW9uOiBvdXRib3VuZENvbmZpZy5hY3Rpb24sXG5cdFx0XHRcdFx0XHRwYXJhbWV0ZXJzOiBvdXRib3VuZENvbmZpZy5wYXJhbWV0ZXJzXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmF2aWdhdGlvbk9iamVjdC5jcmVhdGUgJiYgbmF2aWdhdGlvbk9iamVjdC5jcmVhdGUub3V0Ym91bmQgJiYgbU91dGJvdW5kc1tuYXZpZ2F0aW9uT2JqZWN0LmNyZWF0ZS5vdXRib3VuZF0pIHtcblx0XHRcdFx0XHRvdXRib3VuZENvbmZpZyA9IG1PdXRib3VuZHNbbmF2aWdhdGlvbk9iamVjdC5jcmVhdGUub3V0Ym91bmRdO1xuXHRcdFx0XHRcdG5hdmlnYXRpb25PYmplY3QuY3JlYXRlLm91dGJvdW5kRGV0YWlsID0ge1xuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IG91dGJvdW5kQ29uZmlnLnNlbWFudGljT2JqZWN0LFxuXHRcdFx0XHRcdFx0YWN0aW9uOiBvdXRib3VuZENvbmZpZy5hY3Rpb24sXG5cdFx0XHRcdFx0XHRwYXJhbWV0ZXJzOiBvdXRib3VuZENvbmZpZy5wYXJhbWV0ZXJzXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRtVmlld0RhdGEgPSB7XG5cdFx0XHRcdG5hdmlnYXRpb246IG1OYXZpZ2F0aW9uLFxuXHRcdFx0XHR2aWV3TGV2ZWw6IG9UYXJnZXRJbmZvLnZpZXdMZXZlbCxcblx0XHRcdFx0c3RhYmxlSWQ6IHNTdGFibGVJZCxcblx0XHRcdFx0Y29udGVudERlbnNpdGllczogb01hbmlmZXN0Q29udGVudFtcInNhcC51aTVcIl0/LmNvbnRlbnREZW5zaXRpZXMsXG5cdFx0XHRcdHJlc291cmNlQnVuZGxlOiBvUmVzb3VyY2VNb2RlbC5fX2J1bmRsZSxcblx0XHRcdFx0ZnVsbENvbnRleHRQYXRoOiBzRnVsbENvbnRleHRQYXRoLFxuXHRcdFx0XHRpc0Rlc2t0b3A6IChEZXZpY2UgYXMgYW55KS5zeXN0ZW0uZGVza3RvcCxcblx0XHRcdFx0aXNQaG9uZTogKERldmljZSBhcyBhbnkpLnN5c3RlbS5waG9uZVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKG9Db21wb25lbnQuZ2V0Vmlld0RhdGEpIHtcblx0XHRcdFx0T2JqZWN0LmFzc2lnbihtVmlld0RhdGEsIG9Db21wb25lbnQuZ2V0Vmlld0RhdGEoKSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9TaGVsbFNlcnZpY2VzID0gb0FwcENvbXBvbmVudC5nZXRTaGVsbFNlcnZpY2VzKCk7XG5cdFx0XHRtVmlld0RhdGEuY29udmVydGVyVHlwZSA9IHNDb252ZXJ0ZXJUeXBlO1xuXHRcdFx0bVZpZXdEYXRhLnNoZWxsQ29udGVudERlbnNpdHkgPSBvU2hlbGxTZXJ2aWNlcy5nZXRDb250ZW50RGVuc2l0eSgpO1xuXHRcdFx0bVZpZXdEYXRhLnVzZU5ld0xhenlMb2FkaW5nID0gVXJpUGFyYW1ldGVycy5mcm9tUXVlcnkod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KFwic2FwLWZlLXh4LWxhenlsb2FkaW5ndGVzdFwiKSA9PT0gXCJ0cnVlXCI7XG5cdFx0XHRtVmlld0RhdGEucmV0cmlldmVUZXh0RnJvbVZhbHVlTGlzdCA9XG5cdFx0XHRcdG9NYW5pZmVzdENvbnRlbnRbXCJzYXAuZmVcIl0gJiYgb01hbmlmZXN0Q29udGVudFtcInNhcC5mZVwiXS5mb3JtXG5cdFx0XHRcdFx0PyBvTWFuaWZlc3RDb250ZW50W1wic2FwLmZlXCJdLmZvcm0ucmV0cmlldmVUZXh0RnJvbVZhbHVlTGlzdFxuXHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0b1ZpZXdEYXRhTW9kZWwgPSBuZXcgSlNPTk1vZGVsKG1WaWV3RGF0YSk7XG5cdFx0XHRpZiAobVZpZXdEYXRhICYmIG1WaWV3RGF0YS5jb250cm9sQ29uZmlndXJhdGlvbikge1xuXHRcdFx0XHRPYmplY3Qua2V5cyhtVmlld0RhdGEuY29udHJvbENvbmZpZ3VyYXRpb24pLmZvckVhY2goZnVuY3Rpb24gKHNBbm5vdGF0aW9uUGF0aDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0aWYgKHNBbm5vdGF0aW9uUGF0aC5pbmRleE9mKFwiW1wiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHNUYXJnZXRBbm5vdGF0aW9uUGF0aCA9IHJlc29sdmVEeW5hbWljRXhwcmVzc2lvbihzQW5ub3RhdGlvblBhdGgsIG9NZXRhTW9kZWwpO1xuXHRcdFx0XHRcdFx0bVZpZXdEYXRhLmNvbnRyb2xDb25maWd1cmF0aW9uW3NUYXJnZXRBbm5vdGF0aW9uUGF0aF0gPSBtVmlld0RhdGEuY29udHJvbENvbmZpZ3VyYXRpb25bc0Fubm90YXRpb25QYXRoXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0TWV0YU1vZGVsQ29udmVydGVyLmNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsLCBvQXBwQ29tcG9uZW50LmdldEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKCkuZ2V0Q2FwYWJpbGl0aWVzKCkpO1xuXHRcdFx0b1BhZ2VNb2RlbCA9IG5ldyBUZW1wbGF0ZU1vZGVsKCgpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAob1BhZ2VNb2RlbENhY2hlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb1BhZ2VNb2RlbENhY2hlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvRGlhZ25vc3RpY3MgPSBvQXBwQ29tcG9uZW50LmdldERpYWdub3N0aWNzKCk7XG5cdFx0XHRcdFx0XHRjb25zdCBpSXNzdWVDb3VudCA9IG9EaWFnbm9zdGljcy5nZXRJc3N1ZXMoKS5sZW5ndGg7XG5cdFx0XHRcdFx0XHRjb25zdCBvQ29udmVydGVyUGFnZU1vZGVsID0gVGVtcGxhdGVDb252ZXJ0ZXIuY29udmVydFBhZ2UoXG5cdFx0XHRcdFx0XHRcdHNDb252ZXJ0ZXJUeXBlLFxuXHRcdFx0XHRcdFx0XHRvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRtVmlld0RhdGEsXG5cdFx0XHRcdFx0XHRcdG9EaWFnbm9zdGljcyxcblx0XHRcdFx0XHRcdFx0c0Z1bGxDb250ZXh0UGF0aCxcblx0XHRcdFx0XHRcdFx0b0FwcENvbXBvbmVudC5nZXRFbnZpcm9ubWVudENhcGFiaWxpdGllcygpLmdldENhcGFiaWxpdGllcygpXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBhSXNzdWVzID0gb0RpYWdub3N0aWNzLmdldElzc3VlcygpO1xuXHRcdFx0XHRcdFx0Y29uc3QgYUFkZGVkSXNzdWVzID0gYUlzc3Vlcy5zbGljZShpSXNzdWVDb3VudCk7XG5cdFx0XHRcdFx0XHRpZiAoYUFkZGVkSXNzdWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0XHRcdFx0XCJTb21lIGlzc3VlcyBoYXZlIGJlZW4gZGV0ZWN0ZWQgaW4geW91ciBwcm9qZWN0LCBwbGVhc2UgY2hlY2sgdGhlIFVJNSBzdXBwb3J0IGFzc2lzdGFudCBydWxlIGZvciBzYXAuZmUuY29yZVwiXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gb0NvbnZlcnRlclBhZ2VNb2RlbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKGVycm9yIGFzIGFueSwgZXJyb3IgYXMgYW55KTtcblx0XHRcdFx0XHRyZXR1cm4ge307XG5cdFx0XHRcdH1cblx0XHRcdH0sIG9NZXRhTW9kZWwpO1xuXG5cdFx0XHRpZiAoIWJFcnJvcikge1xuXHRcdFx0XHRvVmlld1NldHRpbmdzID0gZ2V0Vmlld1NldHRpbmdzKCk7XG5cdFx0XHRcdC8vIFNldHRpbmcgdGhlIHBhZ2VNb2RlbCBvbiB0aGUgY29tcG9uZW50IGZvciBwb3RlbnRpYWwgcmV1c2Vcblx0XHRcdFx0b0NvbXBvbmVudC5zZXRNb2RlbChvUGFnZU1vZGVsLCBcIl9wYWdlTW9kZWxcIik7XG5cdFx0XHRcdHJldHVybiBvQ29tcG9uZW50LnJ1bkFzT3duZXIoKCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBWaWV3LmNyZWF0ZShvVmlld1NldHRpbmdzKVxuXHRcdFx0XHRcdFx0LmNhdGNoKGNyZWF0ZUVycm9yUGFnZSlcblx0XHRcdFx0XHRcdC50aGVuKChvVmlldzogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMub1ZpZXcgPSBvVmlldztcblx0XHRcdFx0XHRcdFx0dGhpcy5vVmlldy5zZXRNb2RlbChuZXcgTWFuYWdlZE9iamVjdE1vZGVsKHRoaXMub1ZpZXcpLCBcIiR2aWV3XCIpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLm9WaWV3LnNldE1vZGVsKG9WaWV3RGF0YU1vZGVsLCBcInZpZXdEYXRhXCIpO1xuXHRcdFx0XHRcdFx0XHRvQ29tcG9uZW50LnNldEFnZ3JlZ2F0aW9uKFwicm9vdENvbnRyb2xcIiwgdGhpcy5vVmlldyk7XG5cdFx0XHRcdFx0XHRcdC8vIEZpcmUgYW5kIGZvcmdldCBpbiB0aGUgY2FjaGVcblx0XHRcdFx0XHRcdFx0aWYgKCFvUGFnZU1vZGVsQ2FjaGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zZXRDYWNoZWRNb2RlbChzUGFnZU1vZGVsQ2FjaGVLZXksIChvUGFnZU1vZGVsIGFzIGFueSkuZ2V0RGF0YSgpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc0NhY2hlS2V5O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5jYXRjaCgoZSkgPT4gTG9nLmVycm9yKGUubWVzc2FnZSwgZSkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcjogYW55KSB7XG5cdFx0XHRMb2cuZXJyb3IoZXJyb3IubWVzc2FnZSwgZXJyb3IpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGlsZSBjcmVhdGluZyB2aWV3IDogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cblx0Z2V0VmlldygpIHtcblx0XHRyZXR1cm4gdGhpcy5vVmlldztcblx0fVxuXHRnZXRJbnRlcmZhY2UoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRleGl0KCkge1xuXHRcdC8vIERlcmVnaXN0ZXIgZ2xvYmFsIGluc3RhbmNlXG5cdFx0aWYgKHRoaXMub1Jlc291cmNlTW9kZWxTZXJ2aWNlKSB7XG5cdFx0XHR0aGlzLm9SZXNvdXJjZU1vZGVsU2VydmljZS5kZXN0cm95KCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLm9DYWNoZUhhbmRsZXJTZXJ2aWNlKSB7XG5cdFx0XHR0aGlzLm9DYWNoZUhhbmRsZXJTZXJ2aWNlLmRlc3Ryb3koKTtcblx0XHR9XG5cdFx0dGhpcy5vRmFjdG9yeS5yZW1vdmVHbG9iYWxJbnN0YW5jZSgpO1xuXHR9XG59XG5jbGFzcyBUZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxUZW1wbGF0ZWRWaWV3U2VydmljZVNldHRpbmdzPiB7XG5cdF9vSW5zdGFuY2VSZWdpc3RyeTogUmVjb3JkPHN0cmluZywgVGVtcGxhdGVkVmlld1NlcnZpY2U+ID0ge307XG5cdHN0YXRpYyBpQ3JlYXRpbmdWaWV3czogMDtcblx0Y3JlYXRlSW5zdGFuY2Uob1NlcnZpY2VDb250ZXh0OiBTZXJ2aWNlQ29udGV4dDxUZW1wbGF0ZWRWaWV3U2VydmljZVNldHRpbmdzPikge1xuXHRcdFRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeS5pQ3JlYXRpbmdWaWV3cysrO1xuXG5cdFx0Y29uc3Qgb1RlbXBsYXRlZFZpZXdTZXJ2aWNlID0gbmV3IFRlbXBsYXRlZFZpZXdTZXJ2aWNlKE9iamVjdC5hc3NpZ24oeyBmYWN0b3J5OiB0aGlzIH0sIG9TZXJ2aWNlQ29udGV4dCkpO1xuXHRcdHJldHVybiBvVGVtcGxhdGVkVmlld1NlcnZpY2UuaW5pdFByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRUZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnkuaUNyZWF0aW5nVmlld3MtLTtcblx0XHRcdHJldHVybiBvVGVtcGxhdGVkVmlld1NlcnZpY2U7XG5cdFx0fSk7XG5cdH1cblx0cmVtb3ZlR2xvYmFsSW5zdGFuY2UoKSB7XG5cdFx0dGhpcy5fb0luc3RhbmNlUmVnaXN0cnkgPSB7fTtcblx0fVxuXHRzdGF0aWMgZ2V0TnVtYmVyT2ZWaWV3c0luQ3JlYXRpb25TdGF0ZSgpIHtcblx0XHRyZXR1cm4gVGVtcGxhdGVkVmlld1NlcnZpY2VGYWN0b3J5LmlDcmVhdGluZ1ZpZXdzO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlZFZpZXdTZXJ2aWNlRmFjdG9yeTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFNRyxDQUFOLEVBQVM7TUFDVixPQUFPRixPQUFPLENBQUNFLENBQUQsQ0FBZDtJQUNBOztJQUNELElBQUlELE1BQU0sSUFBSUEsTUFBTSxDQUFDRSxJQUFyQixFQUEyQjtNQUMxQixPQUFPRixNQUFNLENBQUNFLElBQVAsQ0FBWSxLQUFLLENBQWpCLEVBQW9CSCxPQUFwQixDQUFQO0lBQ0E7O0lBQ0QsT0FBT0MsTUFBUDtFQUNBOzs7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