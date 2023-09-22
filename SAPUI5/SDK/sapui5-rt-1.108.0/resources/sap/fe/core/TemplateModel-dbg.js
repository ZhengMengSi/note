/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/ui/base/Object", "sap/ui/model/json/JSONModel"], function (ClassSupport, BaseObject, JSONModel) {
  "use strict";

  var _dec, _class;

  var defineUI5Class = ClassSupport.defineUI5Class;

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var TemplateModel = (_dec = defineUI5Class("sap.fe.core.TemplateModel"), _dec(_class = /*#__PURE__*/function (_BaseObject) {
    _inheritsLoose(TemplateModel, _BaseObject);

    function TemplateModel(pageConfig, oMetaModel) {
      var _this;

      _this = _BaseObject.call(this) || this;
      _this.oMetaModel = oMetaModel;
      _this.oConfigModel = new JSONModel(); // don't limit aggregation bindings

      _this.oConfigModel.setSizeLimit(Number.MAX_VALUE);

      _this.bConfigLoaded = false; // eslint-disable-next-line @typescript-eslint/no-this-alias

      var that = _assertThisInitialized(_this);

      if (typeof pageConfig === "function") {
        var fnGetObject = _this.oConfigModel._getObject.bind(_this.oConfigModel);

        _this.oConfigModel._getObject = function (sPath, oContext) {
          if (!that.bConfigLoaded) {
            this.setData(pageConfig());
            that.bConfigLoaded = true;
          }

          return fnGetObject(sPath, oContext);
        };
      } else {
        _this.oConfigModel.setData(pageConfig);
      }

      _this.fnCreateMetaBindingContext = _this.oMetaModel.createBindingContext.bind(_this.oMetaModel);
      _this.fnCreateConfigBindingContext = _this.oConfigModel.createBindingContext.bind(_this.oConfigModel);
      _this.oConfigModel.createBindingContext = _this.createBindingContext.bind(_assertThisInitialized(_this));
      return _this.oConfigModel || _assertThisInitialized(_this);
    }

    var _proto = TemplateModel.prototype;

    _proto.createBindingContext = function createBindingContext(sPath, oContext, mParameters, fnCallBack) {
      var _oBindingContext;

      var oBindingContext;
      var bNoResolve = mParameters && mParameters.noResolve;
      oBindingContext = this.fnCreateConfigBindingContext(sPath, oContext, mParameters, fnCallBack);
      var sResolvedPath = !bNoResolve && ((_oBindingContext = oBindingContext) === null || _oBindingContext === void 0 ? void 0 : _oBindingContext.getObject());

      if (sResolvedPath && typeof sResolvedPath === "string") {
        oBindingContext = this.fnCreateMetaBindingContext(sResolvedPath, oContext, mParameters, fnCallBack);
      }

      return oBindingContext;
    };

    _proto.destroy = function destroy() {
      this.oConfigModel.destroy();
      JSONModel.prototype.destroy.apply(this);
    };

    return TemplateModel;
  }(BaseObject)) || _class);
  return TemplateModel;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUZW1wbGF0ZU1vZGVsIiwiZGVmaW5lVUk1Q2xhc3MiLCJwYWdlQ29uZmlnIiwib01ldGFNb2RlbCIsIm9Db25maWdNb2RlbCIsIkpTT05Nb2RlbCIsInNldFNpemVMaW1pdCIsIk51bWJlciIsIk1BWF9WQUxVRSIsImJDb25maWdMb2FkZWQiLCJ0aGF0IiwiZm5HZXRPYmplY3QiLCJfZ2V0T2JqZWN0IiwiYmluZCIsInNQYXRoIiwib0NvbnRleHQiLCJzZXREYXRhIiwiZm5DcmVhdGVNZXRhQmluZGluZ0NvbnRleHQiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsImZuQ3JlYXRlQ29uZmlnQmluZGluZ0NvbnRleHQiLCJtUGFyYW1ldGVycyIsImZuQ2FsbEJhY2siLCJvQmluZGluZ0NvbnRleHQiLCJiTm9SZXNvbHZlIiwibm9SZXNvbHZlIiwic1Jlc29sdmVkUGF0aCIsImdldE9iamVjdCIsImRlc3Ryb3kiLCJwcm90b3R5cGUiLCJhcHBseSIsIkJhc2VPYmplY3QiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlRlbXBsYXRlTW9kZWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBCYXNlT2JqZWN0IGZyb20gXCJzYXAvdWkvYmFzZS9PYmplY3RcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5UZW1wbGF0ZU1vZGVsXCIpXG5jbGFzcyBUZW1wbGF0ZU1vZGVsIGV4dGVuZHMgQmFzZU9iamVjdCB7XG5cdHB1YmxpYyBvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbDtcblx0cHVibGljIG9Db25maWdNb2RlbDogYW55O1xuXHRwdWJsaWMgYkNvbmZpZ0xvYWRlZDogYm9vbGVhbjtcblx0cHVibGljIGZuQ3JlYXRlTWV0YUJpbmRpbmdDb250ZXh0OiBGdW5jdGlvbjtcblx0cHVibGljIGZuQ3JlYXRlQ29uZmlnQmluZGluZ0NvbnRleHQ6IEZ1bmN0aW9uO1xuXG5cdGNvbnN0cnVjdG9yKHBhZ2VDb25maWc6IGFueSwgb01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMub01ldGFNb2RlbCA9IG9NZXRhTW9kZWw7XG5cdFx0dGhpcy5vQ29uZmlnTW9kZWwgPSBuZXcgSlNPTk1vZGVsKCk7XG5cdFx0Ly8gZG9uJ3QgbGltaXQgYWdncmVnYXRpb24gYmluZGluZ3Ncblx0XHR0aGlzLm9Db25maWdNb2RlbC5zZXRTaXplTGltaXQoTnVtYmVyLk1BWF9WQUxVRSk7XG5cdFx0dGhpcy5iQ29uZmlnTG9hZGVkID0gZmFsc2U7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cblx0XHRpZiAodHlwZW9mIHBhZ2VDb25maWcgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgZm5HZXRPYmplY3QgPSB0aGlzLm9Db25maWdNb2RlbC5fZ2V0T2JqZWN0LmJpbmQodGhpcy5vQ29uZmlnTW9kZWwpO1xuXHRcdFx0dGhpcy5vQ29uZmlnTW9kZWwuX2dldE9iamVjdCA9IGZ1bmN0aW9uIChzUGF0aDogYW55LCBvQ29udGV4dDogYW55KSB7XG5cdFx0XHRcdGlmICghdGhhdC5iQ29uZmlnTG9hZGVkKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXREYXRhKHBhZ2VDb25maWcoKSk7XG5cdFx0XHRcdFx0dGhhdC5iQ29uZmlnTG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZm5HZXRPYmplY3Qoc1BhdGgsIG9Db250ZXh0KTtcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub0NvbmZpZ01vZGVsLnNldERhdGEocGFnZUNvbmZpZyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5mbkNyZWF0ZU1ldGFCaW5kaW5nQ29udGV4dCA9IHRoaXMub01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dC5iaW5kKHRoaXMub01ldGFNb2RlbCk7XG5cdFx0dGhpcy5mbkNyZWF0ZUNvbmZpZ0JpbmRpbmdDb250ZXh0ID0gdGhpcy5vQ29uZmlnTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQuYmluZCh0aGlzLm9Db25maWdNb2RlbCk7XG5cblx0XHR0aGlzLm9Db25maWdNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dCA9IHRoaXMuY3JlYXRlQmluZGluZ0NvbnRleHQuYmluZCh0aGlzKTtcblx0XHRyZXR1cm4gdGhpcy5vQ29uZmlnTW9kZWw7XG5cdH1cblxuXHRjcmVhdGVCaW5kaW5nQ29udGV4dChzUGF0aDogYW55LCBvQ29udGV4dD86IGFueSwgbVBhcmFtZXRlcnM/OiBhbnksIGZuQ2FsbEJhY2s/OiBhbnkpIHtcblx0XHRsZXQgb0JpbmRpbmdDb250ZXh0O1xuXHRcdGNvbnN0IGJOb1Jlc29sdmUgPSBtUGFyYW1ldGVycyAmJiBtUGFyYW1ldGVycy5ub1Jlc29sdmU7XG5cblx0XHRvQmluZGluZ0NvbnRleHQgPSB0aGlzLmZuQ3JlYXRlQ29uZmlnQmluZGluZ0NvbnRleHQoc1BhdGgsIG9Db250ZXh0LCBtUGFyYW1ldGVycywgZm5DYWxsQmFjayk7XG5cdFx0Y29uc3Qgc1Jlc29sdmVkUGF0aCA9ICFiTm9SZXNvbHZlICYmIG9CaW5kaW5nQ29udGV4dD8uZ2V0T2JqZWN0KCk7XG5cdFx0aWYgKHNSZXNvbHZlZFBhdGggJiYgdHlwZW9mIHNSZXNvbHZlZFBhdGggPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdG9CaW5kaW5nQ29udGV4dCA9IHRoaXMuZm5DcmVhdGVNZXRhQmluZGluZ0NvbnRleHQoc1Jlc29sdmVkUGF0aCwgb0NvbnRleHQsIG1QYXJhbWV0ZXJzLCBmbkNhbGxCYWNrKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb0JpbmRpbmdDb250ZXh0O1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLm9Db25maWdNb2RlbC5kZXN0cm95KCk7XG5cdFx0SlNPTk1vZGVsLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlTW9kZWw7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7O01BTU1BLGEsV0FETEMsY0FBYyxDQUFDLDJCQUFELEM7OztJQVFkLHVCQUFZQyxVQUFaLEVBQTZCQyxVQUE3QixFQUF5RDtNQUFBOztNQUN4RDtNQUNBLE1BQUtBLFVBQUwsR0FBa0JBLFVBQWxCO01BQ0EsTUFBS0MsWUFBTCxHQUFvQixJQUFJQyxTQUFKLEVBQXBCLENBSHdELENBSXhEOztNQUNBLE1BQUtELFlBQUwsQ0FBa0JFLFlBQWxCLENBQStCQyxNQUFNLENBQUNDLFNBQXRDOztNQUNBLE1BQUtDLGFBQUwsR0FBcUIsS0FBckIsQ0FOd0QsQ0FPeEQ7O01BQ0EsSUFBTUMsSUFBSSxnQ0FBVjs7TUFFQSxJQUFJLE9BQU9SLFVBQVAsS0FBc0IsVUFBMUIsRUFBc0M7UUFDckMsSUFBTVMsV0FBVyxHQUFHLE1BQUtQLFlBQUwsQ0FBa0JRLFVBQWxCLENBQTZCQyxJQUE3QixDQUFrQyxNQUFLVCxZQUF2QyxDQUFwQjs7UUFDQSxNQUFLQSxZQUFMLENBQWtCUSxVQUFsQixHQUErQixVQUFVRSxLQUFWLEVBQXNCQyxRQUF0QixFQUFxQztVQUNuRSxJQUFJLENBQUNMLElBQUksQ0FBQ0QsYUFBVixFQUF5QjtZQUN4QixLQUFLTyxPQUFMLENBQWFkLFVBQVUsRUFBdkI7WUFDQVEsSUFBSSxDQUFDRCxhQUFMLEdBQXFCLElBQXJCO1VBQ0E7O1VBQ0QsT0FBT0UsV0FBVyxDQUFDRyxLQUFELEVBQVFDLFFBQVIsQ0FBbEI7UUFDQSxDQU5EO01BT0EsQ0FURCxNQVNPO1FBQ04sTUFBS1gsWUFBTCxDQUFrQlksT0FBbEIsQ0FBMEJkLFVBQTFCO01BQ0E7O01BRUQsTUFBS2UsMEJBQUwsR0FBa0MsTUFBS2QsVUFBTCxDQUFnQmUsb0JBQWhCLENBQXFDTCxJQUFyQyxDQUEwQyxNQUFLVixVQUEvQyxDQUFsQztNQUNBLE1BQUtnQiw0QkFBTCxHQUFvQyxNQUFLZixZQUFMLENBQWtCYyxvQkFBbEIsQ0FBdUNMLElBQXZDLENBQTRDLE1BQUtULFlBQWpELENBQXBDO01BRUEsTUFBS0EsWUFBTCxDQUFrQmMsb0JBQWxCLEdBQXlDLE1BQUtBLG9CQUFMLENBQTBCTCxJQUExQiwrQkFBekM7TUFDQSxPQUFPLE1BQUtULFlBQVo7SUFDQTs7OztXQUVEYyxvQixHQUFBLDhCQUFxQkosS0FBckIsRUFBaUNDLFFBQWpDLEVBQWlESyxXQUFqRCxFQUFvRUMsVUFBcEUsRUFBc0Y7TUFBQTs7TUFDckYsSUFBSUMsZUFBSjtNQUNBLElBQU1DLFVBQVUsR0FBR0gsV0FBVyxJQUFJQSxXQUFXLENBQUNJLFNBQTlDO01BRUFGLGVBQWUsR0FBRyxLQUFLSCw0QkFBTCxDQUFrQ0wsS0FBbEMsRUFBeUNDLFFBQXpDLEVBQW1ESyxXQUFuRCxFQUFnRUMsVUFBaEUsQ0FBbEI7TUFDQSxJQUFNSSxhQUFhLEdBQUcsQ0FBQ0YsVUFBRCx5QkFBZUQsZUFBZixxREFBZSxpQkFBaUJJLFNBQWpCLEVBQWYsQ0FBdEI7O01BQ0EsSUFBSUQsYUFBYSxJQUFJLE9BQU9BLGFBQVAsS0FBeUIsUUFBOUMsRUFBd0Q7UUFDdkRILGVBQWUsR0FBRyxLQUFLTCwwQkFBTCxDQUFnQ1EsYUFBaEMsRUFBK0NWLFFBQS9DLEVBQXlESyxXQUF6RCxFQUFzRUMsVUFBdEUsQ0FBbEI7TUFDQTs7TUFFRCxPQUFPQyxlQUFQO0lBQ0EsQzs7V0FFREssTyxHQUFBLG1CQUFVO01BQ1QsS0FBS3ZCLFlBQUwsQ0FBa0J1QixPQUFsQjtNQUNBdEIsU0FBUyxDQUFDdUIsU0FBVixDQUFvQkQsT0FBcEIsQ0FBNEJFLEtBQTVCLENBQWtDLElBQWxDO0lBQ0EsQzs7O0lBckQwQkMsVTtTQXdEYjlCLGEifQ==