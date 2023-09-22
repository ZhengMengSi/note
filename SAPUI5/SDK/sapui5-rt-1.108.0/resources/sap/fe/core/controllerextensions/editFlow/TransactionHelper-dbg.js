/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/editFlow/draft", "sap/fe/core/controllerextensions/editFlow/operations", "sap/fe/core/controllerextensions/editFlow/sticky", "sap/fe/core/controllerextensions/messageHandler/messageHandling", "sap/fe/core/helpers/FPMHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/library", "sap/m/Button", "sap/m/CheckBox", "sap/m/Dialog", "sap/m/MessageBox", "sap/m/MessageToast", "sap/m/Popover", "sap/m/Text", "sap/m/VBox", "sap/ui/core/Core", "sap/ui/core/Fragment", "sap/ui/core/library", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/model/json/JSONModel", "../../helpers/ToES6Promise"], function (Log, CommonUtils, BusyLocker, draft, operations, sticky, messageHandling, FPMHelper, ModelHelper, FELibrary, Button, CheckBox, Dialog, MessageBox, MessageToast, Popover, Text, VBox, Core, Fragment, coreLibrary, XMLPreprocessor, XMLTemplateProcessor, JSONModel, toES6Promise) {
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

  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      var observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  var _Pact = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      var result = new _Pact();
      var state = this.s;

      if (state) {
        var callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          var value = _this.v;

          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _switch(discriminant, cases) {
    var dispatchIndex = -1;
    var awaitBody;

    outer: {
      for (var i = 0; i < cases.length; i++) {
        var test = cases[i][0];

        if (test) {
          var testValue = test();

          if (testValue && testValue.then) {
            break outer;
          }

          if (testValue === discriminant) {
            dispatchIndex = i;
            break;
          }
        } else {
          // Found the default case, set it as the pending dispatch case
          dispatchIndex = i;
        }
      }

      if (dispatchIndex !== -1) {
        do {
          var body = cases[dispatchIndex][1];

          while (!body) {
            dispatchIndex++;
            body = cases[dispatchIndex][1];
          }

          var result = body();

          if (result && result.then) {
            awaitBody = true;
            break outer;
          }

          var fallthroughCheck = cases[dispatchIndex][2];
          dispatchIndex++;
        } while (fallthroughCheck && !fallthroughCheck());

        return result;
      }
    }

    var pact = new _Pact();

    var reject = _settle.bind(null, pact, 2);

    (awaitBody ? result.then(_resumeAfterBody) : testValue.then(_resumeAfterTest)).then(void 0, reject);
    return pact;

    function _resumeAfterTest(value) {
      for (;;) {
        if (value === discriminant) {
          dispatchIndex = i;
          break;
        }

        if (++i === cases.length) {
          if (dispatchIndex !== -1) {
            break;
          } else {
            _settle(pact, 1, result);

            return;
          }
        }

        test = cases[i][0];

        if (test) {
          value = test();

          if (value && value.then) {
            value.then(_resumeAfterTest).then(void 0, reject);
            return;
          }
        } else {
          dispatchIndex = i;
        }
      }

      do {
        var body = cases[dispatchIndex][1];

        while (!body) {
          dispatchIndex++;
          body = cases[dispatchIndex][1];
        }

        var result = body();

        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
          return;
        }

        var fallthroughCheck = cases[dispatchIndex][2];
        dispatchIndex++;
      } while (fallthroughCheck && !fallthroughCheck());

      _settle(pact, 1, result);
    }

    function _resumeAfterBody(result) {
      for (;;) {
        var fallthroughCheck = cases[dispatchIndex][2];

        if (!fallthroughCheck || fallthroughCheck()) {
          break;
        }

        dispatchIndex++;
        var body = cases[dispatchIndex][1];

        while (!body) {
          dispatchIndex++;
          body = cases[dispatchIndex][1];
        }

        result = body();

        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
          return;
        }
      }

      _settle(pact, 1, result);
    }
  }

  var CreationMode = FELibrary.CreationMode;
  var ProgrammingModel = FELibrary.ProgrammingModel;
  var ValueState = coreLibrary.ValueState;
  /* Make sure that the mParameters is not the oEvent */

  function getParameters(mParameters) {
    if (mParameters && mParameters.getMetadata && mParameters.getMetadata().getName() === "sap.ui.base.Event") {
      mParameters = {};
    }

    return mParameters || {};
  }

  var TransactionHelper = /*#__PURE__*/function () {
    function TransactionHelper(oAppComponent, oLockObject) {
      this._bIsModified = false;
      this._bCreateMode = false;
      this._bContinueDiscard = false;
      this._oAppComponent = oAppComponent;
      this.oLockObject = oLockObject;
    }

    var _proto = TransactionHelper.prototype;

    _proto.getProgrammingModel = function getProgrammingModel(oContext) {
      if (!this.sProgrammingModel && oContext) {
        var sPath;

        if (oContext.isA("sap.ui.model.odata.v4.Context")) {
          sPath = oContext.getPath();
        } else {
          sPath = oContext.isRelative() ? oContext.getResolvedPath() : oContext.getPath();
        }

        if (ModelHelper.isDraftSupported(oContext.getModel().getMetaModel(), sPath)) {
          this.sProgrammingModel = ProgrammingModel.Draft;
        } else if (ModelHelper.isStickySessionSupported(oContext.getModel().getMetaModel())) {
          this.sProgrammingModel = ProgrammingModel.Sticky;
        } else {
          // as the transaction helper is a singleton we don't store the non draft as the user could
          // start with a non draft child page and navigates back to a draft enabled one
          return ProgrammingModel.NonDraft;
        }
      }

      return this.sProgrammingModel;
    }
    /**
     * Validates a document.
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param oContext Context of the document to be validated
     * @param [mParameters] Can contain the following attributes:
     * @param [mParameters.data] A map of data that should be validated
     * @param [mParameters.customValidationFunction] A string representing the path to the validation function
     * @param oView Contains the object of the current view
     * @returns Promise resolves with result of the custom validation function
     * @ui5-restricted
     * @final
     */
    ;

    _proto.validateDocument = function validateDocument(oContext, mParameters, oView) {
      var sCustomValidationFunction = mParameters && mParameters.customValidationFunction;

      if (sCustomValidationFunction) {
        var sModule = sCustomValidationFunction.substring(0, sCustomValidationFunction.lastIndexOf(".") || -1).replace(/\./gi, "/"),
            sFunctionName = sCustomValidationFunction.substring(sCustomValidationFunction.lastIndexOf(".") + 1, sCustomValidationFunction.length),
            mData = mParameters.data;
        delete mData["@$ui5.context.isTransient"];
        return FPMHelper.validationWrapper(sModule, sFunctionName, mData, oView, oContext);
      }

      return Promise.resolve([]);
    }
    /**
     * Creates a new document.
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param oMainListBinding OData V4 ListBinding object
     * @param [mInParameters] Optional, can contain the following attributes:
     * @param [mInParameters.data] A map of data that should be sent within the POST
     * @param [mInParameters.busyMode] Global (default), Local, None TODO: to be refactored
     * @param [mInParameters.busyId] ID of the local busy indicator
     * @param [mInParameters.keepTransientContextOnFailed] If set, the context stays in the list if the POST failed and POST will be repeated with the next change
     * @param [mInParameters.inactive] If set, the context is set as inactive for empty rows
     * @param [mInParameters.skipParameterDialog] Skips the action parameter dialog
     * @param oResourceBundle
     * @param messageHandler
     * @param bFromCopyPaste
     * @param oView The current view
     * @returns Promise resolves with new binding context
     * @ui5-restricted
     * @final
     */
    ;

    _proto.createDocument = function createDocument(oMainListBinding, mInParameters, oResourceBundle, messageHandler) {
      var bFromCopyPaste = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var oView = arguments.length > 5 ? arguments[5] : undefined;

      try {
        var _exit2 = false;

        var _this2 = this;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var oModel = oMainListBinding.getModel(),
            oMetaModel = oModel.getMetaModel(),
            sMetaPath = oMetaModel.getMetaPath(oMainListBinding.getHeaderContext().getPath()),
            sCreateHash = _this2._getAppComponent().getRouterProxy().getHash(),
            oComponentData = _this2._getAppComponent().getComponentData(),
            oStartupParameters = oComponentData && oComponentData.startupParameters || {},
            sNewAction = !oMainListBinding.isRelative() ? _this2._getNewAction(oStartupParameters, sCreateHash, oMetaModel, sMetaPath) : undefined;

        var mBindingParameters = {
          "$$patchWithoutSideEffects": true
        };
        var sMessagesPath = oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.Common.v1.Messages/$Path"));
        var sBusyPath = "/busy";
        var sFunctionName = oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Common.v1.DefaultValuesFunction")) || oMetaModel.getObject("".concat(ModelHelper.getTargetEntitySet(oMetaModel.getContext(sMetaPath)), "@com.sap.vocabularies.Common.v1.DefaultValuesFunction"));
        var bFunctionOnNavProp;
        var oNewDocumentContext;

        if (sFunctionName) {
          if (oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Common.v1.DefaultValuesFunction")) && ModelHelper.getTargetEntitySet(oMetaModel.getContext(sMetaPath)) !== sMetaPath) {
            bFunctionOnNavProp = true;
          } else {
            bFunctionOnNavProp = false;
          }
        }

        if (sMessagesPath) {
          mBindingParameters["$select"] = sMessagesPath;
        }

        var mParameters = getParameters(mInParameters);

        if (!oMainListBinding) {
          throw new Error("Binding required for new document creation");
        }

        var sProgrammingModel = _this2.getProgrammingModel(oMainListBinding);

        if (sProgrammingModel !== ProgrammingModel.Draft && sProgrammingModel !== ProgrammingModel.Sticky) {
          throw new Error("Create document only allowed for draft or sticky session supported services");
        }

        if (mParameters.busyMode === "Local") {
          sBusyPath = "/busyLocal/".concat(mParameters.busyId);
        }

        mParameters.beforeCreateCallBack = bFromCopyPaste ? null : mParameters.beforeCreateCallBack;
        BusyLocker.lock(_this2.oLockObject, sBusyPath);
        var oResourceBundleCore = Core.getLibraryResourceBundle("sap.fe.core");
        var oResult;
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            function _temp8(_result) {
              if (_exit2) return _result;

              if (!oMainListBinding.isRelative()) {
                // the create mode shall currently only be set on creating a root document
                _this2._bCreateMode = true;
              }

              oNewDocumentContext = oNewDocumentContext || oResult; // TODO: where does this one coming from???

              if (bConsiderDocumentModified) {
                _this2.handleDocumentModifications();
              }

              return Promise.resolve(messageHandler.showMessageDialog()).then(function () {
                return oNewDocumentContext;
              });
            }

            var bConsiderDocumentModified = false;

            var _temp7 = function () {
              if (sNewAction) {
                bConsiderDocumentModified = true;
                return Promise.resolve(_this2.callAction(sNewAction, {
                  contexts: oMainListBinding.getHeaderContext(),
                  showActionParameterDialog: true,
                  label: _this2._getSpecificCreateActionDialogLabel(oMetaModel, sMetaPath, sNewAction, oResourceBundleCore),
                  bindingParameters: mBindingParameters,
                  parentControl: mParameters.parentControl,
                  bIsCreateAction: true,
                  skipParameterDialog: mParameters.skipParameterDialog
                }, null, messageHandler)).then(function (_this$callAction) {
                  oResult = _this$callAction;
                });
              } else {
                var bIsNewPageCreation = mParameters.creationMode !== CreationMode.CreationRow && mParameters.creationMode !== CreationMode.Inline;
                var aNonComputedVisibleKeyFields = bIsNewPageCreation ? CommonUtils.getNonComputedVisibleFields(oMetaModel, sMetaPath, oView) : [];
                sFunctionName = bFromCopyPaste ? null : sFunctionName;
                var sFunctionPath, oFunctionContext;

                if (sFunctionName) {
                  //bound to the source entity:
                  if (bFunctionOnNavProp) {
                    sFunctionPath = oMainListBinding.getContext() && "".concat(oMetaModel.getMetaPath(oMainListBinding.getContext().getPath()), "/").concat(sFunctionName);
                    oFunctionContext = oMainListBinding.getContext();
                  } else {
                    sFunctionPath = oMainListBinding.getHeaderContext() && "".concat(oMetaModel.getMetaPath(oMainListBinding.getHeaderContext().getPath()), "/").concat(sFunctionName);
                    oFunctionContext = oMainListBinding.getHeaderContext();
                  }
                }

                var oFunction = sFunctionPath && oMetaModel.createBindingContext(sFunctionPath);
                return _catch(function () {
                  function _temp6(_result2) {
                    if (_exit2) return _result2;
                    mParameters.data = oData ? Object.assign({}, oData, mParameters.data) : mParameters.data;

                    if (mParameters.data) {
                      delete mParameters.data["@odata.context"];
                    }

                    var _temp4 = function () {
                      if (aNonComputedVisibleKeyFields.length > 0) {
                        return Promise.resolve(_this2._launchDialogWithKeyFields(oMainListBinding, aNonComputedVisibleKeyFields, oModel, mParameters, messageHandler)).then(function (_this$_launchDialogWi) {
                          oResult = _this$_launchDialogWi;
                          oNewDocumentContext = oResult.newContext;
                        });
                      } else {
                        function _temp9() {
                          oNewDocumentContext = oMainListBinding.create(mParameters.data, true, mParameters.createAtEnd, mParameters.inactive);

                          var _temp = function () {
                            if (!mParameters.inactive) {
                              return Promise.resolve(_this2.onAfterCreateCompletion(oMainListBinding, oNewDocumentContext, mParameters)).then(function (_this$onAfterCreateCo) {
                                oResult = _this$onAfterCreateCo;
                              });
                            }
                          }();

                          if (_temp && _temp.then) return _temp.then(function () {});
                        }

                        var _temp10 = function () {
                          if (mParameters.beforeCreateCallBack) {
                            return Promise.resolve(toES6Promise(mParameters.beforeCreateCallBack({
                              contextPath: oMainListBinding && oMainListBinding.getPath()
                            }))).then(function () {});
                          }
                        }();

                        return _temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10);
                      }
                    }();

                    if (_temp4 && _temp4.then) return _temp4.then(function () {});
                  }

                  var oData;

                  var _temp5 = _catch(function () {
                    return Promise.resolve(oFunction && oFunction.getObject() && oFunction.getObject()[0].$IsBound ? operations.callBoundFunction(sFunctionName, oFunctionContext, oModel) : operations.callFunctionImport(sFunctionName, oModel)).then(function (oContext) {
                      if (oContext) {
                        oData = oContext.getObject();
                      }
                    });
                  }, function (oError) {
                    Log.error("Error while executing the function ".concat(sFunctionName), oError);
                    throw oError;
                  });

                  return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
                }, function (oError) {
                  Log.error("Error while creating the new document", oError);
                  throw oError;
                });
              }
            }();

            return _temp7 && _temp7.then ? _temp7.then(_temp8) : _temp8(_temp7);
          }, function (error) {
            // TODO: currently, the only errors handled here are raised as string - should be changed to Error objects
            return Promise.resolve(messageHandler.showMessageDialog()).then(function () {
              var _oNewDocumentContext;

              if ((error === FELibrary.Constants.ActionExecutionFailed || error === FELibrary.Constants.CancelActionDialog) && (_oNewDocumentContext = oNewDocumentContext) !== null && _oNewDocumentContext !== void 0 && _oNewDocumentContext.isTransient()) {
                // This is a workaround suggested by model as Context.delete results in an error
                // TODO: remove the $direct once model resolves this issue
                // this line shows the expected console error Uncaught (in promise) Error: Request canceled: POST Travel; group: submitLater
                oNewDocumentContext.delete("$direct");
              }

              throw error;
            });
          });
        }, function (_wasThrown, _result4) {
          BusyLocker.unlock(_this2.oLockObject, sBusyPath);
          if (_wasThrown) throw _result4;
          return _result4;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Find the active contexts of the documents, only for the draft roots.
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param aContexts Contexts Either one context or an array with contexts to be deleted
     * @param bFindActiveContexts
     * @returns Array of the active contexts
     */
    ;

    _proto.findActiveDraftRootContexts = function findActiveDraftRootContexts(aContexts, bFindActiveContexts) {
      if (!bFindActiveContexts) {
        return Promise.resolve();
      }

      var activeContexts = aContexts.reduce(function (aResult, oContext) {
        var oMetaModel = oContext.getModel().getMetaModel();
        var sMetaPath = oMetaModel.getMetaPath(oContext.getPath());

        if (oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Common.v1.DraftRoot"))) {
          var bIsActiveEntity = oContext.getObject().IsActiveEntity,
              bHasActiveEntity = oContext.getObject().HasActiveEntity;

          if (!bIsActiveEntity && bHasActiveEntity) {
            var oActiveContext = oContext.getModel().bindContext("".concat(oContext.getPath(), "/SiblingEntity")).getBoundContext();
            aResult.push(oActiveContext);
          }
        }

        return aResult;
      }, []);
      return Promise.all(activeContexts.map(function (oContext) {
        return oContext.requestCanonicalPath().then(function () {
          return oContext;
        });
      }));
    };

    _proto.afterDeleteProcess = function afterDeleteProcess(mParameters, checkBox, aContexts, oResourceBundle) {
      var oInternalModelContext = mParameters.internalModelContext;

      if (oInternalModelContext && oInternalModelContext.getProperty("deleteEnabled") != undefined) {
        if (checkBox.isCheckBoxVisible === true && checkBox.isCheckBoxSelected === false) {
          //if unsaved objects are not deleted then we need to set the enabled to true and update the model data for next deletion
          oInternalModelContext.setProperty("deleteEnabled", true);
          var obj = Object.assign(oInternalModelContext.getObject(), {});
          obj.selectedContexts = obj.selectedContexts.filter(function (element) {
            return obj.deletableContexts.indexOf(element) === -1;
          });
          obj.deletableContexts = [];
          obj.selectedContexts = [];
          obj.numberOfSelectedContexts = obj.selectedContexts.length;
          oInternalModelContext.setProperty("", obj);
        } else {
          oInternalModelContext.setProperty("deleteEnabled", false);
          oInternalModelContext.setProperty("selectedContexts", []);
          oInternalModelContext.setProperty("numberOfSelectedContexts", 0);
        }
      }

      if (aContexts.length === 1) {
        MessageToast.show(CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DELETE_TOAST_SINGULAR", oResourceBundle, null, mParameters.entitySetName));
      } else {
        MessageToast.show(CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DELETE_TOAST_PLURAL", oResourceBundle, null, mParameters.entitySetName));
      }
    }
    /**
     * Delete one or multiple document(s).
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param vInContexts Contexts Either one context or an array with contexts to be deleted
     * @param mParameters Optional, can contain the following attributes:
     * @param mParameters.title Title of the object to be deleted
     * @param mParameters.description Description of the object to be deleted
     * @param mParameters.numberOfSelectedContexts Number of objects selected
     * @param mParameters.noDialog To disable the confirmation dialog
     * @param oResourceBundle
     * @param messageHandler
     * @returns A Promise resolved once the document are deleted
     */
    ;

    _proto.deleteDocument = function deleteDocument(vInContexts, mParameters, oResourceBundle, messageHandler) {
      var _this3 = this;

      var aDeletableContexts = [],
          isCheckBoxVisible = false,
          isLockedTextVisible = false,
          cannotBeDeletedTextVisible = false,
          isCheckBoxSelected,
          bDialogConfirmed = false; // eslint-disable-next-line @typescript-eslint/no-this-alias

      var that = this,
          oResourceBundleCore = Core.getLibraryResourceBundle("sap.fe.core");
      var aParams;
      var oDeleteMessage = {
        title: oResourceBundleCore.getText("C_COMMON_DELETE")
      };
      BusyLocker.lock(this.oLockObject);
      var vContexts;

      if (Array.isArray(vInContexts)) {
        vContexts = vInContexts;
      } else {
        vContexts = [vInContexts];
      }

      return new Promise(function (resolve, reject) {
        try {
          var sProgrammingModel = _this3.getProgrammingModel(vContexts[0]);

          if (mParameters) {
            if (!mParameters.numberOfSelectedContexts) {
              if (sProgrammingModel === ProgrammingModel.Draft) {
                for (var i = 0; i < vContexts.length; i++) {
                  var oContextData = vContexts[i].getObject();

                  if (oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true && oContextData.DraftAdministrativeData && oContextData.DraftAdministrativeData.InProcessByUser && !oContextData.DraftAdministrativeData.DraftIsCreatedByMe) {
                    var sLockedUser = "";
                    var draftAdminData = oContextData && oContextData.DraftAdministrativeData;

                    if (draftAdminData) {
                      sLockedUser = draftAdminData["InProcessByUser"];
                    }

                    aParams = [sLockedUser];
                    MessageBox.show(CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_SINGLE_OBJECT_LOCKED", oResourceBundle, aParams), {
                      title: oResourceBundleCore.getText("C_COMMON_DELETE"),
                      onClose: reject
                    });
                    return;
                  }
                }
              }

              mParameters = getParameters(mParameters);

              if (mParameters.title) {
                if (mParameters.description) {
                  aParams = [mParameters.title + " ", mParameters.description];
                } else {
                  aParams = [mParameters.title, ""];
                }

                oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO", oResourceBundle, aParams, mParameters.entitySetName);
              } else {
                oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR", oResourceBundle, null, mParameters.entitySetName);
              }

              aDeletableContexts = vContexts;
            } else {
              oDeleteMessage = {
                title: oResourceBundleCore.getText("C_COMMON_DELETE")
              };

              if (mParameters.numberOfSelectedContexts === 1 && mParameters.numberOfSelectedContexts === vContexts.length) {
                aDeletableContexts = vContexts;
                var oLineContextData = vContexts[0].getObject();
                var oTable = mParameters.parentControl;
                var sKey = oTable && oTable.getParent().getIdentifierColumn();

                if (sKey) {
                  var sKeyValue = sKey ? oLineContextData[sKey] : undefined;
                  var sDescription = mParameters.description && mParameters.description.path ? oLineContextData[mParameters.description.path] : undefined;

                  if (sKeyValue) {
                    if (sDescription && mParameters.description && sKey !== mParameters.description.path) {
                      aParams = [sKeyValue + " ", sDescription];
                    } else {
                      aParams = [sKeyValue, ""];
                    }

                    oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO", oResourceBundle, aParams, mParameters.entitySetName);
                  } else if (sKeyValue) {
                    aParams = [sKeyValue, ""];
                    oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO", oResourceBundle, aParams, mParameters.entitySetName);
                  } else {
                    oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR", oResourceBundle, null, mParameters.entitySetName);
                  }
                } else {
                  oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR", oResourceBundle, null, mParameters.entitySetName);
                }
              } else if (mParameters.numberOfSelectedContexts === 1 && mParameters.unSavedContexts.length === 1) {
                //only one unsaved object
                aDeletableContexts = mParameters.unSavedContexts;
                var _draftAdminData = aDeletableContexts[0].getObject()["DraftAdministrativeData"];
                var sLastChangedByUser = "";

                if (_draftAdminData) {
                  sLastChangedByUser = _draftAdminData["LastChangedByUserDescription"] || _draftAdminData["LastChangedByUser"] || "";
                }

                aParams = [sLastChangedByUser];
                oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_UNSAVED_CHANGES", oResourceBundle, aParams);
              } else if (mParameters.numberOfSelectedContexts === mParameters.unSavedContexts.length) {
                //only multiple unsaved objects
                aDeletableContexts = mParameters.unSavedContexts;
                oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_UNSAVED_CHANGES_MULTIPLE_OBJECTS", oResourceBundle);
              } else if (mParameters.numberOfSelectedContexts === vContexts.concat(mParameters.unSavedContexts.concat(mParameters.lockedContexts)).length) {
                //only unsaved, locked ,deletable objects but not non-deletable objects
                aDeletableContexts = vContexts.concat(mParameters.unSavedContexts);
                oDeleteMessage.text = aDeletableContexts.length === 1 ? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR", oResourceBundle, null, mParameters.entitySetName) : CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_PLURAL", oResourceBundle, null, mParameters.entitySetName);
              } else {
                //if non-deletable objects exists along with any of unsaved ,deletable objects
                aDeletableContexts = vContexts.concat(mParameters.unSavedContexts);
                cannotBeDeletedTextVisible = true;
                oDeleteMessage.text = aDeletableContexts.length === 1 ? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR_NON_DELETABLE", oResourceBundle, null, mParameters.entitySetName) : CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTTITLE_PLURAL_NON_DELETABLE", oResourceBundle, [aDeletableContexts.length], mParameters.entitySetName);
                oDeleteMessage.nonDeletableText = that._getNonDeletableText(mParameters, vContexts, oResourceBundle);
              }

              if (mParameters.lockedContexts.length == 1) {
                //setting the locked text if locked objects exist
                isLockedTextVisible = true;
                oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_ONE_OBJECT_LOCKED", oResourceBundle, [mParameters.numberOfSelectedContexts]);
              }

              if (mParameters.lockedContexts.length > 1) {
                //setting the locked text if locked objects exist
                isLockedTextVisible = true;
                oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_LOCKED", oResourceBundle, [mParameters.lockedContexts.length, mParameters.numberOfSelectedContexts]);
              }

              if (mParameters.unSavedContexts.length > 0 && mParameters.unSavedContexts.length !== mParameters.numberOfSelectedContexts) {
                if ((cannotBeDeletedTextVisible || isLockedTextVisible) && aDeletableContexts.length === mParameters.unSavedContexts.length) {
                  //if only unsaved and either or both of locked and non-deletable objects exist then we hide the check box
                  isCheckBoxVisible = false;
                  aDeletableContexts = mParameters.unSavedContexts;

                  if (mParameters.unSavedContexts.length === 1) {
                    oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_UNSAVED_AND_FEW_OBJECTS_LOCKED_SINGULAR", oResourceBundle);
                  } else {
                    oDeleteMessage.text = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_UNSAVED_AND_FEW_OBJECTS_LOCKED_PLURAL", oResourceBundle);
                  }
                } else {
                  if (mParameters.unSavedContexts.length === 1) {
                    oDeleteMessage.checkBoxText = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_UNSAVED_SINGULAR", oResourceBundle);
                  } else {
                    oDeleteMessage.checkBoxText = CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_UNSAVED_PLURAL", oResourceBundle);
                  }

                  isCheckBoxVisible = true;
                }
              }

              if (cannotBeDeletedTextVisible && isLockedTextVisible) {
                //if non-deletable objects exist along with deletable objects
                var sNonDeletableContextText = that._getNonDeletableText(mParameters, vContexts, oResourceBundle); //if both locked and non-deletable objects exist along with deletable objects


                if (mParameters.unSavedContexts.length > 1) {
                  oDeleteMessage.nonDeletableText = sNonDeletableContextText + " " + CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_LOCKED", oResourceBundle, [mParameters.lockedContexts.length, mParameters.numberOfSelectedContexts]);
                }

                if (mParameters.unSavedContexts.length == 1) {
                  oDeleteMessage.nonDeletableText = sNonDeletableContextText + " " + CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_ONE_OBJECT_LOCKED", oResourceBundle, [mParameters.numberOfSelectedContexts]);
                }
              }
            }
          }

          var oNonDeletableMessageTextControl, oDeleteMessageTextControl;
          var oContent = new VBox({
            items: [oNonDeletableMessageTextControl = new Text({
              text: oDeleteMessage.nonDeletableText,
              visible: isLockedTextVisible || cannotBeDeletedTextVisible
            }), oDeleteMessageTextControl = new Text({
              text: oDeleteMessage.text
            }), new CheckBox({
              text: oDeleteMessage.checkBoxText,
              selected: true,
              select: function (oEvent) {
                var selected = oEvent.getSource().getSelected();

                if (selected) {
                  aDeletableContexts = vContexts.concat(mParameters.unSavedContexts);
                  isCheckBoxSelected = true;
                } else {
                  aDeletableContexts = vContexts;
                  isCheckBoxSelected = false;
                }
              },
              visible: isCheckBoxVisible
            })]
          });
          var sTitle = oResourceBundleCore.getText("C_COMMON_DELETE");

          var fnConfirm = function () {
            try {
              bDialogConfirmed = true;
              BusyLocker.lock(that.oLockObject);
              var aContexts = aDeletableContexts;
              return Promise.resolve(_finallyRethrows(function () {
                return _catch(function () {
                  function _temp15() {
                    return Promise.resolve(that.findActiveDraftRootContexts(aContexts, mParameters.bFindActiveContexts)).then(function (activeContexts) {
                      var _exit3 = false;

                      function _temp13(_result5) {
                        if (_exit3) return _result5;
                        var checkBox = {
                          "isCheckBoxVisible": isCheckBoxVisible,
                          "isCheckBoxSelected": isCheckBoxSelected
                        };

                        var _temp11 = function () {
                          if (activeContexts && activeContexts.length) {
                            return Promise.resolve(Promise.all(activeContexts.map(function (oContext) {
                              return oContext.delete();
                            }))).then(function () {
                              that.afterDeleteProcess(mParameters, checkBox, aContexts, oResourceBundle);
                              return Promise.resolve(messageHandler.showMessageDialog()).then(function () {
                                resolve();
                              });
                            });
                          } else {
                            that.afterDeleteProcess(mParameters, checkBox, aContexts, oResourceBundle);
                            return Promise.resolve(messageHandler.showMessageDialog()).then(function () {
                              resolve();
                            });
                          }
                        }();

                        if (_temp11 && _temp11.then) return _temp11.then(function () {});
                      }

                      var _temp12 = _catch(function () {
                        return Promise.resolve(Promise.all(aContexts.map(function (oContext) {
                          //delete the draft
                          var bEnableStrictHandling = aContexts.length === 1 ? true : false;
                          return draft.deleteDraft(oContext, that._oAppComponent, bEnableStrictHandling);
                        }))).then(function () {});
                      }, function (oError) {
                        return Promise.resolve(messageHandler.showMessages()).then(function () {
                          // re-throw error to enforce rejecting the general promise
                          throw oError;
                        });
                      });

                      return _temp12 && _temp12.then ? _temp12.then(_temp13) : _temp13(_temp12);
                    });
                  }

                  var _temp14 = function () {
                    if (mParameters.beforeDeleteCallBack) {
                      return Promise.resolve(mParameters.beforeDeleteCallBack({
                        contexts: aContexts
                      })).then(function () {});
                    }
                  }();

                  return _temp14 && _temp14.then ? _temp14.then(_temp15) : _temp15(_temp14);
                }, function () {
                  reject();
                });
              }, function (_wasThrown2, _result6) {
                BusyLocker.unlock(that.oLockObject);
                if (_wasThrown2) throw _result6;
                return _result6;
              }));
            } catch (e) {
              return Promise.reject(e);
            }
          };

          var oDialog = new Dialog({
            title: sTitle,
            state: "Warning",
            content: [oContent],
            ariaLabelledBy: oNonDeletableMessageTextControl.getVisible() ? [oNonDeletableMessageTextControl, oDeleteMessageTextControl] : oDeleteMessageTextControl,
            beginButton: new Button({
              text: oResourceBundleCore.getText("C_COMMON_DELETE"),
              type: "Emphasized",
              press: function () {
                messageHandling.removeBoundTransitionMessages();
                oDialog.close();
                fnConfirm();
              }
            }),
            endButton: new Button({
              text: CommonUtils.getTranslatedText("C_COMMON_DIALOG_CANCEL", oResourceBundle),
              press: function () {
                oDialog.close();
              }
            }),
            afterClose: function () {
              oDialog.destroy(); // if dialog is closed unconfirmed (e.g. via "Cancel" or Escape button), ensure to reject promise

              if (!bDialogConfirmed) {
                reject();
              }
            }
          });

          if (mParameters.noDialog) {
            fnConfirm();
          } else {
            oDialog.addStyleClass("sapUiContentPadding");
            oDialog.open();
          }
        } finally {
          BusyLocker.unlock(that.oLockObject);
        }
      });
    }
    /**
     * Edits a document.
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param oContext Context of the active document
     * @param oView Current view
     * @param messageHandler
     * @returns Promise resolves with the new draft context in case of draft programming model
     * @ui5-restricted
     * @final
     */
    ;

    _proto.editDocument = function editDocument(oContext, oView, messageHandler) {
      try {
        var _this5 = this;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = _this5;

        var sProgrammingModel = _this5.getProgrammingModel(oContext);

        if (!oContext) {
          throw new Error("Binding context to active document is required");
        }

        if (sProgrammingModel !== ProgrammingModel.Draft && sProgrammingModel !== ProgrammingModel.Sticky) {
          throw new Error("Edit is only allowed for draft or sticky session supported services");
        }

        _this5._bIsModified = false;
        BusyLocker.lock(that.oLockObject); // before triggering the edit action we'll have to remove all bound transition messages

        messageHandler.removeTransitionMessages();
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            return Promise.resolve(sProgrammingModel === ProgrammingModel.Draft ? draft.createDraftFromActiveDocument(oContext, _this5._getAppComponent(), {
              bPreserveChanges: true,
              oView: oView
            }) : sticky.editDocumentInStickySession(oContext, _this5._getAppComponent())).then(function (oNewContext) {
              _this5._bCreateMode = false;
              return Promise.resolve(messageHandler.showMessageDialog()).then(function () {
                return oNewContext;
              });
            });
          }, function (err) {
            return Promise.resolve(messageHandler.showMessages({
              concurrentEditFlag: true
            })).then(function () {
              throw err;
            });
          });
        }, function (_wasThrown3, _result7) {
          BusyLocker.unlock(that.oLockObject);
          if (_wasThrown3) throw _result7;
          return _result7;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Cancel 'edit' mode of a document.
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param oContext Context of the document to be canceled or deleted
     * @param [mInParameters] Optional, can contain the following attributes:
     * @param mInParameters.cancelButton Cancel Button of the discard popover (mandatory for now)
     * @param mInParameters.skipDiscardPopover Optional, supresses the discard popover incase of draft applications while navigating out of OP
     * @param oResourceBundle
     * @param messageHandler
     * @returns Promise resolves with ???
     * @ui5-restricted
     * @final
     */
    ;

    _proto.cancelDocument = function cancelDocument(oContext, mInParameters, oResourceBundle, messageHandler) {
      try {
        var _this7 = this;

        //context must always be passed - mandatory parameter
        if (!oContext) {
          throw new Error("No context exists. Pass a meaningful context");
        }

        BusyLocker.lock(_this7.oLockObject);
        var mParameters = getParameters(mInParameters);
        var oModel = oContext.getModel();

        var sProgrammingModel = _this7.getProgrammingModel(oContext);

        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            function _temp26() {
              function _temp24() {
                function _temp22() {
                  var _exit4 = false,
                      _interrupt = false;

                  function _temp20(_result8) {
                    if (_exit4) return _result8;
                    _this7._bIsModified = false; // remove existing bound transition messages

                    messageHandler.removeTransitionMessages(); // show unbound messages

                    return Promise.resolve(messageHandler.showMessages()).then(function () {
                      return returnedValue;
                    });
                  }

                  var _temp19 = _switch(sProgrammingModel, [[function () {
                    return ProgrammingModel.Draft;
                  }, function () {
                    return Promise.resolve(oContext.requestObject("HasActiveEntity")).then(function (bHasActiveEntity) {
                      function _temp18() {
                        _interrupt = true;
                      }

                      var _temp17 = function () {
                        if (!bHasActiveEntity) {
                          if (oContext && oContext.hasPendingChanges()) {
                            oContext.getBinding().resetChanges();
                          }

                          return Promise.resolve(draft.deleteDraft(oContext, _this7._oAppComponent)).then(function (_draft$deleteDraft) {
                            returnedValue = _draft$deleteDraft;
                          });
                        } else {
                          var oSiblingContext = oModel.bindContext("".concat(oContext.getPath(), "/SiblingEntity")).getBoundContext();

                          var _temp27 = _finallyRethrows(function () {
                            return Promise.resolve(oSiblingContext.requestCanonicalPath()).then(function (sCanonicalPath) {
                              if (oContext && oContext.hasPendingChanges()) {
                                oContext.getBinding().resetChanges();
                              }

                              returnedValue = oModel.bindContext(sCanonicalPath).getBoundContext();
                            });
                          }, function (_wasThrown4, _result9) {
                            return Promise.resolve(draft.deleteDraft(oContext, _this7._oAppComponent)).then(function () {
                              if (_wasThrown4) throw _result9;
                              return _result9;
                            });
                          });

                          if (_temp27 && _temp27.then) return _temp27.then(function () {});
                        }
                      }();

                      return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
                    });
                  }], [function () {
                    return ProgrammingModel.Sticky;
                  }, function () {
                    return Promise.resolve(sticky.discardDocument(oContext)).then(function (discardedContext) {
                      if (discardedContext) {
                        if (discardedContext.hasPendingChanges()) {
                          discardedContext.getBinding().resetChanges();
                        }

                        if (!_this7._bCreateMode) {
                          discardedContext.refresh();
                          returnedValue = discardedContext;
                        }
                      }

                      _interrupt = true;
                    });
                  }], [void 0, function () {
                    throw new Error("Cancel document only allowed for draft or sticky session supported services");
                  }]]);

                  return _temp19 && _temp19.then ? _temp19.then(_temp20) : _temp20(_temp19);
                }

                if (oContext.isKeepAlive()) {
                  oContext.setKeepAlive(false);
                }

                var _temp21 = function () {
                  if (mParameters.beforeCancelCallBack) {
                    return Promise.resolve(mParameters.beforeCancelCallBack({
                      context: oContext
                    })).then(function () {});
                  }
                }();

                return _temp21 && _temp21.then ? _temp21.then(_temp22) : _temp22(_temp21);
              }

              var _temp23 = function () {
                if (!mParameters.skipDiscardPopover) {
                  return Promise.resolve(_this7._showDiscardPopover(mParameters.cancelButton, _this7._bIsModified, oResourceBundle)).then(function () {});
                }
              }();

              return _temp23 && _temp23.then ? _temp23.then(_temp24) : _temp24(_temp23);
            }

            var returnedValue = false;

            var _temp25 = function () {
              if (sProgrammingModel === ProgrammingModel.Draft && !_this7._bIsModified) {
                var draftDataContext = oModel.bindContext("".concat(oContext.getPath(), "/DraftAdministrativeData")).getBoundContext();
                return Promise.resolve(draftDataContext.requestObject()).then(function (draftAdminData) {
                  if (draftAdminData) {
                    _this7._bIsModified = !(draftAdminData.CreationDateTime === draftAdminData.LastChangeDateTime);
                  }
                });
              }
            }();

            return _temp25 && _temp25.then ? _temp25.then(_temp26) : _temp26(_temp25);
          }, function (err) {
            return Promise.resolve(messageHandler.showMessages()).then(function () {
              throw err;
            });
          });
        }, function (_wasThrown5, _result10) {
          BusyLocker.unlock(_this7.oLockObject);
          if (_wasThrown5) throw _result10;
          return _result10;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Saves the document.
     *
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @param oContext Context of the document to be saved
     * @param oResourceBundle
     * @param bExecuteSideEffectsOnError
     * @param aBindings
     * @param messageHandler
     * @returns Promise resolves with ???
     * @ui5-restricted
     * @final
     */
    ;

    _proto.saveDocument = function saveDocument(oContext, oResourceBundle, bExecuteSideEffectsOnError, aBindings, messageHandler) {
      try {
        var _this9 = this;

        if (!oContext) {
          return Promise.reject(new Error("Binding context to draft document is required"));
        }

        var sProgrammingModel = _this9.getProgrammingModel(oContext);

        if (sProgrammingModel !== ProgrammingModel.Sticky && sProgrammingModel !== ProgrammingModel.Draft) {
          throw new Error("Save is only allowed for draft or sticky session supported services");
        } // in case of saving / activating the bound transition messages shall be removed before the PATCH/POST
        // is sent to the backend


        messageHandler.removeTransitionMessages();
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            BusyLocker.lock(_this9.oLockObject);
            return Promise.resolve(sProgrammingModel === ProgrammingModel.Draft ? draft.activateDocument(oContext, _this9._getAppComponent(), {}, messageHandler) : sticky.activateDocument(oContext, _this9._getAppComponent())).then(function (oActiveDocument) {
              var bNewObject = sProgrammingModel === ProgrammingModel.Sticky ? _this9._bCreateMode : !oContext.getObject().HasActiveEntity;
              var messagesReceived = messageHandling.getMessages().concat(messageHandling.getMessages(true, true)); // get unbound and bound messages present in the model

              if (!(messagesReceived.length === 1 && messagesReceived[0].type === coreLibrary.MessageType.Success)) {
                // show our object creation toast only if it is not coming from backend
                MessageToast.show(bNewObject ? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_OBJECT_CREATED", oResourceBundle) : CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_OBJECT_SAVED", oResourceBundle));
              }

              _this9._bIsModified = false;
              return oActiveDocument;
            });
          }, function (err) {
            if (aBindings && aBindings.length > 0) {
              /* The sideEffects are executed only for table items in transient state */
              aBindings.forEach(function (oListBinding) {
                if (!CommonUtils.hasTransientContext(oListBinding) && bExecuteSideEffectsOnError) {
                  var oAppComponent = _this9._getAppComponent();

                  oAppComponent.getSideEffectsService().requestSideEffectsForNavigationProperty(oListBinding.getPath(), oContext);
                }
              });
            }

            return Promise.resolve(messageHandler.showMessages()).then(function () {
              throw err;
            });
          });
        }, function (_wasThrown6, _result11) {
          BusyLocker.unlock(_this9.oLockObject);
          if (_wasThrown6) throw _result11;
          return _result11;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Calls a bound or unbound action.
     *
     * @function
     * @static
     * @name sap.fe.core.TransactionHelper.callAction
     * @memberof sap.fe.core.TransactionHelper
     * @param sActionName The name of the action to be called
     * @param [mParameters] Contains the following attributes:
     * @param [mParameters.parameterValues] A map of action parameter names and provided values
     * @param [mParameters.skipParameterDialog] Skips the parameter dialog if values are provided for all of them
     * @param [mParameters.contexts] Mandatory for a bound action: Either one context or an array with contexts for which the action is to be called
     * @param [mParameters.model] Mandatory for an unbound action: An instance of an OData V4 model
     * @param [mParameters.invocationGrouping] Mode how actions are to be called: 'ChangeSet' to put all action calls into one changeset, 'Isolated' to put them into separate changesets
     * @param [mParameters.label] A human-readable label for the action
     * @param [mParameters.bGetBoundContext] If specified, the action promise returns the bound context
     * @param oView Contains the object of the current view
     * @param messageHandler
     * @returns Promise resolves with an array of response objects (TODO: to be changed)
     * @ui5-restricted
     * @final
     */
    ;

    _proto.callAction = function callAction(sActionName, mParameters, oView, messageHandler) {
      try {
        var _this11 = this;

        mParameters = getParameters(mParameters); // eslint-disable-next-line @typescript-eslint/no-this-alias

        var that = _this11;
        var oContext, oModel;
        var mBindingParameters = mParameters.bindingParameters;

        if (!sActionName) {
          throw new Error("Provide name of action to be executed");
        } // action imports are not directly obtained from the metaModel by it is present inside the entityContainer
        // and the acions it refers to present outside the entitycontainer, hence to obtain kind of the action
        // split() on its name was required


        var sName = sActionName.split("/")[1];
        sActionName = sName || sActionName;
        oContext = sName ? undefined : mParameters.contexts; //checking whether the context is an array with more than 0 length or not an array(create action)

        if (oContext && (Array.isArray(oContext) && oContext.length || !Array.isArray(oContext))) {
          oContext = Array.isArray(oContext) ? oContext[0] : oContext;
          oModel = oContext.getModel();
        }

        if (mParameters.model) {
          oModel = mParameters.model;
        }

        if (!oModel) {
          throw new Error("Pass a context for a bound action or pass the model for an unbound action");
        } // get the binding parameters $select and $expand for the side effect on this action
        // also gather additional property paths to be requested such as text associations


        var oAppComponent = that._getAppComponent();

        var mSideEffectsParameters = oAppComponent.getSideEffectsService().getODataActionSideEffects(sActionName, oContext) || {};

        var displayUnapplicableContextsDialog = function () {
          if (!mParameters.notApplicableContext || mParameters.notApplicableContext.length === 0) {
            return Promise.resolve(mParameters.contexts);
          }

          return new Promise(function (resolve, reject) {
            try {
              var fnOpenAndFillDialog = function (oDlg) {
                var oDialogContent;
                var nNotApplicable = mParameters.notApplicableContext.length,
                    aNotApplicableItems = [];

                for (var i = 0; i < mParameters.notApplicableContext.length; i++) {
                  oDialogContent = mParameters.notApplicableContext[i].getObject();
                  aNotApplicableItems.push(oDialogContent);
                }

                var oNotApplicableItemsModel = new JSONModel(aNotApplicableItems);
                var oTotals = new JSONModel({
                  total: nNotApplicable,
                  label: mParameters.label
                });
                oDlg.setModel(oNotApplicableItemsModel, "notApplicable");
                oDlg.setModel(oTotals, "totals");
                oDlg.open();
              }; // Show the contexts that are not applicable and will not therefore be processed


              var sFragmentName = "sap.fe.core.controls.ActionPartial";
              var oDialogFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
              var oMetaModel = oModel.getMetaModel();
              var sCanonicalPath = mParameters.contexts[0].getCanonicalPath();
              var sEntitySet = "".concat(sCanonicalPath.substr(0, sCanonicalPath.indexOf("(")), "/");
              var oDialogLabelModel = new JSONModel({
                title: mParameters.label
              });

              var _temp32 = _catch(function () {
                return Promise.resolve(XMLPreprocessor.process(oDialogFragment, {
                  name: sFragmentName
                }, {
                  bindingContexts: {
                    entityType: oMetaModel.createBindingContext(sEntitySet),
                    label: oDialogLabelModel.createBindingContext("/")
                  },
                  models: {
                    entityType: oMetaModel,
                    metaModel: oMetaModel,
                    label: oDialogLabelModel
                  }
                })).then(function (oFragment) {
                  // eslint-disable-next-line prefer-const
                  var oDialog;
                  var oController = {
                    onClose: function () {
                      // User cancels action
                      oDialog.close();
                      resolve();
                    },
                    onContinue: function () {
                      // Users continues the action with the bound contexts
                      oDialog.close();
                      resolve(mParameters.applicableContext);
                    }
                  };
                  return Promise.resolve(Fragment.load({
                    definition: oFragment,
                    controller: oController
                  })).then(function (_Fragment$load) {
                    oDialog = _Fragment$load;

                    oController.onClose = function () {
                      // User cancels action
                      oDialog.close();
                      resolve();
                    };

                    oController.onContinue = function () {
                      // Users continues the action with the bound contexts
                      oDialog.close();
                      resolve(mParameters.applicableContext);
                    };

                    mParameters.parentControl.addDependent(oDialog);
                    fnOpenAndFillDialog(oDialog);
                  });
                });
              }, function (oError) {
                reject(oError);
              });

              return Promise.resolve(_temp32 && _temp32.then ? _temp32.then(function () {}) : void 0);
            } catch (e) {
              return Promise.reject(e);
            }
          });
        };

        return Promise.resolve(_catch(function () {
          function _temp30() {
            return Promise.resolve(_this11._handleActionResponse(messageHandler, mParameters, sActionName)).then(function () {
              return oResult;
            });
          }

          var oResult;

          var _temp29 = function () {
            if (oContext && oModel) {
              return Promise.resolve(displayUnapplicableContextsDialog()).then(function (contextToProcess) {
                var _temp28 = function () {
                  if (contextToProcess) {
                    return Promise.resolve(operations.callBoundAction(sActionName, contextToProcess, oModel, oAppComponent, {
                      parameterValues: mParameters.parameterValues,
                      invocationGrouping: mParameters.invocationGrouping,
                      label: mParameters.label,
                      skipParameterDialog: mParameters.skipParameterDialog,
                      mBindingParameters: mBindingParameters,
                      entitySetName: mParameters.entitySetName,
                      additionalSideEffect: mSideEffectsParameters,
                      onSubmitted: function () {
                        messageHandler.removeTransitionMessages();
                        BusyLocker.lock(that.oLockObject);
                      },
                      onResponse: function () {
                        BusyLocker.unlock(that.oLockObject);
                      },
                      parentControl: mParameters.parentControl,
                      controlId: mParameters.controlId,
                      internalModelContext: mParameters.internalModelContext,
                      operationAvailableMap: mParameters.operationAvailableMap,
                      bIsCreateAction: mParameters.bIsCreateAction,
                      bGetBoundContext: mParameters.bGetBoundContext,
                      bObjectPage: mParameters.bObjectPage,
                      messageHandler: messageHandler,
                      defaultValuesExtensionFunction: mParameters.defaultValuesExtensionFunction,
                      selectedItems: mParameters.contexts
                    })).then(function (_operations$callBound) {
                      oResult = _operations$callBound;
                    });
                  } else {
                    oResult = null;
                  }
                }();

                if (_temp28 && _temp28.then) return _temp28.then(function () {});
              });
            } else {
              return Promise.resolve(operations.callActionImport(sActionName, oModel, oAppComponent, {
                parameterValues: mParameters.parameterValues,
                label: mParameters.label,
                skipParameterDialog: mParameters.skipParameterDialog,
                bindingParameters: mBindingParameters,
                entitySetName: mParameters.entitySetName,
                onSubmitted: function () {
                  BusyLocker.lock(that.oLockObject);
                },
                onResponse: function () {
                  BusyLocker.unlock(that.oLockObject);
                },
                parentControl: mParameters.parentControl,
                internalModelContext: mParameters.internalModelContext,
                operationAvailableMap: mParameters.operationAvailableMap,
                messageHandler: messageHandler,
                bObjectPage: mParameters.bObjectPage
              })).then(function (_operations$callActio) {
                oResult = _operations$callActio;
              });
            }
          }();

          return _temp29 && _temp29.then ? _temp29.then(_temp30) : _temp30(_temp29);
        }, function (err) {
          return Promise.resolve(_this11._handleActionResponse(messageHandler, mParameters, sActionName)).then(function () {
            throw err;
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Handles messages for action call.
     *
     * @function
     * @name sap.fe.core.TransactionHelper#_handleActionResponse
     * @memberof sap.fe.core.TransactionHelper
     * @param messageHandler
     * @param mParameters Parameters to be considered for the action.
     * @param sActionName The name of the action to be called
     * @returns Promise after message dialog is opened if required.
     * @ui5-restricted
     * @final
     */
    ;

    _proto._handleActionResponse = function _handleActionResponse(messageHandler, mParameters, sActionName) {
      var aTransientMessages = messageHandling.getMessages(true, true);

      if (aTransientMessages.length > 0 && mParameters && mParameters.internalModelContext) {
        mParameters.internalModelContext.setProperty("sActionName", mParameters.label ? mParameters.label : sActionName);
      }

      return messageHandler.showMessages();
    }
    /**
     * Handles validation errors for the 'Discard' action.
     *
     * @function
     * @name sap.fe.core.TransactionHelper#handleValidationError
     * @memberof sap.fe.core.TransactionHelper
     * @static
     * @ui5-restricted
     * @final
     */
    ;

    _proto.handleValidationError = function handleValidationError() {
      var oMessageManager = Core.getMessageManager(),
          errorToRemove = oMessageManager.getMessageModel().getData().filter(function (error) {
        // only needs to handle validation messages, technical and persistent errors needs not to be checked here.
        if (error.validation) {
          return error;
        }
      });
      oMessageManager.removeMessages(errorToRemove);
    }
    /**
     * Shows a popover if it needs to be shown.
     * TODO: Popover is shown if user has modified any data.
     * TODO: Popover is shown if there's a difference from draft admin data.
     *
     * @static
     * @name sap.fe.core.TransactionHelper._showDiscardPopover
     * @memberof sap.fe.core.TransactionHelper
     * @param oCancelButton The control which will open the popover
     * @param bIsModified
     * @param oResourceBundle
     * @returns Promise resolves if user confirms discard, rejects if otherwise, rejects if no control passed to open popover
     * @ui5-restricted
     * @final
     */
    ;

    _proto._showDiscardPopover = function _showDiscardPopover(oCancelButton, bIsModified, oResourceBundle) {
      // TODO: Implement this popover as a fragment as in v2??
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var that = this;
      that._bContinueDiscard = false; // to be implemented

      return new Promise(function (resolve, reject) {
        if (!oCancelButton) {
          reject("Cancel button not found");
        } //Show popover only when data is changed.


        if (bIsModified) {
          var fnOnAfterDiscard = function () {
            oCancelButton.setEnabled(true);

            if (that._bContinueDiscard) {
              resolve();
            } else {
              reject("Discard operation was rejected. Document has not been discarded");
            }

            that._oPopover.detachAfterClose(fnOnAfterDiscard);
          };

          if (!that._oPopover) {
            var oText = new Text({
              //This text is the same as LR v2.
              //TODO: Display message provided by app developer???
              text: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DRAFT_DISCARD_MESSAGE", oResourceBundle)
            }),
                oButton = new Button({
              text: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DRAFT_DISCARD_BUTTON", oResourceBundle),
              width: "100%",
              press: function () {
                that.handleValidationError();
                that._bContinueDiscard = true;

                that._oPopover.close();
              },
              ariaLabelledBy: oText
            });
            that._oPopover = new Popover({
              showHeader: false,
              placement: "Top",
              content: [new VBox({
                items: [oText, oButton]
              })],
              beforeOpen: function () {
                // make sure to NOT trigger multiple cancel flows
                oCancelButton.setEnabled(false);

                that._oPopover.setInitialFocus(oButton);
              }
            });

            that._oPopover.addStyleClass("sapUiContentPadding");
          }

          that._oPopover.attachAfterClose(fnOnAfterDiscard);

          that._oPopover.openBy(oCancelButton, false);
        } else {
          that.handleValidationError();
          resolve();
        }
      });
    }
    /**
     * Sets the document to modified state on patch event.
     *
     * @function
     * @static
     * @name sap.fe.core.TransactionHelper.handleDocumentModifications
     * @memberof sap.fe.core.TransactionHelper
     * @ui5-restricted
     * @final
     */
    ;

    _proto.handleDocumentModifications = function handleDocumentModifications() {
      this._bIsModified = true;
    }
    /**
     * Retrieves the owner component.
     *
     * @function
     * @static
     * @private
     * @name sap.fe.core.TransactionHelper._getOwnerComponent
     * @memberof sap.fe.core.TransactionHelper
     * @returns The app component
     * @ui5-restricted
     * @final
     */
    ;

    _proto._getAppComponent = function _getAppComponent() {
      return this._oAppComponent;
    };

    _proto._onFieldChange = function _onFieldChange(oEvent, oCreateButton, messageHandler, fnValidateRequiredProperties) {
      messageHandler.removeTransitionMessages();
      var oField = oEvent.getSource();
      var oFieldPromise = oEvent.getParameter("promise");

      if (oFieldPromise) {
        return oFieldPromise.then(function (value) {
          // Setting value of field as '' in case of value help and validating other fields
          oField.setValue(value);
          fnValidateRequiredProperties();
          return oField.getValue();
        }).catch(function (value) {
          if (value !== "") {
            //disabling the continue button in case of invalid value in field
            oCreateButton.setEnabled(false);
          } else {
            // validating all the fields in case of empty value in field
            oField.setValue(value);
            fnValidateRequiredProperties();
          }
        });
      }
    };

    _proto._getNonDeletableText = function _getNonDeletableText(mParameters, vContexts, oResourceBundle) {
      var aNonDeletableContexts = mParameters.numberOfSelectedContexts - vContexts.concat(mParameters.unSavedContexts).length;
      return aNonDeletableContexts === 1 ? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_ONE_OBJECT_NON_DELETABLE", oResourceBundle, [mParameters.numberOfSelectedContexts]) : CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_NON_DELETABLE", oResourceBundle, [mParameters.numberOfSelectedContexts - vContexts.concat(mParameters.unSavedContexts).length, mParameters.numberOfSelectedContexts]);
    };

    _proto._launchDialogWithKeyFields = function _launchDialogWithKeyFields(oListBinding, mFields, oModel, mParameters, messageHandler) {
      var _this12 = this;

      var oDialog;
      var oParentControl = mParameters.parentControl; // Crate a fake (transient) listBinding and context, just for the binding context of the dialog

      var oTransientListBinding = oModel.bindList(oListBinding.getPath(), oListBinding.getContext(), [], [], {
        $$updateGroupId: "submitLater"
      });

      oTransientListBinding.refreshInternal = function () {
        /* */
      };

      var oTransientContext = oTransientListBinding.create(mParameters.data, true);
      return new Promise(function (resolve, reject) {
        try {
          var sFragmentName = "sap/fe/core/controls/NonComputedVisibleKeyFieldsDialog";

          var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
              oResourceBundle = oParentControl.getController().oResourceBundle,
              oMetaModel = oModel.getMetaModel(),
              aImmutableFields = [],
              oAppComponent = _this12._getAppComponent(),
              sPath = oListBinding.isRelative() ? oListBinding.getResolvedPath() : oListBinding.getPath(),
              oEntitySetContext = oMetaModel.createBindingContext(sPath),
              sMetaPath = oMetaModel.getMetaPath(sPath);

          for (var i in mFields) {
            aImmutableFields.push(oMetaModel.createBindingContext("".concat(sMetaPath, "/").concat(mFields[i])));
          }

          var oImmutableCtxModel = new JSONModel(aImmutableFields);
          var oImmutableCtx = oImmutableCtxModel.createBindingContext("/");
          var aRequiredProperties = CommonUtils.getRequiredPropertiesFromInsertRestrictions(sMetaPath, oMetaModel);
          var oRequiredPropertyPathsCtxModel = new JSONModel(aRequiredProperties);
          var oRequiredPropertyPathsCtx = oRequiredPropertyPathsCtxModel.createBindingContext("/");
          return Promise.resolve(XMLPreprocessor.process(oFragment, {
            name: sFragmentName
          }, {
            bindingContexts: {
              entitySet: oEntitySetContext,
              fields: oImmutableCtx,
              requiredProperties: oRequiredPropertyPathsCtx
            },
            models: {
              entitySet: oEntitySetContext.getModel(),
              fields: oImmutableCtx.getModel(),
              metaModel: oMetaModel,
              requiredProperties: oRequiredPropertyPathsCtxModel
            }
          })).then(function (oNewFragment) {
            var aFormElements = [];
            var mFieldValueMap = {}; // eslint-disable-next-line prefer-const

            var oCreateButton;

            var validateRequiredProperties = function () {
              try {
                function _temp35() {
                  oCreateButton.setEnabled(bEnabled);
                }

                var bEnabled = false;

                var _temp36 = _catch(function () {
                  return Promise.resolve(Promise.all(aFormElements.map(function (oFormElement) {
                    return oFormElement.getFields()[0];
                  }).filter(function (oField) {
                    // The continue button should remain disabled in case of empty required fields.
                    return oField.getRequired() || oField.getValueState() === ValueState.Error;
                  }).map(function (oField) {
                    try {
                      var _exit6 = false;

                      function _temp40(_result13) {
                        return _exit6 ? _result13 : oField.getValue() === "" ? undefined : oField.getValue();
                      }

                      var sFieldId = oField.getId();

                      var _temp41 = function () {
                        if (sFieldId in mFieldValueMap) {
                          return _catch(function () {
                            return Promise.resolve(mFieldValueMap[sFieldId]).then(function (vValue) {
                              var _temp37 = oField.getValue() === "" ? undefined : vValue;

                              _exit6 = true;
                              return _temp37;
                            });
                          }, function () {
                            _exit6 = true;
                            return undefined;
                          });
                        }
                      }();

                      return Promise.resolve(_temp41 && _temp41.then ? _temp41.then(_temp40) : _temp40(_temp41));
                    } catch (e) {
                      return Promise.reject(e);
                    }
                  }))).then(function (aResults) {
                    bEnabled = aResults.every(function (vValue) {
                      if (Array.isArray(vValue)) {
                        vValue = vValue[0];
                      }

                      return vValue !== undefined && vValue !== null && vValue !== "";
                    });
                  });
                }, function () {
                  bEnabled = false;
                });

                return Promise.resolve(_temp36 && _temp36.then ? _temp36.then(_temp35) : _temp35(_temp36));
              } catch (e) {
                return Promise.reject(e);
              }
            };

            var oController = {
              /*
              					fired on focus out from field or on selecting a value from the valuehelp.
              					the create button is enabled when a value is added.
              					liveChange is not fired when value is added from valuehelp.
              					value validation is not done for create button enablement.
              				*/
              handleChange: function (oEvent) {
                var sFieldId = oEvent.getParameter("id");
                mFieldValueMap[sFieldId] = _this12._onFieldChange(oEvent, oCreateButton, messageHandler, validateRequiredProperties);
              },

              /*
              					fired on key press. the create button is enabled when a value is added.
              					liveChange is not fired when value is added from valuehelp.
              					value validation is not done for create button enablement.
              				*/
              handleLiveChange: function (oEvent) {
                var sFieldId = oEvent.getParameter("id");
                var vValue = oEvent.getParameter("value");
                mFieldValueMap[sFieldId] = vValue;
                validateRequiredProperties();
              }
            };
            return Promise.resolve(Fragment.load({
              definition: oNewFragment,
              controller: oController
            })).then(function (oDialogContent) {
              var oResult;
              oDialog = new Dialog({
                title: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE", oResourceBundle),
                content: [oDialogContent],
                beginButton: {
                  text: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON", oResourceBundle),
                  type: "Emphasized",
                  press: function (oEvent) {
                    try {
                      var createButton = oEvent.getSource();
                      createButton.setEnabled(false);
                      BusyLocker.lock(oDialog);
                      mParameters.bIsCreateDialog = true;

                      var _temp45 = _finallyRethrows(function () {
                        return _catch(function () {
                          return Promise.resolve(Promise.all(Object.keys(mFieldValueMap).map(function (sKey) {
                            try {
                              return Promise.resolve(mFieldValueMap[sKey]).then(function (oValue) {
                                var oDialogValue = {};
                                oDialogValue[sKey] = oValue;
                                return oDialogValue;
                              });
                            } catch (e) {
                              return Promise.reject(e);
                            }
                          }))).then(function (aValues) {
                            function _temp43() {
                              var transientData = oTransientContext.getObject();
                              var createData = {};
                              Object.keys(transientData).forEach(function (sPropertyPath) {
                                var oProperty = oMetaModel.getObject("".concat(sMetaPath, "/").concat(sPropertyPath)); // ensure navigation properties are not part of the payload, deep create not supported

                                if (oProperty && oProperty.$kind === "NavigationProperty") {
                                  return;
                                }

                                createData[sPropertyPath] = transientData[sPropertyPath];
                              });
                              var oNewDocumentContext = oListBinding.create(createData, true, mParameters.createAtEnd, mParameters.inactive);

                              var oPromise = _this12.onAfterCreateCompletion(oListBinding, oNewDocumentContext, mParameters);

                              return Promise.resolve(oPromise).then(function (oResponse) {
                                if (!oResponse || oResponse && oResponse.bKeepDialogOpen !== true) {
                                  var _oResponse;

                                  oResponse = (_oResponse = oResponse) !== null && _oResponse !== void 0 ? _oResponse : {};
                                  oDialog.setBindingContext(null);
                                  oResponse.newContext = oNewDocumentContext;
                                  oResult = {
                                    response: oResponse
                                  };
                                  oDialog.close();
                                }
                              });
                            }

                            var _temp42 = function () {
                              if (mParameters.beforeCreateCallBack) {
                                return Promise.resolve(toES6Promise(mParameters.beforeCreateCallBack({
                                  contextPath: oListBinding && oListBinding.getPath(),
                                  createParameters: aValues
                                }))).then(function () {});
                              }
                            }();

                            return _temp42 && _temp42.then ? _temp42.then(_temp43) : _temp43(_temp42);
                          });
                        }, function (oError) {
                          if (oError !== FELibrary.Constants.CreationFailed) {
                            // other errors are not expected
                            oResult = {
                              error: oError
                            };
                            oDialog.close();
                          }
                        });
                      }, function (_wasThrown7, _result14) {
                        BusyLocker.unlock(oDialog);
                        createButton.setEnabled(true);
                        messageHandler.showMessages();
                        if (_wasThrown7) throw _result14;
                        return _result14;
                      });

                      return Promise.resolve(_temp45 && _temp45.then ? _temp45.then(function () {}) : void 0);
                    } catch (e) {
                      return Promise.reject(e);
                    }
                  }
                },
                endButton: {
                  text: CommonUtils.getTranslatedText("C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL", oResourceBundle),
                  press: function () {
                    oResult = {
                      error: FELibrary.Constants.CancelActionDialog
                    };
                    oDialog.close();
                  }
                },
                afterClose: function () {
                  var _oDialog$getBindingCo;

                  // show footer as per UX guidelines when dialog is not open
                  (_oDialog$getBindingCo = oDialog.getBindingContext("internal")) === null || _oDialog$getBindingCo === void 0 ? void 0 : _oDialog$getBindingCo.setProperty("isCreateDialogOpen", false);
                  oDialog.destroy();
                  oTransientListBinding.destroy();

                  if (oResult.error) {
                    reject(oResult.error);
                  } else {
                    resolve(oResult.response);
                  }
                }
              });
              aFormElements = oDialogContent === null || oDialogContent === void 0 ? void 0 : oDialogContent.getAggregation("form").getAggregation("formContainers")[0].getAggregation("formElements");

              if (oParentControl && oParentControl.addDependent) {
                // if there is a parent control specified add the dialog as dependent
                oParentControl.addDependent(oDialog);
              }

              oCreateButton = oDialog.getBeginButton();
              oDialog.setBindingContext(oTransientContext);
              return _catch(function () {
                return Promise.resolve(CommonUtils.setUserDefaults(oAppComponent, aImmutableFields, oTransientContext, false, mParameters.createAction, mParameters.data)).then(function () {
                  validateRequiredProperties(); // footer must not be visible when the dialog is open as per UX guidelines

                  oDialog.getBindingContext("internal").setProperty("isCreateDialogOpen", true);
                  oDialog.open();
                });
              }, function (oError) {
                return Promise.resolve(messageHandler.showMessages()).then(function () {
                  throw oError;
                });
              });
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    _proto.onAfterCreateCompletion = function onAfterCreateCompletion(oListBinding, oNewDocumentContext, mParameters) {
      var _this13 = this;

      var fnResolve;
      var oPromise = new Promise(function (resolve) {
        fnResolve = resolve;
      });

      var fnCreateCompleted = function (oEvent) {
        var oContext = oEvent.getParameter("context"),
            bSuccess = oEvent.getParameter("success");

        if (oContext === oNewDocumentContext) {
          oListBinding.detachCreateCompleted(fnCreateCompleted, _this13);
          fnResolve(bSuccess);
        }
      };

      var fnSafeContextCreated = function () {
        oNewDocumentContext.created().then(undefined, function () {
          Log.trace("transient creation context deleted");
        }).catch(function (contextError) {
          Log.trace("transient creation context deletion error", contextError);
        });
      };

      oListBinding.attachCreateCompleted(fnCreateCompleted, this);
      return oPromise.then(function (bSuccess) {
        if (!bSuccess) {
          if (!mParameters.keepTransientContextOnFailed) {
            // Cancel the pending POST and delete the context in the listBinding
            fnSafeContextCreated(); // To avoid a 'request cancelled' error in the console

            oListBinding.resetChanges();
            oListBinding.getModel().resetChanges(oListBinding.getUpdateGroupId());
            throw FELibrary.Constants.CreationFailed;
          }

          return {
            bKeepDialogOpen: true
          };
        } else {
          return oNewDocumentContext.created();
        }
      });
    }
    /**
     * Retrieves the name of the NewAction to be executed.
     *
     * @function
     * @static
     * @private
     * @name sap.fe.core.TransactionHelper._getNewAction
     * @memberof sap.fe.core.TransactionHelper
     * @param oStartupParameters Startup parameters of the application
     * @param sCreateHash Hash to be checked for action type
     * @param oMetaModel The MetaModel used to check for NewAction parameter
     * @param sMetaPath The MetaPath
     * @returns The name of the action
     * @ui5-restricted
     * @final
     */
    ;

    _proto._getNewAction = function _getNewAction(oStartupParameters, sCreateHash, oMetaModel, sMetaPath) {
      var sNewAction;

      if (oStartupParameters && oStartupParameters.preferredMode && sCreateHash.toUpperCase().indexOf("I-ACTION=CREATEWITH") > -1) {
        var sPreferredMode = oStartupParameters.preferredMode[0];
        sNewAction = sPreferredMode.toUpperCase().indexOf("CREATEWITH:") > -1 ? sPreferredMode.substr(sPreferredMode.lastIndexOf(":") + 1) : undefined;
      } else if (oStartupParameters && oStartupParameters.preferredMode && sCreateHash.toUpperCase().indexOf("I-ACTION=AUTOCREATEWITH") > -1) {
        var _sPreferredMode = oStartupParameters.preferredMode[0];
        sNewAction = _sPreferredMode.toUpperCase().indexOf("AUTOCREATEWITH:") > -1 ? _sPreferredMode.substr(_sPreferredMode.lastIndexOf(":") + 1) : undefined;
      } else {
        sNewAction = oMetaModel && oMetaModel.getObject !== undefined ? oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction")) || oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")) : undefined;
      }

      return sNewAction;
    }
    /**
     * Retrieves the label for the title of a specific create action dialog, e.g. Create Sales Order from Quotation.
     *
     * The following priority is applied:
     * 1. label of line-item annotation.
     * 2. label annotated in the action.
     * 3. "Create" as a constant from i18n.
     *
     * @function
     * @static
     * @private
     * @name sap.fe.core.TransactionHelper._getSpecificCreateActionDialogLabel
     * @memberof sap.fe.core.TransactionHelper
     * @param oMetaModel The MetaModel used to check for the NewAction parameter
     * @param sMetaPath The MetaPath
     * @param sNewAction Contains the name of the action to be executed
     * @param oResourceBundleCore ResourceBundle to access the default Create label
     * @returns The label for the Create Action Dialog
     * @ui5-restricted
     * @final
     */
    ;

    _proto._getSpecificCreateActionDialogLabel = function _getSpecificCreateActionDialogLabel(oMetaModel, sMetaPath, sNewAction, oResourceBundleCore) {
      var fnGetLabelFromLineItemAnnotation = function () {
        if (oMetaModel && oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.LineItem"))) {
          var iLineItemIndex = oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.LineItem")).findIndex(function (oLineItem) {
            var aLineItemAction = oLineItem.Action ? oLineItem.Action.split("(") : undefined;
            return aLineItemAction ? aLineItemAction[0] === sNewAction : false;
          });
          return iLineItemIndex > -1 ? oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.LineItem"))[iLineItemIndex].Label : undefined;
        } else {
          return undefined;
        }
      };

      return fnGetLabelFromLineItemAnnotation() || oMetaModel && oMetaModel.getObject("".concat(sMetaPath, "/").concat(sNewAction, "@com.sap.vocabularies.Common.v1.Label")) || oResourceBundleCore && oResourceBundleCore.getText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE");
    };

    return TransactionHelper;
  }();

  return TransactionHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiZmluYWxpemVyIiwiYmluZCIsInBhY3QiLCJzdGF0ZSIsInZhbHVlIiwicyIsInYiLCJvIiwib2JzZXJ2ZXIiLCJwcm90b3R5cGUiLCJvbkZ1bGZpbGxlZCIsIm9uUmVqZWN0ZWQiLCJjYWxsYmFjayIsIl90aGlzIiwiZGlzY3JpbWluYW50IiwiY2FzZXMiLCJkaXNwYXRjaEluZGV4IiwiYXdhaXRCb2R5Iiwib3V0ZXIiLCJpIiwibGVuZ3RoIiwidGVzdCIsInRlc3RWYWx1ZSIsImZhbGx0aHJvdWdoQ2hlY2siLCJyZWplY3QiLCJfcmVzdW1lQWZ0ZXJCb2R5IiwiX3Jlc3VtZUFmdGVyVGVzdCIsIkNyZWF0aW9uTW9kZSIsIkZFTGlicmFyeSIsIlByb2dyYW1taW5nTW9kZWwiLCJWYWx1ZVN0YXRlIiwiY29yZUxpYnJhcnkiLCJnZXRQYXJhbWV0ZXJzIiwibVBhcmFtZXRlcnMiLCJnZXRNZXRhZGF0YSIsImdldE5hbWUiLCJUcmFuc2FjdGlvbkhlbHBlciIsIm9BcHBDb21wb25lbnQiLCJvTG9ja09iamVjdCIsIl9iSXNNb2RpZmllZCIsIl9iQ3JlYXRlTW9kZSIsIl9iQ29udGludWVEaXNjYXJkIiwiX29BcHBDb21wb25lbnQiLCJnZXRQcm9ncmFtbWluZ01vZGVsIiwib0NvbnRleHQiLCJzUHJvZ3JhbW1pbmdNb2RlbCIsInNQYXRoIiwiaXNBIiwiZ2V0UGF0aCIsImlzUmVsYXRpdmUiLCJnZXRSZXNvbHZlZFBhdGgiLCJNb2RlbEhlbHBlciIsImlzRHJhZnRTdXBwb3J0ZWQiLCJnZXRNb2RlbCIsImdldE1ldGFNb2RlbCIsIkRyYWZ0IiwiaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwiU3RpY2t5IiwiTm9uRHJhZnQiLCJ2YWxpZGF0ZURvY3VtZW50Iiwib1ZpZXciLCJzQ3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uIiwiY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uIiwic01vZHVsZSIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwicmVwbGFjZSIsInNGdW5jdGlvbk5hbWUiLCJtRGF0YSIsImRhdGEiLCJGUE1IZWxwZXIiLCJ2YWxpZGF0aW9uV3JhcHBlciIsIlByb21pc2UiLCJyZXNvbHZlIiwiY3JlYXRlRG9jdW1lbnQiLCJvTWFpbkxpc3RCaW5kaW5nIiwibUluUGFyYW1ldGVycyIsIm9SZXNvdXJjZUJ1bmRsZSIsIm1lc3NhZ2VIYW5kbGVyIiwiYkZyb21Db3B5UGFzdGUiLCJvTW9kZWwiLCJvTWV0YU1vZGVsIiwic01ldGFQYXRoIiwiZ2V0TWV0YVBhdGgiLCJnZXRIZWFkZXJDb250ZXh0Iiwic0NyZWF0ZUhhc2giLCJfZ2V0QXBwQ29tcG9uZW50IiwiZ2V0Um91dGVyUHJveHkiLCJnZXRIYXNoIiwib0NvbXBvbmVudERhdGEiLCJnZXRDb21wb25lbnREYXRhIiwib1N0YXJ0dXBQYXJhbWV0ZXJzIiwic3RhcnR1cFBhcmFtZXRlcnMiLCJzTmV3QWN0aW9uIiwiX2dldE5ld0FjdGlvbiIsInVuZGVmaW5lZCIsIm1CaW5kaW5nUGFyYW1ldGVycyIsInNNZXNzYWdlc1BhdGgiLCJnZXRPYmplY3QiLCJzQnVzeVBhdGgiLCJnZXRUYXJnZXRFbnRpdHlTZXQiLCJnZXRDb250ZXh0IiwiYkZ1bmN0aW9uT25OYXZQcm9wIiwib05ld0RvY3VtZW50Q29udGV4dCIsIkVycm9yIiwiYnVzeU1vZGUiLCJidXN5SWQiLCJiZWZvcmVDcmVhdGVDYWxsQmFjayIsIkJ1c3lMb2NrZXIiLCJsb2NrIiwib1Jlc291cmNlQnVuZGxlQ29yZSIsIkNvcmUiLCJnZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUiLCJvUmVzdWx0IiwiYkNvbnNpZGVyRG9jdW1lbnRNb2RpZmllZCIsImhhbmRsZURvY3VtZW50TW9kaWZpY2F0aW9ucyIsInNob3dNZXNzYWdlRGlhbG9nIiwiY2FsbEFjdGlvbiIsImNvbnRleHRzIiwic2hvd0FjdGlvblBhcmFtZXRlckRpYWxvZyIsImxhYmVsIiwiX2dldFNwZWNpZmljQ3JlYXRlQWN0aW9uRGlhbG9nTGFiZWwiLCJiaW5kaW5nUGFyYW1ldGVycyIsInBhcmVudENvbnRyb2wiLCJiSXNDcmVhdGVBY3Rpb24iLCJza2lwUGFyYW1ldGVyRGlhbG9nIiwiYklzTmV3UGFnZUNyZWF0aW9uIiwiY3JlYXRpb25Nb2RlIiwiQ3JlYXRpb25Sb3ciLCJJbmxpbmUiLCJhTm9uQ29tcHV0ZWRWaXNpYmxlS2V5RmllbGRzIiwiQ29tbW9uVXRpbHMiLCJnZXROb25Db21wdXRlZFZpc2libGVGaWVsZHMiLCJzRnVuY3Rpb25QYXRoIiwib0Z1bmN0aW9uQ29udGV4dCIsIm9GdW5jdGlvbiIsImNyZWF0ZUJpbmRpbmdDb250ZXh0Iiwib0RhdGEiLCJPYmplY3QiLCJhc3NpZ24iLCJfbGF1bmNoRGlhbG9nV2l0aEtleUZpZWxkcyIsIm5ld0NvbnRleHQiLCJjcmVhdGUiLCJjcmVhdGVBdEVuZCIsImluYWN0aXZlIiwib25BZnRlckNyZWF0ZUNvbXBsZXRpb24iLCJ0b0VTNlByb21pc2UiLCJjb250ZXh0UGF0aCIsIiRJc0JvdW5kIiwib3BlcmF0aW9ucyIsImNhbGxCb3VuZEZ1bmN0aW9uIiwiY2FsbEZ1bmN0aW9uSW1wb3J0Iiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJDb25zdGFudHMiLCJBY3Rpb25FeGVjdXRpb25GYWlsZWQiLCJDYW5jZWxBY3Rpb25EaWFsb2ciLCJpc1RyYW5zaWVudCIsImRlbGV0ZSIsInVubG9jayIsImZpbmRBY3RpdmVEcmFmdFJvb3RDb250ZXh0cyIsImFDb250ZXh0cyIsImJGaW5kQWN0aXZlQ29udGV4dHMiLCJhY3RpdmVDb250ZXh0cyIsInJlZHVjZSIsImFSZXN1bHQiLCJiSXNBY3RpdmVFbnRpdHkiLCJJc0FjdGl2ZUVudGl0eSIsImJIYXNBY3RpdmVFbnRpdHkiLCJIYXNBY3RpdmVFbnRpdHkiLCJvQWN0aXZlQ29udGV4dCIsImJpbmRDb250ZXh0IiwiZ2V0Qm91bmRDb250ZXh0IiwicHVzaCIsImFsbCIsIm1hcCIsInJlcXVlc3RDYW5vbmljYWxQYXRoIiwiYWZ0ZXJEZWxldGVQcm9jZXNzIiwiY2hlY2tCb3giLCJvSW50ZXJuYWxNb2RlbENvbnRleHQiLCJpbnRlcm5hbE1vZGVsQ29udGV4dCIsImdldFByb3BlcnR5IiwiaXNDaGVja0JveFZpc2libGUiLCJpc0NoZWNrQm94U2VsZWN0ZWQiLCJzZXRQcm9wZXJ0eSIsIm9iaiIsInNlbGVjdGVkQ29udGV4dHMiLCJmaWx0ZXIiLCJlbGVtZW50IiwiZGVsZXRhYmxlQ29udGV4dHMiLCJpbmRleE9mIiwibnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzIiwiTWVzc2FnZVRvYXN0Iiwic2hvdyIsImdldFRyYW5zbGF0ZWRUZXh0IiwiZW50aXR5U2V0TmFtZSIsImRlbGV0ZURvY3VtZW50IiwidkluQ29udGV4dHMiLCJhRGVsZXRhYmxlQ29udGV4dHMiLCJpc0xvY2tlZFRleHRWaXNpYmxlIiwiY2Fubm90QmVEZWxldGVkVGV4dFZpc2libGUiLCJiRGlhbG9nQ29uZmlybWVkIiwidGhhdCIsImFQYXJhbXMiLCJvRGVsZXRlTWVzc2FnZSIsInRpdGxlIiwiZ2V0VGV4dCIsInZDb250ZXh0cyIsIkFycmF5IiwiaXNBcnJheSIsIm9Db250ZXh0RGF0YSIsIkhhc0RyYWZ0RW50aXR5IiwiRHJhZnRBZG1pbmlzdHJhdGl2ZURhdGEiLCJJblByb2Nlc3NCeVVzZXIiLCJEcmFmdElzQ3JlYXRlZEJ5TWUiLCJzTG9ja2VkVXNlciIsImRyYWZ0QWRtaW5EYXRhIiwiTWVzc2FnZUJveCIsIm9uQ2xvc2UiLCJkZXNjcmlwdGlvbiIsInRleHQiLCJvTGluZUNvbnRleHREYXRhIiwib1RhYmxlIiwic0tleSIsImdldFBhcmVudCIsImdldElkZW50aWZpZXJDb2x1bW4iLCJzS2V5VmFsdWUiLCJzRGVzY3JpcHRpb24iLCJwYXRoIiwidW5TYXZlZENvbnRleHRzIiwic0xhc3RDaGFuZ2VkQnlVc2VyIiwiY29uY2F0IiwibG9ja2VkQ29udGV4dHMiLCJub25EZWxldGFibGVUZXh0IiwiX2dldE5vbkRlbGV0YWJsZVRleHQiLCJjaGVja0JveFRleHQiLCJzTm9uRGVsZXRhYmxlQ29udGV4dFRleHQiLCJvTm9uRGVsZXRhYmxlTWVzc2FnZVRleHRDb250cm9sIiwib0RlbGV0ZU1lc3NhZ2VUZXh0Q29udHJvbCIsIm9Db250ZW50IiwiVkJveCIsIml0ZW1zIiwiVGV4dCIsInZpc2libGUiLCJDaGVja0JveCIsInNlbGVjdGVkIiwic2VsZWN0Iiwib0V2ZW50IiwiZ2V0U291cmNlIiwiZ2V0U2VsZWN0ZWQiLCJzVGl0bGUiLCJmbkNvbmZpcm0iLCJiRW5hYmxlU3RyaWN0SGFuZGxpbmciLCJkcmFmdCIsImRlbGV0ZURyYWZ0Iiwic2hvd01lc3NhZ2VzIiwiYmVmb3JlRGVsZXRlQ2FsbEJhY2siLCJvRGlhbG9nIiwiRGlhbG9nIiwiY29udGVudCIsImFyaWFMYWJlbGxlZEJ5IiwiZ2V0VmlzaWJsZSIsImJlZ2luQnV0dG9uIiwiQnV0dG9uIiwidHlwZSIsInByZXNzIiwibWVzc2FnZUhhbmRsaW5nIiwicmVtb3ZlQm91bmRUcmFuc2l0aW9uTWVzc2FnZXMiLCJjbG9zZSIsImVuZEJ1dHRvbiIsImFmdGVyQ2xvc2UiLCJkZXN0cm95Iiwibm9EaWFsb2ciLCJhZGRTdHlsZUNsYXNzIiwib3BlbiIsImVkaXREb2N1bWVudCIsInJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcyIsImNyZWF0ZURyYWZ0RnJvbUFjdGl2ZURvY3VtZW50IiwiYlByZXNlcnZlQ2hhbmdlcyIsInN0aWNreSIsImVkaXREb2N1bWVudEluU3RpY2t5U2Vzc2lvbiIsIm9OZXdDb250ZXh0IiwiZXJyIiwiY29uY3VycmVudEVkaXRGbGFnIiwiY2FuY2VsRG9jdW1lbnQiLCJyZXR1cm5lZFZhbHVlIiwicmVxdWVzdE9iamVjdCIsImhhc1BlbmRpbmdDaGFuZ2VzIiwiZ2V0QmluZGluZyIsInJlc2V0Q2hhbmdlcyIsIm9TaWJsaW5nQ29udGV4dCIsInNDYW5vbmljYWxQYXRoIiwiZGlzY2FyZERvY3VtZW50IiwiZGlzY2FyZGVkQ29udGV4dCIsInJlZnJlc2giLCJpc0tlZXBBbGl2ZSIsInNldEtlZXBBbGl2ZSIsImJlZm9yZUNhbmNlbENhbGxCYWNrIiwiY29udGV4dCIsInNraXBEaXNjYXJkUG9wb3ZlciIsIl9zaG93RGlzY2FyZFBvcG92ZXIiLCJjYW5jZWxCdXR0b24iLCJkcmFmdERhdGFDb250ZXh0IiwiQ3JlYXRpb25EYXRlVGltZSIsIkxhc3RDaGFuZ2VEYXRlVGltZSIsInNhdmVEb2N1bWVudCIsImJFeGVjdXRlU2lkZUVmZmVjdHNPbkVycm9yIiwiYUJpbmRpbmdzIiwiYWN0aXZhdGVEb2N1bWVudCIsIm9BY3RpdmVEb2N1bWVudCIsImJOZXdPYmplY3QiLCJtZXNzYWdlc1JlY2VpdmVkIiwiZ2V0TWVzc2FnZXMiLCJNZXNzYWdlVHlwZSIsIlN1Y2Nlc3MiLCJmb3JFYWNoIiwib0xpc3RCaW5kaW5nIiwiaGFzVHJhbnNpZW50Q29udGV4dCIsImdldFNpZGVFZmZlY3RzU2VydmljZSIsInJlcXVlc3RTaWRlRWZmZWN0c0Zvck5hdmlnYXRpb25Qcm9wZXJ0eSIsInNBY3Rpb25OYW1lIiwic05hbWUiLCJzcGxpdCIsIm1vZGVsIiwibVNpZGVFZmZlY3RzUGFyYW1ldGVycyIsImdldE9EYXRhQWN0aW9uU2lkZUVmZmVjdHMiLCJkaXNwbGF5VW5hcHBsaWNhYmxlQ29udGV4dHNEaWFsb2ciLCJub3RBcHBsaWNhYmxlQ29udGV4dCIsImZuT3BlbkFuZEZpbGxEaWFsb2ciLCJvRGxnIiwib0RpYWxvZ0NvbnRlbnQiLCJuTm90QXBwbGljYWJsZSIsImFOb3RBcHBsaWNhYmxlSXRlbXMiLCJvTm90QXBwbGljYWJsZUl0ZW1zTW9kZWwiLCJKU09OTW9kZWwiLCJvVG90YWxzIiwidG90YWwiLCJzZXRNb2RlbCIsInNGcmFnbWVudE5hbWUiLCJvRGlhbG9nRnJhZ21lbnQiLCJYTUxUZW1wbGF0ZVByb2Nlc3NvciIsImxvYWRUZW1wbGF0ZSIsImdldENhbm9uaWNhbFBhdGgiLCJzRW50aXR5U2V0Iiwic3Vic3RyIiwib0RpYWxvZ0xhYmVsTW9kZWwiLCJYTUxQcmVwcm9jZXNzb3IiLCJwcm9jZXNzIiwibmFtZSIsImJpbmRpbmdDb250ZXh0cyIsImVudGl0eVR5cGUiLCJtb2RlbHMiLCJtZXRhTW9kZWwiLCJvRnJhZ21lbnQiLCJvQ29udHJvbGxlciIsIm9uQ29udGludWUiLCJhcHBsaWNhYmxlQ29udGV4dCIsIkZyYWdtZW50IiwibG9hZCIsImRlZmluaXRpb24iLCJjb250cm9sbGVyIiwiYWRkRGVwZW5kZW50IiwiX2hhbmRsZUFjdGlvblJlc3BvbnNlIiwiY29udGV4dFRvUHJvY2VzcyIsImNhbGxCb3VuZEFjdGlvbiIsInBhcmFtZXRlclZhbHVlcyIsImludm9jYXRpb25Hcm91cGluZyIsImFkZGl0aW9uYWxTaWRlRWZmZWN0Iiwib25TdWJtaXR0ZWQiLCJvblJlc3BvbnNlIiwiY29udHJvbElkIiwib3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwiYkdldEJvdW5kQ29udGV4dCIsImJPYmplY3RQYWdlIiwiZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uIiwic2VsZWN0ZWRJdGVtcyIsImNhbGxBY3Rpb25JbXBvcnQiLCJhVHJhbnNpZW50TWVzc2FnZXMiLCJoYW5kbGVWYWxpZGF0aW9uRXJyb3IiLCJvTWVzc2FnZU1hbmFnZXIiLCJnZXRNZXNzYWdlTWFuYWdlciIsImVycm9yVG9SZW1vdmUiLCJnZXRNZXNzYWdlTW9kZWwiLCJnZXREYXRhIiwidmFsaWRhdGlvbiIsInJlbW92ZU1lc3NhZ2VzIiwib0NhbmNlbEJ1dHRvbiIsImJJc01vZGlmaWVkIiwiZm5PbkFmdGVyRGlzY2FyZCIsInNldEVuYWJsZWQiLCJfb1BvcG92ZXIiLCJkZXRhY2hBZnRlckNsb3NlIiwib1RleHQiLCJvQnV0dG9uIiwid2lkdGgiLCJQb3BvdmVyIiwic2hvd0hlYWRlciIsInBsYWNlbWVudCIsImJlZm9yZU9wZW4iLCJzZXRJbml0aWFsRm9jdXMiLCJhdHRhY2hBZnRlckNsb3NlIiwib3BlbkJ5IiwiX29uRmllbGRDaGFuZ2UiLCJvQ3JlYXRlQnV0dG9uIiwiZm5WYWxpZGF0ZVJlcXVpcmVkUHJvcGVydGllcyIsIm9GaWVsZCIsIm9GaWVsZFByb21pc2UiLCJnZXRQYXJhbWV0ZXIiLCJzZXRWYWx1ZSIsImdldFZhbHVlIiwiY2F0Y2giLCJhTm9uRGVsZXRhYmxlQ29udGV4dHMiLCJtRmllbGRzIiwib1BhcmVudENvbnRyb2wiLCJvVHJhbnNpZW50TGlzdEJpbmRpbmciLCJiaW5kTGlzdCIsIiQkdXBkYXRlR3JvdXBJZCIsInJlZnJlc2hJbnRlcm5hbCIsIm9UcmFuc2llbnRDb250ZXh0IiwiZ2V0Q29udHJvbGxlciIsImFJbW11dGFibGVGaWVsZHMiLCJvRW50aXR5U2V0Q29udGV4dCIsIm9JbW11dGFibGVDdHhNb2RlbCIsIm9JbW11dGFibGVDdHgiLCJhUmVxdWlyZWRQcm9wZXJ0aWVzIiwiZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyIsIm9SZXF1aXJlZFByb3BlcnR5UGF0aHNDdHhNb2RlbCIsIm9SZXF1aXJlZFByb3BlcnR5UGF0aHNDdHgiLCJlbnRpdHlTZXQiLCJmaWVsZHMiLCJyZXF1aXJlZFByb3BlcnRpZXMiLCJvTmV3RnJhZ21lbnQiLCJhRm9ybUVsZW1lbnRzIiwibUZpZWxkVmFsdWVNYXAiLCJ2YWxpZGF0ZVJlcXVpcmVkUHJvcGVydGllcyIsImJFbmFibGVkIiwib0Zvcm1FbGVtZW50IiwiZ2V0RmllbGRzIiwiZ2V0UmVxdWlyZWQiLCJnZXRWYWx1ZVN0YXRlIiwic0ZpZWxkSWQiLCJnZXRJZCIsInZWYWx1ZSIsImFSZXN1bHRzIiwiZXZlcnkiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVMaXZlQ2hhbmdlIiwiY3JlYXRlQnV0dG9uIiwiYklzQ3JlYXRlRGlhbG9nIiwia2V5cyIsIm9WYWx1ZSIsIm9EaWFsb2dWYWx1ZSIsImFWYWx1ZXMiLCJ0cmFuc2llbnREYXRhIiwiY3JlYXRlRGF0YSIsInNQcm9wZXJ0eVBhdGgiLCJvUHJvcGVydHkiLCIka2luZCIsIm9Qcm9taXNlIiwib1Jlc3BvbnNlIiwiYktlZXBEaWFsb2dPcGVuIiwic2V0QmluZGluZ0NvbnRleHQiLCJyZXNwb25zZSIsImNyZWF0ZVBhcmFtZXRlcnMiLCJDcmVhdGlvbkZhaWxlZCIsImdldEJpbmRpbmdDb250ZXh0IiwiZ2V0QWdncmVnYXRpb24iLCJnZXRCZWdpbkJ1dHRvbiIsInNldFVzZXJEZWZhdWx0cyIsImNyZWF0ZUFjdGlvbiIsImZuUmVzb2x2ZSIsImZuQ3JlYXRlQ29tcGxldGVkIiwiYlN1Y2Nlc3MiLCJkZXRhY2hDcmVhdGVDb21wbGV0ZWQiLCJmblNhZmVDb250ZXh0Q3JlYXRlZCIsImNyZWF0ZWQiLCJ0cmFjZSIsImNvbnRleHRFcnJvciIsImF0dGFjaENyZWF0ZUNvbXBsZXRlZCIsImtlZXBUcmFuc2llbnRDb250ZXh0T25GYWlsZWQiLCJnZXRVcGRhdGVHcm91cElkIiwicHJlZmVycmVkTW9kZSIsInRvVXBwZXJDYXNlIiwic1ByZWZlcnJlZE1vZGUiLCJmbkdldExhYmVsRnJvbUxpbmVJdGVtQW5ub3RhdGlvbiIsImlMaW5lSXRlbUluZGV4IiwiZmluZEluZGV4Iiwib0xpbmVJdGVtIiwiYUxpbmVJdGVtQWN0aW9uIiwiQWN0aW9uIiwiTGFiZWwiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlRyYW5zYWN0aW9uSGVscGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB0eXBlIEFwcENvbXBvbmVudCBmcm9tIFwic2FwL2ZlL2NvcmUvQXBwQ29tcG9uZW50XCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgQnVzeUxvY2tlciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvQnVzeUxvY2tlclwiO1xuaW1wb3J0IGRyYWZ0IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9lZGl0Rmxvdy9kcmFmdFwiO1xuaW1wb3J0IG9wZXJhdGlvbnMgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L29wZXJhdGlvbnNcIjtcbmltcG9ydCBzdGlja3kgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L3N0aWNreVwiO1xuaW1wb3J0IHR5cGUgTWVzc2FnZUhhbmRsZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL01lc3NhZ2VIYW5kbGVyXCI7XG5pbXBvcnQgbWVzc2FnZUhhbmRsaW5nIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9tZXNzYWdlSGFuZGxlci9tZXNzYWdlSGFuZGxpbmdcIjtcbmltcG9ydCBGUE1IZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvRlBNSGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IEludGVybmFsTW9kZWxDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IEZFTGlicmFyeSBmcm9tIFwic2FwL2ZlL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwic2FwL20vQnV0dG9uXCI7XG5pbXBvcnQgQ2hlY2tCb3ggZnJvbSBcInNhcC9tL0NoZWNrQm94XCI7XG5pbXBvcnQgRGlhbG9nIGZyb20gXCJzYXAvbS9EaWFsb2dcIjtcbmltcG9ydCBNZXNzYWdlQm94IGZyb20gXCJzYXAvbS9NZXNzYWdlQm94XCI7XG5pbXBvcnQgTWVzc2FnZVRvYXN0IGZyb20gXCJzYXAvbS9NZXNzYWdlVG9hc3RcIjtcbmltcG9ydCBQb3BvdmVyIGZyb20gXCJzYXAvbS9Qb3BvdmVyXCI7XG5pbXBvcnQgVGV4dCBmcm9tIFwic2FwL20vVGV4dFwiO1xuaW1wb3J0IFZCb3ggZnJvbSBcInNhcC9tL1ZCb3hcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgRnJhZ21lbnQgZnJvbSBcInNhcC91aS9jb3JlL0ZyYWdtZW50XCI7XG5pbXBvcnQgY29yZUxpYnJhcnkgZnJvbSBcInNhcC91aS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCB0eXBlIFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgWE1MUHJlcHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS91dGlsL1hNTFByZXByb2Nlc3NvclwiO1xuaW1wb3J0IFhNTFRlbXBsYXRlUHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS9YTUxUZW1wbGF0ZVByb2Nlc3NvclwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFWNENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgeyBPRGF0YUxpc3RCaW5kaW5nLCBWNENvbnRleHQgfSBmcm9tIFwidHlwZXMvZXh0ZW5zaW9uX3R5cGVzXCI7XG5pbXBvcnQgdG9FUzZQcm9taXNlIGZyb20gXCIuLi8uLi9oZWxwZXJzL1RvRVM2UHJvbWlzZVwiO1xuXG5jb25zdCBDcmVhdGlvbk1vZGUgPSBGRUxpYnJhcnkuQ3JlYXRpb25Nb2RlO1xuY29uc3QgUHJvZ3JhbW1pbmdNb2RlbCA9IEZFTGlicmFyeS5Qcm9ncmFtbWluZ01vZGVsO1xuY29uc3QgVmFsdWVTdGF0ZSA9IGNvcmVMaWJyYXJ5LlZhbHVlU3RhdGU7XG4vKiBNYWtlIHN1cmUgdGhhdCB0aGUgbVBhcmFtZXRlcnMgaXMgbm90IHRoZSBvRXZlbnQgKi9cbmZ1bmN0aW9uIGdldFBhcmFtZXRlcnMobVBhcmFtZXRlcnM6IGFueSkge1xuXHRpZiAobVBhcmFtZXRlcnMgJiYgbVBhcmFtZXRlcnMuZ2V0TWV0YWRhdGEgJiYgbVBhcmFtZXRlcnMuZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCkgPT09IFwic2FwLnVpLmJhc2UuRXZlbnRcIikge1xuXHRcdG1QYXJhbWV0ZXJzID0ge307XG5cdH1cblx0cmV0dXJuIG1QYXJhbWV0ZXJzIHx8IHt9O1xufVxuXG5jbGFzcyBUcmFuc2FjdGlvbkhlbHBlciB7XG5cdF9vQXBwQ29tcG9uZW50OiBBcHBDb21wb25lbnQ7XG5cdG9Mb2NrT2JqZWN0OiBhbnk7XG5cdHNQcm9ncmFtbWluZ01vZGVsPzogdHlwZW9mIFByb2dyYW1taW5nTW9kZWw7XG5cdF9iSXNNb2RpZmllZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRfYkNyZWF0ZU1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcblx0X2JDb250aW51ZURpc2NhcmQ6IGJvb2xlYW4gPSBmYWxzZTtcblx0X29Qb3BvdmVyITogUG9wb3Zlcjtcblx0Y29uc3RydWN0b3Iob0FwcENvbXBvbmVudDogQXBwQ29tcG9uZW50LCBvTG9ja09iamVjdDogYW55KSB7XG5cdFx0dGhpcy5fb0FwcENvbXBvbmVudCA9IG9BcHBDb21wb25lbnQ7XG5cdFx0dGhpcy5vTG9ja09iamVjdCA9IG9Mb2NrT2JqZWN0O1xuXHR9XG5cdGdldFByb2dyYW1taW5nTW9kZWwob0NvbnRleHQ/OiBhbnkpOiB0eXBlb2YgUHJvZ3JhbW1pbmdNb2RlbCB7XG5cdFx0aWYgKCF0aGlzLnNQcm9ncmFtbWluZ01vZGVsICYmIG9Db250ZXh0KSB7XG5cdFx0XHRsZXQgc1BhdGg7XG5cdFx0XHRpZiAob0NvbnRleHQuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0LkNvbnRleHRcIikpIHtcblx0XHRcdFx0c1BhdGggPSBvQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzUGF0aCA9IG9Db250ZXh0LmlzUmVsYXRpdmUoKSA/IG9Db250ZXh0LmdldFJlc29sdmVkUGF0aCgpIDogb0NvbnRleHQuZ2V0UGF0aCgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKE1vZGVsSGVscGVyLmlzRHJhZnRTdXBwb3J0ZWQob0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSwgc1BhdGgpKSB7XG5cdFx0XHRcdHRoaXMuc1Byb2dyYW1taW5nTW9kZWwgPSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0O1xuXHRcdFx0fSBlbHNlIGlmIChNb2RlbEhlbHBlci5pc1N0aWNreVNlc3Npb25TdXBwb3J0ZWQob0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSkpIHtcblx0XHRcdFx0dGhpcy5zUHJvZ3JhbW1pbmdNb2RlbCA9IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gYXMgdGhlIHRyYW5zYWN0aW9uIGhlbHBlciBpcyBhIHNpbmdsZXRvbiB3ZSBkb24ndCBzdG9yZSB0aGUgbm9uIGRyYWZ0IGFzIHRoZSB1c2VyIGNvdWxkXG5cdFx0XHRcdC8vIHN0YXJ0IHdpdGggYSBub24gZHJhZnQgY2hpbGQgcGFnZSBhbmQgbmF2aWdhdGVzIGJhY2sgdG8gYSBkcmFmdCBlbmFibGVkIG9uZVxuXHRcdFx0XHRyZXR1cm4gUHJvZ3JhbW1pbmdNb2RlbC5Ob25EcmFmdDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuc1Byb2dyYW1taW5nTW9kZWw7XG5cdH1cblxuXHQvKipcblx0ICogVmFsaWRhdGVzIGEgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlclxuXHQgKiBAc3RhdGljXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9mIHRoZSBkb2N1bWVudCB0byBiZSB2YWxpZGF0ZWRcblx0ICogQHBhcmFtIFttUGFyYW1ldGVyc10gQ2FuIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmRhdGFdIEEgbWFwIG9mIGRhdGEgdGhhdCBzaG91bGQgYmUgdmFsaWRhdGVkXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uXSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIHZhbGlkYXRpb24gZnVuY3Rpb25cblx0ICogQHBhcmFtIG9WaWV3IENvbnRhaW5zIHRoZSBvYmplY3Qgb2YgdGhlIGN1cnJlbnQgdmlld1xuXHQgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIHdpdGggcmVzdWx0IG9mIHRoZSBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvblxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQGZpbmFsXG5cdCAqL1xuXHR2YWxpZGF0ZURvY3VtZW50KG9Db250ZXh0OiBWNENvbnRleHQsIG1QYXJhbWV0ZXJzOiBhbnksIG9WaWV3OiBWaWV3KTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBzQ3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uID0gbVBhcmFtZXRlcnMgJiYgbVBhcmFtZXRlcnMuY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uO1xuXHRcdGlmIChzQ3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uKSB7XG5cdFx0XHRjb25zdCBzTW9kdWxlID0gc0N1c3RvbVZhbGlkYXRpb25GdW5jdGlvbi5zdWJzdHJpbmcoMCwgc0N1c3RvbVZhbGlkYXRpb25GdW5jdGlvbi5sYXN0SW5kZXhPZihcIi5cIikgfHwgLTEpLnJlcGxhY2UoL1xcLi9naSwgXCIvXCIpLFxuXHRcdFx0XHRzRnVuY3Rpb25OYW1lID0gc0N1c3RvbVZhbGlkYXRpb25GdW5jdGlvbi5zdWJzdHJpbmcoXG5cdFx0XHRcdFx0c0N1c3RvbVZhbGlkYXRpb25GdW5jdGlvbi5sYXN0SW5kZXhPZihcIi5cIikgKyAxLFxuXHRcdFx0XHRcdHNDdXN0b21WYWxpZGF0aW9uRnVuY3Rpb24ubGVuZ3RoXG5cdFx0XHRcdCksXG5cdFx0XHRcdG1EYXRhID0gbVBhcmFtZXRlcnMuZGF0YTtcblx0XHRcdGRlbGV0ZSBtRGF0YVtcIkAkdWk1LmNvbnRleHQuaXNUcmFuc2llbnRcIl07XG5cdFx0XHRyZXR1cm4gRlBNSGVscGVyLnZhbGlkYXRpb25XcmFwcGVyKHNNb2R1bGUsIHNGdW5jdGlvbk5hbWUsIG1EYXRhLCBvVmlldywgb0NvbnRleHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGRvY3VtZW50LlxuXHQgKlxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuVHJhbnNhY3Rpb25IZWxwZXJcblx0ICogQHN0YXRpY1xuXHQgKiBAcGFyYW0gb01haW5MaXN0QmluZGluZyBPRGF0YSBWNCBMaXN0QmluZGluZyBvYmplY3Rcblx0ICogQHBhcmFtIFttSW5QYXJhbWV0ZXJzXSBPcHRpb25hbCwgY2FuIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gW21JblBhcmFtZXRlcnMuZGF0YV0gQSBtYXAgb2YgZGF0YSB0aGF0IHNob3VsZCBiZSBzZW50IHdpdGhpbiB0aGUgUE9TVFxuXHQgKiBAcGFyYW0gW21JblBhcmFtZXRlcnMuYnVzeU1vZGVdIEdsb2JhbCAoZGVmYXVsdCksIExvY2FsLCBOb25lIFRPRE86IHRvIGJlIHJlZmFjdG9yZWRcblx0ICogQHBhcmFtIFttSW5QYXJhbWV0ZXJzLmJ1c3lJZF0gSUQgb2YgdGhlIGxvY2FsIGJ1c3kgaW5kaWNhdG9yXG5cdCAqIEBwYXJhbSBbbUluUGFyYW1ldGVycy5rZWVwVHJhbnNpZW50Q29udGV4dE9uRmFpbGVkXSBJZiBzZXQsIHRoZSBjb250ZXh0IHN0YXlzIGluIHRoZSBsaXN0IGlmIHRoZSBQT1NUIGZhaWxlZCBhbmQgUE9TVCB3aWxsIGJlIHJlcGVhdGVkIHdpdGggdGhlIG5leHQgY2hhbmdlXG5cdCAqIEBwYXJhbSBbbUluUGFyYW1ldGVycy5pbmFjdGl2ZV0gSWYgc2V0LCB0aGUgY29udGV4dCBpcyBzZXQgYXMgaW5hY3RpdmUgZm9yIGVtcHR5IHJvd3Ncblx0ICogQHBhcmFtIFttSW5QYXJhbWV0ZXJzLnNraXBQYXJhbWV0ZXJEaWFsb2ddIFNraXBzIHRoZSBhY3Rpb24gcGFyYW1ldGVyIGRpYWxvZ1xuXHQgKiBAcGFyYW0gb1Jlc291cmNlQnVuZGxlXG5cdCAqIEBwYXJhbSBtZXNzYWdlSGFuZGxlclxuXHQgKiBAcGFyYW0gYkZyb21Db3B5UGFzdGVcblx0ICogQHBhcmFtIG9WaWV3IFRoZSBjdXJyZW50IHZpZXdcblx0ICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlcyB3aXRoIG5ldyBiaW5kaW5nIGNvbnRleHRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0YXN5bmMgY3JlYXRlRG9jdW1lbnQoXG5cdFx0b01haW5MaXN0QmluZGluZzogT0RhdGFMaXN0QmluZGluZyxcblx0XHRtSW5QYXJhbWV0ZXJzOlxuXHRcdFx0fCB7XG5cdFx0XHRcdFx0ZGF0YT86IGFueTtcblx0XHRcdFx0XHRidXN5TW9kZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRidXN5SWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRrZWVwVHJhbnNpZW50Q29udGV4dE9uRmFpbGVkPzogYW55O1xuXHRcdFx0XHRcdGluYWN0aXZlPzogYm9vbGVhbjtcblx0XHRcdCAgfVxuXHRcdFx0fCB1bmRlZmluZWQsXG5cdFx0b1Jlc291cmNlQnVuZGxlOiBhbnksXG5cdFx0bWVzc2FnZUhhbmRsZXI6IE1lc3NhZ2VIYW5kbGVyLFxuXHRcdGJGcm9tQ29weVBhc3RlOiBib29sZWFuID0gZmFsc2UsXG5cdFx0b1ZpZXc6IGFueVxuXHQpOiBQcm9taXNlPE9EYXRhVjRDb250ZXh0PiB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3Qgb01vZGVsID0gb01haW5MaXN0QmluZGluZy5nZXRNb2RlbCgpLFxuXHRcdFx0b01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdHNNZXRhUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob01haW5MaXN0QmluZGluZy5nZXRIZWFkZXJDb250ZXh0KCkuZ2V0UGF0aCgpKSxcblx0XHRcdHNDcmVhdGVIYXNoID0gdGhpcy5fZ2V0QXBwQ29tcG9uZW50KCkuZ2V0Um91dGVyUHJveHkoKS5nZXRIYXNoKCksXG5cdFx0XHRvQ29tcG9uZW50RGF0YSA9IHRoaXMuX2dldEFwcENvbXBvbmVudCgpLmdldENvbXBvbmVudERhdGEoKSxcblx0XHRcdG9TdGFydHVwUGFyYW1ldGVycyA9IChvQ29tcG9uZW50RGF0YSAmJiBvQ29tcG9uZW50RGF0YS5zdGFydHVwUGFyYW1ldGVycykgfHwge30sXG5cdFx0XHRzTmV3QWN0aW9uID0gIW9NYWluTGlzdEJpbmRpbmcuaXNSZWxhdGl2ZSgpXG5cdFx0XHRcdD8gdGhpcy5fZ2V0TmV3QWN0aW9uKG9TdGFydHVwUGFyYW1ldGVycywgc0NyZWF0ZUhhc2gsIG9NZXRhTW9kZWwsIHNNZXRhUGF0aClcblx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgbUJpbmRpbmdQYXJhbWV0ZXJzOiBhbnkgPSB7IFwiJCRwYXRjaFdpdGhvdXRTaWRlRWZmZWN0c1wiOiB0cnVlIH07XG5cdFx0Y29uc3Qgc01lc3NhZ2VzUGF0aCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhUGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NZXNzYWdlcy8kUGF0aGApO1xuXHRcdGxldCBzQnVzeVBhdGggPSBcIi9idXN5XCI7XG5cdFx0bGV0IHNGdW5jdGlvbk5hbWUgPVxuXHRcdFx0b01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRGVmYXVsdFZhbHVlc0Z1bmN0aW9uYCkgfHxcblx0XHRcdG9NZXRhTW9kZWwuZ2V0T2JqZWN0KFxuXHRcdFx0XHRgJHtNb2RlbEhlbHBlci5nZXRUYXJnZXRFbnRpdHlTZXQob01ldGFNb2RlbC5nZXRDb250ZXh0KHNNZXRhUGF0aCkpfUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRGVmYXVsdFZhbHVlc0Z1bmN0aW9uYFxuXHRcdFx0KTtcblx0XHRsZXQgYkZ1bmN0aW9uT25OYXZQcm9wO1xuXHRcdGxldCBvTmV3RG9jdW1lbnRDb250ZXh0OiBPRGF0YVY0Q29udGV4dCB8IHVuZGVmaW5lZDtcblx0XHRpZiAoc0Z1bmN0aW9uTmFtZSkge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YVBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EZWZhdWx0VmFsdWVzRnVuY3Rpb25gKSAmJlxuXHRcdFx0XHRNb2RlbEhlbHBlci5nZXRUYXJnZXRFbnRpdHlTZXQob01ldGFNb2RlbC5nZXRDb250ZXh0KHNNZXRhUGF0aCkpICE9PSBzTWV0YVBhdGhcblx0XHRcdCkge1xuXHRcdFx0XHRiRnVuY3Rpb25Pbk5hdlByb3AgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YkZ1bmN0aW9uT25OYXZQcm9wID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChzTWVzc2FnZXNQYXRoKSB7XG5cdFx0XHRtQmluZGluZ1BhcmFtZXRlcnNbXCIkc2VsZWN0XCJdID0gc01lc3NhZ2VzUGF0aDtcblx0XHR9XG5cdFx0Y29uc3QgbVBhcmFtZXRlcnMgPSBnZXRQYXJhbWV0ZXJzKG1JblBhcmFtZXRlcnMpO1xuXHRcdGlmICghb01haW5MaXN0QmluZGluZykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQmluZGluZyByZXF1aXJlZCBmb3IgbmV3IGRvY3VtZW50IGNyZWF0aW9uXCIpO1xuXHRcdH1cblx0XHRjb25zdCBzUHJvZ3JhbW1pbmdNb2RlbCA9IHRoaXMuZ2V0UHJvZ3JhbW1pbmdNb2RlbChvTWFpbkxpc3RCaW5kaW5nKTtcblx0XHRpZiAoc1Byb2dyYW1taW5nTW9kZWwgIT09IFByb2dyYW1taW5nTW9kZWwuRHJhZnQgJiYgc1Byb2dyYW1taW5nTW9kZWwgIT09IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDcmVhdGUgZG9jdW1lbnQgb25seSBhbGxvd2VkIGZvciBkcmFmdCBvciBzdGlja3kgc2Vzc2lvbiBzdXBwb3J0ZWQgc2VydmljZXNcIik7XG5cdFx0fVxuXHRcdGlmIChtUGFyYW1ldGVycy5idXN5TW9kZSA9PT0gXCJMb2NhbFwiKSB7XG5cdFx0XHRzQnVzeVBhdGggPSBgL2J1c3lMb2NhbC8ke21QYXJhbWV0ZXJzLmJ1c3lJZH1gO1xuXHRcdH1cblx0XHRtUGFyYW1ldGVycy5iZWZvcmVDcmVhdGVDYWxsQmFjayA9IGJGcm9tQ29weVBhc3RlID8gbnVsbCA6IG1QYXJhbWV0ZXJzLmJlZm9yZUNyZWF0ZUNhbGxCYWNrO1xuXHRcdEJ1c3lMb2NrZXIubG9jayh0aGlzLm9Mb2NrT2JqZWN0LCBzQnVzeVBhdGgpO1xuXHRcdGNvbnN0IG9SZXNvdXJjZUJ1bmRsZUNvcmUgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRcdGxldCBvUmVzdWx0OiBhbnk7XG5cblx0XHR0cnkge1xuXHRcdFx0bGV0IGJDb25zaWRlckRvY3VtZW50TW9kaWZpZWQgPSBmYWxzZTtcblx0XHRcdGlmIChzTmV3QWN0aW9uKSB7XG5cdFx0XHRcdGJDb25zaWRlckRvY3VtZW50TW9kaWZpZWQgPSB0cnVlO1xuXHRcdFx0XHRvUmVzdWx0ID0gYXdhaXQgdGhpcy5jYWxsQWN0aW9uKFxuXHRcdFx0XHRcdHNOZXdBY3Rpb24sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29udGV4dHM6IG9NYWluTGlzdEJpbmRpbmcuZ2V0SGVhZGVyQ29udGV4dCgpLFxuXHRcdFx0XHRcdFx0c2hvd0FjdGlvblBhcmFtZXRlckRpYWxvZzogdHJ1ZSxcblx0XHRcdFx0XHRcdGxhYmVsOiB0aGlzLl9nZXRTcGVjaWZpY0NyZWF0ZUFjdGlvbkRpYWxvZ0xhYmVsKG9NZXRhTW9kZWwsIHNNZXRhUGF0aCwgc05ld0FjdGlvbiwgb1Jlc291cmNlQnVuZGxlQ29yZSksXG5cdFx0XHRcdFx0XHRiaW5kaW5nUGFyYW1ldGVyczogbUJpbmRpbmdQYXJhbWV0ZXJzLFxuXHRcdFx0XHRcdFx0cGFyZW50Q29udHJvbDogbVBhcmFtZXRlcnMucGFyZW50Q29udHJvbCxcblx0XHRcdFx0XHRcdGJJc0NyZWF0ZUFjdGlvbjogdHJ1ZSxcblx0XHRcdFx0XHRcdHNraXBQYXJhbWV0ZXJEaWFsb2c6IG1QYXJhbWV0ZXJzLnNraXBQYXJhbWV0ZXJEaWFsb2dcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXJcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGJJc05ld1BhZ2VDcmVhdGlvbiA9XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnMuY3JlYXRpb25Nb2RlICE9PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cgJiYgbVBhcmFtZXRlcnMuY3JlYXRpb25Nb2RlICE9PSBDcmVhdGlvbk1vZGUuSW5saW5lO1xuXHRcdFx0XHRjb25zdCBhTm9uQ29tcHV0ZWRWaXNpYmxlS2V5RmllbGRzID0gYklzTmV3UGFnZUNyZWF0aW9uXG5cdFx0XHRcdFx0PyBDb21tb25VdGlscy5nZXROb25Db21wdXRlZFZpc2libGVGaWVsZHMob01ldGFNb2RlbCwgc01ldGFQYXRoLCBvVmlldylcblx0XHRcdFx0XHQ6IFtdO1xuXHRcdFx0XHRzRnVuY3Rpb25OYW1lID0gYkZyb21Db3B5UGFzdGUgPyBudWxsIDogc0Z1bmN0aW9uTmFtZTtcblx0XHRcdFx0bGV0IHNGdW5jdGlvblBhdGgsIG9GdW5jdGlvbkNvbnRleHQ7XG5cdFx0XHRcdGlmIChzRnVuY3Rpb25OYW1lKSB7XG5cdFx0XHRcdFx0Ly9ib3VuZCB0byB0aGUgc291cmNlIGVudGl0eTpcblx0XHRcdFx0XHRpZiAoYkZ1bmN0aW9uT25OYXZQcm9wKSB7XG5cdFx0XHRcdFx0XHRzRnVuY3Rpb25QYXRoID1cblx0XHRcdFx0XHRcdFx0b01haW5MaXN0QmluZGluZy5nZXRDb250ZXh0KCkgJiZcblx0XHRcdFx0XHRcdFx0YCR7b01ldGFNb2RlbC5nZXRNZXRhUGF0aChvTWFpbkxpc3RCaW5kaW5nLmdldENvbnRleHQoKS5nZXRQYXRoKCkpfS8ke3NGdW5jdGlvbk5hbWV9YDtcblx0XHRcdFx0XHRcdG9GdW5jdGlvbkNvbnRleHQgPSBvTWFpbkxpc3RCaW5kaW5nLmdldENvbnRleHQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c0Z1bmN0aW9uUGF0aCA9XG5cdFx0XHRcdFx0XHRcdG9NYWluTGlzdEJpbmRpbmcuZ2V0SGVhZGVyQ29udGV4dCgpICYmXG5cdFx0XHRcdFx0XHRcdGAke29NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob01haW5MaXN0QmluZGluZy5nZXRIZWFkZXJDb250ZXh0KCkuZ2V0UGF0aCgpKX0vJHtzRnVuY3Rpb25OYW1lfWA7XG5cdFx0XHRcdFx0XHRvRnVuY3Rpb25Db250ZXh0ID0gb01haW5MaXN0QmluZGluZy5nZXRIZWFkZXJDb250ZXh0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IG9GdW5jdGlvbiA9IHNGdW5jdGlvblBhdGggJiYgKG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoc0Z1bmN0aW9uUGF0aCkgYXMgYW55KTtcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGxldCBvRGF0YTogYW55O1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvQ29udGV4dCA9XG5cdFx0XHRcdFx0XHRcdG9GdW5jdGlvbiAmJiBvRnVuY3Rpb24uZ2V0T2JqZWN0KCkgJiYgb0Z1bmN0aW9uLmdldE9iamVjdCgpWzBdLiRJc0JvdW5kXG5cdFx0XHRcdFx0XHRcdFx0PyBhd2FpdCBvcGVyYXRpb25zLmNhbGxCb3VuZEZ1bmN0aW9uKHNGdW5jdGlvbk5hbWUsIG9GdW5jdGlvbkNvbnRleHQsIG9Nb2RlbClcblx0XHRcdFx0XHRcdFx0XHQ6IGF3YWl0IG9wZXJhdGlvbnMuY2FsbEZ1bmN0aW9uSW1wb3J0KHNGdW5jdGlvbk5hbWUsIG9Nb2RlbCk7XG5cdFx0XHRcdFx0XHRpZiAob0NvbnRleHQpIHtcblx0XHRcdFx0XHRcdFx0b0RhdGEgPSBvQ29udGV4dC5nZXRPYmplY3QoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKGBFcnJvciB3aGlsZSBleGVjdXRpbmcgdGhlIGZ1bmN0aW9uICR7c0Z1bmN0aW9uTmFtZX1gLCBvRXJyb3IpO1xuXHRcdFx0XHRcdFx0dGhyb3cgb0Vycm9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtUGFyYW1ldGVycy5kYXRhID0gb0RhdGEgPyBPYmplY3QuYXNzaWduKHt9LCBvRGF0YSwgbVBhcmFtZXRlcnMuZGF0YSkgOiBtUGFyYW1ldGVycy5kYXRhO1xuXHRcdFx0XHRcdGlmIChtUGFyYW1ldGVycy5kYXRhKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgbVBhcmFtZXRlcnMuZGF0YVtcIkBvZGF0YS5jb250ZXh0XCJdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYU5vbkNvbXB1dGVkVmlzaWJsZUtleUZpZWxkcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRvUmVzdWx0ID0gYXdhaXQgdGhpcy5fbGF1bmNoRGlhbG9nV2l0aEtleUZpZWxkcyhcblx0XHRcdFx0XHRcdFx0b01haW5MaXN0QmluZGluZyxcblx0XHRcdFx0XHRcdFx0YU5vbkNvbXB1dGVkVmlzaWJsZUtleUZpZWxkcyxcblx0XHRcdFx0XHRcdFx0b01vZGVsLFxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXJcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRvTmV3RG9jdW1lbnRDb250ZXh0ID0gb1Jlc3VsdC5uZXdDb250ZXh0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAobVBhcmFtZXRlcnMuYmVmb3JlQ3JlYXRlQ2FsbEJhY2spIHtcblx0XHRcdFx0XHRcdFx0YXdhaXQgdG9FUzZQcm9taXNlKFxuXHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmJlZm9yZUNyZWF0ZUNhbGxCYWNrKHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHRQYXRoOiBvTWFpbkxpc3RCaW5kaW5nICYmIG9NYWluTGlzdEJpbmRpbmcuZ2V0UGF0aCgpXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0b05ld0RvY3VtZW50Q29udGV4dCA9IG9NYWluTGlzdEJpbmRpbmcuY3JlYXRlKFxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5kYXRhLFxuXHRcdFx0XHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5jcmVhdGVBdEVuZCxcblx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuaW5hY3RpdmVcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRpZiAoIW1QYXJhbWV0ZXJzLmluYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHRcdG9SZXN1bHQgPSBhd2FpdCB0aGlzLm9uQWZ0ZXJDcmVhdGVDb21wbGV0aW9uKG9NYWluTGlzdEJpbmRpbmcsIG9OZXdEb2N1bWVudENvbnRleHQsIG1QYXJhbWV0ZXJzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgY3JlYXRpbmcgdGhlIG5ldyBkb2N1bWVudFwiLCBvRXJyb3IpO1xuXHRcdFx0XHRcdHRocm93IG9FcnJvcjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIW9NYWluTGlzdEJpbmRpbmcuaXNSZWxhdGl2ZSgpKSB7XG5cdFx0XHRcdC8vIHRoZSBjcmVhdGUgbW9kZSBzaGFsbCBjdXJyZW50bHkgb25seSBiZSBzZXQgb24gY3JlYXRpbmcgYSByb290IGRvY3VtZW50XG5cdFx0XHRcdHRoaXMuX2JDcmVhdGVNb2RlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9OZXdEb2N1bWVudENvbnRleHQgPSBvTmV3RG9jdW1lbnRDb250ZXh0IHx8IG9SZXN1bHQ7XG5cdFx0XHQvLyBUT0RPOiB3aGVyZSBkb2VzIHRoaXMgb25lIGNvbWluZyBmcm9tPz8/XG5cblx0XHRcdGlmIChiQ29uc2lkZXJEb2N1bWVudE1vZGlmaWVkKSB7XG5cdFx0XHRcdHRoaXMuaGFuZGxlRG9jdW1lbnRNb2RpZmljYXRpb25zKCk7XG5cdFx0XHR9XG5cdFx0XHRhd2FpdCBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZURpYWxvZygpO1xuXHRcdFx0cmV0dXJuIG9OZXdEb2N1bWVudENvbnRleHQhO1xuXHRcdH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG5cdFx0XHQvLyBUT0RPOiBjdXJyZW50bHksIHRoZSBvbmx5IGVycm9ycyBoYW5kbGVkIGhlcmUgYXJlIHJhaXNlZCBhcyBzdHJpbmcgLSBzaG91bGQgYmUgY2hhbmdlZCB0byBFcnJvciBvYmplY3RzXG5cdFx0XHRhd2FpdCBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZURpYWxvZygpO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQoZXJyb3IgPT09IEZFTGlicmFyeS5Db25zdGFudHMuQWN0aW9uRXhlY3V0aW9uRmFpbGVkIHx8IGVycm9yID09PSBGRUxpYnJhcnkuQ29uc3RhbnRzLkNhbmNlbEFjdGlvbkRpYWxvZykgJiZcblx0XHRcdFx0b05ld0RvY3VtZW50Q29udGV4dD8uaXNUcmFuc2llbnQoKVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIHN1Z2dlc3RlZCBieSBtb2RlbCBhcyBDb250ZXh0LmRlbGV0ZSByZXN1bHRzIGluIGFuIGVycm9yXG5cdFx0XHRcdC8vIFRPRE86IHJlbW92ZSB0aGUgJGRpcmVjdCBvbmNlIG1vZGVsIHJlc29sdmVzIHRoaXMgaXNzdWVcblx0XHRcdFx0Ly8gdGhpcyBsaW5lIHNob3dzIHRoZSBleHBlY3RlZCBjb25zb2xlIGVycm9yIFVuY2F1Z2h0IChpbiBwcm9taXNlKSBFcnJvcjogUmVxdWVzdCBjYW5jZWxlZDogUE9TVCBUcmF2ZWw7IGdyb3VwOiBzdWJtaXRMYXRlclxuXHRcdFx0XHRvTmV3RG9jdW1lbnRDb250ZXh0LmRlbGV0ZShcIiRkaXJlY3RcIik7XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0QnVzeUxvY2tlci51bmxvY2sodGhpcy5vTG9ja09iamVjdCwgc0J1c3lQYXRoKTtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIEZpbmQgdGhlIGFjdGl2ZSBjb250ZXh0cyBvZiB0aGUgZG9jdW1lbnRzLCBvbmx5IGZvciB0aGUgZHJhZnQgcm9vdHMuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlclxuXHQgKiBAc3RhdGljXG5cdCAqIEBwYXJhbSBhQ29udGV4dHMgQ29udGV4dHMgRWl0aGVyIG9uZSBjb250ZXh0IG9yIGFuIGFycmF5IHdpdGggY29udGV4dHMgdG8gYmUgZGVsZXRlZFxuXHQgKiBAcGFyYW0gYkZpbmRBY3RpdmVDb250ZXh0c1xuXHQgKiBAcmV0dXJucyBBcnJheSBvZiB0aGUgYWN0aXZlIGNvbnRleHRzXG5cdCAqL1xuXHRmaW5kQWN0aXZlRHJhZnRSb290Q29udGV4dHMoYUNvbnRleHRzOiBWNENvbnRleHRbXSwgYkZpbmRBY3RpdmVDb250ZXh0czogYW55KSB7XG5cdFx0aWYgKCFiRmluZEFjdGl2ZUNvbnRleHRzKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXHRcdGNvbnN0IGFjdGl2ZUNvbnRleHRzID0gYUNvbnRleHRzLnJlZHVjZShmdW5jdGlvbiAoYVJlc3VsdDogYW55LCBvQ29udGV4dDogYW55KSB7XG5cdFx0XHRjb25zdCBvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0XHRcdGNvbnN0IHNNZXRhUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob0NvbnRleHQuZ2V0UGF0aCgpKTtcblx0XHRcdGlmIChvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YVBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdFJvb3RgKSkge1xuXHRcdFx0XHRjb25zdCBiSXNBY3RpdmVFbnRpdHkgPSBvQ29udGV4dC5nZXRPYmplY3QoKS5Jc0FjdGl2ZUVudGl0eSxcblx0XHRcdFx0XHRiSGFzQWN0aXZlRW50aXR5ID0gb0NvbnRleHQuZ2V0T2JqZWN0KCkuSGFzQWN0aXZlRW50aXR5O1xuXHRcdFx0XHRpZiAoIWJJc0FjdGl2ZUVudGl0eSAmJiBiSGFzQWN0aXZlRW50aXR5KSB7XG5cdFx0XHRcdFx0Y29uc3Qgb0FjdGl2ZUNvbnRleHQgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmJpbmRDb250ZXh0KGAke29Db250ZXh0LmdldFBhdGgoKX0vU2libGluZ0VudGl0eWApLmdldEJvdW5kQ29udGV4dCgpO1xuXHRcdFx0XHRcdGFSZXN1bHQucHVzaChvQWN0aXZlQ29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBhUmVzdWx0O1xuXHRcdH0sIFtdKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoXG5cdFx0XHRhY3RpdmVDb250ZXh0cy5tYXAoZnVuY3Rpb24gKG9Db250ZXh0OiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG9Db250ZXh0LnJlcXVlc3RDYW5vbmljYWxQYXRoKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9Db250ZXh0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXHRhZnRlckRlbGV0ZVByb2Nlc3MobVBhcmFtZXRlcnM6IGFueSwgY2hlY2tCb3g6IGFueSwgYUNvbnRleHRzOiBhbnksIG9SZXNvdXJjZUJ1bmRsZTogYW55KSB7XG5cdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gbVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0aWYgKG9JbnRlcm5hbE1vZGVsQ29udGV4dCAmJiBvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJkZWxldGVFbmFibGVkXCIpICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0aWYgKGNoZWNrQm94LmlzQ2hlY2tCb3hWaXNpYmxlID09PSB0cnVlICYmIGNoZWNrQm94LmlzQ2hlY2tCb3hTZWxlY3RlZCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0Ly9pZiB1bnNhdmVkIG9iamVjdHMgYXJlIG5vdCBkZWxldGVkIHRoZW4gd2UgbmVlZCB0byBzZXQgdGhlIGVuYWJsZWQgdG8gdHJ1ZSBhbmQgdXBkYXRlIHRoZSBtb2RlbCBkYXRhIGZvciBuZXh0IGRlbGV0aW9uXG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImRlbGV0ZUVuYWJsZWRcIiwgdHJ1ZSk7XG5cdFx0XHRcdGNvbnN0IG9iaiA9IE9iamVjdC5hc3NpZ24ob0ludGVybmFsTW9kZWxDb250ZXh0LmdldE9iamVjdCgpLCB7fSk7XG5cdFx0XHRcdG9iai5zZWxlY3RlZENvbnRleHRzID0gb2JqLnNlbGVjdGVkQ29udGV4dHMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50OiBhbnkpIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqLmRlbGV0YWJsZUNvbnRleHRzLmluZGV4T2YoZWxlbWVudCkgPT09IC0xO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0b2JqLmRlbGV0YWJsZUNvbnRleHRzID0gW107XG5cdFx0XHRcdG9iai5zZWxlY3RlZENvbnRleHRzID0gW107XG5cdFx0XHRcdG9iai5udW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgPSBvYmouc2VsZWN0ZWRDb250ZXh0cy5sZW5ndGg7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcIlwiLCBvYmopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiZGVsZXRlRW5hYmxlZFwiLCBmYWxzZSk7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInNlbGVjdGVkQ29udGV4dHNcIiwgW10pO1xuXHRcdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJudW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcIiwgMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChhQ29udGV4dHMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRNZXNzYWdlVG9hc3Quc2hvdyhcblx0XHRcdFx0Q29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9ERUxFVEVfVE9BU1RfU0lOR1VMQVJcIixcblx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE1lc3NhZ2VUb2FzdC5zaG93KFxuXHRcdFx0XHRDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0RFTEVURV9UT0FTVF9QTFVSQUxcIiwgb1Jlc291cmNlQnVuZGxlLCBudWxsLCBtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lKVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIERlbGV0ZSBvbmUgb3IgbXVsdGlwbGUgZG9jdW1lbnQocykuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlclxuXHQgKiBAc3RhdGljXG5cdCAqIEBwYXJhbSB2SW5Db250ZXh0cyBDb250ZXh0cyBFaXRoZXIgb25lIGNvbnRleHQgb3IgYW4gYXJyYXkgd2l0aCBjb250ZXh0cyB0byBiZSBkZWxldGVkXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBPcHRpb25hbCwgY2FuIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gbVBhcmFtZXRlcnMudGl0bGUgVGl0bGUgb2YgdGhlIG9iamVjdCB0byBiZSBkZWxldGVkXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycy5kZXNjcmlwdGlvbiBEZXNjcmlwdGlvbiBvZiB0aGUgb2JqZWN0IHRvIGJlIGRlbGV0ZWRcblx0ICogQHBhcmFtIG1QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0cyBOdW1iZXIgb2Ygb2JqZWN0cyBzZWxlY3RlZFxuXHQgKiBAcGFyYW0gbVBhcmFtZXRlcnMubm9EaWFsb2cgVG8gZGlzYWJsZSB0aGUgY29uZmlybWF0aW9uIGRpYWxvZ1xuXHQgKiBAcGFyYW0gb1Jlc291cmNlQnVuZGxlXG5cdCAqIEBwYXJhbSBtZXNzYWdlSGFuZGxlclxuXHQgKiBAcmV0dXJucyBBIFByb21pc2UgcmVzb2x2ZWQgb25jZSB0aGUgZG9jdW1lbnQgYXJlIGRlbGV0ZWRcblx0ICovXG5cdGRlbGV0ZURvY3VtZW50KHZJbkNvbnRleHRzOiBWNENvbnRleHQsIG1QYXJhbWV0ZXJzOiBhbnksIG9SZXNvdXJjZUJ1bmRsZTogYW55LCBtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXIpIHtcblx0XHRsZXQgYURlbGV0YWJsZUNvbnRleHRzOiBhbnlbXSA9IFtdLFxuXHRcdFx0aXNDaGVja0JveFZpc2libGUgPSBmYWxzZSxcblx0XHRcdGlzTG9ja2VkVGV4dFZpc2libGUgPSBmYWxzZSxcblx0XHRcdGNhbm5vdEJlRGVsZXRlZFRleHRWaXNpYmxlID0gZmFsc2UsXG5cdFx0XHRpc0NoZWNrQm94U2VsZWN0ZWQ6IGJvb2xlYW4sXG5cdFx0XHRiRGlhbG9nQ29uZmlybWVkID0gZmFsc2U7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXMsXG5cdFx0XHRvUmVzb3VyY2VCdW5kbGVDb3JlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblx0XHRsZXQgYVBhcmFtcztcblx0XHRsZXQgb0RlbGV0ZU1lc3NhZ2U6IGFueSA9IHtcblx0XHRcdHRpdGxlOiBvUmVzb3VyY2VCdW5kbGVDb3JlLmdldFRleHQoXCJDX0NPTU1PTl9ERUxFVEVcIilcblx0XHR9O1xuXHRcdEJ1c3lMb2NrZXIubG9jayh0aGlzLm9Mb2NrT2JqZWN0KTtcblx0XHRsZXQgdkNvbnRleHRzOiBWNENvbnRleHRbXTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2SW5Db250ZXh0cykpIHtcblx0XHRcdHZDb250ZXh0cyA9IHZJbkNvbnRleHRzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2Q29udGV4dHMgPSBbdkluQ29udGV4dHNdO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBzUHJvZ3JhbW1pbmdNb2RlbCA9IHRoaXMuZ2V0UHJvZ3JhbW1pbmdNb2RlbCh2Q29udGV4dHNbMF0pO1xuXHRcdFx0XHRpZiAobVBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRpZiAoIW1QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0cykge1xuXHRcdFx0XHRcdFx0aWYgKHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0KSB7XG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdkNvbnRleHRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb0NvbnRleHREYXRhID0gdkNvbnRleHRzW2ldLmdldE9iamVjdCgpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdG9Db250ZXh0RGF0YS5Jc0FjdGl2ZUVudGl0eSA9PT0gdHJ1ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0b0NvbnRleHREYXRhLkhhc0RyYWZ0RW50aXR5ID09PSB0cnVlICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRvQ29udGV4dERhdGEuRHJhZnRBZG1pbmlzdHJhdGl2ZURhdGEgJiZcblx0XHRcdFx0XHRcdFx0XHRcdG9Db250ZXh0RGF0YS5EcmFmdEFkbWluaXN0cmF0aXZlRGF0YS5JblByb2Nlc3NCeVVzZXIgJiZcblx0XHRcdFx0XHRcdFx0XHRcdCFvQ29udGV4dERhdGEuRHJhZnRBZG1pbmlzdHJhdGl2ZURhdGEuRHJhZnRJc0NyZWF0ZWRCeU1lXG5cdFx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc0xvY2tlZFVzZXIgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZHJhZnRBZG1pbkRhdGEgPSBvQ29udGV4dERhdGEgJiYgb0NvbnRleHREYXRhLkRyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRyYWZ0QWRtaW5EYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNMb2NrZWRVc2VyID0gZHJhZnRBZG1pbkRhdGFbXCJJblByb2Nlc3NCeVVzZXJcIl07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRhUGFyYW1zID0gW3NMb2NrZWRVc2VyXTtcblx0XHRcdFx0XHRcdFx0XHRcdE1lc3NhZ2VCb3guc2hvdyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0Q29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX1NJTkdMRV9PQkpFQ1RfTE9DS0VEXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFQYXJhbXNcblx0XHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBvUmVzb3VyY2VCdW5kbGVDb3JlLmdldFRleHQoXCJDX0NPTU1PTl9ERUxFVEVcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25DbG9zZTogcmVqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtUGFyYW1ldGVycyA9IGdldFBhcmFtZXRlcnMobVBhcmFtZXRlcnMpO1xuXHRcdFx0XHRcdFx0aWYgKG1QYXJhbWV0ZXJzLnRpdGxlKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChtUGFyYW1ldGVycy5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGFQYXJhbXMgPSBbbVBhcmFtZXRlcnMudGl0bGUgKyBcIiBcIiwgbVBhcmFtZXRlcnMuZGVzY3JpcHRpb25dO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGFQYXJhbXMgPSBbbVBhcmFtZXRlcnMudGl0bGUsIFwiXCJdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLnRleHQgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0NPTkZJUk1fREVMRVRFX1dJVEhfT0JKRUNUSU5GT1wiLFxuXHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdFx0XHRcdFx0XHRhUGFyYW1zLFxuXHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmVudGl0eVNldE5hbWVcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLnRleHQgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0NPTkZJUk1fREVMRVRFX1dJVEhfT0JKRUNUVElUTEVfU0lOR1VMQVJcIixcblx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRhRGVsZXRhYmxlQ29udGV4dHMgPSB2Q29udGV4dHM7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlID0ge1xuXHRcdFx0XHRcdFx0XHR0aXRsZTogb1Jlc291cmNlQnVuZGxlQ29yZS5nZXRUZXh0KFwiQ19DT01NT05fREVMRVRFXCIpXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0aWYgKG1QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0cyA9PT0gMSAmJiBtUGFyYW1ldGVycy5udW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgPT09IHZDb250ZXh0cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0YURlbGV0YWJsZUNvbnRleHRzID0gdkNvbnRleHRzO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvTGluZUNvbnRleHREYXRhID0gdkNvbnRleHRzWzBdLmdldE9iamVjdCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvVGFibGUgPSBtUGFyYW1ldGVycy5wYXJlbnRDb250cm9sO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzS2V5ID0gb1RhYmxlICYmIG9UYWJsZS5nZXRQYXJlbnQoKS5nZXRJZGVudGlmaWVyQ29sdW1uKCk7XG5cdFx0XHRcdFx0XHRcdGlmIChzS2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc0tleVZhbHVlID0gc0tleSA/IG9MaW5lQ29udGV4dERhdGFbc0tleV0gOiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc0Rlc2NyaXB0aW9uID1cblx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmRlc2NyaXB0aW9uICYmIG1QYXJhbWV0ZXJzLmRlc2NyaXB0aW9uLnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBvTGluZUNvbnRleHREYXRhW21QYXJhbWV0ZXJzLmRlc2NyaXB0aW9uLnBhdGhdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzS2V5VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChzRGVzY3JpcHRpb24gJiYgbVBhcmFtZXRlcnMuZGVzY3JpcHRpb24gJiYgc0tleSAhPT0gbVBhcmFtZXRlcnMuZGVzY3JpcHRpb24ucGF0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhUGFyYW1zID0gW3NLZXlWYWx1ZSArIFwiIFwiLCBzRGVzY3JpcHRpb25dO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YVBhcmFtcyA9IFtzS2V5VmFsdWUsIFwiXCJdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2UudGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0NPTkZJUk1fREVMRVRFX1dJVEhfT0JKRUNUSU5GT1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFQYXJhbXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmVudGl0eVNldE5hbWVcblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzS2V5VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFQYXJhbXMgPSBbc0tleVZhbHVlLCBcIlwiXTtcblx0XHRcdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLnRleHQgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVElORk9cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhUGFyYW1zLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvRGVsZXRlTWVzc2FnZS50ZXh0ID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RUSVRMRV9TSU5HVUxBUlwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmVudGl0eVNldE5hbWVcblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLnRleHQgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RUSVRMRV9TSU5HVUxBUlwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmVudGl0eVNldE5hbWVcblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG1QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0cyA9PT0gMSAmJiBtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdC8vb25seSBvbmUgdW5zYXZlZCBvYmplY3Rcblx0XHRcdFx0XHRcdFx0YURlbGV0YWJsZUNvbnRleHRzID0gbVBhcmFtZXRlcnMudW5TYXZlZENvbnRleHRzO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBkcmFmdEFkbWluRGF0YSA9IGFEZWxldGFibGVDb250ZXh0c1swXS5nZXRPYmplY3QoKVtcIkRyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhXCJdO1xuXHRcdFx0XHRcdFx0XHRsZXQgc0xhc3RDaGFuZ2VkQnlVc2VyID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0aWYgKGRyYWZ0QWRtaW5EYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0c0xhc3RDaGFuZ2VkQnlVc2VyID1cblx0XHRcdFx0XHRcdFx0XHRcdGRyYWZ0QWRtaW5EYXRhW1wiTGFzdENoYW5nZWRCeVVzZXJEZXNjcmlwdGlvblwiXSB8fCBkcmFmdEFkbWluRGF0YVtcIkxhc3RDaGFuZ2VkQnlVc2VyXCJdIHx8IFwiXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YVBhcmFtcyA9IFtzTGFzdENoYW5nZWRCeVVzZXJdO1xuXHRcdFx0XHRcdFx0XHRvRGVsZXRlTWVzc2FnZS50ZXh0ID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX1VOU0FWRURfQ0hBTkdFU1wiLFxuXHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdFx0XHRcdFx0XHRhUGFyYW1zXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG1QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0cyA9PT0gbVBhcmFtZXRlcnMudW5TYXZlZENvbnRleHRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHQvL29ubHkgbXVsdGlwbGUgdW5zYXZlZCBvYmplY3RzXG5cdFx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cyA9IG1QYXJhbWV0ZXJzLnVuU2F2ZWRDb250ZXh0cztcblx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2UudGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9VTlNBVkVEX0NIQU5HRVNfTVVMVElQTEVfT0JKRUNUU1wiLFxuXHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMubnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzID09PVxuXHRcdFx0XHRcdFx0XHR2Q29udGV4dHMuY29uY2F0KG1QYXJhbWV0ZXJzLnVuU2F2ZWRDb250ZXh0cy5jb25jYXQobVBhcmFtZXRlcnMubG9ja2VkQ29udGV4dHMpKS5sZW5ndGhcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHQvL29ubHkgdW5zYXZlZCwgbG9ja2VkICxkZWxldGFibGUgb2JqZWN0cyBidXQgbm90IG5vbi1kZWxldGFibGUgb2JqZWN0c1xuXHRcdFx0XHRcdFx0XHRhRGVsZXRhYmxlQ29udGV4dHMgPSB2Q29udGV4dHMuY29uY2F0KG1QYXJhbWV0ZXJzLnVuU2F2ZWRDb250ZXh0cyk7XG5cdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLnRleHQgPVxuXHRcdFx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cy5sZW5ndGggPT09IDFcblx0XHRcdFx0XHRcdFx0XHRcdD8gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVFRJVExFX1NJTkdVTEFSXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMuZW50aXR5U2V0TmFtZVxuXHRcdFx0XHRcdFx0XHRcdFx0ICApXG5cdFx0XHRcdFx0XHRcdFx0XHQ6IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RUSVRMRV9QTFVSQUxcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHQgICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvL2lmIG5vbi1kZWxldGFibGUgb2JqZWN0cyBleGlzdHMgYWxvbmcgd2l0aCBhbnkgb2YgdW5zYXZlZCAsZGVsZXRhYmxlIG9iamVjdHNcblx0XHRcdFx0XHRcdFx0YURlbGV0YWJsZUNvbnRleHRzID0gdkNvbnRleHRzLmNvbmNhdChtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMpO1xuXHRcdFx0XHRcdFx0XHRjYW5ub3RCZURlbGV0ZWRUZXh0VmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLnRleHQgPVxuXHRcdFx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cy5sZW5ndGggPT09IDFcblx0XHRcdFx0XHRcdFx0XHRcdD8gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVFRJVExFX1NJTkdVTEFSX05PTl9ERUxFVEFCTEVcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHQgIClcblx0XHRcdFx0XHRcdFx0XHRcdDogQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVFRJVExFX1BMVVJBTF9OT05fREVMRVRBQkxFXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFthRGVsZXRhYmxlQ29udGV4dHMubGVuZ3RoXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHQgICk7XG5cdFx0XHRcdFx0XHRcdG9EZWxldGVNZXNzYWdlLm5vbkRlbGV0YWJsZVRleHQgPSB0aGF0Ll9nZXROb25EZWxldGFibGVUZXh0KG1QYXJhbWV0ZXJzLCB2Q29udGV4dHMsIG9SZXNvdXJjZUJ1bmRsZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAobVBhcmFtZXRlcnMubG9ja2VkQ29udGV4dHMubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHRcdFx0Ly9zZXR0aW5nIHRoZSBsb2NrZWQgdGV4dCBpZiBsb2NrZWQgb2JqZWN0cyBleGlzdFxuXHRcdFx0XHRcdFx0XHRpc0xvY2tlZFRleHRWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2Uubm9uRGVsZXRhYmxlVGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RJTkZPX0FORF9PTkVfT0JKRUNUX0xPQ0tFRFwiLFxuXHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdFx0XHRcdFx0XHRbbVBhcmFtZXRlcnMubnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzXVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKG1QYXJhbWV0ZXJzLmxvY2tlZENvbnRleHRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0Ly9zZXR0aW5nIHRoZSBsb2NrZWQgdGV4dCBpZiBsb2NrZWQgb2JqZWN0cyBleGlzdFxuXHRcdFx0XHRcdFx0XHRpc0xvY2tlZFRleHRWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2Uubm9uRGVsZXRhYmxlVGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RJTkZPX0FORF9GRVdfT0JKRUNUU19MT0NLRURcIixcblx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0W21QYXJhbWV0ZXJzLmxvY2tlZENvbnRleHRzLmxlbmd0aCwgbVBhcmFtZXRlcnMubnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzXVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMubGVuZ3RoICE9PSBtUGFyYW1ldGVycy5udW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdFx0KGNhbm5vdEJlRGVsZXRlZFRleHRWaXNpYmxlIHx8IGlzTG9ja2VkVGV4dFZpc2libGUpICYmXG5cdFx0XHRcdFx0XHRcdFx0YURlbGV0YWJsZUNvbnRleHRzLmxlbmd0aCA9PT0gbVBhcmFtZXRlcnMudW5TYXZlZENvbnRleHRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHQvL2lmIG9ubHkgdW5zYXZlZCBhbmQgZWl0aGVyIG9yIGJvdGggb2YgbG9ja2VkIGFuZCBub24tZGVsZXRhYmxlIG9iamVjdHMgZXhpc3QgdGhlbiB3ZSBoaWRlIHRoZSBjaGVjayBib3hcblx0XHRcdFx0XHRcdFx0XHRpc0NoZWNrQm94VmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cyA9IG1QYXJhbWV0ZXJzLnVuU2F2ZWRDb250ZXh0cztcblx0XHRcdFx0XHRcdFx0XHRpZiAobVBhcmFtZXRlcnMudW5TYXZlZENvbnRleHRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2UudGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0NPTkZJUk1fREVMRVRFX1dJVEhfVU5TQVZFRF9BTkRfRkVXX09CSkVDVFNfTE9DS0VEX1NJTkdVTEFSXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2UudGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0NPTkZJUk1fREVMRVRFX1dJVEhfVU5TQVZFRF9BTkRfRkVXX09CSkVDVFNfTE9DS0VEX1BMVVJBTFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGVcblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvRGVsZXRlTWVzc2FnZS5jaGVja0JveFRleHQgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVElORk9fQU5EX0ZFV19PQkpFQ1RTX1VOU0FWRURfU0lOR1VMQVJcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvRGVsZXRlTWVzc2FnZS5jaGVja0JveFRleHQgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVElORk9fQU5EX0ZFV19PQkpFQ1RTX1VOU0FWRURfUExVUkFMXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aXNDaGVja0JveFZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoY2Fubm90QmVEZWxldGVkVGV4dFZpc2libGUgJiYgaXNMb2NrZWRUZXh0VmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHQvL2lmIG5vbi1kZWxldGFibGUgb2JqZWN0cyBleGlzdCBhbG9uZyB3aXRoIGRlbGV0YWJsZSBvYmplY3RzXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNOb25EZWxldGFibGVDb250ZXh0VGV4dCA9IHRoYXQuX2dldE5vbkRlbGV0YWJsZVRleHQobVBhcmFtZXRlcnMsIHZDb250ZXh0cywgb1Jlc291cmNlQnVuZGxlKTtcblx0XHRcdFx0XHRcdFx0Ly9pZiBib3RoIGxvY2tlZCBhbmQgbm9uLWRlbGV0YWJsZSBvYmplY3RzIGV4aXN0IGFsb25nIHdpdGggZGVsZXRhYmxlIG9iamVjdHNcblx0XHRcdFx0XHRcdFx0aWYgKG1QYXJhbWV0ZXJzLnVuU2F2ZWRDb250ZXh0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0b0RlbGV0ZU1lc3NhZ2Uubm9uRGVsZXRhYmxlVGV4dCA9XG5cdFx0XHRcdFx0XHRcdFx0XHRzTm9uRGVsZXRhYmxlQ29udGV4dFRleHQgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XCIgXCIgK1xuXHRcdFx0XHRcdFx0XHRcdFx0Q29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RJTkZPX0FORF9GRVdfT0JKRUNUU19MT0NLRURcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRbbVBhcmFtZXRlcnMubG9ja2VkQ29udGV4dHMubGVuZ3RoLCBtUGFyYW1ldGVycy5udW1iZXJPZlNlbGVjdGVkQ29udGV4dHNdXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRvRGVsZXRlTWVzc2FnZS5ub25EZWxldGFibGVUZXh0ID1cblx0XHRcdFx0XHRcdFx0XHRcdHNOb25EZWxldGFibGVDb250ZXh0VGV4dCArXG5cdFx0XHRcdFx0XHRcdFx0XHRcIiBcIiArXG5cdFx0XHRcdFx0XHRcdFx0XHRDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9DT05GSVJNX0RFTEVURV9XSVRIX09CSkVDVElORk9fQU5EX09ORV9PQkpFQ1RfTE9DS0VEXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0W21QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0c11cblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IG9Ob25EZWxldGFibGVNZXNzYWdlVGV4dENvbnRyb2wsIG9EZWxldGVNZXNzYWdlVGV4dENvbnRyb2w7XG5cdFx0XHRcdGNvbnN0IG9Db250ZW50ID0gbmV3IFZCb3goe1xuXHRcdFx0XHRcdGl0ZW1zOiBbXG5cdFx0XHRcdFx0XHQob05vbkRlbGV0YWJsZU1lc3NhZ2VUZXh0Q29udHJvbCA9IG5ldyBUZXh0KHtcblx0XHRcdFx0XHRcdFx0dGV4dDogb0RlbGV0ZU1lc3NhZ2Uubm9uRGVsZXRhYmxlVGV4dCxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogaXNMb2NrZWRUZXh0VmlzaWJsZSB8fCBjYW5ub3RCZURlbGV0ZWRUZXh0VmlzaWJsZVxuXHRcdFx0XHRcdFx0fSkpLFxuXHRcdFx0XHRcdFx0KG9EZWxldGVNZXNzYWdlVGV4dENvbnRyb2wgPSBuZXcgVGV4dCh7XG5cdFx0XHRcdFx0XHRcdHRleHQ6IG9EZWxldGVNZXNzYWdlLnRleHRcblx0XHRcdFx0XHRcdH0pKSxcblx0XHRcdFx0XHRcdG5ldyBDaGVja0JveCh7XG5cdFx0XHRcdFx0XHRcdHRleHQ6IG9EZWxldGVNZXNzYWdlLmNoZWNrQm94VGV4dCxcblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHNlbGVjdDogZnVuY3Rpb24gKG9FdmVudDogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VsZWN0ZWQgPSBvRXZlbnQuZ2V0U291cmNlKCkuZ2V0U2VsZWN0ZWQoKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cyA9IHZDb250ZXh0cy5jb25jYXQobVBhcmFtZXRlcnMudW5TYXZlZENvbnRleHRzKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlzQ2hlY2tCb3hTZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cyA9IHZDb250ZXh0cztcblx0XHRcdFx0XHRcdFx0XHRcdGlzQ2hlY2tCb3hTZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogaXNDaGVja0JveFZpc2libGVcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc3Qgc1RpdGxlID0gb1Jlc291cmNlQnVuZGxlQ29yZS5nZXRUZXh0KFwiQ19DT01NT05fREVMRVRFXCIpO1xuXHRcdFx0XHRjb25zdCBmbkNvbmZpcm0gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YkRpYWxvZ0NvbmZpcm1lZCA9IHRydWU7XG5cdFx0XHRcdFx0QnVzeUxvY2tlci5sb2NrKHRoYXQub0xvY2tPYmplY3QpO1xuXHRcdFx0XHRcdGNvbnN0IGFDb250ZXh0cyA9IGFEZWxldGFibGVDb250ZXh0cztcblxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAobVBhcmFtZXRlcnMuYmVmb3JlRGVsZXRlQ2FsbEJhY2spIHtcblx0XHRcdFx0XHRcdFx0YXdhaXQgbVBhcmFtZXRlcnMuYmVmb3JlRGVsZXRlQ2FsbEJhY2soeyBjb250ZXh0czogYUNvbnRleHRzIH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3QgYWN0aXZlQ29udGV4dHMgPSBhd2FpdCB0aGF0LmZpbmRBY3RpdmVEcmFmdFJvb3RDb250ZXh0cyhhQ29udGV4dHMsIG1QYXJhbWV0ZXJzLmJGaW5kQWN0aXZlQ29udGV4dHMpO1xuXG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRcdFx0XHRhQ29udGV4dHMubWFwKGZ1bmN0aW9uIChvQ29udGV4dDogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL2RlbGV0ZSB0aGUgZHJhZnRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGJFbmFibGVTdHJpY3RIYW5kbGluZyA9IGFDb250ZXh0cy5sZW5ndGggPT09IDEgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZHJhZnQuZGVsZXRlRHJhZnQob0NvbnRleHQsIHRoYXQuX29BcHBDb21wb25lbnQsIGJFbmFibGVTdHJpY3RIYW5kbGluZyk7XG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlcygpO1xuXHRcdFx0XHRcdFx0XHQvLyByZS10aHJvdyBlcnJvciB0byBlbmZvcmNlIHJlamVjdGluZyB0aGUgZ2VuZXJhbCBwcm9taXNlXG5cdFx0XHRcdFx0XHRcdHRocm93IG9FcnJvcjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbnN0IGNoZWNrQm94ID0ge1xuXHRcdFx0XHRcdFx0XHRcImlzQ2hlY2tCb3hWaXNpYmxlXCI6IGlzQ2hlY2tCb3hWaXNpYmxlLFxuXHRcdFx0XHRcdFx0XHRcImlzQ2hlY2tCb3hTZWxlY3RlZFwiOiBpc0NoZWNrQm94U2VsZWN0ZWRcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRpZiAoYWN0aXZlQ29udGV4dHMgJiYgYWN0aXZlQ29udGV4dHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFxuXHRcdFx0XHRcdFx0XHRcdGFjdGl2ZUNvbnRleHRzLm1hcChmdW5jdGlvbiAob0NvbnRleHQ6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9Db250ZXh0LmRlbGV0ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0dGhhdC5hZnRlckRlbGV0ZVByb2Nlc3MobVBhcmFtZXRlcnMsIGNoZWNrQm94LCBhQ29udGV4dHMsIG9SZXNvdXJjZUJ1bmRsZSk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlRGlhbG9nKCk7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQuYWZ0ZXJEZWxldGVQcm9jZXNzKG1QYXJhbWV0ZXJzLCBjaGVja0JveCwgYUNvbnRleHRzLCBvUmVzb3VyY2VCdW5kbGUpO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZURpYWxvZygpO1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJlamVjdCgpO1xuXHRcdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayh0aGF0Lm9Mb2NrT2JqZWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbnN0IG9EaWFsb2cgPSBuZXcgRGlhbG9nKHtcblx0XHRcdFx0XHR0aXRsZTogc1RpdGxlLFxuXHRcdFx0XHRcdHN0YXRlOiBcIldhcm5pbmdcIixcblx0XHRcdFx0XHRjb250ZW50OiBbb0NvbnRlbnRdLFxuXHRcdFx0XHRcdGFyaWFMYWJlbGxlZEJ5OiBvTm9uRGVsZXRhYmxlTWVzc2FnZVRleHRDb250cm9sLmdldFZpc2libGUoKVxuXHRcdFx0XHRcdFx0PyBbb05vbkRlbGV0YWJsZU1lc3NhZ2VUZXh0Q29udHJvbCwgb0RlbGV0ZU1lc3NhZ2VUZXh0Q29udHJvbF1cblx0XHRcdFx0XHRcdDogb0RlbGV0ZU1lc3NhZ2VUZXh0Q29udHJvbCxcblx0XHRcdFx0XHRiZWdpbkJ1dHRvbjogbmV3IEJ1dHRvbih7XG5cdFx0XHRcdFx0XHR0ZXh0OiBvUmVzb3VyY2VCdW5kbGVDb3JlLmdldFRleHQoXCJDX0NPTU1PTl9ERUxFVEVcIiksXG5cdFx0XHRcdFx0XHR0eXBlOiBcIkVtcGhhc2l6ZWRcIixcblx0XHRcdFx0XHRcdHByZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGluZy5yZW1vdmVCb3VuZFRyYW5zaXRpb25NZXNzYWdlcygpO1xuXHRcdFx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdGZuQ29uZmlybSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGVuZEJ1dHRvbjogbmV3IEJ1dHRvbih7XG5cdFx0XHRcdFx0XHR0ZXh0OiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfQ09NTU9OX0RJQUxPR19DQU5DRUxcIiwgb1Jlc291cmNlQnVuZGxlKSxcblx0XHRcdFx0XHRcdHByZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdG9EaWFsb2cuY2xvc2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRhZnRlckNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRvRGlhbG9nLmRlc3Ryb3koKTtcblx0XHRcdFx0XHRcdC8vIGlmIGRpYWxvZyBpcyBjbG9zZWQgdW5jb25maXJtZWQgKGUuZy4gdmlhIFwiQ2FuY2VsXCIgb3IgRXNjYXBlIGJ1dHRvbiksIGVuc3VyZSB0byByZWplY3QgcHJvbWlzZVxuXHRcdFx0XHRcdFx0aWYgKCFiRGlhbG9nQ29uZmlybWVkKSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBhcyBhbnkpO1xuXHRcdFx0XHRpZiAobVBhcmFtZXRlcnMubm9EaWFsb2cpIHtcblx0XHRcdFx0XHRmbkNvbmZpcm0oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvRGlhbG9nLmFkZFN0eWxlQ2xhc3MoXCJzYXBVaUNvbnRlbnRQYWRkaW5nXCIpO1xuXHRcdFx0XHRcdG9EaWFsb2cub3BlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayh0aGF0Lm9Mb2NrT2JqZWN0KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHQvKipcblx0ICogRWRpdHMgYSBkb2N1bWVudC5cblx0ICpcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBzdGF0aWNcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgb2YgdGhlIGFjdGl2ZSBkb2N1bWVudFxuXHQgKiBAcGFyYW0gb1ZpZXcgQ3VycmVudCB2aWV3XG5cdCAqIEBwYXJhbSBtZXNzYWdlSGFuZGxlclxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIHdpdGggdGhlIG5ldyBkcmFmdCBjb250ZXh0IGluIGNhc2Ugb2YgZHJhZnQgcHJvZ3JhbW1pbmcgbW9kZWxcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0YXN5bmMgZWRpdERvY3VtZW50KG9Db250ZXh0OiBWNENvbnRleHQsIG9WaWV3OiBWaWV3LCBtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXIpOiBQcm9taXNlPFY0Q29udGV4dCB8IHVuZGVmaW5lZD4ge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuXHRcdGNvbnN0IHRoYXQgPSB0aGlzO1xuXHRcdGNvbnN0IHNQcm9ncmFtbWluZ01vZGVsID0gdGhpcy5nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KTtcblx0XHRpZiAoIW9Db250ZXh0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCaW5kaW5nIGNvbnRleHQgdG8gYWN0aXZlIGRvY3VtZW50IGlzIHJlcXVpcmVkXCIpO1xuXHRcdH1cblx0XHRpZiAoc1Byb2dyYW1taW5nTW9kZWwgIT09IFByb2dyYW1taW5nTW9kZWwuRHJhZnQgJiYgc1Byb2dyYW1taW5nTW9kZWwgIT09IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFZGl0IGlzIG9ubHkgYWxsb3dlZCBmb3IgZHJhZnQgb3Igc3RpY2t5IHNlc3Npb24gc3VwcG9ydGVkIHNlcnZpY2VzXCIpO1xuXHRcdH1cblx0XHR0aGlzLl9iSXNNb2RpZmllZCA9IGZhbHNlO1xuXHRcdEJ1c3lMb2NrZXIubG9jayh0aGF0Lm9Mb2NrT2JqZWN0KTtcblx0XHQvLyBiZWZvcmUgdHJpZ2dlcmluZyB0aGUgZWRpdCBhY3Rpb24gd2UnbGwgaGF2ZSB0byByZW1vdmUgYWxsIGJvdW5kIHRyYW5zaXRpb24gbWVzc2FnZXNcblx0XHRtZXNzYWdlSGFuZGxlci5yZW1vdmVUcmFuc2l0aW9uTWVzc2FnZXMoKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBvTmV3Q29udGV4dCA9XG5cdFx0XHRcdHNQcm9ncmFtbWluZ01vZGVsID09PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0XG5cdFx0XHRcdFx0PyBhd2FpdCBkcmFmdC5jcmVhdGVEcmFmdEZyb21BY3RpdmVEb2N1bWVudChvQ29udGV4dCwgdGhpcy5fZ2V0QXBwQ29tcG9uZW50KCksIHtcblx0XHRcdFx0XHRcdFx0YlByZXNlcnZlQ2hhbmdlczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0b1ZpZXc6IG9WaWV3XG5cdFx0XHRcdFx0ICB9IGFzIGFueSlcblx0XHRcdFx0XHQ6IGF3YWl0IHN0aWNreS5lZGl0RG9jdW1lbnRJblN0aWNreVNlc3Npb24ob0NvbnRleHQsIHRoaXMuX2dldEFwcENvbXBvbmVudCgpKTtcblxuXHRcdFx0dGhpcy5fYkNyZWF0ZU1vZGUgPSBmYWxzZTtcblx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlRGlhbG9nKCk7XG5cdFx0XHRyZXR1cm4gb05ld0NvbnRleHQ7XG5cdFx0fSBjYXRjaCAoZXJyOiBhbnkpIHtcblx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlcyh7IGNvbmN1cnJlbnRFZGl0RmxhZzogdHJ1ZSB9KTtcblx0XHRcdHRocm93IGVycjtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0QnVzeUxvY2tlci51bmxvY2sodGhhdC5vTG9ja09iamVjdCk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiBDYW5jZWwgJ2VkaXQnIG1vZGUgb2YgYSBkb2N1bWVudC5cblx0ICpcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBzdGF0aWNcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgb2YgdGhlIGRvY3VtZW50IHRvIGJlIGNhbmNlbGVkIG9yIGRlbGV0ZWRcblx0ICogQHBhcmFtIFttSW5QYXJhbWV0ZXJzXSBPcHRpb25hbCwgY2FuIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gbUluUGFyYW1ldGVycy5jYW5jZWxCdXR0b24gQ2FuY2VsIEJ1dHRvbiBvZiB0aGUgZGlzY2FyZCBwb3BvdmVyIChtYW5kYXRvcnkgZm9yIG5vdylcblx0ICogQHBhcmFtIG1JblBhcmFtZXRlcnMuc2tpcERpc2NhcmRQb3BvdmVyIE9wdGlvbmFsLCBzdXByZXNzZXMgdGhlIGRpc2NhcmQgcG9wb3ZlciBpbmNhc2Ugb2YgZHJhZnQgYXBwbGljYXRpb25zIHdoaWxlIG5hdmlnYXRpbmcgb3V0IG9mIE9QXG5cdCAqIEBwYXJhbSBvUmVzb3VyY2VCdW5kbGVcblx0ICogQHBhcmFtIG1lc3NhZ2VIYW5kbGVyXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2ZXMgd2l0aCA/Pz9cblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0YXN5bmMgY2FuY2VsRG9jdW1lbnQoXG5cdFx0b0NvbnRleHQ6IFY0Q29udGV4dCxcblx0XHRtSW5QYXJhbWV0ZXJzOiB7IGNhbmNlbEJ1dHRvbjogYW55OyBza2lwRGlzY2FyZFBvcG92ZXI6IGJvb2xlYW4gfSB8IHVuZGVmaW5lZCxcblx0XHRvUmVzb3VyY2VCdW5kbGU6IGFueSxcblx0XHRtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXJcblx0KTogUHJvbWlzZTxWNENvbnRleHQgfCBib29sZWFuPiB7XG5cdFx0Ly9jb250ZXh0IG11c3QgYWx3YXlzIGJlIHBhc3NlZCAtIG1hbmRhdG9yeSBwYXJhbWV0ZXJcblx0XHRpZiAoIW9Db250ZXh0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJObyBjb250ZXh0IGV4aXN0cy4gUGFzcyBhIG1lYW5pbmdmdWwgY29udGV4dFwiKTtcblx0XHR9XG5cdFx0QnVzeUxvY2tlci5sb2NrKHRoaXMub0xvY2tPYmplY3QpO1xuXHRcdGNvbnN0IG1QYXJhbWV0ZXJzID0gZ2V0UGFyYW1ldGVycyhtSW5QYXJhbWV0ZXJzKTtcblx0XHRjb25zdCBvTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpO1xuXHRcdGNvbnN0IHNQcm9ncmFtbWluZ01vZGVsID0gdGhpcy5nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KTtcblxuXHRcdHRyeSB7XG5cdFx0XHRsZXQgcmV0dXJuZWRWYWx1ZTogVjRDb250ZXh0IHwgYm9vbGVhbiA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoc1Byb2dyYW1taW5nTW9kZWwgPT09IFByb2dyYW1taW5nTW9kZWwuRHJhZnQgJiYgIXRoaXMuX2JJc01vZGlmaWVkKSB7XG5cdFx0XHRcdGNvbnN0IGRyYWZ0RGF0YUNvbnRleHQgPSBvTW9kZWwuYmluZENvbnRleHQoYCR7b0NvbnRleHQuZ2V0UGF0aCgpfS9EcmFmdEFkbWluaXN0cmF0aXZlRGF0YWApLmdldEJvdW5kQ29udGV4dCgpO1xuXHRcdFx0XHRjb25zdCBkcmFmdEFkbWluRGF0YSA9IGF3YWl0IGRyYWZ0RGF0YUNvbnRleHQucmVxdWVzdE9iamVjdCgpO1xuXHRcdFx0XHRpZiAoZHJhZnRBZG1pbkRhdGEpIHtcblx0XHRcdFx0XHR0aGlzLl9iSXNNb2RpZmllZCA9ICEoZHJhZnRBZG1pbkRhdGEuQ3JlYXRpb25EYXRlVGltZSA9PT0gZHJhZnRBZG1pbkRhdGEuTGFzdENoYW5nZURhdGVUaW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFtUGFyYW1ldGVycy5za2lwRGlzY2FyZFBvcG92ZXIpIHtcblx0XHRcdFx0YXdhaXQgdGhpcy5fc2hvd0Rpc2NhcmRQb3BvdmVyKG1QYXJhbWV0ZXJzLmNhbmNlbEJ1dHRvbiwgdGhpcy5fYklzTW9kaWZpZWQsIG9SZXNvdXJjZUJ1bmRsZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob0NvbnRleHQuaXNLZWVwQWxpdmUoKSkge1xuXHRcdFx0XHRvQ29udGV4dC5zZXRLZWVwQWxpdmUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1QYXJhbWV0ZXJzLmJlZm9yZUNhbmNlbENhbGxCYWNrKSB7XG5cdFx0XHRcdGF3YWl0IG1QYXJhbWV0ZXJzLmJlZm9yZUNhbmNlbENhbGxCYWNrKHsgY29udGV4dDogb0NvbnRleHQgfSk7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKHNQcm9ncmFtbWluZ01vZGVsKSB7XG5cdFx0XHRcdGNhc2UgUHJvZ3JhbW1pbmdNb2RlbC5EcmFmdDpcblx0XHRcdFx0XHRjb25zdCBiSGFzQWN0aXZlRW50aXR5ID0gYXdhaXQgb0NvbnRleHQucmVxdWVzdE9iamVjdChcIkhhc0FjdGl2ZUVudGl0eVwiKTtcblx0XHRcdFx0XHRpZiAoIWJIYXNBY3RpdmVFbnRpdHkpIHtcblx0XHRcdFx0XHRcdGlmIChvQ29udGV4dCAmJiBvQ29udGV4dC5oYXNQZW5kaW5nQ2hhbmdlcygpKSB7XG5cdFx0XHRcdFx0XHRcdG9Db250ZXh0LmdldEJpbmRpbmcoKS5yZXNldENoYW5nZXMoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybmVkVmFsdWUgPSBhd2FpdCBkcmFmdC5kZWxldGVEcmFmdChvQ29udGV4dCwgdGhpcy5fb0FwcENvbXBvbmVudCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9TaWJsaW5nQ29udGV4dCA9IG9Nb2RlbC5iaW5kQ29udGV4dChgJHtvQ29udGV4dC5nZXRQYXRoKCl9L1NpYmxpbmdFbnRpdHlgKS5nZXRCb3VuZENvbnRleHQoKTtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNDYW5vbmljYWxQYXRoID0gYXdhaXQgb1NpYmxpbmdDb250ZXh0LnJlcXVlc3RDYW5vbmljYWxQYXRoKCk7XG5cdFx0XHRcdFx0XHRcdGlmIChvQ29udGV4dCAmJiBvQ29udGV4dC5oYXNQZW5kaW5nQ2hhbmdlcygpKSB7XG5cdFx0XHRcdFx0XHRcdFx0b0NvbnRleHQuZ2V0QmluZGluZygpLnJlc2V0Q2hhbmdlcygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybmVkVmFsdWUgPSBvTW9kZWwuYmluZENvbnRleHQoc0Nhbm9uaWNhbFBhdGgpLmdldEJvdW5kQ29udGV4dCgpO1xuXHRcdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdFx0YXdhaXQgZHJhZnQuZGVsZXRlRHJhZnQob0NvbnRleHQsIHRoaXMuX29BcHBDb21wb25lbnQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFByb2dyYW1taW5nTW9kZWwuU3RpY2t5OlxuXHRcdFx0XHRcdGNvbnN0IGRpc2NhcmRlZENvbnRleHQgPSBhd2FpdCBzdGlja3kuZGlzY2FyZERvY3VtZW50KG9Db250ZXh0KTtcblx0XHRcdFx0XHRpZiAoZGlzY2FyZGVkQ29udGV4dCkge1xuXHRcdFx0XHRcdFx0aWYgKGRpc2NhcmRlZENvbnRleHQuaGFzUGVuZGluZ0NoYW5nZXMoKSkge1xuXHRcdFx0XHRcdFx0XHRkaXNjYXJkZWRDb250ZXh0LmdldEJpbmRpbmcoKS5yZXNldENoYW5nZXMoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghdGhpcy5fYkNyZWF0ZU1vZGUpIHtcblx0XHRcdFx0XHRcdFx0ZGlzY2FyZGVkQ29udGV4dC5yZWZyZXNoKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybmVkVmFsdWUgPSBkaXNjYXJkZWRDb250ZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbmNlbCBkb2N1bWVudCBvbmx5IGFsbG93ZWQgZm9yIGRyYWZ0IG9yIHN0aWNreSBzZXNzaW9uIHN1cHBvcnRlZCBzZXJ2aWNlc1wiKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fYklzTW9kaWZpZWQgPSBmYWxzZTtcblx0XHRcdC8vIHJlbW92ZSBleGlzdGluZyBib3VuZCB0cmFuc2l0aW9uIG1lc3NhZ2VzXG5cdFx0XHRtZXNzYWdlSGFuZGxlci5yZW1vdmVUcmFuc2l0aW9uTWVzc2FnZXMoKTtcblx0XHRcdC8vIHNob3cgdW5ib3VuZCBtZXNzYWdlc1xuXHRcdFx0YXdhaXQgbWVzc2FnZUhhbmRsZXIuc2hvd01lc3NhZ2VzKCk7XG5cdFx0XHRyZXR1cm4gcmV0dXJuZWRWYWx1ZTtcblx0XHR9IGNhdGNoIChlcnI6IGFueSkge1xuXHRcdFx0YXdhaXQgbWVzc2FnZUhhbmRsZXIuc2hvd01lc3NhZ2VzKCk7XG5cdFx0XHR0aHJvdyBlcnI7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKHRoaXMub0xvY2tPYmplY3QpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTYXZlcyB0aGUgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlclxuXHQgKiBAc3RhdGljXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9mIHRoZSBkb2N1bWVudCB0byBiZSBzYXZlZFxuXHQgKiBAcGFyYW0gb1Jlc291cmNlQnVuZGxlXG5cdCAqIEBwYXJhbSBiRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvclxuXHQgKiBAcGFyYW0gYUJpbmRpbmdzXG5cdCAqIEBwYXJhbSBtZXNzYWdlSGFuZGxlclxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIHdpdGggPz8/XG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdGFzeW5jIHNhdmVEb2N1bWVudChcblx0XHRvQ29udGV4dDogVjRDb250ZXh0LFxuXHRcdG9SZXNvdXJjZUJ1bmRsZTogYW55LFxuXHRcdGJFeGVjdXRlU2lkZUVmZmVjdHNPbkVycm9yOiBhbnksXG5cdFx0YUJpbmRpbmdzOiBhbnksXG5cdFx0bWVzc2FnZUhhbmRsZXI6IE1lc3NhZ2VIYW5kbGVyXG5cdCk6IFByb21pc2U8VjRDb250ZXh0PiB7XG5cdFx0aWYgKCFvQ29udGV4dCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkJpbmRpbmcgY29udGV4dCB0byBkcmFmdCBkb2N1bWVudCBpcyByZXF1aXJlZFwiKSk7XG5cdFx0fVxuXHRcdGNvbnN0IHNQcm9ncmFtbWluZ01vZGVsID0gdGhpcy5nZXRQcm9ncmFtbWluZ01vZGVsKG9Db250ZXh0KTtcblx0XHRpZiAoc1Byb2dyYW1taW5nTW9kZWwgIT09IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5ICYmIHNQcm9ncmFtbWluZ01vZGVsICE9PSBQcm9ncmFtbWluZ01vZGVsLkRyYWZ0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTYXZlIGlzIG9ubHkgYWxsb3dlZCBmb3IgZHJhZnQgb3Igc3RpY2t5IHNlc3Npb24gc3VwcG9ydGVkIHNlcnZpY2VzXCIpO1xuXHRcdH1cblx0XHQvLyBpbiBjYXNlIG9mIHNhdmluZyAvIGFjdGl2YXRpbmcgdGhlIGJvdW5kIHRyYW5zaXRpb24gbWVzc2FnZXMgc2hhbGwgYmUgcmVtb3ZlZCBiZWZvcmUgdGhlIFBBVENIL1BPU1Rcblx0XHQvLyBpcyBzZW50IHRvIHRoZSBiYWNrZW5kXG5cdFx0bWVzc2FnZUhhbmRsZXIucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cblx0XHR0cnkge1xuXHRcdFx0QnVzeUxvY2tlci5sb2NrKHRoaXMub0xvY2tPYmplY3QpO1xuXHRcdFx0Y29uc3Qgb0FjdGl2ZURvY3VtZW50ID1cblx0XHRcdFx0c1Byb2dyYW1taW5nTW9kZWwgPT09IFByb2dyYW1taW5nTW9kZWwuRHJhZnRcblx0XHRcdFx0XHQ/IGF3YWl0IGRyYWZ0LmFjdGl2YXRlRG9jdW1lbnQob0NvbnRleHQsIHRoaXMuX2dldEFwcENvbXBvbmVudCgpLCB7fSwgbWVzc2FnZUhhbmRsZXIpXG5cdFx0XHRcdFx0OiBhd2FpdCBzdGlja3kuYWN0aXZhdGVEb2N1bWVudChvQ29udGV4dCwgdGhpcy5fZ2V0QXBwQ29tcG9uZW50KCkpO1xuXG5cdFx0XHRjb25zdCBiTmV3T2JqZWN0ID0gc1Byb2dyYW1taW5nTW9kZWwgPT09IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5ID8gdGhpcy5fYkNyZWF0ZU1vZGUgOiAhb0NvbnRleHQuZ2V0T2JqZWN0KCkuSGFzQWN0aXZlRW50aXR5O1xuXHRcdFx0Y29uc3QgbWVzc2FnZXNSZWNlaXZlZCA9IG1lc3NhZ2VIYW5kbGluZy5nZXRNZXNzYWdlcygpLmNvbmNhdChtZXNzYWdlSGFuZGxpbmcuZ2V0TWVzc2FnZXModHJ1ZSwgdHJ1ZSkpOyAvLyBnZXQgdW5ib3VuZCBhbmQgYm91bmQgbWVzc2FnZXMgcHJlc2VudCBpbiB0aGUgbW9kZWxcblx0XHRcdGlmICghKG1lc3NhZ2VzUmVjZWl2ZWQubGVuZ3RoID09PSAxICYmIG1lc3NhZ2VzUmVjZWl2ZWRbMF0udHlwZSA9PT0gY29yZUxpYnJhcnkuTWVzc2FnZVR5cGUuU3VjY2VzcykpIHtcblx0XHRcdFx0Ly8gc2hvdyBvdXIgb2JqZWN0IGNyZWF0aW9uIHRvYXN0IG9ubHkgaWYgaXQgaXMgbm90IGNvbWluZyBmcm9tIGJhY2tlbmRcblx0XHRcdFx0TWVzc2FnZVRvYXN0LnNob3coXG5cdFx0XHRcdFx0Yk5ld09iamVjdFxuXHRcdFx0XHRcdFx0PyBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX09CSkVDVF9DUkVBVEVEXCIsIG9SZXNvdXJjZUJ1bmRsZSlcblx0XHRcdFx0XHRcdDogQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9PQkpFQ1RfU0FWRURcIiwgb1Jlc291cmNlQnVuZGxlKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9iSXNNb2RpZmllZCA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIG9BY3RpdmVEb2N1bWVudDtcblx0XHR9IGNhdGNoIChlcnI6IGFueSkge1xuXHRcdFx0aWYgKGFCaW5kaW5ncyAmJiBhQmluZGluZ3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHQvKiBUaGUgc2lkZUVmZmVjdHMgYXJlIGV4ZWN1dGVkIG9ubHkgZm9yIHRhYmxlIGl0ZW1zIGluIHRyYW5zaWVudCBzdGF0ZSAqL1xuXHRcdFx0XHRhQmluZGluZ3MuZm9yRWFjaCgob0xpc3RCaW5kaW5nOiBhbnkpID0+IHtcblx0XHRcdFx0XHRpZiAoIUNvbW1vblV0aWxzLmhhc1RyYW5zaWVudENvbnRleHQob0xpc3RCaW5kaW5nKSAmJiBiRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvcikge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb0FwcENvbXBvbmVudCA9IHRoaXMuX2dldEFwcENvbXBvbmVudCgpO1xuXHRcdFx0XHRcdFx0b0FwcENvbXBvbmVudC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKS5yZXF1ZXN0U2lkZUVmZmVjdHNGb3JOYXZpZ2F0aW9uUHJvcGVydHkob0xpc3RCaW5kaW5nLmdldFBhdGgoKSwgb0NvbnRleHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRhd2FpdCBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZXMoKTtcblx0XHRcdHRocm93IGVycjtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0QnVzeUxvY2tlci51bmxvY2sodGhpcy5vTG9ja09iamVjdCk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiBDYWxscyBhIGJvdW5kIG9yIHVuYm91bmQgYWN0aW9uLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHN0YXRpY1xuXHQgKiBAbmFtZSBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlci5jYWxsQWN0aW9uXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlclxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjdGlvbiB0byBiZSBjYWxsZWRcblx0ICogQHBhcmFtIFttUGFyYW1ldGVyc10gQ29udGFpbnMgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLnBhcmFtZXRlclZhbHVlc10gQSBtYXAgb2YgYWN0aW9uIHBhcmFtZXRlciBuYW1lcyBhbmQgcHJvdmlkZWQgdmFsdWVzXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuc2tpcFBhcmFtZXRlckRpYWxvZ10gU2tpcHMgdGhlIHBhcmFtZXRlciBkaWFsb2cgaWYgdmFsdWVzIGFyZSBwcm92aWRlZCBmb3IgYWxsIG9mIHRoZW1cblx0ICogQHBhcmFtIFttUGFyYW1ldGVycy5jb250ZXh0c10gTWFuZGF0b3J5IGZvciBhIGJvdW5kIGFjdGlvbjogRWl0aGVyIG9uZSBjb250ZXh0IG9yIGFuIGFycmF5IHdpdGggY29udGV4dHMgZm9yIHdoaWNoIHRoZSBhY3Rpb24gaXMgdG8gYmUgY2FsbGVkXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMubW9kZWxdIE1hbmRhdG9yeSBmb3IgYW4gdW5ib3VuZCBhY3Rpb246IEFuIGluc3RhbmNlIG9mIGFuIE9EYXRhIFY0IG1vZGVsXG5cdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuaW52b2NhdGlvbkdyb3VwaW5nXSBNb2RlIGhvdyBhY3Rpb25zIGFyZSB0byBiZSBjYWxsZWQ6ICdDaGFuZ2VTZXQnIHRvIHB1dCBhbGwgYWN0aW9uIGNhbGxzIGludG8gb25lIGNoYW5nZXNldCwgJ0lzb2xhdGVkJyB0byBwdXQgdGhlbSBpbnRvIHNlcGFyYXRlIGNoYW5nZXNldHNcblx0ICogQHBhcmFtIFttUGFyYW1ldGVycy5sYWJlbF0gQSBodW1hbi1yZWFkYWJsZSBsYWJlbCBmb3IgdGhlIGFjdGlvblxuXHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmJHZXRCb3VuZENvbnRleHRdIElmIHNwZWNpZmllZCwgdGhlIGFjdGlvbiBwcm9taXNlIHJldHVybnMgdGhlIGJvdW5kIGNvbnRleHRcblx0ICogQHBhcmFtIG9WaWV3IENvbnRhaW5zIHRoZSBvYmplY3Qgb2YgdGhlIGN1cnJlbnQgdmlld1xuXHQgKiBAcGFyYW0gbWVzc2FnZUhhbmRsZXJcblx0ICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZlcyB3aXRoIGFuIGFycmF5IG9mIHJlc3BvbnNlIG9iamVjdHMgKFRPRE86IHRvIGJlIGNoYW5nZWQpXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdGFzeW5jIGNhbGxBY3Rpb24oc0FjdGlvbk5hbWU6IHN0cmluZywgbVBhcmFtZXRlcnM6IGFueSwgb1ZpZXc6IFZpZXcgfCBudWxsLCBtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXIpOiBQcm9taXNlPGFueT4ge1xuXHRcdG1QYXJhbWV0ZXJzID0gZ2V0UGFyYW1ldGVycyhtUGFyYW1ldGVycyk7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cdFx0bGV0IG9Db250ZXh0LCBvTW9kZWw6IGFueTtcblx0XHRjb25zdCBtQmluZGluZ1BhcmFtZXRlcnMgPSBtUGFyYW1ldGVycy5iaW5kaW5nUGFyYW1ldGVycztcblx0XHRpZiAoIXNBY3Rpb25OYW1lKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQcm92aWRlIG5hbWUgb2YgYWN0aW9uIHRvIGJlIGV4ZWN1dGVkXCIpO1xuXHRcdH1cblx0XHQvLyBhY3Rpb24gaW1wb3J0cyBhcmUgbm90IGRpcmVjdGx5IG9idGFpbmVkIGZyb20gdGhlIG1ldGFNb2RlbCBieSBpdCBpcyBwcmVzZW50IGluc2lkZSB0aGUgZW50aXR5Q29udGFpbmVyXG5cdFx0Ly8gYW5kIHRoZSBhY2lvbnMgaXQgcmVmZXJzIHRvIHByZXNlbnQgb3V0c2lkZSB0aGUgZW50aXR5Y29udGFpbmVyLCBoZW5jZSB0byBvYnRhaW4ga2luZCBvZiB0aGUgYWN0aW9uXG5cdFx0Ly8gc3BsaXQoKSBvbiBpdHMgbmFtZSB3YXMgcmVxdWlyZWRcblx0XHRjb25zdCBzTmFtZSA9IHNBY3Rpb25OYW1lLnNwbGl0KFwiL1wiKVsxXTtcblx0XHRzQWN0aW9uTmFtZSA9IHNOYW1lIHx8IHNBY3Rpb25OYW1lO1xuXHRcdG9Db250ZXh0ID0gc05hbWUgPyB1bmRlZmluZWQgOiBtUGFyYW1ldGVycy5jb250ZXh0cztcblx0XHQvL2NoZWNraW5nIHdoZXRoZXIgdGhlIGNvbnRleHQgaXMgYW4gYXJyYXkgd2l0aCBtb3JlIHRoYW4gMCBsZW5ndGggb3Igbm90IGFuIGFycmF5KGNyZWF0ZSBhY3Rpb24pXG5cdFx0aWYgKG9Db250ZXh0ICYmICgoQXJyYXkuaXNBcnJheShvQ29udGV4dCkgJiYgb0NvbnRleHQubGVuZ3RoKSB8fCAhQXJyYXkuaXNBcnJheShvQ29udGV4dCkpKSB7XG5cdFx0XHRvQ29udGV4dCA9IEFycmF5LmlzQXJyYXkob0NvbnRleHQpID8gb0NvbnRleHRbMF0gOiBvQ29udGV4dDtcblx0XHRcdG9Nb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCk7XG5cdFx0fVxuXHRcdGlmIChtUGFyYW1ldGVycy5tb2RlbCkge1xuXHRcdFx0b01vZGVsID0gbVBhcmFtZXRlcnMubW9kZWw7XG5cdFx0fVxuXHRcdGlmICghb01vZGVsKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQYXNzIGEgY29udGV4dCBmb3IgYSBib3VuZCBhY3Rpb24gb3IgcGFzcyB0aGUgbW9kZWwgZm9yIGFuIHVuYm91bmQgYWN0aW9uXCIpO1xuXHRcdH1cblx0XHQvLyBnZXQgdGhlIGJpbmRpbmcgcGFyYW1ldGVycyAkc2VsZWN0IGFuZCAkZXhwYW5kIGZvciB0aGUgc2lkZSBlZmZlY3Qgb24gdGhpcyBhY3Rpb25cblx0XHQvLyBhbHNvIGdhdGhlciBhZGRpdGlvbmFsIHByb3BlcnR5IHBhdGhzIHRvIGJlIHJlcXVlc3RlZCBzdWNoIGFzIHRleHQgYXNzb2NpYXRpb25zXG5cdFx0Y29uc3Qgb0FwcENvbXBvbmVudCA9IHRoYXQuX2dldEFwcENvbXBvbmVudCgpO1xuXHRcdGNvbnN0IG1TaWRlRWZmZWN0c1BhcmFtZXRlcnMgPSBvQXBwQ29tcG9uZW50LmdldFNpZGVFZmZlY3RzU2VydmljZSgpLmdldE9EYXRhQWN0aW9uU2lkZUVmZmVjdHMoc0FjdGlvbk5hbWUsIG9Db250ZXh0KSB8fCB7fTtcblxuXHRcdGNvbnN0IGRpc3BsYXlVbmFwcGxpY2FibGVDb250ZXh0c0RpYWxvZyA9ICgpOiBQcm9taXNlPFY0Q29udGV4dFtdIHwgdm9pZD4gPT4ge1xuXHRcdFx0aWYgKCFtUGFyYW1ldGVycy5ub3RBcHBsaWNhYmxlQ29udGV4dCB8fCBtUGFyYW1ldGVycy5ub3RBcHBsaWNhYmxlQ29udGV4dC5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShtUGFyYW1ldGVycy5jb250ZXh0cyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGZuT3BlbkFuZEZpbGxEaWFsb2cgPSBmdW5jdGlvbiAob0RsZzogRGlhbG9nKSB7XG5cdFx0XHRcdFx0bGV0IG9EaWFsb2dDb250ZW50O1xuXHRcdFx0XHRcdGNvbnN0IG5Ob3RBcHBsaWNhYmxlID0gbVBhcmFtZXRlcnMubm90QXBwbGljYWJsZUNvbnRleHQubGVuZ3RoLFxuXHRcdFx0XHRcdFx0YU5vdEFwcGxpY2FibGVJdGVtcyA9IFtdO1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbVBhcmFtZXRlcnMubm90QXBwbGljYWJsZUNvbnRleHQubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdG9EaWFsb2dDb250ZW50ID0gbVBhcmFtZXRlcnMubm90QXBwbGljYWJsZUNvbnRleHRbaV0uZ2V0T2JqZWN0KCk7XG5cdFx0XHRcdFx0XHRhTm90QXBwbGljYWJsZUl0ZW1zLnB1c2gob0RpYWxvZ0NvbnRlbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBvTm90QXBwbGljYWJsZUl0ZW1zTW9kZWwgPSBuZXcgSlNPTk1vZGVsKGFOb3RBcHBsaWNhYmxlSXRlbXMpO1xuXHRcdFx0XHRcdGNvbnN0IG9Ub3RhbHMgPSBuZXcgSlNPTk1vZGVsKHsgdG90YWw6IG5Ob3RBcHBsaWNhYmxlLCBsYWJlbDogbVBhcmFtZXRlcnMubGFiZWwgfSk7XG5cdFx0XHRcdFx0b0RsZy5zZXRNb2RlbChvTm90QXBwbGljYWJsZUl0ZW1zTW9kZWwsIFwibm90QXBwbGljYWJsZVwiKTtcblx0XHRcdFx0XHRvRGxnLnNldE1vZGVsKG9Ub3RhbHMsIFwidG90YWxzXCIpO1xuXHRcdFx0XHRcdG9EbGcub3BlbigpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQvLyBTaG93IHRoZSBjb250ZXh0cyB0aGF0IGFyZSBub3QgYXBwbGljYWJsZSBhbmQgd2lsbCBub3QgdGhlcmVmb3JlIGJlIHByb2Nlc3NlZFxuXHRcdFx0XHRjb25zdCBzRnJhZ21lbnROYW1lID0gXCJzYXAuZmUuY29yZS5jb250cm9scy5BY3Rpb25QYXJ0aWFsXCI7XG5cdFx0XHRcdGNvbnN0IG9EaWFsb2dGcmFnbWVudCA9IFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShzRnJhZ21lbnROYW1lLCBcImZyYWdtZW50XCIpO1xuXHRcdFx0XHRjb25zdCBvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHRcdFx0XHRjb25zdCBzQ2Fub25pY2FsUGF0aCA9IG1QYXJhbWV0ZXJzLmNvbnRleHRzWzBdLmdldENhbm9uaWNhbFBhdGgoKTtcblx0XHRcdFx0Y29uc3Qgc0VudGl0eVNldCA9IGAke3NDYW5vbmljYWxQYXRoLnN1YnN0cigwLCBzQ2Fub25pY2FsUGF0aC5pbmRleE9mKFwiKFwiKSl9L2A7XG5cdFx0XHRcdGNvbnN0IG9EaWFsb2dMYWJlbE1vZGVsID0gbmV3IEpTT05Nb2RlbCh7XG5cdFx0XHRcdFx0dGl0bGU6IG1QYXJhbWV0ZXJzLmxhYmVsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgb0ZyYWdtZW50ID0gYXdhaXQgWE1MUHJlcHJvY2Vzc29yLnByb2Nlc3MoXG5cdFx0XHRcdFx0XHRvRGlhbG9nRnJhZ21lbnQsXG5cdFx0XHRcdFx0XHR7IG5hbWU6IHNGcmFnbWVudE5hbWUgfSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XHRcdFx0ZW50aXR5VHlwZTogb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzRW50aXR5U2V0KSxcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogb0RpYWxvZ0xhYmVsTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFx0XHRcdGVudGl0eVR5cGU6IG9NZXRhTW9kZWwsXG5cdFx0XHRcdFx0XHRcdFx0bWV0YU1vZGVsOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBvRGlhbG9nTGFiZWxNb2RlbFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG5cdFx0XHRcdFx0bGV0IG9EaWFsb2c6IERpYWxvZztcblx0XHRcdFx0XHRjb25zdCBvQ29udHJvbGxlciA9IHtcblx0XHRcdFx0XHRcdG9uQ2xvc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0Ly8gVXNlciBjYW5jZWxzIGFjdGlvblxuXHRcdFx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRvbkNvbnRpbnVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdC8vIFVzZXJzIGNvbnRpbnVlcyB0aGUgYWN0aW9uIHdpdGggdGhlIGJvdW5kIGNvbnRleHRzXG5cdFx0XHRcdFx0XHRcdG9EaWFsb2cuY2xvc2UoKTtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShtUGFyYW1ldGVycy5hcHBsaWNhYmxlQ29udGV4dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRvRGlhbG9nID0gKGF3YWl0IEZyYWdtZW50LmxvYWQoeyBkZWZpbml0aW9uOiBvRnJhZ21lbnQsIGNvbnRyb2xsZXI6IG9Db250cm9sbGVyIH0pKSBhcyBEaWFsb2c7XG5cdFx0XHRcdFx0b0NvbnRyb2xsZXIub25DbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdC8vIFVzZXIgY2FuY2VscyBhY3Rpb25cblx0XHRcdFx0XHRcdG9EaWFsb2cuY2xvc2UoKTtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdG9Db250cm9sbGVyLm9uQ29udGludWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQvLyBVc2VycyBjb250aW51ZXMgdGhlIGFjdGlvbiB3aXRoIHRoZSBib3VuZCBjb250ZXh0c1xuXHRcdFx0XHRcdFx0b0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShtUGFyYW1ldGVycy5hcHBsaWNhYmxlQ29udGV4dCk7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wuYWRkRGVwZW5kZW50KG9EaWFsb2cpO1xuXHRcdFx0XHRcdGZuT3BlbkFuZEZpbGxEaWFsb2cob0RpYWxvZyk7XG5cdFx0XHRcdH0gY2F0Y2ggKG9FcnJvcikge1xuXHRcdFx0XHRcdHJlamVjdChvRXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dHJ5IHtcblx0XHRcdGxldCBvUmVzdWx0OiBhbnk7XG5cdFx0XHRpZiAob0NvbnRleHQgJiYgb01vZGVsKSB7XG5cdFx0XHRcdGNvbnN0IGNvbnRleHRUb1Byb2Nlc3MgPSBhd2FpdCBkaXNwbGF5VW5hcHBsaWNhYmxlQ29udGV4dHNEaWFsb2coKTtcblx0XHRcdFx0aWYgKGNvbnRleHRUb1Byb2Nlc3MpIHtcblx0XHRcdFx0XHRvUmVzdWx0ID0gYXdhaXQgb3BlcmF0aW9ucy5jYWxsQm91bmRBY3Rpb24oc0FjdGlvbk5hbWUsIGNvbnRleHRUb1Byb2Nlc3MsIG9Nb2RlbCwgb0FwcENvbXBvbmVudCwge1xuXHRcdFx0XHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBtUGFyYW1ldGVycy5wYXJhbWV0ZXJWYWx1ZXMsXG5cdFx0XHRcdFx0XHRpbnZvY2F0aW9uR3JvdXBpbmc6IG1QYXJhbWV0ZXJzLmludm9jYXRpb25Hcm91cGluZyxcblx0XHRcdFx0XHRcdGxhYmVsOiBtUGFyYW1ldGVycy5sYWJlbCxcblx0XHRcdFx0XHRcdHNraXBQYXJhbWV0ZXJEaWFsb2c6IG1QYXJhbWV0ZXJzLnNraXBQYXJhbWV0ZXJEaWFsb2csXG5cdFx0XHRcdFx0XHRtQmluZGluZ1BhcmFtZXRlcnM6IG1CaW5kaW5nUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdGVudGl0eVNldE5hbWU6IG1QYXJhbWV0ZXJzLmVudGl0eVNldE5hbWUsXG5cdFx0XHRcdFx0XHRhZGRpdGlvbmFsU2lkZUVmZmVjdDogbVNpZGVFZmZlY3RzUGFyYW1ldGVycyxcblx0XHRcdFx0XHRcdG9uU3VibWl0dGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyLnJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcygpO1xuXHRcdFx0XHRcdFx0XHRCdXN5TG9ja2VyLmxvY2sodGhhdC5vTG9ja09iamVjdCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0b25SZXNwb25zZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayh0aGF0Lm9Mb2NrT2JqZWN0KTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRwYXJlbnRDb250cm9sOiBtUGFyYW1ldGVycy5wYXJlbnRDb250cm9sLFxuXHRcdFx0XHRcdFx0Y29udHJvbElkOiBtUGFyYW1ldGVycy5jb250cm9sSWQsXG5cdFx0XHRcdFx0XHRpbnRlcm5hbE1vZGVsQ29udGV4dDogbVBhcmFtZXRlcnMuaW50ZXJuYWxNb2RlbENvbnRleHQsXG5cdFx0XHRcdFx0XHRvcGVyYXRpb25BdmFpbGFibGVNYXA6IG1QYXJhbWV0ZXJzLm9wZXJhdGlvbkF2YWlsYWJsZU1hcCxcblx0XHRcdFx0XHRcdGJJc0NyZWF0ZUFjdGlvbjogbVBhcmFtZXRlcnMuYklzQ3JlYXRlQWN0aW9uLFxuXHRcdFx0XHRcdFx0YkdldEJvdW5kQ29udGV4dDogbVBhcmFtZXRlcnMuYkdldEJvdW5kQ29udGV4dCxcblx0XHRcdFx0XHRcdGJPYmplY3RQYWdlOiBtUGFyYW1ldGVycy5iT2JqZWN0UGFnZSxcblx0XHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyOiBtZXNzYWdlSGFuZGxlcixcblx0XHRcdFx0XHRcdGRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbjogbVBhcmFtZXRlcnMuZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uLFxuXHRcdFx0XHRcdFx0c2VsZWN0ZWRJdGVtczogbVBhcmFtZXRlcnMuY29udGV4dHNcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvUmVzdWx0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b1Jlc3VsdCA9IGF3YWl0IG9wZXJhdGlvbnMuY2FsbEFjdGlvbkltcG9ydChzQWN0aW9uTmFtZSwgb01vZGVsLCBvQXBwQ29tcG9uZW50LCB7XG5cdFx0XHRcdFx0cGFyYW1ldGVyVmFsdWVzOiBtUGFyYW1ldGVycy5wYXJhbWV0ZXJWYWx1ZXMsXG5cdFx0XHRcdFx0bGFiZWw6IG1QYXJhbWV0ZXJzLmxhYmVsLFxuXHRcdFx0XHRcdHNraXBQYXJhbWV0ZXJEaWFsb2c6IG1QYXJhbWV0ZXJzLnNraXBQYXJhbWV0ZXJEaWFsb2csXG5cdFx0XHRcdFx0YmluZGluZ1BhcmFtZXRlcnM6IG1CaW5kaW5nUGFyYW1ldGVycyxcblx0XHRcdFx0XHRlbnRpdHlTZXROYW1lOiBtUGFyYW1ldGVycy5lbnRpdHlTZXROYW1lLFxuXHRcdFx0XHRcdG9uU3VibWl0dGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRCdXN5TG9ja2VyLmxvY2sodGhhdC5vTG9ja09iamVjdCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvblJlc3BvbnNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayh0aGF0Lm9Mb2NrT2JqZWN0KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHBhcmVudENvbnRyb2w6IG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2wsXG5cdFx0XHRcdFx0aW50ZXJuYWxNb2RlbENvbnRleHQ6IG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0LFxuXHRcdFx0XHRcdG9wZXJhdGlvbkF2YWlsYWJsZU1hcDogbVBhcmFtZXRlcnMub3BlcmF0aW9uQXZhaWxhYmxlTWFwLFxuXHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyOiBtZXNzYWdlSGFuZGxlcixcblx0XHRcdFx0XHRiT2JqZWN0UGFnZTogbVBhcmFtZXRlcnMuYk9iamVjdFBhZ2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHRoaXMuX2hhbmRsZUFjdGlvblJlc3BvbnNlKG1lc3NhZ2VIYW5kbGVyLCBtUGFyYW1ldGVycywgc0FjdGlvbk5hbWUpO1xuXHRcdFx0cmV0dXJuIG9SZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZXJyOiBhbnkpIHtcblx0XHRcdGF3YWl0IHRoaXMuX2hhbmRsZUFjdGlvblJlc3BvbnNlKG1lc3NhZ2VIYW5kbGVyLCBtUGFyYW1ldGVycywgc0FjdGlvbk5hbWUpO1xuXHRcdFx0dGhyb3cgZXJyO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogSGFuZGxlcyBtZXNzYWdlcyBmb3IgYWN0aW9uIGNhbGwuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlciNfaGFuZGxlQWN0aW9uUmVzcG9uc2Vcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBwYXJhbSBtZXNzYWdlSGFuZGxlclxuXHQgKiBAcGFyYW0gbVBhcmFtZXRlcnMgUGFyYW1ldGVycyB0byBiZSBjb25zaWRlcmVkIGZvciB0aGUgYWN0aW9uLlxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjdGlvbiB0byBiZSBjYWxsZWRcblx0ICogQHJldHVybnMgUHJvbWlzZSBhZnRlciBtZXNzYWdlIGRpYWxvZyBpcyBvcGVuZWQgaWYgcmVxdWlyZWQuXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdF9oYW5kbGVBY3Rpb25SZXNwb25zZShtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXIsIG1QYXJhbWV0ZXJzOiBhbnksIHNBY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBhVHJhbnNpZW50TWVzc2FnZXMgPSBtZXNzYWdlSGFuZGxpbmcuZ2V0TWVzc2FnZXModHJ1ZSwgdHJ1ZSk7XG5cdFx0aWYgKGFUcmFuc2llbnRNZXNzYWdlcy5sZW5ndGggPiAwICYmIG1QYXJhbWV0ZXJzICYmIG1QYXJhbWV0ZXJzLmludGVybmFsTW9kZWxDb250ZXh0KSB7XG5cdFx0XHRtUGFyYW1ldGVycy5pbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInNBY3Rpb25OYW1lXCIsIG1QYXJhbWV0ZXJzLmxhYmVsID8gbVBhcmFtZXRlcnMubGFiZWwgOiBzQWN0aW9uTmFtZSk7XG5cdFx0fVxuXHRcdHJldHVybiBtZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZXMoKTtcblx0fVxuXHQvKipcblx0ICogSGFuZGxlcyB2YWxpZGF0aW9uIGVycm9ycyBmb3IgdGhlICdEaXNjYXJkJyBhY3Rpb24uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBzYXAuZmUuY29yZS5UcmFuc2FjdGlvbkhlbHBlciNoYW5kbGVWYWxpZGF0aW9uRXJyb3Jcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBzdGF0aWNcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0aGFuZGxlVmFsaWRhdGlvbkVycm9yKCkge1xuXHRcdGNvbnN0IG9NZXNzYWdlTWFuYWdlciA9IENvcmUuZ2V0TWVzc2FnZU1hbmFnZXIoKSxcblx0XHRcdGVycm9yVG9SZW1vdmUgPSBvTWVzc2FnZU1hbmFnZXJcblx0XHRcdFx0LmdldE1lc3NhZ2VNb2RlbCgpXG5cdFx0XHRcdC5nZXREYXRhKClcblx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAoZXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdC8vIG9ubHkgbmVlZHMgdG8gaGFuZGxlIHZhbGlkYXRpb24gbWVzc2FnZXMsIHRlY2huaWNhbCBhbmQgcGVyc2lzdGVudCBlcnJvcnMgbmVlZHMgbm90IHRvIGJlIGNoZWNrZWQgaGVyZS5cblx0XHRcdFx0XHRpZiAoZXJyb3IudmFsaWRhdGlvbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0b01lc3NhZ2VNYW5hZ2VyLnJlbW92ZU1lc3NhZ2VzKGVycm9yVG9SZW1vdmUpO1xuXHR9XG5cdC8qKlxuXHQgKiBTaG93cyBhIHBvcG92ZXIgaWYgaXQgbmVlZHMgdG8gYmUgc2hvd24uXG5cdCAqIFRPRE86IFBvcG92ZXIgaXMgc2hvd24gaWYgdXNlciBoYXMgbW9kaWZpZWQgYW55IGRhdGEuXG5cdCAqIFRPRE86IFBvcG92ZXIgaXMgc2hvd24gaWYgdGhlcmUncyBhIGRpZmZlcmVuY2UgZnJvbSBkcmFmdCBhZG1pbiBkYXRhLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyLl9zaG93RGlzY2FyZFBvcG92ZXJcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBwYXJhbSBvQ2FuY2VsQnV0dG9uIFRoZSBjb250cm9sIHdoaWNoIHdpbGwgb3BlbiB0aGUgcG9wb3ZlclxuXHQgKiBAcGFyYW0gYklzTW9kaWZpZWRcblx0ICogQHBhcmFtIG9SZXNvdXJjZUJ1bmRsZVxuXHQgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmVzIGlmIHVzZXIgY29uZmlybXMgZGlzY2FyZCwgcmVqZWN0cyBpZiBvdGhlcndpc2UsIHJlamVjdHMgaWYgbm8gY29udHJvbCBwYXNzZWQgdG8gb3BlbiBwb3BvdmVyXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdF9zaG93RGlzY2FyZFBvcG92ZXIob0NhbmNlbEJ1dHRvbjogYW55LCBiSXNNb2RpZmllZDogYW55LCBvUmVzb3VyY2VCdW5kbGU6IGFueSkge1xuXHRcdC8vIFRPRE86IEltcGxlbWVudCB0aGlzIHBvcG92ZXIgYXMgYSBmcmFnbWVudCBhcyBpbiB2Mj8/XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cdFx0dGhhdC5fYkNvbnRpbnVlRGlzY2FyZCA9IGZhbHNlO1xuXHRcdC8vIHRvIGJlIGltcGxlbWVudGVkXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdGlmICghb0NhbmNlbEJ1dHRvbikge1xuXHRcdFx0XHRyZWplY3QoXCJDYW5jZWwgYnV0dG9uIG5vdCBmb3VuZFwiKTtcblx0XHRcdH1cblx0XHRcdC8vU2hvdyBwb3BvdmVyIG9ubHkgd2hlbiBkYXRhIGlzIGNoYW5nZWQuXG5cdFx0XHRpZiAoYklzTW9kaWZpZWQpIHtcblx0XHRcdFx0Y29uc3QgZm5PbkFmdGVyRGlzY2FyZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvQ2FuY2VsQnV0dG9uLnNldEVuYWJsZWQodHJ1ZSk7XG5cdFx0XHRcdFx0aWYgKHRoYXQuX2JDb250aW51ZURpc2NhcmQpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVqZWN0KFwiRGlzY2FyZCBvcGVyYXRpb24gd2FzIHJlamVjdGVkLiBEb2N1bWVudCBoYXMgbm90IGJlZW4gZGlzY2FyZGVkXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGF0Ll9vUG9wb3Zlci5kZXRhY2hBZnRlckNsb3NlKGZuT25BZnRlckRpc2NhcmQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZiAoIXRoYXQuX29Qb3BvdmVyKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1RleHQgPSBuZXcgVGV4dCh7XG5cdFx0XHRcdFx0XHRcdC8vVGhpcyB0ZXh0IGlzIHRoZSBzYW1lIGFzIExSIHYyLlxuXHRcdFx0XHRcdFx0XHQvL1RPRE86IERpc3BsYXkgbWVzc2FnZSBwcm92aWRlZCBieSBhcHAgZGV2ZWxvcGVyPz8/XG5cdFx0XHRcdFx0XHRcdHRleHQ6IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfRFJBRlRfRElTQ0FSRF9NRVNTQUdFXCIsIG9SZXNvdXJjZUJ1bmRsZSlcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0b0J1dHRvbiA9IG5ldyBCdXR0b24oe1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0RSQUZUX0RJU0NBUkRfQlVUVE9OXCIsIG9SZXNvdXJjZUJ1bmRsZSksXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiBcIjEwMCVcIixcblx0XHRcdFx0XHRcdFx0cHJlc3M6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGF0LmhhbmRsZVZhbGlkYXRpb25FcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdHRoYXQuX2JDb250aW51ZURpc2NhcmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdHRoYXQuX29Qb3BvdmVyLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGFyaWFMYWJlbGxlZEJ5OiBvVGV4dFxuXHRcdFx0XHRcdFx0fSBhcyBhbnkpO1xuXHRcdFx0XHRcdHRoYXQuX29Qb3BvdmVyID0gbmV3IFBvcG92ZXIoe1xuXHRcdFx0XHRcdFx0c2hvd0hlYWRlcjogZmFsc2UsXG5cdFx0XHRcdFx0XHRwbGFjZW1lbnQ6IFwiVG9wXCIsXG5cdFx0XHRcdFx0XHRjb250ZW50OiBbXG5cdFx0XHRcdFx0XHRcdG5ldyBWQm94KHtcblx0XHRcdFx0XHRcdFx0XHRpdGVtczogW29UZXh0LCBvQnV0dG9uXVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdGJlZm9yZU9wZW46IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0Ly8gbWFrZSBzdXJlIHRvIE5PVCB0cmlnZ2VyIG11bHRpcGxlIGNhbmNlbCBmbG93c1xuXHRcdFx0XHRcdFx0XHRvQ2FuY2VsQnV0dG9uLnNldEVuYWJsZWQoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR0aGF0Ll9vUG9wb3Zlci5zZXRJbml0aWFsRm9jdXMob0J1dHRvbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhhdC5fb1BvcG92ZXIuYWRkU3R5bGVDbGFzcyhcInNhcFVpQ29udGVudFBhZGRpbmdcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhhdC5fb1BvcG92ZXIuYXR0YWNoQWZ0ZXJDbG9zZShmbk9uQWZ0ZXJEaXNjYXJkKTtcblx0XHRcdFx0dGhhdC5fb1BvcG92ZXIub3BlbkJ5KG9DYW5jZWxCdXR0b24sIGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoYXQuaGFuZGxlVmFsaWRhdGlvbkVycm9yKCk7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHQvKipcblx0ICogU2V0cyB0aGUgZG9jdW1lbnQgdG8gbW9kaWZpZWQgc3RhdGUgb24gcGF0Y2ggZXZlbnQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAc3RhdGljXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyLmhhbmRsZURvY3VtZW50TW9kaWZpY2F0aW9uc1xuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuVHJhbnNhY3Rpb25IZWxwZXJcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0aGFuZGxlRG9jdW1lbnRNb2RpZmljYXRpb25zKCkge1xuXHRcdHRoaXMuX2JJc01vZGlmaWVkID0gdHJ1ZTtcblx0fVxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBvd25lciBjb21wb25lbnQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAc3RhdGljXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyLl9nZXRPd25lckNvbXBvbmVudFxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuVHJhbnNhY3Rpb25IZWxwZXJcblx0ICogQHJldHVybnMgVGhlIGFwcCBjb21wb25lbnRcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBmaW5hbFxuXHQgKi9cblx0X2dldEFwcENvbXBvbmVudCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fb0FwcENvbXBvbmVudDtcblx0fVxuXG5cdF9vbkZpZWxkQ2hhbmdlKG9FdmVudDogYW55LCBvQ3JlYXRlQnV0dG9uOiBhbnksIG1lc3NhZ2VIYW5kbGVyOiBNZXNzYWdlSGFuZGxlciwgZm5WYWxpZGF0ZVJlcXVpcmVkUHJvcGVydGllczogRnVuY3Rpb24pIHtcblx0XHRtZXNzYWdlSGFuZGxlci5yZW1vdmVUcmFuc2l0aW9uTWVzc2FnZXMoKTtcblx0XHRjb25zdCBvRmllbGQgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdFx0Y29uc3Qgb0ZpZWxkUHJvbWlzZSA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJwcm9taXNlXCIpO1xuXHRcdGlmIChvRmllbGRQcm9taXNlKSB7XG5cdFx0XHRyZXR1cm4gb0ZpZWxkUHJvbWlzZVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAodmFsdWU6IGFueSkge1xuXHRcdFx0XHRcdC8vIFNldHRpbmcgdmFsdWUgb2YgZmllbGQgYXMgJycgaW4gY2FzZSBvZiB2YWx1ZSBoZWxwIGFuZCB2YWxpZGF0aW5nIG90aGVyIGZpZWxkc1xuXHRcdFx0XHRcdG9GaWVsZC5zZXRWYWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdFx0Zm5WYWxpZGF0ZVJlcXVpcmVkUHJvcGVydGllcygpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG9GaWVsZC5nZXRWYWx1ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgIT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdC8vZGlzYWJsaW5nIHRoZSBjb250aW51ZSBidXR0b24gaW4gY2FzZSBvZiBpbnZhbGlkIHZhbHVlIGluIGZpZWxkXG5cdFx0XHRcdFx0XHRvQ3JlYXRlQnV0dG9uLnNldEVuYWJsZWQoZmFsc2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyB2YWxpZGF0aW5nIGFsbCB0aGUgZmllbGRzIGluIGNhc2Ugb2YgZW1wdHkgdmFsdWUgaW4gZmllbGRcblx0XHRcdFx0XHRcdG9GaWVsZC5zZXRWYWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRmblZhbGlkYXRlUmVxdWlyZWRQcm9wZXJ0aWVzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0X2dldE5vbkRlbGV0YWJsZVRleHQobVBhcmFtZXRlcnM6IGFueSwgdkNvbnRleHRzOiBhbnksIG9SZXNvdXJjZUJ1bmRsZTogYW55KSB7XG5cdFx0Y29uc3QgYU5vbkRlbGV0YWJsZUNvbnRleHRzID0gbVBhcmFtZXRlcnMubnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzIC0gdkNvbnRleHRzLmNvbmNhdChtUGFyYW1ldGVycy51blNhdmVkQ29udGV4dHMpLmxlbmd0aDtcblx0XHRyZXR1cm4gYU5vbkRlbGV0YWJsZUNvbnRleHRzID09PSAxXG5cdFx0XHQ/IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfQ09ORklSTV9ERUxFVEVfV0lUSF9PQkpFQ1RJTkZPX0FORF9PTkVfT0JKRUNUX05PTl9ERUxFVEFCTEVcIixcblx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0W21QYXJhbWV0ZXJzLm51bWJlck9mU2VsZWN0ZWRDb250ZXh0c11cblx0XHRcdCAgKVxuXHRcdFx0OiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcIkNfVFJBTlNBQ1RJT05fSEVMUEVSX0NPTkZJUk1fREVMRVRFX1dJVEhfT0JKRUNUSU5GT19BTkRfRkVXX09CSkVDVFNfTk9OX0RFTEVUQUJMRVwiLFxuXHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5udW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgLSB2Q29udGV4dHMuY29uY2F0KG1QYXJhbWV0ZXJzLnVuU2F2ZWRDb250ZXh0cykubGVuZ3RoLFxuXHRcdFx0XHRcdFx0bVBhcmFtZXRlcnMubnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzXG5cdFx0XHRcdFx0XVxuXHRcdFx0ICApO1xuXHR9XG5cblx0X2xhdW5jaERpYWxvZ1dpdGhLZXlGaWVsZHMoXG5cdFx0b0xpc3RCaW5kaW5nOiBPRGF0YUxpc3RCaW5kaW5nLFxuXHRcdG1GaWVsZHM6IGFueSxcblx0XHRvTW9kZWw6IE9EYXRhTW9kZWwsXG5cdFx0bVBhcmFtZXRlcnM6IGFueSxcblx0XHRtZXNzYWdlSGFuZGxlcjogTWVzc2FnZUhhbmRsZXJcblx0KSB7XG5cdFx0bGV0IG9EaWFsb2c6IERpYWxvZztcblx0XHRjb25zdCBvUGFyZW50Q29udHJvbCA9IG1QYXJhbWV0ZXJzLnBhcmVudENvbnRyb2w7XG5cblx0XHQvLyBDcmF0ZSBhIGZha2UgKHRyYW5zaWVudCkgbGlzdEJpbmRpbmcgYW5kIGNvbnRleHQsIGp1c3QgZm9yIHRoZSBiaW5kaW5nIGNvbnRleHQgb2YgdGhlIGRpYWxvZ1xuXHRcdGNvbnN0IG9UcmFuc2llbnRMaXN0QmluZGluZyA9IG9Nb2RlbC5iaW5kTGlzdChvTGlzdEJpbmRpbmcuZ2V0UGF0aCgpLCBvTGlzdEJpbmRpbmcuZ2V0Q29udGV4dCgpLCBbXSwgW10sIHtcblx0XHRcdCQkdXBkYXRlR3JvdXBJZDogXCJzdWJtaXRMYXRlclwiXG5cdFx0fSkgYXMgT0RhdGFMaXN0QmluZGluZztcblx0XHRvVHJhbnNpZW50TGlzdEJpbmRpbmcucmVmcmVzaEludGVybmFsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0LyogKi9cblx0XHR9O1xuXHRcdGNvbnN0IG9UcmFuc2llbnRDb250ZXh0ID0gb1RyYW5zaWVudExpc3RCaW5kaW5nLmNyZWF0ZShtUGFyYW1ldGVycy5kYXRhLCB0cnVlKTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjb25zdCBzRnJhZ21lbnROYW1lID0gXCJzYXAvZmUvY29yZS9jb250cm9scy9Ob25Db21wdXRlZFZpc2libGVLZXlGaWVsZHNEaWFsb2dcIjtcblx0XHRcdGNvbnN0IG9GcmFnbWVudCA9IFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShzRnJhZ21lbnROYW1lLCBcImZyYWdtZW50XCIpLFxuXHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUgPSBvUGFyZW50Q29udHJvbC5nZXRDb250cm9sbGVyKCkub1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0XHRhSW1tdXRhYmxlRmllbGRzOiBhbnlbXSA9IFtdLFxuXHRcdFx0XHRvQXBwQ29tcG9uZW50ID0gdGhpcy5fZ2V0QXBwQ29tcG9uZW50KCksXG5cdFx0XHRcdHNQYXRoID0gKG9MaXN0QmluZGluZy5pc1JlbGF0aXZlKCkgPyBvTGlzdEJpbmRpbmcuZ2V0UmVzb2x2ZWRQYXRoKCkgOiBvTGlzdEJpbmRpbmcuZ2V0UGF0aCgpKSBhcyBzdHJpbmcsXG5cdFx0XHRcdG9FbnRpdHlTZXRDb250ZXh0ID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzUGF0aCkgYXMgQ29udGV4dCxcblx0XHRcdFx0c01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChzUGF0aCk7XG5cdFx0XHRmb3IgKGNvbnN0IGkgaW4gbUZpZWxkcykge1xuXHRcdFx0XHRhSW1tdXRhYmxlRmllbGRzLnB1c2gob01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChgJHtzTWV0YVBhdGh9LyR7bUZpZWxkc1tpXX1gKSk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBvSW1tdXRhYmxlQ3R4TW9kZWwgPSBuZXcgSlNPTk1vZGVsKGFJbW11dGFibGVGaWVsZHMpO1xuXHRcdFx0Y29uc3Qgb0ltbXV0YWJsZUN0eCA9IG9JbW11dGFibGVDdHhNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIikgYXMgQ29udGV4dDtcblx0XHRcdGNvbnN0IGFSZXF1aXJlZFByb3BlcnRpZXMgPSBDb21tb25VdGlscy5nZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zKHNNZXRhUGF0aCwgb01ldGFNb2RlbCk7XG5cdFx0XHRjb25zdCBvUmVxdWlyZWRQcm9wZXJ0eVBhdGhzQ3R4TW9kZWwgPSBuZXcgSlNPTk1vZGVsKGFSZXF1aXJlZFByb3BlcnRpZXMpO1xuXHRcdFx0Y29uc3Qgb1JlcXVpcmVkUHJvcGVydHlQYXRoc0N0eCA9IG9SZXF1aXJlZFByb3BlcnR5UGF0aHNDdHhNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIikgYXMgQ29udGV4dDtcblx0XHRcdGNvbnN0IG9OZXdGcmFnbWVudCA9IGF3YWl0IFhNTFByZXByb2Nlc3Nvci5wcm9jZXNzKFxuXHRcdFx0XHRvRnJhZ21lbnQsXG5cdFx0XHRcdHsgbmFtZTogc0ZyYWdtZW50TmFtZSB9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XHRlbnRpdHlTZXQ6IG9FbnRpdHlTZXRDb250ZXh0LFxuXHRcdFx0XHRcdFx0ZmllbGRzOiBvSW1tdXRhYmxlQ3R4LFxuXHRcdFx0XHRcdFx0cmVxdWlyZWRQcm9wZXJ0aWVzOiBvUmVxdWlyZWRQcm9wZXJ0eVBhdGhzQ3R4XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtb2RlbHM6IHtcblx0XHRcdFx0XHRcdGVudGl0eVNldDogb0VudGl0eVNldENvbnRleHQuZ2V0TW9kZWwoKSxcblx0XHRcdFx0XHRcdGZpZWxkczogb0ltbXV0YWJsZUN0eC5nZXRNb2RlbCgpLFxuXHRcdFx0XHRcdFx0bWV0YU1vZGVsOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0cmVxdWlyZWRQcm9wZXJ0aWVzOiBvUmVxdWlyZWRQcm9wZXJ0eVBhdGhzQ3R4TW9kZWxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGxldCBhRm9ybUVsZW1lbnRzOiBhbnlbXSA9IFtdO1xuXHRcdFx0Y29uc3QgbUZpZWxkVmFsdWVNYXA6IGFueSA9IHt9O1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuXHRcdFx0bGV0IG9DcmVhdGVCdXR0b246IEJ1dHRvbjtcblxuXHRcdFx0Y29uc3QgdmFsaWRhdGVSZXF1aXJlZFByb3BlcnRpZXMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGxldCBiRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IGFSZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0XHRhRm9ybUVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdC5tYXAoZnVuY3Rpb24gKG9Gb3JtRWxlbWVudDogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9Gb3JtRWxlbWVudC5nZXRGaWVsZHMoKVswXTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAob0ZpZWxkOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBUaGUgY29udGludWUgYnV0dG9uIHNob3VsZCByZW1haW4gZGlzYWJsZWQgaW4gY2FzZSBvZiBlbXB0eSByZXF1aXJlZCBmaWVsZHMuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9GaWVsZC5nZXRSZXF1aXJlZCgpIHx8IG9GaWVsZC5nZXRWYWx1ZVN0YXRlKCkgPT09IFZhbHVlU3RhdGUuRXJyb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5tYXAoYXN5bmMgZnVuY3Rpb24gKG9GaWVsZDogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc0ZpZWxkSWQgPSBvRmllbGQuZ2V0SWQoKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc0ZpZWxkSWQgaW4gbUZpZWxkVmFsdWVNYXApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHZWYWx1ZSA9IGF3YWl0IG1GaWVsZFZhbHVlTWFwW3NGaWVsZElkXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9GaWVsZC5nZXRWYWx1ZSgpID09PSBcIlwiID8gdW5kZWZpbmVkIDogdlZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBvRmllbGQuZ2V0VmFsdWUoKSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IG9GaWVsZC5nZXRWYWx1ZSgpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YkVuYWJsZWQgPSBhUmVzdWx0cy5ldmVyeShmdW5jdGlvbiAodlZhbHVlOiBhbnkpIHtcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0dlZhbHVlID0gdlZhbHVlWzBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZWYWx1ZSAhPT0gbnVsbCAmJiB2VmFsdWUgIT09IFwiXCI7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdGJFbmFibGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0b0NyZWF0ZUJ1dHRvbi5zZXRFbmFibGVkKGJFbmFibGVkKTtcblx0XHRcdH07XG5cdFx0XHRjb25zdCBvQ29udHJvbGxlciA9IHtcblx0XHRcdFx0Lypcblx0XHRcdFx0XHRcdFx0XHRcdGZpcmVkIG9uIGZvY3VzIG91dCBmcm9tIGZpZWxkIG9yIG9uIHNlbGVjdGluZyBhIHZhbHVlIGZyb20gdGhlIHZhbHVlaGVscC5cblx0XHRcdFx0XHRcdFx0XHRcdHRoZSBjcmVhdGUgYnV0dG9uIGlzIGVuYWJsZWQgd2hlbiBhIHZhbHVlIGlzIGFkZGVkLlxuXHRcdFx0XHRcdFx0XHRcdFx0bGl2ZUNoYW5nZSBpcyBub3QgZmlyZWQgd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIHZhbHVlaGVscC5cblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlIHZhbGlkYXRpb24gaXMgbm90IGRvbmUgZm9yIGNyZWF0ZSBidXR0b24gZW5hYmxlbWVudC5cblx0XHRcdFx0XHRcdFx0XHQqL1xuXHRcdFx0XHRoYW5kbGVDaGFuZ2U6IChvRXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHNGaWVsZElkID0gb0V2ZW50LmdldFBhcmFtZXRlcihcImlkXCIpO1xuXHRcdFx0XHRcdG1GaWVsZFZhbHVlTWFwW3NGaWVsZElkXSA9IHRoaXMuX29uRmllbGRDaGFuZ2Uob0V2ZW50LCBvQ3JlYXRlQnV0dG9uLCBtZXNzYWdlSGFuZGxlciwgdmFsaWRhdGVSZXF1aXJlZFByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQvKlxuXHRcdFx0XHRcdFx0XHRcdFx0ZmlyZWQgb24ga2V5IHByZXNzLiB0aGUgY3JlYXRlIGJ1dHRvbiBpcyBlbmFibGVkIHdoZW4gYSB2YWx1ZSBpcyBhZGRlZC5cblx0XHRcdFx0XHRcdFx0XHRcdGxpdmVDaGFuZ2UgaXMgbm90IGZpcmVkIHdoZW4gdmFsdWUgaXMgYWRkZWQgZnJvbSB2YWx1ZWhlbHAuXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSB2YWxpZGF0aW9uIGlzIG5vdCBkb25lIGZvciBjcmVhdGUgYnV0dG9uIGVuYWJsZW1lbnQuXG5cdFx0XHRcdFx0XHRcdFx0Ki9cblx0XHRcdFx0aGFuZGxlTGl2ZUNoYW5nZTogKG9FdmVudDogYW55KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc0ZpZWxkSWQgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiaWRcIik7XG5cdFx0XHRcdFx0Y29uc3QgdlZhbHVlID0gb0V2ZW50LmdldFBhcmFtZXRlcihcInZhbHVlXCIpO1xuXHRcdFx0XHRcdG1GaWVsZFZhbHVlTWFwW3NGaWVsZElkXSA9IHZWYWx1ZTtcblx0XHRcdFx0XHR2YWxpZGF0ZVJlcXVpcmVkUHJvcGVydGllcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBvRGlhbG9nQ29udGVudDogYW55ID0gYXdhaXQgRnJhZ21lbnQubG9hZCh7XG5cdFx0XHRcdGRlZmluaXRpb246IG9OZXdGcmFnbWVudCxcblx0XHRcdFx0Y29udHJvbGxlcjogb0NvbnRyb2xsZXJcblx0XHRcdH0pO1xuXHRcdFx0bGV0IG9SZXN1bHQ6IGFueTtcblxuXHRcdFx0b0RpYWxvZyA9IG5ldyBEaWFsb2coe1xuXHRcdFx0XHR0aXRsZTogQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9TQVBGRV9BQ1RJT05fQ1JFQVRFXCIsIG9SZXNvdXJjZUJ1bmRsZSksXG5cdFx0XHRcdGNvbnRlbnQ6IFtvRGlhbG9nQ29udGVudF0sXG5cdFx0XHRcdGJlZ2luQnV0dG9uOiB7XG5cdFx0XHRcdFx0dGV4dDogQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX1RSQU5TQUNUSU9OX0hFTFBFUl9TQVBGRV9BQ1RJT05fQ1JFQVRFX0JVVFRPTlwiLCBvUmVzb3VyY2VCdW5kbGUpLFxuXHRcdFx0XHRcdHR5cGU6IFwiRW1waGFzaXplZFwiLFxuXHRcdFx0XHRcdHByZXNzOiBhc3luYyAob0V2ZW50OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGNyZWF0ZUJ1dHRvbiA9IG9FdmVudC5nZXRTb3VyY2UoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZUJ1dHRvbi5zZXRFbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHRcdEJ1c3lMb2NrZXIubG9jayhvRGlhbG9nKTtcblx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmJJc0NyZWF0ZURpYWxvZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBhVmFsdWVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0XHRcdFx0T2JqZWN0LmtleXMobUZpZWxkVmFsdWVNYXApLm1hcChhc3luYyBmdW5jdGlvbiAoc0tleTogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBvVmFsdWUgPSBhd2FpdCBtRmllbGRWYWx1ZU1hcFtzS2V5XTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9EaWFsb2dWYWx1ZTogYW55ID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRvRGlhbG9nVmFsdWVbc0tleV0gPSBvVmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb0RpYWxvZ1ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdGlmIChtUGFyYW1ldGVycy5iZWZvcmVDcmVhdGVDYWxsQmFjaykge1xuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IHRvRVM2UHJvbWlzZShcblx0XHRcdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmJlZm9yZUNyZWF0ZUNhbGxCYWNrKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGV4dFBhdGg6IG9MaXN0QmluZGluZyAmJiBvTGlzdEJpbmRpbmcuZ2V0UGF0aCgpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVQYXJhbWV0ZXJzOiBhVmFsdWVzXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y29uc3QgdHJhbnNpZW50RGF0YSA9IG9UcmFuc2llbnRDb250ZXh0LmdldE9iamVjdCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjcmVhdGVEYXRhOiBhbnkgPSB7fTtcblx0XHRcdFx0XHRcdFx0T2JqZWN0LmtleXModHJhbnNpZW50RGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoc1Byb3BlcnR5UGF0aDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb1Byb3BlcnR5ID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofS8ke3NQcm9wZXJ0eVBhdGh9YCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gZW5zdXJlIG5hdmlnYXRpb24gcHJvcGVydGllcyBhcmUgbm90IHBhcnQgb2YgdGhlIHBheWxvYWQsIGRlZXAgY3JlYXRlIG5vdCBzdXBwb3J0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiAob1Byb3BlcnR5ICYmIG9Qcm9wZXJ0eS4ka2luZCA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRjcmVhdGVEYXRhW3NQcm9wZXJ0eVBhdGhdID0gdHJhbnNpZW50RGF0YVtzUHJvcGVydHlQYXRoXTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9OZXdEb2N1bWVudENvbnRleHQgPSBvTGlzdEJpbmRpbmcuY3JlYXRlKFxuXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZURhdGEsXG5cdFx0XHRcdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5jcmVhdGVBdEVuZCxcblx0XHRcdFx0XHRcdFx0XHRtUGFyYW1ldGVycy5pbmFjdGl2ZVxuXHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9Qcm9taXNlID0gdGhpcy5vbkFmdGVyQ3JlYXRlQ29tcGxldGlvbihvTGlzdEJpbmRpbmcsIG9OZXdEb2N1bWVudENvbnRleHQsIG1QYXJhbWV0ZXJzKTtcblx0XHRcdFx0XHRcdFx0bGV0IG9SZXNwb25zZTogYW55ID0gYXdhaXQgb1Byb21pc2U7XG5cdFx0XHRcdFx0XHRcdGlmICghb1Jlc3BvbnNlIHx8IChvUmVzcG9uc2UgJiYgb1Jlc3BvbnNlLmJLZWVwRGlhbG9nT3BlbiAhPT0gdHJ1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRvUmVzcG9uc2UgPSBvUmVzcG9uc2UgPz8ge307XG5cdFx0XHRcdFx0XHRcdFx0b0RpYWxvZy5zZXRCaW5kaW5nQ29udGV4dChudWxsIGFzIGFueSk7XG5cdFx0XHRcdFx0XHRcdFx0b1Jlc3BvbnNlLm5ld0NvbnRleHQgPSBvTmV3RG9jdW1lbnRDb250ZXh0O1xuXHRcdFx0XHRcdFx0XHRcdG9SZXN1bHQgPSB7IHJlc3BvbnNlOiBvUmVzcG9uc2UgfTtcblx0XHRcdFx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRcdC8vIGluIGNhc2Ugb2YgY3JlYXRpb24gZmFpbGVkLCBkaWFsb2cgc2hvdWxkIHN0YXkgb3BlbiAtIHRvIGFjaGlldmUgdGhlIHNhbWUsIG5vdGhpbmcgaGFzIHRvIGJlIGRvbmUgKGxpa2UgaW4gY2FzZSBvZiBzdWNjZXNzIHdpdGggYktlZXBEaWFsb2dPcGVuKVxuXHRcdFx0XHRcdFx0XHRpZiAob0Vycm9yICE9PSBGRUxpYnJhcnkuQ29uc3RhbnRzLkNyZWF0aW9uRmFpbGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gb3RoZXIgZXJyb3JzIGFyZSBub3QgZXhwZWN0ZWRcblx0XHRcdFx0XHRcdFx0XHRvUmVzdWx0ID0geyBlcnJvcjogb0Vycm9yIH07XG5cdFx0XHRcdFx0XHRcdFx0b0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdFx0XHRCdXN5TG9ja2VyLnVubG9jayhvRGlhbG9nKTtcblx0XHRcdFx0XHRcdFx0Y3JlYXRlQnV0dG9uLnNldEVuYWJsZWQodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlcygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZW5kQnV0dG9uOiB7XG5cdFx0XHRcdFx0dGV4dDogQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX0NPTU1PTl9BQ1RJT05fUEFSQU1FVEVSX0RJQUxPR19DQU5DRUxcIiwgb1Jlc291cmNlQnVuZGxlKSxcblx0XHRcdFx0XHRwcmVzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0b1Jlc3VsdCA9IHsgZXJyb3I6IEZFTGlicmFyeS5Db25zdGFudHMuQ2FuY2VsQWN0aW9uRGlhbG9nIH07XG5cdFx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZnRlckNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gc2hvdyBmb290ZXIgYXMgcGVyIFVYIGd1aWRlbGluZXMgd2hlbiBkaWFsb2cgaXMgbm90IG9wZW5cblx0XHRcdFx0XHQob0RpYWxvZy5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0KT8uc2V0UHJvcGVydHkoXCJpc0NyZWF0ZURpYWxvZ09wZW5cIiwgZmFsc2UpO1xuXHRcdFx0XHRcdG9EaWFsb2cuZGVzdHJveSgpO1xuXHRcdFx0XHRcdG9UcmFuc2llbnRMaXN0QmluZGluZy5kZXN0cm95KCk7XG5cdFx0XHRcdFx0aWYgKG9SZXN1bHQuZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChvUmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShvUmVzdWx0LnJlc3BvbnNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gYXMgYW55KTtcblx0XHRcdGFGb3JtRWxlbWVudHMgPSBvRGlhbG9nQ29udGVudD8uZ2V0QWdncmVnYXRpb24oXCJmb3JtXCIpLmdldEFnZ3JlZ2F0aW9uKFwiZm9ybUNvbnRhaW5lcnNcIilbMF0uZ2V0QWdncmVnYXRpb24oXCJmb3JtRWxlbWVudHNcIik7XG5cdFx0XHRpZiAob1BhcmVudENvbnRyb2wgJiYgb1BhcmVudENvbnRyb2wuYWRkRGVwZW5kZW50KSB7XG5cdFx0XHRcdC8vIGlmIHRoZXJlIGlzIGEgcGFyZW50IGNvbnRyb2wgc3BlY2lmaWVkIGFkZCB0aGUgZGlhbG9nIGFzIGRlcGVuZGVudFxuXHRcdFx0XHRvUGFyZW50Q29udHJvbC5hZGREZXBlbmRlbnQob0RpYWxvZyk7XG5cdFx0XHR9XG5cdFx0XHRvQ3JlYXRlQnV0dG9uID0gb0RpYWxvZy5nZXRCZWdpbkJ1dHRvbigpO1xuXHRcdFx0b0RpYWxvZy5zZXRCaW5kaW5nQ29udGV4dChvVHJhbnNpZW50Q29udGV4dCk7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBDb21tb25VdGlscy5zZXRVc2VyRGVmYXVsdHMoXG5cdFx0XHRcdFx0b0FwcENvbXBvbmVudCxcblx0XHRcdFx0XHRhSW1tdXRhYmxlRmllbGRzLFxuXHRcdFx0XHRcdG9UcmFuc2llbnRDb250ZXh0LFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzLmNyZWF0ZUFjdGlvbixcblx0XHRcdFx0XHRtUGFyYW1ldGVycy5kYXRhXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHZhbGlkYXRlUmVxdWlyZWRQcm9wZXJ0aWVzKCk7XG5cdFx0XHRcdC8vIGZvb3RlciBtdXN0IG5vdCBiZSB2aXNpYmxlIHdoZW4gdGhlIGRpYWxvZyBpcyBvcGVuIGFzIHBlciBVWCBndWlkZWxpbmVzXG5cdFx0XHRcdChvRGlhbG9nLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQpLnNldFByb3BlcnR5KFwiaXNDcmVhdGVEaWFsb2dPcGVuXCIsIHRydWUpO1xuXHRcdFx0XHRvRGlhbG9nLm9wZW4oKTtcblx0XHRcdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdGF3YWl0IG1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlcygpO1xuXHRcdFx0XHR0aHJvdyBvRXJyb3I7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0b25BZnRlckNyZWF0ZUNvbXBsZXRpb24ob0xpc3RCaW5kaW5nOiBhbnksIG9OZXdEb2N1bWVudENvbnRleHQ6IGFueSwgbVBhcmFtZXRlcnM6IGFueSkge1xuXHRcdGxldCBmblJlc29sdmU6IEZ1bmN0aW9uO1xuXHRcdGNvbnN0IG9Qcm9taXNlID0gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUpID0+IHtcblx0XHRcdGZuUmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0fSk7XG5cblx0XHRjb25zdCBmbkNyZWF0ZUNvbXBsZXRlZCA9IChvRXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0Y29uc3Qgb0NvbnRleHQgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiY29udGV4dFwiKSxcblx0XHRcdFx0YlN1Y2Nlc3MgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwic3VjY2Vzc1wiKTtcblx0XHRcdGlmIChvQ29udGV4dCA9PT0gb05ld0RvY3VtZW50Q29udGV4dCkge1xuXHRcdFx0XHRvTGlzdEJpbmRpbmcuZGV0YWNoQ3JlYXRlQ29tcGxldGVkKGZuQ3JlYXRlQ29tcGxldGVkLCB0aGlzKTtcblx0XHRcdFx0Zm5SZXNvbHZlKGJTdWNjZXNzKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGNvbnN0IGZuU2FmZUNvbnRleHRDcmVhdGVkID0gKCkgPT4ge1xuXHRcdFx0b05ld0RvY3VtZW50Q29udGV4dFxuXHRcdFx0XHQuY3JlYXRlZCgpXG5cdFx0XHRcdC50aGVuKHVuZGVmaW5lZCwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdExvZy50cmFjZShcInRyYW5zaWVudCBjcmVhdGlvbiBjb250ZXh0IGRlbGV0ZWRcIik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoY29udGV4dEVycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cudHJhY2UoXCJ0cmFuc2llbnQgY3JlYXRpb24gY29udGV4dCBkZWxldGlvbiBlcnJvclwiLCBjb250ZXh0RXJyb3IpO1xuXHRcdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0b0xpc3RCaW5kaW5nLmF0dGFjaENyZWF0ZUNvbXBsZXRlZChmbkNyZWF0ZUNvbXBsZXRlZCwgdGhpcyk7XG5cblx0XHRyZXR1cm4gb1Byb21pc2UudGhlbigoYlN1Y2Nlc3M6IGJvb2xlYW4pID0+IHtcblx0XHRcdGlmICghYlN1Y2Nlc3MpIHtcblx0XHRcdFx0aWYgKCFtUGFyYW1ldGVycy5rZWVwVHJhbnNpZW50Q29udGV4dE9uRmFpbGVkKSB7XG5cdFx0XHRcdFx0Ly8gQ2FuY2VsIHRoZSBwZW5kaW5nIFBPU1QgYW5kIGRlbGV0ZSB0aGUgY29udGV4dCBpbiB0aGUgbGlzdEJpbmRpbmdcblx0XHRcdFx0XHRmblNhZmVDb250ZXh0Q3JlYXRlZCgpOyAvLyBUbyBhdm9pZCBhICdyZXF1ZXN0IGNhbmNlbGxlZCcgZXJyb3IgaW4gdGhlIGNvbnNvbGVcblx0XHRcdFx0XHRvTGlzdEJpbmRpbmcucmVzZXRDaGFuZ2VzKCk7XG5cdFx0XHRcdFx0b0xpc3RCaW5kaW5nLmdldE1vZGVsKCkucmVzZXRDaGFuZ2VzKG9MaXN0QmluZGluZy5nZXRVcGRhdGVHcm91cElkKCkpO1xuXG5cdFx0XHRcdFx0dGhyb3cgRkVMaWJyYXJ5LkNvbnN0YW50cy5DcmVhdGlvbkZhaWxlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4geyBiS2VlcERpYWxvZ09wZW46IHRydWUgfTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBvTmV3RG9jdW1lbnRDb250ZXh0LmNyZWF0ZWQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBuYW1lIG9mIHRoZSBOZXdBY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAc3RhdGljXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBuYW1lIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyLl9nZXROZXdBY3Rpb25cblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBwYXJhbSBvU3RhcnR1cFBhcmFtZXRlcnMgU3RhcnR1cCBwYXJhbWV0ZXJzIG9mIHRoZSBhcHBsaWNhdGlvblxuXHQgKiBAcGFyYW0gc0NyZWF0ZUhhc2ggSGFzaCB0byBiZSBjaGVja2VkIGZvciBhY3Rpb24gdHlwZVxuXHQgKiBAcGFyYW0gb01ldGFNb2RlbCBUaGUgTWV0YU1vZGVsIHVzZWQgdG8gY2hlY2sgZm9yIE5ld0FjdGlvbiBwYXJhbWV0ZXJcblx0ICogQHBhcmFtIHNNZXRhUGF0aCBUaGUgTWV0YVBhdGhcblx0ICogQHJldHVybnMgVGhlIG5hbWUgb2YgdGhlIGFjdGlvblxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQGZpbmFsXG5cdCAqL1xuXHRfZ2V0TmV3QWN0aW9uKG9TdGFydHVwUGFyYW1ldGVyczogYW55LCBzQ3JlYXRlSGFzaDogc3RyaW5nLCBvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCwgc01ldGFQYXRoOiBzdHJpbmcpIHtcblx0XHRsZXQgc05ld0FjdGlvbjtcblxuXHRcdGlmIChvU3RhcnR1cFBhcmFtZXRlcnMgJiYgb1N0YXJ0dXBQYXJhbWV0ZXJzLnByZWZlcnJlZE1vZGUgJiYgc0NyZWF0ZUhhc2gudG9VcHBlckNhc2UoKS5pbmRleE9mKFwiSS1BQ1RJT049Q1JFQVRFV0lUSFwiKSA+IC0xKSB7XG5cdFx0XHRjb25zdCBzUHJlZmVycmVkTW9kZSA9IG9TdGFydHVwUGFyYW1ldGVycy5wcmVmZXJyZWRNb2RlWzBdO1xuXHRcdFx0c05ld0FjdGlvbiA9XG5cdFx0XHRcdHNQcmVmZXJyZWRNb2RlLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihcIkNSRUFURVdJVEg6XCIpID4gLTFcblx0XHRcdFx0XHQ/IHNQcmVmZXJyZWRNb2RlLnN1YnN0cihzUHJlZmVycmVkTW9kZS5sYXN0SW5kZXhPZihcIjpcIikgKyAxKVxuXHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRvU3RhcnR1cFBhcmFtZXRlcnMgJiZcblx0XHRcdG9TdGFydHVwUGFyYW1ldGVycy5wcmVmZXJyZWRNb2RlICYmXG5cdFx0XHRzQ3JlYXRlSGFzaC50b1VwcGVyQ2FzZSgpLmluZGV4T2YoXCJJLUFDVElPTj1BVVRPQ1JFQVRFV0lUSFwiKSA+IC0xXG5cdFx0KSB7XG5cdFx0XHRjb25zdCBzUHJlZmVycmVkTW9kZSA9IG9TdGFydHVwUGFyYW1ldGVycy5wcmVmZXJyZWRNb2RlWzBdO1xuXHRcdFx0c05ld0FjdGlvbiA9XG5cdFx0XHRcdHNQcmVmZXJyZWRNb2RlLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihcIkFVVE9DUkVBVEVXSVRIOlwiKSA+IC0xXG5cdFx0XHRcdFx0PyBzUHJlZmVycmVkTW9kZS5zdWJzdHIoc1ByZWZlcnJlZE1vZGUubGFzdEluZGV4T2YoXCI6XCIpICsgMSlcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c05ld0FjdGlvbiA9XG5cdFx0XHRcdG9NZXRhTW9kZWwgJiYgb01ldGFNb2RlbC5nZXRPYmplY3QgIT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdD8gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxLlN0aWNreVNlc3Npb25TdXBwb3J0ZWQvTmV3QWN0aW9uYCkgfHxcblx0XHRcdFx0XHQgIG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhUGF0aH1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdC9OZXdBY3Rpb25gKVxuXHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRyZXR1cm4gc05ld0FjdGlvbjtcblx0fVxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBsYWJlbCBmb3IgdGhlIHRpdGxlIG9mIGEgc3BlY2lmaWMgY3JlYXRlIGFjdGlvbiBkaWFsb2csIGUuZy4gQ3JlYXRlIFNhbGVzIE9yZGVyIGZyb20gUXVvdGF0aW9uLlxuXHQgKlxuXHQgKiBUaGUgZm9sbG93aW5nIHByaW9yaXR5IGlzIGFwcGxpZWQ6XG5cdCAqIDEuIGxhYmVsIG9mIGxpbmUtaXRlbSBhbm5vdGF0aW9uLlxuXHQgKiAyLiBsYWJlbCBhbm5vdGF0ZWQgaW4gdGhlIGFjdGlvbi5cblx0ICogMy4gXCJDcmVhdGVcIiBhcyBhIGNvbnN0YW50IGZyb20gaTE4bi5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBzdGF0aWNcblx0ICogQHByaXZhdGVcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuVHJhbnNhY3Rpb25IZWxwZXIuX2dldFNwZWNpZmljQ3JlYXRlQWN0aW9uRGlhbG9nTGFiZWxcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLlRyYW5zYWN0aW9uSGVscGVyXG5cdCAqIEBwYXJhbSBvTWV0YU1vZGVsIFRoZSBNZXRhTW9kZWwgdXNlZCB0byBjaGVjayBmb3IgdGhlIE5ld0FjdGlvbiBwYXJhbWV0ZXJcblx0ICogQHBhcmFtIHNNZXRhUGF0aCBUaGUgTWV0YVBhdGhcblx0ICogQHBhcmFtIHNOZXdBY3Rpb24gQ29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIGFjdGlvbiB0byBiZSBleGVjdXRlZFxuXHQgKiBAcGFyYW0gb1Jlc291cmNlQnVuZGxlQ29yZSBSZXNvdXJjZUJ1bmRsZSB0byBhY2Nlc3MgdGhlIGRlZmF1bHQgQ3JlYXRlIGxhYmVsXG5cdCAqIEByZXR1cm5zIFRoZSBsYWJlbCBmb3IgdGhlIENyZWF0ZSBBY3Rpb24gRGlhbG9nXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAZmluYWxcblx0ICovXG5cdF9nZXRTcGVjaWZpY0NyZWF0ZUFjdGlvbkRpYWxvZ0xhYmVsKFxuXHRcdG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLFxuXHRcdHNNZXRhUGF0aDogc3RyaW5nLFxuXHRcdHNOZXdBY3Rpb246IHN0cmluZyxcblx0XHRvUmVzb3VyY2VCdW5kbGVDb3JlOiBSZXNvdXJjZUJ1bmRsZVxuXHQpIHtcblx0XHRjb25zdCBmbkdldExhYmVsRnJvbUxpbmVJdGVtQW5ub3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChvTWV0YU1vZGVsICYmIG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhUGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtYCkpIHtcblx0XHRcdFx0Y29uc3QgaUxpbmVJdGVtSW5kZXggPSBvTWV0YU1vZGVsXG5cdFx0XHRcdFx0LmdldE9iamVjdChgJHtzTWV0YVBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbWApXG5cdFx0XHRcdFx0LmZpbmRJbmRleChmdW5jdGlvbiAob0xpbmVJdGVtOiBhbnkpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGFMaW5lSXRlbUFjdGlvbiA9IG9MaW5lSXRlbS5BY3Rpb24gPyBvTGluZUl0ZW0uQWN0aW9uLnNwbGl0KFwiKFwiKSA6IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdHJldHVybiBhTGluZUl0ZW1BY3Rpb24gPyBhTGluZUl0ZW1BY3Rpb25bMF0gPT09IHNOZXdBY3Rpb24gOiBmYWxzZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGlMaW5lSXRlbUluZGV4ID4gLTFcblx0XHRcdFx0XHQ/IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhUGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtYClbaUxpbmVJdGVtSW5kZXhdLkxhYmVsXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0Zm5HZXRMYWJlbEZyb21MaW5lSXRlbUFubm90YXRpb24oKSB8fFxuXHRcdFx0KG9NZXRhTW9kZWwgJiYgb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofS8ke3NOZXdBY3Rpb259QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5MYWJlbGApKSB8fFxuXHRcdFx0KG9SZXNvdXJjZUJ1bmRsZUNvcmUgJiYgb1Jlc291cmNlQnVuZGxlQ29yZS5nZXRUZXh0KFwiQ19UUkFOU0FDVElPTl9IRUxQRVJfU0FQRkVfQUNUSU9OX0NSRUFURVwiKSlcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uSGVscGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBa2pCTyxnQkFBZ0JBLElBQWhCLEVBQXNCQyxPQUF0QixFQUErQjtJQUNyQyxJQUFJO01BQ0gsSUFBSUMsTUFBTSxHQUFHRixJQUFJLEVBQWpCO0lBQ0EsQ0FGRCxD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