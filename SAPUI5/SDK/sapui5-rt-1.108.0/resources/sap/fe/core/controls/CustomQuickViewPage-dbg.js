/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/KeepAliveHelper", "sap/fe/macros/DelegateUtil", "sap/m/QuickViewPage"], function (CommonUtils, ClassSupport, KeepAliveHelper, DelegateUtil, QuickViewPage) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;

  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var CustomQuickViewPage = (_dec = defineUI5Class("sap.fe.core.controls.CustomQuickViewPage"), _dec2 = aggregation({
    type: "sap.ui.core.Control",
    multiple: true
  }), _dec3 = aggregation({
    type: "sap.m.QuickViewGroup",
    multiple: true,
    singularName: "group",
    isDefault: true
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_QuickViewPage) {
    _inheritsLoose(CustomQuickViewPage, _QuickViewPage);

    function CustomQuickViewPage() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _QuickViewPage.call.apply(_QuickViewPage, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "customContent", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "groups", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    var _proto = CustomQuickViewPage.prototype;

    _proto.onBeforeRendering = function onBeforeRendering(oEvent) {
      var _this2 = this;

      if (this.getParent() && this.getParent().isA("sap.fe.core.controls.ConditionalWrapper") && this.getParent().getProperty("condition") === true) {
        this.setCrossAppNavCallback(function () {
          var sQuickViewPageTitleLinkHref = DelegateUtil.getCustomData(_this2, "titleLink");
          var oView = CommonUtils.getTargetView(_this2);
          var oAppComponent = CommonUtils.getAppComponent(oView);
          var oShellServiceHelper = oAppComponent.getShellServices();
          var oShellHash = oShellServiceHelper.parseShellHash(sQuickViewPageTitleLinkHref);
          var oNavArgs = {
            target: {
              semanticObject: oShellHash.semanticObject,
              action: oShellHash.action
            },
            params: oShellHash.params
          };
          var sQuickViewPageTitleLinkIntent = "".concat(oNavArgs.target.semanticObject, "-").concat(oNavArgs.target.action);

          if (sQuickViewPageTitleLinkIntent && _this2.oCrossAppNavigator && _this2.oCrossAppNavigator.isNavigationSupported([sQuickViewPageTitleLinkIntent])) {
            if (sQuickViewPageTitleLinkIntent && sQuickViewPageTitleLinkIntent !== "") {
              if (typeof sQuickViewPageTitleLinkIntent === "string" && sQuickViewPageTitleLinkIntent !== "") {
                var sTargetHref;

                var oLinkControl = _this2.getParent();

                while (oLinkControl && !oLinkControl.isA("sap.ui.mdc.Link")) {
                  oLinkControl = oLinkControl.getParent();
                }

                var _aLinks = oLinkControl.getModel("$sapuimdcLink").getProperty("/linkItems");

                if (_aLinks) {
                  if (_aLinks.length > 0) {
                    for (var i = 0; i < _aLinks.length; i++) {
                      if (_aLinks[i].key === sQuickViewPageTitleLinkIntent) {
                        sTargetHref = _aLinks[i].href;
                        break;
                      }
                    }

                    if (sTargetHref) {
                      oShellHash = oShellServiceHelper.parseShellHash(sTargetHref);
                    } else {
                      oShellHash = oShellServiceHelper.parseShellHash(sQuickViewPageTitleLinkIntent);
                      oShellHash.params = oNavArgs.params;
                    }
                  }
                } else {
                  oShellHash = oShellServiceHelper.parseShellHash(sQuickViewPageTitleLinkIntent);
                }

                KeepAliveHelper.storeControlRefreshStrategyForHash(oView, oShellHash);
                return {
                  target: {
                    semanticObject: oShellHash.semanticObject,
                    action: oShellHash.action
                  },
                  params: oShellHash.params
                };
              }
            }
          } else {
            var oCurrentShellHash = oShellServiceHelper.parseShellHash(window.location.hash);
            KeepAliveHelper.storeControlRefreshStrategyForHash(oView, oCurrentShellHash);
            return {
              target: {
                semanticObject: oCurrentShellHash.semanticObject,
                action: oCurrentShellHash.action,
                appSpecificRoute: oCurrentShellHash.appSpecificRoute
              },
              params: oCurrentShellHash.params
            };
          }
        });
      }

      _QuickViewPage.prototype.onBeforeRendering.call(this, oEvent);

      var oPageContent = this.getPageContent();
      var oForm = oPageContent.form;

      if (oForm) {
        var _aContent = this.customContent;

        if (_aContent && _aContent.length > 0) {
          _aContent.forEach(function (_oContent) {
            var _oContentClone = _oContent.clone();

            _oContentClone.setModel(_this2.getModel());

            _oContentClone.setBindingContext(_this2.getBindingContext());

            oForm.addContent(_oContentClone);
          });

          setTimeout(function () {
            oForm.rerender();
          }, 0);
        }
      }
    };

    return CustomQuickViewPage;
  }(QuickViewPage), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "customContent", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "groups", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return CustomQuickViewPage;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDdXN0b21RdWlja1ZpZXdQYWdlIiwiZGVmaW5lVUk1Q2xhc3MiLCJhZ2dyZWdhdGlvbiIsInR5cGUiLCJtdWx0aXBsZSIsInNpbmd1bGFyTmFtZSIsImlzRGVmYXVsdCIsIm9uQmVmb3JlUmVuZGVyaW5nIiwib0V2ZW50IiwiZ2V0UGFyZW50IiwiaXNBIiwiZ2V0UHJvcGVydHkiLCJzZXRDcm9zc0FwcE5hdkNhbGxiYWNrIiwic1F1aWNrVmlld1BhZ2VUaXRsZUxpbmtIcmVmIiwiRGVsZWdhdGVVdGlsIiwiZ2V0Q3VzdG9tRGF0YSIsIm9WaWV3IiwiQ29tbW9uVXRpbHMiLCJnZXRUYXJnZXRWaWV3Iiwib0FwcENvbXBvbmVudCIsImdldEFwcENvbXBvbmVudCIsIm9TaGVsbFNlcnZpY2VIZWxwZXIiLCJnZXRTaGVsbFNlcnZpY2VzIiwib1NoZWxsSGFzaCIsInBhcnNlU2hlbGxIYXNoIiwib05hdkFyZ3MiLCJ0YXJnZXQiLCJzZW1hbnRpY09iamVjdCIsImFjdGlvbiIsInBhcmFtcyIsInNRdWlja1ZpZXdQYWdlVGl0bGVMaW5rSW50ZW50Iiwib0Nyb3NzQXBwTmF2aWdhdG9yIiwiaXNOYXZpZ2F0aW9uU3VwcG9ydGVkIiwic1RhcmdldEhyZWYiLCJvTGlua0NvbnRyb2wiLCJfYUxpbmtzIiwiZ2V0TW9kZWwiLCJsZW5ndGgiLCJpIiwia2V5IiwiaHJlZiIsIktlZXBBbGl2ZUhlbHBlciIsInN0b3JlQ29udHJvbFJlZnJlc2hTdHJhdGVneUZvckhhc2giLCJvQ3VycmVudFNoZWxsSGFzaCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsImFwcFNwZWNpZmljUm91dGUiLCJvUGFnZUNvbnRlbnQiLCJnZXRQYWdlQ29udGVudCIsIm9Gb3JtIiwiZm9ybSIsIl9hQ29udGVudCIsImN1c3RvbUNvbnRlbnQiLCJmb3JFYWNoIiwiX29Db250ZW50IiwiX29Db250ZW50Q2xvbmUiLCJjbG9uZSIsInNldE1vZGVsIiwic2V0QmluZGluZ0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsImFkZENvbnRlbnQiLCJzZXRUaW1lb3V0IiwicmVyZW5kZXIiLCJRdWlja1ZpZXdQYWdlIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJDdXN0b21RdWlja1ZpZXdQYWdlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB7IGFnZ3JlZ2F0aW9uLCBkZWZpbmVVSTVDbGFzcyB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IEtlZXBBbGl2ZUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9LZWVwQWxpdmVIZWxwZXJcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgUXVpY2tWaWV3UGFnZSBmcm9tIFwic2FwL20vUXVpY2tWaWV3UGFnZVwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5jb250cm9scy5DdXN0b21RdWlja1ZpZXdQYWdlXCIpXG5jbGFzcyBDdXN0b21RdWlja1ZpZXdQYWdlIGV4dGVuZHMgUXVpY2tWaWV3UGFnZSB7XG5cdEBhZ2dyZWdhdGlvbih7IHR5cGU6IFwic2FwLnVpLmNvcmUuQ29udHJvbFwiLCBtdWx0aXBsZTogdHJ1ZSB9KVxuXHRjdXN0b21Db250ZW50ITogQ29udHJvbFtdO1xuXHRAYWdncmVnYXRpb24oeyB0eXBlOiBcInNhcC5tLlF1aWNrVmlld0dyb3VwXCIsIG11bHRpcGxlOiB0cnVlLCBzaW5ndWxhck5hbWU6IFwiZ3JvdXBcIiwgaXNEZWZhdWx0OiB0cnVlIH0pXG5cdGdyb3VwcyE6IENvbnRyb2xbXTtcblxuXHRvbkJlZm9yZVJlbmRlcmluZyhvRXZlbnQ6IGFueSkge1xuXHRcdGlmIChcblx0XHRcdHRoaXMuZ2V0UGFyZW50KCkgJiZcblx0XHRcdHRoaXMuZ2V0UGFyZW50KCkuaXNBKFwic2FwLmZlLmNvcmUuY29udHJvbHMuQ29uZGl0aW9uYWxXcmFwcGVyXCIpICYmXG5cdFx0XHR0aGlzLmdldFBhcmVudCgpLmdldFByb3BlcnR5KFwiY29uZGl0aW9uXCIpID09PSB0cnVlXG5cdFx0KSB7XG5cdFx0XHR0aGlzLnNldENyb3NzQXBwTmF2Q2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0hyZWYgPSAoRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEgYXMgYW55KSh0aGlzLCBcInRpdGxlTGlua1wiKTtcblx0XHRcdFx0Y29uc3Qgb1ZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KHRoaXMpO1xuXHRcdFx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KG9WaWV3KTtcblx0XHRcdFx0Y29uc3Qgb1NoZWxsU2VydmljZUhlbHBlciA9IG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpO1xuXHRcdFx0XHRsZXQgb1NoZWxsSGFzaCA9IG9TaGVsbFNlcnZpY2VIZWxwZXIucGFyc2VTaGVsbEhhc2goc1F1aWNrVmlld1BhZ2VUaXRsZUxpbmtIcmVmKTtcblx0XHRcdFx0Y29uc3Qgb05hdkFyZ3MgPSB7XG5cdFx0XHRcdFx0dGFyZ2V0OiB7XG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogb1NoZWxsSGFzaC5zZW1hbnRpY09iamVjdCxcblx0XHRcdFx0XHRcdGFjdGlvbjogb1NoZWxsSGFzaC5hY3Rpb25cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHBhcmFtczogb1NoZWxsSGFzaC5wYXJhbXNcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3Qgc1F1aWNrVmlld1BhZ2VUaXRsZUxpbmtJbnRlbnQgPSBgJHtvTmF2QXJncy50YXJnZXQuc2VtYW50aWNPYmplY3R9LSR7b05hdkFyZ3MudGFyZ2V0LmFjdGlvbn1gO1xuXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudCAmJlxuXHRcdFx0XHRcdHRoaXMub0Nyb3NzQXBwTmF2aWdhdG9yICYmXG5cdFx0XHRcdFx0dGhpcy5vQ3Jvc3NBcHBOYXZpZ2F0b3IuaXNOYXZpZ2F0aW9uU3VwcG9ydGVkKFtzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudF0pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudCAmJiBzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudCAhPT0gXCJcIikge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudCA9PT0gXCJzdHJpbmdcIiAmJiBzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudCAhPT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRsZXQgc1RhcmdldEhyZWY7XG5cdFx0XHRcdFx0XHRcdGxldCBvTGlua0NvbnRyb2wgPSB0aGlzLmdldFBhcmVudCgpO1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAob0xpbmtDb250cm9sICYmICFvTGlua0NvbnRyb2wuaXNBKFwic2FwLnVpLm1kYy5MaW5rXCIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0b0xpbmtDb250cm9sID0gb0xpbmtDb250cm9sLmdldFBhcmVudCgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9hTGlua3MgPSBvTGlua0NvbnRyb2wuZ2V0TW9kZWwoXCIkc2FwdWltZGNMaW5rXCIpLmdldFByb3BlcnR5KFwiL2xpbmtJdGVtc1wiKTtcblx0XHRcdFx0XHRcdFx0aWYgKF9hTGlua3MpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoX2FMaW5rcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IF9hTGlua3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKF9hTGlua3NbaV0ua2V5ID09PSBzUXVpY2tWaWV3UGFnZVRpdGxlTGlua0ludGVudCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNUYXJnZXRIcmVmID0gX2FMaW5rc1tpXS5ocmVmO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoc1RhcmdldEhyZWYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1NoZWxsSGFzaCA9IG9TaGVsbFNlcnZpY2VIZWxwZXIucGFyc2VTaGVsbEhhc2goc1RhcmdldEhyZWYpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1NoZWxsSGFzaCA9IG9TaGVsbFNlcnZpY2VIZWxwZXIucGFyc2VTaGVsbEhhc2goc1F1aWNrVmlld1BhZ2VUaXRsZUxpbmtJbnRlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvU2hlbGxIYXNoLnBhcmFtcyA9IG9OYXZBcmdzLnBhcmFtcztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0b1NoZWxsSGFzaCA9IG9TaGVsbFNlcnZpY2VIZWxwZXIucGFyc2VTaGVsbEhhc2goc1F1aWNrVmlld1BhZ2VUaXRsZUxpbmtJbnRlbnQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdEtlZXBBbGl2ZUhlbHBlci5zdG9yZUNvbnRyb2xSZWZyZXNoU3RyYXRlZ3lGb3JIYXNoKG9WaWV3LCBvU2hlbGxIYXNoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBvU2hlbGxIYXNoLnNlbWFudGljT2JqZWN0LFxuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiBvU2hlbGxIYXNoLmFjdGlvblxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0cGFyYW1zOiBvU2hlbGxIYXNoLnBhcmFtc1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBvQ3VycmVudFNoZWxsSGFzaCA9IG9TaGVsbFNlcnZpY2VIZWxwZXIucGFyc2VTaGVsbEhhc2god2luZG93LmxvY2F0aW9uLmhhc2gpO1xuXHRcdFx0XHRcdEtlZXBBbGl2ZUhlbHBlci5zdG9yZUNvbnRyb2xSZWZyZXNoU3RyYXRlZ3lGb3JIYXNoKG9WaWV3LCBvQ3VycmVudFNoZWxsSGFzaCk7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dGFyZ2V0OiB7XG5cdFx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBvQ3VycmVudFNoZWxsSGFzaC5zZW1hbnRpY09iamVjdCxcblx0XHRcdFx0XHRcdFx0YWN0aW9uOiBvQ3VycmVudFNoZWxsSGFzaC5hY3Rpb24sXG5cdFx0XHRcdFx0XHRcdGFwcFNwZWNpZmljUm91dGU6IG9DdXJyZW50U2hlbGxIYXNoLmFwcFNwZWNpZmljUm91dGVcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRwYXJhbXM6IG9DdXJyZW50U2hlbGxIYXNoLnBhcmFtc1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzdXBlci5vbkJlZm9yZVJlbmRlcmluZyhvRXZlbnQpO1xuXHRcdGNvbnN0IG9QYWdlQ29udGVudCA9IHRoaXMuZ2V0UGFnZUNvbnRlbnQoKTtcblx0XHRjb25zdCBvRm9ybSA9IG9QYWdlQ29udGVudC5mb3JtO1xuXHRcdGlmIChvRm9ybSkge1xuXHRcdFx0Y29uc3QgX2FDb250ZW50ID0gdGhpcy5jdXN0b21Db250ZW50O1xuXHRcdFx0aWYgKF9hQ29udGVudCAmJiBfYUNvbnRlbnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRfYUNvbnRlbnQuZm9yRWFjaCgoX29Db250ZW50OiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBfb0NvbnRlbnRDbG9uZSA9IF9vQ29udGVudC5jbG9uZSgpO1xuXHRcdFx0XHRcdF9vQ29udGVudENsb25lLnNldE1vZGVsKHRoaXMuZ2V0TW9kZWwoKSk7XG5cdFx0XHRcdFx0X29Db250ZW50Q2xvbmUuc2V0QmluZGluZ0NvbnRleHQodGhpcy5nZXRCaW5kaW5nQ29udGV4dCgpKTtcblx0XHRcdFx0XHRvRm9ybS5hZGRDb250ZW50KF9vQ29udGVudENsb25lKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9Gb3JtLnJlcmVuZGVyKCk7XG5cdFx0XHRcdH0sIDApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuaW50ZXJmYWNlIEN1c3RvbVF1aWNrVmlld1BhZ2Uge1xuXHQvLyBQcml2YXRlIGluIFVJNVxuXHRvQ3Jvc3NBcHBOYXZpZ2F0b3I6IGFueTtcblx0Ly8gUHJpdmF0ZSBpbiBVSTVcblx0Z2V0UGFnZUNvbnRlbnQoKTogYW55O1xufVxuZXhwb3J0IGRlZmF1bHQgQ3VzdG9tUXVpY2tWaWV3UGFnZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUU1BLG1CLFdBRExDLGNBQWMsQ0FBQywwQ0FBRCxDLFVBRWJDLFdBQVcsQ0FBQztJQUFFQyxJQUFJLEVBQUUscUJBQVI7SUFBK0JDLFFBQVEsRUFBRTtFQUF6QyxDQUFELEMsVUFFWEYsV0FBVyxDQUFDO0lBQUVDLElBQUksRUFBRSxzQkFBUjtJQUFnQ0MsUUFBUSxFQUFFLElBQTFDO0lBQWdEQyxZQUFZLEVBQUUsT0FBOUQ7SUFBdUVDLFNBQVMsRUFBRTtFQUFsRixDQUFELEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQUdaQyxpQixHQUFBLDJCQUFrQkMsTUFBbEIsRUFBK0I7TUFBQTs7TUFD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