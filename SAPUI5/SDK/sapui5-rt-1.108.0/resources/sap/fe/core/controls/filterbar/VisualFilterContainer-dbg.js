/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/m/FlexBox", "sap/m/HeaderContainer", "sap/ui/core/library", "sap/ui/Device", "sap/ui/mdc/filterbar/IFilterContainer"], function (ClassSupport, FlexBox, HeaderContainer, coreLibrabry, Device, IFilterContainer) {
  "use strict";

  var _dec, _dec2, _class, _class2, _descriptor;

  var system = Device.system;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Constructor for a new Visual Filter Container.
   * Used for visual filters.
   *
   * @extends sap.ui.mdc.filterbar.IFilterContainer
   * @class
   * @private
   * @alias sap.fe.core.controls.filterbar.VisualFilterContainer
   */
  var VisualFilterContainer = (_dec = defineUI5Class("sap.fe.core.controls.filterbar.VisualFilterContainer"), _dec2 = aggregation({
    type: "sap.ui.core.Control",
    multiple: false,
    visibility: "hidden"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_IFilterContainer) {
    _inheritsLoose(VisualFilterContainer, _IFilterContainer);

    function VisualFilterContainer() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _IFilterContainer.call.apply(_IFilterContainer, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "_layout", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    var _proto = VisualFilterContainer.prototype;

    _proto.init = function init() {
      var _IFilterContainer$pro;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_IFilterContainer$pro = _IFilterContainer.prototype.init).call.apply(_IFilterContainer$pro, [this].concat(args)); //var oRB = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");


      var sDeviceSystem = system,
          Orientation = coreLibrabry.Orientation,
          sOrientation = sDeviceSystem.phone ? Orientation.Vertical : undefined,
          sDirection = sDeviceSystem.phone ? "ColumnReverse" : "Column";
      this.oHeaderContainer = new HeaderContainer({
        orientation: sOrientation
      });
      this.oButtonFlexBox = new FlexBox({
        alignItems: "End",
        justifyContent: "End"
      });
      this.oLayout = new FlexBox({
        direction: sDirection,
        // Direction is Column Reverse for Phone
        items: [this.oHeaderContainer, this.oButtonFlexBox]
      });
      this.aAllFilterFields = [];
      this.aVisualFilterFields = {};
    };

    _proto.exit = function exit() {
      var _IFilterContainer$pro2;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      // destroy layout
      (_IFilterContainer$pro2 = _IFilterContainer.prototype.exit).call.apply(_IFilterContainer$pro2, [this].concat(args)); // destroy all filter fields which are not in the layout


      var aAllFilterFields = this.getAllFilterFields();
      aAllFilterFields.forEach(function (oFilterField) {
        oFilterField.destroy();
      });
      this.oHeaderContainer = null;
      this.oButtonFlexBox = null;
      this.aAllFilterFields = [];
    };

    _proto.insertFilterField = function insertFilterField(oControl, iIndex) {
      var _this2 = this;

      var oFilterItemLayoutEventDelegate = {
        onBeforeRendering: function () {
          // visual filter does not need to render a label
          // hence override the getContent of the FilterItemLayout
          // and store the original getContent for later usage in the compact filters
          if (!oControl._fnGetContentCopy) {
            oControl._fnGetContentCopy = oControl.getContent;
          } // override getContent of FilterItemLayout
          // to add only filterField and not label


          oControl.getContent = function () {
            var aContent = [];
            aContent.push(oControl._oFilterField);
            return aContent;
          };

          oControl.removeEventDelegate(oFilterItemLayoutEventDelegate);
        }
      };
      oControl.addEventDelegate(oFilterItemLayoutEventDelegate); // Setting VF control for the Filterfield.

      var oVisualFilters = this.aVisualFilterFields;
      oControl.getContent().some(function (oInnerControl) {
        var sFFId = oInnerControl.getId();

        if (oVisualFilters[sFFId] && oInnerControl.isA("sap.ui.mdc.FilterField")) {
          oInnerControl.setContent(oVisualFilters[sFFId]);

          _this2.oHeaderContainer.insertContent(oControl, iIndex);
        }
      });
    };

    _proto.removeFilterField = function removeFilterField(oControl) {
      this.oHeaderContainer.removeContent(oControl);
    };

    _proto.removeAllFilterFields = function removeAllFilterFields() {
      this.aAllFilterFields = [];
      this.aVisualFilterFields = {};
      this.oHeaderContainer.removeAllContent();
    };

    _proto.getFilterFields = function getFilterFields() {
      return this.oHeaderContainer.getContent();
    };

    _proto.addButton = function addButton(oControl) {
      this.oButtonFlexBox.insertItem(oControl);
    };

    _proto.getAllButtons = function getAllButtons() {
      return this.oButtonFlexBox.getItems().reverse();
    };

    _proto.removeButton = function removeButton(oControl) {
      this.oButtonFlexBox.removeItem(oControl);
    };

    _proto.getAllFilterFields = function getAllFilterFields() {
      return this.aAllFilterFields.slice();
    };

    _proto.setAllFilterFields = function setAllFilterFields(aFilterFields, aVisualFilterFields) {
      this.aAllFilterFields = aFilterFields;
      this.aVisualFilterFields = aVisualFilterFields;
    };

    return VisualFilterContainer;
  }(IFilterContainer), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_layout", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return VisualFilterContainer;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJWaXN1YWxGaWx0ZXJDb250YWluZXIiLCJkZWZpbmVVSTVDbGFzcyIsImFnZ3JlZ2F0aW9uIiwidHlwZSIsIm11bHRpcGxlIiwidmlzaWJpbGl0eSIsImluaXQiLCJhcmdzIiwic0RldmljZVN5c3RlbSIsInN5c3RlbSIsIk9yaWVudGF0aW9uIiwiY29yZUxpYnJhYnJ5Iiwic09yaWVudGF0aW9uIiwicGhvbmUiLCJWZXJ0aWNhbCIsInVuZGVmaW5lZCIsInNEaXJlY3Rpb24iLCJvSGVhZGVyQ29udGFpbmVyIiwiSGVhZGVyQ29udGFpbmVyIiwib3JpZW50YXRpb24iLCJvQnV0dG9uRmxleEJveCIsIkZsZXhCb3giLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJvTGF5b3V0IiwiZGlyZWN0aW9uIiwiaXRlbXMiLCJhQWxsRmlsdGVyRmllbGRzIiwiYVZpc3VhbEZpbHRlckZpZWxkcyIsImV4aXQiLCJnZXRBbGxGaWx0ZXJGaWVsZHMiLCJmb3JFYWNoIiwib0ZpbHRlckZpZWxkIiwiZGVzdHJveSIsImluc2VydEZpbHRlckZpZWxkIiwib0NvbnRyb2wiLCJpSW5kZXgiLCJvRmlsdGVySXRlbUxheW91dEV2ZW50RGVsZWdhdGUiLCJvbkJlZm9yZVJlbmRlcmluZyIsIl9mbkdldENvbnRlbnRDb3B5IiwiZ2V0Q29udGVudCIsImFDb250ZW50IiwicHVzaCIsIl9vRmlsdGVyRmllbGQiLCJyZW1vdmVFdmVudERlbGVnYXRlIiwiYWRkRXZlbnREZWxlZ2F0ZSIsIm9WaXN1YWxGaWx0ZXJzIiwic29tZSIsIm9Jbm5lckNvbnRyb2wiLCJzRkZJZCIsImdldElkIiwiaXNBIiwic2V0Q29udGVudCIsImluc2VydENvbnRlbnQiLCJyZW1vdmVGaWx0ZXJGaWVsZCIsInJlbW92ZUNvbnRlbnQiLCJyZW1vdmVBbGxGaWx0ZXJGaWVsZHMiLCJyZW1vdmVBbGxDb250ZW50IiwiZ2V0RmlsdGVyRmllbGRzIiwiYWRkQnV0dG9uIiwiaW5zZXJ0SXRlbSIsImdldEFsbEJ1dHRvbnMiLCJnZXRJdGVtcyIsInJldmVyc2UiLCJyZW1vdmVCdXR0b24iLCJyZW1vdmVJdGVtIiwic2xpY2UiLCJzZXRBbGxGaWx0ZXJGaWVsZHMiLCJhRmlsdGVyRmllbGRzIiwiSUZpbHRlckNvbnRhaW5lciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVmlzdWFsRmlsdGVyQ29udGFpbmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFnZ3JlZ2F0aW9uLCBkZWZpbmVVSTVDbGFzcyB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IEZsZXhCb3ggZnJvbSBcInNhcC9tL0ZsZXhCb3hcIjtcbmltcG9ydCBIZWFkZXJDb250YWluZXIgZnJvbSBcInNhcC9tL0hlYWRlckNvbnRhaW5lclwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IGNvcmVMaWJyYWJyeSBmcm9tIFwic2FwL3VpL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IHsgc3lzdGVtIH0gZnJvbSBcInNhcC91aS9EZXZpY2VcIjtcbmltcG9ydCBJRmlsdGVyQ29udGFpbmVyIGZyb20gXCJzYXAvdWkvbWRjL2ZpbHRlcmJhci9JRmlsdGVyQ29udGFpbmVyXCI7XG4vKipcbiAqIENvbnN0cnVjdG9yIGZvciBhIG5ldyBWaXN1YWwgRmlsdGVyIENvbnRhaW5lci5cbiAqIFVzZWQgZm9yIHZpc3VhbCBmaWx0ZXJzLlxuICpcbiAqIEBleHRlbmRzIHNhcC51aS5tZGMuZmlsdGVyYmFyLklGaWx0ZXJDb250YWluZXJcbiAqIEBjbGFzc1xuICogQHByaXZhdGVcbiAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9scy5maWx0ZXJiYXIuVmlzdWFsRmlsdGVyQ29udGFpbmVyXG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5jb3JlLmNvbnRyb2xzLmZpbHRlcmJhci5WaXN1YWxGaWx0ZXJDb250YWluZXJcIilcbmNsYXNzIFZpc3VhbEZpbHRlckNvbnRhaW5lciBleHRlbmRzIElGaWx0ZXJDb250YWluZXIge1xuXHRAYWdncmVnYXRpb24oe1xuXHRcdHR5cGU6IFwic2FwLnVpLmNvcmUuQ29udHJvbFwiLFxuXHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHR2aXNpYmlsaXR5OiBcImhpZGRlblwiXG5cdH0pXG5cdC8qKlxuXHQgKiBJbnRlcm5hbCBoaWRkZW4gYWdncmVnYXRpb24gdG8gaG9sZCB0aGUgaW5uZXIgbGF5b3V0LlxuXHQgKi9cblx0X2xheW91dCE6IENvbnRyb2w7XG5cblx0aW5pdCguLi5hcmdzOiBhbnlbXSkge1xuXHRcdHN1cGVyLmluaXQoLi4uYXJncyk7XG5cdFx0Ly92YXIgb1JCID0gc2FwLnVpLmdldENvcmUoKS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAudWkubWRjXCIpO1xuXHRcdGNvbnN0IHNEZXZpY2VTeXN0ZW0gPSBzeXN0ZW0sXG5cdFx0XHRPcmllbnRhdGlvbiA9IGNvcmVMaWJyYWJyeS5PcmllbnRhdGlvbixcblx0XHRcdHNPcmllbnRhdGlvbiA9IHNEZXZpY2VTeXN0ZW0ucGhvbmUgPyBPcmllbnRhdGlvbi5WZXJ0aWNhbCA6IHVuZGVmaW5lZCxcblx0XHRcdHNEaXJlY3Rpb24gPSBzRGV2aWNlU3lzdGVtLnBob25lID8gXCJDb2x1bW5SZXZlcnNlXCIgOiBcIkNvbHVtblwiO1xuXG5cdFx0dGhpcy5vSGVhZGVyQ29udGFpbmVyID0gbmV3IEhlYWRlckNvbnRhaW5lcih7XG5cdFx0XHRvcmllbnRhdGlvbjogc09yaWVudGF0aW9uXG5cdFx0fSk7XG5cdFx0dGhpcy5vQnV0dG9uRmxleEJveCA9IG5ldyBGbGV4Qm94KHtcblx0XHRcdGFsaWduSXRlbXM6IFwiRW5kXCIsXG5cdFx0XHRqdXN0aWZ5Q29udGVudDogXCJFbmRcIlxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vTGF5b3V0ID0gbmV3IEZsZXhCb3goe1xuXHRcdFx0ZGlyZWN0aW9uOiBzRGlyZWN0aW9uLCAvLyBEaXJlY3Rpb24gaXMgQ29sdW1uIFJldmVyc2UgZm9yIFBob25lXG5cdFx0XHRpdGVtczogW3RoaXMub0hlYWRlckNvbnRhaW5lciwgdGhpcy5vQnV0dG9uRmxleEJveF1cblx0XHR9KTtcblxuXHRcdHRoaXMuYUFsbEZpbHRlckZpZWxkcyA9IFtdO1xuXHRcdHRoaXMuYVZpc3VhbEZpbHRlckZpZWxkcyA9IHt9O1xuXHR9XG5cdGV4aXQoLi4uYXJnczogYW55W10pIHtcblx0XHQvLyBkZXN0cm95IGxheW91dFxuXHRcdHN1cGVyLmV4aXQoLi4uYXJncyk7XG5cdFx0Ly8gZGVzdHJveSBhbGwgZmlsdGVyIGZpZWxkcyB3aGljaCBhcmUgbm90IGluIHRoZSBsYXlvdXRcblx0XHRjb25zdCBhQWxsRmlsdGVyRmllbGRzID0gdGhpcy5nZXRBbGxGaWx0ZXJGaWVsZHMoKTtcblx0XHRhQWxsRmlsdGVyRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKG9GaWx0ZXJGaWVsZDogYW55KSB7XG5cdFx0XHRvRmlsdGVyRmllbGQuZGVzdHJveSgpO1xuXHRcdH0pO1xuXHRcdHRoaXMub0hlYWRlckNvbnRhaW5lciA9IG51bGw7XG5cdFx0dGhpcy5vQnV0dG9uRmxleEJveCA9IG51bGw7XG5cdFx0dGhpcy5hQWxsRmlsdGVyRmllbGRzID0gW107XG5cdH1cblx0aW5zZXJ0RmlsdGVyRmllbGQob0NvbnRyb2w6IGFueSwgaUluZGV4OiBhbnkpIHtcblx0XHRjb25zdCBvRmlsdGVySXRlbUxheW91dEV2ZW50RGVsZWdhdGUgPSB7XG5cdFx0XHRvbkJlZm9yZVJlbmRlcmluZzogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQvLyB2aXN1YWwgZmlsdGVyIGRvZXMgbm90IG5lZWQgdG8gcmVuZGVyIGEgbGFiZWxcblx0XHRcdFx0Ly8gaGVuY2Ugb3ZlcnJpZGUgdGhlIGdldENvbnRlbnQgb2YgdGhlIEZpbHRlckl0ZW1MYXlvdXRcblx0XHRcdFx0Ly8gYW5kIHN0b3JlIHRoZSBvcmlnaW5hbCBnZXRDb250ZW50IGZvciBsYXRlciB1c2FnZSBpbiB0aGUgY29tcGFjdCBmaWx0ZXJzXG5cdFx0XHRcdGlmICghb0NvbnRyb2wuX2ZuR2V0Q29udGVudENvcHkpIHtcblx0XHRcdFx0XHRvQ29udHJvbC5fZm5HZXRDb250ZW50Q29weSA9IG9Db250cm9sLmdldENvbnRlbnQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gb3ZlcnJpZGUgZ2V0Q29udGVudCBvZiBGaWx0ZXJJdGVtTGF5b3V0XG5cdFx0XHRcdC8vIHRvIGFkZCBvbmx5IGZpbHRlckZpZWxkIGFuZCBub3QgbGFiZWxcblx0XHRcdFx0b0NvbnRyb2wuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjb25zdCBhQ29udGVudCA9IFtdO1xuXHRcdFx0XHRcdGFDb250ZW50LnB1c2gob0NvbnRyb2wuX29GaWx0ZXJGaWVsZCk7XG5cdFx0XHRcdFx0cmV0dXJuIGFDb250ZW50O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRvQ29udHJvbC5yZW1vdmVFdmVudERlbGVnYXRlKG9GaWx0ZXJJdGVtTGF5b3V0RXZlbnREZWxlZ2F0ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRvQ29udHJvbC5hZGRFdmVudERlbGVnYXRlKG9GaWx0ZXJJdGVtTGF5b3V0RXZlbnREZWxlZ2F0ZSk7XG5cblx0XHQvLyBTZXR0aW5nIFZGIGNvbnRyb2wgZm9yIHRoZSBGaWx0ZXJmaWVsZC5cblx0XHRjb25zdCBvVmlzdWFsRmlsdGVycyA9IHRoaXMuYVZpc3VhbEZpbHRlckZpZWxkcztcblx0XHRvQ29udHJvbC5nZXRDb250ZW50KCkuc29tZSgob0lubmVyQ29udHJvbDogYW55KSA9PiB7XG5cdFx0XHRjb25zdCBzRkZJZCA9IG9Jbm5lckNvbnRyb2wuZ2V0SWQoKTtcblx0XHRcdGlmIChvVmlzdWFsRmlsdGVyc1tzRkZJZF0gJiYgb0lubmVyQ29udHJvbC5pc0EoXCJzYXAudWkubWRjLkZpbHRlckZpZWxkXCIpKSB7XG5cdFx0XHRcdG9Jbm5lckNvbnRyb2wuc2V0Q29udGVudChvVmlzdWFsRmlsdGVyc1tzRkZJZF0pO1xuXHRcdFx0XHR0aGlzLm9IZWFkZXJDb250YWluZXIuaW5zZXJ0Q29udGVudChvQ29udHJvbCwgaUluZGV4KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZW1vdmVGaWx0ZXJGaWVsZChvQ29udHJvbDogYW55KSB7XG5cdFx0dGhpcy5vSGVhZGVyQ29udGFpbmVyLnJlbW92ZUNvbnRlbnQob0NvbnRyb2wpO1xuXHR9XG5cdHJlbW92ZUFsbEZpbHRlckZpZWxkcygpIHtcblx0XHR0aGlzLmFBbGxGaWx0ZXJGaWVsZHMgPSBbXTtcblx0XHR0aGlzLmFWaXN1YWxGaWx0ZXJGaWVsZHMgPSB7fTtcblx0XHR0aGlzLm9IZWFkZXJDb250YWluZXIucmVtb3ZlQWxsQ29udGVudCgpO1xuXHR9XG5cdGdldEZpbHRlckZpZWxkcygpIHtcblx0XHRyZXR1cm4gdGhpcy5vSGVhZGVyQ29udGFpbmVyLmdldENvbnRlbnQoKTtcblx0fVxuXHRhZGRCdXR0b24ob0NvbnRyb2w6IGFueSkge1xuXHRcdHRoaXMub0J1dHRvbkZsZXhCb3guaW5zZXJ0SXRlbShvQ29udHJvbCk7XG5cdH1cblx0Z2V0QWxsQnV0dG9ucygpIHtcblx0XHRyZXR1cm4gdGhpcy5vQnV0dG9uRmxleEJveC5nZXRJdGVtcygpLnJldmVyc2UoKTtcblx0fVxuXHRyZW1vdmVCdXR0b24ob0NvbnRyb2w6IGFueSkge1xuXHRcdHRoaXMub0J1dHRvbkZsZXhCb3gucmVtb3ZlSXRlbShvQ29udHJvbCk7XG5cdH1cblx0Z2V0QWxsRmlsdGVyRmllbGRzKCkge1xuXHRcdHJldHVybiB0aGlzLmFBbGxGaWx0ZXJGaWVsZHMuc2xpY2UoKTtcblx0fVxuXHRzZXRBbGxGaWx0ZXJGaWVsZHMoYUZpbHRlckZpZWxkczogYW55LCBhVmlzdWFsRmlsdGVyRmllbGRzOiBhbnkpIHtcblx0XHR0aGlzLmFBbGxGaWx0ZXJGaWVsZHMgPSBhRmlsdGVyRmllbGRzO1xuXHRcdHRoaXMuYVZpc3VhbEZpbHRlckZpZWxkcyA9IGFWaXN1YWxGaWx0ZXJGaWVsZHM7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlzdWFsRmlsdGVyQ29udGFpbmVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BRU1BLHFCLFdBRExDLGNBQWMsQ0FBQyxzREFBRCxDLFVBRWJDLFdBQVcsQ0FBQztJQUNaQyxJQUFJLEVBQUUscUJBRE07SUFFWkMsUUFBUSxFQUFFLEtBRkU7SUFHWkMsVUFBVSxFQUFFO0VBSEEsQ0FBRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBVVpDLEksR0FBQSxnQkFBcUI7TUFBQTs7TUFBQSxtQ0FBYkMsSUFBYTtRQUFiQSxJQUFhO01BQUE7O01BQ3BCLHFEQUFNRCxJQUFOLGtEQUFjQyxJQUFkLEdBRG9CLENBRXBCOzs7TUFDQSxJQUFNQyxhQUFhLEdBQUdDLE1BQXRCO01BQUEsSUFDQ0MsV0FBVyxHQUFHQyxZQUFZLENBQUNELFdBRDVCO01BQUEsSUFFQ0UsWUFBWSxHQUFHSixhQUFhLENBQUNLLEtBQWQsR0FBc0JILFdBQVcsQ0FBQ0ksUUFBbEMsR0FBNkNDLFNBRjdEO01BQUEsSUFHQ0MsVUFBVSxHQUFHUixhQUFhLENBQUNLLEtBQWQsR0FBc0IsZUFBdEIsR0FBd0MsUUFIdEQ7TUFLQSxLQUFLSSxnQkFBTCxHQUF3QixJQUFJQyxlQUFKLENBQW9CO1FBQzNDQyxXQUFXLEVBQUVQO01BRDhCLENBQXBCLENBQXhCO01BR0EsS0FBS1EsY0FBTCxHQUFzQixJQUFJQyxPQUFKLENBQVk7UUFDakNDLFVBQVUsRUFBRSxLQURxQjtRQUVqQ0MsY0FBYyxFQUFFO01BRmlCLENBQVosQ0FBdEI7TUFLQSxLQUFLQyxPQUFMLEdBQWUsSUFBSUgsT0FBSixDQUFZO1FBQzFCSSxTQUFTLEVBQUVULFVBRGU7UUFDSDtRQUN2QlUsS0FBSyxFQUFFLENBQUMsS0FBS1QsZ0JBQU4sRUFBd0IsS0FBS0csY0FBN0I7TUFGbUIsQ0FB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