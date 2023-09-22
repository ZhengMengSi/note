/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/KeepAliveHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/navigation/library", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/ui/fl/apply/api/ControlVariantApplyAPI", "sap/ui/mdc/p13n/StateUtil"], function (Log, mergeObjects, CommonUtils, ClassSupport, KeepAliveHelper, ModelHelper, NavLibrary, ControllerExtension, OverrideExecution, ControlVariantApplyAPI, StateUtil) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _finallyRethrows(body, finalizer) {
    try {
      var result = body();
    } catch (e) {
      return finalizer(true, e);
    }

    if (result && result.then) {
      return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
    }

    return finalizer(false, result);
  }

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

  // additionalStates are stored next to control IDs, so name clash avoidance needed. Fortunately IDs have restrictions:
  // "Allowed is a sequence of characters (capital/lowercase), digits, underscores, dashes, points and/or colons."
  // Therefore adding a symbol like # or @
  var ADDITIONAL_STATES_KEY = "#additionalStates",
      NavType = NavLibrary.NavType; ///////////////////////////////////////////////////////////////////
  // methods to retrieve & apply states for the different controls //
  ///////////////////////////////////////////////////////////////////

  var _mControlStateHandlerMap = {
    "sap.ui.fl.variants.VariantManagement": {
      retrieve: function (oVM) {
        return {
          "variantId": oVM.getCurrentVariantKey()
        };
      },
      apply: function (oVM, oControlState) {
        if (oControlState && oControlState.variantId !== undefined && oControlState.variantId !== oVM.getCurrentVariantKey()) {
          var sVariantReference = this._checkIfVariantIdIsAvailable(oVM, oControlState.variantId) ? oControlState.variantId : oVM.getStandardVariantKey();
          return ControlVariantApplyAPI.activateVariant({
            element: oVM,
            variantReference: sVariantReference
          });
        }
      }
    },
    "sap.m.IconTabBar": {
      retrieve: function (oTabBar) {
        return {
          selectedKey: oTabBar.getSelectedKey()
        };
      },
      apply: function (oTabBar, oControlState) {
        if (oControlState && oControlState.selectedKey) {
          var oSelectedItem = oTabBar.getItems().find(function (oItem) {
            return oItem.getKey() === oControlState.selectedKey;
          });

          if (oSelectedItem) {
            oTabBar.setSelectedItem(oSelectedItem);
          }
        }
      }
    },
    "sap.ui.mdc.FilterBar": {
      retrieve: function (oFilterBar) {
        return StateUtil.retrieveExternalState(oFilterBar).then(function (mFilterBarState) {
          // remove sensitive or view state irrelevant fields
          var aPropertiesInfo = oFilterBar.getPropertyInfoSet(),
              mFilter = mFilterBarState.filter || {};
          aPropertiesInfo.filter(function (oPropertyInfo) {
            return mFilter[oPropertyInfo.path] && (oPropertyInfo.removeFromAppState || mFilter[oPropertyInfo.path].length === 0);
          }).forEach(function (oPropertyInfo) {
            delete mFilter[oPropertyInfo.path];
          });
          return mFilterBarState;
        });
      },
      apply: function (oFilterBar, oControlState) {
        if (oControlState) {
          return StateUtil.applyExternalState(oFilterBar, oControlState);
        }
      }
    },
    "sap.ui.mdc.Table": {
      retrieve: function (oTable) {
        return StateUtil.retrieveExternalState(oTable);
      },
      apply: function (oTable, oControlState) {
        if (oControlState) {
          if (!oControlState.supplementaryConfig) {
            oControlState.supplementaryConfig = {};
          }

          return StateUtil.applyExternalState(oTable, oControlState);
        }
      },
      refreshBinding: function (oTable) {
        var oTableBinding = oTable.getRowBinding();

        if (oTableBinding) {
          var oRootBinding = oTableBinding.getRootBinding();

          if (oRootBinding === oTableBinding) {
            // absolute binding
            oTableBinding.refresh();
          } else {
            // relative binding
            var oHeaderContext = oTableBinding.getHeaderContext();
            var sGroupId = oTableBinding.getGroupId();

            if (oHeaderContext) {
              oHeaderContext.requestSideEffects([{
                $NavigationPropertyPath: ""
              }], sGroupId);
            }
          }
        } else {
          Log.info("Table: ".concat(oTable.getId(), " was not refreshed. No binding found!"));
        }
      }
    },
    "sap.ui.mdc.Chart": {
      retrieve: function (oChart) {
        return StateUtil.retrieveExternalState(oChart);
      },
      apply: function (oChart, oControlState) {
        if (oControlState) {
          return StateUtil.applyExternalState(oChart, oControlState);
        }
      }
    },
    "sap.uxap.ObjectPageLayout": {
      retrieve: function (oOPLayout) {
        return {
          selectedSection: oOPLayout.getSelectedSection()
        };
      },
      apply: function (oOPLayout, oControlState) {
        if (oControlState) {
          oOPLayout.setSelectedSection(oControlState.selectedSection);
        }
      },
      refreshBinding: function (oOPLayout) {
        var oBindingContext = oOPLayout.getBindingContext();
        var oBinding = oBindingContext && oBindingContext.getBinding();

        if (oBinding) {
          var sMetaPath = ModelHelper.getMetaPathForContext(oBindingContext);
          var sStrategy = KeepAliveHelper.getControlRefreshStrategyForContextPath(oOPLayout, sMetaPath);

          if (sStrategy === "self") {
            // Refresh main context and 1-1 navigation properties or OP
            var oModel = oBindingContext.getModel(),
                oMetaModel = oModel.getMetaModel(),
                oNavigationProperties = CommonUtils.getContextPathProperties(oMetaModel, sMetaPath, {
              $kind: "NavigationProperty"
            }) || {},
                aNavPropertiesToRequest = Object.keys(oNavigationProperties).reduce(function (aPrev, sNavProp) {
              if (oNavigationProperties[sNavProp].$isCollection !== true) {
                aPrev.push({
                  $NavigationPropertyPath: sNavProp
                });
              }

              return aPrev;
            }, []),
                aProperties = [{
              $PropertyPath: "*"
            }],
                sGroupId = oBinding.getGroupId();
            oBindingContext.requestSideEffects(aProperties.concat(aNavPropertiesToRequest), sGroupId);
          } else if (sStrategy === "includingDependents") {
            // Complete refresh
            oBinding.refresh();
          }
        } else {
          Log.info("ObjectPage: ".concat(oOPLayout.getId(), " was not refreshed. No binding found!"));
        }
      }
    },
    "sap.fe.macros.table.QuickFilterContainer": {
      retrieve: function (oQuickFilter) {
        return {
          selectedKey: oQuickFilter.getSelectorKey()
        };
      },
      apply: function (oQuickFilter, oControlState) {
        if (oControlState) {
          oQuickFilter.setSelectorKey(oControlState.selectedKey);
        }
      }
    },
    "sap.m.SegmentedButton": {
      retrieve: function (oSegmentedButton) {
        return {
          selectedKey: oSegmentedButton.getSelectedKey()
        };
      },
      apply: function (oSegmentedButton, oControlState) {
        if (oControlState) {
          oSegmentedButton.setSelectedKey(oControlState.selectedKey);
        }
      }
    },
    "sap.m.Select": {
      retrieve: function (oSelect) {
        return {
          selectedKey: oSelect.getSelectedKey()
        };
      },
      apply: function (oSelect, oControlState) {
        if (oControlState) {
          oSelect.setSelectedKey(oControlState.selectedKey);
        }
      }
    },
    "sap.f.DynamicPage": {
      retrieve: function (oDynamicPage) {
        return {
          headerExpanded: oDynamicPage.getHeaderExpanded()
        };
      },
      apply: function (oDynamicPage, oControlState) {
        if (oControlState) {
          oDynamicPage.setHeaderExpanded(oControlState.headerExpanded);
        }
      }
    },
    "sap.ui.core.mvc.View": {
      retrieve: function (oView) {
        var oController = oView.getController();

        if (oController && oController.viewState) {
          return oController.viewState.retrieveViewState(oController.viewState);
        }

        return {};
      },
      apply: function (oView, oControlState, oNavParameters) {
        var oController = oView.getController();

        if (oController && oController.viewState) {
          return oController.viewState.applyViewState(oControlState, oNavParameters);
        }
      },
      refreshBinding: function (oView) {
        var oController = oView.getController();

        if (oController && oController.viewState) {
          return oController.viewState.refreshViewBindings();
        }
      }
    },
    "sap.ui.core.ComponentContainer": {
      retrieve: function (oComponentContainer) {
        var oComponent = oComponentContainer.getComponentInstance();

        if (oComponent) {
          return this.retrieveControlState(oComponent.getRootControl());
        }

        return {};
      },
      apply: function (oComponentContainer, oControlState, oNavParameters) {
        var oComponent = oComponentContainer.getComponentInstance();

        if (oComponent) {
          return this.applyControlState(oComponent.getRootControl(), oControlState, oNavParameters);
        }
      }
    }
  };
  /**
   * A controller extension offering hooks for state handling
   *
   * If you need to maintain a specific state for your application, you can use the controller extension.
   *
   * @hideconstructor
   * @public
   * @since 1.85.0
   */

  var ViewState = (_dec = defineUI5Class("sap.fe.core.controllerextensions.ViewState"), _dec2 = publicExtension(), _dec3 = finalExtension(), _dec4 = publicExtension(), _dec5 = extensible(OverrideExecution.After), _dec6 = privateExtension(), _dec7 = finalExtension(), _dec8 = privateExtension(), _dec9 = finalExtension(), _dec10 = publicExtension(), _dec11 = extensible(OverrideExecution.After), _dec12 = publicExtension(), _dec13 = extensible(OverrideExecution.After), _dec14 = publicExtension(), _dec15 = extensible(OverrideExecution.After), _dec16 = privateExtension(), _dec17 = finalExtension(), _dec18 = publicExtension(), _dec19 = extensible(OverrideExecution.After), _dec20 = privateExtension(), _dec21 = finalExtension(), _dec22 = publicExtension(), _dec23 = extensible(OverrideExecution.After), _dec24 = publicExtension(), _dec25 = finalExtension(), _dec26 = publicExtension(), _dec27 = finalExtension(), _dec28 = publicExtension(), _dec29 = extensible(OverrideExecution.After), _dec30 = privateExtension(), _dec31 = finalExtension(), _dec32 = publicExtension(), _dec33 = extensible(OverrideExecution.Instead), _dec34 = publicExtension(), _dec35 = finalExtension(), _dec36 = privateExtension(), _dec37 = publicExtension(), _dec38 = extensible(OverrideExecution.After), _dec39 = publicExtension(), _dec40 = extensible(OverrideExecution.After), _dec41 = publicExtension(), _dec42 = extensible(OverrideExecution.After), _dec43 = privateExtension(), _dec44 = publicExtension(), _dec45 = extensible(OverrideExecution.After), _dec46 = privateExtension(), _dec47 = finalExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(ViewState, _ControllerExtension);

    /**
     * Constructor.
     */
    function ViewState() {
      var _this;

      _this = _ControllerExtension.call(this) || this;
      _this._iRetrievingStateCounter = 0;
      _this._pInitialStateApplied = new Promise(function (resolve) {
        _this._pInitialStateAppliedResolve = resolve;
      });
      return _this;
    }

    var _proto = ViewState.prototype;

    _proto.refreshViewBindings = function refreshViewBindings() {
      try {
        var _this3 = this;

        return Promise.resolve(_this3.collectResults(_this3.base.viewState.adaptBindingRefreshControls)).then(function (aControls) {
          var oPromiseChain = Promise.resolve();
          aControls.filter(function (oControl) {
            return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
          }).forEach(function (oControl) {
            oPromiseChain = oPromiseChain.then(_this3.refreshControlBinding.bind(_this3, oControl));
          });
          return oPromiseChain;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * This function should add all controls relevant for refreshing to the provided control array.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param aCollectedControls The collected controls
     * @alias sap.fe.core.controllerextensions.ViewState#adaptBindingRefreshControls
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adaptBindingRefreshControls = function adaptBindingRefreshControls(aCollectedControls) {// to be overriden
    };

    _proto.refreshControlBinding = function refreshControlBinding(oControl) {
      var oControlRefreshBindingHandler = this.getControlRefreshBindingHandler(oControl);
      var oPromiseChain = Promise.resolve();

      if (typeof oControlRefreshBindingHandler.refreshBinding !== "function") {
        Log.info("refreshBinding handler for control: ".concat(oControl.getMetadata().getName(), " is not provided"));
      } else {
        oPromiseChain = oPromiseChain.then(oControlRefreshBindingHandler.refreshBinding.bind(this, oControl));
      }

      return oPromiseChain;
    }
    /**
     * Returns a map of <code>refreshBinding</code> function for a certain control.
     *
     * @param {sap.ui.base.ManagedObject} oControl The control to get state handler for
     * @returns {object} A plain object with one function: <code>refreshBinding</code>
     */
    ;

    _proto.getControlRefreshBindingHandler = function getControlRefreshBindingHandler(oControl) {
      var oRefreshBindingHandler = {};

      if (oControl) {
        for (var sType in _mControlStateHandlerMap) {
          if (oControl.isA(sType)) {
            // pass only the refreshBinding handler in an object so that :
            // 1. Application has access only to refreshBinding and not apply and reterive at this stage
            // 2. Application modifications to the object will be reflected here (as we pass by reference)
            oRefreshBindingHandler["refreshBinding"] = _mControlStateHandlerMap[sType].refreshBinding || {};
            break;
          }
        }
      }

      this.base.viewState.adaptBindingRefreshHandler(oControl, oRefreshBindingHandler);
      return oRefreshBindingHandler;
    }
    /**
     * Customize the <code>refreshBinding</code> function for a certain control.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param oControl The control for which the refresh handler is adapted.
     * @param oControlHandler A plain object which can have one function: <code>refreshBinding</code>
     * @alias sap.fe.core.controllerextensions.ViewState#adaptBindingRefreshHandler
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adaptBindingRefreshHandler = function adaptBindingRefreshHandler(oControl, oControlHandler) {// to be overriden
    }
    /**
     * Called when the application is suspended due to keep-alive mode.
     *
     * @alias sap.fe.core.controllerextensions.ViewState#onSuspend
     * @public
     */
    ;

    _proto.onSuspend = function onSuspend() {// to be overriden
    }
    /**
     * Called when the application is restored due to keep-alive mode.
     *
     * @alias sap.fe.core.controllerextensions.ViewState#onRestore
     * @public
     */
    ;

    _proto.onRestore = function onRestore() {// to be overriden
    }
    /**
     * Destructor method for objects.
     */
    ;

    _proto.destroy = function destroy() {
      delete this._pInitialStateAppliedResolve;

      _ControllerExtension.prototype.destroy.call(this);
    }
    /**
     * Helper function to enable multi override. It is adding an additional parameter (array) to the provided
     * function (and its parameters), that will be evaluated via <code>Promise.all</code>.
     *
     * @param fnCall The function to be called
     * @param args
     * @returns A promise to be resolved with the result of all overrides
     */
    ;

    _proto.collectResults = function collectResults(fnCall) {
      var aResults = [];

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      args.push(aResults);
      fnCall.apply(this, args);
      return Promise.all(aResults);
    }
    /**
     * Customize the <code>retrieve</code> and <code>apply</code> functions for a certain control.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param oControl The control to get state handler for
     * @param aControlHandler A list of plain objects with two functions: <code>retrieve</code> and <code>apply</code>
     * @alias sap.fe.core.controllerextensions.ViewState#adaptControlStateHandler
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adaptControlStateHandler = function adaptControlStateHandler(oControl, aControlHandler) {// to be overridden if needed
    }
    /**
     * Returns a map of <code>retrieve</code> and <code>apply</code> functions for a certain control.
     *
     * @param oControl The control to get state handler for
     * @returns A plain object with two functions: <code>retrieve</code> and <code>apply</code>
     */
    ;

    _proto.getControlStateHandler = function getControlStateHandler(oControl) {
      var aInternalControlStateHandler = [],
          aCustomControlStateHandler = [];

      if (oControl) {
        for (var sType in _mControlStateHandlerMap) {
          if (oControl.isA(sType)) {
            // avoid direct manipulation of internal _mControlStateHandlerMap
            aInternalControlStateHandler.push(Object.assign({}, _mControlStateHandlerMap[sType]));
            break;
          }
        }
      }

      this.base.viewState.adaptControlStateHandler(oControl, aCustomControlStateHandler);
      return aInternalControlStateHandler.concat(aCustomControlStateHandler);
    }
    /**
     * This function should add all controls for given view that should be considered for the state handling to the provided control array.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param aCollectedControls The collected controls
     * @alias sap.fe.core.controllerextensions.ViewState#adaptStateControls
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adaptStateControls = function adaptStateControls(aCollectedControls) {// to be overridden if needed
    }
    /**
     * Returns the key to be used for given control.
     *
     * @param oControl The control to get state key for
     * @returns The key to be used for storing the controls state
     */
    ;

    _proto.getStateKey = function getStateKey(oControl) {
      return this.getView().getLocalId(oControl.getId()) || oControl.getId();
    }
    /**
     * Retrieve the view state of this extensions view.
     * When this function is called more than once before finishing, all but the final response will resolve to <code>undefined</code>.
     *
     * @returns A promise resolving the view state
     * @alias sap.fe.core.controllerextensions.ViewState#retrieveViewState
     * @public
     */
    ;

    _proto.retrieveViewState = function retrieveViewState() {
      try {
        var _this5 = this;

        function _temp3() {
          return _this5._iRetrievingStateCounter === 0 ? oViewState : undefined;
        }

        ++_this5._iRetrievingStateCounter;
        var oViewState;

        var _temp4 = _finallyRethrows(function () {
          return Promise.resolve(_this5._pInitialStateApplied).then(function () {
            return Promise.resolve(_this5.collectResults(_this5.base.viewState.adaptStateControls)).then(function (aControls) {
              return Promise.resolve(Promise.all(aControls.filter(function (oControl) {
                return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
              }).map(function (oControl) {
                return _this5.retrieveControlState(oControl).then(function (vResult) {
                  return {
                    key: _this5.getStateKey(oControl),
                    value: vResult
                  };
                });
              }))).then(function (aResolvedStates) {
                oViewState = aResolvedStates.reduce(function (oStates, mState) {
                  var oCurrentState = {};
                  oCurrentState[mState.key] = mState.value;
                  return mergeObjects(oStates, oCurrentState);
                }, {});
                return Promise.resolve(Promise.resolve(_this5._retrieveAdditionalStates())).then(function (mAdditionalStates) {
                  if (mAdditionalStates && Object.keys(mAdditionalStates).length) {
                    oViewState[ADDITIONAL_STATES_KEY] = mAdditionalStates;
                  }
                });
              });
            });
          });
        }, function (_wasThrown, _result) {
          --_this5._iRetrievingStateCounter;
          if (_wasThrown) throw _result;
          return _result;
        });

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Extend the map of additional states (not control bound) to be added to the current view state of the given view.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param mAdditionalStates The additional state
     * @alias sap.fe.core.controllerextensions.ViewState#retrieveAdditionalStates
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    retrieveAdditionalStates = function retrieveAdditionalStates(mAdditionalStates) {// to be overridden if needed
    }
    /**
     * Returns a map of additional states (not control bound) to be added to the current view state of the given view.
     *
     * @returns Additional view states
     */
    ;

    _proto._retrieveAdditionalStates = function _retrieveAdditionalStates() {
      var mAdditionalStates = {};
      this.base.viewState.retrieveAdditionalStates(mAdditionalStates);
      return mAdditionalStates;
    }
    /**
     * Returns the current state for the given control.
     *
     * @param oControl The object to get the state for
     * @returns The state for the given control
     */
    ;

    _proto.retrieveControlState = function retrieveControlState(oControl) {
      var _this6 = this;

      var aControlStateHandlers = this.getControlStateHandler(oControl);
      return Promise.all(aControlStateHandlers.map(function (mControlStateHandler) {
        if (typeof mControlStateHandler.retrieve !== "function") {
          throw new Error("controlStateHandler.retrieve is not a function for control: ".concat(oControl.getMetadata().getName()));
        }

        return mControlStateHandler.retrieve.call(_this6, oControl);
      })).then(function (aStates) {
        return aStates.reduce(function (oFinalState, oCurrentState) {
          return mergeObjects(oFinalState, oCurrentState);
        }, {});
      });
    }
    /**
     * Defines whether the view state should only be applied once initially.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.Instead}.
     *
     * Important:
     * You should only override this method for custom pages and not for the standard ListReportPage and ObjectPage!
     *
     * @returns If <code>true</code>, only the initial view state is applied once,
     * else any new view state is also applied on follow-up calls (default)
     * @alias sap.fe.core.controllerextensions.ViewState#applyInitialStateOnly
     * @protected
     */
    ;

    _proto.applyInitialStateOnly = function applyInitialStateOnly() {
      return true;
    }
    /**
     * Applies the given view state to this extensions view.
     *
     * @param oViewState The view state to apply (can be undefined)
     * @param oNavParameter The current navigation parameter
     * @param oNavParameter.navigationType The actual navigation type
     * @param oNavParameter.selectionVariant The selectionVariant from the navigation
     * @param oNavParameter.selectionVariantDefaults The selectionVariant defaults from the navigation
     * @param oNavParameter.requiresStandardVariant Defines whether the standard variant must be used in variant management
     * @returns Promise for async state handling
     * @alias sap.fe.core.controllerextensions.ViewState#applyViewState
     * @public
     */
    ;

    _proto.applyViewState = function applyViewState(oViewState, oNavParameter) {
      try {
        var _this8 = this;

        if (_this8.base.viewState.applyInitialStateOnly() && _this8._getInitialStateApplied()) {
          return Promise.resolve();
        }

        var _temp9 = _finallyRethrows(function () {
          return Promise.resolve(_this8.collectResults(_this8.base.viewState.onBeforeStateApplied)).then(function () {
            return Promise.resolve(_this8.collectResults(_this8.base.viewState.adaptStateControls)).then(function (aControls) {
              var oPromiseChain = Promise.resolve();
              aControls.filter(function (oControl) {
                return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
              }).forEach(function (oControl) {
                var sKey = _this8.getStateKey(oControl);

                oPromiseChain = oPromiseChain.then(_this8.applyControlState.bind(_this8, oControl, oViewState ? oViewState[sKey] : undefined, oNavParameter));
              });
              return Promise.resolve(oPromiseChain).then(function () {
                var _temp5 = function () {
                  if (oNavParameter.navigationType === NavType.iAppState) {
                    return Promise.resolve(_this8.collectResults(_this8.base.viewState.applyAdditionalStates, oViewState ? oViewState[ADDITIONAL_STATES_KEY] : undefined)).then(function () {});
                  } else {
                    return Promise.resolve(_this8.collectResults(_this8.base.viewState.applyNavigationParameters, oNavParameter)).then(function () {
                      return Promise.resolve(_this8.collectResults(_this8.base.viewState._applyNavigationParametersToFilterbar, oNavParameter)).then(function () {});
                    });
                  }
                }();

                if (_temp5 && _temp5.then) return _temp5.then(function () {});
              });
            });
          });
        }, function (_wasThrown2, _result2) {
          function _temp7() {
            if (_wasThrown2) throw _result2;
            return _result2;
          }

          var _temp6 = _catch(function () {
            return Promise.resolve(_this8.collectResults(_this8.base.viewState.onAfterStateApplied)).then(function () {
              _this8._setInitialStateApplied();
            });
          }, function (e) {
            Log.error(e);
          });

          return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
        });

        return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._checkIfVariantIdIsAvailable = function _checkIfVariantIdIsAvailable(oVM, sVariantId) {
      var aVariants = oVM.getVariants();
      var bIsControlStateVariantAvailable = false;
      aVariants.forEach(function (oVariant) {
        if (oVariant.key === sVariantId) {
          bIsControlStateVariantAvailable = true;
        }
      });
      return bIsControlStateVariantAvailable;
    };

    _proto._setInitialStateApplied = function _setInitialStateApplied() {
      if (this._pInitialStateAppliedResolve) {
        var pInitialStateAppliedResolve = this._pInitialStateAppliedResolve;
        delete this._pInitialStateAppliedResolve;
        pInitialStateAppliedResolve();
      }
    };

    _proto._getInitialStateApplied = function _getInitialStateApplied() {
      return !this._pInitialStateAppliedResolve;
    }
    /**
     * Hook to react before a state for given view is applied.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param aPromises Extensible array of promises to be resolved before continuing
     * @alias sap.fe.core.controllerextensions.ViewState#onBeforeStateApplied
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeStateApplied = function onBeforeStateApplied(aPromises) {// to be overriden
    }
    /**
     * Hook to react when state for given view was applied.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param aPromises Extensible array of promises to be resolved before continuing
     * @alias sap.fe.core.controllerextensions.ViewState#onAfterStateApplied
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAfterStateApplied = function onAfterStateApplied(aPromises) {// to be overriden
    }
    /**
     * Applying additional, not control related, states - is called only if navigation type is iAppState.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param oViewState The current view state
     * @param aPromises Extensible array of promises to be resolved before continuing
     * @alias sap.fe.core.controllerextensions.ViewState#applyAdditionalStates
     * @protected
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    applyAdditionalStates = function applyAdditionalStates(oViewState, aPromises) {// to be overridden if needed
    };

    _proto._applyNavigationParametersToFilterbar = function _applyNavigationParametersToFilterbar(_oNavParameter, _aPromises) {// to be overridden if needed
    }
    /**
     * Apply navigation parameters is not called if the navigation type is iAppState
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param oNavParameter The current navigation parameter
     * @param oNavParameter.navigationType The actual navigation type
     * @param [oNavParameter.selectionVariant] The selectionVariant from the navigation
     * @param [oNavParameter.selectionVariantDefaults] The selectionVariant defaults from the navigation
     * @param [oNavParameter.requiresStandardVariant] Defines whether the standard variant must be used in variant management
     * @param aPromises Extensible array of promises to be resolved before continuing
     * @alias sap.fe.core.controllerextensions.ViewState#applyNavigationParameters
     * @protected
     */
    ;

    _proto.applyNavigationParameters = function applyNavigationParameters( // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oNavParameter, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    aPromises) {// to be overridden if needed
    }
    /**
     * Applying the given state to the given control.
     *
     * @param oControl The object to apply the given state
     * @param oControlState The state for the given control
     * @param [oNavParameters] The current navigation parameters
     * @returns Return a promise for async state handling
     */
    ;

    _proto.applyControlState = function applyControlState(oControl, oControlState, oNavParameters) {
      var _this9 = this;

      var aControlStateHandlers = this.getControlStateHandler(oControl);
      var oPromiseChain = Promise.resolve();
      aControlStateHandlers.forEach(function (mControlStateHandler) {
        if (typeof mControlStateHandler.apply !== "function") {
          throw new Error("controlStateHandler.apply is not a function for control: ".concat(oControl.getMetadata().getName()));
        }

        oPromiseChain = oPromiseChain.then(mControlStateHandler.apply.bind(_this9, oControl, oControlState, oNavParameters));
      });
      return oPromiseChain;
    };

    _proto.getInterface = function getInterface() {
      return this;
    };

    return ViewState;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "refreshViewBindings", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "refreshViewBindings"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "adaptBindingRefreshControls", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "adaptBindingRefreshControls"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "refreshControlBinding", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "refreshControlBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getControlRefreshBindingHandler", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "getControlRefreshBindingHandler"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "adaptBindingRefreshHandler", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "adaptBindingRefreshHandler"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onSuspend", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "onSuspend"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRestore", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "onRestore"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "collectResults", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "collectResults"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "adaptControlStateHandler", [_dec18, _dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "adaptControlStateHandler"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getControlStateHandler", [_dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "getControlStateHandler"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "adaptStateControls", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "adaptStateControls"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getStateKey", [_dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "getStateKey"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "retrieveViewState", [_dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "retrieveViewState"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "retrieveAdditionalStates", [_dec28, _dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "retrieveAdditionalStates"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "retrieveControlState", [_dec30, _dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "retrieveControlState"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "applyInitialStateOnly", [_dec32, _dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "applyInitialStateOnly"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "applyViewState", [_dec34, _dec35], Object.getOwnPropertyDescriptor(_class2.prototype, "applyViewState"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_checkIfVariantIdIsAvailable", [_dec36], Object.getOwnPropertyDescriptor(_class2.prototype, "_checkIfVariantIdIsAvailable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeStateApplied", [_dec37, _dec38], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeStateApplied"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onAfterStateApplied", [_dec39, _dec40], Object.getOwnPropertyDescriptor(_class2.prototype, "onAfterStateApplied"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "applyAdditionalStates", [_dec41, _dec42], Object.getOwnPropertyDescriptor(_class2.prototype, "applyAdditionalStates"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_applyNavigationParametersToFilterbar", [_dec43], Object.getOwnPropertyDescriptor(_class2.prototype, "_applyNavigationParametersToFilterbar"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "applyNavigationParameters", [_dec44, _dec45], Object.getOwnPropertyDescriptor(_class2.prototype, "applyNavigationParameters"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "applyControlState", [_dec46, _dec47], Object.getOwnPropertyDescriptor(_class2.prototype, "applyControlState"), _class2.prototype)), _class2)) || _class);
  return ViewState;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwiZmluYWxpemVyIiwicmVzdWx0IiwiZSIsInRoZW4iLCJiaW5kIiwicmVjb3ZlciIsIkFERElUSU9OQUxfU1RBVEVTX0tFWSIsIk5hdlR5cGUiLCJOYXZMaWJyYXJ5IiwiX21Db250cm9sU3RhdGVIYW5kbGVyTWFwIiwicmV0cmlldmUiLCJvVk0iLCJnZXRDdXJyZW50VmFyaWFudEtleSIsImFwcGx5Iiwib0NvbnRyb2xTdGF0ZSIsInZhcmlhbnRJZCIsInVuZGVmaW5lZCIsInNWYXJpYW50UmVmZXJlbmNlIiwiX2NoZWNrSWZWYXJpYW50SWRJc0F2YWlsYWJsZSIsImdldFN0YW5kYXJkVmFyaWFudEtleSIsIkNvbnRyb2xWYXJpYW50QXBwbHlBUEkiLCJhY3RpdmF0ZVZhcmlhbnQiLCJlbGVtZW50IiwidmFyaWFudFJlZmVyZW5jZSIsIm9UYWJCYXIiLCJzZWxlY3RlZEtleSIsImdldFNlbGVjdGVkS2V5Iiwib1NlbGVjdGVkSXRlbSIsImdldEl0ZW1zIiwiZmluZCIsIm9JdGVtIiwiZ2V0S2V5Iiwic2V0U2VsZWN0ZWRJdGVtIiwib0ZpbHRlckJhciIsIlN0YXRlVXRpbCIsInJldHJpZXZlRXh0ZXJuYWxTdGF0ZSIsIm1GaWx0ZXJCYXJTdGF0ZSIsImFQcm9wZXJ0aWVzSW5mbyIsImdldFByb3BlcnR5SW5mb1NldCIsIm1GaWx0ZXIiLCJmaWx0ZXIiLCJvUHJvcGVydHlJbmZvIiwicGF0aCIsInJlbW92ZUZyb21BcHBTdGF0ZSIsImxlbmd0aCIsImZvckVhY2giLCJhcHBseUV4dGVybmFsU3RhdGUiLCJvVGFibGUiLCJzdXBwbGVtZW50YXJ5Q29uZmlnIiwicmVmcmVzaEJpbmRpbmciLCJvVGFibGVCaW5kaW5nIiwiZ2V0Um93QmluZGluZyIsIm9Sb290QmluZGluZyIsImdldFJvb3RCaW5kaW5nIiwicmVmcmVzaCIsIm9IZWFkZXJDb250ZXh0IiwiZ2V0SGVhZGVyQ29udGV4dCIsInNHcm91cElkIiwiZ2V0R3JvdXBJZCIsInJlcXVlc3RTaWRlRWZmZWN0cyIsIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiTG9nIiwiaW5mbyIsImdldElkIiwib0NoYXJ0Iiwib09QTGF5b3V0Iiwic2VsZWN0ZWRTZWN0aW9uIiwiZ2V0U2VsZWN0ZWRTZWN0aW9uIiwic2V0U2VsZWN0ZWRTZWN0aW9uIiwib0JpbmRpbmdDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJvQmluZGluZyIsImdldEJpbmRpbmciLCJzTWV0YVBhdGgiLCJNb2RlbEhlbHBlciIsImdldE1ldGFQYXRoRm9yQ29udGV4dCIsInNTdHJhdGVneSIsIktlZXBBbGl2ZUhlbHBlciIsImdldENvbnRyb2xSZWZyZXNoU3RyYXRlZ3lGb3JDb250ZXh0UGF0aCIsIm9Nb2RlbCIsImdldE1vZGVsIiwib01ldGFNb2RlbCIsImdldE1ldGFNb2RlbCIsIm9OYXZpZ2F0aW9uUHJvcGVydGllcyIsIkNvbW1vblV0aWxzIiwiZ2V0Q29udGV4dFBhdGhQcm9wZXJ0aWVzIiwiJGtpbmQiLCJhTmF2UHJvcGVydGllc1RvUmVxdWVzdCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhUHJldiIsInNOYXZQcm9wIiwiJGlzQ29sbGVjdGlvbiIsInB1c2giLCJhUHJvcGVydGllcyIsIiRQcm9wZXJ0eVBhdGgiLCJjb25jYXQiLCJvUXVpY2tGaWx0ZXIiLCJnZXRTZWxlY3RvcktleSIsInNldFNlbGVjdG9yS2V5Iiwib1NlZ21lbnRlZEJ1dHRvbiIsInNldFNlbGVjdGVkS2V5Iiwib1NlbGVjdCIsIm9EeW5hbWljUGFnZSIsImhlYWRlckV4cGFuZGVkIiwiZ2V0SGVhZGVyRXhwYW5kZWQiLCJzZXRIZWFkZXJFeHBhbmRlZCIsIm9WaWV3Iiwib0NvbnRyb2xsZXIiLCJnZXRDb250cm9sbGVyIiwidmlld1N0YXRlIiwicmV0cmlldmVWaWV3U3RhdGUiLCJvTmF2UGFyYW1ldGVycyIsImFwcGx5Vmlld1N0YXRlIiwicmVmcmVzaFZpZXdCaW5kaW5ncyIsIm9Db21wb25lbnRDb250YWluZXIiLCJvQ29tcG9uZW50IiwiZ2V0Q29tcG9uZW50SW5zdGFuY2UiLCJyZXRyaWV2ZUNvbnRyb2xTdGF0ZSIsImdldFJvb3RDb250cm9sIiwiYXBwbHlDb250cm9sU3RhdGUiLCJWaWV3U3RhdGUiLCJkZWZpbmVVSTVDbGFzcyIsInB1YmxpY0V4dGVuc2lvbiIsImZpbmFsRXh0ZW5zaW9uIiwiZXh0ZW5zaWJsZSIsIk92ZXJyaWRlRXhlY3V0aW9uIiwiQWZ0ZXIiLCJwcml2YXRlRXh0ZW5zaW9uIiwiSW5zdGVhZCIsIl9pUmV0cmlldmluZ1N0YXRlQ291bnRlciIsIl9wSW5pdGlhbFN0YXRlQXBwbGllZCIsIlByb21pc2UiLCJyZXNvbHZlIiwiX3BJbml0aWFsU3RhdGVBcHBsaWVkUmVzb2x2ZSIsImNvbGxlY3RSZXN1bHRzIiwiYmFzZSIsImFkYXB0QmluZGluZ1JlZnJlc2hDb250cm9scyIsImFDb250cm9scyIsIm9Qcm9taXNlQ2hhaW4iLCJvQ29udHJvbCIsImlzQSIsInJlZnJlc2hDb250cm9sQmluZGluZyIsImFDb2xsZWN0ZWRDb250cm9scyIsIm9Db250cm9sUmVmcmVzaEJpbmRpbmdIYW5kbGVyIiwiZ2V0Q29udHJvbFJlZnJlc2hCaW5kaW5nSGFuZGxlciIsImdldE1ldGFkYXRhIiwiZ2V0TmFtZSIsIm9SZWZyZXNoQmluZGluZ0hhbmRsZXIiLCJzVHlwZSIsImFkYXB0QmluZGluZ1JlZnJlc2hIYW5kbGVyIiwib0NvbnRyb2xIYW5kbGVyIiwib25TdXNwZW5kIiwib25SZXN0b3JlIiwiZGVzdHJveSIsImZuQ2FsbCIsImFSZXN1bHRzIiwiYXJncyIsImFsbCIsImFkYXB0Q29udHJvbFN0YXRlSGFuZGxlciIsImFDb250cm9sSGFuZGxlciIsImdldENvbnRyb2xTdGF0ZUhhbmRsZXIiLCJhSW50ZXJuYWxDb250cm9sU3RhdGVIYW5kbGVyIiwiYUN1c3RvbUNvbnRyb2xTdGF0ZUhhbmRsZXIiLCJhc3NpZ24iLCJhZGFwdFN0YXRlQ29udHJvbHMiLCJnZXRTdGF0ZUtleSIsImdldFZpZXciLCJnZXRMb2NhbElkIiwib1ZpZXdTdGF0ZSIsIm1hcCIsInZSZXN1bHQiLCJrZXkiLCJ2YWx1ZSIsImFSZXNvbHZlZFN0YXRlcyIsIm9TdGF0ZXMiLCJtU3RhdGUiLCJvQ3VycmVudFN0YXRlIiwibWVyZ2VPYmplY3RzIiwiX3JldHJpZXZlQWRkaXRpb25hbFN0YXRlcyIsIm1BZGRpdGlvbmFsU3RhdGVzIiwicmV0cmlldmVBZGRpdGlvbmFsU3RhdGVzIiwiYUNvbnRyb2xTdGF0ZUhhbmRsZXJzIiwibUNvbnRyb2xTdGF0ZUhhbmRsZXIiLCJFcnJvciIsImNhbGwiLCJhU3RhdGVzIiwib0ZpbmFsU3RhdGUiLCJhcHBseUluaXRpYWxTdGF0ZU9ubHkiLCJvTmF2UGFyYW1ldGVyIiwiX2dldEluaXRpYWxTdGF0ZUFwcGxpZWQiLCJvbkJlZm9yZVN0YXRlQXBwbGllZCIsInNLZXkiLCJuYXZpZ2F0aW9uVHlwZSIsImlBcHBTdGF0ZSIsImFwcGx5QWRkaXRpb25hbFN0YXRlcyIsImFwcGx5TmF2aWdhdGlvblBhcmFtZXRlcnMiLCJfYXBwbHlOYXZpZ2F0aW9uUGFyYW1ldGVyc1RvRmlsdGVyYmFyIiwib25BZnRlclN0YXRlQXBwbGllZCIsIl9zZXRJbml0aWFsU3RhdGVBcHBsaWVkIiwiZXJyb3IiLCJzVmFyaWFudElkIiwiYVZhcmlhbnRzIiwiZ2V0VmFyaWFudHMiLCJiSXNDb250cm9sU3RhdGVWYXJpYW50QXZhaWxhYmxlIiwib1ZhcmlhbnQiLCJwSW5pdGlhbFN0YXRlQXBwbGllZFJlc29sdmUiLCJhUHJvbWlzZXMiLCJfb05hdlBhcmFtZXRlciIsIl9hUHJvbWlzZXMiLCJnZXRJbnRlcmZhY2UiLCJDb250cm9sbGVyRXh0ZW5zaW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJWaWV3U3RhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgbWVyZ2VPYmplY3RzIGZyb20gXCJzYXAvYmFzZS91dGlsL21lcmdlXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgeyBkZWZpbmVVSTVDbGFzcywgZXh0ZW5zaWJsZSwgZmluYWxFeHRlbnNpb24sIHByaXZhdGVFeHRlbnNpb24sIHB1YmxpY0V4dGVuc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IEtlZXBBbGl2ZUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9LZWVwQWxpdmVIZWxwZXJcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IHR5cGUgUGFnZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL1BhZ2VDb250cm9sbGVyXCI7XG5pbXBvcnQgTmF2TGlicmFyeSBmcm9tIFwic2FwL2ZlL25hdmlnYXRpb24vbGlicmFyeVwiO1xuaW1wb3J0IHR5cGUgTWFuYWdlZE9iamVjdCBmcm9tIFwic2FwL3VpL2Jhc2UvTWFuYWdlZE9iamVjdFwiO1xuaW1wb3J0IENvbnRyb2xsZXJFeHRlbnNpb24gZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyRXh0ZW5zaW9uXCI7XG5pbXBvcnQgT3ZlcnJpZGVFeGVjdXRpb24gZnJvbSBcInNhcC91aS9jb3JlL212Yy9PdmVycmlkZUV4ZWN1dGlvblwiO1xuaW1wb3J0IENvbnRyb2xWYXJpYW50QXBwbHlBUEkgZnJvbSBcInNhcC91aS9mbC9hcHBseS9hcGkvQ29udHJvbFZhcmlhbnRBcHBseUFQSVwiO1xuaW1wb3J0IFN0YXRlVXRpbCBmcm9tIFwic2FwL3VpL21kYy9wMTNuL1N0YXRlVXRpbFwiO1xuLy8gYWRkaXRpb25hbFN0YXRlcyBhcmUgc3RvcmVkIG5leHQgdG8gY29udHJvbCBJRHMsIHNvIG5hbWUgY2xhc2ggYXZvaWRhbmNlIG5lZWRlZC4gRm9ydHVuYXRlbHkgSURzIGhhdmUgcmVzdHJpY3Rpb25zOlxuLy8gXCJBbGxvd2VkIGlzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyAoY2FwaXRhbC9sb3dlcmNhc2UpLCBkaWdpdHMsIHVuZGVyc2NvcmVzLCBkYXNoZXMsIHBvaW50cyBhbmQvb3IgY29sb25zLlwiXG4vLyBUaGVyZWZvcmUgYWRkaW5nIGEgc3ltYm9sIGxpa2UgIyBvciBAXG5jb25zdCBBRERJVElPTkFMX1NUQVRFU19LRVkgPSBcIiNhZGRpdGlvbmFsU3RhdGVzXCIsXG5cdE5hdlR5cGUgPSBOYXZMaWJyYXJ5Lk5hdlR5cGU7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBtZXRob2RzIHRvIHJldHJpZXZlICYgYXBwbHkgc3RhdGVzIGZvciB0aGUgZGlmZmVyZW50IGNvbnRyb2xzIC8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5jb25zdCBfbUNvbnRyb2xTdGF0ZUhhbmRsZXJNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG5cdFwic2FwLnVpLmZsLnZhcmlhbnRzLlZhcmlhbnRNYW5hZ2VtZW50XCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9WTTogYW55KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcInZhcmlhbnRJZFwiOiBvVk0uZ2V0Q3VycmVudFZhcmlhbnRLZXkoKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob1ZNOiBhbnksIG9Db250cm9sU3RhdGU6IGFueSkge1xuXHRcdFx0aWYgKG9Db250cm9sU3RhdGUgJiYgb0NvbnRyb2xTdGF0ZS52YXJpYW50SWQgIT09IHVuZGVmaW5lZCAmJiBvQ29udHJvbFN0YXRlLnZhcmlhbnRJZCAhPT0gb1ZNLmdldEN1cnJlbnRWYXJpYW50S2V5KCkpIHtcblx0XHRcdFx0Y29uc3Qgc1ZhcmlhbnRSZWZlcmVuY2UgPSB0aGlzLl9jaGVja0lmVmFyaWFudElkSXNBdmFpbGFibGUob1ZNLCBvQ29udHJvbFN0YXRlLnZhcmlhbnRJZClcblx0XHRcdFx0XHQ/IG9Db250cm9sU3RhdGUudmFyaWFudElkXG5cdFx0XHRcdFx0OiBvVk0uZ2V0U3RhbmRhcmRWYXJpYW50S2V5KCk7XG5cdFx0XHRcdHJldHVybiBDb250cm9sVmFyaWFudEFwcGx5QVBJLmFjdGl2YXRlVmFyaWFudCh7XG5cdFx0XHRcdFx0ZWxlbWVudDogb1ZNLFxuXHRcdFx0XHRcdHZhcmlhbnRSZWZlcmVuY2U6IHNWYXJpYW50UmVmZXJlbmNlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0XCJzYXAubS5JY29uVGFiQmFyXCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9UYWJCYXI6IGFueSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c2VsZWN0ZWRLZXk6IG9UYWJCYXIuZ2V0U2VsZWN0ZWRLZXkoKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob1RhYkJhcjogYW55LCBvQ29udHJvbFN0YXRlOiBhbnkpIHtcblx0XHRcdGlmIChvQ29udHJvbFN0YXRlICYmIG9Db250cm9sU3RhdGUuc2VsZWN0ZWRLZXkpIHtcblx0XHRcdFx0Y29uc3Qgb1NlbGVjdGVkSXRlbSA9IG9UYWJCYXIuZ2V0SXRlbXMoKS5maW5kKGZ1bmN0aW9uIChvSXRlbTogYW55KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9JdGVtLmdldEtleSgpID09PSBvQ29udHJvbFN0YXRlLnNlbGVjdGVkS2V5O1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKG9TZWxlY3RlZEl0ZW0pIHtcblx0XHRcdFx0XHRvVGFiQmFyLnNldFNlbGVjdGVkSXRlbShvU2VsZWN0ZWRJdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0XCJzYXAudWkubWRjLkZpbHRlckJhclwiOiB7XG5cdFx0cmV0cmlldmU6IGZ1bmN0aW9uIChvRmlsdGVyQmFyOiBhbnkpIHtcblx0XHRcdHJldHVybiBTdGF0ZVV0aWwucmV0cmlldmVFeHRlcm5hbFN0YXRlKG9GaWx0ZXJCYXIpLnRoZW4oZnVuY3Rpb24gKG1GaWx0ZXJCYXJTdGF0ZTogYW55KSB7XG5cdFx0XHRcdC8vIHJlbW92ZSBzZW5zaXRpdmUgb3IgdmlldyBzdGF0ZSBpcnJlbGV2YW50IGZpZWxkc1xuXHRcdFx0XHRjb25zdCBhUHJvcGVydGllc0luZm8gPSBvRmlsdGVyQmFyLmdldFByb3BlcnR5SW5mb1NldCgpLFxuXHRcdFx0XHRcdG1GaWx0ZXIgPSBtRmlsdGVyQmFyU3RhdGUuZmlsdGVyIHx8IHt9O1xuXHRcdFx0XHRhUHJvcGVydGllc0luZm9cblx0XHRcdFx0XHQuZmlsdGVyKGZ1bmN0aW9uIChvUHJvcGVydHlJbmZvOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdG1GaWx0ZXJbb1Byb3BlcnR5SW5mby5wYXRoXSAmJiAob1Byb3BlcnR5SW5mby5yZW1vdmVGcm9tQXBwU3RhdGUgfHwgbUZpbHRlcltvUHJvcGVydHlJbmZvLnBhdGhdLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZm9yRWFjaChmdW5jdGlvbiAob1Byb3BlcnR5SW5mbzogYW55KSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgbUZpbHRlcltvUHJvcGVydHlJbmZvLnBhdGhdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gbUZpbHRlckJhclN0YXRlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRhcHBseTogZnVuY3Rpb24gKG9GaWx0ZXJCYXI6IGFueSwgb0NvbnRyb2xTdGF0ZTogYW55KSB7XG5cdFx0XHRpZiAob0NvbnRyb2xTdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gU3RhdGVVdGlsLmFwcGx5RXh0ZXJuYWxTdGF0ZShvRmlsdGVyQmFyLCBvQ29udHJvbFN0YXRlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdFwic2FwLnVpLm1kYy5UYWJsZVwiOiB7XG5cdFx0cmV0cmlldmU6IGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdFx0cmV0dXJuIFN0YXRlVXRpbC5yZXRyaWV2ZUV4dGVybmFsU3RhdGUob1RhYmxlKTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob1RhYmxlOiBhbnksIG9Db250cm9sU3RhdGU6IGFueSkge1xuXHRcdFx0aWYgKG9Db250cm9sU3RhdGUpIHtcblx0XHRcdFx0aWYgKCFvQ29udHJvbFN0YXRlLnN1cHBsZW1lbnRhcnlDb25maWcpIHtcblx0XHRcdFx0XHRvQ29udHJvbFN0YXRlLnN1cHBsZW1lbnRhcnlDb25maWcgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gU3RhdGVVdGlsLmFwcGx5RXh0ZXJuYWxTdGF0ZShvVGFibGUsIG9Db250cm9sU3RhdGUpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVmcmVzaEJpbmRpbmc6IGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdFx0Y29uc3Qgb1RhYmxlQmluZGluZyA9IG9UYWJsZS5nZXRSb3dCaW5kaW5nKCk7XG5cdFx0XHRpZiAob1RhYmxlQmluZGluZykge1xuXHRcdFx0XHRjb25zdCBvUm9vdEJpbmRpbmcgPSBvVGFibGVCaW5kaW5nLmdldFJvb3RCaW5kaW5nKCk7XG5cdFx0XHRcdGlmIChvUm9vdEJpbmRpbmcgPT09IG9UYWJsZUJpbmRpbmcpIHtcblx0XHRcdFx0XHQvLyBhYnNvbHV0ZSBiaW5kaW5nXG5cdFx0XHRcdFx0b1RhYmxlQmluZGluZy5yZWZyZXNoKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gcmVsYXRpdmUgYmluZGluZ1xuXHRcdFx0XHRcdGNvbnN0IG9IZWFkZXJDb250ZXh0ID0gb1RhYmxlQmluZGluZy5nZXRIZWFkZXJDb250ZXh0KCk7XG5cdFx0XHRcdFx0Y29uc3Qgc0dyb3VwSWQgPSBvVGFibGVCaW5kaW5nLmdldEdyb3VwSWQoKTtcblxuXHRcdFx0XHRcdGlmIChvSGVhZGVyQ29udGV4dCkge1xuXHRcdFx0XHRcdFx0b0hlYWRlckNvbnRleHQucmVxdWVzdFNpZGVFZmZlY3RzKFt7ICROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBcIlwiIH1dLCBzR3JvdXBJZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRMb2cuaW5mbyhgVGFibGU6ICR7b1RhYmxlLmdldElkKCl9IHdhcyBub3QgcmVmcmVzaGVkLiBObyBiaW5kaW5nIGZvdW5kIWApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0XCJzYXAudWkubWRjLkNoYXJ0XCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9DaGFydDogYW55KSB7XG5cdFx0XHRyZXR1cm4gU3RhdGVVdGlsLnJldHJpZXZlRXh0ZXJuYWxTdGF0ZShvQ2hhcnQpO1xuXHRcdH0sXG5cdFx0YXBwbHk6IGZ1bmN0aW9uIChvQ2hhcnQ6IGFueSwgb0NvbnRyb2xTdGF0ZTogYW55KSB7XG5cdFx0XHRpZiAob0NvbnRyb2xTdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gU3RhdGVVdGlsLmFwcGx5RXh0ZXJuYWxTdGF0ZShvQ2hhcnQsIG9Db250cm9sU3RhdGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0XCJzYXAudXhhcC5PYmplY3RQYWdlTGF5b3V0XCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9PUExheW91dDogYW55KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzZWxlY3RlZFNlY3Rpb246IG9PUExheW91dC5nZXRTZWxlY3RlZFNlY3Rpb24oKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob09QTGF5b3V0OiBhbnksIG9Db250cm9sU3RhdGU6IGFueSkge1xuXHRcdFx0aWYgKG9Db250cm9sU3RhdGUpIHtcblx0XHRcdFx0b09QTGF5b3V0LnNldFNlbGVjdGVkU2VjdGlvbihvQ29udHJvbFN0YXRlLnNlbGVjdGVkU2VjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZWZyZXNoQmluZGluZzogZnVuY3Rpb24gKG9PUExheW91dDogYW55KSB7XG5cdFx0XHRjb25zdCBvQmluZGluZ0NvbnRleHQgPSBvT1BMYXlvdXQuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0XHRcdGNvbnN0IG9CaW5kaW5nID0gb0JpbmRpbmdDb250ZXh0ICYmIG9CaW5kaW5nQ29udGV4dC5nZXRCaW5kaW5nKCk7XG5cdFx0XHRpZiAob0JpbmRpbmcpIHtcblx0XHRcdFx0Y29uc3Qgc01ldGFQYXRoID0gTW9kZWxIZWxwZXIuZ2V0TWV0YVBhdGhGb3JDb250ZXh0KG9CaW5kaW5nQ29udGV4dCk7XG5cdFx0XHRcdGNvbnN0IHNTdHJhdGVneSA9IEtlZXBBbGl2ZUhlbHBlci5nZXRDb250cm9sUmVmcmVzaFN0cmF0ZWd5Rm9yQ29udGV4dFBhdGgob09QTGF5b3V0LCBzTWV0YVBhdGgpO1xuXHRcdFx0XHRpZiAoc1N0cmF0ZWd5ID09PSBcInNlbGZcIikge1xuXHRcdFx0XHRcdC8vIFJlZnJlc2ggbWFpbiBjb250ZXh0IGFuZCAxLTEgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzIG9yIE9QXG5cdFx0XHRcdFx0Y29uc3Qgb01vZGVsID0gb0JpbmRpbmdDb250ZXh0LmdldE1vZGVsKCksXG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0XHRcdFx0b05hdmlnYXRpb25Qcm9wZXJ0aWVzID1cblx0XHRcdFx0XHRcdFx0Q29tbW9uVXRpbHMuZ2V0Q29udGV4dFBhdGhQcm9wZXJ0aWVzKG9NZXRhTW9kZWwsIHNNZXRhUGF0aCwge1xuXHRcdFx0XHRcdFx0XHRcdCRraW5kOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiXG5cdFx0XHRcdFx0XHRcdH0pIHx8IHt9LFxuXHRcdFx0XHRcdFx0YU5hdlByb3BlcnRpZXNUb1JlcXVlc3QgPSBPYmplY3Qua2V5cyhvTmF2aWdhdGlvblByb3BlcnRpZXMpLnJlZHVjZShmdW5jdGlvbiAoYVByZXY6IGFueVtdLCBzTmF2UHJvcDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChvTmF2aWdhdGlvblByb3BlcnRpZXNbc05hdlByb3BdLiRpc0NvbGxlY3Rpb24gIT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0XHRhUHJldi5wdXNoKHsgJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IHNOYXZQcm9wIH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhUHJldjtcblx0XHRcdFx0XHRcdH0sIFtdKSxcblx0XHRcdFx0XHRcdGFQcm9wZXJ0aWVzID0gW3sgJFByb3BlcnR5UGF0aDogXCIqXCIgfV0sXG5cdFx0XHRcdFx0XHRzR3JvdXBJZCA9IG9CaW5kaW5nLmdldEdyb3VwSWQoKTtcblxuXHRcdFx0XHRcdG9CaW5kaW5nQ29udGV4dC5yZXF1ZXN0U2lkZUVmZmVjdHMoYVByb3BlcnRpZXMuY29uY2F0KGFOYXZQcm9wZXJ0aWVzVG9SZXF1ZXN0KSwgc0dyb3VwSWQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHNTdHJhdGVneSA9PT0gXCJpbmNsdWRpbmdEZXBlbmRlbnRzXCIpIHtcblx0XHRcdFx0XHQvLyBDb21wbGV0ZSByZWZyZXNoXG5cdFx0XHRcdFx0b0JpbmRpbmcucmVmcmVzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRMb2cuaW5mbyhgT2JqZWN0UGFnZTogJHtvT1BMYXlvdXQuZ2V0SWQoKX0gd2FzIG5vdCByZWZyZXNoZWQuIE5vIGJpbmRpbmcgZm91bmQhYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcInNhcC5mZS5tYWNyb3MudGFibGUuUXVpY2tGaWx0ZXJDb250YWluZXJcIjoge1xuXHRcdHJldHJpZXZlOiBmdW5jdGlvbiAob1F1aWNrRmlsdGVyOiBhbnkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHNlbGVjdGVkS2V5OiBvUXVpY2tGaWx0ZXIuZ2V0U2VsZWN0b3JLZXkoKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob1F1aWNrRmlsdGVyOiBhbnksIG9Db250cm9sU3RhdGU6IGFueSkge1xuXHRcdFx0aWYgKG9Db250cm9sU3RhdGUpIHtcblx0XHRcdFx0b1F1aWNrRmlsdGVyLnNldFNlbGVjdG9yS2V5KG9Db250cm9sU3RhdGUuc2VsZWN0ZWRLZXkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0XCJzYXAubS5TZWdtZW50ZWRCdXR0b25cIjoge1xuXHRcdHJldHJpZXZlOiBmdW5jdGlvbiAob1NlZ21lbnRlZEJ1dHRvbjogYW55KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzZWxlY3RlZEtleTogb1NlZ21lbnRlZEJ1dHRvbi5nZXRTZWxlY3RlZEtleSgpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0YXBwbHk6IGZ1bmN0aW9uIChvU2VnbWVudGVkQnV0dG9uOiBhbnksIG9Db250cm9sU3RhdGU6IGFueSkge1xuXHRcdFx0aWYgKG9Db250cm9sU3RhdGUpIHtcblx0XHRcdFx0b1NlZ21lbnRlZEJ1dHRvbi5zZXRTZWxlY3RlZEtleShvQ29udHJvbFN0YXRlLnNlbGVjdGVkS2V5KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdFwic2FwLm0uU2VsZWN0XCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9TZWxlY3Q6IGFueSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c2VsZWN0ZWRLZXk6IG9TZWxlY3QuZ2V0U2VsZWN0ZWRLZXkoKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob1NlbGVjdDogYW55LCBvQ29udHJvbFN0YXRlOiBhbnkpIHtcblx0XHRcdGlmIChvQ29udHJvbFN0YXRlKSB7XG5cdFx0XHRcdG9TZWxlY3Quc2V0U2VsZWN0ZWRLZXkob0NvbnRyb2xTdGF0ZS5zZWxlY3RlZEtleSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcInNhcC5mLkR5bmFtaWNQYWdlXCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9EeW5hbWljUGFnZTogYW55KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRoZWFkZXJFeHBhbmRlZDogb0R5bmFtaWNQYWdlLmdldEhlYWRlckV4cGFuZGVkKClcblx0XHRcdH07XG5cdFx0fSxcblx0XHRhcHBseTogZnVuY3Rpb24gKG9EeW5hbWljUGFnZTogYW55LCBvQ29udHJvbFN0YXRlOiBhbnkpIHtcblx0XHRcdGlmIChvQ29udHJvbFN0YXRlKSB7XG5cdFx0XHRcdG9EeW5hbWljUGFnZS5zZXRIZWFkZXJFeHBhbmRlZChvQ29udHJvbFN0YXRlLmhlYWRlckV4cGFuZGVkKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdFwic2FwLnVpLmNvcmUubXZjLlZpZXdcIjoge1xuXHRcdHJldHJpZXZlOiBmdW5jdGlvbiAob1ZpZXc6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCk7XG5cdFx0XHRpZiAob0NvbnRyb2xsZXIgJiYgb0NvbnRyb2xsZXIudmlld1N0YXRlKSB7XG5cdFx0XHRcdHJldHVybiBvQ29udHJvbGxlci52aWV3U3RhdGUucmV0cmlldmVWaWV3U3RhdGUob0NvbnRyb2xsZXIudmlld1N0YXRlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7fTtcblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAob1ZpZXc6IGFueSwgb0NvbnRyb2xTdGF0ZTogYW55LCBvTmF2UGFyYW1ldGVyczogYW55KSB7XG5cdFx0XHRjb25zdCBvQ29udHJvbGxlciA9IG9WaWV3LmdldENvbnRyb2xsZXIoKTtcblx0XHRcdGlmIChvQ29udHJvbGxlciAmJiBvQ29udHJvbGxlci52aWV3U3RhdGUpIHtcblx0XHRcdFx0cmV0dXJuIG9Db250cm9sbGVyLnZpZXdTdGF0ZS5hcHBseVZpZXdTdGF0ZShvQ29udHJvbFN0YXRlLCBvTmF2UGFyYW1ldGVycyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZWZyZXNoQmluZGluZzogZnVuY3Rpb24gKG9WaWV3OiBhbnkpIHtcblx0XHRcdGNvbnN0IG9Db250cm9sbGVyID0gb1ZpZXcuZ2V0Q29udHJvbGxlcigpO1xuXHRcdFx0aWYgKG9Db250cm9sbGVyICYmIG9Db250cm9sbGVyLnZpZXdTdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gb0NvbnRyb2xsZXIudmlld1N0YXRlLnJlZnJlc2hWaWV3QmluZGluZ3MoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdFwic2FwLnVpLmNvcmUuQ29tcG9uZW50Q29udGFpbmVyXCI6IHtcblx0XHRyZXRyaWV2ZTogZnVuY3Rpb24gKG9Db21wb25lbnRDb250YWluZXI6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0NvbXBvbmVudCA9IG9Db21wb25lbnRDb250YWluZXIuZ2V0Q29tcG9uZW50SW5zdGFuY2UoKTtcblx0XHRcdGlmIChvQ29tcG9uZW50KSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJldHJpZXZlQ29udHJvbFN0YXRlKG9Db21wb25lbnQuZ2V0Um9vdENvbnRyb2woKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fSxcblx0XHRhcHBseTogZnVuY3Rpb24gKG9Db21wb25lbnRDb250YWluZXI6IGFueSwgb0NvbnRyb2xTdGF0ZTogYW55LCBvTmF2UGFyYW1ldGVyczogYW55KSB7XG5cdFx0XHRjb25zdCBvQ29tcG9uZW50ID0gb0NvbXBvbmVudENvbnRhaW5lci5nZXRDb21wb25lbnRJbnN0YW5jZSgpO1xuXHRcdFx0aWYgKG9Db21wb25lbnQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuYXBwbHlDb250cm9sU3RhdGUob0NvbXBvbmVudC5nZXRSb290Q29udHJvbCgpLCBvQ29udHJvbFN0YXRlLCBvTmF2UGFyYW1ldGVycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuLyoqXG4gKiBBIGNvbnRyb2xsZXIgZXh0ZW5zaW9uIG9mZmVyaW5nIGhvb2tzIGZvciBzdGF0ZSBoYW5kbGluZ1xuICpcbiAqIElmIHlvdSBuZWVkIHRvIG1haW50YWluIGEgc3BlY2lmaWMgc3RhdGUgZm9yIHlvdXIgYXBwbGljYXRpb24sIHlvdSBjYW4gdXNlIHRoZSBjb250cm9sbGVyIGV4dGVuc2lvbi5cbiAqXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAcHVibGljXG4gKiBAc2luY2UgMS44NS4wXG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZVwiKVxuY2xhc3MgVmlld1N0YXRlIGV4dGVuZHMgQ29udHJvbGxlckV4dGVuc2lvbiB7XG5cdHByaXZhdGUgX2lSZXRyaWV2aW5nU3RhdGVDb3VudGVyOiBudW1iZXI7XG5cdHByaXZhdGUgX3BJbml0aWFsU3RhdGVBcHBsaWVkOiBQcm9taXNlPHVua25vd24+O1xuXHRwcml2YXRlIF9wSW5pdGlhbFN0YXRlQXBwbGllZFJlc29sdmU/OiBGdW5jdGlvbjtcblx0cHJpdmF0ZSBiYXNlITogUGFnZUNvbnRyb2xsZXI7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9pUmV0cmlldmluZ1N0YXRlQ291bnRlciA9IDA7XG5cdFx0dGhpcy5fcEluaXRpYWxTdGF0ZUFwcGxpZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0dGhpcy5fcEluaXRpYWxTdGF0ZUFwcGxpZWRSZXNvbHZlID0gcmVzb2x2ZTtcblx0XHR9KTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRhc3luYyByZWZyZXNoVmlld0JpbmRpbmdzKCkge1xuXHRcdGNvbnN0IGFDb250cm9scyA9IGF3YWl0IHRoaXMuY29sbGVjdFJlc3VsdHModGhpcy5iYXNlLnZpZXdTdGF0ZS5hZGFwdEJpbmRpbmdSZWZyZXNoQ29udHJvbHMpO1xuXHRcdGxldCBvUHJvbWlzZUNoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0YUNvbnRyb2xzXG5cdFx0XHQuZmlsdGVyKChvQ29udHJvbDogYW55KSA9PiB7XG5cdFx0XHRcdHJldHVybiBvQ29udHJvbCAmJiBvQ29udHJvbC5pc0EgJiYgb0NvbnRyb2wuaXNBKFwic2FwLnVpLmJhc2UuTWFuYWdlZE9iamVjdFwiKTtcblx0XHRcdH0pXG5cdFx0XHQuZm9yRWFjaCgob0NvbnRyb2w6IGFueSkgPT4ge1xuXHRcdFx0XHRvUHJvbWlzZUNoYWluID0gb1Byb21pc2VDaGFpbi50aGVuKHRoaXMucmVmcmVzaENvbnRyb2xCaW5kaW5nLmJpbmQodGhpcywgb0NvbnRyb2wpKTtcblx0XHRcdH0pO1xuXHRcdHJldHVybiBvUHJvbWlzZUNoYWluO1xuXHR9XG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBhZGQgYWxsIGNvbnRyb2xzIHJlbGV2YW50IGZvciByZWZyZXNoaW5nIHRvIHRoZSBwcm92aWRlZCBjb250cm9sIGFycmF5LlxuXHQgKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW50IHRvIGJlIGluZGl2aWR1YWxseSBvdmVycmlkZGVuIGJ5IGNvbnN1bWluZyBjb250cm9sbGVycywgYnV0IG5vdCB0byBiZSBjYWxsZWQgZGlyZWN0bHkuXG5cdCAqIFRoZSBvdmVycmlkZSBleGVjdXRpb24gaXM6IHtAbGluayBzYXAudWkuY29yZS5tdmMuT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXJ9LlxuXHQgKlxuXHQgKiBAcGFyYW0gYUNvbGxlY3RlZENvbnRyb2xzIFRoZSBjb2xsZWN0ZWQgY29udHJvbHNcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZSNhZGFwdEJpbmRpbmdSZWZyZXNoQ29udHJvbHNcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdGFkYXB0QmluZGluZ1JlZnJlc2hDb250cm9scyhhQ29sbGVjdGVkQ29udHJvbHM6IE1hbmFnZWRPYmplY3RbXSkge1xuXHRcdC8vIHRvIGJlIG92ZXJyaWRlblxuXHR9XG5cblx0QHByaXZhdGVFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRyZWZyZXNoQ29udHJvbEJpbmRpbmcob0NvbnRyb2w6IGFueSkge1xuXHRcdGNvbnN0IG9Db250cm9sUmVmcmVzaEJpbmRpbmdIYW5kbGVyID0gdGhpcy5nZXRDb250cm9sUmVmcmVzaEJpbmRpbmdIYW5kbGVyKG9Db250cm9sKTtcblx0XHRsZXQgb1Byb21pc2VDaGFpbiA9IFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdGlmICh0eXBlb2Ygb0NvbnRyb2xSZWZyZXNoQmluZGluZ0hhbmRsZXIucmVmcmVzaEJpbmRpbmcgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0TG9nLmluZm8oYHJlZnJlc2hCaW5kaW5nIGhhbmRsZXIgZm9yIGNvbnRyb2w6ICR7b0NvbnRyb2wuZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCl9IGlzIG5vdCBwcm92aWRlZGApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUHJvbWlzZUNoYWluID0gb1Byb21pc2VDaGFpbi50aGVuKG9Db250cm9sUmVmcmVzaEJpbmRpbmdIYW5kbGVyLnJlZnJlc2hCaW5kaW5nLmJpbmQodGhpcywgb0NvbnRyb2wpKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9Qcm9taXNlQ2hhaW47XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIG1hcCBvZiA8Y29kZT5yZWZyZXNoQmluZGluZzwvY29kZT4gZnVuY3Rpb24gZm9yIGEgY2VydGFpbiBjb250cm9sLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3NhcC51aS5iYXNlLk1hbmFnZWRPYmplY3R9IG9Db250cm9sIFRoZSBjb250cm9sIHRvIGdldCBzdGF0ZSBoYW5kbGVyIGZvclxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBBIHBsYWluIG9iamVjdCB3aXRoIG9uZSBmdW5jdGlvbjogPGNvZGU+cmVmcmVzaEJpbmRpbmc8L2NvZGU+XG5cdCAqL1xuXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Z2V0Q29udHJvbFJlZnJlc2hCaW5kaW5nSGFuZGxlcihvQ29udHJvbDogYW55KTogYW55IHtcblx0XHRjb25zdCBvUmVmcmVzaEJpbmRpbmdIYW5kbGVyOiBhbnkgPSB7fTtcblx0XHRpZiAob0NvbnRyb2wpIHtcblx0XHRcdGZvciAoY29uc3Qgc1R5cGUgaW4gX21Db250cm9sU3RhdGVIYW5kbGVyTWFwKSB7XG5cdFx0XHRcdGlmIChvQ29udHJvbC5pc0Eoc1R5cGUpKSB7XG5cdFx0XHRcdFx0Ly8gcGFzcyBvbmx5IHRoZSByZWZyZXNoQmluZGluZyBoYW5kbGVyIGluIGFuIG9iamVjdCBzbyB0aGF0IDpcblx0XHRcdFx0XHQvLyAxLiBBcHBsaWNhdGlvbiBoYXMgYWNjZXNzIG9ubHkgdG8gcmVmcmVzaEJpbmRpbmcgYW5kIG5vdCBhcHBseSBhbmQgcmV0ZXJpdmUgYXQgdGhpcyBzdGFnZVxuXHRcdFx0XHRcdC8vIDIuIEFwcGxpY2F0aW9uIG1vZGlmaWNhdGlvbnMgdG8gdGhlIG9iamVjdCB3aWxsIGJlIHJlZmxlY3RlZCBoZXJlIChhcyB3ZSBwYXNzIGJ5IHJlZmVyZW5jZSlcblx0XHRcdFx0XHRvUmVmcmVzaEJpbmRpbmdIYW5kbGVyW1wicmVmcmVzaEJpbmRpbmdcIl0gPSBfbUNvbnRyb2xTdGF0ZUhhbmRsZXJNYXBbc1R5cGVdLnJlZnJlc2hCaW5kaW5nIHx8IHt9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuYmFzZS52aWV3U3RhdGUuYWRhcHRCaW5kaW5nUmVmcmVzaEhhbmRsZXIob0NvbnRyb2wsIG9SZWZyZXNoQmluZGluZ0hhbmRsZXIpO1xuXHRcdHJldHVybiBvUmVmcmVzaEJpbmRpbmdIYW5kbGVyO1xuXHR9XG5cdC8qKlxuXHQgKiBDdXN0b21pemUgdGhlIDxjb2RlPnJlZnJlc2hCaW5kaW5nPC9jb2RlPiBmdW5jdGlvbiBmb3IgYSBjZXJ0YWluIGNvbnRyb2wuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5BZnRlcn0uXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29udHJvbCBUaGUgY29udHJvbCBmb3Igd2hpY2ggdGhlIHJlZnJlc2ggaGFuZGxlciBpcyBhZGFwdGVkLlxuXHQgKiBAcGFyYW0gb0NvbnRyb2xIYW5kbGVyIEEgcGxhaW4gb2JqZWN0IHdoaWNoIGNhbiBoYXZlIG9uZSBmdW5jdGlvbjogPGNvZGU+cmVmcmVzaEJpbmRpbmc8L2NvZGU+XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5WaWV3U3RhdGUjYWRhcHRCaW5kaW5nUmVmcmVzaEhhbmRsZXJcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdGFkYXB0QmluZGluZ1JlZnJlc2hIYW5kbGVyKG9Db250cm9sOiBNYW5hZ2VkT2JqZWN0LCBvQ29udHJvbEhhbmRsZXI6IGFueVtdKSB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGVuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHN1c3BlbmRlZCBkdWUgdG8ga2VlcC1hbGl2ZSBtb2RlLlxuXHQgKlxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuVmlld1N0YXRlI29uU3VzcGVuZFxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdG9uU3VzcGVuZCgpIHtcblx0XHQvLyB0byBiZSBvdmVycmlkZW5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgcmVzdG9yZWQgZHVlIHRvIGtlZXAtYWxpdmUgbW9kZS5cblx0ICpcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZSNvblJlc3RvcmVcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHRvblJlc3RvcmUoKSB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGVuXG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJ1Y3RvciBtZXRob2QgZm9yIG9iamVjdHMuXG5cdCAqL1xuXHRkZXN0cm95KCkge1xuXHRcdGRlbGV0ZSB0aGlzLl9wSW5pdGlhbFN0YXRlQXBwbGllZFJlc29sdmU7XG5cdFx0c3VwZXIuZGVzdHJveSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhlbHBlciBmdW5jdGlvbiB0byBlbmFibGUgbXVsdGkgb3ZlcnJpZGUuIEl0IGlzIGFkZGluZyBhbiBhZGRpdGlvbmFsIHBhcmFtZXRlciAoYXJyYXkpIHRvIHRoZSBwcm92aWRlZFxuXHQgKiBmdW5jdGlvbiAoYW5kIGl0cyBwYXJhbWV0ZXJzKSwgdGhhdCB3aWxsIGJlIGV2YWx1YXRlZCB2aWEgPGNvZGU+UHJvbWlzZS5hbGw8L2NvZGU+LlxuXHQgKlxuXHQgKiBAcGFyYW0gZm5DYWxsIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWRcblx0ICogQHBhcmFtIGFyZ3Ncblx0ICogQHJldHVybnMgQSBwcm9taXNlIHRvIGJlIHJlc29sdmVkIHdpdGggdGhlIHJlc3VsdCBvZiBhbGwgb3ZlcnJpZGVzXG5cdCAqL1xuXHRAcHJpdmF0ZUV4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGNvbGxlY3RSZXN1bHRzKGZuQ2FsbDogRnVuY3Rpb24sIC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0Y29uc3QgYVJlc3VsdHM6IGFueVtdID0gW107XG5cdFx0YXJncy5wdXNoKGFSZXN1bHRzKTtcblx0XHRmbkNhbGwuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGFSZXN1bHRzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDdXN0b21pemUgdGhlIDxjb2RlPnJldHJpZXZlPC9jb2RlPiBhbmQgPGNvZGU+YXBwbHk8L2NvZGU+IGZ1bmN0aW9ucyBmb3IgYSBjZXJ0YWluIGNvbnRyb2wuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5BZnRlcn0uXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29udHJvbCBUaGUgY29udHJvbCB0byBnZXQgc3RhdGUgaGFuZGxlciBmb3Jcblx0ICogQHBhcmFtIGFDb250cm9sSGFuZGxlciBBIGxpc3Qgb2YgcGxhaW4gb2JqZWN0cyB3aXRoIHR3byBmdW5jdGlvbnM6IDxjb2RlPnJldHJpZXZlPC9jb2RlPiBhbmQgPGNvZGU+YXBwbHk8L2NvZGU+XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5WaWV3U3RhdGUjYWRhcHRDb250cm9sU3RhdGVIYW5kbGVyXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRhZGFwdENvbnRyb2xTdGF0ZUhhbmRsZXIob0NvbnRyb2w6IE1hbmFnZWRPYmplY3QsIGFDb250cm9sSGFuZGxlcjogb2JqZWN0W10pIHtcblx0XHQvLyB0byBiZSBvdmVycmlkZGVuIGlmIG5lZWRlZFxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSBtYXAgb2YgPGNvZGU+cmV0cmlldmU8L2NvZGU+IGFuZCA8Y29kZT5hcHBseTwvY29kZT4gZnVuY3Rpb25zIGZvciBhIGNlcnRhaW4gY29udHJvbC5cblx0ICpcblx0ICogQHBhcmFtIG9Db250cm9sIFRoZSBjb250cm9sIHRvIGdldCBzdGF0ZSBoYW5kbGVyIGZvclxuXHQgKiBAcmV0dXJucyBBIHBsYWluIG9iamVjdCB3aXRoIHR3byBmdW5jdGlvbnM6IDxjb2RlPnJldHJpZXZlPC9jb2RlPiBhbmQgPGNvZGU+YXBwbHk8L2NvZGU+XG5cdCAqL1xuXHRAcHJpdmF0ZUV4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGdldENvbnRyb2xTdGF0ZUhhbmRsZXIob0NvbnRyb2w6IGFueSkge1xuXHRcdGNvbnN0IGFJbnRlcm5hbENvbnRyb2xTdGF0ZUhhbmRsZXIgPSBbXSxcblx0XHRcdGFDdXN0b21Db250cm9sU3RhdGVIYW5kbGVyOiBhbnlbXSA9IFtdO1xuXHRcdGlmIChvQ29udHJvbCkge1xuXHRcdFx0Zm9yIChjb25zdCBzVHlwZSBpbiBfbUNvbnRyb2xTdGF0ZUhhbmRsZXJNYXApIHtcblx0XHRcdFx0aWYgKG9Db250cm9sLmlzQShzVHlwZSkpIHtcblx0XHRcdFx0XHQvLyBhdm9pZCBkaXJlY3QgbWFuaXB1bGF0aW9uIG9mIGludGVybmFsIF9tQ29udHJvbFN0YXRlSGFuZGxlck1hcFxuXHRcdFx0XHRcdGFJbnRlcm5hbENvbnRyb2xTdGF0ZUhhbmRsZXIucHVzaChPYmplY3QuYXNzaWduKHt9LCBfbUNvbnRyb2xTdGF0ZUhhbmRsZXJNYXBbc1R5cGVdKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5iYXNlLnZpZXdTdGF0ZS5hZGFwdENvbnRyb2xTdGF0ZUhhbmRsZXIob0NvbnRyb2wsIGFDdXN0b21Db250cm9sU3RhdGVIYW5kbGVyKTtcblx0XHRyZXR1cm4gYUludGVybmFsQ29udHJvbFN0YXRlSGFuZGxlci5jb25jYXQoYUN1c3RvbUNvbnRyb2xTdGF0ZUhhbmRsZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGFkZCBhbGwgY29udHJvbHMgZm9yIGdpdmVuIHZpZXcgdGhhdCBzaG91bGQgYmUgY29uc2lkZXJlZCBmb3IgdGhlIHN0YXRlIGhhbmRsaW5nIHRvIHRoZSBwcm92aWRlZCBjb250cm9sIGFycmF5LlxuXHQgKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW50IHRvIGJlIGluZGl2aWR1YWxseSBvdmVycmlkZGVuIGJ5IGNvbnN1bWluZyBjb250cm9sbGVycywgYnV0IG5vdCB0byBiZSBjYWxsZWQgZGlyZWN0bHkuXG5cdCAqIFRoZSBvdmVycmlkZSBleGVjdXRpb24gaXM6IHtAbGluayBzYXAudWkuY29yZS5tdmMuT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXJ9LlxuXHQgKlxuXHQgKiBAcGFyYW0gYUNvbGxlY3RlZENvbnRyb2xzIFRoZSBjb2xsZWN0ZWQgY29udHJvbHNcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZSNhZGFwdFN0YXRlQ29udHJvbHNcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdGFkYXB0U3RhdGVDb250cm9scyhhQ29sbGVjdGVkQ29udHJvbHM6IE1hbmFnZWRPYmplY3RbXSkge1xuXHRcdC8vIHRvIGJlIG92ZXJyaWRkZW4gaWYgbmVlZGVkXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUga2V5IHRvIGJlIHVzZWQgZm9yIGdpdmVuIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ29udHJvbCBUaGUgY29udHJvbCB0byBnZXQgc3RhdGUga2V5IGZvclxuXHQgKiBAcmV0dXJucyBUaGUga2V5IHRvIGJlIHVzZWQgZm9yIHN0b3JpbmcgdGhlIGNvbnRyb2xzIHN0YXRlXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Z2V0U3RhdGVLZXkob0NvbnRyb2w6IGFueSkge1xuXHRcdHJldHVybiB0aGlzLmdldFZpZXcoKS5nZXRMb2NhbElkKG9Db250cm9sLmdldElkKCkpIHx8IG9Db250cm9sLmdldElkKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIHZpZXcgc3RhdGUgb2YgdGhpcyBleHRlbnNpb25zIHZpZXcuXG5cdCAqIFdoZW4gdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgbW9yZSB0aGFuIG9uY2UgYmVmb3JlIGZpbmlzaGluZywgYWxsIGJ1dCB0aGUgZmluYWwgcmVzcG9uc2Ugd2lsbCByZXNvbHZlIHRvIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG5cdCAqXG5cdCAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdGhlIHZpZXcgc3RhdGVcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZSNyZXRyaWV2ZVZpZXdTdGF0ZVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXN5bmMgcmV0cmlldmVWaWV3U3RhdGUoKSB7XG5cdFx0Kyt0aGlzLl9pUmV0cmlldmluZ1N0YXRlQ291bnRlcjtcblx0XHRsZXQgb1ZpZXdTdGF0ZTogYW55O1xuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRoaXMuX3BJbml0aWFsU3RhdGVBcHBsaWVkO1xuXHRcdFx0Y29uc3QgYUNvbnRyb2xzID0gYXdhaXQgdGhpcy5jb2xsZWN0UmVzdWx0cyh0aGlzLmJhc2Uudmlld1N0YXRlLmFkYXB0U3RhdGVDb250cm9scyk7XG5cdFx0XHRjb25zdCBhUmVzb2x2ZWRTdGF0ZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0YUNvbnRyb2xzXG5cdFx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAob0NvbnRyb2w6IGFueSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9Db250cm9sICYmIG9Db250cm9sLmlzQSAmJiBvQ29udHJvbC5pc0EoXCJzYXAudWkuYmFzZS5NYW5hZ2VkT2JqZWN0XCIpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm1hcCgob0NvbnRyb2w6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMucmV0cmlldmVDb250cm9sU3RhdGUob0NvbnRyb2wpLnRoZW4oKHZSZXN1bHQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdGtleTogdGhpcy5nZXRTdGF0ZUtleShvQ29udHJvbCksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHZSZXN1bHRcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdFx0b1ZpZXdTdGF0ZSA9IGFSZXNvbHZlZFN0YXRlcy5yZWR1Y2UoZnVuY3Rpb24gKG9TdGF0ZXM6IGFueSwgbVN0YXRlOiBhbnkpIHtcblx0XHRcdFx0Y29uc3Qgb0N1cnJlbnRTdGF0ZTogYW55ID0ge307XG5cdFx0XHRcdG9DdXJyZW50U3RhdGVbbVN0YXRlLmtleV0gPSBtU3RhdGUudmFsdWU7XG5cdFx0XHRcdHJldHVybiBtZXJnZU9iamVjdHMob1N0YXRlcywgb0N1cnJlbnRTdGF0ZSk7XG5cdFx0XHR9LCB7fSk7XG5cdFx0XHRjb25zdCBtQWRkaXRpb25hbFN0YXRlcyA9IGF3YWl0IFByb21pc2UucmVzb2x2ZSh0aGlzLl9yZXRyaWV2ZUFkZGl0aW9uYWxTdGF0ZXMoKSk7XG5cdFx0XHRpZiAobUFkZGl0aW9uYWxTdGF0ZXMgJiYgT2JqZWN0LmtleXMobUFkZGl0aW9uYWxTdGF0ZXMpLmxlbmd0aCkge1xuXHRcdFx0XHRvVmlld1N0YXRlW0FERElUSU9OQUxfU1RBVEVTX0tFWV0gPSBtQWRkaXRpb25hbFN0YXRlcztcblx0XHRcdH1cblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0LS10aGlzLl9pUmV0cmlldmluZ1N0YXRlQ291bnRlcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5faVJldHJpZXZpbmdTdGF0ZUNvdW50ZXIgPT09IDAgPyBvVmlld1N0YXRlIDogdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4dGVuZCB0aGUgbWFwIG9mIGFkZGl0aW9uYWwgc3RhdGVzIChub3QgY29udHJvbCBib3VuZCkgdG8gYmUgYWRkZWQgdG8gdGhlIGN1cnJlbnQgdmlldyBzdGF0ZSBvZiB0aGUgZ2l2ZW4gdmlldy5cblx0ICpcblx0ICogVGhpcyBmdW5jdGlvbiBpcyBtZWFudCB0byBiZSBpbmRpdmlkdWFsbHkgb3ZlcnJpZGRlbiBieSBjb25zdW1pbmcgY29udHJvbGxlcnMsIGJ1dCBub3QgdG8gYmUgY2FsbGVkIGRpcmVjdGx5LlxuXHQgKiBUaGUgb3ZlcnJpZGUgZXhlY3V0aW9uIGlzOiB7QGxpbmsgc2FwLnVpLmNvcmUubXZjLk92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyfS5cblx0ICpcblx0ICogQHBhcmFtIG1BZGRpdGlvbmFsU3RhdGVzIFRoZSBhZGRpdGlvbmFsIHN0YXRlXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5WaWV3U3RhdGUjcmV0cmlldmVBZGRpdGlvbmFsU3RhdGVzXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRyZXRyaWV2ZUFkZGl0aW9uYWxTdGF0ZXMobUFkZGl0aW9uYWxTdGF0ZXM6IG9iamVjdCkge1xuXHRcdC8vIHRvIGJlIG92ZXJyaWRkZW4gaWYgbmVlZGVkXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIG1hcCBvZiBhZGRpdGlvbmFsIHN0YXRlcyAobm90IGNvbnRyb2wgYm91bmQpIHRvIGJlIGFkZGVkIHRvIHRoZSBjdXJyZW50IHZpZXcgc3RhdGUgb2YgdGhlIGdpdmVuIHZpZXcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIEFkZGl0aW9uYWwgdmlldyBzdGF0ZXNcblx0ICovXG5cdF9yZXRyaWV2ZUFkZGl0aW9uYWxTdGF0ZXMoKSB7XG5cdFx0Y29uc3QgbUFkZGl0aW9uYWxTdGF0ZXMgPSB7fTtcblx0XHR0aGlzLmJhc2Uudmlld1N0YXRlLnJldHJpZXZlQWRkaXRpb25hbFN0YXRlcyhtQWRkaXRpb25hbFN0YXRlcyk7XG5cdFx0cmV0dXJuIG1BZGRpdGlvbmFsU3RhdGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgZm9yIHRoZSBnaXZlbiBjb250cm9sLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRyb2wgVGhlIG9iamVjdCB0byBnZXQgdGhlIHN0YXRlIGZvclxuXHQgKiBAcmV0dXJucyBUaGUgc3RhdGUgZm9yIHRoZSBnaXZlbiBjb250cm9sXG5cdCAqL1xuXHRAcHJpdmF0ZUV4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHJldHJpZXZlQ29udHJvbFN0YXRlKG9Db250cm9sOiBhbnkpIHtcblx0XHRjb25zdCBhQ29udHJvbFN0YXRlSGFuZGxlcnMgPSB0aGlzLmdldENvbnRyb2xTdGF0ZUhhbmRsZXIob0NvbnRyb2wpO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdGFDb250cm9sU3RhdGVIYW5kbGVycy5tYXAoKG1Db250cm9sU3RhdGVIYW5kbGVyOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKHR5cGVvZiBtQ29udHJvbFN0YXRlSGFuZGxlci5yZXRyaWV2ZSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBjb250cm9sU3RhdGVIYW5kbGVyLnJldHJpZXZlIGlzIG5vdCBhIGZ1bmN0aW9uIGZvciBjb250cm9sOiAke29Db250cm9sLmdldE1ldGFkYXRhKCkuZ2V0TmFtZSgpfWApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBtQ29udHJvbFN0YXRlSGFuZGxlci5yZXRyaWV2ZS5jYWxsKHRoaXMsIG9Db250cm9sKTtcblx0XHRcdH0pXG5cdFx0KS50aGVuKChhU3RhdGVzOiBhbnlbXSkgPT4ge1xuXHRcdFx0cmV0dXJuIGFTdGF0ZXMucmVkdWNlKGZ1bmN0aW9uIChvRmluYWxTdGF0ZTogYW55LCBvQ3VycmVudFN0YXRlOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG1lcmdlT2JqZWN0cyhvRmluYWxTdGF0ZSwgb0N1cnJlbnRTdGF0ZSk7XG5cdFx0XHR9LCB7fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyB3aGV0aGVyIHRoZSB2aWV3IHN0YXRlIHNob3VsZCBvbmx5IGJlIGFwcGxpZWQgb25jZSBpbml0aWFsbHkuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5JbnN0ZWFkfS5cblx0ICpcblx0ICogSW1wb3J0YW50OlxuXHQgKiBZb3Ugc2hvdWxkIG9ubHkgb3ZlcnJpZGUgdGhpcyBtZXRob2QgZm9yIGN1c3RvbSBwYWdlcyBhbmQgbm90IGZvciB0aGUgc3RhbmRhcmQgTGlzdFJlcG9ydFBhZ2UgYW5kIE9iamVjdFBhZ2UhXG5cdCAqXG5cdCAqIEByZXR1cm5zIElmIDxjb2RlPnRydWU8L2NvZGU+LCBvbmx5IHRoZSBpbml0aWFsIHZpZXcgc3RhdGUgaXMgYXBwbGllZCBvbmNlLFxuXHQgKiBlbHNlIGFueSBuZXcgdmlldyBzdGF0ZSBpcyBhbHNvIGFwcGxpZWQgb24gZm9sbG93LXVwIGNhbGxzIChkZWZhdWx0KVxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuVmlld1N0YXRlI2FwcGx5SW5pdGlhbFN0YXRlT25seVxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uSW5zdGVhZClcblx0YXBwbHlJbml0aWFsU3RhdGVPbmx5KCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdC8qKlxuXHQgKiBBcHBsaWVzIHRoZSBnaXZlbiB2aWV3IHN0YXRlIHRvIHRoaXMgZXh0ZW5zaW9ucyB2aWV3LlxuXHQgKlxuXHQgKiBAcGFyYW0gb1ZpZXdTdGF0ZSBUaGUgdmlldyBzdGF0ZSB0byBhcHBseSAoY2FuIGJlIHVuZGVmaW5lZClcblx0ICogQHBhcmFtIG9OYXZQYXJhbWV0ZXIgVGhlIGN1cnJlbnQgbmF2aWdhdGlvbiBwYXJhbWV0ZXJcblx0ICogQHBhcmFtIG9OYXZQYXJhbWV0ZXIubmF2aWdhdGlvblR5cGUgVGhlIGFjdHVhbCBuYXZpZ2F0aW9uIHR5cGVcblx0ICogQHBhcmFtIG9OYXZQYXJhbWV0ZXIuc2VsZWN0aW9uVmFyaWFudCBUaGUgc2VsZWN0aW9uVmFyaWFudCBmcm9tIHRoZSBuYXZpZ2F0aW9uXG5cdCAqIEBwYXJhbSBvTmF2UGFyYW1ldGVyLnNlbGVjdGlvblZhcmlhbnREZWZhdWx0cyBUaGUgc2VsZWN0aW9uVmFyaWFudCBkZWZhdWx0cyBmcm9tIHRoZSBuYXZpZ2F0aW9uXG5cdCAqIEBwYXJhbSBvTmF2UGFyYW1ldGVyLnJlcXVpcmVzU3RhbmRhcmRWYXJpYW50IERlZmluZXMgd2hldGhlciB0aGUgc3RhbmRhcmQgdmFyaWFudCBtdXN0IGJlIHVzZWQgaW4gdmFyaWFudCBtYW5hZ2VtZW50XG5cdCAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFzeW5jIHN0YXRlIGhhbmRsaW5nXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5WaWV3U3RhdGUjYXBwbHlWaWV3U3RhdGVcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGFzeW5jIGFwcGx5Vmlld1N0YXRlKFxuXHRcdG9WaWV3U3RhdGU6IGFueSxcblx0XHRvTmF2UGFyYW1ldGVyOiB7XG5cdFx0XHRuYXZpZ2F0aW9uVHlwZTogYW55O1xuXHRcdFx0c2VsZWN0aW9uVmFyaWFudD86IG9iamVjdDtcblx0XHRcdHNlbGVjdGlvblZhcmlhbnREZWZhdWx0cz86IG9iamVjdDtcblx0XHRcdHJlcXVpcmVzU3RhbmRhcmRWYXJpYW50PzogYm9vbGVhbjtcblx0XHR9XG5cdCk6IFByb21pc2U8YW55PiB7XG5cdFx0aWYgKHRoaXMuYmFzZS52aWV3U3RhdGUuYXBwbHlJbml0aWFsU3RhdGVPbmx5KCkgJiYgdGhpcy5fZ2V0SW5pdGlhbFN0YXRlQXBwbGllZCgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRoaXMuY29sbGVjdFJlc3VsdHModGhpcy5iYXNlLnZpZXdTdGF0ZS5vbkJlZm9yZVN0YXRlQXBwbGllZCk7XG5cdFx0XHRjb25zdCBhQ29udHJvbHMgPSBhd2FpdCB0aGlzLmNvbGxlY3RSZXN1bHRzKHRoaXMuYmFzZS52aWV3U3RhdGUuYWRhcHRTdGF0ZUNvbnRyb2xzKTtcblx0XHRcdGxldCBvUHJvbWlzZUNoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHRhQ29udHJvbHNcblx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAob0NvbnRyb2w6IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBvQ29udHJvbCAmJiBvQ29udHJvbC5pc0EgJiYgb0NvbnRyb2wuaXNBKFwic2FwLnVpLmJhc2UuTWFuYWdlZE9iamVjdFwiKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZvckVhY2goKG9Db250cm9sOiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBzS2V5ID0gdGhpcy5nZXRTdGF0ZUtleShvQ29udHJvbCk7XG5cdFx0XHRcdFx0b1Byb21pc2VDaGFpbiA9IG9Qcm9taXNlQ2hhaW4udGhlbihcblx0XHRcdFx0XHRcdHRoaXMuYXBwbHlDb250cm9sU3RhdGUuYmluZCh0aGlzLCBvQ29udHJvbCwgb1ZpZXdTdGF0ZSA/IG9WaWV3U3RhdGVbc0tleV0gOiB1bmRlZmluZWQsIG9OYXZQYXJhbWV0ZXIpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBvUHJvbWlzZUNoYWluO1xuXHRcdFx0aWYgKG9OYXZQYXJhbWV0ZXIubmF2aWdhdGlvblR5cGUgPT09IE5hdlR5cGUuaUFwcFN0YXRlKSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuY29sbGVjdFJlc3VsdHMoXG5cdFx0XHRcdFx0dGhpcy5iYXNlLnZpZXdTdGF0ZS5hcHBseUFkZGl0aW9uYWxTdGF0ZXMsXG5cdFx0XHRcdFx0b1ZpZXdTdGF0ZSA/IG9WaWV3U3RhdGVbQURESVRJT05BTF9TVEFURVNfS0VZXSA6IHVuZGVmaW5lZFxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YXdhaXQgdGhpcy5jb2xsZWN0UmVzdWx0cyh0aGlzLmJhc2Uudmlld1N0YXRlLmFwcGx5TmF2aWdhdGlvblBhcmFtZXRlcnMsIG9OYXZQYXJhbWV0ZXIpO1xuXHRcdFx0XHRhd2FpdCB0aGlzLmNvbGxlY3RSZXN1bHRzKHRoaXMuYmFzZS52aWV3U3RhdGUuX2FwcGx5TmF2aWdhdGlvblBhcmFtZXRlcnNUb0ZpbHRlcmJhciwgb05hdlBhcmFtZXRlcik7XG5cdFx0XHR9XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuY29sbGVjdFJlc3VsdHModGhpcy5iYXNlLnZpZXdTdGF0ZS5vbkFmdGVyU3RhdGVBcHBsaWVkKTtcblx0XHRcdFx0dGhpcy5fc2V0SW5pdGlhbFN0YXRlQXBwbGllZCgpO1xuXHRcdFx0fSBjYXRjaCAoZTogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRAcHJpdmF0ZUV4dGVuc2lvbigpXG5cdF9jaGVja0lmVmFyaWFudElkSXNBdmFpbGFibGUob1ZNOiBhbnksIHNWYXJpYW50SWQ6IGFueSkge1xuXHRcdGNvbnN0IGFWYXJpYW50cyA9IG9WTS5nZXRWYXJpYW50cygpO1xuXHRcdGxldCBiSXNDb250cm9sU3RhdGVWYXJpYW50QXZhaWxhYmxlID0gZmFsc2U7XG5cdFx0YVZhcmlhbnRzLmZvckVhY2goZnVuY3Rpb24gKG9WYXJpYW50OiBhbnkpIHtcblx0XHRcdGlmIChvVmFyaWFudC5rZXkgPT09IHNWYXJpYW50SWQpIHtcblx0XHRcdFx0YklzQ29udHJvbFN0YXRlVmFyaWFudEF2YWlsYWJsZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGJJc0NvbnRyb2xTdGF0ZVZhcmlhbnRBdmFpbGFibGU7XG5cdH1cblxuXHRfc2V0SW5pdGlhbFN0YXRlQXBwbGllZCgpIHtcblx0XHRpZiAodGhpcy5fcEluaXRpYWxTdGF0ZUFwcGxpZWRSZXNvbHZlKSB7XG5cdFx0XHRjb25zdCBwSW5pdGlhbFN0YXRlQXBwbGllZFJlc29sdmUgPSB0aGlzLl9wSW5pdGlhbFN0YXRlQXBwbGllZFJlc29sdmU7XG5cdFx0XHRkZWxldGUgdGhpcy5fcEluaXRpYWxTdGF0ZUFwcGxpZWRSZXNvbHZlO1xuXHRcdFx0cEluaXRpYWxTdGF0ZUFwcGxpZWRSZXNvbHZlKCk7XG5cdFx0fVxuXHR9XG5cdF9nZXRJbml0aWFsU3RhdGVBcHBsaWVkKCkge1xuXHRcdHJldHVybiAhdGhpcy5fcEluaXRpYWxTdGF0ZUFwcGxpZWRSZXNvbHZlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhvb2sgdG8gcmVhY3QgYmVmb3JlIGEgc3RhdGUgZm9yIGdpdmVuIHZpZXcgaXMgYXBwbGllZC5cblx0ICpcblx0ICogVGhpcyBmdW5jdGlvbiBpcyBtZWFudCB0byBiZSBpbmRpdmlkdWFsbHkgb3ZlcnJpZGRlbiBieSBjb25zdW1pbmcgY29udHJvbGxlcnMsIGJ1dCBub3QgdG8gYmUgY2FsbGVkIGRpcmVjdGx5LlxuXHQgKiBUaGUgb3ZlcnJpZGUgZXhlY3V0aW9uIGlzOiB7QGxpbmsgc2FwLnVpLmNvcmUubXZjLk92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyfS5cblx0ICpcblx0ICogQHBhcmFtIGFQcm9taXNlcyBFeHRlbnNpYmxlIGFycmF5IG9mIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIGJlZm9yZSBjb250aW51aW5nXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5WaWV3U3RhdGUjb25CZWZvcmVTdGF0ZUFwcGxpZWRcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdG9uQmVmb3JlU3RhdGVBcHBsaWVkKGFQcm9taXNlczogUHJvbWlzZTxhbnk+KSB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGVuXG5cdH1cblxuXHQvKipcblx0ICogSG9vayB0byByZWFjdCB3aGVuIHN0YXRlIGZvciBnaXZlbiB2aWV3IHdhcyBhcHBsaWVkLlxuXHQgKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW50IHRvIGJlIGluZGl2aWR1YWxseSBvdmVycmlkZGVuIGJ5IGNvbnN1bWluZyBjb250cm9sbGVycywgYnV0IG5vdCB0byBiZSBjYWxsZWQgZGlyZWN0bHkuXG5cdCAqIFRoZSBvdmVycmlkZSBleGVjdXRpb24gaXM6IHtAbGluayBzYXAudWkuY29yZS5tdmMuT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXJ9LlxuXHQgKlxuXHQgKiBAcGFyYW0gYVByb21pc2VzIEV4dGVuc2libGUgYXJyYXkgb2YgcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgYmVmb3JlIGNvbnRpbnVpbmdcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZSNvbkFmdGVyU3RhdGVBcHBsaWVkXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRvbkFmdGVyU3RhdGVBcHBsaWVkKGFQcm9taXNlczogUHJvbWlzZTxhbnk+KSB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGVuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbHlpbmcgYWRkaXRpb25hbCwgbm90IGNvbnRyb2wgcmVsYXRlZCwgc3RhdGVzIC0gaXMgY2FsbGVkIG9ubHkgaWYgbmF2aWdhdGlvbiB0eXBlIGlzIGlBcHBTdGF0ZS5cblx0ICpcblx0ICogVGhpcyBmdW5jdGlvbiBpcyBtZWFudCB0byBiZSBpbmRpdmlkdWFsbHkgb3ZlcnJpZGRlbiBieSBjb25zdW1pbmcgY29udHJvbGxlcnMsIGJ1dCBub3QgdG8gYmUgY2FsbGVkIGRpcmVjdGx5LlxuXHQgKiBUaGUgb3ZlcnJpZGUgZXhlY3V0aW9uIGlzOiB7QGxpbmsgc2FwLnVpLmNvcmUubXZjLk92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyfS5cblx0ICpcblx0ICogQHBhcmFtIG9WaWV3U3RhdGUgVGhlIGN1cnJlbnQgdmlldyBzdGF0ZVxuXHQgKiBAcGFyYW0gYVByb21pc2VzIEV4dGVuc2libGUgYXJyYXkgb2YgcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgYmVmb3JlIGNvbnRpbnVpbmdcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlZpZXdTdGF0ZSNhcHBseUFkZGl0aW9uYWxTdGF0ZXNcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdGFwcGx5QWRkaXRpb25hbFN0YXRlcyhvVmlld1N0YXRlOiBvYmplY3QsIGFQcm9taXNlczogUHJvbWlzZTxhbnk+KSB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGRlbiBpZiBuZWVkZWRcblx0fVxuXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0X2FwcGx5TmF2aWdhdGlvblBhcmFtZXRlcnNUb0ZpbHRlcmJhcihcblx0XHRfb05hdlBhcmFtZXRlcjoge1xuXHRcdFx0bmF2aWdhdGlvblR5cGU6IGFueTtcblx0XHRcdHNlbGVjdGlvblZhcmlhbnQ/OiBvYmplY3QgfCB1bmRlZmluZWQ7XG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50RGVmYXVsdHM/OiBvYmplY3QgfCB1bmRlZmluZWQ7XG5cdFx0XHRyZXF1aXJlc1N0YW5kYXJkVmFyaWFudD86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdFx0fSxcblx0XHRfYVByb21pc2VzOiBQcm9taXNlPGFueT5cblx0KSB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGRlbiBpZiBuZWVkZWRcblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBseSBuYXZpZ2F0aW9uIHBhcmFtZXRlcnMgaXMgbm90IGNhbGxlZCBpZiB0aGUgbmF2aWdhdGlvbiB0eXBlIGlzIGlBcHBTdGF0ZVxuXHQgKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW50IHRvIGJlIGluZGl2aWR1YWxseSBvdmVycmlkZGVuIGJ5IGNvbnN1bWluZyBjb250cm9sbGVycywgYnV0IG5vdCB0byBiZSBjYWxsZWQgZGlyZWN0bHkuXG5cdCAqIFRoZSBvdmVycmlkZSBleGVjdXRpb24gaXM6IHtAbGluayBzYXAudWkuY29yZS5tdmMuT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXJ9LlxuXHQgKlxuXHQgKiBAcGFyYW0gb05hdlBhcmFtZXRlciBUaGUgY3VycmVudCBuYXZpZ2F0aW9uIHBhcmFtZXRlclxuXHQgKiBAcGFyYW0gb05hdlBhcmFtZXRlci5uYXZpZ2F0aW9uVHlwZSBUaGUgYWN0dWFsIG5hdmlnYXRpb24gdHlwZVxuXHQgKiBAcGFyYW0gW29OYXZQYXJhbWV0ZXIuc2VsZWN0aW9uVmFyaWFudF0gVGhlIHNlbGVjdGlvblZhcmlhbnQgZnJvbSB0aGUgbmF2aWdhdGlvblxuXHQgKiBAcGFyYW0gW29OYXZQYXJhbWV0ZXIuc2VsZWN0aW9uVmFyaWFudERlZmF1bHRzXSBUaGUgc2VsZWN0aW9uVmFyaWFudCBkZWZhdWx0cyBmcm9tIHRoZSBuYXZpZ2F0aW9uXG5cdCAqIEBwYXJhbSBbb05hdlBhcmFtZXRlci5yZXF1aXJlc1N0YW5kYXJkVmFyaWFudF0gRGVmaW5lcyB3aGV0aGVyIHRoZSBzdGFuZGFyZCB2YXJpYW50IG11c3QgYmUgdXNlZCBpbiB2YXJpYW50IG1hbmFnZW1lbnRcblx0ICogQHBhcmFtIGFQcm9taXNlcyBFeHRlbnNpYmxlIGFycmF5IG9mIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIGJlZm9yZSBjb250aW51aW5nXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5WaWV3U3RhdGUjYXBwbHlOYXZpZ2F0aW9uUGFyYW1ldGVyc1xuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdGFwcGx5TmF2aWdhdGlvblBhcmFtZXRlcnMoXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRcdG9OYXZQYXJhbWV0ZXI6IHtcblx0XHRcdG5hdmlnYXRpb25UeXBlOiBhbnk7XG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50Pzogb2JqZWN0IHwgdW5kZWZpbmVkO1xuXHRcdFx0c2VsZWN0aW9uVmFyaWFudERlZmF1bHRzPzogb2JqZWN0IHwgdW5kZWZpbmVkO1xuXHRcdFx0cmVxdWlyZXNTdGFuZGFyZFZhcmlhbnQ/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdH0sXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRcdGFQcm9taXNlczogUHJvbWlzZTxhbnk+XG5cdCkge1xuXHRcdC8vIHRvIGJlIG92ZXJyaWRkZW4gaWYgbmVlZGVkXG5cdH1cblxuXHQvKipcblx0ICogQXBwbHlpbmcgdGhlIGdpdmVuIHN0YXRlIHRvIHRoZSBnaXZlbiBjb250cm9sLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRyb2wgVGhlIG9iamVjdCB0byBhcHBseSB0aGUgZ2l2ZW4gc3RhdGVcblx0ICogQHBhcmFtIG9Db250cm9sU3RhdGUgVGhlIHN0YXRlIGZvciB0aGUgZ2l2ZW4gY29udHJvbFxuXHQgKiBAcGFyYW0gW29OYXZQYXJhbWV0ZXJzXSBUaGUgY3VycmVudCBuYXZpZ2F0aW9uIHBhcmFtZXRlcnNcblx0ICogQHJldHVybnMgUmV0dXJuIGEgcHJvbWlzZSBmb3IgYXN5bmMgc3RhdGUgaGFuZGxpbmdcblx0ICovXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXBwbHlDb250cm9sU3RhdGUob0NvbnRyb2w6IGFueSwgb0NvbnRyb2xTdGF0ZTogb2JqZWN0LCBvTmF2UGFyYW1ldGVycz86IG9iamVjdCkge1xuXHRcdGNvbnN0IGFDb250cm9sU3RhdGVIYW5kbGVycyA9IHRoaXMuZ2V0Q29udHJvbFN0YXRlSGFuZGxlcihvQ29udHJvbCk7XG5cdFx0bGV0IG9Qcm9taXNlQ2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRhQ29udHJvbFN0YXRlSGFuZGxlcnMuZm9yRWFjaCgobUNvbnRyb2xTdGF0ZUhhbmRsZXI6IGFueSkgPT4ge1xuXHRcdFx0aWYgKHR5cGVvZiBtQ29udHJvbFN0YXRlSGFuZGxlci5hcHBseSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgY29udHJvbFN0YXRlSGFuZGxlci5hcHBseSBpcyBub3QgYSBmdW5jdGlvbiBmb3IgY29udHJvbDogJHtvQ29udHJvbC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKX1gKTtcblx0XHRcdH1cblx0XHRcdG9Qcm9taXNlQ2hhaW4gPSBvUHJvbWlzZUNoYWluLnRoZW4obUNvbnRyb2xTdGF0ZUhhbmRsZXIuYXBwbHkuYmluZCh0aGlzLCBvQ29udHJvbCwgb0NvbnRyb2xTdGF0ZSwgb05hdlBhcmFtZXRlcnMpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gb1Byb21pc2VDaGFpbjtcblx0fVxuXHRnZXRJbnRlcmZhY2UoKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlld1N0YXRlO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7RUErakJPLDBCQUEwQkEsSUFBMUIsRUFBZ0NDLFNBQWhDLEVBQTJDO0lBQ2pELElBQUk7TUFDSCxJQUFJQyxNQUFNLEdBQUdGLElBQUksRUFBakI7SUFDQSxDQUZELENBRUUsT0FBT0csQ0FBUCxFQUFVO01BQ1gsT0FBT0YsU0FBUyxDQUFDLElBQUQsRUFBT0UsQ0FBUCxDQUFoQjtJQUNBOztJQUNELElBQUlE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