/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/MessageStrip", "sap/fe/macros/DelegateUtil", "sap/m/IconTabFilter", "sap/ui/core/Control", "sap/ui/core/Core", "sap/ui/fl/write/api/ControlPersonalizationWriteAPI", "sap/ui/model/json/JSONModel"], function (Log, CommonUtils, ClassSupport, MessageStrip, DelegateUtil, IconTabFilter, Control, Core, ControlPersonalizationWriteAPI, JSONModel) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

  var property = ClassSupport.property;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var association = ClassSupport.association;
  var aggregation = ClassSupport.aggregation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var BindingAction;

  (function (BindingAction) {
    BindingAction["Suspend"] = "suspendBinding";
    BindingAction["Resume"] = "resumeBinding";
  })(BindingAction || (BindingAction = {}));

  var MultipleModeControl = (_dec = defineUI5Class("sap.fe.templates.ListReport.controls.MultipleModeControl"), _dec2 = property({
    type: "boolean"
  }), _dec3 = property({
    type: "boolean",
    defaultValue: false
  }), _dec4 = property({
    type: "boolean",
    defaultValue: false
  }), _dec5 = aggregation({
    type: "sap.m.IconTabBar",
    multiple: false,
    isDefault: true
  }), _dec6 = association({
    type: "sap.ui.core.Control",
    multiple: true
  }), _dec7 = association({
    type: "sap.fe.core.controls.FilterBar",
    multiple: false
  }), _dec8 = event(), _dec(_class = (_class2 = /*#__PURE__*/function (_Control) {
    _inheritsLoose(MultipleModeControl, _Control);

    function MultipleModeControl() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Control.call.apply(_Control, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "showCounts", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "freezeContent", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "countsOutDated", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "content", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "innerControls", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "filterControl", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "select", _descriptor7, _assertThisInitialized(_this));

      return _this;
    }

    var _proto = MultipleModeControl.prototype;

    _proto.onBeforeRendering = function onBeforeRendering() {
      var _this2 = this;

      this.getTabsModel(); // Generate the model which is mandatory for some bindings

      var oFilterControl = this._getFilterControl();

      if (!oFilterControl) {
        // In case there's no filterbar, we have to update the counts in the tabs immediately
        this.setCountsOutDated(true);
      }

      var oFilterBarAPI = oFilterControl === null || oFilterControl === void 0 ? void 0 : oFilterControl.getParent();
      this.getAllInnerControls().forEach(function (oMacroAPI) {
        var _oMacroAPI$suspendBin;

        if (_this2.showCounts) {
          oMacroAPI.attachEvent("internalDataRequested", _this2._refreshTabsCount.bind(_this2));
        }

        (_oMacroAPI$suspendBin = oMacroAPI.suspendBinding) === null || _oMacroAPI$suspendBin === void 0 ? void 0 : _oMacroAPI$suspendBin.call(oMacroAPI);
      });

      if (oFilterBarAPI) {
        oFilterBarAPI.attachEvent("internalSearch", this._onSearch.bind(this));
        oFilterBarAPI.attachEvent("internalFilterChanged", this._onFilterChanged.bind(this));
      }
    };

    _proto.onAfterRendering = function onAfterRendering() {
      var _this$getSelectedInne, _this$getSelectedInne2;

      (_this$getSelectedInne = this.getSelectedInnerControl()) === null || _this$getSelectedInne === void 0 ? void 0 : (_this$getSelectedInne2 = _this$getSelectedInne.resumeBinding) === null || _this$getSelectedInne2 === void 0 ? void 0 : _this$getSelectedInne2.call(_this$getSelectedInne, !this.getProperty("freezeContent"));
    };

    MultipleModeControl.render = function render(oRm, oControl) {
      oRm.renderControl(oControl.content);
    }
    /**
     * Gets the model containing information related to the IconTabFilters.
     *
     * @returns {sap.ui.model.Model | undefined} The model
     */
    ;

    _proto.getTabsModel = function getTabsModel() {
      var sTabsModel = "tabsInternal";
      var oContent = this.content;

      if (!oContent) {
        return undefined;
      }

      var oModel = oContent.getModel(sTabsModel);

      if (!oModel) {
        oModel = new JSONModel({});
        oContent.setModel(oModel, sTabsModel);
      }

      return oModel;
    }
    /**
     * Gets the inner control of the displayed tab.
     *
     * @returns {InnerControlType | undefined} The control
     */
    ;

    _proto.getSelectedInnerControl = function getSelectedInnerControl() {
      var _this$content,
          _this3 = this;

      var oSelectedTab = (_this$content = this.content) === null || _this$content === void 0 ? void 0 : _this$content.getItems().find(function (oItem) {
        return oItem.getKey() === _this3.content.getSelectedKey();
      });
      return oSelectedTab ? this.getAllInnerControls().find(function (oMacroAPI) {
        return _this3._getTabFromInnerControl(oMacroAPI) === oSelectedTab;
      }) : undefined;
    }
    /**
     * Manages the binding of all inner controls when the selected IconTabFilter is changed.
     *
     * @param {sap.ui.base.Event} oEvent Event fired by the IconTabBar
     */
    ;

    MultipleModeControl.handleTabChange = function handleTabChange(oEvent) {
      var _oMultiControl$_getVi, _oMultiControl$_getVi2;

      var oIconTabBar = oEvent.getSource();
      var oMultiControl = oIconTabBar.getParent();
      var mParameters = oEvent.getParameters();

      oMultiControl._setInnerBinding(true);

      var sPreviousSelectedKey = mParameters === null || mParameters === void 0 ? void 0 : mParameters.previousKey;
      var sSelectedKey = mParameters === null || mParameters === void 0 ? void 0 : mParameters.selectedKey;

      if (sSelectedKey && sPreviousSelectedKey !== sSelectedKey) {
        var oFilterBar = oMultiControl._getFilterControl();

        if (oFilterBar && !oMultiControl.getProperty("freezeContent")) {
          if (!oMultiControl.getSelectedInnerControl()) {
            //custom tab
            oMultiControl._refreshCustomView(oFilterBar.getFilterConditions(), "tabChanged");
          }
        }

        ControlPersonalizationWriteAPI.add({
          changes: [{
            changeSpecificData: {
              changeType: "selectIconTabBarFilter",
              content: {
                selectedKey: sSelectedKey,
                previousSelectedKey: sPreviousSelectedKey
              }
            },
            selectorElement: oIconTabBar
          }]
        });
      }

      (_oMultiControl$_getVi = oMultiControl._getViewController()) === null || _oMultiControl$_getVi === void 0 ? void 0 : (_oMultiControl$_getVi2 = _oMultiControl$_getVi.getExtensionAPI()) === null || _oMultiControl$_getVi2 === void 0 ? void 0 : _oMultiControl$_getVi2.updateAppState();
      oMultiControl.fireEvent("select", {
        iconTabBar: oIconTabBar,
        selectedKey: sSelectedKey,
        previousKey: sPreviousSelectedKey
      });
    }
    /**
     * Invalidates the content of all inner controls.
     */
    ;

    _proto.invalidateContent = function invalidateContent() {
      this.setCountsOutDated(true);
      this.getAllInnerControls().forEach(function (oMacroAPI) {
        var _oMacroAPI$invalidate;

        (_oMacroAPI$invalidate = oMacroAPI.invalidateContent) === null || _oMacroAPI$invalidate === void 0 ? void 0 : _oMacroAPI$invalidate.call(oMacroAPI);
      });
    }
    /**
     * Sets the counts to out of date or up to date
     * If the counts are set to "out of date" and the selected IconTabFilter doesn't contain an inner control all inner controls are requested to get the new counts.
     *
     * @param {boolean} bValue Freeze or not the control
     */
    ;

    _proto.setCountsOutDated = function setCountsOutDated() {
      var bValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.setProperty("countsOutDated", bValue); // if the current tab is not configured with no inner Control
      // the tab counts must be manually refreshed since no Macro API will sent event internalDataRequested

      if (bValue && !this.getSelectedInnerControl()) {
        this._refreshTabsCount();
      }
    }
    /**
     * Freezes the content :
     *  - content is frozen: the binding of the inner controls are suspended.
     *  - content is unfrozen: the binding of inner control related to the selected IconTabFilter is resumed.
     *
     * @param {boolean} bValue Freeze or not the control
     */
    ;

    _proto.setFreezeContent = function setFreezeContent(bValue) {
      this.setProperty("freezeContent", bValue);

      this._setInnerBinding();
    }
    /**
     * Updates the internal model with the properties that are not applicable on each IconTabFilter (containing inner control) according to the entityType of the filter control.
     *
     * @param oResourceBundle
     */
    ;

    _proto._updateMultiTabNotApplicableFields = function _updateMultiTabNotApplicableFields(oResourceBundle) {
      var _this4 = this;

      var tabsModel = this.getTabsModel();

      var oFilterControl = this._getFilterControl();

      if (tabsModel && oFilterControl) {
        var results = {};
        this.getAllInnerControls().forEach(function (oMacroAPI) {
          var oTab = _this4._getTabFromInnerControl(oMacroAPI);

          if (oTab) {
            var _oMacroAPI$refreshNot;

            var sTabId = oTab.getKey();
            var mIgnoredFields = ((_oMacroAPI$refreshNot = oMacroAPI.refreshNotApplicableFields) === null || _oMacroAPI$refreshNot === void 0 ? void 0 : _oMacroAPI$refreshNot.call(oMacroAPI, oFilterControl)) || [];
            results[sTabId] = {
              notApplicable: {
                fields: mIgnoredFields,
                title: _this4._setTabMessageStrip({
                  entityTypePath: oFilterControl.data("entityType"),
                  ignoredFields: mIgnoredFields,
                  resourceBundle: oResourceBundle,
                  title: oTab.getText()
                })
              }
            };
          }
        });
        tabsModel.setData(results);
      }
    }
    /**
     * Gets the inner controls.
     *
     * @param {boolean} bOnlyForVisibleTab Should display only the visible controls
     * @returns {InnerControlType[]} An array of controls
     */
    ;

    _proto.getAllInnerControls = function getAllInnerControls() {
      var _this5 = this;

      var bOnlyForVisibleTab = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.innerControls.reduce(function (aInnerControls, sInnerControl) {
        var oControl = Core.byId(sInnerControl);

        if (oControl) {
          aInnerControls.push(oControl);
        }

        return aInnerControls.filter(function (oInnerControl) {
          var _this5$_getTabFromInn;

          return !bOnlyForVisibleTab || ((_this5$_getTabFromInn = _this5._getTabFromInnerControl(oInnerControl)) === null || _this5$_getTabFromInn === void 0 ? void 0 : _this5$_getTabFromInn.getVisible());
        });
      }, []) || [];
    };

    _proto._getFilterControl = function _getFilterControl() {
      return Core.byId(this.filterControl);
    };

    _proto._getTabFromInnerControl = function _getTabFromInnerControl(oControl) {
      var sSupportedClass = IconTabFilter.getMetadata().getName();
      var oTab = oControl;

      if (oTab && !oTab.isA(sSupportedClass) && oTab.getParent) {
        oTab = oControl.getParent();
      }

      return oTab && oTab.isA(sSupportedClass) ? oTab : undefined;
    };

    _proto._getViewController = function _getViewController() {
      var oView = CommonUtils.getTargetView(this);
      return oView && oView.getController();
    };

    _proto._refreshCustomView = function _refreshCustomView(oFilterConditions, sRefreshCause) {
      var _this$_getViewControl, _this$_getViewControl2;

      (_this$_getViewControl = this._getViewController()) === null || _this$_getViewControl === void 0 ? void 0 : (_this$_getViewControl2 = _this$_getViewControl.onViewNeedsRefresh) === null || _this$_getViewControl2 === void 0 ? void 0 : _this$_getViewControl2.call(_this$_getViewControl, {
        filterConditions: oFilterConditions,
        currentTabId: this.content.getSelectedKey(),
        refreshCause: sRefreshCause
      });
    };

    _proto._refreshTabsCount = function _refreshTabsCount() {
      var _this$content2,
          _this6 = this;

      var sSelectedKey = (_this$content2 = this.content) === null || _this$content2 === void 0 ? void 0 : _this$content2.getSelectedKey();
      this.getAllInnerControls(true).forEach(function (oMacroAPI) {
        var oIconTabFilter = _this6._getTabFromInnerControl(oMacroAPI);

        if (oMacroAPI !== null && oMacroAPI !== void 0 && oMacroAPI.getCounts && (_this6.countsOutDated || sSelectedKey === (oIconTabFilter === null || oIconTabFilter === void 0 ? void 0 : oIconTabFilter.getKey()))) {
          if (oIconTabFilter && oIconTabFilter.setCount) {
            oIconTabFilter.setCount("...");
            oMacroAPI.getCounts().then(function (iCount) {
              return oIconTabFilter.setCount(iCount || "0");
            }).catch(function (oError) {
              Log.error("Error while requesting Counts for Control", oError);
            });
          }
        }
      });
      this.setCountsOutDated(false);
    };

    _proto._setInnerBinding = function _setInnerBinding() {
      var _this7 = this;

      var bRequestIfNotInitialized = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.content) {
        this.getAllInnerControls().forEach(function (oMacroAPI) {
          var _oMacroAPI$sAction;

          var oIconTabFilter = _this7._getTabFromInnerControl(oMacroAPI);

          var bIsSelectedKey = (oIconTabFilter === null || oIconTabFilter === void 0 ? void 0 : oIconTabFilter.getKey()) === _this7.content.getSelectedKey();

          var sAction = bIsSelectedKey && !_this7.getProperty("freezeContent") ? BindingAction.Resume : BindingAction.Suspend;
          (_oMacroAPI$sAction = oMacroAPI[sAction]) === null || _oMacroAPI$sAction === void 0 ? void 0 : _oMacroAPI$sAction.call(oMacroAPI, sAction === BindingAction.Resume ? bRequestIfNotInitialized && bIsSelectedKey : undefined);
        });
      }
    };

    _proto._setTabMessageStrip = function _setTabMessageStrip(properties) {
      var sText = "";
      var aIgnoredFields = properties.ignoredFields;

      var oFilterControl = this._getFilterControl();

      if (oFilterControl && Array.isArray(aIgnoredFields) && aIgnoredFields.length > 0 && properties.title) {
        var aIgnoredLabels = MessageStrip.getLabels(aIgnoredFields, properties.entityTypePath, oFilterControl, properties.resourceBundle);
        sText = MessageStrip.getText(aIgnoredLabels, oFilterControl, properties.title, DelegateUtil.getLocalizedText);
        return sText;
      }
    };

    _proto._onSearch = function _onSearch(oEvent) {
      this.setCountsOutDated(true);
      this.setFreezeContent(false);

      if (this.getSelectedInnerControl()) {
        var _this$_getViewControl3;

        this._updateMultiTabNotApplicableFields((_this$_getViewControl3 = this._getViewController()) === null || _this$_getViewControl3 === void 0 ? void 0 : _this$_getViewControl3.oResourceBundle);
      } else {
        // custom tab
        this._refreshCustomView(oEvent.getParameter("conditions"), "search");
      }
    };

    _proto._onFilterChanged = function _onFilterChanged(oEvent) {
      if (oEvent.getParameter("conditionsBased")) {
        this.setFreezeContent(true);
      }
    };

    return MultipleModeControl;
  }(Control), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "showCounts", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "freezeContent", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "countsOutDated", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "innerControls", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "filterControl", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "select", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return MultipleModeControl;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCaW5kaW5nQWN0aW9uIiwiTXVsdGlwbGVNb2RlQ29udHJvbCIsImRlZmluZVVJNUNsYXNzIiwicHJvcGVydHkiLCJ0eXBlIiwiZGVmYXVsdFZhbHVlIiwiYWdncmVnYXRpb24iLCJtdWx0aXBsZSIsImlzRGVmYXVsdCIsImFzc29jaWF0aW9uIiwiZXZlbnQiLCJvbkJlZm9yZVJlbmRlcmluZyIsImdldFRhYnNNb2RlbCIsIm9GaWx0ZXJDb250cm9sIiwiX2dldEZpbHRlckNvbnRyb2wiLCJzZXRDb3VudHNPdXREYXRlZCIsIm9GaWx0ZXJCYXJBUEkiLCJnZXRQYXJlbnQiLCJnZXRBbGxJbm5lckNvbnRyb2xzIiwiZm9yRWFjaCIsIm9NYWNyb0FQSSIsInNob3dDb3VudHMiLCJhdHRhY2hFdmVudCIsIl9yZWZyZXNoVGFic0NvdW50IiwiYmluZCIsInN1c3BlbmRCaW5kaW5nIiwiX29uU2VhcmNoIiwiX29uRmlsdGVyQ2hhbmdlZCIsIm9uQWZ0ZXJSZW5kZXJpbmciLCJnZXRTZWxlY3RlZElubmVyQ29udHJvbCIsInJlc3VtZUJpbmRpbmciLCJnZXRQcm9wZXJ0eSIsInJlbmRlciIsIm9SbSIsIm9Db250cm9sIiwicmVuZGVyQ29udHJvbCIsImNvbnRlbnQiLCJzVGFic01vZGVsIiwib0NvbnRlbnQiLCJ1bmRlZmluZWQiLCJvTW9kZWwiLCJnZXRNb2RlbCIsIkpTT05Nb2RlbCIsInNldE1vZGVsIiwib1NlbGVjdGVkVGFiIiwiZ2V0SXRlbXMiLCJmaW5kIiwib0l0ZW0iLCJnZXRLZXkiLCJnZXRTZWxlY3RlZEtleSIsIl9nZXRUYWJGcm9tSW5uZXJDb250cm9sIiwiaGFuZGxlVGFiQ2hhbmdlIiwib0V2ZW50Iiwib0ljb25UYWJCYXIiLCJnZXRTb3VyY2UiLCJvTXVsdGlDb250cm9sIiwibVBhcmFtZXRlcnMiLCJnZXRQYXJhbWV0ZXJzIiwiX3NldElubmVyQmluZGluZyIsInNQcmV2aW91c1NlbGVjdGVkS2V5IiwicHJldmlvdXNLZXkiLCJzU2VsZWN0ZWRLZXkiLCJzZWxlY3RlZEtleSIsIm9GaWx0ZXJCYXIiLCJfcmVmcmVzaEN1c3RvbVZpZXciLCJnZXRGaWx0ZXJDb25kaXRpb25zIiwiQ29udHJvbFBlcnNvbmFsaXphdGlvbldyaXRlQVBJIiwiYWRkIiwiY2hhbmdlcyIsImNoYW5nZVNwZWNpZmljRGF0YSIsImNoYW5nZVR5cGUiLCJwcmV2aW91c1NlbGVjdGVkS2V5Iiwic2VsZWN0b3JFbGVtZW50IiwiX2dldFZpZXdDb250cm9sbGVyIiwiZ2V0RXh0ZW5zaW9uQVBJIiwidXBkYXRlQXBwU3RhdGUiLCJmaXJlRXZlbnQiLCJpY29uVGFiQmFyIiwiaW52YWxpZGF0ZUNvbnRlbnQiLCJiVmFsdWUiLCJzZXRQcm9wZXJ0eSIsInNldEZyZWV6ZUNvbnRlbnQiLCJfdXBkYXRlTXVsdGlUYWJOb3RBcHBsaWNhYmxlRmllbGRzIiwib1Jlc291cmNlQnVuZGxlIiwidGFic01vZGVsIiwicmVzdWx0cyIsIm9UYWIiLCJzVGFiSWQiLCJtSWdub3JlZEZpZWxkcyIsInJlZnJlc2hOb3RBcHBsaWNhYmxlRmllbGRzIiwibm90QXBwbGljYWJsZSIsImZpZWxkcyIsInRpdGxlIiwiX3NldFRhYk1lc3NhZ2VTdHJpcCIsImVudGl0eVR5cGVQYXRoIiwiZGF0YSIsImlnbm9yZWRGaWVsZHMiLCJyZXNvdXJjZUJ1bmRsZSIsImdldFRleHQiLCJzZXREYXRhIiwiYk9ubHlGb3JWaXNpYmxlVGFiIiwiaW5uZXJDb250cm9scyIsInJlZHVjZSIsImFJbm5lckNvbnRyb2xzIiwic0lubmVyQ29udHJvbCIsIkNvcmUiLCJieUlkIiwicHVzaCIsImZpbHRlciIsIm9Jbm5lckNvbnRyb2wiLCJnZXRWaXNpYmxlIiwiZmlsdGVyQ29udHJvbCIsInNTdXBwb3J0ZWRDbGFzcyIsIkljb25UYWJGaWx0ZXIiLCJnZXRNZXRhZGF0YSIsImdldE5hbWUiLCJpc0EiLCJvVmlldyIsIkNvbW1vblV0aWxzIiwiZ2V0VGFyZ2V0VmlldyIsImdldENvbnRyb2xsZXIiLCJvRmlsdGVyQ29uZGl0aW9ucyIsInNSZWZyZXNoQ2F1c2UiLCJvblZpZXdOZWVkc1JlZnJlc2giLCJmaWx0ZXJDb25kaXRpb25zIiwiY3VycmVudFRhYklkIiwicmVmcmVzaENhdXNlIiwib0ljb25UYWJGaWx0ZXIiLCJnZXRDb3VudHMiLCJjb3VudHNPdXREYXRlZCIsInNldENvdW50IiwidGhlbiIsImlDb3VudCIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJiUmVxdWVzdElmTm90SW5pdGlhbGl6ZWQiLCJiSXNTZWxlY3RlZEtleSIsInNBY3Rpb24iLCJSZXN1bWUiLCJTdXNwZW5kIiwicHJvcGVydGllcyIsInNUZXh0IiwiYUlnbm9yZWRGaWVsZHMiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJhSWdub3JlZExhYmVscyIsIk1lc3NhZ2VTdHJpcCIsImdldExhYmVscyIsIkRlbGVnYXRlVXRpbCIsImdldExvY2FsaXplZFRleHQiLCJnZXRQYXJhbWV0ZXIiLCJDb250cm9sIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJNdWx0aXBsZU1vZGVDb250cm9sLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB0eXBlIEZpbHRlckJhciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbHMvRmlsdGVyQmFyXCI7XG5pbXBvcnQgeyBhZ2dyZWdhdGlvbiwgYXNzb2NpYXRpb24sIGRlZmluZVVJNUNsYXNzLCBldmVudCwgcHJvcGVydHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBNZXNzYWdlU3RyaXAgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTWVzc2FnZVN0cmlwXCI7XG5pbXBvcnQgRGVsZWdhdGVVdGlsIGZyb20gXCJzYXAvZmUvbWFjcm9zL0RlbGVnYXRlVXRpbFwiO1xuaW1wb3J0IE1hY3JvQVBJIGZyb20gXCJzYXAvZmUvbWFjcm9zL01hY3JvQVBJXCI7XG5pbXBvcnQgSWNvblRhYkJhciBmcm9tIFwic2FwL20vSWNvblRhYkJhclwiO1xuaW1wb3J0IEljb25UYWJGaWx0ZXIgZnJvbSBcInNhcC9tL0ljb25UYWJGaWx0ZXJcIjtcbmltcG9ydCB0eXBlIENvcmVFdmVudCBmcm9tIFwic2FwL3VpL2Jhc2UvRXZlbnRcIjtcbmltcG9ydCBDb250cm9sIGZyb20gXCJzYXAvdWkvY29yZS9Db250cm9sXCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IFJlbmRlck1hbmFnZXIgZnJvbSBcInNhcC91aS9jb3JlL1JlbmRlck1hbmFnZXJcIjtcbmltcG9ydCBDb250cm9sUGVyc29uYWxpemF0aW9uV3JpdGVBUEkgZnJvbSBcInNhcC91aS9mbC93cml0ZS9hcGkvQ29udHJvbFBlcnNvbmFsaXphdGlvbldyaXRlQVBJXCI7XG5pbXBvcnQgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCBNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL01vZGVsXCI7XG5cbmV4cG9ydCB0eXBlIElubmVyQ29udHJvbFR5cGUgPSBNYWNyb0FQSSAmXG5cdFBhcnRpYWw8e1xuXHRcdHJlc3VtZUJpbmRpbmc6IEZ1bmN0aW9uO1xuXHRcdHN1c3BlbmRCaW5kaW5nOiBGdW5jdGlvbjtcblx0XHRnZXRDb3VudHM6IEZ1bmN0aW9uO1xuXHRcdHJlZnJlc2hOb3RBcHBsaWNhYmxlRmllbGRzOiBGdW5jdGlvbjtcblx0XHRpbnZhbGlkYXRlQ29udGVudDogRnVuY3Rpb247XG5cdH0+O1xuXG50eXBlIE1lc3NhZ2VTdHJpcFByb3BlcnRpZXMgPSB7XG5cdGVudGl0eVR5cGVQYXRoOiBzdHJpbmc7XG5cdGlnbm9yZWRGaWVsZHM6IGFueVtdO1xuXHRyZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGU7XG5cdHRpdGxlOiBzdHJpbmc7XG59O1xuXG5lbnVtIEJpbmRpbmdBY3Rpb24ge1xuXHRTdXNwZW5kID0gXCJzdXNwZW5kQmluZGluZ1wiLFxuXHRSZXN1bWUgPSBcInJlc3VtZUJpbmRpbmdcIlxufVxuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUudGVtcGxhdGVzLkxpc3RSZXBvcnQuY29udHJvbHMuTXVsdGlwbGVNb2RlQ29udHJvbFwiKVxuY2xhc3MgTXVsdGlwbGVNb2RlQ29udHJvbCBleHRlbmRzIENvbnRyb2wge1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiB9KVxuXHRzaG93Q291bnRzITogYm9vbGVhbjtcblxuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KVxuXHRmcmVlemVDb250ZW50ITogYm9vbGVhbjtcblxuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KVxuXHRjb3VudHNPdXREYXRlZCE6IGJvb2xlYW47XG5cblx0QGFnZ3JlZ2F0aW9uKHsgdHlwZTogXCJzYXAubS5JY29uVGFiQmFyXCIsIG11bHRpcGxlOiBmYWxzZSwgaXNEZWZhdWx0OiB0cnVlIH0pXG5cdGNvbnRlbnQhOiBJY29uVGFiQmFyO1xuXG5cdEBhc3NvY2lhdGlvbih7IHR5cGU6IFwic2FwLnVpLmNvcmUuQ29udHJvbFwiLCBtdWx0aXBsZTogdHJ1ZSB9KVxuXHRpbm5lckNvbnRyb2xzITogc3RyaW5nW107XG5cblx0QGFzc29jaWF0aW9uKHsgdHlwZTogXCJzYXAuZmUuY29yZS5jb250cm9scy5GaWx0ZXJCYXJcIiwgbXVsdGlwbGU6IGZhbHNlIH0pXG5cdGZpbHRlckNvbnRyb2whOiBzdHJpbmc7XG5cblx0QGV2ZW50KClcblx0c2VsZWN0ITogRnVuY3Rpb247XG5cblx0b25CZWZvcmVSZW5kZXJpbmcoKSB7XG5cdFx0dGhpcy5nZXRUYWJzTW9kZWwoKTsgLy8gR2VuZXJhdGUgdGhlIG1vZGVsIHdoaWNoIGlzIG1hbmRhdG9yeSBmb3Igc29tZSBiaW5kaW5nc1xuXG5cdFx0Y29uc3Qgb0ZpbHRlckNvbnRyb2wgPSB0aGlzLl9nZXRGaWx0ZXJDb250cm9sKCk7XG5cdFx0aWYgKCFvRmlsdGVyQ29udHJvbCkge1xuXHRcdFx0Ly8gSW4gY2FzZSB0aGVyZSdzIG5vIGZpbHRlcmJhciwgd2UgaGF2ZSB0byB1cGRhdGUgdGhlIGNvdW50cyBpbiB0aGUgdGFicyBpbW1lZGlhdGVseVxuXHRcdFx0dGhpcy5zZXRDb3VudHNPdXREYXRlZCh0cnVlKTtcblx0XHR9XG5cdFx0Y29uc3Qgb0ZpbHRlckJhckFQSSA9IG9GaWx0ZXJDb250cm9sPy5nZXRQYXJlbnQoKTtcblx0XHR0aGlzLmdldEFsbElubmVyQ29udHJvbHMoKS5mb3JFYWNoKChvTWFjcm9BUEkpID0+IHtcblx0XHRcdGlmICh0aGlzLnNob3dDb3VudHMpIHtcblx0XHRcdFx0b01hY3JvQVBJLmF0dGFjaEV2ZW50KFwiaW50ZXJuYWxEYXRhUmVxdWVzdGVkXCIsIHRoaXMuX3JlZnJlc2hUYWJzQ291bnQuYmluZCh0aGlzKSk7XG5cdFx0XHR9XG5cdFx0XHRvTWFjcm9BUEkuc3VzcGVuZEJpbmRpbmc/LigpO1xuXHRcdH0pO1xuXHRcdGlmIChvRmlsdGVyQmFyQVBJKSB7XG5cdFx0XHRvRmlsdGVyQmFyQVBJLmF0dGFjaEV2ZW50KFwiaW50ZXJuYWxTZWFyY2hcIiwgdGhpcy5fb25TZWFyY2guYmluZCh0aGlzKSk7XG5cdFx0XHRvRmlsdGVyQmFyQVBJLmF0dGFjaEV2ZW50KFwiaW50ZXJuYWxGaWx0ZXJDaGFuZ2VkXCIsIHRoaXMuX29uRmlsdGVyQ2hhbmdlZC5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH1cblxuXHRvbkFmdGVyUmVuZGVyaW5nKCkge1xuXHRcdHRoaXMuZ2V0U2VsZWN0ZWRJbm5lckNvbnRyb2woKT8ucmVzdW1lQmluZGluZz8uKCF0aGlzLmdldFByb3BlcnR5KFwiZnJlZXplQ29udGVudFwiKSk7XG5cdH1cblxuXHRzdGF0aWMgcmVuZGVyKG9SbTogUmVuZGVyTWFuYWdlciwgb0NvbnRyb2w6IE11bHRpcGxlTW9kZUNvbnRyb2wpIHtcblx0XHRvUm0ucmVuZGVyQ29udHJvbChvQ29udHJvbC5jb250ZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBtb2RlbCBjb250YWluaW5nIGluZm9ybWF0aW9uIHJlbGF0ZWQgdG8gdGhlIEljb25UYWJGaWx0ZXJzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c2FwLnVpLm1vZGVsLk1vZGVsIHwgdW5kZWZpbmVkfSBUaGUgbW9kZWxcblx0ICovXG5cdGdldFRhYnNNb2RlbCgpOiBNb2RlbCB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3Qgc1RhYnNNb2RlbCA9IFwidGFic0ludGVybmFsXCI7XG5cdFx0Y29uc3Qgb0NvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG5cdFx0aWYgKCFvQ29udGVudCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0bGV0IG9Nb2RlbCA9IG9Db250ZW50LmdldE1vZGVsKHNUYWJzTW9kZWwpO1xuXHRcdGlmICghb01vZGVsKSB7XG5cdFx0XHRvTW9kZWwgPSBuZXcgSlNPTk1vZGVsKHt9KTtcblx0XHRcdG9Db250ZW50LnNldE1vZGVsKG9Nb2RlbCwgc1RhYnNNb2RlbCk7XG5cdFx0fVxuXHRcdHJldHVybiBvTW9kZWw7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgaW5uZXIgY29udHJvbCBvZiB0aGUgZGlzcGxheWVkIHRhYi5cblx0ICpcblx0ICogQHJldHVybnMge0lubmVyQ29udHJvbFR5cGUgfCB1bmRlZmluZWR9IFRoZSBjb250cm9sXG5cdCAqL1xuXHRnZXRTZWxlY3RlZElubmVyQ29udHJvbCgpOiBJbm5lckNvbnRyb2xUeXBlIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBvU2VsZWN0ZWRUYWIgPSB0aGlzLmNvbnRlbnQ/LmdldEl0ZW1zKCkuZmluZCgob0l0ZW0pID0+IChvSXRlbSBhcyBJY29uVGFiRmlsdGVyKS5nZXRLZXkoKSA9PT0gdGhpcy5jb250ZW50LmdldFNlbGVjdGVkS2V5KCkpO1xuXHRcdHJldHVybiBvU2VsZWN0ZWRUYWJcblx0XHRcdD8gdGhpcy5nZXRBbGxJbm5lckNvbnRyb2xzKCkuZmluZCgob01hY3JvQVBJKSA9PiB0aGlzLl9nZXRUYWJGcm9tSW5uZXJDb250cm9sKG9NYWNyb0FQSSkgPT09IG9TZWxlY3RlZFRhYilcblx0XHRcdDogdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgdGhlIGJpbmRpbmcgb2YgYWxsIGlubmVyIGNvbnRyb2xzIHdoZW4gdGhlIHNlbGVjdGVkIEljb25UYWJGaWx0ZXIgaXMgY2hhbmdlZC5cblx0ICpcblx0ICogQHBhcmFtIHtzYXAudWkuYmFzZS5FdmVudH0gb0V2ZW50IEV2ZW50IGZpcmVkIGJ5IHRoZSBJY29uVGFiQmFyXG5cdCAqL1xuXHRzdGF0aWMgaGFuZGxlVGFiQ2hhbmdlKG9FdmVudDogYW55KTogdm9pZCB7XG5cdFx0Y29uc3Qgb0ljb25UYWJCYXIgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdFx0Y29uc3Qgb011bHRpQ29udHJvbCA9IG9JY29uVGFiQmFyLmdldFBhcmVudCgpO1xuXG5cdFx0Y29uc3QgbVBhcmFtZXRlcnMgPSBvRXZlbnQuZ2V0UGFyYW1ldGVycygpO1xuXHRcdG9NdWx0aUNvbnRyb2wuX3NldElubmVyQmluZGluZyh0cnVlKTtcblx0XHRjb25zdCBzUHJldmlvdXNTZWxlY3RlZEtleSA9IG1QYXJhbWV0ZXJzPy5wcmV2aW91c0tleTtcblx0XHRjb25zdCBzU2VsZWN0ZWRLZXkgPSBtUGFyYW1ldGVycz8uc2VsZWN0ZWRLZXk7XG5cblx0XHRpZiAoc1NlbGVjdGVkS2V5ICYmIHNQcmV2aW91c1NlbGVjdGVkS2V5ICE9PSBzU2VsZWN0ZWRLZXkpIHtcblx0XHRcdGNvbnN0IG9GaWx0ZXJCYXIgPSBvTXVsdGlDb250cm9sLl9nZXRGaWx0ZXJDb250cm9sKCk7XG5cdFx0XHRpZiAob0ZpbHRlckJhciAmJiAhb011bHRpQ29udHJvbC5nZXRQcm9wZXJ0eShcImZyZWV6ZUNvbnRlbnRcIikpIHtcblx0XHRcdFx0aWYgKCFvTXVsdGlDb250cm9sLmdldFNlbGVjdGVkSW5uZXJDb250cm9sKCkpIHtcblx0XHRcdFx0XHQvL2N1c3RvbSB0YWJcblx0XHRcdFx0XHRvTXVsdGlDb250cm9sLl9yZWZyZXNoQ3VzdG9tVmlldyhvRmlsdGVyQmFyLmdldEZpbHRlckNvbmRpdGlvbnMoKSwgXCJ0YWJDaGFuZ2VkXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRDb250cm9sUGVyc29uYWxpemF0aW9uV3JpdGVBUEkuYWRkKHtcblx0XHRcdFx0Y2hhbmdlczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNoYW5nZVNwZWNpZmljRGF0YToge1xuXHRcdFx0XHRcdFx0XHRjaGFuZ2VUeXBlOiBcInNlbGVjdEljb25UYWJCYXJGaWx0ZXJcIixcblx0XHRcdFx0XHRcdFx0Y29udGVudDoge1xuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGVkS2V5OiBzU2VsZWN0ZWRLZXksXG5cdFx0XHRcdFx0XHRcdFx0cHJldmlvdXNTZWxlY3RlZEtleTogc1ByZXZpb3VzU2VsZWN0ZWRLZXlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNlbGVjdG9yRWxlbWVudDogb0ljb25UYWJCYXJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdG9NdWx0aUNvbnRyb2wuX2dldFZpZXdDb250cm9sbGVyKCk/LmdldEV4dGVuc2lvbkFQSSgpPy51cGRhdGVBcHBTdGF0ZSgpO1xuXG5cdFx0b011bHRpQ29udHJvbC5maXJlRXZlbnQoXCJzZWxlY3RcIiwge1xuXHRcdFx0aWNvblRhYkJhcjogb0ljb25UYWJCYXIsXG5cdFx0XHRzZWxlY3RlZEtleTogc1NlbGVjdGVkS2V5LFxuXHRcdFx0cHJldmlvdXNLZXk6IHNQcmV2aW91c1NlbGVjdGVkS2V5XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogSW52YWxpZGF0ZXMgdGhlIGNvbnRlbnQgb2YgYWxsIGlubmVyIGNvbnRyb2xzLlxuXHQgKi9cblx0aW52YWxpZGF0ZUNvbnRlbnQoKSB7XG5cdFx0dGhpcy5zZXRDb3VudHNPdXREYXRlZCh0cnVlKTtcblx0XHR0aGlzLmdldEFsbElubmVyQ29udHJvbHMoKS5mb3JFYWNoKChvTWFjcm9BUEkpID0+IHtcblx0XHRcdG9NYWNyb0FQSS5pbnZhbGlkYXRlQ29udGVudD8uKCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgY291bnRzIHRvIG91dCBvZiBkYXRlIG9yIHVwIHRvIGRhdGVcblx0ICogSWYgdGhlIGNvdW50cyBhcmUgc2V0IHRvIFwib3V0IG9mIGRhdGVcIiBhbmQgdGhlIHNlbGVjdGVkIEljb25UYWJGaWx0ZXIgZG9lc24ndCBjb250YWluIGFuIGlubmVyIGNvbnRyb2wgYWxsIGlubmVyIGNvbnRyb2xzIGFyZSByZXF1ZXN0ZWQgdG8gZ2V0IHRoZSBuZXcgY291bnRzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGJWYWx1ZSBGcmVlemUgb3Igbm90IHRoZSBjb250cm9sXG5cdCAqL1xuXHRzZXRDb3VudHNPdXREYXRlZChiVmFsdWUgPSB0cnVlKSB7XG5cdFx0dGhpcy5zZXRQcm9wZXJ0eShcImNvdW50c091dERhdGVkXCIsIGJWYWx1ZSk7XG5cdFx0Ly8gaWYgdGhlIGN1cnJlbnQgdGFiIGlzIG5vdCBjb25maWd1cmVkIHdpdGggbm8gaW5uZXIgQ29udHJvbFxuXHRcdC8vIHRoZSB0YWIgY291bnRzIG11c3QgYmUgbWFudWFsbHkgcmVmcmVzaGVkIHNpbmNlIG5vIE1hY3JvIEFQSSB3aWxsIHNlbnQgZXZlbnQgaW50ZXJuYWxEYXRhUmVxdWVzdGVkXG5cdFx0aWYgKGJWYWx1ZSAmJiAhdGhpcy5nZXRTZWxlY3RlZElubmVyQ29udHJvbCgpKSB7XG5cdFx0XHR0aGlzLl9yZWZyZXNoVGFic0NvdW50KCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZyZWV6ZXMgdGhlIGNvbnRlbnQgOlxuXHQgKiAgLSBjb250ZW50IGlzIGZyb3plbjogdGhlIGJpbmRpbmcgb2YgdGhlIGlubmVyIGNvbnRyb2xzIGFyZSBzdXNwZW5kZWQuXG5cdCAqICAtIGNvbnRlbnQgaXMgdW5mcm96ZW46IHRoZSBiaW5kaW5nIG9mIGlubmVyIGNvbnRyb2wgcmVsYXRlZCB0byB0aGUgc2VsZWN0ZWQgSWNvblRhYkZpbHRlciBpcyByZXN1bWVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGJWYWx1ZSBGcmVlemUgb3Igbm90IHRoZSBjb250cm9sXG5cdCAqL1xuXHRzZXRGcmVlemVDb250ZW50KGJWYWx1ZTogYm9vbGVhbikge1xuXHRcdHRoaXMuc2V0UHJvcGVydHkoXCJmcmVlemVDb250ZW50XCIsIGJWYWx1ZSk7XG5cdFx0dGhpcy5fc2V0SW5uZXJCaW5kaW5nKCk7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgaW50ZXJuYWwgbW9kZWwgd2l0aCB0aGUgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgYXBwbGljYWJsZSBvbiBlYWNoIEljb25UYWJGaWx0ZXIgKGNvbnRhaW5pbmcgaW5uZXIgY29udHJvbCkgYWNjb3JkaW5nIHRvIHRoZSBlbnRpdHlUeXBlIG9mIHRoZSBmaWx0ZXIgY29udHJvbC5cblx0ICpcblx0ICogQHBhcmFtIG9SZXNvdXJjZUJ1bmRsZVxuXHQgKi9cblx0X3VwZGF0ZU11bHRpVGFiTm90QXBwbGljYWJsZUZpZWxkcyhvUmVzb3VyY2VCdW5kbGU6IFJlc291cmNlQnVuZGxlKSB7XG5cdFx0Y29uc3QgdGFic01vZGVsID0gdGhpcy5nZXRUYWJzTW9kZWwoKTtcblx0XHRjb25zdCBvRmlsdGVyQ29udHJvbCA9IHRoaXMuX2dldEZpbHRlckNvbnRyb2woKSBhcyBDb250cm9sO1xuXHRcdGlmICh0YWJzTW9kZWwgJiYgb0ZpbHRlckNvbnRyb2wpIHtcblx0XHRcdGNvbnN0IHJlc3VsdHM6IGFueSA9IHt9O1xuXHRcdFx0dGhpcy5nZXRBbGxJbm5lckNvbnRyb2xzKCkuZm9yRWFjaCgob01hY3JvQVBJKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9UYWIgPSB0aGlzLl9nZXRUYWJGcm9tSW5uZXJDb250cm9sKG9NYWNyb0FQSSk7XG5cdFx0XHRcdGlmIChvVGFiKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc1RhYklkID0gb1RhYi5nZXRLZXkoKTtcblx0XHRcdFx0XHRjb25zdCBtSWdub3JlZEZpZWxkcyA9IG9NYWNyb0FQSS5yZWZyZXNoTm90QXBwbGljYWJsZUZpZWxkcz8uKG9GaWx0ZXJDb250cm9sKSB8fCBbXTtcblx0XHRcdFx0XHRyZXN1bHRzW3NUYWJJZF0gPSB7XG5cdFx0XHRcdFx0XHRub3RBcHBsaWNhYmxlOiB7XG5cdFx0XHRcdFx0XHRcdGZpZWxkczogbUlnbm9yZWRGaWVsZHMsXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiB0aGlzLl9zZXRUYWJNZXNzYWdlU3RyaXAoe1xuXHRcdFx0XHRcdFx0XHRcdGVudGl0eVR5cGVQYXRoOiBvRmlsdGVyQ29udHJvbC5kYXRhKFwiZW50aXR5VHlwZVwiKSxcblx0XHRcdFx0XHRcdFx0XHRpZ25vcmVkRmllbGRzOiBtSWdub3JlZEZpZWxkcyxcblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZUJ1bmRsZTogb1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBvVGFiLmdldFRleHQoKVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0KHRhYnNNb2RlbCBhcyBhbnkpLnNldERhdGEocmVzdWx0cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGlubmVyIGNvbnRyb2xzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGJPbmx5Rm9yVmlzaWJsZVRhYiBTaG91bGQgZGlzcGxheSBvbmx5IHRoZSB2aXNpYmxlIGNvbnRyb2xzXG5cdCAqIEByZXR1cm5zIHtJbm5lckNvbnRyb2xUeXBlW119IEFuIGFycmF5IG9mIGNvbnRyb2xzXG5cdCAqL1xuXHRnZXRBbGxJbm5lckNvbnRyb2xzKGJPbmx5Rm9yVmlzaWJsZVRhYiA9IGZhbHNlKTogSW5uZXJDb250cm9sVHlwZVtdIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dGhpcy5pbm5lckNvbnRyb2xzLnJlZHVjZSgoYUlubmVyQ29udHJvbHM6IElubmVyQ29udHJvbFR5cGVbXSwgc0lubmVyQ29udHJvbDogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9Db250cm9sID0gQ29yZS5ieUlkKHNJbm5lckNvbnRyb2wpIGFzIElubmVyQ29udHJvbFR5cGU7XG5cdFx0XHRcdGlmIChvQ29udHJvbCkge1xuXHRcdFx0XHRcdGFJbm5lckNvbnRyb2xzLnB1c2gob0NvbnRyb2wpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBhSW5uZXJDb250cm9scy5maWx0ZXIoXG5cdFx0XHRcdFx0KG9Jbm5lckNvbnRyb2wpID0+ICFiT25seUZvclZpc2libGVUYWIgfHwgdGhpcy5fZ2V0VGFiRnJvbUlubmVyQ29udHJvbChvSW5uZXJDb250cm9sKT8uZ2V0VmlzaWJsZSgpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LCBbXSkgfHwgW11cblx0XHQpO1xuXHR9XG5cblx0X2dldEZpbHRlckNvbnRyb2woKTogRmlsdGVyQmFyIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gQ29yZS5ieUlkKHRoaXMuZmlsdGVyQ29udHJvbCkgYXMgRmlsdGVyQmFyIHwgdW5kZWZpbmVkO1xuXHR9XG5cblx0X2dldFRhYkZyb21Jbm5lckNvbnRyb2wob0NvbnRyb2w6IENvbnRyb2wpOiBJY29uVGFiRmlsdGVyIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBzU3VwcG9ydGVkQ2xhc3MgPSBJY29uVGFiRmlsdGVyLmdldE1ldGFkYXRhKCkuZ2V0TmFtZSgpO1xuXHRcdGxldCBvVGFiOiBhbnkgPSBvQ29udHJvbDtcblx0XHRpZiAob1RhYiAmJiAhb1RhYi5pc0Eoc1N1cHBvcnRlZENsYXNzKSAmJiBvVGFiLmdldFBhcmVudCkge1xuXHRcdFx0b1RhYiA9IG9Db250cm9sLmdldFBhcmVudCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gb1RhYiAmJiBvVGFiLmlzQShzU3VwcG9ydGVkQ2xhc3MpID8gKG9UYWIgYXMgSWNvblRhYkZpbHRlcikgOiB1bmRlZmluZWQ7XG5cdH1cblxuXHRfZ2V0Vmlld0NvbnRyb2xsZXIoKSB7XG5cdFx0Y29uc3Qgb1ZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KHRoaXMpO1xuXHRcdHJldHVybiBvVmlldyAmJiBvVmlldy5nZXRDb250cm9sbGVyKCk7XG5cdH1cblxuXHRfcmVmcmVzaEN1c3RvbVZpZXcob0ZpbHRlckNvbmRpdGlvbnM6IGFueSwgc1JlZnJlc2hDYXVzZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5fZ2V0Vmlld0NvbnRyb2xsZXIoKT8ub25WaWV3TmVlZHNSZWZyZXNoPy4oe1xuXHRcdFx0ZmlsdGVyQ29uZGl0aW9uczogb0ZpbHRlckNvbmRpdGlvbnMsXG5cdFx0XHRjdXJyZW50VGFiSWQ6IHRoaXMuY29udGVudC5nZXRTZWxlY3RlZEtleSgpLFxuXHRcdFx0cmVmcmVzaENhdXNlOiBzUmVmcmVzaENhdXNlXG5cdFx0fSk7XG5cdH1cblxuXHRfcmVmcmVzaFRhYnNDb3VudCgpOiB2b2lkIHtcblx0XHRjb25zdCBzU2VsZWN0ZWRLZXkgPSB0aGlzLmNvbnRlbnQ/LmdldFNlbGVjdGVkS2V5KCk7XG5cdFx0dGhpcy5nZXRBbGxJbm5lckNvbnRyb2xzKHRydWUpLmZvckVhY2goKG9NYWNyb0FQSSkgPT4ge1xuXHRcdFx0Y29uc3Qgb0ljb25UYWJGaWx0ZXIgPSB0aGlzLl9nZXRUYWJGcm9tSW5uZXJDb250cm9sKG9NYWNyb0FQSSk7XG5cdFx0XHRpZiAob01hY3JvQVBJPy5nZXRDb3VudHMgJiYgKHRoaXMuY291bnRzT3V0RGF0ZWQgfHwgc1NlbGVjdGVkS2V5ID09PSBvSWNvblRhYkZpbHRlcj8uZ2V0S2V5KCkpKSB7XG5cdFx0XHRcdGlmIChvSWNvblRhYkZpbHRlciAmJiBvSWNvblRhYkZpbHRlci5zZXRDb3VudCkge1xuXHRcdFx0XHRcdG9JY29uVGFiRmlsdGVyLnNldENvdW50KFwiLi4uXCIpO1xuXHRcdFx0XHRcdG9NYWNyb0FQSVxuXHRcdFx0XHRcdFx0LmdldENvdW50cygpXG5cdFx0XHRcdFx0XHQudGhlbigoaUNvdW50OiBzdHJpbmcpID0+IG9JY29uVGFiRmlsdGVyLnNldENvdW50KGlDb3VudCB8fCBcIjBcIikpXG5cdFx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJlcXVlc3RpbmcgQ291bnRzIGZvciBDb250cm9sXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMuc2V0Q291bnRzT3V0RGF0ZWQoZmFsc2UpO1xuXHR9XG5cblx0X3NldElubmVyQmluZGluZyhiUmVxdWVzdElmTm90SW5pdGlhbGl6ZWQgPSBmYWxzZSkge1xuXHRcdGlmICh0aGlzLmNvbnRlbnQpIHtcblx0XHRcdHRoaXMuZ2V0QWxsSW5uZXJDb250cm9scygpLmZvckVhY2goKG9NYWNyb0FQSSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvSWNvblRhYkZpbHRlciA9IHRoaXMuX2dldFRhYkZyb21Jbm5lckNvbnRyb2wob01hY3JvQVBJKTtcblx0XHRcdFx0Y29uc3QgYklzU2VsZWN0ZWRLZXkgPSBvSWNvblRhYkZpbHRlcj8uZ2V0S2V5KCkgPT09IHRoaXMuY29udGVudC5nZXRTZWxlY3RlZEtleSgpO1xuXHRcdFx0XHRjb25zdCBzQWN0aW9uID0gYklzU2VsZWN0ZWRLZXkgJiYgIXRoaXMuZ2V0UHJvcGVydHkoXCJmcmVlemVDb250ZW50XCIpID8gQmluZGluZ0FjdGlvbi5SZXN1bWUgOiBCaW5kaW5nQWN0aW9uLlN1c3BlbmQ7XG5cdFx0XHRcdG9NYWNyb0FQSVtzQWN0aW9uXT8uKHNBY3Rpb24gPT09IEJpbmRpbmdBY3Rpb24uUmVzdW1lID8gYlJlcXVlc3RJZk5vdEluaXRpYWxpemVkICYmIGJJc1NlbGVjdGVkS2V5IDogdW5kZWZpbmVkKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdF9zZXRUYWJNZXNzYWdlU3RyaXAocHJvcGVydGllczogTWVzc2FnZVN0cmlwUHJvcGVydGllcykge1xuXHRcdGxldCBzVGV4dCA9IFwiXCI7XG5cdFx0Y29uc3QgYUlnbm9yZWRGaWVsZHMgPSBwcm9wZXJ0aWVzLmlnbm9yZWRGaWVsZHM7XG5cdFx0Y29uc3Qgb0ZpbHRlckNvbnRyb2wgPSB0aGlzLl9nZXRGaWx0ZXJDb250cm9sKCkgYXMgQ29udHJvbDtcblx0XHRpZiAob0ZpbHRlckNvbnRyb2wgJiYgQXJyYXkuaXNBcnJheShhSWdub3JlZEZpZWxkcykgJiYgYUlnbm9yZWRGaWVsZHMubGVuZ3RoID4gMCAmJiBwcm9wZXJ0aWVzLnRpdGxlKSB7XG5cdFx0XHRjb25zdCBhSWdub3JlZExhYmVscyA9IE1lc3NhZ2VTdHJpcC5nZXRMYWJlbHMoXG5cdFx0XHRcdGFJZ25vcmVkRmllbGRzLFxuXHRcdFx0XHRwcm9wZXJ0aWVzLmVudGl0eVR5cGVQYXRoLFxuXHRcdFx0XHRvRmlsdGVyQ29udHJvbCxcblx0XHRcdFx0cHJvcGVydGllcy5yZXNvdXJjZUJ1bmRsZVxuXHRcdFx0KTtcblx0XHRcdHNUZXh0ID0gTWVzc2FnZVN0cmlwLmdldFRleHQoYUlnbm9yZWRMYWJlbHMsIG9GaWx0ZXJDb250cm9sLCBwcm9wZXJ0aWVzLnRpdGxlLCBEZWxlZ2F0ZVV0aWwuZ2V0TG9jYWxpemVkVGV4dCk7XG5cdFx0XHRyZXR1cm4gc1RleHQ7XG5cdFx0fVxuXHR9XG5cblx0X29uU2VhcmNoKG9FdmVudDogQ29yZUV2ZW50KTogdm9pZCB7XG5cdFx0dGhpcy5zZXRDb3VudHNPdXREYXRlZCh0cnVlKTtcblx0XHR0aGlzLnNldEZyZWV6ZUNvbnRlbnQoZmFsc2UpO1xuXHRcdGlmICh0aGlzLmdldFNlbGVjdGVkSW5uZXJDb250cm9sKCkpIHtcblx0XHRcdHRoaXMuX3VwZGF0ZU11bHRpVGFiTm90QXBwbGljYWJsZUZpZWxkcyh0aGlzLl9nZXRWaWV3Q29udHJvbGxlcigpPy5vUmVzb3VyY2VCdW5kbGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBjdXN0b20gdGFiXG5cdFx0XHR0aGlzLl9yZWZyZXNoQ3VzdG9tVmlldyhvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiY29uZGl0aW9uc1wiKSwgXCJzZWFyY2hcIik7XG5cdFx0fVxuXHR9XG5cblx0X29uRmlsdGVyQ2hhbmdlZChvRXZlbnQ6IENvcmVFdmVudCk6IHZvaWQge1xuXHRcdGlmIChvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiY29uZGl0aW9uc0Jhc2VkXCIpKSB7XG5cdFx0XHR0aGlzLnNldEZyZWV6ZUNvbnRlbnQodHJ1ZSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE11bHRpcGxlTW9kZUNvbnRyb2w7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWtDS0EsYTs7YUFBQUEsYTtJQUFBQSxhO0lBQUFBLGE7S0FBQUEsYSxLQUFBQSxhOztNQU1DQyxtQixXQURMQyxjQUFjLENBQUMsMERBQUQsQyxVQUViQyxRQUFRLENBQUM7SUFBRUMsSUFBSSxFQUFFO0VBQVIsQ0FBRCxDLFVBR1JELFFBQVEsQ0FBQztJQUFFQyxJQUFJLEVBQUUsU0FBUjtJQUFtQkMsWUFBWSxFQUFFO0VBQWpDLENBQUQsQyxVQUdSRixRQUFRLENBQUM7SUFBRUMsSUFBSSxFQUFFLFNBQVI7SUFBbUJDLFlBQVksRUFBRTtFQUFqQyxDQUFELEMsVUFHUkMsV0FBVyxDQUFDO0lBQUVGLElBQUksRUFBRSxrQkFBUjtJQUE0QkcsUUFBUSxFQUFFLEtBQXRDO0lBQTZDQyxTQUFTLEVBQUU7RUFB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