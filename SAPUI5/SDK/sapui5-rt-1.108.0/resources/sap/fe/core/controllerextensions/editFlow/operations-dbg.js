/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/ActionRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/messageHandler/messageHandling", "sap/fe/core/helpers/FPMHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/library", "sap/m/Button", "sap/m/Dialog", "sap/m/MessageBox", "sap/ui/core/Core", "sap/ui/core/Fragment", "sap/ui/core/library", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/model/json/JSONModel", "../../operationsHelper"], function (Log, ActionRuntime, CommonUtils, BusyLocker, messageHandling, FPMHelper, StableIdHelper, FELibrary, Button, Dialog, MessageBox, Core, Fragment, library, XMLPreprocessor, XMLTemplateProcessor, JSONModel, operationsHelper) {
  "use strict";

  var MessageType = library.MessageType;
  var generate = StableIdHelper.generate;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

  var executeAPMAction = function (oAppComponent, mParameters, oParentControl, messageHandler, aContexts, oDialog, after412) {
    try {
      return Promise.resolve(_executeAction(oAppComponent, mParameters, oParentControl, messageHandler)).then(function (aResult) {
        var _mParameters$internal6;

        // If some entries were successful, and others have failed, the overall process is still successful. However, this was treated as rejection
        // before, and this currently is still kept, as long as dialog handling is mixed with backend process handling.
        // TODO: Refactor to only reject in case of overall process error.
        // For the time being: map to old logic to reject if at least one entry has failed
        if (aResult !== null && aResult !== void 0 && aResult.some(function (oSingleResult) {
          return oSingleResult.status === "rejected";
        })) {
          throw aResult;
        }

        var messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

        if (mParameters.internalModelContext && mParameters.internalModelContext.getProperty("412Executed") && (_mParameters$internal6 = mParameters.internalModelContext.getProperty("strictHandlingFails")) !== null && _mParameters$internal6 !== void 0 && _mParameters$internal6.length) {
          if (!after412) {
            mParameters.internalModelContext.setProperty("DelayMessages", mParameters.internalModelContext.getProperty("DelayMessages").concat(messages));
          } else {
            Core.getMessageManager().addMessages(mParameters.internalModelContext.getProperty("DelayMessages"));

            if (messages.length) {
              // BOUND TRANSITION AS PART OF SAP_MESSAGE
              messageHandler.showMessageDialog({
                onBeforeShowMessage: function (aMessages, showMessageParametersIn) {
                  return actionParameterShowMessageCallback(mParameters, aContexts, oDialog, aMessages, showMessageParametersIn);
                }
              });
            }
          }
        } else if (messages.length) {
          // BOUND TRANSITION AS PART OF SAP_MESSAGE
          messageHandler.showMessageDialog({
            isActionParameterDialogOpen: mParameters === null || mParameters === void 0 ? void 0 : mParameters.oDialog.isOpen(),
            onBeforeShowMessage: function (aMessages, showMessageParametersIn) {
              return actionParameterShowMessageCallback(mParameters, aContexts, oDialog, aMessages, showMessageParametersIn);
            }
          });
        }

        return aResult;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var Constants = FELibrary.Constants,
      InvocationGrouping = FELibrary.InvocationGrouping;
  var Action = MessageBox.Action;
  /**
   * Calls a bound action for one or multiple contexts.
   *
   * @function
   * @static
   * @name sap.fe.core.actions.operations.callBoundAction
   * @memberof sap.fe.core.actions.operations
   * @param sActionName The name of the action to be called
   * @param contexts Either one context or an array with contexts for which the action is to be be called
   * @param oModel OData Model
   * @param oAppComponent The AppComponent
   * @param [mParameters] Optional, can contain the following attributes:
   * @param [mParameters.parameterValues] A map of action parameter names and provided values
   * @param [mParameters.mBindingParameters] A map of binding parameters that would be part of $select and $expand coming from side effects for bound actions
   * @param [mParameters.additionalSideEffect] Array of property paths to be requested in addition to actual target properties of the side effect
   * @param [mParameters.showActionParameterDialog] If set and if parameters exist the user retrieves a dialog to fill in parameters, if actionParameters are passed they are shown to the user
   * @param [mParameters.label] A human-readable label for the action
   * @param [mParameters.invocationGrouping] Mode how actions are to be called: Changeset to put all action calls into one changeset, Isolated to put them into separate changesets, defaults to Isolated
   * @param [mParameters.onSubmitted] Function which is called once the actions are submitted with an array of promises
   * @param [mParameters.defaultParameters] Can contain default parameters from FLP user defaults
   * @param [mParameters.parentControl] If specified, the dialogs are added as dependent of the parent control
   * @param [mParameters.bGetBoundContext] If specified, the action promise returns the bound context
   * @returns Promise resolves with an array of response objects (TODO: to be changed)
   * @private
   * @ui5-restricted
   */

  function callBoundAction(sActionName, contexts, oModel, oAppComponent, mParameters) {
    if (!contexts || contexts.length === 0) {
      //In Freestyle apps bound actions can have no context
      return Promise.reject("Bound actions always requires at least one context");
    } // this method either accepts single context or an array of contexts
    // TODO: Refactor to an unambiguos API


    var isCalledWithArray = Array.isArray(contexts); // in case of single context wrap into an array for called methods (esp. callAction)

    mParameters.aContexts = isCalledWithArray ? contexts : [contexts];
    var oMetaModel = oModel.getMetaModel(),
        // Analyzing metaModelPath for action only from first context seems weird, but probably works in all existing szenarios - if several contexts are passed, they probably
    // belong to the same metamodelpath. TODO: Check, whether this can be improved / szenarios with different metaModelPaths might exist
    sActionPath = "".concat(oMetaModel.getMetaPath(mParameters.aContexts[0].getPath()), "/").concat(sActionName),
        oBoundAction = oMetaModel.createBindingContext("".concat(sActionPath, "/@$ui5.overload/0"));
    mParameters.isCriticalAction = getIsActionCritical(oMetaModel, sActionPath, mParameters.aContexts, oBoundAction); // Promise returned by callAction currently is rejected in case of execution for multiple contexts partly failing. This should be changed (some failing contexts do not mean
    // that function did not fulfill its task), but as this is a bigger refactoring, for the time being we need to deal with that at the calling place (i.e. here)
    // => provide the same handler (mapping back from array to single result/error if needed) for resolved/rejected case

    var extractSingleResult = function (result) {
      // single action could be resolved or rejected
      if (result[0].status === "fulfilled") {
        return result[0].value;
      } else {
        // In case of dialog cancellation, no array is returned => throw the result.
        // Ideally, differentiating should not be needed here => TODO: Find better solution when separating dialog handling (single object with single result) from backend
        // execution (potentially multiple objects)
        throw result[0].reason || result;
      }
    };

    return callAction(sActionName, oModel, oBoundAction, oAppComponent, mParameters).then(function (result) {
      if (isCalledWithArray) {
        return result;
      } else {
        return extractSingleResult(result);
      }
    }, function (result) {
      if (isCalledWithArray) {
        throw result;
      } else {
        return extractSingleResult(result);
      }
    });
  }
  /**
   * Calls an action import.
   *
   * @function
   * @static
   * @name sap.fe.core.actions.operations.callActionImport
   * @memberof sap.fe.core.actions.operations
   * @param sActionName The name of the action import to be called
   * @param oModel An instance of an OData V4 model
   * @param oAppComponent The AppComponent
   * @param [mParameters] Optional, can contain the following attributes:
   * @param [mParameters.parameterValues] A map of action parameter names and provided values
   * @param [mParameters.label] A human-readable label for the action
   * @param [mParameters.showActionParameterDialog] If set and if parameters exist the user retrieves a dialog to fill in parameters, if actionParameters are passed they are shown to the user
   * @param [mParameters.onSubmitted] Function which is called once the actions are submitted with an array of promises
   * @param [mParameters.defaultParameters] Can contain default parameters from FLP user defaults
   * @returns Promise resolves with an array of response objects (TODO: to be changed)
   * @private
   * @ui5-restricted
   */


  function callActionImport(sActionName, oModel, oAppComponent, mParameters) {
    if (!oModel) {
      return Promise.reject("Action expects a model/context for execution");
    }

    var oMetaModel = oModel.getMetaModel(),
        sActionPath = oModel.bindContext("/".concat(sActionName)).getPath(),
        oActionImport = oMetaModel.createBindingContext("/".concat(oMetaModel.createBindingContext(sActionPath).getObject("$Action"), "/0"));
    mParameters.isCriticalAction = getIsActionCritical(oMetaModel, "".concat(sActionPath, "/@$ui5.overload"));
    return callAction(sActionName, oModel, oActionImport, oAppComponent, mParameters);
  }

  function callBoundFunction(sFunctionName, context, oModel) {
    if (!context) {
      return Promise.reject("Bound functions always requires a context");
    }

    var oMetaModel = oModel.getMetaModel(),
        sFunctionPath = "".concat(oMetaModel.getMetaPath(context.getPath()), "/").concat(sFunctionName),
        oBoundFunction = oMetaModel.createBindingContext(sFunctionPath);
    return _executeFunction(sFunctionName, oModel, oBoundFunction, context);
  }
  /**
   * Calls a function import.
   *
   * @function
   * @static
   * @name sap.fe.core.actions.operations.callFunctionImport
   * @memberof sap.fe.core.actions.operations
   * @param sFunctionName The name of the function to be called
   * @param oModel An instance of an OData v4 model
   * @returns Promise resolves
   * @private
   */


  function callFunctionImport(sFunctionName, oModel) {
    if (!sFunctionName) {
      return Promise.resolve();
    }

    var oMetaModel = oModel.getMetaModel(),
        sFunctionPath = oModel.bindContext("/".concat(sFunctionName)).getPath(),
        oFunctionImport = oMetaModel.createBindingContext("/".concat(oMetaModel.createBindingContext(sFunctionPath).getObject("$Function"), "/0"));
    return _executeFunction(sFunctionName, oModel, oFunctionImport);
  }

  function _executeFunction(sFunctionName, oModel, oFunction, context) {
    var sGroupId;

    if (!oFunction || !oFunction.getObject()) {
      return Promise.reject(new Error("Function ".concat(sFunctionName, " not found")));
    }

    if (context) {
      oFunction = oModel.bindContext("".concat(sFunctionName, "(...)"), context);
      sGroupId = "functionGroup";
    } else {
      oFunction = oModel.bindContext("/".concat(sFunctionName, "(...)"));
      sGroupId = "functionImport";
    }

    var oFunctionPromise = oFunction.execute(sGroupId);
    oModel.submitBatch(sGroupId);
    return oFunctionPromise.then(function () {
      return oFunction.getBoundContext();
    });
  }

  function callAction(sActionName, oModel, oAction, oAppComponent, mParameters) {
    return new Promise(function (resolve, reject) {
      try {
        var mActionExecutionParameters = {};
        var fnDialog;
        var oActionPromise; //let failedActionPromise: any;

        var sActionLabel = mParameters.label;
        var bSkipParameterDialog = mParameters.skipParameterDialog;
        var aContexts = mParameters.aContexts;
        var bIsCreateAction = mParameters.bIsCreateAction;
        var bIsCriticalAction = mParameters.isCriticalAction;
        var oMetaModel;
        var sMetaPath;
        var sMessagesPath;
        var iMessageSideEffect;
        var bIsSameEntity;
        var oReturnType;
        var bValuesProvidedForAllParameters;
        var actionDefinition = oAction.getObject();

        if (!oAction || !oAction.getObject()) {
          return Promise.resolve(reject(new Error("Action ".concat(sActionName, " not found"))));
        } // Get the parameters of the action


        var aActionParameters = getActionParameters(oAction); // Check if the action has parameters and would need a parameter dialog
        // The parameter ResultIsActiveEntity is always hidden in the dialog! Hence if
        // this is the only parameter, this is treated as no parameter here because the
        // dialog would be empty!

        var bActionNeedsParameterDialog = aActionParameters.length > 0 && !(aActionParameters.length === 1 && aActionParameters[0].$Name === "ResultIsActiveEntity"); // Provided values for the action parameters from invokeAction call

        var aParameterValues = mParameters.parameterValues; // Determine startup parameters if provided

        var oComponentData = oAppComponent.getComponentData();
        var oStartupParameters = oComponentData && oComponentData.startupParameters || {}; // In case an action parameter is needed, and we shall skip the dialog, check if values are provided for all parameters

        if (bActionNeedsParameterDialog && bSkipParameterDialog) {
          bValuesProvidedForAllParameters = _valuesProvidedForAllParameters(bIsCreateAction, aActionParameters, aParameterValues, oStartupParameters);
        } // Depending on the previously determined data, either set a dialog or leave it empty which
        // will lead to direct execution of the action without a dialog


        fnDialog = null;

        if (bActionNeedsParameterDialog) {
          if (!(bSkipParameterDialog && bValuesProvidedForAllParameters)) {
            fnDialog = showActionParameterDialog;
          }
        } else if (bIsCriticalAction) {
          fnDialog = confirmCriticalAction;
        }

        mActionExecutionParameters = {
          fnOnSubmitted: mParameters.onSubmitted,
          fnOnResponse: mParameters.onResponse,
          actionName: sActionName,
          model: oModel,
          aActionParameters: aActionParameters,
          bGetBoundContext: mParameters.bGetBoundContext,
          defaultValuesExtensionFunction: mParameters.defaultValuesExtensionFunction,
          label: mParameters.label,
          selectedItems: mParameters.selectedItems
        };

        if (oAction.getObject("$IsBound")) {
          if (mParameters.additionalSideEffect && mParameters.additionalSideEffect.pathExpressions) {
            oMetaModel = oModel.getMetaModel();
            sMetaPath = oMetaModel.getMetaPath(aContexts[0].getPath());
            sMessagesPath = oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.Common.v1.Messages/$Path"));

            if (sMessagesPath) {
              iMessageSideEffect = mParameters.additionalSideEffect.pathExpressions.findIndex(function (exp) {
                return typeof exp === "string" && exp === sMessagesPath;
              }); // Add SAP_Messages by default if not annotated by side effects, action does not return a collection and
              // the return type is the same as the bound type

              oReturnType = oAction.getObject("$ReturnType");
              bIsSameEntity = oReturnType && !oReturnType.$isCollection && oAction.getModel().getObject(sMetaPath).$Type === oReturnType.$Type;

              if (iMessageSideEffect > -1 || bIsSameEntity) {
                // the message path is annotated as side effect. As there's no binding for it and the model does currently not allow
                // to add it at a later point of time we have to take care it's part of the $select of the POST, therefore moving it.
                mParameters.mBindingParameters = mParameters.mBindingParameters || {};

                if (oAction.getObject("$ReturnType/$Type/".concat(sMessagesPath)) && (!mParameters.mBindingParameters.$select || mParameters.mBindingParameters.$select.split(",").indexOf(sMessagesPath) === -1)) {
                  mParameters.mBindingParameters.$select = mParameters.mBindingParameters.$select ? "".concat(mParameters.mBindingParameters.$select, ",").concat(sMessagesPath) : sMessagesPath; // Add side effects at entity level because $select stops these being returned by the action
                  // Only if no other side effects were added for Messages

                  if (iMessageSideEffect === -1) {
                    mParameters.additionalSideEffect.pathExpressions.push("*");
                  }

                  if (mParameters.additionalSideEffect.triggerActions.length === 0 && iMessageSideEffect > -1) {
                    // no trigger action therefore no need to request messages again
                    mParameters.additionalSideEffect.pathExpressions.splice(iMessageSideEffect, 1);
                  }
                }
              }
            }
          }

          mActionExecutionParameters.aContexts = aContexts;
          mActionExecutionParameters.mBindingParameters = mParameters.mBindingParameters;
          mActionExecutionParameters.additionalSideEffect = mParameters.additionalSideEffect;
          mActionExecutionParameters.bGrouped = mParameters.invocationGrouping === InvocationGrouping.ChangeSet;
          mActionExecutionParameters.internalModelContext = mParameters.internalModelContext;
          mActionExecutionParameters.operationAvailableMap = mParameters.operationAvailableMap;
          mActionExecutionParameters.isCreateAction = bIsCreateAction;
          mActionExecutionParameters.bObjectPage = mParameters.bObjectPage;

          if (mParameters.controlId) {
            mActionExecutionParameters.control = mParameters.parentControl.byId(mParameters.controlId);
          } else {
            mActionExecutionParameters.control = mParameters.parentControl;
          }
        }

        if (bIsCreateAction) {
          mActionExecutionParameters.bIsCreateAction = bIsCreateAction;
        } //check for skipping static actions


        var isStatic = (actionDefinition.$Parameter || []).some(function (aParameter) {
          return (actionDefinition.$EntitySetPath && actionDefinition.$EntitySetPath === aParameter.$Name || actionDefinition.$IsBound) && aParameter.$isCollection;
        });
        mActionExecutionParameters.isStatic = isStatic;
        return Promise.resolve(function () {
          if (fnDialog) {
            oActionPromise = fnDialog(sActionName, oAppComponent, sActionLabel, mActionExecutionParameters, aActionParameters, aParameterValues, oAction, mParameters.parentControl, mParameters.entitySetName, mParameters.messageHandler);
            return oActionPromise.then(function (oOperationResult) {
              afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
              resolve(oOperationResult);
            }).catch(function (oOperationResult) {
              reject(oOperationResult);
            });
          } else {
            // Take over all provided parameter values and call the action.
            // This shall only happen if values are provided for all the parameters, otherwise the parameter dialog shall be shown which is ensured earlier
            if (aParameterValues) {
              var _loop = function (i) {
                var _aParameterValues$fin;

                mActionExecutionParameters.aActionParameters[i].value = aParameterValues === null || aParameterValues === void 0 ? void 0 : (_aParameterValues$fin = aParameterValues.find(function (element) {
                  return element.name === mActionExecutionParameters.aActionParameters[i].$Name;
                })) === null || _aParameterValues$fin === void 0 ? void 0 : _aParameterValues$fin.value;
              };

              for (var i in mActionExecutionParameters.aActionParameters) {
                _loop(i);
              }
            } else if (oStartupParameters) {
              for (var _i in mActionExecutionParameters.aActionParameters) {
                mActionExecutionParameters.aActionParameters[_i].value = oStartupParameters[mActionExecutionParameters.aActionParameters[_i].$Name][0];
              }
            }

            var oOperationResult;

            var _temp5 = _finallyRethrows(function () {
              return _catch(function () {
                var _mActionExecutionPara, _mActionExecutionPara2;

                (_mActionExecutionPara = mActionExecutionParameters) === null || _mActionExecutionPara === void 0 ? void 0 : (_mActionExecutionPara2 = _mActionExecutionPara.internalModelContext) === null || _mActionExecutionPara2 === void 0 ? void 0 : _mActionExecutionPara2.setProperty("412Executed", false);
                return Promise.resolve(_executeAction(oAppComponent, mActionExecutionParameters, mParameters.parentControl, mParameters.messageHandler)).then(function (_executeAction2) {
                  var _mActionExecutionPara3;

                  oOperationResult = _executeAction2;
                  var messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

                  if (mActionExecutionParameters.internalModelContext && mActionExecutionParameters.internalModelContext.getProperty("412Executed") && (_mActionExecutionPara3 = mActionExecutionParameters.internalModelContext.getProperty("strictHandlingFails")) !== null && _mActionExecutionPara3 !== void 0 && _mActionExecutionPara3.length) {
                    mActionExecutionParameters.internalModelContext.setProperty("DelayMessages", mActionExecutionParameters.internalModelContext.getProperty("DelayMessages").concat(messages));
                  }

                  afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
                  resolve(oOperationResult);
                });
              }, function () {
                reject(oOperationResult);
              });
            }, function (_wasThrown, _result) {
              function _temp3() {
                var _mParameters$messageH;

                mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$messageH = mParameters.messageHandler) === null || _mParameters$messageH === void 0 ? void 0 : _mParameters$messageH.showMessageDialog();
                if (_wasThrown) throw _result;
                return _result;
              }

              var _temp2 = function () {
                var _mActionExecutionPara4;

                if (mActionExecutionParameters.internalModelContext && mActionExecutionParameters.internalModelContext.getProperty("412Executed") && (_mActionExecutionPara4 = mActionExecutionParameters.internalModelContext.getProperty("strictHandlingFails")) !== null && _mActionExecutionPara4 !== void 0 && _mActionExecutionPara4.length) {
                  var _temp6 = _catch(function () {
                    var strictHandlingFails = mActionExecutionParameters.internalModelContext.getProperty("strictHandlingFails");
                    var aFailedContexts = [];
                    strictHandlingFails.forEach(function (fail) {
                      aFailedContexts.push(fail.oAction.getContext());
                    });
                    mActionExecutionParameters.aContexts = aFailedContexts;
                    return Promise.resolve(_executeAction(oAppComponent, mActionExecutionParameters, mParameters.parentControl, mParameters.messageHandler)).then(function (oFailedOperationResult) {
                      Core.getMessageManager().addMessages(mActionExecutionParameters.internalModelContext.getProperty("DelayMessages"));
                      mActionExecutionParameters.internalModelContext.setProperty("strictHandlingFails", []);
                      mActionExecutionParameters.internalModelContext.setProperty("processedMessageIds", []);
                      afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
                      resolve(oFailedOperationResult);
                    });
                  }, function (oFailedOperationResult) {
                    reject(oFailedOperationResult);
                  });

                  if (_temp6 && _temp6.then) return _temp6.then(function () {});
                }
              }();

              return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
            });

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }

  function confirmCriticalAction(sActionName, oAppComponent, sActionLabel, mParameters, aActionParameters, aParameterValues, oActionContext, oParentControl, entitySetName, messageHandler) {
    return new Promise(function (resolve, reject) {
      var boundActionName = sActionName ? sActionName : null;
      boundActionName = boundActionName.indexOf(".") >= 0 ? boundActionName.split(".")[boundActionName.split(".").length - 1] : boundActionName;
      var suffixResourceKey = boundActionName && entitySetName ? "".concat(entitySetName, "|").concat(boundActionName) : "";
      var oResourceBundle = oParentControl.getController().oResourceBundle;
      var sConfirmationText = CommonUtils.getTranslatedText("C_OPERATIONS_ACTION_CONFIRM_MESSAGE", oResourceBundle, null, suffixResourceKey);
      MessageBox.confirm(sConfirmationText, {
        onClose: function (sAction) {
          try {
            var _temp10 = function () {
              if (sAction === Action.OK) {
                var _temp11 = _catch(function () {
                  return Promise.resolve(_executeAction(oAppComponent, mParameters, oParentControl, messageHandler)).then(function (oOperation) {
                    resolve(oOperation);
                  });
                }, function (oError) {
                  var _temp7 = _catch(function () {
                    return Promise.resolve(messageHandler.showMessageDialog()).then(function () {
                      reject(oError);
                    });
                  }, function () {
                    reject(oError);
                  });

                  return _temp7 && _temp7.then ? _temp7.then(function () {}) : void 0;
                });

                if (_temp11 && _temp11.then) return _temp11.then(function () {});
              } else {
                resolve();
              }
            }();

            return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        }
      });
    });
  }

  function afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition) {
    if (mActionExecutionParameters.internalModelContext && mActionExecutionParameters.operationAvailableMap && mActionExecutionParameters.aContexts && mActionExecutionParameters.aContexts.length && actionDefinition.$IsBound) {
      //check for skipping static actions
      var isStatic = mActionExecutionParameters.isStatic;

      if (!isStatic) {
        ActionRuntime.setActionEnablement(mActionExecutionParameters.internalModelContext, JSON.parse(mActionExecutionParameters.operationAvailableMap), mParameters.selectedItems, "table");
      } else if (mActionExecutionParameters.control) {
        var oControl = mActionExecutionParameters.control;

        if (oControl.isA("sap.ui.mdc.Table")) {
          var aSelectedContexts = oControl.getSelectedContexts();
          ActionRuntime.setActionEnablement(mActionExecutionParameters.internalModelContext, JSON.parse(mActionExecutionParameters.operationAvailableMap), aSelectedContexts, "table");
        }
      }
    }
  }

  function actionParameterShowMessageCallback(mParameters, aContexts, oDialog, messages, showMessageParametersIn) {
    var showMessageBox = showMessageParametersIn.showMessageBox,
        showMessageDialog = showMessageParametersIn.showMessageDialog;
    var oControl = mParameters.control;
    var unboundMessages = messages.filter(function (message) {
      return message.getTarget() === "";
    });
    var APDmessages = messages.filter(function (message) {
      return message.getTarget && message.getTarget().indexOf(mParameters.actionName) !== -1 && mParameters.aActionParameters.some(function (actionParam) {
        return message.getTarget().indexOf(actionParam.$Name) !== -1;
      });
    });
    APDmessages.forEach(function (APDMessage) {
      APDMessage.isAPDTarget = true;
    });
    var errorTargetsInAPD = APDmessages.length ? true : false;

    if (oDialog.isOpen() && aContexts.length !== 0 && !mParameters.isStatic) {
      if (!mParameters.bGrouped) {
        //isolated
        if (aContexts.length > 1 || !errorTargetsInAPD) {
          // does not matter if error is in APD or not, if there are multiple contexts selected or if the error is not the APD, we close it.
          // TODO: Dilaog handling should not be part of message handling. Refactor accordingly - dialog should not be needed inside this method - neither
          // to ask whether it's open, nor to close/destroy it!
          oDialog.close();
          oDialog.destroy();
        }
      } else if (!errorTargetsInAPD) {
        //changeset
        oDialog.close();
        oDialog.destroy();
      }
    }

    var filteredMessages = [];
    var bIsAPDOpen = oDialog.isOpen();

    if (messages.length === 1 && messages[0].getTarget && messages[0].getTarget() !== undefined && messages[0].getTarget() !== "") {
      if (oControl && oControl.getModel("ui").getProperty("/isEditable") === false || !oControl) {
        // OP edit or LR
        showMessageBox = !errorTargetsInAPD;
        showMessageDialog = false;
      } else if (oControl && oControl.getModel("ui").getProperty("/isEditable") === true) {
        showMessageBox = false;
        showMessageDialog = false;
      }
    } else if (oControl) {
      if (oControl.getModel("ui").getProperty("/isEditable") === false) {
        if (bIsAPDOpen && errorTargetsInAPD) {
          showMessageDialog = false;
        }
      } else if (oControl.getModel("ui").getProperty("/isEditable") === true) {
        if (!bIsAPDOpen && errorTargetsInAPD) {
          showMessageDialog = true;
          filteredMessages = unboundMessages.concat(APDmessages);
        } else if (!bIsAPDOpen && unboundMessages.length === 0) {
          // error targets in APD => there is atleast one bound message. If there are unbound messages, dialog must be shown.
          // for draft entity, we already closed the APD
          showMessageDialog = false;
        }
      }
    }

    return {
      showMessageBox: showMessageBox,
      showMessageDialog: showMessageDialog,
      filteredMessages: filteredMessages.length ? filteredMessages : messages,
      fnGetMessageSubtitle: oControl && oControl.isA("sap.ui.mdc.Table") && messageHandling.setMessageSubtitle.bind({}, oControl, aContexts)
    };
  }
  /*
   * Currently, this method is responsible for showing the dialog and executing the action. The promise returned is pending while waiting for user input, as well as while the
   * back-end request is running. The promise is rejected when the user cancels the dialog and also when the back-end request fails.
   * TODO: Refactoring: Separate dialog handling from backend processing. Dialog handling should return a Promise resolving to parameters to be provided to backend. If dialog is
   * cancelled, that promise can be rejected. Method responsible for backend processing need to deal with multiple contexts - i.e. it should either return an array of Promises or
   * a Promise resolving to an array. In the latter case, that Promise should be resolved also when some or even all contexts failed in backend - the overall process still was
   * successful.
   *
   */


  function showActionParameterDialog(sActionName, oAppComponent, sActionLabel, mParameters, aActionParameters, aParameterValues, oActionContext, oParentControl, entitySetName, messageHandler) {
    var sPath = _getPath(oActionContext, sActionName),
        metaModel = oActionContext.getModel().oModel.getMetaModel(),
        entitySetContext = metaModel.createBindingContext(sPath),
        sActionNamePath = oActionContext.getObject("$IsBound") ? oActionContext.getPath().split("/@$ui5.overload/0")[0] : oActionContext.getPath().split("/0")[0],
        actionNameContext = metaModel.createBindingContext(sActionNamePath),
        bIsCreateAction = mParameters.isCreateAction,
        sFragmentName = "sap/fe/core/controls/ActionParameterDialog";

    return new Promise(function (resolve, reject) {
      try {
        var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
        var oParameterModel = new JSONModel({
          $displayMode: {}
        });
        var aFieldInvalid = [];
        var aFormElements = [];
        var mFieldValueMap = {};

        var validateRequiredProperties = function () {
          try {
            return Promise.resolve(Promise.all(aFormElements.filter(function (oFormElement) {
              var oField = oFormElement.getFields()[0];
              return oField.getRequired();
            }).map(function (oFormElement) {
              var value = oFormElement.getFields()[0].isA("sap.ui.mdc.MultiValueField") ? oFormElement.getFields()[0].getItems() : oFormElement.getFields()[0].getValue();

              if (value === undefined || value === null || value === "" || Array.isArray(value) && !value.length) {
                return oFormElement;
              }
            }))).then(function (aResults) {
              return aResults.filter(function (result) {
                return result !== undefined;
              });
            });
          } catch (e) {
            return Promise.reject(e);
          }
        };

        var _validateMessages = function (actionParameters, invalidFields, bClearTarget) {
          var oMessageManager = Core.getMessageManager();
          var aMessages = oMessageManager.getMessageModel().getData();
          invalidFields = invalidFields || [];

          if (!aMessages.length) {
            invalidFields = [];
          }

          actionParameters.forEach(function (oActionParameters) {
            var sParameter = oActionParameters.$Name;
            aMessages.forEach(function (oMessage) {
              var sParam = sParameter.replace("-inner", "");

              if (oMessage.controlIds.length > 0 && (oMessage.getControlId().includes("APD_::".concat(sParameter)) || oMessage.getControlId().includes("APD_::".concat(sParameter, "inner")) && invalidFields.indexOf("APD_::".concat(sParam)) < 0)) {
                if (bClearTarget) {
                  oMessageManager.removeMessages(oMessage);
                } else {
                  invalidFields.push("APD_::".concat(sParam));
                }
              } // Handle messages related to input with invalid token


              if (oMessage.target.includes("APD_::".concat(sParameter))) {
                invalidFields.push("APD_::".concat(sParam));
                oMessage.target = bClearTarget ? "" : oMessage.target;

                if (bClearTarget) {
                  oMessageManager.removeMessages(oMessage);
                }
              }
            });
          });
          return invalidFields;
        };

        var oController = {
          handleChange: function (oEvent) {
            messageHandler.removeTransitionMessages();
            var oField = oEvent.getSource();
            var sFieldId = oEvent.getParameter("id");
            var oFieldPromise = oEvent.getParameter("promise");

            if (oFieldPromise) {
              mFieldValueMap[sFieldId] = oFieldPromise.then(function () {
                return oField.getValue();
              });
            }

            _validateMessages(aActionParameters, aFieldInvalid);
          }
        };

        var _temp13 = _catch(function () {
          return Promise.resolve(XMLPreprocessor.process(oFragment, {
            name: sFragmentName
          }, {
            bindingContexts: {
              action: oActionContext,
              actionName: actionNameContext,
              entitySet: entitySetContext
            },
            models: {
              action: oActionContext.getModel(),
              actionName: actionNameContext.getModel(),
              entitySet: entitySetContext.getModel(),
              metaModel: entitySetContext.getModel()
            }
          })).then(function (createdFragment) {
            // TODO: move the dialog into the fragment and move the handlers to the oController
            var aContexts = mParameters.aContexts || [];
            var aFunctionParams = []; // eslint-disable-next-line prefer-const

            var oOperationBinding;
            return Promise.resolve(CommonUtils.setUserDefaults(oAppComponent, aActionParameters, oParameterModel, true)).then(function () {
              return Promise.resolve(Fragment.load({
                definition: createdFragment,
                controller: oController
              })).then(function (_Fragment$load) {
                var oDialogContent = _Fragment$load;
                var oResourceBundle = oParentControl.getController().oResourceBundle;
                var oDialog = new Dialog(undefined, {
                  title: sActionLabel || CommonUtils.getTranslatedText("C_OPERATIONS_ACTION_PARAMETER_DIALOG_TITLE", oResourceBundle),
                  content: [oDialogContent],
                  escapeHandler: function () {
                    // escape handler is meant to possibly suppress or postpone closing the dialog on escape (by calling "reject" on the provided object, or "resolve" only when
                    // done with all tasks to happen before dialog can be closed). It's not intended to explicetly close the dialog here (that happens automatically when no
                    // escapeHandler is provided or the resolve-calllback is calle) or for own wrap up tasks (like removing validition messages - this should happen in the
                    // afterClose).
                    // TODO: Move wrap up tasks to afterClose, and remove this method completely. Take care to also adapt end button press handler accordingly.
                    oDialog.close();
                    messageHandler.removeTransitionMessages();
                    reject(Constants.CancelActionDialog);
                  },
                  beginButton: new Button(generate(["fe", "APD_", sActionName, "Action", "Ok"]), {
                    text: bIsCreateAction ? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON", oResourceBundle) : _getActionParameterActionName(oResourceBundle, sActionLabel, sActionName, entitySetName),
                    type: "Emphasized",
                    press: function () {
                      try {
                        return Promise.resolve(_finallyRethrows(function () {
                          return Promise.resolve(validateRequiredProperties()).then(function (aEmptyMandatoryFields) {
                            var _exit = false;

                            function _temp18(_result4) {
                              if (_exit) return _result4;
                              BusyLocker.lock(oDialog);
                              return _catch(function () {
                                return Promise.resolve(Promise.all(Object.keys(mFieldValueMap).map(function (sKey) {
                                  return mFieldValueMap[sKey];
                                }))).then(function () {
                                  // TODO: due to using the search and value helps on the action dialog transient messages could appear
                                  // we need an UX design for those to show them to the user - for now remove them before continuing
                                  messageHandler.removeTransitionMessages(); // move parameter values from Dialog (SimpleForm) to mParameters.actionParameters so that they are available in the operation bindings for all contexts

                                  var vParameterValue;
                                  var oParameterContext = oOperationBinding && oOperationBinding.getParameterContext();

                                  for (var i in aActionParameters) {
                                    if (aActionParameters[i].$isCollection) {
                                      var aMVFContent = oDialog.getModel("mvfview").getProperty("/".concat(aActionParameters[i].$Name)),
                                          aKeyValues = [];

                                      for (var j in aMVFContent) {
                                        aKeyValues.push(aMVFContent[j].Key);
                                      }

                                      vParameterValue = aKeyValues;
                                    } else {
                                      vParameterValue = oParameterContext.getProperty(aActionParameters[i].$Name);
                                    }

                                    aActionParameters[i].value = vParameterValue;
                                    vParameterValue = undefined;
                                  }

                                  mParameters.label = sActionLabel;
                                  return _finallyRethrows(function () {
                                    return _catch(function () {
                                      var _mParameters$internal;

                                      mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal = mParameters.internalModelContext) === null || _mParameters$internal === void 0 ? void 0 : _mParameters$internal.setProperty("412Executed", false);
                                      return Promise.resolve(executeAPMAction(oAppComponent, mParameters, oParentControl, messageHandler, aContexts, oDialog, false)).then(function (aResult) {
                                        oDialog.close();
                                        resolve(aResult);
                                      });
                                    }, function (oError) {
                                      var _mParameters$internal2;

                                      var messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

                                      if (mParameters.internalModelContext && mParameters.internalModelContext.getProperty("412Executed") && (_mParameters$internal2 = mParameters.internalModelContext.getProperty("strictHandlingFails")) !== null && _mParameters$internal2 !== void 0 && _mParameters$internal2.length) {
                                        mParameters.internalModelContext.setProperty("DelayMessages", mParameters.internalModelContext.getProperty("DelayMessages").concat(messages));
                                      }

                                      throw oError;
                                    });
                                  }, function (_wasThrown2, _result5) {
                                    function _temp16() {
                                      if (BusyLocker.isLocked(oDialog)) {
                                        BusyLocker.unlock(oDialog);
                                      }

                                      if (_wasThrown2) throw _result5;
                                      return _result5;
                                    }

                                    var _temp15 = function () {
                                      var _mParameters$internal3;

                                      if (mParameters.internalModelContext && mParameters.internalModelContext.getProperty("412Executed") && (_mParameters$internal3 = mParameters.internalModelContext.getProperty("strictHandlingFails")) !== null && _mParameters$internal3 !== void 0 && _mParameters$internal3.length) {
                                        var _temp19 = _catch(function () {
                                          var strictHandlingFails = mParameters.internalModelContext.getProperty("strictHandlingFails");
                                          var aFailedContexts = [];
                                          strictHandlingFails.forEach(function (fail) {
                                            aFailedContexts.push(fail.oAction.getContext());
                                          });
                                          mParameters.aContexts = aFailedContexts;
                                          return Promise.resolve(executeAPMAction(oAppComponent, mParameters, oParentControl, messageHandler, aContexts, oDialog, true)).then(function (aResult) {
                                            mParameters.internalModelContext.setProperty("strictHandlingFails", []);
                                            mParameters.internalModelContext.setProperty("processedMessageIds", []);
                                            resolve(aResult);
                                          });
                                        }, function () {
                                          var _mParameters$internal4;

                                          if (mParameters.internalModelContext && mParameters.internalModelContext.getProperty("412Executed") && (_mParameters$internal4 = mParameters.internalModelContext.getProperty("strictHandlingFails")) !== null && _mParameters$internal4 !== void 0 && _mParameters$internal4.length) {
                                            Core.getMessageManager().addMessages(mParameters.internalModelContext.getProperty("DelayMessages"));
                                          }

                                          return Promise.resolve(messageHandler.showMessageDialog({
                                            isActionParameterDialogOpen: oDialog.isOpen(),
                                            onBeforeShowMessage: function (aMessages, showMessageParametersIn) {
                                              return actionParameterShowMessageCallback(mParameters, aContexts, oDialog, aMessages, showMessageParametersIn);
                                            }
                                          })).then(function () {});
                                        });

                                        if (_temp19 && _temp19.then) return _temp19.then(function () {});
                                      }
                                    }();

                                    return _temp15 && _temp15.then ? _temp15.then(_temp16) : _temp16(_temp15);
                                  });
                                });
                              }, function (oError) {
                                var showMessageDialog = true;
                                return Promise.resolve(messageHandler.showMessages({
                                  context: mParameters.aContexts[0],
                                  isActionParameterDialogOpen: oDialog.isOpen(),
                                  messagePageNavigationCallback: function () {
                                    oDialog.close();
                                  },
                                  onBeforeShowMessage: function (aMessages, showMessageParametersIn) {
                                    // Why is this implemented as callback? Apparently, all needed information is available beforehand
                                    // TODO: refactor accordingly
                                    var showMessageParameters = actionParameterShowMessageCallback(mParameters, aContexts, oDialog, aMessages, showMessageParametersIn);
                                    showMessageDialog = showMessageParameters.showMessageDialog;
                                    return showMessageParameters;
                                  }
                                })).then(function () {
                                  if (showMessageDialog) {
                                    reject(oError);
                                  }
                                }); // In case of backend validation error(s?), message shall not be shown in message dialog but next to the field on parameter dialog, which should
                                // stay open in this case => in this case, we must not resolve or reject the promise controlling the parameter dialog.
                                // In all other cases (e.g. other backend errors or user cancellation), the promise controlling the parameter dialog needs to be rejected to allow
                                // callers to react. (Example: If creation in backend after navigation to transient context fails, back navigation needs to be triggered)
                                // TODO: Refactor to separate dialog handling from backend request istead of taking decision based on message handling
                              });
                            }

                            if (aEmptyMandatoryFields.length) {
                              for (var i = 0; i < aEmptyMandatoryFields.length; i++) {
                                aEmptyMandatoryFields[i].getFields()[0].setValueState("Error");
                                aEmptyMandatoryFields[i].getFields()[0].setValueStateText(CommonUtils.getTranslatedText("C_OPERATIONS_ACTION_PARAMETER_DIALOG_MISSING_MANDATORY_MSG", oResourceBundle, aEmptyMandatoryFields[i].getLabel().getText()));
                              }

                              return;
                            }

                            aFieldInvalid = _validateMessages(aActionParameters, aFieldInvalid);

                            var _temp17 = function () {
                              if (aFieldInvalid.length > 0) {
                                return Promise.resolve(messageHandling.showUnboundMessages()).then(function () {
                                  _exit = true;
                                });
                              }
                            }();

                            return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
                          });
                        }, function (_wasThrown3, _result3) {
                          if (BusyLocker.isLocked(oDialog)) {
                            BusyLocker.unlock(oDialog);
                          }

                          if (_wasThrown3) throw _result3;
                          return _result3;
                        }));
                      } catch (e) {
                        return Promise.reject(e);
                      }
                    }
                  }),
                  endButton: new Button(generate(["fe", "APD_", sActionName, "Action", "Cancel"]), {
                    text: CommonUtils.getTranslatedText("C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL", oResourceBundle),
                    press: function () {
                      // TODO: cancel button should just close the dialog (similar to using escape). All wrap up tasks should be moved to afterClose.
                      // Assumption: _validateMessages is only called to remove exisitng validation messages (is user first enters invalid parameter, and later cancels).
                      // If this assumption is correct, this needs also to be done when leaving the dialog with escape, i.e. should be moved to afterClose.
                      _validateMessages(aActionParameters, aFieldInvalid, true);

                      oDialog.close(); // should not be done here, but after close, as the same should happen when leaving with escape

                      messageHandler.removeTransitionMessages();
                      reject(Constants.CancelActionDialog);
                    }
                  }),
                  // TODO: beforeOpen is just an event, i.e. not waiting for the Promise to be resolved. Check if tasks of this function need to be done before opening the dialog
                  // - if yes, they need to be moved outside.
                  // Assumption: Sometimes dialog can be seen without any fields for a short time - maybe this is caused by this asynchronity
                  beforeOpen: function (oEvent) {
                    try {
                      // clone event for actionWrapper as oEvent.oSource gets lost during processing of beforeOpen event handler
                      var oCloneEvent = Object.assign({}, oEvent);
                      messageHandler.removeTransitionMessages();

                      var getDefaultValuesFunction = function () {
                        var oMetaModel = oDialog.getModel().getMetaModel(),
                            sActionPath = oActionContext.sPath && oActionContext.sPath.split("/@")[0],
                            sDefaultValuesFunction = oMetaModel.getObject("".concat(sActionPath, "@com.sap.vocabularies.Common.v1.DefaultValuesFunction"));
                        return sDefaultValuesFunction;
                      };

                      var fnSetDefaultsAndOpenDialog = function (sBindingParameter) {
                        try {
                          var sBoundFunctionName = getDefaultValuesFunction();

                          var prefillParameter = function (sParamName, vParamDefaultValue) {
                            // eslint-disable-next-line promise/param-names
                            return new Promise(function (inResolve) {
                              try {
                                var _temp27 = function () {
                                  if (vParamDefaultValue !== undefined) {
                                    var _temp28 = function () {
                                      if (aContexts.length > 0 && vParamDefaultValue.$Path) {
                                        var _temp29 = _catch(function () {
                                          return Promise.resolve(CommonUtils.requestSingletonProperty(vParamDefaultValue.$Path, oOperationBinding.getModel())).then(function (vParamValue) {
                                            function _temp23() {
                                              if (aContexts.length > 1) {
                                                // For multi select, need to loop over aContexts (as contexts cannot be retrieved via binding parameter of the operation binding)
                                                var sPathForContext = vParamDefaultValue.$Path;

                                                if (sPathForContext.indexOf("".concat(sBindingParameter, "/")) === 0) {
                                                  sPathForContext = sPathForContext.replace("".concat(sBindingParameter, "/"), "");
                                                }

                                                for (var i = 1; i < aContexts.length; i++) {
                                                  if (aContexts[i].getProperty(sPathForContext) !== vParamValue) {
                                                    // if the values from the contexts are not all the same, do not prefill
                                                    inResolve({
                                                      paramName: sParamName,
                                                      value: undefined,
                                                      bNoPossibleValue: true
                                                    });
                                                  }
                                                }
                                              }

                                              inResolve({
                                                paramName: sParamName,
                                                value: vParamValue
                                              });
                                            }

                                            var _temp22 = function () {
                                              if (vParamValue === null) {
                                                return Promise.resolve(oOperationBinding.getParameterContext().requestProperty(vParamDefaultValue.$Path)).then(function (_oOperationBinding$ge) {
                                                  vParamValue = _oOperationBinding$ge;
                                                });
                                              }
                                            }();

                                            return _temp22 && _temp22.then ? _temp22.then(_temp23) : _temp23(_temp22);
                                          });
                                        }, function () {
                                          Log.error("Error while reading default action parameter", sParamName, mParameters.actionName);
                                          inResolve({
                                            paramName: sParamName,
                                            value: undefined,
                                            bLatePropertyError: true
                                          });
                                        });

                                        if (_temp29 && _temp29.then) return _temp29.then(function () {});
                                      } else {
                                        // Case 1.2: ParameterDefaultValue defines a fixed string value (i.e. vParamDefaultValue = 'someString')
                                        inResolve({
                                          paramName: sParamName,
                                          value: vParamDefaultValue
                                        });
                                      }
                                    }();

                                    if (_temp28 && _temp28.then) return _temp28.then(function () {});
                                  } else if (oParameterModel && oParameterModel.oData[sParamName]) {
                                    // Case 2: There is no ParameterDefaultValue annotation (=> look into the FLP User Defaults)
                                    inResolve({
                                      paramName: sParamName,
                                      value: oParameterModel.oData[sParamName]
                                    });
                                  } else {
                                    inResolve({
                                      paramName: sParamName,
                                      value: undefined
                                    });
                                  }
                                }();

                                // Case 1: There is a ParameterDefaultValue annotation
                                return Promise.resolve(_temp27 && _temp27.then ? _temp27.then(function () {}) : void 0);
                              } catch (e) {
                                return Promise.reject(e);
                              }
                            });
                          };

                          var getParameterDefaultValue = function (sParamName) {
                            var oMetaModel = oDialog.getModel().getMetaModel(),
                                sActionParameterAnnotationPath = CommonUtils.getParameterPath(oActionContext.getPath(), sParamName) + "@",
                                oParameterAnnotations = oMetaModel.getObject(sActionParameterAnnotationPath),
                                oParameterDefaultValue = oParameterAnnotations && oParameterAnnotations["@com.sap.vocabularies.UI.v1.ParameterDefaultValue"]; // either { $Path: 'somePath' } or 'someString'

                            return oParameterDefaultValue;
                          };

                          var aCurrentParamDefaultValue = [];
                          var sParamName, vParameterDefaultValue;

                          for (var i in aActionParameters) {
                            sParamName = aActionParameters[i].$Name;
                            vParameterDefaultValue = getParameterDefaultValue(sParamName);
                            aCurrentParamDefaultValue.push(prefillParameter(sParamName, vParameterDefaultValue));
                          }

                          if (oActionContext.getObject("$IsBound") && aContexts.length > 0) {
                            if (sBoundFunctionName && sBoundFunctionName.length > 0 && typeof sBoundFunctionName === "string") {
                              for (var _i2 in aContexts) {
                                aFunctionParams.push(callBoundFunction(sBoundFunctionName, aContexts[_i2], mParameters.model));
                              }
                            }
                          }

                          var aPrefillParamPromises = Promise.all(aCurrentParamDefaultValue);
                          var aExecFunctionPromises = Promise.resolve([]);
                          var oExecFunctionFromManifestPromise;

                          if (aFunctionParams && aFunctionParams.length > 0) {
                            aExecFunctionPromises = Promise.all(aFunctionParams);
                          }

                          if (mParameters.defaultValuesExtensionFunction) {
                            var sModule = mParameters.defaultValuesExtensionFunction.substring(0, mParameters.defaultValuesExtensionFunction.lastIndexOf(".") || -1).replace(/\./gi, "/"),
                                sFunctionName = mParameters.defaultValuesExtensionFunction.substring(mParameters.defaultValuesExtensionFunction.lastIndexOf(".") + 1, mParameters.defaultValuesExtensionFunction.length);
                            oExecFunctionFromManifestPromise = FPMHelper.actionWrapper(oCloneEvent, sModule, sFunctionName, {
                              "contexts": aContexts
                            });
                          }

                          var _temp21 = _catch(function () {
                            return Promise.resolve(Promise.all([aPrefillParamPromises, aExecFunctionPromises, oExecFunctionFromManifestPromise])).then(function (aPromises) {
                              var currentParamDefaultValue = aPromises[0];
                              var functionParams = aPromises[1];
                              var oFunctionParamsFromManifest = aPromises[2];
                              var sDialogParamName; // Fill the dialog with the earlier determined parameter values from the different sources

                              var _loop2 = function (_i3) {
                                var _aParameterValues$fin2;

                                sDialogParamName = aActionParameters[_i3].$Name; // Parameter values provided in the call of invokeAction overrule other sources

                                var vParameterProvidedValue = aParameterValues === null || aParameterValues === void 0 ? void 0 : (_aParameterValues$fin2 = aParameterValues.find(function (element) {
                                  return element.name === aActionParameters[_i3].$Name;
                                })) === null || _aParameterValues$fin2 === void 0 ? void 0 : _aParameterValues$fin2.value;

                                if (vParameterProvidedValue) {
                                  oOperationBinding.setParameter(aActionParameters[_i3].$Name, vParameterProvidedValue);
                                } else if (oFunctionParamsFromManifest && oFunctionParamsFromManifest.hasOwnProperty(sDialogParamName)) {
                                  oOperationBinding.setParameter(aActionParameters[_i3].$Name, oFunctionParamsFromManifest[sDialogParamName]);
                                } else if (currentParamDefaultValue[_i3] && currentParamDefaultValue[_i3].value !== undefined) {
                                  oOperationBinding.setParameter(aActionParameters[_i3].$Name, currentParamDefaultValue[_i3].value); // if the default value had not been previously determined due to different contexts, we do nothing else
                                } else if (sBoundFunctionName && !currentParamDefaultValue[_i3].bNoPossibleValue) {
                                  if (aContexts.length > 1) {
                                    // we check if the function retrieves the same param value for all the contexts:
                                    var j = 0;

                                    while (j < aContexts.length - 1) {
                                      if (functionParams[j] && functionParams[j + 1] && functionParams[j].getObject(sDialogParamName) === functionParams[j + 1].getObject(sDialogParamName)) {
                                        j++;
                                      } else {
                                        break;
                                      }
                                    } //param values are all the same:


                                    if (j === aContexts.length - 1) {
                                      oOperationBinding.setParameter(aActionParameters[_i3].$Name, functionParams[j].getObject(sDialogParamName));
                                    }
                                  } else if (functionParams[0] && functionParams[0].getObject(sDialogParamName)) {
                                    //Only one context, then the default param values are to be verified from the function:
                                    oOperationBinding.setParameter(aActionParameters[_i3].$Name, functionParams[0].getObject(sDialogParamName));
                                  }
                                }
                              };

                              for (var _i3 in aActionParameters) {
                                _loop2(_i3);
                              }

                              var bErrorFound = currentParamDefaultValue.some(function (oValue) {
                                if (oValue.bLatePropertyError) {
                                  return oValue.bLatePropertyError;
                                }
                              }); // If at least one Default Property is a Late Property and an eTag error was raised.

                              if (bErrorFound) {
                                var sText = CommonUtils.getTranslatedText("C_APP_COMPONENT_SAPFE_ETAG_LATE_PROPERTY", oResourceBundle);
                                MessageBox.warning(sText, {
                                  contentWidth: "25em"
                                });
                              }
                            });
                          }, function (oError) {
                            Log.error("Error while retrieving the parameter", oError);
                          });

                          return Promise.resolve(_temp21 && _temp21.then ? _temp21.then(function () {}) : void 0);
                        } catch (e) {
                          return Promise.reject(e);
                        }
                      };

                      var fnAsyncBeforeOpen = function () {
                        try {
                          var _temp32 = function () {
                            if (oActionContext.getObject("$IsBound") && aContexts.length > 0) {
                              var aParameters = oActionContext.getObject("$Parameter");
                              var sBindingParameter = aParameters[0] && aParameters[0].$Name;

                              var _temp33 = _catch(function () {
                                return Promise.resolve(aContexts[0].requestObject()).then(function (oContextObject) {
                                  if (oContextObject) {
                                    oOperationBinding.setParameter(sBindingParameter, oContextObject);
                                  }

                                  return Promise.resolve(fnSetDefaultsAndOpenDialog(sBindingParameter)).then(function () {});
                                });
                              }, function (oError) {
                                Log.error("Error while retrieving the parameter", oError);
                              });

                              if (_temp33 && _temp33.then) return _temp33.then(function () {});
                            } else {
                              return Promise.resolve(fnSetDefaultsAndOpenDialog()).then(function () {});
                            }
                          }();

                          return Promise.resolve(_temp32 && _temp32.then ? _temp32.then(function () {}) : void 0);
                        } catch (e) {
                          return Promise.reject(e);
                        }
                      };

                      return Promise.resolve(fnAsyncBeforeOpen()).then(function () {});
                    } catch (e) {
                      return Promise.reject(e);
                    }
                  },
                  afterClose: function () {
                    oDialog.destroy();
                  }
                });
                mParameters.oDialog = oDialog;
                aFormElements = oDialogContent.getAggregation("form").getAggregation("formContainers")[0].getAggregation("formElements");
                oDialog.setModel(oActionContext.getModel().oModel);
                oDialog.setModel(oParameterModel, "paramsModel");
                oDialog.bindElement({
                  path: "/",
                  model: "paramsModel"
                }); // empty model to add elements dynamically depending on number of MVF fields defined on the dialog

                var oMVFModel = new JSONModel({});
                oDialog.setModel(oMVFModel, "mvfview");
                var sActionPath = "".concat(sActionName, "(...)");

                if (!aContexts.length) {
                  sActionPath = "/".concat(sActionPath);
                }

                oDialog.bindElement({
                  path: sActionPath
                });

                if (oParentControl) {
                  // if there is a parent control specified add the dialog as dependent
                  oParentControl.addDependent(oDialog);
                }

                if (aContexts.length > 0) {
                  oDialog.setBindingContext(aContexts[0]); // use context of first selected line item
                }

                oOperationBinding = oDialog.getObjectBinding();
                oDialog.open();
              });
            });
          });
        }, function (oError) {
          reject(oError);
        });

        return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }

  function getActionParameters(oAction) {
    var aParameters = oAction.getObject("$Parameter") || [];

    if (aParameters && aParameters.length) {
      if (oAction.getObject("$IsBound")) {
        //in case of bound actions, ignore the first parameter and consider the rest
        return aParameters.slice(1, aParameters.length) || [];
      }
    }

    return aParameters;
  }

  function getIsActionCritical(oMetaModel, sPath, contexts, oBoundAction) {
    var vActionCritical = oMetaModel.getObject("".concat(sPath, "@com.sap.vocabularies.Common.v1.IsActionCritical"));
    var sCriticalPath = vActionCritical && vActionCritical.$Path;

    if (!sCriticalPath) {
      // the static value scenario for isActionCritical
      return !!vActionCritical;
    }

    var aBindingParams = oBoundAction && oBoundAction.getObject("$Parameter"),
        aPaths = sCriticalPath && sCriticalPath.split("/"),
        bCondition = aBindingParams && aBindingParams.length && typeof aBindingParams === "object" && sCriticalPath && contexts && contexts.length;

    if (bCondition) {
      //in case binding patameters are there in path need to remove eg: - _it/isVerified => need to remove _it and the path should be isVerified
      aBindingParams.filter(function (oParams) {
        var index = aPaths && aPaths.indexOf(oParams.$Name);

        if (index > -1) {
          aPaths.splice(index, 1);
        }
      });
      sCriticalPath = aPaths.join("/");
      return contexts[0].getObject(sCriticalPath);
    } else if (sCriticalPath) {
      //if scenario is path based return the path value
      return contexts[0].getObject(sCriticalPath);
    }
  }

  function _getActionParameterActionName(oResourceBundle, sActionLabel, sActionName, sEntitySetName) {
    var boundActionName = sActionName ? sActionName : null;
    var aActionName = boundActionName.split(".");
    boundActionName = boundActionName.indexOf(".") >= 0 ? aActionName[aActionName.length - 1] : boundActionName;
    var suffixResourceKey = boundActionName && sEntitySetName ? "".concat(sEntitySetName, "|").concat(boundActionName) : "";
    var sKey = "ACTION_PARAMETER_DIALOG_ACTION_NAME";
    var bResourceKeyExists = oResourceBundle && CommonUtils.checkIfResourceKeyExists(oResourceBundle.aCustomBundles, "".concat(sKey, "|").concat(suffixResourceKey));

    if (sActionLabel) {
      if (bResourceKeyExists) {
        return CommonUtils.getTranslatedText(sKey, oResourceBundle, null, suffixResourceKey);
      } else if (oResourceBundle && CommonUtils.checkIfResourceKeyExists(oResourceBundle.aCustomBundles, "".concat(sKey, "|").concat(sEntitySetName))) {
        return CommonUtils.getTranslatedText(sKey, oResourceBundle, null, "".concat(sEntitySetName));
      } else if (oResourceBundle && CommonUtils.checkIfResourceKeyExists(oResourceBundle.aCustomBundles, "".concat(sKey))) {
        return CommonUtils.getTranslatedText(sKey, oResourceBundle);
      } else {
        return sActionLabel;
      }
    } else {
      return CommonUtils.getTranslatedText("C_COMMON_DIALOG_OK", oResourceBundle);
    }
  }

  function handle412FailedTransitions(mParameters, oAction, sGroupId, current_context_index, iContextLength, messageHandler, oResourceBundle) {
    var _mParameters$internal5;

    if (mParameters.aContexts.length > 1) {
      var strictHandlingFails;
      var messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
      var processedMessageIds = mParameters.internalModelContext.getProperty("processedMessageIds");
      var transitionMessages = messages.filter(function (message) {
        var isDuplicate = processedMessageIds.find(function (id) {
          return message.getId() === id;
        });

        if (!isDuplicate) {
          processedMessageIds.push(message.getId());

          if (message.getType() === MessageType.Success) {
            mParameters.internalModelContext.setProperty("DelayMessages", mParameters.internalModelContext.getProperty("DelayMessages").concat(message));
          }
        }

        return message.getPersistent() === true && message.getType() !== MessageType.Success && !isDuplicate;
      });
      mParameters.internalModelContext.setProperty("processedMessageIds", processedMessageIds);

      if (transitionMessages.length) {
        if (mParameters.internalModelContext) {
          strictHandlingFails = mParameters.internalModelContext.getProperty("strictHandlingFails");
          strictHandlingFails.push({
            oAction: oAction,
            groupId: sGroupId
          });
          mParameters.internalModelContext.setProperty("strictHandlingFails", strictHandlingFails);
        }
      }
    }

    if (current_context_index === iContextLength && mParameters.internalModelContext && (_mParameters$internal5 = mParameters.internalModelContext.getProperty("412Messages")) !== null && _mParameters$internal5 !== void 0 && _mParameters$internal5.length) {
      operationsHelper.renderMessageView(mParameters, oResourceBundle, messageHandler, mParameters.internalModelContext.getProperty("412Messages"), true);
    }
  }

  function executeDependingOnSelectedContexts(oAction, mParameters, bGetBoundContext, sGroupId, oResourceBundle, messageHandler, iContextLength, current_context_index) {
    var oActionPromise,
        bEnableStrictHandling = true;

    if (bGetBoundContext) {
      var _oProperty$;

      var sPath = oAction.getBoundContext().getPath();
      var sMetaPath = oAction.getModel().getMetaModel().getMetaPath(sPath);
      var oProperty = oAction.getModel().getMetaModel().getObject(sMetaPath);

      if (oProperty && ((_oProperty$ = oProperty[0]) === null || _oProperty$ === void 0 ? void 0 : _oProperty$.$kind) !== "Action") {
        //do not enable the strict handling if its not an action
        bEnableStrictHandling = false;
      }
    }

    if (!bEnableStrictHandling) {
      oActionPromise = bGetBoundContext ? oAction.execute(sGroupId).then(function () {
        return oAction.getBoundContext();
      }) : oAction.execute(sGroupId);
    } else {
      oActionPromise = bGetBoundContext ? oAction.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(operations, sGroupId, mParameters, oResourceBundle, current_context_index, oAction.getContext(), iContextLength, messageHandler)).then(function () {
        handle412FailedTransitions(mParameters, oAction, sGroupId, current_context_index, iContextLength, messageHandler, oResourceBundle);
        return Promise.resolve(oAction.getBoundContext());
      }).catch(function () {
        handle412FailedTransitions(mParameters, oAction, sGroupId, current_context_index, iContextLength, messageHandler, oResourceBundle);
        return Promise.reject();
      }) : oAction.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(operations, sGroupId, mParameters, oResourceBundle, current_context_index, oAction.getContext(), iContextLength, messageHandler)).then(function (result) {
        handle412FailedTransitions(mParameters, oAction, sGroupId, current_context_index, iContextLength, messageHandler, oResourceBundle);
        return Promise.resolve(result);
      }).catch(function () {
        handle412FailedTransitions(mParameters, oAction, sGroupId, current_context_index, iContextLength, messageHandler, oResourceBundle);
        return Promise.reject();
      });
    }

    return oActionPromise.catch(function () {
      throw Constants.ActionExecutionFailed;
    });
  }

  function _executeAction(oAppComponent, mParameters, oParentControl, messageHandler) {
    var aContexts = mParameters.aContexts || [];
    var oModel = mParameters.model;
    var aActionParameters = mParameters.aActionParameters || [];
    var sActionName = mParameters.actionName;
    var fnOnSubmitted = mParameters.fnOnSubmitted;
    var fnOnResponse = mParameters.fnOnResponse;
    var oResourceBundle = oParentControl && oParentControl.isA("sap.ui.core.mvc.View") && oParentControl.getController().oResourceBundle;
    var oAction;

    function setActionParameterDefaultValue() {
      if (aActionParameters && aActionParameters.length) {
        for (var j = 0; j < aActionParameters.length; j++) {
          if (!aActionParameters[j].value) {
            switch (aActionParameters[j].$Type) {
              case "Edm.String":
                aActionParameters[j].value = "";
                break;

              case "Edm.Boolean":
                aActionParameters[j].value = false;
                break;

              case "Edm.Byte":
              case "Edm.Int16":
              case "Edm.Int32":
              case "Edm.Int64":
                aActionParameters[j].value = 0;
                break;
              // tbc

              default:
                break;
            }
          }

          oAction.setParameter(aActionParameters[j].$Name, aActionParameters[j].value);
        }
      }
    }

    if (aContexts.length) {
      // TODO: refactor to direct use of Promise.allSettled
      return new Promise(function (resolve) {
        var mBindingParameters = mParameters.mBindingParameters;
        var bGrouped = mParameters.bGrouped;
        var bGetBoundContext = mParameters.bGetBoundContext;

        if (mParameters.internalModelContext && !mParameters.internalModelContext.getProperty("412Executed")) {
          mParameters.internalModelContext.setProperty("strictHandlingPromises", []);
          mParameters.internalModelContext.setProperty("strictHandlingFails", []);
          mParameters.internalModelContext.setProperty("412Messages", []);
          mParameters.internalModelContext.setProperty("processedMessageIds", []);
          mParameters.internalModelContext.setProperty("DelayMessages", []);
        }

        var aActionPromises = [];
        var oActionPromise;
        var i;
        var sGroupId;

        var fnExecuteAction = function (actionContext, current_context_index, oSideEffect, iContextLength) {
          setActionParameterDefaultValue(); // For invocation grouping "isolated" need batch group per action call

          sGroupId = !bGrouped ? "$auto.".concat(current_context_index) : actionContext.getUpdateGroupId();
          mParameters.requestSideEffects = fnRequestSideEffects.bind(operations, oAppComponent, oSideEffect, mParameters);
          oActionPromise = executeDependingOnSelectedContexts(actionContext, mParameters, bGetBoundContext, sGroupId, oResourceBundle, messageHandler, iContextLength, current_context_index);
          aActionPromises.push(oActionPromise);
          fnRequestSideEffects(oAppComponent, oSideEffect, mParameters, sGroupId);
        };

        var fnExecuteSingleAction = function (actionContext, current_context_index, oSideEffect, iContextLength) {
          // eslint-disable-next-line promise/param-names
          return new Promise(function (actionResolve) {
            var aLocalPromise = [];
            setActionParameterDefaultValue(); // For invocation grouping "isolated" need batch group per action call

            sGroupId = "apiMode".concat(current_context_index);
            mParameters.requestSideEffects = fnRequestSideEffects.bind(operations, oAppComponent, oSideEffect, mParameters, sGroupId, aLocalPromise);
            oActionPromise = executeDependingOnSelectedContexts(actionContext, mParameters, bGetBoundContext, sGroupId, oResourceBundle, messageHandler, iContextLength, current_context_index);
            aActionPromises.push(oActionPromise);
            aLocalPromise.push(oActionPromise);
            fnRequestSideEffects(oAppComponent, oSideEffect, mParameters, sGroupId, aLocalPromise);
            oModel.submitBatch(sGroupId);
            Promise.all(aLocalPromise).then(function () {
              return actionResolve();
            }).catch(function () {
              return actionResolve();
            });
          });
        };

        function fnExecuteSequentially(contextsToExecute) {
          // One action and its side effects are completed before the next action is executed
          (fnOnSubmitted || function noop() {
            /**/
          })(aActionPromises);

          function processOneAction(context, actionIndex, iContextLength) {
            oAction = oModel.bindContext("".concat(sActionName, "(...)"), context, mBindingParameters);
            return fnExecuteSingleAction(oAction, actionIndex, {
              context: context,
              pathExpressions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.pathExpressions,
              triggerActions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.triggerActions
            }, iContextLength);
          }

          var oActionAndSideEffectPromise = Promise.resolve();
          var j = 0;
          contextsToExecute.forEach(function (context) {
            var id = ++j;
            oActionAndSideEffectPromise = oActionAndSideEffectPromise.then(function () {
              return processOneAction(context, id, aContexts.length);
            });
          });
          oActionAndSideEffectPromise.then(function () {
            fnHandleResults();
          }).catch(function (oError) {
            Log.error(oError);
          });
        }

        if (!bGrouped) {
          // For invocation grouping "isolated", ensure that each action and matching side effects
          // are processed before the next set is submitted. Workaround until JSON batch is available.
          // Allow also for List Report.
          fnExecuteSequentially(aContexts);
        } else {
          for (i = 0; i < aContexts.length; i++) {
            oAction = oModel.bindContext("".concat(sActionName, "(...)"), aContexts[i], mBindingParameters);
            fnExecuteAction(oAction, aContexts.length <= 1 ? null : i, {
              context: aContexts[i],
              pathExpressions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.pathExpressions,
              triggerActions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.triggerActions
            }, aContexts.length);
          }

          (fnOnSubmitted || function noop() {
            /**/
          })(aActionPromises);
          fnHandleResults();
        }

        function fnHandleResults() {
          // Promise.allSettled will never be rejected. However, eslint requires either catch or return - thus we return the resulting Promise although no one will use it.
          return Promise.allSettled(aActionPromises).then(resolve);
        }
      }).finally(function () {
        (fnOnResponse || function noop() {
          /**/
        })();
      });
    } else {
      oAction = oModel.bindContext("/".concat(sActionName, "(...)"));
      setActionParameterDefaultValue();
      var sGroupId = "actionImport";
      var oActionPromise = oAction.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(operations, sGroupId, {
        label: mParameters.label,
        model: oModel
      }, oResourceBundle, null, null, null, messageHandler));
      oModel.submitBatch(sGroupId); // trigger onSubmitted "event"

      (fnOnSubmitted || function noop() {
        /**/
      })(oActionPromise);
      return oActionPromise.finally(function () {
        (fnOnResponse || function noop() {
          /**/
        })();
      });
    }
  }

  function _getPath(oActionContext, sActionName) {
    var sPath = oActionContext.getPath();
    sPath = oActionContext.getObject("$IsBound") ? sPath.split("@$ui5.overload")[0] : sPath.split("/0")[0];
    return sPath.split("/".concat(sActionName))[0];
  }

  function _valuesProvidedForAllParameters(isCreateAction, actionParameters, parameterValues, startupParameters) {
    if (parameterValues) {
      // If showDialog is false but there are parameters from the invokeAction call, we need to check that values have been
      // provided for all of them
      var _iterator = _createForOfIteratorHelper(actionParameters),
          _step;

      try {
        var _loop3 = function () {
          var actionParameter = _step.value;

          if (actionParameter.$Name !== "ResultIsActiveEntity" && !(parameterValues !== null && parameterValues !== void 0 && parameterValues.find(function (element) {
            return element.name === actionParameter.$Name;
          }))) {
            // At least for one parameter no value has been provided, so we can't skip the dialog
            return {
              v: false
            };
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _ret = _loop3();

          if (typeof _ret === "object") return _ret.v;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else if (isCreateAction && startupParameters) {
      // If parameters have been provided during application launch, we need to check if the set is complete
      // If not, the parameter dialog still needs to be shown.
      var _iterator2 = _createForOfIteratorHelper(actionParameters),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var actionParameter = _step2.value;

          if (!startupParameters[actionParameter.$Name]) {
            // At least for one parameter no value has been provided, so we can't skip the dialog
            return false;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    return true;
  }

  function fnRequestSideEffects(oAppComponent, oSideEffect, mParameters, sGroupId, aLocalPromise) {
    var oSideEffectsService = oAppComponent.getSideEffectsService();
    var oLocalPromise; // trigger actions from side effects

    if (oSideEffect && oSideEffect.triggerActions && oSideEffect.triggerActions.length) {
      oSideEffect.triggerActions.forEach(function (sTriggerAction) {
        if (sTriggerAction) {
          oLocalPromise = oSideEffectsService.executeAction(sTriggerAction, oSideEffect.context, sGroupId);

          if (aLocalPromise) {
            aLocalPromise.push(oLocalPromise);
          }
        }
      });
    } // request side effects for this action
    // as we move the messages request to POST $select we need to be prepared for an empty array


    if (oSideEffect && oSideEffect.pathExpressions && oSideEffect.pathExpressions.length > 0) {
      oLocalPromise = oSideEffectsService.requestSideEffects(oSideEffect.pathExpressions, oSideEffect.context, sGroupId);

      if (aLocalPromise) {
        aLocalPromise.push(oLocalPromise);
      }

      oLocalPromise.then(function () {
        if (mParameters.operationAvailableMap && mParameters.internalModelContext) {
          ActionRuntime.setActionEnablement(mParameters.internalModelContext, JSON.parse(mParameters.operationAvailableMap), mParameters.selectedItems, "table");
        }
      }).catch(function (oError) {
        Log.error("Error while requesting side effects", oError);
      });
    }
  }
  /**
   * Static functions to call OData actions (bound/import) and functions (bound/import)
   *
   * @namespace
   * @alias sap.fe.core.actions.operations
   * @private
   * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
   * @since 1.56.0
   */


  var operations = {
    callBoundAction: callBoundAction,
    callActionImport: callActionImport,
    callBoundFunction: callBoundFunction,
    callFunctionImport: callFunctionImport,
    executeDependingOnSelectedContexts: executeDependingOnSelectedContexts,
    valuesProvidedForAllParameters: _valuesProvidedForAllParameters,
    getActionParameterActionName: _getActionParameterActionName,
    actionParameterShowMessageCallback: actionParameterShowMessageCallback,
    afterActionResolution: afterActionResolution
  };
  return operations;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiZmluYWxpemVyIiwiYmluZCIsImV4ZWN1dGVBUE1BY3Rpb24iLCJvQXBwQ29tcG9uZW50IiwibVBhcmFtZXRlcnMiLCJvUGFyZW50Q29udHJvbCIsIm1lc3NhZ2VIYW5kbGVyIiwiYUNvbnRleHRzIiwib0RpYWxvZyIsImFmdGVyNDEyIiwiX2V4ZWN1dGVBY3Rpb24iLCJhUmVzdWx0Iiwic29tZSIsIm9TaW5nbGVSZXN1bHQiLCJzdGF0dXMiLCJtZXNzYWdlcyIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldE1lc3NhZ2VNYW5hZ2VyIiwiZ2V0TWVzc2FnZU1vZGVsIiwiZ2V0RGF0YSIsImludGVybmFsTW9kZWxDb250ZXh0IiwiZ2V0UHJvcGVydHkiLCJsZW5ndGgiLCJzZXRQcm9wZXJ0eSIsImNvbmNhdCIsIkNvcmUiLCJhZGRNZXNzYWdlcyIsInNob3dNZXNzYWdlRGlhbG9nIiwib25CZWZvcmVTaG93TWVzc2FnZSIsImFNZXNzYWdlcyIsInNob3dNZXNzYWdlUGFyYW1ldGVyc0luIiwiYWN0aW9uUGFyYW1ldGVyU2hvd01lc3NhZ2VDYWxsYmFjayIsImlzQWN0aW9uUGFyYW1ldGVyRGlhbG9nT3BlbiIsImlzT3BlbiIsIkNvbnN0YW50cyIsIkZFTGlicmFyeSIsIkludm9jYXRpb25Hcm91cGluZyIsIkFjdGlvbiIsIk1lc3NhZ2VCb3giLCJjYWxsQm91bmRBY3Rpb24iLCJzQWN0aW9uTmFtZSIsImNvbnRleHRzIiwib01vZGVsIiwiUHJvbWlzZSIsInJlamVjdCIsImlzQ2FsbGVkV2l0aEFycmF5IiwiQXJyYXkiLCJpc0FycmF5Iiwib01ldGFNb2RlbCIsImdldE1ldGFNb2RlbCIsInNBY3Rpb25QYXRoIiwiZ2V0TWV0YVBhdGgiLCJnZXRQYXRoIiwib0JvdW5kQWN0aW9uIiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJpc0NyaXRpY2FsQWN0aW9uIiwiZ2V0SXNBY3Rpb25Dcml0aWNhbCIsImV4dHJhY3RTaW5nbGVSZXN1bHQiLCJ2YWx1ZSIsInJlYXNvbiIsImNhbGxBY3Rpb24iLCJjYWxsQWN0aW9uSW1wb3J0IiwiYmluZENvbnRleHQiLCJvQWN0aW9uSW1wb3J0IiwiZ2V0T2JqZWN0IiwiY2FsbEJvdW5kRnVuY3Rpb24iLCJzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsInNGdW5jdGlvblBhdGgiLCJvQm91bmRGdW5jdGlvbiIsIl9leGVjdXRlRnVuY3Rpb24iLCJjYWxsRnVuY3Rpb25JbXBvcnQiLCJyZXNvbHZlIiwib0Z1bmN0aW9uSW1wb3J0Iiwib0Z1bmN0aW9uIiwic0dyb3VwSWQiLCJFcnJvciIsIm9GdW5jdGlvblByb21pc2UiLCJleGVjdXRlIiwic3VibWl0QmF0Y2giLCJnZXRCb3VuZENvbnRleHQiLCJvQWN0aW9uIiwibUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMiLCJmbkRpYWxvZyIsIm9BY3Rpb25Qcm9taXNlIiwic0FjdGlvbkxhYmVsIiwibGFiZWwiLCJiU2tpcFBhcmFtZXRlckRpYWxvZyIsInNraXBQYXJhbWV0ZXJEaWFsb2ciLCJiSXNDcmVhdGVBY3Rpb24iLCJiSXNDcml0aWNhbEFjdGlvbiIsInNNZXRhUGF0aCIsInNNZXNzYWdlc1BhdGgiLCJpTWVzc2FnZVNpZGVFZmZlY3QiLCJiSXNTYW1lRW50aXR5Iiwib1JldHVyblR5cGUiLCJiVmFsdWVzUHJvdmlkZWRGb3JBbGxQYXJhbWV0ZXJzIiwiYWN0aW9uRGVmaW5pdGlvbiIsImFBY3Rpb25QYXJhbWV0ZXJzIiwiZ2V0QWN0aW9uUGFyYW1ldGVycyIsImJBY3Rpb25OZWVkc1BhcmFtZXRlckRpYWxvZyIsIiROYW1lIiwiYVBhcmFtZXRlclZhbHVlcyIsInBhcmFtZXRlclZhbHVlcyIsIm9Db21wb25lbnREYXRhIiwiZ2V0Q29tcG9uZW50RGF0YSIsIm9TdGFydHVwUGFyYW1ldGVycyIsInN0YXJ0dXBQYXJhbWV0ZXJzIiwiX3ZhbHVlc1Byb3ZpZGVkRm9yQWxsUGFyYW1ldGVycyIsInNob3dBY3Rpb25QYXJhbWV0ZXJEaWFsb2ciLCJjb25maXJtQ3JpdGljYWxBY3Rpb24iLCJmbk9uU3VibWl0dGVkIiwib25TdWJtaXR0ZWQiLCJmbk9uUmVzcG9uc2UiLCJvblJlc3BvbnNlIiwiYWN0aW9uTmFtZSIsIm1vZGVsIiwiYkdldEJvdW5kQ29udGV4dCIsImRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbiIsInNlbGVjdGVkSXRlbXMiLCJhZGRpdGlvbmFsU2lkZUVmZmVjdCIsInBhdGhFeHByZXNzaW9ucyIsImZpbmRJbmRleCIsImV4cCIsIiRpc0NvbGxlY3Rpb24iLCJnZXRNb2RlbCIsIiRUeXBlIiwibUJpbmRpbmdQYXJhbWV0ZXJzIiwiJHNlbGVjdCIsInNwbGl0IiwiaW5kZXhPZiIsInB1c2giLCJ0cmlnZ2VyQWN0aW9ucyIsInNwbGljZSIsImJHcm91cGVkIiwiaW52b2NhdGlvbkdyb3VwaW5nIiwiQ2hhbmdlU2V0Iiwib3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwiaXNDcmVhdGVBY3Rpb24iLCJiT2JqZWN0UGFnZSIsImNvbnRyb2xJZCIsImNvbnRyb2wiLCJwYXJlbnRDb250cm9sIiwiYnlJZCIsImlzU3RhdGljIiwiJFBhcmFtZXRlciIsImFQYXJhbWV0ZXIiLCIkRW50aXR5U2V0UGF0aCIsIiRJc0JvdW5kIiwiZW50aXR5U2V0TmFtZSIsIm9PcGVyYXRpb25SZXN1bHQiLCJhZnRlckFjdGlvblJlc29sdXRpb24iLCJjYXRjaCIsImkiLCJmaW5kIiwiZWxlbWVudCIsIm5hbWUiLCJzdHJpY3RIYW5kbGluZ0ZhaWxzIiwiYUZhaWxlZENvbnRleHRzIiwiZm9yRWFjaCIsImZhaWwiLCJnZXRDb250ZXh0Iiwib0ZhaWxlZE9wZXJhdGlvblJlc3VsdCIsIm9BY3Rpb25Db250ZXh0IiwiYm91bmRBY3Rpb25OYW1lIiwic3VmZml4UmVzb3VyY2VLZXkiLCJvUmVzb3VyY2VCdW5kbGUiLCJnZXRDb250cm9sbGVyIiwic0NvbmZpcm1hdGlvblRleHQiLCJDb21tb25VdGlscyIsImdldFRyYW5zbGF0ZWRUZXh0IiwiY29uZmlybSIsIm9uQ2xvc2UiLCJzQWN0aW9uIiwiT0siLCJvT3BlcmF0aW9uIiwib0Vycm9yIiwiQWN0aW9uUnVudGltZSIsInNldEFjdGlvbkVuYWJsZW1lbnQiLCJKU09OIiwicGFyc2UiLCJvQ29udHJvbCIsImlzQSIsImFTZWxlY3RlZENvbnRleHRzIiwiZ2V0U2VsZWN0ZWRDb250ZXh0cyIsInNob3dNZXNzYWdlQm94IiwidW5ib3VuZE1lc3NhZ2VzIiwiZmlsdGVyIiwibWVzc2FnZSIsImdldFRhcmdldCIsIkFQRG1lc3NhZ2VzIiwiYWN0aW9uUGFyYW0iLCJBUERNZXNzYWdlIiwiaXNBUERUYXJnZXQiLCJlcnJvclRhcmdldHNJbkFQRCIsImNsb3NlIiwiZGVzdHJveSIsImZpbHRlcmVkTWVzc2FnZXMiLCJiSXNBUERPcGVuIiwidW5kZWZpbmVkIiwiZm5HZXRNZXNzYWdlU3VidGl0bGUiLCJtZXNzYWdlSGFuZGxpbmciLCJzZXRNZXNzYWdlU3VidGl0bGUiLCJzUGF0aCIsIl9nZXRQYXRoIiwibWV0YU1vZGVsIiwiZW50aXR5U2V0Q29udGV4dCIsInNBY3Rpb25OYW1lUGF0aCIsImFjdGlvbk5hbWVDb250ZXh0Iiwic0ZyYWdtZW50TmFtZSIsIm9GcmFnbWVudCIsIlhNTFRlbXBsYXRlUHJvY2Vzc29yIiwibG9hZFRlbXBsYXRlIiwib1BhcmFtZXRlck1vZGVsIiwiSlNPTk1vZGVsIiwiJGRpc3BsYXlNb2RlIiwiYUZpZWxkSW52YWxpZCIsImFGb3JtRWxlbWVudHMiLCJtRmllbGRWYWx1ZU1hcCIsInZhbGlkYXRlUmVxdWlyZWRQcm9wZXJ0aWVzIiwiYWxsIiwib0Zvcm1FbGVtZW50Iiwib0ZpZWxkIiwiZ2V0RmllbGRzIiwiZ2V0UmVxdWlyZWQiLCJtYXAiLCJnZXRJdGVtcyIsImdldFZhbHVlIiwiYVJlc3VsdHMiLCJfdmFsaWRhdGVNZXNzYWdlcyIsImFjdGlvblBhcmFtZXRlcnMiLCJpbnZhbGlkRmllbGRzIiwiYkNsZWFyVGFyZ2V0Iiwib01lc3NhZ2VNYW5hZ2VyIiwib0FjdGlvblBhcmFtZXRlcnMiLCJzUGFyYW1ldGVyIiwib01lc3NhZ2UiLCJzUGFyYW0iLCJyZXBsYWNlIiwiY29udHJvbElkcyIsImdldENvbnRyb2xJZCIsImluY2x1ZGVzIiwicmVtb3ZlTWVzc2FnZXMiLCJ0YXJnZXQiLCJvQ29udHJvbGxlciIsImhhbmRsZUNoYW5nZSIsIm9FdmVudCIsInJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcyIsImdldFNvdXJjZSIsInNGaWVsZElkIiwiZ2V0UGFyYW1ldGVyIiwib0ZpZWxkUHJvbWlzZSIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJiaW5kaW5nQ29udGV4dHMiLCJhY3Rpb24iLCJlbnRpdHlTZXQiLCJtb2RlbHMiLCJjcmVhdGVkRnJhZ21lbnQiLCJhRnVuY3Rpb25QYXJhbXMiLCJvT3BlcmF0aW9uQmluZGluZyIsInNldFVzZXJEZWZhdWx0cyIsIkZyYWdtZW50IiwibG9hZCIsImRlZmluaXRpb24iLCJjb250cm9sbGVyIiwib0RpYWxvZ0NvbnRlbnQiLCJEaWFsb2ciLCJ0aXRsZSIsImNvbnRlbnQiLCJlc2NhcGVIYW5kbGVyIiwiQ2FuY2VsQWN0aW9uRGlhbG9nIiwiYmVnaW5CdXR0b24iLCJCdXR0b24iLCJnZW5lcmF0ZSIsInRleHQiLCJfZ2V0QWN0aW9uUGFyYW1ldGVyQWN0aW9uTmFtZSIsInR5cGUiLCJwcmVzcyIsImFFbXB0eU1hbmRhdG9yeUZpZWxkcyIsIkJ1c3lMb2NrZXIiLCJsb2NrIiwiT2JqZWN0Iiwia2V5cyIsInNLZXkiLCJ2UGFyYW1ldGVyVmFsdWUiLCJvUGFyYW1ldGVyQ29udGV4dCIsImdldFBhcmFtZXRlckNvbnRleHQiLCJhTVZGQ29udGVudCIsImFLZXlWYWx1ZXMiLCJqIiwiS2V5IiwiaXNMb2NrZWQiLCJ1bmxvY2siLCJzaG93TWVzc2FnZXMiLCJtZXNzYWdlUGFnZU5hdmlnYXRpb25DYWxsYmFjayIsInNob3dNZXNzYWdlUGFyYW1ldGVycyIsInNldFZhbHVlU3RhdGUiLCJzZXRWYWx1ZVN0YXRlVGV4dCIsImdldExhYmVsIiwiZ2V0VGV4dCIsInNob3dVbmJvdW5kTWVzc2FnZXMiLCJlbmRCdXR0b24iLCJiZWZvcmVPcGVuIiwib0Nsb25lRXZlbnQiLCJhc3NpZ24iLCJnZXREZWZhdWx0VmFsdWVzRnVuY3Rpb24iLCJzRGVmYXVsdFZhbHVlc0Z1bmN0aW9uIiwiZm5TZXREZWZhdWx0c0FuZE9wZW5EaWFsb2ciLCJzQmluZGluZ1BhcmFtZXRlciIsInNCb3VuZEZ1bmN0aW9uTmFtZSIsInByZWZpbGxQYXJhbWV0ZXIiLCJzUGFyYW1OYW1lIiwidlBhcmFtRGVmYXVsdFZhbHVlIiwiaW5SZXNvbHZlIiwiJFBhdGgiLCJyZXF1ZXN0U2luZ2xldG9uUHJvcGVydHkiLCJ2UGFyYW1WYWx1ZSIsInNQYXRoRm9yQ29udGV4dCIsInBhcmFtTmFtZSIsImJOb1Bvc3NpYmxlVmFsdWUiLCJyZXF1ZXN0UHJvcGVydHkiLCJMb2ciLCJlcnJvciIsImJMYXRlUHJvcGVydHlFcnJvciIsIm9EYXRhIiwiZ2V0UGFyYW1ldGVyRGVmYXVsdFZhbHVlIiwic0FjdGlvblBhcmFtZXRlckFubm90YXRpb25QYXRoIiwiZ2V0UGFyYW1ldGVyUGF0aCIsIm9QYXJhbWV0ZXJBbm5vdGF0aW9ucyIsIm9QYXJhbWV0ZXJEZWZhdWx0VmFsdWUiLCJhQ3VycmVudFBhcmFtRGVmYXVsdFZhbHVlIiwidlBhcmFtZXRlckRlZmF1bHRWYWx1ZSIsImFQcmVmaWxsUGFyYW1Qcm9taXNlcyIsImFFeGVjRnVuY3Rpb25Qcm9taXNlcyIsIm9FeGVjRnVuY3Rpb25Gcm9tTWFuaWZlc3RQcm9taXNlIiwic01vZHVsZSIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwiRlBNSGVscGVyIiwiYWN0aW9uV3JhcHBlciIsImFQcm9taXNlcyIsImN1cnJlbnRQYXJhbURlZmF1bHRWYWx1ZSIsImZ1bmN0aW9uUGFyYW1zIiwib0Z1bmN0aW9uUGFyYW1zRnJvbU1hbmlmZXN0Iiwic0RpYWxvZ1BhcmFtTmFtZSIsInZQYXJhbWV0ZXJQcm92aWRlZFZhbHVlIiwic2V0UGFyYW1ldGVyIiwiaGFzT3duUHJvcGVydHkiLCJiRXJyb3JGb3VuZCIsIm9WYWx1ZSIsInNUZXh0Iiwid2FybmluZyIsImNvbnRlbnRXaWR0aCIsImZuQXN5bmNCZWZvcmVPcGVuIiwiYVBhcmFtZXRlcnMiLCJyZXF1ZXN0T2JqZWN0Iiwib0NvbnRleHRPYmplY3QiLCJhZnRlckNsb3NlIiwiZ2V0QWdncmVnYXRpb24iLCJzZXRNb2RlbCIsImJpbmRFbGVtZW50IiwicGF0aCIsIm9NVkZNb2RlbCIsImFkZERlcGVuZGVudCIsInNldEJpbmRpbmdDb250ZXh0IiwiZ2V0T2JqZWN0QmluZGluZyIsIm9wZW4iLCJzbGljZSIsInZBY3Rpb25Dcml0aWNhbCIsInNDcml0aWNhbFBhdGgiLCJhQmluZGluZ1BhcmFtcyIsImFQYXRocyIsImJDb25kaXRpb24iLCJvUGFyYW1zIiwiaW5kZXgiLCJqb2luIiwic0VudGl0eVNldE5hbWUiLCJhQWN0aW9uTmFtZSIsImJSZXNvdXJjZUtleUV4aXN0cyIsImNoZWNrSWZSZXNvdXJjZUtleUV4aXN0cyIsImFDdXN0b21CdW5kbGVzIiwiaGFuZGxlNDEyRmFpbGVkVHJhbnNpdGlvbnMiLCJjdXJyZW50X2NvbnRleHRfaW5kZXgiLCJpQ29udGV4dExlbmd0aCIsInByb2Nlc3NlZE1lc3NhZ2VJZHMiLCJ0cmFuc2l0aW9uTWVzc2FnZXMiLCJpc0R1cGxpY2F0ZSIsImlkIiwiZ2V0SWQiLCJnZXRUeXBlIiwiTWVzc2FnZVR5cGUiLCJTdWNjZXNzIiwiZ2V0UGVyc2lzdGVudCIsImdyb3VwSWQiLCJvcGVyYXRpb25zSGVscGVyIiwicmVuZGVyTWVzc2FnZVZpZXciLCJleGVjdXRlRGVwZW5kaW5nT25TZWxlY3RlZENvbnRleHRzIiwiYkVuYWJsZVN0cmljdEhhbmRsaW5nIiwib1Byb3BlcnR5IiwiJGtpbmQiLCJmbk9uU3RyaWN0SGFuZGxpbmdGYWlsZWQiLCJvcGVyYXRpb25zIiwiQWN0aW9uRXhlY3V0aW9uRmFpbGVkIiwic2V0QWN0aW9uUGFyYW1ldGVyRGVmYXVsdFZhbHVlIiwiYUFjdGlvblByb21pc2VzIiwiZm5FeGVjdXRlQWN0aW9uIiwiYWN0aW9uQ29udGV4dCIsIm9TaWRlRWZmZWN0IiwiZ2V0VXBkYXRlR3JvdXBJZCIsInJlcXVlc3RTaWRlRWZmZWN0cyIsImZuUmVxdWVzdFNpZGVFZmZlY3RzIiwiZm5FeGVjdXRlU2luZ2xlQWN0aW9uIiwiYWN0aW9uUmVzb2x2ZSIsImFMb2NhbFByb21pc2UiLCJmbkV4ZWN1dGVTZXF1ZW50aWFsbHkiLCJjb250ZXh0c1RvRXhlY3V0ZSIsIm5vb3AiLCJwcm9jZXNzT25lQWN0aW9uIiwiYWN0aW9uSW5kZXgiLCJvQWN0aW9uQW5kU2lkZUVmZmVjdFByb21pc2UiLCJmbkhhbmRsZVJlc3VsdHMiLCJhbGxTZXR0bGVkIiwiZmluYWxseSIsImFjdGlvblBhcmFtZXRlciIsIm9TaWRlRWZmZWN0c1NlcnZpY2UiLCJnZXRTaWRlRWZmZWN0c1NlcnZpY2UiLCJvTG9jYWxQcm9taXNlIiwic1RyaWdnZXJBY3Rpb24iLCJleGVjdXRlQWN0aW9uIiwidmFsdWVzUHJvdmlkZWRGb3JBbGxQYXJhbWV0ZXJzIiwiZ2V0QWN0aW9uUGFyYW1ldGVyQWN0aW9uTmFtZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsib3BlcmF0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzb3VyY2VCdW5kbGUgZnJvbSBcInNhcC9iYXNlL2kxOG4vUmVzb3VyY2VCdW5kbGVcIjtcbmltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IEFjdGlvblJ1bnRpbWUgZnJvbSBcInNhcC9mZS9jb3JlL0FjdGlvblJ1bnRpbWVcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCBCdXN5TG9ja2VyIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9CdXN5TG9ja2VyXCI7XG5pbXBvcnQgbWVzc2FnZUhhbmRsaW5nIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9tZXNzYWdlSGFuZGxlci9tZXNzYWdlSGFuZGxpbmdcIjtcbmltcG9ydCBGUE1IZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvRlBNSGVscGVyXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5pbXBvcnQgRkVMaWJyYXJ5IGZyb20gXCJzYXAvZmUvY29yZS9saWJyYXJ5XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJzYXAvbS9CdXR0b25cIjtcbmltcG9ydCBEaWFsb2cgZnJvbSBcInNhcC9tL0RpYWxvZ1wiO1xuaW1wb3J0IE1lc3NhZ2VCb3ggZnJvbSBcInNhcC9tL01lc3NhZ2VCb3hcIjtcbmltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgRnJhZ21lbnQgZnJvbSBcInNhcC91aS9jb3JlL0ZyYWdtZW50XCI7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJzYXAvdWkvY29yZS9saWJyYXJ5XCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwic2FwL3VpL2NvcmUvbWVzc2FnZS9NZXNzYWdlXCI7XG5pbXBvcnQgWE1MUHJlcHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS91dGlsL1hNTFByZXByb2Nlc3NvclwiO1xuaW1wb3J0IFhNTFRlbXBsYXRlUHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS9YTUxUZW1wbGF0ZVByb2Nlc3NvclwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgb3BlcmF0aW9uc0hlbHBlciBmcm9tIFwiLi4vLi4vb3BlcmF0aW9uc0hlbHBlclwiO1xuaW1wb3J0IE1lc3NhZ2VIYW5kbGVyIGZyb20gXCIuLi9NZXNzYWdlSGFuZGxlclwiO1xuXG5jb25zdCBDb25zdGFudHMgPSBGRUxpYnJhcnkuQ29uc3RhbnRzLFxuXHRJbnZvY2F0aW9uR3JvdXBpbmcgPSBGRUxpYnJhcnkuSW52b2NhdGlvbkdyb3VwaW5nO1xuY29uc3QgQWN0aW9uID0gKE1lc3NhZ2VCb3ggYXMgYW55KS5BY3Rpb247XG5cbi8qKlxuICogQ2FsbHMgYSBib3VuZCBhY3Rpb24gZm9yIG9uZSBvciBtdWx0aXBsZSBjb250ZXh0cy5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBzdGF0aWNcbiAqIEBuYW1lIHNhcC5mZS5jb3JlLmFjdGlvbnMub3BlcmF0aW9ucy5jYWxsQm91bmRBY3Rpb25cbiAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5hY3Rpb25zLm9wZXJhdGlvbnNcbiAqIEBwYXJhbSBzQWN0aW9uTmFtZSBUaGUgbmFtZSBvZiB0aGUgYWN0aW9uIHRvIGJlIGNhbGxlZFxuICogQHBhcmFtIGNvbnRleHRzIEVpdGhlciBvbmUgY29udGV4dCBvciBhbiBhcnJheSB3aXRoIGNvbnRleHRzIGZvciB3aGljaCB0aGUgYWN0aW9uIGlzIHRvIGJlIGJlIGNhbGxlZFxuICogQHBhcmFtIG9Nb2RlbCBPRGF0YSBNb2RlbFxuICogQHBhcmFtIG9BcHBDb21wb25lbnQgVGhlIEFwcENvbXBvbmVudFxuICogQHBhcmFtIFttUGFyYW1ldGVyc10gT3B0aW9uYWwsIGNhbiBjb250YWluIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMucGFyYW1ldGVyVmFsdWVzXSBBIG1hcCBvZiBhY3Rpb24gcGFyYW1ldGVyIG5hbWVzIGFuZCBwcm92aWRlZCB2YWx1ZXNcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMubUJpbmRpbmdQYXJhbWV0ZXJzXSBBIG1hcCBvZiBiaW5kaW5nIHBhcmFtZXRlcnMgdGhhdCB3b3VsZCBiZSBwYXJ0IG9mICRzZWxlY3QgYW5kICRleHBhbmQgY29taW5nIGZyb20gc2lkZSBlZmZlY3RzIGZvciBib3VuZCBhY3Rpb25zXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0XSBBcnJheSBvZiBwcm9wZXJ0eSBwYXRocyB0byBiZSByZXF1ZXN0ZWQgaW4gYWRkaXRpb24gdG8gYWN0dWFsIHRhcmdldCBwcm9wZXJ0aWVzIG9mIHRoZSBzaWRlIGVmZmVjdFxuICogQHBhcmFtIFttUGFyYW1ldGVycy5zaG93QWN0aW9uUGFyYW1ldGVyRGlhbG9nXSBJZiBzZXQgYW5kIGlmIHBhcmFtZXRlcnMgZXhpc3QgdGhlIHVzZXIgcmV0cmlldmVzIGEgZGlhbG9nIHRvIGZpbGwgaW4gcGFyYW1ldGVycywgaWYgYWN0aW9uUGFyYW1ldGVycyBhcmUgcGFzc2VkIHRoZXkgYXJlIHNob3duIHRvIHRoZSB1c2VyXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmxhYmVsXSBBIGh1bWFuLXJlYWRhYmxlIGxhYmVsIGZvciB0aGUgYWN0aW9uXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmludm9jYXRpb25Hcm91cGluZ10gTW9kZSBob3cgYWN0aW9ucyBhcmUgdG8gYmUgY2FsbGVkOiBDaGFuZ2VzZXQgdG8gcHV0IGFsbCBhY3Rpb24gY2FsbHMgaW50byBvbmUgY2hhbmdlc2V0LCBJc29sYXRlZCB0byBwdXQgdGhlbSBpbnRvIHNlcGFyYXRlIGNoYW5nZXNldHMsIGRlZmF1bHRzIHRvIElzb2xhdGVkXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLm9uU3VibWl0dGVkXSBGdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgb25jZSB0aGUgYWN0aW9ucyBhcmUgc3VibWl0dGVkIHdpdGggYW4gYXJyYXkgb2YgcHJvbWlzZXNcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuZGVmYXVsdFBhcmFtZXRlcnNdIENhbiBjb250YWluIGRlZmF1bHQgcGFyYW1ldGVycyBmcm9tIEZMUCB1c2VyIGRlZmF1bHRzXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2xdIElmIHNwZWNpZmllZCwgdGhlIGRpYWxvZ3MgYXJlIGFkZGVkIGFzIGRlcGVuZGVudCBvZiB0aGUgcGFyZW50IGNvbnRyb2xcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuYkdldEJvdW5kQ29udGV4dF0gSWYgc3BlY2lmaWVkLCB0aGUgYWN0aW9uIHByb21pc2UgcmV0dXJucyB0aGUgYm91bmQgY29udGV4dFxuICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlcyB3aXRoIGFuIGFycmF5IG9mIHJlc3BvbnNlIG9iamVjdHMgKFRPRE86IHRvIGJlIGNoYW5nZWQpXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKi9cbmZ1bmN0aW9uIGNhbGxCb3VuZEFjdGlvbihzQWN0aW9uTmFtZTogc3RyaW5nLCBjb250ZXh0czogYW55LCBvTW9kZWw6IGFueSwgb0FwcENvbXBvbmVudDogb2JqZWN0LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdGlmICghY29udGV4dHMgfHwgY29udGV4dHMubGVuZ3RoID09PSAwKSB7XG5cdFx0Ly9JbiBGcmVlc3R5bGUgYXBwcyBib3VuZCBhY3Rpb25zIGNhbiBoYXZlIG5vIGNvbnRleHRcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJCb3VuZCBhY3Rpb25zIGFsd2F5cyByZXF1aXJlcyBhdCBsZWFzdCBvbmUgY29udGV4dFwiKTtcblx0fVxuXHQvLyB0aGlzIG1ldGhvZCBlaXRoZXIgYWNjZXB0cyBzaW5nbGUgY29udGV4dCBvciBhbiBhcnJheSBvZiBjb250ZXh0c1xuXHQvLyBUT0RPOiBSZWZhY3RvciB0byBhbiB1bmFtYmlndW9zIEFQSVxuXHRjb25zdCBpc0NhbGxlZFdpdGhBcnJheSA9IEFycmF5LmlzQXJyYXkoY29udGV4dHMpO1xuXG5cdC8vIGluIGNhc2Ugb2Ygc2luZ2xlIGNvbnRleHQgd3JhcCBpbnRvIGFuIGFycmF5IGZvciBjYWxsZWQgbWV0aG9kcyAoZXNwLiBjYWxsQWN0aW9uKVxuXHRtUGFyYW1ldGVycy5hQ29udGV4dHMgPSBpc0NhbGxlZFdpdGhBcnJheSA/IGNvbnRleHRzIDogW2NvbnRleHRzXTtcblxuXHRjb25zdCBvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdC8vIEFuYWx5emluZyBtZXRhTW9kZWxQYXRoIGZvciBhY3Rpb24gb25seSBmcm9tIGZpcnN0IGNvbnRleHQgc2VlbXMgd2VpcmQsIGJ1dCBwcm9iYWJseSB3b3JrcyBpbiBhbGwgZXhpc3Rpbmcgc3plbmFyaW9zIC0gaWYgc2V2ZXJhbCBjb250ZXh0cyBhcmUgcGFzc2VkLCB0aGV5IHByb2JhYmx5XG5cdFx0Ly8gYmVsb25nIHRvIHRoZSBzYW1lIG1ldGFtb2RlbHBhdGguIFRPRE86IENoZWNrLCB3aGV0aGVyIHRoaXMgY2FuIGJlIGltcHJvdmVkIC8gc3plbmFyaW9zIHdpdGggZGlmZmVyZW50IG1ldGFNb2RlbFBhdGhzIG1pZ2h0IGV4aXN0XG5cdFx0c0FjdGlvblBhdGggPSBgJHtvTWV0YU1vZGVsLmdldE1ldGFQYXRoKG1QYXJhbWV0ZXJzLmFDb250ZXh0c1swXS5nZXRQYXRoKCkpfS8ke3NBY3Rpb25OYW1lfWAsXG5cdFx0b0JvdW5kQWN0aW9uID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChgJHtzQWN0aW9uUGF0aH0vQCR1aTUub3ZlcmxvYWQvMGApO1xuXHRtUGFyYW1ldGVycy5pc0NyaXRpY2FsQWN0aW9uID0gZ2V0SXNBY3Rpb25Dcml0aWNhbChvTWV0YU1vZGVsLCBzQWN0aW9uUGF0aCwgbVBhcmFtZXRlcnMuYUNvbnRleHRzLCBvQm91bmRBY3Rpb24pO1xuXG5cdC8vIFByb21pc2UgcmV0dXJuZWQgYnkgY2FsbEFjdGlvbiBjdXJyZW50bHkgaXMgcmVqZWN0ZWQgaW4gY2FzZSBvZiBleGVjdXRpb24gZm9yIG11bHRpcGxlIGNvbnRleHRzIHBhcnRseSBmYWlsaW5nLiBUaGlzIHNob3VsZCBiZSBjaGFuZ2VkIChzb21lIGZhaWxpbmcgY29udGV4dHMgZG8gbm90IG1lYW5cblx0Ly8gdGhhdCBmdW5jdGlvbiBkaWQgbm90IGZ1bGZpbGwgaXRzIHRhc2spLCBidXQgYXMgdGhpcyBpcyBhIGJpZ2dlciByZWZhY3RvcmluZywgZm9yIHRoZSB0aW1lIGJlaW5nIHdlIG5lZWQgdG8gZGVhbCB3aXRoIHRoYXQgYXQgdGhlIGNhbGxpbmcgcGxhY2UgKGkuZS4gaGVyZSlcblx0Ly8gPT4gcHJvdmlkZSB0aGUgc2FtZSBoYW5kbGVyIChtYXBwaW5nIGJhY2sgZnJvbSBhcnJheSB0byBzaW5nbGUgcmVzdWx0L2Vycm9yIGlmIG5lZWRlZCkgZm9yIHJlc29sdmVkL3JlamVjdGVkIGNhc2Vcblx0Y29uc3QgZXh0cmFjdFNpbmdsZVJlc3VsdCA9IGZ1bmN0aW9uIChyZXN1bHQ6IGFueSkge1xuXHRcdC8vIHNpbmdsZSBhY3Rpb24gY291bGQgYmUgcmVzb2x2ZWQgb3IgcmVqZWN0ZWRcblx0XHRpZiAocmVzdWx0WzBdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuXHRcdFx0cmV0dXJuIHJlc3VsdFswXS52YWx1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSW4gY2FzZSBvZiBkaWFsb2cgY2FuY2VsbGF0aW9uLCBubyBhcnJheSBpcyByZXR1cm5lZCA9PiB0aHJvdyB0aGUgcmVzdWx0LlxuXHRcdFx0Ly8gSWRlYWxseSwgZGlmZmVyZW50aWF0aW5nIHNob3VsZCBub3QgYmUgbmVlZGVkIGhlcmUgPT4gVE9ETzogRmluZCBiZXR0ZXIgc29sdXRpb24gd2hlbiBzZXBhcmF0aW5nIGRpYWxvZyBoYW5kbGluZyAoc2luZ2xlIG9iamVjdCB3aXRoIHNpbmdsZSByZXN1bHQpIGZyb20gYmFja2VuZFxuXHRcdFx0Ly8gZXhlY3V0aW9uIChwb3RlbnRpYWxseSBtdWx0aXBsZSBvYmplY3RzKVxuXHRcdFx0dGhyb3cgcmVzdWx0WzBdLnJlYXNvbiB8fCByZXN1bHQ7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBjYWxsQWN0aW9uKHNBY3Rpb25OYW1lLCBvTW9kZWwsIG9Cb3VuZEFjdGlvbiwgb0FwcENvbXBvbmVudCwgbVBhcmFtZXRlcnMpLnRoZW4oXG5cdFx0KHJlc3VsdDogYW55KSA9PiB7XG5cdFx0XHRpZiAoaXNDYWxsZWRXaXRoQXJyYXkpIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBleHRyYWN0U2luZ2xlUmVzdWx0KHJlc3VsdCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQocmVzdWx0OiBhbnkpID0+IHtcblx0XHRcdGlmIChpc0NhbGxlZFdpdGhBcnJheSkge1xuXHRcdFx0XHR0aHJvdyByZXN1bHQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZXh0cmFjdFNpbmdsZVJlc3VsdChyZXN1bHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cbi8qKlxuICogQ2FsbHMgYW4gYWN0aW9uIGltcG9ydC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBzdGF0aWNcbiAqIEBuYW1lIHNhcC5mZS5jb3JlLmFjdGlvbnMub3BlcmF0aW9ucy5jYWxsQWN0aW9uSW1wb3J0XG4gKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuYWN0aW9ucy5vcGVyYXRpb25zXG4gKiBAcGFyYW0gc0FjdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjdGlvbiBpbXBvcnQgdG8gYmUgY2FsbGVkXG4gKiBAcGFyYW0gb01vZGVsIEFuIGluc3RhbmNlIG9mIGFuIE9EYXRhIFY0IG1vZGVsXG4gKiBAcGFyYW0gb0FwcENvbXBvbmVudCBUaGUgQXBwQ29tcG9uZW50XG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzXSBPcHRpb25hbCwgY2FuIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuICogQHBhcmFtIFttUGFyYW1ldGVycy5wYXJhbWV0ZXJWYWx1ZXNdIEEgbWFwIG9mIGFjdGlvbiBwYXJhbWV0ZXIgbmFtZXMgYW5kIHByb3ZpZGVkIHZhbHVlc1xuICogQHBhcmFtIFttUGFyYW1ldGVycy5sYWJlbF0gQSBodW1hbi1yZWFkYWJsZSBsYWJlbCBmb3IgdGhlIGFjdGlvblxuICogQHBhcmFtIFttUGFyYW1ldGVycy5zaG93QWN0aW9uUGFyYW1ldGVyRGlhbG9nXSBJZiBzZXQgYW5kIGlmIHBhcmFtZXRlcnMgZXhpc3QgdGhlIHVzZXIgcmV0cmlldmVzIGEgZGlhbG9nIHRvIGZpbGwgaW4gcGFyYW1ldGVycywgaWYgYWN0aW9uUGFyYW1ldGVycyBhcmUgcGFzc2VkIHRoZXkgYXJlIHNob3duIHRvIHRoZSB1c2VyXG4gKiBAcGFyYW0gW21QYXJhbWV0ZXJzLm9uU3VibWl0dGVkXSBGdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgb25jZSB0aGUgYWN0aW9ucyBhcmUgc3VibWl0dGVkIHdpdGggYW4gYXJyYXkgb2YgcHJvbWlzZXNcbiAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuZGVmYXVsdFBhcmFtZXRlcnNdIENhbiBjb250YWluIGRlZmF1bHQgcGFyYW1ldGVycyBmcm9tIEZMUCB1c2VyIGRlZmF1bHRzXG4gKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgcmVzcG9uc2Ugb2JqZWN0cyAoVE9ETzogdG8gYmUgY2hhbmdlZClcbiAqIEBwcml2YXRlXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuZnVuY3Rpb24gY2FsbEFjdGlvbkltcG9ydChzQWN0aW9uTmFtZTogc3RyaW5nLCBvTW9kZWw6IGFueSwgb0FwcENvbXBvbmVudDogb2JqZWN0LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdGlmICghb01vZGVsKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KFwiQWN0aW9uIGV4cGVjdHMgYSBtb2RlbC9jb250ZXh0IGZvciBleGVjdXRpb25cIik7XG5cdH1cblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRzQWN0aW9uUGF0aCA9IG9Nb2RlbC5iaW5kQ29udGV4dChgLyR7c0FjdGlvbk5hbWV9YCkuZ2V0UGF0aCgpLFxuXHRcdG9BY3Rpb25JbXBvcnQgPSBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KGAvJHtvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNBY3Rpb25QYXRoKS5nZXRPYmplY3QoXCIkQWN0aW9uXCIpfS8wYCk7XG5cdG1QYXJhbWV0ZXJzLmlzQ3JpdGljYWxBY3Rpb24gPSBnZXRJc0FjdGlvbkNyaXRpY2FsKG9NZXRhTW9kZWwsIGAke3NBY3Rpb25QYXRofS9AJHVpNS5vdmVybG9hZGApO1xuXHRyZXR1cm4gY2FsbEFjdGlvbihzQWN0aW9uTmFtZSwgb01vZGVsLCBvQWN0aW9uSW1wb3J0LCBvQXBwQ29tcG9uZW50LCBtUGFyYW1ldGVycyk7XG59XG5mdW5jdGlvbiBjYWxsQm91bmRGdW5jdGlvbihzRnVuY3Rpb25OYW1lOiBzdHJpbmcsIGNvbnRleHQ6IGFueSwgb01vZGVsOiBhbnkpIHtcblx0aWYgKCFjb250ZXh0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KFwiQm91bmQgZnVuY3Rpb25zIGFsd2F5cyByZXF1aXJlcyBhIGNvbnRleHRcIik7XG5cdH1cblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRzRnVuY3Rpb25QYXRoID0gYCR7b01ldGFNb2RlbC5nZXRNZXRhUGF0aChjb250ZXh0LmdldFBhdGgoKSl9LyR7c0Z1bmN0aW9uTmFtZX1gLFxuXHRcdG9Cb3VuZEZ1bmN0aW9uID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzRnVuY3Rpb25QYXRoKTtcblx0cmV0dXJuIF9leGVjdXRlRnVuY3Rpb24oc0Z1bmN0aW9uTmFtZSwgb01vZGVsLCBvQm91bmRGdW5jdGlvbiwgY29udGV4dCk7XG59XG4vKipcbiAqIENhbGxzIGEgZnVuY3Rpb24gaW1wb3J0LlxuICpcbiAqIEBmdW5jdGlvblxuICogQHN0YXRpY1xuICogQG5hbWUgc2FwLmZlLmNvcmUuYWN0aW9ucy5vcGVyYXRpb25zLmNhbGxGdW5jdGlvbkltcG9ydFxuICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLmFjdGlvbnMub3BlcmF0aW9uc1xuICogQHBhcmFtIHNGdW5jdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxuICogQHBhcmFtIG9Nb2RlbCBBbiBpbnN0YW5jZSBvZiBhbiBPRGF0YSB2NCBtb2RlbFxuICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlc1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2FsbEZ1bmN0aW9uSW1wb3J0KHNGdW5jdGlvbk5hbWU6IHN0cmluZywgb01vZGVsOiBhbnkpIHtcblx0aWYgKCFzRnVuY3Rpb25OYW1lKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG5cdGNvbnN0IG9NZXRhTW9kZWwgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCksXG5cdFx0c0Z1bmN0aW9uUGF0aCA9IG9Nb2RlbC5iaW5kQ29udGV4dChgLyR7c0Z1bmN0aW9uTmFtZX1gKS5nZXRQYXRoKCksXG5cdFx0b0Z1bmN0aW9uSW1wb3J0ID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChgLyR7b01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzRnVuY3Rpb25QYXRoKS5nZXRPYmplY3QoXCIkRnVuY3Rpb25cIil9LzBgKTtcblx0cmV0dXJuIF9leGVjdXRlRnVuY3Rpb24oc0Z1bmN0aW9uTmFtZSwgb01vZGVsLCBvRnVuY3Rpb25JbXBvcnQpO1xufVxuZnVuY3Rpb24gX2V4ZWN1dGVGdW5jdGlvbihzRnVuY3Rpb25OYW1lOiBhbnksIG9Nb2RlbDogYW55LCBvRnVuY3Rpb246IGFueSwgY29udGV4dD86IGFueSkge1xuXHRsZXQgc0dyb3VwSWQ7XG5cdGlmICghb0Z1bmN0aW9uIHx8ICFvRnVuY3Rpb24uZ2V0T2JqZWN0KCkpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBGdW5jdGlvbiAke3NGdW5jdGlvbk5hbWV9IG5vdCBmb3VuZGApKTtcblx0fVxuXHRpZiAoY29udGV4dCkge1xuXHRcdG9GdW5jdGlvbiA9IG9Nb2RlbC5iaW5kQ29udGV4dChgJHtzRnVuY3Rpb25OYW1lfSguLi4pYCwgY29udGV4dCk7XG5cdFx0c0dyb3VwSWQgPSBcImZ1bmN0aW9uR3JvdXBcIjtcblx0fSBlbHNlIHtcblx0XHRvRnVuY3Rpb24gPSBvTW9kZWwuYmluZENvbnRleHQoYC8ke3NGdW5jdGlvbk5hbWV9KC4uLilgKTtcblx0XHRzR3JvdXBJZCA9IFwiZnVuY3Rpb25JbXBvcnRcIjtcblx0fVxuXHRjb25zdCBvRnVuY3Rpb25Qcm9taXNlID0gb0Z1bmN0aW9uLmV4ZWN1dGUoc0dyb3VwSWQpO1xuXHRvTW9kZWwuc3VibWl0QmF0Y2goc0dyb3VwSWQpO1xuXHRyZXR1cm4gb0Z1bmN0aW9uUHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gb0Z1bmN0aW9uLmdldEJvdW5kQ29udGV4dCgpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIGNhbGxBY3Rpb24oc0FjdGlvbk5hbWU6IGFueSwgb01vZGVsOiBhbnksIG9BY3Rpb246IGFueSwgb0FwcENvbXBvbmVudDogYW55LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbiAocmVzb2x2ZTogKHZhbHVlOiBhbnkpID0+IHZvaWQsIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZCkge1xuXHRcdGxldCBtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVyczogYW55ID0ge307XG5cdFx0bGV0IGZuRGlhbG9nO1xuXHRcdGxldCBvQWN0aW9uUHJvbWlzZTtcblx0XHQvL2xldCBmYWlsZWRBY3Rpb25Qcm9taXNlOiBhbnk7XG5cdFx0Y29uc3Qgc0FjdGlvbkxhYmVsID0gbVBhcmFtZXRlcnMubGFiZWw7XG5cdFx0Y29uc3QgYlNraXBQYXJhbWV0ZXJEaWFsb2cgPSBtUGFyYW1ldGVycy5za2lwUGFyYW1ldGVyRGlhbG9nO1xuXHRcdGNvbnN0IGFDb250ZXh0cyA9IG1QYXJhbWV0ZXJzLmFDb250ZXh0cztcblx0XHRjb25zdCBiSXNDcmVhdGVBY3Rpb24gPSBtUGFyYW1ldGVycy5iSXNDcmVhdGVBY3Rpb247XG5cdFx0Y29uc3QgYklzQ3JpdGljYWxBY3Rpb24gPSBtUGFyYW1ldGVycy5pc0NyaXRpY2FsQWN0aW9uO1xuXHRcdGxldCBvTWV0YU1vZGVsO1xuXHRcdGxldCBzTWV0YVBhdGg7XG5cdFx0bGV0IHNNZXNzYWdlc1BhdGg6IGFueTtcblx0XHRsZXQgaU1lc3NhZ2VTaWRlRWZmZWN0O1xuXHRcdGxldCBiSXNTYW1lRW50aXR5O1xuXHRcdGxldCBvUmV0dXJuVHlwZTtcblx0XHRsZXQgYlZhbHVlc1Byb3ZpZGVkRm9yQWxsUGFyYW1ldGVycztcblx0XHRjb25zdCBhY3Rpb25EZWZpbml0aW9uID0gb0FjdGlvbi5nZXRPYmplY3QoKTtcblx0XHRpZiAoIW9BY3Rpb24gfHwgIW9BY3Rpb24uZ2V0T2JqZWN0KCkpIHtcblx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKGBBY3Rpb24gJHtzQWN0aW9uTmFtZX0gbm90IGZvdW5kYCkpO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0aGUgcGFyYW1ldGVycyBvZiB0aGUgYWN0aW9uXG5cdFx0Y29uc3QgYUFjdGlvblBhcmFtZXRlcnMgPSBnZXRBY3Rpb25QYXJhbWV0ZXJzKG9BY3Rpb24pO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIGFjdGlvbiBoYXMgcGFyYW1ldGVycyBhbmQgd291bGQgbmVlZCBhIHBhcmFtZXRlciBkaWFsb2dcblx0XHQvLyBUaGUgcGFyYW1ldGVyIFJlc3VsdElzQWN0aXZlRW50aXR5IGlzIGFsd2F5cyBoaWRkZW4gaW4gdGhlIGRpYWxvZyEgSGVuY2UgaWZcblx0XHQvLyB0aGlzIGlzIHRoZSBvbmx5IHBhcmFtZXRlciwgdGhpcyBpcyB0cmVhdGVkIGFzIG5vIHBhcmFtZXRlciBoZXJlIGJlY2F1c2UgdGhlXG5cdFx0Ly8gZGlhbG9nIHdvdWxkIGJlIGVtcHR5IVxuXHRcdGNvbnN0IGJBY3Rpb25OZWVkc1BhcmFtZXRlckRpYWxvZyA9XG5cdFx0XHRhQWN0aW9uUGFyYW1ldGVycy5sZW5ndGggPiAwICYmICEoYUFjdGlvblBhcmFtZXRlcnMubGVuZ3RoID09PSAxICYmIGFBY3Rpb25QYXJhbWV0ZXJzWzBdLiROYW1lID09PSBcIlJlc3VsdElzQWN0aXZlRW50aXR5XCIpO1xuXG5cdFx0Ly8gUHJvdmlkZWQgdmFsdWVzIGZvciB0aGUgYWN0aW9uIHBhcmFtZXRlcnMgZnJvbSBpbnZva2VBY3Rpb24gY2FsbFxuXHRcdGNvbnN0IGFQYXJhbWV0ZXJWYWx1ZXMgPSBtUGFyYW1ldGVycy5wYXJhbWV0ZXJWYWx1ZXM7XG5cblx0XHQvLyBEZXRlcm1pbmUgc3RhcnR1cCBwYXJhbWV0ZXJzIGlmIHByb3ZpZGVkXG5cdFx0Y29uc3Qgb0NvbXBvbmVudERhdGEgPSBvQXBwQ29tcG9uZW50LmdldENvbXBvbmVudERhdGEoKTtcblx0XHRjb25zdCBvU3RhcnR1cFBhcmFtZXRlcnMgPSAob0NvbXBvbmVudERhdGEgJiYgb0NvbXBvbmVudERhdGEuc3RhcnR1cFBhcmFtZXRlcnMpIHx8IHt9O1xuXG5cdFx0Ly8gSW4gY2FzZSBhbiBhY3Rpb24gcGFyYW1ldGVyIGlzIG5lZWRlZCwgYW5kIHdlIHNoYWxsIHNraXAgdGhlIGRpYWxvZywgY2hlY2sgaWYgdmFsdWVzIGFyZSBwcm92aWRlZCBmb3IgYWxsIHBhcmFtZXRlcnNcblx0XHRpZiAoYkFjdGlvbk5lZWRzUGFyYW1ldGVyRGlhbG9nICYmIGJTa2lwUGFyYW1ldGVyRGlhbG9nKSB7XG5cdFx0XHRiVmFsdWVzUHJvdmlkZWRGb3JBbGxQYXJhbWV0ZXJzID0gX3ZhbHVlc1Byb3ZpZGVkRm9yQWxsUGFyYW1ldGVycyhcblx0XHRcdFx0YklzQ3JlYXRlQWN0aW9uLFxuXHRcdFx0XHRhQWN0aW9uUGFyYW1ldGVycyxcblx0XHRcdFx0YVBhcmFtZXRlclZhbHVlcyxcblx0XHRcdFx0b1N0YXJ0dXBQYXJhbWV0ZXJzXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIERlcGVuZGluZyBvbiB0aGUgcHJldmlvdXNseSBkZXRlcm1pbmVkIGRhdGEsIGVpdGhlciBzZXQgYSBkaWFsb2cgb3IgbGVhdmUgaXQgZW1wdHkgd2hpY2hcblx0XHQvLyB3aWxsIGxlYWQgdG8gZGlyZWN0IGV4ZWN1dGlvbiBvZiB0aGUgYWN0aW9uIHdpdGhvdXQgYSBkaWFsb2dcblx0XHRmbkRpYWxvZyA9IG51bGw7XG5cdFx0aWYgKGJBY3Rpb25OZWVkc1BhcmFtZXRlckRpYWxvZykge1xuXHRcdFx0aWYgKCEoYlNraXBQYXJhbWV0ZXJEaWFsb2cgJiYgYlZhbHVlc1Byb3ZpZGVkRm9yQWxsUGFyYW1ldGVycykpIHtcblx0XHRcdFx0Zm5EaWFsb2cgPSBzaG93QWN0aW9uUGFyYW1ldGVyRGlhbG9nO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoYklzQ3JpdGljYWxBY3Rpb24pIHtcblx0XHRcdGZuRGlhbG9nID0gY29uZmlybUNyaXRpY2FsQWN0aW9uO1xuXHRcdH1cblxuXHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzID0ge1xuXHRcdFx0Zm5PblN1Ym1pdHRlZDogbVBhcmFtZXRlcnMub25TdWJtaXR0ZWQsXG5cdFx0XHRmbk9uUmVzcG9uc2U6IG1QYXJhbWV0ZXJzLm9uUmVzcG9uc2UsXG5cdFx0XHRhY3Rpb25OYW1lOiBzQWN0aW9uTmFtZSxcblx0XHRcdG1vZGVsOiBvTW9kZWwsXG5cdFx0XHRhQWN0aW9uUGFyYW1ldGVyczogYUFjdGlvblBhcmFtZXRlcnMsXG5cdFx0XHRiR2V0Qm91bmRDb250ZXh0OiBtUGFyYW1ldGVycy5iR2V0Qm91bmRDb250ZXh0LFxuXHRcdFx0ZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uOiBtUGFyYW1ldGVycy5kZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24sXG5cdFx0XHRsYWJlbDogbVBhcmFtZXRlcnMubGFiZWwsXG5cdFx0XHRzZWxlY3RlZEl0ZW1zOiBtUGFyYW1ldGVycy5zZWxlY3RlZEl0ZW1zXG5cdFx0fTtcblx0XHRpZiAob0FjdGlvbi5nZXRPYmplY3QoXCIkSXNCb3VuZFwiKSkge1xuXHRcdFx0aWYgKG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0ICYmIG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0LnBhdGhFeHByZXNzaW9ucykge1xuXHRcdFx0XHRvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHRcdFx0XHRzTWV0YVBhdGggPSBvTWV0YU1vZGVsLmdldE1ldGFQYXRoKGFDb250ZXh0c1swXS5nZXRQYXRoKCkpO1xuXHRcdFx0XHRzTWVzc2FnZXNQYXRoID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofS9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk1lc3NhZ2VzLyRQYXRoYCk7XG5cblx0XHRcdFx0aWYgKHNNZXNzYWdlc1BhdGgpIHtcblx0XHRcdFx0XHRpTWVzc2FnZVNpZGVFZmZlY3QgPSBtUGFyYW1ldGVycy5hZGRpdGlvbmFsU2lkZUVmZmVjdC5wYXRoRXhwcmVzc2lvbnMuZmluZEluZGV4KGZ1bmN0aW9uIChleHA6IGFueSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGVvZiBleHAgPT09IFwic3RyaW5nXCIgJiYgZXhwID09PSBzTWVzc2FnZXNQYXRoO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gQWRkIFNBUF9NZXNzYWdlcyBieSBkZWZhdWx0IGlmIG5vdCBhbm5vdGF0ZWQgYnkgc2lkZSBlZmZlY3RzLCBhY3Rpb24gZG9lcyBub3QgcmV0dXJuIGEgY29sbGVjdGlvbiBhbmRcblx0XHRcdFx0XHQvLyB0aGUgcmV0dXJuIHR5cGUgaXMgdGhlIHNhbWUgYXMgdGhlIGJvdW5kIHR5cGVcblx0XHRcdFx0XHRvUmV0dXJuVHlwZSA9IG9BY3Rpb24uZ2V0T2JqZWN0KFwiJFJldHVyblR5cGVcIik7XG5cdFx0XHRcdFx0YklzU2FtZUVudGl0eSA9XG5cdFx0XHRcdFx0XHRvUmV0dXJuVHlwZSAmJiAhb1JldHVyblR5cGUuJGlzQ29sbGVjdGlvbiAmJiBvQWN0aW9uLmdldE1vZGVsKCkuZ2V0T2JqZWN0KHNNZXRhUGF0aCkuJFR5cGUgPT09IG9SZXR1cm5UeXBlLiRUeXBlO1xuXG5cdFx0XHRcdFx0aWYgKGlNZXNzYWdlU2lkZUVmZmVjdCA+IC0xIHx8IGJJc1NhbWVFbnRpdHkpIHtcblx0XHRcdFx0XHRcdC8vIHRoZSBtZXNzYWdlIHBhdGggaXMgYW5ub3RhdGVkIGFzIHNpZGUgZWZmZWN0LiBBcyB0aGVyZSdzIG5vIGJpbmRpbmcgZm9yIGl0IGFuZCB0aGUgbW9kZWwgZG9lcyBjdXJyZW50bHkgbm90IGFsbG93XG5cdFx0XHRcdFx0XHQvLyB0byBhZGQgaXQgYXQgYSBsYXRlciBwb2ludCBvZiB0aW1lIHdlIGhhdmUgdG8gdGFrZSBjYXJlIGl0J3MgcGFydCBvZiB0aGUgJHNlbGVjdCBvZiB0aGUgUE9TVCwgdGhlcmVmb3JlIG1vdmluZyBpdC5cblx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLm1CaW5kaW5nUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzLm1CaW5kaW5nUGFyYW1ldGVycyB8fCB7fTtcblxuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRvQWN0aW9uLmdldE9iamVjdChgJFJldHVyblR5cGUvJFR5cGUvJHtzTWVzc2FnZXNQYXRofWApICYmXG5cdFx0XHRcdFx0XHRcdCghbVBhcmFtZXRlcnMubUJpbmRpbmdQYXJhbWV0ZXJzLiRzZWxlY3QgfHxcblx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5tQmluZGluZ1BhcmFtZXRlcnMuJHNlbGVjdC5zcGxpdChcIixcIikuaW5kZXhPZihzTWVzc2FnZXNQYXRoKSA9PT0gLTEpXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMubUJpbmRpbmdQYXJhbWV0ZXJzLiRzZWxlY3QgPSBtUGFyYW1ldGVycy5tQmluZGluZ1BhcmFtZXRlcnMuJHNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdD8gYCR7bVBhcmFtZXRlcnMubUJpbmRpbmdQYXJhbWV0ZXJzLiRzZWxlY3R9LCR7c01lc3NhZ2VzUGF0aH1gXG5cdFx0XHRcdFx0XHRcdFx0OiBzTWVzc2FnZXNQYXRoO1xuXHRcdFx0XHRcdFx0XHQvLyBBZGQgc2lkZSBlZmZlY3RzIGF0IGVudGl0eSBsZXZlbCBiZWNhdXNlICRzZWxlY3Qgc3RvcHMgdGhlc2UgYmVpbmcgcmV0dXJuZWQgYnkgdGhlIGFjdGlvblxuXHRcdFx0XHRcdFx0XHQvLyBPbmx5IGlmIG5vIG90aGVyIHNpZGUgZWZmZWN0cyB3ZXJlIGFkZGVkIGZvciBNZXNzYWdlc1xuXHRcdFx0XHRcdFx0XHRpZiAoaU1lc3NhZ2VTaWRlRWZmZWN0ID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0LnBhdGhFeHByZXNzaW9ucy5wdXNoKFwiKlwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChtUGFyYW1ldGVycy5hZGRpdGlvbmFsU2lkZUVmZmVjdC50cmlnZ2VyQWN0aW9ucy5sZW5ndGggPT09IDAgJiYgaU1lc3NhZ2VTaWRlRWZmZWN0ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBubyB0cmlnZ2VyIGFjdGlvbiB0aGVyZWZvcmUgbm8gbmVlZCB0byByZXF1ZXN0IG1lc3NhZ2VzIGFnYWluXG5cdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuYWRkaXRpb25hbFNpZGVFZmZlY3QucGF0aEV4cHJlc3Npb25zLnNwbGljZShpTWVzc2FnZVNpZGVFZmZlY3QsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmFDb250ZXh0cyA9IGFDb250ZXh0cztcblx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLm1CaW5kaW5nUGFyYW1ldGVycyA9IG1QYXJhbWV0ZXJzLm1CaW5kaW5nUGFyYW1ldGVycztcblx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0ID0gbVBhcmFtZXRlcnMuYWRkaXRpb25hbFNpZGVFZmZlY3Q7XG5cdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5iR3JvdXBlZCA9IG1QYXJhbWV0ZXJzLmludm9jYXRpb25Hcm91cGluZyA9PT0gSW52b2NhdGlvbkdyb3VwaW5nLkNoYW5nZVNldDtcblx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0ID0gbVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5vcGVyYXRpb25BdmFpbGFibGVNYXAgPSBtUGFyYW1ldGVycy5vcGVyYXRpb25BdmFpbGFibGVNYXA7XG5cdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5pc0NyZWF0ZUFjdGlvbiA9IGJJc0NyZWF0ZUFjdGlvbjtcblx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmJPYmplY3RQYWdlID0gbVBhcmFtZXRlcnMuYk9iamVjdFBhZ2U7XG5cdFx0XHRpZiAobVBhcmFtZXRlcnMuY29udHJvbElkKSB7XG5cdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmNvbnRyb2wgPSBtUGFyYW1ldGVycy5wYXJlbnRDb250cm9sLmJ5SWQobVBhcmFtZXRlcnMuY29udHJvbElkKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmNvbnRyb2wgPSBtUGFyYW1ldGVycy5wYXJlbnRDb250cm9sO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoYklzQ3JlYXRlQWN0aW9uKSB7XG5cdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5iSXNDcmVhdGVBY3Rpb24gPSBiSXNDcmVhdGVBY3Rpb247XG5cdFx0fVxuXHRcdC8vY2hlY2sgZm9yIHNraXBwaW5nIHN0YXRpYyBhY3Rpb25zXG5cdFx0Y29uc3QgaXNTdGF0aWMgPSAoYWN0aW9uRGVmaW5pdGlvbi4kUGFyYW1ldGVyIHx8IFtdKS5zb21lKChhUGFyYW1ldGVyOiBhbnkpID0+IHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdCgoYWN0aW9uRGVmaW5pdGlvbi4kRW50aXR5U2V0UGF0aCAmJiBhY3Rpb25EZWZpbml0aW9uLiRFbnRpdHlTZXRQYXRoID09PSBhUGFyYW1ldGVyLiROYW1lKSB8fCBhY3Rpb25EZWZpbml0aW9uLiRJc0JvdW5kKSAmJlxuXHRcdFx0XHRhUGFyYW1ldGVyLiRpc0NvbGxlY3Rpb25cblx0XHRcdCk7XG5cdFx0fSk7XG5cdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuaXNTdGF0aWMgPSBpc1N0YXRpYztcblx0XHRpZiAoZm5EaWFsb2cpIHtcblx0XHRcdG9BY3Rpb25Qcm9taXNlID0gZm5EaWFsb2coXG5cdFx0XHRcdHNBY3Rpb25OYW1lLFxuXHRcdFx0XHRvQXBwQ29tcG9uZW50LFxuXHRcdFx0XHRzQWN0aW9uTGFiZWwsXG5cdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLFxuXHRcdFx0XHRhQWN0aW9uUGFyYW1ldGVycyxcblx0XHRcdFx0YVBhcmFtZXRlclZhbHVlcyxcblx0XHRcdFx0b0FjdGlvbixcblx0XHRcdFx0bVBhcmFtZXRlcnMucGFyZW50Q29udHJvbCxcblx0XHRcdFx0bVBhcmFtZXRlcnMuZW50aXR5U2V0TmFtZSxcblx0XHRcdFx0bVBhcmFtZXRlcnMubWVzc2FnZUhhbmRsZXJcblx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gb0FjdGlvblByb21pc2Vcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKG9PcGVyYXRpb25SZXN1bHQ6IGFueSkge1xuXHRcdFx0XHRcdGFmdGVyQWN0aW9uUmVzb2x1dGlvbihtUGFyYW1ldGVycywgbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMsIGFjdGlvbkRlZmluaXRpb24pO1xuXHRcdFx0XHRcdHJlc29sdmUob09wZXJhdGlvblJlc3VsdCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob09wZXJhdGlvblJlc3VsdDogYW55KSB7XG5cdFx0XHRcdFx0cmVqZWN0KG9PcGVyYXRpb25SZXN1bHQpO1xuXHRcdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVGFrZSBvdmVyIGFsbCBwcm92aWRlZCBwYXJhbWV0ZXIgdmFsdWVzIGFuZCBjYWxsIHRoZSBhY3Rpb24uXG5cdFx0XHQvLyBUaGlzIHNoYWxsIG9ubHkgaGFwcGVuIGlmIHZhbHVlcyBhcmUgcHJvdmlkZWQgZm9yIGFsbCB0aGUgcGFyYW1ldGVycywgb3RoZXJ3aXNlIHRoZSBwYXJhbWV0ZXIgZGlhbG9nIHNoYWxsIGJlIHNob3duIHdoaWNoIGlzIGVuc3VyZWQgZWFybGllclxuXHRcdFx0aWYgKGFQYXJhbWV0ZXJWYWx1ZXMpIHtcblx0XHRcdFx0Zm9yIChjb25zdCBpIGluIG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmFBY3Rpb25QYXJhbWV0ZXJzKSB7XG5cdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuYUFjdGlvblBhcmFtZXRlcnNbaV0udmFsdWUgPSBhUGFyYW1ldGVyVmFsdWVzPy5maW5kKFxuXHRcdFx0XHRcdFx0KGVsZW1lbnQ6IGFueSkgPT4gZWxlbWVudC5uYW1lID09PSBtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5hQWN0aW9uUGFyYW1ldGVyc1tpXS4kTmFtZVxuXHRcdFx0XHRcdCk/LnZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKG9TdGFydHVwUGFyYW1ldGVycykge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGkgaW4gbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuYUFjdGlvblBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5hQWN0aW9uUGFyYW1ldGVyc1tpXS52YWx1ZSA9XG5cdFx0XHRcdFx0XHRvU3RhcnR1cFBhcmFtZXRlcnNbbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuYUFjdGlvblBhcmFtZXRlcnNbaV0uJE5hbWVdWzBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsZXQgb09wZXJhdGlvblJlc3VsdDogYW55O1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcIjQxMkV4ZWN1dGVkXCIsIGZhbHNlKTtcblx0XHRcdFx0b09wZXJhdGlvblJlc3VsdCA9IGF3YWl0IF9leGVjdXRlQWN0aW9uKFxuXHRcdFx0XHRcdG9BcHBDb21wb25lbnQsXG5cdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMsXG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMucGFyZW50Q29udHJvbCxcblx0XHRcdFx0XHRtUGFyYW1ldGVycy5tZXNzYWdlSGFuZGxlclxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2VzID0gc2FwLnVpLmdldENvcmUoKS5nZXRNZXNzYWdlTWFuYWdlcigpLmdldE1lc3NhZ2VNb2RlbCgpLmdldERhdGEoKTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0ICYmXG5cdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiKSAmJlxuXHRcdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiKT8ubGVuZ3RoXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFxuXHRcdFx0XHRcdFx0XCJEZWxheU1lc3NhZ2VzXCIsXG5cdFx0XHRcdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcIkRlbGF5TWVzc2FnZXNcIikuY29uY2F0KG1lc3NhZ2VzKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YWZ0ZXJBY3Rpb25SZXNvbHV0aW9uKG1QYXJhbWV0ZXJzLCBtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycywgYWN0aW9uRGVmaW5pdGlvbik7XG5cdFx0XHRcdHJlc29sdmUob09wZXJhdGlvblJlc3VsdCk7XG5cdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0cmVqZWN0KG9PcGVyYXRpb25SZXN1bHQpO1xuXHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0ICYmXG5cdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiKSAmJlxuXHRcdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiKT8ubGVuZ3RoXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zdCBzdHJpY3RIYW5kbGluZ0ZhaWxzID0gbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJzdHJpY3RIYW5kbGluZ0ZhaWxzXCIpO1xuXHRcdFx0XHRcdFx0Y29uc3QgYUZhaWxlZENvbnRleHRzID0gW10gYXMgYW55O1xuXHRcdFx0XHRcdFx0c3RyaWN0SGFuZGxpbmdGYWlscy5mb3JFYWNoKGZ1bmN0aW9uIChmYWlsOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0YUZhaWxlZENvbnRleHRzLnB1c2goZmFpbC5vQWN0aW9uLmdldENvbnRleHQoKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmFDb250ZXh0cyA9IGFGYWlsZWRDb250ZXh0cztcblx0XHRcdFx0XHRcdGNvbnN0IG9GYWlsZWRPcGVyYXRpb25SZXN1bHQgPSBhd2FpdCBfZXhlY3V0ZUFjdGlvbihcblx0XHRcdFx0XHRcdFx0b0FwcENvbXBvbmVudCxcblx0XHRcdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMsXG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wsXG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLm1lc3NhZ2VIYW5kbGVyXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Q29yZS5nZXRNZXNzYWdlTWFuYWdlcigpLmFkZE1lc3NhZ2VzKG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiRGVsYXlNZXNzYWdlc1wiKSk7XG5cdFx0XHRcdFx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nRmFpbHNcIiwgW10pO1xuXHRcdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJwcm9jZXNzZWRNZXNzYWdlSWRzXCIsIFtdKTtcblx0XHRcdFx0XHRcdGFmdGVyQWN0aW9uUmVzb2x1dGlvbihtUGFyYW1ldGVycywgbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMsIGFjdGlvbkRlZmluaXRpb24pO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShvRmFpbGVkT3BlcmF0aW9uUmVzdWx0KTtcblx0XHRcdFx0XHR9IGNhdGNoIChvRmFpbGVkT3BlcmF0aW9uUmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRyZWplY3Qob0ZhaWxlZE9wZXJhdGlvblJlc3VsdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdG1QYXJhbWV0ZXJzPy5tZXNzYWdlSGFuZGxlcj8uc2hvd01lc3NhZ2VEaWFsb2coKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuZnVuY3Rpb24gY29uZmlybUNyaXRpY2FsQWN0aW9uKFxuXHRzQWN0aW9uTmFtZTogYW55LFxuXHRvQXBwQ29tcG9uZW50OiBhbnksXG5cdHNBY3Rpb25MYWJlbDogYW55LFxuXHRtUGFyYW1ldGVyczogYW55LFxuXHRhQWN0aW9uUGFyYW1ldGVyczogYW55LFxuXHRhUGFyYW1ldGVyVmFsdWVzOiBhbnksXG5cdG9BY3Rpb25Db250ZXh0OiBhbnksXG5cdG9QYXJlbnRDb250cm9sOiBhbnksXG5cdGVudGl0eVNldE5hbWU6IGFueSxcblx0bWVzc2FnZUhhbmRsZXI6IGFueVxuKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0bGV0IGJvdW5kQWN0aW9uTmFtZSA9IHNBY3Rpb25OYW1lID8gc0FjdGlvbk5hbWUgOiBudWxsO1xuXHRcdGJvdW5kQWN0aW9uTmFtZSA9XG5cdFx0XHRib3VuZEFjdGlvbk5hbWUuaW5kZXhPZihcIi5cIikgPj0gMCA/IGJvdW5kQWN0aW9uTmFtZS5zcGxpdChcIi5cIilbYm91bmRBY3Rpb25OYW1lLnNwbGl0KFwiLlwiKS5sZW5ndGggLSAxXSA6IGJvdW5kQWN0aW9uTmFtZTtcblx0XHRjb25zdCBzdWZmaXhSZXNvdXJjZUtleSA9IGJvdW5kQWN0aW9uTmFtZSAmJiBlbnRpdHlTZXROYW1lID8gYCR7ZW50aXR5U2V0TmFtZX18JHtib3VuZEFjdGlvbk5hbWV9YCA6IFwiXCI7XG5cdFx0Y29uc3Qgb1Jlc291cmNlQnVuZGxlID0gb1BhcmVudENvbnRyb2wuZ2V0Q29udHJvbGxlcigpLm9SZXNvdXJjZUJ1bmRsZTtcblx0XHRjb25zdCBzQ29uZmlybWF0aW9uVGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XCJDX09QRVJBVElPTlNfQUNUSU9OX0NPTkZJUk1fTUVTU0FHRVwiLFxuXHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0bnVsbCxcblx0XHRcdHN1ZmZpeFJlc291cmNlS2V5XG5cdFx0KTtcblxuXHRcdE1lc3NhZ2VCb3guY29uZmlybShzQ29uZmlybWF0aW9uVGV4dCwge1xuXHRcdFx0b25DbG9zZTogYXN5bmMgZnVuY3Rpb24gKHNBY3Rpb246IGFueSkge1xuXHRcdFx0XHRpZiAoc0FjdGlvbiA9PT0gQWN0aW9uLk9LKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGNvbnN0IG9PcGVyYXRpb24gPSBhd2FpdCBfZXhlY3V0ZUFjdGlvbihvQXBwQ29tcG9uZW50LCBtUGFyYW1ldGVycywgb1BhcmVudENvbnRyb2wsIG1lc3NhZ2VIYW5kbGVyKTtcblx0XHRcdFx0XHRcdHJlc29sdmUob09wZXJhdGlvbik7XG5cdFx0XHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlRGlhbG9nKCk7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChvRXJyb3IpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3Qob0Vycm9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlQVBNQWN0aW9uKFxuXHRvQXBwQ29tcG9uZW50OiBhbnksXG5cdG1QYXJhbWV0ZXJzOiBhbnksXG5cdG9QYXJlbnRDb250cm9sOiBhbnksXG5cdG1lc3NhZ2VIYW5kbGVyOiBNZXNzYWdlSGFuZGxlcixcblx0YUNvbnRleHRzOiBhbnksXG5cdG9EaWFsb2c6IGFueSxcblx0YWZ0ZXI0MTI6IGJvb2xlYW5cbikge1xuXHRjb25zdCBhUmVzdWx0ID0gYXdhaXQgX2V4ZWN1dGVBY3Rpb24ob0FwcENvbXBvbmVudCwgbVBhcmFtZXRlcnMsIG9QYXJlbnRDb250cm9sLCBtZXNzYWdlSGFuZGxlcik7XG5cdC8vIElmIHNvbWUgZW50cmllcyB3ZXJlIHN1Y2Nlc3NmdWwsIGFuZCBvdGhlcnMgaGF2ZSBmYWlsZWQsIHRoZSBvdmVyYWxsIHByb2Nlc3MgaXMgc3RpbGwgc3VjY2Vzc2Z1bC4gSG93ZXZlciwgdGhpcyB3YXMgdHJlYXRlZCBhcyByZWplY3Rpb25cblx0Ly8gYmVmb3JlLCBhbmQgdGhpcyBjdXJyZW50bHkgaXMgc3RpbGwga2VwdCwgYXMgbG9uZyBhcyBkaWFsb2cgaGFuZGxpbmcgaXMgbWl4ZWQgd2l0aCBiYWNrZW5kIHByb2Nlc3MgaGFuZGxpbmcuXG5cdC8vIFRPRE86IFJlZmFjdG9yIHRvIG9ubHkgcmVqZWN0IGluIGNhc2Ugb2Ygb3ZlcmFsbCBwcm9jZXNzIGVycm9yLlxuXHQvLyBGb3IgdGhlIHRpbWUgYmVpbmc6IG1hcCB0byBvbGQgbG9naWMgdG8gcmVqZWN0IGlmIGF0IGxlYXN0IG9uZSBlbnRyeSBoYXMgZmFpbGVkXG5cdGlmIChhUmVzdWx0Py5zb21lKChvU2luZ2xlUmVzdWx0OiBhbnkpID0+IG9TaW5nbGVSZXN1bHQuc3RhdHVzID09PSBcInJlamVjdGVkXCIpKSB7XG5cdFx0dGhyb3cgYVJlc3VsdDtcblx0fVxuXG5cdGNvbnN0IG1lc3NhZ2VzID0gc2FwLnVpLmdldENvcmUoKS5nZXRNZXNzYWdlTWFuYWdlcigpLmdldE1lc3NhZ2VNb2RlbCgpLmdldERhdGEoKTtcblx0aWYgKFxuXHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0ICYmXG5cdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiKSAmJlxuXHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiKT8ubGVuZ3RoXG5cdCkge1xuXHRcdGlmICghYWZ0ZXI0MTIpIHtcblx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFxuXHRcdFx0XHRcIkRlbGF5TWVzc2FnZXNcIixcblx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJEZWxheU1lc3NhZ2VzXCIpLmNvbmNhdChtZXNzYWdlcylcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdENvcmUuZ2V0TWVzc2FnZU1hbmFnZXIoKS5hZGRNZXNzYWdlcyhtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcIkRlbGF5TWVzc2FnZXNcIikpO1xuXHRcdFx0aWYgKG1lc3NhZ2VzLmxlbmd0aCkge1xuXHRcdFx0XHQvLyBCT1VORCBUUkFOU0lUSU9OIEFTIFBBUlQgT0YgU0FQX01FU1NBR0Vcblx0XHRcdFx0bWVzc2FnZUhhbmRsZXIuc2hvd01lc3NhZ2VEaWFsb2coe1xuXHRcdFx0XHRcdG9uQmVmb3JlU2hvd01lc3NhZ2U6IGZ1bmN0aW9uIChhTWVzc2FnZXM6IGFueSwgc2hvd01lc3NhZ2VQYXJhbWV0ZXJzSW46IGFueSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGFjdGlvblBhcmFtZXRlclNob3dNZXNzYWdlQ2FsbGJhY2sobVBhcmFtZXRlcnMsIGFDb250ZXh0cywgb0RpYWxvZywgYU1lc3NhZ2VzLCBzaG93TWVzc2FnZVBhcmFtZXRlcnNJbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG5cdFx0Ly8gQk9VTkQgVFJBTlNJVElPTiBBUyBQQVJUIE9GIFNBUF9NRVNTQUdFXG5cdFx0bWVzc2FnZUhhbmRsZXIuc2hvd01lc3NhZ2VEaWFsb2coe1xuXHRcdFx0aXNBY3Rpb25QYXJhbWV0ZXJEaWFsb2dPcGVuOiBtUGFyYW1ldGVycz8ub0RpYWxvZy5pc09wZW4oKSxcblx0XHRcdG9uQmVmb3JlU2hvd01lc3NhZ2U6IGZ1bmN0aW9uIChhTWVzc2FnZXM6IGFueSwgc2hvd01lc3NhZ2VQYXJhbWV0ZXJzSW46IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gYWN0aW9uUGFyYW1ldGVyU2hvd01lc3NhZ2VDYWxsYmFjayhtUGFyYW1ldGVycywgYUNvbnRleHRzLCBvRGlhbG9nLCBhTWVzc2FnZXMsIHNob3dNZXNzYWdlUGFyYW1ldGVyc0luKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBhUmVzdWx0O1xufVxuXG5mdW5jdGlvbiBhZnRlckFjdGlvblJlc29sdXRpb24obVBhcmFtZXRlcnM6IGFueSwgbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnM6IGFueSwgYWN0aW9uRGVmaW5pdGlvbjogYW55KSB7XG5cdGlmIChcblx0XHRtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dCAmJlxuXHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLm9wZXJhdGlvbkF2YWlsYWJsZU1hcCAmJlxuXHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmFDb250ZXh0cyAmJlxuXHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmFDb250ZXh0cy5sZW5ndGggJiZcblx0XHRhY3Rpb25EZWZpbml0aW9uLiRJc0JvdW5kXG5cdCkge1xuXHRcdC8vY2hlY2sgZm9yIHNraXBwaW5nIHN0YXRpYyBhY3Rpb25zXG5cdFx0Y29uc3QgaXNTdGF0aWMgPSBtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5pc1N0YXRpYztcblx0XHRpZiAoIWlzU3RhdGljKSB7XG5cdFx0XHRBY3Rpb25SdW50aW1lLnNldEFjdGlvbkVuYWJsZW1lbnQoXG5cdFx0XHRcdG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LFxuXHRcdFx0XHRKU09OLnBhcnNlKG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLm9wZXJhdGlvbkF2YWlsYWJsZU1hcCksXG5cdFx0XHRcdG1QYXJhbWV0ZXJzLnNlbGVjdGVkSXRlbXMsXG5cdFx0XHRcdFwidGFibGVcIlxuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKG1BY3Rpb25FeGVjdXRpb25QYXJhbWV0ZXJzLmNvbnRyb2wpIHtcblx0XHRcdGNvbnN0IG9Db250cm9sID0gbUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuY29udHJvbDtcblx0XHRcdGlmIChvQ29udHJvbC5pc0EoXCJzYXAudWkubWRjLlRhYmxlXCIpKSB7XG5cdFx0XHRcdGNvbnN0IGFTZWxlY3RlZENvbnRleHRzID0gb0NvbnRyb2wuZ2V0U2VsZWN0ZWRDb250ZXh0cygpO1xuXHRcdFx0XHRBY3Rpb25SdW50aW1lLnNldEFjdGlvbkVuYWJsZW1lbnQoXG5cdFx0XHRcdFx0bUFjdGlvbkV4ZWN1dGlvblBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQsXG5cdFx0XHRcdFx0SlNPTi5wYXJzZShtQWN0aW9uRXhlY3V0aW9uUGFyYW1ldGVycy5vcGVyYXRpb25BdmFpbGFibGVNYXApLFxuXHRcdFx0XHRcdGFTZWxlY3RlZENvbnRleHRzLFxuXHRcdFx0XHRcdFwidGFibGVcIlxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhY3Rpb25QYXJhbWV0ZXJTaG93TWVzc2FnZUNhbGxiYWNrKFxuXHRtUGFyYW1ldGVyczogYW55LFxuXHRhQ29udGV4dHM6IGFueSxcblx0b0RpYWxvZzogYW55LFxuXHRtZXNzYWdlczogYW55LFxuXHRzaG93TWVzc2FnZVBhcmFtZXRlcnNJbjogeyBzaG93TWVzc2FnZUJveDogYm9vbGVhbjsgc2hvd01lc3NhZ2VEaWFsb2c6IGJvb2xlYW4gfVxuKTogeyBmbkdldE1lc3NhZ2VTdWJ0aXRsZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7IHNob3dNZXNzYWdlQm94OiBib29sZWFuOyBzaG93TWVzc2FnZURpYWxvZzogYm9vbGVhbjsgZmlsdGVyZWRNZXNzYWdlczogYW55W10gfSB7XG5cdGxldCBzaG93TWVzc2FnZUJveCA9IHNob3dNZXNzYWdlUGFyYW1ldGVyc0luLnNob3dNZXNzYWdlQm94LFxuXHRcdHNob3dNZXNzYWdlRGlhbG9nID0gc2hvd01lc3NhZ2VQYXJhbWV0ZXJzSW4uc2hvd01lc3NhZ2VEaWFsb2c7XG5cdGNvbnN0IG9Db250cm9sID0gbVBhcmFtZXRlcnMuY29udHJvbDtcblx0Y29uc3QgdW5ib3VuZE1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKGZ1bmN0aW9uIChtZXNzYWdlOiBhbnkpIHtcblx0XHRyZXR1cm4gbWVzc2FnZS5nZXRUYXJnZXQoKSA9PT0gXCJcIjtcblx0fSk7XG5cdGNvbnN0IEFQRG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKGZ1bmN0aW9uIChtZXNzYWdlOiBhbnkpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0bWVzc2FnZS5nZXRUYXJnZXQgJiZcblx0XHRcdG1lc3NhZ2UuZ2V0VGFyZ2V0KCkuaW5kZXhPZihtUGFyYW1ldGVycy5hY3Rpb25OYW1lKSAhPT0gLTEgJiZcblx0XHRcdG1QYXJhbWV0ZXJzLmFBY3Rpb25QYXJhbWV0ZXJzLnNvbWUoZnVuY3Rpb24gKGFjdGlvblBhcmFtOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2UuZ2V0VGFyZ2V0KCkuaW5kZXhPZihhY3Rpb25QYXJhbS4kTmFtZSkgIT09IC0xO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9KTtcblx0QVBEbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAoQVBETWVzc2FnZTogYW55KSB7XG5cdFx0QVBETWVzc2FnZS5pc0FQRFRhcmdldCA9IHRydWU7XG5cdH0pO1xuXG5cdGNvbnN0IGVycm9yVGFyZ2V0c0luQVBEID0gQVBEbWVzc2FnZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuXHRpZiAob0RpYWxvZy5pc09wZW4oKSAmJiBhQ29udGV4dHMubGVuZ3RoICE9PSAwICYmICFtUGFyYW1ldGVycy5pc1N0YXRpYykge1xuXHRcdGlmICghbVBhcmFtZXRlcnMuYkdyb3VwZWQpIHtcblx0XHRcdC8vaXNvbGF0ZWRcblx0XHRcdGlmIChhQ29udGV4dHMubGVuZ3RoID4gMSB8fCAhZXJyb3JUYXJnZXRzSW5BUEQpIHtcblx0XHRcdFx0Ly8gZG9lcyBub3QgbWF0dGVyIGlmIGVycm9yIGlzIGluIEFQRCBvciBub3QsIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb250ZXh0cyBzZWxlY3RlZCBvciBpZiB0aGUgZXJyb3IgaXMgbm90IHRoZSBBUEQsIHdlIGNsb3NlIGl0LlxuXHRcdFx0XHQvLyBUT0RPOiBEaWxhb2cgaGFuZGxpbmcgc2hvdWxkIG5vdCBiZSBwYXJ0IG9mIG1lc3NhZ2UgaGFuZGxpbmcuIFJlZmFjdG9yIGFjY29yZGluZ2x5IC0gZGlhbG9nIHNob3VsZCBub3QgYmUgbmVlZGVkIGluc2lkZSB0aGlzIG1ldGhvZCAtIG5laXRoZXJcblx0XHRcdFx0Ly8gdG8gYXNrIHdoZXRoZXIgaXQncyBvcGVuLCBub3IgdG8gY2xvc2UvZGVzdHJveSBpdCFcblx0XHRcdFx0b0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0XHRvRGlhbG9nLmRlc3Ryb3koKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCFlcnJvclRhcmdldHNJbkFQRCkge1xuXHRcdFx0Ly9jaGFuZ2VzZXRcblx0XHRcdG9EaWFsb2cuY2xvc2UoKTtcblx0XHRcdG9EaWFsb2cuZGVzdHJveSgpO1xuXHRcdH1cblx0fVxuXHRsZXQgZmlsdGVyZWRNZXNzYWdlczogYW55W10gPSBbXTtcblx0Y29uc3QgYklzQVBET3BlbiA9IG9EaWFsb2cuaXNPcGVuKCk7XG5cdGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDEgJiYgbWVzc2FnZXNbMF0uZ2V0VGFyZ2V0ICYmIG1lc3NhZ2VzWzBdLmdldFRhcmdldCgpICE9PSB1bmRlZmluZWQgJiYgbWVzc2FnZXNbMF0uZ2V0VGFyZ2V0KCkgIT09IFwiXCIpIHtcblx0XHRpZiAoKG9Db250cm9sICYmIG9Db250cm9sLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKSA9PT0gZmFsc2UpIHx8ICFvQ29udHJvbCkge1xuXHRcdFx0Ly8gT1AgZWRpdCBvciBMUlxuXHRcdFx0c2hvd01lc3NhZ2VCb3ggPSAhZXJyb3JUYXJnZXRzSW5BUEQ7XG5cdFx0XHRzaG93TWVzc2FnZURpYWxvZyA9IGZhbHNlO1xuXHRcdH0gZWxzZSBpZiAob0NvbnRyb2wgJiYgb0NvbnRyb2wuZ2V0TW9kZWwoXCJ1aVwiKS5nZXRQcm9wZXJ0eShcIi9pc0VkaXRhYmxlXCIpID09PSB0cnVlKSB7XG5cdFx0XHRzaG93TWVzc2FnZUJveCA9IGZhbHNlO1xuXHRcdFx0c2hvd01lc3NhZ2VEaWFsb2cgPSBmYWxzZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAob0NvbnRyb2wpIHtcblx0XHRpZiAob0NvbnRyb2wuZ2V0TW9kZWwoXCJ1aVwiKS5nZXRQcm9wZXJ0eShcIi9pc0VkaXRhYmxlXCIpID09PSBmYWxzZSkge1xuXHRcdFx0aWYgKGJJc0FQRE9wZW4gJiYgZXJyb3JUYXJnZXRzSW5BUEQpIHtcblx0XHRcdFx0c2hvd01lc3NhZ2VEaWFsb2cgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9Db250cm9sLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKSA9PT0gdHJ1ZSkge1xuXHRcdFx0aWYgKCFiSXNBUERPcGVuICYmIGVycm9yVGFyZ2V0c0luQVBEKSB7XG5cdFx0XHRcdHNob3dNZXNzYWdlRGlhbG9nID0gdHJ1ZTtcblx0XHRcdFx0ZmlsdGVyZWRNZXNzYWdlcyA9IHVuYm91bmRNZXNzYWdlcy5jb25jYXQoQVBEbWVzc2FnZXMpO1xuXHRcdFx0fSBlbHNlIGlmICghYklzQVBET3BlbiAmJiB1bmJvdW5kTWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdC8vIGVycm9yIHRhcmdldHMgaW4gQVBEID0+IHRoZXJlIGlzIGF0bGVhc3Qgb25lIGJvdW5kIG1lc3NhZ2UuIElmIHRoZXJlIGFyZSB1bmJvdW5kIG1lc3NhZ2VzLCBkaWFsb2cgbXVzdCBiZSBzaG93bi5cblx0XHRcdFx0Ly8gZm9yIGRyYWZ0IGVudGl0eSwgd2UgYWxyZWFkeSBjbG9zZWQgdGhlIEFQRFxuXHRcdFx0XHRzaG93TWVzc2FnZURpYWxvZyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0c2hvd01lc3NhZ2VCb3g6IHNob3dNZXNzYWdlQm94LFxuXHRcdHNob3dNZXNzYWdlRGlhbG9nOiBzaG93TWVzc2FnZURpYWxvZyxcblx0XHRmaWx0ZXJlZE1lc3NhZ2VzOiBmaWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aCA/IGZpbHRlcmVkTWVzc2FnZXMgOiBtZXNzYWdlcyxcblx0XHRmbkdldE1lc3NhZ2VTdWJ0aXRsZTpcblx0XHRcdG9Db250cm9sICYmIG9Db250cm9sLmlzQShcInNhcC51aS5tZGMuVGFibGVcIikgJiYgbWVzc2FnZUhhbmRsaW5nLnNldE1lc3NhZ2VTdWJ0aXRsZS5iaW5kKHt9LCBvQ29udHJvbCwgYUNvbnRleHRzKVxuXHR9O1xufVxuXG4vKlxuICogQ3VycmVudGx5LCB0aGlzIG1ldGhvZCBpcyByZXNwb25zaWJsZSBmb3Igc2hvd2luZyB0aGUgZGlhbG9nIGFuZCBleGVjdXRpbmcgdGhlIGFjdGlvbi4gVGhlIHByb21pc2UgcmV0dXJuZWQgaXMgcGVuZGluZyB3aGlsZSB3YWl0aW5nIGZvciB1c2VyIGlucHV0LCBhcyB3ZWxsIGFzIHdoaWxlIHRoZVxuICogYmFjay1lbmQgcmVxdWVzdCBpcyBydW5uaW5nLiBUaGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aGVuIHRoZSB1c2VyIGNhbmNlbHMgdGhlIGRpYWxvZyBhbmQgYWxzbyB3aGVuIHRoZSBiYWNrLWVuZCByZXF1ZXN0IGZhaWxzLlxuICogVE9ETzogUmVmYWN0b3Jpbmc6IFNlcGFyYXRlIGRpYWxvZyBoYW5kbGluZyBmcm9tIGJhY2tlbmQgcHJvY2Vzc2luZy4gRGlhbG9nIGhhbmRsaW5nIHNob3VsZCByZXR1cm4gYSBQcm9taXNlIHJlc29sdmluZyB0byBwYXJhbWV0ZXJzIHRvIGJlIHByb3ZpZGVkIHRvIGJhY2tlbmQuIElmIGRpYWxvZyBpc1xuICogY2FuY2VsbGVkLCB0aGF0IHByb21pc2UgY2FuIGJlIHJlamVjdGVkLiBNZXRob2QgcmVzcG9uc2libGUgZm9yIGJhY2tlbmQgcHJvY2Vzc2luZyBuZWVkIHRvIGRlYWwgd2l0aCBtdWx0aXBsZSBjb250ZXh0cyAtIGkuZS4gaXQgc2hvdWxkIGVpdGhlciByZXR1cm4gYW4gYXJyYXkgb2YgUHJvbWlzZXMgb3JcbiAqIGEgUHJvbWlzZSByZXNvbHZpbmcgdG8gYW4gYXJyYXkuIEluIHRoZSBsYXR0ZXIgY2FzZSwgdGhhdCBQcm9taXNlIHNob3VsZCBiZSByZXNvbHZlZCBhbHNvIHdoZW4gc29tZSBvciBldmVuIGFsbCBjb250ZXh0cyBmYWlsZWQgaW4gYmFja2VuZCAtIHRoZSBvdmVyYWxsIHByb2Nlc3Mgc3RpbGwgd2FzXG4gKiBzdWNjZXNzZnVsLlxuICpcbiAqL1xuXG5mdW5jdGlvbiBzaG93QWN0aW9uUGFyYW1ldGVyRGlhbG9nKFxuXHRzQWN0aW9uTmFtZTogYW55LFxuXHRvQXBwQ29tcG9uZW50OiBhbnksXG5cdHNBY3Rpb25MYWJlbDogYW55LFxuXHRtUGFyYW1ldGVyczogYW55LFxuXHRhQWN0aW9uUGFyYW1ldGVyczogYW55LFxuXHRhUGFyYW1ldGVyVmFsdWVzOiBhbnksXG5cdG9BY3Rpb25Db250ZXh0OiBhbnksXG5cdG9QYXJlbnRDb250cm9sOiBhbnksXG5cdGVudGl0eVNldE5hbWU6IGFueSxcblx0bWVzc2FnZUhhbmRsZXI6IGFueVxuKSB7XG5cdGNvbnN0IHNQYXRoID0gX2dldFBhdGgob0FjdGlvbkNvbnRleHQsIHNBY3Rpb25OYW1lKSxcblx0XHRtZXRhTW9kZWwgPSBvQWN0aW9uQ29udGV4dC5nZXRNb2RlbCgpLm9Nb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRlbnRpdHlTZXRDb250ZXh0ID0gbWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNQYXRoKSxcblx0XHRzQWN0aW9uTmFtZVBhdGggPSBvQWN0aW9uQ29udGV4dC5nZXRPYmplY3QoXCIkSXNCb3VuZFwiKVxuXHRcdFx0PyBvQWN0aW9uQ29udGV4dC5nZXRQYXRoKCkuc3BsaXQoXCIvQCR1aTUub3ZlcmxvYWQvMFwiKVswXVxuXHRcdFx0OiBvQWN0aW9uQ29udGV4dC5nZXRQYXRoKCkuc3BsaXQoXCIvMFwiKVswXSxcblx0XHRhY3Rpb25OYW1lQ29udGV4dCA9IG1ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzQWN0aW9uTmFtZVBhdGgpLFxuXHRcdGJJc0NyZWF0ZUFjdGlvbiA9IG1QYXJhbWV0ZXJzLmlzQ3JlYXRlQWN0aW9uLFxuXHRcdHNGcmFnbWVudE5hbWUgPSBcInNhcC9mZS9jb3JlL2NvbnRyb2xzL0FjdGlvblBhcmFtZXRlckRpYWxvZ1wiO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdGNvbnN0IG9GcmFnbWVudCA9IFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShzRnJhZ21lbnROYW1lLCBcImZyYWdtZW50XCIpO1xuXHRcdGNvbnN0IG9QYXJhbWV0ZXJNb2RlbCA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0JGRpc3BsYXlNb2RlOiB7fVxuXHRcdH0pO1xuXHRcdGxldCBhRmllbGRJbnZhbGlkOiBhbnlbXSA9IFtdO1xuXHRcdGxldCBhRm9ybUVsZW1lbnRzOiBhbnlbXSA9IFtdO1xuXHRcdGNvbnN0IG1GaWVsZFZhbHVlTWFwOiBhbnkgPSB7fTtcblx0XHRjb25zdCB2YWxpZGF0ZVJlcXVpcmVkUHJvcGVydGllcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnN0IGFSZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdGFGb3JtRWxlbWVudHNcblx0XHRcdFx0XHQuZmlsdGVyKGZ1bmN0aW9uIChvRm9ybUVsZW1lbnQ6IGFueSkge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb0ZpZWxkID0gb0Zvcm1FbGVtZW50LmdldEZpZWxkcygpWzBdO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9GaWVsZC5nZXRSZXF1aXJlZCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm1hcChmdW5jdGlvbiAob0Zvcm1FbGVtZW50OiBhbnkpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gb0Zvcm1FbGVtZW50LmdldEZpZWxkcygpWzBdLmlzQShcInNhcC51aS5tZGMuTXVsdGlWYWx1ZUZpZWxkXCIpXG5cdFx0XHRcdFx0XHRcdD8gb0Zvcm1FbGVtZW50LmdldEZpZWxkcygpWzBdLmdldEl0ZW1zKClcblx0XHRcdFx0XHRcdFx0OiBvRm9ybUVsZW1lbnQuZ2V0RmllbGRzKClbMF0uZ2V0VmFsdWUoKTtcblx0XHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiIHx8IChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAhdmFsdWUubGVuZ3RoKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0Zvcm1FbGVtZW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIGFSZXN1bHRzLmZpbHRlcihmdW5jdGlvbiAocmVzdWx0OiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdCAhPT0gdW5kZWZpbmVkO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb25zdCBfdmFsaWRhdGVNZXNzYWdlcyA9IGZ1bmN0aW9uIChhY3Rpb25QYXJhbWV0ZXJzOiBhbnksIGludmFsaWRGaWVsZHM6IGFueSwgYkNsZWFyVGFyZ2V0PzogYm9vbGVhbikge1xuXHRcdFx0Y29uc3Qgb01lc3NhZ2VNYW5hZ2VyID0gQ29yZS5nZXRNZXNzYWdlTWFuYWdlcigpO1xuXHRcdFx0Y29uc3QgYU1lc3NhZ2VzID0gb01lc3NhZ2VNYW5hZ2VyLmdldE1lc3NhZ2VNb2RlbCgpLmdldERhdGEoKTtcblxuXHRcdFx0aW52YWxpZEZpZWxkcyA9IGludmFsaWRGaWVsZHMgfHwgW107XG5cblx0XHRcdGlmICghYU1lc3NhZ2VzLmxlbmd0aCkge1xuXHRcdFx0XHRpbnZhbGlkRmllbGRzID0gW107XG5cdFx0XHR9XG5cdFx0XHRhY3Rpb25QYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9BY3Rpb25QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRcdFx0Y29uc3Qgc1BhcmFtZXRlciA9IG9BY3Rpb25QYXJhbWV0ZXJzLiROYW1lO1xuXHRcdFx0XHRhTWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAob01lc3NhZ2U6IGFueSkge1xuXHRcdFx0XHRcdGNvbnN0IHNQYXJhbSA9IHNQYXJhbWV0ZXIucmVwbGFjZShcIi1pbm5lclwiLCBcIlwiKTtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvTWVzc2FnZS5jb250cm9sSWRzLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHRcdChvTWVzc2FnZS5nZXRDb250cm9sSWQoKS5pbmNsdWRlcyhgQVBEXzo6JHtzUGFyYW1ldGVyfWApIHx8XG5cdFx0XHRcdFx0XHRcdChvTWVzc2FnZS5nZXRDb250cm9sSWQoKS5pbmNsdWRlcyhgQVBEXzo6JHtzUGFyYW1ldGVyfWlubmVyYCkgJiYgaW52YWxpZEZpZWxkcy5pbmRleE9mKGBBUERfOjoke3NQYXJhbX1gKSA8IDApKVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0aWYgKGJDbGVhclRhcmdldCkge1xuXHRcdFx0XHRcdFx0XHRvTWVzc2FnZU1hbmFnZXIucmVtb3ZlTWVzc2FnZXMob01lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aW52YWxpZEZpZWxkcy5wdXNoKGBBUERfOjoke3NQYXJhbX1gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gSGFuZGxlIG1lc3NhZ2VzIHJlbGF0ZWQgdG8gaW5wdXQgd2l0aCBpbnZhbGlkIHRva2VuXG5cdFx0XHRcdFx0aWYgKG9NZXNzYWdlLnRhcmdldC5pbmNsdWRlcyhgQVBEXzo6JHtzUGFyYW1ldGVyfWApKSB7XG5cdFx0XHRcdFx0XHRpbnZhbGlkRmllbGRzLnB1c2goYEFQRF86OiR7c1BhcmFtfWApO1xuXHRcdFx0XHRcdFx0b01lc3NhZ2UudGFyZ2V0ID0gYkNsZWFyVGFyZ2V0ID8gXCJcIiA6IG9NZXNzYWdlLnRhcmdldDtcblx0XHRcdFx0XHRcdGlmIChiQ2xlYXJUYXJnZXQpIHtcblx0XHRcdFx0XHRcdFx0b01lc3NhZ2VNYW5hZ2VyLnJlbW92ZU1lc3NhZ2VzKG9NZXNzYWdlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaW52YWxpZEZpZWxkcztcblx0XHR9O1xuXHRcdGNvbnN0IG9Db250cm9sbGVyID0ge1xuXHRcdFx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbiAob0V2ZW50OiBhbnkpIHtcblx0XHRcdFx0bWVzc2FnZUhhbmRsZXIucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0XHRcdGNvbnN0IG9GaWVsZCA9IG9FdmVudC5nZXRTb3VyY2UoKTtcblx0XHRcdFx0Y29uc3Qgc0ZpZWxkSWQgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiaWRcIik7XG5cdFx0XHRcdGNvbnN0IG9GaWVsZFByb21pc2UgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwicHJvbWlzZVwiKTtcblx0XHRcdFx0aWYgKG9GaWVsZFByb21pc2UpIHtcblx0XHRcdFx0XHRtRmllbGRWYWx1ZU1hcFtzRmllbGRJZF0gPSBvRmllbGRQcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9GaWVsZC5nZXRWYWx1ZSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF92YWxpZGF0ZU1lc3NhZ2VzKGFBY3Rpb25QYXJhbWV0ZXJzLCBhRmllbGRJbnZhbGlkKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNyZWF0ZWRGcmFnbWVudCA9IGF3YWl0IFhNTFByZXByb2Nlc3Nvci5wcm9jZXNzKFxuXHRcdFx0XHRvRnJhZ21lbnQsXG5cdFx0XHRcdHsgbmFtZTogc0ZyYWdtZW50TmFtZSB9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XHRhY3Rpb246IG9BY3Rpb25Db250ZXh0LFxuXHRcdFx0XHRcdFx0YWN0aW9uTmFtZTogYWN0aW9uTmFtZUNvbnRleHQsXG5cdFx0XHRcdFx0XHRlbnRpdHlTZXQ6IGVudGl0eVNldENvbnRleHRcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFx0YWN0aW9uOiBvQWN0aW9uQ29udGV4dC5nZXRNb2RlbCgpLFxuXHRcdFx0XHRcdFx0YWN0aW9uTmFtZTogYWN0aW9uTmFtZUNvbnRleHQuZ2V0TW9kZWwoKSxcblx0XHRcdFx0XHRcdGVudGl0eVNldDogZW50aXR5U2V0Q29udGV4dC5nZXRNb2RlbCgpLFxuXHRcdFx0XHRcdFx0bWV0YU1vZGVsOiBlbnRpdHlTZXRDb250ZXh0LmdldE1vZGVsKClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0XHQvLyBUT0RPOiBtb3ZlIHRoZSBkaWFsb2cgaW50byB0aGUgZnJhZ21lbnQgYW5kIG1vdmUgdGhlIGhhbmRsZXJzIHRvIHRoZSBvQ29udHJvbGxlclxuXHRcdFx0Y29uc3QgYUNvbnRleHRzOiBhbnlbXSA9IG1QYXJhbWV0ZXJzLmFDb250ZXh0cyB8fCBbXTtcblx0XHRcdGNvbnN0IGFGdW5jdGlvblBhcmFtczogYW55W10gPSBbXTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3Rcblx0XHRcdGxldCBvT3BlcmF0aW9uQmluZGluZzogYW55O1xuXHRcdFx0YXdhaXQgQ29tbW9uVXRpbHMuc2V0VXNlckRlZmF1bHRzKG9BcHBDb21wb25lbnQsIGFBY3Rpb25QYXJhbWV0ZXJzLCBvUGFyYW1ldGVyTW9kZWwsIHRydWUpO1xuXHRcdFx0Y29uc3Qgb0RpYWxvZ0NvbnRlbnQgPSAoYXdhaXQgRnJhZ21lbnQubG9hZCh7IGRlZmluaXRpb246IGNyZWF0ZWRGcmFnbWVudCwgY29udHJvbGxlcjogb0NvbnRyb2xsZXIgfSkpIGFzIENvbnRyb2w7XG5cdFx0XHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSBvUGFyZW50Q29udHJvbC5nZXRDb250cm9sbGVyKCkub1Jlc291cmNlQnVuZGxlO1xuXHRcdFx0Y29uc3Qgb0RpYWxvZyA9IG5ldyBEaWFsb2codW5kZWZpbmVkLCB7XG5cdFx0XHRcdHRpdGxlOiBzQWN0aW9uTGFiZWwgfHwgQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX09QRVJBVElPTlNfQUNUSU9OX1BBUkFNRVRFUl9ESUFMT0dfVElUTEVcIiwgb1Jlc291cmNlQnVuZGxlKSxcblx0XHRcdFx0Y29udGVudDogW29EaWFsb2dDb250ZW50XSxcblx0XHRcdFx0ZXNjYXBlSGFuZGxlcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vIGVzY2FwZSBoYW5kbGVyIGlzIG1lYW50IHRvIHBvc3NpYmx5IHN1cHByZXNzIG9yIHBvc3Rwb25lIGNsb3NpbmcgdGhlIGRpYWxvZyBvbiBlc2NhcGUgKGJ5IGNhbGxpbmcgXCJyZWplY3RcIiBvbiB0aGUgcHJvdmlkZWQgb2JqZWN0LCBvciBcInJlc29sdmVcIiBvbmx5IHdoZW5cblx0XHRcdFx0XHQvLyBkb25lIHdpdGggYWxsIHRhc2tzIHRvIGhhcHBlbiBiZWZvcmUgZGlhbG9nIGNhbiBiZSBjbG9zZWQpLiBJdCdzIG5vdCBpbnRlbmRlZCB0byBleHBsaWNldGx5IGNsb3NlIHRoZSBkaWFsb2cgaGVyZSAodGhhdCBoYXBwZW5zIGF1dG9tYXRpY2FsbHkgd2hlbiBub1xuXHRcdFx0XHRcdC8vIGVzY2FwZUhhbmRsZXIgaXMgcHJvdmlkZWQgb3IgdGhlIHJlc29sdmUtY2FsbGxiYWNrIGlzIGNhbGxlKSBvciBmb3Igb3duIHdyYXAgdXAgdGFza3MgKGxpa2UgcmVtb3ZpbmcgdmFsaWRpdGlvbiBtZXNzYWdlcyAtIHRoaXMgc2hvdWxkIGhhcHBlbiBpbiB0aGVcblx0XHRcdFx0XHQvLyBhZnRlckNsb3NlKS5cblx0XHRcdFx0XHQvLyBUT0RPOiBNb3ZlIHdyYXAgdXAgdGFza3MgdG8gYWZ0ZXJDbG9zZSwgYW5kIHJlbW92ZSB0aGlzIG1ldGhvZCBjb21wbGV0ZWx5LiBUYWtlIGNhcmUgdG8gYWxzbyBhZGFwdCBlbmQgYnV0dG9uIHByZXNzIGhhbmRsZXIgYWNjb3JkaW5nbHkuXG5cdFx0XHRcdFx0b0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyLnJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcygpO1xuXHRcdFx0XHRcdHJlamVjdChDb25zdGFudHMuQ2FuY2VsQWN0aW9uRGlhbG9nKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YmVnaW5CdXR0b246IG5ldyBCdXR0b24oZ2VuZXJhdGUoW1wiZmVcIiwgXCJBUERfXCIsIHNBY3Rpb25OYW1lLCBcIkFjdGlvblwiLCBcIk9rXCJdKSwge1xuXHRcdFx0XHRcdHRleHQ6IGJJc0NyZWF0ZUFjdGlvblxuXHRcdFx0XHRcdFx0PyBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX1NBUEZFX0FDVElPTl9DUkVBVEVfQlVUVE9OXCIsIG9SZXNvdXJjZUJ1bmRsZSlcblx0XHRcdFx0XHRcdDogX2dldEFjdGlvblBhcmFtZXRlckFjdGlvbk5hbWUob1Jlc291cmNlQnVuZGxlLCBzQWN0aW9uTGFiZWwsIHNBY3Rpb25OYW1lLCBlbnRpdHlTZXROYW1lKSxcblx0XHRcdFx0XHR0eXBlOiBcIkVtcGhhc2l6ZWRcIixcblx0XHRcdFx0XHRwcmVzczogYXN5bmMgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgYUVtcHR5TWFuZGF0b3J5RmllbGRzID0gYXdhaXQgdmFsaWRhdGVSZXF1aXJlZFByb3BlcnRpZXMoKTtcblx0XHRcdFx0XHRcdFx0aWYgKGFFbXB0eU1hbmRhdG9yeUZpZWxkcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFFbXB0eU1hbmRhdG9yeUZpZWxkcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YUVtcHR5TWFuZGF0b3J5RmllbGRzW2ldLmdldEZpZWxkcygpWzBdLnNldFZhbHVlU3RhdGUoXCJFcnJvclwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdGFFbXB0eU1hbmRhdG9yeUZpZWxkc1tpXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuZ2V0RmllbGRzKClbMF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0LnNldFZhbHVlU3RhdGVUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX09QRVJBVElPTlNfQUNUSU9OX1BBUkFNRVRFUl9ESUFMT0dfTUlTU0lOR19NQU5EQVRPUllfTVNHXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhRW1wdHlNYW5kYXRvcnlGaWVsZHNbaV0uZ2V0TGFiZWwoKS5nZXRUZXh0KClcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGFGaWVsZEludmFsaWQgPSBfdmFsaWRhdGVNZXNzYWdlcyhhQWN0aW9uUGFyYW1ldGVycywgYUZpZWxkSW52YWxpZCk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGFGaWVsZEludmFsaWQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGluZy5zaG93VW5ib3VuZE1lc3NhZ2VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdEJ1c3lMb2NrZXIubG9jayhvRGlhbG9nKTtcblxuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFxuXHRcdFx0XHRcdFx0XHRcdFx0T2JqZWN0LmtleXMobUZpZWxkVmFsdWVNYXApLm1hcChmdW5jdGlvbiAoc0tleTogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBtRmllbGRWYWx1ZU1hcFtzS2V5XTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBkdWUgdG8gdXNpbmcgdGhlIHNlYXJjaCBhbmQgdmFsdWUgaGVscHMgb24gdGhlIGFjdGlvbiBkaWFsb2cgdHJhbnNpZW50IG1lc3NhZ2VzIGNvdWxkIGFwcGVhclxuXHRcdFx0XHRcdFx0XHRcdC8vIHdlIG5lZWQgYW4gVVggZGVzaWduIGZvciB0aG9zZSB0byBzaG93IHRoZW0gdG8gdGhlIHVzZXIgLSBmb3Igbm93IHJlbW92ZSB0aGVtIGJlZm9yZSBjb250aW51aW5nXG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSBwYXJhbWV0ZXIgdmFsdWVzIGZyb20gRGlhbG9nIChTaW1wbGVGb3JtKSB0byBtUGFyYW1ldGVycy5hY3Rpb25QYXJhbWV0ZXJzIHNvIHRoYXQgdGhleSBhcmUgYXZhaWxhYmxlIGluIHRoZSBvcGVyYXRpb24gYmluZGluZ3MgZm9yIGFsbCBjb250ZXh0c1xuXHRcdFx0XHRcdFx0XHRcdGxldCB2UGFyYW1ldGVyVmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb1BhcmFtZXRlckNvbnRleHQgPSBvT3BlcmF0aW9uQmluZGluZyAmJiBvT3BlcmF0aW9uQmluZGluZy5nZXRQYXJhbWV0ZXJDb250ZXh0KCk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChjb25zdCBpIGluIGFBY3Rpb25QYXJhbWV0ZXJzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYUFjdGlvblBhcmFtZXRlcnNbaV0uJGlzQ29sbGVjdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBhTVZGQ29udGVudCA9IG9EaWFsb2cuZ2V0TW9kZWwoXCJtdmZ2aWV3XCIpLmdldFByb3BlcnR5KGAvJHthQWN0aW9uUGFyYW1ldGVyc1tpXS4kTmFtZX1gKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhS2V5VmFsdWVzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAoY29uc3QgaiBpbiBhTVZGQ29udGVudCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFLZXlWYWx1ZXMucHVzaChhTVZGQ29udGVudFtqXS5LZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZQYXJhbWV0ZXJWYWx1ZSA9IGFLZXlWYWx1ZXM7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2UGFyYW1ldGVyVmFsdWUgPSBvUGFyYW1ldGVyQ29udGV4dC5nZXRQcm9wZXJ0eShhQWN0aW9uUGFyYW1ldGVyc1tpXS4kTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRhQWN0aW9uUGFyYW1ldGVyc1tpXS52YWx1ZSA9IHZQYXJhbWV0ZXJWYWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHZQYXJhbWV0ZXJWYWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMubGFiZWwgPSBzQWN0aW9uTGFiZWw7XG5cdFx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzPy5pbnRlcm5hbE1vZGVsQ29udGV4dD8uc2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBhUmVzdWx0ID0gYXdhaXQgZXhlY3V0ZUFQTUFjdGlvbihcblx0XHRcdFx0XHRcdFx0XHRcdFx0b0FwcENvbXBvbmVudCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9QYXJlbnRDb250cm9sLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlSGFuZGxlcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0YUNvbnRleHRzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvRGlhbG9nLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdG9EaWFsb2cuY2xvc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoYVJlc3VsdCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2VzID0gc2FwLnVpLmdldENvcmUoKS5nZXRNZXNzYWdlTWFuYWdlcigpLmdldE1lc3NhZ2VNb2RlbCgpLmdldERhdGEoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiKSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nRmFpbHNcIik/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiRGVsYXlNZXNzYWdlc1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiRGVsYXlNZXNzYWdlc1wiKS5jb25jYXQobWVzc2FnZXMpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR0aHJvdyBvRXJyb3I7XG5cdFx0XHRcdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiKSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nRmFpbHNcIik/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc3RyaWN0SGFuZGxpbmdGYWlscyA9IG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBhRmFpbGVkQ29udGV4dHMgPSBbXSBhcyBhbnk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RyaWN0SGFuZGxpbmdGYWlscy5mb3JFYWNoKGZ1bmN0aW9uIChmYWlsOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFGYWlsZWRDb250ZXh0cy5wdXNoKGZhaWwub0FjdGlvbi5nZXRDb250ZXh0KCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmFDb250ZXh0cyA9IGFGYWlsZWRDb250ZXh0cztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBhUmVzdWx0ID0gYXdhaXQgZXhlY3V0ZUFQTUFjdGlvbihcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9BcHBDb21wb25lbnQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9QYXJlbnRDb250cm9sLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhQ29udGV4dHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvRGlhbG9nLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nRmFpbHNcIiwgW10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwicHJvY2Vzc2VkTWVzc2FnZUlkc1wiLCBbXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShhUmVzdWx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiNDEyRXhlY3V0ZWRcIikgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiKT8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRDb3JlLmdldE1lc3NhZ2VNYW5hZ2VyKCkuYWRkTWVzc2FnZXMoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiRGVsYXlNZXNzYWdlc1wiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgbWVzc2FnZUhhbmRsZXIuc2hvd01lc3NhZ2VEaWFsb2coe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNBY3Rpb25QYXJhbWV0ZXJEaWFsb2dPcGVuOiBvRGlhbG9nLmlzT3BlbigpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25CZWZvcmVTaG93TWVzc2FnZTogZnVuY3Rpb24gKGFNZXNzYWdlczogYW55LCBzaG93TWVzc2FnZVBhcmFtZXRlcnNJbjogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhY3Rpb25QYXJhbWV0ZXJTaG93TWVzc2FnZUNhbGxiYWNrKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFDb250ZXh0cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvRGlhbG9nLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFNZXNzYWdlcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzaG93TWVzc2FnZVBhcmFtZXRlcnNJblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoQnVzeUxvY2tlci5pc0xvY2tlZChvRGlhbG9nKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayhvRGlhbG9nKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHNob3dNZXNzYWdlRGlhbG9nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRhd2FpdCBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZXMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGV4dDogbVBhcmFtZXRlcnMuYUNvbnRleHRzWzBdLFxuXHRcdFx0XHRcdFx0XHRcdFx0aXNBY3Rpb25QYXJhbWV0ZXJEaWFsb2dPcGVuOiBvRGlhbG9nLmlzT3BlbigpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVBhZ2VOYXZpZ2F0aW9uQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdG9uQmVmb3JlU2hvd01lc3NhZ2U6IGZ1bmN0aW9uIChhTWVzc2FnZXM6IGFueSwgc2hvd01lc3NhZ2VQYXJhbWV0ZXJzSW46IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBXaHkgaXMgdGhpcyBpbXBsZW1lbnRlZCBhcyBjYWxsYmFjaz8gQXBwYXJlbnRseSwgYWxsIG5lZWRlZCBpbmZvcm1hdGlvbiBpcyBhdmFpbGFibGUgYmVmb3JlaGFuZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPOiByZWZhY3RvciBhY2NvcmRpbmdseVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzaG93TWVzc2FnZVBhcmFtZXRlcnMgPSBhY3Rpb25QYXJhbWV0ZXJTaG93TWVzc2FnZUNhbGxiYWNrKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFDb250ZXh0cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvRGlhbG9nLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFNZXNzYWdlcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzaG93TWVzc2FnZVBhcmFtZXRlcnNJblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzaG93TWVzc2FnZURpYWxvZyA9IHNob3dNZXNzYWdlUGFyYW1ldGVycy5zaG93TWVzc2FnZURpYWxvZztcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNob3dNZXNzYWdlUGFyYW1ldGVycztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEluIGNhc2Ugb2YgYmFja2VuZCB2YWxpZGF0aW9uIGVycm9yKHM/KSwgbWVzc2FnZSBzaGFsbCBub3QgYmUgc2hvd24gaW4gbWVzc2FnZSBkaWFsb2cgYnV0IG5leHQgdG8gdGhlIGZpZWxkIG9uIHBhcmFtZXRlciBkaWFsb2csIHdoaWNoIHNob3VsZFxuXHRcdFx0XHRcdFx0XHRcdC8vIHN0YXkgb3BlbiBpbiB0aGlzIGNhc2UgPT4gaW4gdGhpcyBjYXNlLCB3ZSBtdXN0IG5vdCByZXNvbHZlIG9yIHJlamVjdCB0aGUgcHJvbWlzZSBjb250cm9sbGluZyB0aGUgcGFyYW1ldGVyIGRpYWxvZy5cblx0XHRcdFx0XHRcdFx0XHQvLyBJbiBhbGwgb3RoZXIgY2FzZXMgKGUuZy4gb3RoZXIgYmFja2VuZCBlcnJvcnMgb3IgdXNlciBjYW5jZWxsYXRpb24pLCB0aGUgcHJvbWlzZSBjb250cm9sbGluZyB0aGUgcGFyYW1ldGVyIGRpYWxvZyBuZWVkcyB0byBiZSByZWplY3RlZCB0byBhbGxvd1xuXHRcdFx0XHRcdFx0XHRcdC8vIGNhbGxlcnMgdG8gcmVhY3QuIChFeGFtcGxlOiBJZiBjcmVhdGlvbiBpbiBiYWNrZW5kIGFmdGVyIG5hdmlnYXRpb24gdG8gdHJhbnNpZW50IGNvbnRleHQgZmFpbHMsIGJhY2sgbmF2aWdhdGlvbiBuZWVkcyB0byBiZSB0cmlnZ2VyZWQpXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogUmVmYWN0b3IgdG8gc2VwYXJhdGUgZGlhbG9nIGhhbmRsaW5nIGZyb20gYmFja2VuZCByZXF1ZXN0IGlzdGVhZCBvZiB0YWtpbmcgZGVjaXNpb24gYmFzZWQgb24gbWVzc2FnZSBoYW5kbGluZ1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzaG93TWVzc2FnZURpYWxvZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVqZWN0KG9FcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdFx0XHRpZiAoQnVzeUxvY2tlci5pc0xvY2tlZChvRGlhbG9nKSkge1xuXHRcdFx0XHRcdFx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKG9EaWFsb2cpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSxcblx0XHRcdFx0ZW5kQnV0dG9uOiBuZXcgQnV0dG9uKGdlbmVyYXRlKFtcImZlXCIsIFwiQVBEX1wiLCBzQWN0aW9uTmFtZSwgXCJBY3Rpb25cIiwgXCJDYW5jZWxcIl0pLCB7XG5cdFx0XHRcdFx0dGV4dDogQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX0NPTU1PTl9BQ1RJT05fUEFSQU1FVEVSX0RJQUxPR19DQU5DRUxcIiwgb1Jlc291cmNlQnVuZGxlKSxcblx0XHRcdFx0XHRwcmVzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETzogY2FuY2VsIGJ1dHRvbiBzaG91bGQganVzdCBjbG9zZSB0aGUgZGlhbG9nIChzaW1pbGFyIHRvIHVzaW5nIGVzY2FwZSkuIEFsbCB3cmFwIHVwIHRhc2tzIHNob3VsZCBiZSBtb3ZlZCB0byBhZnRlckNsb3NlLlxuXHRcdFx0XHRcdFx0Ly8gQXNzdW1wdGlvbjogX3ZhbGlkYXRlTWVzc2FnZXMgaXMgb25seSBjYWxsZWQgdG8gcmVtb3ZlIGV4aXNpdG5nIHZhbGlkYXRpb24gbWVzc2FnZXMgKGlzIHVzZXIgZmlyc3QgZW50ZXJzIGludmFsaWQgcGFyYW1ldGVyLCBhbmQgbGF0ZXIgY2FuY2VscykuXG5cdFx0XHRcdFx0XHQvLyBJZiB0aGlzIGFzc3VtcHRpb24gaXMgY29ycmVjdCwgdGhpcyBuZWVkcyBhbHNvIHRvIGJlIGRvbmUgd2hlbiBsZWF2aW5nIHRoZSBkaWFsb2cgd2l0aCBlc2NhcGUsIGkuZS4gc2hvdWxkIGJlIG1vdmVkIHRvIGFmdGVyQ2xvc2UuXG5cdFx0XHRcdFx0XHRfdmFsaWRhdGVNZXNzYWdlcyhhQWN0aW9uUGFyYW1ldGVycywgYUZpZWxkSW52YWxpZCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHQvLyBzaG91bGQgbm90IGJlIGRvbmUgaGVyZSwgYnV0IGFmdGVyIGNsb3NlLCBhcyB0aGUgc2FtZSBzaG91bGQgaGFwcGVuIHdoZW4gbGVhdmluZyB3aXRoIGVzY2FwZVxuXHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0XHRcdFx0XHRyZWplY3QoQ29uc3RhbnRzLkNhbmNlbEFjdGlvbkRpYWxvZyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSxcblx0XHRcdFx0Ly8gVE9ETzogYmVmb3JlT3BlbiBpcyBqdXN0IGFuIGV2ZW50LCBpLmUuIG5vdCB3YWl0aW5nIGZvciB0aGUgUHJvbWlzZSB0byBiZSByZXNvbHZlZC4gQ2hlY2sgaWYgdGFza3Mgb2YgdGhpcyBmdW5jdGlvbiBuZWVkIHRvIGJlIGRvbmUgYmVmb3JlIG9wZW5pbmcgdGhlIGRpYWxvZ1xuXHRcdFx0XHQvLyAtIGlmIHllcywgdGhleSBuZWVkIHRvIGJlIG1vdmVkIG91dHNpZGUuXG5cdFx0XHRcdC8vIEFzc3VtcHRpb246IFNvbWV0aW1lcyBkaWFsb2cgY2FuIGJlIHNlZW4gd2l0aG91dCBhbnkgZmllbGRzIGZvciBhIHNob3J0IHRpbWUgLSBtYXliZSB0aGlzIGlzIGNhdXNlZCBieSB0aGlzIGFzeW5jaHJvbml0eVxuXHRcdFx0XHRiZWZvcmVPcGVuOiBhc3luYyBmdW5jdGlvbiAob0V2ZW50OiBhbnkpIHtcblx0XHRcdFx0XHQvLyBjbG9uZSBldmVudCBmb3IgYWN0aW9uV3JhcHBlciBhcyBvRXZlbnQub1NvdXJjZSBnZXRzIGxvc3QgZHVyaW5nIHByb2Nlc3Npbmcgb2YgYmVmb3JlT3BlbiBldmVudCBoYW5kbGVyXG5cdFx0XHRcdFx0Y29uc3Qgb0Nsb25lRXZlbnQgPSBPYmplY3QuYXNzaWduKHt9LCBvRXZlbnQpO1xuXG5cdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0XHRcdFx0Y29uc3QgZ2V0RGVmYXVsdFZhbHVlc0Z1bmN0aW9uID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9EaWFsb2cuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdFx0XHRcdFx0c0FjdGlvblBhdGggPSBvQWN0aW9uQ29udGV4dC5zUGF0aCAmJiBvQWN0aW9uQ29udGV4dC5zUGF0aC5zcGxpdChcIi9AXCIpWzBdLFxuXHRcdFx0XHRcdFx0XHRzRGVmYXVsdFZhbHVlc0Z1bmN0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoXG5cdFx0XHRcdFx0XHRcdFx0YCR7c0FjdGlvblBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EZWZhdWx0VmFsdWVzRnVuY3Rpb25gXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc0RlZmF1bHRWYWx1ZXNGdW5jdGlvbjtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnN0IGZuU2V0RGVmYXVsdHNBbmRPcGVuRGlhbG9nID0gYXN5bmMgZnVuY3Rpb24gKHNCaW5kaW5nUGFyYW1ldGVyPzogYW55KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBzQm91bmRGdW5jdGlvbk5hbWUgPSBnZXREZWZhdWx0VmFsdWVzRnVuY3Rpb24oKTtcblx0XHRcdFx0XHRcdGNvbnN0IHByZWZpbGxQYXJhbWV0ZXIgPSBmdW5jdGlvbiAoc1BhcmFtTmFtZTogYW55LCB2UGFyYW1EZWZhdWx0VmFsdWU6IGFueSkge1xuXHRcdFx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9wYXJhbS1uYW1lc1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgZnVuY3Rpb24gKGluUmVzb2x2ZSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIENhc2UgMTogVGhlcmUgaXMgYSBQYXJhbWV0ZXJEZWZhdWx0VmFsdWUgYW5ub3RhdGlvblxuXHRcdFx0XHRcdFx0XHRcdGlmICh2UGFyYW1EZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFDb250ZXh0cy5sZW5ndGggPiAwICYmIHZQYXJhbURlZmF1bHRWYWx1ZS4kUGF0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCB2UGFyYW1WYWx1ZSA9IGF3YWl0IENvbW1vblV0aWxzLnJlcXVlc3RTaW5nbGV0b25Qcm9wZXJ0eShcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZQYXJhbURlZmF1bHRWYWx1ZS4kUGF0aCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9PcGVyYXRpb25CaW5kaW5nLmdldE1vZGVsKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh2UGFyYW1WYWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dlBhcmFtVmFsdWUgPSBhd2FpdCBvT3BlcmF0aW9uQmluZGluZ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuZ2V0UGFyYW1ldGVyQ29udGV4dCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5yZXF1ZXN0UHJvcGVydHkodlBhcmFtRGVmYXVsdFZhbHVlLiRQYXRoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFDb250ZXh0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBGb3IgbXVsdGkgc2VsZWN0LCBuZWVkIHRvIGxvb3Agb3ZlciBhQ29udGV4dHMgKGFzIGNvbnRleHRzIGNhbm5vdCBiZSByZXRyaWV2ZWQgdmlhIGJpbmRpbmcgcGFyYW1ldGVyIG9mIHRoZSBvcGVyYXRpb24gYmluZGluZylcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBzUGF0aEZvckNvbnRleHQgPSB2UGFyYW1EZWZhdWx0VmFsdWUuJFBhdGg7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoc1BhdGhGb3JDb250ZXh0LmluZGV4T2YoYCR7c0JpbmRpbmdQYXJhbWV0ZXJ9L2ApID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNQYXRoRm9yQ29udGV4dCA9IHNQYXRoRm9yQ29udGV4dC5yZXBsYWNlKGAke3NCaW5kaW5nUGFyYW1ldGVyfS9gLCBcIlwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgYUNvbnRleHRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhQ29udGV4dHNbaV0uZ2V0UHJvcGVydHkoc1BhdGhGb3JDb250ZXh0KSAhPT0gdlBhcmFtVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpZiB0aGUgdmFsdWVzIGZyb20gdGhlIGNvbnRleHRzIGFyZSBub3QgYWxsIHRoZSBzYW1lLCBkbyBub3QgcHJlZmlsbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGluUmVzb2x2ZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYXJhbU5hbWU6IHNQYXJhbU5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Yk5vUG9zc2libGVWYWx1ZTogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGluUmVzb2x2ZSh7IHBhcmFtTmFtZTogc1BhcmFtTmFtZSwgdmFsdWU6IHZQYXJhbVZhbHVlIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGNhdGNoIChvRXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSByZWFkaW5nIGRlZmF1bHQgYWN0aW9uIHBhcmFtZXRlclwiLCBzUGFyYW1OYW1lLCBtUGFyYW1ldGVycy5hY3Rpb25OYW1lKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpblJlc29sdmUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cGFyYW1OYW1lOiBzUGFyYW1OYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJMYXRlUHJvcGVydHlFcnJvcjogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDYXNlIDEuMjogUGFyYW1ldGVyRGVmYXVsdFZhbHVlIGRlZmluZXMgYSBmaXhlZCBzdHJpbmcgdmFsdWUgKGkuZS4gdlBhcmFtRGVmYXVsdFZhbHVlID0gJ3NvbWVTdHJpbmcnKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpblJlc29sdmUoeyBwYXJhbU5hbWU6IHNQYXJhbU5hbWUsIHZhbHVlOiB2UGFyYW1EZWZhdWx0VmFsdWUgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChvUGFyYW1ldGVyTW9kZWwgJiYgKG9QYXJhbWV0ZXJNb2RlbCBhcyBhbnkpLm9EYXRhW3NQYXJhbU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDYXNlIDI6IFRoZXJlIGlzIG5vIFBhcmFtZXRlckRlZmF1bHRWYWx1ZSBhbm5vdGF0aW9uICg9PiBsb29rIGludG8gdGhlIEZMUCBVc2VyIERlZmF1bHRzKVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRpblJlc29sdmUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXJhbU5hbWU6IHNQYXJhbU5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiAob1BhcmFtZXRlck1vZGVsIGFzIGFueSkub0RhdGFbc1BhcmFtTmFtZV1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpblJlc29sdmUoeyBwYXJhbU5hbWU6IHNQYXJhbU5hbWUsIHZhbHVlOiB1bmRlZmluZWQgfSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdGNvbnN0IGdldFBhcmFtZXRlckRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uIChzUGFyYW1OYW1lOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9EaWFsb2cuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdFx0XHRcdFx0XHRzQWN0aW9uUGFyYW1ldGVyQW5ub3RhdGlvblBhdGggPSBDb21tb25VdGlscy5nZXRQYXJhbWV0ZXJQYXRoKG9BY3Rpb25Db250ZXh0LmdldFBhdGgoKSwgc1BhcmFtTmFtZSkgKyBcIkBcIixcblx0XHRcdFx0XHRcdFx0XHRvUGFyYW1ldGVyQW5ub3RhdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChzQWN0aW9uUGFyYW1ldGVyQW5ub3RhdGlvblBhdGgpLFxuXHRcdFx0XHRcdFx0XHRcdG9QYXJhbWV0ZXJEZWZhdWx0VmFsdWUgPVxuXHRcdFx0XHRcdFx0XHRcdFx0b1BhcmFtZXRlckFubm90YXRpb25zICYmIG9QYXJhbWV0ZXJBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5QYXJhbWV0ZXJEZWZhdWx0VmFsdWVcIl07IC8vIGVpdGhlciB7ICRQYXRoOiAnc29tZVBhdGgnIH0gb3IgJ3NvbWVTdHJpbmcnXG5cdFx0XHRcdFx0XHRcdHJldHVybiBvUGFyYW1ldGVyRGVmYXVsdFZhbHVlO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgYUN1cnJlbnRQYXJhbURlZmF1bHRWYWx1ZSA9IFtdO1xuXHRcdFx0XHRcdFx0bGV0IHNQYXJhbU5hbWUsIHZQYXJhbWV0ZXJEZWZhdWx0VmFsdWU7XG5cdFx0XHRcdFx0XHRmb3IgKGNvbnN0IGkgaW4gYUFjdGlvblBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRcdFx0c1BhcmFtTmFtZSA9IGFBY3Rpb25QYXJhbWV0ZXJzW2ldLiROYW1lO1xuXHRcdFx0XHRcdFx0XHR2UGFyYW1ldGVyRGVmYXVsdFZhbHVlID0gZ2V0UGFyYW1ldGVyRGVmYXVsdFZhbHVlKHNQYXJhbU5hbWUpO1xuXHRcdFx0XHRcdFx0XHRhQ3VycmVudFBhcmFtRGVmYXVsdFZhbHVlLnB1c2gocHJlZmlsbFBhcmFtZXRlcihzUGFyYW1OYW1lLCB2UGFyYW1ldGVyRGVmYXVsdFZhbHVlKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChvQWN0aW9uQ29udGV4dC5nZXRPYmplY3QoXCIkSXNCb3VuZFwiKSAmJiBhQ29udGV4dHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc0JvdW5kRnVuY3Rpb25OYW1lICYmIHNCb3VuZEZ1bmN0aW9uTmFtZS5sZW5ndGggPiAwICYmIHR5cGVvZiBzQm91bmRGdW5jdGlvbk5hbWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IGkgaW4gYUNvbnRleHRzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhRnVuY3Rpb25QYXJhbXMucHVzaChjYWxsQm91bmRGdW5jdGlvbihzQm91bmRGdW5jdGlvbk5hbWUsIGFDb250ZXh0c1tpXSwgbVBhcmFtZXRlcnMubW9kZWwpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgYVByZWZpbGxQYXJhbVByb21pc2VzID0gUHJvbWlzZS5hbGwoYUN1cnJlbnRQYXJhbURlZmF1bHRWYWx1ZSk7XG5cdFx0XHRcdFx0XHRsZXQgYUV4ZWNGdW5jdGlvblByb21pc2VzOiBQcm9taXNlPGFueVtdPiA9IFByb21pc2UucmVzb2x2ZShbXSk7XG5cdFx0XHRcdFx0XHRsZXQgb0V4ZWNGdW5jdGlvbkZyb21NYW5pZmVzdFByb21pc2U7XG5cdFx0XHRcdFx0XHRpZiAoYUZ1bmN0aW9uUGFyYW1zICYmIGFGdW5jdGlvblBhcmFtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGFFeGVjRnVuY3Rpb25Qcm9taXNlcyA9IFByb21pc2UuYWxsKGFGdW5jdGlvblBhcmFtcyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAobVBhcmFtZXRlcnMuZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNNb2R1bGUgPSBtUGFyYW1ldGVycy5kZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgbVBhcmFtZXRlcnMuZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uLmxhc3RJbmRleE9mKFwiLlwiKSB8fCAtMSlcblx0XHRcdFx0XHRcdFx0XHRcdC5yZXBsYWNlKC9cXC4vZ2ksIFwiL1wiKSxcblx0XHRcdFx0XHRcdFx0XHRzRnVuY3Rpb25OYW1lID0gbVBhcmFtZXRlcnMuZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uLnN1YnN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbi5sYXN0SW5kZXhPZihcIi5cIikgKyAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdG9FeGVjRnVuY3Rpb25Gcm9tTWFuaWZlc3RQcm9taXNlID0gRlBNSGVscGVyLmFjdGlvbldyYXBwZXIob0Nsb25lRXZlbnQsIHNNb2R1bGUsIHNGdW5jdGlvbk5hbWUsIHtcblx0XHRcdFx0XHRcdFx0XHRcImNvbnRleHRzXCI6IGFDb250ZXh0c1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgYVByb21pc2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRcdFx0XHRcdGFQcmVmaWxsUGFyYW1Qcm9taXNlcyxcblx0XHRcdFx0XHRcdFx0XHRhRXhlY0Z1bmN0aW9uUHJvbWlzZXMsXG5cdFx0XHRcdFx0XHRcdFx0b0V4ZWNGdW5jdGlvbkZyb21NYW5pZmVzdFByb21pc2Vcblx0XHRcdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGN1cnJlbnRQYXJhbURlZmF1bHRWYWx1ZTogYW55ID0gYVByb21pc2VzWzBdO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmdW5jdGlvblBhcmFtcyA9IGFQcm9taXNlc1sxXTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb0Z1bmN0aW9uUGFyYW1zRnJvbU1hbmlmZXN0ID0gYVByb21pc2VzWzJdO1xuXHRcdFx0XHRcdFx0XHRsZXQgc0RpYWxvZ1BhcmFtTmFtZTogc3RyaW5nO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEZpbGwgdGhlIGRpYWxvZyB3aXRoIHRoZSBlYXJsaWVyIGRldGVybWluZWQgcGFyYW1ldGVyIHZhbHVlcyBmcm9tIHRoZSBkaWZmZXJlbnQgc291cmNlc1xuXHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IGkgaW4gYUFjdGlvblBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRcdFx0XHRzRGlhbG9nUGFyYW1OYW1lID0gYUFjdGlvblBhcmFtZXRlcnNbaV0uJE5hbWU7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gUGFyYW1ldGVyIHZhbHVlcyBwcm92aWRlZCBpbiB0aGUgY2FsbCBvZiBpbnZva2VBY3Rpb24gb3ZlcnJ1bGUgb3RoZXIgc291cmNlc1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHZQYXJhbWV0ZXJQcm92aWRlZFZhbHVlID0gYVBhcmFtZXRlclZhbHVlcz8uZmluZChcblx0XHRcdFx0XHRcdFx0XHRcdChlbGVtZW50OiBhbnkpID0+IGVsZW1lbnQubmFtZSA9PT0gYUFjdGlvblBhcmFtZXRlcnNbaV0uJE5hbWVcblx0XHRcdFx0XHRcdFx0XHQpPy52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZiAodlBhcmFtZXRlclByb3ZpZGVkVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9PcGVyYXRpb25CaW5kaW5nLnNldFBhcmFtZXRlcihhQWN0aW9uUGFyYW1ldGVyc1tpXS4kTmFtZSwgdlBhcmFtZXRlclByb3ZpZGVkVmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAob0Z1bmN0aW9uUGFyYW1zRnJvbU1hbmlmZXN0ICYmIG9GdW5jdGlvblBhcmFtc0Zyb21NYW5pZmVzdC5oYXNPd25Qcm9wZXJ0eShzRGlhbG9nUGFyYW1OYW1lKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0b09wZXJhdGlvbkJpbmRpbmcuc2V0UGFyYW1ldGVyKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhQWN0aW9uUGFyYW1ldGVyc1tpXS4kTmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0b0Z1bmN0aW9uUGFyYW1zRnJvbU1hbmlmZXN0W3NEaWFsb2dQYXJhbU5hbWVdXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VycmVudFBhcmFtRGVmYXVsdFZhbHVlW2ldICYmIGN1cnJlbnRQYXJhbURlZmF1bHRWYWx1ZVtpXS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvT3BlcmF0aW9uQmluZGluZy5zZXRQYXJhbWV0ZXIoYUFjdGlvblBhcmFtZXRlcnNbaV0uJE5hbWUsIGN1cnJlbnRQYXJhbURlZmF1bHRWYWx1ZVtpXS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBpZiB0aGUgZGVmYXVsdCB2YWx1ZSBoYWQgbm90IGJlZW4gcHJldmlvdXNseSBkZXRlcm1pbmVkIGR1ZSB0byBkaWZmZXJlbnQgY29udGV4dHMsIHdlIGRvIG5vdGhpbmcgZWxzZVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoc0JvdW5kRnVuY3Rpb25OYW1lICYmICFjdXJyZW50UGFyYW1EZWZhdWx0VmFsdWVbaV0uYk5vUG9zc2libGVWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFDb250ZXh0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHdlIGNoZWNrIGlmIHRoZSBmdW5jdGlvbiByZXRyaWV2ZXMgdGhlIHNhbWUgcGFyYW0gdmFsdWUgZm9yIGFsbCB0aGUgY29udGV4dHM6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBqID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2hpbGUgKGogPCBhQ29udGV4dHMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uUGFyYW1zW2pdICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvblBhcmFtc1tqICsgMV0gJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uUGFyYW1zW2pdLmdldE9iamVjdChzRGlhbG9nUGFyYW1OYW1lKSA9PT1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb25QYXJhbXNbaiArIDFdLmdldE9iamVjdChzRGlhbG9nUGFyYW1OYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aisrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9wYXJhbSB2YWx1ZXMgYXJlIGFsbCB0aGUgc2FtZTpcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGogPT09IGFDb250ZXh0cy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b09wZXJhdGlvbkJpbmRpbmcuc2V0UGFyYW1ldGVyKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YUFjdGlvblBhcmFtZXRlcnNbaV0uJE5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvblBhcmFtc1tqXS5nZXRPYmplY3Qoc0RpYWxvZ1BhcmFtTmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZ1bmN0aW9uUGFyYW1zWzBdICYmIGZ1bmN0aW9uUGFyYW1zWzBdLmdldE9iamVjdChzRGlhbG9nUGFyYW1OYW1lKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL09ubHkgb25lIGNvbnRleHQsIHRoZW4gdGhlIGRlZmF1bHQgcGFyYW0gdmFsdWVzIGFyZSB0byBiZSB2ZXJpZmllZCBmcm9tIHRoZSBmdW5jdGlvbjpcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvT3BlcmF0aW9uQmluZGluZy5zZXRQYXJhbWV0ZXIoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YUFjdGlvblBhcmFtZXRlcnNbaV0uJE5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb25QYXJhbXNbMF0uZ2V0T2JqZWN0KHNEaWFsb2dQYXJhbU5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGJFcnJvckZvdW5kID0gY3VycmVudFBhcmFtRGVmYXVsdFZhbHVlLnNvbWUoZnVuY3Rpb24gKG9WYWx1ZTogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9WYWx1ZS5iTGF0ZVByb3BlcnR5RXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvVmFsdWUuYkxhdGVQcm9wZXJ0eUVycm9yO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdC8vIElmIGF0IGxlYXN0IG9uZSBEZWZhdWx0IFByb3BlcnR5IGlzIGEgTGF0ZSBQcm9wZXJ0eSBhbmQgYW4gZVRhZyBlcnJvciB3YXMgcmFpc2VkLlxuXHRcdFx0XHRcdFx0XHRpZiAoYkVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBzVGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFwiQ19BUFBfQ09NUE9ORU5UX1NBUEZFX0VUQUdfTEFURV9QUk9QRVJUWVwiLCBvUmVzb3VyY2VCdW5kbGUpO1xuXHRcdFx0XHRcdFx0XHRcdE1lc3NhZ2VCb3gud2FybmluZyhzVGV4dCwgeyBjb250ZW50V2lkdGg6IFwiMjVlbVwiIH0gYXMgYW55KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgcmV0cmlldmluZyB0aGUgcGFyYW1ldGVyXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRjb25zdCBmbkFzeW5jQmVmb3JlT3BlbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGlmIChvQWN0aW9uQ29udGV4dC5nZXRPYmplY3QoXCIkSXNCb3VuZFwiKSAmJiBhQ29udGV4dHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBhUGFyYW1ldGVycyA9IG9BY3Rpb25Db250ZXh0LmdldE9iamVjdChcIiRQYXJhbWV0ZXJcIik7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNCaW5kaW5nUGFyYW1ldGVyID0gYVBhcmFtZXRlcnNbMF0gJiYgYVBhcmFtZXRlcnNbMF0uJE5hbWU7XG5cblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBvQ29udGV4dE9iamVjdCA9IGF3YWl0IGFDb250ZXh0c1swXS5yZXF1ZXN0T2JqZWN0KCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9Db250ZXh0T2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvT3BlcmF0aW9uQmluZGluZy5zZXRQYXJhbWV0ZXIoc0JpbmRpbmdQYXJhbWV0ZXIsIG9Db250ZXh0T2JqZWN0KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YXdhaXQgZm5TZXREZWZhdWx0c0FuZE9wZW5EaWFsb2coc0JpbmRpbmdQYXJhbWV0ZXIpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJldHJpZXZpbmcgdGhlIHBhcmFtZXRlclwiLCBvRXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhd2FpdCBmblNldERlZmF1bHRzQW5kT3BlbkRpYWxvZygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRhd2FpdCBmbkFzeW5jQmVmb3JlT3BlbigpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZnRlckNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b0RpYWxvZy5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0bVBhcmFtZXRlcnMub0RpYWxvZyA9IG9EaWFsb2c7XG5cdFx0XHRhRm9ybUVsZW1lbnRzID0gKG9EaWFsb2dDb250ZW50IGFzIGFueSlcblx0XHRcdFx0LmdldEFnZ3JlZ2F0aW9uKFwiZm9ybVwiKVxuXHRcdFx0XHQuZ2V0QWdncmVnYXRpb24oXCJmb3JtQ29udGFpbmVyc1wiKVswXVxuXHRcdFx0XHQuZ2V0QWdncmVnYXRpb24oXCJmb3JtRWxlbWVudHNcIik7XG5cdFx0XHRvRGlhbG9nLnNldE1vZGVsKG9BY3Rpb25Db250ZXh0LmdldE1vZGVsKCkub01vZGVsKTtcblx0XHRcdG9EaWFsb2cuc2V0TW9kZWwob1BhcmFtZXRlck1vZGVsLCBcInBhcmFtc01vZGVsXCIpO1xuXHRcdFx0b0RpYWxvZy5iaW5kRWxlbWVudCh7XG5cdFx0XHRcdHBhdGg6IFwiL1wiLFxuXHRcdFx0XHRtb2RlbDogXCJwYXJhbXNNb2RlbFwiXG5cdFx0XHR9KTtcblx0XHRcdC8vIGVtcHR5IG1vZGVsIHRvIGFkZCBlbGVtZW50cyBkeW5hbWljYWxseSBkZXBlbmRpbmcgb24gbnVtYmVyIG9mIE1WRiBmaWVsZHMgZGVmaW5lZCBvbiB0aGUgZGlhbG9nXG5cdFx0XHRjb25zdCBvTVZGTW9kZWwgPSBuZXcgSlNPTk1vZGVsKHt9KTtcblx0XHRcdG9EaWFsb2cuc2V0TW9kZWwob01WRk1vZGVsLCBcIm12ZnZpZXdcIik7XG5cblx0XHRcdGxldCBzQWN0aW9uUGF0aCA9IGAke3NBY3Rpb25OYW1lfSguLi4pYDtcblx0XHRcdGlmICghYUNvbnRleHRzLmxlbmd0aCkge1xuXHRcdFx0XHRzQWN0aW9uUGF0aCA9IGAvJHtzQWN0aW9uUGF0aH1gO1xuXHRcdFx0fVxuXHRcdFx0b0RpYWxvZy5iaW5kRWxlbWVudCh7XG5cdFx0XHRcdHBhdGg6IHNBY3Rpb25QYXRoXG5cdFx0XHR9KTtcblx0XHRcdGlmIChvUGFyZW50Q29udHJvbCkge1xuXHRcdFx0XHQvLyBpZiB0aGVyZSBpcyBhIHBhcmVudCBjb250cm9sIHNwZWNpZmllZCBhZGQgdGhlIGRpYWxvZyBhcyBkZXBlbmRlbnRcblx0XHRcdFx0b1BhcmVudENvbnRyb2wuYWRkRGVwZW5kZW50KG9EaWFsb2cpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFDb250ZXh0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG9EaWFsb2cuc2V0QmluZGluZ0NvbnRleHQoYUNvbnRleHRzWzBdKTsgLy8gdXNlIGNvbnRleHQgb2YgZmlyc3Qgc2VsZWN0ZWQgbGluZSBpdGVtXG5cdFx0XHR9XG5cdFx0XHRvT3BlcmF0aW9uQmluZGluZyA9IG9EaWFsb2cuZ2V0T2JqZWN0QmluZGluZygpO1xuXHRcdFx0b0RpYWxvZy5vcGVuKCk7XG5cdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdHJlamVjdChvRXJyb3IpO1xuXHRcdH1cblx0fSk7XG59XG5mdW5jdGlvbiBnZXRBY3Rpb25QYXJhbWV0ZXJzKG9BY3Rpb246IGFueSkge1xuXHRjb25zdCBhUGFyYW1ldGVycyA9IG9BY3Rpb24uZ2V0T2JqZWN0KFwiJFBhcmFtZXRlclwiKSB8fCBbXTtcblx0aWYgKGFQYXJhbWV0ZXJzICYmIGFQYXJhbWV0ZXJzLmxlbmd0aCkge1xuXHRcdGlmIChvQWN0aW9uLmdldE9iamVjdChcIiRJc0JvdW5kXCIpKSB7XG5cdFx0XHQvL2luIGNhc2Ugb2YgYm91bmQgYWN0aW9ucywgaWdub3JlIHRoZSBmaXJzdCBwYXJhbWV0ZXIgYW5kIGNvbnNpZGVyIHRoZSByZXN0XG5cdFx0XHRyZXR1cm4gYVBhcmFtZXRlcnMuc2xpY2UoMSwgYVBhcmFtZXRlcnMubGVuZ3RoKSB8fCBbXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGFQYXJhbWV0ZXJzO1xufVxuZnVuY3Rpb24gZ2V0SXNBY3Rpb25Dcml0aWNhbChvTWV0YU1vZGVsOiBhbnksIHNQYXRoOiBhbnksIGNvbnRleHRzPzogYW55LCBvQm91bmRBY3Rpb24/OiBhbnkpIHtcblx0Y29uc3QgdkFjdGlvbkNyaXRpY2FsID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c1BhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0FjdGlvbkNyaXRpY2FsYCk7XG5cdGxldCBzQ3JpdGljYWxQYXRoID0gdkFjdGlvbkNyaXRpY2FsICYmIHZBY3Rpb25Dcml0aWNhbC4kUGF0aDtcblx0aWYgKCFzQ3JpdGljYWxQYXRoKSB7XG5cdFx0Ly8gdGhlIHN0YXRpYyB2YWx1ZSBzY2VuYXJpbyBmb3IgaXNBY3Rpb25Dcml0aWNhbFxuXHRcdHJldHVybiAhIXZBY3Rpb25Dcml0aWNhbDtcblx0fVxuXHRjb25zdCBhQmluZGluZ1BhcmFtcyA9IG9Cb3VuZEFjdGlvbiAmJiBvQm91bmRBY3Rpb24uZ2V0T2JqZWN0KFwiJFBhcmFtZXRlclwiKSxcblx0XHRhUGF0aHMgPSBzQ3JpdGljYWxQYXRoICYmIHNDcml0aWNhbFBhdGguc3BsaXQoXCIvXCIpLFxuXHRcdGJDb25kaXRpb24gPVxuXHRcdFx0YUJpbmRpbmdQYXJhbXMgJiYgYUJpbmRpbmdQYXJhbXMubGVuZ3RoICYmIHR5cGVvZiBhQmluZGluZ1BhcmFtcyA9PT0gXCJvYmplY3RcIiAmJiBzQ3JpdGljYWxQYXRoICYmIGNvbnRleHRzICYmIGNvbnRleHRzLmxlbmd0aDtcblx0aWYgKGJDb25kaXRpb24pIHtcblx0XHQvL2luIGNhc2UgYmluZGluZyBwYXRhbWV0ZXJzIGFyZSB0aGVyZSBpbiBwYXRoIG5lZWQgdG8gcmVtb3ZlIGVnOiAtIF9pdC9pc1ZlcmlmaWVkID0+IG5lZWQgdG8gcmVtb3ZlIF9pdCBhbmQgdGhlIHBhdGggc2hvdWxkIGJlIGlzVmVyaWZpZWRcblx0XHRhQmluZGluZ1BhcmFtcy5maWx0ZXIoZnVuY3Rpb24gKG9QYXJhbXM6IGFueSkge1xuXHRcdFx0Y29uc3QgaW5kZXggPSBhUGF0aHMgJiYgYVBhdGhzLmluZGV4T2Yob1BhcmFtcy4kTmFtZSk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRhUGF0aHMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRzQ3JpdGljYWxQYXRoID0gYVBhdGhzLmpvaW4oXCIvXCIpO1xuXHRcdHJldHVybiBjb250ZXh0c1swXS5nZXRPYmplY3Qoc0NyaXRpY2FsUGF0aCk7XG5cdH0gZWxzZSBpZiAoc0NyaXRpY2FsUGF0aCkge1xuXHRcdC8vaWYgc2NlbmFyaW8gaXMgcGF0aCBiYXNlZCByZXR1cm4gdGhlIHBhdGggdmFsdWVcblx0XHRyZXR1cm4gY29udGV4dHNbMF0uZ2V0T2JqZWN0KHNDcml0aWNhbFBhdGgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIF9nZXRBY3Rpb25QYXJhbWV0ZXJBY3Rpb25OYW1lKG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGUsIHNBY3Rpb25MYWJlbDogc3RyaW5nLCBzQWN0aW9uTmFtZTogc3RyaW5nLCBzRW50aXR5U2V0TmFtZTogc3RyaW5nKSB7XG5cdGxldCBib3VuZEFjdGlvbk5hbWU6IGFueSA9IHNBY3Rpb25OYW1lID8gc0FjdGlvbk5hbWUgOiBudWxsO1xuXHRjb25zdCBhQWN0aW9uTmFtZSA9IGJvdW5kQWN0aW9uTmFtZS5zcGxpdChcIi5cIik7XG5cdGJvdW5kQWN0aW9uTmFtZSA9IGJvdW5kQWN0aW9uTmFtZS5pbmRleE9mKFwiLlwiKSA+PSAwID8gYUFjdGlvbk5hbWVbYUFjdGlvbk5hbWUubGVuZ3RoIC0gMV0gOiBib3VuZEFjdGlvbk5hbWU7XG5cdGNvbnN0IHN1ZmZpeFJlc291cmNlS2V5ID0gYm91bmRBY3Rpb25OYW1lICYmIHNFbnRpdHlTZXROYW1lID8gYCR7c0VudGl0eVNldE5hbWV9fCR7Ym91bmRBY3Rpb25OYW1lfWAgOiBcIlwiO1xuXHRjb25zdCBzS2V5ID0gXCJBQ1RJT05fUEFSQU1FVEVSX0RJQUxPR19BQ1RJT05fTkFNRVwiO1xuXHRjb25zdCBiUmVzb3VyY2VLZXlFeGlzdHMgPVxuXHRcdG9SZXNvdXJjZUJ1bmRsZSAmJiBDb21tb25VdGlscy5jaGVja0lmUmVzb3VyY2VLZXlFeGlzdHMoKG9SZXNvdXJjZUJ1bmRsZSBhcyBhbnkpLmFDdXN0b21CdW5kbGVzLCBgJHtzS2V5fXwke3N1ZmZpeFJlc291cmNlS2V5fWApO1xuXHRpZiAoc0FjdGlvbkxhYmVsKSB7XG5cdFx0aWYgKGJSZXNvdXJjZUtleUV4aXN0cykge1xuXHRcdFx0cmV0dXJuIENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KHNLZXksIG9SZXNvdXJjZUJ1bmRsZSwgbnVsbCwgc3VmZml4UmVzb3VyY2VLZXkpO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRvUmVzb3VyY2VCdW5kbGUgJiZcblx0XHRcdENvbW1vblV0aWxzLmNoZWNrSWZSZXNvdXJjZUtleUV4aXN0cygob1Jlc291cmNlQnVuZGxlIGFzIGFueSkuYUN1c3RvbUJ1bmRsZXMsIGAke3NLZXl9fCR7c0VudGl0eVNldE5hbWV9YClcblx0XHQpIHtcblx0XHRcdHJldHVybiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChzS2V5LCBvUmVzb3VyY2VCdW5kbGUsIG51bGwsIGAke3NFbnRpdHlTZXROYW1lfWApO1xuXHRcdH0gZWxzZSBpZiAob1Jlc291cmNlQnVuZGxlICYmIENvbW1vblV0aWxzLmNoZWNrSWZSZXNvdXJjZUtleUV4aXN0cygob1Jlc291cmNlQnVuZGxlIGFzIGFueSkuYUN1c3RvbUJ1bmRsZXMsIGAke3NLZXl9YCkpIHtcblx0XHRcdHJldHVybiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChzS2V5LCBvUmVzb3VyY2VCdW5kbGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc0FjdGlvbkxhYmVsO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX0NPTU1PTl9ESUFMT0dfT0tcIiwgb1Jlc291cmNlQnVuZGxlKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGU0MTJGYWlsZWRUcmFuc2l0aW9ucyhcblx0bVBhcmFtZXRlcnM6IGFueSxcblx0b0FjdGlvbjogYW55LFxuXHRzR3JvdXBJZDogc3RyaW5nLFxuXHRjdXJyZW50X2NvbnRleHRfaW5kZXg6IG51bWJlciB8IG51bGwsXG5cdGlDb250ZXh0TGVuZ3RoOiBudW1iZXIgfCBudWxsLFxuXHRtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXIgfCB1bmRlZmluZWQsXG5cdG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGVcbikge1xuXHRpZiAobVBhcmFtZXRlcnMuYUNvbnRleHRzLmxlbmd0aCA+IDEpIHtcblx0XHRsZXQgc3RyaWN0SGFuZGxpbmdGYWlsczogYW55O1xuXHRcdGNvbnN0IG1lc3NhZ2VzID0gc2FwLnVpLmdldENvcmUoKS5nZXRNZXNzYWdlTWFuYWdlcigpLmdldE1lc3NhZ2VNb2RlbCgpLmdldERhdGEoKTtcblx0XHRjb25zdCBwcm9jZXNzZWRNZXNzYWdlSWRzID0gbVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJwcm9jZXNzZWRNZXNzYWdlSWRzXCIpO1xuXHRcdGNvbnN0IHRyYW5zaXRpb25NZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihmdW5jdGlvbiAobWVzc2FnZTogTWVzc2FnZSkge1xuXHRcdFx0Y29uc3QgaXNEdXBsaWNhdGUgPSBwcm9jZXNzZWRNZXNzYWdlSWRzLmZpbmQoZnVuY3Rpb24gKGlkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2UuZ2V0SWQoKSA9PT0gaWQ7XG5cdFx0XHR9KTtcblx0XHRcdGlmICghaXNEdXBsaWNhdGUpIHtcblx0XHRcdFx0cHJvY2Vzc2VkTWVzc2FnZUlkcy5wdXNoKG1lc3NhZ2UuZ2V0SWQoKSk7XG5cdFx0XHRcdGlmIChtZXNzYWdlLmdldFR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuU3VjY2Vzcykge1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFxuXHRcdFx0XHRcdFx0XCJEZWxheU1lc3NhZ2VzXCIsXG5cdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcIkRlbGF5TWVzc2FnZXNcIikuY29uY2F0KG1lc3NhZ2UpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lc3NhZ2UuZ2V0UGVyc2lzdGVudCgpID09PSB0cnVlICYmIG1lc3NhZ2UuZ2V0VHlwZSgpICE9PSBNZXNzYWdlVHlwZS5TdWNjZXNzICYmICFpc0R1cGxpY2F0ZTtcblx0XHR9KTtcblx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInByb2Nlc3NlZE1lc3NhZ2VJZHNcIiwgcHJvY2Vzc2VkTWVzc2FnZUlkcyk7XG5cdFx0aWYgKHRyYW5zaXRpb25NZXNzYWdlcy5sZW5ndGgpIHtcblx0XHRcdGlmIChtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dCkge1xuXHRcdFx0XHRzdHJpY3RIYW5kbGluZ0ZhaWxzID0gbVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJzdHJpY3RIYW5kbGluZ0ZhaWxzXCIpO1xuXHRcdFx0XHRzdHJpY3RIYW5kbGluZ0ZhaWxzLnB1c2goe1xuXHRcdFx0XHRcdG9BY3Rpb246IG9BY3Rpb24sXG5cdFx0XHRcdFx0Z3JvdXBJZDogc0dyb3VwSWRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiLCBzdHJpY3RIYW5kbGluZ0ZhaWxzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoXG5cdFx0Y3VycmVudF9jb250ZXh0X2luZGV4ID09PSBpQ29udGV4dExlbmd0aCAmJlxuXHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0ICYmXG5cdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiKT8ubGVuZ3RoXG5cdCkge1xuXHRcdG9wZXJhdGlvbnNIZWxwZXIucmVuZGVyTWVzc2FnZVZpZXcoXG5cdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdG1lc3NhZ2VIYW5kbGVyLFxuXHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiKSxcblx0XHRcdHRydWVcblx0XHQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVEZXBlbmRpbmdPblNlbGVjdGVkQ29udGV4dHMoXG5cdG9BY3Rpb246IGFueSxcblx0bVBhcmFtZXRlcnM6IGFueSxcblx0YkdldEJvdW5kQ29udGV4dDogYm9vbGVhbixcblx0c0dyb3VwSWQ6IHN0cmluZyxcblx0b1Jlc291cmNlQnVuZGxlOiBSZXNvdXJjZUJ1bmRsZSxcblx0bWVzc2FnZUhhbmRsZXI6IE1lc3NhZ2VIYW5kbGVyIHwgdW5kZWZpbmVkLFxuXHRpQ29udGV4dExlbmd0aDogbnVtYmVyIHwgbnVsbCxcblx0Y3VycmVudF9jb250ZXh0X2luZGV4OiBudW1iZXIgfCBudWxsXG4pIHtcblx0bGV0IG9BY3Rpb25Qcm9taXNlLFxuXHRcdGJFbmFibGVTdHJpY3RIYW5kbGluZyA9IHRydWU7XG5cdGlmIChiR2V0Qm91bmRDb250ZXh0KSB7XG5cdFx0Y29uc3Qgc1BhdGggPSBvQWN0aW9uLmdldEJvdW5kQ29udGV4dCgpLmdldFBhdGgoKTtcblx0XHRjb25zdCBzTWV0YVBhdGggPSBvQWN0aW9uLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkuZ2V0TWV0YVBhdGgoc1BhdGgpO1xuXHRcdGNvbnN0IG9Qcm9wZXJ0eSA9IG9BY3Rpb24uZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKS5nZXRPYmplY3Qoc01ldGFQYXRoKTtcblx0XHRpZiAob1Byb3BlcnR5ICYmIG9Qcm9wZXJ0eVswXT8uJGtpbmQgIT09IFwiQWN0aW9uXCIpIHtcblx0XHRcdC8vZG8gbm90IGVuYWJsZSB0aGUgc3RyaWN0IGhhbmRsaW5nIGlmIGl0cyBub3QgYW4gYWN0aW9uXG5cdFx0XHRiRW5hYmxlU3RyaWN0SGFuZGxpbmcgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIWJFbmFibGVTdHJpY3RIYW5kbGluZykge1xuXHRcdG9BY3Rpb25Qcm9taXNlID0gYkdldEJvdW5kQ29udGV4dFxuXHRcdFx0PyBvQWN0aW9uLmV4ZWN1dGUoc0dyb3VwSWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBvQWN0aW9uLmdldEJvdW5kQ29udGV4dCgpO1xuXHRcdFx0ICB9KVxuXHRcdFx0OiBvQWN0aW9uLmV4ZWN1dGUoc0dyb3VwSWQpO1xuXHR9IGVsc2Uge1xuXHRcdG9BY3Rpb25Qcm9taXNlID0gYkdldEJvdW5kQ29udGV4dFxuXHRcdFx0PyBvQWN0aW9uXG5cdFx0XHRcdFx0LmV4ZWN1dGUoXG5cdFx0XHRcdFx0XHRzR3JvdXBJZCxcblx0XHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdG9wZXJhdGlvbnNIZWxwZXIuZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkLmJpbmQoXG5cdFx0XHRcdFx0XHRcdG9wZXJhdGlvbnMsXG5cdFx0XHRcdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50X2NvbnRleHRfaW5kZXgsXG5cdFx0XHRcdFx0XHRcdG9BY3Rpb24uZ2V0Q29udGV4dCgpLFxuXHRcdFx0XHRcdFx0XHRpQ29udGV4dExlbmd0aCxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXJcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aGFuZGxlNDEyRmFpbGVkVHJhbnNpdGlvbnMoXG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0XHRvQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRzR3JvdXBJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudF9jb250ZXh0X2luZGV4LFxuXHRcdFx0XHRcdFx0XHRpQ29udGV4dExlbmd0aCxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUob0FjdGlvbi5nZXRCb3VuZENvbnRleHQoKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aGFuZGxlNDEyRmFpbGVkVHJhbnNpdGlvbnMoXG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0XHRvQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRzR3JvdXBJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudF9jb250ZXh0X2luZGV4LFxuXHRcdFx0XHRcdFx0XHRpQ29udGV4dExlbmd0aCxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHQ6IG9BY3Rpb25cblx0XHRcdFx0XHQuZXhlY3V0ZShcblx0XHRcdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0b3BlcmF0aW9uc0hlbHBlci5mbk9uU3RyaWN0SGFuZGxpbmdGYWlsZWQuYmluZChcblx0XHRcdFx0XHRcdFx0b3BlcmF0aW9ucyxcblx0XHRcdFx0XHRcdFx0c0dyb3VwSWQsXG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRfY29udGV4dF9pbmRleCxcblx0XHRcdFx0XHRcdFx0b0FjdGlvbi5nZXRDb250ZXh0KCksXG5cdFx0XHRcdFx0XHRcdGlDb250ZXh0TGVuZ3RoLFxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlSGFuZGxlclxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzdWx0OiBhbnkpIHtcblx0XHRcdFx0XHRcdGhhbmRsZTQxMkZhaWxlZFRyYW5zaXRpb25zKFxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdFx0b0FjdGlvbixcblx0XHRcdFx0XHRcdFx0c0dyb3VwSWQsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRfY29udGV4dF9pbmRleCxcblx0XHRcdFx0XHRcdFx0aUNvbnRleHRMZW5ndGgsXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyLFxuXHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGVcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aGFuZGxlNDEyRmFpbGVkVHJhbnNpdGlvbnMoXG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0XHRvQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRzR3JvdXBJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudF9jb250ZXh0X2luZGV4LFxuXHRcdFx0XHRcdFx0XHRpQ29udGV4dExlbmd0aCxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xuXHRcdFx0XHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIG9BY3Rpb25Qcm9taXNlLmNhdGNoKCgpID0+IHtcblx0XHR0aHJvdyBDb25zdGFudHMuQWN0aW9uRXhlY3V0aW9uRmFpbGVkO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIF9leGVjdXRlQWN0aW9uKG9BcHBDb21wb25lbnQ6IGFueSwgbVBhcmFtZXRlcnM6IGFueSwgb1BhcmVudENvbnRyb2w/OiBhbnksIG1lc3NhZ2VIYW5kbGVyPzogTWVzc2FnZUhhbmRsZXIpIHtcblx0Y29uc3QgYUNvbnRleHRzID0gbVBhcmFtZXRlcnMuYUNvbnRleHRzIHx8IFtdO1xuXHRjb25zdCBvTW9kZWwgPSBtUGFyYW1ldGVycy5tb2RlbDtcblx0Y29uc3QgYUFjdGlvblBhcmFtZXRlcnMgPSBtUGFyYW1ldGVycy5hQWN0aW9uUGFyYW1ldGVycyB8fCBbXTtcblx0Y29uc3Qgc0FjdGlvbk5hbWUgPSBtUGFyYW1ldGVycy5hY3Rpb25OYW1lO1xuXHRjb25zdCBmbk9uU3VibWl0dGVkID0gbVBhcmFtZXRlcnMuZm5PblN1Ym1pdHRlZDtcblx0Y29uc3QgZm5PblJlc3BvbnNlID0gbVBhcmFtZXRlcnMuZm5PblJlc3BvbnNlO1xuXHRjb25zdCBvUmVzb3VyY2VCdW5kbGUgPSBvUGFyZW50Q29udHJvbCAmJiBvUGFyZW50Q29udHJvbC5pc0EoXCJzYXAudWkuY29yZS5tdmMuVmlld1wiKSAmJiBvUGFyZW50Q29udHJvbC5nZXRDb250cm9sbGVyKCkub1Jlc291cmNlQnVuZGxlO1xuXHRsZXQgb0FjdGlvbjogYW55O1xuXG5cdGZ1bmN0aW9uIHNldEFjdGlvblBhcmFtZXRlckRlZmF1bHRWYWx1ZSgpIHtcblx0XHRpZiAoYUFjdGlvblBhcmFtZXRlcnMgJiYgYUFjdGlvblBhcmFtZXRlcnMubGVuZ3RoKSB7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGFBY3Rpb25QYXJhbWV0ZXJzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGlmICghYUFjdGlvblBhcmFtZXRlcnNbal0udmFsdWUpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKGFBY3Rpb25QYXJhbWV0ZXJzW2pdLiRUeXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIFwiRWRtLlN0cmluZ1wiOlxuXHRcdFx0XHRcdFx0XHRhQWN0aW9uUGFyYW1ldGVyc1tqXS52YWx1ZSA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIkVkbS5Cb29sZWFuXCI6XG5cdFx0XHRcdFx0XHRcdGFBY3Rpb25QYXJhbWV0ZXJzW2pdLnZhbHVlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIkVkbS5CeXRlXCI6XG5cdFx0XHRcdFx0XHRjYXNlIFwiRWRtLkludDE2XCI6XG5cdFx0XHRcdFx0XHRjYXNlIFwiRWRtLkludDMyXCI6XG5cdFx0XHRcdFx0XHRjYXNlIFwiRWRtLkludDY0XCI6XG5cdFx0XHRcdFx0XHRcdGFBY3Rpb25QYXJhbWV0ZXJzW2pdLnZhbHVlID0gMDtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHQvLyB0YmNcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRvQWN0aW9uLnNldFBhcmFtZXRlcihhQWN0aW9uUGFyYW1ldGVyc1tqXS4kTmFtZSwgYUFjdGlvblBhcmFtZXRlcnNbal0udmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmIChhQ29udGV4dHMubGVuZ3RoKSB7XG5cdFx0Ly8gVE9ETzogcmVmYWN0b3IgdG8gZGlyZWN0IHVzZSBvZiBQcm9taXNlLmFsbFNldHRsZWRcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG5cdFx0XHRjb25zdCBtQmluZGluZ1BhcmFtZXRlcnMgPSBtUGFyYW1ldGVycy5tQmluZGluZ1BhcmFtZXRlcnM7XG5cdFx0XHRjb25zdCBiR3JvdXBlZCA9IG1QYXJhbWV0ZXJzLmJHcm91cGVkO1xuXHRcdFx0Y29uc3QgYkdldEJvdW5kQ29udGV4dCA9IG1QYXJhbWV0ZXJzLmJHZXRCb3VuZENvbnRleHQ7XG5cdFx0XHRpZiAobVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQgJiYgIW1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiNDEyRXhlY3V0ZWRcIikpIHtcblx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJzdHJpY3RIYW5kbGluZ1Byb21pc2VzXCIsIFtdKTtcblx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJzdHJpY3RIYW5kbGluZ0ZhaWxzXCIsIFtdKTtcblx0XHRcdFx0bVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiLCBbXSk7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwicHJvY2Vzc2VkTWVzc2FnZUlkc1wiLCBbXSk7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiRGVsYXlNZXNzYWdlc1wiLCBbXSk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBhQWN0aW9uUHJvbWlzZXM6IGFueVtdID0gW107XG5cdFx0XHRsZXQgb0FjdGlvblByb21pc2U7XG5cdFx0XHRsZXQgaTtcblx0XHRcdGxldCBzR3JvdXBJZDogc3RyaW5nO1xuXHRcdFx0Y29uc3QgZm5FeGVjdXRlQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbkNvbnRleHQ6IGFueSwgY3VycmVudF9jb250ZXh0X2luZGV4OiBhbnksIG9TaWRlRWZmZWN0OiBhbnksIGlDb250ZXh0TGVuZ3RoOiBhbnkpIHtcblx0XHRcdFx0c2V0QWN0aW9uUGFyYW1ldGVyRGVmYXVsdFZhbHVlKCk7XG5cdFx0XHRcdC8vIEZvciBpbnZvY2F0aW9uIGdyb3VwaW5nIFwiaXNvbGF0ZWRcIiBuZWVkIGJhdGNoIGdyb3VwIHBlciBhY3Rpb24gY2FsbFxuXHRcdFx0XHRzR3JvdXBJZCA9ICFiR3JvdXBlZCA/IGAkYXV0by4ke2N1cnJlbnRfY29udGV4dF9pbmRleH1gIDogYWN0aW9uQ29udGV4dC5nZXRVcGRhdGVHcm91cElkKCk7XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLnJlcXVlc3RTaWRlRWZmZWN0cyA9IGZuUmVxdWVzdFNpZGVFZmZlY3RzLmJpbmQob3BlcmF0aW9ucywgb0FwcENvbXBvbmVudCwgb1NpZGVFZmZlY3QsIG1QYXJhbWV0ZXJzKTtcblx0XHRcdFx0b0FjdGlvblByb21pc2UgPSBleGVjdXRlRGVwZW5kaW5nT25TZWxlY3RlZENvbnRleHRzKFxuXHRcdFx0XHRcdGFjdGlvbkNvbnRleHQsXG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMsXG5cdFx0XHRcdFx0YkdldEJvdW5kQ29udGV4dCxcblx0XHRcdFx0XHRzR3JvdXBJZCxcblx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdFx0aUNvbnRleHRMZW5ndGgsXG5cdFx0XHRcdFx0Y3VycmVudF9jb250ZXh0X2luZGV4XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGFBY3Rpb25Qcm9taXNlcy5wdXNoKG9BY3Rpb25Qcm9taXNlKTtcblx0XHRcdFx0Zm5SZXF1ZXN0U2lkZUVmZmVjdHMob0FwcENvbXBvbmVudCwgb1NpZGVFZmZlY3QsIG1QYXJhbWV0ZXJzLCBzR3JvdXBJZCk7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgZm5FeGVjdXRlU2luZ2xlQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbkNvbnRleHQ6IGFueSwgY3VycmVudF9jb250ZXh0X2luZGV4OiBhbnksIG9TaWRlRWZmZWN0OiBhbnksIGlDb250ZXh0TGVuZ3RoOiBhbnkpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvcGFyYW0tbmFtZXNcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChhY3Rpb25SZXNvbHZlKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgYUxvY2FsUHJvbWlzZTogYW55ID0gW107XG5cdFx0XHRcdFx0c2V0QWN0aW9uUGFyYW1ldGVyRGVmYXVsdFZhbHVlKCk7XG5cdFx0XHRcdFx0Ly8gRm9yIGludm9jYXRpb24gZ3JvdXBpbmcgXCJpc29sYXRlZFwiIG5lZWQgYmF0Y2ggZ3JvdXAgcGVyIGFjdGlvbiBjYWxsXG5cdFx0XHRcdFx0c0dyb3VwSWQgPSBgYXBpTW9kZSR7Y3VycmVudF9jb250ZXh0X2luZGV4fWA7XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMucmVxdWVzdFNpZGVFZmZlY3RzID0gZm5SZXF1ZXN0U2lkZUVmZmVjdHMuYmluZChcblx0XHRcdFx0XHRcdG9wZXJhdGlvbnMsXG5cdFx0XHRcdFx0XHRvQXBwQ29tcG9uZW50LFxuXHRcdFx0XHRcdFx0b1NpZGVFZmZlY3QsXG5cdFx0XHRcdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHRcdFx0YUxvY2FsUHJvbWlzZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0b0FjdGlvblByb21pc2UgPSBleGVjdXRlRGVwZW5kaW5nT25TZWxlY3RlZENvbnRleHRzKFxuXHRcdFx0XHRcdFx0YWN0aW9uQ29udGV4dCxcblx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0YkdldEJvdW5kQ29udGV4dCxcblx0XHRcdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdFx0XHRpQ29udGV4dExlbmd0aCxcblx0XHRcdFx0XHRcdGN1cnJlbnRfY29udGV4dF9pbmRleFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YUFjdGlvblByb21pc2VzLnB1c2gob0FjdGlvblByb21pc2UpO1xuXHRcdFx0XHRcdGFMb2NhbFByb21pc2UucHVzaChvQWN0aW9uUHJvbWlzZSk7XG5cdFx0XHRcdFx0Zm5SZXF1ZXN0U2lkZUVmZmVjdHMob0FwcENvbXBvbmVudCwgb1NpZGVFZmZlY3QsIG1QYXJhbWV0ZXJzLCBzR3JvdXBJZCwgYUxvY2FsUHJvbWlzZSk7XG5cdFx0XHRcdFx0b01vZGVsLnN1Ym1pdEJhdGNoKHNHcm91cElkKTtcblx0XHRcdFx0XHRQcm9taXNlLmFsbChhTG9jYWxQcm9taXNlKVxuXHRcdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYWN0aW9uUmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhY3Rpb25SZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmdW5jdGlvbiBmbkV4ZWN1dGVTZXF1ZW50aWFsbHkoY29udGV4dHNUb0V4ZWN1dGU6IGFueSkge1xuXHRcdFx0XHQvLyBPbmUgYWN0aW9uIGFuZCBpdHMgc2lkZSBlZmZlY3RzIGFyZSBjb21wbGV0ZWQgYmVmb3JlIHRoZSBuZXh0IGFjdGlvbiBpcyBleGVjdXRlZFxuXHRcdFx0XHQoXG5cdFx0XHRcdFx0Zm5PblN1Ym1pdHRlZCB8fFxuXHRcdFx0XHRcdGZ1bmN0aW9uIG5vb3AoKSB7XG5cdFx0XHRcdFx0XHQvKiovXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpKGFBY3Rpb25Qcm9taXNlcyk7XG5cdFx0XHRcdGZ1bmN0aW9uIHByb2Nlc3NPbmVBY3Rpb24oY29udGV4dDogYW55LCBhY3Rpb25JbmRleDogYW55LCBpQ29udGV4dExlbmd0aDogYW55KSB7XG5cdFx0XHRcdFx0b0FjdGlvbiA9IG9Nb2RlbC5iaW5kQ29udGV4dChgJHtzQWN0aW9uTmFtZX0oLi4uKWAsIGNvbnRleHQsIG1CaW5kaW5nUGFyYW1ldGVycyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZuRXhlY3V0ZVNpbmdsZUFjdGlvbihcblx0XHRcdFx0XHRcdG9BY3Rpb24sXG5cdFx0XHRcdFx0XHRhY3Rpb25JbmRleCxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29udGV4dDogY29udGV4dCxcblx0XHRcdFx0XHRcdFx0cGF0aEV4cHJlc3Npb25zOiBtUGFyYW1ldGVycy5hZGRpdGlvbmFsU2lkZUVmZmVjdCAmJiBtUGFyYW1ldGVycy5hZGRpdGlvbmFsU2lkZUVmZmVjdC5wYXRoRXhwcmVzc2lvbnMsXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXJBY3Rpb25zOiBtUGFyYW1ldGVycy5hZGRpdGlvbmFsU2lkZUVmZmVjdCAmJiBtUGFyYW1ldGVycy5hZGRpdGlvbmFsU2lkZUVmZmVjdC50cmlnZ2VyQWN0aW9uc1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGlDb250ZXh0TGVuZ3RoXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBvQWN0aW9uQW5kU2lkZUVmZmVjdFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdFx0bGV0IGogPSAwO1xuXHRcdFx0XHRjb250ZXh0c1RvRXhlY3V0ZS5mb3JFYWNoKGZ1bmN0aW9uIChjb250ZXh0OiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBpZCA9ICsrajtcblx0XHRcdFx0XHRvQWN0aW9uQW5kU2lkZUVmZmVjdFByb21pc2UgPSBvQWN0aW9uQW5kU2lkZUVmZmVjdFByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHJvY2Vzc09uZUFjdGlvbihjb250ZXh0LCBpZCwgYUNvbnRleHRzLmxlbmd0aCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG9BY3Rpb25BbmRTaWRlRWZmZWN0UHJvbWlzZVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGZuSGFuZGxlUmVzdWx0cygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKG9FcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghYkdyb3VwZWQpIHtcblx0XHRcdFx0Ly8gRm9yIGludm9jYXRpb24gZ3JvdXBpbmcgXCJpc29sYXRlZFwiLCBlbnN1cmUgdGhhdCBlYWNoIGFjdGlvbiBhbmQgbWF0Y2hpbmcgc2lkZSBlZmZlY3RzXG5cdFx0XHRcdC8vIGFyZSBwcm9jZXNzZWQgYmVmb3JlIHRoZSBuZXh0IHNldCBpcyBzdWJtaXR0ZWQuIFdvcmthcm91bmQgdW50aWwgSlNPTiBiYXRjaCBpcyBhdmFpbGFibGUuXG5cdFx0XHRcdC8vIEFsbG93IGFsc28gZm9yIExpc3QgUmVwb3J0LlxuXHRcdFx0XHRmbkV4ZWN1dGVTZXF1ZW50aWFsbHkoYUNvbnRleHRzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhQ29udGV4dHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvQWN0aW9uID0gb01vZGVsLmJpbmRDb250ZXh0KGAke3NBY3Rpb25OYW1lfSguLi4pYCwgYUNvbnRleHRzW2ldLCBtQmluZGluZ1BhcmFtZXRlcnMpO1xuXHRcdFx0XHRcdGZuRXhlY3V0ZUFjdGlvbihcblx0XHRcdFx0XHRcdG9BY3Rpb24sXG5cdFx0XHRcdFx0XHRhQ29udGV4dHMubGVuZ3RoIDw9IDEgPyBudWxsIDogaSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29udGV4dDogYUNvbnRleHRzW2ldLFxuXHRcdFx0XHRcdFx0XHRwYXRoRXhwcmVzc2lvbnM6IG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0ICYmIG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0LnBhdGhFeHByZXNzaW9ucyxcblx0XHRcdFx0XHRcdFx0dHJpZ2dlckFjdGlvbnM6IG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0ICYmIG1QYXJhbWV0ZXJzLmFkZGl0aW9uYWxTaWRlRWZmZWN0LnRyaWdnZXJBY3Rpb25zXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YUNvbnRleHRzLmxlbmd0aFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0KFxuXHRcdFx0XHRcdGZuT25TdWJtaXR0ZWQgfHxcblx0XHRcdFx0XHRmdW5jdGlvbiBub29wKCkge1xuXHRcdFx0XHRcdFx0LyoqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KShhQWN0aW9uUHJvbWlzZXMpO1xuXHRcdFx0XHRmbkhhbmRsZVJlc3VsdHMoKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZm5IYW5kbGVSZXN1bHRzKCkge1xuXHRcdFx0XHQvLyBQcm9taXNlLmFsbFNldHRsZWQgd2lsbCBuZXZlciBiZSByZWplY3RlZC4gSG93ZXZlciwgZXNsaW50IHJlcXVpcmVzIGVpdGhlciBjYXRjaCBvciByZXR1cm4gLSB0aHVzIHdlIHJldHVybiB0aGUgcmVzdWx0aW5nIFByb21pc2UgYWx0aG91Z2ggbm8gb25lIHdpbGwgdXNlIGl0LlxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGxTZXR0bGVkKGFBY3Rpb25Qcm9taXNlcykudGhlbihyZXNvbHZlKTtcblx0XHRcdH1cblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdChcblx0XHRcdFx0Zm5PblJlc3BvbnNlIHx8XG5cdFx0XHRcdGZ1bmN0aW9uIG5vb3AoKSB7XG5cdFx0XHRcdFx0LyoqL1xuXHRcdFx0XHR9XG5cdFx0XHQpKCk7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0b0FjdGlvbiA9IG9Nb2RlbC5iaW5kQ29udGV4dChgLyR7c0FjdGlvbk5hbWV9KC4uLilgKTtcblx0XHRzZXRBY3Rpb25QYXJhbWV0ZXJEZWZhdWx0VmFsdWUoKTtcblx0XHRjb25zdCBzR3JvdXBJZCA9IFwiYWN0aW9uSW1wb3J0XCI7XG5cdFx0Y29uc3Qgb0FjdGlvblByb21pc2UgPSBvQWN0aW9uLmV4ZWN1dGUoXG5cdFx0XHRzR3JvdXBJZCxcblx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdG9wZXJhdGlvbnNIZWxwZXIuZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkLmJpbmQoXG5cdFx0XHRcdG9wZXJhdGlvbnMsXG5cdFx0XHRcdHNHcm91cElkLFxuXHRcdFx0XHR7IGxhYmVsOiBtUGFyYW1ldGVycy5sYWJlbCwgbW9kZWw6IG9Nb2RlbCB9LFxuXHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG1lc3NhZ2VIYW5kbGVyXG5cdFx0XHQpXG5cdFx0KTtcblx0XHRvTW9kZWwuc3VibWl0QmF0Y2goc0dyb3VwSWQpO1xuXHRcdC8vIHRyaWdnZXIgb25TdWJtaXR0ZWQgXCJldmVudFwiXG5cdFx0KFxuXHRcdFx0Zm5PblN1Ym1pdHRlZCB8fFxuXHRcdFx0ZnVuY3Rpb24gbm9vcCgpIHtcblx0XHRcdFx0LyoqL1xuXHRcdFx0fVxuXHRcdCkob0FjdGlvblByb21pc2UpO1xuXHRcdHJldHVybiBvQWN0aW9uUHJvbWlzZS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdChcblx0XHRcdFx0Zm5PblJlc3BvbnNlIHx8XG5cdFx0XHRcdGZ1bmN0aW9uIG5vb3AoKSB7XG5cdFx0XHRcdFx0LyoqL1xuXHRcdFx0XHR9XG5cdFx0XHQpKCk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIF9nZXRQYXRoKG9BY3Rpb25Db250ZXh0OiBhbnksIHNBY3Rpb25OYW1lOiBhbnkpIHtcblx0bGV0IHNQYXRoID0gb0FjdGlvbkNvbnRleHQuZ2V0UGF0aCgpO1xuXHRzUGF0aCA9IG9BY3Rpb25Db250ZXh0LmdldE9iamVjdChcIiRJc0JvdW5kXCIpID8gc1BhdGguc3BsaXQoXCJAJHVpNS5vdmVybG9hZFwiKVswXSA6IHNQYXRoLnNwbGl0KFwiLzBcIilbMF07XG5cdHJldHVybiBzUGF0aC5zcGxpdChgLyR7c0FjdGlvbk5hbWV9YClbMF07XG59XG5cbmZ1bmN0aW9uIF92YWx1ZXNQcm92aWRlZEZvckFsbFBhcmFtZXRlcnMoXG5cdGlzQ3JlYXRlQWN0aW9uOiBib29sZWFuLFxuXHRhY3Rpb25QYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG5cdHBhcmFtZXRlclZhbHVlcz86IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcblx0c3RhcnR1cFBhcmFtZXRlcnM/OiBhbnlcbik6IGJvb2xlYW4ge1xuXHRpZiAocGFyYW1ldGVyVmFsdWVzKSB7XG5cdFx0Ly8gSWYgc2hvd0RpYWxvZyBpcyBmYWxzZSBidXQgdGhlcmUgYXJlIHBhcmFtZXRlcnMgZnJvbSB0aGUgaW52b2tlQWN0aW9uIGNhbGwsIHdlIG5lZWQgdG8gY2hlY2sgdGhhdCB2YWx1ZXMgaGF2ZSBiZWVuXG5cdFx0Ly8gcHJvdmlkZWQgZm9yIGFsbCBvZiB0aGVtXG5cdFx0Zm9yIChjb25zdCBhY3Rpb25QYXJhbWV0ZXIgb2YgYWN0aW9uUGFyYW1ldGVycykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRhY3Rpb25QYXJhbWV0ZXIuJE5hbWUgIT09IFwiUmVzdWx0SXNBY3RpdmVFbnRpdHlcIiAmJlxuXHRcdFx0XHQhcGFyYW1ldGVyVmFsdWVzPy5maW5kKChlbGVtZW50OiBhbnkpID0+IGVsZW1lbnQubmFtZSA9PT0gYWN0aW9uUGFyYW1ldGVyLiROYW1lKVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIEF0IGxlYXN0IGZvciBvbmUgcGFyYW1ldGVyIG5vIHZhbHVlIGhhcyBiZWVuIHByb3ZpZGVkLCBzbyB3ZSBjYW4ndCBza2lwIHRoZSBkaWFsb2dcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmIChpc0NyZWF0ZUFjdGlvbiAmJiBzdGFydHVwUGFyYW1ldGVycykge1xuXHRcdC8vIElmIHBhcmFtZXRlcnMgaGF2ZSBiZWVuIHByb3ZpZGVkIGR1cmluZyBhcHBsaWNhdGlvbiBsYXVuY2gsIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIHNldCBpcyBjb21wbGV0ZVxuXHRcdC8vIElmIG5vdCwgdGhlIHBhcmFtZXRlciBkaWFsb2cgc3RpbGwgbmVlZHMgdG8gYmUgc2hvd24uXG5cdFx0Zm9yIChjb25zdCBhY3Rpb25QYXJhbWV0ZXIgb2YgYWN0aW9uUGFyYW1ldGVycykge1xuXHRcdFx0aWYgKCFzdGFydHVwUGFyYW1ldGVyc1thY3Rpb25QYXJhbWV0ZXIuJE5hbWVdKSB7XG5cdFx0XHRcdC8vIEF0IGxlYXN0IGZvciBvbmUgcGFyYW1ldGVyIG5vIHZhbHVlIGhhcyBiZWVuIHByb3ZpZGVkLCBzbyB3ZSBjYW4ndCBza2lwIHRoZSBkaWFsb2dcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZm5SZXF1ZXN0U2lkZUVmZmVjdHMob0FwcENvbXBvbmVudDogYW55LCBvU2lkZUVmZmVjdDogYW55LCBtUGFyYW1ldGVyczogYW55LCBzR3JvdXBJZDogYW55LCBhTG9jYWxQcm9taXNlPzogYW55KSB7XG5cdGNvbnN0IG9TaWRlRWZmZWN0c1NlcnZpY2UgPSBvQXBwQ29tcG9uZW50LmdldFNpZGVFZmZlY3RzU2VydmljZSgpO1xuXHRsZXQgb0xvY2FsUHJvbWlzZTtcblx0Ly8gdHJpZ2dlciBhY3Rpb25zIGZyb20gc2lkZSBlZmZlY3RzXG5cdGlmIChvU2lkZUVmZmVjdCAmJiBvU2lkZUVmZmVjdC50cmlnZ2VyQWN0aW9ucyAmJiBvU2lkZUVmZmVjdC50cmlnZ2VyQWN0aW9ucy5sZW5ndGgpIHtcblx0XHRvU2lkZUVmZmVjdC50cmlnZ2VyQWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzVHJpZ2dlckFjdGlvbjogYW55KSB7XG5cdFx0XHRpZiAoc1RyaWdnZXJBY3Rpb24pIHtcblx0XHRcdFx0b0xvY2FsUHJvbWlzZSA9IG9TaWRlRWZmZWN0c1NlcnZpY2UuZXhlY3V0ZUFjdGlvbihzVHJpZ2dlckFjdGlvbiwgb1NpZGVFZmZlY3QuY29udGV4dCwgc0dyb3VwSWQpO1xuXHRcdFx0XHRpZiAoYUxvY2FsUHJvbWlzZSkge1xuXHRcdFx0XHRcdGFMb2NhbFByb21pc2UucHVzaChvTG9jYWxQcm9taXNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdC8vIHJlcXVlc3Qgc2lkZSBlZmZlY3RzIGZvciB0aGlzIGFjdGlvblxuXHQvLyBhcyB3ZSBtb3ZlIHRoZSBtZXNzYWdlcyByZXF1ZXN0IHRvIFBPU1QgJHNlbGVjdCB3ZSBuZWVkIHRvIGJlIHByZXBhcmVkIGZvciBhbiBlbXB0eSBhcnJheVxuXHRpZiAob1NpZGVFZmZlY3QgJiYgb1NpZGVFZmZlY3QucGF0aEV4cHJlc3Npb25zICYmIG9TaWRlRWZmZWN0LnBhdGhFeHByZXNzaW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0b0xvY2FsUHJvbWlzZSA9IG9TaWRlRWZmZWN0c1NlcnZpY2UucmVxdWVzdFNpZGVFZmZlY3RzKG9TaWRlRWZmZWN0LnBhdGhFeHByZXNzaW9ucywgb1NpZGVFZmZlY3QuY29udGV4dCwgc0dyb3VwSWQpO1xuXHRcdGlmIChhTG9jYWxQcm9taXNlKSB7XG5cdFx0XHRhTG9jYWxQcm9taXNlLnB1c2gob0xvY2FsUHJvbWlzZSk7XG5cdFx0fVxuXHRcdG9Mb2NhbFByb21pc2Vcblx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKG1QYXJhbWV0ZXJzLm9wZXJhdGlvbkF2YWlsYWJsZU1hcCAmJiBtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dCkge1xuXHRcdFx0XHRcdEFjdGlvblJ1bnRpbWUuc2V0QWN0aW9uRW5hYmxlbWVudChcblx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LFxuXHRcdFx0XHRcdFx0SlNPTi5wYXJzZShtUGFyYW1ldGVycy5vcGVyYXRpb25BdmFpbGFibGVNYXApLFxuXHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuc2VsZWN0ZWRJdGVtcyxcblx0XHRcdFx0XHRcdFwidGFibGVcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJlcXVlc3Rpbmcgc2lkZSBlZmZlY3RzXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fVxufVxuXG4vKipcbiAqIFN0YXRpYyBmdW5jdGlvbnMgdG8gY2FsbCBPRGF0YSBhY3Rpb25zIChib3VuZC9pbXBvcnQpIGFuZCBmdW5jdGlvbnMgKGJvdW5kL2ltcG9ydClcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAYWxpYXMgc2FwLmZlLmNvcmUuYWN0aW9ucy5vcGVyYXRpb25zXG4gKiBAcHJpdmF0ZVxuICogQGV4cGVyaW1lbnRhbCBUaGlzIG1vZHVsZSBpcyBvbmx5IGZvciBleHBlcmltZW50YWwgdXNlISA8YnIvPjxiPlRoaXMgaXMgb25seSBhIFBPQyBhbmQgbWF5YmUgZGVsZXRlZDwvYj5cbiAqIEBzaW5jZSAxLjU2LjBcbiAqL1xuY29uc3Qgb3BlcmF0aW9ucyA9IHtcblx0Y2FsbEJvdW5kQWN0aW9uOiBjYWxsQm91bmRBY3Rpb24sXG5cdGNhbGxBY3Rpb25JbXBvcnQ6IGNhbGxBY3Rpb25JbXBvcnQsXG5cdGNhbGxCb3VuZEZ1bmN0aW9uOiBjYWxsQm91bmRGdW5jdGlvbixcblx0Y2FsbEZ1bmN0aW9uSW1wb3J0OiBjYWxsRnVuY3Rpb25JbXBvcnQsXG5cdGV4ZWN1dGVEZXBlbmRpbmdPblNlbGVjdGVkQ29udGV4dHM6IGV4ZWN1dGVEZXBlbmRpbmdPblNlbGVjdGVkQ29udGV4dHMsXG5cdHZhbHVlc1Byb3ZpZGVkRm9yQWxsUGFyYW1ldGVyczogX3ZhbHVlc1Byb3ZpZGVkRm9yQWxsUGFyYW1ldGVycyxcblx0Z2V0QWN0aW9uUGFyYW1ldGVyQWN0aW9uTmFtZTogX2dldEFjdGlvblBhcmFtZXRlckFjdGlvbk5hbWUsXG5cdGFjdGlvblBhcmFtZXRlclNob3dNZXNzYWdlQ2FsbGJhY2s6IGFjdGlvblBhcmFtZXRlclNob3dNZXNzYWdlQ2FsbGJhY2ssXG5cdGFmdGVyQWN0aW9uUmVzb2x1dGlvbjogYWZ0ZXJBY3Rpb25SZXNvbHV0aW9uXG59O1xuXG5leHBvcnQgZGVmYXVsdCBvcGVyYXRpb25zO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O0VBa2pCTyxnQkFBZ0JBLElBQWhCLEVBQXNCQyxPQUF0QixFQUErQjtJQUNyQyxJQUFJO01BQ0gsSUFBSUMsTUFBTSxHQUFHRixJQUFJLEVBQWpCO0lBQ0EsQ0FGRCxDQUVFLE9BQU1HLENBQU4sRUFBUztNQUNWLE9BQU9GLE9BQU8sQ0FBQ0UsQ0FBRCxDQUFkO0lBQ0E7O0lBQ0QsSUFBSUQsTUFBTSxJQUFJQSxNQUFNLENBQUNFLElBQXJCLEVBQTJCO01BQzFCLE9BQU9GLE1BQU0sQ0FBQ0UsSUFBUCxDQUFZLEtBQUssQ0FBakIsRUFBb0JILE9BQXBCLENBQVA7SUFDQTs7SUFDRCxPQUFPQyxNQUFQO0VBQ0E7O0VBR00sMEJBQTBCRixJQUExQixFQUFnQ0ssU0FBaEMsRUFBMkM7SUFDakQsSUFBSTtNQUNILElBQUlILE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFPRyxDQUFQLEVBQVU7TUFDWCxPQUFPRSxTQUFTLENBQUMsSUFBRCxFQUFPRixDQUFQLENBQWhCO0lBQ0E7O0lBQ0QsSUFBSUQsTUFBTSxJQUFJQSxNQUFNLENBQUNFLElBQXJCLEVBQTJCO01BQzFCLE9BQU9GLE1BQU0sQ0FBQ0UsSUFBUCxDQUFZQyxTQUFTLENBQUNDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEtBQXJC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