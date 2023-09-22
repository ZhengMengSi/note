/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/annotations/DataField", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/templating/DataModelPathHelper", "../../../helpers/StableIdHelper", "../../helpers/ConfigurableObject", "../../helpers/DataFieldHelper", "../../helpers/ID", "../../helpers/Key", "../../ManifestSettings"], function (DataField, BindingToolkit, ModelHelper, DataModelPathHelper, StableIdHelper, ConfigurableObject, DataFieldHelper, ID, Key, ManifestSettings) {
  "use strict";

  var _exports = {};
  var ActionType = ManifestSettings.ActionType;
  var KeyHelper = Key.KeyHelper;
  var getFormStandardActionButtonID = ID.getFormStandardActionButtonID;
  var getFormID = ID.getFormID;
  var isReferencePropertyStaticallyHidden = DataFieldHelper.isReferencePropertyStaticallyHidden;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var generate = StableIdHelper.generate;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getTargetEntitySetPath = DataModelPathHelper.getTargetEntitySetPath;
  var pathInModel = BindingToolkit.pathInModel;
  var not = BindingToolkit.not;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var equal = BindingToolkit.equal;
  var compileExpression = BindingToolkit.compileExpression;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var FormElementType;

  (function (FormElementType) {
    FormElementType["Default"] = "Default";
    FormElementType["Slot"] = "Slot";
    FormElementType["Annotation"] = "Annotation";
  })(FormElementType || (FormElementType = {}));

  _exports.FormElementType = FormElementType;

  /**
   * Returns default format options for text fields on a form.
   *
   * @returns Collection of format options with default values
   */
  function getDefaultFormatOptionsForForm() {
    return {
      textLinesEdit: 4
    };
  }

  function isFieldPartOfPreview(field, formPartOfPreview) {
    var _field$annotations, _field$annotations$UI, _field$annotations2, _field$annotations2$U;

    // Both each form and field can have the PartOfPreview annotation. Only if the form is not hidden (not partOfPreview) we allow toggling on field level
    return (formPartOfPreview === null || formPartOfPreview === void 0 ? void 0 : formPartOfPreview.valueOf()) === false || ((_field$annotations = field.annotations) === null || _field$annotations === void 0 ? void 0 : (_field$annotations$UI = _field$annotations.UI) === null || _field$annotations$UI === void 0 ? void 0 : _field$annotations$UI.PartOfPreview) === undefined || ((_field$annotations2 = field.annotations) === null || _field$annotations2 === void 0 ? void 0 : (_field$annotations2$U = _field$annotations2.UI) === null || _field$annotations2$U === void 0 ? void 0 : _field$annotations2$U.PartOfPreview.valueOf()) === true;
  }

  function getFormElementsFromAnnotations(facetDefinition, converterContext) {
    var formElements = [];
    var resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
    var formAnnotation = resolvedTarget.annotation;
    converterContext = resolvedTarget.converterContext;

    function getDataFieldsFromAnnotations(field, formPartOfPreview) {
      var _field$annotations3, _field$annotations3$U, _field$annotations3$U2;

      var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, field);

      if (field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAction" && field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && !isReferencePropertyStaticallyHidden(field) && ((_field$annotations3 = field.annotations) === null || _field$annotations3 === void 0 ? void 0 : (_field$annotations3$U = _field$annotations3.UI) === null || _field$annotations3$U === void 0 ? void 0 : (_field$annotations3$U2 = _field$annotations3$U.Hidden) === null || _field$annotations3$U2 === void 0 ? void 0 : _field$annotations3$U2.valueOf()) !== true) {
        formElements.push({
          key: KeyHelper.generateKeyFromDataField(field),
          type: FormElementType.Annotation,
          annotationPath: "".concat(converterContext.getEntitySetBasedAnnotationPath(field.fullyQualifiedName), "/"),
          semanticObjectPath: semanticObjectAnnotationPath,
          formatOptions: getDefaultFormatOptionsForForm(),
          isPartOfPreview: isFieldPartOfPreview(field, formPartOfPreview)
        });
      }
    }

    switch (formAnnotation === null || formAnnotation === void 0 ? void 0 : formAnnotation.term) {
      case "com.sap.vocabularies.UI.v1.FieldGroup":
        formAnnotation.Data.forEach(function (field) {
          var _facetDefinition$anno, _facetDefinition$anno2;

          return getDataFieldsFromAnnotations(field, (_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.PartOfPreview);
        });
        break;

      case "com.sap.vocabularies.UI.v1.Identification":
        formAnnotation.forEach(function (field) {
          var _facetDefinition$anno3, _facetDefinition$anno4;

          return getDataFieldsFromAnnotations(field, (_facetDefinition$anno3 = facetDefinition.annotations) === null || _facetDefinition$anno3 === void 0 ? void 0 : (_facetDefinition$anno4 = _facetDefinition$anno3.UI) === null || _facetDefinition$anno4 === void 0 ? void 0 : _facetDefinition$anno4.PartOfPreview);
        });
        break;

      case "com.sap.vocabularies.UI.v1.DataPoint":
        formElements.push({
          // key: KeyHelper.generateKeyFromDataField(formAnnotation),
          key: "DataPoint::".concat(formAnnotation.qualifier ? formAnnotation.qualifier : ""),
          type: FormElementType.Annotation,
          annotationPath: "".concat(converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName), "/")
        });
        break;

      case "com.sap.vocabularies.Communication.v1.Contact":
        formElements.push({
          // key: KeyHelper.generateKeyFromDataField(formAnnotation),
          key: "Contact::".concat(formAnnotation.qualifier ? formAnnotation.qualifier : ""),
          type: FormElementType.Annotation,
          annotationPath: "".concat(converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName), "/")
        });
        break;

      default:
        break;
    }

    return formElements;
  }

  function getFormElementsFromManifest(facetDefinition, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var manifestFormContainer = manifestWrapper.getFormContainer(facetDefinition.Target.value);
    var formElements = {};

    if (manifestFormContainer !== null && manifestFormContainer !== void 0 && manifestFormContainer.fields) {
      Object.keys(manifestFormContainer === null || manifestFormContainer === void 0 ? void 0 : manifestFormContainer.fields).forEach(function (fieldId) {
        formElements[fieldId] = {
          key: fieldId,
          id: "CustomFormElement::".concat(fieldId),
          type: manifestFormContainer.fields[fieldId].type || FormElementType.Default,
          template: manifestFormContainer.fields[fieldId].template,
          label: manifestFormContainer.fields[fieldId].label,
          position: manifestFormContainer.fields[fieldId].position || {
            placement: Placement.After
          },
          formatOptions: _objectSpread(_objectSpread({}, getDefaultFormatOptionsForForm()), manifestFormContainer.fields[fieldId].formatOptions)
        };
      });
    }

    return formElements;
  }

  _exports.getFormElementsFromManifest = getFormElementsFromManifest;

  function getFormContainer(facetDefinition, converterContext, actions) {
    var _facetDefinition$anno5, _facetDefinition$anno6, _resolvedTarget$conve, _facetDefinition$anno7, _facetDefinition$anno8, _facetDefinition$anno9;

    var sFormContainerId = generate([{
      Facet: facetDefinition
    }]);
    var sAnnotationPath = "/".concat(facetDefinition.fullyQualifiedName);
    var resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
    var isVisible = compileExpression(not(equal(true, getExpressionFromAnnotation((_facetDefinition$anno5 = facetDefinition.annotations) === null || _facetDefinition$anno5 === void 0 ? void 0 : (_facetDefinition$anno6 = _facetDefinition$anno5.UI) === null || _facetDefinition$anno6 === void 0 ? void 0 : _facetDefinition$anno6.Hidden))));
    var sEntitySetPath; // resolvedTarget doesn't have a entitySet in case Containments and Paramterized services.

    if (resolvedTarget.converterContext.getEntitySet() && resolvedTarget.converterContext.getEntitySet() !== converterContext.getEntitySet()) {
      sEntitySetPath = getTargetEntitySetPath(resolvedTarget.converterContext.getDataModelObjectPath());
    } else if (((_resolvedTarget$conve = resolvedTarget.converterContext.getDataModelObjectPath().targetObject) === null || _resolvedTarget$conve === void 0 ? void 0 : _resolvedTarget$conve.containsTarget) === true) {
      sEntitySetPath = getTargetObjectPath(resolvedTarget.converterContext.getDataModelObjectPath(), false);
    } else if (resolvedTarget.converterContext.getEntitySet() && !sEntitySetPath && ModelHelper.isSingleton(resolvedTarget.converterContext.getEntitySet())) {
      var _resolvedTarget$conve2;

      sEntitySetPath = (_resolvedTarget$conve2 = resolvedTarget.converterContext.getEntitySet()) === null || _resolvedTarget$conve2 === void 0 ? void 0 : _resolvedTarget$conve2.fullyQualifiedName;
    }

    var aFormElements = insertCustomElements(getFormElementsFromAnnotations(facetDefinition, converterContext), getFormElementsFromManifest(facetDefinition, converterContext), {
      formatOptions: "overwrite"
    });
    actions = actions !== undefined ? actions.filter(function (action) {
      return action.facetName == facetDefinition.fullyQualifiedName;
    }) : [];

    if (actions.length === 0) {
      actions = undefined;
    }

    var oActionShowDetails = {
      id: getFormStandardActionButtonID(sFormContainerId, "ShowHideDetails"),
      key: "StandardAction::ShowHideDetails",
      text: compileExpression(ifElse(equal(pathInModel("showDetails", "internal"), true), pathInModel("T_COMMON_OBJECT_PAGE_HIDE_FORM_CONTAINER_DETAILS", "sap.fe.i18n"), pathInModel("T_COMMON_OBJECT_PAGE_SHOW_FORM_CONTAINER_DETAILS", "sap.fe.i18n"))),
      type: ActionType.ShowFormDetails,
      press: "FormContainerRuntime.toggleDetails"
    };

    if (((_facetDefinition$anno7 = facetDefinition.annotations) === null || _facetDefinition$anno7 === void 0 ? void 0 : (_facetDefinition$anno8 = _facetDefinition$anno7.UI) === null || _facetDefinition$anno8 === void 0 ? void 0 : (_facetDefinition$anno9 = _facetDefinition$anno8.PartOfPreview) === null || _facetDefinition$anno9 === void 0 ? void 0 : _facetDefinition$anno9.valueOf()) !== false && aFormElements.some(function (oFormElement) {
      return oFormElement.isPartOfPreview === false;
    })) {
      if (actions !== undefined) {
        actions.push(oActionShowDetails);
      } else {
        actions = [oActionShowDetails];
      }
    }

    return {
      id: sFormContainerId,
      formElements: aFormElements,
      annotationPath: sAnnotationPath,
      isVisible: isVisible,
      entitySet: sEntitySetPath,
      actions: actions
    };
  }

  _exports.getFormContainer = getFormContainer;

  function getFormContainersForCollection(facetDefinition, converterContext, actions) {
    var _facetDefinition$Face;

    var formContainers = [];
    (_facetDefinition$Face = facetDefinition.Facets) === null || _facetDefinition$Face === void 0 ? void 0 : _facetDefinition$Face.forEach(function (facet) {
      // Ignore level 3 collection facet
      if (facet.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
        return;
      }

      formContainers.push(getFormContainer(facet, converterContext, actions));
    });
    return formContainers;
  }

  function isReferenceFacet(facetDefinition) {
    return facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet";
  }

  _exports.isReferenceFacet = isReferenceFacet;

  function createFormDefinition(facetDefinition, isVisible, converterContext, actions) {
    var _facetDefinition$anno10, _facetDefinition$anno11, _facetDefinition$anno12;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        // Keep only valid children
        return {
          id: getFormID({
            Facet: facetDefinition
          }),
          useFormContainerLabels: true,
          hasFacetsNotPartOfPreview: facetDefinition.Facets.some(function (childFacet) {
            var _childFacet$annotatio, _childFacet$annotatio2, _childFacet$annotatio3;

            return ((_childFacet$annotatio = childFacet.annotations) === null || _childFacet$annotatio === void 0 ? void 0 : (_childFacet$annotatio2 = _childFacet$annotatio.UI) === null || _childFacet$annotatio2 === void 0 ? void 0 : (_childFacet$annotatio3 = _childFacet$annotatio2.PartOfPreview) === null || _childFacet$annotatio3 === void 0 ? void 0 : _childFacet$annotatio3.valueOf()) === false;
          }),
          formContainers: getFormContainersForCollection(facetDefinition, converterContext, actions),
          isVisible: isVisible
        };

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        return {
          id: getFormID({
            Facet: facetDefinition
          }),
          useFormContainerLabels: false,
          hasFacetsNotPartOfPreview: ((_facetDefinition$anno10 = facetDefinition.annotations) === null || _facetDefinition$anno10 === void 0 ? void 0 : (_facetDefinition$anno11 = _facetDefinition$anno10.UI) === null || _facetDefinition$anno11 === void 0 ? void 0 : (_facetDefinition$anno12 = _facetDefinition$anno11.PartOfPreview) === null || _facetDefinition$anno12 === void 0 ? void 0 : _facetDefinition$anno12.valueOf()) === false,
          formContainers: [getFormContainer(facetDefinition, converterContext, actions)],
          isVisible: isVisible
        };

      default:
        throw new Error("Cannot create form based on ReferenceURLFacet");
    }
  }

  _exports.createFormDefinition = createFormDefinition;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGb3JtRWxlbWVudFR5cGUiLCJnZXREZWZhdWx0Rm9ybWF0T3B0aW9uc0ZvckZvcm0iLCJ0ZXh0TGluZXNFZGl0IiwiaXNGaWVsZFBhcnRPZlByZXZpZXciLCJmaWVsZCIsImZvcm1QYXJ0T2ZQcmV2aWV3IiwidmFsdWVPZiIsImFubm90YXRpb25zIiwiVUkiLCJQYXJ0T2ZQcmV2aWV3IiwidW5kZWZpbmVkIiwiZ2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zIiwiZmFjZXREZWZpbml0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImZvcm1FbGVtZW50cyIsInJlc29sdmVkVGFyZ2V0IiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJUYXJnZXQiLCJ2YWx1ZSIsImZvcm1Bbm5vdGF0aW9uIiwiYW5ub3RhdGlvbiIsImdldERhdGFGaWVsZHNGcm9tQW5ub3RhdGlvbnMiLCJzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoIiwiZ2V0U2VtYW50aWNPYmplY3RQYXRoIiwiJFR5cGUiLCJpc1JlZmVyZW5jZVByb3BlcnR5U3RhdGljYWxseUhpZGRlbiIsIkhpZGRlbiIsInB1c2giLCJrZXkiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJ0eXBlIiwiQW5ub3RhdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInNlbWFudGljT2JqZWN0UGF0aCIsImZvcm1hdE9wdGlvbnMiLCJpc1BhcnRPZlByZXZpZXciLCJ0ZXJtIiwiRGF0YSIsImZvckVhY2giLCJxdWFsaWZpZXIiLCJnZXRGb3JtRWxlbWVudHNGcm9tTWFuaWZlc3QiLCJtYW5pZmVzdFdyYXBwZXIiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJtYW5pZmVzdEZvcm1Db250YWluZXIiLCJnZXRGb3JtQ29udGFpbmVyIiwiZmllbGRzIiwiT2JqZWN0Iiwia2V5cyIsImZpZWxkSWQiLCJpZCIsIkRlZmF1bHQiLCJ0ZW1wbGF0ZSIsImxhYmVsIiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJBZnRlciIsImFjdGlvbnMiLCJzRm9ybUNvbnRhaW5lcklkIiwiZ2VuZXJhdGUiLCJGYWNldCIsInNBbm5vdGF0aW9uUGF0aCIsImlzVmlzaWJsZSIsImNvbXBpbGVFeHByZXNzaW9uIiwibm90IiwiZXF1YWwiLCJnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24iLCJzRW50aXR5U2V0UGF0aCIsImdldEVudGl0eVNldCIsImdldFRhcmdldEVudGl0eVNldFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0T2JqZWN0IiwiY29udGFpbnNUYXJnZXQiLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwiTW9kZWxIZWxwZXIiLCJpc1NpbmdsZXRvbiIsImFGb3JtRWxlbWVudHMiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImZpbHRlciIsImFjdGlvbiIsImZhY2V0TmFtZSIsImxlbmd0aCIsIm9BY3Rpb25TaG93RGV0YWlscyIsImdldEZvcm1TdGFuZGFyZEFjdGlvbkJ1dHRvbklEIiwidGV4dCIsImlmRWxzZSIsInBhdGhJbk1vZGVsIiwiQWN0aW9uVHlwZSIsIlNob3dGb3JtRGV0YWlscyIsInByZXNzIiwic29tZSIsIm9Gb3JtRWxlbWVudCIsImVudGl0eVNldCIsImdldEZvcm1Db250YWluZXJzRm9yQ29sbGVjdGlvbiIsImZvcm1Db250YWluZXJzIiwiRmFjZXRzIiwiZmFjZXQiLCJpc1JlZmVyZW5jZUZhY2V0IiwiY3JlYXRlRm9ybURlZmluaXRpb24iLCJnZXRGb3JtSUQiLCJ1c2VGb3JtQ29udGFpbmVyTGFiZWxzIiwiaGFzRmFjZXRzTm90UGFydE9mUHJldmlldyIsImNoaWxkRmFjZXQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRm9ybS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tdW5pY2F0aW9uQW5ub3RhdGlvblRlcm1zLCBDb250YWN0IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tdW5pY2F0aW9uXCI7XG5pbXBvcnQgdHlwZSB7XG5cdENvbGxlY3Rpb25GYWNldFR5cGVzLFxuXHREYXRhRmllbGRBYnN0cmFjdFR5cGVzLFxuXHREYXRhUG9pbnQsXG5cdEZhY2V0VHlwZXMsXG5cdEZpZWxkR3JvdXAsXG5cdElkZW50aWZpY2F0aW9uLFxuXHRQYXJ0T2ZQcmV2aWV3LFxuXHRSZWZlcmVuY2VGYWNldFR5cGVzXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB7IFVJQW5ub3RhdGlvblRlcm1zLCBVSUFubm90YXRpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCB7IGdldFNlbWFudGljT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2Fubm90YXRpb25zL0RhdGFGaWVsZFwiO1xuaW1wb3J0IHR5cGUgeyBCYXNlQWN0aW9uLCBDb252ZXJ0ZXJBY3Rpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vQWN0aW9uXCI7XG5pbXBvcnQgdHlwZSB7IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBlcXVhbCwgZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uLCBpZkVsc2UsIG5vdCwgcGF0aEluTW9kZWwgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRFbnRpdHlTZXRQYXRoLCBnZXRUYXJnZXRPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IHR5cGUgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vLi4vQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBDb25maWd1cmFibGVPYmplY3QsIEN1c3RvbUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IGluc2VydEN1c3RvbUVsZW1lbnRzLCBQbGFjZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IGlzUmVmZXJlbmNlUHJvcGVydHlTdGF0aWNhbGx5SGlkZGVuIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvRGF0YUZpZWxkSGVscGVyXCI7XG5pbXBvcnQgeyBnZXRGb3JtSUQsIGdldEZvcm1TdGFuZGFyZEFjdGlvbkJ1dHRvbklEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHR5cGUgeyBGb3JtYXRPcHRpb25zVHlwZSwgRm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcblxuZXhwb3J0IHR5cGUgRm9ybURlZmluaXRpb24gPSB7XG5cdGlkOiBzdHJpbmc7XG5cdHVzZUZvcm1Db250YWluZXJMYWJlbHM6IGJvb2xlYW47XG5cdGhhc0ZhY2V0c05vdFBhcnRPZlByZXZpZXc6IGJvb2xlYW47XG5cdGZvcm1Db250YWluZXJzOiBGb3JtQ29udGFpbmVyW107XG5cdGlzVmlzaWJsZTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG59O1xuXG5leHBvcnQgZW51bSBGb3JtRWxlbWVudFR5cGUge1xuXHREZWZhdWx0ID0gXCJEZWZhdWx0XCIsXG5cdFNsb3QgPSBcIlNsb3RcIixcblx0QW5ub3RhdGlvbiA9IFwiQW5ub3RhdGlvblwiXG59XG5cbmV4cG9ydCB0eXBlIEJhc2VGb3JtRWxlbWVudCA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0aWQ/OiBzdHJpbmc7XG5cdHR5cGU6IEZvcm1FbGVtZW50VHlwZTtcblx0bGFiZWw/OiBzdHJpbmc7XG5cdHZpc2libGU/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0Zm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvbkZvcm1FbGVtZW50ID0gQmFzZUZvcm1FbGVtZW50ICYge1xuXHRpZFByZWZpeD86IHN0cmluZztcblx0YW5ub3RhdGlvblBhdGg/OiBzdHJpbmc7XG5cdGlzVmFsdWVNdWx0aWxpbmVUZXh0PzogYm9vbGVhbjtcblx0c2VtYW50aWNPYmplY3RQYXRoPzogc3RyaW5nO1xuXHRpc1BhcnRPZlByZXZpZXc/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tRm9ybUVsZW1lbnQgPSBDdXN0b21FbGVtZW50PFxuXHRCYXNlRm9ybUVsZW1lbnQgJiB7XG5cdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlO1xuXHRcdHRlbXBsYXRlOiBzdHJpbmc7XG5cdH1cbj47XG5cbmV4cG9ydCB0eXBlIEZvcm1FbGVtZW50ID0gQ3VzdG9tRm9ybUVsZW1lbnQgfCBBbm5vdGF0aW9uRm9ybUVsZW1lbnQ7XG5cbmV4cG9ydCB0eXBlIEZvcm1Db250YWluZXIgPSB7XG5cdGlkPzogc3RyaW5nO1xuXHRmb3JtRWxlbWVudHM6IEZvcm1FbGVtZW50W107XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdGlzVmlzaWJsZTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdGVudGl0eVNldD86IHN0cmluZztcblx0YWN0aW9ucz86IENvbnZlcnRlckFjdGlvbltdIHwgQmFzZUFjdGlvbltdO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGRlZmF1bHQgZm9ybWF0IG9wdGlvbnMgZm9yIHRleHQgZmllbGRzIG9uIGEgZm9ybS5cbiAqXG4gKiBAcmV0dXJucyBDb2xsZWN0aW9uIG9mIGZvcm1hdCBvcHRpb25zIHdpdGggZGVmYXVsdCB2YWx1ZXNcbiAqL1xuZnVuY3Rpb24gZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JGb3JtKCk6IEZvcm1hdE9wdGlvbnNUeXBlIHtcblx0cmV0dXJuIHtcblx0XHR0ZXh0TGluZXNFZGl0OiA0XG5cdH07XG59XG5cbmZ1bmN0aW9uIGlzRmllbGRQYXJ0T2ZQcmV2aWV3KGZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBmb3JtUGFydE9mUHJldmlldz86IFBhcnRPZlByZXZpZXcpOiBib29sZWFuIHtcblx0Ly8gQm90aCBlYWNoIGZvcm0gYW5kIGZpZWxkIGNhbiBoYXZlIHRoZSBQYXJ0T2ZQcmV2aWV3IGFubm90YXRpb24uIE9ubHkgaWYgdGhlIGZvcm0gaXMgbm90IGhpZGRlbiAobm90IHBhcnRPZlByZXZpZXcpIHdlIGFsbG93IHRvZ2dsaW5nIG9uIGZpZWxkIGxldmVsXG5cdHJldHVybiAoXG5cdFx0Zm9ybVBhcnRPZlByZXZpZXc/LnZhbHVlT2YoKSA9PT0gZmFsc2UgfHxcblx0XHRmaWVsZC5hbm5vdGF0aW9ucz8uVUk/LlBhcnRPZlByZXZpZXcgPT09IHVuZGVmaW5lZCB8fFxuXHRcdGZpZWxkLmFubm90YXRpb25zPy5VST8uUGFydE9mUHJldmlldy52YWx1ZU9mKCkgPT09IHRydWVcblx0KTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zKGZhY2V0RGVmaW5pdGlvbjogUmVmZXJlbmNlRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEFubm90YXRpb25Gb3JtRWxlbWVudFtdIHtcblx0Y29uc3QgZm9ybUVsZW1lbnRzOiBBbm5vdGF0aW9uRm9ybUVsZW1lbnRbXSA9IFtdO1xuXHRjb25zdCByZXNvbHZlZFRhcmdldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24oZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZSk7XG5cdGNvbnN0IGZvcm1Bbm5vdGF0aW9uOiBJZGVudGlmaWNhdGlvbiB8IEZpZWxkR3JvdXAgfCBDb250YWN0IHwgRGF0YVBvaW50ID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbjtcblx0Y29udmVydGVyQ29udGV4dCA9IHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQ7XG5cblx0ZnVuY3Rpb24gZ2V0RGF0YUZpZWxkc0Zyb21Bbm5vdGF0aW9ucyhmaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcywgZm9ybVBhcnRPZlByZXZpZXc6IFBhcnRPZlByZXZpZXcgfCB1bmRlZmluZWQpIHtcblx0XHRjb25zdCBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoID0gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQsIGZpZWxkKTtcblx0XHRpZiAoXG5cdFx0XHRmaWVsZC4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uICYmXG5cdFx0XHRmaWVsZC4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uICYmXG5cdFx0XHQhaXNSZWZlcmVuY2VQcm9wZXJ0eVN0YXRpY2FsbHlIaWRkZW4oZmllbGQpICYmXG5cdFx0XHRmaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpICE9PSB0cnVlXG5cdFx0KSB7XG5cdFx0XHRmb3JtRWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChmaWVsZCksXG5cdFx0XHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogYCR7Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSl9L2AsXG5cdFx0XHRcdHNlbWFudGljT2JqZWN0UGF0aDogc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0Zm9ybWF0T3B0aW9uczogZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JGb3JtKCksXG5cdFx0XHRcdGlzUGFydE9mUHJldmlldzogaXNGaWVsZFBhcnRPZlByZXZpZXcoZmllbGQsIGZvcm1QYXJ0T2ZQcmV2aWV3KVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0c3dpdGNoIChmb3JtQW5ub3RhdGlvbj8udGVybSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuRmllbGRHcm91cDpcblx0XHRcdGZvcm1Bbm5vdGF0aW9uLkRhdGEuZm9yRWFjaCgoZmllbGQpID0+IGdldERhdGFGaWVsZHNGcm9tQW5ub3RhdGlvbnMoZmllbGQsIGZhY2V0RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uVUk/LlBhcnRPZlByZXZpZXcpKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuSWRlbnRpZmljYXRpb246XG5cdFx0XHRmb3JtQW5ub3RhdGlvbi5mb3JFYWNoKChmaWVsZCkgPT4gZ2V0RGF0YUZpZWxkc0Zyb21Bbm5vdGF0aW9ucyhmaWVsZCwgZmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uUGFydE9mUHJldmlldykpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5EYXRhUG9pbnQ6XG5cdFx0XHRmb3JtRWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdC8vIGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChmb3JtQW5ub3RhdGlvbiksXG5cdFx0XHRcdGtleTogYERhdGFQb2ludDo6JHtmb3JtQW5ub3RhdGlvbi5xdWFsaWZpZXIgPyBmb3JtQW5ub3RhdGlvbi5xdWFsaWZpZXIgOiBcIlwifWAsXG5cdFx0XHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogYCR7Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZvcm1Bbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSl9L2Bcblx0XHRcdH0pO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBDb21tdW5pY2F0aW9uQW5ub3RhdGlvblRlcm1zLkNvbnRhY3Q6XG5cdFx0XHRmb3JtRWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdC8vIGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChmb3JtQW5ub3RhdGlvbiksXG5cdFx0XHRcdGtleTogYENvbnRhY3Q6OiR7Zm9ybUFubm90YXRpb24ucXVhbGlmaWVyID8gZm9ybUFubm90YXRpb24ucXVhbGlmaWVyIDogXCJcIn1gLFxuXHRcdFx0XHR0eXBlOiBGb3JtRWxlbWVudFR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGAke2NvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChmb3JtQW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUpfS9gXG5cdFx0XHR9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRicmVhaztcblx0fVxuXHRyZXR1cm4gZm9ybUVsZW1lbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0KFxuXHRmYWNldERlZmluaXRpb246IFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUZvcm1FbGVtZW50PiB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IG1hbmlmZXN0Rm9ybUNvbnRhaW5lcjogRm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IG1hbmlmZXN0V3JhcHBlci5nZXRGb3JtQ29udGFpbmVyKGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWUpO1xuXHRjb25zdCBmb3JtRWxlbWVudHM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUZvcm1FbGVtZW50PiA9IHt9O1xuXHRpZiAobWFuaWZlc3RGb3JtQ29udGFpbmVyPy5maWVsZHMpIHtcblx0XHRPYmplY3Qua2V5cyhtYW5pZmVzdEZvcm1Db250YWluZXI/LmZpZWxkcykuZm9yRWFjaCgoZmllbGRJZCkgPT4ge1xuXHRcdFx0Zm9ybUVsZW1lbnRzW2ZpZWxkSWRdID0ge1xuXHRcdFx0XHRrZXk6IGZpZWxkSWQsXG5cdFx0XHRcdGlkOiBgQ3VzdG9tRm9ybUVsZW1lbnQ6OiR7ZmllbGRJZH1gLFxuXHRcdFx0XHR0eXBlOiBtYW5pZmVzdEZvcm1Db250YWluZXIuZmllbGRzW2ZpZWxkSWRdLnR5cGUgfHwgRm9ybUVsZW1lbnRUeXBlLkRlZmF1bHQsXG5cdFx0XHRcdHRlbXBsYXRlOiBtYW5pZmVzdEZvcm1Db250YWluZXIuZmllbGRzW2ZpZWxkSWRdLnRlbXBsYXRlLFxuXHRcdFx0XHRsYWJlbDogbWFuaWZlc3RGb3JtQ29udGFpbmVyLmZpZWxkc1tmaWVsZElkXS5sYWJlbCxcblx0XHRcdFx0cG9zaXRpb246IG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5maWVsZHNbZmllbGRJZF0ucG9zaXRpb24gfHwge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0XHQuLi5nZXREZWZhdWx0Rm9ybWF0T3B0aW9uc0ZvckZvcm0oKSxcblx0XHRcdFx0XHQuLi5tYW5pZmVzdEZvcm1Db250YWluZXIuZmllbGRzW2ZpZWxkSWRdLmZvcm1hdE9wdGlvbnNcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gZm9ybUVsZW1lbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Rm9ybUNvbnRhaW5lcihcblx0ZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRhY3Rpb25zPzogQmFzZUFjdGlvbltdIHwgQ29udmVydGVyQWN0aW9uW11cbik6IEZvcm1Db250YWluZXIge1xuXHRjb25zdCBzRm9ybUNvbnRhaW5lcklkID0gZ2VuZXJhdGUoW3sgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9XSk7XG5cdGNvbnN0IHNBbm5vdGF0aW9uUGF0aCA9IGAvJHtmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lfWA7XG5cdGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlKTtcblx0Y29uc3QgaXNWaXNpYmxlID0gY29tcGlsZUV4cHJlc3Npb24obm90KGVxdWFsKHRydWUsIGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pKSkpO1xuXHRsZXQgc0VudGl0eVNldFBhdGghOiBzdHJpbmc7XG5cdC8vIHJlc29sdmVkVGFyZ2V0IGRvZXNuJ3QgaGF2ZSBhIGVudGl0eVNldCBpbiBjYXNlIENvbnRhaW5tZW50cyBhbmQgUGFyYW10ZXJpemVkIHNlcnZpY2VzLlxuXHRpZiAoXG5cdFx0cmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSAmJlxuXHRcdHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkgIT09IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KClcblx0KSB7XG5cdFx0c0VudGl0eVNldFBhdGggPSBnZXRUYXJnZXRFbnRpdHlTZXRQYXRoKHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpKTtcblx0fSBlbHNlIGlmIChyZXNvbHZlZFRhcmdldC5jb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS50YXJnZXRPYmplY3Q/LmNvbnRhaW5zVGFyZ2V0ID09PSB0cnVlKSB7XG5cdFx0c0VudGl0eVNldFBhdGggPSBnZXRUYXJnZXRPYmplY3RQYXRoKHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLCBmYWxzZSk7XG5cdH0gZWxzZSBpZiAoXG5cdFx0cmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSAmJlxuXHRcdCFzRW50aXR5U2V0UGF0aCAmJlxuXHRcdE1vZGVsSGVscGVyLmlzU2luZ2xldG9uKHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkpXG5cdCkge1xuXHRcdHNFbnRpdHlTZXRQYXRoID0gcmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8uZnVsbHlRdWFsaWZpZWROYW1lIGFzIHN0cmluZztcblx0fVxuXHRjb25zdCBhRm9ybUVsZW1lbnRzID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0KGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0eyBmb3JtYXRPcHRpb25zOiBcIm92ZXJ3cml0ZVwiIH1cblx0KTtcblxuXHRhY3Rpb25zID0gYWN0aW9ucyAhPT0gdW5kZWZpbmVkID8gYWN0aW9ucy5maWx0ZXIoKGFjdGlvbikgPT4gYWN0aW9uLmZhY2V0TmFtZSA9PSBmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSA6IFtdO1xuXHRpZiAoYWN0aW9ucy5sZW5ndGggPT09IDApIHtcblx0XHRhY3Rpb25zID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Y29uc3Qgb0FjdGlvblNob3dEZXRhaWxzOiBCYXNlQWN0aW9uID0ge1xuXHRcdGlkOiBnZXRGb3JtU3RhbmRhcmRBY3Rpb25CdXR0b25JRChzRm9ybUNvbnRhaW5lcklkLCBcIlNob3dIaWRlRGV0YWlsc1wiKSxcblx0XHRrZXk6IFwiU3RhbmRhcmRBY3Rpb246OlNob3dIaWRlRGV0YWlsc1wiLFxuXHRcdHRleHQ6IGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRlcXVhbChwYXRoSW5Nb2RlbChcInNob3dEZXRhaWxzXCIsIFwiaW50ZXJuYWxcIiksIHRydWUpLFxuXHRcdFx0XHRwYXRoSW5Nb2RlbChcIlRfQ09NTU9OX09CSkVDVF9QQUdFX0hJREVfRk9STV9DT05UQUlORVJfREVUQUlMU1wiLCBcInNhcC5mZS5pMThuXCIpLFxuXHRcdFx0XHRwYXRoSW5Nb2RlbChcIlRfQ09NTU9OX09CSkVDVF9QQUdFX1NIT1dfRk9STV9DT05UQUlORVJfREVUQUlMU1wiLCBcInNhcC5mZS5pMThuXCIpXG5cdFx0XHQpXG5cdFx0KSxcblx0XHR0eXBlOiBBY3Rpb25UeXBlLlNob3dGb3JtRGV0YWlscyxcblx0XHRwcmVzczogXCJGb3JtQ29udGFpbmVyUnVudGltZS50b2dnbGVEZXRhaWxzXCJcblx0fTtcblxuXHRpZiAoXG5cdFx0ZmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uUGFydE9mUHJldmlldz8udmFsdWVPZigpICE9PSBmYWxzZSAmJlxuXHRcdGFGb3JtRWxlbWVudHMuc29tZSgob0Zvcm1FbGVtZW50KSA9PiBvRm9ybUVsZW1lbnQuaXNQYXJ0T2ZQcmV2aWV3ID09PSBmYWxzZSlcblx0KSB7XG5cdFx0aWYgKGFjdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YWN0aW9ucy5wdXNoKG9BY3Rpb25TaG93RGV0YWlscyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFjdGlvbnMgPSBbb0FjdGlvblNob3dEZXRhaWxzXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGlkOiBzRm9ybUNvbnRhaW5lcklkLFxuXHRcdGZvcm1FbGVtZW50czogYUZvcm1FbGVtZW50cyxcblx0XHRhbm5vdGF0aW9uUGF0aDogc0Fubm90YXRpb25QYXRoLFxuXHRcdGlzVmlzaWJsZTogaXNWaXNpYmxlLFxuXHRcdGVudGl0eVNldDogc0VudGl0eVNldFBhdGgsXG5cdFx0YWN0aW9uczogYWN0aW9uc1xuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtQ29udGFpbmVyc0ZvckNvbGxlY3Rpb24oXG5cdGZhY2V0RGVmaW5pdGlvbjogQ29sbGVjdGlvbkZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGFjdGlvbnM/OiBCYXNlQWN0aW9uW10gfCBDb252ZXJ0ZXJBY3Rpb25bXVxuKTogRm9ybUNvbnRhaW5lcltdIHtcblx0Y29uc3QgZm9ybUNvbnRhaW5lcnM6IEZvcm1Db250YWluZXJbXSA9IFtdO1xuXHRmYWNldERlZmluaXRpb24uRmFjZXRzPy5mb3JFYWNoKChmYWNldCkgPT4ge1xuXHRcdC8vIElnbm9yZSBsZXZlbCAzIGNvbGxlY3Rpb24gZmFjZXRcblx0XHRpZiAoZmFjZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRmb3JtQ29udGFpbmVycy5wdXNoKGdldEZvcm1Db250YWluZXIoZmFjZXQgYXMgUmVmZXJlbmNlRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dCwgYWN0aW9ucykpO1xuXHR9KTtcblx0cmV0dXJuIGZvcm1Db250YWluZXJzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWZlcmVuY2VGYWNldChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMpOiBmYWNldERlZmluaXRpb24gaXMgUmVmZXJlbmNlRmFjZXRUeXBlcyB7XG5cdHJldHVybiBmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRm9ybURlZmluaXRpb24oXG5cdGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0aXNWaXNpYmxlOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0YWN0aW9ucz86IEJhc2VBY3Rpb25bXSB8IENvbnZlcnRlckFjdGlvbltdXG4pOiBGb3JtRGVmaW5pdGlvbiB7XG5cdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHQvLyBLZWVwIG9ubHkgdmFsaWQgY2hpbGRyZW5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiBnZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0XHR1c2VGb3JtQ29udGFpbmVyTGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRoYXNGYWNldHNOb3RQYXJ0T2ZQcmV2aWV3OiBmYWNldERlZmluaXRpb24uRmFjZXRzLnNvbWUoXG5cdFx0XHRcdFx0KGNoaWxkRmFjZXQpID0+IGNoaWxkRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5QYXJ0T2ZQcmV2aWV3Py52YWx1ZU9mKCkgPT09IGZhbHNlXG5cdFx0XHRcdCksXG5cdFx0XHRcdGZvcm1Db250YWluZXJzOiBnZXRGb3JtQ29udGFpbmVyc0ZvckNvbGxlY3Rpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LCBhY3Rpb25zKSxcblx0XHRcdFx0aXNWaXNpYmxlOiBpc1Zpc2libGVcblx0XHRcdH07XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldDpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiBnZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0XHR1c2VGb3JtQ29udGFpbmVyTGFiZWxzOiBmYWxzZSxcblx0XHRcdFx0aGFzRmFjZXRzTm90UGFydE9mUHJldmlldzogZmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uUGFydE9mUHJldmlldz8udmFsdWVPZigpID09PSBmYWxzZSxcblx0XHRcdFx0Zm9ybUNvbnRhaW5lcnM6IFtnZXRGb3JtQ29udGFpbmVyKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCwgYWN0aW9ucyldLFxuXHRcdFx0XHRpc1Zpc2libGU6IGlzVmlzaWJsZVxuXHRcdFx0fTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNyZWF0ZSBmb3JtIGJhc2VkIG9uIFJlZmVyZW5jZVVSTEZhY2V0XCIpO1xuXHR9XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bb0NZQSxlOzthQUFBQSxlO0lBQUFBLGU7SUFBQUEsZTtJQUFBQSxlO0tBQUFBLGUsS0FBQUEsZTs7OztFQXdDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsU0FBU0MsOEJBQVQsR0FBNkQ7SUFDNUQsT0FBTztNQUNOQyxhQUFhLEVBQUU7SUFEVCxDQUFQO0VBR0E7O0VBRUQsU0FBU0Msb0JBQVQsQ0FBOEJDLEtBQTlCLEVBQTZEQyxpQkFBN0QsRUFBeUc7SUFBQTs7SUFDeEc7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