/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/ObjectPath", "sap/fe/core/buildingBlocks/BuildingBlock", "sap/fe/core/buildingBlocks/BuildingBlockRuntime", "sap/ui/core/Core", "sap/ushell/ui/footerbar/AddBookmarkButton"], function (ObjectPath, BuildingBlock, BuildingBlockRuntime, Core, AddBookmarkButton) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

  var _exports = {};
  var xml = BuildingBlockRuntime.xml;
  var xmlAttribute = BuildingBlock.xmlAttribute;
  var defineBuildingBlock = BuildingBlock.defineBuildingBlock;
  var BuildingBlockBase = BuildingBlock.BuildingBlockBase;

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var ShareBuildingBlock = (
  /**
   * @classdesc
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
   * @class sap.fe.macros.Share
   * @hideconstructor
   * @public
   * @since 1.93.0
   */
  _dec = defineBuildingBlock({
    name: "Share",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros"
  }), _dec2 = xmlAttribute({
    type: "string",
    required: true,
    isPublic: true
  }), _dec3 = xmlAttribute({
    type: "boolean",
    defaultValue: true,
    isPublic: true
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockBase) {
    _inheritsLoose(ShareBuildingBlock, _BuildingBlockBase);

    function ShareBuildingBlock(oProps, configuration, mSettings) {
      var _this;

      _this = _BuildingBlockBase.call(this, oProps, configuration, mSettings) || this;

      _initializerDefineProperty(_this, "id", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "visible", _descriptor2, _assertThisInitialized(_this));

      _this._appComponent = mSettings.appComponent; // get share options

      _this._defaultShareOptions = _this._getDefaultShareOptions();
      return _this;
    }

    _exports = ShareBuildingBlock;
    var _proto = ShareBuildingBlock.prototype;

    _proto._createMenuButton = function _createMenuButton() {
      // Ctrl+Shift+S is needed for the time being but this needs to be removed after backlog from menu button
      return xml(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\t\t\t<MenuButton \n\t\t\t\txmlns=\"sap.m\"\n\t\t\t\ticon=\"sap-icon://action\"\n\t\t\t\tvisible=\"", "\"\n\t\t\t\ttooltip=\"{sap.fe.i18n>M_COMMON_SAPFE_ACTION_SHARE} (Ctrl+Shift+S)\"\n\t\t\t>\n\t\t\t\t<menu>\n\t\t\t\t\t", "\n\t\t\t\t</menu>\n\t\t\t</MenuButton>\n\t\t"])), this.visible, this._createMenu());
    };

    _proto._createMenu = function _createMenu() {
      return xml(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\t\t\t<Menu>\n\t\t\t\t", "\n\t\t\t</Menu>\t\t\n\t\t"])), this._createMenuItems());
    };

    _proto._createMenuItems = function _createMenuItems() {
      var _this2 = this;

      var menuItems = "";

      this._defaultShareOptions.forEach(function (shareOption) {
        menuItems += _this2._createMenuItem(shareOption);
      });

      return menuItems;
    };

    _proto._createMenuItem = function _createMenuItem(shareOption) {
      return xml(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n\t\t\t<MenuItem text=\"", "\" icon=\"", "\" press=\"", "\">\n\t\t\t\t", "\n\t\t\t</MenuItem>\n\t\t"])), shareOption.text, shareOption.icon, shareOption.press, this._addMenuItemDependents(shareOption.type));
    };

    _proto._addMenuItemDependents = function _addMenuItemDependents(itemType) {
      if (itemType === "saveAsTile") {
        return xml(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n\t\t\t\t<dependents>\n\t\t\t\t\t<footerbar:AddBookmarkButton \n\t\t\t\t\t\txmlns:footerbar=\"sap.ushell.ui.footerbar\"\n\t\t\t\t\t\tvisible=\"false\"\n\t\t\t\t\t/>\n\t\t\t\t</dependents>\n\t\t\t"])));
      } else {
        return xml(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral([""])));
      }
    };

    _proto._getDefaultShareOptions = function _getDefaultShareOptions() {
      var appComponent = this._appComponent; // logic to get default share options

      var coreResource = Core.getLibraryResourceBundle("sap.fe.core"); // set email

      var shareOptions = [{
        type: "email",
        text: coreResource.getText("T_SEMANTIC_CONTROL_SEND_EMAIL"),
        icon: "sap-icon://email",
        press: ".share._triggerEmail()"
      }];
      var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser"); // set share to jam

      if (!!fnGetUser && fnGetUser().isJamActive()) {
        shareOptions.push({
          type: "jam",
          text: coreResource.getText("T_COMMON_SAPFE_SHARE_JAM"),
          icon: "sap-icon://share-2",
          press: ".share._triggerShareToJam()"
        });
      } // set save as tile
      // for now we need to create addBookmarkButton to use the save as tile feature.
      // In the future save as tile should be available as a API or a MenuItem so that it can be added to the Menu button.
      // This needs to be discussed with AddBookmarkButton team.


      var addBookmarkButton = new AddBookmarkButton();
      var oShellServices = appComponent.getShellServices();

      if (oShellServices.hasUShell() && addBookmarkButton.getEnabled()) {
        shareOptions.push({
          type: "saveAsTile",
          text: addBookmarkButton.getText(),
          icon: addBookmarkButton.getIcon(),
          press: ".share._saveAsTile(${$source>})"
        });
      }

      addBookmarkButton.destroy();
      return shareOptions;
    };

    _proto.getTemplate = function getTemplate() {
      return xml(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n\t\t\t<macro:ShareAPI\n\t\t\t\txmlns:macro=\"sap.fe.macros.share\"\n\t\t\t\tid=\"", "\"\n\t\t\t>\n\t\t\t\t ", "\n\t\t\t</macro:ShareAPI>\n\t\t"])), this.id, this._createMenuButton());
    };

    return ShareBuildingBlock;
  }(BuildingBlockBase), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "visible", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  _exports = ShareBuildingBlock;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTaGFyZUJ1aWxkaW5nQmxvY2siLCJkZWZpbmVCdWlsZGluZ0Jsb2NrIiwibmFtZSIsIm5hbWVzcGFjZSIsInB1YmxpY05hbWVzcGFjZSIsInhtbEF0dHJpYnV0ZSIsInR5cGUiLCJyZXF1aXJlZCIsImlzUHVibGljIiwiZGVmYXVsdFZhbHVlIiwib1Byb3BzIiwiY29uZmlndXJhdGlvbiIsIm1TZXR0aW5ncyIsIl9hcHBDb21wb25lbnQiLCJhcHBDb21wb25lbnQiLCJfZGVmYXVsdFNoYXJlT3B0aW9ucyIsIl9nZXREZWZhdWx0U2hhcmVPcHRpb25zIiwiX2NyZWF0ZU1lbnVCdXR0b24iLCJ4bWwiLCJ2aXNpYmxlIiwiX2NyZWF0ZU1lbnUiLCJfY3JlYXRlTWVudUl0ZW1zIiwibWVudUl0ZW1zIiwiZm9yRWFjaCIsInNoYXJlT3B0aW9uIiwiX2NyZWF0ZU1lbnVJdGVtIiwidGV4dCIsImljb24iLCJwcmVzcyIsIl9hZGRNZW51SXRlbURlcGVuZGVudHMiLCJpdGVtVHlwZSIsImNvcmVSZXNvdXJjZSIsIkNvcmUiLCJnZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUiLCJzaGFyZU9wdGlvbnMiLCJnZXRUZXh0IiwiZm5HZXRVc2VyIiwiT2JqZWN0UGF0aCIsImdldCIsImlzSmFtQWN0aXZlIiwicHVzaCIsImFkZEJvb2ttYXJrQnV0dG9uIiwiQWRkQm9va21hcmtCdXR0b24iLCJvU2hlbGxTZXJ2aWNlcyIsImdldFNoZWxsU2VydmljZXMiLCJoYXNVU2hlbGwiLCJnZXRFbmFibGVkIiwiZ2V0SWNvbiIsImRlc3Ryb3kiLCJnZXRUZW1wbGF0ZSIsImlkIiwiQnVpbGRpbmdCbG9ja0Jhc2UiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlNoYXJlLm1ldGFkYXRhLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPYmplY3RQYXRoIGZyb20gXCJzYXAvYmFzZS91dGlsL09iamVjdFBhdGhcIjtcbmltcG9ydCBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IHsgQnVpbGRpbmdCbG9ja0Jhc2UsIGRlZmluZUJ1aWxkaW5nQmxvY2ssIHhtbEF0dHJpYnV0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9idWlsZGluZ0Jsb2Nrcy9CdWlsZGluZ0Jsb2NrXCI7XG5pbXBvcnQgeyB4bWwgfSBmcm9tIFwic2FwL2ZlL2NvcmUvYnVpbGRpbmdCbG9ja3MvQnVpbGRpbmdCbG9ja1J1bnRpbWVcIjtcbmltcG9ydCB0eXBlIHsgUHJvcGVydGllc09mIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IEFkZEJvb2ttYXJrQnV0dG9uIGZyb20gXCJzYXAvdXNoZWxsL3VpL2Zvb3RlcmJhci9BZGRCb29rbWFya0J1dHRvblwiO1xuXG50eXBlIFNoYXJlT3B0aW9uVHlwZSA9IHtcblx0dHlwZTogc3RyaW5nO1xuXHRpY29uOiBzdHJpbmc7XG5cdHRleHQ6IHN0cmluZztcblx0cHJlc3M/OiBzdHJpbmc7XG5cdHN1Yk9wdGlvbnM/OiBBcnJheTxvYmplY3Q+O1xufTtcbi8qKlxuICogQGNsYXNzZGVzY1xuICogQnVpbGRpbmcgYmxvY2sgdXNlZCB0byBjcmVhdGUgdGhlIOKAmFNoYXJl4oCZIGZ1bmN0aW9uYWxpdHkuXG4gKiA8YnI+XG4gKiBQbGVhc2Ugbm90ZSB0aGF0IHRoZSAnU2hhcmUgaW4gU0FQIEphbScgb3B0aW9uIGlzIG9ubHkgYXZhaWxhYmxlIG9uIHBsYXRmb3JtcyB0aGF0IGFyZSBpbnRlZ3JhdGVkIHdpdGggU0FQIEphbS5cbiAqIDxicj5cbiAqIElmIHlvdSBhcmUgY29uc3VtaW5nIHRoaXMgbWFjcm8gaW4gYW4gZW52aXJvbm1lbnQgd2hlcmUgdGhlIFNBUCBGaW9yaSBsYXVuY2hwYWQgaXMgbm90IGF2YWlsYWJsZSwgdGhlbiB0aGUgJ1NhdmUgYXMgVGlsZScgb3B0aW9uIGlzIG5vdCB2aXNpYmxlLlxuICpcbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpTaGFyZVxuICogXHRpZD1cInNvbWVJRFwiXG4gKlx0dmlzaWJsZT1cInRydWVcIlxuICogLyZndDtcbiAqIDwvcHJlPlxuICogQGNsYXNzIHNhcC5mZS5tYWNyb3MuU2hhcmVcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzaW5jZSAxLjkzLjBcbiAqL1xuQGRlZmluZUJ1aWxkaW5nQmxvY2soe1xuXHRuYW1lOiBcIlNoYXJlXCIsXG5cdG5hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zLmludGVybmFsXCIsXG5cdHB1YmxpY05hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zXCJcbn0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFyZUJ1aWxkaW5nQmxvY2sgZXh0ZW5kcyBCdWlsZGluZ0Jsb2NrQmFzZSB7XG5cdEB4bWxBdHRyaWJ1dGUoe1xuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0aXNQdWJsaWM6IHRydWVcblx0fSlcblx0aWQhOiBzdHJpbmc7XG5cblx0QHhtbEF0dHJpYnV0ZSh7XG5cdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiB0cnVlLFxuXHRcdGlzUHVibGljOiB0cnVlXG5cdH0pXG5cdHZpc2libGUhOiBzdHJpbmc7XG5cdF9hcHBDb21wb25lbnQhOiBBcHBDb21wb25lbnQ7XG5cdF9kZWZhdWx0U2hhcmVPcHRpb25zITogQXJyYXk8U2hhcmVPcHRpb25UeXBlPjtcblx0Y29uc3RydWN0b3Iob1Byb3BzOiBQcm9wZXJ0aWVzT2Y8U2hhcmVCdWlsZGluZ0Jsb2NrPiwgY29uZmlndXJhdGlvbjogYW55LCBtU2V0dGluZ3M6IGFueSkge1xuXHRcdHN1cGVyKG9Qcm9wcywgY29uZmlndXJhdGlvbiwgbVNldHRpbmdzKTtcblx0XHR0aGlzLl9hcHBDb21wb25lbnQgPSBtU2V0dGluZ3MuYXBwQ29tcG9uZW50O1xuXG5cdFx0Ly8gZ2V0IHNoYXJlIG9wdGlvbnNcblx0XHR0aGlzLl9kZWZhdWx0U2hhcmVPcHRpb25zID0gdGhpcy5fZ2V0RGVmYXVsdFNoYXJlT3B0aW9ucygpO1xuXHR9XG5cdF9jcmVhdGVNZW51QnV0dG9uKCkge1xuXHRcdC8vIEN0cmwrU2hpZnQrUyBpcyBuZWVkZWQgZm9yIHRoZSB0aW1lIGJlaW5nIGJ1dCB0aGlzIG5lZWRzIHRvIGJlIHJlbW92ZWQgYWZ0ZXIgYmFja2xvZyBmcm9tIG1lbnUgYnV0dG9uXG5cdFx0cmV0dXJuIHhtbGBcblx0XHRcdDxNZW51QnV0dG9uIFxuXHRcdFx0XHR4bWxucz1cInNhcC5tXCJcblx0XHRcdFx0aWNvbj1cInNhcC1pY29uOi8vYWN0aW9uXCJcblx0XHRcdFx0dmlzaWJsZT1cIiR7dGhpcy52aXNpYmxlfVwiXG5cdFx0XHRcdHRvb2x0aXA9XCJ7c2FwLmZlLmkxOG4+TV9DT01NT05fU0FQRkVfQUNUSU9OX1NIQVJFfSAoQ3RybCtTaGlmdCtTKVwiXG5cdFx0XHQ+XG5cdFx0XHRcdDxtZW51PlxuXHRcdFx0XHRcdCR7dGhpcy5fY3JlYXRlTWVudSgpfVxuXHRcdFx0XHQ8L21lbnU+XG5cdFx0XHQ8L01lbnVCdXR0b24+XG5cdFx0YDtcblx0fVxuXG5cdF9jcmVhdGVNZW51KCkge1xuXHRcdHJldHVybiB4bWxgXG5cdFx0XHQ8TWVudT5cblx0XHRcdFx0JHt0aGlzLl9jcmVhdGVNZW51SXRlbXMoKX1cblx0XHRcdDwvTWVudT5cdFx0XG5cdFx0YDtcblx0fVxuXG5cdF9jcmVhdGVNZW51SXRlbXMoKSB7XG5cdFx0bGV0IG1lbnVJdGVtcyA9IFwiXCI7XG5cdFx0dGhpcy5fZGVmYXVsdFNoYXJlT3B0aW9ucy5mb3JFYWNoKChzaGFyZU9wdGlvbjogU2hhcmVPcHRpb25UeXBlKSA9PiB7XG5cdFx0XHRtZW51SXRlbXMgKz0gdGhpcy5fY3JlYXRlTWVudUl0ZW0oc2hhcmVPcHRpb24pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBtZW51SXRlbXM7XG5cdH1cblxuXHRfY3JlYXRlTWVudUl0ZW0oc2hhcmVPcHRpb246IFNoYXJlT3B0aW9uVHlwZSkge1xuXHRcdHJldHVybiB4bWxgXG5cdFx0XHQ8TWVudUl0ZW0gdGV4dD1cIiR7c2hhcmVPcHRpb24udGV4dH1cIiBpY29uPVwiJHtzaGFyZU9wdGlvbi5pY29ufVwiIHByZXNzPVwiJHtzaGFyZU9wdGlvbi5wcmVzc31cIj5cblx0XHRcdFx0JHt0aGlzLl9hZGRNZW51SXRlbURlcGVuZGVudHMoc2hhcmVPcHRpb24udHlwZSl9XG5cdFx0XHQ8L01lbnVJdGVtPlxuXHRcdGA7XG5cdH1cblxuXHRfYWRkTWVudUl0ZW1EZXBlbmRlbnRzKGl0ZW1UeXBlOiBzdHJpbmcpIHtcblx0XHRpZiAoaXRlbVR5cGUgPT09IFwic2F2ZUFzVGlsZVwiKSB7XG5cdFx0XHRyZXR1cm4geG1sYFxuXHRcdFx0XHQ8ZGVwZW5kZW50cz5cblx0XHRcdFx0XHQ8Zm9vdGVyYmFyOkFkZEJvb2ttYXJrQnV0dG9uIFxuXHRcdFx0XHRcdFx0eG1sbnM6Zm9vdGVyYmFyPVwic2FwLnVzaGVsbC51aS5mb290ZXJiYXJcIlxuXHRcdFx0XHRcdFx0dmlzaWJsZT1cImZhbHNlXCJcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2RlcGVuZGVudHM+XG5cdFx0XHRgO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4geG1sYGA7XG5cdFx0fVxuXHR9XG5cdF9nZXREZWZhdWx0U2hhcmVPcHRpb25zKCk6IEFycmF5PFNoYXJlT3B0aW9uVHlwZT4ge1xuXHRcdGNvbnN0IGFwcENvbXBvbmVudDogQXBwQ29tcG9uZW50ID0gdGhpcy5fYXBwQ29tcG9uZW50O1xuXHRcdC8vIGxvZ2ljIHRvIGdldCBkZWZhdWx0IHNoYXJlIG9wdGlvbnNcblx0XHRjb25zdCBjb3JlUmVzb3VyY2UgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRcdC8vIHNldCBlbWFpbFxuXHRcdGNvbnN0IHNoYXJlT3B0aW9uczogQXJyYXk8U2hhcmVPcHRpb25UeXBlPiA9IFtcblx0XHRcdHtcblx0XHRcdFx0dHlwZTogXCJlbWFpbFwiLFxuXHRcdFx0XHR0ZXh0OiBjb3JlUmVzb3VyY2UuZ2V0VGV4dChcIlRfU0VNQU5USUNfQ09OVFJPTF9TRU5EX0VNQUlMXCIpLFxuXHRcdFx0XHRpY29uOiBcInNhcC1pY29uOi8vZW1haWxcIixcblx0XHRcdFx0cHJlc3M6IFwiLnNoYXJlLl90cmlnZ2VyRW1haWwoKVwiXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdGNvbnN0IGZuR2V0VXNlciA9IE9iamVjdFBhdGguZ2V0KFwic2FwLnVzaGVsbC5Db250YWluZXIuZ2V0VXNlclwiKTtcblxuXHRcdC8vIHNldCBzaGFyZSB0byBqYW1cblx0XHRpZiAoISFmbkdldFVzZXIgJiYgZm5HZXRVc2VyKCkuaXNKYW1BY3RpdmUoKSkge1xuXHRcdFx0c2hhcmVPcHRpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBcImphbVwiLFxuXHRcdFx0XHR0ZXh0OiBjb3JlUmVzb3VyY2UuZ2V0VGV4dChcIlRfQ09NTU9OX1NBUEZFX1NIQVJFX0pBTVwiKSxcblx0XHRcdFx0aWNvbjogXCJzYXAtaWNvbjovL3NoYXJlLTJcIixcblx0XHRcdFx0cHJlc3M6IFwiLnNoYXJlLl90cmlnZ2VyU2hhcmVUb0phbSgpXCJcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIHNldCBzYXZlIGFzIHRpbGVcblx0XHQvLyBmb3Igbm93IHdlIG5lZWQgdG8gY3JlYXRlIGFkZEJvb2ttYXJrQnV0dG9uIHRvIHVzZSB0aGUgc2F2ZSBhcyB0aWxlIGZlYXR1cmUuXG5cdFx0Ly8gSW4gdGhlIGZ1dHVyZSBzYXZlIGFzIHRpbGUgc2hvdWxkIGJlIGF2YWlsYWJsZSBhcyBhIEFQSSBvciBhIE1lbnVJdGVtIHNvIHRoYXQgaXQgY2FuIGJlIGFkZGVkIHRvIHRoZSBNZW51IGJ1dHRvbi5cblx0XHQvLyBUaGlzIG5lZWRzIHRvIGJlIGRpc2N1c3NlZCB3aXRoIEFkZEJvb2ttYXJrQnV0dG9uIHRlYW0uXG5cdFx0Y29uc3QgYWRkQm9va21hcmtCdXR0b24gPSBuZXcgQWRkQm9va21hcmtCdXR0b24oKTtcblx0XHRjb25zdCBvU2hlbGxTZXJ2aWNlcyA9IGFwcENvbXBvbmVudC5nZXRTaGVsbFNlcnZpY2VzKCk7XG5cdFx0aWYgKG9TaGVsbFNlcnZpY2VzLmhhc1VTaGVsbCgpICYmIGFkZEJvb2ttYXJrQnV0dG9uLmdldEVuYWJsZWQoKSkge1xuXHRcdFx0c2hhcmVPcHRpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBcInNhdmVBc1RpbGVcIixcblx0XHRcdFx0dGV4dDogYWRkQm9va21hcmtCdXR0b24uZ2V0VGV4dCgpLFxuXHRcdFx0XHRpY29uOiBhZGRCb29rbWFya0J1dHRvbi5nZXRJY29uKCksXG5cdFx0XHRcdHByZXNzOiBcIi5zaGFyZS5fc2F2ZUFzVGlsZSgkeyRzb3VyY2U+fSlcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGFkZEJvb2ttYXJrQnV0dG9uLmRlc3Ryb3koKTtcblx0XHRyZXR1cm4gc2hhcmVPcHRpb25zO1xuXHR9XG5cblx0Z2V0VGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIHhtbGBcblx0XHRcdDxtYWNybzpTaGFyZUFQSVxuXHRcdFx0XHR4bWxuczptYWNybz1cInNhcC5mZS5tYWNyb3Muc2hhcmVcIlxuXHRcdFx0XHRpZD1cIiR7dGhpcy5pZH1cIlxuXHRcdFx0PlxuXHRcdFx0XHQgJHt0aGlzLl9jcmVhdGVNZW51QnV0dG9uKCl9XG5cdFx0XHQ8L21hY3JvOlNoYXJlQVBJPlxuXHRcdGA7XG5cdH1cbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF5Q3FCQSxrQjtFQTFCckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO1NBQ0NDLG1CQUFtQixDQUFDO0lBQ3BCQyxJQUFJLEVB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