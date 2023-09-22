/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/ObjectPath", "sap/ui/model/json/JSONModel"], function (Log, ObjectPath, JSONModel) {
  "use strict";

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * Special JSONModel that is used to store the attribute model for the building block.
   * It has specific handling for undefinedValue mapping
   */
  var AttributeModel = /*#__PURE__*/function (_JSONModel) {
    _inheritsLoose(AttributeModel, _JSONModel);

    function AttributeModel(oNode, oProps, buildingBlockDefinition) {
      var _this;

      _this = _JSONModel.call(this) || this;
      _this.oNode = oNode;
      _this.oProps = oProps;
      _this.buildingBlockDefinition = buildingBlockDefinition;
      _assertThisInitialized(_this).$$valueAsPromise = true;
      return _this;
    }

    var _proto = AttributeModel.prototype;

    _proto._getObject = function _getObject(sPath, oContext) {
      if (sPath === undefined || sPath === "") {
        if (oContext !== undefined && oContext.getPath() !== "/") {
          return this._getObject(oContext.getPath(sPath));
        }

        return this.oProps;
      }

      if (sPath === "/undefinedValue" || sPath === "undefinedValue") {
        return undefined;
      } // just return the attribute - we can't validate them, and we don't support aggregations for now


      var oValue = ObjectPath.get(sPath.replace(/\//g, "."), this.oProps);

      if (oValue !== undefined) {
        return oValue;
      } // Deal with undefined properties


      if (this.oProps.hasOwnProperty(sPath)) {
        return this.oProps[sPath];
      }

      if (sPath.indexOf(":") === -1 && sPath.indexOf("/") === -1) {
        // Gloves are off, if you have this error you forgot to define your property on your metadata but are still using it in the underlying code
        Log.error("Missing property ".concat(sPath, " on building block metadata ").concat(this.buildingBlockDefinition.name)); //throw new Error(`Missing property ${sPath} on macro metadata ${this.buildingBlockDefinition.name}`);
      }

      return this.oNode.getAttribute(sPath);
    };

    return AttributeModel;
  }(JSONModel);

  return AttributeModel;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdHRyaWJ1dGVNb2RlbCIsIm9Ob2RlIiwib1Byb3BzIiwiYnVpbGRpbmdCbG9ja0RlZmluaXRpb24iLCIkJHZhbHVlQXNQcm9taXNlIiwiX2dldE9iamVjdCIsInNQYXRoIiwib0NvbnRleHQiLCJ1bmRlZmluZWQiLCJnZXRQYXRoIiwib1ZhbHVlIiwiT2JqZWN0UGF0aCIsImdldCIsInJlcGxhY2UiLCJoYXNPd25Qcm9wZXJ0eSIsImluZGV4T2YiLCJMb2ciLCJlcnJvciIsIm5hbWUiLCJnZXRBdHRyaWJ1dGUiLCJKU09OTW9kZWwiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkF0dHJpYnV0ZU1vZGVsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IE9iamVjdFBhdGggZnJvbSBcInNhcC9iYXNlL3V0aWwvT2JqZWN0UGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBCdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9idWlsZGluZ0Jsb2Nrcy9CdWlsZGluZ0Jsb2NrXCI7XG5pbXBvcnQgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuXG4vKipcbiAqIFNwZWNpYWwgSlNPTk1vZGVsIHRoYXQgaXMgdXNlZCB0byBzdG9yZSB0aGUgYXR0cmlidXRlIG1vZGVsIGZvciB0aGUgYnVpbGRpbmcgYmxvY2suXG4gKiBJdCBoYXMgc3BlY2lmaWMgaGFuZGxpbmcgZm9yIHVuZGVmaW5lZFZhbHVlIG1hcHBpbmdcbiAqL1xuY2xhc3MgQXR0cmlidXRlTW9kZWwgZXh0ZW5kcyBKU09OTW9kZWwge1xuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHJlYWRvbmx5IG9Ob2RlOiBFbGVtZW50LFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgb1Byb3BzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgYnVpbGRpbmdCbG9ja0RlZmluaXRpb246IEJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uXG5cdCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0KHRoaXMgYXMgYW55KS4kJHZhbHVlQXNQcm9taXNlID0gdHJ1ZTtcblx0fVxuXHRfZ2V0T2JqZWN0KHNQYXRoOiBzdHJpbmcsIG9Db250ZXh0PzogQ29udGV4dCk6IGFueSB7XG5cdFx0aWYgKHNQYXRoID09PSB1bmRlZmluZWQgfHwgc1BhdGggPT09IFwiXCIpIHtcblx0XHRcdGlmIChvQ29udGV4dCAhPT0gdW5kZWZpbmVkICYmIG9Db250ZXh0LmdldFBhdGgoKSAhPT0gXCIvXCIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2dldE9iamVjdChvQ29udGV4dC5nZXRQYXRoKHNQYXRoKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5vUHJvcHM7XG5cdFx0fVxuXHRcdGlmIChzUGF0aCA9PT0gXCIvdW5kZWZpbmVkVmFsdWVcIiB8fCBzUGF0aCA9PT0gXCJ1bmRlZmluZWRWYWx1ZVwiKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHQvLyBqdXN0IHJldHVybiB0aGUgYXR0cmlidXRlIC0gd2UgY2FuJ3QgdmFsaWRhdGUgdGhlbSwgYW5kIHdlIGRvbid0IHN1cHBvcnQgYWdncmVnYXRpb25zIGZvciBub3dcblx0XHRjb25zdCBvVmFsdWUgPSBPYmplY3RQYXRoLmdldChzUGF0aC5yZXBsYWNlKC9cXC8vZywgXCIuXCIpLCB0aGlzLm9Qcm9wcyk7XG5cdFx0aWYgKG9WYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gb1ZhbHVlO1xuXHRcdH1cblx0XHQvLyBEZWFsIHdpdGggdW5kZWZpbmVkIHByb3BlcnRpZXNcblx0XHRpZiAodGhpcy5vUHJvcHMuaGFzT3duUHJvcGVydHkoc1BhdGgpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vUHJvcHNbc1BhdGhdO1xuXHRcdH1cblx0XHRpZiAoc1BhdGguaW5kZXhPZihcIjpcIikgPT09IC0xICYmIHNQYXRoLmluZGV4T2YoXCIvXCIpID09PSAtMSkge1xuXHRcdFx0Ly8gR2xvdmVzIGFyZSBvZmYsIGlmIHlvdSBoYXZlIHRoaXMgZXJyb3IgeW91IGZvcmdvdCB0byBkZWZpbmUgeW91ciBwcm9wZXJ0eSBvbiB5b3VyIG1ldGFkYXRhIGJ1dCBhcmUgc3RpbGwgdXNpbmcgaXQgaW4gdGhlIHVuZGVybHlpbmcgY29kZVxuXHRcdFx0TG9nLmVycm9yKGBNaXNzaW5nIHByb3BlcnR5ICR7c1BhdGh9IG9uIGJ1aWxkaW5nIGJsb2NrIG1ldGFkYXRhICR7dGhpcy5idWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lfWApO1xuXHRcdFx0Ly90aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgcHJvcGVydHkgJHtzUGF0aH0gb24gbWFjcm8gbWV0YWRhdGEgJHt0aGlzLmJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLm5hbWV9YCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm9Ob2RlLmdldEF0dHJpYnV0ZShzUGF0aCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXR0cmlidXRlTW9kZWw7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7RUFNQTtBQUNBO0FBQ0E7QUFDQTtNQUNNQSxjOzs7SUFDTCx3QkFDa0JDLEtBRGxCLEVBRWtCQyxNQUZsQixFQUdrQkMsdUJBSGxCLEVBSUU7TUFBQTs7TUFDRDtNQURDLE1BSGdCRixLQUdoQixHQUhnQkEsS0FHaEI7TUFBQSxNQUZnQkMsTUFFaEIsR0FGZ0JBLE1BRWhCO01BQUEsTUFEZ0JDLHVCQUNoQixHQURnQkEsdUJBQ2hCO01BRUQsOEJBQWNDLGdCQUFkLEdBQWlDLElBQWpDO01BRkM7SUFHRDs7OztXQUNEQyxVLEdBQUEsb0JBQVdDLEtBQVgsRUFBMEJDLFFBQTFCLEVBQW1EO01BQ2xELElBQUlELEtBQUssS0FBS0UsU0FBVixJQUF1QkYsS0FBSyxLQUFLLEVBQXJDLEVBQXlDO1FBQ3hDLElBQUlDLFFBQVEsS0FBS0MsU0FBYixJQUEwQkQsUUFBUSxDQUFDRSxPQUFULE9BQXVCLEdBQXJELEVBQTBEO1VBQ3pELE9BQU8sS0FBS0osVUFBTCxDQUFnQkUsUUFBUSxDQUFDRSxPQUFULENBQWlCSCxLQUFqQixDQUFoQixDQUFQO1FBQ0E7O1FBQ0QsT0FBTyxLQUFLSixNQUFaO01BQ0E7O01BQ0QsSUFBSUksS0FBSyxLQUFLLGlCQUFWLElBQStCQSxLQUFLLEtBQUssZ0JBQTdDLEVBQStEO1FBQzlELE9BQU9FLFNBQVA7TUFDQSxDQVRpRCxDQVVsRDs7O01BQ0EsSUFBTUUsTUFBTSxHQUFHQyxVQUFVLENBQUNDLEdBQVgsQ0FBZU4sS0FBSyxDQUFDTyxPQUFOLENBQWMsS0FBZCxFQUFxQixHQUFyQixDQUFmLEVBQTBDLEtBQUtYLE1BQS9DLENBQWY7O01BQ0EsSUFBSVEsTUFBTSxLQUFLRixTQUFmLEVBQTBCO1FBQ3pCLE9BQU9FLE1BQVA7TUFDQSxDQWRpRCxDQWVsRDs7O01BQ0EsSUFBSSxLQUFLUixNQUFMLENBQVlZLGNBQVosQ0FBMkJSLEtBQTNCLENBQUosRUFBdUM7UUFDdEMsT0FBTyxLQUFLSixNQUFMLENBQVlJLEtBQVosQ0FBUDtNQUNBOztNQUNELElBQUlBLEtBQUssQ0FBQ1MsT0FBTixDQUFjLEdBQWQsTUFBdUIsQ0FBQyxDQUF4QixJQUE2QlQsS0FBSyxDQUFDUyxPQUFOLENBQWMsR0FBZCxNQUF1QixDQUFDLENBQXpELEVBQTREO1FBQzNEO1FBQ0FDLEdBQUcsQ0FBQ0MsS0FBSiw0QkFBOEJYLEtBQTlCLHlDQUFrRSxLQUFLSCx1QkFBTCxDQUE2QmUsSUFBL0YsR0FGMkQsQ0FHM0Q7TUFDQTs7TUFDRCxPQUFPLEtBQUtqQixLQUFMLENBQVdrQixZQUFYLENBQXdCYixLQUF4QixDQUFQO0lBQ0EsQzs7O0lBbEMyQmMsUzs7U0FxQ2RwQixjIn0=