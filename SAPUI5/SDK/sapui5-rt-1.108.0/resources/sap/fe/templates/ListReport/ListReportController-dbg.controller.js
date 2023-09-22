/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/ObjectPath", "sap/fe/core/ActionRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/EditFlow", "sap/fe/core/controllerextensions/IntentBasedNavigation", "sap/fe/core/controllerextensions/InternalIntentBasedNavigation", "sap/fe/core/controllerextensions/InternalRouting", "sap/fe/core/controllerextensions/KPIManagement", "sap/fe/core/controllerextensions/MassEdit", "sap/fe/core/controllerextensions/Placeholder", "sap/fe/core/controllerextensions/Share", "sap/fe/core/controllerextensions/SideEffects", "sap/fe/core/controllerextensions/ViewState", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/EditState", "sap/fe/core/helpers/MessageStrip", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/library", "sap/fe/core/PageController", "sap/fe/macros/chart/ChartRuntime", "sap/fe/macros/chart/ChartUtils", "sap/fe/macros/CommonHelper", "sap/fe/macros/DelegateUtil", "sap/fe/macros/filter/FilterUtils", "sap/fe/macros/table/TableHelper", "sap/fe/templates/ListReport/ExtensionAPI", "sap/fe/templates/RootContainer/overrides/EditFlow", "sap/fe/templates/TableScroller", "sap/ui/core/Component", "sap/ui/core/mvc/OverrideExecution", "sap/ui/Device", "sap/ui/mdc/p13n/StateUtil", "sap/ui/thirdparty/hasher", "./ListReportTemplating", "./overrides/IntentBasedNavigation", "./overrides/Share", "./overrides/ViewState"], function (Log, ObjectPath, ActionRuntime, CommonUtils, EditFlow, IntentBasedNavigation, InternalIntentBasedNavigation, InternalRouting, KPIManagement, MassEdit, Placeholder, Share, SideEffects, ViewState, ClassSupport, EditState, MessageStrip, StableIdHelper, CoreLibrary, PageController, ChartRuntime, ChartUtils, CommonHelper, DelegateUtil, FilterUtils, TableHelper, ExtensionAPI, EditFlowOverrides, TableScroller, Component, OverrideExecution, Device, StateUtil, hasher, ListReportTemplating, IntentBasedNavigationOverride, ShareOverrides, ViewStateOverrides) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;

  var system = Device.system;
  var usingExtension = ClassSupport.usingExtension;
  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var TemplateContentView = CoreLibrary.TemplateContentView,
      InitialLoadMode = CoreLibrary.InitialLoadMode;
  var ListReportController = (_dec = defineUI5Class("sap.fe.templates.ListReport.ListReportController"), _dec2 = usingExtension(InternalRouting.override({
    onAfterBinding: function () {
      this.getView().getController()._onAfterBinding();
    }
  })), _dec3 = usingExtension(InternalIntentBasedNavigation.override({
    getEntitySet: function () {
      return this.base.getCurrentEntitySet();
    }
  })), _dec4 = usingExtension(SideEffects), _dec5 = usingExtension(IntentBasedNavigation.override(IntentBasedNavigationOverride)), _dec6 = usingExtension(Share.override(ShareOverrides)), _dec7 = usingExtension(EditFlow.override(EditFlowOverrides)), _dec8 = usingExtension(ViewState.override(ViewStateOverrides)), _dec9 = usingExtension(KPIManagement), _dec10 = usingExtension(Placeholder), _dec11 = usingExtension(MassEdit), _dec12 = publicExtension(), _dec13 = finalExtension(), _dec14 = privateExtension(), _dec15 = extensible(OverrideExecution.After), _dec16 = publicExtension(), _dec17 = extensible(OverrideExecution.After), _dec18 = publicExtension(), _dec19 = extensible(OverrideExecution.After), _dec(_class = (_class2 = /*#__PURE__*/function (_PageController) {
    _inheritsLoose(ListReportController, _PageController);

    function ListReportController() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _PageController.call.apply(_PageController, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "_routing", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_intentBasedNavigation", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "sideEffects", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "intentBasedNavigation", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "share", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "editFlow", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "viewState", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "kpiManagement", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "placeholder", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "massEdit", _descriptor10, _assertThisInitialized(_this));

      _this.handlers = {
        handleShareShortcut: function () {
          var shareAPI = this.getView().byId("fe::Share");
          shareAPI.openMenu();
        },
        onFilterSearch: function () {
          this._getFilterBarControl().triggerSearch();
        },
        onFiltersChanged: function (oEvent) {
          var oFilterBar = this._getFilterBarControl();

          if (oFilterBar) {
            var oInternalModelContext = this.getView().getBindingContext("internal"); // Pending filters into FilterBar to be used for custom views

            this.onPendingFilters();
            oInternalModelContext.setProperty("appliedFilters", oFilterBar.getAssignedFiltersText().filtersText);

            if (oEvent.getParameter("conditionsBased")) {
              oInternalModelContext.setProperty("hasPendingFilters", true);
            }
          }
        },
        onVariantSelected: function (oEvent) {
          var _this2 = this;

          var oVM = oEvent.getSource();
          var currentVariantKey = oEvent.getParameter("key");

          var oMultiModeControl = this._getMultiModeControl();

          oMultiModeControl === null || oMultiModeControl === void 0 ? void 0 : oMultiModeControl.invalidateContent();
          oMultiModeControl === null || oMultiModeControl === void 0 ? void 0 : oMultiModeControl.setFreezeContent(true); // setTimeout cause the variant needs to be applied before judging the auto search or updating the app state

          setTimeout(function () {
            if (_this2._shouldAutoTriggerSearch(oVM)) {
              // the app state will be updated via onSearch handler
              return _this2._getFilterBarControl().triggerSearch();
            } else if (!_this2._getApplyAutomaticallyOnVariant(oVM, currentVariantKey)) {
              _this2.getExtensionAPI().updateAppState();
            }
          }, 0);
        },
        onVariantSaved: function () {
          var _this3 = this;

          //TODO: Should remove this setTimeOut once Variant Management provides an api to fetch the current variant key on save!!!
          setTimeout(function () {
            _this3.getExtensionAPI().updateAppState();
          }, 1000);
        },
        onSearch: function () {
          var _this4 = this;

          var oFilterBar = this._getFilterBarControl();

          var oInternalModelContext = this.getView().getBindingContext("internal");
          var oMdcChart = this.getChartControl();
          var bHideDraft = FilterUtils.getEditStateIsHideDraft(oFilterBar.getConditions());
          oInternalModelContext.setProperty("hasPendingFilters", false);
          oInternalModelContext.setProperty("hideDraftInfo", bHideDraft);

          if (!this._getMultiModeControl()) {
            this._updateALPNotApplicableFields(oInternalModelContext, oFilterBar);
          }

          if (oMdcChart) {
            // disable bound actions TODO: this clears everything for the chart?
            oMdcChart.getBindingContext("internal").setProperty("", {});
            var oPageInternalModelContext = oMdcChart.getBindingContext("pageInternal");
            var sTemplateContentView = oPageInternalModelContext.getProperty("".concat(oPageInternalModelContext.getPath(), "/alpContentView"));

            if (sTemplateContentView === TemplateContentView.Chart) {
              this.hasPendingChartChanges = true;
            }

            if (sTemplateContentView === TemplateContentView.Table) {
              this.hasPendingTableChanges = true;
            }
          } // store filter bar conditions to use later while navigation


          StateUtil.retrieveExternalState(oFilterBar).then(function (oExternalState) {
            _this4.filterBarConditions = oExternalState.filter;
          }).catch(function (oError) {
            Log.error("Error while retrieving the external state", oError);
          });

          if (this.getView().getViewData().liveMode === false) {
            this.getExtensionAPI().updateAppState();
          }

          if (system.phone) {
            var oDynamicPage = this._getDynamicListReportControl();

            oDynamicPage.setHeaderExpanded(false);
          }
        },

        /**
         * Triggers an outbound navigation when a user chooses the chevron.
         *
         * @param oController
         * @param sOutboundTarget Name of the outbound target (needs to be defined in the manifest)
         * @param oContext The context that contains the data for the target app
         * @param sCreatePath Create path when the chevron is created.
         * @returns Promise which is resolved once the navigation is triggered
         * @ui5-restricted
         * @final
         */
        onChevronPressNavigateOutBound: function (oController, sOutboundTarget, oContext, sCreatePath) {
          return oController._intentBasedNavigation.onChevronPressNavigateOutBound(oController, sOutboundTarget, oContext, sCreatePath);
        },
        onChartSelectionChanged: function (oEvent) {
          var oMdcChart = oEvent.getSource().getContent(),
              oTable = this._getTable(),
              aData = oEvent.getParameter("data"),
              oInternalModelContext = this.getView().getBindingContext("internal");

          if (aData) {
            // update action buttons enablement / disablement
            ChartRuntime.fnUpdateChart(oEvent); // update selections on selection or deselection

            ChartUtils.setChartFilters(oMdcChart);
          }

          var sTemplateContentView = oInternalModelContext.getProperty("".concat(oInternalModelContext.getPath(), "/alpContentView"));

          if (sTemplateContentView === TemplateContentView.Chart) {
            this.hasPendingChartChanges = true;
          } else if (oTable) {
            oTable.rebind();
            this.hasPendingChartChanges = false;
          }
        },
        onSegmentedButtonPressed: function (oEvent) {
          var sSelectedKey = oEvent.mParameters.key ? oEvent.mParameters.key : null;
          var oInternalModelContext = this.getView().getBindingContext("internal");
          oInternalModelContext.setProperty("alpContentView", sSelectedKey);
          var oChart = this.getChartControl();

          var oTable = this._getTable();

          var oSegmentedButtonDelegate = {
            onAfterRendering: function () {
              var aItems = oSegmentedButton.getItems();
              aItems.forEach(function (oItem) {
                if (oItem.getKey() === sSelectedKey) {
                  oItem.focus();
                }
              });
              oSegmentedButton.removeEventDelegate(oSegmentedButtonDelegate);
            }
          };
          var oSegmentedButton = sSelectedKey === TemplateContentView.Table ? this._getSegmentedButton("Table") : this._getSegmentedButton("Chart");

          if (oSegmentedButton !== oEvent.getSource()) {
            oSegmentedButton.addEventDelegate(oSegmentedButtonDelegate);
          }

          switch (sSelectedKey) {
            case TemplateContentView.Table:
              this._updateTable(oTable);

              break;

            case TemplateContentView.Chart:
              this._updateChart(oChart);

              break;

            case TemplateContentView.Hybrid:
              this._updateTable(oTable);

              this._updateChart(oChart);

              break;

            default:
              break;
          }

          this.getExtensionAPI().updateAppState();
        },
        onFiltersSegmentedButtonPressed: function (oEvent) {
          var isCompact = oEvent.getParameter("key") === "Compact";

          this._getFilterBarControl().setVisible(isCompact);

          this._getVisualFilterBarControl().setVisible(!isCompact);
        },
        onStateChange: function () {
          this.getExtensionAPI().updateAppState();
        },
        onDynamicPageTitleStateChanged: function (oEvent) {
          var filterBar = this._getFilterBarControl();

          if (filterBar && filterBar.getSegmentedButton()) {
            if (oEvent.getParameter("isExpanded")) {
              filterBar.getSegmentedButton().setVisible(true);
            } else {
              filterBar.getSegmentedButton().setVisible(false);
            }
          }
        }
      };
      _this.formatters = {
        setALPControlMessageStrip: function (aIgnoredFields, bIsChart, oApplySupported) {
          var sText = "";
          bIsChart = bIsChart === "true" || bIsChart === true;

          var oFilterBar = this._getFilterBarControl();

          if (oFilterBar && Array.isArray(aIgnoredFields) && aIgnoredFields.length > 0 && bIsChart) {
            var aIgnoredLabels = MessageStrip.getLabels(aIgnoredFields, oFilterBar.data("entityType"), oFilterBar, this.oResourceBundle);
            var bIsSearchIgnored = !oApplySupported.enableSearch;
            sText = bIsChart ? MessageStrip.getALPText(aIgnoredLabels, oFilterBar, bIsSearchIgnored) : MessageStrip.getText(aIgnoredLabels, oFilterBar, "", DelegateUtil.getLocalizedText);
            return sText;
          }
        }
      };
      return _this;
    }

    var _proto = ListReportController.prototype;

    _proto.getExtensionAPI = function getExtensionAPI() {
      if (!this.extensionAPI) {
        this.extensionAPI = new ExtensionAPI(this);
      }

      return this.extensionAPI;
    };

    _proto.onInit = function onInit() {
      PageController.prototype.onInit.apply(this);
      var oInternalModelContext = this.getView().getBindingContext("internal");
      oInternalModelContext.setProperty("hasPendingFilters", true);
      oInternalModelContext.setProperty("appliedFilters", "");
      oInternalModelContext.setProperty("hideDraftInfo", false);
      oInternalModelContext.setProperty("uom", {});
      oInternalModelContext.setProperty("scalefactor", {});
      oInternalModelContext.setProperty("scalefactorNumber", {});
      oInternalModelContext.setProperty("currency", {});

      if (this._hasMultiVisualizations()) {
        var alpContentView = this._getDefaultPath();

        if (!system.desktop && alpContentView === TemplateContentView.Hybrid) {
          alpContentView = TemplateContentView.Chart;
        }

        oInternalModelContext.setProperty("alpContentView", alpContentView);
      } // Store conditions from filter bar
      // this is later used before navigation to get conditions applied on the filter bar


      this.filterBarConditions = {}; // As AppStateHandler.applyAppState triggers a navigation we want to make sure it will
      // happen after the routeMatch event has been processed (otherwise the router gets broken)

      this.getAppComponent().getRouterProxy().waitForRouteMatchBeforeNavigation(); // Configure the initial load settings

      this._setInitLoad();
    };

    _proto.onExit = function onExit() {
      delete this.filterBarConditions;

      if (this.extensionAPI) {
        this.extensionAPI.destroy();
      }

      delete this.extensionAPI;
    };

    _proto._onAfterBinding = function _onAfterBinding() {
      var _this5 = this;

      var aTables = this._getControls("table");

      if (EditState.isEditStateDirty()) {
        var _this$_getMultiModeCo, _this$_getTable;

        (_this$_getMultiModeCo = this._getMultiModeControl()) === null || _this$_getMultiModeCo === void 0 ? void 0 : _this$_getMultiModeCo.invalidateContent();
        var oTableBinding = (_this$_getTable = this._getTable()) === null || _this$_getTable === void 0 ? void 0 : _this$_getTable.getRowBinding();

        if (oTableBinding) {
          if (CommonUtils.getAppComponent(this.getView())._isFclEnabled()) {
            // there is an issue if we use a timeout with a kept alive context used on another page
            oTableBinding.refresh();
          } else {
            if (!this.sUpdateTimer) {
              this.sUpdateTimer = setTimeout(function () {
                oTableBinding.refresh();
                delete _this5.sUpdateTimer;
              }, 0);
            } // Update action enablement and visibility upon table data update.


            var fnUpdateTableActions = function () {
              _this5._updateTableActions(aTables);

              oTableBinding.detachDataReceived(fnUpdateTableActions);
            };

            oTableBinding.attachDataReceived(fnUpdateTableActions);
          }
        }

        EditState.setEditStateProcessed();
      }

      if (!this.sUpdateTimer) {
        this._updateTableActions(aTables);
      }

      this.pageReady.waitFor(this.getAppComponent().getAppStateHandler().applyAppState());
    };

    _proto.onBeforeRendering = function onBeforeRendering() {
      PageController.prototype.onBeforeRendering.apply(this);
    };

    _proto.onAfterRendering = function onAfterRendering() {
      var _this6 = this;

      this.getView().getModel("sap.fe.i18n").getResourceBundle().then(function (response) {
        _this6.oResourceBundle = response;

        var aTables = _this6._getControls();

        var sEntitySet = _this6.getView().getViewData().entitySet;

        var sText = CommonUtils.getTranslatedText("T_TABLE_AND_CHART_NO_DATA_TEXT", _this6.oResourceBundle, undefined, sEntitySet);
        aTables.forEach(function (oTable) {
          oTable.setNoData(sText);
        });
      }).catch(function (oError) {
        Log.error("Error while retrieving the resource bundle", oError);
      });
    };

    _proto.onPageReady = function onPageReady(mParameters) {
      if (mParameters.forceFocus) {
        this._setInitialFocus();
      } // Remove the handler on back navigation that displays Draft confirmation


      this.getAppComponent().getShellServices().setBackNavigation(undefined);
    }
    /**
     * Method called when the content of a list report view needs to be refreshed.
     * This happens either when there is a change on the FilterBar and the search is triggered,
     * or when a tab with custom content is selected.
     * This method can be overwritten by the controller extension in case of customization.
     *
     * @param mParameters Map containing the filter conditions of the FilterBar, the currentTabID
     * and the view refresh cause (tabChanged or search).
     * The map looks like this:
     * <code><pre>
     * 	{
     * 		filterConditions: {
     * 			Country: [
     * 				{
     * 					operator: "EQ"
     *					validated: "NotValidated"
     *					values: ["Germany", ...]
     * 				},
     * 				...
     * 			]
     * 			...
     * 		},
     *		currentTabId: "fe::CustomTab::tab1",
     *		refreshCause: "tabChanged" | "search"
     *	}
     * </pre></code>
     * @public
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onViewNeedsRefresh = function onViewNeedsRefresh(mParameters) {
      /* To be overriden */
    }
    /**
     * Method called when a filter or search value has been changed in the FilterBar,
     * but has not been validated yet by the end user (with the 'Go' or 'Search' button).
     * Typically, the content of the current tab is greyed out until the filters are validated.
     * This method can be overwritten by the controller extension in case of customization.
     *
     * @public
     */
    ;

    _proto.onPendingFilters = function onPendingFilters() {
      /* To be overriden */
    };

    _proto.getCurrentEntitySet = function getCurrentEntitySet() {
      var _this$_getTable2;

      return (_this$_getTable2 = this._getTable()) === null || _this$_getTable2 === void 0 ? void 0 : _this$_getTable2.data("targetCollectionPath").slice(1);
    }
    /**
     * This method initiates the update of the enabled state of the DataFieldForAction and the visible state of the DataFieldForIBN buttons.
     *
     * @param aTables Array of tables in the list report
     * @private
     */
    ;

    _proto._updateTableActions = function _updateTableActions(aTables) {
      var aIBNActions = [];
      aTables.forEach(function (oTable) {
        aIBNActions = CommonUtils.getIBNActions(oTable, aIBNActions); // Update 'enabled' property of DataFieldForAction buttons on table toolbar
        // The same is also performed on Table selectionChange event

        var oInternalModelContext = oTable.getBindingContext("internal"),
            oActionOperationAvailableMap = JSON.parse(CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "operationAvailableMap"))),
            aSelectedContexts = oTable.getSelectedContexts();
        oInternalModelContext.setProperty("selectedContexts", aSelectedContexts);
        oInternalModelContext.setProperty("numberOfSelectedContexts", aSelectedContexts.length);
        TableHelper.handleTableDeleteEnablementForSideEffects(oTable, oInternalModelContext);
        ActionRuntime.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts, "table");
      });
      CommonUtils.updateDataFieldForIBNButtonsVisibility(aIBNActions, this.getView());
    }
    /**
     * This method scrolls to a specific row on all the available tables.
     *
     * @function
     * @name sap.fe.templates.ListReport.ListReportController.controller#_scrollTablesToRow
     * @param sRowPath The path of the table row context to be scrolled to
     */
    ;

    _proto._scrollTablesToRow = function _scrollTablesToRow(sRowPath) {
      this._getControls("table").forEach(function (oTable) {
        TableScroller.scrollTableToRow(oTable, sRowPath);
      });
    }
    /**
     * This method set the initial focus within the List Report according to the UX guide lines.
     *
     * @function
     * @name sap.fe.templates.ListReport.ListReportController.controller#_setInitialFocus
     */
    ;

    _proto._setInitialFocus = function _setInitialFocus() {
      var dynamicPage = this._getDynamicListReportControl(),
          isHeaderExpanded = dynamicPage.getHeaderExpanded(),
          filterBar = this._getFilterBarControl();

      if (filterBar) {
        if (isHeaderExpanded) {
          //Enabling mandatory filter fields message dialog
          if (!filterBar.getShowMessages()) {
            filterBar.setShowMessages(true);
          }

          var firstEmptyMandatoryField = filterBar.getFilterItems().find(function (oFilterItem) {
            return oFilterItem.getRequired() && oFilterItem.getConditions().length === 0;
          }); //Focusing on the first empty mandatory filter field, or on the first filter field if the table data is loaded

          if (firstEmptyMandatoryField) {
            firstEmptyMandatoryField.focus();
          } else if (this._isInitLoadEnabled()) {
            filterBar.getFilterItems()[0].focus();
          } else {
            //Focusing on the Go button
            this.getView().byId("".concat(this._getFilterBarControlId(), "-btnSearch")).focus();
          }
        } else if (this._isInitLoadEnabled()) {
          var _this$_getTable3;

          (_this$_getTable3 = this._getTable()) === null || _this$_getTable3 === void 0 ? void 0 : _this$_getTable3.focusRow(0);
        }
      } else {
        var _this$_getTable4;

        (_this$_getTable4 = this._getTable()) === null || _this$_getTable4 === void 0 ? void 0 : _this$_getTable4.focusRow(0);
      }
    };

    _proto._getPageTitleInformation = function _getPageTitleInformation() {
      var oManifestEntry = this.getAppComponent().getManifestEntry("sap.app");
      return {
        title: oManifestEntry.title,
        subtitle: oManifestEntry.appSubTitle || "",
        intent: "",
        icon: ""
      };
    };

    _proto._getFilterBarControl = function _getFilterBarControl() {
      return this.getView().byId(this._getFilterBarControlId());
    };

    _proto._getDynamicListReportControl = function _getDynamicListReportControl() {
      return this.getView().byId(this._getDynamicListReportControlId());
    };

    _proto._getAdaptationFilterBarControl = function _getAdaptationFilterBarControl() {
      // If the adaptation filter bar is part of the DOM tree, the "Adapt Filter" dialog is open,
      // and we return the adaptation filter bar as an active control (visible for the user)
      var adaptationFilterBar = this._getFilterBarControl().getInbuiltFilter();

      return adaptationFilterBar !== null && adaptationFilterBar !== void 0 && adaptationFilterBar.getParent() ? adaptationFilterBar : undefined;
    };

    _proto._getSegmentedButton = function _getSegmentedButton(sControl) {
      var _ref;

      var sSegmentedButtonId = (_ref = sControl === "Chart" ? this.getChartControl() : this._getTable()) === null || _ref === void 0 ? void 0 : _ref.data("segmentedButtonId");
      return this.getView().byId(sSegmentedButtonId);
    };

    _proto._getControlFromPageModelProperty = function _getControlFromPageModelProperty(sPath) {
      var _this$_getPageModel;

      var controlId = (_this$_getPageModel = this._getPageModel()) === null || _this$_getPageModel === void 0 ? void 0 : _this$_getPageModel.getProperty(sPath);
      return controlId && this.getView().byId(controlId);
    };

    _proto._getPageModel = function _getPageModel() {
      var pageComponent = Component.getOwnerComponentFor(this.getView());
      return pageComponent.getModel("_pageModel");
    };

    _proto._getDynamicListReportControlId = function _getDynamicListReportControlId() {
      var _this$_getPageModel2;

      return ((_this$_getPageModel2 = this._getPageModel()) === null || _this$_getPageModel2 === void 0 ? void 0 : _this$_getPageModel2.getProperty("/dynamicListReportId")) || "";
    };

    _proto._getFilterBarControlId = function _getFilterBarControlId() {
      var _this$_getPageModel3;

      return ((_this$_getPageModel3 = this._getPageModel()) === null || _this$_getPageModel3 === void 0 ? void 0 : _this$_getPageModel3.getProperty("/filterBarId")) || "";
    };

    _proto.getChartControl = function getChartControl() {
      return this._getControlFromPageModelProperty("/singleChartId");
    };

    _proto._getVisualFilterBarControl = function _getVisualFilterBarControl() {
      var sVisualFilterBarId = StableIdHelper.generate(["visualFilter", this._getFilterBarControlId()]);
      return sVisualFilterBarId && this.getView().byId(sVisualFilterBarId);
    };

    _proto._getFilterBarVariantControl = function _getFilterBarVariantControl() {
      return this._getControlFromPageModelProperty("/variantManagement/id");
    };

    _proto._getMultiModeControl = function _getMultiModeControl() {
      return this.getView().byId("fe::TabMultipleMode::Control");
    };

    _proto._getTable = function _getTable() {
      if (this._isMultiMode()) {
        var _this$_getMultiModeCo2, _this$_getMultiModeCo3;

        var oControl = (_this$_getMultiModeCo2 = this._getMultiModeControl()) === null || _this$_getMultiModeCo2 === void 0 ? void 0 : (_this$_getMultiModeCo3 = _this$_getMultiModeCo2.getSelectedInnerControl()) === null || _this$_getMultiModeCo3 === void 0 ? void 0 : _this$_getMultiModeCo3.content;
        return oControl !== null && oControl !== void 0 && oControl.isA("sap.ui.mdc.Table") ? oControl : undefined;
      } else {
        return this._getControlFromPageModelProperty("/singleTableId");
      }
    };

    _proto._getControls = function _getControls(sKey) {
      var _this7 = this;

      if (this._isMultiMode()) {
        var aControls = [];

        var oTabMultiMode = this._getMultiModeControl().content;

        oTabMultiMode.getItems().forEach(function (oItem) {
          var oControl = _this7.getView().byId(oItem.getKey());

          if (oControl && sKey) {
            if (oItem.getKey().indexOf("fe::".concat(sKey)) > -1) {
              aControls.push(oControl);
            }
          } else if (oControl !== undefined && oControl !== null) {
            aControls.push(oControl);
          }
        });
        return aControls;
      } else if (sKey === "Chart") {
        var oChart = this.getChartControl();
        return oChart ? [oChart] : [];
      } else {
        var oTable = this._getTable();

        return oTable ? [oTable] : [];
      }
    };

    _proto._getDefaultPath = function _getDefaultPath() {
      var _this$_getPageModel4;

      var defaultPath = ListReportTemplating.getDefaultPath(((_this$_getPageModel4 = this._getPageModel()) === null || _this$_getPageModel4 === void 0 ? void 0 : _this$_getPageModel4.getProperty("/views")) || []);

      switch (defaultPath) {
        case "primary":
          return TemplateContentView.Chart;

        case "secondary":
          return TemplateContentView.Table;

        case "both":
        default:
          return TemplateContentView.Hybrid;
      }
    }
    /**
     * Method to know if ListReport is configured with Multiple Table mode.
     *
     * @function
     * @name _isMultiMode
     * @returns Is Multiple Table mode set?
     */
    ;

    _proto._isMultiMode = function _isMultiMode() {
      var _this$_getPageModel5;

      return !!((_this$_getPageModel5 = this._getPageModel()) !== null && _this$_getPageModel5 !== void 0 && _this$_getPageModel5.getProperty("/multiViewsControl"));
    }
    /**
     * Method to know if ListReport is configured to load data at start up.
     *
     * @function
     * @name _isInitLoadDisabled
     * @returns Is InitLoad enabled?
     */
    ;

    _proto._isInitLoadEnabled = function _isInitLoadEnabled() {
      var initLoadMode = this.getView().getViewData().initialLoad;
      return initLoadMode === InitialLoadMode.Enabled;
    };

    _proto._hasMultiVisualizations = function _hasMultiVisualizations() {
      var _this$_getPageModel6;

      return (_this$_getPageModel6 = this._getPageModel()) === null || _this$_getPageModel6 === void 0 ? void 0 : _this$_getPageModel6.getProperty("/hasMultiVisualizations");
    }
    /**
     * Method to suspend search on the filter bar. The initial loading of data is disabled based on the manifest configuration InitLoad - Disabled/Auto.
     * It is enabled later when the view state is set, when it is possible to realize if there are default filters.
     */
    ;

    _proto._disableInitLoad = function _disableInitLoad() {
      var filterBar = this._getFilterBarControl(); // check for filter bar hidden


      if (filterBar) {
        filterBar.setSuspendSelection(true);
      }
    }
    /**
     * Method called by flex to determine if the applyAutomatically setting on the variant is valid.
     * Called only for Standard Variant and only when there is display text set for applyAutomatically (FE only sets it for Auto).
     *
     * @returns Boolean true if data should be loaded automatically, false otherwise
     */
    ;

    _proto._applyAutomaticallyOnStandardVariant = function _applyAutomaticallyOnStandardVariant() {
      // We always return false and take care of it when view state is set
      return false;
    }
    /**
     * Configure the settings for initial load based on
     * - manifest setting initLoad - Enabled/Disabled/Auto
     * - user's setting of applyAutomatically on variant
     * - if there are default filters
     * We disable the filter bar search at the beginning and enable it when view state is set.
     */
    ;

    _proto._setInitLoad = function _setInitLoad() {
      // if initLoad is Disabled or Auto, switch off filter bar search temporarily at start
      if (!this._isInitLoadEnabled()) {
        this._disableInitLoad();
      } // set hook for flex for when standard variant is set (at start or by user at runtime)
      // required to override the user setting 'apply automatically' behaviour if there are no filters


      var variantManagementId = ListReportTemplating.getVariantBackReference(this.getView().getViewData(), this._getPageModel());
      var variantManagement = variantManagementId && this.getView().byId(variantManagementId);

      if (variantManagement) {
        variantManagement.registerApplyAutomaticallyOnStandardVariant(this._applyAutomaticallyOnStandardVariant.bind(this));
      }
    };

    _proto._setShareModel = function _setShareModel() {
      // TODO: deactivated for now - currently there is no _templPriv anymore, to be discussed
      // this method is currently not called anymore from the init method
      var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser"); //var oManifest = this.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");
      //var sBookmarkIcon = (oManifest && oManifest.icons && oManifest.icons.icon) || "";
      //shareModel: Holds all the sharing relevant information and info used in XML view

      var oShareInfo = {
        bookmarkTitle: document.title,
        //To name the bookmark according to the app title.
        bookmarkCustomUrl: function () {
          var sHash = hasher.getHash();
          return sHash ? "#".concat(sHash) : window.location.href;
        },

        /*
        				To be activated once the FLP shows the count - see comment above
        				bookmarkServiceUrl: function() {
        					//var oTable = oTable.getInnerTable(); oTable is already the sap.fe table (but not the inner one)
        					// we should use table.getListBindingInfo instead of the binding
        					var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
        					return oBinding ? fnGetDownloadUrl(oBinding) : "";
        				},*/
        isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
      };
      var oTemplatePrivateModel = this.getOwnerComponent().getModel("_templPriv");
      oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
    }
    /**
     * Method to update the local UI model of the page with the fields that are not applicable to the filter bar (this is specific to the ALP scenario).
     *
     * @param oInternalModelContext The internal model context
     * @param oFilterBar MDC filter bar
     */
    ;

    _proto._updateALPNotApplicableFields = function _updateALPNotApplicableFields(oInternalModelContext, oFilterBar) {
      var mCache = {};

      var ignoredFields = {},
          aTables = this._getControls("table"),
          aCharts = this._getControls("Chart");

      if (!aTables.length || !aCharts.length) {
        // If there's not a table and a chart, we're not in the ALP case
        return;
      } // For the moment, there's nothing for tables...


      aCharts.forEach(function (oChart) {
        var sChartEntityPath = oChart.data("targetCollectionPath"),
            sChartEntitySet = sChartEntityPath.slice(1),
            sCacheKey = "".concat(sChartEntitySet, "Chart");

        if (!mCache[sCacheKey]) {
          mCache[sCacheKey] = FilterUtils.getNotApplicableFilters(oFilterBar, oChart);
        }

        ignoredFields[sCacheKey] = mCache[sCacheKey];
      });
      oInternalModelContext.setProperty("controls/ignoredFields", ignoredFields);
    };

    _proto._isFilterBarHidden = function _isFilterBarHidden() {
      return this.getView().getViewData().hideFilterBar;
    };

    _proto._getApplyAutomaticallyOnVariant = function _getApplyAutomaticallyOnVariant(VariantManagement, key) {
      if (!VariantManagement || !key) {
        return false;
      }

      var variants = VariantManagement.getVariants();
      var currentVariant = variants.find(function (variant) {
        return variant && variant.key === key;
      });
      return currentVariant && currentVariant.executeOnSelect || false;
    };

    _proto._shouldAutoTriggerSearch = function _shouldAutoTriggerSearch(oVM) {
      if (this.getView().getViewData().initialLoad === InitialLoadMode.Auto && (!oVM || oVM.getStandardVariantKey() === oVM.getCurrentVariantKey())) {
        var oFilterBar = this._getFilterBarControl();

        if (oFilterBar) {
          var oConditions = oFilterBar.getConditions();

          for (var sKey in oConditions) {
            // ignore filters starting with $ (e.g. $search, $editState)
            if (!sKey.startsWith("$") && Array.isArray(oConditions[sKey]) && oConditions[sKey].length) {
              // load data as per user's setting of applyAutomatically on the variant
              var standardVariant = oVM.getVariants().find(function (variant) {
                return variant.key === oVM.getCurrentVariantKey();
              });
              return standardVariant && standardVariant.executeOnSelect;
            }
          }
        }
      }

      return false;
    };

    _proto._updateTable = function _updateTable(oTable) {
      if (!oTable.isTableBound() || this.hasPendingChartChanges) {
        oTable.rebind();
        this.hasPendingChartChanges = false;
      }
    };

    _proto._updateChart = function _updateChart(oChart) {
      var oInnerChart = oChart.getControlDelegate()._getChart(oChart);

      if (!(oInnerChart && oInnerChart.isBound("data")) || this.hasPendingTableChanges) {
        oChart.getControlDelegate().rebind(oChart, oInnerChart.getBindingInfo("data"));
        this.hasPendingTableChanges = false;
      }
    };

    return ListReportController;
  }(PageController), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_routing", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_intentBasedNavigation", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sideEffects", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "intentBasedNavigation", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "share", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "editFlow", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "viewState", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "kpiManagement", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "placeholder", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "massEdit", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "getExtensionAPI", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "getExtensionAPI"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPageReady", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "onPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onViewNeedsRefresh", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "onViewNeedsRefresh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPendingFilters", [_dec18, _dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "onPendingFilters"), _class2.prototype)), _class2)) || _class);
  return ListReportController;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUZW1wbGF0ZUNvbnRlbnRWaWV3IiwiQ29yZUxpYnJhcnkiLCJJbml0aWFsTG9hZE1vZGUiLCJMaXN0UmVwb3J0Q29udHJvbGxlciIsImRlZmluZVVJNUNsYXNzIiwidXNpbmdFeHRlbnNpb24iLCJJbnRlcm5hbFJvdXRpbmciLCJvdmVycmlkZSIsIm9uQWZ0ZXJCaW5kaW5nIiwiZ2V0VmlldyIsImdldENvbnRyb2xsZXIiLCJfb25BZnRlckJpbmRpbmciLCJJbnRlcm5hbEludGVudEJhc2VkTmF2aWdhdGlvbiIsImdldEVudGl0eVNldCIsImJhc2UiLCJnZXRDdXJyZW50RW50aXR5U2V0IiwiU2lkZUVmZmVjdHMiLCJJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJJbnRlbnRCYXNlZE5hdmlnYXRpb25PdmVycmlkZSIsIlNoYXJlIiwiU2hhcmVPdmVycmlkZXMiLCJFZGl0RmxvdyIsIkVkaXRGbG93T3ZlcnJpZGVzIiwiVmlld1N0YXRlIiwiVmlld1N0YXRlT3ZlcnJpZGVzIiwiS1BJTWFuYWdlbWVudCIsIlBsYWNlaG9sZGVyIiwiTWFzc0VkaXQiLCJwdWJsaWNFeHRlbnNpb24iLCJmaW5hbEV4dGVuc2lvbiIsInByaXZhdGVFeHRlbnNpb24iLCJleHRlbnNpYmxlIiwiT3ZlcnJpZGVFeGVjdXRpb24iLCJBZnRlciIsImhhbmRsZXJzIiwiaGFuZGxlU2hhcmVTaG9ydGN1dCIsInNoYXJlQVBJIiwiYnlJZCIsIm9wZW5NZW51Iiwib25GaWx0ZXJTZWFyY2giLCJfZ2V0RmlsdGVyQmFyQ29udHJvbCIsInRyaWdnZXJTZWFyY2giLCJvbkZpbHRlcnNDaGFuZ2VkIiwib0V2ZW50Iiwib0ZpbHRlckJhciIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0Iiwib25QZW5kaW5nRmlsdGVycyIsInNldFByb3BlcnR5IiwiZ2V0QXNzaWduZWRGaWx0ZXJzVGV4dCIsImZpbHRlcnNUZXh0IiwiZ2V0UGFyYW1ldGVyIiwib25WYXJpYW50U2VsZWN0ZWQiLCJvVk0iLCJnZXRTb3VyY2UiLCJjdXJyZW50VmFyaWFudEtleSIsIm9NdWx0aU1vZGVDb250cm9sIiwiX2dldE11bHRpTW9kZUNvbnRyb2wiLCJpbnZhbGlkYXRlQ29udGVudCIsInNldEZyZWV6ZUNvbnRlbnQiLCJzZXRUaW1lb3V0IiwiX3Nob3VsZEF1dG9UcmlnZ2VyU2VhcmNoIiwiX2dldEFwcGx5QXV0b21hdGljYWxseU9uVmFyaWFudCIsImdldEV4dGVuc2lvbkFQSSIsInVwZGF0ZUFwcFN0YXRlIiwib25WYXJpYW50U2F2ZWQiLCJvblNlYXJjaCIsIm9NZGNDaGFydCIsImdldENoYXJ0Q29udHJvbCIsImJIaWRlRHJhZnQiLCJGaWx0ZXJVdGlscyIsImdldEVkaXRTdGF0ZUlzSGlkZURyYWZ0IiwiZ2V0Q29uZGl0aW9ucyIsIl91cGRhdGVBTFBOb3RBcHBsaWNhYmxlRmllbGRzIiwib1BhZ2VJbnRlcm5hbE1vZGVsQ29udGV4dCIsInNUZW1wbGF0ZUNvbnRlbnRWaWV3IiwiZ2V0UHJvcGVydHkiLCJnZXRQYXRoIiwiQ2hhcnQiLCJoYXNQZW5kaW5nQ2hhcnRDaGFuZ2VzIiwiVGFibGUiLCJoYXNQZW5kaW5nVGFibGVDaGFuZ2VzIiwiU3RhdGVVdGlsIiwicmV0cmlldmVFeHRlcm5hbFN0YXRlIiwidGhlbiIsIm9FeHRlcm5hbFN0YXRlIiwiZmlsdGVyQmFyQ29uZGl0aW9ucyIsImZpbHRlciIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJnZXRWaWV3RGF0YSIsImxpdmVNb2RlIiwic3lzdGVtIiwicGhvbmUiLCJvRHluYW1pY1BhZ2UiLCJfZ2V0RHluYW1pY0xpc3RSZXBvcnRDb250cm9sIiwic2V0SGVhZGVyRXhwYW5kZWQiLCJvbkNoZXZyb25QcmVzc05hdmlnYXRlT3V0Qm91bmQiLCJvQ29udHJvbGxlciIsInNPdXRib3VuZFRhcmdldCIsIm9Db250ZXh0Iiwic0NyZWF0ZVBhdGgiLCJfaW50ZW50QmFzZWROYXZpZ2F0aW9uIiwib25DaGFydFNlbGVjdGlvbkNoYW5nZWQiLCJnZXRDb250ZW50Iiwib1RhYmxlIiwiX2dldFRhYmxlIiwiYURhdGEiLCJDaGFydFJ1bnRpbWUiLCJmblVwZGF0ZUNoYXJ0IiwiQ2hhcnRVdGlscyIsInNldENoYXJ0RmlsdGVycyIsInJlYmluZCIsIm9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZCIsInNTZWxlY3RlZEtleSIsIm1QYXJhbWV0ZXJzIiwia2V5Iiwib0NoYXJ0Iiwib1NlZ21lbnRlZEJ1dHRvbkRlbGVnYXRlIiwib25BZnRlclJlbmRlcmluZyIsImFJdGVtcyIsIm9TZWdtZW50ZWRCdXR0b24iLCJnZXRJdGVtcyIsImZvckVhY2giLCJvSXRlbSIsImdldEtleSIsImZvY3VzIiwicmVtb3ZlRXZlbnREZWxlZ2F0ZSIsIl9nZXRTZWdtZW50ZWRCdXR0b24iLCJhZGRFdmVudERlbGVnYXRlIiwiX3VwZGF0ZVRhYmxlIiwiX3VwZGF0ZUNoYXJ0IiwiSHlicmlkIiwib25GaWx0ZXJzU2VnbWVudGVkQnV0dG9uUHJlc3NlZCIsImlzQ29tcGFjdCIsInNldFZpc2libGUiLCJfZ2V0VmlzdWFsRmlsdGVyQmFyQ29udHJvbCIsIm9uU3RhdGVDaGFuZ2UiLCJvbkR5bmFtaWNQYWdlVGl0bGVTdGF0ZUNoYW5nZWQiLCJmaWx0ZXJCYXIiLCJnZXRTZWdtZW50ZWRCdXR0b24iLCJmb3JtYXR0ZXJzIiwic2V0QUxQQ29udHJvbE1lc3NhZ2VTdHJpcCIsImFJZ25vcmVkRmllbGRzIiwiYklzQ2hhcnQiLCJvQXBwbHlTdXBwb3J0ZWQiLCJzVGV4dCIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImFJZ25vcmVkTGFiZWxzIiwiTWVzc2FnZVN0cmlwIiwiZ2V0TGFiZWxzIiwiZGF0YSIsIm9SZXNvdXJjZUJ1bmRsZSIsImJJc1NlYXJjaElnbm9yZWQiLCJlbmFibGVTZWFyY2giLCJnZXRBTFBUZXh0IiwiZ2V0VGV4dCIsIkRlbGVnYXRlVXRpbCIsImdldExvY2FsaXplZFRleHQiLCJleHRlbnNpb25BUEkiLCJFeHRlbnNpb25BUEkiLCJvbkluaXQiLCJQYWdlQ29udHJvbGxlciIsInByb3RvdHlwZSIsImFwcGx5IiwiX2hhc011bHRpVmlzdWFsaXphdGlvbnMiLCJhbHBDb250ZW50VmlldyIsIl9nZXREZWZhdWx0UGF0aCIsImRlc2t0b3AiLCJnZXRBcHBDb21wb25lbnQiLCJnZXRSb3V0ZXJQcm94eSIsIndhaXRGb3JSb3V0ZU1hdGNoQmVmb3JlTmF2aWdhdGlvbiIsIl9zZXRJbml0TG9hZCIsIm9uRXhpdCIsImRlc3Ryb3kiLCJhVGFibGVzIiwiX2dldENvbnRyb2xzIiwiRWRpdFN0YXRlIiwiaXNFZGl0U3RhdGVEaXJ0eSIsIm9UYWJsZUJpbmRpbmciLCJnZXRSb3dCaW5kaW5nIiwiQ29tbW9uVXRpbHMiLCJfaXNGY2xFbmFibGVkIiwicmVmcmVzaCIsInNVcGRhdGVUaW1lciIsImZuVXBkYXRlVGFibGVBY3Rpb25zIiwiX3VwZGF0ZVRhYmxlQWN0aW9ucyIsImRldGFjaERhdGFSZWNlaXZlZCIsImF0dGFjaERhdGFSZWNlaXZlZCIsInNldEVkaXRTdGF0ZVByb2Nlc3NlZCIsInBhZ2VSZWFkeSIsIndhaXRGb3IiLCJnZXRBcHBTdGF0ZUhhbmRsZXIiLCJhcHBseUFwcFN0YXRlIiwib25CZWZvcmVSZW5kZXJpbmciLCJnZXRNb2RlbCIsImdldFJlc291cmNlQnVuZGxlIiwicmVzcG9uc2UiLCJzRW50aXR5U2V0IiwiZW50aXR5U2V0IiwiZ2V0VHJhbnNsYXRlZFRleHQiLCJ1bmRlZmluZWQiLCJzZXROb0RhdGEiLCJvblBhZ2VSZWFkeSIsImZvcmNlRm9jdXMiLCJfc2V0SW5pdGlhbEZvY3VzIiwiZ2V0U2hlbGxTZXJ2aWNlcyIsInNldEJhY2tOYXZpZ2F0aW9uIiwib25WaWV3TmVlZHNSZWZyZXNoIiwic2xpY2UiLCJhSUJOQWN0aW9ucyIsImdldElCTkFjdGlvbnMiLCJvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwiSlNPTiIsInBhcnNlIiwiQ29tbW9uSGVscGVyIiwicGFyc2VDdXN0b21EYXRhIiwiZ2V0Q3VzdG9tRGF0YSIsImFTZWxlY3RlZENvbnRleHRzIiwiZ2V0U2VsZWN0ZWRDb250ZXh0cyIsIlRhYmxlSGVscGVyIiwiaGFuZGxlVGFibGVEZWxldGVFbmFibGVtZW50Rm9yU2lkZUVmZmVjdHMiLCJBY3Rpb25SdW50aW1lIiwic2V0QWN0aW9uRW5hYmxlbWVudCIsInVwZGF0ZURhdGFGaWVsZEZvcklCTkJ1dHRvbnNWaXNpYmlsaXR5IiwiX3Njcm9sbFRhYmxlc1RvUm93Iiwic1Jvd1BhdGgiLCJUYWJsZVNjcm9sbGVyIiwic2Nyb2xsVGFibGVUb1JvdyIsImR5bmFtaWNQYWdlIiwiaXNIZWFkZXJFeHBhbmRlZCIsImdldEhlYWRlckV4cGFuZGVkIiwiZ2V0U2hvd01lc3NhZ2VzIiwic2V0U2hvd01lc3NhZ2VzIiwiZmlyc3RFbXB0eU1hbmRhdG9yeUZpZWxkIiwiZ2V0RmlsdGVySXRlbXMiLCJmaW5kIiwib0ZpbHRlckl0ZW0iLCJnZXRSZXF1aXJlZCIsIl9pc0luaXRMb2FkRW5hYmxlZCIsIl9nZXRGaWx0ZXJCYXJDb250cm9sSWQiLCJmb2N1c1JvdyIsIl9nZXRQYWdlVGl0bGVJbmZvcm1hdGlvbiIsIm9NYW5pZmVzdEVudHJ5IiwiZ2V0TWFuaWZlc3RFbnRyeSIsInRpdGxlIiwic3VidGl0bGUiLCJhcHBTdWJUaXRsZSIsImludGVudCIsImljb24iLCJfZ2V0RHluYW1pY0xpc3RSZXBvcnRDb250cm9sSWQiLCJfZ2V0QWRhcHRhdGlvbkZpbHRlckJhckNvbnRyb2wiLCJhZGFwdGF0aW9uRmlsdGVyQmFyIiwiZ2V0SW5idWlsdEZpbHRlciIsImdldFBhcmVudCIsInNDb250cm9sIiwic1NlZ21lbnRlZEJ1dHRvbklkIiwiX2dldENvbnRyb2xGcm9tUGFnZU1vZGVsUHJvcGVydHkiLCJzUGF0aCIsImNvbnRyb2xJZCIsIl9nZXRQYWdlTW9kZWwiLCJwYWdlQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiZ2V0T3duZXJDb21wb25lbnRGb3IiLCJzVmlzdWFsRmlsdGVyQmFySWQiLCJTdGFibGVJZEhlbHBlciIsImdlbmVyYXRlIiwiX2dldEZpbHRlckJhclZhcmlhbnRDb250cm9sIiwiX2lzTXVsdGlNb2RlIiwib0NvbnRyb2wiLCJnZXRTZWxlY3RlZElubmVyQ29udHJvbCIsImNvbnRlbnQiLCJpc0EiLCJzS2V5IiwiYUNvbnRyb2xzIiwib1RhYk11bHRpTW9kZSIsImluZGV4T2YiLCJwdXNoIiwiZGVmYXVsdFBhdGgiLCJMaXN0UmVwb3J0VGVtcGxhdGluZyIsImdldERlZmF1bHRQYXRoIiwiaW5pdExvYWRNb2RlIiwiaW5pdGlhbExvYWQiLCJFbmFibGVkIiwiX2Rpc2FibGVJbml0TG9hZCIsInNldFN1c3BlbmRTZWxlY3Rpb24iLCJfYXBwbHlBdXRvbWF0aWNhbGx5T25TdGFuZGFyZFZhcmlhbnQiLCJ2YXJpYW50TWFuYWdlbWVudElkIiwiZ2V0VmFyaWFudEJhY2tSZWZlcmVuY2UiLCJ2YXJpYW50TWFuYWdlbWVudCIsInJlZ2lzdGVyQXBwbHlBdXRvbWF0aWNhbGx5T25TdGFuZGFyZFZhcmlhbnQiLCJiaW5kIiwiX3NldFNoYXJlTW9kZWwiLCJmbkdldFVzZXIiLCJPYmplY3RQYXRoIiwiZ2V0Iiwib1NoYXJlSW5mbyIsImJvb2ttYXJrVGl0bGUiLCJkb2N1bWVudCIsImJvb2ttYXJrQ3VzdG9tVXJsIiwic0hhc2giLCJoYXNoZXIiLCJnZXRIYXNoIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaXNTaGFyZUluSmFtQWN0aXZlIiwiaXNKYW1BY3RpdmUiLCJvVGVtcGxhdGVQcml2YXRlTW9kZWwiLCJnZXRPd25lckNvbXBvbmVudCIsIm1DYWNoZSIsImlnbm9yZWRGaWVsZHMiLCJhQ2hhcnRzIiwic0NoYXJ0RW50aXR5UGF0aCIsInNDaGFydEVudGl0eVNldCIsInNDYWNoZUtleSIsImdldE5vdEFwcGxpY2FibGVGaWx0ZXJzIiwiX2lzRmlsdGVyQmFySGlkZGVuIiwiaGlkZUZpbHRlckJhciIsIlZhcmlhbnRNYW5hZ2VtZW50IiwidmFyaWFudHMiLCJnZXRWYXJpYW50cyIsImN1cnJlbnRWYXJpYW50IiwidmFyaWFudCIsImV4ZWN1dGVPblNlbGVjdCIsIkF1dG8iLCJnZXRTdGFuZGFyZFZhcmlhbnRLZXkiLCJnZXRDdXJyZW50VmFyaWFudEtleSIsIm9Db25kaXRpb25zIiwic3RhcnRzV2l0aCIsInN0YW5kYXJkVmFyaWFudCIsImlzVGFibGVCb3VuZCIsIm9Jbm5lckNoYXJ0IiwiZ2V0Q29udHJvbERlbGVnYXRlIiwiX2dldENoYXJ0IiwiaXNCb3VuZCIsImdldEJpbmRpbmdJbmZvIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJMaXN0UmVwb3J0Q29udHJvbGxlci5jb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBPYmplY3RQYXRoIGZyb20gXCJzYXAvYmFzZS91dGlsL09iamVjdFBhdGhcIjtcbmltcG9ydCB0eXBlIER5bmFtaWNQYWdlIGZyb20gXCJzYXAvZi9EeW5hbWljUGFnZVwiO1xuaW1wb3J0IEFjdGlvblJ1bnRpbWUgZnJvbSBcInNhcC9mZS9jb3JlL0FjdGlvblJ1bnRpbWVcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCBFZGl0RmxvdyBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvRWRpdEZsb3dcIjtcbmltcG9ydCBJbnRlbnRCYXNlZE5hdmlnYXRpb24gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0ludGVudEJhc2VkTmF2aWdhdGlvblwiO1xuaW1wb3J0IEludGVybmFsSW50ZW50QmFzZWROYXZpZ2F0aW9uIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9JbnRlcm5hbEludGVudEJhc2VkTmF2aWdhdGlvblwiO1xuaW1wb3J0IEludGVybmFsUm91dGluZyBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvSW50ZXJuYWxSb3V0aW5nXCI7XG5pbXBvcnQgS1BJTWFuYWdlbWVudCBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvS1BJTWFuYWdlbWVudFwiO1xuaW1wb3J0IE1hc3NFZGl0IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9NYXNzRWRpdFwiO1xuaW1wb3J0IFBsYWNlaG9sZGVyIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9QbGFjZWhvbGRlclwiO1xuaW1wb3J0IFNoYXJlIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9TaGFyZVwiO1xuaW1wb3J0IFNpZGVFZmZlY3RzIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9TaWRlRWZmZWN0c1wiO1xuaW1wb3J0IFZpZXdTdGF0ZSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvVmlld1N0YXRlXCI7XG5pbXBvcnQgdHlwZSBGaWx0ZXJCYXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xzL0ZpbHRlckJhclwiO1xuaW1wb3J0IHtcblx0ZGVmaW5lVUk1Q2xhc3MsXG5cdGV4dGVuc2libGUsXG5cdGZpbmFsRXh0ZW5zaW9uLFxuXHRwcml2YXRlRXh0ZW5zaW9uLFxuXHRwdWJsaWNFeHRlbnNpb24sXG5cdHVzaW5nRXh0ZW5zaW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IEVkaXRTdGF0ZSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9FZGl0U3RhdGVcIjtcbmltcG9ydCBNZXNzYWdlU3RyaXAgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTWVzc2FnZVN0cmlwXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZGVsQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgKiBhcyBTdGFibGVJZEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IENvcmVMaWJyYXJ5IGZyb20gXCJzYXAvZmUvY29yZS9saWJyYXJ5XCI7XG5pbXBvcnQgUGFnZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL1BhZ2VDb250cm9sbGVyXCI7XG5pbXBvcnQgQ2hhcnRSdW50aW1lIGZyb20gXCJzYXAvZmUvbWFjcm9zL2NoYXJ0L0NoYXJ0UnVudGltZVwiO1xuaW1wb3J0IENoYXJ0VXRpbHMgZnJvbSBcInNhcC9mZS9tYWNyb3MvY2hhcnQvQ2hhcnRVdGlsc1wiO1xuaW1wb3J0IENvbW1vbkhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9Db21tb25IZWxwZXJcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgRmlsdGVyVXRpbHMgZnJvbSBcInNhcC9mZS9tYWNyb3MvZmlsdGVyL0ZpbHRlclV0aWxzXCI7XG5pbXBvcnQgU2hhcmVBUEkgZnJvbSBcInNhcC9mZS9tYWNyb3Mvc2hhcmUvU2hhcmVBUElcIjtcbmltcG9ydCBUYWJsZUhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9UYWJsZUhlbHBlclwiO1xuaW1wb3J0IE11bHRpcGxlTW9kZUNvbnRyb2wgZnJvbSBcInNhcC9mZS90ZW1wbGF0ZXMvTGlzdFJlcG9ydC9jb250cm9scy9NdWx0aXBsZU1vZGVDb250cm9sXCI7XG5pbXBvcnQgRXh0ZW5zaW9uQVBJIGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL0xpc3RSZXBvcnQvRXh0ZW5zaW9uQVBJXCI7XG5pbXBvcnQgRWRpdEZsb3dPdmVycmlkZXMgZnJvbSBcInNhcC9mZS90ZW1wbGF0ZXMvUm9vdENvbnRhaW5lci9vdmVycmlkZXMvRWRpdEZsb3dcIjtcbmltcG9ydCBUYWJsZVNjcm9sbGVyIGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL1RhYmxlU2Nyb2xsZXJcIjtcbmltcG9ydCB0eXBlIFNlZ21lbnRlZEJ1dHRvbiBmcm9tIFwic2FwL20vU2VnbWVudGVkQnV0dG9uXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJzYXAvdWkvY29yZS9Db21wb25lbnRcIjtcbmltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCBPdmVycmlkZUV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL092ZXJyaWRlRXhlY3V0aW9uXCI7XG5pbXBvcnQgeyBzeXN0ZW0gfSBmcm9tIFwic2FwL3VpL0RldmljZVwiO1xuaW1wb3J0IFN0YXRlVXRpbCBmcm9tIFwic2FwL3VpL21kYy9wMTNuL1N0YXRlVXRpbFwiO1xuaW1wb3J0IHR5cGUgVGFibGUgZnJvbSBcInNhcC91aS9tZGMvVGFibGVcIjtcbmltcG9ydCB0eXBlIEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvcmVzb3VyY2UvUmVzb3VyY2VNb2RlbFwiO1xuaW1wb3J0IGhhc2hlciBmcm9tIFwic2FwL3VpL3RoaXJkcGFydHkvaGFzaGVyXCI7XG5pbXBvcnQgdHlwZSB7IFY0Q29udGV4dCB9IGZyb20gXCJ0eXBlcy9leHRlbnNpb25fdHlwZXNcIjtcbmltcG9ydCAqIGFzIExpc3RSZXBvcnRUZW1wbGF0aW5nIGZyb20gXCIuL0xpc3RSZXBvcnRUZW1wbGF0aW5nXCI7XG5pbXBvcnQgSW50ZW50QmFzZWROYXZpZ2F0aW9uT3ZlcnJpZGUgZnJvbSBcIi4vb3ZlcnJpZGVzL0ludGVudEJhc2VkTmF2aWdhdGlvblwiO1xuaW1wb3J0IFNoYXJlT3ZlcnJpZGVzIGZyb20gXCIuL292ZXJyaWRlcy9TaGFyZVwiO1xuaW1wb3J0IFZpZXdTdGF0ZU92ZXJyaWRlcyBmcm9tIFwiLi9vdmVycmlkZXMvVmlld1N0YXRlXCI7XG5cbmNvbnN0IFRlbXBsYXRlQ29udGVudFZpZXcgPSBDb3JlTGlicmFyeS5UZW1wbGF0ZUNvbnRlbnRWaWV3LFxuXHRJbml0aWFsTG9hZE1vZGUgPSBDb3JlTGlicmFyeS5Jbml0aWFsTG9hZE1vZGU7XG5cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS50ZW1wbGF0ZXMuTGlzdFJlcG9ydC5MaXN0UmVwb3J0Q29udHJvbGxlclwiKVxuY2xhc3MgTGlzdFJlcG9ydENvbnRyb2xsZXIgZXh0ZW5kcyBQYWdlQ29udHJvbGxlciB7XG5cdEB1c2luZ0V4dGVuc2lvbihcblx0XHRJbnRlcm5hbFJvdXRpbmcub3ZlcnJpZGUoe1xuXHRcdFx0b25BZnRlckJpbmRpbmc6IGZ1bmN0aW9uICh0aGlzOiBJbnRlcm5hbFJvdXRpbmcpIHtcblx0XHRcdFx0KHRoaXMuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBMaXN0UmVwb3J0Q29udHJvbGxlcikuX29uQWZ0ZXJCaW5kaW5nKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0KVxuXHRfcm91dGluZyE6IEludGVybmFsUm91dGluZztcblx0QHVzaW5nRXh0ZW5zaW9uKFxuXHRcdEludGVybmFsSW50ZW50QmFzZWROYXZpZ2F0aW9uLm92ZXJyaWRlKHtcblx0XHRcdGdldEVudGl0eVNldDogZnVuY3Rpb24gKHRoaXM6IEludGVybmFsSW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdHJldHVybiAodGhpcy5iYXNlIGFzIExpc3RSZXBvcnRDb250cm9sbGVyKS5nZXRDdXJyZW50RW50aXR5U2V0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0KVxuXHRfaW50ZW50QmFzZWROYXZpZ2F0aW9uITogSW50ZXJuYWxJbnRlbnRCYXNlZE5hdmlnYXRpb247XG5cdEB1c2luZ0V4dGVuc2lvbihTaWRlRWZmZWN0cylcblx0c2lkZUVmZmVjdHMhOiBTaWRlRWZmZWN0cztcblxuXHRAdXNpbmdFeHRlbnNpb24oSW50ZW50QmFzZWROYXZpZ2F0aW9uLm92ZXJyaWRlKEludGVudEJhc2VkTmF2aWdhdGlvbk92ZXJyaWRlKSlcblx0aW50ZW50QmFzZWROYXZpZ2F0aW9uITogSW50ZW50QmFzZWROYXZpZ2F0aW9uO1xuXG5cdEB1c2luZ0V4dGVuc2lvbihTaGFyZS5vdmVycmlkZShTaGFyZU92ZXJyaWRlcykpXG5cdHNoYXJlITogU2hhcmU7XG5cblx0QHVzaW5nRXh0ZW5zaW9uKEVkaXRGbG93Lm92ZXJyaWRlKEVkaXRGbG93T3ZlcnJpZGVzKSlcblx0ZWRpdEZsb3chOiBFZGl0RmxvdztcblxuXHRAdXNpbmdFeHRlbnNpb24oVmlld1N0YXRlLm92ZXJyaWRlKFZpZXdTdGF0ZU92ZXJyaWRlcykpXG5cdHZpZXdTdGF0ZSE6IFZpZXdTdGF0ZTtcblxuXHRAdXNpbmdFeHRlbnNpb24oS1BJTWFuYWdlbWVudClcblx0a3BpTWFuYWdlbWVudCE6IEtQSU1hbmFnZW1lbnQ7XG5cdEB1c2luZ0V4dGVuc2lvbihQbGFjZWhvbGRlcilcblx0cGxhY2Vob2xkZXIhOiBQbGFjZWhvbGRlcjtcblx0QHVzaW5nRXh0ZW5zaW9uKE1hc3NFZGl0KVxuXHRtYXNzRWRpdCE6IE1hc3NFZGl0O1xuXHRwcm90ZWN0ZWQgZXh0ZW5zaW9uQVBJPzogRXh0ZW5zaW9uQVBJO1xuXHRwcml2YXRlIGZpbHRlckJhckNvbmRpdGlvbnM/OiBhbnk7XG5cdHByaXZhdGUgc1VwZGF0ZVRpbWVyPzogYW55O1xuXHRwcml2YXRlIG9SZXNvdXJjZUJ1bmRsZT86IFJlc291cmNlQnVuZGxlO1xuXHRwcml2YXRlIGhhc1BlbmRpbmdDaGFydENoYW5nZXM/OiBib29sZWFuO1xuXHRwcml2YXRlIGhhc1BlbmRpbmdUYWJsZUNoYW5nZXM/OiBib29sZWFuO1xuXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRnZXRFeHRlbnNpb25BUEkoKTogRXh0ZW5zaW9uQVBJIHtcblx0XHRpZiAoIXRoaXMuZXh0ZW5zaW9uQVBJKSB7XG5cdFx0XHR0aGlzLmV4dGVuc2lvbkFQSSA9IG5ldyBFeHRlbnNpb25BUEkodGhpcyk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmV4dGVuc2lvbkFQSTtcblx0fVxuXG5cdG9uSW5pdCgpIHtcblx0XHRQYWdlQ29udHJvbGxlci5wcm90b3R5cGUub25Jbml0LmFwcGx5KHRoaXMpO1xuXHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJoYXNQZW5kaW5nRmlsdGVyc1wiLCB0cnVlKTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJhcHBsaWVkRmlsdGVyc1wiLCBcIlwiKTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJoaWRlRHJhZnRJbmZvXCIsIGZhbHNlKTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJ1b21cIiwge30pO1xuXHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInNjYWxlZmFjdG9yXCIsIHt9KTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJzY2FsZWZhY3Rvck51bWJlclwiLCB7fSk7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiY3VycmVuY3lcIiwge30pO1xuXG5cdFx0aWYgKHRoaXMuX2hhc011bHRpVmlzdWFsaXphdGlvbnMoKSkge1xuXHRcdFx0bGV0IGFscENvbnRlbnRWaWV3ID0gdGhpcy5fZ2V0RGVmYXVsdFBhdGgoKTtcblx0XHRcdGlmICghc3lzdGVtLmRlc2t0b3AgJiYgYWxwQ29udGVudFZpZXcgPT09IFRlbXBsYXRlQ29udGVudFZpZXcuSHlicmlkKSB7XG5cdFx0XHRcdGFscENvbnRlbnRWaWV3ID0gVGVtcGxhdGVDb250ZW50Vmlldy5DaGFydDtcblx0XHRcdH1cblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImFscENvbnRlbnRWaWV3XCIsIGFscENvbnRlbnRWaWV3KTtcblx0XHR9XG5cblx0XHQvLyBTdG9yZSBjb25kaXRpb25zIGZyb20gZmlsdGVyIGJhclxuXHRcdC8vIHRoaXMgaXMgbGF0ZXIgdXNlZCBiZWZvcmUgbmF2aWdhdGlvbiB0byBnZXQgY29uZGl0aW9ucyBhcHBsaWVkIG9uIHRoZSBmaWx0ZXIgYmFyXG5cdFx0dGhpcy5maWx0ZXJCYXJDb25kaXRpb25zID0ge307XG5cblx0XHQvLyBBcyBBcHBTdGF0ZUhhbmRsZXIuYXBwbHlBcHBTdGF0ZSB0cmlnZ2VycyBhIG5hdmlnYXRpb24gd2Ugd2FudCB0byBtYWtlIHN1cmUgaXQgd2lsbFxuXHRcdC8vIGhhcHBlbiBhZnRlciB0aGUgcm91dGVNYXRjaCBldmVudCBoYXMgYmVlbiBwcm9jZXNzZWQgKG90aGVyd2lzZSB0aGUgcm91dGVyIGdldHMgYnJva2VuKVxuXHRcdHRoaXMuZ2V0QXBwQ29tcG9uZW50KCkuZ2V0Um91dGVyUHJveHkoKS53YWl0Rm9yUm91dGVNYXRjaEJlZm9yZU5hdmlnYXRpb24oKTtcblxuXHRcdC8vIENvbmZpZ3VyZSB0aGUgaW5pdGlhbCBsb2FkIHNldHRpbmdzXG5cdFx0dGhpcy5fc2V0SW5pdExvYWQoKTtcblx0fVxuXG5cdG9uRXhpdCgpIHtcblx0XHRkZWxldGUgdGhpcy5maWx0ZXJCYXJDb25kaXRpb25zO1xuXHRcdGlmICh0aGlzLmV4dGVuc2lvbkFQSSkge1xuXHRcdFx0dGhpcy5leHRlbnNpb25BUEkuZGVzdHJveSgpO1xuXHRcdH1cblx0XHRkZWxldGUgdGhpcy5leHRlbnNpb25BUEk7XG5cdH1cblxuXHRfb25BZnRlckJpbmRpbmcoKSB7XG5cdFx0Y29uc3QgYVRhYmxlcyA9IHRoaXMuX2dldENvbnRyb2xzKFwidGFibGVcIik7XG5cdFx0aWYgKEVkaXRTdGF0ZS5pc0VkaXRTdGF0ZURpcnR5KCkpIHtcblx0XHRcdHRoaXMuX2dldE11bHRpTW9kZUNvbnRyb2woKT8uaW52YWxpZGF0ZUNvbnRlbnQoKTtcblx0XHRcdGNvbnN0IG9UYWJsZUJpbmRpbmcgPSB0aGlzLl9nZXRUYWJsZSgpPy5nZXRSb3dCaW5kaW5nKCk7XG5cdFx0XHRpZiAob1RhYmxlQmluZGluZykge1xuXHRcdFx0XHRpZiAoQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuZ2V0VmlldygpKS5faXNGY2xFbmFibGVkKCkpIHtcblx0XHRcdFx0XHQvLyB0aGVyZSBpcyBhbiBpc3N1ZSBpZiB3ZSB1c2UgYSB0aW1lb3V0IHdpdGggYSBrZXB0IGFsaXZlIGNvbnRleHQgdXNlZCBvbiBhbm90aGVyIHBhZ2Vcblx0XHRcdFx0XHRvVGFibGVCaW5kaW5nLnJlZnJlc2goKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIXRoaXMuc1VwZGF0ZVRpbWVyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNVcGRhdGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRvVGFibGVCaW5kaW5nLnJlZnJlc2goKTtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuc1VwZGF0ZVRpbWVyO1xuXHRcdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIGFjdGlvbiBlbmFibGVtZW50IGFuZCB2aXNpYmlsaXR5IHVwb24gdGFibGUgZGF0YSB1cGRhdGUuXG5cdFx0XHRcdFx0Y29uc3QgZm5VcGRhdGVUYWJsZUFjdGlvbnMgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl91cGRhdGVUYWJsZUFjdGlvbnMoYVRhYmxlcyk7XG5cdFx0XHRcdFx0XHRvVGFibGVCaW5kaW5nLmRldGFjaERhdGFSZWNlaXZlZChmblVwZGF0ZVRhYmxlQWN0aW9ucyk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRvVGFibGVCaW5kaW5nLmF0dGFjaERhdGFSZWNlaXZlZChmblVwZGF0ZVRhYmxlQWN0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdEVkaXRTdGF0ZS5zZXRFZGl0U3RhdGVQcm9jZXNzZWQoKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuc1VwZGF0ZVRpbWVyKSB7XG5cdFx0XHR0aGlzLl91cGRhdGVUYWJsZUFjdGlvbnMoYVRhYmxlcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5wYWdlUmVhZHkud2FpdEZvcih0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldEFwcFN0YXRlSGFuZGxlcigpLmFwcGx5QXBwU3RhdGUoKSk7XG5cdH1cblxuXHRvbkJlZm9yZVJlbmRlcmluZygpIHtcblx0XHRQYWdlQ29udHJvbGxlci5wcm90b3R5cGUub25CZWZvcmVSZW5kZXJpbmcuYXBwbHkodGhpcyk7XG5cdH1cblxuXHRvbkFmdGVyUmVuZGVyaW5nKCkge1xuXHRcdCgodGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJzYXAuZmUuaTE4blwiKSBhcyBSZXNvdXJjZU1vZGVsKS5nZXRSZXNvdXJjZUJ1bmRsZSgpIGFzIFByb21pc2U8UmVzb3VyY2VCdW5kbGU+KVxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlOiBhbnkpID0+IHtcblx0XHRcdFx0dGhpcy5vUmVzb3VyY2VCdW5kbGUgPSByZXNwb25zZTtcblx0XHRcdFx0Y29uc3QgYVRhYmxlcyA9IHRoaXMuX2dldENvbnRyb2xzKCkgYXMgVGFibGVbXTtcblx0XHRcdFx0Y29uc3Qgc0VudGl0eVNldCA9ICh0aGlzLmdldFZpZXcoKS5nZXRWaWV3RGF0YSgpIGFzIGFueSkuZW50aXR5U2V0O1xuXHRcdFx0XHRjb25zdCBzVGV4dCA9IENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFwiVF9UQUJMRV9BTkRfQ0hBUlRfTk9fREFUQV9URVhUXCIsXG5cdFx0XHRcdFx0dGhpcy5vUmVzb3VyY2VCdW5kbGUgYXMgUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdHNFbnRpdHlTZXRcblx0XHRcdFx0KTtcblx0XHRcdFx0YVRhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uIChvVGFibGU6IFRhYmxlKSB7XG5cdFx0XHRcdFx0b1RhYmxlLnNldE5vRGF0YShzVGV4dCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgcmV0cmlldmluZyB0aGUgcmVzb3VyY2UgYnVuZGxlXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdG9uUGFnZVJlYWR5KG1QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHRpZiAobVBhcmFtZXRlcnMuZm9yY2VGb2N1cykge1xuXHRcdFx0dGhpcy5fc2V0SW5pdGlhbEZvY3VzKCk7XG5cdFx0fVxuXHRcdC8vIFJlbW92ZSB0aGUgaGFuZGxlciBvbiBiYWNrIG5hdmlnYXRpb24gdGhhdCBkaXNwbGF5cyBEcmFmdCBjb25maXJtYXRpb25cblx0XHR0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldFNoZWxsU2VydmljZXMoKS5zZXRCYWNrTmF2aWdhdGlvbih1bmRlZmluZWQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBvZiBhIGxpc3QgcmVwb3J0IHZpZXcgbmVlZHMgdG8gYmUgcmVmcmVzaGVkLlxuXHQgKiBUaGlzIGhhcHBlbnMgZWl0aGVyIHdoZW4gdGhlcmUgaXMgYSBjaGFuZ2Ugb24gdGhlIEZpbHRlckJhciBhbmQgdGhlIHNlYXJjaCBpcyB0cmlnZ2VyZWQsXG5cdCAqIG9yIHdoZW4gYSB0YWIgd2l0aCBjdXN0b20gY29udGVudCBpcyBzZWxlY3RlZC5cblx0ICogVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBjb250cm9sbGVyIGV4dGVuc2lvbiBpbiBjYXNlIG9mIGN1c3RvbWl6YXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBtUGFyYW1ldGVycyBNYXAgY29udGFpbmluZyB0aGUgZmlsdGVyIGNvbmRpdGlvbnMgb2YgdGhlIEZpbHRlckJhciwgdGhlIGN1cnJlbnRUYWJJRFxuXHQgKiBhbmQgdGhlIHZpZXcgcmVmcmVzaCBjYXVzZSAodGFiQ2hhbmdlZCBvciBzZWFyY2gpLlxuXHQgKiBUaGUgbWFwIGxvb2tzIGxpa2UgdGhpczpcblx0ICogPGNvZGU+PHByZT5cblx0ICogXHR7XG5cdCAqIFx0XHRmaWx0ZXJDb25kaXRpb25zOiB7XG5cdCAqIFx0XHRcdENvdW50cnk6IFtcblx0ICogXHRcdFx0XHR7XG5cdCAqIFx0XHRcdFx0XHRvcGVyYXRvcjogXCJFUVwiXG5cdCAqXHRcdFx0XHRcdHZhbGlkYXRlZDogXCJOb3RWYWxpZGF0ZWRcIlxuXHQgKlx0XHRcdFx0XHR2YWx1ZXM6IFtcIkdlcm1hbnlcIiwgLi4uXVxuXHQgKiBcdFx0XHRcdH0sXG5cdCAqIFx0XHRcdFx0Li4uXG5cdCAqIFx0XHRcdF1cblx0ICogXHRcdFx0Li4uXG5cdCAqIFx0XHR9LFxuXHQgKlx0XHRjdXJyZW50VGFiSWQ6IFwiZmU6OkN1c3RvbVRhYjo6dGFiMVwiLFxuXHQgKlx0XHRyZWZyZXNoQ2F1c2U6IFwidGFiQ2hhbmdlZFwiIHwgXCJzZWFyY2hcIlxuXHQgKlx0fVxuXHQgKiA8L3ByZT48L2NvZGU+XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRvblZpZXdOZWVkc1JlZnJlc2gobVBhcmFtZXRlcnM6IGFueSkge1xuXHRcdC8qIFRvIGJlIG92ZXJyaWRlbiAqL1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCBjYWxsZWQgd2hlbiBhIGZpbHRlciBvciBzZWFyY2ggdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCBpbiB0aGUgRmlsdGVyQmFyLFxuXHQgKiBidXQgaGFzIG5vdCBiZWVuIHZhbGlkYXRlZCB5ZXQgYnkgdGhlIGVuZCB1c2VyICh3aXRoIHRoZSAnR28nIG9yICdTZWFyY2gnIGJ1dHRvbikuXG5cdCAqIFR5cGljYWxseSwgdGhlIGNvbnRlbnQgb2YgdGhlIGN1cnJlbnQgdGFiIGlzIGdyZXllZCBvdXQgdW50aWwgdGhlIGZpbHRlcnMgYXJlIHZhbGlkYXRlZC5cblx0ICogVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBjb250cm9sbGVyIGV4dGVuc2lvbiBpbiBjYXNlIG9mIGN1c3RvbWl6YXRpb24uXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0b25QZW5kaW5nRmlsdGVycygpIHtcblx0XHQvKiBUbyBiZSBvdmVycmlkZW4gKi9cblx0fVxuXG5cdGdldEN1cnJlbnRFbnRpdHlTZXQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldFRhYmxlKCk/LmRhdGEoXCJ0YXJnZXRDb2xsZWN0aW9uUGF0aFwiKS5zbGljZSgxKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBpbml0aWF0ZXMgdGhlIHVwZGF0ZSBvZiB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgRGF0YUZpZWxkRm9yQWN0aW9uIGFuZCB0aGUgdmlzaWJsZSBzdGF0ZSBvZiB0aGUgRGF0YUZpZWxkRm9ySUJOIGJ1dHRvbnMuXG5cdCAqXG5cdCAqIEBwYXJhbSBhVGFibGVzIEFycmF5IG9mIHRhYmxlcyBpbiB0aGUgbGlzdCByZXBvcnRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF91cGRhdGVUYWJsZUFjdGlvbnMoYVRhYmxlczogYW55KSB7XG5cdFx0bGV0IGFJQk5BY3Rpb25zOiBhbnlbXSA9IFtdO1xuXHRcdGFUYWJsZXMuZm9yRWFjaChmdW5jdGlvbiAob1RhYmxlOiBhbnkpIHtcblx0XHRcdGFJQk5BY3Rpb25zID0gQ29tbW9uVXRpbHMuZ2V0SUJOQWN0aW9ucyhvVGFibGUsIGFJQk5BY3Rpb25zKTtcblx0XHRcdC8vIFVwZGF0ZSAnZW5hYmxlZCcgcHJvcGVydHkgb2YgRGF0YUZpZWxkRm9yQWN0aW9uIGJ1dHRvbnMgb24gdGFibGUgdG9vbGJhclxuXHRcdFx0Ly8gVGhlIHNhbWUgaXMgYWxzbyBwZXJmb3JtZWQgb24gVGFibGUgc2VsZWN0aW9uQ2hhbmdlIGV2ZW50XG5cdFx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvVGFibGUuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSxcblx0XHRcdFx0b0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZU1hcCA9IEpTT04ucGFyc2UoXG5cdFx0XHRcdFx0Q29tbW9uSGVscGVyLnBhcnNlQ3VzdG9tRGF0YShEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwib3BlcmF0aW9uQXZhaWxhYmxlTWFwXCIpKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhU2VsZWN0ZWRDb250ZXh0cyA9IG9UYWJsZS5nZXRTZWxlY3RlZENvbnRleHRzKCk7XG5cblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInNlbGVjdGVkQ29udGV4dHNcIiwgYVNlbGVjdGVkQ29udGV4dHMpO1xuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwibnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzXCIsIGFTZWxlY3RlZENvbnRleHRzLmxlbmd0aCk7XG5cdFx0XHRUYWJsZUhlbHBlci5oYW5kbGVUYWJsZURlbGV0ZUVuYWJsZW1lbnRGb3JTaWRlRWZmZWN0cyhvVGFibGUsIG9JbnRlcm5hbE1vZGVsQ29udGV4dCk7XG5cdFx0XHRBY3Rpb25SdW50aW1lLnNldEFjdGlvbkVuYWJsZW1lbnQob0ludGVybmFsTW9kZWxDb250ZXh0LCBvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlTWFwLCBhU2VsZWN0ZWRDb250ZXh0cywgXCJ0YWJsZVwiKTtcblx0XHR9KTtcblx0XHRDb21tb25VdGlscy51cGRhdGVEYXRhRmllbGRGb3JJQk5CdXR0b25zVmlzaWJpbGl0eShhSUJOQWN0aW9ucywgdGhpcy5nZXRWaWV3KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIHNjcm9sbHMgdG8gYSBzcGVjaWZpYyByb3cgb24gYWxsIHRoZSBhdmFpbGFibGUgdGFibGVzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgc2FwLmZlLnRlbXBsYXRlcy5MaXN0UmVwb3J0Lkxpc3RSZXBvcnRDb250cm9sbGVyLmNvbnRyb2xsZXIjX3Njcm9sbFRhYmxlc1RvUm93XG5cdCAqIEBwYXJhbSBzUm93UGF0aCBUaGUgcGF0aCBvZiB0aGUgdGFibGUgcm93IGNvbnRleHQgdG8gYmUgc2Nyb2xsZWQgdG9cblx0ICovXG5cdF9zY3JvbGxUYWJsZXNUb1JvdyhzUm93UGF0aDogc3RyaW5nKSB7XG5cdFx0dGhpcy5fZ2V0Q29udHJvbHMoXCJ0YWJsZVwiKS5mb3JFYWNoKGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdFx0VGFibGVTY3JvbGxlci5zY3JvbGxUYWJsZVRvUm93KG9UYWJsZSwgc1Jvd1BhdGgpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIHNldCB0aGUgaW5pdGlhbCBmb2N1cyB3aXRoaW4gdGhlIExpc3QgUmVwb3J0IGFjY29yZGluZyB0byB0aGUgVVggZ3VpZGUgbGluZXMuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBzYXAuZmUudGVtcGxhdGVzLkxpc3RSZXBvcnQuTGlzdFJlcG9ydENvbnRyb2xsZXIuY29udHJvbGxlciNfc2V0SW5pdGlhbEZvY3VzXG5cdCAqL1xuXHRfc2V0SW5pdGlhbEZvY3VzKCkge1xuXHRcdGNvbnN0IGR5bmFtaWNQYWdlID0gdGhpcy5fZ2V0RHluYW1pY0xpc3RSZXBvcnRDb250cm9sKCksXG5cdFx0XHRpc0hlYWRlckV4cGFuZGVkID0gZHluYW1pY1BhZ2UuZ2V0SGVhZGVyRXhwYW5kZWQoKSxcblx0XHRcdGZpbHRlckJhciA9IHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKSBhcyBhbnk7XG5cdFx0aWYgKGZpbHRlckJhcikge1xuXHRcdFx0aWYgKGlzSGVhZGVyRXhwYW5kZWQpIHtcblx0XHRcdFx0Ly9FbmFibGluZyBtYW5kYXRvcnkgZmlsdGVyIGZpZWxkcyBtZXNzYWdlIGRpYWxvZ1xuXHRcdFx0XHRpZiAoIWZpbHRlckJhci5nZXRTaG93TWVzc2FnZXMoKSkge1xuXHRcdFx0XHRcdGZpbHRlckJhci5zZXRTaG93TWVzc2FnZXModHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgZmlyc3RFbXB0eU1hbmRhdG9yeUZpZWxkID0gZmlsdGVyQmFyLmdldEZpbHRlckl0ZW1zKCkuZmluZChmdW5jdGlvbiAob0ZpbHRlckl0ZW06IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBvRmlsdGVySXRlbS5nZXRSZXF1aXJlZCgpICYmIG9GaWx0ZXJJdGVtLmdldENvbmRpdGlvbnMoKS5sZW5ndGggPT09IDA7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL0ZvY3VzaW5nIG9uIHRoZSBmaXJzdCBlbXB0eSBtYW5kYXRvcnkgZmlsdGVyIGZpZWxkLCBvciBvbiB0aGUgZmlyc3QgZmlsdGVyIGZpZWxkIGlmIHRoZSB0YWJsZSBkYXRhIGlzIGxvYWRlZFxuXHRcdFx0XHRpZiAoZmlyc3RFbXB0eU1hbmRhdG9yeUZpZWxkKSB7XG5cdFx0XHRcdFx0Zmlyc3RFbXB0eU1hbmRhdG9yeUZpZWxkLmZvY3VzKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5faXNJbml0TG9hZEVuYWJsZWQoKSkge1xuXHRcdFx0XHRcdGZpbHRlckJhci5nZXRGaWx0ZXJJdGVtcygpWzBdLmZvY3VzKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9Gb2N1c2luZyBvbiB0aGUgR28gYnV0dG9uXG5cdFx0XHRcdFx0dGhpcy5nZXRWaWV3KCkuYnlJZChgJHt0aGlzLl9nZXRGaWx0ZXJCYXJDb250cm9sSWQoKX0tYnRuU2VhcmNoYCkuZm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9pc0luaXRMb2FkRW5hYmxlZCgpKSB7XG5cdFx0XHRcdHRoaXMuX2dldFRhYmxlKCk/LmZvY3VzUm93KDApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9nZXRUYWJsZSgpPy5mb2N1c1JvdygwKTtcblx0XHR9XG5cdH1cblxuXHRfZ2V0UGFnZVRpdGxlSW5mb3JtYXRpb24oKSB7XG5cdFx0Y29uc3Qgb01hbmlmZXN0RW50cnkgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldE1hbmlmZXN0RW50cnkoXCJzYXAuYXBwXCIpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZTogb01hbmlmZXN0RW50cnkudGl0bGUsXG5cdFx0XHRzdWJ0aXRsZTogb01hbmlmZXN0RW50cnkuYXBwU3ViVGl0bGUgfHwgXCJcIixcblx0XHRcdGludGVudDogXCJcIixcblx0XHRcdGljb246IFwiXCJcblx0XHR9O1xuXHR9XG5cblx0X2dldEZpbHRlckJhckNvbnRyb2woKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VmlldygpLmJ5SWQodGhpcy5fZ2V0RmlsdGVyQmFyQ29udHJvbElkKCkpIGFzIEZpbHRlckJhcjtcblx0fVxuXG5cdF9nZXREeW5hbWljTGlzdFJlcG9ydENvbnRyb2woKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VmlldygpLmJ5SWQodGhpcy5fZ2V0RHluYW1pY0xpc3RSZXBvcnRDb250cm9sSWQoKSkgYXMgRHluYW1pY1BhZ2U7XG5cdH1cblxuXHRfZ2V0QWRhcHRhdGlvbkZpbHRlckJhckNvbnRyb2woKSB7XG5cdFx0Ly8gSWYgdGhlIGFkYXB0YXRpb24gZmlsdGVyIGJhciBpcyBwYXJ0IG9mIHRoZSBET00gdHJlZSwgdGhlIFwiQWRhcHQgRmlsdGVyXCIgZGlhbG9nIGlzIG9wZW4sXG5cdFx0Ly8gYW5kIHdlIHJldHVybiB0aGUgYWRhcHRhdGlvbiBmaWx0ZXIgYmFyIGFzIGFuIGFjdGl2ZSBjb250cm9sICh2aXNpYmxlIGZvciB0aGUgdXNlcilcblx0XHRjb25zdCBhZGFwdGF0aW9uRmlsdGVyQmFyID0gKHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKSBhcyBhbnkpLmdldEluYnVpbHRGaWx0ZXIoKTtcblx0XHRyZXR1cm4gYWRhcHRhdGlvbkZpbHRlckJhcj8uZ2V0UGFyZW50KCkgPyBhZGFwdGF0aW9uRmlsdGVyQmFyIDogdW5kZWZpbmVkO1xuXHR9XG5cblx0X2dldFNlZ21lbnRlZEJ1dHRvbihzQ29udHJvbDogYW55KSB7XG5cdFx0Y29uc3Qgc1NlZ21lbnRlZEJ1dHRvbklkID0gKHNDb250cm9sID09PSBcIkNoYXJ0XCIgPyB0aGlzLmdldENoYXJ0Q29udHJvbCgpIDogdGhpcy5fZ2V0VGFibGUoKSk/LmRhdGEoXCJzZWdtZW50ZWRCdXR0b25JZFwiKTtcblx0XHRyZXR1cm4gdGhpcy5nZXRWaWV3KCkuYnlJZChzU2VnbWVudGVkQnV0dG9uSWQpO1xuXHR9XG5cblx0X2dldENvbnRyb2xGcm9tUGFnZU1vZGVsUHJvcGVydHkoc1BhdGg6IHN0cmluZykge1xuXHRcdGNvbnN0IGNvbnRyb2xJZCA9IHRoaXMuX2dldFBhZ2VNb2RlbCgpPy5nZXRQcm9wZXJ0eShzUGF0aCk7XG5cdFx0cmV0dXJuIGNvbnRyb2xJZCAmJiB0aGlzLmdldFZpZXcoKS5ieUlkKGNvbnRyb2xJZCk7XG5cdH1cblxuXHRfZ2V0UGFnZU1vZGVsKCk6IEpTT05Nb2RlbCB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgcGFnZUNvbXBvbmVudCA9IENvbXBvbmVudC5nZXRPd25lckNvbXBvbmVudEZvcih0aGlzLmdldFZpZXcoKSkgYXMgYW55O1xuXHRcdHJldHVybiBwYWdlQ29tcG9uZW50LmdldE1vZGVsKFwiX3BhZ2VNb2RlbFwiKTtcblx0fVxuXG5cdF9nZXREeW5hbWljTGlzdFJlcG9ydENvbnRyb2xJZCgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9nZXRQYWdlTW9kZWwoKT8uZ2V0UHJvcGVydHkoXCIvZHluYW1pY0xpc3RSZXBvcnRJZFwiKSB8fCBcIlwiO1xuXHR9XG5cblx0X2dldEZpbHRlckJhckNvbnRyb2xJZCgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9nZXRQYWdlTW9kZWwoKT8uZ2V0UHJvcGVydHkoXCIvZmlsdGVyQmFySWRcIikgfHwgXCJcIjtcblx0fVxuXG5cdGdldENoYXJ0Q29udHJvbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0Q29udHJvbEZyb21QYWdlTW9kZWxQcm9wZXJ0eShcIi9zaW5nbGVDaGFydElkXCIpO1xuXHR9XG5cblx0X2dldFZpc3VhbEZpbHRlckJhckNvbnRyb2woKSB7XG5cdFx0Y29uc3Qgc1Zpc3VhbEZpbHRlckJhcklkID0gU3RhYmxlSWRIZWxwZXIuZ2VuZXJhdGUoW1widmlzdWFsRmlsdGVyXCIsIHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2xJZCgpXSk7XG5cdFx0cmV0dXJuIHNWaXN1YWxGaWx0ZXJCYXJJZCAmJiB0aGlzLmdldFZpZXcoKS5ieUlkKHNWaXN1YWxGaWx0ZXJCYXJJZCk7XG5cdH1cblx0X2dldEZpbHRlckJhclZhcmlhbnRDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLl9nZXRDb250cm9sRnJvbVBhZ2VNb2RlbFByb3BlcnR5KFwiL3ZhcmlhbnRNYW5hZ2VtZW50L2lkXCIpO1xuXHR9XG5cblx0X2dldE11bHRpTW9kZUNvbnRyb2woKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VmlldygpLmJ5SWQoXCJmZTo6VGFiTXVsdGlwbGVNb2RlOjpDb250cm9sXCIpIGFzIE11bHRpcGxlTW9kZUNvbnRyb2w7XG5cdH1cblxuXHRfZ2V0VGFibGUoKTogVGFibGUgfCB1bmRlZmluZWQge1xuXHRcdGlmICh0aGlzLl9pc011bHRpTW9kZSgpKSB7XG5cdFx0XHRjb25zdCBvQ29udHJvbCA9IHRoaXMuX2dldE11bHRpTW9kZUNvbnRyb2woKT8uZ2V0U2VsZWN0ZWRJbm5lckNvbnRyb2woKT8uY29udGVudDtcblx0XHRcdHJldHVybiBvQ29udHJvbD8uaXNBKFwic2FwLnVpLm1kYy5UYWJsZVwiKSA/IChvQ29udHJvbCBhcyBUYWJsZSkgOiB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9nZXRDb250cm9sRnJvbVBhZ2VNb2RlbFByb3BlcnR5KFwiL3NpbmdsZVRhYmxlSWRcIikgYXMgVGFibGU7XG5cdFx0fVxuXHR9XG5cdF9nZXRDb250cm9scyhzS2V5PzogYW55KSB7XG5cdFx0aWYgKHRoaXMuX2lzTXVsdGlNb2RlKCkpIHtcblx0XHRcdGNvbnN0IGFDb250cm9sczogYW55W10gPSBbXTtcblx0XHRcdGNvbnN0IG9UYWJNdWx0aU1vZGUgPSB0aGlzLl9nZXRNdWx0aU1vZGVDb250cm9sKCkuY29udGVudDtcblx0XHRcdG9UYWJNdWx0aU1vZGUuZ2V0SXRlbXMoKS5mb3JFYWNoKChvSXRlbTogYW55KSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9Db250cm9sID0gdGhpcy5nZXRWaWV3KCkuYnlJZChvSXRlbS5nZXRLZXkoKSk7XG5cdFx0XHRcdGlmIChvQ29udHJvbCAmJiBzS2V5KSB7XG5cdFx0XHRcdFx0aWYgKG9JdGVtLmdldEtleSgpLmluZGV4T2YoYGZlOjoke3NLZXl9YCkgPiAtMSkge1xuXHRcdFx0XHRcdFx0YUNvbnRyb2xzLnB1c2gob0NvbnRyb2wpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChvQ29udHJvbCAhPT0gdW5kZWZpbmVkICYmIG9Db250cm9sICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0YUNvbnRyb2xzLnB1c2gob0NvbnRyb2wpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBhQ29udHJvbHM7XG5cdFx0fSBlbHNlIGlmIChzS2V5ID09PSBcIkNoYXJ0XCIpIHtcblx0XHRcdGNvbnN0IG9DaGFydCA9IHRoaXMuZ2V0Q2hhcnRDb250cm9sKCk7XG5cdFx0XHRyZXR1cm4gb0NoYXJ0ID8gW29DaGFydF0gOiBbXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3Qgb1RhYmxlID0gdGhpcy5fZ2V0VGFibGUoKTtcblx0XHRcdHJldHVybiBvVGFibGUgPyBbb1RhYmxlXSA6IFtdO1xuXHRcdH1cblx0fVxuXG5cdF9nZXREZWZhdWx0UGF0aCgpIHtcblx0XHRjb25zdCBkZWZhdWx0UGF0aCA9IExpc3RSZXBvcnRUZW1wbGF0aW5nLmdldERlZmF1bHRQYXRoKHRoaXMuX2dldFBhZ2VNb2RlbCgpPy5nZXRQcm9wZXJ0eShcIi92aWV3c1wiKSB8fCBbXSk7XG5cdFx0c3dpdGNoIChkZWZhdWx0UGF0aCkge1xuXHRcdFx0Y2FzZSBcInByaW1hcnlcIjpcblx0XHRcdFx0cmV0dXJuIFRlbXBsYXRlQ29udGVudFZpZXcuQ2hhcnQ7XG5cdFx0XHRjYXNlIFwic2Vjb25kYXJ5XCI6XG5cdFx0XHRcdHJldHVybiBUZW1wbGF0ZUNvbnRlbnRWaWV3LlRhYmxlO1xuXHRcdFx0Y2FzZSBcImJvdGhcIjpcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBUZW1wbGF0ZUNvbnRlbnRWaWV3Lkh5YnJpZDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGtub3cgaWYgTGlzdFJlcG9ydCBpcyBjb25maWd1cmVkIHdpdGggTXVsdGlwbGUgVGFibGUgbW9kZS5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9pc011bHRpTW9kZVxuXHQgKiBAcmV0dXJucyBJcyBNdWx0aXBsZSBUYWJsZSBtb2RlIHNldD9cblx0ICovXG5cdF9pc011bHRpTW9kZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gISF0aGlzLl9nZXRQYWdlTW9kZWwoKT8uZ2V0UHJvcGVydHkoXCIvbXVsdGlWaWV3c0NvbnRyb2xcIik7XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGtub3cgaWYgTGlzdFJlcG9ydCBpcyBjb25maWd1cmVkIHRvIGxvYWQgZGF0YSBhdCBzdGFydCB1cC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9pc0luaXRMb2FkRGlzYWJsZWRcblx0ICogQHJldHVybnMgSXMgSW5pdExvYWQgZW5hYmxlZD9cblx0ICovXG5cdF9pc0luaXRMb2FkRW5hYmxlZCgpOiBib29sZWFuIHtcblx0XHRjb25zdCBpbml0TG9hZE1vZGUgPSAodGhpcy5nZXRWaWV3KCkuZ2V0Vmlld0RhdGEoKSBhcyBhbnkpLmluaXRpYWxMb2FkO1xuXHRcdHJldHVybiBpbml0TG9hZE1vZGUgPT09IEluaXRpYWxMb2FkTW9kZS5FbmFibGVkO1xuXHR9XG5cblx0X2hhc011bHRpVmlzdWFsaXphdGlvbnMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldFBhZ2VNb2RlbCgpPy5nZXRQcm9wZXJ0eShcIi9oYXNNdWx0aVZpc3VhbGl6YXRpb25zXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byBzdXNwZW5kIHNlYXJjaCBvbiB0aGUgZmlsdGVyIGJhci4gVGhlIGluaXRpYWwgbG9hZGluZyBvZiBkYXRhIGlzIGRpc2FibGVkIGJhc2VkIG9uIHRoZSBtYW5pZmVzdCBjb25maWd1cmF0aW9uIEluaXRMb2FkIC0gRGlzYWJsZWQvQXV0by5cblx0ICogSXQgaXMgZW5hYmxlZCBsYXRlciB3aGVuIHRoZSB2aWV3IHN0YXRlIGlzIHNldCwgd2hlbiBpdCBpcyBwb3NzaWJsZSB0byByZWFsaXplIGlmIHRoZXJlIGFyZSBkZWZhdWx0IGZpbHRlcnMuXG5cdCAqL1xuXHRfZGlzYWJsZUluaXRMb2FkKCkge1xuXHRcdGNvbnN0IGZpbHRlckJhciA9IHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHQvLyBjaGVjayBmb3IgZmlsdGVyIGJhciBoaWRkZW5cblx0XHRpZiAoZmlsdGVyQmFyKSB7XG5cdFx0XHRmaWx0ZXJCYXIuc2V0U3VzcGVuZFNlbGVjdGlvbih0cnVlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIGNhbGxlZCBieSBmbGV4IHRvIGRldGVybWluZSBpZiB0aGUgYXBwbHlBdXRvbWF0aWNhbGx5IHNldHRpbmcgb24gdGhlIHZhcmlhbnQgaXMgdmFsaWQuXG5cdCAqIENhbGxlZCBvbmx5IGZvciBTdGFuZGFyZCBWYXJpYW50IGFuZCBvbmx5IHdoZW4gdGhlcmUgaXMgZGlzcGxheSB0ZXh0IHNldCBmb3IgYXBwbHlBdXRvbWF0aWNhbGx5IChGRSBvbmx5IHNldHMgaXQgZm9yIEF1dG8pLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBCb29sZWFuIHRydWUgaWYgZGF0YSBzaG91bGQgYmUgbG9hZGVkIGF1dG9tYXRpY2FsbHksIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0X2FwcGx5QXV0b21hdGljYWxseU9uU3RhbmRhcmRWYXJpYW50KCkge1xuXHRcdC8vIFdlIGFsd2F5cyByZXR1cm4gZmFsc2UgYW5kIHRha2UgY2FyZSBvZiBpdCB3aGVuIHZpZXcgc3RhdGUgaXMgc2V0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbmZpZ3VyZSB0aGUgc2V0dGluZ3MgZm9yIGluaXRpYWwgbG9hZCBiYXNlZCBvblxuXHQgKiAtIG1hbmlmZXN0IHNldHRpbmcgaW5pdExvYWQgLSBFbmFibGVkL0Rpc2FibGVkL0F1dG9cblx0ICogLSB1c2VyJ3Mgc2V0dGluZyBvZiBhcHBseUF1dG9tYXRpY2FsbHkgb24gdmFyaWFudFxuXHQgKiAtIGlmIHRoZXJlIGFyZSBkZWZhdWx0IGZpbHRlcnNcblx0ICogV2UgZGlzYWJsZSB0aGUgZmlsdGVyIGJhciBzZWFyY2ggYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5hYmxlIGl0IHdoZW4gdmlldyBzdGF0ZSBpcyBzZXQuXG5cdCAqL1xuXHRfc2V0SW5pdExvYWQoKSB7XG5cdFx0Ly8gaWYgaW5pdExvYWQgaXMgRGlzYWJsZWQgb3IgQXV0bywgc3dpdGNoIG9mZiBmaWx0ZXIgYmFyIHNlYXJjaCB0ZW1wb3JhcmlseSBhdCBzdGFydFxuXHRcdGlmICghdGhpcy5faXNJbml0TG9hZEVuYWJsZWQoKSkge1xuXHRcdFx0dGhpcy5fZGlzYWJsZUluaXRMb2FkKCk7XG5cdFx0fVxuXHRcdC8vIHNldCBob29rIGZvciBmbGV4IGZvciB3aGVuIHN0YW5kYXJkIHZhcmlhbnQgaXMgc2V0IChhdCBzdGFydCBvciBieSB1c2VyIGF0IHJ1bnRpbWUpXG5cdFx0Ly8gcmVxdWlyZWQgdG8gb3ZlcnJpZGUgdGhlIHVzZXIgc2V0dGluZyAnYXBwbHkgYXV0b21hdGljYWxseScgYmVoYXZpb3VyIGlmIHRoZXJlIGFyZSBubyBmaWx0ZXJzXG5cdFx0Y29uc3QgdmFyaWFudE1hbmFnZW1lbnRJZDogYW55ID0gTGlzdFJlcG9ydFRlbXBsYXRpbmcuZ2V0VmFyaWFudEJhY2tSZWZlcmVuY2UodGhpcy5nZXRWaWV3KCkuZ2V0Vmlld0RhdGEoKSwgdGhpcy5fZ2V0UGFnZU1vZGVsKCkpO1xuXHRcdGNvbnN0IHZhcmlhbnRNYW5hZ2VtZW50ID0gdmFyaWFudE1hbmFnZW1lbnRJZCAmJiB0aGlzLmdldFZpZXcoKS5ieUlkKHZhcmlhbnRNYW5hZ2VtZW50SWQpO1xuXHRcdGlmICh2YXJpYW50TWFuYWdlbWVudCkge1xuXHRcdFx0dmFyaWFudE1hbmFnZW1lbnQucmVnaXN0ZXJBcHBseUF1dG9tYXRpY2FsbHlPblN0YW5kYXJkVmFyaWFudCh0aGlzLl9hcHBseUF1dG9tYXRpY2FsbHlPblN0YW5kYXJkVmFyaWFudC5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH1cblxuXHRfc2V0U2hhcmVNb2RlbCgpIHtcblx0XHQvLyBUT0RPOiBkZWFjdGl2YXRlZCBmb3Igbm93IC0gY3VycmVudGx5IHRoZXJlIGlzIG5vIF90ZW1wbFByaXYgYW55bW9yZSwgdG8gYmUgZGlzY3Vzc2VkXG5cdFx0Ly8gdGhpcyBtZXRob2QgaXMgY3VycmVudGx5IG5vdCBjYWxsZWQgYW55bW9yZSBmcm9tIHRoZSBpbml0IG1ldGhvZFxuXG5cdFx0Y29uc3QgZm5HZXRVc2VyID0gT2JqZWN0UGF0aC5nZXQoXCJzYXAudXNoZWxsLkNvbnRhaW5lci5nZXRVc2VyXCIpO1xuXHRcdC8vdmFyIG9NYW5pZmVzdCA9IHRoaXMuZ2V0T3duZXJDb21wb25lbnQoKS5nZXRBcHBDb21wb25lbnQoKS5nZXRNZXRhZGF0YSgpLmdldE1hbmlmZXN0RW50cnkoXCJzYXAudWlcIik7XG5cdFx0Ly92YXIgc0Jvb2ttYXJrSWNvbiA9IChvTWFuaWZlc3QgJiYgb01hbmlmZXN0Lmljb25zICYmIG9NYW5pZmVzdC5pY29ucy5pY29uKSB8fCBcIlwiO1xuXG5cdFx0Ly9zaGFyZU1vZGVsOiBIb2xkcyBhbGwgdGhlIHNoYXJpbmcgcmVsZXZhbnQgaW5mb3JtYXRpb24gYW5kIGluZm8gdXNlZCBpbiBYTUwgdmlld1xuXHRcdGNvbnN0IG9TaGFyZUluZm8gPSB7XG5cdFx0XHRib29rbWFya1RpdGxlOiBkb2N1bWVudC50aXRsZSwgLy9UbyBuYW1lIHRoZSBib29rbWFyayBhY2NvcmRpbmcgdG8gdGhlIGFwcCB0aXRsZS5cblx0XHRcdGJvb2ttYXJrQ3VzdG9tVXJsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNvbnN0IHNIYXNoID0gaGFzaGVyLmdldEhhc2goKTtcblx0XHRcdFx0cmV0dXJuIHNIYXNoID8gYCMke3NIYXNofWAgOiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdH0sXG5cdFx0XHQvKlxuXHRcdFx0XHRcdFx0XHRUbyBiZSBhY3RpdmF0ZWQgb25jZSB0aGUgRkxQIHNob3dzIHRoZSBjb3VudCAtIHNlZSBjb21tZW50IGFib3ZlXG5cdFx0XHRcdFx0XHRcdGJvb2ttYXJrU2VydmljZVVybDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly92YXIgb1RhYmxlID0gb1RhYmxlLmdldElubmVyVGFibGUoKTsgb1RhYmxlIGlzIGFscmVhZHkgdGhlIHNhcC5mZSB0YWJsZSAoYnV0IG5vdCB0aGUgaW5uZXIgb25lKVxuXHRcdFx0XHRcdFx0XHRcdC8vIHdlIHNob3VsZCB1c2UgdGFibGUuZ2V0TGlzdEJpbmRpbmdJbmZvIGluc3RlYWQgb2YgdGhlIGJpbmRpbmdcblx0XHRcdFx0XHRcdFx0XHR2YXIgb0JpbmRpbmcgPSBvVGFibGUuZ2V0QmluZGluZyhcInJvd3NcIikgfHwgb1RhYmxlLmdldEJpbmRpbmcoXCJpdGVtc1wiKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb0JpbmRpbmcgPyBmbkdldERvd25sb2FkVXJsKG9CaW5kaW5nKSA6IFwiXCI7XG5cdFx0XHRcdFx0XHRcdH0sKi9cblx0XHRcdGlzU2hhcmVJbkphbUFjdGl2ZTogISFmbkdldFVzZXIgJiYgZm5HZXRVc2VyKCkuaXNKYW1BY3RpdmUoKVxuXHRcdH07XG5cblx0XHRjb25zdCBvVGVtcGxhdGVQcml2YXRlTW9kZWwgPSB0aGlzLmdldE93bmVyQ29tcG9uZW50KCkuZ2V0TW9kZWwoXCJfdGVtcGxQcml2XCIpIGFzIEpTT05Nb2RlbDtcblx0XHRvVGVtcGxhdGVQcml2YXRlTW9kZWwuc2V0UHJvcGVydHkoXCIvbGlzdFJlcG9ydC9zaGFyZVwiLCBvU2hhcmVJbmZvKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gdXBkYXRlIHRoZSBsb2NhbCBVSSBtb2RlbCBvZiB0aGUgcGFnZSB3aXRoIHRoZSBmaWVsZHMgdGhhdCBhcmUgbm90IGFwcGxpY2FibGUgdG8gdGhlIGZpbHRlciBiYXIgKHRoaXMgaXMgc3BlY2lmaWMgdG8gdGhlIEFMUCBzY2VuYXJpbykuXG5cdCAqXG5cdCAqIEBwYXJhbSBvSW50ZXJuYWxNb2RlbENvbnRleHQgVGhlIGludGVybmFsIG1vZGVsIGNvbnRleHRcblx0ICogQHBhcmFtIG9GaWx0ZXJCYXIgTURDIGZpbHRlciBiYXJcblx0ICovXG5cdF91cGRhdGVBTFBOb3RBcHBsaWNhYmxlRmllbGRzKG9JbnRlcm5hbE1vZGVsQ29udGV4dDogSW50ZXJuYWxNb2RlbENvbnRleHQsIG9GaWx0ZXJCYXI6IEZpbHRlckJhcikge1xuXHRcdGNvbnN0IG1DYWNoZTogYW55ID0ge307XG5cdFx0Y29uc3QgaWdub3JlZEZpZWxkczogYW55ID0ge30sXG5cdFx0XHRhVGFibGVzID0gdGhpcy5fZ2V0Q29udHJvbHMoXCJ0YWJsZVwiKSxcblx0XHRcdGFDaGFydHMgPSB0aGlzLl9nZXRDb250cm9scyhcIkNoYXJ0XCIpO1xuXG5cdFx0aWYgKCFhVGFibGVzLmxlbmd0aCB8fCAhYUNoYXJ0cy5sZW5ndGgpIHtcblx0XHRcdC8vIElmIHRoZXJlJ3Mgbm90IGEgdGFibGUgYW5kIGEgY2hhcnQsIHdlJ3JlIG5vdCBpbiB0aGUgQUxQIGNhc2Vcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBGb3IgdGhlIG1vbWVudCwgdGhlcmUncyBub3RoaW5nIGZvciB0YWJsZXMuLi5cblx0XHRhQ2hhcnRzLmZvckVhY2goZnVuY3Rpb24gKG9DaGFydDogYW55KSB7XG5cdFx0XHRjb25zdCBzQ2hhcnRFbnRpdHlQYXRoID0gb0NoYXJ0LmRhdGEoXCJ0YXJnZXRDb2xsZWN0aW9uUGF0aFwiKSxcblx0XHRcdFx0c0NoYXJ0RW50aXR5U2V0ID0gc0NoYXJ0RW50aXR5UGF0aC5zbGljZSgxKSxcblx0XHRcdFx0c0NhY2hlS2V5ID0gYCR7c0NoYXJ0RW50aXR5U2V0fUNoYXJ0YDtcblx0XHRcdGlmICghbUNhY2hlW3NDYWNoZUtleV0pIHtcblx0XHRcdFx0bUNhY2hlW3NDYWNoZUtleV0gPSBGaWx0ZXJVdGlscy5nZXROb3RBcHBsaWNhYmxlRmlsdGVycyhvRmlsdGVyQmFyLCBvQ2hhcnQpO1xuXHRcdFx0fVxuXHRcdFx0aWdub3JlZEZpZWxkc1tzQ2FjaGVLZXldID0gbUNhY2hlW3NDYWNoZUtleV07XG5cdFx0fSk7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiY29udHJvbHMvaWdub3JlZEZpZWxkc1wiLCBpZ25vcmVkRmllbGRzKTtcblx0fVxuXG5cdF9pc0ZpbHRlckJhckhpZGRlbigpIHtcblx0XHRyZXR1cm4gKHRoaXMuZ2V0VmlldygpLmdldFZpZXdEYXRhKCkgYXMgYW55KS5oaWRlRmlsdGVyQmFyO1xuXHR9XG5cblx0X2dldEFwcGx5QXV0b21hdGljYWxseU9uVmFyaWFudChWYXJpYW50TWFuYWdlbWVudDogYW55LCBrZXk6IHN0cmluZyk6IEJvb2xlYW4ge1xuXHRcdGlmICghVmFyaWFudE1hbmFnZW1lbnQgfHwgIWtleSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRjb25zdCB2YXJpYW50cyA9IFZhcmlhbnRNYW5hZ2VtZW50LmdldFZhcmlhbnRzKCk7XG5cdFx0Y29uc3QgY3VycmVudFZhcmlhbnQgPSB2YXJpYW50cy5maW5kKGZ1bmN0aW9uICh2YXJpYW50OiBhbnkpIHtcblx0XHRcdHJldHVybiB2YXJpYW50ICYmIHZhcmlhbnQua2V5ID09PSBrZXk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIChjdXJyZW50VmFyaWFudCAmJiBjdXJyZW50VmFyaWFudC5leGVjdXRlT25TZWxlY3QpIHx8IGZhbHNlO1xuXHR9XG5cblx0X3Nob3VsZEF1dG9UcmlnZ2VyU2VhcmNoKG9WTTogYW55KSB7XG5cdFx0aWYgKFxuXHRcdFx0KHRoaXMuZ2V0VmlldygpLmdldFZpZXdEYXRhKCkgYXMgYW55KS5pbml0aWFsTG9hZCA9PT0gSW5pdGlhbExvYWRNb2RlLkF1dG8gJiZcblx0XHRcdCghb1ZNIHx8IG9WTS5nZXRTdGFuZGFyZFZhcmlhbnRLZXkoKSA9PT0gb1ZNLmdldEN1cnJlbnRWYXJpYW50S2V5KCkpXG5cdFx0KSB7XG5cdFx0XHRjb25zdCBvRmlsdGVyQmFyID0gdGhpcy5fZ2V0RmlsdGVyQmFyQ29udHJvbCgpO1xuXHRcdFx0aWYgKG9GaWx0ZXJCYXIpIHtcblx0XHRcdFx0Y29uc3Qgb0NvbmRpdGlvbnMgPSBvRmlsdGVyQmFyLmdldENvbmRpdGlvbnMoKTtcblx0XHRcdFx0Zm9yIChjb25zdCBzS2V5IGluIG9Db25kaXRpb25zKSB7XG5cdFx0XHRcdFx0Ly8gaWdub3JlIGZpbHRlcnMgc3RhcnRpbmcgd2l0aCAkIChlLmcuICRzZWFyY2gsICRlZGl0U3RhdGUpXG5cdFx0XHRcdFx0aWYgKCFzS2V5LnN0YXJ0c1dpdGgoXCIkXCIpICYmIEFycmF5LmlzQXJyYXkob0NvbmRpdGlvbnNbc0tleV0pICYmIG9Db25kaXRpb25zW3NLZXldLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Ly8gbG9hZCBkYXRhIGFzIHBlciB1c2VyJ3Mgc2V0dGluZyBvZiBhcHBseUF1dG9tYXRpY2FsbHkgb24gdGhlIHZhcmlhbnRcblx0XHRcdFx0XHRcdGNvbnN0IHN0YW5kYXJkVmFyaWFudDogYW55ID0gb1ZNLmdldFZhcmlhbnRzKCkuZmluZCgodmFyaWFudDogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YXJpYW50LmtleSA9PT0gb1ZNLmdldEN1cnJlbnRWYXJpYW50S2V5KCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybiBzdGFuZGFyZFZhcmlhbnQgJiYgc3RhbmRhcmRWYXJpYW50LmV4ZWN1dGVPblNlbGVjdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0X3VwZGF0ZVRhYmxlKG9UYWJsZTogYW55KSB7XG5cdFx0aWYgKCFvVGFibGUuaXNUYWJsZUJvdW5kKCkgfHwgdGhpcy5oYXNQZW5kaW5nQ2hhcnRDaGFuZ2VzKSB7XG5cdFx0XHRvVGFibGUucmViaW5kKCk7XG5cdFx0XHR0aGlzLmhhc1BlbmRpbmdDaGFydENoYW5nZXMgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRfdXBkYXRlQ2hhcnQob0NoYXJ0OiBhbnkpIHtcblx0XHRjb25zdCBvSW5uZXJDaGFydCA9IG9DaGFydC5nZXRDb250cm9sRGVsZWdhdGUoKS5fZ2V0Q2hhcnQob0NoYXJ0KTtcblx0XHRpZiAoIShvSW5uZXJDaGFydCAmJiBvSW5uZXJDaGFydC5pc0JvdW5kKFwiZGF0YVwiKSkgfHwgdGhpcy5oYXNQZW5kaW5nVGFibGVDaGFuZ2VzKSB7XG5cdFx0XHRvQ2hhcnQuZ2V0Q29udHJvbERlbGVnYXRlKCkucmViaW5kKG9DaGFydCwgb0lubmVyQ2hhcnQuZ2V0QmluZGluZ0luZm8oXCJkYXRhXCIpKTtcblx0XHRcdHRoaXMuaGFzUGVuZGluZ1RhYmxlQ2hhbmdlcyA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZXJzID0ge1xuXHRcdGhhbmRsZVNoYXJlU2hvcnRjdXQodGhpczogTGlzdFJlcG9ydENvbnRyb2xsZXIpIHtcblx0XHRcdGNvbnN0IHNoYXJlQVBJOiBTaGFyZUFQSSA9IHRoaXMuZ2V0VmlldygpLmJ5SWQoXCJmZTo6U2hhcmVcIikgYXMgU2hhcmVBUEk7XG5cdFx0XHRzaGFyZUFQSS5vcGVuTWVudSgpO1xuXHRcdH0sXG5cdFx0b25GaWx0ZXJTZWFyY2godGhpczogTGlzdFJlcG9ydENvbnRyb2xsZXIpIHtcblx0XHRcdHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKS50cmlnZ2VyU2VhcmNoKCk7XG5cdFx0fSxcblx0XHRvbkZpbHRlcnNDaGFuZ2VkKHRoaXM6IExpc3RSZXBvcnRDb250cm9sbGVyLCBvRXZlbnQ6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0ZpbHRlckJhciA9IHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHRcdGlmIChvRmlsdGVyQmFyKSB7XG5cdFx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRcdC8vIFBlbmRpbmcgZmlsdGVycyBpbnRvIEZpbHRlckJhciB0byBiZSB1c2VkIGZvciBjdXN0b20gdmlld3Ncblx0XHRcdFx0dGhpcy5vblBlbmRpbmdGaWx0ZXJzKCk7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImFwcGxpZWRGaWx0ZXJzXCIsIG9GaWx0ZXJCYXIuZ2V0QXNzaWduZWRGaWx0ZXJzVGV4dCgpLmZpbHRlcnNUZXh0KTtcblx0XHRcdFx0aWYgKG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJjb25kaXRpb25zQmFzZWRcIikpIHtcblx0XHRcdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJoYXNQZW5kaW5nRmlsdGVyc1wiLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25WYXJpYW50U2VsZWN0ZWQodGhpczogTGlzdFJlcG9ydENvbnRyb2xsZXIsIG9FdmVudDogYW55KSB7XG5cdFx0XHRjb25zdCBvVk0gPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdFx0XHRjb25zdCBjdXJyZW50VmFyaWFudEtleSA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJrZXlcIik7XG5cdFx0XHRjb25zdCBvTXVsdGlNb2RlQ29udHJvbCA9IHRoaXMuX2dldE11bHRpTW9kZUNvbnRyb2woKTtcblxuXHRcdFx0b011bHRpTW9kZUNvbnRyb2w/LmludmFsaWRhdGVDb250ZW50KCk7XG5cdFx0XHRvTXVsdGlNb2RlQ29udHJvbD8uc2V0RnJlZXplQ29udGVudCh0cnVlKTtcblx0XHRcdC8vIHNldFRpbWVvdXQgY2F1c2UgdGhlIHZhcmlhbnQgbmVlZHMgdG8gYmUgYXBwbGllZCBiZWZvcmUganVkZ2luZyB0aGUgYXV0byBzZWFyY2ggb3IgdXBkYXRpbmcgdGhlIGFwcCBzdGF0ZVxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl9zaG91bGRBdXRvVHJpZ2dlclNlYXJjaChvVk0pKSB7XG5cdFx0XHRcdFx0Ly8gdGhlIGFwcCBzdGF0ZSB3aWxsIGJlIHVwZGF0ZWQgdmlhIG9uU2VhcmNoIGhhbmRsZXJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fZ2V0RmlsdGVyQmFyQ29udHJvbCgpLnRyaWdnZXJTZWFyY2goKTtcblx0XHRcdFx0fSBlbHNlIGlmICghdGhpcy5fZ2V0QXBwbHlBdXRvbWF0aWNhbGx5T25WYXJpYW50KG9WTSwgY3VycmVudFZhcmlhbnRLZXkpKSB7XG5cdFx0XHRcdFx0dGhpcy5nZXRFeHRlbnNpb25BUEkoKS51cGRhdGVBcHBTdGF0ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCAwKTtcblx0XHR9LFxuXHRcdG9uVmFyaWFudFNhdmVkKHRoaXM6IExpc3RSZXBvcnRDb250cm9sbGVyKSB7XG5cdFx0XHQvL1RPRE86IFNob3VsZCByZW1vdmUgdGhpcyBzZXRUaW1lT3V0IG9uY2UgVmFyaWFudCBNYW5hZ2VtZW50IHByb3ZpZGVzIGFuIGFwaSB0byBmZXRjaCB0aGUgY3VycmVudCB2YXJpYW50IGtleSBvbiBzYXZlISEhXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dGhpcy5nZXRFeHRlbnNpb25BUEkoKS51cGRhdGVBcHBTdGF0ZSgpO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSxcblx0XHRvblNlYXJjaCh0aGlzOiBMaXN0UmVwb3J0Q29udHJvbGxlcikge1xuXHRcdFx0Y29uc3Qgb0ZpbHRlckJhciA9IHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRjb25zdCBvTWRjQ2hhcnQgPSB0aGlzLmdldENoYXJ0Q29udHJvbCgpO1xuXHRcdFx0Y29uc3QgYkhpZGVEcmFmdCA9IEZpbHRlclV0aWxzLmdldEVkaXRTdGF0ZUlzSGlkZURyYWZ0KG9GaWx0ZXJCYXIuZ2V0Q29uZGl0aW9ucygpKTtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImhhc1BlbmRpbmdGaWx0ZXJzXCIsIGZhbHNlKTtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImhpZGVEcmFmdEluZm9cIiwgYkhpZGVEcmFmdCk7XG5cblx0XHRcdGlmICghdGhpcy5fZ2V0TXVsdGlNb2RlQ29udHJvbCgpKSB7XG5cdFx0XHRcdHRoaXMuX3VwZGF0ZUFMUE5vdEFwcGxpY2FibGVGaWVsZHMob0ludGVybmFsTW9kZWxDb250ZXh0LCBvRmlsdGVyQmFyKTtcblx0XHRcdH1cblx0XHRcdGlmIChvTWRjQ2hhcnQpIHtcblx0XHRcdFx0Ly8gZGlzYWJsZSBib3VuZCBhY3Rpb25zIFRPRE86IHRoaXMgY2xlYXJzIGV2ZXJ5dGhpbmcgZm9yIHRoZSBjaGFydD9cblx0XHRcdFx0KG9NZGNDaGFydC5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0KS5zZXRQcm9wZXJ0eShcIlwiLCB7fSk7XG5cblx0XHRcdFx0Y29uc3Qgb1BhZ2VJbnRlcm5hbE1vZGVsQ29udGV4dCA9IG9NZGNDaGFydC5nZXRCaW5kaW5nQ29udGV4dChcInBhZ2VJbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRcdFx0Y29uc3Qgc1RlbXBsYXRlQ29udGVudFZpZXcgPSBvUGFnZUludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KGAke29QYWdlSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UGF0aCgpfS9hbHBDb250ZW50Vmlld2ApO1xuXHRcdFx0XHRpZiAoc1RlbXBsYXRlQ29udGVudFZpZXcgPT09IFRlbXBsYXRlQ29udGVudFZpZXcuQ2hhcnQpIHtcblx0XHRcdFx0XHR0aGlzLmhhc1BlbmRpbmdDaGFydENoYW5nZXMgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzVGVtcGxhdGVDb250ZW50VmlldyA9PT0gVGVtcGxhdGVDb250ZW50Vmlldy5UYWJsZSkge1xuXHRcdFx0XHRcdHRoaXMuaGFzUGVuZGluZ1RhYmxlQ2hhbmdlcyA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIHN0b3JlIGZpbHRlciBiYXIgY29uZGl0aW9ucyB0byB1c2UgbGF0ZXIgd2hpbGUgbmF2aWdhdGlvblxuXHRcdFx0U3RhdGVVdGlsLnJldHJpZXZlRXh0ZXJuYWxTdGF0ZShvRmlsdGVyQmFyKVxuXHRcdFx0XHQudGhlbigob0V4dGVybmFsU3RhdGU6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZmlsdGVyQmFyQ29uZGl0aW9ucyA9IG9FeHRlcm5hbFN0YXRlLmZpbHRlcjtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJldHJpZXZpbmcgdGhlIGV4dGVybmFsIHN0YXRlXCIsIG9FcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0aWYgKCh0aGlzLmdldFZpZXcoKS5nZXRWaWV3RGF0YSgpIGFzIGFueSkubGl2ZU1vZGUgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuZ2V0RXh0ZW5zaW9uQVBJKCkudXBkYXRlQXBwU3RhdGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHN5c3RlbS5waG9uZSkge1xuXHRcdFx0XHRjb25zdCBvRHluYW1pY1BhZ2UgPSB0aGlzLl9nZXREeW5hbWljTGlzdFJlcG9ydENvbnRyb2woKTtcblx0XHRcdFx0b0R5bmFtaWNQYWdlLnNldEhlYWRlckV4cGFuZGVkKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJzIGFuIG91dGJvdW5kIG5hdmlnYXRpb24gd2hlbiBhIHVzZXIgY2hvb3NlcyB0aGUgY2hldnJvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBvQ29udHJvbGxlclxuXHRcdCAqIEBwYXJhbSBzT3V0Ym91bmRUYXJnZXQgTmFtZSBvZiB0aGUgb3V0Ym91bmQgdGFyZ2V0IChuZWVkcyB0byBiZSBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdClcblx0XHQgKiBAcGFyYW0gb0NvbnRleHQgVGhlIGNvbnRleHQgdGhhdCBjb250YWlucyB0aGUgZGF0YSBmb3IgdGhlIHRhcmdldCBhcHBcblx0XHQgKiBAcGFyYW0gc0NyZWF0ZVBhdGggQ3JlYXRlIHBhdGggd2hlbiB0aGUgY2hldnJvbiBpcyBjcmVhdGVkLlxuXHRcdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgb25jZSB0aGUgbmF2aWdhdGlvbiBpcyB0cmlnZ2VyZWRcblx0XHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0XHQgKiBAZmluYWxcblx0XHQgKi9cblx0XHRvbkNoZXZyb25QcmVzc05hdmlnYXRlT3V0Qm91bmQoXG5cdFx0XHRvQ29udHJvbGxlcjogTGlzdFJlcG9ydENvbnRyb2xsZXIsXG5cdFx0XHRzT3V0Ym91bmRUYXJnZXQ6IHN0cmluZyxcblx0XHRcdG9Db250ZXh0OiBWNENvbnRleHQsXG5cdFx0XHRzQ3JlYXRlUGF0aDogc3RyaW5nXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gb0NvbnRyb2xsZXIuX2ludGVudEJhc2VkTmF2aWdhdGlvbi5vbkNoZXZyb25QcmVzc05hdmlnYXRlT3V0Qm91bmQob0NvbnRyb2xsZXIsIHNPdXRib3VuZFRhcmdldCwgb0NvbnRleHQsIHNDcmVhdGVQYXRoKTtcblx0XHR9LFxuXHRcdG9uQ2hhcnRTZWxlY3Rpb25DaGFuZ2VkKHRoaXM6IExpc3RSZXBvcnRDb250cm9sbGVyLCBvRXZlbnQ6IGFueSkge1xuXHRcdFx0Y29uc3Qgb01kY0NoYXJ0ID0gb0V2ZW50LmdldFNvdXJjZSgpLmdldENvbnRlbnQoKSxcblx0XHRcdFx0b1RhYmxlID0gdGhpcy5fZ2V0VGFibGUoKSxcblx0XHRcdFx0YURhdGEgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiZGF0YVwiKSxcblx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0ID0gdGhpcy5nZXRWaWV3KCkuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRcdGlmIChhRGF0YSkge1xuXHRcdFx0XHQvLyB1cGRhdGUgYWN0aW9uIGJ1dHRvbnMgZW5hYmxlbWVudCAvIGRpc2FibGVtZW50XG5cdFx0XHRcdENoYXJ0UnVudGltZS5mblVwZGF0ZUNoYXJ0KG9FdmVudCk7XG5cdFx0XHRcdC8vIHVwZGF0ZSBzZWxlY3Rpb25zIG9uIHNlbGVjdGlvbiBvciBkZXNlbGVjdGlvblxuXHRcdFx0XHRDaGFydFV0aWxzLnNldENoYXJ0RmlsdGVycyhvTWRjQ2hhcnQpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc1RlbXBsYXRlQ29udGVudFZpZXcgPSBvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoYCR7b0ludGVybmFsTW9kZWxDb250ZXh0LmdldFBhdGgoKX0vYWxwQ29udGVudFZpZXdgKTtcblx0XHRcdGlmIChzVGVtcGxhdGVDb250ZW50VmlldyA9PT0gVGVtcGxhdGVDb250ZW50Vmlldy5DaGFydCkge1xuXHRcdFx0XHR0aGlzLmhhc1BlbmRpbmdDaGFydENoYW5nZXMgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmIChvVGFibGUpIHtcblx0XHRcdFx0KG9UYWJsZSBhcyBhbnkpLnJlYmluZCgpO1xuXHRcdFx0XHR0aGlzLmhhc1BlbmRpbmdDaGFydENoYW5nZXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZCh0aGlzOiBMaXN0UmVwb3J0Q29udHJvbGxlciwgb0V2ZW50OiBhbnkpIHtcblx0XHRcdGNvbnN0IHNTZWxlY3RlZEtleSA9IG9FdmVudC5tUGFyYW1ldGVycy5rZXkgPyBvRXZlbnQubVBhcmFtZXRlcnMua2V5IDogbnVsbDtcblx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IHRoaXMuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJhbHBDb250ZW50Vmlld1wiLCBzU2VsZWN0ZWRLZXkpO1xuXHRcdFx0Y29uc3Qgb0NoYXJ0ID0gdGhpcy5nZXRDaGFydENvbnRyb2woKTtcblx0XHRcdGNvbnN0IG9UYWJsZSA9IHRoaXMuX2dldFRhYmxlKCk7XG5cdFx0XHRjb25zdCBvU2VnbWVudGVkQnV0dG9uRGVsZWdhdGUgPSB7XG5cdFx0XHRcdG9uQWZ0ZXJSZW5kZXJpbmcoKSB7XG5cdFx0XHRcdFx0Y29uc3QgYUl0ZW1zID0gb1NlZ21lbnRlZEJ1dHRvbi5nZXRJdGVtcygpO1xuXHRcdFx0XHRcdGFJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChvSXRlbTogYW55KSB7XG5cdFx0XHRcdFx0XHRpZiAob0l0ZW0uZ2V0S2V5KCkgPT09IHNTZWxlY3RlZEtleSkge1xuXHRcdFx0XHRcdFx0XHRvSXRlbS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9TZWdtZW50ZWRCdXR0b24ucmVtb3ZlRXZlbnREZWxlZ2F0ZShvU2VnbWVudGVkQnV0dG9uRGVsZWdhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3Qgb1NlZ21lbnRlZEJ1dHRvbiA9IChcblx0XHRcdFx0c1NlbGVjdGVkS2V5ID09PSBUZW1wbGF0ZUNvbnRlbnRWaWV3LlRhYmxlID8gdGhpcy5fZ2V0U2VnbWVudGVkQnV0dG9uKFwiVGFibGVcIikgOiB0aGlzLl9nZXRTZWdtZW50ZWRCdXR0b24oXCJDaGFydFwiKVxuXHRcdFx0KSBhcyBTZWdtZW50ZWRCdXR0b247XG5cdFx0XHRpZiAob1NlZ21lbnRlZEJ1dHRvbiAhPT0gb0V2ZW50LmdldFNvdXJjZSgpKSB7XG5cdFx0XHRcdG9TZWdtZW50ZWRCdXR0b24uYWRkRXZlbnREZWxlZ2F0ZShvU2VnbWVudGVkQnV0dG9uRGVsZWdhdGUpO1xuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChzU2VsZWN0ZWRLZXkpIHtcblx0XHRcdFx0Y2FzZSBUZW1wbGF0ZUNvbnRlbnRWaWV3LlRhYmxlOlxuXHRcdFx0XHRcdHRoaXMuX3VwZGF0ZVRhYmxlKG9UYWJsZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgVGVtcGxhdGVDb250ZW50Vmlldy5DaGFydDpcblx0XHRcdFx0XHR0aGlzLl91cGRhdGVDaGFydChvQ2hhcnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFRlbXBsYXRlQ29udGVudFZpZXcuSHlicmlkOlxuXHRcdFx0XHRcdHRoaXMuX3VwZGF0ZVRhYmxlKG9UYWJsZSk7XG5cdFx0XHRcdFx0dGhpcy5fdXBkYXRlQ2hhcnQob0NoYXJ0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHRoaXMuZ2V0RXh0ZW5zaW9uQVBJKCkudXBkYXRlQXBwU3RhdGUoKTtcblx0XHR9LFxuXHRcdG9uRmlsdGVyc1NlZ21lbnRlZEJ1dHRvblByZXNzZWQodGhpczogTGlzdFJlcG9ydENvbnRyb2xsZXIsIG9FdmVudDogYW55KSB7XG5cdFx0XHRjb25zdCBpc0NvbXBhY3QgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwia2V5XCIpID09PSBcIkNvbXBhY3RcIjtcblx0XHRcdHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKS5zZXRWaXNpYmxlKGlzQ29tcGFjdCk7XG5cdFx0XHQodGhpcy5fZ2V0VmlzdWFsRmlsdGVyQmFyQ29udHJvbCgpIGFzIENvbnRyb2wpLnNldFZpc2libGUoIWlzQ29tcGFjdCk7XG5cdFx0fSxcblx0XHRvblN0YXRlQ2hhbmdlKHRoaXM6IExpc3RSZXBvcnRDb250cm9sbGVyKSB7XG5cdFx0XHR0aGlzLmdldEV4dGVuc2lvbkFQSSgpLnVwZGF0ZUFwcFN0YXRlKCk7XG5cdFx0fSxcblx0XHRvbkR5bmFtaWNQYWdlVGl0bGVTdGF0ZUNoYW5nZWQodGhpczogTGlzdFJlcG9ydENvbnRyb2xsZXIsIG9FdmVudDogYW55KSB7XG5cdFx0XHRjb25zdCBmaWx0ZXJCYXI6IGFueSA9IHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHRcdGlmIChmaWx0ZXJCYXIgJiYgZmlsdGVyQmFyLmdldFNlZ21lbnRlZEJ1dHRvbigpKSB7XG5cdFx0XHRcdGlmIChvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiaXNFeHBhbmRlZFwiKSkge1xuXHRcdFx0XHRcdGZpbHRlckJhci5nZXRTZWdtZW50ZWRCdXR0b24oKS5zZXRWaXNpYmxlKHRydWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpbHRlckJhci5nZXRTZWdtZW50ZWRCdXR0b24oKS5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0Zm9ybWF0dGVycyA9IHtcblx0XHRzZXRBTFBDb250cm9sTWVzc2FnZVN0cmlwKHRoaXM6IExpc3RSZXBvcnRDb250cm9sbGVyLCBhSWdub3JlZEZpZWxkczogYW55W10sIGJJc0NoYXJ0OiBhbnksIG9BcHBseVN1cHBvcnRlZD86IGFueSkge1xuXHRcdFx0bGV0IHNUZXh0ID0gXCJcIjtcblx0XHRcdGJJc0NoYXJ0ID0gYklzQ2hhcnQgPT09IFwidHJ1ZVwiIHx8IGJJc0NoYXJ0ID09PSB0cnVlO1xuXHRcdFx0Y29uc3Qgb0ZpbHRlckJhciA9IHRoaXMuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHRcdGlmIChvRmlsdGVyQmFyICYmIEFycmF5LmlzQXJyYXkoYUlnbm9yZWRGaWVsZHMpICYmIGFJZ25vcmVkRmllbGRzLmxlbmd0aCA+IDAgJiYgYklzQ2hhcnQpIHtcblx0XHRcdFx0Y29uc3QgYUlnbm9yZWRMYWJlbHMgPSBNZXNzYWdlU3RyaXAuZ2V0TGFiZWxzKFxuXHRcdFx0XHRcdGFJZ25vcmVkRmllbGRzLFxuXHRcdFx0XHRcdG9GaWx0ZXJCYXIuZGF0YShcImVudGl0eVR5cGVcIiksXG5cdFx0XHRcdFx0b0ZpbHRlckJhcixcblx0XHRcdFx0XHR0aGlzLm9SZXNvdXJjZUJ1bmRsZSBhcyBSZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCBiSXNTZWFyY2hJZ25vcmVkID0gIW9BcHBseVN1cHBvcnRlZC5lbmFibGVTZWFyY2g7XG5cdFx0XHRcdHNUZXh0ID0gYklzQ2hhcnRcblx0XHRcdFx0XHQ/IE1lc3NhZ2VTdHJpcC5nZXRBTFBUZXh0KGFJZ25vcmVkTGFiZWxzLCBvRmlsdGVyQmFyLCBiSXNTZWFyY2hJZ25vcmVkKVxuXHRcdFx0XHRcdDogTWVzc2FnZVN0cmlwLmdldFRleHQoYUlnbm9yZWRMYWJlbHMsIG9GaWx0ZXJCYXIsIFwiXCIsIERlbGVnYXRlVXRpbC5nZXRMb2NhbGl6ZWRUZXh0KTtcblx0XHRcdFx0cmV0dXJuIHNUZXh0O1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdFJlcG9ydENvbnRyb2xsZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBMERBLElBQU1BLG1CQUFtQixHQUFHQyxXQUFXLENBQUNELG1CQUF4QztFQUFBLElBQ0NFLGVBQWUsR0FBR0QsV0FBVyxDQUFDQyxlQUQvQjtNQUlNQyxvQixXQURMQyxjQUFjLENBQUMsa0RBQUQsQyxVQUViQyxjQUFjLENBQ2RDLGVBQWUsQ0FBQ0MsUUFBaEIsQ0FBeUI7SUFDeEJDLGNBQWMsRUFBRSxZQUFpQztNQUMvQyxLQUFLQyxPQUFMLEdBQWVDLGFBQWYsRUFBRCxDQUF5REMsZUFBekQ7SUFDQTtFQUh1QixDQUF6QixDQURjLEMsVUFRZE4sY0FBYyxDQUNkTyw2QkFBNkIsQ0FBQ0wsUUFBOUIsQ0FBdUM7SUFDdENNLFlBQVksRUFBRSxZQUErQztNQUM1RCxPQUFRLEtBQUtDLElBQU4sQ0FBb0NDLG1CQUFwQyxFQUFQO0lBQ0E7RUFIcUMsQ0FBdkMsQ0FEYyxDLFVBUWRWLGNBQWMsQ0FBQ1csV0FBRCxDLFVBR2RYLGNBQWMsQ0FBQ1kscUJBQXFCLENBQUNWLFFBQXRCLENBQStCVyw2QkFBL0IsQ0FBRCxDLFVBR2RiLGNBQWMsQ0FBQ2MsS0FBSyxDQUFDWixRQUFOLENBQWVhLGNBQWYsQ0FBRCxDLFVBR2RmLGNBQWMsQ0FBQ2dCLFFBQVEsQ0FBQ2QsUUFBVCxDQUFrQmUsaUJBQWxCLENBQUQsQyxVQUdkakIsY0FBYyxDQUFDa0IsU0FBUyxDQUFDaEIsUUFBVixDQUFt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