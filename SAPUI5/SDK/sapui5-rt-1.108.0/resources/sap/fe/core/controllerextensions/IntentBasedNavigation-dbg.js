/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution"], function (ClassSupport, ControllerExtension, OverrideExecution) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * Controller extension providing hooks for intent-based navigation
   *
   * @hideconstructor
   * @public
   * @since 1.86.0
   */
  var IntentBasedNavigation = (_dec = defineUI5Class("sap.fe.core.controllerextensions.IntentBasedNavigation"), _dec2 = publicExtension(), _dec3 = extensible(OverrideExecution.After), _dec4 = finalExtension(), _dec5 = publicExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(IntentBasedNavigation, _ControllerExtension);

    function IntentBasedNavigation() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = IntentBasedNavigation.prototype;

    /**
     * Provides a hook to customize the {@link sap.fe.navigation.SelectionVariant} related to the intent-based navigation.
     *
     * @function
     * @param oSelectionVariant SelectionVariant provided by SAP Fiori elements.
     * @param oNavigationInfo Object containing intent-based navigation-related info
     * @param oNavigationInfo.semanticObject Semantic object related to the intent
     * @param oNavigationInfo.action Action related to the intent
     * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#adaptNavigationContext
     * @public
     * @since 1.86.0
     */
    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adaptNavigationContext = function adaptNavigationContext(oSelectionVariant, oNavigationInfo) {// to be overriden by the application
    }
    /**
     * Navigates to an intent defined by an outbound definition in the manifest.
     *
     * @function
     * @param sOutbound Identifier to locate the outbound definition in the manifest.
     * This provides the semantic object and action for the intent-based navigation.
     * Additionally, the outbound definition can be used to provide parameters for intent-based navigation.
     * See {@link topic:be0cf40f61184b358b5faedaec98b2da Descriptor for Applications, Components, and Libraries} for more information.
     * @param mNavigationParameters Optional map containing key/value pairs to be passed to the intent.
     * If mNavigationParameters are provided, the parameters provided in the outbound definition of the manifest are ignored.
     * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#navigateOutbound
     * @public
     * @since 1.86.0
     */
    ;

    _proto.navigateOutbound = function navigateOutbound(sOutbound, mNavigationParameters) {
      var _this$base, _this$base2;

      var oInternalModelContext = (_this$base = this.base) === null || _this$base === void 0 ? void 0 : _this$base.getView().getBindingContext("internal");
      oInternalModelContext.setProperty("externalNavigationContext", {
        "page": false
      });
      (_this$base2 = this.base) === null || _this$base2 === void 0 ? void 0 : _this$base2._intentBasedNavigation.navigateOutbound(sOutbound, mNavigationParameters);
    };

    return IntentBasedNavigation;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "adaptNavigationContext", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "adaptNavigationContext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "navigateOutbound", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "navigateOutbound"), _class2.prototype)), _class2)) || _class);
  return IntentBasedNavigation;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJkZWZpbmVVSTVDbGFzcyIsInB1YmxpY0V4dGVuc2lvbiIsImV4dGVuc2libGUiLCJPdmVycmlkZUV4ZWN1dGlvbiIsIkFmdGVyIiwiZmluYWxFeHRlbnNpb24iLCJhZGFwdE5hdmlnYXRpb25Db250ZXh0Iiwib1NlbGVjdGlvblZhcmlhbnQiLCJvTmF2aWdhdGlvbkluZm8iLCJuYXZpZ2F0ZU91dGJvdW5kIiwic091dGJvdW5kIiwibU5hdmlnYXRpb25QYXJhbWV0ZXJzIiwib0ludGVybmFsTW9kZWxDb250ZXh0IiwiYmFzZSIsImdldFZpZXciLCJnZXRCaW5kaW5nQ29udGV4dCIsInNldFByb3BlcnR5IiwiX2ludGVudEJhc2VkTmF2aWdhdGlvbiIsIkNvbnRyb2xsZXJFeHRlbnNpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkludGVudEJhc2VkTmF2aWdhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVVSTVDbGFzcywgZXh0ZW5zaWJsZSwgZmluYWxFeHRlbnNpb24sIHB1YmxpY0V4dGVuc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbE1vZGVsQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIFNlbGVjdGlvblZhcmlhbnQgZnJvbSBcInNhcC9mZS9uYXZpZ2F0aW9uL1NlbGVjdGlvblZhcmlhbnRcIjtcbmltcG9ydCBDb250cm9sbGVyRXh0ZW5zaW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvQ29udHJvbGxlckV4dGVuc2lvblwiO1xuaW1wb3J0IE92ZXJyaWRlRXhlY3V0aW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvT3ZlcnJpZGVFeGVjdXRpb25cIjtcblxuLyoqXG4gKiBDb250cm9sbGVyIGV4dGVuc2lvbiBwcm92aWRpbmcgaG9va3MgZm9yIGludGVudC1iYXNlZCBuYXZpZ2F0aW9uXG4gKlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICogQHNpbmNlIDEuODYuMFxuICovXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5JbnRlbnRCYXNlZE5hdmlnYXRpb25cIilcbmNsYXNzIEludGVudEJhc2VkTmF2aWdhdGlvbiBleHRlbmRzIENvbnRyb2xsZXJFeHRlbnNpb24ge1xuXHRiYXNlITogUGFnZUNvbnRyb2xsZXI7XG5cdC8qKlxuXHQgKiBQcm92aWRlcyBhIGhvb2sgdG8gY3VzdG9taXplIHRoZSB7QGxpbmsgc2FwLmZlLm5hdmlnYXRpb24uU2VsZWN0aW9uVmFyaWFudH0gcmVsYXRlZCB0byB0aGUgaW50ZW50LWJhc2VkIG5hdmlnYXRpb24uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gb1NlbGVjdGlvblZhcmlhbnQgU2VsZWN0aW9uVmFyaWFudCBwcm92aWRlZCBieSBTQVAgRmlvcmkgZWxlbWVudHMuXG5cdCAqIEBwYXJhbSBvTmF2aWdhdGlvbkluZm8gT2JqZWN0IGNvbnRhaW5pbmcgaW50ZW50LWJhc2VkIG5hdmlnYXRpb24tcmVsYXRlZCBpbmZvXG5cdCAqIEBwYXJhbSBvTmF2aWdhdGlvbkluZm8uc2VtYW50aWNPYmplY3QgU2VtYW50aWMgb2JqZWN0IHJlbGF0ZWQgdG8gdGhlIGludGVudFxuXHQgKiBAcGFyYW0gb05hdmlnYXRpb25JbmZvLmFjdGlvbiBBY3Rpb24gcmVsYXRlZCB0byB0aGUgaW50ZW50XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5JbnRlbnRCYXNlZE5hdmlnYXRpb24jYWRhcHROYXZpZ2F0aW9uQ29udGV4dFxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjg2LjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRhZGFwdE5hdmlnYXRpb25Db250ZXh0KG9TZWxlY3Rpb25WYXJpYW50OiBTZWxlY3Rpb25WYXJpYW50LCBvTmF2aWdhdGlvbkluZm86IHsgc2VtYW50aWNPYmplY3Q6IHN0cmluZzsgYWN0aW9uOiBzdHJpbmcgfSkge1xuXHRcdC8vIHRvIGJlIG92ZXJyaWRlbiBieSB0aGUgYXBwbGljYXRpb25cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gYW4gaW50ZW50IGRlZmluZWQgYnkgYW4gb3V0Ym91bmQgZGVmaW5pdGlvbiBpbiB0aGUgbWFuaWZlc3QuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gc091dGJvdW5kIElkZW50aWZpZXIgdG8gbG9jYXRlIHRoZSBvdXRib3VuZCBkZWZpbml0aW9uIGluIHRoZSBtYW5pZmVzdC5cblx0ICogVGhpcyBwcm92aWRlcyB0aGUgc2VtYW50aWMgb2JqZWN0IGFuZCBhY3Rpb24gZm9yIHRoZSBpbnRlbnQtYmFzZWQgbmF2aWdhdGlvbi5cblx0ICogQWRkaXRpb25hbGx5LCB0aGUgb3V0Ym91bmQgZGVmaW5pdGlvbiBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHBhcmFtZXRlcnMgZm9yIGludGVudC1iYXNlZCBuYXZpZ2F0aW9uLlxuXHQgKiBTZWUge0BsaW5rIHRvcGljOmJlMGNmNDBmNjExODRiMzU4YjVmYWVkYWVjOThiMmRhIERlc2NyaXB0b3IgZm9yIEFwcGxpY2F0aW9ucywgQ29tcG9uZW50cywgYW5kIExpYnJhcmllc30gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG5cdCAqIEBwYXJhbSBtTmF2aWdhdGlvblBhcmFtZXRlcnMgT3B0aW9uYWwgbWFwIGNvbnRhaW5pbmcga2V5L3ZhbHVlIHBhaXJzIHRvIGJlIHBhc3NlZCB0byB0aGUgaW50ZW50LlxuXHQgKiBJZiBtTmF2aWdhdGlvblBhcmFtZXRlcnMgYXJlIHByb3ZpZGVkLCB0aGUgcGFyYW1ldGVycyBwcm92aWRlZCBpbiB0aGUgb3V0Ym91bmQgZGVmaW5pdGlvbiBvZiB0aGUgbWFuaWZlc3QgYXJlIGlnbm9yZWQuXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5JbnRlbnRCYXNlZE5hdmlnYXRpb24jbmF2aWdhdGVPdXRib3VuZFxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjg2LjBcblx0ICovXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRuYXZpZ2F0ZU91dGJvdW5kKHNPdXRib3VuZDogc3RyaW5nLCBtTmF2aWdhdGlvblBhcmFtZXRlcnM6IG9iamVjdCkge1xuXHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IHRoaXMuYmFzZT8uZ2V0VmlldygpLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiZXh0ZXJuYWxOYXZpZ2F0aW9uQ29udGV4dFwiLCB7IFwicGFnZVwiOiBmYWxzZSB9KTtcblx0XHR0aGlzLmJhc2U/Ll9pbnRlbnRCYXNlZE5hdmlnYXRpb24ubmF2aWdhdGVPdXRib3VuZChzT3V0Ym91bmQsIG1OYXZpZ2F0aW9uUGFyYW1ldGVycyk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW50ZW50QmFzZWROYXZpZ2F0aW9uO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztFQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BRU1BLHFCLFdBRExDLGNBQWMsQ0FBQyx3REFBRCxDLFVBZWJDLGVBQWUsRSxVQUNmQyxVQUFVLENBQUNDLGlCQUFpQixDQUFDQyxLQUFuQixDLFVBb0JWQyxjQUFjLEUsVUFDZEosZUFBZSxFOzs7Ozs7Ozs7SUFsQ2hCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtZQUdDO0lBQ0FLLHNCLEdBSEEsZ0NBR3VCQyxpQkFIdkIsRUFHNERDLGVBSDVELEVBR3lILENBQ3hIO0lBQ0E7SUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7V0FHQ0MsZ0IsR0FGQSwwQkFFaUJDLFNBRmpCLEVBRW9DQyxxQkFGcEMsRUFFbUU7TUFBQTs7TUFDbEUsSUFBTUMscUJBQXFCLGlCQUFHLEtBQUtDLElBQVIsK0NBQUcsV0FBV0MsT0FBWCxHQUFxQkMsaUJBQXJCLENBQXVDLFVBQXZDLENBQTlCO01BQ0FILHFCQUFxQixDQUFDSSxXQUF0QixDQUFrQywyQkFBbEMsRUFBK0Q7UUFBRSxRQUFRO01BQVYsQ0FBL0Q7TUFDQSxvQkFBS0gsSUFBTCw0REFBV0ksc0JBQVgsQ0FBa0NSLGdCQUFsQyxDQUFtREMsU0FBbkQsRUFBOERDLHFCQUE5RDtJQUNBLEM7OztJQXpDa0NPLG1CO1NBNENyQm5CLHFCIn0=