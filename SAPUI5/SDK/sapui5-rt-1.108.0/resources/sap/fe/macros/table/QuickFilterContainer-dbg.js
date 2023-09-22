/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/StableIdHelper", "sap/fe/macros/chart/ChartUtils", "sap/fe/macros/DelegateUtil", "sap/fe/macros/table/Utils", "sap/m/SegmentedButton", "sap/m/SegmentedButtonItem", "sap/m/Select", "sap/ui/core/Control", "sap/ui/core/Core", "sap/ui/core/Item", "sap/ui/model/json/JSONModel"], function (Log, CommonUtils, ClassSupport, StableIdHelper, ChartUtils, DelegateUtil, TableUtils, SegmentedButton, SegmentedButtonItem, Select, Control, Core, Item, JSONModel) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

  var generate = StableIdHelper.generate;
  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var PROPERTY_QUICKFILTER_KEY = "quickFilterKey";
  var FILTER_MODEL = "filters";
  /**
   *  Container Control for Table QuickFilters
   *
   * @private
   * @experimental This module is only for internal/experimental use!
   */

  var QuickFilterContainer = (_dec = defineUI5Class("sap.fe.macros.table.QuickFilterContainer", {
    interfaces: ["sap.m.IOverflowToolbarContent"]
  }), _dec2 = property({
    type: "boolean"
  }), _dec3 = property({
    type: "boolean"
  }), _dec4 = property({
    type: "string"
  }), _dec5 = property({
    type: "string"
  }), _dec6 = property({
    type: "string",
    defaultValue: "$auto"
  }), _dec7 = aggregation({
    type: "sap.ui.core.Control",
    multiple: false,
    isDefault: true
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_Control) {
    _inheritsLoose(QuickFilterContainer, _Control);

    function QuickFilterContainer() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Control.call.apply(_Control, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "enabled", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "showCounts", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "entitySet", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "parentEntityType", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "batchGroupId", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "selector", _descriptor6, _assertThisInitialized(_this));

      _this._attachedToView = false;
      return _this;
    }

    QuickFilterContainer.render = function render(oRm, oControl) {
      oRm.renderControl(oControl.selector);
    };

    var _proto = QuickFilterContainer.prototype;

    _proto.init = function init() {
      var _this2 = this;

      _Control.prototype.init.call(this);

      this._attachedToView = false;
      this.attachEvent("modelContextChange", this._initControl);
      var oDelegateOnBeforeRendering = {
        onBeforeRendering: function () {
          // Need to wait for Control rendering to get parent view (.i.e into OP the highest parent is the Object Section)
          _this2._createControlSideEffects();

          _this2._attachedToView = true;

          _this2.removeEventDelegate(oDelegateOnBeforeRendering);
        }
      };
      this.addEventDelegate(oDelegateOnBeforeRendering, this);
    };

    _proto._initControl = function _initControl(oEvent) {
      // Need to wait for the OData Model to be propagated (models are propagated one by one when we come from FLP)
      if (this.getModel()) {
        this.detachEvent(oEvent.getId(), this._initControl);

        this._manageTable();

        this._createContent();
      }
    };

    _proto._manageTable = function _manageTable() {
      var oControl = this.getParent();

      var oModel = this._getFilterModel(),
          aFilters = oModel.getObject("/paths"),
          sDefaultFilter = Array.isArray(aFilters) && aFilters.length > 0 ? aFilters[0].annotationPath : undefined;

      while (oControl && !oControl.isA("sap.ui.mdc.Table")) {
        oControl = oControl.getParent();
      }

      this._oTable = oControl;

      if (this.showCounts) {
        this._oTable.getParent().attachEvent("internalDataRequested", this._updateCounts.bind(this));
      }

      DelegateUtil.setCustomData(oControl, PROPERTY_QUICKFILTER_KEY, sDefaultFilter);
    };

    _proto.setSelectorKey = function setSelectorKey(sKey) {
      var oSelector = this.selector;

      if (oSelector && oSelector.getSelectedKey() !== sKey) {
        oSelector.setSelectedKey(sKey);
        DelegateUtil.setCustomData(this._oTable, PROPERTY_QUICKFILTER_KEY, sKey); // Rebind the table to reflect the change in quick filter key.
        // We don't rebind the table if the filterbar for the table is suspended
        // as rebind will be done when the filterbar is resumed

        var sFilterBarID = this._oTable.getFilter && this._oTable.getFilter();

        var oFilterBar = sFilterBarID && Core.byId(sFilterBarID);
        var bSkipRebind = oFilterBar && oFilterBar.getSuspendSelection && oFilterBar.getSuspendSelection();

        if (!bSkipRebind) {
          this._oTable.rebind();
        }
      }
    };

    _proto.getSelectorKey = function getSelectorKey() {
      var oSelector = this.selector;
      return oSelector ? oSelector.getSelectedKey() : null;
    };

    _proto.getDomRef = function getDomRef(sSuffix) {
      var oSelector = this.selector;
      return oSelector ? oSelector.getDomRef(sSuffix) : null;
    };

    _proto._getFilterModel = function _getFilterModel() {
      var oModel = this.getModel(FILTER_MODEL);

      if (!oModel) {
        var mFilters = DelegateUtil.getCustomData(this, FILTER_MODEL);
        oModel = new JSONModel(mFilters);
        this.setModel(oModel, FILTER_MODEL);
      }

      return oModel;
    }
    /**
     * Create QuickFilter Selector (Select or SegmentedButton).
     */
    ;

    _proto._createContent = function _createContent() {
      var _this3 = this;

      var oModel = this._getFilterModel(),
          aFilters = oModel.getObject("/paths"),
          bIsSelect = aFilters.length > 3,
          mSelectorOptions = {
        id: generate([this._oTable.getId(), "QuickFilter"]),
        enabled: this.getBindingInfo("enabled"),
        items: {
          path: "".concat(FILTER_MODEL, ">/paths"),
          factory: function (sId, oBindingContext) {
            var mItemOptions = {
              key: oBindingContext.getObject().annotationPath,
              text: _this3._getSelectorItemText(oBindingContext)
            };
            return bIsSelect ? new Item(mItemOptions) : new SegmentedButtonItem(mItemOptions);
          }
        }
      };

      if (bIsSelect) {
        mSelectorOptions.autoAdjustWidth = true;
      }

      mSelectorOptions[bIsSelect ? "change" : "selectionChange"] = this._onSelectionChange.bind(this);
      this.selector = bIsSelect ? new Select(mSelectorOptions) : new SegmentedButton(mSelectorOptions);
    }
    /**
     * Returns properties for the interface IOverflowToolbarContent.
     *
     * @returns {Object} Returns the configuration of IOverflowToolbarContent
     */
    ;

    _proto.getOverflowToolbarConfig = function getOverflowToolbarConfig() {
      return {
        canOverflow: true
      };
    }
    /**
     * Creates SideEffects control that must be executed when table cells that are related to configured filter(s) change.
     *
     */
    ;

    _proto._createControlSideEffects = function _createControlSideEffects() {
      var _this4 = this;

      var oSvControl = this.selector,
          oSvItems = oSvControl.getItems(),
          sTableNavigationPath = DelegateUtil.getCustomData(this._oTable, "navigationPath");
      /**
       * Cannot execute SideEffects with targetEntity = current Table collection
       */

      if (sTableNavigationPath) {
        (function () {
          var aSourceProperties = [];

          for (var k in oSvItems) {
            var sItemKey = oSvItems[k].getKey(),
                oFilterInfos = TableUtils.getFiltersInfoForSV(_this4._oTable, sItemKey);
            oFilterInfos.properties.forEach(function (sProperty) {
              var sPropertyPath = "".concat(sTableNavigationPath, "/").concat(sProperty);

              if (!aSourceProperties.includes(sPropertyPath)) {
                aSourceProperties.push(sPropertyPath);
              }
            });
          }

          _this4._getSideEffectController().addControlSideEffects(_this4.parentEntityType, {
            SourceProperties: aSourceProperties,
            TargetEntities: [{
              "$NavigationPropertyPath": sTableNavigationPath
            }],
            sourceControlId: _this4.getId()
          });
        })();
      }
    };

    _proto._getSelectorItemText = function _getSelectorItemText(oItemContext) {
      var annotationPath = oItemContext.getObject().annotationPath,
          itemPath = oItemContext.getPath(),
          oMetaModel = this.getModel().getMetaModel(),
          oQuickFilter = oMetaModel.getObject("".concat(this.entitySet, "/").concat(annotationPath));
      return oQuickFilter.Text + (this.showCounts ? " ({".concat(FILTER_MODEL, ">").concat(itemPath, "/count})") : "");
    };

    _proto._getSideEffectController = function _getSideEffectController() {
      var oController = this._getViewController();

      return oController ? oController._sideEffects : undefined;
    };

    _proto._getViewController = function _getViewController() {
      var oView = CommonUtils.getTargetView(this);
      return oView && oView.getController();
    }
    /**
     * Manage List Binding request related to Counts on QuickFilter control and update text
     * in line with batch result.
     *
     */
    ;

    _proto._updateCounts = function _updateCounts() {
      var oTable = this._oTable,
          oController = this._getViewController(),
          oSvControl = this.selector,
          oSvItems = oSvControl.getItems(),
          oModel = this._getFilterModel(),
          aBindingPromises = [],
          aInitialItemTexts = [];

      var aAdditionalFilters = [];
      var aChartFilters = [];
      var sCurrentFilterKey = DelegateUtil.getCustomData(oTable, PROPERTY_QUICKFILTER_KEY); // Add filters related to the chart for ALP

      if (oController && oController.getChartControl) {
        var oChart = oController.getChartControl();

        if (oChart) {
          var oChartFilterInfo = ChartUtils.getAllFilterInfo(oChart);

          if (oChartFilterInfo && oChartFilterInfo.filters.length) {
            aChartFilters = oChartFilterInfo.filters;
          }
        }
      }

      aAdditionalFilters = aAdditionalFilters.concat(TableUtils.getHiddenFilters(oTable)).concat(aChartFilters);

      for (var k in oSvItems) {
        var sItemKey = oSvItems[k].getKey(),
            oFilterInfos = TableUtils.getFiltersInfoForSV(oTable, sItemKey);
        aInitialItemTexts.push(oFilterInfos.text);
        oModel.setProperty("/paths/".concat(k, "/count"), "...");
        aBindingPromises.push(TableUtils.getListBindingForCount(oTable, oTable.getBindingContext(), {
          batchGroupId: sItemKey === sCurrentFilterKey ? this.batchGroupId : "$auto",
          additionalFilters: aAdditionalFilters.concat(oFilterInfos.filters)
        }));
      }

      Promise.all(aBindingPromises).then(function (aCounts) {
        for (var _k in aCounts) {
          oModel.setProperty("/paths/".concat(_k, "/count"), TableUtils.getCountFormatted(aCounts[_k]));
        }
      }).catch(function (oError) {
        Log.error("Error while retrieving the binding promises", oError);
      });
    };

    _proto._onSelectionChange = function _onSelectionChange(oEvent) {
      var oControl = oEvent.getSource();
      DelegateUtil.setCustomData(this._oTable, PROPERTY_QUICKFILTER_KEY, oControl.getSelectedKey());

      this._oTable.rebind();

      var oController = this._getViewController();

      if (oController && oController.getExtensionAPI && oController.getExtensionAPI().updateAppState) {
        oController.getExtensionAPI().updateAppState();
      }
    };

    _proto.destroy = function destroy(bSuppressInvalidate) {
      if (this._attachedToView) {
        var oSideEffects = this._getSideEffectController();

        if (oSideEffects) {
          // if "destroy" signal comes when view is destroyed there is not anymore reference to Controller Extension
          oSideEffects.removeControlSideEffects(this);
        }
      }

      delete this._oTable;

      _Control.prototype.destroy.call(this, bSuppressInvalidate);
    };

    return QuickFilterContainer;
  }(Control), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enabled", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "showCounts", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "entitySet", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "parentEntityType", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "batchGroupId", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "selector", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return QuickFilterContainer;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQUk9QRVJUWV9RVUlDS0ZJTFRFUl9LRVkiLCJGSUxURVJfTU9ERUwiLCJRdWlja0ZpbHRlckNvbnRhaW5lciIsImRlZmluZVVJNUNsYXNzIiwiaW50ZXJmYWNlcyIsInByb3BlcnR5IiwidHlwZSIsImRlZmF1bHRWYWx1ZSIsImFnZ3JlZ2F0aW9uIiwibXVsdGlwbGUiLCJpc0RlZmF1bHQiLCJfYXR0YWNoZWRUb1ZpZXciLCJyZW5kZXIiLCJvUm0iLCJvQ29udHJvbCIsInJlbmRlckNvbnRyb2wiLCJzZWxlY3RvciIsImluaXQiLCJhdHRhY2hFdmVudCIsIl9pbml0Q29udHJvbCIsIm9EZWxlZ2F0ZU9uQmVmb3JlUmVuZGVyaW5nIiwib25CZWZvcmVSZW5kZXJpbmciLCJfY3JlYXRlQ29udHJvbFNpZGVFZmZlY3RzIiwicmVtb3ZlRXZlbnREZWxlZ2F0ZSIsImFkZEV2ZW50RGVsZWdhdGUiLCJvRXZlbnQiLCJnZXRNb2RlbCIsImRldGFjaEV2ZW50IiwiZ2V0SWQiLCJfbWFuYWdlVGFibGUiLCJfY3JlYXRlQ29udGVudCIsImdldFBhcmVudCIsIm9Nb2RlbCIsIl9nZXRGaWx0ZXJNb2RlbCIsImFGaWx0ZXJzIiwiZ2V0T2JqZWN0Iiwic0RlZmF1bHRGaWx0ZXIiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJhbm5vdGF0aW9uUGF0aCIsInVuZGVmaW5lZCIsImlzQSIsIl9vVGFibGUiLCJzaG93Q291bnRzIiwiX3VwZGF0ZUNvdW50cyIsImJpbmQiLCJEZWxlZ2F0ZVV0aWwiLCJzZXRDdXN0b21EYXRhIiwic2V0U2VsZWN0b3JLZXkiLCJzS2V5Iiwib1NlbGVjdG9yIiwiZ2V0U2VsZWN0ZWRLZXkiLCJzZXRTZWxlY3RlZEtleSIsInNGaWx0ZXJCYXJJRCIsImdldEZpbHRlciIsIm9GaWx0ZXJCYXIiLCJDb3JlIiwiYnlJZCIsImJTa2lwUmViaW5kIiwiZ2V0U3VzcGVuZFNlbGVjdGlvbiIsInJlYmluZCIsImdldFNlbGVjdG9yS2V5IiwiZ2V0RG9tUmVmIiwic1N1ZmZpeCIsIm1GaWx0ZXJzIiwiZ2V0Q3VzdG9tRGF0YSIsIkpTT05Nb2RlbCIsInNldE1vZGVsIiwiYklzU2VsZWN0IiwibVNlbGVjdG9yT3B0aW9ucyIsImlkIiwiZ2VuZXJhdGUiLCJlbmFibGVkIiwiZ2V0QmluZGluZ0luZm8iLCJpdGVtcyIsInBhdGgiLCJmYWN0b3J5Iiwic0lkIiwib0JpbmRpbmdDb250ZXh0IiwibUl0ZW1PcHRpb25zIiwia2V5IiwidGV4dCIsIl9nZXRTZWxlY3Rvckl0ZW1UZXh0IiwiSXRlbSIsIlNlZ21lbnRlZEJ1dHRvbkl0ZW0iLCJhdXRvQWRqdXN0V2lkdGgiLCJfb25TZWxlY3Rpb25DaGFuZ2UiLCJTZWxlY3QiLCJTZWdtZW50ZWRCdXR0b24iLCJnZXRPdmVyZmxvd1Rvb2xiYXJDb25maWciLCJjYW5PdmVyZmxvdyIsIm9TdkNvbnRyb2wiLCJvU3ZJdGVtcyIsImdldEl0ZW1zIiwic1RhYmxlTmF2aWdhdGlvblBhdGgiLCJhU291cmNlUHJvcGVydGllcyIsImsiLCJzSXRlbUtleSIsImdldEtleSIsIm9GaWx0ZXJJbmZvcyIsIlRhYmxlVXRpbHMiLCJnZXRGaWx0ZXJzSW5mb0ZvclNWIiwicHJvcGVydGllcyIsImZvckVhY2giLCJzUHJvcGVydHkiLCJzUHJvcGVydHlQYXRoIiwiaW5jbHVkZXMiLCJwdXNoIiwiX2dldFNpZGVFZmZlY3RDb250cm9sbGVyIiwiYWRkQ29udHJvbFNpZGVFZmZlY3RzIiwicGFyZW50RW50aXR5VHlwZSIsIlNvdXJjZVByb3BlcnRpZXMiLCJUYXJnZXRFbnRpdGllcyIsInNvdXJjZUNvbnRyb2xJZCIsIm9JdGVtQ29udGV4dCIsIml0ZW1QYXRoIiwiZ2V0UGF0aCIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJvUXVpY2tGaWx0ZXIiLCJlbnRpdHlTZXQiLCJUZXh0Iiwib0NvbnRyb2xsZXIiLCJfZ2V0Vmlld0NvbnRyb2xsZXIiLCJfc2lkZUVmZmVjdHMiLCJvVmlldyIsIkNvbW1vblV0aWxzIiwiZ2V0VGFyZ2V0VmlldyIsImdldENvbnRyb2xsZXIiLCJvVGFibGUiLCJhQmluZGluZ1Byb21pc2VzIiwiYUluaXRpYWxJdGVtVGV4dHMiLCJhQWRkaXRpb25hbEZpbHRlcnMiLCJhQ2hhcnRGaWx0ZXJzIiwic0N1cnJlbnRGaWx0ZXJLZXkiLCJnZXRDaGFydENvbnRyb2wiLCJvQ2hhcnQiLCJvQ2hhcnRGaWx0ZXJJbmZvIiwiQ2hhcnRVdGlscyIsImdldEFsbEZpbHRlckluZm8iLCJmaWx0ZXJzIiwiY29uY2F0IiwiZ2V0SGlkZGVuRmlsdGVycyIsInNldFByb3BlcnR5IiwiZ2V0TGlzdEJpbmRpbmdGb3JDb3VudCIsImdldEJpbmRpbmdDb250ZXh0IiwiYmF0Y2hHcm91cElkIiwiYWRkaXRpb25hbEZpbHRlcnMiLCJQcm9taXNlIiwiYWxsIiwidGhlbiIsImFDb3VudHMiLCJnZXRDb3VudEZvcm1hdHRlZCIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJnZXRTb3VyY2UiLCJnZXRFeHRlbnNpb25BUEkiLCJ1cGRhdGVBcHBTdGF0ZSIsImRlc3Ryb3kiLCJiU3VwcHJlc3NJbnZhbGlkYXRlIiwib1NpZGVFZmZlY3RzIiwicmVtb3ZlQ29udHJvbFNpZGVFZmZlY3RzIiwiQ29udHJvbCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiUXVpY2tGaWx0ZXJDb250YWluZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgeyBhZ2dyZWdhdGlvbiwgZGVmaW5lVUk1Q2xhc3MsIHByb3BlcnR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5pbXBvcnQgQ2hhcnRVdGlscyBmcm9tIFwic2FwL2ZlL21hY3Jvcy9jaGFydC9DaGFydFV0aWxzXCI7XG5pbXBvcnQgRGVsZWdhdGVVdGlsIGZyb20gXCJzYXAvZmUvbWFjcm9zL0RlbGVnYXRlVXRpbFwiO1xuaW1wb3J0IFRhYmxlVXRpbHMgZnJvbSBcInNhcC9mZS9tYWNyb3MvdGFibGUvVXRpbHNcIjtcbmltcG9ydCBTZWdtZW50ZWRCdXR0b24gZnJvbSBcInNhcC9tL1NlZ21lbnRlZEJ1dHRvblwiO1xuaW1wb3J0IFNlZ21lbnRlZEJ1dHRvbkl0ZW0gZnJvbSBcInNhcC9tL1NlZ21lbnRlZEJ1dHRvbkl0ZW1cIjtcbmltcG9ydCBTZWxlY3QgZnJvbSBcInNhcC9tL1NlbGVjdFwiO1xuaW1wb3J0IENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgSXRlbSBmcm9tIFwic2FwL3VpL2NvcmUvSXRlbVwiO1xuaW1wb3J0IHR5cGUgUmVuZGVyTWFuYWdlciBmcm9tIFwic2FwL3VpL2NvcmUvUmVuZGVyTWFuYWdlclwiO1xuaW1wb3J0IHR5cGUgRmlsdGVyQmFyIGZyb20gXCJzYXAvdWkvbWRjL0ZpbHRlckJhclwiO1xuaW1wb3J0IHR5cGUgVGFibGUgZnJvbSBcInNhcC91aS9tZGMvVGFibGVcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuXG5jb25zdCBQUk9QRVJUWV9RVUlDS0ZJTFRFUl9LRVkgPSBcInF1aWNrRmlsdGVyS2V5XCI7XG5jb25zdCBGSUxURVJfTU9ERUwgPSBcImZpbHRlcnNcIjtcbi8qKlxuICogIENvbnRhaW5lciBDb250cm9sIGZvciBUYWJsZSBRdWlja0ZpbHRlcnNcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGV4cGVyaW1lbnRhbCBUaGlzIG1vZHVsZSBpcyBvbmx5IGZvciBpbnRlcm5hbC9leHBlcmltZW50YWwgdXNlIVxuICovXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUubWFjcm9zLnRhYmxlLlF1aWNrRmlsdGVyQ29udGFpbmVyXCIsIHtcblx0aW50ZXJmYWNlczogW1wic2FwLm0uSU92ZXJmbG93VG9vbGJhckNvbnRlbnRcIl1cbn0pXG5jbGFzcyBRdWlja0ZpbHRlckNvbnRhaW5lciBleHRlbmRzIENvbnRyb2wge1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiB9KVxuXHRlbmFibGVkITogYm9vbGVhbjtcblx0QHByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIgfSlcblx0c2hvd0NvdW50cyE6IGJvb2xlYW47XG5cblx0QHByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRlbnRpdHlTZXQhOiBzdHJpbmc7XG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0cGFyZW50RW50aXR5VHlwZSE6IHN0cmluZztcblxuXHRAcHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiLCBkZWZhdWx0VmFsdWU6IFwiJGF1dG9cIiB9KVxuXHRiYXRjaEdyb3VwSWQhOiBzdHJpbmc7XG5cblx0QGFnZ3JlZ2F0aW9uKHtcblx0XHR0eXBlOiBcInNhcC51aS5jb3JlLkNvbnRyb2xcIixcblx0XHRtdWx0aXBsZTogZmFsc2UsXG5cdFx0aXNEZWZhdWx0OiB0cnVlXG5cdH0pXG5cdHNlbGVjdG9yITogU2VsZWN0IHwgU2VnbWVudGVkQnV0dG9uO1xuXHRwcml2YXRlIF9vVGFibGU/OiBUYWJsZTtcblx0cHJpdmF0ZSBfYXR0YWNoZWRUb1ZpZXc6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRzdGF0aWMgcmVuZGVyKG9SbTogUmVuZGVyTWFuYWdlciwgb0NvbnRyb2w6IFF1aWNrRmlsdGVyQ29udGFpbmVyKSB7XG5cdFx0b1JtLnJlbmRlckNvbnRyb2wob0NvbnRyb2wuc2VsZWN0b3IpO1xuXHR9XG5cdGluaXQoKSB7XG5cdFx0c3VwZXIuaW5pdCgpO1xuXHRcdHRoaXMuX2F0dGFjaGVkVG9WaWV3ID0gZmFsc2U7XG5cdFx0dGhpcy5hdHRhY2hFdmVudChcIm1vZGVsQ29udGV4dENoYW5nZVwiLCB0aGlzLl9pbml0Q29udHJvbCk7XG5cdFx0Y29uc3Qgb0RlbGVnYXRlT25CZWZvcmVSZW5kZXJpbmcgPSB7XG5cdFx0XHRvbkJlZm9yZVJlbmRlcmluZzogKCkgPT4ge1xuXHRcdFx0XHQvLyBOZWVkIHRvIHdhaXQgZm9yIENvbnRyb2wgcmVuZGVyaW5nIHRvIGdldCBwYXJlbnQgdmlldyAoLmkuZSBpbnRvIE9QIHRoZSBoaWdoZXN0IHBhcmVudCBpcyB0aGUgT2JqZWN0IFNlY3Rpb24pXG5cdFx0XHRcdHRoaXMuX2NyZWF0ZUNvbnRyb2xTaWRlRWZmZWN0cygpO1xuXHRcdFx0XHR0aGlzLl9hdHRhY2hlZFRvVmlldyA9IHRydWU7XG5cdFx0XHRcdHRoaXMucmVtb3ZlRXZlbnREZWxlZ2F0ZShvRGVsZWdhdGVPbkJlZm9yZVJlbmRlcmluZyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLmFkZEV2ZW50RGVsZWdhdGUob0RlbGVnYXRlT25CZWZvcmVSZW5kZXJpbmcsIHRoaXMpO1xuXHR9XG5cdF9pbml0Q29udHJvbChvRXZlbnQ6IGFueSkge1xuXHRcdC8vIE5lZWQgdG8gd2FpdCBmb3IgdGhlIE9EYXRhIE1vZGVsIHRvIGJlIHByb3BhZ2F0ZWQgKG1vZGVscyBhcmUgcHJvcGFnYXRlZCBvbmUgYnkgb25lIHdoZW4gd2UgY29tZSBmcm9tIEZMUClcblx0XHRpZiAodGhpcy5nZXRNb2RlbCgpKSB7XG5cdFx0XHR0aGlzLmRldGFjaEV2ZW50KG9FdmVudC5nZXRJZCgpLCB0aGlzLl9pbml0Q29udHJvbCk7XG5cdFx0XHR0aGlzLl9tYW5hZ2VUYWJsZSgpO1xuXHRcdFx0dGhpcy5fY3JlYXRlQ29udGVudCgpO1xuXHRcdH1cblx0fVxuXHRfbWFuYWdlVGFibGUoKSB7XG5cdFx0bGV0IG9Db250cm9sID0gdGhpcy5nZXRQYXJlbnQoKSBhcyBUYWJsZTtcblx0XHRjb25zdCBvTW9kZWwgPSB0aGlzLl9nZXRGaWx0ZXJNb2RlbCgpLFxuXHRcdFx0YUZpbHRlcnMgPSBvTW9kZWwuZ2V0T2JqZWN0KFwiL3BhdGhzXCIpLFxuXHRcdFx0c0RlZmF1bHRGaWx0ZXIgPSBBcnJheS5pc0FycmF5KGFGaWx0ZXJzKSAmJiBhRmlsdGVycy5sZW5ndGggPiAwID8gYUZpbHRlcnNbMF0uYW5ub3RhdGlvblBhdGggOiB1bmRlZmluZWQ7XG5cblx0XHR3aGlsZSAob0NvbnRyb2wgJiYgIW9Db250cm9sLmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdG9Db250cm9sID0gb0NvbnRyb2wuZ2V0UGFyZW50KCkgYXMgVGFibGU7XG5cdFx0fVxuXHRcdHRoaXMuX29UYWJsZSA9IG9Db250cm9sO1xuXHRcdGlmICh0aGlzLnNob3dDb3VudHMpIHtcblx0XHRcdHRoaXMuX29UYWJsZS5nZXRQYXJlbnQoKS5hdHRhY2hFdmVudChcImludGVybmFsRGF0YVJlcXVlc3RlZFwiLCB0aGlzLl91cGRhdGVDb3VudHMuYmluZCh0aGlzKSk7XG5cdFx0fVxuXHRcdERlbGVnYXRlVXRpbC5zZXRDdXN0b21EYXRhKG9Db250cm9sLCBQUk9QRVJUWV9RVUlDS0ZJTFRFUl9LRVksIHNEZWZhdWx0RmlsdGVyKTtcblx0fVxuXHRzZXRTZWxlY3RvcktleShzS2V5OiBhbnkpIHtcblx0XHRjb25zdCBvU2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yO1xuXHRcdGlmIChvU2VsZWN0b3IgJiYgb1NlbGVjdG9yLmdldFNlbGVjdGVkS2V5KCkgIT09IHNLZXkpIHtcblx0XHRcdG9TZWxlY3Rvci5zZXRTZWxlY3RlZEtleShzS2V5KTtcblx0XHRcdERlbGVnYXRlVXRpbC5zZXRDdXN0b21EYXRhKHRoaXMuX29UYWJsZSwgUFJPUEVSVFlfUVVJQ0tGSUxURVJfS0VZLCBzS2V5KTtcblxuXHRcdFx0Ly8gUmViaW5kIHRoZSB0YWJsZSB0byByZWZsZWN0IHRoZSBjaGFuZ2UgaW4gcXVpY2sgZmlsdGVyIGtleS5cblx0XHRcdC8vIFdlIGRvbid0IHJlYmluZCB0aGUgdGFibGUgaWYgdGhlIGZpbHRlcmJhciBmb3IgdGhlIHRhYmxlIGlzIHN1c3BlbmRlZFxuXHRcdFx0Ly8gYXMgcmViaW5kIHdpbGwgYmUgZG9uZSB3aGVuIHRoZSBmaWx0ZXJiYXIgaXMgcmVzdW1lZFxuXHRcdFx0Y29uc3Qgc0ZpbHRlckJhcklEID0gdGhpcy5fb1RhYmxlIS5nZXRGaWx0ZXIgJiYgdGhpcy5fb1RhYmxlIS5nZXRGaWx0ZXIoKTtcblx0XHRcdGNvbnN0IG9GaWx0ZXJCYXIgPSBzRmlsdGVyQmFySUQgJiYgKENvcmUuYnlJZChzRmlsdGVyQmFySUQpIGFzIEZpbHRlckJhcik7XG5cdFx0XHRjb25zdCBiU2tpcFJlYmluZCA9IG9GaWx0ZXJCYXIgJiYgb0ZpbHRlckJhci5nZXRTdXNwZW5kU2VsZWN0aW9uICYmIG9GaWx0ZXJCYXIuZ2V0U3VzcGVuZFNlbGVjdGlvbigpO1xuXG5cdFx0XHRpZiAoIWJTa2lwUmViaW5kKSB7XG5cdFx0XHRcdCh0aGlzLl9vVGFibGUgYXMgYW55KS5yZWJpbmQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Z2V0U2VsZWN0b3JLZXkoKSB7XG5cdFx0Y29uc3Qgb1NlbGVjdG9yID0gdGhpcy5zZWxlY3Rvcjtcblx0XHRyZXR1cm4gb1NlbGVjdG9yID8gb1NlbGVjdG9yLmdldFNlbGVjdGVkS2V5KCkgOiBudWxsO1xuXHR9XG5cdGdldERvbVJlZihzU3VmZml4Pzogc3RyaW5nKSB7XG5cdFx0Y29uc3Qgb1NlbGVjdG9yID0gdGhpcy5zZWxlY3Rvcjtcblx0XHRyZXR1cm4gb1NlbGVjdG9yID8gb1NlbGVjdG9yLmdldERvbVJlZihzU3VmZml4KSA6IChudWxsIGFzIGFueSk7XG5cdH1cblx0X2dldEZpbHRlck1vZGVsKCkge1xuXHRcdGxldCBvTW9kZWwgPSB0aGlzLmdldE1vZGVsKEZJTFRFUl9NT0RFTCk7XG5cdFx0aWYgKCFvTW9kZWwpIHtcblx0XHRcdGNvbnN0IG1GaWx0ZXJzID0gRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEodGhpcywgRklMVEVSX01PREVMKTtcblx0XHRcdG9Nb2RlbCA9IG5ldyBKU09OTW9kZWwobUZpbHRlcnMpO1xuXHRcdFx0dGhpcy5zZXRNb2RlbChvTW9kZWwsIEZJTFRFUl9NT0RFTCk7XG5cdFx0fVxuXHRcdHJldHVybiBvTW9kZWw7XG5cdH1cblx0LyoqXG5cdCAqIENyZWF0ZSBRdWlja0ZpbHRlciBTZWxlY3RvciAoU2VsZWN0IG9yIFNlZ21lbnRlZEJ1dHRvbikuXG5cdCAqL1xuXHRfY3JlYXRlQ29udGVudCgpIHtcblx0XHRjb25zdCBvTW9kZWwgPSB0aGlzLl9nZXRGaWx0ZXJNb2RlbCgpLFxuXHRcdFx0YUZpbHRlcnMgPSBvTW9kZWwuZ2V0T2JqZWN0KFwiL3BhdGhzXCIpLFxuXHRcdFx0YklzU2VsZWN0ID0gYUZpbHRlcnMubGVuZ3RoID4gMyxcblx0XHRcdG1TZWxlY3Rvck9wdGlvbnM6IGFueSA9IHtcblx0XHRcdFx0aWQ6IGdlbmVyYXRlKFt0aGlzLl9vVGFibGUhLmdldElkKCksIFwiUXVpY2tGaWx0ZXJcIl0pLFxuXHRcdFx0XHRlbmFibGVkOiB0aGlzLmdldEJpbmRpbmdJbmZvKFwiZW5hYmxlZFwiKSxcblx0XHRcdFx0aXRlbXM6IHtcblx0XHRcdFx0XHRwYXRoOiBgJHtGSUxURVJfTU9ERUx9Pi9wYXRoc2AsXG5cdFx0XHRcdFx0ZmFjdG9yeTogKHNJZDogYW55LCBvQmluZGluZ0NvbnRleHQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgbUl0ZW1PcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRrZXk6IG9CaW5kaW5nQ29udGV4dC5nZXRPYmplY3QoKS5hbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0XHRcdFx0dGV4dDogdGhpcy5fZ2V0U2VsZWN0b3JJdGVtVGV4dChvQmluZGluZ0NvbnRleHQpXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJJc1NlbGVjdCA/IG5ldyBJdGVtKG1JdGVtT3B0aW9ucykgOiBuZXcgU2VnbWVudGVkQnV0dG9uSXRlbShtSXRlbU9wdGlvbnMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRpZiAoYklzU2VsZWN0KSB7XG5cdFx0XHRtU2VsZWN0b3JPcHRpb25zLmF1dG9BZGp1c3RXaWR0aCA9IHRydWU7XG5cdFx0fVxuXHRcdG1TZWxlY3Rvck9wdGlvbnNbYklzU2VsZWN0ID8gXCJjaGFuZ2VcIiA6IFwic2VsZWN0aW9uQ2hhbmdlXCJdID0gdGhpcy5fb25TZWxlY3Rpb25DaGFuZ2UuYmluZCh0aGlzKTtcblx0XHR0aGlzLnNlbGVjdG9yID0gYklzU2VsZWN0ID8gbmV3IFNlbGVjdChtU2VsZWN0b3JPcHRpb25zKSA6IG5ldyBTZWdtZW50ZWRCdXR0b24obVNlbGVjdG9yT3B0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBwcm9wZXJ0aWVzIGZvciB0aGUgaW50ZXJmYWNlIElPdmVyZmxvd1Rvb2xiYXJDb250ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb25maWd1cmF0aW9uIG9mIElPdmVyZmxvd1Rvb2xiYXJDb250ZW50XG5cdCAqL1xuXHRnZXRPdmVyZmxvd1Rvb2xiYXJDb25maWcoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNhbk92ZXJmbG93OiB0cnVlXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIFNpZGVFZmZlY3RzIGNvbnRyb2wgdGhhdCBtdXN0IGJlIGV4ZWN1dGVkIHdoZW4gdGFibGUgY2VsbHMgdGhhdCBhcmUgcmVsYXRlZCB0byBjb25maWd1cmVkIGZpbHRlcihzKSBjaGFuZ2UuXG5cdCAqXG5cdCAqL1xuXG5cdF9jcmVhdGVDb250cm9sU2lkZUVmZmVjdHMoKSB7XG5cdFx0Y29uc3Qgb1N2Q29udHJvbCA9IHRoaXMuc2VsZWN0b3IsXG5cdFx0XHRvU3ZJdGVtcyA9IG9TdkNvbnRyb2wuZ2V0SXRlbXMoKSxcblx0XHRcdHNUYWJsZU5hdmlnYXRpb25QYXRoID0gRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEodGhpcy5fb1RhYmxlLCBcIm5hdmlnYXRpb25QYXRoXCIpO1xuXHRcdC8qKlxuXHRcdCAqIENhbm5vdCBleGVjdXRlIFNpZGVFZmZlY3RzIHdpdGggdGFyZ2V0RW50aXR5ID0gY3VycmVudCBUYWJsZSBjb2xsZWN0aW9uXG5cdFx0ICovXG5cblx0XHRpZiAoc1RhYmxlTmF2aWdhdGlvblBhdGgpIHtcblx0XHRcdGNvbnN0IGFTb3VyY2VQcm9wZXJ0aWVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0Zm9yIChjb25zdCBrIGluIG9Tdkl0ZW1zKSB7XG5cdFx0XHRcdGNvbnN0IHNJdGVtS2V5ID0gb1N2SXRlbXNba10uZ2V0S2V5KCksXG5cdFx0XHRcdFx0b0ZpbHRlckluZm9zID0gVGFibGVVdGlscy5nZXRGaWx0ZXJzSW5mb0ZvclNWKHRoaXMuX29UYWJsZSEsIHNJdGVtS2V5KTtcblx0XHRcdFx0b0ZpbHRlckluZm9zLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAoc1Byb3BlcnR5OiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBzUHJvcGVydHlQYXRoID0gYCR7c1RhYmxlTmF2aWdhdGlvblBhdGh9LyR7c1Byb3BlcnR5fWA7XG5cdFx0XHRcdFx0aWYgKCFhU291cmNlUHJvcGVydGllcy5pbmNsdWRlcyhzUHJvcGVydHlQYXRoKSkge1xuXHRcdFx0XHRcdFx0YVNvdXJjZVByb3BlcnRpZXMucHVzaChzUHJvcGVydHlQYXRoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZ2V0U2lkZUVmZmVjdENvbnRyb2xsZXIoKS5hZGRDb250cm9sU2lkZUVmZmVjdHModGhpcy5wYXJlbnRFbnRpdHlUeXBlLCB7XG5cdFx0XHRcdFNvdXJjZVByb3BlcnRpZXM6IGFTb3VyY2VQcm9wZXJ0aWVzLFxuXHRcdFx0XHRUYXJnZXRFbnRpdGllczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjogc1RhYmxlTmF2aWdhdGlvblBhdGhcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdHNvdXJjZUNvbnRyb2xJZDogdGhpcy5nZXRJZCgpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0X2dldFNlbGVjdG9ySXRlbVRleHQob0l0ZW1Db250ZXh0OiBhbnkpIHtcblx0XHRjb25zdCBhbm5vdGF0aW9uUGF0aCA9IG9JdGVtQ29udGV4dC5nZXRPYmplY3QoKS5hbm5vdGF0aW9uUGF0aCxcblx0XHRcdGl0ZW1QYXRoID0gb0l0ZW1Db250ZXh0LmdldFBhdGgoKSxcblx0XHRcdG9NZXRhTW9kZWwgPSB0aGlzLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRvUXVpY2tGaWx0ZXIgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHt0aGlzLmVudGl0eVNldH0vJHthbm5vdGF0aW9uUGF0aH1gKTtcblx0XHRyZXR1cm4gb1F1aWNrRmlsdGVyLlRleHQgKyAodGhpcy5zaG93Q291bnRzID8gYCAoeyR7RklMVEVSX01PREVMfT4ke2l0ZW1QYXRofS9jb3VudH0pYCA6IFwiXCIpO1xuXHR9XG5cdF9nZXRTaWRlRWZmZWN0Q29udHJvbGxlcigpIHtcblx0XHRjb25zdCBvQ29udHJvbGxlciA9IHRoaXMuX2dldFZpZXdDb250cm9sbGVyKCk7XG5cdFx0cmV0dXJuIG9Db250cm9sbGVyID8gb0NvbnRyb2xsZXIuX3NpZGVFZmZlY3RzIDogdW5kZWZpbmVkO1xuXHR9XG5cdF9nZXRWaWV3Q29udHJvbGxlcigpIHtcblx0XHRjb25zdCBvVmlldyA9IENvbW1vblV0aWxzLmdldFRhcmdldFZpZXcodGhpcyk7XG5cdFx0cmV0dXJuIG9WaWV3ICYmIG9WaWV3LmdldENvbnRyb2xsZXIoKTtcblx0fVxuXHQvKipcblx0ICogTWFuYWdlIExpc3QgQmluZGluZyByZXF1ZXN0IHJlbGF0ZWQgdG8gQ291bnRzIG9uIFF1aWNrRmlsdGVyIGNvbnRyb2wgYW5kIHVwZGF0ZSB0ZXh0XG5cdCAqIGluIGxpbmUgd2l0aCBiYXRjaCByZXN1bHQuXG5cdCAqXG5cdCAqL1xuXHRfdXBkYXRlQ291bnRzKCkge1xuXHRcdGNvbnN0IG9UYWJsZSA9IHRoaXMuX29UYWJsZSEsXG5cdFx0XHRvQ29udHJvbGxlciA9IHRoaXMuX2dldFZpZXdDb250cm9sbGVyKCksXG5cdFx0XHRvU3ZDb250cm9sID0gdGhpcy5zZWxlY3Rvcixcblx0XHRcdG9Tdkl0ZW1zID0gb1N2Q29udHJvbC5nZXRJdGVtcygpLFxuXHRcdFx0b01vZGVsOiBhbnkgPSB0aGlzLl9nZXRGaWx0ZXJNb2RlbCgpLFxuXHRcdFx0YUJpbmRpbmdQcm9taXNlcyA9IFtdLFxuXHRcdFx0YUluaXRpYWxJdGVtVGV4dHM6IGFueVtdID0gW107XG5cdFx0bGV0IGFBZGRpdGlvbmFsRmlsdGVyczogYW55W10gPSBbXTtcblx0XHRsZXQgYUNoYXJ0RmlsdGVycyA9IFtdO1xuXHRcdGNvbnN0IHNDdXJyZW50RmlsdGVyS2V5ID0gRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEob1RhYmxlLCBQUk9QRVJUWV9RVUlDS0ZJTFRFUl9LRVkpO1xuXG5cdFx0Ly8gQWRkIGZpbHRlcnMgcmVsYXRlZCB0byB0aGUgY2hhcnQgZm9yIEFMUFxuXHRcdGlmIChvQ29udHJvbGxlciAmJiBvQ29udHJvbGxlci5nZXRDaGFydENvbnRyb2wpIHtcblx0XHRcdGNvbnN0IG9DaGFydCA9IG9Db250cm9sbGVyLmdldENoYXJ0Q29udHJvbCgpO1xuXHRcdFx0aWYgKG9DaGFydCkge1xuXHRcdFx0XHRjb25zdCBvQ2hhcnRGaWx0ZXJJbmZvID0gQ2hhcnRVdGlscy5nZXRBbGxGaWx0ZXJJbmZvKG9DaGFydCk7XG5cdFx0XHRcdGlmIChvQ2hhcnRGaWx0ZXJJbmZvICYmIG9DaGFydEZpbHRlckluZm8uZmlsdGVycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRhQ2hhcnRGaWx0ZXJzID0gb0NoYXJ0RmlsdGVySW5mby5maWx0ZXJzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YUFkZGl0aW9uYWxGaWx0ZXJzID0gYUFkZGl0aW9uYWxGaWx0ZXJzLmNvbmNhdChUYWJsZVV0aWxzLmdldEhpZGRlbkZpbHRlcnMob1RhYmxlKSkuY29uY2F0KGFDaGFydEZpbHRlcnMpO1xuXHRcdGZvciAoY29uc3QgayBpbiBvU3ZJdGVtcykge1xuXHRcdFx0Y29uc3Qgc0l0ZW1LZXkgPSBvU3ZJdGVtc1trXS5nZXRLZXkoKSxcblx0XHRcdFx0b0ZpbHRlckluZm9zID0gVGFibGVVdGlscy5nZXRGaWx0ZXJzSW5mb0ZvclNWKG9UYWJsZSwgc0l0ZW1LZXkpO1xuXHRcdFx0YUluaXRpYWxJdGVtVGV4dHMucHVzaChvRmlsdGVySW5mb3MudGV4dCk7XG5cdFx0XHRvTW9kZWwuc2V0UHJvcGVydHkoYC9wYXRocy8ke2t9L2NvdW50YCwgXCIuLi5cIik7XG5cdFx0XHRhQmluZGluZ1Byb21pc2VzLnB1c2goXG5cdFx0XHRcdFRhYmxlVXRpbHMuZ2V0TGlzdEJpbmRpbmdGb3JDb3VudChvVGFibGUsIG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dCgpLCB7XG5cdFx0XHRcdFx0YmF0Y2hHcm91cElkOiBzSXRlbUtleSA9PT0gc0N1cnJlbnRGaWx0ZXJLZXkgPyB0aGlzLmJhdGNoR3JvdXBJZCA6IFwiJGF1dG9cIixcblx0XHRcdFx0XHRhZGRpdGlvbmFsRmlsdGVyczogYUFkZGl0aW9uYWxGaWx0ZXJzLmNvbmNhdChvRmlsdGVySW5mb3MuZmlsdGVycylcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0fVxuXHRcdFByb21pc2UuYWxsKGFCaW5kaW5nUHJvbWlzZXMpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoYUNvdW50czogYW55W10pIHtcblx0XHRcdFx0Zm9yIChjb25zdCBrIGluIGFDb3VudHMpIHtcblx0XHRcdFx0XHRvTW9kZWwuc2V0UHJvcGVydHkoYC9wYXRocy8ke2t9L2NvdW50YCwgVGFibGVVdGlscy5nZXRDb3VudEZvcm1hdHRlZChhQ291bnRzW2tdKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJldHJpZXZpbmcgdGhlIGJpbmRpbmcgcHJvbWlzZXNcIiwgb0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cdF9vblNlbGVjdGlvbkNoYW5nZShvRXZlbnQ6IGFueSkge1xuXHRcdGNvbnN0IG9Db250cm9sID0gb0V2ZW50LmdldFNvdXJjZSgpO1xuXHRcdERlbGVnYXRlVXRpbC5zZXRDdXN0b21EYXRhKHRoaXMuX29UYWJsZSwgUFJPUEVSVFlfUVVJQ0tGSUxURVJfS0VZLCBvQ29udHJvbC5nZXRTZWxlY3RlZEtleSgpKTtcblx0XHQodGhpcy5fb1RhYmxlIGFzIGFueSkucmViaW5kKCk7XG5cdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSB0aGlzLl9nZXRWaWV3Q29udHJvbGxlcigpO1xuXHRcdGlmIChvQ29udHJvbGxlciAmJiBvQ29udHJvbGxlci5nZXRFeHRlbnNpb25BUEkgJiYgb0NvbnRyb2xsZXIuZ2V0RXh0ZW5zaW9uQVBJKCkudXBkYXRlQXBwU3RhdGUpIHtcblx0XHRcdG9Db250cm9sbGVyLmdldEV4dGVuc2lvbkFQSSgpLnVwZGF0ZUFwcFN0YXRlKCk7XG5cdFx0fVxuXHR9XG5cdGRlc3Ryb3koYlN1cHByZXNzSW52YWxpZGF0ZT86IGJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5fYXR0YWNoZWRUb1ZpZXcpIHtcblx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0cyA9IHRoaXMuX2dldFNpZGVFZmZlY3RDb250cm9sbGVyKCk7XG5cdFx0XHRpZiAob1NpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdC8vIGlmIFwiZGVzdHJveVwiIHNpZ25hbCBjb21lcyB3aGVuIHZpZXcgaXMgZGVzdHJveWVkIHRoZXJlIGlzIG5vdCBhbnltb3JlIHJlZmVyZW5jZSB0byBDb250cm9sbGVyIEV4dGVuc2lvblxuXHRcdFx0XHRvU2lkZUVmZmVjdHMucmVtb3ZlQ29udHJvbFNpZGVFZmZlY3RzKHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRkZWxldGUgdGhpcy5fb1RhYmxlO1xuXHRcdHN1cGVyLmRlc3Ryb3koYlN1cHByZXNzSW52YWxpZGF0ZSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUXVpY2tGaWx0ZXJDb250YWluZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0JBLElBQU1BLHdCQUF3QixHQUFHLGdCQUFqQztFQUNBLElBQU1DLFlBQVksR0FBRyxTQUFyQjtFQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7TUFJTUMsb0IsV0FITEMsY0FBYyxDQUFDLDBDQUFELEVBQTZDO0lBQzNEQyxVQUFVLEVBQUUsQ0FBQywrQkFBRDtFQUQrQyxDQUE3QyxDLFVBSWJDLFFBQVEsQ0FBQztJQUFFQyxJQUFJLEVBQUU7RUFBUixDQUFELEMsVUFFUkQsUUFBUSxDQUFDO0lBQUVDLElBQUksRUFBRTtFQUFSLENBQUQsQyxVQUdSRCxRQUFRLENBQUM7SUFBRUMsSUFBSSxFQUFFO0VBQVIsQ0FBRCxDLFVBRVJELFFBQVEsQ0FBQztJQUFFQyxJQUFJLEVBQUU7RUFBUixDQUFELEMsVUFHUkQsUUFBUSxDQUFDO0lBQUVDLElBQUksRUFBRSxRQUFSO0lBQWtCQyxZQUFZLEVBQUU7RUFBaEMsQ0FBRCxDLFVBR1JDLFdBQVcsQ0FBQztJQUNaRixJQUFJLEVBQUUscUJBRE07SUFFWkcsUUFBUSxFQUFFLEtBRkU7SUFHWkMsU0FBUyxFQUFFO0VBSEMsQ0FBRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFPSkMsZSxHQUEyQixLOzs7O3lCQUU1QkMsTSxHQUFQLGdCQUFjQyxHQUFkLEVBQWtDQyxRQUFsQyxFQUFrRTtNQUNqRUQsR0FBRyxDQUFDRSxhQUFKLENBQWtCRCxRQUFRLENBQUNFLFFBQTNCO0lBQ0EsQzs7OztXQUNEQyxJLEdBQUEsZ0JBQU87TUFBQTs7TUFDTixtQkFBTUEsSUFBTjs7TUFDQSxLQUFLTixlQUFMLEdBQXVCLEtBQXZCO01BQ0EsS0FBS08sV0FBTCxDQUFpQixvQkFBakIsRUFBdUMsS0FBS0MsWUFB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