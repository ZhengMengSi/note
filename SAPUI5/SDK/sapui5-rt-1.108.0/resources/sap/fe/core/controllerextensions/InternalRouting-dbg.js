/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/editFlow/draft", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/EditState", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/SemanticKeyHelper", "sap/ui/core/Component", "sap/ui/core/Core", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Log, CommonUtils, BusyLocker, draft, ClassSupport, EditState, ModelHelper, SemanticKeyHelper, Component, Core, ControllerExtension, OverrideExecution, Filter, FilterOperator) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var methodOverride = ClassSupport.methodOverride;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * {@link sap.ui.core.mvc.ControllerExtension Controller extension}
   *
   * @namespace
   * @alias sap.fe.core.controllerextensions.InternalRouting
   * @private
   * @since 1.74.0
   */
  var InternalRouting = (_dec = defineUI5Class("sap.fe.core.controllerextensions.InternalRouting"), _dec2 = methodOverride(), _dec3 = methodOverride(), _dec4 = publicExtension(), _dec5 = extensible(OverrideExecution.After), _dec6 = publicExtension(), _dec7 = extensible(OverrideExecution.After), _dec8 = publicExtension(), _dec9 = extensible(OverrideExecution.After), _dec10 = publicExtension(), _dec11 = extensible(OverrideExecution.After), _dec12 = publicExtension(), _dec13 = publicExtension(), _dec14 = publicExtension(), _dec15 = finalExtension(), _dec16 = publicExtension(), _dec17 = finalExtension(), _dec18 = publicExtension(), _dec19 = finalExtension(), _dec20 = publicExtension(), _dec21 = finalExtension(), _dec22 = publicExtension(), _dec23 = finalExtension(), _dec24 = publicExtension(), _dec25 = finalExtension(), _dec26 = publicExtension(), _dec27 = finalExtension(), _dec28 = publicExtension(), _dec29 = extensible(OverrideExecution.Before), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(InternalRouting, _ControllerExtension);

    function InternalRouting() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = InternalRouting.prototype;

    _proto.onExit = function onExit() {
      if (this._oRoutingService) {
        this._oRoutingService.detachRouteMatched(this._fnRouteMatchedBound);
      }
    };

    _proto.onInit = function onInit() {
      var _this = this;

      this._oView = this.base.getView();
      this._oAppComponent = CommonUtils.getAppComponent(this._oView);
      this._oPageComponent = Component.getOwnerComponentFor(this._oView);
      this._oRouter = this._oAppComponent.getRouter();
      this._oRouterProxy = this._oAppComponent.getRouterProxy();

      if (!this._oAppComponent || !this._oPageComponent) {
        throw new Error("Failed to initialize controler extension 'sap.fe.core.controllerextesions.InternalRouting");
      } // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore


      if (this._oAppComponent === this._oPageComponent) {
        // The view isn't hosted in a dedicated UIComponent, but directly in the app
        // --> just keep the view
        this._oPageComponent = null;
      }

      this._oAppComponent.getService("routingService").then(function (oRoutingService) {
        _this._oRoutingService = oRoutingService;
        _this._fnRouteMatchedBound = _this._onRouteMatched.bind(_this);

        _this._oRoutingService.attachRouteMatched(_this._fnRouteMatchedBound);

        _this._oTargetInformation = oRoutingService.getTargetInformationFor(_this._oPageComponent || _this._oView);
      }).catch(function () {
        throw new Error("This controller extension cannot work without a 'routingService' on the main AppComponent");
      });
    }
    /**
     * Triggered every time this controller is a navigation target.
     */
    ;

    _proto.onRouteMatched = function onRouteMatched() {
      /**/
    };

    _proto.onRouteMatchedFinished = function onRouteMatchedFinished() {
      /**/
    };

    _proto.onBeforeBinding = function onBeforeBinding(oBindingContext, mParameters) {
      var oRouting = this.base.getView().getController().routing;

      if (oRouting && oRouting.onBeforeBinding) {
        oRouting.onBeforeBinding(oBindingContext, mParameters);
      }
    };

    _proto.onAfterBinding = function onAfterBinding(oBindingContext, mParameters) {
      this._oAppComponent.getRootViewController().onContextBoundToView(oBindingContext);

      var oRouting = this.base.getView().getController().routing;

      if (oRouting && oRouting.onAfterBinding) {
        oRouting.onAfterBinding(oBindingContext, mParameters);
      }
    } ///////////////////////////////////////////////////////////
    // Methods triggering a navigation after a user action
    // (e.g. click on a table row, button, etc...)
    ///////////////////////////////////////////////////////////

    /**
     * Navigates to the specified navigation target.
     *
     * @param oContext Context instance
     * @param sNavigationTargetName Navigation target name
     * @param oSemanticObject Semantic object
     * @param bPreserveHistory True to force the new URL to be added at the end of the browser history (no replace)
     * @ui5-restricted
     */
    ;

    _proto.navigateToTarget = function navigateToTarget(oContext, sNavigationTargetName, oSemanticObject, bPreserveHistory) {
      var oNavigationConfiguration = this._oPageComponent && this._oPageComponent.getNavigationConfiguration && this._oPageComponent.getNavigationConfiguration(sNavigationTargetName);

      if (oNavigationConfiguration) {
        var oDetailRoute = oNavigationConfiguration.detail;
        var sRouteName = oDetailRoute.route;
        var mParameterMapping = oDetailRoute.parameters;

        this._oRoutingService.navigateTo(oContext, sRouteName, mParameterMapping, bPreserveHistory);
      } else {
        this._oRoutingService.navigateTo(oContext, null, null, bPreserveHistory);
      }

      this._oView.getViewData();
    }
    /**
     * Navigates to the specified navigation target route.
     *
     * @param sTargetRouteName Name of the target route
     * @param [oParameters] Parameters to be used with route to create the target hash
     * @returns Promise that is resolved when the navigation is finalized
     * @ui5-restricted
     */
    ;

    _proto.navigateToRoute = function navigateToRoute(sTargetRouteName, oParameters) {
      return this._oRoutingService.navigateToRoute(sTargetRouteName, oParameters);
    }
    /**
     * Navigates to a specific context.
     *
     * @param oContext The context to be navigated to
     * @param [mParameters] Optional navigation parameters
     * @returns Promise resolved when the navigation has been triggered
     * @ui5-restricted
     */
    ;

    _proto.navigateToContext = function navigateToContext(oContext, mParameters) {
      var _this2 = this;

      var oContextInfo = {};
      mParameters = mParameters || {};

      if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding")) {
        if (mParameters.asyncContext) {
          // the context is either created async (Promise)
          // We need to activate the routeMatchSynchro on the RouterProxy to avoid that
          // the subsequent call to navigateToContext conflicts with the current one
          this._oRouterProxy.activateRouteMatchSynchronization();

          mParameters.asyncContext.then(function (asyncContext) {
            // once the context is returned we navigate into it
            _this2.navigateToContext(asyncContext, {
              checkNoHashChange: mParameters.checkNoHashChange,
              editable: mParameters.editable,
              bPersistOPScroll: mParameters.bPersistOPScroll,
              updateFCLLevel: mParameters.updateFCLLevel,
              bForceFocus: mParameters.bForceFocus
            });
          }).catch(function (oError) {
            Log.error("Error with the async context", oError);
          });
        } else if (!mParameters.bDeferredContext) {
          // Navigate to a list binding not yet supported
          throw "navigation to a list binding is not yet supported";
        }
      }

      if (mParameters.callExtension) {
        var oInternalModel = this._oView.getModel("internal");

        oInternalModel.setProperty("/paginatorCurrentContext", null);
        oContextInfo.sourceBindingContext = oContext.getObject();
        oContextInfo.bindingContext = oContext;

        if (mParameters.oEvent) {
          oContextInfo.oEvent = mParameters.oEvent;
        } // Storing the selected context to use it in internal route navigation if neccessary.


        var bOverrideNav = this.base.getView().getController().routing.onBeforeNavigation(oContextInfo);

        if (bOverrideNav) {
          oInternalModel.setProperty("/paginatorCurrentContext", oContext);
          return Promise.resolve(true);
        }
      }

      mParameters.FCLLevel = this._getFCLLevel();
      return this._oRoutingService.navigateToContext(oContext, mParameters, this._oView.getViewData(), this._oTargetInformation);
    }
    /**
     * Navigates backwards from a context.
     *
     * @param oContext Context to be navigated from
     * @param [mParameters] Optional navigation parameters
     * @returns Promise resolved when the navigation has been triggered
     * @ui5-restricted
     */
    ;

    _proto.navigateBackFromContext = function navigateBackFromContext(oContext, mParameters) {
      mParameters = mParameters || {};
      mParameters.updateFCLLevel = -1;
      return this.navigateToContext(oContext, mParameters);
    }
    /**
     * Navigates forwards to a context.
     *
     * @param oContext Context to be navigated to
     * @param mParameters Optional navigation parameters
     * @returns Promise resolved when the navigation has been triggered
     * @ui5-restricted
     */
    ;

    _proto.navigateForwardToContext = function navigateForwardToContext(oContext, mParameters) {
      var _this$_oView$getBindi;

      if (((_this$_oView$getBindi = this._oView.getBindingContext("internal")) === null || _this$_oView$getBindi === void 0 ? void 0 : _this$_oView$getBindi.getProperty("messageFooterContainsErrors")) === true) {
        return Promise.resolve(true);
      }

      mParameters = mParameters || {};
      mParameters.updateFCLLevel = 1;
      return this.navigateToContext(oContext, mParameters);
    }
    /**
     * Navigates back in history if the current hash corresponds to a transient state.
     */
    ;

    _proto.navigateBackFromTransientState = function navigateBackFromTransientState() {
      var sHash = this._oRouterProxy.getHash(); // if triggered while navigating to (...), we need to navigate back


      if (sHash.indexOf("(...)") !== -1) {
        this._oRouterProxy.navBack();
      }
    };

    _proto.navigateToMessagePage = function navigateToMessagePage(sErrorMessage, mParameters) {
      mParameters = mParameters || {};

      if (this._oRouterProxy.getHash().indexOf("i-action=create") > -1 || this._oRouterProxy.getHash().indexOf("i-action=autoCreate") > -1) {
        return this._oRouterProxy.navToHash(this._oRoutingService.getDefaultCreateHash());
      } else {
        mParameters.FCLLevel = this._getFCLLevel();
        return this._oAppComponent.getRootViewController().displayMessagePage(sErrorMessage, mParameters);
      }
    }
    /**
     * Checks if one of the current views on the screen is bound to a given context.
     *
     * @param oContext
     * @returns `true` if the state is impacted by the context
     * @ui5-restricted
     */
    ;

    _proto.isCurrentStateImpactedBy = function isCurrentStateImpactedBy(oContext) {
      return this._oRoutingService.isCurrentStateImpactedBy(oContext);
    };

    _proto._isViewPartOfRoute = function _isViewPartOfRoute(routeInformation) {
      var aTargets = routeInformation === null || routeInformation === void 0 ? void 0 : routeInformation.targets;

      if (!aTargets || aTargets.indexOf(this._oTargetInformation.targetName) === -1) {
        var _this$_oTargetInforma, _routeInformation$rou;

        // If the target for this view has a view level greater than the route level, it means this view comes "after" the route
        // in terms of navigation.
        // In such case, we remove its binding context, to avoid this view to have data if we navigate to it later on
        if (((_this$_oTargetInforma = this._oTargetInformation.viewLevel) !== null && _this$_oTargetInforma !== void 0 ? _this$_oTargetInforma : 0) >= ((_routeInformation$rou = routeInformation === null || routeInformation === void 0 ? void 0 : routeInformation.routeLevel) !== null && _routeInformation$rou !== void 0 ? _routeInformation$rou : 0)) {
          this._setBindingContext(null); // This also call setKeepAlive(false) on the current context

        }

        return false;
      }

      return true;
    };

    _proto._buildBindingPath = function _buildBindingPath(routeArguments, bindingPattern, navigationParameters) {
      var path = bindingPattern.replace(":?query:", "");
      var deferred = false;

      for (var sKey in routeArguments) {
        var sValue = routeArguments[sKey];

        if (sValue === "..." && bindingPattern.indexOf("{".concat(sKey, "}")) >= 0) {
          deferred = true; // Sometimes in preferredMode = create, the edit button is shown in background when the
          // action parameter dialog shows up, setting bTargetEditable passes editable as true
          // to onBeforeBinding in _bindTargetPage function

          navigationParameters.bTargetEditable = true;
        }

        path = path.replace("{".concat(sKey, "}"), sValue);
      }

      if (routeArguments["?query"] && routeArguments["?query"].hasOwnProperty("i-action")) {
        navigationParameters.bActionCreate = true;
      } // the binding path is always absolute


      if (path && path[0] !== "/") {
        path = "/".concat(path);
      }

      return {
        path: path,
        deferred: deferred
      };
    } ///////////////////////////////////////////////////////////
    // Methods to bind the page when a route is matched
    ///////////////////////////////////////////////////////////

    /**
     * Called when a route is matched.
     * Builds the binding context from the navigation parameters, and bind the page accordingly.
     *
     * @param oEvent
     * @ui5-restricted
     */
    ;

    _proto._onRouteMatched = function _onRouteMatched(oEvent) {
      var _this3 = this;

      // Check if the target for this view is part of the event targets (i.e. is a target for the current route).
      // If not, we don't need to bind it --> return
      if (!this._isViewPartOfRoute(oEvent.getParameter("routeInformation"))) {
        return;
      } // Retrieve the binding context pattern


      var bindingPattern;

      if (this._oPageComponent && this._oPageComponent.getBindingContextPattern) {
        bindingPattern = this._oPageComponent.getBindingContextPattern();
      }

      bindingPattern = bindingPattern || this._oTargetInformation.contextPattern;

      if (bindingPattern === null || bindingPattern === undefined) {
        // Don't do this if we already got sTarget == '', which is a valid target pattern
        bindingPattern = oEvent.getParameter("routePattern");
      } // Replace the parameters by their values in the binding context pattern


      var mArguments = oEvent.getParameters().arguments;
      var oNavigationParameters = oEvent.getParameter("navigationInfo");

      var _this$_buildBindingPa = this._buildBindingPath(mArguments, bindingPattern, oNavigationParameters),
          path = _this$_buildBindingPa.path,
          deferred = _this$_buildBindingPa.deferred;

      this.onRouteMatched();

      var oModel = this._oView.getModel();

      var oOut;

      if (deferred) {
        oOut = this._bindDeferred(path, oNavigationParameters);
      } else {
        oOut = this._bindPage(path, oModel, oNavigationParameters);
      } // eslint-disable-next-line promise/catch-or-return


      oOut.finally(function () {
        _this3.onRouteMatchedFinished();
      });

      this._oAppComponent.getRootViewController().updateUIStateForView(this._oView, this._getFCLLevel());
    }
    /**
     * Deferred binding (during object creation).
     *
     * @param sTargetPath The path to the deffered context
     * @param oNavigationParameters Navigation parameters
     * @returns A Promise
     * @ui5-restricted
     */
    ;

    _proto._bindDeferred = function _bindDeferred(sTargetPath, oNavigationParameters) {
      this.onBeforeBinding(null, {
        editable: oNavigationParameters.bTargetEditable
      });

      if (oNavigationParameters.bDeferredContext || !oNavigationParameters.oAsyncContext) {
        // either the context shall be created in the target page (deferred Context) or it shall
        // be created async but the user refreshed the page / bookmarked this URL
        // TODO: currently the target component creates this document but we shall move this to
        // a central place
        if (this._oPageComponent && this._oPageComponent.createDeferredContext) {
          this._oPageComponent.createDeferredContext(sTargetPath, oNavigationParameters.useContext, oNavigationParameters.bActionCreate);
        }
      }

      var currentBindingContext = this._getBindingContext();

      if (currentBindingContext !== null && currentBindingContext !== void 0 && currentBindingContext.hasPendingChanges()) {
        // For now remove the pending changes to avoid the model raises errors and the object page is at least bound
        // Ideally the user should be asked for
        currentBindingContext.getBinding().resetChanges();
      } // remove the context to avoid showing old data


      this._setBindingContext(null);

      this.onAfterBinding(null);
      return Promise.resolve();
    }
    /**
     * Sets the binding context of the page from a path.
     *
     * @param sTargetPath The path to the context
     * @param oModel The OData model
     * @param oNavigationParameters Navigation parameters
     * @returns A Promise resolved once the binding has been set on the page
     * @ui5-restricted
     */
    ;

    _proto._bindPage = function _bindPage(sTargetPath, oModel, oNavigationParameters) {
      var _this4 = this;

      if (sTargetPath === "") {
        return Promise.resolve(this._bindPageToContext(null, oModel, oNavigationParameters));
      } else {
        return this._resolveSemanticPath(sTargetPath, oModel).then(function (sTechnicalPath) {
          _this4._bindPageToPath(sTechnicalPath, oModel, oNavigationParameters);
        }).catch(function (oError) {
          // Error handling for erroneous metadata request
          var oResourceBundle = Core.getLibraryResourceBundle("sap.fe.core");

          _this4.navigateToMessagePage(oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"), {
            title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
            description: oError.message
          });
        });
      }
    }
    /**
     * Creates the filter to retrieve a context corresponding to a semantic path.
     *
     * @param sSemanticPath The semantic path
     * @param aSemanticKeys The semantic keys for the path
     * @param oMetaModel The instance of the meta model
     * @returns The filter
     * @ui5-restricted
     */
    ;

    _proto._createFilterFromSemanticPath = function _createFilterFromSemanticPath(sSemanticPath, aSemanticKeys, oMetaModel) {
      var fnUnquoteAndDecode = function (sValue) {
        if (sValue.indexOf("'") === 0 && sValue.lastIndexOf("'") === sValue.length - 1) {
          // Remove the quotes from the value and decode special chars
          sValue = decodeURIComponent(sValue.substring(1, sValue.length - 1));
        }

        return sValue;
      };

      var aKeyValues = sSemanticPath.substring(sSemanticPath.indexOf("(") + 1, sSemanticPath.length - 1).split(",");
      var aFilters;

      if (aSemanticKeys.length != aKeyValues.length) {
        return null;
      }

      var bFilteringCaseSensitive = ModelHelper.isFilteringCaseSensitive(oMetaModel);

      if (aSemanticKeys.length === 1) {
        // Take the first key value
        var sKeyValue = fnUnquoteAndDecode(aKeyValues[0]);
        aFilters = [new Filter({
          path: aSemanticKeys[0].$PropertyPath,
          operator: FilterOperator.EQ,
          value1: sKeyValue,
          caseSensitive: bFilteringCaseSensitive
        })];
      } else {
        var mKeyValues = {}; // Create a map of all key values

        aKeyValues.forEach(function (sKeyAssignment) {
          var aParts = sKeyAssignment.split("="),
              sKeyValue = fnUnquoteAndDecode(aParts[1]);
          mKeyValues[aParts[0]] = sKeyValue;
        });
        var bFailed = false;
        aFilters = aSemanticKeys.map(function (oSemanticKey) {
          var sKey = oSemanticKey.$PropertyPath,
              sValue = mKeyValues[sKey];

          if (sValue !== undefined) {
            return new Filter({
              path: sKey,
              operator: FilterOperator.EQ,
              value1: sValue,
              caseSensitive: bFilteringCaseSensitive
            });
          } else {
            bFailed = true;
            return new Filter({
              path: "XX"
            }); // will be ignore anyway since we return after
          }
        });

        if (bFailed) {
          return null;
        }
      } // Add a draft filter to make sure we take the draft entity if there is one
      // Or the active entity otherwise


      var oDraftFilter = new Filter({
        filters: [new Filter("IsActiveEntity", "EQ", false), new Filter("SiblingEntity/IsActiveEntity", "EQ", null)],
        and: false
      });
      aFilters.push(oDraftFilter);
      return new Filter(aFilters, true);
    }
    /**
     * Converts a path with semantic keys to a path with technical keys.
     *
     * @param sSemanticPath The path with semantic keys
     * @param oModel The model for the path
     * @param aSemanticKeys The semantic keys for the path
     * @returns A Promise containing the path with technical keys if sSemanticPath could be interpreted as a semantic path, null otherwise
     * @ui5-restricted
     */
    ;

    _proto._getTechnicalPathFromSemanticPath = function _getTechnicalPathFromSemanticPath(sSemanticPath, oModel, aSemanticKeys) {
      var _sEntitySetPath;

      var oMetaModel = oModel.getMetaModel();
      var sEntitySetPath = oMetaModel.getMetaContext(sSemanticPath).getPath();

      if (!aSemanticKeys || aSemanticKeys.length === 0) {
        // No semantic keys
        return Promise.resolve(null);
      } // Create a set of filters corresponding to all keys


      var oFilter = this._createFilterFromSemanticPath(sSemanticPath, aSemanticKeys, oMetaModel);

      if (oFilter === null) {
        // Couldn't interpret the path as a semantic one
        return Promise.resolve(null);
      } // Load the corresponding object


      if (!((_sEntitySetPath = sEntitySetPath) !== null && _sEntitySetPath !== void 0 && _sEntitySetPath.startsWith("/"))) {
        sEntitySetPath = "/".concat(sEntitySetPath);
      }

      var oListBinding = oModel.bindList(sEntitySetPath, undefined, undefined, oFilter, {
        "$$groupId": "$auto.Heroes"
      });
      return oListBinding.requestContexts(0, 2).then(function (oContexts) {
        if (oContexts && oContexts.length) {
          return oContexts[0].getPath();
        } else {
          // No data could be loaded
          return null;
        }
      });
    }
    /**
     * Checks if a path is eligible for semantic bookmarking.
     *
     * @param sPath The path to test
     * @param oMetaModel The associated metadata model
     * @returns `true` if the path is eligible
     * @ui5-restricted
     */
    ;

    _proto._checkPathForSemanticBookmarking = function _checkPathForSemanticBookmarking(sPath, oMetaModel) {
      // Only path on root objects allow semantic bookmarking, i.e. sPath = xxx(yyy)
      var aMatches = /^[\/]?(\w+)\([^\/]+\)$/.exec(sPath);

      if (!aMatches) {
        return false;
      } // Get the entitySet name


      var sEntitySetPath = "/".concat(aMatches[1]); // Check the entity set supports draft (otherwise we don't support semantic bookmarking)

      var oDraftRoot = oMetaModel.getObject("".concat(sEntitySetPath, "@com.sap.vocabularies.Common.v1.DraftRoot"));
      var oDraftNode = oMetaModel.getObject("".concat(sEntitySetPath, "@com.sap.vocabularies.Common.v1.DraftNode"));
      return oDraftRoot || oDraftNode ? true : false;
    }
    /**
     * Builds a path with semantic keys from a path with technical keys.
     *
     * @param sPathToResolve The path to be transformed
     * @param oModel The OData model
     * @returns String promise for the new path. If sPathToResolved couldn't be interpreted as a semantic path, it is returned as is.
     * @ui5-restricted
     */
    ;

    _proto._resolveSemanticPath = function _resolveSemanticPath(sPathToResolve, oModel) {
      var _this5 = this;

      var oMetaModel = oModel.getMetaModel();

      var oLastSemanticMapping = this._oRoutingService.getLastSemanticMapping();

      var sCurrentHashNoParams = this._oRouter.getHashChanger().getHash().split("?")[0];

      if (sCurrentHashNoParams && sCurrentHashNoParams.lastIndexOf("/") === sCurrentHashNoParams.length - 1) {
        // Remove trailing '/'
        sCurrentHashNoParams = sCurrentHashNoParams.substring(0, sCurrentHashNoParams.length - 1);
      }

      var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));

      if (sRootEntityName.indexOf("/") === 0) {
        sRootEntityName = sRootEntityName.substring(1);
      }

      var bAllowSemanticBookmark = this._checkPathForSemanticBookmarking(sCurrentHashNoParams, oMetaModel),
          aSemanticKeys = bAllowSemanticBookmark && SemanticKeyHelper.getSemanticKeys(oMetaModel, sRootEntityName);

      if (!aSemanticKeys) {
        // No semantic keys available --> use the path as is
        return Promise.resolve(sPathToResolve);
      } else if (oLastSemanticMapping && oLastSemanticMapping.semanticPath === sPathToResolve) {
        // This semantic path has been resolved previously
        return Promise.resolve(oLastSemanticMapping.technicalPath);
      } else {
        // We need resolve the semantic path to get the technical keys
        return this._getTechnicalPathFromSemanticPath(sCurrentHashNoParams, oModel, aSemanticKeys).then(function (sTechnicalPath) {
          if (sTechnicalPath && sTechnicalPath !== sPathToResolve) {
            // The semantic path was resolved (otherwise keep the original value for target)
            _this5._oRoutingService.setLastSemanticMapping({
              technicalPath: sTechnicalPath,
              semanticPath: sPathToResolve
            });

            return sTechnicalPath;
          } else {
            return sPathToResolve;
          }
        });
      }
    }
    /**
     * Sets the binding context of the page from a path.
     *
     * @param sTargetPath The path to build the context. Needs to contain technical keys only.
     * @param oModel The OData model
     * @param oNavigationParameters Navigation parameters
     * @ui5-restricted
     */
    ;

    _proto._bindPageToPath = function _bindPageToPath(sTargetPath, oModel, oNavigationParameters) {
      var oCurrentContext = this._getBindingContext(),
          sCurrentPath = oCurrentContext && oCurrentContext.getPath(),
          oUseContext = oNavigationParameters.useContext; // We set the binding context only if it's different from the current one
      // or if we have a context already selected


      if (sCurrentPath !== sTargetPath || oUseContext && oUseContext.getPath() === sTargetPath) {
        var oTargetContext;

        if (oUseContext && oUseContext.getPath() === sTargetPath) {
          // We already have the context to be used
          oTargetContext = oUseContext;
        } else {
          // Otherwise we need to create it from sTargetPath
          oTargetContext = this._createContext(sTargetPath, oModel);
        }

        if (oTargetContext !== oCurrentContext) {
          this._bindPageToContext(oTargetContext, oModel, oNavigationParameters);
        }
      } else if (!oNavigationParameters.bReasonIsIappState && EditState.isEditStateDirty()) {
        this._refreshBindingContext(oCurrentContext);
      }
    }
    /**
     * Binds the page to a context.
     *
     * @param oContext Context to be bound
     * @param oModel The OData model
     * @param oNavigationParameters Navigation parameters
     * @ui5-restricted
     */
    ;

    _proto._bindPageToContext = function _bindPageToContext(oContext, oModel, oNavigationParameters) {
      var _this6 = this;

      if (!oContext) {
        this.onBeforeBinding(null);
        this.onAfterBinding(null);
        return;
      }

      var oParentListBinding = oContext.getBinding();

      var oRootViewController = this._oAppComponent.getRootViewController();

      if (oRootViewController.isFclEnabled()) {
        if (!oParentListBinding || !oParentListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
          // if the parentBinding is not a listBinding, we create a new context
          oContext = this._createContext(oContext.getPath(), oModel);
        }

        try {
          this._setKeepAlive(oContext, true, function () {
            if (oRootViewController.isContextUsedInPages(oContext)) {
              _this6.navigateBackFromContext(oContext);
            }
          }, true // Load messages, otherwise they don't get refreshed later, e.g. for side effects
          );
        } catch (oError) {
          // setKeepAlive throws an exception if the parent listbinding doesn't have $$ownRequest=true
          // This case for custom fragments is supported, but an error is logged to make the lack of synchronization apparent
          Log.error("View for ".concat(oContext.getPath(), " won't be synchronized. Parent listBinding must have binding parameter $$ownRequest=true"));
        }
      } else if (!oParentListBinding || oParentListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
        // We need to recreate the context otherwise we get errors
        oContext = this._createContext(oContext.getPath(), oModel);
      } // Set the binding context with the proper before/after callbacks


      this.onBeforeBinding(oContext, {
        editable: oNavigationParameters.bTargetEditable,
        listBinding: oParentListBinding,
        bPersistOPScroll: oNavigationParameters.bPersistOPScroll,
        bDraftNavigation: oNavigationParameters.bDraftNavigation,
        showPlaceholder: oNavigationParameters.bShowPlaceholder
      });

      this._setBindingContext(oContext);

      this.onAfterBinding(oContext);
    }
    /**
     * Creates a context from a path.
     *
     * @param sPath The path
     * @param oModel The OData model
     * @returns The created context
     * @ui5-restricted
     */
    ;

    _proto._createContext = function _createContext(sPath, oModel) {
      var _this7 = this;

      var oPageComponent = this._oPageComponent,
          sEntitySet = oPageComponent && oPageComponent.getEntitySet && oPageComponent.getEntitySet(),
          sContextPath = oPageComponent && oPageComponent.getContextPath && oPageComponent.getContextPath() || sEntitySet && "/".concat(sEntitySet),
          oMetaModel = oModel.getMetaModel(),
          mParameters = {
        $$groupId: "$auto.Heroes",
        $$updateGroupId: "$auto",
        $$patchWithoutSideEffects: true
      }; // In case of draft: $select the state flags (HasActiveEntity, HasDraftEntity, and IsActiveEntity)

      var oDraftRoot = oMetaModel.getObject("".concat(sContextPath, "@com.sap.vocabularies.Common.v1.DraftRoot"));
      var oDraftNode = oMetaModel.getObject("".concat(sContextPath, "@com.sap.vocabularies.Common.v1.DraftNode"));

      var oRootViewController = this._oAppComponent.getRootViewController();

      if (oRootViewController.isFclEnabled()) {
        var oContext = this._getKeepAliveContext(oModel, sPath, false, mParameters);

        if (!oContext) {
          throw new Error("Cannot create keepAlive context ".concat(sPath));
        } else if (oDraftRoot || oDraftNode) {
          if (oContext.getProperty("IsActiveEntity") === undefined) {
            oContext.requestProperty(["HasActiveEntity", "HasDraftEntity", "IsActiveEntity"]);

            if (oDraftRoot) {
              oContext.requestObject("DraftAdministrativeData");
            }
          } else {
            // when switching between draft and edit we need to ensure those properties are requested again even if they are in the binding's cache
            // otherwise when you edit and go to the saved version you have no way of switching back to the edit version
            oContext.requestSideEffects(oDraftRoot ? ["HasActiveEntity", "HasDraftEntity", "IsActiveEntity", "DraftAdministrativeData"] : ["HasActiveEntity", "HasDraftEntity", "IsActiveEntity"]);
          }
        }

        return oContext;
      } else {
        if (sEntitySet) {
          var sMessagesPath = oMetaModel.getObject("".concat(sContextPath, "/@com.sap.vocabularies.Common.v1.Messages/$Path"));

          if (sMessagesPath) {
            mParameters.$select = sMessagesPath;
          }
        } // In case of draft: $select the state flags (HasActiveEntity, HasDraftEntity, and IsActiveEntity)


        if (oDraftRoot || oDraftNode) {
          if (mParameters.$select === undefined) {
            mParameters.$select = "HasActiveEntity,HasDraftEntity,IsActiveEntity";
          } else {
            mParameters.$select += ",HasActiveEntity,HasDraftEntity,IsActiveEntity";
          }
        }

        if (this._oView.getBindingContext()) {
          var _this$_oView$getBindi2;

          var oPreviousBinding = (_this$_oView$getBindi2 = this._oView.getBindingContext()) === null || _this$_oView$getBindi2 === void 0 ? void 0 : _this$_oView$getBindi2.getBinding();
          oPreviousBinding === null || oPreviousBinding === void 0 ? void 0 : oPreviousBinding.resetChanges().then(function () {
            oPreviousBinding.destroy();
          }).catch(function (oError) {
            Log.error("Error while reseting the changes to the binding", oError);
          });
        }

        var oHiddenBinding = oModel.bindContext(sPath, undefined, mParameters);
        oHiddenBinding.attachEventOnce("dataRequested", function () {
          BusyLocker.lock(_this7._oView);
        });
        oHiddenBinding.attachEventOnce("dataReceived", this._dataReceivedEventHandler.bind(this));
        return oHiddenBinding.getBoundContext();
      }
    };

    _proto._dataReceivedEventHandler = function _dataReceivedEventHandler(oEvent) {
      try {
        var _this9 = this;

        var sErrorDescription = oEvent && oEvent.getParameter("error");
        BusyLocker.unlock(_this9._oView);

        var _temp3 = function () {
          if (sErrorDescription) {
            var _temp4 = _catch(function () {
              return Promise.resolve(Core.getLibraryResourceBundle("sap.fe.core", true)).then(function (oResourceBundle) {
                var messageHandler = _this9.base.messageHandler;
                var mParams = {};

                if (sErrorDescription && sErrorDescription.status === 503) {
                  mParams = {
                    isInitialLoad503Error: true,
                    shellBack: true
                  };
                } else {
                  mParams = {
                    title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
                    description: sErrorDescription,
                    isDataReceivedError: true,
                    shellBack: true
                  };
                }

                return Promise.resolve(messageHandler.showMessages(mParams)).then(function () {});
              });
            }, function (oError) {
              Log.error("Error while getting the core resource bundle", oError);
            });

            if (_temp4 && _temp4.then) return _temp4.then(function () {});
          }
        }();

        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Requests side effects on a binding context to "refresh" it.
     * TODO: get rid of this once provided by the model
     * a refresh on the binding context does not work in case a creation row with a transient context is
     * used. also a requestSideEffects with an empty path would fail due to the transient context
     * therefore we get all dependent bindings (via private model method) to determine all paths and then
     * request them.
     *
     * @param oBindingContext Context to be refreshed
     * @ui5-restricted
     */
    ;

    _proto._refreshBindingContext = function _refreshBindingContext(oBindingContext) {
      var oPageComponent = this._oPageComponent;

      var oSideEffectsService = this._oAppComponent.getSideEffectsService();

      var sRootContextPath = oBindingContext.getPath();
      var sEntitySet = oPageComponent && oPageComponent.getEntitySet && oPageComponent.getEntitySet();
      var sContextPath = oPageComponent && oPageComponent.getContextPath && oPageComponent.getContextPath() || sEntitySet && "/".concat(sEntitySet);

      var oMetaModel = this._oView.getModel().getMetaModel();

      var sMessagesPath;
      var aNavigationPropertyPaths = [];
      var aPropertyPaths = [];
      var oSideEffects = {
        TargetProperties: [],
        TargetEntities: []
      };

      function getBindingPaths(oBinding) {
        var aDependentBindings;
        var sRelativePath = (oBinding.getContext() && oBinding.getContext().getPath() || "").replace(sRootContextPath, ""); // If no context, this is an absolute binding so no relative path

        var sPath = (sRelativePath ? "".concat(sRelativePath.slice(1), "/") : sRelativePath) + oBinding.getPath();

        if (oBinding.isA("sap.ui.model.odata.v4.ODataContextBinding")) {
          // if (sPath === "") {
          // now get the dependent bindings
          aDependentBindings = oBinding.getDependentBindings();

          if (aDependentBindings) {
            // ask the dependent bindings (and only those with the specified groupId
            //if (aDependentBindings.length > 0) {
            for (var _i = 0; _i < aDependentBindings.length; _i++) {
              getBindingPaths(aDependentBindings[_i]);
            }
          } else if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
            aNavigationPropertyPaths.push(sPath);
          }
        } else if (oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
          if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
            aNavigationPropertyPaths.push(sPath);
          }
        } else if (oBinding.isA("sap.ui.model.odata.v4.ODataPropertyBinding")) {
          if (aPropertyPaths.indexOf(sPath) === -1) {
            aPropertyPaths.push(sPath);
          }
        }
      }

      if (sContextPath) {
        sMessagesPath = oMetaModel.getObject("".concat(sContextPath, "/@com.sap.vocabularies.Common.v1.Messages/$Path"));
      } // binding of the context must have $$PatchWithoutSideEffects true, this bound context may be needed to be fetched from the dependent binding


      getBindingPaths(oBindingContext.getBinding());
      var i;

      for (i = 0; i < aNavigationPropertyPaths.length; i++) {
        oSideEffects.TargetEntities.push({
          $NavigationPropertyPath: aNavigationPropertyPaths[i]
        });
      }

      oSideEffects.TargetProperties = aPropertyPaths;

      if (sMessagesPath) {
        oSideEffects.TargetProperties.push(sMessagesPath);
      } //all this logic to be replaced with a SideEffects request for an empty path (refresh everything), after testing transient contexts


      oSideEffects.TargetProperties = oSideEffects.TargetProperties.map(function (sTargetProperty) {
        if (sTargetProperty) {
          var index = sTargetProperty.indexOf("/");

          if (index > 0) {
            // only request the navigation path and not the property paths further
            return sTargetProperty.slice(0, index);
          }

          return sTargetProperty;
        }
      }); // OData model will take care of duplicates

      oSideEffectsService.requestSideEffects(oSideEffects.TargetEntities.concat(oSideEffects.TargetProperties), oBindingContext);
    }
    /**
     * Gets the binding context of the page or the component.
     *
     * @returns The binding context
     * @ui5-restricted
     */
    ;

    _proto._getBindingContext = function _getBindingContext() {
      if (this._oPageComponent) {
        return this._oPageComponent.getBindingContext();
      } else {
        return this._oView.getBindingContext();
      }
    }
    /**
     * Sets the binding context of the page or the component.
     *
     * @param oContext The binding context
     * @ui5-restricted
     */
    ;

    _proto._setBindingContext = function _setBindingContext(oContext) {
      var oPreviousContext, oTargetControl;

      if (this._oPageComponent) {
        oPreviousContext = this._oPageComponent.getBindingContext();
        oTargetControl = this._oPageComponent;
      } else {
        oPreviousContext = this._oView.getBindingContext();
        oTargetControl = this._oView;
      }

      oTargetControl.setBindingContext(oContext);

      if (oPreviousContext && oPreviousContext.isKeepAlive()) {
        this._setKeepAlive(oPreviousContext, false);
      }
    }
    /**
     * Gets the flexible column layout (FCL) level corresponding to the view (-1 if the app is not FCL).
     *
     * @returns The level
     * @ui5-restricted
     */
    ;

    _proto._getFCLLevel = function _getFCLLevel() {
      return this._oTargetInformation.FCLLevel;
    };

    _proto._setKeepAlive = function _setKeepAlive(oContext, bKeepAlive, fnBeforeDestroy, bRequestMessages) {
      if (oContext.getPath().endsWith(")")) {
        // We keep the context alive only if they're part of a collection, i.e. if the path ends with a ')'
        var oMetaModel = oContext.getModel().getMetaModel();
        var sMetaPath = oMetaModel.getMetaPath(oContext.getPath());
        var sMessagesPath = oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.Common.v1.Messages/$Path"));
        oContext.setKeepAlive(bKeepAlive, fnBeforeDestroy, !!sMessagesPath && bRequestMessages);
      }
    };

    _proto._getKeepAliveContext = function _getKeepAliveContext(oModel, path, bRequestMessages, parameters) {
      // Get the path for the context that is really kept alive (part of a collection)
      // i.e. remove all segments not ending with a ')'
      var keptAliveSegments = path.split("/");
      var additionnalSegments = [];

      while (keptAliveSegments.length && !keptAliveSegments[keptAliveSegments.length - 1].endsWith(")")) {
        additionnalSegments.push(keptAliveSegments.pop());
      }

      if (keptAliveSegments.length === 0) {
        return undefined;
      }

      var keptAlivePath = keptAliveSegments.join("/");
      var oKeepAliveContext = oModel.getKeepAliveContext(keptAlivePath, bRequestMessages, parameters);

      if (additionnalSegments.length === 0) {
        return oKeepAliveContext;
      } else {
        additionnalSegments.reverse();
        var additionnalPath = additionnalSegments.join("/");
        return oModel.bindContext(additionnalPath, oKeepAliveContext).getBoundContext();
      }
    }
    /**
     * Switches between column and full-screen mode when FCL is used.
     *
     * @ui5-restricted
     */
    ;

    _proto.switchFullScreen = function switchFullScreen() {
      var oSource = this.base.getView();

      var oFCLHelperModel = oSource.getModel("fclhelper"),
          bIsFullScreen = oFCLHelperModel.getProperty("/actionButtonsInfo/isFullScreen"),
          sNextLayout = oFCLHelperModel.getProperty(bIsFullScreen ? "/actionButtonsInfo/exitFullScreen" : "/actionButtonsInfo/fullScreen"),
          oRootViewController = this._oAppComponent.getRootViewController();

      var oContext = oRootViewController.getRightmostContext ? oRootViewController.getRightmostContext() : oSource.getBindingContext();

      this.base._routing.navigateToContext(oContext, {
        sLayout: sNextLayout
      }).catch(function () {
        Log.warning("cannot switch between column and fullscreen");
      });
    }
    /**
     * Closes the column for the current view in a FCL.
     *
     * @ui5-restricted
     */
    ;

    _proto.closeColumn = function closeColumn() {
      var oSource = this.base.getView();
      var oViewData = oSource.getViewData();
      var oContext = oSource.getBindingContext();
      var base = this.base;
      var oMetaModel = oContext.getModel().getMetaModel();

      if (oViewData && oViewData.viewLevel === 1 && ModelHelper.isDraftSupported(oMetaModel, oContext.getPath())) {
        draft.processDataLossOrDraftDiscardConfirmation(function () {
          base._routing.navigateBackFromContext(oContext, {
            noPreservationCache: true
          });
        }, Function.prototype, oContext, oSource.getController(), false, draft.NavigationType.BackNavigation);
      } else {
        base._routing.navigateBackFromContext(oContext, {
          noPreservationCache: true
        });
      }
    };

    return InternalRouting;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatched", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatched"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatchedFinished", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatchedFinished"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeBinding", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onAfterBinding", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "onAfterBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateToTarget", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateToTarget"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateToRoute", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateToRoute"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateToContext", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateToContext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateBackFromContext", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateBackFromContext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateForwardToContext", [_dec18, _dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateForwardToContext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateBackFromTransientState", [_dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateBackFromTransientState"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateToMessagePage", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateToMessagePage"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isCurrentStateImpactedBy", [_dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "isCurrentStateImpactedBy"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "switchFullScreen", [_dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "switchFullScreen"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "closeColumn", [_dec28, _dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "closeColumn"), _class2.prototype)), _class2)) || _class);
  return InternalRouting;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiSW50ZXJuYWxSb3V0aW5nIiwiZGVmaW5lVUk1Q2xhc3MiLCJtZXRob2RPdmVycmlkZSIsInB1YmxpY0V4dGVuc2lvbiIsImV4dGVuc2libGUiLCJPdmVycmlkZUV4ZWN1dGlvbiIsIkFmdGVyIiwiZmluYWxFeHRlbnNpb24iLCJCZWZvcmUiLCJvbkV4aXQiLCJfb1JvdXRpbmdTZXJ2aWNlIiwiZGV0YWNoUm91dGVNYXRjaGVkIiwiX2ZuUm91dGVNYXRjaGVkQm91bmQiLCJvbkluaXQiLCJfb1ZpZXciLCJiYXNlIiwiZ2V0VmlldyIsIl9vQXBwQ29tcG9uZW50IiwiQ29tbW9uVXRpbHMiLCJnZXRBcHBDb21wb25lbnQiLCJfb1BhZ2VDb21wb25lbnQiLCJDb21wb25lbnQiLCJnZXRPd25lckNvbXBvbmVudEZvciIsIl9vUm91dGVyIiwiZ2V0Um91dGVyIiwiX29Sb3V0ZXJQcm94eSIsImdldFJvdXRlclByb3h5IiwiRXJyb3IiLCJnZXRTZXJ2aWNlIiwib1JvdXRpbmdTZXJ2aWNlIiwiX29uUm91dGVNYXRjaGVkIiwiYmluZCIsImF0dGFjaFJvdXRlTWF0Y2hlZCIsIl9vVGFyZ2V0SW5mb3JtYXRpb24iLCJnZXRUYXJnZXRJbmZvcm1hdGlvbkZvciIsImNhdGNoIiwib25Sb3V0ZU1hdGNoZWQiLCJvblJvdXRlTWF0Y2hlZEZpbmlzaGVkIiwib25CZWZvcmVCaW5kaW5nIiwib0JpbmRpbmdDb250ZXh0IiwibVBhcmFtZXRlcnMiLCJvUm91dGluZyIsImdldENvbnRyb2xsZXIiLCJyb3V0aW5nIiwib25BZnRlckJpbmRpbmciLCJnZXRSb290Vmlld0NvbnRyb2xsZXIiLCJvbkNvbnRleHRCb3VuZFRvVmlldyIsIm5hdmlnYXRlVG9UYXJnZXQiLCJvQ29udGV4dCIsInNOYXZpZ2F0aW9uVGFyZ2V0TmFtZSIsIm9TZW1hbnRpY09iamVjdCIsImJQcmVzZXJ2ZUhpc3RvcnkiLCJvTmF2aWdhdGlvbkNvbmZpZ3VyYXRpb24iLCJnZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbiIsIm9EZXRhaWxSb3V0ZSIsImRldGFpbCIsInNSb3V0ZU5hbWUiLCJyb3V0ZSIsIm1QYXJhbWV0ZXJNYXBwaW5nIiwicGFyYW1ldGVycyIsIm5hdmlnYXRlVG8iLCJnZXRWaWV3RGF0YSIsIm5hdmlnYXRlVG9Sb3V0ZSIsInNUYXJnZXRSb3V0ZU5hbWUiLCJvUGFyYW1ldGVycyIsIm5hdmlnYXRlVG9Db250ZXh0Iiwib0NvbnRleHRJbmZvIiwiaXNBIiwiYXN5bmNDb250ZXh0IiwiYWN0aXZhdGVSb3V0ZU1hdGNoU3luY2hyb25pemF0aW9uIiwiY2hlY2tOb0hhc2hDaGFuZ2UiLCJlZGl0YWJsZSIsImJQZXJzaXN0T1BTY3JvbGwiLCJ1cGRhdGVGQ0xMZXZlbCIsImJGb3JjZUZvY3VzIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJiRGVmZXJyZWRDb250ZXh0IiwiY2FsbEV4dGVuc2lvbiIsIm9JbnRlcm5hbE1vZGVsIiwiZ2V0TW9kZWwiLCJzZXRQcm9wZXJ0eSIsInNvdXJjZUJpbmRpbmdDb250ZXh0IiwiZ2V0T2JqZWN0IiwiYmluZGluZ0NvbnRleHQiLCJvRXZlbnQiLCJiT3ZlcnJpZGVOYXYiLCJvbkJlZm9yZU5hdmlnYXRpb24iLCJQcm9taXNlIiwicmVzb2x2ZSIsIkZDTExldmVsIiwiX2dldEZDTExldmVsIiwibmF2aWdhdGVCYWNrRnJvbUNvbnRleHQiLCJuYXZpZ2F0ZUZvcndhcmRUb0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsImdldFByb3BlcnR5IiwibmF2aWdhdGVCYWNrRnJvbVRyYW5zaWVudFN0YXRlIiwic0hhc2giLCJnZXRIYXNoIiwiaW5kZXhPZiIsIm5hdkJhY2siLCJuYXZpZ2F0ZVRvTWVzc2FnZVBhZ2UiLCJzRXJyb3JNZXNzYWdlIiwibmF2VG9IYXNoIiwiZ2V0RGVmYXVsdENyZWF0ZUhhc2giLCJkaXNwbGF5TWVzc2FnZVBhZ2UiLCJpc0N1cnJlbnRTdGF0ZUltcGFjdGVkQnkiLCJfaXNWaWV3UGFydE9mUm91dGUiLCJyb3V0ZUluZm9ybWF0aW9uIiwiYVRhcmdldHMiLCJ0YXJnZXRzIiwidGFyZ2V0TmFtZSIsInZpZXdMZXZlbCIsInJvdXRlTGV2ZWwiLCJfc2V0QmluZGluZ0NvbnRleHQiLCJfYnVpbGRCaW5kaW5nUGF0aCIsInJvdXRlQXJndW1lbnRzIiwiYmluZGluZ1BhdHRlcm4iLCJuYXZpZ2F0aW9uUGFyYW1ldGVycyIsInBhdGgiLCJyZXBsYWNlIiwiZGVmZXJyZWQiLCJzS2V5Iiwic1ZhbHVlIiwiYlRhcmdldEVkaXRhYmxlIiwiaGFzT3duUHJvcGVydHkiLCJiQWN0aW9uQ3JlYXRlIiwiZ2V0UGFyYW1ldGVyIiwiZ2V0QmluZGluZ0NvbnRleHRQYXR0ZXJuIiwiY29udGV4dFBhdHRlcm4iLCJ1bmRlZmluZWQiLCJtQXJndW1lbnRzIiwiZ2V0UGFyYW1ldGVycyIsImFyZ3VtZW50cyIsIm9OYXZpZ2F0aW9uUGFyYW1ldGVycyIsIm9Nb2RlbCIsIm9PdXQiLCJfYmluZERlZmVycmVkIiwiX2JpbmRQYWdlIiwiZmluYWxseSIsInVwZGF0ZVVJU3RhdGVGb3JWaWV3Iiwic1RhcmdldFBhdGgiLCJvQXN5bmNDb250ZXh0IiwiY3JlYXRlRGVmZXJyZWRDb250ZXh0IiwidXNlQ29udGV4dCIsImN1cnJlbnRCaW5kaW5nQ29udGV4dCIsIl9nZXRCaW5kaW5nQ29udGV4dCIsImhhc1BlbmRpbmdDaGFuZ2VzIiwiZ2V0QmluZGluZyIsInJlc2V0Q2hhbmdlcyIsIl9iaW5kUGFnZVRvQ29udGV4dCIsIl9yZXNvbHZlU2VtYW50aWNQYXRoIiwic1RlY2huaWNhbFBhdGgiLCJfYmluZFBhZ2VUb1BhdGgiLCJvUmVzb3VyY2VCdW5kbGUiLCJDb3JlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiZ2V0VGV4dCIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJtZXNzYWdlIiwiX2NyZWF0ZUZpbHRlckZyb21TZW1hbnRpY1BhdGgiLCJzU2VtYW50aWNQYXRoIiwiYVNlbWFudGljS2V5cyIsIm9NZXRhTW9kZWwiLCJmblVucXVvdGVBbmREZWNvZGUiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsImRlY29kZVVSSUNvbXBvbmVudCIsInN1YnN0cmluZyIsImFLZXlWYWx1ZXMiLCJzcGxpdCIsImFGaWx0ZXJzIiwiYkZpbHRlcmluZ0Nhc2VTZW5zaXRpdmUiLCJNb2RlbEhlbHBlciIsImlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZSIsInNLZXlWYWx1ZSIsIkZpbHRlciIsIiRQcm9wZXJ0eVBhdGgiLCJvcGVyYXRvciIsIkZpbHRlck9wZXJhdG9yIiwiRVEiLCJ2YWx1ZTEiLCJjYXNlU2Vuc2l0aXZlIiwibUtleVZhbHVlcyIsImZvckVhY2giLCJzS2V5QXNzaWdubWVudCIsImFQYXJ0cyIsImJGYWlsZWQiLCJtYXAiLCJvU2VtYW50aWNLZXkiLCJvRHJhZnRGaWx0ZXIiLCJmaWx0ZXJzIiwiYW5kIiwicHVzaCIsIl9nZXRUZWNobmljYWxQYXRoRnJvbVNlbWFudGljUGF0aCIsImdldE1ldGFNb2RlbCIsInNFbnRpdHlTZXRQYXRoIiwiZ2V0TWV0YUNvbnRleHQiLCJnZXRQYXRoIiwib0ZpbHRlciIsInN0YXJ0c1dpdGgiLCJvTGlzdEJpbmRpbmciLCJiaW5kTGlzdCIsInJlcXVlc3RDb250ZXh0cyIsIm9Db250ZXh0cyIsIl9jaGVja1BhdGhGb3JTZW1hbnRpY0Jvb2ttYXJraW5nIiwic1BhdGgiLCJhTWF0Y2hlcyIsImV4ZWMiLCJvRHJhZnRSb290Iiwib0RyYWZ0Tm9kZSIsInNQYXRoVG9SZXNvbHZlIiwib0xhc3RTZW1hbnRpY01hcHBpbmciLCJnZXRMYXN0U2VtYW50aWNNYXBwaW5nIiwic0N1cnJlbnRIYXNoTm9QYXJhbXMiLCJnZXRIYXNoQ2hhbmdlciIsInNSb290RW50aXR5TmFtZSIsInN1YnN0ciIsImJBbGxvd1NlbWFudGljQm9va21hcmsiLCJTZW1hbnRpY0tleUhlbHBlciIsImdldFNlbWFudGljS2V5cyIsInNlbWFudGljUGF0aCIsInRlY2huaWNhbFBhdGgiLCJzZXRMYXN0U2VtYW50aWNNYXBwaW5nIiwib0N1cnJlbnRDb250ZXh0Iiwic0N1cnJlbnRQYXRoIiwib1VzZUNvbnRleHQiLCJvVGFyZ2V0Q29udGV4dCIsIl9jcmVhdGVDb250ZXh0IiwiYlJlYXNvbklzSWFwcFN0YXRlIiwiRWRpdFN0YXRlIiwiaXNFZGl0U3RhdGVEaXJ0eSIsIl9yZWZyZXNoQmluZGluZ0NvbnRleHQiLCJvUGFyZW50TGlzdEJpbmRpbmciLCJvUm9vdFZpZXdDb250cm9sbGVyIiwiaXNGY2xFbmFibGVkIiwiX3NldEtlZXBBbGl2ZSIsImlzQ29udGV4dFVzZWRJblBhZ2VzIiwibGlzdEJpbmRpbmciLCJiRHJhZnROYXZpZ2F0aW9uIiwic2hvd1BsYWNlaG9sZGVyIiwiYlNob3dQbGFjZWhvbGRlciIsIm9QYWdlQ29tcG9uZW50Iiwic0VudGl0eVNldCIsImdldEVudGl0eVNldCIsInNDb250ZXh0UGF0aCIsImdldENvbnRleHRQYXRoIiwiJCRncm91cElkIiwiJCR1cGRhdGVHcm91cElkIiwiJCRwYXRjaFdpdGhvdXRTaWRlRWZmZWN0cyIsIl9nZXRLZWVwQWxpdmVDb250ZXh0IiwicmVxdWVzdFByb3BlcnR5IiwicmVxdWVzdE9iamVjdCIsInJlcXVlc3RTaWRlRWZmZWN0cyIsInNNZXNzYWdlc1BhdGgiLCIkc2VsZWN0Iiwib1ByZXZpb3VzQmluZGluZyIsImRlc3Ryb3kiLCJvSGlkZGVuQmluZGluZyIsImJpbmRDb250ZXh0IiwiYXR0YWNoRXZlbnRPbmNlIiwiQnVzeUxvY2tlciIsImxvY2siLCJfZGF0YVJlY2VpdmVkRXZlbnRIYW5kbGVyIiwiZ2V0Qm91bmRDb250ZXh0Iiwic0Vycm9yRGVzY3JpcHRpb24iLCJ1bmxvY2siLCJtZXNzYWdlSGFuZGxlciIsIm1QYXJhbXMiLCJzdGF0dXMiLCJpc0luaXRpYWxMb2FkNTAzRXJyb3IiLCJzaGVsbEJhY2siLCJpc0RhdGFSZWNlaXZlZEVycm9yIiwic2hvd01lc3NhZ2VzIiwib1NpZGVFZmZlY3RzU2VydmljZSIsImdldFNpZGVFZmZlY3RzU2VydmljZSIsInNSb290Q29udGV4dFBhdGgiLCJhTmF2aWdhdGlvblByb3BlcnR5UGF0aHMiLCJhUHJvcGVydHlQYXRocyIsIm9TaWRlRWZmZWN0cyIsIlRhcmdldFByb3BlcnRpZXMiLCJUYXJnZXRFbnRpdGllcyIsImdldEJpbmRpbmdQYXRocyIsIm9CaW5kaW5nIiwiYURlcGVuZGVudEJpbmRpbmdzIiwic1JlbGF0aXZlUGF0aCIsImdldENvbnRleHQiLCJzbGljZSIsImdldERlcGVuZGVudEJpbmRpbmdzIiwiaSIsIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwic1RhcmdldFByb3BlcnR5IiwiaW5kZXgiLCJjb25jYXQiLCJvUHJldmlvdXNDb250ZXh0Iiwib1RhcmdldENvbnRyb2wiLCJzZXRCaW5kaW5nQ29udGV4dCIsImlzS2VlcEFsaXZlIiwiYktlZXBBbGl2ZSIsImZuQmVmb3JlRGVzdHJveSIsImJSZXF1ZXN0TWVzc2FnZXMiLCJlbmRzV2l0aCIsInNNZXRhUGF0aCIsImdldE1ldGFQYXRoIiwic2V0S2VlcEFsaXZlIiwia2VwdEFsaXZlU2VnbWVudHMiLCJhZGRpdGlvbm5hbFNlZ21lbnRzIiwicG9wIiwia2VwdEFsaXZlUGF0aCIsImpvaW4iLCJvS2VlcEFsaXZlQ29udGV4dCIsImdldEtlZXBBbGl2ZUNvbnRleHQiLCJyZXZlcnNlIiwiYWRkaXRpb25uYWxQYXRoIiwic3dpdGNoRnVsbFNjcmVlbiIsIm9Tb3VyY2UiLCJvRkNMSGVscGVyTW9kZWwiLCJiSXNGdWxsU2NyZWVuIiwic05leHRMYXlvdXQiLCJnZXRSaWdodG1vc3RDb250ZXh0IiwiX3JvdXRpbmciLCJzTGF5b3V0Iiwid2FybmluZyIsImNsb3NlQ29sdW1uIiwib1ZpZXdEYXRhIiwiaXNEcmFmdFN1cHBvcnRlZCIsImRyYWZ0IiwicHJvY2Vzc0RhdGFMb3NzT3JEcmFmdERpc2NhcmRDb25maXJtYXRpb24iLCJub1ByZXNlcnZhdGlvbkNhY2hlIiwiRnVuY3Rpb24iLCJwcm90b3R5cGUiLCJOYXZpZ2F0aW9uVHlwZSIsIkJhY2tOYXZpZ2F0aW9uIiwiQ29udHJvbGxlckV4dGVuc2lvbiJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiSW50ZXJuYWxSb3V0aW5nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgQXBwQ29tcG9uZW50IGZyb20gXCJzYXAvZmUvY29yZS9BcHBDb21wb25lbnRcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCBCdXN5TG9ja2VyIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9CdXN5TG9ja2VyXCI7XG5pbXBvcnQgZHJhZnQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L2RyYWZ0XCI7XG5pbXBvcnQgdHlwZSBSb3V0ZXJQcm94eSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvcm91dGluZy9Sb3V0ZXJQcm94eVwiO1xuaW1wb3J0IHR5cGUgeyBFbmhhbmNlV2l0aFVJNSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MsIGV4dGVuc2libGUsIGZpbmFsRXh0ZW5zaW9uLCBtZXRob2RPdmVycmlkZSwgcHVibGljRXh0ZW5zaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgRWRpdFN0YXRlIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0VkaXRTdGF0ZVwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgU2VtYW50aWNLZXlIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU2VtYW50aWNLZXlIZWxwZXJcIjtcbmltcG9ydCB0eXBlIFBhZ2VDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvY29yZS9QYWdlQ29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBSb3V0aW5nU2VydmljZSB9IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9Sb3V0aW5nU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCB0eXBlIFRlbXBsYXRlQ29tcG9uZW50IGZyb20gXCJzYXAvZmUvY29yZS9UZW1wbGF0ZUNvbXBvbmVudFwiO1xuaW1wb3J0IHR5cGUgRXZlbnQgZnJvbSBcInNhcC91aS9iYXNlL0V2ZW50XCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJzYXAvdWkvY29yZS9Db21wb25lbnRcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgQ29udHJvbGxlckV4dGVuc2lvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL0NvbnRyb2xsZXJFeHRlbnNpb25cIjtcbmltcG9ydCBPdmVycmlkZUV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL092ZXJyaWRlRXhlY3V0aW9uXCI7XG5pbXBvcnQgdHlwZSBWaWV3IGZyb20gXCJzYXAvdWkvY29yZS9tdmMvVmlld1wiO1xuaW1wb3J0IHR5cGUgUm91dGVyIGZyb20gXCJzYXAvdWkvY29yZS9yb3V0aW5nL1JvdXRlclwiO1xuaW1wb3J0IEZpbHRlciBmcm9tIFwic2FwL3VpL21vZGVsL0ZpbHRlclwiO1xuaW1wb3J0IEZpbHRlck9wZXJhdG9yIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyT3BlcmF0b3JcIjtcbmltcG9ydCB0eXBlIEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTW9kZWxcIjtcblxuLyoqXG4gKiB7QGxpbmsgc2FwLnVpLmNvcmUubXZjLkNvbnRyb2xsZXJFeHRlbnNpb24gQ29udHJvbGxlciBleHRlbnNpb259XG4gKlxuICogQG5hbWVzcGFjZVxuICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkludGVybmFsUm91dGluZ1xuICogQHByaXZhdGVcbiAqIEBzaW5jZSAxLjc0LjBcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuSW50ZXJuYWxSb3V0aW5nXCIpXG5jbGFzcyBJbnRlcm5hbFJvdXRpbmcgZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJpdmF0ZSBiYXNlITogUGFnZUNvbnRyb2xsZXI7XG5cdHByaXZhdGUgX29WaWV3ITogVmlldztcblx0cHJpdmF0ZSBfb0FwcENvbXBvbmVudCE6IEFwcENvbXBvbmVudDtcblx0cHJpdmF0ZSBfb1BhZ2VDb21wb25lbnQhOiBFbmhhbmNlV2l0aFVJNTxUZW1wbGF0ZUNvbXBvbmVudD4gfCBudWxsO1xuXHRwcml2YXRlIF9vUm91dGVyITogUm91dGVyO1xuXHRwcml2YXRlIF9vUm91dGluZ1NlcnZpY2UhOiBSb3V0aW5nU2VydmljZTtcblx0cHJpdmF0ZSBfb1JvdXRlclByb3h5ITogUm91dGVyUHJveHk7XG5cdHByaXZhdGUgX2ZuUm91dGVNYXRjaGVkQm91bmQhOiBGdW5jdGlvbjtcblx0cHJvdGVjdGVkIF9vVGFyZ2V0SW5mb3JtYXRpb246IGFueTtcblxuXHRAbWV0aG9kT3ZlcnJpZGUoKVxuXHRvbkV4aXQoKSB7XG5cdFx0aWYgKHRoaXMuX29Sb3V0aW5nU2VydmljZSkge1xuXHRcdFx0dGhpcy5fb1JvdXRpbmdTZXJ2aWNlLmRldGFjaFJvdXRlTWF0Y2hlZCh0aGlzLl9mblJvdXRlTWF0Y2hlZEJvdW5kKTtcblx0XHR9XG5cdH1cblxuXHRAbWV0aG9kT3ZlcnJpZGUoKVxuXHRvbkluaXQoKSB7XG5cdFx0dGhpcy5fb1ZpZXcgPSB0aGlzLmJhc2UuZ2V0VmlldygpO1xuXHRcdHRoaXMuX29BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQodGhpcy5fb1ZpZXcpO1xuXHRcdHRoaXMuX29QYWdlQ29tcG9uZW50ID0gQ29tcG9uZW50LmdldE93bmVyQ29tcG9uZW50Rm9yKHRoaXMuX29WaWV3KSBhcyBFbmhhbmNlV2l0aFVJNTxUZW1wbGF0ZUNvbXBvbmVudD47XG5cdFx0dGhpcy5fb1JvdXRlciA9IHRoaXMuX29BcHBDb21wb25lbnQuZ2V0Um91dGVyKCk7XG5cdFx0dGhpcy5fb1JvdXRlclByb3h5ID0gKHRoaXMuX29BcHBDb21wb25lbnQgYXMgYW55KS5nZXRSb3V0ZXJQcm94eSgpO1xuXG5cdFx0aWYgKCF0aGlzLl9vQXBwQ29tcG9uZW50IHx8ICF0aGlzLl9vUGFnZUNvbXBvbmVudCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGluaXRpYWxpemUgY29udHJvbGVyIGV4dGVuc2lvbiAnc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVzaW9ucy5JbnRlcm5hbFJvdXRpbmdcIik7XG5cdFx0fVxuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRpZiAodGhpcy5fb0FwcENvbXBvbmVudCA9PT0gdGhpcy5fb1BhZ2VDb21wb25lbnQpIHtcblx0XHRcdC8vIFRoZSB2aWV3IGlzbid0IGhvc3RlZCBpbiBhIGRlZGljYXRlZCBVSUNvbXBvbmVudCwgYnV0IGRpcmVjdGx5IGluIHRoZSBhcHBcblx0XHRcdC8vIC0tPiBqdXN0IGtlZXAgdGhlIHZpZXdcblx0XHRcdHRoaXMuX29QYWdlQ29tcG9uZW50ID0gbnVsbDtcblx0XHR9XG5cblx0XHR0aGlzLl9vQXBwQ29tcG9uZW50XG5cdFx0XHQuZ2V0U2VydmljZShcInJvdXRpbmdTZXJ2aWNlXCIpXG5cdFx0XHQudGhlbigob1JvdXRpbmdTZXJ2aWNlOiBSb3V0aW5nU2VydmljZSkgPT4ge1xuXHRcdFx0XHR0aGlzLl9vUm91dGluZ1NlcnZpY2UgPSBvUm91dGluZ1NlcnZpY2U7XG5cdFx0XHRcdHRoaXMuX2ZuUm91dGVNYXRjaGVkQm91bmQgPSB0aGlzLl9vblJvdXRlTWF0Y2hlZC5iaW5kKHRoaXMpO1xuXHRcdFx0XHR0aGlzLl9vUm91dGluZ1NlcnZpY2UuYXR0YWNoUm91dGVNYXRjaGVkKHRoaXMuX2ZuUm91dGVNYXRjaGVkQm91bmQpO1xuXHRcdFx0XHR0aGlzLl9vVGFyZ2V0SW5mb3JtYXRpb24gPSBvUm91dGluZ1NlcnZpY2UuZ2V0VGFyZ2V0SW5mb3JtYXRpb25Gb3IodGhpcy5fb1BhZ2VDb21wb25lbnQgfHwgdGhpcy5fb1ZpZXcpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgY29udHJvbGxlciBleHRlbnNpb24gY2Fubm90IHdvcmsgd2l0aG91dCBhICdyb3V0aW5nU2VydmljZScgb24gdGhlIG1haW4gQXBwQ29tcG9uZW50XCIpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogVHJpZ2dlcmVkIGV2ZXJ5IHRpbWUgdGhpcyBjb250cm9sbGVyIGlzIGEgbmF2aWdhdGlvbiB0YXJnZXQuXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdG9uUm91dGVNYXRjaGVkKCkge1xuXHRcdC8qKi9cblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0b25Sb3V0ZU1hdGNoZWRGaW5pc2hlZCgpIHtcblx0XHQvKiovXG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdG9uQmVmb3JlQmluZGluZyhvQmluZGluZ0NvbnRleHQ6IGFueSwgbVBhcmFtZXRlcnM/OiBhbnkpIHtcblx0XHRjb25zdCBvUm91dGluZyA9ICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBhbnkpLnJvdXRpbmc7XG5cdFx0aWYgKG9Sb3V0aW5nICYmIG9Sb3V0aW5nLm9uQmVmb3JlQmluZGluZykge1xuXHRcdFx0b1JvdXRpbmcub25CZWZvcmVCaW5kaW5nKG9CaW5kaW5nQ29udGV4dCwgbVBhcmFtZXRlcnMpO1xuXHRcdH1cblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0b25BZnRlckJpbmRpbmcob0JpbmRpbmdDb250ZXh0OiBhbnksIG1QYXJhbWV0ZXJzPzogYW55KSB7XG5cdFx0KHRoaXMuX29BcHBDb21wb25lbnQgYXMgYW55KS5nZXRSb290Vmlld0NvbnRyb2xsZXIoKS5vbkNvbnRleHRCb3VuZFRvVmlldyhvQmluZGluZ0NvbnRleHQpO1xuXHRcdGNvbnN0IG9Sb3V0aW5nID0gKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIGFueSkucm91dGluZztcblx0XHRpZiAob1JvdXRpbmcgJiYgb1JvdXRpbmcub25BZnRlckJpbmRpbmcpIHtcblx0XHRcdG9Sb3V0aW5nLm9uQWZ0ZXJCaW5kaW5nKG9CaW5kaW5nQ29udGV4dCwgbVBhcmFtZXRlcnMpO1xuXHRcdH1cblx0fVxuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vIE1ldGhvZHMgdHJpZ2dlcmluZyBhIG5hdmlnYXRpb24gYWZ0ZXIgYSB1c2VyIGFjdGlvblxuXHQvLyAoZS5nLiBjbGljayBvbiBhIHRhYmxlIHJvdywgYnV0dG9uLCBldGMuLi4pXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byB0aGUgc3BlY2lmaWVkIG5hdmlnYXRpb24gdGFyZ2V0LlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBpbnN0YW5jZVxuXHQgKiBAcGFyYW0gc05hdmlnYXRpb25UYXJnZXROYW1lIE5hdmlnYXRpb24gdGFyZ2V0IG5hbWVcblx0ICogQHBhcmFtIG9TZW1hbnRpY09iamVjdCBTZW1hbnRpYyBvYmplY3Rcblx0ICogQHBhcmFtIGJQcmVzZXJ2ZUhpc3RvcnkgVHJ1ZSB0byBmb3JjZSB0aGUgbmV3IFVSTCB0byBiZSBhZGRlZCBhdCB0aGUgZW5kIG9mIHRoZSBicm93c2VyIGhpc3RvcnkgKG5vIHJlcGxhY2UpXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdG5hdmlnYXRlVG9UYXJnZXQob0NvbnRleHQ6IGFueSwgc05hdmlnYXRpb25UYXJnZXROYW1lOiBzdHJpbmcsIG9TZW1hbnRpY09iamVjdD86IG9iamVjdCwgYlByZXNlcnZlSGlzdG9yeT86IGJvb2xlYW4pIHtcblx0XHRjb25zdCBvTmF2aWdhdGlvbkNvbmZpZ3VyYXRpb24gPVxuXHRcdFx0dGhpcy5fb1BhZ2VDb21wb25lbnQgJiZcblx0XHRcdHRoaXMuX29QYWdlQ29tcG9uZW50LmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uICYmXG5cdFx0XHR0aGlzLl9vUGFnZUNvbXBvbmVudC5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihzTmF2aWdhdGlvblRhcmdldE5hbWUpO1xuXHRcdGlmIChvTmF2aWdhdGlvbkNvbmZpZ3VyYXRpb24pIHtcblx0XHRcdGNvbnN0IG9EZXRhaWxSb3V0ZSA9IG9OYXZpZ2F0aW9uQ29uZmlndXJhdGlvbi5kZXRhaWw7XG5cdFx0XHRjb25zdCBzUm91dGVOYW1lID0gb0RldGFpbFJvdXRlLnJvdXRlO1xuXHRcdFx0Y29uc3QgbVBhcmFtZXRlck1hcHBpbmcgPSBvRGV0YWlsUm91dGUucGFyYW1ldGVycztcblx0XHRcdHRoaXMuX29Sb3V0aW5nU2VydmljZS5uYXZpZ2F0ZVRvKG9Db250ZXh0LCBzUm91dGVOYW1lLCBtUGFyYW1ldGVyTWFwcGluZywgYlByZXNlcnZlSGlzdG9yeSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX29Sb3V0aW5nU2VydmljZS5uYXZpZ2F0ZVRvKG9Db250ZXh0LCBudWxsLCBudWxsLCBiUHJlc2VydmVIaXN0b3J5KTtcblx0XHR9XG5cdFx0dGhpcy5fb1ZpZXcuZ2V0Vmlld0RhdGEoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gdGhlIHNwZWNpZmllZCBuYXZpZ2F0aW9uIHRhcmdldCByb3V0ZS5cblx0ICpcblx0ICogQHBhcmFtIHNUYXJnZXRSb3V0ZU5hbWUgTmFtZSBvZiB0aGUgdGFyZ2V0IHJvdXRlXG5cdCAqIEBwYXJhbSBbb1BhcmFtZXRlcnNdIFBhcmFtZXRlcnMgdG8gYmUgdXNlZCB3aXRoIHJvdXRlIHRvIGNyZWF0ZSB0aGUgdGFyZ2V0IGhhc2hcblx0ICogQHJldHVybnMgUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIG5hdmlnYXRpb24gaXMgZmluYWxpemVkXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdG5hdmlnYXRlVG9Sb3V0ZShzVGFyZ2V0Um91dGVOYW1lOiBzdHJpbmcsIG9QYXJhbWV0ZXJzPzogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIHRoaXMuX29Sb3V0aW5nU2VydmljZS5uYXZpZ2F0ZVRvUm91dGUoc1RhcmdldFJvdXRlTmFtZSwgb1BhcmFtZXRlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byBhIHNwZWNpZmljIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBUaGUgY29udGV4dCB0byBiZSBuYXZpZ2F0ZWQgdG9cblx0ICogQHBhcmFtIFttUGFyYW1ldGVyc10gT3B0aW9uYWwgbmF2aWdhdGlvbiBwYXJhbWV0ZXJzXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgbmF2aWdhdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0bmF2aWdhdGVUb0NvbnRleHQob0NvbnRleHQ6IGFueSwgbVBhcmFtZXRlcnM/OiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRjb25zdCBvQ29udGV4dEluZm86IGFueSA9IHt9O1xuXHRcdG1QYXJhbWV0ZXJzID0gbVBhcmFtZXRlcnMgfHwge307XG5cblx0XHRpZiAob0NvbnRleHQuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIikpIHtcblx0XHRcdGlmIChtUGFyYW1ldGVycy5hc3luY0NvbnRleHQpIHtcblx0XHRcdFx0Ly8gdGhlIGNvbnRleHQgaXMgZWl0aGVyIGNyZWF0ZWQgYXN5bmMgKFByb21pc2UpXG5cdFx0XHRcdC8vIFdlIG5lZWQgdG8gYWN0aXZhdGUgdGhlIHJvdXRlTWF0Y2hTeW5jaHJvIG9uIHRoZSBSb3V0ZXJQcm94eSB0byBhdm9pZCB0aGF0XG5cdFx0XHRcdC8vIHRoZSBzdWJzZXF1ZW50IGNhbGwgdG8gbmF2aWdhdGVUb0NvbnRleHQgY29uZmxpY3RzIHdpdGggdGhlIGN1cnJlbnQgb25lXG5cdFx0XHRcdHRoaXMuX29Sb3V0ZXJQcm94eS5hY3RpdmF0ZVJvdXRlTWF0Y2hTeW5jaHJvbml6YXRpb24oKTtcblxuXHRcdFx0XHRtUGFyYW1ldGVycy5hc3luY0NvbnRleHRcblx0XHRcdFx0XHQudGhlbigoYXN5bmNDb250ZXh0OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdC8vIG9uY2UgdGhlIGNvbnRleHQgaXMgcmV0dXJuZWQgd2UgbmF2aWdhdGUgaW50byBpdFxuXHRcdFx0XHRcdFx0dGhpcy5uYXZpZ2F0ZVRvQ29udGV4dChhc3luY0NvbnRleHQsIHtcblx0XHRcdFx0XHRcdFx0Y2hlY2tOb0hhc2hDaGFuZ2U6IG1QYXJhbWV0ZXJzLmNoZWNrTm9IYXNoQ2hhbmdlLFxuXHRcdFx0XHRcdFx0XHRlZGl0YWJsZTogbVBhcmFtZXRlcnMuZWRpdGFibGUsXG5cdFx0XHRcdFx0XHRcdGJQZXJzaXN0T1BTY3JvbGw6IG1QYXJhbWV0ZXJzLmJQZXJzaXN0T1BTY3JvbGwsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZUZDTExldmVsOiBtUGFyYW1ldGVycy51cGRhdGVGQ0xMZXZlbCxcblx0XHRcdFx0XHRcdFx0YkZvcmNlRm9jdXM6IG1QYXJhbWV0ZXJzLmJGb3JjZUZvY3VzXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdpdGggdGhlIGFzeW5jIGNvbnRleHRcIiwgb0Vycm9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoIW1QYXJhbWV0ZXJzLmJEZWZlcnJlZENvbnRleHQpIHtcblx0XHRcdFx0Ly8gTmF2aWdhdGUgdG8gYSBsaXN0IGJpbmRpbmcgbm90IHlldCBzdXBwb3J0ZWRcblx0XHRcdFx0dGhyb3cgXCJuYXZpZ2F0aW9uIHRvIGEgbGlzdCBiaW5kaW5nIGlzIG5vdCB5ZXQgc3VwcG9ydGVkXCI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKG1QYXJhbWV0ZXJzLmNhbGxFeHRlbnNpb24pIHtcblx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsID0gdGhpcy5fb1ZpZXcuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKSBhcyBKU09OTW9kZWw7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9wYWdpbmF0b3JDdXJyZW50Q29udGV4dFwiLCBudWxsKTtcblxuXHRcdFx0b0NvbnRleHRJbmZvLnNvdXJjZUJpbmRpbmdDb250ZXh0ID0gb0NvbnRleHQuZ2V0T2JqZWN0KCk7XG5cdFx0XHRvQ29udGV4dEluZm8uYmluZGluZ0NvbnRleHQgPSBvQ29udGV4dDtcblx0XHRcdGlmIChtUGFyYW1ldGVycy5vRXZlbnQpIHtcblx0XHRcdFx0b0NvbnRleHRJbmZvLm9FdmVudCA9IG1QYXJhbWV0ZXJzLm9FdmVudDtcblx0XHRcdH1cblx0XHRcdC8vIFN0b3JpbmcgdGhlIHNlbGVjdGVkIGNvbnRleHQgdG8gdXNlIGl0IGluIGludGVybmFsIHJvdXRlIG5hdmlnYXRpb24gaWYgbmVjY2Vzc2FyeS5cblx0XHRcdGNvbnN0IGJPdmVycmlkZU5hdiA9ICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBhbnkpLnJvdXRpbmcub25CZWZvcmVOYXZpZ2F0aW9uKG9Db250ZXh0SW5mbyk7XG5cdFx0XHRpZiAoYk92ZXJyaWRlTmF2KSB7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KFwiL3BhZ2luYXRvckN1cnJlbnRDb250ZXh0XCIsIG9Db250ZXh0KTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bVBhcmFtZXRlcnMuRkNMTGV2ZWwgPSB0aGlzLl9nZXRGQ0xMZXZlbCgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX29Sb3V0aW5nU2VydmljZS5uYXZpZ2F0ZVRvQ29udGV4dChvQ29udGV4dCwgbVBhcmFtZXRlcnMsIHRoaXMuX29WaWV3LmdldFZpZXdEYXRhKCksIHRoaXMuX29UYXJnZXRJbmZvcm1hdGlvbik7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGVzIGJhY2t3YXJkcyBmcm9tIGEgY29udGV4dC5cblx0ICpcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgdG8gYmUgbmF2aWdhdGVkIGZyb21cblx0ICogQHBhcmFtIFttUGFyYW1ldGVyc10gT3B0aW9uYWwgbmF2aWdhdGlvbiBwYXJhbWV0ZXJzXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgbmF2aWdhdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0bmF2aWdhdGVCYWNrRnJvbUNvbnRleHQob0NvbnRleHQ6IGFueSwgbVBhcmFtZXRlcnM/OiBhbnkpIHtcblx0XHRtUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzIHx8IHt9O1xuXHRcdG1QYXJhbWV0ZXJzLnVwZGF0ZUZDTExldmVsID0gLTE7XG5cblx0XHRyZXR1cm4gdGhpcy5uYXZpZ2F0ZVRvQ29udGV4dChvQ29udGV4dCwgbVBhcmFtZXRlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyBmb3J3YXJkcyB0byBhIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IHRvIGJlIG5hdmlnYXRlZCB0b1xuXHQgKiBAcGFyYW0gbVBhcmFtZXRlcnMgT3B0aW9uYWwgbmF2aWdhdGlvbiBwYXJhbWV0ZXJzXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgbmF2aWdhdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0bmF2aWdhdGVGb3J3YXJkVG9Db250ZXh0KG9Db250ZXh0OiBhbnksIG1QYXJhbWV0ZXJzPzogYW55KTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0aWYgKHRoaXMuX29WaWV3LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik/LmdldFByb3BlcnR5KFwibWVzc2FnZUZvb3RlckNvbnRhaW5zRXJyb3JzXCIpID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHRcdH1cblx0XHRtUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzIHx8IHt9O1xuXHRcdG1QYXJhbWV0ZXJzLnVwZGF0ZUZDTExldmVsID0gMTtcblxuXHRcdHJldHVybiB0aGlzLm5hdmlnYXRlVG9Db250ZXh0KG9Db250ZXh0LCBtUGFyYW1ldGVycyk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGVzIGJhY2sgaW4gaGlzdG9yeSBpZiB0aGUgY3VycmVudCBoYXNoIGNvcnJlc3BvbmRzIHRvIGEgdHJhbnNpZW50IHN0YXRlLlxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdG5hdmlnYXRlQmFja0Zyb21UcmFuc2llbnRTdGF0ZSgpIHtcblx0XHRjb25zdCBzSGFzaCA9IHRoaXMuX29Sb3V0ZXJQcm94eS5nZXRIYXNoKCk7XG5cblx0XHQvLyBpZiB0cmlnZ2VyZWQgd2hpbGUgbmF2aWdhdGluZyB0byAoLi4uKSwgd2UgbmVlZCB0byBuYXZpZ2F0ZSBiYWNrXG5cdFx0aWYgKHNIYXNoLmluZGV4T2YoXCIoLi4uKVwiKSAhPT0gLTEpIHtcblx0XHRcdHRoaXMuX29Sb3V0ZXJQcm94eS5uYXZCYWNrKCk7XG5cdFx0fVxuXHR9XG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdG5hdmlnYXRlVG9NZXNzYWdlUGFnZShzRXJyb3JNZXNzYWdlOiBhbnksIG1QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRtUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzIHx8IHt9O1xuXHRcdGlmIChcblx0XHRcdHRoaXMuX29Sb3V0ZXJQcm94eS5nZXRIYXNoKCkuaW5kZXhPZihcImktYWN0aW9uPWNyZWF0ZVwiKSA+IC0xIHx8XG5cdFx0XHR0aGlzLl9vUm91dGVyUHJveHkuZ2V0SGFzaCgpLmluZGV4T2YoXCJpLWFjdGlvbj1hdXRvQ3JlYXRlXCIpID4gLTFcblx0XHQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vUm91dGVyUHJveHkubmF2VG9IYXNoKHRoaXMuX29Sb3V0aW5nU2VydmljZS5nZXREZWZhdWx0Q3JlYXRlSGFzaCgpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bVBhcmFtZXRlcnMuRkNMTGV2ZWwgPSB0aGlzLl9nZXRGQ0xMZXZlbCgpO1xuXG5cdFx0XHRyZXR1cm4gKHRoaXMuX29BcHBDb21wb25lbnQgYXMgYW55KS5nZXRSb290Vmlld0NvbnRyb2xsZXIoKS5kaXNwbGF5TWVzc2FnZVBhZ2Uoc0Vycm9yTWVzc2FnZSwgbVBhcmFtZXRlcnMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgb25lIG9mIHRoZSBjdXJyZW50IHZpZXdzIG9uIHRoZSBzY3JlZW4gaXMgYm91bmQgdG8gYSBnaXZlbiBjb250ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRleHRcblx0ICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBzdGF0ZSBpcyBpbXBhY3RlZCBieSB0aGUgY29udGV4dFxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRpc0N1cnJlbnRTdGF0ZUltcGFjdGVkQnkob0NvbnRleHQ6IGFueSkge1xuXHRcdHJldHVybiB0aGlzLl9vUm91dGluZ1NlcnZpY2UuaXNDdXJyZW50U3RhdGVJbXBhY3RlZEJ5KG9Db250ZXh0KTtcblx0fVxuXG5cdF9pc1ZpZXdQYXJ0T2ZSb3V0ZShyb3V0ZUluZm9ybWF0aW9uOiBhbnkpOiBib29sZWFuIHtcblx0XHRjb25zdCBhVGFyZ2V0cyA9IHJvdXRlSW5mb3JtYXRpb24/LnRhcmdldHM7XG5cdFx0aWYgKCFhVGFyZ2V0cyB8fCBhVGFyZ2V0cy5pbmRleE9mKHRoaXMuX29UYXJnZXRJbmZvcm1hdGlvbi50YXJnZXROYW1lKSA9PT0gLTEpIHtcblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZm9yIHRoaXMgdmlldyBoYXMgYSB2aWV3IGxldmVsIGdyZWF0ZXIgdGhhbiB0aGUgcm91dGUgbGV2ZWwsIGl0IG1lYW5zIHRoaXMgdmlldyBjb21lcyBcImFmdGVyXCIgdGhlIHJvdXRlXG5cdFx0XHQvLyBpbiB0ZXJtcyBvZiBuYXZpZ2F0aW9uLlxuXHRcdFx0Ly8gSW4gc3VjaCBjYXNlLCB3ZSByZW1vdmUgaXRzIGJpbmRpbmcgY29udGV4dCwgdG8gYXZvaWQgdGhpcyB2aWV3IHRvIGhhdmUgZGF0YSBpZiB3ZSBuYXZpZ2F0ZSB0byBpdCBsYXRlciBvblxuXHRcdFx0aWYgKCh0aGlzLl9vVGFyZ2V0SW5mb3JtYXRpb24udmlld0xldmVsID8/IDApID49IChyb3V0ZUluZm9ybWF0aW9uPy5yb3V0ZUxldmVsID8/IDApKSB7XG5cdFx0XHRcdHRoaXMuX3NldEJpbmRpbmdDb250ZXh0KG51bGwpOyAvLyBUaGlzIGFsc28gY2FsbCBzZXRLZWVwQWxpdmUoZmFsc2UpIG9uIHRoZSBjdXJyZW50IGNvbnRleHRcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdF9idWlsZEJpbmRpbmdQYXRoKHJvdXRlQXJndW1lbnRzOiBhbnksIGJpbmRpbmdQYXR0ZXJuOiBzdHJpbmcsIG5hdmlnYXRpb25QYXJhbWV0ZXJzOiBhbnkpOiB7IHBhdGg6IHN0cmluZzsgZGVmZXJyZWQ6IGJvb2xlYW4gfSB7XG5cdFx0bGV0IHBhdGggPSBiaW5kaW5nUGF0dGVybi5yZXBsYWNlKFwiOj9xdWVyeTpcIiwgXCJcIik7XG5cdFx0bGV0IGRlZmVycmVkID0gZmFsc2U7XG5cblx0XHRmb3IgKGNvbnN0IHNLZXkgaW4gcm91dGVBcmd1bWVudHMpIHtcblx0XHRcdGNvbnN0IHNWYWx1ZSA9IHJvdXRlQXJndW1lbnRzW3NLZXldO1xuXHRcdFx0aWYgKHNWYWx1ZSA9PT0gXCIuLi5cIiAmJiBiaW5kaW5nUGF0dGVybi5pbmRleE9mKGB7JHtzS2V5fX1gKSA+PSAwKSB7XG5cdFx0XHRcdGRlZmVycmVkID0gdHJ1ZTtcblx0XHRcdFx0Ly8gU29tZXRpbWVzIGluIHByZWZlcnJlZE1vZGUgPSBjcmVhdGUsIHRoZSBlZGl0IGJ1dHRvbiBpcyBzaG93biBpbiBiYWNrZ3JvdW5kIHdoZW4gdGhlXG5cdFx0XHRcdC8vIGFjdGlvbiBwYXJhbWV0ZXIgZGlhbG9nIHNob3dzIHVwLCBzZXR0aW5nIGJUYXJnZXRFZGl0YWJsZSBwYXNzZXMgZWRpdGFibGUgYXMgdHJ1ZVxuXHRcdFx0XHQvLyB0byBvbkJlZm9yZUJpbmRpbmcgaW4gX2JpbmRUYXJnZXRQYWdlIGZ1bmN0aW9uXG5cdFx0XHRcdG5hdmlnYXRpb25QYXJhbWV0ZXJzLmJUYXJnZXRFZGl0YWJsZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKGB7JHtzS2V5fX1gLCBzVmFsdWUpO1xuXHRcdH1cblx0XHRpZiAocm91dGVBcmd1bWVudHNbXCI/cXVlcnlcIl0gJiYgcm91dGVBcmd1bWVudHNbXCI/cXVlcnlcIl0uaGFzT3duUHJvcGVydHkoXCJpLWFjdGlvblwiKSkge1xuXHRcdFx0bmF2aWdhdGlvblBhcmFtZXRlcnMuYkFjdGlvbkNyZWF0ZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlIGJpbmRpbmcgcGF0aCBpcyBhbHdheXMgYWJzb2x1dGVcblx0XHRpZiAocGF0aCAmJiBwYXRoWzBdICE9PSBcIi9cIikge1xuXHRcdFx0cGF0aCA9IGAvJHtwYXRofWA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgcGF0aCwgZGVmZXJyZWQgfTtcblx0fVxuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vIE1ldGhvZHMgdG8gYmluZCB0aGUgcGFnZSB3aGVuIGEgcm91dGUgaXMgbWF0Y2hlZFxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiBhIHJvdXRlIGlzIG1hdGNoZWQuXG5cdCAqIEJ1aWxkcyB0aGUgYmluZGluZyBjb250ZXh0IGZyb20gdGhlIG5hdmlnYXRpb24gcGFyYW1ldGVycywgYW5kIGJpbmQgdGhlIHBhZ2UgYWNjb3JkaW5nbHkuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRXZlbnRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfb25Sb3V0ZU1hdGNoZWQob0V2ZW50OiBFdmVudCkge1xuXHRcdC8vIENoZWNrIGlmIHRoZSB0YXJnZXQgZm9yIHRoaXMgdmlldyBpcyBwYXJ0IG9mIHRoZSBldmVudCB0YXJnZXRzIChpLmUuIGlzIGEgdGFyZ2V0IGZvciB0aGUgY3VycmVudCByb3V0ZSkuXG5cdFx0Ly8gSWYgbm90LCB3ZSBkb24ndCBuZWVkIHRvIGJpbmQgaXQgLS0+IHJldHVyblxuXHRcdGlmICghdGhpcy5faXNWaWV3UGFydE9mUm91dGUob0V2ZW50LmdldFBhcmFtZXRlcihcInJvdXRlSW5mb3JtYXRpb25cIikpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gUmV0cmlldmUgdGhlIGJpbmRpbmcgY29udGV4dCBwYXR0ZXJuXG5cdFx0bGV0IGJpbmRpbmdQYXR0ZXJuO1xuXHRcdGlmICh0aGlzLl9vUGFnZUNvbXBvbmVudCAmJiB0aGlzLl9vUGFnZUNvbXBvbmVudC5nZXRCaW5kaW5nQ29udGV4dFBhdHRlcm4pIHtcblx0XHRcdGJpbmRpbmdQYXR0ZXJuID0gdGhpcy5fb1BhZ2VDb21wb25lbnQuZ2V0QmluZGluZ0NvbnRleHRQYXR0ZXJuKCk7XG5cdFx0fVxuXHRcdGJpbmRpbmdQYXR0ZXJuID0gYmluZGluZ1BhdHRlcm4gfHwgdGhpcy5fb1RhcmdldEluZm9ybWF0aW9uLmNvbnRleHRQYXR0ZXJuO1xuXG5cdFx0aWYgKGJpbmRpbmdQYXR0ZXJuID09PSBudWxsIHx8IGJpbmRpbmdQYXR0ZXJuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIERvbid0IGRvIHRoaXMgaWYgd2UgYWxyZWFkeSBnb3Qgc1RhcmdldCA9PSAnJywgd2hpY2ggaXMgYSB2YWxpZCB0YXJnZXQgcGF0dGVyblxuXHRcdFx0YmluZGluZ1BhdHRlcm4gPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwicm91dGVQYXR0ZXJuXCIpO1xuXHRcdH1cblxuXHRcdC8vIFJlcGxhY2UgdGhlIHBhcmFtZXRlcnMgYnkgdGhlaXIgdmFsdWVzIGluIHRoZSBiaW5kaW5nIGNvbnRleHQgcGF0dGVyblxuXHRcdGNvbnN0IG1Bcmd1bWVudHMgPSAob0V2ZW50LmdldFBhcmFtZXRlcnMoKSBhcyBhbnkpLmFyZ3VtZW50cztcblx0XHRjb25zdCBvTmF2aWdhdGlvblBhcmFtZXRlcnMgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwibmF2aWdhdGlvbkluZm9cIik7XG5cdFx0Y29uc3QgeyBwYXRoLCBkZWZlcnJlZCB9ID0gdGhpcy5fYnVpbGRCaW5kaW5nUGF0aChtQXJndW1lbnRzLCBiaW5kaW5nUGF0dGVybiwgb05hdmlnYXRpb25QYXJhbWV0ZXJzKTtcblxuXHRcdHRoaXMub25Sb3V0ZU1hdGNoZWQoKTtcblxuXHRcdGNvbnN0IG9Nb2RlbCA9IHRoaXMuX29WaWV3LmdldE1vZGVsKCkgYXMgT0RhdGFNb2RlbDtcblx0XHRsZXQgb091dDtcblx0XHRpZiAoZGVmZXJyZWQpIHtcblx0XHRcdG9PdXQgPSB0aGlzLl9iaW5kRGVmZXJyZWQocGF0aCwgb05hdmlnYXRpb25QYXJhbWV0ZXJzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b091dCA9IHRoaXMuX2JpbmRQYWdlKHBhdGgsIG9Nb2RlbCwgb05hdmlnYXRpb25QYXJhbWV0ZXJzKTtcblx0XHR9XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0b091dC5maW5hbGx5KCgpID0+IHtcblx0XHRcdHRoaXMub25Sb3V0ZU1hdGNoZWRGaW5pc2hlZCgpO1xuXHRcdH0pO1xuXG5cdFx0KHRoaXMuX29BcHBDb21wb25lbnQgYXMgYW55KS5nZXRSb290Vmlld0NvbnRyb2xsZXIoKS51cGRhdGVVSVN0YXRlRm9yVmlldyh0aGlzLl9vVmlldywgdGhpcy5fZ2V0RkNMTGV2ZWwoKSk7XG5cdH1cblxuXHQvKipcblx0ICogRGVmZXJyZWQgYmluZGluZyAoZHVyaW5nIG9iamVjdCBjcmVhdGlvbikuXG5cdCAqXG5cdCAqIEBwYXJhbSBzVGFyZ2V0UGF0aCBUaGUgcGF0aCB0byB0aGUgZGVmZmVyZWQgY29udGV4dFxuXHQgKiBAcGFyYW0gb05hdmlnYXRpb25QYXJhbWV0ZXJzIE5hdmlnYXRpb24gcGFyYW1ldGVyc1xuXHQgKiBAcmV0dXJucyBBIFByb21pc2Vcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfYmluZERlZmVycmVkKHNUYXJnZXRQYXRoOiBzdHJpbmcsIG9OYXZpZ2F0aW9uUGFyYW1ldGVyczogYW55KSB7XG5cdFx0dGhpcy5vbkJlZm9yZUJpbmRpbmcobnVsbCwgeyBlZGl0YWJsZTogb05hdmlnYXRpb25QYXJhbWV0ZXJzLmJUYXJnZXRFZGl0YWJsZSB9KTtcblxuXHRcdGlmIChvTmF2aWdhdGlvblBhcmFtZXRlcnMuYkRlZmVycmVkQ29udGV4dCB8fCAhb05hdmlnYXRpb25QYXJhbWV0ZXJzLm9Bc3luY0NvbnRleHQpIHtcblx0XHRcdC8vIGVpdGhlciB0aGUgY29udGV4dCBzaGFsbCBiZSBjcmVhdGVkIGluIHRoZSB0YXJnZXQgcGFnZSAoZGVmZXJyZWQgQ29udGV4dCkgb3IgaXQgc2hhbGxcblx0XHRcdC8vIGJlIGNyZWF0ZWQgYXN5bmMgYnV0IHRoZSB1c2VyIHJlZnJlc2hlZCB0aGUgcGFnZSAvIGJvb2ttYXJrZWQgdGhpcyBVUkxcblx0XHRcdC8vIFRPRE86IGN1cnJlbnRseSB0aGUgdGFyZ2V0IGNvbXBvbmVudCBjcmVhdGVzIHRoaXMgZG9jdW1lbnQgYnV0IHdlIHNoYWxsIG1vdmUgdGhpcyB0b1xuXHRcdFx0Ly8gYSBjZW50cmFsIHBsYWNlXG5cdFx0XHRpZiAodGhpcy5fb1BhZ2VDb21wb25lbnQgJiYgdGhpcy5fb1BhZ2VDb21wb25lbnQuY3JlYXRlRGVmZXJyZWRDb250ZXh0KSB7XG5cdFx0XHRcdHRoaXMuX29QYWdlQ29tcG9uZW50LmNyZWF0ZURlZmVycmVkQ29udGV4dChcblx0XHRcdFx0XHRzVGFyZ2V0UGF0aCxcblx0XHRcdFx0XHRvTmF2aWdhdGlvblBhcmFtZXRlcnMudXNlQ29udGV4dCxcblx0XHRcdFx0XHRvTmF2aWdhdGlvblBhcmFtZXRlcnMuYkFjdGlvbkNyZWF0ZVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IGN1cnJlbnRCaW5kaW5nQ29udGV4dCA9IHRoaXMuX2dldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0aWYgKGN1cnJlbnRCaW5kaW5nQ29udGV4dD8uaGFzUGVuZGluZ0NoYW5nZXMoKSkge1xuXHRcdFx0Ly8gRm9yIG5vdyByZW1vdmUgdGhlIHBlbmRpbmcgY2hhbmdlcyB0byBhdm9pZCB0aGUgbW9kZWwgcmFpc2VzIGVycm9ycyBhbmQgdGhlIG9iamVjdCBwYWdlIGlzIGF0IGxlYXN0IGJvdW5kXG5cdFx0XHQvLyBJZGVhbGx5IHRoZSB1c2VyIHNob3VsZCBiZSBhc2tlZCBmb3Jcblx0XHRcdGN1cnJlbnRCaW5kaW5nQ29udGV4dC5nZXRCaW5kaW5nKCkucmVzZXRDaGFuZ2VzKCk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVtb3ZlIHRoZSBjb250ZXh0IHRvIGF2b2lkIHNob3dpbmcgb2xkIGRhdGFcblx0XHR0aGlzLl9zZXRCaW5kaW5nQ29udGV4dChudWxsKTtcblxuXHRcdHRoaXMub25BZnRlckJpbmRpbmcobnVsbCk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGJpbmRpbmcgY29udGV4dCBvZiB0aGUgcGFnZSBmcm9tIGEgcGF0aC5cblx0ICpcblx0ICogQHBhcmFtIHNUYXJnZXRQYXRoIFRoZSBwYXRoIHRvIHRoZSBjb250ZXh0XG5cdCAqIEBwYXJhbSBvTW9kZWwgVGhlIE9EYXRhIG1vZGVsXG5cdCAqIEBwYXJhbSBvTmF2aWdhdGlvblBhcmFtZXRlcnMgTmF2aWdhdGlvbiBwYXJhbWV0ZXJzXG5cdCAqIEByZXR1cm5zIEEgUHJvbWlzZSByZXNvbHZlZCBvbmNlIHRoZSBiaW5kaW5nIGhhcyBiZWVuIHNldCBvbiB0aGUgcGFnZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdF9iaW5kUGFnZShzVGFyZ2V0UGF0aDogc3RyaW5nLCBvTW9kZWw6IE9EYXRhTW9kZWwsIG9OYXZpZ2F0aW9uUGFyYW1ldGVyczogb2JqZWN0KSB7XG5cdFx0aWYgKHNUYXJnZXRQYXRoID09PSBcIlwiKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JpbmRQYWdlVG9Db250ZXh0KG51bGwsIG9Nb2RlbCwgb05hdmlnYXRpb25QYXJhbWV0ZXJzKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9yZXNvbHZlU2VtYW50aWNQYXRoKHNUYXJnZXRQYXRoLCBvTW9kZWwpXG5cdFx0XHRcdC50aGVuKChzVGVjaG5pY2FsUGF0aDogYW55KSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fYmluZFBhZ2VUb1BhdGgoc1RlY2huaWNhbFBhdGgsIG9Nb2RlbCwgb05hdmlnYXRpb25QYXJhbWV0ZXJzKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdC8vIEVycm9yIGhhbmRsaW5nIGZvciBlcnJvbmVvdXMgbWV0YWRhdGEgcmVxdWVzdFxuXHRcdFx0XHRcdGNvbnN0IG9SZXNvdXJjZUJ1bmRsZSA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIik7XG5cblx0XHRcdFx0XHR0aGlzLm5hdmlnYXRlVG9NZXNzYWdlUGFnZShvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfQ09NTU9OX1NBUEZFX0RBVEFfUkVDRUlWRURfRVJST1JcIiksIHtcblx0XHRcdFx0XHRcdHRpdGxlOiBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfQ09NTU9OX1NBUEZFX0VSUk9SXCIpLFxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9FcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBmaWx0ZXIgdG8gcmV0cmlldmUgYSBjb250ZXh0IGNvcnJlc3BvbmRpbmcgdG8gYSBzZW1hbnRpYyBwYXRoLlxuXHQgKlxuXHQgKiBAcGFyYW0gc1NlbWFudGljUGF0aCBUaGUgc2VtYW50aWMgcGF0aFxuXHQgKiBAcGFyYW0gYVNlbWFudGljS2V5cyBUaGUgc2VtYW50aWMga2V5cyBmb3IgdGhlIHBhdGhcblx0ICogQHBhcmFtIG9NZXRhTW9kZWwgVGhlIGluc3RhbmNlIG9mIHRoZSBtZXRhIG1vZGVsXG5cdCAqIEByZXR1cm5zIFRoZSBmaWx0ZXJcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfY3JlYXRlRmlsdGVyRnJvbVNlbWFudGljUGF0aChzU2VtYW50aWNQYXRoOiBzdHJpbmcsIGFTZW1hbnRpY0tleXM6IGFueVtdLCBvTWV0YU1vZGVsOiBvYmplY3QpIHtcblx0XHRjb25zdCBmblVucXVvdGVBbmREZWNvZGUgPSBmdW5jdGlvbiAoc1ZhbHVlOiBhbnkpIHtcblx0XHRcdGlmIChzVmFsdWUuaW5kZXhPZihcIidcIikgPT09IDAgJiYgc1ZhbHVlLmxhc3RJbmRleE9mKFwiJ1wiKSA9PT0gc1ZhbHVlLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBxdW90ZXMgZnJvbSB0aGUgdmFsdWUgYW5kIGRlY29kZSBzcGVjaWFsIGNoYXJzXG5cdFx0XHRcdHNWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChzVmFsdWUuc3Vic3RyaW5nKDEsIHNWYWx1ZS5sZW5ndGggLSAxKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc1ZhbHVlO1xuXHRcdH07XG5cdFx0Y29uc3QgYUtleVZhbHVlcyA9IHNTZW1hbnRpY1BhdGguc3Vic3RyaW5nKHNTZW1hbnRpY1BhdGguaW5kZXhPZihcIihcIikgKyAxLCBzU2VtYW50aWNQYXRoLmxlbmd0aCAtIDEpLnNwbGl0KFwiLFwiKTtcblx0XHRsZXQgYUZpbHRlcnM6IEZpbHRlcltdO1xuXG5cdFx0aWYgKGFTZW1hbnRpY0tleXMubGVuZ3RoICE9IGFLZXlWYWx1ZXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBiRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZSA9IE1vZGVsSGVscGVyLmlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZShvTWV0YU1vZGVsKTtcblxuXHRcdGlmIChhU2VtYW50aWNLZXlzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0Ly8gVGFrZSB0aGUgZmlyc3Qga2V5IHZhbHVlXG5cdFx0XHRjb25zdCBzS2V5VmFsdWUgPSBmblVucXVvdGVBbmREZWNvZGUoYUtleVZhbHVlc1swXSk7XG5cdFx0XHRhRmlsdGVycyA9IFtcblx0XHRcdFx0bmV3IEZpbHRlcih7XG5cdFx0XHRcdFx0cGF0aDogYVNlbWFudGljS2V5c1swXS4kUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdG9wZXJhdG9yOiBGaWx0ZXJPcGVyYXRvci5FUSxcblx0XHRcdFx0XHR2YWx1ZTE6IHNLZXlWYWx1ZSxcblx0XHRcdFx0XHRjYXNlU2Vuc2l0aXZlOiBiRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZVxuXHRcdFx0XHR9KVxuXHRcdFx0XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgbUtleVZhbHVlczogYW55ID0ge307XG5cdFx0XHQvLyBDcmVhdGUgYSBtYXAgb2YgYWxsIGtleSB2YWx1ZXNcblx0XHRcdGFLZXlWYWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAoc0tleUFzc2lnbm1lbnQ6IHN0cmluZykge1xuXHRcdFx0XHRjb25zdCBhUGFydHMgPSBzS2V5QXNzaWdubWVudC5zcGxpdChcIj1cIiksXG5cdFx0XHRcdFx0c0tleVZhbHVlID0gZm5VbnF1b3RlQW5kRGVjb2RlKGFQYXJ0c1sxXSk7XG5cblx0XHRcdFx0bUtleVZhbHVlc1thUGFydHNbMF1dID0gc0tleVZhbHVlO1xuXHRcdFx0fSk7XG5cblx0XHRcdGxldCBiRmFpbGVkID0gZmFsc2U7XG5cdFx0XHRhRmlsdGVycyA9IGFTZW1hbnRpY0tleXMubWFwKGZ1bmN0aW9uIChvU2VtYW50aWNLZXk6IGFueSkge1xuXHRcdFx0XHRjb25zdCBzS2V5ID0gb1NlbWFudGljS2V5LiRQcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0c1ZhbHVlID0gbUtleVZhbHVlc1tzS2V5XTtcblxuXHRcdFx0XHRpZiAoc1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IEZpbHRlcih7XG5cdFx0XHRcdFx0XHRwYXRoOiBzS2V5LFxuXHRcdFx0XHRcdFx0b3BlcmF0b3I6IEZpbHRlck9wZXJhdG9yLkVRLFxuXHRcdFx0XHRcdFx0dmFsdWUxOiBzVmFsdWUsXG5cdFx0XHRcdFx0XHRjYXNlU2Vuc2l0aXZlOiBiRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGJGYWlsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybiBuZXcgRmlsdGVyKHtcblx0XHRcdFx0XHRcdHBhdGg6IFwiWFhcIlxuXHRcdFx0XHRcdH0pOyAvLyB3aWxsIGJlIGlnbm9yZSBhbnl3YXkgc2luY2Ugd2UgcmV0dXJuIGFmdGVyXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoYkZhaWxlZCkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBZGQgYSBkcmFmdCBmaWx0ZXIgdG8gbWFrZSBzdXJlIHdlIHRha2UgdGhlIGRyYWZ0IGVudGl0eSBpZiB0aGVyZSBpcyBvbmVcblx0XHQvLyBPciB0aGUgYWN0aXZlIGVudGl0eSBvdGhlcndpc2Vcblx0XHRjb25zdCBvRHJhZnRGaWx0ZXIgPSBuZXcgRmlsdGVyKHtcblx0XHRcdGZpbHRlcnM6IFtuZXcgRmlsdGVyKFwiSXNBY3RpdmVFbnRpdHlcIiwgXCJFUVwiLCBmYWxzZSksIG5ldyBGaWx0ZXIoXCJTaWJsaW5nRW50aXR5L0lzQWN0aXZlRW50aXR5XCIsIFwiRVFcIiwgbnVsbCldLFxuXHRcdFx0YW5kOiBmYWxzZVxuXHRcdH0pO1xuXHRcdGFGaWx0ZXJzLnB1c2gob0RyYWZ0RmlsdGVyKTtcblxuXHRcdHJldHVybiBuZXcgRmlsdGVyKGFGaWx0ZXJzLCB0cnVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHBhdGggd2l0aCBzZW1hbnRpYyBrZXlzIHRvIGEgcGF0aCB3aXRoIHRlY2huaWNhbCBrZXlzLlxuXHQgKlxuXHQgKiBAcGFyYW0gc1NlbWFudGljUGF0aCBUaGUgcGF0aCB3aXRoIHNlbWFudGljIGtleXNcblx0ICogQHBhcmFtIG9Nb2RlbCBUaGUgbW9kZWwgZm9yIHRoZSBwYXRoXG5cdCAqIEBwYXJhbSBhU2VtYW50aWNLZXlzIFRoZSBzZW1hbnRpYyBrZXlzIGZvciB0aGUgcGF0aFxuXHQgKiBAcmV0dXJucyBBIFByb21pc2UgY29udGFpbmluZyB0aGUgcGF0aCB3aXRoIHRlY2huaWNhbCBrZXlzIGlmIHNTZW1hbnRpY1BhdGggY291bGQgYmUgaW50ZXJwcmV0ZWQgYXMgYSBzZW1hbnRpYyBwYXRoLCBudWxsIG90aGVyd2lzZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdF9nZXRUZWNobmljYWxQYXRoRnJvbVNlbWFudGljUGF0aChzU2VtYW50aWNQYXRoOiBzdHJpbmcsIG9Nb2RlbDogYW55LCBhU2VtYW50aWNLZXlzOiBhbnlbXSkge1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0bGV0IHNFbnRpdHlTZXRQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhQ29udGV4dChzU2VtYW50aWNQYXRoKS5nZXRQYXRoKCk7XG5cblx0XHRpZiAoIWFTZW1hbnRpY0tleXMgfHwgYVNlbWFudGljS2V5cy5sZW5ndGggPT09IDApIHtcblx0XHRcdC8vIE5vIHNlbWFudGljIGtleXNcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXG5cdFx0Ly8gQ3JlYXRlIGEgc2V0IG9mIGZpbHRlcnMgY29ycmVzcG9uZGluZyB0byBhbGwga2V5c1xuXHRcdGNvbnN0IG9GaWx0ZXIgPSB0aGlzLl9jcmVhdGVGaWx0ZXJGcm9tU2VtYW50aWNQYXRoKHNTZW1hbnRpY1BhdGgsIGFTZW1hbnRpY0tleXMsIG9NZXRhTW9kZWwpO1xuXHRcdGlmIChvRmlsdGVyID09PSBudWxsKSB7XG5cdFx0XHQvLyBDb3VsZG4ndCBpbnRlcnByZXQgdGhlIHBhdGggYXMgYSBzZW1hbnRpYyBvbmVcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXG5cdFx0Ly8gTG9hZCB0aGUgY29ycmVzcG9uZGluZyBvYmplY3Rcblx0XHRpZiAoIXNFbnRpdHlTZXRQYXRoPy5zdGFydHNXaXRoKFwiL1wiKSkge1xuXHRcdFx0c0VudGl0eVNldFBhdGggPSBgLyR7c0VudGl0eVNldFBhdGh9YDtcblx0XHR9XG5cdFx0Y29uc3Qgb0xpc3RCaW5kaW5nID0gb01vZGVsLmJpbmRMaXN0KHNFbnRpdHlTZXRQYXRoLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgb0ZpbHRlciwge1xuXHRcdFx0XCIkJGdyb3VwSWRcIjogXCIkYXV0by5IZXJvZXNcIlxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIG9MaXN0QmluZGluZy5yZXF1ZXN0Q29udGV4dHMoMCwgMikudGhlbihmdW5jdGlvbiAob0NvbnRleHRzOiBhbnkpIHtcblx0XHRcdGlmIChvQ29udGV4dHMgJiYgb0NvbnRleHRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gb0NvbnRleHRzWzBdLmdldFBhdGgoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIE5vIGRhdGEgY291bGQgYmUgbG9hZGVkXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBhIHBhdGggaXMgZWxpZ2libGUgZm9yIHNlbWFudGljIGJvb2ttYXJraW5nLlxuXHQgKlxuXHQgKiBAcGFyYW0gc1BhdGggVGhlIHBhdGggdG8gdGVzdFxuXHQgKiBAcGFyYW0gb01ldGFNb2RlbCBUaGUgYXNzb2NpYXRlZCBtZXRhZGF0YSBtb2RlbFxuXHQgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHBhdGggaXMgZWxpZ2libGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfY2hlY2tQYXRoRm9yU2VtYW50aWNCb29rbWFya2luZyhzUGF0aDogc3RyaW5nLCBvTWV0YU1vZGVsOiBhbnkpIHtcblx0XHQvLyBPbmx5IHBhdGggb24gcm9vdCBvYmplY3RzIGFsbG93IHNlbWFudGljIGJvb2ttYXJraW5nLCBpLmUuIHNQYXRoID0geHh4KHl5eSlcblx0XHRjb25zdCBhTWF0Y2hlcyA9IC9eW1xcL10/KFxcdyspXFwoW15cXC9dK1xcKSQvLmV4ZWMoc1BhdGgpO1xuXHRcdGlmICghYU1hdGNoZXMpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0Ly8gR2V0IHRoZSBlbnRpdHlTZXQgbmFtZVxuXHRcdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gYC8ke2FNYXRjaGVzWzFdfWA7XG5cdFx0Ly8gQ2hlY2sgdGhlIGVudGl0eSBzZXQgc3VwcG9ydHMgZHJhZnQgKG90aGVyd2lzZSB3ZSBkb24ndCBzdXBwb3J0IHNlbWFudGljIGJvb2ttYXJraW5nKVxuXHRcdGNvbnN0IG9EcmFmdFJvb3QgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzRW50aXR5U2V0UGF0aH1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdGApO1xuXHRcdGNvbnN0IG9EcmFmdE5vZGUgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzRW50aXR5U2V0UGF0aH1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Tm9kZWApO1xuXHRcdHJldHVybiBvRHJhZnRSb290IHx8IG9EcmFmdE5vZGUgPyB0cnVlIDogZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQnVpbGRzIGEgcGF0aCB3aXRoIHNlbWFudGljIGtleXMgZnJvbSBhIHBhdGggd2l0aCB0ZWNobmljYWwga2V5cy5cblx0ICpcblx0ICogQHBhcmFtIHNQYXRoVG9SZXNvbHZlIFRoZSBwYXRoIHRvIGJlIHRyYW5zZm9ybWVkXG5cdCAqIEBwYXJhbSBvTW9kZWwgVGhlIE9EYXRhIG1vZGVsXG5cdCAqIEByZXR1cm5zIFN0cmluZyBwcm9taXNlIGZvciB0aGUgbmV3IHBhdGguIElmIHNQYXRoVG9SZXNvbHZlZCBjb3VsZG4ndCBiZSBpbnRlcnByZXRlZCBhcyBhIHNlbWFudGljIHBhdGgsIGl0IGlzIHJldHVybmVkIGFzIGlzLlxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdF9yZXNvbHZlU2VtYW50aWNQYXRoKHNQYXRoVG9SZXNvbHZlOiBzdHJpbmcsIG9Nb2RlbDogYW55KTogUHJvbWlzZTxzdHJpbmc+IHtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHRcdGNvbnN0IG9MYXN0U2VtYW50aWNNYXBwaW5nID0gdGhpcy5fb1JvdXRpbmdTZXJ2aWNlLmdldExhc3RTZW1hbnRpY01hcHBpbmcoKTtcblx0XHRsZXQgc0N1cnJlbnRIYXNoTm9QYXJhbXMgPSB0aGlzLl9vUm91dGVyLmdldEhhc2hDaGFuZ2VyKCkuZ2V0SGFzaCgpLnNwbGl0KFwiP1wiKVswXTtcblxuXHRcdGlmIChzQ3VycmVudEhhc2hOb1BhcmFtcyAmJiBzQ3VycmVudEhhc2hOb1BhcmFtcy5sYXN0SW5kZXhPZihcIi9cIikgPT09IHNDdXJyZW50SGFzaE5vUGFyYW1zLmxlbmd0aCAtIDEpIHtcblx0XHRcdC8vIFJlbW92ZSB0cmFpbGluZyAnLydcblx0XHRcdHNDdXJyZW50SGFzaE5vUGFyYW1zID0gc0N1cnJlbnRIYXNoTm9QYXJhbXMuc3Vic3RyaW5nKDAsIHNDdXJyZW50SGFzaE5vUGFyYW1zLmxlbmd0aCAtIDEpO1xuXHRcdH1cblxuXHRcdGxldCBzUm9vdEVudGl0eU5hbWUgPSBzQ3VycmVudEhhc2hOb1BhcmFtcyAmJiBzQ3VycmVudEhhc2hOb1BhcmFtcy5zdWJzdHIoMCwgc0N1cnJlbnRIYXNoTm9QYXJhbXMuaW5kZXhPZihcIihcIikpO1xuXHRcdGlmIChzUm9vdEVudGl0eU5hbWUuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdHNSb290RW50aXR5TmFtZSA9IHNSb290RW50aXR5TmFtZS5zdWJzdHJpbmcoMSk7XG5cdFx0fVxuXHRcdGNvbnN0IGJBbGxvd1NlbWFudGljQm9va21hcmsgPSB0aGlzLl9jaGVja1BhdGhGb3JTZW1hbnRpY0Jvb2ttYXJraW5nKHNDdXJyZW50SGFzaE5vUGFyYW1zLCBvTWV0YU1vZGVsKSxcblx0XHRcdGFTZW1hbnRpY0tleXMgPSBiQWxsb3dTZW1hbnRpY0Jvb2ttYXJrICYmIFNlbWFudGljS2V5SGVscGVyLmdldFNlbWFudGljS2V5cyhvTWV0YU1vZGVsLCBzUm9vdEVudGl0eU5hbWUpO1xuXHRcdGlmICghYVNlbWFudGljS2V5cykge1xuXHRcdFx0Ly8gTm8gc2VtYW50aWMga2V5cyBhdmFpbGFibGUgLS0+IHVzZSB0aGUgcGF0aCBhcyBpc1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShzUGF0aFRvUmVzb2x2ZSk7XG5cdFx0fSBlbHNlIGlmIChvTGFzdFNlbWFudGljTWFwcGluZyAmJiBvTGFzdFNlbWFudGljTWFwcGluZy5zZW1hbnRpY1BhdGggPT09IHNQYXRoVG9SZXNvbHZlKSB7XG5cdFx0XHQvLyBUaGlzIHNlbWFudGljIHBhdGggaGFzIGJlZW4gcmVzb2x2ZWQgcHJldmlvdXNseVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShvTGFzdFNlbWFudGljTWFwcGluZy50ZWNobmljYWxQYXRoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gV2UgbmVlZCByZXNvbHZlIHRoZSBzZW1hbnRpYyBwYXRoIHRvIGdldCB0aGUgdGVjaG5pY2FsIGtleXNcblx0XHRcdHJldHVybiB0aGlzLl9nZXRUZWNobmljYWxQYXRoRnJvbVNlbWFudGljUGF0aChzQ3VycmVudEhhc2hOb1BhcmFtcywgb01vZGVsLCBhU2VtYW50aWNLZXlzKS50aGVuKChzVGVjaG5pY2FsUGF0aDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChzVGVjaG5pY2FsUGF0aCAmJiBzVGVjaG5pY2FsUGF0aCAhPT0gc1BhdGhUb1Jlc29sdmUpIHtcblx0XHRcdFx0XHQvLyBUaGUgc2VtYW50aWMgcGF0aCB3YXMgcmVzb2x2ZWQgKG90aGVyd2lzZSBrZWVwIHRoZSBvcmlnaW5hbCB2YWx1ZSBmb3IgdGFyZ2V0KVxuXHRcdFx0XHRcdHRoaXMuX29Sb3V0aW5nU2VydmljZS5zZXRMYXN0U2VtYW50aWNNYXBwaW5nKHtcblx0XHRcdFx0XHRcdHRlY2huaWNhbFBhdGg6IHNUZWNobmljYWxQYXRoLFxuXHRcdFx0XHRcdFx0c2VtYW50aWNQYXRoOiBzUGF0aFRvUmVzb2x2ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybiBzVGVjaG5pY2FsUGF0aDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gc1BhdGhUb1Jlc29sdmU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBiaW5kaW5nIGNvbnRleHQgb2YgdGhlIHBhZ2UgZnJvbSBhIHBhdGguXG5cdCAqXG5cdCAqIEBwYXJhbSBzVGFyZ2V0UGF0aCBUaGUgcGF0aCB0byBidWlsZCB0aGUgY29udGV4dC4gTmVlZHMgdG8gY29udGFpbiB0ZWNobmljYWwga2V5cyBvbmx5LlxuXHQgKiBAcGFyYW0gb01vZGVsIFRoZSBPRGF0YSBtb2RlbFxuXHQgKiBAcGFyYW0gb05hdmlnYXRpb25QYXJhbWV0ZXJzIE5hdmlnYXRpb24gcGFyYW1ldGVyc1xuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdF9iaW5kUGFnZVRvUGF0aChzVGFyZ2V0UGF0aDogc3RyaW5nLCBvTW9kZWw6IGFueSwgb05hdmlnYXRpb25QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRjb25zdCBvQ3VycmVudENvbnRleHQgPSB0aGlzLl9nZXRCaW5kaW5nQ29udGV4dCgpLFxuXHRcdFx0c0N1cnJlbnRQYXRoID0gb0N1cnJlbnRDb250ZXh0ICYmIG9DdXJyZW50Q29udGV4dC5nZXRQYXRoKCksXG5cdFx0XHRvVXNlQ29udGV4dCA9IG9OYXZpZ2F0aW9uUGFyYW1ldGVycy51c2VDb250ZXh0O1xuXG5cdFx0Ly8gV2Ugc2V0IHRoZSBiaW5kaW5nIGNvbnRleHQgb25seSBpZiBpdCdzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IG9uZVxuXHRcdC8vIG9yIGlmIHdlIGhhdmUgYSBjb250ZXh0IGFscmVhZHkgc2VsZWN0ZWRcblx0XHRpZiAoc0N1cnJlbnRQYXRoICE9PSBzVGFyZ2V0UGF0aCB8fCAob1VzZUNvbnRleHQgJiYgb1VzZUNvbnRleHQuZ2V0UGF0aCgpID09PSBzVGFyZ2V0UGF0aCkpIHtcblx0XHRcdGxldCBvVGFyZ2V0Q29udGV4dDtcblx0XHRcdGlmIChvVXNlQ29udGV4dCAmJiBvVXNlQ29udGV4dC5nZXRQYXRoKCkgPT09IHNUYXJnZXRQYXRoKSB7XG5cdFx0XHRcdC8vIFdlIGFscmVhZHkgaGF2ZSB0aGUgY29udGV4dCB0byBiZSB1c2VkXG5cdFx0XHRcdG9UYXJnZXRDb250ZXh0ID0gb1VzZUNvbnRleHQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBPdGhlcndpc2Ugd2UgbmVlZCB0byBjcmVhdGUgaXQgZnJvbSBzVGFyZ2V0UGF0aFxuXHRcdFx0XHRvVGFyZ2V0Q29udGV4dCA9IHRoaXMuX2NyZWF0ZUNvbnRleHQoc1RhcmdldFBhdGgsIG9Nb2RlbCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob1RhcmdldENvbnRleHQgIT09IG9DdXJyZW50Q29udGV4dCkge1xuXHRcdFx0XHR0aGlzLl9iaW5kUGFnZVRvQ29udGV4dChvVGFyZ2V0Q29udGV4dCwgb01vZGVsLCBvTmF2aWdhdGlvblBhcmFtZXRlcnMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIW9OYXZpZ2F0aW9uUGFyYW1ldGVycy5iUmVhc29uSXNJYXBwU3RhdGUgJiYgRWRpdFN0YXRlLmlzRWRpdFN0YXRlRGlydHkoKSkge1xuXHRcdFx0dGhpcy5fcmVmcmVzaEJpbmRpbmdDb250ZXh0KG9DdXJyZW50Q29udGV4dCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIHRoZSBwYWdlIHRvIGEgY29udGV4dC5cblx0ICpcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgdG8gYmUgYm91bmRcblx0ICogQHBhcmFtIG9Nb2RlbCBUaGUgT0RhdGEgbW9kZWxcblx0ICogQHBhcmFtIG9OYXZpZ2F0aW9uUGFyYW1ldGVycyBOYXZpZ2F0aW9uIHBhcmFtZXRlcnNcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfYmluZFBhZ2VUb0NvbnRleHQob0NvbnRleHQ6IENvbnRleHQgfCBudWxsLCBvTW9kZWw6IE9EYXRhTW9kZWwsIG9OYXZpZ2F0aW9uUGFyYW1ldGVyczogYW55KSB7XG5cdFx0aWYgKCFvQ29udGV4dCkge1xuXHRcdFx0dGhpcy5vbkJlZm9yZUJpbmRpbmcobnVsbCk7XG5cdFx0XHR0aGlzLm9uQWZ0ZXJCaW5kaW5nKG51bGwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9QYXJlbnRMaXN0QmluZGluZyA9IG9Db250ZXh0LmdldEJpbmRpbmcoKTtcblx0XHRjb25zdCBvUm9vdFZpZXdDb250cm9sbGVyID0gKHRoaXMuX29BcHBDb21wb25lbnQgYXMgYW55KS5nZXRSb290Vmlld0NvbnRyb2xsZXIoKTtcblx0XHRpZiAob1Jvb3RWaWV3Q29udHJvbGxlci5pc0ZjbEVuYWJsZWQoKSkge1xuXHRcdFx0aWYgKCFvUGFyZW50TGlzdEJpbmRpbmcgfHwgIW9QYXJlbnRMaXN0QmluZGluZy5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFMaXN0QmluZGluZ1wiKSkge1xuXHRcdFx0XHQvLyBpZiB0aGUgcGFyZW50QmluZGluZyBpcyBub3QgYSBsaXN0QmluZGluZywgd2UgY3JlYXRlIGEgbmV3IGNvbnRleHRcblx0XHRcdFx0b0NvbnRleHQgPSB0aGlzLl9jcmVhdGVDb250ZXh0KG9Db250ZXh0LmdldFBhdGgoKSwgb01vZGVsKTtcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5fc2V0S2VlcEFsaXZlKFxuXHRcdFx0XHRcdG9Db250ZXh0LFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKG9Sb290Vmlld0NvbnRyb2xsZXIuaXNDb250ZXh0VXNlZEluUGFnZXMob0NvbnRleHQpKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMubmF2aWdhdGVCYWNrRnJvbUNvbnRleHQob0NvbnRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dHJ1ZSAvLyBMb2FkIG1lc3NhZ2VzLCBvdGhlcndpc2UgdGhleSBkb24ndCBnZXQgcmVmcmVzaGVkIGxhdGVyLCBlLmcuIGZvciBzaWRlIGVmZmVjdHNcblx0XHRcdFx0KTtcblx0XHRcdH0gY2F0Y2ggKG9FcnJvcikge1xuXHRcdFx0XHQvLyBzZXRLZWVwQWxpdmUgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgcGFyZW50IGxpc3RiaW5kaW5nIGRvZXNuJ3QgaGF2ZSAkJG93blJlcXVlc3Q9dHJ1ZVxuXHRcdFx0XHQvLyBUaGlzIGNhc2UgZm9yIGN1c3RvbSBmcmFnbWVudHMgaXMgc3VwcG9ydGVkLCBidXQgYW4gZXJyb3IgaXMgbG9nZ2VkIHRvIG1ha2UgdGhlIGxhY2sgb2Ygc3luY2hyb25pemF0aW9uIGFwcGFyZW50XG5cdFx0XHRcdExvZy5lcnJvcihcblx0XHRcdFx0XHRgVmlldyBmb3IgJHtvQ29udGV4dC5nZXRQYXRoKCl9IHdvbid0IGJlIHN5bmNocm9uaXplZC4gUGFyZW50IGxpc3RCaW5kaW5nIG11c3QgaGF2ZSBiaW5kaW5nIHBhcmFtZXRlciAkJG93blJlcXVlc3Q9dHJ1ZWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCFvUGFyZW50TGlzdEJpbmRpbmcgfHwgb1BhcmVudExpc3RCaW5kaW5nLmlzQShcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXCIpKSB7XG5cdFx0XHQvLyBXZSBuZWVkIHRvIHJlY3JlYXRlIHRoZSBjb250ZXh0IG90aGVyd2lzZSB3ZSBnZXQgZXJyb3JzXG5cdFx0XHRvQ29udGV4dCA9IHRoaXMuX2NyZWF0ZUNvbnRleHQob0NvbnRleHQuZ2V0UGF0aCgpLCBvTW9kZWwpO1xuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgYmluZGluZyBjb250ZXh0IHdpdGggdGhlIHByb3BlciBiZWZvcmUvYWZ0ZXIgY2FsbGJhY2tzXG5cdFx0dGhpcy5vbkJlZm9yZUJpbmRpbmcob0NvbnRleHQsIHtcblx0XHRcdGVkaXRhYmxlOiBvTmF2aWdhdGlvblBhcmFtZXRlcnMuYlRhcmdldEVkaXRhYmxlLFxuXHRcdFx0bGlzdEJpbmRpbmc6IG9QYXJlbnRMaXN0QmluZGluZyxcblx0XHRcdGJQZXJzaXN0T1BTY3JvbGw6IG9OYXZpZ2F0aW9uUGFyYW1ldGVycy5iUGVyc2lzdE9QU2Nyb2xsLFxuXHRcdFx0YkRyYWZ0TmF2aWdhdGlvbjogb05hdmlnYXRpb25QYXJhbWV0ZXJzLmJEcmFmdE5hdmlnYXRpb24sXG5cdFx0XHRzaG93UGxhY2Vob2xkZXI6IG9OYXZpZ2F0aW9uUGFyYW1ldGVycy5iU2hvd1BsYWNlaG9sZGVyXG5cdFx0fSk7XG5cblx0XHR0aGlzLl9zZXRCaW5kaW5nQ29udGV4dChvQ29udGV4dCk7XG5cdFx0dGhpcy5vbkFmdGVyQmluZGluZyhvQ29udGV4dCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGNvbnRleHQgZnJvbSBhIHBhdGguXG5cdCAqXG5cdCAqIEBwYXJhbSBzUGF0aCBUaGUgcGF0aFxuXHQgKiBAcGFyYW0gb01vZGVsIFRoZSBPRGF0YSBtb2RlbFxuXHQgKiBAcmV0dXJucyBUaGUgY3JlYXRlZCBjb250ZXh0XG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0X2NyZWF0ZUNvbnRleHQoc1BhdGg6IHN0cmluZywgb01vZGVsOiBPRGF0YU1vZGVsKSB7XG5cdFx0Y29uc3Qgb1BhZ2VDb21wb25lbnQgPSB0aGlzLl9vUGFnZUNvbXBvbmVudCxcblx0XHRcdHNFbnRpdHlTZXQgPSBvUGFnZUNvbXBvbmVudCAmJiBvUGFnZUNvbXBvbmVudC5nZXRFbnRpdHlTZXQgJiYgb1BhZ2VDb21wb25lbnQuZ2V0RW50aXR5U2V0KCksXG5cdFx0XHRzQ29udGV4dFBhdGggPVxuXHRcdFx0XHQob1BhZ2VDb21wb25lbnQgJiYgb1BhZ2VDb21wb25lbnQuZ2V0Q29udGV4dFBhdGggJiYgb1BhZ2VDb21wb25lbnQuZ2V0Q29udGV4dFBhdGgoKSkgfHwgKHNFbnRpdHlTZXQgJiYgYC8ke3NFbnRpdHlTZXR9YCksXG5cdFx0XHRvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0bVBhcmFtZXRlcnM6IGFueSA9IHtcblx0XHRcdFx0JCRncm91cElkOiBcIiRhdXRvLkhlcm9lc1wiLFxuXHRcdFx0XHQkJHVwZGF0ZUdyb3VwSWQ6IFwiJGF1dG9cIixcblx0XHRcdFx0JCRwYXRjaFdpdGhvdXRTaWRlRWZmZWN0czogdHJ1ZVxuXHRcdFx0fTtcblx0XHQvLyBJbiBjYXNlIG9mIGRyYWZ0OiAkc2VsZWN0IHRoZSBzdGF0ZSBmbGFncyAoSGFzQWN0aXZlRW50aXR5LCBIYXNEcmFmdEVudGl0eSwgYW5kIElzQWN0aXZlRW50aXR5KVxuXHRcdGNvbnN0IG9EcmFmdFJvb3QgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzQ29udGV4dFBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdFJvb3RgKTtcblx0XHRjb25zdCBvRHJhZnROb2RlID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0NvbnRleHRQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnROb2RlYCk7XG5cdFx0Y29uc3Qgb1Jvb3RWaWV3Q29udHJvbGxlciA9ICh0aGlzLl9vQXBwQ29tcG9uZW50IGFzIGFueSkuZ2V0Um9vdFZpZXdDb250cm9sbGVyKCk7XG5cdFx0aWYgKG9Sb290Vmlld0NvbnRyb2xsZXIuaXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdGNvbnN0IG9Db250ZXh0ID0gdGhpcy5fZ2V0S2VlcEFsaXZlQ29udGV4dChvTW9kZWwsIHNQYXRoLCBmYWxzZSwgbVBhcmFtZXRlcnMpO1xuXHRcdFx0aWYgKCFvQ29udGV4dCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjcmVhdGUga2VlcEFsaXZlIGNvbnRleHQgJHtzUGF0aH1gKTtcblx0XHRcdH0gZWxzZSBpZiAob0RyYWZ0Um9vdCB8fCBvRHJhZnROb2RlKSB7XG5cdFx0XHRcdGlmIChvQ29udGV4dC5nZXRQcm9wZXJ0eShcIklzQWN0aXZlRW50aXR5XCIpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvQ29udGV4dC5yZXF1ZXN0UHJvcGVydHkoW1wiSGFzQWN0aXZlRW50aXR5XCIsIFwiSGFzRHJhZnRFbnRpdHlcIiwgXCJJc0FjdGl2ZUVudGl0eVwiXSk7XG5cdFx0XHRcdFx0aWYgKG9EcmFmdFJvb3QpIHtcblx0XHRcdFx0XHRcdG9Db250ZXh0LnJlcXVlc3RPYmplY3QoXCJEcmFmdEFkbWluaXN0cmF0aXZlRGF0YVwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gd2hlbiBzd2l0Y2hpbmcgYmV0d2VlbiBkcmFmdCBhbmQgZWRpdCB3ZSBuZWVkIHRvIGVuc3VyZSB0aG9zZSBwcm9wZXJ0aWVzIGFyZSByZXF1ZXN0ZWQgYWdhaW4gZXZlbiBpZiB0aGV5IGFyZSBpbiB0aGUgYmluZGluZydzIGNhY2hlXG5cdFx0XHRcdFx0Ly8gb3RoZXJ3aXNlIHdoZW4geW91IGVkaXQgYW5kIGdvIHRvIHRoZSBzYXZlZCB2ZXJzaW9uIHlvdSBoYXZlIG5vIHdheSBvZiBzd2l0Y2hpbmcgYmFjayB0byB0aGUgZWRpdCB2ZXJzaW9uXG5cdFx0XHRcdFx0b0NvbnRleHQucmVxdWVzdFNpZGVFZmZlY3RzKFxuXHRcdFx0XHRcdFx0b0RyYWZ0Um9vdFxuXHRcdFx0XHRcdFx0XHQ/IFtcIkhhc0FjdGl2ZUVudGl0eVwiLCBcIkhhc0RyYWZ0RW50aXR5XCIsIFwiSXNBY3RpdmVFbnRpdHlcIiwgXCJEcmFmdEFkbWluaXN0cmF0aXZlRGF0YVwiXVxuXHRcdFx0XHRcdFx0XHQ6IFtcIkhhc0FjdGl2ZUVudGl0eVwiLCBcIkhhc0RyYWZ0RW50aXR5XCIsIFwiSXNBY3RpdmVFbnRpdHlcIl1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvQ29udGV4dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHNFbnRpdHlTZXQpIHtcblx0XHRcdFx0Y29uc3Qgc01lc3NhZ2VzUGF0aCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NDb250ZXh0UGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NZXNzYWdlcy8kUGF0aGApO1xuXHRcdFx0XHRpZiAoc01lc3NhZ2VzUGF0aCkge1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLiRzZWxlY3QgPSBzTWVzc2FnZXNQYXRoO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluIGNhc2Ugb2YgZHJhZnQ6ICRzZWxlY3QgdGhlIHN0YXRlIGZsYWdzIChIYXNBY3RpdmVFbnRpdHksIEhhc0RyYWZ0RW50aXR5LCBhbmQgSXNBY3RpdmVFbnRpdHkpXG5cdFx0XHRpZiAob0RyYWZ0Um9vdCB8fCBvRHJhZnROb2RlKSB7XG5cdFx0XHRcdGlmIChtUGFyYW1ldGVycy4kc2VsZWN0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRtUGFyYW1ldGVycy4kc2VsZWN0ID0gXCJIYXNBY3RpdmVFbnRpdHksSGFzRHJhZnRFbnRpdHksSXNBY3RpdmVFbnRpdHlcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtUGFyYW1ldGVycy4kc2VsZWN0ICs9IFwiLEhhc0FjdGl2ZUVudGl0eSxIYXNEcmFmdEVudGl0eSxJc0FjdGl2ZUVudGl0eVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fb1ZpZXcuZ2V0QmluZGluZ0NvbnRleHQoKSkge1xuXHRcdFx0XHRjb25zdCBvUHJldmlvdXNCaW5kaW5nID0gKHRoaXMuX29WaWV3LmdldEJpbmRpbmdDb250ZXh0KCkgYXMgYW55KT8uZ2V0QmluZGluZygpO1xuXHRcdFx0XHRvUHJldmlvdXNCaW5kaW5nXG5cdFx0XHRcdFx0Py5yZXNldENoYW5nZXMoKVxuXHRcdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdG9QcmV2aW91c0JpbmRpbmcuZGVzdHJveSgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgcmVzZXRpbmcgdGhlIGNoYW5nZXMgdG8gdGhlIGJpbmRpbmdcIiwgb0Vycm9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb0hpZGRlbkJpbmRpbmcgPSBvTW9kZWwuYmluZENvbnRleHQoc1BhdGgsIHVuZGVmaW5lZCwgbVBhcmFtZXRlcnMpO1xuXG5cdFx0XHRvSGlkZGVuQmluZGluZy5hdHRhY2hFdmVudE9uY2UoXCJkYXRhUmVxdWVzdGVkXCIsICgpID0+IHtcblx0XHRcdFx0QnVzeUxvY2tlci5sb2NrKHRoaXMuX29WaWV3KTtcblx0XHRcdH0pO1xuXHRcdFx0b0hpZGRlbkJpbmRpbmcuYXR0YWNoRXZlbnRPbmNlKFwiZGF0YVJlY2VpdmVkXCIsIHRoaXMuX2RhdGFSZWNlaXZlZEV2ZW50SGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHRcdHJldHVybiBvSGlkZGVuQmluZGluZy5nZXRCb3VuZENvbnRleHQoKTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBfZGF0YVJlY2VpdmVkRXZlbnRIYW5kbGVyKG9FdmVudDogRXZlbnQpIHtcblx0XHRjb25zdCBzRXJyb3JEZXNjcmlwdGlvbiA9IG9FdmVudCAmJiBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiZXJyb3JcIik7XG5cdFx0QnVzeUxvY2tlci51bmxvY2sodGhpcy5fb1ZpZXcpO1xuXG5cdFx0aWYgKHNFcnJvckRlc2NyaXB0aW9uKSB7XG5cdFx0XHQvLyBUT0RPOiBpbiBjYXNlIG9mIDQwNCB0aGUgdGV4dCBzaGFsbCBiZSBkaWZmZXJlbnRcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IG9SZXNvdXJjZUJ1bmRsZSA9IGF3YWl0IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIiwgdHJ1ZSk7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2VIYW5kbGVyID0gdGhpcy5iYXNlLm1lc3NhZ2VIYW5kbGVyO1xuXHRcdFx0XHRsZXQgbVBhcmFtcyA9IHt9O1xuXHRcdFx0XHRpZiAoc0Vycm9yRGVzY3JpcHRpb24gJiYgc0Vycm9yRGVzY3JpcHRpb24uc3RhdHVzID09PSA1MDMpIHtcblx0XHRcdFx0XHRtUGFyYW1zID0ge1xuXHRcdFx0XHRcdFx0aXNJbml0aWFsTG9hZDUwM0Vycm9yOiB0cnVlLFxuXHRcdFx0XHRcdFx0c2hlbGxCYWNrOiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtUGFyYW1zID0ge1xuXHRcdFx0XHRcdFx0dGl0bGU6IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiQ19DT01NT05fU0FQRkVfRVJST1JcIiksXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogc0Vycm9yRGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0XHRpc0RhdGFSZWNlaXZlZEVycm9yOiB0cnVlLFxuXHRcdFx0XHRcdFx0c2hlbGxCYWNrOiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhd2FpdCBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZXMobVBhcmFtcyk7XG5cdFx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBnZXR0aW5nIHRoZSBjb3JlIHJlc291cmNlIGJ1bmRsZVwiLCBvRXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXF1ZXN0cyBzaWRlIGVmZmVjdHMgb24gYSBiaW5kaW5nIGNvbnRleHQgdG8gXCJyZWZyZXNoXCIgaXQuXG5cdCAqIFRPRE86IGdldCByaWQgb2YgdGhpcyBvbmNlIHByb3ZpZGVkIGJ5IHRoZSBtb2RlbFxuXHQgKiBhIHJlZnJlc2ggb24gdGhlIGJpbmRpbmcgY29udGV4dCBkb2VzIG5vdCB3b3JrIGluIGNhc2UgYSBjcmVhdGlvbiByb3cgd2l0aCBhIHRyYW5zaWVudCBjb250ZXh0IGlzXG5cdCAqIHVzZWQuIGFsc28gYSByZXF1ZXN0U2lkZUVmZmVjdHMgd2l0aCBhbiBlbXB0eSBwYXRoIHdvdWxkIGZhaWwgZHVlIHRvIHRoZSB0cmFuc2llbnQgY29udGV4dFxuXHQgKiB0aGVyZWZvcmUgd2UgZ2V0IGFsbCBkZXBlbmRlbnQgYmluZGluZ3MgKHZpYSBwcml2YXRlIG1vZGVsIG1ldGhvZCkgdG8gZGV0ZXJtaW5lIGFsbCBwYXRocyBhbmQgdGhlblxuXHQgKiByZXF1ZXN0IHRoZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSBvQmluZGluZ0NvbnRleHQgQ29udGV4dCB0byBiZSByZWZyZXNoZWRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfcmVmcmVzaEJpbmRpbmdDb250ZXh0KG9CaW5kaW5nQ29udGV4dDogYW55KSB7XG5cdFx0Y29uc3Qgb1BhZ2VDb21wb25lbnQgPSB0aGlzLl9vUGFnZUNvbXBvbmVudDtcblx0XHRjb25zdCBvU2lkZUVmZmVjdHNTZXJ2aWNlID0gdGhpcy5fb0FwcENvbXBvbmVudC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKTtcblx0XHRjb25zdCBzUm9vdENvbnRleHRQYXRoID0gb0JpbmRpbmdDb250ZXh0LmdldFBhdGgoKTtcblx0XHRjb25zdCBzRW50aXR5U2V0ID0gb1BhZ2VDb21wb25lbnQgJiYgb1BhZ2VDb21wb25lbnQuZ2V0RW50aXR5U2V0ICYmIG9QYWdlQ29tcG9uZW50LmdldEVudGl0eVNldCgpO1xuXHRcdGNvbnN0IHNDb250ZXh0UGF0aCA9XG5cdFx0XHQob1BhZ2VDb21wb25lbnQgJiYgb1BhZ2VDb21wb25lbnQuZ2V0Q29udGV4dFBhdGggJiYgb1BhZ2VDb21wb25lbnQuZ2V0Q29udGV4dFBhdGgoKSkgfHwgKHNFbnRpdHlTZXQgJiYgYC8ke3NFbnRpdHlTZXR9YCk7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IHRoaXMuX29WaWV3LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0bGV0IHNNZXNzYWdlc1BhdGg7XG5cdFx0Y29uc3QgYU5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhzOiBhbnlbXSA9IFtdO1xuXHRcdGNvbnN0IGFQcm9wZXJ0eVBhdGhzOiBhbnlbXSA9IFtdO1xuXHRcdGNvbnN0IG9TaWRlRWZmZWN0czogYW55ID0ge1xuXHRcdFx0VGFyZ2V0UHJvcGVydGllczogW10sXG5cdFx0XHRUYXJnZXRFbnRpdGllczogW11cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0QmluZGluZ1BhdGhzKG9CaW5kaW5nOiBhbnkpIHtcblx0XHRcdGxldCBhRGVwZW5kZW50QmluZGluZ3M7XG5cdFx0XHRjb25zdCBzUmVsYXRpdmVQYXRoID0gKChvQmluZGluZy5nZXRDb250ZXh0KCkgJiYgb0JpbmRpbmcuZ2V0Q29udGV4dCgpLmdldFBhdGgoKSkgfHwgXCJcIikucmVwbGFjZShzUm9vdENvbnRleHRQYXRoLCBcIlwiKTsgLy8gSWYgbm8gY29udGV4dCwgdGhpcyBpcyBhbiBhYnNvbHV0ZSBiaW5kaW5nIHNvIG5vIHJlbGF0aXZlIHBhdGhcblx0XHRcdGNvbnN0IHNQYXRoID0gKHNSZWxhdGl2ZVBhdGggPyBgJHtzUmVsYXRpdmVQYXRoLnNsaWNlKDEpfS9gIDogc1JlbGF0aXZlUGF0aCkgKyBvQmluZGluZy5nZXRQYXRoKCk7XG5cblx0XHRcdGlmIChvQmluZGluZy5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFDb250ZXh0QmluZGluZ1wiKSkge1xuXHRcdFx0XHQvLyBpZiAoc1BhdGggPT09IFwiXCIpIHtcblx0XHRcdFx0Ly8gbm93IGdldCB0aGUgZGVwZW5kZW50IGJpbmRpbmdzXG5cdFx0XHRcdGFEZXBlbmRlbnRCaW5kaW5ncyA9IG9CaW5kaW5nLmdldERlcGVuZGVudEJpbmRpbmdzKCk7XG5cdFx0XHRcdGlmIChhRGVwZW5kZW50QmluZGluZ3MpIHtcblx0XHRcdFx0XHQvLyBhc2sgdGhlIGRlcGVuZGVudCBiaW5kaW5ncyAoYW5kIG9ubHkgdGhvc2Ugd2l0aCB0aGUgc3BlY2lmaWVkIGdyb3VwSWRcblx0XHRcdFx0XHQvL2lmIChhRGVwZW5kZW50QmluZGluZ3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYURlcGVuZGVudEJpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRnZXRCaW5kaW5nUGF0aHMoYURlcGVuZGVudEJpbmRpbmdzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoYU5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhzLmluZGV4T2Yoc1BhdGgpID09PSAtMSkge1xuXHRcdFx0XHRcdGFOYXZpZ2F0aW9uUHJvcGVydHlQYXRocy5wdXNoKHNQYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChvQmluZGluZy5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFMaXN0QmluZGluZ1wiKSkge1xuXHRcdFx0XHRpZiAoYU5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhzLmluZGV4T2Yoc1BhdGgpID09PSAtMSkge1xuXHRcdFx0XHRcdGFOYXZpZ2F0aW9uUHJvcGVydHlQYXRocy5wdXNoKHNQYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChvQmluZGluZy5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFQcm9wZXJ0eUJpbmRpbmdcIikpIHtcblx0XHRcdFx0aWYgKGFQcm9wZXJ0eVBhdGhzLmluZGV4T2Yoc1BhdGgpID09PSAtMSkge1xuXHRcdFx0XHRcdGFQcm9wZXJ0eVBhdGhzLnB1c2goc1BhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHNDb250ZXh0UGF0aCkge1xuXHRcdFx0c01lc3NhZ2VzUGF0aCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NDb250ZXh0UGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NZXNzYWdlcy8kUGF0aGApO1xuXHRcdH1cblxuXHRcdC8vIGJpbmRpbmcgb2YgdGhlIGNvbnRleHQgbXVzdCBoYXZlICQkUGF0Y2hXaXRob3V0U2lkZUVmZmVjdHMgdHJ1ZSwgdGhpcyBib3VuZCBjb250ZXh0IG1heSBiZSBuZWVkZWQgdG8gYmUgZmV0Y2hlZCBmcm9tIHRoZSBkZXBlbmRlbnQgYmluZGluZ1xuXHRcdGdldEJpbmRpbmdQYXRocyhvQmluZGluZ0NvbnRleHQuZ2V0QmluZGluZygpKTtcblxuXHRcdGxldCBpO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBhTmF2aWdhdGlvblByb3BlcnR5UGF0aHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG9TaWRlRWZmZWN0cy5UYXJnZXRFbnRpdGllcy5wdXNoKHtcblx0XHRcdFx0JE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IGFOYXZpZ2F0aW9uUHJvcGVydHlQYXRoc1tpXVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdG9TaWRlRWZmZWN0cy5UYXJnZXRQcm9wZXJ0aWVzID0gYVByb3BlcnR5UGF0aHM7XG5cdFx0aWYgKHNNZXNzYWdlc1BhdGgpIHtcblx0XHRcdG9TaWRlRWZmZWN0cy5UYXJnZXRQcm9wZXJ0aWVzLnB1c2goc01lc3NhZ2VzUGF0aCk7XG5cdFx0fVxuXHRcdC8vYWxsIHRoaXMgbG9naWMgdG8gYmUgcmVwbGFjZWQgd2l0aCBhIFNpZGVFZmZlY3RzIHJlcXVlc3QgZm9yIGFuIGVtcHR5IHBhdGggKHJlZnJlc2ggZXZlcnl0aGluZyksIGFmdGVyIHRlc3RpbmcgdHJhbnNpZW50IGNvbnRleHRzXG5cdFx0b1NpZGVFZmZlY3RzLlRhcmdldFByb3BlcnRpZXMgPSBvU2lkZUVmZmVjdHMuVGFyZ2V0UHJvcGVydGllcy5tYXAoKHNUYXJnZXRQcm9wZXJ0eTogU3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoc1RhcmdldFByb3BlcnR5KSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gc1RhcmdldFByb3BlcnR5LmluZGV4T2YoXCIvXCIpO1xuXHRcdFx0XHRpZiAoaW5kZXggPiAwKSB7XG5cdFx0XHRcdFx0Ly8gb25seSByZXF1ZXN0IHRoZSBuYXZpZ2F0aW9uIHBhdGggYW5kIG5vdCB0aGUgcHJvcGVydHkgcGF0aHMgZnVydGhlclxuXHRcdFx0XHRcdHJldHVybiBzVGFyZ2V0UHJvcGVydHkuc2xpY2UoMCwgaW5kZXgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzVGFyZ2V0UHJvcGVydHk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Ly8gT0RhdGEgbW9kZWwgd2lsbCB0YWtlIGNhcmUgb2YgZHVwbGljYXRlc1xuXHRcdG9TaWRlRWZmZWN0c1NlcnZpY2UucmVxdWVzdFNpZGVFZmZlY3RzKG9TaWRlRWZmZWN0cy5UYXJnZXRFbnRpdGllcy5jb25jYXQob1NpZGVFZmZlY3RzLlRhcmdldFByb3BlcnRpZXMpLCBvQmluZGluZ0NvbnRleHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGJpbmRpbmcgY29udGV4dCBvZiB0aGUgcGFnZSBvciB0aGUgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyBUaGUgYmluZGluZyBjb250ZXh0XG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0X2dldEJpbmRpbmdDb250ZXh0KCk6IENvbnRleHQgfCBudWxsIHwgdW5kZWZpbmVkIHtcblx0XHRpZiAodGhpcy5fb1BhZ2VDb21wb25lbnQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vUGFnZUNvbXBvbmVudC5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIENvbnRleHQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9vVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIENvbnRleHQ7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGJpbmRpbmcgY29udGV4dCBvZiB0aGUgcGFnZSBvciB0aGUgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRleHQgVGhlIGJpbmRpbmcgY29udGV4dFxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdF9zZXRCaW5kaW5nQ29udGV4dChvQ29udGV4dDogYW55KSB7XG5cdFx0bGV0IG9QcmV2aW91c0NvbnRleHQsIG9UYXJnZXRDb250cm9sO1xuXHRcdGlmICh0aGlzLl9vUGFnZUNvbXBvbmVudCkge1xuXHRcdFx0b1ByZXZpb3VzQ29udGV4dCA9IHRoaXMuX29QYWdlQ29tcG9uZW50LmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dDtcblx0XHRcdG9UYXJnZXRDb250cm9sID0gdGhpcy5fb1BhZ2VDb21wb25lbnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9QcmV2aW91c0NvbnRleHQgPSB0aGlzLl9vVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIENvbnRleHQ7XG5cdFx0XHRvVGFyZ2V0Q29udHJvbCA9IHRoaXMuX29WaWV3O1xuXHRcdH1cblxuXHRcdG9UYXJnZXRDb250cm9sLnNldEJpbmRpbmdDb250ZXh0KG9Db250ZXh0KTtcblxuXHRcdGlmIChvUHJldmlvdXNDb250ZXh0ICYmIG9QcmV2aW91c0NvbnRleHQuaXNLZWVwQWxpdmUoKSkge1xuXHRcdFx0dGhpcy5fc2V0S2VlcEFsaXZlKG9QcmV2aW91c0NvbnRleHQsIGZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZmxleGlibGUgY29sdW1uIGxheW91dCAoRkNMKSBsZXZlbCBjb3JyZXNwb25kaW5nIHRvIHRoZSB2aWV3ICgtMSBpZiB0aGUgYXBwIGlzIG5vdCBGQ0wpLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBUaGUgbGV2ZWxcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfZ2V0RkNMTGV2ZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX29UYXJnZXRJbmZvcm1hdGlvbi5GQ0xMZXZlbDtcblx0fVxuXG5cdF9zZXRLZWVwQWxpdmUob0NvbnRleHQ6IENvbnRleHQsIGJLZWVwQWxpdmU6IGJvb2xlYW4sIGZuQmVmb3JlRGVzdHJveT86IEZ1bmN0aW9uLCBiUmVxdWVzdE1lc3NhZ2VzPzogYm9vbGVhbikge1xuXHRcdGlmIChvQ29udGV4dC5nZXRQYXRoKCkuZW5kc1dpdGgoXCIpXCIpKSB7XG5cdFx0XHQvLyBXZSBrZWVwIHRoZSBjb250ZXh0IGFsaXZlIG9ubHkgaWYgdGhleSdyZSBwYXJ0IG9mIGEgY29sbGVjdGlvbiwgaS5lLiBpZiB0aGUgcGF0aCBlbmRzIHdpdGggYSAnKSdcblx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsO1xuXHRcdFx0Y29uc3Qgc01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQ29udGV4dC5nZXRQYXRoKCkpO1xuXHRcdFx0Y29uc3Qgc01lc3NhZ2VzUGF0aCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhUGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NZXNzYWdlcy8kUGF0aGApO1xuXHRcdFx0b0NvbnRleHQuc2V0S2VlcEFsaXZlKGJLZWVwQWxpdmUsIGZuQmVmb3JlRGVzdHJveSwgISFzTWVzc2FnZXNQYXRoICYmIGJSZXF1ZXN0TWVzc2FnZXMpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRLZWVwQWxpdmVDb250ZXh0KG9Nb2RlbDogT0RhdGFNb2RlbCwgcGF0aDogc3RyaW5nLCBiUmVxdWVzdE1lc3NhZ2VzPzogYm9vbGVhbiwgcGFyYW1ldGVycz86IGFueSk6IENvbnRleHQgfCB1bmRlZmluZWQge1xuXHRcdC8vIEdldCB0aGUgcGF0aCBmb3IgdGhlIGNvbnRleHQgdGhhdCBpcyByZWFsbHkga2VwdCBhbGl2ZSAocGFydCBvZiBhIGNvbGxlY3Rpb24pXG5cdFx0Ly8gaS5lLiByZW1vdmUgYWxsIHNlZ21lbnRzIG5vdCBlbmRpbmcgd2l0aCBhICcpJ1xuXHRcdGNvbnN0IGtlcHRBbGl2ZVNlZ21lbnRzID0gcGF0aC5zcGxpdChcIi9cIik7XG5cdFx0Y29uc3QgYWRkaXRpb25uYWxTZWdtZW50czogc3RyaW5nW10gPSBbXTtcblx0XHR3aGlsZSAoa2VwdEFsaXZlU2VnbWVudHMubGVuZ3RoICYmICFrZXB0QWxpdmVTZWdtZW50c1trZXB0QWxpdmVTZWdtZW50cy5sZW5ndGggLSAxXS5lbmRzV2l0aChcIilcIikpIHtcblx0XHRcdGFkZGl0aW9ubmFsU2VnbWVudHMucHVzaChrZXB0QWxpdmVTZWdtZW50cy5wb3AoKSEpO1xuXHRcdH1cblxuXHRcdGlmIChrZXB0QWxpdmVTZWdtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3Qga2VwdEFsaXZlUGF0aCA9IGtlcHRBbGl2ZVNlZ21lbnRzLmpvaW4oXCIvXCIpO1xuXHRcdGNvbnN0IG9LZWVwQWxpdmVDb250ZXh0ID0gb01vZGVsLmdldEtlZXBBbGl2ZUNvbnRleHQoa2VwdEFsaXZlUGF0aCwgYlJlcXVlc3RNZXNzYWdlcywgcGFyYW1ldGVycyk7XG5cblx0XHRpZiAoYWRkaXRpb25uYWxTZWdtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBvS2VlcEFsaXZlQ29udGV4dDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YWRkaXRpb25uYWxTZWdtZW50cy5yZXZlcnNlKCk7XG5cdFx0XHRjb25zdCBhZGRpdGlvbm5hbFBhdGggPSBhZGRpdGlvbm5hbFNlZ21lbnRzLmpvaW4oXCIvXCIpO1xuXHRcdFx0cmV0dXJuIG9Nb2RlbC5iaW5kQ29udGV4dChhZGRpdGlvbm5hbFBhdGgsIG9LZWVwQWxpdmVDb250ZXh0KS5nZXRCb3VuZENvbnRleHQoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU3dpdGNoZXMgYmV0d2VlbiBjb2x1bW4gYW5kIGZ1bGwtc2NyZWVuIG1vZGUgd2hlbiBGQ0wgaXMgdXNlZC5cblx0ICpcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRzd2l0Y2hGdWxsU2NyZWVuKCkge1xuXHRcdGNvbnN0IG9Tb3VyY2UgPSB0aGlzLmJhc2UuZ2V0VmlldygpO1xuXHRcdGNvbnN0IG9GQ0xIZWxwZXJNb2RlbCA9IG9Tb3VyY2UuZ2V0TW9kZWwoXCJmY2xoZWxwZXJcIiksXG5cdFx0XHRiSXNGdWxsU2NyZWVuID0gb0ZDTEhlbHBlck1vZGVsLmdldFByb3BlcnR5KFwiL2FjdGlvbkJ1dHRvbnNJbmZvL2lzRnVsbFNjcmVlblwiKSxcblx0XHRcdHNOZXh0TGF5b3V0ID0gb0ZDTEhlbHBlck1vZGVsLmdldFByb3BlcnR5KFxuXHRcdFx0XHRiSXNGdWxsU2NyZWVuID8gXCIvYWN0aW9uQnV0dG9uc0luZm8vZXhpdEZ1bGxTY3JlZW5cIiA6IFwiL2FjdGlvbkJ1dHRvbnNJbmZvL2Z1bGxTY3JlZW5cIlxuXHRcdFx0KSxcblx0XHRcdG9Sb290Vmlld0NvbnRyb2xsZXIgPSAodGhpcy5fb0FwcENvbXBvbmVudCBhcyBhbnkpLmdldFJvb3RWaWV3Q29udHJvbGxlcigpO1xuXG5cdFx0Y29uc3Qgb0NvbnRleHQgPSBvUm9vdFZpZXdDb250cm9sbGVyLmdldFJpZ2h0bW9zdENvbnRleHQgPyBvUm9vdFZpZXdDb250cm9sbGVyLmdldFJpZ2h0bW9zdENvbnRleHQoKSA6IG9Tb3VyY2UuZ2V0QmluZGluZ0NvbnRleHQoKTtcblxuXHRcdHRoaXMuYmFzZS5fcm91dGluZy5uYXZpZ2F0ZVRvQ29udGV4dChvQ29udGV4dCwgeyBzTGF5b3V0OiBzTmV4dExheW91dCB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRMb2cud2FybmluZyhcImNhbm5vdCBzd2l0Y2ggYmV0d2VlbiBjb2x1bW4gYW5kIGZ1bGxzY3JlZW5cIik7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBjb2x1bW4gZm9yIHRoZSBjdXJyZW50IHZpZXcgaW4gYSBGQ0wuXG5cdCAqXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkJlZm9yZSlcblx0Y2xvc2VDb2x1bW4oKSB7XG5cdFx0Y29uc3Qgb1NvdXJjZSA9IHRoaXMuYmFzZS5nZXRWaWV3KCk7XG5cdFx0Y29uc3Qgb1ZpZXdEYXRhID0gb1NvdXJjZS5nZXRWaWV3RGF0YSgpIGFzIGFueTtcblx0XHRjb25zdCBvQ29udGV4dCA9IG9Tb3VyY2UuZ2V0QmluZGluZ0NvbnRleHQoKSBhcyBDb250ZXh0O1xuXHRcdGNvbnN0IGJhc2UgPSB0aGlzLmJhc2U7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cblx0XHRpZiAob1ZpZXdEYXRhICYmIG9WaWV3RGF0YS52aWV3TGV2ZWwgPT09IDEgJiYgTW9kZWxIZWxwZXIuaXNEcmFmdFN1cHBvcnRlZChvTWV0YU1vZGVsLCBvQ29udGV4dC5nZXRQYXRoKCkpKSB7XG5cdFx0XHRkcmFmdC5wcm9jZXNzRGF0YUxvc3NPckRyYWZ0RGlzY2FyZENvbmZpcm1hdGlvbihcblx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJhc2UuX3JvdXRpbmcubmF2aWdhdGVCYWNrRnJvbUNvbnRleHQob0NvbnRleHQsIHsgbm9QcmVzZXJ2YXRpb25DYWNoZTogdHJ1ZSB9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0RnVuY3Rpb24ucHJvdG90eXBlLFxuXHRcdFx0XHRvQ29udGV4dCxcblx0XHRcdFx0b1NvdXJjZS5nZXRDb250cm9sbGVyKCksXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRkcmFmdC5OYXZpZ2F0aW9uVHlwZS5CYWNrTmF2aWdhdGlvblxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YmFzZS5fcm91dGluZy5uYXZpZ2F0ZUJhY2tGcm9tQ29udGV4dChvQ29udGV4dCwgeyBub1ByZXNlcnZhdGlvbkNhY2hlOiB0cnVlIH0pO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnRlcm5hbFJvdXRpbmc7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFNRyxDQUFOLEVBQVM7TUFDVixPQUFPRixPQUFPLENBQUNFLENBQUQsQ0FBZDtJQUNBOztJQUNELElBQUlELE1BQU0sSUFBSUEsTUFBTSxDQUFDRSxJQUFyQixFQUEyQjtNQUMxQixPQUFPRixNQUFNLENBQUNFLElBQVAsQ0FBWSxLQUFLLENBQWpCLEVBQW9CSCxPQUFwQixDQUFQO0lBQ0E7O0lBQ0QsT0FBT0MsTUFBUDtFQUNBOzs7Ozs7OztFQWhpQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUVNRyxlLFdBRExDLGNBQWMsQ0FBQyxrREFBRCxDLFVBWWJDLGNBQWMsRSxVQU9kQSxjQUFjLEUsVUFvQ2RDLGVBQWUsRSxVQUNmQyxVQUFVLENBQUNDLGlCQUFpQixDQUFDQyxLQUFuQixDLFVBS1ZILGVBQWUsRSxVQUNmQyxVQUFVLENBQUNDLGlCQUFpQixDQUFDQyxLQUFuQixDLFVBS1ZILGVBQWUsRSxVQUNmQyxVQUFV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