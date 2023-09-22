/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/ui/model/json/JSONModel"], function (ClassSupport, ControllerExtension, OverrideExecution, JSONModel) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var methodOverride = ClassSupport.methodOverride;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * Controller extension providing hooks for the navigation using paginators
   *
   * @hideconstructor
   * @public
   * @since 1.94.0
   */
  var Paginator = (_dec = defineUI5Class("sap.fe.core.controllerextensions.Paginator"), _dec2 = methodOverride(), _dec3 = publicExtension(), _dec4 = finalExtension(), _dec5 = publicExtension(), _dec6 = finalExtension(), _dec7 = privateExtension(), _dec8 = extensible(OverrideExecution.After), _dec9 = privateExtension(), _dec10 = extensible(OverrideExecution.After), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(Paginator, _ControllerExtension);

    function Paginator() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _ControllerExtension.call.apply(_ControllerExtension, [this].concat(args)) || this;
      _this._iCurrentIndex = -1;
      return _this;
    }

    var _proto = Paginator.prototype;

    _proto.onInit = function onInit() {
      this._oView = this.base.getView();

      this._oView.setModel(new JSONModel({
        navUpEnabled: false,
        navDownEnabled: false
      }), "paginator");
    }
    /**
     * Initiates the paginator control.
     *
     * @function
     * @param oBinding ODataListBinding object
     * @param oContext Current context where the navigation is initiated
     * @alias sap.fe.core.controllerextensions.Paginator#initialize
     * @public
     * @since 1.94.0
     */
    ;

    _proto.initialize = function initialize(oBinding, oContext) {
      if (oBinding && oBinding.getAllCurrentContexts) {
        this._oListBinding = oBinding;
      }

      if (oContext) {
        this._oCurrentContext = oContext;
      }

      this._updateCurrentIndexAndButtonEnablement();
    };

    _proto._updateCurrentIndexAndButtonEnablement = function _updateCurrentIndexAndButtonEnablement() {
      if (this._oCurrentContext && this._oListBinding) {
        var sPath = this._oCurrentContext.getPath(); // Storing the currentIndex in global variable


        this._iCurrentIndex = this._oListBinding.getAllCurrentContexts().findIndex(function (oContext) {
          return oContext && oContext.getPath() === sPath;
        });

        var oCurrentIndexContext = this._oListBinding.getAllCurrentContexts()[this._iCurrentIndex];

        if (!this._iCurrentIndex && this._iCurrentIndex !== 0 || !oCurrentIndexContext || this._oCurrentContext.getPath() !== oCurrentIndexContext.getPath()) {
          this._updateCurrentIndex();
        }
      }

      this._handleButtonEnablement();
    };

    _proto._handleButtonEnablement = function _handleButtonEnablement() {
      //Enabling and Disabling the Buttons on change of the control context
      var mButtonEnablementModel = this.base.getView().getModel("paginator");

      if (this._oListBinding && this._oListBinding.getAllCurrentContexts().length > 1 && this._iCurrentIndex > -1) {
        if (this._iCurrentIndex === this._oListBinding.getAllCurrentContexts().length - 1) {
          mButtonEnablementModel.setProperty("/navDownEnabled", false);
        } else if (this._oListBinding.getAllCurrentContexts()[this._iCurrentIndex + 1].isInactive()) {
          //check the next context is not an inactive context
          mButtonEnablementModel.setProperty("/navDownEnabled", false);
        } else {
          mButtonEnablementModel.setProperty("/navDownEnabled", true);
        }

        if (this._iCurrentIndex === 0) {
          mButtonEnablementModel.setProperty("/navUpEnabled", false);
        } else if (this._oListBinding.getAllCurrentContexts()[this._iCurrentIndex - 1].isInactive()) {
          mButtonEnablementModel.setProperty("/navUpEnabled", false);
        } else {
          mButtonEnablementModel.setProperty("/navUpEnabled", true);
        }
      } else {
        // Don't show the paginator buttons
        // 1. When no listbinding is available
        // 2. Only '1' or '0' context exists in the listBinding
        // 3. The current index is -ve, i.e the currentIndex is invalid.
        mButtonEnablementModel.setProperty("/navUpEnabled", false);
        mButtonEnablementModel.setProperty("/navDownEnabled", false);
      }
    };

    _proto._updateCurrentIndex = function _updateCurrentIndex() {
      if (this._oCurrentContext && this._oListBinding) {
        var sPath = this._oCurrentContext.getPath(); // Storing the currentIndex in global variable


        this._iCurrentIndex = this._oListBinding.getAllCurrentContexts().findIndex(function (oContext) {
          return oContext && oContext.getPath() === sPath;
        });
      }
    };

    _proto.updateCurrentContext = function updateCurrentContext(iDeltaIndex) {
      if (!this._oListBinding) {
        return;
      }

      var aCurrentContexts = this._oListBinding.getAllCurrentContexts();

      var iNewIndex = this._iCurrentIndex + iDeltaIndex;
      var oNewContext = aCurrentContexts[iNewIndex];

      if (oNewContext) {
        var bPreventIdxUpdate = this.onBeforeContextUpdate(this._oListBinding, this._iCurrentIndex, iDeltaIndex);

        if (!bPreventIdxUpdate) {
          this._iCurrentIndex = iNewIndex;
          this._oCurrentContext = oNewContext;
        }

        this.onContextUpdate(oNewContext);
      }

      this._handleButtonEnablement();
    }
    /**
     * Called before context update.
     *
     * @function
     * @param oListBinding ODataListBinding object
     * @param iCurrentIndex Current index of context in listBinding from where the navigation is initiated
     * @param iIndexUpdate The delta index for update
     * @returns `true` to prevent the update of current context.
     * @alias sap.fe.core.controllerextensions.Paginator#onBeforeContextUpdate
     * @private
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onBeforeContextUpdate = function onBeforeContextUpdate(oListBinding, iCurrentIndex, iIndexUpdate) {
      return false;
    }
    /**
     * Returns the updated context after the paginator operation.
     *
     * @function
     * @param oContext Final context returned after the paginator action
     * @alias sap.fe.core.controllerextensions.Paginator#onContextUpdate
     * @public
     * @since 1.94.0
     */
    ;

    _proto. // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onContextUpdate = function onContextUpdate(oContext) {//To be overridden by the application
    };

    return Paginator;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "initialize", [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "initialize"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateCurrentContext", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "updateCurrentContext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeContextUpdate", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeContextUpdate"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onContextUpdate", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "onContextUpdate"), _class2.prototype)), _class2)) || _class);
  return Paginator;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYWdpbmF0b3IiLCJkZWZpbmVVSTVDbGFzcyIsIm1ldGhvZE92ZXJyaWRlIiwicHVibGljRXh0ZW5zaW9uIiwiZmluYWxFeHRlbnNpb24iLCJwcml2YXRlRXh0ZW5zaW9uIiwiZXh0ZW5zaWJsZSIsIk92ZXJyaWRlRXhlY3V0aW9uIiwiQWZ0ZXIiLCJfaUN1cnJlbnRJbmRleCIsIm9uSW5pdCIsIl9vVmlldyIsImJhc2UiLCJnZXRWaWV3Iiwic2V0TW9kZWwiLCJKU09OTW9kZWwiLCJuYXZVcEVuYWJsZWQiLCJuYXZEb3duRW5hYmxlZCIsImluaXRpYWxpemUiLCJvQmluZGluZyIsIm9Db250ZXh0IiwiZ2V0QWxsQ3VycmVudENvbnRleHRzIiwiX29MaXN0QmluZGluZyIsIl9vQ3VycmVudENvbnRleHQiLCJfdXBkYXRlQ3VycmVudEluZGV4QW5kQnV0dG9uRW5hYmxlbWVudCIsInNQYXRoIiwiZ2V0UGF0aCIsImZpbmRJbmRleCIsIm9DdXJyZW50SW5kZXhDb250ZXh0IiwiX3VwZGF0ZUN1cnJlbnRJbmRleCIsIl9oYW5kbGVCdXR0b25FbmFibGVtZW50IiwibUJ1dHRvbkVuYWJsZW1lbnRNb2RlbCIsImdldE1vZGVsIiwibGVuZ3RoIiwic2V0UHJvcGVydHkiLCJpc0luYWN0aXZlIiwidXBkYXRlQ3VycmVudENvbnRleHQiLCJpRGVsdGFJbmRleCIsImFDdXJyZW50Q29udGV4dHMiLCJpTmV3SW5kZXgiLCJvTmV3Q29udGV4dCIsImJQcmV2ZW50SWR4VXBkYXRlIiwib25CZWZvcmVDb250ZXh0VXBkYXRlIiwib25Db250ZXh0VXBkYXRlIiwib0xpc3RCaW5kaW5nIiwiaUN1cnJlbnRJbmRleCIsImlJbmRleFVwZGF0ZSIsIkNvbnRyb2xsZXJFeHRlbnNpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlBhZ2luYXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRkZWZpbmVVSTVDbGFzcyxcblx0ZXh0ZW5zaWJsZSxcblx0ZmluYWxFeHRlbnNpb24sXG5cdG1ldGhvZE92ZXJyaWRlLFxuXHRwcml2YXRlRXh0ZW5zaW9uLFxuXHRwdWJsaWNFeHRlbnNpb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgdHlwZSBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBDb250cm9sbGVyRXh0ZW5zaW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvQ29udHJvbGxlckV4dGVuc2lvblwiO1xuaW1wb3J0IE92ZXJyaWRlRXhlY3V0aW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvT3ZlcnJpZGVFeGVjdXRpb25cIjtcbmltcG9ydCB0eXBlIFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YUxpc3RCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFMaXN0QmluZGluZ1wiO1xuXG4vKipcbiAqIENvbnRyb2xsZXIgZXh0ZW5zaW9uIHByb3ZpZGluZyBob29rcyBmb3IgdGhlIG5hdmlnYXRpb24gdXNpbmcgcGFnaW5hdG9yc1xuICpcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzaW5jZSAxLjk0LjBcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGFnaW5hdG9yXCIpXG5jbGFzcyBQYWdpbmF0b3IgZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJpdmF0ZSBfb1ZpZXchOiBWaWV3O1xuXHRwcm90ZWN0ZWQgYmFzZSE6IFBhZ2VDb250cm9sbGVyO1xuXHRwcml2YXRlIF9vTGlzdEJpbmRpbmc6IGFueTtcblx0cHJpdmF0ZSBfb0N1cnJlbnRDb250ZXh0PzogQ29udGV4dDtcblx0cHJpdmF0ZSBfaUN1cnJlbnRJbmRleDogbnVtYmVyID0gLTE7XG5cdEBtZXRob2RPdmVycmlkZSgpXG5cdG9uSW5pdCgpIHtcblx0XHR0aGlzLl9vVmlldyA9IHRoaXMuYmFzZS5nZXRWaWV3KCk7XG5cdFx0dGhpcy5fb1ZpZXcuc2V0TW9kZWwoXG5cdFx0XHRuZXcgSlNPTk1vZGVsKHtcblx0XHRcdFx0bmF2VXBFbmFibGVkOiBmYWxzZSxcblx0XHRcdFx0bmF2RG93bkVuYWJsZWQ6IGZhbHNlXG5cdFx0XHR9KSxcblx0XHRcdFwicGFnaW5hdG9yXCJcblx0XHQpO1xuXHR9XG5cdC8qKlxuXHQgKiBJbml0aWF0ZXMgdGhlIHBhZ2luYXRvciBjb250cm9sLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIG9CaW5kaW5nIE9EYXRhTGlzdEJpbmRpbmcgb2JqZWN0XG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDdXJyZW50IGNvbnRleHQgd2hlcmUgdGhlIG5hdmlnYXRpb24gaXMgaW5pdGlhdGVkXG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5QYWdpbmF0b3IjaW5pdGlhbGl6ZVxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjk0LjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRpbml0aWFsaXplKG9CaW5kaW5nOiBPRGF0YUxpc3RCaW5kaW5nIHwgYW55LCBvQ29udGV4dD86IENvbnRleHQpIHtcblx0XHRpZiAob0JpbmRpbmcgJiYgb0JpbmRpbmcuZ2V0QWxsQ3VycmVudENvbnRleHRzKSB7XG5cdFx0XHR0aGlzLl9vTGlzdEJpbmRpbmcgPSBvQmluZGluZztcblx0XHR9XG5cdFx0aWYgKG9Db250ZXh0KSB7XG5cdFx0XHR0aGlzLl9vQ3VycmVudENvbnRleHQgPSBvQ29udGV4dDtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ3VycmVudEluZGV4QW5kQnV0dG9uRW5hYmxlbWVudCgpO1xuXHR9XG5cblx0X3VwZGF0ZUN1cnJlbnRJbmRleEFuZEJ1dHRvbkVuYWJsZW1lbnQoKSB7XG5cdFx0aWYgKHRoaXMuX29DdXJyZW50Q29udGV4dCAmJiB0aGlzLl9vTGlzdEJpbmRpbmcpIHtcblx0XHRcdGNvbnN0IHNQYXRoID0gdGhpcy5fb0N1cnJlbnRDb250ZXh0LmdldFBhdGgoKTtcblx0XHRcdC8vIFN0b3JpbmcgdGhlIGN1cnJlbnRJbmRleCBpbiBnbG9iYWwgdmFyaWFibGVcblx0XHRcdHRoaXMuX2lDdXJyZW50SW5kZXggPSB0aGlzLl9vTGlzdEJpbmRpbmcuZ2V0QWxsQ3VycmVudENvbnRleHRzKCkuZmluZEluZGV4KGZ1bmN0aW9uIChvQ29udGV4dDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvQ29udGV4dCAmJiBvQ29udGV4dC5nZXRQYXRoKCkgPT09IHNQYXRoO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBvQ3VycmVudEluZGV4Q29udGV4dCA9IHRoaXMuX29MaXN0QmluZGluZy5nZXRBbGxDdXJyZW50Q29udGV4dHMoKVt0aGlzLl9pQ3VycmVudEluZGV4XTtcblx0XHRcdGlmIChcblx0XHRcdFx0KCF0aGlzLl9pQ3VycmVudEluZGV4ICYmIHRoaXMuX2lDdXJyZW50SW5kZXggIT09IDApIHx8XG5cdFx0XHRcdCFvQ3VycmVudEluZGV4Q29udGV4dCB8fFxuXHRcdFx0XHR0aGlzLl9vQ3VycmVudENvbnRleHQuZ2V0UGF0aCgpICE9PSBvQ3VycmVudEluZGV4Q29udGV4dC5nZXRQYXRoKClcblx0XHRcdCkge1xuXHRcdFx0XHR0aGlzLl91cGRhdGVDdXJyZW50SW5kZXgoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5faGFuZGxlQnV0dG9uRW5hYmxlbWVudCgpO1xuXHR9XG5cblx0X2hhbmRsZUJ1dHRvbkVuYWJsZW1lbnQoKSB7XG5cdFx0Ly9FbmFibGluZyBhbmQgRGlzYWJsaW5nIHRoZSBCdXR0b25zIG9uIGNoYW5nZSBvZiB0aGUgY29udHJvbCBjb250ZXh0XG5cdFx0Y29uc3QgbUJ1dHRvbkVuYWJsZW1lbnRNb2RlbCA9IHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJwYWdpbmF0b3JcIikgYXMgSlNPTk1vZGVsO1xuXHRcdGlmICh0aGlzLl9vTGlzdEJpbmRpbmcgJiYgdGhpcy5fb0xpc3RCaW5kaW5nLmdldEFsbEN1cnJlbnRDb250ZXh0cygpLmxlbmd0aCA+IDEgJiYgdGhpcy5faUN1cnJlbnRJbmRleCA+IC0xKSB7XG5cdFx0XHRpZiAodGhpcy5faUN1cnJlbnRJbmRleCA9PT0gdGhpcy5fb0xpc3RCaW5kaW5nLmdldEFsbEN1cnJlbnRDb250ZXh0cygpLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0bUJ1dHRvbkVuYWJsZW1lbnRNb2RlbC5zZXRQcm9wZXJ0eShcIi9uYXZEb3duRW5hYmxlZFwiLCBmYWxzZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX29MaXN0QmluZGluZy5nZXRBbGxDdXJyZW50Q29udGV4dHMoKVt0aGlzLl9pQ3VycmVudEluZGV4ICsgMV0uaXNJbmFjdGl2ZSgpKSB7XG5cdFx0XHRcdC8vY2hlY2sgdGhlIG5leHQgY29udGV4dCBpcyBub3QgYW4gaW5hY3RpdmUgY29udGV4dFxuXHRcdFx0XHRtQnV0dG9uRW5hYmxlbWVudE1vZGVsLnNldFByb3BlcnR5KFwiL25hdkRvd25FbmFibGVkXCIsIGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1CdXR0b25FbmFibGVtZW50TW9kZWwuc2V0UHJvcGVydHkoXCIvbmF2RG93bkVuYWJsZWRcIiwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5faUN1cnJlbnRJbmRleCA9PT0gMCkge1xuXHRcdFx0XHRtQnV0dG9uRW5hYmxlbWVudE1vZGVsLnNldFByb3BlcnR5KFwiL25hdlVwRW5hYmxlZFwiLCBmYWxzZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX29MaXN0QmluZGluZy5nZXRBbGxDdXJyZW50Q29udGV4dHMoKVt0aGlzLl9pQ3VycmVudEluZGV4IC0gMV0uaXNJbmFjdGl2ZSgpKSB7XG5cdFx0XHRcdG1CdXR0b25FbmFibGVtZW50TW9kZWwuc2V0UHJvcGVydHkoXCIvbmF2VXBFbmFibGVkXCIsIGZhbHNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1CdXR0b25FbmFibGVtZW50TW9kZWwuc2V0UHJvcGVydHkoXCIvbmF2VXBFbmFibGVkXCIsIHRydWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBEb24ndCBzaG93IHRoZSBwYWdpbmF0b3IgYnV0dG9uc1xuXHRcdFx0Ly8gMS4gV2hlbiBubyBsaXN0YmluZGluZyBpcyBhdmFpbGFibGVcblx0XHRcdC8vIDIuIE9ubHkgJzEnIG9yICcwJyBjb250ZXh0IGV4aXN0cyBpbiB0aGUgbGlzdEJpbmRpbmdcblx0XHRcdC8vIDMuIFRoZSBjdXJyZW50IGluZGV4IGlzIC12ZSwgaS5lIHRoZSBjdXJyZW50SW5kZXggaXMgaW52YWxpZC5cblx0XHRcdG1CdXR0b25FbmFibGVtZW50TW9kZWwuc2V0UHJvcGVydHkoXCIvbmF2VXBFbmFibGVkXCIsIGZhbHNlKTtcblx0XHRcdG1CdXR0b25FbmFibGVtZW50TW9kZWwuc2V0UHJvcGVydHkoXCIvbmF2RG93bkVuYWJsZWRcIiwgZmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdF91cGRhdGVDdXJyZW50SW5kZXgoKSB7XG5cdFx0aWYgKHRoaXMuX29DdXJyZW50Q29udGV4dCAmJiB0aGlzLl9vTGlzdEJpbmRpbmcpIHtcblx0XHRcdGNvbnN0IHNQYXRoID0gdGhpcy5fb0N1cnJlbnRDb250ZXh0LmdldFBhdGgoKTtcblx0XHRcdC8vIFN0b3JpbmcgdGhlIGN1cnJlbnRJbmRleCBpbiBnbG9iYWwgdmFyaWFibGVcblx0XHRcdHRoaXMuX2lDdXJyZW50SW5kZXggPSB0aGlzLl9vTGlzdEJpbmRpbmcuZ2V0QWxsQ3VycmVudENvbnRleHRzKCkuZmluZEluZGV4KGZ1bmN0aW9uIChvQ29udGV4dDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvQ29udGV4dCAmJiBvQ29udGV4dC5nZXRQYXRoKCkgPT09IHNQYXRoO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHR1cGRhdGVDdXJyZW50Q29udGV4dChpRGVsdGFJbmRleDogYW55KSB7XG5cdFx0aWYgKCF0aGlzLl9vTGlzdEJpbmRpbmcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBhQ3VycmVudENvbnRleHRzID0gdGhpcy5fb0xpc3RCaW5kaW5nLmdldEFsbEN1cnJlbnRDb250ZXh0cygpO1xuXHRcdGNvbnN0IGlOZXdJbmRleCA9IHRoaXMuX2lDdXJyZW50SW5kZXggKyBpRGVsdGFJbmRleDtcblx0XHRjb25zdCBvTmV3Q29udGV4dCA9IGFDdXJyZW50Q29udGV4dHNbaU5ld0luZGV4XTtcblxuXHRcdGlmIChvTmV3Q29udGV4dCkge1xuXHRcdFx0Y29uc3QgYlByZXZlbnRJZHhVcGRhdGUgPSB0aGlzLm9uQmVmb3JlQ29udGV4dFVwZGF0ZSh0aGlzLl9vTGlzdEJpbmRpbmcsIHRoaXMuX2lDdXJyZW50SW5kZXgsIGlEZWx0YUluZGV4KTtcblx0XHRcdGlmICghYlByZXZlbnRJZHhVcGRhdGUpIHtcblx0XHRcdFx0dGhpcy5faUN1cnJlbnRJbmRleCA9IGlOZXdJbmRleDtcblx0XHRcdFx0dGhpcy5fb0N1cnJlbnRDb250ZXh0ID0gb05ld0NvbnRleHQ7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm9uQ29udGV4dFVwZGF0ZShvTmV3Q29udGV4dCk7XG5cdFx0fVxuXHRcdHRoaXMuX2hhbmRsZUJ1dHRvbkVuYWJsZW1lbnQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgYmVmb3JlIGNvbnRleHQgdXBkYXRlLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIG9MaXN0QmluZGluZyBPRGF0YUxpc3RCaW5kaW5nIG9iamVjdFxuXHQgKiBAcGFyYW0gaUN1cnJlbnRJbmRleCBDdXJyZW50IGluZGV4IG9mIGNvbnRleHQgaW4gbGlzdEJpbmRpbmcgZnJvbSB3aGVyZSB0aGUgbmF2aWdhdGlvbiBpcyBpbml0aWF0ZWRcblx0ICogQHBhcmFtIGlJbmRleFVwZGF0ZSBUaGUgZGVsdGEgaW5kZXggZm9yIHVwZGF0ZVxuXHQgKiBAcmV0dXJucyBgdHJ1ZWAgdG8gcHJldmVudCB0aGUgdXBkYXRlIG9mIGN1cnJlbnQgY29udGV4dC5cblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlBhZ2luYXRvciNvbkJlZm9yZUNvbnRleHRVcGRhdGVcblx0ICogQHByaXZhdGVcblx0ICovXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0b25CZWZvcmVDb250ZXh0VXBkYXRlKG9MaXN0QmluZGluZzogT0RhdGFMaXN0QmluZGluZywgaUN1cnJlbnRJbmRleDogbnVtYmVyLCBpSW5kZXhVcGRhdGU6IG51bWJlcikge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB1cGRhdGVkIGNvbnRleHQgYWZ0ZXIgdGhlIHBhZ2luYXRvciBvcGVyYXRpb24uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAcGFyYW0gb0NvbnRleHQgRmluYWwgY29udGV4dCByZXR1cm5lZCBhZnRlciB0aGUgcGFnaW5hdG9yIGFjdGlvblxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGFnaW5hdG9yI29uQ29udGV4dFVwZGF0ZVxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjk0LjBcblx0ICovXG5cdEBwcml2YXRlRXh0ZW5zaW9uKClcblx0QGV4dGVuc2libGUoT3ZlcnJpZGVFeGVjdXRpb24uQWZ0ZXIpXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0b25Db250ZXh0VXBkYXRlKG9Db250ZXh0OiBDb250ZXh0KSB7XG5cdFx0Ly9UbyBiZSBvdmVycmlkZGVuIGJ5IHRoZSBhcHBsaWNhdGlvblxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBQYWdpbmF0b3I7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFFTUEsUyxXQURMQyxjQUFjLENBQUMsNENBQUQsQyxVQU9iQyxjQUFjLEUsVUFxQmRDLGVBQWUsRSxVQUNmQyxjQUFjLEUsVUFvRWRELGVBQWUsRSxVQUNmQyxjQUFjLEUsVUFnQ2RDLGdCQUFnQixFLFVBQ2hCQyxVQUFVLENBQUNDLGlCQUFpQixDQUFDQyxLQUFuQixDLFVBZVZILGdCQUFnQixFLFdBQ2hCQyxVQUFVLENBQUNDLGlCQUFpQixDQUFDQyxLQUFuQixDOzs7Ozs7Ozs7OztZQTdJSEMsYyxHQUF5QixDQUFDLEM7Ozs7OztXQUVsQ0MsTSxHQURBLGtCQUNTO01BQ1IsS0FBS0MsTUFBTCxHQUFjLEtBQUtDLElBQUwsQ0FBVUMsT0FBVixFQUFkOztNQUNBLEtBQUtGLE1BQUwsQ0FBWUcsUUFBWixDQUNDLElBQUlDLFNBQUosQ0FBYztRQUNiQyxZQUFZLEVBQUUsS0FERDtRQUViQyxjQUFjLEVBQUU7TUFGSCxDQUFkLENBREQsRUFLQyxXQUxEO0lBT0E7SUFDRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1dBR0NDLFUsR0FGQSxvQkFFV0MsUUFGWCxFQUU2Q0MsUUFGN0MsRUFFaUU7TUFDaEUsSUFBSUQsUUFBUSxJQUFJQSxRQUFRLENBQUNFLHFCQUF6QixFQUFnRDtRQUMvQyxLQUFL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