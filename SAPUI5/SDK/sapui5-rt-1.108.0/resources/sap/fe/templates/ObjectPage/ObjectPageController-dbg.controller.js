/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/fe/core/ActionRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/collaboration/ActivitySync", "sap/fe/core/controllerextensions/collaboration/Manage", "sap/fe/core/controllerextensions/EditFlow", "sap/fe/core/controllerextensions/editFlow/draft", "sap/fe/core/controllerextensions/IntentBasedNavigation", "sap/fe/core/controllerextensions/InternalEditFlow", "sap/fe/core/controllerextensions/InternalIntentBasedNavigation", "sap/fe/core/controllerextensions/InternalRouting", "sap/fe/core/controllerextensions/MassEdit", "sap/fe/core/controllerextensions/MessageHandler", "sap/fe/core/controllerextensions/PageReady", "sap/fe/core/controllerextensions/Paginator", "sap/fe/core/controllerextensions/Placeholder", "sap/fe/core/controllerextensions/Share", "sap/fe/core/controllerextensions/ViewState", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/PageController", "sap/fe/macros/chart/ChartRuntime", "sap/fe/macros/CommonHelper", "sap/fe/macros/DelegateUtil", "sap/fe/macros/table/Utils", "sap/fe/navigation/SelectionVariant", "sap/fe/templates/ObjectPage/ExtensionAPI", "sap/fe/templates/RootContainer/overrides/EditFlow", "sap/fe/templates/TableScroller", "sap/m/InstanceManager", "sap/m/Link", "sap/m/MessageBox", "sap/ui/core/Core", "sap/ui/core/mvc/OverrideExecution", "sap/ui/model/odata/v4/ODataListBinding", "./overrides/IntentBasedNavigation", "./overrides/InternalRouting", "./overrides/MessageHandler", "./overrides/Paginator", "./overrides/Share", "./overrides/ViewState"], function (Log, merge, ActionRuntime, CommonUtils, BusyLocker, ActivitySync, Manage, EditFlow, draft, IntentBasedNavigation, InternalEditFlow, InternalIntentBasedNavigation, InternalRouting, MassEdit, MessageHandler, PageReady, Paginator, Placeholder, Share, ViewState, MetaModelConverter, ClassSupport, ModelHelper, PageController, ChartRuntime, CommonHelper, DelegateUtil, TableUtils, SelectionVariant, ExtensionAPI, EditFlowOverrides, TableScroller, InstanceManager, Link, MessageBox, Core, OverrideExecution, ODataListBinding, IntentBasedNavigationOverride, InternalRoutingOverride, MessageHandlerOverride, PaginatorOverride, ShareOverrides, ViewStateOverrides) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;

  var usingExtension = ClassSupport.usingExtension;
  var publicExtension = ClassSupport.publicExtension;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var showUserDetails = Manage.showUserDetails;
  var openManageDialog = Manage.openManageDialog;
  var isConnected = ActivitySync.isConnected;
  var disconnect = ActivitySync.disconnect;
  var connect = ActivitySync.connect;

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

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var ObjectPageController = (_dec = defineUI5Class("sap.fe.templates.ObjectPage.ObjectPageController"), _dec2 = usingExtension(Placeholder), _dec3 = usingExtension(EditFlow), _dec4 = usingExtension(Share.override(ShareOverrides)), _dec5 = usingExtension(InternalEditFlow.override(EditFlowOverrides)), _dec6 = usingExtension(InternalRouting.override(InternalRoutingOverride)), _dec7 = usingExtension(Paginator.override(PaginatorOverride)), _dec8 = usingExtension(MessageHandler.override(MessageHandlerOverride)), _dec9 = usingExtension(IntentBasedNavigation.override(IntentBasedNavigationOverride)), _dec10 = usingExtension(InternalIntentBasedNavigation.override({
    getNavigationMode: function () {
      var bIsStickyEditMode = this.getView().getController().getStickyEditMode && this.getView().getController().getStickyEditMode();
      return bIsStickyEditMode ? "explace" : undefined;
    }
  })), _dec11 = usingExtension(ViewState.override(ViewStateOverrides)), _dec12 = usingExtension(PageReady.override({
    isContextExpected: function () {
      return true;
    }
  })), _dec13 = usingExtension(MassEdit), _dec14 = publicExtension(), _dec15 = finalExtension(), _dec16 = publicExtension(), _dec17 = extensible(OverrideExecution.After), _dec(_class = (_class2 = /*#__PURE__*/function (_PageController) {
    _inheritsLoose(ObjectPageController, _PageController);

    function ObjectPageController() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _PageController.call.apply(_PageController, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "placeholder", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "editFlow", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "share", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_editFlow", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_routing", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "paginator", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "messageHandler", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "intentBasedNavigation", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_intentBasedNavigation", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "viewState", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "pageReady", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "massEdit", _descriptor12, _assertThisInitialized(_this));

      _this.handlers = {
        /**
         * Invokes the page primary action on press of Ctrl+Enter.
         *
         * @param oController The page controller
         * @param oView
         * @param oContext Context for which the action is called
         * @param sActionName The name of the action to be called
         * @param [mParameters] Contains the following attributes:
         * @param [mParameters.contexts] Mandatory for a bound action, either one context or an array with contexts for which the action is called
         * @param [mParameters.model] Mandatory for an unbound action; an instance of an OData V4 model
         * @param [mConditions] Contains the following attributes:
         * @param [mConditions.positiveActionVisible] The visibility of sematic positive action
         * @param [mConditions.positiveActionEnabled] The enablement of semantic positive action
         * @param [mConditions.editActionVisible] The Edit button visibility
         * @param [mConditions.editActionEnabled] The enablement of Edit button
         * @ui5-restricted
         * @final
         */
        onPrimaryAction: function (oController, oView, oContext, sActionName, mParameters, mConditions) {
          var iViewLevel = oController.getView().getViewData().viewLevel,
              oObjectPage = oController._getObjectPageLayoutControl();

          if (mConditions.positiveActionVisible) {
            if (mConditions.positiveActionEnabled) {
              oController.handlers.onCallAction(oView, sActionName, mParameters);
            }
          } else if (mConditions.editActionVisible && iViewLevel === 1) {
            if (mConditions.editActionEnabled) {
              oController._editDocument(oContext);
            }
          } else if (iViewLevel === 1 && oObjectPage.getModel("ui").getProperty("/isEditable")) {
            oController._saveDocument(oContext);
          } else if (oObjectPage.getModel("ui").getProperty("/isEditable")) {
            oController._applyDocument(oContext);
          }
        },
        onTableContextChange: function (oEvent) {
          var _this2 = this;

          var oSource = oEvent.getSource();
          var oTable;

          this._findTables().some(function (_oTable) {
            if (_oTable.getRowBinding() === oSource) {
              oTable = _oTable;
              return true;
            }

            return false;
          });

          var oCurrentActionPromise = this._editFlow.getCurrentActionPromise();

          if (oCurrentActionPromise) {
            var aTableContexts;

            if (oTable.getType().getMetadata().isA("sap.ui.mdc.table.GridTableType")) {
              aTableContexts = oSource.getContexts(0);
            } else {
              aTableContexts = oSource.getCurrentContexts();
            } //if contexts are not fully loaded the getcontexts function above will trigger a new change event call


            if (!aTableContexts[0]) {
              return;
            }

            oCurrentActionPromise.then(function (oActionResponse) {
              if (!oActionResponse || oActionResponse.controlId !== oTable.sId) {
                return;
              }

              var oActionData = oActionResponse.oData;
              var aKeys = oActionResponse.keys;
              var iNewItemp = -1;
              aTableContexts.find(function (oTableContext, i) {
                var oTableData = oTableContext.getObject();
                var bCompare = aKeys.every(function (sKey) {
                  return oTableData[sKey] === oActionData[sKey];
                });

                if (bCompare) {
                  iNewItemp = i;
                }

                return bCompare;
              });

              if (iNewItemp !== -1) {
                var aDialogs = InstanceManager.getOpenDialogs();
                var oDialog = aDialogs.length > 0 ? aDialogs.find(function (dialog) {
                  return dialog.data("FullScreenDialog") !== true;
                }) : null;

                if (oDialog) {
                  // by design, a sap.m.dialog set the focus to the previous focused element when closing.
                  // we should wait for the dialog to be close before to focus another element
                  oDialog.attachEventOnce("afterClose", function () {
                    oTable.focusRow(iNewItemp, true);
                  });
                } else {
                  oTable.focusRow(iNewItemp, true);
                }

                _this2._editFlow.deleteCurrentActionPromise();
              }
            }).catch(function (err) {
              Log.error("An error occurs while scrolling to the newly created Item: ".concat(err));
            });
          } // fire ModelContextChange on the message button whenever the table context changes


          this.messageButton.fireModelContextChange();
        },

        /**
         * Invokes an action - bound/unbound and sets the page dirty.
         *
         * @param oView
         * @param sActionName The name of the action to be called
         * @param [mParameters] Contains the following attributes:
         * @param [mParameters.contexts] Mandatory for a bound action, either one context or an array with contexts for which the action is called
         * @param [mParameters.model] Mandatory for an unbound action; an instance of an OData V4 model
         * @returns The action promise
         * @ui5-restricted
         * @final
         */
        onCallAction: function (oView, sActionName, mParameters) {
          var oController = oView.getController();
          return oController.editFlow.invokeAction(sActionName, mParameters).then(oController._showMessagePopover.bind(oController, undefined)).catch(oController._showMessagePopover.bind(oController));
        },
        onDataPointTitlePressed: function (oController, oSource, oManifestOutbound, sControlConfig, sCollectionPath) {
          oManifestOutbound = typeof oManifestOutbound === "string" ? JSON.parse(oManifestOutbound) : oManifestOutbound;
          var oTargetInfo = oManifestOutbound[sControlConfig],
              aSemanticObjectMapping = CommonUtils.getSemanticObjectMapping(oTargetInfo),
              oDataPointOrChartBindingContext = oSource.getBindingContext(),
              sMetaPath = oDataPointOrChartBindingContext.getModel().getMetaModel().getMetaPath(oDataPointOrChartBindingContext.getPath());

          var aNavigationData = oController._getChartContextData(oDataPointOrChartBindingContext, sCollectionPath);

          var additionalNavigationParameters;
          aNavigationData = aNavigationData.map(function (oNavigationData) {
            return {
              data: oNavigationData,
              metaPath: sMetaPath + (sCollectionPath ? "/".concat(sCollectionPath) : "")
            };
          });

          if (oTargetInfo && oTargetInfo.parameters) {
            var oParams = oTargetInfo.parameters && oController._intentBasedNavigation.getOutboundParams(oTargetInfo.parameters);

            if (Object.keys(oParams).length > 0) {
              additionalNavigationParameters = oParams;
            }
          }

          if (oTargetInfo && oTargetInfo.semanticObject && oTargetInfo.action) {
            oController._intentBasedNavigation.navigate(oTargetInfo.semanticObject, oTargetInfo.action, {
              navigationContexts: aNavigationData,
              semanticObjectMapping: aSemanticObjectMapping,
              additionalNavigationParameters: additionalNavigationParameters
            });
          }
        },

        /**
         * Triggers an outbound navigation when a user chooses the chevron.
         *
         * @param oController
         * @param sOutboundTarget Name of the outbound target (needs to be defined in the manifest)
         * @param oContext The context that contains the data for the target app
         * @param sCreatePath Create path when the chevron is created.
         * @returns Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
         * @ui5-restricted
         * @final
         */
        onChevronPressNavigateOutBound: function (oController, sOutboundTarget, oContext, sCreatePath) {
          return oController._intentBasedNavigation.onChevronPressNavigateOutBound(oController, sOutboundTarget, oContext, sCreatePath);
        },
        onNavigateChange: function (oEvent) {
          //will be called always when we click on a section tab
          this.getExtensionAPI().updateAppState();
          this.bSectionNavigated = true;
          var oInternalModelContext = this.getView().getBindingContext("internal");

          var oObjectPage = this._getObjectPageLayoutControl();

          if (oObjectPage.getModel("ui").getProperty("/isEditable") && this.getView().getViewData().sectionLayout === "Tabs" && oInternalModelContext.getProperty("errorNavigationSectionFlag") === false) {
            var oSubSection = oEvent.getParameter("subSection");

            this._updateFocusInEditMode([oSubSection]);
          }
        },
        onVariantSelected: function () {
          this.getExtensionAPI().updateAppState();
        },
        onVariantSaved: function () {
          var _this3 = this;

          //TODO: Should remove this setTimeOut once Variant Management provides an api to fetch the current variant key on save
          setTimeout(function () {
            _this3.getExtensionAPI().updateAppState();
          }, 500);
        },
        navigateToSubSection: function (oController, vDetailConfig) {
          var oDetailConfig = typeof vDetailConfig === "string" ? JSON.parse(vDetailConfig) : vDetailConfig;
          var oObjectPage = oController.getView().byId("fe::ObjectPage");
          var oSection;
          var oSubSection;

          if (oDetailConfig.sectionId) {
            oSection = oController.getView().byId(oDetailConfig.sectionId);
            oSubSection = oDetailConfig.subSectionId ? oController.getView().byId(oDetailConfig.subSectionId) : oSection && oSection.getSubSections() && oSection.getSubSections()[0];
          } else if (oDetailConfig.subSectionId) {
            oSubSection = oController.getView().byId(oDetailConfig.subSectionId);
            oSection = oSubSection && oSubSection.getParent();
          }

          if (!oSection || !oSubSection || !oSection.getVisible() || !oSubSection.getVisible()) {
            oController.getView().getModel("sap.fe.i18n").getResourceBundle().then(function (oResourceBundle) {
              var sTitle = CommonUtils.getTranslatedText("C_ROUTING_NAVIGATION_DISABLED_TITLE", oResourceBundle, null, oController.getView().getViewData().entitySet);
              Log.error(sTitle);
              MessageBox.error(sTitle);
            }).catch(function (error) {
              Log.error(error);
            });
          } else {
            oObjectPage.scrollToSection(oSubSection.getId()); // trigger iapp state change

            oObjectPage.fireNavigate({
              section: oSection,
              subSection: oSubSection
            });
          }
        },
        onChartSelectionChanged: function (oEvent) {
          ChartRuntime.fnUpdateChart(oEvent);
        },
        onStateChange: function () {
          this.getExtensionAPI().updateAppState();
        }
      };
      return _this;
    }

    var _proto = ObjectPageController.prototype;

    _proto.getExtensionAPI = function getExtensionAPI(sId) {
      if (sId) {
        // to allow local ID usage for custom pages we'll create/return own instances for custom sections
        this.mCustomSectionExtensionAPIs = this.mCustomSectionExtensionAPIs || {};

        if (!this.mCustomSectionExtensionAPIs[sId]) {
          this.mCustomSectionExtensionAPIs[sId] = new ExtensionAPI(this, sId);
        }

        return this.mCustomSectionExtensionAPIs[sId];
      } else {
        if (!this.extensionAPI) {
          this.extensionAPI = new ExtensionAPI(this);
        }

        return this.extensionAPI;
      }
    };

    _proto.onInit = function onInit() {
      _PageController.prototype.onInit.call(this);

      var oObjectPage = this._getObjectPageLayoutControl(); // Setting defaults of internal model context


      var oInternalModelContext = this.getView().getBindingContext("internal");
      oInternalModelContext === null || oInternalModelContext === void 0 ? void 0 : oInternalModelContext.setProperty("externalNavigationContext", {
        "page": true
      });
      oInternalModelContext === null || oInternalModelContext === void 0 ? void 0 : oInternalModelContext.setProperty("relatedApps", {
        visibility: false,
        items: null
      });
      oInternalModelContext === null || oInternalModelContext === void 0 ? void 0 : oInternalModelContext.setProperty("batchGroups", this._getBatchGroupsForView());
      oInternalModelContext === null || oInternalModelContext === void 0 ? void 0 : oInternalModelContext.setProperty("errorNavigationSectionFlag", false);

      if (!this.getView().getViewData().useNewLazyLoading && oObjectPage.getEnableLazyLoading()) {
        //Attaching the event to make the subsection context binding active when it is visible.
        oObjectPage.attachEvent("subSectionEnteredViewPort", this._handleSubSectionEnteredViewPort.bind(this));
      }

      this.messageButton = this.getView().byId("fe::FooterBar::MessageButton");
      this.messageButton.oItemBinding.attachChange(this._fnShowOPMessage, this);
    };

    _proto.onExit = function onExit() {
      if (this.mCustomSectionExtensionAPIs) {
        for (var _i = 0, _Object$keys = Object.keys(this.mCustomSectionExtensionAPIs); _i < _Object$keys.length; _i++) {
          var sId = _Object$keys[_i];

          if (this.mCustomSectionExtensionAPIs[sId]) {
            this.mCustomSectionExtensionAPIs[sId].destroy();
          }
        }

        delete this.mCustomSectionExtensionAPIs;
      }

      if (this.extensionAPI) {
        this.extensionAPI.destroy();
      }

      delete this.extensionAPI;
      var oMessagePopover = this.messageButton ? this.messageButton.oMessagePopover : null;

      if (oMessagePopover && oMessagePopover.isOpen()) {
        oMessagePopover.close();
      } //when exiting we set keepAlive context to false


      var oContext = this.getView().getBindingContext();

      if (oContext && oContext.isKeepAlive()) {
        oContext.setKeepAlive(false);
      }

      if (isConnected(this.getView())) {
        disconnect(this.getView()); // Cleanup collaboration connection when leaving the app
      }
    }
    /**
     * Method to show the message strip on the object page.
     *
     * @private
     */
    ;

    _proto._fnShowOPMessage = function _fnShowOPMessage() {
      var extensionAPI = this.getExtensionAPI();
      var view = this.getView();
      var messages = this.messageButton.oMessagePopover.getItems().map(function (item) {
        return item.getBindingContext("message").getObject();
      }).filter(function (message) {
        var _view$getBindingConte;

        return message.getTargets()[0] === ((_view$getBindingConte = view.getBindingContext()) === null || _view$getBindingConte === void 0 ? void 0 : _view$getBindingConte.getPath());
      });

      if (extensionAPI) {
        extensionAPI.showMessages(messages);
      }
    };

    _proto._getTableBinding = function _getTableBinding(oTable) {
      return oTable && oTable.getRowBinding();
    };

    _proto.onBeforeRendering = function onBeforeRendering() {
      var _this$oView$oViewData;

      PageController.prototype.onBeforeRendering.apply(this); // In the retrieveTextFromValueList scenario we need to ensure in case of reload/refresh that the meta model in the methode retrieveTextFromValueList of the FieldRuntime is available

      if ((_this$oView$oViewData = this.oView.oViewData) !== null && _this$oView$oViewData !== void 0 && _this$oView$oViewData.retrieveTextFromValueList && CommonHelper.getMetaModel() === undefined) {
        CommonHelper.setMetaModel(this.getAppComponent().getMetaModel());
      }
    };

    _proto.onAfterRendering = function onAfterRendering() {
      var _this4 = this;

      this.getView().getModel("sap.fe.i18n").getResourceBundle().then(function (response) {
        _this4.oResourceBundle = response;
      }).catch(function (oError) {
        Log.error("Error while retrieving the resource bundle", oError);
      });
    };

    _proto._onBeforeBinding = function _onBeforeBinding(oContext, mParameters) {
      var _this5 = this;

      // TODO: we should check how this comes together with the transaction helper, same to the change in the afterBinding
      var aTables = this._findTables(),
          oObjectPage = this._getObjectPageLayoutControl(),
          oInternalModelContext = this.getView().getBindingContext("internal"),
          oInternalModel = this.getView().getModel("internal"),
          aBatchGroups = oInternalModelContext.getProperty("batchGroups"),
          iViewLevel = this.getView().getViewData().viewLevel;

      var oFastCreationRow;
      aBatchGroups.push("$auto");

      if (mParameters.bDraftNavigation !== true) {
        this._closeSideContent();
      }

      var opContext = oObjectPage.getBindingContext();

      if (opContext && opContext.hasPendingChanges() && !aBatchGroups.some(opContext.getModel().hasPendingChanges.bind(opContext.getModel()))) {
        /* 	In case there are pending changes for the creation row and no others we need to reset the changes
         						TODO: this is just a quick solution, this needs to be reworked
         				 	*/
        opContext.getBinding().resetChanges();
      } // For now we have to set the binding context to null for every fast creation row
      // TODO: Get rid of this coding or move it to another layer - to be discussed with MDC and model


      for (var i = 0; i < aTables.length; i++) {
        oFastCreationRow = aTables[i].getCreationRow();

        if (oFastCreationRow) {
          oFastCreationRow.setBindingContext(null);
        }
      } // Scroll to present Section so that bindings are enabled during navigation through paginator buttons, as there is no view rerendering/rebind


      var fnScrollToPresentSection = function () {
        if (!oObjectPage.isFirstRendering() && !mParameters.bPersistOPScroll) {
          oObjectPage.setSelectedSection(null);
        }
      };

      oObjectPage.attachEventOnce("modelContextChange", fnScrollToPresentSection); // if the structure of the ObjectPageLayout is changed then scroll to present Section
      // FIXME Is this really working as intended ? Initially this was onBeforeRendering, but never triggered onBeforeRendering because it was registered after it

      var oDelegateOnBefore = {
        onAfterRendering: fnScrollToPresentSection
      };
      oObjectPage.addEventDelegate(oDelegateOnBefore, this);
      this.pageReady.attachEventOnce("pageReady", function () {
        oObjectPage.removeEventDelegate(oDelegateOnBefore);
      }); //Set the Binding for Paginators using ListBinding ID

      if (iViewLevel > 1) {
        var oBinding = mParameters && mParameters.listBinding;
        var oPaginatorCurrentContext = oInternalModel.getProperty("/paginatorCurrentContext");

        if (oPaginatorCurrentContext) {
          var oBindingToUse = oPaginatorCurrentContext.getBinding();
          this.paginator.initialize(oBindingToUse, oPaginatorCurrentContext);
          oInternalModel.setProperty("/paginatorCurrentContext", null);
        } else if (oBinding) {
          if (oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
            this.paginator.initialize(oBinding, oContext);
          } else {
            // if the binding type is not ODataListBinding because of a deeplink navigation or a refresh of the page
            // we need to create it
            var sBindingPath = oBinding.getPath();

            if (/\([^\)]*\)$/.test(sBindingPath)) {
              // The current binding path ends with (xxx), so we create the listBinding by removing (xxx)
              var sListBindingPath = sBindingPath.replace(/\([^\)]*\)$/, "");
              oBinding = new ODataListBinding(oBinding.oModel, sListBindingPath);

              var _setListBindingAsync = function () {
                if (oBinding.getContexts().length > 0) {
                  _this5.paginator.initialize(oBinding, oContext);

                  oBinding.detachEvent("change", _setListBindingAsync);
                }
              };

              oBinding.getContexts(0);
              oBinding.attachEvent("change", _setListBindingAsync);
            } else {
              // The current binding doesn't end with (xxx) --> the last segment is a 1-1 navigation, so we don't display the paginator
              this.paginator.initialize(undefined);
            }
          }
        }
      }

      if (!this.getView().getViewData().useNewLazyLoading && oObjectPage.getEnableLazyLoading()) {
        var aSections = oObjectPage.getSections();
        var bUseIconTabBar = oObjectPage.getUseIconTabBar();
        var iSkip = 2;
        var bIsInEditMode = oObjectPage.getModel("ui").getProperty("/isEditable");
        var bEditableHeader = this.getView().getViewData().editableHeaderContent;

        for (var iSection = 0; iSection < aSections.length; iSection++) {
          var oSection = aSections[iSection];
          var aSubSections = oSection.getSubSections();

          for (var iSubSection = 0; iSubSection < aSubSections.length; iSubSection++, iSkip--) {
            // In IconTabBar mode keep the second section bound if there is an editable header and we are switching to display mode
            if (iSkip < 1 || bUseIconTabBar && (iSection > 1 || iSection === 1 && !bEditableHeader && !bIsInEditMode)) {
              var oSubSection = aSubSections[iSubSection];

              if (oSubSection.data().isVisibilityDynamic !== "true") {
                oSubSection.setBindingContext(null);
              }
            }
          }
        }
      }

      if (this.placeholder.isPlaceholderEnabled() && mParameters.showPlaceholder) {
        var oView = this.getView();
        var oNavContainer = oView.getParent().oContainer.getParent();

        if (oNavContainer) {
          oNavContainer.showPlaceholder({});
        }
      }
    };

    _proto._getFirstClickableElement = function _getFirstClickableElement(oObjectPage) {
      var oFirstClickableElement;
      var aActions = oObjectPage.getHeaderTitle() && oObjectPage.getHeaderTitle().getActions();

      if (aActions && aActions.length) {
        oFirstClickableElement = aActions.find(function (oAction) {
          // Due to the left alignment of the Draft switch and the collaborative draft avatar controls
          // there is a ToolbarSpacer in the actions aggregation which we need to exclude here!
          // Due to the ACC report, we also need not to check for the InvisibleText elements
          if (oAction.isA("sap.fe.macros.ShareAPI")) {
            // since ShareAPI does not have a disable property
            // hence there is no need to check if it is disbaled or not
            return oAction.getVisible();
          } else if (!oAction.isA("sap.ui.core.InvisibleText") && !oAction.isA("sap.m.ToolbarSpacer")) {
            return oAction.getVisible() && oAction.getEnabled();
          }
        });
      }

      return oFirstClickableElement;
    };

    _proto._getFirstEmptyMandatoryFieldFromSubSection = function _getFirstEmptyMandatoryFieldFromSubSection(aSubSections) {
      if (aSubSections) {
        for (var subSection = 0; subSection < aSubSections.length; subSection++) {
          var aBlocks = aSubSections[subSection].getBlocks();

          if (aBlocks) {
            for (var block = 0; block < aBlocks.length; block++) {
              var aFormContainers = void 0;

              if (aBlocks[block].isA("sap.ui.layout.form.Form")) {
                aFormContainers = aBlocks[block].getFormContainers();
              } else if (aBlocks[block].getContent && aBlocks[block].getContent() && aBlocks[block].getContent().isA("sap.ui.layout.form.Form")) {
                aFormContainers = aBlocks[block].getContent().getFormContainers();
              }

              if (aFormContainers) {
                for (var formContainer = 0; formContainer < aFormContainers.length; formContainer++) {
                  var aFormElements = aFormContainers[formContainer].getFormElements();

                  if (aFormElements) {
                    for (var formElement = 0; formElement < aFormElements.length; formElement++) {
                      var aFields = aFormElements[formElement].getFields(); // The first field is not necessarily an InputBase (e.g. could be a Text)
                      // So we need to check whether it has a getRequired method

                      try {
                        if (aFields[0].getRequired && aFields[0].getRequired() && !aFields[0].getValue()) {
                          return aFields[0];
                        }
                      } catch (error) {
                        Log.debug("Error when searching for mandaotry empty field: ".concat(error));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return undefined;
    };

    _proto._updateFocusInEditMode = function _updateFocusInEditMode(aSubSections) {
      var oObjectPage = this._getObjectPageLayoutControl();

      var oMandatoryField = this._getFirstEmptyMandatoryFieldFromSubSection(aSubSections);

      var oFieldToFocus;

      if (oMandatoryField) {
        oFieldToFocus = oMandatoryField.content.getContentEdit()[0];
      } else {
        oFieldToFocus = oObjectPage._getFirstEditableInput() || this._getFirstClickableElement(oObjectPage);
      }

      if (oFieldToFocus) {
        setTimeout(function () {
          // We set the focus in a timeeout, otherwise the focus sometimes goes to the TabBar
          oFieldToFocus.focus();
        }, 0);
      }
    };

    _proto._handleSubSectionEnteredViewPort = function _handleSubSectionEnteredViewPort(oEvent) {
      var oSubSection = oEvent.getParameter("subSection");
      oSubSection.setBindingContext(undefined);
    };

    _proto._onBackNavigationInDraft = function _onBackNavigationInDraft(oContext) {
      this.messageHandler.removeTransitionMessages();

      if (this.getAppComponent().getRouterProxy().checkIfBackHasSameContext()) {
        // Back nav will keep the same context --> no need to display the dialog
        history.back();
      } else {
        draft.processDataLossOrDraftDiscardConfirmation(function () {
          history.back();
        }, Function.prototype, oContext, this, false, draft.NavigationType.BackNavigation);
      }
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto._onAfterBinding = function _onAfterBinding(oBindingContext, mParameters) {
      var _this6 = this;

      // TODO: this should be moved into an init event of the MDC tables (not yet existing) and should be part
      // of any controller extension

      /**
       * @param oTable
       * @param oListBinding
       */
      var enableFastCreationRow = function (oTable, oListBinding) {
        try {
          var oFastCreationRow = oTable.getCreationRow();
          var oFastCreationListBinding, oFastCreationContext;

          var _temp5 = function () {
            if (oFastCreationRow) {
              var _temp6 = _catch(function () {
                return Promise.resolve(oFinalUIState).then(function () {
                  var _temp2 = function () {
                    if (oFastCreationRow.getModel("ui").getProperty("/isEditable")) {
                      oFastCreationListBinding = oModel.bindList(oListBinding.getPath(), oListBinding.getContext(), [], [], {
                        $$updateGroupId: "doNotSubmit",
                        $$groupId: "doNotSubmit"
                      }); // Workaround suggested by OData model v4 colleagues

                      oFastCreationListBinding.refreshInternal = function () {
                        /* do nothing */
                      };

                      oFastCreationContext = oFastCreationListBinding.create();
                      oFastCreationRow.setBindingContext(oFastCreationContext); // this is needed to avoid console error

                      var _temp7 = _catch(function () {
                        return Promise.resolve(oFastCreationContext.created()).then(function () {});
                      }, function () {
                        Log.trace("transient fast creation context deleted");
                      });

                      if (_temp7 && _temp7.then) return _temp7.then(function () {});
                    }
                  }();

                  if (_temp2 && _temp2.then) return _temp2.then(function () {});
                });
              }, function (oError) {
                Log.error("Error while computing the final UI state", oError);
              });

              if (_temp6 && _temp6.then) return _temp6.then(function () {});
            }
          }();

          return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      }; // this should not be needed at the all

      /**
       * @param oTable
       */


      var oObjectPage = this._getObjectPageLayoutControl();

      var aTables = this._findTables();

      this._sideEffects.clearPropertiesStatus(); // TODO: this is only a temp solution as long as the model fix the cache issue and we use this additional
      // binding with ownRequest


      oBindingContext = oObjectPage.getBindingContext();
      var aIBNActions = [];
      oObjectPage.getSections().forEach(function (oSection) {
        oSection.getSubSections().forEach(function (oSubSection) {
          aIBNActions = CommonUtils.getIBNActions(oSubSection, aIBNActions);
        });
      }); // Assign internal binding contexts to oFormContainer:
      // 1. It is not possible to assign the internal binding context to the XML fragment
      // (FormContainer.fragment.xml) yet - it is used already for the data-structure.
      // 2. Another problem is, that FormContainers assigned to a 'MoreBlock' does not have an
      // internal model context at all.

      aTables.forEach(function (oTable) {
        var oInternalModelContext = oTable.getBindingContext("internal");
        oInternalModelContext.setProperty("creationRowFieldValidity", {});
        oInternalModelContext.setProperty("creationRowCustomValidity", {});
        aIBNActions = CommonUtils.getIBNActions(oTable, aIBNActions); // temporary workaround for BCP: 2080218004
        // Need to fix with BLI: FIORITECHP1-15274
        // only for edit mode, we clear the table cache
        // Workaround starts here!!

        var oTableRowBinding = oTable.getRowBinding();

        if (oTableRowBinding) {
          if (ModelHelper.isStickySessionSupported(oTableRowBinding.getModel().getMetaModel())) {
            // apply for both edit and display mode in sticky
            oTableRowBinding.removeCachesAndMessages("");
          }
        } // Workaround ends here!!
        // Update 'enabled' property of DataFieldForAction buttons on table toolbar
        // The same is also performed on Table selectionChange event


        var oActionOperationAvailableMap = JSON.parse(CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "operationAvailableMap"))),
            aSelectedContexts = oTable.getSelectedContexts();
        ActionRuntime.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts, "table"); // Clear the selection in the table, need to be fixed and review with BLI: FIORITECHP1-24318

        oTable.clearSelection();
      });
      CommonUtils.getSemanticTargetsFromPageModel(this, "_pageModel"); //Retrieve Object Page header actions from Object Page title control

      var oObjectPageTitle = oObjectPage.getHeaderTitle();
      var aIBNHeaderActions = [];
      aIBNHeaderActions = CommonUtils.getIBNActions(oObjectPageTitle, aIBNHeaderActions);
      aIBNActions = aIBNActions.concat(aIBNHeaderActions);
      CommonUtils.updateDataFieldForIBNButtonsVisibility(aIBNActions, this.getView());
      var oModel, oFinalUIState;

      var handleTableModifications = function (oTable) {
        var oBinding = _this6._getTableBinding(oTable),
            fnHandleTablePatchEvents = function () {
          enableFastCreationRow(oTable, oBinding);
        };

        if (!oBinding) {
          Log.error("Expected binding missing for table: ".concat(oTable.getId()));
          return;
        }

        if (oBinding.oContext) {
          fnHandleTablePatchEvents();
        } else {
          var fnHandleChange = function () {
            if (oBinding.oContext) {
              fnHandleTablePatchEvents();
              oBinding.detachChange(fnHandleChange);
            }
          };

          oBinding.attachChange(fnHandleChange);
        }
      };

      if (oBindingContext) {
        oModel = oBindingContext.getModel(); // Compute Edit Mode

        oFinalUIState = this._editFlow.computeEditMode(oBindingContext);

        if (ModelHelper.isCollaborationDraftSupported(oModel.getMetaModel())) {
          oFinalUIState.then(function () {
            if (_this6.getView().getModel("ui").getProperty("/isEditable")) {
              connect(_this6.getView());
            } else if (isConnected(_this6.getView())) {
              disconnect(_this6.getView()); // Cleanup collaboration connection in case we switch to another element (e.g. in FCL)
            }
          }).catch(function (oError) {
            Log.error("Error while waiting for the final UI State", oError);
          });
        } // update related apps once Data is received in case of binding cache is not available
        // TODO: this is only a temp solution since we need to call _updateRelatedApps method only after data for Object Page is received (if there is no binding)


        if (oBindingContext.getBinding().oCache) {
          this._updateRelatedApps();
        } else {
          var fnUpdateRelatedApps = function () {
            _this6._updateRelatedApps();

            oBindingContext.getBinding().detachDataReceived(fnUpdateRelatedApps);
          };

          oBindingContext.getBinding().attachDataReceived(fnUpdateRelatedApps);
        } //Attach the patch sent and patch completed event to the object page binding so that we can react


        var oBinding = oBindingContext.getBinding && oBindingContext.getBinding() || oBindingContext; // Attach the event handler only once to the same binding

        if (this.currentBinding !== oBinding) {
          oBinding.attachEvent("patchSent", this.editFlow.handlePatchSent, this);
          this.currentBinding = oBinding;
        }

        aTables.forEach(function (oTable) {
          // access binding only after table is bound
          TableUtils.whenBound(oTable).then(handleTableModifications).catch(function (oError) {
            Log.error("Error while waiting for the table to be bound", oError);
          });
        });

        if (!this.getView().getViewData().useNewLazyLoading) {
          // should be called only after binding is ready hence calling it in onAfterBinding
          oObjectPage._triggerVisibleSubSectionsEvents();
        }
      }
    };

    _proto.onPageReady = function onPageReady(mParameters) {
      var _this7 = this;

      var setFocus = function () {
        // Set the focus to the first action button, or to the first editable input if in editable mode
        var oObjectPage = _this7._getObjectPageLayoutControl();

        var isInDisplayMode = !oObjectPage.getModel("ui").getProperty("/isEditable");

        if (isInDisplayMode) {
          var oFirstClickableElement = _this7._getFirstClickableElement(oObjectPage);

          if (oFirstClickableElement) {
            oFirstClickableElement.focus();
          }
        } else {
          var oSelectedSection = Core.byId(oObjectPage.getSelectedSection());

          if (oSelectedSection) {
            _this7._updateFocusInEditMode(oSelectedSection.getSubSections());
          }
        }
      }; // Apply app state only after the page is ready with the first section selected


      var oView = this.getView();
      var oInternalModelContext = oView.getBindingContext("internal");
      var oBindingContext = oView.getBindingContext(); //Show popup while navigating back from object page in case of draft

      if (oBindingContext) {
        var bIsStickyMode = ModelHelper.isStickySessionSupported(oBindingContext.getModel().getMetaModel());

        if (!bIsStickyMode) {
          var oAppComponent = CommonUtils.getAppComponent(oView);
          oAppComponent.getShellServices().setBackNavigation(function () {
            return _this7._onBackNavigationInDraft(oBindingContext);
          });
        }
      }

      this.getAppComponent().getAppStateHandler().applyAppState().then(function () {
        if (mParameters.forceFocus) {
          setFocus();
        }
      }).catch(function (Error) {
        Log.error("Error while setting the focus", Error);
      });
      oInternalModelContext.setProperty("errorNavigationSectionFlag", false);

      this._checkDataPointTitleForExternalNavigation();
    }
    /**
     * Get the status of edit mode for sticky session.
     *
     * @returns The status of edit mode for sticky session
     */
    ;

    _proto.getStickyEditMode = function getStickyEditMode() {
      var oBindingContext = this.getView().getBindingContext && this.getView().getBindingContext();
      var bIsStickyEditMode = false;

      if (oBindingContext) {
        var bIsStickyMode = ModelHelper.isStickySessionSupported(oBindingContext.getModel().getMetaModel());

        if (bIsStickyMode) {
          bIsStickyEditMode = this.getView().getModel("ui").getProperty("/isEditable");
        }
      }

      return bIsStickyEditMode;
    };

    _proto._getObjectPageLayoutControl = function _getObjectPageLayoutControl() {
      return this.byId("fe::ObjectPage");
    };

    _proto._getPageTitleInformation = function _getPageTitleInformation() {
      var oObjectPage = this._getObjectPageLayoutControl();

      var oObjectPageSubtitle = oObjectPage.getCustomData().find(function (oCustomData) {
        return oCustomData.getKey() === "ObjectPageSubtitle";
      });
      return {
        title: oObjectPage.data("ObjectPageTitle") || "",
        subtitle: oObjectPageSubtitle && oObjectPageSubtitle.getValue(),
        intent: "",
        icon: ""
      };
    };

    _proto._executeHeaderShortcut = function _executeHeaderShortcut(sId) {
      var sButtonId = "".concat(this.getView().getId(), "--").concat(sId),
          oButton = this._getObjectPageLayoutControl().getHeaderTitle().getActions().find(function (oElement) {
        return oElement.getId() === sButtonId;
      });

      CommonUtils.fireButtonPress(oButton);
    };

    _proto._executeFooterShortcut = function _executeFooterShortcut(sId) {
      var sButtonId = "".concat(this.getView().getId(), "--").concat(sId),
          oButton = this._getObjectPageLayoutControl().getFooter().getContent().find(function (oElement) {
        return oElement.getMetadata().getName() === "sap.m.Button" && oElement.getId() === sButtonId;
      });

      CommonUtils.fireButtonPress(oButton);
    };

    _proto._executeTabShortCut = function _executeTabShortCut(oExecution) {
      var oObjectPage = this._getObjectPageLayoutControl(),
          aSections = oObjectPage.getSections(),
          iSectionIndexMax = aSections.length - 1,
          sCommand = oExecution.oSource.getCommand();

      var newSection,
          iSelectedSectionIndex = oObjectPage.indexOfSection(this.byId(oObjectPage.getSelectedSection()));

      if (iSelectedSectionIndex !== -1 && iSectionIndexMax > 0) {
        if (sCommand === "NextTab") {
          if (iSelectedSectionIndex <= iSectionIndexMax - 1) {
            newSection = aSections[++iSelectedSectionIndex];
          }
        } else if (iSelectedSectionIndex !== 0) {
          // PreviousTab
          newSection = aSections[--iSelectedSectionIndex];
        }

        if (newSection) {
          oObjectPage.setSelectedSection(newSection);
          newSection.focus();
        }
      }
    };

    _proto._getFooterVisibility = function _getFooterVisibility() {
      var oInternalModelContext = this.getView().getBindingContext("internal");
      var sViewId = this.getView().getId();
      oInternalModelContext.setProperty("messageFooterContainsErrors", false);
      sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
        if (oMessage.validation && oMessage.type === "Error" && oMessage.target.indexOf(sViewId) > -1) {
          oInternalModelContext.setProperty("messageFooterContainsErrors", true);
        }
      });
    };

    _proto._showMessagePopover = function _showMessagePopover(err, oRet) {
      if (err) {
        Log.error(err);
      }

      var rootViewController = this.getAppComponent().getRootViewController();
      var currentPageView = rootViewController.isFclEnabled() ? rootViewController.getRightmostView() : this.getAppComponent().getRootContainer().getCurrentPage();

      if (!currentPageView.isA("sap.m.MessagePage")) {
        var oMessageButton = this.messageButton,
            oMessagePopover = oMessageButton.oMessagePopover,
            oItemBinding = oMessagePopover.getBinding("items");

        if (oItemBinding.getLength() > 0 && !oMessagePopover.isOpen()) {
          oMessageButton.setVisible(true); // workaround to ensure that oMessageButton is rendered when openBy is called

          setTimeout(function () {
            oMessagePopover.openBy(oMessageButton);
          }, 0);
        }
      }

      return oRet;
    };

    _proto._editDocument = function _editDocument(oContext) {
      var oModel = this.getView().getModel("ui");
      BusyLocker.lock(oModel);
      return this.editFlow.editDocument.apply(this.editFlow, [oContext]).finally(function () {
        BusyLocker.unlock(oModel);
      });
    }
    /**
     * Gets the context of the DraftRoot path.
     * If a view has been created with the draft Root Path, this method returns its bindingContext.
     * Where no view is found a new created context is returned.
     * The new created context request the key of the entity in order to get the Etag of this entity.
     *
     * @function
     * @name getDraftRootPath
     * @returns Returns a Promise
     */
    ;

    _proto.getDraftRootContext = function getDraftRootContext() {
      try {
        var _exit2 = false;

        var _this9 = this;

        var view = _this9.getView();

        var context = view.getBindingContext();

        var _temp11 = function () {
          if (context) {
            function _temp12(_result) {
              if (_exit2) return _result;
              _exit2 = true;
              return undefined;
            }

            var draftRootContextPath = ModelHelper.getDraftRootPath(context);
            var simpleDraftRootContext;

            var _temp13 = function () {
              if (draftRootContextPath) {
                var _getInstancedViews$fi, _simpleDraftRootConte, _mDataModel$targetEnt;

                // Check if a view matches with the draft root path
                var existingBindingContextOnPage = (_getInstancedViews$fi = _this9.getAppComponent().getRootViewController().getInstancedViews().find(function (pageView) {
                  var _pageView$getBindingC;

                  return ((_pageView$getBindingC = pageView.getBindingContext()) === null || _pageView$getBindingC === void 0 ? void 0 : _pageView$getBindingC.getPath()) === draftRootContextPath;
                })) === null || _getInstancedViews$fi === void 0 ? void 0 : _getInstancedViews$fi.getBindingContext();

                if (existingBindingContextOnPage) {
                  _exit2 = true;
                  return existingBindingContextOnPage;
                }

                var internalModel = view.getModel("internal");
                simpleDraftRootContext = internalModel.getProperty("/simpleDraftRootContext");

                if (((_simpleDraftRootConte = simpleDraftRootContext) === null || _simpleDraftRootConte === void 0 ? void 0 : _simpleDraftRootConte.getPath()) === draftRootContextPath) {
                  _exit2 = true;
                  return simpleDraftRootContext;
                }

                var model = context.getModel();
                var metaModel = model.getMetaModel();
                var sEntityPath = metaModel.getMetaPath(draftRootContextPath);
                var mDataModel = MetaModelConverter.getInvolvedDataModelObjects(metaModel.getContext(sEntityPath));
                simpleDraftRootContext = model.bindContext(draftRootContextPath).getBoundContext();
                return Promise.resolve(simpleDraftRootContext.requestProperty((_mDataModel$targetEnt = mDataModel.targetEntityType.keys[0]) === null || _mDataModel$targetEnt === void 0 ? void 0 : _mDataModel$targetEnt.name)).then(function () {
                  // Store this new created context to use it on the next iterations
                  internalModel.setProperty("/simpleDraftRootContext", simpleDraftRootContext);
                  _exit2 = true;
                  return simpleDraftRootContext;
                });
              }
            }();

            return _temp13 && _temp13.then ? _temp13.then(_temp12) : _temp12(_temp13);
          }
        }();

        return Promise.resolve(_temp11 && _temp11.then ? _temp11.then(function (_result2) {
          return _exit2 ? _result2 : undefined;
        }) : _exit2 ? _temp11 : undefined);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._validateDocument = function _validateDocument() {
      try {
        var _exit4 = false;

        var _this11 = this;

        var control = Core.byId(Core.getCurrentFocusedControlId());
        var context = control === null || control === void 0 ? void 0 : control.getBindingContext();

        var _temp15 = function () {
          if (context && !context.isTransient()) {
            // Wait for the pending changes before starting this validation
            return Promise.resolve(_this11._editFlow.syncTask()).then(function () {
              var appComponent = _this11.getAppComponent();

              var sideEffectsService = appComponent.getSideEffectsService();
              var entityType = sideEffectsService.getEntityTypeFromContext(context);
              var globalSideEffects = entityType ? sideEffectsService.getGlobalODataEntitySideEffects(entityType) : []; // If there is at least one global SideEffects for the related entity, execute it/them

              return function () {
                if (globalSideEffects.length) {
                  var _Promise$all2 = Promise.all(globalSideEffects.map(function (sideEffects) {
                    return _this11._sideEffects.requestSideEffects(sideEffects, context);
                  }));

                  _exit4 = true;
                  return _Promise$all2;
                } else {
                  return Promise.resolve(_this11.getDraftRootContext()).then(function (draftRootContext) {
                    if (draftRootContext) {
                      var _draft$executeDraftVa2 = draft.executeDraftValidation(draftRootContext, appComponent);

                      _exit4 = true;
                      return _draft$executeDraftVa2;
                    }
                  }); //Execute the draftValidation if there is no globalSideEffects
                }
              }();
            });
          }
        }();

        return Promise.resolve(_temp15 && _temp15.then ? _temp15.then(function (_result4) {
          return _exit4 ? _result4 : undefined;
        }) : _exit4 ? _temp15 : undefined);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._saveDocument = function _saveDocument(oContext) {
      try {
        var _this13 = this;

        var oModel = _this13.getView().getModel("ui"),
            aWaitCreateDocuments = []; // indicates if we are creating a new row in the OP


        var bExecuteSideEffectsOnError = false;
        BusyLocker.lock(oModel);

        _this13._findTables().forEach(function (oTable) {
          var oBinding = _this13._getTableBinding(oTable);

          var mParameters = {
            creationMode: oTable.data("creationMode"),
            creationRow: oTable.getCreationRow(),
            createAtEnd: oTable.data("createAtEnd") === "true"
          };
          var bCreateDocument = mParameters.creationRow && mParameters.creationRow.getBindingContext() && Object.keys(mParameters.creationRow.getBindingContext().getObject()).length > 1;

          if (bCreateDocument) {
            // the bSkipSideEffects is a parameter created when we click the save key. If we press this key
            // we don't execute the handleSideEffects funciton to avoid batch redundancy
            mParameters.bSkipSideEffects = true;
            bExecuteSideEffectsOnError = true;
            aWaitCreateDocuments.push(_this13.editFlow.createDocument(oBinding, mParameters).then(function () {
              return oBinding;
            }));
          }
        });

        return Promise.resolve(_finallyRethrows(function () {
          return Promise.resolve(Promise.all(aWaitCreateDocuments)).then(function (aBindings) {
            var mParameters = {
              bExecuteSideEffectsOnError: bExecuteSideEffectsOnError,
              bindings: aBindings
            }; // We need to either reject or resolve a promise here and return it since this save
            // function is not only called when pressing the save button in the footer, but also
            // when the user selects create or save in a dataloss popup.
            // The logic of the dataloss popup needs to detect if the save had errors or not in order
            // to decide if the subsequent action - like a back navigation - has to be executed or not.

            return _catch(function () {
              return Promise.resolve(_this13.editFlow.saveDocument(oContext, mParameters)).then(function () {});
            }, function (error) {
              // If the saveDocument in editFlow returns errors we need
              // to show the message popover here and ensure that the
              // dataloss logic does not perform the follow up function
              // like e.g. a back navigation hence we return a promise and reject it
              _this13._showMessagePopover(error);

              throw error;
            });
          });
        }, function (_wasThrown, _result5) {
          if (BusyLocker.isLocked(oModel)) {
            BusyLocker.unlock(oModel);
          }

          if (_wasThrown) throw _result5;
          return _result5;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._manageCollaboration = function _manageCollaboration() {
      openManageDialog(this.getView());
    };

    _proto._showCollaborationUserDetails = function _showCollaborationUserDetails(event) {
      showUserDetails(event, this.getView());
    };

    _proto._cancelDocument = function _cancelDocument(oContext, mParameters) {
      mParameters.cancelButton = this.getView().byId(mParameters.cancelButton); //to get the reference of the cancel button from command execution

      return this.editFlow.cancelDocument(oContext, mParameters);
    };

    _proto._applyDocument = function _applyDocument(oContext) {
      var _this14 = this;

      return this.editFlow.applyDocument(oContext).catch(function () {
        return _this14._showMessagePopover();
      });
    };

    _proto._updateRelatedApps = function _updateRelatedApps() {
      var oObjectPage = this._getObjectPageLayoutControl();

      if (CommonUtils.resolveStringtoBoolean(oObjectPage.data("showRelatedApps"))) {
        CommonUtils.updateRelatedAppsDetails(oObjectPage);
      }
    };

    _proto._findControlInSubSection = function _findControlInSubSection(aParentElement, aSubsection, aControls, bIsChart) {
      var aSubSectionTables = [];

      for (var element = 0; element < aParentElement.length; element++) {
        var oElement = aParentElement[element].getContent instanceof Function && aParentElement[element].getContent();

        if (bIsChart) {
          if (oElement && oElement.mAggregations && oElement.getAggregation("items")) {
            var aItems = oElement.getAggregation("items");
            aItems.forEach(function (oItem) {
              if (oItem.isA("sap.fe.macros.chart.ChartAPI")) {
                oElement = oItem;
              }
            });
          }
        }

        if (oElement && oElement.isA && oElement.isA("sap.ui.layout.DynamicSideContent")) {
          oElement = oElement.getMainContent instanceof Function && oElement.getMainContent();

          if (oElement && oElement.length > 0) {
            oElement = oElement[0];
          }
        }

        if (oElement && oElement.isA && oElement.isA("sap.fe.macros.table.TableAPI")) {
          oElement = oElement.getContent instanceof Function && oElement.getContent();

          if (oElement && oElement.length > 0) {
            oElement = oElement[0];
          }
        }

        if (oElement && oElement.isA && oElement.isA("sap.ui.mdc.Table")) {
          aControls.push(oElement);
          aSubSectionTables.push({
            "table": oElement,
            "gridTable": oElement.getType().isA("sap.ui.mdc.table.GridTableType")
          });
        }

        if (oElement && oElement.isA && oElement.isA("sap.fe.macros.chart.ChartAPI")) {
          oElement = oElement.getContent instanceof Function && oElement.getContent();

          if (oElement && oElement.length > 0) {
            oElement = oElement[0];
          }
        }

        if (oElement && oElement.isA && oElement.isA("sap.ui.mdc.Chart")) {
          aControls.push(oElement);
        }
      }

      if (aSubSectionTables.length === 1 && aParentElement.length === 1 && aSubSectionTables[0].gridTable && !aSubsection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")) {
        //In case there is only a single table in a section we fit that to the whole page so that the scrollbar comes only on table and not on page
        aSubsection.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");
      }
    };

    _proto._getAllSubSections = function _getAllSubSections() {
      var oObjectPage = this._getObjectPageLayoutControl();

      var aSubSections = [];
      oObjectPage.getSections().forEach(function (oSection) {
        aSubSections = aSubSections.concat(oSection.getSubSections());
      });
      return aSubSections;
    };

    _proto._getAllBlocks = function _getAllBlocks() {
      var aBlocks = [];

      this._getAllSubSections().forEach(function (oSubSection) {
        aBlocks = aBlocks.concat(oSubSection.getBlocks());
      });

      return aBlocks;
    };

    _proto._findTables = function _findTables() {
      var aSubSections = this._getAllSubSections();

      var aTables = [];

      for (var subSection = 0; subSection < aSubSections.length; subSection++) {
        this._findControlInSubSection(aSubSections[subSection].getBlocks(), aSubSections[subSection], aTables);

        this._findControlInSubSection(aSubSections[subSection].getMoreBlocks(), aSubSections[subSection], aTables);
      }

      return aTables;
    };

    _proto._findCharts = function _findCharts() {
      var aSubSections = this._getAllSubSections();

      var aCharts = [];

      for (var subSection = 0; subSection < aSubSections.length; subSection++) {
        this._findControlInSubSection(aSubSections[subSection].getBlocks(), aSubSections[subSection], aCharts, true);

        this._findControlInSubSection(aSubSections[subSection].getMoreBlocks(), aSubSections[subSection], aCharts, true);
      }

      return aCharts;
    };

    _proto._closeSideContent = function _closeSideContent() {
      this._getAllBlocks().forEach(function (oBlock) {
        var oContent = oBlock.getContent instanceof Function && oBlock.getContent();

        if (oContent && oContent.isA && oContent.isA("sap.ui.layout.DynamicSideContent")) {
          if (oContent.setShowSideContent instanceof Function) {
            oContent.setShowSideContent(false);
          }
        }
      });
    }
    /**
     * Chart Context is resolved for 1:n microcharts.
     *
     * @param oChartContext The Context of the MicroChart
     * @param sChartPath The collectionPath of the the chart
     * @returns Array of Attributes of the chart Context
     */
    ;

    _proto._getChartContextData = function _getChartContextData(oChartContext, sChartPath) {
      var oContextData = oChartContext.getObject();
      var oChartContextData = [oContextData];

      if (oChartContext && sChartPath) {
        if (oContextData[sChartPath]) {
          oChartContextData = oContextData[sChartPath];
          delete oContextData[sChartPath];
          oChartContextData.push(oContextData);
        }
      }

      return oChartContextData;
    }
    /**
     * Scroll the tables to the row with the sPath
     *
     * @function
     * @name sap.fe.templates.ObjectPage.ObjectPageController.controller#_scrollTablesToRow
     * @param {string} sRowPath 'sPath of the table row'
     */
    ;

    _proto._scrollTablesToRow = function _scrollTablesToRow(sRowPath) {
      if (this._findTables && this._findTables().length > 0) {
        var aTables = this._findTables();

        for (var i = 0; i < aTables.length; i++) {
          TableScroller.scrollTableToRow(aTables[i], sRowPath);
        }
      }
    }
    /**
     * Method to merge selected contexts and filters.
     *
     * @function
     * @name _mergeMultipleContexts
     * @param oPageContext Page context
     * @param aLineContext Selected Contexts
     * @param sChartPath Collection name of the chart
     * @returns Selection Variant Object
     */
    ;

    _proto._mergeMultipleContexts = function _mergeMultipleContexts(oPageContext, aLineContext, sChartPath) {
      var _this15 = this;

      var aAttributes = [],
          aPageAttributes = [],
          oContext,
          sMetaPathLine,
          sPathLine;
      var sPagePath = oPageContext.getPath();
      var oMetaModel = oPageContext && oPageContext.getModel() && oPageContext.getModel().getMetaModel();
      var sMetaPathPage = oMetaModel && oMetaModel.getMetaPath(sPagePath).replace(/^\/*/, ""); // Get single line context if necessary

      if (aLineContext && aLineContext.length) {
        oContext = aLineContext[0];
        sPathLine = oContext.getPath();
        sMetaPathLine = oMetaModel && oMetaModel.getMetaPath(sPathLine).replace(/^\/*/, "");
        aLineContext.forEach(function (oSingleContext) {
          if (sChartPath) {
            var oChartContextData = _this15._getChartContextData(oSingleContext, sChartPath);

            if (oChartContextData) {
              aAttributes = oChartContextData.map(function (oSubChartContextData) {
                return {
                  contextData: oSubChartContextData,
                  entitySet: "".concat(sMetaPathPage, "/").concat(sChartPath)
                };
              });
            }
          } else {
            aAttributes.push({
              contextData: oSingleContext.getObject(),
              entitySet: sMetaPathLine
            });
          }
        });
      }

      aPageAttributes.push({
        contextData: oPageContext.getObject(),
        entitySet: sMetaPathPage
      }); // Adding Page Context to selection variant

      aPageAttributes = CommonUtils.removeSensitiveData(aPageAttributes, oMetaModel);
      var oPageLevelSV = CommonUtils.addPageContextToSelectionVariant(new SelectionVariant(), aPageAttributes, this.getView());
      aAttributes = CommonUtils.removeSensitiveData(aAttributes, oMetaModel);
      return {
        selectionVariant: oPageLevelSV,
        attributes: aAttributes
      };
    };

    _proto._getBatchGroupsForView = function _getBatchGroupsForView() {
      var oViewData = this.getView().getViewData(),
          oConfigurations = oViewData.controlConfiguration,
          aConfigurations = oConfigurations && Object.keys(oConfigurations),
          aBatchGroups = ["$auto.Heroes", "$auto.Decoration", "$auto.Workers"];

      if (aConfigurations && aConfigurations.length > 0) {
        aConfigurations.forEach(function (sKey) {
          var oConfiguration = oConfigurations[sKey];

          if (oConfiguration.requestGroupId === "LongRunners") {
            aBatchGroups.push("$auto.LongRunners");
          }
        });
      }

      return aBatchGroups;
    }
    /*
     * Reset Breadcrumb links
     *
     * @function
     * @param {sap.m.Breadcrumbs} [oSource] parent control
     * @description Used when context of the object page changes.
     *              This event callback is attached to modelContextChange
     *              event of the Breadcrumb control to catch context change.
     *              Then element binding and hrefs are updated for each link.
     *
     * @ui5-restricted
     * @experimental
     */
    ;

    _proto._setBreadcrumbLinks = function _setBreadcrumbLinks(oSource) {
      try {
        var _sNewPath$split;

        var _this17 = this;

        var oContext = oSource.getBindingContext(),
            oAppComponent = _this17.getAppComponent(),
            aPromises = [],
            aSkipParameterized = [],
            sNewPath = oContext === null || oContext === void 0 ? void 0 : oContext.getPath(),
            aPathParts = (_sNewPath$split = sNewPath === null || sNewPath === void 0 ? void 0 : sNewPath.split("/")) !== null && _sNewPath$split !== void 0 ? _sNewPath$split : [],
            oMetaModel = oAppComponent && oAppComponent.getMetaModel();

        var sPath = "";

        var _temp17 = _catch(function () {
          aPathParts.shift();
          aPathParts.splice(-1, 1);
          aPathParts.forEach(function (sPathPart) {
            sPath += "/".concat(sPathPart);
            var oRootViewController = oAppComponent.getRootViewController();
            var sParameterPath = oMetaModel.getMetaPath(sPath);
            var bResultContext = oMetaModel.getObject("".concat(sParameterPath, "/@com.sap.vocabularies.Common.v1.ResultContext"));

            if (bResultContext) {
              // We dont need to create a breadcrumb for Parameter path
              aSkipParameterized.push(1);
              return;
            } else {
              aSkipParameterized.push(0);
            }

            aPromises.push(oRootViewController.getTitleInfoFromPath(sPath));
          });
          return Promise.resolve(Promise.all(aPromises)).then(function (titleHierarchyInfos) {
            var idx, hierarchyPosition, oLink;

            var _iterator = _createForOfIteratorHelper(titleHierarchyInfos),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var titleHierarchyInfo = _step.value;
                hierarchyPosition = titleHierarchyInfos.indexOf(titleHierarchyInfo);
                idx = hierarchyPosition - aSkipParameterized[hierarchyPosition];
                oLink = oSource.getLinks()[idx] ? oSource.getLinks()[idx] : new Link(); //sCurrentEntity is a fallback value in case of empty title

                oLink.setText(titleHierarchyInfo.subtitle || titleHierarchyInfo.title); //We apply an additional encodeURI in case of special characters (ie "/") used in the url through the semantic keys

                oLink.setHref(encodeURI(titleHierarchyInfo.intent));

                if (!oSource.getLinks()[idx]) {
                  oSource.addLink(oLink);
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          });
        }, function (error) {
          Log.error("Error while setting the breadcrumb links:" + error);
        });

        return Promise.resolve(_temp17 && _temp17.then ? _temp17.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._checkDataPointTitleForExternalNavigation = function _checkDataPointTitleForExternalNavigation() {
      var oView = this.getView();
      var oInternalModelContext = oView.getBindingContext("internal");
      var oDataPoints = CommonUtils.getHeaderFacetItemConfigForExternalNavigation(oView.getViewData(), this.getAppComponent().getRoutingService().getOutbounds());
      var oShellServices = this.getAppComponent().getShellServices();
      var oPageContext = oView && oView.getBindingContext();
      oInternalModelContext.setProperty("isHeaderDPLinkVisible", {});

      if (oPageContext) {
        oPageContext.requestObject().then(function (oData) {
          fnGetLinks(oDataPoints, oData);
        }).catch(function (oError) {
          Log.error("Cannot retrieve the links from the shell service", oError);
        });
      }
      /**
       * @param oError
       */


      function fnOnError(oError) {
        Log.error(oError);
      }

      function fnSetLinkEnablement(id, aSupportedLinks) {
        var sLinkId = id; // process viable links from getLinks for all datapoints having outbound

        if (aSupportedLinks && aSupportedLinks.length === 1 && aSupportedLinks[0].supported) {
          oInternalModelContext.setProperty("isHeaderDPLinkVisible/".concat(sLinkId), true);
        }
      }
      /**
       * @param oSubDataPoints
       * @param oPageData
       */


      function fnGetLinks(oSubDataPoints, oPageData) {
        var _loop = function (sId) {
          var oDataPoint = oSubDataPoints[sId];
          var oParams = {};
          var oLink = oView.byId(sId);

          if (!oLink) {
            // for data points configured in app descriptor but not annotated in the header
            return "continue";
          }

          var oLinkContext = oLink.getBindingContext();
          var oLinkData = oLinkContext && oLinkContext.getObject();
          var oMixedContext = merge({}, oPageData, oLinkData); // process semantic object mappings

          if (oDataPoint.semanticObjectMapping) {
            var aSemanticObjectMapping = oDataPoint.semanticObjectMapping;

            for (var item in aSemanticObjectMapping) {
              var oMapping = aSemanticObjectMapping[item];
              var sMainProperty = oMapping["LocalProperty"]["$PropertyPath"];
              var sMappedProperty = oMapping["SemanticObjectProperty"];

              if (sMainProperty !== sMappedProperty) {
                if (oMixedContext.hasOwnProperty(sMainProperty)) {
                  var oNewMapping = {};
                  oNewMapping[sMappedProperty] = oMixedContext[sMainProperty];
                  oMixedContext = merge({}, oMixedContext, oNewMapping);
                  delete oMixedContext[sMainProperty];
                }
              }
            }
          }

          if (oMixedContext) {
            for (var sKey in oMixedContext) {
              if (sKey.indexOf("_") !== 0 && sKey.indexOf("odata.context") === -1) {
                oParams[sKey] = oMixedContext[sKey];
              }
            }
          } // validate if a link must be rendered


          oShellServices.isNavigationSupported([{
            target: {
              semanticObject: oDataPoint.semanticObject,
              action: oDataPoint.action
            },
            params: oParams
          }]).then(function (aLinks) {
            return fnSetLinkEnablement(sId, aLinks);
          }).catch(fnOnError);
        };

        for (var sId in oSubDataPoints) {
          var _ret = _loop(sId);

          if (_ret === "continue") continue;
        }
      }
    };

    return ObjectPageController;
  }(PageController), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "placeholder", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "editFlow", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "share", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_editFlow", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_routing", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "paginator", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "messageHandler", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "intentBasedNavigation", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_intentBasedNavigation", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "viewState", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "pageReady", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "massEdit", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "getExtensionAPI", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "getExtensionAPI"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPageReady", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "onPageReady"), _class2.prototype)), _class2)) || _class);
  return ObjectPageController;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiZmluYWxpemVyIiwiYmluZCIsIk9iamVjdFBhZ2VDb250cm9sbGVyIiwiZGVmaW5lVUk1Q2xhc3MiLCJ1c2luZ0V4dGVuc2lvbiIsIlBsYWNlaG9sZGVyIiwiRWRpdEZsb3ciLCJTaGFyZSIsIm92ZXJyaWRlIiwiU2hhcmVPdmVycmlkZXMiLCJJbnRlcm5hbEVkaXRGbG93IiwiRWRpdEZsb3dPdmVycmlkZXMiLCJJbnRlcm5hbFJvdXRpbmciLCJJbnRlcm5hbFJvdXRpbmdPdmVycmlkZSIsIlBhZ2luYXRvciIsIlBhZ2luYXRvck92ZXJyaWRlIiwiTWVzc2FnZUhhbmRsZXIiLCJNZXNzYWdlSGFuZGxlck92ZXJyaWRlIiwiSW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiSW50ZW50QmFzZWROYXZpZ2F0aW9uT3ZlcnJpZGUiLCJJbnRlcm5hbEludGVudEJhc2VkTmF2aWdhdGlvbiIsImdldE5hdmlnYXRpb25Nb2RlIiwiYklzU3RpY2t5RWRpdE1vZGUiLCJnZXRWaWV3IiwiZ2V0Q29udHJvbGxlciIsImdldFN0aWNreUVkaXRNb2RlIiwidW5kZWZpbmVkIiwiVmlld1N0YXRlIiwiVmlld1N0YXRlT3ZlcnJpZGVzIiwiUGFnZVJlYWR5IiwiaXNDb250ZXh0RXhwZWN0ZWQiLCJNYXNzRWRpdCIsInB1YmxpY0V4dGVuc2lvbiIsImZpbmFsRXh0ZW5zaW9uIiwiZXh0ZW5zaWJsZSIsIk92ZXJyaWRlRXhlY3V0aW9uIiwiQWZ0ZXIiLCJoYW5kbGVycyIsIm9uUHJpbWFyeUFjdGlvbiIsIm9Db250cm9sbGVyIiwib1ZpZXciLCJvQ29udGV4dCIsInNBY3Rpb25OYW1lIiwibVBhcmFtZXRlcnMiLCJtQ29uZGl0aW9ucyIsImlWaWV3TGV2ZWwiLCJnZXRWaWV3RGF0YSIsInZpZXdMZXZlbCIsIm9PYmplY3RQYWdlIiwiX2dldE9iamVjdFBhZ2VMYXlvdXRDb250cm9sIiwicG9zaXRpdmVBY3Rpb25WaXNpYmxlIiwicG9zaXRpdmVBY3Rpb25FbmFibGVkIiwib25DYWxsQWN0aW9uIiwiZWRpdEFjdGlvblZpc2libGUiLCJlZGl0QWN0aW9uRW5hYmxlZCIsIl9lZGl0RG9jdW1lbnQiLCJnZXRNb2RlbCIsImdldFByb3BlcnR5IiwiX3NhdmVEb2N1bWVudCIsIl9hcHBseURvY3VtZW50Iiwib25UYWJsZUNvbnRleHRDaGFuZ2UiLCJvRXZlbnQiLCJvU291cmNlIiwiZ2V0U291cmNlIiwib1RhYmxlIiwiX2ZpbmRUYWJsZXMiLCJzb21lIiwiX29UYWJsZSIsImdldFJvd0JpbmRpbmciLCJvQ3VycmVudEFjdGlvblByb21pc2UiLCJfZWRpdEZsb3ciLCJnZXRDdXJyZW50QWN0aW9uUHJvbWlzZSIsImFUYWJsZUNvbnRleHRzIiwiZ2V0VHlwZSIsImdldE1ldGFkYXRhIiwiaXNBIiwiZ2V0Q29udGV4dHMiLCJnZXRDdXJyZW50Q29udGV4dHMiLCJvQWN0aW9uUmVzcG9uc2UiLCJjb250cm9sSWQiLCJzSWQiLCJvQWN0aW9uRGF0YSIsIm9EYXRhIiwiYUtleXMiLCJrZXlzIiwiaU5ld0l0ZW1wIiwiZmluZCIsIm9UYWJsZUNvbnRleHQiLCJpIiwib1RhYmxlRGF0YSIsImdldE9iamVjdCIsImJDb21wYXJlIiwiZXZlcnkiLCJzS2V5IiwiYURpYWxvZ3MiLCJJbnN0YW5jZU1hbmFnZXIiLCJnZXRPcGVuRGlhbG9ncyIsIm9EaWFsb2ciLCJsZW5ndGgiLCJkaWFsb2ciLCJkYXRhIiwiYXR0YWNoRXZlbnRPbmNlIiwiZm9jdXNSb3ciLCJkZWxldGVDdXJyZW50QWN0aW9uUHJvbWlzZSIsImNhdGNoIiwiZXJyIiwiTG9nIiwiZXJyb3IiLCJtZXNzYWdlQnV0dG9uIiwiZmlyZU1vZGVsQ29udGV4dENoYW5nZSIsImVkaXRGbG93IiwiaW52b2tlQWN0aW9uIiwiX3Nob3dNZXNzYWdlUG9wb3ZlciIsIm9uRGF0YVBvaW50VGl0bGVQcmVzc2VkIiwib01hbmlmZXN0T3V0Ym91bmQiLCJzQ29udHJvbENvbmZpZyIsInNDb2xsZWN0aW9uUGF0aCIsIkpTT04iLCJwYXJzZSIsIm9UYXJnZXRJbmZvIiwiYVNlbWFudGljT2JqZWN0TWFwcGluZyIsIkNvbW1vblV0aWxzIiwiZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nIiwib0RhdGFQb2ludE9yQ2hhcnRCaW5kaW5nQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0Iiwic01ldGFQYXRoIiwiZ2V0TWV0YU1vZGVsIiwiZ2V0TWV0YVBhdGgiLCJnZXRQYXRoIiwiYU5hdmlnYXRpb25EYXRhIiwiX2dldENoYXJ0Q29udGV4dERhdGEiLCJhZGRpdGlvbmFsTmF2aWdhdGlvblBhcmFtZXRlcnMiLCJtYXAiLCJvTmF2aWdhdGlvbkRhdGEiLCJtZXRhUGF0aCIsInBhcmFtZXRlcnMiLCJvUGFyYW1zIiwiX2ludGVudEJhc2VkTmF2aWdhdGlvbiIsImdldE91dGJvdW5kUGFyYW1zIiwiT2JqZWN0Iiwic2VtYW50aWNPYmplY3QiLCJhY3Rpb24iLCJuYXZpZ2F0ZSIsIm5hdmlnYXRpb25Db250ZXh0cyIsInNlbWFudGljT2JqZWN0TWFwcGluZyIsIm9uQ2hldnJvblByZXNzTmF2aWdhdGVPdXRCb3VuZCIsInNPdXRib3VuZFRhcmdldCIsInNDcmVhdGVQYXRoIiwib25OYXZpZ2F0ZUNoYW5nZSIsImdldEV4dGVuc2lvbkFQSSIsInVwZGF0ZUFwcFN0YXRlIiwiYlNlY3Rpb25OYXZpZ2F0ZWQiLCJvSW50ZXJuYWxNb2RlbENvbnRleHQiLCJzZWN0aW9uTGF5b3V0Iiwib1N1YlNlY3Rpb24iLCJnZXRQYXJhbWV0ZXIiLCJfdXBkYXRlRm9jdXNJbkVkaXRNb2RlIiwib25WYXJpYW50U2VsZWN0ZWQiLCJvblZhcmlhbnRTYXZlZCIsInNldFRpbWVvdXQiLCJuYXZpZ2F0ZVRvU3ViU2VjdGlvbiIsInZEZXRhaWxDb25maWciLCJvRGV0YWlsQ29uZmlnIiwiYnlJZCIsIm9TZWN0aW9uIiwic2VjdGlvbklkIiwic3ViU2VjdGlvbklkIiwiZ2V0U3ViU2VjdGlvbnMiLCJnZXRQYXJlbnQiLCJnZXRWaXNpYmxlIiwiZ2V0UmVzb3VyY2VCdW5kbGUiLCJvUmVzb3VyY2VCdW5kbGUiLCJzVGl0bGUiLCJnZXRUcmFuc2xhdGVkVGV4dCIsImVudGl0eVNldCIsIk1lc3NhZ2VCb3giLCJzY3JvbGxUb1NlY3Rpb24iLCJnZXRJZCIsImZpcmVOYXZpZ2F0ZSIsInNlY3Rpb24iLCJzdWJTZWN0aW9uIiwib25DaGFydFNlbGVjdGlvbkNoYW5nZWQiLCJDaGFydFJ1bnRpbWUiLCJmblVwZGF0ZUNoYXJ0Iiwib25TdGF0ZUNoYW5nZSIsIm1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJcyIsIkV4dGVuc2lvbkFQSSIsImV4dGVuc2lvbkFQSSIsIm9uSW5pdCIsInNldFByb3BlcnR5IiwidmlzaWJpbGl0eSIsIml0ZW1zIiwiX2dldEJhdGNoR3JvdXBzRm9yVmlldyIsInVzZU5ld0xhenlMb2FkaW5nIiwiZ2V0RW5hYmxlTGF6eUxvYWRpbmciLCJhdHRhY2hFdmVudCIsIl9oYW5kbGVTdWJTZWN0aW9uRW50ZXJlZFZpZXdQb3J0Iiwib0l0ZW1CaW5kaW5nIiwiYXR0YWNoQ2hhbmdlIiwiX2ZuU2hvd09QTWVzc2FnZSIsIm9uRXhpdCIsImRlc3Ryb3kiLCJvTWVzc2FnZVBvcG92ZXIiLCJpc09wZW4iLCJjbG9zZSIsImlzS2VlcEFsaXZlIiwic2V0S2VlcEFsaXZlIiwiaXNDb25uZWN0ZWQiLCJkaXNjb25uZWN0IiwidmlldyIsIm1lc3NhZ2VzIiwiZ2V0SXRlbXMiLCJpdGVtIiwiZmlsdGVyIiwibWVzc2FnZSIsImdldFRhcmdldHMiLCJzaG93TWVzc2FnZXMiLCJfZ2V0VGFibGVCaW5kaW5nIiwib25CZWZvcmVSZW5kZXJpbmciLCJQYWdlQ29udHJvbGxlciIsInByb3RvdHlwZSIsImFwcGx5Iiwib1ZpZXdEYXRhIiwicmV0cmlldmVUZXh0RnJvbVZhbHVlTGlzdCIsIkNvbW1vbkhlbHBlciIsInNldE1ldGFNb2RlbCIsImdldEFwcENvbXBvbmVudCIsIm9uQWZ0ZXJSZW5kZXJpbmciLCJyZXNwb25zZSIsIm9FcnJvciIsIl9vbkJlZm9yZUJpbmRpbmciLCJhVGFibGVzIiwib0ludGVybmFsTW9kZWwiLCJhQmF0Y2hHcm91cHMiLCJvRmFzdENyZWF0aW9uUm93IiwicHVzaCIsImJEcmFmdE5hdmlnYXRpb24iLCJfY2xvc2VTaWRlQ29udGVudCIsIm9wQ29udGV4dCIsImhhc1BlbmRpbmdDaGFuZ2VzIiwiZ2V0QmluZGluZyIsInJlc2V0Q2hhbmdlcyIsImdldENyZWF0aW9uUm93Iiwic2V0QmluZGluZ0NvbnRleHQiLCJmblNjcm9sbFRvUHJlc2VudFNlY3Rpb24iLCJpc0ZpcnN0UmVuZGVyaW5nIiwiYlBlcnNpc3RPUFNjcm9sbCIsInNldFNlbGVjdGVkU2VjdGlvbiIsIm9EZWxlZ2F0ZU9uQmVmb3JlIiwiYWRkRXZlbnREZWxlZ2F0ZSIsInBhZ2VSZWFkeSIsInJlbW92ZUV2ZW50RGVsZWdhdGUiLCJvQmluZGluZyIsImxpc3RCaW5kaW5nIiwib1BhZ2luYXRvckN1cnJlbnRDb250ZXh0Iiwib0JpbmRpbmdUb1VzZSIsInBhZ2luYXRvciIsImluaXRpYWxpemUiLCJzQmluZGluZ1BhdGgiLCJ0ZXN0Iiwic0xpc3RCaW5kaW5nUGF0aCIsInJlcGxhY2UiLCJPRGF0YUxpc3RCaW5kaW5nIiwib01vZGVsIiwiX3NldExpc3RCaW5kaW5nQXN5bmMiLCJkZXRhY2hFdmVudCIsImFTZWN0aW9ucyIsImdldFNlY3Rpb25zIiwiYlVzZUljb25UYWJCYXIiLCJnZXRVc2VJY29uVGFiQmFyIiwiaVNraXAiLCJiSXNJbkVkaXRNb2RlIiwiYkVkaXRhYmxlSGVhZGVyIiwiZWRpdGFibGVIZWFkZXJDb250ZW50IiwiaVNlY3Rpb24iLCJhU3ViU2VjdGlvbnMiLCJpU3ViU2VjdGlvbiIsImlzVmlzaWJpbGl0eUR5bmFtaWMiLCJwbGFjZWhvbGRlciIsImlzUGxhY2Vob2xkZXJFbmFibGVkIiwic2hvd1BsYWNlaG9sZGVyIiwib05hdkNvbnRhaW5lciIsIm9Db250YWluZXIiLCJfZ2V0Rmlyc3RDbGlja2FibGVFbGVtZW50Iiwib0ZpcnN0Q2xpY2thYmxlRWxlbWVudCIsImFBY3Rpb25zIiwiZ2V0SGVhZGVyVGl0bGUiLCJnZXRBY3Rpb25zIiwib0FjdGlvbiIsImdldEVuYWJsZWQiLCJfZ2V0Rmlyc3RFbXB0eU1hbmRhdG9yeUZpZWxkRnJvbVN1YlNlY3Rpb24iLCJhQmxvY2tzIiwiZ2V0QmxvY2tzIiwiYmxvY2siLCJhRm9ybUNvbnRhaW5lcnMiLCJnZXRGb3JtQ29udGFpbmVycyIsImdldENvbnRlbnQiLCJmb3JtQ29udGFpbmVyIiwiYUZvcm1FbGVtZW50cyIsImdldEZvcm1FbGVtZW50cyIsImZvcm1FbGVtZW50IiwiYUZpZWxkcyIsImdldEZpZWxkcyIsImdldFJlcXVpcmVkIiwiZ2V0VmFsdWUiLCJkZWJ1ZyIsIm9NYW5kYXRvcnlGaWVsZCIsIm9GaWVsZFRvRm9jdXMiLCJjb250ZW50IiwiZ2V0Q29udGVudEVkaXQiLCJfZ2V0Rmlyc3RFZGl0YWJsZUlucHV0IiwiZm9jdXMiLCJfb25CYWNrTmF2aWdhdGlvbkluRHJhZnQiLCJtZXNzYWdlSGFuZGxlciIsInJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcyIsImdldFJvdXRlclByb3h5IiwiY2hlY2tJZkJhY2tIYXNTYW1lQ29udGV4dCIsImhpc3RvcnkiLCJiYWNrIiwiZHJhZnQiLCJwcm9jZXNzRGF0YUxvc3NPckRyYWZ0RGlzY2FyZENvbmZpcm1hdGlvbiIsIkZ1bmN0aW9uIiwiTmF2aWdhdGlvblR5cGUiLCJCYWNrTmF2aWdhdGlvbiIsIl9vbkFmdGVyQmluZGluZyIsIm9CaW5kaW5nQ29udGV4dCIsImVuYWJsZUZhc3RDcmVhdGlvblJvdyIsIm9MaXN0QmluZGluZyIsIm9GYXN0Q3JlYXRpb25MaXN0QmluZGluZyIsIm9GYXN0Q3JlYXRpb25Db250ZXh0Iiwib0ZpbmFsVUlTdGF0ZSIsImJpbmRMaXN0IiwiZ2V0Q29udGV4dCIsIiQkdXBkYXRlR3JvdXBJZCIsIiQkZ3JvdXBJZCIsInJlZnJlc2hJbnRlcm5hbCIsImNyZWF0ZSIsImNyZWF0ZWQiLCJ0cmFjZSIsIl9zaWRlRWZmZWN0cyIsImNsZWFyUHJvcGVydGllc1N0YXR1cyIsImFJQk5BY3Rpb25zIiwiZm9yRWFjaCIsImdldElCTkFjdGlvbnMiLCJvVGFibGVSb3dCaW5kaW5nIiwiTW9kZWxIZWxwZXIiLCJpc1N0aWNreVNlc3Npb25TdXBwb3J0ZWQiLCJyZW1vdmVDYWNoZXNBbmRNZXNzYWdlcyIsIm9BY3Rpb25PcGVyYXRpb25BdmFpbGFibGVNYXAiLCJwYXJzZUN1c3RvbURhdGEiLCJEZWxlZ2F0ZVV0aWwiLCJnZXRDdXN0b21EYXRhIiwiYVNlbGVjdGVkQ29udGV4dHMiLCJnZXRTZWxlY3RlZENvbnRleHRzIiwiQWN0aW9uUnVudGltZSIsInNldEFjdGlvbkVuYWJsZW1lbnQiLCJjbGVhclNlbGVjdGlvbiIsImdldFNlbWFudGljVGFyZ2V0c0Zyb21QYWdlTW9kZWwiLCJvT2JqZWN0UGFnZVRpdGxlIiwiYUlCTkhlYWRlckFjdGlvbnMiLCJjb25jYXQiLCJ1cGRhdGVEYXRhRmllbGRGb3JJQk5CdXR0b25zVmlzaWJpbGl0eSIsImhhbmRsZVRhYmxlTW9kaWZpY2F0aW9ucyIsImZuSGFuZGxlVGFibGVQYXRjaEV2ZW50cyIsImZuSGFuZGxlQ2hhbmdlIiwiZGV0YWNoQ2hhbmdlIiwiY29tcHV0ZUVkaXRNb2RlIiwiaXNDb2xsYWJvcmF0aW9uRHJhZnRTdXBwb3J0ZWQiLCJjb25uZWN0Iiwib0NhY2hlIiwiX3VwZGF0ZVJlbGF0ZWRBcHBzIiwiZm5VcGRhdGVSZWxhdGVkQXBwcyIsImRldGFjaERhdGFSZWNlaXZlZCIsImF0dGFjaERhdGFSZWNlaXZlZCIsImN1cnJlbnRCaW5kaW5nIiwiaGFuZGxlUGF0Y2hTZW50IiwiVGFibGVVdGlscyIsIndoZW5Cb3VuZCIsIl90cmlnZ2VyVmlzaWJsZVN1YlNlY3Rpb25zRXZlbnRzIiwib25QYWdlUmVhZHkiLCJzZXRGb2N1cyIsImlzSW5EaXNwbGF5TW9kZSIsIm9TZWxlY3RlZFNlY3Rpb24iLCJDb3JlIiwiZ2V0U2VsZWN0ZWRTZWN0aW9uIiwiYklzU3RpY2t5TW9kZSIsIm9BcHBDb21wb25lbnQiLCJnZXRTaGVsbFNlcnZpY2VzIiwic2V0QmFja05hdmlnYXRpb24iLCJnZXRBcHBTdGF0ZUhhbmRsZXIiLCJhcHBseUFwcFN0YXRlIiwiZm9yY2VGb2N1cyIsIkVycm9yIiwiX2NoZWNrRGF0YVBvaW50VGl0bGVGb3JFeHRlcm5hbE5hdmlnYXRpb24iLCJfZ2V0UGFnZVRpdGxlSW5mb3JtYXRpb24iLCJvT2JqZWN0UGFnZVN1YnRpdGxlIiwib0N1c3RvbURhdGEiLCJnZXRLZXkiLCJ0aXRsZSIsInN1YnRpdGxlIiwiaW50ZW50IiwiaWNvbiIsIl9leGVjdXRlSGVhZGVyU2hvcnRjdXQiLCJzQnV0dG9uSWQiLCJvQnV0dG9uIiwib0VsZW1lbnQiLCJmaXJlQnV0dG9uUHJlc3MiLCJfZXhlY3V0ZUZvb3RlclNob3J0Y3V0IiwiZ2V0Rm9vdGVyIiwiZ2V0TmFtZSIsIl9leGVjdXRlVGFiU2hvcnRDdXQiLCJvRXhlY3V0aW9uIiwiaVNlY3Rpb25JbmRleE1heCIsInNDb21tYW5kIiwiZ2V0Q29tbWFuZCIsIm5ld1NlY3Rpb24iLCJpU2VsZWN0ZWRTZWN0aW9uSW5kZXgiLCJpbmRleE9mU2VjdGlvbiIsIl9nZXRGb290ZXJWaXNpYmlsaXR5Iiwic1ZpZXdJZCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldE1lc3NhZ2VNYW5hZ2VyIiwiZ2V0TWVzc2FnZU1vZGVsIiwiZ2V0RGF0YSIsIm9NZXNzYWdlIiwidmFsaWRhdGlvbiIsInR5cGUiLCJ0YXJnZXQiLCJpbmRleE9mIiwib1JldCIsInJvb3RWaWV3Q29udHJvbGxlciIsImdldFJvb3RWaWV3Q29udHJvbGxlciIsImN1cnJlbnRQYWdlVmlldyIsImlzRmNsRW5hYmxlZCIsImdldFJpZ2h0bW9zdFZpZXciLCJnZXRSb290Q29udGFpbmVyIiwiZ2V0Q3VycmVudFBhZ2UiLCJvTWVzc2FnZUJ1dHRvbiIsImdldExlbmd0aCIsInNldFZpc2libGUiLCJvcGVuQnkiLCJCdXN5TG9ja2VyIiwibG9jayIsImVkaXREb2N1bWVudCIsImZpbmFsbHkiLCJ1bmxvY2siLCJnZXREcmFmdFJvb3RDb250ZXh0IiwiY29udGV4dCIsImRyYWZ0Um9vdENvbnRleHRQYXRoIiwiZ2V0RHJhZnRSb290UGF0aCIsInNpbXBsZURyYWZ0Um9vdENvbnRleHQiLCJleGlzdGluZ0JpbmRpbmdDb250ZXh0T25QYWdlIiwiZ2V0SW5zdGFuY2VkVmlld3MiLCJwYWdlVmlldyIsImludGVybmFsTW9kZWwiLCJtb2RlbCIsIm1ldGFNb2RlbCIsInNFbnRpdHlQYXRoIiwibURhdGFNb2RlbCIsIk1ldGFNb2RlbENvbnZlcnRlciIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsImJpbmRDb250ZXh0IiwiZ2V0Qm91bmRDb250ZXh0IiwicmVxdWVzdFByb3BlcnR5IiwidGFyZ2V0RW50aXR5VHlwZSIsIm5hbWUiLCJfdmFsaWRhdGVEb2N1bWVudCIsImNvbnRyb2wiLCJnZXRDdXJyZW50Rm9jdXNlZENvbnRyb2xJZCIsImlzVHJhbnNpZW50Iiwic3luY1Rhc2siLCJhcHBDb21wb25lbnQiLCJzaWRlRWZmZWN0c1NlcnZpY2UiLCJnZXRTaWRlRWZmZWN0c1NlcnZpY2UiLCJlbnRpdHlUeXBlIiwiZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0IiwiZ2xvYmFsU2lkZUVmZmVjdHMiLCJnZXRHbG9iYWxPRGF0YUVudGl0eVNpZGVFZmZlY3RzIiwiUHJvbWlzZSIsImFsbCIsInNpZGVFZmZlY3RzIiwicmVxdWVzdFNpZGVFZmZlY3RzIiwiZHJhZnRSb290Q29udGV4dCIsImV4ZWN1dGVEcmFmdFZhbGlkYXRpb24iLCJhV2FpdENyZWF0ZURvY3VtZW50cyIsImJFeGVjdXRlU2lkZUVmZmVjdHNPbkVycm9yIiwiY3JlYXRpb25Nb2RlIiwiY3JlYXRpb25Sb3ciLCJjcmVhdGVBdEVuZCIsImJDcmVhdGVEb2N1bWVudCIsImJTa2lwU2lkZUVmZmVjdHMiLCJjcmVhdGVEb2N1bWVudCIsImFCaW5kaW5ncyIsImJpbmRpbmdzIiwic2F2ZURvY3VtZW50IiwiaXNMb2NrZWQiLCJfbWFuYWdlQ29sbGFib3JhdGlvbiIsIm9wZW5NYW5hZ2VEaWFsb2ciLCJfc2hvd0NvbGxhYm9yYXRpb25Vc2VyRGV0YWlscyIsImV2ZW50Iiwic2hvd1VzZXJEZXRhaWxzIiwiX2NhbmNlbERvY3VtZW50IiwiY2FuY2VsQnV0dG9uIiwiY2FuY2VsRG9jdW1lbnQiLCJhcHBseURvY3VtZW50IiwicmVzb2x2ZVN0cmluZ3RvQm9vbGVhbiIsInVwZGF0ZVJlbGF0ZWRBcHBzRGV0YWlscyIsIl9maW5kQ29udHJvbEluU3ViU2VjdGlvbiIsImFQYXJlbnRFbGVtZW50IiwiYVN1YnNlY3Rpb24iLCJhQ29udHJvbHMiLCJiSXNDaGFydCIsImFTdWJTZWN0aW9uVGFibGVzIiwiZWxlbWVudCIsIm1BZ2dyZWdhdGlvbnMiLCJnZXRBZ2dyZWdhdGlvbiIsImFJdGVtcyIsIm9JdGVtIiwiZ2V0TWFpbkNvbnRlbnQiLCJncmlkVGFibGUiLCJoYXNTdHlsZUNsYXNzIiwiYWRkU3R5bGVDbGFzcyIsIl9nZXRBbGxTdWJTZWN0aW9ucyIsIl9nZXRBbGxCbG9ja3MiLCJnZXRNb3JlQmxvY2tzIiwiX2ZpbmRDaGFydHMiLCJhQ2hhcnRzIiwib0Jsb2NrIiwib0NvbnRlbnQiLCJzZXRTaG93U2lkZUNvbnRlbnQiLCJvQ2hhcnRDb250ZXh0Iiwic0NoYXJ0UGF0aCIsIm9Db250ZXh0RGF0YSIsIm9DaGFydENvbnRleHREYXRhIiwiX3Njcm9sbFRhYmxlc1RvUm93Iiwic1Jvd1BhdGgiLCJUYWJsZVNjcm9sbGVyIiwic2Nyb2xsVGFibGVUb1JvdyIsIl9tZXJnZU11bHRpcGxlQ29udGV4dHMiLCJvUGFnZUNvbnRleHQiLCJhTGluZUNvbnRleHQiLCJhQXR0cmlidXRlcyIsImFQYWdlQXR0cmlidXRlcyIsInNNZXRhUGF0aExpbmUiLCJzUGF0aExpbmUiLCJzUGFnZVBhdGgiLCJvTWV0YU1vZGVsIiwic01ldGFQYXRoUGFnZSIsIm9TaW5nbGVDb250ZXh0Iiwib1N1YkNoYXJ0Q29udGV4dERhdGEiLCJjb250ZXh0RGF0YSIsInJlbW92ZVNlbnNpdGl2ZURhdGEiLCJvUGFnZUxldmVsU1YiLCJhZGRQYWdlQ29udGV4dFRvU2VsZWN0aW9uVmFyaWFudCIsIlNlbGVjdGlvblZhcmlhbnQiLCJzZWxlY3Rpb25WYXJpYW50IiwiYXR0cmlidXRlcyIsIm9Db25maWd1cmF0aW9ucyIsImNvbnRyb2xDb25maWd1cmF0aW9uIiwiYUNvbmZpZ3VyYXRpb25zIiwib0NvbmZpZ3VyYXRpb24iLCJyZXF1ZXN0R3JvdXBJZCIsIl9zZXRCcmVhZGNydW1iTGlua3MiLCJhUHJvbWlzZXMiLCJhU2tpcFBhcmFtZXRlcml6ZWQiLCJzTmV3UGF0aCIsImFQYXRoUGFydHMiLCJzcGxpdCIsInNQYXRoIiwic2hpZnQiLCJzcGxpY2UiLCJzUGF0aFBhcnQiLCJvUm9vdFZpZXdDb250cm9sbGVyIiwic1BhcmFtZXRlclBhdGgiLCJiUmVzdWx0Q29udGV4dCIsImdldFRpdGxlSW5mb0Zyb21QYXRoIiwidGl0bGVIaWVyYXJjaHlJbmZvcyIsImlkeCIsImhpZXJhcmNoeVBvc2l0aW9uIiwib0xpbmsiLCJ0aXRsZUhpZXJhcmNoeUluZm8iLCJnZXRMaW5rcyIsIkxpbmsiLCJzZXRUZXh0Iiwic2V0SHJlZiIsImVuY29kZVVSSSIsImFkZExpbmsiLCJvRGF0YVBvaW50cyIsImdldEhlYWRlckZhY2V0SXRlbUNvbmZpZ0ZvckV4dGVybmFsTmF2aWdhdGlvbiIsImdldFJvdXRpbmdTZXJ2aWNlIiwiZ2V0T3V0Ym91bmRzIiwib1NoZWxsU2VydmljZXMiLCJyZXF1ZXN0T2JqZWN0IiwiZm5HZXRMaW5rcyIsImZuT25FcnJvciIsImZuU2V0TGlua0VuYWJsZW1lbnQiLCJpZCIsImFTdXBwb3J0ZWRMaW5rcyIsInNMaW5rSWQiLCJzdXBwb3J0ZWQiLCJvU3ViRGF0YVBvaW50cyIsIm9QYWdlRGF0YSIsIm9EYXRhUG9pbnQiLCJvTGlua0NvbnRleHQiLCJvTGlua0RhdGEiLCJvTWl4ZWRDb250ZXh0IiwibWVyZ2UiLCJvTWFwcGluZyIsInNNYWluUHJvcGVydHkiLCJzTWFwcGVkUHJvcGVydHkiLCJoYXNPd25Qcm9wZXJ0eSIsIm9OZXdNYXBwaW5nIiwiaXNOYXZpZ2F0aW9uU3VwcG9ydGVkIiwicGFyYW1zIiwiYUxpbmtzIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJPYmplY3RQYWdlQ29udHJvbGxlci5jb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwic2FwL2Jhc2UvdXRpbC9tZXJnZVwiO1xuaW1wb3J0IEFjdGlvblJ1bnRpbWUgZnJvbSBcInNhcC9mZS9jb3JlL0FjdGlvblJ1bnRpbWVcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCBCdXN5TG9ja2VyIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9CdXN5TG9ja2VyXCI7XG5pbXBvcnQgeyBjb25uZWN0LCBkaXNjb25uZWN0LCBpc0Nvbm5lY3RlZCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9jb2xsYWJvcmF0aW9uL0FjdGl2aXR5U3luY1wiO1xuaW1wb3J0IHsgb3Blbk1hbmFnZURpYWxvZywgc2hvd1VzZXJEZXRhaWxzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2NvbGxhYm9yYXRpb24vTWFuYWdlXCI7XG5pbXBvcnQgRWRpdEZsb3cgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0VkaXRGbG93XCI7XG5pbXBvcnQgZHJhZnQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L2RyYWZ0XCI7XG5pbXBvcnQgSW50ZW50QmFzZWROYXZpZ2F0aW9uIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9JbnRlbnRCYXNlZE5hdmlnYXRpb25cIjtcbmltcG9ydCBJbnRlcm5hbEVkaXRGbG93IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9JbnRlcm5hbEVkaXRGbG93XCI7XG5pbXBvcnQgSW50ZXJuYWxJbnRlbnRCYXNlZE5hdmlnYXRpb24gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0ludGVybmFsSW50ZW50QmFzZWROYXZpZ2F0aW9uXCI7XG5pbXBvcnQgSW50ZXJuYWxSb3V0aW5nIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9JbnRlcm5hbFJvdXRpbmdcIjtcbmltcG9ydCBNYXNzRWRpdCBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvTWFzc0VkaXRcIjtcbmltcG9ydCBNZXNzYWdlSGFuZGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvTWVzc2FnZUhhbmRsZXJcIjtcbmltcG9ydCBQYWdlUmVhZHkgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL1BhZ2VSZWFkeVwiO1xuaW1wb3J0IFBhZ2luYXRvciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvUGFnaW5hdG9yXCI7XG5pbXBvcnQgUGxhY2Vob2xkZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL1BsYWNlaG9sZGVyXCI7XG5pbXBvcnQgU2hhcmUgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL1NoYXJlXCI7XG5pbXBvcnQgVmlld1N0YXRlIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9WaWV3U3RhdGVcIjtcbmltcG9ydCAqIGFzIE1ldGFNb2RlbENvbnZlcnRlciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBleHRlbnNpYmxlLCBmaW5hbEV4dGVuc2lvbiwgcHVibGljRXh0ZW5zaW9uLCB1c2luZ0V4dGVuc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbE1vZGVsQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIFJvb3RDb250YWluZXJCYXNlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvcm9vdFZpZXcvUm9vdFZpZXdCYXNlQ29udHJvbGxlclwiO1xuaW1wb3J0IFJvb3RWaWV3QmFzZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL3Jvb3RWaWV3L1Jvb3RWaWV3QmFzZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBDaGFydFJ1bnRpbWUgZnJvbSBcInNhcC9mZS9tYWNyb3MvY2hhcnQvQ2hhcnRSdW50aW1lXCI7XG5pbXBvcnQgQ29tbW9uSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IERlbGVnYXRlVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9EZWxlZ2F0ZVV0aWxcIjtcbmltcG9ydCBUYWJsZVV0aWxzIGZyb20gXCJzYXAvZmUvbWFjcm9zL3RhYmxlL1V0aWxzXCI7XG5pbXBvcnQgU2VsZWN0aW9uVmFyaWFudCBmcm9tIFwic2FwL2ZlL25hdmlnYXRpb24vU2VsZWN0aW9uVmFyaWFudFwiO1xuaW1wb3J0IHR5cGUgeyBkZWZhdWx0IGFzIE9iamVjdFBhZ2VFeHRlbnNpb25BUEkgfSBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9PYmplY3RQYWdlL0V4dGVuc2lvbkFQSVwiO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBFeHRlbnNpb25BUEkgfSBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9PYmplY3RQYWdlL0V4dGVuc2lvbkFQSVwiO1xuaW1wb3J0IEVkaXRGbG93T3ZlcnJpZGVzIGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL1Jvb3RDb250YWluZXIvb3ZlcnJpZGVzL0VkaXRGbG93XCI7XG5pbXBvcnQgVGFibGVTY3JvbGxlciBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9UYWJsZVNjcm9sbGVyXCI7XG5pbXBvcnQgSW5zdGFuY2VNYW5hZ2VyIGZyb20gXCJzYXAvbS9JbnN0YW5jZU1hbmFnZXJcIjtcbmltcG9ydCBMaW5rIGZyb20gXCJzYXAvbS9MaW5rXCI7XG5pbXBvcnQgTWVzc2FnZUJveCBmcm9tIFwic2FwL20vTWVzc2FnZUJveFwiO1xuaW1wb3J0IHR5cGUgUG9wb3ZlciBmcm9tIFwic2FwL20vUG9wb3ZlclwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCJzYXAvdWkvY29yZS9tZXNzYWdlL01lc3NhZ2VcIjtcbmltcG9ydCBPdmVycmlkZUV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL092ZXJyaWRlRXhlY3V0aW9uXCI7XG5pbXBvcnQgdHlwZSBWaWV3IGZyb20gXCJzYXAvdWkvY29yZS9tdmMvVmlld1wiO1xuaW1wb3J0IHR5cGUgQmluZGluZyBmcm9tIFwic2FwL3VpL21vZGVsL0JpbmRpbmdcIjtcbmltcG9ydCB0eXBlIEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuaW1wb3J0IE9EYXRhTGlzdEJpbmRpbmcgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YUxpc3RCaW5kaW5nXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgUmVzb3VyY2VNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL3Jlc291cmNlL1Jlc291cmNlTW9kZWxcIjtcbmltcG9ydCB0eXBlIEJyZWFkQ3J1bWJzIGZyb20gXCJzYXAvdXhhcC9CcmVhZENydW1ic1wiO1xuaW1wb3J0IHR5cGUgT2JqZWN0UGFnZUR5bmFtaWNIZWFkZXJUaXRsZSBmcm9tIFwic2FwL3V4YXAvT2JqZWN0UGFnZUR5bmFtaWNIZWFkZXJUaXRsZVwiO1xuaW1wb3J0IHR5cGUgT2JqZWN0UGFnZUxheW91dCBmcm9tIFwic2FwL3V4YXAvT2JqZWN0UGFnZUxheW91dFwiO1xuaW1wb3J0IHR5cGUgT2JqZWN0UGFnZVNlY3Rpb24gZnJvbSBcInNhcC91eGFwL09iamVjdFBhZ2VTZWN0aW9uXCI7XG5pbXBvcnQgdHlwZSBPYmplY3RQYWdlU3ViU2VjdGlvbiBmcm9tIFwic2FwL3V4YXAvT2JqZWN0UGFnZVN1YlNlY3Rpb25cIjtcbmltcG9ydCB0eXBlIHsgT0RhdGFDb250ZXh0QmluZGluZ0V4LCBWNENvbnRleHQgfSBmcm9tIFwidHlwZXMvZXh0ZW5zaW9uX3R5cGVzXCI7XG5pbXBvcnQgSW50ZW50QmFzZWROYXZpZ2F0aW9uT3ZlcnJpZGUgZnJvbSBcIi4vb3ZlcnJpZGVzL0ludGVudEJhc2VkTmF2aWdhdGlvblwiO1xuaW1wb3J0IEludGVybmFsUm91dGluZ092ZXJyaWRlIGZyb20gXCIuL292ZXJyaWRlcy9JbnRlcm5hbFJvdXRpbmdcIjtcbmltcG9ydCBNZXNzYWdlSGFuZGxlck92ZXJyaWRlIGZyb20gXCIuL292ZXJyaWRlcy9NZXNzYWdlSGFuZGxlclwiO1xuaW1wb3J0IFBhZ2luYXRvck92ZXJyaWRlIGZyb20gXCIuL292ZXJyaWRlcy9QYWdpbmF0b3JcIjtcbmltcG9ydCBTaGFyZU92ZXJyaWRlcyBmcm9tIFwiLi9vdmVycmlkZXMvU2hhcmVcIjtcbmltcG9ydCBWaWV3U3RhdGVPdmVycmlkZXMgZnJvbSBcIi4vb3ZlcnJpZGVzL1ZpZXdTdGF0ZVwiO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUudGVtcGxhdGVzLk9iamVjdFBhZ2UuT2JqZWN0UGFnZUNvbnRyb2xsZXJcIilcbmNsYXNzIE9iamVjdFBhZ2VDb250cm9sbGVyIGV4dGVuZHMgUGFnZUNvbnRyb2xsZXIge1xuXHRvVmlldyE6IGFueTtcblx0QHVzaW5nRXh0ZW5zaW9uKFBsYWNlaG9sZGVyKVxuXHRwbGFjZWhvbGRlciE6IFBsYWNlaG9sZGVyO1xuXHRAdXNpbmdFeHRlbnNpb24oRWRpdEZsb3cpXG5cdGVkaXRGbG93ITogRWRpdEZsb3c7XG5cdEB1c2luZ0V4dGVuc2lvbihTaGFyZS5vdmVycmlkZShTaGFyZU92ZXJyaWRlcykpXG5cdHNoYXJlITogU2hhcmU7XG5cdEB1c2luZ0V4dGVuc2lvbihJbnRlcm5hbEVkaXRGbG93Lm92ZXJyaWRlKEVkaXRGbG93T3ZlcnJpZGVzKSlcblx0X2VkaXRGbG93ITogSW50ZXJuYWxFZGl0Rmxvdztcblx0QHVzaW5nRXh0ZW5zaW9uKEludGVybmFsUm91dGluZy5vdmVycmlkZShJbnRlcm5hbFJvdXRpbmdPdmVycmlkZSkpXG5cdF9yb3V0aW5nITogSW50ZXJuYWxSb3V0aW5nO1xuXHRAdXNpbmdFeHRlbnNpb24oUGFnaW5hdG9yLm92ZXJyaWRlKFBhZ2luYXRvck92ZXJyaWRlKSlcblx0cGFnaW5hdG9yITogUGFnaW5hdG9yO1xuXHRAdXNpbmdFeHRlbnNpb24oTWVzc2FnZUhhbmRsZXIub3ZlcnJpZGUoTWVzc2FnZUhhbmRsZXJPdmVycmlkZSkpXG5cdG1lc3NhZ2VIYW5kbGVyITogTWVzc2FnZUhhbmRsZXI7XG5cdEB1c2luZ0V4dGVuc2lvbihJbnRlbnRCYXNlZE5hdmlnYXRpb24ub3ZlcnJpZGUoSW50ZW50QmFzZWROYXZpZ2F0aW9uT3ZlcnJpZGUpKVxuXHRpbnRlbnRCYXNlZE5hdmlnYXRpb24hOiBJbnRlbnRCYXNlZE5hdmlnYXRpb247XG5cdEB1c2luZ0V4dGVuc2lvbihcblx0XHRJbnRlcm5hbEludGVudEJhc2VkTmF2aWdhdGlvbi5vdmVycmlkZSh7XG5cdFx0XHRnZXROYXZpZ2F0aW9uTW9kZTogZnVuY3Rpb24gKHRoaXM6IEludGVybmFsSW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdGNvbnN0IGJJc1N0aWNreUVkaXRNb2RlID1cblx0XHRcdFx0XHQodGhpcy5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIE9iamVjdFBhZ2VDb250cm9sbGVyKS5nZXRTdGlja3lFZGl0TW9kZSAmJlxuXHRcdFx0XHRcdCh0aGlzLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgT2JqZWN0UGFnZUNvbnRyb2xsZXIpLmdldFN0aWNreUVkaXRNb2RlKCk7XG5cdFx0XHRcdHJldHVybiBiSXNTdGlja3lFZGl0TW9kZSA/IFwiZXhwbGFjZVwiIDogdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH0pXG5cdClcblx0X2ludGVudEJhc2VkTmF2aWdhdGlvbiE6IEludGVybmFsSW50ZW50QmFzZWROYXZpZ2F0aW9uO1xuXHRAdXNpbmdFeHRlbnNpb24oVmlld1N0YXRlLm92ZXJyaWRlKFZpZXdTdGF0ZU92ZXJyaWRlcykpXG5cdHZpZXdTdGF0ZSE6IFZpZXdTdGF0ZTtcblx0QHVzaW5nRXh0ZW5zaW9uKFxuXHRcdFBhZ2VSZWFkeS5vdmVycmlkZSh7XG5cdFx0XHRpc0NvbnRleHRFeHBlY3RlZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KVxuXHQpXG5cdHBhZ2VSZWFkeSE6IFBhZ2VSZWFkeTtcblx0QHVzaW5nRXh0ZW5zaW9uKE1hc3NFZGl0KVxuXHRtYXNzRWRpdCE6IE1hc3NFZGl0O1xuXHRwcml2YXRlIG1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJcz86IFJlY29yZDxzdHJpbmcsIE9iamVjdFBhZ2VFeHRlbnNpb25BUEk+O1xuXHRwcm90ZWN0ZWQgZXh0ZW5zaW9uQVBJPzogT2JqZWN0UGFnZUV4dGVuc2lvbkFQSTtcblx0cHJpdmF0ZSBvUmVzb3VyY2VCdW5kbGU/OiBSZXNvdXJjZUJ1bmRsZTtcblx0cHJpdmF0ZSBiU2VjdGlvbk5hdmlnYXRlZD86IGJvb2xlYW47XG5cdHByaXZhdGUgc3dpdGNoRHJhZnRBbmRBY3RpdmVQb3BPdmVyPzogUG9wb3Zlcjtcblx0cHJpdmF0ZSBjdXJyZW50QmluZGluZz86IEJpbmRpbmc7XG5cdHByaXZhdGUgbWVzc2FnZUJ1dHRvbjogYW55O1xuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRnZXRFeHRlbnNpb25BUEkoc0lkPzogc3RyaW5nKTogRXh0ZW5zaW9uQVBJIHtcblx0XHRpZiAoc0lkKSB7XG5cdFx0XHQvLyB0byBhbGxvdyBsb2NhbCBJRCB1c2FnZSBmb3IgY3VzdG9tIHBhZ2VzIHdlJ2xsIGNyZWF0ZS9yZXR1cm4gb3duIGluc3RhbmNlcyBmb3IgY3VzdG9tIHNlY3Rpb25zXG5cdFx0XHR0aGlzLm1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJcyA9IHRoaXMubUN1c3RvbVNlY3Rpb25FeHRlbnNpb25BUElzIHx8IHt9O1xuXG5cdFx0XHRpZiAoIXRoaXMubUN1c3RvbVNlY3Rpb25FeHRlbnNpb25BUElzW3NJZF0pIHtcblx0XHRcdFx0dGhpcy5tQ3VzdG9tU2VjdGlvbkV4dGVuc2lvbkFQSXNbc0lkXSA9IG5ldyBFeHRlbnNpb25BUEkodGhpcywgc0lkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLm1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJc1tzSWRdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIXRoaXMuZXh0ZW5zaW9uQVBJKSB7XG5cdFx0XHRcdHRoaXMuZXh0ZW5zaW9uQVBJID0gbmV3IEV4dGVuc2lvbkFQSSh0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLmV4dGVuc2lvbkFQSTtcblx0XHR9XG5cdH1cblxuXHRvbkluaXQoKSB7XG5cdFx0c3VwZXIub25Jbml0KCk7XG5cdFx0Y29uc3Qgb09iamVjdFBhZ2UgPSB0aGlzLl9nZXRPYmplY3RQYWdlTGF5b3V0Q29udHJvbCgpO1xuXG5cdFx0Ly8gU2V0dGluZyBkZWZhdWx0cyBvZiBpbnRlcm5hbCBtb2RlbCBjb250ZXh0XG5cdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gdGhpcy5nZXRWaWV3KCkuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQ/LnNldFByb3BlcnR5KFwiZXh0ZXJuYWxOYXZpZ2F0aW9uQ29udGV4dFwiLCB7IFwicGFnZVwiOiB0cnVlIH0pO1xuXHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dD8uc2V0UHJvcGVydHkoXCJyZWxhdGVkQXBwc1wiLCB7XG5cdFx0XHR2aXNpYmlsaXR5OiBmYWxzZSxcblx0XHRcdGl0ZW1zOiBudWxsXG5cdFx0fSk7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcImJhdGNoR3JvdXBzXCIsIHRoaXMuX2dldEJhdGNoR3JvdXBzRm9yVmlldygpKTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQ/LnNldFByb3BlcnR5KFwiZXJyb3JOYXZpZ2F0aW9uU2VjdGlvbkZsYWdcIiwgZmFsc2UpO1xuXHRcdGlmICghKHRoaXMuZ2V0VmlldygpLmdldFZpZXdEYXRhKCkgYXMgYW55KS51c2VOZXdMYXp5TG9hZGluZyAmJiAob09iamVjdFBhZ2UgYXMgYW55KS5nZXRFbmFibGVMYXp5TG9hZGluZygpKSB7XG5cdFx0XHQvL0F0dGFjaGluZyB0aGUgZXZlbnQgdG8gbWFrZSB0aGUgc3Vic2VjdGlvbiBjb250ZXh0IGJpbmRpbmcgYWN0aXZlIHdoZW4gaXQgaXMgdmlzaWJsZS5cblx0XHRcdG9PYmplY3RQYWdlLmF0dGFjaEV2ZW50KFwic3ViU2VjdGlvbkVudGVyZWRWaWV3UG9ydFwiLCB0aGlzLl9oYW5kbGVTdWJTZWN0aW9uRW50ZXJlZFZpZXdQb3J0LmJpbmQodGhpcykpO1xuXHRcdH1cblx0XHR0aGlzLm1lc3NhZ2VCdXR0b24gPSB0aGlzLmdldFZpZXcoKS5ieUlkKFwiZmU6OkZvb3RlckJhcjo6TWVzc2FnZUJ1dHRvblwiKTtcblx0XHR0aGlzLm1lc3NhZ2VCdXR0b24ub0l0ZW1CaW5kaW5nLmF0dGFjaENoYW5nZSh0aGlzLl9mblNob3dPUE1lc3NhZ2UsIHRoaXMpO1xuXHR9XG5cblx0b25FeGl0KCkge1xuXHRcdGlmICh0aGlzLm1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJcykge1xuXHRcdFx0Zm9yIChjb25zdCBzSWQgb2YgT2JqZWN0LmtleXModGhpcy5tQ3VzdG9tU2VjdGlvbkV4dGVuc2lvbkFQSXMpKSB7XG5cdFx0XHRcdGlmICh0aGlzLm1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJc1tzSWRdKSB7XG5cdFx0XHRcdFx0dGhpcy5tQ3VzdG9tU2VjdGlvbkV4dGVuc2lvbkFQSXNbc0lkXS5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGRlbGV0ZSB0aGlzLm1DdXN0b21TZWN0aW9uRXh0ZW5zaW9uQVBJcztcblx0XHR9XG5cdFx0aWYgKHRoaXMuZXh0ZW5zaW9uQVBJKSB7XG5cdFx0XHR0aGlzLmV4dGVuc2lvbkFQSS5kZXN0cm95KCk7XG5cdFx0fVxuXHRcdGRlbGV0ZSB0aGlzLmV4dGVuc2lvbkFQSTtcblxuXHRcdGNvbnN0IG9NZXNzYWdlUG9wb3ZlciA9IHRoaXMubWVzc2FnZUJ1dHRvbiA/IHRoaXMubWVzc2FnZUJ1dHRvbi5vTWVzc2FnZVBvcG92ZXIgOiBudWxsO1xuXHRcdGlmIChvTWVzc2FnZVBvcG92ZXIgJiYgb01lc3NhZ2VQb3BvdmVyLmlzT3BlbigpKSB7XG5cdFx0XHRvTWVzc2FnZVBvcG92ZXIuY2xvc2UoKTtcblx0XHR9XG5cdFx0Ly93aGVuIGV4aXRpbmcgd2Ugc2V0IGtlZXBBbGl2ZSBjb250ZXh0IHRvIGZhbHNlXG5cdFx0Y29uc3Qgb0NvbnRleHQgPSB0aGlzLmdldFZpZXcoKS5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIENvbnRleHQ7XG5cdFx0aWYgKG9Db250ZXh0ICYmIG9Db250ZXh0LmlzS2VlcEFsaXZlKCkpIHtcblx0XHRcdG9Db250ZXh0LnNldEtlZXBBbGl2ZShmYWxzZSk7XG5cdFx0fVxuXHRcdGlmIChpc0Nvbm5lY3RlZCh0aGlzLmdldFZpZXcoKSkpIHtcblx0XHRcdGRpc2Nvbm5lY3QodGhpcy5nZXRWaWV3KCkpOyAvLyBDbGVhbnVwIGNvbGxhYm9yYXRpb24gY29ubmVjdGlvbiB3aGVuIGxlYXZpbmcgdGhlIGFwcFxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gc2hvdyB0aGUgbWVzc2FnZSBzdHJpcCBvbiB0aGUgb2JqZWN0IHBhZ2UuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZm5TaG93T1BNZXNzYWdlKCkge1xuXHRcdGNvbnN0IGV4dGVuc2lvbkFQSSA9IHRoaXMuZ2V0RXh0ZW5zaW9uQVBJKCk7XG5cdFx0Y29uc3QgdmlldyA9IHRoaXMuZ2V0VmlldygpO1xuXHRcdGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlQnV0dG9uLm9NZXNzYWdlUG9wb3ZlclxuXHRcdFx0LmdldEl0ZW1zKClcblx0XHRcdC5tYXAoKGl0ZW06IGFueSkgPT4gaXRlbS5nZXRCaW5kaW5nQ29udGV4dChcIm1lc3NhZ2VcIikuZ2V0T2JqZWN0KCkpXG5cdFx0XHQuZmlsdGVyKChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG5cdFx0XHRcdHJldHVybiBtZXNzYWdlLmdldFRhcmdldHMoKVswXSA9PT0gdmlldy5nZXRCaW5kaW5nQ29udGV4dCgpPy5nZXRQYXRoKCk7XG5cdFx0XHR9KTtcblxuXHRcdGlmIChleHRlbnNpb25BUEkpIHtcblx0XHRcdGV4dGVuc2lvbkFQSS5zaG93TWVzc2FnZXMobWVzc2FnZXMpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRUYWJsZUJpbmRpbmcob1RhYmxlOiBhbnkpIHtcblx0XHRyZXR1cm4gb1RhYmxlICYmIG9UYWJsZS5nZXRSb3dCaW5kaW5nKCk7XG5cdH1cblxuXHRvbkJlZm9yZVJlbmRlcmluZygpIHtcblx0XHRQYWdlQ29udHJvbGxlci5wcm90b3R5cGUub25CZWZvcmVSZW5kZXJpbmcuYXBwbHkodGhpcyk7XG5cdFx0Ly8gSW4gdGhlIHJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3Qgc2NlbmFyaW8gd2UgbmVlZCB0byBlbnN1cmUgaW4gY2FzZSBvZiByZWxvYWQvcmVmcmVzaCB0aGF0IHRoZSBtZXRhIG1vZGVsIGluIHRoZSBtZXRob2RlIHJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3Qgb2YgdGhlIEZpZWxkUnVudGltZSBpcyBhdmFpbGFibGVcblx0XHRpZiAodGhpcy5vVmlldy5vVmlld0RhdGE/LnJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3QgJiYgQ29tbW9uSGVscGVyLmdldE1ldGFNb2RlbCgpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdENvbW1vbkhlbHBlci5zZXRNZXRhTW9kZWwodGhpcy5nZXRBcHBDb21wb25lbnQoKS5nZXRNZXRhTW9kZWwoKSk7XG5cdFx0fVxuXHR9XG5cblx0b25BZnRlclJlbmRlcmluZygpIHtcblx0XHQoKHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikgYXMgUmVzb3VyY2VNb2RlbCkuZ2V0UmVzb3VyY2VCdW5kbGUoKSBhcyBQcm9taXNlPFJlc291cmNlQnVuZGxlPilcblx0XHRcdC50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XG5cdFx0XHRcdHRoaXMub1Jlc291cmNlQnVuZGxlID0gcmVzcG9uc2U7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSByZXRyaWV2aW5nIHRoZSByZXNvdXJjZSBidW5kbGVcIiwgb0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0X29uQmVmb3JlQmluZGluZyhvQ29udGV4dDogYW55LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdFx0Ly8gVE9ETzogd2Ugc2hvdWxkIGNoZWNrIGhvdyB0aGlzIGNvbWVzIHRvZ2V0aGVyIHdpdGggdGhlIHRyYW5zYWN0aW9uIGhlbHBlciwgc2FtZSB0byB0aGUgY2hhbmdlIGluIHRoZSBhZnRlckJpbmRpbmdcblx0XHRjb25zdCBhVGFibGVzID0gdGhpcy5fZmluZFRhYmxlcygpLFxuXHRcdFx0b09iamVjdFBhZ2UgPSB0aGlzLl9nZXRPYmplY3RQYWdlTGF5b3V0Q29udHJvbCgpLFxuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0ID0gdGhpcy5nZXRWaWV3KCkuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dCxcblx0XHRcdG9JbnRlcm5hbE1vZGVsID0gdGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKSBhcyBKU09OTW9kZWwsXG5cdFx0XHRhQmF0Y2hHcm91cHMgPSBvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJiYXRjaEdyb3Vwc1wiKSxcblx0XHRcdGlWaWV3TGV2ZWwgPSAodGhpcy5nZXRWaWV3KCkuZ2V0Vmlld0RhdGEoKSBhcyBhbnkpLnZpZXdMZXZlbDtcblx0XHRsZXQgb0Zhc3RDcmVhdGlvblJvdztcblx0XHRhQmF0Y2hHcm91cHMucHVzaChcIiRhdXRvXCIpO1xuXHRcdGlmIChtUGFyYW1ldGVycy5iRHJhZnROYXZpZ2F0aW9uICE9PSB0cnVlKSB7XG5cdFx0XHR0aGlzLl9jbG9zZVNpZGVDb250ZW50KCk7XG5cdFx0fVxuXHRcdGNvbnN0IG9wQ29udGV4dCA9IG9PYmplY3RQYWdlLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dDtcblx0XHRpZiAoXG5cdFx0XHRvcENvbnRleHQgJiZcblx0XHRcdG9wQ29udGV4dC5oYXNQZW5kaW5nQ2hhbmdlcygpICYmXG5cdFx0XHQhYUJhdGNoR3JvdXBzLnNvbWUoKG9wQ29udGV4dC5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWwpLmhhc1BlbmRpbmdDaGFuZ2VzLmJpbmQob3BDb250ZXh0LmdldE1vZGVsKCkpKVxuXHRcdCkge1xuXHRcdFx0LyogXHRJbiBjYXNlIHRoZXJlIGFyZSBwZW5kaW5nIGNoYW5nZXMgZm9yIHRoZSBjcmVhdGlvbiByb3cgYW5kIG5vIG90aGVycyB3ZSBuZWVkIHRvIHJlc2V0IHRoZSBjaGFuZ2VzXG4gICAgXHRcdFx0XHRcdFx0VE9ETzogdGhpcyBpcyBqdXN0IGEgcXVpY2sgc29sdXRpb24sIHRoaXMgbmVlZHMgdG8gYmUgcmV3b3JrZWRcbiAgICBcdFx0XHRcdCBcdCovXG5cblx0XHRcdG9wQ29udGV4dC5nZXRCaW5kaW5nKCkucmVzZXRDaGFuZ2VzKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yIG5vdyB3ZSBoYXZlIHRvIHNldCB0aGUgYmluZGluZyBjb250ZXh0IHRvIG51bGwgZm9yIGV2ZXJ5IGZhc3QgY3JlYXRpb24gcm93XG5cdFx0Ly8gVE9ETzogR2V0IHJpZCBvZiB0aGlzIGNvZGluZyBvciBtb3ZlIGl0IHRvIGFub3RoZXIgbGF5ZXIgLSB0byBiZSBkaXNjdXNzZWQgd2l0aCBNREMgYW5kIG1vZGVsXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhVGFibGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRvRmFzdENyZWF0aW9uUm93ID0gYVRhYmxlc1tpXS5nZXRDcmVhdGlvblJvdygpO1xuXHRcdFx0aWYgKG9GYXN0Q3JlYXRpb25Sb3cpIHtcblx0XHRcdFx0b0Zhc3RDcmVhdGlvblJvdy5zZXRCaW5kaW5nQ29udGV4dChudWxsKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTY3JvbGwgdG8gcHJlc2VudCBTZWN0aW9uIHNvIHRoYXQgYmluZGluZ3MgYXJlIGVuYWJsZWQgZHVyaW5nIG5hdmlnYXRpb24gdGhyb3VnaCBwYWdpbmF0b3IgYnV0dG9ucywgYXMgdGhlcmUgaXMgbm8gdmlldyByZXJlbmRlcmluZy9yZWJpbmRcblx0XHRjb25zdCBmblNjcm9sbFRvUHJlc2VudFNlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoIShvT2JqZWN0UGFnZSBhcyBhbnkpLmlzRmlyc3RSZW5kZXJpbmcoKSAmJiAhbVBhcmFtZXRlcnMuYlBlcnNpc3RPUFNjcm9sbCkge1xuXHRcdFx0XHRvT2JqZWN0UGFnZS5zZXRTZWxlY3RlZFNlY3Rpb24obnVsbCBhcyBhbnkpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0b09iamVjdFBhZ2UuYXR0YWNoRXZlbnRPbmNlKFwibW9kZWxDb250ZXh0Q2hhbmdlXCIsIGZuU2Nyb2xsVG9QcmVzZW50U2VjdGlvbik7XG5cblx0XHQvLyBpZiB0aGUgc3RydWN0dXJlIG9mIHRoZSBPYmplY3RQYWdlTGF5b3V0IGlzIGNoYW5nZWQgdGhlbiBzY3JvbGwgdG8gcHJlc2VudCBTZWN0aW9uXG5cdFx0Ly8gRklYTUUgSXMgdGhpcyByZWFsbHkgd29ya2luZyBhcyBpbnRlbmRlZCA/IEluaXRpYWxseSB0aGlzIHdhcyBvbkJlZm9yZVJlbmRlcmluZywgYnV0IG5ldmVyIHRyaWdnZXJlZCBvbkJlZm9yZVJlbmRlcmluZyBiZWNhdXNlIGl0IHdhcyByZWdpc3RlcmVkIGFmdGVyIGl0XG5cdFx0Y29uc3Qgb0RlbGVnYXRlT25CZWZvcmUgPSB7XG5cdFx0XHRvbkFmdGVyUmVuZGVyaW5nOiBmblNjcm9sbFRvUHJlc2VudFNlY3Rpb25cblx0XHR9O1xuXHRcdG9PYmplY3RQYWdlLmFkZEV2ZW50RGVsZWdhdGUob0RlbGVnYXRlT25CZWZvcmUsIHRoaXMpO1xuXHRcdHRoaXMucGFnZVJlYWR5LmF0dGFjaEV2ZW50T25jZShcInBhZ2VSZWFkeVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRvT2JqZWN0UGFnZS5yZW1vdmVFdmVudERlbGVnYXRlKG9EZWxlZ2F0ZU9uQmVmb3JlKTtcblx0XHR9KTtcblxuXHRcdC8vU2V0IHRoZSBCaW5kaW5nIGZvciBQYWdpbmF0b3JzIHVzaW5nIExpc3RCaW5kaW5nIElEXG5cdFx0aWYgKGlWaWV3TGV2ZWwgPiAxKSB7XG5cdFx0XHRsZXQgb0JpbmRpbmcgPSBtUGFyYW1ldGVycyAmJiBtUGFyYW1ldGVycy5saXN0QmluZGluZztcblx0XHRcdGNvbnN0IG9QYWdpbmF0b3JDdXJyZW50Q29udGV4dCA9IG9JbnRlcm5hbE1vZGVsLmdldFByb3BlcnR5KFwiL3BhZ2luYXRvckN1cnJlbnRDb250ZXh0XCIpO1xuXHRcdFx0aWYgKG9QYWdpbmF0b3JDdXJyZW50Q29udGV4dCkge1xuXHRcdFx0XHRjb25zdCBvQmluZGluZ1RvVXNlID0gb1BhZ2luYXRvckN1cnJlbnRDb250ZXh0LmdldEJpbmRpbmcoKTtcblx0XHRcdFx0dGhpcy5wYWdpbmF0b3IuaW5pdGlhbGl6ZShvQmluZGluZ1RvVXNlLCBvUGFnaW5hdG9yQ3VycmVudENvbnRleHQpO1xuXHRcdFx0XHRvSW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9wYWdpbmF0b3JDdXJyZW50Q29udGV4dFwiLCBudWxsKTtcblx0XHRcdH0gZWxzZSBpZiAob0JpbmRpbmcpIHtcblx0XHRcdFx0aWYgKG9CaW5kaW5nLmlzQShcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXCIpKSB7XG5cdFx0XHRcdFx0dGhpcy5wYWdpbmF0b3IuaW5pdGlhbGl6ZShvQmluZGluZywgb0NvbnRleHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGlmIHRoZSBiaW5kaW5nIHR5cGUgaXMgbm90IE9EYXRhTGlzdEJpbmRpbmcgYmVjYXVzZSBvZiBhIGRlZXBsaW5rIG5hdmlnYXRpb24gb3IgYSByZWZyZXNoIG9mIHRoZSBwYWdlXG5cdFx0XHRcdFx0Ly8gd2UgbmVlZCB0byBjcmVhdGUgaXRcblx0XHRcdFx0XHRjb25zdCBzQmluZGluZ1BhdGggPSBvQmluZGluZy5nZXRQYXRoKCk7XG5cdFx0XHRcdFx0aWYgKC9cXChbXlxcKV0qXFwpJC8udGVzdChzQmluZGluZ1BhdGgpKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgY3VycmVudCBiaW5kaW5nIHBhdGggZW5kcyB3aXRoICh4eHgpLCBzbyB3ZSBjcmVhdGUgdGhlIGxpc3RCaW5kaW5nIGJ5IHJlbW92aW5nICh4eHgpXG5cdFx0XHRcdFx0XHRjb25zdCBzTGlzdEJpbmRpbmdQYXRoID0gc0JpbmRpbmdQYXRoLnJlcGxhY2UoL1xcKFteXFwpXSpcXCkkLywgXCJcIik7XG5cdFx0XHRcdFx0XHRvQmluZGluZyA9IG5ldyAoT0RhdGFMaXN0QmluZGluZyBhcyBhbnkpKG9CaW5kaW5nLm9Nb2RlbCwgc0xpc3RCaW5kaW5nUGF0aCk7XG5cdFx0XHRcdFx0XHRjb25zdCBfc2V0TGlzdEJpbmRpbmdBc3luYyA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKG9CaW5kaW5nLmdldENvbnRleHRzKCkubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMucGFnaW5hdG9yLmluaXRpYWxpemUob0JpbmRpbmcsIG9Db250ZXh0KTtcblx0XHRcdFx0XHRcdFx0XHRvQmluZGluZy5kZXRhY2hFdmVudChcImNoYW5nZVwiLCBfc2V0TGlzdEJpbmRpbmdBc3luYyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdG9CaW5kaW5nLmdldENvbnRleHRzKDApO1xuXHRcdFx0XHRcdFx0b0JpbmRpbmcuYXR0YWNoRXZlbnQoXCJjaGFuZ2VcIiwgX3NldExpc3RCaW5kaW5nQXN5bmMpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgY3VycmVudCBiaW5kaW5nIGRvZXNuJ3QgZW5kIHdpdGggKHh4eCkgLS0+IHRoZSBsYXN0IHNlZ21lbnQgaXMgYSAxLTEgbmF2aWdhdGlvbiwgc28gd2UgZG9uJ3QgZGlzcGxheSB0aGUgcGFnaW5hdG9yXG5cdFx0XHRcdFx0XHR0aGlzLnBhZ2luYXRvci5pbml0aWFsaXplKHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghKHRoaXMuZ2V0VmlldygpLmdldFZpZXdEYXRhKCkgYXMgYW55KS51c2VOZXdMYXp5TG9hZGluZyAmJiBvT2JqZWN0UGFnZS5nZXRFbmFibGVMYXp5TG9hZGluZygpKSB7XG5cdFx0XHRjb25zdCBhU2VjdGlvbnMgPSBvT2JqZWN0UGFnZS5nZXRTZWN0aW9ucygpO1xuXHRcdFx0Y29uc3QgYlVzZUljb25UYWJCYXIgPSBvT2JqZWN0UGFnZS5nZXRVc2VJY29uVGFiQmFyKCk7XG5cdFx0XHRsZXQgaVNraXAgPSAyO1xuXHRcdFx0Y29uc3QgYklzSW5FZGl0TW9kZSA9IG9PYmplY3RQYWdlLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKTtcblx0XHRcdGNvbnN0IGJFZGl0YWJsZUhlYWRlciA9ICh0aGlzLmdldFZpZXcoKS5nZXRWaWV3RGF0YSgpIGFzIGFueSkuZWRpdGFibGVIZWFkZXJDb250ZW50O1xuXHRcdFx0Zm9yIChsZXQgaVNlY3Rpb24gPSAwOyBpU2VjdGlvbiA8IGFTZWN0aW9ucy5sZW5ndGg7IGlTZWN0aW9uKyspIHtcblx0XHRcdFx0Y29uc3Qgb1NlY3Rpb24gPSBhU2VjdGlvbnNbaVNlY3Rpb25dO1xuXHRcdFx0XHRjb25zdCBhU3ViU2VjdGlvbnMgPSBvU2VjdGlvbi5nZXRTdWJTZWN0aW9ucygpO1xuXHRcdFx0XHRmb3IgKGxldCBpU3ViU2VjdGlvbiA9IDA7IGlTdWJTZWN0aW9uIDwgYVN1YlNlY3Rpb25zLmxlbmd0aDsgaVN1YlNlY3Rpb24rKywgaVNraXAtLSkge1xuXHRcdFx0XHRcdC8vIEluIEljb25UYWJCYXIgbW9kZSBrZWVwIHRoZSBzZWNvbmQgc2VjdGlvbiBib3VuZCBpZiB0aGVyZSBpcyBhbiBlZGl0YWJsZSBoZWFkZXIgYW5kIHdlIGFyZSBzd2l0Y2hpbmcgdG8gZGlzcGxheSBtb2RlXG5cdFx0XHRcdFx0aWYgKGlTa2lwIDwgMSB8fCAoYlVzZUljb25UYWJCYXIgJiYgKGlTZWN0aW9uID4gMSB8fCAoaVNlY3Rpb24gPT09IDEgJiYgIWJFZGl0YWJsZUhlYWRlciAmJiAhYklzSW5FZGl0TW9kZSkpKSkge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb1N1YlNlY3Rpb24gPSBhU3ViU2VjdGlvbnNbaVN1YlNlY3Rpb25dO1xuXHRcdFx0XHRcdFx0aWYgKG9TdWJTZWN0aW9uLmRhdGEoKS5pc1Zpc2liaWxpdHlEeW5hbWljICE9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0XHRvU3ViU2VjdGlvbi5zZXRCaW5kaW5nQ29udGV4dChudWxsIGFzIGFueSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucGxhY2Vob2xkZXIuaXNQbGFjZWhvbGRlckVuYWJsZWQoKSAmJiBtUGFyYW1ldGVycy5zaG93UGxhY2Vob2xkZXIpIHtcblx0XHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCk7XG5cdFx0XHRjb25zdCBvTmF2Q29udGFpbmVyID0gKG9WaWV3LmdldFBhcmVudCgpIGFzIGFueSkub0NvbnRhaW5lci5nZXRQYXJlbnQoKTtcblx0XHRcdGlmIChvTmF2Q29udGFpbmVyKSB7XG5cdFx0XHRcdG9OYXZDb250YWluZXIuc2hvd1BsYWNlaG9sZGVyKHt9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRfZ2V0Rmlyc3RDbGlja2FibGVFbGVtZW50KG9PYmplY3RQYWdlOiBhbnkpIHtcblx0XHRsZXQgb0ZpcnN0Q2xpY2thYmxlRWxlbWVudDtcblx0XHRjb25zdCBhQWN0aW9ucyA9IG9PYmplY3RQYWdlLmdldEhlYWRlclRpdGxlKCkgJiYgb09iamVjdFBhZ2UuZ2V0SGVhZGVyVGl0bGUoKS5nZXRBY3Rpb25zKCk7XG5cdFx0aWYgKGFBY3Rpb25zICYmIGFBY3Rpb25zLmxlbmd0aCkge1xuXHRcdFx0b0ZpcnN0Q2xpY2thYmxlRWxlbWVudCA9IGFBY3Rpb25zLmZpbmQoZnVuY3Rpb24gKG9BY3Rpb246IGFueSkge1xuXHRcdFx0XHQvLyBEdWUgdG8gdGhlIGxlZnQgYWxpZ25tZW50IG9mIHRoZSBEcmFmdCBzd2l0Y2ggYW5kIHRoZSBjb2xsYWJvcmF0aXZlIGRyYWZ0IGF2YXRhciBjb250cm9sc1xuXHRcdFx0XHQvLyB0aGVyZSBpcyBhIFRvb2xiYXJTcGFjZXIgaW4gdGhlIGFjdGlvbnMgYWdncmVnYXRpb24gd2hpY2ggd2UgbmVlZCB0byBleGNsdWRlIGhlcmUhXG5cdFx0XHRcdC8vIER1ZSB0byB0aGUgQUNDIHJlcG9ydCwgd2UgYWxzbyBuZWVkIG5vdCB0byBjaGVjayBmb3IgdGhlIEludmlzaWJsZVRleHQgZWxlbWVudHNcblx0XHRcdFx0aWYgKG9BY3Rpb24uaXNBKFwic2FwLmZlLm1hY3Jvcy5TaGFyZUFQSVwiKSkge1xuXHRcdFx0XHRcdC8vIHNpbmNlIFNoYXJlQVBJIGRvZXMgbm90IGhhdmUgYSBkaXNhYmxlIHByb3BlcnR5XG5cdFx0XHRcdFx0Ly8gaGVuY2UgdGhlcmUgaXMgbm8gbmVlZCB0byBjaGVjayBpZiBpdCBpcyBkaXNiYWxlZCBvciBub3Rcblx0XHRcdFx0XHRyZXR1cm4gb0FjdGlvbi5nZXRWaXNpYmxlKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIW9BY3Rpb24uaXNBKFwic2FwLnVpLmNvcmUuSW52aXNpYmxlVGV4dFwiKSAmJiAhb0FjdGlvbi5pc0EoXCJzYXAubS5Ub29sYmFyU3BhY2VyXCIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9BY3Rpb24uZ2V0VmlzaWJsZSgpICYmIG9BY3Rpb24uZ2V0RW5hYmxlZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG9GaXJzdENsaWNrYWJsZUVsZW1lbnQ7XG5cdH1cblxuXHRfZ2V0Rmlyc3RFbXB0eU1hbmRhdG9yeUZpZWxkRnJvbVN1YlNlY3Rpb24oYVN1YlNlY3Rpb25zOiBhbnkpIHtcblx0XHRpZiAoYVN1YlNlY3Rpb25zKSB7XG5cdFx0XHRmb3IgKGxldCBzdWJTZWN0aW9uID0gMDsgc3ViU2VjdGlvbiA8IGFTdWJTZWN0aW9ucy5sZW5ndGg7IHN1YlNlY3Rpb24rKykge1xuXHRcdFx0XHRjb25zdCBhQmxvY2tzID0gYVN1YlNlY3Rpb25zW3N1YlNlY3Rpb25dLmdldEJsb2NrcygpO1xuXG5cdFx0XHRcdGlmIChhQmxvY2tzKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgYmxvY2sgPSAwOyBibG9jayA8IGFCbG9ja3MubGVuZ3RoOyBibG9jaysrKSB7XG5cdFx0XHRcdFx0XHRsZXQgYUZvcm1Db250YWluZXJzO1xuXG5cdFx0XHRcdFx0XHRpZiAoYUJsb2Nrc1tibG9ja10uaXNBKFwic2FwLnVpLmxheW91dC5mb3JtLkZvcm1cIikpIHtcblx0XHRcdFx0XHRcdFx0YUZvcm1Db250YWluZXJzID0gYUJsb2Nrc1tibG9ja10uZ2V0Rm9ybUNvbnRhaW5lcnMoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0XHRcdGFCbG9ja3NbYmxvY2tdLmdldENvbnRlbnQgJiZcblx0XHRcdFx0XHRcdFx0YUJsb2Nrc1tibG9ja10uZ2V0Q29udGVudCgpICYmXG5cdFx0XHRcdFx0XHRcdGFCbG9ja3NbYmxvY2tdLmdldENvbnRlbnQoKS5pc0EoXCJzYXAudWkubGF5b3V0LmZvcm0uRm9ybVwiKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdGFGb3JtQ29udGFpbmVycyA9IGFCbG9ja3NbYmxvY2tdLmdldENvbnRlbnQoKS5nZXRGb3JtQ29udGFpbmVycygpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoYUZvcm1Db250YWluZXJzKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGZvcm1Db250YWluZXIgPSAwOyBmb3JtQ29udGFpbmVyIDwgYUZvcm1Db250YWluZXJzLmxlbmd0aDsgZm9ybUNvbnRhaW5lcisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgYUZvcm1FbGVtZW50cyA9IGFGb3JtQ29udGFpbmVyc1tmb3JtQ29udGFpbmVyXS5nZXRGb3JtRWxlbWVudHMoKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYUZvcm1FbGVtZW50cykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgZm9ybUVsZW1lbnQgPSAwOyBmb3JtRWxlbWVudCA8IGFGb3JtRWxlbWVudHMubGVuZ3RoOyBmb3JtRWxlbWVudCsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGFGaWVsZHMgPSBhRm9ybUVsZW1lbnRzW2Zvcm1FbGVtZW50XS5nZXRGaWVsZHMoKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBUaGUgZmlyc3QgZmllbGQgaXMgbm90IG5lY2Vzc2FyaWx5IGFuIElucHV0QmFzZSAoZS5nLiBjb3VsZCBiZSBhIFRleHQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNvIHdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBpdCBoYXMgYSBnZXRSZXF1aXJlZCBtZXRob2Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYUZpZWxkc1swXS5nZXRSZXF1aXJlZCAmJiBhRmllbGRzWzBdLmdldFJlcXVpcmVkKCkgJiYgIWFGaWVsZHNbMF0uZ2V0VmFsdWUoKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFGaWVsZHNbMF07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdExvZy5kZWJ1ZyhgRXJyb3Igd2hlbiBzZWFyY2hpbmcgZm9yIG1hbmRhb3RyeSBlbXB0eSBmaWVsZDogJHtlcnJvcn1gKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0X3VwZGF0ZUZvY3VzSW5FZGl0TW9kZShhU3ViU2VjdGlvbnM6IGFueSkge1xuXHRcdGNvbnN0IG9PYmplY3RQYWdlID0gdGhpcy5fZ2V0T2JqZWN0UGFnZUxheW91dENvbnRyb2woKTtcblxuXHRcdGNvbnN0IG9NYW5kYXRvcnlGaWVsZCA9IHRoaXMuX2dldEZpcnN0RW1wdHlNYW5kYXRvcnlGaWVsZEZyb21TdWJTZWN0aW9uKGFTdWJTZWN0aW9ucyk7XG5cdFx0bGV0IG9GaWVsZFRvRm9jdXM6IGFueTtcblx0XHRpZiAob01hbmRhdG9yeUZpZWxkKSB7XG5cdFx0XHRvRmllbGRUb0ZvY3VzID0gb01hbmRhdG9yeUZpZWxkLmNvbnRlbnQuZ2V0Q29udGVudEVkaXQoKVswXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b0ZpZWxkVG9Gb2N1cyA9IChvT2JqZWN0UGFnZSBhcyBhbnkpLl9nZXRGaXJzdEVkaXRhYmxlSW5wdXQoKSB8fCB0aGlzLl9nZXRGaXJzdENsaWNrYWJsZUVsZW1lbnQob09iamVjdFBhZ2UpO1xuXHRcdH1cblxuXHRcdGlmIChvRmllbGRUb0ZvY3VzKSB7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8gV2Ugc2V0IHRoZSBmb2N1cyBpbiBhIHRpbWVlb3V0LCBvdGhlcndpc2UgdGhlIGZvY3VzIHNvbWV0aW1lcyBnb2VzIHRvIHRoZSBUYWJCYXJcblx0XHRcdFx0b0ZpZWxkVG9Gb2N1cy5mb2N1cygpO1xuXHRcdFx0fSwgMCk7XG5cdFx0fVxuXHR9XG5cblx0X2hhbmRsZVN1YlNlY3Rpb25FbnRlcmVkVmlld1BvcnQob0V2ZW50OiBhbnkpIHtcblx0XHRjb25zdCBvU3ViU2VjdGlvbiA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJzdWJTZWN0aW9uXCIpO1xuXHRcdG9TdWJTZWN0aW9uLnNldEJpbmRpbmdDb250ZXh0KHVuZGVmaW5lZCk7XG5cdH1cblxuXHRfb25CYWNrTmF2aWdhdGlvbkluRHJhZnQob0NvbnRleHQ6IGFueSkge1xuXHRcdHRoaXMubWVzc2FnZUhhbmRsZXIucmVtb3ZlVHJhbnNpdGlvbk1lc3NhZ2VzKCk7XG5cdFx0aWYgKHRoaXMuZ2V0QXBwQ29tcG9uZW50KCkuZ2V0Um91dGVyUHJveHkoKS5jaGVja0lmQmFja0hhc1NhbWVDb250ZXh0KCkpIHtcblx0XHRcdC8vIEJhY2sgbmF2IHdpbGwga2VlcCB0aGUgc2FtZSBjb250ZXh0IC0tPiBubyBuZWVkIHRvIGRpc3BsYXkgdGhlIGRpYWxvZ1xuXHRcdFx0aGlzdG9yeS5iYWNrKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRyYWZ0LnByb2Nlc3NEYXRhTG9zc09yRHJhZnREaXNjYXJkQ29uZmlybWF0aW9uKFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdEZ1bmN0aW9uLnByb3RvdHlwZSxcblx0XHRcdFx0b0NvbnRleHQsXG5cdFx0XHRcdHRoaXMsXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRkcmFmdC5OYXZpZ2F0aW9uVHlwZS5CYWNrTmF2aWdhdGlvblxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdF9vbkFmdGVyQmluZGluZyhvQmluZGluZ0NvbnRleHQ6IGFueSwgbVBhcmFtZXRlcnM6IGFueSkge1xuXHRcdGNvbnN0IG9PYmplY3RQYWdlID0gdGhpcy5fZ2V0T2JqZWN0UGFnZUxheW91dENvbnRyb2woKTtcblx0XHRjb25zdCBhVGFibGVzID0gdGhpcy5fZmluZFRhYmxlcygpO1xuXG5cdFx0dGhpcy5fc2lkZUVmZmVjdHMuY2xlYXJQcm9wZXJ0aWVzU3RhdHVzKCk7XG5cblx0XHQvLyBUT0RPOiB0aGlzIGlzIG9ubHkgYSB0ZW1wIHNvbHV0aW9uIGFzIGxvbmcgYXMgdGhlIG1vZGVsIGZpeCB0aGUgY2FjaGUgaXNzdWUgYW5kIHdlIHVzZSB0aGlzIGFkZGl0aW9uYWxcblx0XHQvLyBiaW5kaW5nIHdpdGggb3duUmVxdWVzdFxuXHRcdG9CaW5kaW5nQ29udGV4dCA9IG9PYmplY3RQYWdlLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cblx0XHRsZXQgYUlCTkFjdGlvbnM6IGFueVtdID0gW107XG5cdFx0b09iamVjdFBhZ2UuZ2V0U2VjdGlvbnMoKS5mb3JFYWNoKGZ1bmN0aW9uIChvU2VjdGlvbjogYW55KSB7XG5cdFx0XHRvU2VjdGlvbi5nZXRTdWJTZWN0aW9ucygpLmZvckVhY2goZnVuY3Rpb24gKG9TdWJTZWN0aW9uOiBhbnkpIHtcblx0XHRcdFx0YUlCTkFjdGlvbnMgPSBDb21tb25VdGlscy5nZXRJQk5BY3Rpb25zKG9TdWJTZWN0aW9uLCBhSUJOQWN0aW9ucyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIEFzc2lnbiBpbnRlcm5hbCBiaW5kaW5nIGNvbnRleHRzIHRvIG9Gb3JtQ29udGFpbmVyOlxuXHRcdC8vIDEuIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBhc3NpZ24gdGhlIGludGVybmFsIGJpbmRpbmcgY29udGV4dCB0byB0aGUgWE1MIGZyYWdtZW50XG5cdFx0Ly8gKEZvcm1Db250YWluZXIuZnJhZ21lbnQueG1sKSB5ZXQgLSBpdCBpcyB1c2VkIGFscmVhZHkgZm9yIHRoZSBkYXRhLXN0cnVjdHVyZS5cblx0XHQvLyAyLiBBbm90aGVyIHByb2JsZW0gaXMsIHRoYXQgRm9ybUNvbnRhaW5lcnMgYXNzaWduZWQgdG8gYSAnTW9yZUJsb2NrJyBkb2VzIG5vdCBoYXZlIGFuXG5cdFx0Ly8gaW50ZXJuYWwgbW9kZWwgY29udGV4dCBhdCBhbGwuXG5cblx0XHRhVGFibGVzLmZvckVhY2goZnVuY3Rpb24gKG9UYWJsZTogYW55KSB7XG5cdFx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvVGFibGUuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKTtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImNyZWF0aW9uUm93RmllbGRWYWxpZGl0eVwiLCB7fSk7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJjcmVhdGlvblJvd0N1c3RvbVZhbGlkaXR5XCIsIHt9KTtcblxuXHRcdFx0YUlCTkFjdGlvbnMgPSBDb21tb25VdGlscy5nZXRJQk5BY3Rpb25zKG9UYWJsZSwgYUlCTkFjdGlvbnMpO1xuXHRcdFx0Ly8gdGVtcG9yYXJ5IHdvcmthcm91bmQgZm9yIEJDUDogMjA4MDIxODAwNFxuXHRcdFx0Ly8gTmVlZCB0byBmaXggd2l0aCBCTEk6IEZJT1JJVEVDSFAxLTE1Mjc0XG5cdFx0XHQvLyBvbmx5IGZvciBlZGl0IG1vZGUsIHdlIGNsZWFyIHRoZSB0YWJsZSBjYWNoZVxuXHRcdFx0Ly8gV29ya2Fyb3VuZCBzdGFydHMgaGVyZSEhXG5cdFx0XHRjb25zdCBvVGFibGVSb3dCaW5kaW5nID0gb1RhYmxlLmdldFJvd0JpbmRpbmcoKTtcblx0XHRcdGlmIChvVGFibGVSb3dCaW5kaW5nKSB7XG5cdFx0XHRcdGlmIChNb2RlbEhlbHBlci5pc1N0aWNreVNlc3Npb25TdXBwb3J0ZWQob1RhYmxlUm93QmluZGluZy5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpKSkge1xuXHRcdFx0XHRcdC8vIGFwcGx5IGZvciBib3RoIGVkaXQgYW5kIGRpc3BsYXkgbW9kZSBpbiBzdGlja3lcblx0XHRcdFx0XHRvVGFibGVSb3dCaW5kaW5nLnJlbW92ZUNhY2hlc0FuZE1lc3NhZ2VzKFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBXb3JrYXJvdW5kIGVuZHMgaGVyZSEhXG5cblx0XHRcdC8vIFVwZGF0ZSAnZW5hYmxlZCcgcHJvcGVydHkgb2YgRGF0YUZpZWxkRm9yQWN0aW9uIGJ1dHRvbnMgb24gdGFibGUgdG9vbGJhclxuXHRcdFx0Ly8gVGhlIHNhbWUgaXMgYWxzbyBwZXJmb3JtZWQgb24gVGFibGUgc2VsZWN0aW9uQ2hhbmdlIGV2ZW50XG5cdFx0XHRjb25zdCBvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gSlNPTi5wYXJzZShcblx0XHRcdFx0XHRDb21tb25IZWxwZXIucGFyc2VDdXN0b21EYXRhKERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJvcGVyYXRpb25BdmFpbGFibGVNYXBcIikpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGFTZWxlY3RlZENvbnRleHRzID0gb1RhYmxlLmdldFNlbGVjdGVkQ29udGV4dHMoKTtcblxuXHRcdFx0QWN0aW9uUnVudGltZS5zZXRBY3Rpb25FbmFibGVtZW50KG9JbnRlcm5hbE1vZGVsQ29udGV4dCwgb0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZU1hcCwgYVNlbGVjdGVkQ29udGV4dHMsIFwidGFibGVcIik7XG5cdFx0XHQvLyBDbGVhciB0aGUgc2VsZWN0aW9uIGluIHRoZSB0YWJsZSwgbmVlZCB0byBiZSBmaXhlZCBhbmQgcmV2aWV3IHdpdGggQkxJOiBGSU9SSVRFQ0hQMS0yNDMxOFxuXHRcdFx0b1RhYmxlLmNsZWFyU2VsZWN0aW9uKCk7XG5cdFx0fSk7XG5cdFx0Q29tbW9uVXRpbHMuZ2V0U2VtYW50aWNUYXJnZXRzRnJvbVBhZ2VNb2RlbCh0aGlzLCBcIl9wYWdlTW9kZWxcIik7XG5cdFx0Ly9SZXRyaWV2ZSBPYmplY3QgUGFnZSBoZWFkZXIgYWN0aW9ucyBmcm9tIE9iamVjdCBQYWdlIHRpdGxlIGNvbnRyb2xcblx0XHRjb25zdCBvT2JqZWN0UGFnZVRpdGxlID0gb09iamVjdFBhZ2UuZ2V0SGVhZGVyVGl0bGUoKTtcblx0XHRsZXQgYUlCTkhlYWRlckFjdGlvbnM6IGFueVtdID0gW107XG5cdFx0YUlCTkhlYWRlckFjdGlvbnMgPSBDb21tb25VdGlscy5nZXRJQk5BY3Rpb25zKG9PYmplY3RQYWdlVGl0bGUsIGFJQk5IZWFkZXJBY3Rpb25zKTtcblx0XHRhSUJOQWN0aW9ucyA9IGFJQk5BY3Rpb25zLmNvbmNhdChhSUJOSGVhZGVyQWN0aW9ucyk7XG5cdFx0Q29tbW9uVXRpbHMudXBkYXRlRGF0YUZpZWxkRm9ySUJOQnV0dG9uc1Zpc2liaWxpdHkoYUlCTkFjdGlvbnMsIHRoaXMuZ2V0VmlldygpKTtcblxuXHRcdGxldCBvTW9kZWw6IGFueSwgb0ZpbmFsVUlTdGF0ZTogYW55O1xuXG5cdFx0Ly8gVE9ETzogdGhpcyBzaG91bGQgYmUgbW92ZWQgaW50byBhbiBpbml0IGV2ZW50IG9mIHRoZSBNREMgdGFibGVzIChub3QgeWV0IGV4aXN0aW5nKSBhbmQgc2hvdWxkIGJlIHBhcnRcblx0XHQvLyBvZiBhbnkgY29udHJvbGxlciBleHRlbnNpb25cblx0XHQvKipcblx0XHQgKiBAcGFyYW0gb1RhYmxlXG5cdFx0ICogQHBhcmFtIG9MaXN0QmluZGluZ1xuXHRcdCAqL1xuXHRcdGFzeW5jIGZ1bmN0aW9uIGVuYWJsZUZhc3RDcmVhdGlvblJvdyhvVGFibGU6IGFueSwgb0xpc3RCaW5kaW5nOiBhbnkpIHtcblx0XHRcdGNvbnN0IG9GYXN0Q3JlYXRpb25Sb3cgPSBvVGFibGUuZ2V0Q3JlYXRpb25Sb3coKTtcblx0XHRcdGxldCBvRmFzdENyZWF0aW9uTGlzdEJpbmRpbmcsIG9GYXN0Q3JlYXRpb25Db250ZXh0O1xuXG5cdFx0XHRpZiAob0Zhc3RDcmVhdGlvblJvdykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGF3YWl0IG9GaW5hbFVJU3RhdGU7XG5cdFx0XHRcdFx0aWYgKG9GYXN0Q3JlYXRpb25Sb3cuZ2V0TW9kZWwoXCJ1aVwiKS5nZXRQcm9wZXJ0eShcIi9pc0VkaXRhYmxlXCIpKSB7XG5cdFx0XHRcdFx0XHRvRmFzdENyZWF0aW9uTGlzdEJpbmRpbmcgPSBvTW9kZWwuYmluZExpc3Qob0xpc3RCaW5kaW5nLmdldFBhdGgoKSwgb0xpc3RCaW5kaW5nLmdldENvbnRleHQoKSwgW10sIFtdLCB7XG5cdFx0XHRcdFx0XHRcdCQkdXBkYXRlR3JvdXBJZDogXCJkb05vdFN1Ym1pdFwiLFxuXHRcdFx0XHRcdFx0XHQkJGdyb3VwSWQ6IFwiZG9Ob3RTdWJtaXRcIlxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvLyBXb3JrYXJvdW5kIHN1Z2dlc3RlZCBieSBPRGF0YSBtb2RlbCB2NCBjb2xsZWFndWVzXG5cdFx0XHRcdFx0XHRvRmFzdENyZWF0aW9uTGlzdEJpbmRpbmcucmVmcmVzaEludGVybmFsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQvKiBkbyBub3RoaW5nICovXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0b0Zhc3RDcmVhdGlvbkNvbnRleHQgPSBvRmFzdENyZWF0aW9uTGlzdEJpbmRpbmcuY3JlYXRlKCk7XG5cdFx0XHRcdFx0XHRvRmFzdENyZWF0aW9uUm93LnNldEJpbmRpbmdDb250ZXh0KG9GYXN0Q3JlYXRpb25Db250ZXh0KTtcblxuXHRcdFx0XHRcdFx0Ly8gdGhpcyBpcyBuZWVkZWQgdG8gYXZvaWQgY29uc29sZSBlcnJvclxuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0YXdhaXQgb0Zhc3RDcmVhdGlvbkNvbnRleHQuY3JlYXRlZCgpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRMb2cudHJhY2UoXCJ0cmFuc2llbnQgZmFzdCBjcmVhdGlvbiBjb250ZXh0IGRlbGV0ZWRcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGNvbXB1dGluZyB0aGUgZmluYWwgVUkgc3RhdGVcIiwgb0Vycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHRoaXMgc2hvdWxkIG5vdCBiZSBuZWVkZWQgYXQgdGhlIGFsbFxuXHRcdC8qKlxuXHRcdCAqIEBwYXJhbSBvVGFibGVcblx0XHQgKi9cblx0XHRjb25zdCBoYW5kbGVUYWJsZU1vZGlmaWNhdGlvbnMgPSAob1RhYmxlOiBhbnkpID0+IHtcblx0XHRcdGNvbnN0IG9CaW5kaW5nID0gdGhpcy5fZ2V0VGFibGVCaW5kaW5nKG9UYWJsZSksXG5cdFx0XHRcdGZuSGFuZGxlVGFibGVQYXRjaEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRlbmFibGVGYXN0Q3JlYXRpb25Sb3cob1RhYmxlLCBvQmluZGluZyk7XG5cdFx0XHRcdH07XG5cblx0XHRcdGlmICghb0JpbmRpbmcpIHtcblx0XHRcdFx0TG9nLmVycm9yKGBFeHBlY3RlZCBiaW5kaW5nIG1pc3NpbmcgZm9yIHRhYmxlOiAke29UYWJsZS5nZXRJZCgpfWApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvQmluZGluZy5vQ29udGV4dCkge1xuXHRcdFx0XHRmbkhhbmRsZVRhYmxlUGF0Y2hFdmVudHMoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGZuSGFuZGxlQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChvQmluZGluZy5vQ29udGV4dCkge1xuXHRcdFx0XHRcdFx0Zm5IYW5kbGVUYWJsZVBhdGNoRXZlbnRzKCk7XG5cdFx0XHRcdFx0XHRvQmluZGluZy5kZXRhY2hDaGFuZ2UoZm5IYW5kbGVDaGFuZ2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0b0JpbmRpbmcuYXR0YWNoQ2hhbmdlKGZuSGFuZGxlQ2hhbmdlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKG9CaW5kaW5nQ29udGV4dCkge1xuXHRcdFx0b01vZGVsID0gb0JpbmRpbmdDb250ZXh0LmdldE1vZGVsKCk7XG5cblx0XHRcdC8vIENvbXB1dGUgRWRpdCBNb2RlXG5cdFx0XHRvRmluYWxVSVN0YXRlID0gdGhpcy5fZWRpdEZsb3cuY29tcHV0ZUVkaXRNb2RlKG9CaW5kaW5nQ29udGV4dCk7XG5cblx0XHRcdGlmIChNb2RlbEhlbHBlci5pc0NvbGxhYm9yYXRpb25EcmFmdFN1cHBvcnRlZChvTW9kZWwuZ2V0TWV0YU1vZGVsKCkpKSB7XG5cdFx0XHRcdG9GaW5hbFVJU3RhdGVcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJ1aVwiKS5nZXRQcm9wZXJ0eShcIi9pc0VkaXRhYmxlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdGNvbm5lY3QodGhpcy5nZXRWaWV3KCkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpc0Nvbm5lY3RlZCh0aGlzLmdldFZpZXcoKSkpIHtcblx0XHRcdFx0XHRcdFx0ZGlzY29ubmVjdCh0aGlzLmdldFZpZXcoKSk7IC8vIENsZWFudXAgY29sbGFib3JhdGlvbiBjb25uZWN0aW9uIGluIGNhc2Ugd2Ugc3dpdGNoIHRvIGFub3RoZXIgZWxlbWVudCAoZS5nLiBpbiBGQ0wpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSB3YWl0aW5nIGZvciB0aGUgZmluYWwgVUkgU3RhdGVcIiwgb0Vycm9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHJlbGF0ZWQgYXBwcyBvbmNlIERhdGEgaXMgcmVjZWl2ZWQgaW4gY2FzZSBvZiBiaW5kaW5nIGNhY2hlIGlzIG5vdCBhdmFpbGFibGVcblx0XHRcdC8vIFRPRE86IHRoaXMgaXMgb25seSBhIHRlbXAgc29sdXRpb24gc2luY2Ugd2UgbmVlZCB0byBjYWxsIF91cGRhdGVSZWxhdGVkQXBwcyBtZXRob2Qgb25seSBhZnRlciBkYXRhIGZvciBPYmplY3QgUGFnZSBpcyByZWNlaXZlZCAoaWYgdGhlcmUgaXMgbm8gYmluZGluZylcblx0XHRcdGlmIChvQmluZGluZ0NvbnRleHQuZ2V0QmluZGluZygpLm9DYWNoZSkge1xuXHRcdFx0XHR0aGlzLl91cGRhdGVSZWxhdGVkQXBwcygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgZm5VcGRhdGVSZWxhdGVkQXBwcyA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl91cGRhdGVSZWxhdGVkQXBwcygpO1xuXHRcdFx0XHRcdG9CaW5kaW5nQ29udGV4dC5nZXRCaW5kaW5nKCkuZGV0YWNoRGF0YVJlY2VpdmVkKGZuVXBkYXRlUmVsYXRlZEFwcHMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRvQmluZGluZ0NvbnRleHQuZ2V0QmluZGluZygpLmF0dGFjaERhdGFSZWNlaXZlZChmblVwZGF0ZVJlbGF0ZWRBcHBzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly9BdHRhY2ggdGhlIHBhdGNoIHNlbnQgYW5kIHBhdGNoIGNvbXBsZXRlZCBldmVudCB0byB0aGUgb2JqZWN0IHBhZ2UgYmluZGluZyBzbyB0aGF0IHdlIGNhbiByZWFjdFxuXHRcdFx0Y29uc3Qgb0JpbmRpbmcgPSAob0JpbmRpbmdDb250ZXh0LmdldEJpbmRpbmcgJiYgb0JpbmRpbmdDb250ZXh0LmdldEJpbmRpbmcoKSkgfHwgb0JpbmRpbmdDb250ZXh0O1xuXG5cdFx0XHQvLyBBdHRhY2ggdGhlIGV2ZW50IGhhbmRsZXIgb25seSBvbmNlIHRvIHRoZSBzYW1lIGJpbmRpbmdcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRCaW5kaW5nICE9PSBvQmluZGluZykge1xuXHRcdFx0XHRvQmluZGluZy5hdHRhY2hFdmVudChcInBhdGNoU2VudFwiLCB0aGlzLmVkaXRGbG93LmhhbmRsZVBhdGNoU2VudCwgdGhpcyk7XG5cdFx0XHRcdHRoaXMuY3VycmVudEJpbmRpbmcgPSBvQmluZGluZztcblx0XHRcdH1cblxuXHRcdFx0YVRhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdFx0XHQvLyBhY2Nlc3MgYmluZGluZyBvbmx5IGFmdGVyIHRhYmxlIGlzIGJvdW5kXG5cdFx0XHRcdFRhYmxlVXRpbHMud2hlbkJvdW5kKG9UYWJsZSlcblx0XHRcdFx0XHQudGhlbihoYW5kbGVUYWJsZU1vZGlmaWNhdGlvbnMpXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgd2FpdGluZyBmb3IgdGhlIHRhYmxlIHRvIGJlIGJvdW5kXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCEodGhpcy5nZXRWaWV3KCkuZ2V0Vmlld0RhdGEoKSBhcyBhbnkpLnVzZU5ld0xhenlMb2FkaW5nKSB7XG5cdFx0XHRcdC8vIHNob3VsZCBiZSBjYWxsZWQgb25seSBhZnRlciBiaW5kaW5nIGlzIHJlYWR5IGhlbmNlIGNhbGxpbmcgaXQgaW4gb25BZnRlckJpbmRpbmdcblx0XHRcdFx0KG9PYmplY3RQYWdlIGFzIGFueSkuX3RyaWdnZXJWaXNpYmxlU3ViU2VjdGlvbnNFdmVudHMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdG9uUGFnZVJlYWR5KG1QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRjb25zdCBzZXRGb2N1cyA9ICgpID0+IHtcblx0XHRcdC8vIFNldCB0aGUgZm9jdXMgdG8gdGhlIGZpcnN0IGFjdGlvbiBidXR0b24sIG9yIHRvIHRoZSBmaXJzdCBlZGl0YWJsZSBpbnB1dCBpZiBpbiBlZGl0YWJsZSBtb2RlXG5cdFx0XHRjb25zdCBvT2JqZWN0UGFnZSA9IHRoaXMuX2dldE9iamVjdFBhZ2VMYXlvdXRDb250cm9sKCk7XG5cdFx0XHRjb25zdCBpc0luRGlzcGxheU1vZGUgPSAhb09iamVjdFBhZ2UuZ2V0TW9kZWwoXCJ1aVwiKS5nZXRQcm9wZXJ0eShcIi9pc0VkaXRhYmxlXCIpO1xuXG5cdFx0XHRpZiAoaXNJbkRpc3BsYXlNb2RlKSB7XG5cdFx0XHRcdGNvbnN0IG9GaXJzdENsaWNrYWJsZUVsZW1lbnQgPSB0aGlzLl9nZXRGaXJzdENsaWNrYWJsZUVsZW1lbnQob09iamVjdFBhZ2UpO1xuXHRcdFx0XHRpZiAob0ZpcnN0Q2xpY2thYmxlRWxlbWVudCkge1xuXHRcdFx0XHRcdG9GaXJzdENsaWNrYWJsZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3Qgb1NlbGVjdGVkU2VjdGlvbjogYW55ID0gQ29yZS5ieUlkKG9PYmplY3RQYWdlLmdldFNlbGVjdGVkU2VjdGlvbigpKTtcblx0XHRcdFx0aWYgKG9TZWxlY3RlZFNlY3Rpb24pIHtcblx0XHRcdFx0XHR0aGlzLl91cGRhdGVGb2N1c0luRWRpdE1vZGUob1NlbGVjdGVkU2VjdGlvbi5nZXRTdWJTZWN0aW9ucygpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Ly8gQXBwbHkgYXBwIHN0YXRlIG9ubHkgYWZ0ZXIgdGhlIHBhZ2UgaXMgcmVhZHkgd2l0aCB0aGUgZmlyc3Qgc2VjdGlvbiBzZWxlY3RlZFxuXHRcdGNvbnN0IG9WaWV3ID0gdGhpcy5nZXRWaWV3KCk7XG5cdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb1ZpZXcuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRjb25zdCBvQmluZGluZ0NvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdC8vU2hvdyBwb3B1cCB3aGlsZSBuYXZpZ2F0aW5nIGJhY2sgZnJvbSBvYmplY3QgcGFnZSBpbiBjYXNlIG9mIGRyYWZ0XG5cdFx0aWYgKG9CaW5kaW5nQ29udGV4dCkge1xuXHRcdFx0Y29uc3QgYklzU3RpY2t5TW9kZSA9IE1vZGVsSGVscGVyLmlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCgob0JpbmRpbmdDb250ZXh0LmdldE1vZGVsKCkgYXMgT0RhdGFNb2RlbCkuZ2V0TWV0YU1vZGVsKCkpO1xuXHRcdFx0aWYgKCFiSXNTdGlja3lNb2RlKSB7XG5cdFx0XHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQob1ZpZXcpO1xuXHRcdFx0XHRvQXBwQ29tcG9uZW50LmdldFNoZWxsU2VydmljZXMoKS5zZXRCYWNrTmF2aWdhdGlvbigoKSA9PiB0aGlzLl9vbkJhY2tOYXZpZ2F0aW9uSW5EcmFmdChvQmluZGluZ0NvbnRleHQpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5nZXRBcHBDb21wb25lbnQoKVxuXHRcdFx0LmdldEFwcFN0YXRlSGFuZGxlcigpXG5cdFx0XHQuYXBwbHlBcHBTdGF0ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGlmIChtUGFyYW1ldGVycy5mb3JjZUZvY3VzKSB7XG5cdFx0XHRcdFx0c2V0Rm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAoRXJyb3IpIHtcblx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgc2V0dGluZyB0aGUgZm9jdXNcIiwgRXJyb3IpO1xuXHRcdFx0fSk7XG5cblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJlcnJvck5hdmlnYXRpb25TZWN0aW9uRmxhZ1wiLCBmYWxzZSk7XG5cdFx0dGhpcy5fY2hlY2tEYXRhUG9pbnRUaXRsZUZvckV4dGVybmFsTmF2aWdhdGlvbigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgc3RhdHVzIG9mIGVkaXQgbW9kZSBmb3Igc3RpY2t5IHNlc3Npb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBzdGF0dXMgb2YgZWRpdCBtb2RlIGZvciBzdGlja3kgc2Vzc2lvblxuXHQgKi9cblx0Z2V0U3RpY2t5RWRpdE1vZGUoKSB7XG5cdFx0Y29uc3Qgb0JpbmRpbmdDb250ZXh0ID0gdGhpcy5nZXRWaWV3KCkuZ2V0QmluZGluZ0NvbnRleHQgJiYgKHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dCk7XG5cdFx0bGV0IGJJc1N0aWNreUVkaXRNb2RlID0gZmFsc2U7XG5cdFx0aWYgKG9CaW5kaW5nQ29udGV4dCkge1xuXHRcdFx0Y29uc3QgYklzU3RpY2t5TW9kZSA9IE1vZGVsSGVscGVyLmlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZChvQmluZGluZ0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbCk7XG5cdFx0XHRpZiAoYklzU3RpY2t5TW9kZSkge1xuXHRcdFx0XHRiSXNTdGlja3lFZGl0TW9kZSA9IHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGJJc1N0aWNreUVkaXRNb2RlO1xuXHR9XG5cblx0X2dldE9iamVjdFBhZ2VMYXlvdXRDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLmJ5SWQoXCJmZTo6T2JqZWN0UGFnZVwiKSBhcyBPYmplY3RQYWdlTGF5b3V0O1xuXHR9XG5cblx0X2dldFBhZ2VUaXRsZUluZm9ybWF0aW9uKCkge1xuXHRcdGNvbnN0IG9PYmplY3RQYWdlID0gdGhpcy5fZ2V0T2JqZWN0UGFnZUxheW91dENvbnRyb2woKTtcblx0XHRjb25zdCBvT2JqZWN0UGFnZVN1YnRpdGxlID0gb09iamVjdFBhZ2UuZ2V0Q3VzdG9tRGF0YSgpLmZpbmQoZnVuY3Rpb24gKG9DdXN0b21EYXRhOiBhbnkpIHtcblx0XHRcdHJldHVybiBvQ3VzdG9tRGF0YS5nZXRLZXkoKSA9PT0gXCJPYmplY3RQYWdlU3VidGl0bGVcIjtcblx0XHR9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGU6IG9PYmplY3RQYWdlLmRhdGEoXCJPYmplY3RQYWdlVGl0bGVcIikgfHwgXCJcIixcblx0XHRcdHN1YnRpdGxlOiBvT2JqZWN0UGFnZVN1YnRpdGxlICYmIG9PYmplY3RQYWdlU3VidGl0bGUuZ2V0VmFsdWUoKSxcblx0XHRcdGludGVudDogXCJcIixcblx0XHRcdGljb246IFwiXCJcblx0XHR9O1xuXHR9XG5cblx0X2V4ZWN1dGVIZWFkZXJTaG9ydGN1dChzSWQ6IGFueSkge1xuXHRcdGNvbnN0IHNCdXR0b25JZCA9IGAke3RoaXMuZ2V0VmlldygpLmdldElkKCl9LS0ke3NJZH1gLFxuXHRcdFx0b0J1dHRvbiA9ICh0aGlzLl9nZXRPYmplY3RQYWdlTGF5b3V0Q29udHJvbCgpLmdldEhlYWRlclRpdGxlKCkgYXMgT2JqZWN0UGFnZUR5bmFtaWNIZWFkZXJUaXRsZSlcblx0XHRcdFx0LmdldEFjdGlvbnMoKVxuXHRcdFx0XHQuZmluZChmdW5jdGlvbiAob0VsZW1lbnQ6IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBvRWxlbWVudC5nZXRJZCgpID09PSBzQnV0dG9uSWQ7XG5cdFx0XHRcdH0pO1xuXHRcdENvbW1vblV0aWxzLmZpcmVCdXR0b25QcmVzcyhvQnV0dG9uKTtcblx0fVxuXG5cdF9leGVjdXRlRm9vdGVyU2hvcnRjdXQoc0lkOiBhbnkpIHtcblx0XHRjb25zdCBzQnV0dG9uSWQgPSBgJHt0aGlzLmdldFZpZXcoKS5nZXRJZCgpfS0tJHtzSWR9YCxcblx0XHRcdG9CdXR0b24gPSAodGhpcy5fZ2V0T2JqZWN0UGFnZUxheW91dENvbnRyb2woKS5nZXRGb290ZXIoKSBhcyBhbnkpLmdldENvbnRlbnQoKS5maW5kKGZ1bmN0aW9uIChvRWxlbWVudDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvRWxlbWVudC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSA9PT0gXCJzYXAubS5CdXR0b25cIiAmJiBvRWxlbWVudC5nZXRJZCgpID09PSBzQnV0dG9uSWQ7XG5cdFx0XHR9KTtcblx0XHRDb21tb25VdGlscy5maXJlQnV0dG9uUHJlc3Mob0J1dHRvbik7XG5cdH1cblxuXHRfZXhlY3V0ZVRhYlNob3J0Q3V0KG9FeGVjdXRpb246IGFueSkge1xuXHRcdGNvbnN0IG9PYmplY3RQYWdlID0gdGhpcy5fZ2V0T2JqZWN0UGFnZUxheW91dENvbnRyb2woKSxcblx0XHRcdGFTZWN0aW9ucyA9IG9PYmplY3RQYWdlLmdldFNlY3Rpb25zKCksXG5cdFx0XHRpU2VjdGlvbkluZGV4TWF4ID0gYVNlY3Rpb25zLmxlbmd0aCAtIDEsXG5cdFx0XHRzQ29tbWFuZCA9IG9FeGVjdXRpb24ub1NvdXJjZS5nZXRDb21tYW5kKCk7XG5cdFx0bGV0IG5ld1NlY3Rpb24sXG5cdFx0XHRpU2VsZWN0ZWRTZWN0aW9uSW5kZXggPSBvT2JqZWN0UGFnZS5pbmRleE9mU2VjdGlvbih0aGlzLmJ5SWQob09iamVjdFBhZ2UuZ2V0U2VsZWN0ZWRTZWN0aW9uKCkpIGFzIE9iamVjdFBhZ2VTZWN0aW9uKTtcblx0XHRpZiAoaVNlbGVjdGVkU2VjdGlvbkluZGV4ICE9PSAtMSAmJiBpU2VjdGlvbkluZGV4TWF4ID4gMCkge1xuXHRcdFx0aWYgKHNDb21tYW5kID09PSBcIk5leHRUYWJcIikge1xuXHRcdFx0XHRpZiAoaVNlbGVjdGVkU2VjdGlvbkluZGV4IDw9IGlTZWN0aW9uSW5kZXhNYXggLSAxKSB7XG5cdFx0XHRcdFx0bmV3U2VjdGlvbiA9IGFTZWN0aW9uc1srK2lTZWxlY3RlZFNlY3Rpb25JbmRleF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoaVNlbGVjdGVkU2VjdGlvbkluZGV4ICE9PSAwKSB7XG5cdFx0XHRcdC8vIFByZXZpb3VzVGFiXG5cdFx0XHRcdG5ld1NlY3Rpb24gPSBhU2VjdGlvbnNbLS1pU2VsZWN0ZWRTZWN0aW9uSW5kZXhdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV3U2VjdGlvbikge1xuXHRcdFx0XHRvT2JqZWN0UGFnZS5zZXRTZWxlY3RlZFNlY3Rpb24obmV3U2VjdGlvbik7XG5cdFx0XHRcdG5ld1NlY3Rpb24uZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRfZ2V0Rm9vdGVyVmlzaWJpbGl0eSgpIHtcblx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSB0aGlzLmdldFZpZXcoKS5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0O1xuXHRcdGNvbnN0IHNWaWV3SWQgPSB0aGlzLmdldFZpZXcoKS5nZXRJZCgpO1xuXHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcIm1lc3NhZ2VGb290ZXJDb250YWluc0Vycm9yc1wiLCBmYWxzZSk7XG5cdFx0c2FwLnVpXG5cdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHQuZ2V0TWVzc2FnZU1hbmFnZXIoKVxuXHRcdFx0LmdldE1lc3NhZ2VNb2RlbCgpXG5cdFx0XHQuZ2V0RGF0YSgpXG5cdFx0XHQuZm9yRWFjaChmdW5jdGlvbiAob01lc3NhZ2U6IGFueSkge1xuXHRcdFx0XHRpZiAob01lc3NhZ2UudmFsaWRhdGlvbiAmJiBvTWVzc2FnZS50eXBlID09PSBcIkVycm9yXCIgJiYgb01lc3NhZ2UudGFyZ2V0LmluZGV4T2Yoc1ZpZXdJZCkgPiAtMSkge1xuXHRcdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcIm1lc3NhZ2VGb290ZXJDb250YWluc0Vycm9yc1wiLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH1cblxuXHRfc2hvd01lc3NhZ2VQb3BvdmVyKGVycj86IGFueSwgb1JldD86IGFueSkge1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdExvZy5lcnJvcihlcnIpO1xuXHRcdH1cblx0XHRjb25zdCByb290Vmlld0NvbnRyb2xsZXIgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIGFueTtcblx0XHRjb25zdCBjdXJyZW50UGFnZVZpZXcgPSByb290Vmlld0NvbnRyb2xsZXIuaXNGY2xFbmFibGVkKClcblx0XHRcdD8gcm9vdFZpZXdDb250cm9sbGVyLmdldFJpZ2h0bW9zdFZpZXcoKVxuXHRcdFx0OiAodGhpcy5nZXRBcHBDb21wb25lbnQoKS5nZXRSb290Q29udGFpbmVyKCkgYXMgYW55KS5nZXRDdXJyZW50UGFnZSgpO1xuXHRcdGlmICghY3VycmVudFBhZ2VWaWV3LmlzQShcInNhcC5tLk1lc3NhZ2VQYWdlXCIpKSB7XG5cdFx0XHRjb25zdCBvTWVzc2FnZUJ1dHRvbiA9IHRoaXMubWVzc2FnZUJ1dHRvbixcblx0XHRcdFx0b01lc3NhZ2VQb3BvdmVyID0gb01lc3NhZ2VCdXR0b24ub01lc3NhZ2VQb3BvdmVyLFxuXHRcdFx0XHRvSXRlbUJpbmRpbmcgPSBvTWVzc2FnZVBvcG92ZXIuZ2V0QmluZGluZyhcIml0ZW1zXCIpO1xuXG5cdFx0XHRpZiAob0l0ZW1CaW5kaW5nLmdldExlbmd0aCgpID4gMCAmJiAhb01lc3NhZ2VQb3BvdmVyLmlzT3BlbigpKSB7XG5cdFx0XHRcdG9NZXNzYWdlQnV0dG9uLnNldFZpc2libGUodHJ1ZSk7XG5cdFx0XHRcdC8vIHdvcmthcm91bmQgdG8gZW5zdXJlIHRoYXQgb01lc3NhZ2VCdXR0b24gaXMgcmVuZGVyZWQgd2hlbiBvcGVuQnkgaXMgY2FsbGVkXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9NZXNzYWdlUG9wb3Zlci5vcGVuQnkob01lc3NhZ2VCdXR0b24pO1xuXHRcdFx0XHR9LCAwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9SZXQ7XG5cdH1cblxuXHRfZWRpdERvY3VtZW50KG9Db250ZXh0OiBhbnkpIHtcblx0XHRjb25zdCBvTW9kZWwgPSB0aGlzLmdldFZpZXcoKS5nZXRNb2RlbChcInVpXCIpO1xuXHRcdEJ1c3lMb2NrZXIubG9jayhvTW9kZWwpO1xuXHRcdHJldHVybiB0aGlzLmVkaXRGbG93LmVkaXREb2N1bWVudC5hcHBseSh0aGlzLmVkaXRGbG93LCBbb0NvbnRleHRdKS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKG9Nb2RlbCk7XG5cdFx0fSk7XG5cdH1cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvbnRleHQgb2YgdGhlIERyYWZ0Um9vdCBwYXRoLlxuXHQgKiBJZiBhIHZpZXcgaGFzIGJlZW4gY3JlYXRlZCB3aXRoIHRoZSBkcmFmdCBSb290IFBhdGgsIHRoaXMgbWV0aG9kIHJldHVybnMgaXRzIGJpbmRpbmdDb250ZXh0LlxuXHQgKiBXaGVyZSBubyB2aWV3IGlzIGZvdW5kIGEgbmV3IGNyZWF0ZWQgY29udGV4dCBpcyByZXR1cm5lZC5cblx0ICogVGhlIG5ldyBjcmVhdGVkIGNvbnRleHQgcmVxdWVzdCB0aGUga2V5IG9mIHRoZSBlbnRpdHkgaW4gb3JkZXIgdG8gZ2V0IHRoZSBFdGFnIG9mIHRoaXMgZW50aXR5LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0RHJhZnRSb290UGF0aFxuXHQgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZVxuXHQgKi9cblx0YXN5bmMgZ2V0RHJhZnRSb290Q29udGV4dCgpOiBQcm9taXNlPFY0Q29udGV4dCB8IHVuZGVmaW5lZD4ge1xuXHRcdGNvbnN0IHZpZXcgPSB0aGlzLmdldFZpZXcoKTtcblx0XHRjb25zdCBjb250ZXh0ID0gdmlldy5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIFY0Q29udGV4dDtcblx0XHRpZiAoY29udGV4dCkge1xuXHRcdFx0Y29uc3QgZHJhZnRSb290Q29udGV4dFBhdGggPSBNb2RlbEhlbHBlci5nZXREcmFmdFJvb3RQYXRoKGNvbnRleHQpO1xuXHRcdFx0bGV0IHNpbXBsZURyYWZ0Um9vdENvbnRleHQ6IFY0Q29udGV4dDtcblx0XHRcdGlmIChkcmFmdFJvb3RDb250ZXh0UGF0aCkge1xuXHRcdFx0XHQvLyBDaGVjayBpZiBhIHZpZXcgbWF0Y2hlcyB3aXRoIHRoZSBkcmFmdCByb290IHBhdGhcblx0XHRcdFx0Y29uc3QgZXhpc3RpbmdCaW5kaW5nQ29udGV4dE9uUGFnZSA9ICh0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldFJvb3RWaWV3Q29udHJvbGxlcigpIGFzIFJvb3RWaWV3QmFzZUNvbnRyb2xsZXIpXG5cdFx0XHRcdFx0LmdldEluc3RhbmNlZFZpZXdzKClcblx0XHRcdFx0XHQuZmluZCgocGFnZVZpZXc6IFZpZXcpID0+IHBhZ2VWaWV3LmdldEJpbmRpbmdDb250ZXh0KCk/LmdldFBhdGgoKSA9PT0gZHJhZnRSb290Q29udGV4dFBhdGgpXG5cdFx0XHRcdFx0Py5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIFY0Q29udGV4dDtcblx0XHRcdFx0aWYgKGV4aXN0aW5nQmluZGluZ0NvbnRleHRPblBhZ2UpIHtcblx0XHRcdFx0XHRyZXR1cm4gZXhpc3RpbmdCaW5kaW5nQ29udGV4dE9uUGFnZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBpbnRlcm5hbE1vZGVsID0gdmlldy5nZXRNb2RlbChcImludGVybmFsXCIpIGFzIEpTT05Nb2RlbDtcblx0XHRcdFx0c2ltcGxlRHJhZnRSb290Q29udGV4dCA9IGludGVybmFsTW9kZWwuZ2V0UHJvcGVydHkoXCIvc2ltcGxlRHJhZnRSb290Q29udGV4dFwiKTtcblx0XHRcdFx0aWYgKHNpbXBsZURyYWZ0Um9vdENvbnRleHQ/LmdldFBhdGgoKSA9PT0gZHJhZnRSb290Q29udGV4dFBhdGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2ltcGxlRHJhZnRSb290Q29udGV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBtb2RlbCA9IGNvbnRleHQuZ2V0TW9kZWwoKTtcblx0XHRcdFx0Y29uc3QgbWV0YU1vZGVsID0gbW9kZWwuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0XHRcdGNvbnN0IHNFbnRpdHlQYXRoID0gbWV0YU1vZGVsLmdldE1ldGFQYXRoKGRyYWZ0Um9vdENvbnRleHRQYXRoKTtcblx0XHRcdFx0Y29uc3QgbURhdGFNb2RlbCA9IE1ldGFNb2RlbENvbnZlcnRlci5nZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMobWV0YU1vZGVsLmdldENvbnRleHQoc0VudGl0eVBhdGgpKTtcblx0XHRcdFx0c2ltcGxlRHJhZnRSb290Q29udGV4dCA9IG1vZGVsLmJpbmRDb250ZXh0KGRyYWZ0Um9vdENvbnRleHRQYXRoKS5nZXRCb3VuZENvbnRleHQoKTtcblx0XHRcdFx0YXdhaXQgc2ltcGxlRHJhZnRSb290Q29udGV4dC5yZXF1ZXN0UHJvcGVydHkobURhdGFNb2RlbC50YXJnZXRFbnRpdHlUeXBlLmtleXNbMF0/Lm5hbWUpO1xuXHRcdFx0XHQvLyBTdG9yZSB0aGlzIG5ldyBjcmVhdGVkIGNvbnRleHQgdG8gdXNlIGl0IG9uIHRoZSBuZXh0IGl0ZXJhdGlvbnNcblx0XHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9zaW1wbGVEcmFmdFJvb3RDb250ZXh0XCIsIHNpbXBsZURyYWZ0Um9vdENvbnRleHQpO1xuXHRcdFx0XHRyZXR1cm4gc2ltcGxlRHJhZnRSb290Q29udGV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHRhc3luYyBfdmFsaWRhdGVEb2N1bWVudCgpOiBQcm9taXNlPHZvaWQgfCBhbnlbXSB8IE9EYXRhQ29udGV4dEJpbmRpbmdFeD4ge1xuXHRcdGNvbnN0IGNvbnRyb2wgPSBDb3JlLmJ5SWQoQ29yZS5nZXRDdXJyZW50Rm9jdXNlZENvbnRyb2xJZCgpKTtcblx0XHRjb25zdCBjb250ZXh0ID0gY29udHJvbD8uZ2V0QmluZGluZ0NvbnRleHQoKSBhcyBWNENvbnRleHQ7XG5cdFx0aWYgKGNvbnRleHQgJiYgIWNvbnRleHQuaXNUcmFuc2llbnQoKSkge1xuXHRcdFx0Ly8gV2FpdCBmb3IgdGhlIHBlbmRpbmcgY2hhbmdlcyBiZWZvcmUgc3RhcnRpbmcgdGhpcyB2YWxpZGF0aW9uXG5cdFx0XHRhd2FpdCB0aGlzLl9lZGl0Rmxvdy5zeW5jVGFzaygpO1xuXHRcdFx0Y29uc3QgYXBwQ29tcG9uZW50ID0gdGhpcy5nZXRBcHBDb21wb25lbnQoKTtcblx0XHRcdGNvbnN0IHNpZGVFZmZlY3RzU2VydmljZSA9IGFwcENvbXBvbmVudC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKTtcblx0XHRcdGNvbnN0IGVudGl0eVR5cGUgPSBzaWRlRWZmZWN0c1NlcnZpY2UuZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0KGNvbnRleHQpO1xuXHRcdFx0Y29uc3QgZ2xvYmFsU2lkZUVmZmVjdHMgPSBlbnRpdHlUeXBlID8gc2lkZUVmZmVjdHNTZXJ2aWNlLmdldEdsb2JhbE9EYXRhRW50aXR5U2lkZUVmZmVjdHMoZW50aXR5VHlwZSkgOiBbXTtcblx0XHRcdC8vIElmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBnbG9iYWwgU2lkZUVmZmVjdHMgZm9yIHRoZSByZWxhdGVkIGVudGl0eSwgZXhlY3V0ZSBpdC90aGVtXG5cdFx0XHRpZiAoZ2xvYmFsU2lkZUVmZmVjdHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChnbG9iYWxTaWRlRWZmZWN0cy5tYXAoKHNpZGVFZmZlY3RzKSA9PiB0aGlzLl9zaWRlRWZmZWN0cy5yZXF1ZXN0U2lkZUVmZmVjdHMoc2lkZUVmZmVjdHMsIGNvbnRleHQpKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBkcmFmdFJvb3RDb250ZXh0ID0gYXdhaXQgdGhpcy5nZXREcmFmdFJvb3RDb250ZXh0KCk7XG5cdFx0XHRcdC8vRXhlY3V0ZSB0aGUgZHJhZnRWYWxpZGF0aW9uIGlmIHRoZXJlIGlzIG5vIGdsb2JhbFNpZGVFZmZlY3RzXG5cdFx0XHRcdGlmIChkcmFmdFJvb3RDb250ZXh0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRyYWZ0LmV4ZWN1dGVEcmFmdFZhbGlkYXRpb24oZHJhZnRSb290Q29udGV4dCwgYXBwQ29tcG9uZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0YXN5bmMgX3NhdmVEb2N1bWVudChvQ29udGV4dDogYW55KSB7XG5cdFx0Y29uc3Qgb01vZGVsID0gdGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJ1aVwiKSxcblx0XHRcdGFXYWl0Q3JlYXRlRG9jdW1lbnRzOiBhbnlbXSA9IFtdO1xuXHRcdC8vIGluZGljYXRlcyBpZiB3ZSBhcmUgY3JlYXRpbmcgYSBuZXcgcm93IGluIHRoZSBPUFxuXHRcdGxldCBiRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvciA9IGZhbHNlO1xuXHRcdEJ1c3lMb2NrZXIubG9jayhvTW9kZWwpO1xuXHRcdHRoaXMuX2ZpbmRUYWJsZXMoKS5mb3JFYWNoKChvVGFibGU6IGFueSkgPT4ge1xuXHRcdFx0Y29uc3Qgb0JpbmRpbmcgPSB0aGlzLl9nZXRUYWJsZUJpbmRpbmcob1RhYmxlKTtcblx0XHRcdGNvbnN0IG1QYXJhbWV0ZXJzOiBhbnkgPSB7XG5cdFx0XHRcdGNyZWF0aW9uTW9kZTogb1RhYmxlLmRhdGEoXCJjcmVhdGlvbk1vZGVcIiksXG5cdFx0XHRcdGNyZWF0aW9uUm93OiBvVGFibGUuZ2V0Q3JlYXRpb25Sb3coKSxcblx0XHRcdFx0Y3JlYXRlQXRFbmQ6IG9UYWJsZS5kYXRhKFwiY3JlYXRlQXRFbmRcIikgPT09IFwidHJ1ZVwiXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgYkNyZWF0ZURvY3VtZW50ID1cblx0XHRcdFx0bVBhcmFtZXRlcnMuY3JlYXRpb25Sb3cgJiZcblx0XHRcdFx0bVBhcmFtZXRlcnMuY3JlYXRpb25Sb3cuZ2V0QmluZGluZ0NvbnRleHQoKSAmJlxuXHRcdFx0XHRPYmplY3Qua2V5cyhtUGFyYW1ldGVycy5jcmVhdGlvblJvdy5nZXRCaW5kaW5nQ29udGV4dCgpLmdldE9iamVjdCgpKS5sZW5ndGggPiAxO1xuXHRcdFx0aWYgKGJDcmVhdGVEb2N1bWVudCkge1xuXHRcdFx0XHQvLyB0aGUgYlNraXBTaWRlRWZmZWN0cyBpcyBhIHBhcmFtZXRlciBjcmVhdGVkIHdoZW4gd2UgY2xpY2sgdGhlIHNhdmUga2V5LiBJZiB3ZSBwcmVzcyB0aGlzIGtleVxuXHRcdFx0XHQvLyB3ZSBkb24ndCBleGVjdXRlIHRoZSBoYW5kbGVTaWRlRWZmZWN0cyBmdW5jaXRvbiB0byBhdm9pZCBiYXRjaCByZWR1bmRhbmN5XG5cdFx0XHRcdG1QYXJhbWV0ZXJzLmJTa2lwU2lkZUVmZmVjdHMgPSB0cnVlO1xuXHRcdFx0XHRiRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvciA9IHRydWU7XG5cdFx0XHRcdGFXYWl0Q3JlYXRlRG9jdW1lbnRzLnB1c2goXG5cdFx0XHRcdFx0dGhpcy5lZGl0Rmxvdy5jcmVhdGVEb2N1bWVudChvQmluZGluZywgbVBhcmFtZXRlcnMpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9CaW5kaW5nO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgYUJpbmRpbmdzID0gYXdhaXQgUHJvbWlzZS5hbGwoYVdhaXRDcmVhdGVEb2N1bWVudHMpO1xuXHRcdFx0Y29uc3QgbVBhcmFtZXRlcnMgPSB7XG5cdFx0XHRcdGJFeGVjdXRlU2lkZUVmZmVjdHNPbkVycm9yOiBiRXhlY3V0ZVNpZGVFZmZlY3RzT25FcnJvcixcblx0XHRcdFx0YmluZGluZ3M6IGFCaW5kaW5nc1xuXHRcdFx0fTtcblx0XHRcdC8vIFdlIG5lZWQgdG8gZWl0aGVyIHJlamVjdCBvciByZXNvbHZlIGEgcHJvbWlzZSBoZXJlIGFuZCByZXR1cm4gaXQgc2luY2UgdGhpcyBzYXZlXG5cdFx0XHQvLyBmdW5jdGlvbiBpcyBub3Qgb25seSBjYWxsZWQgd2hlbiBwcmVzc2luZyB0aGUgc2F2ZSBidXR0b24gaW4gdGhlIGZvb3RlciwgYnV0IGFsc29cblx0XHRcdC8vIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBjcmVhdGUgb3Igc2F2ZSBpbiBhIGRhdGFsb3NzIHBvcHVwLlxuXHRcdFx0Ly8gVGhlIGxvZ2ljIG9mIHRoZSBkYXRhbG9zcyBwb3B1cCBuZWVkcyB0byBkZXRlY3QgaWYgdGhlIHNhdmUgaGFkIGVycm9ycyBvciBub3QgaW4gb3JkZXJcblx0XHRcdC8vIHRvIGRlY2lkZSBpZiB0aGUgc3Vic2VxdWVudCBhY3Rpb24gLSBsaWtlIGEgYmFjayBuYXZpZ2F0aW9uIC0gaGFzIHRvIGJlIGV4ZWN1dGVkIG9yIG5vdC5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuZWRpdEZsb3cuc2F2ZURvY3VtZW50KG9Db250ZXh0LCBtUGFyYW1ldGVycyk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIElmIHRoZSBzYXZlRG9jdW1lbnQgaW4gZWRpdEZsb3cgcmV0dXJucyBlcnJvcnMgd2UgbmVlZFxuXHRcdFx0XHQvLyB0byBzaG93IHRoZSBtZXNzYWdlIHBvcG92ZXIgaGVyZSBhbmQgZW5zdXJlIHRoYXQgdGhlXG5cdFx0XHRcdC8vIGRhdGFsb3NzIGxvZ2ljIGRvZXMgbm90IHBlcmZvcm0gdGhlIGZvbGxvdyB1cCBmdW5jdGlvblxuXHRcdFx0XHQvLyBsaWtlIGUuZy4gYSBiYWNrIG5hdmlnYXRpb24gaGVuY2Ugd2UgcmV0dXJuIGEgcHJvbWlzZSBhbmQgcmVqZWN0IGl0XG5cdFx0XHRcdHRoaXMuX3Nob3dNZXNzYWdlUG9wb3ZlcihlcnJvcik7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fVxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRpZiAoQnVzeUxvY2tlci5pc0xvY2tlZChvTW9kZWwpKSB7XG5cdFx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKG9Nb2RlbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0X21hbmFnZUNvbGxhYm9yYXRpb24oKSB7XG5cdFx0b3Blbk1hbmFnZURpYWxvZyh0aGlzLmdldFZpZXcoKSk7XG5cdH1cblxuXHRfc2hvd0NvbGxhYm9yYXRpb25Vc2VyRGV0YWlscyhldmVudDogYW55KSB7XG5cdFx0c2hvd1VzZXJEZXRhaWxzKGV2ZW50LCB0aGlzLmdldFZpZXcoKSk7XG5cdH1cblxuXHRfY2FuY2VsRG9jdW1lbnQob0NvbnRleHQ6IGFueSwgbVBhcmFtZXRlcnM6IGFueSkge1xuXHRcdG1QYXJhbWV0ZXJzLmNhbmNlbEJ1dHRvbiA9IHRoaXMuZ2V0VmlldygpLmJ5SWQobVBhcmFtZXRlcnMuY2FuY2VsQnV0dG9uKTsgLy90byBnZXQgdGhlIHJlZmVyZW5jZSBvZiB0aGUgY2FuY2VsIGJ1dHRvbiBmcm9tIGNvbW1hbmQgZXhlY3V0aW9uXG5cdFx0cmV0dXJuIHRoaXMuZWRpdEZsb3cuY2FuY2VsRG9jdW1lbnQob0NvbnRleHQsIG1QYXJhbWV0ZXJzKTtcblx0fVxuXG5cdF9hcHBseURvY3VtZW50KG9Db250ZXh0OiBhbnkpIHtcblx0XHRyZXR1cm4gdGhpcy5lZGl0Rmxvdy5hcHBseURvY3VtZW50KG9Db250ZXh0KS5jYXRjaCgoKSA9PiB0aGlzLl9zaG93TWVzc2FnZVBvcG92ZXIoKSk7XG5cdH1cblxuXHRfdXBkYXRlUmVsYXRlZEFwcHMoKSB7XG5cdFx0Y29uc3Qgb09iamVjdFBhZ2UgPSB0aGlzLl9nZXRPYmplY3RQYWdlTGF5b3V0Q29udHJvbCgpO1xuXHRcdGlmIChDb21tb25VdGlscy5yZXNvbHZlU3RyaW5ndG9Cb29sZWFuKG9PYmplY3RQYWdlLmRhdGEoXCJzaG93UmVsYXRlZEFwcHNcIikpKSB7XG5cdFx0XHRDb21tb25VdGlscy51cGRhdGVSZWxhdGVkQXBwc0RldGFpbHMob09iamVjdFBhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdF9maW5kQ29udHJvbEluU3ViU2VjdGlvbihhUGFyZW50RWxlbWVudDogYW55LCBhU3Vic2VjdGlvbjogYW55LCBhQ29udHJvbHM6IGFueSwgYklzQ2hhcnQ/OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgYVN1YlNlY3Rpb25UYWJsZXMgPSBbXTtcblx0XHRmb3IgKGxldCBlbGVtZW50ID0gMDsgZWxlbWVudCA8IGFQYXJlbnRFbGVtZW50Lmxlbmd0aDsgZWxlbWVudCsrKSB7XG5cdFx0XHRsZXQgb0VsZW1lbnQgPSBhUGFyZW50RWxlbWVudFtlbGVtZW50XS5nZXRDb250ZW50IGluc3RhbmNlb2YgRnVuY3Rpb24gJiYgYVBhcmVudEVsZW1lbnRbZWxlbWVudF0uZ2V0Q29udGVudCgpO1xuXHRcdFx0aWYgKGJJc0NoYXJ0KSB7XG5cdFx0XHRcdGlmIChvRWxlbWVudCAmJiBvRWxlbWVudC5tQWdncmVnYXRpb25zICYmIG9FbGVtZW50LmdldEFnZ3JlZ2F0aW9uKFwiaXRlbXNcIikpIHtcblx0XHRcdFx0XHRjb25zdCBhSXRlbXMgPSBvRWxlbWVudC5nZXRBZ2dyZWdhdGlvbihcIml0ZW1zXCIpO1xuXHRcdFx0XHRcdGFJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChvSXRlbTogYW55KSB7XG5cdFx0XHRcdFx0XHRpZiAob0l0ZW0uaXNBKFwic2FwLmZlLm1hY3Jvcy5jaGFydC5DaGFydEFQSVwiKSkge1xuXHRcdFx0XHRcdFx0XHRvRWxlbWVudCA9IG9JdGVtO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAob0VsZW1lbnQgJiYgb0VsZW1lbnQuaXNBICYmIG9FbGVtZW50LmlzQShcInNhcC51aS5sYXlvdXQuRHluYW1pY1NpZGVDb250ZW50XCIpKSB7XG5cdFx0XHRcdG9FbGVtZW50ID0gb0VsZW1lbnQuZ2V0TWFpbkNvbnRlbnQgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiBvRWxlbWVudC5nZXRNYWluQ29udGVudCgpO1xuXHRcdFx0XHRpZiAob0VsZW1lbnQgJiYgb0VsZW1lbnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdG9FbGVtZW50ID0gb0VsZW1lbnRbMF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvRWxlbWVudCAmJiBvRWxlbWVudC5pc0EgJiYgb0VsZW1lbnQuaXNBKFwic2FwLmZlLm1hY3Jvcy50YWJsZS5UYWJsZUFQSVwiKSkge1xuXHRcdFx0XHRvRWxlbWVudCA9IG9FbGVtZW50LmdldENvbnRlbnQgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiBvRWxlbWVudC5nZXRDb250ZW50KCk7XG5cdFx0XHRcdGlmIChvRWxlbWVudCAmJiBvRWxlbWVudC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0b0VsZW1lbnQgPSBvRWxlbWVudFswXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG9FbGVtZW50ICYmIG9FbGVtZW50LmlzQSAmJiBvRWxlbWVudC5pc0EoXCJzYXAudWkubWRjLlRhYmxlXCIpKSB7XG5cdFx0XHRcdGFDb250cm9scy5wdXNoKG9FbGVtZW50KTtcblx0XHRcdFx0YVN1YlNlY3Rpb25UYWJsZXMucHVzaCh7XG5cdFx0XHRcdFx0XCJ0YWJsZVwiOiBvRWxlbWVudCxcblx0XHRcdFx0XHRcImdyaWRUYWJsZVwiOiBvRWxlbWVudC5nZXRUeXBlKCkuaXNBKFwic2FwLnVpLm1kYy50YWJsZS5HcmlkVGFibGVUeXBlXCIpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob0VsZW1lbnQgJiYgb0VsZW1lbnQuaXNBICYmIG9FbGVtZW50LmlzQShcInNhcC5mZS5tYWNyb3MuY2hhcnQuQ2hhcnRBUElcIikpIHtcblx0XHRcdFx0b0VsZW1lbnQgPSBvRWxlbWVudC5nZXRDb250ZW50IGluc3RhbmNlb2YgRnVuY3Rpb24gJiYgb0VsZW1lbnQuZ2V0Q29udGVudCgpO1xuXHRcdFx0XHRpZiAob0VsZW1lbnQgJiYgb0VsZW1lbnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdG9FbGVtZW50ID0gb0VsZW1lbnRbMF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvRWxlbWVudCAmJiBvRWxlbWVudC5pc0EgJiYgb0VsZW1lbnQuaXNBKFwic2FwLnVpLm1kYy5DaGFydFwiKSkge1xuXHRcdFx0XHRhQ29udHJvbHMucHVzaChvRWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChcblx0XHRcdGFTdWJTZWN0aW9uVGFibGVzLmxlbmd0aCA9PT0gMSAmJlxuXHRcdFx0YVBhcmVudEVsZW1lbnQubGVuZ3RoID09PSAxICYmXG5cdFx0XHRhU3ViU2VjdGlvblRhYmxlc1swXS5ncmlkVGFibGUgJiZcblx0XHRcdCFhU3Vic2VjdGlvbi5oYXNTdHlsZUNsYXNzKFwic2FwVXhBUE9iamVjdFBhZ2VTdWJTZWN0aW9uRml0Q29udGFpbmVyXCIpXG5cdFx0KSB7XG5cdFx0XHQvL0luIGNhc2UgdGhlcmUgaXMgb25seSBhIHNpbmdsZSB0YWJsZSBpbiBhIHNlY3Rpb24gd2UgZml0IHRoYXQgdG8gdGhlIHdob2xlIHBhZ2Ugc28gdGhhdCB0aGUgc2Nyb2xsYmFyIGNvbWVzIG9ubHkgb24gdGFibGUgYW5kIG5vdCBvbiBwYWdlXG5cdFx0XHRhU3Vic2VjdGlvbi5hZGRTdHlsZUNsYXNzKFwic2FwVXhBUE9iamVjdFBhZ2VTdWJTZWN0aW9uRml0Q29udGFpbmVyXCIpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRBbGxTdWJTZWN0aW9ucygpIHtcblx0XHRjb25zdCBvT2JqZWN0UGFnZSA9IHRoaXMuX2dldE9iamVjdFBhZ2VMYXlvdXRDb250cm9sKCk7XG5cdFx0bGV0IGFTdWJTZWN0aW9uczogYW55W10gPSBbXTtcblx0XHRvT2JqZWN0UGFnZS5nZXRTZWN0aW9ucygpLmZvckVhY2goZnVuY3Rpb24gKG9TZWN0aW9uOiBhbnkpIHtcblx0XHRcdGFTdWJTZWN0aW9ucyA9IGFTdWJTZWN0aW9ucy5jb25jYXQob1NlY3Rpb24uZ2V0U3ViU2VjdGlvbnMoKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGFTdWJTZWN0aW9ucztcblx0fVxuXG5cdF9nZXRBbGxCbG9ja3MoKSB7XG5cdFx0bGV0IGFCbG9ja3M6IGFueVtdID0gW107XG5cdFx0dGhpcy5fZ2V0QWxsU3ViU2VjdGlvbnMoKS5mb3JFYWNoKGZ1bmN0aW9uIChvU3ViU2VjdGlvbjogYW55KSB7XG5cdFx0XHRhQmxvY2tzID0gYUJsb2Nrcy5jb25jYXQob1N1YlNlY3Rpb24uZ2V0QmxvY2tzKCkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBhQmxvY2tzO1xuXHR9XG5cblx0X2ZpbmRUYWJsZXMoKSB7XG5cdFx0Y29uc3QgYVN1YlNlY3Rpb25zID0gdGhpcy5fZ2V0QWxsU3ViU2VjdGlvbnMoKTtcblx0XHRjb25zdCBhVGFibGVzOiBhbnlbXSA9IFtdO1xuXHRcdGZvciAobGV0IHN1YlNlY3Rpb24gPSAwOyBzdWJTZWN0aW9uIDwgYVN1YlNlY3Rpb25zLmxlbmd0aDsgc3ViU2VjdGlvbisrKSB7XG5cdFx0XHR0aGlzLl9maW5kQ29udHJvbEluU3ViU2VjdGlvbihhU3ViU2VjdGlvbnNbc3ViU2VjdGlvbl0uZ2V0QmxvY2tzKCksIGFTdWJTZWN0aW9uc1tzdWJTZWN0aW9uXSwgYVRhYmxlcyk7XG5cdFx0XHR0aGlzLl9maW5kQ29udHJvbEluU3ViU2VjdGlvbihhU3ViU2VjdGlvbnNbc3ViU2VjdGlvbl0uZ2V0TW9yZUJsb2NrcygpLCBhU3ViU2VjdGlvbnNbc3ViU2VjdGlvbl0sIGFUYWJsZXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gYVRhYmxlcztcblx0fVxuXG5cdF9maW5kQ2hhcnRzKCkge1xuXHRcdGNvbnN0IGFTdWJTZWN0aW9ucyA9IHRoaXMuX2dldEFsbFN1YlNlY3Rpb25zKCk7XG5cdFx0Y29uc3QgYUNoYXJ0czogYW55W10gPSBbXTtcblx0XHRmb3IgKGxldCBzdWJTZWN0aW9uID0gMDsgc3ViU2VjdGlvbiA8IGFTdWJTZWN0aW9ucy5sZW5ndGg7IHN1YlNlY3Rpb24rKykge1xuXHRcdFx0dGhpcy5fZmluZENvbnRyb2xJblN1YlNlY3Rpb24oYVN1YlNlY3Rpb25zW3N1YlNlY3Rpb25dLmdldEJsb2NrcygpLCBhU3ViU2VjdGlvbnNbc3ViU2VjdGlvbl0sIGFDaGFydHMsIHRydWUpO1xuXHRcdFx0dGhpcy5fZmluZENvbnRyb2xJblN1YlNlY3Rpb24oYVN1YlNlY3Rpb25zW3N1YlNlY3Rpb25dLmdldE1vcmVCbG9ja3MoKSwgYVN1YlNlY3Rpb25zW3N1YlNlY3Rpb25dLCBhQ2hhcnRzLCB0cnVlKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFDaGFydHM7XG5cdH1cblxuXHRfY2xvc2VTaWRlQ29udGVudCgpIHtcblx0XHR0aGlzLl9nZXRBbGxCbG9ja3MoKS5mb3JFYWNoKGZ1bmN0aW9uIChvQmxvY2s6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0NvbnRlbnQgPSBvQmxvY2suZ2V0Q29udGVudCBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmIG9CbG9jay5nZXRDb250ZW50KCk7XG5cdFx0XHRpZiAob0NvbnRlbnQgJiYgb0NvbnRlbnQuaXNBICYmIG9Db250ZW50LmlzQShcInNhcC51aS5sYXlvdXQuRHluYW1pY1NpZGVDb250ZW50XCIpKSB7XG5cdFx0XHRcdGlmIChvQ29udGVudC5zZXRTaG93U2lkZUNvbnRlbnQgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0XHRcdG9Db250ZW50LnNldFNob3dTaWRlQ29udGVudChmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGFydCBDb250ZXh0IGlzIHJlc29sdmVkIGZvciAxOm4gbWljcm9jaGFydHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQ2hhcnRDb250ZXh0IFRoZSBDb250ZXh0IG9mIHRoZSBNaWNyb0NoYXJ0XG5cdCAqIEBwYXJhbSBzQ2hhcnRQYXRoIFRoZSBjb2xsZWN0aW9uUGF0aCBvZiB0aGUgdGhlIGNoYXJ0XG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIEF0dHJpYnV0ZXMgb2YgdGhlIGNoYXJ0IENvbnRleHRcblx0ICovXG5cdF9nZXRDaGFydENvbnRleHREYXRhKG9DaGFydENvbnRleHQ6IGFueSwgc0NoYXJ0UGF0aDogc3RyaW5nKSB7XG5cdFx0Y29uc3Qgb0NvbnRleHREYXRhID0gb0NoYXJ0Q29udGV4dC5nZXRPYmplY3QoKTtcblx0XHRsZXQgb0NoYXJ0Q29udGV4dERhdGEgPSBbb0NvbnRleHREYXRhXTtcblx0XHRpZiAob0NoYXJ0Q29udGV4dCAmJiBzQ2hhcnRQYXRoKSB7XG5cdFx0XHRpZiAob0NvbnRleHREYXRhW3NDaGFydFBhdGhdKSB7XG5cdFx0XHRcdG9DaGFydENvbnRleHREYXRhID0gb0NvbnRleHREYXRhW3NDaGFydFBhdGhdO1xuXHRcdFx0XHRkZWxldGUgb0NvbnRleHREYXRhW3NDaGFydFBhdGhdO1xuXHRcdFx0XHRvQ2hhcnRDb250ZXh0RGF0YS5wdXNoKG9Db250ZXh0RGF0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvQ2hhcnRDb250ZXh0RGF0YTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTY3JvbGwgdGhlIHRhYmxlcyB0byB0aGUgcm93IHdpdGggdGhlIHNQYXRoXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBzYXAuZmUudGVtcGxhdGVzLk9iamVjdFBhZ2UuT2JqZWN0UGFnZUNvbnRyb2xsZXIuY29udHJvbGxlciNfc2Nyb2xsVGFibGVzVG9Sb3dcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNSb3dQYXRoICdzUGF0aCBvZiB0aGUgdGFibGUgcm93J1xuXHQgKi9cblxuXHRfc2Nyb2xsVGFibGVzVG9Sb3coc1Jvd1BhdGg6IHN0cmluZykge1xuXHRcdGlmICh0aGlzLl9maW5kVGFibGVzICYmIHRoaXMuX2ZpbmRUYWJsZXMoKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBhVGFibGVzID0gdGhpcy5fZmluZFRhYmxlcygpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhVGFibGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFRhYmxlU2Nyb2xsZXIuc2Nyb2xsVGFibGVUb1JvdyhhVGFibGVzW2ldLCBzUm93UGF0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byBtZXJnZSBzZWxlY3RlZCBjb250ZXh0cyBhbmQgZmlsdGVycy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9tZXJnZU11bHRpcGxlQ29udGV4dHNcblx0ICogQHBhcmFtIG9QYWdlQ29udGV4dCBQYWdlIGNvbnRleHRcblx0ICogQHBhcmFtIGFMaW5lQ29udGV4dCBTZWxlY3RlZCBDb250ZXh0c1xuXHQgKiBAcGFyYW0gc0NoYXJ0UGF0aCBDb2xsZWN0aW9uIG5hbWUgb2YgdGhlIGNoYXJ0XG5cdCAqIEByZXR1cm5zIFNlbGVjdGlvbiBWYXJpYW50IE9iamVjdFxuXHQgKi9cblx0X21lcmdlTXVsdGlwbGVDb250ZXh0cyhvUGFnZUNvbnRleHQ6IENvbnRleHQsIGFMaW5lQ29udGV4dDogYW55W10sIHNDaGFydFBhdGg6IHN0cmluZykge1xuXHRcdGxldCBhQXR0cmlidXRlczogYW55W10gPSBbXSxcblx0XHRcdGFQYWdlQXR0cmlidXRlcyA9IFtdLFxuXHRcdFx0b0NvbnRleHQsXG5cdFx0XHRzTWV0YVBhdGhMaW5lOiBzdHJpbmcsXG5cdFx0XHRzUGF0aExpbmU7XG5cblx0XHRjb25zdCBzUGFnZVBhdGggPSBvUGFnZUNvbnRleHQuZ2V0UGF0aCgpO1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvUGFnZUNvbnRleHQgJiYgb1BhZ2VDb250ZXh0LmdldE1vZGVsKCkgJiYgKG9QYWdlQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsKTtcblx0XHRjb25zdCBzTWV0YVBhdGhQYWdlID0gb01ldGFNb2RlbCAmJiBvTWV0YU1vZGVsLmdldE1ldGFQYXRoKHNQYWdlUGF0aCkucmVwbGFjZSgvXlxcLyovLCBcIlwiKTtcblxuXHRcdC8vIEdldCBzaW5nbGUgbGluZSBjb250ZXh0IGlmIG5lY2Vzc2FyeVxuXHRcdGlmIChhTGluZUNvbnRleHQgJiYgYUxpbmVDb250ZXh0Lmxlbmd0aCkge1xuXHRcdFx0b0NvbnRleHQgPSBhTGluZUNvbnRleHRbMF07XG5cdFx0XHRzUGF0aExpbmUgPSBvQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0XHRzTWV0YVBhdGhMaW5lID0gb01ldGFNb2RlbCAmJiBvTWV0YU1vZGVsLmdldE1ldGFQYXRoKHNQYXRoTGluZSkucmVwbGFjZSgvXlxcLyovLCBcIlwiKTtcblxuXHRcdFx0YUxpbmVDb250ZXh0LmZvckVhY2goKG9TaW5nbGVDb250ZXh0OiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKHNDaGFydFBhdGgpIHtcblx0XHRcdFx0XHRjb25zdCBvQ2hhcnRDb250ZXh0RGF0YSA9IHRoaXMuX2dldENoYXJ0Q29udGV4dERhdGEob1NpbmdsZUNvbnRleHQsIHNDaGFydFBhdGgpO1xuXHRcdFx0XHRcdGlmIChvQ2hhcnRDb250ZXh0RGF0YSkge1xuXHRcdFx0XHRcdFx0YUF0dHJpYnV0ZXMgPSBvQ2hhcnRDb250ZXh0RGF0YS5tYXAoZnVuY3Rpb24gKG9TdWJDaGFydENvbnRleHREYXRhOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRjb250ZXh0RGF0YTogb1N1YkNoYXJ0Q29udGV4dERhdGEsXG5cdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0OiBgJHtzTWV0YVBhdGhQYWdlfS8ke3NDaGFydFBhdGh9YFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFBdHRyaWJ1dGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0Y29udGV4dERhdGE6IG9TaW5nbGVDb250ZXh0LmdldE9iamVjdCgpLFxuXHRcdFx0XHRcdFx0ZW50aXR5U2V0OiBzTWV0YVBhdGhMaW5lXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhUGFnZUF0dHJpYnV0ZXMucHVzaCh7XG5cdFx0XHRjb250ZXh0RGF0YTogb1BhZ2VDb250ZXh0LmdldE9iamVjdCgpLFxuXHRcdFx0ZW50aXR5U2V0OiBzTWV0YVBhdGhQYWdlXG5cdFx0fSk7XG5cdFx0Ly8gQWRkaW5nIFBhZ2UgQ29udGV4dCB0byBzZWxlY3Rpb24gdmFyaWFudFxuXHRcdGFQYWdlQXR0cmlidXRlcyA9IENvbW1vblV0aWxzLnJlbW92ZVNlbnNpdGl2ZURhdGEoYVBhZ2VBdHRyaWJ1dGVzLCBvTWV0YU1vZGVsKTtcblx0XHRjb25zdCBvUGFnZUxldmVsU1YgPSBDb21tb25VdGlscy5hZGRQYWdlQ29udGV4dFRvU2VsZWN0aW9uVmFyaWFudChuZXcgU2VsZWN0aW9uVmFyaWFudCgpLCBhUGFnZUF0dHJpYnV0ZXMsIHRoaXMuZ2V0VmlldygpKTtcblx0XHRhQXR0cmlidXRlcyA9IENvbW1vblV0aWxzLnJlbW92ZVNlbnNpdGl2ZURhdGEoYUF0dHJpYnV0ZXMsIG9NZXRhTW9kZWwpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50OiBvUGFnZUxldmVsU1YsXG5cdFx0XHRhdHRyaWJ1dGVzOiBhQXR0cmlidXRlc1xuXHRcdH07XG5cdH1cblxuXHRfZ2V0QmF0Y2hHcm91cHNGb3JWaWV3KCkge1xuXHRcdGNvbnN0IG9WaWV3RGF0YSA9IHRoaXMuZ2V0VmlldygpLmdldFZpZXdEYXRhKCkgYXMgYW55LFxuXHRcdFx0b0NvbmZpZ3VyYXRpb25zID0gb1ZpZXdEYXRhLmNvbnRyb2xDb25maWd1cmF0aW9uLFxuXHRcdFx0YUNvbmZpZ3VyYXRpb25zID0gb0NvbmZpZ3VyYXRpb25zICYmIE9iamVjdC5rZXlzKG9Db25maWd1cmF0aW9ucyksXG5cdFx0XHRhQmF0Y2hHcm91cHMgPSBbXCIkYXV0by5IZXJvZXNcIiwgXCIkYXV0by5EZWNvcmF0aW9uXCIsIFwiJGF1dG8uV29ya2Vyc1wiXTtcblxuXHRcdGlmIChhQ29uZmlndXJhdGlvbnMgJiYgYUNvbmZpZ3VyYXRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdGFDb25maWd1cmF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzS2V5OiBhbnkpIHtcblx0XHRcdFx0Y29uc3Qgb0NvbmZpZ3VyYXRpb24gPSBvQ29uZmlndXJhdGlvbnNbc0tleV07XG5cdFx0XHRcdGlmIChvQ29uZmlndXJhdGlvbi5yZXF1ZXN0R3JvdXBJZCA9PT0gXCJMb25nUnVubmVyc1wiKSB7XG5cdFx0XHRcdFx0YUJhdGNoR3JvdXBzLnB1c2goXCIkYXV0by5Mb25nUnVubmVyc1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBhQmF0Y2hHcm91cHM7XG5cdH1cblxuXHQvKlxuXHQgKiBSZXNldCBCcmVhZGNydW1iIGxpbmtzXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0ge3NhcC5tLkJyZWFkY3J1bWJzfSBbb1NvdXJjZV0gcGFyZW50IGNvbnRyb2xcblx0ICogQGRlc2NyaXB0aW9uIFVzZWQgd2hlbiBjb250ZXh0IG9mIHRoZSBvYmplY3QgcGFnZSBjaGFuZ2VzLlxuXHQgKiAgICAgICAgICAgICAgVGhpcyBldmVudCBjYWxsYmFjayBpcyBhdHRhY2hlZCB0byBtb2RlbENvbnRleHRDaGFuZ2Vcblx0ICogICAgICAgICAgICAgIGV2ZW50IG9mIHRoZSBCcmVhZGNydW1iIGNvbnRyb2wgdG8gY2F0Y2ggY29udGV4dCBjaGFuZ2UuXG5cdCAqICAgICAgICAgICAgICBUaGVuIGVsZW1lbnQgYmluZGluZyBhbmQgaHJlZnMgYXJlIHVwZGF0ZWQgZm9yIGVhY2ggbGluay5cblx0ICpcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBleHBlcmltZW50YWxcblx0ICovXG5cdGFzeW5jIF9zZXRCcmVhZGNydW1iTGlua3Mob1NvdXJjZTogQnJlYWRDcnVtYnMpIHtcblx0XHRjb25zdCBvQ29udGV4dCA9IG9Tb3VyY2UuZ2V0QmluZGluZ0NvbnRleHQoKSxcblx0XHRcdG9BcHBDb21wb25lbnQgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpLFxuXHRcdFx0YVByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXSxcblx0XHRcdGFTa2lwUGFyYW1ldGVyaXplZDogYW55W10gPSBbXSxcblx0XHRcdHNOZXdQYXRoID0gb0NvbnRleHQ/LmdldFBhdGgoKSxcblx0XHRcdGFQYXRoUGFydHMgPSBzTmV3UGF0aD8uc3BsaXQoXCIvXCIpID8/IFtdLFxuXHRcdFx0b01ldGFNb2RlbCA9IG9BcHBDb21wb25lbnQgJiYgb0FwcENvbXBvbmVudC5nZXRNZXRhTW9kZWwoKTtcblx0XHRsZXQgc1BhdGggPSBcIlwiO1xuXHRcdHRyeSB7XG5cdFx0XHRhUGF0aFBhcnRzLnNoaWZ0KCk7XG5cdFx0XHRhUGF0aFBhcnRzLnNwbGljZSgtMSwgMSk7XG5cdFx0XHRhUGF0aFBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHNQYXRoUGFydDogYW55KSB7XG5cdFx0XHRcdHNQYXRoICs9IGAvJHtzUGF0aFBhcnR9YDtcblx0XHRcdFx0Y29uc3Qgb1Jvb3RWaWV3Q29udHJvbGxlciA9IG9BcHBDb21wb25lbnQuZ2V0Um9vdFZpZXdDb250cm9sbGVyKCkgYXMgUm9vdENvbnRhaW5lckJhc2VDb250cm9sbGVyO1xuXHRcdFx0XHRjb25zdCBzUGFyYW1ldGVyUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgoc1BhdGgpO1xuXHRcdFx0XHRjb25zdCBiUmVzdWx0Q29udGV4dCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXJhbWV0ZXJQYXRofS9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlJlc3VsdENvbnRleHRgKTtcblx0XHRcdFx0aWYgKGJSZXN1bHRDb250ZXh0KSB7XG5cdFx0XHRcdFx0Ly8gV2UgZG9udCBuZWVkIHRvIGNyZWF0ZSBhIGJyZWFkY3J1bWIgZm9yIFBhcmFtZXRlciBwYXRoXG5cdFx0XHRcdFx0YVNraXBQYXJhbWV0ZXJpemVkLnB1c2goMSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFTa2lwUGFyYW1ldGVyaXplZC5wdXNoKDApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFQcm9taXNlcy5wdXNoKG9Sb290Vmlld0NvbnRyb2xsZXIuZ2V0VGl0bGVJbmZvRnJvbVBhdGgoc1BhdGgpKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgdGl0bGVIaWVyYXJjaHlJbmZvczogYW55W10gPSBhd2FpdCBQcm9taXNlLmFsbChhUHJvbWlzZXMpO1xuXHRcdFx0bGV0IGlkeCwgaGllcmFyY2h5UG9zaXRpb24sIG9MaW5rO1xuXHRcdFx0Zm9yIChjb25zdCB0aXRsZUhpZXJhcmNoeUluZm8gb2YgdGl0bGVIaWVyYXJjaHlJbmZvcykge1xuXHRcdFx0XHRoaWVyYXJjaHlQb3NpdGlvbiA9IHRpdGxlSGllcmFyY2h5SW5mb3MuaW5kZXhPZih0aXRsZUhpZXJhcmNoeUluZm8pO1xuXHRcdFx0XHRpZHggPSBoaWVyYXJjaHlQb3NpdGlvbiAtIGFTa2lwUGFyYW1ldGVyaXplZFtoaWVyYXJjaHlQb3NpdGlvbl07XG5cdFx0XHRcdG9MaW5rID0gb1NvdXJjZS5nZXRMaW5rcygpW2lkeF0gPyBvU291cmNlLmdldExpbmtzKClbaWR4XSA6IG5ldyBMaW5rKCk7XG5cdFx0XHRcdC8vc0N1cnJlbnRFbnRpdHkgaXMgYSBmYWxsYmFjayB2YWx1ZSBpbiBjYXNlIG9mIGVtcHR5IHRpdGxlXG5cdFx0XHRcdG9MaW5rLnNldFRleHQodGl0bGVIaWVyYXJjaHlJbmZvLnN1YnRpdGxlIHx8IHRpdGxlSGllcmFyY2h5SW5mby50aXRsZSk7XG5cdFx0XHRcdC8vV2UgYXBwbHkgYW4gYWRkaXRpb25hbCBlbmNvZGVVUkkgaW4gY2FzZSBvZiBzcGVjaWFsIGNoYXJhY3RlcnMgKGllIFwiL1wiKSB1c2VkIGluIHRoZSB1cmwgdGhyb3VnaCB0aGUgc2VtYW50aWMga2V5c1xuXHRcdFx0XHRvTGluay5zZXRIcmVmKGVuY29kZVVSSSh0aXRsZUhpZXJhcmNoeUluZm8uaW50ZW50KSk7XG5cdFx0XHRcdGlmICghb1NvdXJjZS5nZXRMaW5rcygpW2lkeF0pIHtcblx0XHRcdFx0XHRvU291cmNlLmFkZExpbmsob0xpbmspO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyb3I6IGFueSkge1xuXHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgc2V0dGluZyB0aGUgYnJlYWRjcnVtYiBsaW5rczpcIiArIGVycm9yKTtcblx0XHR9XG5cdH1cblxuXHRfY2hlY2tEYXRhUG9pbnRUaXRsZUZvckV4dGVybmFsTmF2aWdhdGlvbigpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpO1xuXHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IG9WaWV3LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0Y29uc3Qgb0RhdGFQb2ludHMgPSBDb21tb25VdGlscy5nZXRIZWFkZXJGYWNldEl0ZW1Db25maWdGb3JFeHRlcm5hbE5hdmlnYXRpb24oXG5cdFx0XHRvVmlldy5nZXRWaWV3RGF0YSgpLFxuXHRcdFx0dGhpcy5nZXRBcHBDb21wb25lbnQoKS5nZXRSb3V0aW5nU2VydmljZSgpLmdldE91dGJvdW5kcygpXG5cdFx0KTtcblx0XHRjb25zdCBvU2hlbGxTZXJ2aWNlcyA9IHRoaXMuZ2V0QXBwQ29tcG9uZW50KCkuZ2V0U2hlbGxTZXJ2aWNlcygpO1xuXHRcdGNvbnN0IG9QYWdlQ29udGV4dCA9IG9WaWV3ICYmIChvVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIENvbnRleHQpO1xuXHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImlzSGVhZGVyRFBMaW5rVmlzaWJsZVwiLCB7fSk7XG5cdFx0aWYgKG9QYWdlQ29udGV4dCkge1xuXHRcdFx0b1BhZ2VDb250ZXh0XG5cdFx0XHRcdC5yZXF1ZXN0T2JqZWN0KClcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKG9EYXRhOiBhbnkpIHtcblx0XHRcdFx0XHRmbkdldExpbmtzKG9EYXRhUG9pbnRzLCBvRGF0YSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgcmV0cmlldmUgdGhlIGxpbmtzIGZyb20gdGhlIHNoZWxsIHNlcnZpY2VcIiwgb0Vycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQHBhcmFtIG9FcnJvclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGZuT25FcnJvcihvRXJyb3I6IGFueSkge1xuXHRcdFx0TG9nLmVycm9yKG9FcnJvcik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZm5TZXRMaW5rRW5hYmxlbWVudChpZDogc3RyaW5nLCBhU3VwcG9ydGVkTGlua3M6IGFueSkge1xuXHRcdFx0Y29uc3Qgc0xpbmtJZCA9IGlkO1xuXHRcdFx0Ly8gcHJvY2VzcyB2aWFibGUgbGlua3MgZnJvbSBnZXRMaW5rcyBmb3IgYWxsIGRhdGFwb2ludHMgaGF2aW5nIG91dGJvdW5kXG5cdFx0XHRpZiAoYVN1cHBvcnRlZExpbmtzICYmIGFTdXBwb3J0ZWRMaW5rcy5sZW5ndGggPT09IDEgJiYgYVN1cHBvcnRlZExpbmtzWzBdLnN1cHBvcnRlZCkge1xuXHRcdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoYGlzSGVhZGVyRFBMaW5rVmlzaWJsZS8ke3NMaW5rSWR9YCwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQHBhcmFtIG9TdWJEYXRhUG9pbnRzXG5cdFx0ICogQHBhcmFtIG9QYWdlRGF0YVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGZuR2V0TGlua3Mob1N1YkRhdGFQb2ludHM6IGFueSwgb1BhZ2VEYXRhOiBhbnkpIHtcblx0XHRcdGZvciAoY29uc3Qgc0lkIGluIG9TdWJEYXRhUG9pbnRzKSB7XG5cdFx0XHRcdGNvbnN0IG9EYXRhUG9pbnQgPSBvU3ViRGF0YVBvaW50c1tzSWRdO1xuXHRcdFx0XHRjb25zdCBvUGFyYW1zOiBhbnkgPSB7fTtcblx0XHRcdFx0Y29uc3Qgb0xpbmsgPSBvVmlldy5ieUlkKHNJZCk7XG5cdFx0XHRcdGlmICghb0xpbmspIHtcblx0XHRcdFx0XHQvLyBmb3IgZGF0YSBwb2ludHMgY29uZmlndXJlZCBpbiBhcHAgZGVzY3JpcHRvciBidXQgbm90IGFubm90YXRlZCBpbiB0aGUgaGVhZGVyXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgb0xpbmtDb250ZXh0ID0gb0xpbmsuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0XHRcdFx0Y29uc3Qgb0xpbmtEYXRhOiBhbnkgPSBvTGlua0NvbnRleHQgJiYgb0xpbmtDb250ZXh0LmdldE9iamVjdCgpO1xuXHRcdFx0XHRsZXQgb01peGVkQ29udGV4dDogYW55ID0gbWVyZ2Uoe30sIG9QYWdlRGF0YSwgb0xpbmtEYXRhKTtcblx0XHRcdFx0Ly8gcHJvY2VzcyBzZW1hbnRpYyBvYmplY3QgbWFwcGluZ3Ncblx0XHRcdFx0aWYgKG9EYXRhUG9pbnQuc2VtYW50aWNPYmplY3RNYXBwaW5nKSB7XG5cdFx0XHRcdFx0Y29uc3QgYVNlbWFudGljT2JqZWN0TWFwcGluZyA9IG9EYXRhUG9pbnQuc2VtYW50aWNPYmplY3RNYXBwaW5nO1xuXHRcdFx0XHRcdGZvciAoY29uc3QgaXRlbSBpbiBhU2VtYW50aWNPYmplY3RNYXBwaW5nKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvTWFwcGluZyA9IGFTZW1hbnRpY09iamVjdE1hcHBpbmdbaXRlbV07XG5cdFx0XHRcdFx0XHRjb25zdCBzTWFpblByb3BlcnR5ID0gb01hcHBpbmdbXCJMb2NhbFByb3BlcnR5XCJdW1wiJFByb3BlcnR5UGF0aFwiXTtcblx0XHRcdFx0XHRcdGNvbnN0IHNNYXBwZWRQcm9wZXJ0eSA9IG9NYXBwaW5nW1wiU2VtYW50aWNPYmplY3RQcm9wZXJ0eVwiXTtcblx0XHRcdFx0XHRcdGlmIChzTWFpblByb3BlcnR5ICE9PSBzTWFwcGVkUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKG9NaXhlZENvbnRleHQuaGFzT3duUHJvcGVydHkoc01haW5Qcm9wZXJ0eSkpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBvTmV3TWFwcGluZzogYW55ID0ge307XG5cdFx0XHRcdFx0XHRcdFx0b05ld01hcHBpbmdbc01hcHBlZFByb3BlcnR5XSA9IG9NaXhlZENvbnRleHRbc01haW5Qcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRcdFx0b01peGVkQ29udGV4dCA9IG1lcmdlKHt9LCBvTWl4ZWRDb250ZXh0LCBvTmV3TWFwcGluZyk7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIG9NaXhlZENvbnRleHRbc01haW5Qcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob01peGVkQ29udGV4dCkge1xuXHRcdFx0XHRcdGZvciAoY29uc3Qgc0tleSBpbiBvTWl4ZWRDb250ZXh0KSB7XG5cdFx0XHRcdFx0XHRpZiAoc0tleS5pbmRleE9mKFwiX1wiKSAhPT0gMCAmJiBzS2V5LmluZGV4T2YoXCJvZGF0YS5jb250ZXh0XCIpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRvUGFyYW1zW3NLZXldID0gb01peGVkQ29udGV4dFtzS2V5XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gdmFsaWRhdGUgaWYgYSBsaW5rIG11c3QgYmUgcmVuZGVyZWRcblx0XHRcdFx0b1NoZWxsU2VydmljZXNcblx0XHRcdFx0XHQuaXNOYXZpZ2F0aW9uU3VwcG9ydGVkKFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0OiB7XG5cdFx0XHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IG9EYXRhUG9pbnQuc2VtYW50aWNPYmplY3QsXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiBvRGF0YVBvaW50LmFjdGlvblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IG9QYXJhbXNcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdC50aGVuKChhTGlua3MpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBmblNldExpbmtFbmFibGVtZW50KHNJZCwgYUxpbmtzKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChmbk9uRXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGhhbmRsZXJzID0ge1xuXHRcdC8qKlxuXHRcdCAqIEludm9rZXMgdGhlIHBhZ2UgcHJpbWFyeSBhY3Rpb24gb24gcHJlc3Mgb2YgQ3RybCtFbnRlci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBvQ29udHJvbGxlciBUaGUgcGFnZSBjb250cm9sbGVyXG5cdFx0ICogQHBhcmFtIG9WaWV3XG5cdFx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgZm9yIHdoaWNoIHRoZSBhY3Rpb24gaXMgY2FsbGVkXG5cdFx0ICogQHBhcmFtIHNBY3Rpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gdG8gYmUgY2FsbGVkXG5cdFx0ICogQHBhcmFtIFttUGFyYW1ldGVyc10gQ29udGFpbnMgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHRcdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMuY29udGV4dHNdIE1hbmRhdG9yeSBmb3IgYSBib3VuZCBhY3Rpb24sIGVpdGhlciBvbmUgY29udGV4dCBvciBhbiBhcnJheSB3aXRoIGNvbnRleHRzIGZvciB3aGljaCB0aGUgYWN0aW9uIGlzIGNhbGxlZFxuXHRcdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnMubW9kZWxdIE1hbmRhdG9yeSBmb3IgYW4gdW5ib3VuZCBhY3Rpb247IGFuIGluc3RhbmNlIG9mIGFuIE9EYXRhIFY0IG1vZGVsXG5cdFx0ICogQHBhcmFtIFttQ29uZGl0aW9uc10gQ29udGFpbnMgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuXHRcdCAqIEBwYXJhbSBbbUNvbmRpdGlvbnMucG9zaXRpdmVBY3Rpb25WaXNpYmxlXSBUaGUgdmlzaWJpbGl0eSBvZiBzZW1hdGljIHBvc2l0aXZlIGFjdGlvblxuXHRcdCAqIEBwYXJhbSBbbUNvbmRpdGlvbnMucG9zaXRpdmVBY3Rpb25FbmFibGVkXSBUaGUgZW5hYmxlbWVudCBvZiBzZW1hbnRpYyBwb3NpdGl2ZSBhY3Rpb25cblx0XHQgKiBAcGFyYW0gW21Db25kaXRpb25zLmVkaXRBY3Rpb25WaXNpYmxlXSBUaGUgRWRpdCBidXR0b24gdmlzaWJpbGl0eVxuXHRcdCAqIEBwYXJhbSBbbUNvbmRpdGlvbnMuZWRpdEFjdGlvbkVuYWJsZWRdIFRoZSBlbmFibGVtZW50IG9mIEVkaXQgYnV0dG9uXG5cdFx0ICogQHVpNS1yZXN0cmljdGVkXG5cdFx0ICogQGZpbmFsXG5cdFx0ICovXG5cdFx0b25QcmltYXJ5QWN0aW9uKFxuXHRcdFx0b0NvbnRyb2xsZXI6IE9iamVjdFBhZ2VDb250cm9sbGVyLFxuXHRcdFx0b1ZpZXc6IFZpZXcsXG5cdFx0XHRvQ29udGV4dDogQ29udGV4dCxcblx0XHRcdHNBY3Rpb25OYW1lOiBzdHJpbmcsXG5cdFx0XHRtUGFyYW1ldGVyczogdW5rbm93bixcblx0XHRcdG1Db25kaXRpb25zOiB7XG5cdFx0XHRcdHBvc2l0aXZlQWN0aW9uVmlzaWJsZTogYm9vbGVhbjtcblx0XHRcdFx0cG9zaXRpdmVBY3Rpb25FbmFibGVkOiBib29sZWFuO1xuXHRcdFx0XHRlZGl0QWN0aW9uVmlzaWJsZTogYm9vbGVhbjtcblx0XHRcdFx0ZWRpdEFjdGlvbkVuYWJsZWQ6IGJvb2xlYW47XG5cdFx0XHR9XG5cdFx0KSB7XG5cdFx0XHRjb25zdCBpVmlld0xldmVsID0gKG9Db250cm9sbGVyLmdldFZpZXcoKS5nZXRWaWV3RGF0YSgpIGFzIGFueSkudmlld0xldmVsLFxuXHRcdFx0XHRvT2JqZWN0UGFnZSA9IG9Db250cm9sbGVyLl9nZXRPYmplY3RQYWdlTGF5b3V0Q29udHJvbCgpO1xuXHRcdFx0aWYgKG1Db25kaXRpb25zLnBvc2l0aXZlQWN0aW9uVmlzaWJsZSkge1xuXHRcdFx0XHRpZiAobUNvbmRpdGlvbnMucG9zaXRpdmVBY3Rpb25FbmFibGVkKSB7XG5cdFx0XHRcdFx0b0NvbnRyb2xsZXIuaGFuZGxlcnMub25DYWxsQWN0aW9uKG9WaWV3LCBzQWN0aW9uTmFtZSwgbVBhcmFtZXRlcnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKG1Db25kaXRpb25zLmVkaXRBY3Rpb25WaXNpYmxlICYmIGlWaWV3TGV2ZWwgPT09IDEpIHtcblx0XHRcdFx0aWYgKG1Db25kaXRpb25zLmVkaXRBY3Rpb25FbmFibGVkKSB7XG5cdFx0XHRcdFx0b0NvbnRyb2xsZXIuX2VkaXREb2N1bWVudChvQ29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoaVZpZXdMZXZlbCA9PT0gMSAmJiBvT2JqZWN0UGFnZS5nZXRNb2RlbChcInVpXCIpLmdldFByb3BlcnR5KFwiL2lzRWRpdGFibGVcIikpIHtcblx0XHRcdFx0b0NvbnRyb2xsZXIuX3NhdmVEb2N1bWVudChvQ29udGV4dCk7XG5cdFx0XHR9IGVsc2UgaWYgKG9PYmplY3RQYWdlLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKSkge1xuXHRcdFx0XHRvQ29udHJvbGxlci5fYXBwbHlEb2N1bWVudChvQ29udGV4dCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdG9uVGFibGVDb250ZXh0Q2hhbmdlKHRoaXM6IE9iamVjdFBhZ2VDb250cm9sbGVyLCBvRXZlbnQ6IGFueSkge1xuXHRcdFx0Y29uc3Qgb1NvdXJjZSA9IG9FdmVudC5nZXRTb3VyY2UoKTtcblx0XHRcdGxldCBvVGFibGU6IGFueTtcblx0XHRcdHRoaXMuX2ZpbmRUYWJsZXMoKS5zb21lKGZ1bmN0aW9uIChfb1RhYmxlOiBhbnkpIHtcblx0XHRcdFx0aWYgKF9vVGFibGUuZ2V0Um93QmluZGluZygpID09PSBvU291cmNlKSB7XG5cdFx0XHRcdFx0b1RhYmxlID0gX29UYWJsZTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3Qgb0N1cnJlbnRBY3Rpb25Qcm9taXNlID0gdGhpcy5fZWRpdEZsb3cuZ2V0Q3VycmVudEFjdGlvblByb21pc2UoKTtcblx0XHRcdGlmIChvQ3VycmVudEFjdGlvblByb21pc2UpIHtcblx0XHRcdFx0bGV0IGFUYWJsZUNvbnRleHRzOiBhbnk7XG5cdFx0XHRcdGlmIChvVGFibGUuZ2V0VHlwZSgpLmdldE1ldGFkYXRhKCkuaXNBKFwic2FwLnVpLm1kYy50YWJsZS5HcmlkVGFibGVUeXBlXCIpKSB7XG5cdFx0XHRcdFx0YVRhYmxlQ29udGV4dHMgPSBvU291cmNlLmdldENvbnRleHRzKDApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFUYWJsZUNvbnRleHRzID0gb1NvdXJjZS5nZXRDdXJyZW50Q29udGV4dHMoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2lmIGNvbnRleHRzIGFyZSBub3QgZnVsbHkgbG9hZGVkIHRoZSBnZXRjb250ZXh0cyBmdW5jdGlvbiBhYm92ZSB3aWxsIHRyaWdnZXIgYSBuZXcgY2hhbmdlIGV2ZW50IGNhbGxcblx0XHRcdFx0aWYgKCFhVGFibGVDb250ZXh0c1swXSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRvQ3VycmVudEFjdGlvblByb21pc2Vcblx0XHRcdFx0XHQudGhlbigob0FjdGlvblJlc3BvbnNlOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdGlmICghb0FjdGlvblJlc3BvbnNlIHx8IG9BY3Rpb25SZXNwb25zZS5jb250cm9sSWQgIT09IG9UYWJsZS5zSWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3Qgb0FjdGlvbkRhdGEgPSBvQWN0aW9uUmVzcG9uc2Uub0RhdGE7XG5cdFx0XHRcdFx0XHRjb25zdCBhS2V5cyA9IG9BY3Rpb25SZXNwb25zZS5rZXlzO1xuXHRcdFx0XHRcdFx0bGV0IGlOZXdJdGVtcCA9IC0xO1xuXHRcdFx0XHRcdFx0YVRhYmxlQ29udGV4dHMuZmluZChmdW5jdGlvbiAob1RhYmxlQ29udGV4dDogYW55LCBpOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb1RhYmxlRGF0YSA9IG9UYWJsZUNvbnRleHQuZ2V0T2JqZWN0KCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGJDb21wYXJlID0gYUtleXMuZXZlcnkoZnVuY3Rpb24gKHNLZXk6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBvVGFibGVEYXRhW3NLZXldID09PSBvQWN0aW9uRGF0YVtzS2V5XTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlmIChiQ29tcGFyZSkge1xuXHRcdFx0XHRcdFx0XHRcdGlOZXdJdGVtcCA9IGk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGJDb21wYXJlO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAoaU5ld0l0ZW1wICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBhRGlhbG9ncyA9IEluc3RhbmNlTWFuYWdlci5nZXRPcGVuRGlhbG9ncygpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvRGlhbG9nID1cblx0XHRcdFx0XHRcdFx0XHRhRGlhbG9ncy5sZW5ndGggPiAwID8gYURpYWxvZ3MuZmluZCgoZGlhbG9nKSA9PiBkaWFsb2cuZGF0YShcIkZ1bGxTY3JlZW5EaWFsb2dcIikgIT09IHRydWUpIDogbnVsbDtcblx0XHRcdFx0XHRcdFx0aWYgKG9EaWFsb2cpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBieSBkZXNpZ24sIGEgc2FwLm0uZGlhbG9nIHNldCB0aGUgZm9jdXMgdG8gdGhlIHByZXZpb3VzIGZvY3VzZWQgZWxlbWVudCB3aGVuIGNsb3NpbmcuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gd2Ugc2hvdWxkIHdhaXQgZm9yIHRoZSBkaWFsb2cgdG8gYmUgY2xvc2UgYmVmb3JlIHRvIGZvY3VzIGFub3RoZXIgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdG9EaWFsb2cuYXR0YWNoRXZlbnRPbmNlKFwiYWZ0ZXJDbG9zZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvVGFibGUuZm9jdXNSb3coaU5ld0l0ZW1wLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRvVGFibGUuZm9jdXNSb3coaU5ld0l0ZW1wLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9lZGl0Rmxvdy5kZWxldGVDdXJyZW50QWN0aW9uUHJvbWlzZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnI6IGFueSkge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKGBBbiBlcnJvciBvY2N1cnMgd2hpbGUgc2Nyb2xsaW5nIHRvIHRoZSBuZXdseSBjcmVhdGVkIEl0ZW06ICR7ZXJyfWApO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZmlyZSBNb2RlbENvbnRleHRDaGFuZ2Ugb24gdGhlIG1lc3NhZ2UgYnV0dG9uIHdoZW5ldmVyIHRoZSB0YWJsZSBjb250ZXh0IGNoYW5nZXNcblx0XHRcdHRoaXMubWVzc2FnZUJ1dHRvbi5maXJlTW9kZWxDb250ZXh0Q2hhbmdlKCk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEludm9rZXMgYW4gYWN0aW9uIC0gYm91bmQvdW5ib3VuZCBhbmQgc2V0cyB0aGUgcGFnZSBkaXJ0eS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBvVmlld1xuXHRcdCAqIEBwYXJhbSBzQWN0aW9uTmFtZSBUaGUgbmFtZSBvZiB0aGUgYWN0aW9uIHRvIGJlIGNhbGxlZFxuXHRcdCAqIEBwYXJhbSBbbVBhcmFtZXRlcnNdIENvbnRhaW5zIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcblx0XHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLmNvbnRleHRzXSBNYW5kYXRvcnkgZm9yIGEgYm91bmQgYWN0aW9uLCBlaXRoZXIgb25lIGNvbnRleHQgb3IgYW4gYXJyYXkgd2l0aCBjb250ZXh0cyBmb3Igd2hpY2ggdGhlIGFjdGlvbiBpcyBjYWxsZWRcblx0XHQgKiBAcGFyYW0gW21QYXJhbWV0ZXJzLm1vZGVsXSBNYW5kYXRvcnkgZm9yIGFuIHVuYm91bmQgYWN0aW9uOyBhbiBpbnN0YW5jZSBvZiBhbiBPRGF0YSBWNCBtb2RlbFxuXHRcdCAqIEByZXR1cm5zIFRoZSBhY3Rpb24gcHJvbWlzZVxuXHRcdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHRcdCAqIEBmaW5hbFxuXHRcdCAqL1xuXHRcdG9uQ2FsbEFjdGlvbihvVmlldzogYW55LCBzQWN0aW9uTmFtZTogc3RyaW5nLCBtUGFyYW1ldGVyczogYW55KSB7XG5cdFx0XHRjb25zdCBvQ29udHJvbGxlciA9IG9WaWV3LmdldENvbnRyb2xsZXIoKTtcblx0XHRcdHJldHVybiBvQ29udHJvbGxlci5lZGl0Rmxvd1xuXHRcdFx0XHQuaW52b2tlQWN0aW9uKHNBY3Rpb25OYW1lLCBtUGFyYW1ldGVycylcblx0XHRcdFx0LnRoZW4ob0NvbnRyb2xsZXIuX3Nob3dNZXNzYWdlUG9wb3Zlci5iaW5kKG9Db250cm9sbGVyLCB1bmRlZmluZWQpKVxuXHRcdFx0XHQuY2F0Y2gob0NvbnRyb2xsZXIuX3Nob3dNZXNzYWdlUG9wb3Zlci5iaW5kKG9Db250cm9sbGVyKSk7XG5cdFx0fSxcblx0XHRvbkRhdGFQb2ludFRpdGxlUHJlc3NlZChvQ29udHJvbGxlcjogYW55LCBvU291cmNlOiBhbnksIG9NYW5pZmVzdE91dGJvdW5kOiBhbnksIHNDb250cm9sQ29uZmlnOiBhbnksIHNDb2xsZWN0aW9uUGF0aDogYW55KSB7XG5cdFx0XHRvTWFuaWZlc3RPdXRib3VuZCA9IHR5cGVvZiBvTWFuaWZlc3RPdXRib3VuZCA9PT0gXCJzdHJpbmdcIiA/IEpTT04ucGFyc2Uob01hbmlmZXN0T3V0Ym91bmQpIDogb01hbmlmZXN0T3V0Ym91bmQ7XG5cdFx0XHRjb25zdCBvVGFyZ2V0SW5mbyA9IG9NYW5pZmVzdE91dGJvdW5kW3NDb250cm9sQ29uZmlnXSxcblx0XHRcdFx0YVNlbWFudGljT2JqZWN0TWFwcGluZyA9IENvbW1vblV0aWxzLmdldFNlbWFudGljT2JqZWN0TWFwcGluZyhvVGFyZ2V0SW5mbyksXG5cdFx0XHRcdG9EYXRhUG9pbnRPckNoYXJ0QmluZGluZ0NvbnRleHQgPSBvU291cmNlLmdldEJpbmRpbmdDb250ZXh0KCksXG5cdFx0XHRcdHNNZXRhUGF0aCA9IG9EYXRhUG9pbnRPckNoYXJ0QmluZGluZ0NvbnRleHRcblx0XHRcdFx0XHQuZ2V0TW9kZWwoKVxuXHRcdFx0XHRcdC5nZXRNZXRhTW9kZWwoKVxuXHRcdFx0XHRcdC5nZXRNZXRhUGF0aChvRGF0YVBvaW50T3JDaGFydEJpbmRpbmdDb250ZXh0LmdldFBhdGgoKSk7XG5cdFx0XHRsZXQgYU5hdmlnYXRpb25EYXRhID0gb0NvbnRyb2xsZXIuX2dldENoYXJ0Q29udGV4dERhdGEob0RhdGFQb2ludE9yQ2hhcnRCaW5kaW5nQ29udGV4dCwgc0NvbGxlY3Rpb25QYXRoKTtcblx0XHRcdGxldCBhZGRpdGlvbmFsTmF2aWdhdGlvblBhcmFtZXRlcnM7XG5cblx0XHRcdGFOYXZpZ2F0aW9uRGF0YSA9IGFOYXZpZ2F0aW9uRGF0YS5tYXAoZnVuY3Rpb24gKG9OYXZpZ2F0aW9uRGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0ZGF0YTogb05hdmlnYXRpb25EYXRhLFxuXHRcdFx0XHRcdG1ldGFQYXRoOiBzTWV0YVBhdGggKyAoc0NvbGxlY3Rpb25QYXRoID8gYC8ke3NDb2xsZWN0aW9uUGF0aH1gIDogXCJcIilcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKG9UYXJnZXRJbmZvICYmIG9UYXJnZXRJbmZvLnBhcmFtZXRlcnMpIHtcblx0XHRcdFx0Y29uc3Qgb1BhcmFtcyA9IG9UYXJnZXRJbmZvLnBhcmFtZXRlcnMgJiYgb0NvbnRyb2xsZXIuX2ludGVudEJhc2VkTmF2aWdhdGlvbi5nZXRPdXRib3VuZFBhcmFtcyhvVGFyZ2V0SW5mby5wYXJhbWV0ZXJzKTtcblx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKG9QYXJhbXMpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRhZGRpdGlvbmFsTmF2aWdhdGlvblBhcmFtZXRlcnMgPSBvUGFyYW1zO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAob1RhcmdldEluZm8gJiYgb1RhcmdldEluZm8uc2VtYW50aWNPYmplY3QgJiYgb1RhcmdldEluZm8uYWN0aW9uKSB7XG5cdFx0XHRcdG9Db250cm9sbGVyLl9pbnRlbnRCYXNlZE5hdmlnYXRpb24ubmF2aWdhdGUob1RhcmdldEluZm8uc2VtYW50aWNPYmplY3QsIG9UYXJnZXRJbmZvLmFjdGlvbiwge1xuXHRcdFx0XHRcdG5hdmlnYXRpb25Db250ZXh0czogYU5hdmlnYXRpb25EYXRhLFxuXHRcdFx0XHRcdHNlbWFudGljT2JqZWN0TWFwcGluZzogYVNlbWFudGljT2JqZWN0TWFwcGluZyxcblx0XHRcdFx0XHRhZGRpdGlvbmFsTmF2aWdhdGlvblBhcmFtZXRlcnM6IGFkZGl0aW9uYWxOYXZpZ2F0aW9uUGFyYW1ldGVyc1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJzIGFuIG91dGJvdW5kIG5hdmlnYXRpb24gd2hlbiBhIHVzZXIgY2hvb3NlcyB0aGUgY2hldnJvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBvQ29udHJvbGxlclxuXHRcdCAqIEBwYXJhbSBzT3V0Ym91bmRUYXJnZXQgTmFtZSBvZiB0aGUgb3V0Ym91bmQgdGFyZ2V0IChuZWVkcyB0byBiZSBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdClcblx0XHQgKiBAcGFyYW0gb0NvbnRleHQgVGhlIGNvbnRleHQgdGhhdCBjb250YWlucyB0aGUgZGF0YSBmb3IgdGhlIHRhcmdldCBhcHBcblx0XHQgKiBAcGFyYW0gc0NyZWF0ZVBhdGggQ3JlYXRlIHBhdGggd2hlbiB0aGUgY2hldnJvbiBpcyBjcmVhdGVkLlxuXHRcdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgb25jZSB0aGUgbmF2aWdhdGlvbiBpcyB0cmlnZ2VyZWQgKD8/PyBtYXliZSBvbmx5IG9uY2UgZmluaXNoZWQ/KVxuXHRcdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHRcdCAqIEBmaW5hbFxuXHRcdCAqL1xuXHRcdG9uQ2hldnJvblByZXNzTmF2aWdhdGVPdXRCb3VuZChvQ29udHJvbGxlcjogT2JqZWN0UGFnZUNvbnRyb2xsZXIsIHNPdXRib3VuZFRhcmdldDogc3RyaW5nLCBvQ29udGV4dDogYW55LCBzQ3JlYXRlUGF0aDogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gb0NvbnRyb2xsZXIuX2ludGVudEJhc2VkTmF2aWdhdGlvbi5vbkNoZXZyb25QcmVzc05hdmlnYXRlT3V0Qm91bmQob0NvbnRyb2xsZXIsIHNPdXRib3VuZFRhcmdldCwgb0NvbnRleHQsIHNDcmVhdGVQYXRoKTtcblx0XHR9LFxuXG5cdFx0b25OYXZpZ2F0ZUNoYW5nZSh0aGlzOiBPYmplY3RQYWdlQ29udHJvbGxlciwgb0V2ZW50OiBhbnkpIHtcblx0XHRcdC8vd2lsbCBiZSBjYWxsZWQgYWx3YXlzIHdoZW4gd2UgY2xpY2sgb24gYSBzZWN0aW9uIHRhYlxuXHRcdFx0dGhpcy5nZXRFeHRlbnNpb25BUEkoKS51cGRhdGVBcHBTdGF0ZSgpO1xuXHRcdFx0dGhpcy5iU2VjdGlvbk5hdmlnYXRlZCA9IHRydWU7XG5cblx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRjb25zdCBvT2JqZWN0UGFnZSA9IHRoaXMuX2dldE9iamVjdFBhZ2VMYXlvdXRDb250cm9sKCk7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG9PYmplY3RQYWdlLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKSAmJlxuXHRcdFx0XHQodGhpcy5nZXRWaWV3KCkuZ2V0Vmlld0RhdGEoKSBhcyBhbnkpLnNlY3Rpb25MYXlvdXQgPT09IFwiVGFic1wiICYmXG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcImVycm9yTmF2aWdhdGlvblNlY3Rpb25GbGFnXCIpID09PSBmYWxzZVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IG9TdWJTZWN0aW9uID0gb0V2ZW50LmdldFBhcmFtZXRlcihcInN1YlNlY3Rpb25cIik7XG5cdFx0XHRcdHRoaXMuX3VwZGF0ZUZvY3VzSW5FZGl0TW9kZShbb1N1YlNlY3Rpb25dKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9uVmFyaWFudFNlbGVjdGVkOiBmdW5jdGlvbiAodGhpczogT2JqZWN0UGFnZUNvbnRyb2xsZXIpIHtcblx0XHRcdHRoaXMuZ2V0RXh0ZW5zaW9uQVBJKCkudXBkYXRlQXBwU3RhdGUoKTtcblx0XHR9LFxuXHRcdG9uVmFyaWFudFNhdmVkOiBmdW5jdGlvbiAodGhpczogT2JqZWN0UGFnZUNvbnRyb2xsZXIpIHtcblx0XHRcdC8vVE9ETzogU2hvdWxkIHJlbW92ZSB0aGlzIHNldFRpbWVPdXQgb25jZSBWYXJpYW50IE1hbmFnZW1lbnQgcHJvdmlkZXMgYW4gYXBpIHRvIGZldGNoIHRoZSBjdXJyZW50IHZhcmlhbnQga2V5IG9uIHNhdmVcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmdldEV4dGVuc2lvbkFQSSgpLnVwZGF0ZUFwcFN0YXRlKCk7XG5cdFx0XHR9LCA1MDApO1xuXHRcdH0sXG5cdFx0bmF2aWdhdGVUb1N1YlNlY3Rpb246IGZ1bmN0aW9uIChvQ29udHJvbGxlcjogT2JqZWN0UGFnZUNvbnRyb2xsZXIsIHZEZXRhaWxDb25maWc6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0RldGFpbENvbmZpZyA9IHR5cGVvZiB2RGV0YWlsQ29uZmlnID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZSh2RGV0YWlsQ29uZmlnKSA6IHZEZXRhaWxDb25maWc7XG5cdFx0XHRjb25zdCBvT2JqZWN0UGFnZSA9IG9Db250cm9sbGVyLmdldFZpZXcoKS5ieUlkKFwiZmU6Ok9iamVjdFBhZ2VcIikgYXMgT2JqZWN0UGFnZUxheW91dDtcblx0XHRcdGxldCBvU2VjdGlvbjtcblx0XHRcdGxldCBvU3ViU2VjdGlvbjtcblx0XHRcdGlmIChvRGV0YWlsQ29uZmlnLnNlY3Rpb25JZCkge1xuXHRcdFx0XHRvU2VjdGlvbiA9IG9Db250cm9sbGVyLmdldFZpZXcoKS5ieUlkKG9EZXRhaWxDb25maWcuc2VjdGlvbklkKSBhcyBPYmplY3RQYWdlU2VjdGlvbjtcblx0XHRcdFx0b1N1YlNlY3Rpb24gPSAoXG5cdFx0XHRcdFx0b0RldGFpbENvbmZpZy5zdWJTZWN0aW9uSWRcblx0XHRcdFx0XHRcdD8gb0NvbnRyb2xsZXIuZ2V0VmlldygpLmJ5SWQob0RldGFpbENvbmZpZy5zdWJTZWN0aW9uSWQpXG5cdFx0XHRcdFx0XHQ6IG9TZWN0aW9uICYmIG9TZWN0aW9uLmdldFN1YlNlY3Rpb25zKCkgJiYgb1NlY3Rpb24uZ2V0U3ViU2VjdGlvbnMoKVswXVxuXHRcdFx0XHQpIGFzIE9iamVjdFBhZ2VTdWJTZWN0aW9uO1xuXHRcdFx0fSBlbHNlIGlmIChvRGV0YWlsQ29uZmlnLnN1YlNlY3Rpb25JZCkge1xuXHRcdFx0XHRvU3ViU2VjdGlvbiA9IG9Db250cm9sbGVyLmdldFZpZXcoKS5ieUlkKG9EZXRhaWxDb25maWcuc3ViU2VjdGlvbklkKSBhcyBPYmplY3RQYWdlU3ViU2VjdGlvbjtcblx0XHRcdFx0b1NlY3Rpb24gPSBvU3ViU2VjdGlvbiAmJiAob1N1YlNlY3Rpb24uZ2V0UGFyZW50KCkgYXMgT2JqZWN0UGFnZVNlY3Rpb24pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFvU2VjdGlvbiB8fCAhb1N1YlNlY3Rpb24gfHwgIW9TZWN0aW9uLmdldFZpc2libGUoKSB8fCAhb1N1YlNlY3Rpb24uZ2V0VmlzaWJsZSgpKSB7XG5cdFx0XHRcdCgob0NvbnRyb2xsZXIuZ2V0VmlldygpLmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikgYXMgUmVzb3VyY2VNb2RlbCkuZ2V0UmVzb3VyY2VCdW5kbGUoKSBhcyBQcm9taXNlPFJlc291cmNlQnVuZGxlPilcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAob1Jlc291cmNlQnVuZGxlKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBzVGl0bGUgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcblx0XHRcdFx0XHRcdFx0XCJDX1JPVVRJTkdfTkFWSUdBVElPTl9ESVNBQkxFRF9USVRMRVwiLFxuXHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHRcdChvQ29udHJvbGxlci5nZXRWaWV3KCkuZ2V0Vmlld0RhdGEoKSBhcyBhbnkpLmVudGl0eVNldFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihzVGl0bGUpO1xuXHRcdFx0XHRcdFx0TWVzc2FnZUJveC5lcnJvcihzVGl0bGUpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKGVycm9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9PYmplY3RQYWdlLnNjcm9sbFRvU2VjdGlvbihvU3ViU2VjdGlvbi5nZXRJZCgpKTtcblx0XHRcdFx0Ly8gdHJpZ2dlciBpYXBwIHN0YXRlIGNoYW5nZVxuXHRcdFx0XHRvT2JqZWN0UGFnZS5maXJlTmF2aWdhdGUoe1xuXHRcdFx0XHRcdHNlY3Rpb246IG9TZWN0aW9uLFxuXHRcdFx0XHRcdHN1YlNlY3Rpb246IG9TdWJTZWN0aW9uXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25DaGFydFNlbGVjdGlvbkNoYW5nZWQ6IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdFx0Q2hhcnRSdW50aW1lLmZuVXBkYXRlQ2hhcnQob0V2ZW50KTtcblx0XHR9LFxuXHRcdG9uU3RhdGVDaGFuZ2UodGhpczogT2JqZWN0UGFnZUNvbnRyb2xsZXIpIHtcblx0XHRcdHRoaXMuZ2V0RXh0ZW5zaW9uQVBJKCkudXBkYXRlQXBwU3RhdGUoKTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9iamVjdFBhZ2VDb250cm9sbGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFN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