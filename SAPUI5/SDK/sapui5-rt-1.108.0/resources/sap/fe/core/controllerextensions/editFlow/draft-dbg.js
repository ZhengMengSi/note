/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/collaboration/ActivitySync", "sap/fe/core/controllerextensions/messageHandler/messageHandling", "sap/m/Button", "sap/m/Dialog", "sap/m/MessageBox", "sap/m/Text", "sap/ui/core/Core", "../../operationsHelper", "./draftDataLossPopup"], function (Log, CommonUtils, ActivitySync, messageHandling, Button, Dialog, MessageBox, Text, Core, operationsHelper, draftDataLossPopup) {
  "use strict";

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

  /**
   * Creates an active document from a draft document.
   *
   * The function supports several hooks as there is a certain choreography defined.
   *
   * @function
   * @name sap.fe.core.actions.draft#activateDocument
   * @memberof sap.fe.core.actions.draft
   * @static
   * @param oContext Context of the active document for the new draft
   * @param oAppComponent The AppComponent
   * @param mParameters The parameters
   * @param [mParameters.fnBeforeActivateDocument] Callback that allows a veto before the 'Create' request is executed
   * @param [mParameters.fnAfterActivateDocument] Callback for postprocessing after document was activated.
   * @param messageHandler The message handler
   * @returns Promise resolves with the {@link sap.ui.model.odata.v4.Context context} of the new draft document
   * @private
   * @ui5-restricted
   */
  var activateDocument = function (oContext, oAppComponent, mParameters, messageHandler) {
    try {
      function _temp22(bExecute) {
        var _exit5 = false;

        function _temp20(_result6) {
          return _exit5 ? _result6 : mParam.fnAfterActivateDocument ? mParam.fnAfterActivateDocument(oContext, oActiveDocumentContext) : oActiveDocumentContext;
        }

        if (!bExecute) {
          throw new Error("Activation of the document was aborted by extension for document: ".concat(oContext.getPath()));
        }

        var oActiveDocumentContext;

        var _temp19 = function () {
          if (!hasPrepareAction(oContext)) {
            return Promise.resolve(executeDraftActivationAction(oContext, oAppComponent)).then(function (_executeDraftActivati) {
              oActiveDocumentContext = _executeDraftActivati;
            });
          } else {
            /* activation requires preparation */
            var sBatchGroup = "draft"; // we use the same batchGroup to force prepare and activate in a same batch but with different changeset

            var oPreparePromise = draft.executeDraftPreparationAction(oContext, sBatchGroup, false);
            oContext.getModel().submitBatch(sBatchGroup);
            var oActivatePromise = draft.executeDraftActivationAction(oContext, oAppComponent, sBatchGroup);
            return _catch(function () {
              return Promise.resolve(Promise.all([oPreparePromise, oActivatePromise])).then(function (values) {
                oActiveDocumentContext = values[1];
              });
            }, function (err) {
              function _temp18() {
                throw err;
              }

              // BCP 2270084075
              // if the Activation fails, then the messages are retrieved from PREPARATION action
              var sMessagesPath = getMessagePathForPrepare(oContext);

              var _temp17 = function () {
                if (sMessagesPath) {
                  oPreparePromise = draft.executeDraftPreparationAction(oContext, sBatchGroup, true);
                  oContext.getModel().submitBatch(sBatchGroup);
                  return Promise.resolve(oPreparePromise).then(function () {
                    return Promise.resolve(oContext.requestObject()).then(function (data) {
                      if (data[sMessagesPath].length > 0) {
                        //if messages are available from the PREPARATION action, then previous transition messages are removed
                        messageHandler === null || messageHandler === void 0 ? void 0 : messageHandler.removeTransitionMessages(false, false, oContext.getPath());
                      }
                    });
                  });
                }
              }();

              return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
            });
          }
        }();

        return _temp19 && _temp19.then ? _temp19.then(_temp20) : _temp20(_temp19);
      }

      var mParam = mParameters || {};

      if (!oContext) {
        throw new Error("Binding context to draft document is required");
      }

      var _mParam$fnBeforeActiv2 = mParam.fnBeforeActivateDocument;
      return Promise.resolve(_mParam$fnBeforeActiv2 ? Promise.resolve(mParam.fnBeforeActivateDocument(oContext)).then(_temp22) : _temp22(true));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * HTTP POST call when DraftAction is present for Draft Delete; HTTP DELETE call when there is no DraftAction
   * and Active Instance always uses DELETE.
   *
   * @function
   * @name sap.fe.core.actions.draft#deleteDraft
   * @memberof sap.fe.core.actions.draft
   * @static
   * @param oContext Context of the document to be discarded
   * @param oAppComponent Context of the document to be discarded
   * @param bEnableStrictHandling
   * @private
   * @returns A Promise resolved when the context is deleted
   * @ui5-restricted
   */


  /**
   * Creates a draft document from an existing document.
   *
   * The function supports several hooks as there is a certain coreography defined.
   *
   * @function
   * @name sap.fe.core.actions.draft#createDraftFromActiveDocument
   * @memberof sap.fe.core.actions.draft
   * @static
   * @param oContext Context of the active document for the new draft
   * @param oAppComponent The AppComponent
   * @param mParameters The parameters
   * @param [mParameters.oView] The view
   * @param [mParameters.bPreserveChanges] Preserve changes of an existing draft of another user
   * @param [mParameters.fnBeforeCreateDraftFromActiveDocument] Callback that allows veto before create request is executed
   * @param [mParameters.fnAfterCreateDraftFromActiveDocument] Callback for postprocessiong after draft document was created
   * @param [mParameters.fnWhenDecisionToOverwriteDocumentIsRequired] Callback for deciding on overwriting an unsaved change by another user
   * @returns Promise resolves with the {@link sap.ui.model.odata.v4.Context context} of the new draft document
   * @private
   * @ui5-restricted
   */
  var createDraftFromActiveDocument = function (oContext, oAppComponent, mParameters) {
    try {
      var _exit2 = false;

      //default true

      /**
       * Overwrite or reject based on fnWhenDecisionToOverwriteDocumentIsRequired.
       *
       * @param bOverwrite Overwrite the change or not
       * @returns Resolves with result of {@link sap.fe.core.actions#executeDraftEditAction}
       */
      var overwriteOnDemand = function (bOverwrite) {
        try {
          var _exit4 = false;

          function _temp15(_result4) {
            if (_exit4) return _result4;
            throw new Error("Draft creation aborted for document: ".concat(oContext.getPath()));
          }

          var _temp16 = function () {
            if (bOverwrite) {
              //Overwrite existing changes
              var oModel = oContext.getModel();
              var draftDataContext = oModel.bindContext("".concat(oContext.getPath(), "/DraftAdministrativeData")).getBoundContext();
              return Promise.resolve(mParameters.oView.getModel("sap.fe.i18n").getResourceBundle()).then(function (oResourceBundle) {
                return Promise.resolve(draftDataContext.requestObject()).then(function (draftAdminData) {
                  return function () {
                    if (draftAdminData) {
                      // remove all unbound transition messages as we show a special dialog
                      messageHandling.removeUnboundTransitionMessages();
                      var sInfo = draftAdminData.InProcessByUserDescription || draftAdminData.InProcessByUser;
                      var sEntitySet = mParameters.oView.getViewData().entitySet;

                      if (sInfo) {
                        var sLockedByUserMsg = CommonUtils.getTranslatedText("C_DRAFT_OBJECT_PAGE_DRAFT_LOCKED_BY_USER", oResourceBundle, sInfo, sEntitySet);
                        MessageBox.error(sLockedByUserMsg);
                        throw new Error(sLockedByUserMsg);
                      } else {
                        sInfo = draftAdminData.CreatedByUserDescription || draftAdminData.CreatedByUser;
                        var sUnsavedChangesMsg = CommonUtils.getTranslatedText("C_DRAFT_OBJECT_PAGE_DRAFT_UNSAVED_CHANGES", oResourceBundle, sInfo, sEntitySet);
                        return Promise.resolve(showMessageBox(sUnsavedChangesMsg)).then(function () {
                          var _executeDraftEditActi = executeDraftEditAction(oContext, false, mParameters.oView);

                          _exit4 = true;
                          return _executeDraftEditActi;
                        });
                      }
                    }
                  }();
                });
              });
            }
          }();

          return Promise.resolve(_temp16 && _temp16.then ? _temp16.then(_temp15) : _temp15(_temp16));
        } catch (e) {
          return Promise.reject(e);
        }
      };

      function showMessageBox(sUnsavedChangesMsg) {
        return new Promise(function (resolve, reject) {
          var oDialog = new Dialog({
            title: localI18nRef.getText("C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_WARNING"),
            state: "Warning",
            content: new Text({
              text: sUnsavedChangesMsg
            }),
            beginButton: new Button({
              text: localI18nRef.getText("C_COMMON_OBJECT_PAGE_EDIT"),
              type: "Emphasized",
              press: function () {
                oDialog.close();
                resolve(true);
              }
            }),
            endButton: new Button({
              text: localI18nRef.getText("C_COMMON_OBJECT_PAGE_CANCEL"),
              press: function () {
                oDialog.close();
                reject("Draft creation aborted for document: ".concat(oContext.getPath()));
              }
            }),
            afterClose: function () {
              oDialog.destroy();
            }
          });
          oDialog.addStyleClass("sapUiContentPadding");
          oDialog.open();
        });
      }

      var mParam = mParameters || {},
          localI18nRef = Core.getLibraryResourceBundle("sap.fe.core"),
          bRunPreserveChangesFlow = typeof mParam.bPreserveChanges === "undefined" || typeof mParam.bPreserveChanges === "boolean" && mParam.bPreserveChanges;

      if (!oContext) {
        throw new Error("Binding context to active document is required");
      }

      var bExecute = mParam.fnBeforeCreateDraftFromActiveDocument ? mParam.fnBeforeCreateDraftFromActiveDocument(oContext, bRunPreserveChangesFlow) : true;

      if (!bExecute) {
        throw new Error("Draft creation was aborted by extension for document: ".concat(oContext.getPath()));
      }

      return Promise.resolve(_catch(function () {
        function _temp12(_result) {
          if (_exit2) return _result;
          oDraftContext = oDraftContext && mParam.fnAfterCreateDraftFromActiveDocument ? mParam.fnAfterCreateDraftFromActiveDocument(oContext, oDraftContext) : oDraftContext;

          if (oDraftContext) {
            var _oSideEffects$trigger;

            var sEditActionName = getActionName(oDraftContext, draftOperations.EDIT);
            var oSideEffects = oAppComponent.getSideEffectsService().getODataActionSideEffects(sEditActionName, oDraftContext);

            if (oSideEffects !== null && oSideEffects !== void 0 && (_oSideEffects$trigger = oSideEffects.triggerActions) !== null && _oSideEffects$trigger !== void 0 && _oSideEffects$trigger.length) {
              return Promise.resolve(oAppComponent.getSideEffectsService().requestSideEffectsForODataAction(oSideEffects, oDraftContext)).then(function () {
                return oDraftContext;
              });
            } else {
              return oDraftContext;
            }
          } else {
            return undefined;
          }
        }

        var oDraftContext;

        var _temp11 = _catch(function () {
          return Promise.resolve(draft.executeDraftEditAction(oContext, bRunPreserveChangesFlow, mParameters.oView)).then(function (_draft$executeDraftEd) {
            oDraftContext = _draft$executeDraftEd;
          });
        }, function (oResponse) {
          return function () {
            if (bRunPreserveChangesFlow && oResponse.status === 409) {
              messageHandling.removeBoundTransitionMessages();
              messageHandling.removeUnboundTransitionMessages();
              return function () {
                if (ActivitySync.isCollaborationEnabled(mParameters.oView)) {
                  return Promise.resolve(draft.computeSiblingInformation(oContext, oContext)).then(function (siblingInfo) {
                    if (siblingInfo !== null && siblingInfo !== void 0 && siblingInfo.targetContext) {
                      var _siblingInfo$targetCo2 = siblingInfo.targetContext;
                      _exit2 = true;
                      return _siblingInfo$targetCo2;
                    } else {
                      throw new Error(oResponse);
                    }
                  });
                } else {
                  return Promise.resolve(overwriteOnDemand(mParam.fnWhenDecisionToOverwriteDocumentIsRequired ? mParam.fnWhenDecisionToOverwriteDocumentIsRequired() : true)).then(function (_overwriteOnDemand) {
                    oDraftContext = _overwriteOnDemand;
                  });
                }
              }();
            } else if (!(oResponse && oResponse.canceled)) {
              throw new Error(oResponse);
            }
          }();
        });

        return _temp11 && _temp11.then ? _temp11.then(_temp12) : _temp12(_temp11);
      }, function (exc) {
        throw exc;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * This method creates a sibling context for a subobject page and calculates a sibling path for all intermediate paths
   * between the object page and the subobject page.
   *
   * @param rootCurrentContext The context for the root of the draft
   * @param rightmostCurrentContext The context of the subobject page
   * @returns The siblingInformation object
   */
  var computeSiblingInformation = function (rootCurrentContext, rightmostCurrentContext) {
    try {
      if (!rightmostCurrentContext.getPath().startsWith(rootCurrentContext.getPath())) {
        // Wrong usage !!
        Log.error("Cannot compute rightmost sibling context");
        throw new Error("Cannot compute rightmost sibling context");
      }

      var model = rootCurrentContext.getModel();
      return Promise.resolve(_catch(function () {
        // //////////////////////////////////////////////////////////////////
        // 1. Find all segments between the root object and the sub-object
        // Example: for root = /Param(aa)/Entity(bb) and rightMost = /Param(aa)/Entity(bb)/_Nav(cc)/_SubNav(dd)
        // ---> ["Param(aa)/Entity(bb)", "_Nav(cc)", "_SubNav(dd)"]
        // Find all segments in the rightmost path
        var additionalPath = rightmostCurrentContext.getPath().replace(rootCurrentContext.getPath(), "");
        var segments = additionalPath ? additionalPath.substring(1).split("/") : []; // First segment is always the full path of the root object, which can contain '/' in case of a parametrized entity

        segments.unshift(rootCurrentContext.getPath().substring(1)); // //////////////////////////////////////////////////////////////////
        // 2. Request canonical paths of the sibling entity for each segment
        // Example: for ["Param(aa)/Entity(bb)", "_Nav(cc)", "_SubNav(dd)"]
        // --> request canonical paths for "Param(aa)/Entity(bb)/SiblingEntity", "Param(aa)/Entity(bb)/_Nav(cc)/SiblingEntity", "Param(aa)/Entity(bb)/_Nav(cc)/_SubNav(dd)/SiblingEntity"

        var oldPaths = [];
        var newPaths = [];
        var currentPath = "";
        var canonicalPathPromises = segments.map(function (segment) {
          currentPath += "/".concat(segment);
          oldPaths.unshift(currentPath);

          if (currentPath.endsWith(")")) {
            var siblingContext = model.bindContext("".concat(currentPath, "/SiblingEntity")).getBoundContext();
            return siblingContext.requestCanonicalPath();
          } else {
            return Promise.resolve(undefined); // 1-1 relation
          }
        }); // //////////////////////////////////////////////////////////////////
        // 3. Reconstruct the full paths from canonical paths (for path mapping)
        // Example: for canonical paths "/Param(aa)/Entity(bb-sibling)", "/Entity2(cc-sibling)", "/Entity3(dd-sibling)"
        // --> ["Param(aa)/Entity(bb-sibling)", "Param(aa)/Entity(bb-sibling)/_Nav(cc-sibling)", "Param(aa)/Entity(bb-sibling)/_Nav(cc-sibling)/_SubNav(dd-sibling)"]

        return Promise.resolve(Promise.all(canonicalPathPromises)).then(function (_Promise$all) {
          var canonicalPaths = _Promise$all;
          var siblingPath = "";
          canonicalPaths.forEach(function (canonicalPath, index) {
            if (index !== 0) {
              if (segments[index].endsWith(")")) {
                var navigation = segments[index].replace(/\(.*$/, ""); // Keep only navigation name from the segment, i.e. aaa(xxx) --> aaa

                var keys = canonicalPath.replace(/.*\(/, "("); // Keep only the keys from the canonical path, i.e. aaa(xxx) --> (xxx)

                siblingPath += "/".concat(navigation).concat(keys);
              } else {
                siblingPath += "/".concat(segments[index]); // 1-1 relation
              }
            } else {
              siblingPath = canonicalPath; // To manage parametrized entities
            }

            newPaths.unshift(siblingPath);
          });
          return {
            targetContext: model.bindContext(siblingPath).getBoundContext(),
            // Create the rightmost sibling context from its path
            pathMapping: oldPaths.map(function (oldPath, index) {
              return {
                oldPath: oldPath,
                newPath: newPaths[index]
              };
            })
          };
        });
      }, function () {
        // A canonical path couldn't be resolved (because a sibling doesn't exist)
        return undefined;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Executes discard of a draft function using HTTP Post.
   *
   * @function
   * @param oContext Context for which the action should be performed
   * @param oAppComponent App Component
   * @param bEnableStrictHandling
   * @returns Resolve function returns the context of the operation
   * @private
   * @ui5-restricted
   */
  var executeDraftDiscardAction = function (oContext, oAppComponent, bEnableStrictHandling) {
    try {
      if (!oContext.getProperty("IsActiveEntity")) {
        function _temp10(oResourceBundle) {
          var sGroupId = "direct";
          var sActionName = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DRAFT_DISCARD_BUTTON", oResourceBundle); // as the discard action doesnt' send the active version in the response we do not use the replace in cache

          var oDiscardPromise = !bEnableStrictHandling ? oDiscardOperation.execute(sGroupId) : oDiscardOperation.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(draft, sGroupId, {
            label: sActionName,
            model: oContext.getModel()
          }, oResourceBundle, null, null, null, undefined), false);
          oContext.getModel().submitBatch(sGroupId);
          return oDiscardPromise;
        }

        var oDiscardOperation = draft.createOperation(oContext, draftOperations.DISCARD);
        return Promise.resolve(oAppComponent ? Promise.resolve(oAppComponent.getModel("sap.fe.i18n").getResourceBundle()).then(_temp10) : _temp10(oAppComponent));
      } else {
        throw new Error("The discard action cannot be executed on an active document");
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Activates a draft document. The draft will replace the sibling entity and will be deleted by the back end.
   *
   * @function
   * @param oContext Context for which the action should be performed
   * @param oAppComponent The AppComponent
   * @param [sGroupId] The optional batch group in which the operation is to be executed
   * @returns Resolve function returns the context of the operation
   * @private
   * @ui5-restricted
   */
  var executeDraftActivationAction = function (oContext, oAppComponent, sGroupId) {
    try {
      var bHasPrepareAction = hasPrepareAction(oContext); // According to the draft spec if the service contains a prepare action and we trigger both prepare and
      // activate in one $batch the activate action is called with iF-Match=*

      var bIgnoreEtag = bHasPrepareAction;

      if (!oContext.getProperty("IsActiveEntity")) {
        var oOperation = createOperation(oContext, draftOperations.ACTIVATION, {
          $$inheritExpandSelect: true
        });
        return Promise.resolve(oAppComponent.getModel("sap.fe.i18n").getResourceBundle()).then(function (oResourceBundle) {
          var sActionName = CommonUtils.getTranslatedText("C_OP_OBJECT_PAGE_SAVE", oResourceBundle);
          return _catch(function () {
            return Promise.resolve(oOperation.execute(sGroupId, bIgnoreEtag, sGroupId ? operationsHelper.fnOnStrictHandlingFailed.bind(draft, sGroupId, {
              label: sActionName,
              model: oContext.getModel()
            }, oResourceBundle, null, null, null, undefined) : undefined, oContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")));
          }, function (e) {
            function _temp5() {
              throw e;
            }

            var _temp4 = function () {
              if (bHasPrepareAction) {
                var actionName = getActionName(oContext, draftOperations.PREPARE),
                    oSideEffectsService = oAppComponent.getSideEffectsService(),
                    oBindingParameters = oSideEffectsService.getODataActionSideEffects(actionName, oContext),
                    aTargetPaths = oBindingParameters && oBindingParameters.pathExpressions;

                var _temp6 = function () {
                  if (aTargetPaths && aTargetPaths.length > 0) {
                    var _temp7 = _catch(function () {
                      return Promise.resolve(oSideEffectsService.requestSideEffects(aTargetPaths, oContext)).then(function () {});
                    }, function (oError) {
                      Log.error("Error while requesting side effects", oError);
                    });

                    if (_temp7 && _temp7.then) return _temp7.then(function () {});
                  } else {
                    var _temp8 = _catch(function () {
                      return Promise.resolve(requestMessages(oContext, oSideEffectsService)).then(function () {});
                    }, function (oError) {
                      Log.error("Error while requesting messages", oError);
                    });

                    if (_temp8 && _temp8.then) return _temp8.then(function () {});
                  }
                }();

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
          });
        });
      } else {
        throw new Error("The activation action cannot be executed on an active document");
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Gets the supported message property path on the PrepareAction for a context.
   *
   * @function
   * @param oContext Context to be checked
   * @returns Path to the message
   * @private
   * @ui5-restricted
   */


  /**
   * Executes the validation of the draft. The PrepareAction is triggered if the messages are annotated and entitySet gets a PreparationAction annotated.
   * If the operation succeeds and operation doesn't get a return type (RAP system) the messages are requested.
   *
   * @function
   * @param oContext Context for which the PrepareAction should be performed
   * @param oAppComponent The AppComponent
   * @returns Resolve function returns
   *  - the context of the operation if the action has been successfully executed
   *  - void if the action has failed
   *  - undefined if the action has not been triggered since the prerequisites are not met
   * @private
   * @ui5-restricted
   */
  var executeDraftValidation = function (oContext, oAppComponent) {
    try {
      if (draft.getMessagesPath(oContext) && draft.hasPrepareAction(oContext)) {
        return Promise.resolve(draft.executeDraftPreparationAction(oContext, oContext.getUpdateGroupId(), true).then(function (oOperation) {
          // if there is no returned operation by executeDraftPreparationAction -> the action has failed
          if (oOperation && !getReturnType(oContext, draftOperations.PREPARE)) {
            var oSideEffectsService = oAppComponent.getSideEffectsService();
            requestMessages(oContext, oSideEffectsService);
          }

          return oOperation;
        }).catch(function (oError) {
          Log.error("Error while requesting messages", oError);
        }));
      }

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Creates a new draft from an active document.
   *
   * @function
   * @param oContext Context for which the action should be performed
   * @param bPreserveChanges If true - existing changes from another user that are not locked are preserved and an error message (http status 409) is send from the backend, otherwise false - existing changes from another user that are not locked are overwritten</li>
   * @param oView If true - existing changes from another
   * @returns Resolve function returns the context of the operation
   * @private
   * @ui5-restricted
   */
  var executeDraftEditAction = function (oContext, bPreserveChanges, oView) {
    try {
      if (oContext.getProperty("IsActiveEntity")) {
        var oOptions = {
          $$inheritExpandSelect: true
        };
        var oOperation = createOperation(oContext, draftOperations.EDIT, oOptions);
        oOperation.setParameter("PreserveChanges", bPreserveChanges);
        var sGroupId = "direct";
        return Promise.resolve(oView.getModel("sap.fe.i18n").getResourceBundle()).then(function (oResourceBundle) {
          var sActionName = CommonUtils.getTranslatedText("C_COMMON_OBJECT_PAGE_EDIT", oResourceBundle); //If the context is coming from a list binding we pass the flag true to replace the context by the active one

          var oEditPromise = oOperation.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(draft, sGroupId, {
            label: sActionName,
            model: oContext.getModel()
          }, oResourceBundle, null, null, null, undefined), oContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding"));
          oOperation.getModel().submitBatch(sGroupId);
          return Promise.resolve(oEditPromise);
        });
      } else {
        throw new Error("You cannot edit this draft document");
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Interface for callbacks used in the functions
   *
   *
   * @author SAP SE
   * @since 1.54.0
   * @interface
   * @name sap.fe.core.actions.draft.ICallback
   * @private
   */

  /**
   * Callback to approve or reject the creation of a draft
   *
   * @name sap.fe.core.actions.draft.ICallback.beforeCreateDraftFromActiveDocument
   * @function
   * @static
   * @abstract
   * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
   * @returns {(boolean|Promise)} Approval of draft creation [true|false] or Promise that resolves with the boolean value
   * @private
   */

  /**
   * Callback after a draft was successully created
   *
   * @name sap.fe.core.actions.draft.ICallback.afterCreateDraftFromActiveDocument
   * @function
   * @static
   * @abstract
   * @param {sap.ui.model.odata.v4.Context} oContext Context of the new draft
   * @param {sap.ui.model.odata.v4.Context} oActiveDocumentContext Context of the active document for the new draft
   * @returns {sap.ui.model.odata.v4.Context} oActiveDocumentContext
   * @private
   */

  /**
   * Callback to approve or reject overwriting an unsaved draft of another user
   *
   * @name sap.fe.core.actions.draft.ICallback.whenDecisionToOverwriteDocumentIsRequired
   * @function
   * @public
   * @static
   * @abstract
   * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
   * @returns {(boolean|Promise)} Approval to overwrite unsaved draft [true|false] or Promise that resolves with the boolean value
   * @ui5-restricted
   */

  /* Constants for draft operations */
  var draftOperations = {
    EDIT: "EditAction",
    ACTIVATION: "ActivationAction",
    DISCARD: "DiscardAction",
    PREPARE: "PreparationAction"
  };
  /**
   * Static functions for the draft programming model
   *
   * @namespace
   * @alias sap.fe.core.actions.draft
   * @private
   * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
   * @since 1.54.0
   */

  /**
   * Determines action name for a draft operation.
   *
   * @param oContext The context that should be bound to the operation
   * @param sOperation The operation name
   * @returns The name of the draft operation
   */

  function getActionName(oContext, sOperation) {
    var oModel = oContext.getModel(),
        oMetaModel = oModel.getMetaModel(),
        sEntitySetPath = oMetaModel.getMetaPath(oContext.getPath());
    return oMetaModel.getObject("".concat(sEntitySetPath, "@com.sap.vocabularies.Common.v1.DraftRoot/").concat(sOperation));
  }
  /**
   * Creates an operation context binding for the given context and operation.
   *
   * @param oContext The context that should be bound to the operation
   * @param sOperation The operation (action or function import)
   * @param oOptions Options to create the operation context
   * @returns The context binding of the bound operation
   */


  function createOperation(oContext, sOperation, oOptions) {
    var sOperationName = getActionName(oContext, sOperation);
    return oContext.getModel().bindContext("".concat(sOperationName, "(...)"), oContext, oOptions);
  }
  /**
   * Determines the return type for a draft operation.
   *
   * @param oContext The context that should be bound to the operation
   * @param sOperation The operation name
   * @returns The return type of the draft operation
   */


  function getReturnType(oContext, sOperation) {
    var oModel = oContext.getModel(),
        oMetaModel = oModel.getMetaModel(),
        sEntitySetPath = oMetaModel.getMetaPath(oContext.getPath());
    return oMetaModel.getObject("".concat(sEntitySetPath, "@com.sap.vocabularies.Common.v1.DraftRoot/").concat(sOperation, "/$ReturnType"));
  }
  /**
   * Check if optional draft prepare action exists.
   *
   * @param oContext The context that should be bound to the operation
   * @returns True if a a prepare action exists
   */


  function hasPrepareAction(oContext) {
    return !!getActionName(oContext, draftOperations.PREPARE);
  }

  function getMessagePathForPrepare(oContext) {
    var oMetaModel = oContext.getModel().getMetaModel();
    var sContextPath = oMetaModel.getMetaPath(oContext.getPath());
    var oReturnType = getReturnType(oContext, draftOperations.PREPARE); // If there is no return parameter, it is not possible to request Messages.
    // RAP draft prepare has no return parameter

    return !!oReturnType ? oMetaModel.getObject("".concat(sContextPath, "/@").concat("com.sap.vocabularies.Common.v1.Messages", "/$Path")) : null;
  }
  /**
   * Execute a preparation action.
   *
   * @function
   * @param oContext Context for which the action should be performed
   * @param groupId The optional batch group in which we want to execute the operation
   * @param bMessages If set to true, the PREPARE action retrieves SAP_Messages
   * @returns Resolve function returns the context of the operation
   * @private
   * @ui5-restricted
   */


  function executeDraftPreparationAction(oContext, groupId, bMessages) {
    if (!oContext.getProperty("IsActiveEntity")) {
      var sMessagesPath = bMessages ? getMessagePathForPrepare(oContext) : null;
      var oOperation = createOperation(oContext, draftOperations.PREPARE, sMessagesPath ? {
        $select: sMessagesPath
      } : null); // TODO: side effects qualifier shall be even deprecated to be checked

      oOperation.setParameter("SideEffectsQualifier", "");
      var sGroupId = groupId || oOperation.getGroupId();
      return oOperation.execute(sGroupId).then(function () {
        return oOperation;
      }).catch(function (oError) {
        Log.error("Error while executing the operation", oError);
      });
    } else {
      throw new Error("The preparation action cannot be executed on an active document");
    }
  }
  /**
   * Determines the message path for a context.
   *
   * @function
   * @param oContext Context for which the path shall be determined
   * @returns Message path, empty if not annotated
   * @private
   * @ui5-restricted
   */


  function getMessagesPath(oContext) {
    var oModel = oContext.getModel(),
        oMetaModel = oModel.getMetaModel(),
        sEntitySetPath = oMetaModel.getMetaPath(oContext.getPath());
    return oMetaModel.getObject("".concat(sEntitySetPath, "/@com.sap.vocabularies.Common.v1.Messages/$Path"));
  }
  /**
   * Requests the messages if annotated for a given context.
   *
   * @function
   * @param oContext Context for which the messages shall be requested
   * @param oSideEffectsService Service for the SideEffects on SAP Fiori elements
   * @returns Promise which is resolved once messages were requested
   * @private
   * @ui5-restricted
   */


  function requestMessages(oContext, oSideEffectsService) {
    var sMessagesPath = draft.getMessagesPath(oContext);

    if (sMessagesPath) {
      return oSideEffectsService.requestSideEffects([{
        $PropertyPath: sMessagesPath
      }], oContext);
    }

    return Promise.resolve();
  }

  function deleteDraft(oContext, oAppComponent, bEnableStrictHandling) {
    var sDiscardAction = getActionName(oContext, draftOperations.DISCARD),
        bIsActiveEntity = oContext.getObject().IsActiveEntity;

    if (bIsActiveEntity || !bIsActiveEntity && !sDiscardAction) {
      //Use Delete in case of active entity and no discard action available for draft
      if (oContext.hasPendingChanges()) {
        return oContext.getBinding().resetChanges().then(function () {
          return oContext.delete();
        }).catch(function (error) {
          return Promise.reject(error);
        });
      } else {
        return oContext.delete();
      }
    } else {
      //Use Discard Post Action if it is a draft entity and discard action exists
      return executeDraftDiscardAction(oContext, oAppComponent, bEnableStrictHandling);
    }
  }

  var draft = {
    createDraftFromActiveDocument: createDraftFromActiveDocument,
    activateDocument: activateDocument,
    deleteDraft: deleteDraft,
    executeDraftEditAction: executeDraftEditAction,
    executeDraftValidation: executeDraftValidation,
    executeDraftPreparationAction: executeDraftPreparationAction,
    executeDraftActivationAction: executeDraftActivationAction,
    hasPrepareAction: hasPrepareAction,
    getMessagesPath: getMessagesPath,
    computeSiblingInformation: computeSiblingInformation,
    processDataLossOrDraftDiscardConfirmation: draftDataLossPopup.processDataLossOrDraftDiscardConfirmation,
    silentlyKeepDraftOnForwardNavigation: draftDataLossPopup.silentlyKeepDraftOnForwardNavigation,
    createOperation: createOperation,
    executeDraftDiscardAction: executeDraftDiscardAction,
    NavigationType: draftDataLossPopup.NavigationType
  };
  return draft;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiYWN0aXZhdGVEb2N1bWVudCIsIm9Db250ZXh0Iiwib0FwcENvbXBvbmVudCIsIm1QYXJhbWV0ZXJzIiwibWVzc2FnZUhhbmRsZXIiLCJiRXhlY3V0ZSIsIm1QYXJhbSIsImZuQWZ0ZXJBY3RpdmF0ZURvY3VtZW50Iiwib0FjdGl2ZURvY3VtZW50Q29udGV4dCIsIkVycm9yIiwiZ2V0UGF0aCIsImhhc1ByZXBhcmVBY3Rpb24iLCJleGVjdXRlRHJhZnRBY3RpdmF0aW9uQWN0aW9uIiwic0JhdGNoR3JvdXAiLCJvUHJlcGFyZVByb21pc2UiLCJkcmFmdCIsImV4ZWN1dGVEcmFmdFByZXBhcmF0aW9uQWN0aW9uIiwiZ2V0TW9kZWwiLCJzdWJtaXRCYXRjaCIsIm9BY3RpdmF0ZVByb21pc2UiLCJQcm9taXNlIiwiYWxsIiwidmFsdWVzIiwiZXJyIiwic01lc3NhZ2VzUGF0aCIsImdldE1lc3NhZ2VQYXRoRm9yUHJlcGFyZSIsInJlcXVlc3RPYmplY3QiLCJkYXRhIiwibGVuZ3RoIiwicmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzIiwiZm5CZWZvcmVBY3RpdmF0ZURvY3VtZW50IiwiY3JlYXRlRHJhZnRGcm9tQWN0aXZlRG9jdW1lbnQiLCJvdmVyd3JpdGVPbkRlbWFuZCIsImJPdmVyd3JpdGUiLCJvTW9kZWwiLCJkcmFmdERhdGFDb250ZXh0IiwiYmluZENvbnRleHQiLCJnZXRCb3VuZENvbnRleHQiLCJvVmlldyIsImdldFJlc291cmNlQnVuZGxlIiwib1Jlc291cmNlQnVuZGxlIiwiZHJhZnRBZG1pbkRhdGEiLCJtZXNzYWdlSGFuZGxpbmciLCJyZW1vdmVVbmJvdW5kVHJhbnNpdGlvbk1lc3NhZ2VzIiwic0luZm8iLCJJblByb2Nlc3NCeVVzZXJEZXNjcmlwdGlvbiIsIkluUHJvY2Vzc0J5VXNlciIsInNFbnRpdHlTZXQiLCJnZXRWaWV3RGF0YSIsImVudGl0eVNldCIsInNMb2NrZWRCeVVzZXJNc2ciLCJDb21tb25VdGlscyIsImdldFRyYW5zbGF0ZWRUZXh0IiwiTWVzc2FnZUJveCIsImVycm9yIiwiQ3JlYXRlZEJ5VXNlckRlc2NyaXB0aW9uIiwiQ3JlYXRlZEJ5VXNlciIsInNVbnNhdmVkQ2hhbmdlc01zZyIsInNob3dNZXNzYWdlQm94IiwiZXhlY3V0ZURyYWZ0RWRpdEFjdGlvbiIsInJlc29sdmUiLCJyZWplY3QiLCJvRGlhbG9nIiwiRGlhbG9nIiwidGl0bGUiLCJsb2NhbEkxOG5SZWYiLCJnZXRUZXh0Iiwic3RhdGUiLCJjb250ZW50IiwiVGV4dCIsInRleHQiLCJiZWdpbkJ1dHRvbiIsIkJ1dHRvbiIsInR5cGUiLCJwcmVzcyIsImNsb3NlIiwiZW5kQnV0dG9uIiwiYWZ0ZXJDbG9zZSIsImRlc3Ryb3kiLCJhZGRTdHlsZUNsYXNzIiwib3BlbiIsIkNvcmUiLCJnZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUiLCJiUnVuUHJlc2VydmVDaGFuZ2VzRmxvdyIsImJQcmVzZXJ2ZUNoYW5nZXMiLCJmbkJlZm9yZUNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50Iiwib0RyYWZ0Q29udGV4dCIsImZuQWZ0ZXJDcmVhdGVEcmFmdEZyb21BY3RpdmVEb2N1bWVudCIsInNFZGl0QWN0aW9uTmFtZSIsImdldEFjdGlvbk5hbWUiLCJkcmFmdE9wZXJhdGlvbnMiLCJFRElUIiwib1NpZGVFZmZlY3RzIiwiZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlIiwiZ2V0T0RhdGFBY3Rpb25TaWRlRWZmZWN0cyIsInRyaWdnZXJBY3Rpb25zIiwicmVxdWVzdFNpZGVFZmZlY3RzRm9yT0RhdGFBY3Rpb24iLCJ1bmRlZmluZWQiLCJvUmVzcG9uc2UiLCJzdGF0dXMiLCJyZW1vdmVCb3VuZFRyYW5zaXRpb25NZXNzYWdlcyIsIkFjdGl2aXR5U3luYyIsImlzQ29sbGFib3JhdGlvbkVuYWJsZWQiLCJjb21wdXRlU2libGluZ0luZm9ybWF0aW9uIiwic2libGluZ0luZm8iLCJ0YXJnZXRDb250ZXh0IiwiZm5XaGVuRGVjaXNpb25Ub092ZXJ3cml0ZURvY3VtZW50SXNSZXF1aXJlZCIsImNhbmNlbGVkIiwiZXhjIiwicm9vdEN1cnJlbnRDb250ZXh0IiwicmlnaHRtb3N0Q3VycmVudENvbnRleHQiLCJzdGFydHNXaXRoIiwiTG9nIiwibW9kZWwiLCJhZGRpdGlvbmFsUGF0aCIsInJlcGxhY2UiLCJzZWdtZW50cyIsInN1YnN0cmluZyIsInNwbGl0IiwidW5zaGlmdCIsIm9sZFBhdGhzIiwibmV3UGF0aHMiLCJjdXJyZW50UGF0aCIsImNhbm9uaWNhbFBhdGhQcm9taXNlcyIsIm1hcCIsInNlZ21lbnQiLCJlbmRzV2l0aCIsInNpYmxpbmdDb250ZXh0IiwicmVxdWVzdENhbm9uaWNhbFBhdGgiLCJjYW5vbmljYWxQYXRocyIsInNpYmxpbmdQYXRoIiwiZm9yRWFjaCIsImNhbm9uaWNhbFBhdGgiLCJpbmRleCIsIm5hdmlnYXRpb24iLCJrZXlzIiwicGF0aE1hcHBpbmciLCJvbGRQYXRoIiwibmV3UGF0aCIsImV4ZWN1dGVEcmFmdERpc2NhcmRBY3Rpb24iLCJiRW5hYmxlU3RyaWN0SGFuZGxpbmciLCJnZXRQcm9wZXJ0eSIsInNHcm91cElkIiwic0FjdGlvbk5hbWUiLCJvRGlzY2FyZFByb21pc2UiLCJvRGlzY2FyZE9wZXJhdGlvbiIsImV4ZWN1dGUiLCJvcGVyYXRpb25zSGVscGVyIiwiZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkIiwiYmluZCIsImxhYmVsIiwiY3JlYXRlT3BlcmF0aW9uIiwiRElTQ0FSRCIsImJIYXNQcmVwYXJlQWN0aW9uIiwiYklnbm9yZUV0YWciLCJvT3BlcmF0aW9uIiwiQUNUSVZBVElPTiIsIiQkaW5oZXJpdEV4cGFuZFNlbGVjdCIsImdldEJpbmRpbmciLCJpc0EiLCJhY3Rpb25OYW1lIiwiUFJFUEFSRSIsIm9TaWRlRWZmZWN0c1NlcnZpY2UiLCJvQmluZGluZ1BhcmFtZXRlcnMiLCJhVGFyZ2V0UGF0aHMiLCJwYXRoRXhwcmVzc2lvbnMiLCJyZXF1ZXN0U2lkZUVmZmVjdHMiLCJvRXJyb3IiLCJyZXF1ZXN0TWVzc2FnZXMiLCJleGVjdXRlRHJhZnRWYWxpZGF0aW9uIiwiZ2V0TWVzc2FnZXNQYXRoIiwiZ2V0VXBkYXRlR3JvdXBJZCIsImdldFJldHVyblR5cGUiLCJjYXRjaCIsIm9PcHRpb25zIiwic2V0UGFyYW1ldGVyIiwib0VkaXRQcm9taXNlIiwic09wZXJhdGlvbiIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzRW50aXR5U2V0UGF0aCIsImdldE1ldGFQYXRoIiwiZ2V0T2JqZWN0Iiwic09wZXJhdGlvbk5hbWUiLCJzQ29udGV4dFBhdGgiLCJvUmV0dXJuVHlwZSIsImdyb3VwSWQiLCJiTWVzc2FnZXMiLCIkc2VsZWN0IiwiZ2V0R3JvdXBJZCIsIiRQcm9wZXJ0eVBhdGgiLCJkZWxldGVEcmFmdCIsInNEaXNjYXJkQWN0aW9uIiwiYklzQWN0aXZlRW50aXR5IiwiSXNBY3RpdmVFbnRpdHkiLCJoYXNQZW5kaW5nQ2hhbmdlcyIsInJlc2V0Q2hhbmdlcyIsImRlbGV0ZSIsInByb2Nlc3NEYXRhTG9zc09yRHJhZnREaXNjYXJkQ29uZmlybWF0aW9uIiwiZHJhZnREYXRhTG9zc1BvcHVwIiwic2lsZW50bHlLZWVwRHJhZnRPbkZvcndhcmROYXZpZ2F0aW9uIiwiTmF2aWdhdGlvblR5cGUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbImRyYWZ0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbkFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQ29tbW9uXCI7XG5pbXBvcnQgdHlwZSBSZXNvdXJjZUJ1bmRsZSBmcm9tIFwic2FwL2Jhc2UvaTE4bi9SZXNvdXJjZUJ1bmRsZVwiO1xuaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IEFjdGl2aXR5U3luYyBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvY29sbGFib3JhdGlvbi9BY3Rpdml0eVN5bmNcIjtcbmltcG9ydCBtZXNzYWdlSGFuZGxpbmcgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL21lc3NhZ2VIYW5kbGVyL21lc3NhZ2VIYW5kbGluZ1wiO1xuaW1wb3J0IHR5cGUgeyBTaWRlRWZmZWN0c1NlcnZpY2UgfSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvU2lkZUVmZmVjdHNTZXJ2aWNlRmFjdG9yeVwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwic2FwL20vQnV0dG9uXCI7XG5pbXBvcnQgRGlhbG9nIGZyb20gXCJzYXAvbS9EaWFsb2dcIjtcbmltcG9ydCBNZXNzYWdlQm94IGZyb20gXCJzYXAvbS9NZXNzYWdlQm94XCI7XG5pbXBvcnQgVGV4dCBmcm9tIFwic2FwL20vVGV4dFwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCB0eXBlIFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgdHlwZSBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvcmVzb3VyY2UvUmVzb3VyY2VNb2RlbFwiO1xuaW1wb3J0IHR5cGUgeyBPRGF0YUNvbnRleHRCaW5kaW5nRXgsIFY0Q29udGV4dCB9IGZyb20gXCJ0eXBlcy9leHRlbnNpb25fdHlwZXNcIjtcbmltcG9ydCBvcGVyYXRpb25zSGVscGVyIGZyb20gXCIuLi8uLi9vcGVyYXRpb25zSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBNZXNzYWdlSGFuZGxlciBmcm9tIFwiLi4vTWVzc2FnZUhhbmRsZXJcIjtcbmltcG9ydCBkcmFmdERhdGFMb3NzUG9wdXAgZnJvbSBcIi4vZHJhZnREYXRhTG9zc1BvcHVwXCI7XG5cbmV4cG9ydCB0eXBlIFNpYmxpbmdJbmZvcm1hdGlvbiA9IHtcblx0dGFyZ2V0Q29udGV4dDogVjRDb250ZXh0O1xuXHRwYXRoTWFwcGluZzogeyBvbGRQYXRoOiBzdHJpbmc7IG5ld1BhdGg6IHN0cmluZyB9W107XG59O1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY2FsbGJhY2tzIHVzZWQgaW4gdGhlIGZ1bmN0aW9uc1xuICpcbiAqXG4gKiBAYXV0aG9yIFNBUCBTRVxuICogQHNpbmNlIDEuNTQuMFxuICogQGludGVyZmFjZVxuICogQG5hbWUgc2FwLmZlLmNvcmUuYWN0aW9ucy5kcmFmdC5JQ2FsbGJhY2tcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBDYWxsYmFjayB0byBhcHByb3ZlIG9yIHJlamVjdCB0aGUgY3JlYXRpb24gb2YgYSBkcmFmdFxuICpcbiAqIEBuYW1lIHNhcC5mZS5jb3JlLmFjdGlvbnMuZHJhZnQuSUNhbGxiYWNrLmJlZm9yZUNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50XG4gKiBAZnVuY3Rpb25cbiAqIEBzdGF0aWNcbiAqIEBhYnN0cmFjdFxuICogQHBhcmFtIHtzYXAudWkubW9kZWwub2RhdGEudjQuQ29udGV4dH0gb0NvbnRleHQgQ29udGV4dCBvZiB0aGUgYWN0aXZlIGRvY3VtZW50IGZvciB0aGUgbmV3IGRyYWZ0XG4gKiBAcmV0dXJucyB7KGJvb2xlYW58UHJvbWlzZSl9IEFwcHJvdmFsIG9mIGRyYWZ0IGNyZWF0aW9uIFt0cnVlfGZhbHNlXSBvciBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgYm9vbGVhbiB2YWx1ZVxuICogQHByaXZhdGVcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIGFmdGVyIGEgZHJhZnQgd2FzIHN1Y2Nlc3N1bGx5IGNyZWF0ZWRcbiAqXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5hY3Rpb25zLmRyYWZ0LklDYWxsYmFjay5hZnRlckNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50XG4gKiBAZnVuY3Rpb25cbiAqIEBzdGF0aWNcbiAqIEBhYnN0cmFjdFxuICogQHBhcmFtIHtzYXAudWkubW9kZWwub2RhdGEudjQuQ29udGV4dH0gb0NvbnRleHQgQ29udGV4dCBvZiB0aGUgbmV3IGRyYWZ0XG4gKiBAcGFyYW0ge3NhcC51aS5tb2RlbC5vZGF0YS52NC5Db250ZXh0fSBvQWN0aXZlRG9jdW1lbnRDb250ZXh0IENvbnRleHQgb2YgdGhlIGFjdGl2ZSBkb2N1bWVudCBmb3IgdGhlIG5ldyBkcmFmdFxuICogQHJldHVybnMge3NhcC51aS5tb2RlbC5vZGF0YS52NC5Db250ZXh0fSBvQWN0aXZlRG9jdW1lbnRDb250ZXh0XG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gYXBwcm92ZSBvciByZWplY3Qgb3ZlcndyaXRpbmcgYW4gdW5zYXZlZCBkcmFmdCBvZiBhbm90aGVyIHVzZXJcbiAqXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5hY3Rpb25zLmRyYWZ0LklDYWxsYmFjay53aGVuRGVjaXNpb25Ub092ZXJ3cml0ZURvY3VtZW50SXNSZXF1aXJlZFxuICogQGZ1bmN0aW9uXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAYWJzdHJhY3RcbiAqIEBwYXJhbSB7c2FwLnVpLm1vZGVsLm9kYXRhLnY0LkNvbnRleHR9IG9Db250ZXh0IENvbnRleHQgb2YgdGhlIGFjdGl2ZSBkb2N1bWVudCBmb3IgdGhlIG5ldyBkcmFmdFxuICogQHJldHVybnMgeyhib29sZWFufFByb21pc2UpfSBBcHByb3ZhbCB0byBvdmVyd3JpdGUgdW5zYXZlZCBkcmFmdCBbdHJ1ZXxmYWxzZV0gb3IgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGJvb2xlYW4gdmFsdWVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG4vKiBDb25zdGFudHMgZm9yIGRyYWZ0IG9wZXJhdGlvbnMgKi9cbmNvbnN0IGRyYWZ0T3BlcmF0aW9ucyA9IHtcblx0RURJVDogXCJFZGl0QWN0aW9uXCIsXG5cdEFDVElWQVRJT046IFwiQWN0aXZhdGlvbkFjdGlvblwiLFxuXHRESVNDQVJEOiBcIkRpc2NhcmRBY3Rpb25cIixcblx0UFJFUEFSRTogXCJQcmVwYXJhdGlvbkFjdGlvblwiXG59O1xuXG4vKipcbiAqIFN0YXRpYyBmdW5jdGlvbnMgZm9yIHRoZSBkcmFmdCBwcm9ncmFtbWluZyBtb2RlbFxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBhbGlhcyBzYXAuZmUuY29yZS5hY3Rpb25zLmRyYWZ0XG4gKiBAcHJpdmF0ZVxuICogQGV4cGVyaW1lbnRhbCBUaGlzIG1vZHVsZSBpcyBvbmx5IGZvciBleHBlcmltZW50YWwgdXNlISA8YnIvPjxiPlRoaXMgaXMgb25seSBhIFBPQyBhbmQgbWF5YmUgZGVsZXRlZDwvYj5cbiAqIEBzaW5jZSAxLjU0LjBcbiAqL1xuXG4vKipcbiAqIERldGVybWluZXMgYWN0aW9uIG5hbWUgZm9yIGEgZHJhZnQgb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSBvQ29udGV4dCBUaGUgY29udGV4dCB0aGF0IHNob3VsZCBiZSBib3VuZCB0byB0aGUgb3BlcmF0aW9uXG4gKiBAcGFyYW0gc09wZXJhdGlvbiBUaGUgb3BlcmF0aW9uIG5hbWVcbiAqIEByZXR1cm5zIFRoZSBuYW1lIG9mIHRoZSBkcmFmdCBvcGVyYXRpb25cbiAqL1xuZnVuY3Rpb24gZ2V0QWN0aW9uTmFtZShvQ29udGV4dDogVjRDb250ZXh0LCBzT3BlcmF0aW9uOiBzdHJpbmcpIHtcblx0Y29uc3Qgb01vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKSxcblx0XHRvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdHNFbnRpdHlTZXRQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQ29udGV4dC5nZXRQYXRoKCkpO1xuXG5cdHJldHVybiBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzRW50aXR5U2V0UGF0aH1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdC8ke3NPcGVyYXRpb259YCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYW4gb3BlcmF0aW9uIGNvbnRleHQgYmluZGluZyBmb3IgdGhlIGdpdmVuIGNvbnRleHQgYW5kIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0gb0NvbnRleHQgVGhlIGNvbnRleHQgdGhhdCBzaG91bGQgYmUgYm91bmQgdG8gdGhlIG9wZXJhdGlvblxuICogQHBhcmFtIHNPcGVyYXRpb24gVGhlIG9wZXJhdGlvbiAoYWN0aW9uIG9yIGZ1bmN0aW9uIGltcG9ydClcbiAqIEBwYXJhbSBvT3B0aW9ucyBPcHRpb25zIHRvIGNyZWF0ZSB0aGUgb3BlcmF0aW9uIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBjb250ZXh0IGJpbmRpbmcgb2YgdGhlIGJvdW5kIG9wZXJhdGlvblxuICovXG5mdW5jdGlvbiBjcmVhdGVPcGVyYXRpb24ob0NvbnRleHQ6IFY0Q29udGV4dCwgc09wZXJhdGlvbjogc3RyaW5nLCBvT3B0aW9ucz86IGFueSkge1xuXHRjb25zdCBzT3BlcmF0aW9uTmFtZSA9IGdldEFjdGlvbk5hbWUob0NvbnRleHQsIHNPcGVyYXRpb24pO1xuXG5cdHJldHVybiBvQ29udGV4dC5nZXRNb2RlbCgpLmJpbmRDb250ZXh0KGAke3NPcGVyYXRpb25OYW1lfSguLi4pYCwgb0NvbnRleHQsIG9PcHRpb25zKTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgcmV0dXJuIHR5cGUgZm9yIGEgZHJhZnQgb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSBvQ29udGV4dCBUaGUgY29udGV4dCB0aGF0IHNob3VsZCBiZSBib3VuZCB0byB0aGUgb3BlcmF0aW9uXG4gKiBAcGFyYW0gc09wZXJhdGlvbiBUaGUgb3BlcmF0aW9uIG5hbWVcbiAqIEByZXR1cm5zIFRoZSByZXR1cm4gdHlwZSBvZiB0aGUgZHJhZnQgb3BlcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldFJldHVyblR5cGUob0NvbnRleHQ6IFY0Q29udGV4dCwgc09wZXJhdGlvbjogc3RyaW5nKSB7XG5cdGNvbnN0IG9Nb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCksXG5cdFx0b01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRzRW50aXR5U2V0UGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob0NvbnRleHQuZ2V0UGF0aCgpKTtcblxuXHRyZXR1cm4gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdFJvb3QvJHtzT3BlcmF0aW9ufS8kUmV0dXJuVHlwZWApO1xufVxuLyoqXG4gKiBDaGVjayBpZiBvcHRpb25hbCBkcmFmdCBwcmVwYXJlIGFjdGlvbiBleGlzdHMuXG4gKlxuICogQHBhcmFtIG9Db250ZXh0IFRoZSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIGJvdW5kIHRvIHRoZSBvcGVyYXRpb25cbiAqIEByZXR1cm5zIFRydWUgaWYgYSBhIHByZXBhcmUgYWN0aW9uIGV4aXN0c1xuICovXG5mdW5jdGlvbiBoYXNQcmVwYXJlQWN0aW9uKG9Db250ZXh0OiBWNENvbnRleHQpOiBib29sZWFuIHtcblx0cmV0dXJuICEhZ2V0QWN0aW9uTmFtZShvQ29udGV4dCwgZHJhZnRPcGVyYXRpb25zLlBSRVBBUkUpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGRyYWZ0IGZyb20gYW4gYWN0aXZlIGRvY3VtZW50LlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgZm9yIHdoaWNoIHRoZSBhY3Rpb24gc2hvdWxkIGJlIHBlcmZvcm1lZFxuICogQHBhcmFtIGJQcmVzZXJ2ZUNoYW5nZXMgSWYgdHJ1ZSAtIGV4aXN0aW5nIGNoYW5nZXMgZnJvbSBhbm90aGVyIHVzZXIgdGhhdCBhcmUgbm90IGxvY2tlZCBhcmUgcHJlc2VydmVkIGFuZCBhbiBlcnJvciBtZXNzYWdlIChodHRwIHN0YXR1cyA0MDkpIGlzIHNlbmQgZnJvbSB0aGUgYmFja2VuZCwgb3RoZXJ3aXNlIGZhbHNlIC0gZXhpc3RpbmcgY2hhbmdlcyBmcm9tIGFub3RoZXIgdXNlciB0aGF0IGFyZSBub3QgbG9ja2VkIGFyZSBvdmVyd3JpdHRlbjwvbGk+XG4gKiBAcGFyYW0gb1ZpZXcgSWYgdHJ1ZSAtIGV4aXN0aW5nIGNoYW5nZXMgZnJvbSBhbm90aGVyXG4gKiBAcmV0dXJucyBSZXNvbHZlIGZ1bmN0aW9uIHJldHVybnMgdGhlIGNvbnRleHQgb2YgdGhlIG9wZXJhdGlvblxuICogQHByaXZhdGVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlRHJhZnRFZGl0QWN0aW9uKG9Db250ZXh0OiBWNENvbnRleHQsIGJQcmVzZXJ2ZUNoYW5nZXM6IGJvb2xlYW4sIG9WaWV3OiBhbnkpOiBQcm9taXNlPFY0Q29udGV4dD4ge1xuXHRpZiAob0NvbnRleHQuZ2V0UHJvcGVydHkoXCJJc0FjdGl2ZUVudGl0eVwiKSkge1xuXHRcdGNvbnN0IG9PcHRpb25zID0geyAkJGluaGVyaXRFeHBhbmRTZWxlY3Q6IHRydWUgfTtcblx0XHRjb25zdCBvT3BlcmF0aW9uID0gY3JlYXRlT3BlcmF0aW9uKG9Db250ZXh0LCBkcmFmdE9wZXJhdGlvbnMuRURJVCwgb09wdGlvbnMpO1xuXHRcdG9PcGVyYXRpb24uc2V0UGFyYW1ldGVyKFwiUHJlc2VydmVDaGFuZ2VzXCIsIGJQcmVzZXJ2ZUNoYW5nZXMpO1xuXHRcdGNvbnN0IHNHcm91cElkID0gXCJkaXJlY3RcIjtcblx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSBhd2FpdCAoKG9WaWV3LmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikgYXMgUmVzb3VyY2VNb2RlbCkuZ2V0UmVzb3VyY2VCdW5kbGUoKSBhcyBQcm9taXNlPFJlc291cmNlQnVuZGxlPik7XG5cdFx0Y29uc3Qgc0FjdGlvbk5hbWUgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfQ09NTU9OX09CSkVDVF9QQUdFX0VESVRcIiwgb1Jlc291cmNlQnVuZGxlKTtcblx0XHQvL0lmIHRoZSBjb250ZXh0IGlzIGNvbWluZyBmcm9tIGEgbGlzdCBiaW5kaW5nIHdlIHBhc3MgdGhlIGZsYWcgdHJ1ZSB0byByZXBsYWNlIHRoZSBjb250ZXh0IGJ5IHRoZSBhY3RpdmUgb25lXG5cdFx0Y29uc3Qgb0VkaXRQcm9taXNlID0gb09wZXJhdGlvbi5leGVjdXRlKFxuXHRcdFx0c0dyb3VwSWQsXG5cdFx0XHR1bmRlZmluZWQsXG5cdFx0XHQob3BlcmF0aW9uc0hlbHBlciBhcyBhbnkpLmZuT25TdHJpY3RIYW5kbGluZ0ZhaWxlZC5iaW5kKFxuXHRcdFx0XHRkcmFmdCxcblx0XHRcdFx0c0dyb3VwSWQsXG5cdFx0XHRcdHsgbGFiZWw6IHNBY3Rpb25OYW1lLCBtb2RlbDogb0NvbnRleHQuZ2V0TW9kZWwoKSB9LFxuXHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHVuZGVmaW5lZFxuXHRcdFx0KSxcblx0XHRcdG9Db250ZXh0LmdldEJpbmRpbmcoKS5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFMaXN0QmluZGluZ1wiKVxuXHRcdCk7XG5cdFx0b09wZXJhdGlvbi5nZXRNb2RlbCgpLnN1Ym1pdEJhdGNoKHNHcm91cElkKTtcblx0XHRyZXR1cm4gYXdhaXQgb0VkaXRQcm9taXNlO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIllvdSBjYW5ub3QgZWRpdCB0aGlzIGRyYWZ0IGRvY3VtZW50XCIpO1xuXHR9XG59XG5cbi8qKlxuICogRXhlY3V0ZXMgdGhlIHZhbGlkYXRpb24gb2YgdGhlIGRyYWZ0LiBUaGUgUHJlcGFyZUFjdGlvbiBpcyB0cmlnZ2VyZWQgaWYgdGhlIG1lc3NhZ2VzIGFyZSBhbm5vdGF0ZWQgYW5kIGVudGl0eVNldCBnZXRzIGEgUHJlcGFyYXRpb25BY3Rpb24gYW5ub3RhdGVkLlxuICogSWYgdGhlIG9wZXJhdGlvbiBzdWNjZWVkcyBhbmQgb3BlcmF0aW9uIGRvZXNuJ3QgZ2V0IGEgcmV0dXJuIHR5cGUgKFJBUCBzeXN0ZW0pIHRoZSBtZXNzYWdlcyBhcmUgcmVxdWVzdGVkLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgZm9yIHdoaWNoIHRoZSBQcmVwYXJlQWN0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWRcbiAqIEBwYXJhbSBvQXBwQ29tcG9uZW50IFRoZSBBcHBDb21wb25lbnRcbiAqIEByZXR1cm5zIFJlc29sdmUgZnVuY3Rpb24gcmV0dXJuc1xuICogIC0gdGhlIGNvbnRleHQgb2YgdGhlIG9wZXJhdGlvbiBpZiB0aGUgYWN0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBleGVjdXRlZFxuICogIC0gdm9pZCBpZiB0aGUgYWN0aW9uIGhhcyBmYWlsZWRcbiAqICAtIHVuZGVmaW5lZCBpZiB0aGUgYWN0aW9uIGhhcyBub3QgYmVlbiB0cmlnZ2VyZWQgc2luY2UgdGhlIHByZXJlcXVpc2l0ZXMgYXJlIG5vdCBtZXRcbiAqIEBwcml2YXRlXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZURyYWZ0VmFsaWRhdGlvbihvQ29udGV4dDogVjRDb250ZXh0LCBvQXBwQ29tcG9uZW50OiBBcHBDb21wb25lbnQpOiBQcm9taXNlPE9EYXRhQ29udGV4dEJpbmRpbmdFeCB8IHZvaWQgfCB1bmRlZmluZWQ+IHtcblx0aWYgKGRyYWZ0LmdldE1lc3NhZ2VzUGF0aChvQ29udGV4dCkgJiYgZHJhZnQuaGFzUHJlcGFyZUFjdGlvbihvQ29udGV4dCkpIHtcblx0XHRyZXR1cm4gZHJhZnRcblx0XHRcdC5leGVjdXRlRHJhZnRQcmVwYXJhdGlvbkFjdGlvbihvQ29udGV4dCwgb0NvbnRleHQuZ2V0VXBkYXRlR3JvdXBJZCgpLCB0cnVlKVxuXHRcdFx0LnRoZW4oKG9PcGVyYXRpb24pID0+IHtcblx0XHRcdFx0Ly8gaWYgdGhlcmUgaXMgbm8gcmV0dXJuZWQgb3BlcmF0aW9uIGJ5IGV4ZWN1dGVEcmFmdFByZXBhcmF0aW9uQWN0aW9uIC0+IHRoZSBhY3Rpb24gaGFzIGZhaWxlZFxuXHRcdFx0XHRpZiAob09wZXJhdGlvbiAmJiAhZ2V0UmV0dXJuVHlwZShvQ29udGV4dCwgZHJhZnRPcGVyYXRpb25zLlBSRVBBUkUpKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1NpZGVFZmZlY3RzU2VydmljZSA9IG9BcHBDb21wb25lbnQuZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlKCk7XG5cdFx0XHRcdFx0cmVxdWVzdE1lc3NhZ2VzKG9Db250ZXh0LCBvU2lkZUVmZmVjdHNTZXJ2aWNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb09wZXJhdGlvbjtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKG9FcnJvcikgPT4ge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSByZXF1ZXN0aW5nIG1lc3NhZ2VzXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEFjdGl2YXRlcyBhIGRyYWZ0IGRvY3VtZW50LiBUaGUgZHJhZnQgd2lsbCByZXBsYWNlIHRoZSBzaWJsaW5nIGVudGl0eSBhbmQgd2lsbCBiZSBkZWxldGVkIGJ5IHRoZSBiYWNrIGVuZC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IGZvciB3aGljaCB0aGUgYWN0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWRcbiAqIEBwYXJhbSBvQXBwQ29tcG9uZW50IFRoZSBBcHBDb21wb25lbnRcbiAqIEBwYXJhbSBbc0dyb3VwSWRdIFRoZSBvcHRpb25hbCBiYXRjaCBncm91cCBpbiB3aGljaCB0aGUgb3BlcmF0aW9uIGlzIHRvIGJlIGV4ZWN1dGVkXG4gKiBAcmV0dXJucyBSZXNvbHZlIGZ1bmN0aW9uIHJldHVybnMgdGhlIGNvbnRleHQgb2YgdGhlIG9wZXJhdGlvblxuICogQHByaXZhdGVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlRHJhZnRBY3RpdmF0aW9uQWN0aW9uKG9Db250ZXh0OiBWNENvbnRleHQsIG9BcHBDb21wb25lbnQ6IEFwcENvbXBvbmVudCwgc0dyb3VwSWQ/OiBzdHJpbmcpOiBQcm9taXNlPFY0Q29udGV4dD4ge1xuXHRjb25zdCBiSGFzUHJlcGFyZUFjdGlvbiA9IGhhc1ByZXBhcmVBY3Rpb24ob0NvbnRleHQpO1xuXG5cdC8vIEFjY29yZGluZyB0byB0aGUgZHJhZnQgc3BlYyBpZiB0aGUgc2VydmljZSBjb250YWlucyBhIHByZXBhcmUgYWN0aW9uIGFuZCB3ZSB0cmlnZ2VyIGJvdGggcHJlcGFyZSBhbmRcblx0Ly8gYWN0aXZhdGUgaW4gb25lICRiYXRjaCB0aGUgYWN0aXZhdGUgYWN0aW9uIGlzIGNhbGxlZCB3aXRoIGlGLU1hdGNoPSpcblx0Y29uc3QgYklnbm9yZUV0YWcgPSBiSGFzUHJlcGFyZUFjdGlvbjtcblxuXHRpZiAoIW9Db250ZXh0LmdldFByb3BlcnR5KFwiSXNBY3RpdmVFbnRpdHlcIikpIHtcblx0XHRjb25zdCBvT3BlcmF0aW9uID0gY3JlYXRlT3BlcmF0aW9uKG9Db250ZXh0LCBkcmFmdE9wZXJhdGlvbnMuQUNUSVZBVElPTiwgeyAkJGluaGVyaXRFeHBhbmRTZWxlY3Q6IHRydWUgfSk7XG5cdFx0Y29uc3Qgb1Jlc291cmNlQnVuZGxlID0gYXdhaXQgKChvQXBwQ29tcG9uZW50LmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikgYXMgUmVzb3VyY2VNb2RlbCkuZ2V0UmVzb3VyY2VCdW5kbGUoKSBhcyBhbnkpO1xuXHRcdGNvbnN0IHNBY3Rpb25OYW1lID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX09QX09CSkVDVF9QQUdFX1NBVkVcIiwgb1Jlc291cmNlQnVuZGxlKTtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IG9PcGVyYXRpb24uZXhlY3V0ZShcblx0XHRcdFx0c0dyb3VwSWQsXG5cdFx0XHRcdGJJZ25vcmVFdGFnLFxuXHRcdFx0XHRzR3JvdXBJZFxuXHRcdFx0XHRcdD8gb3BlcmF0aW9uc0hlbHBlci5mbk9uU3RyaWN0SGFuZGxpbmdGYWlsZWQuYmluZChcblx0XHRcdFx0XHRcdFx0ZHJhZnQsXG5cdFx0XHRcdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzQWN0aW9uTmFtZSwgbW9kZWw6IG9Db250ZXh0LmdldE1vZGVsKCkgfSxcblx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHR1bmRlZmluZWRcblx0XHRcdFx0XHQgIClcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZCxcblx0XHRcdFx0b0NvbnRleHQuZ2V0QmluZGluZygpLmlzQShcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXCIpXG5cdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGlmIChiSGFzUHJlcGFyZUFjdGlvbikge1xuXHRcdFx0XHRjb25zdCBhY3Rpb25OYW1lID0gZ2V0QWN0aW9uTmFtZShvQ29udGV4dCwgZHJhZnRPcGVyYXRpb25zLlBSRVBBUkUpLFxuXHRcdFx0XHRcdG9TaWRlRWZmZWN0c1NlcnZpY2UgPSBvQXBwQ29tcG9uZW50LmdldFNpZGVFZmZlY3RzU2VydmljZSgpLFxuXHRcdFx0XHRcdG9CaW5kaW5nUGFyYW1ldGVycyA9IG9TaWRlRWZmZWN0c1NlcnZpY2UuZ2V0T0RhdGFBY3Rpb25TaWRlRWZmZWN0cyhhY3Rpb25OYW1lLCBvQ29udGV4dCksXG5cdFx0XHRcdFx0YVRhcmdldFBhdGhzID0gb0JpbmRpbmdQYXJhbWV0ZXJzICYmIG9CaW5kaW5nUGFyYW1ldGVycy5wYXRoRXhwcmVzc2lvbnM7XG5cdFx0XHRcdGlmIChhVGFyZ2V0UGF0aHMgJiYgYVRhcmdldFBhdGhzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0YXdhaXQgb1NpZGVFZmZlY3RzU2VydmljZS5yZXF1ZXN0U2lkZUVmZmVjdHMoYVRhcmdldFBhdGhzLCBvQ29udGV4dCk7XG5cdFx0XHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJlcXVlc3Rpbmcgc2lkZSBlZmZlY3RzXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRhd2FpdCByZXF1ZXN0TWVzc2FnZXMob0NvbnRleHQsIG9TaWRlRWZmZWN0c1NlcnZpY2UpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSByZXF1ZXN0aW5nIG1lc3NhZ2VzXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYWN0aXZhdGlvbiBhY3Rpb24gY2Fubm90IGJlIGV4ZWN1dGVkIG9uIGFuIGFjdGl2ZSBkb2N1bWVudFwiKTtcblx0fVxufVxuXG4vKipcbiAqIEdldHMgdGhlIHN1cHBvcnRlZCBtZXNzYWdlIHByb3BlcnR5IHBhdGggb24gdGhlIFByZXBhcmVBY3Rpb24gZm9yIGEgY29udGV4dC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IHRvIGJlIGNoZWNrZWRcbiAqIEByZXR1cm5zIFBhdGggdG8gdGhlIG1lc3NhZ2VcbiAqIEBwcml2YXRlXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuZnVuY3Rpb24gZ2V0TWVzc2FnZVBhdGhGb3JQcmVwYXJlKG9Db250ZXh0OiBWNENvbnRleHQpOiBzdHJpbmcgfCBudWxsIHtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdGNvbnN0IHNDb250ZXh0UGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob0NvbnRleHQuZ2V0UGF0aCgpKTtcblx0Y29uc3Qgb1JldHVyblR5cGUgPSBnZXRSZXR1cm5UeXBlKG9Db250ZXh0LCBkcmFmdE9wZXJhdGlvbnMuUFJFUEFSRSk7XG5cdC8vIElmIHRoZXJlIGlzIG5vIHJldHVybiBwYXJhbWV0ZXIsIGl0IGlzIG5vdCBwb3NzaWJsZSB0byByZXF1ZXN0IE1lc3NhZ2VzLlxuXHQvLyBSQVAgZHJhZnQgcHJlcGFyZSBoYXMgbm8gcmV0dXJuIHBhcmFtZXRlclxuXHRyZXR1cm4gISFvUmV0dXJuVHlwZSA/IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NDb250ZXh0UGF0aH0vQCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLk1lc3NhZ2VzfS8kUGF0aGApIDogbnVsbDtcbn1cblxuLyoqXG4gKiBFeGVjdXRlIGEgcHJlcGFyYXRpb24gYWN0aW9uLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgZm9yIHdoaWNoIHRoZSBhY3Rpb24gc2hvdWxkIGJlIHBlcmZvcm1lZFxuICogQHBhcmFtIGdyb3VwSWQgVGhlIG9wdGlvbmFsIGJhdGNoIGdyb3VwIGluIHdoaWNoIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgb3BlcmF0aW9uXG4gKiBAcGFyYW0gYk1lc3NhZ2VzIElmIHNldCB0byB0cnVlLCB0aGUgUFJFUEFSRSBhY3Rpb24gcmV0cmlldmVzIFNBUF9NZXNzYWdlc1xuICogQHJldHVybnMgUmVzb2x2ZSBmdW5jdGlvbiByZXR1cm5zIHRoZSBjb250ZXh0IG9mIHRoZSBvcGVyYXRpb25cbiAqIEBwcml2YXRlXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZURyYWZ0UHJlcGFyYXRpb25BY3Rpb24ob0NvbnRleHQ6IFY0Q29udGV4dCwgZ3JvdXBJZD86IHN0cmluZywgYk1lc3NhZ2VzPzogYm9vbGVhbikge1xuXHRpZiAoIW9Db250ZXh0LmdldFByb3BlcnR5KFwiSXNBY3RpdmVFbnRpdHlcIikpIHtcblx0XHRjb25zdCBzTWVzc2FnZXNQYXRoID0gYk1lc3NhZ2VzID8gZ2V0TWVzc2FnZVBhdGhGb3JQcmVwYXJlKG9Db250ZXh0KSA6IG51bGw7XG5cdFx0Y29uc3Qgb09wZXJhdGlvbiA9IGNyZWF0ZU9wZXJhdGlvbihvQ29udGV4dCwgZHJhZnRPcGVyYXRpb25zLlBSRVBBUkUsIHNNZXNzYWdlc1BhdGggPyB7ICRzZWxlY3Q6IHNNZXNzYWdlc1BhdGggfSA6IG51bGwpO1xuXG5cdFx0Ly8gVE9ETzogc2lkZSBlZmZlY3RzIHF1YWxpZmllciBzaGFsbCBiZSBldmVuIGRlcHJlY2F0ZWQgdG8gYmUgY2hlY2tlZFxuXHRcdG9PcGVyYXRpb24uc2V0UGFyYW1ldGVyKFwiU2lkZUVmZmVjdHNRdWFsaWZpZXJcIiwgXCJcIik7XG5cblx0XHRjb25zdCBzR3JvdXBJZCA9IGdyb3VwSWQgfHwgb09wZXJhdGlvbi5nZXRHcm91cElkKCk7XG5cdFx0cmV0dXJuIG9PcGVyYXRpb25cblx0XHRcdC5leGVjdXRlKHNHcm91cElkKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gb09wZXJhdGlvbjtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGV4ZWN1dGluZyB0aGUgb3BlcmF0aW9uXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcHJlcGFyYXRpb24gYWN0aW9uIGNhbm5vdCBiZSBleGVjdXRlZCBvbiBhbiBhY3RpdmUgZG9jdW1lbnRcIik7XG5cdH1cbn1cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgbWVzc2FnZSBwYXRoIGZvciBhIGNvbnRleHQuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBmb3Igd2hpY2ggdGhlIHBhdGggc2hhbGwgYmUgZGV0ZXJtaW5lZFxuICogQHJldHVybnMgTWVzc2FnZSBwYXRoLCBlbXB0eSBpZiBub3QgYW5ub3RhdGVkXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKi9cbmZ1bmN0aW9uIGdldE1lc3NhZ2VzUGF0aChvQ29udGV4dDogVjRDb250ZXh0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3Qgb01vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKSxcblx0XHRvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdHNFbnRpdHlTZXRQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQ29udGV4dC5nZXRQYXRoKCkpO1xuXHRyZXR1cm4gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWVzc2FnZXMvJFBhdGhgKTtcbn1cbi8qKlxuICogUmVxdWVzdHMgdGhlIG1lc3NhZ2VzIGlmIGFubm90YXRlZCBmb3IgYSBnaXZlbiBjb250ZXh0LlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgZm9yIHdoaWNoIHRoZSBtZXNzYWdlcyBzaGFsbCBiZSByZXF1ZXN0ZWRcbiAqIEBwYXJhbSBvU2lkZUVmZmVjdHNTZXJ2aWNlIFNlcnZpY2UgZm9yIHRoZSBTaWRlRWZmZWN0cyBvbiBTQVAgRmlvcmkgZWxlbWVudHNcbiAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgb25jZSBtZXNzYWdlcyB3ZXJlIHJlcXVlc3RlZFxuICogQHByaXZhdGVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5mdW5jdGlvbiByZXF1ZXN0TWVzc2FnZXMob0NvbnRleHQ6IFY0Q29udGV4dCwgb1NpZGVFZmZlY3RzU2VydmljZTogU2lkZUVmZmVjdHNTZXJ2aWNlKSB7XG5cdGNvbnN0IHNNZXNzYWdlc1BhdGggPSBkcmFmdC5nZXRNZXNzYWdlc1BhdGgob0NvbnRleHQpO1xuXHRpZiAoc01lc3NhZ2VzUGF0aCkge1xuXHRcdHJldHVybiBvU2lkZUVmZmVjdHNTZXJ2aWNlLnJlcXVlc3RTaWRlRWZmZWN0cyhbeyAkUHJvcGVydHlQYXRoOiBzTWVzc2FnZXNQYXRoIH1dIGFzIGFueSwgb0NvbnRleHQpO1xuXHR9XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn1cbi8qKlxuICogRXhlY3V0ZXMgZGlzY2FyZCBvZiBhIGRyYWZ0IGZ1bmN0aW9uIHVzaW5nIEhUVFAgUG9zdC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IGZvciB3aGljaCB0aGUgYWN0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWRcbiAqIEBwYXJhbSBvQXBwQ29tcG9uZW50IEFwcCBDb21wb25lbnRcbiAqIEBwYXJhbSBiRW5hYmxlU3RyaWN0SGFuZGxpbmdcbiAqIEByZXR1cm5zIFJlc29sdmUgZnVuY3Rpb24gcmV0dXJucyB0aGUgY29udGV4dCBvZiB0aGUgb3BlcmF0aW9uXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVEcmFmdERpc2NhcmRBY3Rpb24ob0NvbnRleHQ6IFY0Q29udGV4dCwgb0FwcENvbXBvbmVudD86IGFueSwgYkVuYWJsZVN0cmljdEhhbmRsaW5nPzogYm9vbGVhbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRpZiAoIW9Db250ZXh0LmdldFByb3BlcnR5KFwiSXNBY3RpdmVFbnRpdHlcIikpIHtcblx0XHRjb25zdCBvRGlzY2FyZE9wZXJhdGlvbiA9IGRyYWZ0LmNyZWF0ZU9wZXJhdGlvbihvQ29udGV4dCwgZHJhZnRPcGVyYXRpb25zLkRJU0NBUkQpO1xuXHRcdGNvbnN0IG9SZXNvdXJjZUJ1bmRsZSA9XG5cdFx0XHQob0FwcENvbXBvbmVudCAmJlxuXHRcdFx0XHQoYXdhaXQgKChvQXBwQ29tcG9uZW50LmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikgYXMgUmVzb3VyY2VNb2RlbCkuZ2V0UmVzb3VyY2VCdW5kbGUoKSBhcyBQcm9taXNlPFJlc291cmNlQnVuZGxlPikpKSB8fFxuXHRcdFx0bnVsbDtcblx0XHRjb25zdCBzR3JvdXBJZCA9IFwiZGlyZWN0XCI7XG5cdFx0Y29uc3Qgc0FjdGlvbk5hbWUgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0RSQUZUX0RJU0NBUkRfQlVUVE9OXCIsIG9SZXNvdXJjZUJ1bmRsZSk7XG5cdFx0Ly8gYXMgdGhlIGRpc2NhcmQgYWN0aW9uIGRvZXNudCcgc2VuZCB0aGUgYWN0aXZlIHZlcnNpb24gaW4gdGhlIHJlc3BvbnNlIHdlIGRvIG5vdCB1c2UgdGhlIHJlcGxhY2UgaW4gY2FjaGVcblx0XHRjb25zdCBvRGlzY2FyZFByb21pc2UgPSAhYkVuYWJsZVN0cmljdEhhbmRsaW5nXG5cdFx0XHQ/IG9EaXNjYXJkT3BlcmF0aW9uLmV4ZWN1dGUoc0dyb3VwSWQpXG5cdFx0XHQ6IG9EaXNjYXJkT3BlcmF0aW9uLmV4ZWN1dGUoXG5cdFx0XHRcdFx0c0dyb3VwSWQsXG5cdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdG9wZXJhdGlvbnNIZWxwZXIuZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkLmJpbmQoXG5cdFx0XHRcdFx0XHRkcmFmdCxcblx0XHRcdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHRcdFx0eyBsYWJlbDogc0FjdGlvbk5hbWUsIG1vZGVsOiBvQ29udGV4dC5nZXRNb2RlbCgpIH0sXG5cdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHR1bmRlZmluZWRcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGZhbHNlXG5cdFx0XHQgICk7XG5cdFx0b0NvbnRleHQuZ2V0TW9kZWwoKS5zdWJtaXRCYXRjaChzR3JvdXBJZCk7XG5cdFx0cmV0dXJuIG9EaXNjYXJkUHJvbWlzZTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZGlzY2FyZCBhY3Rpb24gY2Fubm90IGJlIGV4ZWN1dGVkIG9uIGFuIGFjdGl2ZSBkb2N1bWVudFwiKTtcblx0fVxufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBzaWJsaW5nIGNvbnRleHQgZm9yIGEgc3Vib2JqZWN0IHBhZ2UgYW5kIGNhbGN1bGF0ZXMgYSBzaWJsaW5nIHBhdGggZm9yIGFsbCBpbnRlcm1lZGlhdGUgcGF0aHNcbiAqIGJldHdlZW4gdGhlIG9iamVjdCBwYWdlIGFuZCB0aGUgc3Vib2JqZWN0IHBhZ2UuXG4gKlxuICogQHBhcmFtIHJvb3RDdXJyZW50Q29udGV4dCBUaGUgY29udGV4dCBmb3IgdGhlIHJvb3Qgb2YgdGhlIGRyYWZ0XG4gKiBAcGFyYW0gcmlnaHRtb3N0Q3VycmVudENvbnRleHQgVGhlIGNvbnRleHQgb2YgdGhlIHN1Ym9iamVjdCBwYWdlXG4gKiBAcmV0dXJucyBUaGUgc2libGluZ0luZm9ybWF0aW9uIG9iamVjdFxuICovXG5hc3luYyBmdW5jdGlvbiBjb21wdXRlU2libGluZ0luZm9ybWF0aW9uKFxuXHRyb290Q3VycmVudENvbnRleHQ6IFY0Q29udGV4dCxcblx0cmlnaHRtb3N0Q3VycmVudENvbnRleHQ6IFY0Q29udGV4dFxuKTogUHJvbWlzZTxTaWJsaW5nSW5mb3JtYXRpb24gfCB1bmRlZmluZWQ+IHtcblx0aWYgKCFyaWdodG1vc3RDdXJyZW50Q29udGV4dC5nZXRQYXRoKCkuc3RhcnRzV2l0aChyb290Q3VycmVudENvbnRleHQuZ2V0UGF0aCgpKSkge1xuXHRcdC8vIFdyb25nIHVzYWdlICEhXG5cdFx0TG9nLmVycm9yKFwiQ2Fubm90IGNvbXB1dGUgcmlnaHRtb3N0IHNpYmxpbmcgY29udGV4dFwiKTtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY29tcHV0ZSByaWdodG1vc3Qgc2libGluZyBjb250ZXh0XCIpO1xuXHR9XG5cblx0Y29uc3QgbW9kZWwgPSByb290Q3VycmVudENvbnRleHQuZ2V0TW9kZWwoKTtcblx0dHJ5IHtcblx0XHQvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQvLyAxLiBGaW5kIGFsbCBzZWdtZW50cyBiZXR3ZWVuIHRoZSByb290IG9iamVjdCBhbmQgdGhlIHN1Yi1vYmplY3Rcblx0XHQvLyBFeGFtcGxlOiBmb3Igcm9vdCA9IC9QYXJhbShhYSkvRW50aXR5KGJiKSBhbmQgcmlnaHRNb3N0ID0gL1BhcmFtKGFhKS9FbnRpdHkoYmIpL19OYXYoY2MpL19TdWJOYXYoZGQpXG5cdFx0Ly8gLS0tPiBbXCJQYXJhbShhYSkvRW50aXR5KGJiKVwiLCBcIl9OYXYoY2MpXCIsIFwiX1N1Yk5hdihkZClcIl1cblxuXHRcdC8vIEZpbmQgYWxsIHNlZ21lbnRzIGluIHRoZSByaWdodG1vc3QgcGF0aFxuXHRcdGNvbnN0IGFkZGl0aW9uYWxQYXRoID0gcmlnaHRtb3N0Q3VycmVudENvbnRleHQuZ2V0UGF0aCgpLnJlcGxhY2Uocm9vdEN1cnJlbnRDb250ZXh0LmdldFBhdGgoKSwgXCJcIik7XG5cdFx0Y29uc3Qgc2VnbWVudHMgPSBhZGRpdGlvbmFsUGF0aCA/IGFkZGl0aW9uYWxQYXRoLnN1YnN0cmluZygxKS5zcGxpdChcIi9cIikgOiBbXTtcblx0XHQvLyBGaXJzdCBzZWdtZW50IGlzIGFsd2F5cyB0aGUgZnVsbCBwYXRoIG9mIHRoZSByb290IG9iamVjdCwgd2hpY2ggY2FuIGNvbnRhaW4gJy8nIGluIGNhc2Ugb2YgYSBwYXJhbWV0cml6ZWQgZW50aXR5XG5cdFx0c2VnbWVudHMudW5zaGlmdChyb290Q3VycmVudENvbnRleHQuZ2V0UGF0aCgpLnN1YnN0cmluZygxKSk7XG5cblx0XHQvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQvLyAyLiBSZXF1ZXN0IGNhbm9uaWNhbCBwYXRocyBvZiB0aGUgc2libGluZyBlbnRpdHkgZm9yIGVhY2ggc2VnbWVudFxuXHRcdC8vIEV4YW1wbGU6IGZvciBbXCJQYXJhbShhYSkvRW50aXR5KGJiKVwiLCBcIl9OYXYoY2MpXCIsIFwiX1N1Yk5hdihkZClcIl1cblx0XHQvLyAtLT4gcmVxdWVzdCBjYW5vbmljYWwgcGF0aHMgZm9yIFwiUGFyYW0oYWEpL0VudGl0eShiYikvU2libGluZ0VudGl0eVwiLCBcIlBhcmFtKGFhKS9FbnRpdHkoYmIpL19OYXYoY2MpL1NpYmxpbmdFbnRpdHlcIiwgXCJQYXJhbShhYSkvRW50aXR5KGJiKS9fTmF2KGNjKS9fU3ViTmF2KGRkKS9TaWJsaW5nRW50aXR5XCJcblx0XHRjb25zdCBvbGRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0XHRjb25zdCBuZXdQYXRoczogc3RyaW5nW10gPSBbXTtcblx0XHRsZXQgY3VycmVudFBhdGggPSBcIlwiO1xuXHRcdGNvbnN0IGNhbm9uaWNhbFBhdGhQcm9taXNlcyA9IHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgPT4ge1xuXHRcdFx0Y3VycmVudFBhdGggKz0gYC8ke3NlZ21lbnR9YDtcblx0XHRcdG9sZFBhdGhzLnVuc2hpZnQoY3VycmVudFBhdGgpO1xuXHRcdFx0aWYgKGN1cnJlbnRQYXRoLmVuZHNXaXRoKFwiKVwiKSkge1xuXHRcdFx0XHRjb25zdCBzaWJsaW5nQ29udGV4dCA9IG1vZGVsLmJpbmRDb250ZXh0KGAke2N1cnJlbnRQYXRofS9TaWJsaW5nRW50aXR5YCkuZ2V0Qm91bmRDb250ZXh0KCk7XG5cdFx0XHRcdHJldHVybiBzaWJsaW5nQ29udGV4dC5yZXF1ZXN0Q2Fub25pY2FsUGF0aCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpOyAvLyAxLTEgcmVsYXRpb25cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdC8vIDMuIFJlY29uc3RydWN0IHRoZSBmdWxsIHBhdGhzIGZyb20gY2Fub25pY2FsIHBhdGhzIChmb3IgcGF0aCBtYXBwaW5nKVxuXHRcdC8vIEV4YW1wbGU6IGZvciBjYW5vbmljYWwgcGF0aHMgXCIvUGFyYW0oYWEpL0VudGl0eShiYi1zaWJsaW5nKVwiLCBcIi9FbnRpdHkyKGNjLXNpYmxpbmcpXCIsIFwiL0VudGl0eTMoZGQtc2libGluZylcIlxuXHRcdC8vIC0tPiBbXCJQYXJhbShhYSkvRW50aXR5KGJiLXNpYmxpbmcpXCIsIFwiUGFyYW0oYWEpL0VudGl0eShiYi1zaWJsaW5nKS9fTmF2KGNjLXNpYmxpbmcpXCIsIFwiUGFyYW0oYWEpL0VudGl0eShiYi1zaWJsaW5nKS9fTmF2KGNjLXNpYmxpbmcpL19TdWJOYXYoZGQtc2libGluZylcIl1cblx0XHRjb25zdCBjYW5vbmljYWxQYXRocyA9IChhd2FpdCBQcm9taXNlLmFsbChjYW5vbmljYWxQYXRoUHJvbWlzZXMpKSBhcyBzdHJpbmdbXTtcblx0XHRsZXQgc2libGluZ1BhdGggPSBcIlwiO1xuXHRcdGNhbm9uaWNhbFBhdGhzLmZvckVhY2goKGNhbm9uaWNhbFBhdGgsIGluZGV4KSA9PiB7XG5cdFx0XHRpZiAoaW5kZXggIT09IDApIHtcblx0XHRcdFx0aWYgKHNlZ21lbnRzW2luZGV4XS5lbmRzV2l0aChcIilcIikpIHtcblx0XHRcdFx0XHRjb25zdCBuYXZpZ2F0aW9uID0gc2VnbWVudHNbaW5kZXhdLnJlcGxhY2UoL1xcKC4qJC8sIFwiXCIpOyAvLyBLZWVwIG9ubHkgbmF2aWdhdGlvbiBuYW1lIGZyb20gdGhlIHNlZ21lbnQsIGkuZS4gYWFhKHh4eCkgLS0+IGFhYVxuXHRcdFx0XHRcdGNvbnN0IGtleXMgPSBjYW5vbmljYWxQYXRoLnJlcGxhY2UoLy4qXFwoLywgXCIoXCIpOyAvLyBLZWVwIG9ubHkgdGhlIGtleXMgZnJvbSB0aGUgY2Fub25pY2FsIHBhdGgsIGkuZS4gYWFhKHh4eCkgLS0+ICh4eHgpXG5cdFx0XHRcdFx0c2libGluZ1BhdGggKz0gYC8ke25hdmlnYXRpb259JHtrZXlzfWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2libGluZ1BhdGggKz0gYC8ke3NlZ21lbnRzW2luZGV4XX1gOyAvLyAxLTEgcmVsYXRpb25cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2libGluZ1BhdGggPSBjYW5vbmljYWxQYXRoOyAvLyBUbyBtYW5hZ2UgcGFyYW1ldHJpemVkIGVudGl0aWVzXG5cdFx0XHR9XG5cdFx0XHRuZXdQYXRocy51bnNoaWZ0KHNpYmxpbmdQYXRoKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR0YXJnZXRDb250ZXh0OiBtb2RlbC5iaW5kQ29udGV4dChzaWJsaW5nUGF0aCkuZ2V0Qm91bmRDb250ZXh0KCksIC8vIENyZWF0ZSB0aGUgcmlnaHRtb3N0IHNpYmxpbmcgY29udGV4dCBmcm9tIGl0cyBwYXRoXG5cdFx0XHRwYXRoTWFwcGluZzogb2xkUGF0aHMubWFwKChvbGRQYXRoLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdG9sZFBhdGgsXG5cdFx0XHRcdFx0bmV3UGF0aDogbmV3UGF0aHNbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9KVxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gQSBjYW5vbmljYWwgcGF0aCBjb3VsZG4ndCBiZSByZXNvbHZlZCAoYmVjYXVzZSBhIHNpYmxpbmcgZG9lc24ndCBleGlzdClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRyYWZ0IGRvY3VtZW50IGZyb20gYW4gZXhpc3RpbmcgZG9jdW1lbnQuXG4gKlxuICogVGhlIGZ1bmN0aW9uIHN1cHBvcnRzIHNldmVyYWwgaG9va3MgYXMgdGhlcmUgaXMgYSBjZXJ0YWluIGNvcmVvZ3JhcGh5IGRlZmluZWQuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5hY3Rpb25zLmRyYWZ0I2NyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50XG4gKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuYWN0aW9ucy5kcmFmdFxuICogQHN0YXRpY1xuICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgb2YgdGhlIGFjdGl2ZSBkb2N1bWVudCBmb3IgdGhlIG5ldyBkcmFmdFxuICogQHBhcmFtIG9BcHBDb21wb25lbnQgVGhlIEFwcENvbXBvbmVudFxuICogQHBhcmFtIG1QYXJhbWV0ZXJzIFRoZSBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLm9WaWV3XSBUaGUgdmlld1xuICogQHBhcmFtIFttUGFyYW1ldGVycy5iUHJlc2VydmVDaGFuZ2VzXSBQcmVzZXJ2ZSBjaGFuZ2VzIG9mIGFuIGV4aXN0aW5nIGRyYWZ0IG9mIGFub3RoZXIgdXNlclxuICogQHBhcmFtIFttUGFyYW1ldGVycy5mbkJlZm9yZUNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50XSBDYWxsYmFjayB0aGF0IGFsbG93cyB2ZXRvIGJlZm9yZSBjcmVhdGUgcmVxdWVzdCBpcyBleGVjdXRlZFxuICogQHBhcmFtIFttUGFyYW1ldGVycy5mbkFmdGVyQ3JlYXRlRHJhZnRGcm9tQWN0aXZlRG9jdW1lbnRdIENhbGxiYWNrIGZvciBwb3N0cHJvY2Vzc2lvbmcgYWZ0ZXIgZHJhZnQgZG9jdW1lbnQgd2FzIGNyZWF0ZWRcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuZm5XaGVuRGVjaXNpb25Ub092ZXJ3cml0ZURvY3VtZW50SXNSZXF1aXJlZF0gQ2FsbGJhY2sgZm9yIGRlY2lkaW5nIG9uIG92ZXJ3cml0aW5nIGFuIHVuc2F2ZWQgY2hhbmdlIGJ5IGFub3RoZXIgdXNlclxuICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlcyB3aXRoIHRoZSB7QGxpbmsgc2FwLnVpLm1vZGVsLm9kYXRhLnY0LkNvbnRleHQgY29udGV4dH0gb2YgdGhlIG5ldyBkcmFmdCBkb2N1bWVudFxuICogQHByaXZhdGVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVEcmFmdEZyb21BY3RpdmVEb2N1bWVudChcblx0b0NvbnRleHQ6IGFueSxcblx0b0FwcENvbXBvbmVudDogQXBwQ29tcG9uZW50LFxuXHRtUGFyYW1ldGVyczoge1xuXHRcdG9WaWV3OiBWaWV3O1xuXHRcdGJQcmVzZXJ2ZUNoYW5nZXM/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdGZuQmVmb3JlQ3JlYXRlRHJhZnRGcm9tQWN0aXZlRG9jdW1lbnQ/OiBhbnk7XG5cdFx0Zm5BZnRlckNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50PzogYW55O1xuXHRcdGZuV2hlbkRlY2lzaW9uVG9PdmVyd3JpdGVEb2N1bWVudElzUmVxdWlyZWQ/OiBhbnk7XG5cdH1cbik6IFByb21pc2U8VjRDb250ZXh0IHwgdW5kZWZpbmVkPiB7XG5cdGNvbnN0IG1QYXJhbSA9IG1QYXJhbWV0ZXJzIHx8IHt9LFxuXHRcdGxvY2FsSTE4blJlZiA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIiksXG5cdFx0YlJ1blByZXNlcnZlQ2hhbmdlc0Zsb3cgPVxuXHRcdFx0dHlwZW9mIG1QYXJhbS5iUHJlc2VydmVDaGFuZ2VzID09PSBcInVuZGVmaW5lZFwiIHx8ICh0eXBlb2YgbVBhcmFtLmJQcmVzZXJ2ZUNoYW5nZXMgPT09IFwiYm9vbGVhblwiICYmIG1QYXJhbS5iUHJlc2VydmVDaGFuZ2VzKTsgLy9kZWZhdWx0IHRydWVcblxuXHQvKipcblx0ICogT3ZlcndyaXRlIG9yIHJlamVjdCBiYXNlZCBvbiBmbldoZW5EZWNpc2lvblRvT3ZlcndyaXRlRG9jdW1lbnRJc1JlcXVpcmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0gYk92ZXJ3cml0ZSBPdmVyd3JpdGUgdGhlIGNoYW5nZSBvciBub3Rcblx0ICogQHJldHVybnMgUmVzb2x2ZXMgd2l0aCByZXN1bHQgb2Yge0BsaW5rIHNhcC5mZS5jb3JlLmFjdGlvbnMjZXhlY3V0ZURyYWZ0RWRpdEFjdGlvbn1cblx0ICovXG5cdGFzeW5jIGZ1bmN0aW9uIG92ZXJ3cml0ZU9uRGVtYW5kKGJPdmVyd3JpdGU6IGJvb2xlYW4pIHtcblx0XHRpZiAoYk92ZXJ3cml0ZSkge1xuXHRcdFx0Ly9PdmVyd3JpdGUgZXhpc3RpbmcgY2hhbmdlc1xuXHRcdFx0Y29uc3Qgb01vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKTtcblx0XHRcdGNvbnN0IGRyYWZ0RGF0YUNvbnRleHQgPSBvTW9kZWwuYmluZENvbnRleHQoYCR7b0NvbnRleHQuZ2V0UGF0aCgpfS9EcmFmdEFkbWluaXN0cmF0aXZlRGF0YWApLmdldEJvdW5kQ29udGV4dCgpO1xuXG5cdFx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSBhd2FpdCAobVBhcmFtZXRlcnMub1ZpZXcuZ2V0TW9kZWwoXCJzYXAuZmUuaTE4blwiKSBhcyBSZXNvdXJjZU1vZGVsKS5nZXRSZXNvdXJjZUJ1bmRsZSgpO1xuXHRcdFx0Y29uc3QgZHJhZnRBZG1pbkRhdGEgPSBhd2FpdCBkcmFmdERhdGFDb250ZXh0LnJlcXVlc3RPYmplY3QoKTtcblx0XHRcdGlmIChkcmFmdEFkbWluRGF0YSkge1xuXHRcdFx0XHQvLyByZW1vdmUgYWxsIHVuYm91bmQgdHJhbnNpdGlvbiBtZXNzYWdlcyBhcyB3ZSBzaG93IGEgc3BlY2lhbCBkaWFsb2dcblx0XHRcdFx0bWVzc2FnZUhhbmRsaW5nLnJlbW92ZVVuYm91bmRUcmFuc2l0aW9uTWVzc2FnZXMoKTtcblx0XHRcdFx0bGV0IHNJbmZvID0gZHJhZnRBZG1pbkRhdGEuSW5Qcm9jZXNzQnlVc2VyRGVzY3JpcHRpb24gfHwgZHJhZnRBZG1pbkRhdGEuSW5Qcm9jZXNzQnlVc2VyO1xuXHRcdFx0XHRjb25zdCBzRW50aXR5U2V0ID0gKG1QYXJhbWV0ZXJzLm9WaWV3LmdldFZpZXdEYXRhKCkgYXMgYW55KS5lbnRpdHlTZXQ7XG5cdFx0XHRcdGlmIChzSW5mbykge1xuXHRcdFx0XHRcdGNvbnN0IHNMb2NrZWRCeVVzZXJNc2cgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFwiQ19EUkFGVF9PQkpFQ1RfUEFHRV9EUkFGVF9MT0NLRURfQllfVVNFUlwiLFxuXHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0c0luZm8sXG5cdFx0XHRcdFx0XHRzRW50aXR5U2V0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRNZXNzYWdlQm94LmVycm9yKHNMb2NrZWRCeVVzZXJNc2cpO1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihzTG9ja2VkQnlVc2VyTXNnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzSW5mbyA9IGRyYWZ0QWRtaW5EYXRhLkNyZWF0ZWRCeVVzZXJEZXNjcmlwdGlvbiB8fCBkcmFmdEFkbWluRGF0YS5DcmVhdGVkQnlVc2VyO1xuXHRcdFx0XHRcdGNvbnN0IHNVbnNhdmVkQ2hhbmdlc01zZyA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XCJDX0RSQUZUX09CSkVDVF9QQUdFX0RSQUZUX1VOU0FWRURfQ0hBTkdFU1wiLFxuXHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0c0luZm8sXG5cdFx0XHRcdFx0XHRzRW50aXR5U2V0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRhd2FpdCBzaG93TWVzc2FnZUJveChzVW5zYXZlZENoYW5nZXNNc2cpO1xuXHRcdFx0XHRcdHJldHVybiBleGVjdXRlRHJhZnRFZGl0QWN0aW9uKG9Db250ZXh0LCBmYWxzZSwgbVBhcmFtZXRlcnMub1ZpZXcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRocm93IG5ldyBFcnJvcihgRHJhZnQgY3JlYXRpb24gYWJvcnRlZCBmb3IgZG9jdW1lbnQ6ICR7b0NvbnRleHQuZ2V0UGF0aCgpfWApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd01lc3NhZ2VCb3goc1Vuc2F2ZWRDaGFuZ2VzTXNnOiBhbnkpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6ICh2YWx1ZTogYW55KSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpIHtcblx0XHRcdGNvbnN0IG9EaWFsb2cgPSBuZXcgRGlhbG9nKHtcblx0XHRcdFx0dGl0bGU6IGxvY2FsSTE4blJlZi5nZXRUZXh0KFwiQ19NRVNTQUdFX0hBTkRMSU5HX1NBUEZFX0VSUk9SX01FU1NBR0VTX1BBR0VfVElUTEVfV0FSTklOR1wiKSxcblx0XHRcdFx0c3RhdGU6IFwiV2FybmluZ1wiLFxuXHRcdFx0XHRjb250ZW50OiBuZXcgVGV4dCh7XG5cdFx0XHRcdFx0dGV4dDogc1Vuc2F2ZWRDaGFuZ2VzTXNnXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRiZWdpbkJ1dHRvbjogbmV3IEJ1dHRvbih7XG5cdFx0XHRcdFx0dGV4dDogbG9jYWxJMThuUmVmLmdldFRleHQoXCJDX0NPTU1PTl9PQkpFQ1RfUEFHRV9FRElUXCIpLFxuXHRcdFx0XHRcdHR5cGU6IFwiRW1waGFzaXplZFwiLFxuXHRcdFx0XHRcdHByZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSksXG5cdFx0XHRcdGVuZEJ1dHRvbjogbmV3IEJ1dHRvbih7XG5cdFx0XHRcdFx0dGV4dDogbG9jYWxJMThuUmVmLmdldFRleHQoXCJDX0NPTU1PTl9PQkpFQ1RfUEFHRV9DQU5DRUxcIiksXG5cdFx0XHRcdFx0cHJlc3M6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdG9EaWFsb2cuY2xvc2UoKTtcblx0XHRcdFx0XHRcdHJlamVjdChgRHJhZnQgY3JlYXRpb24gYWJvcnRlZCBmb3IgZG9jdW1lbnQ6ICR7b0NvbnRleHQuZ2V0UGF0aCgpfWApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSksXG5cdFx0XHRcdGFmdGVyQ2xvc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvRGlhbG9nLmRlc3Ryb3koKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRvRGlhbG9nLmFkZFN0eWxlQ2xhc3MoXCJzYXBVaUNvbnRlbnRQYWRkaW5nXCIpO1xuXHRcdFx0b0RpYWxvZy5vcGVuKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIW9Db250ZXh0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmluZGluZyBjb250ZXh0IHRvIGFjdGl2ZSBkb2N1bWVudCBpcyByZXF1aXJlZFwiKTtcblx0fVxuXG5cdGNvbnN0IGJFeGVjdXRlID0gbVBhcmFtLmZuQmVmb3JlQ3JlYXRlRHJhZnRGcm9tQWN0aXZlRG9jdW1lbnRcblx0XHQ/IG1QYXJhbS5mbkJlZm9yZUNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50KG9Db250ZXh0LCBiUnVuUHJlc2VydmVDaGFuZ2VzRmxvdylcblx0XHQ6IHRydWU7XG5cblx0aWYgKCFiRXhlY3V0ZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgRHJhZnQgY3JlYXRpb24gd2FzIGFib3J0ZWQgYnkgZXh0ZW5zaW9uIGZvciBkb2N1bWVudDogJHtvQ29udGV4dC5nZXRQYXRoKCl9YCk7XG5cdH1cblx0dHJ5IHtcblx0XHRsZXQgb0RyYWZ0Q29udGV4dDogVjRDb250ZXh0IHwgdW5kZWZpbmVkO1xuXHRcdHRyeSB7XG5cdFx0XHRvRHJhZnRDb250ZXh0ID0gYXdhaXQgZHJhZnQuZXhlY3V0ZURyYWZ0RWRpdEFjdGlvbihvQ29udGV4dCwgYlJ1blByZXNlcnZlQ2hhbmdlc0Zsb3csIG1QYXJhbWV0ZXJzLm9WaWV3KTtcblx0XHR9IGNhdGNoIChvUmVzcG9uc2U6IGFueSkge1xuXHRcdFx0Ly9Pbmx5IGNhbGwgYmFjayBpZiBlcnJvciA0MDlcblx0XHRcdGlmIChiUnVuUHJlc2VydmVDaGFuZ2VzRmxvdyAmJiBvUmVzcG9uc2Uuc3RhdHVzID09PSA0MDkpIHtcblx0XHRcdFx0bWVzc2FnZUhhbmRsaW5nLnJlbW92ZUJvdW5kVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0XHRcdG1lc3NhZ2VIYW5kbGluZy5yZW1vdmVVbmJvdW5kVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0XHRcdGlmIChBY3Rpdml0eVN5bmMuaXNDb2xsYWJvcmF0aW9uRW5hYmxlZChtUGFyYW1ldGVycy5vVmlldykpIHtcblx0XHRcdFx0XHRjb25zdCBzaWJsaW5nSW5mbyA9IGF3YWl0IGRyYWZ0LmNvbXB1dGVTaWJsaW5nSW5mb3JtYXRpb24ob0NvbnRleHQsIG9Db250ZXh0KTtcblx0XHRcdFx0XHRpZiAoc2libGluZ0luZm8/LnRhcmdldENvbnRleHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzaWJsaW5nSW5mby50YXJnZXRDb250ZXh0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob1Jlc3BvbnNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b0RyYWZ0Q29udGV4dCA9IGF3YWl0IG92ZXJ3cml0ZU9uRGVtYW5kKFxuXHRcdFx0XHRcdFx0bVBhcmFtLmZuV2hlbkRlY2lzaW9uVG9PdmVyd3JpdGVEb2N1bWVudElzUmVxdWlyZWQgPyBtUGFyYW0uZm5XaGVuRGVjaXNpb25Ub092ZXJ3cml0ZURvY3VtZW50SXNSZXF1aXJlZCgpIDogdHJ1ZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoIShvUmVzcG9uc2UgJiYgb1Jlc3BvbnNlLmNhbmNlbGVkKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob1Jlc3BvbnNlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRvRHJhZnRDb250ZXh0ID1cblx0XHRcdG9EcmFmdENvbnRleHQgJiYgbVBhcmFtLmZuQWZ0ZXJDcmVhdGVEcmFmdEZyb21BY3RpdmVEb2N1bWVudFxuXHRcdFx0XHQ/IG1QYXJhbS5mbkFmdGVyQ3JlYXRlRHJhZnRGcm9tQWN0aXZlRG9jdW1lbnQob0NvbnRleHQsIG9EcmFmdENvbnRleHQpXG5cdFx0XHRcdDogb0RyYWZ0Q29udGV4dDtcblxuXHRcdGlmIChvRHJhZnRDb250ZXh0KSB7XG5cdFx0XHRjb25zdCBzRWRpdEFjdGlvbk5hbWUgPSBnZXRBY3Rpb25OYW1lKG9EcmFmdENvbnRleHQsIGRyYWZ0T3BlcmF0aW9ucy5FRElUKTtcblx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0cyA9IG9BcHBDb21wb25lbnQuZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlKCkuZ2V0T0RhdGFBY3Rpb25TaWRlRWZmZWN0cyhzRWRpdEFjdGlvbk5hbWUsIG9EcmFmdENvbnRleHQpO1xuXHRcdFx0aWYgKG9TaWRlRWZmZWN0cz8udHJpZ2dlckFjdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0XHRhd2FpdCBvQXBwQ29tcG9uZW50LmdldFNpZGVFZmZlY3RzU2VydmljZSgpLnJlcXVlc3RTaWRlRWZmZWN0c0Zvck9EYXRhQWN0aW9uKG9TaWRlRWZmZWN0cywgb0RyYWZ0Q29udGV4dCk7XG5cblx0XHRcdFx0cmV0dXJuIG9EcmFmdENvbnRleHQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gb0RyYWZ0Q29udGV4dDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH0gY2F0Y2ggKGV4YzogYW55KSB7XG5cdFx0dGhyb3cgZXhjO1xuXHR9XG59XG4vKipcbiAqIENyZWF0ZXMgYW4gYWN0aXZlIGRvY3VtZW50IGZyb20gYSBkcmFmdCBkb2N1bWVudC5cbiAqXG4gKiBUaGUgZnVuY3Rpb24gc3VwcG9ydHMgc2V2ZXJhbCBob29rcyBhcyB0aGVyZSBpcyBhIGNlcnRhaW4gY2hvcmVvZ3JhcGh5IGRlZmluZWQuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5hY3Rpb25zLmRyYWZ0I2FjdGl2YXRlRG9jdW1lbnRcbiAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5hY3Rpb25zLmRyYWZ0XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBvZiB0aGUgYWN0aXZlIGRvY3VtZW50IGZvciB0aGUgbmV3IGRyYWZ0XG4gKiBAcGFyYW0gb0FwcENvbXBvbmVudCBUaGUgQXBwQ29tcG9uZW50XG4gKiBAcGFyYW0gbVBhcmFtZXRlcnMgVGhlIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuZm5CZWZvcmVBY3RpdmF0ZURvY3VtZW50XSBDYWxsYmFjayB0aGF0IGFsbG93cyBhIHZldG8gYmVmb3JlIHRoZSAnQ3JlYXRlJyByZXF1ZXN0IGlzIGV4ZWN1dGVkXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmZuQWZ0ZXJBY3RpdmF0ZURvY3VtZW50XSBDYWxsYmFjayBmb3IgcG9zdHByb2Nlc3NpbmcgYWZ0ZXIgZG9jdW1lbnQgd2FzIGFjdGl2YXRlZC5cbiAqIEBwYXJhbSBtZXNzYWdlSGFuZGxlciBUaGUgbWVzc2FnZSBoYW5kbGVyXG4gKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIHdpdGggdGhlIHtAbGluayBzYXAudWkubW9kZWwub2RhdGEudjQuQ29udGV4dCBjb250ZXh0fSBvZiB0aGUgbmV3IGRyYWZ0IGRvY3VtZW50XG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFjdGl2YXRlRG9jdW1lbnQoXG5cdG9Db250ZXh0OiBWNENvbnRleHQsXG5cdG9BcHBDb21wb25lbnQ6IEFwcENvbXBvbmVudCxcblx0bVBhcmFtZXRlcnM6IHsgZm5CZWZvcmVBY3RpdmF0ZURvY3VtZW50PzogYW55OyBmbkFmdGVyQWN0aXZhdGVEb2N1bWVudD86IGFueSB9LFxuXHRtZXNzYWdlSGFuZGxlcj86IE1lc3NhZ2VIYW5kbGVyXG4pIHtcblx0Y29uc3QgbVBhcmFtID0gbVBhcmFtZXRlcnMgfHwge307XG5cdGlmICghb0NvbnRleHQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCaW5kaW5nIGNvbnRleHQgdG8gZHJhZnQgZG9jdW1lbnQgaXMgcmVxdWlyZWRcIik7XG5cdH1cblxuXHRjb25zdCBiRXhlY3V0ZSA9IG1QYXJhbS5mbkJlZm9yZUFjdGl2YXRlRG9jdW1lbnQgPyBhd2FpdCBtUGFyYW0uZm5CZWZvcmVBY3RpdmF0ZURvY3VtZW50KG9Db250ZXh0KSA6IHRydWU7XG5cdGlmICghYkV4ZWN1dGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEFjdGl2YXRpb24gb2YgdGhlIGRvY3VtZW50IHdhcyBhYm9ydGVkIGJ5IGV4dGVuc2lvbiBmb3IgZG9jdW1lbnQ6ICR7b0NvbnRleHQuZ2V0UGF0aCgpfWApO1xuXHR9XG5cblx0bGV0IG9BY3RpdmVEb2N1bWVudENvbnRleHQ6IGFueTtcblx0aWYgKCFoYXNQcmVwYXJlQWN0aW9uKG9Db250ZXh0KSkge1xuXHRcdG9BY3RpdmVEb2N1bWVudENvbnRleHQgPSBhd2FpdCBleGVjdXRlRHJhZnRBY3RpdmF0aW9uQWN0aW9uKG9Db250ZXh0LCBvQXBwQ29tcG9uZW50KTtcblx0fSBlbHNlIHtcblx0XHQvKiBhY3RpdmF0aW9uIHJlcXVpcmVzIHByZXBhcmF0aW9uICovXG5cdFx0Y29uc3Qgc0JhdGNoR3JvdXAgPSBcImRyYWZ0XCI7XG5cdFx0Ly8gd2UgdXNlIHRoZSBzYW1lIGJhdGNoR3JvdXAgdG8gZm9yY2UgcHJlcGFyZSBhbmQgYWN0aXZhdGUgaW4gYSBzYW1lIGJhdGNoIGJ1dCB3aXRoIGRpZmZlcmVudCBjaGFuZ2VzZXRcblx0XHRsZXQgb1ByZXBhcmVQcm9taXNlID0gZHJhZnQuZXhlY3V0ZURyYWZ0UHJlcGFyYXRpb25BY3Rpb24ob0NvbnRleHQsIHNCYXRjaEdyb3VwLCBmYWxzZSk7XG5cdFx0b0NvbnRleHQuZ2V0TW9kZWwoKS5zdWJtaXRCYXRjaChzQmF0Y2hHcm91cCk7XG5cdFx0Y29uc3Qgb0FjdGl2YXRlUHJvbWlzZSA9IGRyYWZ0LmV4ZWN1dGVEcmFmdEFjdGl2YXRpb25BY3Rpb24ob0NvbnRleHQsIG9BcHBDb21wb25lbnQsIHNCYXRjaEdyb3VwKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gYXdhaXQgUHJvbWlzZS5hbGwoW29QcmVwYXJlUHJvbWlzZSwgb0FjdGl2YXRlUHJvbWlzZV0pO1xuXHRcdFx0b0FjdGl2ZURvY3VtZW50Q29udGV4dCA9IHZhbHVlc1sxXTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdC8vIEJDUCAyMjcwMDg0MDc1XG5cdFx0XHQvLyBpZiB0aGUgQWN0aXZhdGlvbiBmYWlscywgdGhlbiB0aGUgbWVzc2FnZXMgYXJlIHJldHJpZXZlZCBmcm9tIFBSRVBBUkFUSU9OIGFjdGlvblxuXHRcdFx0Y29uc3Qgc01lc3NhZ2VzUGF0aCA9IGdldE1lc3NhZ2VQYXRoRm9yUHJlcGFyZShvQ29udGV4dCk7XG5cdFx0XHRpZiAoc01lc3NhZ2VzUGF0aCkge1xuXHRcdFx0XHRvUHJlcGFyZVByb21pc2UgPSBkcmFmdC5leGVjdXRlRHJhZnRQcmVwYXJhdGlvbkFjdGlvbihvQ29udGV4dCwgc0JhdGNoR3JvdXAsIHRydWUpO1xuXHRcdFx0XHRvQ29udGV4dC5nZXRNb2RlbCgpLnN1Ym1pdEJhdGNoKHNCYXRjaEdyb3VwKTtcblx0XHRcdFx0YXdhaXQgb1ByZXBhcmVQcm9taXNlO1xuXHRcdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgb0NvbnRleHQucmVxdWVzdE9iamVjdCgpO1xuXHRcdFx0XHRpZiAoZGF0YVtzTWVzc2FnZXNQYXRoXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Ly9pZiBtZXNzYWdlcyBhcmUgYXZhaWxhYmxlIGZyb20gdGhlIFBSRVBBUkFUSU9OIGFjdGlvbiwgdGhlbiBwcmV2aW91cyB0cmFuc2l0aW9uIG1lc3NhZ2VzIGFyZSByZW1vdmVkXG5cdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXI/LnJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcyhmYWxzZSwgZmFsc2UsIG9Db250ZXh0LmdldFBhdGgoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRocm93IGVycjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG1QYXJhbS5mbkFmdGVyQWN0aXZhdGVEb2N1bWVudCA/IG1QYXJhbS5mbkFmdGVyQWN0aXZhdGVEb2N1bWVudChvQ29udGV4dCwgb0FjdGl2ZURvY3VtZW50Q29udGV4dCkgOiBvQWN0aXZlRG9jdW1lbnRDb250ZXh0O1xufVxuXG4vKipcbiAqIEhUVFAgUE9TVCBjYWxsIHdoZW4gRHJhZnRBY3Rpb24gaXMgcHJlc2VudCBmb3IgRHJhZnQgRGVsZXRlOyBIVFRQIERFTEVURSBjYWxsIHdoZW4gdGhlcmUgaXMgbm8gRHJhZnRBY3Rpb25cbiAqIGFuZCBBY3RpdmUgSW5zdGFuY2UgYWx3YXlzIHVzZXMgREVMRVRFLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgc2FwLmZlLmNvcmUuYWN0aW9ucy5kcmFmdCNkZWxldGVEcmFmdFxuICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmFjdGlvbnMuZHJhZnRcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9mIHRoZSBkb2N1bWVudCB0byBiZSBkaXNjYXJkZWRcbiAqIEBwYXJhbSBvQXBwQ29tcG9uZW50IENvbnRleHQgb2YgdGhlIGRvY3VtZW50IHRvIGJlIGRpc2NhcmRlZFxuICogQHBhcmFtIGJFbmFibGVTdHJpY3RIYW5kbGluZ1xuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIEEgUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBjb250ZXh0IGlzIGRlbGV0ZWRcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5mdW5jdGlvbiBkZWxldGVEcmFmdChvQ29udGV4dDogVjRDb250ZXh0LCBvQXBwQ29tcG9uZW50PzogYW55LCBiRW5hYmxlU3RyaWN0SGFuZGxpbmc/OiBib29sZWFuKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdGNvbnN0IHNEaXNjYXJkQWN0aW9uID0gZ2V0QWN0aW9uTmFtZShvQ29udGV4dCwgZHJhZnRPcGVyYXRpb25zLkRJU0NBUkQpLFxuXHRcdGJJc0FjdGl2ZUVudGl0eSA9IG9Db250ZXh0LmdldE9iamVjdCgpLklzQWN0aXZlRW50aXR5O1xuXG5cdGlmIChiSXNBY3RpdmVFbnRpdHkgfHwgKCFiSXNBY3RpdmVFbnRpdHkgJiYgIXNEaXNjYXJkQWN0aW9uKSkge1xuXHRcdC8vVXNlIERlbGV0ZSBpbiBjYXNlIG9mIGFjdGl2ZSBlbnRpdHkgYW5kIG5vIGRpc2NhcmQgYWN0aW9uIGF2YWlsYWJsZSBmb3IgZHJhZnRcblx0XHRpZiAob0NvbnRleHQuaGFzUGVuZGluZ0NoYW5nZXMoKSkge1xuXHRcdFx0cmV0dXJuIG9Db250ZXh0XG5cdFx0XHRcdC5nZXRCaW5kaW5nKClcblx0XHRcdFx0LnJlc2V0Q2hhbmdlcygpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb0NvbnRleHQuZGVsZXRlKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gb0NvbnRleHQuZGVsZXRlKCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vVXNlIERpc2NhcmQgUG9zdCBBY3Rpb24gaWYgaXQgaXMgYSBkcmFmdCBlbnRpdHkgYW5kIGRpc2NhcmQgYWN0aW9uIGV4aXN0c1xuXHRcdHJldHVybiBleGVjdXRlRHJhZnREaXNjYXJkQWN0aW9uKG9Db250ZXh0LCBvQXBwQ29tcG9uZW50LCBiRW5hYmxlU3RyaWN0SGFuZGxpbmcpO1xuXHR9XG59XG5cbmNvbnN0IGRyYWZ0ID0ge1xuXHRjcmVhdGVEcmFmdEZyb21BY3RpdmVEb2N1bWVudDogY3JlYXRlRHJhZnRGcm9tQWN0aXZlRG9jdW1lbnQsXG5cdGFjdGl2YXRlRG9jdW1lbnQ6IGFjdGl2YXRlRG9jdW1lbnQsXG5cdGRlbGV0ZURyYWZ0OiBkZWxldGVEcmFmdCxcblx0ZXhlY3V0ZURyYWZ0RWRpdEFjdGlvbjogZXhlY3V0ZURyYWZ0RWRpdEFjdGlvbixcblx0ZXhlY3V0ZURyYWZ0VmFsaWRhdGlvbjogZXhlY3V0ZURyYWZ0VmFsaWRhdGlvbixcblx0ZXhlY3V0ZURyYWZ0UHJlcGFyYXRpb25BY3Rpb246IGV4ZWN1dGVEcmFmdFByZXBhcmF0aW9uQWN0aW9uLFxuXHRleGVjdXRlRHJhZnRBY3RpdmF0aW9uQWN0aW9uOiBleGVjdXRlRHJhZnRBY3RpdmF0aW9uQWN0aW9uLFxuXHRoYXNQcmVwYXJlQWN0aW9uOiBoYXNQcmVwYXJlQWN0aW9uLFxuXHRnZXRNZXNzYWdlc1BhdGg6IGdldE1lc3NhZ2VzUGF0aCxcblx0Y29tcHV0ZVNpYmxpbmdJbmZvcm1hdGlvbjogY29tcHV0ZVNpYmxpbmdJbmZvcm1hdGlvbixcblx0cHJvY2Vzc0RhdGFMb3NzT3JEcmFmdERpc2NhcmRDb25maXJtYXRpb246IGRyYWZ0RGF0YUxvc3NQb3B1cC5wcm9jZXNzRGF0YUxvc3NPckRyYWZ0RGlzY2FyZENvbmZpcm1hdGlvbixcblx0c2lsZW50bHlLZWVwRHJhZnRPbkZvcndhcmROYXZpZ2F0aW9uOiBkcmFmdERhdGFMb3NzUG9wdXAuc2lsZW50bHlLZWVwRHJhZnRPbkZvcndhcmROYXZpZ2F0aW9uLFxuXHRjcmVhdGVPcGVyYXRpb246IGNyZWF0ZU9wZXJhdGlvbixcblx0ZXhlY3V0ZURyYWZ0RGlzY2FyZEFjdGlvbjogZXhlY3V0ZURyYWZ0RGlzY2FyZEFjdGlvbixcblx0TmF2aWdhdGlvblR5cGU6IGRyYWZ0RGF0YUxvc3NQb3B1cC5OYXZpZ2F0aW9uVHlwZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZHJhZnQ7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUFrakJPLGdCQUFnQkEsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0lBQ3JDLElBQUk7TUFDSCxJQUFJQyxNQUFNLEdBQUdGLElBQUksRUFBakI7SUFDQSxDQUZELENBRUUsT0FBTUcsQ0FBTixFQUFTO01BQ1YsT0FBT0YsT0FBTyxDQUFDRSxDQUFELENBQWQ7SUFDQTs7SUFDRCxJQUFJ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