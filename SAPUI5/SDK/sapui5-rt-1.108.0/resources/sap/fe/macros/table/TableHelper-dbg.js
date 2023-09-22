/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/converters/controls/Common/DataVisualization", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/formatters/TableFormatter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/library", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/CommonHelper", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/internal/helpers/ActionHelper", "sap/fe/macros/table/TableSizeHelper"], function (Log, DataVisualization, ManifestSettings, MetaModelConverter, TableFormatter, BindingToolkit, StableIdHelper, FELibrary, UIFormatters, CommonHelper, FieldTemplating, ActionHelper, TableSizeHelper) {
  "use strict";

  var formatValueRecursively = FieldTemplating.formatValueRecursively;
  var getEditMode = UIFormatters.getEditMode;
  var generate = StableIdHelper.generate;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var TemplateType = ManifestSettings.TemplateType;
  var getUiControl = DataVisualization.getUiControl;

  var CreationMode = FELibrary.CreationMode;
  /**
   * Helper class used by the control library for OData-specific handling (OData V4)
   *
   * @private
   * @experimental This module is only for internal/experimental use!
   */

  var TableHelper = {
    /**
     * Check if a given action is static.
     *
     * @param oActionContext The instance of the action
     * @param sActionName The name of the action
     * @returns Returns 'true' if action is static, else 'false'
     * @private
     * @ui5-restricted
     */
    _isStaticAction: function (oActionContext, sActionName) {
      var oAction;

      if (oActionContext) {
        if (Array.isArray(oActionContext)) {
          var sEntityType = this._getActionOverloadEntityType(sActionName);

          if (sEntityType) {
            oAction = oActionContext.find(function (action) {
              return action.$IsBound && action.$Parameter[0].$Type === sEntityType;
            });
          } else {
            // if this is just one - OK we take it. If it's more it's actually a wrong usage by the app
            // as we used the first one all the time we keep it as it is
            oAction = oActionContext[0];
          }
        } else {
          oAction = oActionContext;
        }
      }

      return !!oAction && oAction.$IsBound && oAction.$Parameter[0].$isCollection;
    },

    /**
     * Get the entity type of an action overload.
     *
     * @param sActionName The name of the action.
     * @returns The entity type used in the action overload.
     * @private
     */
    _getActionOverloadEntityType: function (sActionName) {
      if (sActionName && sActionName.indexOf("(") > -1) {
        var aParts = sActionName.split("(");
        return aParts[aParts.length - 1].replaceAll(")", "");
      }

      return undefined;
    },

    /**
     * Checks whether the action is overloaded on a different entity type.
     *
     * @param sActionName The name of the action.
     * @param sAnnotationTargetEntityType The entity type of the annotation target.
     * @returns Returns 'true' if the action is overloaded with a different entity type, else 'false'.
     * @private
     */
    _isActionOverloadOnDifferentType: function (sActionName, sAnnotationTargetEntityType) {
      var sEntityType = this._getActionOverloadEntityType(sActionName);

      return !!sEntityType && sAnnotationTargetEntityType !== sEntityType;
    },
    getMessageForDraftValidation: function (oThis) {
      var _oCollectionAnnotatio, _oThis$tableDefinitio;

      var oCollectionAnnotations = oThis.collection.getObject("./@");
      var sMessagePath = (_oCollectionAnnotatio = oCollectionAnnotations["@com.sap.vocabularies.Common.v1.Messages"]) === null || _oCollectionAnnotatio === void 0 ? void 0 : _oCollectionAnnotatio.$Path;

      if (sMessagePath && ((_oThis$tableDefinitio = oThis.tableDefinition) === null || _oThis$tableDefinitio === void 0 ? void 0 : _oThis$tableDefinitio.getProperty("/template")) === TemplateType.ObjectPage && !!Object.keys(oCollectionAnnotations).find(function (sKey) {
        var _oAnnotation$TargetPr;

        var oAnnotation = oCollectionAnnotations[sKey];
        return oAnnotation && oAnnotation.$Type === "com.sap.vocabularies.Common.v1.SideEffectsType" && !oAnnotation.SourceProperties && !oAnnotation.SourceEntities && ((_oAnnotation$TargetPr = oAnnotation.TargetProperties) === null || _oAnnotation$TargetPr === void 0 ? void 0 : _oAnnotation$TargetPr.indexOf(sMessagePath)) > -1;
      })) {
        return sMessagePath;
      }

      return "";
    },

    /**
     * Returns an array of the fields listed by the property RequestAtLeast in the PresentationVariant .
     *
     * @param oPresentationVariant The annotation related to com.sap.vocabularies.UI.v1.PresentationVariant.
     * @returns The fields.
     * @private
     * @ui5-restricted
     */
    getFieldsRequestedByPresentationVariant: function (oPresentationVariant) {
      var _oPresentationVariant;

      return ((_oPresentationVariant = oPresentationVariant.RequestAtLeast) === null || _oPresentationVariant === void 0 ? void 0 : _oPresentationVariant.map(function (oRequested) {
        return oRequested.value;
      })) || [];
    },
    getNavigationAvailableFieldsFromLineItem: function (aLineItemContext) {
      var aSelectedFieldsArray = [];
      (aLineItemContext.getObject() || []).forEach(function (oRecord) {
        var _oRecord$NavigationAv;

        if (oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && !oRecord.Inline && !oRecord.Determining && (_oRecord$NavigationAv = oRecord.NavigationAvailable) !== null && _oRecord$NavigationAv !== void 0 && _oRecord$NavigationAv.$Path) {
          aSelectedFieldsArray.push(oRecord.NavigationAvailable.$Path);
        }
      });
      return aSelectedFieldsArray;
    },
    getNavigationAvailableMap: function (aLineItemCollection) {
      var oIBNNavigationAvailableMap = {};
      aLineItemCollection.forEach(function (oRecord) {
        var sKey = "".concat(oRecord.SemanticObject, "-").concat(oRecord.Action);

        if (oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && !oRecord.Inline && oRecord.RequiresContext) {
          if (oRecord.NavigationAvailable !== undefined) {
            oIBNNavigationAvailableMap[sKey] = oRecord.NavigationAvailable.$Path ? oRecord.NavigationAvailable.$Path : oRecord.NavigationAvailable;
          }
        }
      });
      return JSON.stringify(oIBNNavigationAvailableMap);
    },

    /**
     * Return the context of the UI Line Item.
     *
     * @param oPresentationContext The context of the presentation (Presentation variant or UI.LineItem)
     * @returns The context of the UI Line Item
     */
    getUiLineItem: function (oPresentationContext) {
      return getUiControl(oPresentationContext, "@com.sap.vocabularies.UI.v1.LineItem");
    },

    /**
     * Creates and returns a select query with the selected fields from the parameters that were passed.
     *
     * @param oThis The instance of the inner model of the table building block
     * @returns The 'select' query that has the selected fields from the parameters that were passed
     */
    create$Select: function (oThis) {
      var oCollectionContext = oThis.collection;
      var aSelectedFields = [];
      var oLineItemContext = TableHelper.getUiLineItem(oThis.metaPath);
      var sTargetCollectionPath = CommonHelper.getTargetCollection(oCollectionContext);

      function pushField(sField) {
        if (sField && !aSelectedFields.includes(sField) && sField.indexOf("/") !== 0) {
          // Do not add singleton property (with absolute path) to $select
          aSelectedFields.push(sField);
        }
      }

      function pushFieldList(aFields) {
        if (aFields && aFields.length) {
          aFields.forEach(pushField);
        }
      }

      if (!oThis.tableDefinition.getObject("enableAnalytics") && oLineItemContext.getPath().indexOf("@com.sap.vocabularies.UI.v1.LineItem") > -1) {
        var _oCollectionContext$g, _oCollectionContext$g2, _oCollectionContext$g3, _oCollectionContext$g4;

        // $select isn't supported by the model in case of an analytical query
        // Don't process EntityType without LineItem (second condition of the if)
        var oPresentationAnnotation = getInvolvedDataModelObjects(oThis.metaPath).targetObject;
        var aOperationAvailableProperties = (oThis.tableDefinition.getObject("operationAvailableProperties") || "").split(",");

        var aApplicableProperties = TableHelper._filterNonApplicableProperties(aOperationAvailableProperties, oCollectionContext);

        var aSemanticKeys = (oCollectionContext.getObject("".concat(sTargetCollectionPath, "/@com.sap.vocabularies.Common.v1.SemanticKey")) || []).map(function (oSemanticKey) {
          return oSemanticKey.$PropertyPath;
        });

        if ((oPresentationAnnotation === null || oPresentationAnnotation === void 0 ? void 0 : oPresentationAnnotation.$Type) === "com.sap.vocabularies.UI.v1.PresentationVariantType") {
          pushFieldList(TableHelper.getFieldsRequestedByPresentationVariant(oPresentationAnnotation));
        }

        pushFieldList(TableHelper.getNavigationAvailableFieldsFromLineItem(oLineItemContext));
        pushFieldList(aApplicableProperties);
        pushFieldList(aSemanticKeys);
        pushField(TableHelper.getMessageForDraftValidation(oThis));
        pushField((_oCollectionContext$g = oCollectionContext.getObject("".concat(sTargetCollectionPath, "@Org.OData.Capabilities.V1.DeleteRestrictions"))) === null || _oCollectionContext$g === void 0 ? void 0 : (_oCollectionContext$g2 = _oCollectionContext$g.Deletable) === null || _oCollectionContext$g2 === void 0 ? void 0 : _oCollectionContext$g2.$Path);
        pushField((_oCollectionContext$g3 = oCollectionContext.getObject("".concat(sTargetCollectionPath, "@Org.OData.Capabilities.V1.UpdateRestrictions"))) === null || _oCollectionContext$g3 === void 0 ? void 0 : (_oCollectionContext$g4 = _oCollectionContext$g3.Updatable) === null || _oCollectionContext$g4 === void 0 ? void 0 : _oCollectionContext$g4.$Path);
      }

      return aSelectedFields.join(",");
    },

    /**
     * Method to get column's width if defined from manifest/customisation by annotations.
     *
     * There are issues when the cell in the column is a measure and has a UoM or currency associated to it
     * In edit mode this results in two fields and that doesn't work very well for the cell and the fields get cut.
     * So we are currently hardcoding width in several cases in edit mode where there are problems.
     *
     *
     * @function
     * @name getColumnWidth
     * @param oThis The instance of the inner model of the table building block
     * @param oColumn Defined width of the column, which is taken with priority if not null, undefined or empty
     * @param oAnnotations Annotations of the field
     * @param sDataFieldType Type of the field
     * @param sFieldControl Field control value
     * @param sDataType Datatype of the field
     * @param nTargetValueVisualization Number for DataFieldForAnnotation Target Value (stars)
     * @param oDataField Data Field
     * @param sDataFieldActionText DataField's text from button
     * @param oDataModelObjectPath The data model object path
     * @param oMicroChartTitle The object containing title and description of the MicroChart
     * @returns - Column width if defined, otherwise width is set to auto
     */
    getColumnWidth: function (oThis, oColumn, oAnnotations, sDataFieldType, sFieldControl, sDataType, nTargetValueVisualization, oDataField, sDataFieldActionText, oDataModelObjectPath, oMicroChartTitle) {
      var sWidth,
          bHasTextAnnotation = false;

      if (oColumn.width) {
        return oColumn.width;
      } else if (oDataModelObjectPath.targetObject.Value && getEditMode(oDataModelObjectPath.targetObject.Value.$target, oDataModelObjectPath, false, false, oDataModelObjectPath.targetObject) === "Display") {
        bHasTextAnnotation = oAnnotations && oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.Text");

        if (sDataType === "Edm.Stream" && !bHasTextAnnotation && oAnnotations.hasOwnProperty("@Org.OData.Core.V1.MediaType") && oAnnotations["@Org.OData.Core.V1.MediaType"].includes("image/")) {
          sWidth = "7em";
        }
      } else if (oAnnotations && (oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") && oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") === true || oAnnotations.hasOwnProperty("@Org.OData.Core.V1.MediaType") && oAnnotations["@Org.OData.Core.V1.MediaType"].includes("image/"))) {
        sWidth = "7em";
      } else if (sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" || sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oDataField.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") === -1) {
        var _oDataField$Target;

        var nTmpTextWidth, nTmpVisualizationWidth; // For FieldGroup having action buttons or visualization data points (as rating) on column.

        if (sDataFieldActionText && sDataFieldActionText.length >= oDataField.Label.length) {
          nTmpTextWidth = TableSizeHelper.getButtonWidth(sDataFieldActionText);
        } else if (oDataField) {
          nTmpTextWidth = TableSizeHelper.getButtonWidth(oDataField.Label);
        } else {
          nTmpTextWidth = TableSizeHelper.getButtonWidth(oAnnotations.Label);
        }

        if (nTargetValueVisualization) {
          //Each rating star has a width of 2em
          nTmpVisualizationWidth = nTargetValueVisualization * 2;
        }

        if (nTmpVisualizationWidth && !isNaN(nTmpVisualizationWidth) && nTmpVisualizationWidth > nTmpTextWidth) {
          sWidth = "".concat(nTmpVisualizationWidth, "em");
        } else if (sDataFieldActionText || oAnnotations && (oAnnotations.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" || oAnnotations.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction")) {
          // Add additional 2 em to avoid showing ellipsis in some cases.
          nTmpTextWidth += 2;
          sWidth = "".concat(nTmpTextWidth, "em");
        }

        if (oDataField !== null && oDataField !== void 0 && (_oDataField$Target = oDataField.Target) !== null && _oDataField$Target !== void 0 && _oDataField$Target.$AnnotationPath && oDataField.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") !== -1) {
          var chartSize;

          switch (this.getChartSize(oThis, oColumn)) {
            case "XS":
              chartSize = 5;
              break;

            case "S":
              chartSize = 5.2;
              break;

            case "M":
              chartSize = 6.3;
              break;

            case "L":
              chartSize = 7.9;
              break;

            default:
              chartSize = 6;
          }

          nTmpTextWidth += 2;

          if (!this.getShowOnlyChart(oThis, oColumn) && oMicroChartTitle && (oMicroChartTitle.Title.length || oMicroChartTitle.Description.length)) {
            var tmpText = oMicroChartTitle.Title.length > oMicroChartTitle.Description.length ? oMicroChartTitle.Title : oMicroChartTitle.Description;
            var titleSize = TableSizeHelper.getButtonWidth(tmpText) + 7;
            var tmpWidth = titleSize > nTmpTextWidth ? titleSize : nTmpTextWidth;
            sWidth = "".concat(tmpWidth, "em");
          } else if (nTmpTextWidth > chartSize) {
            sWidth = "".concat(nTmpTextWidth, "em");
          } else {
            sWidth = "".concat(chartSize, "em");
          }
        }
      }

      if (sWidth) {
        return sWidth;
      }
    },

    /**
     * Method to add a margin class at the control.
     *
     * @function
     * @name getMarginClass
     * @param oCollection Title of the DataPoint
     * @param oDataField Value of the DataPoint
     * @param sVisualization
     * @param sFieldGroupHiddenExpressions Hidden expression contained in FieldGroup
     * @returns Adjusting the margin
     */
    getMarginClass: function (oCollection, oDataField, sVisualization, sFieldGroupHiddenExpressions) {
      var sBindingExpression,
          sClass = "";

      if (JSON.stringify(oCollection[oCollection.length - 1]) == JSON.stringify(oDataField)) {
        //If rating indicator is last element in fieldgroup, then the 0.5rem margin added by sapMRI class of interactive rating indicator on top and bottom must be nullified.
        if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
          sClass = "sapUiNoMarginBottom sapUiNoMarginTop";
        }
      } else if (sVisualization === "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
        //If rating indicator is NOT the last element in fieldgroup, then to maintain the 0.5rem spacing between cogetMarginClassntrols (as per UX spec),
        //only the top margin added by sapMRI class of interactive rating indicator must be nullified.
        sClass = "sapUiNoMarginTop";
      } else {
        sClass = "sapUiTinyMarginBottom";
      }

      if (sFieldGroupHiddenExpressions && sFieldGroupHiddenExpressions !== "true" && sFieldGroupHiddenExpressions !== "false") {
        var sHiddenExpressionResult = sFieldGroupHiddenExpressions.substring(sFieldGroupHiddenExpressions.indexOf("{=") + 2, sFieldGroupHiddenExpressions.lastIndexOf("}"));
        sBindingExpression = "{= " + sHiddenExpressionResult + " ? '" + sClass + "' : " + "''" + " }";
        return sBindingExpression;
      } else {
        return sClass;
      }
    },
    getVBoxVisibility: function (oCollection, fieldGroupHiddenExpressions) {
      var bAllStatic = true;
      var bDynamicExpressionsInFields = false;
      var aHiddenPaths = [];

      for (var i = 0; i < oCollection.length; i++) {
        var hiddenAnnotationValue = oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"];

        if (hiddenAnnotationValue !== undefined && hiddenAnnotationValue !== false) {
          if (hiddenAnnotationValue !== true) {
            if (hiddenAnnotationValue.$Path) {
              aHiddenPaths.push(hiddenAnnotationValue.$Path);
              bAllStatic = false;
            } else if (typeof hiddenAnnotationValue === "object") {
              // Dynamic expression found in a field
              bDynamicExpressionsInFields = true;
              break;
            }
          } else {
            aHiddenPaths.push(hiddenAnnotationValue);
          }
        } else {
          aHiddenPaths.push(false);
        }
      }

      if (!bDynamicExpressionsInFields && aHiddenPaths.length > 0 && bAllStatic !== true) {
        var params = aHiddenPaths.map(function (hiddenPath) {
          if (typeof hiddenPath === "boolean") {
            return hiddenPath;
          } else {
            return BindingToolkit.pathInModel(hiddenPath);
          }
        });
        return BindingToolkit.compileExpression(BindingToolkit.formatResult(params, TableFormatter.getVBoxVisibility));
      } else if (bDynamicExpressionsInFields) {
        return fieldGroupHiddenExpressions;
      } else if (aHiddenPaths.length > 0 && aHiddenPaths.indexOf(false) === -1 && bAllStatic) {
        return false;
      } else {
        return true;
      }
    },

    /**
     * Method to provide hidden filters to the table.
     *
     * @function
     * @name formatHiddenFilters
     * @param oHiddenFilter The hiddenFilters via context named filters (and key hiddenFilters) passed to Macro Table
     * @returns The string representation of the hidden filters
     */
    formatHiddenFilters: function (oHiddenFilter) {
      if (oHiddenFilter) {
        try {
          return JSON.stringify(oHiddenFilter);
        } catch (ex) {
          return undefined;
        }
      }

      return undefined;
    },

    /**
     * Method to get the stable ID of the column.
     *
     * @function
     * @name getColumnStableId
     * @param sId Current object ID
     * @param oDataField Value of the DataPoint
     * @returns The stable ID for a given column
     */
    getColumnStableId: function (sId, oDataField) {
      return sId ? generate([sId, "C", oDataField.Target && oDataField.Target.$AnnotationPath || oDataField.Value && oDataField.Value.$Path || (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" || oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" ? oDataField : "")]) : undefined;
    },
    getFieldGroupLabelStableId: function (sId, oDataField) {
      return sId ? generate([sId, "FGLabel", oDataField.Target && oDataField.Target.$AnnotationPath || oDataField.Value && oDataField.Value.$Path || (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" || oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" ? oDataField : "")]) : undefined;
    },

    /**
     * Method filters out properties which do not belong to the collection.
     *
     * @param aPropertyPaths The array of properties to be checked.
     * @param oCollectionContext The collection context to be used.
     * @returns The array of applicable properties.
     * @private
     */
    _filterNonApplicableProperties: function (aPropertyPaths, oCollectionContext) {
      return aPropertyPaths && aPropertyPaths.filter(function (sPropertyPath) {
        return oCollectionContext.getObject("./".concat(sPropertyPath));
      });
    },

    /**
     * Method to generate the binding information for a table row.
     *
     * @param oThis The instance of the inner model of the table building block
     * @returns - Returns the binding information of a table row
     */
    getRowsBindingInfo: function (oThis) {
      var oCollection = oThis.collection;
      var oRowBinding = {
        ui5object: true,
        suspended: false,
        path: CommonHelper.addSingleQuotes((oCollection.getObject("$kind") === "EntitySet" ? "/" : "") + (oThis.navigationPath || oCollection.getObject("@sapui.name"))),
        parameters: {
          $count: true
        },
        events: {}
      };

      if (!oThis.tableDefinition.getObject("enableAnalytics")) {
        // Don't add $select parameter in case of an analytical query, this isn't supported by the model
        var sSelect = TableHelper.create$Select(oThis);

        if (sSelect) {
          oRowBinding.parameters.$select = "'".concat(sSelect, "'");
        } // we later ensure in the delegate only one list binding for a given targetCollectionPath has the flag $$getKeepAliveContext


        oRowBinding.parameters.$$getKeepAliveContext = true;
      }

      oRowBinding.parameters.$$groupId = CommonHelper.addSingleQuotes("$auto.Workers");
      oRowBinding.parameters.$$updateGroupId = CommonHelper.addSingleQuotes("$auto");
      oRowBinding.parameters.$$ownRequest = true;
      oRowBinding.parameters.$$patchWithoutSideEffects = true;
      oRowBinding.events.patchSent = CommonHelper.addSingleQuotes(".editFlow.handlePatchSent");
      oRowBinding.events.dataReceived = CommonHelper.addSingleQuotes("API.onInternalDataReceived");
      oRowBinding.events.dataRequested = CommonHelper.addSingleQuotes("API.onInternalDataRequested"); // recreate an empty row when one is activated

      oRowBinding.events.createActivate = CommonHelper.addSingleQuotes(".editFlow.handleCreateActivate");

      if (oThis.onContextChange !== undefined && oThis.onContextChange !== null) {
        oRowBinding.events.change = CommonHelper.addSingleQuotes(oThis.onContextChange);
      }

      return CommonHelper.objectToString(oRowBinding);
    },

    /**
     * Method to check the validity of the fields in the creation row.
     *
     * @function
     * @name validateCreationRowFields
     * @param oFieldValidityObject Current Object holding the fields
     * @returns `true` if all the fields in the creation row are valid, `false` otherwise
     */
    validateCreationRowFields: function (oFieldValidityObject) {
      if (!oFieldValidityObject) {
        return false;
      }

      return Object.keys(oFieldValidityObject).length > 0 && Object.keys(oFieldValidityObject).every(function (key) {
        return oFieldValidityObject[key]["validity"];
      });
    },

    /**
     * Method to get the expression for the 'press' event for the DataFieldForActionButton.
     *
     * @function
     * @name pressEventDataFieldForActionButton
     * @param oThis Current object
     * @param oDataField Value of the DataPoint
     * @param sEntitySetName Name of the EntitySet
     * @param sOperationAvailableMap OperationAvailableMap as stringified JSON object
     * @param oActionContext Action object
     * @param bIsNavigable Action either triggers navigation or not
     * @param bEnableAutoScroll Action either triggers scrolling to the newly created items in the related table or not
     * @param sDefaultValuesExtensionFunction Function name to prefill dialog parameters
     * @returns The binding expression
     */
    pressEventDataFieldForActionButton: function (oThis, oDataField, sEntitySetName, sOperationAvailableMap, oActionContext, bIsNavigable, bEnableAutoScroll, sDefaultValuesExtensionFunction) {
      var sActionName = oDataField.Action,
          sAnnotationTargetEntityType = oThis && oThis.collection.getObject("$Type"),
          bStaticAction = this._isStaticAction(oActionContext, sActionName) || this._isActionOverloadOnDifferentType(sActionName, sAnnotationTargetEntityType),
          oParams = {
        contexts: !bStaticAction ? "${internal>selectedContexts}" : null,
        bStaticAction: bStaticAction ? bStaticAction : undefined,
        entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
        applicableContext: !bStaticAction ? "${internal>dynamicActions/" + oDataField.Action + "/aApplicable/}" : null,
        notApplicableContext: !bStaticAction ? "${internal>dynamicActions/" + oDataField.Action + "/aNotApplicable/}" : null,
        isNavigable: bIsNavigable,
        enableAutoScroll: bEnableAutoScroll,
        defaultValuesExtensionFunction: sDefaultValuesExtensionFunction ? "'" + sDefaultValuesExtensionFunction + "'" : undefined
      };

      return ActionHelper.getPressEventDataFieldForActionButton(oThis.id, oDataField, oParams, sOperationAvailableMap);
    },

    /**
     * Method to determine the binding expression for 'enabled' property of DataFieldForAction and DataFieldForIBN actions.
     *
     * @function
     * @name isDataFieldForActionEnabled
     * @param oThis The instance of the table control
     * @param oDataField The value of the data field
     * @param oRequiresContext RequiresContext for IBN
     * @param bIsDataFieldForIBN Flag for IBN
     * @param oActionContext The instance of the action
     * @param vActionEnabled Status of action (single or multiselect)
     * @returns A binding expression to define the 'enabled' property of the action
     */
    isDataFieldForActionEnabled: function (oThis, oDataField, oRequiresContext, bIsDataFieldForIBN, oActionContext, vActionEnabled) {
      var sActionName = oDataField.Action,
          sAnnotationTargetEntityType = oThis && oThis.collection.getObject("$Type"),
          oTableDefinition = oThis && oThis.tableDefinition && oThis.tableDefinition.getObject(),
          bStaticAction = this._isStaticAction(oActionContext, sActionName),
          isAnalyticalTable = oTableDefinition && oTableDefinition.enableAnalytics; // Check for action overload on a different Entity type.
      // If yes, table row selection is not required to enable this action.


      if (!bIsDataFieldForIBN && this._isActionOverloadOnDifferentType(sActionName, sAnnotationTargetEntityType)) {
        // Action overload defined on different entity type
        var oOperationAvailableMap = oTableDefinition && JSON.parse(oTableDefinition.operationAvailableMap);

        if (oOperationAvailableMap && oOperationAvailableMap.hasOwnProperty(sActionName)) {
          // Core.OperationAvailable annotation defined for the action.
          // Need to refer to internal model for enabled property of the dynamic action.
          // return compileBinding(bindingExpression("dynamicActions/" + sActionName + "/bEnabled", "internal"), true);
          return "{= ${internal>dynamicActions/" + sActionName + "/bEnabled} }";
        } // Consider the action just like any other static DataFieldForAction.


        return true;
      }

      if (!oRequiresContext || bStaticAction) {
        if (bIsDataFieldForIBN) {
          var sEntitySet = oThis.collection.getPath();
          var oMetaModel = oThis.collection.getModel();

          if (vActionEnabled === "false" && !isAnalyticalTable) {
            Log.warning("NavigationAvailable as false is incorrect usage");
            return false;
          } else if (!isAnalyticalTable && oDataField && oDataField.NavigationAvailable && oDataField.NavigationAvailable.$Path && oMetaModel.getObject(sEntitySet + "/$Partner") === oDataField.NavigationAvailable.$Path.split("/")[0]) {
            return "{= ${" + vActionEnabled.substr(vActionEnabled.indexOf("/") + 1, vActionEnabled.length) + "}";
          } else {
            return true;
          }
        }

        return true;
      }

      var sDataFieldForActionEnabledExpression = "",
          sNumberOfSelectedContexts,
          sAction;

      if (bIsDataFieldForIBN) {
        if (vActionEnabled === "true" || isAnalyticalTable) {
          sDataFieldForActionEnabledExpression = "%{internal>numberOfSelectedContexts} >= 1";
        } else if (vActionEnabled === "false") {
          Log.warning("NavigationAvailable as false is incorrect usage");
          return false;
        } else {
          sNumberOfSelectedContexts = "%{internal>numberOfSelectedContexts} >= 1";
          sAction = "${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/bEnabled" + "}";
          sDataFieldForActionEnabledExpression = sNumberOfSelectedContexts + " && " + sAction;
        }
      } else {
        sNumberOfSelectedContexts = ActionHelper.getNumberOfContextsExpression(vActionEnabled);
        sAction = "${internal>dynamicActions/" + oDataField.Action + "/bEnabled" + "}";
        sDataFieldForActionEnabledExpression = sNumberOfSelectedContexts + " && " + sAction;
      }

      return "{= " + sDataFieldForActionEnabledExpression + "}";
    },

    /**
     * Method to get press event expression for CreateButton.
     *
     * @function
     * @name pressEventForCreateButton
     * @param oThis Current Object
     * @param bCmdExecutionFlag Flag to indicate that the function is called from CMD Execution
     * @returns The binding expression for the press event of the create button
     */
    pressEventForCreateButton: function (oThis, bCmdExecutionFlag) {
      var sCreationMode = oThis.creationMode;
      var oParams;
      var sMdcTable = bCmdExecutionFlag ? "${$source>}.getParent()" : "${$source>}.getParent().getParent().getParent()";
      var sRowBinding = sMdcTable + ".getRowBinding() || " + sMdcTable + ".data('rowsBindingInfo').path";

      switch (sCreationMode) {
        case CreationMode.External:
          // navigate to external target for creating new entries
          // TODO: Add required parameters
          oParams = {
            creationMode: CommonHelper.addSingleQuotes(CreationMode.External),
            outbound: CommonHelper.addSingleQuotes(oThis.createOutbound)
          };
          break;

        case CreationMode.CreationRow:
          oParams = {
            creationMode: CommonHelper.addSingleQuotes(CreationMode.CreationRow),
            creationRow: "${$source>}",
            createAtEnd: oThis.createAtEnd !== undefined ? oThis.createAtEnd : false
          };
          sRowBinding = "${$source>}.getParent()._getRowBinding()";
          break;

        case CreationMode.NewPage:
        case CreationMode.Inline:
          oParams = {
            creationMode: CommonHelper.addSingleQuotes(sCreationMode),
            createAtEnd: oThis.createAtEnd !== undefined ? oThis.createAtEnd : false,
            tableId: CommonHelper.addSingleQuotes(oThis.id)
          };

          if (oThis.createNewAction) {
            oParams.newAction = CommonHelper.addSingleQuotes(oThis.createNewAction);
          }

          break;

        case CreationMode.InlineCreationRows:
          return CommonHelper.generateFunction("._editFlow.scrollAndFocusOnInactiveRow", sMdcTable);

        default:
          // unsupported
          return undefined;
      }

      return CommonHelper.generateFunction(".editFlow.createDocument", sRowBinding, CommonHelper.objectToString(oParams));
    },
    getIBNData: function (oThis) {
      var outboundDetail = oThis.createOutboundDetail;

      if (outboundDetail) {
        var oIBNData = {
          semanticObject: CommonHelper.addSingleQuotes(outboundDetail.semanticObject),
          action: CommonHelper.addSingleQuotes(outboundDetail.action)
        };
        return CommonHelper.objectToString(oIBNData);
      }
    },

    /**
     * Method to get press event expression for 'Delete' button.
     *
     * @function
     * @name pressEventForDeleteButton
     * @param oThis Current Object
     * @param sEntitySetName EntitySet name
     * @param oHeaderInfo Header Info
     * @param fullcontextPath Context Path
     * @returns The binding expression for the press event of the 'Delete' button
     */
    pressEventForDeleteButton: function (oThis, sEntitySetName, oHeaderInfo, fullcontextPath) {
      var sDeletableContexts = "${internal>deletableContexts}";
      var sTitle, titleValueExpression, sTitleExpression, sDescription, descriptionExpression, sDescriptionExpression;

      if (oHeaderInfo !== null && oHeaderInfo !== void 0 && oHeaderInfo.Title) {
        if (typeof oHeaderInfo.Title.Value === "string") {
          sTitleExpression = CommonHelper.addSingleQuotes(oHeaderInfo.Title.Value);
        } else {
          var _oHeaderInfo$Title;

          sTitle = BindingToolkit.getExpressionFromAnnotation(oHeaderInfo === null || oHeaderInfo === void 0 ? void 0 : (_oHeaderInfo$Title = oHeaderInfo.Title) === null || _oHeaderInfo$Title === void 0 ? void 0 : _oHeaderInfo$Title.Value);

          if (BindingToolkit.isConstant(sTitle) || BindingToolkit.isPathInModelExpression(sTitle)) {
            titleValueExpression = formatValueRecursively(sTitle, fullcontextPath);
            sTitleExpression = BindingToolkit.compileExpression(titleValueExpression);
          }
        }
      }

      if (oHeaderInfo !== null && oHeaderInfo !== void 0 && oHeaderInfo.Description) {
        if (typeof oHeaderInfo.Description.Value === "string") {
          sDescriptionExpression = CommonHelper.addSingleQuotes(oHeaderInfo.Description.Value);
        } else {
          var _oHeaderInfo$Descript;

          sDescription = BindingToolkit.getExpressionFromAnnotation(oHeaderInfo === null || oHeaderInfo === void 0 ? void 0 : (_oHeaderInfo$Descript = oHeaderInfo.Description) === null || _oHeaderInfo$Descript === void 0 ? void 0 : _oHeaderInfo$Descript.Value);

          if (BindingToolkit.isConstant(sDescription) || BindingToolkit.isPathInModelExpression(sDescription)) {
            descriptionExpression = formatValueRecursively(sDescription, fullcontextPath);
            sDescriptionExpression = BindingToolkit.compileExpression(descriptionExpression);
          }
        }
      }

      var oParams = {
        id: CommonHelper.addSingleQuotes(oThis.id),
        entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
        numberOfSelectedContexts: "${internal>selectedContexts}.length",
        unSavedContexts: "${internal>unSavedContexts}",
        lockedContexts: "${internal>lockedContexts}",
        controlId: "${internal>controlId}",
        title: sTitleExpression,
        description: sDescriptionExpression
      };
      return CommonHelper.generateFunction(".editFlow.deleteMultipleDocuments", sDeletableContexts, CommonHelper.objectToString(oParams));
    },

    /**
     * Method to handle the 'enable' and 'disable' state of the table's 'Delete' button if this information is requested in the side effects.
     *
     * @function
     * @name handleTableDeleteEnablementForSideEffects
     * @param oTable Table instance
     * @param oInternalModelContext The internal model context
     */
    handleTableDeleteEnablementForSideEffects: function (oTable, oInternalModelContext) {
      if (oTable && oInternalModelContext) {
        var sDeletablePath = TableHelper.getDeletablePathForTable(oTable),
            aSelectedContexts = oTable.getSelectedContexts(),
            aDeletableContexts = [];
        oInternalModelContext.setProperty("deleteEnabled", false);

        for (var i = 0; i < aSelectedContexts.length; i++) {
          if (typeof sDeletablePath === "string" && sDeletablePath !== undefined) {
            var oSelectedContext = aSelectedContexts[i];

            if (oSelectedContext && oSelectedContext.getProperty(sDeletablePath)) {
              oInternalModelContext.setProperty("deleteEnabled", true);
              aDeletableContexts.push(oSelectedContext);
            }
          }
        }

        oInternalModelContext.setProperty("deletableContexts", aDeletableContexts);
      }
    },

    /**
     * Method to get the delete restricitions Path associated.
     *
     * @function
     * @name getDeletablePathForTable
     * @param table Table instance
     * @returns Path associated with delete's enable and disable
     */
    getDeletablePathForTable: function (table) {
      var deletablePath;
      var rowBinding = table.getRowBinding();

      if (rowBinding) {
        var _rowBinding$getContex, _metaModel$getObject2;

        var metaModel = table.getModel().getMetaModel();
        var path = rowBinding.getPath();
        var contextPath = (_rowBinding$getContex = rowBinding.getContext()) === null || _rowBinding$getContex === void 0 ? void 0 : _rowBinding$getContex.getPath();

        if (contextPath) {
          var _metaModel$getObject, _metaModel$getObject$;

          var metaPath = metaModel.getMetaPath(contextPath);
          var navigationPropertyPath = (_metaModel$getObject = metaModel.getObject(metaPath)) === null || _metaModel$getObject === void 0 ? void 0 : (_metaModel$getObject$ = _metaModel$getObject["$NavigationPropertyBinding"]) === null || _metaModel$getObject$ === void 0 ? void 0 : _metaModel$getObject$[path];

          if (navigationPropertyPath !== undefined) {
            path = "/".concat(navigationPropertyPath);
          }
        }

        deletablePath = (_metaModel$getObject2 = metaModel.getObject("".concat(path, "@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable"))) === null || _metaModel$getObject2 === void 0 ? void 0 : _metaModel$getObject2.$Path;
      }

      return deletablePath;
    },

    /**
     * Method to set visibility of column header label.
     *
     * @function
     * @name setHeaderLabelVisibility
     * @param datafield DataField
     * @param dataFieldCollection List of items inside a fieldgroup (if any)
     * @returns `true` if the header label needs to be visible else false.
     */
    setHeaderLabelVisibility: function (datafield, dataFieldCollection) {
      // If Inline button/navigation action, return false, else true;
      if (!dataFieldCollection) {
        if (datafield.$Type.indexOf("DataFieldForAction") > -1 && datafield.Inline) {
          return false;
        }

        if (datafield.$Type.indexOf("DataFieldForIntentBasedNavigation") > -1 && datafield.Inline) {
          return false;
        }

        return true;
      } // In Fieldgroup, If NOT all datafield/datafieldForAnnotation exists with hidden, return true;


      return dataFieldCollection.some(function (oDC) {
        if ((oDC.$Type === "com.sap.vocabularies.UI.v1.DataField" || oDC.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") && oDC["@com.sap.vocabularies.UI.v1.Hidden"] !== true) {
          return true;
        }
      });
    },

    /**
     * Method to get Target Value (# of stars) from Visualization Rating.
     *
     * @function
     * @name getValueOnRatingField
     * @param oDataField DataPoint's Value
     * @param oContext Context object of the LineItem
     * @returns The number for DataFieldForAnnotation Target Value
     */
    getValueOnRatingField: function (oDataField, oContext) {
      // for FieldGroup containing visualizationTypeRating
      if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
        // For a data field having Rating as visualization type
        if (oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 && oContext.context.getObject("Target/$AnnotationPath/$Type") == "com.sap.vocabularies.UI.v1.DataPointType" && oContext.context.getObject("Target/$AnnotationPath/Visualization/$EnumMember") == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
          return oContext.context.getObject("Target/$AnnotationPath/TargetValue");
        } // for FieldGroup having Rating as visualization type in any of the data fields


        if (oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1) {
          var sPathDataFields = "Target/$AnnotationPath/Data/";

          for (var i in oContext.context.getObject(sPathDataFields)) {
            if (oContext.context.getObject("".concat(sPathDataFields + i, "/$Type")) === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oContext.context.getObject("".concat(sPathDataFields + i, "/Target/$AnnotationPath")).indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 && oContext.context.getObject("".concat(sPathDataFields + i, "/Target/$AnnotationPath/$Type")) == "com.sap.vocabularies.UI.v1.DataPointType" && oContext.context.getObject("".concat(sPathDataFields + i, "/Target/$AnnotationPath/Visualization/$EnumMember")) == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
              return oContext.context.getObject("".concat(sPathDataFields + i, "/Target/$AnnotationPath/TargetValue"));
            }
          }
        }
      }
    },

    /**
     * Method to get Text from DataFieldForAnnotation into Column.
     *
     * @function
     * @name getTextOnActionField
     * @param oDataField DataPoint's Value
     * @param oContext Context object of the LineItem
     * @returns String from label referring to action text
     */
    getTextOnActionField: function (oDataField, oContext) {
      if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
        return oDataField.Label;
      } // for FieldGroup containing DataFieldForAnnotation


      if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1) {
        var sPathDataFields = "Target/$AnnotationPath/Data/";
        var aMultipleLabels = [];

        for (var i in oContext.context.getObject(sPathDataFields)) {
          if (oContext.context.getObject("".concat(sPathDataFields + i, "/$Type")) === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oContext.context.getObject("".concat(sPathDataFields + i, "/$Type")) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
            aMultipleLabels.push(oContext.context.getObject("".concat(sPathDataFields + i, "/Label")));
          }
        } // In case there are multiple actions inside a Field Group select the largest Action Label


        if (aMultipleLabels.length > 1) {
          return aMultipleLabels.reduce(function (a, b) {
            return a.length > b.length ? a : b;
          });
        } else {
          return aMultipleLabels.length === 0 ? undefined : aMultipleLabels.toString();
        }
      }
    },
    _getResponsiveTableColumnSettings: function (oThis, oColumn) {
      if (oThis.tableType === "ResponsiveTable") {
        return oColumn.settings;
      }

      return null;
    },
    getChartSize: function (oThis, oColumn) {
      var settings = this._getResponsiveTableColumnSettings(oThis, oColumn);

      if (settings && settings.microChartSize) {
        return settings.microChartSize;
      }

      return "XS";
    },
    getShowOnlyChart: function (oThis, oColumn) {
      var settings = this._getResponsiveTableColumnSettings(oThis, oColumn);

      if (settings && settings.showMicroChartLabel) {
        return !settings.showMicroChartLabel;
      }

      return true;
    },
    getDelegate: function (bEnableAnalytics, bHasMultiVisualizations, sEntityName) {
      var oDelegate;

      if (bHasMultiVisualizations === "true") {
        oDelegate = {
          name: bEnableAnalytics ? "sap/fe/macros/table/delegates/AnalyticalALPTableDelegate" : "sap/fe/macros/table/delegates/ALPTableDelegate",
          payload: {
            collectionName: sEntityName
          }
        };
      } else {
        oDelegate = {
          name: bEnableAnalytics ? "sap/fe/macros/table/delegates/AnalyticalTableDelegate" : "sap/fe/macros/table/delegates/TableDelegate"
        };
      }

      return JSON.stringify(oDelegate);
    },
    setIBNEnablement: function (oInternalModelContext, oNavigationAvailableMap, aSelectedContexts) {
      for (var sKey in oNavigationAvailableMap) {
        oInternalModelContext.setProperty("ibn/".concat(sKey), {
          bEnabled: false,
          aApplicable: [],
          aNotApplicable: []
        });
        var aApplicable = [],
            aNotApplicable = [];
        var sProperty = oNavigationAvailableMap[sKey];

        for (var i = 0; i < aSelectedContexts.length; i++) {
          var oSelectedContext = aSelectedContexts[i];

          if (oSelectedContext.getObject(sProperty)) {
            oInternalModelContext.getModel().setProperty("".concat(oInternalModelContext.getPath(), "/ibn/").concat(sKey, "/bEnabled"), true);
            aApplicable.push(oSelectedContext);
          } else {
            aNotApplicable.push(oSelectedContext);
          }
        }

        oInternalModelContext.getModel().setProperty("".concat(oInternalModelContext.getPath(), "/ibn/").concat(sKey, "/aApplicable"), aApplicable);
        oInternalModelContext.getModel().setProperty("".concat(oInternalModelContext.getPath(), "/ibn/").concat(sKey, "/aNotApplicable"), aNotApplicable);
      }
    }
  };
  TableHelper.getNavigationAvailableMap.requiresIContext = true;
  TableHelper.getValueOnRatingField.requiresIContext = true;
  TableHelper.getTextOnActionField.requiresIContext = true;
  return TableHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDcmVhdGlvbk1vZGUiLCJGRUxpYnJhcnkiLCJUYWJsZUhlbHBlciIsIl9pc1N0YXRpY0FjdGlvbiIsIm9BY3Rpb25Db250ZXh0Iiwic0FjdGlvbk5hbWUiLCJvQWN0aW9uIiwiQXJyYXkiLCJpc0FycmF5Iiwic0VudGl0eVR5cGUiLCJfZ2V0QWN0aW9uT3ZlcmxvYWRFbnRpdHlUeXBlIiwiZmluZCIsImFjdGlvbiIsIiRJc0JvdW5kIiwiJFBhcmFtZXRlciIsIiRUeXBlIiwiJGlzQ29sbGVjdGlvbiIsImluZGV4T2YiLCJhUGFydHMiLCJzcGxpdCIsImxlbmd0aCIsInJlcGxhY2VBbGwiLCJ1bmRlZmluZWQiLCJfaXNBY3Rpb25PdmVybG9hZE9uRGlmZmVyZW50VHlwZSIsInNBbm5vdGF0aW9uVGFyZ2V0RW50aXR5VHlwZSIsImdldE1lc3NhZ2VGb3JEcmFmdFZhbGlkYXRpb24iLCJvVGhpcyIsIm9Db2xsZWN0aW9uQW5ub3RhdGlvbnMiLCJjb2xsZWN0aW9uIiwiZ2V0T2JqZWN0Iiwic01lc3NhZ2VQYXRoIiwiJFBhdGgiLCJ0YWJsZURlZmluaXRpb24iLCJnZXRQcm9wZXJ0eSIsIlRlbXBsYXRlVHlwZSIsIk9iamVjdFBhZ2UiLCJPYmplY3QiLCJrZXlzIiwic0tleSIsIm9Bbm5vdGF0aW9uIiwiU291cmNlUHJvcGVydGllcyIsIlNvdXJjZUVudGl0aWVzIiwiVGFyZ2V0UHJvcGVydGllcyIsImdldEZpZWxkc1JlcXVlc3RlZEJ5UHJlc2VudGF0aW9uVmFyaWFudCIsIm9QcmVzZW50YXRpb25WYXJpYW50IiwiUmVxdWVzdEF0TGVhc3QiLCJtYXAiLCJvUmVxdWVzdGVkIiwidmFsdWUiLCJnZXROYXZpZ2F0aW9uQXZhaWxhYmxlRmllbGRzRnJvbUxpbmVJdGVtIiwiYUxpbmVJdGVtQ29udGV4dCIsImFTZWxlY3RlZEZpZWxkc0FycmF5IiwiZm9yRWFjaCIsIm9SZWNvcmQiLCJJbmxpbmUiLCJEZXRlcm1pbmluZyIsIk5hdmlnYXRpb25BdmFpbGFibGUiLCJwdXNoIiwiZ2V0TmF2aWdhdGlvbkF2YWlsYWJsZU1hcCIsImFMaW5lSXRlbUNvbGxlY3Rpb24iLCJvSUJOTmF2aWdhdGlvbkF2YWlsYWJsZU1hcCIsIlNlbWFudGljT2JqZWN0IiwiQWN0aW9uIiwiUmVxdWlyZXNDb250ZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsImdldFVpTGluZUl0ZW0iLCJvUHJlc2VudGF0aW9uQ29udGV4dCIsImdldFVpQ29udHJvbCIsImNyZWF0ZSRTZWxlY3QiLCJvQ29sbGVjdGlvbkNvbnRleHQiLCJhU2VsZWN0ZWRGaWVsZHMiLCJvTGluZUl0ZW1Db250ZXh0IiwibWV0YVBhdGgiLCJzVGFyZ2V0Q29sbGVjdGlvblBhdGgiLCJDb21tb25IZWxwZXIiLCJnZXRUYXJnZXRDb2xsZWN0aW9uIiwicHVzaEZpZWxkIiwic0ZpZWxkIiwiaW5jbHVkZXMiLCJwdXNoRmllbGRMaXN0IiwiYUZpZWxkcyIsImdldFBhdGgiLCJvUHJlc2VudGF0aW9uQW5ub3RhdGlvbiIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsInRhcmdldE9iamVjdCIsImFPcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzIiwiYUFwcGxpY2FibGVQcm9wZXJ0aWVzIiwiX2ZpbHRlck5vbkFwcGxpY2FibGVQcm9wZXJ0aWVzIiwiYVNlbWFudGljS2V5cyIsIm9TZW1hbnRpY0tleSIsIiRQcm9wZXJ0eVBhdGgiLCJEZWxldGFibGUiLCJVcGRhdGFibGUiLCJqb2luIiwiZ2V0Q29sdW1uV2lkdGgiLCJvQ29sdW1uIiwib0Fubm90YXRpb25zIiwic0RhdGFGaWVsZFR5cGUiLCJzRmllbGRDb250cm9sIiwic0RhdGFUeXBlIiwiblRhcmdldFZhbHVlVmlzdWFsaXphdGlvbiIsIm9EYXRhRmllbGQiLCJzRGF0YUZpZWxkQWN0aW9uVGV4dCIsIm9EYXRhTW9kZWxPYmplY3RQYXRoIiwib01pY3JvQ2hhcnRUaXRsZSIsInNXaWR0aCIsImJIYXNUZXh0QW5ub3RhdGlvbiIsIndpZHRoIiwiVmFsdWUiLCJnZXRFZGl0TW9kZSIsIiR0YXJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsIlRhcmdldCIsIiRBbm5vdGF0aW9uUGF0aCIsIm5UbXBUZXh0V2lkdGgiLCJuVG1wVmlzdWFsaXphdGlvbldpZHRoIiwiTGFiZWwiLCJUYWJsZVNpemVIZWxwZXIiLCJnZXRCdXR0b25XaWR0aCIsImlzTmFOIiwiY2hhcnRTaXplIiwiZ2V0Q2hhcnRTaXplIiwiZ2V0U2hvd09ubHlDaGFydCIsIlRpdGxlIiwiRGVzY3JpcHRpb24iLCJ0bXBUZXh0IiwidGl0bGVTaXplIiwidG1wV2lkdGgiLCJnZXRNYXJnaW5DbGFzcyIsIm9Db2xsZWN0aW9uIiwic1Zpc3VhbGl6YXRpb24iLCJzRmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zIiwic0JpbmRpbmdFeHByZXNzaW9uIiwic0NsYXNzIiwic0hpZGRlbkV4cHJlc3Npb25SZXN1bHQiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXhPZiIsImdldFZCb3hWaXNpYmlsaXR5IiwiZmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zIiwiYkFsbFN0YXRpYyIsImJEeW5hbWljRXhwcmVzc2lvbnNJbkZpZWxkcyIsImFIaWRkZW5QYXRocyIsImkiLCJoaWRkZW5Bbm5vdGF0aW9uVmFsdWUiLCJwYXJhbXMiLCJoaWRkZW5QYXRoIiwiQmluZGluZ1Rvb2xraXQiLCJwYXRoSW5Nb2RlbCIsImNvbXBpbGVFeHByZXNzaW9uIiwiZm9ybWF0UmVzdWx0IiwiVGFibGVGb3JtYXR0ZXIiLCJmb3JtYXRIaWRkZW5GaWx0ZXJzIiwib0hpZGRlbkZpbHRlciIsImV4IiwiZ2V0Q29sdW1uU3RhYmxlSWQiLCJzSWQiLCJnZW5lcmF0ZSIsImdldEZpZWxkR3JvdXBMYWJlbFN0YWJsZUlkIiwiYVByb3BlcnR5UGF0aHMiLCJmaWx0ZXIiLCJzUHJvcGVydHlQYXRoIiwiZ2V0Um93c0JpbmRpbmdJbmZvIiwib1Jvd0JpbmRpbmciLCJ1aTVvYmplY3QiLCJzdXNwZW5kZWQiLCJwYXRoIiwiYWRkU2luZ2xlUXVvdGVzIiwibmF2aWdhdGlvblBhdGgiLCJwYXJhbWV0ZXJzIiwiJGNvdW50IiwiZXZlbnRzIiwic1NlbGVjdCIsIiRzZWxlY3QiLCIkJGdldEtlZXBBbGl2ZUNvbnRleHQiLCIkJGdyb3VwSWQiLCIkJHVwZGF0ZUdyb3VwSWQiLCIkJG93blJlcXVlc3QiLCIkJHBhdGNoV2l0aG91dFNpZGVFZmZlY3RzIiwicGF0Y2hTZW50IiwiZGF0YVJlY2VpdmVkIiwiZGF0YVJlcXVlc3RlZCIsImNyZWF0ZUFjdGl2YXRlIiwib25Db250ZXh0Q2hhbmdlIiwiY2hhbmdlIiwib2JqZWN0VG9TdHJpbmciLCJ2YWxpZGF0ZUNyZWF0aW9uUm93RmllbGRzIiwib0ZpZWxkVmFsaWRpdHlPYmplY3QiLCJldmVyeSIsImtleSIsInByZXNzRXZlbnREYXRhRmllbGRGb3JBY3Rpb25CdXR0b24iLCJzRW50aXR5U2V0TmFtZSIsInNPcGVyYXRpb25BdmFpbGFibGVNYXAiLCJiSXNOYXZpZ2FibGUiLCJiRW5hYmxlQXV0b1Njcm9sbCIsInNEZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24iLCJiU3RhdGljQWN0aW9uIiwib1BhcmFtcyIsImNvbnRleHRzIiwiZW50aXR5U2V0TmFtZSIsImFwcGxpY2FibGVDb250ZXh0Iiwibm90QXBwbGljYWJsZUNvbnRleHQiLCJpc05hdmlnYWJsZSIsImVuYWJsZUF1dG9TY3JvbGwiLCJkZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24iLCJBY3Rpb25IZWxwZXIiLCJnZXRQcmVzc0V2ZW50RGF0YUZpZWxkRm9yQWN0aW9uQnV0dG9uIiwiaWQiLCJpc0RhdGFGaWVsZEZvckFjdGlvbkVuYWJsZWQiLCJvUmVxdWlyZXNDb250ZXh0IiwiYklzRGF0YUZpZWxkRm9ySUJOIiwidkFjdGlvbkVuYWJsZWQiLCJvVGFibGVEZWZpbml0aW9uIiwiaXNBbmFseXRpY2FsVGFibGUiLCJlbmFibGVBbmFseXRpY3MiLCJvT3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwicGFyc2UiLCJvcGVyYXRpb25BdmFpbGFibGVNYXAiLCJzRW50aXR5U2V0Iiwib01ldGFNb2RlbCIsImdldE1vZGVsIiwiTG9nIiwid2FybmluZyIsInN1YnN0ciIsInNEYXRhRmllbGRGb3JBY3Rpb25FbmFibGVkRXhwcmVzc2lvbiIsInNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMiLCJzQWN0aW9uIiwiZ2V0TnVtYmVyT2ZDb250ZXh0c0V4cHJlc3Npb24iLCJwcmVzc0V2ZW50Rm9yQ3JlYXRlQnV0dG9uIiwiYkNtZEV4ZWN1dGlvbkZsYWciLCJzQ3JlYXRpb25Nb2RlIiwiY3JlYXRpb25Nb2RlIiwic01kY1RhYmxlIiwic1Jvd0JpbmRpbmciLCJFeHRlcm5hbCIsIm91dGJvdW5kIiwiY3JlYXRlT3V0Ym91bmQiLCJDcmVhdGlvblJvdyIsImNyZWF0aW9uUm93IiwiY3JlYXRlQXRFbmQiLCJOZXdQYWdlIiwidGFibGVJZCIsImNyZWF0ZU5ld0FjdGlvbiIsIm5ld0FjdGlvbiIsIklubGluZUNyZWF0aW9uUm93cyIsImdlbmVyYXRlRnVuY3Rpb24iLCJnZXRJQk5EYXRhIiwib3V0Ym91bmREZXRhaWwiLCJjcmVhdGVPdXRib3VuZERldGFpbCIsIm9JQk5EYXRhIiwic2VtYW50aWNPYmplY3QiLCJwcmVzc0V2ZW50Rm9yRGVsZXRlQnV0dG9uIiwib0hlYWRlckluZm8iLCJmdWxsY29udGV4dFBhdGgiLCJzRGVsZXRhYmxlQ29udGV4dHMiLCJzVGl0bGUiLCJ0aXRsZVZhbHVlRXhwcmVzc2lvbiIsInNUaXRsZUV4cHJlc3Npb24iLCJzRGVzY3JpcHRpb24iLCJkZXNjcmlwdGlvbkV4cHJlc3Npb24iLCJzRGVzY3JpcHRpb25FeHByZXNzaW9uIiwiZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uIiwiaXNDb25zdGFudCIsImlzUGF0aEluTW9kZWxFeHByZXNzaW9uIiwiZm9ybWF0VmFsdWVSZWN1cnNpdmVseSIsIm51bWJlck9mU2VsZWN0ZWRDb250ZXh0cyIsInVuU2F2ZWRDb250ZXh0cyIsImxvY2tlZENvbnRleHRzIiwiY29udHJvbElkIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsImhhbmRsZVRhYmxlRGVsZXRlRW5hYmxlbWVudEZvclNpZGVFZmZlY3RzIiwib1RhYmxlIiwib0ludGVybmFsTW9kZWxDb250ZXh0Iiwic0RlbGV0YWJsZVBhdGgiLCJnZXREZWxldGFibGVQYXRoRm9yVGFibGUiLCJhU2VsZWN0ZWRDb250ZXh0cyIsImdldFNlbGVjdGVkQ29udGV4dHMiLCJhRGVsZXRhYmxlQ29udGV4dHMiLCJzZXRQcm9wZXJ0eSIsIm9TZWxlY3RlZENvbnRleHQiLCJ0YWJsZSIsImRlbGV0YWJsZVBhdGgiLCJyb3dCaW5kaW5nIiwiZ2V0Um93QmluZGluZyIsIm1ldGFNb2RlbCIsImdldE1ldGFNb2RlbCIsImNvbnRleHRQYXRoIiwiZ2V0Q29udGV4dCIsImdldE1ldGFQYXRoIiwibmF2aWdhdGlvblByb3BlcnR5UGF0aCIsInNldEhlYWRlckxhYmVsVmlzaWJpbGl0eSIsImRhdGFmaWVsZCIsImRhdGFGaWVsZENvbGxlY3Rpb24iLCJzb21lIiwib0RDIiwiZ2V0VmFsdWVPblJhdGluZ0ZpZWxkIiwib0NvbnRleHQiLCJjb250ZXh0Iiwic1BhdGhEYXRhRmllbGRzIiwiZ2V0VGV4dE9uQWN0aW9uRmllbGQiLCJhTXVsdGlwbGVMYWJlbHMiLCJyZWR1Y2UiLCJhIiwiYiIsInRvU3RyaW5nIiwiX2dldFJlc3BvbnNpdmVUYWJsZUNvbHVtblNldHRpbmdzIiwidGFibGVUeXBlIiwic2V0dGluZ3MiLCJtaWNyb0NoYXJ0U2l6ZSIsInNob3dNaWNyb0NoYXJ0TGFiZWwiLCJnZXREZWxlZ2F0ZSIsImJFbmFibGVBbmFseXRpY3MiLCJiSGFzTXVsdGlWaXN1YWxpemF0aW9ucyIsInNFbnRpdHlOYW1lIiwib0RlbGVnYXRlIiwibmFtZSIsInBheWxvYWQiLCJjb2xsZWN0aW9uTmFtZSIsInNldElCTkVuYWJsZW1lbnQiLCJvTmF2aWdhdGlvbkF2YWlsYWJsZU1hcCIsImJFbmFibGVkIiwiYUFwcGxpY2FibGUiLCJhTm90QXBwbGljYWJsZSIsInNQcm9wZXJ0eSIsInJlcXVpcmVzSUNvbnRleHQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlRhYmxlSGVscGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbkFubm90YXRpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvQ29tbW9uXCI7XG5pbXBvcnQgeyBQcmVzZW50YXRpb25WYXJpYW50VHlwZSwgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB7IGdldFVpQ29udHJvbCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IHsgVGVtcGxhdGVUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5pbXBvcnQgVGFibGVGb3JtYXR0ZXIgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVGFibGVGb3JtYXR0ZXJcIjtcbmltcG9ydCAqIGFzIEJpbmRpbmdUb29sa2l0IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgdHlwZSB7IEludGVybmFsTW9kZWxDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCBGRUxpYnJhcnkgZnJvbSBcInNhcC9mZS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCB0eXBlIHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGdldEVkaXRNb2RlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgQ29tbW9uSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IHsgZm9ybWF0VmFsdWVSZWN1cnNpdmVseSB9IGZyb20gXCJzYXAvZmUvbWFjcm9zL2ZpZWxkL0ZpZWxkVGVtcGxhdGluZ1wiO1xuaW1wb3J0IEFjdGlvbkhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9pbnRlcm5hbC9oZWxwZXJzL0FjdGlvbkhlbHBlclwiO1xuaW1wb3J0IFRhYmxlU2l6ZUhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9UYWJsZVNpemVIZWxwZXJcIjtcbmltcG9ydCB0eXBlIFRhYmxlIGZyb20gXCJzYXAvdWkvbWRjL1RhYmxlXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuXG5jb25zdCBDcmVhdGlvbk1vZGUgPSBGRUxpYnJhcnkuQ3JlYXRpb25Nb2RlO1xuLyoqXG4gKiBIZWxwZXIgY2xhc3MgdXNlZCBieSB0aGUgY29udHJvbCBsaWJyYXJ5IGZvciBPRGF0YS1zcGVjaWZpYyBoYW5kbGluZyAoT0RhdGEgVjQpXG4gKlxuICogQHByaXZhdGVcbiAqIEBleHBlcmltZW50YWwgVGhpcyBtb2R1bGUgaXMgb25seSBmb3IgaW50ZXJuYWwvZXhwZXJpbWVudGFsIHVzZSFcbiAqL1xuY29uc3QgVGFibGVIZWxwZXIgPSB7XG5cdC8qKlxuXHQgKiBDaGVjayBpZiBhIGdpdmVuIGFjdGlvbiBpcyBzdGF0aWMuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQWN0aW9uQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGFjdGlvblxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjdGlvblxuXHQgKiBAcmV0dXJucyBSZXR1cm5zICd0cnVlJyBpZiBhY3Rpb24gaXMgc3RhdGljLCBlbHNlICdmYWxzZSdcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRfaXNTdGF0aWNBY3Rpb246IGZ1bmN0aW9uIChvQWN0aW9uQ29udGV4dDogb2JqZWN0LCBzQWN0aW9uTmFtZTogc3RyaW5nIHwgU3RyaW5nKSB7XG5cdFx0bGV0IG9BY3Rpb247XG5cdFx0aWYgKG9BY3Rpb25Db250ZXh0KSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShvQWN0aW9uQ29udGV4dCkpIHtcblx0XHRcdFx0Y29uc3Qgc0VudGl0eVR5cGUgPSB0aGlzLl9nZXRBY3Rpb25PdmVybG9hZEVudGl0eVR5cGUoc0FjdGlvbk5hbWUpO1xuXHRcdFx0XHRpZiAoc0VudGl0eVR5cGUpIHtcblx0XHRcdFx0XHRvQWN0aW9uID0gb0FjdGlvbkNvbnRleHQuZmluZChmdW5jdGlvbiAoYWN0aW9uOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhY3Rpb24uJElzQm91bmQgJiYgYWN0aW9uLiRQYXJhbWV0ZXJbMF0uJFR5cGUgPT09IHNFbnRpdHlUeXBlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGlmIHRoaXMgaXMganVzdCBvbmUgLSBPSyB3ZSB0YWtlIGl0LiBJZiBpdCdzIG1vcmUgaXQncyBhY3R1YWxseSBhIHdyb25nIHVzYWdlIGJ5IHRoZSBhcHBcblx0XHRcdFx0XHQvLyBhcyB3ZSB1c2VkIHRoZSBmaXJzdCBvbmUgYWxsIHRoZSB0aW1lIHdlIGtlZXAgaXQgYXMgaXQgaXNcblx0XHRcdFx0XHRvQWN0aW9uID0gb0FjdGlvbkNvbnRleHRbMF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9BY3Rpb24gPSBvQWN0aW9uQ29udGV4dDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gISFvQWN0aW9uICYmIG9BY3Rpb24uJElzQm91bmQgJiYgb0FjdGlvbi4kUGFyYW1ldGVyWzBdLiRpc0NvbGxlY3Rpb247XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZW50aXR5IHR5cGUgb2YgYW4gYWN0aW9uIG92ZXJsb2FkLlxuXHQgKlxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjdGlvbi5cblx0ICogQHJldHVybnMgVGhlIGVudGl0eSB0eXBlIHVzZWQgaW4gdGhlIGFjdGlvbiBvdmVybG9hZC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRBY3Rpb25PdmVybG9hZEVudGl0eVR5cGU6IGZ1bmN0aW9uIChzQWN0aW9uTmFtZTogYW55KSB7XG5cdFx0aWYgKHNBY3Rpb25OYW1lICYmIHNBY3Rpb25OYW1lLmluZGV4T2YoXCIoXCIpID4gLTEpIHtcblx0XHRcdGNvbnN0IGFQYXJ0cyA9IHNBY3Rpb25OYW1lLnNwbGl0KFwiKFwiKTtcblx0XHRcdHJldHVybiBhUGFydHNbYVBhcnRzLmxlbmd0aCAtIDFdLnJlcGxhY2VBbGwoXCIpXCIsIFwiXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVja3Mgd2hldGhlciB0aGUgYWN0aW9uIGlzIG92ZXJsb2FkZWQgb24gYSBkaWZmZXJlbnQgZW50aXR5IHR5cGUuXG5cdCAqXG5cdCAqIEBwYXJhbSBzQWN0aW9uTmFtZSBUaGUgbmFtZSBvZiB0aGUgYWN0aW9uLlxuXHQgKiBAcGFyYW0gc0Fubm90YXRpb25UYXJnZXRFbnRpdHlUeXBlIFRoZSBlbnRpdHkgdHlwZSBvZiB0aGUgYW5ub3RhdGlvbiB0YXJnZXQuXG5cdCAqIEByZXR1cm5zIFJldHVybnMgJ3RydWUnIGlmIHRoZSBhY3Rpb24gaXMgb3ZlcmxvYWRlZCB3aXRoIGEgZGlmZmVyZW50IGVudGl0eSB0eXBlLCBlbHNlICdmYWxzZScuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaXNBY3Rpb25PdmVybG9hZE9uRGlmZmVyZW50VHlwZTogZnVuY3Rpb24gKHNBY3Rpb25OYW1lOiBhbnksIHNBbm5vdGF0aW9uVGFyZ2V0RW50aXR5VHlwZTogYW55KSB7XG5cdFx0Y29uc3Qgc0VudGl0eVR5cGUgPSB0aGlzLl9nZXRBY3Rpb25PdmVybG9hZEVudGl0eVR5cGUoc0FjdGlvbk5hbWUpO1xuXHRcdHJldHVybiAhIXNFbnRpdHlUeXBlICYmIHNBbm5vdGF0aW9uVGFyZ2V0RW50aXR5VHlwZSAhPT0gc0VudGl0eVR5cGU7XG5cdH0sXG5cblx0Z2V0TWVzc2FnZUZvckRyYWZ0VmFsaWRhdGlvbjogZnVuY3Rpb24gKG9UaGlzOiBhbnkpOiBzdHJpbmcge1xuXHRcdGNvbnN0IG9Db2xsZWN0aW9uQW5ub3RhdGlvbnMgPSBvVGhpcy5jb2xsZWN0aW9uLmdldE9iamVjdChcIi4vQFwiKTtcblx0XHRjb25zdCBzTWVzc2FnZVBhdGggPSBvQ29sbGVjdGlvbkFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NZXNzYWdlc1wiXT8uJFBhdGg7XG5cdFx0aWYgKFxuXHRcdFx0c01lc3NhZ2VQYXRoICYmXG5cdFx0XHRvVGhpcy50YWJsZURlZmluaXRpb24/LmdldFByb3BlcnR5KFwiL3RlbXBsYXRlXCIpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSAmJlxuXHRcdFx0ISFPYmplY3Qua2V5cyhvQ29sbGVjdGlvbkFubm90YXRpb25zKS5maW5kKChzS2V5KSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9Bbm5vdGF0aW9uID0gb0NvbGxlY3Rpb25Bbm5vdGF0aW9uc1tzS2V5XTtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRvQW5ub3RhdGlvbiAmJlxuXHRcdFx0XHRcdG9Bbm5vdGF0aW9uLiRUeXBlID09PSBDb21tb25Bbm5vdGF0aW9uVHlwZXMuU2lkZUVmZmVjdHNUeXBlICYmXG5cdFx0XHRcdFx0IW9Bbm5vdGF0aW9uLlNvdXJjZVByb3BlcnRpZXMgJiZcblx0XHRcdFx0XHQhb0Fubm90YXRpb24uU291cmNlRW50aXRpZXMgJiZcblx0XHRcdFx0XHRvQW5ub3RhdGlvbi5UYXJnZXRQcm9wZXJ0aWVzPy5pbmRleE9mKHNNZXNzYWdlUGF0aCkgPiAtMVxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHQpIHtcblx0XHRcdHJldHVybiBzTWVzc2FnZVBhdGg7XG5cdFx0fVxuXHRcdHJldHVybiBcIlwiO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBmaWVsZHMgbGlzdGVkIGJ5IHRoZSBwcm9wZXJ0eSBSZXF1ZXN0QXRMZWFzdCBpbiB0aGUgUHJlc2VudGF0aW9uVmFyaWFudCAuXG5cdCAqXG5cdCAqIEBwYXJhbSBvUHJlc2VudGF0aW9uVmFyaWFudCBUaGUgYW5ub3RhdGlvbiByZWxhdGVkIHRvIGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlByZXNlbnRhdGlvblZhcmlhbnQuXG5cdCAqIEByZXR1cm5zIFRoZSBmaWVsZHMuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0Z2V0RmllbGRzUmVxdWVzdGVkQnlQcmVzZW50YXRpb25WYXJpYW50OiBmdW5jdGlvbiAob1ByZXNlbnRhdGlvblZhcmlhbnQ6IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlKTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBvUHJlc2VudGF0aW9uVmFyaWFudC5SZXF1ZXN0QXRMZWFzdD8ubWFwKChvUmVxdWVzdGVkKSA9PiBvUmVxdWVzdGVkLnZhbHVlKSB8fCBbXTtcblx0fSxcblx0Z2V0TmF2aWdhdGlvbkF2YWlsYWJsZUZpZWxkc0Zyb21MaW5lSXRlbTogZnVuY3Rpb24gKGFMaW5lSXRlbUNvbnRleHQ6IENvbnRleHQpOiBzdHJpbmdbXSB7XG5cdFx0Y29uc3QgYVNlbGVjdGVkRmllbGRzQXJyYXk6IHN0cmluZ1tdID0gW107XG5cdFx0KChhTGluZUl0ZW1Db250ZXh0LmdldE9iamVjdCgpIGFzIEFycmF5PGFueT4pIHx8IFtdKS5mb3JFYWNoKGZ1bmN0aW9uIChvUmVjb3JkOiBhbnkpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0b1JlY29yZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIiAmJlxuXHRcdFx0XHQhb1JlY29yZC5JbmxpbmUgJiZcblx0XHRcdFx0IW9SZWNvcmQuRGV0ZXJtaW5pbmcgJiZcblx0XHRcdFx0b1JlY29yZC5OYXZpZ2F0aW9uQXZhaWxhYmxlPy4kUGF0aFxuXHRcdFx0KSB7XG5cdFx0XHRcdGFTZWxlY3RlZEZpZWxkc0FycmF5LnB1c2gob1JlY29yZC5OYXZpZ2F0aW9uQXZhaWxhYmxlLiRQYXRoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gYVNlbGVjdGVkRmllbGRzQXJyYXk7XG5cdH0sXG5cblx0Z2V0TmF2aWdhdGlvbkF2YWlsYWJsZU1hcDogZnVuY3Rpb24gKGFMaW5lSXRlbUNvbGxlY3Rpb246IGFueSkge1xuXHRcdGNvbnN0IG9JQk5OYXZpZ2F0aW9uQXZhaWxhYmxlTWFwOiBhbnkgPSB7fTtcblx0XHRhTGluZUl0ZW1Db2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKG9SZWNvcmQ6IGFueSkge1xuXHRcdFx0Y29uc3Qgc0tleSA9IGAke29SZWNvcmQuU2VtYW50aWNPYmplY3R9LSR7b1JlY29yZC5BY3Rpb259YDtcblx0XHRcdGlmIChcblx0XHRcdFx0b1JlY29yZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIiAmJlxuXHRcdFx0XHQhb1JlY29yZC5JbmxpbmUgJiZcblx0XHRcdFx0b1JlY29yZC5SZXF1aXJlc0NvbnRleHRcblx0XHRcdCkge1xuXHRcdFx0XHRpZiAob1JlY29yZC5OYXZpZ2F0aW9uQXZhaWxhYmxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvSUJOTmF2aWdhdGlvbkF2YWlsYWJsZU1hcFtzS2V5XSA9IG9SZWNvcmQuTmF2aWdhdGlvbkF2YWlsYWJsZS4kUGF0aFxuXHRcdFx0XHRcdFx0PyBvUmVjb3JkLk5hdmlnYXRpb25BdmFpbGFibGUuJFBhdGhcblx0XHRcdFx0XHRcdDogb1JlY29yZC5OYXZpZ2F0aW9uQXZhaWxhYmxlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KG9JQk5OYXZpZ2F0aW9uQXZhaWxhYmxlTWFwKTtcblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJuIHRoZSBjb250ZXh0IG9mIHRoZSBVSSBMaW5lIEl0ZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSBvUHJlc2VudGF0aW9uQ29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgcHJlc2VudGF0aW9uIChQcmVzZW50YXRpb24gdmFyaWFudCBvciBVSS5MaW5lSXRlbSlcblx0ICogQHJldHVybnMgVGhlIGNvbnRleHQgb2YgdGhlIFVJIExpbmUgSXRlbVxuXHQgKi9cblx0Z2V0VWlMaW5lSXRlbTogZnVuY3Rpb24gKG9QcmVzZW50YXRpb25Db250ZXh0OiBDb250ZXh0KSB7XG5cdFx0cmV0dXJuIGdldFVpQ29udHJvbChvUHJlc2VudGF0aW9uQ29udGV4dCwgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIik7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBzZWxlY3QgcXVlcnkgd2l0aCB0aGUgc2VsZWN0ZWQgZmllbGRzIGZyb20gdGhlIHBhcmFtZXRlcnMgdGhhdCB3ZXJlIHBhc3NlZC5cblx0ICpcblx0ICogQHBhcmFtIG9UaGlzIFRoZSBpbnN0YW5jZSBvZiB0aGUgaW5uZXIgbW9kZWwgb2YgdGhlIHRhYmxlIGJ1aWxkaW5nIGJsb2NrXG5cdCAqIEByZXR1cm5zIFRoZSAnc2VsZWN0JyBxdWVyeSB0aGF0IGhhcyB0aGUgc2VsZWN0ZWQgZmllbGRzIGZyb20gdGhlIHBhcmFtZXRlcnMgdGhhdCB3ZXJlIHBhc3NlZFxuXHQgKi9cblx0Y3JlYXRlJFNlbGVjdDogZnVuY3Rpb24gKG9UaGlzOiBhbnkpIHtcblx0XHRjb25zdCBvQ29sbGVjdGlvbkNvbnRleHQgPSBvVGhpcy5jb2xsZWN0aW9uO1xuXHRcdGNvbnN0IGFTZWxlY3RlZEZpZWxkczogYW55W10gPSBbXTtcblx0XHRjb25zdCBvTGluZUl0ZW1Db250ZXh0ID0gVGFibGVIZWxwZXIuZ2V0VWlMaW5lSXRlbShvVGhpcy5tZXRhUGF0aCk7XG5cdFx0Y29uc3Qgc1RhcmdldENvbGxlY3Rpb25QYXRoID0gQ29tbW9uSGVscGVyLmdldFRhcmdldENvbGxlY3Rpb24ob0NvbGxlY3Rpb25Db250ZXh0KTtcblxuXHRcdGZ1bmN0aW9uIHB1c2hGaWVsZChzRmllbGQ6IHN0cmluZykge1xuXHRcdFx0aWYgKHNGaWVsZCAmJiAhYVNlbGVjdGVkRmllbGRzLmluY2x1ZGVzKHNGaWVsZCkgJiYgc0ZpZWxkLmluZGV4T2YoXCIvXCIpICE9PSAwKSB7XG5cdFx0XHRcdC8vIERvIG5vdCBhZGQgc2luZ2xldG9uIHByb3BlcnR5ICh3aXRoIGFic29sdXRlIHBhdGgpIHRvICRzZWxlY3Rcblx0XHRcdFx0YVNlbGVjdGVkRmllbGRzLnB1c2goc0ZpZWxkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwdXNoRmllbGRMaXN0KGFGaWVsZHM6IHN0cmluZ1tdKSB7XG5cdFx0XHRpZiAoYUZpZWxkcyAmJiBhRmllbGRzLmxlbmd0aCkge1xuXHRcdFx0XHRhRmllbGRzLmZvckVhY2gocHVzaEZpZWxkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQhb1RoaXMudGFibGVEZWZpbml0aW9uLmdldE9iamVjdChcImVuYWJsZUFuYWx5dGljc1wiKSAmJlxuXHRcdFx0b0xpbmVJdGVtQ29udGV4dC5nZXRQYXRoKCkuaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiKSA+IC0xXG5cdFx0KSB7XG5cdFx0XHQvLyAkc2VsZWN0IGlzbid0IHN1cHBvcnRlZCBieSB0aGUgbW9kZWwgaW4gY2FzZSBvZiBhbiBhbmFseXRpY2FsIHF1ZXJ5XG5cdFx0XHQvLyBEb24ndCBwcm9jZXNzIEVudGl0eVR5cGUgd2l0aG91dCBMaW5lSXRlbSAoc2Vjb25kIGNvbmRpdGlvbiBvZiB0aGUgaWYpXG5cdFx0XHRjb25zdCBvUHJlc2VudGF0aW9uQW5ub3RhdGlvbiA9IGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvVGhpcy5tZXRhUGF0aCkudGFyZ2V0T2JqZWN0O1xuXHRcdFx0Y29uc3QgYU9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXMgPSAob1RoaXMudGFibGVEZWZpbml0aW9uLmdldE9iamVjdChcIm9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXNcIikgfHwgXCJcIikuc3BsaXQoXCIsXCIpO1xuXHRcdFx0Y29uc3QgYUFwcGxpY2FibGVQcm9wZXJ0aWVzID0gVGFibGVIZWxwZXIuX2ZpbHRlck5vbkFwcGxpY2FibGVQcm9wZXJ0aWVzKGFPcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzLCBvQ29sbGVjdGlvbkNvbnRleHQpO1xuXHRcdFx0Y29uc3QgYVNlbWFudGljS2V5czogc3RyaW5nW10gPSAoXG5cdFx0XHRcdG9Db2xsZWN0aW9uQ29udGV4dC5nZXRPYmplY3QoYCR7c1RhcmdldENvbGxlY3Rpb25QYXRofS9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlbWFudGljS2V5YCkgfHwgW11cblx0XHRcdCkubWFwKChvU2VtYW50aWNLZXk6IGFueSkgPT4gb1NlbWFudGljS2V5LiRQcm9wZXJ0eVBhdGggYXMgc3RyaW5nKTtcblxuXHRcdFx0aWYgKG9QcmVzZW50YXRpb25Bbm5vdGF0aW9uPy4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuUHJlc2VudGF0aW9uVmFyaWFudFR5cGUpIHtcblx0XHRcdFx0cHVzaEZpZWxkTGlzdChUYWJsZUhlbHBlci5nZXRGaWVsZHNSZXF1ZXN0ZWRCeVByZXNlbnRhdGlvblZhcmlhbnQob1ByZXNlbnRhdGlvbkFubm90YXRpb24pKTtcblx0XHRcdH1cblxuXHRcdFx0cHVzaEZpZWxkTGlzdChUYWJsZUhlbHBlci5nZXROYXZpZ2F0aW9uQXZhaWxhYmxlRmllbGRzRnJvbUxpbmVJdGVtKG9MaW5lSXRlbUNvbnRleHQpKTtcblx0XHRcdHB1c2hGaWVsZExpc3QoYUFwcGxpY2FibGVQcm9wZXJ0aWVzKTtcblx0XHRcdHB1c2hGaWVsZExpc3QoYVNlbWFudGljS2V5cyk7XG5cdFx0XHRwdXNoRmllbGQoVGFibGVIZWxwZXIuZ2V0TWVzc2FnZUZvckRyYWZ0VmFsaWRhdGlvbihvVGhpcykpO1xuXHRcdFx0cHVzaEZpZWxkKFxuXHRcdFx0XHRvQ29sbGVjdGlvbkNvbnRleHQuZ2V0T2JqZWN0KGAke3NUYXJnZXRDb2xsZWN0aW9uUGF0aH1AT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWxldGVSZXN0cmljdGlvbnNgKT8uRGVsZXRhYmxlPy4kUGF0aFxuXHRcdFx0KTtcblx0XHRcdHB1c2hGaWVsZChcblx0XHRcdFx0b0NvbGxlY3Rpb25Db250ZXh0LmdldE9iamVjdChgJHtzVGFyZ2V0Q29sbGVjdGlvblBhdGh9QE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVXBkYXRlUmVzdHJpY3Rpb25zYCk/LlVwZGF0YWJsZT8uJFBhdGhcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhU2VsZWN0ZWRGaWVsZHMuam9pbihcIixcIik7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2V0IGNvbHVtbidzIHdpZHRoIGlmIGRlZmluZWQgZnJvbSBtYW5pZmVzdC9jdXN0b21pc2F0aW9uIGJ5IGFubm90YXRpb25zLlxuXHQgKlxuXHQgKiBUaGVyZSBhcmUgaXNzdWVzIHdoZW4gdGhlIGNlbGwgaW4gdGhlIGNvbHVtbiBpcyBhIG1lYXN1cmUgYW5kIGhhcyBhIFVvTSBvciBjdXJyZW5jeSBhc3NvY2lhdGVkIHRvIGl0XG5cdCAqIEluIGVkaXQgbW9kZSB0aGlzIHJlc3VsdHMgaW4gdHdvIGZpZWxkcyBhbmQgdGhhdCBkb2Vzbid0IHdvcmsgdmVyeSB3ZWxsIGZvciB0aGUgY2VsbCBhbmQgdGhlIGZpZWxkcyBnZXQgY3V0LlxuXHQgKiBTbyB3ZSBhcmUgY3VycmVudGx5IGhhcmRjb2Rpbmcgd2lkdGggaW4gc2V2ZXJhbCBjYXNlcyBpbiBlZGl0IG1vZGUgd2hlcmUgdGhlcmUgYXJlIHByb2JsZW1zLlxuXHQgKlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0Q29sdW1uV2lkdGhcblx0ICogQHBhcmFtIG9UaGlzIFRoZSBpbnN0YW5jZSBvZiB0aGUgaW5uZXIgbW9kZWwgb2YgdGhlIHRhYmxlIGJ1aWxkaW5nIGJsb2NrXG5cdCAqIEBwYXJhbSBvQ29sdW1uIERlZmluZWQgd2lkdGggb2YgdGhlIGNvbHVtbiwgd2hpY2ggaXMgdGFrZW4gd2l0aCBwcmlvcml0eSBpZiBub3QgbnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5XG5cdCAqIEBwYXJhbSBvQW5ub3RhdGlvbnMgQW5ub3RhdGlvbnMgb2YgdGhlIGZpZWxkXG5cdCAqIEBwYXJhbSBzRGF0YUZpZWxkVHlwZSBUeXBlIG9mIHRoZSBmaWVsZFxuXHQgKiBAcGFyYW0gc0ZpZWxkQ29udHJvbCBGaWVsZCBjb250cm9sIHZhbHVlXG5cdCAqIEBwYXJhbSBzRGF0YVR5cGUgRGF0YXR5cGUgb2YgdGhlIGZpZWxkXG5cdCAqIEBwYXJhbSBuVGFyZ2V0VmFsdWVWaXN1YWxpemF0aW9uIE51bWJlciBmb3IgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiBUYXJnZXQgVmFsdWUgKHN0YXJzKVxuXHQgKiBAcGFyYW0gb0RhdGFGaWVsZCBEYXRhIEZpZWxkXG5cdCAqIEBwYXJhbSBzRGF0YUZpZWxkQWN0aW9uVGV4dCBEYXRhRmllbGQncyB0ZXh0IGZyb20gYnV0dG9uXG5cdCAqIEBwYXJhbSBvRGF0YU1vZGVsT2JqZWN0UGF0aCBUaGUgZGF0YSBtb2RlbCBvYmplY3QgcGF0aFxuXHQgKiBAcGFyYW0gb01pY3JvQ2hhcnRUaXRsZSBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgdGl0bGUgYW5kIGRlc2NyaXB0aW9uIG9mIHRoZSBNaWNyb0NoYXJ0XG5cdCAqIEByZXR1cm5zIC0gQ29sdW1uIHdpZHRoIGlmIGRlZmluZWQsIG90aGVyd2lzZSB3aWR0aCBpcyBzZXQgdG8gYXV0b1xuXHQgKi9cblx0Z2V0Q29sdW1uV2lkdGg6IGZ1bmN0aW9uIChcblx0XHRvVGhpczogYW55LFxuXHRcdG9Db2x1bW46IGFueSxcblx0XHRvQW5ub3RhdGlvbnM6IGFueSxcblx0XHRzRGF0YUZpZWxkVHlwZTogc3RyaW5nLFxuXHRcdHNGaWVsZENvbnRyb2w6IHN0cmluZyxcblx0XHRzRGF0YVR5cGU6IHN0cmluZyxcblx0XHRuVGFyZ2V0VmFsdWVWaXN1YWxpemF0aW9uOiBudW1iZXIsXG5cdFx0b0RhdGFGaWVsZDogYW55LFxuXHRcdHNEYXRhRmllbGRBY3Rpb25UZXh0OiBzdHJpbmcsXG5cdFx0b0RhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0b01pY3JvQ2hhcnRUaXRsZT86IGFueVxuXHQpIHtcblx0XHRsZXQgc1dpZHRoLFxuXHRcdFx0Ykhhc1RleHRBbm5vdGF0aW9uID0gZmFsc2U7XG5cdFx0aWYgKG9Db2x1bW4ud2lkdGgpIHtcblx0XHRcdHJldHVybiBvQ29sdW1uLndpZHRoO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRvRGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuVmFsdWUgJiZcblx0XHRcdGdldEVkaXRNb2RlKFxuXHRcdFx0XHRvRGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuVmFsdWUuJHRhcmdldCxcblx0XHRcdFx0b0RhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0b0RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0XG5cdFx0XHQpID09PSBcIkRpc3BsYXlcIlxuXHRcdCkge1xuXHRcdFx0Ykhhc1RleHRBbm5vdGF0aW9uID0gb0Fubm90YXRpb25zICYmIG9Bbm5vdGF0aW9ucy5oYXNPd25Qcm9wZXJ0eShcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiKTtcblx0XHRcdGlmIChcblx0XHRcdFx0c0RhdGFUeXBlID09PSBcIkVkbS5TdHJlYW1cIiAmJlxuXHRcdFx0XHQhYkhhc1RleHRBbm5vdGF0aW9uICYmXG5cdFx0XHRcdG9Bbm5vdGF0aW9ucy5oYXNPd25Qcm9wZXJ0eShcIkBPcmcuT0RhdGEuQ29yZS5WMS5NZWRpYVR5cGVcIikgJiZcblx0XHRcdFx0b0Fubm90YXRpb25zW1wiQE9yZy5PRGF0YS5Db3JlLlYxLk1lZGlhVHlwZVwiXS5pbmNsdWRlcyhcImltYWdlL1wiKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHNXaWR0aCA9IFwiN2VtXCI7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdG9Bbm5vdGF0aW9ucyAmJlxuXHRcdFx0KChvQW5ub3RhdGlvbnMuaGFzT3duUHJvcGVydHkoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSXNJbWFnZVVSTFwiKSAmJlxuXHRcdFx0XHRvQW5ub3RhdGlvbnMuaGFzT3duUHJvcGVydHkoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSXNJbWFnZVVSTFwiKSA9PT0gdHJ1ZSkgfHxcblx0XHRcdFx0KG9Bbm5vdGF0aW9ucy5oYXNPd25Qcm9wZXJ0eShcIkBPcmcuT0RhdGEuQ29yZS5WMS5NZWRpYVR5cGVcIikgJiZcblx0XHRcdFx0XHRvQW5ub3RhdGlvbnNbXCJAT3JnLk9EYXRhLkNvcmUuVjEuTWVkaWFUeXBlXCJdLmluY2x1ZGVzKFwiaW1hZ2UvXCIpKSlcblx0XHQpIHtcblx0XHRcdHNXaWR0aCA9IFwiN2VtXCI7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdHNEYXRhRmllbGRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiIHx8XG5cdFx0XHRzRGF0YUZpZWxkVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIiB8fFxuXHRcdFx0KHNEYXRhRmllbGRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFubm90YXRpb25cIiAmJlxuXHRcdFx0XHRvRGF0YUZpZWxkLlRhcmdldC4kQW5ub3RhdGlvblBhdGguaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwXCIpID09PSAtMSlcblx0XHQpIHtcblx0XHRcdGxldCBuVG1wVGV4dFdpZHRoLCBuVG1wVmlzdWFsaXphdGlvbldpZHRoO1xuXHRcdFx0Ly8gRm9yIEZpZWxkR3JvdXAgaGF2aW5nIGFjdGlvbiBidXR0b25zIG9yIHZpc3VhbGl6YXRpb24gZGF0YSBwb2ludHMgKGFzIHJhdGluZykgb24gY29sdW1uLlxuXHRcdFx0aWYgKHNEYXRhRmllbGRBY3Rpb25UZXh0ICYmIHNEYXRhRmllbGRBY3Rpb25UZXh0Lmxlbmd0aCA+PSBvRGF0YUZpZWxkLkxhYmVsLmxlbmd0aCkge1xuXHRcdFx0XHRuVG1wVGV4dFdpZHRoID0gVGFibGVTaXplSGVscGVyLmdldEJ1dHRvbldpZHRoKHNEYXRhRmllbGRBY3Rpb25UZXh0KTtcblx0XHRcdH0gZWxzZSBpZiAob0RhdGFGaWVsZCkge1xuXHRcdFx0XHRuVG1wVGV4dFdpZHRoID0gVGFibGVTaXplSGVscGVyLmdldEJ1dHRvbldpZHRoKG9EYXRhRmllbGQuTGFiZWwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0blRtcFRleHRXaWR0aCA9IFRhYmxlU2l6ZUhlbHBlci5nZXRCdXR0b25XaWR0aChvQW5ub3RhdGlvbnMuTGFiZWwpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5UYXJnZXRWYWx1ZVZpc3VhbGl6YXRpb24pIHtcblx0XHRcdFx0Ly9FYWNoIHJhdGluZyBzdGFyIGhhcyBhIHdpZHRoIG9mIDJlbVxuXHRcdFx0XHRuVG1wVmlzdWFsaXphdGlvbldpZHRoID0gblRhcmdldFZhbHVlVmlzdWFsaXphdGlvbiAqIDI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoblRtcFZpc3VhbGl6YXRpb25XaWR0aCAmJiAhaXNOYU4oblRtcFZpc3VhbGl6YXRpb25XaWR0aCkgJiYgblRtcFZpc3VhbGl6YXRpb25XaWR0aCA+IG5UbXBUZXh0V2lkdGgpIHtcblx0XHRcdFx0c1dpZHRoID0gYCR7blRtcFZpc3VhbGl6YXRpb25XaWR0aH1lbWA7XG5cdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRzRGF0YUZpZWxkQWN0aW9uVGV4dCB8fFxuXHRcdFx0XHQob0Fubm90YXRpb25zICYmXG5cdFx0XHRcdFx0KG9Bbm5vdGF0aW9ucy4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIiB8fFxuXHRcdFx0XHRcdFx0b0Fubm90YXRpb25zLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiKSlcblx0XHRcdCkge1xuXHRcdFx0XHQvLyBBZGQgYWRkaXRpb25hbCAyIGVtIHRvIGF2b2lkIHNob3dpbmcgZWxsaXBzaXMgaW4gc29tZSBjYXNlcy5cblx0XHRcdFx0blRtcFRleHRXaWR0aCArPSAyO1xuXHRcdFx0XHRzV2lkdGggPSBgJHtuVG1wVGV4dFdpZHRofWVtYDtcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0b0RhdGFGaWVsZD8uVGFyZ2V0Py4kQW5ub3RhdGlvblBhdGggJiZcblx0XHRcdFx0b0RhdGFGaWVsZC5UYXJnZXQuJEFubm90YXRpb25QYXRoLmluZGV4T2YoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIikgIT09IC0xXG5cdFx0XHQpIHtcblx0XHRcdFx0bGV0IGNoYXJ0U2l6ZTtcblx0XHRcdFx0c3dpdGNoICh0aGlzLmdldENoYXJ0U2l6ZShvVGhpcywgb0NvbHVtbikpIHtcblx0XHRcdFx0XHRjYXNlIFwiWFNcIjpcblx0XHRcdFx0XHRcdGNoYXJ0U2l6ZSA9IDU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiU1wiOlxuXHRcdFx0XHRcdFx0Y2hhcnRTaXplID0gNS4yO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIk1cIjpcblx0XHRcdFx0XHRcdGNoYXJ0U2l6ZSA9IDYuMztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJMXCI6XG5cdFx0XHRcdFx0XHRjaGFydFNpemUgPSA3Ljk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Y2hhcnRTaXplID0gNjtcblx0XHRcdFx0fVxuXHRcdFx0XHRuVG1wVGV4dFdpZHRoICs9IDI7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHQhdGhpcy5nZXRTaG93T25seUNoYXJ0KG9UaGlzLCBvQ29sdW1uKSAmJlxuXHRcdFx0XHRcdG9NaWNyb0NoYXJ0VGl0bGUgJiZcblx0XHRcdFx0XHQob01pY3JvQ2hhcnRUaXRsZS5UaXRsZS5sZW5ndGggfHwgb01pY3JvQ2hhcnRUaXRsZS5EZXNjcmlwdGlvbi5sZW5ndGgpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNvbnN0IHRtcFRleHQgPVxuXHRcdFx0XHRcdFx0b01pY3JvQ2hhcnRUaXRsZS5UaXRsZS5sZW5ndGggPiBvTWljcm9DaGFydFRpdGxlLkRlc2NyaXB0aW9uLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQ/IG9NaWNyb0NoYXJ0VGl0bGUuVGl0bGVcblx0XHRcdFx0XHRcdFx0OiBvTWljcm9DaGFydFRpdGxlLkRlc2NyaXB0aW9uO1xuXHRcdFx0XHRcdGNvbnN0IHRpdGxlU2l6ZSA9IFRhYmxlU2l6ZUhlbHBlci5nZXRCdXR0b25XaWR0aCh0bXBUZXh0KSArIDc7XG5cdFx0XHRcdFx0Y29uc3QgdG1wV2lkdGggPSB0aXRsZVNpemUgPiBuVG1wVGV4dFdpZHRoID8gdGl0bGVTaXplIDogblRtcFRleHRXaWR0aDtcblx0XHRcdFx0XHRzV2lkdGggPSBgJHt0bXBXaWR0aH1lbWA7XG5cdFx0XHRcdH0gZWxzZSBpZiAoblRtcFRleHRXaWR0aCA+IGNoYXJ0U2l6ZSkge1xuXHRcdFx0XHRcdHNXaWR0aCA9IGAke25UbXBUZXh0V2lkdGh9ZW1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNXaWR0aCA9IGAke2NoYXJ0U2l6ZX1lbWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHNXaWR0aCkge1xuXHRcdFx0cmV0dXJuIHNXaWR0aDtcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gYWRkIGEgbWFyZ2luIGNsYXNzIGF0IHRoZSBjb250cm9sLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0TWFyZ2luQ2xhc3Ncblx0ICogQHBhcmFtIG9Db2xsZWN0aW9uIFRpdGxlIG9mIHRoZSBEYXRhUG9pbnRcblx0ICogQHBhcmFtIG9EYXRhRmllbGQgVmFsdWUgb2YgdGhlIERhdGFQb2ludFxuXHQgKiBAcGFyYW0gc1Zpc3VhbGl6YXRpb25cblx0ICogQHBhcmFtIHNGaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMgSGlkZGVuIGV4cHJlc3Npb24gY29udGFpbmVkIGluIEZpZWxkR3JvdXBcblx0ICogQHJldHVybnMgQWRqdXN0aW5nIHRoZSBtYXJnaW5cblx0ICovXG5cdGdldE1hcmdpbkNsYXNzOiBmdW5jdGlvbiAob0NvbGxlY3Rpb246IGFueSwgb0RhdGFGaWVsZDogYW55LCBzVmlzdWFsaXphdGlvbjogYW55LCBzRmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zOiBhbnkpIHtcblx0XHRsZXQgc0JpbmRpbmdFeHByZXNzaW9uLFxuXHRcdFx0c0NsYXNzID0gXCJcIjtcblx0XHRpZiAoSlNPTi5zdHJpbmdpZnkob0NvbGxlY3Rpb25bb0NvbGxlY3Rpb24ubGVuZ3RoIC0gMV0pID09IEpTT04uc3RyaW5naWZ5KG9EYXRhRmllbGQpKSB7XG5cdFx0XHQvL0lmIHJhdGluZyBpbmRpY2F0b3IgaXMgbGFzdCBlbGVtZW50IGluIGZpZWxkZ3JvdXAsIHRoZW4gdGhlIDAuNXJlbSBtYXJnaW4gYWRkZWQgYnkgc2FwTVJJIGNsYXNzIG9mIGludGVyYWN0aXZlIHJhdGluZyBpbmRpY2F0b3Igb24gdG9wIGFuZCBib3R0b20gbXVzdCBiZSBudWxsaWZpZWQuXG5cdFx0XHRpZiAoc1Zpc3VhbGl6YXRpb24gPT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5WaXN1YWxpemF0aW9uVHlwZS9SYXRpbmdcIikge1xuXHRcdFx0XHRzQ2xhc3MgPSBcInNhcFVpTm9NYXJnaW5Cb3R0b20gc2FwVWlOb01hcmdpblRvcFwiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoc1Zpc3VhbGl6YXRpb24gPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVmlzdWFsaXphdGlvblR5cGUvUmF0aW5nXCIpIHtcblx0XHRcdC8vSWYgcmF0aW5nIGluZGljYXRvciBpcyBOT1QgdGhlIGxhc3QgZWxlbWVudCBpbiBmaWVsZGdyb3VwLCB0aGVuIHRvIG1haW50YWluIHRoZSAwLjVyZW0gc3BhY2luZyBiZXR3ZWVuIGNvZ2V0TWFyZ2luQ2xhc3NudHJvbHMgKGFzIHBlciBVWCBzcGVjKSxcblx0XHRcdC8vb25seSB0aGUgdG9wIG1hcmdpbiBhZGRlZCBieSBzYXBNUkkgY2xhc3Mgb2YgaW50ZXJhY3RpdmUgcmF0aW5nIGluZGljYXRvciBtdXN0IGJlIG51bGxpZmllZC5cblxuXHRcdFx0c0NsYXNzID0gXCJzYXBVaU5vTWFyZ2luVG9wXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNDbGFzcyA9IFwic2FwVWlUaW55TWFyZ2luQm90dG9tXCI7XG5cdFx0fVxuXG5cdFx0aWYgKHNGaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMgJiYgc0ZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucyAhPT0gXCJ0cnVlXCIgJiYgc0ZpZWxkR3JvdXBIaWRkZW5FeHByZXNzaW9ucyAhPT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRjb25zdCBzSGlkZGVuRXhwcmVzc2lvblJlc3VsdCA9IHNGaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMuc3Vic3RyaW5nKFxuXHRcdFx0XHRzRmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zLmluZGV4T2YoXCJ7PVwiKSArIDIsXG5cdFx0XHRcdHNGaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnMubGFzdEluZGV4T2YoXCJ9XCIpXG5cdFx0XHQpO1xuXHRcdFx0c0JpbmRpbmdFeHByZXNzaW9uID0gXCJ7PSBcIiArIHNIaWRkZW5FeHByZXNzaW9uUmVzdWx0ICsgXCIgPyAnXCIgKyBzQ2xhc3MgKyBcIicgOiBcIiArIFwiJydcIiArIFwiIH1cIjtcblx0XHRcdHJldHVybiBzQmluZGluZ0V4cHJlc3Npb247XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBzQ2xhc3M7XG5cdFx0fVxuXHR9LFxuXG5cdGdldFZCb3hWaXNpYmlsaXR5OiBmdW5jdGlvbiAob0NvbGxlY3Rpb246IGFueVtdLCBmaWVsZEdyb3VwSGlkZGVuRXhwcmVzc2lvbnM6IGFueSkge1xuXHRcdGxldCBiQWxsU3RhdGljID0gdHJ1ZTtcblx0XHRsZXQgYkR5bmFtaWNFeHByZXNzaW9uc0luRmllbGRzID0gZmFsc2U7XG5cdFx0Y29uc3QgYUhpZGRlblBhdGhzID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvQ29sbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgaGlkZGVuQW5ub3RhdGlvblZhbHVlID0gb0NvbGxlY3Rpb25baV1bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuXCJdO1xuXHRcdFx0aWYgKGhpZGRlbkFubm90YXRpb25WYWx1ZSAhPT0gdW5kZWZpbmVkICYmIGhpZGRlbkFubm90YXRpb25WYWx1ZSAhPT0gZmFsc2UpIHtcblx0XHRcdFx0aWYgKGhpZGRlbkFubm90YXRpb25WYWx1ZSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGlmIChoaWRkZW5Bbm5vdGF0aW9uVmFsdWUuJFBhdGgpIHtcblx0XHRcdFx0XHRcdGFIaWRkZW5QYXRocy5wdXNoKGhpZGRlbkFubm90YXRpb25WYWx1ZS4kUGF0aCk7XG5cdFx0XHRcdFx0XHRiQWxsU3RhdGljID0gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgaGlkZGVuQW5ub3RhdGlvblZhbHVlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHQvLyBEeW5hbWljIGV4cHJlc3Npb24gZm91bmQgaW4gYSBmaWVsZFxuXHRcdFx0XHRcdFx0YkR5bmFtaWNFeHByZXNzaW9uc0luRmllbGRzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhSGlkZGVuUGF0aHMucHVzaChoaWRkZW5Bbm5vdGF0aW9uVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhSGlkZGVuUGF0aHMucHVzaChmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghYkR5bmFtaWNFeHByZXNzaW9uc0luRmllbGRzICYmIGFIaWRkZW5QYXRocy5sZW5ndGggPiAwICYmIGJBbGxTdGF0aWMgIT09IHRydWUpIHtcblx0XHRcdGNvbnN0IHBhcmFtcyA9IGFIaWRkZW5QYXRocy5tYXAoKGhpZGRlblBhdGgpID0+IHtcblx0XHRcdFx0aWYgKHR5cGVvZiBoaWRkZW5QYXRoID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0XHRcdHJldHVybiBoaWRkZW5QYXRoO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBCaW5kaW5nVG9vbGtpdC5wYXRoSW5Nb2RlbChoaWRkZW5QYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBCaW5kaW5nVG9vbGtpdC5jb21waWxlRXhwcmVzc2lvbihCaW5kaW5nVG9vbGtpdC5mb3JtYXRSZXN1bHQocGFyYW1zLCBUYWJsZUZvcm1hdHRlci5nZXRWQm94VmlzaWJpbGl0eSkpO1xuXHRcdH0gZWxzZSBpZiAoYkR5bmFtaWNFeHByZXNzaW9uc0luRmllbGRzKSB7XG5cdFx0XHRyZXR1cm4gZmllbGRHcm91cEhpZGRlbkV4cHJlc3Npb25zO1xuXHRcdH0gZWxzZSBpZiAoYUhpZGRlblBhdGhzLmxlbmd0aCA+IDAgJiYgYUhpZGRlblBhdGhzLmluZGV4T2YoZmFsc2UpID09PSAtMSAmJiBiQWxsU3RhdGljKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIHByb3ZpZGUgaGlkZGVuIGZpbHRlcnMgdG8gdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZm9ybWF0SGlkZGVuRmlsdGVyc1xuXHQgKiBAcGFyYW0gb0hpZGRlbkZpbHRlciBUaGUgaGlkZGVuRmlsdGVycyB2aWEgY29udGV4dCBuYW1lZCBmaWx0ZXJzIChhbmQga2V5IGhpZGRlbkZpbHRlcnMpIHBhc3NlZCB0byBNYWNybyBUYWJsZVxuXHQgKiBAcmV0dXJucyBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBoaWRkZW4gZmlsdGVyc1xuXHQgKi9cblx0Zm9ybWF0SGlkZGVuRmlsdGVyczogZnVuY3Rpb24gKG9IaWRkZW5GaWx0ZXI6IHN0cmluZykge1xuXHRcdGlmIChvSGlkZGVuRmlsdGVyKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkob0hpZGRlbkZpbHRlcik7XG5cdFx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2V0IHRoZSBzdGFibGUgSUQgb2YgdGhlIGNvbHVtbi5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGdldENvbHVtblN0YWJsZUlkXG5cdCAqIEBwYXJhbSBzSWQgQ3VycmVudCBvYmplY3QgSURcblx0ICogQHBhcmFtIG9EYXRhRmllbGQgVmFsdWUgb2YgdGhlIERhdGFQb2ludFxuXHQgKiBAcmV0dXJucyBUaGUgc3RhYmxlIElEIGZvciBhIGdpdmVuIGNvbHVtblxuXHQgKi9cblx0Z2V0Q29sdW1uU3RhYmxlSWQ6IGZ1bmN0aW9uIChzSWQ6IHN0cmluZywgb0RhdGFGaWVsZDogYW55KSB7XG5cdFx0cmV0dXJuIHNJZFxuXHRcdFx0PyBnZW5lcmF0ZShbXG5cdFx0XHRcdFx0c0lkLFxuXHRcdFx0XHRcdFwiQ1wiLFxuXHRcdFx0XHRcdChvRGF0YUZpZWxkLlRhcmdldCAmJiBvRGF0YUZpZWxkLlRhcmdldC4kQW5ub3RhdGlvblBhdGgpIHx8XG5cdFx0XHRcdFx0XHQob0RhdGFGaWVsZC5WYWx1ZSAmJiBvRGF0YUZpZWxkLlZhbHVlLiRQYXRoKSB8fFxuXHRcdFx0XHRcdFx0KG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCIgfHxcblx0XHRcdFx0XHRcdG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCJcblx0XHRcdFx0XHRcdFx0PyBvRGF0YUZpZWxkXG5cdFx0XHRcdFx0XHRcdDogXCJcIilcblx0XHRcdCAgXSlcblx0XHRcdDogdW5kZWZpbmVkO1xuXHR9LFxuXG5cdGdldEZpZWxkR3JvdXBMYWJlbFN0YWJsZUlkOiBmdW5jdGlvbiAoc0lkOiBzdHJpbmcsIG9EYXRhRmllbGQ6IGFueSkge1xuXHRcdHJldHVybiBzSWRcblx0XHRcdD8gZ2VuZXJhdGUoW1xuXHRcdFx0XHRcdHNJZCxcblx0XHRcdFx0XHRcIkZHTGFiZWxcIixcblx0XHRcdFx0XHQob0RhdGFGaWVsZC5UYXJnZXQgJiYgb0RhdGFGaWVsZC5UYXJnZXQuJEFubm90YXRpb25QYXRoKSB8fFxuXHRcdFx0XHRcdFx0KG9EYXRhRmllbGQuVmFsdWUgJiYgb0RhdGFGaWVsZC5WYWx1ZS4kUGF0aCkgfHxcblx0XHRcdFx0XHRcdChvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiIHx8XG5cdFx0XHRcdFx0XHRvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiXG5cdFx0XHRcdFx0XHRcdD8gb0RhdGFGaWVsZFxuXHRcdFx0XHRcdFx0XHQ6IFwiXCIpXG5cdFx0XHQgIF0pXG5cdFx0XHQ6IHVuZGVmaW5lZDtcblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIGZpbHRlcnMgb3V0IHByb3BlcnRpZXMgd2hpY2ggZG8gbm90IGJlbG9uZyB0byB0aGUgY29sbGVjdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIGFQcm9wZXJ0eVBhdGhzIFRoZSBhcnJheSBvZiBwcm9wZXJ0aWVzIHRvIGJlIGNoZWNrZWQuXG5cdCAqIEBwYXJhbSBvQ29sbGVjdGlvbkNvbnRleHQgVGhlIGNvbGxlY3Rpb24gY29udGV4dCB0byBiZSB1c2VkLlxuXHQgKiBAcmV0dXJucyBUaGUgYXJyYXkgb2YgYXBwbGljYWJsZSBwcm9wZXJ0aWVzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2ZpbHRlck5vbkFwcGxpY2FibGVQcm9wZXJ0aWVzOiBmdW5jdGlvbiAoYVByb3BlcnR5UGF0aHM6IGFueVtdLCBvQ29sbGVjdGlvbkNvbnRleHQ6IENvbnRleHQpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0YVByb3BlcnR5UGF0aHMgJiZcblx0XHRcdGFQcm9wZXJ0eVBhdGhzLmZpbHRlcihmdW5jdGlvbiAoc1Byb3BlcnR5UGF0aDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvQ29sbGVjdGlvbkNvbnRleHQuZ2V0T2JqZWN0KGAuLyR7c1Byb3BlcnR5UGF0aH1gKTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZW5lcmF0ZSB0aGUgYmluZGluZyBpbmZvcm1hdGlvbiBmb3IgYSB0YWJsZSByb3cuXG5cdCAqXG5cdCAqIEBwYXJhbSBvVGhpcyBUaGUgaW5zdGFuY2Ugb2YgdGhlIGlubmVyIG1vZGVsIG9mIHRoZSB0YWJsZSBidWlsZGluZyBibG9ja1xuXHQgKiBAcmV0dXJucyAtIFJldHVybnMgdGhlIGJpbmRpbmcgaW5mb3JtYXRpb24gb2YgYSB0YWJsZSByb3dcblx0ICovXG5cdGdldFJvd3NCaW5kaW5nSW5mbzogZnVuY3Rpb24gKG9UaGlzOiBhbnkpIHtcblx0XHRjb25zdCBvQ29sbGVjdGlvbiA9IG9UaGlzLmNvbGxlY3Rpb247XG5cdFx0Y29uc3Qgb1Jvd0JpbmRpbmcgPSB7XG5cdFx0XHR1aTVvYmplY3Q6IHRydWUsXG5cdFx0XHRzdXNwZW5kZWQ6IGZhbHNlLFxuXHRcdFx0cGF0aDogQ29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3Rlcyhcblx0XHRcdFx0KG9Db2xsZWN0aW9uLmdldE9iamVjdChcIiRraW5kXCIpID09PSBcIkVudGl0eVNldFwiID8gXCIvXCIgOiBcIlwiKSArIChvVGhpcy5uYXZpZ2F0aW9uUGF0aCB8fCBvQ29sbGVjdGlvbi5nZXRPYmplY3QoXCJAc2FwdWkubmFtZVwiKSlcblx0XHRcdCksXG5cdFx0XHRwYXJhbWV0ZXJzOiB7XG5cdFx0XHRcdCRjb3VudDogdHJ1ZVxuXHRcdFx0fSBhcyBhbnksXG5cdFx0XHRldmVudHM6IHt9IGFzIGFueVxuXHRcdH07XG5cblx0XHRpZiAoIW9UaGlzLnRhYmxlRGVmaW5pdGlvbi5nZXRPYmplY3QoXCJlbmFibGVBbmFseXRpY3NcIikpIHtcblx0XHRcdC8vIERvbid0IGFkZCAkc2VsZWN0IHBhcmFtZXRlciBpbiBjYXNlIG9mIGFuIGFuYWx5dGljYWwgcXVlcnksIHRoaXMgaXNuJ3Qgc3VwcG9ydGVkIGJ5IHRoZSBtb2RlbFxuXHRcdFx0Y29uc3Qgc1NlbGVjdCA9IFRhYmxlSGVscGVyLmNyZWF0ZSRTZWxlY3Qob1RoaXMpO1xuXHRcdFx0aWYgKHNTZWxlY3QpIHtcblx0XHRcdFx0b1Jvd0JpbmRpbmcucGFyYW1ldGVycy4kc2VsZWN0ID0gYCcke3NTZWxlY3R9J2A7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdlIGxhdGVyIGVuc3VyZSBpbiB0aGUgZGVsZWdhdGUgb25seSBvbmUgbGlzdCBiaW5kaW5nIGZvciBhIGdpdmVuIHRhcmdldENvbGxlY3Rpb25QYXRoIGhhcyB0aGUgZmxhZyAkJGdldEtlZXBBbGl2ZUNvbnRleHRcblx0XHRcdG9Sb3dCaW5kaW5nLnBhcmFtZXRlcnMuJCRnZXRLZWVwQWxpdmVDb250ZXh0ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRvUm93QmluZGluZy5wYXJhbWV0ZXJzLiQkZ3JvdXBJZCA9IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMoXCIkYXV0by5Xb3JrZXJzXCIpO1xuXHRcdG9Sb3dCaW5kaW5nLnBhcmFtZXRlcnMuJCR1cGRhdGVHcm91cElkID0gQ29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3RlcyhcIiRhdXRvXCIpO1xuXHRcdG9Sb3dCaW5kaW5nLnBhcmFtZXRlcnMuJCRvd25SZXF1ZXN0ID0gdHJ1ZTtcblx0XHRvUm93QmluZGluZy5wYXJhbWV0ZXJzLiQkcGF0Y2hXaXRob3V0U2lkZUVmZmVjdHMgPSB0cnVlO1xuXG5cdFx0b1Jvd0JpbmRpbmcuZXZlbnRzLnBhdGNoU2VudCA9IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMoXCIuZWRpdEZsb3cuaGFuZGxlUGF0Y2hTZW50XCIpO1xuXHRcdG9Sb3dCaW5kaW5nLmV2ZW50cy5kYXRhUmVjZWl2ZWQgPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKFwiQVBJLm9uSW50ZXJuYWxEYXRhUmVjZWl2ZWRcIik7XG5cdFx0b1Jvd0JpbmRpbmcuZXZlbnRzLmRhdGFSZXF1ZXN0ZWQgPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKFwiQVBJLm9uSW50ZXJuYWxEYXRhUmVxdWVzdGVkXCIpO1xuXHRcdC8vIHJlY3JlYXRlIGFuIGVtcHR5IHJvdyB3aGVuIG9uZSBpcyBhY3RpdmF0ZWRcblx0XHRvUm93QmluZGluZy5ldmVudHMuY3JlYXRlQWN0aXZhdGUgPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKFwiLmVkaXRGbG93LmhhbmRsZUNyZWF0ZUFjdGl2YXRlXCIpO1xuXG5cdFx0aWYgKG9UaGlzLm9uQ29udGV4dENoYW5nZSAhPT0gdW5kZWZpbmVkICYmIG9UaGlzLm9uQ29udGV4dENoYW5nZSAhPT0gbnVsbCkge1xuXHRcdFx0b1Jvd0JpbmRpbmcuZXZlbnRzLmNoYW5nZSA9IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMob1RoaXMub25Db250ZXh0Q2hhbmdlKTtcblx0XHR9XG5cdFx0cmV0dXJuIENvbW1vbkhlbHBlci5vYmplY3RUb1N0cmluZyhvUm93QmluZGluZyk7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gY2hlY2sgdGhlIHZhbGlkaXR5IG9mIHRoZSBmaWVsZHMgaW4gdGhlIGNyZWF0aW9uIHJvdy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHZhbGlkYXRlQ3JlYXRpb25Sb3dGaWVsZHNcblx0ICogQHBhcmFtIG9GaWVsZFZhbGlkaXR5T2JqZWN0IEN1cnJlbnQgT2JqZWN0IGhvbGRpbmcgdGhlIGZpZWxkc1xuXHQgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYWxsIHRoZSBmaWVsZHMgaW4gdGhlIGNyZWF0aW9uIHJvdyBhcmUgdmFsaWQsIGBmYWxzZWAgb3RoZXJ3aXNlXG5cdCAqL1xuXHR2YWxpZGF0ZUNyZWF0aW9uUm93RmllbGRzOiBmdW5jdGlvbiAob0ZpZWxkVmFsaWRpdHlPYmplY3Q6IGFueSkge1xuXHRcdGlmICghb0ZpZWxkVmFsaWRpdHlPYmplY3QpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRcdE9iamVjdC5rZXlzKG9GaWVsZFZhbGlkaXR5T2JqZWN0KS5sZW5ndGggPiAwICYmXG5cdFx0XHRPYmplY3Qua2V5cyhvRmllbGRWYWxpZGl0eU9iamVjdCkuZXZlcnkoZnVuY3Rpb24gKGtleTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBvRmllbGRWYWxpZGl0eU9iamVjdFtrZXldW1widmFsaWRpdHlcIl07XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2V0IHRoZSBleHByZXNzaW9uIGZvciB0aGUgJ3ByZXNzJyBldmVudCBmb3IgdGhlIERhdGFGaWVsZEZvckFjdGlvbkJ1dHRvbi5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHByZXNzRXZlbnREYXRhRmllbGRGb3JBY3Rpb25CdXR0b25cblx0ICogQHBhcmFtIG9UaGlzIEN1cnJlbnQgb2JqZWN0XG5cdCAqIEBwYXJhbSBvRGF0YUZpZWxkIFZhbHVlIG9mIHRoZSBEYXRhUG9pbnRcblx0ICogQHBhcmFtIHNFbnRpdHlTZXROYW1lIE5hbWUgb2YgdGhlIEVudGl0eVNldFxuXHQgKiBAcGFyYW0gc09wZXJhdGlvbkF2YWlsYWJsZU1hcCBPcGVyYXRpb25BdmFpbGFibGVNYXAgYXMgc3RyaW5naWZpZWQgSlNPTiBvYmplY3Rcblx0ICogQHBhcmFtIG9BY3Rpb25Db250ZXh0IEFjdGlvbiBvYmplY3Rcblx0ICogQHBhcmFtIGJJc05hdmlnYWJsZSBBY3Rpb24gZWl0aGVyIHRyaWdnZXJzIG5hdmlnYXRpb24gb3Igbm90XG5cdCAqIEBwYXJhbSBiRW5hYmxlQXV0b1Njcm9sbCBBY3Rpb24gZWl0aGVyIHRyaWdnZXJzIHNjcm9sbGluZyB0byB0aGUgbmV3bHkgY3JlYXRlZCBpdGVtcyBpbiB0aGUgcmVsYXRlZCB0YWJsZSBvciBub3Rcblx0ICogQHBhcmFtIHNEZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24gRnVuY3Rpb24gbmFtZSB0byBwcmVmaWxsIGRpYWxvZyBwYXJhbWV0ZXJzXG5cdCAqIEByZXR1cm5zIFRoZSBiaW5kaW5nIGV4cHJlc3Npb25cblx0ICovXG5cdHByZXNzRXZlbnREYXRhRmllbGRGb3JBY3Rpb25CdXR0b246IGZ1bmN0aW9uIChcblx0XHRvVGhpczogYW55LFxuXHRcdG9EYXRhRmllbGQ6IGFueSxcblx0XHRzRW50aXR5U2V0TmFtZTogc3RyaW5nLFxuXHRcdHNPcGVyYXRpb25BdmFpbGFibGVNYXA6IHN0cmluZyxcblx0XHRvQWN0aW9uQ29udGV4dDogb2JqZWN0LFxuXHRcdGJJc05hdmlnYWJsZTogYW55LFxuXHRcdGJFbmFibGVBdXRvU2Nyb2xsOiBhbnksXG5cdFx0c0RlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbjogc3RyaW5nXG5cdCkge1xuXHRcdGNvbnN0IHNBY3Rpb25OYW1lID0gb0RhdGFGaWVsZC5BY3Rpb24sXG5cdFx0XHRzQW5ub3RhdGlvblRhcmdldEVudGl0eVR5cGUgPSBvVGhpcyAmJiBvVGhpcy5jb2xsZWN0aW9uLmdldE9iamVjdChcIiRUeXBlXCIpLFxuXHRcdFx0YlN0YXRpY0FjdGlvbiA9XG5cdFx0XHRcdHRoaXMuX2lzU3RhdGljQWN0aW9uKG9BY3Rpb25Db250ZXh0LCBzQWN0aW9uTmFtZSkgfHxcblx0XHRcdFx0dGhpcy5faXNBY3Rpb25PdmVybG9hZE9uRGlmZmVyZW50VHlwZShzQWN0aW9uTmFtZSwgc0Fubm90YXRpb25UYXJnZXRFbnRpdHlUeXBlKSxcblx0XHRcdG9QYXJhbXMgPSB7XG5cdFx0XHRcdGNvbnRleHRzOiAhYlN0YXRpY0FjdGlvbiA/IFwiJHtpbnRlcm5hbD5zZWxlY3RlZENvbnRleHRzfVwiIDogbnVsbCxcblx0XHRcdFx0YlN0YXRpY0FjdGlvbjogYlN0YXRpY0FjdGlvbiA/IGJTdGF0aWNBY3Rpb24gOiB1bmRlZmluZWQsXG5cdFx0XHRcdGVudGl0eVNldE5hbWU6IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMoc0VudGl0eVNldE5hbWUpLFxuXHRcdFx0XHRhcHBsaWNhYmxlQ29udGV4dDogIWJTdGF0aWNBY3Rpb24gPyBcIiR7aW50ZXJuYWw+ZHluYW1pY0FjdGlvbnMvXCIgKyBvRGF0YUZpZWxkLkFjdGlvbiArIFwiL2FBcHBsaWNhYmxlL31cIiA6IG51bGwsXG5cdFx0XHRcdG5vdEFwcGxpY2FibGVDb250ZXh0OiAhYlN0YXRpY0FjdGlvbiA/IFwiJHtpbnRlcm5hbD5keW5hbWljQWN0aW9ucy9cIiArIG9EYXRhRmllbGQuQWN0aW9uICsgXCIvYU5vdEFwcGxpY2FibGUvfVwiIDogbnVsbCxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IGJJc05hdmlnYWJsZSxcblx0XHRcdFx0ZW5hYmxlQXV0b1Njcm9sbDogYkVuYWJsZUF1dG9TY3JvbGwsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbjogc0RlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbiA/IFwiJ1wiICsgc0RlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbiArIFwiJ1wiIDogdW5kZWZpbmVkXG5cdFx0XHR9O1xuXG5cdFx0cmV0dXJuIEFjdGlvbkhlbHBlci5nZXRQcmVzc0V2ZW50RGF0YUZpZWxkRm9yQWN0aW9uQnV0dG9uKG9UaGlzLmlkLCBvRGF0YUZpZWxkLCBvUGFyYW1zLCBzT3BlcmF0aW9uQXZhaWxhYmxlTWFwKTtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBkZXRlcm1pbmUgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgJ2VuYWJsZWQnIHByb3BlcnR5IG9mIERhdGFGaWVsZEZvckFjdGlvbiBhbmQgRGF0YUZpZWxkRm9ySUJOIGFjdGlvbnMuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBpc0RhdGFGaWVsZEZvckFjdGlvbkVuYWJsZWRcblx0ICogQHBhcmFtIG9UaGlzIFRoZSBpbnN0YW5jZSBvZiB0aGUgdGFibGUgY29udHJvbFxuXHQgKiBAcGFyYW0gb0RhdGFGaWVsZCBUaGUgdmFsdWUgb2YgdGhlIGRhdGEgZmllbGRcblx0ICogQHBhcmFtIG9SZXF1aXJlc0NvbnRleHQgUmVxdWlyZXNDb250ZXh0IGZvciBJQk5cblx0ICogQHBhcmFtIGJJc0RhdGFGaWVsZEZvcklCTiBGbGFnIGZvciBJQk5cblx0ICogQHBhcmFtIG9BY3Rpb25Db250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgYWN0aW9uXG5cdCAqIEBwYXJhbSB2QWN0aW9uRW5hYmxlZCBTdGF0dXMgb2YgYWN0aW9uIChzaW5nbGUgb3IgbXVsdGlzZWxlY3QpXG5cdCAqIEByZXR1cm5zIEEgYmluZGluZyBleHByZXNzaW9uIHRvIGRlZmluZSB0aGUgJ2VuYWJsZWQnIHByb3BlcnR5IG9mIHRoZSBhY3Rpb25cblx0ICovXG5cdGlzRGF0YUZpZWxkRm9yQWN0aW9uRW5hYmxlZDogZnVuY3Rpb24gKFxuXHRcdG9UaGlzOiBhbnksXG5cdFx0b0RhdGFGaWVsZDogYW55LFxuXHRcdG9SZXF1aXJlc0NvbnRleHQ6IG9iamVjdCxcblx0XHRiSXNEYXRhRmllbGRGb3JJQk46IGJvb2xlYW4sXG5cdFx0b0FjdGlvbkNvbnRleHQ6IG9iamVjdCxcblx0XHR2QWN0aW9uRW5hYmxlZDogc3RyaW5nXG5cdCkge1xuXHRcdGNvbnN0IHNBY3Rpb25OYW1lID0gb0RhdGFGaWVsZC5BY3Rpb24sXG5cdFx0XHRzQW5ub3RhdGlvblRhcmdldEVudGl0eVR5cGUgPSBvVGhpcyAmJiBvVGhpcy5jb2xsZWN0aW9uLmdldE9iamVjdChcIiRUeXBlXCIpLFxuXHRcdFx0b1RhYmxlRGVmaW5pdGlvbiA9IG9UaGlzICYmIG9UaGlzLnRhYmxlRGVmaW5pdGlvbiAmJiBvVGhpcy50YWJsZURlZmluaXRpb24uZ2V0T2JqZWN0KCksXG5cdFx0XHRiU3RhdGljQWN0aW9uID0gdGhpcy5faXNTdGF0aWNBY3Rpb24ob0FjdGlvbkNvbnRleHQsIHNBY3Rpb25OYW1lKSxcblx0XHRcdGlzQW5hbHl0aWNhbFRhYmxlID0gb1RhYmxlRGVmaW5pdGlvbiAmJiBvVGFibGVEZWZpbml0aW9uLmVuYWJsZUFuYWx5dGljcztcblxuXHRcdC8vIENoZWNrIGZvciBhY3Rpb24gb3ZlcmxvYWQgb24gYSBkaWZmZXJlbnQgRW50aXR5IHR5cGUuXG5cdFx0Ly8gSWYgeWVzLCB0YWJsZSByb3cgc2VsZWN0aW9uIGlzIG5vdCByZXF1aXJlZCB0byBlbmFibGUgdGhpcyBhY3Rpb24uXG5cdFx0aWYgKCFiSXNEYXRhRmllbGRGb3JJQk4gJiYgdGhpcy5faXNBY3Rpb25PdmVybG9hZE9uRGlmZmVyZW50VHlwZShzQWN0aW9uTmFtZSwgc0Fubm90YXRpb25UYXJnZXRFbnRpdHlUeXBlKSkge1xuXHRcdFx0Ly8gQWN0aW9uIG92ZXJsb2FkIGRlZmluZWQgb24gZGlmZmVyZW50IGVudGl0eSB0eXBlXG5cdFx0XHRjb25zdCBvT3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gb1RhYmxlRGVmaW5pdGlvbiAmJiBKU09OLnBhcnNlKG9UYWJsZURlZmluaXRpb24ub3BlcmF0aW9uQXZhaWxhYmxlTWFwKTtcblx0XHRcdGlmIChvT3BlcmF0aW9uQXZhaWxhYmxlTWFwICYmIG9PcGVyYXRpb25BdmFpbGFibGVNYXAuaGFzT3duUHJvcGVydHkoc0FjdGlvbk5hbWUpKSB7XG5cdFx0XHRcdC8vIENvcmUuT3BlcmF0aW9uQXZhaWxhYmxlIGFubm90YXRpb24gZGVmaW5lZCBmb3IgdGhlIGFjdGlvbi5cblx0XHRcdFx0Ly8gTmVlZCB0byByZWZlciB0byBpbnRlcm5hbCBtb2RlbCBmb3IgZW5hYmxlZCBwcm9wZXJ0eSBvZiB0aGUgZHluYW1pYyBhY3Rpb24uXG5cdFx0XHRcdC8vIHJldHVybiBjb21waWxlQmluZGluZyhiaW5kaW5nRXhwcmVzc2lvbihcImR5bmFtaWNBY3Rpb25zL1wiICsgc0FjdGlvbk5hbWUgKyBcIi9iRW5hYmxlZFwiLCBcImludGVybmFsXCIpLCB0cnVlKTtcblx0XHRcdFx0cmV0dXJuIFwiez0gJHtpbnRlcm5hbD5keW5hbWljQWN0aW9ucy9cIiArIHNBY3Rpb25OYW1lICsgXCIvYkVuYWJsZWR9IH1cIjtcblx0XHRcdH1cblx0XHRcdC8vIENvbnNpZGVyIHRoZSBhY3Rpb24ganVzdCBsaWtlIGFueSBvdGhlciBzdGF0aWMgRGF0YUZpZWxkRm9yQWN0aW9uLlxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmICghb1JlcXVpcmVzQ29udGV4dCB8fCBiU3RhdGljQWN0aW9uKSB7XG5cdFx0XHRpZiAoYklzRGF0YUZpZWxkRm9ySUJOKSB7XG5cdFx0XHRcdGNvbnN0IHNFbnRpdHlTZXQgPSBvVGhpcy5jb2xsZWN0aW9uLmdldFBhdGgoKTtcblx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9UaGlzLmNvbGxlY3Rpb24uZ2V0TW9kZWwoKTtcblx0XHRcdFx0aWYgKHZBY3Rpb25FbmFibGVkID09PSBcImZhbHNlXCIgJiYgIWlzQW5hbHl0aWNhbFRhYmxlKSB7XG5cdFx0XHRcdFx0TG9nLndhcm5pbmcoXCJOYXZpZ2F0aW9uQXZhaWxhYmxlIGFzIGZhbHNlIGlzIGluY29ycmVjdCB1c2FnZVwiKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0IWlzQW5hbHl0aWNhbFRhYmxlICYmXG5cdFx0XHRcdFx0b0RhdGFGaWVsZCAmJlxuXHRcdFx0XHRcdG9EYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZSAmJlxuXHRcdFx0XHRcdG9EYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZS4kUGF0aCAmJlxuXHRcdFx0XHRcdG9NZXRhTW9kZWwuZ2V0T2JqZWN0KHNFbnRpdHlTZXQgKyBcIi8kUGFydG5lclwiKSA9PT0gb0RhdGFGaWVsZC5OYXZpZ2F0aW9uQXZhaWxhYmxlLiRQYXRoLnNwbGl0KFwiL1wiKVswXVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gXCJ7PSAke1wiICsgdkFjdGlvbkVuYWJsZWQuc3Vic3RyKHZBY3Rpb25FbmFibGVkLmluZGV4T2YoXCIvXCIpICsgMSwgdkFjdGlvbkVuYWJsZWQubGVuZ3RoKSArIFwifVwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRsZXQgc0RhdGFGaWVsZEZvckFjdGlvbkVuYWJsZWRFeHByZXNzaW9uID0gXCJcIixcblx0XHRcdHNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMsXG5cdFx0XHRzQWN0aW9uO1xuXHRcdGlmIChiSXNEYXRhRmllbGRGb3JJQk4pIHtcblx0XHRcdGlmICh2QWN0aW9uRW5hYmxlZCA9PT0gXCJ0cnVlXCIgfHwgaXNBbmFseXRpY2FsVGFibGUpIHtcblx0XHRcdFx0c0RhdGFGaWVsZEZvckFjdGlvbkVuYWJsZWRFeHByZXNzaW9uID0gXCIle2ludGVybmFsPm51bWJlck9mU2VsZWN0ZWRDb250ZXh0c30gPj0gMVwiO1xuXHRcdFx0fSBlbHNlIGlmICh2QWN0aW9uRW5hYmxlZCA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdExvZy53YXJuaW5nKFwiTmF2aWdhdGlvbkF2YWlsYWJsZSBhcyBmYWxzZSBpcyBpbmNvcnJlY3QgdXNhZ2VcIik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgPSBcIiV7aW50ZXJuYWw+bnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzfSA+PSAxXCI7XG5cdFx0XHRcdHNBY3Rpb24gPSBcIiR7aW50ZXJuYWw+aWJuL1wiICsgb0RhdGFGaWVsZC5TZW1hbnRpY09iamVjdCArIFwiLVwiICsgb0RhdGFGaWVsZC5BY3Rpb24gKyBcIi9iRW5hYmxlZFwiICsgXCJ9XCI7XG5cdFx0XHRcdHNEYXRhRmllbGRGb3JBY3Rpb25FbmFibGVkRXhwcmVzc2lvbiA9IHNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgKyBcIiAmJiBcIiArIHNBY3Rpb247XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNOdW1iZXJPZlNlbGVjdGVkQ29udGV4dHMgPSBBY3Rpb25IZWxwZXIuZ2V0TnVtYmVyT2ZDb250ZXh0c0V4cHJlc3Npb24odkFjdGlvbkVuYWJsZWQpO1xuXHRcdFx0c0FjdGlvbiA9IFwiJHtpbnRlcm5hbD5keW5hbWljQWN0aW9ucy9cIiArIG9EYXRhRmllbGQuQWN0aW9uICsgXCIvYkVuYWJsZWRcIiArIFwifVwiO1xuXHRcdFx0c0RhdGFGaWVsZEZvckFjdGlvbkVuYWJsZWRFeHByZXNzaW9uID0gc051bWJlck9mU2VsZWN0ZWRDb250ZXh0cyArIFwiICYmIFwiICsgc0FjdGlvbjtcblx0XHR9XG5cdFx0cmV0dXJuIFwiez0gXCIgKyBzRGF0YUZpZWxkRm9yQWN0aW9uRW5hYmxlZEV4cHJlc3Npb24gKyBcIn1cIjtcblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZXQgcHJlc3MgZXZlbnQgZXhwcmVzc2lvbiBmb3IgQ3JlYXRlQnV0dG9uLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgcHJlc3NFdmVudEZvckNyZWF0ZUJ1dHRvblxuXHQgKiBAcGFyYW0gb1RoaXMgQ3VycmVudCBPYmplY3Rcblx0ICogQHBhcmFtIGJDbWRFeGVjdXRpb25GbGFnIEZsYWcgdG8gaW5kaWNhdGUgdGhhdCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIGZyb20gQ01EIEV4ZWN1dGlvblxuXHQgKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJlc3MgZXZlbnQgb2YgdGhlIGNyZWF0ZSBidXR0b25cblx0ICovXG5cdHByZXNzRXZlbnRGb3JDcmVhdGVCdXR0b246IGZ1bmN0aW9uIChvVGhpczogYW55LCBiQ21kRXhlY3V0aW9uRmxhZzogYm9vbGVhbikge1xuXHRcdGNvbnN0IHNDcmVhdGlvbk1vZGUgPSBvVGhpcy5jcmVhdGlvbk1vZGU7XG5cdFx0bGV0IG9QYXJhbXM6IGFueTtcblx0XHRjb25zdCBzTWRjVGFibGUgPSBiQ21kRXhlY3V0aW9uRmxhZyA/IFwiJHskc291cmNlPn0uZ2V0UGFyZW50KClcIiA6IFwiJHskc291cmNlPn0uZ2V0UGFyZW50KCkuZ2V0UGFyZW50KCkuZ2V0UGFyZW50KClcIjtcblx0XHRsZXQgc1Jvd0JpbmRpbmcgPSBzTWRjVGFibGUgKyBcIi5nZXRSb3dCaW5kaW5nKCkgfHwgXCIgKyBzTWRjVGFibGUgKyBcIi5kYXRhKCdyb3dzQmluZGluZ0luZm8nKS5wYXRoXCI7XG5cblx0XHRzd2l0Y2ggKHNDcmVhdGlvbk1vZGUpIHtcblx0XHRcdGNhc2UgQ3JlYXRpb25Nb2RlLkV4dGVybmFsOlxuXHRcdFx0XHQvLyBuYXZpZ2F0ZSB0byBleHRlcm5hbCB0YXJnZXQgZm9yIGNyZWF0aW5nIG5ldyBlbnRyaWVzXG5cdFx0XHRcdC8vIFRPRE86IEFkZCByZXF1aXJlZCBwYXJhbWV0ZXJzXG5cdFx0XHRcdG9QYXJhbXMgPSB7XG5cdFx0XHRcdFx0Y3JlYXRpb25Nb2RlOiBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKENyZWF0aW9uTW9kZS5FeHRlcm5hbCksXG5cdFx0XHRcdFx0b3V0Ym91bmQ6IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMob1RoaXMuY3JlYXRlT3V0Ym91bmQpXG5cdFx0XHRcdH07XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdzpcblx0XHRcdFx0b1BhcmFtcyA9IHtcblx0XHRcdFx0XHRjcmVhdGlvbk1vZGU6IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMoQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93KSxcblx0XHRcdFx0XHRjcmVhdGlvblJvdzogXCIkeyRzb3VyY2U+fVwiLFxuXHRcdFx0XHRcdGNyZWF0ZUF0RW5kOiBvVGhpcy5jcmVhdGVBdEVuZCAhPT0gdW5kZWZpbmVkID8gb1RoaXMuY3JlYXRlQXRFbmQgOiBmYWxzZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNSb3dCaW5kaW5nID0gXCIkeyRzb3VyY2U+fS5nZXRQYXJlbnQoKS5fZ2V0Um93QmluZGluZygpXCI7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIENyZWF0aW9uTW9kZS5OZXdQYWdlOlxuXHRcdFx0Y2FzZSBDcmVhdGlvbk1vZGUuSW5saW5lOlxuXHRcdFx0XHRvUGFyYW1zID0ge1xuXHRcdFx0XHRcdGNyZWF0aW9uTW9kZTogQ29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3RlcyhzQ3JlYXRpb25Nb2RlKSxcblx0XHRcdFx0XHRjcmVhdGVBdEVuZDogb1RoaXMuY3JlYXRlQXRFbmQgIT09IHVuZGVmaW5lZCA/IG9UaGlzLmNyZWF0ZUF0RW5kIDogZmFsc2UsXG5cdFx0XHRcdFx0dGFibGVJZDogQ29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3RlcyhvVGhpcy5pZClcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAob1RoaXMuY3JlYXRlTmV3QWN0aW9uKSB7XG5cdFx0XHRcdFx0b1BhcmFtcy5uZXdBY3Rpb24gPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKG9UaGlzLmNyZWF0ZU5ld0FjdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQ3JlYXRpb25Nb2RlLklubGluZUNyZWF0aW9uUm93czpcblx0XHRcdFx0cmV0dXJuIENvbW1vbkhlbHBlci5nZW5lcmF0ZUZ1bmN0aW9uKFwiLl9lZGl0Rmxvdy5zY3JvbGxBbmRGb2N1c09uSW5hY3RpdmVSb3dcIiwgc01kY1RhYmxlKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vIHVuc3VwcG9ydGVkXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHJldHVybiBDb21tb25IZWxwZXIuZ2VuZXJhdGVGdW5jdGlvbihcIi5lZGl0Rmxvdy5jcmVhdGVEb2N1bWVudFwiLCBzUm93QmluZGluZywgQ29tbW9uSGVscGVyLm9iamVjdFRvU3RyaW5nKG9QYXJhbXMpKTtcblx0fSxcblxuXHRnZXRJQk5EYXRhOiBmdW5jdGlvbiAob1RoaXM6IGFueSkge1xuXHRcdGNvbnN0IG91dGJvdW5kRGV0YWlsID0gb1RoaXMuY3JlYXRlT3V0Ym91bmREZXRhaWw7XG5cdFx0aWYgKG91dGJvdW5kRGV0YWlsKSB7XG5cdFx0XHRjb25zdCBvSUJORGF0YSA9IHtcblx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMob3V0Ym91bmREZXRhaWwuc2VtYW50aWNPYmplY3QpLFxuXHRcdFx0XHRhY3Rpb246IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMob3V0Ym91bmREZXRhaWwuYWN0aW9uKVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBDb21tb25IZWxwZXIub2JqZWN0VG9TdHJpbmcob0lCTkRhdGEpO1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZXQgcHJlc3MgZXZlbnQgZXhwcmVzc2lvbiBmb3IgJ0RlbGV0ZScgYnV0dG9uLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgcHJlc3NFdmVudEZvckRlbGV0ZUJ1dHRvblxuXHQgKiBAcGFyYW0gb1RoaXMgQ3VycmVudCBPYmplY3Rcblx0ICogQHBhcmFtIHNFbnRpdHlTZXROYW1lIEVudGl0eVNldCBuYW1lXG5cdCAqIEBwYXJhbSBvSGVhZGVySW5mbyBIZWFkZXIgSW5mb1xuXHQgKiBAcGFyYW0gZnVsbGNvbnRleHRQYXRoIENvbnRleHQgUGF0aFxuXHQgKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgcHJlc3MgZXZlbnQgb2YgdGhlICdEZWxldGUnIGJ1dHRvblxuXHQgKi9cblx0cHJlc3NFdmVudEZvckRlbGV0ZUJ1dHRvbjogZnVuY3Rpb24gKG9UaGlzOiBhbnksIHNFbnRpdHlTZXROYW1lOiBzdHJpbmcsIG9IZWFkZXJJbmZvOiBhbnksIGZ1bGxjb250ZXh0UGF0aDogYW55KSB7XG5cdFx0Y29uc3Qgc0RlbGV0YWJsZUNvbnRleHRzID0gXCIke2ludGVybmFsPmRlbGV0YWJsZUNvbnRleHRzfVwiO1xuXHRcdGxldCBzVGl0bGUsIHRpdGxlVmFsdWVFeHByZXNzaW9uLCBzVGl0bGVFeHByZXNzaW9uLCBzRGVzY3JpcHRpb24sIGRlc2NyaXB0aW9uRXhwcmVzc2lvbiwgc0Rlc2NyaXB0aW9uRXhwcmVzc2lvbjtcblx0XHRpZiAob0hlYWRlckluZm8/LlRpdGxlKSB7XG5cdFx0XHRpZiAodHlwZW9mIG9IZWFkZXJJbmZvLlRpdGxlLlZhbHVlID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHNUaXRsZUV4cHJlc3Npb24gPSBDb21tb25IZWxwZXIuYWRkU2luZ2xlUXVvdGVzKG9IZWFkZXJJbmZvLlRpdGxlLlZhbHVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNUaXRsZSA9IEJpbmRpbmdUb29sa2l0LmdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihvSGVhZGVySW5mbz8uVGl0bGU/LlZhbHVlKTtcblx0XHRcdFx0aWYgKEJpbmRpbmdUb29sa2l0LmlzQ29uc3RhbnQoc1RpdGxlKSB8fCBCaW5kaW5nVG9vbGtpdC5pc1BhdGhJbk1vZGVsRXhwcmVzc2lvbihzVGl0bGUpKSB7XG5cdFx0XHRcdFx0dGl0bGVWYWx1ZUV4cHJlc3Npb24gPSBmb3JtYXRWYWx1ZVJlY3Vyc2l2ZWx5KHNUaXRsZSwgZnVsbGNvbnRleHRQYXRoKTtcblx0XHRcdFx0XHRzVGl0bGVFeHByZXNzaW9uID0gQmluZGluZ1Rvb2xraXQuY29tcGlsZUV4cHJlc3Npb24odGl0bGVWYWx1ZUV4cHJlc3Npb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvSGVhZGVySW5mbz8uRGVzY3JpcHRpb24pIHtcblx0XHRcdGlmICh0eXBlb2Ygb0hlYWRlckluZm8uRGVzY3JpcHRpb24uVmFsdWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0c0Rlc2NyaXB0aW9uRXhwcmVzc2lvbiA9IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMob0hlYWRlckluZm8uRGVzY3JpcHRpb24uVmFsdWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c0Rlc2NyaXB0aW9uID0gQmluZGluZ1Rvb2xraXQuZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKG9IZWFkZXJJbmZvPy5EZXNjcmlwdGlvbj8uVmFsdWUpO1xuXHRcdFx0XHRpZiAoQmluZGluZ1Rvb2xraXQuaXNDb25zdGFudChzRGVzY3JpcHRpb24pIHx8IEJpbmRpbmdUb29sa2l0LmlzUGF0aEluTW9kZWxFeHByZXNzaW9uKHNEZXNjcmlwdGlvbikpIHtcblx0XHRcdFx0XHRkZXNjcmlwdGlvbkV4cHJlc3Npb24gPSBmb3JtYXRWYWx1ZVJlY3Vyc2l2ZWx5KHNEZXNjcmlwdGlvbiwgZnVsbGNvbnRleHRQYXRoKTtcblx0XHRcdFx0XHRzRGVzY3JpcHRpb25FeHByZXNzaW9uID0gQmluZGluZ1Rvb2xraXQuY29tcGlsZUV4cHJlc3Npb24oZGVzY3JpcHRpb25FeHByZXNzaW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdCBvUGFyYW1zID0ge1xuXHRcdFx0aWQ6IENvbW1vbkhlbHBlci5hZGRTaW5nbGVRdW90ZXMob1RoaXMuaWQpLFxuXHRcdFx0ZW50aXR5U2V0TmFtZTogQ29tbW9uSGVscGVyLmFkZFNpbmdsZVF1b3RlcyhzRW50aXR5U2V0TmFtZSksXG5cdFx0XHRudW1iZXJPZlNlbGVjdGVkQ29udGV4dHM6IFwiJHtpbnRlcm5hbD5zZWxlY3RlZENvbnRleHRzfS5sZW5ndGhcIixcblx0XHRcdHVuU2F2ZWRDb250ZXh0czogXCIke2ludGVybmFsPnVuU2F2ZWRDb250ZXh0c31cIixcblx0XHRcdGxvY2tlZENvbnRleHRzOiBcIiR7aW50ZXJuYWw+bG9ja2VkQ29udGV4dHN9XCIsXG5cdFx0XHRjb250cm9sSWQ6IFwiJHtpbnRlcm5hbD5jb250cm9sSWR9XCIsXG5cdFx0XHR0aXRsZTogc1RpdGxlRXhwcmVzc2lvbixcblx0XHRcdGRlc2NyaXB0aW9uOiBzRGVzY3JpcHRpb25FeHByZXNzaW9uXG5cdFx0fTtcblxuXHRcdHJldHVybiBDb21tb25IZWxwZXIuZ2VuZXJhdGVGdW5jdGlvbihcIi5lZGl0Rmxvdy5kZWxldGVNdWx0aXBsZURvY3VtZW50c1wiLCBzRGVsZXRhYmxlQ29udGV4dHMsIENvbW1vbkhlbHBlci5vYmplY3RUb1N0cmluZyhvUGFyYW1zKSk7XG5cdH0sXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gaGFuZGxlIHRoZSAnZW5hYmxlJyBhbmQgJ2Rpc2FibGUnIHN0YXRlIG9mIHRoZSB0YWJsZSdzICdEZWxldGUnIGJ1dHRvbiBpZiB0aGlzIGluZm9ybWF0aW9uIGlzIHJlcXVlc3RlZCBpbiB0aGUgc2lkZSBlZmZlY3RzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgaGFuZGxlVGFibGVEZWxldGVFbmFibGVtZW50Rm9yU2lkZUVmZmVjdHNcblx0ICogQHBhcmFtIG9UYWJsZSBUYWJsZSBpbnN0YW5jZVxuXHQgKiBAcGFyYW0gb0ludGVybmFsTW9kZWxDb250ZXh0IFRoZSBpbnRlcm5hbCBtb2RlbCBjb250ZXh0XG5cdCAqL1xuXHRoYW5kbGVUYWJsZURlbGV0ZUVuYWJsZW1lbnRGb3JTaWRlRWZmZWN0czogZnVuY3Rpb24gKG9UYWJsZTogVGFibGUsIG9JbnRlcm5hbE1vZGVsQ29udGV4dDogSW50ZXJuYWxNb2RlbENvbnRleHQpIHtcblx0XHRpZiAob1RhYmxlICYmIG9JbnRlcm5hbE1vZGVsQ29udGV4dCkge1xuXHRcdFx0Y29uc3Qgc0RlbGV0YWJsZVBhdGggPSBUYWJsZUhlbHBlci5nZXREZWxldGFibGVQYXRoRm9yVGFibGUob1RhYmxlKSxcblx0XHRcdFx0YVNlbGVjdGVkQ29udGV4dHMgPSAob1RhYmxlIGFzIGFueSkuZ2V0U2VsZWN0ZWRDb250ZXh0cygpLFxuXHRcdFx0XHRhRGVsZXRhYmxlQ29udGV4dHMgPSBbXTtcblxuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiZGVsZXRlRW5hYmxlZFwiLCBmYWxzZSk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFTZWxlY3RlZENvbnRleHRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygc0RlbGV0YWJsZVBhdGggPT09IFwic3RyaW5nXCIgJiYgc0RlbGV0YWJsZVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGNvbnN0IG9TZWxlY3RlZENvbnRleHQgPSBhU2VsZWN0ZWRDb250ZXh0c1tpXTtcblx0XHRcdFx0XHRpZiAob1NlbGVjdGVkQ29udGV4dCAmJiBvU2VsZWN0ZWRDb250ZXh0LmdldFByb3BlcnR5KHNEZWxldGFibGVQYXRoKSkge1xuXHRcdFx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiZGVsZXRlRW5hYmxlZFwiLCB0cnVlKTtcblx0XHRcdFx0XHRcdGFEZWxldGFibGVDb250ZXh0cy5wdXNoKG9TZWxlY3RlZENvbnRleHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJkZWxldGFibGVDb250ZXh0c1wiLCBhRGVsZXRhYmxlQ29udGV4dHMpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGdldCB0aGUgZGVsZXRlIHJlc3RyaWNpdGlvbnMgUGF0aCBhc3NvY2lhdGVkLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0RGVsZXRhYmxlUGF0aEZvclRhYmxlXG5cdCAqIEBwYXJhbSB0YWJsZSBUYWJsZSBpbnN0YW5jZVxuXHQgKiBAcmV0dXJucyBQYXRoIGFzc29jaWF0ZWQgd2l0aCBkZWxldGUncyBlbmFibGUgYW5kIGRpc2FibGVcblx0ICovXG5cdGdldERlbGV0YWJsZVBhdGhGb3JUYWJsZTogZnVuY3Rpb24gKHRhYmxlOiBUYWJsZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdFx0bGV0IGRlbGV0YWJsZVBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRjb25zdCByb3dCaW5kaW5nID0gdGFibGUuZ2V0Um93QmluZGluZygpO1xuXG5cdFx0aWYgKHJvd0JpbmRpbmcpIHtcblx0XHRcdGNvbnN0IG1ldGFNb2RlbCA9IHRhYmxlLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkgYXMgT0RhdGFNZXRhTW9kZWw7XG5cdFx0XHRsZXQgcGF0aCA9IHJvd0JpbmRpbmcuZ2V0UGF0aCgpO1xuXHRcdFx0Y29uc3QgY29udGV4dFBhdGggPSByb3dCaW5kaW5nLmdldENvbnRleHQoKT8uZ2V0UGF0aCgpO1xuXHRcdFx0aWYgKGNvbnRleHRQYXRoKSB7XG5cdFx0XHRcdGNvbnN0IG1ldGFQYXRoID0gbWV0YU1vZGVsLmdldE1ldGFQYXRoKGNvbnRleHRQYXRoKTtcblx0XHRcdFx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG1ldGFNb2RlbC5nZXRPYmplY3QobWV0YVBhdGgpPy5bXCIkTmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiXT8uW3BhdGhdO1xuXHRcdFx0XHRpZiAobmF2aWdhdGlvblByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0cGF0aCA9IGAvJHtuYXZpZ2F0aW9uUHJvcGVydHlQYXRofWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGRlbGV0YWJsZVBhdGggPSBtZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3BhdGh9QE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVsZXRlUmVzdHJpY3Rpb25zL0RlbGV0YWJsZWApPy4kUGF0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVsZXRhYmxlUGF0aDtcblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIHNldCB2aXNpYmlsaXR5IG9mIGNvbHVtbiBoZWFkZXIgbGFiZWwuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBzZXRIZWFkZXJMYWJlbFZpc2liaWxpdHlcblx0ICogQHBhcmFtIGRhdGFmaWVsZCBEYXRhRmllbGRcblx0ICogQHBhcmFtIGRhdGFGaWVsZENvbGxlY3Rpb24gTGlzdCBvZiBpdGVtcyBpbnNpZGUgYSBmaWVsZGdyb3VwIChpZiBhbnkpXG5cdCAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgaGVhZGVyIGxhYmVsIG5lZWRzIHRvIGJlIHZpc2libGUgZWxzZSBmYWxzZS5cblx0ICovXG5cdHNldEhlYWRlckxhYmVsVmlzaWJpbGl0eTogZnVuY3Rpb24gKGRhdGFmaWVsZDogYW55LCBkYXRhRmllbGRDb2xsZWN0aW9uOiBhbnlbXSkge1xuXHRcdC8vIElmIElubGluZSBidXR0b24vbmF2aWdhdGlvbiBhY3Rpb24sIHJldHVybiBmYWxzZSwgZWxzZSB0cnVlO1xuXHRcdGlmICghZGF0YUZpZWxkQ29sbGVjdGlvbikge1xuXHRcdFx0aWYgKGRhdGFmaWVsZC4kVHlwZS5pbmRleE9mKFwiRGF0YUZpZWxkRm9yQWN0aW9uXCIpID4gLTEgJiYgZGF0YWZpZWxkLklubGluZSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGF0YWZpZWxkLiRUeXBlLmluZGV4T2YoXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIikgPiAtMSAmJiBkYXRhZmllbGQuSW5saW5lKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIEluIEZpZWxkZ3JvdXAsIElmIE5PVCBhbGwgZGF0YWZpZWxkL2RhdGFmaWVsZEZvckFubm90YXRpb24gZXhpc3RzIHdpdGggaGlkZGVuLCByZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gZGF0YUZpZWxkQ29sbGVjdGlvbi5zb21lKGZ1bmN0aW9uIChvREM6IGFueSkge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQob0RDLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiIHx8XG5cdFx0XHRcdFx0b0RDLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFubm90YXRpb25cIikgJiZcblx0XHRcdFx0b0RDW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhpZGRlblwiXSAhPT0gdHJ1ZVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2V0IFRhcmdldCBWYWx1ZSAoIyBvZiBzdGFycykgZnJvbSBWaXN1YWxpemF0aW9uIFJhdGluZy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGdldFZhbHVlT25SYXRpbmdGaWVsZFxuXHQgKiBAcGFyYW0gb0RhdGFGaWVsZCBEYXRhUG9pbnQncyBWYWx1ZVxuXHQgKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBvYmplY3Qgb2YgdGhlIExpbmVJdGVtXG5cdCAqIEByZXR1cm5zIFRoZSBudW1iZXIgZm9yIERhdGFGaWVsZEZvckFubm90YXRpb24gVGFyZ2V0IFZhbHVlXG5cdCAqL1xuXHRnZXRWYWx1ZU9uUmF0aW5nRmllbGQ6IGZ1bmN0aW9uIChvRGF0YUZpZWxkOiBhbnksIG9Db250ZXh0OiBhbnkpIHtcblx0XHQvLyBmb3IgRmllbGRHcm91cCBjb250YWluaW5nIHZpc3VhbGl6YXRpb25UeXBlUmF0aW5nXG5cdFx0aWYgKG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQW5ub3RhdGlvblwiKSB7XG5cdFx0XHQvLyBGb3IgYSBkYXRhIGZpZWxkIGhhdmluZyBSYXRpbmcgYXMgdmlzdWFsaXphdGlvbiB0eXBlXG5cdFx0XHRpZiAoXG5cdFx0XHRcdG9Db250ZXh0LmNvbnRleHQuZ2V0T2JqZWN0KFwiVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aFwiKS5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFwiKSA+IC0xICYmXG5cdFx0XHRcdG9Db250ZXh0LmNvbnRleHQuZ2V0T2JqZWN0KFwiVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aC8kVHlwZVwiKSA9PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFR5cGVcIiAmJlxuXHRcdFx0XHRvQ29udGV4dC5jb250ZXh0LmdldE9iamVjdChcIlRhcmdldC8kQW5ub3RhdGlvblBhdGgvVmlzdWFsaXphdGlvbi8kRW51bU1lbWJlclwiKSA9PVxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVmlzdWFsaXphdGlvblR5cGUvUmF0aW5nXCJcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gb0NvbnRleHQuY29udGV4dC5nZXRPYmplY3QoXCJUYXJnZXQvJEFubm90YXRpb25QYXRoL1RhcmdldFZhbHVlXCIpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZm9yIEZpZWxkR3JvdXAgaGF2aW5nIFJhdGluZyBhcyB2aXN1YWxpemF0aW9uIHR5cGUgaW4gYW55IG9mIHRoZSBkYXRhIGZpZWxkc1xuXHRcdFx0aWYgKG9Db250ZXh0LmNvbnRleHQuZ2V0T2JqZWN0KFwiVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aFwiKS5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIikgPiAtMSkge1xuXHRcdFx0XHRjb25zdCBzUGF0aERhdGFGaWVsZHMgPSBcIlRhcmdldC8kQW5ub3RhdGlvblBhdGgvRGF0YS9cIjtcblx0XHRcdFx0Zm9yIChjb25zdCBpIGluIG9Db250ZXh0LmNvbnRleHQuZ2V0T2JqZWN0KHNQYXRoRGF0YUZpZWxkcykpIHtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvQ29udGV4dC5jb250ZXh0LmdldE9iamVjdChgJHtzUGF0aERhdGFGaWVsZHMgKyBpfS8kVHlwZWApID09PVxuXHRcdFx0XHRcdFx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFubm90YXRpb25cIiAmJlxuXHRcdFx0XHRcdFx0b0NvbnRleHQuY29udGV4dFxuXHRcdFx0XHRcdFx0XHQuZ2V0T2JqZWN0KGAke3NQYXRoRGF0YUZpZWxkcyArIGl9L1RhcmdldC8kQW5ub3RhdGlvblBhdGhgKVxuXHRcdFx0XHRcdFx0XHQuaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIikgPiAtMSAmJlxuXHRcdFx0XHRcdFx0b0NvbnRleHQuY29udGV4dC5nZXRPYmplY3QoYCR7c1BhdGhEYXRhRmllbGRzICsgaX0vVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aC8kVHlwZWApID09XG5cdFx0XHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiICYmXG5cdFx0XHRcdFx0XHRvQ29udGV4dC5jb250ZXh0LmdldE9iamVjdChgJHtzUGF0aERhdGFGaWVsZHMgKyBpfS9UYXJnZXQvJEFubm90YXRpb25QYXRoL1Zpc3VhbGl6YXRpb24vJEVudW1NZW1iZXJgKSA9PVxuXHRcdFx0XHRcdFx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlZpc3VhbGl6YXRpb25UeXBlL1JhdGluZ1wiXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb0NvbnRleHQuY29udGV4dC5nZXRPYmplY3QoYCR7c1BhdGhEYXRhRmllbGRzICsgaX0vVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aC9UYXJnZXRWYWx1ZWApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZXQgVGV4dCBmcm9tIERhdGFGaWVsZEZvckFubm90YXRpb24gaW50byBDb2x1bW4uXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBnZXRUZXh0T25BY3Rpb25GaWVsZFxuXHQgKiBAcGFyYW0gb0RhdGFGaWVsZCBEYXRhUG9pbnQncyBWYWx1ZVxuXHQgKiBAcGFyYW0gb0NvbnRleHQgQ29udGV4dCBvYmplY3Qgb2YgdGhlIExpbmVJdGVtXG5cdCAqIEByZXR1cm5zIFN0cmluZyBmcm9tIGxhYmVsIHJlZmVycmluZyB0byBhY3Rpb24gdGV4dFxuXHQgKi9cblx0Z2V0VGV4dE9uQWN0aW9uRmllbGQ6IGZ1bmN0aW9uIChvRGF0YUZpZWxkOiBhbnksIG9Db250ZXh0OiBhbnkpIHtcblx0XHRpZiAoXG5cdFx0XHRvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiIHx8XG5cdFx0XHRvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gb0RhdGFGaWVsZC5MYWJlbDtcblx0XHR9XG5cdFx0Ly8gZm9yIEZpZWxkR3JvdXAgY29udGFpbmluZyBEYXRhRmllbGRGb3JBbm5vdGF0aW9uXG5cdFx0aWYgKFxuXHRcdFx0b0RhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBbm5vdGF0aW9uXCIgJiZcblx0XHRcdG9Db250ZXh0LmNvbnRleHQuZ2V0T2JqZWN0KFwiVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aFwiKS5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIikgPiAtMVxuXHRcdCkge1xuXHRcdFx0Y29uc3Qgc1BhdGhEYXRhRmllbGRzID0gXCJUYXJnZXQvJEFubm90YXRpb25QYXRoL0RhdGEvXCI7XG5cdFx0XHRjb25zdCBhTXVsdGlwbGVMYWJlbHMgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaSBpbiBvQ29udGV4dC5jb250ZXh0LmdldE9iamVjdChzUGF0aERhdGFGaWVsZHMpKSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRvQ29udGV4dC5jb250ZXh0LmdldE9iamVjdChgJHtzUGF0aERhdGFGaWVsZHMgKyBpfS8kVHlwZWApID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiIHx8XG5cdFx0XHRcdFx0b0NvbnRleHQuY29udGV4dC5nZXRPYmplY3QoYCR7c1BhdGhEYXRhRmllbGRzICsgaX0vJFR5cGVgKSA9PT1cblx0XHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YU11bHRpcGxlTGFiZWxzLnB1c2gob0NvbnRleHQuY29udGV4dC5nZXRPYmplY3QoYCR7c1BhdGhEYXRhRmllbGRzICsgaX0vTGFiZWxgKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIEluIGNhc2UgdGhlcmUgYXJlIG11bHRpcGxlIGFjdGlvbnMgaW5zaWRlIGEgRmllbGQgR3JvdXAgc2VsZWN0IHRoZSBsYXJnZXN0IEFjdGlvbiBMYWJlbFxuXHRcdFx0aWYgKGFNdWx0aXBsZUxhYmVscy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdHJldHVybiBhTXVsdGlwbGVMYWJlbHMucmVkdWNlKGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBhLmxlbmd0aCA+IGIubGVuZ3RoID8gYSA6IGI7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGFNdWx0aXBsZUxhYmVscy5sZW5ndGggPT09IDAgPyB1bmRlZmluZWQgOiBhTXVsdGlwbGVMYWJlbHMudG9TdHJpbmcoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdF9nZXRSZXNwb25zaXZlVGFibGVDb2x1bW5TZXR0aW5nczogZnVuY3Rpb24gKG9UaGlzOiBhbnksIG9Db2x1bW46IGFueSkge1xuXHRcdGlmIChvVGhpcy50YWJsZVR5cGUgPT09IFwiUmVzcG9uc2l2ZVRhYmxlXCIpIHtcblx0XHRcdHJldHVybiBvQ29sdW1uLnNldHRpbmdzO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fSxcblxuXHRnZXRDaGFydFNpemU6IGZ1bmN0aW9uIChvVGhpczogYW55LCBvQ29sdW1uOiBhbnkpIHtcblx0XHRjb25zdCBzZXR0aW5ncyA9IHRoaXMuX2dldFJlc3BvbnNpdmVUYWJsZUNvbHVtblNldHRpbmdzKG9UaGlzLCBvQ29sdW1uKTtcblx0XHRpZiAoc2V0dGluZ3MgJiYgc2V0dGluZ3MubWljcm9DaGFydFNpemUpIHtcblx0XHRcdHJldHVybiBzZXR0aW5ncy5taWNyb0NoYXJ0U2l6ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFwiWFNcIjtcblx0fSxcblx0Z2V0U2hvd09ubHlDaGFydDogZnVuY3Rpb24gKG9UaGlzOiBhbnksIG9Db2x1bW46IGFueSkge1xuXHRcdGNvbnN0IHNldHRpbmdzID0gdGhpcy5fZ2V0UmVzcG9uc2l2ZVRhYmxlQ29sdW1uU2V0dGluZ3Mob1RoaXMsIG9Db2x1bW4pO1xuXHRcdGlmIChzZXR0aW5ncyAmJiBzZXR0aW5ncy5zaG93TWljcm9DaGFydExhYmVsKSB7XG5cdFx0XHRyZXR1cm4gIXNldHRpbmdzLnNob3dNaWNyb0NoYXJ0TGFiZWw7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXHRnZXREZWxlZ2F0ZTogZnVuY3Rpb24gKGJFbmFibGVBbmFseXRpY3M6IGFueSwgYkhhc011bHRpVmlzdWFsaXphdGlvbnM6IGFueSwgc0VudGl0eU5hbWU6IGFueSkge1xuXHRcdGxldCBvRGVsZWdhdGU7XG5cdFx0aWYgKGJIYXNNdWx0aVZpc3VhbGl6YXRpb25zID09PSBcInRydWVcIikge1xuXHRcdFx0b0RlbGVnYXRlID0ge1xuXHRcdFx0XHRuYW1lOiBiRW5hYmxlQW5hbHl0aWNzXG5cdFx0XHRcdFx0PyBcInNhcC9mZS9tYWNyb3MvdGFibGUvZGVsZWdhdGVzL0FuYWx5dGljYWxBTFBUYWJsZURlbGVnYXRlXCJcblx0XHRcdFx0XHQ6IFwic2FwL2ZlL21hY3Jvcy90YWJsZS9kZWxlZ2F0ZXMvQUxQVGFibGVEZWxlZ2F0ZVwiLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0Y29sbGVjdGlvbk5hbWU6IHNFbnRpdHlOYW1lXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9EZWxlZ2F0ZSA9IHtcblx0XHRcdFx0bmFtZTogYkVuYWJsZUFuYWx5dGljc1xuXHRcdFx0XHRcdD8gXCJzYXAvZmUvbWFjcm9zL3RhYmxlL2RlbGVnYXRlcy9BbmFseXRpY2FsVGFibGVEZWxlZ2F0ZVwiXG5cdFx0XHRcdFx0OiBcInNhcC9mZS9tYWNyb3MvdGFibGUvZGVsZWdhdGVzL1RhYmxlRGVsZWdhdGVcIlxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkob0RlbGVnYXRlKTtcblx0fSxcblx0c2V0SUJORW5hYmxlbWVudDogZnVuY3Rpb24gKG9JbnRlcm5hbE1vZGVsQ29udGV4dDogYW55LCBvTmF2aWdhdGlvbkF2YWlsYWJsZU1hcDogYW55LCBhU2VsZWN0ZWRDb250ZXh0czogYW55KSB7XG5cdFx0Zm9yIChjb25zdCBzS2V5IGluIG9OYXZpZ2F0aW9uQXZhaWxhYmxlTWFwKSB7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoYGlibi8ke3NLZXl9YCwge1xuXHRcdFx0XHRiRW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdGFBcHBsaWNhYmxlOiBbXSxcblx0XHRcdFx0YU5vdEFwcGxpY2FibGU6IFtdXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGFBcHBsaWNhYmxlID0gW10sXG5cdFx0XHRcdGFOb3RBcHBsaWNhYmxlID0gW107XG5cdFx0XHRjb25zdCBzUHJvcGVydHkgPSBvTmF2aWdhdGlvbkF2YWlsYWJsZU1hcFtzS2V5XTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYVNlbGVjdGVkQ29udGV4dHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3Qgb1NlbGVjdGVkQ29udGV4dCA9IGFTZWxlY3RlZENvbnRleHRzW2ldO1xuXHRcdFx0XHRpZiAob1NlbGVjdGVkQ29udGV4dC5nZXRPYmplY3Qoc1Byb3BlcnR5KSkge1xuXHRcdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRNb2RlbCgpLnNldFByb3BlcnR5KGAke29JbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQYXRoKCl9L2libi8ke3NLZXl9L2JFbmFibGVkYCwgdHJ1ZSk7XG5cdFx0XHRcdFx0YUFwcGxpY2FibGUucHVzaChvU2VsZWN0ZWRDb250ZXh0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhTm90QXBwbGljYWJsZS5wdXNoKG9TZWxlY3RlZENvbnRleHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0TW9kZWwoKS5zZXRQcm9wZXJ0eShgJHtvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UGF0aCgpfS9pYm4vJHtzS2V5fS9hQXBwbGljYWJsZWAsIGFBcHBsaWNhYmxlKTtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRNb2RlbCgpLnNldFByb3BlcnR5KGAke29JbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQYXRoKCl9L2libi8ke3NLZXl9L2FOb3RBcHBsaWNhYmxlYCwgYU5vdEFwcGxpY2FibGUpO1xuXHRcdH1cblx0fVxufTtcbihUYWJsZUhlbHBlci5nZXROYXZpZ2F0aW9uQXZhaWxhYmxlTWFwIGFzIGFueSkucmVxdWlyZXNJQ29udGV4dCA9IHRydWU7XG4oVGFibGVIZWxwZXIuZ2V0VmFsdWVPblJhdGluZ0ZpZWxkIGFzIGFueSkucmVxdWlyZXNJQ29udGV4dCA9IHRydWU7XG4oVGFibGVIZWxwZXIuZ2V0VGV4dE9uQWN0aW9uRmllbGQgYXMgYW55KS5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgVGFibGVIZWxwZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7O0VBcUJB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