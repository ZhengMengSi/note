/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/controls/ObjectPage/HeaderFacet", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingToolkit", "../../helpers/ConfigurableObject", "../../helpers/ID", "../../ManifestSettings", "../../objectPage/FormMenuActions", "../Common/DataVisualization", "../Common/Form"], function (Log, Action, HeaderFacet, IssueManager, Key, BindingToolkit, ConfigurableObject, ID, ManifestSettings, FormMenuActions, DataVisualization, Form) {
  "use strict";

  var _exports = {};
  var isReferenceFacet = Form.isReferenceFacet;
  var createFormDefinition = Form.createFormDefinition;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var getVisibilityEnablementFormMenuActions = FormMenuActions.getVisibilityEnablementFormMenuActions;
  var getFormHiddenActions = FormMenuActions.getFormHiddenActions;
  var getFormActions = FormMenuActions.getFormActions;
  var ActionType = ManifestSettings.ActionType;
  var getSubSectionID = ID.getSubSectionID;
  var getSideContentID = ID.getSideContentID;
  var getFormID = ID.getFormID;
  var getCustomSubSectionID = ID.getCustomSubSectionID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var ref = BindingToolkit.ref;
  var pathInModel = BindingToolkit.pathInModel;
  var not = BindingToolkit.not;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var fn = BindingToolkit.fn;
  var equal = BindingToolkit.equal;
  var compileExpression = BindingToolkit.compileExpression;
  var KeyHelper = Key.KeyHelper;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var getStashedSettingsForHeaderFacet = HeaderFacet.getStashedSettingsForHeaderFacet;
  var getHeaderFacetsFromManifest = HeaderFacet.getHeaderFacetsFromManifest;
  var getDesignTimeMetadataSettingsForHeaderFacet = HeaderFacet.getDesignTimeMetadataSettingsForHeaderFacet;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var isActionNavigable = Action.isActionNavigable;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var getEnabledForAnnotationAction = Action.getEnabledForAnnotationAction;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var ButtonType = Action.ButtonType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var SubSectionType;

  (function (SubSectionType) {
    SubSectionType["Unknown"] = "Unknown";
    SubSectionType["Form"] = "Form";
    SubSectionType["DataVisualization"] = "DataVisualization";
    SubSectionType["XMLFragment"] = "XMLFragment";
    SubSectionType["Placeholder"] = "Placeholder";
    SubSectionType["Mixed"] = "Mixed";
  })(SubSectionType || (SubSectionType = {}));

  _exports.SubSectionType = SubSectionType;
  var visualizationTerms = ["com.sap.vocabularies.UI.v1.LineItem", "com.sap.vocabularies.UI.v1.Chart", "com.sap.vocabularies.UI.v1.PresentationVariant", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant"];
  /**
   * Create subsections based on facet definition.
   *
   * @param facetCollection Collection of facets
   * @param converterContext The converter context
   * @param isHeaderSection True if header section is generated in this iteration
   * @returns The current subsections
   */

  function createSubSections(facetCollection, converterContext, isHeaderSection) {
    // First we determine which sub section we need to create
    var facetsToCreate = facetCollection.reduce(function (facetsToCreate, facetDefinition) {
      switch (facetDefinition.$Type) {
        case "com.sap.vocabularies.UI.v1.ReferenceFacet":
          facetsToCreate.push(facetDefinition);
          break;

        case "com.sap.vocabularies.UI.v1.CollectionFacet":
          // TODO If the Collection Facet has a child of type Collection Facet we bring them up one level (Form + Table use case) ?
          // first case facet Collection is combination of collection and reference facet or not all facets are reference facets.
          if (facetDefinition.Facets.find(function (facetType) {
            return facetType.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet";
          })) {
            facetsToCreate.splice.apply(facetsToCreate, [facetsToCreate.length, 0].concat(_toConsumableArray(facetDefinition.Facets)));
          } else {
            facetsToCreate.push(facetDefinition);
          }

          break;

        case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
          // Not supported
          break;
      }

      return facetsToCreate;
    }, []); // Then we create the actual subsections

    return facetsToCreate.map(function (facet) {
      var _Facets;

      return createSubSection(facet, facetsToCreate, converterContext, 0, !(facet !== null && facet !== void 0 && (_Facets = facet.Facets) !== null && _Facets !== void 0 && _Facets.length), isHeaderSection);
    });
  }
  /**
   * Creates subsections based on the definition of the custom header facet.
   *
   * @param converterContext The converter context
   * @returns The current subsections
   */


  _exports.createSubSections = createSubSections;

  function createCustomHeaderFacetSubSections(converterContext) {
    var customHeaderFacets = getHeaderFacetsFromManifest(converterContext.getManifestWrapper().getHeaderFacets());
    var aCustomHeaderFacets = [];
    Object.keys(customHeaderFacets).forEach(function (key) {
      aCustomHeaderFacets.push(customHeaderFacets[key]);
      return aCustomHeaderFacets;
    });
    var facetsToCreate = aCustomHeaderFacets.reduce(function (facetsToCreate, customHeaderFacet) {
      if (customHeaderFacet.templateEdit) {
        facetsToCreate.push(customHeaderFacet);
      }

      return facetsToCreate;
    }, []);
    return facetsToCreate.map(function (customHeaderFacet) {
      return createCustomHeaderFacetSubSection(customHeaderFacet);
    });
  }
  /**
   * Creates a subsection based on a custom header facet.
   *
   * @param customHeaderFacet A custom header facet
   * @returns A definition for a subsection
   */


  _exports.createCustomHeaderFacetSubSections = createCustomHeaderFacetSubSections;

  function createCustomHeaderFacetSubSection(customHeaderFacet) {
    var subSectionID = getCustomSubSectionID(customHeaderFacet.key);
    var subSection = {
      id: subSectionID,
      key: customHeaderFacet.key,
      title: customHeaderFacet.title,
      type: SubSectionType.XMLFragment,
      template: customHeaderFacet.templateEdit || "",
      visible: customHeaderFacet.visible,
      level: 1,
      sideContent: undefined,
      stashed: customHeaderFacet.stashed,
      flexSettings: customHeaderFacet.flexSettings,
      actions: {}
    };
    return subSection;
  } // function isTargetForCompliant(annotationPath: AnnotationPath) {
  // 	return /.*com\.sap\.vocabularies\.UI\.v1\.(FieldGroup|Identification|DataPoint|StatusInfo).*/.test(annotationPath.value);
  // }


  var getSubSectionKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };
  /**
   * Adds Form menu action to all form actions, removes duplicate actions and hidden actions.
   *
   * @param actions The actions involved
   * @param facetDefinition The definition for the facet
   * @param converterContext The converter context
   * @returns The form menu actions
   */


  function addFormMenuActions(actions, facetDefinition, converterContext) {
    var hiddenActions = getFormHiddenActions(facetDefinition, converterContext) || [],
        formActions = getFormActions(facetDefinition, converterContext),
        manifestActions = getActionsFromManifest(formActions, converterContext, actions, undefined, undefined, hiddenActions),
        formAllActions = insertCustomElements(actions, manifestActions.actions, {
      command: "overwrite"
    });
    return {
      "actions": formAllActions ? getVisibilityEnablementFormMenuActions(removeDuplicateActions(formAllActions)) : actions,
      "commandActions": manifestActions.commandActions
    };
  }
  /**
   * Retrieves the action form a facet.
   *
   * @param facetDefinition
   * @param converterContext
   * @returns The current facet actions
   */


  function getFacetActions(facetDefinition, converterContext) {
    var actions = new Array();

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        actions = facetDefinition.Facets.filter(function (subFacetDefinition) {
          return isReferenceFacet(subFacetDefinition);
        }).reduce(function (actionReducer, referenceFacet) {
          return createFormActionReducer(actionReducer, referenceFacet, converterContext);
        }, []);
        break;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        actions = createFormActionReducer([], facetDefinition, converterContext);
        break;

      default:
        break;
    }

    return addFormMenuActions(actions, facetDefinition, converterContext);
  }
  /**
   * Returns the button type based on @UI.Emphasized annotation.
   *
   * @param emphasized Emphasized annotation value.
   * @returns The button type or path based expression.
   */


  function getButtonType(emphasized) {
    // Emphasized is a boolean so if it's equal to true we show the button as Ghost, otherwise as Transparent
    var buttonTypeCondition = equal(getExpressionFromAnnotation(emphasized), true);
    return compileExpression(ifElse(buttonTypeCondition, ButtonType.Ghost, ButtonType.Transparent));
  }
  /**
   * Create a subsection based on FacetTypes.
   *
   * @param facetDefinition
   * @param facetsToCreate
   * @param converterContext
   * @param level
   * @param hasSingleContent
   * @param isHeaderSection
   * @returns A subsection definition
   */


  function createSubSection(facetDefinition, facetsToCreate, converterContext, level, hasSingleContent, isHeaderSection) {
    var _facetDefinition$anno, _facetDefinition$anno2, _presentation$visuali, _presentation$visuali2, _presentation$visuali3;

    var subSectionID = getSubSectionID({
      Facet: facetDefinition
    });
    var oHiddenAnnotation = (_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.Hidden;
    var isVisible = compileExpression(not(equal(true, getExpressionFromAnnotation(oHiddenAnnotation))));
    var isDynamicExpression = isVisible && typeof isVisible === "string" && isVisible.indexOf("{=") === 0 && (oHiddenAnnotation === null || oHiddenAnnotation === void 0 ? void 0 : oHiddenAnnotation.type) !== "Path";
    var isVisibleDynamicExpression = isVisible && isDynamicExpression ? isVisible.substring(isVisible.indexOf("{=") + 2, isVisible.lastIndexOf("}")) : false;
    var title = compileExpression(getExpressionFromAnnotation(facetDefinition.Label));
    var subSection = {
      id: subSectionID,
      key: getSubSectionKey(facetDefinition, subSectionID),
      title: title,
      type: SubSectionType.Unknown,
      annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName),
      visible: isVisible,
      isVisibilityDynamic: isDynamicExpression,
      level: level,
      sideContent: undefined
    };

    if (isHeaderSection) {
      subSection.stashed = getStashedSettingsForHeaderFacet(facetDefinition, facetDefinition, converterContext);
      subSection.flexSettings = {
        designtime: getDesignTimeMetadataSettingsForHeaderFacet(facetDefinition, facetDefinition, converterContext)
      };
    }

    var unsupportedText = "";
    level++;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        var facets = facetDefinition.Facets; // Filter for all facets of this subsection that are referring to an annotation describing a visualization (e.g. table or chart)

        var visualizationFacets = facets.map(function (facet, index) {
          return {
            index: index,
            facet: facet
          };
        }) // Remember the index assigned to each facet
        .filter(function (_ref) {
          var _Target, _Target$$target;

          var facet = _ref.facet;
          return visualizationTerms.includes((_Target = facet.Target) === null || _Target === void 0 ? void 0 : (_Target$$target = _Target.$target) === null || _Target$$target === void 0 ? void 0 : _Target$$target.term);
        }); // Filter out all visualization facets; "visualizationFacets" and "nonVisualizationFacets" are disjoint

        var nonVisualizationFacets = facets.filter(function (facet) {
          return !visualizationFacets.find(function (visualization) {
            return visualization.facet === facet;
          });
        });

        if (visualizationFacets.length > 0) {
          // CollectionFacets with visualizations must be handled separately as they cannot be included in forms
          var visualizationContent = [];
          var formContent = [];
          var mixedContent = []; // Create each visualization facet as if it was its own subsection (via recursion), and keep their relative ordering

          var _iterator = _createForOfIteratorHelper(visualizationFacets),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var facet = _step.value.facet;
              visualizationContent.push(createSubSection(facet, [], converterContext, level, facets.length === 1, isHeaderSection));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (nonVisualizationFacets.length > 0) {
            // This subsection includes visualizations and other content, so it is a "Mixed" subsection
            Log.warning("Warning: CollectionFacet '".concat(facetDefinition.ID, "' includes a combination of either a chart or a table and other content. This can lead to rendering issues. Consider moving the chart or table into a separate CollectionFacet."));
            facetDefinition.Facets = nonVisualizationFacets; // Create a joined form of all facets that are not referring to visualizations

            formContent.push(createSubSection(facetDefinition, [], converterContext, level, hasSingleContent, isHeaderSection));
          } // Merge the visualization content with the form content


          if (visualizationFacets.find(function (_ref2) {
            var index = _ref2.index;
            return index === 0;
          })) {
            // If the first facet is a visualization, display the visualizations first
            mixedContent.push.apply(mixedContent, visualizationContent);
            mixedContent.push.apply(mixedContent, formContent);
          } else {
            // Otherwise, display the form first
            mixedContent.push.apply(mixedContent, formContent);
            mixedContent.push.apply(mixedContent, visualizationContent);
          }

          var mixedSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
            type: SubSectionType.Mixed,
            level: level,
            content: mixedContent
          });

          return mixedSubSection;
        } else {
          // This CollectionFacet only includes content that can be rendered in a merged form
          var facetActions = getFacetActions(facetDefinition, converterContext),
              formCollectionSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
            type: SubSectionType.Form,
            formDefinition: createFormDefinition(facetDefinition, isVisible, converterContext, facetActions.actions),
            level: level,
            actions: facetActions.actions.filter(function (action) {
              return action.facetName === undefined;
            }),
            commandActions: facetActions.commandActions
          });

          return formCollectionSubSection;
        }

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        if (!facetDefinition.Target.$target) {
          unsupportedText = "Unable to find annotationPath ".concat(facetDefinition.Target.value);
        } else {
          switch (facetDefinition.Target.$target.term) {
            case "com.sap.vocabularies.UI.v1.LineItem":
            case "com.sap.vocabularies.UI.v1.Chart":
            case "com.sap.vocabularies.UI.v1.PresentationVariant":
            case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
              var presentation = getDataVisualizationConfiguration(facetDefinition.Target.value, getCondensedTableLayoutCompliance(facetDefinition, facetsToCreate, converterContext), converterContext, undefined, isHeaderSection);
              var controlTitle = ((_presentation$visuali = presentation.visualizations[0]) === null || _presentation$visuali === void 0 ? void 0 : (_presentation$visuali2 = _presentation$visuali.annotation) === null || _presentation$visuali2 === void 0 ? void 0 : _presentation$visuali2.title) || ((_presentation$visuali3 = presentation.visualizations[0]) === null || _presentation$visuali3 === void 0 ? void 0 : _presentation$visuali3.title);
              var showTitle = isSubsectionTitleShown(hasSingleContent, subSection.title, controlTitle);
              var titleVisibleExpression = isVisible && title !== "undefined" && (title ? isVisible : false);

              var dataVisualizationSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
                type: SubSectionType.DataVisualization,
                level: level,
                presentation: presentation,
                showTitle: showTitle,
                titleVisible: isDynamicExpression ? "{= (".concat(isVisibleDynamicExpression, ") && ('").concat(title, "' !=='undefined') && (").concat(showTitle, " ? true : false) }") : titleVisibleExpression
              });

              return dataVisualizationSubSection;

            case "com.sap.vocabularies.UI.v1.FieldGroup":
            case "com.sap.vocabularies.UI.v1.Identification":
            case "com.sap.vocabularies.UI.v1.DataPoint":
            case "com.sap.vocabularies.UI.v1.StatusInfo":
            case "com.sap.vocabularies.Communication.v1.Contact":
              // All those element belong to a form facet
              var _facetActions = getFacetActions(facetDefinition, converterContext),
                  formElementSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
                type: SubSectionType.Form,
                level: level,
                formDefinition: createFormDefinition(facetDefinition, isVisible, converterContext, _facetActions.actions),
                actions: _facetActions.actions.filter(function (action) {
                  return action.facetName === undefined;
                }),
                commandActions: _facetActions.commandActions
              });

              return formElementSubSection;

            default:
              unsupportedText = "For ".concat(facetDefinition.Target.$target.term, " Fragment");
              break;
          }
        }

        break;

      case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
        unsupportedText = "For Reference URL Facet";
        break;

      default:
        break;
    } // If we reach here we ended up with an unsupported SubSection type


    var unsupportedSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
      text: unsupportedText
    });

    return unsupportedSubSection;
  }

  _exports.createSubSection = createSubSection;

  function isSubsectionTitleShown(hasSingleContent, subSectionTitle, controlTitle) {
    if (hasSingleContent && controlTitle === subSectionTitle) {
      return false;
    }

    return true;
  }

  function createFormActionReducer(actions, facetDefinition, converterContext) {
    var referenceTarget = facetDefinition.Target.$target;
    var targetValue = facetDefinition.Target.value;
    var manifestActions = {};
    var dataFieldCollection = [];

    var _targetValue$split = targetValue.split("@"),
        _targetValue$split2 = _slicedToArray(_targetValue$split, 1),
        navigationPropertyPath = _targetValue$split2[0];

    if (navigationPropertyPath.length > 0) {
      if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
        navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
      }
    } else {
      navigationPropertyPath = undefined;
    }

    if (referenceTarget) {
      switch (referenceTarget.term) {
        case "com.sap.vocabularies.UI.v1.FieldGroup":
          dataFieldCollection = referenceTarget.Data;
          manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(referenceTarget).actions, converterContext, undefined, undefined, undefined, undefined, facetDefinition.fullyQualifiedName).actions;
          break;

        case "com.sap.vocabularies.UI.v1.Identification":
        case "com.sap.vocabularies.UI.v1.StatusInfo":
          if (referenceTarget.qualifier) {
            dataFieldCollection = referenceTarget;
          }

          break;

        default:
          break;
      }
    }

    actions = dataFieldCollection.reduce(function (actionReducer, dataField) {
      var _dataField$RequiresCo, _dataField$Inline, _dataField$Determinin, _dataField$Label, _dataField$Navigation, _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _dataField$annotation4, _dataField$annotation5, _dataField$Label2, _dataField$annotation6, _dataField$annotation7, _dataField$annotation8, _dataField$annotation9, _dataField$annotation10;

      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          if (((_dataField$RequiresCo = dataField.RequiresContext) === null || _dataField$RequiresCo === void 0 ? void 0 : _dataField$RequiresCo.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.REQUIRESCONTEXT);
          }

          if (((_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.INLINE);
          }

          if (((_dataField$Determinin = dataField.Determining) === null || _dataField$Determinin === void 0 ? void 0 : _dataField$Determinin.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.DETERMINING);
          }

          var mNavigationParameters = {};

          if (dataField.Mapping) {
            mNavigationParameters.semanticObjectMapping = getSemanticObjectMapping(dataField.Mapping);
          }

          actionReducer.push({
            type: ActionType.DataFieldForIntentBasedNavigation,
            id: getFormID({
              Facet: facetDefinition
            }, dataField),
            key: KeyHelper.generateKeyFromDataField(dataField),
            text: (_dataField$Label = dataField.Label) === null || _dataField$Label === void 0 ? void 0 : _dataField$Label.toString(),
            annotationPath: "",
            enabled: dataField.NavigationAvailable !== undefined ? compileExpression(equal(getExpressionFromAnnotation((_dataField$Navigation = dataField.NavigationAvailable) === null || _dataField$Navigation === void 0 ? void 0 : _dataField$Navigation.valueOf()), true)) : "true",
            visible: compileExpression(not(equal(getExpressionFromAnnotation((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()), true))),
            buttonType: getButtonType((_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : _dataField$annotation5.Emphasized),
            press: compileExpression(fn("._intentBasedNavigation.navigate", [getExpressionFromAnnotation(dataField.SemanticObject), getExpressionFromAnnotation(dataField.Action), mNavigationParameters])),
            customData: compileExpression({
              semanticObject: getExpressionFromAnnotation(dataField.SemanticObject),
              action: getExpressionFromAnnotation(dataField.Action)
            })
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          var formManifestActionsConfiguration = converterContext.getManifestControlConfiguration(referenceTarget).actions;
          var key = KeyHelper.generateKeyFromDataField(dataField);
          actionReducer.push({
            type: ActionType.DataFieldForAction,
            id: getFormID({
              Facet: facetDefinition
            }, dataField),
            key: key,
            text: (_dataField$Label2 = dataField.Label) === null || _dataField$Label2 === void 0 ? void 0 : _dataField$Label2.toString(),
            annotationPath: "",
            enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
            binding: navigationPropertyPath ? "{ 'path' : '".concat(navigationPropertyPath, "'}") : undefined,
            visible: compileExpression(not(equal(getExpressionFromAnnotation((_dataField$annotation6 = dataField.annotations) === null || _dataField$annotation6 === void 0 ? void 0 : (_dataField$annotation7 = _dataField$annotation6.UI) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.Hidden) === null || _dataField$annotation8 === void 0 ? void 0 : _dataField$annotation8.valueOf()), true))),
            requiresDialog: isDialog(dataField.ActionTarget),
            buttonType: getButtonType((_dataField$annotation9 = dataField.annotations) === null || _dataField$annotation9 === void 0 ? void 0 : (_dataField$annotation10 = _dataField$annotation9.UI) === null || _dataField$annotation10 === void 0 ? void 0 : _dataField$annotation10.Emphasized),
            press: compileExpression(fn("invokeAction", [dataField.Action, {
              contexts: fn("getBindingContext", [], pathInModel("", "$source")),
              invocationGrouping: dataField.InvocationGrouping === "UI.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated",
              label: getExpressionFromAnnotation(dataField.Label),
              model: fn("getModel", [], pathInModel("/", "$source")),
              isNavigable: isActionNavigable(formManifestActionsConfiguration && formManifestActionsConfiguration[key])
            }], ref(".editFlow"))),
            facetName: dataField.Inline ? facetDefinition.fullyQualifiedName : undefined
          });
          break;

        default:
          break;
      }

      return actionReducer;
    }, actions);
    return insertCustomElements(actions, manifestActions);
  }

  function isDialog(actionDefinition) {
    if (actionDefinition) {
      var _actionDefinition$ann, _actionDefinition$ann2;

      var bCritical = (_actionDefinition$ann = actionDefinition.annotations) === null || _actionDefinition$ann === void 0 ? void 0 : (_actionDefinition$ann2 = _actionDefinition$ann.Common) === null || _actionDefinition$ann2 === void 0 ? void 0 : _actionDefinition$ann2.IsActionCritical;

      if (actionDefinition.parameters.length > 1 || bCritical) {
        return "Dialog";
      } else {
        return "None";
      }
    } else {
      return "None";
    }
  }

  _exports.isDialog = isDialog;

  function createCustomSubSections(manifestSubSections, converterContext) {
    var subSections = {};
    Object.keys(manifestSubSections).forEach(function (subSectionKey) {
      return subSections[subSectionKey] = createCustomSubSection(manifestSubSections[subSectionKey], subSectionKey, converterContext);
    });
    return subSections;
  }

  _exports.createCustomSubSections = createCustomSubSections;

  function createCustomSubSection(manifestSubSection, subSectionKey, converterContext) {
    var sideContent = manifestSubSection.sideContent ? {
      template: manifestSubSection.sideContent.template,
      id: getSideContentID(subSectionKey),
      visible: false,
      equalSplit: manifestSubSection.sideContent.equalSplit
    } : undefined;
    var position = manifestSubSection.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    var isVisible = manifestSubSection.visible !== undefined ? manifestSubSection.visible : true;
    var isDynamicExpression = isVisible && typeof isVisible === "string" && isVisible.indexOf("{=") === 0;
    var manifestActions = getActionsFromManifest(manifestSubSection.actions, converterContext);
    var subSectionDefinition = {
      type: SubSectionType.Unknown,
      id: manifestSubSection.id || getCustomSubSectionID(subSectionKey),
      actions: manifestActions.actions,
      key: subSectionKey,
      title: manifestSubSection.title,
      level: 1,
      position: position,
      visible: manifestSubSection.visible !== undefined ? manifestSubSection.visible : true,
      sideContent: sideContent,
      isVisibilityDynamic: isDynamicExpression
    };

    if (manifestSubSection.template || manifestSubSection.name) {
      subSectionDefinition.type = SubSectionType.XMLFragment;
      subSectionDefinition.template = manifestSubSection.template || manifestSubSection.name || "";
    } else {
      subSectionDefinition.type = SubSectionType.Placeholder;
    }

    return subSectionDefinition;
  }
  /**
   * Evaluate if the condensed mode can be appli3ed on the table.
   *
   * @param currentFacet
   * @param facetsToCreateInSection
   * @param converterContext
   * @returns `true` for compliant, false otherwise
   */


  _exports.createCustomSubSection = createCustomSubSection;

  function getCondensedTableLayoutCompliance(currentFacet, facetsToCreateInSection, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();

    if (manifestWrapper.useIconTabBar()) {
      // If the OP use the tab based we check if the facets that will be created for this section are all non visible
      return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
    } else {
      var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3, _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

      var entityType = converterContext.getEntityType();

      if ((_entityType$annotatio = entityType.annotations) !== null && _entityType$annotatio !== void 0 && (_entityType$annotatio2 = _entityType$annotatio.UI) !== null && _entityType$annotatio2 !== void 0 && (_entityType$annotatio3 = _entityType$annotatio2.Facets) !== null && _entityType$annotatio3 !== void 0 && _entityType$annotatio3.length && ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Facets) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.length) > 1) {
        return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
      } else {
        return true;
      }
    }
  }

  function hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection) {
    return facetsToCreateInSection.every(function (subFacet) {
      if (subFacet !== currentFacet) {
        if (subFacet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
          var _refFacet$Target, _refFacet$Target$$tar, _refFacet$Target2, _refFacet$Target2$$ta, _refFacet$Target$$tar2;

          var refFacet = subFacet;

          if (((_refFacet$Target = refFacet.Target) === null || _refFacet$Target === void 0 ? void 0 : (_refFacet$Target$$tar = _refFacet$Target.$target) === null || _refFacet$Target$$tar === void 0 ? void 0 : _refFacet$Target$$tar.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_refFacet$Target2 = refFacet.Target) === null || _refFacet$Target2 === void 0 ? void 0 : (_refFacet$Target2$$ta = _refFacet$Target2.$target) === null || _refFacet$Target2$$ta === void 0 ? void 0 : _refFacet$Target2$$ta.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_refFacet$Target$$tar2 = refFacet.Target.$target) === null || _refFacet$Target$$tar2 === void 0 ? void 0 : _refFacet$Target$$tar2.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
            var _refFacet$annotations, _refFacet$annotations2, _refFacet$annotations3, _refFacet$annotations4;

            return ((_refFacet$annotations = refFacet.annotations) === null || _refFacet$annotations === void 0 ? void 0 : (_refFacet$annotations2 = _refFacet$annotations.UI) === null || _refFacet$annotations2 === void 0 ? void 0 : _refFacet$annotations2.Hidden) !== undefined ? (_refFacet$annotations3 = refFacet.annotations) === null || _refFacet$annotations3 === void 0 ? void 0 : (_refFacet$annotations4 = _refFacet$annotations3.UI) === null || _refFacet$annotations4 === void 0 ? void 0 : _refFacet$annotations4.Hidden : false;
          }

          return true;
        } else {
          var subCollectionFacet = subFacet;
          return subCollectionFacet.Facets.every(function (facet) {
            var _subRefFacet$Target, _subRefFacet$Target$$, _subRefFacet$Target2, _subRefFacet$Target2$, _subRefFacet$Target3, _subRefFacet$Target3$;

            var subRefFacet = facet;

            if (((_subRefFacet$Target = subRefFacet.Target) === null || _subRefFacet$Target === void 0 ? void 0 : (_subRefFacet$Target$$ = _subRefFacet$Target.$target) === null || _subRefFacet$Target$$ === void 0 ? void 0 : _subRefFacet$Target$$.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_subRefFacet$Target2 = subRefFacet.Target) === null || _subRefFacet$Target2 === void 0 ? void 0 : (_subRefFacet$Target2$ = _subRefFacet$Target2.$target) === null || _subRefFacet$Target2$ === void 0 ? void 0 : _subRefFacet$Target2$.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_subRefFacet$Target3 = subRefFacet.Target) === null || _subRefFacet$Target3 === void 0 ? void 0 : (_subRefFacet$Target3$ = _subRefFacet$Target3.$target) === null || _subRefFacet$Target3$ === void 0 ? void 0 : _subRefFacet$Target3$.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
              var _subRefFacet$annotati, _subRefFacet$annotati2, _subRefFacet$annotati3, _subRefFacet$annotati4;

              return ((_subRefFacet$annotati = subRefFacet.annotations) === null || _subRefFacet$annotati === void 0 ? void 0 : (_subRefFacet$annotati2 = _subRefFacet$annotati.UI) === null || _subRefFacet$annotati2 === void 0 ? void 0 : _subRefFacet$annotati2.Hidden) !== undefined ? (_subRefFacet$annotati3 = subRefFacet.annotations) === null || _subRefFacet$annotati3 === void 0 ? void 0 : (_subRefFacet$annotati4 = _subRefFacet$annotati3.UI) === null || _subRefFacet$annotati4 === void 0 ? void 0 : _subRefFacet$annotati4.Hidden : false;
            }

            return true;
          });
        }
      }

      return true;
    });
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdWJTZWN0aW9uVHlwZSIsInZpc3VhbGl6YXRpb25UZXJtcyIsImNyZWF0ZVN1YlNlY3Rpb25zIiwiZmFjZXRDb2xsZWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImlzSGVhZGVyU2VjdGlvbiIsImZhY2V0c1RvQ3JlYXRlIiwicmVkdWNlIiwiZmFjZXREZWZpbml0aW9uIiwiJFR5cGUiLCJwdXNoIiwiRmFjZXRzIiwiZmluZCIsImZhY2V0VHlwZSIsInNwbGljZSIsImxlbmd0aCIsIm1hcCIsImZhY2V0IiwiY3JlYXRlU3ViU2VjdGlvbiIsImNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMiLCJjdXN0b21IZWFkZXJGYWNldHMiLCJnZXRIZWFkZXJGYWNldHNGcm9tTWFuaWZlc3QiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXRIZWFkZXJGYWNldHMiLCJhQ3VzdG9tSGVhZGVyRmFjZXRzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJjdXN0b21IZWFkZXJGYWNldCIsInRlbXBsYXRlRWRpdCIsImNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbiIsInN1YlNlY3Rpb25JRCIsImdldEN1c3RvbVN1YlNlY3Rpb25JRCIsInN1YlNlY3Rpb24iLCJpZCIsInRpdGxlIiwidHlwZSIsIlhNTEZyYWdtZW50IiwidGVtcGxhdGUiLCJ2aXNpYmxlIiwibGV2ZWwiLCJzaWRlQ29udGVudCIsInVuZGVmaW5lZCIsInN0YXNoZWQiLCJmbGV4U2V0dGluZ3MiLCJhY3Rpb25zIiwiZ2V0U3ViU2VjdGlvbktleSIsImZhbGxiYWNrIiwiSUQiLCJ0b1N0cmluZyIsIkxhYmVsIiwiYWRkRm9ybU1lbnVBY3Rpb25zIiwiaGlkZGVuQWN0aW9ucyIsImdldEZvcm1IaWRkZW5BY3Rpb25zIiwiZm9ybUFjdGlvbnMiLCJnZXRGb3JtQWN0aW9ucyIsIm1hbmlmZXN0QWN0aW9ucyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJmb3JtQWxsQWN0aW9ucyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiY29tbWFuZCIsImdldFZpc2liaWxpdHlFbmFibGVtZW50Rm9ybU1lbnVBY3Rpb25zIiwicmVtb3ZlRHVwbGljYXRlQWN0aW9ucyIsImNvbW1hbmRBY3Rpb25zIiwiZ2V0RmFjZXRBY3Rpb25zIiwiQXJyYXkiLCJmaWx0ZXIiLCJzdWJGYWNldERlZmluaXRpb24iLCJpc1JlZmVyZW5jZUZhY2V0IiwiYWN0aW9uUmVkdWNlciIsInJlZmVyZW5jZUZhY2V0IiwiY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIiLCJnZXRCdXR0b25UeXBlIiwiZW1waGFzaXplZCIsImJ1dHRvblR5cGVDb25kaXRpb24iLCJlcXVhbCIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsImNvbXBpbGVFeHByZXNzaW9uIiwiaWZFbHNlIiwiQnV0dG9uVHlwZSIsIkdob3N0IiwiVHJhbnNwYXJlbnQiLCJoYXNTaW5nbGVDb250ZW50IiwiZ2V0U3ViU2VjdGlvbklEIiwiRmFjZXQiLCJvSGlkZGVuQW5ub3RhdGlvbiIsImFubm90YXRpb25zIiwiVUkiLCJIaWRkZW4iLCJpc1Zpc2libGUiLCJub3QiLCJpc0R5bmFtaWNFeHByZXNzaW9uIiwiaW5kZXhPZiIsImlzVmlzaWJsZUR5bmFtaWNFeHByZXNzaW9uIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJVbmtub3duIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiaXNWaXNpYmlsaXR5RHluYW1pYyIsImdldFN0YXNoZWRTZXR0aW5nc0ZvckhlYWRlckZhY2V0IiwiZGVzaWdudGltZSIsImdldERlc2lnblRpbWVNZXRhZGF0YVNldHRpbmdzRm9ySGVhZGVyRmFjZXQiLCJ1bnN1cHBvcnRlZFRleHQiLCJmYWNldHMiLCJ2aXN1YWxpemF0aW9uRmFjZXRzIiwiaW5kZXgiLCJpbmNsdWRlcyIsIlRhcmdldCIsIiR0YXJnZXQiLCJ0ZXJtIiwibm9uVmlzdWFsaXphdGlvbkZhY2V0cyIsInZpc3VhbGl6YXRpb24iLCJ2aXN1YWxpemF0aW9uQ29udGVudCIsImZvcm1Db250ZW50IiwibWl4ZWRDb250ZW50IiwiTG9nIiwid2FybmluZyIsIm1peGVkU3ViU2VjdGlvbiIsIk1peGVkIiwiY29udGVudCIsImZhY2V0QWN0aW9ucyIsImZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbiIsIkZvcm0iLCJmb3JtRGVmaW5pdGlvbiIsImNyZWF0ZUZvcm1EZWZpbml0aW9uIiwiYWN0aW9uIiwiZmFjZXROYW1lIiwidmFsdWUiLCJwcmVzZW50YXRpb24iLCJnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24iLCJnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UiLCJjb250cm9sVGl0bGUiLCJ2aXN1YWxpemF0aW9ucyIsImFubm90YXRpb24iLCJzaG93VGl0bGUiLCJpc1N1YnNlY3Rpb25UaXRsZVNob3duIiwidGl0bGVWaXNpYmxlRXhwcmVzc2lvbiIsImRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbiIsIkRhdGFWaXN1YWxpemF0aW9uIiwidGl0bGVWaXNpYmxlIiwiZm9ybUVsZW1lbnRTdWJTZWN0aW9uIiwidW5zdXBwb3J0ZWRTdWJTZWN0aW9uIiwidGV4dCIsInN1YlNlY3Rpb25UaXRsZSIsInJlZmVyZW5jZVRhcmdldCIsInRhcmdldFZhbHVlIiwiZGF0YUZpZWxkQ29sbGVjdGlvbiIsInNwbGl0IiwibmF2aWdhdGlvblByb3BlcnR5UGF0aCIsInN1YnN0ciIsIkRhdGEiLCJnZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uIiwicXVhbGlmaWVyIiwiZGF0YUZpZWxkIiwiUmVxdWlyZXNDb250ZXh0IiwidmFsdWVPZiIsImdldERpYWdub3N0aWNzIiwiYWRkSXNzdWUiLCJJc3N1ZUNhdGVnb3J5IiwiQW5ub3RhdGlvbiIsIklzc3VlU2V2ZXJpdHkiLCJMb3ciLCJJc3N1ZVR5cGUiLCJNQUxGT1JNRURfREFUQUZJRUxEX0ZPUl9JQk4iLCJSRVFVSVJFU0NPTlRFWFQiLCJJbmxpbmUiLCJJTkxJTkUiLCJEZXRlcm1pbmluZyIsIkRFVEVSTUlOSU5HIiwibU5hdmlnYXRpb25QYXJhbWV0ZXJzIiwiTWFwcGluZyIsInNlbWFudGljT2JqZWN0TWFwcGluZyIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsIkFjdGlvblR5cGUiLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJnZXRGb3JtSUQiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJlbmFibGVkIiwiTmF2aWdhdGlvbkF2YWlsYWJsZSIsImJ1dHRvblR5cGUiLCJFbXBoYXNpemVkIiwicHJlc3MiLCJmbiIsIlNlbWFudGljT2JqZWN0IiwiQWN0aW9uIiwiY3VzdG9tRGF0YSIsInNlbWFudGljT2JqZWN0IiwiZm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb24iLCJEYXRhRmllbGRGb3JBY3Rpb24iLCJnZXRFbmFibGVkRm9yQW5ub3RhdGlvbkFjdGlvbiIsIkFjdGlvblRhcmdldCIsImJpbmRpbmciLCJyZXF1aXJlc0RpYWxvZyIsImlzRGlhbG9nIiwiY29udGV4dHMiLCJwYXRoSW5Nb2RlbCIsImludm9jYXRpb25Hcm91cGluZyIsIkludm9jYXRpb25Hcm91cGluZyIsImxhYmVsIiwibW9kZWwiLCJpc05hdmlnYWJsZSIsImlzQWN0aW9uTmF2aWdhYmxlIiwicmVmIiwiYWN0aW9uRGVmaW5pdGlvbiIsImJDcml0aWNhbCIsIkNvbW1vbiIsIklzQWN0aW9uQ3JpdGljYWwiLCJwYXJhbWV0ZXJzIiwiY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbnMiLCJtYW5pZmVzdFN1YlNlY3Rpb25zIiwic3ViU2VjdGlvbnMiLCJzdWJTZWN0aW9uS2V5IiwiY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbiIsIm1hbmlmZXN0U3ViU2VjdGlvbiIsImdldFNpZGVDb250ZW50SUQiLCJlcXVhbFNwbGl0IiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJBZnRlciIsInN1YlNlY3Rpb25EZWZpbml0aW9uIiwibmFtZSIsIlBsYWNlaG9sZGVyIiwiY3VycmVudEZhY2V0IiwiZmFjZXRzVG9DcmVhdGVJblNlY3Rpb24iLCJtYW5pZmVzdFdyYXBwZXIiLCJ1c2VJY29uVGFiQmFyIiwiaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyIsImVudGl0eVR5cGUiLCJnZXRFbnRpdHlUeXBlIiwiZXZlcnkiLCJzdWJGYWNldCIsInJlZkZhY2V0Iiwic3ViQ29sbGVjdGlvbkZhY2V0Iiwic3ViUmVmRmFjZXQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlN1YlNlY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQ29tbXVuaWNhdGlvblwiO1xuaW1wb3J0IHR5cGUge1xuXHRDb2xsZWN0aW9uRmFjZXRUeXBlcyxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RW1waGFzaXplZCxcblx0RmFjZXRUeXBlcyxcblx0RmllbGRHcm91cCxcblx0T3BlcmF0aW9uR3JvdXBpbmdUeXBlLFxuXHRSZWZlcmVuY2VGYWNldCxcblx0UmVmZXJlbmNlRmFjZXRUeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgeyBVSUFubm90YXRpb25UZXJtcywgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB0eXBlIHsgQmFzZUFjdGlvbiwgQ29tYmluZWRBY3Rpb24sIENvbnZlcnRlckFjdGlvbiwgQ3VzdG9tQWN0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHtcblx0QnV0dG9uVHlwZSxcblx0Z2V0QWN0aW9uc0Zyb21NYW5pZmVzdCxcblx0Z2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24sXG5cdGdldFNlbWFudGljT2JqZWN0TWFwcGluZyxcblx0aXNBY3Rpb25OYXZpZ2FibGUsXG5cdHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnNcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHR5cGUgeyBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQsIEZsZXhTZXR0aW5ncyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL09iamVjdFBhZ2UvSGVhZGVyRmFjZXRcIjtcbmltcG9ydCB7XG5cdGdldERlc2lnblRpbWVNZXRhZGF0YVNldHRpbmdzRm9ySGVhZGVyRmFjZXQsXG5cdGdldEhlYWRlckZhY2V0c0Zyb21NYW5pZmVzdCxcblx0Z2V0U3Rhc2hlZFNldHRpbmdzRm9ySGVhZGVyRmFjZXRcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvT2JqZWN0UGFnZS9IZWFkZXJGYWNldFwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSwgSXNzdWVTZXZlcml0eSwgSXNzdWVUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgdHlwZSB7IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7XG5cdGNvbXBpbGVFeHByZXNzaW9uLFxuXHRlcXVhbCxcblx0Zm4sXG5cdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbixcblx0aWZFbHNlLFxuXHRub3QsXG5cdHBhdGhJbk1vZGVsLFxuXHRyZWZcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB0eXBlIENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uLy4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB0eXBlIHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDb25maWd1cmFibGVSZWNvcmQsIEN1c3RvbUVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IGluc2VydEN1c3RvbUVsZW1lbnRzLCBQbGFjZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IGdldEN1c3RvbVN1YlNlY3Rpb25JRCwgZ2V0Rm9ybUlELCBnZXRTaWRlQ29udGVudElELCBnZXRTdWJTZWN0aW9uSUQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9JRFwiO1xuaW1wb3J0IHR5cGUgeyBNYW5pZmVzdEFjdGlvbiwgTWFuaWZlc3RTdWJTZWN0aW9uIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgZ2V0Rm9ybUFjdGlvbnMsIGdldEZvcm1IaWRkZW5BY3Rpb25zLCBnZXRWaXNpYmlsaXR5RW5hYmxlbWVudEZvcm1NZW51QWN0aW9ucyB9IGZyb20gXCIuLi8uLi9vYmplY3RQYWdlL0Zvcm1NZW51QWN0aW9uc1wiO1xuaW1wb3J0IHR5cGUgeyBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb24gfSBmcm9tIFwiLi4vQ29tbW9uL0RhdGFWaXN1YWxpemF0aW9uXCI7XG5pbXBvcnQgeyBnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vQ29tbW9uL0RhdGFWaXN1YWxpemF0aW9uXCI7XG5pbXBvcnQgdHlwZSB7IEZvcm1EZWZpbml0aW9uIH0gZnJvbSBcIi4uL0NvbW1vbi9Gb3JtXCI7XG5pbXBvcnQgeyBjcmVhdGVGb3JtRGVmaW5pdGlvbiwgaXNSZWZlcmVuY2VGYWNldCB9IGZyb20gXCIuLi9Db21tb24vRm9ybVwiO1xuXG5leHBvcnQgZW51bSBTdWJTZWN0aW9uVHlwZSB7XG5cdFVua25vd24gPSBcIlVua25vd25cIiwgLy8gRGVmYXVsdCBUeXBlXG5cdEZvcm0gPSBcIkZvcm1cIixcblx0RGF0YVZpc3VhbGl6YXRpb24gPSBcIkRhdGFWaXN1YWxpemF0aW9uXCIsXG5cdFhNTEZyYWdtZW50ID0gXCJYTUxGcmFnbWVudFwiLFxuXHRQbGFjZWhvbGRlciA9IFwiUGxhY2Vob2xkZXJcIixcblx0TWl4ZWQgPSBcIk1peGVkXCJcbn1cblxuZXhwb3J0IHR5cGUgT2JqZWN0UGFnZVN1YlNlY3Rpb24gPVxuXHR8IFVuc3VwcG9ydGVkU3ViU2VjdGlvblxuXHR8IEZvcm1TdWJTZWN0aW9uXG5cdHwgRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uXG5cdHwgQ29udGFjdFN1YlNlY3Rpb25cblx0fCBYTUxGcmFnbWVudFN1YlNlY3Rpb25cblx0fCBQbGFjZWhvbGRlckZyYWdtZW50U3ViU2VjdGlvblxuXHR8IE1peGVkU3ViU2VjdGlvbjtcblxudHlwZSBCYXNlU3ViU2VjdGlvbiA9IHtcblx0aWQ6IHN0cmluZztcblx0a2V5OiBzdHJpbmc7XG5cdHRpdGxlOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0dHlwZTogU3ViU2VjdGlvblR5cGU7XG5cdHZpc2libGU6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHRpc1Zpc2liaWxpdHlEeW5hbWljPzogYm9vbGVhbiB8IFwiXCI7XG5cdGZsZXhTZXR0aW5ncz86IEZsZXhTZXR0aW5ncztcblx0c3Rhc2hlZD86IGJvb2xlYW47XG5cdGxldmVsOiBudW1iZXI7XG5cdGNvbnRlbnQ/OiBBcnJheTxPYmplY3RQYWdlU3ViU2VjdGlvbj47XG5cdHNpZGVDb250ZW50PzogU2lkZUNvbnRlbnREZWY7XG59O1xuXG50eXBlIFVuc3VwcG9ydGVkU3ViU2VjdGlvbiA9IEJhc2VTdWJTZWN0aW9uICYge1xuXHR0ZXh0OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBEYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuRGF0YVZpc3VhbGl6YXRpb247XG5cdHByZXNlbnRhdGlvbjogRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uO1xuXHRzaG93VGl0bGU6IGJvb2xlYW47XG5cdHRpdGxlVmlzaWJsZT86IHN0cmluZyB8IGJvb2xlYW47XG59O1xuXG50eXBlIENvbnRhY3RTdWJTZWN0aW9uID0gVW5zdXBwb3J0ZWRTdWJTZWN0aW9uO1xuXG50eXBlIFhNTEZyYWdtZW50U3ViU2VjdGlvbiA9IE9taXQ8QmFzZVN1YlNlY3Rpb24sIFwiYW5ub3RhdGlvblBhdGhcIj4gJiB7XG5cdHR5cGU6IFN1YlNlY3Rpb25UeXBlLlhNTEZyYWdtZW50O1xuXHR0ZW1wbGF0ZTogc3RyaW5nO1xuXHRhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+O1xufTtcblxudHlwZSBQbGFjZWhvbGRlckZyYWdtZW50U3ViU2VjdGlvbiA9IE9taXQ8QmFzZVN1YlNlY3Rpb24sIFwiYW5ub3RhdGlvblBhdGhcIj4gJiB7XG5cdHR5cGU6IFN1YlNlY3Rpb25UeXBlLlBsYWNlaG9sZGVyO1xuXHRhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+O1xufTtcblxudHlwZSBNaXhlZFN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0Y29udGVudDogQXJyYXk8T2JqZWN0UGFnZVN1YlNlY3Rpb24+O1xufTtcblxuZXhwb3J0IHR5cGUgRm9ybVN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybTtcblx0Zm9ybURlZmluaXRpb246IEZvcm1EZWZpbml0aW9uO1xuXHRhY3Rpb25zOiBDb252ZXJ0ZXJBY3Rpb25bXSB8IEJhc2VBY3Rpb25bXTtcblx0Y29tbWFuZEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj47XG59O1xuXG5leHBvcnQgdHlwZSBPYmplY3RQYWdlU2VjdGlvbiA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0aWQ6IHN0cmluZztcblx0dGl0bGU6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHRzaG93VGl0bGU/OiBib29sZWFuO1xuXHR2aXNpYmxlOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0c3ViU2VjdGlvbnM6IE9iamVjdFBhZ2VTdWJTZWN0aW9uW107XG59O1xuXG50eXBlIFNpZGVDb250ZW50RGVmID0ge1xuXHR0ZW1wbGF0ZT86IHN0cmluZztcblx0aWQ/OiBzdHJpbmc7XG5cdHNpZGVDb250ZW50RmFsbERvd24/OiBzdHJpbmc7XG5cdGNvbnRhaW5lclF1ZXJ5Pzogc3RyaW5nO1xuXHR2aXNpYmxlPzogYm9vbGVhbjtcblx0ZXF1YWxTcGxpdD86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBDdXN0b21PYmplY3RQYWdlU2VjdGlvbiA9IEN1c3RvbUVsZW1lbnQ8T2JqZWN0UGFnZVNlY3Rpb24+O1xuXG5leHBvcnQgdHlwZSBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbiA9IEN1c3RvbUVsZW1lbnQ8T2JqZWN0UGFnZVN1YlNlY3Rpb24+O1xuXG5jb25zdCB2aXN1YWxpemF0aW9uVGVybXM6IHN0cmluZ1tdID0gW1xuXHRVSUFubm90YXRpb25UZXJtcy5MaW5lSXRlbSxcblx0VUlBbm5vdGF0aW9uVGVybXMuQ2hhcnQsXG5cdFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQsXG5cdFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcbl07XG5cbi8qKlxuICogQ3JlYXRlIHN1YnNlY3Rpb25zIGJhc2VkIG9uIGZhY2V0IGRlZmluaXRpb24uXG4gKlxuICogQHBhcmFtIGZhY2V0Q29sbGVjdGlvbiBDb2xsZWN0aW9uIG9mIGZhY2V0c1xuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gaXNIZWFkZXJTZWN0aW9uIFRydWUgaWYgaGVhZGVyIHNlY3Rpb24gaXMgZ2VuZXJhdGVkIGluIHRoaXMgaXRlcmF0aW9uXG4gKiBAcmV0dXJucyBUaGUgY3VycmVudCBzdWJzZWN0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3ViU2VjdGlvbnMoXG5cdGZhY2V0Q29sbGVjdGlvbjogRmFjZXRUeXBlc1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRpc0hlYWRlclNlY3Rpb24/OiBib29sZWFuXG4pOiBPYmplY3RQYWdlU3ViU2VjdGlvbltdIHtcblx0Ly8gRmlyc3Qgd2UgZGV0ZXJtaW5lIHdoaWNoIHN1YiBzZWN0aW9uIHdlIG5lZWQgdG8gY3JlYXRlXG5cdGNvbnN0IGZhY2V0c1RvQ3JlYXRlID0gZmFjZXRDb2xsZWN0aW9uLnJlZHVjZSgoZmFjZXRzVG9DcmVhdGU6IEZhY2V0VHlwZXNbXSwgZmFjZXREZWZpbml0aW9uKSA9PiB7XG5cdFx0c3dpdGNoIChmYWNldERlZmluaXRpb24uJFR5cGUpIHtcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQ6XG5cdFx0XHRcdGZhY2V0c1RvQ3JlYXRlLnB1c2goZmFjZXREZWZpbml0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldDpcblx0XHRcdFx0Ly8gVE9ETyBJZiB0aGUgQ29sbGVjdGlvbiBGYWNldCBoYXMgYSBjaGlsZCBvZiB0eXBlIENvbGxlY3Rpb24gRmFjZXQgd2UgYnJpbmcgdGhlbSB1cCBvbmUgbGV2ZWwgKEZvcm0gKyBUYWJsZSB1c2UgY2FzZSkgP1xuXHRcdFx0XHQvLyBmaXJzdCBjYXNlIGZhY2V0IENvbGxlY3Rpb24gaXMgY29tYmluYXRpb24gb2YgY29sbGVjdGlvbiBhbmQgcmVmZXJlbmNlIGZhY2V0IG9yIG5vdCBhbGwgZmFjZXRzIGFyZSByZWZlcmVuY2UgZmFjZXRzLlxuXHRcdFx0XHRpZiAoZmFjZXREZWZpbml0aW9uLkZhY2V0cy5maW5kKChmYWNldFR5cGUpID0+IGZhY2V0VHlwZS4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSkge1xuXHRcdFx0XHRcdGZhY2V0c1RvQ3JlYXRlLnNwbGljZShmYWNldHNUb0NyZWF0ZS5sZW5ndGgsIDAsIC4uLmZhY2V0RGVmaW5pdGlvbi5GYWNldHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZhY2V0c1RvQ3JlYXRlLnB1c2goZmFjZXREZWZpbml0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlVVJMRmFjZXQ6XG5cdFx0XHRcdC8vIE5vdCBzdXBwb3J0ZWRcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHJldHVybiBmYWNldHNUb0NyZWF0ZTtcblx0fSwgW10pO1xuXG5cdC8vIFRoZW4gd2UgY3JlYXRlIHRoZSBhY3R1YWwgc3Vic2VjdGlvbnNcblx0cmV0dXJuIGZhY2V0c1RvQ3JlYXRlLm1hcCgoZmFjZXQpID0+XG5cdFx0Y3JlYXRlU3ViU2VjdGlvbihmYWNldCwgZmFjZXRzVG9DcmVhdGUsIGNvbnZlcnRlckNvbnRleHQsIDAsICEoZmFjZXQgYXMgYW55KT8uRmFjZXRzPy5sZW5ndGgsIGlzSGVhZGVyU2VjdGlvbilcblx0KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHN1YnNlY3Rpb25zIGJhc2VkIG9uIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBjdXN0b20gaGVhZGVyIGZhY2V0LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgVGhlIGN1cnJlbnQgc3Vic2VjdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IE9iamVjdFBhZ2VTdWJTZWN0aW9uW10ge1xuXHRjb25zdCBjdXN0b21IZWFkZXJGYWNldHM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VIZWFkZXJGYWNldD4gPSBnZXRIZWFkZXJGYWNldHNGcm9tTWFuaWZlc3QoXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5nZXRIZWFkZXJGYWNldHMoKVxuXHQpO1xuXHRjb25zdCBhQ3VzdG9tSGVhZGVyRmFjZXRzOiBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXRbXSA9IFtdO1xuXHRPYmplY3Qua2V5cyhjdXN0b21IZWFkZXJGYWNldHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGFDdXN0b21IZWFkZXJGYWNldHMucHVzaChjdXN0b21IZWFkZXJGYWNldHNba2V5XSk7XG5cdFx0cmV0dXJuIGFDdXN0b21IZWFkZXJGYWNldHM7XG5cdH0pO1xuXHRjb25zdCBmYWNldHNUb0NyZWF0ZSA9IGFDdXN0b21IZWFkZXJGYWNldHMucmVkdWNlKChmYWNldHNUb0NyZWF0ZTogQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0W10sIGN1c3RvbUhlYWRlckZhY2V0KSA9PiB7XG5cdFx0aWYgKGN1c3RvbUhlYWRlckZhY2V0LnRlbXBsYXRlRWRpdCkge1xuXHRcdFx0ZmFjZXRzVG9DcmVhdGUucHVzaChjdXN0b21IZWFkZXJGYWNldCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWNldHNUb0NyZWF0ZTtcblx0fSwgW10pO1xuXG5cdHJldHVybiBmYWNldHNUb0NyZWF0ZS5tYXAoKGN1c3RvbUhlYWRlckZhY2V0KSA9PiBjcmVhdGVDdXN0b21IZWFkZXJGYWNldFN1YlNlY3Rpb24oY3VzdG9tSGVhZGVyRmFjZXQpKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc3Vic2VjdGlvbiBiYXNlZCBvbiBhIGN1c3RvbSBoZWFkZXIgZmFjZXQuXG4gKlxuICogQHBhcmFtIGN1c3RvbUhlYWRlckZhY2V0IEEgY3VzdG9tIGhlYWRlciBmYWNldFxuICogQHJldHVybnMgQSBkZWZpbml0aW9uIGZvciBhIHN1YnNlY3Rpb25cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9uKGN1c3RvbUhlYWRlckZhY2V0OiBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQpOiBPYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHN1YlNlY3Rpb25JRCA9IGdldEN1c3RvbVN1YlNlY3Rpb25JRChjdXN0b21IZWFkZXJGYWNldC5rZXkpO1xuXHRjb25zdCBzdWJTZWN0aW9uOiBYTUxGcmFnbWVudFN1YlNlY3Rpb24gPSB7XG5cdFx0aWQ6IHN1YlNlY3Rpb25JRCxcblx0XHRrZXk6IGN1c3RvbUhlYWRlckZhY2V0LmtleSxcblx0XHR0aXRsZTogY3VzdG9tSGVhZGVyRmFjZXQudGl0bGUsXG5cdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuWE1MRnJhZ21lbnQsXG5cdFx0dGVtcGxhdGU6IGN1c3RvbUhlYWRlckZhY2V0LnRlbXBsYXRlRWRpdCB8fCBcIlwiLFxuXHRcdHZpc2libGU6IGN1c3RvbUhlYWRlckZhY2V0LnZpc2libGUsXG5cdFx0bGV2ZWw6IDEsXG5cdFx0c2lkZUNvbnRlbnQ6IHVuZGVmaW5lZCxcblx0XHRzdGFzaGVkOiBjdXN0b21IZWFkZXJGYWNldC5zdGFzaGVkLFxuXHRcdGZsZXhTZXR0aW5nczogY3VzdG9tSGVhZGVyRmFjZXQuZmxleFNldHRpbmdzLFxuXHRcdGFjdGlvbnM6IHt9XG5cdH07XG5cdHJldHVybiBzdWJTZWN0aW9uO1xufVxuXG4vLyBmdW5jdGlvbiBpc1RhcmdldEZvckNvbXBsaWFudChhbm5vdGF0aW9uUGF0aDogQW5ub3RhdGlvblBhdGgpIHtcbi8vIFx0cmV0dXJuIC8uKmNvbVxcLnNhcFxcLnZvY2FidWxhcmllc1xcLlVJXFwudjFcXC4oRmllbGRHcm91cHxJZGVudGlmaWNhdGlvbnxEYXRhUG9pbnR8U3RhdHVzSW5mbykuKi8udGVzdChhbm5vdGF0aW9uUGF0aC52YWx1ZSk7XG4vLyB9XG5jb25zdCBnZXRTdWJTZWN0aW9uS2V5ID0gKGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgZmFsbGJhY2s6IHN0cmluZyk6IHN0cmluZyA9PiB7XG5cdHJldHVybiBmYWNldERlZmluaXRpb24uSUQ/LnRvU3RyaW5nKCkgfHwgZmFjZXREZWZpbml0aW9uLkxhYmVsPy50b1N0cmluZygpIHx8IGZhbGxiYWNrO1xufTtcbi8qKlxuICogQWRkcyBGb3JtIG1lbnUgYWN0aW9uIHRvIGFsbCBmb3JtIGFjdGlvbnMsIHJlbW92ZXMgZHVwbGljYXRlIGFjdGlvbnMgYW5kIGhpZGRlbiBhY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBhY3Rpb25zIFRoZSBhY3Rpb25zIGludm9sdmVkXG4gKiBAcGFyYW0gZmFjZXREZWZpbml0aW9uIFRoZSBkZWZpbml0aW9uIGZvciB0aGUgZmFjZXRcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgVGhlIGZvcm0gbWVudSBhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIGFkZEZvcm1NZW51QWN0aW9ucyhhY3Rpb25zOiBDb252ZXJ0ZXJBY3Rpb25bXSwgZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29tYmluZWRBY3Rpb24ge1xuXHRjb25zdCBoaWRkZW5BY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBnZXRGb3JtSGlkZGVuQWN0aW9ucyhmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpIHx8IFtdLFxuXHRcdGZvcm1BY3Rpb25zOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0gZ2V0Rm9ybUFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KGZvcm1BY3Rpb25zLCBjb252ZXJ0ZXJDb250ZXh0LCBhY3Rpb25zLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgaGlkZGVuQWN0aW9ucyksXG5cdFx0Zm9ybUFsbEFjdGlvbnMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhhY3Rpb25zLCBtYW5pZmVzdEFjdGlvbnMuYWN0aW9ucywgeyBjb21tYW5kOiBcIm92ZXJ3cml0ZVwiIH0pO1xuXHRyZXR1cm4ge1xuXHRcdFwiYWN0aW9uc1wiOiBmb3JtQWxsQWN0aW9ucyA/IGdldFZpc2liaWxpdHlFbmFibGVtZW50Rm9ybU1lbnVBY3Rpb25zKHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMoZm9ybUFsbEFjdGlvbnMpKSA6IGFjdGlvbnMsXG5cdFx0XCJjb21tYW5kQWN0aW9uc1wiOiBtYW5pZmVzdEFjdGlvbnMuY29tbWFuZEFjdGlvbnNcblx0fTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGFjdGlvbiBmb3JtIGEgZmFjZXQuXG4gKlxuICogQHBhcmFtIGZhY2V0RGVmaW5pdGlvblxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBjdXJyZW50IGZhY2V0IGFjdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0RmFjZXRBY3Rpb25zKGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IENvbWJpbmVkQWN0aW9uIHtcblx0bGV0IGFjdGlvbnMgPSBuZXcgQXJyYXk8Q29udmVydGVyQWN0aW9uPigpO1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0OlxuXHRcdFx0YWN0aW9ucyA9IChcblx0XHRcdFx0ZmFjZXREZWZpbml0aW9uLkZhY2V0cy5maWx0ZXIoKHN1YkZhY2V0RGVmaW5pdGlvbikgPT4gaXNSZWZlcmVuY2VGYWNldChzdWJGYWNldERlZmluaXRpb24pKSBhcyBSZWZlcmVuY2VGYWNldFR5cGVzW11cblx0XHRcdCkucmVkdWNlKFxuXHRcdFx0XHQoYWN0aW9uUmVkdWNlcjogQ29udmVydGVyQWN0aW9uW10sIHJlZmVyZW5jZUZhY2V0KSA9PlxuXHRcdFx0XHRcdGNyZWF0ZUZvcm1BY3Rpb25SZWR1Y2VyKGFjdGlvblJlZHVjZXIsIHJlZmVyZW5jZUZhY2V0LCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0W11cblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0YWN0aW9ucyA9IGNyZWF0ZUZvcm1BY3Rpb25SZWR1Y2VyKFtdLCBmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGJyZWFrO1xuXHR9XG5cdHJldHVybiBhZGRGb3JtTWVudUFjdGlvbnMoYWN0aW9ucywgZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgYnV0dG9uIHR5cGUgYmFzZWQgb24gQFVJLkVtcGhhc2l6ZWQgYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gZW1waGFzaXplZCBFbXBoYXNpemVkIGFubm90YXRpb24gdmFsdWUuXG4gKiBAcmV0dXJucyBUaGUgYnV0dG9uIHR5cGUgb3IgcGF0aCBiYXNlZCBleHByZXNzaW9uLlxuICovXG5mdW5jdGlvbiBnZXRCdXR0b25UeXBlKGVtcGhhc2l6ZWQ6IEVtcGhhc2l6ZWQgfCB1bmRlZmluZWQpOiBCdXR0b25UeXBlIHtcblx0Ly8gRW1waGFzaXplZCBpcyBhIGJvb2xlYW4gc28gaWYgaXQncyBlcXVhbCB0byB0cnVlIHdlIHNob3cgdGhlIGJ1dHRvbiBhcyBHaG9zdCwgb3RoZXJ3aXNlIGFzIFRyYW5zcGFyZW50XG5cdGNvbnN0IGJ1dHRvblR5cGVDb25kaXRpb24gPSBlcXVhbChnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZW1waGFzaXplZCksIHRydWUpO1xuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKGJ1dHRvblR5cGVDb25kaXRpb24sIEJ1dHRvblR5cGUuR2hvc3QsIEJ1dHRvblR5cGUuVHJhbnNwYXJlbnQpKSBhcyBCdXR0b25UeXBlO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHN1YnNlY3Rpb24gYmFzZWQgb24gRmFjZXRUeXBlcy5cbiAqXG4gKiBAcGFyYW0gZmFjZXREZWZpbml0aW9uXG4gKiBAcGFyYW0gZmFjZXRzVG9DcmVhdGVcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gbGV2ZWxcbiAqIEBwYXJhbSBoYXNTaW5nbGVDb250ZW50XG4gKiBAcGFyYW0gaXNIZWFkZXJTZWN0aW9uXG4gKiBAcmV0dXJucyBBIHN1YnNlY3Rpb24gZGVmaW5pdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3ViU2VjdGlvbihcblx0ZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRmYWNldHNUb0NyZWF0ZTogRmFjZXRUeXBlc1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRsZXZlbDogbnVtYmVyLFxuXHRoYXNTaW5nbGVDb250ZW50OiBib29sZWFuLFxuXHRpc0hlYWRlclNlY3Rpb24/OiBib29sZWFuXG4pOiBPYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHN1YlNlY3Rpb25JRCA9IGdldFN1YlNlY3Rpb25JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSk7XG5cdGNvbnN0IG9IaWRkZW5Bbm5vdGF0aW9uOiBhbnkgPSBmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW47XG5cdGNvbnN0IGlzVmlzaWJsZSA9IGNvbXBpbGVFeHByZXNzaW9uKG5vdChlcXVhbCh0cnVlLCBnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24ob0hpZGRlbkFubm90YXRpb24pKSkpO1xuXHRjb25zdCBpc0R5bmFtaWNFeHByZXNzaW9uID1cblx0XHRpc1Zpc2libGUgJiYgdHlwZW9mIGlzVmlzaWJsZSA9PT0gXCJzdHJpbmdcIiAmJiBpc1Zpc2libGUuaW5kZXhPZihcIns9XCIpID09PSAwICYmIG9IaWRkZW5Bbm5vdGF0aW9uPy50eXBlICE9PSBcIlBhdGhcIjtcblx0Y29uc3QgaXNWaXNpYmxlRHluYW1pY0V4cHJlc3Npb24gPVxuXHRcdGlzVmlzaWJsZSAmJiBpc0R5bmFtaWNFeHByZXNzaW9uID8gaXNWaXNpYmxlLnN1YnN0cmluZyhpc1Zpc2libGUuaW5kZXhPZihcIns9XCIpICsgMiwgaXNWaXNpYmxlLmxhc3RJbmRleE9mKFwifVwiKSkgOiBmYWxzZTtcblx0Y29uc3QgdGl0bGUgPSBjb21waWxlRXhwcmVzc2lvbihnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZmFjZXREZWZpbml0aW9uLkxhYmVsKSk7XG5cdGNvbnN0IHN1YlNlY3Rpb246IEJhc2VTdWJTZWN0aW9uID0ge1xuXHRcdGlkOiBzdWJTZWN0aW9uSUQsXG5cdFx0a2V5OiBnZXRTdWJTZWN0aW9uS2V5KGZhY2V0RGVmaW5pdGlvbiwgc3ViU2VjdGlvbklEKSxcblx0XHR0aXRsZTogdGl0bGUsXG5cdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuVW5rbm93bixcblx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdHZpc2libGU6IGlzVmlzaWJsZSxcblx0XHRpc1Zpc2liaWxpdHlEeW5hbWljOiBpc0R5bmFtaWNFeHByZXNzaW9uLFxuXHRcdGxldmVsOiBsZXZlbCxcblx0XHRzaWRlQ29udGVudDogdW5kZWZpbmVkXG5cdH07XG5cdGlmIChpc0hlYWRlclNlY3Rpb24pIHtcblx0XHRzdWJTZWN0aW9uLnN0YXNoZWQgPSBnZXRTdGFzaGVkU2V0dGluZ3NGb3JIZWFkZXJGYWNldChmYWNldERlZmluaXRpb24sIGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0c3ViU2VjdGlvbi5mbGV4U2V0dGluZ3MgPSB7XG5cdFx0XHRkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGFTZXR0aW5nc0ZvckhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbiwgZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KVxuXHRcdH07XG5cdH1cblx0bGV0IHVuc3VwcG9ydGVkVGV4dCA9IFwiXCI7XG5cdGxldmVsKys7XG5cdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHRjb25zdCBmYWNldHMgPSBmYWNldERlZmluaXRpb24uRmFjZXRzO1xuXG5cdFx0XHQvLyBGaWx0ZXIgZm9yIGFsbCBmYWNldHMgb2YgdGhpcyBzdWJzZWN0aW9uIHRoYXQgYXJlIHJlZmVycmluZyB0byBhbiBhbm5vdGF0aW9uIGRlc2NyaWJpbmcgYSB2aXN1YWxpemF0aW9uIChlLmcuIHRhYmxlIG9yIGNoYXJ0KVxuXHRcdFx0Y29uc3QgdmlzdWFsaXphdGlvbkZhY2V0cyA9IGZhY2V0c1xuXHRcdFx0XHQubWFwKChmYWNldCwgaW5kZXgpID0+ICh7IGluZGV4LCBmYWNldCB9KSkgLy8gUmVtZW1iZXIgdGhlIGluZGV4IGFzc2lnbmVkIHRvIGVhY2ggZmFjZXRcblx0XHRcdFx0LmZpbHRlcigoeyBmYWNldCB9KSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHZpc3VhbGl6YXRpb25UZXJtcy5pbmNsdWRlcygoZmFjZXQgYXMgUmVmZXJlbmNlRmFjZXQpLlRhcmdldD8uJHRhcmdldD8udGVybSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IGFsbCB2aXN1YWxpemF0aW9uIGZhY2V0czsgXCJ2aXN1YWxpemF0aW9uRmFjZXRzXCIgYW5kIFwibm9uVmlzdWFsaXphdGlvbkZhY2V0c1wiIGFyZSBkaXNqb2ludFxuXHRcdFx0Y29uc3Qgbm9uVmlzdWFsaXphdGlvbkZhY2V0cyA9IGZhY2V0cy5maWx0ZXIoXG5cdFx0XHRcdChmYWNldCkgPT4gIXZpc3VhbGl6YXRpb25GYWNldHMuZmluZCgodmlzdWFsaXphdGlvbikgPT4gdmlzdWFsaXphdGlvbi5mYWNldCA9PT0gZmFjZXQpXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAodmlzdWFsaXphdGlvbkZhY2V0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdC8vIENvbGxlY3Rpb25GYWNldHMgd2l0aCB2aXN1YWxpemF0aW9ucyBtdXN0IGJlIGhhbmRsZWQgc2VwYXJhdGVseSBhcyB0aGV5IGNhbm5vdCBiZSBpbmNsdWRlZCBpbiBmb3Jtc1xuXHRcdFx0XHRjb25zdCB2aXN1YWxpemF0aW9uQ29udGVudDogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSA9IFtdO1xuXHRcdFx0XHRjb25zdCBmb3JtQ29udGVudDogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSA9IFtdO1xuXHRcdFx0XHRjb25zdCBtaXhlZENvbnRlbnQ6IE9iamVjdFBhZ2VTdWJTZWN0aW9uW10gPSBbXTtcblxuXHRcdFx0XHQvLyBDcmVhdGUgZWFjaCB2aXN1YWxpemF0aW9uIGZhY2V0IGFzIGlmIGl0IHdhcyBpdHMgb3duIHN1YnNlY3Rpb24gKHZpYSByZWN1cnNpb24pLCBhbmQga2VlcCB0aGVpciByZWxhdGl2ZSBvcmRlcmluZ1xuXHRcdFx0XHRmb3IgKGNvbnN0IHsgZmFjZXQgfSBvZiB2aXN1YWxpemF0aW9uRmFjZXRzKSB7XG5cdFx0XHRcdFx0dmlzdWFsaXphdGlvbkNvbnRlbnQucHVzaChjcmVhdGVTdWJTZWN0aW9uKGZhY2V0LCBbXSwgY29udmVydGVyQ29udGV4dCwgbGV2ZWwsIGZhY2V0cy5sZW5ndGggPT09IDEsIGlzSGVhZGVyU2VjdGlvbikpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG5vblZpc3VhbGl6YXRpb25GYWNldHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdC8vIFRoaXMgc3Vic2VjdGlvbiBpbmNsdWRlcyB2aXN1YWxpemF0aW9ucyBhbmQgb3RoZXIgY29udGVudCwgc28gaXQgaXMgYSBcIk1peGVkXCIgc3Vic2VjdGlvblxuXHRcdFx0XHRcdExvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFx0YFdhcm5pbmc6IENvbGxlY3Rpb25GYWNldCAnJHtmYWNldERlZmluaXRpb24uSUR9JyBpbmNsdWRlcyBhIGNvbWJpbmF0aW9uIG9mIGVpdGhlciBhIGNoYXJ0IG9yIGEgdGFibGUgYW5kIG90aGVyIGNvbnRlbnQuIFRoaXMgY2FuIGxlYWQgdG8gcmVuZGVyaW5nIGlzc3Vlcy4gQ29uc2lkZXIgbW92aW5nIHRoZSBjaGFydCBvciB0YWJsZSBpbnRvIGEgc2VwYXJhdGUgQ29sbGVjdGlvbkZhY2V0LmBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0ZmFjZXREZWZpbml0aW9uLkZhY2V0cyA9IG5vblZpc3VhbGl6YXRpb25GYWNldHM7XG5cdFx0XHRcdFx0Ly8gQ3JlYXRlIGEgam9pbmVkIGZvcm0gb2YgYWxsIGZhY2V0cyB0aGF0IGFyZSBub3QgcmVmZXJyaW5nIHRvIHZpc3VhbGl6YXRpb25zXG5cdFx0XHRcdFx0Zm9ybUNvbnRlbnQucHVzaChjcmVhdGVTdWJTZWN0aW9uKGZhY2V0RGVmaW5pdGlvbiwgW10sIGNvbnZlcnRlckNvbnRleHQsIGxldmVsLCBoYXNTaW5nbGVDb250ZW50LCBpc0hlYWRlclNlY3Rpb24pKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE1lcmdlIHRoZSB2aXN1YWxpemF0aW9uIGNvbnRlbnQgd2l0aCB0aGUgZm9ybSBjb250ZW50XG5cdFx0XHRcdGlmICh2aXN1YWxpemF0aW9uRmFjZXRzLmZpbmQoKHsgaW5kZXggfSkgPT4gaW5kZXggPT09IDApKSB7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGZpcnN0IGZhY2V0IGlzIGEgdmlzdWFsaXphdGlvbiwgZGlzcGxheSB0aGUgdmlzdWFsaXphdGlvbnMgZmlyc3Rcblx0XHRcdFx0XHRtaXhlZENvbnRlbnQucHVzaCguLi52aXN1YWxpemF0aW9uQ29udGVudCk7XG5cdFx0XHRcdFx0bWl4ZWRDb250ZW50LnB1c2goLi4uZm9ybUNvbnRlbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSwgZGlzcGxheSB0aGUgZm9ybSBmaXJzdFxuXHRcdFx0XHRcdG1peGVkQ29udGVudC5wdXNoKC4uLmZvcm1Db250ZW50KTtcblx0XHRcdFx0XHRtaXhlZENvbnRlbnQucHVzaCguLi52aXN1YWxpemF0aW9uQ29udGVudCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBtaXhlZFN1YlNlY3Rpb246IE1peGVkU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLk1peGVkLFxuXHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRjb250ZW50OiBtaXhlZENvbnRlbnRcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIG1peGVkU3ViU2VjdGlvbjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFRoaXMgQ29sbGVjdGlvbkZhY2V0IG9ubHkgaW5jbHVkZXMgY29udGVudCB0aGF0IGNhbiBiZSByZW5kZXJlZCBpbiBhIG1lcmdlZCBmb3JtXG5cdFx0XHRcdGNvbnN0IGZhY2V0QWN0aW9ucyA9IGdldEZhY2V0QWN0aW9ucyhmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0XHRcdGZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbjogRm9ybVN1YlNlY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybSxcblx0XHRcdFx0XHRcdGZvcm1EZWZpbml0aW9uOiBjcmVhdGVGb3JtRGVmaW5pdGlvbihmYWNldERlZmluaXRpb24sIGlzVmlzaWJsZSwgY29udmVydGVyQ29udGV4dCwgZmFjZXRBY3Rpb25zLmFjdGlvbnMpLFxuXHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0YWN0aW9uczogZmFjZXRBY3Rpb25zLmFjdGlvbnMuZmlsdGVyKChhY3Rpb24pID0+IGFjdGlvbi5mYWNldE5hbWUgPT09IHVuZGVmaW5lZCksXG5cdFx0XHRcdFx0XHRjb21tYW5kQWN0aW9uczogZmFjZXRBY3Rpb25zLmNvbW1hbmRBY3Rpb25zXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIGZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbjtcblx0XHRcdH1cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0aWYgKCFmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQpIHtcblx0XHRcdFx0dW5zdXBwb3J0ZWRUZXh0ID0gYFVuYWJsZSB0byBmaW5kIGFubm90YXRpb25QYXRoICR7ZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybSkge1xuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW06XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5DaGFydDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQ6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50OlxuXHRcdFx0XHRcdFx0Y29uc3QgcHJlc2VudGF0aW9uID0gZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdFx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UoZmFjZXREZWZpbml0aW9uLCBmYWNldHNUb0NyZWF0ZSwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFx0aXNIZWFkZXJTZWN0aW9uXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y29uc3QgY29udHJvbFRpdGxlID1cblx0XHRcdFx0XHRcdFx0KHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1swXSBhcyBhbnkpPy5hbm5vdGF0aW9uPy50aXRsZSB8fCAocHJlc2VudGF0aW9uLnZpc3VhbGl6YXRpb25zWzBdIGFzIGFueSk/LnRpdGxlO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2hvd1RpdGxlID0gaXNTdWJzZWN0aW9uVGl0bGVTaG93bihoYXNTaW5nbGVDb250ZW50LCBzdWJTZWN0aW9uLnRpdGxlLCBjb250cm9sVGl0bGUpO1xuXHRcdFx0XHRcdFx0Y29uc3QgdGl0bGVWaXNpYmxlRXhwcmVzc2lvbiA9IGlzVmlzaWJsZSAmJiB0aXRsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAodGl0bGUgPyBpc1Zpc2libGUgOiBmYWxzZSk7XG5cdFx0XHRcdFx0XHRjb25zdCBkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb246IERhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0Li4uc3ViU2VjdGlvbixcblx0XHRcdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRGF0YVZpc3VhbGl6YXRpb24sXG5cdFx0XHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRcdFx0cHJlc2VudGF0aW9uOiBwcmVzZW50YXRpb24sXG5cdFx0XHRcdFx0XHRcdHNob3dUaXRsZTogc2hvd1RpdGxlLFxuXHRcdFx0XHRcdFx0XHR0aXRsZVZpc2libGU6IGlzRHluYW1pY0V4cHJlc3Npb25cblx0XHRcdFx0XHRcdFx0XHQ/IGB7PSAoJHtpc1Zpc2libGVEeW5hbWljRXhwcmVzc2lvbn0pICYmICgnJHt0aXRsZX0nICE9PSd1bmRlZmluZWQnKSAmJiAoJHtzaG93VGl0bGV9ID8gdHJ1ZSA6IGZhbHNlKSB9YFxuXHRcdFx0XHRcdFx0XHRcdDogdGl0bGVWaXNpYmxlRXhwcmVzc2lvblxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb247XG5cblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLkZpZWxkR3JvdXA6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5JZGVudGlmaWNhdGlvbjpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLkRhdGFQb2ludDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlN0YXR1c0luZm86XG5cdFx0XHRcdFx0Y2FzZSBDb21tdW5pY2F0aW9uQW5ub3RhdGlvblRlcm1zLkNvbnRhY3Q6XG5cdFx0XHRcdFx0XHQvLyBBbGwgdGhvc2UgZWxlbWVudCBiZWxvbmcgdG8gYSBmb3JtIGZhY2V0XG5cdFx0XHRcdFx0XHRjb25zdCBmYWNldEFjdGlvbnMgPSBnZXRGYWNldEFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRcdFx0Zm9ybUVsZW1lbnRTdWJTZWN0aW9uOiBGb3JtU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLkZvcm0sXG5cdFx0XHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0XHRcdGZvcm1EZWZpbml0aW9uOiBjcmVhdGVGb3JtRGVmaW5pdGlvbihmYWNldERlZmluaXRpb24sIGlzVmlzaWJsZSwgY29udmVydGVyQ29udGV4dCwgZmFjZXRBY3Rpb25zLmFjdGlvbnMpLFxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbnM6IGZhY2V0QWN0aW9ucy5hY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiBhY3Rpb24uZmFjZXROYW1lID09PSB1bmRlZmluZWQpLFxuXHRcdFx0XHRcdFx0XHRcdGNvbW1hbmRBY3Rpb25zOiBmYWNldEFjdGlvbnMuY29tbWFuZEFjdGlvbnNcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHJldHVybiBmb3JtRWxlbWVudFN1YlNlY3Rpb247XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dW5zdXBwb3J0ZWRUZXh0ID0gYEZvciAke2ZhY2V0RGVmaW5pdGlvbi5UYXJnZXQuJHRhcmdldC50ZXJtfSBGcmFnbWVudGA7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VVUkxGYWNldDpcblx0XHRcdHVuc3VwcG9ydGVkVGV4dCA9IFwiRm9yIFJlZmVyZW5jZSBVUkwgRmFjZXRcIjtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRicmVhaztcblx0fVxuXHQvLyBJZiB3ZSByZWFjaCBoZXJlIHdlIGVuZGVkIHVwIHdpdGggYW4gdW5zdXBwb3J0ZWQgU3ViU2VjdGlvbiB0eXBlXG5cdGNvbnN0IHVuc3VwcG9ydGVkU3ViU2VjdGlvbjogVW5zdXBwb3J0ZWRTdWJTZWN0aW9uID0ge1xuXHRcdC4uLnN1YlNlY3Rpb24sXG5cdFx0dGV4dDogdW5zdXBwb3J0ZWRUZXh0XG5cdH07XG5cdHJldHVybiB1bnN1cHBvcnRlZFN1YlNlY3Rpb247XG59XG5mdW5jdGlvbiBpc1N1YnNlY3Rpb25UaXRsZVNob3duKFxuXHRoYXNTaW5nbGVDb250ZW50OiBib29sZWFuLFxuXHRzdWJTZWN0aW9uVGl0bGU6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uLFxuXHRjb250cm9sVGl0bGU6IHN0cmluZ1xuKTogYm9vbGVhbiB7XG5cdGlmIChoYXNTaW5nbGVDb250ZW50ICYmIGNvbnRyb2xUaXRsZSA9PT0gc3ViU2VjdGlvblRpdGxlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIoXG5cdGFjdGlvbnM6IENvbnZlcnRlckFjdGlvbltdLFxuXHRmYWNldERlZmluaXRpb246IFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IENvbnZlcnRlckFjdGlvbltdIHtcblx0Y29uc3QgcmVmZXJlbmNlVGFyZ2V0ID0gZmFjZXREZWZpbml0aW9uLlRhcmdldC4kdGFyZ2V0O1xuXHRjb25zdCB0YXJnZXRWYWx1ZSA9IGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWU7XG5cdGxldCBtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4gPSB7fTtcblx0bGV0IGRhdGFGaWVsZENvbGxlY3Rpb246IERhdGFGaWVsZEFic3RyYWN0VHlwZXNbXSA9IFtdO1xuXHRsZXQgW25hdmlnYXRpb25Qcm9wZXJ0eVBhdGhdOiBhbnkgPSB0YXJnZXRWYWx1ZS5zcGxpdChcIkBcIik7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA+IDApIHtcblx0XHRpZiAobmF2aWdhdGlvblByb3BlcnR5UGF0aC5sYXN0SW5kZXhPZihcIi9cIikgPT09IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSkge1xuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAocmVmZXJlbmNlVGFyZ2V0KSB7XG5cdFx0c3dpdGNoIChyZWZlcmVuY2VUYXJnZXQudGVybSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0XHRkYXRhRmllbGRDb2xsZWN0aW9uID0gKHJlZmVyZW5jZVRhcmdldCBhcyBGaWVsZEdyb3VwKS5EYXRhO1xuXHRcdFx0XHRtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbihyZWZlcmVuY2VUYXJnZXQpLmFjdGlvbnMsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0ZmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZVxuXHRcdFx0XHQpLmFjdGlvbnM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5JZGVudGlmaWNhdGlvbjpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuU3RhdHVzSW5mbzpcblx0XHRcdFx0aWYgKHJlZmVyZW5jZVRhcmdldC5xdWFsaWZpZXIpIHtcblx0XHRcdFx0XHRkYXRhRmllbGRDb2xsZWN0aW9uID0gcmVmZXJlbmNlVGFyZ2V0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0YWN0aW9ucyA9IGRhdGFGaWVsZENvbGxlY3Rpb24ucmVkdWNlKChhY3Rpb25SZWR1Y2VyLCBkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRcdGlmIChkYXRhRmllbGQuUmVxdWlyZXNDb250ZXh0Py52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5Mb3csIElzc3VlVHlwZS5NQUxGT1JNRURfREFUQUZJRUxEX0ZPUl9JQk4uUkVRVUlSRVNDT05URVhUKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLklubGluZT8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuTG93LCBJc3N1ZVR5cGUuTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOLklOTElORSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGFGaWVsZC5EZXRlcm1pbmluZz8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuTG93LCBJc3N1ZVR5cGUuTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOLkRFVEVSTUlOSU5HKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBtTmF2aWdhdGlvblBhcmFtZXRlcnM6IGFueSA9IHt9O1xuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLk1hcHBpbmcpIHtcblx0XHRcdFx0XHRtTmF2aWdhdGlvblBhcmFtZXRlcnMuc2VtYW50aWNPYmplY3RNYXBwaW5nID0gZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nKGRhdGFGaWVsZC5NYXBwaW5nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhY3Rpb25SZWR1Y2VyLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRcdFx0XHRcdGlkOiBnZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6XG5cdFx0XHRcdFx0XHRkYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdD8gY29tcGlsZUV4cHJlc3Npb24oZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGRhdGFGaWVsZC5OYXZpZ2F0aW9uQXZhaWxhYmxlPy52YWx1ZU9mKCkpLCB0cnVlKSlcblx0XHRcdFx0XHRcdFx0OiBcInRydWVcIixcblx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlRXhwcmVzc2lvbihub3QoZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRidXR0b25UeXBlOiBnZXRCdXR0b25UeXBlKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkVtcGhhc2l6ZWQpLFxuXHRcdFx0XHRcdHByZXNzOiBjb21waWxlRXhwcmVzc2lvbihcblx0XHRcdFx0XHRcdGZuKFwiLl9pbnRlbnRCYXNlZE5hdmlnYXRpb24ubmF2aWdhdGVcIiwgW1xuXHRcdFx0XHRcdFx0XHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZGF0YUZpZWxkLlNlbWFudGljT2JqZWN0KSxcblx0XHRcdFx0XHRcdFx0Z2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGRhdGFGaWVsZC5BY3Rpb24pLFxuXHRcdFx0XHRcdFx0XHRtTmF2aWdhdGlvblBhcmFtZXRlcnNcblx0XHRcdFx0XHRcdF0pXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRjdXN0b21EYXRhOiBjb21waWxlRXhwcmVzc2lvbih7XG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGRhdGFGaWVsZC5TZW1hbnRpY09iamVjdCksXG5cdFx0XHRcdFx0XHRhY3Rpb246IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihkYXRhRmllbGQuQWN0aW9uKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdFx0XHRjb25zdCBmb3JtTWFuaWZlc3RBY3Rpb25zQ29uZmlndXJhdGlvbjogYW55ID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHJlZmVyZW5jZVRhcmdldCkuYWN0aW9ucztcblx0XHRcdFx0Y29uc3Qga2V5OiBzdHJpbmcgPSBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCk7XG5cdFx0XHRcdGFjdGlvblJlZHVjZXIucHVzaCh7XG5cdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdFx0aWQ6IGdldEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSwgZGF0YUZpZWxkKSxcblx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHR0ZXh0OiBkYXRhRmllbGQuTGFiZWw/LnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IFwiXCIsXG5cdFx0XHRcdFx0ZW5hYmxlZDogZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24oY29udmVydGVyQ29udGV4dCwgZGF0YUZpZWxkLkFjdGlvblRhcmdldCksXG5cdFx0XHRcdFx0YmluZGluZzogbmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IGB7ICdwYXRoJyA6ICcke25hdmlnYXRpb25Qcm9wZXJ0eVBhdGh9J31gIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdHZpc2libGU6IGNvbXBpbGVFeHByZXNzaW9uKG5vdChlcXVhbChnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0XHRcdHJlcXVpcmVzRGlhbG9nOiBpc0RpYWxvZyhkYXRhRmllbGQuQWN0aW9uVGFyZ2V0KSxcblx0XHRcdFx0XHRidXR0b25UeXBlOiBnZXRCdXR0b25UeXBlKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkVtcGhhc2l6ZWQpLFxuXHRcdFx0XHRcdHByZXNzOiBjb21waWxlRXhwcmVzc2lvbihcblx0XHRcdFx0XHRcdGZuKFxuXHRcdFx0XHRcdFx0XHRcImludm9rZUFjdGlvblwiLFxuXHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkLkFjdGlvbixcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb250ZXh0czogZm4oXCJnZXRCaW5kaW5nQ29udGV4dFwiLCBbXSwgcGF0aEluTW9kZWwoXCJcIiwgXCIkc291cmNlXCIpKSxcblx0XHRcdFx0XHRcdFx0XHRcdGludm9jYXRpb25Hcm91cGluZzogKGRhdGFGaWVsZC5JbnZvY2F0aW9uR3JvdXBpbmcgPT09IFwiVUkuT3BlcmF0aW9uR3JvdXBpbmdUeXBlL0NoYW5nZVNldFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdD8gXCJDaGFuZ2VTZXRcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IFwiSXNvbGF0ZWRcIikgYXMgT3BlcmF0aW9uR3JvdXBpbmdUeXBlLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihkYXRhRmllbGQuTGFiZWwpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bW9kZWw6IGZuKFwiZ2V0TW9kZWxcIiwgW10sIHBhdGhJbk1vZGVsKFwiL1wiLCBcIiRzb3VyY2VcIikpLFxuXHRcdFx0XHRcdFx0XHRcdFx0aXNOYXZpZ2FibGU6IGlzQWN0aW9uTmF2aWdhYmxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtTWFuaWZlc3RBY3Rpb25zQ29uZmlndXJhdGlvbiAmJiBmb3JtTWFuaWZlc3RBY3Rpb25zQ29uZmlndXJhdGlvbltrZXldXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFx0XHRyZWYoXCIuZWRpdEZsb3dcIilcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGZhY2V0TmFtZTogZGF0YUZpZWxkLklubGluZSA/IGZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgOiB1bmRlZmluZWRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHJldHVybiBhY3Rpb25SZWR1Y2VyO1xuXHR9LCBhY3Rpb25zKTtcblx0cmV0dXJuIGluc2VydEN1c3RvbUVsZW1lbnRzKGFjdGlvbnMsIG1hbmlmZXN0QWN0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpYWxvZyhhY3Rpb25EZWZpbml0aW9uOiBhbnkgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuXHRpZiAoYWN0aW9uRGVmaW5pdGlvbikge1xuXHRcdGNvbnN0IGJDcml0aWNhbCA9IGFjdGlvbkRlZmluaXRpb24uYW5ub3RhdGlvbnM/LkNvbW1vbj8uSXNBY3Rpb25Dcml0aWNhbDtcblx0XHRpZiAoYWN0aW9uRGVmaW5pdGlvbi5wYXJhbWV0ZXJzLmxlbmd0aCA+IDEgfHwgYkNyaXRpY2FsKSB7XG5cdFx0XHRyZXR1cm4gXCJEaWFsb2dcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFwiTm9uZVwiO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCJOb25lXCI7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVN1YlNlY3Rpb25zKFxuXHRtYW5pZmVzdFN1YlNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdFN1YlNlY3Rpb24+LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbj4ge1xuXHRjb25zdCBzdWJTZWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZVN1YlNlY3Rpb24+ID0ge307XG5cdE9iamVjdC5rZXlzKG1hbmlmZXN0U3ViU2VjdGlvbnMpLmZvckVhY2goXG5cdFx0KHN1YlNlY3Rpb25LZXkpID0+XG5cdFx0XHQoc3ViU2VjdGlvbnNbc3ViU2VjdGlvbktleV0gPSBjcmVhdGVDdXN0b21TdWJTZWN0aW9uKG1hbmlmZXN0U3ViU2VjdGlvbnNbc3ViU2VjdGlvbktleV0sIHN1YlNlY3Rpb25LZXksIGNvbnZlcnRlckNvbnRleHQpKVxuXHQpO1xuXHRyZXR1cm4gc3ViU2VjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDdXN0b21TdWJTZWN0aW9uKFxuXHRtYW5pZmVzdFN1YlNlY3Rpb246IE1hbmlmZXN0U3ViU2VjdGlvbixcblx0c3ViU2VjdGlvbktleTogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHNpZGVDb250ZW50OiBTaWRlQ29udGVudERlZiB8IHVuZGVmaW5lZCA9IG1hbmlmZXN0U3ViU2VjdGlvbi5zaWRlQ29udGVudFxuXHRcdD8ge1xuXHRcdFx0XHR0ZW1wbGF0ZTogbWFuaWZlc3RTdWJTZWN0aW9uLnNpZGVDb250ZW50LnRlbXBsYXRlLFxuXHRcdFx0XHRpZDogZ2V0U2lkZUNvbnRlbnRJRChzdWJTZWN0aW9uS2V5KSxcblx0XHRcdFx0dmlzaWJsZTogZmFsc2UsXG5cdFx0XHRcdGVxdWFsU3BsaXQ6IG1hbmlmZXN0U3ViU2VjdGlvbi5zaWRlQ29udGVudC5lcXVhbFNwbGl0XG5cdFx0ICB9XG5cdFx0OiB1bmRlZmluZWQ7XG5cdGxldCBwb3NpdGlvbiA9IG1hbmlmZXN0U3ViU2VjdGlvbi5wb3NpdGlvbjtcblx0aWYgKCFwb3NpdGlvbikge1xuXHRcdHBvc2l0aW9uID0ge1xuXHRcdFx0cGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXJcblx0XHR9O1xuXHR9XG5cdGNvbnN0IGlzVmlzaWJsZSA9IG1hbmlmZXN0U3ViU2VjdGlvbi52aXNpYmxlICE9PSB1bmRlZmluZWQgPyBtYW5pZmVzdFN1YlNlY3Rpb24udmlzaWJsZSA6IHRydWU7XG5cdGNvbnN0IGlzRHluYW1pY0V4cHJlc3Npb24gPSBpc1Zpc2libGUgJiYgdHlwZW9mIGlzVmlzaWJsZSA9PT0gXCJzdHJpbmdcIiAmJiBpc1Zpc2libGUuaW5kZXhPZihcIns9XCIpID09PSAwO1xuXHRjb25zdCBtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KG1hbmlmZXN0U3ViU2VjdGlvbi5hY3Rpb25zLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3Qgc3ViU2VjdGlvbkRlZmluaXRpb24gPSB7XG5cdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuVW5rbm93bixcblx0XHRpZDogbWFuaWZlc3RTdWJTZWN0aW9uLmlkIHx8IGdldEN1c3RvbVN1YlNlY3Rpb25JRChzdWJTZWN0aW9uS2V5KSxcblx0XHRhY3Rpb25zOiBtYW5pZmVzdEFjdGlvbnMuYWN0aW9ucyxcblx0XHRrZXk6IHN1YlNlY3Rpb25LZXksXG5cdFx0dGl0bGU6IG1hbmlmZXN0U3ViU2VjdGlvbi50aXRsZSxcblx0XHRsZXZlbDogMSxcblx0XHRwb3NpdGlvbjogcG9zaXRpb24sXG5cdFx0dmlzaWJsZTogbWFuaWZlc3RTdWJTZWN0aW9uLnZpc2libGUgIT09IHVuZGVmaW5lZCA/IG1hbmlmZXN0U3ViU2VjdGlvbi52aXNpYmxlIDogdHJ1ZSxcblx0XHRzaWRlQ29udGVudDogc2lkZUNvbnRlbnQsXG5cdFx0aXNWaXNpYmlsaXR5RHluYW1pYzogaXNEeW5hbWljRXhwcmVzc2lvblxuXHR9O1xuXHRpZiAobWFuaWZlc3RTdWJTZWN0aW9uLnRlbXBsYXRlIHx8IG1hbmlmZXN0U3ViU2VjdGlvbi5uYW1lKSB7XG5cdFx0c3ViU2VjdGlvbkRlZmluaXRpb24udHlwZSA9IFN1YlNlY3Rpb25UeXBlLlhNTEZyYWdtZW50O1xuXHRcdChzdWJTZWN0aW9uRGVmaW5pdGlvbiBhcyB1bmtub3duIGFzIFhNTEZyYWdtZW50U3ViU2VjdGlvbikudGVtcGxhdGUgPSBtYW5pZmVzdFN1YlNlY3Rpb24udGVtcGxhdGUgfHwgbWFuaWZlc3RTdWJTZWN0aW9uLm5hbWUgfHwgXCJcIjtcblx0fSBlbHNlIHtcblx0XHRzdWJTZWN0aW9uRGVmaW5pdGlvbi50eXBlID0gU3ViU2VjdGlvblR5cGUuUGxhY2Vob2xkZXI7XG5cdH1cblx0cmV0dXJuIHN1YlNlY3Rpb25EZWZpbml0aW9uIGFzIEN1c3RvbU9iamVjdFBhZ2VTdWJTZWN0aW9uO1xufVxuXG4vKipcbiAqIEV2YWx1YXRlIGlmIHRoZSBjb25kZW5zZWQgbW9kZSBjYW4gYmUgYXBwbGkzZWQgb24gdGhlIHRhYmxlLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50RmFjZXRcbiAqIEBwYXJhbSBmYWNldHNUb0NyZWF0ZUluU2VjdGlvblxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIGB0cnVlYCBmb3IgY29tcGxpYW50LCBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZnVuY3Rpb24gZ2V0Q29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbmNlKFxuXHRjdXJyZW50RmFjZXQ6IEZhY2V0VHlwZXMsXG5cdGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uOiBGYWNldFR5cGVzW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IGJvb2xlYW4ge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRpZiAobWFuaWZlc3RXcmFwcGVyLnVzZUljb25UYWJCYXIoKSkge1xuXHRcdC8vIElmIHRoZSBPUCB1c2UgdGhlIHRhYiBiYXNlZCB3ZSBjaGVjayBpZiB0aGUgZmFjZXRzIHRoYXQgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGlzIHNlY3Rpb24gYXJlIGFsbCBub24gdmlzaWJsZVxuXHRcdHJldHVybiBoYXNOb090aGVyVmlzaWJsZVRhYmxlSW5UYXJnZXRzKGN1cnJlbnRGYWNldCwgZmFjZXRzVG9DcmVhdGVJblNlY3Rpb24pO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0XHRpZiAoZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uVUk/LkZhY2V0cz8ubGVuZ3RoICYmIGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5GYWNldHM/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiBoYXNOb090aGVyVmlzaWJsZVRhYmxlSW5UYXJnZXRzKGN1cnJlbnRGYWNldCwgZmFjZXRzVG9DcmVhdGVJblNlY3Rpb24pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyhjdXJyZW50RmFjZXQ6IEZhY2V0VHlwZXMsIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uOiBGYWNldFR5cGVzW10pOiBib29sZWFuIHtcblx0cmV0dXJuIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uLmV2ZXJ5KGZ1bmN0aW9uIChzdWJGYWNldCkge1xuXHRcdGlmIChzdWJGYWNldCAhPT0gY3VycmVudEZhY2V0KSB7XG5cdFx0XHRpZiAoc3ViRmFjZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0KSB7XG5cdFx0XHRcdGNvbnN0IHJlZkZhY2V0ID0gc3ViRmFjZXQ7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRyZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLkxpbmVJdGVtIHx8XG5cdFx0XHRcdFx0cmVmRmFjZXQuVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5QcmVzZW50YXRpb25WYXJpYW50IHx8XG5cdFx0XHRcdFx0cmVmRmFjZXQuVGFyZ2V0LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlZkZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuICE9PSB1bmRlZmluZWQgPyByZWZGYWNldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiA6IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3Qgc3ViQ29sbGVjdGlvbkZhY2V0ID0gc3ViRmFjZXQgYXMgQ29sbGVjdGlvbkZhY2V0VHlwZXM7XG5cdFx0XHRcdHJldHVybiBzdWJDb2xsZWN0aW9uRmFjZXQuRmFjZXRzLmV2ZXJ5KGZ1bmN0aW9uIChmYWNldCkge1xuXHRcdFx0XHRcdGNvbnN0IHN1YlJlZkZhY2V0ID0gZmFjZXQgYXMgUmVmZXJlbmNlRmFjZXRUeXBlcztcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRzdWJSZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLkxpbmVJdGVtIHx8XG5cdFx0XHRcdFx0XHRzdWJSZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQgfHxcblx0XHRcdFx0XHRcdHN1YlJlZkZhY2V0LlRhcmdldD8uJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1YlJlZkZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuICE9PSB1bmRlZmluZWQgPyBzdWJSZWZGYWNldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiA6IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9KTtcbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxRFlBLGM7O2FBQUFBLGM7SUFBQUEsYztJQUFBQSxjO0lBQUFBLGM7SUFBQUEsYztJQUFBQSxjO0lBQUFBLGM7S0FBQUEsYyxLQUFBQSxjOzs7RUF5RlosSUFBTUMsa0JBQTRCLEdBQUcsd0xBQXJDO0VBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFDTyxTQUFTQyxpQkFBVCxDQUNOQyxlQURN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