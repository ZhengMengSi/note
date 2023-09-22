/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/TableFormatter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/templating/DataModelPathHelper", "../../../helpers/BindingHelper", "../../../ManifestSettings"], function (tableFormatters, BindingToolkit, ModelHelper, DataModelPathHelper, BindingHelper, ManifestSettings) {
  "use strict";

  var _exports = {};
  var TemplateType = ManifestSettings.TemplateType;
  var CreationMode = ManifestSettings.CreationMode;
  var UI = BindingHelper.UI;
  var singletonPathVisitor = BindingHelper.singletonPathVisitor;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var isPathInsertable = DataModelPathHelper.isPathInsertable;
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var notEqual = BindingToolkit.notEqual;
  var not = BindingToolkit.not;
  var length = BindingToolkit.length;
  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var isConstant = BindingToolkit.isConstant;
  var ifElse = BindingToolkit.ifElse;
  var greaterThan = BindingToolkit.greaterThan;
  var greaterOrEqual = BindingToolkit.greaterOrEqual;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;

  var AnnotationHiddenProperty;

  (function (AnnotationHiddenProperty) {
    AnnotationHiddenProperty["CreateHidden"] = "CreateHidden";
    AnnotationHiddenProperty["DeleteHidden"] = "DeleteHidden";
    AnnotationHiddenProperty["UpdateHidden"] = "UpdateHidden";
  })(AnnotationHiddenProperty || (AnnotationHiddenProperty = {}));

  /**
   * Generates the context for the standard actions.
   *
   * @param converterContext
   * @param creationMode
   * @param tableManifestConfiguration
   * @param viewConfiguration
   * @returns  The context for table actions
   */
  function generateStandardActionsContext(converterContext, creationMode, tableManifestConfiguration, viewConfiguration) {
    return {
      collectionPath: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      hiddenAnnotation: {
        create: isActionAnnotatedHidden(converterContext, AnnotationHiddenProperty.CreateHidden),
        "delete": isActionAnnotatedHidden(converterContext, AnnotationHiddenProperty.DeleteHidden),
        update: isActionAnnotatedHidden(converterContext, AnnotationHiddenProperty.UpdateHidden)
      },
      creationMode: creationMode,
      isDraftOrStickySupported: isDraftOrStickySupported(converterContext),
      isViewWithMultipleVisualizations: viewConfiguration ? converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration) : false,
      newAction: getNewAction(converterContext),
      tableManifestConfiguration: tableManifestConfiguration,
      restrictions: getRestrictions(converterContext)
    };
  }
  /**
   * Checks if sticky or draft is supported.
   *
   * @param converterContext
   * @returns `true` if it is supported
   */


  _exports.generateStandardActionsContext = generateStandardActionsContext;

  function isDraftOrStickySupported(converterContext) {
    var _dataModelObjectPath$, _dataModelObjectPath$2, _dataModelObjectPath$3;

    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var bIsDraftSupported = ModelHelper.isObjectPathDraftSupported(dataModelObjectPath);
    var bIsStickySessionSupported = (_dataModelObjectPath$ = dataModelObjectPath.startingEntitySet) !== null && _dataModelObjectPath$ !== void 0 && (_dataModelObjectPath$2 = _dataModelObjectPath$.annotations) !== null && _dataModelObjectPath$2 !== void 0 && (_dataModelObjectPath$3 = _dataModelObjectPath$2.Session) !== null && _dataModelObjectPath$3 !== void 0 && _dataModelObjectPath$3.StickySessionSupported ? true : false;
    return bIsDraftSupported || bIsStickySessionSupported;
  }
  /**
   * Gets the configured newAction into annotation.
   *
   * @param converterContext
   * @returns The new action info
   */


  _exports.isDraftOrStickySupported = isDraftOrStickySupported;

  function getNewAction(converterContext) {
    var _annotations, _annotations$Common, _annotations$Common$D, _annotations2, _annotations2$Session, _annotations2$Session2;

    var currentEntitySet = converterContext.getEntitySet();
    var newAction = !ModelHelper.isSingleton(currentEntitySet) ? (currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_annotations = currentEntitySet.annotations) === null || _annotations === void 0 ? void 0 : (_annotations$Common = _annotations.Common) === null || _annotations$Common === void 0 ? void 0 : (_annotations$Common$D = _annotations$Common.DraftRoot) === null || _annotations$Common$D === void 0 ? void 0 : _annotations$Common$D.NewAction) || (currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_annotations2 = currentEntitySet.annotations) === null || _annotations2 === void 0 ? void 0 : (_annotations2$Session = _annotations2.Session) === null || _annotations2$Session === void 0 ? void 0 : (_annotations2$Session2 = _annotations2$Session.StickySessionSupported) === null || _annotations2$Session2 === void 0 ? void 0 : _annotations2$Session2.NewAction) : undefined;
    var newActionName = newAction === null || newAction === void 0 ? void 0 : newAction.toString();

    if (newActionName) {
      var _converterContext$get, _converterContext$get2, _converterContext$get3;

      var availableProperty = converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get = converterContext.getEntityType().actions[newActionName]) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotations) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.Core) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.OperationAvailable;
      availableProperty = availableProperty !== undefined ? availableProperty : true;
      return {
        name: newActionName,
        available: getExpressionFromAnnotation(availableProperty)
      };
    }

    return undefined;
  }
  /**
   * Gets the binding expression for the action visibility configured into annotation.
   *
   * @param converterContext
   * @param sAnnotationTerm
   * @param bWithNavigationPath
   * @returns The binding expression for the action visibility
   */


  _exports.getNewAction = getNewAction;

  function isActionAnnotatedHidden(converterContext, sAnnotationTerm) {
    var _currentEntitySet$ann;

    var bWithNavigationPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var currentEntitySet = converterContext.getEntitySet();
    var dataModelObjectPath = converterContext.getDataModelObjectPath(); // Consider only the last level of navigation. The others are already considered in the element binding of the page.

    var visitedNavigationPaths = dataModelObjectPath.navigationProperties.length > 0 && bWithNavigationPath ? [dataModelObjectPath.navigationProperties[dataModelObjectPath.navigationProperties.length - 1].name] : [];
    var actionAnnotationValue = (currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann = currentEntitySet.annotations.UI) === null || _currentEntitySet$ann === void 0 ? void 0 : _currentEntitySet$ann[sAnnotationTerm]) || false;
    return currentEntitySet ? getExpressionFromAnnotation(actionAnnotationValue, visitedNavigationPaths, undefined, function (path) {
      return singletonPathVisitor(path, converterContext.getConvertedTypes(), visitedNavigationPaths);
    }) : constant(false);
  }
  /**
   * Gets the annotated restrictions for the actions.
   *
   * @param converterContext
   * @returns The restriction information
   */


  _exports.isActionAnnotatedHidden = isActionAnnotatedHidden;

  function getRestrictions(converterContext) {
    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var restrictionsDef = [{
      key: "isInsertable",
      "function": isPathInsertable
    }, {
      key: "isUpdatable",
      "function": isPathUpdatable
    }, {
      key: "isDeletable",
      "function": isPathDeletable
    }];
    var result = {};
    restrictionsDef.forEach(function (def) {
      var defFunction = def["function"];
      result[def.key] = {
        expression: defFunction.apply(null, [dataModelObjectPath, {
          pathVisitor: function (path, navigationPaths) {
            return singletonPathVisitor(path, converterContext.getConvertedTypes(), navigationPaths);
          }
        }]),
        navigationExpression: defFunction.apply(null, [dataModelObjectPath, {
          ignoreTargetCollection: true,
          authorizeUnresolvable: true,
          pathVisitor: function (path, navigationPaths) {
            return singletonPathVisitor(path, converterContext.getConvertedTypes(), navigationPaths);
          }
        }])
      };
    });
    return result;
  }
  /**
   * Checks if templating for insert/update actions is mandatory.
   *
   * @param standardActionsContext
   * @param isDraftOrSticky
   * @param isCreateAlwaysHidden
   * @returns The
   */


  _exports.getRestrictions = getRestrictions;

  function getInsertUpdateActionsTemplating(standardActionsContext, isDraftOrSticky, isCreateAlwaysHidden) {
    return (isDraftOrSticky || standardActionsContext.creationMode === CreationMode.External) && !isCreateAlwaysHidden;
  }
  /**
   * Gets the binding expressions for the properties of the action Create.
   *
   * @param converterContext
   * @param standardActionsContext
   * @returns The standard action info
   */


  _exports.getInsertUpdateActionsTemplating = getInsertUpdateActionsTemplating;

  function getStandardActionCreate(converterContext, standardActionsContext) {
    var createVisibility = getCreateVisibility(converterContext, standardActionsContext);
    return {
      isTemplated: compileExpression(getCreateTemplating(standardActionsContext, createVisibility)),
      visible: compileExpression(createVisibility),
      enabled: compileExpression(getCreateEnablement(converterContext, standardActionsContext, createVisibility))
    };
  }
  /**
   * Gets the binding expressions for the properties of the action Delete.
   *
   * @param converterContext
   * @param standardActionsContext
   * @returns The binding expressions for the properties of the action Delete.
   */


  _exports.getStandardActionCreate = getStandardActionCreate;

  function getStandardActionDelete(converterContext, standardActionsContext) {
    var deleteVisibility = getDeleteVisibility(converterContext, standardActionsContext);
    return {
      isTemplated: compileExpression(getDefaultTemplating(deleteVisibility)),
      visible: compileExpression(deleteVisibility),
      enabled: compileExpression(getDeleteEnablement(converterContext, standardActionsContext, deleteVisibility))
    };
  }
  /**
   * @param converterContext
   * @param standardActionsContext
   * @returns StandardActionConfigType
   */


  _exports.getStandardActionDelete = getStandardActionDelete;

  function getCreationRow(converterContext, standardActionsContext) {
    var creationRowVisibility = getCreateVisibility(converterContext, standardActionsContext, true);
    return {
      isTemplated: compileExpression(getCreateTemplating(standardActionsContext, creationRowVisibility, true)),
      visible: compileExpression(creationRowVisibility),
      enabled: compileExpression(getCreationRowEnablement(converterContext, standardActionsContext, creationRowVisibility))
    };
  }
  /**
   * Gets the binding expressions for the properties of the action Paste.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param isInsertUpdateActionsTemplated
   * @returns The binding expressions for the properties of the action Paste.
   */


  _exports.getCreationRow = getCreationRow;

  function getStandardActionPaste(converterContext, standardActionsContext, isInsertUpdateActionsTemplated) {
    var createVisibility = getCreateVisibility(converterContext, standardActionsContext);
    var createEnablement = getCreateEnablement(converterContext, standardActionsContext, createVisibility);
    var pasteVisibility = getPasteVisibility(converterContext, standardActionsContext, createVisibility, isInsertUpdateActionsTemplated);
    return {
      visible: compileExpression(pasteVisibility),
      enabled: compileExpression(getPasteEnablement(pasteVisibility, createEnablement))
    };
  }
  /**
   * Gets the binding expressions for the properties of the action MassEdit.
   *
   * @param converterContext
   * @param standardActionsContext
   * @returns The binding expressions for the properties of the action MassEdit.
   */


  _exports.getStandardActionPaste = getStandardActionPaste;

  function getStandardActionMassEdit(converterContext, standardActionsContext) {
    var massEditVisibility = getMassEditVisibility(converterContext, standardActionsContext);
    return {
      isTemplated: compileExpression(getDefaultTemplating(massEditVisibility)),
      visible: compileExpression(massEditVisibility),
      enabled: compileExpression(getMassEditEnablement(converterContext, standardActionsContext, massEditVisibility))
    };
  }
  /**
   * Gets the binding expression for the templating of the action Create.
   *
   * @param standardActionsContext
   * @param createVisibility
   * @param isForCreationRow
   * @returns The create binding expression
   */


  _exports.getStandardActionMassEdit = getStandardActionMassEdit;

  function getCreateTemplating(standardActionsContext, createVisibility) {
    var isForCreationRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    //Templating of Create Button is not done:
    // 	 - If Button is never visible(covered the External create button, new Action)
    //	 - or CreationMode is on CreationRow for Create Button
    //	 - or CreationMode is not on CreationRow for CreationRow Button
    return and( //XNOR gate
    or(and(isForCreationRow, standardActionsContext.creationMode === CreationMode.CreationRow), and(!isForCreationRow, standardActionsContext.creationMode !== CreationMode.CreationRow)), or(not(isConstant(createVisibility)), createVisibility));
  }
  /**
   * Gets the binding expression for the templating of the non-Create actions.
   *
   * @param actionVisibility
   * @returns The binding expression for the templating of the non-Create actions.
   */


  _exports.getCreateTemplating = getCreateTemplating;

  function getDefaultTemplating(actionVisibility) {
    return or(not(isConstant(actionVisibility)), actionVisibility);
  }
  /**
   * Gets the binding expression for the property visible of the action Create.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param isForCreationRow
   * @returns The binding expression for the property visible of the action Create.
   */


  _exports.getDefaultTemplating = getDefaultTemplating;

  function getCreateVisibility(converterContext, standardActionsContext) {
    var _standardActionsConte;

    var isForCreationRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isInsertable = standardActionsContext.restrictions.isInsertable.expression;
    var isCreateHidden = isForCreationRow ? isActionAnnotatedHidden(converterContext, AnnotationHiddenProperty.CreateHidden, false) : standardActionsContext.hiddenAnnotation.create;
    var newAction = standardActionsContext.newAction; //Create Button is visible:
    // 	 - If the creation mode is external
    //      - If we're on the list report and create is not hidden
    //		- Otherwise this depends on the value of the the UI.IsEditable
    //	 - Otherwise
    //		- If any of the following conditions is valid then create button isn't visible
    //			- no newAction availables
    //			- It's not insertable and there is not a new action
    //			- create is hidden
    //			- There are multiple visializations
    //			- It's an Analytical List Page
    //			- Uses InlineCreationRows mode and a Resposive table type
    //   - Otherwise
    // 	 	- If we're on the list report ->
    // 	 		- If UI.CreateHidden points to a property path -> provide a negated binding to this path
    // 	 		- Otherwise, create is visible
    // 	 	- Otherwise
    // 	  	 - This depends on the value of the the UI.IsEditable

    return ifElse(standardActionsContext.creationMode === CreationMode.External, and(not(isCreateHidden), or(converterContext.getTemplateType() === TemplateType.ListReport, UI.IsEditable)), ifElse(or(and(isConstant(newAction === null || newAction === void 0 ? void 0 : newAction.available), equal(newAction === null || newAction === void 0 ? void 0 : newAction.available, false)), and(isConstant(isInsertable), equal(isInsertable, false), !newAction), and(isConstant(isCreateHidden), equal(isCreateHidden, true)), and(standardActionsContext.creationMode === CreationMode.InlineCreationRows, ((_standardActionsConte = standardActionsContext.tableManifestConfiguration) === null || _standardActionsConte === void 0 ? void 0 : _standardActionsConte.type) === "ResponsiveTable")), false, ifElse(converterContext.getTemplateType() === TemplateType.ListReport, or(not(isPathInModelExpression(isCreateHidden)), not(isCreateHidden)), and(not(isCreateHidden), UI.IsEditable))));
  }
  /**
   * Gets the binding expression for the property visible of the action Delete.
   *
   * @param converterContext
   * @param standardActionsContext
   * @returns The binding expression for the property visible of the action Delete.
   */


  _exports.getCreateVisibility = getCreateVisibility;

  function getDeleteVisibility(converterContext, standardActionsContext) {
    var isDeleteHidden = standardActionsContext.hiddenAnnotation.delete;
    var pathDeletableExpression = standardActionsContext.restrictions.isDeletable.expression; //Delete Button is visible:
    // 	 Prerequisites:
    //	 - If we're not on multiple visualizations configuration or ALP
    //
    //   - If restrictions on deletable set to false -> not visible
    //   - Otherwise
    //			- If UI.DeleteHidden is true -> not visible
    //			- Otherwise
    // 	 			- If we're on OP -> depending if UI is editable and restrictions on deletable
    //				- Otherwise
    //				 	- If UI.DeleteHidden points to a property path -> provide a negated binding to this path
    //	 	 		 	- Otherwise, delete is visible

    return ifElse(or(standardActionsContext.isViewWithMultipleVisualizations, converterContext.getTemplateType() === TemplateType.AnalyticalListPage), false, ifElse(and(isConstant(pathDeletableExpression), equal(pathDeletableExpression, false)), false, ifElse(and(isConstant(isDeleteHidden), equal(isDeleteHidden, constant(true))), false, ifElse(converterContext.getTemplateType() !== TemplateType.ListReport, and(not(isDeleteHidden), UI.IsEditable), not(and(isPathInModelExpression(isDeleteHidden), isDeleteHidden))))));
  }
  /**
   * Gets the binding expression for the property visible of the action Paste.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param createVisibility
   * @param isInsertUpdateActionsTemplated
   * @returns The binding expression for the property visible of the action Paste.
   */


  _exports.getDeleteVisibility = getDeleteVisibility;

  function getPasteVisibility(converterContext, standardActionsContext, createVisibility, isInsertUpdateActionsTemplated) {
    // If Create is visible, enablePaste is not disabled into manifest and we are on OP/blocks outside Fiori elements templates
    // Then button will be visible according to insertable restrictions and create visibility
    // Otherwise it's not visible
    return and(notEqual(standardActionsContext.tableManifestConfiguration.enablePaste, false), createVisibility, isInsertUpdateActionsTemplated, [TemplateType.ListReport, TemplateType.AnalyticalListPage].indexOf(converterContext.getTemplateType()) === -1, standardActionsContext.restrictions.isInsertable.expression);
  }
  /**
   * Gets the binding expression for the property visible of the action MassEdit.
   *
   * @param converterContext
   * @param standardActionsContext
   * @returns The binding expression for the property visible of the action MassEdit
   */


  _exports.getPasteVisibility = getPasteVisibility;

  function getMassEditVisibility(converterContext, standardActionsContext) {
    var _standardActionsConte2;

    var isUpdateHidden = standardActionsContext.hiddenAnnotation.update,
        pathUpdatableExpression = standardActionsContext.restrictions.isUpdatable.expression,
        bMassEditEnabledInManifest = ((_standardActionsConte2 = standardActionsContext.tableManifestConfiguration) === null || _standardActionsConte2 === void 0 ? void 0 : _standardActionsConte2.enableMassEdit) || false;
    var templateBindingExpression = converterContext.getTemplateType() === TemplateType.ObjectPage ? UI.IsEditable : converterContext.getTemplateType() === TemplateType.ListReport; //MassEdit is visible
    // If
    //		- there is no static restrictions set to false
    //		- and enableMassEdit is not set to false into the manifest
    //		- and the selectionMode is relevant
    //	Then MassEdit is always visible in LR or dynamically visible in OP according to ui>Editable and hiddenAnnotation
    //  Button is hidden for all other cases

    return and(not(and(isConstant(pathUpdatableExpression), equal(pathUpdatableExpression, false))), bMassEditEnabledInManifest, templateBindingExpression, not(isUpdateHidden));
  }
  /**
   * Gets the binding expression for the property enabled of the creationRow.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param creationRowVisibility
   * @returns The binding expression for the property enabled of the creationRow.
   */


  _exports.getMassEditVisibility = getMassEditVisibility;

  function getCreationRowEnablement(converterContext, standardActionsContext, creationRowVisibility) {
    var restrictionsInsertable = isPathInsertable(converterContext.getDataModelObjectPath(), {
      ignoreTargetCollection: true,
      authorizeUnresolvable: true,
      pathVisitor: function (path, navigationPaths) {
        if (path.indexOf("/") === 0) {
          path = singletonPathVisitor(path, converterContext.getConvertedTypes(), navigationPaths);
          return path;
        }

        var navigationProperties = converterContext.getDataModelObjectPath().navigationProperties;

        if (navigationProperties) {
          var partner = navigationProperties[navigationProperties.length - 1].partner;

          if (partner) {
            path = "".concat(partner, "/").concat(path);
          }
        }

        return path;
      }
    });
    var isInsertable = restrictionsInsertable._type === "Unresolvable" ? isPathInsertable(converterContext.getDataModelObjectPath(), {
      pathVisitor: function (path) {
        return singletonPathVisitor(path, converterContext.getConvertedTypes(), []);
      }
    }) : restrictionsInsertable;
    return and(creationRowVisibility, isInsertable, or(!standardActionsContext.tableManifestConfiguration.disableAddRowButtonForEmptyData, formatResult([pathInModel("creationRowFieldValidity", "internal")], tableFormatters.validateCreationRowFields)));
  }
  /**
   * Gets the binding expression for the property enabled of the action Create.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param createVisibility
   * @returns The binding expression for the property enabled of the action Create.
   */


  _exports.getCreationRowEnablement = getCreationRowEnablement;

  function getCreateEnablement(converterContext, standardActionsContext, createVisibility) {
    var _converterContext$res;

    var isInsertable = standardActionsContext.restrictions.isInsertable.expression;
    var CollectionType = (_converterContext$res = converterContext.resolveAbsolutePath(standardActionsContext.collectionPath).target) === null || _converterContext$res === void 0 ? void 0 : _converterContext$res._type;
    return and(createVisibility, or(CollectionType === "EntitySet", and(isInsertable, or(converterContext.getTemplateType() !== TemplateType.ObjectPage, UI.IsEditable))));
  }
  /**
   * Gets the binding expression for the property enabled of the action Delete.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param deleteVisibility
   * @returns The binding expression for the property enabled of the action Delete.
   */


  _exports.getCreateEnablement = getCreateEnablement;

  function getDeleteEnablement(converterContext, standardActionsContext, deleteVisibility) {
    var isDeletable = standardActionsContext.restrictions.isDeletable.expression;
    var isOnlyDynamicOnCurrentEntity = !isConstant(isDeletable) && standardActionsContext.restrictions.isDeletable.navigationExpression._type === "Unresolvable";
    var numberOfSelectedContexts = pathInModel("numberOfSelectedContexts", "internal");
    var numberOfDeletableContexts = pathInModel("deletableContexts", "internal");
    var numberOfUnSavedContexts = pathInModel("unSavedContexts", "internal");
    return and(deleteVisibility, ifElse(or(converterContext.getTemplateType() !== TemplateType.ObjectPage, isOnlyDynamicOnCurrentEntity), and(or(and(notEqual(numberOfDeletableContexts, undefined), greaterThan(length(numberOfDeletableContexts), 0)), and(notEqual(numberOfUnSavedContexts, undefined), greaterThan(length(numberOfUnSavedContexts), 0))), pathInModel("deleteEnabled", "internal")), and(notEqual(numberOfSelectedContexts, 0), isDeletable)));
  }
  /**
   * Gets the binding expression for the property enabled of the action Paste.
   *
   * @param pasteVisibility
   * @param createEnablement
   * @returns The binding expression for the property enabled of the action Paste.
   */


  _exports.getDeleteEnablement = getDeleteEnablement;

  function getPasteEnablement(pasteVisibility, createEnablement) {
    return and(pasteVisibility, createEnablement);
  }
  /**
   * Gets the binding expression for the property enabled of the action MassEdit.
   *
   * @param converterContext
   * @param standardActionsContext
   * @param massEditVisibility
   * @returns The binding expression for the property enabled of the action MassEdit.
   */


  _exports.getPasteEnablement = getPasteEnablement;

  function getMassEditEnablement(converterContext, standardActionsContext, massEditVisibility) {
    var pathUpdatableExpression = standardActionsContext.restrictions.isUpdatable.expression;
    var isOnlyDynamicOnCurrentEntity = !isConstant(pathUpdatableExpression) && standardActionsContext.restrictions.isUpdatable.navigationExpression._type === "Unresolvable";
    var numberOfSelectedContexts = greaterOrEqual(pathInModel("numberOfSelectedContexts", "internal"), 1);
    var numberOfUpdatableContexts = greaterOrEqual(length(pathInModel("updatableContexts", "internal")), 1);
    var bIsDraftSupported = ModelHelper.isObjectPathDraftSupported(converterContext.getDataModelObjectPath());
    var bDisplayMode = isInDisplayMode(converterContext); // numberOfUpdatableContexts needs to be added to the binding in case
    // 1. Update is dependent on current entity property (isOnlyDynamicOnCurrentEntity is true).
    // 2. The table is read only and draft enabled(like LR), in this case only active contexts can be mass edited.
    //    So, update depends on 'IsActiveEntity' value which needs to be checked runtime.

    var runtimeBinding = ifElse(or(and(bDisplayMode, bIsDraftSupported), isOnlyDynamicOnCurrentEntity), and(numberOfSelectedContexts, numberOfUpdatableContexts), and(numberOfSelectedContexts));
    return and(massEditVisibility, ifElse(isOnlyDynamicOnCurrentEntity, runtimeBinding, and(runtimeBinding, pathUpdatableExpression)));
  }
  /**
   * Tells if the table in template is in display mode.
   *
   * @param converterContext
   * @param viewConfiguration
   * @returns `true` if the table is in display mode
   */


  _exports.getMassEditEnablement = getMassEditEnablement;

  function isInDisplayMode(converterContext, viewConfiguration) {
    var templateType = converterContext.getTemplateType();

    if (templateType === TemplateType.ListReport || templateType === TemplateType.AnalyticalListPage || viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration)) {
      return true;
    } // updatable will be handled at the property level


    return false;
  }

  _exports.isInDisplayMode = isInDisplayMode;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBbm5vdGF0aW9uSGlkZGVuUHJvcGVydHkiLCJnZW5lcmF0ZVN0YW5kYXJkQWN0aW9uc0NvbnRleHQiLCJjb252ZXJ0ZXJDb250ZXh0IiwiY3JlYXRpb25Nb2RlIiwidGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24iLCJ2aWV3Q29uZmlndXJhdGlvbiIsImNvbGxlY3Rpb25QYXRoIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJoaWRkZW5Bbm5vdGF0aW9uIiwiY3JlYXRlIiwiaXNBY3Rpb25Bbm5vdGF0ZWRIaWRkZW4iLCJDcmVhdGVIaWRkZW4iLCJEZWxldGVIaWRkZW4iLCJ1cGRhdGUiLCJVcGRhdGVIaWRkZW4iLCJpc0RyYWZ0T3JTdGlja3lTdXBwb3J0ZWQiLCJpc1ZpZXdXaXRoTXVsdGlwbGVWaXN1YWxpemF0aW9ucyIsImdldE1hbmlmZXN0V3JhcHBlciIsImhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMiLCJuZXdBY3Rpb24iLCJnZXROZXdBY3Rpb24iLCJyZXN0cmljdGlvbnMiLCJnZXRSZXN0cmljdGlvbnMiLCJkYXRhTW9kZWxPYmplY3RQYXRoIiwiYklzRHJhZnRTdXBwb3J0ZWQiLCJNb2RlbEhlbHBlciIsImlzT2JqZWN0UGF0aERyYWZ0U3VwcG9ydGVkIiwiYklzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsInN0YXJ0aW5nRW50aXR5U2V0IiwiYW5ub3RhdGlvbnMiLCJTZXNzaW9uIiwiU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsImN1cnJlbnRFbnRpdHlTZXQiLCJnZXRFbnRpdHlTZXQiLCJpc1NpbmdsZXRvbiIsIkNvbW1vbiIsIkRyYWZ0Um9vdCIsIk5ld0FjdGlvbiIsInVuZGVmaW5lZCIsIm5ld0FjdGlvbk5hbWUiLCJ0b1N0cmluZyIsImF2YWlsYWJsZVByb3BlcnR5IiwiZ2V0RW50aXR5VHlwZSIsImFjdGlvbnMiLCJDb3JlIiwiT3BlcmF0aW9uQXZhaWxhYmxlIiwibmFtZSIsImF2YWlsYWJsZSIsImdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbiIsInNBbm5vdGF0aW9uVGVybSIsImJXaXRoTmF2aWdhdGlvblBhdGgiLCJ2aXNpdGVkTmF2aWdhdGlvblBhdGhzIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJsZW5ndGgiLCJhY3Rpb25Bbm5vdGF0aW9uVmFsdWUiLCJVSSIsInBhdGgiLCJzaW5nbGV0b25QYXRoVmlzaXRvciIsImdldENvbnZlcnRlZFR5cGVzIiwiY29uc3RhbnQiLCJyZXN0cmljdGlvbnNEZWYiLCJrZXkiLCJpc1BhdGhJbnNlcnRhYmxlIiwiaXNQYXRoVXBkYXRhYmxlIiwiaXNQYXRoRGVsZXRhYmxlIiwicmVzdWx0IiwiZm9yRWFjaCIsImRlZiIsImRlZkZ1bmN0aW9uIiwiZXhwcmVzc2lvbiIsImFwcGx5IiwicGF0aFZpc2l0b3IiLCJuYXZpZ2F0aW9uUGF0aHMiLCJuYXZpZ2F0aW9uRXhwcmVzc2lvbiIsImlnbm9yZVRhcmdldENvbGxlY3Rpb24iLCJhdXRob3JpemVVbnJlc29sdmFibGUiLCJnZXRJbnNlcnRVcGRhdGVBY3Rpb25zVGVtcGxhdGluZyIsInN0YW5kYXJkQWN0aW9uc0NvbnRleHQiLCJpc0RyYWZ0T3JTdGlja3kiLCJpc0NyZWF0ZUFsd2F5c0hpZGRlbiIsIkNyZWF0aW9uTW9kZSIsIkV4dGVybmFsIiwiZ2V0U3RhbmRhcmRBY3Rpb25DcmVhdGUiLCJjcmVhdGVWaXNpYmlsaXR5IiwiZ2V0Q3JlYXRlVmlzaWJpbGl0eSIsImlzVGVtcGxhdGVkIiwiY29tcGlsZUV4cHJlc3Npb24iLCJnZXRDcmVhdGVUZW1wbGF0aW5nIiwidmlzaWJsZSIsImVuYWJsZWQiLCJnZXRDcmVhdGVFbmFibGVtZW50IiwiZ2V0U3RhbmRhcmRBY3Rpb25EZWxldGUiLCJkZWxldGVWaXNpYmlsaXR5IiwiZ2V0RGVsZXRlVmlzaWJpbGl0eSIsImdldERlZmF1bHRUZW1wbGF0aW5nIiwiZ2V0RGVsZXRlRW5hYmxlbWVudCIsImdldENyZWF0aW9uUm93IiwiY3JlYXRpb25Sb3dWaXNpYmlsaXR5IiwiZ2V0Q3JlYXRpb25Sb3dFbmFibGVtZW50IiwiZ2V0U3RhbmRhcmRBY3Rpb25QYXN0ZSIsImlzSW5zZXJ0VXBkYXRlQWN0aW9uc1RlbXBsYXRlZCIsImNyZWF0ZUVuYWJsZW1lbnQiLCJwYXN0ZVZpc2liaWxpdHkiLCJnZXRQYXN0ZVZpc2liaWxpdHkiLCJnZXRQYXN0ZUVuYWJsZW1lbnQiLCJnZXRTdGFuZGFyZEFjdGlvbk1hc3NFZGl0IiwibWFzc0VkaXRWaXNpYmlsaXR5IiwiZ2V0TWFzc0VkaXRWaXNpYmlsaXR5IiwiZ2V0TWFzc0VkaXRFbmFibGVtZW50IiwiaXNGb3JDcmVhdGlvblJvdyIsImFuZCIsIm9yIiwiQ3JlYXRpb25Sb3ciLCJub3QiLCJpc0NvbnN0YW50IiwiYWN0aW9uVmlzaWJpbGl0eSIsImlzSW5zZXJ0YWJsZSIsImlzQ3JlYXRlSGlkZGVuIiwiaWZFbHNlIiwiZ2V0VGVtcGxhdGVUeXBlIiwiVGVtcGxhdGVUeXBlIiwiTGlzdFJlcG9ydCIsIklzRWRpdGFibGUiLCJlcXVhbCIsIklubGluZUNyZWF0aW9uUm93cyIsInR5cGUiLCJpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbiIsImlzRGVsZXRlSGlkZGVuIiwiZGVsZXRlIiwicGF0aERlbGV0YWJsZUV4cHJlc3Npb24iLCJpc0RlbGV0YWJsZSIsIkFuYWx5dGljYWxMaXN0UGFnZSIsIm5vdEVxdWFsIiwiZW5hYmxlUGFzdGUiLCJpbmRleE9mIiwiaXNVcGRhdGVIaWRkZW4iLCJwYXRoVXBkYXRhYmxlRXhwcmVzc2lvbiIsImlzVXBkYXRhYmxlIiwiYk1hc3NFZGl0RW5hYmxlZEluTWFuaWZlc3QiLCJlbmFibGVNYXNzRWRpdCIsInRlbXBsYXRlQmluZGluZ0V4cHJlc3Npb24iLCJPYmplY3RQYWdlIiwicmVzdHJpY3Rpb25zSW5zZXJ0YWJsZSIsInBhcnRuZXIiLCJfdHlwZSIsImRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEiLCJmb3JtYXRSZXN1bHQiLCJwYXRoSW5Nb2RlbCIsInRhYmxlRm9ybWF0dGVycyIsInZhbGlkYXRlQ3JlYXRpb25Sb3dGaWVsZHMiLCJDb2xsZWN0aW9uVHlwZSIsInJlc29sdmVBYnNvbHV0ZVBhdGgiLCJ0YXJnZXQiLCJpc09ubHlEeW5hbWljT25DdXJyZW50RW50aXR5IiwibnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzIiwibnVtYmVyT2ZEZWxldGFibGVDb250ZXh0cyIsIm51bWJlck9mVW5TYXZlZENvbnRleHRzIiwiZ3JlYXRlclRoYW4iLCJncmVhdGVyT3JFcXVhbCIsIm51bWJlck9mVXBkYXRhYmxlQ29udGV4dHMiLCJiRGlzcGxheU1vZGUiLCJpc0luRGlzcGxheU1vZGUiLCJydW50aW1lQmluZGluZyIsInRlbXBsYXRlVHlwZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU3RhbmRhcmRBY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRW50aXR5U2V0LCBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHRhYmxlRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclwiO1xuaW1wb3J0IHR5cGUgeyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24sIENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7XG5cdGFuZCxcblx0Y29tcGlsZUV4cHJlc3Npb24sXG5cdGNvbnN0YW50LFxuXHRlcXVhbCxcblx0Zm9ybWF0UmVzdWx0LFxuXHRnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24sXG5cdGdyZWF0ZXJPckVxdWFsLFxuXHRncmVhdGVyVGhhbixcblx0aWZFbHNlLFxuXHRpc0NvbnN0YW50LFxuXHRpc1BhdGhJbk1vZGVsRXhwcmVzc2lvbixcblx0bGVuZ3RoLFxuXHRub3QsXG5cdG5vdEVxdWFsLFxuXHRvcixcblx0cGF0aEluTW9kZWxcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IHsgZ2V0VGFyZ2V0T2JqZWN0UGF0aCwgaXNQYXRoRGVsZXRhYmxlLCBpc1BhdGhJbnNlcnRhYmxlLCBpc1BhdGhVcGRhdGFibGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCIuLi8uLi8uLi9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBzaW5nbGV0b25QYXRoVmlzaXRvciwgVUkgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9CaW5kaW5nSGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IFZpZXdQYXRoQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBDcmVhdGlvbk1vZGUsIFRlbXBsYXRlVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgdHlwZSB7IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vVGFibGVcIjtcblxuZW51bSBBbm5vdGF0aW9uSGlkZGVuUHJvcGVydHkge1xuXHRDcmVhdGVIaWRkZW4gPSBcIkNyZWF0ZUhpZGRlblwiLFxuXHREZWxldGVIaWRkZW4gPSBcIkRlbGV0ZUhpZGRlblwiLFxuXHRVcGRhdGVIaWRkZW4gPSBcIlVwZGF0ZUhpZGRlblwiXG59XG5cbmV4cG9ydCB0eXBlIFN0YW5kYXJkQWN0aW9uQ29uZmlnVHlwZSA9IHtcblx0aXNUZW1wbGF0ZWQ/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0dmlzaWJsZTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdGVuYWJsZWQ6IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xufTtcblxudHlwZSBFeHByZXNzaW9uUmVzdHJpY3Rpb25zVHlwZSA9IHtcblx0ZXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRuYXZpZ2F0aW9uRXhwcmVzc2lvbjogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+O1xufTtcbnR5cGUgU3RhbmRhcmRBY3Rpb25zUmVzdHJpY3Rpb25zVHlwZSA9IFJlY29yZDxzdHJpbmcsIEV4cHJlc3Npb25SZXN0cmljdGlvbnNUeXBlPjtcblxuZXhwb3J0IHR5cGUgU3RhbmRhcmRBY3Rpb25zQ29udGV4dCA9IHtcblx0Y29sbGVjdGlvblBhdGg6IHN0cmluZztcblx0aGlkZGVuQW5ub3RhdGlvbjoge1xuXHRcdGNyZWF0ZTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRcdFwiZGVsZXRlXCI6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPjtcblx0XHR1cGRhdGU6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPjtcblx0fTtcblx0Y3JlYXRpb25Nb2RlOiBDcmVhdGlvbk1vZGU7XG5cdGlzRHJhZnRPclN0aWNreVN1cHBvcnRlZDogYm9vbGVhbjtcblx0aXNWaWV3V2l0aE11bHRpcGxlVmlzdWFsaXphdGlvbnM6IGJvb2xlYW47XG5cdG5ld0FjdGlvbj86IHtcblx0XHRuYW1lPzogc3RyaW5nO1xuXHRcdGF2YWlsYWJsZT86IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPjtcblx0fTtcblx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb246IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb247XG5cdHJlc3RyaWN0aW9uczogU3RhbmRhcmRBY3Rpb25zUmVzdHJpY3Rpb25zVHlwZTtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIHRoZSBjb250ZXh0IGZvciB0aGUgc3RhbmRhcmQgYWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGNyZWF0aW9uTW9kZVxuICogQHBhcmFtIHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uXG4gKiBAcGFyYW0gdmlld0NvbmZpZ3VyYXRpb25cbiAqIEByZXR1cm5zICBUaGUgY29udGV4dCBmb3IgdGFibGUgYWN0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTdGFuZGFyZEFjdGlvbnNDb250ZXh0KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRjcmVhdGlvbk1vZGU6IENyZWF0aW9uTW9kZSxcblx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb246IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24sXG5cdHZpZXdDb25maWd1cmF0aW9uPzogVmlld1BhdGhDb25maWd1cmF0aW9uXG4pOiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0IHtcblx0cmV0dXJuIHtcblx0XHRjb2xsZWN0aW9uUGF0aDogZ2V0VGFyZ2V0T2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSksXG5cdFx0aGlkZGVuQW5ub3RhdGlvbjoge1xuXHRcdFx0Y3JlYXRlOiBpc0FjdGlvbkFubm90YXRlZEhpZGRlbihjb252ZXJ0ZXJDb250ZXh0LCBBbm5vdGF0aW9uSGlkZGVuUHJvcGVydHkuQ3JlYXRlSGlkZGVuKSxcblx0XHRcdFwiZGVsZXRlXCI6IGlzQWN0aW9uQW5ub3RhdGVkSGlkZGVuKGNvbnZlcnRlckNvbnRleHQsIEFubm90YXRpb25IaWRkZW5Qcm9wZXJ0eS5EZWxldGVIaWRkZW4pLFxuXHRcdFx0dXBkYXRlOiBpc0FjdGlvbkFubm90YXRlZEhpZGRlbihjb252ZXJ0ZXJDb250ZXh0LCBBbm5vdGF0aW9uSGlkZGVuUHJvcGVydHkuVXBkYXRlSGlkZGVuKVxuXHRcdH0sXG5cdFx0Y3JlYXRpb25Nb2RlOiBjcmVhdGlvbk1vZGUsXG5cdFx0aXNEcmFmdE9yU3RpY2t5U3VwcG9ydGVkOiBpc0RyYWZ0T3JTdGlja3lTdXBwb3J0ZWQoY29udmVydGVyQ29udGV4dCksXG5cdFx0aXNWaWV3V2l0aE11bHRpcGxlVmlzdWFsaXphdGlvbnM6IHZpZXdDb25maWd1cmF0aW9uXG5cdFx0XHQ/IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyh2aWV3Q29uZmlndXJhdGlvbilcblx0XHRcdDogZmFsc2UsXG5cdFx0bmV3QWN0aW9uOiBnZXROZXdBY3Rpb24oY29udmVydGVyQ29udGV4dCksXG5cdFx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb246IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLFxuXHRcdHJlc3RyaWN0aW9uczogZ2V0UmVzdHJpY3Rpb25zKGNvbnZlcnRlckNvbnRleHQpXG5cdH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHN0aWNreSBvciBkcmFmdCBpcyBzdXBwb3J0ZWQuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBpdCBpcyBzdXBwb3J0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRHJhZnRPclN0aWNreVN1cHBvcnRlZChjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogYm9vbGVhbiB7XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgYklzRHJhZnRTdXBwb3J0ZWQgPSBNb2RlbEhlbHBlci5pc09iamVjdFBhdGhEcmFmdFN1cHBvcnRlZChkYXRhTW9kZWxPYmplY3RQYXRoKTtcblx0Y29uc3QgYklzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCA9IChkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0IGFzIEVudGl0eVNldCk/LmFubm90YXRpb25zPy5TZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkXG5cdFx0PyB0cnVlXG5cdFx0OiBmYWxzZTtcblxuXHRyZXR1cm4gYklzRHJhZnRTdXBwb3J0ZWQgfHwgYklzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBjb25maWd1cmVkIG5ld0FjdGlvbiBpbnRvIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBuZXcgYWN0aW9uIGluZm9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0FjdGlvbihjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogYW55IHtcblx0Y29uc3QgY3VycmVudEVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdGNvbnN0IG5ld0FjdGlvbiA9ICFNb2RlbEhlbHBlci5pc1NpbmdsZXRvbihjdXJyZW50RW50aXR5U2V0KVxuXHRcdD8gKGN1cnJlbnRFbnRpdHlTZXQgYXMgRW50aXR5U2V0KT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnRSb290Py5OZXdBY3Rpb24gfHxcblx0XHQgIChjdXJyZW50RW50aXR5U2V0IGFzIEVudGl0eVNldCk/LmFubm90YXRpb25zPy5TZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkPy5OZXdBY3Rpb25cblx0XHQ6IHVuZGVmaW5lZDtcblx0Y29uc3QgbmV3QWN0aW9uTmFtZTogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gPSBuZXdBY3Rpb24/LnRvU3RyaW5nKCk7XG5cdGlmIChuZXdBY3Rpb25OYW1lKSB7XG5cdFx0bGV0IGF2YWlsYWJsZVByb3BlcnR5OiBhbnkgPSBjb252ZXJ0ZXJDb250ZXh0Py5nZXRFbnRpdHlUeXBlKCkuYWN0aW9uc1tuZXdBY3Rpb25OYW1lXT8uYW5ub3RhdGlvbnM/LkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZTtcblx0XHRhdmFpbGFibGVQcm9wZXJ0eSA9IGF2YWlsYWJsZVByb3BlcnR5ICE9PSB1bmRlZmluZWQgPyBhdmFpbGFibGVQcm9wZXJ0eSA6IHRydWU7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6IG5ld0FjdGlvbk5hbWUsXG5cdFx0XHRhdmFpbGFibGU6IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihhdmFpbGFibGVQcm9wZXJ0eSlcblx0XHR9O1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgYWN0aW9uIHZpc2liaWxpdHkgY29uZmlndXJlZCBpbnRvIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBzQW5ub3RhdGlvblRlcm1cbiAqIEBwYXJhbSBiV2l0aE5hdmlnYXRpb25QYXRoXG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgYWN0aW9uIHZpc2liaWxpdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWN0aW9uQW5ub3RhdGVkSGlkZGVuKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzQW5ub3RhdGlvblRlcm06IHN0cmluZyxcblx0YldpdGhOYXZpZ2F0aW9uUGF0aCA9IHRydWVcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGN1cnJlbnRFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdC8vIENvbnNpZGVyIG9ubHkgdGhlIGxhc3QgbGV2ZWwgb2YgbmF2aWdhdGlvbi4gVGhlIG90aGVycyBhcmUgYWxyZWFkeSBjb25zaWRlcmVkIGluIHRoZSBlbGVtZW50IGJpbmRpbmcgb2YgdGhlIHBhZ2UuXG5cdGNvbnN0IHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgPVxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoID4gMCAmJiBiV2l0aE5hdmlnYXRpb25QYXRoXG5cdFx0XHQ/IFtkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzW2RhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoIC0gMV0ubmFtZV1cblx0XHRcdDogW107XG5cdGNvbnN0IGFjdGlvbkFubm90YXRpb25WYWx1ZSA9XG5cdFx0KChjdXJyZW50RW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VSSBhcyBhbnkpPy5bc0Fubm90YXRpb25UZXJtXSBhcyBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxib29sZWFuPikgfHwgZmFsc2U7XG5cblx0cmV0dXJuIGN1cnJlbnRFbnRpdHlTZXRcblx0XHQ/IGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihhY3Rpb25Bbm5vdGF0aW9uVmFsdWUsIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHVuZGVmaW5lZCwgKHBhdGg6IHN0cmluZykgPT5cblx0XHRcdFx0c2luZ2xldG9uUGF0aFZpc2l0b3IocGF0aCwgY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZWRUeXBlcygpLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzKVxuXHRcdCAgKVxuXHRcdDogY29uc3RhbnQoZmFsc2UpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGFubm90YXRlZCByZXN0cmljdGlvbnMgZm9yIHRoZSBhY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgcmVzdHJpY3Rpb24gaW5mb3JtYXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc3RyaWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogU3RhbmRhcmRBY3Rpb25zUmVzdHJpY3Rpb25zVHlwZSB7XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgcmVzdHJpY3Rpb25zRGVmID0gW1xuXHRcdHtcblx0XHRcdGtleTogXCJpc0luc2VydGFibGVcIixcblx0XHRcdFwiZnVuY3Rpb25cIjogaXNQYXRoSW5zZXJ0YWJsZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5OiBcImlzVXBkYXRhYmxlXCIsXG5cdFx0XHRcImZ1bmN0aW9uXCI6IGlzUGF0aFVwZGF0YWJsZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5OiBcImlzRGVsZXRhYmxlXCIsXG5cdFx0XHRcImZ1bmN0aW9uXCI6IGlzUGF0aERlbGV0YWJsZVxuXHRcdH1cblx0XTtcblx0Y29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBFeHByZXNzaW9uUmVzdHJpY3Rpb25zVHlwZT4gPSB7fTtcblx0cmVzdHJpY3Rpb25zRGVmLmZvckVhY2goZnVuY3Rpb24gKGRlZikge1xuXHRcdGNvbnN0IGRlZkZ1bmN0aW9uID0gZGVmW1wiZnVuY3Rpb25cIl07XG5cdFx0cmVzdWx0W2RlZi5rZXldID0ge1xuXHRcdFx0ZXhwcmVzc2lvbjogZGVmRnVuY3Rpb24uYXBwbHkobnVsbCwgW1xuXHRcdFx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cGF0aFZpc2l0b3I6IChwYXRoOiBzdHJpbmcsIG5hdmlnYXRpb25QYXRoczogc3RyaW5nW10pID0+XG5cdFx0XHRcdFx0XHRzaW5nbGV0b25QYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlZFR5cGVzKCksIG5hdmlnYXRpb25QYXRocylcblx0XHRcdFx0fVxuXHRcdFx0XSksXG5cdFx0XHRuYXZpZ2F0aW9uRXhwcmVzc2lvbjogZGVmRnVuY3Rpb24uYXBwbHkobnVsbCwgW1xuXHRcdFx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWdub3JlVGFyZ2V0Q29sbGVjdGlvbjogdHJ1ZSxcblx0XHRcdFx0XHRhdXRob3JpemVVbnJlc29sdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0cGF0aFZpc2l0b3I6IChwYXRoOiBzdHJpbmcsIG5hdmlnYXRpb25QYXRoczogc3RyaW5nW10pID0+XG5cdFx0XHRcdFx0XHRzaW5nbGV0b25QYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlZFR5cGVzKCksIG5hdmlnYXRpb25QYXRocylcblx0XHRcdFx0fVxuXHRcdFx0XSlcblx0XHR9O1xuXHR9KTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGVtcGxhdGluZyBmb3IgaW5zZXJ0L3VwZGF0ZSBhY3Rpb25zIGlzIG1hbmRhdG9yeS5cbiAqXG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHBhcmFtIGlzRHJhZnRPclN0aWNreVxuICogQHBhcmFtIGlzQ3JlYXRlQWx3YXlzSGlkZGVuXG4gKiBAcmV0dXJucyBUaGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluc2VydFVwZGF0ZUFjdGlvbnNUZW1wbGF0aW5nKFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRpc0RyYWZ0T3JTdGlja3k6IGJvb2xlYW4sXG5cdGlzQ3JlYXRlQWx3YXlzSGlkZGVuOiBib29sZWFuXG4pOiBib29sZWFuIHtcblx0cmV0dXJuIChpc0RyYWZ0T3JTdGlja3kgfHwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dC5jcmVhdGlvbk1vZGUgPT09IENyZWF0aW9uTW9kZS5FeHRlcm5hbCkgJiYgIWlzQ3JlYXRlQWx3YXlzSGlkZGVuO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbnMgZm9yIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBhY3Rpb24gQ3JlYXRlLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHJldHVybnMgVGhlIHN0YW5kYXJkIGFjdGlvbiBpbmZvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGFuZGFyZEFjdGlvbkNyZWF0ZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c3RhbmRhcmRBY3Rpb25zQ29udGV4dDogU3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuKTogU3RhbmRhcmRBY3Rpb25Db25maWdUeXBlIHtcblx0Y29uc3QgY3JlYXRlVmlzaWJpbGl0eSA9IGdldENyZWF0ZVZpc2liaWxpdHkoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCk7XG5cdHJldHVybiB7XG5cdFx0aXNUZW1wbGF0ZWQ6IGNvbXBpbGVFeHByZXNzaW9uKGdldENyZWF0ZVRlbXBsYXRpbmcoc3RhbmRhcmRBY3Rpb25zQ29udGV4dCwgY3JlYXRlVmlzaWJpbGl0eSkpLFxuXHRcdHZpc2libGU6IGNvbXBpbGVFeHByZXNzaW9uKGNyZWF0ZVZpc2liaWxpdHkpLFxuXHRcdGVuYWJsZWQ6IGNvbXBpbGVFeHByZXNzaW9uKGdldENyZWF0ZUVuYWJsZW1lbnQoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCwgY3JlYXRlVmlzaWJpbGl0eSkpXG5cdH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9ucyBmb3IgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFjdGlvbiBEZWxldGUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9ucyBmb3IgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFjdGlvbiBEZWxldGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGFuZGFyZEFjdGlvbkRlbGV0ZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c3RhbmRhcmRBY3Rpb25zQ29udGV4dDogU3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuKTogU3RhbmRhcmRBY3Rpb25Db25maWdUeXBlIHtcblx0Y29uc3QgZGVsZXRlVmlzaWJpbGl0eSA9IGdldERlbGV0ZVZpc2liaWxpdHkoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCk7XG5cblx0cmV0dXJuIHtcblx0XHRpc1RlbXBsYXRlZDogY29tcGlsZUV4cHJlc3Npb24oZ2V0RGVmYXVsdFRlbXBsYXRpbmcoZGVsZXRlVmlzaWJpbGl0eSkpLFxuXHRcdHZpc2libGU6IGNvbXBpbGVFeHByZXNzaW9uKGRlbGV0ZVZpc2liaWxpdHkpLFxuXHRcdGVuYWJsZWQ6IGNvbXBpbGVFeHByZXNzaW9uKGdldERlbGV0ZUVuYWJsZW1lbnQoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCwgZGVsZXRlVmlzaWJpbGl0eSkpXG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4gKiBAcmV0dXJucyBTdGFuZGFyZEFjdGlvbkNvbmZpZ1R5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENyZWF0aW9uUm93KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4pOiBTdGFuZGFyZEFjdGlvbkNvbmZpZ1R5cGUge1xuXHRjb25zdCBjcmVhdGlvblJvd1Zpc2liaWxpdHkgPSBnZXRDcmVhdGVWaXNpYmlsaXR5KGNvbnZlcnRlckNvbnRleHQsIHN0YW5kYXJkQWN0aW9uc0NvbnRleHQsIHRydWUpO1xuXG5cdHJldHVybiB7XG5cdFx0aXNUZW1wbGF0ZWQ6IGNvbXBpbGVFeHByZXNzaW9uKGdldENyZWF0ZVRlbXBsYXRpbmcoc3RhbmRhcmRBY3Rpb25zQ29udGV4dCwgY3JlYXRpb25Sb3dWaXNpYmlsaXR5LCB0cnVlKSksXG5cdFx0dmlzaWJsZTogY29tcGlsZUV4cHJlc3Npb24oY3JlYXRpb25Sb3dWaXNpYmlsaXR5KSxcblx0XHRlbmFibGVkOiBjb21waWxlRXhwcmVzc2lvbihnZXRDcmVhdGlvblJvd0VuYWJsZW1lbnQoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCwgY3JlYXRpb25Sb3dWaXNpYmlsaXR5KSlcblx0fTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb25zIGZvciB0aGUgcHJvcGVydGllcyBvZiB0aGUgYWN0aW9uIFBhc3RlLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHBhcmFtIGlzSW5zZXJ0VXBkYXRlQWN0aW9uc1RlbXBsYXRlZFxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbnMgZm9yIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBhY3Rpb24gUGFzdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGFuZGFyZEFjdGlvblBhc3RlKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRpc0luc2VydFVwZGF0ZUFjdGlvbnNUZW1wbGF0ZWQ6IGJvb2xlYW5cbik6IFN0YW5kYXJkQWN0aW9uQ29uZmlnVHlwZSB7XG5cdGNvbnN0IGNyZWF0ZVZpc2liaWxpdHkgPSBnZXRDcmVhdGVWaXNpYmlsaXR5KGNvbnZlcnRlckNvbnRleHQsIHN0YW5kYXJkQWN0aW9uc0NvbnRleHQpO1xuXHRjb25zdCBjcmVhdGVFbmFibGVtZW50ID0gZ2V0Q3JlYXRlRW5hYmxlbWVudChjb252ZXJ0ZXJDb250ZXh0LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0LCBjcmVhdGVWaXNpYmlsaXR5KTtcblx0Y29uc3QgcGFzdGVWaXNpYmlsaXR5ID0gZ2V0UGFzdGVWaXNpYmlsaXR5KGNvbnZlcnRlckNvbnRleHQsIHN0YW5kYXJkQWN0aW9uc0NvbnRleHQsIGNyZWF0ZVZpc2liaWxpdHksIGlzSW5zZXJ0VXBkYXRlQWN0aW9uc1RlbXBsYXRlZCk7XG5cdHJldHVybiB7XG5cdFx0dmlzaWJsZTogY29tcGlsZUV4cHJlc3Npb24ocGFzdGVWaXNpYmlsaXR5KSxcblx0XHRlbmFibGVkOiBjb21waWxlRXhwcmVzc2lvbihnZXRQYXN0ZUVuYWJsZW1lbnQocGFzdGVWaXNpYmlsaXR5LCBjcmVhdGVFbmFibGVtZW50KSlcblx0fTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb25zIGZvciB0aGUgcHJvcGVydGllcyBvZiB0aGUgYWN0aW9uIE1hc3NFZGl0LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbnMgZm9yIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBhY3Rpb24gTWFzc0VkaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGFuZGFyZEFjdGlvbk1hc3NFZGl0KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4pOiBTdGFuZGFyZEFjdGlvbkNvbmZpZ1R5cGUge1xuXHRjb25zdCBtYXNzRWRpdFZpc2liaWxpdHkgPSBnZXRNYXNzRWRpdFZpc2liaWxpdHkoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCk7XG5cblx0cmV0dXJuIHtcblx0XHRpc1RlbXBsYXRlZDogY29tcGlsZUV4cHJlc3Npb24oZ2V0RGVmYXVsdFRlbXBsYXRpbmcobWFzc0VkaXRWaXNpYmlsaXR5KSksXG5cdFx0dmlzaWJsZTogY29tcGlsZUV4cHJlc3Npb24obWFzc0VkaXRWaXNpYmlsaXR5KSxcblx0XHRlbmFibGVkOiBjb21waWxlRXhwcmVzc2lvbihnZXRNYXNzRWRpdEVuYWJsZW1lbnQoY29udmVydGVyQ29udGV4dCwgc3RhbmRhcmRBY3Rpb25zQ29udGV4dCwgbWFzc0VkaXRWaXNpYmlsaXR5KSlcblx0fTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSB0ZW1wbGF0aW5nIG9mIHRoZSBhY3Rpb24gQ3JlYXRlLlxuICpcbiAqIEBwYXJhbSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4gKiBAcGFyYW0gY3JlYXRlVmlzaWJpbGl0eVxuICogQHBhcmFtIGlzRm9yQ3JlYXRpb25Sb3dcbiAqIEByZXR1cm5zIFRoZSBjcmVhdGUgYmluZGluZyBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcmVhdGVUZW1wbGF0aW5nKFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRjcmVhdGVWaXNpYmlsaXR5OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4sXG5cdGlzRm9yQ3JlYXRpb25Sb3cgPSBmYWxzZVxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Ly9UZW1wbGF0aW5nIG9mIENyZWF0ZSBCdXR0b24gaXMgbm90IGRvbmU6XG5cdC8vIFx0IC0gSWYgQnV0dG9uIGlzIG5ldmVyIHZpc2libGUoY292ZXJlZCB0aGUgRXh0ZXJuYWwgY3JlYXRlIGJ1dHRvbiwgbmV3IEFjdGlvbilcblx0Ly9cdCAtIG9yIENyZWF0aW9uTW9kZSBpcyBvbiBDcmVhdGlvblJvdyBmb3IgQ3JlYXRlIEJ1dHRvblxuXHQvL1x0IC0gb3IgQ3JlYXRpb25Nb2RlIGlzIG5vdCBvbiBDcmVhdGlvblJvdyBmb3IgQ3JlYXRpb25Sb3cgQnV0dG9uXG5cblx0cmV0dXJuIGFuZChcblx0XHQvL1hOT1IgZ2F0ZVxuXHRcdG9yKFxuXHRcdFx0YW5kKGlzRm9yQ3JlYXRpb25Sb3csIHN0YW5kYXJkQWN0aW9uc0NvbnRleHQuY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cpLFxuXHRcdFx0YW5kKCFpc0ZvckNyZWF0aW9uUm93LCBzdGFuZGFyZEFjdGlvbnNDb250ZXh0LmNyZWF0aW9uTW9kZSAhPT0gQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93KVxuXHRcdCksXG5cdFx0b3Iobm90KGlzQ29uc3RhbnQoY3JlYXRlVmlzaWJpbGl0eSkpLCBjcmVhdGVWaXNpYmlsaXR5KVxuXHQpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHRlbXBsYXRpbmcgb2YgdGhlIG5vbi1DcmVhdGUgYWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gYWN0aW9uVmlzaWJpbGl0eVxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHRlbXBsYXRpbmcgb2YgdGhlIG5vbi1DcmVhdGUgYWN0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRUZW1wbGF0aW5nKGFjdGlvblZpc2liaWxpdHk6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBvcihub3QoaXNDb25zdGFudChhY3Rpb25WaXNpYmlsaXR5KSksIGFjdGlvblZpc2liaWxpdHkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IHZpc2libGUgb2YgdGhlIGFjdGlvbiBDcmVhdGUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4gKiBAcGFyYW0gaXNGb3JDcmVhdGlvblJvd1xuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IHZpc2libGUgb2YgdGhlIGFjdGlvbiBDcmVhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcmVhdGVWaXNpYmlsaXR5KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRpc0ZvckNyZWF0aW9uUm93ID0gZmFsc2Vcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGlzSW5zZXJ0YWJsZSA9IHN0YW5kYXJkQWN0aW9uc0NvbnRleHQucmVzdHJpY3Rpb25zLmlzSW5zZXJ0YWJsZS5leHByZXNzaW9uO1xuXHRjb25zdCBpc0NyZWF0ZUhpZGRlbiA9IGlzRm9yQ3JlYXRpb25Sb3dcblx0XHQ/IGlzQWN0aW9uQW5ub3RhdGVkSGlkZGVuKGNvbnZlcnRlckNvbnRleHQsIEFubm90YXRpb25IaWRkZW5Qcm9wZXJ0eS5DcmVhdGVIaWRkZW4sIGZhbHNlKVxuXHRcdDogc3RhbmRhcmRBY3Rpb25zQ29udGV4dC5oaWRkZW5Bbm5vdGF0aW9uLmNyZWF0ZTtcblx0Y29uc3QgbmV3QWN0aW9uID0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dC5uZXdBY3Rpb247XG5cdC8vQ3JlYXRlIEJ1dHRvbiBpcyB2aXNpYmxlOlxuXHQvLyBcdCAtIElmIHRoZSBjcmVhdGlvbiBtb2RlIGlzIGV4dGVybmFsXG5cdC8vICAgICAgLSBJZiB3ZSdyZSBvbiB0aGUgbGlzdCByZXBvcnQgYW5kIGNyZWF0ZSBpcyBub3QgaGlkZGVuXG5cdC8vXHRcdC0gT3RoZXJ3aXNlIHRoaXMgZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2YgdGhlIHRoZSBVSS5Jc0VkaXRhYmxlXG5cdC8vXHQgLSBPdGhlcndpc2Vcblx0Ly9cdFx0LSBJZiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGlzIHZhbGlkIHRoZW4gY3JlYXRlIGJ1dHRvbiBpc24ndCB2aXNpYmxlXG5cdC8vXHRcdFx0LSBubyBuZXdBY3Rpb24gYXZhaWxhYmxlc1xuXHQvL1x0XHRcdC0gSXQncyBub3QgaW5zZXJ0YWJsZSBhbmQgdGhlcmUgaXMgbm90IGEgbmV3IGFjdGlvblxuXHQvL1x0XHRcdC0gY3JlYXRlIGlzIGhpZGRlblxuXHQvL1x0XHRcdC0gVGhlcmUgYXJlIG11bHRpcGxlIHZpc2lhbGl6YXRpb25zXG5cdC8vXHRcdFx0LSBJdCdzIGFuIEFuYWx5dGljYWwgTGlzdCBQYWdlXG5cdC8vXHRcdFx0LSBVc2VzIElubGluZUNyZWF0aW9uUm93cyBtb2RlIGFuZCBhIFJlc3Bvc2l2ZSB0YWJsZSB0eXBlXG5cdC8vICAgLSBPdGhlcndpc2Vcblx0Ly8gXHQgXHQtIElmIHdlJ3JlIG9uIHRoZSBsaXN0IHJlcG9ydCAtPlxuXHQvLyBcdCBcdFx0LSBJZiBVSS5DcmVhdGVIaWRkZW4gcG9pbnRzIHRvIGEgcHJvcGVydHkgcGF0aCAtPiBwcm92aWRlIGEgbmVnYXRlZCBiaW5kaW5nIHRvIHRoaXMgcGF0aFxuXHQvLyBcdCBcdFx0LSBPdGhlcndpc2UsIGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIFx0IFx0LSBPdGhlcndpc2Vcblx0Ly8gXHQgIFx0IC0gVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiB0aGUgdGhlIFVJLklzRWRpdGFibGVcblx0cmV0dXJuIGlmRWxzZShcblx0XHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0LmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLkV4dGVybmFsLFxuXHRcdGFuZChub3QoaXNDcmVhdGVIaWRkZW4pLCBvcihjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCwgVUkuSXNFZGl0YWJsZSkpLFxuXHRcdGlmRWxzZShcblx0XHRcdG9yKFxuXHRcdFx0XHRhbmQoaXNDb25zdGFudChuZXdBY3Rpb24/LmF2YWlsYWJsZSksIGVxdWFsKG5ld0FjdGlvbj8uYXZhaWxhYmxlLCBmYWxzZSkpLFxuXHRcdFx0XHRhbmQoaXNDb25zdGFudChpc0luc2VydGFibGUpLCBlcXVhbChpc0luc2VydGFibGUsIGZhbHNlKSwgIW5ld0FjdGlvbiksXG5cdFx0XHRcdGFuZChpc0NvbnN0YW50KGlzQ3JlYXRlSGlkZGVuKSwgZXF1YWwoaXNDcmVhdGVIaWRkZW4sIHRydWUpKSxcblx0XHRcdFx0YW5kKFxuXHRcdFx0XHRcdHN0YW5kYXJkQWN0aW9uc0NvbnRleHQuY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuSW5saW5lQ3JlYXRpb25Sb3dzLFxuXHRcdFx0XHRcdHN0YW5kYXJkQWN0aW9uc0NvbnRleHQudGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24/LnR5cGUgPT09IFwiUmVzcG9uc2l2ZVRhYmxlXCJcblx0XHRcdFx0KVxuXHRcdFx0KSxcblx0XHRcdGZhbHNlLFxuXHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCxcblx0XHRcdFx0b3Iobm90KGlzUGF0aEluTW9kZWxFeHByZXNzaW9uKGlzQ3JlYXRlSGlkZGVuKSksIG5vdChpc0NyZWF0ZUhpZGRlbikpLFxuXHRcdFx0XHRhbmQobm90KGlzQ3JlYXRlSGlkZGVuKSwgVUkuSXNFZGl0YWJsZSlcblx0XHRcdClcblx0XHQpXG5cdCk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJvcGVydHkgdmlzaWJsZSBvZiB0aGUgYWN0aW9uIERlbGV0ZS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIHN0YW5kYXJkQWN0aW9uc0NvbnRleHRcbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBwcm9wZXJ0eSB2aXNpYmxlIG9mIHRoZSBhY3Rpb24gRGVsZXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVsZXRlVmlzaWJpbGl0eShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c3RhbmRhcmRBY3Rpb25zQ29udGV4dDogU3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgaXNEZWxldGVIaWRkZW4gPSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0LmhpZGRlbkFubm90YXRpb24uZGVsZXRlO1xuXHRjb25zdCBwYXRoRGVsZXRhYmxlRXhwcmVzc2lvbiA9IHN0YW5kYXJkQWN0aW9uc0NvbnRleHQucmVzdHJpY3Rpb25zLmlzRGVsZXRhYmxlLmV4cHJlc3Npb247XG5cblx0Ly9EZWxldGUgQnV0dG9uIGlzIHZpc2libGU6XG5cdC8vIFx0IFByZXJlcXVpc2l0ZXM6XG5cdC8vXHQgLSBJZiB3ZSdyZSBub3Qgb24gbXVsdGlwbGUgdmlzdWFsaXphdGlvbnMgY29uZmlndXJhdGlvbiBvciBBTFBcblx0Ly9cblx0Ly8gICAtIElmIHJlc3RyaWN0aW9ucyBvbiBkZWxldGFibGUgc2V0IHRvIGZhbHNlIC0+IG5vdCB2aXNpYmxlXG5cdC8vICAgLSBPdGhlcndpc2Vcblx0Ly9cdFx0XHQtIElmIFVJLkRlbGV0ZUhpZGRlbiBpcyB0cnVlIC0+IG5vdCB2aXNpYmxlXG5cdC8vXHRcdFx0LSBPdGhlcndpc2Vcblx0Ly8gXHQgXHRcdFx0LSBJZiB3ZSdyZSBvbiBPUCAtPiBkZXBlbmRpbmcgaWYgVUkgaXMgZWRpdGFibGUgYW5kIHJlc3RyaWN0aW9ucyBvbiBkZWxldGFibGVcblx0Ly9cdFx0XHRcdC0gT3RoZXJ3aXNlXG5cdC8vXHRcdFx0XHQgXHQtIElmIFVJLkRlbGV0ZUhpZGRlbiBwb2ludHMgdG8gYSBwcm9wZXJ0eSBwYXRoIC0+IHByb3ZpZGUgYSBuZWdhdGVkIGJpbmRpbmcgdG8gdGhpcyBwYXRoXG5cdC8vXHQgXHQgXHRcdCBcdC0gT3RoZXJ3aXNlLCBkZWxldGUgaXMgdmlzaWJsZVxuXG5cdHJldHVybiBpZkVsc2UoXG5cdFx0b3Ioc3RhbmRhcmRBY3Rpb25zQ29udGV4dC5pc1ZpZXdXaXRoTXVsdGlwbGVWaXN1YWxpemF0aW9ucywgY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSksXG5cdFx0ZmFsc2UsXG5cdFx0aWZFbHNlKFxuXHRcdFx0YW5kKGlzQ29uc3RhbnQocGF0aERlbGV0YWJsZUV4cHJlc3Npb24pLCBlcXVhbChwYXRoRGVsZXRhYmxlRXhwcmVzc2lvbiwgZmFsc2UpKSxcblx0XHRcdGZhbHNlLFxuXHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRhbmQoaXNDb25zdGFudChpc0RlbGV0ZUhpZGRlbiksIGVxdWFsKGlzRGVsZXRlSGlkZGVuLCBjb25zdGFudCh0cnVlKSkpLFxuXHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgIT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0LFxuXHRcdFx0XHRcdGFuZChub3QoaXNEZWxldGVIaWRkZW4pLCBVSS5Jc0VkaXRhYmxlKSxcblx0XHRcdFx0XHRub3QoYW5kKGlzUGF0aEluTW9kZWxFeHByZXNzaW9uKGlzRGVsZXRlSGlkZGVuKSwgaXNEZWxldGVIaWRkZW4pKVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KVxuXHQpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IHZpc2libGUgb2YgdGhlIGFjdGlvbiBQYXN0ZS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIHN0YW5kYXJkQWN0aW9uc0NvbnRleHRcbiAqIEBwYXJhbSBjcmVhdGVWaXNpYmlsaXR5XG4gKiBAcGFyYW0gaXNJbnNlcnRVcGRhdGVBY3Rpb25zVGVtcGxhdGVkXG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJvcGVydHkgdmlzaWJsZSBvZiB0aGUgYWN0aW9uIFBhc3RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFzdGVWaXNpYmlsaXR5KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRjcmVhdGVWaXNpYmlsaXR5OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4sXG5cdGlzSW5zZXJ0VXBkYXRlQWN0aW9uc1RlbXBsYXRlZDogYm9vbGVhblxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Ly8gSWYgQ3JlYXRlIGlzIHZpc2libGUsIGVuYWJsZVBhc3RlIGlzIG5vdCBkaXNhYmxlZCBpbnRvIG1hbmlmZXN0IGFuZCB3ZSBhcmUgb24gT1AvYmxvY2tzIG91dHNpZGUgRmlvcmkgZWxlbWVudHMgdGVtcGxhdGVzXG5cdC8vIFRoZW4gYnV0dG9uIHdpbGwgYmUgdmlzaWJsZSBhY2NvcmRpbmcgdG8gaW5zZXJ0YWJsZSByZXN0cmljdGlvbnMgYW5kIGNyZWF0ZSB2aXNpYmlsaXR5XG5cdC8vIE90aGVyd2lzZSBpdCdzIG5vdCB2aXNpYmxlXG5cdHJldHVybiBhbmQoXG5cdFx0bm90RXF1YWwoc3RhbmRhcmRBY3Rpb25zQ29udGV4dC50YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5lbmFibGVQYXN0ZSwgZmFsc2UpLFxuXHRcdGNyZWF0ZVZpc2liaWxpdHksXG5cdFx0aXNJbnNlcnRVcGRhdGVBY3Rpb25zVGVtcGxhdGVkLFxuXHRcdFtUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCwgVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZV0uaW5kZXhPZihjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpKSA9PT0gLTEsXG5cdFx0c3RhbmRhcmRBY3Rpb25zQ29udGV4dC5yZXN0cmljdGlvbnMuaXNJbnNlcnRhYmxlLmV4cHJlc3Npb25cblx0KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBwcm9wZXJ0eSB2aXNpYmxlIG9mIHRoZSBhY3Rpb24gTWFzc0VkaXQuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJvcGVydHkgdmlzaWJsZSBvZiB0aGUgYWN0aW9uIE1hc3NFZGl0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXNzRWRpdFZpc2liaWxpdHkoXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHN0YW5kYXJkQWN0aW9uc0NvbnRleHQ6IFN0YW5kYXJkQWN0aW9uc0NvbnRleHRcbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGlzVXBkYXRlSGlkZGVuID0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dC5oaWRkZW5Bbm5vdGF0aW9uLnVwZGF0ZSxcblx0XHRwYXRoVXBkYXRhYmxlRXhwcmVzc2lvbiA9IHN0YW5kYXJkQWN0aW9uc0NvbnRleHQucmVzdHJpY3Rpb25zLmlzVXBkYXRhYmxlLmV4cHJlc3Npb24sXG5cdFx0Yk1hc3NFZGl0RW5hYmxlZEluTWFuaWZlc3Q6IGJvb2xlYW4gPSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0LnRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uPy5lbmFibGVNYXNzRWRpdCB8fCBmYWxzZTtcblx0Y29uc3QgdGVtcGxhdGVCaW5kaW5nRXhwcmVzc2lvbiA9XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2Vcblx0XHRcdD8gVUkuSXNFZGl0YWJsZVxuXHRcdFx0OiBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydDtcblx0Ly9NYXNzRWRpdCBpcyB2aXNpYmxlXG5cdC8vIElmXG5cdC8vXHRcdC0gdGhlcmUgaXMgbm8gc3RhdGljIHJlc3RyaWN0aW9ucyBzZXQgdG8gZmFsc2Vcblx0Ly9cdFx0LSBhbmQgZW5hYmxlTWFzc0VkaXQgaXMgbm90IHNldCB0byBmYWxzZSBpbnRvIHRoZSBtYW5pZmVzdFxuXHQvL1x0XHQtIGFuZCB0aGUgc2VsZWN0aW9uTW9kZSBpcyByZWxldmFudFxuXHQvL1x0VGhlbiBNYXNzRWRpdCBpcyBhbHdheXMgdmlzaWJsZSBpbiBMUiBvciBkeW5hbWljYWxseSB2aXNpYmxlIGluIE9QIGFjY29yZGluZyB0byB1aT5FZGl0YWJsZSBhbmQgaGlkZGVuQW5ub3RhdGlvblxuXHQvLyAgQnV0dG9uIGlzIGhpZGRlbiBmb3IgYWxsIG90aGVyIGNhc2VzXG5cdHJldHVybiBhbmQoXG5cdFx0bm90KGFuZChpc0NvbnN0YW50KHBhdGhVcGRhdGFibGVFeHByZXNzaW9uKSwgZXF1YWwocGF0aFVwZGF0YWJsZUV4cHJlc3Npb24sIGZhbHNlKSkpLFxuXHRcdGJNYXNzRWRpdEVuYWJsZWRJbk1hbmlmZXN0LFxuXHRcdHRlbXBsYXRlQmluZGluZ0V4cHJlc3Npb24sXG5cdFx0bm90KGlzVXBkYXRlSGlkZGVuKVxuXHQpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IGVuYWJsZWQgb2YgdGhlIGNyZWF0aW9uUm93LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHBhcmFtIGNyZWF0aW9uUm93VmlzaWJpbGl0eVxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IGVuYWJsZWQgb2YgdGhlIGNyZWF0aW9uUm93LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3JlYXRpb25Sb3dFbmFibGVtZW50KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRjcmVhdGlvblJvd1Zpc2liaWxpdHk6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPlxuKTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgcmVzdHJpY3Rpb25zSW5zZXJ0YWJsZSA9IGlzUGF0aEluc2VydGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIHtcblx0XHRpZ25vcmVUYXJnZXRDb2xsZWN0aW9uOiB0cnVlLFxuXHRcdGF1dGhvcml6ZVVucmVzb2x2YWJsZTogdHJ1ZSxcblx0XHRwYXRoVmlzaXRvcjogKHBhdGg6IHN0cmluZywgbmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSkgPT4ge1xuXHRcdFx0aWYgKHBhdGguaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdFx0cGF0aCA9IHNpbmdsZXRvblBhdGhWaXNpdG9yKHBhdGgsIGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVkVHlwZXMoKSwgbmF2aWdhdGlvblBhdGhzKTtcblx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBuYXZpZ2F0aW9uUHJvcGVydGllcyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLm5hdmlnYXRpb25Qcm9wZXJ0aWVzO1xuXHRcdFx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdGNvbnN0IHBhcnRuZXIgPSBuYXZpZ2F0aW9uUHJvcGVydGllc1tuYXZpZ2F0aW9uUHJvcGVydGllcy5sZW5ndGggLSAxXS5wYXJ0bmVyO1xuXHRcdFx0XHRpZiAocGFydG5lcikge1xuXHRcdFx0XHRcdHBhdGggPSBgJHtwYXJ0bmVyfS8ke3BhdGh9YDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgaXNJbnNlcnRhYmxlID1cblx0XHRyZXN0cmljdGlvbnNJbnNlcnRhYmxlLl90eXBlID09PSBcIlVucmVzb2x2YWJsZVwiXG5cdFx0XHQ/IGlzUGF0aEluc2VydGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIHtcblx0XHRcdFx0XHRwYXRoVmlzaXRvcjogKHBhdGg6IHN0cmluZykgPT4gc2luZ2xldG9uUGF0aFZpc2l0b3IocGF0aCwgY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZWRUeXBlcygpLCBbXSlcblx0XHRcdCAgfSlcblx0XHRcdDogcmVzdHJpY3Rpb25zSW5zZXJ0YWJsZTtcblxuXHRyZXR1cm4gYW5kKFxuXHRcdGNyZWF0aW9uUm93VmlzaWJpbGl0eSxcblx0XHRpc0luc2VydGFibGUsXG5cdFx0b3IoXG5cdFx0XHQhc3RhbmRhcmRBY3Rpb25zQ29udGV4dC50YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5kaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhLFxuXHRcdFx0Zm9ybWF0UmVzdWx0KFtwYXRoSW5Nb2RlbChcImNyZWF0aW9uUm93RmllbGRWYWxpZGl0eVwiLCBcImludGVybmFsXCIpXSwgdGFibGVGb3JtYXR0ZXJzLnZhbGlkYXRlQ3JlYXRpb25Sb3dGaWVsZHMpXG5cdFx0KVxuXHQpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IGVuYWJsZWQgb2YgdGhlIGFjdGlvbiBDcmVhdGUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBzdGFuZGFyZEFjdGlvbnNDb250ZXh0XG4gKiBAcGFyYW0gY3JlYXRlVmlzaWJpbGl0eVxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IGVuYWJsZWQgb2YgdGhlIGFjdGlvbiBDcmVhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcmVhdGVFbmFibGVtZW50KFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0OiBTdGFuZGFyZEFjdGlvbnNDb250ZXh0LFxuXHRjcmVhdGVWaXNpYmlsaXR5OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGlzSW5zZXJ0YWJsZSA9IHN0YW5kYXJkQWN0aW9uc0NvbnRleHQucmVzdHJpY3Rpb25zLmlzSW5zZXJ0YWJsZS5leHByZXNzaW9uO1xuXHRjb25zdCBDb2xsZWN0aW9uVHlwZSA9IGNvbnZlcnRlckNvbnRleHQucmVzb2x2ZUFic29sdXRlUGF0aDxhbnk+KHN0YW5kYXJkQWN0aW9uc0NvbnRleHQuY29sbGVjdGlvblBhdGgpLnRhcmdldD8uX3R5cGU7XG5cdHJldHVybiBhbmQoXG5cdFx0Y3JlYXRlVmlzaWJpbGl0eSxcblx0XHRvcihcblx0XHRcdENvbGxlY3Rpb25UeXBlID09PSBcIkVudGl0eVNldFwiLFxuXHRcdFx0YW5kKGlzSW5zZXJ0YWJsZSwgb3IoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UsIFVJLklzRWRpdGFibGUpKVxuXHRcdClcblx0KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBwcm9wZXJ0eSBlbmFibGVkIG9mIHRoZSBhY3Rpb24gRGVsZXRlLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHBhcmFtIGRlbGV0ZVZpc2liaWxpdHlcbiAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBwcm9wZXJ0eSBlbmFibGVkIG9mIHRoZSBhY3Rpb24gRGVsZXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVsZXRlRW5hYmxlbWVudChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c3RhbmRhcmRBY3Rpb25zQ29udGV4dDogU3RhbmRhcmRBY3Rpb25zQ29udGV4dCxcblx0ZGVsZXRlVmlzaWJpbGl0eTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+XG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBpc0RlbGV0YWJsZSA9IHN0YW5kYXJkQWN0aW9uc0NvbnRleHQucmVzdHJpY3Rpb25zLmlzRGVsZXRhYmxlLmV4cHJlc3Npb247XG5cdGNvbnN0IGlzT25seUR5bmFtaWNPbkN1cnJlbnRFbnRpdHkgPVxuXHRcdCFpc0NvbnN0YW50KGlzRGVsZXRhYmxlKSAmJiBzdGFuZGFyZEFjdGlvbnNDb250ZXh0LnJlc3RyaWN0aW9ucy5pc0RlbGV0YWJsZS5uYXZpZ2F0aW9uRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJVbnJlc29sdmFibGVcIjtcblx0Y29uc3QgbnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzID0gcGF0aEluTW9kZWwoXCJudW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcIiwgXCJpbnRlcm5hbFwiKTtcblx0Y29uc3QgbnVtYmVyT2ZEZWxldGFibGVDb250ZXh0cyA9IHBhdGhJbk1vZGVsKFwiZGVsZXRhYmxlQ29udGV4dHNcIiwgXCJpbnRlcm5hbFwiKTtcblx0Y29uc3QgbnVtYmVyT2ZVblNhdmVkQ29udGV4dHMgPSBwYXRoSW5Nb2RlbChcInVuU2F2ZWRDb250ZXh0c1wiLCBcImludGVybmFsXCIpO1xuXG5cdHJldHVybiBhbmQoXG5cdFx0ZGVsZXRlVmlzaWJpbGl0eSxcblx0XHRpZkVsc2UoXG5cdFx0XHRvcihjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpICE9PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSwgaXNPbmx5RHluYW1pY09uQ3VycmVudEVudGl0eSksXG5cdFx0XHRhbmQoXG5cdFx0XHRcdG9yKFxuXHRcdFx0XHRcdGFuZChub3RFcXVhbChudW1iZXJPZkRlbGV0YWJsZUNvbnRleHRzLCB1bmRlZmluZWQpLCBncmVhdGVyVGhhbihsZW5ndGgobnVtYmVyT2ZEZWxldGFibGVDb250ZXh0cyksIDApKSxcblx0XHRcdFx0XHRhbmQobm90RXF1YWwobnVtYmVyT2ZVblNhdmVkQ29udGV4dHMsIHVuZGVmaW5lZCksIGdyZWF0ZXJUaGFuKGxlbmd0aChudW1iZXJPZlVuU2F2ZWRDb250ZXh0cyksIDApKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRwYXRoSW5Nb2RlbChcImRlbGV0ZUVuYWJsZWRcIiwgXCJpbnRlcm5hbFwiKVxuXHRcdFx0KSxcblx0XHRcdGFuZChub3RFcXVhbChudW1iZXJPZlNlbGVjdGVkQ29udGV4dHMsIDApLCBpc0RlbGV0YWJsZSlcblx0XHQpXG5cdCk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJvcGVydHkgZW5hYmxlZCBvZiB0aGUgYWN0aW9uIFBhc3RlLlxuICpcbiAqIEBwYXJhbSBwYXN0ZVZpc2liaWxpdHlcbiAqIEBwYXJhbSBjcmVhdGVFbmFibGVtZW50XG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJvcGVydHkgZW5hYmxlZCBvZiB0aGUgYWN0aW9uIFBhc3RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFzdGVFbmFibGVtZW50KFxuXHRwYXN0ZVZpc2liaWxpdHk6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPixcblx0Y3JlYXRlRW5hYmxlbWVudDogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPGJvb2xlYW4+XG4pOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gYW5kKHBhc3RlVmlzaWJpbGl0eSwgY3JlYXRlRW5hYmxlbWVudCk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJvcGVydHkgZW5hYmxlZCBvZiB0aGUgYWN0aW9uIE1hc3NFZGl0LlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dFxuICogQHBhcmFtIG1hc3NFZGl0VmlzaWJpbGl0eVxuICogQHJldHVybnMgVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIHByb3BlcnR5IGVuYWJsZWQgb2YgdGhlIGFjdGlvbiBNYXNzRWRpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hc3NFZGl0RW5hYmxlbWVudChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c3RhbmRhcmRBY3Rpb25zQ29udGV4dDogU3RhbmRhcmRBY3Rpb25zQ29udGV4dCxcblx0bWFzc0VkaXRWaXNpYmlsaXR5OiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248Ym9vbGVhbj5cbik6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IHBhdGhVcGRhdGFibGVFeHByZXNzaW9uID0gc3RhbmRhcmRBY3Rpb25zQ29udGV4dC5yZXN0cmljdGlvbnMuaXNVcGRhdGFibGUuZXhwcmVzc2lvbjtcblx0Y29uc3QgaXNPbmx5RHluYW1pY09uQ3VycmVudEVudGl0eTogYW55ID1cblx0XHQhaXNDb25zdGFudChwYXRoVXBkYXRhYmxlRXhwcmVzc2lvbikgJiZcblx0XHRzdGFuZGFyZEFjdGlvbnNDb250ZXh0LnJlc3RyaWN0aW9ucy5pc1VwZGF0YWJsZS5uYXZpZ2F0aW9uRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJVbnJlc29sdmFibGVcIjtcblx0Y29uc3QgbnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzID0gZ3JlYXRlck9yRXF1YWwocGF0aEluTW9kZWwoXCJudW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcIiwgXCJpbnRlcm5hbFwiKSwgMSk7XG5cdGNvbnN0IG51bWJlck9mVXBkYXRhYmxlQ29udGV4dHMgPSBncmVhdGVyT3JFcXVhbChsZW5ndGgocGF0aEluTW9kZWwoXCJ1cGRhdGFibGVDb250ZXh0c1wiLCBcImludGVybmFsXCIpKSwgMSk7XG5cdGNvbnN0IGJJc0RyYWZ0U3VwcG9ydGVkID0gTW9kZWxIZWxwZXIuaXNPYmplY3RQYXRoRHJhZnRTdXBwb3J0ZWQoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHRjb25zdCBiRGlzcGxheU1vZGUgPSBpc0luRGlzcGxheU1vZGUoY29udmVydGVyQ29udGV4dCk7XG5cblx0Ly8gbnVtYmVyT2ZVcGRhdGFibGVDb250ZXh0cyBuZWVkcyB0byBiZSBhZGRlZCB0byB0aGUgYmluZGluZyBpbiBjYXNlXG5cdC8vIDEuIFVwZGF0ZSBpcyBkZXBlbmRlbnQgb24gY3VycmVudCBlbnRpdHkgcHJvcGVydHkgKGlzT25seUR5bmFtaWNPbkN1cnJlbnRFbnRpdHkgaXMgdHJ1ZSkuXG5cdC8vIDIuIFRoZSB0YWJsZSBpcyByZWFkIG9ubHkgYW5kIGRyYWZ0IGVuYWJsZWQobGlrZSBMUiksIGluIHRoaXMgY2FzZSBvbmx5IGFjdGl2ZSBjb250ZXh0cyBjYW4gYmUgbWFzcyBlZGl0ZWQuXG5cdC8vICAgIFNvLCB1cGRhdGUgZGVwZW5kcyBvbiAnSXNBY3RpdmVFbnRpdHknIHZhbHVlIHdoaWNoIG5lZWRzIHRvIGJlIGNoZWNrZWQgcnVudGltZS5cblx0Y29uc3QgcnVudGltZUJpbmRpbmcgPSBpZkVsc2UoXG5cdFx0b3IoYW5kKGJEaXNwbGF5TW9kZSwgYklzRHJhZnRTdXBwb3J0ZWQpLCBpc09ubHlEeW5hbWljT25DdXJyZW50RW50aXR5KSxcblx0XHRhbmQobnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzLCBudW1iZXJPZlVwZGF0YWJsZUNvbnRleHRzKSxcblx0XHRhbmQobnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzKVxuXHQpO1xuXG5cdHJldHVybiBhbmQobWFzc0VkaXRWaXNpYmlsaXR5LCBpZkVsc2UoaXNPbmx5RHluYW1pY09uQ3VycmVudEVudGl0eSwgcnVudGltZUJpbmRpbmcsIGFuZChydW50aW1lQmluZGluZywgcGF0aFVwZGF0YWJsZUV4cHJlc3Npb24pKSk7XG59XG5cbi8qKlxuICogVGVsbHMgaWYgdGhlIHRhYmxlIGluIHRlbXBsYXRlIGlzIGluIGRpc3BsYXkgbW9kZS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIHZpZXdDb25maWd1cmF0aW9uXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHRhYmxlIGlzIGluIGRpc3BsYXkgbW9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbkRpc3BsYXlNb2RlKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsIHZpZXdDb25maWd1cmF0aW9uPzogVmlld1BhdGhDb25maWd1cmF0aW9uKTogYm9vbGVhbiB7XG5cdGNvbnN0IHRlbXBsYXRlVHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCk7XG5cdGlmIChcblx0XHR0ZW1wbGF0ZVR5cGUgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0IHx8XG5cdFx0dGVtcGxhdGVUeXBlID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlIHx8XG5cdFx0KHZpZXdDb25maWd1cmF0aW9uICYmIGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyh2aWV3Q29uZmlndXJhdGlvbikpXG5cdCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdC8vIHVwZGF0YWJsZSB3aWxsIGJlIGhhbmRsZWQgYXQgdGhlIHByb3BlcnR5IGxldmVsXG5cdHJldHVybiBmYWxzZTtcbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BNkJLQSx3Qjs7YUFBQUEsd0I7SUFBQUEsd0I7SUFBQUEsd0I7SUFBQUEsd0I7S0FBQUEsd0IsS0FB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