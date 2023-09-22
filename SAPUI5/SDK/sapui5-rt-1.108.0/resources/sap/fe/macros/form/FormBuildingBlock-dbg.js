/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/BuildingBlock", "sap/fe/core/buildingBlocks/BuildingBlockRuntime", "sap/fe/core/converters/controls/Common/Form", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/helpers/ID", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/macros/form/FormHelper", "sap/ui/model/odata/v4/AnnotationHelper"], function (BuildingBlock, BuildingBlockRuntime, Form, BindingHelper, ID, MetaModelConverter, BindingToolkit, DataModelPathHelper, FormHelper, AnnotationHelper) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

  var _exports = {};
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var ifElse = BindingToolkit.ifElse;
  var equal = BindingToolkit.equal;
  var compileExpression = BindingToolkit.compileExpression;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var getFormContainerID = ID.getFormContainerID;
  var UI = BindingHelper.UI;
  var createFormDefinition = Form.createFormDefinition;
  var xml = BuildingBlockRuntime.xml;
  var xmlEvent = BuildingBlock.xmlEvent;
  var xmlAttribute = BuildingBlock.xmlAttribute;
  var xmlAggregation = BuildingBlock.xmlAggregation;
  var defineBuildingBlock = BuildingBlock.defineBuildingBlock;
  var BuildingBlockBase = BuildingBlock.BuildingBlockBase;

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var FormBuildingBlock = (
  /**
   * Building block for creating a Form based on the metadata provided by OData V4.
   * <br>
   * It is designed to work based on a FieldGroup annotation but can also work if you provide a ReferenceFacet or a CollectionFacet
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Form id="MyForm" metaPath="@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.Form
   * @public
   */
  _dec = defineBuildingBlock({
    name: "Form",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros"
  }), _dec2 = xmlAttribute({
    type: "string",
    isPublic: true,
    required: true
  }), _dec3 = xmlAttribute({
    type: "sap.ui.model.Context",
    required: true,
    isPublic: true,
    $kind: ["EntitySet", "NavigationProperty", "EntityType"]
  }), _dec4 = xmlAttribute({
    type: "sap.ui.model.Context",
    isPublic: true,
    required: true
  }), _dec5 = xmlAttribute({
    type: "sap.ui.model.Context"
  }), _dec6 = xmlAttribute({
    type: "boolean"
  }), _dec7 = xmlAttribute({
    type: "boolean",
    defaultValue: true
  }), _dec8 = xmlAttribute({
    type: "string",
    isPublic: true
  }), _dec9 = xmlAttribute({
    type: "sap.ui.core.TitleLevel",
    isPublic: true,
    defaultValue: "Auto"
  }), _dec10 = xmlAttribute({
    type: "string"
  }), _dec11 = xmlAttribute({
    type: "string",
    defaultValue: "true"
  }), _dec12 = xmlEvent(), _dec13 = xmlAggregation({
    type: "sap.fe.macros.form.FormElement",
    isPublic: true,
    slot: "formElements",
    isDefault: true
  }), _dec14 = xmlAttribute({
    type: "object",
    isPublic: true
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_BuildingBlockBase) {
    _inheritsLoose(FormBuildingBlock, _BuildingBlockBase);

    /**
     * The manifest defined form containers to be shown in the action area of the table
     */

    /**
     * Control the rendering of the form container labels
     */

    /**
     * Toggle Preview: Part of Preview / Preview via 'Show More' Button
     */
    // Other public properties or overrides

    /**
     * Defines the "aria-level" of the form title, titles of internally used form containers are nested subsequently
     */

    /**
     * 	If set to false, the Form is not rendered.
     */
    // Independent from the form title, can be a bit confusing in standalone usage at is not showing anything by default
    // Just proxied down to the Field may need to see if needed or not

    /**
     * Defines the layout to be used within the form.
     * It defaults to the ColumnLayout, but you can also use a ResponsiveGridLayout.
     * All the properties of the ResponsiveGridLayout can be added to the configuration.
     */
    function FormBuildingBlock(oProps, configuration, mSettings) {
      var _this;

      _this = _BuildingBlockBase.call(this, oProps, configuration, mSettings) || this;

      _initializerDefineProperty(_this, "id", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "contextPath", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "metaPath", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "formContainers", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "useFormContainerLabels", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "partOfPreview", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "title", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "titleLevel", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "displayMode", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "isVisible", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "onChange", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "formElements", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "layout", _descriptor13, _assertThisInitialized(_this));

      if (_this.metaPath && _this.contextPath && (_this.formContainers === undefined || _this.formContainers === null)) {
        var oContextObjectPath = getInvolvedDataModelObjects(_this.metaPath, _this.contextPath);
        var mExtraSettings = {};
        var oFacetDefinition = oContextObjectPath.targetObject;
        var hasFieldGroup = false;

        if (oFacetDefinition && oFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.FieldGroupType") {
          // Wrap the facet in a fake Facet annotation
          hasFieldGroup = true;
          oFacetDefinition = {
            $Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
            Label: oFacetDefinition.Label,
            Target: {
              $target: oFacetDefinition,
              fullyQualifiedName: oFacetDefinition.fullyQualifiedName,
              path: "",
              term: "",
              type: "AnnotationPath",
              value: getContextRelativeTargetObjectPath(oContextObjectPath)
            },
            annotations: {},
            fullyQualifiedName: oFacetDefinition.fullyQualifiedName
          };
          mExtraSettings[oFacetDefinition.Target.value] = {
            fields: _this.formElements
          };
        }

        var oConverterContext = _this.getConverterContext(oContextObjectPath, _this.contextPath, mSettings, mExtraSettings);

        var oFormDefinition = createFormDefinition(oFacetDefinition, _this.isVisible, oConverterContext);

        if (hasFieldGroup) {
          oFormDefinition.formContainers[0].annotationPath = _this.metaPath.getPath();
        }

        _this.formContainers = oFormDefinition.formContainers;
        _this.useFormContainerLabels = oFormDefinition.useFormContainerLabels;
        _this.facetType = oFacetDefinition && oFacetDefinition.$Type;
      } else {
        var _this$metaPath$getObj;

        _this.facetType = (_this$metaPath$getObj = _this.metaPath.getObject()) === null || _this$metaPath$getObj === void 0 ? void 0 : _this$metaPath$getObj.$Type;
      }

      if (!_this.isPublic) {
        _this._apiId = _this.createId("Form");
        _this._contentId = _this.id;
      } else {
        _this._apiId = _this.id;
        _this._contentId = "".concat(_this.id, "-content");
      } // if displayMode === true -> _editable = false
      // if displayMode === false -> _editable = true
      //  => if displayMode === {myBindingValue} -> _editable = {myBindingValue} === true ? true : false
      // if DisplayMode === undefined -> _editable = {ui>/isEditable}


      if (_this.displayMode !== undefined) {
        _this._editable = compileExpression(ifElse(equal(resolveBindingString(_this.displayMode, "boolean"), false), true, false));
      } else {
        _this._editable = compileExpression(UI.IsEditable);
      }

      return _this;
    }

    _exports = FormBuildingBlock;
    var _proto = FormBuildingBlock.prototype;

    _proto.getDataFieldCollection = function getDataFieldCollection(formContainer, facetContext) {
      var facet = facetContext.getObject();
      var navigationPath;
      var idPart;

      if (facet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
        navigationPath = AnnotationHelper.getNavigationPath(facet.Target.$AnnotationPath);
        idPart = {
          Facet: facet
        };
      } else {
        var contextPathPath = this.contextPath.getPath();
        var facetPath = facetContext.getPath();

        if (facetPath.startsWith(contextPathPath)) {
          facetPath = facetPath.substring(contextPathPath.length);
        }

        navigationPath = AnnotationHelper.getNavigationPath(facetPath);
        idPart = facetPath;
      }

      var titleLevel = FormHelper.getFormContainerTitleLevel(this.title, this.titleLevel);
      var title = this.useFormContainerLabels && facet ? AnnotationHelper.label(facet, {
        context: facetContext
      }) : "";
      var id = this.id ? getFormContainerID(idPart) : undefined;
      return xml(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\t\t\t\t\t<macro:FormContainer\n\t\t\t\t\txmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t", "\n\t\t\t\t\ttitle=\"", "\"\n\t\t\t\t\ttitleLevel=\"", "\"\n\t\t\t\t\tcontextPath=\"", "\"\n\t\t\t\t\tmetaPath=\"", "\"\n\t\t\t\t\tdataFieldCollection=\"", "\"\n\t\t\t\t\tnavigationPath=\"", "\"\n\t\t\t\t\tvisible=\"", "\"\n\t\t\t\t\tdisplayMode=\"", "\"\n\t\t\t\t\tonChange=\"", "\"\n\t\t\t\t\tactions=\"", "\"\n\t\t\t\t>\n\t\t\t\t<macro:formElements>\n\t\t\t\t\t<slot name=\"formElements\" />\n\t\t\t\t</macro:formElements>\n\t\t\t</macro:FormContainer>"])), this.attr("id", id), title, titleLevel, navigationPath ? formContainer.entitySet : this.contextPath, facetContext, formContainer.formElements, navigationPath, formContainer.isVisible, this.displayMode, this.onChange, formContainer.actions);
    };

    _proto.getFormContainers = function getFormContainers() {
      var _this2 = this;

      if (this.formContainers.length === 0) {
        return "";
      }

      if (this.facetType.indexOf("com.sap.vocabularies.UI.v1.CollectionFacet") >= 0) {
        return this.formContainers.map(function (formContainer, formContainerIdx) {
          if (formContainer.isVisible) {
            var facetContext = _this2.contextPath.getModel().createBindingContext(formContainer.annotationPath, _this2.contextPath);

            var facet = facetContext.getObject();

            if (facet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && FormHelper.isReferenceFacetPartOfPreview(facet, _this2.partOfPreview)) {
              if (facet.Target.$AnnotationPath.$Type === "com.sap.vocabularies.Communication.v1.AddressType") {
                return xml(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<template:with path=\"formContainers>", "\" var=\"formContainer\">\n\t\t\t\t\t\t\t\t\t\t\t<template:with path=\"formContainers>", "/annotationPath\" var=\"facet\">\n\t\t\t\t\t\t\t\t\t\t\t\t<core:Fragment fragmentName=\"sap.fe.macros.form.AddressSection\" type=\"XML\" />\n\t\t\t\t\t\t\t\t\t\t\t</template:with>\n\t\t\t\t\t\t\t\t\t\t</template:with>"])), formContainerIdx, formContainerIdx);
              }

              return _this2.getDataFieldCollection(formContainer, facetContext);
            }
          }

          return "";
        });
      } else if (this.facetType === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
        return this.formContainers.map(function (formContainer) {
          if (formContainer.isVisible) {
            var facetContext = _this2.contextPath.getModel().createBindingContext(formContainer.annotationPath, _this2.contextPath);

            return _this2.getDataFieldCollection(formContainer, facetContext);
          } else {
            return "";
          }
        });
      }

      return xml(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral([""])));
    }
    /**
     * Create the proper layout information based on the `layout` property defined externally.
     *
     * @returns The layout information for the xml.
     */
    ;

    _proto.getLayoutInformation = function getLayoutInformation() {
      switch (this.layout.type) {
        case "ResponsiveGridLayout":
          return xml(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["<f:ResponsiveGridLayout adjustLabelSpan=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tbreakpointL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tbreakpointM=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tbreakpointXL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tcolumnsL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tcolumnsM=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tcolumnsXL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\temptySpanL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\temptySpanM=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\temptySpanS=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\temptySpanXL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tlabelSpanL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tlabelSpanM=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tlabelSpanS=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tlabelSpanXL=\"", "\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize=\"", "\" />"])), this.layout.adjustLabelSpan, this.layout.breakpointL, this.layout.breakpointM, this.layout.breakpointXL, this.layout.columnsL, this.layout.columnsM, this.layout.columnsXL, this.layout.emptySpanL, this.layout.emptySpanM, this.layout.emptySpanS, this.layout.emptySpanXL, this.layout.labelSpanL, this.layout.labelSpanM, this.layout.labelSpanS, this.layout.labelSpanXL, this.layout.singleContainerFullSize);

        case "ColumnLayout":
        default:
          return xml(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<f:ColumnLayout\n\t\t\t\t\t\t\t\tcolumnsM=\"", "\"\n\t\t\t\t\t\t\t\tcolumnsL=\"", "\"\n\t\t\t\t\t\t\t\tcolumnsXL=\"", "\"\n\t\t\t\t\t\t\t\tlabelCellsLarge=\"", "\"\n\t\t\t\t\t\t\t\temptyCellsLarge=\"", "\" />"])), this.layout.columnsM, this.layout.columnsL, this.layout.columnsXL, this.layout.labelCellsLarge, this.layout.emptyCellsLarge);
      }
    };

    _proto.getTemplate = function getTemplate() {
      var onChangeStr = this.onChange && this.onChange.replace("{", "\\{").replace("}", "\\}") || "";
      var metaPathPath = this.metaPath.getPath();
      var contextPathPath = this.contextPath.getPath();

      if (!this.isVisible) {
        return xml(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral([""])));
      } else {
        return xml(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["<macro:FormAPI xmlns:macro=\"sap.fe.macros.form\"\n\t\t\t\t\txmlns:macrodata=\"http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1\"\n\t\t\t\t\txmlns:f=\"sap.ui.layout.form\"\n\t\t\t\t\txmlns:fl=\"sap.ui.fl\"\n\t\t\t\t\tid=\"", "\"\n\t\t\t\t\tmetaPath=\"", "\"\n\t\t\t\t\tcontextPath=\"", "\">\n\t\t\t\t<f:Form\n\t\t\t\t\tfl:delegate='{\n\t\t\t\t\t\t\"name\": \"sap/fe/macros/form/FormDelegate\",\n\t\t\t\t\t\t\"delegateType\": \"complete\"\n\t\t\t\t\t}'\n\t\t\t\t\tid=\"", "\"\n\t\t\t\t\teditable=\"", "\"\n\t\t\t\t\tmacrodata:entitySet=\"{contextPath>@sapui.name}\"\n\t\t\t\t\tvisible=\"", "\"\n\t\t\t\t\tclass=\"sapUxAPObjectPageSubSectionAlignContent\"\n\t\t\t\t\tmacrodata:navigationPath=\"", "\"\n\t\t\t\t\tmacrodata:onChange=\"", "\"\n\t\t\t\t>\n\t\t\t\t\t", "\n\t\t\t\t\t<f:layout>\n\t\t\t\t\t", "\n\n\t\t\t\t\t</f:layout>\n\t\t\t\t\t<f:formContainers>\n\t\t\t\t\t\t", "\n\t\t\t\t\t</f:formContainers>\n\t\t\t\t</f:Form>\n\t\t\t</macro:FormAPI>"])), this._apiId, metaPathPath, contextPathPath, this._contentId, this._editable, this.isVisible, contextPathPath, onChangeStr, this.addConditionally(this.title !== undefined, xml(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["<f:title>\n\t\t\t\t\t\t\t<core:Title level=\"", "\" text=\"", "\" />\n\t\t\t\t\t\t</f:title>"])), this.titleLevel, this.title)), this.getLayoutInformation(), this.getFormContainers());
      }
    };

    return FormBuildingBlock;
  }(BuildingBlockBase), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "formContainers", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "useFormContainerLabels", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "partOfPreview", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "titleLevel", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "displayMode", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "isVisible", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "onChange", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "formElements", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "layout", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return {
        type: "ColumnLayout",
        columnsM: 2,
        columnsXL: 6,
        columnsL: 3,
        labelCellsLarge: 12
      };
    }
  })), _class2)) || _class);
  _exports = FormBuildingBlock;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGb3JtQnVpbGRpbmdCbG9jayIsImRlZmluZUJ1aWxkaW5nQmxvY2siLCJuYW1lIiwibmFtZXNwYWNlIiwicHVibGljTmFtZXNwYWNlIiwieG1sQXR0cmlidXRlIiwidHlwZSIsImlzUHVibGljIiwicmVxdWlyZWQiLCIka2luZCIsImRlZmF1bHRWYWx1ZSIsInhtbEV2ZW50IiwieG1sQWdncmVnYXRpb24iLCJzbG90IiwiaXNEZWZhdWx0Iiwib1Byb3BzIiwiY29uZmlndXJhdGlvbiIsIm1TZXR0aW5ncyIsIm1ldGFQYXRoIiwiY29udGV4dFBhdGgiLCJmb3JtQ29udGFpbmVycyIsInVuZGVmaW5lZCIsIm9Db250ZXh0T2JqZWN0UGF0aCIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsIm1FeHRyYVNldHRpbmdzIiwib0ZhY2V0RGVmaW5pdGlvbiIsInRhcmdldE9iamVjdCIsImhhc0ZpZWxkR3JvdXAiLCIkVHlwZSIsIkxhYmVsIiwiVGFyZ2V0IiwiJHRhcmdldCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInBhdGgiLCJ0ZXJtIiwidmFsdWUiLCJnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoIiwiYW5ub3RhdGlvbnMiLCJmaWVsZHMiLCJmb3JtRWxlbWVudHMiLCJvQ29udmVydGVyQ29udGV4dCIsImdldENvbnZlcnRlckNvbnRleHQiLCJvRm9ybURlZmluaXRpb24iLCJjcmVhdGVGb3JtRGVmaW5pdGlvbiIsImlzVmlzaWJsZSIsImFubm90YXRpb25QYXRoIiwiZ2V0UGF0aCIsInVzZUZvcm1Db250YWluZXJMYWJlbHMiLCJmYWNldFR5cGUiLCJnZXRPYmplY3QiLCJfYXBpSWQiLCJjcmVhdGVJZCIsIl9jb250ZW50SWQiLCJpZCIsImRpc3BsYXlNb2RlIiwiX2VkaXRhYmxlIiwiY29tcGlsZUV4cHJlc3Npb24iLCJpZkVsc2UiLCJlcXVhbCIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiVUkiLCJJc0VkaXRhYmxlIiwiZ2V0RGF0YUZpZWxkQ29sbGVjdGlvbiIsImZvcm1Db250YWluZXIiLCJmYWNldENvbnRleHQiLCJmYWNldCIsIm5hdmlnYXRpb25QYXRoIiwiaWRQYXJ0IiwiQW5ub3RhdGlvbkhlbHBlciIsImdldE5hdmlnYXRpb25QYXRoIiwiJEFubm90YXRpb25QYXRoIiwiRmFjZXQiLCJjb250ZXh0UGF0aFBhdGgiLCJmYWNldFBhdGgiLCJzdGFydHNXaXRoIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwidGl0bGVMZXZlbCIsIkZvcm1IZWxwZXIiLCJnZXRGb3JtQ29udGFpbmVyVGl0bGVMZXZlbCIsInRpdGxlIiwibGFiZWwiLCJjb250ZXh0IiwiZ2V0Rm9ybUNvbnRhaW5lcklEIiwieG1sIiwiYXR0ciIsImVudGl0eVNldCIsIm9uQ2hhbmdlIiwiYWN0aW9ucyIsImdldEZvcm1Db250YWluZXJzIiwiaW5kZXhPZiIsIm1hcCIsImZvcm1Db250YWluZXJJZHgiLCJnZXRNb2RlbCIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwiaXNSZWZlcmVuY2VGYWNldFBhcnRPZlByZXZpZXciLCJwYXJ0T2ZQcmV2aWV3IiwiZ2V0TGF5b3V0SW5mb3JtYXRpb24iLCJsYXlvdXQiLCJhZGp1c3RMYWJlbFNwYW4iLCJicmVha3BvaW50TCIsImJyZWFrcG9pbnRNIiwiYnJlYWtwb2ludFhMIiwiY29sdW1uc0wiLCJjb2x1bW5zTSIsImNvbHVtbnNYTCIsImVtcHR5U3BhbkwiLCJlbXB0eVNwYW5NIiwiZW1wdHlTcGFuUyIsImVtcHR5U3BhblhMIiwibGFiZWxTcGFuTCIsImxhYmVsU3Bhbk0iLCJsYWJlbFNwYW5TIiwibGFiZWxTcGFuWEwiLCJzaW5nbGVDb250YWluZXJGdWxsU2l6ZSIsImxhYmVsQ2VsbHNMYXJnZSIsImVtcHR5Q2VsbHNMYXJnZSIsImdldFRlbXBsYXRlIiwib25DaGFuZ2VTdHIiLCJyZXBsYWNlIiwibWV0YVBhdGhQYXRoIiwiYWRkQ29uZGl0aW9uYWxseSIsIkJ1aWxkaW5nQmxvY2tCYXNlIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJGb3JtQnVpbGRpbmdCbG9jay50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tdW5pY2F0aW9uQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tdW5pY2F0aW9uXCI7XG5pbXBvcnQgeyBVSUFubm90YXRpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB7IEJ1aWxkaW5nQmxvY2tCYXNlLCBkZWZpbmVCdWlsZGluZ0Jsb2NrLCB4bWxBZ2dyZWdhdGlvbiwgeG1sQXR0cmlidXRlLCB4bWxFdmVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9idWlsZGluZ0Jsb2Nrcy9CdWlsZGluZ0Jsb2NrXCI7XG5pbXBvcnQgeyB4bWwgfSBmcm9tIFwic2FwL2ZlL2NvcmUvYnVpbGRpbmdCbG9ja3MvQnVpbGRpbmdCbG9ja1J1bnRpbWVcIjtcbmltcG9ydCB0eXBlIHsgRm9ybUNvbnRhaW5lciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9Gb3JtXCI7XG5pbXBvcnQgeyBjcmVhdGVGb3JtRGVmaW5pdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9Gb3JtXCI7XG5pbXBvcnQgeyBVSSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQmluZGluZ0hlbHBlclwiO1xuaW1wb3J0IHsgZ2V0Rm9ybUNvbnRhaW5lcklEIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9JRFwiO1xuaW1wb3J0IHsgZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5pbXBvcnQgdHlwZSB7IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBlcXVhbCwgaWZFbHNlLCByZXNvbHZlQmluZGluZ1N0cmluZyB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgdHlwZSB7IFByb3BlcnRpZXNPZiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHsgZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCBGb3JtSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL2Zvcm0vRm9ybUhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBUaXRsZUxldmVsIH0gZnJvbSBcInNhcC91aS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCB7ICRDb2x1bW5MYXlvdXRTZXR0aW5ncyB9IGZyb20gXCJzYXAvdWkvbGF5b3V0L2Zvcm0vQ29sdW1uTGF5b3V0XCI7XG5pbXBvcnQgdHlwZSB7ICRSZXNwb25zaXZlR3JpZExheW91dFNldHRpbmdzIH0gZnJvbSBcInNhcC91aS9sYXlvdXQvZm9ybS9SZXNwb25zaXZlR3JpZExheW91dFwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBBbm5vdGF0aW9uSGVscGVyIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQW5ub3RhdGlvbkhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBWNENvbnRleHQgfSBmcm9tIFwidHlwZXMvZXh0ZW5zaW9uX3R5cGVzXCI7XG5cbnR5cGUgQ29sdW1uTGF5b3V0ID0gJENvbHVtbkxheW91dFNldHRpbmdzICYge1xuXHR0eXBlOiBcIkNvbHVtbkxheW91dFwiO1xufTtcbnR5cGUgUmVzcG9uc2l2ZUdyaWRMYXlvdXQgPSAkUmVzcG9uc2l2ZUdyaWRMYXlvdXRTZXR0aW5ncyAmIHtcblx0dHlwZTogXCJSZXNwb25zaXZlR3JpZExheW91dFwiO1xufTtcbnR5cGUgRm9ybUxheW91dEluZm9ybWF0aW9uID0gQ29sdW1uTGF5b3V0IHwgUmVzcG9uc2l2ZUdyaWRMYXlvdXQ7XG5cbi8qKlxuICogQnVpbGRpbmcgYmxvY2sgZm9yIGNyZWF0aW5nIGEgRm9ybSBiYXNlZCBvbiB0aGUgbWV0YWRhdGEgcHJvdmlkZWQgYnkgT0RhdGEgVjQuXG4gKiA8YnI+XG4gKiBJdCBpcyBkZXNpZ25lZCB0byB3b3JrIGJhc2VkIG9uIGEgRmllbGRHcm91cCBhbm5vdGF0aW9uIGJ1dCBjYW4gYWxzbyB3b3JrIGlmIHlvdSBwcm92aWRlIGEgUmVmZXJlbmNlRmFjZXQgb3IgYSBDb2xsZWN0aW9uRmFjZXRcbiAqXG4gKlxuICogVXNhZ2UgZXhhbXBsZTpcbiAqIDxwcmU+XG4gKiAmbHQ7bWFjcm86Rm9ybSBpZD1cIk15Rm9ybVwiIG1ldGFQYXRoPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXAjR2VuZXJhbEluZm9ybWF0aW9uXCIgLyZndDtcbiAqIDwvcHJlPlxuICpcbiAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLkZvcm1cbiAqIEBwdWJsaWNcbiAqL1xuQGRlZmluZUJ1aWxkaW5nQmxvY2soe1xuXHRuYW1lOiBcIkZvcm1cIixcblx0bmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIixcblx0cHVibGljTmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3NcIlxufSlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm1CdWlsZGluZ0Jsb2NrIGV4dGVuZHMgQnVpbGRpbmdCbG9ja0Jhc2Uge1xuXHRAeG1sQXR0cmlidXRlKHsgdHlwZTogXCJzdHJpbmdcIiwgaXNQdWJsaWM6IHRydWUsIHJlcXVpcmVkOiB0cnVlIH0pXG5cdGlkITogc3RyaW5nO1xuXG5cdEB4bWxBdHRyaWJ1dGUoe1xuXHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRpc1B1YmxpYzogdHJ1ZSxcblx0XHQka2luZDogW1wiRW50aXR5U2V0XCIsIFwiTmF2aWdhdGlvblByb3BlcnR5XCIsIFwiRW50aXR5VHlwZVwiXVxuXHR9KVxuXHRjb250ZXh0UGF0aCE6IFY0Q29udGV4dDtcblxuXHRAeG1sQXR0cmlidXRlKHtcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0aXNQdWJsaWM6IHRydWUsXG5cdFx0cmVxdWlyZWQ6IHRydWVcblx0fSlcblx0bWV0YVBhdGghOiBWNENvbnRleHQ7XG5cblx0LyoqXG5cdCAqIFRoZSBtYW5pZmVzdCBkZWZpbmVkIGZvcm0gY29udGFpbmVycyB0byBiZSBzaG93biBpbiB0aGUgYWN0aW9uIGFyZWEgb2YgdGhlIHRhYmxlXG5cdCAqL1xuXHRAeG1sQXR0cmlidXRlKHsgdHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiIH0pXG5cdGZvcm1Db250YWluZXJzPzogRm9ybUNvbnRhaW5lcltdO1xuXG5cdC8qKlxuXHQgKiBDb250cm9sIHRoZSByZW5kZXJpbmcgb2YgdGhlIGZvcm0gY29udGFpbmVyIGxhYmVsc1xuXHQgKi9cblx0QHhtbEF0dHJpYnV0ZSh7IHR5cGU6IFwiYm9vbGVhblwiIH0pXG5cdHVzZUZvcm1Db250YWluZXJMYWJlbHMhOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgUHJldmlldzogUGFydCBvZiBQcmV2aWV3IC8gUHJldmlldyB2aWEgJ1Nob3cgTW9yZScgQnV0dG9uXG5cdCAqL1xuXHRAeG1sQXR0cmlidXRlKHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSB9KVxuXHRwYXJ0T2ZQcmV2aWV3ITogYm9vbGVhbjtcblxuXHQvLyBPdGhlciBwdWJsaWMgcHJvcGVydGllcyBvciBvdmVycmlkZXNcblx0QHhtbEF0dHJpYnV0ZSh7IHR5cGU6IFwic3RyaW5nXCIsIGlzUHVibGljOiB0cnVlIH0pXG5cdHRpdGxlPzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSBcImFyaWEtbGV2ZWxcIiBvZiB0aGUgZm9ybSB0aXRsZSwgdGl0bGVzIG9mIGludGVybmFsbHkgdXNlZCBmb3JtIGNvbnRhaW5lcnMgYXJlIG5lc3RlZCBzdWJzZXF1ZW50bHlcblx0ICovXG5cdEB4bWxBdHRyaWJ1dGUoeyB0eXBlOiBcInNhcC51aS5jb3JlLlRpdGxlTGV2ZWxcIiwgaXNQdWJsaWM6IHRydWUsIGRlZmF1bHRWYWx1ZTogXCJBdXRvXCIgfSlcblx0dGl0bGVMZXZlbD86IFRpdGxlTGV2ZWw7XG5cblx0QHhtbEF0dHJpYnV0ZSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0ZGlzcGxheU1vZGUhOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblxuXHQvKipcblx0ICogXHRJZiBzZXQgdG8gZmFsc2UsIHRoZSBGb3JtIGlzIG5vdCByZW5kZXJlZC5cblx0ICovXG5cdEB4bWxBdHRyaWJ1dGUoeyB0eXBlOiBcInN0cmluZ1wiLCBkZWZhdWx0VmFsdWU6IFwidHJ1ZVwiIH0pXG5cdGlzVmlzaWJsZSE6IHN0cmluZztcblx0Ly8gSW5kZXBlbmRlbnQgZnJvbSB0aGUgZm9ybSB0aXRsZSwgY2FuIGJlIGEgYml0IGNvbmZ1c2luZyBpbiBzdGFuZGFsb25lIHVzYWdlIGF0IGlzIG5vdCBzaG93aW5nIGFueXRoaW5nIGJ5IGRlZmF1bHRcblxuXHQvLyBKdXN0IHByb3hpZWQgZG93biB0byB0aGUgRmllbGQgbWF5IG5lZWQgdG8gc2VlIGlmIG5lZWRlZCBvciBub3Rcblx0QHhtbEV2ZW50KClcblx0b25DaGFuZ2U6IHN0cmluZyA9IFwiXCI7XG5cblx0QHhtbEFnZ3JlZ2F0aW9uKHsgdHlwZTogXCJzYXAuZmUubWFjcm9zLmZvcm0uRm9ybUVsZW1lbnRcIiwgaXNQdWJsaWM6IHRydWUsIHNsb3Q6IFwiZm9ybUVsZW1lbnRzXCIsIGlzRGVmYXVsdDogdHJ1ZSB9KVxuXHRmb3JtRWxlbWVudHM6IGFueTtcblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgbGF5b3V0IHRvIGJlIHVzZWQgd2l0aGluIHRoZSBmb3JtLlxuXHQgKiBJdCBkZWZhdWx0cyB0byB0aGUgQ29sdW1uTGF5b3V0LCBidXQgeW91IGNhbiBhbHNvIHVzZSBhIFJlc3BvbnNpdmVHcmlkTGF5b3V0LlxuXHQgKiBBbGwgdGhlIHByb3BlcnRpZXMgb2YgdGhlIFJlc3BvbnNpdmVHcmlkTGF5b3V0IGNhbiBiZSBhZGRlZCB0byB0aGUgY29uZmlndXJhdGlvbi5cblx0ICovXG5cdEB4bWxBdHRyaWJ1dGUoeyB0eXBlOiBcIm9iamVjdFwiLCBpc1B1YmxpYzogdHJ1ZSB9KVxuXHRsYXlvdXQ6IEZvcm1MYXlvdXRJbmZvcm1hdGlvbiA9IHsgdHlwZTogXCJDb2x1bW5MYXlvdXRcIiwgY29sdW1uc006IDIsIGNvbHVtbnNYTDogNiwgY29sdW1uc0w6IDMsIGxhYmVsQ2VsbHNMYXJnZTogMTIgfTtcblxuXHQvLyBVc2VmdWwgZm9yIG91ciBkeW5hbWljIHRoaW5nIGJ1dCBhbHNvIGRlcGVuZHMgb24gdGhlIG1ldGFkYXRhIC0+IG1ha2Ugc3VyZSB0aGlzIGlzIHRha2VuIGludG8gYWNjb3VudFxuXHRfZWRpdGFibGU6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXG5cdF9hcGlJZDogc3RyaW5nO1xuXHRfY29udGVudElkOiBzdHJpbmc7XG5cdGZhY2V0VHlwZTogc3RyaW5nO1xuXHRjb25zdHJ1Y3RvcihvUHJvcHM6IFByb3BlcnRpZXNPZjxGb3JtQnVpbGRpbmdCbG9jaz4sIGNvbmZpZ3VyYXRpb246IGFueSwgbVNldHRpbmdzOiBhbnkpIHtcblx0XHRzdXBlcihvUHJvcHMsIGNvbmZpZ3VyYXRpb24sIG1TZXR0aW5ncyk7XG5cdFx0aWYgKHRoaXMubWV0YVBhdGggJiYgdGhpcy5jb250ZXh0UGF0aCAmJiAodGhpcy5mb3JtQ29udGFpbmVycyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZm9ybUNvbnRhaW5lcnMgPT09IG51bGwpKSB7XG5cdFx0XHRjb25zdCBvQ29udGV4dE9iamVjdFBhdGggPSBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHModGhpcy5tZXRhUGF0aCwgdGhpcy5jb250ZXh0UGF0aCk7XG5cdFx0XHRjb25zdCBtRXh0cmFTZXR0aW5nczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdFx0bGV0IG9GYWNldERlZmluaXRpb24gPSBvQ29udGV4dE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRcdFx0bGV0IGhhc0ZpZWxkR3JvdXAgPSBmYWxzZTtcblx0XHRcdGlmIChvRmFjZXREZWZpbml0aW9uICYmIG9GYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkZpZWxkR3JvdXBUeXBlKSB7XG5cdFx0XHRcdC8vIFdyYXAgdGhlIGZhY2V0IGluIGEgZmFrZSBGYWNldCBhbm5vdGF0aW9uXG5cdFx0XHRcdGhhc0ZpZWxkR3JvdXAgPSB0cnVlO1xuXHRcdFx0XHRvRmFjZXREZWZpbml0aW9uID0ge1xuXHRcdFx0XHRcdCRUeXBlOiBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlZmVyZW5jZUZhY2V0XCIsXG5cdFx0XHRcdFx0TGFiZWw6IG9GYWNldERlZmluaXRpb24uTGFiZWwsXG5cdFx0XHRcdFx0VGFyZ2V0OiB7XG5cdFx0XHRcdFx0XHQkdGFyZ2V0OiBvRmFjZXREZWZpbml0aW9uLFxuXHRcdFx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBvRmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdFx0XHRcdHBhdGg6IFwiXCIsXG5cdFx0XHRcdFx0XHR0ZXJtOiBcIlwiLFxuXHRcdFx0XHRcdFx0dHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob0NvbnRleHRPYmplY3RQYXRoKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnM6IHt9LFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogb0ZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWVcblx0XHRcdFx0fTtcblx0XHRcdFx0bUV4dHJhU2V0dGluZ3Nbb0ZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWVdID0geyBmaWVsZHM6IHRoaXMuZm9ybUVsZW1lbnRzIH07XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9Db252ZXJ0ZXJDb250ZXh0ID0gdGhpcy5nZXRDb252ZXJ0ZXJDb250ZXh0KG9Db250ZXh0T2JqZWN0UGF0aCwgdGhpcy5jb250ZXh0UGF0aCwgbVNldHRpbmdzLCBtRXh0cmFTZXR0aW5ncyk7XG5cdFx0XHRjb25zdCBvRm9ybURlZmluaXRpb24gPSBjcmVhdGVGb3JtRGVmaW5pdGlvbihvRmFjZXREZWZpbml0aW9uLCB0aGlzLmlzVmlzaWJsZSwgb0NvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0aWYgKGhhc0ZpZWxkR3JvdXApIHtcblx0XHRcdFx0b0Zvcm1EZWZpbml0aW9uLmZvcm1Db250YWluZXJzWzBdLmFubm90YXRpb25QYXRoID0gdGhpcy5tZXRhUGF0aC5nZXRQYXRoKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZvcm1Db250YWluZXJzID0gb0Zvcm1EZWZpbml0aW9uLmZvcm1Db250YWluZXJzO1xuXHRcdFx0dGhpcy51c2VGb3JtQ29udGFpbmVyTGFiZWxzID0gb0Zvcm1EZWZpbml0aW9uLnVzZUZvcm1Db250YWluZXJMYWJlbHM7XG5cdFx0XHR0aGlzLmZhY2V0VHlwZSA9IG9GYWNldERlZmluaXRpb24gJiYgb0ZhY2V0RGVmaW5pdGlvbi4kVHlwZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5mYWNldFR5cGUgPSB0aGlzLm1ldGFQYXRoLmdldE9iamVjdCgpPy4kVHlwZTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNQdWJsaWMpIHtcblx0XHRcdHRoaXMuX2FwaUlkID0gdGhpcy5jcmVhdGVJZChcIkZvcm1cIikhO1xuXHRcdFx0dGhpcy5fY29udGVudElkID0gdGhpcy5pZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fYXBpSWQgPSB0aGlzLmlkO1xuXHRcdFx0dGhpcy5fY29udGVudElkID0gYCR7dGhpcy5pZH0tY29udGVudGA7XG5cdFx0fVxuXHRcdC8vIGlmIGRpc3BsYXlNb2RlID09PSB0cnVlIC0+IF9lZGl0YWJsZSA9IGZhbHNlXG5cdFx0Ly8gaWYgZGlzcGxheU1vZGUgPT09IGZhbHNlIC0+IF9lZGl0YWJsZSA9IHRydWVcblx0XHQvLyAgPT4gaWYgZGlzcGxheU1vZGUgPT09IHtteUJpbmRpbmdWYWx1ZX0gLT4gX2VkaXRhYmxlID0ge215QmluZGluZ1ZhbHVlfSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuXHRcdC8vIGlmIERpc3BsYXlNb2RlID09PSB1bmRlZmluZWQgLT4gX2VkaXRhYmxlID0ge3VpPi9pc0VkaXRhYmxlfVxuXHRcdGlmICh0aGlzLmRpc3BsYXlNb2RlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2VkaXRhYmxlID0gY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKGVxdWFsKHJlc29sdmVCaW5kaW5nU3RyaW5nKHRoaXMuZGlzcGxheU1vZGUsIFwiYm9vbGVhblwiKSwgZmFsc2UpLCB0cnVlLCBmYWxzZSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9lZGl0YWJsZSA9IGNvbXBpbGVFeHByZXNzaW9uKFVJLklzRWRpdGFibGUpO1xuXHRcdH1cblx0fVxuXG5cdGdldERhdGFGaWVsZENvbGxlY3Rpb24oZm9ybUNvbnRhaW5lcjogRm9ybUNvbnRhaW5lciwgZmFjZXRDb250ZXh0OiBDb250ZXh0KSB7XG5cdFx0Y29uc3QgZmFjZXQgPSBmYWNldENvbnRleHQuZ2V0T2JqZWN0KCkgYXMgYW55O1xuXHRcdGxldCBuYXZpZ2F0aW9uUGF0aDtcblx0XHRsZXQgaWRQYXJ0O1xuXHRcdGlmIChmYWNldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQpIHtcblx0XHRcdG5hdmlnYXRpb25QYXRoID0gQW5ub3RhdGlvbkhlbHBlci5nZXROYXZpZ2F0aW9uUGF0aChmYWNldC5UYXJnZXQuJEFubm90YXRpb25QYXRoKTtcblx0XHRcdGlkUGFydCA9IHsgRmFjZXQ6IGZhY2V0IH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGNvbnRleHRQYXRoUGF0aCA9IHRoaXMuY29udGV4dFBhdGguZ2V0UGF0aCgpO1xuXHRcdFx0bGV0IGZhY2V0UGF0aCA9IGZhY2V0Q29udGV4dC5nZXRQYXRoKCk7XG5cdFx0XHRpZiAoZmFjZXRQYXRoLnN0YXJ0c1dpdGgoY29udGV4dFBhdGhQYXRoKSkge1xuXHRcdFx0XHRmYWNldFBhdGggPSBmYWNldFBhdGguc3Vic3RyaW5nKGNvbnRleHRQYXRoUGF0aC5sZW5ndGgpO1xuXHRcdFx0fVxuXHRcdFx0bmF2aWdhdGlvblBhdGggPSBBbm5vdGF0aW9uSGVscGVyLmdldE5hdmlnYXRpb25QYXRoKGZhY2V0UGF0aCk7XG5cdFx0XHRpZFBhcnQgPSBmYWNldFBhdGg7XG5cdFx0fVxuXHRcdGNvbnN0IHRpdGxlTGV2ZWwgPSBGb3JtSGVscGVyLmdldEZvcm1Db250YWluZXJUaXRsZUxldmVsKHRoaXMudGl0bGUsIHRoaXMudGl0bGVMZXZlbCk7XG5cdFx0Y29uc3QgdGl0bGUgPSB0aGlzLnVzZUZvcm1Db250YWluZXJMYWJlbHMgJiYgZmFjZXQgPyBBbm5vdGF0aW9uSGVscGVyLmxhYmVsKGZhY2V0LCB7IGNvbnRleHQ6IGZhY2V0Q29udGV4dCB9KSA6IFwiXCI7XG5cdFx0Y29uc3QgaWQgPSB0aGlzLmlkID8gZ2V0Rm9ybUNvbnRhaW5lcklEKGlkUGFydCkgOiB1bmRlZmluZWQ7XG5cblx0XHRyZXR1cm4geG1sYFxuXHRcdFx0XHRcdDxtYWNybzpGb3JtQ29udGFpbmVyXG5cdFx0XHRcdFx0eG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zXCJcblx0XHRcdFx0XHQke3RoaXMuYXR0cihcImlkXCIsIGlkKX1cblx0XHRcdFx0XHR0aXRsZT1cIiR7dGl0bGV9XCJcblx0XHRcdFx0XHR0aXRsZUxldmVsPVwiJHt0aXRsZUxldmVsfVwiXG5cdFx0XHRcdFx0Y29udGV4dFBhdGg9XCIke25hdmlnYXRpb25QYXRoID8gZm9ybUNvbnRhaW5lci5lbnRpdHlTZXQgOiB0aGlzLmNvbnRleHRQYXRofVwiXG5cdFx0XHRcdFx0bWV0YVBhdGg9XCIke2ZhY2V0Q29udGV4dH1cIlxuXHRcdFx0XHRcdGRhdGFGaWVsZENvbGxlY3Rpb249XCIke2Zvcm1Db250YWluZXIuZm9ybUVsZW1lbnRzfVwiXG5cdFx0XHRcdFx0bmF2aWdhdGlvblBhdGg9XCIke25hdmlnYXRpb25QYXRofVwiXG5cdFx0XHRcdFx0dmlzaWJsZT1cIiR7Zm9ybUNvbnRhaW5lci5pc1Zpc2libGV9XCJcblx0XHRcdFx0XHRkaXNwbGF5TW9kZT1cIiR7dGhpcy5kaXNwbGF5TW9kZX1cIlxuXHRcdFx0XHRcdG9uQ2hhbmdlPVwiJHt0aGlzLm9uQ2hhbmdlfVwiXG5cdFx0XHRcdFx0YWN0aW9ucz1cIiR7Zm9ybUNvbnRhaW5lci5hY3Rpb25zfVwiXG5cdFx0XHRcdD5cblx0XHRcdFx0PG1hY3JvOmZvcm1FbGVtZW50cz5cblx0XHRcdFx0XHQ8c2xvdCBuYW1lPVwiZm9ybUVsZW1lbnRzXCIgLz5cblx0XHRcdFx0PC9tYWNybzpmb3JtRWxlbWVudHM+XG5cdFx0XHQ8L21hY3JvOkZvcm1Db250YWluZXI+YDtcblx0fVxuXG5cdGdldEZvcm1Db250YWluZXJzKCkge1xuXHRcdGlmICh0aGlzLmZvcm1Db250YWluZXJzIS5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0XHRpZiAodGhpcy5mYWNldFR5cGUuaW5kZXhPZihcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNvbGxlY3Rpb25GYWNldFwiKSA+PSAwKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5mb3JtQ29udGFpbmVycyEubWFwKChmb3JtQ29udGFpbmVyLCBmb3JtQ29udGFpbmVySWR4KSA9PiB7XG5cdFx0XHRcdGlmIChmb3JtQ29udGFpbmVyLmlzVmlzaWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IGZhY2V0Q29udGV4dCA9IHRoaXMuY29udGV4dFBhdGguZ2V0TW9kZWwoKS5jcmVhdGVCaW5kaW5nQ29udGV4dChmb3JtQ29udGFpbmVyLmFubm90YXRpb25QYXRoLCB0aGlzLmNvbnRleHRQYXRoKTtcblx0XHRcdFx0XHRjb25zdCBmYWNldCA9IGZhY2V0Q29udGV4dC5nZXRPYmplY3QoKSBhcyBhbnk7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0ZmFjZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0ICYmXG5cdFx0XHRcdFx0XHRGb3JtSGVscGVyLmlzUmVmZXJlbmNlRmFjZXRQYXJ0T2ZQcmV2aWV3KGZhY2V0LCB0aGlzLnBhcnRPZlByZXZpZXcpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRpZiAoZmFjZXQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aC4kVHlwZSA9PT0gQ29tbXVuaWNhdGlvbkFubm90YXRpb25UeXBlcy5BZGRyZXNzVHlwZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4geG1sYDx0ZW1wbGF0ZTp3aXRoIHBhdGg9XCJmb3JtQ29udGFpbmVycz4ke2Zvcm1Db250YWluZXJJZHh9XCIgdmFyPVwiZm9ybUNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDx0ZW1wbGF0ZTp3aXRoIHBhdGg9XCJmb3JtQ29udGFpbmVycz4ke2Zvcm1Db250YWluZXJJZHh9L2Fubm90YXRpb25QYXRoXCIgdmFyPVwiZmFjZXRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxjb3JlOkZyYWdtZW50IGZyYWdtZW50TmFtZT1cInNhcC5mZS5tYWNyb3MuZm9ybS5BZGRyZXNzU2VjdGlvblwiIHR5cGU9XCJYTUxcIiAvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvdGVtcGxhdGU6d2l0aD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC90ZW1wbGF0ZTp3aXRoPmA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREYXRhRmllbGRDb2xsZWN0aW9uKGZvcm1Db250YWluZXIsIGZhY2V0Q29udGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLmZhY2V0VHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWZlcmVuY2VGYWNldFwiKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5mb3JtQ29udGFpbmVycyEubWFwKChmb3JtQ29udGFpbmVyKSA9PiB7XG5cdFx0XHRcdGlmIChmb3JtQ29udGFpbmVyLmlzVmlzaWJsZSkge1xuXHRcdFx0XHRcdGNvbnN0IGZhY2V0Q29udGV4dCA9IHRoaXMuY29udGV4dFBhdGguZ2V0TW9kZWwoKS5jcmVhdGVCaW5kaW5nQ29udGV4dChmb3JtQ29udGFpbmVyLmFubm90YXRpb25QYXRoLCB0aGlzLmNvbnRleHRQYXRoKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREYXRhRmllbGRDb2xsZWN0aW9uKGZvcm1Db250YWluZXIsIGZhY2V0Q29udGV4dCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4geG1sYGA7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwcm9wZXIgbGF5b3V0IGluZm9ybWF0aW9uIGJhc2VkIG9uIHRoZSBgbGF5b3V0YCBwcm9wZXJ0eSBkZWZpbmVkIGV4dGVybmFsbHkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBsYXlvdXQgaW5mb3JtYXRpb24gZm9yIHRoZSB4bWwuXG5cdCAqL1xuXHRnZXRMYXlvdXRJbmZvcm1hdGlvbigpIHtcblx0XHRzd2l0Y2ggKHRoaXMubGF5b3V0LnR5cGUpIHtcblx0XHRcdGNhc2UgXCJSZXNwb25zaXZlR3JpZExheW91dFwiOlxuXHRcdFx0XHRyZXR1cm4geG1sYDxmOlJlc3BvbnNpdmVHcmlkTGF5b3V0IGFkanVzdExhYmVsU3Bhbj1cIiR7dGhpcy5sYXlvdXQuYWRqdXN0TGFiZWxTcGFufVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrcG9pbnRMPVwiJHt0aGlzLmxheW91dC5icmVha3BvaW50TH1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVha3BvaW50TT1cIiR7dGhpcy5sYXlvdXQuYnJlYWtwb2ludE19XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWtwb2ludFhMPVwiJHt0aGlzLmxheW91dC5icmVha3BvaW50WEx9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uc0w9XCIke3RoaXMubGF5b3V0LmNvbHVtbnNMfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbnNNPVwiJHt0aGlzLmxheW91dC5jb2x1bW5zTX1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW5zWEw9XCIke3RoaXMubGF5b3V0LmNvbHVtbnNYTH1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbXB0eVNwYW5MPVwiJHt0aGlzLmxheW91dC5lbXB0eVNwYW5MfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtcHR5U3Bhbk09XCIke3RoaXMubGF5b3V0LmVtcHR5U3Bhbk19XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1wdHlTcGFuUz1cIiR7dGhpcy5sYXlvdXQuZW1wdHlTcGFuU31cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbXB0eVNwYW5YTD1cIiR7dGhpcy5sYXlvdXQuZW1wdHlTcGFuWEx9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWxTcGFuTD1cIiR7dGhpcy5sYXlvdXQubGFiZWxTcGFuTH1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbFNwYW5NPVwiJHt0aGlzLmxheW91dC5sYWJlbFNwYW5NfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsU3BhblM9XCIke3RoaXMubGF5b3V0LmxhYmVsU3BhblN9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWxTcGFuWEw9XCIke3RoaXMubGF5b3V0LmxhYmVsU3BhblhMfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZUNvbnRhaW5lckZ1bGxTaXplPVwiJHt0aGlzLmxheW91dC5zaW5nbGVDb250YWluZXJGdWxsU2l6ZX1cIiAvPmA7XG5cdFx0XHRjYXNlIFwiQ29sdW1uTGF5b3V0XCI6XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4geG1sYDxmOkNvbHVtbkxheW91dFxuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbnNNPVwiJHt0aGlzLmxheW91dC5jb2x1bW5zTX1cIlxuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbnNMPVwiJHt0aGlzLmxheW91dC5jb2x1bW5zTH1cIlxuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbnNYTD1cIiR7dGhpcy5sYXlvdXQuY29sdW1uc1hMfVwiXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWxDZWxsc0xhcmdlPVwiJHt0aGlzLmxheW91dC5sYWJlbENlbGxzTGFyZ2V9XCJcblx0XHRcdFx0XHRcdFx0XHRlbXB0eUNlbGxzTGFyZ2U9XCIke3RoaXMubGF5b3V0LmVtcHR5Q2VsbHNMYXJnZX1cIiAvPmA7XG5cdFx0fVxuXHR9XG5cblx0Z2V0VGVtcGxhdGUoKSB7XG5cdFx0Y29uc3Qgb25DaGFuZ2VTdHIgPSAodGhpcy5vbkNoYW5nZSAmJiB0aGlzLm9uQ2hhbmdlLnJlcGxhY2UoXCJ7XCIsIFwiXFxcXHtcIikucmVwbGFjZShcIn1cIiwgXCJcXFxcfVwiKSkgfHwgXCJcIjtcblx0XHRjb25zdCBtZXRhUGF0aFBhdGggPSB0aGlzLm1ldGFQYXRoLmdldFBhdGgoKTtcblx0XHRjb25zdCBjb250ZXh0UGF0aFBhdGggPSB0aGlzLmNvbnRleHRQYXRoLmdldFBhdGgoKTtcblx0XHRpZiAoIXRoaXMuaXNWaXNpYmxlKSB7XG5cdFx0XHRyZXR1cm4geG1sYGA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB4bWxgPG1hY3JvOkZvcm1BUEkgeG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zLmZvcm1cIlxuXHRcdFx0XHRcdHhtbG5zOm1hY3JvZGF0YT1cImh0dHA6Ly9zY2hlbWFzLnNhcC5jb20vc2FwdWk1L2V4dGVuc2lvbi9zYXAudWkuY29yZS5DdXN0b21EYXRhLzFcIlxuXHRcdFx0XHRcdHhtbG5zOmY9XCJzYXAudWkubGF5b3V0LmZvcm1cIlxuXHRcdFx0XHRcdHhtbG5zOmZsPVwic2FwLnVpLmZsXCJcblx0XHRcdFx0XHRpZD1cIiR7dGhpcy5fYXBpSWR9XCJcblx0XHRcdFx0XHRtZXRhUGF0aD1cIiR7bWV0YVBhdGhQYXRofVwiXG5cdFx0XHRcdFx0Y29udGV4dFBhdGg9XCIke2NvbnRleHRQYXRoUGF0aH1cIj5cblx0XHRcdFx0PGY6Rm9ybVxuXHRcdFx0XHRcdGZsOmRlbGVnYXRlPSd7XG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogXCJzYXAvZmUvbWFjcm9zL2Zvcm0vRm9ybURlbGVnYXRlXCIsXG5cdFx0XHRcdFx0XHRcImRlbGVnYXRlVHlwZVwiOiBcImNvbXBsZXRlXCJcblx0XHRcdFx0XHR9J1xuXHRcdFx0XHRcdGlkPVwiJHt0aGlzLl9jb250ZW50SWR9XCJcblx0XHRcdFx0XHRlZGl0YWJsZT1cIiR7dGhpcy5fZWRpdGFibGV9XCJcblx0XHRcdFx0XHRtYWNyb2RhdGE6ZW50aXR5U2V0PVwie2NvbnRleHRQYXRoPkBzYXB1aS5uYW1lfVwiXG5cdFx0XHRcdFx0dmlzaWJsZT1cIiR7dGhpcy5pc1Zpc2libGV9XCJcblx0XHRcdFx0XHRjbGFzcz1cInNhcFV4QVBPYmplY3RQYWdlU3ViU2VjdGlvbkFsaWduQ29udGVudFwiXG5cdFx0XHRcdFx0bWFjcm9kYXRhOm5hdmlnYXRpb25QYXRoPVwiJHtjb250ZXh0UGF0aFBhdGh9XCJcblx0XHRcdFx0XHRtYWNyb2RhdGE6b25DaGFuZ2U9XCIke29uQ2hhbmdlU3RyfVwiXG5cdFx0XHRcdD5cblx0XHRcdFx0XHQke3RoaXMuYWRkQ29uZGl0aW9uYWxseShcblx0XHRcdFx0XHRcdHRoaXMudGl0bGUgIT09IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdHhtbGA8Zjp0aXRsZT5cblx0XHRcdFx0XHRcdFx0PGNvcmU6VGl0bGUgbGV2ZWw9XCIke3RoaXMudGl0bGVMZXZlbH1cIiB0ZXh0PVwiJHt0aGlzLnRpdGxlfVwiIC8+XG5cdFx0XHRcdFx0XHQ8L2Y6dGl0bGU+YFxuXHRcdFx0XHRcdCl9XG5cdFx0XHRcdFx0PGY6bGF5b3V0PlxuXHRcdFx0XHRcdCR7dGhpcy5nZXRMYXlvdXRJbmZvcm1hdGlvbigpfVxuXG5cdFx0XHRcdFx0PC9mOmxheW91dD5cblx0XHRcdFx0XHQ8Zjpmb3JtQ29udGFpbmVycz5cblx0XHRcdFx0XHRcdCR7dGhpcy5nZXRGb3JtQ29udGFpbmVycygpfVxuXHRcdFx0XHRcdDwvZjpmb3JtQ29udGFpbmVycz5cblx0XHRcdFx0PC9mOkZvcm0+XG5cdFx0XHQ8L21hY3JvOkZvcm1BUEk+YDtcblx0XHR9XG5cdH1cbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWdEcUJBLGlCO0VBbkJyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO1NBQ0NDLG1CQUFtQixDQUFDO0lBQ3BCQyxJQUFJLEVBQUUsTUFEYztJQUVwQkMsU0FBUyxFQUFFLHdCQUZTO0lBR3BCQyxlQUFlLEVBQUU7RUFIRyxDQUFELEMsVUFNbEJDLFlBQVksQ0FBQztJQUFFQyxJQUFJLEVBQUUsUUFBUjtJQUFrQkMsUUFBUSxFQUFFLElBQTVCO0lBQWtDQyxRQUFRLEVBQUU7RUFBNUMsQ0FB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