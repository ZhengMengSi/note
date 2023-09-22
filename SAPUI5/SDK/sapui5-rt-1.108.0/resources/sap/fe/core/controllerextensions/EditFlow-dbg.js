/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/collaboration/ActivitySync", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/core/controllerextensions/editFlow/draft", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/EditState", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/SemanticKeyHelper", "sap/fe/core/library", "sap/fe/templates/Feedback", "sap/ui/core/Core", "sap/ui/core/library", "sap/ui/core/message/Message", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/ui/model/odata/v4/ODataListBinding", "../ActionRuntime"], function (Log, CommonUtils, BusyLocker, ActivitySync, CollaborationCommon, draft, ClassSupport, EditState, ModelHelper, SemanticKeyHelper, FELibrary, Feedback, Core, coreLibrary, Message, ControllerExtension, OverrideExecution, ODataListBinding, ActionRuntime) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _class, _class2;

  var TriggerType = Feedback.TriggerType;
  var triggerConfiguredSurvey = Feedback.triggerConfiguredSurvey;
  var StandardActions = Feedback.StandardActions;
  var publicExtension = ClassSupport.publicExtension;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var shareObject = CollaborationCommon.shareObject;
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

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var CreationMode = FELibrary.CreationMode,
      ProgrammingModel = FELibrary.ProgrammingModel,
      Constants = FELibrary.Constants,
      DraftStatus = FELibrary.DraftStatus,
      EditMode = FELibrary.EditMode,
      StartupMode = FELibrary.StartupMode,
      MessageType = coreLibrary.MessageType;
  /**
   * A controller extension offering hooks into the edit flow of the application
   *
   * @hideconstructor
   * @public
   * @since 1.90.0
   */

  var EditFlow = (_dec = defineUI5Class("sap.fe.core.controllerextensions.EditFlow"), _dec2 = publicExtension(), _dec3 = finalExtension(), _dec4 = publicExtension(), _dec5 = finalExtension(), _dec6 = publicExtension(), _dec7 = finalExtension(), _dec8 = publicExtension(), _dec9 = finalExtension(), _dec10 = publicExtension(), _dec11 = extensible(OverrideExecution.After), _dec12 = publicExtension(), _dec13 = extensible(OverrideExecution.After), _dec14 = publicExtension(), _dec15 = extensible(OverrideExecution.After), _dec16 = publicExtension(), _dec17 = extensible(OverrideExecution.After), _dec18 = publicExtension(), _dec19 = extensible(OverrideExecution.After), _dec20 = publicExtension(), _dec21 = finalExtension(), _dec22 = publicExtension(), _dec23 = finalExtension(), _dec24 = publicExtension(), _dec25 = finalExtension(), _dec26 = publicExtension(), _dec27 = finalExtension(), _dec28 = publicExtension(), _dec29 = finalExtension(), _dec30 = publicExtension(), _dec31 = finalExtension(), _dec32 = publicExtension(), _dec33 = finalExtension(), _dec34 = publicExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(EditFlow, _ControllerExtension);

    function EditFlow() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = EditFlow.prototype;

    //////////////////////////////////////
    // Public methods
    //////////////////////////////////////

    /**
     * Creates a draft document for an existing active document.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oContext Context of the active document
     * @returns Promise resolves once the editable document is available
     * @alias sap.fe.core.controllerextensions.EditFlow#editDocument
     * @public
     * @since 1.90.0
     */
    _proto.editDocument = function editDocument(oContext) {
      try {
        var _this2 = this;

        var bDraftNavigation = true;

        var transactionHelper = _this2._getTransactionHelper();

        var oRootViewController = _this2._getRootViewController();

        var model = oContext.getModel();
        var rightmostContext;

        var _temp8 = _catch(function () {
          return Promise.resolve(_this2.base.editFlow.onBeforeEdit({
            context: oContext
          })).then(function () {
            return Promise.resolve(transactionHelper.editDocument(oContext, _this2.getView(), _this2._getMessageHandler())).then(function (oNewDocumentContext) {
              var sProgrammingModel = _this2._getProgrammingModel(oContext);

              _this2._setStickySessionInternalProperties(sProgrammingModel, model);

              var _temp6 = function () {
                if (oNewDocumentContext) {
                  _this2._setEditMode(EditMode.Editable, false);

                  _this2._getMessageHandler().showMessageDialog();

                  var _temp9 = function () {
                    if (oNewDocumentContext !== oContext) {
                      function _temp10() {
                        return Promise.resolve(_this2._handleNewContext(_contextToNavigate, true, false, bDraftNavigation, true)).then(function () {
                          var _temp2 = function () {
                            if (sProgrammingModel === ProgrammingModel.Sticky) {
                              // The stickyOn handler must be set after the navigation has been done,
                              // as the URL may change in the case of FCL
                              _this2._handleStickyOn(oNewDocumentContext);
                            } else {
                              var _temp12 = function () {
                                if (ModelHelper.isCollaborationDraftSupported(model.getMetaModel())) {
                                  // according to UX in case of enabled collaboration draft we share the object immediately
                                  return Promise.resolve(shareObject(oNewDocumentContext)).then(function () {});
                                }
                              }();

                              if (_temp12 && _temp12.then) return _temp12.then(function () {});
                            }
                          }();

                          if (_temp2 && _temp2.then) return _temp2.then(function () {});
                        });
                      }

                      var _contextToNavigate = oNewDocumentContext;

                      var _temp11 = function () {
                        if (_this2._isFclEnabled()) {
                          rightmostContext = oRootViewController.getRightmostContext();
                          return Promise.resolve(_this2._computeSiblingInformation(oContext, rightmostContext, sProgrammingModel, true)).then(function (siblingInfo) {
                            var _siblingInfo;

                            siblingInfo = (_siblingInfo = siblingInfo) !== null && _siblingInfo !== void 0 ? _siblingInfo : _this2._createSiblingInfo(oContext, oNewDocumentContext);

                            _this2._updatePathsInHistory(siblingInfo.pathMapping);

                            if (siblingInfo.targetContext.getPath() != oNewDocumentContext.getPath()) {
                              _contextToNavigate = siblingInfo.targetContext;
                            }
                          });
                        }
                      }();

                      return _temp11 && _temp11.then ? _temp11.then(_temp10) : _temp10(_temp11);
                    }
                  }();

                  if (_temp9 && _temp9.then) return _temp9.then(function () {});
                }
              }();

              if (_temp6 && _temp6.then) return _temp6.then(function () {});
            });
          });
        }, function (oError) {
          Log.error("Error while editing the document", oError);
        });

        return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.deleteMultipleDocuments = function deleteMultipleDocuments(aContexts, mParameters) {
      if (mParameters) {
        mParameters.beforeDeleteCallBack = this.base.editFlow.onBeforeDelete;
      } else {
        mParameters = {
          beforeDeleteCallBack: this.base.editFlow.onBeforeDelete
        };
      }

      return this.base.getView().getController()._editFlow.deleteMultipleDocuments(aContexts, mParameters);
    }
    /**
     * Updates the draft status and displays the error messages if there are errors during an update.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oContext Context of the updated field
     * @param oPromise Promise to determine when the update operation is completed. The promise should be resolved when the update operation is completed, so the draft status can be updated.
     * @returns Promise resolves once draft status has been updated
     * @alias sap.fe.core.controllerextensions.EditFlow#updateDocument
     * @public
     * @since 1.90.0
     */
    ;

    _proto.updateDocument = function updateDocument(oContext, oPromise) {
      var _this3 = this;

      var transactionHelper = this._getTransactionHelper();

      var originalBindingContext = this.getView().getBindingContext();
      var bIsDraft = this._getProgrammingModel(oContext) === ProgrammingModel.Draft;

      this._getMessageHandler().removeTransitionMessages();

      return this._syncTask(function () {
        try {
          if (originalBindingContext) {
            transactionHelper.handleDocumentModifications();

            if (!_this3._isFclEnabled()) {
              EditState.setEditStateDirty();
            }

            if (bIsDraft) {
              _this3._setDraftStatus(DraftStatus.Saving);
            }
          }

          var _temp17 = _finallyRethrows(function () {
            return _catch(function () {
              return Promise.resolve(oPromise).then(function () {
                // If a navigation happened while oPromise was being resolved, the binding context of the page changed
                // In that case, we shouldn't do anything
                var oBindingContext = _this3.getView().getBindingContext();

                var _temp15 = function () {
                  if (bIsDraft && oBindingContext && oBindingContext === originalBindingContext) {
                    var oMetaModel = oBindingContext.getModel().getMetaModel(),
                        sEntitySetName = oMetaModel.getMetaContext(oBindingContext.getPath()).getObject("@sapui.name"),
                        aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sEntitySetName);

                    var _temp18 = function () {
                      if (aSemanticKeys && aSemanticKeys.length) {
                        var oCurrentSemanticMapping = _this3._getSemanticMapping(),
                            sCurrentSemanticPath = oCurrentSemanticMapping && oCurrentSemanticMapping.semanticPath,
                            sChangedPath = SemanticKeyHelper.getSemanticPath(oBindingContext, true); // sCurrentSemanticPath could be null if we have navigated via deep link then there are no semanticMappings to calculate it from


                        var _temp19 = function () {
                          if (sCurrentSemanticPath && sCurrentSemanticPath !== sChangedPath) {
                            return Promise.resolve(_this3._handleNewContext(oBindingContext, true, false, true)).then(function () {
                              _this3._setDraftStatus(DraftStatus.Saved);
                            });
                          } else {
                            _this3._setDraftStatus(DraftStatus.Saved);
                          }
                        }();

                        if (_temp19 && _temp19.then) return _temp19.then(function () {});
                      } else {
                        _this3._setDraftStatus(DraftStatus.Saved);
                      }
                    }();

                    if (_temp18 && _temp18.then) return _temp18.then(function () {});
                  }
                }();

                if (_temp15 && _temp15.then) return _temp15.then(function () {});
              });
            }, function (oError) {
              Log.error("Error while updating the document", oError);

              if (bIsDraft && originalBindingContext) {
                _this3._setDraftStatus(DraftStatus.Clear);
              }
            });
          }, function (_wasThrown, _result) {
            return Promise.resolve(_this3._getMessageHandler().showMessages()).then(function () {
              if (_wasThrown) throw _result;
              return _result;
            });
          });

          return Promise.resolve(_temp17 && _temp17.then ? _temp17.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      });
    } // Internal only params ---
    // * @param {string} mParameters.creationMode The creation mode using one of the following:
    // *                    Sync - the creation is triggered and once the document is created, the navigation is done
    // *                    Async - the creation and the navigation to the instance are done in parallel
    // *                    Deferred - the creation is done on the target page
    // *                    CreationRow - The creation is done inline async so the user is not blocked
    // mParameters.creationRow Instance of the creation row - (TODO: get rid but use list bindings only)
    // eslint-disable-next-line jsdoc/require-param

    /**
     * Creates a new document.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param vListBinding  ODataListBinding object or the binding path for a temporary list binding
     * @param mInParameters Contains the following attributes:
     * @param mInParameters.creationMode The creation mode using one of the following:
     *                    NewPage - the created document is shown in a new page, depending on whether metadata 'Sync', 'Async' or 'Deferred' is used
     *                    Inline - The creation is done inline (in a table)
     *                    External - The creation is done in a different application specified via the parameter 'outbound'
     * @param mInParameters.outbound The navigation target where the document is created in case of creationMode 'External'
     * @param mInParameters.createAtEnd Specifies if the new entry should be created at the top or bottom of a table in case of creationMode 'Inline'
     * @returns Promise resolves once the object has been created
     * @alias sap.fe.core.controllerextensions.EditFlow#createDocument
     * @public
     * @since 1.90.0
     */
    ;

    _proto.createDocument = function createDocument(vListBinding, mInParameters) {
      try {
        var _exit2 = false;

        var _this5 = this;

        function _temp35(_result2) {
          if (_exit2) return _result2;

          if (mParameters.creationMode === CreationMode.CreationRow && mParameters.creationRow) {
            var oCreationRowObjects = mParameters.creationRow.getBindingContext().getObject();
            delete oCreationRowObjects["@$ui5.context.isTransient"];
            oTable = mParameters.creationRow.getParent();
            oExecCustomValidation = transactionHelper.validateDocument(oTable.getBindingContext(), {
              data: oCreationRowObjects,
              customValidationFunction: oTable.getCreationRow().data("customValidationFunction")
            }, _this5.base.getView()); // disableAddRowButtonForEmptyData is set to false in manifest converter (Table.ts) if customValidationFunction exists

            if (oTable.getCreationRow().data("disableAddRowButtonForEmptyData") === "true") {
              var oInternalModelContext = oTable.getBindingContext("internal");
              oInternalModelContext.setProperty("creationRowFieldValidity", {});
            }
          }

          if (mParameters.creationMode === CreationMode.Inline && mParameters.tableId) {
            oTable = _this5.getView().byId(mParameters.tableId);
          }

          if (oTable && oTable.isA("sap.ui.mdc.Table")) {
            var fnFocusOrScroll = mParameters.creationMode === CreationMode.Inline ? oTable.focusRow.bind(oTable) : oTable.scrollToIndex.bind(oTable);
            oTable.getRowBinding().attachEventOnce("change", function () {
              fnFocusOrScroll(mParameters.createAtEnd ? oTable.getRowBinding().getLength() : 0, true);
            });
          }

          var handleSideEffects = function (oListBinding, oCreationPromise) {
            try {
              var _temp30 = _catch(function () {
                return Promise.resolve(oCreationPromise).then(function (oNewContext) {
                  // transient contexts are reliably removed once oNewContext.created() is resolved
                  return Promise.resolve(oNewContext.created()).then(function () {
                    var oBindingContext = _this5.getView().getBindingContext(); // if there are transient contexts, we must avoid requesting side effects
                    // this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
                    // if list binding is refreshed, transient contexts might be lost


                    if (!CommonUtils.hasTransientContext(oListBinding)) {
                      var appComponent = CommonUtils.getAppComponent(_this5.getView());
                      appComponent.getSideEffectsService().requestSideEffectsForNavigationProperty(oListBinding.getPath(), oBindingContext);
                    }
                  });
                });
              }, function (oError) {
                Log.error("Error while creating the document", oError);
              });

              return Promise.resolve(_temp30 && _temp30.then ? _temp30.then(function () {}) : void 0);
            } catch (e) {
              return Promise.reject(e);
            }
          };
          /**
           * @param aValidationMessages Error messages from custom validation function
           */


          var createCustomValidationMessages = function (aValidationMessages) {
            var _oTable$getBindingCon;

            var sCustomValidationFunction = oTable && oTable.getCreationRow().data("customValidationFunction");
            var mCustomValidity = oTable && ((_oTable$getBindingCon = oTable.getBindingContext("internal")) === null || _oTable$getBindingCon === void 0 ? void 0 : _oTable$getBindingCon.getProperty("creationRowCustomValidity"));
            var oMessageManager = Core.getMessageManager();
            var aCustomMessages = [];
            var oFieldControl;
            var sTarget; // Remove existing CustomValidation message

            oMessageManager.getMessageModel().getData().forEach(function (oMessage) {
              if (oMessage.code === sCustomValidationFunction) {
                oMessageManager.removeMessages(oMessage);
              }
            });
            aValidationMessages.forEach(function (oValidationMessage) {
              // Handle Bound CustomValidation message
              if (oValidationMessage.messageTarget) {
                var _oFieldControl$getBin;

                oFieldControl = Core.getControl(mCustomValidity[oValidationMessage.messageTarget].fieldId);
                sTarget = "".concat((_oFieldControl$getBin = oFieldControl.getBindingContext()) === null || _oFieldControl$getBin === void 0 ? void 0 : _oFieldControl$getBin.getPath(), "/").concat(oFieldControl.getBindingPath("value")); // Add validation message if still not exists

                if (oMessageManager.getMessageModel().getData().filter(function (oMessage) {
                  return oMessage.target === sTarget;
                }).length === 0) {
                  oMessageManager.addMessages(new Message({
                    message: oValidationMessage.messageText,
                    processor: _this5.getView().getModel(),
                    type: MessageType.Error,
                    code: sCustomValidationFunction,
                    technical: false,
                    persistent: false,
                    target: sTarget
                  }));
                } // Add controlId in order to get the focus handling of the error popover runable


                var aExistingValidationMessages = oMessageManager.getMessageModel().getData().filter(function (oMessage) {
                  return oMessage.target === sTarget;
                });
                aExistingValidationMessages[0].addControlId(mCustomValidity[oValidationMessage.messageTarget].fieldId); // Handle Unbound CustomValidation message
              } else {
                aCustomMessages.push({
                  code: sCustomValidationFunction,
                  text: oValidationMessage.messageText,
                  persistent: true,
                  type: MessageType.Error
                });
              }
            });

            if (aCustomMessages.length > 0) {
              _this5._getMessageHandler().showMessageDialog({
                customMessages: aCustomMessages
              });
            }
          };

          var resolveCreationMode = function (initialCreationMode, programmingModel, oListBinding, oMetaModel) {
            if (initialCreationMode && initialCreationMode !== CreationMode.NewPage) {
              // use the passed creation mode
              return initialCreationMode;
            } else {
              // NewAction is not yet supported for NavigationProperty collection
              if (!oListBinding.isRelative()) {
                var sPath = oListBinding.getPath(),
                    // if NewAction with parameters is present, then creation is 'Deferred'
                // in the absence of NewAction or NewAction with parameters, creation is async
                sNewAction = programmingModel === ProgrammingModel.Draft ? oMetaModel.getObject("".concat(sPath, "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")) : oMetaModel.getObject("".concat(sPath, "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction"));

                if (sNewAction) {
                  var aParameters = oMetaModel.getObject("/".concat(sNewAction, "/@$ui5.overload/0/$Parameter")) || []; // binding parameter (eg: _it) is not considered

                  if (aParameters.length > 1) {
                    return CreationMode.Deferred;
                  }
                }
              }

              var sMetaPath = oMetaModel.getMetaPath(oListBinding.getHeaderContext().getPath());
              var aNonComputedVisibleKeyFields = CommonUtils.getNonComputedVisibleFields(oMetaModel, sMetaPath, _this5.getView());

              if (aNonComputedVisibleKeyFields.length > 0) {
                return CreationMode.Deferred;
              }

              return CreationMode.Async;
            }
          };

          if (bShouldBusyLock) {
            BusyLocker.lock(oLockObject);
          }

          return _finallyRethrows(function () {
            return Promise.resolve(_this5._syncTask(oExecCustomValidation)).then(function (aValidationMessages) {
              function _temp26() {
                var oNavigation;

                switch (resolvedCreationMode) {
                  case CreationMode.Deferred:
                    oNavigation = oRoutingListener.navigateForwardToContext(oListBinding, {
                      bDeferredContext: true,
                      editable: true,
                      bForceFocus: true
                    });
                    break;

                  case CreationMode.Async:
                    oNavigation = oRoutingListener.navigateForwardToContext(oListBinding, {
                      asyncContext: oCreation,
                      editable: true,
                      bForceFocus: true
                    });
                    break;

                  case CreationMode.Sync:
                    mArgs = {
                      editable: true,
                      bForceFocus: true
                    };

                    if (sProgrammingModel == ProgrammingModel.Sticky || mParameters.createAction) {
                      mArgs.transient = true;
                    }

                    oNavigation = oCreation.then(function (oNewDocumentContext) {
                      if (!oNewDocumentContext) {
                        var coreResourceBundle = Core.getLibraryResourceBundle("sap.fe.core");
                        return oRoutingListener.navigateToMessagePage(coreResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"), {
                          title: coreResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
                          description: coreResourceBundle.getText("C_EDITFLOW_SAPFE_CREATION_FAILED_DESCRIPTION")
                        });
                      } else {
                        // In case the Sync creation was triggered for a deferred creation, we don't navigate forward
                        // as we're already on the corresponding ObjectPage
                        return mParameters.bFromDeferred ? oRoutingListener.navigateToContext(oNewDocumentContext, mArgs) : oRoutingListener.navigateForwardToContext(oNewDocumentContext, mArgs);
                      }
                    });
                    break;

                  case CreationMode.Inline:
                    handleSideEffects(oListBinding, oCreation);

                    _this5._syncTask(oCreation);

                    break;

                  case CreationMode.CreationRow:
                    // the creation row shall be cleared once the validation check was successful and
                    // therefore the POST can be sent async to the backend
                    try {
                      var oCreationRowListBinding = oCreationRowContext.getBinding();

                      if (!mParameters.bSkipSideEffects) {
                        handleSideEffects(oListBinding, oCreation);
                      }

                      var oNewTransientContext = oCreationRowListBinding.create();
                      oCreationRow.setBindingContext(oNewTransientContext); // this is needed to avoid console errors TO be checked with model colleagues

                      oNewTransientContext.created().catch(function () {
                        Log.trace("transient fast creation context deleted");
                      });
                      oNavigation = oCreationRowContext.delete("$direct");
                    } catch (oError) {
                      // Reset busy indicator after a validation error
                      if (BusyLocker.isLocked(_this5.getView().getModel("ui"))) {
                        BusyLocker.unlock(_this5.getView().getModel("ui"));
                      }

                      Log.error("CreationRow navigation error: ", oError);
                    }

                    break;

                  default:
                    oNavigation = Promise.reject("Unhandled creationMode ".concat(resolvedCreationMode));
                    break;
                }

                var bIsNewPageCreation = mParameters.creationMode !== CreationMode.CreationRow && mParameters.creationMode !== CreationMode.Inline;
                return function () {
                  if (oCreation) {
                    return _catch(function () {
                      return Promise.resolve(Promise.all([oCreation, oNavigation])).then(function (aParams) {
                        _this5._setStickySessionInternalProperties(sProgrammingModel, oModel);

                        if (bIsNewPageCreation) {
                          _this5._setEditMode(EditMode.Editable, bIsNewPageCreation);
                        } else {
                          _this5._setEditMode(EditMode.Editable);
                        }

                        var oNewDocumentContext = aParams[0];

                        var _temp24 = function () {
                          if (oNewDocumentContext) {
                            if (!_this5._isFclEnabled()) {
                              EditState.setEditStateDirty();
                            }

                            _this5._sendActivity(Activity.Create, oNewDocumentContext);

                            var _temp31 = function () {
                              if (sProgrammingModel === ProgrammingModel.Sticky) {
                                _this5._handleStickyOn(oNewDocumentContext);
                              } else {
                                var _temp32 = function () {
                                  if (ModelHelper.isCollaborationDraftSupported(oModel.getMetaModel())) {
                                    // according to UX in case of enabled collaboration draft we share the object immediately
                                    return Promise.resolve(shareObject(oNewDocumentContext)).then(function () {});
                                  }
                                }();

                                if (_temp32 && _temp32.then) return _temp32.then(function () {});
                              }
                            }();

                            if (_temp31 && _temp31.then) return _temp31.then(function () {});
                          }
                        }();

                        if (_temp24 && _temp24.then) return _temp24.then(function () {});
                      });
                    }, function (error) {
                      // TODO: currently, the only errors handled here are raised as string - should be changed to Error objects
                      if (error === Constants.CancelActionDialog || error === Constants.ActionExecutionFailed || error === Constants.CreationFailed) {
                        // creation has been cancelled by user or failed in backend => in case we have navigated to transient context before, navigate back
                        // the switch-statement above seems to indicate that this happens in creationModes deferred and async. But in fact, in these cases after the navigation from routeMatched in OP component
                        // createDeferredContext is triggerd, which calls this method (createDocument) again - this time with creationMode sync. Therefore, also in that mode we need to trigger back navigation.
                        // The other cases might still be needed in case the navigation fails.
                        if (resolvedCreationMode === CreationMode.Sync || resolvedCreationMode === CreationMode.Deferred || resolvedCreationMode === CreationMode.Async) {
                          oRoutingListener.navigateBackFromTransientState();
                        }
                      }

                      throw error;
                    });
                  }
                }();
              }

              if (aValidationMessages.length > 0) {
                createCustomValidationMessages(aValidationMessages);
                Log.error("Custom Validation failed"); // if custom validation fails, we leave the method immediately

                return;
              }

              var oListBinding;
              mParameters = mParameters || {};

              if (vListBinding && typeof vListBinding === "object") {
                // we already get a list binding use this one
                oListBinding = vListBinding;
              } else if (typeof vListBinding === "string") {
                oListBinding = new ODataListBinding(_this5.getView().getModel(), vListBinding);
                mParameters.creationMode = CreationMode.Sync;
                delete mParameters.createAtEnd;
              } else {
                throw new Error("Binding object or path expected");
              }

              var oModel = oListBinding.getModel();

              var sProgrammingModel = _this5._getProgrammingModel(oListBinding);

              var resolvedCreationMode = resolveCreationMode(mParameters.creationMode, sProgrammingModel, oListBinding, oModel.getMetaModel());
              var oCreation;
              var mArgs;
              var oCreationRow = mParameters.creationRow;
              var oCreationRowContext;
              var oPayload;
              var sMetaPath;
              var oMetaModel = oModel.getMetaModel();

              var oRoutingListener = _this5._getRoutingListener();

              var _temp25 = function () {
                if (resolvedCreationMode !== CreationMode.Deferred) {
                  function _temp33() {
                    if (resolvedCreationMode === CreationMode.CreationRow || resolvedCreationMode === CreationMode.Inline) {
                      var _oTable, _oTable$getParent, _oTable$getParent$get;

                      mParameters.keepTransientContextOnFailed = false; // currently not fully supported
                      // busy handling shall be done locally only

                      mParameters.busyMode = "Local";
                      mParameters.busyId = (_oTable = oTable) === null || _oTable === void 0 ? void 0 : (_oTable$getParent = _oTable.getParent()) === null || _oTable$getParent === void 0 ? void 0 : (_oTable$getParent$get = _oTable$getParent.getTableDefinition()) === null || _oTable$getParent$get === void 0 ? void 0 : _oTable$getParent$get.annotation.id; // take care on message handling, draft indicator (in case of draft)
                      // Attach the create sent and create completed event to the object page binding so that we can react

                      _this5._handleCreateEvents(oListBinding);
                    }

                    if (!mParameters.parentControl) {
                      mParameters.parentControl = _this5.getView();
                    }

                    mParameters.beforeCreateCallBack = _this5.base.editFlow.onBeforeCreate; // In case the application was called with preferredMode=autoCreateWith, we want to skip the
                    // action parameter dialog

                    mParameters.skipParameterDialog = oAppComponent.getStartupMode() === StartupMode.AutoCreate;
                    oCreation = transactionHelper.createDocument(oListBinding, mParameters, oResourceBundle, _this5._getMessageHandler(), false, _this5.getView());
                  }

                  var _temp34 = function () {
                    if (resolvedCreationMode === CreationMode.CreationRow) {
                      oCreationRowContext = oCreationRow.getBindingContext();
                      sMetaPath = oMetaModel.getMetaPath(oCreationRowContext.getPath()); // prefill data from creation row

                      oPayload = oCreationRowContext.getObject();
                      mParameters.data = {};
                      Object.keys(oPayload).forEach(function (sPropertyPath) {
                        var oProperty = oMetaModel.getObject("".concat(sMetaPath, "/").concat(sPropertyPath)); // ensure navigation properties are not part of the payload, deep create not supported

                        if (oProperty && oProperty.$kind === "NavigationProperty") {
                          return;
                        }

                        mParameters.data[sPropertyPath] = oPayload[sPropertyPath];
                      });
                      return Promise.resolve(_this5._checkForValidationErrors()).then(function () {});
                    }
                  }();

                  return _temp34 && _temp34.then ? _temp34.then(_temp33) : _temp33(_temp34);
                }
              }();

              return _temp25 && _temp25.then ? _temp25.then(_temp26) : _temp26(_temp25);
            });
          }, function (_wasThrown2, _result3) {
            if (bShouldBusyLock) {
              BusyLocker.unlock(oLockObject);
            }

            if (_wasThrown2) throw _result3;
            return _result3;
          });
        }

        var transactionHelper = _this5._getTransactionHelper(),
            oLockObject = _this5._getGlobalUIModel();

        var oTable; //should be Table but there are missing methods into the def

        var mParameters = mInParameters;

        var oResourceBundle = _this5._getResourceBundle();

        var bShouldBusyLock = !mParameters || mParameters.creationMode !== CreationMode.Inline && mParameters.creationMode !== CreationMode.CreationRow && mParameters.creationMode !== CreationMode.External;
        var oExecCustomValidation = Promise.resolve([]);
        var oAppComponent = CommonUtils.getAppComponent(_this5.getView());
        oAppComponent.getRouterProxy().removeIAppStateKey();

        var _temp36 = function () {
          if (mParameters.creationMode === CreationMode.External) {
            // Create by navigating to an external target
            // TODO: Call appropriate function (currently using the same as for outbound chevron nav, and without any context - 3rd param)
            return Promise.resolve(_this5._syncTask()).then(function () {
              var oController = _this5.getView().getController();

              var sCreatePath = ModelHelper.getAbsoluteMetaPathForListBinding(_this5.getView(), vListBinding);
              oController.handlers.onChevronPressNavigateOutBound(oController, mParameters.outbound, undefined, sCreatePath);
              _exit2 = true;
            });
          }
        }();

        return Promise.resolve(_temp36 && _temp36.then ? _temp36.then(_temp35) : _temp35(_temp36));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * This function can be used to intercept the 'Save' action. You can execute custom coding in this function.
     * The framework waits for the returned promise to be resolved before continuing the 'Save' action.
     * If you reject the promise, the 'Save' action is stopped and the user stays in edit mode.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param mParameters Object containing the parameters passed to onBeforeSave
     * @param mParameters.context Page context that is going to be saved.
     * @returns A promise to be returned by the overridden method. If resolved, the 'Save' action is triggered. If rejected, the 'Save' action is not triggered and the user stays in edit mode.
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @alias sap.fe.core.controllerextensions.EditFlow#onBeforeSave
     * @public
     * @since 1.90.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeSave = function onBeforeSave(mParameters) {
      // to be overridden
      return Promise.resolve();
    }
    /**
     * This function can be used to intercept the 'Create' action. You can execute custom coding in this function.
     * The framework waits for the returned promise to be resolved before continuing the 'Create' action.
     * If you reject the promise, the 'Create' action is stopped.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param  mParameters Object containing the parameters passed to onBeforeCreate
     * @param mParameters.contextPath Path pointing to the context on which Create action is triggered
     * @param mParameters.createParameters Array of values that are filled in the Action Parameter Dialog
     * @returns A promise to be returned by the overridden method. If resolved, the 'Create' action is triggered. If rejected, the 'Create' action is not triggered.
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @alias sap.fe.core.controllerextensions.EditFlow#onBeforeCreate
     * @public
     * @since 1.98.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeCreate = function onBeforeCreate(mParameters) {
      // to be overridden
      return Promise.resolve();
    }
    /**
     * This function can be used to intercept the 'Edit' action. You can execute custom coding in this function.
     * The framework waits for the returned promise to be resolved before continuing the 'Edit' action.
     * If you reject the promise, the 'Edit' action is stopped and the user stays in display mode.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param mParameters Object containing the parameters passed to onBeforeEdit
     * @param mParameters.context Page context that is going to be edited.
     * @returns A promise to be returned by the overridden method. If resolved, the 'Edit' action is triggered. If rejected, the 'Edit' action is not triggered and the user stays in display mode.
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @alias sap.fe.core.controllerextensions.EditFlow#onBeforeEdit
     * @public
     * @since 1.98.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeEdit = function onBeforeEdit(mParameters) {
      // to be overridden
      return Promise.resolve();
    }
    /**
     * This function can be used to intercept the 'Discard' action. You can execute custom coding in this function.
     * The framework waits for the returned promise to be resolved before continuing the 'Discard' action.
     * If you reject the promise, the 'Discard' action is stopped and the user stays in edit mode.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param mParameters Object containing the parameters passed to onBeforeDiscard
     * @param mParameters.context Page context that is going to be discarded.
     * @returns A promise to be returned by the overridden method. If resolved, the 'Discard' action is triggered. If rejected, the 'Discard' action is not triggered and the user stays in edit mode.
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @alias sap.fe.core.controllerextensions.EditFlow#onBeforeDiscard
     * @public
     * @since 1.98.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeDiscard = function onBeforeDiscard(mParameters) {
      // to be overridden
      return Promise.resolve();
    }
    /**
     * This function can be used to intercept the 'Delete' action. You can execute custom coding in this function.
     * The framework waits for the returned promise to be resolved before continuing the 'Delete' action.
     * If you reject the promise, the 'Delete' action is stopped.
     *
     * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
     * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
     *
     * @param mParameters Object containing the parameters passed to onBeforeDelete
     * @param mParameters.contexts An array of contexts that are going to be deleted
     * @returns A promise to be returned by the overridden method. If resolved, the 'Delete' action is triggered. If rejected, the 'Delete' action is not triggered.
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @alias sap.fe.core.controllerextensions.EditFlow#onBeforeDelete
     * @public
     * @since 1.98.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeDelete = function onBeforeDelete(mParameters) {
      // to be overridden
      return Promise.resolve();
    } // Internal only params ---
    // @param {boolean} mParameters.bExecuteSideEffectsOnError Indicates whether SideEffects need to be ignored when user clicks on Save during an Inline creation
    // @param {object} mParameters.bindings List bindings of the tables in the view.
    // Both of the above parameters are for the same purpose. User can enter some information in the creation row(s) but does not 'Add row', instead clicks Save.
    // There can be more than one in the view.
    // eslint-disable-next-line jsdoc/require-param

    /**
     * Saves a new document after checking it.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oContext  Context of the editable document
     * @returns Promise resolves once save is complete
     * @alias sap.fe.core.controllerextensions.EditFlow#saveDocument
     * @public
     * @since 1.90.0
     */
    ;

    _proto.saveDocument = function saveDocument(oContext, mParameters) {
      try {
        var _this7 = this;

        mParameters = mParameters || {};
        var bExecuteSideEffectsOnError = mParameters.bExecuteSideEffectsOnError || undefined;
        var bDraftNavigation = true;

        var transactionHelper = _this7._getTransactionHelper();

        var oResourceBundle = _this7._getResourceBundle();

        var aBindings = mParameters.bindings;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(_this7._syncTask()).then(function () {
            return Promise.resolve(_this7._submitOpenChanges(oContext)).then(function () {
              return Promise.resolve(_this7._checkForValidationErrors()).then(function () {
                return Promise.resolve(_this7.base.editFlow.onBeforeSave({
                  context: oContext
                })).then(function () {
                  function _temp39() {
                    return Promise.resolve(transactionHelper.saveDocument(oContext, oResourceBundle, bExecuteSideEffectsOnError, aBindings, _this7._getMessageHandler())).then(function (activeDocumentContext) {
                      _this7._removeStickySessionInternalProperties(sProgrammingModel);

                      _this7._sendActivity(Activity.Activate, activeDocumentContext);

                      _this7._triggerConfiguredSurvey(StandardActions.save, TriggerType.standardAction);

                      _this7._setEditMode(EditMode.Display, false);

                      _this7._getMessageHandler().showMessageDialog();

                      var _temp37 = function () {
                        if (activeDocumentContext !== oContext) {
                          var _contextToNavigate2 = activeDocumentContext;

                          if (oRootViewController.isFclEnabled()) {
                            var _siblingInfo2;

                            siblingInfo = (_siblingInfo2 = siblingInfo) !== null && _siblingInfo2 !== void 0 ? _siblingInfo2 : _this7._createSiblingInfo(oContext, activeDocumentContext);

                            _this7._updatePathsInHistory(siblingInfo.pathMapping);

                            if (siblingInfo.targetContext.getPath() !== activeDocumentContext.getPath()) {
                              _contextToNavigate2 = siblingInfo.targetContext;
                            }
                          }

                          return Promise.resolve(_this7._handleNewContext(_contextToNavigate2, false, false, bDraftNavigation, true)).then(function () {});
                        }
                      }();

                      if (_temp37 && _temp37.then) return _temp37.then(function () {});
                    });
                  }

                  var sProgrammingModel = _this7._getProgrammingModel(oContext);

                  var oRootViewController = _this7._getRootViewController();

                  var siblingInfo;

                  var _temp38 = function () {
                    if ((sProgrammingModel === ProgrammingModel.Sticky || oContext.getProperty("HasActiveEntity")) && oRootViewController.isFclEnabled()) {
                      // No need to try to get rightmost context in case of a new object
                      return Promise.resolve(_this7._computeSiblingInformation(oContext, oRootViewController.getRightmostContext(), sProgrammingModel, true)).then(function (_this6$_computeSiblin) {
                        siblingInfo = _this6$_computeSiblin;
                      });
                    }
                  }();

                  return _temp38 && _temp38.then ? _temp38.then(_temp39) : _temp39(_temp38);
                });
              });
            });
          });
        }, function (oError) {
          if (!(oError && oError.canceled)) {
            Log.error("Error while saving the document", oError);
          }

          return Promise.reject(oError);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.toggleDraftActive = function toggleDraftActive(oContext) {
      try {
        var _this9 = this;

        var oContextData = oContext.getObject();
        var bEditable;
        var bIsDraft = oContext && _this9._getProgrammingModel(oContext) === ProgrammingModel.Draft; //toggle between draft and active document is only available for edit drafts and active documents with draft)

        if (!bIsDraft || !(!oContextData.IsActiveEntity && oContextData.HasActiveEntity || oContextData.IsActiveEntity && oContextData.HasDraftEntity)) {
          return Promise.resolve();
        }

        if (!oContextData.IsActiveEntity && oContextData.HasActiveEntity) {
          //start Point: edit draft
          bEditable = false;
        } else {
          // start point active document
          bEditable = true;
        }

        return Promise.resolve(_catch(function () {
          var oRootViewController = _this9._getRootViewController();

          var oRightmostContext = oRootViewController.isFclEnabled() ? oRootViewController.getRightmostContext() : oContext;
          return Promise.resolve(_this9._computeSiblingInformation(oContext, oRightmostContext, ProgrammingModel.Draft, false)).then(function (siblingInfo) {
            return function () {
              if (siblingInfo) {
                _this9._setEditMode(bEditable ? EditMode.Editable : EditMode.Display, false); //switch to edit mode only if a draft is available


                if (oRootViewController.isFclEnabled()) {
                  var lastSemanticMapping = _this9._getSemanticMapping();

                  if ((lastSemanticMapping === null || lastSemanticMapping === void 0 ? void 0 : lastSemanticMapping.technicalPath) === oContext.getPath()) {
                    var targetPath = siblingInfo.pathMapping[siblingInfo.pathMapping.length - 1].newPath;
                    siblingInfo.pathMapping.push({
                      oldPath: lastSemanticMapping.semanticPath,
                      newPath: targetPath
                    });
                  }

                  _this9._updatePathsInHistory(siblingInfo.pathMapping);
                }

                return Promise.resolve(_this9._handleNewContext(siblingInfo.targetContext, bEditable, true, true, true)).then(function () {});
              } else {
                return Promise.reject("Error in EditFlow.toggleDraftActive - Cannot find sibling");
              }
            }();
          });
        }, function (oError) {
          return Promise.reject("Error in EditFlow.toggleDraftActive:".concat(oError));
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    } // Internal only params ---
    // @param {sap.m.Button} mParameters.cancelButton - Currently this is passed as cancelButton internally (replaced by mParameters.control in the JSDoc below). Currently it is also mandatory.
    // Plan - This should not be mandatory. If not provided, we should have a default that can act as reference control for the discard popover OR we can show a dialog instead of a popover.

    /**
     * Discard the editable document.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oContext  Context of the editable document
     * @param mParameters Can contain the following attributes:
     * @param mParameters.control This is the control used to open the discard popover
     * @param mParameters.skipDiscardPopover Optional, supresses the discard popover and allows custom handling
     * @returns Promise resolves once editable document has been discarded
     * @alias sap.fe.core.controllerextensions.EditFlow#cancelDocument
     * @public
     * @since 1.90.0
     */
    ;

    _proto.cancelDocument = function cancelDocument(oContext, mParameters) {
      try {
        var _this11 = this;

        var transactionHelper = _this11._getTransactionHelper();

        var oResourceBundle = _this11._getResourceBundle();

        var mInParameters = mParameters;

        var _siblingInfo3;

        mInParameters.cancelButton = mParameters.control || mInParameters.cancelButton;
        mInParameters.beforeCancelCallBack = _this11.base.editFlow.onBeforeDiscard;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(_this11._syncTask()).then(function () {
            function _temp42() {
              return Promise.resolve(transactionHelper.cancelDocument(oContext, mInParameters, oResourceBundle, _this11._getMessageHandler())).then(function (cancelResult) {
                var bDraftNavigation = true;

                _this11._removeStickySessionInternalProperties(sProgrammingModel);

                _this11._setEditMode(EditMode.Display, false);

                _this11._setDraftStatus(DraftStatus.Clear); // we force the edit state even for FCL because the draft discard might not be implemented
                // and we may just delete the draft


                EditState.setEditStateDirty();
                return function () {
                  if (!cancelResult) {
                    _this11._sendActivity(Activity.Discard, undefined); //in case of a new document, no activeContext is returned --> navigate back.


                    var _temp43 = function () {
                      if (!mInParameters.skipBackNavigation) {
                        return Promise.resolve(_this11._getRoutingListener().navigateBackFromContext(oContext)).then(function () {});
                      }
                    }();

                    if (_temp43 && _temp43.then) return _temp43.then(function () {});
                  } else {
                    var oActiveDocumentContext = cancelResult;

                    _this11._sendActivity(Activity.Discard, oActiveDocumentContext);

                    var _contextToNavigate3 = oActiveDocumentContext;

                    if (_this11._isFclEnabled()) {
                      var _siblingInfo4;

                      _siblingInfo3 = (_siblingInfo4 = _siblingInfo3) !== null && _siblingInfo4 !== void 0 ? _siblingInfo4 : _this11._createSiblingInfo(oContext, oActiveDocumentContext);

                      _this11._updatePathsInHistory(_siblingInfo3.pathMapping);

                      if (_siblingInfo3.targetContext.getPath() !== oActiveDocumentContext.getPath()) {
                        _contextToNavigate3 = _siblingInfo3.targetContext;
                      }
                    }

                    return function () {
                      if (sProgrammingModel === ProgrammingModel.Draft) {
                        // We need to load the semantic keys of the active context, as we need them
                        // for the navigation
                        return Promise.resolve(_this11._fetchSemanticKeyValues(oActiveDocumentContext)).then(function () {
                          // We force the recreation of the context, so that it's created and bound in the same microtask,
                          // so that all properties are loaded together by autoExpandSelect, so that when switching back to Edit mode
                          // $$inheritExpandSelect takes all loaded properties into account (BCP 2070462265)
                          return function () {
                            if (!mInParameters.skipBindingToView) {
                              return Promise.resolve(_this11._handleNewContext(_contextToNavigate3, false, true, bDraftNavigation, true)).then(function () {});
                            } else {
                              return oActiveDocumentContext;
                            }
                          }();
                        });
                      } else {
                        //active context is returned in case of cancel of existing document
                        return Promise.resolve(_this11._handleNewContext(_contextToNavigate3, false, false, bDraftNavigation, true)).then(function () {});
                      }
                    }();
                  }
                }();
              });
            }

            var sProgrammingModel = _this11._getProgrammingModel(oContext);

            var _temp41 = function () {
              if ((sProgrammingModel === ProgrammingModel.Sticky || oContext.getProperty("HasActiveEntity")) && _this11._isFclEnabled()) {
                var _oRootViewController = _this11._getRootViewController(); // No need to try to get rightmost context in case of a new object


                return Promise.resolve(_this11._computeSiblingInformation(oContext, _oRootViewController.getRightmostContext(), sProgrammingModel, true)).then(function (_this10$_computeSibli) {
                  _siblingInfo3 = _this10$_computeSibli;
                });
              }
            }();

            return _temp41 && _temp41.then ? _temp41.then(_temp42) : _temp42(_temp41);
          });
        }, function (oError) {
          Log.error("Error while discarding the document", oError);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    } // Internal only params ---
    // @param {string} mParameters.entitySetName Name of the EntitySet to which the object belongs

    /**
     * Deletes the document.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oContext  Context of the document
     * @param mInParameters Can contain the following attributes:
     * @param mInParameters.title Title of the object being deleted
     * @param mInParameters.description Description of the object being deleted
     * @returns Promise resolves once document has been deleted
     * @alias sap.fe.core.controllerextensions.EditFlow#deleteDocument
     * @public
     * @since 1.90.0
     */
    ;

    _proto.deleteDocument = function deleteDocument(oContext, mInParameters) {
      var _this12 = this;

      var oAppComponent = CommonUtils.getAppComponent(this.getView());
      var mParameters = mInParameters;

      if (!mParameters) {
        mParameters = {
          bFindActiveContexts: false
        };
      } else {
        mParameters.bFindActiveContexts = false;
      }

      mParameters.beforeDeleteCallBack = this.base.editFlow.onBeforeDelete;
      return this._deleteDocumentTransaction(oContext, mParameters).then(function () {
        // Single objet deletion is triggered from an OP header button (not from a list)
        // --> Mark UI dirty and navigate back to dismiss the OP
        if (!_this12._isFclEnabled()) {
          EditState.setEditStateDirty();
        }

        _this12._sendActivity(Activity.Delete, oContext); // After delete is successfull, we need to detach the setBackNavigation Methods


        if (oAppComponent) {
          oAppComponent.getShellServices().setBackNavigation();
        }

        if ((oAppComponent === null || oAppComponent === void 0 ? void 0 : oAppComponent.getStartupMode()) === StartupMode.Deeplink && !_this12._isFclEnabled()) {
          // In case the app has been launched with semantic keys, deleting the object we've landed on shall navigate back
          // to the app we came from (except for FCL, where we navigate to LR as usual)
          oAppComponent.getRouterProxy().exitFromApp();
        } else {
          _this12._getRoutingListener().navigateBackFromContext(oContext);
        }
      }).catch(function (oError) {
        Log.error("Error while deleting the document", oError);
      });
    }
    /**
     * Submit the current set of changes and navigate back.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oContext  Context of the document
     * @returns Promise resolves once the changes have been saved
     * @alias sap.fe.core.controllerextensions.EditFlow#applyDocument
     * @public
     * @since 1.90.0
     */
    ;

    _proto.applyDocument = function applyDocument(oContext) {
      try {
        var _this14 = this;

        var oLockObject = _this14._getGlobalUIModel();

        BusyLocker.lock(oLockObject);

        var _temp45 = _finallyRethrows(function () {
          return Promise.resolve(_this14._syncTask()).then(function () {
            return Promise.resolve(_this14._submitOpenChanges(oContext)).then(function () {
              return Promise.resolve(_this14._checkForValidationErrors()).then(function () {
                return Promise.resolve(_this14._getMessageHandler().showMessageDialog()).then(function () {
                  return Promise.resolve(_this14._getRoutingListener().navigateBackFromContext(oContext)).then(function () {});
                });
              });
            });
          });
        }, function (_wasThrown3, _result13) {
          if (BusyLocker.isLocked(oLockObject)) {
            BusyLocker.unlock(oLockObject);
          }

          if (_wasThrown3) throw _result13;
          return _result13;
        });

        return Promise.resolve(_temp45 && _temp45.then ? _temp45.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    } // Internal only params ---
    // @param {boolean} [mParameters.bStaticAction] Boolean value for static action, undefined for other actions
    // @param {boolean} [mParameters.isNavigable] Boolean value indicating whether navigation is required after the action has been executed
    // Currently the parameter isNavigable is used internally and should be changed to requiresNavigation as it is a more apt name for this param

    /**
     * Invokes an action (bound or unbound) and tracks the changes so that other pages can be refreshed and show the updated data upon navigation.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param sActionName The name of the action to be called
     * @param mInParameters Contains the following attributes:
     * @param mInParameters.parameterValues A map of action parameter names and provided values
     * @param mInParameters.parameterValues.name Name of the parameter
     * @param mInParameters.parameterValues.value Value of the parameter
     * @param mInParameters.skipParameterDialog Skips the action parameter dialog if values are provided for all of them in parameterValues
     * @param mInParameters.contexts For a bound action, a context or an array with contexts for which the action is to be called must be provided
     * @param mInParameters.model For an unbound action, an instance of an OData V4 model must be provided
     * @param mInParameters.requiresNavigation Boolean value indicating whether navigation is required after the action has been executed. Navigation takes place to the context returned by the action
     * @param mInParameters.label A human-readable label for the action. This is needed in case the action has a parameter and a parameter dialog is shown to the user. The label will be used for the title of the dialog and for the confirmation button
     * @param mInParameters.invocationGrouping Mode how actions are to be called: 'ChangeSet' to put all action calls into one changeset, 'Isolated' to put them into separate changesets
     * @param mExtraParams PRIVATE
     * @returns A promise which resolves once the action has been executed, providing the response
     * @alias sap.fe.core.controllerextensions.EditFlow#invokeAction
     * @public
     * @since 1.90.0
     * @final
     */
    ;

    _proto.invokeAction = function invokeAction(sActionName, mInParameters, mExtraParams) {
      try {
        var _this16 = this;

        var oControl;

        var transactionHelper = _this16._getTransactionHelper();

        var aParts;
        var sOverloadEntityType;
        var oCurrentActionCallBacks;

        var oView = _this16.getView();

        var mParameters = mInParameters || {}; // Due to a mistake the invokeAction in the extensionAPI had a different API than this one.
        // The one from the extensionAPI doesn't exist anymore as we expose the full edit flow now but
        // due to compatibility reasons we still need to support the old signature

        if (mParameters.isA && mParameters.isA("sap.ui.model.odata.v4.Context") || Array.isArray(mParameters) || mExtraParams !== undefined) {
          var contexts = mParameters;
          mParameters = mExtraParams || {};

          if (contexts) {
            mParameters.contexts = contexts;
          } else {
            mParameters.model = _this16.getView().getModel();
          }
        }

        mParameters.isNavigable = mParameters.requiresNavigation || mParameters.isNavigable;

        if (!mParameters.parentControl) {
          mParameters.parentControl = _this16.getView();
        }

        if (mParameters.controlId) {
          oControl = _this16.getView().byId(mParameters.controlId);

          if (oControl) {
            // TODO: currently this selected contexts update is done within the operation, should be moved out
            mParameters.internalModelContext = oControl.getBindingContext("internal");
          }
        } else {
          mParameters.internalModelContext = oView.getBindingContext("internal");
        }

        if (sActionName && sActionName.indexOf("(") > -1) {
          // get entity type of action overload and remove it from the action path
          // Example sActionName = "<ActionName>(Collection(<OverloadEntityType>))"
          // sActionName = aParts[0] --> <ActionName>
          // sOverloadEntityType = aParts[2] --> <OverloadEntityType>
          aParts = sActionName.split("(");
          sActionName = aParts[0];
          sOverloadEntityType = aParts[aParts.length - 1].replaceAll(")", "");
        }

        if (mParameters.bStaticAction) {
          if (oControl.isTableBound()) {
            mParameters.contexts = oControl.getRowBinding().getHeaderContext();
          } else {
            var sBindingPath = oControl.data("rowsBindingInfo").path,
                _oListBinding = new ODataListBinding(_this16.getView().getModel(), sBindingPath);

            mParameters.contexts = _oListBinding.getHeaderContext();
          }

          if (sOverloadEntityType && oControl.getBindingContext()) {
            mParameters.contexts = _this16._getActionOverloadContextFromMetadataPath(oControl.getBindingContext(), oControl.getRowBinding(), sOverloadEntityType);
          }

          if (mParameters.enableAutoScroll) {
            oCurrentActionCallBacks = _this16._createActionPromise(sActionName, oControl.sId);
          }
        }

        mParameters.bGetBoundContext = _this16._getBoundContext(oView, mParameters); // Need to know that the action is called from ObjectPage for changeSet Isolated workaround

        mParameters.bObjectPage = oView.getViewData().converterType === "ObjectPage";
        return Promise.resolve(_catch(function () {
          return Promise.resolve(_this16._syncTask()).then(function () {
            return Promise.resolve(transactionHelper.callAction.bind(transactionHelper, sActionName, mParameters, _this16.getView(), _this16._getMessageHandler())()).then(function (oResponse) {
              function _temp47() {
                _this16._sendActivity(Activity.Action, mParameters.contexts);

                _this16._triggerConfiguredSurvey(sActionName, TriggerType.action);

                if (oCurrentActionCallBacks) {
                  oCurrentActionCallBacks.fResolver(oResponse);
                }
                /*
                		We set the (upper) pages to dirty after an execution of an action
                		TODO: get rid of this workaround
                		This workaround is only needed as long as the model does not support the synchronization.
                		Once this is supported we don't need to set the pages to dirty anymore as the context itself
                		is already refreshed (it's just not reflected in the object page)
                		we explicitly don't call this method from the list report but only call it from the object page
                		as if it is called in the list report it's not needed - as we anyway will remove this logic
                		we can live with this
                		we need a context to set the upper pages to dirty - if there are more than one we use the
                		first one as they are anyway siblings
                		*/


                if (mParameters.contexts) {
                  if (!_this16._isFclEnabled()) {
                    EditState.setEditStateDirty();
                  }

                  _this16._getInternalModel().setProperty("/sCustomAction", sActionName);
                }

                if (mParameters.isNavigable) {
                  var vContext = oResponse;

                  if (Array.isArray(vContext) && vContext.length === 1) {
                    vContext = vContext[0].value;
                  }

                  if (vContext && !Array.isArray(vContext)) {
                    var oMetaModel = oView.getModel().getMetaModel();
                    var sContextMetaPath = oMetaModel.getMetaPath(vContext.getPath());

                    var _fnValidContexts = function (contexts, applicableContexts) {
                      return contexts.filter(function (element) {
                        if (applicableContexts) {
                          return applicableContexts.indexOf(element) > -1;
                        }

                        return true;
                      });
                    };

                    var oActionContext = Array.isArray(mParameters.contexts) ? _fnValidContexts(mParameters.contexts, mParameters.applicableContext)[0] : mParameters.contexts;
                    var sActionContextMetaPath = oActionContext && oMetaModel.getMetaPath(oActionContext.getPath());

                    if (sContextMetaPath != undefined && sContextMetaPath === sActionContextMetaPath) {
                      if (oActionContext.getPath() !== vContext.getPath()) {
                        _this16._getRoutingListener().navigateForwardToContext(vContext, {
                          noHistoryEntry: false
                        });
                      } else {
                        Log.info("Navigation to the same context is not allowed");
                      }
                    }
                  }
                }

                return oResponse;
              }

              var _temp46 = function () {
                if (mParameters.contexts) {
                  return Promise.resolve(_this16._refreshListIfRequired(_this16._getActionResponseDataAndKeys(sActionName, oResponse), mParameters.contexts[0])).then(function () {});
                }
              }();

              return _temp46 && _temp46.then ? _temp46.then(_temp47) : _temp47(_temp46);
            });
          });
        }, function (err) {
          if (oCurrentActionCallBacks) {
            oCurrentActionCallBacks.fRejector();
          } // FIXME: in most situations there is no handler for the rejected promises returnedq


          if (err === Constants.CancelActionDialog) {
            // This leads to console error. Actually the error is already handled (currently directly in press handler of end button in dialog), so it should not be forwarded
            // up to here. However, when dialog handling and backend execution are separated, information whether dialog was cancelled, or backend execution has failed needs
            // to be transported to the place responsible for connecting these two things.
            // TODO: remove special handling one dialog handling and backend execution are separated
            throw new Error("Dialog cancelled");
          } else if (!(err && (err.canceled || err.rejectedItems && err.rejectedItems[0].canceled))) {
            // TODO: analyze, whether this is of the same category as above
            throw new Error("Error in EditFlow.invokeAction:".concat(err));
          }
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Secured execution of the given function. Ensures that the function is only executed when certain conditions are fulfilled.
     *
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param fnFunction The function to be executed. Should return a promise that is settled after completion of the execution. If nothing is returned, immediate completion is assumed.
     * @param mParameters Definitions of the preconditions to be checked before execution
     * @param mParameters.busy Defines the busy indicator
     * @param mParameters.busy.set Triggers a busy indicator when the function is executed.
     * @param mParameters.busy.check Executes function only if application isn't busy.
     * @param mParameters.updatesDocument This operation updates the current document without using the bound model and context. As a result, the draft status is updated if a draft document exists, and the user has to confirm the cancellation of the editing process.
     * @returns A promise that is rejected if the execution is prohibited and resolved by the promise returned by the fnFunction.
     * @alias sap.fe.core.controllerextensions.EditFlow#securedExecution
     * @public
     * @experimental As of version 1.90.0
     * @since 1.90.0
     */
    ;

    _proto.securedExecution = function securedExecution(fnFunction, mParameters) {
      var _this17 = this;

      var bBusySet = mParameters && mParameters.busy && mParameters.busy.set !== undefined ? mParameters.busy.set : true,
          bBusyCheck = mParameters && mParameters.busy && mParameters.busy.check !== undefined ? mParameters.busy.check : true,
          bUpdatesDocument = mParameters && mParameters.updatesDocument || false,
          oLockObject = this._getGlobalUIModel(),
          oContext = this.base.getView().getBindingContext(),
          bIsDraft = oContext && this._getProgrammingModel(oContext) === ProgrammingModel.Draft;

      if (bBusyCheck && BusyLocker.isLocked(oLockObject)) {
        return Promise.reject("Application already busy therefore execution rejected");
      } // we have to set busy and draft indicator immediately also the function might be executed later in queue


      if (bBusySet) {
        BusyLocker.lock(oLockObject);
      }

      if (bUpdatesDocument && bIsDraft) {
        this._setDraftStatus(DraftStatus.Saving);
      }

      this._getMessageHandler().removeTransitionMessages();

      return this._syncTask(fnFunction).then(function () {
        if (bUpdatesDocument) {
          _this17._getTransactionHelper().handleDocumentModifications();

          if (!_this17._isFclEnabled()) {
            EditState.setEditStateDirty();
          }

          if (bIsDraft) {
            _this17._setDraftStatus(DraftStatus.Saved);
          }
        }
      }).catch(function (oError) {
        if (bUpdatesDocument && bIsDraft) {
          _this17._setDraftStatus(DraftStatus.Clear);
        }

        return Promise.reject(oError);
      }).finally(function () {
        if (bBusySet) {
          BusyLocker.unlock(oLockObject);
        }

        _this17._getMessageHandler().showMessageDialog();
      });
    }
    /**
     * Handles the patchSent event: register document modification.
     *
     * @param oEvent
     */
    ;

    _proto.handlePatchSent = function handlePatchSent(oEvent) {
      var _this$base$getView,
          _this$base$getView$ge,
          _this18 = this;

      if (!((_this$base$getView = this.base.getView()) !== null && _this$base$getView !== void 0 && (_this$base$getView$ge = _this$base$getView.getBindingContext("internal")) !== null && _this$base$getView$ge !== void 0 && _this$base$getView$ge.getProperty("skipPatchHandlers"))) {
        // Create a promise that will be resolved or rejected when the path is completed
        var oPatchPromise = new Promise(function (resolve, reject) {
          oEvent.getSource().attachEventOnce("patchCompleted", function (patchCompletedEvent) {
            if (oEvent.getSource().isA("sap.ui.model.odata.v4.ODataListBinding")) {
              var _this18$base$getView;

              ActionRuntime.setActionEnablementAfterPatch(_this18.base.getView(), oEvent.getSource(), (_this18$base$getView = _this18.base.getView()) === null || _this18$base$getView === void 0 ? void 0 : _this18$base$getView.getBindingContext("internal"));
            }

            var bSuccess = patchCompletedEvent.getParameter("success");

            if (bSuccess) {
              resolve();
            } else {
              reject();
            }
          });
        });
        this.updateDocument(oEvent.getSource(), oPatchPromise);
      }
    }
    /**
     * Handles the CreateActivate event.
     *
     * @param oEvent
     */
    ;

    _proto.handleCreateActivate = function handleCreateActivate(oEvent) {
      var oBinding = oEvent.getSource();

      var transactionHelper = this._getTransactionHelper();

      var bAtEnd = true;
      var bInactive = true;

      var oResourceBundle = this._getResourceBundle();

      var oParams = {
        creationMode: CreationMode.Inline,
        createAtEnd: bAtEnd,
        inactive: bInactive,
        keepTransientContextOnFailed: false,
        // currently not fully supported
        busyMode: "None"
      };
      transactionHelper.createDocument(oBinding, oParams, oResourceBundle, this._getMessageHandler(), false, this.getView());
    } //////////////////////////////////////
    // Private methods
    //////////////////////////////////////

    /*
    		 TO BE CHECKED / DISCUSSED
    		 _createMultipleDocuments and deleteMultiDocument - couldn't we combine them with create and delete document?
    		 _createActionPromise and deleteCurrentActionPromise -> next step
    			 */
    ;

    _proto._setEditMode = function _setEditMode(sEditMode, bCreationMode) {
      this.base.getView().getController()._editFlow.setEditMode(sEditMode, bCreationMode);
    };

    _proto._setDraftStatus = function _setDraftStatus(sDraftState) {
      this.base.getView().getController()._editFlow.setDraftStatus(sDraftState);
    };

    _proto._getRoutingListener = function _getRoutingListener() {
      return this.base.getView().getController()._editFlow.getRoutingListener();
    };

    _proto._getGlobalUIModel = function _getGlobalUIModel() {
      return this.base.getView().getController()._editFlow.getGlobalUIModel();
    };

    _proto._syncTask = function _syncTask(vTask) {
      return this.base.getView().getController()._editFlow.syncTask(vTask);
    };

    _proto._getProgrammingModel = function _getProgrammingModel(oContext) {
      return this.base.getView().getController()._editFlow.getProgrammingModel(oContext);
    };

    _proto._deleteDocumentTransaction = function _deleteDocumentTransaction(oContext, mParameters) {
      return this.base.getView().getController()._editFlow.deleteDocumentTransaction(oContext, mParameters);
    };

    _proto._handleCreateEvents = function _handleCreateEvents(oBinding) {
      this.base.getView().getController()._editFlow.handleCreateEvents(oBinding);
    };

    _proto._getTransactionHelper = function _getTransactionHelper() {
      return this.base.getView().getController()._editFlow.getTransactionHelper();
    };

    _proto._getInternalModel = function _getInternalModel() {
      return this.base.getView().getController()._editFlow.getInternalModel();
    };

    _proto._getRootViewController = function _getRootViewController() {
      return this.base.getAppComponent().getRootViewController();
    };

    _proto._getResourceBundle = function _getResourceBundle() {
      return this.getView().getController().oResourceBundle;
    };

    _proto._getSemanticMapping = function _getSemanticMapping() {
      return this.base.getAppComponent().getRoutingService().getLastSemanticMapping();
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

    _proto._createActionPromise = function _createActionPromise(sActionName, sControlId) {
      return this.base.getView().getController()._editFlow.createActionPromise(sActionName, sControlId);
    };

    _proto._getCurrentActionPromise = function _getCurrentActionPromise() {
      return this.base.getView().getController()._editFlow.getCurrentActionPromise();
    };

    _proto._deleteCurrentActionPromise = function _deleteCurrentActionPromise() {
      return this.base.getView().getController()._editFlow.deleteCurrentActionPromise();
    };

    _proto._getMessageHandler = function _getMessageHandler() {
      return this.base.getView().getController()._editFlow.getMessageHandler();
    };

    _proto._sendActivity = function _sendActivity(action, relatedContexts) {
      var content = Array.isArray(relatedContexts) ? relatedContexts.map(function (context) {
        return context.getPath();
      }) : relatedContexts === null || relatedContexts === void 0 ? void 0 : relatedContexts.getPath();
      send(this.getView(), action, content);
    };

    _proto._triggerConfiguredSurvey = function _triggerConfiguredSurvey(sActionName, triggerType) {
      triggerConfiguredSurvey(this.getView(), sActionName, triggerType);
    }
    /**
     * @function
     * @name _getActionResponseDataAndKeys
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param sActionName The name of the action that is executed
     * @param oResponse The bound action's response data or response context
     * @returns Object with data and names of the key fields of the response
     */
    ;

    _proto._getActionResponseDataAndKeys = function _getActionResponseDataAndKeys(sActionName, oResponse) {
      return this.base.getView().getController()._editFlow.getActionResponseDataAndKeys(sActionName, oResponse);
    };

    _proto._submitOpenChanges = function _submitOpenChanges(oContext) {
      try {
        var _this20 = this;

        var _oModel = oContext.getModel(),
            oLockObject = _this20._getGlobalUIModel();

        return Promise.resolve(_finallyRethrows(function () {
          // Submit any leftover changes that are not yet submitted
          // Currently we are using only 1 updateGroupId, hence submitting the batch directly here
          return Promise.resolve(_oModel.submitBatch("$auto")).then(function () {
            // Wait for all currently running changes
            // For the time being we agreed with the v4 model team to use an internal method. We'll replace it once
            // a public or restricted method was provided
            return Promise.resolve(_oModel.oRequestor.waitForRunningChangeRequests("$auto")).then(function () {
              if (_oModel.hasPendingChanges("$auto")) {
                throw new Error("submit of open changes failed");
              }
            }); // Check if all changes were submitted successfully
          });
        }, function (_wasThrown4, _result15) {
          if (BusyLocker.isLocked(oLockObject)) {
            BusyLocker.unlock(oLockObject);
          }

          if (_wasThrown4) throw _result15;
          return _result15;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._handleStickyOn = function _handleStickyOn(oContext) {
      return this.base.getView().getController()._editFlow.handleStickyOn(oContext);
    };

    _proto._handleStickyOff = function _handleStickyOff() {
      return this.base.getView().getController()._editFlow.handleStickyOff();
    };

    _proto._onBackNavigationInSession = function _onBackNavigationInSession() {
      return this.base.getView().getController()._editFlow.onBackNavigationInSession();
    };

    _proto._discardStickySession = function _discardStickySession(oContext) {
      return this.base.getView().getController()._editFlow.discardStickySession(oContext);
    };

    _proto._setStickySessionInternalProperties = function _setStickySessionInternalProperties(programmingModel, model) {
      if (programmingModel === ProgrammingModel.Sticky) {
        var internalModel = this._getInternalModel();

        internalModel.setProperty("/sessionOn", true);
        internalModel.setProperty("/stickySessionToken", model.getHttpHeaders(true)["SAP-ContextId"]);
      }
    };

    _proto._removeStickySessionInternalProperties = function _removeStickySessionInternalProperties(programmingModel) {
      if (programmingModel === ProgrammingModel.Sticky) {
        var internalModel = this._getInternalModel();

        internalModel.setProperty("/sessionOn", false);
        internalModel.setProperty("/stickySessionToken", undefined);

        this._handleStickyOff();
      }
    };

    _proto._handleNewContext = function _handleNewContext(oContext, bEditable, bRecreateContext, bDraftNavigation) {
      var bForceFocus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      try {
        var _this22 = this;

        if (!_this22._isFclEnabled()) {
          EditState.setEditStateDirty();
        }

        return Promise.resolve(_this22._getRoutingListener().navigateToContext(oContext, {
          checkNoHashChange: true,
          editable: bEditable,
          bPersistOPScroll: true,
          bRecreateContext: bRecreateContext,
          bDraftNavigation: bDraftNavigation,
          showPlaceholder: false,
          bForceFocus: bForceFocus,
          keepCurrentLayout: true
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._getBoundContext = function _getBoundContext(view, params) {
      var viewLevel = view.getViewData().viewLevel;
      var bRefreshAfterAction = viewLevel > 1 || viewLevel === 1 && params.controlId;
      return !params.isNavigable || !!bRefreshAfterAction;
    }
    /**
     * Checks if there are validation (parse) errors for controls bound to a given context
     *
     * @function
     * @name _checkForValidationErrors
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @returns {Promise} Promise resolves if there are no validation errors, and rejects if there are validation errors
     */
    ;

    _proto._checkForValidationErrors = function _checkForValidationErrors() {
      var _this23 = this;

      return this._syncTask().then(function () {
        var sViewId = _this23.base.getView().getId();

        var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
        var oControl;
        var oMessage;

        if (!aMessages.length) {
          return Promise.resolve("No validation errors found");
        }

        for (var i = 0; i < aMessages.length; i++) {
          oMessage = aMessages[i];

          if (oMessage.validation) {
            oControl = Core.byId(oMessage.getControlId());

            while (oControl) {
              if (oControl.getId() === sViewId) {
                return Promise.reject("validation errors exist");
              }

              oControl = oControl.getParent();
            }
          }
        }
      });
    }
    /**
     * @function
     * @name _refreshListIfRequired
     * @memberof sap.fe.core.controllerextensions.EditFlow
     * @param oResponse The response of the bound action and the names of the key fields
     * @param oContext The bound context on which the action was executed
     * @returns Always resolves to param oResponse
     */
    ;

    _proto._refreshListIfRequired = function _refreshListIfRequired(oResponse, oContext) {
      var _this24 = this;

      if (!oContext || !oResponse || !oResponse.oData) {
        return Promise.resolve();
      }

      var oBinding = oContext.getBinding(); // refresh only lists

      if (oBinding && oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
        var oContextData = oResponse.oData;
        var aKeys = oResponse.keys;
        var oCurrentData = oContext.getObject();
        var bReturnedContextIsSame = true; // ensure context is in the response

        if (Object.keys(oContextData).length) {
          // check if context in response is different than the bound context
          bReturnedContextIsSame = aKeys.every(function (sKey) {
            return oCurrentData[sKey] === oContextData[sKey];
          });

          if (!bReturnedContextIsSame) {
            return new Promise(function (resolve) {
              if (oBinding.isRoot()) {
                oBinding.attachEventOnce("dataReceived", function () {
                  resolve();
                });
                oBinding.refresh();
              } else {
                var oAppComponent = CommonUtils.getAppComponent(_this24.getView());
                oAppComponent.getSideEffectsService().requestSideEffects([{
                  $NavigationPropertyPath: oBinding.getPath()
                }], oBinding.getContext()).then(function () {
                  resolve();
                }, function () {
                  Log.error("Error while refreshing the table");
                  resolve();
                }).catch(function (e) {
                  Log.error("Error while refreshing the table", e);
                });
              }
            });
          }
        }
      } // resolve with oResponse to not disturb the promise chain afterwards


      return Promise.resolve();
    };

    _proto._fetchSemanticKeyValues = function _fetchSemanticKeyValues(oContext) {
      var oMetaModel = oContext.getModel().getMetaModel(),
          sEntitySetName = oMetaModel.getMetaContext(oContext.getPath()).getObject("@sapui.name"),
          aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sEntitySetName);

      if (aSemanticKeys && aSemanticKeys.length) {
        var aRequestPromises = aSemanticKeys.map(function (oKey) {
          return oContext.requestObject(oKey.$PropertyPath);
        });
        return Promise.all(aRequestPromises);
      } else {
        return Promise.resolve();
      }
    }
    /**
     * Provides the latest context in the metadata hierarchy from rootBinding to given context pointing to given entityType
     * if any such context exists. Otherwise, it returns the original context.
     * Note: It is only needed as work-around for incorrect modelling. Correct modelling would imply a DataFieldForAction in a LineItem
     * to point to an overload defined either on the corresponding EntityType or a collection of the same.
     *
     * @param rootContext The context to start searching from
     * @param listBinding The listBinding of the table
     * @param overloadEntityType The ActionOverload entity type to search for
     * @returns Returns the context of the ActionOverload entity
     */
    ;

    _proto._getActionOverloadContextFromMetadataPath = function _getActionOverloadContextFromMetadataPath(rootContext, listBinding, overloadEntityType) {
      var model = rootContext.getModel();
      var metaModel = model.getMetaModel();
      var contextSegments = listBinding.getPath().split("/");
      var currentContext = rootContext;

      if (contextSegments[0] !== "") {
        contextSegments.unshift(""); // to also get the root context, i.e. the bindingContext of the table
      } // load all the parent contexts into an array


      var parentContexts = contextSegments.map(function (pathSegment) {
        currentContext = model.bindContext(pathSegment, currentContext).getBoundContext();
        return currentContext;
      }).reverse(); // search for context backwards

      var overloadContext = parentContexts.find(function (parentContext) {
        return metaModel.getMetaContext(parentContext.getPath()).getObject("$Type") === overloadEntityType;
      });
      return overloadContext || listBinding.getHeaderContext();
    };

    _proto._createSiblingInfo = function _createSiblingInfo(currentContext, newContext) {
      return {
        targetContext: newContext,
        pathMapping: [{
          oldPath: currentContext.getPath(),
          newPath: newContext.getPath()
        }]
      };
    };

    _proto._updatePathsInHistory = function _updatePathsInHistory(mappings) {
      var oAppComponent = this.base.getAppComponent();
      oAppComponent.getRouterProxy().setPathMapping(mappings); // Also update the semantic mapping in the routing service

      var lastSemanticMapping = this._getSemanticMapping();

      if (mappings.length && (lastSemanticMapping === null || lastSemanticMapping === void 0 ? void 0 : lastSemanticMapping.technicalPath) === mappings[mappings.length - 1].oldPath) {
        lastSemanticMapping.technicalPath = mappings[mappings.length - 1].newPath;
      }
    }
    /**
     * This methods creates a sibling context for a subobject page, and calculates a sibling path for
     * all intermediates paths between the OP and the sub-OP.
     *
     * @param rootCurrentContext The context for the root of the draft
     * @param rightmostCurrentContext The context of the subobject
     * @param sProgrammingModel The programming model
     * @param doNotComputeIfRoot If true, we don't compute siblingInfo if the root and the rightmost contexts are the same
     * @returns Returns the siblingInformation object
     */
    ;

    _proto._computeSiblingInformation = function _computeSiblingInformation(rootCurrentContext, rightmostCurrentContext, sProgrammingModel, doNotComputeIfRoot) {
      try {
        var _rightmostCurrentCont;

        rightmostCurrentContext = (_rightmostCurrentCont = rightmostCurrentContext) !== null && _rightmostCurrentCont !== void 0 ? _rightmostCurrentCont : rootCurrentContext;

        if (!rightmostCurrentContext.getPath().startsWith(rootCurrentContext.getPath())) {
          // Wrong usage !!
          Log.error("Cannot compute rightmost sibling context");
          throw new Error("Cannot compute rightmost sibling context");
        }

        if (doNotComputeIfRoot && rightmostCurrentContext.getPath() === rootCurrentContext.getPath()) {
          return Promise.resolve(undefined);
        }

        var model = rootCurrentContext.getModel();

        if (sProgrammingModel === ProgrammingModel.Draft) {
          return Promise.resolve(draft.computeSiblingInformation(rootCurrentContext, rightmostCurrentContext));
        } else {
          // If not in draft mode, we just recreate a context from the path of the rightmost context
          // No path mapping is needed
          return Promise.resolve({
            targetContext: model.bindContext(rightmostCurrentContext.getPath()).getBoundContext(),
            pathMapping: []
          });
        }
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._isFclEnabled = function _isFclEnabled() {
      return CommonUtils.getAppComponent(this.getView())._isFclEnabled();
    };

    return EditFlow;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "editDocument", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "editDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteMultipleDocuments", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteMultipleDocuments"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateDocument", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "updateDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createDocument", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "createDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeSave", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeSave"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeCreate", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeCreate"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeEdit", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeEdit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeDiscard", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeDiscard"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeDelete", [_dec18, _dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeDelete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "saveDocument", [_dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "saveDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "toggleDraftActive", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "toggleDraftActive"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cancelDocument", [_dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "cancelDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteDocument", [_dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "applyDocument", [_dec28, _dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "applyDocument"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "invokeAction", [_dec30, _dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "invokeAction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "securedExecution", [_dec32, _dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "securedExecution"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handlePatchSent", [_dec34], Object.getOwnPropertyDescriptor(_class2.prototype, "handlePatchSent"), _class2.prototype)), _class2)) || _class);
  return EditFlow;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiZmluYWxpemVyIiwiYmluZCIsIkNyZWF0aW9uTW9kZSIsIkZFTGlicmFyeSIsIlByb2dyYW1taW5nTW9kZWwiLCJDb25zdGFudHMiLCJEcmFmdFN0YXR1cyIsIkVkaXRNb2RlIiwiU3RhcnR1cE1vZGUiLCJNZXNzYWdlVHlwZSIsImNvcmVMaWJyYXJ5IiwiRWRpdEZsb3ciLCJkZWZpbmVVSTVDbGFzcyIsInB1YmxpY0V4dGVuc2lvbiIsImZpbmFsRXh0ZW5zaW9uIiwiZXh0ZW5zaWJsZSIsIk92ZXJyaWRlRXhlY3V0aW9uIiwiQWZ0ZXIiLCJlZGl0RG9jdW1lbnQiLCJvQ29udGV4dCIsImJEcmFmdE5hdmlnYXRpb24iLCJ0cmFuc2FjdGlvbkhlbHBlciIsIl9nZXRUcmFuc2FjdGlvbkhlbHBlciIsIm9Sb290Vmlld0NvbnRyb2xsZXIiLCJfZ2V0Um9vdFZpZXdDb250cm9sbGVyIiwibW9kZWwiLCJnZXRNb2RlbCIsInJpZ2h0bW9zdENvbnRleHQiLCJiYXNlIiwiZWRpdEZsb3ciLCJvbkJlZm9yZUVkaXQiLCJjb250ZXh0IiwiZ2V0VmlldyIsIl9nZXRNZXNzYWdlSGFuZGxlciIsIm9OZXdEb2N1bWVudENvbnRleHQiLCJzUHJvZ3JhbW1pbmdNb2RlbCIsIl9nZXRQcm9ncmFtbWluZ01vZGVsIiwiX3NldFN0aWNreVNlc3Npb25JbnRlcm5hbFByb3BlcnRpZXMiLCJfc2V0RWRpdE1vZGUiLCJFZGl0YWJsZSIsInNob3dNZXNzYWdlRGlhbG9nIiwiX2hhbmRsZU5ld0NvbnRleHQiLCJjb250ZXh0VG9OYXZpZ2F0ZSIsIlN0aWNreSIsIl9oYW5kbGVTdGlja3lPbiIsIk1vZGVsSGVscGVyIiwiaXNDb2xsYWJvcmF0aW9uRHJhZnRTdXBwb3J0ZWQiLCJnZXRNZXRhTW9kZWwiLCJzaGFyZU9iamVjdCIsIl9pc0ZjbEVuYWJsZWQiLCJnZXRSaWdodG1vc3RDb250ZXh0IiwiX2NvbXB1dGVTaWJsaW5nSW5mb3JtYXRpb24iLCJzaWJsaW5nSW5mbyIsIl9jcmVhdGVTaWJsaW5nSW5mbyIsIl91cGRhdGVQYXRoc0luSGlzdG9yeSIsInBhdGhNYXBwaW5nIiwidGFyZ2V0Q29udGV4dCIsImdldFBhdGgiLCJvRXJyb3IiLCJMb2ciLCJlcnJvciIsImRlbGV0ZU11bHRpcGxlRG9jdW1lbnRzIiwiYUNvbnRleHRzIiwibVBhcmFtZXRlcnMiLCJiZWZvcmVEZWxldGVDYWxsQmFjayIsIm9uQmVmb3JlRGVsZXRlIiwiZ2V0Q29udHJvbGxlciIsIl9lZGl0RmxvdyIsInVwZGF0ZURvY3VtZW50Iiwib1Byb21pc2UiLCJvcmlnaW5hbEJpbmRpbmdDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJiSXNEcmFmdCIsIkRyYWZ0IiwicmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzIiwiX3N5bmNUYXNrIiwiaGFuZGxlRG9jdW1lbnRNb2RpZmljYXRpb25zIiwiRWRpdFN0YXRlIiwic2V0RWRpdFN0YXRlRGlydHkiLCJfc2V0RHJhZnRTdGF0dXMiLCJTYXZpbmciLCJvQmluZGluZ0NvbnRleHQiLCJvTWV0YU1vZGVsIiwic0VudGl0eVNldE5hbWUiLCJnZXRNZXRhQ29udGV4dCIsImdldE9iamVjdCIsImFTZW1hbnRpY0tleXMiLCJTZW1hbnRpY0tleUhlbHBlciIsImdldFNlbWFudGljS2V5cyIsImxlbmd0aCIsIm9DdXJyZW50U2VtYW50aWNNYXBwaW5nIiwiX2dldFNlbWFudGljTWFwcGluZyIsInNDdXJyZW50U2VtYW50aWNQYXRoIiwic2VtYW50aWNQYXRoIiwic0NoYW5nZWRQYXRoIiwiZ2V0U2VtYW50aWNQYXRoIiwiU2F2ZWQiLCJDbGVhciIsInNob3dNZXNzYWdlcyIsImNyZWF0ZURvY3VtZW50Iiwidkxpc3RCaW5kaW5nIiwibUluUGFyYW1ldGVycyIsImNyZWF0aW9uTW9kZSIsIkNyZWF0aW9uUm93IiwiY3JlYXRpb25Sb3ciLCJvQ3JlYXRpb25Sb3dPYmplY3RzIiwib1RhYmxlIiwiZ2V0UGFyZW50Iiwib0V4ZWNDdXN0b21WYWxpZGF0aW9uIiwidmFsaWRhdGVEb2N1bWVudCIsImRhdGEiLCJjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb24iLCJnZXRDcmVhdGlvblJvdyIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsInNldFByb3BlcnR5IiwiSW5saW5lIiwidGFibGVJZCIsImJ5SWQiLCJpc0EiLCJmbkZvY3VzT3JTY3JvbGwiLCJmb2N1c1JvdyIsInNjcm9sbFRvSW5kZXgiLCJnZXRSb3dCaW5kaW5nIiwiYXR0YWNoRXZlbnRPbmNlIiwiY3JlYXRlQXRFbmQiLCJnZXRMZW5ndGgiLCJoYW5kbGVTaWRlRWZmZWN0cyIsIm9MaXN0QmluZGluZyIsIm9DcmVhdGlvblByb21pc2UiLCJvTmV3Q29udGV4dCIsImNyZWF0ZWQiLCJDb21tb25VdGlscyIsImhhc1RyYW5zaWVudENvbnRleHQiLCJhcHBDb21wb25lbnQiLCJnZXRBcHBDb21wb25lbnQiLCJnZXRTaWRlRWZmZWN0c1NlcnZpY2UiLCJyZXF1ZXN0U2lkZUVmZmVjdHNGb3JOYXZpZ2F0aW9uUHJvcGVydHkiLCJjcmVhdGVDdXN0b21WYWxpZGF0aW9uTWVzc2FnZXMiLCJhVmFsaWRhdGlvbk1lc3NhZ2VzIiwic0N1c3RvbVZhbGlkYXRpb25GdW5jdGlvbiIsIm1DdXN0b21WYWxpZGl0eSIsImdldFByb3BlcnR5Iiwib01lc3NhZ2VNYW5hZ2VyIiwiQ29yZSIsImdldE1lc3NhZ2VNYW5hZ2VyIiwiYUN1c3RvbU1lc3NhZ2VzIiwib0ZpZWxkQ29udHJvbCIsInNUYXJnZXQiLCJnZXRNZXNzYWdlTW9kZWwiLCJnZXREYXRhIiwiZm9yRWFjaCIsIm9NZXNzYWdlIiwiY29kZSIsInJlbW92ZU1lc3NhZ2VzIiwib1ZhbGlkYXRpb25NZXNzYWdlIiwibWVzc2FnZVRhcmdldCIsImdldENvbnRyb2wiLCJmaWVsZElkIiwiZ2V0QmluZGluZ1BhdGgiLCJmaWx0ZXIiLCJ0YXJnZXQiLCJhZGRNZXNzYWdlcyIsIk1lc3NhZ2UiLCJtZXNzYWdlIiwibWVzc2FnZVRleHQiLCJwcm9jZXNzb3IiLCJ0eXBlIiwiRXJyb3IiLCJ0ZWNobmljYWwiLCJwZXJzaXN0ZW50IiwiYUV4aXN0aW5nVmFsaWRhdGlvbk1lc3NhZ2VzIiwiYWRkQ29udHJvbElkIiwicHVzaCIsInRleHQiLCJjdXN0b21NZXNzYWdlcyIsInJlc29sdmVDcmVhdGlvbk1vZGUiLCJpbml0aWFsQ3JlYXRpb25Nb2RlIiwicHJvZ3JhbW1pbmdNb2RlbCIsIk5ld1BhZ2UiLCJpc1JlbGF0aXZlIiwic1BhdGgiLCJzTmV3QWN0aW9uIiwiYVBhcmFtZXRlcnMiLCJEZWZlcnJlZCIsInNNZXRhUGF0aCIsImdldE1ldGFQYXRoIiwiZ2V0SGVhZGVyQ29udGV4dCIsImFOb25Db21wdXRlZFZpc2libGVLZXlGaWVsZHMiLCJnZXROb25Db21wdXRlZFZpc2libGVGaWVsZHMiLCJBc3luYyIsImJTaG91bGRCdXN5TG9jayIsIkJ1c3lMb2NrZXIiLCJsb2NrIiwib0xvY2tPYmplY3QiLCJvTmF2aWdhdGlvbiIsInJlc29sdmVkQ3JlYXRpb25Nb2RlIiwib1JvdXRpbmdMaXN0ZW5lciIsIm5hdmlnYXRlRm9yd2FyZFRvQ29udGV4dCIsImJEZWZlcnJlZENvbnRleHQiLCJlZGl0YWJsZSIsImJGb3JjZUZvY3VzIiwiYXN5bmNDb250ZXh0Iiwib0NyZWF0aW9uIiwiU3luYyIsIm1BcmdzIiwiY3JlYXRlQWN0aW9uIiwidHJhbnNpZW50IiwiY29yZVJlc291cmNlQnVuZGxlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwibmF2aWdhdGVUb01lc3NhZ2VQYWdlIiwiZ2V0VGV4dCIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJiRnJvbURlZmVycmVkIiwibmF2aWdhdGVUb0NvbnRleHQiLCJvQ3JlYXRpb25Sb3dMaXN0QmluZGluZyIsIm9DcmVhdGlvblJvd0NvbnRleHQiLCJnZXRCaW5kaW5nIiwiYlNraXBTaWRlRWZmZWN0cyIsIm9OZXdUcmFuc2llbnRDb250ZXh0IiwiY3JlYXRlIiwib0NyZWF0aW9uUm93Iiwic2V0QmluZGluZ0NvbnRleHQiLCJjYXRjaCIsInRyYWNlIiwiZGVsZXRlIiwiaXNMb2NrZWQiLCJ1bmxvY2siLCJQcm9taXNlIiwicmVqZWN0IiwiYklzTmV3UGFnZUNyZWF0aW9uIiwiYWxsIiwiYVBhcmFtcyIsIm9Nb2RlbCIsIl9zZW5kQWN0aXZpdHkiLCJBY3Rpdml0eSIsIkNyZWF0ZSIsIkNhbmNlbEFjdGlvbkRpYWxvZyIsIkFjdGlvbkV4ZWN1dGlvbkZhaWxlZCIsIkNyZWF0aW9uRmFpbGVkIiwibmF2aWdhdGVCYWNrRnJvbVRyYW5zaWVudFN0YXRlIiwiT0RhdGFMaXN0QmluZGluZyIsIm9QYXlsb2FkIiwiX2dldFJvdXRpbmdMaXN0ZW5lciIsImtlZXBUcmFuc2llbnRDb250ZXh0T25GYWlsZWQiLCJidXN5TW9kZSIsImJ1c3lJZCIsImdldFRhYmxlRGVmaW5pdGlvbiIsImFubm90YXRpb24iLCJpZCIsIl9oYW5kbGVDcmVhdGVFdmVudHMiLCJwYXJlbnRDb250cm9sIiwiYmVmb3JlQ3JlYXRlQ2FsbEJhY2siLCJvbkJlZm9yZUNyZWF0ZSIsInNraXBQYXJhbWV0ZXJEaWFsb2ciLCJvQXBwQ29tcG9uZW50IiwiZ2V0U3RhcnR1cE1vZGUiLCJBdXRvQ3JlYXRlIiwib1Jlc291cmNlQnVuZGxlIiwiT2JqZWN0Iiwia2V5cyIsInNQcm9wZXJ0eVBhdGgiLCJvUHJvcGVydHkiLCIka2luZCIsIl9jaGVja0ZvclZhbGlkYXRpb25FcnJvcnMiLCJfZ2V0R2xvYmFsVUlNb2RlbCIsIl9nZXRSZXNvdXJjZUJ1bmRsZSIsIkV4dGVybmFsIiwicmVzb2x2ZSIsImdldFJvdXRlclByb3h5IiwicmVtb3ZlSUFwcFN0YXRlS2V5Iiwib0NvbnRyb2xsZXIiLCJzQ3JlYXRlUGF0aCIsImdldEFic29sdXRlTWV0YVBhdGhGb3JMaXN0QmluZGluZyIsImhhbmRsZXJzIiwib25DaGV2cm9uUHJlc3NOYXZpZ2F0ZU91dEJvdW5kIiwib3V0Ym91bmQiLCJ1bmRlZmluZWQiLCJvbkJlZm9yZVNhdmUiLCJvbkJlZm9yZURpc2NhcmQiLCJzYXZlRG9jdW1lbnQiLCJiRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvciIsImFCaW5kaW5ncyIsImJpbmRpbmdzIiwiX3N1Ym1pdE9wZW5DaGFuZ2VzIiwiYWN0aXZlRG9jdW1lbnRDb250ZXh0IiwiX3JlbW92ZVN0aWNreVNlc3Npb25JbnRlcm5hbFByb3BlcnRpZXMiLCJBY3RpdmF0ZSIsIl90cmlnZ2VyQ29uZmlndXJlZFN1cnZleSIsIlN0YW5kYXJkQWN0aW9ucyIsInNhdmUiLCJUcmlnZ2VyVHlwZSIsInN0YW5kYXJkQWN0aW9uIiwiRGlzcGxheSIsImlzRmNsRW5hYmxlZCIsImNhbmNlbGVkIiwidG9nZ2xlRHJhZnRBY3RpdmUiLCJvQ29udGV4dERhdGEiLCJiRWRpdGFibGUiLCJJc0FjdGl2ZUVudGl0eSIsIkhhc0FjdGl2ZUVudGl0eSIsIkhhc0RyYWZ0RW50aXR5Iiwib1JpZ2h0bW9zdENvbnRleHQiLCJsYXN0U2VtYW50aWNNYXBwaW5nIiwidGVjaG5pY2FsUGF0aCIsInRhcmdldFBhdGgiLCJuZXdQYXRoIiwib2xkUGF0aCIsImNhbmNlbERvY3VtZW50IiwiY2FuY2VsQnV0dG9uIiwiY29udHJvbCIsImJlZm9yZUNhbmNlbENhbGxCYWNrIiwiY2FuY2VsUmVzdWx0IiwiRGlzY2FyZCIsInNraXBCYWNrTmF2aWdhdGlvbiIsIm5hdmlnYXRlQmFja0Zyb21Db250ZXh0Iiwib0FjdGl2ZURvY3VtZW50Q29udGV4dCIsIl9mZXRjaFNlbWFudGljS2V5VmFsdWVzIiwic2tpcEJpbmRpbmdUb1ZpZXciLCJkZWxldGVEb2N1bWVudCIsImJGaW5kQWN0aXZlQ29udGV4dHMiLCJfZGVsZXRlRG9jdW1lbnRUcmFuc2FjdGlvbiIsIkRlbGV0ZSIsImdldFNoZWxsU2VydmljZXMiLCJzZXRCYWNrTmF2aWdhdGlvbiIsIkRlZXBsaW5rIiwiZXhpdEZyb21BcHAiLCJhcHBseURvY3VtZW50IiwiaW52b2tlQWN0aW9uIiwic0FjdGlvbk5hbWUiLCJtRXh0cmFQYXJhbXMiLCJvQ29udHJvbCIsImFQYXJ0cyIsInNPdmVybG9hZEVudGl0eVR5cGUiLCJvQ3VycmVudEFjdGlvbkNhbGxCYWNrcyIsIm9WaWV3IiwiQXJyYXkiLCJpc0FycmF5IiwiY29udGV4dHMiLCJpc05hdmlnYWJsZSIsInJlcXVpcmVzTmF2aWdhdGlvbiIsImNvbnRyb2xJZCIsImludGVybmFsTW9kZWxDb250ZXh0IiwiaW5kZXhPZiIsInNwbGl0IiwicmVwbGFjZUFsbCIsImJTdGF0aWNBY3Rpb24iLCJpc1RhYmxlQm91bmQiLCJzQmluZGluZ1BhdGgiLCJwYXRoIiwiX2dldEFjdGlvbk92ZXJsb2FkQ29udGV4dEZyb21NZXRhZGF0YVBhdGgiLCJlbmFibGVBdXRvU2Nyb2xsIiwiX2NyZWF0ZUFjdGlvblByb21pc2UiLCJzSWQiLCJiR2V0Qm91bmRDb250ZXh0IiwiX2dldEJvdW5kQ29udGV4dCIsImJPYmplY3RQYWdlIiwiZ2V0Vmlld0RhdGEiLCJjb252ZXJ0ZXJUeXBlIiwiY2FsbEFjdGlvbiIsIm9SZXNwb25zZSIsIkFjdGlvbiIsImFjdGlvbiIsImZSZXNvbHZlciIsIl9nZXRJbnRlcm5hbE1vZGVsIiwidkNvbnRleHQiLCJ2YWx1ZSIsInNDb250ZXh0TWV0YVBhdGgiLCJfZm5WYWxpZENvbnRleHRzIiwiYXBwbGljYWJsZUNvbnRleHRzIiwiZWxlbWVudCIsIm9BY3Rpb25Db250ZXh0IiwiYXBwbGljYWJsZUNvbnRleHQiLCJzQWN0aW9uQ29udGV4dE1ldGFQYXRoIiwibm9IaXN0b3J5RW50cnkiLCJpbmZvIiwiX3JlZnJlc2hMaXN0SWZSZXF1aXJlZCIsIl9nZXRBY3Rpb25SZXNwb25zZURhdGFBbmRLZXlzIiwiZXJyIiwiZlJlamVjdG9yIiwicmVqZWN0ZWRJdGVtcyIsInNlY3VyZWRFeGVjdXRpb24iLCJmbkZ1bmN0aW9uIiwiYkJ1c3lTZXQiLCJidXN5Iiwic2V0IiwiYkJ1c3lDaGVjayIsImNoZWNrIiwiYlVwZGF0ZXNEb2N1bWVudCIsInVwZGF0ZXNEb2N1bWVudCIsImZpbmFsbHkiLCJoYW5kbGVQYXRjaFNlbnQiLCJvRXZlbnQiLCJvUGF0Y2hQcm9taXNlIiwiZ2V0U291cmNlIiwicGF0Y2hDb21wbGV0ZWRFdmVudCIsIkFjdGlvblJ1bnRpbWUiLCJzZXRBY3Rpb25FbmFibGVtZW50QWZ0ZXJQYXRjaCIsImJTdWNjZXNzIiwiZ2V0UGFyYW1ldGVyIiwiaGFuZGxlQ3JlYXRlQWN0aXZhdGUiLCJvQmluZGluZyIsImJBdEVuZCIsImJJbmFjdGl2ZSIsIm9QYXJhbXMiLCJpbmFjdGl2ZSIsInNFZGl0TW9kZSIsImJDcmVhdGlvbk1vZGUiLCJzZXRFZGl0TW9kZSIsInNEcmFmdFN0YXRlIiwic2V0RHJhZnRTdGF0dXMiLCJnZXRSb3V0aW5nTGlzdGVuZXIiLCJnZXRHbG9iYWxVSU1vZGVsIiwidlRhc2siLCJzeW5jVGFzayIsImdldFByb2dyYW1taW5nTW9kZWwiLCJkZWxldGVEb2N1bWVudFRyYW5zYWN0aW9uIiwiaGFuZGxlQ3JlYXRlRXZlbnRzIiwiZ2V0VHJhbnNhY3Rpb25IZWxwZXIiLCJnZXRJbnRlcm5hbE1vZGVsIiwiZ2V0Um9vdFZpZXdDb250cm9sbGVyIiwiZ2V0Um91dGluZ1NlcnZpY2UiLCJnZXRMYXN0U2VtYW50aWNNYXBwaW5nIiwic0NvbnRyb2xJZCIsImNyZWF0ZUFjdGlvblByb21pc2UiLCJfZ2V0Q3VycmVudEFjdGlvblByb21pc2UiLCJnZXRDdXJyZW50QWN0aW9uUHJvbWlzZSIsIl9kZWxldGVDdXJyZW50QWN0aW9uUHJvbWlzZSIsImRlbGV0ZUN1cnJlbnRBY3Rpb25Qcm9taXNlIiwiZ2V0TWVzc2FnZUhhbmRsZXIiLCJyZWxhdGVkQ29udGV4dHMiLCJjb250ZW50IiwibWFwIiwic2VuZCIsInRyaWdnZXJUeXBlIiwidHJpZ2dlckNvbmZpZ3VyZWRTdXJ2ZXkiLCJnZXRBY3Rpb25SZXNwb25zZURhdGFBbmRLZXlzIiwic3VibWl0QmF0Y2giLCJvUmVxdWVzdG9yIiwid2FpdEZvclJ1bm5pbmdDaGFuZ2VSZXF1ZXN0cyIsImhhc1BlbmRpbmdDaGFuZ2VzIiwiaGFuZGxlU3RpY2t5T24iLCJfaGFuZGxlU3RpY2t5T2ZmIiwiaGFuZGxlU3RpY2t5T2ZmIiwiX29uQmFja05hdmlnYXRpb25JblNlc3Npb24iLCJvbkJhY2tOYXZpZ2F0aW9uSW5TZXNzaW9uIiwiX2Rpc2NhcmRTdGlja3lTZXNzaW9uIiwiZGlzY2FyZFN0aWNreVNlc3Npb24iLCJpbnRlcm5hbE1vZGVsIiwiZ2V0SHR0cEhlYWRlcnMiLCJiUmVjcmVhdGVDb250ZXh0IiwiY2hlY2tOb0hhc2hDaGFuZ2UiLCJiUGVyc2lzdE9QU2Nyb2xsIiwic2hvd1BsYWNlaG9sZGVyIiwia2VlcEN1cnJlbnRMYXlvdXQiLCJ2aWV3IiwicGFyYW1zIiwidmlld0xldmVsIiwiYlJlZnJlc2hBZnRlckFjdGlvbiIsInNWaWV3SWQiLCJnZXRJZCIsImFNZXNzYWdlcyIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImkiLCJ2YWxpZGF0aW9uIiwiZ2V0Q29udHJvbElkIiwib0RhdGEiLCJhS2V5cyIsIm9DdXJyZW50RGF0YSIsImJSZXR1cm5lZENvbnRleHRJc1NhbWUiLCJldmVyeSIsInNLZXkiLCJpc1Jvb3QiLCJyZWZyZXNoIiwicmVxdWVzdFNpZGVFZmZlY3RzIiwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJnZXRDb250ZXh0IiwiYVJlcXVlc3RQcm9taXNlcyIsIm9LZXkiLCJyZXF1ZXN0T2JqZWN0IiwiJFByb3BlcnR5UGF0aCIsInJvb3RDb250ZXh0IiwibGlzdEJpbmRpbmciLCJvdmVybG9hZEVudGl0eVR5cGUiLCJtZXRhTW9kZWwiLCJjb250ZXh0U2VnbWVudHMiLCJjdXJyZW50Q29udGV4dCIsInVuc2hpZnQiLCJwYXJlbnRDb250ZXh0cyIsInBhdGhTZWdtZW50IiwiYmluZENvbnRleHQiLCJnZXRCb3VuZENvbnRleHQiLCJyZXZlcnNlIiwib3ZlcmxvYWRDb250ZXh0IiwiZmluZCIsInBhcmVudENvbnRleHQiLCJuZXdDb250ZXh0IiwibWFwcGluZ3MiLCJzZXRQYXRoTWFwcGluZyIsInJvb3RDdXJyZW50Q29udGV4dCIsInJpZ2h0bW9zdEN1cnJlbnRDb250ZXh0IiwiZG9Ob3RDb21wdXRlSWZSb290Iiwic3RhcnRzV2l0aCIsImRyYWZ0IiwiY29tcHV0ZVNpYmxpbmdJbmZvcm1hdGlvbiIsIkNvbnRyb2xsZXJFeHRlbnNpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkVkaXRGbG93LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IEJ1c3lMb2NrZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0J1c3lMb2NrZXJcIjtcbmltcG9ydCB7IHNlbmQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvY29sbGFib3JhdGlvbi9BY3Rpdml0eVN5bmNcIjtcbmltcG9ydCB7IEFjdGl2aXR5LCBzaGFyZU9iamVjdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9jb2xsYWJvcmF0aW9uL0NvbGxhYm9yYXRpb25Db21tb25cIjtcbmltcG9ydCB0eXBlIHsgU2libGluZ0luZm9ybWF0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L2RyYWZ0XCI7XG5pbXBvcnQgZHJhZnQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L2RyYWZ0XCI7XG5pbXBvcnQgeyBkZWZpbmVVSTVDbGFzcywgZXh0ZW5zaWJsZSwgZmluYWxFeHRlbnNpb24sIHB1YmxpY0V4dGVuc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IEVkaXRTdGF0ZSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9FZGl0U3RhdGVcIjtcbmltcG9ydCB0eXBlIHsgSW50ZXJuYWxNb2RlbENvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgU2VtYW50aWNLZXlIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU2VtYW50aWNLZXlIZWxwZXJcIjtcbmltcG9ydCBGRUxpYnJhcnkgZnJvbSBcInNhcC9mZS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCB0eXBlIFBhZ2VDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvY29yZS9QYWdlQ29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBTZW1hbnRpY01hcHBpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvUm91dGluZ1NlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgeyBTdGFuZGFyZEFjdGlvbnMsIHRyaWdnZXJDb25maWd1cmVkU3VydmV5LCBUcmlnZ2VyVHlwZSB9IGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL0ZlZWRiYWNrXCI7XG5pbXBvcnQgdHlwZSBDb250cm9sIGZyb20gXCJzYXAvdWkvY29yZS9Db250cm9sXCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IGNvcmVMaWJyYXJ5IGZyb20gXCJzYXAvdWkvY29yZS9saWJyYXJ5XCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwic2FwL3VpL2NvcmUvbWVzc2FnZS9NZXNzYWdlXCI7XG5pbXBvcnQgQ29udHJvbGxlckV4dGVuc2lvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL0NvbnRyb2xsZXJFeHRlbnNpb25cIjtcbmltcG9ydCBPdmVycmlkZUV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL092ZXJyaWRlRXhlY3V0aW9uXCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL3VpL21kYy9UYWJsZVwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L0NvbnRleHRcIjtcbmltcG9ydCBPRGF0YUxpc3RCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFMaXN0QmluZGluZ1wiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTW9kZWxcIjtcbmltcG9ydCB0eXBlIHsgVjRDb250ZXh0IH0gZnJvbSBcInR5cGVzL2V4dGVuc2lvbl90eXBlc1wiO1xuaW1wb3J0IEFjdGlvblJ1bnRpbWUgZnJvbSBcIi4uL0FjdGlvblJ1bnRpbWVcIjtcblxuY29uc3QgQ3JlYXRpb25Nb2RlID0gRkVMaWJyYXJ5LkNyZWF0aW9uTW9kZSxcblx0UHJvZ3JhbW1pbmdNb2RlbCA9IEZFTGlicmFyeS5Qcm9ncmFtbWluZ01vZGVsLFxuXHRDb25zdGFudHMgPSBGRUxpYnJhcnkuQ29uc3RhbnRzLFxuXHREcmFmdFN0YXR1cyA9IEZFTGlicmFyeS5EcmFmdFN0YXR1cyxcblx0RWRpdE1vZGUgPSBGRUxpYnJhcnkuRWRpdE1vZGUsXG5cdFN0YXJ0dXBNb2RlID0gRkVMaWJyYXJ5LlN0YXJ0dXBNb2RlLFxuXHRNZXNzYWdlVHlwZSA9IGNvcmVMaWJyYXJ5Lk1lc3NhZ2VUeXBlO1xuXG4vKipcbiAqIEEgY29udHJvbGxlciBleHRlbnNpb24gb2ZmZXJpbmcgaG9va3MgaW50byB0aGUgZWRpdCBmbG93IG9mIHRoZSBhcHBsaWNhdGlvblxuICpcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzaW5jZSAxLjkwLjBcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3dcIilcbmNsYXNzIEVkaXRGbG93IGV4dGVuZHMgQ29udHJvbGxlckV4dGVuc2lvbiB7XG5cdHByb3RlY3RlZCBiYXNlITogUGFnZUNvbnRyb2xsZXI7XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0Ly8gUHVibGljIG1ldGhvZHNcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRwcml2YXRlIGZuRGlydHlTdGF0ZVByb3ZpZGVyPzogRnVuY3Rpb247XG5cdHByaXZhdGUgZm5IYW5kbGVTZXNzaW9uVGltZW91dD86IEZ1bmN0aW9uO1xuXHRwcml2YXRlIG1QYXRjaFByb21pc2VzPzogYW55O1xuXHRwcml2YXRlIF9mblN0aWNreURpc2NhcmRBZnRlck5hdmlnYXRpb24/OiBGdW5jdGlvbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGRyYWZ0IGRvY3VtZW50IGZvciBhbiBleGlzdGluZyBhY3RpdmUgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBvZiB0aGUgYWN0aXZlIGRvY3VtZW50XG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZXMgb25jZSB0aGUgZWRpdGFibGUgZG9jdW1lbnQgaXMgYXZhaWxhYmxlXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNlZGl0RG9jdW1lbnRcblx0ICogQHB1YmxpY1xuXHQgKiBAc2luY2UgMS45MC4wXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXN5bmMgZWRpdERvY3VtZW50KG9Db250ZXh0OiBWNENvbnRleHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBiRHJhZnROYXZpZ2F0aW9uID0gdHJ1ZTtcblx0XHRjb25zdCB0cmFuc2FjdGlvbkhlbHBlciA9IHRoaXMuX2dldFRyYW5zYWN0aW9uSGVscGVyKCk7XG5cdFx0Y29uc3Qgb1Jvb3RWaWV3Q29udHJvbGxlciA9IHRoaXMuX2dldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIGFueTtcblx0XHRjb25zdCBtb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCk7XG5cdFx0bGV0IHJpZ2h0bW9zdENvbnRleHQ7XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRoaXMuYmFzZS5lZGl0Rmxvdy5vbkJlZm9yZUVkaXQoeyBjb250ZXh0OiBvQ29udGV4dCB9KTtcblx0XHRcdGNvbnN0IG9OZXdEb2N1bWVudENvbnRleHQgPSBhd2FpdCB0cmFuc2FjdGlvbkhlbHBlci5lZGl0RG9jdW1lbnQob0NvbnRleHQsIHRoaXMuZ2V0VmlldygpLCB0aGlzLl9nZXRNZXNzYWdlSGFuZGxlcigpKTtcblxuXHRcdFx0Y29uc3Qgc1Byb2dyYW1taW5nTW9kZWwgPSB0aGlzLl9nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KTtcblxuXHRcdFx0dGhpcy5fc2V0U3RpY2t5U2Vzc2lvbkludGVybmFsUHJvcGVydGllcyhzUHJvZ3JhbW1pbmdNb2RlbCwgbW9kZWwpO1xuXG5cdFx0XHRpZiAob05ld0RvY3VtZW50Q29udGV4dCkge1xuXHRcdFx0XHR0aGlzLl9zZXRFZGl0TW9kZShFZGl0TW9kZS5FZGl0YWJsZSwgZmFsc2UpO1xuXHRcdFx0XHR0aGlzLl9nZXRNZXNzYWdlSGFuZGxlcigpLnNob3dNZXNzYWdlRGlhbG9nKCk7XG5cblx0XHRcdFx0aWYgKG9OZXdEb2N1bWVudENvbnRleHQgIT09IG9Db250ZXh0KSB7XG5cdFx0XHRcdFx0bGV0IGNvbnRleHRUb05hdmlnYXRlID0gb05ld0RvY3VtZW50Q29udGV4dDtcblx0XHRcdFx0XHRpZiAodGhpcy5faXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdFx0XHRcdHJpZ2h0bW9zdENvbnRleHQgPSBvUm9vdFZpZXdDb250cm9sbGVyLmdldFJpZ2h0bW9zdENvbnRleHQoKTtcblx0XHRcdFx0XHRcdGxldCBzaWJsaW5nSW5mbyA9IGF3YWl0IHRoaXMuX2NvbXB1dGVTaWJsaW5nSW5mb3JtYXRpb24ob0NvbnRleHQsIHJpZ2h0bW9zdENvbnRleHQsIHNQcm9ncmFtbWluZ01vZGVsLCB0cnVlKTtcblx0XHRcdFx0XHRcdHNpYmxpbmdJbmZvID0gc2libGluZ0luZm8gPz8gdGhpcy5fY3JlYXRlU2libGluZ0luZm8ob0NvbnRleHQsIG9OZXdEb2N1bWVudENvbnRleHQpO1xuXHRcdFx0XHRcdFx0dGhpcy5fdXBkYXRlUGF0aHNJbkhpc3Rvcnkoc2libGluZ0luZm8ucGF0aE1hcHBpbmcpO1xuXHRcdFx0XHRcdFx0aWYgKHNpYmxpbmdJbmZvLnRhcmdldENvbnRleHQuZ2V0UGF0aCgpICE9IG9OZXdEb2N1bWVudENvbnRleHQuZ2V0UGF0aCgpKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRleHRUb05hdmlnYXRlID0gc2libGluZ0luZm8udGFyZ2V0Q29udGV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhd2FpdCB0aGlzLl9oYW5kbGVOZXdDb250ZXh0KGNvbnRleHRUb05hdmlnYXRlLCB0cnVlLCBmYWxzZSwgYkRyYWZ0TmF2aWdhdGlvbiwgdHJ1ZSk7XG5cdFx0XHRcdFx0aWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLlN0aWNreSkge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIHN0aWNreU9uIGhhbmRsZXIgbXVzdCBiZSBzZXQgYWZ0ZXIgdGhlIG5hdmlnYXRpb24gaGFzIGJlZW4gZG9uZSxcblx0XHRcdFx0XHRcdC8vIGFzIHRoZSBVUkwgbWF5IGNoYW5nZSBpbiB0aGUgY2FzZSBvZiBGQ0xcblx0XHRcdFx0XHRcdHRoaXMuX2hhbmRsZVN0aWNreU9uKG9OZXdEb2N1bWVudENvbnRleHQpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoTW9kZWxIZWxwZXIuaXNDb2xsYWJvcmF0aW9uRHJhZnRTdXBwb3J0ZWQobW9kZWwuZ2V0TWV0YU1vZGVsKCkpKSB7XG5cdFx0XHRcdFx0XHQvLyBhY2NvcmRpbmcgdG8gVVggaW4gY2FzZSBvZiBlbmFibGVkIGNvbGxhYm9yYXRpb24gZHJhZnQgd2Ugc2hhcmUgdGhlIG9iamVjdCBpbW1lZGlhdGVseVxuXHRcdFx0XHRcdFx0YXdhaXQgc2hhcmVPYmplY3Qob05ld0RvY3VtZW50Q29udGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAob0Vycm9yKSB7XG5cdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBlZGl0aW5nIHRoZSBkb2N1bWVudFwiLCBvRXJyb3IgYXMgYW55KTtcblx0XHR9XG5cdH1cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGRlbGV0ZU11bHRpcGxlRG9jdW1lbnRzKGFDb250ZXh0czogYW55LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdFx0aWYgKG1QYXJhbWV0ZXJzKSB7XG5cdFx0XHRtUGFyYW1ldGVycy5iZWZvcmVEZWxldGVDYWxsQmFjayA9IHRoaXMuYmFzZS5lZGl0Rmxvdy5vbkJlZm9yZURlbGV0ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bVBhcmFtZXRlcnMgPSB7XG5cdFx0XHRcdGJlZm9yZURlbGV0ZUNhbGxCYWNrOiB0aGlzLmJhc2UuZWRpdEZsb3cub25CZWZvcmVEZWxldGVcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5kZWxldGVNdWx0aXBsZURvY3VtZW50cyhhQ29udGV4dHMsIG1QYXJhbWV0ZXJzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBkcmFmdCBzdGF0dXMgYW5kIGRpc3BsYXlzIHRoZSBlcnJvciBtZXNzYWdlcyBpZiB0aGVyZSBhcmUgZXJyb3JzIGR1cmluZyBhbiB1cGRhdGUuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBvZiB0aGUgdXBkYXRlZCBmaWVsZFxuXHQgKiBAcGFyYW0gb1Byb21pc2UgUHJvbWlzZSB0byBkZXRlcm1pbmUgd2hlbiB0aGUgdXBkYXRlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWQuIFRoZSBwcm9taXNlIHNob3VsZCBiZSByZXNvbHZlZCB3aGVuIHRoZSB1cGRhdGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZCwgc28gdGhlIGRyYWZ0IHN0YXR1cyBjYW4gYmUgdXBkYXRlZC5cblx0ICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlcyBvbmNlIGRyYWZ0IHN0YXR1cyBoYXMgYmVlbiB1cGRhdGVkXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyN1cGRhdGVEb2N1bWVudFxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjkwLjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHR1cGRhdGVEb2N1bWVudChvQ29udGV4dDogb2JqZWN0LCBvUHJvbWlzZTogUHJvbWlzZTxhbnk+KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25IZWxwZXIgPSB0aGlzLl9nZXRUcmFuc2FjdGlvbkhlbHBlcigpO1xuXHRcdGNvbnN0IG9yaWdpbmFsQmluZGluZ0NvbnRleHQgPSB0aGlzLmdldFZpZXcoKS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGNvbnN0IGJJc0RyYWZ0ID0gdGhpcy5fZ2V0UHJvZ3JhbW1pbmdNb2RlbChvQ29udGV4dCkgPT09IFByb2dyYW1taW5nTW9kZWwuRHJhZnQ7XG5cblx0XHR0aGlzLl9nZXRNZXNzYWdlSGFuZGxlcigpLnJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcygpO1xuXHRcdHJldHVybiB0aGlzLl9zeW5jVGFzayhhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAob3JpZ2luYWxCaW5kaW5nQ29udGV4dCkge1xuXHRcdFx0XHR0cmFuc2FjdGlvbkhlbHBlci5oYW5kbGVEb2N1bWVudE1vZGlmaWNhdGlvbnMoKTtcblx0XHRcdFx0aWYgKCF0aGlzLl9pc0ZjbEVuYWJsZWQoKSkge1xuXHRcdFx0XHRcdEVkaXRTdGF0ZS5zZXRFZGl0U3RhdGVEaXJ0eSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGJJc0RyYWZ0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc2V0RHJhZnRTdGF0dXMoRHJhZnRTdGF0dXMuU2F2aW5nKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBvUHJvbWlzZTtcblx0XHRcdFx0Ly8gSWYgYSBuYXZpZ2F0aW9uIGhhcHBlbmVkIHdoaWxlIG9Qcm9taXNlIHdhcyBiZWluZyByZXNvbHZlZCwgdGhlIGJpbmRpbmcgY29udGV4dCBvZiB0aGUgcGFnZSBjaGFuZ2VkXG5cdFx0XHRcdC8vIEluIHRoYXQgY2FzZSwgd2Ugc2hvdWxkbid0IGRvIGFueXRoaW5nXG5cdFx0XHRcdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0XHRcdGlmIChiSXNEcmFmdCAmJiBvQmluZGluZ0NvbnRleHQgJiYgb0JpbmRpbmdDb250ZXh0ID09PSBvcmlnaW5hbEJpbmRpbmdDb250ZXh0KSB7XG5cdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9CaW5kaW5nQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0c0VudGl0eVNldE5hbWUgPSAob01ldGFNb2RlbCBhcyBhbnkpLmdldE1ldGFDb250ZXh0KG9CaW5kaW5nQ29udGV4dC5nZXRQYXRoKCkpLmdldE9iamVjdChcIkBzYXB1aS5uYW1lXCIpLFxuXHRcdFx0XHRcdFx0YVNlbWFudGljS2V5cyA9IFNlbWFudGljS2V5SGVscGVyLmdldFNlbWFudGljS2V5cyhvTWV0YU1vZGVsLCBzRW50aXR5U2V0TmFtZSk7XG5cdFx0XHRcdFx0aWYgKGFTZW1hbnRpY0tleXMgJiYgYVNlbWFudGljS2V5cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9DdXJyZW50U2VtYW50aWNNYXBwaW5nID0gdGhpcy5fZ2V0U2VtYW50aWNNYXBwaW5nKCksXG5cdFx0XHRcdFx0XHRcdHNDdXJyZW50U2VtYW50aWNQYXRoID0gb0N1cnJlbnRTZW1hbnRpY01hcHBpbmcgJiYgb0N1cnJlbnRTZW1hbnRpY01hcHBpbmcuc2VtYW50aWNQYXRoLFxuXHRcdFx0XHRcdFx0XHRzQ2hhbmdlZFBhdGggPSBTZW1hbnRpY0tleUhlbHBlci5nZXRTZW1hbnRpY1BhdGgob0JpbmRpbmdDb250ZXh0LCB0cnVlKTtcblx0XHRcdFx0XHRcdC8vIHNDdXJyZW50U2VtYW50aWNQYXRoIGNvdWxkIGJlIG51bGwgaWYgd2UgaGF2ZSBuYXZpZ2F0ZWQgdmlhIGRlZXAgbGluayB0aGVuIHRoZXJlIGFyZSBubyBzZW1hbnRpY01hcHBpbmdzIHRvIGNhbGN1bGF0ZSBpdCBmcm9tXG5cdFx0XHRcdFx0XHRpZiAoc0N1cnJlbnRTZW1hbnRpY1BhdGggJiYgc0N1cnJlbnRTZW1hbnRpY1BhdGggIT09IHNDaGFuZ2VkUGF0aCkge1xuXHRcdFx0XHRcdFx0XHRhd2FpdCB0aGlzLl9oYW5kbGVOZXdDb250ZXh0KG9CaW5kaW5nQ29udGV4dCBhcyBDb250ZXh0LCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3NldERyYWZ0U3RhdHVzKERyYWZ0U3RhdHVzLlNhdmVkKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3NldERyYWZ0U3RhdHVzKERyYWZ0U3RhdHVzLlNhdmVkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fc2V0RHJhZnRTdGF0dXMoRHJhZnRTdGF0dXMuU2F2ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgdGhlIGRvY3VtZW50XCIsIG9FcnJvcik7XG5cdFx0XHRcdGlmIChiSXNEcmFmdCAmJiBvcmlnaW5hbEJpbmRpbmdDb250ZXh0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc2V0RHJhZnRTdGF0dXMoRHJhZnRTdGF0dXMuQ2xlYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRhd2FpdCB0aGlzLl9nZXRNZXNzYWdlSGFuZGxlcigpLnNob3dNZXNzYWdlcygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gSW50ZXJuYWwgb25seSBwYXJhbXMgLS0tXG5cdC8vICogQHBhcmFtIHtzdHJpbmd9IG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSBUaGUgY3JlYXRpb24gbW9kZSB1c2luZyBvbmUgb2YgdGhlIGZvbGxvd2luZzpcblx0Ly8gKiAgICAgICAgICAgICAgICAgICAgU3luYyAtIHRoZSBjcmVhdGlvbiBpcyB0cmlnZ2VyZWQgYW5kIG9uY2UgdGhlIGRvY3VtZW50IGlzIGNyZWF0ZWQsIHRoZSBuYXZpZ2F0aW9uIGlzIGRvbmVcblx0Ly8gKiAgICAgICAgICAgICAgICAgICAgQXN5bmMgLSB0aGUgY3JlYXRpb24gYW5kIHRoZSBuYXZpZ2F0aW9uIHRvIHRoZSBpbnN0YW5jZSBhcmUgZG9uZSBpbiBwYXJhbGxlbFxuXHQvLyAqICAgICAgICAgICAgICAgICAgICBEZWZlcnJlZCAtIHRoZSBjcmVhdGlvbiBpcyBkb25lIG9uIHRoZSB0YXJnZXQgcGFnZVxuXHQvLyAqICAgICAgICAgICAgICAgICAgICBDcmVhdGlvblJvdyAtIFRoZSBjcmVhdGlvbiBpcyBkb25lIGlubGluZSBhc3luYyBzbyB0aGUgdXNlciBpcyBub3QgYmxvY2tlZFxuXHQvLyBtUGFyYW1ldGVycy5jcmVhdGlvblJvdyBJbnN0YW5jZSBvZiB0aGUgY3JlYXRpb24gcm93IC0gKFRPRE86IGdldCByaWQgYnV0IHVzZSBsaXN0IGJpbmRpbmdzIG9ubHkpXG5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGpzZG9jL3JlcXVpcmUtcGFyYW1cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gdkxpc3RCaW5kaW5nICBPRGF0YUxpc3RCaW5kaW5nIG9iamVjdCBvciB0aGUgYmluZGluZyBwYXRoIGZvciBhIHRlbXBvcmFyeSBsaXN0IGJpbmRpbmdcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMgQ29udGFpbnMgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy5jcmVhdGlvbk1vZGUgVGhlIGNyZWF0aW9uIG1vZGUgdXNpbmcgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG5cdCAqICAgICAgICAgICAgICAgICAgICBOZXdQYWdlIC0gdGhlIGNyZWF0ZWQgZG9jdW1lbnQgaXMgc2hvd24gaW4gYSBuZXcgcGFnZSwgZGVwZW5kaW5nIG9uIHdoZXRoZXIgbWV0YWRhdGEgJ1N5bmMnLCAnQXN5bmMnIG9yICdEZWZlcnJlZCcgaXMgdXNlZFxuXHQgKiAgICAgICAgICAgICAgICAgICAgSW5saW5lIC0gVGhlIGNyZWF0aW9uIGlzIGRvbmUgaW5saW5lIChpbiBhIHRhYmxlKVxuXHQgKiAgICAgICAgICAgICAgICAgICAgRXh0ZXJuYWwgLSBUaGUgY3JlYXRpb24gaXMgZG9uZSBpbiBhIGRpZmZlcmVudCBhcHBsaWNhdGlvbiBzcGVjaWZpZWQgdmlhIHRoZSBwYXJhbWV0ZXIgJ291dGJvdW5kJ1xuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy5vdXRib3VuZCBUaGUgbmF2aWdhdGlvbiB0YXJnZXQgd2hlcmUgdGhlIGRvY3VtZW50IGlzIGNyZWF0ZWQgaW4gY2FzZSBvZiBjcmVhdGlvbk1vZGUgJ0V4dGVybmFsJ1xuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy5jcmVhdGVBdEVuZCBTcGVjaWZpZXMgaWYgdGhlIG5ldyBlbnRyeSBzaG91bGQgYmUgY3JlYXRlZCBhdCB0aGUgdG9wIG9yIGJvdHRvbSBvZiBhIHRhYmxlIGluIGNhc2Ugb2YgY3JlYXRpb25Nb2RlICdJbmxpbmUnXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZXMgb25jZSB0aGUgb2JqZWN0IGhhcyBiZWVuIGNyZWF0ZWRcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93I2NyZWF0ZURvY3VtZW50XG5cdCAqIEBwdWJsaWNcblx0ICogQHNpbmNlIDEuOTAuMFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGFzeW5jIGNyZWF0ZURvY3VtZW50KFxuXHRcdHZMaXN0QmluZGluZzogT0RhdGFMaXN0QmluZGluZyB8IHN0cmluZyxcblx0XHRtSW5QYXJhbWV0ZXJzOiB7XG5cdFx0XHRjcmVhdGlvbk1vZGU6IHN0cmluZztcblx0XHRcdG91dGJvdW5kPzogc3RyaW5nO1xuXHRcdFx0Y3JlYXRlQXRFbmQ/OiBib29sZWFuO1xuXHRcdH1cblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25IZWxwZXIgPSB0aGlzLl9nZXRUcmFuc2FjdGlvbkhlbHBlcigpLFxuXHRcdFx0b0xvY2tPYmplY3QgPSB0aGlzLl9nZXRHbG9iYWxVSU1vZGVsKCk7XG5cdFx0bGV0IG9UYWJsZTogYW55OyAvL3Nob3VsZCBiZSBUYWJsZSBidXQgdGhlcmUgYXJlIG1pc3NpbmcgbWV0aG9kcyBpbnRvIHRoZSBkZWZcblx0XHRsZXQgbVBhcmFtZXRlcnM6IGFueSA9IG1JblBhcmFtZXRlcnM7XG5cdFx0Y29uc3Qgb1Jlc291cmNlQnVuZGxlID0gdGhpcy5fZ2V0UmVzb3VyY2VCdW5kbGUoKTtcblx0XHRjb25zdCBiU2hvdWxkQnVzeUxvY2sgPVxuXHRcdFx0IW1QYXJhbWV0ZXJzIHx8XG5cdFx0XHQobVBhcmFtZXRlcnMuY3JlYXRpb25Nb2RlICE9PSBDcmVhdGlvbk1vZGUuSW5saW5lICYmXG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSAhPT0gQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93ICYmXG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSAhPT0gQ3JlYXRpb25Nb2RlLkV4dGVybmFsKTtcblx0XHRsZXQgb0V4ZWNDdXN0b21WYWxpZGF0aW9uID0gUHJvbWlzZS5yZXNvbHZlKFtdKTtcblx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuZ2V0VmlldygpKTtcblx0XHRvQXBwQ29tcG9uZW50LmdldFJvdXRlclByb3h5KCkucmVtb3ZlSUFwcFN0YXRlS2V5KCk7XG5cblx0XHRpZiAobVBhcmFtZXRlcnMuY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuRXh0ZXJuYWwpIHtcblx0XHRcdC8vIENyZWF0ZSBieSBuYXZpZ2F0aW5nIHRvIGFuIGV4dGVybmFsIHRhcmdldFxuXHRcdFx0Ly8gVE9ETzogQ2FsbCBhcHByb3ByaWF0ZSBmdW5jdGlvbiAoY3VycmVudGx5IHVzaW5nIHRoZSBzYW1lIGFzIGZvciBvdXRib3VuZCBjaGV2cm9uIG5hdiwgYW5kIHdpdGhvdXQgYW55IGNvbnRleHQgLSAzcmQgcGFyYW0pXG5cdFx0XHRhd2FpdCB0aGlzLl9zeW5jVGFzaygpO1xuXHRcdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSB0aGlzLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCk7XG5cdFx0XHRjb25zdCBzQ3JlYXRlUGF0aCA9IE1vZGVsSGVscGVyLmdldEFic29sdXRlTWV0YVBhdGhGb3JMaXN0QmluZGluZyh0aGlzLmdldFZpZXcoKSwgdkxpc3RCaW5kaW5nKTtcblxuXHRcdFx0KG9Db250cm9sbGVyIGFzIGFueSkuaGFuZGxlcnMub25DaGV2cm9uUHJlc3NOYXZpZ2F0ZU91dEJvdW5kKG9Db250cm9sbGVyLCBtUGFyYW1ldGVycy5vdXRib3VuZCwgdW5kZWZpbmVkLCBzQ3JlYXRlUGF0aCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAobVBhcmFtZXRlcnMuY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cgJiYgbVBhcmFtZXRlcnMuY3JlYXRpb25Sb3cpIHtcblx0XHRcdGNvbnN0IG9DcmVhdGlvblJvd09iamVjdHMgPSBtUGFyYW1ldGVycy5jcmVhdGlvblJvdy5nZXRCaW5kaW5nQ29udGV4dCgpLmdldE9iamVjdCgpO1xuXHRcdFx0ZGVsZXRlIG9DcmVhdGlvblJvd09iamVjdHNbXCJAJHVpNS5jb250ZXh0LmlzVHJhbnNpZW50XCJdO1xuXHRcdFx0b1RhYmxlID0gbVBhcmFtZXRlcnMuY3JlYXRpb25Sb3cuZ2V0UGFyZW50KCk7XG5cdFx0XHRvRXhlY0N1c3RvbVZhbGlkYXRpb24gPSB0cmFuc2FjdGlvbkhlbHBlci52YWxpZGF0ZURvY3VtZW50KFxuXHRcdFx0XHRvVGFibGUuZ2V0QmluZGluZ0NvbnRleHQoKSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRhdGE6IG9DcmVhdGlvblJvd09iamVjdHMsXG5cdFx0XHRcdFx0Y3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uOiBvVGFibGUuZ2V0Q3JlYXRpb25Sb3coKS5kYXRhKFwiY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uXCIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRoaXMuYmFzZS5nZXRWaWV3KClcblx0XHRcdCk7XG5cblx0XHRcdC8vIGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEgaXMgc2V0IHRvIGZhbHNlIGluIG1hbmlmZXN0IGNvbnZlcnRlciAoVGFibGUudHMpIGlmIGN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbiBleGlzdHNcblx0XHRcdGlmIChvVGFibGUuZ2V0Q3JlYXRpb25Sb3coKS5kYXRhKFwiZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YVwiKSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImNyZWF0aW9uUm93RmllbGRWYWxpZGl0eVwiLCB7fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLklubGluZSAmJiBtUGFyYW1ldGVycy50YWJsZUlkKSB7XG5cdFx0XHRvVGFibGUgPSB0aGlzLmdldFZpZXcoKS5ieUlkKG1QYXJhbWV0ZXJzLnRhYmxlSWQpIGFzIFRhYmxlO1xuXHRcdH1cblxuXHRcdGlmIChvVGFibGUgJiYgb1RhYmxlLmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdGNvbnN0IGZuRm9jdXNPclNjcm9sbCA9XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLklubGluZSA/IG9UYWJsZS5mb2N1c1Jvdy5iaW5kKG9UYWJsZSkgOiBvVGFibGUuc2Nyb2xsVG9JbmRleC5iaW5kKG9UYWJsZSk7XG5cdFx0XHRvVGFibGUuZ2V0Um93QmluZGluZygpLmF0dGFjaEV2ZW50T25jZShcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZuRm9jdXNPclNjcm9sbChtUGFyYW1ldGVycy5jcmVhdGVBdEVuZCA/IG9UYWJsZS5nZXRSb3dCaW5kaW5nKCkuZ2V0TGVuZ3RoKCkgOiAwLCB0cnVlKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGNvbnN0IGhhbmRsZVNpZGVFZmZlY3RzID0gYXN5bmMgKG9MaXN0QmluZGluZzogYW55LCBvQ3JlYXRpb25Qcm9taXNlOiBQcm9taXNlPENvbnRleHQ+KSA9PiB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBvTmV3Q29udGV4dCA9IGF3YWl0IG9DcmVhdGlvblByb21pc2U7XG5cdFx0XHRcdC8vIHRyYW5zaWVudCBjb250ZXh0cyBhcmUgcmVsaWFibHkgcmVtb3ZlZCBvbmNlIG9OZXdDb250ZXh0LmNyZWF0ZWQoKSBpcyByZXNvbHZlZFxuXHRcdFx0XHRhd2FpdCBvTmV3Q29udGV4dC5jcmVhdGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dDtcblx0XHRcdFx0Ly8gaWYgdGhlcmUgYXJlIHRyYW5zaWVudCBjb250ZXh0cywgd2UgbXVzdCBhdm9pZCByZXF1ZXN0aW5nIHNpZGUgZWZmZWN0c1xuXHRcdFx0XHQvLyB0aGlzIGlzIGF2b2lkIGEgcG90ZW50aWFsIGxpc3QgcmVmcmVzaCwgdGhlcmUgY291bGQgYmUgYSBzaWRlIGVmZmVjdCB0aGF0IHJlZnJlc2hlcyB0aGUgbGlzdCBiaW5kaW5nXG5cdFx0XHRcdC8vIGlmIGxpc3QgYmluZGluZyBpcyByZWZyZXNoZWQsIHRyYW5zaWVudCBjb250ZXh0cyBtaWdodCBiZSBsb3N0XG5cdFx0XHRcdGlmICghQ29tbW9uVXRpbHMuaGFzVHJhbnNpZW50Q29udGV4dChvTGlzdEJpbmRpbmcpKSB7XG5cdFx0XHRcdFx0Y29uc3QgYXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuZ2V0VmlldygpKTtcblx0XHRcdFx0XHRhcHBDb21wb25lbnQuZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlKCkucmVxdWVzdFNpZGVFZmZlY3RzRm9yTmF2aWdhdGlvblByb3BlcnR5KG9MaXN0QmluZGluZy5nZXRQYXRoKCksIG9CaW5kaW5nQ29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGNyZWF0aW5nIHRoZSBkb2N1bWVudFwiLCBvRXJyb3IpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBAcGFyYW0gYVZhbGlkYXRpb25NZXNzYWdlcyBFcnJvciBtZXNzYWdlcyBmcm9tIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9uXG5cdFx0ICovXG5cdFx0Y29uc3QgY3JlYXRlQ3VzdG9tVmFsaWRhdGlvbk1lc3NhZ2VzID0gKGFWYWxpZGF0aW9uTWVzc2FnZXM6IGFueVtdKSA9PiB7XG5cdFx0XHRjb25zdCBzQ3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uID0gb1RhYmxlICYmIG9UYWJsZS5nZXRDcmVhdGlvblJvdygpLmRhdGEoXCJjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb25cIik7XG5cdFx0XHRjb25zdCBtQ3VzdG9tVmFsaWRpdHkgPSBvVGFibGUgJiYgb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik/LmdldFByb3BlcnR5KFwiY3JlYXRpb25Sb3dDdXN0b21WYWxpZGl0eVwiKTtcblx0XHRcdGNvbnN0IG9NZXNzYWdlTWFuYWdlciA9IENvcmUuZ2V0TWVzc2FnZU1hbmFnZXIoKTtcblx0XHRcdGNvbnN0IGFDdXN0b21NZXNzYWdlczogYW55W10gPSBbXTtcblx0XHRcdGxldCBvRmllbGRDb250cm9sO1xuXHRcdFx0bGV0IHNUYXJnZXQ6IHN0cmluZztcblxuXHRcdFx0Ly8gUmVtb3ZlIGV4aXN0aW5nIEN1c3RvbVZhbGlkYXRpb24gbWVzc2FnZVxuXHRcdFx0b01lc3NhZ2VNYW5hZ2VyXG5cdFx0XHRcdC5nZXRNZXNzYWdlTW9kZWwoKVxuXHRcdFx0XHQuZ2V0RGF0YSgpXG5cdFx0XHRcdC5mb3JFYWNoKGZ1bmN0aW9uIChvTWVzc2FnZTogYW55KSB7XG5cdFx0XHRcdFx0aWYgKG9NZXNzYWdlLmNvZGUgPT09IHNDdXN0b21WYWxpZGF0aW9uRnVuY3Rpb24pIHtcblx0XHRcdFx0XHRcdG9NZXNzYWdlTWFuYWdlci5yZW1vdmVNZXNzYWdlcyhvTWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0YVZhbGlkYXRpb25NZXNzYWdlcy5mb3JFYWNoKChvVmFsaWRhdGlvbk1lc3NhZ2U6IGFueSkgPT4ge1xuXHRcdFx0XHQvLyBIYW5kbGUgQm91bmQgQ3VzdG9tVmFsaWRhdGlvbiBtZXNzYWdlXG5cdFx0XHRcdGlmIChvVmFsaWRhdGlvbk1lc3NhZ2UubWVzc2FnZVRhcmdldCkge1xuXHRcdFx0XHRcdG9GaWVsZENvbnRyb2wgPSBDb3JlLmdldENvbnRyb2wobUN1c3RvbVZhbGlkaXR5W29WYWxpZGF0aW9uTWVzc2FnZS5tZXNzYWdlVGFyZ2V0XS5maWVsZElkKSBhcyBDb250cm9sO1xuXHRcdFx0XHRcdHNUYXJnZXQgPSBgJHtvRmllbGRDb250cm9sLmdldEJpbmRpbmdDb250ZXh0KCk/LmdldFBhdGgoKX0vJHtvRmllbGRDb250cm9sLmdldEJpbmRpbmdQYXRoKFwidmFsdWVcIil9YDtcblx0XHRcdFx0XHQvLyBBZGQgdmFsaWRhdGlvbiBtZXNzYWdlIGlmIHN0aWxsIG5vdCBleGlzdHNcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvTWVzc2FnZU1hbmFnZXJcblx0XHRcdFx0XHRcdFx0LmdldE1lc3NhZ2VNb2RlbCgpXG5cdFx0XHRcdFx0XHRcdC5nZXREYXRhKClcblx0XHRcdFx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAob01lc3NhZ2U6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBvTWVzc2FnZS50YXJnZXQgPT09IHNUYXJnZXQ7XG5cdFx0XHRcdFx0XHRcdH0pLmxlbmd0aCA9PT0gMFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0b01lc3NhZ2VNYW5hZ2VyLmFkZE1lc3NhZ2VzKFxuXHRcdFx0XHRcdFx0XHRuZXcgTWVzc2FnZSh7XG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb1ZhbGlkYXRpb25NZXNzYWdlLm1lc3NhZ2VUZXh0LFxuXHRcdFx0XHRcdFx0XHRcdHByb2Nlc3NvcjogdGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoKSxcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBNZXNzYWdlVHlwZS5FcnJvcixcblx0XHRcdFx0XHRcdFx0XHRjb2RlOiBzQ3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHRlY2huaWNhbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0cGVyc2lzdGVudDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0OiBzVGFyZ2V0XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBBZGQgY29udHJvbElkIGluIG9yZGVyIHRvIGdldCB0aGUgZm9jdXMgaGFuZGxpbmcgb2YgdGhlIGVycm9yIHBvcG92ZXIgcnVuYWJsZVxuXHRcdFx0XHRcdGNvbnN0IGFFeGlzdGluZ1ZhbGlkYXRpb25NZXNzYWdlcyA9IG9NZXNzYWdlTWFuYWdlclxuXHRcdFx0XHRcdFx0LmdldE1lc3NhZ2VNb2RlbCgpXG5cdFx0XHRcdFx0XHQuZ2V0RGF0YSgpXG5cdFx0XHRcdFx0XHQuZmlsdGVyKGZ1bmN0aW9uIChvTWVzc2FnZTogYW55KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBvTWVzc2FnZS50YXJnZXQgPT09IHNUYXJnZXQ7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhRXhpc3RpbmdWYWxpZGF0aW9uTWVzc2FnZXNbMF0uYWRkQ29udHJvbElkKG1DdXN0b21WYWxpZGl0eVtvVmFsaWRhdGlvbk1lc3NhZ2UubWVzc2FnZVRhcmdldF0uZmllbGRJZCk7XG5cblx0XHRcdFx0XHQvLyBIYW5kbGUgVW5ib3VuZCBDdXN0b21WYWxpZGF0aW9uIG1lc3NhZ2Vcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhQ3VzdG9tTWVzc2FnZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRjb2RlOiBzQ3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uLFxuXHRcdFx0XHRcdFx0dGV4dDogb1ZhbGlkYXRpb25NZXNzYWdlLm1lc3NhZ2VUZXh0LFxuXHRcdFx0XHRcdFx0cGVyc2lzdGVudDogdHJ1ZSxcblx0XHRcdFx0XHRcdHR5cGU6IE1lc3NhZ2VUeXBlLkVycm9yXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoYUN1c3RvbU1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dGhpcy5fZ2V0TWVzc2FnZUhhbmRsZXIoKS5zaG93TWVzc2FnZURpYWxvZyh7XG5cdFx0XHRcdFx0Y3VzdG9tTWVzc2FnZXM6IGFDdXN0b21NZXNzYWdlc1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3QgcmVzb2x2ZUNyZWF0aW9uTW9kZSA9IChcblx0XHRcdGluaXRpYWxDcmVhdGlvbk1vZGU6IHN0cmluZyxcblx0XHRcdHByb2dyYW1taW5nTW9kZWw6IHN0cmluZyxcblx0XHRcdG9MaXN0QmluZGluZzogT0RhdGFMaXN0QmluZGluZyxcblx0XHRcdG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsXG5cdFx0KTogc3RyaW5nID0+IHtcblx0XHRcdGlmIChpbml0aWFsQ3JlYXRpb25Nb2RlICYmIGluaXRpYWxDcmVhdGlvbk1vZGUgIT09IENyZWF0aW9uTW9kZS5OZXdQYWdlKSB7XG5cdFx0XHRcdC8vIHVzZSB0aGUgcGFzc2VkIGNyZWF0aW9uIG1vZGVcblx0XHRcdFx0cmV0dXJuIGluaXRpYWxDcmVhdGlvbk1vZGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBOZXdBY3Rpb24gaXMgbm90IHlldCBzdXBwb3J0ZWQgZm9yIE5hdmlnYXRpb25Qcm9wZXJ0eSBjb2xsZWN0aW9uXG5cdFx0XHRcdGlmICghb0xpc3RCaW5kaW5nLmlzUmVsYXRpdmUoKSkge1xuXHRcdFx0XHRcdGNvbnN0IHNQYXRoID0gb0xpc3RCaW5kaW5nLmdldFBhdGgoKSxcblx0XHRcdFx0XHRcdC8vIGlmIE5ld0FjdGlvbiB3aXRoIHBhcmFtZXRlcnMgaXMgcHJlc2VudCwgdGhlbiBjcmVhdGlvbiBpcyAnRGVmZXJyZWQnXG5cdFx0XHRcdFx0XHQvLyBpbiB0aGUgYWJzZW5jZSBvZiBOZXdBY3Rpb24gb3IgTmV3QWN0aW9uIHdpdGggcGFyYW1ldGVycywgY3JlYXRpb24gaXMgYXN5bmNcblx0XHRcdFx0XHRcdHNOZXdBY3Rpb24gPVxuXHRcdFx0XHRcdFx0XHRwcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0XG5cdFx0XHRcdFx0XHRcdFx0PyBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzUGF0aH1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdC9OZXdBY3Rpb25gKVxuXHRcdFx0XHRcdFx0XHRcdDogb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c1BhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjEuU3RpY2t5U2Vzc2lvblN1cHBvcnRlZC9OZXdBY3Rpb25gKTtcblx0XHRcdFx0XHRpZiAoc05ld0FjdGlvbikge1xuXHRcdFx0XHRcdFx0Y29uc3QgYVBhcmFtZXRlcnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7c05ld0FjdGlvbn0vQCR1aTUub3ZlcmxvYWQvMC8kUGFyYW1ldGVyYCkgfHwgW107XG5cdFx0XHRcdFx0XHQvLyBiaW5kaW5nIHBhcmFtZXRlciAoZWc6IF9pdCkgaXMgbm90IGNvbnNpZGVyZWRcblx0XHRcdFx0XHRcdGlmIChhUGFyYW1ldGVycy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBDcmVhdGlvbk1vZGUuRGVmZXJyZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHNNZXRhUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob0xpc3RCaW5kaW5nLmdldEhlYWRlckNvbnRleHQoKS5nZXRQYXRoKCkpO1xuXHRcdFx0XHRjb25zdCBhTm9uQ29tcHV0ZWRWaXNpYmxlS2V5RmllbGRzID0gQ29tbW9uVXRpbHMuZ2V0Tm9uQ29tcHV0ZWRWaXNpYmxlRmllbGRzKG9NZXRhTW9kZWwsIHNNZXRhUGF0aCwgdGhpcy5nZXRWaWV3KCkpO1xuXHRcdFx0XHRpZiAoYU5vbkNvbXB1dGVkVmlzaWJsZUtleUZpZWxkcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0aW9uTW9kZS5EZWZlcnJlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRpb25Nb2RlLkFzeW5jO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoYlNob3VsZEJ1c3lMb2NrKSB7XG5cdFx0XHRCdXN5TG9ja2VyLmxvY2sob0xvY2tPYmplY3QpO1xuXHRcdH1cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgYVZhbGlkYXRpb25NZXNzYWdlcyA9IGF3YWl0IHRoaXMuX3N5bmNUYXNrKG9FeGVjQ3VzdG9tVmFsaWRhdGlvbik7XG5cdFx0XHRpZiAoYVZhbGlkYXRpb25NZXNzYWdlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNyZWF0ZUN1c3RvbVZhbGlkYXRpb25NZXNzYWdlcyhhVmFsaWRhdGlvbk1lc3NhZ2VzKTtcblx0XHRcdFx0TG9nLmVycm9yKFwiQ3VzdG9tIFZhbGlkYXRpb24gZmFpbGVkXCIpO1xuXHRcdFx0XHQvLyBpZiBjdXN0b20gdmFsaWRhdGlvbiBmYWlscywgd2UgbGVhdmUgdGhlIG1ldGhvZCBpbW1lZGlhdGVseVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBvTGlzdEJpbmRpbmc6IGFueTtcblx0XHRcdG1QYXJhbWV0ZXJzID0gbVBhcmFtZXRlcnMgfHwge307XG5cblx0XHRcdGlmICh2TGlzdEJpbmRpbmcgJiYgdHlwZW9mIHZMaXN0QmluZGluZyA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHQvLyB3ZSBhbHJlYWR5IGdldCBhIGxpc3QgYmluZGluZyB1c2UgdGhpcyBvbmVcblx0XHRcdFx0b0xpc3RCaW5kaW5nID0gdkxpc3RCaW5kaW5nO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygdkxpc3RCaW5kaW5nID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdG9MaXN0QmluZGluZyA9IG5ldyAoT0RhdGFMaXN0QmluZGluZyBhcyBhbnkpKHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKCksIHZMaXN0QmluZGluZyk7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSA9IENyZWF0aW9uTW9kZS5TeW5jO1xuXHRcdFx0XHRkZWxldGUgbVBhcmFtZXRlcnMuY3JlYXRlQXRFbmQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCaW5kaW5nIG9iamVjdCBvciBwYXRoIGV4cGVjdGVkXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvTW9kZWwgPSBvTGlzdEJpbmRpbmcuZ2V0TW9kZWwoKTtcblx0XHRcdGNvbnN0IHNQcm9ncmFtbWluZ01vZGVsOiBzdHJpbmcgPSB0aGlzLl9nZXRQcm9ncmFtbWluZ01vZGVsKG9MaXN0QmluZGluZyk7XG5cdFx0XHRjb25zdCByZXNvbHZlZENyZWF0aW9uTW9kZSA9IHJlc29sdmVDcmVhdGlvbk1vZGUoXG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNyZWF0aW9uTW9kZSxcblx0XHRcdFx0c1Byb2dyYW1taW5nTW9kZWwsXG5cdFx0XHRcdG9MaXN0QmluZGluZyxcblx0XHRcdFx0b01vZGVsLmdldE1ldGFNb2RlbCgpXG5cdFx0XHQpO1xuXG5cdFx0XHRsZXQgb0NyZWF0aW9uOiBhbnk7XG5cdFx0XHRsZXQgbUFyZ3M6IGFueTtcblx0XHRcdGNvbnN0IG9DcmVhdGlvblJvdyA9IG1QYXJhbWV0ZXJzLmNyZWF0aW9uUm93O1xuXHRcdFx0bGV0IG9DcmVhdGlvblJvd0NvbnRleHQ6IGFueTtcblx0XHRcdGxldCBvUGF5bG9hZDogYW55O1xuXHRcdFx0bGV0IHNNZXRhUGF0aDogc3RyaW5nO1xuXHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKTtcblx0XHRcdGNvbnN0IG9Sb3V0aW5nTGlzdGVuZXIgPSB0aGlzLl9nZXRSb3V0aW5nTGlzdGVuZXIoKTtcblxuXHRcdFx0aWYgKHJlc29sdmVkQ3JlYXRpb25Nb2RlICE9PSBDcmVhdGlvbk1vZGUuRGVmZXJyZWQpIHtcblx0XHRcdFx0aWYgKHJlc29sdmVkQ3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cpIHtcblx0XHRcdFx0XHRvQ3JlYXRpb25Sb3dDb250ZXh0ID0gb0NyZWF0aW9uUm93LmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0XHRcdFx0c01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQ3JlYXRpb25Sb3dDb250ZXh0LmdldFBhdGgoKSk7XG5cdFx0XHRcdFx0Ly8gcHJlZmlsbCBkYXRhIGZyb20gY3JlYXRpb24gcm93XG5cdFx0XHRcdFx0b1BheWxvYWQgPSBvQ3JlYXRpb25Sb3dDb250ZXh0LmdldE9iamVjdCgpO1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmRhdGEgPSB7fTtcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhvUGF5bG9hZCkuZm9yRWFjaChmdW5jdGlvbiAoc1Byb3BlcnR5UGF0aDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvUHJvcGVydHkgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YVBhdGh9LyR7c1Byb3BlcnR5UGF0aH1gKTtcblx0XHRcdFx0XHRcdC8vIGVuc3VyZSBuYXZpZ2F0aW9uIHByb3BlcnRpZXMgYXJlIG5vdCBwYXJ0IG9mIHRoZSBwYXlsb2FkLCBkZWVwIGNyZWF0ZSBub3Qgc3VwcG9ydGVkXG5cdFx0XHRcdFx0XHRpZiAob1Byb3BlcnR5ICYmIG9Qcm9wZXJ0eS4ka2luZCA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5kYXRhW3NQcm9wZXJ0eVBhdGhdID0gb1BheWxvYWRbc1Byb3BlcnR5UGF0aF07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5fY2hlY2tGb3JWYWxpZGF0aW9uRXJyb3JzKC8qb0NyZWF0aW9uUm93Q29udGV4dCovKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVzb2x2ZWRDcmVhdGlvbk1vZGUgPT09IENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdyB8fCByZXNvbHZlZENyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLklubGluZSkge1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmtlZXBUcmFuc2llbnRDb250ZXh0T25GYWlsZWQgPSBmYWxzZTsgLy8gY3VycmVudGx5IG5vdCBmdWxseSBzdXBwb3J0ZWRcblx0XHRcdFx0XHQvLyBidXN5IGhhbmRsaW5nIHNoYWxsIGJlIGRvbmUgbG9jYWxseSBvbmx5XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMuYnVzeU1vZGUgPSBcIkxvY2FsXCI7XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMuYnVzeUlkID0gb1RhYmxlPy5nZXRQYXJlbnQoKT8uZ2V0VGFibGVEZWZpbml0aW9uKCk/LmFubm90YXRpb24uaWQ7XG5cblx0XHRcdFx0XHQvLyB0YWtlIGNhcmUgb24gbWVzc2FnZSBoYW5kbGluZywgZHJhZnQgaW5kaWNhdG9yIChpbiBjYXNlIG9mIGRyYWZ0KVxuXHRcdFx0XHRcdC8vIEF0dGFjaCB0aGUgY3JlYXRlIHNlbnQgYW5kIGNyZWF0ZSBjb21wbGV0ZWQgZXZlbnQgdG8gdGhlIG9iamVjdCBwYWdlIGJpbmRpbmcgc28gdGhhdCB3ZSBjYW4gcmVhY3Rcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVDcmVhdGVFdmVudHMob0xpc3RCaW5kaW5nKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghbVBhcmFtZXRlcnMucGFyZW50Q29udHJvbCkge1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wgPSB0aGlzLmdldFZpZXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtUGFyYW1ldGVycy5iZWZvcmVDcmVhdGVDYWxsQmFjayA9IHRoaXMuYmFzZS5lZGl0Rmxvdy5vbkJlZm9yZUNyZWF0ZTtcblxuXHRcdFx0XHQvLyBJbiBjYXNlIHRoZSBhcHBsaWNhdGlvbiB3YXMgY2FsbGVkIHdpdGggcHJlZmVycmVkTW9kZT1hdXRvQ3JlYXRlV2l0aCwgd2Ugd2FudCB0byBza2lwIHRoZVxuXHRcdFx0XHQvLyBhY3Rpb24gcGFyYW1ldGVyIGRpYWxvZ1xuXHRcdFx0XHRtUGFyYW1ldGVycy5za2lwUGFyYW1ldGVyRGlhbG9nID0gb0FwcENvbXBvbmVudC5nZXRTdGFydHVwTW9kZSgpID09PSBTdGFydHVwTW9kZS5BdXRvQ3JlYXRlO1xuXG5cdFx0XHRcdG9DcmVhdGlvbiA9IHRyYW5zYWN0aW9uSGVscGVyLmNyZWF0ZURvY3VtZW50KFxuXHRcdFx0XHRcdG9MaXN0QmluZGluZyxcblx0XHRcdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0dGhpcy5fZ2V0TWVzc2FnZUhhbmRsZXIoKSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHR0aGlzLmdldFZpZXcoKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgb05hdmlnYXRpb247XG5cdFx0XHRzd2l0Y2ggKHJlc29sdmVkQ3JlYXRpb25Nb2RlKSB7XG5cdFx0XHRcdGNhc2UgQ3JlYXRpb25Nb2RlLkRlZmVycmVkOlxuXHRcdFx0XHRcdG9OYXZpZ2F0aW9uID0gb1JvdXRpbmdMaXN0ZW5lci5uYXZpZ2F0ZUZvcndhcmRUb0NvbnRleHQob0xpc3RCaW5kaW5nLCB7XG5cdFx0XHRcdFx0XHRiRGVmZXJyZWRDb250ZXh0OiB0cnVlLFxuXHRcdFx0XHRcdFx0ZWRpdGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRiRm9yY2VGb2N1czogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIENyZWF0aW9uTW9kZS5Bc3luYzpcblx0XHRcdFx0XHRvTmF2aWdhdGlvbiA9IG9Sb3V0aW5nTGlzdGVuZXIubmF2aWdhdGVGb3J3YXJkVG9Db250ZXh0KG9MaXN0QmluZGluZywge1xuXHRcdFx0XHRcdFx0YXN5bmNDb250ZXh0OiBvQ3JlYXRpb24sXG5cdFx0XHRcdFx0XHRlZGl0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGJGb3JjZUZvY3VzOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQ3JlYXRpb25Nb2RlLlN5bmM6XG5cdFx0XHRcdFx0bUFyZ3MgPSB7XG5cdFx0XHRcdFx0XHRlZGl0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGJGb3JjZUZvY3VzOiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpZiAoc1Byb2dyYW1taW5nTW9kZWwgPT0gUHJvZ3JhbW1pbmdNb2RlbC5TdGlja3kgfHwgbVBhcmFtZXRlcnMuY3JlYXRlQWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRtQXJncy50cmFuc2llbnQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvTmF2aWdhdGlvbiA9IG9DcmVhdGlvbi50aGVuKGZ1bmN0aW9uIChvTmV3RG9jdW1lbnRDb250ZXh0OiBhbnkpIHtcblx0XHRcdFx0XHRcdGlmICghb05ld0RvY3VtZW50Q29udGV4dCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjb3JlUmVzb3VyY2VCdW5kbGUgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb1JvdXRpbmdMaXN0ZW5lci5uYXZpZ2F0ZVRvTWVzc2FnZVBhZ2UoXG5cdFx0XHRcdFx0XHRcdFx0Y29yZVJlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX0NPTU1PTl9TQVBGRV9EQVRBX1JFQ0VJVkVEX0VSUk9SXCIpLFxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBjb3JlUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfQ09NTU9OX1NBUEZFX0VSUk9SXCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGNvcmVSZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiQ19FRElURkxPV19TQVBGRV9DUkVBVElPTl9GQUlMRURfREVTQ1JJUFRJT05cIilcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBJbiBjYXNlIHRoZSBTeW5jIGNyZWF0aW9uIHdhcyB0cmlnZ2VyZWQgZm9yIGEgZGVmZXJyZWQgY3JlYXRpb24sIHdlIGRvbid0IG5hdmlnYXRlIGZvcndhcmRcblx0XHRcdFx0XHRcdFx0Ly8gYXMgd2UncmUgYWxyZWFkeSBvbiB0aGUgY29ycmVzcG9uZGluZyBPYmplY3RQYWdlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBtUGFyYW1ldGVycy5iRnJvbURlZmVycmVkXG5cdFx0XHRcdFx0XHRcdFx0PyBvUm91dGluZ0xpc3RlbmVyLm5hdmlnYXRlVG9Db250ZXh0KG9OZXdEb2N1bWVudENvbnRleHQsIG1BcmdzKVxuXHRcdFx0XHRcdFx0XHRcdDogb1JvdXRpbmdMaXN0ZW5lci5uYXZpZ2F0ZUZvcndhcmRUb0NvbnRleHQob05ld0RvY3VtZW50Q29udGV4dCwgbUFyZ3MpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIENyZWF0aW9uTW9kZS5JbmxpbmU6XG5cdFx0XHRcdFx0aGFuZGxlU2lkZUVmZmVjdHMob0xpc3RCaW5kaW5nLCBvQ3JlYXRpb24pO1xuXHRcdFx0XHRcdHRoaXMuX3N5bmNUYXNrKG9DcmVhdGlvbik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93OlxuXHRcdFx0XHRcdC8vIHRoZSBjcmVhdGlvbiByb3cgc2hhbGwgYmUgY2xlYXJlZCBvbmNlIHRoZSB2YWxpZGF0aW9uIGNoZWNrIHdhcyBzdWNjZXNzZnVsIGFuZFxuXHRcdFx0XHRcdC8vIHRoZXJlZm9yZSB0aGUgUE9TVCBjYW4gYmUgc2VudCBhc3luYyB0byB0aGUgYmFja2VuZFxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvQ3JlYXRpb25Sb3dMaXN0QmluZGluZyA9IG9DcmVhdGlvblJvd0NvbnRleHQuZ2V0QmluZGluZygpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIW1QYXJhbWV0ZXJzLmJTa2lwU2lkZUVmZmVjdHMpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlU2lkZUVmZmVjdHMob0xpc3RCaW5kaW5nLCBvQ3JlYXRpb24pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBvTmV3VHJhbnNpZW50Q29udGV4dCA9IG9DcmVhdGlvblJvd0xpc3RCaW5kaW5nLmNyZWF0ZSgpO1xuXHRcdFx0XHRcdFx0b0NyZWF0aW9uUm93LnNldEJpbmRpbmdDb250ZXh0KG9OZXdUcmFuc2llbnRDb250ZXh0KTtcblxuXHRcdFx0XHRcdFx0Ly8gdGhpcyBpcyBuZWVkZWQgdG8gYXZvaWQgY29uc29sZSBlcnJvcnMgVE8gYmUgY2hlY2tlZCB3aXRoIG1vZGVsIGNvbGxlYWd1ZXNcblx0XHRcdFx0XHRcdG9OZXdUcmFuc2llbnRDb250ZXh0LmNyZWF0ZWQoKS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdExvZy50cmFjZShcInRyYW5zaWVudCBmYXN0IGNyZWF0aW9uIGNvbnRleHQgZGVsZXRlZFwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b05hdmlnYXRpb24gPSBvQ3JlYXRpb25Sb3dDb250ZXh0LmRlbGV0ZShcIiRkaXJlY3RcIik7XG5cdFx0XHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdC8vIFJlc2V0IGJ1c3kgaW5kaWNhdG9yIGFmdGVyIGEgdmFsaWRhdGlvbiBlcnJvclxuXHRcdFx0XHRcdFx0aWYgKEJ1c3lMb2NrZXIuaXNMb2NrZWQodGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJ1aVwiKSkpIHtcblx0XHRcdFx0XHRcdFx0QnVzeUxvY2tlci51bmxvY2sodGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJ1aVwiKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDcmVhdGlvblJvdyBuYXZpZ2F0aW9uIGVycm9yOiBcIiwgb0Vycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0b05hdmlnYXRpb24gPSBQcm9taXNlLnJlamVjdChgVW5oYW5kbGVkIGNyZWF0aW9uTW9kZSAke3Jlc29sdmVkQ3JlYXRpb25Nb2RlfWApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBiSXNOZXdQYWdlQ3JlYXRpb24gPVxuXHRcdFx0XHRtUGFyYW1ldGVycy5jcmVhdGlvbk1vZGUgIT09IENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdyAmJiBtUGFyYW1ldGVycy5jcmVhdGlvbk1vZGUgIT09IENyZWF0aW9uTW9kZS5JbmxpbmU7XG5cdFx0XHRpZiAob0NyZWF0aW9uKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgYVBhcmFtcyA9IGF3YWl0IFByb21pc2UuYWxsKFtvQ3JlYXRpb24sIG9OYXZpZ2F0aW9uXSk7XG5cdFx0XHRcdFx0dGhpcy5fc2V0U3RpY2t5U2Vzc2lvbkludGVybmFsUHJvcGVydGllcyhzUHJvZ3JhbW1pbmdNb2RlbCwgb01vZGVsKTtcblxuXHRcdFx0XHRcdGlmIChiSXNOZXdQYWdlQ3JlYXRpb24pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3NldEVkaXRNb2RlKEVkaXRNb2RlLkVkaXRhYmxlLCBiSXNOZXdQYWdlQ3JlYXRpb24pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zZXRFZGl0TW9kZShFZGl0TW9kZS5FZGl0YWJsZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnN0IG9OZXdEb2N1bWVudENvbnRleHQgPSBhUGFyYW1zWzBdO1xuXHRcdFx0XHRcdGlmIChvTmV3RG9jdW1lbnRDb250ZXh0KSB7XG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuX2lzRmNsRW5hYmxlZCgpKSB7XG5cdFx0XHRcdFx0XHRcdEVkaXRTdGF0ZS5zZXRFZGl0U3RhdGVEaXJ0eSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fc2VuZEFjdGl2aXR5KEFjdGl2aXR5LkNyZWF0ZSwgb05ld0RvY3VtZW50Q29udGV4dCk7XG5cdFx0XHRcdFx0XHRpZiAoc1Byb2dyYW1taW5nTW9kZWwgPT09IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5KSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2hhbmRsZVN0aWNreU9uKG9OZXdEb2N1bWVudENvbnRleHQpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChNb2RlbEhlbHBlci5pc0NvbGxhYm9yYXRpb25EcmFmdFN1cHBvcnRlZChvTW9kZWwuZ2V0TWV0YU1vZGVsKCkpKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGFjY29yZGluZyB0byBVWCBpbiBjYXNlIG9mIGVuYWJsZWQgY29sbGFib3JhdGlvbiBkcmFmdCB3ZSBzaGFyZSB0aGUgb2JqZWN0IGltbWVkaWF0ZWx5XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHNoYXJlT2JqZWN0KG9OZXdEb2N1bWVudENvbnRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcblx0XHRcdFx0XHQvLyBUT0RPOiBjdXJyZW50bHksIHRoZSBvbmx5IGVycm9ycyBoYW5kbGVkIGhlcmUgYXJlIHJhaXNlZCBhcyBzdHJpbmcgLSBzaG91bGQgYmUgY2hhbmdlZCB0byBFcnJvciBvYmplY3RzXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0ZXJyb3IgPT09IENvbnN0YW50cy5DYW5jZWxBY3Rpb25EaWFsb2cgfHxcblx0XHRcdFx0XHRcdGVycm9yID09PSBDb25zdGFudHMuQWN0aW9uRXhlY3V0aW9uRmFpbGVkIHx8XG5cdFx0XHRcdFx0XHRlcnJvciA9PT0gQ29uc3RhbnRzLkNyZWF0aW9uRmFpbGVkXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHQvLyBjcmVhdGlvbiBoYXMgYmVlbiBjYW5jZWxsZWQgYnkgdXNlciBvciBmYWlsZWQgaW4gYmFja2VuZCA9PiBpbiBjYXNlIHdlIGhhdmUgbmF2aWdhdGVkIHRvIHRyYW5zaWVudCBjb250ZXh0IGJlZm9yZSwgbmF2aWdhdGUgYmFja1xuXHRcdFx0XHRcdFx0Ly8gdGhlIHN3aXRjaC1zdGF0ZW1lbnQgYWJvdmUgc2VlbXMgdG8gaW5kaWNhdGUgdGhhdCB0aGlzIGhhcHBlbnMgaW4gY3JlYXRpb25Nb2RlcyBkZWZlcnJlZCBhbmQgYXN5bmMuIEJ1dCBpbiBmYWN0LCBpbiB0aGVzZSBjYXNlcyBhZnRlciB0aGUgbmF2aWdhdGlvbiBmcm9tIHJvdXRlTWF0Y2hlZCBpbiBPUCBjb21wb25lbnRcblx0XHRcdFx0XHRcdC8vIGNyZWF0ZURlZmVycmVkQ29udGV4dCBpcyB0cmlnZ2VyZCwgd2hpY2ggY2FsbHMgdGhpcyBtZXRob2QgKGNyZWF0ZURvY3VtZW50KSBhZ2FpbiAtIHRoaXMgdGltZSB3aXRoIGNyZWF0aW9uTW9kZSBzeW5jLiBUaGVyZWZvcmUsIGFsc28gaW4gdGhhdCBtb2RlIHdlIG5lZWQgdG8gdHJpZ2dlciBiYWNrIG5hdmlnYXRpb24uXG5cdFx0XHRcdFx0XHQvLyBUaGUgb3RoZXIgY2FzZXMgbWlnaHQgc3RpbGwgYmUgbmVlZGVkIGluIGNhc2UgdGhlIG5hdmlnYXRpb24gZmFpbHMuXG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdHJlc29sdmVkQ3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuU3luYyB8fFxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlZENyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLkRlZmVycmVkIHx8XG5cdFx0XHRcdFx0XHRcdHJlc29sdmVkQ3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQXN5bmNcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRvUm91dGluZ0xpc3RlbmVyLm5hdmlnYXRlQmFja0Zyb21UcmFuc2llbnRTdGF0ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRpZiAoYlNob3VsZEJ1c3lMb2NrKSB7XG5cdFx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKG9Mb2NrT2JqZWN0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byBpbnRlcmNlcHQgdGhlICdTYXZlJyBhY3Rpb24uIFlvdSBjYW4gZXhlY3V0ZSBjdXN0b20gY29kaW5nIGluIHRoaXMgZnVuY3Rpb24uXG5cdCAqIFRoZSBmcmFtZXdvcmsgd2FpdHMgZm9yIHRoZSByZXR1cm5lZCBwcm9taXNlIHRvIGJlIHJlc29sdmVkIGJlZm9yZSBjb250aW51aW5nIHRoZSAnU2F2ZScgYWN0aW9uLlxuXHQgKiBJZiB5b3UgcmVqZWN0IHRoZSBwcm9taXNlLCB0aGUgJ1NhdmUnIGFjdGlvbiBpcyBzdG9wcGVkIGFuZCB0aGUgdXNlciBzdGF5cyBpbiBlZGl0IG1vZGUuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5BZnRlcn0uXG5cdCAqXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBPYmplY3QgY29udGFpbmluZyB0aGUgcGFyYW1ldGVycyBwYXNzZWQgdG8gb25CZWZvcmVTYXZlXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jb250ZXh0IFBhZ2UgY29udGV4dCB0aGF0IGlzIGdvaW5nIHRvIGJlIHNhdmVkLlxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgdG8gYmUgcmV0dXJuZWQgYnkgdGhlIG92ZXJyaWRkZW4gbWV0aG9kLiBJZiByZXNvbHZlZCwgdGhlICdTYXZlJyBhY3Rpb24gaXMgdHJpZ2dlcmVkLiBJZiByZWplY3RlZCwgdGhlICdTYXZlJyBhY3Rpb24gaXMgbm90IHRyaWdnZXJlZCBhbmQgdGhlIHVzZXIgc3RheXMgaW4gZWRpdCBtb2RlLlxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3dcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93I29uQmVmb3JlU2F2ZVxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjkwLjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRvbkJlZm9yZVNhdmUobVBhcmFtZXRlcnM/OiB7IGNvbnRleHQ/OiBDb250ZXh0IH0pOiBQcm9taXNlPHZvaWQ+IHtcblx0XHQvLyB0byBiZSBvdmVycmlkZGVuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGNhbiBiZSB1c2VkIHRvIGludGVyY2VwdCB0aGUgJ0NyZWF0ZScgYWN0aW9uLiBZb3UgY2FuIGV4ZWN1dGUgY3VzdG9tIGNvZGluZyBpbiB0aGlzIGZ1bmN0aW9uLlxuXHQgKiBUaGUgZnJhbWV3b3JrIHdhaXRzIGZvciB0aGUgcmV0dXJuZWQgcHJvbWlzZSB0byBiZSByZXNvbHZlZCBiZWZvcmUgY29udGludWluZyB0aGUgJ0NyZWF0ZScgYWN0aW9uLlxuXHQgKiBJZiB5b3UgcmVqZWN0IHRoZSBwcm9taXNlLCB0aGUgJ0NyZWF0ZScgYWN0aW9uIGlzIHN0b3BwZWQuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5BZnRlcn0uXG5cdCAqXG5cdCAqIEBwYXJhbSAgbVBhcmFtZXRlcnMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvIG9uQmVmb3JlQ3JlYXRlXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jb250ZXh0UGF0aCBQYXRoIHBvaW50aW5nIHRvIHRoZSBjb250ZXh0IG9uIHdoaWNoIENyZWF0ZSBhY3Rpb24gaXMgdHJpZ2dlcmVkXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jcmVhdGVQYXJhbWV0ZXJzIEFycmF5IG9mIHZhbHVlcyB0aGF0IGFyZSBmaWxsZWQgaW4gdGhlIEFjdGlvbiBQYXJhbWV0ZXIgRGlhbG9nXG5cdCAqIEByZXR1cm5zIEEgcHJvbWlzZSB0byBiZSByZXR1cm5lZCBieSB0aGUgb3ZlcnJpZGRlbiBtZXRob2QuIElmIHJlc29sdmVkLCB0aGUgJ0NyZWF0ZScgYWN0aW9uIGlzIHRyaWdnZXJlZC4gSWYgcmVqZWN0ZWQsIHRoZSAnQ3JlYXRlJyBhY3Rpb24gaXMgbm90IHRyaWdnZXJlZC5cblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNvbkJlZm9yZUNyZWF0ZVxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjk4LjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRvbkJlZm9yZUNyZWF0ZShtUGFyYW1ldGVycz86IHsgY29udGV4dFBhdGg/OiBzdHJpbmc7IGNyZWF0ZVBhcmFtZXRlcnM/OiBhbnlbXSB9KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGRlblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byBpbnRlcmNlcHQgdGhlICdFZGl0JyBhY3Rpb24uIFlvdSBjYW4gZXhlY3V0ZSBjdXN0b20gY29kaW5nIGluIHRoaXMgZnVuY3Rpb24uXG5cdCAqIFRoZSBmcmFtZXdvcmsgd2FpdHMgZm9yIHRoZSByZXR1cm5lZCBwcm9taXNlIHRvIGJlIHJlc29sdmVkIGJlZm9yZSBjb250aW51aW5nIHRoZSAnRWRpdCcgYWN0aW9uLlxuXHQgKiBJZiB5b3UgcmVqZWN0IHRoZSBwcm9taXNlLCB0aGUgJ0VkaXQnIGFjdGlvbiBpcyBzdG9wcGVkIGFuZCB0aGUgdXNlciBzdGF5cyBpbiBkaXNwbGF5IG1vZGUuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5BZnRlcn0uXG5cdCAqXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBPYmplY3QgY29udGFpbmluZyB0aGUgcGFyYW1ldGVycyBwYXNzZWQgdG8gb25CZWZvcmVFZGl0XG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jb250ZXh0IFBhZ2UgY29udGV4dCB0aGF0IGlzIGdvaW5nIHRvIGJlIGVkaXRlZC5cblx0ICogQHJldHVybnMgQSBwcm9taXNlIHRvIGJlIHJldHVybmVkIGJ5IHRoZSBvdmVycmlkZGVuIG1ldGhvZC4gSWYgcmVzb2x2ZWQsIHRoZSAnRWRpdCcgYWN0aW9uIGlzIHRyaWdnZXJlZC4gSWYgcmVqZWN0ZWQsIHRoZSAnRWRpdCcgYWN0aW9uIGlzIG5vdCB0cmlnZ2VyZWQgYW5kIHRoZSB1c2VyIHN0YXlzIGluIGRpc3BsYXkgbW9kZS5cblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNvbkJlZm9yZUVkaXRcblx0ICogQHB1YmxpY1xuXHQgKiBAc2luY2UgMS45OC4wXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0b25CZWZvcmVFZGl0KG1QYXJhbWV0ZXJzPzogeyBjb250ZXh0PzogQ29udGV4dCB9KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGRlblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byBpbnRlcmNlcHQgdGhlICdEaXNjYXJkJyBhY3Rpb24uIFlvdSBjYW4gZXhlY3V0ZSBjdXN0b20gY29kaW5nIGluIHRoaXMgZnVuY3Rpb24uXG5cdCAqIFRoZSBmcmFtZXdvcmsgd2FpdHMgZm9yIHRoZSByZXR1cm5lZCBwcm9taXNlIHRvIGJlIHJlc29sdmVkIGJlZm9yZSBjb250aW51aW5nIHRoZSAnRGlzY2FyZCcgYWN0aW9uLlxuXHQgKiBJZiB5b3UgcmVqZWN0IHRoZSBwcm9taXNlLCB0aGUgJ0Rpc2NhcmQnIGFjdGlvbiBpcyBzdG9wcGVkIGFuZCB0aGUgdXNlciBzdGF5cyBpbiBlZGl0IG1vZGUuXG5cdCAqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgaW5kaXZpZHVhbGx5IG92ZXJyaWRkZW4gYnkgY29uc3VtaW5nIGNvbnRyb2xsZXJzLCBidXQgbm90IHRvIGJlIGNhbGxlZCBkaXJlY3RseS5cblx0ICogVGhlIG92ZXJyaWRlIGV4ZWN1dGlvbiBpczoge0BsaW5rIHNhcC51aS5jb3JlLm12Yy5PdmVycmlkZUV4ZWN1dGlvbi5BZnRlcn0uXG5cdCAqXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBPYmplY3QgY29udGFpbmluZyB0aGUgcGFyYW1ldGVycyBwYXNzZWQgdG8gb25CZWZvcmVEaXNjYXJkXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jb250ZXh0IFBhZ2UgY29udGV4dCB0aGF0IGlzIGdvaW5nIHRvIGJlIGRpc2NhcmRlZC5cblx0ICogQHJldHVybnMgQSBwcm9taXNlIHRvIGJlIHJldHVybmVkIGJ5IHRoZSBvdmVycmlkZGVuIG1ldGhvZC4gSWYgcmVzb2x2ZWQsIHRoZSAnRGlzY2FyZCcgYWN0aW9uIGlzIHRyaWdnZXJlZC4gSWYgcmVqZWN0ZWQsIHRoZSAnRGlzY2FyZCcgYWN0aW9uIGlzIG5vdCB0cmlnZ2VyZWQgYW5kIHRoZSB1c2VyIHN0YXlzIGluIGVkaXQgbW9kZS5cblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNvbkJlZm9yZURpc2NhcmRcblx0ICogQHB1YmxpY1xuXHQgKiBAc2luY2UgMS45OC4wXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0b25CZWZvcmVEaXNjYXJkKG1QYXJhbWV0ZXJzPzogeyBjb250ZXh0PzogQ29udGV4dCB9KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Ly8gdG8gYmUgb3ZlcnJpZGRlblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byBpbnRlcmNlcHQgdGhlICdEZWxldGUnIGFjdGlvbi4gWW91IGNhbiBleGVjdXRlIGN1c3RvbSBjb2RpbmcgaW4gdGhpcyBmdW5jdGlvbi5cblx0ICogVGhlIGZyYW1ld29yayB3YWl0cyBmb3IgdGhlIHJldHVybmVkIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQgYmVmb3JlIGNvbnRpbnVpbmcgdGhlICdEZWxldGUnIGFjdGlvbi5cblx0ICogSWYgeW91IHJlamVjdCB0aGUgcHJvbWlzZSwgdGhlICdEZWxldGUnIGFjdGlvbiBpcyBzdG9wcGVkLlxuXHQgKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW50IHRvIGJlIGluZGl2aWR1YWxseSBvdmVycmlkZGVuIGJ5IGNvbnN1bWluZyBjb250cm9sbGVycywgYnV0IG5vdCB0byBiZSBjYWxsZWQgZGlyZWN0bHkuXG5cdCAqIFRoZSBvdmVycmlkZSBleGVjdXRpb24gaXM6IHtAbGluayBzYXAudWkuY29yZS5tdmMuT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXJ9LlxuXHQgKlxuXHQgKiBAcGFyYW0gbVBhcmFtZXRlcnMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvIG9uQmVmb3JlRGVsZXRlXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jb250ZXh0cyBBbiBhcnJheSBvZiBjb250ZXh0cyB0aGF0IGFyZSBnb2luZyB0byBiZSBkZWxldGVkXG5cdCAqIEByZXR1cm5zIEEgcHJvbWlzZSB0byBiZSByZXR1cm5lZCBieSB0aGUgb3ZlcnJpZGRlbiBtZXRob2QuIElmIHJlc29sdmVkLCB0aGUgJ0RlbGV0ZScgYWN0aW9uIGlzIHRyaWdnZXJlZC4gSWYgcmVqZWN0ZWQsIHRoZSAnRGVsZXRlJyBhY3Rpb24gaXMgbm90IHRyaWdnZXJlZC5cblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNvbkJlZm9yZURlbGV0ZVxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjk4LjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRvbkJlZm9yZURlbGV0ZShtUGFyYW1ldGVycz86IHsgY29udGV4dHM/OiBDb250ZXh0W10gfSk6IFByb21pc2U8dm9pZD4ge1xuXHRcdC8vIHRvIGJlIG92ZXJyaWRkZW5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cblxuXHQvLyBJbnRlcm5hbCBvbmx5IHBhcmFtcyAtLS1cblx0Ly8gQHBhcmFtIHtib29sZWFufSBtUGFyYW1ldGVycy5iRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvciBJbmRpY2F0ZXMgd2hldGhlciBTaWRlRWZmZWN0cyBuZWVkIHRvIGJlIGlnbm9yZWQgd2hlbiB1c2VyIGNsaWNrcyBvbiBTYXZlIGR1cmluZyBhbiBJbmxpbmUgY3JlYXRpb25cblx0Ly8gQHBhcmFtIHtvYmplY3R9IG1QYXJhbWV0ZXJzLmJpbmRpbmdzIExpc3QgYmluZGluZ3Mgb2YgdGhlIHRhYmxlcyBpbiB0aGUgdmlldy5cblx0Ly8gQm90aCBvZiB0aGUgYWJvdmUgcGFyYW1ldGVycyBhcmUgZm9yIHRoZSBzYW1lIHB1cnBvc2UuIFVzZXIgY2FuIGVudGVyIHNvbWUgaW5mb3JtYXRpb24gaW4gdGhlIGNyZWF0aW9uIHJvdyhzKSBidXQgZG9lcyBub3QgJ0FkZCByb3cnLCBpbnN0ZWFkIGNsaWNrcyBTYXZlLlxuXHQvLyBUaGVyZSBjYW4gYmUgbW9yZSB0aGFuIG9uZSBpbiB0aGUgdmlldy5cblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganNkb2MvcmVxdWlyZS1wYXJhbVxuXHQvKipcblx0ICogU2F2ZXMgYSBuZXcgZG9jdW1lbnQgYWZ0ZXIgY2hlY2tpbmcgaXQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gb0NvbnRleHQgIENvbnRleHQgb2YgdGhlIGVkaXRhYmxlIGRvY3VtZW50XG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZXMgb25jZSBzYXZlIGlzIGNvbXBsZXRlXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNzYXZlRG9jdW1lbnRcblx0ICogQHB1YmxpY1xuXHQgKiBAc2luY2UgMS45MC4wXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXN5bmMgc2F2ZURvY3VtZW50KG9Db250ZXh0OiBWNENvbnRleHQsIG1QYXJhbWV0ZXJzOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRtUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzIHx8IHt9O1xuXHRcdGNvbnN0IGJFeGVjdXRlU2lkZUVmZmVjdHNPbkVycm9yID0gbVBhcmFtZXRlcnMuYkV4ZWN1dGVTaWRlRWZmZWN0c09uRXJyb3IgfHwgdW5kZWZpbmVkO1xuXHRcdGNvbnN0IGJEcmFmdE5hdmlnYXRpb24gPSB0cnVlO1xuXHRcdGNvbnN0IHRyYW5zYWN0aW9uSGVscGVyID0gdGhpcy5fZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKTtcblx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSB0aGlzLl9nZXRSZXNvdXJjZUJ1bmRsZSgpO1xuXHRcdGNvbnN0IGFCaW5kaW5ncyA9IG1QYXJhbWV0ZXJzLmJpbmRpbmdzO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRoaXMuX3N5bmNUYXNrKCk7XG5cdFx0XHRhd2FpdCB0aGlzLl9zdWJtaXRPcGVuQ2hhbmdlcyhvQ29udGV4dCk7XG5cdFx0XHRhd2FpdCB0aGlzLl9jaGVja0ZvclZhbGlkYXRpb25FcnJvcnMoKTtcblx0XHRcdGF3YWl0IHRoaXMuYmFzZS5lZGl0Rmxvdy5vbkJlZm9yZVNhdmUoeyBjb250ZXh0OiBvQ29udGV4dCB9KTtcblxuXHRcdFx0Y29uc3Qgc1Byb2dyYW1taW5nTW9kZWwgPSB0aGlzLl9nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KTtcblx0XHRcdGNvbnN0IG9Sb290Vmlld0NvbnRyb2xsZXIgPSB0aGlzLl9nZXRSb290Vmlld0NvbnRyb2xsZXIoKSBhcyBhbnk7XG5cdFx0XHRsZXQgc2libGluZ0luZm86IFNpYmxpbmdJbmZvcm1hdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRcdGlmIChcblx0XHRcdFx0KHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLlN0aWNreSB8fCBvQ29udGV4dC5nZXRQcm9wZXJ0eShcIkhhc0FjdGl2ZUVudGl0eVwiKSkgJiZcblx0XHRcdFx0b1Jvb3RWaWV3Q29udHJvbGxlci5pc0ZjbEVuYWJsZWQoKVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIE5vIG5lZWQgdG8gdHJ5IHRvIGdldCByaWdodG1vc3QgY29udGV4dCBpbiBjYXNlIG9mIGEgbmV3IG9iamVjdFxuXHRcdFx0XHRzaWJsaW5nSW5mbyA9IGF3YWl0IHRoaXMuX2NvbXB1dGVTaWJsaW5nSW5mb3JtYXRpb24oXG5cdFx0XHRcdFx0b0NvbnRleHQsXG5cdFx0XHRcdFx0b1Jvb3RWaWV3Q29udHJvbGxlci5nZXRSaWdodG1vc3RDb250ZXh0KCksXG5cdFx0XHRcdFx0c1Byb2dyYW1taW5nTW9kZWwsXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBhY3RpdmVEb2N1bWVudENvbnRleHQgPSBhd2FpdCB0cmFuc2FjdGlvbkhlbHBlci5zYXZlRG9jdW1lbnQoXG5cdFx0XHRcdG9Db250ZXh0LFxuXHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdGJFeGVjdXRlU2lkZUVmZmVjdHNPbkVycm9yLFxuXHRcdFx0XHRhQmluZGluZ3MsXG5cdFx0XHRcdHRoaXMuX2dldE1lc3NhZ2VIYW5kbGVyKClcblx0XHRcdCk7XG5cdFx0XHR0aGlzLl9yZW1vdmVTdGlja3lTZXNzaW9uSW50ZXJuYWxQcm9wZXJ0aWVzKHNQcm9ncmFtbWluZ01vZGVsKTtcblxuXHRcdFx0dGhpcy5fc2VuZEFjdGl2aXR5KEFjdGl2aXR5LkFjdGl2YXRlLCBhY3RpdmVEb2N1bWVudENvbnRleHQpO1xuXHRcdFx0dGhpcy5fdHJpZ2dlckNvbmZpZ3VyZWRTdXJ2ZXkoU3RhbmRhcmRBY3Rpb25zLnNhdmUsIFRyaWdnZXJUeXBlLnN0YW5kYXJkQWN0aW9uKTtcblxuXHRcdFx0dGhpcy5fc2V0RWRpdE1vZGUoRWRpdE1vZGUuRGlzcGxheSwgZmFsc2UpO1xuXHRcdFx0dGhpcy5fZ2V0TWVzc2FnZUhhbmRsZXIoKS5zaG93TWVzc2FnZURpYWxvZygpO1xuXG5cdFx0XHRpZiAoYWN0aXZlRG9jdW1lbnRDb250ZXh0ICE9PSBvQ29udGV4dCkge1xuXHRcdFx0XHRsZXQgY29udGV4dFRvTmF2aWdhdGUgPSBhY3RpdmVEb2N1bWVudENvbnRleHQ7XG5cdFx0XHRcdGlmIChvUm9vdFZpZXdDb250cm9sbGVyLmlzRmNsRW5hYmxlZCgpKSB7XG5cdFx0XHRcdFx0c2libGluZ0luZm8gPSBzaWJsaW5nSW5mbyA/PyB0aGlzLl9jcmVhdGVTaWJsaW5nSW5mbyhvQ29udGV4dCwgYWN0aXZlRG9jdW1lbnRDb250ZXh0KTtcblx0XHRcdFx0XHR0aGlzLl91cGRhdGVQYXRoc0luSGlzdG9yeShzaWJsaW5nSW5mby5wYXRoTWFwcGluZyk7XG5cdFx0XHRcdFx0aWYgKHNpYmxpbmdJbmZvLnRhcmdldENvbnRleHQuZ2V0UGF0aCgpICE9PSBhY3RpdmVEb2N1bWVudENvbnRleHQuZ2V0UGF0aCgpKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0VG9OYXZpZ2F0ZSA9IHNpYmxpbmdJbmZvLnRhcmdldENvbnRleHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5faGFuZGxlTmV3Q29udGV4dChjb250ZXh0VG9OYXZpZ2F0ZSwgZmFsc2UsIGZhbHNlLCBiRHJhZnROYXZpZ2F0aW9uLCB0cnVlKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0aWYgKCEob0Vycm9yICYmIG9FcnJvci5jYW5jZWxlZCkpIHtcblx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgc2F2aW5nIHRoZSBkb2N1bWVudFwiLCBvRXJyb3IpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG9FcnJvcik7XG5cdFx0fVxuXHR9XG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRhc3luYyB0b2dnbGVEcmFmdEFjdGl2ZShvQ29udGV4dDogVjRDb250ZXh0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3Qgb0NvbnRleHREYXRhID0gb0NvbnRleHQuZ2V0T2JqZWN0KCk7XG5cdFx0bGV0IGJFZGl0YWJsZTogYm9vbGVhbjtcblx0XHRjb25zdCBiSXNEcmFmdCA9IG9Db250ZXh0ICYmIHRoaXMuX2dldFByb2dyYW1taW5nTW9kZWwob0NvbnRleHQpID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0O1xuXG5cdFx0Ly90b2dnbGUgYmV0d2VlbiBkcmFmdCBhbmQgYWN0aXZlIGRvY3VtZW50IGlzIG9ubHkgYXZhaWxhYmxlIGZvciBlZGl0IGRyYWZ0cyBhbmQgYWN0aXZlIGRvY3VtZW50cyB3aXRoIGRyYWZ0KVxuXHRcdGlmIChcblx0XHRcdCFiSXNEcmFmdCB8fFxuXHRcdFx0IShcblx0XHRcdFx0KCFvQ29udGV4dERhdGEuSXNBY3RpdmVFbnRpdHkgJiYgb0NvbnRleHREYXRhLkhhc0FjdGl2ZUVudGl0eSkgfHxcblx0XHRcdFx0KG9Db250ZXh0RGF0YS5Jc0FjdGl2ZUVudGl0eSAmJiBvQ29udGV4dERhdGEuSGFzRHJhZnRFbnRpdHkpXG5cdFx0XHQpXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFvQ29udGV4dERhdGEuSXNBY3RpdmVFbnRpdHkgJiYgb0NvbnRleHREYXRhLkhhc0FjdGl2ZUVudGl0eSkge1xuXHRcdFx0Ly9zdGFydCBQb2ludDogZWRpdCBkcmFmdFxuXHRcdFx0YkVkaXRhYmxlID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHN0YXJ0IHBvaW50IGFjdGl2ZSBkb2N1bWVudFxuXHRcdFx0YkVkaXRhYmxlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgb1Jvb3RWaWV3Q29udHJvbGxlciA9IHRoaXMuX2dldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIGFueTtcblx0XHRcdGNvbnN0IG9SaWdodG1vc3RDb250ZXh0ID0gb1Jvb3RWaWV3Q29udHJvbGxlci5pc0ZjbEVuYWJsZWQoKSA/IG9Sb290Vmlld0NvbnRyb2xsZXIuZ2V0UmlnaHRtb3N0Q29udGV4dCgpIDogb0NvbnRleHQ7XG5cdFx0XHRjb25zdCBzaWJsaW5nSW5mbyA9IGF3YWl0IHRoaXMuX2NvbXB1dGVTaWJsaW5nSW5mb3JtYXRpb24ob0NvbnRleHQsIG9SaWdodG1vc3RDb250ZXh0LCBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0LCBmYWxzZSk7XG5cdFx0XHRpZiAoc2libGluZ0luZm8pIHtcblx0XHRcdFx0dGhpcy5fc2V0RWRpdE1vZGUoYkVkaXRhYmxlID8gRWRpdE1vZGUuRWRpdGFibGUgOiBFZGl0TW9kZS5EaXNwbGF5LCBmYWxzZSk7IC8vc3dpdGNoIHRvIGVkaXQgbW9kZSBvbmx5IGlmIGEgZHJhZnQgaXMgYXZhaWxhYmxlXG5cblx0XHRcdFx0aWYgKG9Sb290Vmlld0NvbnRyb2xsZXIuaXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdFx0XHRjb25zdCBsYXN0U2VtYW50aWNNYXBwaW5nID0gdGhpcy5fZ2V0U2VtYW50aWNNYXBwaW5nKCk7XG5cdFx0XHRcdFx0aWYgKGxhc3RTZW1hbnRpY01hcHBpbmc/LnRlY2huaWNhbFBhdGggPT09IG9Db250ZXh0LmdldFBhdGgoKSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdGFyZ2V0UGF0aCA9IHNpYmxpbmdJbmZvLnBhdGhNYXBwaW5nW3NpYmxpbmdJbmZvLnBhdGhNYXBwaW5nLmxlbmd0aCAtIDFdLm5ld1BhdGg7XG5cdFx0XHRcdFx0XHRzaWJsaW5nSW5mby5wYXRoTWFwcGluZy5wdXNoKHsgb2xkUGF0aDogbGFzdFNlbWFudGljTWFwcGluZy5zZW1hbnRpY1BhdGgsIG5ld1BhdGg6IHRhcmdldFBhdGggfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3VwZGF0ZVBhdGhzSW5IaXN0b3J5KHNpYmxpbmdJbmZvLnBhdGhNYXBwaW5nKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGF3YWl0IHRoaXMuX2hhbmRsZU5ld0NvbnRleHQoc2libGluZ0luZm8udGFyZ2V0Q29udGV4dCwgYkVkaXRhYmxlLCB0cnVlLCB0cnVlLCB0cnVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChcIkVycm9yIGluIEVkaXRGbG93LnRvZ2dsZURyYWZ0QWN0aXZlIC0gQ2Fubm90IGZpbmQgc2libGluZ1wiKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChvRXJyb3IpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChgRXJyb3IgaW4gRWRpdEZsb3cudG9nZ2xlRHJhZnRBY3RpdmU6JHtvRXJyb3J9YCBhcyBhbnkpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEludGVybmFsIG9ubHkgcGFyYW1zIC0tLVxuXHQvLyBAcGFyYW0ge3NhcC5tLkJ1dHRvbn0gbVBhcmFtZXRlcnMuY2FuY2VsQnV0dG9uIC0gQ3VycmVudGx5IHRoaXMgaXMgcGFzc2VkIGFzIGNhbmNlbEJ1dHRvbiBpbnRlcm5hbGx5IChyZXBsYWNlZCBieSBtUGFyYW1ldGVycy5jb250cm9sIGluIHRoZSBKU0RvYyBiZWxvdykuIEN1cnJlbnRseSBpdCBpcyBhbHNvIG1hbmRhdG9yeS5cblx0Ly8gUGxhbiAtIFRoaXMgc2hvdWxkIG5vdCBiZSBtYW5kYXRvcnkuIElmIG5vdCBwcm92aWRlZCwgd2Ugc2hvdWxkIGhhdmUgYSBkZWZhdWx0IHRoYXQgY2FuIGFjdCBhcyByZWZlcmVuY2UgY29udHJvbCBmb3IgdGhlIGRpc2NhcmQgcG9wb3ZlciBPUiB3ZSBjYW4gc2hvdyBhIGRpYWxvZyBpbnN0ZWFkIG9mIGEgcG9wb3Zlci5cblxuXHQvKipcblx0ICogRGlzY2FyZCB0aGUgZWRpdGFibGUgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gb0NvbnRleHQgIENvbnRleHQgb2YgdGhlIGVkaXRhYmxlIGRvY3VtZW50XG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBDYW4gY29udGFpbiB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5jb250cm9sIFRoaXMgaXMgdGhlIGNvbnRyb2wgdXNlZCB0byBvcGVuIHRoZSBkaXNjYXJkIHBvcG92ZXJcblx0ICogQHBhcmFtIG1QYXJhbWV0ZXJzLnNraXBEaXNjYXJkUG9wb3ZlciBPcHRpb25hbCwgc3VwcmVzc2VzIHRoZSBkaXNjYXJkIHBvcG92ZXIgYW5kIGFsbG93cyBjdXN0b20gaGFuZGxpbmdcblx0ICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlcyBvbmNlIGVkaXRhYmxlIGRvY3VtZW50IGhhcyBiZWVuIGRpc2NhcmRlZFxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3cjY2FuY2VsRG9jdW1lbnRcblx0ICogQHB1YmxpY1xuXHQgKiBAc2luY2UgMS45MC4wXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXN5bmMgY2FuY2VsRG9jdW1lbnQob0NvbnRleHQ6IFY0Q29udGV4dCwgbVBhcmFtZXRlcnM6IHsgY29udHJvbDogb2JqZWN0OyBza2lwRGlzY2FyZFBvcG92ZXI/OiBib29sZWFuIH0pOiBQcm9taXNlPGFueT4ge1xuXHRcdGNvbnN0IHRyYW5zYWN0aW9uSGVscGVyID0gdGhpcy5fZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKTtcblx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSB0aGlzLl9nZXRSZXNvdXJjZUJ1bmRsZSgpO1xuXHRcdGNvbnN0IG1JblBhcmFtZXRlcnM6IGFueSA9IG1QYXJhbWV0ZXJzO1xuXHRcdGxldCBzaWJsaW5nSW5mbzogU2libGluZ0luZm9ybWF0aW9uIHwgdW5kZWZpbmVkO1xuXG5cdFx0bUluUGFyYW1ldGVycy5jYW5jZWxCdXR0b24gPSBtUGFyYW1ldGVycy5jb250cm9sIHx8IG1JblBhcmFtZXRlcnMuY2FuY2VsQnV0dG9uO1xuXHRcdG1JblBhcmFtZXRlcnMuYmVmb3JlQ2FuY2VsQ2FsbEJhY2sgPSB0aGlzLmJhc2UuZWRpdEZsb3cub25CZWZvcmVEaXNjYXJkO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRoaXMuX3N5bmNUYXNrKCk7XG5cdFx0XHRjb25zdCBzUHJvZ3JhbW1pbmdNb2RlbCA9IHRoaXMuX2dldFByb2dyYW1taW5nTW9kZWwob0NvbnRleHQpO1xuXHRcdFx0aWYgKChzUHJvZ3JhbW1pbmdNb2RlbCA9PT0gUHJvZ3JhbW1pbmdNb2RlbC5TdGlja3kgfHwgb0NvbnRleHQuZ2V0UHJvcGVydHkoXCJIYXNBY3RpdmVFbnRpdHlcIikpICYmIHRoaXMuX2lzRmNsRW5hYmxlZCgpKSB7XG5cdFx0XHRcdGNvbnN0IG9Sb290Vmlld0NvbnRyb2xsZXIgPSB0aGlzLl9nZXRSb290Vmlld0NvbnRyb2xsZXIoKSBhcyBhbnk7XG5cblx0XHRcdFx0Ly8gTm8gbmVlZCB0byB0cnkgdG8gZ2V0IHJpZ2h0bW9zdCBjb250ZXh0IGluIGNhc2Ugb2YgYSBuZXcgb2JqZWN0XG5cdFx0XHRcdHNpYmxpbmdJbmZvID0gYXdhaXQgdGhpcy5fY29tcHV0ZVNpYmxpbmdJbmZvcm1hdGlvbihcblx0XHRcdFx0XHRvQ29udGV4dCxcblx0XHRcdFx0XHRvUm9vdFZpZXdDb250cm9sbGVyLmdldFJpZ2h0bW9zdENvbnRleHQoKSxcblx0XHRcdFx0XHRzUHJvZ3JhbW1pbmdNb2RlbCxcblx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNhbmNlbFJlc3VsdCA9IGF3YWl0IHRyYW5zYWN0aW9uSGVscGVyLmNhbmNlbERvY3VtZW50KFxuXHRcdFx0XHRvQ29udGV4dCxcblx0XHRcdFx0bUluUGFyYW1ldGVycyxcblx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHR0aGlzLl9nZXRNZXNzYWdlSGFuZGxlcigpXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYkRyYWZ0TmF2aWdhdGlvbiA9IHRydWU7XG5cdFx0XHR0aGlzLl9yZW1vdmVTdGlja3lTZXNzaW9uSW50ZXJuYWxQcm9wZXJ0aWVzKHNQcm9ncmFtbWluZ01vZGVsKTtcblxuXHRcdFx0dGhpcy5fc2V0RWRpdE1vZGUoRWRpdE1vZGUuRGlzcGxheSwgZmFsc2UpO1xuXHRcdFx0dGhpcy5fc2V0RHJhZnRTdGF0dXMoRHJhZnRTdGF0dXMuQ2xlYXIpO1xuXHRcdFx0Ly8gd2UgZm9yY2UgdGhlIGVkaXQgc3RhdGUgZXZlbiBmb3IgRkNMIGJlY2F1c2UgdGhlIGRyYWZ0IGRpc2NhcmQgbWlnaHQgbm90IGJlIGltcGxlbWVudGVkXG5cdFx0XHQvLyBhbmQgd2UgbWF5IGp1c3QgZGVsZXRlIHRoZSBkcmFmdFxuXHRcdFx0RWRpdFN0YXRlLnNldEVkaXRTdGF0ZURpcnR5KCk7XG5cblx0XHRcdGlmICghY2FuY2VsUmVzdWx0KSB7XG5cdFx0XHRcdHRoaXMuX3NlbmRBY3Rpdml0eShBY3Rpdml0eS5EaXNjYXJkLCB1bmRlZmluZWQpO1xuXHRcdFx0XHQvL2luIGNhc2Ugb2YgYSBuZXcgZG9jdW1lbnQsIG5vIGFjdGl2ZUNvbnRleHQgaXMgcmV0dXJuZWQgLS0+IG5hdmlnYXRlIGJhY2suXG5cdFx0XHRcdGlmICghbUluUGFyYW1ldGVycy5za2lwQmFja05hdmlnYXRpb24pIHtcblx0XHRcdFx0XHRhd2FpdCB0aGlzLl9nZXRSb3V0aW5nTGlzdGVuZXIoKS5uYXZpZ2F0ZUJhY2tGcm9tQ29udGV4dChvQ29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG9BY3RpdmVEb2N1bWVudENvbnRleHQgPSBjYW5jZWxSZXN1bHQgYXMgVjRDb250ZXh0O1xuXHRcdFx0XHR0aGlzLl9zZW5kQWN0aXZpdHkoQWN0aXZpdHkuRGlzY2FyZCwgb0FjdGl2ZURvY3VtZW50Q29udGV4dCk7XG5cdFx0XHRcdGxldCBjb250ZXh0VG9OYXZpZ2F0ZSA9IG9BY3RpdmVEb2N1bWVudENvbnRleHQ7XG5cdFx0XHRcdGlmICh0aGlzLl9pc0ZjbEVuYWJsZWQoKSkge1xuXHRcdFx0XHRcdHNpYmxpbmdJbmZvID0gc2libGluZ0luZm8gPz8gdGhpcy5fY3JlYXRlU2libGluZ0luZm8ob0NvbnRleHQsIG9BY3RpdmVEb2N1bWVudENvbnRleHQpO1xuXHRcdFx0XHRcdHRoaXMuX3VwZGF0ZVBhdGhzSW5IaXN0b3J5KHNpYmxpbmdJbmZvLnBhdGhNYXBwaW5nKTtcblx0XHRcdFx0XHRpZiAoc2libGluZ0luZm8udGFyZ2V0Q29udGV4dC5nZXRQYXRoKCkgIT09IG9BY3RpdmVEb2N1bWVudENvbnRleHQuZ2V0UGF0aCgpKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0VG9OYXZpZ2F0ZSA9IHNpYmxpbmdJbmZvLnRhcmdldENvbnRleHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0KSB7XG5cdFx0XHRcdFx0Ly8gV2UgbmVlZCB0byBsb2FkIHRoZSBzZW1hbnRpYyBrZXlzIG9mIHRoZSBhY3RpdmUgY29udGV4dCwgYXMgd2UgbmVlZCB0aGVtXG5cdFx0XHRcdFx0Ly8gZm9yIHRoZSBuYXZpZ2F0aW9uXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5fZmV0Y2hTZW1hbnRpY0tleVZhbHVlcyhvQWN0aXZlRG9jdW1lbnRDb250ZXh0KTtcblx0XHRcdFx0XHQvLyBXZSBmb3JjZSB0aGUgcmVjcmVhdGlvbiBvZiB0aGUgY29udGV4dCwgc28gdGhhdCBpdCdzIGNyZWF0ZWQgYW5kIGJvdW5kIGluIHRoZSBzYW1lIG1pY3JvdGFzayxcblx0XHRcdFx0XHQvLyBzbyB0aGF0IGFsbCBwcm9wZXJ0aWVzIGFyZSBsb2FkZWQgdG9nZXRoZXIgYnkgYXV0b0V4cGFuZFNlbGVjdCwgc28gdGhhdCB3aGVuIHN3aXRjaGluZyBiYWNrIHRvIEVkaXQgbW9kZVxuXHRcdFx0XHRcdC8vICQkaW5oZXJpdEV4cGFuZFNlbGVjdCB0YWtlcyBhbGwgbG9hZGVkIHByb3BlcnRpZXMgaW50byBhY2NvdW50IChCQ1AgMjA3MDQ2MjI2NSlcblx0XHRcdFx0XHRpZiAoIW1JblBhcmFtZXRlcnMuc2tpcEJpbmRpbmdUb1ZpZXcpIHtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuX2hhbmRsZU5ld0NvbnRleHQoY29udGV4dFRvTmF2aWdhdGUsIGZhbHNlLCB0cnVlLCBiRHJhZnROYXZpZ2F0aW9uLCB0cnVlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9BY3RpdmVEb2N1bWVudENvbnRleHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vYWN0aXZlIGNvbnRleHQgaXMgcmV0dXJuZWQgaW4gY2FzZSBvZiBjYW5jZWwgb2YgZXhpc3RpbmcgZG9jdW1lbnRcblx0XHRcdFx0XHRhd2FpdCB0aGlzLl9oYW5kbGVOZXdDb250ZXh0KGNvbnRleHRUb05hdmlnYXRlLCBmYWxzZSwgZmFsc2UsIGJEcmFmdE5hdmlnYXRpb24sIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAob0Vycm9yKSB7XG5cdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBkaXNjYXJkaW5nIHRoZSBkb2N1bWVudFwiLCBvRXJyb3IgYXMgYW55KTtcblx0XHR9XG5cdH1cblxuXHQvLyBJbnRlcm5hbCBvbmx5IHBhcmFtcyAtLS1cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IG1QYXJhbWV0ZXJzLmVudGl0eVNldE5hbWUgTmFtZSBvZiB0aGUgRW50aXR5U2V0IHRvIHdoaWNoIHRoZSBvYmplY3QgYmVsb25nc1xuXG5cdC8qKlxuXHQgKiBEZWxldGVzIHRoZSBkb2N1bWVudC5cblx0ICpcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEBwYXJhbSBvQ29udGV4dCAgQ29udGV4dCBvZiB0aGUgZG9jdW1lbnRcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMgQ2FuIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy50aXRsZSBUaXRsZSBvZiB0aGUgb2JqZWN0IGJlaW5nIGRlbGV0ZWRcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMuZGVzY3JpcHRpb24gRGVzY3JpcHRpb24gb2YgdGhlIG9iamVjdCBiZWluZyBkZWxldGVkXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZXMgb25jZSBkb2N1bWVudCBoYXMgYmVlbiBkZWxldGVkXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNkZWxldGVEb2N1bWVudFxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjkwLjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRkZWxldGVEb2N1bWVudChvQ29udGV4dDogQ29udGV4dCwgbUluUGFyYW1ldGVyczogeyB0aXRsZTogc3RyaW5nOyBkZXNjcmlwdGlvbjogc3RyaW5nIH0pOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuZ2V0VmlldygpKTtcblx0XHRsZXQgbVBhcmFtZXRlcnM6IGFueSA9IG1JblBhcmFtZXRlcnM7XG5cdFx0aWYgKCFtUGFyYW1ldGVycykge1xuXHRcdFx0bVBhcmFtZXRlcnMgPSB7XG5cdFx0XHRcdGJGaW5kQWN0aXZlQ29udGV4dHM6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtUGFyYW1ldGVycy5iRmluZEFjdGl2ZUNvbnRleHRzID0gZmFsc2U7XG5cdFx0fVxuXHRcdG1QYXJhbWV0ZXJzLmJlZm9yZURlbGV0ZUNhbGxCYWNrID0gdGhpcy5iYXNlLmVkaXRGbG93Lm9uQmVmb3JlRGVsZXRlO1xuXHRcdHJldHVybiB0aGlzLl9kZWxldGVEb2N1bWVudFRyYW5zYWN0aW9uKG9Db250ZXh0LCBtUGFyYW1ldGVycylcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly8gU2luZ2xlIG9iamV0IGRlbGV0aW9uIGlzIHRyaWdnZXJlZCBmcm9tIGFuIE9QIGhlYWRlciBidXR0b24gKG5vdCBmcm9tIGEgbGlzdClcblx0XHRcdFx0Ly8gLS0+IE1hcmsgVUkgZGlydHkgYW5kIG5hdmlnYXRlIGJhY2sgdG8gZGlzbWlzcyB0aGUgT1Bcblx0XHRcdFx0aWYgKCF0aGlzLl9pc0ZjbEVuYWJsZWQoKSkge1xuXHRcdFx0XHRcdEVkaXRTdGF0ZS5zZXRFZGl0U3RhdGVEaXJ0eSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3NlbmRBY3Rpdml0eShBY3Rpdml0eS5EZWxldGUsIG9Db250ZXh0KTtcblxuXHRcdFx0XHQvLyBBZnRlciBkZWxldGUgaXMgc3VjY2Vzc2Z1bGwsIHdlIG5lZWQgdG8gZGV0YWNoIHRoZSBzZXRCYWNrTmF2aWdhdGlvbiBNZXRob2RzXG5cdFx0XHRcdGlmIChvQXBwQ29tcG9uZW50KSB7XG5cdFx0XHRcdFx0b0FwcENvbXBvbmVudC5nZXRTaGVsbFNlcnZpY2VzKCkuc2V0QmFja05hdmlnYXRpb24oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvQXBwQ29tcG9uZW50Py5nZXRTdGFydHVwTW9kZSgpID09PSBTdGFydHVwTW9kZS5EZWVwbGluayAmJiAhdGhpcy5faXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdFx0XHQvLyBJbiBjYXNlIHRoZSBhcHAgaGFzIGJlZW4gbGF1bmNoZWQgd2l0aCBzZW1hbnRpYyBrZXlzLCBkZWxldGluZyB0aGUgb2JqZWN0IHdlJ3ZlIGxhbmRlZCBvbiBzaGFsbCBuYXZpZ2F0ZSBiYWNrXG5cdFx0XHRcdFx0Ly8gdG8gdGhlIGFwcCB3ZSBjYW1lIGZyb20gKGV4Y2VwdCBmb3IgRkNMLCB3aGVyZSB3ZSBuYXZpZ2F0ZSB0byBMUiBhcyB1c3VhbClcblx0XHRcdFx0XHRvQXBwQ29tcG9uZW50LmdldFJvdXRlclByb3h5KCkuZXhpdEZyb21BcHAoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9nZXRSb3V0aW5nTGlzdGVuZXIoKS5uYXZpZ2F0ZUJhY2tGcm9tQ29udGV4dChvQ29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGRlbGV0aW5nIHRoZSBkb2N1bWVudFwiLCBvRXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogU3VibWl0IHRoZSBjdXJyZW50IHNldCBvZiBjaGFuZ2VzIGFuZCBuYXZpZ2F0ZSBiYWNrLlxuXHQgKlxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3dcblx0ICogQHBhcmFtIG9Db250ZXh0ICBDb250ZXh0IG9mIHRoZSBkb2N1bWVudFxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIG9uY2UgdGhlIGNoYW5nZXMgaGF2ZSBiZWVuIHNhdmVkXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0RmxvdyNhcHBseURvY3VtZW50XG5cdCAqIEBwdWJsaWNcblx0ICogQHNpbmNlIDEuOTAuMFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGFzeW5jIGFwcGx5RG9jdW1lbnQob0NvbnRleHQ6IG9iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IG9Mb2NrT2JqZWN0ID0gdGhpcy5fZ2V0R2xvYmFsVUlNb2RlbCgpO1xuXHRcdEJ1c3lMb2NrZXIubG9jayhvTG9ja09iamVjdCk7XG5cblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgdGhpcy5fc3luY1Rhc2soKTtcblx0XHRcdGF3YWl0IHRoaXMuX3N1Ym1pdE9wZW5DaGFuZ2VzKG9Db250ZXh0KTtcblx0XHRcdGF3YWl0IHRoaXMuX2NoZWNrRm9yVmFsaWRhdGlvbkVycm9ycygpO1xuXHRcdFx0YXdhaXQgdGhpcy5fZ2V0TWVzc2FnZUhhbmRsZXIoKS5zaG93TWVzc2FnZURpYWxvZygpO1xuXHRcdFx0YXdhaXQgdGhpcy5fZ2V0Um91dGluZ0xpc3RlbmVyKCkubmF2aWdhdGVCYWNrRnJvbUNvbnRleHQob0NvbnRleHQpO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRpZiAoQnVzeUxvY2tlci5pc0xvY2tlZChvTG9ja09iamVjdCkpIHtcblx0XHRcdFx0QnVzeUxvY2tlci51bmxvY2sob0xvY2tPYmplY3QpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEludGVybmFsIG9ubHkgcGFyYW1zIC0tLVxuXHQvLyBAcGFyYW0ge2Jvb2xlYW59IFttUGFyYW1ldGVycy5iU3RhdGljQWN0aW9uXSBCb29sZWFuIHZhbHVlIGZvciBzdGF0aWMgYWN0aW9uLCB1bmRlZmluZWQgZm9yIG90aGVyIGFjdGlvbnNcblx0Ly8gQHBhcmFtIHtib29sZWFufSBbbVBhcmFtZXRlcnMuaXNOYXZpZ2FibGVdIEJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIG5hdmlnYXRpb24gaXMgcmVxdWlyZWQgYWZ0ZXIgdGhlIGFjdGlvbiBoYXMgYmVlbiBleGVjdXRlZFxuXHQvLyBDdXJyZW50bHkgdGhlIHBhcmFtZXRlciBpc05hdmlnYWJsZSBpcyB1c2VkIGludGVybmFsbHkgYW5kIHNob3VsZCBiZSBjaGFuZ2VkIHRvIHJlcXVpcmVzTmF2aWdhdGlvbiBhcyBpdCBpcyBhIG1vcmUgYXB0IG5hbWUgZm9yIHRoaXMgcGFyYW1cblxuXHQvKipcblx0ICogSW52b2tlcyBhbiBhY3Rpb24gKGJvdW5kIG9yIHVuYm91bmQpIGFuZCB0cmFja3MgdGhlIGNoYW5nZXMgc28gdGhhdCBvdGhlciBwYWdlcyBjYW4gYmUgcmVmcmVzaGVkIGFuZCBzaG93IHRoZSB1cGRhdGVkIGRhdGEgdXBvbiBuYXZpZ2F0aW9uLlxuXHQgKlxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3dcblx0ICogQHBhcmFtIHNBY3Rpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gdG8gYmUgY2FsbGVkXG5cdCAqIEBwYXJhbSBtSW5QYXJhbWV0ZXJzIENvbnRhaW5zIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMucGFyYW1ldGVyVmFsdWVzIEEgbWFwIG9mIGFjdGlvbiBwYXJhbWV0ZXIgbmFtZXMgYW5kIHByb3ZpZGVkIHZhbHVlc1xuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy5wYXJhbWV0ZXJWYWx1ZXMubmFtZSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXJcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMucGFyYW1ldGVyVmFsdWVzLnZhbHVlIFZhbHVlIG9mIHRoZSBwYXJhbWV0ZXJcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMuc2tpcFBhcmFtZXRlckRpYWxvZyBTa2lwcyB0aGUgYWN0aW9uIHBhcmFtZXRlciBkaWFsb2cgaWYgdmFsdWVzIGFyZSBwcm92aWRlZCBmb3IgYWxsIG9mIHRoZW0gaW4gcGFyYW1ldGVyVmFsdWVzXG5cdCAqIEBwYXJhbSBtSW5QYXJhbWV0ZXJzLmNvbnRleHRzIEZvciBhIGJvdW5kIGFjdGlvbiwgYSBjb250ZXh0IG9yIGFuIGFycmF5IHdpdGggY29udGV4dHMgZm9yIHdoaWNoIHRoZSBhY3Rpb24gaXMgdG8gYmUgY2FsbGVkIG11c3QgYmUgcHJvdmlkZWRcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMubW9kZWwgRm9yIGFuIHVuYm91bmQgYWN0aW9uLCBhbiBpbnN0YW5jZSBvZiBhbiBPRGF0YSBWNCBtb2RlbCBtdXN0IGJlIHByb3ZpZGVkXG5cdCAqIEBwYXJhbSBtSW5QYXJhbWV0ZXJzLnJlcXVpcmVzTmF2aWdhdGlvbiBCb29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciBuYXZpZ2F0aW9uIGlzIHJlcXVpcmVkIGFmdGVyIHRoZSBhY3Rpb24gaGFzIGJlZW4gZXhlY3V0ZWQuIE5hdmlnYXRpb24gdGFrZXMgcGxhY2UgdG8gdGhlIGNvbnRleHQgcmV0dXJuZWQgYnkgdGhlIGFjdGlvblxuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy5sYWJlbCBBIGh1bWFuLXJlYWRhYmxlIGxhYmVsIGZvciB0aGUgYWN0aW9uLiBUaGlzIGlzIG5lZWRlZCBpbiBjYXNlIHRoZSBhY3Rpb24gaGFzIGEgcGFyYW1ldGVyIGFuZCBhIHBhcmFtZXRlciBkaWFsb2cgaXMgc2hvd24gdG8gdGhlIHVzZXIuIFRoZSBsYWJlbCB3aWxsIGJlIHVzZWQgZm9yIHRoZSB0aXRsZSBvZiB0aGUgZGlhbG9nIGFuZCBmb3IgdGhlIGNvbmZpcm1hdGlvbiBidXR0b25cblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMuaW52b2NhdGlvbkdyb3VwaW5nIE1vZGUgaG93IGFjdGlvbnMgYXJlIHRvIGJlIGNhbGxlZDogJ0NoYW5nZVNldCcgdG8gcHV0IGFsbCBhY3Rpb24gY2FsbHMgaW50byBvbmUgY2hhbmdlc2V0LCAnSXNvbGF0ZWQnIHRvIHB1dCB0aGVtIGludG8gc2VwYXJhdGUgY2hhbmdlc2V0c1xuXHQgKiBAcGFyYW0gbUV4dHJhUGFyYW1zIFBSSVZBVEVcblx0ICogQHJldHVybnMgQSBwcm9taXNlIHdoaWNoIHJlc29sdmVzIG9uY2UgdGhlIGFjdGlvbiBoYXMgYmVlbiBleGVjdXRlZCwgcHJvdmlkaW5nIHRoZSByZXNwb25zZVxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3cjaW52b2tlQWN0aW9uXG5cdCAqIEBwdWJsaWNcblx0ICogQHNpbmNlIDEuOTAuMFxuXHQgKiBAZmluYWxcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRhc3luYyBpbnZva2VBY3Rpb24oXG5cdFx0c0FjdGlvbk5hbWU6IHN0cmluZyxcblx0XHRtSW5QYXJhbWV0ZXJzPzoge1xuXHRcdFx0cGFyYW1ldGVyVmFsdWVzPzogeyBuYW1lOiBzdHJpbmc7IHZhbHVlOiBhbnkgfTtcblx0XHRcdHNraXBQYXJhbWV0ZXJEaWFsb2c/OiBib29sZWFuO1xuXHRcdFx0Y29udGV4dHM/OiBDb250ZXh0IHwgQ29udGV4dFtdO1xuXHRcdFx0bW9kZWw/OiBPRGF0YU1vZGVsO1xuXHRcdFx0cmVxdWlyZXNOYXZpZ2F0aW9uPzogYm9vbGVhbjtcblx0XHRcdGxhYmVsPzogc3RyaW5nO1xuXHRcdFx0aW52b2NhdGlvbkdyb3VwaW5nPzogc3RyaW5nO1xuXHRcdH0sXG5cdFx0bUV4dHJhUGFyYW1zPzogYW55XG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGxldCBvQ29udHJvbDogYW55O1xuXHRcdGNvbnN0IHRyYW5zYWN0aW9uSGVscGVyID0gdGhpcy5fZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKTtcblx0XHRsZXQgYVBhcnRzO1xuXHRcdGxldCBzT3ZlcmxvYWRFbnRpdHlUeXBlO1xuXHRcdGxldCBvQ3VycmVudEFjdGlvbkNhbGxCYWNrczogYW55O1xuXHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCk7XG5cblx0XHRsZXQgbVBhcmFtZXRlcnM6IGFueSA9IG1JblBhcmFtZXRlcnMgfHwge307XG5cblx0XHQvLyBEdWUgdG8gYSBtaXN0YWtlIHRoZSBpbnZva2VBY3Rpb24gaW4gdGhlIGV4dGVuc2lvbkFQSSBoYWQgYSBkaWZmZXJlbnQgQVBJIHRoYW4gdGhpcyBvbmUuXG5cdFx0Ly8gVGhlIG9uZSBmcm9tIHRoZSBleHRlbnNpb25BUEkgZG9lc24ndCBleGlzdCBhbnltb3JlIGFzIHdlIGV4cG9zZSB0aGUgZnVsbCBlZGl0IGZsb3cgbm93IGJ1dFxuXHRcdC8vIGR1ZSB0byBjb21wYXRpYmlsaXR5IHJlYXNvbnMgd2Ugc3RpbGwgbmVlZCB0byBzdXBwb3J0IHRoZSBvbGQgc2lnbmF0dXJlXG5cdFx0aWYgKFxuXHRcdFx0KG1QYXJhbWV0ZXJzLmlzQSAmJiBtUGFyYW1ldGVycy5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuQ29udGV4dFwiKSkgfHxcblx0XHRcdEFycmF5LmlzQXJyYXkobVBhcmFtZXRlcnMpIHx8XG5cdFx0XHRtRXh0cmFQYXJhbXMgIT09IHVuZGVmaW5lZFxuXHRcdCkge1xuXHRcdFx0Y29uc3QgY29udGV4dHMgPSBtUGFyYW1ldGVycztcblx0XHRcdG1QYXJhbWV0ZXJzID0gbUV4dHJhUGFyYW1zIHx8IHt9O1xuXHRcdFx0aWYgKGNvbnRleHRzKSB7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNvbnRleHRzID0gY29udGV4dHM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtUGFyYW1ldGVycy5tb2RlbCA9IHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bVBhcmFtZXRlcnMuaXNOYXZpZ2FibGUgPSBtUGFyYW1ldGVycy5yZXF1aXJlc05hdmlnYXRpb24gfHwgbVBhcmFtZXRlcnMuaXNOYXZpZ2FibGU7XG5cblx0XHRpZiAoIW1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wpIHtcblx0XHRcdG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wgPSB0aGlzLmdldFZpZXcoKTtcblx0XHR9XG5cblx0XHRpZiAobVBhcmFtZXRlcnMuY29udHJvbElkKSB7XG5cdFx0XHRvQ29udHJvbCA9IHRoaXMuZ2V0VmlldygpLmJ5SWQobVBhcmFtZXRlcnMuY29udHJvbElkKTtcblx0XHRcdGlmIChvQ29udHJvbCkge1xuXHRcdFx0XHQvLyBUT0RPOiBjdXJyZW50bHkgdGhpcyBzZWxlY3RlZCBjb250ZXh0cyB1cGRhdGUgaXMgZG9uZSB3aXRoaW4gdGhlIG9wZXJhdGlvbiwgc2hvdWxkIGJlIG1vdmVkIG91dFxuXHRcdFx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dCA9IG9Db250cm9sLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0ID0gb1ZpZXcuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKTtcblx0XHR9XG5cblx0XHRpZiAoc0FjdGlvbk5hbWUgJiYgc0FjdGlvbk5hbWUuaW5kZXhPZihcIihcIikgPiAtMSkge1xuXHRcdFx0Ly8gZ2V0IGVudGl0eSB0eXBlIG9mIGFjdGlvbiBvdmVybG9hZCBhbmQgcmVtb3ZlIGl0IGZyb20gdGhlIGFjdGlvbiBwYXRoXG5cdFx0XHQvLyBFeGFtcGxlIHNBY3Rpb25OYW1lID0gXCI8QWN0aW9uTmFtZT4oQ29sbGVjdGlvbig8T3ZlcmxvYWRFbnRpdHlUeXBlPikpXCJcblx0XHRcdC8vIHNBY3Rpb25OYW1lID0gYVBhcnRzWzBdIC0tPiA8QWN0aW9uTmFtZT5cblx0XHRcdC8vIHNPdmVybG9hZEVudGl0eVR5cGUgPSBhUGFydHNbMl0gLS0+IDxPdmVybG9hZEVudGl0eVR5cGU+XG5cdFx0XHRhUGFydHMgPSBzQWN0aW9uTmFtZS5zcGxpdChcIihcIik7XG5cdFx0XHRzQWN0aW9uTmFtZSA9IGFQYXJ0c1swXTtcblx0XHRcdHNPdmVybG9hZEVudGl0eVR5cGUgPSAoYVBhcnRzW2FQYXJ0cy5sZW5ndGggLSAxXSBhcyBhbnkpLnJlcGxhY2VBbGwoXCIpXCIsIFwiXCIpO1xuXHRcdH1cblxuXHRcdGlmIChtUGFyYW1ldGVycy5iU3RhdGljQWN0aW9uKSB7XG5cdFx0XHRpZiAob0NvbnRyb2wuaXNUYWJsZUJvdW5kKCkpIHtcblx0XHRcdFx0bVBhcmFtZXRlcnMuY29udGV4dHMgPSBvQ29udHJvbC5nZXRSb3dCaW5kaW5nKCkuZ2V0SGVhZGVyQ29udGV4dCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3Qgc0JpbmRpbmdQYXRoID0gb0NvbnRyb2wuZGF0YShcInJvd3NCaW5kaW5nSW5mb1wiKS5wYXRoLFxuXHRcdFx0XHRcdG9MaXN0QmluZGluZyA9IG5ldyAoT0RhdGFMaXN0QmluZGluZyBhcyBhbnkpKHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKCksIHNCaW5kaW5nUGF0aCk7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmNvbnRleHRzID0gb0xpc3RCaW5kaW5nLmdldEhlYWRlckNvbnRleHQoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNPdmVybG9hZEVudGl0eVR5cGUgJiYgb0NvbnRyb2wuZ2V0QmluZGluZ0NvbnRleHQoKSkge1xuXHRcdFx0XHRtUGFyYW1ldGVycy5jb250ZXh0cyA9IHRoaXMuX2dldEFjdGlvbk92ZXJsb2FkQ29udGV4dEZyb21NZXRhZGF0YVBhdGgoXG5cdFx0XHRcdFx0b0NvbnRyb2wuZ2V0QmluZGluZ0NvbnRleHQoKSxcblx0XHRcdFx0XHRvQ29udHJvbC5nZXRSb3dCaW5kaW5nKCksXG5cdFx0XHRcdFx0c092ZXJsb2FkRW50aXR5VHlwZVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobVBhcmFtZXRlcnMuZW5hYmxlQXV0b1Njcm9sbCkge1xuXHRcdFx0XHRvQ3VycmVudEFjdGlvbkNhbGxCYWNrcyA9IHRoaXMuX2NyZWF0ZUFjdGlvblByb21pc2Uoc0FjdGlvbk5hbWUsIG9Db250cm9sLnNJZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG1QYXJhbWV0ZXJzLmJHZXRCb3VuZENvbnRleHQgPSB0aGlzLl9nZXRCb3VuZENvbnRleHQob1ZpZXcsIG1QYXJhbWV0ZXJzKTtcblx0XHQvLyBOZWVkIHRvIGtub3cgdGhhdCB0aGUgYWN0aW9uIGlzIGNhbGxlZCBmcm9tIE9iamVjdFBhZ2UgZm9yIGNoYW5nZVNldCBJc29sYXRlZCB3b3JrYXJvdW5kXG5cdFx0bVBhcmFtZXRlcnMuYk9iamVjdFBhZ2UgPSAob1ZpZXcuZ2V0Vmlld0RhdGEoKSBhcyBhbnkpLmNvbnZlcnRlclR5cGUgPT09IFwiT2JqZWN0UGFnZVwiO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRoaXMuX3N5bmNUYXNrKCk7XG5cdFx0XHRjb25zdCBvUmVzcG9uc2UgPSBhd2FpdCB0cmFuc2FjdGlvbkhlbHBlci5jYWxsQWN0aW9uLmJpbmQoXG5cdFx0XHRcdHRyYW5zYWN0aW9uSGVscGVyLFxuXHRcdFx0XHRzQWN0aW9uTmFtZSxcblx0XHRcdFx0bVBhcmFtZXRlcnMsXG5cdFx0XHRcdHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0XHR0aGlzLl9nZXRNZXNzYWdlSGFuZGxlcigpXG5cdFx0XHQpKCk7XG5cdFx0XHRpZiAobVBhcmFtZXRlcnMuY29udGV4dHMpIHtcblx0XHRcdFx0YXdhaXQgdGhpcy5fcmVmcmVzaExpc3RJZlJlcXVpcmVkKHRoaXMuX2dldEFjdGlvblJlc3BvbnNlRGF0YUFuZEtleXMoc0FjdGlvbk5hbWUsIG9SZXNwb25zZSksIG1QYXJhbWV0ZXJzLmNvbnRleHRzWzBdKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3NlbmRBY3Rpdml0eShBY3Rpdml0eS5BY3Rpb24sIG1QYXJhbWV0ZXJzLmNvbnRleHRzKTtcblx0XHRcdHRoaXMuX3RyaWdnZXJDb25maWd1cmVkU3VydmV5KHNBY3Rpb25OYW1lLCBUcmlnZ2VyVHlwZS5hY3Rpb24pO1xuXG5cdFx0XHRpZiAob0N1cnJlbnRBY3Rpb25DYWxsQmFja3MpIHtcblx0XHRcdFx0b0N1cnJlbnRBY3Rpb25DYWxsQmFja3MuZlJlc29sdmVyKG9SZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0XHQvKlxuXHRcdFx0XHRcdFdlIHNldCB0aGUgKHVwcGVyKSBwYWdlcyB0byBkaXJ0eSBhZnRlciBhbiBleGVjdXRpb24gb2YgYW4gYWN0aW9uXG5cdFx0XHRcdFx0VE9ETzogZ2V0IHJpZCBvZiB0aGlzIHdvcmthcm91bmRcblx0XHRcdFx0XHRUaGlzIHdvcmthcm91bmQgaXMgb25seSBuZWVkZWQgYXMgbG9uZyBhcyB0aGUgbW9kZWwgZG9lcyBub3Qgc3VwcG9ydCB0aGUgc3luY2hyb25pemF0aW9uLlxuXHRcdFx0XHRcdE9uY2UgdGhpcyBpcyBzdXBwb3J0ZWQgd2UgZG9uJ3QgbmVlZCB0byBzZXQgdGhlIHBhZ2VzIHRvIGRpcnR5IGFueW1vcmUgYXMgdGhlIGNvbnRleHQgaXRzZWxmXG5cdFx0XHRcdFx0aXMgYWxyZWFkeSByZWZyZXNoZWQgKGl0J3MganVzdCBub3QgcmVmbGVjdGVkIGluIHRoZSBvYmplY3QgcGFnZSlcblx0XHRcdFx0XHR3ZSBleHBsaWNpdGx5IGRvbid0IGNhbGwgdGhpcyBtZXRob2QgZnJvbSB0aGUgbGlzdCByZXBvcnQgYnV0IG9ubHkgY2FsbCBpdCBmcm9tIHRoZSBvYmplY3QgcGFnZVxuXHRcdFx0XHRcdGFzIGlmIGl0IGlzIGNhbGxlZCBpbiB0aGUgbGlzdCByZXBvcnQgaXQncyBub3QgbmVlZGVkIC0gYXMgd2UgYW55d2F5IHdpbGwgcmVtb3ZlIHRoaXMgbG9naWNcblx0XHRcdFx0XHR3ZSBjYW4gbGl2ZSB3aXRoIHRoaXNcblx0XHRcdFx0XHR3ZSBuZWVkIGEgY29udGV4dCB0byBzZXQgdGhlIHVwcGVyIHBhZ2VzIHRvIGRpcnR5IC0gaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiBvbmUgd2UgdXNlIHRoZVxuXHRcdFx0XHRcdGZpcnN0IG9uZSBhcyB0aGV5IGFyZSBhbnl3YXkgc2libGluZ3Ncblx0XHRcdFx0XHQqL1xuXHRcdFx0aWYgKG1QYXJhbWV0ZXJzLmNvbnRleHRzKSB7XG5cdFx0XHRcdGlmICghdGhpcy5faXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdFx0XHRFZGl0U3RhdGUuc2V0RWRpdFN0YXRlRGlydHkoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9nZXRJbnRlcm5hbE1vZGVsKCkuc2V0UHJvcGVydHkoXCIvc0N1c3RvbUFjdGlvblwiLCBzQWN0aW9uTmFtZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobVBhcmFtZXRlcnMuaXNOYXZpZ2FibGUpIHtcblx0XHRcdFx0bGV0IHZDb250ZXh0ID0gb1Jlc3BvbnNlO1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2Q29udGV4dCkgJiYgdkNvbnRleHQubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0dkNvbnRleHQgPSB2Q29udGV4dFswXS52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodkNvbnRleHQgJiYgIUFycmF5LmlzQXJyYXkodkNvbnRleHQpKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9WaWV3LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkgYXMgT0RhdGFNZXRhTW9kZWw7XG5cdFx0XHRcdFx0Y29uc3Qgc0NvbnRleHRNZXRhUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgodkNvbnRleHQuZ2V0UGF0aCgpKTtcblx0XHRcdFx0XHRjb25zdCBfZm5WYWxpZENvbnRleHRzID0gKGNvbnRleHRzOiBhbnksIGFwcGxpY2FibGVDb250ZXh0czogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY29udGV4dHMuZmlsdGVyKChlbGVtZW50OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGFwcGxpY2FibGVDb250ZXh0cykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBhcHBsaWNhYmxlQ29udGV4dHMuaW5kZXhPZihlbGVtZW50KSA+IC0xO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRjb25zdCBvQWN0aW9uQ29udGV4dCA9IEFycmF5LmlzQXJyYXkobVBhcmFtZXRlcnMuY29udGV4dHMpXG5cdFx0XHRcdFx0XHQ/IF9mblZhbGlkQ29udGV4dHMobVBhcmFtZXRlcnMuY29udGV4dHMsIG1QYXJhbWV0ZXJzLmFwcGxpY2FibGVDb250ZXh0KVswXVxuXHRcdFx0XHRcdFx0OiBtUGFyYW1ldGVycy5jb250ZXh0cztcblx0XHRcdFx0XHRjb25zdCBzQWN0aW9uQ29udGV4dE1ldGFQYXRoID0gb0FjdGlvbkNvbnRleHQgJiYgb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQWN0aW9uQ29udGV4dC5nZXRQYXRoKCkpO1xuXHRcdFx0XHRcdGlmIChzQ29udGV4dE1ldGFQYXRoICE9IHVuZGVmaW5lZCAmJiBzQ29udGV4dE1ldGFQYXRoID09PSBzQWN0aW9uQ29udGV4dE1ldGFQYXRoKSB7XG5cdFx0XHRcdFx0XHRpZiAob0FjdGlvbkNvbnRleHQuZ2V0UGF0aCgpICE9PSB2Q29udGV4dC5nZXRQYXRoKCkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZ2V0Um91dGluZ0xpc3RlbmVyKCkubmF2aWdhdGVGb3J3YXJkVG9Db250ZXh0KHZDb250ZXh0LCB7XG5cdFx0XHRcdFx0XHRcdFx0bm9IaXN0b3J5RW50cnk6IGZhbHNlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0TG9nLmluZm8oXCJOYXZpZ2F0aW9uIHRvIHRoZSBzYW1lIGNvbnRleHQgaXMgbm90IGFsbG93ZWRcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb1Jlc3BvbnNlO1xuXHRcdH0gY2F0Y2ggKGVycjogYW55KSB7XG5cdFx0XHRpZiAob0N1cnJlbnRBY3Rpb25DYWxsQmFja3MpIHtcblx0XHRcdFx0b0N1cnJlbnRBY3Rpb25DYWxsQmFja3MuZlJlamVjdG9yKCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBGSVhNRTogaW4gbW9zdCBzaXR1YXRpb25zIHRoZXJlIGlzIG5vIGhhbmRsZXIgZm9yIHRoZSByZWplY3RlZCBwcm9taXNlcyByZXR1cm5lZHFcblx0XHRcdGlmIChlcnIgPT09IENvbnN0YW50cy5DYW5jZWxBY3Rpb25EaWFsb2cpIHtcblx0XHRcdFx0Ly8gVGhpcyBsZWFkcyB0byBjb25zb2xlIGVycm9yLiBBY3R1YWxseSB0aGUgZXJyb3IgaXMgYWxyZWFkeSBoYW5kbGVkIChjdXJyZW50bHkgZGlyZWN0bHkgaW4gcHJlc3MgaGFuZGxlciBvZiBlbmQgYnV0dG9uIGluIGRpYWxvZyksIHNvIGl0IHNob3VsZCBub3QgYmUgZm9yd2FyZGVkXG5cdFx0XHRcdC8vIHVwIHRvIGhlcmUuIEhvd2V2ZXIsIHdoZW4gZGlhbG9nIGhhbmRsaW5nIGFuZCBiYWNrZW5kIGV4ZWN1dGlvbiBhcmUgc2VwYXJhdGVkLCBpbmZvcm1hdGlvbiB3aGV0aGVyIGRpYWxvZyB3YXMgY2FuY2VsbGVkLCBvciBiYWNrZW5kIGV4ZWN1dGlvbiBoYXMgZmFpbGVkIG5lZWRzXG5cdFx0XHRcdC8vIHRvIGJlIHRyYW5zcG9ydGVkIHRvIHRoZSBwbGFjZSByZXNwb25zaWJsZSBmb3IgY29ubmVjdGluZyB0aGVzZSB0d28gdGhpbmdzLlxuXHRcdFx0XHQvLyBUT0RPOiByZW1vdmUgc3BlY2lhbCBoYW5kbGluZyBvbmUgZGlhbG9nIGhhbmRsaW5nIGFuZCBiYWNrZW5kIGV4ZWN1dGlvbiBhcmUgc2VwYXJhdGVkXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkRpYWxvZyBjYW5jZWxsZWRcIik7XG5cdFx0XHR9IGVsc2UgaWYgKCEoZXJyICYmIChlcnIuY2FuY2VsZWQgfHwgKGVyci5yZWplY3RlZEl0ZW1zICYmIGVyci5yZWplY3RlZEl0ZW1zWzBdLmNhbmNlbGVkKSkpKSB7XG5cdFx0XHRcdC8vIFRPRE86IGFuYWx5emUsIHdoZXRoZXIgdGhpcyBpcyBvZiB0aGUgc2FtZSBjYXRlZ29yeSBhcyBhYm92ZVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluIEVkaXRGbG93Lmludm9rZUFjdGlvbjoke2Vycn1gKTtcblx0XHRcdH1cblx0XHRcdC8vIFRPRE86IEFueSB1bmV4cGVjdGVkIGVycm9ycyBwcm9iYWJseSBzaG91bGQgbm90IGJlIGlnbm9yZWQhXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNlY3VyZWQgZXhlY3V0aW9uIG9mIHRoZSBnaXZlbiBmdW5jdGlvbi4gRW5zdXJlcyB0aGF0IHRoZSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIHdoZW4gY2VydGFpbiBjb25kaXRpb25zIGFyZSBmdWxmaWxsZWQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gZm5GdW5jdGlvbiBUaGUgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQuIFNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCBhZnRlciBjb21wbGV0aW9uIG9mIHRoZSBleGVjdXRpb24uIElmIG5vdGhpbmcgaXMgcmV0dXJuZWQsIGltbWVkaWF0ZSBjb21wbGV0aW9uIGlzIGFzc3VtZWQuXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBEZWZpbml0aW9ucyBvZiB0aGUgcHJlY29uZGl0aW9ucyB0byBiZSBjaGVja2VkIGJlZm9yZSBleGVjdXRpb25cblx0ICogQHBhcmFtIG1QYXJhbWV0ZXJzLmJ1c3kgRGVmaW5lcyB0aGUgYnVzeSBpbmRpY2F0b3Jcblx0ICogQHBhcmFtIG1QYXJhbWV0ZXJzLmJ1c3kuc2V0IFRyaWdnZXJzIGEgYnVzeSBpbmRpY2F0b3Igd2hlbiB0aGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5idXN5LmNoZWNrIEV4ZWN1dGVzIGZ1bmN0aW9uIG9ubHkgaWYgYXBwbGljYXRpb24gaXNuJ3QgYnVzeS5cblx0ICogQHBhcmFtIG1QYXJhbWV0ZXJzLnVwZGF0ZXNEb2N1bWVudCBUaGlzIG9wZXJhdGlvbiB1cGRhdGVzIHRoZSBjdXJyZW50IGRvY3VtZW50IHdpdGhvdXQgdXNpbmcgdGhlIGJvdW5kIG1vZGVsIGFuZCBjb250ZXh0LiBBcyBhIHJlc3VsdCwgdGhlIGRyYWZ0IHN0YXR1cyBpcyB1cGRhdGVkIGlmIGEgZHJhZnQgZG9jdW1lbnQgZXhpc3RzLCBhbmQgdGhlIHVzZXIgaGFzIHRvIGNvbmZpcm0gdGhlIGNhbmNlbGxhdGlvbiBvZiB0aGUgZWRpdGluZyBwcm9jZXNzLlxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCBpcyByZWplY3RlZCBpZiB0aGUgZXhlY3V0aW9uIGlzIHByb2hpYml0ZWQgYW5kIHJlc29sdmVkIGJ5IHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSBmbkZ1bmN0aW9uLlxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3cjc2VjdXJlZEV4ZWN1dGlvblxuXHQgKiBAcHVibGljXG5cdCAqIEBleHBlcmltZW50YWwgQXMgb2YgdmVyc2lvbiAxLjkwLjBcblx0ICogQHNpbmNlIDEuOTAuMFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHNlY3VyZWRFeGVjdXRpb24oXG5cdFx0Zm5GdW5jdGlvbjogRnVuY3Rpb24sXG5cdFx0bVBhcmFtZXRlcnM/OiB7XG5cdFx0XHRidXN5Pzoge1xuXHRcdFx0XHRzZXQ/OiBib29sZWFuO1xuXHRcdFx0XHRjaGVjaz86IGJvb2xlYW47XG5cdFx0XHR9O1xuXHRcdFx0dXBkYXRlc0RvY3VtZW50PzogYm9vbGVhbjtcblx0XHR9XG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGJCdXN5U2V0ID0gbVBhcmFtZXRlcnMgJiYgbVBhcmFtZXRlcnMuYnVzeSAmJiBtUGFyYW1ldGVycy5idXN5LnNldCAhPT0gdW5kZWZpbmVkID8gbVBhcmFtZXRlcnMuYnVzeS5zZXQgOiB0cnVlLFxuXHRcdFx0YkJ1c3lDaGVjayA9IG1QYXJhbWV0ZXJzICYmIG1QYXJhbWV0ZXJzLmJ1c3kgJiYgbVBhcmFtZXRlcnMuYnVzeS5jaGVjayAhPT0gdW5kZWZpbmVkID8gbVBhcmFtZXRlcnMuYnVzeS5jaGVjayA6IHRydWUsXG5cdFx0XHRiVXBkYXRlc0RvY3VtZW50ID0gKG1QYXJhbWV0ZXJzICYmIChtUGFyYW1ldGVycyBhcyBhbnkpLnVwZGF0ZXNEb2N1bWVudCkgfHwgZmFsc2UsXG5cdFx0XHRvTG9ja09iamVjdCA9IHRoaXMuX2dldEdsb2JhbFVJTW9kZWwoKSxcblx0XHRcdG9Db250ZXh0ID0gdGhpcy5iYXNlLmdldFZpZXcoKS5nZXRCaW5kaW5nQ29udGV4dCgpLFxuXHRcdFx0YklzRHJhZnQgPSBvQ29udGV4dCAmJiB0aGlzLl9nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KSA9PT0gUHJvZ3JhbW1pbmdNb2RlbC5EcmFmdDtcblxuXHRcdGlmIChiQnVzeUNoZWNrICYmIEJ1c3lMb2NrZXIuaXNMb2NrZWQob0xvY2tPYmplY3QpKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJBcHBsaWNhdGlvbiBhbHJlYWR5IGJ1c3kgdGhlcmVmb3JlIGV4ZWN1dGlvbiByZWplY3RlZFwiKTtcblx0XHR9XG5cblx0XHQvLyB3ZSBoYXZlIHRvIHNldCBidXN5IGFuZCBkcmFmdCBpbmRpY2F0b3IgaW1tZWRpYXRlbHkgYWxzbyB0aGUgZnVuY3Rpb24gbWlnaHQgYmUgZXhlY3V0ZWQgbGF0ZXIgaW4gcXVldWVcblx0XHRpZiAoYkJ1c3lTZXQpIHtcblx0XHRcdEJ1c3lMb2NrZXIubG9jayhvTG9ja09iamVjdCk7XG5cdFx0fVxuXHRcdGlmIChiVXBkYXRlc0RvY3VtZW50ICYmIGJJc0RyYWZ0KSB7XG5cdFx0XHR0aGlzLl9zZXREcmFmdFN0YXR1cyhEcmFmdFN0YXR1cy5TYXZpbmcpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2dldE1lc3NhZ2VIYW5kbGVyKCkucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fc3luY1Rhc2soZm5GdW5jdGlvbilcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0aWYgKGJVcGRhdGVzRG9jdW1lbnQpIHtcblx0XHRcdFx0XHR0aGlzLl9nZXRUcmFuc2FjdGlvbkhlbHBlcigpLmhhbmRsZURvY3VtZW50TW9kaWZpY2F0aW9ucygpO1xuXHRcdFx0XHRcdGlmICghdGhpcy5faXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdFx0XHRcdEVkaXRTdGF0ZS5zZXRFZGl0U3RhdGVEaXJ0eSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYklzRHJhZnQpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3NldERyYWZ0U3RhdHVzKERyYWZ0U3RhdHVzLlNhdmVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKG9FcnJvcjogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChiVXBkYXRlc0RvY3VtZW50ICYmIGJJc0RyYWZ0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc2V0RHJhZnRTdGF0dXMoRHJhZnRTdGF0dXMuQ2xlYXIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChvRXJyb3IpO1xuXHRcdFx0fSlcblx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0aWYgKGJCdXN5U2V0KSB7XG5cdFx0XHRcdFx0QnVzeUxvY2tlci51bmxvY2sob0xvY2tPYmplY3QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2dldE1lc3NhZ2VIYW5kbGVyKCkuc2hvd01lc3NhZ2VEaWFsb2coKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgdGhlIHBhdGNoU2VudCBldmVudDogcmVnaXN0ZXIgZG9jdW1lbnQgbW9kaWZpY2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0V2ZW50XG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0aGFuZGxlUGF0Y2hTZW50KG9FdmVudDogYW55KSB7XG5cdFx0aWYgKCEodGhpcy5iYXNlLmdldFZpZXcoKT8uZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dCk/LmdldFByb3BlcnR5KFwic2tpcFBhdGNoSGFuZGxlcnNcIikpIHtcblx0XHRcdC8vIENyZWF0ZSBhIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHBhdGggaXMgY29tcGxldGVkXG5cdFx0XHRjb25zdCBvUGF0Y2hQcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRvRXZlbnQuZ2V0U291cmNlKCkuYXR0YWNoRXZlbnRPbmNlKFwicGF0Y2hDb21wbGV0ZWRcIiwgKHBhdGNoQ29tcGxldGVkRXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdGlmIChvRXZlbnQuZ2V0U291cmNlKCkuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIikpIHtcblx0XHRcdFx0XHRcdEFjdGlvblJ1bnRpbWUuc2V0QWN0aW9uRW5hYmxlbWVudEFmdGVyUGF0Y2goXG5cdFx0XHRcdFx0XHRcdHRoaXMuYmFzZS5nZXRWaWV3KCksXG5cdFx0XHRcdFx0XHRcdG9FdmVudC5nZXRTb3VyY2UoKSxcblx0XHRcdFx0XHRcdFx0dGhpcy5iYXNlLmdldFZpZXcoKT8uZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3QgYlN1Y2Nlc3MgPSBwYXRjaENvbXBsZXRlZEV2ZW50LmdldFBhcmFtZXRlcihcInN1Y2Nlc3NcIik7XG5cdFx0XHRcdFx0aWYgKGJTdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlamVjdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnQob0V2ZW50LmdldFNvdXJjZSgpLCBvUGF0Y2hQcm9taXNlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyB0aGUgQ3JlYXRlQWN0aXZhdGUgZXZlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRXZlbnRcblx0ICovXG5cdGhhbmRsZUNyZWF0ZUFjdGl2YXRlKG9FdmVudDogYW55KSB7XG5cdFx0Y29uc3Qgb0JpbmRpbmcgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdFx0Y29uc3QgdHJhbnNhY3Rpb25IZWxwZXIgPSB0aGlzLl9nZXRUcmFuc2FjdGlvbkhlbHBlcigpO1xuXHRcdGNvbnN0IGJBdEVuZCA9IHRydWU7XG5cdFx0Y29uc3QgYkluYWN0aXZlID0gdHJ1ZTtcblx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSB0aGlzLl9nZXRSZXNvdXJjZUJ1bmRsZSgpO1xuXHRcdGNvbnN0IG9QYXJhbXM6IGFueSA9IHtcblx0XHRcdGNyZWF0aW9uTW9kZTogQ3JlYXRpb25Nb2RlLklubGluZSxcblx0XHRcdGNyZWF0ZUF0RW5kOiBiQXRFbmQsXG5cdFx0XHRpbmFjdGl2ZTogYkluYWN0aXZlLFxuXHRcdFx0a2VlcFRyYW5zaWVudENvbnRleHRPbkZhaWxlZDogZmFsc2UsIC8vIGN1cnJlbnRseSBub3QgZnVsbHkgc3VwcG9ydGVkXG5cdFx0XHRidXN5TW9kZTogXCJOb25lXCJcblx0XHR9O1xuXHRcdHRyYW5zYWN0aW9uSGVscGVyLmNyZWF0ZURvY3VtZW50KG9CaW5kaW5nLCBvUGFyYW1zLCBvUmVzb3VyY2VCdW5kbGUsIHRoaXMuX2dldE1lc3NhZ2VIYW5kbGVyKCksIGZhbHNlLCB0aGlzLmdldFZpZXcoKSk7XG5cdH1cblxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLyBQcml2YXRlIG1ldGhvZHNcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHQvKlxuXHRcdFx0IFRPIEJFIENIRUNLRUQgLyBESVNDVVNTRURcblx0XHRcdCBfY3JlYXRlTXVsdGlwbGVEb2N1bWVudHMgYW5kIGRlbGV0ZU11bHRpRG9jdW1lbnQgLSBjb3VsZG4ndCB3ZSBjb21iaW5lIHRoZW0gd2l0aCBjcmVhdGUgYW5kIGRlbGV0ZSBkb2N1bWVudD9cblx0XHRcdCBfY3JlYXRlQWN0aW9uUHJvbWlzZSBhbmQgZGVsZXRlQ3VycmVudEFjdGlvblByb21pc2UgLT4gbmV4dCBzdGVwXG5cblx0XHRcdCAqL1xuXG5cdF9zZXRFZGl0TW9kZShzRWRpdE1vZGU6IGFueSwgYkNyZWF0aW9uTW9kZT86IGJvb2xlYW4pIHtcblx0XHQodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5zZXRFZGl0TW9kZShzRWRpdE1vZGUsIGJDcmVhdGlvbk1vZGUpO1xuXHR9XG5cblx0X3NldERyYWZ0U3RhdHVzKHNEcmFmdFN0YXRlOiBhbnkpIHtcblx0XHQodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5zZXREcmFmdFN0YXR1cyhzRHJhZnRTdGF0ZSk7XG5cdH1cblxuXHRfZ2V0Um91dGluZ0xpc3RlbmVyKCkge1xuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5nZXRSb3V0aW5nTGlzdGVuZXIoKTtcblx0fVxuXG5cdF9nZXRHbG9iYWxVSU1vZGVsKCkge1xuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5nZXRHbG9iYWxVSU1vZGVsKCk7XG5cdH1cblx0X3N5bmNUYXNrKHZUYXNrPzogYW55KSB7XG5cdFx0cmV0dXJuICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LnN5bmNUYXNrKHZUYXNrKTtcblx0fVxuXG5cdF9nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0OiBhbnkpIHtcblx0XHRyZXR1cm4gKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIFBhZ2VDb250cm9sbGVyKS5fZWRpdEZsb3cuZ2V0UHJvZ3JhbW1pbmdNb2RlbChvQ29udGV4dCk7XG5cdH1cblxuXHRfZGVsZXRlRG9jdW1lbnRUcmFuc2FjdGlvbihvQ29udGV4dDogYW55LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdFx0cmV0dXJuICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LmRlbGV0ZURvY3VtZW50VHJhbnNhY3Rpb24ob0NvbnRleHQsIG1QYXJhbWV0ZXJzKTtcblx0fVxuXG5cdF9oYW5kbGVDcmVhdGVFdmVudHMob0JpbmRpbmc6IGFueSkge1xuXHRcdCh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LmhhbmRsZUNyZWF0ZUV2ZW50cyhvQmluZGluZyk7XG5cdH1cblxuXHRfZ2V0VHJhbnNhY3Rpb25IZWxwZXIoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LmdldFRyYW5zYWN0aW9uSGVscGVyKCk7XG5cdH1cblxuXHRfZ2V0SW50ZXJuYWxNb2RlbCgpIHtcblx0XHRyZXR1cm4gKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIFBhZ2VDb250cm9sbGVyKS5fZWRpdEZsb3cuZ2V0SW50ZXJuYWxNb2RlbCgpO1xuXHR9XG5cblx0X2dldFJvb3RWaWV3Q29udHJvbGxlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNlLmdldEFwcENvbXBvbmVudCgpLmdldFJvb3RWaWV3Q29udHJvbGxlcigpO1xuXHR9XG5cblx0X2dldFJlc291cmNlQnVuZGxlKCkge1xuXHRcdHJldHVybiAodGhpcy5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIGFueSkub1Jlc291cmNlQnVuZGxlO1xuXHR9XG5cblx0X2dldFNlbWFudGljTWFwcGluZygpOiBTZW1hbnRpY01hcHBpbmcgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0aGlzLmJhc2UuZ2V0QXBwQ29tcG9uZW50KCkuZ2V0Um91dGluZ1NlcnZpY2UoKS5nZXRMYXN0U2VtYW50aWNNYXBwaW5nKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBwcm9taXNlIHRvIHdhaXQgZm9yIGFuIGFjdGlvbiB0byBiZSBleGVjdXRlZFxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2NyZWF0ZUFjdGlvblByb21pc2Vcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIHJlc29sdmVyIGZ1bmN0aW9uIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGV4dGVybmFsbHkgcmVzb2x2ZSB0aGUgcHJvbWlzZVxuXHQgKi9cblxuXHRfY3JlYXRlQWN0aW9uUHJvbWlzZShzQWN0aW9uTmFtZTogYW55LCBzQ29udHJvbElkOiBhbnkpIHtcblx0XHRyZXR1cm4gKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIFBhZ2VDb250cm9sbGVyKS5fZWRpdEZsb3cuY3JlYXRlQWN0aW9uUHJvbWlzZShzQWN0aW9uTmFtZSwgc0NvbnRyb2xJZCk7XG5cdH1cblxuXHRfZ2V0Q3VycmVudEFjdGlvblByb21pc2UoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LmdldEN1cnJlbnRBY3Rpb25Qcm9taXNlKCk7XG5cdH1cblxuXHRfZGVsZXRlQ3VycmVudEFjdGlvblByb21pc2UoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LmRlbGV0ZUN1cnJlbnRBY3Rpb25Qcm9taXNlKCk7XG5cdH1cblxuXHRfZ2V0TWVzc2FnZUhhbmRsZXIoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmJhc2UuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikuX2VkaXRGbG93LmdldE1lc3NhZ2VIYW5kbGVyKCk7XG5cdH1cblxuXHRfc2VuZEFjdGl2aXR5KGFjdGlvbjogQWN0aXZpdHksIHJlbGF0ZWRDb250ZXh0czogQ29udGV4dCB8IENvbnRleHRbXSB8IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBBcnJheS5pc0FycmF5KHJlbGF0ZWRDb250ZXh0cykgPyByZWxhdGVkQ29udGV4dHMubWFwKChjb250ZXh0KSA9PiBjb250ZXh0LmdldFBhdGgoKSkgOiByZWxhdGVkQ29udGV4dHM/LmdldFBhdGgoKTtcblx0XHRzZW5kKHRoaXMuZ2V0VmlldygpLCBhY3Rpb24sIGNvbnRlbnQpO1xuXHR9XG5cblx0X3RyaWdnZXJDb25maWd1cmVkU3VydmV5KHNBY3Rpb25OYW1lOiBzdHJpbmcsIHRyaWdnZXJUeXBlOiBUcmlnZ2VyVHlwZSkge1xuXHRcdHRyaWdnZXJDb25maWd1cmVkU3VydmV5KHRoaXMuZ2V0VmlldygpLCBzQWN0aW9uTmFtZSwgdHJpZ2dlclR5cGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfZ2V0QWN0aW9uUmVzcG9uc2VEYXRhQW5kS2V5c1xuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuRWRpdEZsb3dcblx0ICogQHBhcmFtIHNBY3Rpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gdGhhdCBpcyBleGVjdXRlZFxuXHQgKiBAcGFyYW0gb1Jlc3BvbnNlIFRoZSBib3VuZCBhY3Rpb24ncyByZXNwb25zZSBkYXRhIG9yIHJlc3BvbnNlIGNvbnRleHRcblx0ICogQHJldHVybnMgT2JqZWN0IHdpdGggZGF0YSBhbmQgbmFtZXMgb2YgdGhlIGtleSBmaWVsZHMgb2YgdGhlIHJlc3BvbnNlXG5cdCAqL1xuXHRfZ2V0QWN0aW9uUmVzcG9uc2VEYXRhQW5kS2V5cyhzQWN0aW9uTmFtZTogc3RyaW5nLCBvUmVzcG9uc2U6IG9iamVjdCkge1xuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5nZXRBY3Rpb25SZXNwb25zZURhdGFBbmRLZXlzKHNBY3Rpb25OYW1lLCBvUmVzcG9uc2UpO1xuXHR9XG5cblx0YXN5bmMgX3N1Ym1pdE9wZW5DaGFuZ2VzKG9Db250ZXh0OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuXHRcdGNvbnN0IG9Nb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCksXG5cdFx0XHRvTG9ja09iamVjdCA9IHRoaXMuX2dldEdsb2JhbFVJTW9kZWwoKTtcblxuXHRcdHRyeSB7XG5cdFx0XHQvLyBTdWJtaXQgYW55IGxlZnRvdmVyIGNoYW5nZXMgdGhhdCBhcmUgbm90IHlldCBzdWJtaXR0ZWRcblx0XHRcdC8vIEN1cnJlbnRseSB3ZSBhcmUgdXNpbmcgb25seSAxIHVwZGF0ZUdyb3VwSWQsIGhlbmNlIHN1Ym1pdHRpbmcgdGhlIGJhdGNoIGRpcmVjdGx5IGhlcmVcblx0XHRcdGF3YWl0IG9Nb2RlbC5zdWJtaXRCYXRjaChcIiRhdXRvXCIpO1xuXG5cdFx0XHQvLyBXYWl0IGZvciBhbGwgY3VycmVudGx5IHJ1bm5pbmcgY2hhbmdlc1xuXHRcdFx0Ly8gRm9yIHRoZSB0aW1lIGJlaW5nIHdlIGFncmVlZCB3aXRoIHRoZSB2NCBtb2RlbCB0ZWFtIHRvIHVzZSBhbiBpbnRlcm5hbCBtZXRob2QuIFdlJ2xsIHJlcGxhY2UgaXQgb25jZVxuXHRcdFx0Ly8gYSBwdWJsaWMgb3IgcmVzdHJpY3RlZCBtZXRob2Qgd2FzIHByb3ZpZGVkXG5cdFx0XHRhd2FpdCBvTW9kZWwub1JlcXVlc3Rvci53YWl0Rm9yUnVubmluZ0NoYW5nZVJlcXVlc3RzKFwiJGF1dG9cIik7XG5cblx0XHRcdC8vIENoZWNrIGlmIGFsbCBjaGFuZ2VzIHdlcmUgc3VibWl0dGVkIHN1Y2Nlc3NmdWxseVxuXHRcdFx0aWYgKG9Nb2RlbC5oYXNQZW5kaW5nQ2hhbmdlcyhcIiRhdXRvXCIpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInN1Ym1pdCBvZiBvcGVuIGNoYW5nZXMgZmFpbGVkXCIpO1xuXHRcdFx0fVxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRpZiAoQnVzeUxvY2tlci5pc0xvY2tlZChvTG9ja09iamVjdCkpIHtcblx0XHRcdFx0QnVzeUxvY2tlci51bmxvY2sob0xvY2tPYmplY3QpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdF9oYW5kbGVTdGlja3lPbihvQ29udGV4dDogQ29udGV4dCkge1xuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5oYW5kbGVTdGlja3lPbihvQ29udGV4dCk7XG5cdH1cblxuXHRfaGFuZGxlU3RpY2t5T2ZmKCkge1xuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5oYW5kbGVTdGlja3lPZmYoKTtcblx0fVxuXG5cdF9vbkJhY2tOYXZpZ2F0aW9uSW5TZXNzaW9uKCkge1xuXHRcdHJldHVybiAodGhpcy5iYXNlLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9lZGl0Rmxvdy5vbkJhY2tOYXZpZ2F0aW9uSW5TZXNzaW9uKCk7XG5cdH1cblxuXHRfZGlzY2FyZFN0aWNreVNlc3Npb24ob0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRyZXR1cm4gKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIFBhZ2VDb250cm9sbGVyKS5fZWRpdEZsb3cuZGlzY2FyZFN0aWNreVNlc3Npb24ob0NvbnRleHQpO1xuXHR9XG5cblx0X3NldFN0aWNreVNlc3Npb25JbnRlcm5hbFByb3BlcnRpZXMocHJvZ3JhbW1pbmdNb2RlbDogYW55LCBtb2RlbDogT0RhdGFNb2RlbCkge1xuXHRcdGlmIChwcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLlN0aWNreSkge1xuXHRcdFx0Y29uc3QgaW50ZXJuYWxNb2RlbCA9IHRoaXMuX2dldEludGVybmFsTW9kZWwoKTtcblx0XHRcdGludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoXCIvc2Vzc2lvbk9uXCIsIHRydWUpO1xuXHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9zdGlja3lTZXNzaW9uVG9rZW5cIiwgKG1vZGVsLmdldEh0dHBIZWFkZXJzKHRydWUpIGFzIGFueSlbXCJTQVAtQ29udGV4dElkXCJdKTtcblx0XHR9XG5cdH1cblxuXHRfcmVtb3ZlU3RpY2t5U2Vzc2lvbkludGVybmFsUHJvcGVydGllcyhwcm9ncmFtbWluZ01vZGVsOiBhbnkpIHtcblx0XHRpZiAocHJvZ3JhbW1pbmdNb2RlbCA9PT0gUHJvZ3JhbW1pbmdNb2RlbC5TdGlja3kpIHtcblx0XHRcdGNvbnN0IGludGVybmFsTW9kZWwgPSB0aGlzLl9nZXRJbnRlcm5hbE1vZGVsKCk7XG5cdFx0XHRpbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KFwiL3Nlc3Npb25PblwiLCBmYWxzZSk7XG5cdFx0XHRpbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KFwiL3N0aWNreVNlc3Npb25Ub2tlblwiLCB1bmRlZmluZWQpO1xuXHRcdFx0dGhpcy5faGFuZGxlU3RpY2t5T2ZmKC8qb0NvbnRleHQqLyk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgX2hhbmRsZU5ld0NvbnRleHQoXG5cdFx0b0NvbnRleHQ6IENvbnRleHQsXG5cdFx0YkVkaXRhYmxlOiBib29sZWFuLFxuXHRcdGJSZWNyZWF0ZUNvbnRleHQ6IGJvb2xlYW4sXG5cdFx0YkRyYWZ0TmF2aWdhdGlvbjogYm9vbGVhbixcblx0XHRiRm9yY2VGb2N1cyA9IGZhbHNlXG5cdCkge1xuXHRcdGlmICghdGhpcy5faXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdEVkaXRTdGF0ZS5zZXRFZGl0U3RhdGVEaXJ0eSgpO1xuXHRcdH1cblxuXHRcdGF3YWl0IHRoaXMuX2dldFJvdXRpbmdMaXN0ZW5lcigpLm5hdmlnYXRlVG9Db250ZXh0KG9Db250ZXh0LCB7XG5cdFx0XHRjaGVja05vSGFzaENoYW5nZTogdHJ1ZSxcblx0XHRcdGVkaXRhYmxlOiBiRWRpdGFibGUsXG5cdFx0XHRiUGVyc2lzdE9QU2Nyb2xsOiB0cnVlLFxuXHRcdFx0YlJlY3JlYXRlQ29udGV4dDogYlJlY3JlYXRlQ29udGV4dCxcblx0XHRcdGJEcmFmdE5hdmlnYXRpb246IGJEcmFmdE5hdmlnYXRpb24sXG5cdFx0XHRzaG93UGxhY2Vob2xkZXI6IGZhbHNlLFxuXHRcdFx0YkZvcmNlRm9jdXM6IGJGb3JjZUZvY3VzLFxuXHRcdFx0a2VlcEN1cnJlbnRMYXlvdXQ6IHRydWVcblx0XHR9KTtcblx0fVxuXG5cdF9nZXRCb3VuZENvbnRleHQodmlldzogYW55LCBwYXJhbXM6IGFueSkge1xuXHRcdGNvbnN0IHZpZXdMZXZlbCA9IHZpZXcuZ2V0Vmlld0RhdGEoKS52aWV3TGV2ZWw7XG5cdFx0Y29uc3QgYlJlZnJlc2hBZnRlckFjdGlvbiA9IHZpZXdMZXZlbCA+IDEgfHwgKHZpZXdMZXZlbCA9PT0gMSAmJiBwYXJhbXMuY29udHJvbElkKTtcblx0XHRyZXR1cm4gIXBhcmFtcy5pc05hdmlnYWJsZSB8fCAhIWJSZWZyZXNoQWZ0ZXJBY3Rpb247XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZXJlIGFyZSB2YWxpZGF0aW9uIChwYXJzZSkgZXJyb3JzIGZvciBjb250cm9scyBib3VuZCB0byBhIGdpdmVuIGNvbnRleHRcblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9jaGVja0ZvclZhbGlkYXRpb25FcnJvcnNcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLkVkaXRGbG93XG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVzIGlmIHRoZXJlIGFyZSBubyB2YWxpZGF0aW9uIGVycm9ycywgYW5kIHJlamVjdHMgaWYgdGhlcmUgYXJlIHZhbGlkYXRpb24gZXJyb3JzXG5cdCAqL1xuXG5cdF9jaGVja0ZvclZhbGlkYXRpb25FcnJvcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3N5bmNUYXNrKCkudGhlbigoKSA9PiB7XG5cdFx0XHRjb25zdCBzVmlld0lkID0gdGhpcy5iYXNlLmdldFZpZXcoKS5nZXRJZCgpO1xuXHRcdFx0Y29uc3QgYU1lc3NhZ2VzID0gc2FwLnVpLmdldENvcmUoKS5nZXRNZXNzYWdlTWFuYWdlcigpLmdldE1lc3NhZ2VNb2RlbCgpLmdldERhdGEoKTtcblx0XHRcdGxldCBvQ29udHJvbDtcblx0XHRcdGxldCBvTWVzc2FnZTtcblxuXHRcdFx0aWYgKCFhTWVzc2FnZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoXCJObyB2YWxpZGF0aW9uIGVycm9ycyBmb3VuZFwiKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0b01lc3NhZ2UgPSBhTWVzc2FnZXNbaV07XG5cdFx0XHRcdGlmIChvTWVzc2FnZS52YWxpZGF0aW9uKSB7XG5cdFx0XHRcdFx0b0NvbnRyb2wgPSBDb3JlLmJ5SWQob01lc3NhZ2UuZ2V0Q29udHJvbElkKCkpO1xuXHRcdFx0XHRcdHdoaWxlIChvQ29udHJvbCkge1xuXHRcdFx0XHRcdFx0aWYgKG9Db250cm9sLmdldElkKCkgPT09IHNWaWV3SWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KFwidmFsaWRhdGlvbiBlcnJvcnMgZXhpc3RcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvQ29udHJvbCA9IG9Db250cm9sLmdldFBhcmVudCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfcmVmcmVzaExpc3RJZlJlcXVpcmVkXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5FZGl0Rmxvd1xuXHQgKiBAcGFyYW0gb1Jlc3BvbnNlIFRoZSByZXNwb25zZSBvZiB0aGUgYm91bmQgYWN0aW9uIGFuZCB0aGUgbmFtZXMgb2YgdGhlIGtleSBmaWVsZHNcblx0ICogQHBhcmFtIG9Db250ZXh0IFRoZSBib3VuZCBjb250ZXh0IG9uIHdoaWNoIHRoZSBhY3Rpb24gd2FzIGV4ZWN1dGVkXG5cdCAqIEByZXR1cm5zIEFsd2F5cyByZXNvbHZlcyB0byBwYXJhbSBvUmVzcG9uc2Vcblx0ICovXG5cdF9yZWZyZXNoTGlzdElmUmVxdWlyZWQob1Jlc3BvbnNlOiBhbnksIG9Db250ZXh0OiBDb250ZXh0KSB7XG5cdFx0aWYgKCFvQ29udGV4dCB8fCAhb1Jlc3BvbnNlIHx8ICFvUmVzcG9uc2Uub0RhdGEpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0Y29uc3Qgb0JpbmRpbmcgPSBvQ29udGV4dC5nZXRCaW5kaW5nKCk7XG5cdFx0Ly8gcmVmcmVzaCBvbmx5IGxpc3RzXG5cdFx0aWYgKG9CaW5kaW5nICYmIG9CaW5kaW5nLmlzQShcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXCIpKSB7XG5cdFx0XHRjb25zdCBvQ29udGV4dERhdGEgPSBvUmVzcG9uc2Uub0RhdGE7XG5cdFx0XHRjb25zdCBhS2V5cyA9IG9SZXNwb25zZS5rZXlzO1xuXHRcdFx0Y29uc3Qgb0N1cnJlbnREYXRhID0gb0NvbnRleHQuZ2V0T2JqZWN0KCk7XG5cdFx0XHRsZXQgYlJldHVybmVkQ29udGV4dElzU2FtZSA9IHRydWU7XG5cdFx0XHQvLyBlbnN1cmUgY29udGV4dCBpcyBpbiB0aGUgcmVzcG9uc2Vcblx0XHRcdGlmIChPYmplY3Qua2V5cyhvQ29udGV4dERhdGEpLmxlbmd0aCkge1xuXHRcdFx0XHQvLyBjaGVjayBpZiBjb250ZXh0IGluIHJlc3BvbnNlIGlzIGRpZmZlcmVudCB0aGFuIHRoZSBib3VuZCBjb250ZXh0XG5cdFx0XHRcdGJSZXR1cm5lZENvbnRleHRJc1NhbWUgPSBhS2V5cy5ldmVyeShmdW5jdGlvbiAoc0tleTogYW55KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9DdXJyZW50RGF0YVtzS2V5XSA9PT0gb0NvbnRleHREYXRhW3NLZXldO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKCFiUmV0dXJuZWRDb250ZXh0SXNTYW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoKG9CaW5kaW5nIGFzIGFueSkuaXNSb290KCkpIHtcblx0XHRcdFx0XHRcdFx0b0JpbmRpbmcuYXR0YWNoRXZlbnRPbmNlKFwiZGF0YVJlY2VpdmVkXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRvQmluZGluZy5yZWZyZXNoKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuZ2V0VmlldygpKTtcblx0XHRcdFx0XHRcdFx0b0FwcENvbXBvbmVudFxuXHRcdFx0XHRcdFx0XHRcdC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKVxuXHRcdFx0XHRcdFx0XHRcdC5yZXF1ZXN0U2lkZUVmZmVjdHMoW3sgJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IG9CaW5kaW5nLmdldFBhdGgoKSB9XSwgb0JpbmRpbmcuZ2V0Q29udGV4dCgpIGFzIENvbnRleHQpXG5cdFx0XHRcdFx0XHRcdFx0LnRoZW4oXG5cdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJlZnJlc2hpbmcgdGhlIHRhYmxlXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSByZWZyZXNoaW5nIHRoZSB0YWJsZVwiLCBlKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyByZXNvbHZlIHdpdGggb1Jlc3BvbnNlIHRvIG5vdCBkaXN0dXJiIHRoZSBwcm9taXNlIGNoYWluIGFmdGVyd2FyZHNcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cblxuXHRfZmV0Y2hTZW1hbnRpY0tleVZhbHVlcyhvQ29udGV4dDogQ29udGV4dCk6IFByb21pc2U8YW55PiB7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkgYXMgYW55LFxuXHRcdFx0c0VudGl0eVNldE5hbWUgPSBvTWV0YU1vZGVsLmdldE1ldGFDb250ZXh0KG9Db250ZXh0LmdldFBhdGgoKSkuZ2V0T2JqZWN0KFwiQHNhcHVpLm5hbWVcIiksXG5cdFx0XHRhU2VtYW50aWNLZXlzID0gU2VtYW50aWNLZXlIZWxwZXIuZ2V0U2VtYW50aWNLZXlzKG9NZXRhTW9kZWwsIHNFbnRpdHlTZXROYW1lKTtcblxuXHRcdGlmIChhU2VtYW50aWNLZXlzICYmIGFTZW1hbnRpY0tleXMubGVuZ3RoKSB7XG5cdFx0XHRjb25zdCBhUmVxdWVzdFByb21pc2VzID0gYVNlbWFudGljS2V5cy5tYXAoZnVuY3Rpb24gKG9LZXk6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gb0NvbnRleHQucmVxdWVzdE9iamVjdChvS2V5LiRQcm9wZXJ0eVBhdGgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChhUmVxdWVzdFByb21pc2VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQcm92aWRlcyB0aGUgbGF0ZXN0IGNvbnRleHQgaW4gdGhlIG1ldGFkYXRhIGhpZXJhcmNoeSBmcm9tIHJvb3RCaW5kaW5nIHRvIGdpdmVuIGNvbnRleHQgcG9pbnRpbmcgdG8gZ2l2ZW4gZW50aXR5VHlwZVxuXHQgKiBpZiBhbnkgc3VjaCBjb250ZXh0IGV4aXN0cy4gT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSBvcmlnaW5hbCBjb250ZXh0LlxuXHQgKiBOb3RlOiBJdCBpcyBvbmx5IG5lZWRlZCBhcyB3b3JrLWFyb3VuZCBmb3IgaW5jb3JyZWN0IG1vZGVsbGluZy4gQ29ycmVjdCBtb2RlbGxpbmcgd291bGQgaW1wbHkgYSBEYXRhRmllbGRGb3JBY3Rpb24gaW4gYSBMaW5lSXRlbVxuXHQgKiB0byBwb2ludCB0byBhbiBvdmVybG9hZCBkZWZpbmVkIGVpdGhlciBvbiB0aGUgY29ycmVzcG9uZGluZyBFbnRpdHlUeXBlIG9yIGEgY29sbGVjdGlvbiBvZiB0aGUgc2FtZS5cblx0ICpcblx0ICogQHBhcmFtIHJvb3RDb250ZXh0IFRoZSBjb250ZXh0IHRvIHN0YXJ0IHNlYXJjaGluZyBmcm9tXG5cdCAqIEBwYXJhbSBsaXN0QmluZGluZyBUaGUgbGlzdEJpbmRpbmcgb2YgdGhlIHRhYmxlXG5cdCAqIEBwYXJhbSBvdmVybG9hZEVudGl0eVR5cGUgVGhlIEFjdGlvbk92ZXJsb2FkIGVudGl0eSB0eXBlIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgUmV0dXJucyB0aGUgY29udGV4dCBvZiB0aGUgQWN0aW9uT3ZlcmxvYWQgZW50aXR5XG5cdCAqL1xuXHRfZ2V0QWN0aW9uT3ZlcmxvYWRDb250ZXh0RnJvbU1ldGFkYXRhUGF0aChyb290Q29udGV4dDogQ29udGV4dCwgbGlzdEJpbmRpbmc6IE9EYXRhTGlzdEJpbmRpbmcsIG92ZXJsb2FkRW50aXR5VHlwZTogc3RyaW5nKTogQ29udGV4dCB7XG5cdFx0Y29uc3QgbW9kZWw6IE9EYXRhTW9kZWwgPSByb290Q29udGV4dC5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWw7XG5cdFx0Y29uc3QgbWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCA9IG1vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHRcdGNvbnN0IGNvbnRleHRTZWdtZW50czogc3RyaW5nW10gPSBsaXN0QmluZGluZy5nZXRQYXRoKCkuc3BsaXQoXCIvXCIpO1xuXHRcdGxldCBjdXJyZW50Q29udGV4dDogQ29udGV4dCA9IHJvb3RDb250ZXh0O1xuXG5cdFx0aWYgKGNvbnRleHRTZWdtZW50c1swXSAhPT0gXCJcIikge1xuXHRcdFx0Y29udGV4dFNlZ21lbnRzLnVuc2hpZnQoXCJcIik7IC8vIHRvIGFsc28gZ2V0IHRoZSByb290IGNvbnRleHQsIGkuZS4gdGhlIGJpbmRpbmdDb250ZXh0IG9mIHRoZSB0YWJsZVxuXHRcdH1cblx0XHQvLyBsb2FkIGFsbCB0aGUgcGFyZW50IGNvbnRleHRzIGludG8gYW4gYXJyYXlcblx0XHRjb25zdCBwYXJlbnRDb250ZXh0czogQ29udGV4dFtdID0gY29udGV4dFNlZ21lbnRzXG5cdFx0XHQubWFwKChwYXRoU2VnbWVudDogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGN1cnJlbnRDb250ZXh0ID0gbW9kZWwuYmluZENvbnRleHQocGF0aFNlZ21lbnQsIGN1cnJlbnRDb250ZXh0KS5nZXRCb3VuZENvbnRleHQoKTtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRDb250ZXh0O1xuXHRcdFx0fSlcblx0XHRcdC5yZXZlcnNlKCk7XG5cdFx0Ly8gc2VhcmNoIGZvciBjb250ZXh0IGJhY2t3YXJkc1xuXHRcdGNvbnN0IG92ZXJsb2FkQ29udGV4dDogQ29udGV4dCB8IHVuZGVmaW5lZCA9IHBhcmVudENvbnRleHRzLmZpbmQoXG5cdFx0XHQocGFyZW50Q29udGV4dDogQ29udGV4dCkgPT5cblx0XHRcdFx0KG1ldGFNb2RlbC5nZXRNZXRhQ29udGV4dChwYXJlbnRDb250ZXh0LmdldFBhdGgoKSkuZ2V0T2JqZWN0KFwiJFR5cGVcIikgYXMgdW5rbm93biBhcyBzdHJpbmcpID09PSBvdmVybG9hZEVudGl0eVR5cGVcblx0XHQpO1xuXHRcdHJldHVybiBvdmVybG9hZENvbnRleHQgfHwgbGlzdEJpbmRpbmcuZ2V0SGVhZGVyQ29udGV4dCgpO1xuXHR9XG5cblx0X2NyZWF0ZVNpYmxpbmdJbmZvKGN1cnJlbnRDb250ZXh0OiBWNENvbnRleHQsIG5ld0NvbnRleHQ6IFY0Q29udGV4dCk6IFNpYmxpbmdJbmZvcm1hdGlvbiB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhcmdldENvbnRleHQ6IG5ld0NvbnRleHQsXG5cdFx0XHRwYXRoTWFwcGluZzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b2xkUGF0aDogY3VycmVudENvbnRleHQuZ2V0UGF0aCgpLFxuXHRcdFx0XHRcdG5ld1BhdGg6IG5ld0NvbnRleHQuZ2V0UGF0aCgpXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9O1xuXHR9XG5cblx0X3VwZGF0ZVBhdGhzSW5IaXN0b3J5KG1hcHBpbmdzOiB7IG9sZFBhdGg6IHN0cmluZzsgbmV3UGF0aDogc3RyaW5nIH1bXSkge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSB0aGlzLmJhc2UuZ2V0QXBwQ29tcG9uZW50KCk7XG5cdFx0b0FwcENvbXBvbmVudC5nZXRSb3V0ZXJQcm94eSgpLnNldFBhdGhNYXBwaW5nKG1hcHBpbmdzKTtcblxuXHRcdC8vIEFsc28gdXBkYXRlIHRoZSBzZW1hbnRpYyBtYXBwaW5nIGluIHRoZSByb3V0aW5nIHNlcnZpY2Vcblx0XHRjb25zdCBsYXN0U2VtYW50aWNNYXBwaW5nID0gdGhpcy5fZ2V0U2VtYW50aWNNYXBwaW5nKCk7XG5cdFx0aWYgKG1hcHBpbmdzLmxlbmd0aCAmJiBsYXN0U2VtYW50aWNNYXBwaW5nPy50ZWNobmljYWxQYXRoID09PSBtYXBwaW5nc1ttYXBwaW5ncy5sZW5ndGggLSAxXS5vbGRQYXRoKSB7XG5cdFx0XHRsYXN0U2VtYW50aWNNYXBwaW5nLnRlY2huaWNhbFBhdGggPSBtYXBwaW5nc1ttYXBwaW5ncy5sZW5ndGggLSAxXS5uZXdQYXRoO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZHMgY3JlYXRlcyBhIHNpYmxpbmcgY29udGV4dCBmb3IgYSBzdWJvYmplY3QgcGFnZSwgYW5kIGNhbGN1bGF0ZXMgYSBzaWJsaW5nIHBhdGggZm9yXG5cdCAqIGFsbCBpbnRlcm1lZGlhdGVzIHBhdGhzIGJldHdlZW4gdGhlIE9QIGFuZCB0aGUgc3ViLU9QLlxuXHQgKlxuXHQgKiBAcGFyYW0gcm9vdEN1cnJlbnRDb250ZXh0IFRoZSBjb250ZXh0IGZvciB0aGUgcm9vdCBvZiB0aGUgZHJhZnRcblx0ICogQHBhcmFtIHJpZ2h0bW9zdEN1cnJlbnRDb250ZXh0IFRoZSBjb250ZXh0IG9mIHRoZSBzdWJvYmplY3Rcblx0ICogQHBhcmFtIHNQcm9ncmFtbWluZ01vZGVsIFRoZSBwcm9ncmFtbWluZyBtb2RlbFxuXHQgKiBAcGFyYW0gZG9Ob3RDb21wdXRlSWZSb290IElmIHRydWUsIHdlIGRvbid0IGNvbXB1dGUgc2libGluZ0luZm8gaWYgdGhlIHJvb3QgYW5kIHRoZSByaWdodG1vc3QgY29udGV4dHMgYXJlIHRoZSBzYW1lXG5cdCAqIEByZXR1cm5zIFJldHVybnMgdGhlIHNpYmxpbmdJbmZvcm1hdGlvbiBvYmplY3Rcblx0ICovXG5cdGFzeW5jIF9jb21wdXRlU2libGluZ0luZm9ybWF0aW9uKFxuXHRcdHJvb3RDdXJyZW50Q29udGV4dDogVjRDb250ZXh0LFxuXHRcdHJpZ2h0bW9zdEN1cnJlbnRDb250ZXh0OiBWNENvbnRleHQgfCBudWxsIHwgdW5kZWZpbmVkLFxuXHRcdHNQcm9ncmFtbWluZ01vZGVsOiBzdHJpbmcsXG5cdFx0ZG9Ob3RDb21wdXRlSWZSb290OiBib29sZWFuXG5cdCk6IFByb21pc2U8U2libGluZ0luZm9ybWF0aW9uIHwgdW5kZWZpbmVkPiB7XG5cdFx0cmlnaHRtb3N0Q3VycmVudENvbnRleHQgPSByaWdodG1vc3RDdXJyZW50Q29udGV4dCA/PyByb290Q3VycmVudENvbnRleHQ7XG5cdFx0aWYgKCFyaWdodG1vc3RDdXJyZW50Q29udGV4dC5nZXRQYXRoKCkuc3RhcnRzV2l0aChyb290Q3VycmVudENvbnRleHQuZ2V0UGF0aCgpKSkge1xuXHRcdFx0Ly8gV3JvbmcgdXNhZ2UgISFcblx0XHRcdExvZy5lcnJvcihcIkNhbm5vdCBjb21wdXRlIHJpZ2h0bW9zdCBzaWJsaW5nIGNvbnRleHRcIik7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY29tcHV0ZSByaWdodG1vc3Qgc2libGluZyBjb250ZXh0XCIpO1xuXHRcdH1cblx0XHRpZiAoZG9Ob3RDb21wdXRlSWZSb290ICYmIHJpZ2h0bW9zdEN1cnJlbnRDb250ZXh0LmdldFBhdGgoKSA9PT0gcm9vdEN1cnJlbnRDb250ZXh0LmdldFBhdGgoKSkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG1vZGVsID0gcm9vdEN1cnJlbnRDb250ZXh0LmdldE1vZGVsKCk7XG5cdFx0aWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0KSB7XG5cdFx0XHRyZXR1cm4gZHJhZnQuY29tcHV0ZVNpYmxpbmdJbmZvcm1hdGlvbihyb290Q3VycmVudENvbnRleHQsIHJpZ2h0bW9zdEN1cnJlbnRDb250ZXh0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSWYgbm90IGluIGRyYWZ0IG1vZGUsIHdlIGp1c3QgcmVjcmVhdGUgYSBjb250ZXh0IGZyb20gdGhlIHBhdGggb2YgdGhlIHJpZ2h0bW9zdCBjb250ZXh0XG5cdFx0XHQvLyBObyBwYXRoIG1hcHBpbmcgaXMgbmVlZGVkXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0YXJnZXRDb250ZXh0OiBtb2RlbC5iaW5kQ29udGV4dChyaWdodG1vc3RDdXJyZW50Q29udGV4dC5nZXRQYXRoKCkpLmdldEJvdW5kQ29udGV4dCgpLFxuXHRcdFx0XHRwYXRoTWFwcGluZzogW11cblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cdF9pc0ZjbEVuYWJsZWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIENvbW1vblV0aWxzLmdldEFwcENvbXBvbmVudCh0aGlzLmdldFZpZXcoKSkuX2lzRmNsRW5hYmxlZCgpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRGbG93O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFNRyxDQUFOLEVBQVM7TUFDVixP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