/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/collaboration/ActivitySync", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/core/controllerextensions/editFlow/sticky", "sap/fe/core/controllerextensions/editFlow/TransactionHelper", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/EditState", "sap/fe/core/library", "sap/m/Button", "sap/m/Dialog", "sap/m/Text", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution"], function (Log, CommonUtils, BusyLocker, ActivitySync, CollaborationCommon, sticky, TransactionHelper, ClassSupport, EditState, FELibrary, Button, Dialog, Text, ControllerExtension, OverrideExecution) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var methodOverride = ClassSupport.methodOverride;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var Activity = CollaborationCommon.Activity;
  var send = ActivitySync.send;

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

  var ProgrammingModel = FELibrary.ProgrammingModel,
      DraftStatus = FELibrary.DraftStatus,
      EditMode = FELibrary.EditMode,
      CreationMode = FELibrary.CreationMode;
  var InternalEditFlow = (_dec = defineUI5Class("sap.fe.core.controllerextensions.InternalEditFlow"), _dec2 = methodOverride(), _dec3 = privateExtension(), _dec4 = extensible(OverrideExecution.After), _dec5 = publicExtension(), _dec6 = finalExtension(), _dec7 = publicExtension(), _dec8 = finalExtension(), _dec9 = publicExtension(), _dec10 = finalExtension(), _dec11 = publicExtension(), _dec12 = finalExtension(), _dec13 = publicExtension(), _dec14 = finalExtension(), _dec15 = publicExtension(), _dec16 = finalExtension(), _dec17 = publicExtension(), _dec18 = finalExtension(), _dec19 = publicExtension(), _dec20 = finalExtension(), _dec21 = publicExtension(), _dec22 = finalExtension(), _dec23 = publicExtension(), _dec24 = finalExtension(), _dec25 = publicExtension(), _dec26 = finalExtension(), _dec27 = publicExtension(), _dec28 = finalExtension(), _dec29 = publicExtension(), _dec30 = finalExtension(), _dec31 = publicExtension(), _dec32 = finalExtension(), _dec33 = publicExtension(), _dec34 = finalExtension(), _dec35 = publicExtension(), _dec36 = finalExtension(), _dec37 = publicExtension(), _dec38 = finalExtension(), _dec39 = publicExtension(), _dec40 = finalExtension(), _dec41 = publicExtension(), _dec42 = finalExtension(), _dec43 = publicExtension(), _dec44 = finalExtension(), _dec45 = publicExtension(), _dec46 = finalExtension(), _dec47 = publicExtension(), _dec48 = finalExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(InternalEditFlow, _ControllerExtension);

    function InternalEditFlow() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = InternalEditFlow.prototype;

    _proto.onInit = function onInit() {
      this._oAppComponent = this.base.getAppComponent();
    }
    /**
     * Override to set the creation mode.
     *
     * @param bCreationMode
     * @memberof sap.fe.core.controllerextensions.InternalEditFlow
     * @alias sap.fe.core.controllerextensions.InternalEditFlow#setCreationMode
     * @since 1.90.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCreationMode = function setCreationMode(bCreationMode) {// to be overridden
    };

    _proto.createMultipleDocuments = function createMultipleDocuments(oListBinding, aData, bCreateAtEnd, bFromCopyPaste, beforeCreateCallBack) {
      var _this = this;

      var bInactive = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      var transactionHelper = this.getTransactionHelper(),
          oLockObject = this.getGlobalUIModel(),
          oResourceBundle = this.getView().getController().oResourceBundle;
      BusyLocker.lock(oLockObject);
      var aFinalContexts = [];
      return this.syncTask().then(function () {
        return beforeCreateCallBack ? beforeCreateCallBack({
          contextPath: oListBinding && oListBinding.getPath()
        }) : Promise.resolve();
      }).then(function () {
        var oModel = oListBinding.getModel(),
            oMetaModel = oModel.getMetaModel();
        var sMetaPath;

        if (oListBinding.getContext()) {
          sMetaPath = oMetaModel.getMetaPath("".concat(oListBinding.getContext().getPath(), "/").concat(oListBinding.getPath()));
        } else {
          sMetaPath = oMetaModel.getMetaPath(oListBinding.getPath());
        }

        _this.handleCreateEvents(oListBinding); // Iterate on all items and store the corresponding creation promise


        var aCreationPromises = aData.map(function (mPropertyValues) {
          var mParameters = {
            data: {}
          };
          mParameters.keepTransientContextOnFailed = false; // currently not fully supported

          mParameters.busyMode = "None";
          mParameters.creationMode = CreationMode.CreationRow;
          mParameters.parentControl = _this.getView();
          mParameters.createAtEnd = bCreateAtEnd;
          mParameters.inactive = bInactive; // Remove navigation properties as we don't support deep create

          for (var sPropertyPath in mPropertyValues) {
            var oProperty = oMetaModel.getObject("".concat(sMetaPath, "/").concat(sPropertyPath));

            if (oProperty && oProperty.$kind !== "NavigationProperty" && mPropertyValues[sPropertyPath]) {
              mParameters.data[sPropertyPath] = mPropertyValues[sPropertyPath];
            }
          }

          return transactionHelper.createDocument(oListBinding, mParameters, oResourceBundle, _this.getMessageHandler(), bFromCopyPaste, _this.getView());
        });
        return Promise.all(aCreationPromises);
      }).then(function (aContexts) {
        // transient contexts are reliably removed once oNewContext.created() is resolved
        aFinalContexts = aContexts;
        return Promise.all(aContexts.map(function (oNewContext) {
          if (!oNewContext.bInactive) {
            return oNewContext.created();
          }
        }));
      }).then(function () {
        var oBindingContext = _this.getView().getBindingContext(); // if there are transient contexts, we must avoid requesting side effects
        // this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
        // if list binding is refreshed, transient contexts might be lost


        if (!CommonUtils.hasTransientContext(oListBinding)) {
          _this._oAppComponent.getSideEffectsService().requestSideEffectsForNavigationProperty(oListBinding.getPath(), oBindingContext);
        }
      }).catch(function (err) {
        Log.error("Error while creating multiple documents.");
        return Promise.reject(err);
      }).finally(function () {
        BusyLocker.unlock(oLockObject);
      }).then(function () {
        return aFinalContexts;
      });
    };

    _proto.deleteMultipleDocuments = function deleteMultipleDocuments(aContexts, mParameters) {
      var _this2 = this;

      var oLockObject = this.getGlobalUIModel();
      var oControl = this.getView().byId(mParameters.controlId);

      if (!oControl) {
        throw new Error("parameter controlId missing or incorrect");
      } else {
        mParameters.parentControl = oControl;
      }

      var oListBinding = oControl.getBinding("items") || oControl.getRowBinding();
      mParameters.bFindActiveContexts = true;
      BusyLocker.lock(oLockObject);
      return this.deleteDocumentTransaction(aContexts, mParameters).then(function () {
        var oResult; // Multiple object deletion is triggered from a list
        // First clear the selection in the table as it's not valid any more

        if (oControl.isA("sap.ui.mdc.Table")) {
          oControl.clearSelection();
        } // Then refresh the list-binding (LR), or require side-effects (OP)


        var oBindingContext = _this2.getView().getBindingContext();

        if (oListBinding.isRoot()) {
          // keep promise chain pending until refresh of listbinding is completed
          oResult = new Promise(function (resolve) {
            oListBinding.attachEventOnce("dataReceived", function () {
              resolve();
            });
          });
          oListBinding.refresh();
        } else if (oBindingContext) {
          // if there are transient contexts, we must avoid requesting side effects
          // this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
          // if list binding is refreshed, transient contexts might be lost
          if (!CommonUtils.hasTransientContext(oListBinding)) {
            _this2._oAppComponent.getSideEffectsService().requestSideEffectsForNavigationProperty(oListBinding.getPath(), oBindingContext);
          }
        } // deleting at least one object should also set the UI to dirty


        EditState.setEditStateDirty();
        send(_this2.getView(), Activity.Delete, aContexts.map(function (context) {
          return context.getPath();
        }));
        return oResult;
      }).catch(function (oError) {
        Log.error("Error while deleting the document(s)", oError);
      }).finally(function () {
        BusyLocker.unlock(oLockObject);
      });
    }
    /**
     * Decides if a document is to be shown in display or edit mode.
     *
     * @function
     * @name _computeEditMode
     * @memberof sap.fe.core.controllerextensions.InternalEditFlow
     * @param {sap.ui.model.odata.v4.Context} oContext The context to be displayed or edited
     * @returns {Promise} Promise resolves once the edit mode is computed
     */
    ;

    _proto.computeEditMode = function computeEditMode(oContext) {
      try {
        var _this4 = this;

        var sCustomAction = _this4.getInternalModel().getProperty("/sCustomAction");

        var sProgrammingModel = _this4.getProgrammingModel(oContext);

        return Promise.resolve(function () {
          if (sProgrammingModel === ProgrammingModel.Draft) {
            return _catch(function () {
              _this4.setDraftStatus(DraftStatus.Clear);

              return Promise.resolve(oContext.requestObject("IsActiveEntity")).then(function (bIsActiveEntity) {
                var _temp = function () {
                  if (bIsActiveEntity === false) {
                    // in case the document is draft set it in edit mode
                    _this4.setEditMode(EditMode.Editable);

                    return Promise.resolve(oContext.requestObject("HasActiveEntity")).then(function (bHasActiveEntity) {
                      _this4.setEditMode(undefined, !bHasActiveEntity);
                    });
                  } else {
                    // active document, stay on display mode
                    _this4.setEditMode(EditMode.Display, false);
                  }
                }();

                if (_temp && _temp.then) return _temp.then(function () {});
              });
            }, function (oError) {
              Log.error("Error while determining the editMode for draft", oError);
              throw oError;
            });
          } else if (sProgrammingModel === ProgrammingModel.Sticky) {
            if (sCustomAction && sCustomAction !== "" && _this4._hasNewActionForSticky(oContext, _this4.getView(), sCustomAction)) {
              _this4.getTransactionHelper()._bCreateMode = true;

              _this4.getTransactionHelper().handleDocumentModifications();

              _this4.setEditMode(EditMode.Editable, true);

              EditState.setEditStateDirty();

              _this4.handleStickyOn(oContext);

              _this4.getInternalModel().setProperty("/sCustomAction", "");
            }
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Sets the edit mode.
     *
     * @param sEditMode
     * @param bCreationMode CreateMode flag to identify the creation mode
     */
    ;

    _proto.setEditMode = function setEditMode(sEditMode, bCreationMode) {
      // at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
      // rely on the global UI model to exist
      var oGlobalModel = this.getGlobalUIModel();

      if (sEditMode) {
        oGlobalModel.setProperty("/isEditable", sEditMode === "Editable", undefined, true);
      }

      if (bCreationMode !== undefined) {
        // Since setCreationMode is public in EditFlow and can be overriden, make sure to call it via the controller
        // to ensure any overrides are taken into account
        this.setCreationMode(bCreationMode);
      }
    };

    _proto.setDraftStatus = function setDraftStatus(sDraftState) {
      // at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
      // rely on the global UI model to exist
      this.base.getView().getModel("ui").setProperty("/draftStatus", sDraftState, undefined, true);
    };

    _proto.getRoutingListener = function getRoutingListener() {
      // at this point of time it's not meant to release the edit flow for FPM custom pages and the routing
      // listener is not yet public therefore keep the logic here for now
      if (this.base._routing) {
        return this.base._routing;
      } else {
        throw new Error("Edit Flow works only with a given routing listener");
      }
    };

    _proto.getGlobalUIModel = function getGlobalUIModel() {
      // at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
      // rely on the global UI model to exist
      return this.base.getView().getModel("ui");
    }
    /**
     * Performs a task in sync with other tasks created via this function.
     * Returns the promise chain of the task.
     *
     * @function
     * @name sap.fe.core.controllerextensions.EditFlow#syncTask
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @static
     * @param [vTask] Optional, a promise or function to be executed synchronously
     * @returns Promise resolves once the task is completed
     * @ui5-restricted
     * @final
     */
    ;

    _proto.syncTask = function syncTask(vTask) {
      var fnNewTask;

      if (vTask instanceof Promise) {
        fnNewTask = function () {
          return vTask;
        };
      } else if (typeof vTask === "function") {
        fnNewTask = vTask;
      }

      this._pTasks = this._pTasks || Promise.resolve();

      if (fnNewTask) {
        this._pTasks = this._pTasks.then(fnNewTask).catch(function () {
          return Promise.resolve();
        });
      }

      return this._pTasks;
    };

    _proto.getProgrammingModel = function getProgrammingModel(oContext) {
      return this.getTransactionHelper().getProgrammingModel(oContext);
    };

    _proto.deleteDocumentTransaction = function deleteDocumentTransaction(oContext, mParameters) {
      var _sap$ui$getCore$byId,
          _this5 = this;

      var oResourceBundle = this.getView().getController().oResourceBundle,
          transactionHelper = this.getTransactionHelper();
      mParameters = mParameters || {}; // TODO: this setting and removing of contexts shouldn't be in the transaction helper at all
      // for the time being I kept it and provide the internal model context to not break something

      mParameters.internalModelContext = mParameters.controlId ? (_sap$ui$getCore$byId = sap.ui.getCore().byId(mParameters.controlId)) === null || _sap$ui$getCore$byId === void 0 ? void 0 : _sap$ui$getCore$byId.getBindingContext("internal") : null;
      return this.syncTask().then(transactionHelper.deleteDocument.bind(transactionHelper, oContext, mParameters, oResourceBundle, this.getMessageHandler())).then(function () {
        var internalModel = _this5.getInternalModel();

        internalModel.setProperty("/sessionOn", false);
        internalModel.setProperty("/stickySessionToken", undefined);
      }).catch(function (oError) {
        return Promise.reject(oError);
      });
    }
    /**
     * Handles the create event: shows messages and in case of a draft, updates the draft indicator.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oBinding OData list binding object
     */
    ;

    _proto.handleCreateEvents = function handleCreateEvents(oBinding) {
      var _this6 = this;

      var transactionHelper = this.getTransactionHelper();
      this.setDraftStatus(DraftStatus.Clear);
      oBinding = oBinding.getBinding && oBinding.getBinding() || oBinding;
      var sProgrammingModel = this.getProgrammingModel(oBinding);
      oBinding.attachEvent("createSent", function () {
        transactionHelper.handleDocumentModifications();

        if (sProgrammingModel === ProgrammingModel.Draft) {
          _this6.setDraftStatus(DraftStatus.Saving);
        }
      });
      oBinding.attachEvent("createCompleted", function (oEvent) {
        var bSuccess = oEvent.getParameter("success");

        if (sProgrammingModel === ProgrammingModel.Draft) {
          _this6.setDraftStatus(bSuccess ? DraftStatus.Saved : DraftStatus.Clear);
        }

        _this6.getMessageHandler().showMessageDialog();
      });
    };

    _proto.getTransactionHelper = function getTransactionHelper() {
      if (!this._oTransactionHelper) {
        // currently also the transaction helper is locking therefore passing lock object
        this._oTransactionHelper = new TransactionHelper(this._oAppComponent, this.getGlobalUIModel());
      }

      return this._oTransactionHelper;
    };

    _proto.getInternalModel = function getInternalModel() {
      return this.base.getView().getModel("internal");
    }
    /**
     * Creates a new promise to wait for an action to be executed
     *
     * @function
     * @name _createActionPromise
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @returns {Function} The resolver function which can be used to externally resolve the promise
     */
    ;

    _proto.createActionPromise = function createActionPromise(sActionName, sControlId) {
      var _this7 = this;

      var fResolver, fRejector;
      this.oActionPromise = new Promise(function (resolve, reject) {
        fResolver = resolve;
        fRejector = reject;
      }).then(function (oResponse) {
        return Object.assign({
          controlId: sControlId
        }, _this7.getActionResponseDataAndKeys(sActionName, oResponse));
      });
      return {
        fResolver: fResolver,
        fRejector: fRejector
      };
    }
    /**
     * Gets the getCurrentActionPromise object.
     *
     * @function
     * @name _getCurrentActionPromise
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @returns Returns the promise
     */
    ;

    _proto.getCurrentActionPromise = function getCurrentActionPromise() {
      return this.oActionPromise;
    };

    _proto.deleteCurrentActionPromise = function deleteCurrentActionPromise() {
      this.oActionPromise = undefined;
    }
    /**
     * @function
     * @name getActionResponseDataAndKeys
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param sActionName The name of the action that is executed
     * @param oResponse The bound action's response data or response context
     * @returns Object with data and names of the key fields of the response
     */
    ;

    _proto.getActionResponseDataAndKeys = function getActionResponseDataAndKeys(sActionName, oResponse) {
      if (Array.isArray(oResponse)) {
        if (oResponse.length === 1) {
          oResponse = oResponse[0].value;
        } else {
          return null;
        }
      }

      if (!oResponse) {
        return null;
      }

      var oView = this.getView(),
          oMetaModel = oView.getModel().getMetaModel().getData(),
          sActionReturnType = oMetaModel && oMetaModel[sActionName] && oMetaModel[sActionName][0] && oMetaModel[sActionName][0].$ReturnType ? oMetaModel[sActionName][0].$ReturnType.$Type : null,
          aKey = sActionReturnType && oMetaModel[sActionReturnType] ? oMetaModel[sActionReturnType].$Key : null;
      return {
        oData: oResponse.getObject(),
        keys: aKey
      };
    };

    _proto.getMessageHandler = function getMessageHandler() {
      // at this point of time it's not meant to release the edit flow for FPM custom pages therefore keep
      // the logic here for now
      if (this.base.messageHandler) {
        return this.base.messageHandler;
      } else {
        throw new Error("Edit Flow works only with a given message handler");
      }
    };

    _proto.handleStickyOn = function handleStickyOn(oContext) {
      var oAppComponent = CommonUtils.getAppComponent(this.getView());

      try {
        if (oAppComponent === undefined || oContext === undefined) {
          throw new Error("undefined AppComponent or Context for function handleStickyOn");
        }

        if (!oAppComponent.getRouterProxy().hasNavigationGuard()) {
          var sHashTracker = oAppComponent.getRouterProxy().getHash(),
              oInternalModel = this.getInternalModel(); // Set a guard in the RouterProxy
          // A timeout is necessary, as with deferred creation the hashChanger is not updated yet with
          // the new hash, and the guard cannot be found in the managed history of the router proxy

          setTimeout(function () {
            oAppComponent.getRouterProxy().setNavigationGuard(oContext.getPath().substring(1));
          }, 0); // Setting back navigation on shell service, to get the dicard message box in case of sticky

          oAppComponent.getShellServices().setBackNavigation(this.onBackNavigationInSession.bind(this));
          this.fnDirtyStateProvider = this._registerDirtyStateProvider(oAppComponent, oInternalModel, sHashTracker);
          oAppComponent.getShellServices().registerDirtyStateProvider(this.fnDirtyStateProvider); // handle session timeout

          var i18nModel = this.getView().getModel("sap.fe.i18n");
          this.fnHandleSessionTimeout = this._attachSessionTimeout(oContext, i18nModel);
          this.getView().getModel().attachSessionTimeout(this.fnHandleSessionTimeout);
          this.fnStickyDiscardAfterNavigation = this._attachRouteMatched(this, oContext, oAppComponent);
          oAppComponent.getRoutingService().attachRouteMatched(this.fnStickyDiscardAfterNavigation);
        }
      } catch (error) {
        Log.info(error);
        return undefined;
      }

      return true;
    };

    _proto.handleStickyOff = function handleStickyOff() {
      var oAppComponent = CommonUtils.getAppComponent(this.getView());

      try {
        if (oAppComponent === undefined) {
          throw new Error("undefined AppComponent for function handleStickyOff");
        }

        if (oAppComponent && oAppComponent.getRouterProxy) {
          // If we have exited from the app, CommonUtils.getAppComponent doesn't return a
          // sap.fe.core.AppComponent, hence the 'if' above
          oAppComponent.getRouterProxy().discardNavigationGuard();
        }

        if (this.fnDirtyStateProvider) {
          oAppComponent.getShellServices().deregisterDirtyStateProvider(this.fnDirtyStateProvider);
          this.fnDirtyStateProvider = undefined;
        }

        if (this.getView().getModel() && this.fnHandleSessionTimeout) {
          this.getView().getModel().detachSessionTimeout(this.fnHandleSessionTimeout);
        }

        oAppComponent.getRoutingService().detachRouteMatched(this.fnStickyDiscardAfterNavigation);
        this.fnStickyDiscardAfterNavigation = undefined;
        this.getTransactionHelper()._bCreateMode = false;
        this.setEditMode(EditMode.Display, false);

        if (oAppComponent) {
          // If we have exited from the app, CommonUtils.getAppComponent doesn't return a
          // sap.fe.core.AppComponent, hence the 'if' above
          oAppComponent.getShellServices().setBackNavigation();
        }
      } catch (error) {
        Log.info(error);
        return undefined;
      }

      return true;
    }
    /**
     * @description Method to display a 'discard' popover when exiting a sticky session.
     * @function
     * @name onBackNavigationInSession
     * @memberof sap.fe.core.controllerextensions.InternalEditFlow
     */
    ;

    _proto.onBackNavigationInSession = function onBackNavigationInSession() {
      var _this8 = this;

      var oView = this.getView(),
          oAppComponent = CommonUtils.getAppComponent(oView),
          oRouterProxy = oAppComponent.getRouterProxy();

      if (oRouterProxy.checkIfBackIsOutOfGuard()) {
        var oBindingContext = oView && oView.getBindingContext();
        sticky.processDataLossConfirmation(function () {
          _this8.discardStickySession(oBindingContext);

          history.back();
        }, oView, this.getProgrammingModel(oBindingContext));
        return;
      }

      history.back();
    };

    _proto.discardStickySession = function discardStickySession(oContext) {
      sticky.discardDocument(oContext);
      this.handleStickyOff();
    };

    _proto._hasNewActionForSticky = function _hasNewActionForSticky(oContext, oView, sCustomAction) {
      try {
        if (oContext === undefined || oView === undefined) {
          throw new Error("Invalid input parameters for function _hasNewActionForSticky");
        }

        var oMetaModel = oView.getModel().getMetaModel(),
            sMetaPath = oContext.getPath().substring(0, oContext.getPath().indexOf("(")),
            oStickySession = oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Session.v1.StickySessionSupported"));

        if (oStickySession && oStickySession.NewAction && oStickySession.NewAction === sCustomAction) {
          return true;
        } else if (oStickySession && oStickySession.AdditionalNewActions) {
          return sCustomAction === oStickySession.AdditionalNewActions.find(function (sAdditionalAction) {
            return sAdditionalAction === sCustomAction;
          }) ? true : false;
        } else {
          return false;
        }
      } catch (error) {
        Log.info(error);
        return undefined;
      }
    };

    _proto._registerDirtyStateProvider = function _registerDirtyStateProvider(oAppComponent, oInternalModel, sHashTracker) {
      return function fnDirtyStateProvider(oNavigationContext) {
        try {
          if (oNavigationContext === undefined) {
            throw new Error("Invalid input parameters for function fnDirtyStateProvider");
          }

          var sTargetHash = oNavigationContext.innerAppRoute,
              oRouterProxy = oAppComponent.getRouterProxy();
          var sLclHashTracker = "";
          var bDirty;
          var bSessionON = oInternalModel.getProperty("/sessionOn");

          if (!bSessionON) {
            // If the sticky session was terminated before hand.
            // Eexample in case of navigating away from application using IBN.
            return undefined;
          }

          if (!oRouterProxy.isNavigationFinalized()) {
            // If navigation is currently happening in RouterProxy, it's a transient state
            // (not dirty)
            bDirty = false;
            sLclHashTracker = sTargetHash;
          } else if (sHashTracker === sTargetHash) {
            // the hash didn't change so either the user attempts to refresh or to leave the app
            bDirty = true;
          } else if (oRouterProxy.checkHashWithGuard(sTargetHash) || oRouterProxy.isGuardCrossAllowedByUser()) {
            // the user attempts to navigate within the root object
            // or crossing the guard has already been allowed by the RouterProxy
            sLclHashTracker = sTargetHash;
            bDirty = false;
          } else {
            // the user attempts to navigate within the app, for example back to the list report
            bDirty = true;
          }

          if (bDirty) {
            // the FLP doesn't call the dirty state provider anymore once it's dirty, as they can't
            // change this due to compatibility reasons we set it back to not-dirty
            setTimeout(function () {
              oAppComponent.getShellServices().setDirtyFlag(false);
            }, 0);
          } else {
            sHashTracker = sLclHashTracker;
          }

          return bDirty;
        } catch (error) {
          Log.info(error);
          return undefined;
        }
      };
    };

    _proto._attachSessionTimeout = function _attachSessionTimeout(oContext, i18nModel) {
      var _this9 = this;

      return function () {
        try {
          if (oContext === undefined) {
            throw new Error("Context missing for function fnHandleSessionTimeout");
          } // remove transient messages since we will showing our own message


          _this9.getMessageHandler().removeTransitionMessages();

          var oDialog = new Dialog({
            title: "{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",
            state: "Warning",
            content: new Text({
              text: "{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}"
            }),
            beginButton: new Button({
              text: "{sap.fe.i18n>C_COMMON_DIALOG_OK}",
              type: "Emphasized",
              press: function () {
                // remove sticky handling after navigation since session has already been terminated
                _this9.handleStickyOff();

                _this9.getRoutingListener().navigateBackFromContext(oContext);
              }
            }),
            afterClose: function () {
              oDialog.destroy();
            }
          });
          oDialog.addStyleClass("sapUiContentPadding");
          oDialog.setModel(i18nModel, "sap.fe.i18n");

          _this9.getView().addDependent(oDialog);

          oDialog.open();
        } catch (error) {
          Log.info(error);
          return undefined;
        }

        return true;
      };
    };

    _proto._attachRouteMatched = function _attachRouteMatched(oFnContext, oContext, oAppComponent) {
      return function fnStickyDiscardAfterNavigation() {
        var sCurrentHash = oAppComponent.getRouterProxy().getHash(); // either current hash is empty so the user left the app or he navigated away from the object

        if (!sCurrentHash || !oAppComponent.getRouterProxy().checkHashWithGuard(sCurrentHash)) {
          oFnContext.discardStickySession(oContext);
        }
      };
    };

    _proto.scrollAndFocusOnInactiveRow = function scrollAndFocusOnInactiveRow(oTable) {
      var oRowBinding = oTable.getRowBinding();
      var iActiveRowIndex = oRowBinding.getCount() || 0;

      if (iActiveRowIndex > 0) {
        oTable.scrollToIndex(iActiveRowIndex - 1);
        oTable.focusRow(iActiveRowIndex, true);
      } else {
        oTable.focusRow(iActiveRowIndex, true);
      }
    };

    return InternalEditFlow;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setCreationMode", [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "setCreationMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createMultipleDocuments", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "createMultipleDocuments"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteMultipleDocuments", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteMultipleDocuments"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "computeEditMode", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "computeEditMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setEditMode", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "setEditMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setDraftStatus", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "setDraftStatus"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getRoutingListener", [_dec15, _dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "getRoutingListener"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getGlobalUIModel", [_dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "getGlobalUIModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "syncTask", [_dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "syncTask"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getProgrammingModel", [_dec21, _dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "getProgrammingModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteDocumentTransaction", [_dec23, _dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteDocumentTransaction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleCreateEvents", [_dec25, _dec26], Object.getOwnPropertyDescriptor(_class2.prototype, "handleCreateEvents"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTransactionHelper", [_dec27, _dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "getTransactionHelper"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getInternalModel", [_dec29, _dec30], Object.getOwnPropertyDescriptor(_class2.prototype, "getInternalModel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createActionPromise", [_dec31, _dec32], Object.getOwnPropertyDescriptor(_class2.prototype, "createActionPromise"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCurrentActionPromise", [_dec33, _dec34], Object.getOwnPropertyDescriptor(_class2.prototype, "getCurrentActionPromise"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteCurrentActionPromise", [_dec35, _dec36], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteCurrentActionPromise"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getActionResponseDataAndKeys", [_dec37, _dec38], Object.getOwnPropertyDescriptor(_class2.prototype, "getActionResponseDataAndKeys"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getMessageHandler", [_dec39, _dec40], Object.getOwnPropertyDescriptor(_class2.prototype, "getMessageHandler"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleStickyOn", [_dec41, _dec42], Object.getOwnPropertyDescriptor(_class2.prototype, "handleStickyOn"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleStickyOff", [_dec43, _dec44], Object.getOwnPropertyDescriptor(_class2.prototype, "handleStickyOff"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBackNavigationInSession", [_dec45, _dec46], Object.getOwnPropertyDescriptor(_class2.prototype, "onBackNavigationInSession"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "discardStickySession", [_dec47, _dec48], Object.getOwnPropertyDescriptor(_class2.prototype, "discardStickySession"), _class2.prototype)), _class2)) || _class);
  return InternalEditFlow;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiUHJvZ3JhbW1pbmdNb2RlbCIsIkZFTGlicmFyeSIsIkRyYWZ0U3RhdHVzIiwiRWRpdE1vZGUiLCJDcmVhdGlvbk1vZGUiLCJJbnRlcm5hbEVkaXRGbG93IiwiZGVmaW5lVUk1Q2xhc3MiLCJtZXRob2RPdmVycmlkZSIsInByaXZhdGVFeHRlbnNpb24iLCJleHRlbnNpYmxlIiwiT3ZlcnJpZGVFeGVjdXRpb24iLCJBZnRlciIsInB1YmxpY0V4dGVuc2lvbiIsImZpbmFsRXh0ZW5zaW9uIiwib25Jbml0IiwiX29BcHBDb21wb25lbnQiLCJiYXNlIiwiZ2V0QXBwQ29tcG9uZW50Iiwic2V0Q3JlYXRpb25Nb2RlIiwiYkNyZWF0aW9uTW9kZSIsImNyZWF0ZU11bHRpcGxlRG9jdW1lbnRzIiwib0xpc3RCaW5kaW5nIiwiYURhdGEiLCJiQ3JlYXRlQXRFbmQiLCJiRnJvbUNvcHlQYXN0ZSIsImJlZm9yZUNyZWF0ZUNhbGxCYWNrIiwiYkluYWN0aXZlIiwidHJhbnNhY3Rpb25IZWxwZXIiLCJnZXRUcmFuc2FjdGlvbkhlbHBlciIsIm9Mb2NrT2JqZWN0IiwiZ2V0R2xvYmFsVUlNb2RlbCIsIm9SZXNvdXJjZUJ1bmRsZSIsImdldFZpZXciLCJnZXRDb250cm9sbGVyIiwiQnVzeUxvY2tlciIsImxvY2siLCJhRmluYWxDb250ZXh0cyIsInN5bmNUYXNrIiwiY29udGV4dFBhdGgiLCJnZXRQYXRoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJvTW9kZWwiLCJnZXRNb2RlbCIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzTWV0YVBhdGgiLCJnZXRDb250ZXh0IiwiZ2V0TWV0YVBhdGgiLCJoYW5kbGVDcmVhdGVFdmVudHMiLCJhQ3JlYXRpb25Qcm9taXNlcyIsIm1hcCIsIm1Qcm9wZXJ0eVZhbHVlcyIsIm1QYXJhbWV0ZXJzIiwiZGF0YSIsImtlZXBUcmFuc2llbnRDb250ZXh0T25GYWlsZWQiLCJidXN5TW9kZSIsImNyZWF0aW9uTW9kZSIsIkNyZWF0aW9uUm93IiwicGFyZW50Q29udHJvbCIsImNyZWF0ZUF0RW5kIiwiaW5hY3RpdmUiLCJzUHJvcGVydHlQYXRoIiwib1Byb3BlcnR5IiwiZ2V0T2JqZWN0IiwiJGtpbmQiLCJjcmVhdGVEb2N1bWVudCIsImdldE1lc3NhZ2VIYW5kbGVyIiwiYWxsIiwiYUNvbnRleHRzIiwib05ld0NvbnRleHQiLCJjcmVhdGVkIiwib0JpbmRpbmdDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJDb21tb25VdGlscyIsImhhc1RyYW5zaWVudENvbnRleHQiLCJnZXRTaWRlRWZmZWN0c1NlcnZpY2UiLCJyZXF1ZXN0U2lkZUVmZmVjdHNGb3JOYXZpZ2F0aW9uUHJvcGVydHkiLCJjYXRjaCIsImVyciIsIkxvZyIsImVycm9yIiwicmVqZWN0IiwiZmluYWxseSIsInVubG9jayIsImRlbGV0ZU11bHRpcGxlRG9jdW1lbnRzIiwib0NvbnRyb2wiLCJieUlkIiwiY29udHJvbElkIiwiRXJyb3IiLCJnZXRCaW5kaW5nIiwiZ2V0Um93QmluZGluZyIsImJGaW5kQWN0aXZlQ29udGV4dHMiLCJkZWxldGVEb2N1bWVudFRyYW5zYWN0aW9uIiwib1Jlc3VsdCIsImlzQSIsImNsZWFyU2VsZWN0aW9uIiwiaXNSb290IiwiYXR0YWNoRXZlbnRPbmNlIiwicmVmcmVzaCIsIkVkaXRTdGF0ZSIsInNldEVkaXRTdGF0ZURpcnR5Iiwic2VuZCIsIkFjdGl2aXR5IiwiRGVsZXRlIiwiY29udGV4dCIsIm9FcnJvciIsImNvbXB1dGVFZGl0TW9kZSIsIm9Db250ZXh0Iiwic0N1c3RvbUFjdGlvbiIsImdldEludGVybmFsTW9kZWwiLCJnZXRQcm9wZXJ0eSIsInNQcm9ncmFtbWluZ01vZGVsIiwiZ2V0UHJvZ3JhbW1pbmdNb2RlbCIsIkRyYWZ0Iiwic2V0RHJhZnRTdGF0dXMiLCJDbGVhciIsInJlcXVlc3RPYmplY3QiLCJiSXNBY3RpdmVFbnRpdHkiLCJzZXRFZGl0TW9kZSIsIkVkaXRhYmxlIiwiYkhhc0FjdGl2ZUVudGl0eSIsInVuZGVmaW5lZCIsIkRpc3BsYXkiLCJTdGlja3kiLCJfaGFzTmV3QWN0aW9uRm9yU3RpY2t5IiwiX2JDcmVhdGVNb2RlIiwiaGFuZGxlRG9jdW1lbnRNb2RpZmljYXRpb25zIiwiaGFuZGxlU3RpY2t5T24iLCJzZXRQcm9wZXJ0eSIsInNFZGl0TW9kZSIsIm9HbG9iYWxNb2RlbCIsInNEcmFmdFN0YXRlIiwiZ2V0Um91dGluZ0xpc3RlbmVyIiwiX3JvdXRpbmciLCJ2VGFzayIsImZuTmV3VGFzayIsIl9wVGFza3MiLCJpbnRlcm5hbE1vZGVsQ29udGV4dCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImRlbGV0ZURvY3VtZW50IiwiYmluZCIsImludGVybmFsTW9kZWwiLCJvQmluZGluZyIsImF0dGFjaEV2ZW50IiwiU2F2aW5nIiwib0V2ZW50IiwiYlN1Y2Nlc3MiLCJnZXRQYXJhbWV0ZXIiLCJTYXZlZCIsInNob3dNZXNzYWdlRGlhbG9nIiwiX29UcmFuc2FjdGlvbkhlbHBlciIsIlRyYW5zYWN0aW9uSGVscGVyIiwiY3JlYXRlQWN0aW9uUHJvbWlzZSIsInNBY3Rpb25OYW1lIiwic0NvbnRyb2xJZCIsImZSZXNvbHZlciIsImZSZWplY3RvciIsIm9BY3Rpb25Qcm9taXNlIiwib1Jlc3BvbnNlIiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0QWN0aW9uUmVzcG9uc2VEYXRhQW5kS2V5cyIsImdldEN1cnJlbnRBY3Rpb25Qcm9taXNlIiwiZGVsZXRlQ3VycmVudEFjdGlvblByb21pc2UiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJ2YWx1ZSIsIm9WaWV3IiwiZ2V0RGF0YSIsInNBY3Rpb25SZXR1cm5UeXBlIiwiJFJldHVyblR5cGUiLCIkVHlwZSIsImFLZXkiLCIkS2V5Iiwib0RhdGEiLCJrZXlzIiwibWVzc2FnZUhhbmRsZXIiLCJvQXBwQ29tcG9uZW50IiwiZ2V0Um91dGVyUHJveHkiLCJoYXNOYXZpZ2F0aW9uR3VhcmQiLCJzSGFzaFRyYWNrZXIiLCJnZXRIYXNoIiwib0ludGVybmFsTW9kZWwiLCJzZXRUaW1lb3V0Iiwic2V0TmF2aWdhdGlvbkd1YXJkIiwic3Vic3RyaW5nIiwiZ2V0U2hlbGxTZXJ2aWNlcyIsInNldEJhY2tOYXZpZ2F0aW9uIiwib25CYWNrTmF2aWdhdGlvbkluU2Vzc2lvbiIsImZuRGlydHlTdGF0ZVByb3ZpZGVyIiwiX3JlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIiwicmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIiLCJpMThuTW9kZWwiLCJmbkhhbmRsZVNlc3Npb25UaW1lb3V0IiwiX2F0dGFjaFNlc3Npb25UaW1lb3V0IiwiYXR0YWNoU2Vzc2lvblRpbWVvdXQiLCJmblN0aWNreURpc2NhcmRBZnRlck5hdmlnYXRpb24iLCJfYXR0YWNoUm91dGVNYXRjaGVkIiwiZ2V0Um91dGluZ1NlcnZpY2UiLCJhdHRhY2hSb3V0ZU1hdGNoZWQiLCJpbmZvIiwiaGFuZGxlU3RpY2t5T2ZmIiwiZGlzY2FyZE5hdmlnYXRpb25HdWFyZCIsImRlcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIiLCJkZXRhY2hTZXNzaW9uVGltZW91dCIsImRldGFjaFJvdXRlTWF0Y2hlZCIsIm9Sb3V0ZXJQcm94eSIsImNoZWNrSWZCYWNrSXNPdXRPZkd1YXJkIiwic3RpY2t5IiwicHJvY2Vzc0RhdGFMb3NzQ29uZmlybWF0aW9uIiwiZGlzY2FyZFN0aWNreVNlc3Npb24iLCJoaXN0b3J5IiwiYmFjayIsImRpc2NhcmREb2N1bWVudCIsImluZGV4T2YiLCJvU3RpY2t5U2Vzc2lvbiIsIk5ld0FjdGlvbiIsIkFkZGl0aW9uYWxOZXdBY3Rpb25zIiwiZmluZCIsInNBZGRpdGlvbmFsQWN0aW9uIiwib05hdmlnYXRpb25Db250ZXh0Iiwic1RhcmdldEhhc2giLCJpbm5lckFwcFJvdXRlIiwic0xjbEhhc2hUcmFja2VyIiwiYkRpcnR5IiwiYlNlc3Npb25PTiIsImlzTmF2aWdhdGlvbkZpbmFsaXplZCIsImNoZWNrSGFzaFdpdGhHdWFyZCIsImlzR3VhcmRDcm9zc0FsbG93ZWRCeVVzZXIiLCJzZXREaXJ0eUZsYWciLCJyZW1vdmVUcmFuc2l0aW9uTWVzc2FnZXMiLCJvRGlhbG9nIiwiRGlhbG9nIiwidGl0bGUiLCJzdGF0ZSIsImNvbnRlbnQiLCJUZXh0IiwidGV4dCIsImJlZ2luQnV0dG9uIiwiQnV0dG9uIiwidHlwZSIsInByZXNzIiwibmF2aWdhdGVCYWNrRnJvbUNvbnRleHQiLCJhZnRlckNsb3NlIiwiZGVzdHJveSIsImFkZFN0eWxlQ2xhc3MiLCJzZXRNb2RlbCIsImFkZERlcGVuZGVudCIsIm9wZW4iLCJvRm5Db250ZXh0Iiwic0N1cnJlbnRIYXNoIiwic2Nyb2xsQW5kRm9jdXNPbkluYWN0aXZlUm93Iiwib1RhYmxlIiwib1Jvd0JpbmRpbmciLCJpQWN0aXZlUm93SW5kZXgiLCJnZXRDb3VudCIsInNjcm9sbFRvSW5kZXgiLCJmb2N1c1JvdyIsIkNvbnRyb2xsZXJFeHRlbnNpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkludGVybmFsRWRpdEZsb3cudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IEJ1c3lMb2NrZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0J1c3lMb2NrZXJcIjtcbmltcG9ydCB7IHNlbmQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvY29sbGFib3JhdGlvbi9BY3Rpdml0eVN5bmNcIjtcbmltcG9ydCB7IEFjdGl2aXR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2NvbGxhYm9yYXRpb24vQ29sbGFib3JhdGlvbkNvbW1vblwiO1xuaW1wb3J0IHN0aWNreSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvZWRpdEZsb3cvc3RpY2t5XCI7XG5pbXBvcnQgVHJhbnNhY3Rpb25IZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L1RyYW5zYWN0aW9uSGVscGVyXCI7XG5pbXBvcnQge1xuXHRkZWZpbmVVSTVDbGFzcyxcblx0ZXh0ZW5zaWJsZSxcblx0ZmluYWxFeHRlbnNpb24sXG5cdG1ldGhvZE92ZXJyaWRlLFxuXHRwcml2YXRlRXh0ZW5zaW9uLFxuXHRwdWJsaWNFeHRlbnNpb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgRWRpdFN0YXRlIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0VkaXRTdGF0ZVwiO1xuaW1wb3J0IEZFTGlicmFyeSBmcm9tIFwic2FwL2ZlL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IHR5cGUgUGFnZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL1BhZ2VDb250cm9sbGVyXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJzYXAvbS9CdXR0b25cIjtcbmltcG9ydCBEaWFsb2cgZnJvbSBcInNhcC9tL0RpYWxvZ1wiO1xuaW1wb3J0IFRleHQgZnJvbSBcInNhcC9tL1RleHRcIjtcbmltcG9ydCBDb250cm9sbGVyRXh0ZW5zaW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvQ29udHJvbGxlckV4dGVuc2lvblwiO1xuaW1wb3J0IE92ZXJyaWRlRXhlY3V0aW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvT3ZlcnJpZGVFeGVjdXRpb25cIjtcbmltcG9ydCB0eXBlIFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL3VpL21kYy9UYWJsZVwiO1xuaW1wb3J0IHR5cGUgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCB0eXBlIE1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvTW9kZWxcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YUxpc3RCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFMaXN0QmluZGluZ1wiO1xuXG5jb25zdCBQcm9ncmFtbWluZ01vZGVsID0gRkVMaWJyYXJ5LlByb2dyYW1taW5nTW9kZWwsXG5cdERyYWZ0U3RhdHVzID0gRkVMaWJyYXJ5LkRyYWZ0U3RhdHVzLFxuXHRFZGl0TW9kZSA9IEZFTGlicmFyeS5FZGl0TW9kZSxcblx0Q3JlYXRpb25Nb2RlID0gRkVMaWJyYXJ5LkNyZWF0aW9uTW9kZTtcblxuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuSW50ZXJuYWxFZGl0Rmxvd1wiKVxuY2xhc3MgSW50ZXJuYWxFZGl0RmxvdyBleHRlbmRzIENvbnRyb2xsZXJFeHRlbnNpb24ge1xuXHRwcm90ZWN0ZWQgYmFzZSE6IFBhZ2VDb250cm9sbGVyO1xuXHRwcml2YXRlIF9vQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRwcml2YXRlIF9wVGFza3M6IGFueTtcblx0cHJpdmF0ZSBvQWN0aW9uUHJvbWlzZT86IFByb21pc2U8YW55Pjtcblx0cHJpdmF0ZSBfb1RyYW5zYWN0aW9uSGVscGVyPzogVHJhbnNhY3Rpb25IZWxwZXI7XG5cdHByaXZhdGUgZm5EaXJ0eVN0YXRlUHJvdmlkZXI/OiBGdW5jdGlvbjtcblx0cHJpdmF0ZSBmbkhhbmRsZVNlc3Npb25UaW1lb3V0PzogRnVuY3Rpb247XG5cdHByaXZhdGUgZm5TdGlja3lEaXNjYXJkQWZ0ZXJOYXZpZ2F0aW9uPzogRnVuY3Rpb247XG5cdEBtZXRob2RPdmVycmlkZSgpXG5cdG9uSW5pdCgpIHtcblx0XHR0aGlzLl9vQXBwQ29tcG9uZW50ID0gdGhpcy5iYXNlLmdldEFwcENvbXBvbmVudCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE92ZXJyaWRlIHRvIHNldCB0aGUgY3JlYXRpb24gbW9kZS5cblx0ICpcblx0ICogQHBhcmFtIGJDcmVhdGlvbk1vZGVcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkludGVybmFsRWRpdEZsb3dcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkludGVybmFsRWRpdEZsb3cjc2V0Q3JlYXRpb25Nb2RlXG5cdCAqIEBzaW5jZSAxLjkwLjBcblx0ICovXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0c2V0Q3JlYXRpb25Nb2RlKGJDcmVhdGlvbk1vZGU6IGJvb2xlYW4pIHtcblx0XHQvLyB0byBiZSBvdmVycmlkZGVuXG5cdH1cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGNyZWF0ZU11bHRpcGxlRG9jdW1lbnRzKFxuXHRcdG9MaXN0QmluZGluZzogYW55LFxuXHRcdGFEYXRhOiBhbnksXG5cdFx0YkNyZWF0ZUF0RW5kOiBhbnksXG5cdFx0YkZyb21Db3B5UGFzdGU6IGJvb2xlYW4sXG5cdFx0YmVmb3JlQ3JlYXRlQ2FsbEJhY2s6IGFueSxcblx0XHRiSW5hY3RpdmUgPSBmYWxzZVxuXHQpIHtcblx0XHRjb25zdCB0cmFuc2FjdGlvbkhlbHBlciA9IHRoaXMuZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKSxcblx0XHRcdG9Mb2NrT2JqZWN0ID0gdGhpcy5nZXRHbG9iYWxVSU1vZGVsKCksXG5cdFx0XHRvUmVzb3VyY2VCdW5kbGUgPSAodGhpcy5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIGFueSkub1Jlc291cmNlQnVuZGxlO1xuXG5cdFx0QnVzeUxvY2tlci5sb2NrKG9Mb2NrT2JqZWN0KTtcblx0XHRsZXQgYUZpbmFsQ29udGV4dHM6IGFueVtdID0gW107XG5cdFx0cmV0dXJuIHRoaXMuc3luY1Rhc2soKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gYmVmb3JlQ3JlYXRlQ2FsbEJhY2tcblx0XHRcdFx0XHQ/IGJlZm9yZUNyZWF0ZUNhbGxCYWNrKHsgY29udGV4dFBhdGg6IG9MaXN0QmluZGluZyAmJiBvTGlzdEJpbmRpbmcuZ2V0UGF0aCgpIH0pXG5cdFx0XHRcdFx0OiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9Nb2RlbCA9IG9MaXN0QmluZGluZy5nZXRNb2RlbCgpLFxuXHRcdFx0XHRcdG9NZXRhTW9kZWwgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0XHRcdGxldCBzTWV0YVBhdGg6IHN0cmluZztcblxuXHRcdFx0XHRpZiAob0xpc3RCaW5kaW5nLmdldENvbnRleHQoKSkge1xuXHRcdFx0XHRcdHNNZXRhUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgoYCR7b0xpc3RCaW5kaW5nLmdldENvbnRleHQoKS5nZXRQYXRoKCl9LyR7b0xpc3RCaW5kaW5nLmdldFBhdGgoKX1gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzTWV0YVBhdGggPSBvTWV0YU1vZGVsLmdldE1ldGFQYXRoKG9MaXN0QmluZGluZy5nZXRQYXRoKCkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5oYW5kbGVDcmVhdGVFdmVudHMob0xpc3RCaW5kaW5nKTtcblxuXHRcdFx0XHQvLyBJdGVyYXRlIG9uIGFsbCBpdGVtcyBhbmQgc3RvcmUgdGhlIGNvcnJlc3BvbmRpbmcgY3JlYXRpb24gcHJvbWlzZVxuXHRcdFx0XHRjb25zdCBhQ3JlYXRpb25Qcm9taXNlcyA9IGFEYXRhLm1hcCgobVByb3BlcnR5VmFsdWVzOiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBtUGFyYW1ldGVyczogYW55ID0geyBkYXRhOiB7fSB9O1xuXG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMua2VlcFRyYW5zaWVudENvbnRleHRPbkZhaWxlZCA9IGZhbHNlOyAvLyBjdXJyZW50bHkgbm90IGZ1bGx5IHN1cHBvcnRlZFxuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmJ1c3lNb2RlID0gXCJOb25lXCI7XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMuY3JlYXRpb25Nb2RlID0gQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93O1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wgPSB0aGlzLmdldFZpZXcoKTtcblx0XHRcdFx0XHRtUGFyYW1ldGVycy5jcmVhdGVBdEVuZCA9IGJDcmVhdGVBdEVuZDtcblx0XHRcdFx0XHRtUGFyYW1ldGVycy5pbmFjdGl2ZSA9IGJJbmFjdGl2ZTtcblxuXHRcdFx0XHRcdC8vIFJlbW92ZSBuYXZpZ2F0aW9uIHByb3BlcnRpZXMgYXMgd2UgZG9uJ3Qgc3VwcG9ydCBkZWVwIGNyZWF0ZVxuXHRcdFx0XHRcdGZvciAoY29uc3Qgc1Byb3BlcnR5UGF0aCBpbiBtUHJvcGVydHlWYWx1ZXMpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9Qcm9wZXJ0eSA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhUGF0aH0vJHtzUHJvcGVydHlQYXRofWApO1xuXHRcdFx0XHRcdFx0aWYgKG9Qcm9wZXJ0eSAmJiBvUHJvcGVydHkuJGtpbmQgIT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgbVByb3BlcnR5VmFsdWVzW3NQcm9wZXJ0eVBhdGhdKSB7XG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmRhdGFbc1Byb3BlcnR5UGF0aF0gPSBtUHJvcGVydHlWYWx1ZXNbc1Byb3BlcnR5UGF0aF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHRyYW5zYWN0aW9uSGVscGVyLmNyZWF0ZURvY3VtZW50KFxuXHRcdFx0XHRcdFx0b0xpc3RCaW5kaW5nLFxuXHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMsXG5cdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHR0aGlzLmdldE1lc3NhZ2VIYW5kbGVyKCksXG5cdFx0XHRcdFx0XHRiRnJvbUNvcHlQYXN0ZSxcblx0XHRcdFx0XHRcdHRoaXMuZ2V0VmlldygpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKGFDcmVhdGlvblByb21pc2VzKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoYUNvbnRleHRzOiBhbnkpIHtcblx0XHRcdFx0Ly8gdHJhbnNpZW50IGNvbnRleHRzIGFyZSByZWxpYWJseSByZW1vdmVkIG9uY2Ugb05ld0NvbnRleHQuY3JlYXRlZCgpIGlzIHJlc29sdmVkXG5cdFx0XHRcdGFGaW5hbENvbnRleHRzID0gYUNvbnRleHRzO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0YUNvbnRleHRzLm1hcChmdW5jdGlvbiAob05ld0NvbnRleHQ6IGFueSkge1xuXHRcdFx0XHRcdFx0aWYgKCFvTmV3Q29udGV4dC5iSW5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG9OZXdDb250ZXh0LmNyZWF0ZWQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Y29uc3Qgb0JpbmRpbmdDb250ZXh0ID0gdGhpcy5nZXRWaWV3KCkuZ2V0QmluZGluZ0NvbnRleHQoKTtcblxuXHRcdFx0XHQvLyBpZiB0aGVyZSBhcmUgdHJhbnNpZW50IGNvbnRleHRzLCB3ZSBtdXN0IGF2b2lkIHJlcXVlc3Rpbmcgc2lkZSBlZmZlY3RzXG5cdFx0XHRcdC8vIHRoaXMgaXMgYXZvaWQgYSBwb3RlbnRpYWwgbGlzdCByZWZyZXNoLCB0aGVyZSBjb3VsZCBiZSBhIHNpZGUgZWZmZWN0IHRoYXQgcmVmcmVzaGVzIHRoZSBsaXN0IGJpbmRpbmdcblx0XHRcdFx0Ly8gaWYgbGlzdCBiaW5kaW5nIGlzIHJlZnJlc2hlZCwgdHJhbnNpZW50IGNvbnRleHRzIG1pZ2h0IGJlIGxvc3Rcblx0XHRcdFx0aWYgKCFDb21tb25VdGlscy5oYXNUcmFuc2llbnRDb250ZXh0KG9MaXN0QmluZGluZykpIHtcblx0XHRcdFx0XHR0aGlzLl9vQXBwQ29tcG9uZW50XG5cdFx0XHRcdFx0XHQuZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlKClcblx0XHRcdFx0XHRcdC5yZXF1ZXN0U2lkZUVmZmVjdHNGb3JOYXZpZ2F0aW9uUHJvcGVydHkob0xpc3RCaW5kaW5nLmdldFBhdGgoKSwgb0JpbmRpbmdDb250ZXh0IGFzIENvbnRleHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnI6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBjcmVhdGluZyBtdWx0aXBsZSBkb2N1bWVudHMuXCIpO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcblx0XHRcdH0pXG5cdFx0XHQuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKG9Mb2NrT2JqZWN0KTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBhRmluYWxDb250ZXh0cztcblx0XHRcdH0pO1xuXHR9XG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRkZWxldGVNdWx0aXBsZURvY3VtZW50cyhhQ29udGV4dHM6IGFueSwgbVBhcmFtZXRlcnM6IGFueSkge1xuXHRcdGNvbnN0IG9Mb2NrT2JqZWN0ID0gdGhpcy5nZXRHbG9iYWxVSU1vZGVsKCk7XG5cdFx0Y29uc3Qgb0NvbnRyb2wgPSB0aGlzLmdldFZpZXcoKS5ieUlkKG1QYXJhbWV0ZXJzLmNvbnRyb2xJZCk7XG5cdFx0aWYgKCFvQ29udHJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIGNvbnRyb2xJZCBtaXNzaW5nIG9yIGluY29ycmVjdFwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bVBhcmFtZXRlcnMucGFyZW50Q29udHJvbCA9IG9Db250cm9sO1xuXHRcdH1cblx0XHRjb25zdCBvTGlzdEJpbmRpbmcgPSBvQ29udHJvbC5nZXRCaW5kaW5nKFwiaXRlbXNcIikgfHwgKChvQ29udHJvbCBhcyBUYWJsZSkuZ2V0Um93QmluZGluZygpIGFzIGFueSk7XG5cdFx0bVBhcmFtZXRlcnMuYkZpbmRBY3RpdmVDb250ZXh0cyA9IHRydWU7XG5cdFx0QnVzeUxvY2tlci5sb2NrKG9Mb2NrT2JqZWN0KTtcblxuXHRcdHJldHVybiB0aGlzLmRlbGV0ZURvY3VtZW50VHJhbnNhY3Rpb24oYUNvbnRleHRzLCBtUGFyYW1ldGVycylcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0bGV0IG9SZXN1bHQ7XG5cblx0XHRcdFx0Ly8gTXVsdGlwbGUgb2JqZWN0IGRlbGV0aW9uIGlzIHRyaWdnZXJlZCBmcm9tIGEgbGlzdFxuXHRcdFx0XHQvLyBGaXJzdCBjbGVhciB0aGUgc2VsZWN0aW9uIGluIHRoZSB0YWJsZSBhcyBpdCdzIG5vdCB2YWxpZCBhbnkgbW9yZVxuXHRcdFx0XHRpZiAob0NvbnRyb2wuaXNBKFwic2FwLnVpLm1kYy5UYWJsZVwiKSkge1xuXHRcdFx0XHRcdChvQ29udHJvbCBhcyBhbnkpLmNsZWFyU2VsZWN0aW9uKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGVuIHJlZnJlc2ggdGhlIGxpc3QtYmluZGluZyAoTFIpLCBvciByZXF1aXJlIHNpZGUtZWZmZWN0cyAoT1ApXG5cdFx0XHRcdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0XHRcdGlmICgob0xpc3RCaW5kaW5nIGFzIGFueSkuaXNSb290KCkpIHtcblx0XHRcdFx0XHQvLyBrZWVwIHByb21pc2UgY2hhaW4gcGVuZGluZyB1bnRpbCByZWZyZXNoIG9mIGxpc3RiaW5kaW5nIGlzIGNvbXBsZXRlZFxuXHRcdFx0XHRcdG9SZXN1bHQgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XHRcdFx0b0xpc3RCaW5kaW5nLmF0dGFjaEV2ZW50T25jZShcImRhdGFSZWNlaXZlZFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9MaXN0QmluZGluZy5yZWZyZXNoKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAob0JpbmRpbmdDb250ZXh0KSB7XG5cdFx0XHRcdFx0Ly8gaWYgdGhlcmUgYXJlIHRyYW5zaWVudCBjb250ZXh0cywgd2UgbXVzdCBhdm9pZCByZXF1ZXN0aW5nIHNpZGUgZWZmZWN0c1xuXHRcdFx0XHRcdC8vIHRoaXMgaXMgYXZvaWQgYSBwb3RlbnRpYWwgbGlzdCByZWZyZXNoLCB0aGVyZSBjb3VsZCBiZSBhIHNpZGUgZWZmZWN0IHRoYXQgcmVmcmVzaGVzIHRoZSBsaXN0IGJpbmRpbmdcblx0XHRcdFx0XHQvLyBpZiBsaXN0IGJpbmRpbmcgaXMgcmVmcmVzaGVkLCB0cmFuc2llbnQgY29udGV4dHMgbWlnaHQgYmUgbG9zdFxuXHRcdFx0XHRcdGlmICghQ29tbW9uVXRpbHMuaGFzVHJhbnNpZW50Q29udGV4dChvTGlzdEJpbmRpbmcpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9vQXBwQ29tcG9uZW50XG5cdFx0XHRcdFx0XHRcdC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKVxuXHRcdFx0XHRcdFx0XHQucmVxdWVzdFNpZGVFZmZlY3RzRm9yTmF2aWdhdGlvblByb3BlcnR5KG9MaXN0QmluZGluZy5nZXRQYXRoKCksIG9CaW5kaW5nQ29udGV4dCBhcyBDb250ZXh0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBkZWxldGluZyBhdCBsZWFzdCBvbmUgb2JqZWN0IHNob3VsZCBhbHNvIHNldCB0aGUgVUkgdG8gZGlydHlcblx0XHRcdFx0RWRpdFN0YXRlLnNldEVkaXRTdGF0ZURpcnR5KCk7XG5cblx0XHRcdFx0c2VuZChcblx0XHRcdFx0XHR0aGlzLmdldFZpZXcoKSxcblx0XHRcdFx0XHRBY3Rpdml0eS5EZWxldGUsXG5cdFx0XHRcdFx0YUNvbnRleHRzLm1hcCgoY29udGV4dDogQ29udGV4dCkgPT4gY29udGV4dC5nZXRQYXRoKCkpXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIG9SZXN1bHQ7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBkZWxldGluZyB0aGUgZG9jdW1lbnQocylcIiwgb0Vycm9yKTtcblx0XHRcdH0pXG5cdFx0XHQuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKG9Mb2NrT2JqZWN0KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY2lkZXMgaWYgYSBkb2N1bWVudCBpcyB0byBiZSBzaG93biBpbiBkaXNwbGF5IG9yIGVkaXQgbW9kZS5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9jb21wdXRlRWRpdE1vZGVcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkludGVybmFsRWRpdEZsb3dcblx0ICogQHBhcmFtIHtzYXAudWkubW9kZWwub2RhdGEudjQuQ29udGV4dH0gb0NvbnRleHQgVGhlIGNvbnRleHQgdG8gYmUgZGlzcGxheWVkIG9yIGVkaXRlZFxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlcyBvbmNlIHRoZSBlZGl0IG1vZGUgaXMgY29tcHV0ZWRcblx0ICovXG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGFzeW5jIGNvbXB1dGVFZGl0TW9kZShvQ29udGV4dDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3Qgc0N1c3RvbUFjdGlvbiA9IHRoaXMuZ2V0SW50ZXJuYWxNb2RlbCgpLmdldFByb3BlcnR5KFwiL3NDdXN0b21BY3Rpb25cIik7XG5cdFx0Y29uc3Qgc1Byb2dyYW1taW5nTW9kZWwgPSB0aGlzLmdldFByb2dyYW1taW5nTW9kZWwob0NvbnRleHQpO1xuXG5cdFx0aWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0KSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0aGlzLnNldERyYWZ0U3RhdHVzKERyYWZ0U3RhdHVzLkNsZWFyKTtcblxuXHRcdFx0XHRjb25zdCBiSXNBY3RpdmVFbnRpdHkgPSBhd2FpdCBvQ29udGV4dC5yZXF1ZXN0T2JqZWN0KFwiSXNBY3RpdmVFbnRpdHlcIik7XG5cdFx0XHRcdGlmIChiSXNBY3RpdmVFbnRpdHkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0Ly8gaW4gY2FzZSB0aGUgZG9jdW1lbnQgaXMgZHJhZnQgc2V0IGl0IGluIGVkaXQgbW9kZVxuXHRcdFx0XHRcdHRoaXMuc2V0RWRpdE1vZGUoRWRpdE1vZGUuRWRpdGFibGUpO1xuXHRcdFx0XHRcdGNvbnN0IGJIYXNBY3RpdmVFbnRpdHkgPSBhd2FpdCBvQ29udGV4dC5yZXF1ZXN0T2JqZWN0KFwiSGFzQWN0aXZlRW50aXR5XCIpO1xuXHRcdFx0XHRcdHRoaXMuc2V0RWRpdE1vZGUodW5kZWZpbmVkLCAhYkhhc0FjdGl2ZUVudGl0eSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gYWN0aXZlIGRvY3VtZW50LCBzdGF5IG9uIGRpc3BsYXkgbW9kZVxuXHRcdFx0XHRcdHRoaXMuc2V0RWRpdE1vZGUoRWRpdE1vZGUuRGlzcGxheSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBkZXRlcm1pbmluZyB0aGUgZWRpdE1vZGUgZm9yIGRyYWZ0XCIsIG9FcnJvcik7XG5cdFx0XHRcdHRocm93IG9FcnJvcjtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLlN0aWNreSkge1xuXHRcdFx0aWYgKHNDdXN0b21BY3Rpb24gJiYgc0N1c3RvbUFjdGlvbiAhPT0gXCJcIiAmJiB0aGlzLl9oYXNOZXdBY3Rpb25Gb3JTdGlja3kob0NvbnRleHQsIHRoaXMuZ2V0VmlldygpLCBzQ3VzdG9tQWN0aW9uKSkge1xuXHRcdFx0XHR0aGlzLmdldFRyYW5zYWN0aW9uSGVscGVyKCkuX2JDcmVhdGVNb2RlID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5nZXRUcmFuc2FjdGlvbkhlbHBlcigpLmhhbmRsZURvY3VtZW50TW9kaWZpY2F0aW9ucygpO1xuXHRcdFx0XHR0aGlzLnNldEVkaXRNb2RlKEVkaXRNb2RlLkVkaXRhYmxlLCB0cnVlKTtcblx0XHRcdFx0RWRpdFN0YXRlLnNldEVkaXRTdGF0ZURpcnR5KCk7XG5cdFx0XHRcdHRoaXMuaGFuZGxlU3RpY2t5T24ob0NvbnRleHQpO1xuXHRcdFx0XHR0aGlzLmdldEludGVybmFsTW9kZWwoKS5zZXRQcm9wZXJ0eShcIi9zQ3VzdG9tQWN0aW9uXCIsIFwiXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBlZGl0IG1vZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSBzRWRpdE1vZGVcblx0ICogQHBhcmFtIGJDcmVhdGlvbk1vZGUgQ3JlYXRlTW9kZSBmbGFnIHRvIGlkZW50aWZ5IHRoZSBjcmVhdGlvbiBtb2RlXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0c2V0RWRpdE1vZGUoc0VkaXRNb2RlPzogc3RyaW5nLCBiQ3JlYXRpb25Nb2RlPzogYm9vbGVhbikge1xuXHRcdC8vIGF0IHRoaXMgcG9pbnQgb2YgdGltZSBpdCdzIG5vdCBtZWFudCB0byByZWxlYXNlIHRoZSBlZGl0IGZsb3cgZm9yIGZyZWVzdHlsZSB1c2FnZSB0aGVyZWZvcmUgd2UgY2FuXG5cdFx0Ly8gcmVseSBvbiB0aGUgZ2xvYmFsIFVJIG1vZGVsIHRvIGV4aXN0XG5cdFx0Y29uc3Qgb0dsb2JhbE1vZGVsID0gdGhpcy5nZXRHbG9iYWxVSU1vZGVsKCk7XG5cblx0XHRpZiAoc0VkaXRNb2RlKSB7XG5cdFx0XHRvR2xvYmFsTW9kZWwuc2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiLCBzRWRpdE1vZGUgPT09IFwiRWRpdGFibGVcIiwgdW5kZWZpbmVkLCB0cnVlKTtcblx0XHR9XG5cblx0XHRpZiAoYkNyZWF0aW9uTW9kZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBTaW5jZSBzZXRDcmVhdGlvbk1vZGUgaXMgcHVibGljIGluIEVkaXRGbG93IGFuZCBjYW4gYmUgb3ZlcnJpZGVuLCBtYWtlIHN1cmUgdG8gY2FsbCBpdCB2aWEgdGhlIGNvbnRyb2xsZXJcblx0XHRcdC8vIHRvIGVuc3VyZSBhbnkgb3ZlcnJpZGVzIGFyZSB0YWtlbiBpbnRvIGFjY291bnRcblx0XHRcdHRoaXMuc2V0Q3JlYXRpb25Nb2RlKGJDcmVhdGlvbk1vZGUpO1xuXHRcdH1cblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRzZXREcmFmdFN0YXR1cyhzRHJhZnRTdGF0ZTogYW55KSB7XG5cdFx0Ly8gYXQgdGhpcyBwb2ludCBvZiB0aW1lIGl0J3Mgbm90IG1lYW50IHRvIHJlbGVhc2UgdGhlIGVkaXQgZmxvdyBmb3IgZnJlZXN0eWxlIHVzYWdlIHRoZXJlZm9yZSB3ZSBjYW5cblx0XHQvLyByZWx5IG9uIHRoZSBnbG9iYWwgVUkgbW9kZWwgdG8gZXhpc3Rcblx0XHQodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRNb2RlbChcInVpXCIpIGFzIEpTT05Nb2RlbCkuc2V0UHJvcGVydHkoXCIvZHJhZnRTdGF0dXNcIiwgc0RyYWZ0U3RhdGUsIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Z2V0Um91dGluZ0xpc3RlbmVyKCkge1xuXHRcdC8vIGF0IHRoaXMgcG9pbnQgb2YgdGltZSBpdCdzIG5vdCBtZWFudCB0byByZWxlYXNlIHRoZSBlZGl0IGZsb3cgZm9yIEZQTSBjdXN0b20gcGFnZXMgYW5kIHRoZSByb3V0aW5nXG5cdFx0Ly8gbGlzdGVuZXIgaXMgbm90IHlldCBwdWJsaWMgdGhlcmVmb3JlIGtlZXAgdGhlIGxvZ2ljIGhlcmUgZm9yIG5vd1xuXG5cdFx0aWYgKHRoaXMuYmFzZS5fcm91dGluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZS5fcm91dGluZztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRWRpdCBGbG93IHdvcmtzIG9ubHkgd2l0aCBhIGdpdmVuIHJvdXRpbmcgbGlzdGVuZXJcIik7XG5cdFx0fVxuXHR9XG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGdldEdsb2JhbFVJTW9kZWwoKTogSlNPTk1vZGVsIHtcblx0XHQvLyBhdCB0aGlzIHBvaW50IG9mIHRpbWUgaXQncyBub3QgbWVhbnQgdG8gcmVsZWFzZSB0aGUgZWRpdCBmbG93IGZvciBmcmVlc3R5bGUgdXNhZ2UgdGhlcmVmb3JlIHdlIGNhblxuXHRcdC8vIHJlbHkgb24gdGhlIGdsb2JhbCBVSSBtb2RlbCB0byBleGlzdFxuXHRcdHJldHVybiB0aGlzLmJhc2UuZ2V0VmlldygpLmdldE1vZGVsKFwidWlcIikgYXMgSlNPTk1vZGVsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBlcmZvcm1zIGEgdGFzayBpbiBzeW5jIHdpdGggb3RoZXIgdGFza3MgY3JlYXRlZCB2aWEgdGhpcyBmdW5jdGlvbi5cblx0ICogUmV0dXJucyB0aGUgcHJvbWlzZSBjaGFpbiBvZiB0aGUgdGFzay5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93I3N5bmNUYXNrXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAc3RhdGljXG5cdCAqIEBwYXJhbSBbdlRhc2tdIE9wdGlvbmFsLCBhIHByb21pc2Ugb3IgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgc3luY2hyb25vdXNseVxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIG9uY2UgdGhlIHRhc2sgaXMgY29tcGxldGVkXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRzeW5jVGFzayh2VGFzaz86IEZ1bmN0aW9uIHwgUHJvbWlzZTxhbnk+KSB7XG5cdFx0bGV0IGZuTmV3VGFzaztcblx0XHRpZiAodlRhc2sgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRmbk5ld1Rhc2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB2VGFzaztcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdlRhc2sgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Zm5OZXdUYXNrID0gdlRhc2s7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcFRhc2tzID0gdGhpcy5fcFRhc2tzIHx8IFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdGlmIChmbk5ld1Rhc2spIHtcblx0XHRcdHRoaXMuX3BUYXNrcyA9IHRoaXMuX3BUYXNrcy50aGVuKGZuTmV3VGFzaykuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fcFRhc2tzO1xuXHR9XG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGdldFByb2dyYW1taW5nTW9kZWwob0NvbnRleHQ/OiBhbnkpOiB0eXBlb2YgUHJvZ3JhbW1pbmdNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKS5nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRkZWxldGVEb2N1bWVudFRyYW5zYWN0aW9uKG9Db250ZXh0OiBhbnksIG1QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSAodGhpcy5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIGFueSkub1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0dHJhbnNhY3Rpb25IZWxwZXIgPSB0aGlzLmdldFRyYW5zYWN0aW9uSGVscGVyKCk7XG5cblx0XHRtUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzIHx8IHt9O1xuXG5cdFx0Ly8gVE9ETzogdGhpcyBzZXR0aW5nIGFuZCByZW1vdmluZyBvZiBjb250ZXh0cyBzaG91bGRuJ3QgYmUgaW4gdGhlIHRyYW5zYWN0aW9uIGhlbHBlciBhdCBhbGxcblx0XHQvLyBmb3IgdGhlIHRpbWUgYmVpbmcgSSBrZXB0IGl0IGFuZCBwcm92aWRlIHRoZSBpbnRlcm5hbCBtb2RlbCBjb250ZXh0IHRvIG5vdCBicmVhayBzb21ldGhpbmdcblx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dCA9IG1QYXJhbWV0ZXJzLmNvbnRyb2xJZFxuXHRcdFx0PyBzYXAudWkuZ2V0Q29yZSgpLmJ5SWQobVBhcmFtZXRlcnMuY29udHJvbElkKT8uZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKVxuXHRcdFx0OiBudWxsO1xuXG5cdFx0cmV0dXJuIHRoaXMuc3luY1Rhc2soKVxuXHRcdFx0LnRoZW4oXG5cdFx0XHRcdHRyYW5zYWN0aW9uSGVscGVyLmRlbGV0ZURvY3VtZW50LmJpbmQodHJhbnNhY3Rpb25IZWxwZXIsIG9Db250ZXh0LCBtUGFyYW1ldGVycywgb1Jlc291cmNlQnVuZGxlLCB0aGlzLmdldE1lc3NhZ2VIYW5kbGVyKCkpXG5cdFx0XHQpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGludGVybmFsTW9kZWwgPSB0aGlzLmdldEludGVybmFsTW9kZWwoKTtcblx0XHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9zZXNzaW9uT25cIiwgZmFsc2UpO1xuXHRcdFx0XHRpbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KFwiL3N0aWNreVNlc3Npb25Ub2tlblwiLCB1bmRlZmluZWQpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHRoZSBjcmVhdGUgZXZlbnQ6IHNob3dzIG1lc3NhZ2VzIGFuZCBpbiBjYXNlIG9mIGEgZHJhZnQsIHVwZGF0ZXMgdGhlIGRyYWZ0IGluZGljYXRvci5cblx0ICpcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEBwYXJhbSBvQmluZGluZyBPRGF0YSBsaXN0IGJpbmRpbmcgb2JqZWN0XG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0aGFuZGxlQ3JlYXRlRXZlbnRzKG9CaW5kaW5nOiBhbnkpIHtcblx0XHRjb25zdCB0cmFuc2FjdGlvbkhlbHBlciA9IHRoaXMuZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKTtcblxuXHRcdHRoaXMuc2V0RHJhZnRTdGF0dXMoRHJhZnRTdGF0dXMuQ2xlYXIpO1xuXG5cdFx0b0JpbmRpbmcgPSAob0JpbmRpbmcuZ2V0QmluZGluZyAmJiBvQmluZGluZy5nZXRCaW5kaW5nKCkpIHx8IG9CaW5kaW5nO1xuXHRcdGNvbnN0IHNQcm9ncmFtbWluZ01vZGVsID0gdGhpcy5nZXRQcm9ncmFtbWluZ01vZGVsKG9CaW5kaW5nKTtcblxuXHRcdG9CaW5kaW5nLmF0dGFjaEV2ZW50KFwiY3JlYXRlU2VudFwiLCAoKSA9PiB7XG5cdFx0XHR0cmFuc2FjdGlvbkhlbHBlci5oYW5kbGVEb2N1bWVudE1vZGlmaWNhdGlvbnMoKTtcblx0XHRcdGlmIChzUHJvZ3JhbW1pbmdNb2RlbCA9PT0gUHJvZ3JhbW1pbmdNb2RlbC5EcmFmdCkge1xuXHRcdFx0XHR0aGlzLnNldERyYWZ0U3RhdHVzKERyYWZ0U3RhdHVzLlNhdmluZyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0b0JpbmRpbmcuYXR0YWNoRXZlbnQoXCJjcmVhdGVDb21wbGV0ZWRcIiwgKG9FdmVudDogYW55KSA9PiB7XG5cdFx0XHRjb25zdCBiU3VjY2VzcyA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJzdWNjZXNzXCIpO1xuXHRcdFx0aWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0KSB7XG5cdFx0XHRcdHRoaXMuc2V0RHJhZnRTdGF0dXMoYlN1Y2Nlc3MgPyBEcmFmdFN0YXR1cy5TYXZlZCA6IERyYWZ0U3RhdHVzLkNsZWFyKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZ2V0TWVzc2FnZUhhbmRsZXIoKS5zaG93TWVzc2FnZURpYWxvZygpO1xuXHRcdH0pO1xuXHR9XG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGdldFRyYW5zYWN0aW9uSGVscGVyKCkge1xuXHRcdGlmICghdGhpcy5fb1RyYW5zYWN0aW9uSGVscGVyKSB7XG5cdFx0XHQvLyBjdXJyZW50bHkgYWxzbyB0aGUgdHJhbnNhY3Rpb24gaGVscGVyIGlzIGxvY2tpbmcgdGhlcmVmb3JlIHBhc3NpbmcgbG9jayBvYmplY3Rcblx0XHRcdHRoaXMuX29UcmFuc2FjdGlvbkhlbHBlciA9IG5ldyBUcmFuc2FjdGlvbkhlbHBlcih0aGlzLl9vQXBwQ29tcG9uZW50LCB0aGlzLmdldEdsb2JhbFVJTW9kZWwoKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX29UcmFuc2FjdGlvbkhlbHBlcjtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRnZXRJbnRlcm5hbE1vZGVsKCk6IEpTT05Nb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKSBhcyBKU09OTW9kZWw7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBwcm9taXNlIHRvIHdhaXQgZm9yIGFuIGFjdGlvbiB0byBiZSBleGVjdXRlZFxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2NyZWF0ZUFjdGlvblByb21pc2Vcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIHJlc29sdmVyIGZ1bmN0aW9uIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGV4dGVybmFsbHkgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuXHQgKi9cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Y3JlYXRlQWN0aW9uUHJvbWlzZShzQWN0aW9uTmFtZTogYW55LCBzQ29udHJvbElkOiBhbnkpIHtcblx0XHRsZXQgZlJlc29sdmVyLCBmUmVqZWN0b3I7XG5cdFx0dGhpcy5vQWN0aW9uUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGZSZXNvbHZlciA9IHJlc29sdmU7XG5cdFx0XHRmUmVqZWN0b3IgPSByZWplY3Q7XG5cdFx0fSkudGhlbigob1Jlc3BvbnNlOiBhbnkpID0+IHtcblx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKHsgY29udHJvbElkOiBzQ29udHJvbElkIH0sIHRoaXMuZ2V0QWN0aW9uUmVzcG9uc2VEYXRhQW5kS2V5cyhzQWN0aW9uTmFtZSwgb1Jlc3BvbnNlKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHsgZlJlc29sdmVyOiBmUmVzb2x2ZXIsIGZSZWplY3RvcjogZlJlamVjdG9yIH07XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZ2V0Q3VycmVudEFjdGlvblByb21pc2Ugb2JqZWN0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2dldEN1cnJlbnRBY3Rpb25Qcm9taXNlXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcmV0dXJucyBSZXR1cm5zIHRoZSBwcm9taXNlXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Z2V0Q3VycmVudEFjdGlvblByb21pc2UoKSB7XG5cdFx0cmV0dXJuIHRoaXMub0FjdGlvblByb21pc2U7XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0ZGVsZXRlQ3VycmVudEFjdGlvblByb21pc2UoKSB7XG5cdFx0dGhpcy5vQWN0aW9uUHJvbWlzZSA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0QWN0aW9uUmVzcG9uc2VEYXRhQW5kS2V5c1xuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3dcblx0ICogQHBhcmFtIHNBY3Rpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gdGhhdCBpcyBleGVjdXRlZFxuXHQgKiBAcGFyYW0gb1Jlc3BvbnNlIFRoZSBib3VuZCBhY3Rpb24ncyByZXNwb25zZSBkYXRhIG9yIHJlc3BvbnNlIGNvbnRleHRcblx0ICogQHJldHVybnMgT2JqZWN0IHdpdGggZGF0YSBhbmQgbmFtZXMgb2YgdGhlIGtleSBmaWVsZHMgb2YgdGhlIHJlc3BvbnNlXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Z2V0QWN0aW9uUmVzcG9uc2VEYXRhQW5kS2V5cyhzQWN0aW9uTmFtZTogc3RyaW5nLCBvUmVzcG9uc2U6IGFueSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9SZXNwb25zZSkpIHtcblx0XHRcdGlmIChvUmVzcG9uc2UubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG9SZXNwb25zZSA9IG9SZXNwb25zZVswXS52YWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIW9SZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCksXG5cdFx0XHRvTWV0YU1vZGVsID0gKG9WaWV3LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkgYXMgYW55KS5nZXREYXRhKCksXG5cdFx0XHRzQWN0aW9uUmV0dXJuVHlwZSA9XG5cdFx0XHRcdG9NZXRhTW9kZWwgJiYgb01ldGFNb2RlbFtzQWN0aW9uTmFtZV0gJiYgb01ldGFNb2RlbFtzQWN0aW9uTmFtZV1bMF0gJiYgb01ldGFNb2RlbFtzQWN0aW9uTmFtZV1bMF0uJFJldHVyblR5cGVcblx0XHRcdFx0XHQ/IG9NZXRhTW9kZWxbc0FjdGlvbk5hbWVdWzBdLiRSZXR1cm5UeXBlLiRUeXBlXG5cdFx0XHRcdFx0OiBudWxsLFxuXHRcdFx0YUtleSA9IHNBY3Rpb25SZXR1cm5UeXBlICYmIG9NZXRhTW9kZWxbc0FjdGlvblJldHVyblR5cGVdID8gb01ldGFNb2RlbFtzQWN0aW9uUmV0dXJuVHlwZV0uJEtleSA6IG51bGw7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0b0RhdGE6IG9SZXNwb25zZS5nZXRPYmplY3QoKSxcblx0XHRcdGtleXM6IGFLZXlcblx0XHR9O1xuXHR9XG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGdldE1lc3NhZ2VIYW5kbGVyKCkge1xuXHRcdC8vIGF0IHRoaXMgcG9pbnQgb2YgdGltZSBpdCdzIG5vdCBtZWFudCB0byByZWxlYXNlIHRoZSBlZGl0IGZsb3cgZm9yIEZQTSBjdXN0b20gcGFnZXMgdGhlcmVmb3JlIGtlZXBcblx0XHQvLyB0aGUgbG9naWMgaGVyZSBmb3Igbm93XG5cblx0XHRpZiAodGhpcy5iYXNlLm1lc3NhZ2VIYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlLm1lc3NhZ2VIYW5kbGVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFZGl0IEZsb3cgd29ya3Mgb25seSB3aXRoIGEgZ2l2ZW4gbWVzc2FnZSBoYW5kbGVyXCIpO1xuXHRcdH1cblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRoYW5kbGVTdGlja3lPbihvQ29udGV4dDogQ29udGV4dCkge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQodGhpcy5nZXRWaWV3KCkpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmIChvQXBwQ29tcG9uZW50ID09PSB1bmRlZmluZWQgfHwgb0NvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ1bmRlZmluZWQgQXBwQ29tcG9uZW50IG9yIENvbnRleHQgZm9yIGZ1bmN0aW9uIGhhbmRsZVN0aWNreU9uXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIW9BcHBDb21wb25lbnQuZ2V0Um91dGVyUHJveHkoKS5oYXNOYXZpZ2F0aW9uR3VhcmQoKSkge1xuXHRcdFx0XHRjb25zdCBzSGFzaFRyYWNrZXIgPSBvQXBwQ29tcG9uZW50LmdldFJvdXRlclByb3h5KCkuZ2V0SGFzaCgpLFxuXHRcdFx0XHRcdG9JbnRlcm5hbE1vZGVsID0gdGhpcy5nZXRJbnRlcm5hbE1vZGVsKCk7XG5cblx0XHRcdFx0Ly8gU2V0IGEgZ3VhcmQgaW4gdGhlIFJvdXRlclByb3h5XG5cdFx0XHRcdC8vIEEgdGltZW91dCBpcyBuZWNlc3NhcnksIGFzIHdpdGggZGVmZXJyZWQgY3JlYXRpb24gdGhlIGhhc2hDaGFuZ2VyIGlzIG5vdCB1cGRhdGVkIHlldCB3aXRoXG5cdFx0XHRcdC8vIHRoZSBuZXcgaGFzaCwgYW5kIHRoZSBndWFyZCBjYW5ub3QgYmUgZm91bmQgaW4gdGhlIG1hbmFnZWQgaGlzdG9yeSBvZiB0aGUgcm91dGVyIHByb3h5XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9BcHBDb21wb25lbnQuZ2V0Um91dGVyUHJveHkoKS5zZXROYXZpZ2F0aW9uR3VhcmQob0NvbnRleHQuZ2V0UGF0aCgpLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdH0sIDApO1xuXG5cdFx0XHRcdC8vIFNldHRpbmcgYmFjayBuYXZpZ2F0aW9uIG9uIHNoZWxsIHNlcnZpY2UsIHRvIGdldCB0aGUgZGljYXJkIG1lc3NhZ2UgYm94IGluIGNhc2Ugb2Ygc3RpY2t5XG5cdFx0XHRcdG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpLnNldEJhY2tOYXZpZ2F0aW9uKHRoaXMub25CYWNrTmF2aWdhdGlvbkluU2Vzc2lvbi5iaW5kKHRoaXMpKTtcblxuXHRcdFx0XHR0aGlzLmZuRGlydHlTdGF0ZVByb3ZpZGVyID0gdGhpcy5fcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIob0FwcENvbXBvbmVudCwgb0ludGVybmFsTW9kZWwsIHNIYXNoVHJhY2tlcik7XG5cdFx0XHRcdG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpLnJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKHRoaXMuZm5EaXJ0eVN0YXRlUHJvdmlkZXIpO1xuXG5cdFx0XHRcdC8vIGhhbmRsZSBzZXNzaW9uIHRpbWVvdXRcblx0XHRcdFx0Y29uc3QgaTE4bk1vZGVsID0gdGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJzYXAuZmUuaTE4blwiKTtcblx0XHRcdFx0dGhpcy5mbkhhbmRsZVNlc3Npb25UaW1lb3V0ID0gdGhpcy5fYXR0YWNoU2Vzc2lvblRpbWVvdXQob0NvbnRleHQsIGkxOG5Nb2RlbCk7XG5cdFx0XHRcdCh0aGlzLmdldFZpZXcoKS5nZXRNb2RlbCgpIGFzIGFueSkuYXR0YWNoU2Vzc2lvblRpbWVvdXQodGhpcy5mbkhhbmRsZVNlc3Npb25UaW1lb3V0KTtcblxuXHRcdFx0XHR0aGlzLmZuU3RpY2t5RGlzY2FyZEFmdGVyTmF2aWdhdGlvbiA9IHRoaXMuX2F0dGFjaFJvdXRlTWF0Y2hlZCh0aGlzLCBvQ29udGV4dCwgb0FwcENvbXBvbmVudCk7XG5cdFx0XHRcdG9BcHBDb21wb25lbnQuZ2V0Um91dGluZ1NlcnZpY2UoKS5hdHRhY2hSb3V0ZU1hdGNoZWQodGhpcy5mblN0aWNreURpc2NhcmRBZnRlck5hdmlnYXRpb24pO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRMb2cuaW5mbyhlcnJvciBhcyBhbnkpO1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0aGFuZGxlU3RpY2t5T2ZmKCkge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQodGhpcy5nZXRWaWV3KCkpO1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAob0FwcENvbXBvbmVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInVuZGVmaW5lZCBBcHBDb21wb25lbnQgZm9yIGZ1bmN0aW9uIGhhbmRsZVN0aWNreU9mZlwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9BcHBDb21wb25lbnQgJiYgb0FwcENvbXBvbmVudC5nZXRSb3V0ZXJQcm94eSkge1xuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGV4aXRlZCBmcm9tIHRoZSBhcHAsIENvbW1vblV0aWxzLmdldEFwcENvbXBvbmVudCBkb2Vzbid0IHJldHVybiBhXG5cdFx0XHRcdC8vIHNhcC5mZS5jb3JlLkFwcENvbXBvbmVudCwgaGVuY2UgdGhlICdpZicgYWJvdmVcblx0XHRcdFx0b0FwcENvbXBvbmVudC5nZXRSb3V0ZXJQcm94eSgpLmRpc2NhcmROYXZpZ2F0aW9uR3VhcmQoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuZm5EaXJ0eVN0YXRlUHJvdmlkZXIpIHtcblx0XHRcdFx0b0FwcENvbXBvbmVudC5nZXRTaGVsbFNlcnZpY2VzKCkuZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcih0aGlzLmZuRGlydHlTdGF0ZVByb3ZpZGVyKTtcblx0XHRcdFx0dGhpcy5mbkRpcnR5U3RhdGVQcm92aWRlciA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKCkgJiYgdGhpcy5mbkhhbmRsZVNlc3Npb25UaW1lb3V0KSB7XG5cdFx0XHRcdCh0aGlzLmdldFZpZXcoKS5nZXRNb2RlbCgpIGFzIGFueSkuZGV0YWNoU2Vzc2lvblRpbWVvdXQodGhpcy5mbkhhbmRsZVNlc3Npb25UaW1lb3V0KTtcblx0XHRcdH1cblxuXHRcdFx0b0FwcENvbXBvbmVudC5nZXRSb3V0aW5nU2VydmljZSgpLmRldGFjaFJvdXRlTWF0Y2hlZCh0aGlzLmZuU3RpY2t5RGlzY2FyZEFmdGVyTmF2aWdhdGlvbik7XG5cdFx0XHR0aGlzLmZuU3RpY2t5RGlzY2FyZEFmdGVyTmF2aWdhdGlvbiA9IHVuZGVmaW5lZDtcblxuXHRcdFx0dGhpcy5nZXRUcmFuc2FjdGlvbkhlbHBlcigpLl9iQ3JlYXRlTW9kZSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRFZGl0TW9kZShFZGl0TW9kZS5EaXNwbGF5LCBmYWxzZSk7XG5cblx0XHRcdGlmIChvQXBwQ29tcG9uZW50KSB7XG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgZXhpdGVkIGZyb20gdGhlIGFwcCwgQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50IGRvZXNuJ3QgcmV0dXJuIGFcblx0XHRcdFx0Ly8gc2FwLmZlLmNvcmUuQXBwQ29tcG9uZW50LCBoZW5jZSB0aGUgJ2lmJyBhYm92ZVxuXHRcdFx0XHRvQXBwQ29tcG9uZW50LmdldFNoZWxsU2VydmljZXMoKS5zZXRCYWNrTmF2aWdhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRMb2cuaW5mbyhlcnJvciBhcyBhbnkpO1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIE1ldGhvZCB0byBkaXNwbGF5IGEgJ2Rpc2NhcmQnIHBvcG92ZXIgd2hlbiBleGl0aW5nIGEgc3RpY2t5IHNlc3Npb24uXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBvbkJhY2tOYXZpZ2F0aW9uSW5TZXNzaW9uXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5JbnRlcm5hbEVkaXRGbG93XG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0b25CYWNrTmF2aWdhdGlvbkluU2Vzc2lvbigpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0b0FwcENvbXBvbmVudCA9IENvbW1vblV0aWxzLmdldEFwcENvbXBvbmVudChvVmlldyksXG5cdFx0XHRvUm91dGVyUHJveHkgPSBvQXBwQ29tcG9uZW50LmdldFJvdXRlclByb3h5KCk7XG5cblx0XHRpZiAob1JvdXRlclByb3h5LmNoZWNrSWZCYWNrSXNPdXRPZkd1YXJkKCkpIHtcblx0XHRcdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9IG9WaWV3ICYmIG9WaWV3LmdldEJpbmRpbmdDb250ZXh0KCk7XG5cblx0XHRcdHN0aWNreS5wcm9jZXNzRGF0YUxvc3NDb25maXJtYXRpb24oXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmRpc2NhcmRTdGlja3lTZXNzaW9uKG9CaW5kaW5nQ29udGV4dCk7XG5cdFx0XHRcdFx0aGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9WaWV3LFxuXHRcdFx0XHR0aGlzLmdldFByb2dyYW1taW5nTW9kZWwob0JpbmRpbmdDb250ZXh0KVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRoaXN0b3J5LmJhY2soKTtcblx0fVxuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRkaXNjYXJkU3RpY2t5U2Vzc2lvbihvQ29udGV4dDogYW55KSB7XG5cdFx0c3RpY2t5LmRpc2NhcmREb2N1bWVudChvQ29udGV4dCk7XG5cdFx0dGhpcy5oYW5kbGVTdGlja3lPZmYoKTtcblx0fVxuXG5cdF9oYXNOZXdBY3Rpb25Gb3JTdGlja3kob0NvbnRleHQ6IGFueSwgb1ZpZXc6IFZpZXcsIHNDdXN0b21BY3Rpb246IHN0cmluZykge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAob0NvbnRleHQgPT09IHVuZGVmaW5lZCB8fCBvVmlldyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5wdXQgcGFyYW1ldGVycyBmb3IgZnVuY3Rpb24gX2hhc05ld0FjdGlvbkZvclN0aWNreVwiKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9WaWV3LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRcdHNNZXRhUGF0aCA9IG9Db250ZXh0LmdldFBhdGgoKS5zdWJzdHJpbmcoMCwgb0NvbnRleHQuZ2V0UGF0aCgpLmluZGV4T2YoXCIoXCIpKSxcblx0XHRcdFx0b1N0aWNreVNlc3Npb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YVBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjEuU3RpY2t5U2Vzc2lvblN1cHBvcnRlZGApO1xuXG5cdFx0XHRpZiAob1N0aWNreVNlc3Npb24gJiYgb1N0aWNreVNlc3Npb24uTmV3QWN0aW9uICYmIG9TdGlja3lTZXNzaW9uLk5ld0FjdGlvbiA9PT0gc0N1c3RvbUFjdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAob1N0aWNreVNlc3Npb24gJiYgb1N0aWNreVNlc3Npb24uQWRkaXRpb25hbE5ld0FjdGlvbnMpIHtcblx0XHRcdFx0cmV0dXJuIHNDdXN0b21BY3Rpb24gPT09XG5cdFx0XHRcdFx0b1N0aWNreVNlc3Npb24uQWRkaXRpb25hbE5ld0FjdGlvbnMuZmluZChmdW5jdGlvbiAoc0FkZGl0aW9uYWxBY3Rpb246IHN0cmluZykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNBZGRpdGlvbmFsQWN0aW9uID09PSBzQ3VzdG9tQWN0aW9uO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0PyB0cnVlXG5cdFx0XHRcdFx0OiBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0TG9nLmluZm8oZXJyb3IgYXMgYW55KTtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cblx0X3JlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKG9BcHBDb21wb25lbnQ6IEFwcENvbXBvbmVudCwgb0ludGVybmFsTW9kZWw6IEpTT05Nb2RlbCwgc0hhc2hUcmFja2VyOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gZm5EaXJ0eVN0YXRlUHJvdmlkZXIob05hdmlnYXRpb25Db250ZXh0OiBhbnkpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChvTmF2aWdhdGlvbkNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5wdXQgcGFyYW1ldGVycyBmb3IgZnVuY3Rpb24gZm5EaXJ0eVN0YXRlUHJvdmlkZXJcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzVGFyZ2V0SGFzaCA9IG9OYXZpZ2F0aW9uQ29udGV4dC5pbm5lckFwcFJvdXRlLFxuXHRcdFx0XHRcdG9Sb3V0ZXJQcm94eSA9IG9BcHBDb21wb25lbnQuZ2V0Um91dGVyUHJveHkoKTtcblx0XHRcdFx0bGV0IHNMY2xIYXNoVHJhY2tlciA9IFwiXCI7XG5cdFx0XHRcdGxldCBiRGlydHk6IGJvb2xlYW47XG5cdFx0XHRcdGNvbnN0IGJTZXNzaW9uT04gPSBvSW50ZXJuYWxNb2RlbC5nZXRQcm9wZXJ0eShcIi9zZXNzaW9uT25cIik7XG5cblx0XHRcdFx0aWYgKCFiU2Vzc2lvbk9OKSB7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHN0aWNreSBzZXNzaW9uIHdhcyB0ZXJtaW5hdGVkIGJlZm9yZSBoYW5kLlxuXHRcdFx0XHRcdC8vIEVleGFtcGxlIGluIGNhc2Ugb2YgbmF2aWdhdGluZyBhd2F5IGZyb20gYXBwbGljYXRpb24gdXNpbmcgSUJOLlxuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIW9Sb3V0ZXJQcm94eS5pc05hdmlnYXRpb25GaW5hbGl6ZWQoKSkge1xuXHRcdFx0XHRcdC8vIElmIG5hdmlnYXRpb24gaXMgY3VycmVudGx5IGhhcHBlbmluZyBpbiBSb3V0ZXJQcm94eSwgaXQncyBhIHRyYW5zaWVudCBzdGF0ZVxuXHRcdFx0XHRcdC8vIChub3QgZGlydHkpXG5cdFx0XHRcdFx0YkRpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0c0xjbEhhc2hUcmFja2VyID0gc1RhcmdldEhhc2g7XG5cdFx0XHRcdH0gZWxzZSBpZiAoc0hhc2hUcmFja2VyID09PSBzVGFyZ2V0SGFzaCkge1xuXHRcdFx0XHRcdC8vIHRoZSBoYXNoIGRpZG4ndCBjaGFuZ2Ugc28gZWl0aGVyIHRoZSB1c2VyIGF0dGVtcHRzIHRvIHJlZnJlc2ggb3IgdG8gbGVhdmUgdGhlIGFwcFxuXHRcdFx0XHRcdGJEaXJ0eSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAob1JvdXRlclByb3h5LmNoZWNrSGFzaFdpdGhHdWFyZChzVGFyZ2V0SGFzaCkgfHwgb1JvdXRlclByb3h5LmlzR3VhcmRDcm9zc0FsbG93ZWRCeVVzZXIoKSkge1xuXHRcdFx0XHRcdC8vIHRoZSB1c2VyIGF0dGVtcHRzIHRvIG5hdmlnYXRlIHdpdGhpbiB0aGUgcm9vdCBvYmplY3Rcblx0XHRcdFx0XHQvLyBvciBjcm9zc2luZyB0aGUgZ3VhcmQgaGFzIGFscmVhZHkgYmVlbiBhbGxvd2VkIGJ5IHRoZSBSb3V0ZXJQcm94eVxuXHRcdFx0XHRcdHNMY2xIYXNoVHJhY2tlciA9IHNUYXJnZXRIYXNoO1xuXHRcdFx0XHRcdGJEaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHRoZSB1c2VyIGF0dGVtcHRzIHRvIG5hdmlnYXRlIHdpdGhpbiB0aGUgYXBwLCBmb3IgZXhhbXBsZSBiYWNrIHRvIHRoZSBsaXN0IHJlcG9ydFxuXHRcdFx0XHRcdGJEaXJ0eSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYkRpcnR5KSB7XG5cdFx0XHRcdFx0Ly8gdGhlIEZMUCBkb2Vzbid0IGNhbGwgdGhlIGRpcnR5IHN0YXRlIHByb3ZpZGVyIGFueW1vcmUgb25jZSBpdCdzIGRpcnR5LCBhcyB0aGV5IGNhbid0XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoaXMgZHVlIHRvIGNvbXBhdGliaWxpdHkgcmVhc29ucyB3ZSBzZXQgaXQgYmFjayB0byBub3QtZGlydHlcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpLnNldERpcnR5RmxhZyhmYWxzZSk7XG5cdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c0hhc2hUcmFja2VyID0gc0xjbEhhc2hUcmFja2VyO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGJEaXJ0eTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdExvZy5pbmZvKGVycm9yIGFzIGFueSk7XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdF9hdHRhY2hTZXNzaW9uVGltZW91dChvQ29udGV4dDogYW55LCBpMThuTW9kZWw6IE1vZGVsKSB7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChvQ29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ29udGV4dCBtaXNzaW5nIGZvciBmdW5jdGlvbiBmbkhhbmRsZVNlc3Npb25UaW1lb3V0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJlbW92ZSB0cmFuc2llbnQgbWVzc2FnZXMgc2luY2Ugd2Ugd2lsbCBzaG93aW5nIG91ciBvd24gbWVzc2FnZVxuXHRcdFx0XHR0aGlzLmdldE1lc3NhZ2VIYW5kbGVyKCkucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cblx0XHRcdFx0Y29uc3Qgb0RpYWxvZyA9IG5ldyBEaWFsb2coe1xuXHRcdFx0XHRcdHRpdGxlOiBcIntzYXAuZmUuaTE4bj5DX0VESVRGTE9XX09CSkVDVF9QQUdFX1NFU1NJT05fRVhQSVJFRF9ESUFMT0dfVElUTEV9XCIsXG5cdFx0XHRcdFx0c3RhdGU6IFwiV2FybmluZ1wiLFxuXHRcdFx0XHRcdGNvbnRlbnQ6IG5ldyBUZXh0KHsgdGV4dDogXCJ7c2FwLmZlLmkxOG4+Q19FRElURkxPV19PQkpFQ1RfUEFHRV9TRVNTSU9OX0VYUElSRURfRElBTE9HX01FU1NBR0V9XCIgfSksXG5cdFx0XHRcdFx0YmVnaW5CdXR0b246IG5ldyBCdXR0b24oe1xuXHRcdFx0XHRcdFx0dGV4dDogXCJ7c2FwLmZlLmkxOG4+Q19DT01NT05fRElBTE9HX09LfVwiLFxuXHRcdFx0XHRcdFx0dHlwZTogXCJFbXBoYXNpemVkXCIsXG5cdFx0XHRcdFx0XHRwcmVzczogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQvLyByZW1vdmUgc3RpY2t5IGhhbmRsaW5nIGFmdGVyIG5hdmlnYXRpb24gc2luY2Ugc2Vzc2lvbiBoYXMgYWxyZWFkeSBiZWVuIHRlcm1pbmF0ZWRcblx0XHRcdFx0XHRcdFx0dGhpcy5oYW5kbGVTdGlja3lPZmYoKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5nZXRSb3V0aW5nTGlzdGVuZXIoKS5uYXZpZ2F0ZUJhY2tGcm9tQ29udGV4dChvQ29udGV4dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0YWZ0ZXJDbG9zZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0b0RpYWxvZy5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0b0RpYWxvZy5hZGRTdHlsZUNsYXNzKFwic2FwVWlDb250ZW50UGFkZGluZ1wiKTtcblx0XHRcdFx0b0RpYWxvZy5zZXRNb2RlbChpMThuTW9kZWwsIFwic2FwLmZlLmkxOG5cIik7XG5cdFx0XHRcdHRoaXMuZ2V0VmlldygpLmFkZERlcGVuZGVudChvRGlhbG9nKTtcblx0XHRcdFx0b0RpYWxvZy5vcGVuKCk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRMb2cuaW5mbyhlcnJvciBhcyBhbnkpO1xuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblx0fVxuXG5cdF9hdHRhY2hSb3V0ZU1hdGNoZWQob0ZuQ29udGV4dDogYW55LCBvQ29udGV4dDogYW55LCBvQXBwQ29tcG9uZW50OiBBcHBDb21wb25lbnQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gZm5TdGlja3lEaXNjYXJkQWZ0ZXJOYXZpZ2F0aW9uKCkge1xuXHRcdFx0Y29uc3Qgc0N1cnJlbnRIYXNoID0gb0FwcENvbXBvbmVudC5nZXRSb3V0ZXJQcm94eSgpLmdldEhhc2goKTtcblx0XHRcdC8vIGVpdGhlciBjdXJyZW50IGhhc2ggaXMgZW1wdHkgc28gdGhlIHVzZXIgbGVmdCB0aGUgYXBwIG9yIGhlIG5hdmlnYXRlZCBhd2F5IGZyb20gdGhlIG9iamVjdFxuXHRcdFx0aWYgKCFzQ3VycmVudEhhc2ggfHwgIW9BcHBDb21wb25lbnQuZ2V0Um91dGVyUHJveHkoKS5jaGVja0hhc2hXaXRoR3VhcmQoc0N1cnJlbnRIYXNoKSkge1xuXHRcdFx0XHRvRm5Db250ZXh0LmRpc2NhcmRTdGlja3lTZXNzaW9uKG9Db250ZXh0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cdHNjcm9sbEFuZEZvY3VzT25JbmFjdGl2ZVJvdyhvVGFibGU6IFRhYmxlKSB7XG5cdFx0Y29uc3Qgb1Jvd0JpbmRpbmcgPSBvVGFibGUuZ2V0Um93QmluZGluZygpIGFzIE9EYXRhTGlzdEJpbmRpbmc7XG5cdFx0Y29uc3QgaUFjdGl2ZVJvd0luZGV4ID0gb1Jvd0JpbmRpbmcuZ2V0Q291bnQoKSB8fCAwO1xuXHRcdGlmIChpQWN0aXZlUm93SW5kZXggPiAwKSB7XG5cdFx0XHRvVGFibGUuc2Nyb2xsVG9JbmRleChpQWN0aXZlUm93SW5kZXggLSAxKTtcblx0XHRcdG9UYWJsZS5mb2N1c1JvdyhpQWN0aXZlUm93SW5kZXgsIHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvVGFibGUuZm9jdXNSb3coaUFjdGl2ZVJvd0luZGV4LCB0cnVlKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW50ZXJuYWxFZGl0RmxvdztcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBa2pCTyxnQkFBZ0JBLElBQWhCLEVBQXNCQyxPQUF0QixFQUErQjtJQUNyQyxJQUFJO01BQ0gsSUFBSUMsTUFBTSxHQUFHRixJQUFJLEVBQWpCO0lBQ0EsQ0FGRCxDQUVFLE9BQU1HLENBQU4sRUFBUztNQUNWLE9BQU9GLE9B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