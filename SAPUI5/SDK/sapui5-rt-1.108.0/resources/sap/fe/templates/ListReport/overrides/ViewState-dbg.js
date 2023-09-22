/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/KeepAliveHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/library", "sap/fe/core/templating/PropertyFormatters", "sap/fe/macros/DelegateUtil", "sap/fe/macros/filter/FilterUtils", "sap/fe/navigation/library", "sap/ui/Device", "sap/ui/fl/apply/api/ControlVariantApplyAPI", "sap/ui/mdc/enum/ConditionValidated", "sap/ui/mdc/p13n/StateUtil"], function (Log, CommonUtils, KeepAliveHelper, ModelHelper, CoreLibrary, PropertyFormatters, DelegateUtil, FilterUtils, NavLibrary, Device, ControlVariantApplyAPI, ConditionValidated, StateUtil) {
  "use strict";

  var system = Device.system;

  var NavType = NavLibrary.NavType,
      VariantManagementType = CoreLibrary.VariantManagement,
      TemplateContentView = CoreLibrary.TemplateContentView,
      InitialLoadMode = CoreLibrary.InitialLoadMode;
  var FilterRestrictions = CommonUtils.FilterRestrictions,
      CONDITION_PATH_TO_PROPERTY_PATH_REGEX = /\+|\*/g;
  var ViewStateOverride = {
    _bSearchTriggered: false,
    applyInitialStateOnly: function () {
      return true;
    },
    onBeforeStateApplied: function (aPromises) {
      var oView = this.getView(),
          oController = oView.getController(),
          oFilterBar = oController._getFilterBarControl(),
          aTables = oController._getControls("table");

      if (oFilterBar) {
        oFilterBar.setSuspendSelection(true);
        aPromises.push(oFilterBar.waitForInitialization());
      }

      aTables.forEach(function (oTable) {
        aPromises.push(oTable.initialized());
      });
      delete this._bSearchTriggered;
    },
    onAfterStateApplied: function () {
      var oController = this.getView().getController();

      var oFilterBar = oController._getFilterBarControl();

      if (oFilterBar) {
        oFilterBar.setSuspendSelection(false);
      } else if (oController._isFilterBarHidden()) {
        var oInternalModelContext = oController.getView().getBindingContext("internal");
        oInternalModelContext.setProperty("hasPendingFilters", false);

        if (oController._isMultiMode()) {
          oController._getMultiModeControl().setCountsOutDated(true);
        }
      }
    },
    adaptBindingRefreshControls: function (aControls) {
      var oView = this.getView(),
          oController = oView.getController(),
          aViewControls = oController._getControls(),
          aControlsToRefresh = KeepAliveHelper.getControlsForRefresh(oView, aViewControls);

      Array.prototype.push.apply(aControls, aControlsToRefresh);
    },
    adaptStateControls: function (aStateControls) {
      var oView = this.getView(),
          oController = oView.getController(),
          oViewData = oView.getViewData(),
          bControlVM = oViewData.variantManagement === VariantManagementType.Control;

      var oFilterBarVM = this._getFilterBarVM(oView);

      if (oFilterBarVM) {
        aStateControls.push(oFilterBarVM);
      }

      if (oController._isMultiMode()) {
        aStateControls.push(oController._getMultiModeControl());
      }

      oController._getControls("table").forEach(function (oTable) {
        var oQuickFilter = oTable.getQuickFilter();

        if (oQuickFilter) {
          aStateControls.push(oQuickFilter);
        }

        if (bControlVM) {
          aStateControls.push(oTable.getVariant());
        }

        aStateControls.push(oTable);
      });

      if (oController._getControls("Chart")) {
        oController._getControls("Chart").forEach(function (oChart) {
          aStateControls.push(oChart);
        });
      }

      if (oController._hasMultiVisualizations()) {
        aStateControls.push(oController._getSegmentedButton(TemplateContentView.Chart));
        aStateControls.push(oController._getSegmentedButton(TemplateContentView.Table));
      }

      var oFilterBar = oController._getFilterBarControl();

      if (oFilterBar) {
        aStateControls.push(oFilterBar);
      }

      aStateControls.push(oView.byId("fe::ListReport"));
    },
    retrieveAdditionalStates: function (mAdditionalStates) {
      var oView = this.getView(),
          oController = oView.getController(),
          bPendingFilter = oView.getBindingContext("internal").getProperty("hasPendingFilters");
      mAdditionalStates.dataLoaded = !bPendingFilter || !!this._bSearchTriggered;

      if (oController._hasMultiVisualizations()) {
        var sAlpContentView = oView.getBindingContext("internal").getProperty("alpContentView");
        mAdditionalStates.alpContentView = sAlpContentView;
      }

      delete this._bSearchTriggered;
    },
    applyAdditionalStates: function (oAdditionalStates) {
      var oView = this.getView(),
          oController = oView.getController(),
          oFilterBar = oController._getFilterBarControl();

      if (oAdditionalStates) {
        // explicit check for boolean values - 'undefined' should not alter the triggered search property
        if (oAdditionalStates.dataLoaded === false && oFilterBar) {
          // without this, the data is loaded on navigating back
          oFilterBar._bSearchTriggered = false;
        } else if (oAdditionalStates.dataLoaded === true) {
          if (oFilterBar) {
            oFilterBar.triggerSearch();
          }

          this._bSearchTriggered = true;
        }

        if (oController._hasMultiVisualizations()) {
          var oInternalModelContext = oView.getBindingContext("internal");

          if (!system.desktop && oAdditionalStates.alpContentView == TemplateContentView.Hybrid) {
            oAdditionalStates.alpContentView = TemplateContentView.Chart;
          }

          oInternalModelContext.getModel().setProperty("".concat(oInternalModelContext.getPath(), "/alpContentView"), oAdditionalStates.alpContentView);
        }
      }
    },
    _applyNavigationParametersToFilterbar: function (oNavigationParameter, aResults) {
      var _this = this;

      var oView = this.getView();
      var oController = oView.getController();
      var oAppComponent = oController.getAppComponent();
      var oComponentData = oAppComponent.getComponentData();
      var oStartupParameters = oComponentData && oComponentData.startupParameters || {};
      var oVariantPromise = this.handleVariantIdPassedViaURLParams(oStartupParameters);
      var bFilterVariantApplied;
      aResults.push(oVariantPromise.then(function (aVariants) {
        if (aVariants && aVariants.length > 0) {
          if (aVariants[0] === true || aVariants[1] === true) {
            bFilterVariantApplied = true;
          }
        }

        return _this._applySelectionVariant(oView, oNavigationParameter, bFilterVariantApplied);
      }).then(function () {
        var oDynamicPage = oController._getDynamicListReportControl();

        var bPreventInitialSearch = false;

        var oFilterBarVM = _this._getFilterBarVM(oView);

        var oFilterBarControl = oController._getFilterBarControl();

        if (oFilterBarControl) {
          if (oNavigationParameter.navigationType !== NavType.initial && oNavigationParameter.requiresStandardVariant || !oFilterBarVM && oView.getViewData().initialLoad === InitialLoadMode.Enabled || oController._shouldAutoTriggerSearch(oFilterBarVM)) {
            oFilterBarControl.triggerSearch();
          } else {
            bPreventInitialSearch = _this._preventInitialSearch(oFilterBarVM);
          } // reset the suspend selection on filter bar to allow loading of data when needed (was set on LR Init)


          oFilterBarControl.setSuspendSelection(false);
          _this._bSearchTriggered = !bPreventInitialSearch;
          oDynamicPage.setHeaderExpanded(system.desktop || bPreventInitialSearch);
        }
      }).catch(function () {
        Log.error("Variant ID cannot be applied");
      }));
    },
    handleVariantIdPassedViaURLParams: function (oUrlParams) {
      var aPageVariantId = oUrlParams["sap-ui-fe-variant-id"],
          aFilterBarVariantId = oUrlParams["sap-ui-fe-filterbar-variant-id"],
          aTableVariantId = oUrlParams["sap-ui-fe-table-variant-id"];
      var oVariant;

      if (aPageVariantId || aFilterBarVariantId || aTableVariantId) {
        oVariant = {
          sPageVariantId: aPageVariantId && aPageVariantId[0],
          sFilterBarVariantId: aFilterBarVariantId && aFilterBarVariantId[0],
          sTableVariantId: aTableVariantId && aTableVariantId[0]
        };
      }

      return this._handleControlVariantId(oVariant);
    },
    _handleControlVariantId: function (oVariantIDs) {
      var _this2 = this;

      var oVM;
      var oView = this.getView(),
          aPromises = [];
      var sVariantManagement = oView.getViewData().variantManagement;

      if (oVariantIDs && oVariantIDs.sPageVariantId && sVariantManagement === "Page") {
        oVM = oView.byId("fe::PageVariantManagement");
        oVM.getVariants().forEach(function (oVariant) {
          if (oVariant.key === oVariantIDs.sPageVariantId) {
            aPromises.push(_this2._applyControlVariant(oVM, oVariantIDs.sPageVariantId, true));
          }
        });
      } else if (oVariantIDs && sVariantManagement === "Control") {
        if (oVariantIDs.sFilterBarVariantId) {
          oVM = oView.getController()._getFilterBarVariantControl();

          if (oVM) {
            oVM.getVariants().forEach(function (oVariant) {
              if (oVariant.key === oVariantIDs.sFilterBarVariantId) {
                aPromises.push(_this2._applyControlVariant(oVM, oVariantIDs.sFilterBarVariantId, true));
              }
            });
          }
        }

        if (oVariantIDs.sTableVariantId) {
          var oController = oView.getController(),
              aTables = oController._getControls("table");

          aTables.forEach(function (oTable) {
            var oTableVariant = oTable.getVariant();

            if (oTable && oTableVariant) {
              oTableVariant.getVariants().forEach(function (oVariant) {
                if (oVariant.key === oVariantIDs.sTableVariantId) {
                  aPromises.push(_this2._applyControlVariant(oTableVariant, oVariantIDs.sTableVariantId));
                }
              });
            }
          });
        }
      }

      return Promise.all(aPromises);
    },
    _applyControlVariant: function (oVariant, sVariantID, bFilterVariantApplied) {
      var sVariantReference = this._checkIfVariantIdIsAvailable(oVariant, sVariantID) ? sVariantID : oVariant.getStandardVariantKey();
      var oVM = ControlVariantApplyAPI.activateVariant({
        element: oVariant,
        variantReference: sVariantReference
      });
      return oVM.then(function () {
        return bFilterVariantApplied;
      });
    },

    /************************************* private helper *****************************************/
    _getFilterBarVM: function (oView) {
      var oViewData = oView.getViewData();

      switch (oViewData.variantManagement) {
        case VariantManagementType.Page:
          return oView.byId("fe::PageVariantManagement");

        case VariantManagementType.Control:
          return oView.getController()._getFilterBarVariantControl();

        case VariantManagementType.None:
          return null;

        default:
          throw new Error("unhandled variant setting: ".concat(oViewData.variantManagement));
      }
    },
    _preventInitialSearch: function (oVariantManagement) {
      if (!oVariantManagement) {
        return true;
      }

      var aVariants = oVariantManagement.getVariants();
      var oCurrentVariant = aVariants.find(function (oItem) {
        return oItem.key === oVariantManagement.getCurrentVariantKey();
      });
      return !oCurrentVariant.executeOnSelect;
    },
    _applySelectionVariant: function (oView, oNavigationParameter, bFilterVariantApplied) {
      var oFilterBar = oView.getController()._getFilterBarControl(),
          oSelectionVariant = oNavigationParameter.selectionVariant,
          oSelectionVariantDefaults = oNavigationParameter.selectionVariantDefaults;

      if (!oFilterBar || !oSelectionVariant) {
        return Promise.resolve();
      }

      var oConditions = {};
      var oMetaModel = oView.getModel().getMetaModel();
      var oViewData = oView.getViewData();
      var sContextPath = oViewData.contextPath || "/".concat(oViewData.entitySet);
      var aMandatoryFilterFields = CommonUtils.getMandatoryFilterFields(oMetaModel, sContextPath);
      var bUseSemanticDateRange = oFilterBar.data("useSemanticDateRange");
      var oVariant;

      switch (oViewData.variantManagement) {
        case VariantManagementType.Page:
          oVariant = oView.byId("fe::PageVariantManagement");
          break;

        case VariantManagementType.Control:
          oVariant = oView.getController()._getFilterBarVariantControl();
          break;

        case VariantManagementType.None:
        default:
          break;
      }

      var bRequiresStandardVariant = oNavigationParameter.requiresStandardVariant; // check if FLP default values are there and is it standard variant

      var bIsFLPValuePresent = oSelectionVariantDefaults && oSelectionVariantDefaults.getSelectOptionsPropertyNames().length > 0 && oVariant.getDefaultVariantKey() === oVariant.getStandardVariantKey() && oNavigationParameter.bNavSelVarHasDefaultsOnly; // get conditions when FLP value is present

      if (bFilterVariantApplied || bIsFLPValuePresent) {
        oConditions = oFilterBar.getConditions();
      }

      CommonUtils.addDefaultDisplayCurrency(aMandatoryFilterFields, oSelectionVariant, oSelectionVariantDefaults);
      CommonUtils.addSelectionVariantToConditions(oSelectionVariant, oConditions, oMetaModel, sContextPath, bIsFLPValuePresent, bUseSemanticDateRange, oViewData);
      return this._activateSelectionVariant(oFilterBar, oConditions, oVariant, bRequiresStandardVariant, bFilterVariantApplied);
    },
    _activateSelectionVariant: function (oFilterBar, oConditions, oVariant, bRequiresStandardVariant, bFilterVariantApplied) {
      var _this3 = this;

      var oPromise;

      if (oVariant && !bFilterVariantApplied) {
        var oVariantKey = bRequiresStandardVariant ? oVariant.getStandardVariantKey() : oVariant.getDefaultVariantKey();

        if (oVariantKey === null) {
          oVariantKey = oVariant.getId();
        }

        oPromise = ControlVariantApplyAPI.activateVariant({
          element: oVariant,
          variantReference: oVariantKey
        }).then(function () {
          return bRequiresStandardVariant || oVariant.getDefaultVariantKey() === oVariant.getStandardVariantKey();
        });
      } else {
        oPromise = Promise.resolve(true);
      }

      return oPromise.then(function (bClearFilterAndReplaceWithAppState) {
        if (bClearFilterAndReplaceWithAppState) {
          return _this3._fnApplyConditions(oFilterBar, oConditions);
        }
      });
    },
    _fnApplyConditions: function (oFilterBar, oConditions) {
      var mFilter = {},
          aItems = [],
          fnAdjustValueHelpCondition = function (oCondition) {
        // in case the condition is meant for a field having a VH, the format required by MDC differs
        oCondition.validated = ConditionValidated.Validated;

        if (oCondition.operator === "Empty") {
          oCondition.operator = "EQ";
          oCondition.values = [""];
        } else if (oCondition.operator === "NotEmpty") {
          oCondition.operator = "NE";
          oCondition.values = [""];
        }

        delete oCondition.isEmpty;
      };

      var fnGetPropertyInfo = function (oFilterControl, sEntityTypePath) {
        var sEntitySetPath = ModelHelper.getEntitySetPath(sEntityTypePath),
            oMetaModel = oFilterControl.getModel().getMetaModel(),
            oFR = CommonUtils.getFilterRestrictionsByPath(sEntitySetPath, oMetaModel),
            aNonFilterableProps = oFR[FilterRestrictions.NON_FILTERABLE_PROPERTIES],
            mFilterFields = FilterUtils.getConvertedFilterFields(oFilterControl, sEntityTypePath),
            aPropertyInfo = [];
        Object.keys(mFilterFields).forEach(function (sFilterFieldKey) {
          var oConvertedProperty = mFilterFields[sFilterFieldKey];
          var sPropertyPath = oConvertedProperty.conditionPath.replace(CONDITION_PATH_TO_PROPERTY_PATH_REGEX, "");

          if (aNonFilterableProps.indexOf(sPropertyPath) === -1) {
            var sAnnotationPath = oConvertedProperty.annotationPath;
            var oPropertyContext = oMetaModel.createBindingContext(sAnnotationPath);
            aPropertyInfo.push({
              path: oConvertedProperty.conditionPath,
              hiddenFilter: oConvertedProperty.availability === "Hidden",
              hasValueHelp: !sAnnotationPath ? false : PropertyFormatters.hasValueHelp(oPropertyContext.getObject(), {
                context: oPropertyContext
              })
            });
          }
        });
        return aPropertyInfo;
      };

      return oFilterBar.waitForInitialization().then(function () {
        var sEntityTypePath = DelegateUtil.getCustomData(oFilterBar, "entityType");
        var aPropertyInfo = fnGetPropertyInfo(oFilterBar, sEntityTypePath);
        aPropertyInfo.filter(function (oPropertyInfo) {
          return oPropertyInfo.path !== "$editState" && oPropertyInfo.path !== "$search";
        }).forEach(function (oPropertyInfo) {
          if (oPropertyInfo.path in oConditions) {
            mFilter[oPropertyInfo.path] = oConditions[oPropertyInfo.path];

            if (!oPropertyInfo.hiddenFilter) {
              aItems.push({
                name: oPropertyInfo.path
              });
            }

            if (oPropertyInfo.hasValueHelp) {
              mFilter[oPropertyInfo.path].forEach(fnAdjustValueHelpCondition);
            } else {
              mFilter[oPropertyInfo.path].forEach(function (oCondition) {
                oCondition.validated = oCondition.filtered ? ConditionValidated.NotValidated : oCondition.validated;
              });
            }
          } else {
            mFilter[oPropertyInfo.path] = [];
          }
        });
        return StateUtil.applyExternalState(oFilterBar, {
          filter: mFilter,
          items: aItems
        });
      });
    }
  };
  return ViewStateOverride;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOYXZUeXBlIiwiTmF2TGlicmFyeSIsIlZhcmlhbnRNYW5hZ2VtZW50VHlwZSIsIkNvcmVMaWJyYXJ5IiwiVmFyaWFudE1hbmFnZW1lbnQiLCJUZW1wbGF0ZUNvbnRlbnRWaWV3IiwiSW5pdGlhbExvYWRNb2RlIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiQ29tbW9uVXRpbHMiLCJDT05ESVRJT05fUEFUSF9UT19QUk9QRVJUWV9QQVRIX1JFR0VYIiwiVmlld1N0YXRlT3ZlcnJpZGUiLCJfYlNlYXJjaFRyaWdnZXJlZCIsImFwcGx5SW5pdGlhbFN0YXRlT25seSIsIm9uQmVmb3JlU3RhdGVBcHBsaWVkIiwiYVByb21pc2VzIiwib1ZpZXciLCJnZXRWaWV3Iiwib0NvbnRyb2xsZXIiLCJnZXRDb250cm9sbGVyIiwib0ZpbHRlckJhciIsIl9nZXRGaWx0ZXJCYXJDb250cm9sIiwiYVRhYmxlcyIsIl9nZXRDb250cm9scyIsInNldFN1c3BlbmRTZWxlY3Rpb24iLCJwdXNoIiwid2FpdEZvckluaXRpYWxpemF0aW9uIiwiZm9yRWFjaCIsIm9UYWJsZSIsImluaXRpYWxpemVkIiwib25BZnRlclN0YXRlQXBwbGllZCIsIl9pc0ZpbHRlckJhckhpZGRlbiIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0Iiwic2V0UHJvcGVydHkiLCJfaXNNdWx0aU1vZGUiLCJfZ2V0TXVsdGlNb2RlQ29udHJvbCIsInNldENvdW50c091dERhdGVkIiwiYWRhcHRCaW5kaW5nUmVmcmVzaENvbnRyb2xzIiwiYUNvbnRyb2xzIiwiYVZpZXdDb250cm9scyIsImFDb250cm9sc1RvUmVmcmVzaCIsIktlZXBBbGl2ZUhlbHBlciIsImdldENvbnRyb2xzRm9yUmVmcmVzaCIsIkFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJhZGFwdFN0YXRlQ29udHJvbHMiLCJhU3RhdGVDb250cm9scyIsIm9WaWV3RGF0YSIsImdldFZpZXdEYXRhIiwiYkNvbnRyb2xWTSIsInZhcmlhbnRNYW5hZ2VtZW50IiwiQ29udHJvbCIsIm9GaWx0ZXJCYXJWTSIsIl9nZXRGaWx0ZXJCYXJWTSIsIm9RdWlja0ZpbHRlciIsImdldFF1aWNrRmlsdGVyIiwiZ2V0VmFyaWFudCIsIm9DaGFydCIsIl9oYXNNdWx0aVZpc3VhbGl6YXRpb25zIiwiX2dldFNlZ21lbnRlZEJ1dHRvbiIsIkNoYXJ0IiwiVGFibGUiLCJieUlkIiwicmV0cmlldmVBZGRpdGlvbmFsU3RhdGVzIiwibUFkZGl0aW9uYWxTdGF0ZXMiLCJiUGVuZGluZ0ZpbHRlciIsImdldFByb3BlcnR5IiwiZGF0YUxvYWRlZCIsInNBbHBDb250ZW50VmlldyIsImFscENvbnRlbnRWaWV3IiwiYXBwbHlBZGRpdGlvbmFsU3RhdGVzIiwib0FkZGl0aW9uYWxTdGF0ZXMiLCJ0cmlnZ2VyU2VhcmNoIiwic3lzdGVtIiwiZGVza3RvcCIsIkh5YnJpZCIsImdldE1vZGVsIiwiZ2V0UGF0aCIsIl9hcHBseU5hdmlnYXRpb25QYXJhbWV0ZXJzVG9GaWx0ZXJiYXIiLCJvTmF2aWdhdGlvblBhcmFtZXRlciIsImFSZXN1bHRzIiwib0FwcENvbXBvbmVudCIsImdldEFwcENvbXBvbmVudCIsIm9Db21wb25lbnREYXRhIiwiZ2V0Q29tcG9uZW50RGF0YSIsIm9TdGFydHVwUGFyYW1ldGVycyIsInN0YXJ0dXBQYXJhbWV0ZXJzIiwib1ZhcmlhbnRQcm9taXNlIiwiaGFuZGxlVmFyaWFudElkUGFzc2VkVmlhVVJMUGFyYW1zIiwiYkZpbHRlclZhcmlhbnRBcHBsaWVkIiwidGhlbiIsImFWYXJpYW50cyIsImxlbmd0aCIsIl9hcHBseVNlbGVjdGlvblZhcmlhbnQiLCJvRHluYW1pY1BhZ2UiLCJfZ2V0RHluYW1pY0xpc3RSZXBvcnRDb250cm9sIiwiYlByZXZlbnRJbml0aWFsU2VhcmNoIiwib0ZpbHRlckJhckNvbnRyb2wiLCJuYXZpZ2F0aW9uVHlwZSIsImluaXRpYWwiLCJyZXF1aXJlc1N0YW5kYXJkVmFyaWFudCIsImluaXRpYWxMb2FkIiwiRW5hYmxlZCIsIl9zaG91bGRBdXRvVHJpZ2dlclNlYXJjaCIsIl9wcmV2ZW50SW5pdGlhbFNlYXJjaCIsInNldEhlYWRlckV4cGFuZGVkIiwiY2F0Y2giLCJMb2ciLCJlcnJvciIsIm9VcmxQYXJhbXMiLCJhUGFnZVZhcmlhbnRJZCIsImFGaWx0ZXJCYXJWYXJpYW50SWQiLCJhVGFibGVWYXJpYW50SWQiLCJvVmFyaWFudCIsInNQYWdlVmFyaWFudElkIiwic0ZpbHRlckJhclZhcmlhbnRJZCIsInNUYWJsZVZhcmlhbnRJZCIsIl9oYW5kbGVDb250cm9sVmFyaWFudElkIiwib1ZhcmlhbnRJRHMiLCJvVk0iLCJzVmFyaWFudE1hbmFnZW1lbnQiLCJnZXRWYXJpYW50cyIsImtleSIsIl9hcHBseUNvbnRyb2xWYXJpYW50IiwiX2dldEZpbHRlckJhclZhcmlhbnRDb250cm9sIiwib1RhYmxlVmFyaWFudCIsIlByb21pc2UiLCJhbGwiLCJzVmFyaWFudElEIiwic1ZhcmlhbnRSZWZlcmVuY2UiLCJfY2hlY2tJZlZhcmlhbnRJZElzQXZhaWxhYmxlIiwiZ2V0U3RhbmRhcmRWYXJpYW50S2V5IiwiQ29udHJvbFZhcmlhbnRBcHBseUFQSSIsImFjdGl2YXRlVmFyaWFudCIsImVsZW1lbnQiLCJ2YXJpYW50UmVmZXJlbmNlIiwiUGFnZSIsIk5vbmUiLCJFcnJvciIsIm9WYXJpYW50TWFuYWdlbWVudCIsIm9DdXJyZW50VmFyaWFudCIsImZpbmQiLCJvSXRlbSIsImdldEN1cnJlbnRWYXJpYW50S2V5IiwiZXhlY3V0ZU9uU2VsZWN0Iiwib1NlbGVjdGlvblZhcmlhbnQiLCJzZWxlY3Rpb25WYXJpYW50Iiwib1NlbGVjdGlvblZhcmlhbnREZWZhdWx0cyIsInNlbGVjdGlvblZhcmlhbnREZWZhdWx0cyIsInJlc29sdmUiLCJvQ29uZGl0aW9ucyIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzQ29udGV4dFBhdGgiLCJjb250ZXh0UGF0aCIsImVudGl0eVNldCIsImFNYW5kYXRvcnlGaWx0ZXJGaWVsZHMiLCJnZXRNYW5kYXRvcnlGaWx0ZXJGaWVsZHMiLCJiVXNlU2VtYW50aWNEYXRlUmFuZ2UiLCJkYXRhIiwiYlJlcXVpcmVzU3RhbmRhcmRWYXJpYW50IiwiYklzRkxQVmFsdWVQcmVzZW50IiwiZ2V0U2VsZWN0T3B0aW9uc1Byb3BlcnR5TmFtZXMiLCJnZXREZWZhdWx0VmFyaWFudEtleSIsImJOYXZTZWxWYXJIYXNEZWZhdWx0c09ubHkiLCJnZXRDb25kaXRpb25zIiwiYWRkRGVmYXVsdERpc3BsYXlDdXJyZW5jeSIsImFkZFNlbGVjdGlvblZhcmlhbnRUb0NvbmRpdGlvbnMiLCJfYWN0aXZhdGVTZWxlY3Rpb25WYXJpYW50Iiwib1Byb21pc2UiLCJvVmFyaWFudEtleSIsImdldElkIiwiYkNsZWFyRmlsdGVyQW5kUmVwbGFjZVdpdGhBcHBTdGF0ZSIsIl9mbkFwcGx5Q29uZGl0aW9ucyIsIm1GaWx0ZXIiLCJhSXRlbXMiLCJmbkFkanVzdFZhbHVlSGVscENvbmRpdGlvbiIsIm9Db25kaXRpb24iLCJ2YWxpZGF0ZWQiLCJDb25kaXRpb25WYWxpZGF0ZWQiLCJWYWxpZGF0ZWQiLCJvcGVyYXRvciIsInZhbHVlcyIsImlzRW1wdHkiLCJmbkdldFByb3BlcnR5SW5mbyIsIm9GaWx0ZXJDb250cm9sIiwic0VudGl0eVR5cGVQYXRoIiwic0VudGl0eVNldFBhdGgiLCJNb2RlbEhlbHBlciIsImdldEVudGl0eVNldFBhdGgiLCJvRlIiLCJnZXRGaWx0ZXJSZXN0cmljdGlvbnNCeVBhdGgiLCJhTm9uRmlsdGVyYWJsZVByb3BzIiwiTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFUyIsIm1GaWx0ZXJGaWVsZHMiLCJGaWx0ZXJVdGlscyIsImdldENvbnZlcnRlZEZpbHRlckZpZWxkcyIsImFQcm9wZXJ0eUluZm8iLCJPYmplY3QiLCJrZXlzIiwic0ZpbHRlckZpZWxkS2V5Iiwib0NvbnZlcnRlZFByb3BlcnR5Iiwic1Byb3BlcnR5UGF0aCIsImNvbmRpdGlvblBhdGgiLCJyZXBsYWNlIiwiaW5kZXhPZiIsInNBbm5vdGF0aW9uUGF0aCIsImFubm90YXRpb25QYXRoIiwib1Byb3BlcnR5Q29udGV4dCIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwicGF0aCIsImhpZGRlbkZpbHRlciIsImF2YWlsYWJpbGl0eSIsImhhc1ZhbHVlSGVscCIsIlByb3BlcnR5Rm9ybWF0dGVycyIsImdldE9iamVjdCIsImNvbnRleHQiLCJEZWxlZ2F0ZVV0aWwiLCJnZXRDdXN0b21EYXRhIiwiZmlsdGVyIiwib1Byb3BlcnR5SW5mbyIsIm5hbWUiLCJmaWx0ZXJlZCIsIk5vdFZhbGlkYXRlZCIsIlN0YXRlVXRpbCIsImFwcGx5RXh0ZXJuYWxTdGF0ZSIsIml0ZW1zIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJWaWV3U3RhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgdHlwZSBWaWV3U3RhdGUgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL1ZpZXdTdGF0ZVwiO1xuaW1wb3J0IEtlZXBBbGl2ZUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9LZWVwQWxpdmVIZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgSW50ZXJuYWxNb2RlbENvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgQ29yZUxpYnJhcnkgZnJvbSBcInNhcC9mZS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCAqIGFzIFByb3BlcnR5Rm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Qcm9wZXJ0eUZvcm1hdHRlcnNcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgRmlsdGVyVXRpbHMgZnJvbSBcInNhcC9mZS9tYWNyb3MvZmlsdGVyL0ZpbHRlclV0aWxzXCI7XG5pbXBvcnQgTmF2TGlicmFyeSBmcm9tIFwic2FwL2ZlL25hdmlnYXRpb24vbGlicmFyeVwiO1xuaW1wb3J0IHR5cGUgTGlzdFJlcG9ydENvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS90ZW1wbGF0ZXMvTGlzdFJlcG9ydC9MaXN0UmVwb3J0Q29udHJvbGxlci5jb250cm9sbGVyXCI7XG5pbXBvcnQgeyBzeXN0ZW0gfSBmcm9tIFwic2FwL3VpL0RldmljZVwiO1xuaW1wb3J0IENvbnRyb2xWYXJpYW50QXBwbHlBUEkgZnJvbSBcInNhcC91aS9mbC9hcHBseS9hcGkvQ29udHJvbFZhcmlhbnRBcHBseUFQSVwiO1xuaW1wb3J0IHR5cGUgVmFyaWFudE1hbmFnZW1lbnQgZnJvbSBcInNhcC91aS9mbC92YXJpYW50cy9WYXJpYW50TWFuYWdlbWVudFwiO1xuaW1wb3J0IENvbmRpdGlvblZhbGlkYXRlZCBmcm9tIFwic2FwL3VpL21kYy9lbnVtL0NvbmRpdGlvblZhbGlkYXRlZFwiO1xuaW1wb3J0IFN0YXRlVXRpbCBmcm9tIFwic2FwL3VpL21kYy9wMTNuL1N0YXRlVXRpbFwiO1xuaW1wb3J0IHR5cGUgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcblxuY29uc3QgTmF2VHlwZSA9IE5hdkxpYnJhcnkuTmF2VHlwZSxcblx0VmFyaWFudE1hbmFnZW1lbnRUeXBlID0gQ29yZUxpYnJhcnkuVmFyaWFudE1hbmFnZW1lbnQsXG5cdFRlbXBsYXRlQ29udGVudFZpZXcgPSBDb3JlTGlicmFyeS5UZW1wbGF0ZUNvbnRlbnRWaWV3LFxuXHRJbml0aWFsTG9hZE1vZGUgPSBDb3JlTGlicmFyeS5Jbml0aWFsTG9hZE1vZGU7XG5jb25zdCBGaWx0ZXJSZXN0cmljdGlvbnMgPSBDb21tb25VdGlscy5GaWx0ZXJSZXN0cmljdGlvbnMsXG5cdENPTkRJVElPTl9QQVRIX1RPX1BST1BFUlRZX1BBVEhfUkVHRVggPSAvXFwrfFxcKi9nO1xuXG5jb25zdCBWaWV3U3RhdGVPdmVycmlkZTogYW55ID0ge1xuXHRfYlNlYXJjaFRyaWdnZXJlZDogZmFsc2UsXG5cdGFwcGx5SW5pdGlhbFN0YXRlT25seTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXHRvbkJlZm9yZVN0YXRlQXBwbGllZDogZnVuY3Rpb24gKHRoaXM6IFZpZXdTdGF0ZSAmIHR5cGVvZiBWaWV3U3RhdGVPdmVycmlkZSwgYVByb21pc2VzOiBhbnkpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0b0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgTGlzdFJlcG9ydENvbnRyb2xsZXIsXG5cdFx0XHRvRmlsdGVyQmFyID0gb0NvbnRyb2xsZXIuX2dldEZpbHRlckJhckNvbnRyb2woKSxcblx0XHRcdGFUYWJsZXMgPSBvQ29udHJvbGxlci5fZ2V0Q29udHJvbHMoXCJ0YWJsZVwiKTtcblx0XHRpZiAob0ZpbHRlckJhcikge1xuXHRcdFx0b0ZpbHRlckJhci5zZXRTdXNwZW5kU2VsZWN0aW9uKHRydWUpO1xuXHRcdFx0YVByb21pc2VzLnB1c2goKG9GaWx0ZXJCYXIgYXMgYW55KS53YWl0Rm9ySW5pdGlhbGl6YXRpb24oKSk7XG5cdFx0fVxuXHRcdGFUYWJsZXMuZm9yRWFjaChmdW5jdGlvbiAob1RhYmxlOiBhbnkpIHtcblx0XHRcdGFQcm9taXNlcy5wdXNoKG9UYWJsZS5pbml0aWFsaXplZCgpKTtcblx0XHR9KTtcblxuXHRcdGRlbGV0ZSB0aGlzLl9iU2VhcmNoVHJpZ2dlcmVkO1xuXHR9LFxuXHRvbkFmdGVyU3RhdGVBcHBsaWVkOiBmdW5jdGlvbiAodGhpczogVmlld1N0YXRlKSB7XG5cdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSB0aGlzLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgTGlzdFJlcG9ydENvbnRyb2xsZXI7XG5cdFx0Y29uc3Qgb0ZpbHRlckJhciA9IG9Db250cm9sbGVyLl9nZXRGaWx0ZXJCYXJDb250cm9sKCk7XG5cdFx0aWYgKG9GaWx0ZXJCYXIpIHtcblx0XHRcdG9GaWx0ZXJCYXIuc2V0U3VzcGVuZFNlbGVjdGlvbihmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChvQ29udHJvbGxlci5faXNGaWx0ZXJCYXJIaWRkZW4oKSkge1xuXHRcdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb0NvbnRyb2xsZXIuZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJoYXNQZW5kaW5nRmlsdGVyc1wiLCBmYWxzZSk7XG5cdFx0XHRpZiAob0NvbnRyb2xsZXIuX2lzTXVsdGlNb2RlKCkpIHtcblx0XHRcdFx0b0NvbnRyb2xsZXIuX2dldE11bHRpTW9kZUNvbnRyb2woKS5zZXRDb3VudHNPdXREYXRlZCh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGFkYXB0QmluZGluZ1JlZnJlc2hDb250cm9sczogZnVuY3Rpb24gKHRoaXM6IFZpZXdTdGF0ZSwgYUNvbnRyb2xzOiBhbnkpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0b0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgTGlzdFJlcG9ydENvbnRyb2xsZXIsXG5cdFx0XHRhVmlld0NvbnRyb2xzID0gb0NvbnRyb2xsZXIuX2dldENvbnRyb2xzKCksXG5cdFx0XHRhQ29udHJvbHNUb1JlZnJlc2ggPSBLZWVwQWxpdmVIZWxwZXIuZ2V0Q29udHJvbHNGb3JSZWZyZXNoKG9WaWV3LCBhVmlld0NvbnRyb2xzKTtcblxuXHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGFDb250cm9scywgYUNvbnRyb2xzVG9SZWZyZXNoKTtcblx0fSxcblx0YWRhcHRTdGF0ZUNvbnRyb2xzOiBmdW5jdGlvbiAodGhpczogVmlld1N0YXRlICYgdHlwZW9mIFZpZXdTdGF0ZU92ZXJyaWRlLCBhU3RhdGVDb250cm9sczogYW55KSB7XG5cdFx0Y29uc3Qgb1ZpZXcgPSB0aGlzLmdldFZpZXcoKSxcblx0XHRcdG9Db250cm9sbGVyID0gb1ZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIExpc3RSZXBvcnRDb250cm9sbGVyLFxuXHRcdFx0b1ZpZXdEYXRhID0gb1ZpZXcuZ2V0Vmlld0RhdGEoKSxcblx0XHRcdGJDb250cm9sVk0gPSBvVmlld0RhdGEudmFyaWFudE1hbmFnZW1lbnQgPT09IFZhcmlhbnRNYW5hZ2VtZW50VHlwZS5Db250cm9sO1xuXG5cdFx0Y29uc3Qgb0ZpbHRlckJhclZNID0gdGhpcy5fZ2V0RmlsdGVyQmFyVk0ob1ZpZXcpO1xuXHRcdGlmIChvRmlsdGVyQmFyVk0pIHtcblx0XHRcdGFTdGF0ZUNvbnRyb2xzLnB1c2gob0ZpbHRlckJhclZNKTtcblx0XHR9XG5cdFx0aWYgKG9Db250cm9sbGVyLl9pc011bHRpTW9kZSgpKSB7XG5cdFx0XHRhU3RhdGVDb250cm9scy5wdXNoKG9Db250cm9sbGVyLl9nZXRNdWx0aU1vZGVDb250cm9sKCkpO1xuXHRcdH1cblx0XHRvQ29udHJvbGxlci5fZ2V0Q29udHJvbHMoXCJ0YWJsZVwiKS5mb3JFYWNoKGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdFx0Y29uc3Qgb1F1aWNrRmlsdGVyID0gb1RhYmxlLmdldFF1aWNrRmlsdGVyKCk7XG5cdFx0XHRpZiAob1F1aWNrRmlsdGVyKSB7XG5cdFx0XHRcdGFTdGF0ZUNvbnRyb2xzLnB1c2gob1F1aWNrRmlsdGVyKTtcblx0XHRcdH1cblx0XHRcdGlmIChiQ29udHJvbFZNKSB7XG5cdFx0XHRcdGFTdGF0ZUNvbnRyb2xzLnB1c2gob1RhYmxlLmdldFZhcmlhbnQoKSk7XG5cdFx0XHR9XG5cdFx0XHRhU3RhdGVDb250cm9scy5wdXNoKG9UYWJsZSk7XG5cdFx0fSk7XG5cdFx0aWYgKG9Db250cm9sbGVyLl9nZXRDb250cm9scyhcIkNoYXJ0XCIpKSB7XG5cdFx0XHRvQ29udHJvbGxlci5fZ2V0Q29udHJvbHMoXCJDaGFydFwiKS5mb3JFYWNoKGZ1bmN0aW9uIChvQ2hhcnQ6IGFueSkge1xuXHRcdFx0XHRhU3RhdGVDb250cm9scy5wdXNoKG9DaGFydCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYgKG9Db250cm9sbGVyLl9oYXNNdWx0aVZpc3VhbGl6YXRpb25zKCkpIHtcblx0XHRcdGFTdGF0ZUNvbnRyb2xzLnB1c2gob0NvbnRyb2xsZXIuX2dldFNlZ21lbnRlZEJ1dHRvbihUZW1wbGF0ZUNvbnRlbnRWaWV3LkNoYXJ0KSk7XG5cdFx0XHRhU3RhdGVDb250cm9scy5wdXNoKG9Db250cm9sbGVyLl9nZXRTZWdtZW50ZWRCdXR0b24oVGVtcGxhdGVDb250ZW50Vmlldy5UYWJsZSkpO1xuXHRcdH1cblx0XHRjb25zdCBvRmlsdGVyQmFyID0gb0NvbnRyb2xsZXIuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHRpZiAob0ZpbHRlckJhcikge1xuXHRcdFx0YVN0YXRlQ29udHJvbHMucHVzaChvRmlsdGVyQmFyKTtcblx0XHR9XG5cdFx0YVN0YXRlQ29udHJvbHMucHVzaChvVmlldy5ieUlkKFwiZmU6Okxpc3RSZXBvcnRcIikpO1xuXHR9LFxuXHRyZXRyaWV2ZUFkZGl0aW9uYWxTdGF0ZXM6IGZ1bmN0aW9uICh0aGlzOiBWaWV3U3RhdGUgJiB0eXBlb2YgVmlld1N0YXRlT3ZlcnJpZGUsIG1BZGRpdGlvbmFsU3RhdGVzOiBhbnkpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0b0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgTGlzdFJlcG9ydENvbnRyb2xsZXIsXG5cdFx0XHRiUGVuZGluZ0ZpbHRlciA9IChvVmlldy5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0KS5nZXRQcm9wZXJ0eShcImhhc1BlbmRpbmdGaWx0ZXJzXCIpO1xuXG5cdFx0bUFkZGl0aW9uYWxTdGF0ZXMuZGF0YUxvYWRlZCA9ICFiUGVuZGluZ0ZpbHRlciB8fCAhIXRoaXMuX2JTZWFyY2hUcmlnZ2VyZWQ7XG5cdFx0aWYgKG9Db250cm9sbGVyLl9oYXNNdWx0aVZpc3VhbGl6YXRpb25zKCkpIHtcblx0XHRcdGNvbnN0IHNBbHBDb250ZW50VmlldyA9IG9WaWV3LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikuZ2V0UHJvcGVydHkoXCJhbHBDb250ZW50Vmlld1wiKTtcblx0XHRcdG1BZGRpdGlvbmFsU3RhdGVzLmFscENvbnRlbnRWaWV3ID0gc0FscENvbnRlbnRWaWV3O1xuXHRcdH1cblxuXHRcdGRlbGV0ZSB0aGlzLl9iU2VhcmNoVHJpZ2dlcmVkO1xuXHR9LFxuXHRhcHBseUFkZGl0aW9uYWxTdGF0ZXM6IGZ1bmN0aW9uICh0aGlzOiBWaWV3U3RhdGUgJiB0eXBlb2YgVmlld1N0YXRlT3ZlcnJpZGUsIG9BZGRpdGlvbmFsU3RhdGVzOiBhbnkpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpLFxuXHRcdFx0b0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgTGlzdFJlcG9ydENvbnRyb2xsZXIsXG5cdFx0XHRvRmlsdGVyQmFyID0gb0NvbnRyb2xsZXIuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblxuXHRcdGlmIChvQWRkaXRpb25hbFN0YXRlcykge1xuXHRcdFx0Ly8gZXhwbGljaXQgY2hlY2sgZm9yIGJvb2xlYW4gdmFsdWVzIC0gJ3VuZGVmaW5lZCcgc2hvdWxkIG5vdCBhbHRlciB0aGUgdHJpZ2dlcmVkIHNlYXJjaCBwcm9wZXJ0eVxuXHRcdFx0aWYgKG9BZGRpdGlvbmFsU3RhdGVzLmRhdGFMb2FkZWQgPT09IGZhbHNlICYmIG9GaWx0ZXJCYXIpIHtcblx0XHRcdFx0Ly8gd2l0aG91dCB0aGlzLCB0aGUgZGF0YSBpcyBsb2FkZWQgb24gbmF2aWdhdGluZyBiYWNrXG5cdFx0XHRcdChvRmlsdGVyQmFyIGFzIGFueSkuX2JTZWFyY2hUcmlnZ2VyZWQgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSBpZiAob0FkZGl0aW9uYWxTdGF0ZXMuZGF0YUxvYWRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAob0ZpbHRlckJhcikge1xuXHRcdFx0XHRcdG9GaWx0ZXJCYXIudHJpZ2dlclNlYXJjaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2JTZWFyY2hUcmlnZ2VyZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG9Db250cm9sbGVyLl9oYXNNdWx0aVZpc3VhbGl6YXRpb25zKCkpIHtcblx0XHRcdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb1ZpZXcuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRcdFx0aWYgKCFzeXN0ZW0uZGVza3RvcCAmJiBvQWRkaXRpb25hbFN0YXRlcy5hbHBDb250ZW50VmlldyA9PSBUZW1wbGF0ZUNvbnRlbnRWaWV3Lkh5YnJpZCkge1xuXHRcdFx0XHRcdG9BZGRpdGlvbmFsU3RhdGVzLmFscENvbnRlbnRWaWV3ID0gVGVtcGxhdGVDb250ZW50Vmlldy5DaGFydDtcblx0XHRcdFx0fVxuXHRcdFx0XHQob0ludGVybmFsTW9kZWxDb250ZXh0LmdldE1vZGVsKCkgYXMgSlNPTk1vZGVsKS5zZXRQcm9wZXJ0eShcblx0XHRcdFx0XHRgJHtvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UGF0aCgpfS9hbHBDb250ZW50Vmlld2AsXG5cdFx0XHRcdFx0b0FkZGl0aW9uYWxTdGF0ZXMuYWxwQ29udGVudFZpZXdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdF9hcHBseU5hdmlnYXRpb25QYXJhbWV0ZXJzVG9GaWx0ZXJiYXI6IGZ1bmN0aW9uICh0aGlzOiBWaWV3U3RhdGUgJiB0eXBlb2YgVmlld1N0YXRlT3ZlcnJpZGUsIG9OYXZpZ2F0aW9uUGFyYW1ldGVyOiBhbnksIGFSZXN1bHRzOiBhbnkpIHtcblx0XHRjb25zdCBvVmlldyA9IHRoaXMuZ2V0VmlldygpO1xuXHRcdGNvbnN0IG9Db250cm9sbGVyID0gb1ZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIExpc3RSZXBvcnRDb250cm9sbGVyO1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBvQ29udHJvbGxlci5nZXRBcHBDb21wb25lbnQoKTtcblx0XHRjb25zdCBvQ29tcG9uZW50RGF0YSA9IG9BcHBDb21wb25lbnQuZ2V0Q29tcG9uZW50RGF0YSgpO1xuXHRcdGNvbnN0IG9TdGFydHVwUGFyYW1ldGVycyA9IChvQ29tcG9uZW50RGF0YSAmJiBvQ29tcG9uZW50RGF0YS5zdGFydHVwUGFyYW1ldGVycykgfHwge307XG5cdFx0Y29uc3Qgb1ZhcmlhbnRQcm9taXNlID0gdGhpcy5oYW5kbGVWYXJpYW50SWRQYXNzZWRWaWFVUkxQYXJhbXMob1N0YXJ0dXBQYXJhbWV0ZXJzKTtcblx0XHRsZXQgYkZpbHRlclZhcmlhbnRBcHBsaWVkOiBib29sZWFuO1xuXHRcdGFSZXN1bHRzLnB1c2goXG5cdFx0XHRvVmFyaWFudFByb21pc2Vcblx0XHRcdFx0LnRoZW4oKGFWYXJpYW50czogYW55W10pID0+IHtcblx0XHRcdFx0XHRpZiAoYVZhcmlhbnRzICYmIGFWYXJpYW50cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRpZiAoYVZhcmlhbnRzWzBdID09PSB0cnVlIHx8IGFWYXJpYW50c1sxXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRiRmlsdGVyVmFyaWFudEFwcGxpZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fYXBwbHlTZWxlY3Rpb25WYXJpYW50KG9WaWV3LCBvTmF2aWdhdGlvblBhcmFtZXRlciwgYkZpbHRlclZhcmlhbnRBcHBsaWVkKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG9EeW5hbWljUGFnZSA9IG9Db250cm9sbGVyLl9nZXREeW5hbWljTGlzdFJlcG9ydENvbnRyb2woKTtcblx0XHRcdFx0XHRsZXQgYlByZXZlbnRJbml0aWFsU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdFx0Y29uc3Qgb0ZpbHRlckJhclZNID0gdGhpcy5fZ2V0RmlsdGVyQmFyVk0ob1ZpZXcpO1xuXHRcdFx0XHRcdGNvbnN0IG9GaWx0ZXJCYXJDb250cm9sID0gb0NvbnRyb2xsZXIuX2dldEZpbHRlckJhckNvbnRyb2woKTtcblx0XHRcdFx0XHRpZiAob0ZpbHRlckJhckNvbnRyb2wpIHtcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0KG9OYXZpZ2F0aW9uUGFyYW1ldGVyLm5hdmlnYXRpb25UeXBlICE9PSBOYXZUeXBlLmluaXRpYWwgJiYgb05hdmlnYXRpb25QYXJhbWV0ZXIucmVxdWlyZXNTdGFuZGFyZFZhcmlhbnQpIHx8XG5cdFx0XHRcdFx0XHRcdCghb0ZpbHRlckJhclZNICYmIG9WaWV3LmdldFZpZXdEYXRhKCkuaW5pdGlhbExvYWQgPT09IEluaXRpYWxMb2FkTW9kZS5FbmFibGVkKSB8fFxuXHRcdFx0XHRcdFx0XHRvQ29udHJvbGxlci5fc2hvdWxkQXV0b1RyaWdnZXJTZWFyY2gob0ZpbHRlckJhclZNKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdG9GaWx0ZXJCYXJDb250cm9sLnRyaWdnZXJTZWFyY2goKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGJQcmV2ZW50SW5pdGlhbFNlYXJjaCA9IHRoaXMuX3ByZXZlbnRJbml0aWFsU2VhcmNoKG9GaWx0ZXJCYXJWTSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyByZXNldCB0aGUgc3VzcGVuZCBzZWxlY3Rpb24gb24gZmlsdGVyIGJhciB0byBhbGxvdyBsb2FkaW5nIG9mIGRhdGEgd2hlbiBuZWVkZWQgKHdhcyBzZXQgb24gTFIgSW5pdClcblx0XHRcdFx0XHRcdG9GaWx0ZXJCYXJDb250cm9sLnNldFN1c3BlbmRTZWxlY3Rpb24oZmFsc2UpO1xuXHRcdFx0XHRcdFx0dGhpcy5fYlNlYXJjaFRyaWdnZXJlZCA9ICFiUHJldmVudEluaXRpYWxTZWFyY2g7XG5cdFx0XHRcdFx0XHRvRHluYW1pY1BhZ2Uuc2V0SGVhZGVyRXhwYW5kZWQoc3lzdGVtLmRlc2t0b3AgfHwgYlByZXZlbnRJbml0aWFsU2VhcmNoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKFwiVmFyaWFudCBJRCBjYW5ub3QgYmUgYXBwbGllZFwiKTtcblx0XHRcdFx0fSlcblx0XHQpO1xuXHR9LFxuXG5cdGhhbmRsZVZhcmlhbnRJZFBhc3NlZFZpYVVSTFBhcmFtczogZnVuY3Rpb24gKHRoaXM6IFZpZXdTdGF0ZSAmIHR5cGVvZiBWaWV3U3RhdGVPdmVycmlkZSwgb1VybFBhcmFtczogYW55KSB7XG5cdFx0Y29uc3QgYVBhZ2VWYXJpYW50SWQgPSBvVXJsUGFyYW1zW1wic2FwLXVpLWZlLXZhcmlhbnQtaWRcIl0sXG5cdFx0XHRhRmlsdGVyQmFyVmFyaWFudElkID0gb1VybFBhcmFtc1tcInNhcC11aS1mZS1maWx0ZXJiYXItdmFyaWFudC1pZFwiXSxcblx0XHRcdGFUYWJsZVZhcmlhbnRJZCA9IG9VcmxQYXJhbXNbXCJzYXAtdWktZmUtdGFibGUtdmFyaWFudC1pZFwiXTtcblx0XHRsZXQgb1ZhcmlhbnQ7XG5cdFx0aWYgKGFQYWdlVmFyaWFudElkIHx8IGFGaWx0ZXJCYXJWYXJpYW50SWQgfHwgYVRhYmxlVmFyaWFudElkKSB7XG5cdFx0XHRvVmFyaWFudCA9IHtcblx0XHRcdFx0c1BhZ2VWYXJpYW50SWQ6IGFQYWdlVmFyaWFudElkICYmIGFQYWdlVmFyaWFudElkWzBdLFxuXHRcdFx0XHRzRmlsdGVyQmFyVmFyaWFudElkOiBhRmlsdGVyQmFyVmFyaWFudElkICYmIGFGaWx0ZXJCYXJWYXJpYW50SWRbMF0sXG5cdFx0XHRcdHNUYWJsZVZhcmlhbnRJZDogYVRhYmxlVmFyaWFudElkICYmIGFUYWJsZVZhcmlhbnRJZFswXVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2hhbmRsZUNvbnRyb2xWYXJpYW50SWQob1ZhcmlhbnQpO1xuXHR9LFxuXG5cdF9oYW5kbGVDb250cm9sVmFyaWFudElkOiBmdW5jdGlvbiAodGhpczogVmlld1N0YXRlICYgdHlwZW9mIFZpZXdTdGF0ZU92ZXJyaWRlLCBvVmFyaWFudElEczogYW55KSB7XG5cdFx0bGV0IG9WTTogVmFyaWFudE1hbmFnZW1lbnQ7XG5cdFx0Y29uc3Qgb1ZpZXcgPSB0aGlzLmdldFZpZXcoKSxcblx0XHRcdGFQcm9taXNlczogYW55W10gPSBbXTtcblx0XHRjb25zdCBzVmFyaWFudE1hbmFnZW1lbnQgPSBvVmlldy5nZXRWaWV3RGF0YSgpLnZhcmlhbnRNYW5hZ2VtZW50O1xuXHRcdGlmIChvVmFyaWFudElEcyAmJiBvVmFyaWFudElEcy5zUGFnZVZhcmlhbnRJZCAmJiBzVmFyaWFudE1hbmFnZW1lbnQgPT09IFwiUGFnZVwiKSB7XG5cdFx0XHRvVk0gPSBvVmlldy5ieUlkKFwiZmU6OlBhZ2VWYXJpYW50TWFuYWdlbWVudFwiKTtcblx0XHRcdG9WTS5nZXRWYXJpYW50cygpLmZvckVhY2goKG9WYXJpYW50OiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKG9WYXJpYW50LmtleSA9PT0gb1ZhcmlhbnRJRHMuc1BhZ2VWYXJpYW50SWQpIHtcblx0XHRcdFx0XHRhUHJvbWlzZXMucHVzaCh0aGlzLl9hcHBseUNvbnRyb2xWYXJpYW50KG9WTSwgb1ZhcmlhbnRJRHMuc1BhZ2VWYXJpYW50SWQsIHRydWUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChvVmFyaWFudElEcyAmJiBzVmFyaWFudE1hbmFnZW1lbnQgPT09IFwiQ29udHJvbFwiKSB7XG5cdFx0XHRpZiAob1ZhcmlhbnRJRHMuc0ZpbHRlckJhclZhcmlhbnRJZCkge1xuXHRcdFx0XHRvVk0gPSBvVmlldy5nZXRDb250cm9sbGVyKCkuX2dldEZpbHRlckJhclZhcmlhbnRDb250cm9sKCk7XG5cdFx0XHRcdGlmIChvVk0pIHtcblx0XHRcdFx0XHRvVk0uZ2V0VmFyaWFudHMoKS5mb3JFYWNoKChvVmFyaWFudDogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAob1ZhcmlhbnQua2V5ID09PSBvVmFyaWFudElEcy5zRmlsdGVyQmFyVmFyaWFudElkKSB7XG5cdFx0XHRcdFx0XHRcdGFQcm9taXNlcy5wdXNoKHRoaXMuX2FwcGx5Q29udHJvbFZhcmlhbnQob1ZNLCBvVmFyaWFudElEcy5zRmlsdGVyQmFyVmFyaWFudElkLCB0cnVlKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvVmFyaWFudElEcy5zVGFibGVWYXJpYW50SWQpIHtcblx0XHRcdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCksXG5cdFx0XHRcdFx0YVRhYmxlcyA9IG9Db250cm9sbGVyLl9nZXRDb250cm9scyhcInRhYmxlXCIpO1xuXHRcdFx0XHRhVGFibGVzLmZvckVhY2goKG9UYWJsZTogYW55KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgb1RhYmxlVmFyaWFudCA9IG9UYWJsZS5nZXRWYXJpYW50KCk7XG5cdFx0XHRcdFx0aWYgKG9UYWJsZSAmJiBvVGFibGVWYXJpYW50KSB7XG5cdFx0XHRcdFx0XHRvVGFibGVWYXJpYW50LmdldFZhcmlhbnRzKCkuZm9yRWFjaCgob1ZhcmlhbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAob1ZhcmlhbnQua2V5ID09PSBvVmFyaWFudElEcy5zVGFibGVWYXJpYW50SWQpIHtcblx0XHRcdFx0XHRcdFx0XHRhUHJvbWlzZXMucHVzaCh0aGlzLl9hcHBseUNvbnRyb2xWYXJpYW50KG9UYWJsZVZhcmlhbnQsIG9WYXJpYW50SURzLnNUYWJsZVZhcmlhbnRJZCkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoYVByb21pc2VzKTtcblx0fSxcblxuXHRfYXBwbHlDb250cm9sVmFyaWFudDogZnVuY3Rpb24gKG9WYXJpYW50OiBhbnksIHNWYXJpYW50SUQ6IGFueSwgYkZpbHRlclZhcmlhbnRBcHBsaWVkOiBhbnkpIHtcblx0XHRjb25zdCBzVmFyaWFudFJlZmVyZW5jZSA9IHRoaXMuX2NoZWNrSWZWYXJpYW50SWRJc0F2YWlsYWJsZShvVmFyaWFudCwgc1ZhcmlhbnRJRCkgPyBzVmFyaWFudElEIDogb1ZhcmlhbnQuZ2V0U3RhbmRhcmRWYXJpYW50S2V5KCk7XG5cdFx0Y29uc3Qgb1ZNID0gQ29udHJvbFZhcmlhbnRBcHBseUFQSS5hY3RpdmF0ZVZhcmlhbnQoe1xuXHRcdFx0ZWxlbWVudDogb1ZhcmlhbnQsXG5cdFx0XHR2YXJpYW50UmVmZXJlbmNlOiBzVmFyaWFudFJlZmVyZW5jZVxuXHRcdH0pO1xuXHRcdHJldHVybiBvVk0udGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gYkZpbHRlclZhcmlhbnRBcHBsaWVkO1xuXHRcdH0pO1xuXHR9LFxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBwcml2YXRlIGhlbHBlciAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRfZ2V0RmlsdGVyQmFyVk06IGZ1bmN0aW9uIChvVmlldzogYW55KSB7XG5cdFx0Y29uc3Qgb1ZpZXdEYXRhID0gb1ZpZXcuZ2V0Vmlld0RhdGEoKTtcblx0XHRzd2l0Y2ggKG9WaWV3RGF0YS52YXJpYW50TWFuYWdlbWVudCkge1xuXHRcdFx0Y2FzZSBWYXJpYW50TWFuYWdlbWVudFR5cGUuUGFnZTpcblx0XHRcdFx0cmV0dXJuIG9WaWV3LmJ5SWQoXCJmZTo6UGFnZVZhcmlhbnRNYW5hZ2VtZW50XCIpO1xuXHRcdFx0Y2FzZSBWYXJpYW50TWFuYWdlbWVudFR5cGUuQ29udHJvbDpcblx0XHRcdFx0cmV0dXJuIG9WaWV3LmdldENvbnRyb2xsZXIoKS5fZ2V0RmlsdGVyQmFyVmFyaWFudENvbnRyb2woKTtcblx0XHRcdGNhc2UgVmFyaWFudE1hbmFnZW1lbnRUeXBlLk5vbmU6XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgdmFyaWFudCBzZXR0aW5nOiAke29WaWV3RGF0YS52YXJpYW50TWFuYWdlbWVudH1gKTtcblx0XHR9XG5cdH0sXG5cblx0X3ByZXZlbnRJbml0aWFsU2VhcmNoOiBmdW5jdGlvbiAob1ZhcmlhbnRNYW5hZ2VtZW50OiBhbnkpIHtcblx0XHRpZiAoIW9WYXJpYW50TWFuYWdlbWVudCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IGFWYXJpYW50cyA9IG9WYXJpYW50TWFuYWdlbWVudC5nZXRWYXJpYW50cygpO1xuXHRcdGNvbnN0IG9DdXJyZW50VmFyaWFudCA9IGFWYXJpYW50cy5maW5kKGZ1bmN0aW9uIChvSXRlbTogYW55KSB7XG5cdFx0XHRyZXR1cm4gb0l0ZW0ua2V5ID09PSBvVmFyaWFudE1hbmFnZW1lbnQuZ2V0Q3VycmVudFZhcmlhbnRLZXkoKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gIW9DdXJyZW50VmFyaWFudC5leGVjdXRlT25TZWxlY3Q7XG5cdH0sXG5cblx0X2FwcGx5U2VsZWN0aW9uVmFyaWFudDogZnVuY3Rpb24gKG9WaWV3OiBhbnksIG9OYXZpZ2F0aW9uUGFyYW1ldGVyOiBhbnksIGJGaWx0ZXJWYXJpYW50QXBwbGllZDogYW55KSB7XG5cdFx0Y29uc3Qgb0ZpbHRlckJhciA9IG9WaWV3LmdldENvbnRyb2xsZXIoKS5fZ2V0RmlsdGVyQmFyQ29udHJvbCgpLFxuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnQgPSBvTmF2aWdhdGlvblBhcmFtZXRlci5zZWxlY3Rpb25WYXJpYW50LFxuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnREZWZhdWx0cyA9IG9OYXZpZ2F0aW9uUGFyYW1ldGVyLnNlbGVjdGlvblZhcmlhbnREZWZhdWx0cztcblx0XHRpZiAoIW9GaWx0ZXJCYXIgfHwgIW9TZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXHRcdGxldCBvQ29uZGl0aW9ucyA9IHt9O1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvVmlldy5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpO1xuXHRcdGNvbnN0IG9WaWV3RGF0YSA9IG9WaWV3LmdldFZpZXdEYXRhKCk7XG5cdFx0Y29uc3Qgc0NvbnRleHRQYXRoID0gb1ZpZXdEYXRhLmNvbnRleHRQYXRoIHx8IGAvJHtvVmlld0RhdGEuZW50aXR5U2V0fWA7XG5cdFx0Y29uc3QgYU1hbmRhdG9yeUZpbHRlckZpZWxkcyA9IENvbW1vblV0aWxzLmdldE1hbmRhdG9yeUZpbHRlckZpZWxkcyhvTWV0YU1vZGVsLCBzQ29udGV4dFBhdGgpO1xuXHRcdGNvbnN0IGJVc2VTZW1hbnRpY0RhdGVSYW5nZSA9IG9GaWx0ZXJCYXIuZGF0YShcInVzZVNlbWFudGljRGF0ZVJhbmdlXCIpO1xuXHRcdGxldCBvVmFyaWFudDtcblx0XHRzd2l0Y2ggKG9WaWV3RGF0YS52YXJpYW50TWFuYWdlbWVudCkge1xuXHRcdFx0Y2FzZSBWYXJpYW50TWFuYWdlbWVudFR5cGUuUGFnZTpcblx0XHRcdFx0b1ZhcmlhbnQgPSBvVmlldy5ieUlkKFwiZmU6OlBhZ2VWYXJpYW50TWFuYWdlbWVudFwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFZhcmlhbnRNYW5hZ2VtZW50VHlwZS5Db250cm9sOlxuXHRcdFx0XHRvVmFyaWFudCA9IG9WaWV3LmdldENvbnRyb2xsZXIoKS5fZ2V0RmlsdGVyQmFyVmFyaWFudENvbnRyb2woKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFZhcmlhbnRNYW5hZ2VtZW50VHlwZS5Ob25lOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGNvbnN0IGJSZXF1aXJlc1N0YW5kYXJkVmFyaWFudCA9IG9OYXZpZ2F0aW9uUGFyYW1ldGVyLnJlcXVpcmVzU3RhbmRhcmRWYXJpYW50O1xuXHRcdC8vIGNoZWNrIGlmIEZMUCBkZWZhdWx0IHZhbHVlcyBhcmUgdGhlcmUgYW5kIGlzIGl0IHN0YW5kYXJkIHZhcmlhbnRcblx0XHRjb25zdCBiSXNGTFBWYWx1ZVByZXNlbnQ6IGJvb2xlYW4gPVxuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnREZWZhdWx0cyAmJlxuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnREZWZhdWx0cy5nZXRTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcygpLmxlbmd0aCA+IDAgJiZcblx0XHRcdG9WYXJpYW50LmdldERlZmF1bHRWYXJpYW50S2V5KCkgPT09IG9WYXJpYW50LmdldFN0YW5kYXJkVmFyaWFudEtleSgpICYmXG5cdFx0XHRvTmF2aWdhdGlvblBhcmFtZXRlci5iTmF2U2VsVmFySGFzRGVmYXVsdHNPbmx5O1xuXG5cdFx0Ly8gZ2V0IGNvbmRpdGlvbnMgd2hlbiBGTFAgdmFsdWUgaXMgcHJlc2VudFxuXHRcdGlmIChiRmlsdGVyVmFyaWFudEFwcGxpZWQgfHwgYklzRkxQVmFsdWVQcmVzZW50KSB7XG5cdFx0XHRvQ29uZGl0aW9ucyA9IG9GaWx0ZXJCYXIuZ2V0Q29uZGl0aW9ucygpO1xuXHRcdH1cblx0XHRDb21tb25VdGlscy5hZGREZWZhdWx0RGlzcGxheUN1cnJlbmN5KGFNYW5kYXRvcnlGaWx0ZXJGaWVsZHMsIG9TZWxlY3Rpb25WYXJpYW50LCBvU2VsZWN0aW9uVmFyaWFudERlZmF1bHRzKTtcblx0XHRDb21tb25VdGlscy5hZGRTZWxlY3Rpb25WYXJpYW50VG9Db25kaXRpb25zKFxuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnQsXG5cdFx0XHRvQ29uZGl0aW9ucyxcblx0XHRcdG9NZXRhTW9kZWwsXG5cdFx0XHRzQ29udGV4dFBhdGgsXG5cdFx0XHRiSXNGTFBWYWx1ZVByZXNlbnQsXG5cdFx0XHRiVXNlU2VtYW50aWNEYXRlUmFuZ2UsXG5cdFx0XHRvVmlld0RhdGFcblx0XHQpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2FjdGl2YXRlU2VsZWN0aW9uVmFyaWFudChvRmlsdGVyQmFyLCBvQ29uZGl0aW9ucywgb1ZhcmlhbnQsIGJSZXF1aXJlc1N0YW5kYXJkVmFyaWFudCwgYkZpbHRlclZhcmlhbnRBcHBsaWVkKTtcblx0fSxcblx0X2FjdGl2YXRlU2VsZWN0aW9uVmFyaWFudDogZnVuY3Rpb24gKFxuXHRcdG9GaWx0ZXJCYXI6IGFueSxcblx0XHRvQ29uZGl0aW9uczogYW55LFxuXHRcdG9WYXJpYW50OiBhbnksXG5cdFx0YlJlcXVpcmVzU3RhbmRhcmRWYXJpYW50OiBhbnksXG5cdFx0YkZpbHRlclZhcmlhbnRBcHBsaWVkOiBhbnlcblx0KSB7XG5cdFx0bGV0IG9Qcm9taXNlO1xuXG5cdFx0aWYgKG9WYXJpYW50ICYmICFiRmlsdGVyVmFyaWFudEFwcGxpZWQpIHtcblx0XHRcdGxldCBvVmFyaWFudEtleSA9IGJSZXF1aXJlc1N0YW5kYXJkVmFyaWFudCA/IG9WYXJpYW50LmdldFN0YW5kYXJkVmFyaWFudEtleSgpIDogb1ZhcmlhbnQuZ2V0RGVmYXVsdFZhcmlhbnRLZXkoKTtcblx0XHRcdGlmIChvVmFyaWFudEtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRvVmFyaWFudEtleSA9IG9WYXJpYW50LmdldElkKCk7XG5cdFx0XHR9XG5cdFx0XHRvUHJvbWlzZSA9IENvbnRyb2xWYXJpYW50QXBwbHlBUEkuYWN0aXZhdGVWYXJpYW50KHtcblx0XHRcdFx0ZWxlbWVudDogb1ZhcmlhbnQsXG5cdFx0XHRcdHZhcmlhbnRSZWZlcmVuY2U6IG9WYXJpYW50S2V5XG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIGJSZXF1aXJlc1N0YW5kYXJkVmFyaWFudCB8fCBvVmFyaWFudC5nZXREZWZhdWx0VmFyaWFudEtleSgpID09PSBvVmFyaWFudC5nZXRTdGFuZGFyZFZhcmlhbnRLZXkoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9Qcm9taXNlLnRoZW4oKGJDbGVhckZpbHRlckFuZFJlcGxhY2VXaXRoQXBwU3RhdGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKGJDbGVhckZpbHRlckFuZFJlcGxhY2VXaXRoQXBwU3RhdGUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZuQXBwbHlDb25kaXRpb25zKG9GaWx0ZXJCYXIsIG9Db25kaXRpb25zKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRfZm5BcHBseUNvbmRpdGlvbnM6IGZ1bmN0aW9uIChvRmlsdGVyQmFyOiBhbnksIG9Db25kaXRpb25zOiBhbnkpIHtcblx0XHRjb25zdCBtRmlsdGVyOiBhbnkgPSB7fSxcblx0XHRcdGFJdGVtczogYW55W10gPSBbXSxcblx0XHRcdGZuQWRqdXN0VmFsdWVIZWxwQ29uZGl0aW9uID0gZnVuY3Rpb24gKG9Db25kaXRpb246IGFueSkge1xuXHRcdFx0XHQvLyBpbiBjYXNlIHRoZSBjb25kaXRpb24gaXMgbWVhbnQgZm9yIGEgZmllbGQgaGF2aW5nIGEgVkgsIHRoZSBmb3JtYXQgcmVxdWlyZWQgYnkgTURDIGRpZmZlcnNcblx0XHRcdFx0b0NvbmRpdGlvbi52YWxpZGF0ZWQgPSBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkO1xuXHRcdFx0XHRpZiAob0NvbmRpdGlvbi5vcGVyYXRvciA9PT0gXCJFbXB0eVwiKSB7XG5cdFx0XHRcdFx0b0NvbmRpdGlvbi5vcGVyYXRvciA9IFwiRVFcIjtcblx0XHRcdFx0XHRvQ29uZGl0aW9uLnZhbHVlcyA9IFtcIlwiXTtcblx0XHRcdFx0fSBlbHNlIGlmIChvQ29uZGl0aW9uLm9wZXJhdG9yID09PSBcIk5vdEVtcHR5XCIpIHtcblx0XHRcdFx0XHRvQ29uZGl0aW9uLm9wZXJhdG9yID0gXCJORVwiO1xuXHRcdFx0XHRcdG9Db25kaXRpb24udmFsdWVzID0gW1wiXCJdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSBvQ29uZGl0aW9uLmlzRW1wdHk7XG5cdFx0XHR9O1xuXHRcdGNvbnN0IGZuR2V0UHJvcGVydHlJbmZvID0gZnVuY3Rpb24gKG9GaWx0ZXJDb250cm9sOiBhbnksIHNFbnRpdHlUeXBlUGF0aDogYW55KSB7XG5cdFx0XHRjb25zdCBzRW50aXR5U2V0UGF0aCA9IE1vZGVsSGVscGVyLmdldEVudGl0eVNldFBhdGgoc0VudGl0eVR5cGVQYXRoKSxcblx0XHRcdFx0b01ldGFNb2RlbCA9IG9GaWx0ZXJDb250cm9sLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRcdG9GUiA9IENvbW1vblV0aWxzLmdldEZpbHRlclJlc3RyaWN0aW9uc0J5UGF0aChzRW50aXR5U2V0UGF0aCwgb01ldGFNb2RlbCksXG5cdFx0XHRcdGFOb25GaWx0ZXJhYmxlUHJvcHMgPSBvRlJbRmlsdGVyUmVzdHJpY3Rpb25zLk5PTl9GSUxURVJBQkxFX1BST1BFUlRJRVNdLFxuXHRcdFx0XHRtRmlsdGVyRmllbGRzID0gRmlsdGVyVXRpbHMuZ2V0Q29udmVydGVkRmlsdGVyRmllbGRzKG9GaWx0ZXJDb250cm9sLCBzRW50aXR5VHlwZVBhdGgpLFxuXHRcdFx0XHRhUHJvcGVydHlJbmZvOiBhbnlbXSA9IFtdO1xuXHRcdFx0T2JqZWN0LmtleXMobUZpbHRlckZpZWxkcykuZm9yRWFjaChmdW5jdGlvbiAoc0ZpbHRlckZpZWxkS2V5OiBzdHJpbmcpIHtcblx0XHRcdFx0Y29uc3Qgb0NvbnZlcnRlZFByb3BlcnR5ID0gbUZpbHRlckZpZWxkc1tzRmlsdGVyRmllbGRLZXldO1xuXHRcdFx0XHRjb25zdCBzUHJvcGVydHlQYXRoID0gb0NvbnZlcnRlZFByb3BlcnR5LmNvbmRpdGlvblBhdGgucmVwbGFjZShDT05ESVRJT05fUEFUSF9UT19QUk9QRVJUWV9QQVRIX1JFR0VYLCBcIlwiKTtcblx0XHRcdFx0aWYgKGFOb25GaWx0ZXJhYmxlUHJvcHMuaW5kZXhPZihzUHJvcGVydHlQYXRoKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRjb25zdCBzQW5ub3RhdGlvblBhdGggPSBvQ29udmVydGVkUHJvcGVydHkuYW5ub3RhdGlvblBhdGg7XG5cdFx0XHRcdFx0Y29uc3Qgb1Byb3BlcnR5Q29udGV4dCA9IG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoc0Fubm90YXRpb25QYXRoKTtcblx0XHRcdFx0XHRhUHJvcGVydHlJbmZvLnB1c2goe1xuXHRcdFx0XHRcdFx0cGF0aDogb0NvbnZlcnRlZFByb3BlcnR5LmNvbmRpdGlvblBhdGgsXG5cdFx0XHRcdFx0XHRoaWRkZW5GaWx0ZXI6IG9Db252ZXJ0ZWRQcm9wZXJ0eS5hdmFpbGFiaWxpdHkgPT09IFwiSGlkZGVuXCIsXG5cdFx0XHRcdFx0XHRoYXNWYWx1ZUhlbHA6ICFzQW5ub3RhdGlvblBhdGhcblx0XHRcdFx0XHRcdFx0PyBmYWxzZVxuXHRcdFx0XHRcdFx0XHQ6IFByb3BlcnR5Rm9ybWF0dGVycy5oYXNWYWx1ZUhlbHAob1Byb3BlcnR5Q29udGV4dC5nZXRPYmplY3QoKSwgeyBjb250ZXh0OiBvUHJvcGVydHlDb250ZXh0IH0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGFQcm9wZXJ0eUluZm87XG5cdFx0fTtcblx0XHRyZXR1cm4gb0ZpbHRlckJhci53YWl0Rm9ySW5pdGlhbGl6YXRpb24oKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnN0IHNFbnRpdHlUeXBlUGF0aCA9IERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9GaWx0ZXJCYXIsIFwiZW50aXR5VHlwZVwiKTtcblx0XHRcdGNvbnN0IGFQcm9wZXJ0eUluZm8gPSBmbkdldFByb3BlcnR5SW5mbyhvRmlsdGVyQmFyLCBzRW50aXR5VHlwZVBhdGgpO1xuXHRcdFx0YVByb3BlcnR5SW5mb1xuXHRcdFx0XHQuZmlsdGVyKGZ1bmN0aW9uIChvUHJvcGVydHlJbmZvOiBhbnkpIHtcblx0XHRcdFx0XHRyZXR1cm4gb1Byb3BlcnR5SW5mby5wYXRoICE9PSBcIiRlZGl0U3RhdGVcIiAmJiBvUHJvcGVydHlJbmZvLnBhdGggIT09IFwiJHNlYXJjaFwiO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZm9yRWFjaChmdW5jdGlvbiAob1Byb3BlcnR5SW5mbzogYW55KSB7XG5cdFx0XHRcdFx0aWYgKG9Qcm9wZXJ0eUluZm8ucGF0aCBpbiBvQ29uZGl0aW9ucykge1xuXHRcdFx0XHRcdFx0bUZpbHRlcltvUHJvcGVydHlJbmZvLnBhdGhdID0gb0NvbmRpdGlvbnNbb1Byb3BlcnR5SW5mby5wYXRoXTtcblx0XHRcdFx0XHRcdGlmICghb1Byb3BlcnR5SW5mby5oaWRkZW5GaWx0ZXIpIHtcblx0XHRcdFx0XHRcdFx0YUl0ZW1zLnB1c2goeyBuYW1lOiBvUHJvcGVydHlJbmZvLnBhdGggfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAob1Byb3BlcnR5SW5mby5oYXNWYWx1ZUhlbHApIHtcblx0XHRcdFx0XHRcdFx0bUZpbHRlcltvUHJvcGVydHlJbmZvLnBhdGhdLmZvckVhY2goZm5BZGp1c3RWYWx1ZUhlbHBDb25kaXRpb24pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bUZpbHRlcltvUHJvcGVydHlJbmZvLnBhdGhdLmZvckVhY2goZnVuY3Rpb24gKG9Db25kaXRpb246IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdG9Db25kaXRpb24udmFsaWRhdGVkID0gb0NvbmRpdGlvbi5maWx0ZXJlZCA/IENvbmRpdGlvblZhbGlkYXRlZC5Ob3RWYWxpZGF0ZWQgOiBvQ29uZGl0aW9uLnZhbGlkYXRlZDtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1GaWx0ZXJbb1Byb3BlcnR5SW5mby5wYXRoXSA9IFtdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gU3RhdGVVdGlsLmFwcGx5RXh0ZXJuYWxTdGF0ZShvRmlsdGVyQmFyLCB7IGZpbHRlcjogbUZpbHRlciwgaXRlbXM6IGFJdGVtcyB9KTtcblx0XHR9KTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVmlld1N0YXRlT3ZlcnJpZGU7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQW1CQSxJQUFNQSxPQUFPLEdBQUdDLFVBQVUsQ0FBQ0QsT0FBM0I7RUFBQSxJQUNDRSxxQkFBcUIsR0FBR0MsV0FBVyxDQUFDQyxpQkFEckM7RUFBQSxJQUVDQyxtQkFBbUIsR0FBR0YsV0FBVyxDQUFDRSxtQkFGbkM7RUFBQSxJQUdDQyxlQUFlLEdBQUdILFdBQVcsQ0FBQ0csZUFIL0I7RUFJQSxJQUFNQyxrQkFBa0IsR0FBR0MsV0FBVyxDQUFDRCxrQkFBdkM7RUFBQSxJQUNDRSxxQ0FBcUMsR0FBRyxRQUR6QztFQUdBLElBQU1DLGlCQUFzQixHQUFHO0lBQzlCQyxpQkFBaUIsRUFBRSxLQURXO0lBRTlCQyxxQkFBcUIsRUFBRSxZQUFZO01BQ2xDLE9BQU8sSUFBUDtJQUNBLENBSjZCO0lBSzlCQyxvQkFBb0IsRUFBRSxVQUFzREMsU0FBdEQsRUFBc0U7TUFDM0YsSUFBTUMsS0FBSyxHQUFHLEtBQUtDLE9BQUwsRUFBZDtNQUFBLElBQ0NDLFdBQVcsR0FBR0YsS0FBSyxDQUFDRyxhQUFOLEVBRGY7TUFBQSxJQUVDQyxVQUFVLEdBQUdGLFdBQVcsQ0FBQ0csb0JBQVosRUFGZDtNQUFBLElBR0NDLE9BQU8sR0FBR0osV0FBVyxDQUFDSyxZQUFaLENBQXlCLE9BQXpCLENBSFg7O01BSUEsSUFBSUgsVUFBSixFQUFnQjtRQUNmQSxVQUFVLENBQUNJLG1CQUFYLENBQStCLElBQS9CO1FBQ0FULFNBQVMsQ0FBQ1UsSUFBVixDQUFnQkws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