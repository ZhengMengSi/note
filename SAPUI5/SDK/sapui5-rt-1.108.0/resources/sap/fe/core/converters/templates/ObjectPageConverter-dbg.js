/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/objectPage/HeaderAndFooterAction", "sap/fe/core/helpers/BindingToolkit", "sap/fe/templates/ObjectPage/ObjectPageTemplating", "../controls/ObjectPage/Avatar", "../controls/ObjectPage/HeaderFacet", "../controls/ObjectPage/SubSection", "../helpers/BindingHelper", "../helpers/ConfigurableObject", "../helpers/ID", "../ManifestSettings"], function (Action, HeaderAndFooterAction, BindingToolkit, ObjectPageTemplating, Avatar, HeaderFacet, SubSection, BindingHelper, ConfigurableObject, ID, ManifestSettings) {
  "use strict";

  var _exports = {};
  var TemplateType = ManifestSettings.TemplateType;
  var getSectionID = ID.getSectionID;
  var getEditableHeaderSectionID = ID.getEditableHeaderSectionID;
  var getCustomSectionID = ID.getCustomSectionID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var UI = BindingHelper.UI;
  var SubSectionType = SubSection.SubSectionType;
  var createSubSections = SubSection.createSubSections;
  var createCustomSubSections = SubSection.createCustomSubSections;
  var createCustomHeaderFacetSubSections = SubSection.createCustomHeaderFacetSubSections;
  var getHeaderFacetsFromManifest = HeaderFacet.getHeaderFacetsFromManifest;
  var getHeaderFacetsFromAnnotations = HeaderFacet.getHeaderFacetsFromAnnotations;
  var getAvatar = Avatar.getAvatar;
  var getPressExpressionForPrimaryAction = ObjectPageTemplating.getPressExpressionForPrimaryAction;
  var getEditCommandExecutionVisible = ObjectPageTemplating.getEditCommandExecutionVisible;
  var getEditCommandExecutionEnabled = ObjectPageTemplating.getEditCommandExecutionEnabled;
  var not = BindingToolkit.not;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var getHiddenHeaderActions = HeaderAndFooterAction.getHiddenHeaderActions;
  var getHeaderDefaultActions = HeaderAndFooterAction.getHeaderDefaultActions;
  var getFooterDefaultActions = HeaderAndFooterAction.getFooterDefaultActions;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var getActionsFromManifest = Action.getActionsFromManifest;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var getSectionKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };
  /**
   * Creates a section that represents the editable header part; it is only visible in edit mode.
   *
   * @param converterContext The converter context
   * @param allHeaderFacets The converter context
   * @returns The section representing the editable header parts
   */


  function createEditableHeaderSection(converterContext, allHeaderFacets) {
    var _converterContext$get, _converterContext$get2;

    var editableHeaderSectionID = getEditableHeaderSectionID();
    var headerFacets = (_converterContext$get = converterContext.getEntityType().annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.HeaderFacets;
    var headerfacetSubSections = headerFacets ? createSubSections(headerFacets, converterContext, true) : [];
    var customHeaderFacetSubSections = createCustomHeaderFacetSubSections(converterContext);
    var allHeaderFacetsSubSections = [];

    if (customHeaderFacetSubSections.length > 0) {
      // merge annotation based header facets and custom header facets in the right order
      var i = 0;
      allHeaderFacets.forEach(function (item) {
        // hidden header facets are not included in allHeaderFacets array => add them anyway
        while (headerfacetSubSections.length > i && headerfacetSubSections[i].visible === "false") {
          allHeaderFacetsSubSections.push(headerfacetSubSections[i]);
          i++;
        }

        if (headerfacetSubSections.length > i && (item.key === headerfacetSubSections[i].key || // for header facets with no id the keys of header facet and subsection are different => check only the last part
        item.key.slice(item.key.lastIndexOf("::") + 2) === headerfacetSubSections[i].key.slice(headerfacetSubSections[i].key.lastIndexOf("::") + 2))) {
          allHeaderFacetsSubSections.push(headerfacetSubSections[i]);
          i++;
        } else {
          customHeaderFacetSubSections.forEach(function (customItem) {
            if (item.key === customItem.key) {
              allHeaderFacetsSubSections.push(customItem);
            }
          });
        }
      });
    } else {
      allHeaderFacetsSubSections = headerfacetSubSections;
    }

    var headerSection = {
      id: editableHeaderSectionID,
      key: "EditableHeaderContent",
      title: "{sap.fe.i18n>T_COMMON_OBJECT_PAGE_HEADER_SECTION}",
      visible: compileExpression(UI.IsEditable),
      subSections: allHeaderFacetsSubSections
    };
    return headerSection;
  }
  /**
   * Creates a definition for a section based on the Facet annotation.
   *
   * @param converterContext The converter context
   * @returns All sections
   */


  _exports.createEditableHeaderSection = createEditableHeaderSection;

  function getSectionsFromAnnotation(converterContext) {
    var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3;

    var entityType = converterContext.getEntityType();
    var objectPageSections = ((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Facets) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.map(function (facetDefinition) {
      return getSectionFromAnnotation(facetDefinition, converterContext);
    })) || [];
    return objectPageSections;
  }
  /**
   * Create an annotation based section.
   *
   * @param facet
   * @param converterContext
   * @returns The current section
   */


  function getSectionFromAnnotation(facet, converterContext) {
    var _facet$annotations, _facet$annotations$UI, _facet$annotations$UI2;

    var sectionID = getSectionID({
      Facet: facet
    });
    var section = {
      id: sectionID,
      key: getSectionKey(facet, sectionID),
      title: compileExpression(getExpressionFromAnnotation(facet.Label)),
      showTitle: !!facet.Label,
      visible: compileExpression(not(equal(getExpressionFromAnnotation((_facet$annotations = facet.annotations) === null || _facet$annotations === void 0 ? void 0 : (_facet$annotations$UI = _facet$annotations.UI) === null || _facet$annotations$UI === void 0 ? void 0 : (_facet$annotations$UI2 = _facet$annotations$UI.Hidden) === null || _facet$annotations$UI2 === void 0 ? void 0 : _facet$annotations$UI2.valueOf()), true))),
      subSections: createSubSections([facet], converterContext)
    };
    return section;
  }
  /**
   * Creates section definitions based on the manifest definitions.
   *
   * @param manifestSections The sections defined in the manifest
   * @param converterContext
   * @returns The sections defined in the manifest
   */


  function getSectionsFromManifest(manifestSections, converterContext) {
    var sections = {};
    Object.keys(manifestSections).forEach(function (manifestSectionKey) {
      sections[manifestSectionKey] = getSectionFromManifest(manifestSections[manifestSectionKey], manifestSectionKey, converterContext);
    });
    return sections;
  }
  /**
   * Create a manifest-based custom section.
   *
   * @param customSectionDefinition
   * @param sectionKey
   * @param converterContext
   * @returns The current custom section
   */


  function getSectionFromManifest(customSectionDefinition, sectionKey, converterContext) {
    var customSectionID = customSectionDefinition.id || getCustomSectionID(sectionKey);
    var position = customSectionDefinition.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    var manifestSubSections;

    if (!customSectionDefinition.subSections) {
      // If there is no subSection defined, we add the content of the custom section as subsections
      // and make sure to set the visibility to 'true', as the actual visibility is handled by the section itself
      manifestSubSections = _defineProperty({}, sectionKey, _objectSpread(_objectSpread({}, customSectionDefinition), {}, {
        position: undefined,
        visible: "true"
      }));
    } else {
      manifestSubSections = customSectionDefinition.subSections;
    }

    var subSections = createCustomSubSections(manifestSubSections, converterContext);
    var customSection = {
      id: customSectionID,
      key: sectionKey,
      title: customSectionDefinition.title,
      showTitle: !!customSectionDefinition.title,
      visible: customSectionDefinition.visible !== undefined ? customSectionDefinition.visible : "true",
      position: position,
      subSections: subSections
    };
    return customSection;
  }
  /**
   * Retrieves the ObjectPage header actions (both the default ones and the custom ones defined in the manifest).
   *
   * @param converterContext The converter context
   * @returns An array containing all the actions for this ObjectPage header
   */


  var getHeaderActions = function (converterContext) {
    var aAnnotationHeaderActions = getHeaderDefaultActions(converterContext);
    var manifestWrapper = converterContext.getManifestWrapper();
    var manifestActions = getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext, aAnnotationHeaderActions, undefined, undefined, getHiddenHeaderActions(converterContext));
    var headerActions = insertCustomElements(aAnnotationHeaderActions, manifestActions.actions, {
      isNavigable: "overwrite",
      enabled: "overwrite",
      visible: "overwrite",
      defaultValuesExtensionFunction: "overwrite",
      command: "overwrite"
    });
    return {
      actions: removeDuplicateActions(headerActions),
      commandActions: manifestActions.commandActions
    };
  };
  /**
   * Retrieves the ObjectPage footer actions (both the default ones and the custom ones defined in the manifest).
   *
   * @param converterContext The converter context
   * @returns An array containing all the actions for this ObjectPage footer
   */


  _exports.getHeaderActions = getHeaderActions;

  var getFooterActions = function (converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var aAnnotationFooterActions = getFooterDefaultActions(manifestWrapper.getViewLevel(), converterContext);
    var manifestActions = getActionsFromManifest(manifestWrapper.getFooterActions(), converterContext, aAnnotationFooterActions);
    var footerActions = insertCustomElements(aAnnotationFooterActions, manifestActions.actions, {
      isNavigable: "overwrite",
      enabled: "overwrite",
      visible: "overwrite",
      defaultValuesExtensionFunction: "overwrite",
      command: "overwrite"
    });
    return {
      actions: footerActions,
      commandActions: manifestActions.commandActions
    };
  };
  /**
   * Method to get the expression for the execute event of the forward action.
   * Generates primaryActionExpression to be executed on the keyboard shortcut Ctrl+Enter with the
   * forward flow (priority is the semantic positive action OR if that's not there, then the primary action).
   *
   * @param converterContext The converter context
   * @param headerActions An array containing all the actions for this ObjectPage header
   * @param footerActions An array containing all the actions for this ObjectPage footer
   * @returns {string}  Binding expression or function string
   */


  _exports.getFooterActions = getFooterActions;

  var getPrimaryAction = function (converterContext, headerActions, footerActions) {
    var primaryActionExpression = "";
    var aActions = [].concat(_toConsumableArray(headerActions), _toConsumableArray(footerActions));

    var getBindingExp = function (sExpression) {
      if (sExpression && sExpression.indexOf("{=") > -1) {
        return sExpression.replace("{=", "(").slice(0, -1) + ")";
      }

      return sExpression;
    };

    var aSemanticPositiveActions = aActions.filter(function (oAction) {
      if (oAction !== null && oAction !== void 0 && oAction.annotationPath) {
        var targetObject = converterContext.getConverterContextFor(oAction === null || oAction === void 0 ? void 0 : oAction.annotationPath).getDataModelObjectPath().targetObject;

        if (targetObject !== null && targetObject !== void 0 && targetObject.Criticality && (targetObject === null || targetObject === void 0 ? void 0 : targetObject.Criticality) === "UI.CriticalityType/Positive") {
          return true;
        }
      }
    });
    var oEntitySet = converterContext.getEntitySet();

    if (aSemanticPositiveActions.length > 0) {
      var _aSemanticPositiveAct, _aSemanticPositiveAct2;

      primaryActionExpression = getPressExpressionForPrimaryAction(aSemanticPositiveActions[0].annotationPath && converterContext.getConverterContextFor(aSemanticPositiveActions[0].annotationPath).getDataModelObjectPath().targetObject, oEntitySet === null || oEntitySet === void 0 ? void 0 : oEntitySet.name, aSemanticPositiveActions[0], getBindingExp((_aSemanticPositiveAct = aSemanticPositiveActions[0].visible) !== null && _aSemanticPositiveAct !== void 0 ? _aSemanticPositiveAct : "true"), getBindingExp((_aSemanticPositiveAct2 = aSemanticPositiveActions[0].enabled) !== null && _aSemanticPositiveAct2 !== void 0 ? _aSemanticPositiveAct2 : "true"), getBindingExp(getEditCommandExecutionVisible(headerActions)), getBindingExp(getEditCommandExecutionEnabled(headerActions)));
    } else {
      primaryActionExpression = getPressExpressionForPrimaryAction(null, oEntitySet === null || oEntitySet === void 0 ? void 0 : oEntitySet.name, null, "false", "false", getBindingExp(getEditCommandExecutionVisible(headerActions)), getBindingExp(getEditCommandExecutionEnabled(headerActions)));
    }

    return primaryActionExpression;
  };

  _exports.getPrimaryAction = getPrimaryAction;

  function _getSubSectionVisualization(subSection) {
    var _subSection$presentat;

    return subSection !== null && subSection !== void 0 && (_subSection$presentat = subSection.presentation) !== null && _subSection$presentat !== void 0 && _subSection$presentat.visualizations[0] ? subSection.presentation.visualizations[0] : undefined;
  }

  function _isFacetHasGridTableVisible(dataVisualizationSubSection, subSectionVisualization) {
    var _dataVisualizationSub, _subSectionVisualizat;

    return dataVisualizationSubSection.visible === "true" && (dataVisualizationSubSection === null || dataVisualizationSubSection === void 0 ? void 0 : (_dataVisualizationSub = dataVisualizationSubSection.presentation) === null || _dataVisualizationSub === void 0 ? void 0 : _dataVisualizationSub.visualizations) && (subSectionVisualization === null || subSectionVisualization === void 0 ? void 0 : subSectionVisualization.type) === "Table" && (subSectionVisualization === null || subSectionVisualization === void 0 ? void 0 : (_subSectionVisualizat = subSectionVisualization.control) === null || _subSectionVisualizat === void 0 ? void 0 : _subSectionVisualizat.type) === "GridTable";
  }

  function _setGridTableVisualizationInformation(sections, dataVisualizationSubSection, subSectionVisualization, sectionLayout) {
    if (_isFacetHasGridTableVisible(dataVisualizationSubSection, subSectionVisualization)) {
      var tableControlConfiguration = subSectionVisualization.control;

      if (!(sectionLayout === "Page" && sections.length > 1)) {
        tableControlConfiguration.rowCountMode = "Auto";
      }
    }
  }

  function _setGridTableWithMixFacetsInformation(subSection) {
    if (subSection !== null && subSection !== void 0 && subSection.content) {
      if (subSection.content.length === 1) {
        var _presentation;

        if (((_presentation = subSection.content[0].presentation) === null || _presentation === void 0 ? void 0 : _presentation.visualizations[0]).control.type === "GridTable") {
          var _presentation2;

          ((_presentation2 = subSection.content[0].presentation) === null || _presentation2 === void 0 ? void 0 : _presentation2.visualizations[0]).control.rowCountMode = "Auto";
        }
      }
    }
  }
  /**
   * Set the GridTable display information.
   *
   * @param sections The ObjectPage sections
   * @param section The current ObjectPage section processed
   * @param sectionLayout
   */


  function _setGridTableSubSectionControlConfiguration(sections, section, sectionLayout) {
    var dataVisualizationSubSection;
    var subSectionVisualization;
    var subSections = section.subSections;

    if (subSections.length === 1) {
      dataVisualizationSubSection = subSections[0];

      switch (subSections[0].type) {
        case "DataVisualization":
          subSectionVisualization = _getSubSectionVisualization(dataVisualizationSubSection);

          _setGridTableVisualizationInformation(sections, dataVisualizationSubSection, subSectionVisualization, sectionLayout);

          break;

        case "Mixed":
          _setGridTableWithMixFacetsInformation(dataVisualizationSubSection);

          break;

        default:
          break;
      }
    }
  }
  /**
   * Retrieves and merges the ObjectPage sections defined in the annotation and in the manifest.
   *
   * @param converterContext The converter context
   * @returns An array of sections.
   */


  var getSections = function (converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var sections = insertCustomElements(getSectionsFromAnnotation(converterContext), getSectionsFromManifest(manifestWrapper.getSections(), converterContext), {
      "title": "overwrite",
      "visible": "overwrite",
      "subSections": {
        "actions": "merge",
        "title": "overwrite",
        "sideContent": "overwrite"
      }
    }); // Level Adjustment for "Mixed" Collection Facets:
    // ==============================================
    // The manifest definition of custom side contents and actions still needs to be aligned for "Mixed" collection facets:
    // Collection facets containing tables gain an extra reference facet as a table wrapper to ensure, that the table is always
    // placed in an own individual Object Page Block; this additional hierarchy level is unknown to app developers, which are
    // defining the side content and actions in the manifest at collection facet level; now, since the sideContent always needs
    // to be assigned to a block, and actions always need to be assigned to a form,
    // we need to move the sideContent and actions from a mixed collection facet to its content.
    // ==============================================

    sections.forEach(function (section) {
      var _section$subSections;

      _setGridTableSubSectionControlConfiguration(sections, section, manifestWrapper.getSectionLayout());

      (_section$subSections = section.subSections) === null || _section$subSections === void 0 ? void 0 : _section$subSections.forEach(function (subSection) {
        var _subSection$content;

        subSection.title = subSection.title === "undefined" ? undefined : subSection.title;

        if (subSection.type === "Mixed" && (_subSection$content = subSection.content) !== null && _subSection$content !== void 0 && _subSection$content.length) {
          var _actions;

          var firstForm = subSection.content.find(function (element) {
            return element.type === SubSectionType.Form;
          }); // 1. Copy sideContent to the SubSection's first form; or -- if unavailable -- to its first content
          // 2. Copy actions to the first form of the SubSection's content
          // 3. Delete sideContent / actions at the (invalid) manifest level

          if (subSection.sideContent) {
            if (firstForm) {
              // If there is a form, it always needs to be attached to the form, as the form inherits the ID of the SubSection
              firstForm.sideContent = subSection.sideContent;
            } else {
              subSection.content[0].sideContent = subSection.sideContent;
            }

            subSection.sideContent = undefined;
          }

          if (firstForm && (_actions = subSection.actions) !== null && _actions !== void 0 && _actions.length) {
            firstForm.actions = subSection.actions;
            subSection.actions = [];
          }
        }
      });
    });
    return sections;
  };
  /**
   * Determines if the ObjectPage has header content.
   *
   * @param converterContext The instance of the converter context
   * @returns `true` if there is at least on header facet
   */


  _exports.getSections = getSections;

  function hasHeaderContent(converterContext) {
    var _converterContext$get3, _converterContext$get4;

    var manifestWrapper = converterContext.getManifestWrapper();
    return (((_converterContext$get3 = converterContext.getEntityType().annotations) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.UI) === null || _converterContext$get4 === void 0 ? void 0 : _converterContext$get4.HeaderFacets) || []).length > 0 || Object.keys(manifestWrapper.getHeaderFacets()).length > 0;
  }
  /**
   * Gets the expression to evaluate the visibility of the header content.
   *
   * @param converterContext The instance of the converter context
   * @returns The binding expression for the Delete button
   */


  function getShowHeaderContentExpression(converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    return ifElse(!hasHeaderContent(converterContext), constant(false), ifElse(equal(manifestWrapper.isHeaderEditable(), false), constant(true), not(UI.IsEditable)));
  }
  /**
   * Gets the binding expression to evaluate the visibility of the header content.
   *
   * @param converterContext The instance of the converter context
   * @returns The binding expression for the Delete button
   */


  var getShowHeaderContent = function (converterContext) {
    return compileExpression(getShowHeaderContentExpression(converterContext));
  };
  /**
   * Gets the binding expression to evaluate the visibility of the avatar when the header is in expanded state.
   *
   * @param converterContext The instance of the converter context
   * @returns The binding expression for the Delete button
   */


  _exports.getShowHeaderContent = getShowHeaderContent;

  var getExpandedImageVisible = function (converterContext) {
    return compileExpression(not(getShowHeaderContentExpression(converterContext)));
  };

  _exports.getExpandedImageVisible = getExpandedImageVisible;

  var convertPage = function (converterContext) {
    var _entityType$annotatio4, _entityType$annotatio5;

    var manifestWrapper = converterContext.getManifestWrapper();
    var headerSection;
    var entityType = converterContext.getEntityType(); // Retrieve all header facets (from annotations & custom)

    var headerFacets = insertCustomElements(getHeaderFacetsFromAnnotations(converterContext), getHeaderFacetsFromManifest(manifestWrapper.getHeaderFacets())); // Retrieve the page header actions

    var headerActions = getHeaderActions(converterContext); // Retrieve the page footer actions

    var footerActions = getFooterActions(converterContext);

    if (manifestWrapper.isHeaderEditable() && ((_entityType$annotatio4 = entityType.annotations.UI) !== null && _entityType$annotatio4 !== void 0 && _entityType$annotatio4.HeaderFacets || (_entityType$annotatio5 = entityType.annotations.UI) !== null && _entityType$annotatio5 !== void 0 && _entityType$annotatio5.HeaderInfo)) {
      headerSection = createEditableHeaderSection(converterContext, headerFacets);
    }

    var sections = getSections(converterContext);
    var primaryAction = getPrimaryAction(converterContext, headerActions.actions, footerActions.actions);
    return {
      template: TemplateType.ObjectPage,
      header: {
        visible: manifestWrapper.getShowObjectPageHeader(),
        section: headerSection,
        facets: headerFacets,
        actions: headerActions.actions,
        showContent: getShowHeaderContent(converterContext),
        hasContent: hasHeaderContent(converterContext),
        avatar: getAvatar(converterContext),
        title: {
          expandedImageVisible: getExpandedImageVisible(converterContext)
        }
      },
      sections: sections,
      footerActions: footerActions.actions,
      headerCommandActions: headerActions.commandActions,
      footerCommandActions: footerActions.commandActions,
      showAnchorBar: manifestWrapper.getShowAnchorBar(),
      useIconTabBar: manifestWrapper.useIconTabBar(),
      primaryAction: primaryAction
    };
  };

  _exports.convertPage = convertPage;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRTZWN0aW9uS2V5IiwiZmFjZXREZWZpbml0aW9uIiwiZmFsbGJhY2siLCJJRCIsInRvU3RyaW5nIiwiTGFiZWwiLCJjcmVhdGVFZGl0YWJsZUhlYWRlclNlY3Rpb24iLCJjb252ZXJ0ZXJDb250ZXh0IiwiYWxsSGVhZGVyRmFjZXRzIiwiZWRpdGFibGVIZWFkZXJTZWN0aW9uSUQiLCJnZXRFZGl0YWJsZUhlYWRlclNlY3Rpb25JRCIsImhlYWRlckZhY2V0cyIsImdldEVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGVhZGVyRmFjZXRzIiwiaGVhZGVyZmFjZXRTdWJTZWN0aW9ucyIsImNyZWF0ZVN1YlNlY3Rpb25zIiwiY3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucyIsImNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMiLCJhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9ucyIsImxlbmd0aCIsImkiLCJmb3JFYWNoIiwiaXRlbSIsInZpc2libGUiLCJwdXNoIiwia2V5Iiwic2xpY2UiLCJsYXN0SW5kZXhPZiIsImN1c3RvbUl0ZW0iLCJoZWFkZXJTZWN0aW9uIiwiaWQiLCJ0aXRsZSIsImNvbXBpbGVFeHByZXNzaW9uIiwiSXNFZGl0YWJsZSIsInN1YlNlY3Rpb25zIiwiZ2V0U2VjdGlvbnNGcm9tQW5ub3RhdGlvbiIsImVudGl0eVR5cGUiLCJvYmplY3RQYWdlU2VjdGlvbnMiLCJGYWNldHMiLCJtYXAiLCJnZXRTZWN0aW9uRnJvbUFubm90YXRpb24iLCJmYWNldCIsInNlY3Rpb25JRCIsImdldFNlY3Rpb25JRCIsIkZhY2V0Iiwic2VjdGlvbiIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsInNob3dUaXRsZSIsIm5vdCIsImVxdWFsIiwiSGlkZGVuIiwidmFsdWVPZiIsImdldFNlY3Rpb25zRnJvbU1hbmlmZXN0IiwibWFuaWZlc3RTZWN0aW9ucyIsInNlY3Rpb25zIiwiT2JqZWN0Iiwia2V5cyIsIm1hbmlmZXN0U2VjdGlvbktleSIsImdldFNlY3Rpb25Gcm9tTWFuaWZlc3QiLCJjdXN0b21TZWN0aW9uRGVmaW5pdGlvbiIsInNlY3Rpb25LZXkiLCJjdXN0b21TZWN0aW9uSUQiLCJnZXRDdXN0b21TZWN0aW9uSUQiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwibWFuaWZlc3RTdWJTZWN0aW9ucyIsInVuZGVmaW5lZCIsImNyZWF0ZUN1c3RvbVN1YlNlY3Rpb25zIiwiY3VzdG9tU2VjdGlvbiIsImdldEhlYWRlckFjdGlvbnMiLCJhQW5ub3RhdGlvbkhlYWRlckFjdGlvbnMiLCJnZXRIZWFkZXJEZWZhdWx0QWN0aW9ucyIsIm1hbmlmZXN0V3JhcHBlciIsImdldE1hbmlmZXN0V3JhcHBlciIsIm1hbmlmZXN0QWN0aW9ucyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJnZXRIaWRkZW5IZWFkZXJBY3Rpb25zIiwiaGVhZGVyQWN0aW9ucyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiYWN0aW9ucyIsImlzTmF2aWdhYmxlIiwiZW5hYmxlZCIsImRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbiIsImNvbW1hbmQiLCJyZW1vdmVEdXBsaWNhdGVBY3Rpb25zIiwiY29tbWFuZEFjdGlvbnMiLCJnZXRGb290ZXJBY3Rpb25zIiwiYUFubm90YXRpb25Gb290ZXJBY3Rpb25zIiwiZ2V0Rm9vdGVyRGVmYXVsdEFjdGlvbnMiLCJnZXRWaWV3TGV2ZWwiLCJmb290ZXJBY3Rpb25zIiwiZ2V0UHJpbWFyeUFjdGlvbiIsInByaW1hcnlBY3Rpb25FeHByZXNzaW9uIiwiYUFjdGlvbnMiLCJnZXRCaW5kaW5nRXhwIiwic0V4cHJlc3Npb24iLCJpbmRleE9mIiwicmVwbGFjZSIsImFTZW1hbnRpY1Bvc2l0aXZlQWN0aW9ucyIsImZpbHRlciIsIm9BY3Rpb24iLCJhbm5vdGF0aW9uUGF0aCIsInRhcmdldE9iamVjdCIsImdldENvbnZlcnRlckNvbnRleHRGb3IiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwiQ3JpdGljYWxpdHkiLCJvRW50aXR5U2V0IiwiZ2V0RW50aXR5U2V0IiwiZ2V0UHJlc3NFeHByZXNzaW9uRm9yUHJpbWFyeUFjdGlvbiIsIm5hbWUiLCJnZXRFZGl0Q29tbWFuZEV4ZWN1dGlvblZpc2libGUiLCJnZXRFZGl0Q29tbWFuZEV4ZWN1dGlvbkVuYWJsZWQiLCJfZ2V0U3ViU2VjdGlvblZpc3VhbGl6YXRpb24iLCJzdWJTZWN0aW9uIiwicHJlc2VudGF0aW9uIiwidmlzdWFsaXphdGlvbnMiLCJfaXNGYWNldEhhc0dyaWRUYWJsZVZpc2libGUiLCJkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24iLCJzdWJTZWN0aW9uVmlzdWFsaXphdGlvbiIsInR5cGUiLCJjb250cm9sIiwiX3NldEdyaWRUYWJsZVZpc3VhbGl6YXRpb25JbmZvcm1hdGlvbiIsInNlY3Rpb25MYXlvdXQiLCJ0YWJsZUNvbnRyb2xDb25maWd1cmF0aW9uIiwicm93Q291bnRNb2RlIiwiX3NldEdyaWRUYWJsZVdpdGhNaXhGYWNldHNJbmZvcm1hdGlvbiIsImNvbnRlbnQiLCJfc2V0R3JpZFRhYmxlU3ViU2VjdGlvbkNvbnRyb2xDb25maWd1cmF0aW9uIiwiZ2V0U2VjdGlvbnMiLCJnZXRTZWN0aW9uTGF5b3V0IiwiZmlyc3RGb3JtIiwiZmluZCIsImVsZW1lbnQiLCJTdWJTZWN0aW9uVHlwZSIsIkZvcm0iLCJzaWRlQ29udGVudCIsImhhc0hlYWRlckNvbnRlbnQiLCJnZXRIZWFkZXJGYWNldHMiLCJnZXRTaG93SGVhZGVyQ29udGVudEV4cHJlc3Npb24iLCJpZkVsc2UiLCJjb25zdGFudCIsImlzSGVhZGVyRWRpdGFibGUiLCJnZXRTaG93SGVhZGVyQ29udGVudCIsImdldEV4cGFuZGVkSW1hZ2VWaXNpYmxlIiwiY29udmVydFBhZ2UiLCJnZXRIZWFkZXJGYWNldHNGcm9tQW5ub3RhdGlvbnMiLCJnZXRIZWFkZXJGYWNldHNGcm9tTWFuaWZlc3QiLCJIZWFkZXJJbmZvIiwicHJpbWFyeUFjdGlvbiIsInRlbXBsYXRlIiwiVGVtcGxhdGVUeXBlIiwiT2JqZWN0UGFnZSIsImhlYWRlciIsImdldFNob3dPYmplY3RQYWdlSGVhZGVyIiwiZmFjZXRzIiwic2hvd0NvbnRlbnQiLCJoYXNDb250ZW50IiwiYXZhdGFyIiwiZ2V0QXZhdGFyIiwiZXhwYW5kZWRJbWFnZVZpc2libGUiLCJoZWFkZXJDb21tYW5kQWN0aW9ucyIsImZvb3RlckNvbW1hbmRBY3Rpb25zIiwic2hvd0FuY2hvckJhciIsImdldFNob3dBbmNob3JCYXIiLCJ1c2VJY29uVGFiQmFyIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJPYmplY3RQYWdlQ29udmVydGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGYWNldFR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9VSVwiO1xuaW1wb3J0IHR5cGUgeyBCYXNlQWN0aW9uLCBDb21iaW5lZEFjdGlvbiwgQ3VzdG9tQWN0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCwgcmVtb3ZlRHVwbGljYXRlQWN0aW9ucyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24sIFRhYmxlVmlzdWFsaXphdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9UYWJsZVwiO1xuaW1wb3J0IHtcblx0Z2V0Rm9vdGVyRGVmYXVsdEFjdGlvbnMsXG5cdGdldEhlYWRlckRlZmF1bHRBY3Rpb25zLFxuXHRnZXRIaWRkZW5IZWFkZXJBY3Rpb25zXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL29iamVjdFBhZ2UvSGVhZGVyQW5kRm9vdGVyQWN0aW9uXCI7XG5pbXBvcnQgdHlwZSB7IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiwgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIGNvbnN0YW50LCBlcXVhbCwgZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uLCBpZkVsc2UsIG5vdCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQge1xuXHRnZXRFZGl0Q29tbWFuZEV4ZWN1dGlvbkVuYWJsZWQsXG5cdGdldEVkaXRDb21tYW5kRXhlY3V0aW9uVmlzaWJsZSxcblx0Z2V0UHJlc3NFeHByZXNzaW9uRm9yUHJpbWFyeUFjdGlvblxufSBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9PYmplY3RQYWdlL09iamVjdFBhZ2VUZW1wbGF0aW5nXCI7XG5pbXBvcnQgdHlwZSB7IEF2YXRhciB9IGZyb20gXCIuLi9jb250cm9scy9PYmplY3RQYWdlL0F2YXRhclwiO1xuaW1wb3J0IHsgZ2V0QXZhdGFyIH0gZnJvbSBcIi4uL2NvbnRyb2xzL09iamVjdFBhZ2UvQXZhdGFyXCI7XG5pbXBvcnQgdHlwZSB7IE9iamVjdFBhZ2VIZWFkZXJGYWNldCB9IGZyb20gXCIuLi9jb250cm9scy9PYmplY3RQYWdlL0hlYWRlckZhY2V0XCI7XG5pbXBvcnQgeyBnZXRIZWFkZXJGYWNldHNGcm9tQW5ub3RhdGlvbnMsIGdldEhlYWRlckZhY2V0c0Zyb21NYW5pZmVzdCB9IGZyb20gXCIuLi9jb250cm9scy9PYmplY3RQYWdlL0hlYWRlckZhY2V0XCI7XG5pbXBvcnQgdHlwZSB7XG5cdEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uLFxuXHREYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24sXG5cdEZvcm1TdWJTZWN0aW9uLFxuXHRPYmplY3RQYWdlU2VjdGlvbixcblx0T2JqZWN0UGFnZVN1YlNlY3Rpb25cbn0gZnJvbSBcIi4uL2NvbnRyb2xzL09iamVjdFBhZ2UvU3ViU2VjdGlvblwiO1xuaW1wb3J0IHtcblx0Y3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucyxcblx0Y3JlYXRlQ3VzdG9tU3ViU2VjdGlvbnMsXG5cdGNyZWF0ZVN1YlNlY3Rpb25zLFxuXHRTdWJTZWN0aW9uVHlwZVxufSBmcm9tIFwiLi4vY29udHJvbHMvT2JqZWN0UGFnZS9TdWJTZWN0aW9uXCI7XG5pbXBvcnQgdHlwZSBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCIuLi9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBVSSB9IGZyb20gXCIuLi9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgQ29uZmlndXJhYmxlUmVjb3JkLCBQb3NpdGlvbiB9IGZyb20gXCIuLi9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCB9IGZyb20gXCIuLi9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgZ2V0Q3VzdG9tU2VjdGlvbklELCBnZXRFZGl0YWJsZUhlYWRlclNlY3Rpb25JRCwgZ2V0U2VjdGlvbklEIH0gZnJvbSBcIi4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB0eXBlIHsgTWFuaWZlc3RTZWN0aW9uLCBNYW5pZmVzdFN1YlNlY3Rpb24gfSBmcm9tIFwiLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgVGVtcGxhdGVUeXBlIH0gZnJvbSBcIi4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB0eXBlIHsgUGFnZURlZmluaXRpb24gfSBmcm9tIFwiLi4vVGVtcGxhdGVDb252ZXJ0ZXJcIjtcblxuZXhwb3J0IHR5cGUgT2JqZWN0UGFnZURlZmluaXRpb24gPSBQYWdlRGVmaW5pdGlvbiAmIHtcblx0aGVhZGVyOiB7XG5cdFx0dmlzaWJsZTogYm9vbGVhbjtcblx0XHRzZWN0aW9uPzogT2JqZWN0UGFnZVNlY3Rpb247XG5cdFx0ZmFjZXRzOiBPYmplY3RQYWdlSGVhZGVyRmFjZXRbXTtcblx0XHRhY3Rpb25zOiBCYXNlQWN0aW9uW107XG5cdFx0c2hvd0NvbnRlbnQ6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHRcdGhhc0NvbnRlbnQ6IGJvb2xlYW47XG5cdFx0YXZhdGFyPzogQXZhdGFyO1xuXHRcdHRpdGxlOiB7XG5cdFx0XHRleHBhbmRlZEltYWdlVmlzaWJsZTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdFx0fTtcblx0fTtcblx0c2VjdGlvbnM6IE9iamVjdFBhZ2VTZWN0aW9uW107XG5cdGZvb3RlckFjdGlvbnM6IEJhc2VBY3Rpb25bXTtcblx0aGVhZGVyQ29tbWFuZEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj47XG5cdGZvb3RlckNvbW1hbmRBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+O1xuXHRzaG93QW5jaG9yQmFyOiBib29sZWFuO1xuXHR1c2VJY29uVGFiQmFyOiBib29sZWFuO1xuXHRwcmltYXJ5QWN0aW9uOiBzdHJpbmc7XG59O1xuXG5jb25zdCBnZXRTZWN0aW9uS2V5ID0gKGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgZmFsbGJhY2s6IHN0cmluZyk6IHN0cmluZyA9PiB7XG5cdHJldHVybiBmYWNldERlZmluaXRpb24uSUQ/LnRvU3RyaW5nKCkgfHwgZmFjZXREZWZpbml0aW9uLkxhYmVsPy50b1N0cmluZygpIHx8IGZhbGxiYWNrO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2VjdGlvbiB0aGF0IHJlcHJlc2VudHMgdGhlIGVkaXRhYmxlIGhlYWRlciBwYXJ0OyBpdCBpcyBvbmx5IHZpc2libGUgaW4gZWRpdCBtb2RlLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGFsbEhlYWRlckZhY2V0cyBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBzZWN0aW9uIHJlcHJlc2VudGluZyB0aGUgZWRpdGFibGUgaGVhZGVyIHBhcnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZGl0YWJsZUhlYWRlclNlY3Rpb24oXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGFsbEhlYWRlckZhY2V0czogT2JqZWN0UGFnZUhlYWRlckZhY2V0W11cbik6IE9iamVjdFBhZ2VTZWN0aW9uIHtcblx0Y29uc3QgZWRpdGFibGVIZWFkZXJTZWN0aW9uSUQgPSBnZXRFZGl0YWJsZUhlYWRlclNlY3Rpb25JRCgpO1xuXHRjb25zdCBoZWFkZXJGYWNldHMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKS5hbm5vdGF0aW9ucz8uVUk/LkhlYWRlckZhY2V0cztcblx0Y29uc3QgaGVhZGVyZmFjZXRTdWJTZWN0aW9ucyA9IGhlYWRlckZhY2V0cyA/IGNyZWF0ZVN1YlNlY3Rpb25zKGhlYWRlckZhY2V0cywgY29udmVydGVyQ29udGV4dCwgdHJ1ZSkgOiBbXTtcblx0Y29uc3QgY3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucyA9IGNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cdGxldCBhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9uczogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSA9IFtdO1xuXHRpZiAoY3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0Ly8gbWVyZ2UgYW5ub3RhdGlvbiBiYXNlZCBoZWFkZXIgZmFjZXRzIGFuZCBjdXN0b20gaGVhZGVyIGZhY2V0cyBpbiB0aGUgcmlnaHQgb3JkZXJcblx0XHRsZXQgaSA9IDA7XG5cdFx0YWxsSGVhZGVyRmFjZXRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdC8vIGhpZGRlbiBoZWFkZXIgZmFjZXRzIGFyZSBub3QgaW5jbHVkZWQgaW4gYWxsSGVhZGVyRmFjZXRzIGFycmF5ID0+IGFkZCB0aGVtIGFueXdheVxuXHRcdFx0d2hpbGUgKGhlYWRlcmZhY2V0U3ViU2VjdGlvbnMubGVuZ3RoID4gaSAmJiBoZWFkZXJmYWNldFN1YlNlY3Rpb25zW2ldLnZpc2libGUgPT09IFwiZmFsc2VcIikge1xuXHRcdFx0XHRhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9ucy5wdXNoKGhlYWRlcmZhY2V0U3ViU2VjdGlvbnNbaV0pO1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGhlYWRlcmZhY2V0U3ViU2VjdGlvbnMubGVuZ3RoID4gaSAmJlxuXHRcdFx0XHQoaXRlbS5rZXkgPT09IGhlYWRlcmZhY2V0U3ViU2VjdGlvbnNbaV0ua2V5IHx8XG5cdFx0XHRcdFx0Ly8gZm9yIGhlYWRlciBmYWNldHMgd2l0aCBubyBpZCB0aGUga2V5cyBvZiBoZWFkZXIgZmFjZXQgYW5kIHN1YnNlY3Rpb24gYXJlIGRpZmZlcmVudCA9PiBjaGVjayBvbmx5IHRoZSBsYXN0IHBhcnRcblx0XHRcdFx0XHRpdGVtLmtleS5zbGljZShpdGVtLmtleS5sYXN0SW5kZXhPZihcIjo6XCIpICsgMikgPT09XG5cdFx0XHRcdFx0XHRoZWFkZXJmYWNldFN1YlNlY3Rpb25zW2ldLmtleS5zbGljZShoZWFkZXJmYWNldFN1YlNlY3Rpb25zW2ldLmtleS5sYXN0SW5kZXhPZihcIjo6XCIpICsgMikpXG5cdFx0XHQpIHtcblx0XHRcdFx0YWxsSGVhZGVyRmFjZXRzU3ViU2VjdGlvbnMucHVzaChoZWFkZXJmYWNldFN1YlNlY3Rpb25zW2ldKTtcblx0XHRcdFx0aSsrO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChjdXN0b21JdGVtKSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0ua2V5ID09PSBjdXN0b21JdGVtLmtleSkge1xuXHRcdFx0XHRcdFx0YWxsSGVhZGVyRmFjZXRzU3ViU2VjdGlvbnMucHVzaChjdXN0b21JdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGFsbEhlYWRlckZhY2V0c1N1YlNlY3Rpb25zID0gaGVhZGVyZmFjZXRTdWJTZWN0aW9ucztcblx0fVxuXHRjb25zdCBoZWFkZXJTZWN0aW9uOiBPYmplY3RQYWdlU2VjdGlvbiA9IHtcblx0XHRpZDogZWRpdGFibGVIZWFkZXJTZWN0aW9uSUQsXG5cdFx0a2V5OiBcIkVkaXRhYmxlSGVhZGVyQ29udGVudFwiLFxuXHRcdHRpdGxlOiBcIntzYXAuZmUuaTE4bj5UX0NPTU1PTl9PQkpFQ1RfUEFHRV9IRUFERVJfU0VDVElPTn1cIixcblx0XHR2aXNpYmxlOiBjb21waWxlRXhwcmVzc2lvbihVSS5Jc0VkaXRhYmxlKSxcblx0XHRzdWJTZWN0aW9uczogYWxsSGVhZGVyRmFjZXRzU3ViU2VjdGlvbnNcblx0fTtcblx0cmV0dXJuIGhlYWRlclNlY3Rpb247XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlZmluaXRpb24gZm9yIGEgc2VjdGlvbiBiYXNlZCBvbiB0aGUgRmFjZXQgYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIEFsbCBzZWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRTZWN0aW9uc0Zyb21Bbm5vdGF0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlU2VjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBvYmplY3RQYWdlU2VjdGlvbnM6IE9iamVjdFBhZ2VTZWN0aW9uW10gPVxuXHRcdGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5GYWNldHM/Lm1hcCgoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzKSA9PlxuXHRcdFx0Z2V0U2VjdGlvbkZyb21Bbm5vdGF0aW9uKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHQpIHx8IFtdO1xuXHRyZXR1cm4gb2JqZWN0UGFnZVNlY3Rpb25zO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBhbm5vdGF0aW9uIGJhc2VkIHNlY3Rpb24uXG4gKlxuICogQHBhcmFtIGZhY2V0XG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMgVGhlIGN1cnJlbnQgc2VjdGlvblxuICovXG5mdW5jdGlvbiBnZXRTZWN0aW9uRnJvbUFubm90YXRpb24oZmFjZXQ6IEZhY2V0VHlwZXMsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlU2VjdGlvbiB7XG5cdGNvbnN0IHNlY3Rpb25JRCA9IGdldFNlY3Rpb25JRCh7IEZhY2V0OiBmYWNldCB9KTtcblx0Y29uc3Qgc2VjdGlvbjogT2JqZWN0UGFnZVNlY3Rpb24gPSB7XG5cdFx0aWQ6IHNlY3Rpb25JRCxcblx0XHRrZXk6IGdldFNlY3Rpb25LZXkoZmFjZXQsIHNlY3Rpb25JRCksXG5cdFx0dGl0bGU6IGNvbXBpbGVFeHByZXNzaW9uKGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihmYWNldC5MYWJlbCkpLFxuXHRcdHNob3dUaXRsZTogISFmYWNldC5MYWJlbCxcblx0XHR2aXNpYmxlOiBjb21waWxlRXhwcmVzc2lvbihub3QoZXF1YWwoZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdHN1YlNlY3Rpb25zOiBjcmVhdGVTdWJTZWN0aW9ucyhbZmFjZXRdLCBjb252ZXJ0ZXJDb250ZXh0KVxuXHR9O1xuXHRyZXR1cm4gc2VjdGlvbjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHNlY3Rpb24gZGVmaW5pdGlvbnMgYmFzZWQgb24gdGhlIG1hbmlmZXN0IGRlZmluaXRpb25zLlxuICpcbiAqIEBwYXJhbSBtYW5pZmVzdFNlY3Rpb25zIFRoZSBzZWN0aW9ucyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBzZWN0aW9ucyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICovXG5mdW5jdGlvbiBnZXRTZWN0aW9uc0Zyb21NYW5pZmVzdChcblx0bWFuaWZlc3RTZWN0aW9uczogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0U2VjdGlvbj4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uPiB7XG5cdGNvbnN0IHNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlU2VjdGlvbj4gPSB7fTtcblx0T2JqZWN0LmtleXMobWFuaWZlc3RTZWN0aW9ucykuZm9yRWFjaCgobWFuaWZlc3RTZWN0aW9uS2V5KSA9PiB7XG5cdFx0c2VjdGlvbnNbbWFuaWZlc3RTZWN0aW9uS2V5XSA9IGdldFNlY3Rpb25Gcm9tTWFuaWZlc3QobWFuaWZlc3RTZWN0aW9uc1ttYW5pZmVzdFNlY3Rpb25LZXldLCBtYW5pZmVzdFNlY3Rpb25LZXksIGNvbnZlcnRlckNvbnRleHQpO1xuXHR9KTtcblx0cmV0dXJuIHNlY3Rpb25zO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG1hbmlmZXN0LWJhc2VkIGN1c3RvbSBzZWN0aW9uLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TZWN0aW9uRGVmaW5pdGlvblxuICogQHBhcmFtIHNlY3Rpb25LZXlcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgY3VycmVudCBjdXN0b20gc2VjdGlvblxuICovXG5mdW5jdGlvbiBnZXRTZWN0aW9uRnJvbU1hbmlmZXN0KFxuXHRjdXN0b21TZWN0aW9uRGVmaW5pdGlvbjogTWFuaWZlc3RTZWN0aW9uLFxuXHRzZWN0aW9uS2V5OiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uIHtcblx0Y29uc3QgY3VzdG9tU2VjdGlvbklEID0gY3VzdG9tU2VjdGlvbkRlZmluaXRpb24uaWQgfHwgZ2V0Q3VzdG9tU2VjdGlvbklEKHNlY3Rpb25LZXkpO1xuXHRsZXQgcG9zaXRpb246IFBvc2l0aW9uIHwgdW5kZWZpbmVkID0gY3VzdG9tU2VjdGlvbkRlZmluaXRpb24ucG9zaXRpb247XG5cdGlmICghcG9zaXRpb24pIHtcblx0XHRwb3NpdGlvbiA9IHtcblx0XHRcdHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyXG5cdFx0fTtcblx0fVxuXHRsZXQgbWFuaWZlc3RTdWJTZWN0aW9uczogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RTdWJTZWN0aW9uPjtcblx0aWYgKCFjdXN0b21TZWN0aW9uRGVmaW5pdGlvbi5zdWJTZWN0aW9ucykge1xuXHRcdC8vIElmIHRoZXJlIGlzIG5vIHN1YlNlY3Rpb24gZGVmaW5lZCwgd2UgYWRkIHRoZSBjb250ZW50IG9mIHRoZSBjdXN0b20gc2VjdGlvbiBhcyBzdWJzZWN0aW9uc1xuXHRcdC8vIGFuZCBtYWtlIHN1cmUgdG8gc2V0IHRoZSB2aXNpYmlsaXR5IHRvICd0cnVlJywgYXMgdGhlIGFjdHVhbCB2aXNpYmlsaXR5IGlzIGhhbmRsZWQgYnkgdGhlIHNlY3Rpb24gaXRzZWxmXG5cdFx0bWFuaWZlc3RTdWJTZWN0aW9ucyA9IHtcblx0XHRcdFtzZWN0aW9uS2V5XToge1xuXHRcdFx0XHQuLi5jdXN0b21TZWN0aW9uRGVmaW5pdGlvbixcblx0XHRcdFx0cG9zaXRpb246IHVuZGVmaW5lZCxcblx0XHRcdFx0dmlzaWJsZTogXCJ0cnVlXCJcblx0XHRcdH1cblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdG1hbmlmZXN0U3ViU2VjdGlvbnMgPSBjdXN0b21TZWN0aW9uRGVmaW5pdGlvbi5zdWJTZWN0aW9ucztcblx0fVxuXHRjb25zdCBzdWJTZWN0aW9ucyA9IGNyZWF0ZUN1c3RvbVN1YlNlY3Rpb25zKG1hbmlmZXN0U3ViU2VjdGlvbnMsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdGNvbnN0IGN1c3RvbVNlY3Rpb246IEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uID0ge1xuXHRcdGlkOiBjdXN0b21TZWN0aW9uSUQsXG5cdFx0a2V5OiBzZWN0aW9uS2V5LFxuXHRcdHRpdGxlOiBjdXN0b21TZWN0aW9uRGVmaW5pdGlvbi50aXRsZSxcblx0XHRzaG93VGl0bGU6ICEhY3VzdG9tU2VjdGlvbkRlZmluaXRpb24udGl0bGUsXG5cdFx0dmlzaWJsZTogY3VzdG9tU2VjdGlvbkRlZmluaXRpb24udmlzaWJsZSAhPT0gdW5kZWZpbmVkID8gY3VzdG9tU2VjdGlvbkRlZmluaXRpb24udmlzaWJsZSA6IFwidHJ1ZVwiLFxuXHRcdHBvc2l0aW9uOiBwb3NpdGlvbixcblx0XHRzdWJTZWN0aW9uczogc3ViU2VjdGlvbnMgYXMgYW55XG5cdH07XG5cdHJldHVybiBjdXN0b21TZWN0aW9uO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgT2JqZWN0UGFnZSBoZWFkZXIgYWN0aW9ucyAoYm90aCB0aGUgZGVmYXVsdCBvbmVzIGFuZCB0aGUgY3VzdG9tIG9uZXMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QpLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgQW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGFjdGlvbnMgZm9yIHRoaXMgT2JqZWN0UGFnZSBoZWFkZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEhlYWRlckFjdGlvbnMgPSBmdW5jdGlvbiAoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IENvbWJpbmVkQWN0aW9uIHtcblx0Y29uc3QgYUFubm90YXRpb25IZWFkZXJBY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBnZXRIZWFkZXJEZWZhdWx0QWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0Y29uc3QgbWFuaWZlc3RBY3Rpb25zID0gZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdChcblx0XHRtYW5pZmVzdFdyYXBwZXIuZ2V0SGVhZGVyQWN0aW9ucygpLFxuXHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0YUFubm90YXRpb25IZWFkZXJBY3Rpb25zLFxuXHRcdHVuZGVmaW5lZCxcblx0XHR1bmRlZmluZWQsXG5cdFx0Z2V0SGlkZGVuSGVhZGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KVxuXHQpO1xuXHRjb25zdCBoZWFkZXJBY3Rpb25zID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYUFubm90YXRpb25IZWFkZXJBY3Rpb25zLCBtYW5pZmVzdEFjdGlvbnMuYWN0aW9ucywge1xuXHRcdGlzTmF2aWdhYmxlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGVuYWJsZWQ6IFwib3ZlcndyaXRlXCIsXG5cdFx0dmlzaWJsZTogXCJvdmVyd3JpdGVcIixcblx0XHRkZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb246IFwib3ZlcndyaXRlXCIsXG5cdFx0Y29tbWFuZDogXCJvdmVyd3JpdGVcIlxuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRhY3Rpb25zOiByZW1vdmVEdXBsaWNhdGVBY3Rpb25zKGhlYWRlckFjdGlvbnMpLFxuXHRcdGNvbW1hbmRBY3Rpb25zOiBtYW5pZmVzdEFjdGlvbnMuY29tbWFuZEFjdGlvbnNcblx0fTtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBPYmplY3RQYWdlIGZvb3RlciBhY3Rpb25zIChib3RoIHRoZSBkZWZhdWx0IG9uZXMgYW5kIHRoZSBjdXN0b20gb25lcyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdCkuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgYWN0aW9ucyBmb3IgdGhpcyBPYmplY3RQYWdlIGZvb3RlclxuICovXG5leHBvcnQgY29uc3QgZ2V0Rm9vdGVyQWN0aW9ucyA9IGZ1bmN0aW9uIChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29tYmluZWRBY3Rpb24ge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBhQW5ub3RhdGlvbkZvb3RlckFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGdldEZvb3RlckRlZmF1bHRBY3Rpb25zKG1hbmlmZXN0V3JhcHBlci5nZXRWaWV3TGV2ZWwoKSwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IG1hbmlmZXN0QWN0aW9ucyA9IGdldEFjdGlvbnNGcm9tTWFuaWZlc3QobWFuaWZlc3RXcmFwcGVyLmdldEZvb3RlckFjdGlvbnMoKSwgY29udmVydGVyQ29udGV4dCwgYUFubm90YXRpb25Gb290ZXJBY3Rpb25zKTtcblx0Y29uc3QgZm9vdGVyQWN0aW9ucyA9IGluc2VydEN1c3RvbUVsZW1lbnRzKGFBbm5vdGF0aW9uRm9vdGVyQWN0aW9ucywgbWFuaWZlc3RBY3Rpb25zLmFjdGlvbnMsIHtcblx0XHRpc05hdmlnYWJsZTogXCJvdmVyd3JpdGVcIixcblx0XHRlbmFibGVkOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdHZpc2libGU6IFwib3ZlcndyaXRlXCIsXG5cdFx0ZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGNvbW1hbmQ6IFwib3ZlcndyaXRlXCJcblx0fSk7XG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczogZm9vdGVyQWN0aW9ucyxcblx0XHRjb21tYW5kQWN0aW9uczogbWFuaWZlc3RBY3Rpb25zLmNvbW1hbmRBY3Rpb25zXG5cdH07XG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byBnZXQgdGhlIGV4cHJlc3Npb24gZm9yIHRoZSBleGVjdXRlIGV2ZW50IG9mIHRoZSBmb3J3YXJkIGFjdGlvbi5cbiAqIEdlbmVyYXRlcyBwcmltYXJ5QWN0aW9uRXhwcmVzc2lvbiB0byBiZSBleGVjdXRlZCBvbiB0aGUga2V5Ym9hcmQgc2hvcnRjdXQgQ3RybCtFbnRlciB3aXRoIHRoZVxuICogZm9yd2FyZCBmbG93IChwcmlvcml0eSBpcyB0aGUgc2VtYW50aWMgcG9zaXRpdmUgYWN0aW9uIE9SIGlmIHRoYXQncyBub3QgdGhlcmUsIHRoZW4gdGhlIHByaW1hcnkgYWN0aW9uKS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBoZWFkZXJBY3Rpb25zIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBhY3Rpb25zIGZvciB0aGlzIE9iamVjdFBhZ2UgaGVhZGVyXG4gKiBAcGFyYW0gZm9vdGVyQWN0aW9ucyBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgYWN0aW9ucyBmb3IgdGhpcyBPYmplY3RQYWdlIGZvb3RlclxuICogQHJldHVybnMge3N0cmluZ30gIEJpbmRpbmcgZXhwcmVzc2lvbiBvciBmdW5jdGlvbiBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGdldFByaW1hcnlBY3Rpb24gPSBmdW5jdGlvbiAoXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGhlYWRlckFjdGlvbnM6IEJhc2VBY3Rpb25bXSxcblx0Zm9vdGVyQWN0aW9uczogQmFzZUFjdGlvbltdXG4pOiBzdHJpbmcge1xuXHRsZXQgcHJpbWFyeUFjdGlvbkV4cHJlc3Npb24gPSBcIlwiO1xuXHRjb25zdCBhQWN0aW9ucyA9IFsuLi5oZWFkZXJBY3Rpb25zLCAuLi5mb290ZXJBY3Rpb25zXTtcblxuXHRjb25zdCBnZXRCaW5kaW5nRXhwID0gZnVuY3Rpb24gKHNFeHByZXNzaW9uOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB8IHN0cmluZykge1xuXHRcdGlmIChzRXhwcmVzc2lvbiAmJiBzRXhwcmVzc2lvbi5pbmRleE9mKFwiez1cIikgPiAtMSkge1xuXHRcdFx0cmV0dXJuIHNFeHByZXNzaW9uLnJlcGxhY2UoXCJ7PVwiLCBcIihcIikuc2xpY2UoMCwgLTEpICsgXCIpXCI7XG5cdFx0fVxuXHRcdHJldHVybiBzRXhwcmVzc2lvbjtcblx0fTtcblx0Y29uc3QgYVNlbWFudGljUG9zaXRpdmVBY3Rpb25zID0gYUFjdGlvbnMuZmlsdGVyKChvQWN0aW9uKSA9PiB7XG5cdFx0aWYgKG9BY3Rpb24/LmFubm90YXRpb25QYXRoKSB7XG5cdFx0XHRjb25zdCB0YXJnZXRPYmplY3QgPSBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlckNvbnRleHRGb3Iob0FjdGlvbj8uYW5ub3RhdGlvblBhdGgpLmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS50YXJnZXRPYmplY3Q7XG5cdFx0XHRpZiAodGFyZ2V0T2JqZWN0Py5Dcml0aWNhbGl0eSAmJiB0YXJnZXRPYmplY3Q/LkNyaXRpY2FsaXR5ID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Qb3NpdGl2ZVwiKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdGNvbnN0IG9FbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRpZiAoYVNlbWFudGljUG9zaXRpdmVBY3Rpb25zLmxlbmd0aCA+IDApIHtcblx0XHRwcmltYXJ5QWN0aW9uRXhwcmVzc2lvbiA9IGdldFByZXNzRXhwcmVzc2lvbkZvclByaW1hcnlBY3Rpb24oXG5cdFx0XHRhU2VtYW50aWNQb3NpdGl2ZUFjdGlvbnNbMF0uYW5ub3RhdGlvblBhdGggJiZcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKGFTZW1hbnRpY1Bvc2l0aXZlQWN0aW9uc1swXS5hbm5vdGF0aW9uUGF0aCkuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldE9iamVjdCxcblx0XHRcdG9FbnRpdHlTZXQ/Lm5hbWUsXG5cdFx0XHRhU2VtYW50aWNQb3NpdGl2ZUFjdGlvbnNbMF0sXG5cdFx0XHRnZXRCaW5kaW5nRXhwKGFTZW1hbnRpY1Bvc2l0aXZlQWN0aW9uc1swXS52aXNpYmxlID8/IFwidHJ1ZVwiKSxcblx0XHRcdGdldEJpbmRpbmdFeHAoYVNlbWFudGljUG9zaXRpdmVBY3Rpb25zWzBdLmVuYWJsZWQgPz8gXCJ0cnVlXCIpLFxuXHRcdFx0Z2V0QmluZGluZ0V4cChnZXRFZGl0Q29tbWFuZEV4ZWN1dGlvblZpc2libGUoaGVhZGVyQWN0aW9ucykpLFxuXHRcdFx0Z2V0QmluZGluZ0V4cChnZXRFZGl0Q29tbWFuZEV4ZWN1dGlvbkVuYWJsZWQoaGVhZGVyQWN0aW9ucykpXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRwcmltYXJ5QWN0aW9uRXhwcmVzc2lvbiA9IGdldFByZXNzRXhwcmVzc2lvbkZvclByaW1hcnlBY3Rpb24oXG5cdFx0XHRudWxsLFxuXHRcdFx0b0VudGl0eVNldD8ubmFtZSxcblx0XHRcdG51bGwsXG5cdFx0XHRcImZhbHNlXCIsXG5cdFx0XHRcImZhbHNlXCIsXG5cdFx0XHRnZXRCaW5kaW5nRXhwKGdldEVkaXRDb21tYW5kRXhlY3V0aW9uVmlzaWJsZShoZWFkZXJBY3Rpb25zKSksXG5cdFx0XHRnZXRCaW5kaW5nRXhwKGdldEVkaXRDb21tYW5kRXhlY3V0aW9uRW5hYmxlZChoZWFkZXJBY3Rpb25zKSlcblx0XHQpO1xuXHR9XG5cdHJldHVybiBwcmltYXJ5QWN0aW9uRXhwcmVzc2lvbjtcbn07XG5cbmZ1bmN0aW9uIF9nZXRTdWJTZWN0aW9uVmlzdWFsaXphdGlvbihzdWJTZWN0aW9uOiBEYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24pOiBUYWJsZVZpc3VhbGl6YXRpb24ge1xuXHRyZXR1cm4gKHN1YlNlY3Rpb24/LnByZXNlbnRhdGlvbj8udmlzdWFsaXphdGlvbnNbMF0gPyBzdWJTZWN0aW9uLnByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1swXSA6IHVuZGVmaW5lZCkgYXMgVGFibGVWaXN1YWxpemF0aW9uO1xufVxuXG5mdW5jdGlvbiBfaXNGYWNldEhhc0dyaWRUYWJsZVZpc2libGUoXG5cdGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbjogRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uLFxuXHRzdWJTZWN0aW9uVmlzdWFsaXphdGlvbjogVGFibGVWaXN1YWxpemF0aW9uXG4pOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHRkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24udmlzaWJsZSA9PT0gXCJ0cnVlXCIgJiZcblx0XHRkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24/LnByZXNlbnRhdGlvbj8udmlzdWFsaXphdGlvbnMgJiZcblx0XHRzdWJTZWN0aW9uVmlzdWFsaXphdGlvbj8udHlwZSA9PT0gXCJUYWJsZVwiICYmXG5cdFx0c3ViU2VjdGlvblZpc3VhbGl6YXRpb24/LmNvbnRyb2w/LnR5cGUgPT09IFwiR3JpZFRhYmxlXCJcblx0KTtcbn1cblxuZnVuY3Rpb24gX3NldEdyaWRUYWJsZVZpc3VhbGl6YXRpb25JbmZvcm1hdGlvbihcblx0c2VjdGlvbnM6IE9iamVjdFBhZ2VTZWN0aW9uW10sXG5cdGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbjogRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uLFxuXHRzdWJTZWN0aW9uVmlzdWFsaXphdGlvbjogVGFibGVWaXN1YWxpemF0aW9uLFxuXHRzZWN0aW9uTGF5b3V0OiBzdHJpbmdcbik6IHZvaWQge1xuXHRpZiAoX2lzRmFjZXRIYXNHcmlkVGFibGVWaXNpYmxlKGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbiwgc3ViU2VjdGlvblZpc3VhbGl6YXRpb24pKSB7XG5cdFx0Y29uc3QgdGFibGVDb250cm9sQ29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbiA9IHN1YlNlY3Rpb25WaXN1YWxpemF0aW9uLmNvbnRyb2w7XG5cdFx0aWYgKCEoc2VjdGlvbkxheW91dCA9PT0gXCJQYWdlXCIgJiYgc2VjdGlvbnMubGVuZ3RoID4gMSkpIHtcblx0XHRcdHRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24ucm93Q291bnRNb2RlID0gXCJBdXRvXCI7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIF9zZXRHcmlkVGFibGVXaXRoTWl4RmFjZXRzSW5mb3JtYXRpb24oc3ViU2VjdGlvbjogRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uKTogdm9pZCB7XG5cdGlmIChzdWJTZWN0aW9uPy5jb250ZW50KSB7XG5cdFx0aWYgKHN1YlNlY3Rpb24uY29udGVudC5sZW5ndGggPT09IDEpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0KChzdWJTZWN0aW9uLmNvbnRlbnRbMF0gYXMgRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uKS5wcmVzZW50YXRpb24/LnZpc3VhbGl6YXRpb25zWzBdIGFzIFRhYmxlVmlzdWFsaXphdGlvbikuY29udHJvbFxuXHRcdFx0XHRcdC50eXBlID09PSBcIkdyaWRUYWJsZVwiXG5cdFx0XHQpIHtcblx0XHRcdFx0KFxuXHRcdFx0XHRcdChzdWJTZWN0aW9uLmNvbnRlbnRbMF0gYXMgRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uKS5wcmVzZW50YXRpb24/LnZpc3VhbGl6YXRpb25zWzBdIGFzIFRhYmxlVmlzdWFsaXphdGlvblxuXHRcdFx0XHQpLmNvbnRyb2wucm93Q291bnRNb2RlID0gXCJBdXRvXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogU2V0IHRoZSBHcmlkVGFibGUgZGlzcGxheSBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0gc2VjdGlvbnMgVGhlIE9iamVjdFBhZ2Ugc2VjdGlvbnNcbiAqIEBwYXJhbSBzZWN0aW9uIFRoZSBjdXJyZW50IE9iamVjdFBhZ2Ugc2VjdGlvbiBwcm9jZXNzZWRcbiAqIEBwYXJhbSBzZWN0aW9uTGF5b3V0XG4gKi9cbmZ1bmN0aW9uIF9zZXRHcmlkVGFibGVTdWJTZWN0aW9uQ29udHJvbENvbmZpZ3VyYXRpb24oXG5cdHNlY3Rpb25zOiBPYmplY3RQYWdlU2VjdGlvbltdLFxuXHRzZWN0aW9uOiBPYmplY3RQYWdlU2VjdGlvbixcblx0c2VjdGlvbkxheW91dDogc3RyaW5nXG4pOiB2b2lkIHtcblx0bGV0IGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbjogRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uO1xuXHRsZXQgc3ViU2VjdGlvblZpc3VhbGl6YXRpb246IFRhYmxlVmlzdWFsaXphdGlvbjtcblx0Y29uc3Qgc3ViU2VjdGlvbnMgPSBzZWN0aW9uLnN1YlNlY3Rpb25zO1xuXHRpZiAoc3ViU2VjdGlvbnMubGVuZ3RoID09PSAxKSB7XG5cdFx0ZGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uID0gc3ViU2VjdGlvbnNbMF0gYXMgRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uO1xuXHRcdHN3aXRjaCAoc3ViU2VjdGlvbnNbMF0udHlwZSkge1xuXHRcdFx0Y2FzZSBcIkRhdGFWaXN1YWxpemF0aW9uXCI6XG5cdFx0XHRcdHN1YlNlY3Rpb25WaXN1YWxpemF0aW9uID0gX2dldFN1YlNlY3Rpb25WaXN1YWxpemF0aW9uKGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbik7XG5cdFx0XHRcdF9zZXRHcmlkVGFibGVWaXN1YWxpemF0aW9uSW5mb3JtYXRpb24oc2VjdGlvbnMsIGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbiwgc3ViU2VjdGlvblZpc3VhbGl6YXRpb24sIHNlY3Rpb25MYXlvdXQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJNaXhlZFwiOlxuXHRcdFx0XHRfc2V0R3JpZFRhYmxlV2l0aE1peEZhY2V0c0luZm9ybWF0aW9uKGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGFuZCBtZXJnZXMgdGhlIE9iamVjdFBhZ2Ugc2VjdGlvbnMgZGVmaW5lZCBpbiB0aGUgYW5ub3RhdGlvbiBhbmQgaW4gdGhlIG1hbmlmZXN0LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgQW4gYXJyYXkgb2Ygc2VjdGlvbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRTZWN0aW9ucyA9IGZ1bmN0aW9uIChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZVNlY3Rpb25bXSB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IHNlY3Rpb25zID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0Z2V0U2VjdGlvbnNGcm9tQW5ub3RhdGlvbihjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRnZXRTZWN0aW9uc0Zyb21NYW5pZmVzdChtYW5pZmVzdFdyYXBwZXIuZ2V0U2VjdGlvbnMoKSwgY29udmVydGVyQ29udGV4dCksXG5cdFx0e1xuXHRcdFx0XCJ0aXRsZVwiOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdFx0XCJ2aXNpYmxlXCI6IFwib3ZlcndyaXRlXCIsXG5cdFx0XHRcInN1YlNlY3Rpb25zXCI6IHtcblx0XHRcdFx0XCJhY3Rpb25zXCI6IFwibWVyZ2VcIixcblx0XHRcdFx0XCJ0aXRsZVwiOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdFx0XHRcInNpZGVDb250ZW50XCI6IFwib3ZlcndyaXRlXCJcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cdC8vIExldmVsIEFkanVzdG1lbnQgZm9yIFwiTWl4ZWRcIiBDb2xsZWN0aW9uIEZhY2V0czpcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBUaGUgbWFuaWZlc3QgZGVmaW5pdGlvbiBvZiBjdXN0b20gc2lkZSBjb250ZW50cyBhbmQgYWN0aW9ucyBzdGlsbCBuZWVkcyB0byBiZSBhbGlnbmVkIGZvciBcIk1peGVkXCIgY29sbGVjdGlvbiBmYWNldHM6XG5cdC8vIENvbGxlY3Rpb24gZmFjZXRzIGNvbnRhaW5pbmcgdGFibGVzIGdhaW4gYW4gZXh0cmEgcmVmZXJlbmNlIGZhY2V0IGFzIGEgdGFibGUgd3JhcHBlciB0byBlbnN1cmUsIHRoYXQgdGhlIHRhYmxlIGlzIGFsd2F5c1xuXHQvLyBwbGFjZWQgaW4gYW4gb3duIGluZGl2aWR1YWwgT2JqZWN0IFBhZ2UgQmxvY2s7IHRoaXMgYWRkaXRpb25hbCBoaWVyYXJjaHkgbGV2ZWwgaXMgdW5rbm93biB0byBhcHAgZGV2ZWxvcGVycywgd2hpY2ggYXJlXG5cdC8vIGRlZmluaW5nIHRoZSBzaWRlIGNvbnRlbnQgYW5kIGFjdGlvbnMgaW4gdGhlIG1hbmlmZXN0IGF0IGNvbGxlY3Rpb24gZmFjZXQgbGV2ZWw7IG5vdywgc2luY2UgdGhlIHNpZGVDb250ZW50IGFsd2F5cyBuZWVkc1xuXHQvLyB0byBiZSBhc3NpZ25lZCB0byBhIGJsb2NrLCBhbmQgYWN0aW9ucyBhbHdheXMgbmVlZCB0byBiZSBhc3NpZ25lZCB0byBhIGZvcm0sXG5cdC8vIHdlIG5lZWQgdG8gbW92ZSB0aGUgc2lkZUNvbnRlbnQgYW5kIGFjdGlvbnMgZnJvbSBhIG1peGVkIGNvbGxlY3Rpb24gZmFjZXQgdG8gaXRzIGNvbnRlbnQuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0c2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoc2VjdGlvbikge1xuXHRcdF9zZXRHcmlkVGFibGVTdWJTZWN0aW9uQ29udHJvbENvbmZpZ3VyYXRpb24oc2VjdGlvbnMsIHNlY3Rpb24sIG1hbmlmZXN0V3JhcHBlci5nZXRTZWN0aW9uTGF5b3V0KCkpO1xuXHRcdHNlY3Rpb24uc3ViU2VjdGlvbnM/LmZvckVhY2goZnVuY3Rpb24gKHN1YlNlY3Rpb24pIHtcblx0XHRcdHN1YlNlY3Rpb24udGl0bGUgPSBzdWJTZWN0aW9uLnRpdGxlID09PSBcInVuZGVmaW5lZFwiID8gdW5kZWZpbmVkIDogc3ViU2VjdGlvbi50aXRsZTtcblx0XHRcdGlmIChzdWJTZWN0aW9uLnR5cGUgPT09IFwiTWl4ZWRcIiAmJiBzdWJTZWN0aW9uLmNvbnRlbnQ/Lmxlbmd0aCkge1xuXHRcdFx0XHRjb25zdCBmaXJzdEZvcm0gPSBzdWJTZWN0aW9uLmNvbnRlbnQuZmluZChcblx0XHRcdFx0XHQoZWxlbWVudCkgPT4gKGVsZW1lbnQgYXMgRm9ybVN1YlNlY3Rpb24pLnR5cGUgPT09IFN1YlNlY3Rpb25UeXBlLkZvcm1cblx0XHRcdFx0KSBhcyBGb3JtU3ViU2VjdGlvbjtcblxuXHRcdFx0XHQvLyAxLiBDb3B5IHNpZGVDb250ZW50IHRvIHRoZSBTdWJTZWN0aW9uJ3MgZmlyc3QgZm9ybTsgb3IgLS0gaWYgdW5hdmFpbGFibGUgLS0gdG8gaXRzIGZpcnN0IGNvbnRlbnRcblx0XHRcdFx0Ly8gMi4gQ29weSBhY3Rpb25zIHRvIHRoZSBmaXJzdCBmb3JtIG9mIHRoZSBTdWJTZWN0aW9uJ3MgY29udGVudFxuXHRcdFx0XHQvLyAzLiBEZWxldGUgc2lkZUNvbnRlbnQgLyBhY3Rpb25zIGF0IHRoZSAoaW52YWxpZCkgbWFuaWZlc3QgbGV2ZWxcblxuXHRcdFx0XHRpZiAoc3ViU2VjdGlvbi5zaWRlQ29udGVudCkge1xuXHRcdFx0XHRcdGlmIChmaXJzdEZvcm0pIHtcblx0XHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIGEgZm9ybSwgaXQgYWx3YXlzIG5lZWRzIHRvIGJlIGF0dGFjaGVkIHRvIHRoZSBmb3JtLCBhcyB0aGUgZm9ybSBpbmhlcml0cyB0aGUgSUQgb2YgdGhlIFN1YlNlY3Rpb25cblx0XHRcdFx0XHRcdGZpcnN0Rm9ybS5zaWRlQ29udGVudCA9IHN1YlNlY3Rpb24uc2lkZUNvbnRlbnQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN1YlNlY3Rpb24uY29udGVudFswXS5zaWRlQ29udGVudCA9IHN1YlNlY3Rpb24uc2lkZUNvbnRlbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN1YlNlY3Rpb24uc2lkZUNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZmlyc3RGb3JtICYmIChzdWJTZWN0aW9uIGFzIEZvcm1TdWJTZWN0aW9uKS5hY3Rpb25zPy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmaXJzdEZvcm0uYWN0aW9ucyA9IChzdWJTZWN0aW9uIGFzIEZvcm1TdWJTZWN0aW9uKS5hY3Rpb25zO1xuXHRcdFx0XHRcdChzdWJTZWN0aW9uIGFzIEZvcm1TdWJTZWN0aW9uKS5hY3Rpb25zID0gW107XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiBzZWN0aW9ucztcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgT2JqZWN0UGFnZSBoYXMgaGVhZGVyIGNvbnRlbnQuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uIGhlYWRlciBmYWNldFxuICovXG5mdW5jdGlvbiBoYXNIZWFkZXJDb250ZW50KGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBib29sZWFuIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0cmV0dXJuIChcblx0XHQoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJGYWNldHMgfHwgW10pLmxlbmd0aCA+IDAgfHxcblx0XHRPYmplY3Qua2V5cyhtYW5pZmVzdFdyYXBwZXIuZ2V0SGVhZGVyRmFjZXRzKCkpLmxlbmd0aCA+IDBcblx0KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBoZWFkZXIgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgRGVsZXRlIGJ1dHRvblxuICovXG5mdW5jdGlvbiBnZXRTaG93SGVhZGVyQ29udGVudEV4cHJlc3Npb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+IHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0cmV0dXJuIGlmRWxzZShcblx0XHQhaGFzSGVhZGVyQ29udGVudChjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRjb25zdGFudChmYWxzZSksXG5cdFx0aWZFbHNlKGVxdWFsKG1hbmlmZXN0V3JhcHBlci5pc0hlYWRlckVkaXRhYmxlKCksIGZhbHNlKSwgY29uc3RhbnQodHJ1ZSksIG5vdChVSS5Jc0VkaXRhYmxlKSlcblx0KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGhlYWRlciBjb250ZW50LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBEZWxldGUgYnV0dG9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRTaG93SGVhZGVyQ29udGVudCA9IGZ1bmN0aW9uIChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24ge1xuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oZ2V0U2hvd0hlYWRlckNvbnRlbnRFeHByZXNzaW9uKGNvbnZlcnRlckNvbnRleHQpKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGV2YWx1YXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBhdmF0YXIgd2hlbiB0aGUgaGVhZGVyIGlzIGluIGV4cGFuZGVkIHN0YXRlLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBEZWxldGUgYnV0dG9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFeHBhbmRlZEltYWdlVmlzaWJsZSA9IGZ1bmN0aW9uIChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24ge1xuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24obm90KGdldFNob3dIZWFkZXJDb250ZW50RXhwcmVzc2lvbihjb252ZXJ0ZXJDb250ZXh0KSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRQYWdlID0gZnVuY3Rpb24gKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlRGVmaW5pdGlvbiB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGxldCBoZWFkZXJTZWN0aW9uOiBPYmplY3RQYWdlU2VjdGlvbiB8IHVuZGVmaW5lZDtcblx0Y29uc3QgZW50aXR5VHlwZTogRW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXG5cdC8vIFJldHJpZXZlIGFsbCBoZWFkZXIgZmFjZXRzIChmcm9tIGFubm90YXRpb25zICYgY3VzdG9tKVxuXHRjb25zdCBoZWFkZXJGYWNldHMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRnZXRIZWFkZXJGYWNldHNGcm9tQW5ub3RhdGlvbnMoY29udmVydGVyQ29udGV4dCksXG5cdFx0Z2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0KG1hbmlmZXN0V3JhcHBlci5nZXRIZWFkZXJGYWNldHMoKSlcblx0KTtcblxuXHQvLyBSZXRyaWV2ZSB0aGUgcGFnZSBoZWFkZXIgYWN0aW9uc1xuXHRjb25zdCBoZWFkZXJBY3Rpb25zID0gZ2V0SGVhZGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHQvLyBSZXRyaWV2ZSB0aGUgcGFnZSBmb290ZXIgYWN0aW9uc1xuXHRjb25zdCBmb290ZXJBY3Rpb25zID0gZ2V0Rm9vdGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRpZiAobWFuaWZlc3RXcmFwcGVyLmlzSGVhZGVyRWRpdGFibGUoKSAmJiAoZW50aXR5VHlwZS5hbm5vdGF0aW9ucy5VST8uSGVhZGVyRmFjZXRzIHx8IGVudGl0eVR5cGUuYW5ub3RhdGlvbnMuVUk/LkhlYWRlckluZm8pKSB7XG5cdFx0aGVhZGVyU2VjdGlvbiA9IGNyZWF0ZUVkaXRhYmxlSGVhZGVyU2VjdGlvbihjb252ZXJ0ZXJDb250ZXh0LCBoZWFkZXJGYWNldHMpO1xuXHR9XG5cblx0Y29uc3Qgc2VjdGlvbnMgPSBnZXRTZWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRjb25zdCBwcmltYXJ5QWN0aW9uID0gZ2V0UHJpbWFyeUFjdGlvbihjb252ZXJ0ZXJDb250ZXh0LCBoZWFkZXJBY3Rpb25zLmFjdGlvbnMsIGZvb3RlckFjdGlvbnMuYWN0aW9ucyk7XG5cblx0cmV0dXJuIHtcblx0XHR0ZW1wbGF0ZTogVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UsXG5cdFx0aGVhZGVyOiB7XG5cdFx0XHR2aXNpYmxlOiBtYW5pZmVzdFdyYXBwZXIuZ2V0U2hvd09iamVjdFBhZ2VIZWFkZXIoKSxcblx0XHRcdHNlY3Rpb246IGhlYWRlclNlY3Rpb24sXG5cdFx0XHRmYWNldHM6IGhlYWRlckZhY2V0cyxcblx0XHRcdGFjdGlvbnM6IGhlYWRlckFjdGlvbnMuYWN0aW9ucyxcblx0XHRcdHNob3dDb250ZW50OiBnZXRTaG93SGVhZGVyQ29udGVudChjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdGhhc0NvbnRlbnQ6IGhhc0hlYWRlckNvbnRlbnQoY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRhdmF0YXI6IGdldEF2YXRhcihjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdGV4cGFuZGVkSW1hZ2VWaXNpYmxlOiBnZXRFeHBhbmRlZEltYWdlVmlzaWJsZShjb252ZXJ0ZXJDb250ZXh0KVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c2VjdGlvbnM6IHNlY3Rpb25zLFxuXHRcdGZvb3RlckFjdGlvbnM6IGZvb3RlckFjdGlvbnMuYWN0aW9ucyxcblx0XHRoZWFkZXJDb21tYW5kQWN0aW9uczogaGVhZGVyQWN0aW9ucy5jb21tYW5kQWN0aW9ucyxcblx0XHRmb290ZXJDb21tYW5kQWN0aW9uczogZm9vdGVyQWN0aW9ucy5jb21tYW5kQWN0aW9ucyxcblx0XHRzaG93QW5jaG9yQmFyOiBtYW5pZmVzdFdyYXBwZXIuZ2V0U2hvd0FuY2hvckJhcigpLFxuXHRcdHVzZUljb25UYWJCYXI6IG1hbmlmZXN0V3JhcHBlci51c2VJY29uVGFiQmFyKCksXG5cdFx0cHJpbWFyeUFjdGlvbjogcHJpbWFyeUFjdGlvblxuXHR9O1xufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlFQSxJQUFNQSxhQUFhLEdBQUcsVUFBQ0MsZUFB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