/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/BuildingBlock", "sap/fe/core/buildingBlocks/BuildingBlockRuntime"], function (BuildingBlock, BuildingBlockRuntime) {
  "use strict";

  var _dec, _dec2, _class, _class2, _descriptor, _templateObject;

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

  var MultipleMode = (_dec = defineBuildingBlock({
    name: "MultipleMode",
    namespace: "sap.fe.templates.ListReport.view.fragments",
    isOpen: true
  }), _dec2 = xmlAttribute({
    type: "sap.ui.model.Context"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockBase) {
    _inheritsLoose(MultipleMode, _BuildingBlockBase);

    function MultipleMode() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _BuildingBlockBase.call.apply(_BuildingBlockBase, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "converterContext", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    _exports = MultipleMode;
    var _proto = MultipleMode.prototype;

    _proto.getInnerControlsAPI = function getInnerControlsAPI() {
      var _this$converterContex;

      return ((_this$converterContex = this.converterContext) === null || _this$converterContex === void 0 ? void 0 : _this$converterContex.views.reduce(function (innerControls, view) {
        var innerControlId = view.tableControlId || view.chartControlId;

        if (innerControlId) {
          innerControls.push("".concat(innerControlId, "::").concat(view.tableControlId ? "Table" : "Chart"));
        }

        return innerControls;
      }, []).join(",")) || "";
    };

    _proto.getTemplate = function getTemplate() {
      var _this$converterContex2, _this$converterContex3, _this$converterContex4;

      return xml(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\t\t\t<fe:MultipleModeControl\n\t\t\t\txmlns=\"sap.m\"\n\t\t\t\txmlns:fe=\"sap.fe.templates.ListReport.controls\"\n\t\t\t\txmlns:core=\"sap.ui.core\"\n\t\t\t\txmlns:macro=\"sap.fe.macros\"\n\t\t\t\tinnerControls=\"", "\"\n\t\t\t\tfilterControl=\"", "\"\n\t\t\t\tshowCounts=\"", "\"\n\t\t\t\tfreezeContent=\"", "\"\n\t\t\t\tid=\"", "::Control\"\n\t\t\t>\n\t\t\t\t<IconTabBar\n\t\t\t\tcore:require=\"{\n\t\t\t\t\tMULTICONTROL: 'sap/fe/templates/ListReport/controls/MultipleModeControl'\n\t\t\t\t}\"\n\t\t\t\t\texpandable=\"false\"\n\t\t\t\t\theaderMode=\"Inline\"\n\t\t\t\t\tid=\"", "\"\n\t\t\t\t\tstretchContentHeight=\"true\"\n\t\t\t\t\tselect=\"MULTICONTROL.handleTabChange($event)\"\n\t\t\t\t>\n\t\t\t\t\t<items>\n\t\t\t\t\t", "\n\t\t\t\t\t</items>\n\t\t\t\t</IconTabBar>\n\t\t\t</fe:MultipleModeControl>"])), this.getInnerControlsAPI(), this.converterContext.filterBarId, (_this$converterContex2 = this.converterContext.multiViewsControl) === null || _this$converterContex2 === void 0 ? void 0 : _this$converterContex2.showTabCounts, !!this.converterContext.filterBarId, (_this$converterContex3 = this.converterContext.multiViewsControl) === null || _this$converterContex3 === void 0 ? void 0 : _this$converterContex3.id, (_this$converterContex4 = this.converterContext.multiViewsControl) === null || _this$converterContex4 === void 0 ? void 0 : _this$converterContex4.id, this.converterContext.views.map(function (view, viewIdx) {
        return "<template:with path=\"converterContext>views/".concat(viewIdx, "/\" var=\"view\"\n\t\t\t\t\t\t\t\t\t\ttemplate:require=\"{\n\t\t\t\t\t\t\t\t\t\t\tID: 'sap/fe/core/helpers/StableIdHelper'\n\t\t\t\t\t\t\t\t\t\t}\"\n\t\t\t\t\t\t\t\t\t\txmlns:core=\"sap.ui.core\"\n\t\t\t\t\t\t\t\t\t\txmlns:template=\"http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1\">\n\t\t\t\t\t\t\t\t<template:with path=\"view>presentation\" var=\"presentationContext\">\n\t\t\t\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\t\t\t\ttext=\"").concat(view.title, "\"\n\t\t\t\t\t\t\t\t\tkey=\"{= ID.generate([${view>tableControlId} || ${view>customTabId} || ${view>chartControlId}])}\"\n\t\t\t\t\t\t\t\t\tvisible=\"{view>visible}\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t\t\t\t<template:if test=\"{= ${view>type} === 'Custom'}\">\n\t\t\t\t\t\t\t\t\t\t\t<template:then>\n\t\t\t\t\t\t\t\t\t\t\t\t<core:Fragment fragmentName=\"sap.fe.templates.ListReport.view.fragments.CustomView\" type=\"XML\" />\n\t\t\t\t\t\t\t\t\t\t\t</template:then>\n\t\t\t\t\t\t\t\t\t\t\t<template:else>\n\t\t\t\t\t\t\t\t\t\t\t\t<MessageStrip\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext=\"{= '{= (${tabsInternal>/' + (${view>tableControlId} || ${view>chartControlId}) + '/notApplicable/title} ) }' }\"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype=\"Information\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tshowIcon=\"true\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tshowCloseButton=\"true\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tclass=\"sapUiTinyMargin\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tvisible=\"{= '{= (${tabsInternal>/' + (${view>tableControlId} || ${view>chartControlId}) + '/notApplicable/fields} || []).length>0 }' }\"\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t</MessageStrip>\n\t\t\t\t\t\t\t\t\t\t\t\t<core:Fragment fragmentName=\"sap.fe.templates.ListReport.view.fragments.CollectionVisualization\" type=\"XML\" />\n\t\t\t\t\t\t\t\t\t\t\t</template:else>\n\t\t\t\t\t\t\t\t\t\t</template:if>\n\t\t\t\t\t\t\t\t\t</content>\n\t\t\t\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t\t\t</template:with></template:with>");
      }).join(""));
    };

    return MultipleMode;
  }(BuildingBlockBase), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "converterContext", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  _exports = MultipleMode;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNdWx0aXBsZU1vZGUiLCJkZWZpbmVCdWlsZGluZ0Jsb2NrIiwibmFtZSIsIm5hbWVzcGFjZSIsImlzT3BlbiIsInhtbEF0dHJpYnV0ZSIsInR5cGUiLCJnZXRJbm5lckNvbnRyb2xzQVBJIiwiY29udmVydGVyQ29udGV4dCIsInZpZXdzIiwicmVkdWNlIiwiaW5uZXJDb250cm9scyIsInZpZXciLCJpbm5lckNvbnRyb2xJZCIsInRhYmxlQ29udHJvbElkIiwiY2hhcnRDb250cm9sSWQiLCJwdXNoIiwiam9pbiIsImdldFRlbXBsYXRlIiwieG1sIiwiZmlsdGVyQmFySWQiLCJtdWx0aVZpZXdzQ29udHJvbCIsInNob3dUYWJDb3VudHMiLCJpZCIsIm1hcCIsInZpZXdJZHgiLCJ0aXRsZSIsIkJ1aWxkaW5nQmxvY2tCYXNlIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJNdWx0aXBsZU1vZGUuZnJhZ21lbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVpbGRpbmdCbG9ja0Jhc2UsIGRlZmluZUJ1aWxkaW5nQmxvY2ssIHhtbEF0dHJpYnV0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9idWlsZGluZ0Jsb2Nrcy9CdWlsZGluZ0Jsb2NrXCI7XG5pbXBvcnQgeyB4bWwgfSBmcm9tIFwic2FwL2ZlL2NvcmUvYnVpbGRpbmdCbG9ja3MvQnVpbGRpbmdCbG9ja1J1bnRpbWVcIjtcbmltcG9ydCB0eXBlIHtcblx0TGlzdFJlcG9ydERlZmluaXRpb24sXG5cdFNpbmdsZUNoYXJ0Vmlld0RlZmluaXRpb24sXG5cdFNpbmdsZVRhYmxlVmlld0RlZmluaXRpb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvdGVtcGxhdGVzL0xpc3RSZXBvcnRDb252ZXJ0ZXJcIjtcblxuQGRlZmluZUJ1aWxkaW5nQmxvY2soeyBuYW1lOiBcIk11bHRpcGxlTW9kZVwiLCBuYW1lc3BhY2U6IFwic2FwLmZlLnRlbXBsYXRlcy5MaXN0UmVwb3J0LnZpZXcuZnJhZ21lbnRzXCIsIGlzT3BlbjogdHJ1ZSB9KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlwbGVNb2RlIGV4dGVuZHMgQnVpbGRpbmdCbG9ja0Jhc2Uge1xuXHRAeG1sQXR0cmlidXRlKHsgdHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiIH0pXG5cdGNvbnZlcnRlckNvbnRleHQhOiBMaXN0UmVwb3J0RGVmaW5pdGlvbjtcblxuXHRnZXRJbm5lckNvbnRyb2xzQVBJKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLmNvbnZlcnRlckNvbnRleHQ/LnZpZXdzXG5cdFx0XHRcdC5yZWR1Y2UoKGlubmVyQ29udHJvbHM6IHN0cmluZ1tdLCB2aWV3KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgaW5uZXJDb250cm9sSWQgPVxuXHRcdFx0XHRcdFx0KHZpZXcgYXMgU2luZ2xlVGFibGVWaWV3RGVmaW5pdGlvbikudGFibGVDb250cm9sSWQgfHwgKHZpZXcgYXMgU2luZ2xlQ2hhcnRWaWV3RGVmaW5pdGlvbikuY2hhcnRDb250cm9sSWQ7XG5cdFx0XHRcdFx0aWYgKGlubmVyQ29udHJvbElkKSB7XG5cdFx0XHRcdFx0XHRpbm5lckNvbnRyb2xzLnB1c2goYCR7aW5uZXJDb250cm9sSWR9Ojokeyh2aWV3IGFzIFNpbmdsZVRhYmxlVmlld0RlZmluaXRpb24pLnRhYmxlQ29udHJvbElkID8gXCJUYWJsZVwiIDogXCJDaGFydFwifWApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gaW5uZXJDb250cm9scztcblx0XHRcdFx0fSwgW10pXG5cdFx0XHRcdC5qb2luKFwiLFwiKSB8fCBcIlwiXG5cdFx0KTtcblx0fVxuXG5cdGdldFRlbXBsYXRlKCkge1xuXHRcdHJldHVybiB4bWxgXG5cdFx0XHQ8ZmU6TXVsdGlwbGVNb2RlQ29udHJvbFxuXHRcdFx0XHR4bWxucz1cInNhcC5tXCJcblx0XHRcdFx0eG1sbnM6ZmU9XCJzYXAuZmUudGVtcGxhdGVzLkxpc3RSZXBvcnQuY29udHJvbHNcIlxuXHRcdFx0XHR4bWxuczpjb3JlPVwic2FwLnVpLmNvcmVcIlxuXHRcdFx0XHR4bWxuczptYWNybz1cInNhcC5mZS5tYWNyb3NcIlxuXHRcdFx0XHRpbm5lckNvbnRyb2xzPVwiJHt0aGlzLmdldElubmVyQ29udHJvbHNBUEkoKX1cIlxuXHRcdFx0XHRmaWx0ZXJDb250cm9sPVwiJHt0aGlzLmNvbnZlcnRlckNvbnRleHQuZmlsdGVyQmFySWR9XCJcblx0XHRcdFx0c2hvd0NvdW50cz1cIiR7dGhpcy5jb252ZXJ0ZXJDb250ZXh0Lm11bHRpVmlld3NDb250cm9sPy5zaG93VGFiQ291bnRzfVwiXG5cdFx0XHRcdGZyZWV6ZUNvbnRlbnQ9XCIkeyEhdGhpcy5jb252ZXJ0ZXJDb250ZXh0LmZpbHRlckJhcklkfVwiXG5cdFx0XHRcdGlkPVwiJHt0aGlzLmNvbnZlcnRlckNvbnRleHQubXVsdGlWaWV3c0NvbnRyb2w/LmlkfTo6Q29udHJvbFwiXG5cdFx0XHQ+XG5cdFx0XHRcdDxJY29uVGFiQmFyXG5cdFx0XHRcdGNvcmU6cmVxdWlyZT1cIntcblx0XHRcdFx0XHRNVUxUSUNPTlRST0w6ICdzYXAvZmUvdGVtcGxhdGVzL0xpc3RSZXBvcnQvY29udHJvbHMvTXVsdGlwbGVNb2RlQ29udHJvbCdcblx0XHRcdFx0fVwiXG5cdFx0XHRcdFx0ZXhwYW5kYWJsZT1cImZhbHNlXCJcblx0XHRcdFx0XHRoZWFkZXJNb2RlPVwiSW5saW5lXCJcblx0XHRcdFx0XHRpZD1cIiR7dGhpcy5jb252ZXJ0ZXJDb250ZXh0Lm11bHRpVmlld3NDb250cm9sPy5pZH1cIlxuXHRcdFx0XHRcdHN0cmV0Y2hDb250ZW50SGVpZ2h0PVwidHJ1ZVwiXG5cdFx0XHRcdFx0c2VsZWN0PVwiTVVMVElDT05UUk9MLmhhbmRsZVRhYkNoYW5nZSgkZXZlbnQpXCJcblx0XHRcdFx0PlxuXHRcdFx0XHRcdDxpdGVtcz5cblx0XHRcdFx0XHQke3RoaXMuY29udmVydGVyQ29udGV4dC52aWV3c1xuXHRcdFx0XHRcdFx0Lm1hcCgodmlldywgdmlld0lkeCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYDx0ZW1wbGF0ZTp3aXRoIHBhdGg9XCJjb252ZXJ0ZXJDb250ZXh0PnZpZXdzLyR7dmlld0lkeH0vXCIgdmFyPVwidmlld1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRlbXBsYXRlOnJlcXVpcmU9XCJ7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SUQ6ICdzYXAvZmUvY29yZS9oZWxwZXJzL1N0YWJsZUlkSGVscGVyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0eG1sbnM6Y29yZT1cInNhcC51aS5jb3JlXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0eG1sbnM6dGVtcGxhdGU9XCJodHRwOi8vc2NoZW1hcy5zYXAuY29tL3NhcHVpNS9leHRlbnNpb24vc2FwLnVpLmNvcmUudGVtcGxhdGUvMVwiPlxuXHRcdFx0XHRcdFx0XHRcdDx0ZW1wbGF0ZTp3aXRoIHBhdGg9XCJ2aWV3PnByZXNlbnRhdGlvblwiIHZhcj1cInByZXNlbnRhdGlvbkNvbnRleHRcIj5cblx0XHRcdFx0XHRcdFx0XHQ8SWNvblRhYkZpbHRlclxuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dD1cIiR7dmlldy50aXRsZX1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5PVwiez0gSUQuZ2VuZXJhdGUoW1xcJHt2aWV3PnRhYmxlQ29udHJvbElkfSB8fCBcXCR7dmlldz5jdXN0b21UYWJJZH0gfHwgXFwke3ZpZXc+Y2hhcnRDb250cm9sSWR9XSl9XCJcblx0XHRcdFx0XHRcdFx0XHRcdHZpc2libGU9XCJ7dmlldz52aXNpYmxlfVwiXG5cdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGNvbnRlbnQ+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDx0ZW1wbGF0ZTppZiB0ZXN0PVwiez0gXFwke3ZpZXc+dHlwZX0gPT09ICdDdXN0b20nfVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDx0ZW1wbGF0ZTp0aGVuPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGNvcmU6RnJhZ21lbnQgZnJhZ21lbnROYW1lPVwic2FwLmZlLnRlbXBsYXRlcy5MaXN0UmVwb3J0LnZpZXcuZnJhZ21lbnRzLkN1c3RvbVZpZXdcIiB0eXBlPVwiWE1MXCIgLz5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L3RlbXBsYXRlOnRoZW4+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHRlbXBsYXRlOmVsc2U+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8TWVzc2FnZVN0cmlwXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRleHQ9XCJ7PSAnez0gKFxcJHt0YWJzSW50ZXJuYWw+LycgKyAoXFwke3ZpZXc+dGFibGVDb250cm9sSWR9IHx8IFxcJHt2aWV3PmNoYXJ0Q29udHJvbElkfSkgKyAnL25vdEFwcGxpY2FibGUvdGl0bGV9ICkgfScgfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU9XCJJbmZvcm1hdGlvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNob3dJY29uPVwidHJ1ZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNob3dDbG9zZUJ1dHRvbj1cInRydWVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cInNhcFVpVGlueU1hcmdpblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZpc2libGU9XCJ7PSAnez0gKFxcJHt0YWJzSW50ZXJuYWw+LycgKyAoXFwke3ZpZXc+dGFibGVDb250cm9sSWR9IHx8IFxcJHt2aWV3PmNoYXJ0Q29udHJvbElkfSkgKyAnL25vdEFwcGxpY2FibGUvZmllbGRzfSB8fCBbXSkubGVuZ3RoPjAgfScgfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L01lc3NhZ2VTdHJpcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxjb3JlOkZyYWdtZW50IGZyYWdtZW50TmFtZT1cInNhcC5mZS50ZW1wbGF0ZXMuTGlzdFJlcG9ydC52aWV3LmZyYWdtZW50cy5Db2xsZWN0aW9uVmlzdWFsaXphdGlvblwiIHR5cGU9XCJYTUxcIiAvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvdGVtcGxhdGU6ZWxzZT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC90ZW1wbGF0ZTppZj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvY29udGVudD5cblx0XHRcdFx0XHRcdFx0XHQ8L0ljb25UYWJGaWx0ZXI+XG5cdFx0XHRcdFx0XHRcdDwvdGVtcGxhdGU6d2l0aD48L3RlbXBsYXRlOndpdGg+YDtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuam9pbihcIlwiKX1cblx0XHRcdFx0XHQ8L2l0ZW1zPlxuXHRcdFx0XHQ8L0ljb25UYWJCYXI+XG5cdFx0XHQ8L2ZlOk11bHRpcGxlTW9kZUNvbnRyb2w+YDtcblx0fVxufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNxQkEsWSxXQURwQkMsbUJBQW1CLENBQUM7SUFBRUMsSUFBSSxFQUFFLGNBQVI7SUFBd0JDLFNBQVMsRUFBRSw0Q0FBbkM7SUFBaUZDLE1BQU0sRUFBRTtFQUF6RixDQUFELEMsVUFFbEJDLFlBQVksQ0FBQztJQUFFQyxJQUFJLEVBQUU7RUFBUixDQUFELEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBR2JDLG1CLEdBQUEsK0JBQXNCO01BQUE7O01BQ3JCLE9BQ0MsK0JBQUtDLGdCQUFMLGdGQUF1QkMsS0FBdkIsQ0FDRUMsTUFERixDQUNTLFVBQUNDLGFBQUQsRUFBMEJDLElBQTFCLEVBQW1DO1FBQzFDLElBQU1DLGNBQWMsR0FDbEJELElBQUQsQ0FBb0NFLGNBQXBDLElBQXVERixJQUFELENBQW9DRyxjQUQzRjs7UUFFQSxJQUFJRixjQUFKLEVBQW9CO1VBQ25CRixhQUFhLENBQUNLLElBQWQsV0FBc0JILGNBQXRCLGVBQTBDRCxJQUFELENBQW9DRSxjQUFwQyxHQUFxRCxPQUFyRCxHQUErRCxPQUF4RztRQUNBOztRQUNELE9BQU9ILGFBQVA7TUFDQSxDQVJGLEVBUUksRUFSSixFQVNFTSxJQVRGLENBU08sR0FUUCxNQVNlLEVBVmhCO0lBWUEsQzs7V0FFREMsVyxHQUFBLHVCQUFjO01BQUE7O01BQ2IsT0FBT0MsR0FBUCw4MkJBTW1CLEtBQUtaLG1CQUFMLEVBTm5CLEVBT21CLEtBQUtDLGdCQUFMLENBQXNCWSxXQVB6Qyw0QkFRZ0IsS0FBS1osZ0JBQUwsQ0FBc0JhLGlCQVJ0QywyREFRZ0IsdUJBQXlDQyxhQVJ6RCxFQVNtQixDQUFDLENBQUMsS0FBS2QsZ0JBQUwsQ0FBc0JZLFdBVDNDLDRCQVVRLEtBQUtaLGdCQUFMLENBQXNCYSxpQkFWOUIsMkRBVVEsdUJBQXlDRSxFQVZqRCw0QkFrQlMsS0FBS2YsZ0JBQUwsQ0FBc0JhLGlCQWxCL0IsMkRBa0JTLHVCQUF5Q0UsRUFsQmxELEVBdUJLLEtBQUtmLGdCQUFMLENBQXNCQyxLQUF0QixDQUNBZSxHQURBLENBQ0ksVUFBQ1osSUFBRCxFQUFPYSxPQUFQLEVBQW1CO1FBQ3ZCLDhEQUFzREEsT0FBdEQsMmNBUVViLElBQUksQ0FBQ2MsS0FSZjtNQWlDQSxDQW5DQSxFQW9DQVQsSUFwQ0EsQ0FvQ0ssRUFwQ0wsQ0F2Qkw7SUErREEsQzs7O0lBbkZ3Q1UsaUIifQ==