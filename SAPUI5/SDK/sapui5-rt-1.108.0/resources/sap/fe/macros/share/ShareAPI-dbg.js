/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/ObjectPath", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/ClassSupport", "sap/m/MenuItem", "sap/suite/ui/commons/collaboration/ServiceContainer", "sap/ui/core/Core", "sap/ui/core/CustomData", "../MacroAPI"], function (ObjectPath, CommonUtils, ClassSupport, MenuItem, ServiceContainer, Core, CustomData, MacroAPI) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2;

  var xmlEventHandler = ClassSupport.xmlEventHandler;
  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Building block used to create the ‘Share’ functionality.
   * <br>
   * Please note that the 'Share in SAP Jam' option is only available on platforms that are integrated with SAP Jam.
   * <br>
   * If you are consuming this macro in an environment where the SAP Fiori launchpad is not available, then the 'Save as Tile' option is not visible.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Share
   * 	id="someID"
   *	visible="true"
   * /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.ShareAPI
   * @private
   * @since 1.108.0
   */
  var ShareAPI = (_dec = defineUI5Class("sap.fe.macros.ShareAPI", {
    interfaces: ["sap.m.IOverflowToolbarContent"]
  }), _dec2 = property({
    type: "string"
  }), _dec3 = property({
    type: "boolean",
    defaultValue: true
  }), _dec4 = xmlEventHandler(), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    _inheritsLoose(ShareAPI, _MacroAPI);

    function ShareAPI(mSettings) {
      var _this;

      for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        others[_key - 1] = arguments[_key];
      }

      _this = _MacroAPI.call.apply(_MacroAPI, [this, mSettings].concat(others)) || this;

      _initializerDefineProperty(_this, "id", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "visible", _descriptor2, _assertThisInitialized(_this));

      if (_this.content) {
        // attach to press event of internal button in menu button as menu button does not provide a press event
        // This is needed so that collaboration options can be added runtime to the share options
        // The collaboration options are fetched from an flp plugin and it is not gauranteed that is FLP plugin will always be loaded before the app loads.
        // For example, when the app is directly loaded via a URL the app is loaded first and the FLP plugin is loaded so we will not get the collaboration options at template time.
        var menuButtonId = _this.content.getId();

        var internalMenuButtonId = menuButtonId + "-internalBtn";
        _this._internalMenuButton = Core.byId(internalMenuButtonId);

        _this._internalMenuButton.attachEventOnce("press", {}, _this.onMenuButtonPressed, _assertThisInitialized(_this));
      }

      return _this;
    }
    /**
     * The identifier of the share control.
     *
     * @private
     */


    var _proto = ShareAPI.prototype;

    /**
     * Returns properties for the interface IOverflowToolbarContent.
     *
     * @returns {Object} Returns the configuration of IOverflowToolbarContent
     */
    _proto.getOverflowToolbarConfig = function getOverflowToolbarConfig() {
      return {
        canOverflow: true
      };
    };

    _proto.onMenuButtonPressed = function onMenuButtonPressed() {
      try {
        var _this3 = this;

        var menuItems = [];
        return Promise.resolve(ServiceContainer.getServiceAsync()).then(function (collaborationTeamsHelper) {
          var ShareCollaborationOptions = collaborationTeamsHelper.getOptions(); // create menu items

          ShareCollaborationOptions.forEach(function (collaborationOption) {
            var _collaborationOption$;

            var menuItemSettings = {
              text: collaborationOption.text,
              icon: collaborationOption.icon
            };

            if (collaborationOption !== null && collaborationOption !== void 0 && collaborationOption.subOptions && (collaborationOption === null || collaborationOption === void 0 ? void 0 : (_collaborationOption$ = collaborationOption.subOptions) === null || _collaborationOption$ === void 0 ? void 0 : _collaborationOption$.length) > 0) {
              menuItemSettings["items"] = [];
              collaborationOption.subOptions.forEach(function (subOption) {
                var _menuItemSettings$ite;

                var subMenuItem = new MenuItem({
                  text: subOption.text,
                  icon: subOption.icon,
                  press: _this3.menuItemPress,
                  customData: new CustomData({
                    key: "collaborationData",
                    value: subOption
                  })
                });
                (_menuItemSettings$ite = menuItemSettings["items"]) === null || _menuItemSettings$ite === void 0 ? void 0 : _menuItemSettings$ite.push(subMenuItem);
              });
            } else {
              // if there are no sub option then the main option should be clickable
              // so add a press handler.
              menuItemSettings["press"] = _this3.menuItemPress;
              menuItemSettings["customData"] = new CustomData({
                key: "collaborationData",
                value: collaborationOption
              });
            }

            var menuItem = new MenuItem(menuItemSettings);
            menuItems.push(menuItem);
          }); //insert menu items

          if (menuItems) {
            var ShareMenuButton = _this3.content;
            var ShareMenu = ShareMenuButton.getMenu();
            var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
            var defaultInsertionIndex = 0; // check where to insert the collaboration options

            if (!!fnGetUser && fnGetUser().isJamActive()) {
              // if JAM is active then teams option should be inserted after JAM (index = 2)
              defaultInsertionIndex = 2;
            } else {
              // if JAM is not active then the teams options should be inserted after Send as Email (index = 1)
              defaultInsertionIndex = 1;
            }

            menuItems.forEach(function (menuItem) {
              // as per UX the teams menu item should come after send as email
              // so we insert it at index 1 for now.
              // if there are more changes from UX needed with newer options then we can change it
              //if (menuItem.data('collaborationData')?.key === '')
              ShareMenu.insertItem(menuItem, defaultInsertionIndex);
              defaultInsertionIndex++;
            });
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.menuItemPress = function menuItemPress(event) {
      try {
        var clickedMenuItem = event.getSource();
        return Promise.resolve(ServiceContainer.getServiceAsync()).then(function (collaborationTeamsHelper) {
          var view = CommonUtils.getTargetView(clickedMenuItem);
          var controller = view.getController(); // call adapt share metadata so that the collaboration info model is updated with the required info

          return Promise.resolve(controller.share._adaptShareMetadata()).then(function () {
            var collaborationInfo = view.getModel("collaborationInfo").getData();
            collaborationTeamsHelper.share(clickedMenuItem.data("collaborationData"), collaborationInfo);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.openMenu = function openMenu() {
      var _this$_internalMenuBu;

      (_this$_internalMenuBu = this._internalMenuButton) === null || _this$_internalMenuBu === void 0 ? void 0 : _this$_internalMenuBu.firePress();
    };

    return ShareAPI;
  }(MacroAPI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "visible", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "onMenuButtonPressed", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "onMenuButtonPressed"), _class2.prototype)), _class2)) || _class);
  return ShareAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTaGFyZUFQSSIsImRlZmluZVVJNUNsYXNzIiwiaW50ZXJmYWNlcyIsInByb3BlcnR5IiwidHlwZSIsImRlZmF1bHRWYWx1ZSIsInhtbEV2ZW50SGFuZGxlciIsIm1TZXR0aW5ncyIsIm90aGVycyIsImNvbnRlbnQiLCJtZW51QnV0dG9uSWQiLCJnZXRJZCIsImludGVybmFsTWVudUJ1dHRvbklkIiwiX2ludGVybmFsTWVudUJ1dHRvbiIsIkNvcmUiLCJieUlkIiwiYXR0YWNoRXZlbnRPbmNlIiwib25NZW51QnV0dG9uUHJlc3NlZCIsImdldE92ZXJmbG93VG9vbGJhckNvbmZpZyIsImNhbk92ZXJmbG93IiwibWVudUl0ZW1zIiwiU2VydmljZUNvbnRhaW5lciIsImdldFNlcnZpY2VBc3luYyIsImNvbGxhYm9yYXRpb25UZWFtc0hlbHBlciIsIlNoYXJlQ29sbGFib3JhdGlvbk9wdGlvbnMiLCJnZXRPcHRpb25zIiwiZm9yRWFjaCIsImNvbGxhYm9yYXRpb25PcHRpb24iLCJtZW51SXRlbVNldHRpbmdzIiwidGV4dCIsImljb24iLCJzdWJPcHRpb25zIiwibGVuZ3RoIiwic3ViT3B0aW9uIiwic3ViTWVudUl0ZW0iLCJNZW51SXRlbSIsInByZXNzIiwibWVudUl0ZW1QcmVzcyIsImN1c3RvbURhdGEiLCJDdXN0b21EYXRhIiwia2V5IiwidmFsdWUiLCJwdXNoIiwibWVudUl0ZW0iLCJTaGFyZU1lbnVCdXR0b24iLCJTaGFyZU1lbnUiLCJnZXRNZW51IiwiZm5HZXRVc2VyIiwiT2JqZWN0UGF0aCIsImdldCIsImRlZmF1bHRJbnNlcnRpb25JbmRleCIsImlzSmFtQWN0aXZlIiwiaW5zZXJ0SXRlbSIsImV2ZW50IiwiY2xpY2tlZE1lbnVJdGVtIiwiZ2V0U291cmNlIiwidmlldyIsIkNvbW1vblV0aWxzIiwiZ2V0VGFyZ2V0VmlldyIsImNvbnRyb2xsZXIiLCJnZXRDb250cm9sbGVyIiwic2hhcmUiLCJfYWRhcHRTaGFyZU1ldGFkYXRhIiwiY29sbGFib3JhdGlvbkluZm8iLCJnZXRNb2RlbCIsImdldERhdGEiLCJkYXRhIiwib3Blbk1lbnUiLCJmaXJlUHJlc3MiLCJNYWNyb0FQSSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2hhcmVBUEkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9iamVjdFBhdGggZnJvbSBcInNhcC9iYXNlL3V0aWwvT2JqZWN0UGF0aFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MsIFByb3BlcnRpZXNPZiwgcHJvcGVydHksIHhtbEV2ZW50SGFuZGxlciB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHR5cGUgUGFnZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL1BhZ2VDb250cm9sbGVyXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJzYXAvbS9CdXR0b25cIjtcbmltcG9ydCBNZW51IGZyb20gXCJzYXAvbS9NZW51XCI7XG5pbXBvcnQgTWVudUJ1dHRvbiBmcm9tIFwic2FwL20vTWVudUJ1dHRvblwiO1xuaW1wb3J0IE1lbnVJdGVtLCB7ICRNZW51SXRlbVNldHRpbmdzIH0gZnJvbSBcInNhcC9tL01lbnVJdGVtXCI7XG5pbXBvcnQgU2VydmljZUNvbnRhaW5lciBmcm9tIFwic2FwL3N1aXRlL3VpL2NvbW1vbnMvY29sbGFib3JhdGlvbi9TZXJ2aWNlQ29udGFpbmVyXCI7XG5pbXBvcnQgVGVhbXNIZWxwZXJTZXJ2aWNlLCB7IENvbGxhYm9yYXRpb25PcHRpb25zIH0gZnJvbSBcInNhcC9zdWl0ZS91aS9jb21tb25zL2NvbGxhYm9yYXRpb24vVGVhbXNIZWxwZXJTZXJ2aWNlXCI7XG5pbXBvcnQgVUk1RXZlbnQgZnJvbSBcInNhcC91aS9iYXNlL0V2ZW50XCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IEN1c3RvbURhdGEgZnJvbSBcInNhcC91aS9jb3JlL0N1c3RvbURhdGFcIjtcbmltcG9ydCBWaWV3IGZyb20gXCJzYXAvdWkvY29yZS9tdmMvVmlld1wiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgTWFjcm9BUEkgZnJvbSBcIi4uL01hY3JvQVBJXCI7XG5cbi8qKlxuICogQnVpbGRpbmcgYmxvY2sgdXNlZCB0byBjcmVhdGUgdGhlIOKAmFNoYXJl4oCZIGZ1bmN0aW9uYWxpdHkuXG4gKiA8YnI+XG4gKiBQbGVhc2Ugbm90ZSB0aGF0IHRoZSAnU2hhcmUgaW4gU0FQIEphbScgb3B0aW9uIGlzIG9ubHkgYXZhaWxhYmxlIG9uIHBsYXRmb3JtcyB0aGF0IGFyZSBpbnRlZ3JhdGVkIHdpdGggU0FQIEphbS5cbiAqIDxicj5cbiAqIElmIHlvdSBhcmUgY29uc3VtaW5nIHRoaXMgbWFjcm8gaW4gYW4gZW52aXJvbm1lbnQgd2hlcmUgdGhlIFNBUCBGaW9yaSBsYXVuY2hwYWQgaXMgbm90IGF2YWlsYWJsZSwgdGhlbiB0aGUgJ1NhdmUgYXMgVGlsZScgb3B0aW9uIGlzIG5vdCB2aXNpYmxlLlxuICpcbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpTaGFyZVxuICogXHRpZD1cInNvbWVJRFwiXG4gKlx0dmlzaWJsZT1cInRydWVcIlxuICogLyZndDtcbiAqIDwvcHJlPlxuICpcbiAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLlNoYXJlQVBJXG4gKiBAcHJpdmF0ZVxuICogQHNpbmNlIDEuMTA4LjBcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5TaGFyZUFQSVwiLCB7XG5cdGludGVyZmFjZXM6IFtcInNhcC5tLklPdmVyZmxvd1Rvb2xiYXJDb250ZW50XCJdXG59KVxuY2xhc3MgU2hhcmVBUEkgZXh0ZW5kcyBNYWNyb0FQSSB7XG5cdF9pbnRlcm5hbE1lbnVCdXR0b24/OiBCdXR0b247XG5cdGNvbnN0cnVjdG9yKG1TZXR0aW5ncz86IFByb3BlcnRpZXNPZjxTaGFyZUFQST4sIC4uLm90aGVyczogYW55W10pIHtcblx0XHRzdXBlcihtU2V0dGluZ3MgYXMgYW55LCAuLi5vdGhlcnMpO1xuXG5cdFx0aWYgKHRoaXMuY29udGVudCkge1xuXHRcdFx0Ly8gYXR0YWNoIHRvIHByZXNzIGV2ZW50IG9mIGludGVybmFsIGJ1dHRvbiBpbiBtZW51IGJ1dHRvbiBhcyBtZW51IGJ1dHRvbiBkb2VzIG5vdCBwcm92aWRlIGEgcHJlc3MgZXZlbnRcblx0XHRcdC8vIFRoaXMgaXMgbmVlZGVkIHNvIHRoYXQgY29sbGFib3JhdGlvbiBvcHRpb25zIGNhbiBiZSBhZGRlZCBydW50aW1lIHRvIHRoZSBzaGFyZSBvcHRpb25zXG5cdFx0XHQvLyBUaGUgY29sbGFib3JhdGlvbiBvcHRpb25zIGFyZSBmZXRjaGVkIGZyb20gYW4gZmxwIHBsdWdpbiBhbmQgaXQgaXMgbm90IGdhdXJhbnRlZWQgdGhhdCBpcyBGTFAgcGx1Z2luIHdpbGwgYWx3YXlzIGJlIGxvYWRlZCBiZWZvcmUgdGhlIGFwcCBsb2Fkcy5cblx0XHRcdC8vIEZvciBleGFtcGxlLCB3aGVuIHRoZSBhcHAgaXMgZGlyZWN0bHkgbG9hZGVkIHZpYSBhIFVSTCB0aGUgYXBwIGlzIGxvYWRlZCBmaXJzdCBhbmQgdGhlIEZMUCBwbHVnaW4gaXMgbG9hZGVkIHNvIHdlIHdpbGwgbm90IGdldCB0aGUgY29sbGFib3JhdGlvbiBvcHRpb25zIGF0IHRlbXBsYXRlIHRpbWUuXG5cdFx0XHRjb25zdCBtZW51QnV0dG9uSWQ6IHN0cmluZyA9IHRoaXMuY29udGVudC5nZXRJZCgpO1xuXHRcdFx0Y29uc3QgaW50ZXJuYWxNZW51QnV0dG9uSWQ6IHN0cmluZyA9IG1lbnVCdXR0b25JZCArIFwiLWludGVybmFsQnRuXCI7XG5cdFx0XHR0aGlzLl9pbnRlcm5hbE1lbnVCdXR0b24gPSBDb3JlLmJ5SWQoaW50ZXJuYWxNZW51QnV0dG9uSWQpIGFzIEJ1dHRvbjtcblx0XHRcdHRoaXMuX2ludGVybmFsTWVudUJ1dHRvbi5hdHRhY2hFdmVudE9uY2UoXCJwcmVzc1wiLCB7fSwgdGhpcy5vbk1lbnVCdXR0b25QcmVzc2VkLCB0aGlzKTtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzaGFyZSBjb250cm9sLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRpZCE6IHN0cmluZztcblxuXHQvKipcblx0ICogV2hldGhlciB0aGUgc2hhcmUgbWFjcm8gaXMgdmlzaWJsZSBvciBub3QuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiB0cnVlIH0pXG5cdHZpc2libGUhOiBib29sZWFuO1xuXHQvKipcblx0ICogUmV0dXJucyBwcm9wZXJ0aWVzIGZvciB0aGUgaW50ZXJmYWNlIElPdmVyZmxvd1Rvb2xiYXJDb250ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb25maWd1cmF0aW9uIG9mIElPdmVyZmxvd1Rvb2xiYXJDb250ZW50XG5cdCAqL1xuXHRnZXRPdmVyZmxvd1Rvb2xiYXJDb25maWcoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNhbk92ZXJmbG93OiB0cnVlXG5cdFx0fTtcblx0fVxuXHRAeG1sRXZlbnRIYW5kbGVyKClcblx0YXN5bmMgb25NZW51QnV0dG9uUHJlc3NlZCgpIHtcblx0XHRjb25zdCBtZW51SXRlbXM6IEFycmF5PE1lbnVJdGVtPiA9IFtdO1xuXHRcdGNvbnN0IGNvbGxhYm9yYXRpb25UZWFtc0hlbHBlcjogVGVhbXNIZWxwZXJTZXJ2aWNlID0gYXdhaXQgU2VydmljZUNvbnRhaW5lci5nZXRTZXJ2aWNlQXN5bmMoKTtcblxuXHRcdGNvbnN0IFNoYXJlQ29sbGFib3JhdGlvbk9wdGlvbnM6IEFycmF5PENvbGxhYm9yYXRpb25PcHRpb25zPiA9IGNvbGxhYm9yYXRpb25UZWFtc0hlbHBlci5nZXRPcHRpb25zKCk7XG5cdFx0Ly8gY3JlYXRlIG1lbnUgaXRlbXNcblx0XHRTaGFyZUNvbGxhYm9yYXRpb25PcHRpb25zLmZvckVhY2goKGNvbGxhYm9yYXRpb25PcHRpb246IENvbGxhYm9yYXRpb25PcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBtZW51SXRlbVNldHRpbmdzOiAkTWVudUl0ZW1TZXR0aW5ncyA9IHtcblx0XHRcdFx0dGV4dDogY29sbGFib3JhdGlvbk9wdGlvbi50ZXh0LFxuXHRcdFx0XHRpY29uOiBjb2xsYWJvcmF0aW9uT3B0aW9uLmljb25cblx0XHRcdH07XG5cblx0XHRcdGlmIChjb2xsYWJvcmF0aW9uT3B0aW9uPy5zdWJPcHRpb25zICYmIGNvbGxhYm9yYXRpb25PcHRpb24/LnN1Yk9wdGlvbnM/Lmxlbmd0aCA+IDApIHtcblx0XHRcdFx0bWVudUl0ZW1TZXR0aW5nc1tcIml0ZW1zXCJdID0gW107XG5cdFx0XHRcdGNvbGxhYm9yYXRpb25PcHRpb24uc3ViT3B0aW9ucy5mb3JFYWNoKChzdWJPcHRpb246IENvbGxhYm9yYXRpb25PcHRpb25zKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgc3ViTWVudUl0ZW0gPSBuZXcgTWVudUl0ZW0oe1xuXHRcdFx0XHRcdFx0dGV4dDogc3ViT3B0aW9uLnRleHQsXG5cdFx0XHRcdFx0XHRpY29uOiBzdWJPcHRpb24uaWNvbixcblx0XHRcdFx0XHRcdHByZXNzOiB0aGlzLm1lbnVJdGVtUHJlc3MsXG5cdFx0XHRcdFx0XHRjdXN0b21EYXRhOiBuZXcgQ3VzdG9tRGF0YSh7XG5cdFx0XHRcdFx0XHRcdGtleTogXCJjb2xsYWJvcmF0aW9uRGF0YVwiLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogc3ViT3B0aW9uXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdChtZW51SXRlbVNldHRpbmdzW1wiaXRlbXNcIl0gYXMgQXJyYXk8TWVudUl0ZW0+KT8ucHVzaChzdWJNZW51SXRlbSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIHN1YiBvcHRpb24gdGhlbiB0aGUgbWFpbiBvcHRpb24gc2hvdWxkIGJlIGNsaWNrYWJsZVxuXHRcdFx0XHQvLyBzbyBhZGQgYSBwcmVzcyBoYW5kbGVyLlxuXHRcdFx0XHRtZW51SXRlbVNldHRpbmdzW1wicHJlc3NcIl0gPSB0aGlzLm1lbnVJdGVtUHJlc3M7XG5cdFx0XHRcdG1lbnVJdGVtU2V0dGluZ3NbXCJjdXN0b21EYXRhXCJdID0gbmV3IEN1c3RvbURhdGEoe1xuXHRcdFx0XHRcdGtleTogXCJjb2xsYWJvcmF0aW9uRGF0YVwiLFxuXHRcdFx0XHRcdHZhbHVlOiBjb2xsYWJvcmF0aW9uT3B0aW9uXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgbWVudUl0ZW0gPSBuZXcgTWVudUl0ZW0obWVudUl0ZW1TZXR0aW5ncyk7XG5cdFx0XHRtZW51SXRlbXMucHVzaChtZW51SXRlbSk7XG5cdFx0fSk7XG5cblx0XHQvL2luc2VydCBtZW51IGl0ZW1zXG5cdFx0aWYgKG1lbnVJdGVtcykge1xuXHRcdFx0Y29uc3QgU2hhcmVNZW51QnV0dG9uID0gdGhpcy5jb250ZW50IGFzIE1lbnVCdXR0b247XG5cdFx0XHRjb25zdCBTaGFyZU1lbnU6IE1lbnUgPSBTaGFyZU1lbnVCdXR0b24uZ2V0TWVudSgpO1xuXG5cdFx0XHRjb25zdCBmbkdldFVzZXIgPSBPYmplY3RQYXRoLmdldChcInNhcC51c2hlbGwuQ29udGFpbmVyLmdldFVzZXJcIik7XG5cdFx0XHRsZXQgZGVmYXVsdEluc2VydGlvbkluZGV4ID0gMDtcblx0XHRcdC8vIGNoZWNrIHdoZXJlIHRvIGluc2VydCB0aGUgY29sbGFib3JhdGlvbiBvcHRpb25zXG5cdFx0XHRpZiAoISFmbkdldFVzZXIgJiYgZm5HZXRVc2VyKCkuaXNKYW1BY3RpdmUoKSkge1xuXHRcdFx0XHQvLyBpZiBKQU0gaXMgYWN0aXZlIHRoZW4gdGVhbXMgb3B0aW9uIHNob3VsZCBiZSBpbnNlcnRlZCBhZnRlciBKQU0gKGluZGV4ID0gMilcblx0XHRcdFx0ZGVmYXVsdEluc2VydGlvbkluZGV4ID0gMjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGlmIEpBTSBpcyBub3QgYWN0aXZlIHRoZW4gdGhlIHRlYW1zIG9wdGlvbnMgc2hvdWxkIGJlIGluc2VydGVkIGFmdGVyIFNlbmQgYXMgRW1haWwgKGluZGV4ID0gMSlcblx0XHRcdFx0ZGVmYXVsdEluc2VydGlvbkluZGV4ID0gMTtcblx0XHRcdH1cblx0XHRcdG1lbnVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChtZW51SXRlbSkge1xuXHRcdFx0XHQvLyBhcyBwZXIgVVggdGhlIHRlYW1zIG1lbnUgaXRlbSBzaG91bGQgY29tZSBhZnRlciBzZW5kIGFzIGVtYWlsXG5cdFx0XHRcdC8vIHNvIHdlIGluc2VydCBpdCBhdCBpbmRleCAxIGZvciBub3cuXG5cdFx0XHRcdC8vIGlmIHRoZXJlIGFyZSBtb3JlIGNoYW5nZXMgZnJvbSBVWCBuZWVkZWQgd2l0aCBuZXdlciBvcHRpb25zIHRoZW4gd2UgY2FuIGNoYW5nZSBpdFxuXHRcdFx0XHQvL2lmIChtZW51SXRlbS5kYXRhKCdjb2xsYWJvcmF0aW9uRGF0YScpPy5rZXkgPT09ICcnKVxuXHRcdFx0XHRTaGFyZU1lbnUuaW5zZXJ0SXRlbShtZW51SXRlbSwgZGVmYXVsdEluc2VydGlvbkluZGV4KTtcblx0XHRcdFx0ZGVmYXVsdEluc2VydGlvbkluZGV4Kys7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBtZW51SXRlbVByZXNzKGV2ZW50OiBVSTVFdmVudCkge1xuXHRcdGNvbnN0IGNsaWNrZWRNZW51SXRlbSA9IGV2ZW50LmdldFNvdXJjZSgpIGFzIE1lbnVJdGVtO1xuXHRcdGNvbnN0IGNvbGxhYm9yYXRpb25UZWFtc0hlbHBlcjogVGVhbXNIZWxwZXJTZXJ2aWNlID0gYXdhaXQgU2VydmljZUNvbnRhaW5lci5nZXRTZXJ2aWNlQXN5bmMoKTtcblx0XHRjb25zdCB2aWV3OiBWaWV3ID0gQ29tbW9uVXRpbHMuZ2V0VGFyZ2V0VmlldyhjbGlja2VkTWVudUl0ZW0pO1xuXHRcdGNvbnN0IGNvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyID0gdmlldy5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXI7XG5cdFx0Ly8gY2FsbCBhZGFwdCBzaGFyZSBtZXRhZGF0YSBzbyB0aGF0IHRoZSBjb2xsYWJvcmF0aW9uIGluZm8gbW9kZWwgaXMgdXBkYXRlZCB3aXRoIHRoZSByZXF1aXJlZCBpbmZvXG5cdFx0YXdhaXQgY29udHJvbGxlci5zaGFyZS5fYWRhcHRTaGFyZU1ldGFkYXRhKCk7XG5cdFx0Y29uc3QgY29sbGFib3JhdGlvbkluZm8gPSAodmlldy5nZXRNb2RlbChcImNvbGxhYm9yYXRpb25JbmZvXCIpIGFzIEpTT05Nb2RlbCkuZ2V0RGF0YSgpO1xuXHRcdGNvbGxhYm9yYXRpb25UZWFtc0hlbHBlci5zaGFyZShjbGlja2VkTWVudUl0ZW0uZGF0YShcImNvbGxhYm9yYXRpb25EYXRhXCIpLCBjb2xsYWJvcmF0aW9uSW5mbyk7XG5cdH1cblxuXHRvcGVuTWVudSgpIHtcblx0XHR0aGlzLl9pbnRlcm5hbE1lbnVCdXR0b24/LmZpcmVQcmVzcygpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlQVBJO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFJTUEsUSxXQUhMQyxjQUFjLENBQUMsd0JBQUQsRUFBMkI7SUFDekNDLFVBQVUsRUFBRSxDQUFDLCtCQUFEO0VBRDZCLENBQTNCLEMsVUF3QmJDLFFBQVEsQ0FBQztJQUFFQyxJQUFJLEVBQUU7RUFBUixDQUFELEMsVUFRUkQsUUFBUSxDQUFDO0lBQUVDLElBQUksRUFBRSxTQUFSO0lBQW1CQyxZQUFZLEVBQUU7RUFBakMsQ0FBRCxDLFVBWVJDLGVBQWUsRTs7O0lBdkNoQixrQkFBWUMsU0FBWixFQUFrRTtNQUFBOztNQUFBLGtDQUFmQyxNQUFlO1FBQWZBLE1BQWU7TUFBQTs7TUFDakUsK0NBQU1ELFNBQU4sU0FBMkJDLE1BQTNCOztNQURpRTs7TUFBQTs7TUFHakUsSUFBSSxNQUFLQyxPQUFULEVBQWtCO1FBQ2pCO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBTUMsWUFBb0IsR0FBRyxNQUFLRCxPQUFMLENBQWFFLEtBQWIsRUFBN0I7O1FBQ0EsSUFBTUMsb0JBQTRCLEdBQUdGLFlBQVksR0FBRyxjQUFwRDtRQUNBLE1BQUtHLG1CQUFMLEdBQTJCQyxJQUFJLENBQUNDLElBQUwsQ0FBVUgsb0JBQVYsQ0FBM0I7O1FBQ0EsTUFBS0MsbUJBQUwsQ0FBeUJHLGVBQXpCLENBQXlDLE9BQXpDLEVBQWtELEVBQWxELEVBQXNELE1BQUtDLG1CQUEzRDtNQUNBOztNQVpnRTtJQWFqRTtJQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7Ozs7O0lBV0M7QUFDRDtBQUNBO0FBQ0E7QUFDQTtXQUNDQyx3QixHQUFBLG9DQUEyQjtNQUMxQixPQUFPO1FBQ05DLFdBQVcsRUFBRTtNQURQLENBQVA7SUFHQSxDOztXQUVLRixtQjtVQUFzQjtRQUFBLGFBa0JoQixJQWxCZ0I7O1FBQzNCLElBQU1HLFNBQTBCLEdBQUcsRUFBbkM7UUFEMkIsdUJBRWdDQyxnQkFBZ0IsQ0FBQ0MsZUFBakIsRUFGaEMsaUJBRXJCQyx3QkFGcUI7VUFJM0IsSUFBTUMseUJBQXNELEdBQUdELHdCQUF3QixDQUFDRSxVQUF6QixFQUEvRCxDQUoyQixDQUszQjs7VUFDQUQseUJBQXlCLENBQUNFLE9BQTFCLENBQWtDLFVBQUNDLG1CQUFELEVBQStDO1lBQUE7O1lBQ2hGLElBQU1DLGdCQUFtQyxHQUFHO2NBQzNDQyxJQUFJLEVBQUVGLG1CQUFtQixDQUFDRSxJQURpQjtjQUUzQ0MsSUFBSSxFQUFFSCxtQkFBbUIsQ0FBQ0c7WUFGaUIsQ0FBNUM7O1lBS0EsSUFBSUgsbUJBQW1CLFNBQW5CLElBQUFBLG1CQUFtQixXQUFuQixJQUFBQSxtQkFBbUIsQ0FBRUksVUFBckIsSUFBbUMsQ0FBQUosbUJBQW1CLFNBQW5CLElBQUFBLG1CQUFtQixXQUFuQixxQ0FBQUEsbUJBQW1CLENBQUVJLFVBQXJCLGdGQUFpQ0MsTUFBakMsSUFBMEMsQ0FBakYsRUFBb0Y7Y0FDbkZKLGdCQUFnQixDQUFDLE9BQUQsQ0FBaEIsR0FBNEIsRUFBNUI7Y0FDQUQsbUJBQW1CLENBQUNJLFVBQXBCLENBQStCTCxPQUEvQixDQUF1QyxVQUFDTyxTQUFELEVBQXFDO2dCQUFBOztnQkFDM0UsSUFBTUMsV0FBVyxHQUFHLElBQUlDLFFBQUosQ0FBYTtrQkFDaENOLElBQUksRUFBRUksU0FBUyxDQUFDSixJQURnQjtrQkFFaENDLElBQUksRUFBRUcsU0FBUyxDQUFDSCxJQUZnQjtrQkFHaENNLEtBQUssRUFBRSxPQUFLQyxhQUhvQjtrQkFJaENDLFVBQVUsRUFBRSxJQUFJQyxVQUFKLENBQWU7b0JBQzFCQyxHQUFHLEVBQUUsbUJBRHFCO29CQUUxQkMsS0FBSyxFQUFFUjtrQkFGbUIsQ0FBZjtnQkFKb0IsQ0FBYixDQUFwQjtnQkFTQSx5QkFBQ0wsZ0JBQWdCLENBQUMsT0FBRCxDQUFqQixnRkFBZ0RjLElBQWhELENBQXFEUixXQUFyRDtjQUNBLENBWEQ7WUFZQSxDQWRELE1BY087Y0FDTjtjQUNBO2NBQ0FOLGdCQUFnQixDQUFDLE9BQUQsQ0FBaEIsR0FBNEIsT0FBS1MsYUFBakM7Y0FDQVQsZ0JBQWdCLENBQUMsWUFBRCxDQUFoQixHQUFpQyxJQUFJVyxVQUFKLENBQWU7Z0JBQy9DQyxHQUFHLEVBQUUsbUJBRDBDO2dCQUUvQ0MsS0FBSyxFQUFFZDtjQUZ3QyxDQUFmLENBQWpDO1lBSUE7O1lBQ0QsSUFBTWdCLFFBQVEsR0FBRyxJQUFJUixRQUFKLENBQWFQLGdCQUFiLENBQWpCO1lBQ0FSLFNBQVMsQ0FBQ3NCLElBQVYsQ0FBZUMsUUFBZjtVQUNBLENBL0JELEVBTjJCLENBdUMzQjs7VUF2QzJCLElBd0N2QnZCLFNBeEN1QjtZQXlDMUIsSUFBTXdCLGVBQWUsR0FBRyxPQUFLbkMsT0FBN0I7WUFDQSxJQUFNb0MsU0FBZSxHQUFHRCxlQUFlLENBQUNFLE9BQWhCLEVBQXhCO1lBRUEsSUFBTUMsU0FBUyxHQUFHQyxVQUFVLENBQUNDLEdBQVgsQ0FBZSw4QkFBZixDQUFsQjtZQUNBLElBQUlDLHFCQUFxQixHQUFHLENBQTVCLENBN0MwQixDQThDMUI7O1lBQ0EsSUFBSSxDQUFDLENBQUNILFNBQUYsSUFBZUEsU0FBUyxHQUFHSSxXQUFaLEVBQW5CLEVBQThDO2NBQzdDO2NBQ0FELHFCQUFxQixHQUFHLENBQXhCO1lBQ0EsQ0FIRCxNQUdPO2NBQ047Y0FDQUEscUJBQXFCLEdBQUcsQ0FBeEI7WUFDQTs7WUFDRDlCLFNBQVMsQ0FBQ00sT0FBVixDQUFrQixVQUFVaUIsUUFBVixFQUFvQjtjQUNyQztjQUNBO2NBQ0E7Y0FDQTtjQUNBRSxTQUFTLENBQUNPLFVBQVYsQ0FBcUJULFFBQXJCLEVBQStCTyxxQkFBL0I7Y0FDQUEscUJBQXFCO1lBQ3JCLENBUEQ7VUF0RDBCO1FBQUE7TUErRDNCLEM7Ozs7O1dBRUtiLGEsMEJBQWNnQixLO1VBQWlCO1FBQ3BDLElBQU1DLGVBQWUsR0FBR0QsS0FBSyxDQUFDRSxTQUFOLEVBQXhCO1FBRG9DLHVCQUV1QmxDLGdCQUFnQixDQUFDQyxlQUFqQixFQUZ2QixpQkFFOUJDLHdCQUY4QjtVQUdwQyxJQUFNaUMsSUFBVSxHQUFHQyxXQUFXLENBQUNDLGFBQVosQ0FBMEJKLGVBQTFCLENBQW5CO1VBQ0EsSUFBTUssVUFBMEIsR0FBR0gsSUFBSSxDQUFDSSxhQUFMLEVBQW5DLENBSm9DLENBS3BDOztVQUxvQyx1QkFNOUJELFVBQVUsQ0FBQ0UsS0FBWCxDQUFpQkMsbUJBQWpCLEVBTjhCO1lBT3BDLElBQU1DLGlCQUFpQixHQUFJUCxJQUFJLENBQUNRLFFBQUwsQ0FBYyxtQkFBZCxDQUFELENBQWtEQyxPQUFsRCxFQUExQjtZQUNBMUMsd0JBQXdCLENBQUNzQyxLQUF6QixDQUErQlAsZUFBZSxDQUFDWSxJQUFoQixDQUFxQixtQkFBckIsQ0FBL0IsRUFBMEVILGlCQUExRTtVQVJvQztRQUFBO01BU3BDLEM7Ozs7O1dBRURJLFEsR0FBQSxvQkFBVztNQUFBOztNQUNWLDhCQUFLdEQsbUJBQUwsZ0ZBQTBCdUQsU0FBMUI7SUFDQSxDOzs7SUF4SHFCQyxROzs7Ozs7Ozs7OztTQTJIUnJFLFEifQ==