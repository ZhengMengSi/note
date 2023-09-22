/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/messageHandler/messageHandling", "sap/fe/core/controllerextensions/Placeholder", "sap/fe/core/helpers/AppStartupHelper", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/EditState", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/SemanticKeyHelper", "sap/ui/base/BindingParser", "sap/ui/base/EventProvider", "sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory", "sap/ui/model/odata/v4/ODataUtils"], function (Log, BusyLocker, messageHandling, Placeholder, AppStartupHelper, ClassSupport, EditState, ModelHelper, SemanticKeyHelper, BindingParser, EventProvider, Service, ServiceFactory, ODataUtils) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;

  var _exports = {};
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var RoutingServiceEventing = (_dec = defineUI5Class("sap.fe.core.services.RoutingServiceEventing"), _dec2 = event(), _dec3 = event(), _dec(_class = (_class2 = /*#__PURE__*/function (_EventProvider) {
    _inheritsLoose(RoutingServiceEventing, _EventProvider);

    function RoutingServiceEventing() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _EventProvider.call.apply(_EventProvider, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "routeMatched", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "afterRouteMatched", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    return RoutingServiceEventing;
  }(EventProvider), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "routeMatched", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "afterRouteMatched", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);

  var RoutingService = /*#__PURE__*/function (_Service) {
    _inheritsLoose(RoutingService, _Service);

    function RoutingService() {
      var _this2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this2 = _Service.call.apply(_Service, [this].concat(args)) || this;
      _this2.navigationInfoQueue = [];
      return _this2;
    }

    _exports.RoutingService = RoutingService;
    var _proto = RoutingService.prototype;

    _proto.init = function init() {
      var oContext = this.getContext();

      if (oContext.scopeType === "component") {
        this.oAppComponent = oContext.scopeObject;
        this.oModel = this.oAppComponent.getModel();
        this.oMetaModel = this.oModel.getMetaModel();
        this.oRouter = this.oAppComponent.getRouter();
        this.oRouterProxy = this.oAppComponent.getRouterProxy();
        this.eventProvider = new RoutingServiceEventing();
        var oRoutingConfig = this.oAppComponent.getManifestEntry("/sap.ui5/routing");
        var oRootViewConfig = this.oAppComponent.getManifestEntry("/sap.ui5/rootView");

        this._parseRoutingConfiguration(oRoutingConfig, oRootViewConfig);

        var oAppConfig = this.oAppComponent.getManifestEntry("/sap.app");
        this.outbounds = oAppConfig && oAppConfig.crossNavigation && oAppConfig.crossNavigation.outbounds;
      }

      this.initPromise = Promise.resolve(this);
    };

    _proto.beforeExit = function beforeExit() {
      this.oRouter.detachRouteMatched(this._fnOnRouteMatched, this);
      this.eventProvider.fireEvent("routeMatched", {});
    };

    _proto.exit = function exit() {
      this.eventProvider.destroy();
    }
    /**
     * Parse a manifest routing configuration for internal usage.
     *
     * @param oRoutingConfig The routing configuration from the manifest
     * @param oRootViewConfig The root view configuration from the manifest
     * @private
     */
    ;

    _proto._parseRoutingConfiguration = function _parseRoutingConfiguration(oRoutingConfig, oRootViewConfig) {
      var _this3 = this;

      var isFCL = (oRootViewConfig === null || oRootViewConfig === void 0 ? void 0 : oRootViewConfig.viewName) === "sap.fe.core.rootView.Fcl" || (oRootViewConfig === null || oRootViewConfig === void 0 ? void 0 : oRootViewConfig.viewName) === "sap.fe.templates.RootContainer.view.Fcl"; // Information of targets

      this._mTargets = {};
      Object.keys(oRoutingConfig.targets).forEach(function (sTargetName) {
        _this3._mTargets[sTargetName] = Object.assign({
          targetName: sTargetName
        }, oRoutingConfig.targets[sTargetName]); // View level for FCL cases is calculated from the target pattern

        if (_this3._mTargets[sTargetName].contextPattern !== undefined) {
          _this3._mTargets[sTargetName].viewLevel = _this3._getViewLevelFromPattern(_this3._mTargets[sTargetName].contextPattern, 0);
        }
      }); // Information of routes

      this._mRoutes = {};

      for (var sRouteKey in oRoutingConfig.routes) {
        var oRouteManifestInfo = oRoutingConfig.routes[sRouteKey],
            aRouteTargets = Array.isArray(oRouteManifestInfo.target) ? oRouteManifestInfo.target : [oRouteManifestInfo.target],
            sRouteName = Array.isArray(oRoutingConfig.routes) ? oRouteManifestInfo.name : sRouteKey,
            sRoutePattern = oRouteManifestInfo.pattern; // Check route pattern: all patterns need to end with ':?query:', that we use for parameters

        if (sRoutePattern.length < 8 || sRoutePattern.indexOf(":?query:") !== sRoutePattern.length - 8) {
          Log.warning("Pattern for route ".concat(sRouteName, " doesn't end with ':?query:' : ").concat(sRoutePattern));
        }

        var iRouteLevel = this._getViewLevelFromPattern(sRoutePattern, 0);

        this._mRoutes[sRouteName] = {
          name: sRouteName,
          pattern: sRoutePattern,
          targets: aRouteTargets,
          routeLevel: iRouteLevel
        }; // Add the parent targets in the list of targets for the route

        for (var i = 0; i < aRouteTargets.length; i++) {
          var sParentTargetName = this._mTargets[aRouteTargets[i]].parent;

          if (sParentTargetName) {
            aRouteTargets.push(sParentTargetName);
          }
        }

        if (!isFCL) {
          // View level for non-FCL cases is calculated from the route pattern
          if (this._mTargets[aRouteTargets[0]].viewLevel === undefined || this._mTargets[aRouteTargets[0]].viewLevel < iRouteLevel) {
            // There are cases when different routes point to the same target. We take the
            // largest viewLevel in that case.
            this._mTargets[aRouteTargets[0]].viewLevel = iRouteLevel;
          } // FCL level for non-FCL cases is equal to -1


          this._mTargets[aRouteTargets[0]].FCLLevel = -1;
        } else if (aRouteTargets.length === 1 && this._mTargets[aRouteTargets[0]].controlAggregation !== "beginColumnPages") {
          // We're in the case where there's only 1 target for the route, and it's not in the first column
          // --> this is a fullscreen column after all columns in the FCL have been used
          this._mTargets[aRouteTargets[0]].FCLLevel = 3;
        } else {
          // Other FCL cases
          aRouteTargets.forEach(function (sTargetName) {
            switch (_this3._mTargets[sTargetName].controlAggregation) {
              case "beginColumnPages":
                _this3._mTargets[sTargetName].FCLLevel = 0;
                break;

              case "midColumnPages":
                _this3._mTargets[sTargetName].FCLLevel = 1;
                break;

              default:
                _this3._mTargets[sTargetName].FCLLevel = 2;
            }
          });
        }
      } // Propagate viewLevel, contextPattern, FCLLevel and controlAggregation to parent targets


      Object.keys(this._mTargets).forEach(function (sTargetName) {
        while (_this3._mTargets[sTargetName].parent) {
          var _sParentTargetName = _this3._mTargets[sTargetName].parent;
          _this3._mTargets[_sParentTargetName].viewLevel = _this3._mTargets[_sParentTargetName].viewLevel || _this3._mTargets[sTargetName].viewLevel;
          _this3._mTargets[_sParentTargetName].contextPattern = _this3._mTargets[_sParentTargetName].contextPattern || _this3._mTargets[sTargetName].contextPattern;
          _this3._mTargets[_sParentTargetName].FCLLevel = _this3._mTargets[_sParentTargetName].FCLLevel || _this3._mTargets[sTargetName].FCLLevel;
          _this3._mTargets[_sParentTargetName].controlAggregation = _this3._mTargets[_sParentTargetName].controlAggregation || _this3._mTargets[sTargetName].controlAggregation;
          sTargetName = _sParentTargetName;
        }
      }); // Determine the root entity for the app

      var aLevel0RouteNames = [];
      var aLevel1RouteNames = [];
      var sDefaultRouteName;

      for (var sName in this._mRoutes) {
        var iLevel = this._mRoutes[sName].routeLevel;

        if (iLevel === 0) {
          aLevel0RouteNames.push(sName);
        } else if (iLevel === 1) {
          aLevel1RouteNames.push(sName);
        }
      }

      if (aLevel0RouteNames.length === 1) {
        sDefaultRouteName = aLevel0RouteNames[0];
      } else if (aLevel1RouteNames.length === 1) {
        sDefaultRouteName = aLevel1RouteNames[0];
      }

      if (sDefaultRouteName) {
        var sDefaultTargetName = this._mRoutes[sDefaultRouteName].targets.slice(-1)[0];

        this.sContextPath = "";

        if (this._mTargets[sDefaultTargetName].options && this._mTargets[sDefaultTargetName].options.settings) {
          var oSettings = this._mTargets[sDefaultTargetName].options.settings;
          this.sContextPath = oSettings.contextPath || "/".concat(oSettings.entitySet);
        }

        if (!this.sContextPath) {
          Log.warning("Cannot determine default contextPath: contextPath or entitySet missing in default target: ".concat(sDefaultTargetName));
        }
      } else {
        Log.warning("Cannot determine default contextPath: no default route found.");
      } // We need to establish the correct path to the different pages, including the navigation properties


      Object.keys(this._mTargets).map(function (sTargetKey) {
        return _this3._mTargets[sTargetKey];
      }).sort(function (a, b) {
        return a.viewLevel < b.viewLevel ? -1 : 1;
      }).forEach(function (target) {
        // After sorting the targets per level we can then go through their navigation object and update the paths accordingly.
        if (target.options) {
          var settings = target.options.settings;
          var sContextPath = settings.contextPath || (settings.entitySet ? "/".concat(settings.entitySet) : "");

          if (!settings.fullContextPath && sContextPath) {
            settings.fullContextPath = "".concat(sContextPath, "/");
          }

          Object.keys(settings.navigation || {}).forEach(function (sNavName) {
            // Check if it's a navigation property
            var targetRoute = _this3._mRoutes[settings.navigation[sNavName].detail.route];

            if (targetRoute && targetRoute.targets) {
              targetRoute.targets.forEach(function (sTargetName) {
                if (_this3._mTargets[sTargetName].options && _this3._mTargets[sTargetName].options.settings && !_this3._mTargets[sTargetName].options.settings.fullContextPath) {
                  if (target.viewLevel === 0) {
                    _this3._mTargets[sTargetName].options.settings.fullContextPath = "".concat((sNavName.startsWith("/") ? "" : "/") + sNavName, "/");
                  } else {
                    _this3._mTargets[sTargetName].options.settings.fullContextPath = "".concat(settings.fullContextPath + sNavName, "/");
                  }
                }
              });
            }
          });
        }
      });
    }
    /**
     * Calculates a view level from a pattern by counting the number of segments.
     *
     * @param sPattern The pattern
     * @param viewLevel The current level of view
     * @returns The level
     */
    ;

    _proto._getViewLevelFromPattern = function _getViewLevelFromPattern(sPattern, viewLevel) {
      sPattern = sPattern.replace(":?query:", "");
      var regex = new RegExp("/[^/]*$");

      if (sPattern && sPattern[0] !== "/" && sPattern[0] !== "?") {
        sPattern = "/".concat(sPattern);
      }

      if (sPattern.length) {
        sPattern = sPattern.replace(regex, "");

        if (this.oRouter.match(sPattern) || sPattern === "") {
          return this._getViewLevelFromPattern(sPattern, ++viewLevel);
        } else {
          return this._getViewLevelFromPattern(sPattern, viewLevel);
        }
      } else {
        return viewLevel;
      }
    };

    _proto._getRouteInformation = function _getRouteInformation(sRouteName) {
      return this._mRoutes[sRouteName];
    };

    _proto._getTargetInformation = function _getTargetInformation(sTargetName) {
      return this._mTargets[sTargetName];
    };

    _proto._getComponentId = function _getComponentId(sOwnerId, sComponentId) {
      if (sComponentId.indexOf("".concat(sOwnerId, "---")) === 0) {
        return sComponentId.substr(sOwnerId.length + 3);
      }

      return sComponentId;
    }
    /**
     * Get target information for a given component.
     *
     * @param oComponentInstance Instance of the component
     * @returns The configuration for the target
     */
    ;

    _proto.getTargetInformationFor = function getTargetInformationFor(oComponentInstance) {
      var _this4 = this;

      var sTargetComponentId = this._getComponentId(oComponentInstance._sOwnerId, oComponentInstance.getId());

      var sCorrectTargetName = null;
      Object.keys(this._mTargets).forEach(function (sTargetName) {
        if (_this4._mTargets[sTargetName].id === sTargetComponentId || _this4._mTargets[sTargetName].viewId === sTargetComponentId) {
          sCorrectTargetName = sTargetName;
        }
      });
      return this._getTargetInformation(sCorrectTargetName);
    };

    _proto.getLastSemanticMapping = function getLastSemanticMapping() {
      return this.oLastSemanticMapping;
    };

    _proto.setLastSemanticMapping = function setLastSemanticMapping(oMapping) {
      this.oLastSemanticMapping = oMapping;
    };

    _proto.navigateTo = function navigateTo(oContext, sRouteName, mParameterMapping, bPreserveHistory) {
      var _this5 = this;

      var sTargetURLPromise, bIsStickyMode;

      if (oContext.getModel() && oContext.getModel().getMetaModel && oContext.getModel().getMetaModel()) {
        bIsStickyMode = ModelHelper.isStickySessionSupported(oContext.getModel().getMetaModel());
      }

      if (!mParameterMapping) {
        // if there is no parameter mapping define this mean we rely entirely on the binding context path
        sTargetURLPromise = Promise.resolve(SemanticKeyHelper.getSemanticPath(oContext));
      } else {
        sTargetURLPromise = this.prepareParameters(mParameterMapping, sRouteName, oContext).then(function (mParameters) {
          return _this5.oRouter.getURL(sRouteName, mParameters);
        });
      }

      return sTargetURLPromise.then(function (sTargetURL) {
        _this5.oRouterProxy.navToHash(sTargetURL, bPreserveHistory, false, false, !bIsStickyMode);
      });
    }
    /**
     * Method to return a map of routing target parameters where the binding syntax is resolved to the current model.
     *
     * @param mParameters Parameters map in the format [k: string] : ComplexBindingSyntax
     * @param sTargetRoute Name of the target route
     * @param oContext The instance of the binding context
     * @returns A promise which resolves to the routing target parameters
     */
    ;

    _proto.prepareParameters = function prepareParameters(mParameters, sTargetRoute, oContext) {
      var _this6 = this;

      var oParametersPromise;

      try {
        var sContextPath = oContext.getPath();
        var oMetaModel = oContext.getModel().getMetaModel();
        var aContextPathParts = sContextPath.split("/");
        var aAllResolvedParameterPromises = Object.keys(mParameters).map(function (sParameterKey) {
          var sParameterMappingExpression = mParameters[sParameterKey]; // We assume the defined parameters will be compatible with a binding expression

          var oParsedExpression = BindingParser.complexParser(sParameterMappingExpression);
          var aParts = oParsedExpression.parts || [oParsedExpression];
          var aResolvedParameterPromises = aParts.map(function (oPathPart) {
            var aRelativeParts = oPathPart.path.split("../"); // We go up the current context path as many times as necessary

            var aLocalParts = aContextPathParts.slice(0, aContextPathParts.length - aRelativeParts.length + 1);
            aLocalParts.push(aRelativeParts[aRelativeParts.length - 1]);
            var sPropertyPath = aLocalParts.join("/");
            var oMetaContext = oMetaModel.getMetaContext(sPropertyPath);
            return oContext.requestProperty(sPropertyPath).then(function (oValue) {
              var oPropertyInfo = oMetaContext.getObject();
              var sEdmType = oPropertyInfo.$Type;
              return ODataUtils.formatLiteral(oValue, sEdmType);
            });
          });
          return Promise.all(aResolvedParameterPromises).then(function (aResolvedParameters) {
            var value = oParsedExpression.formatter ? oParsedExpression.formatter.apply(_this6, aResolvedParameters) : aResolvedParameters.join("");
            return {
              key: sParameterKey,
              value: value
            };
          });
        });
        oParametersPromise = Promise.all(aAllResolvedParameterPromises).then(function (aAllResolvedParameters) {
          var oParameters = {};
          aAllResolvedParameters.forEach(function (oResolvedParameter) {
            oParameters[oResolvedParameter.key] = oResolvedParameter.value;
          });
          return oParameters;
        });
      } catch (oError) {
        Log.error("Could not parse the parameters for the navigation to route ".concat(sTargetRoute));
        oParametersPromise = Promise.resolve(undefined);
      }

      return oParametersPromise;
    };

    _proto._fireRouteMatchEvents = function _fireRouteMatchEvents(mParameters) {
      this.eventProvider.fireEvent("routeMatched", mParameters);
      this.eventProvider.fireEvent("afterRouteMatched", mParameters);
      EditState.cleanProcessedEditState(); // Reset UI state when all bindings have been refreshed
    }
    /**
     * Navigates to a context.
     *
     * @param oContext The Context to be navigated to
     * @param [mParameters] Optional, map containing the following attributes:
     * @param [mParameters.checkNoHashChange] Navigate to the context without changing the URL
     * @param [mParameters.asyncContext] The context is created async, navigate to (...) and
     *                    wait for Promise to be resolved and then navigate into the context
     * @param [mParameters.bDeferredContext] The context shall be created deferred at the target page
     * @param [mParameters.editable] The target page shall be immediately in the edit mode to avoid flickering
     * @param [mParameters.bPersistOPScroll] The bPersistOPScroll will be used for scrolling to first tab
     * @param [mParameters.updateFCLLevel] `+1` if we add a column in FCL, `-1` to remove a column, 0 to stay on the same column
     * @param [mParameters.noPreservationCache] Do navigation without taking into account the preserved cache mechanism
     * @param [mParameters.bRecreateContext] Force re-creation of the context instead of using the one passed as parameter
     * @param [mParameters.bForceFocus] Forces focus selection after navigation
     * @param [oViewData] View data
     * @param [oCurrentTargetInfo] The target information from which the navigation is triggered
     * @returns Promise which is resolved once the navigation is triggered
     * @ui5-restricted
     * @final
     */
    ;

    _proto.navigateToContext = function navigateToContext(oContext, mParameters, oViewData, oCurrentTargetInfo) {
      var _this7 = this;

      var sTargetRoute = "",
          oRouteParametersPromise,
          bIsStickyMode = false;

      if (oContext.getModel() && oContext.getModel().getMetaModel) {
        bIsStickyMode = ModelHelper.isStickySessionSupported(oContext.getModel().getMetaModel());
      } // Manage parameter mapping


      if (mParameters && mParameters.targetPath && oViewData && oViewData.navigation) {
        var oRouteDetail = oViewData.navigation[mParameters.targetPath].detail;
        sTargetRoute = oRouteDetail.route;

        if (oRouteDetail.parameters) {
          oRouteParametersPromise = this.prepareParameters(oRouteDetail.parameters, sTargetRoute, oContext);
        }
      }

      var sTargetPath = this._getPathFromContext(oContext, mParameters); // If the path is empty, we're supposed to navigate to the first page of the app
      // Check if we need to exit from the app instead


      if (sTargetPath.length === 0 && this.bExitOnNavigateBackToRoot) {
        this.oRouterProxy.exitFromApp();
        return Promise.resolve(true);
      } // If the context is deferred or async, we add (...) to the path


      if (mParameters !== null && mParameters !== void 0 && mParameters.asyncContext || mParameters !== null && mParameters !== void 0 && mParameters.bDeferredContext) {
        sTargetPath += "(...)";
      } // Add layout parameter if needed


      var sLayout = this._calculateLayout(sTargetPath, mParameters);

      if (sLayout) {
        sTargetPath += "?layout=".concat(sLayout);
      } // Navigation parameters for later usage


      var oNavigationInfo = {
        oAsyncContext: mParameters === null || mParameters === void 0 ? void 0 : mParameters.asyncContext,
        bDeferredContext: mParameters === null || mParameters === void 0 ? void 0 : mParameters.bDeferredContext,
        bTargetEditable: mParameters === null || mParameters === void 0 ? void 0 : mParameters.editable,
        bPersistOPScroll: mParameters === null || mParameters === void 0 ? void 0 : mParameters.bPersistOPScroll,
        useContext: (mParameters === null || mParameters === void 0 ? void 0 : mParameters.updateFCLLevel) === -1 || mParameters !== null && mParameters !== void 0 && mParameters.bRecreateContext ? undefined : oContext,
        bDraftNavigation: mParameters === null || mParameters === void 0 ? void 0 : mParameters.bDraftNavigation,
        bShowPlaceholder: (mParameters === null || mParameters === void 0 ? void 0 : mParameters.showPlaceholder) !== undefined ? mParameters === null || mParameters === void 0 ? void 0 : mParameters.showPlaceholder : true
      };

      if (mParameters !== null && mParameters !== void 0 && mParameters.checkNoHashChange) {
        // Check if the new hash is different from the current one
        var sCurrentHashNoAppState = this.oRouterProxy.getHash().replace(/[&?]{1}sap-iapp-state=[A-Z0-9]+/, "");

        if (sTargetPath === sCurrentHashNoAppState) {
          // The hash doesn't change, but we fire the routeMatch event to trigger page refresh / binding
          var mEventParameters = this.oRouter.getRouteInfoByHash(this.oRouterProxy.getHash());

          if (mEventParameters) {
            mEventParameters.navigationInfo = oNavigationInfo;
            mEventParameters.routeInformation = this._getRouteInformation(this.sCurrentRouteName);
            mEventParameters.routePattern = this.sCurrentRoutePattern;
            mEventParameters.views = this.aCurrentViews;
          }

          this.oRouterProxy.setFocusForced(!!mParameters.bForceFocus);

          this._fireRouteMatchEvents(mEventParameters);

          return Promise.resolve(true);
        }
      }

      if (mParameters !== null && mParameters !== void 0 && mParameters.transient && mParameters.editable == true && sTargetPath.indexOf("(...)") === -1) {
        if (sTargetPath.indexOf("?") > -1) {
          sTargetPath += "&i-action=create";
        } else {
          sTargetPath += "?i-action=create";
        }
      } // Clear unbound messages upon navigating from LR to OP
      // This is to ensure stale error messages from LR are not shown to the user after navigation to OP.


      if (oCurrentTargetInfo && oCurrentTargetInfo.name === "sap.fe.templates.ListReport") {
        var oRouteInfo = this.oRouter.getRouteInfoByHash(sTargetPath);

        if (oRouteInfo) {
          var oRoute = this._getRouteInformation(oRouteInfo.name);

          if (oRoute && oRoute.targets && oRoute.targets.length > 0) {
            var sLastTargetName = oRoute.targets[oRoute.targets.length - 1];

            var oTarget = this._getTargetInformation(sLastTargetName);

            if (oTarget && oTarget.name === "sap.fe.templates.ObjectPage") {
              messageHandling.removeUnboundTransitionMessages();
            }
          }
        }
      } // Add the navigation parameters in the queue


      this.navigationInfoQueue.push(oNavigationInfo);

      if (sTargetRoute && oRouteParametersPromise) {
        return oRouteParametersPromise.then(function (oRouteParameters) {
          oRouteParameters.bIsStickyMode = bIsStickyMode;

          _this7.oRouter.navTo(sTargetRoute, oRouteParameters);

          return Promise.resolve(true);
        });
      }

      return this.oRouterProxy.navToHash(sTargetPath, false, mParameters === null || mParameters === void 0 ? void 0 : mParameters.noPreservationCache, mParameters === null || mParameters === void 0 ? void 0 : mParameters.bForceFocus, !bIsStickyMode).then(function (bNavigated) {
        if (!bNavigated) {
          // The navigation did not happen --> remove the navigation parameters from the queue as they shouldn't be used
          _this7.navigationInfoQueue.pop();
        }

        return bNavigated;
      });
    }
    /**
     * Navigates to a route.
     *
     * @function
     * @name sap.fe.core.controllerextensions.Routing#navigateToRoute
     * @memberof sap.fe.core.controllerextensions.Routing
     * @static
     * @param sTargetRouteName Name of the target route
     * @param [oRouteParameters] Parameters to be used with route to create the target hash
     * @returns Promise that is resolved when the navigation is finalized
     * @ui5-restricted
     * @final
     */
    ;

    _proto.navigateToRoute = function navigateToRoute(sTargetRouteName, oRouteParameters) {
      var sTargetURL = this.oRouter.getURL(sTargetRouteName, oRouteParameters);
      return this.oRouterProxy.navToHash(sTargetURL, undefined, undefined, undefined, !oRouteParameters.bIsStickyMode);
    }
    /**
     * Checks if one of the current views on the screen is bound to a given context.
     *
     * @param oContext The context
     * @returns `true` or `false` if the current state is impacted or not
     */
    ;

    _proto.isCurrentStateImpactedBy = function isCurrentStateImpactedBy(oContext) {
      var sPath = oContext.getPath(); // First, check with the technical path. We have to try it, because for level > 1, we
      // uses technical keys even if Semantic keys are enabled

      if (this.oRouterProxy.isCurrentStateImpactedBy(sPath)) {
        return true;
      } else if (/^[^\(\)]+\([^\(\)]+\)$/.test(sPath)) {
        // If the current path can be semantic (i.e. is like xxx(yyy))
        // check with the semantic path if we can find it
        var sSemanticPath;

        if (this.oLastSemanticMapping && this.oLastSemanticMapping.technicalPath === sPath) {
          // We have already resolved this semantic path
          sSemanticPath = this.oLastSemanticMapping.semanticPath;
        } else {
          sSemanticPath = SemanticKeyHelper.getSemanticPath(oContext);
        }

        return sSemanticPath != sPath ? this.oRouterProxy.isCurrentStateImpactedBy(sSemanticPath) : false;
      } else {
        return false;
      }
    };

    _proto._findPathToNavigate = function _findPathToNavigate(sPath) {
      var regex = new RegExp("/[^/]*$");
      sPath = sPath.replace(regex, "");

      if (this.oRouter.match(sPath) || sPath === "") {
        return sPath;
      } else {
        return this._findPathToNavigate(sPath);
      }
    };

    _proto._checkIfContextSupportsSemanticPath = function _checkIfContextSupportsSemanticPath(oContext) {
      var sPath = oContext.getPath(); // First, check if this is a level-1 object (path = /aaa(bbb))

      if (!/^\/[^\(]+\([^\)]+\)$/.test(sPath)) {
        return false;
      } // Then check if the entity has semantic keys


      var oMetaModel = oContext.getModel().getMetaModel();
      var sEntitySetName = oMetaModel.getMetaContext(oContext.getPath()).getObject("@sapui.name");

      if (!SemanticKeyHelper.getSemanticKeys(oMetaModel, sEntitySetName)) {
        return false;
      } // Then check the entity is draft-enabled


      return ModelHelper.isDraftSupported(oMetaModel, sPath);
    };

    _proto._getPathFromContext = function _getPathFromContext(oContext, mParameters) {
      var sPath;

      if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding") && oContext.isRelative()) {
        sPath = oContext.getHeaderContext().getPath();
      } else {
        sPath = oContext.getPath();
      }

      if (mParameters.updateFCLLevel === -1) {
        // When navigating back from a context, we need to remove the last component of the path
        sPath = this._findPathToNavigate(sPath); // Check if we're navigating back to a semantic path that was previously resolved

        if (this.oLastSemanticMapping && this.oLastSemanticMapping.technicalPath === sPath) {
          sPath = this.oLastSemanticMapping.semanticPath;
        }
      } else if (this._checkIfContextSupportsSemanticPath(oContext)) {
        // We check if we have to use a semantic path
        var sSemanticPath = SemanticKeyHelper.getSemanticPath(oContext, true);

        if (!sSemanticPath) {
          // We were not able to build the semantic path --> Use the technical path and
          // clear the previous mapping, otherwise the old mapping is used in EditFlow#updateDocument
          // and it leads to unwanted page reloads
          this.setLastSemanticMapping(undefined);
        } else if (sSemanticPath !== sPath) {
          // Store the mapping technical <-> semantic path to avoid recalculating it later
          // and use the semantic path instead of the technical one
          this.setLastSemanticMapping({
            technicalPath: sPath,
            semanticPath: sSemanticPath
          });
          sPath = sSemanticPath;
        }
      } // remove extra '/' at the beginning of path


      if (sPath[0] === "/") {
        sPath = sPath.substring(1);
      }

      return sPath;
    };

    _proto._calculateLayout = function _calculateLayout(sPath, mParameters) {
      var FCLLevel = mParameters.FCLLevel;

      if (mParameters.updateFCLLevel) {
        FCLLevel += mParameters.updateFCLLevel;

        if (FCLLevel < 0) {
          FCLLevel = 0;
        }
      }

      return this.oAppComponent.getRootViewController().calculateLayout(FCLLevel, sPath, mParameters.sLayout, mParameters.keepCurrentLayout);
    }
    /**
     * Event handler before a route is matched.
     * Displays a busy indicator.
     *
     */
    ;

    _proto._beforeRouteMatched = function
      /*oEvent: Event*/
    _beforeRouteMatched() {
      var bPlaceholderEnabled = new Placeholder().isPlaceholderEnabled();

      if (!bPlaceholderEnabled) {
        var oRootView = this.oAppComponent.getRootControl();
        BusyLocker.lock(oRootView);
      }
    }
    /**
     * Event handler when a route is matched.
     * Hides the busy indicator and fires its own 'routematched' event.
     *
     * @param oEvent The event
     */
    ;

    _proto._onRouteMatched = function _onRouteMatched(oEvent) {
      var _this8 = this;

      var oAppStateHandler = this.oAppComponent.getAppStateHandler(),
          oRootView = this.oAppComponent.getRootControl();
      var bPlaceholderEnabled = new Placeholder().isPlaceholderEnabled();

      if (BusyLocker.isLocked(oRootView) && !bPlaceholderEnabled) {
        BusyLocker.unlock(oRootView);
      }

      var mParameters = oEvent.getParameters();

      if (this.navigationInfoQueue.length) {
        mParameters.navigationInfo = this.navigationInfoQueue[0];
        this.navigationInfoQueue = this.navigationInfoQueue.slice(1);
      } else {
        mParameters.navigationInfo = {};
      }

      if (oAppStateHandler.checkIfRouteChangedByIApp()) {
        mParameters.navigationInfo.bReasonIsIappState = true;
        oAppStateHandler.resetRouteChangedByIApp();
      }

      this.sCurrentRouteName = oEvent.getParameter("name");
      this.sCurrentRoutePattern = mParameters.config.pattern;
      this.aCurrentViews = oEvent.getParameter("views");
      mParameters.routeInformation = this._getRouteInformation(this.sCurrentRouteName);
      mParameters.routePattern = this.sCurrentRoutePattern;

      this._fireRouteMatchEvents(mParameters); // Check if current hash has been set by the routerProxy.navToHash function
      // If not, rebuild history properly (both in the browser and the RouterProxy)


      if (!history.state || history.state.feLevel === undefined) {
        this.oRouterProxy.restoreHistory().then(function () {
          _this8.oRouterProxy.resolveRouteMatch();
        }).catch(function (oError) {
          Log.error("Error while restoring history", oError);
        });
      } else {
        this.oRouterProxy.resolveRouteMatch();
      }
    };

    _proto.attachRouteMatched = function attachRouteMatched(oData, fnFunction, oListener) {
      this.eventProvider.attachEvent("routeMatched", oData, fnFunction, oListener);
    };

    _proto.detachRouteMatched = function detachRouteMatched(fnFunction, oListener) {
      this.eventProvider.detachEvent("routeMatched", fnFunction, oListener);
    };

    _proto.attachAfterRouteMatched = function attachAfterRouteMatched(oData, fnFunction, oListener) {
      this.eventProvider.attachEvent("afterRouteMatched", oData, fnFunction, oListener);
    };

    _proto.detachAfterRouteMatched = function detachAfterRouteMatched(fnFunction, oListener) {
      this.eventProvider.detachEvent("afterRouteMatched", fnFunction, oListener);
    };

    _proto.getRouteFromHash = function getRouteFromHash(oRouter, oAppComponent) {
      var sHash = oRouter.getHashChanger().hash;
      var oRouteInfo = oRouter.getRouteInfoByHash(sHash);
      return oAppComponent.getMetadata().getManifestEntry("/sap.ui5/routing/routes").filter(function (oRoute) {
        return oRoute.name === oRouteInfo.name;
      })[0];
    };

    _proto.getTargetsFromRoute = function getTargetsFromRoute(oRoute) {
      var _this9 = this;

      var oTarget = oRoute.target;

      if (typeof oTarget === "string") {
        return [this._mTargets[oTarget]];
      } else {
        var aTarget = [];
        oTarget.forEach(function (sTarget) {
          aTarget.push(_this9._mTargets[sTarget]);
        });
        return aTarget;
      }
    };

    _proto.initializeRouting = function initializeRouting() {
      var _this10 = this;

      // Attach router handlers
      this._fnOnRouteMatched = this._onRouteMatched.bind(this);
      this.oRouter.attachRouteMatched(this._fnOnRouteMatched, this);
      var bPlaceholderEnabled = new Placeholder().isPlaceholderEnabled();

      if (!bPlaceholderEnabled) {
        this.oRouter.attachBeforeRouteMatched(this._beforeRouteMatched.bind(this));
      } // Reset internal state


      this.navigationInfoQueue = [];
      EditState.resetEditState();
      this.bExitOnNavigateBackToRoot = !this.oRouter.match("");
      var bIsIappState = this.oRouter.getHashChanger().getHash().indexOf("sap-iapp-state") !== -1;
      return this.oAppComponent.getStartupParameters().then(function (oStartupParameters) {
        var bHasStartUpParameters = oStartupParameters !== undefined && Object.keys(oStartupParameters).length !== 0;

        var sHash = _this10.oRouter.getHashChanger().getHash(); // Manage startup parameters (in case of no iapp-state)


        if (!bIsIappState && bHasStartUpParameters && !sHash) {
          if (oStartupParameters.preferredMode && oStartupParameters.preferredMode[0].toUpperCase().indexOf("CREATE") !== -1) {
            // Create mode
            // This check will catch multiple modes like create, createWith and autoCreateWith which all need
            // to be handled like create startup!
            return _this10._manageCreateStartup(oStartupParameters);
          } else {
            // Deep link
            return _this10._manageDeepLinkStartup(oStartupParameters);
          }
        }
      }).catch(function (oError) {
        Log.error("Error during routing initialization", oError);
      });
    };

    _proto.getDefaultCreateHash = function getDefaultCreateHash(oStartupParameters) {
      return AppStartupHelper.getDefaultCreateHash(oStartupParameters, this.getContextPath(), this.oRouter);
    };

    _proto._manageCreateStartup = function _manageCreateStartup(oStartupParameters) {
      var _this11 = this;

      return AppStartupHelper.getCreateStartupHash(oStartupParameters, this.getContextPath(), this.oRouter, this.oMetaModel).then(function (sNewHash) {
        if (sNewHash) {
          _this11.oRouter.getHashChanger().replaceHash(sNewHash);

          if (oStartupParameters !== null && oStartupParameters !== void 0 && oStartupParameters.preferredMode && oStartupParameters.preferredMode[0].toUpperCase().indexOf("AUTOCREATE") !== -1) {
            _this11.oAppComponent.setStartupModeAutoCreate();
          } else {
            _this11.oAppComponent.setStartupModeCreate();
          }

          _this11.bExitOnNavigateBackToRoot = true;
        }
      });
    };

    _proto._manageDeepLinkStartup = function _manageDeepLinkStartup(oStartupParameters) {
      var _this12 = this;

      return AppStartupHelper.getDeepLinkStartupHash(this.oAppComponent.getManifest()["sap.ui5"].routing, oStartupParameters, this.oModel).then(function (oDeepLink) {
        var sHash;

        if (oDeepLink.context) {
          var sTechnicalPath = oDeepLink.context.getPath();
          var sSemanticPath = _this12._checkIfContextSupportsSemanticPath(oDeepLink.context) ? SemanticKeyHelper.getSemanticPath(oDeepLink.context) : sTechnicalPath;

          if (sSemanticPath !== sTechnicalPath) {
            // Store the mapping technical <-> semantic path to avoid recalculating it later
            // and use the semantic path instead of the technical one
            _this12.setLastSemanticMapping({
              technicalPath: sTechnicalPath,
              semanticPath: sSemanticPath
            });
          }

          sHash = sSemanticPath.substring(1); // To remove the leading '/'
        } else if (oDeepLink.hash) {
          sHash = oDeepLink.hash;
        }

        if (sHash) {
          //Replace the hash with newly created hash
          _this12.oRouter.getHashChanger().replaceHash(sHash);

          _this12.oAppComponent.setStartupModeDeeplink();
        }
      });
    };

    _proto.getOutbounds = function getOutbounds() {
      return this.outbounds;
    }
    /**
     * Gets the name of the Draft root entity set or the sticky-enabled entity set.
     *
     * @returns The name of the root EntitySet
     * @ui5-restricted
     */
    ;

    _proto.getContextPath = function getContextPath() {
      return this.sContextPath;
    };

    _proto.getInterface = function getInterface() {
      return this;
    };

    return RoutingService;
  }(Service);

  _exports.RoutingService = RoutingService;

  var RoutingServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inheritsLoose(RoutingServiceFactory, _ServiceFactory);

    function RoutingServiceFactory() {
      return _ServiceFactory.apply(this, arguments) || this;
    }

    var _proto2 = RoutingServiceFactory.prototype;

    _proto2.createInstance = function createInstance(oServiceContext) {
      var oRoutingService = new RoutingService(oServiceContext);
      return oRoutingService.initPromise;
    };

    return RoutingServiceFactory;
  }(ServiceFactory);

  return RoutingServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSb3V0aW5nU2VydmljZUV2ZW50aW5nIiwiZGVmaW5lVUk1Q2xhc3MiLCJldmVudCIsIkV2ZW50UHJvdmlkZXIiLCJSb3V0aW5nU2VydmljZSIsIm5hdmlnYXRpb25JbmZvUXVldWUiLCJpbml0Iiwib0NvbnRleHQiLCJnZXRDb250ZXh0Iiwic2NvcGVUeXBlIiwib0FwcENvbXBvbmVudCIsInNjb3BlT2JqZWN0Iiwib01vZGVsIiwiZ2V0TW9kZWwiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwib1JvdXRlciIsImdldFJvdXRlciIsIm9Sb3V0ZXJQcm94eSIsImdldFJvdXRlclByb3h5IiwiZXZlbnRQcm92aWRlciIsIm9Sb3V0aW5nQ29uZmlnIiwiZ2V0TWFuaWZlc3RFbnRyeSIsIm9Sb290Vmlld0NvbmZpZyIsIl9wYXJzZVJvdXRpbmdDb25maWd1cmF0aW9uIiwib0FwcENvbmZpZyIsIm91dGJvdW5kcyIsImNyb3NzTmF2aWdhdGlvbiIsImluaXRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJiZWZvcmVFeGl0IiwiZGV0YWNoUm91dGVNYXRjaGVkIiwiX2ZuT25Sb3V0ZU1hdGNoZWQiLCJmaXJlRXZlbnQiLCJleGl0IiwiZGVzdHJveSIsImlzRkNMIiwidmlld05hbWUiLCJfbVRhcmdldHMiLCJPYmplY3QiLCJrZXlzIiwidGFyZ2V0cyIsImZvckVhY2giLCJzVGFyZ2V0TmFtZSIsImFzc2lnbiIsInRhcmdldE5hbWUiLCJjb250ZXh0UGF0dGVybiIsInVuZGVmaW5lZCIsInZpZXdMZXZlbCIsIl9nZXRWaWV3TGV2ZWxGcm9tUGF0dGVybiIsIl9tUm91dGVzIiwic1JvdXRlS2V5Iiwicm91dGVzIiwib1JvdXRlTWFuaWZlc3RJbmZvIiwiYVJvdXRlVGFyZ2V0cyIsIkFycmF5IiwiaXNBcnJheSIsInRhcmdldCIsInNSb3V0ZU5hbWUiLCJuYW1lIiwic1JvdXRlUGF0dGVybiIsInBhdHRlcm4iLCJsZW5ndGgiLCJpbmRleE9mIiwiTG9nIiwid2FybmluZyIsImlSb3V0ZUxldmVsIiwicm91dGVMZXZlbCIsImkiLCJzUGFyZW50VGFyZ2V0TmFtZSIsInBhcmVudCIsInB1c2giLCJGQ0xMZXZlbCIsImNvbnRyb2xBZ2dyZWdhdGlvbiIsImFMZXZlbDBSb3V0ZU5hbWVzIiwiYUxldmVsMVJvdXRlTmFtZXMiLCJzRGVmYXVsdFJvdXRlTmFtZSIsInNOYW1lIiwiaUxldmVsIiwic0RlZmF1bHRUYXJnZXROYW1lIiwic2xpY2UiLCJzQ29udGV4dFBhdGgiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJvU2V0dGluZ3MiLCJjb250ZXh0UGF0aCIsImVudGl0eVNldCIsIm1hcCIsInNUYXJnZXRLZXkiLCJzb3J0IiwiYSIsImIiLCJmdWxsQ29udGV4dFBhdGgiLCJuYXZpZ2F0aW9uIiwic05hdk5hbWUiLCJ0YXJnZXRSb3V0ZSIsImRldGFpbCIsInJvdXRlIiwic3RhcnRzV2l0aCIsInNQYXR0ZXJuIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwibWF0Y2giLCJfZ2V0Um91dGVJbmZvcm1hdGlvbiIsIl9nZXRUYXJnZXRJbmZvcm1hdGlvbiIsIl9nZXRDb21wb25lbnRJZCIsInNPd25lcklkIiwic0NvbXBvbmVudElkIiwic3Vic3RyIiwiZ2V0VGFyZ2V0SW5mb3JtYXRpb25Gb3IiLCJvQ29tcG9uZW50SW5zdGFuY2UiLCJzVGFyZ2V0Q29tcG9uZW50SWQiLCJfc093bmVySWQiLCJnZXRJZCIsInNDb3JyZWN0VGFyZ2V0TmFtZSIsImlkIiwidmlld0lkIiwiZ2V0TGFzdFNlbWFudGljTWFwcGluZyIsIm9MYXN0U2VtYW50aWNNYXBwaW5nIiwic2V0TGFzdFNlbWFudGljTWFwcGluZyIsIm9NYXBwaW5nIiwibmF2aWdhdGVUbyIsIm1QYXJhbWV0ZXJNYXBwaW5nIiwiYlByZXNlcnZlSGlzdG9yeSIsInNUYXJnZXRVUkxQcm9taXNlIiwiYklzU3RpY2t5TW9kZSIsIk1vZGVsSGVscGVyIiwiaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwiU2VtYW50aWNLZXlIZWxwZXIiLCJnZXRTZW1hbnRpY1BhdGgiLCJwcmVwYXJlUGFyYW1ldGVycyIsInRoZW4iLCJtUGFyYW1ldGVycyIsImdldFVSTCIsInNUYXJnZXRVUkwiLCJuYXZUb0hhc2giLCJzVGFyZ2V0Um91dGUiLCJvUGFyYW1ldGVyc1Byb21pc2UiLCJnZXRQYXRoIiwiYUNvbnRleHRQYXRoUGFydHMiLCJzcGxpdCIsImFBbGxSZXNvbHZlZFBhcmFtZXRlclByb21pc2VzIiwic1BhcmFtZXRlcktleSIsInNQYXJhbWV0ZXJNYXBwaW5nRXhwcmVzc2lvbiIsIm9QYXJzZWRFeHByZXNzaW9uIiwiQmluZGluZ1BhcnNlciIsImNvbXBsZXhQYXJzZXIiLCJhUGFydHMiLCJwYXJ0cyIsImFSZXNvbHZlZFBhcmFtZXRlclByb21pc2VzIiwib1BhdGhQYXJ0IiwiYVJlbGF0aXZlUGFydHMiLCJwYXRoIiwiYUxvY2FsUGFydHMiLCJzUHJvcGVydHlQYXRoIiwiam9pbiIsIm9NZXRhQ29udGV4dCIsImdldE1ldGFDb250ZXh0IiwicmVxdWVzdFByb3BlcnR5Iiwib1ZhbHVlIiwib1Byb3BlcnR5SW5mbyIsImdldE9iamVjdCIsInNFZG1UeXBlIiwiJFR5cGUiLCJPRGF0YVV0aWxzIiwiZm9ybWF0TGl0ZXJhbCIsImFsbCIsImFSZXNvbHZlZFBhcmFtZXRlcnMiLCJ2YWx1ZSIsImZvcm1hdHRlciIsImFwcGx5Iiwia2V5IiwiYUFsbFJlc29sdmVkUGFyYW1ldGVycyIsIm9QYXJhbWV0ZXJzIiwib1Jlc29sdmVkUGFyYW1ldGVyIiwib0Vycm9yIiwiZXJyb3IiLCJfZmlyZVJvdXRlTWF0Y2hFdmVudHMiLCJFZGl0U3RhdGUiLCJjbGVhblByb2Nlc3NlZEVkaXRTdGF0ZSIsIm5hdmlnYXRlVG9Db250ZXh0Iiwib1ZpZXdEYXRhIiwib0N1cnJlbnRUYXJnZXRJbmZvIiwib1JvdXRlUGFyYW1ldGVyc1Byb21pc2UiLCJ0YXJnZXRQYXRoIiwib1JvdXRlRGV0YWlsIiwicGFyYW1ldGVycyIsInNUYXJnZXRQYXRoIiwiX2dldFBhdGhGcm9tQ29udGV4dCIsImJFeGl0T25OYXZpZ2F0ZUJhY2tUb1Jvb3QiLCJleGl0RnJvbUFwcCIsImFzeW5jQ29udGV4dCIsImJEZWZlcnJlZENvbnRleHQiLCJzTGF5b3V0IiwiX2NhbGN1bGF0ZUxheW91dCIsIm9OYXZpZ2F0aW9uSW5mbyIsIm9Bc3luY0NvbnRleHQiLCJiVGFyZ2V0RWRpdGFibGUiLCJlZGl0YWJsZSIsImJQZXJzaXN0T1BTY3JvbGwiLCJ1c2VDb250ZXh0IiwidXBkYXRlRkNMTGV2ZWwiLCJiUmVjcmVhdGVDb250ZXh0IiwiYkRyYWZ0TmF2aWdhdGlvbiIsImJTaG93UGxhY2Vob2xkZXIiLCJzaG93UGxhY2Vob2xkZXIiLCJjaGVja05vSGFzaENoYW5nZSIsInNDdXJyZW50SGFzaE5vQXBwU3RhdGUiLCJnZXRIYXNoIiwibUV2ZW50UGFyYW1ldGVycyIsImdldFJvdXRlSW5mb0J5SGFzaCIsIm5hdmlnYXRpb25JbmZvIiwicm91dGVJbmZvcm1hdGlvbiIsInNDdXJyZW50Um91dGVOYW1lIiwicm91dGVQYXR0ZXJuIiwic0N1cnJlbnRSb3V0ZVBhdHRlcm4iLCJ2aWV3cyIsImFDdXJyZW50Vmlld3MiLCJzZXRGb2N1c0ZvcmNlZCIsImJGb3JjZUZvY3VzIiwidHJhbnNpZW50Iiwib1JvdXRlSW5mbyIsIm9Sb3V0ZSIsInNMYXN0VGFyZ2V0TmFtZSIsIm9UYXJnZXQiLCJtZXNzYWdlSGFuZGxpbmciLCJyZW1vdmVVbmJvdW5kVHJhbnNpdGlvbk1lc3NhZ2VzIiwib1JvdXRlUGFyYW1ldGVycyIsIm5hdlRvIiwibm9QcmVzZXJ2YXRpb25DYWNoZSIsImJOYXZpZ2F0ZWQiLCJwb3AiLCJuYXZpZ2F0ZVRvUm91dGUiLCJzVGFyZ2V0Um91dGVOYW1lIiwiaXNDdXJyZW50U3RhdGVJbXBhY3RlZEJ5Iiwic1BhdGgiLCJ0ZXN0Iiwic1NlbWFudGljUGF0aCIsInRlY2huaWNhbFBhdGgiLCJzZW1hbnRpY1BhdGgiLCJfZmluZFBhdGhUb05hdmlnYXRlIiwiX2NoZWNrSWZDb250ZXh0U3VwcG9ydHNTZW1hbnRpY1BhdGgiLCJzRW50aXR5U2V0TmFtZSIsImdldFNlbWFudGljS2V5cyIsImlzRHJhZnRTdXBwb3J0ZWQiLCJpc0EiLCJpc1JlbGF0aXZlIiwiZ2V0SGVhZGVyQ29udGV4dCIsInN1YnN0cmluZyIsImdldFJvb3RWaWV3Q29udHJvbGxlciIsImNhbGN1bGF0ZUxheW91dCIsImtlZXBDdXJyZW50TGF5b3V0IiwiX2JlZm9yZVJvdXRlTWF0Y2hlZCIsImJQbGFjZWhvbGRlckVuYWJsZWQiLCJQbGFjZWhvbGRlciIsImlzUGxhY2Vob2xkZXJFbmFibGVkIiwib1Jvb3RWaWV3IiwiZ2V0Um9vdENvbnRyb2wiLCJCdXN5TG9ja2VyIiwibG9jayIsIl9vblJvdXRlTWF0Y2hlZCIsIm9FdmVudCIsIm9BcHBTdGF0ZUhhbmRsZXIiLCJnZXRBcHBTdGF0ZUhhbmRsZXIiLCJpc0xvY2tlZCIsInVubG9jayIsImdldFBhcmFtZXRlcnMiLCJjaGVja0lmUm91dGVDaGFuZ2VkQnlJQXBwIiwiYlJlYXNvbklzSWFwcFN0YXRlIiwicmVzZXRSb3V0ZUNoYW5nZWRCeUlBcHAiLCJnZXRQYXJhbWV0ZXIiLCJjb25maWciLCJoaXN0b3J5Iiwic3RhdGUiLCJmZUxldmVsIiwicmVzdG9yZUhpc3RvcnkiLCJyZXNvbHZlUm91dGVNYXRjaCIsImNhdGNoIiwiYXR0YWNoUm91dGVNYXRjaGVkIiwib0RhdGEiLCJmbkZ1bmN0aW9uIiwib0xpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJkZXRhY2hFdmVudCIsImF0dGFjaEFmdGVyUm91dGVNYXRjaGVkIiwiZGV0YWNoQWZ0ZXJSb3V0ZU1hdGNoZWQiLCJnZXRSb3V0ZUZyb21IYXNoIiwic0hhc2giLCJnZXRIYXNoQ2hhbmdlciIsImhhc2giLCJnZXRNZXRhZGF0YSIsImZpbHRlciIsImdldFRhcmdldHNGcm9tUm91dGUiLCJhVGFyZ2V0Iiwic1RhcmdldCIsImluaXRpYWxpemVSb3V0aW5nIiwiYmluZCIsImF0dGFjaEJlZm9yZVJvdXRlTWF0Y2hlZCIsInJlc2V0RWRpdFN0YXRlIiwiYklzSWFwcFN0YXRlIiwiZ2V0U3RhcnR1cFBhcmFtZXRlcnMiLCJvU3RhcnR1cFBhcmFtZXRlcnMiLCJiSGFzU3RhcnRVcFBhcmFtZXRlcnMiLCJwcmVmZXJyZWRNb2RlIiwidG9VcHBlckNhc2UiLCJfbWFuYWdlQ3JlYXRlU3RhcnR1cCIsIl9tYW5hZ2VEZWVwTGlua1N0YXJ0dXAiLCJnZXREZWZhdWx0Q3JlYXRlSGFzaCIsIkFwcFN0YXJ0dXBIZWxwZXIiLCJnZXRDb250ZXh0UGF0aCIsImdldENyZWF0ZVN0YXJ0dXBIYXNoIiwic05ld0hhc2giLCJyZXBsYWNlSGFzaCIsInNldFN0YXJ0dXBNb2RlQXV0b0NyZWF0ZSIsInNldFN0YXJ0dXBNb2RlQ3JlYXRlIiwiZ2V0RGVlcExpbmtTdGFydHVwSGFzaCIsImdldE1hbmlmZXN0Iiwicm91dGluZyIsIm9EZWVwTGluayIsImNvbnRleHQiLCJzVGVjaG5pY2FsUGF0aCIsInNldFN0YXJ0dXBNb2RlRGVlcGxpbmsiLCJnZXRPdXRib3VuZHMiLCJnZXRJbnRlcmZhY2UiLCJTZXJ2aWNlIiwiUm91dGluZ1NlcnZpY2VGYWN0b3J5IiwiY3JlYXRlSW5zdGFuY2UiLCJvU2VydmljZUNvbnRleHQiLCJvUm91dGluZ1NlcnZpY2UiLCJTZXJ2aWNlRmFjdG9yeSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiUm91dGluZ1NlcnZpY2VGYWN0b3J5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgQXBwQ29tcG9uZW50IGZyb20gXCJzYXAvZmUvY29yZS9BcHBDb21wb25lbnRcIjtcbmltcG9ydCBCdXN5TG9ja2VyIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9CdXN5TG9ja2VyXCI7XG5pbXBvcnQgbWVzc2FnZUhhbmRsaW5nIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9tZXNzYWdlSGFuZGxlci9tZXNzYWdlSGFuZGxpbmdcIjtcbmltcG9ydCBQbGFjZWhvbGRlciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvUGxhY2Vob2xkZXJcIjtcbmltcG9ydCB0eXBlIFJvdXRlclByb3h5IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9yb3V0aW5nL1JvdXRlclByb3h5XCI7XG5pbXBvcnQgQXBwU3RhcnR1cEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9BcHBTdGFydHVwSGVscGVyXCI7XG5pbXBvcnQgeyBkZWZpbmVVSTVDbGFzcywgZXZlbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBFZGl0U3RhdGUgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvRWRpdFN0YXRlXCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCBTZW1hbnRpY0tleUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TZW1hbnRpY0tleUhlbHBlclwiO1xuaW1wb3J0IEJpbmRpbmdQYXJzZXIgZnJvbSBcInNhcC91aS9iYXNlL0JpbmRpbmdQYXJzZXJcIjtcbmltcG9ydCB0eXBlIEV2ZW50IGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFwiO1xuaW1wb3J0IEV2ZW50UHJvdmlkZXIgZnJvbSBcInNhcC91aS9iYXNlL0V2ZW50UHJvdmlkZXJcIjtcbmltcG9ydCB0eXBlIFJvdXRlciBmcm9tIFwic2FwL3VpL2NvcmUvcm91dGluZy9Sb3V0ZXJcIjtcbmltcG9ydCBTZXJ2aWNlIGZyb20gXCJzYXAvdWkvY29yZS9zZXJ2aWNlL1NlcnZpY2VcIjtcbmltcG9ydCBTZXJ2aWNlRmFjdG9yeSBmcm9tIFwic2FwL3VpL2NvcmUvc2VydmljZS9TZXJ2aWNlRmFjdG9yeVwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L0NvbnRleHRcIjtcbmltcG9ydCB0eXBlIE9EYXRhTWV0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNZXRhTW9kZWxcIjtcbmltcG9ydCB0eXBlIE9EYXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1vZGVsXCI7XG5pbXBvcnQgT0RhdGFVdGlscyBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhVXRpbHNcIjtcbmltcG9ydCB0eXBlIHsgU2VydmljZUNvbnRleHQgfSBmcm9tIFwidHlwZXMvZXh0ZW5zaW9uX3R5cGVzXCI7XG5cbnR5cGUgUm91dGluZ1NlcnZpY2VTZXR0aW5ncyA9IHt9O1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuc2VydmljZXMuUm91dGluZ1NlcnZpY2VFdmVudGluZ1wiKVxuY2xhc3MgUm91dGluZ1NlcnZpY2VFdmVudGluZyBleHRlbmRzIEV2ZW50UHJvdmlkZXIge1xuXHRAZXZlbnQoKVxuXHRyb3V0ZU1hdGNoZWQhOiBGdW5jdGlvbjtcblx0QGV2ZW50KClcblx0YWZ0ZXJSb3V0ZU1hdGNoZWQhOiBGdW5jdGlvbjtcbn1cblxuZXhwb3J0IHR5cGUgU2VtYW50aWNNYXBwaW5nID0ge1xuXHRzZW1hbnRpY1BhdGg6IHN0cmluZztcblx0dGVjaG5pY2FsUGF0aDogc3RyaW5nO1xufTtcbmV4cG9ydCBjbGFzcyBSb3V0aW5nU2VydmljZSBleHRlbmRzIFNlcnZpY2U8Um91dGluZ1NlcnZpY2VTZXR0aW5ncz4ge1xuXHRvQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRvTW9kZWwhOiBPRGF0YU1vZGVsO1xuXHRvTWV0YU1vZGVsITogT0RhdGFNZXRhTW9kZWw7XG5cdG9Sb3V0ZXIhOiBSb3V0ZXI7XG5cdG9Sb3V0ZXJQcm94eSE6IFJvdXRlclByb3h5O1xuXHRldmVudFByb3ZpZGVyITogRXZlbnRQcm92aWRlcjtcblx0aW5pdFByb21pc2UhOiBQcm9taXNlPGFueT47XG5cdG91dGJvdW5kczogYW55O1xuXHRfbVRhcmdldHM6IGFueTtcblx0X21Sb3V0ZXM6IGFueTtcblx0b0xhc3RTZW1hbnRpY01hcHBpbmc/OiBTZW1hbnRpY01hcHBpbmc7XG5cdGJFeGl0T25OYXZpZ2F0ZUJhY2tUb1Jvb3Q/OiBib29sZWFuO1xuXHRzQ3VycmVudFJvdXRlTmFtZT86IHN0cmluZztcblx0c0N1cnJlbnRSb3V0ZVBhdHRlcm4/OiBzdHJpbmc7XG5cdGFDdXJyZW50Vmlld3M/OiBhbnlbXTtcblx0bmF2aWdhdGlvbkluZm9RdWV1ZTogYW55W10gPSBbXTtcblx0c0NvbnRleHRQYXRoITogc3RyaW5nO1xuXHRfZm5PblJvdXRlTWF0Y2hlZCE6IEZ1bmN0aW9uO1xuXHRpbml0KCkge1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdFx0aWYgKG9Db250ZXh0LnNjb3BlVHlwZSA9PT0gXCJjb21wb25lbnRcIikge1xuXHRcdFx0dGhpcy5vQXBwQ29tcG9uZW50ID0gb0NvbnRleHQuc2NvcGVPYmplY3Q7XG5cdFx0XHR0aGlzLm9Nb2RlbCA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWw7XG5cdFx0XHR0aGlzLm9NZXRhTW9kZWwgPSB0aGlzLm9Nb2RlbC5nZXRNZXRhTW9kZWwoKTtcblx0XHRcdHRoaXMub1JvdXRlciA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRSb3V0ZXIoKTtcblx0XHRcdHRoaXMub1JvdXRlclByb3h5ID0gdGhpcy5vQXBwQ29tcG9uZW50LmdldFJvdXRlclByb3h5KCk7XG5cdFx0XHR0aGlzLmV2ZW50UHJvdmlkZXIgPSBuZXcgKFJvdXRpbmdTZXJ2aWNlRXZlbnRpbmcgYXMgYW55KSgpO1xuXG5cdFx0XHRjb25zdCBvUm91dGluZ0NvbmZpZyA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRNYW5pZmVzdEVudHJ5KFwiL3NhcC51aTUvcm91dGluZ1wiKTtcblx0XHRcdGNvbnN0IG9Sb290Vmlld0NvbmZpZyA9IHRoaXMub0FwcENvbXBvbmVudC5nZXRNYW5pZmVzdEVudHJ5KFwiL3NhcC51aTUvcm9vdFZpZXdcIik7XG5cdFx0XHR0aGlzLl9wYXJzZVJvdXRpbmdDb25maWd1cmF0aW9uKG9Sb3V0aW5nQ29uZmlnLCBvUm9vdFZpZXdDb25maWcpO1xuXG5cdFx0XHRjb25zdCBvQXBwQ29uZmlnID0gdGhpcy5vQXBwQ29tcG9uZW50LmdldE1hbmlmZXN0RW50cnkoXCIvc2FwLmFwcFwiKTtcblx0XHRcdHRoaXMub3V0Ym91bmRzID0gb0FwcENvbmZpZyAmJiBvQXBwQ29uZmlnLmNyb3NzTmF2aWdhdGlvbiAmJiBvQXBwQ29uZmlnLmNyb3NzTmF2aWdhdGlvbi5vdXRib3VuZHM7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbml0UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh0aGlzKTtcblx0fVxuXHRiZWZvcmVFeGl0KCkge1xuXHRcdHRoaXMub1JvdXRlci5kZXRhY2hSb3V0ZU1hdGNoZWQodGhpcy5fZm5PblJvdXRlTWF0Y2hlZCwgdGhpcyk7XG5cdFx0dGhpcy5ldmVudFByb3ZpZGVyLmZpcmVFdmVudChcInJvdXRlTWF0Y2hlZFwiLCB7fSk7XG5cdH1cblx0ZXhpdCgpIHtcblx0XHR0aGlzLmV2ZW50UHJvdmlkZXIuZGVzdHJveSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnNlIGEgbWFuaWZlc3Qgcm91dGluZyBjb25maWd1cmF0aW9uIGZvciBpbnRlcm5hbCB1c2FnZS5cblx0ICpcblx0ICogQHBhcmFtIG9Sb3V0aW5nQ29uZmlnIFRoZSByb3V0aW5nIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgbWFuaWZlc3Rcblx0ICogQHBhcmFtIG9Sb290Vmlld0NvbmZpZyBUaGUgcm9vdCB2aWV3IGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgbWFuaWZlc3Rcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9wYXJzZVJvdXRpbmdDb25maWd1cmF0aW9uKG9Sb3V0aW5nQ29uZmlnOiBhbnksIG9Sb290Vmlld0NvbmZpZzogYW55KSB7XG5cdFx0Y29uc3QgaXNGQ0wgPVxuXHRcdFx0b1Jvb3RWaWV3Q29uZmlnPy52aWV3TmFtZSA9PT0gXCJzYXAuZmUuY29yZS5yb290Vmlldy5GY2xcIiB8fFxuXHRcdFx0b1Jvb3RWaWV3Q29uZmlnPy52aWV3TmFtZSA9PT0gXCJzYXAuZmUudGVtcGxhdGVzLlJvb3RDb250YWluZXIudmlldy5GY2xcIjtcblxuXHRcdC8vIEluZm9ybWF0aW9uIG9mIHRhcmdldHNcblx0XHR0aGlzLl9tVGFyZ2V0cyA9IHt9O1xuXHRcdE9iamVjdC5rZXlzKG9Sb3V0aW5nQ29uZmlnLnRhcmdldHMpLmZvckVhY2goKHNUYXJnZXROYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXSA9IE9iamVjdC5hc3NpZ24oeyB0YXJnZXROYW1lOiBzVGFyZ2V0TmFtZSB9LCBvUm91dGluZ0NvbmZpZy50YXJnZXRzW3NUYXJnZXROYW1lXSk7XG5cblx0XHRcdC8vIFZpZXcgbGV2ZWwgZm9yIEZDTCBjYXNlcyBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIHRhcmdldCBwYXR0ZXJuXG5cdFx0XHRpZiAodGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLmNvbnRleHRQYXR0ZXJuICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLnZpZXdMZXZlbCA9IHRoaXMuX2dldFZpZXdMZXZlbEZyb21QYXR0ZXJuKHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXS5jb250ZXh0UGF0dGVybiwgMCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBJbmZvcm1hdGlvbiBvZiByb3V0ZXNcblx0XHR0aGlzLl9tUm91dGVzID0ge307XG5cdFx0Zm9yIChjb25zdCBzUm91dGVLZXkgaW4gb1JvdXRpbmdDb25maWcucm91dGVzKSB7XG5cdFx0XHRjb25zdCBvUm91dGVNYW5pZmVzdEluZm8gPSBvUm91dGluZ0NvbmZpZy5yb3V0ZXNbc1JvdXRlS2V5XSxcblx0XHRcdFx0YVJvdXRlVGFyZ2V0cyA9IEFycmF5LmlzQXJyYXkob1JvdXRlTWFuaWZlc3RJbmZvLnRhcmdldCkgPyBvUm91dGVNYW5pZmVzdEluZm8udGFyZ2V0IDogW29Sb3V0ZU1hbmlmZXN0SW5mby50YXJnZXRdLFxuXHRcdFx0XHRzUm91dGVOYW1lID0gQXJyYXkuaXNBcnJheShvUm91dGluZ0NvbmZpZy5yb3V0ZXMpID8gb1JvdXRlTWFuaWZlc3RJbmZvLm5hbWUgOiBzUm91dGVLZXksXG5cdFx0XHRcdHNSb3V0ZVBhdHRlcm4gPSBvUm91dGVNYW5pZmVzdEluZm8ucGF0dGVybjtcblxuXHRcdFx0Ly8gQ2hlY2sgcm91dGUgcGF0dGVybjogYWxsIHBhdHRlcm5zIG5lZWQgdG8gZW5kIHdpdGggJzo/cXVlcnk6JywgdGhhdCB3ZSB1c2UgZm9yIHBhcmFtZXRlcnNcblx0XHRcdGlmIChzUm91dGVQYXR0ZXJuLmxlbmd0aCA8IDggfHwgc1JvdXRlUGF0dGVybi5pbmRleE9mKFwiOj9xdWVyeTpcIikgIT09IHNSb3V0ZVBhdHRlcm4ubGVuZ3RoIC0gOCkge1xuXHRcdFx0XHRMb2cud2FybmluZyhgUGF0dGVybiBmb3Igcm91dGUgJHtzUm91dGVOYW1lfSBkb2Vzbid0IGVuZCB3aXRoICc6P3F1ZXJ5OicgOiAke3NSb3V0ZVBhdHRlcm59YCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBpUm91dGVMZXZlbCA9IHRoaXMuX2dldFZpZXdMZXZlbEZyb21QYXR0ZXJuKHNSb3V0ZVBhdHRlcm4sIDApO1xuXHRcdFx0dGhpcy5fbVJvdXRlc1tzUm91dGVOYW1lXSA9IHtcblx0XHRcdFx0bmFtZTogc1JvdXRlTmFtZSxcblx0XHRcdFx0cGF0dGVybjogc1JvdXRlUGF0dGVybixcblx0XHRcdFx0dGFyZ2V0czogYVJvdXRlVGFyZ2V0cyxcblx0XHRcdFx0cm91dGVMZXZlbDogaVJvdXRlTGV2ZWxcblx0XHRcdH07XG5cblx0XHRcdC8vIEFkZCB0aGUgcGFyZW50IHRhcmdldHMgaW4gdGhlIGxpc3Qgb2YgdGFyZ2V0cyBmb3IgdGhlIHJvdXRlXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFSb3V0ZVRhcmdldHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3Qgc1BhcmVudFRhcmdldE5hbWUgPSB0aGlzLl9tVGFyZ2V0c1thUm91dGVUYXJnZXRzW2ldXS5wYXJlbnQ7XG5cdFx0XHRcdGlmIChzUGFyZW50VGFyZ2V0TmFtZSkge1xuXHRcdFx0XHRcdGFSb3V0ZVRhcmdldHMucHVzaChzUGFyZW50VGFyZ2V0TmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCFpc0ZDTCkge1xuXHRcdFx0XHQvLyBWaWV3IGxldmVsIGZvciBub24tRkNMIGNhc2VzIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgcm91dGUgcGF0dGVyblxuXHRcdFx0XHRpZiAodGhpcy5fbVRhcmdldHNbYVJvdXRlVGFyZ2V0c1swXV0udmlld0xldmVsID09PSB1bmRlZmluZWQgfHwgdGhpcy5fbVRhcmdldHNbYVJvdXRlVGFyZ2V0c1swXV0udmlld0xldmVsIDwgaVJvdXRlTGV2ZWwpIHtcblx0XHRcdFx0XHQvLyBUaGVyZSBhcmUgY2FzZXMgd2hlbiBkaWZmZXJlbnQgcm91dGVzIHBvaW50IHRvIHRoZSBzYW1lIHRhcmdldC4gV2UgdGFrZSB0aGVcblx0XHRcdFx0XHQvLyBsYXJnZXN0IHZpZXdMZXZlbCBpbiB0aGF0IGNhc2UuXG5cdFx0XHRcdFx0dGhpcy5fbVRhcmdldHNbYVJvdXRlVGFyZ2V0c1swXV0udmlld0xldmVsID0gaVJvdXRlTGV2ZWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGQ0wgbGV2ZWwgZm9yIG5vbi1GQ0wgY2FzZXMgaXMgZXF1YWwgdG8gLTFcblx0XHRcdFx0dGhpcy5fbVRhcmdldHNbYVJvdXRlVGFyZ2V0c1swXV0uRkNMTGV2ZWwgPSAtMTtcblx0XHRcdH0gZWxzZSBpZiAoYVJvdXRlVGFyZ2V0cy5sZW5ndGggPT09IDEgJiYgdGhpcy5fbVRhcmdldHNbYVJvdXRlVGFyZ2V0c1swXV0uY29udHJvbEFnZ3JlZ2F0aW9uICE9PSBcImJlZ2luQ29sdW1uUGFnZXNcIikge1xuXHRcdFx0XHQvLyBXZSdyZSBpbiB0aGUgY2FzZSB3aGVyZSB0aGVyZSdzIG9ubHkgMSB0YXJnZXQgZm9yIHRoZSByb3V0ZSwgYW5kIGl0J3Mgbm90IGluIHRoZSBmaXJzdCBjb2x1bW5cblx0XHRcdFx0Ly8gLS0+IHRoaXMgaXMgYSBmdWxsc2NyZWVuIGNvbHVtbiBhZnRlciBhbGwgY29sdW1ucyBpbiB0aGUgRkNMIGhhdmUgYmVlbiB1c2VkXG5cdFx0XHRcdHRoaXMuX21UYXJnZXRzW2FSb3V0ZVRhcmdldHNbMF1dLkZDTExldmVsID0gMztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIE90aGVyIEZDTCBjYXNlc1xuXHRcdFx0XHRhUm91dGVUYXJnZXRzLmZvckVhY2goKHNUYXJnZXROYW1lOiBhbnkpID0+IHtcblx0XHRcdFx0XHRzd2l0Y2ggKHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXS5jb250cm9sQWdncmVnYXRpb24pIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJiZWdpbkNvbHVtblBhZ2VzXCI6XG5cdFx0XHRcdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXS5GQ0xMZXZlbCA9IDA7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRjYXNlIFwibWlkQ29sdW1uUGFnZXNcIjpcblx0XHRcdFx0XHRcdFx0dGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLkZDTExldmVsID0gMTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXS5GQ0xMZXZlbCA9IDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBQcm9wYWdhdGUgdmlld0xldmVsLCBjb250ZXh0UGF0dGVybiwgRkNMTGV2ZWwgYW5kIGNvbnRyb2xBZ2dyZWdhdGlvbiB0byBwYXJlbnQgdGFyZ2V0c1xuXHRcdE9iamVjdC5rZXlzKHRoaXMuX21UYXJnZXRzKS5mb3JFYWNoKChzVGFyZ2V0TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHR3aGlsZSAodGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLnBhcmVudCkge1xuXHRcdFx0XHRjb25zdCBzUGFyZW50VGFyZ2V0TmFtZSA9IHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXS5wYXJlbnQ7XG5cdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NQYXJlbnRUYXJnZXROYW1lXS52aWV3TGV2ZWwgPVxuXHRcdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NQYXJlbnRUYXJnZXROYW1lXS52aWV3TGV2ZWwgfHwgdGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLnZpZXdMZXZlbDtcblx0XHRcdFx0dGhpcy5fbVRhcmdldHNbc1BhcmVudFRhcmdldE5hbWVdLmNvbnRleHRQYXR0ZXJuID1cblx0XHRcdFx0XHR0aGlzLl9tVGFyZ2V0c1tzUGFyZW50VGFyZ2V0TmFtZV0uY29udGV4dFBhdHRlcm4gfHwgdGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLmNvbnRleHRQYXR0ZXJuO1xuXHRcdFx0XHR0aGlzLl9tVGFyZ2V0c1tzUGFyZW50VGFyZ2V0TmFtZV0uRkNMTGV2ZWwgPVxuXHRcdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NQYXJlbnRUYXJnZXROYW1lXS5GQ0xMZXZlbCB8fCB0aGlzLl9tVGFyZ2V0c1tzVGFyZ2V0TmFtZV0uRkNMTGV2ZWw7XG5cdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NQYXJlbnRUYXJnZXROYW1lXS5jb250cm9sQWdncmVnYXRpb24gPVxuXHRcdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NQYXJlbnRUYXJnZXROYW1lXS5jb250cm9sQWdncmVnYXRpb24gfHwgdGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLmNvbnRyb2xBZ2dyZWdhdGlvbjtcblx0XHRcdFx0c1RhcmdldE5hbWUgPSBzUGFyZW50VGFyZ2V0TmFtZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIERldGVybWluZSB0aGUgcm9vdCBlbnRpdHkgZm9yIHRoZSBhcHBcblx0XHRjb25zdCBhTGV2ZWwwUm91dGVOYW1lcyA9IFtdO1xuXHRcdGNvbnN0IGFMZXZlbDFSb3V0ZU5hbWVzID0gW107XG5cdFx0bGV0IHNEZWZhdWx0Um91dGVOYW1lO1xuXG5cdFx0Zm9yIChjb25zdCBzTmFtZSBpbiB0aGlzLl9tUm91dGVzKSB7XG5cdFx0XHRjb25zdCBpTGV2ZWwgPSB0aGlzLl9tUm91dGVzW3NOYW1lXS5yb3V0ZUxldmVsO1xuXHRcdFx0aWYgKGlMZXZlbCA9PT0gMCkge1xuXHRcdFx0XHRhTGV2ZWwwUm91dGVOYW1lcy5wdXNoKHNOYW1lKTtcblx0XHRcdH0gZWxzZSBpZiAoaUxldmVsID09PSAxKSB7XG5cdFx0XHRcdGFMZXZlbDFSb3V0ZU5hbWVzLnB1c2goc05hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChhTGV2ZWwwUm91dGVOYW1lcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHNEZWZhdWx0Um91dGVOYW1lID0gYUxldmVsMFJvdXRlTmFtZXNbMF07XG5cdFx0fSBlbHNlIGlmIChhTGV2ZWwxUm91dGVOYW1lcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHNEZWZhdWx0Um91dGVOYW1lID0gYUxldmVsMVJvdXRlTmFtZXNbMF07XG5cdFx0fVxuXG5cdFx0aWYgKHNEZWZhdWx0Um91dGVOYW1lKSB7XG5cdFx0XHRjb25zdCBzRGVmYXVsdFRhcmdldE5hbWUgPSB0aGlzLl9tUm91dGVzW3NEZWZhdWx0Um91dGVOYW1lXS50YXJnZXRzLnNsaWNlKC0xKVswXTtcblx0XHRcdHRoaXMuc0NvbnRleHRQYXRoID0gXCJcIjtcblx0XHRcdGlmICh0aGlzLl9tVGFyZ2V0c1tzRGVmYXVsdFRhcmdldE5hbWVdLm9wdGlvbnMgJiYgdGhpcy5fbVRhcmdldHNbc0RlZmF1bHRUYXJnZXROYW1lXS5vcHRpb25zLnNldHRpbmdzKSB7XG5cdFx0XHRcdGNvbnN0IG9TZXR0aW5ncyA9IHRoaXMuX21UYXJnZXRzW3NEZWZhdWx0VGFyZ2V0TmFtZV0ub3B0aW9ucy5zZXR0aW5ncztcblx0XHRcdFx0dGhpcy5zQ29udGV4dFBhdGggPSBvU2V0dGluZ3MuY29udGV4dFBhdGggfHwgYC8ke29TZXR0aW5ncy5lbnRpdHlTZXR9YDtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpcy5zQ29udGV4dFBhdGgpIHtcblx0XHRcdFx0TG9nLndhcm5pbmcoXG5cdFx0XHRcdFx0YENhbm5vdCBkZXRlcm1pbmUgZGVmYXVsdCBjb250ZXh0UGF0aDogY29udGV4dFBhdGggb3IgZW50aXR5U2V0IG1pc3NpbmcgaW4gZGVmYXVsdCB0YXJnZXQ6ICR7c0RlZmF1bHRUYXJnZXROYW1lfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0TG9nLndhcm5pbmcoXCJDYW5ub3QgZGV0ZXJtaW5lIGRlZmF1bHQgY29udGV4dFBhdGg6IG5vIGRlZmF1bHQgcm91dGUgZm91bmQuXCIpO1xuXHRcdH1cblxuXHRcdC8vIFdlIG5lZWQgdG8gZXN0YWJsaXNoIHRoZSBjb3JyZWN0IHBhdGggdG8gdGhlIGRpZmZlcmVudCBwYWdlcywgaW5jbHVkaW5nIHRoZSBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblx0XHRPYmplY3Qua2V5cyh0aGlzLl9tVGFyZ2V0cylcblx0XHRcdC5tYXAoKHNUYXJnZXRLZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fbVRhcmdldHNbc1RhcmdldEtleV07XG5cdFx0XHR9KVxuXHRcdFx0LnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XG5cdFx0XHRcdHJldHVybiBhLnZpZXdMZXZlbCA8IGIudmlld0xldmVsID8gLTEgOiAxO1xuXHRcdFx0fSlcblx0XHRcdC5mb3JFYWNoKCh0YXJnZXQ6IGFueSkgPT4ge1xuXHRcdFx0XHQvLyBBZnRlciBzb3J0aW5nIHRoZSB0YXJnZXRzIHBlciBsZXZlbCB3ZSBjYW4gdGhlbiBnbyB0aHJvdWdoIHRoZWlyIG5hdmlnYXRpb24gb2JqZWN0IGFuZCB1cGRhdGUgdGhlIHBhdGhzIGFjY29yZGluZ2x5LlxuXHRcdFx0XHRpZiAodGFyZ2V0Lm9wdGlvbnMpIHtcblx0XHRcdFx0XHRjb25zdCBzZXR0aW5ncyA9IHRhcmdldC5vcHRpb25zLnNldHRpbmdzO1xuXHRcdFx0XHRcdGNvbnN0IHNDb250ZXh0UGF0aCA9IHNldHRpbmdzLmNvbnRleHRQYXRoIHx8IChzZXR0aW5ncy5lbnRpdHlTZXQgPyBgLyR7c2V0dGluZ3MuZW50aXR5U2V0fWAgOiBcIlwiKTtcblx0XHRcdFx0XHRpZiAoIXNldHRpbmdzLmZ1bGxDb250ZXh0UGF0aCAmJiBzQ29udGV4dFBhdGgpIHtcblx0XHRcdFx0XHRcdHNldHRpbmdzLmZ1bGxDb250ZXh0UGF0aCA9IGAke3NDb250ZXh0UGF0aH0vYDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoc2V0dGluZ3MubmF2aWdhdGlvbiB8fCB7fSkuZm9yRWFjaCgoc05hdk5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgaXQncyBhIG5hdmlnYXRpb24gcHJvcGVydHlcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldFJvdXRlID0gdGhpcy5fbVJvdXRlc1tzZXR0aW5ncy5uYXZpZ2F0aW9uW3NOYXZOYW1lXS5kZXRhaWwucm91dGVdO1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldFJvdXRlICYmIHRhcmdldFJvdXRlLnRhcmdldHMpIHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0Um91dGUudGFyZ2V0cy5mb3JFYWNoKChzVGFyZ2V0TmFtZTogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLm9wdGlvbnMgJiZcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXS5vcHRpb25zLnNldHRpbmdzICYmXG5cdFx0XHRcdFx0XHRcdFx0XHQhdGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLm9wdGlvbnMuc2V0dGluZ3MuZnVsbENvbnRleHRQYXRoXG5cdFx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodGFyZ2V0LnZpZXdMZXZlbCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9tVGFyZ2V0c1tzVGFyZ2V0TmFtZV0ub3B0aW9ucy5zZXR0aW5ncy5mdWxsQ29udGV4dFBhdGggPSBgJHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoc05hdk5hbWUuc3RhcnRzV2l0aChcIi9cIikgPyBcIlwiIDogXCIvXCIpICsgc05hdk5hbWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0fS9gO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fbVRhcmdldHNbc1RhcmdldE5hbWVdLm9wdGlvbnMuc2V0dGluZ3MuZnVsbENvbnRleHRQYXRoID0gYCR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2V0dGluZ3MuZnVsbENvbnRleHRQYXRoICsgc05hdk5hbWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0fS9gO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgYSB2aWV3IGxldmVsIGZyb20gYSBwYXR0ZXJuIGJ5IGNvdW50aW5nIHRoZSBudW1iZXIgb2Ygc2VnbWVudHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBzUGF0dGVybiBUaGUgcGF0dGVyblxuXHQgKiBAcGFyYW0gdmlld0xldmVsIFRoZSBjdXJyZW50IGxldmVsIG9mIHZpZXdcblx0ICogQHJldHVybnMgVGhlIGxldmVsXG5cdCAqL1xuXHRfZ2V0Vmlld0xldmVsRnJvbVBhdHRlcm4oc1BhdHRlcm46IHN0cmluZywgdmlld0xldmVsOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdHNQYXR0ZXJuID0gc1BhdHRlcm4ucmVwbGFjZShcIjo/cXVlcnk6XCIsIFwiXCIpO1xuXHRcdGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcIi9bXi9dKiRcIik7XG5cdFx0aWYgKHNQYXR0ZXJuICYmIHNQYXR0ZXJuWzBdICE9PSBcIi9cIiAmJiBzUGF0dGVyblswXSAhPT0gXCI/XCIpIHtcblx0XHRcdHNQYXR0ZXJuID0gYC8ke3NQYXR0ZXJufWA7XG5cdFx0fVxuXHRcdGlmIChzUGF0dGVybi5sZW5ndGgpIHtcblx0XHRcdHNQYXR0ZXJuID0gc1BhdHRlcm4ucmVwbGFjZShyZWdleCwgXCJcIik7XG5cdFx0XHRpZiAodGhpcy5vUm91dGVyLm1hdGNoKHNQYXR0ZXJuKSB8fCBzUGF0dGVybiA9PT0gXCJcIikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZ2V0Vmlld0xldmVsRnJvbVBhdHRlcm4oc1BhdHRlcm4sICsrdmlld0xldmVsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9nZXRWaWV3TGV2ZWxGcm9tUGF0dGVybihzUGF0dGVybiwgdmlld0xldmVsKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHZpZXdMZXZlbDtcblx0XHR9XG5cdH1cblxuXHRfZ2V0Um91dGVJbmZvcm1hdGlvbihzUm91dGVOYW1lOiBhbnkpIHtcblx0XHRyZXR1cm4gdGhpcy5fbVJvdXRlc1tzUm91dGVOYW1lXTtcblx0fVxuXG5cdF9nZXRUYXJnZXRJbmZvcm1hdGlvbihzVGFyZ2V0TmFtZTogYW55KSB7XG5cdFx0cmV0dXJuIHRoaXMuX21UYXJnZXRzW3NUYXJnZXROYW1lXTtcblx0fVxuXG5cdF9nZXRDb21wb25lbnRJZChzT3duZXJJZDogYW55LCBzQ29tcG9uZW50SWQ6IGFueSkge1xuXHRcdGlmIChzQ29tcG9uZW50SWQuaW5kZXhPZihgJHtzT3duZXJJZH0tLS1gKSA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHNDb21wb25lbnRJZC5zdWJzdHIoc093bmVySWQubGVuZ3RoICsgMyk7XG5cdFx0fVxuXHRcdHJldHVybiBzQ29tcG9uZW50SWQ7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRhcmdldCBpbmZvcm1hdGlvbiBmb3IgYSBnaXZlbiBjb21wb25lbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29tcG9uZW50SW5zdGFuY2UgSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudFxuXHQgKiBAcmV0dXJucyBUaGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIHRhcmdldFxuXHQgKi9cblx0Z2V0VGFyZ2V0SW5mb3JtYXRpb25Gb3Iob0NvbXBvbmVudEluc3RhbmNlOiBhbnkpIHtcblx0XHRjb25zdCBzVGFyZ2V0Q29tcG9uZW50SWQgPSB0aGlzLl9nZXRDb21wb25lbnRJZChvQ29tcG9uZW50SW5zdGFuY2UuX3NPd25lcklkLCBvQ29tcG9uZW50SW5zdGFuY2UuZ2V0SWQoKSk7XG5cdFx0bGV0IHNDb3JyZWN0VGFyZ2V0TmFtZSA9IG51bGw7XG5cdFx0T2JqZWN0LmtleXModGhpcy5fbVRhcmdldHMpLmZvckVhY2goKHNUYXJnZXROYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdGlmICh0aGlzLl9tVGFyZ2V0c1tzVGFyZ2V0TmFtZV0uaWQgPT09IHNUYXJnZXRDb21wb25lbnRJZCB8fCB0aGlzLl9tVGFyZ2V0c1tzVGFyZ2V0TmFtZV0udmlld0lkID09PSBzVGFyZ2V0Q29tcG9uZW50SWQpIHtcblx0XHRcdFx0c0NvcnJlY3RUYXJnZXROYW1lID0gc1RhcmdldE5hbWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXMuX2dldFRhcmdldEluZm9ybWF0aW9uKHNDb3JyZWN0VGFyZ2V0TmFtZSk7XG5cdH1cblxuXHRnZXRMYXN0U2VtYW50aWNNYXBwaW5nKCk6IFNlbWFudGljTWFwcGluZyB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMub0xhc3RTZW1hbnRpY01hcHBpbmc7XG5cdH1cblxuXHRzZXRMYXN0U2VtYW50aWNNYXBwaW5nKG9NYXBwaW5nPzogU2VtYW50aWNNYXBwaW5nKSB7XG5cdFx0dGhpcy5vTGFzdFNlbWFudGljTWFwcGluZyA9IG9NYXBwaW5nO1xuXHR9XG5cblx0bmF2aWdhdGVUbyhvQ29udGV4dDogYW55LCBzUm91dGVOYW1lOiBhbnksIG1QYXJhbWV0ZXJNYXBwaW5nOiBhbnksIGJQcmVzZXJ2ZUhpc3Rvcnk6IGFueSkge1xuXHRcdGxldCBzVGFyZ2V0VVJMUHJvbWlzZSwgYklzU3RpY2t5TW9kZTogYm9vbGVhbjtcblx0XHRpZiAob0NvbnRleHQuZ2V0TW9kZWwoKSAmJiBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCAmJiBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpKSB7XG5cdFx0XHRiSXNTdGlja3lNb2RlID0gTW9kZWxIZWxwZXIuaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkKG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkpO1xuXHRcdH1cblx0XHRpZiAoIW1QYXJhbWV0ZXJNYXBwaW5nKSB7XG5cdFx0XHQvLyBpZiB0aGVyZSBpcyBubyBwYXJhbWV0ZXIgbWFwcGluZyBkZWZpbmUgdGhpcyBtZWFuIHdlIHJlbHkgZW50aXJlbHkgb24gdGhlIGJpbmRpbmcgY29udGV4dCBwYXRoXG5cdFx0XHRzVGFyZ2V0VVJMUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShTZW1hbnRpY0tleUhlbHBlci5nZXRTZW1hbnRpY1BhdGgob0NvbnRleHQpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c1RhcmdldFVSTFByb21pc2UgPSB0aGlzLnByZXBhcmVQYXJhbWV0ZXJzKG1QYXJhbWV0ZXJNYXBwaW5nLCBzUm91dGVOYW1lLCBvQ29udGV4dCkudGhlbigobVBhcmFtZXRlcnM6IGFueSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5vUm91dGVyLmdldFVSTChzUm91dGVOYW1lLCBtUGFyYW1ldGVycyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHNUYXJnZXRVUkxQcm9taXNlLnRoZW4oKHNUYXJnZXRVUkw6IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5vUm91dGVyUHJveHkubmF2VG9IYXNoKHNUYXJnZXRVUkwsIGJQcmVzZXJ2ZUhpc3RvcnksIGZhbHNlLCBmYWxzZSwgIWJJc1N0aWNreU1vZGUpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byByZXR1cm4gYSBtYXAgb2Ygcm91dGluZyB0YXJnZXQgcGFyYW1ldGVycyB3aGVyZSB0aGUgYmluZGluZyBzeW50YXggaXMgcmVzb2x2ZWQgdG8gdGhlIGN1cnJlbnQgbW9kZWwuXG5cdCAqXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBQYXJhbWV0ZXJzIG1hcCBpbiB0aGUgZm9ybWF0IFtrOiBzdHJpbmddIDogQ29tcGxleEJpbmRpbmdTeW50YXhcblx0ICogQHBhcmFtIHNUYXJnZXRSb3V0ZSBOYW1lIG9mIHRoZSB0YXJnZXQgcm91dGVcblx0ICogQHBhcmFtIG9Db250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgYmluZGluZyBjb250ZXh0XG5cdCAqIEByZXR1cm5zIEEgcHJvbWlzZSB3aGljaCByZXNvbHZlcyB0byB0aGUgcm91dGluZyB0YXJnZXQgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJlcGFyZVBhcmFtZXRlcnMobVBhcmFtZXRlcnM6IGFueSwgc1RhcmdldFJvdXRlOiBzdHJpbmcsIG9Db250ZXh0OiBDb250ZXh0KSB7XG5cdFx0bGV0IG9QYXJhbWV0ZXJzUHJvbWlzZTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc0NvbnRleHRQYXRoID0gb0NvbnRleHQuZ2V0UGF0aCgpO1xuXHRcdFx0Y29uc3Qgb01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsO1xuXHRcdFx0Y29uc3QgYUNvbnRleHRQYXRoUGFydHMgPSBzQ29udGV4dFBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0Y29uc3QgYUFsbFJlc29sdmVkUGFyYW1ldGVyUHJvbWlzZXMgPSBPYmplY3Qua2V5cyhtUGFyYW1ldGVycykubWFwKChzUGFyYW1ldGVyS2V5OiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3Qgc1BhcmFtZXRlck1hcHBpbmdFeHByZXNzaW9uID0gbVBhcmFtZXRlcnNbc1BhcmFtZXRlcktleV07XG5cdFx0XHRcdC8vIFdlIGFzc3VtZSB0aGUgZGVmaW5lZCBwYXJhbWV0ZXJzIHdpbGwgYmUgY29tcGF0aWJsZSB3aXRoIGEgYmluZGluZyBleHByZXNzaW9uXG5cdFx0XHRcdGNvbnN0IG9QYXJzZWRFeHByZXNzaW9uID0gQmluZGluZ1BhcnNlci5jb21wbGV4UGFyc2VyKHNQYXJhbWV0ZXJNYXBwaW5nRXhwcmVzc2lvbik7XG5cdFx0XHRcdGNvbnN0IGFQYXJ0cyA9IG9QYXJzZWRFeHByZXNzaW9uLnBhcnRzIHx8IFtvUGFyc2VkRXhwcmVzc2lvbl07XG5cdFx0XHRcdGNvbnN0IGFSZXNvbHZlZFBhcmFtZXRlclByb21pc2VzID0gYVBhcnRzLm1hcChmdW5jdGlvbiAob1BhdGhQYXJ0OiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBhUmVsYXRpdmVQYXJ0cyA9IG9QYXRoUGFydC5wYXRoLnNwbGl0KFwiLi4vXCIpO1xuXHRcdFx0XHRcdC8vIFdlIGdvIHVwIHRoZSBjdXJyZW50IGNvbnRleHQgcGF0aCBhcyBtYW55IHRpbWVzIGFzIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdGNvbnN0IGFMb2NhbFBhcnRzID0gYUNvbnRleHRQYXRoUGFydHMuc2xpY2UoMCwgYUNvbnRleHRQYXRoUGFydHMubGVuZ3RoIC0gYVJlbGF0aXZlUGFydHMubGVuZ3RoICsgMSk7XG5cdFx0XHRcdFx0YUxvY2FsUGFydHMucHVzaChhUmVsYXRpdmVQYXJ0c1thUmVsYXRpdmVQYXJ0cy5sZW5ndGggLSAxXSk7XG5cblx0XHRcdFx0XHRjb25zdCBzUHJvcGVydHlQYXRoID0gYUxvY2FsUGFydHMuam9pbihcIi9cIik7XG5cdFx0XHRcdFx0Y29uc3Qgb01ldGFDb250ZXh0ID0gKG9NZXRhTW9kZWwgYXMgYW55KS5nZXRNZXRhQ29udGV4dChzUHJvcGVydHlQYXRoKTtcblx0XHRcdFx0XHRyZXR1cm4gb0NvbnRleHQucmVxdWVzdFByb3BlcnR5KHNQcm9wZXJ0eVBhdGgpLnRoZW4oZnVuY3Rpb24gKG9WYWx1ZTogYW55KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvUHJvcGVydHlJbmZvID0gb01ldGFDb250ZXh0LmdldE9iamVjdCgpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc0VkbVR5cGUgPSBvUHJvcGVydHlJbmZvLiRUeXBlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIE9EYXRhVXRpbHMuZm9ybWF0TGl0ZXJhbChvVmFsdWUsIHNFZG1UeXBlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKGFSZXNvbHZlZFBhcmFtZXRlclByb21pc2VzKS50aGVuKChhUmVzb2x2ZWRQYXJhbWV0ZXJzOiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9QYXJzZWRFeHByZXNzaW9uLmZvcm1hdHRlclxuXHRcdFx0XHRcdFx0PyBvUGFyc2VkRXhwcmVzc2lvbi5mb3JtYXR0ZXIuYXBwbHkodGhpcywgYVJlc29sdmVkUGFyYW1ldGVycylcblx0XHRcdFx0XHRcdDogYVJlc29sdmVkUGFyYW1ldGVycy5qb2luKFwiXCIpO1xuXHRcdFx0XHRcdHJldHVybiB7IGtleTogc1BhcmFtZXRlcktleSwgdmFsdWU6IHZhbHVlIH07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdG9QYXJhbWV0ZXJzUHJvbWlzZSA9IFByb21pc2UuYWxsKGFBbGxSZXNvbHZlZFBhcmFtZXRlclByb21pc2VzKS50aGVuKGZ1bmN0aW9uIChcblx0XHRcdFx0YUFsbFJlc29sdmVkUGFyYW1ldGVyczogeyBrZXk6IGFueTsgdmFsdWU6IGFueSB9W11cblx0XHRcdCkge1xuXHRcdFx0XHRjb25zdCBvUGFyYW1ldGVyczogYW55ID0ge307XG5cdFx0XHRcdGFBbGxSZXNvbHZlZFBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAob1Jlc29sdmVkUGFyYW1ldGVyOiB7IGtleTogYW55OyB2YWx1ZTogYW55IH0pIHtcblx0XHRcdFx0XHRvUGFyYW1ldGVyc1tvUmVzb2x2ZWRQYXJhbWV0ZXIua2V5XSA9IG9SZXNvbHZlZFBhcmFtZXRlci52YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBvUGFyYW1ldGVycztcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKG9FcnJvcikge1xuXHRcdFx0TG9nLmVycm9yKGBDb3VsZCBub3QgcGFyc2UgdGhlIHBhcmFtZXRlcnMgZm9yIHRoZSBuYXZpZ2F0aW9uIHRvIHJvdXRlICR7c1RhcmdldFJvdXRlfWApO1xuXHRcdFx0b1BhcmFtZXRlcnNQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG5cdFx0fVxuXHRcdHJldHVybiBvUGFyYW1ldGVyc1Byb21pc2U7XG5cdH1cblxuXHRfZmlyZVJvdXRlTWF0Y2hFdmVudHMobVBhcmFtZXRlcnM6IGFueSkge1xuXHRcdHRoaXMuZXZlbnRQcm92aWRlci5maXJlRXZlbnQoXCJyb3V0ZU1hdGNoZWRcIiwgbVBhcmFtZXRlcnMpO1xuXHRcdHRoaXMuZXZlbnRQcm92aWRlci5maXJlRXZlbnQoXCJhZnRlclJvdXRlTWF0Y2hlZFwiLCBtUGFyYW1ldGVycyk7XG5cblx0XHRFZGl0U3RhdGUuY2xlYW5Qcm9jZXNzZWRFZGl0U3RhdGUoKTsgLy8gUmVzZXQgVUkgc3RhdGUgd2hlbiBhbGwgYmluZGluZ3MgaGF2ZSBiZWVuIHJlZnJlc2hlZFxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byBhIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBUaGUgQ29udGV4dCB0byBiZSBuYXZpZ2F0ZWQgdG9cblx0ICogQHBhcmFtIFttUGFyYW1ldGVyc10gT3B0aW9uYWwsIG1hcCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcblx0ICogQHBhcmFtIFttUGFyYW1ldGVycy5jaGVja05vSGFzaENoYW5nZV0gTmF2aWdhdGUgdG8gdGhlIGNvbnRleHQgd2l0aG91dCBjaGFuZ2luZyB0aGUgVVJMXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuYXN5bmNDb250ZXh0XSBUaGUgY29udGV4dCBpcyBjcmVhdGVkIGFzeW5jLCBuYXZpZ2F0ZSB0byAoLi4uKSBhbmRcblx0ICogICAgICAgICAgICAgICAgICAgIHdhaXQgZm9yIFByb21pc2UgdG8gYmUgcmVzb2x2ZWQgYW5kIHRoZW4gbmF2aWdhdGUgaW50byB0aGUgY29udGV4dFxuXHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmJEZWZlcnJlZENvbnRleHRdIFRoZSBjb250ZXh0IHNoYWxsIGJlIGNyZWF0ZWQgZGVmZXJyZWQgYXQgdGhlIHRhcmdldCBwYWdlXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuZWRpdGFibGVdIFRoZSB0YXJnZXQgcGFnZSBzaGFsbCBiZSBpbW1lZGlhdGVseSBpbiB0aGUgZWRpdCBtb2RlIHRvIGF2b2lkIGZsaWNrZXJpbmdcblx0ICogQHBhcmFtIFttUGFyYW1ldGVycy5iUGVyc2lzdE9QU2Nyb2xsXSBUaGUgYlBlcnNpc3RPUFNjcm9sbCB3aWxsIGJlIHVzZWQgZm9yIHNjcm9sbGluZyB0byBmaXJzdCB0YWJcblx0ICogQHBhcmFtIFttUGFyYW1ldGVycy51cGRhdGVGQ0xMZXZlbF0gYCsxYCBpZiB3ZSBhZGQgYSBjb2x1bW4gaW4gRkNMLCBgLTFgIHRvIHJlbW92ZSBhIGNvbHVtbiwgMCB0byBzdGF5IG9uIHRoZSBzYW1lIGNvbHVtblxuXHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLm5vUHJlc2VydmF0aW9uQ2FjaGVdIERvIG5hdmlnYXRpb24gd2l0aG91dCB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBwcmVzZXJ2ZWQgY2FjaGUgbWVjaGFuaXNtXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuYlJlY3JlYXRlQ29udGV4dF0gRm9yY2UgcmUtY3JlYXRpb24gb2YgdGhlIGNvbnRleHQgaW5zdGVhZCBvZiB1c2luZyB0aGUgb25lIHBhc3NlZCBhcyBwYXJhbWV0ZXJcblx0ICogQHBhcmFtIFttUGFyYW1ldGVycy5iRm9yY2VGb2N1c10gRm9yY2VzIGZvY3VzIHNlbGVjdGlvbiBhZnRlciBuYXZpZ2F0aW9uXG5cdCAqIEBwYXJhbSBbb1ZpZXdEYXRhXSBWaWV3IGRhdGFcblx0ICogQHBhcmFtIFtvQ3VycmVudFRhcmdldEluZm9dIFRoZSB0YXJnZXQgaW5mb3JtYXRpb24gZnJvbSB3aGljaCB0aGUgbmF2aWdhdGlvbiBpcyB0cmlnZ2VyZWRcblx0ICogQHJldHVybnMgUHJvbWlzZSB3aGljaCBpcyByZXNvbHZlZCBvbmNlIHRoZSBuYXZpZ2F0aW9uIGlzIHRyaWdnZXJlZFxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQGZpbmFsXG5cdCAqL1xuXHRuYXZpZ2F0ZVRvQ29udGV4dChcblx0XHRvQ29udGV4dDogYW55LFxuXHRcdG1QYXJhbWV0ZXJzOlxuXHRcdFx0fCB7XG5cdFx0XHRcdFx0Y2hlY2tOb0hhc2hDaGFuZ2U/OiBib29sZWFuO1xuXHRcdFx0XHRcdGFzeW5jQ29udGV4dD86IFByb21pc2U8YW55Pjtcblx0XHRcdFx0XHRiRGVmZXJyZWRDb250ZXh0PzogYm9vbGVhbjtcblx0XHRcdFx0XHRlZGl0YWJsZT86IGJvb2xlYW47XG5cdFx0XHRcdFx0dHJhbnNpZW50PzogYm9vbGVhbjtcblx0XHRcdFx0XHRiUGVyc2lzdE9QU2Nyb2xsPzogYm9vbGVhbjtcblx0XHRcdFx0XHR1cGRhdGVGQ0xMZXZlbD86IG51bWJlcjtcblx0XHRcdFx0XHRub1ByZXNlcnZhdGlvbkNhY2hlPzogYm9vbGVhbjtcblx0XHRcdFx0XHRiUmVjcmVhdGVDb250ZXh0PzogYm9vbGVhbjtcblx0XHRcdFx0XHRiRm9yY2VGb2N1cz86IGJvb2xlYW47XG5cdFx0XHRcdFx0dGFyZ2V0UGF0aD86IHN0cmluZztcblx0XHRcdFx0XHRzaG93UGxhY2Vob2xkZXI/OiBib29sZWFuO1xuXHRcdFx0XHRcdGJEcmFmdE5hdmlnYXRpb24/OiBib29sZWFuO1xuXHRcdFx0ICB9XG5cdFx0XHR8IHVuZGVmaW5lZCxcblx0XHRvVmlld0RhdGE6IGFueSB8IHVuZGVmaW5lZCxcblx0XHRvQ3VycmVudFRhcmdldEluZm86IGFueSB8IHVuZGVmaW5lZFxuXHQpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRsZXQgc1RhcmdldFJvdXRlOiBzdHJpbmcgPSBcIlwiLFxuXHRcdFx0b1JvdXRlUGFyYW1ldGVyc1Byb21pc2UsXG5cdFx0XHRiSXNTdGlja3lNb2RlOiBib29sZWFuID0gZmFsc2U7XG5cblx0XHRpZiAob0NvbnRleHQuZ2V0TW9kZWwoKSAmJiBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCkge1xuXHRcdFx0YklzU3RpY2t5TW9kZSA9IE1vZGVsSGVscGVyLmlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZChvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpKTtcblx0XHR9XG5cdFx0Ly8gTWFuYWdlIHBhcmFtZXRlciBtYXBwaW5nXG5cdFx0aWYgKG1QYXJhbWV0ZXJzICYmIG1QYXJhbWV0ZXJzLnRhcmdldFBhdGggJiYgb1ZpZXdEYXRhICYmIG9WaWV3RGF0YS5uYXZpZ2F0aW9uKSB7XG5cdFx0XHRjb25zdCBvUm91dGVEZXRhaWwgPSBvVmlld0RhdGEubmF2aWdhdGlvblttUGFyYW1ldGVycy50YXJnZXRQYXRoXS5kZXRhaWw7XG5cdFx0XHRzVGFyZ2V0Um91dGUgPSBvUm91dGVEZXRhaWwucm91dGU7XG5cblx0XHRcdGlmIChvUm91dGVEZXRhaWwucGFyYW1ldGVycykge1xuXHRcdFx0XHRvUm91dGVQYXJhbWV0ZXJzUHJvbWlzZSA9IHRoaXMucHJlcGFyZVBhcmFtZXRlcnMob1JvdXRlRGV0YWlsLnBhcmFtZXRlcnMsIHNUYXJnZXRSb3V0ZSwgb0NvbnRleHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBzVGFyZ2V0UGF0aCA9IHRoaXMuX2dldFBhdGhGcm9tQ29udGV4dChvQ29udGV4dCwgbVBhcmFtZXRlcnMpO1xuXHRcdC8vIElmIHRoZSBwYXRoIGlzIGVtcHR5LCB3ZSdyZSBzdXBwb3NlZCB0byBuYXZpZ2F0ZSB0byB0aGUgZmlyc3QgcGFnZSBvZiB0aGUgYXBwXG5cdFx0Ly8gQ2hlY2sgaWYgd2UgbmVlZCB0byBleGl0IGZyb20gdGhlIGFwcCBpbnN0ZWFkXG5cdFx0aWYgKHNUYXJnZXRQYXRoLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmJFeGl0T25OYXZpZ2F0ZUJhY2tUb1Jvb3QpIHtcblx0XHRcdHRoaXMub1JvdXRlclByb3h5LmV4aXRGcm9tQXBwKCk7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoZSBjb250ZXh0IGlzIGRlZmVycmVkIG9yIGFzeW5jLCB3ZSBhZGQgKC4uLikgdG8gdGhlIHBhdGhcblx0XHRpZiAobVBhcmFtZXRlcnM/LmFzeW5jQ29udGV4dCB8fCBtUGFyYW1ldGVycz8uYkRlZmVycmVkQ29udGV4dCkge1xuXHRcdFx0c1RhcmdldFBhdGggKz0gXCIoLi4uKVwiO1xuXHRcdH1cblxuXHRcdC8vIEFkZCBsYXlvdXQgcGFyYW1ldGVyIGlmIG5lZWRlZFxuXHRcdGNvbnN0IHNMYXlvdXQgPSB0aGlzLl9jYWxjdWxhdGVMYXlvdXQoc1RhcmdldFBhdGgsIG1QYXJhbWV0ZXJzKTtcblx0XHRpZiAoc0xheW91dCkge1xuXHRcdFx0c1RhcmdldFBhdGggKz0gYD9sYXlvdXQ9JHtzTGF5b3V0fWA7XG5cdFx0fVxuXG5cdFx0Ly8gTmF2aWdhdGlvbiBwYXJhbWV0ZXJzIGZvciBsYXRlciB1c2FnZVxuXHRcdGNvbnN0IG9OYXZpZ2F0aW9uSW5mbyA9IHtcblx0XHRcdG9Bc3luY0NvbnRleHQ6IG1QYXJhbWV0ZXJzPy5hc3luY0NvbnRleHQsXG5cdFx0XHRiRGVmZXJyZWRDb250ZXh0OiBtUGFyYW1ldGVycz8uYkRlZmVycmVkQ29udGV4dCxcblx0XHRcdGJUYXJnZXRFZGl0YWJsZTogbVBhcmFtZXRlcnM/LmVkaXRhYmxlLFxuXHRcdFx0YlBlcnNpc3RPUFNjcm9sbDogbVBhcmFtZXRlcnM/LmJQZXJzaXN0T1BTY3JvbGwsXG5cdFx0XHR1c2VDb250ZXh0OiBtUGFyYW1ldGVycz8udXBkYXRlRkNMTGV2ZWwgPT09IC0xIHx8IG1QYXJhbWV0ZXJzPy5iUmVjcmVhdGVDb250ZXh0ID8gdW5kZWZpbmVkIDogb0NvbnRleHQsXG5cdFx0XHRiRHJhZnROYXZpZ2F0aW9uOiBtUGFyYW1ldGVycz8uYkRyYWZ0TmF2aWdhdGlvbixcblx0XHRcdGJTaG93UGxhY2Vob2xkZXI6IG1QYXJhbWV0ZXJzPy5zaG93UGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCA/IG1QYXJhbWV0ZXJzPy5zaG93UGxhY2Vob2xkZXIgOiB0cnVlXG5cdFx0fTtcblxuXHRcdGlmIChtUGFyYW1ldGVycz8uY2hlY2tOb0hhc2hDaGFuZ2UpIHtcblx0XHRcdC8vIENoZWNrIGlmIHRoZSBuZXcgaGFzaCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBvbmVcblx0XHRcdGNvbnN0IHNDdXJyZW50SGFzaE5vQXBwU3RhdGUgPSB0aGlzLm9Sb3V0ZXJQcm94eS5nZXRIYXNoKCkucmVwbGFjZSgvWyY/XXsxfXNhcC1pYXBwLXN0YXRlPVtBLVowLTldKy8sIFwiXCIpO1xuXHRcdFx0aWYgKHNUYXJnZXRQYXRoID09PSBzQ3VycmVudEhhc2hOb0FwcFN0YXRlKSB7XG5cdFx0XHRcdC8vIFRoZSBoYXNoIGRvZXNuJ3QgY2hhbmdlLCBidXQgd2UgZmlyZSB0aGUgcm91dGVNYXRjaCBldmVudCB0byB0cmlnZ2VyIHBhZ2UgcmVmcmVzaCAvIGJpbmRpbmdcblx0XHRcdFx0Y29uc3QgbUV2ZW50UGFyYW1ldGVyczogYW55ID0gdGhpcy5vUm91dGVyLmdldFJvdXRlSW5mb0J5SGFzaCh0aGlzLm9Sb3V0ZXJQcm94eS5nZXRIYXNoKCkpO1xuXHRcdFx0XHRpZiAobUV2ZW50UGFyYW1ldGVycykge1xuXHRcdFx0XHRcdG1FdmVudFBhcmFtZXRlcnMubmF2aWdhdGlvbkluZm8gPSBvTmF2aWdhdGlvbkluZm87XG5cdFx0XHRcdFx0bUV2ZW50UGFyYW1ldGVycy5yb3V0ZUluZm9ybWF0aW9uID0gdGhpcy5fZ2V0Um91dGVJbmZvcm1hdGlvbih0aGlzLnNDdXJyZW50Um91dGVOYW1lKTtcblx0XHRcdFx0XHRtRXZlbnRQYXJhbWV0ZXJzLnJvdXRlUGF0dGVybiA9IHRoaXMuc0N1cnJlbnRSb3V0ZVBhdHRlcm47XG5cdFx0XHRcdFx0bUV2ZW50UGFyYW1ldGVycy52aWV3cyA9IHRoaXMuYUN1cnJlbnRWaWV3cztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMub1JvdXRlclByb3h5LnNldEZvY3VzRm9yY2VkKCEhbVBhcmFtZXRlcnMuYkZvcmNlRm9jdXMpO1xuXG5cdFx0XHRcdHRoaXMuX2ZpcmVSb3V0ZU1hdGNoRXZlbnRzKG1FdmVudFBhcmFtZXRlcnMpO1xuXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKG1QYXJhbWV0ZXJzPy50cmFuc2llbnQgJiYgbVBhcmFtZXRlcnMuZWRpdGFibGUgPT0gdHJ1ZSAmJiBzVGFyZ2V0UGF0aC5pbmRleE9mKFwiKC4uLilcIikgPT09IC0xKSB7XG5cdFx0XHRpZiAoc1RhcmdldFBhdGguaW5kZXhPZihcIj9cIikgPiAtMSkge1xuXHRcdFx0XHRzVGFyZ2V0UGF0aCArPSBcIiZpLWFjdGlvbj1jcmVhdGVcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNUYXJnZXRQYXRoICs9IFwiP2ktYWN0aW9uPWNyZWF0ZVwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENsZWFyIHVuYm91bmQgbWVzc2FnZXMgdXBvbiBuYXZpZ2F0aW5nIGZyb20gTFIgdG8gT1Bcblx0XHQvLyBUaGlzIGlzIHRvIGVuc3VyZSBzdGFsZSBlcnJvciBtZXNzYWdlcyBmcm9tIExSIGFyZSBub3Qgc2hvd24gdG8gdGhlIHVzZXIgYWZ0ZXIgbmF2aWdhdGlvbiB0byBPUC5cblx0XHRpZiAob0N1cnJlbnRUYXJnZXRJbmZvICYmIG9DdXJyZW50VGFyZ2V0SW5mby5uYW1lID09PSBcInNhcC5mZS50ZW1wbGF0ZXMuTGlzdFJlcG9ydFwiKSB7XG5cdFx0XHRjb25zdCBvUm91dGVJbmZvID0gdGhpcy5vUm91dGVyLmdldFJvdXRlSW5mb0J5SGFzaChzVGFyZ2V0UGF0aCk7XG5cdFx0XHRpZiAob1JvdXRlSW5mbykge1xuXHRcdFx0XHRjb25zdCBvUm91dGUgPSB0aGlzLl9nZXRSb3V0ZUluZm9ybWF0aW9uKG9Sb3V0ZUluZm8ubmFtZSk7XG5cdFx0XHRcdGlmIChvUm91dGUgJiYgb1JvdXRlLnRhcmdldHMgJiYgb1JvdXRlLnRhcmdldHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGNvbnN0IHNMYXN0VGFyZ2V0TmFtZSA9IG9Sb3V0ZS50YXJnZXRzW29Sb3V0ZS50YXJnZXRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdGNvbnN0IG9UYXJnZXQgPSB0aGlzLl9nZXRUYXJnZXRJbmZvcm1hdGlvbihzTGFzdFRhcmdldE5hbWUpO1xuXHRcdFx0XHRcdGlmIChvVGFyZ2V0ICYmIG9UYXJnZXQubmFtZSA9PT0gXCJzYXAuZmUudGVtcGxhdGVzLk9iamVjdFBhZ2VcIikge1xuXHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsaW5nLnJlbW92ZVVuYm91bmRUcmFuc2l0aW9uTWVzc2FnZXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBZGQgdGhlIG5hdmlnYXRpb24gcGFyYW1ldGVycyBpbiB0aGUgcXVldWVcblx0XHR0aGlzLm5hdmlnYXRpb25JbmZvUXVldWUucHVzaChvTmF2aWdhdGlvbkluZm8pO1xuXG5cdFx0aWYgKHNUYXJnZXRSb3V0ZSAmJiBvUm91dGVQYXJhbWV0ZXJzUHJvbWlzZSkge1xuXHRcdFx0cmV0dXJuIG9Sb3V0ZVBhcmFtZXRlcnNQcm9taXNlLnRoZW4oKG9Sb3V0ZVBhcmFtZXRlcnM6IGFueSkgPT4ge1xuXHRcdFx0XHRvUm91dGVQYXJhbWV0ZXJzLmJJc1N0aWNreU1vZGUgPSBiSXNTdGlja3lNb2RlO1xuXHRcdFx0XHR0aGlzLm9Sb3V0ZXIubmF2VG8oc1RhcmdldFJvdXRlLCBvUm91dGVQYXJhbWV0ZXJzKTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5vUm91dGVyUHJveHlcblx0XHRcdC5uYXZUb0hhc2goc1RhcmdldFBhdGgsIGZhbHNlLCBtUGFyYW1ldGVycz8ubm9QcmVzZXJ2YXRpb25DYWNoZSwgbVBhcmFtZXRlcnM/LmJGb3JjZUZvY3VzLCAhYklzU3RpY2t5TW9kZSlcblx0XHRcdC50aGVuKChiTmF2aWdhdGVkOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKCFiTmF2aWdhdGVkKSB7XG5cdFx0XHRcdFx0Ly8gVGhlIG5hdmlnYXRpb24gZGlkIG5vdCBoYXBwZW4gLS0+IHJlbW92ZSB0aGUgbmF2aWdhdGlvbiBwYXJhbWV0ZXJzIGZyb20gdGhlIHF1ZXVlIGFzIHRoZXkgc2hvdWxkbid0IGJlIHVzZWRcblx0XHRcdFx0XHR0aGlzLm5hdmlnYXRpb25JbmZvUXVldWUucG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGJOYXZpZ2F0ZWQ7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gYSByb3V0ZS5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlJvdXRpbmcjbmF2aWdhdGVUb1JvdXRlXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5Sb3V0aW5nXG5cdCAqIEBzdGF0aWNcblx0ICogQHBhcmFtIHNUYXJnZXRSb3V0ZU5hbWUgTmFtZSBvZiB0aGUgdGFyZ2V0IHJvdXRlXG5cdCAqIEBwYXJhbSBbb1JvdXRlUGFyYW1ldGVyc10gUGFyYW1ldGVycyB0byBiZSB1c2VkIHdpdGggcm91dGUgdG8gY3JlYXRlIHRoZSB0YXJnZXQgaGFzaFxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgbmF2aWdhdGlvbiBpcyBmaW5hbGl6ZWRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0bmF2aWdhdGVUb1JvdXRlKHNUYXJnZXRSb3V0ZU5hbWU6IHN0cmluZywgb1JvdXRlUGFyYW1ldGVycz86IGFueSkge1xuXHRcdGNvbnN0IHNUYXJnZXRVUkwgPSB0aGlzLm9Sb3V0ZXIuZ2V0VVJMKHNUYXJnZXRSb3V0ZU5hbWUsIG9Sb3V0ZVBhcmFtZXRlcnMpO1xuXHRcdHJldHVybiB0aGlzLm9Sb3V0ZXJQcm94eS5uYXZUb0hhc2goc1RhcmdldFVSTCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgIW9Sb3V0ZVBhcmFtZXRlcnMuYklzU3RpY2t5TW9kZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIG9uZSBvZiB0aGUgY3VycmVudCB2aWV3cyBvbiB0aGUgc2NyZWVuIGlzIGJvdW5kIHRvIGEgZ2l2ZW4gY29udGV4dC5cblx0ICpcblx0ICogQHBhcmFtIG9Db250ZXh0IFRoZSBjb250ZXh0XG5cdCAqIEByZXR1cm5zIGB0cnVlYCBvciBgZmFsc2VgIGlmIHRoZSBjdXJyZW50IHN0YXRlIGlzIGltcGFjdGVkIG9yIG5vdFxuXHQgKi9cblx0aXNDdXJyZW50U3RhdGVJbXBhY3RlZEJ5KG9Db250ZXh0OiBhbnkpIHtcblx0XHRjb25zdCBzUGF0aCA9IG9Db250ZXh0LmdldFBhdGgoKTtcblxuXHRcdC8vIEZpcnN0LCBjaGVjayB3aXRoIHRoZSB0ZWNobmljYWwgcGF0aC4gV2UgaGF2ZSB0byB0cnkgaXQsIGJlY2F1c2UgZm9yIGxldmVsID4gMSwgd2Vcblx0XHQvLyB1c2VzIHRlY2huaWNhbCBrZXlzIGV2ZW4gaWYgU2VtYW50aWMga2V5cyBhcmUgZW5hYmxlZFxuXHRcdGlmICh0aGlzLm9Sb3V0ZXJQcm94eS5pc0N1cnJlbnRTdGF0ZUltcGFjdGVkQnkoc1BhdGgpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKC9eW15cXChcXCldK1xcKFteXFwoXFwpXStcXCkkLy50ZXN0KHNQYXRoKSkge1xuXHRcdFx0Ly8gSWYgdGhlIGN1cnJlbnQgcGF0aCBjYW4gYmUgc2VtYW50aWMgKGkuZS4gaXMgbGlrZSB4eHgoeXl5KSlcblx0XHRcdC8vIGNoZWNrIHdpdGggdGhlIHNlbWFudGljIHBhdGggaWYgd2UgY2FuIGZpbmQgaXRcblx0XHRcdGxldCBzU2VtYW50aWNQYXRoO1xuXHRcdFx0aWYgKHRoaXMub0xhc3RTZW1hbnRpY01hcHBpbmcgJiYgdGhpcy5vTGFzdFNlbWFudGljTWFwcGluZy50ZWNobmljYWxQYXRoID09PSBzUGF0aCkge1xuXHRcdFx0XHQvLyBXZSBoYXZlIGFscmVhZHkgcmVzb2x2ZWQgdGhpcyBzZW1hbnRpYyBwYXRoXG5cdFx0XHRcdHNTZW1hbnRpY1BhdGggPSB0aGlzLm9MYXN0U2VtYW50aWNNYXBwaW5nLnNlbWFudGljUGF0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNTZW1hbnRpY1BhdGggPSBTZW1hbnRpY0tleUhlbHBlci5nZXRTZW1hbnRpY1BhdGgob0NvbnRleHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc1NlbWFudGljUGF0aCAhPSBzUGF0aCA/IHRoaXMub1JvdXRlclByb3h5LmlzQ3VycmVudFN0YXRlSW1wYWN0ZWRCeShzU2VtYW50aWNQYXRoKSA6IGZhbHNlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0X2ZpbmRQYXRoVG9OYXZpZ2F0ZShzUGF0aDogYW55KTogc3RyaW5nIHtcblx0XHRjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCIvW14vXSokXCIpO1xuXHRcdHNQYXRoID0gc1BhdGgucmVwbGFjZShyZWdleCwgXCJcIik7XG5cdFx0aWYgKHRoaXMub1JvdXRlci5tYXRjaChzUGF0aCkgfHwgc1BhdGggPT09IFwiXCIpIHtcblx0XHRcdHJldHVybiBzUGF0aDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ZpbmRQYXRoVG9OYXZpZ2F0ZShzUGF0aCk7XG5cdFx0fVxuXHR9XG5cblx0X2NoZWNrSWZDb250ZXh0U3VwcG9ydHNTZW1hbnRpY1BhdGgob0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRjb25zdCBzUGF0aCA9IG9Db250ZXh0LmdldFBhdGgoKTtcblxuXHRcdC8vIEZpcnN0LCBjaGVjayBpZiB0aGlzIGlzIGEgbGV2ZWwtMSBvYmplY3QgKHBhdGggPSAvYWFhKGJiYikpXG5cdFx0aWYgKCEvXlxcL1teXFwoXStcXChbXlxcKV0rXFwpJC8udGVzdChzUGF0aCkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBUaGVuIGNoZWNrIGlmIHRoZSBlbnRpdHkgaGFzIHNlbWFudGljIGtleXNcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbDtcblx0XHRjb25zdCBzRW50aXR5U2V0TmFtZSA9IG9NZXRhTW9kZWwuZ2V0TWV0YUNvbnRleHQob0NvbnRleHQuZ2V0UGF0aCgpKS5nZXRPYmplY3QoXCJAc2FwdWkubmFtZVwiKSBhcyBhbnkgYXMgc3RyaW5nO1xuXHRcdGlmICghU2VtYW50aWNLZXlIZWxwZXIuZ2V0U2VtYW50aWNLZXlzKG9NZXRhTW9kZWwsIHNFbnRpdHlTZXROYW1lKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIFRoZW4gY2hlY2sgdGhlIGVudGl0eSBpcyBkcmFmdC1lbmFibGVkXG5cdFx0cmV0dXJuIE1vZGVsSGVscGVyLmlzRHJhZnRTdXBwb3J0ZWQob01ldGFNb2RlbCwgc1BhdGgpO1xuXHR9XG5cblx0X2dldFBhdGhGcm9tQ29udGV4dChvQ29udGV4dDogYW55LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdFx0bGV0IHNQYXRoO1xuXG5cdFx0aWYgKG9Db250ZXh0LmlzQShcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXCIpICYmIG9Db250ZXh0LmlzUmVsYXRpdmUoKSkge1xuXHRcdFx0c1BhdGggPSBvQ29udGV4dC5nZXRIZWFkZXJDb250ZXh0KCkuZ2V0UGF0aCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzUGF0aCA9IG9Db250ZXh0LmdldFBhdGgoKTtcblx0XHR9XG5cblx0XHRpZiAobVBhcmFtZXRlcnMudXBkYXRlRkNMTGV2ZWwgPT09IC0xKSB7XG5cdFx0XHQvLyBXaGVuIG5hdmlnYXRpbmcgYmFjayBmcm9tIGEgY29udGV4dCwgd2UgbmVlZCB0byByZW1vdmUgdGhlIGxhc3QgY29tcG9uZW50IG9mIHRoZSBwYXRoXG5cdFx0XHRzUGF0aCA9IHRoaXMuX2ZpbmRQYXRoVG9OYXZpZ2F0ZShzUGF0aCk7XG5cblx0XHRcdC8vIENoZWNrIGlmIHdlJ3JlIG5hdmlnYXRpbmcgYmFjayB0byBhIHNlbWFudGljIHBhdGggdGhhdCB3YXMgcHJldmlvdXNseSByZXNvbHZlZFxuXHRcdFx0aWYgKHRoaXMub0xhc3RTZW1hbnRpY01hcHBpbmcgJiYgdGhpcy5vTGFzdFNlbWFudGljTWFwcGluZy50ZWNobmljYWxQYXRoID09PSBzUGF0aCkge1xuXHRcdFx0XHRzUGF0aCA9IHRoaXMub0xhc3RTZW1hbnRpY01hcHBpbmcuc2VtYW50aWNQYXRoO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGhpcy5fY2hlY2tJZkNvbnRleHRTdXBwb3J0c1NlbWFudGljUGF0aChvQ29udGV4dCkpIHtcblx0XHRcdC8vIFdlIGNoZWNrIGlmIHdlIGhhdmUgdG8gdXNlIGEgc2VtYW50aWMgcGF0aFxuXHRcdFx0Y29uc3Qgc1NlbWFudGljUGF0aCA9IFNlbWFudGljS2V5SGVscGVyLmdldFNlbWFudGljUGF0aChvQ29udGV4dCwgdHJ1ZSk7XG5cblx0XHRcdGlmICghc1NlbWFudGljUGF0aCkge1xuXHRcdFx0XHQvLyBXZSB3ZXJlIG5vdCBhYmxlIHRvIGJ1aWxkIHRoZSBzZW1hbnRpYyBwYXRoIC0tPiBVc2UgdGhlIHRlY2huaWNhbCBwYXRoIGFuZFxuXHRcdFx0XHQvLyBjbGVhciB0aGUgcHJldmlvdXMgbWFwcGluZywgb3RoZXJ3aXNlIHRoZSBvbGQgbWFwcGluZyBpcyB1c2VkIGluIEVkaXRGbG93I3VwZGF0ZURvY3VtZW50XG5cdFx0XHRcdC8vIGFuZCBpdCBsZWFkcyB0byB1bndhbnRlZCBwYWdlIHJlbG9hZHNcblx0XHRcdFx0dGhpcy5zZXRMYXN0U2VtYW50aWNNYXBwaW5nKHVuZGVmaW5lZCk7XG5cdFx0XHR9IGVsc2UgaWYgKHNTZW1hbnRpY1BhdGggIT09IHNQYXRoKSB7XG5cdFx0XHRcdC8vIFN0b3JlIHRoZSBtYXBwaW5nIHRlY2huaWNhbCA8LT4gc2VtYW50aWMgcGF0aCB0byBhdm9pZCByZWNhbGN1bGF0aW5nIGl0IGxhdGVyXG5cdFx0XHRcdC8vIGFuZCB1c2UgdGhlIHNlbWFudGljIHBhdGggaW5zdGVhZCBvZiB0aGUgdGVjaG5pY2FsIG9uZVxuXHRcdFx0XHR0aGlzLnNldExhc3RTZW1hbnRpY01hcHBpbmcoeyB0ZWNobmljYWxQYXRoOiBzUGF0aCwgc2VtYW50aWNQYXRoOiBzU2VtYW50aWNQYXRoIH0pO1xuXHRcdFx0XHRzUGF0aCA9IHNTZW1hbnRpY1BhdGg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gcmVtb3ZlIGV4dHJhICcvJyBhdCB0aGUgYmVnaW5uaW5nIG9mIHBhdGhcblx0XHRpZiAoc1BhdGhbMF0gPT09IFwiL1wiKSB7XG5cdFx0XHRzUGF0aCA9IHNQYXRoLnN1YnN0cmluZygxKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc1BhdGg7XG5cdH1cblxuXHRfY2FsY3VsYXRlTGF5b3V0KHNQYXRoOiBhbnksIG1QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRsZXQgRkNMTGV2ZWwgPSBtUGFyYW1ldGVycy5GQ0xMZXZlbDtcblx0XHRpZiAobVBhcmFtZXRlcnMudXBkYXRlRkNMTGV2ZWwpIHtcblx0XHRcdEZDTExldmVsICs9IG1QYXJhbWV0ZXJzLnVwZGF0ZUZDTExldmVsO1xuXHRcdFx0aWYgKEZDTExldmVsIDwgMCkge1xuXHRcdFx0XHRGQ0xMZXZlbCA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuICh0aGlzLm9BcHBDb21wb25lbnQuZ2V0Um9vdFZpZXdDb250cm9sbGVyKCkgYXMgYW55KS5jYWxjdWxhdGVMYXlvdXQoXG5cdFx0XHRGQ0xMZXZlbCxcblx0XHRcdHNQYXRoLFxuXHRcdFx0bVBhcmFtZXRlcnMuc0xheW91dCxcblx0XHRcdG1QYXJhbWV0ZXJzLmtlZXBDdXJyZW50TGF5b3V0XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFdmVudCBoYW5kbGVyIGJlZm9yZSBhIHJvdXRlIGlzIG1hdGNoZWQuXG5cdCAqIERpc3BsYXlzIGEgYnVzeSBpbmRpY2F0b3IuXG5cdCAqXG5cdCAqL1xuXHRfYmVmb3JlUm91dGVNYXRjaGVkKC8qb0V2ZW50OiBFdmVudCovKSB7XG5cdFx0Y29uc3QgYlBsYWNlaG9sZGVyRW5hYmxlZCA9IG5ldyBQbGFjZWhvbGRlcigpLmlzUGxhY2Vob2xkZXJFbmFibGVkKCk7XG5cdFx0aWYgKCFiUGxhY2Vob2xkZXJFbmFibGVkKSB7XG5cdFx0XHRjb25zdCBvUm9vdFZpZXcgPSB0aGlzLm9BcHBDb21wb25lbnQuZ2V0Um9vdENvbnRyb2woKTtcblx0XHRcdEJ1c3lMb2NrZXIubG9jayhvUm9vdFZpZXcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBFdmVudCBoYW5kbGVyIHdoZW4gYSByb3V0ZSBpcyBtYXRjaGVkLlxuXHQgKiBIaWRlcyB0aGUgYnVzeSBpbmRpY2F0b3IgYW5kIGZpcmVzIGl0cyBvd24gJ3JvdXRlbWF0Y2hlZCcgZXZlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRXZlbnQgVGhlIGV2ZW50XG5cdCAqL1xuXHRfb25Sb3V0ZU1hdGNoZWQob0V2ZW50OiBFdmVudCkge1xuXHRcdGNvbnN0IG9BcHBTdGF0ZUhhbmRsZXIgPSB0aGlzLm9BcHBDb21wb25lbnQuZ2V0QXBwU3RhdGVIYW5kbGVyKCksXG5cdFx0XHRvUm9vdFZpZXcgPSB0aGlzLm9BcHBDb21wb25lbnQuZ2V0Um9vdENvbnRyb2woKTtcblx0XHRjb25zdCBiUGxhY2Vob2xkZXJFbmFibGVkID0gbmV3IFBsYWNlaG9sZGVyKCkuaXNQbGFjZWhvbGRlckVuYWJsZWQoKTtcblx0XHRpZiAoQnVzeUxvY2tlci5pc0xvY2tlZChvUm9vdFZpZXcpICYmICFiUGxhY2Vob2xkZXJFbmFibGVkKSB7XG5cdFx0XHRCdXN5TG9ja2VyLnVubG9jayhvUm9vdFZpZXcpO1xuXHRcdH1cblx0XHRjb25zdCBtUGFyYW1ldGVyczogYW55ID0gb0V2ZW50LmdldFBhcmFtZXRlcnMoKTtcblx0XHRpZiAodGhpcy5uYXZpZ2F0aW9uSW5mb1F1ZXVlLmxlbmd0aCkge1xuXHRcdFx0bVBhcmFtZXRlcnMubmF2aWdhdGlvbkluZm8gPSB0aGlzLm5hdmlnYXRpb25JbmZvUXVldWVbMF07XG5cdFx0XHR0aGlzLm5hdmlnYXRpb25JbmZvUXVldWUgPSB0aGlzLm5hdmlnYXRpb25JbmZvUXVldWUuc2xpY2UoMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1QYXJhbWV0ZXJzLm5hdmlnYXRpb25JbmZvID0ge307XG5cdFx0fVxuXHRcdGlmIChvQXBwU3RhdGVIYW5kbGVyLmNoZWNrSWZSb3V0ZUNoYW5nZWRCeUlBcHAoKSkge1xuXHRcdFx0bVBhcmFtZXRlcnMubmF2aWdhdGlvbkluZm8uYlJlYXNvbklzSWFwcFN0YXRlID0gdHJ1ZTtcblx0XHRcdG9BcHBTdGF0ZUhhbmRsZXIucmVzZXRSb3V0ZUNoYW5nZWRCeUlBcHAoKTtcblx0XHR9XG5cblx0XHR0aGlzLnNDdXJyZW50Um91dGVOYW1lID0gb0V2ZW50LmdldFBhcmFtZXRlcihcIm5hbWVcIik7XG5cdFx0dGhpcy5zQ3VycmVudFJvdXRlUGF0dGVybiA9IG1QYXJhbWV0ZXJzLmNvbmZpZy5wYXR0ZXJuO1xuXHRcdHRoaXMuYUN1cnJlbnRWaWV3cyA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJ2aWV3c1wiKTtcblxuXHRcdG1QYXJhbWV0ZXJzLnJvdXRlSW5mb3JtYXRpb24gPSB0aGlzLl9nZXRSb3V0ZUluZm9ybWF0aW9uKHRoaXMuc0N1cnJlbnRSb3V0ZU5hbWUpO1xuXHRcdG1QYXJhbWV0ZXJzLnJvdXRlUGF0dGVybiA9IHRoaXMuc0N1cnJlbnRSb3V0ZVBhdHRlcm47XG5cblx0XHR0aGlzLl9maXJlUm91dGVNYXRjaEV2ZW50cyhtUGFyYW1ldGVycyk7XG5cblx0XHQvLyBDaGVjayBpZiBjdXJyZW50IGhhc2ggaGFzIGJlZW4gc2V0IGJ5IHRoZSByb3V0ZXJQcm94eS5uYXZUb0hhc2ggZnVuY3Rpb25cblx0XHQvLyBJZiBub3QsIHJlYnVpbGQgaGlzdG9yeSBwcm9wZXJseSAoYm90aCBpbiB0aGUgYnJvd3NlciBhbmQgdGhlIFJvdXRlclByb3h5KVxuXHRcdGlmICghaGlzdG9yeS5zdGF0ZSB8fCBoaXN0b3J5LnN0YXRlLmZlTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5vUm91dGVyUHJveHlcblx0XHRcdFx0LnJlc3RvcmVIaXN0b3J5KClcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMub1JvdXRlclByb3h5LnJlc29sdmVSb3V0ZU1hdGNoKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSByZXN0b3JpbmcgaGlzdG9yeVwiLCBvRXJyb3IpO1xuXHRcdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vUm91dGVyUHJveHkucmVzb2x2ZVJvdXRlTWF0Y2goKTtcblx0XHR9XG5cdH1cblxuXHRhdHRhY2hSb3V0ZU1hdGNoZWQob0RhdGE6IGFueSwgZm5GdW5jdGlvbj86IGFueSwgb0xpc3RlbmVyPzogYW55KSB7XG5cdFx0dGhpcy5ldmVudFByb3ZpZGVyLmF0dGFjaEV2ZW50KFwicm91dGVNYXRjaGVkXCIsIG9EYXRhLCBmbkZ1bmN0aW9uLCBvTGlzdGVuZXIpO1xuXHR9XG5cdGRldGFjaFJvdXRlTWF0Y2hlZChmbkZ1bmN0aW9uOiBhbnksIG9MaXN0ZW5lcj86IGFueSkge1xuXHRcdHRoaXMuZXZlbnRQcm92aWRlci5kZXRhY2hFdmVudChcInJvdXRlTWF0Y2hlZFwiLCBmbkZ1bmN0aW9uLCBvTGlzdGVuZXIpO1xuXHR9XG5cdGF0dGFjaEFmdGVyUm91dGVNYXRjaGVkKG9EYXRhOiBhbnksIGZuRnVuY3Rpb246IGFueSwgb0xpc3RlbmVyPzogYW55KSB7XG5cdFx0dGhpcy5ldmVudFByb3ZpZGVyLmF0dGFjaEV2ZW50KFwiYWZ0ZXJSb3V0ZU1hdGNoZWRcIiwgb0RhdGEsIGZuRnVuY3Rpb24sIG9MaXN0ZW5lcik7XG5cdH1cblx0ZGV0YWNoQWZ0ZXJSb3V0ZU1hdGNoZWQoZm5GdW5jdGlvbjogYW55LCBvTGlzdGVuZXI6IGFueSkge1xuXHRcdHRoaXMuZXZlbnRQcm92aWRlci5kZXRhY2hFdmVudChcImFmdGVyUm91dGVNYXRjaGVkXCIsIGZuRnVuY3Rpb24sIG9MaXN0ZW5lcik7XG5cdH1cblxuXHRnZXRSb3V0ZUZyb21IYXNoKG9Sb3V0ZXI6IGFueSwgb0FwcENvbXBvbmVudDogYW55KSB7XG5cdFx0Y29uc3Qgc0hhc2ggPSBvUm91dGVyLmdldEhhc2hDaGFuZ2VyKCkuaGFzaDtcblx0XHRjb25zdCBvUm91dGVJbmZvID0gb1JvdXRlci5nZXRSb3V0ZUluZm9CeUhhc2goc0hhc2gpO1xuXHRcdHJldHVybiBvQXBwQ29tcG9uZW50XG5cdFx0XHQuZ2V0TWV0YWRhdGEoKVxuXHRcdFx0LmdldE1hbmlmZXN0RW50cnkoXCIvc2FwLnVpNS9yb3V0aW5nL3JvdXRlc1wiKVxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbiAob1JvdXRlOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG9Sb3V0ZS5uYW1lID09PSBvUm91dGVJbmZvLm5hbWU7XG5cdFx0XHR9KVswXTtcblx0fVxuXHRnZXRUYXJnZXRzRnJvbVJvdXRlKG9Sb3V0ZTogYW55KSB7XG5cdFx0Y29uc3Qgb1RhcmdldCA9IG9Sb3V0ZS50YXJnZXQ7XG5cdFx0aWYgKHR5cGVvZiBvVGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRyZXR1cm4gW3RoaXMuX21UYXJnZXRzW29UYXJnZXRdXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgYVRhcmdldDogYW55W10gPSBbXTtcblx0XHRcdG9UYXJnZXQuZm9yRWFjaCgoc1RhcmdldDogYW55KSA9PiB7XG5cdFx0XHRcdGFUYXJnZXQucHVzaCh0aGlzLl9tVGFyZ2V0c1tzVGFyZ2V0XSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBhVGFyZ2V0O1xuXHRcdH1cblx0fVxuXG5cdGluaXRpYWxpemVSb3V0aW5nKCkge1xuXHRcdC8vIEF0dGFjaCByb3V0ZXIgaGFuZGxlcnNcblx0XHR0aGlzLl9mbk9uUm91dGVNYXRjaGVkID0gdGhpcy5fb25Sb3V0ZU1hdGNoZWQuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9Sb3V0ZXIuYXR0YWNoUm91dGVNYXRjaGVkKHRoaXMuX2ZuT25Sb3V0ZU1hdGNoZWQsIHRoaXMpO1xuXHRcdGNvbnN0IGJQbGFjZWhvbGRlckVuYWJsZWQgPSBuZXcgUGxhY2Vob2xkZXIoKS5pc1BsYWNlaG9sZGVyRW5hYmxlZCgpO1xuXHRcdGlmICghYlBsYWNlaG9sZGVyRW5hYmxlZCkge1xuXHRcdFx0dGhpcy5vUm91dGVyLmF0dGFjaEJlZm9yZVJvdXRlTWF0Y2hlZCh0aGlzLl9iZWZvcmVSb3V0ZU1hdGNoZWQuYmluZCh0aGlzKSk7XG5cdFx0fVxuXHRcdC8vIFJlc2V0IGludGVybmFsIHN0YXRlXG5cdFx0dGhpcy5uYXZpZ2F0aW9uSW5mb1F1ZXVlID0gW107XG5cdFx0RWRpdFN0YXRlLnJlc2V0RWRpdFN0YXRlKCk7XG5cdFx0dGhpcy5iRXhpdE9uTmF2aWdhdGVCYWNrVG9Sb290ID0gIXRoaXMub1JvdXRlci5tYXRjaChcIlwiKTtcblxuXHRcdGNvbnN0IGJJc0lhcHBTdGF0ZSA9IHRoaXMub1JvdXRlci5nZXRIYXNoQ2hhbmdlcigpLmdldEhhc2goKS5pbmRleE9mKFwic2FwLWlhcHAtc3RhdGVcIikgIT09IC0xO1xuXHRcdHJldHVybiB0aGlzLm9BcHBDb21wb25lbnRcblx0XHRcdC5nZXRTdGFydHVwUGFyYW1ldGVycygpXG5cdFx0XHQudGhlbigob1N0YXJ0dXBQYXJhbWV0ZXJzOiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3QgYkhhc1N0YXJ0VXBQYXJhbWV0ZXJzID0gb1N0YXJ0dXBQYXJhbWV0ZXJzICE9PSB1bmRlZmluZWQgJiYgT2JqZWN0LmtleXMob1N0YXJ0dXBQYXJhbWV0ZXJzKS5sZW5ndGggIT09IDA7XG5cdFx0XHRcdGNvbnN0IHNIYXNoID0gdGhpcy5vUm91dGVyLmdldEhhc2hDaGFuZ2VyKCkuZ2V0SGFzaCgpO1xuXHRcdFx0XHQvLyBNYW5hZ2Ugc3RhcnR1cCBwYXJhbWV0ZXJzIChpbiBjYXNlIG9mIG5vIGlhcHAtc3RhdGUpXG5cdFx0XHRcdGlmICghYklzSWFwcFN0YXRlICYmIGJIYXNTdGFydFVwUGFyYW1ldGVycyAmJiAhc0hhc2gpIHtcblx0XHRcdFx0XHRpZiAob1N0YXJ0dXBQYXJhbWV0ZXJzLnByZWZlcnJlZE1vZGUgJiYgb1N0YXJ0dXBQYXJhbWV0ZXJzLnByZWZlcnJlZE1vZGVbMF0udG9VcHBlckNhc2UoKS5pbmRleE9mKFwiQ1JFQVRFXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIG1vZGVcblx0XHRcdFx0XHRcdC8vIFRoaXMgY2hlY2sgd2lsbCBjYXRjaCBtdWx0aXBsZSBtb2RlcyBsaWtlIGNyZWF0ZSwgY3JlYXRlV2l0aCBhbmQgYXV0b0NyZWF0ZVdpdGggd2hpY2ggYWxsIG5lZWRcblx0XHRcdFx0XHRcdC8vIHRvIGJlIGhhbmRsZWQgbGlrZSBjcmVhdGUgc3RhcnR1cCFcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9tYW5hZ2VDcmVhdGVTdGFydHVwKG9TdGFydHVwUGFyYW1ldGVycyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIERlZXAgbGlua1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuX21hbmFnZURlZXBMaW5rU3RhcnR1cChvU3RhcnR1cFBhcmFtZXRlcnMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3IgZHVyaW5nIHJvdXRpbmcgaW5pdGlhbGl6YXRpb25cIiwgb0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0Z2V0RGVmYXVsdENyZWF0ZUhhc2gob1N0YXJ0dXBQYXJhbWV0ZXJzPzogYW55KSB7XG5cdFx0cmV0dXJuIEFwcFN0YXJ0dXBIZWxwZXIuZ2V0RGVmYXVsdENyZWF0ZUhhc2gob1N0YXJ0dXBQYXJhbWV0ZXJzLCB0aGlzLmdldENvbnRleHRQYXRoKCksIHRoaXMub1JvdXRlcik7XG5cdH1cblxuXHRfbWFuYWdlQ3JlYXRlU3RhcnR1cChvU3RhcnR1cFBhcmFtZXRlcnM6IGFueSkge1xuXHRcdHJldHVybiBBcHBTdGFydHVwSGVscGVyLmdldENyZWF0ZVN0YXJ0dXBIYXNoKG9TdGFydHVwUGFyYW1ldGVycywgdGhpcy5nZXRDb250ZXh0UGF0aCgpLCB0aGlzLm9Sb3V0ZXIsIHRoaXMub01ldGFNb2RlbCkudGhlbihcblx0XHRcdChzTmV3SGFzaDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChzTmV3SGFzaCkge1xuXHRcdFx0XHRcdCh0aGlzLm9Sb3V0ZXIuZ2V0SGFzaENoYW5nZXIoKS5yZXBsYWNlSGFzaCBhcyBhbnkpKHNOZXdIYXNoKTtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvU3RhcnR1cFBhcmFtZXRlcnM/LnByZWZlcnJlZE1vZGUgJiZcblx0XHRcdFx0XHRcdG9TdGFydHVwUGFyYW1ldGVycy5wcmVmZXJyZWRNb2RlWzBdLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihcIkFVVE9DUkVBVEVcIikgIT09IC0xXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLm9BcHBDb21wb25lbnQuc2V0U3RhcnR1cE1vZGVBdXRvQ3JlYXRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMub0FwcENvbXBvbmVudC5zZXRTdGFydHVwTW9kZUNyZWF0ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmJFeGl0T25OYXZpZ2F0ZUJhY2tUb1Jvb3QgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdF9tYW5hZ2VEZWVwTGlua1N0YXJ0dXAob1N0YXJ0dXBQYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRyZXR1cm4gQXBwU3RhcnR1cEhlbHBlci5nZXREZWVwTGlua1N0YXJ0dXBIYXNoKFxuXHRcdFx0KHRoaXMub0FwcENvbXBvbmVudC5nZXRNYW5pZmVzdCgpIGFzIGFueSlbXCJzYXAudWk1XCJdLnJvdXRpbmcsXG5cdFx0XHRvU3RhcnR1cFBhcmFtZXRlcnMsXG5cdFx0XHR0aGlzLm9Nb2RlbFxuXHRcdCkudGhlbigob0RlZXBMaW5rOiBhbnkpID0+IHtcblx0XHRcdGxldCBzSGFzaDtcblx0XHRcdGlmIChvRGVlcExpbmsuY29udGV4dCkge1xuXHRcdFx0XHRjb25zdCBzVGVjaG5pY2FsUGF0aCA9IG9EZWVwTGluay5jb250ZXh0LmdldFBhdGgoKTtcblx0XHRcdFx0Y29uc3Qgc1NlbWFudGljUGF0aCA9IHRoaXMuX2NoZWNrSWZDb250ZXh0U3VwcG9ydHNTZW1hbnRpY1BhdGgob0RlZXBMaW5rLmNvbnRleHQpXG5cdFx0XHRcdFx0PyBTZW1hbnRpY0tleUhlbHBlci5nZXRTZW1hbnRpY1BhdGgob0RlZXBMaW5rLmNvbnRleHQpXG5cdFx0XHRcdFx0OiBzVGVjaG5pY2FsUGF0aDtcblxuXHRcdFx0XHRpZiAoc1NlbWFudGljUGF0aCAhPT0gc1RlY2huaWNhbFBhdGgpIHtcblx0XHRcdFx0XHQvLyBTdG9yZSB0aGUgbWFwcGluZyB0ZWNobmljYWwgPC0+IHNlbWFudGljIHBhdGggdG8gYXZvaWQgcmVjYWxjdWxhdGluZyBpdCBsYXRlclxuXHRcdFx0XHRcdC8vIGFuZCB1c2UgdGhlIHNlbWFudGljIHBhdGggaW5zdGVhZCBvZiB0aGUgdGVjaG5pY2FsIG9uZVxuXHRcdFx0XHRcdHRoaXMuc2V0TGFzdFNlbWFudGljTWFwcGluZyh7IHRlY2huaWNhbFBhdGg6IHNUZWNobmljYWxQYXRoLCBzZW1hbnRpY1BhdGg6IHNTZW1hbnRpY1BhdGggfSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzSGFzaCA9IHNTZW1hbnRpY1BhdGguc3Vic3RyaW5nKDEpOyAvLyBUbyByZW1vdmUgdGhlIGxlYWRpbmcgJy8nXG5cdFx0XHR9IGVsc2UgaWYgKG9EZWVwTGluay5oYXNoKSB7XG5cdFx0XHRcdHNIYXNoID0gb0RlZXBMaW5rLmhhc2g7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzSGFzaCkge1xuXHRcdFx0XHQvL1JlcGxhY2UgdGhlIGhhc2ggd2l0aCBuZXdseSBjcmVhdGVkIGhhc2hcblx0XHRcdFx0KHRoaXMub1JvdXRlci5nZXRIYXNoQ2hhbmdlcigpLnJlcGxhY2VIYXNoIGFzIGFueSkoc0hhc2gpO1xuXHRcdFx0XHR0aGlzLm9BcHBDb21wb25lbnQuc2V0U3RhcnR1cE1vZGVEZWVwbGluaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0T3V0Ym91bmRzKCkge1xuXHRcdHJldHVybiB0aGlzLm91dGJvdW5kcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBEcmFmdCByb290IGVudGl0eSBzZXQgb3IgdGhlIHN0aWNreS1lbmFibGVkIGVudGl0eSBzZXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBuYW1lIG9mIHRoZSByb290IEVudGl0eVNldFxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdGdldENvbnRleHRQYXRoKCkge1xuXHRcdHJldHVybiB0aGlzLnNDb250ZXh0UGF0aDtcblx0fVxuXHRnZXRJbnRlcmZhY2UoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5jbGFzcyBSb3V0aW5nU2VydmljZUZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxSb3V0aW5nU2VydmljZVNldHRpbmdzPiB7XG5cdGNyZWF0ZUluc3RhbmNlKG9TZXJ2aWNlQ29udGV4dDogU2VydmljZUNvbnRleHQ8Um91dGluZ1NlcnZpY2VTZXR0aW5ncz4pIHtcblx0XHRjb25zdCBvUm91dGluZ1NlcnZpY2UgPSBuZXcgUm91dGluZ1NlcnZpY2Uob1NlcnZpY2VDb250ZXh0KTtcblx0XHRyZXR1cm4gb1JvdXRpbmdTZXJ2aWNlLmluaXRQcm9taXNlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJvdXRpbmdTZXJ2aWNlRmFjdG9yeTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXlCTUEsc0IsV0FETEMsY0FBYyxDQUFDLDZDQUFELEMsVUFFYkMsS0FBSyxFLFVBRUxBLEtBQUssRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFIOEJDLGE7Ozs7Ozs7Ozs7OztNQVd4QkMsYzs7Ozs7Ozs7Ozs7YUFnQlpDLG1CLEdBQTZCLEU7Ozs7Ozs7V0FHN0JDLEksR0FBQSxnQkFBTztNQUNOLElBQU1DLFFBQVEsR0FBRyxLQUFLQyxVQUFMLEVBQWpCOztNQUNBLElBQUlELFFBQVEsQ0FBQ0UsU0FBVCxLQUF1QixXQUEzQixFQUF3QztRQUN2QyxLQUFLQyxhQUFMLEdBQXFCSCxRQUFRLENBQUNJLFdBQTlCO1FBQ0EsS0FBS0MsTUFBTCxHQUFjLEtBQUtGLGFBQUwsQ0FBbUJHLFFBQW5CLEVBQWQ7UUFDQSxLQUFLQyxVQUFMLEdBQWtCLEtBQUtGLE1BQUwsQ0FBWUcsWUFBWixFQUFsQjtRQUNBLEtBQUtDLE9BQUwsR0FBZSxL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