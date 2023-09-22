/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/formatters/CollaborationFormatter", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/TemplateModel", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/MacroMetadata", "sap/fe/macros/situations/SituationsIndicator.fragment"], function (CommonUtils, BindingHelper, MetaModelConverter, CollaborationFormatters, valueFormatters, BindingToolkit, ModelHelper, StableIdHelper, TemplateModel, DataModelPathHelper, UIFormatters, FieldTemplating, MacroMetadata, SituationsIndicator) {
  "use strict";

  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getRelativePaths = DataModelPathHelper.getRelativePaths;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var generate = StableIdHelper.generate;
  var pathInModel = BindingToolkit.pathInModel;
  var not = BindingToolkit.not;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  var Entity = BindingHelper.Entity;

  /**
   * @classdesc
   * Building block for creating a Field based on the metadata provided by OData V4.
   * <br>
   * Usually, a DataField annotation is expected
   *
   * Usage example:
   * <pre>
   * <internalMacro:Field
   *   idPrefix="SomePrefix"
   *   contextPath="{entitySet>}"
   *   metaPath="{dataField>}"
   * />
   * </pre>
   * @class sap.fe.macros.internal.Field
   * @hideconstructor
   * @private
   * @experimental
   * @since 1.94.0
   */
  var Field = MacroMetadata.extend("sap.fe.macros.internal.Field", {
    /**
     * Name of the macro control.
     */
    name: "Field",

    /**
     * Namespace of the macro control
     */
    namespace: "sap.fe.macros.internal",

    /**
     * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
     */
    fragment: "sap.fe.macros.internal.Field",

    /**
     * The metadata describing the macro control.
     */
    metadata: {
      /**
       * Define macro stereotype for documentation
       */
      stereotype: "xmlmacro",

      /**
       * Location of the designtime info
       */
      designtime: "sap/fe/macros/internal/Field.designtime",

      /**
       * Properties.
       */
      properties: {
        /**
         * Prefix added to the generated ID of the field
         */
        idPrefix: {
          type: "string"
        },
        _apiId: {
          type: "string"
        },
        noWrapperId: {
          type: "string"
        },

        /**
         * Prefix added to the generated ID of the value help used for the field
         */
        vhIdPrefix: {
          type: "string",
          defaultValue: "FieldValueHelp"
        },
        _vhFlexId: {
          type: "string",
          computed: true
        },

        /**
         * Metadata path to the entity set
         */
        entitySet: {
          type: "sap.ui.model.Context",
          required: true,
          $kind: ["EntitySet", "NavigationProperty", "EntityType", "Singleton"]
        },

        /**
         * Metadata path to the entity set
         */
        entityType: {
          type: "sap.ui.model.Context",
          required: false,
          computed: true,
          $kind: ["EntityType"]
        },

        /**
         * Parent entity set
         */
        parentEntitySet: {
          type: "sap.ui.model.Context",
          required: false,
          $kind: ["EntitySet", "NavigationProperty", "EntityType", "Singleton"]
        },

        /**
         * Flag indicating whether action will navigate after execution
         */
        navigateAfterAction: {
          type: "boolean",
          defaultValue: true
        },

        /**
         * Metadata path to the dataField.
         * This property is usually a metadataContext pointing to a DataField having
         * $Type of DataField, DataFieldWithUrl, DataFieldForAnnotation, DataFieldForAction, DataFieldForIntentBasedNavigation, DataFieldWithNavigationPath, or DataPointType.
         * But it can also be a Property with $kind="Property"
         */
        dataField: {
          type: "sap.ui.model.Context",
          required: true,
          $kind: ["Property"],
          $Type: ["com.sap.vocabularies.UI.v1.DataField", "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "com.sap.vocabularies.UI.v1.DataFieldForAnnotation", "com.sap.vocabularies.UI.v1.DataFieldForAction", "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation", "com.sap.vocabularies.UI.v1.DataFieldWithAction", "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation", "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath", "com.sap.vocabularies.UI.v1.DataPointType"]
        },

        /**
         * Context pointing to an array of the property's semantic objects
         */
        semanticObjects: {
          type: "sap.ui.model.Context",
          required: false,
          computed: true
        },

        /**
         * Edit Mode of the field.
         *
         * If the editMode is undefined then we compute it based on the metadata
         * Otherwise we use the value provided here.
         */
        editMode: {
          type: "sap.ui.mdc.enum.EditMode"
        },

        /**
         * Wrap field
         */
        wrap: {
          type: "boolean"
        },

        /**
         * CSS class for margin
         */
        "class": {
          type: "string"
        },

        /**
         * Property added to associate the label with the Field
         */
        ariaLabelledBy: {
          type: "string"
        },
        textAlign: {
          type: "sap.ui.core.TextAlign"
        },
        editableExpression: {
          type: "string",
          computed: true
        },
        enabledExpression: {
          type: "string",
          computed: true
        },
        collaborationEnabled: {
          type: "boolean",
          computed: true
        },
        collaborationHasActivityExpression: {
          type: "string",
          computed: true
        },
        collaborationInitialsExpression: {
          type: "string",
          computed: true
        },
        collaborationColorExpression: {
          type: "string",
          computed: true
        },

        /**
         * Option to add a semantic object to a field
         */
        semanticObject: {
          type: "string",
          required: false
        },
        hasSemanticObjectOnNavigation: {
          type: "boolean",
          required: false
        },
        formatOptions: {
          type: "object",
          properties: {
            isCurrencyAligned: {
              type: "boolean",
              defaultValue: false
            },

            /**
             * expression for ObjectStatus visible property
             */
            containsErrorVisibility: {
              type: "string"
            },

            /**
             * Describe how the alignment works between Table mode (Date and Numeric End alignment) and Form mode (numeric aligned End in edit and Begin in display)
             */
            textAlignMode: {
              type: "string",
              defaultValue: "Table",
              allowedValues: ["Table", "Form"]
            },
            displayMode: {
              type: "string",
              allowedValues: ["Value", "Description", "ValueDescription", "DescriptionValue"]
            },
            fieldMode: {
              type: "string",
              allowedValues: ["nowrapper", ""]
            },
            measureDisplayMode: {
              type: "string",
              allowedValues: ["Hidden", "ReadOnly"]
            },

            /**
             * Maximum number of lines for multiline texts in edit mode
             */
            textLinesEdit: {
              type: "number",
              configurable: true
            },

            /**
             * Maximum number of lines that multiline texts in edit mode can grow to
             */
            textMaxLines: {
              type: "number",
              configurable: true
            },

            /**
             * Maximum number of characters from the beginning of the text field that are shown initially.
             */
            textMaxCharactersDisplay: {
              type: "number",
              configurable: true
            },

            /**
             * Defines how the full text will be displayed - InPlace or Popover
             */
            textExpandBehaviorDisplay: {
              type: "string",
              allowedValues: ["InPlace", "Popover"]
            },

            /**
             * If set to 'true', SAP Fiori elements shows an empty indicator in display mode for the text and links
             */
            showEmptyIndicator: {
              type: "boolean",
              defaultValue: false
            },

            /**
             * Preferred control if a semanticKey is used (if the semanticKey is empty, no specific rules apply)
             */
            semanticKeyStyle: {
              type: "string",
              defaultValue: "",
              allowedValues: ["ObjectIdentifier", "Label", ""]
            },
            hasDraftIndicator: {
              type: "boolean",
              defaultValue: false
            },

            /**
             * If true then sets the given icon instead of text in Action/IBN Button
             */
            showIconUrl: {
              type: "boolean",
              defaultValue: false
            },

            /**
             * If true then navigationavailable property will not be used for enablement of IBN button
             */
            ignoreNavigationAvailable: {
              type: "boolean",
              defaultValue: false
            },
            isAnalytics: {
              type: "boolean",
              defaultValue: false
            },

            /**
             * Enables the fallback feature for usage the text annotation from the value lists
             */
            retrieveTextFromValueList: {
              type: "boolean",
              defaultValue: false
            },
            compactSemanticKey: {
              type: "boolean",
              defaultValue: false
            },
            fieldGroupDraftIndicatorPropertyPath: {
              type: "string"
            },
            fieldGroupName: {
              type: "string"
            }
          }
        }
      },
      events: {
        /**
         * Event handler for change event
         */
        onChange: {
          type: "function"
        }
      }
    },
    getOverrides: function (mControlConfiguration, sID) {
      var oProps = {};

      if (mControlConfiguration) {
        var oControlConfig = mControlConfiguration[sID];

        if (oControlConfig) {
          Object.keys(oControlConfig).forEach(function (sConfigKey) {
            oProps[sConfigKey] = oControlConfig[sConfigKey];
          });
        }
      }

      return oProps;
    },
    setUpDataPointType: function (oDataField) {
      // data point annotations need not have $Type defined, so add it if missing
      if ((oDataField === null || oDataField === void 0 ? void 0 : oDataField.term) === "com.sap.vocabularies.UI.v1.DataPoint") {
        oDataField.$Type = oDataField.$Type || "com.sap.vocabularies.UI.v1.DataPointType";
      }
    },
    setUpVisibleProperties: function (oFieldProps, oPropertyDataModelObjectPath) {
      // we do this before enhancing the dataModelPath so that it still points at the DataField
      oFieldProps.visible = FieldTemplating.getVisibleExpression(oPropertyDataModelObjectPath, oFieldProps.formatOptions);
      oFieldProps.displayVisible = oFieldProps.formatOptions.fieldMode === "nowrapper" ? oFieldProps.visible : undefined;
    },
    setUpParentEntitySet: function (oFieldProps, oPropertyDataModelObjectPath, mSettings) {
      var _mSettings$models;

      if (oPropertyDataModelObjectPath !== null && oPropertyDataModelObjectPath !== void 0 && oPropertyDataModelObjectPath.contextLocation && mSettings !== null && mSettings !== void 0 && (_mSettings$models = mSettings.models) !== null && _mSettings$models !== void 0 && _mSettings$models.metaModel) {
        oFieldProps.parentEntitySet = mSettings.models.metaModel.createBindingContext("/".concat(oPropertyDataModelObjectPath.contextLocation.startingEntitySet ? oPropertyDataModelObjectPath.contextLocation.startingEntitySet.name : oPropertyDataModelObjectPath.startingEntitySet.name));
      }
    },
    create: function (oProps, oControlConfiguration, mSettings) {
      var _oProps$dataField$get;

      var oDataFieldConverted = MetaModelConverter.convertMetaModelContext(oProps.dataField);
      var oDataModelPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.dataField, oProps.entitySet);
      this.setUpDataPointType(oDataFieldConverted);
      this.setUpVisibleProperties(oProps, oDataModelPath);
      this.setUpParentEntitySet(oProps, oDataModelPath, mSettings);

      if (oProps._flexId) {
        oProps._apiId = oProps._flexId;
        oProps._flexId = this.getContentId(oProps._flexId);
        oProps._vhFlexId = "".concat(oProps._flexId, "_").concat(oProps.vhIdPrefix);
      }

      oDataModelPath = this._getTargetValueDataModelPath(oDataFieldConverted, oDataModelPath);
      this.setUpSemanticObjects(oProps, oDataModelPath);
      oProps.dataSourcePath = getTargetObjectPath(oDataModelPath);
      var oMetaModel = mSettings.models.metaModel || mSettings.models.entitySet;
      oProps.entityType = oMetaModel.createBindingContext("/".concat(oDataModelPath.targetEntityType.fullyQualifiedName));
      this.setUpEditableProperties(oProps, oDataFieldConverted, oDataModelPath, oMetaModel);
      this.setUpFormatOptions(oProps, oDataModelPath, oControlConfiguration, mSettings);
      this.setUpDisplayStyle(oProps, oDataFieldConverted, oDataModelPath);
      this.setUpEditStyle(oProps, oDataFieldConverted, oDataModelPath); // ---------------------------------------- compute bindings----------------------------------------------------

      var aDisplayStylesWithoutPropText = ["Avatar", "AmountWithCurrency"];

      if (oProps.displayStyle && aDisplayStylesWithoutPropText.indexOf(oProps.displayStyle) === -1 && oDataModelPath.targetObject) {
        oProps.text = oProps.text || FieldTemplating.getTextBinding(oDataModelPath, oProps.formatOptions);
        this.setUpObjectIdentifierTitleAndText(oProps, oDataModelPath);
      } else {
        oProps.text = "";
      } //TODO this is fixed twice
      // data point annotations need not have $Type defined, so add it if missing


      if (((_oProps$dataField$get = oProps.dataField.getObject("@sapui.name")) === null || _oProps$dataField$get === void 0 ? void 0 : _oProps$dataField$get.indexOf("com.sap.vocabularies.UI.v1.DataPoint")) > -1) {
        var oDataPoint = oProps.dataField.getObject();
        oDataPoint.$Type = oDataPoint.$Type || "com.sap.vocabularies.UI.v1.DataPointType";
        oProps.dataField = new TemplateModel(oDataPoint, oProps.dataField.getModel()).createBindingContext("/");
      }

      oProps.emptyIndicatorMode = oProps.formatOptions.showEmptyIndicator ? "On" : undefined;
      return oProps;
    },
    getObjectIdentifierTitle: function (fieldFormatOptions, oPropertyDataModelObjectPath) {
      var _oPropertyDefinition$, _oPropertyDefinition$2, _oPropertyDataModelOb, _oPropertyDataModelOb2, _oPropertyDataModelOb3, _oPropertyDataModelOb4, _oPropertyDataModelOb5, _oPropertyDataModelOb6, _commonText$annotatio, _commonText$annotatio2;

      var propertyBindingExpression = pathInModel(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
      var targetDisplayMode = fieldFormatOptions === null || fieldFormatOptions === void 0 ? void 0 : fieldFormatOptions.displayMode;
      var oPropertyDefinition = oPropertyDataModelObjectPath.targetObject.type === "PropertyPath" ? oPropertyDataModelObjectPath.targetObject.$target : oPropertyDataModelObjectPath.targetObject;
      propertyBindingExpression = UIFormatters.formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);
      var commonText = (_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Common) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.Text;

      if (commonText === undefined) {
        // there is no property for description
        targetDisplayMode = "Value";
      }

      var relativeLocation = getRelativePaths(oPropertyDataModelObjectPath);
      var parametersForFormatter = [];

      if (!!((_oPropertyDataModelOb = oPropertyDataModelObjectPath.targetEntitySet) !== null && _oPropertyDataModelOb !== void 0 && (_oPropertyDataModelOb2 = _oPropertyDataModelOb.annotations) !== null && _oPropertyDataModelOb2 !== void 0 && (_oPropertyDataModelOb3 = _oPropertyDataModelOb2.Common) !== null && _oPropertyDataModelOb3 !== void 0 && _oPropertyDataModelOb3.DraftRoot) || !!((_oPropertyDataModelOb4 = oPropertyDataModelObjectPath.targetEntitySet) !== null && _oPropertyDataModelOb4 !== void 0 && (_oPropertyDataModelOb5 = _oPropertyDataModelOb4.annotations) !== null && _oPropertyDataModelOb5 !== void 0 && (_oPropertyDataModelOb6 = _oPropertyDataModelOb5.Common) !== null && _oPropertyDataModelOb6 !== void 0 && _oPropertyDataModelOb6.DraftNode)) {
        parametersForFormatter.push(Entity.HasDraft);
        parametersForFormatter.push(Entity.IsActive);
      } else {
        parametersForFormatter.push(constant(null));
        parametersForFormatter.push(constant(null));
      }

      switch (targetDisplayMode) {
        case "Value":
          parametersForFormatter.push(propertyBindingExpression);
          parametersForFormatter.push(constant(null));
          break;

        case "Description":
          parametersForFormatter.push(getExpressionFromAnnotation(commonText, relativeLocation));
          parametersForFormatter.push(constant(null));
          break;

        case "ValueDescription":
          parametersForFormatter.push(propertyBindingExpression);
          parametersForFormatter.push(getExpressionFromAnnotation(commonText, relativeLocation));
          break;

        default:
          if (commonText !== null && commonText !== void 0 && (_commonText$annotatio = commonText.annotations) !== null && _commonText$annotatio !== void 0 && (_commonText$annotatio2 = _commonText$annotatio.UI) !== null && _commonText$annotatio2 !== void 0 && _commonText$annotatio2.TextArrangement) {
            parametersForFormatter.push(getExpressionFromAnnotation(commonText, relativeLocation));
            parametersForFormatter.push(propertyBindingExpression);
          } else {
            var _oPropertyDataModelOb7, _oPropertyDataModelOb8, _oPropertyDataModelOb9;

            // if DescriptionValue is set by default and not by TextArrangement
            // we show description in ObjectIdentifier Title and value in ObjectIdentifier Text
            parametersForFormatter.push(getExpressionFromAnnotation(commonText, relativeLocation)); // if DescriptionValue is set by default and property has a semantic object
            // we show description and value in ObjectIdentifier Title

            if ((_oPropertyDataModelOb7 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb7 !== void 0 && (_oPropertyDataModelOb8 = _oPropertyDataModelOb7.annotations) !== null && _oPropertyDataModelOb8 !== void 0 && (_oPropertyDataModelOb9 = _oPropertyDataModelOb8.Common) !== null && _oPropertyDataModelOb9 !== void 0 && _oPropertyDataModelOb9.SemanticObject) {
              parametersForFormatter.push(propertyBindingExpression);
            } else {
              parametersForFormatter.push(constant(null));
            }
          }

          break;
      }

      return compileExpression(formatResult(parametersForFormatter, valueFormatters.formatOPTitle));
    },
    getObjectIdentifierText: function (fieldFormatOptions, oPropertyDataModelObjectPath) {
      var _oPropertyDefinition$3, _oPropertyDefinition$4, _commonText$annotatio3, _commonText$annotatio4;

      var propertyBindingExpression = pathInModel(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
      var targetDisplayMode = fieldFormatOptions === null || fieldFormatOptions === void 0 ? void 0 : fieldFormatOptions.displayMode;
      var oPropertyDefinition = oPropertyDataModelObjectPath.targetObject.type === "PropertyPath" ? oPropertyDataModelObjectPath.targetObject.$target : oPropertyDataModelObjectPath.targetObject;
      var commonText = (_oPropertyDefinition$3 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$3 === void 0 ? void 0 : (_oPropertyDefinition$4 = _oPropertyDefinition$3.Common) === null || _oPropertyDefinition$4 === void 0 ? void 0 : _oPropertyDefinition$4.Text;

      if (commonText === undefined || commonText !== null && commonText !== void 0 && (_commonText$annotatio3 = commonText.annotations) !== null && _commonText$annotatio3 !== void 0 && (_commonText$annotatio4 = _commonText$annotatio3.UI) !== null && _commonText$annotatio4 !== void 0 && _commonText$annotatio4.TextArrangement) {
        return undefined;
      }

      propertyBindingExpression = UIFormatters.formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);

      switch (targetDisplayMode) {
        case "ValueDescription":
          var relativeLocation = getRelativePaths(oPropertyDataModelObjectPath);
          return compileExpression(getExpressionFromAnnotation(commonText, relativeLocation));

        case "DescriptionValue":
          return compileExpression(propertyBindingExpression);

        default:
          return undefined;
      }
    },
    setUpObjectIdentifierTitleAndText: function (_oProps, oPropertyDataModelObjectPath) {
      var _oProps$formatOptions;

      if (((_oProps$formatOptions = _oProps.formatOptions) === null || _oProps$formatOptions === void 0 ? void 0 : _oProps$formatOptions.semanticKeyStyle) === "ObjectIdentifier") {
        var _oPropertyDataModelOb10, _oPropertyDataModelOb11, _oPropertyDataModelOb12;

        _oProps.identifierTitle = this.getObjectIdentifierTitle(_oProps.formatOptions, oPropertyDataModelObjectPath);

        if (!((_oPropertyDataModelOb10 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb10 !== void 0 && (_oPropertyDataModelOb11 = _oPropertyDataModelOb10.annotations) !== null && _oPropertyDataModelOb11 !== void 0 && (_oPropertyDataModelOb12 = _oPropertyDataModelOb11.Common) !== null && _oPropertyDataModelOb12 !== void 0 && _oPropertyDataModelOb12.SemanticObject)) {
          _oProps.identifierText = this.getObjectIdentifierText(_oProps.formatOptions, oPropertyDataModelObjectPath);
        } else {
          _oProps.identifierText = undefined;
        }
      } else {
        _oProps.identifierTitle = undefined;
        _oProps.identifierText = undefined;
      }
    },
    getTextWithWhiteSpace: function (formatOptions, oDataModelPath) {
      var text = FieldTemplating.getTextBinding(oDataModelPath, formatOptions, true);
      return text._type === "PathInModel" || typeof text === "string" ? compileExpression(formatResult([text], "WSR")) : compileExpression(text);
    },
    _getTargetValueDataModelPath: function (oDataField, oDataModelPath) {
      var _oDataField$Value, _sExtraPath;

      if (!(oDataField !== null && oDataField !== void 0 && oDataField.$Type)) {
        return oDataModelPath;
      }

      var sExtraPath = "";
      var targetValueDataModelPath = oDataModelPath;

      switch (oDataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataPointType":
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
          sExtraPath = (_oDataField$Value = oDataField.Value) === null || _oDataField$Value === void 0 ? void 0 : _oDataField$Value.path;
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          if (oDataField.Target.$target) {
            if (oDataField.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataField" || oDataField.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
              var _oDataField$Target$$t;

              sExtraPath = (_oDataField$Target$$t = oDataField.Target.$target.Value) === null || _oDataField$Target$$t === void 0 ? void 0 : _oDataField$Target$$t.path;
            } else {
              var _oDataField$Target;

              sExtraPath = (_oDataField$Target = oDataField.Target) === null || _oDataField$Target === void 0 ? void 0 : _oDataField$Target.path;
            }
          }

          break;
      }

      if (((_sExtraPath = sExtraPath) === null || _sExtraPath === void 0 ? void 0 : _sExtraPath.length) > 0) {
        targetValueDataModelPath = enhanceDataModelPath(oDataModelPath, sExtraPath);
      }

      return targetValueDataModelPath;
    },
    // algorithm to determine the field fragment to use in display and setUp some properties
    setUpDisplayStyle: function (oProps, oDataField, oDataModelPath) {
      var _oProperty$annotation, _oProperty$annotation2, _oDataField$Target2, _oDataField$Target2$$, _oDataField$Target3, _oDataField$Target3$$, _oDataModelPath$targe, _oDataModelPath$targe2, _oDataModelPath$targe3, _oProperty$annotation3, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6, _oProperty$annotation7, _oProperty$annotation8, _oProperty$annotation9, _oProperty$annotation10, _oProperty$annotation11, _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15, _oDataModelPath$navig, _oDataModelPath$navig2;

      var oProperty = oDataModelPath.targetObject;

      if (!oDataModelPath.targetObject) {
        oProps.displayStyle = "Text";
        return;
      }

      if (oProperty.type === "Edm.Stream") {
        oProps.displayStyle = "File";
        return;
      }

      if ((_oProperty$annotation = oProperty.annotations) !== null && _oProperty$annotation !== void 0 && (_oProperty$annotation2 = _oProperty$annotation.UI) !== null && _oProperty$annotation2 !== void 0 && _oProperty$annotation2.IsImageURL) {
        oProps.displayStyle = "Avatar";
        return;
      }

      var hasQuickViewFacets = oProperty ? FieldTemplating.isUsedInNavigationWithQuickViewFacets(oDataModelPath, oProperty) : false;

      switch (oDataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataPointType":
          oProps.displayStyle = "DataPoint";
          return;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          if (((_oDataField$Target2 = oDataField.Target) === null || _oDataField$Target2 === void 0 ? void 0 : (_oDataField$Target2$$ = _oDataField$Target2.$target) === null || _oDataField$Target2$$ === void 0 ? void 0 : _oDataField$Target2$$.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
            oProps.displayStyle = "DataPoint";
            return;
          } else if (((_oDataField$Target3 = oDataField.Target) === null || _oDataField$Target3 === void 0 ? void 0 : (_oDataField$Target3$$ = _oDataField$Target3.$target) === null || _oDataField$Target3$$ === void 0 ? void 0 : _oDataField$Target3$$.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
            oProps.displayStyle = "Contact";
            return;
          }

          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          oProps.displayStyle = "Button";
          return;

        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          this.setUpNavigationAvailable(oProps, oDataField);
          oProps.displayStyle = "Button";
          return;

        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
          oProps.text = this.getTextWithWhiteSpace(oProps.formatOptions, oDataModelPath);
        // falls through

        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
          oProps.displayStyle = "Link";
          return;
      }

      if (oDataModelPath !== null && oDataModelPath !== void 0 && (_oDataModelPath$targe = oDataModelPath.targetEntityType) !== null && _oDataModelPath$targe !== void 0 && (_oDataModelPath$targe2 = _oDataModelPath$targe.annotations) !== null && _oDataModelPath$targe2 !== void 0 && (_oDataModelPath$targe3 = _oDataModelPath$targe2.Common) !== null && _oDataModelPath$targe3 !== void 0 && _oDataModelPath$targe3.SemanticKey) {
        var _oDataModelPath$conte, _oDataModelPath$conte2, _oDataModelPath$conte3, _oDataModelPath$conte4;

        var aSemanticKeys = (_oDataModelPath$conte = oDataModelPath.contextLocation) === null || _oDataModelPath$conte === void 0 ? void 0 : (_oDataModelPath$conte2 = _oDataModelPath$conte.targetEntityType) === null || _oDataModelPath$conte2 === void 0 ? void 0 : (_oDataModelPath$conte3 = _oDataModelPath$conte2.annotations) === null || _oDataModelPath$conte3 === void 0 ? void 0 : (_oDataModelPath$conte4 = _oDataModelPath$conte3.Common) === null || _oDataModelPath$conte4 === void 0 ? void 0 : _oDataModelPath$conte4.SemanticKey;
        var bIsSemanticKey = !(aSemanticKeys !== null && aSemanticKeys !== void 0 && aSemanticKeys.every(function (oKey) {
          var _oKey$$target;

          return (oKey === null || oKey === void 0 ? void 0 : (_oKey$$target = oKey.$target) === null || _oKey$$target === void 0 ? void 0 : _oKey$$target.name) !== oProperty.name;
        }));

        if (bIsSemanticKey && oProps.formatOptions.semanticKeyStyle) {
          var _oDataModelPath$targe4, _oDataModelPath$targe5, _oDataModelPath$targe6;

          oProps.hasQuickViewFacets = hasQuickViewFacets;
          oProps.hasSituationsIndicator = SituationsIndicator.getSituationsNavigationProperty(oDataModelPath.targetEntityType) !== undefined;
          this.setUpObjectIdentifierTitleAndText(oProps, oDataModelPath);

          if ((_oDataModelPath$targe4 = oDataModelPath.targetEntitySet) !== null && _oDataModelPath$targe4 !== void 0 && (_oDataModelPath$targe5 = _oDataModelPath$targe4.annotations) !== null && _oDataModelPath$targe5 !== void 0 && (_oDataModelPath$targe6 = _oDataModelPath$targe5.Common) !== null && _oDataModelPath$targe6 !== void 0 && _oDataModelPath$targe6.DraftRoot) {
            oProps.displayStyle = "SemanticKeyWithDraftIndicator";
            return;
          }

          oProps.displayStyle = oProps.formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
          return;
        }
      }

      if (oDataField.Criticality) {
        oProps.hasQuickViewFacets = hasQuickViewFacets;
        oProps.displayStyle = "ObjectStatus";
        return;
      }

      if ((_oProperty$annotation3 = oProperty.annotations) !== null && _oProperty$annotation3 !== void 0 && (_oProperty$annotation4 = _oProperty$annotation3.Measures) !== null && _oProperty$annotation4 !== void 0 && _oProperty$annotation4.ISOCurrency && String(oProps.formatOptions.isCurrencyAligned) === "true") {
        if (oProps.formatOptions.measureDisplayMode === "Hidden") {
          oProps.displayStyle = "Text";
          return;
        }

        oProps.valueAsStringBindingExpression = FieldTemplating.getValueBinding(oDataModelPath, oProps.formatOptions, true, true, undefined, true);
        oProps.unitBindingExpression = compileExpression(UIFormatters.getBindingForUnitOrCurrency(oDataModelPath));
        oProps.displayStyle = "AmountWithCurrency";
        return;
      }

      if ((_oProperty$annotation5 = oProperty.annotations) !== null && _oProperty$annotation5 !== void 0 && (_oProperty$annotation6 = _oProperty$annotation5.Communication) !== null && _oProperty$annotation6 !== void 0 && _oProperty$annotation6.IsEmailAddress || (_oProperty$annotation7 = oProperty.annotations) !== null && _oProperty$annotation7 !== void 0 && (_oProperty$annotation8 = _oProperty$annotation7.Communication) !== null && _oProperty$annotation8 !== void 0 && _oProperty$annotation8.IsPhoneNumber) {
        oProps.text = this.getTextWithWhiteSpace(oProps.formatOptions, oDataModelPath);
        oProps.displayStyle = "Link";
        return;
      }

      if ((_oProperty$annotation9 = oProperty.annotations) !== null && _oProperty$annotation9 !== void 0 && (_oProperty$annotation10 = _oProperty$annotation9.UI) !== null && _oProperty$annotation10 !== void 0 && _oProperty$annotation10.MultiLineText) {
        oProps.displayStyle = "ExpandableText";
        return;
      }

      if (hasQuickViewFacets) {
        oProps.text = this.getTextWithWhiteSpace(oProps.formatOptions, oDataModelPath);
        oProps.hasQuickViewFacets = true;
        oProps.displayStyle = "LinkWithQuickViewForm";
        return;
      }

      if (oProps.semanticObject && !(oProperty !== null && oProperty !== void 0 && (_oProperty$annotation11 = oProperty.annotations) !== null && _oProperty$annotation11 !== void 0 && (_oProperty$annotation12 = _oProperty$annotation11.Communication) !== null && _oProperty$annotation12 !== void 0 && _oProperty$annotation12.IsEmailAddress || oProperty !== null && oProperty !== void 0 && (_oProperty$annotation13 = oProperty.annotations) !== null && _oProperty$annotation13 !== void 0 && (_oProperty$annotation14 = _oProperty$annotation13.Communication) !== null && _oProperty$annotation14 !== void 0 && _oProperty$annotation14.IsPhoneNumber)) {
        oProps.hasQuickViewFacets = hasQuickViewFacets;
        oProps.text = this.getTextWithWhiteSpace(oProps.formatOptions, oDataModelPath);
        oProps.displayStyle = "LinkWithQuickViewForm";
        return;
      }

      var _oPropertyCommonAnnotations = (_oProperty$annotation15 = oProperty.annotations) === null || _oProperty$annotation15 === void 0 ? void 0 : _oProperty$annotation15.Common;

      var _oPropertyNavigationPropertyAnnotations = oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$navig = oDataModelPath.navigationProperties[0]) === null || _oDataModelPath$navig === void 0 ? void 0 : (_oDataModelPath$navig2 = _oDataModelPath$navig.annotations) === null || _oDataModelPath$navig2 === void 0 ? void 0 : _oDataModelPath$navig2.Common;

      for (var key in _oPropertyCommonAnnotations) {
        if (key.indexOf("SemanticObject") === 0) {
          oProps.hasQuickViewFacets = hasQuickViewFacets;
          oProps.displayStyle = "LinkWrapper";
          return;
        }
      }

      for (var _key in _oPropertyNavigationPropertyAnnotations) {
        if (_key.indexOf("SemanticObject") === 0) {
          oProps.hasQuickViewFacets = hasQuickViewFacets;
          oProps.displayStyle = "LinkWrapper";
          return;
        }
      }

      if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
        oProps.text = this.getTextWithWhiteSpace(oProps.formatOptions, oDataModelPath);
        oProps.displayStyle = "Link";
        return;
      }

      oProps.displayStyle = "Text";
    },
    // algorithm to determine the field fragment to use in edit and set up some properties
    setUpEditStyle: function (oProps, oDataField, oDataModelPath) {
      FieldTemplating.setEditStyleProperties(oProps, oDataField, oDataModelPath);
    },
    setUpEditableProperties: function (oProps, oDataField, oDataModelPath, oMetaModel) {
      var _oDataModelPath$targe7, _oProps$entitySet, _oProps$entitySet2;

      var oPropertyForFieldControl = oDataModelPath !== null && oDataModelPath !== void 0 && (_oDataModelPath$targe7 = oDataModelPath.targetObject) !== null && _oDataModelPath$targe7 !== void 0 && _oDataModelPath$targe7.Value ? oDataModelPath.targetObject.Value : oDataModelPath === null || oDataModelPath === void 0 ? void 0 : oDataModelPath.targetObject;

      if (oProps.editMode !== undefined && oProps.editMode !== null) {
        // Even if it provided as a string it's a valid part of a binding expression that can be later combined into something else.
        oProps.editModeAsObject = oProps.editMode;
      } else {
        var bMeasureReadOnly = oProps.formatOptions.measureDisplayMode ? oProps.formatOptions.measureDisplayMode === "ReadOnly" : false;
        oProps.editModeAsObject = UIFormatters.getEditMode(oPropertyForFieldControl, oDataModelPath, bMeasureReadOnly, true, oDataField);
        oProps.editMode = compileExpression(oProps.editModeAsObject);
      }

      var editableExpression = UIFormatters.getEditableExpressionAsObject(oPropertyForFieldControl, oDataField, oDataModelPath);
      var aRequiredPropertiesFromInsertRestrictions = CommonUtils.getRequiredPropertiesFromInsertRestrictions((_oProps$entitySet = oProps.entitySet) === null || _oProps$entitySet === void 0 ? void 0 : _oProps$entitySet.getPath().replaceAll("/$NavigationPropertyBinding/", "/"), oMetaModel);
      var aRequiredPropertiesFromUpdateRestrictions = CommonUtils.getRequiredPropertiesFromUpdateRestrictions((_oProps$entitySet2 = oProps.entitySet) === null || _oProps$entitySet2 === void 0 ? void 0 : _oProps$entitySet2.getPath().replaceAll("/$NavigationPropertyBinding/", "/"), oMetaModel);
      var oRequiredProperties = {
        requiredPropertiesFromInsertRestrictions: aRequiredPropertiesFromInsertRestrictions,
        requiredPropertiesFromUpdateRestrictions: aRequiredPropertiesFromUpdateRestrictions
      };

      if (ModelHelper.isCollaborationDraftSupported(oMetaModel)) {
        oProps.collaborationEnabled = true; // Expressions needed for Collaboration Visualization

        var collaborationExpression = UIFormatters.getCollaborationExpression(oDataModelPath, CollaborationFormatters.hasCollaborationActivity);
        oProps.collaborationHasActivityExpression = compileExpression(collaborationExpression);
        oProps.collaborationInitialsExpression = compileExpression(UIFormatters.getCollaborationExpression(oDataModelPath, CollaborationFormatters.getCollaborationActivityInitials));
        oProps.collaborationColorExpression = compileExpression(UIFormatters.getCollaborationExpression(oDataModelPath, CollaborationFormatters.getCollaborationActivityColor));
        oProps.editableExpression = compileExpression(and(editableExpression, not(collaborationExpression)));
        oProps.editMode = compileExpression(ifElse(collaborationExpression, constant("ReadOnly"), oProps.editModeAsObject));
      } else {
        oProps.editableExpression = compileExpression(editableExpression);
      }

      oProps.enabledExpression = UIFormatters.getEnabledExpression(oPropertyForFieldControl, oDataField, false, oDataModelPath);
      oProps.requiredExpression = UIFormatters.getRequiredExpression(oPropertyForFieldControl, oDataField, false, false, oRequiredProperties, oDataModelPath);
    },
    setUpFormatOptions: function (oProps, oDataModelPath, oControlConfiguration, mSettings) {
      var _mSettings$models$vie;

      var oOverrideProps = this.getOverrides(oControlConfiguration, oProps.dataField.getPath());

      if (!oProps.formatOptions.displayMode) {
        oProps.formatOptions.displayMode = UIFormatters.getDisplayMode(oDataModelPath);
      }

      oProps.formatOptions.textLinesEdit = oOverrideProps.textLinesEdit || oOverrideProps.formatOptions && oOverrideProps.formatOptions.textLinesEdit || oProps.formatOptions.textLinesEdit || 4;
      oProps.formatOptions.textMaxLines = oOverrideProps.textMaxLines || oOverrideProps.formatOptions && oOverrideProps.formatOptions.textMaxLines || oProps.formatOptions.textMaxLines; // Retrieve text from value list as fallback feature for missing text annotation on the property

      if ((_mSettings$models$vie = mSettings.models.viewData) !== null && _mSettings$models$vie !== void 0 && _mSettings$models$vie.getProperty("/retrieveTextFromValueList")) {
        oProps.formatOptions.retrieveTextFromValueList = FieldTemplating.isRetrieveTextFromValueListEnabled(oDataModelPath.targetObject, oProps.formatOptions);

        if (oProps.formatOptions.retrieveTextFromValueList) {
          var _oDataModelPath$targe8, _oDataModelPath$targe9, _oDataModelPath$targe10;

          // Consider TextArrangement at EntityType otherwise set default display format 'DescriptionValue'
          var hasEntityTextArrangement = !!(oDataModelPath !== null && oDataModelPath !== void 0 && (_oDataModelPath$targe8 = oDataModelPath.targetEntityType) !== null && _oDataModelPath$targe8 !== void 0 && (_oDataModelPath$targe9 = _oDataModelPath$targe8.annotations) !== null && _oDataModelPath$targe9 !== void 0 && (_oDataModelPath$targe10 = _oDataModelPath$targe9.UI) !== null && _oDataModelPath$targe10 !== void 0 && _oDataModelPath$targe10.TextArrangement);
          oProps.formatOptions.displayMode = hasEntityTextArrangement ? oProps.formatOptions.displayMode : "DescriptionValue";
        }
      }

      if (oProps.formatOptions.fieldMode === "nowrapper" && oProps.editMode === "Display") {
        if (oProps._flexId) {
          oProps.noWrapperId = oProps._flexId;
        } else {
          oProps.noWrapperId = oProps.idPrefix ? generate([oProps.idPrefix, "Field-content"]) : undefined;
        }
      }
    },
    setUpSemanticObjects: function (oProps, oDataModelPath) {
      var _oDataModelPath$targe11, _oDataModelPath$targe12;

      var aSemObjExprToResolve = [];
      aSemObjExprToResolve = FieldTemplating.getSemanticObjectExpressionToResolve(oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe11 = oDataModelPath.targetObject) === null || _oDataModelPath$targe11 === void 0 ? void 0 : (_oDataModelPath$targe12 = _oDataModelPath$targe11.annotations) === null || _oDataModelPath$targe12 === void 0 ? void 0 : _oDataModelPath$targe12.Common);
      /**
       * If the field building block has a binding expression in the custom semantic objects,
       * it gets stored to the custom data of the Link in LinkWithQuickViewForm.fragment.xml
       * This is needed to resolve the link at runtime. The QuickViewLinkDelegate.js then gets the resolved
       * binding expression from the custom data.
       * All other custom semantic objects are processed in FieldHelper.js:computeLinkParameters
       */

      if (!!oProps.semanticObject && typeof oProps.semanticObject === "string" && oProps.semanticObject[0] === "{") {
        aSemObjExprToResolve.push({
          key: oProps.semanticObject.substr(1, oProps.semanticObject.length - 2),
          value: oProps.semanticObject
        });
      }

      oProps.semanticObjects = FieldTemplating.getSemanticObjects(aSemObjExprToResolve); // This sets up the semantic links found in the navigation property, if there is no semantic links define before.

      if (!oProps.semanticObject && oDataModelPath.navigationProperties.length > 0) {
        oDataModelPath.navigationProperties.forEach(function (navProperty) {
          var _navProperty$annotati, _navProperty$annotati2;

          if (navProperty !== null && navProperty !== void 0 && (_navProperty$annotati = navProperty.annotations) !== null && _navProperty$annotati !== void 0 && (_navProperty$annotati2 = _navProperty$annotati.Common) !== null && _navProperty$annotati2 !== void 0 && _navProperty$annotati2.SemanticObject) {
            oProps.semanticObject = navProperty.annotations.Common.SemanticObject;
            oProps.hasSemanticObjectOnNavigation = true;
          }
        });
      }
    },
    setUpNavigationAvailable: function (oProps, oDataField) {
      oProps.navigationAvailable = true;

      if ((oDataField === null || oDataField === void 0 ? void 0 : oDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && oDataField.NavigationAvailable !== undefined && String(oProps.formatOptions.ignoreNavigationAvailable) !== "true") {
        oProps.navigationAvailable = compileExpression(getExpressionFromAnnotation(oDataField.NavigationAvailable));
      }
    }
  });
  return Field;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWVsZCIsIk1hY3JvTWV0YWRhdGEiLCJleHRlbmQiLCJuYW1lIiwibmFtZXNwYWNlIiwiZnJhZ21lbnQiLCJtZXRhZGF0YSIsInN0ZXJlb3R5cGUiLCJkZXNpZ250aW1lIiwicHJvcGVydGllcyIsImlkUHJlZml4IiwidHlwZSIsIl9hcGlJZCIsIm5vV3JhcHBlcklkIiwidmhJZFByZWZpeCIsImRlZmF1bHRWYWx1ZSIsIl92aEZsZXhJZCIsImNvbXB1dGVkIiwiZW50aXR5U2V0IiwicmVxdWlyZWQiLCIka2luZCIsImVudGl0eVR5cGUiLCJwYXJlbnRFbnRpdHlTZXQiLCJuYXZpZ2F0ZUFmdGVyQWN0aW9uIiwiZGF0YUZpZWxkIiwiJFR5cGUiLCJzZW1hbnRpY09iamVjdHMiLCJlZGl0TW9kZSIsIndyYXAiLCJhcmlhTGFiZWxsZWRCeSIsInRleHRBbGlnbiIsImVkaXRhYmxlRXhwcmVzc2lvbiIsImVuYWJsZWRFeHByZXNzaW9uIiwiY29sbGFib3JhdGlvbkVuYWJsZWQiLCJjb2xsYWJvcmF0aW9uSGFzQWN0aXZpdHlFeHByZXNzaW9uIiwiY29sbGFib3JhdGlvbkluaXRpYWxzRXhwcmVzc2lvbiIsImNvbGxhYm9yYXRpb25Db2xvckV4cHJlc3Npb24iLCJzZW1hbnRpY09iamVjdCIsImhhc1NlbWFudGljT2JqZWN0T25OYXZpZ2F0aW9uIiwiZm9ybWF0T3B0aW9ucyIsImlzQ3VycmVuY3lBbGlnbmVkIiwiY29udGFpbnNFcnJvclZpc2liaWxpdHkiLCJ0ZXh0QWxpZ25Nb2RlIiwiYWxsb3dlZFZhbHVlcyIsImRpc3BsYXlNb2RlIiwiZmllbGRNb2RlIiwibWVhc3VyZURpc3BsYXlNb2RlIiwidGV4dExpbmVzRWRpdCIsImNvbmZpZ3VyYWJsZSIsInRleHRNYXhMaW5lcyIsInRleHRNYXhDaGFyYWN0ZXJzRGlzcGxheSIsInRleHRFeHBhbmRCZWhhdmlvckRpc3BsYXkiLCJzaG93RW1wdHlJbmRpY2F0b3IiLCJzZW1hbnRpY0tleVN0eWxlIiwiaGFzRHJhZnRJbmRpY2F0b3IiLCJzaG93SWNvblVybCIsImlnbm9yZU5hdmlnYXRpb25BdmFpbGFibGUiLCJpc0FuYWx5dGljcyIsInJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3QiLCJjb21wYWN0U2VtYW50aWNLZXkiLCJmaWVsZEdyb3VwRHJhZnRJbmRpY2F0b3JQcm9wZXJ0eVBhdGgiLCJmaWVsZEdyb3VwTmFtZSIsImV2ZW50cyIsIm9uQ2hhbmdlIiwiZ2V0T3ZlcnJpZGVzIiwibUNvbnRyb2xDb25maWd1cmF0aW9uIiwic0lEIiwib1Byb3BzIiwib0NvbnRyb2xDb25maWciLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInNDb25maWdLZXkiLCJzZXRVcERhdGFQb2ludFR5cGUiLCJvRGF0YUZpZWxkIiwidGVybSIsInNldFVwVmlzaWJsZVByb3BlcnRpZXMiLCJvRmllbGRQcm9wcyIsIm9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgiLCJ2aXNpYmxlIiwiRmllbGRUZW1wbGF0aW5nIiwiZ2V0VmlzaWJsZUV4cHJlc3Npb24iLCJkaXNwbGF5VmlzaWJsZSIsInVuZGVmaW5lZCIsInNldFVwUGFyZW50RW50aXR5U2V0IiwibVNldHRpbmdzIiwiY29udGV4dExvY2F0aW9uIiwibW9kZWxzIiwibWV0YU1vZGVsIiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJzdGFydGluZ0VudGl0eVNldCIsImNyZWF0ZSIsIm9Db250cm9sQ29uZmlndXJhdGlvbiIsIm9EYXRhRmllbGRDb252ZXJ0ZWQiLCJNZXRhTW9kZWxDb252ZXJ0ZXIiLCJjb252ZXJ0TWV0YU1vZGVsQ29udGV4dCIsIm9EYXRhTW9kZWxQYXRoIiwiZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzIiwiX2ZsZXhJZCIsImdldENvbnRlbnRJZCIsIl9nZXRUYXJnZXRWYWx1ZURhdGFNb2RlbFBhdGgiLCJzZXRVcFNlbWFudGljT2JqZWN0cyIsImRhdGFTb3VyY2VQYXRoIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsIm9NZXRhTW9kZWwiLCJ0YXJnZXRFbnRpdHlUeXBlIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwic2V0VXBFZGl0YWJsZVByb3BlcnRpZXMiLCJzZXRVcEZvcm1hdE9wdGlvbnMiLCJzZXRVcERpc3BsYXlTdHlsZSIsInNldFVwRWRpdFN0eWxlIiwiYURpc3BsYXlTdHlsZXNXaXRob3V0UHJvcFRleHQiLCJkaXNwbGF5U3R5bGUiLCJpbmRleE9mIiwidGFyZ2V0T2JqZWN0IiwidGV4dCIsImdldFRleHRCaW5kaW5nIiwic2V0VXBPYmplY3RJZGVudGlmaWVyVGl0bGVBbmRUZXh0IiwiZ2V0T2JqZWN0Iiwib0RhdGFQb2ludCIsIlRlbXBsYXRlTW9kZWwiLCJnZXRNb2RlbCIsImVtcHR5SW5kaWNhdG9yTW9kZSIsImdldE9iamVjdElkZW50aWZpZXJUaXRsZSIsImZpZWxkRm9ybWF0T3B0aW9ucyIsInByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24iLCJwYXRoSW5Nb2RlbCIsImdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgiLCJ0YXJnZXREaXNwbGF5TW9kZSIsIm9Qcm9wZXJ0eURlZmluaXRpb24iLCIkdGFyZ2V0IiwiVUlGb3JtYXR0ZXJzIiwiZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbiIsImNvbW1vblRleHQiLCJhbm5vdGF0aW9ucyIsIkNvbW1vbiIsIlRleHQiLCJyZWxhdGl2ZUxvY2F0aW9uIiwiZ2V0UmVsYXRpdmVQYXRocyIsInBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIiLCJ0YXJnZXRFbnRpdHlTZXQiLCJEcmFmdFJvb3QiLCJEcmFmdE5vZGUiLCJwdXNoIiwiRW50aXR5IiwiSGFzRHJhZnQiLCJJc0FjdGl2ZSIsImNvbnN0YW50IiwiZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uIiwiVUkiLCJUZXh0QXJyYW5nZW1lbnQiLCJTZW1hbnRpY09iamVjdCIsImNvbXBpbGVFeHByZXNzaW9uIiwiZm9ybWF0UmVzdWx0IiwidmFsdWVGb3JtYXR0ZXJzIiwiZm9ybWF0T1BUaXRsZSIsImdldE9iamVjdElkZW50aWZpZXJUZXh0IiwiX29Qcm9wcyIsImlkZW50aWZpZXJUaXRsZSIsImlkZW50aWZpZXJUZXh0IiwiZ2V0VGV4dFdpdGhXaGl0ZVNwYWNlIiwiX3R5cGUiLCJzRXh0cmFQYXRoIiwidGFyZ2V0VmFsdWVEYXRhTW9kZWxQYXRoIiwiVmFsdWUiLCJwYXRoIiwiVGFyZ2V0IiwibGVuZ3RoIiwiZW5oYW5jZURhdGFNb2RlbFBhdGgiLCJvUHJvcGVydHkiLCJJc0ltYWdlVVJMIiwiaGFzUXVpY2tWaWV3RmFjZXRzIiwiaXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cyIsInNldFVwTmF2aWdhdGlvbkF2YWlsYWJsZSIsIlNlbWFudGljS2V5IiwiYVNlbWFudGljS2V5cyIsImJJc1NlbWFudGljS2V5IiwiZXZlcnkiLCJvS2V5IiwiaGFzU2l0dWF0aW9uc0luZGljYXRvciIsIlNpdHVhdGlvbnNJbmRpY2F0b3IiLCJnZXRTaXR1YXRpb25zTmF2aWdhdGlvblByb3BlcnR5IiwiQ3JpdGljYWxpdHkiLCJNZWFzdXJlcyIsIklTT0N1cnJlbmN5IiwiU3RyaW5nIiwidmFsdWVBc1N0cmluZ0JpbmRpbmdFeHByZXNzaW9uIiwiZ2V0VmFsdWVCaW5kaW5nIiwidW5pdEJpbmRpbmdFeHByZXNzaW9uIiwiZ2V0QmluZGluZ0ZvclVuaXRPckN1cnJlbmN5IiwiQ29tbXVuaWNhdGlvbiIsIklzRW1haWxBZGRyZXNzIiwiSXNQaG9uZU51bWJlciIsIk11bHRpTGluZVRleHQiLCJfb1Byb3BlcnR5Q29tbW9uQW5ub3RhdGlvbnMiLCJfb1Byb3BlcnR5TmF2aWdhdGlvblByb3BlcnR5QW5ub3RhdGlvbnMiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsImtleSIsInNldEVkaXRTdHlsZVByb3BlcnRpZXMiLCJvUHJvcGVydHlGb3JGaWVsZENvbnRyb2wiLCJlZGl0TW9kZUFzT2JqZWN0IiwiYk1lYXN1cmVSZWFkT25seSIsImdldEVkaXRNb2RlIiwiZ2V0RWRpdGFibGVFeHByZXNzaW9uQXNPYmplY3QiLCJhUmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyIsIkNvbW1vblV0aWxzIiwiZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyIsImdldFBhdGgiLCJyZXBsYWNlQWxsIiwiYVJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMiLCJnZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tVXBkYXRlUmVzdHJpY3Rpb25zIiwib1JlcXVpcmVkUHJvcGVydGllcyIsInJlcXVpcmVkUHJvcGVydGllc0Zyb21JbnNlcnRSZXN0cmljdGlvbnMiLCJyZXF1aXJlZFByb3BlcnRpZXNGcm9tVXBkYXRlUmVzdHJpY3Rpb25zIiwiTW9kZWxIZWxwZXIiLCJpc0NvbGxhYm9yYXRpb25EcmFmdFN1cHBvcnRlZCIsImNvbGxhYm9yYXRpb25FeHByZXNzaW9uIiwiZ2V0Q29sbGFib3JhdGlvbkV4cHJlc3Npb24iLCJDb2xsYWJvcmF0aW9uRm9ybWF0dGVycyIsImhhc0NvbGxhYm9yYXRpb25BY3Rpdml0eSIsImdldENvbGxhYm9yYXRpb25BY3Rpdml0eUluaXRpYWxzIiwiZ2V0Q29sbGFib3JhdGlvbkFjdGl2aXR5Q29sb3IiLCJhbmQiLCJub3QiLCJpZkVsc2UiLCJnZXRFbmFibGVkRXhwcmVzc2lvbiIsInJlcXVpcmVkRXhwcmVzc2lvbiIsImdldFJlcXVpcmVkRXhwcmVzc2lvbiIsIm9PdmVycmlkZVByb3BzIiwiZ2V0RGlzcGxheU1vZGUiLCJ2aWV3RGF0YSIsImdldFByb3BlcnR5IiwiaXNSZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0RW5hYmxlZCIsImhhc0VudGl0eVRleHRBcnJhbmdlbWVudCIsImdlbmVyYXRlIiwiYVNlbU9iakV4cHJUb1Jlc29sdmUiLCJnZXRTZW1hbnRpY09iamVjdEV4cHJlc3Npb25Ub1Jlc29sdmUiLCJzdWJzdHIiLCJ2YWx1ZSIsImdldFNlbWFudGljT2JqZWN0cyIsIm5hdlByb3BlcnR5IiwibmF2aWdhdGlvbkF2YWlsYWJsZSIsIk5hdmlnYXRpb25BdmFpbGFibGUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkZpZWxkLm1ldGFkYXRhLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRW50aXR5U2V0LCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgU2VtYW50aWNPYmplY3QgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NvbW1vblwiO1xuaW1wb3J0IHsgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCAqIGFzIE1ldGFNb2RlbENvbnZlcnRlciBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCAqIGFzIENvbGxhYm9yYXRpb25Gb3JtYXR0ZXJzIGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL0NvbGxhYm9yYXRpb25Gb3JtYXR0ZXJcIjtcbmltcG9ydCB2YWx1ZUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVmFsdWVGb3JtYXR0ZXJcIjtcbmltcG9ydCB7XG5cdGFuZCxcblx0QmluZGluZ1Rvb2xraXRFeHByZXNzaW9uLFxuXHRDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbixcblx0Y29tcGlsZUV4cHJlc3Npb24sXG5cdGNvbnN0YW50LFxuXHRmb3JtYXRSZXN1bHQsXG5cdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbixcblx0aWZFbHNlLFxuXHRub3QsXG5cdHBhdGhJbk1vZGVsXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCBUZW1wbGF0ZU1vZGVsIGZyb20gXCJzYXAvZmUvY29yZS9UZW1wbGF0ZU1vZGVsXCI7XG5pbXBvcnQgdHlwZSB7IERhdGFNb2RlbE9iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQge1xuXHRlbmhhbmNlRGF0YU1vZGVsUGF0aCxcblx0Z2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCxcblx0Z2V0UmVsYXRpdmVQYXRocyxcblx0Z2V0VGFyZ2V0T2JqZWN0UGF0aFxufSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IERpc3BsYXlNb2RlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgKiBhcyBVSUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgKiBhcyBGaWVsZFRlbXBsYXRpbmcgZnJvbSBcInNhcC9mZS9tYWNyb3MvZmllbGQvRmllbGRUZW1wbGF0aW5nXCI7XG5pbXBvcnQgTWFjcm9NZXRhZGF0YSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9NYWNyb01ldGFkYXRhXCI7XG5pbXBvcnQgU2l0dWF0aW9uc0luZGljYXRvciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9zaXR1YXRpb25zL1NpdHVhdGlvbnNJbmRpY2F0b3IuZnJhZ21lbnRcIjtcblxudHlwZSBEaXNwbGF5U3R5bGUgPVxuXHR8IFwiVGV4dFwiXG5cdHwgXCJBdmF0YXJcIlxuXHR8IFwiRmlsZVwiXG5cdHwgXCJEYXRhUG9pbnRcIlxuXHR8IFwiQ29udGFjdFwiXG5cdHwgXCJCdXR0b25cIlxuXHR8IFwiTGlua1wiXG5cdHwgXCJPYmplY3RTdGF0dXNcIlxuXHR8IFwiQW1vdW50V2l0aEN1cnJlbmN5XCJcblx0fCBcIlNlbWFudGljS2V5V2l0aERyYWZ0SW5kaWNhdG9yXCJcblx0fCBcIk9iamVjdElkZW50aWZpZXJcIlxuXHR8IFwiTGFiZWxTZW1hbnRpY0tleVwiXG5cdHwgXCJMaW5rV2l0aFF1aWNrVmlld0Zvcm1cIlxuXHR8IFwiTGlua1dyYXBwZXJcIlxuXHR8IFwiRXhwYW5kYWJsZVRleHRcIjtcblxudHlwZSBFZGl0U3R5bGUgPVxuXHR8IFwiSW5wdXRXaXRoVmFsdWVIZWxwXCJcblx0fCBcIlRleHRBcmVhXCJcblx0fCBcIkZpbGVcIlxuXHR8IFwiRGF0ZVBpY2tlclwiXG5cdHwgXCJUaW1lUGlja2VyXCJcblx0fCBcIkRhdGVUaW1lUGlja2VyXCJcblx0fCBcIkNoZWNrQm94XCJcblx0fCBcIklucHV0V2l0aFVuaXRcIlxuXHR8IFwiSW5wdXRcIlxuXHR8IFwiUmF0aW5nSW5kaWNhdG9yXCI7XG5cbnR5cGUgRmllbGRGb3JtYXRPcHRpb25zID0gUGFydGlhbDx7XG5cdGNvbnRhaW5zRXJyb3JWaXNpYmlsaXR5OiBzdHJpbmc7XG5cdGRpc3BsYXlNb2RlOiBEaXNwbGF5TW9kZTtcblx0ZmllbGRNb2RlOiBzdHJpbmc7XG5cdGhhc0RyYWZ0SW5kaWNhdG9yOiBib29sZWFuO1xuXHRpc0FuYWx5dGljczogYm9vbGVhbjtcblx0aWdub3JlTmF2aWdhdGlvbkF2YWlsYWJsZTogYm9vbGVhbjtcblx0aXNDdXJyZW5jeUFsaWduZWQ6IGJvb2xlYW47XG5cdG1lYXN1cmVEaXNwbGF5TW9kZTogc3RyaW5nO1xuXHRyZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0OiBib29sZWFuO1xuXHRzZW1hbnRpY2tleXM6IHN0cmluZ1tdO1xuXHRzZW1hbnRpY0tleVN0eWxlOiBzdHJpbmc7XG5cdHNob3dFbXB0eUluZGljYXRvcjogYm9vbGVhbjtcblx0c2hvd0ljb25Vcmw6IGJvb2xlYW47XG5cdHRleHRBbGlnbk1vZGU6IHN0cmluZztcblx0dGV4dExpbmVzRWRpdDogc3RyaW5nO1xuXHR0ZXh0TWF4TGluZXM6IHN0cmluZztcblx0Y29tcGFjdFNlbWFudGljS2V5OiBzdHJpbmc7XG5cdGZpZWxkR3JvdXBEcmFmdEluZGljYXRvclByb3BlcnR5UGF0aDogc3RyaW5nO1xuXHRmaWVsZEdyb3VwTmFtZTogc3RyaW5nO1xufT47XG5cbmV4cG9ydCB0eXBlIEZpZWxkUHJvcGVydGllcyA9IHtcblx0ZGF0YUZpZWxkOiBhbnk7XG5cdGVkaXRNb2RlPzogYW55O1xuXHRlbnRpdHlTZXQ6IGFueTtcblx0ZW50aXR5VHlwZT86IGFueTtcblx0cGFyZW50RW50aXR5U2V0PzogYW55O1xuXHRmb3JtYXRPcHRpb25zOiBGaWVsZEZvcm1hdE9wdGlvbnM7XG5cdGlkUHJlZml4Pzogc3RyaW5nO1xuXHRzZW1hbnRpY09iamVjdD86IHN0cmluZyB8IFNlbWFudGljT2JqZWN0O1xuXHR2aElkUHJlZml4Pzogc3RyaW5nO1xuXHRfYXBpSWQ/OiBzdHJpbmc7XG5cblx0Ly8gY29tcHV0ZWQgcHJvcGVydGllc1xuXHRoYXNTaXR1YXRpb25zSW5kaWNhdG9yOiBib29sZWFuO1xuXHRjb2xsYWJvcmF0aW9uQ29sb3JFeHByZXNzaW9uPzogc3RyaW5nO1xuXHRjb2xsYWJvcmF0aW9uRW5hYmxlZD86IGJvb2xlYW47XG5cdGNvbGxhYm9yYXRpb25IYXNBY3Rpdml0eUV4cHJlc3Npb24/OiBzdHJpbmc7XG5cdGNvbGxhYm9yYXRpb25Jbml0aWFsc0V4cHJlc3Npb24/OiBzdHJpbmc7XG5cdGRhdGFTb3VyY2VQYXRoPzogc3RyaW5nO1xuXHRkZXNjcmlwdGlvbkJpbmRpbmdFeHByZXNzaW9uPzogc3RyaW5nO1xuXHRkaXNwbGF5U3R5bGU6IERpc3BsYXlTdHlsZTtcblx0ZGlzcGxheVZpc2libGU/OiBzdHJpbmc7XG5cdGVkaXRhYmxlRXhwcmVzc2lvbj86IHN0cmluZztcblx0ZWRpdE1vZGVBc09iamVjdD86IGFueTtcblx0ZWRpdFN0eWxlPzogRWRpdFN0eWxlIHwgbnVsbDtcblx0ZW5hYmxlZEV4cHJlc3Npb24/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0ZW1wdHlJbmRpY2F0b3JNb2RlPzogXCJPblwiO1xuXHRmaWVsZFdyYXBwZXJJZD86IHN0cmluZztcblx0aGFzUXVpY2tWaWV3RmFjZXRzPzogYm9vbGVhbjtcblx0bm9XcmFwcGVySWQ/OiBzdHJpbmc7XG5cdG5hdmlnYXRpb25BdmFpbGFibGU/OiBib29sZWFuIHwgc3RyaW5nO1xuXHRyZXF1aXJlZEV4cHJlc3Npb24/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0c2hvd1RpbWV6b25lPzogYm9vbGVhbjtcblx0c2VtYW50aWNPYmplY3RzPzogc3RyaW5nO1xuXHR0ZXh0Pzogc3RyaW5nIHwgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4gfCBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0aWRlbnRpZmllclRpdGxlPzogc3RyaW5nIHwgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4gfCBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0aWRlbnRpZmllclRleHQ/OiBzdHJpbmcgfCBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPiB8IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHR0ZXh0QmluZGluZ0V4cHJlc3Npb24/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0dW5pdEJpbmRpbmdFeHByZXNzaW9uPzogc3RyaW5nO1xuXHR1bml0RWRpdGFibGU/OiBzdHJpbmc7XG5cdHZhbHVlQmluZGluZ0V4cHJlc3Npb24/OiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjtcblx0dmFsdWVBc1N0cmluZ0JpbmRpbmdFeHByZXNzaW9uPzogQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdF9mbGV4SWQ/OiBzdHJpbmc7XG5cdF92aEZsZXhJZD86IHN0cmluZztcblx0dmlzaWJsZT86IHN0cmluZztcblx0aGFzU2VtYW50aWNPYmplY3RPbk5hdmlnYXRpb24/OiBib29sZWFuO1xufTtcblxudHlwZSBGaWVsZFR5cGUgPSB7XG5cdG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzO1xuXHRnZXRDb250ZW50SWQ6IChzSUQ6IHN0cmluZykgPT4gc3RyaW5nO1xuXHRzZXRVcERpc3BsYXlTdHlsZTogKG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzLCBvRGF0YUZpZWxkOiBhbnksIG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKSA9PiB2b2lkO1xuXHRzZXRVcEVkaXRTdHlsZTogKG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzLCBvRGF0YUZpZWxkOiBhbnksIG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKSA9PiB2b2lkO1xuXHRnZXRPdmVycmlkZXM6IChtQ29udHJvbENvbmZpZ3VyYXRpb246IGFueSwgc0lEOiBzdHJpbmcpID0+IHsgW2luZGV4OiBzdHJpbmddOiBhbnkgfTtcblx0c2V0VXBFZGl0YWJsZVByb3BlcnRpZXM6IChvUHJvcHM6IEZpZWxkUHJvcGVydGllcywgb0RhdGFGaWVsZDogYW55LCBvRGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCwgb01ldGFNb2RlbDogYW55KSA9PiB2b2lkO1xuXHRzZXRVcEZvcm1hdE9wdGlvbnM6IChvUHJvcHM6IEZpZWxkUHJvcGVydGllcywgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsIG9Db250cm9sQ29uZmlndXJhdGlvbjogYW55LCBtU2V0dGluZ3M6IGFueSkgPT4gdm9pZDtcblx0c2V0VXBTZW1hbnRpY09iamVjdHM6IChvUHJvcHM6IEZpZWxkUHJvcGVydGllcywgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpID0+IHZvaWQ7XG5cdHNldFVwTmF2aWdhdGlvbkF2YWlsYWJsZTogKG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzLCBvRGF0YUZpZWxkOiBhbnkpID0+IHZvaWQ7XG5cdHNldFVwRGF0YVBvaW50VHlwZTogKG9EYXRhRmllbGQ6IGFueSkgPT4gdm9pZDtcblx0X2dldFRhcmdldFZhbHVlRGF0YU1vZGVsUGF0aDogKG9EYXRhRmllbGQ6IGFueSwgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpID0+IERhdGFNb2RlbE9iamVjdFBhdGg7XG5cdGdldFRleHRXaXRoV2hpdGVTcGFjZTogKGZvcm1hdE9wdGlvbnM6IEZpZWxkRm9ybWF0T3B0aW9ucywgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpID0+IHN0cmluZztcblx0Z2V0T2JqZWN0SWRlbnRpZmllclRpdGxlOiAoXG5cdFx0ZmllbGRGb3JtYXRPcHRpb25zOiBGaWVsZEZvcm1hdE9wdGlvbnMsXG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuXHQpID0+IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+IHwgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdGdldE9iamVjdElkZW50aWZpZXJUZXh0OiAoXG5cdFx0ZmllbGRGb3JtYXRPcHRpb25zOiBGaWVsZEZvcm1hdE9wdGlvbnMsXG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuXHQpID0+IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+IHwgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb247XG5cdHNldFVwVmlzaWJsZVByb3BlcnRpZXMob1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsIG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKTogdm9pZDtcblx0c2V0VXBQYXJlbnRFbnRpdHlTZXQob1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsIG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLCBtU2V0dGluZ3M6IGFueSk6IHZvaWQ7XG5cdHNldFVwT2JqZWN0SWRlbnRpZmllclRpdGxlQW5kVGV4dChvUHJvcHM6IEZpZWxkUHJvcGVydGllcywgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiB2b2lkO1xufTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjXG4gKiBCdWlsZGluZyBibG9jayBmb3IgY3JlYXRpbmcgYSBGaWVsZCBiYXNlZCBvbiB0aGUgbWV0YWRhdGEgcHJvdmlkZWQgYnkgT0RhdGEgVjQuXG4gKiA8YnI+XG4gKiBVc3VhbGx5LCBhIERhdGFGaWVsZCBhbm5vdGF0aW9uIGlzIGV4cGVjdGVkXG4gKlxuICogVXNhZ2UgZXhhbXBsZTpcbiAqIDxwcmU+XG4gKiA8aW50ZXJuYWxNYWNybzpGaWVsZFxuICogICBpZFByZWZpeD1cIlNvbWVQcmVmaXhcIlxuICogICBjb250ZXh0UGF0aD1cIntlbnRpdHlTZXQ+fVwiXG4gKiAgIG1ldGFQYXRoPVwie2RhdGFGaWVsZD59XCJcbiAqIC8+XG4gKiA8L3ByZT5cbiAqIEBjbGFzcyBzYXAuZmUubWFjcm9zLmludGVybmFsLkZpZWxkXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQGV4cGVyaW1lbnRhbFxuICogQHNpbmNlIDEuOTQuMFxuICovXG5jb25zdCBGaWVsZCA9IE1hY3JvTWV0YWRhdGEuZXh0ZW5kKFwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbC5GaWVsZFwiLCB7XG5cdC8qKlxuXHQgKiBOYW1lIG9mIHRoZSBtYWNybyBjb250cm9sLlxuXHQgKi9cblx0bmFtZTogXCJGaWVsZFwiLFxuXHQvKipcblx0ICogTmFtZXNwYWNlIG9mIHRoZSBtYWNybyBjb250cm9sXG5cdCAqL1xuXHRuYW1lc3BhY2U6IFwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbFwiLFxuXHQvKipcblx0ICogRnJhZ21lbnQgc291cmNlIG9mIHRoZSBtYWNybyAob3B0aW9uYWwpIC0gaWYgbm90IHNldCwgZnJhZ21lbnQgaXMgZ2VuZXJhdGVkIGZyb20gbmFtZXNwYWNlIGFuZCBuYW1lXG5cdCAqL1xuXHRmcmFnbWVudDogXCJzYXAuZmUubWFjcm9zLmludGVybmFsLkZpZWxkXCIsXG5cblx0LyoqXG5cdCAqIFRoZSBtZXRhZGF0YSBkZXNjcmliaW5nIHRoZSBtYWNybyBjb250cm9sLlxuXHQgKi9cblx0bWV0YWRhdGE6IHtcblx0XHQvKipcblx0XHQgKiBEZWZpbmUgbWFjcm8gc3RlcmVvdHlwZSBmb3IgZG9jdW1lbnRhdGlvblxuXHRcdCAqL1xuXHRcdHN0ZXJlb3R5cGU6IFwieG1sbWFjcm9cIixcblx0XHQvKipcblx0XHQgKiBMb2NhdGlvbiBvZiB0aGUgZGVzaWdudGltZSBpbmZvXG5cdFx0ICovXG5cdFx0ZGVzaWdudGltZTogXCJzYXAvZmUvbWFjcm9zL2ludGVybmFsL0ZpZWxkLmRlc2lnbnRpbWVcIixcblx0XHQvKipcblx0XHQgKiBQcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogUHJlZml4IGFkZGVkIHRvIHRoZSBnZW5lcmF0ZWQgSUQgb2YgdGhlIGZpZWxkXG5cdFx0XHQgKi9cblx0XHRcdGlkUHJlZml4OiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHRfYXBpSWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdG5vV3JhcHBlcklkOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFByZWZpeCBhZGRlZCB0byB0aGUgZ2VuZXJhdGVkIElEIG9mIHRoZSB2YWx1ZSBoZWxwIHVzZWQgZm9yIHRoZSBmaWVsZFxuXHRcdFx0ICovXG5cdFx0XHR2aElkUHJlZml4OiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogXCJGaWVsZFZhbHVlSGVscFwiXG5cdFx0XHR9LFxuXG5cdFx0XHRfdmhGbGV4SWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0Y29tcHV0ZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIE1ldGFkYXRhIHBhdGggdG8gdGhlIGVudGl0eSBzZXRcblx0XHRcdCAqL1xuXHRcdFx0ZW50aXR5U2V0OiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdCRraW5kOiBbXCJFbnRpdHlTZXRcIiwgXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiwgXCJFbnRpdHlUeXBlXCIsIFwiU2luZ2xldG9uXCJdXG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIE1ldGFkYXRhIHBhdGggdG8gdGhlIGVudGl0eSBzZXRcblx0XHRcdCAqL1xuXHRcdFx0ZW50aXR5VHlwZToge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZSxcblx0XHRcdFx0Y29tcHV0ZWQ6IHRydWUsXG5cdFx0XHRcdCRraW5kOiBbXCJFbnRpdHlUeXBlXCJdXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQYXJlbnQgZW50aXR5IHNldFxuXHRcdFx0ICovXG5cdFx0XHRwYXJlbnRFbnRpdHlTZXQ6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2UsXG5cdFx0XHRcdCRraW5kOiBbXCJFbnRpdHlTZXRcIiwgXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiwgXCJFbnRpdHlUeXBlXCIsIFwiU2luZ2xldG9uXCJdXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBGbGFnIGluZGljYXRpbmcgd2hldGhlciBhY3Rpb24gd2lsbCBuYXZpZ2F0ZSBhZnRlciBleGVjdXRpb25cblx0XHRcdCAqL1xuXHRcdFx0bmF2aWdhdGVBZnRlckFjdGlvbjoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBNZXRhZGF0YSBwYXRoIHRvIHRoZSBkYXRhRmllbGQuXG5cdFx0XHQgKiBUaGlzIHByb3BlcnR5IGlzIHVzdWFsbHkgYSBtZXRhZGF0YUNvbnRleHQgcG9pbnRpbmcgdG8gYSBEYXRhRmllbGQgaGF2aW5nXG5cdFx0XHQgKiAkVHlwZSBvZiBEYXRhRmllbGQsIERhdGFGaWVsZFdpdGhVcmwsIERhdGFGaWVsZEZvckFubm90YXRpb24sIERhdGFGaWVsZEZvckFjdGlvbiwgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLCBEYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGgsIG9yIERhdGFQb2ludFR5cGUuXG5cdFx0XHQgKiBCdXQgaXQgY2FuIGFsc28gYmUgYSBQcm9wZXJ0eSB3aXRoICRraW5kPVwiUHJvcGVydHlcIlxuXHRcdFx0ICovXG5cdFx0XHRkYXRhRmllbGQ6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0JGtpbmQ6IFtcIlByb3BlcnR5XCJdLFxuXHRcdFx0XHQkVHlwZTogW1xuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkXCIsXG5cdFx0XHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoVXJsXCIsXG5cdFx0XHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBbm5vdGF0aW9uXCIsXG5cdFx0XHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIixcblx0XHRcdFx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiLFxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aEFjdGlvblwiLFxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvblwiLFxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoXCIsXG5cdFx0XHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRUeXBlXCJcblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogQ29udGV4dCBwb2ludGluZyB0byBhbiBhcnJheSBvZiB0aGUgcHJvcGVydHkncyBzZW1hbnRpYyBvYmplY3RzXG5cdFx0XHQgKi9cblx0XHRcdHNlbWFudGljT2JqZWN0czoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZSxcblx0XHRcdFx0Y29tcHV0ZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEVkaXQgTW9kZSBvZiB0aGUgZmllbGQuXG5cdFx0XHQgKlxuXHRcdFx0ICogSWYgdGhlIGVkaXRNb2RlIGlzIHVuZGVmaW5lZCB0aGVuIHdlIGNvbXB1dGUgaXQgYmFzZWQgb24gdGhlIG1ldGFkYXRhXG5cdFx0XHQgKiBPdGhlcndpc2Ugd2UgdXNlIHRoZSB2YWx1ZSBwcm92aWRlZCBoZXJlLlxuXHRcdFx0ICovXG5cdFx0XHRlZGl0TW9kZToge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tZGMuZW51bS5FZGl0TW9kZVwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBXcmFwIGZpZWxkXG5cdFx0XHQgKi9cblx0XHRcdHdyYXA6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIENTUyBjbGFzcyBmb3IgbWFyZ2luXG5cdFx0XHQgKi9cblx0XHRcdFwiY2xhc3NcIjoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQcm9wZXJ0eSBhZGRlZCB0byBhc3NvY2lhdGUgdGhlIGxhYmVsIHdpdGggdGhlIEZpZWxkXG5cdFx0XHQgKi9cblx0XHRcdGFyaWFMYWJlbGxlZEJ5OiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cblx0XHRcdHRleHRBbGlnbjoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5jb3JlLlRleHRBbGlnblwiXG5cdFx0XHR9LFxuXHRcdFx0ZWRpdGFibGVFeHByZXNzaW9uOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGNvbXB1dGVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0ZW5hYmxlZEV4cHJlc3Npb246IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0Y29tcHV0ZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRjb2xsYWJvcmF0aW9uRW5hYmxlZDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0Y29tcHV0ZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRjb2xsYWJvcmF0aW9uSGFzQWN0aXZpdHlFeHByZXNzaW9uOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGNvbXB1dGVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0Y29sbGFib3JhdGlvbkluaXRpYWxzRXhwcmVzc2lvbjoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRjb21wdXRlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGNvbGxhYm9yYXRpb25Db2xvckV4cHJlc3Npb246IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0Y29tcHV0ZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIE9wdGlvbiB0byBhZGQgYSBzZW1hbnRpYyBvYmplY3QgdG8gYSBmaWVsZFxuXHRcdFx0ICovXG5cdFx0XHRzZW1hbnRpY09iamVjdDoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHRoYXNTZW1hbnRpY09iamVjdE9uTmF2aWdhdGlvbjoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0T3B0aW9uczoge1xuXHRcdFx0XHR0eXBlOiBcIm9iamVjdFwiLFxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7XG5cdFx0XHRcdFx0aXNDdXJyZW5jeUFsaWduZWQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogZXhwcmVzc2lvbiBmb3IgT2JqZWN0U3RhdHVzIHZpc2libGUgcHJvcGVydHlcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRjb250YWluc0Vycm9yVmlzaWJpbGl0eToge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogRGVzY3JpYmUgaG93IHRoZSBhbGlnbm1lbnQgd29ya3MgYmV0d2VlbiBUYWJsZSBtb2RlIChEYXRlIGFuZCBOdW1lcmljIEVuZCBhbGlnbm1lbnQpIGFuZCBGb3JtIG1vZGUgKG51bWVyaWMgYWxpZ25lZCBFbmQgaW4gZWRpdCBhbmQgQmVnaW4gaW4gZGlzcGxheSlcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR0ZXh0QWxpZ25Nb2RlOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBcIlRhYmxlXCIsXG5cdFx0XHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbXCJUYWJsZVwiLCBcIkZvcm1cIl1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGRpc3BsYXlNb2RlOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRcdFx0YWxsb3dlZFZhbHVlczogW1wiVmFsdWVcIiwgXCJEZXNjcmlwdGlvblwiLCBcIlZhbHVlRGVzY3JpcHRpb25cIiwgXCJEZXNjcmlwdGlvblZhbHVlXCJdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmaWVsZE1vZGU6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbXCJub3dyYXBwZXJcIiwgXCJcIl1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1lYXN1cmVEaXNwbGF5TW9kZToge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0XHRcdGFsbG93ZWRWYWx1ZXM6IFtcIkhpZGRlblwiLCBcIlJlYWRPbmx5XCJdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBNYXhpbXVtIG51bWJlciBvZiBsaW5lcyBmb3IgbXVsdGlsaW5lIHRleHRzIGluIGVkaXQgbW9kZVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRleHRMaW5lc0VkaXQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwibnVtYmVyXCIsXG5cdFx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIE1heGltdW0gbnVtYmVyIG9mIGxpbmVzIHRoYXQgbXVsdGlsaW5lIHRleHRzIGluIGVkaXQgbW9kZSBjYW4gZ3JvdyB0b1xuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRleHRNYXhMaW5lczoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIixcblx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogTWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHRleHQgZmllbGQgdGhhdCBhcmUgc2hvd24gaW5pdGlhbGx5LlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRleHRNYXhDaGFyYWN0ZXJzRGlzcGxheToge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJudW1iZXJcIixcblx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogRGVmaW5lcyBob3cgdGhlIGZ1bGwgdGV4dCB3aWxsIGJlIGRpc3BsYXllZCAtIEluUGxhY2Ugb3IgUG9wb3ZlclxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRleHRFeHBhbmRCZWhhdmlvckRpc3BsYXk6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbXCJJblBsYWNlXCIsIFwiUG9wb3ZlclwiXVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogSWYgc2V0IHRvICd0cnVlJywgU0FQIEZpb3JpIGVsZW1lbnRzIHNob3dzIGFuIGVtcHR5IGluZGljYXRvciBpbiBkaXNwbGF5IG1vZGUgZm9yIHRoZSB0ZXh0IGFuZCBsaW5rc1xuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHNob3dFbXB0eUluZGljYXRvcjoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBQcmVmZXJyZWQgY29udHJvbCBpZiBhIHNlbWFudGljS2V5IGlzIHVzZWQgKGlmIHRoZSBzZW1hbnRpY0tleSBpcyBlbXB0eSwgbm8gc3BlY2lmaWMgcnVsZXMgYXBwbHkpXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0c2VtYW50aWNLZXlTdHlsZToge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0XHRcdGRlZmF1bHRWYWx1ZTogXCJcIixcblx0XHRcdFx0XHRcdGFsbG93ZWRWYWx1ZXM6IFtcIk9iamVjdElkZW50aWZpZXJcIiwgXCJMYWJlbFwiLCBcIlwiXVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aGFzRHJhZnRJbmRpY2F0b3I6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogSWYgdHJ1ZSB0aGVuIHNldHMgdGhlIGdpdmVuIGljb24gaW5zdGVhZCBvZiB0ZXh0IGluIEFjdGlvbi9JQk4gQnV0dG9uXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0c2hvd0ljb25Vcmw6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogSWYgdHJ1ZSB0aGVuIG5hdmlnYXRpb25hdmFpbGFibGUgcHJvcGVydHkgd2lsbCBub3QgYmUgdXNlZCBmb3IgZW5hYmxlbWVudCBvZiBJQk4gYnV0dG9uXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWdub3JlTmF2aWdhdGlvbkF2YWlsYWJsZToge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpc0FuYWx5dGljczoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIEVuYWJsZXMgdGhlIGZhbGxiYWNrIGZlYXR1cmUgZm9yIHVzYWdlIHRoZSB0ZXh0IGFubm90YXRpb24gZnJvbSB0aGUgdmFsdWUgbGlzdHNcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRyZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNvbXBhY3RTZW1hbnRpY0tleToge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmaWVsZEdyb3VwRHJhZnRJbmRpY2F0b3JQcm9wZXJ0eVBhdGg6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZpZWxkR3JvdXBOYW1lOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGV2ZW50czoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBFdmVudCBoYW5kbGVyIGZvciBjaGFuZ2UgZXZlbnRcblx0XHRcdCAqL1xuXHRcdFx0b25DaGFuZ2U6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRnZXRPdmVycmlkZXM6IGZ1bmN0aW9uIChtQ29udHJvbENvbmZpZ3VyYXRpb246IGFueSwgc0lEOiBzdHJpbmcpIHtcblx0XHRjb25zdCBvUHJvcHM6IHsgW2luZGV4OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXHRcdGlmIChtQ29udHJvbENvbmZpZ3VyYXRpb24pIHtcblx0XHRcdGNvbnN0IG9Db250cm9sQ29uZmlnID0gbUNvbnRyb2xDb25maWd1cmF0aW9uW3NJRF07XG5cdFx0XHRpZiAob0NvbnRyb2xDb25maWcpIHtcblx0XHRcdFx0T2JqZWN0LmtleXMob0NvbnRyb2xDb25maWcpLmZvckVhY2goZnVuY3Rpb24gKHNDb25maWdLZXkpIHtcblx0XHRcdFx0XHRvUHJvcHNbc0NvbmZpZ0tleV0gPSBvQ29udHJvbENvbmZpZ1tzQ29uZmlnS2V5XTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvUHJvcHM7XG5cdH0sXG5cdHNldFVwRGF0YVBvaW50VHlwZTogZnVuY3Rpb24gKG9EYXRhRmllbGQ6IGFueSkge1xuXHRcdC8vIGRhdGEgcG9pbnQgYW5ub3RhdGlvbnMgbmVlZCBub3QgaGF2ZSAkVHlwZSBkZWZpbmVkLCBzbyBhZGQgaXQgaWYgbWlzc2luZ1xuXHRcdGlmIChvRGF0YUZpZWxkPy50ZXJtID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFwiKSB7XG5cdFx0XHRvRGF0YUZpZWxkLiRUeXBlID0gb0RhdGFGaWVsZC4kVHlwZSB8fCBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlO1xuXHRcdH1cblx0fSxcblx0c2V0VXBWaXNpYmxlUHJvcGVydGllczogZnVuY3Rpb24gKG9GaWVsZFByb3BzOiBGaWVsZFByb3BlcnRpZXMsIG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpIHtcblx0XHQvLyB3ZSBkbyB0aGlzIGJlZm9yZSBlbmhhbmNpbmcgdGhlIGRhdGFNb2RlbFBhdGggc28gdGhhdCBpdCBzdGlsbCBwb2ludHMgYXQgdGhlIERhdGFGaWVsZFxuXHRcdG9GaWVsZFByb3BzLnZpc2libGUgPSBGaWVsZFRlbXBsYXRpbmcuZ2V0VmlzaWJsZUV4cHJlc3Npb24ob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgb0ZpZWxkUHJvcHMuZm9ybWF0T3B0aW9ucyk7XG5cdFx0b0ZpZWxkUHJvcHMuZGlzcGxheVZpc2libGUgPSBvRmllbGRQcm9wcy5mb3JtYXRPcHRpb25zLmZpZWxkTW9kZSA9PT0gXCJub3dyYXBwZXJcIiA/IG9GaWVsZFByb3BzLnZpc2libGUgOiB1bmRlZmluZWQ7XG5cdH0sXG5cdHNldFVwUGFyZW50RW50aXR5U2V0OiBmdW5jdGlvbiAob0ZpZWxkUHJvcHM6IEZpZWxkUHJvcGVydGllcywgb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCwgbVNldHRpbmdzOiBhbnkpIHtcblx0XHRpZiAob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aD8uY29udGV4dExvY2F0aW9uICYmIG1TZXR0aW5ncz8ubW9kZWxzPy5tZXRhTW9kZWwpIHtcblx0XHRcdG9GaWVsZFByb3BzLnBhcmVudEVudGl0eVNldCA9IG1TZXR0aW5ncy5tb2RlbHMubWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFxuXHRcdFx0XHRgLyR7XG5cdFx0XHRcdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24uc3RhcnRpbmdFbnRpdHlTZXRcblx0XHRcdFx0XHRcdD8gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24uc3RhcnRpbmdFbnRpdHlTZXQubmFtZVxuXHRcdFx0XHRcdFx0OiBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWVcblx0XHRcdFx0fWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uICh0aGlzOiBGaWVsZFR5cGUsIG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzLCBvQ29udHJvbENvbmZpZ3VyYXRpb246IGFueSwgbVNldHRpbmdzOiBhbnkpIHtcblx0XHRjb25zdCBvRGF0YUZpZWxkQ29udmVydGVkID0gTWV0YU1vZGVsQ29udmVydGVyLmNvbnZlcnRNZXRhTW9kZWxDb250ZXh0KG9Qcm9wcy5kYXRhRmllbGQpO1xuXHRcdGxldCBvRGF0YU1vZGVsUGF0aCA9IE1ldGFNb2RlbENvbnZlcnRlci5nZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob1Byb3BzLmRhdGFGaWVsZCwgb1Byb3BzLmVudGl0eVNldCk7XG5cdFx0dGhpcy5zZXRVcERhdGFQb2ludFR5cGUob0RhdGFGaWVsZENvbnZlcnRlZCk7XG5cdFx0dGhpcy5zZXRVcFZpc2libGVQcm9wZXJ0aWVzKG9Qcm9wcywgb0RhdGFNb2RlbFBhdGgpO1xuXHRcdHRoaXMuc2V0VXBQYXJlbnRFbnRpdHlTZXQob1Byb3BzLCBvRGF0YU1vZGVsUGF0aCwgbVNldHRpbmdzKTtcblxuXHRcdGlmIChvUHJvcHMuX2ZsZXhJZCkge1xuXHRcdFx0b1Byb3BzLl9hcGlJZCA9IG9Qcm9wcy5fZmxleElkO1xuXHRcdFx0b1Byb3BzLl9mbGV4SWQgPSB0aGlzLmdldENvbnRlbnRJZChvUHJvcHMuX2ZsZXhJZCk7XG5cdFx0XHRvUHJvcHMuX3ZoRmxleElkID0gYCR7b1Byb3BzLl9mbGV4SWR9XyR7b1Byb3BzLnZoSWRQcmVmaXh9YDtcblx0XHR9XG5cblx0XHRvRGF0YU1vZGVsUGF0aCA9IHRoaXMuX2dldFRhcmdldFZhbHVlRGF0YU1vZGVsUGF0aChvRGF0YUZpZWxkQ29udmVydGVkLCBvRGF0YU1vZGVsUGF0aCk7XG5cdFx0dGhpcy5zZXRVcFNlbWFudGljT2JqZWN0cyhvUHJvcHMsIG9EYXRhTW9kZWxQYXRoKTtcblx0XHRvUHJvcHMuZGF0YVNvdXJjZVBhdGggPSBnZXRUYXJnZXRPYmplY3RQYXRoKG9EYXRhTW9kZWxQYXRoKTtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gbVNldHRpbmdzLm1vZGVscy5tZXRhTW9kZWwgfHwgbVNldHRpbmdzLm1vZGVscy5lbnRpdHlTZXQ7XG5cdFx0b1Byb3BzLmVudGl0eVR5cGUgPSBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KGAvJHtvRGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZX1gKTtcblxuXHRcdHRoaXMuc2V0VXBFZGl0YWJsZVByb3BlcnRpZXMob1Byb3BzLCBvRGF0YUZpZWxkQ29udmVydGVkLCBvRGF0YU1vZGVsUGF0aCwgb01ldGFNb2RlbCk7XG5cdFx0dGhpcy5zZXRVcEZvcm1hdE9wdGlvbnMob1Byb3BzLCBvRGF0YU1vZGVsUGF0aCwgb0NvbnRyb2xDb25maWd1cmF0aW9uLCBtU2V0dGluZ3MpO1xuXHRcdHRoaXMuc2V0VXBEaXNwbGF5U3R5bGUob1Byb3BzLCBvRGF0YUZpZWxkQ29udmVydGVkLCBvRGF0YU1vZGVsUGF0aCk7XG5cdFx0dGhpcy5zZXRVcEVkaXRTdHlsZShvUHJvcHMsIG9EYXRhRmllbGRDb252ZXJ0ZWQsIG9EYXRhTW9kZWxQYXRoKTtcblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29tcHV0ZSBiaW5kaW5ncy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRjb25zdCBhRGlzcGxheVN0eWxlc1dpdGhvdXRQcm9wVGV4dCA9IFtcIkF2YXRhclwiLCBcIkFtb3VudFdpdGhDdXJyZW5jeVwiXTtcblx0XHRpZiAob1Byb3BzLmRpc3BsYXlTdHlsZSAmJiBhRGlzcGxheVN0eWxlc1dpdGhvdXRQcm9wVGV4dC5pbmRleE9mKG9Qcm9wcy5kaXNwbGF5U3R5bGUpID09PSAtMSAmJiBvRGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QpIHtcblx0XHRcdG9Qcm9wcy50ZXh0ID0gb1Byb3BzLnRleHQgfHwgRmllbGRUZW1wbGF0aW5nLmdldFRleHRCaW5kaW5nKG9EYXRhTW9kZWxQYXRoLCBvUHJvcHMuZm9ybWF0T3B0aW9ucyk7XG5cdFx0XHR0aGlzLnNldFVwT2JqZWN0SWRlbnRpZmllclRpdGxlQW5kVGV4dChvUHJvcHMsIG9EYXRhTW9kZWxQYXRoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b1Byb3BzLnRleHQgPSBcIlwiO1xuXHRcdH1cblxuXHRcdC8vVE9ETyB0aGlzIGlzIGZpeGVkIHR3aWNlXG5cdFx0Ly8gZGF0YSBwb2ludCBhbm5vdGF0aW9ucyBuZWVkIG5vdCBoYXZlICRUeXBlIGRlZmluZWQsIHNvIGFkZCBpdCBpZiBtaXNzaW5nXG5cdFx0aWYgKG9Qcm9wcy5kYXRhRmllbGQuZ2V0T2JqZWN0KFwiQHNhcHVpLm5hbWVcIik/LmluZGV4T2YoXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIikgPiAtMSkge1xuXHRcdFx0Y29uc3Qgb0RhdGFQb2ludCA9IG9Qcm9wcy5kYXRhRmllbGQuZ2V0T2JqZWN0KCk7XG5cdFx0XHRvRGF0YVBvaW50LiRUeXBlID0gb0RhdGFQb2ludC4kVHlwZSB8fCBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlO1xuXHRcdFx0b1Byb3BzLmRhdGFGaWVsZCA9IG5ldyBUZW1wbGF0ZU1vZGVsKG9EYXRhUG9pbnQsIG9Qcm9wcy5kYXRhRmllbGQuZ2V0TW9kZWwoKSkuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpO1xuXHRcdH1cblxuXHRcdG9Qcm9wcy5lbXB0eUluZGljYXRvck1vZGUgPSBvUHJvcHMuZm9ybWF0T3B0aW9ucy5zaG93RW1wdHlJbmRpY2F0b3IgPyBcIk9uXCIgOiB1bmRlZmluZWQ7XG5cblx0XHRyZXR1cm4gb1Byb3BzO1xuXHR9LFxuXG5cdGdldE9iamVjdElkZW50aWZpZXJUaXRsZTogZnVuY3Rpb24gKFxuXHRcdGZpZWxkRm9ybWF0T3B0aW9uczogRmllbGRGb3JtYXRPcHRpb25zLFxuXHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGhcblx0KTogQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4gfCBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB7XG5cdFx0bGV0IHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxhbnk+ID0gcGF0aEluTW9kZWwoXG5cdFx0XHRnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpXG5cdFx0KTtcblx0XHRsZXQgdGFyZ2V0RGlzcGxheU1vZGUgPSBmaWVsZEZvcm1hdE9wdGlvbnM/LmRpc3BsYXlNb2RlO1xuXHRcdGNvbnN0IG9Qcm9wZXJ0eURlZmluaXRpb24gPVxuXHRcdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QudHlwZSA9PT0gXCJQcm9wZXJ0eVBhdGhcIlxuXHRcdFx0XHQ/IChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0IGFzIFByb3BlcnR5KVxuXHRcdFx0XHQ6IChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCBhcyBQcm9wZXJ0eSk7XG5cdFx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiA9IFVJRm9ybWF0dGVycy5mb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uKG9Qcm9wZXJ0eURlZmluaXRpb24sIHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24pO1xuXG5cdFx0Y29uc3QgY29tbW9uVGV4dCA9IG9Qcm9wZXJ0eURlZmluaXRpb24uYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGV4dDtcblx0XHRpZiAoY29tbW9uVGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyB0aGVyZSBpcyBubyBwcm9wZXJ0eSBmb3IgZGVzY3JpcHRpb25cblx0XHRcdHRhcmdldERpc3BsYXlNb2RlID0gXCJWYWx1ZVwiO1xuXHRcdH1cblx0XHRjb25zdCByZWxhdGl2ZUxvY2F0aW9uID0gZ2V0UmVsYXRpdmVQYXRocyhvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoKTtcblxuXHRcdGNvbnN0IHBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIgPSBbXTtcblxuXHRcdGlmIChcblx0XHRcdCEhKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5U2V0IGFzIEVudGl0eVNldCk/LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdCB8fFxuXHRcdFx0ISEob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlTZXQgYXMgRW50aXR5U2V0KT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnROb2RlXG5cdFx0KSB7XG5cdFx0XHRwYXJhbWV0ZXJzRm9yRm9ybWF0dGVyLnB1c2goRW50aXR5Lkhhc0RyYWZ0KTtcblx0XHRcdHBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIucHVzaChFbnRpdHkuSXNBY3RpdmUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbWV0ZXJzRm9yRm9ybWF0dGVyLnB1c2goY29uc3RhbnQobnVsbCkpO1xuXHRcdFx0cGFyYW1ldGVyc0ZvckZvcm1hdHRlci5wdXNoKGNvbnN0YW50KG51bGwpKTtcblx0XHR9XG5cblx0XHRzd2l0Y2ggKHRhcmdldERpc3BsYXlNb2RlKSB7XG5cdFx0XHRjYXNlIFwiVmFsdWVcIjpcblx0XHRcdFx0cGFyYW1ldGVyc0ZvckZvcm1hdHRlci5wdXNoKHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24pO1xuXHRcdFx0XHRwYXJhbWV0ZXJzRm9yRm9ybWF0dGVyLnB1c2goY29uc3RhbnQobnVsbCkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRwYXJhbWV0ZXJzRm9yRm9ybWF0dGVyLnB1c2goZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGNvbW1vblRleHQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+KTtcblx0XHRcdFx0cGFyYW1ldGVyc0ZvckZvcm1hdHRlci5wdXNoKGNvbnN0YW50KG51bGwpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRwYXJhbWV0ZXJzRm9yRm9ybWF0dGVyLnB1c2gocHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbik7XG5cdFx0XHRcdHBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIucHVzaChnZXRFeHByZXNzaW9uRnJvbUFubm90YXRpb24oY29tbW9uVGV4dCwgcmVsYXRpdmVMb2NhdGlvbikgYXMgQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uPHN0cmluZz4pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmIChjb21tb25UZXh0Py5hbm5vdGF0aW9ucz8uVUk/LlRleHRBcnJhbmdlbWVudCkge1xuXHRcdFx0XHRcdHBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIucHVzaChcblx0XHRcdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihjb21tb25UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cGFyYW1ldGVyc0ZvckZvcm1hdHRlci5wdXNoKHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGlmIERlc2NyaXB0aW9uVmFsdWUgaXMgc2V0IGJ5IGRlZmF1bHQgYW5kIG5vdCBieSBUZXh0QXJyYW5nZW1lbnRcblx0XHRcdFx0XHQvLyB3ZSBzaG93IGRlc2NyaXB0aW9uIGluIE9iamVjdElkZW50aWZpZXIgVGl0bGUgYW5kIHZhbHVlIGluIE9iamVjdElkZW50aWZpZXIgVGV4dFxuXHRcdFx0XHRcdHBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIucHVzaChcblx0XHRcdFx0XHRcdGdldEV4cHJlc3Npb25Gcm9tQW5ub3RhdGlvbihjb21tb25UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248c3RyaW5nPlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Ly8gaWYgRGVzY3JpcHRpb25WYWx1ZSBpcyBzZXQgYnkgZGVmYXVsdCBhbmQgcHJvcGVydHkgaGFzIGEgc2VtYW50aWMgb2JqZWN0XG5cdFx0XHRcdFx0Ly8gd2Ugc2hvdyBkZXNjcmlwdGlvbiBhbmQgdmFsdWUgaW4gT2JqZWN0SWRlbnRpZmllciBUaXRsZVxuXHRcdFx0XHRcdGlmIChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3QpIHtcblx0XHRcdFx0XHRcdHBhcmFtZXRlcnNGb3JGb3JtYXR0ZXIucHVzaChwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFyYW1ldGVyc0ZvckZvcm1hdHRlci5wdXNoKGNvbnN0YW50KG51bGwpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihmb3JtYXRSZXN1bHQocGFyYW1ldGVyc0ZvckZvcm1hdHRlciBhcyBhbnksIHZhbHVlRm9ybWF0dGVycy5mb3JtYXRPUFRpdGxlKSk7XG5cdH0sXG5cblx0Z2V0T2JqZWN0SWRlbnRpZmllclRleHQ6IGZ1bmN0aW9uIChcblx0XHRmaWVsZEZvcm1hdE9wdGlvbnM6IEZpZWxkRm9ybWF0T3B0aW9ucyxcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoXG5cdCk6IEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+IHwgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24ge1xuXHRcdGxldCBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uOiBCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb248YW55PiA9IHBhdGhJbk1vZGVsKFxuXHRcdFx0Z2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoKVxuXHRcdCk7XG5cdFx0Y29uc3QgdGFyZ2V0RGlzcGxheU1vZGUgPSBmaWVsZEZvcm1hdE9wdGlvbnM/LmRpc3BsYXlNb2RlO1xuXHRcdGNvbnN0IG9Qcm9wZXJ0eURlZmluaXRpb24gPVxuXHRcdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QudHlwZSA9PT0gXCJQcm9wZXJ0eVBhdGhcIlxuXHRcdFx0XHQ/IChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0IGFzIFByb3BlcnR5KVxuXHRcdFx0XHQ6IChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCBhcyBQcm9wZXJ0eSk7XG5cblx0XHRjb25zdCBjb21tb25UZXh0ID0gb1Byb3BlcnR5RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0O1xuXHRcdGlmIChjb21tb25UZXh0ID09PSB1bmRlZmluZWQgfHwgY29tbW9uVGV4dD8uYW5ub3RhdGlvbnM/LlVJPy5UZXh0QXJyYW5nZW1lbnQpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24gPSBVSUZvcm1hdHRlcnMuZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihvUHJvcGVydHlEZWZpbml0aW9uLCBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uKTtcblxuXHRcdHN3aXRjaCAodGFyZ2V0RGlzcGxheU1vZGUpIHtcblx0XHRcdGNhc2UgXCJWYWx1ZURlc2NyaXB0aW9uXCI6XG5cdFx0XHRcdGNvbnN0IHJlbGF0aXZlTG9jYXRpb24gPSBnZXRSZWxhdGl2ZVBhdGhzKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRcdFx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKGNvbW1vblRleHQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbjxzdHJpbmc+KTtcblx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblZhbHVlXCI6XG5cdFx0XHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9LFxuXG5cdHNldFVwT2JqZWN0SWRlbnRpZmllclRpdGxlQW5kVGV4dChfb1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsIG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpIHtcblx0XHRpZiAoX29Qcm9wcy5mb3JtYXRPcHRpb25zPy5zZW1hbnRpY0tleVN0eWxlID09PSBcIk9iamVjdElkZW50aWZpZXJcIikge1xuXHRcdFx0X29Qcm9wcy5pZGVudGlmaWVyVGl0bGUgPSB0aGlzLmdldE9iamVjdElkZW50aWZpZXJUaXRsZShfb1Byb3BzLmZvcm1hdE9wdGlvbnMsIG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRcdFx0aWYgKCFvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3QpIHtcblx0XHRcdFx0X29Qcm9wcy5pZGVudGlmaWVyVGV4dCA9IHRoaXMuZ2V0T2JqZWN0SWRlbnRpZmllclRleHQoX29Qcm9wcy5mb3JtYXRPcHRpb25zLCBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdF9vUHJvcHMuaWRlbnRpZmllclRleHQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9vUHJvcHMuaWRlbnRpZmllclRpdGxlID0gdW5kZWZpbmVkO1xuXHRcdFx0X29Qcm9wcy5pZGVudGlmaWVyVGV4dCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH0sXG5cblx0Z2V0VGV4dFdpdGhXaGl0ZVNwYWNlOiBmdW5jdGlvbiAoZm9ybWF0T3B0aW9uczogRmllbGRGb3JtYXRPcHRpb25zLCBvRGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCkge1xuXHRcdGNvbnN0IHRleHQgPSBGaWVsZFRlbXBsYXRpbmcuZ2V0VGV4dEJpbmRpbmcob0RhdGFNb2RlbFBhdGgsIGZvcm1hdE9wdGlvbnMsIHRydWUpO1xuXHRcdHJldHVybiAodGV4dCBhcyBhbnkpLl90eXBlID09PSBcIlBhdGhJbk1vZGVsXCIgfHwgdHlwZW9mIHRleHQgPT09IFwic3RyaW5nXCJcblx0XHRcdD8gY29tcGlsZUV4cHJlc3Npb24oZm9ybWF0UmVzdWx0KFt0ZXh0XSwgXCJXU1JcIikpXG5cdFx0XHQ6IGNvbXBpbGVFeHByZXNzaW9uKHRleHQpO1xuXHR9LFxuXG5cdF9nZXRUYXJnZXRWYWx1ZURhdGFNb2RlbFBhdGg6IGZ1bmN0aW9uIChvRGF0YUZpZWxkOiBhbnksIG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdFx0aWYgKCFvRGF0YUZpZWxkPy4kVHlwZSkge1xuXHRcdFx0cmV0dXJuIG9EYXRhTW9kZWxQYXRoO1xuXHRcdH1cblx0XHRsZXQgc0V4dHJhUGF0aCA9IFwiXCI7XG5cdFx0bGV0IHRhcmdldFZhbHVlRGF0YU1vZGVsUGF0aCA9IG9EYXRhTW9kZWxQYXRoO1xuXG5cdFx0c3dpdGNoIChvRGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZTpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uOlxuXHRcdFx0XHRzRXh0cmFQYXRoID0gb0RhdGFGaWVsZC5WYWx1ZT8ucGF0aDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb246XG5cdFx0XHRcdGlmIChvRGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0KSB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0b0RhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkIHx8XG5cdFx0XHRcdFx0XHRvRGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRzRXh0cmFQYXRoID0gb0RhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC5WYWx1ZT8ucGF0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c0V4dHJhUGF0aCA9IG9EYXRhRmllbGQuVGFyZ2V0Py5wYXRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0aWYgKHNFeHRyYVBhdGg/Lmxlbmd0aCA+IDApIHtcblx0XHRcdHRhcmdldFZhbHVlRGF0YU1vZGVsUGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKG9EYXRhTW9kZWxQYXRoLCBzRXh0cmFQYXRoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldFZhbHVlRGF0YU1vZGVsUGF0aDtcblx0fSxcblx0Ly8gYWxnb3JpdGhtIHRvIGRldGVybWluZSB0aGUgZmllbGQgZnJhZ21lbnQgdG8gdXNlIGluIGRpc3BsYXkgYW5kIHNldFVwIHNvbWUgcHJvcGVydGllc1xuXHRzZXRVcERpc3BsYXlTdHlsZTogZnVuY3Rpb24gKHRoaXM6IEZpZWxkVHlwZSwgb1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsIG9EYXRhRmllbGQ6IGFueSwgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiB2b2lkIHtcblx0XHRjb25zdCBvUHJvcGVydHk6IFByb3BlcnR5ID0gb0RhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0IGFzIFByb3BlcnR5O1xuXHRcdGlmICghb0RhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0KSB7XG5cdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJUZXh0XCI7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChvUHJvcGVydHkudHlwZSA9PT0gXCJFZG0uU3RyZWFtXCIpIHtcblx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkZpbGVcIjtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LklzSW1hZ2VVUkwpIHtcblx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkF2YXRhclwiO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBoYXNRdWlja1ZpZXdGYWNldHMgPSBvUHJvcGVydHkgPyBGaWVsZFRlbXBsYXRpbmcuaXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cyhvRGF0YU1vZGVsUGF0aCwgb1Byb3BlcnR5KSA6IGZhbHNlO1xuXG5cdFx0c3dpdGNoIChvRGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGU6XG5cdFx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkRhdGFQb2ludFwiO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb246XG5cdFx0XHRcdGlmIChvRGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGUpIHtcblx0XHRcdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJEYXRhUG9pbnRcIjtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSBpZiAob0RhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFR5cGVcIikge1xuXHRcdFx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkNvbnRhY3RcIjtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRcdFx0b1Byb3BzLmRpc3BsYXlTdHlsZSA9IFwiQnV0dG9uXCI7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0XHR0aGlzLnNldFVwTmF2aWdhdGlvbkF2YWlsYWJsZShvUHJvcHMsIG9EYXRhRmllbGQpO1xuXHRcdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJCdXR0b25cIjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0XHRvUHJvcHMudGV4dCA9IHRoaXMuZ2V0VGV4dFdpdGhXaGl0ZVNwYWNlKG9Qcm9wcy5mb3JtYXRPcHRpb25zLCBvRGF0YU1vZGVsUGF0aCk7XG5cdFx0XHQvLyBmYWxscyB0aHJvdWdoXG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbjpcblx0XHRcdFx0b1Byb3BzLmRpc3BsYXlTdHlsZSA9IFwiTGlua1wiO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChvRGF0YU1vZGVsUGF0aD8udGFyZ2V0RW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNLZXkpIHtcblx0XHRcdGNvbnN0IGFTZW1hbnRpY0tleXMgPSBvRGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24/LnRhcmdldEVudGl0eVR5cGU/LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljS2V5O1xuXHRcdFx0Y29uc3QgYklzU2VtYW50aWNLZXkgPSAhYVNlbWFudGljS2V5cz8uZXZlcnkoZnVuY3Rpb24gKG9LZXkpIHtcblx0XHRcdFx0cmV0dXJuIG9LZXk/LiR0YXJnZXQ/Lm5hbWUgIT09IG9Qcm9wZXJ0eS5uYW1lO1xuXHRcdFx0fSk7XG5cdFx0XHRpZiAoYklzU2VtYW50aWNLZXkgJiYgb1Byb3BzLmZvcm1hdE9wdGlvbnMuc2VtYW50aWNLZXlTdHlsZSkge1xuXHRcdFx0XHRvUHJvcHMuaGFzUXVpY2tWaWV3RmFjZXRzID0gaGFzUXVpY2tWaWV3RmFjZXRzO1xuXHRcdFx0XHRvUHJvcHMuaGFzU2l0dWF0aW9uc0luZGljYXRvciA9XG5cdFx0XHRcdFx0U2l0dWF0aW9uc0luZGljYXRvci5nZXRTaXR1YXRpb25zTmF2aWdhdGlvblByb3BlcnR5KG9EYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVR5cGUpICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRcdHRoaXMuc2V0VXBPYmplY3RJZGVudGlmaWVyVGl0bGVBbmRUZXh0KG9Qcm9wcywgb0RhdGFNb2RlbFBhdGgpO1xuXHRcdFx0XHRpZiAoKG9EYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldCBhcyBFbnRpdHlTZXQpPy5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdFJvb3QpIHtcblx0XHRcdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJTZW1hbnRpY0tleVdpdGhEcmFmdEluZGljYXRvclwiO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID1cblx0XHRcdFx0XHRvUHJvcHMuZm9ybWF0T3B0aW9ucy5zZW1hbnRpY0tleVN0eWxlID09PSBcIk9iamVjdElkZW50aWZpZXJcIiA/IFwiT2JqZWN0SWRlbnRpZmllclwiIDogXCJMYWJlbFNlbWFudGljS2V5XCI7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKG9EYXRhRmllbGQuQ3JpdGljYWxpdHkpIHtcblx0XHRcdG9Qcm9wcy5oYXNRdWlja1ZpZXdGYWNldHMgPSBoYXNRdWlja1ZpZXdGYWNldHM7XG5cdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJPYmplY3RTdGF0dXNcIjtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5ICYmIFN0cmluZyhvUHJvcHMuZm9ybWF0T3B0aW9ucy5pc0N1cnJlbmN5QWxpZ25lZCkgPT09IFwidHJ1ZVwiKSB7XG5cdFx0XHRpZiAob1Byb3BzLmZvcm1hdE9wdGlvbnMubWVhc3VyZURpc3BsYXlNb2RlID09PSBcIkhpZGRlblwiKSB7XG5cdFx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIlRleHRcIjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0b1Byb3BzLnZhbHVlQXNTdHJpbmdCaW5kaW5nRXhwcmVzc2lvbiA9IEZpZWxkVGVtcGxhdGluZy5nZXRWYWx1ZUJpbmRpbmcoXG5cdFx0XHRcdG9EYXRhTW9kZWxQYXRoLFxuXHRcdFx0XHRvUHJvcHMuZm9ybWF0T3B0aW9ucyxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHR0cnVlXG5cdFx0XHQpO1xuXHRcdFx0b1Byb3BzLnVuaXRCaW5kaW5nRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKFVJRm9ybWF0dGVycy5nZXRCaW5kaW5nRm9yVW5pdE9yQ3VycmVuY3kob0RhdGFNb2RlbFBhdGgpKTtcblx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkFtb3VudFdpdGhDdXJyZW5jeVwiO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAob1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tdW5pY2F0aW9uPy5Jc0VtYWlsQWRkcmVzcyB8fCBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzUGhvbmVOdW1iZXIpIHtcblx0XHRcdG9Qcm9wcy50ZXh0ID0gdGhpcy5nZXRUZXh0V2l0aFdoaXRlU3BhY2Uob1Byb3BzLmZvcm1hdE9wdGlvbnMsIG9EYXRhTW9kZWxQYXRoKTtcblx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkxpbmtcIjtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQpIHtcblx0XHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIkV4cGFuZGFibGVUZXh0XCI7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGhhc1F1aWNrVmlld0ZhY2V0cykge1xuXHRcdFx0b1Byb3BzLnRleHQgPSB0aGlzLmdldFRleHRXaXRoV2hpdGVTcGFjZShvUHJvcHMuZm9ybWF0T3B0aW9ucywgb0RhdGFNb2RlbFBhdGgpO1xuXHRcdFx0b1Byb3BzLmhhc1F1aWNrVmlld0ZhY2V0cyA9IHRydWU7XG5cdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJMaW5rV2l0aFF1aWNrVmlld0Zvcm1cIjtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHRvUHJvcHMuc2VtYW50aWNPYmplY3QgJiZcblx0XHRcdCEob1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbXVuaWNhdGlvbj8uSXNFbWFpbEFkZHJlc3MgfHwgb1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbXVuaWNhdGlvbj8uSXNQaG9uZU51bWJlcilcblx0XHQpIHtcblx0XHRcdG9Qcm9wcy5oYXNRdWlja1ZpZXdGYWNldHMgPSBoYXNRdWlja1ZpZXdGYWNldHM7XG5cdFx0XHRvUHJvcHMudGV4dCA9IHRoaXMuZ2V0VGV4dFdpdGhXaGl0ZVNwYWNlKG9Qcm9wcy5mb3JtYXRPcHRpb25zLCBvRGF0YU1vZGVsUGF0aCk7XG5cdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJMaW5rV2l0aFF1aWNrVmlld0Zvcm1cIjtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBfb1Byb3BlcnR5Q29tbW9uQW5ub3RhdGlvbnMgPSBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbjtcblx0XHRjb25zdCBfb1Byb3BlcnR5TmF2aWdhdGlvblByb3BlcnR5QW5ub3RhdGlvbnMgPSBvRGF0YU1vZGVsUGF0aD8ubmF2aWdhdGlvblByb3BlcnRpZXNbMF0/LmFubm90YXRpb25zPy5Db21tb247XG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gX29Qcm9wZXJ0eUNvbW1vbkFubm90YXRpb25zKSB7XG5cdFx0XHRpZiAoa2V5LmluZGV4T2YoXCJTZW1hbnRpY09iamVjdFwiKSA9PT0gMCkge1xuXHRcdFx0XHRvUHJvcHMuaGFzUXVpY2tWaWV3RmFjZXRzID0gaGFzUXVpY2tWaWV3RmFjZXRzO1xuXHRcdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJMaW5rV3JhcHBlclwiO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAoY29uc3Qga2V5IGluIF9vUHJvcGVydHlOYXZpZ2F0aW9uUHJvcGVydHlBbm5vdGF0aW9ucykge1xuXHRcdFx0aWYgKGtleS5pbmRleE9mKFwiU2VtYW50aWNPYmplY3RcIikgPT09IDApIHtcblx0XHRcdFx0b1Byb3BzLmhhc1F1aWNrVmlld0ZhY2V0cyA9IGhhc1F1aWNrVmlld0ZhY2V0cztcblx0XHRcdFx0b1Byb3BzLmRpc3BsYXlTdHlsZSA9IFwiTGlua1dyYXBwZXJcIjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChvRGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsKSB7XG5cdFx0XHRvUHJvcHMudGV4dCA9IHRoaXMuZ2V0VGV4dFdpdGhXaGl0ZVNwYWNlKG9Qcm9wcy5mb3JtYXRPcHRpb25zLCBvRGF0YU1vZGVsUGF0aCk7XG5cdFx0XHRvUHJvcHMuZGlzcGxheVN0eWxlID0gXCJMaW5rXCI7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdG9Qcm9wcy5kaXNwbGF5U3R5bGUgPSBcIlRleHRcIjtcblx0fSxcblx0Ly8gYWxnb3JpdGhtIHRvIGRldGVybWluZSB0aGUgZmllbGQgZnJhZ21lbnQgdG8gdXNlIGluIGVkaXQgYW5kIHNldCB1cCBzb21lIHByb3BlcnRpZXNcblx0c2V0VXBFZGl0U3R5bGU6IGZ1bmN0aW9uICh0aGlzOiBGaWVsZFR5cGUsIG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzLCBvRGF0YUZpZWxkOiBhbnksIG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKTogdm9pZCB7XG5cdFx0RmllbGRUZW1wbGF0aW5nLnNldEVkaXRTdHlsZVByb3BlcnRpZXMob1Byb3BzLCBvRGF0YUZpZWxkLCBvRGF0YU1vZGVsUGF0aCk7XG5cdH0sXG5cdHNldFVwRWRpdGFibGVQcm9wZXJ0aWVzOiBmdW5jdGlvbiAoXG5cdFx0b1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsXG5cdFx0b0RhdGFGaWVsZDogYW55LFxuXHRcdG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdG9NZXRhTW9kZWw6IGFueVxuXHQpOiB2b2lkIHtcblx0XHRjb25zdCBvUHJvcGVydHlGb3JGaWVsZENvbnRyb2wgPSBvRGF0YU1vZGVsUGF0aD8udGFyZ2V0T2JqZWN0Py5WYWx1ZVxuXHRcdFx0PyBvRGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QuVmFsdWVcblx0XHRcdDogb0RhdGFNb2RlbFBhdGg/LnRhcmdldE9iamVjdDtcblx0XHRpZiAob1Byb3BzLmVkaXRNb2RlICE9PSB1bmRlZmluZWQgJiYgb1Byb3BzLmVkaXRNb2RlICE9PSBudWxsKSB7XG5cdFx0XHQvLyBFdmVuIGlmIGl0IHByb3ZpZGVkIGFzIGEgc3RyaW5nIGl0J3MgYSB2YWxpZCBwYXJ0IG9mIGEgYmluZGluZyBleHByZXNzaW9uIHRoYXQgY2FuIGJlIGxhdGVyIGNvbWJpbmVkIGludG8gc29tZXRoaW5nIGVsc2UuXG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVBc09iamVjdCA9IG9Qcm9wcy5lZGl0TW9kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgYk1lYXN1cmVSZWFkT25seSA9IG9Qcm9wcy5mb3JtYXRPcHRpb25zLm1lYXN1cmVEaXNwbGF5TW9kZVxuXHRcdFx0XHQ/IG9Qcm9wcy5mb3JtYXRPcHRpb25zLm1lYXN1cmVEaXNwbGF5TW9kZSA9PT0gXCJSZWFkT25seVwiXG5cdFx0XHRcdDogZmFsc2U7XG5cblx0XHRcdG9Qcm9wcy5lZGl0TW9kZUFzT2JqZWN0ID0gVUlGb3JtYXR0ZXJzLmdldEVkaXRNb2RlKFxuXHRcdFx0XHRvUHJvcGVydHlGb3JGaWVsZENvbnRyb2wsXG5cdFx0XHRcdG9EYXRhTW9kZWxQYXRoLFxuXHRcdFx0XHRiTWVhc3VyZVJlYWRPbmx5LFxuXHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRvRGF0YUZpZWxkXG5cdFx0XHQpO1xuXHRcdFx0b1Byb3BzLmVkaXRNb2RlID0gY29tcGlsZUV4cHJlc3Npb24ob1Byb3BzLmVkaXRNb2RlQXNPYmplY3QpO1xuXHRcdH1cblx0XHRjb25zdCBlZGl0YWJsZUV4cHJlc3Npb24gPSBVSUZvcm1hdHRlcnMuZ2V0RWRpdGFibGVFeHByZXNzaW9uQXNPYmplY3Qob1Byb3BlcnR5Rm9yRmllbGRDb250cm9sLCBvRGF0YUZpZWxkLCBvRGF0YU1vZGVsUGF0aCk7XG5cdFx0Y29uc3QgYVJlcXVpcmVkUHJvcGVydGllc0Zyb21JbnNlcnRSZXN0cmljdGlvbnMgPSBDb21tb25VdGlscy5nZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zKFxuXHRcdFx0b1Byb3BzLmVudGl0eVNldD8uZ2V0UGF0aCgpLnJlcGxhY2VBbGwoXCIvJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcvXCIsIFwiL1wiKSxcblx0XHRcdG9NZXRhTW9kZWxcblx0XHQpO1xuXHRcdGNvbnN0IGFSZXF1aXJlZFByb3BlcnRpZXNGcm9tVXBkYXRlUmVzdHJpY3Rpb25zID0gQ29tbW9uVXRpbHMuZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzRnJvbVVwZGF0ZVJlc3RyaWN0aW9ucyhcblx0XHRcdG9Qcm9wcy5lbnRpdHlTZXQ/LmdldFBhdGgoKS5yZXBsYWNlQWxsKFwiLyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nL1wiLCBcIi9cIiksXG5cdFx0XHRvTWV0YU1vZGVsXG5cdFx0KTtcblx0XHRjb25zdCBvUmVxdWlyZWRQcm9wZXJ0aWVzID0ge1xuXHRcdFx0cmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9uczogYVJlcXVpcmVkUHJvcGVydGllc0Zyb21JbnNlcnRSZXN0cmljdGlvbnMsXG5cdFx0XHRyZXF1aXJlZFByb3BlcnRpZXNGcm9tVXBkYXRlUmVzdHJpY3Rpb25zOiBhUmVxdWlyZWRQcm9wZXJ0aWVzRnJvbVVwZGF0ZVJlc3RyaWN0aW9uc1xuXHRcdH07XG5cdFx0aWYgKE1vZGVsSGVscGVyLmlzQ29sbGFib3JhdGlvbkRyYWZ0U3VwcG9ydGVkKG9NZXRhTW9kZWwpKSB7XG5cdFx0XHRvUHJvcHMuY29sbGFib3JhdGlvbkVuYWJsZWQgPSB0cnVlO1xuXHRcdFx0Ly8gRXhwcmVzc2lvbnMgbmVlZGVkIGZvciBDb2xsYWJvcmF0aW9uIFZpc3VhbGl6YXRpb25cblx0XHRcdGNvbnN0IGNvbGxhYm9yYXRpb25FeHByZXNzaW9uID0gVUlGb3JtYXR0ZXJzLmdldENvbGxhYm9yYXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRvRGF0YU1vZGVsUGF0aCxcblx0XHRcdFx0Q29sbGFib3JhdGlvbkZvcm1hdHRlcnMuaGFzQ29sbGFib3JhdGlvbkFjdGl2aXR5XG5cdFx0XHQpO1xuXHRcdFx0b1Byb3BzLmNvbGxhYm9yYXRpb25IYXNBY3Rpdml0eUV4cHJlc3Npb24gPSBjb21waWxlRXhwcmVzc2lvbihjb2xsYWJvcmF0aW9uRXhwcmVzc2lvbik7XG5cdFx0XHRvUHJvcHMuY29sbGFib3JhdGlvbkluaXRpYWxzRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKFxuXHRcdFx0XHRVSUZvcm1hdHRlcnMuZ2V0Q29sbGFib3JhdGlvbkV4cHJlc3Npb24ob0RhdGFNb2RlbFBhdGgsIENvbGxhYm9yYXRpb25Gb3JtYXR0ZXJzLmdldENvbGxhYm9yYXRpb25BY3Rpdml0eUluaXRpYWxzKVxuXHRcdFx0KTtcblx0XHRcdG9Qcm9wcy5jb2xsYWJvcmF0aW9uQ29sb3JFeHByZXNzaW9uID0gY29tcGlsZUV4cHJlc3Npb24oXG5cdFx0XHRcdFVJRm9ybWF0dGVycy5nZXRDb2xsYWJvcmF0aW9uRXhwcmVzc2lvbihvRGF0YU1vZGVsUGF0aCwgQ29sbGFib3JhdGlvbkZvcm1hdHRlcnMuZ2V0Q29sbGFib3JhdGlvbkFjdGl2aXR5Q29sb3IpXG5cdFx0XHQpO1xuXHRcdFx0b1Byb3BzLmVkaXRhYmxlRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKGFuZChlZGl0YWJsZUV4cHJlc3Npb24sIG5vdChjb2xsYWJvcmF0aW9uRXhwcmVzc2lvbikpKTtcblxuXHRcdFx0b1Byb3BzLmVkaXRNb2RlID0gY29tcGlsZUV4cHJlc3Npb24oaWZFbHNlKGNvbGxhYm9yYXRpb25FeHByZXNzaW9uLCBjb25zdGFudChcIlJlYWRPbmx5XCIpLCBvUHJvcHMuZWRpdE1vZGVBc09iamVjdCkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUHJvcHMuZWRpdGFibGVFeHByZXNzaW9uID0gY29tcGlsZUV4cHJlc3Npb24oZWRpdGFibGVFeHByZXNzaW9uKTtcblx0XHR9XG5cdFx0b1Byb3BzLmVuYWJsZWRFeHByZXNzaW9uID0gVUlGb3JtYXR0ZXJzLmdldEVuYWJsZWRFeHByZXNzaW9uKFxuXHRcdFx0b1Byb3BlcnR5Rm9yRmllbGRDb250cm9sLFxuXHRcdFx0b0RhdGFGaWVsZCxcblx0XHRcdGZhbHNlLFxuXHRcdFx0b0RhdGFNb2RlbFBhdGhcblx0XHQpIGFzIENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHRcdG9Qcm9wcy5yZXF1aXJlZEV4cHJlc3Npb24gPSBVSUZvcm1hdHRlcnMuZ2V0UmVxdWlyZWRFeHByZXNzaW9uKFxuXHRcdFx0b1Byb3BlcnR5Rm9yRmllbGRDb250cm9sLFxuXHRcdFx0b0RhdGFGaWVsZCxcblx0XHRcdGZhbHNlLFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHRvUmVxdWlyZWRQcm9wZXJ0aWVzLFxuXHRcdFx0b0RhdGFNb2RlbFBhdGhcblx0XHQpIGFzIENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHR9LFxuXHRzZXRVcEZvcm1hdE9wdGlvbnM6IGZ1bmN0aW9uIChcblx0XHR0aGlzOiBGaWVsZFR5cGUsXG5cdFx0b1Byb3BzOiBGaWVsZFByb3BlcnRpZXMsXG5cdFx0b0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0b0NvbnRyb2xDb25maWd1cmF0aW9uOiBhbnksXG5cdFx0bVNldHRpbmdzOiBhbnlcblx0KSB7XG5cdFx0Y29uc3Qgb092ZXJyaWRlUHJvcHMgPSB0aGlzLmdldE92ZXJyaWRlcyhvQ29udHJvbENvbmZpZ3VyYXRpb24sIG9Qcm9wcy5kYXRhRmllbGQuZ2V0UGF0aCgpKTtcblxuXHRcdGlmICghb1Byb3BzLmZvcm1hdE9wdGlvbnMuZGlzcGxheU1vZGUpIHtcblx0XHRcdG9Qcm9wcy5mb3JtYXRPcHRpb25zLmRpc3BsYXlNb2RlID0gVUlGb3JtYXR0ZXJzLmdldERpc3BsYXlNb2RlKG9EYXRhTW9kZWxQYXRoKTtcblx0XHR9XG5cdFx0b1Byb3BzLmZvcm1hdE9wdGlvbnMudGV4dExpbmVzRWRpdCA9XG5cdFx0XHRvT3ZlcnJpZGVQcm9wcy50ZXh0TGluZXNFZGl0IHx8XG5cdFx0XHQob092ZXJyaWRlUHJvcHMuZm9ybWF0T3B0aW9ucyAmJiBvT3ZlcnJpZGVQcm9wcy5mb3JtYXRPcHRpb25zLnRleHRMaW5lc0VkaXQpIHx8XG5cdFx0XHRvUHJvcHMuZm9ybWF0T3B0aW9ucy50ZXh0TGluZXNFZGl0IHx8XG5cdFx0XHQ0O1xuXHRcdG9Qcm9wcy5mb3JtYXRPcHRpb25zLnRleHRNYXhMaW5lcyA9XG5cdFx0XHRvT3ZlcnJpZGVQcm9wcy50ZXh0TWF4TGluZXMgfHxcblx0XHRcdChvT3ZlcnJpZGVQcm9wcy5mb3JtYXRPcHRpb25zICYmIG9PdmVycmlkZVByb3BzLmZvcm1hdE9wdGlvbnMudGV4dE1heExpbmVzKSB8fFxuXHRcdFx0b1Byb3BzLmZvcm1hdE9wdGlvbnMudGV4dE1heExpbmVzO1xuXG5cdFx0Ly8gUmV0cmlldmUgdGV4dCBmcm9tIHZhbHVlIGxpc3QgYXMgZmFsbGJhY2sgZmVhdHVyZSBmb3IgbWlzc2luZyB0ZXh0IGFubm90YXRpb24gb24gdGhlIHByb3BlcnR5XG5cdFx0aWYgKG1TZXR0aW5ncy5tb2RlbHMudmlld0RhdGE/LmdldFByb3BlcnR5KFwiL3JldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3RcIikpIHtcblx0XHRcdG9Qcm9wcy5mb3JtYXRPcHRpb25zLnJldHJpZXZlVGV4dEZyb21WYWx1ZUxpc3QgPSBGaWVsZFRlbXBsYXRpbmcuaXNSZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0RW5hYmxlZChcblx0XHRcdFx0b0RhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0LFxuXHRcdFx0XHRvUHJvcHMuZm9ybWF0T3B0aW9uc1xuXHRcdFx0KTtcblx0XHRcdGlmIChvUHJvcHMuZm9ybWF0T3B0aW9ucy5yZXRyaWV2ZVRleHRGcm9tVmFsdWVMaXN0KSB7XG5cdFx0XHRcdC8vIENvbnNpZGVyIFRleHRBcnJhbmdlbWVudCBhdCBFbnRpdHlUeXBlIG90aGVyd2lzZSBzZXQgZGVmYXVsdCBkaXNwbGF5IGZvcm1hdCAnRGVzY3JpcHRpb25WYWx1ZSdcblx0XHRcdFx0Y29uc3QgaGFzRW50aXR5VGV4dEFycmFuZ2VtZW50ID0gISFvRGF0YU1vZGVsUGF0aD8udGFyZ2V0RW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LlVJPy5UZXh0QXJyYW5nZW1lbnQ7XG5cdFx0XHRcdG9Qcm9wcy5mb3JtYXRPcHRpb25zLmRpc3BsYXlNb2RlID0gaGFzRW50aXR5VGV4dEFycmFuZ2VtZW50ID8gb1Byb3BzLmZvcm1hdE9wdGlvbnMuZGlzcGxheU1vZGUgOiBcIkRlc2NyaXB0aW9uVmFsdWVcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKG9Qcm9wcy5mb3JtYXRPcHRpb25zLmZpZWxkTW9kZSA9PT0gXCJub3dyYXBwZXJcIiAmJiBvUHJvcHMuZWRpdE1vZGUgPT09IFwiRGlzcGxheVwiKSB7XG5cdFx0XHRpZiAob1Byb3BzLl9mbGV4SWQpIHtcblx0XHRcdFx0b1Byb3BzLm5vV3JhcHBlcklkID0gb1Byb3BzLl9mbGV4SWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvUHJvcHMubm9XcmFwcGVySWQgPSBvUHJvcHMuaWRQcmVmaXggPyBnZW5lcmF0ZShbb1Byb3BzLmlkUHJlZml4LCBcIkZpZWxkLWNvbnRlbnRcIl0pIDogdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0c2V0VXBTZW1hbnRpY09iamVjdHM6IGZ1bmN0aW9uIChvUHJvcHM6IEZpZWxkUHJvcGVydGllcywgb0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiB2b2lkIHtcblx0XHRsZXQgYVNlbU9iakV4cHJUb1Jlc29sdmUgPSBbXTtcblx0XHRhU2VtT2JqRXhwclRvUmVzb2x2ZSA9IEZpZWxkVGVtcGxhdGluZy5nZXRTZW1hbnRpY09iamVjdEV4cHJlc3Npb25Ub1Jlc29sdmUob0RhdGFNb2RlbFBhdGg/LnRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/LkNvbW1vbik7XG5cblx0XHQvKipcblx0XHQgKiBJZiB0aGUgZmllbGQgYnVpbGRpbmcgYmxvY2sgaGFzIGEgYmluZGluZyBleHByZXNzaW9uIGluIHRoZSBjdXN0b20gc2VtYW50aWMgb2JqZWN0cyxcblx0XHQgKiBpdCBnZXRzIHN0b3JlZCB0byB0aGUgY3VzdG9tIGRhdGEgb2YgdGhlIExpbmsgaW4gTGlua1dpdGhRdWlja1ZpZXdGb3JtLmZyYWdtZW50LnhtbFxuXHRcdCAqIFRoaXMgaXMgbmVlZGVkIHRvIHJlc29sdmUgdGhlIGxpbmsgYXQgcnVudGltZS4gVGhlIFF1aWNrVmlld0xpbmtEZWxlZ2F0ZS5qcyB0aGVuIGdldHMgdGhlIHJlc29sdmVkXG5cdFx0ICogYmluZGluZyBleHByZXNzaW9uIGZyb20gdGhlIGN1c3RvbSBkYXRhLlxuXHRcdCAqIEFsbCBvdGhlciBjdXN0b20gc2VtYW50aWMgb2JqZWN0cyBhcmUgcHJvY2Vzc2VkIGluIEZpZWxkSGVscGVyLmpzOmNvbXB1dGVMaW5rUGFyYW1ldGVyc1xuXHRcdCAqL1xuXHRcdGlmICghIW9Qcm9wcy5zZW1hbnRpY09iamVjdCAmJiB0eXBlb2Ygb1Byb3BzLnNlbWFudGljT2JqZWN0ID09PSBcInN0cmluZ1wiICYmIG9Qcm9wcy5zZW1hbnRpY09iamVjdFswXSA9PT0gXCJ7XCIpIHtcblx0XHRcdGFTZW1PYmpFeHByVG9SZXNvbHZlLnB1c2goe1xuXHRcdFx0XHRrZXk6IG9Qcm9wcy5zZW1hbnRpY09iamVjdC5zdWJzdHIoMSwgb1Byb3BzLnNlbWFudGljT2JqZWN0Lmxlbmd0aCAtIDIpLFxuXHRcdFx0XHR2YWx1ZTogb1Byb3BzLnNlbWFudGljT2JqZWN0XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0b1Byb3BzLnNlbWFudGljT2JqZWN0cyA9IEZpZWxkVGVtcGxhdGluZy5nZXRTZW1hbnRpY09iamVjdHMoYVNlbU9iakV4cHJUb1Jlc29sdmUpO1xuXHRcdC8vIFRoaXMgc2V0cyB1cCB0aGUgc2VtYW50aWMgbGlua3MgZm91bmQgaW4gdGhlIG5hdmlnYXRpb24gcHJvcGVydHksIGlmIHRoZXJlIGlzIG5vIHNlbWFudGljIGxpbmtzIGRlZmluZSBiZWZvcmUuXG5cdFx0aWYgKCFvUHJvcHMuc2VtYW50aWNPYmplY3QgJiYgb0RhdGFNb2RlbFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0b0RhdGFNb2RlbFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAobmF2UHJvcGVydHkpIHtcblx0XHRcdFx0aWYgKG5hdlByb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY09iamVjdCkge1xuXHRcdFx0XHRcdG9Qcm9wcy5zZW1hbnRpY09iamVjdCA9IG5hdlByb3BlcnR5LmFubm90YXRpb25zLkNvbW1vbi5TZW1hbnRpY09iamVjdDtcblx0XHRcdFx0XHRvUHJvcHMuaGFzU2VtYW50aWNPYmplY3RPbk5hdmlnYXRpb24gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHNldFVwTmF2aWdhdGlvbkF2YWlsYWJsZTogZnVuY3Rpb24gKG9Qcm9wczogRmllbGRQcm9wZXJ0aWVzLCBvRGF0YUZpZWxkOiBhbnkpOiB2b2lkIHtcblx0XHRvUHJvcHMubmF2aWdhdGlvbkF2YWlsYWJsZSA9IHRydWU7XG5cdFx0aWYgKFxuXHRcdFx0b0RhdGFGaWVsZD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiAmJlxuXHRcdFx0b0RhdGFGaWVsZC5OYXZpZ2F0aW9uQXZhaWxhYmxlICE9PSB1bmRlZmluZWQgJiZcblx0XHRcdFN0cmluZyhvUHJvcHMuZm9ybWF0T3B0aW9ucy5pZ25vcmVOYXZpZ2F0aW9uQXZhaWxhYmxlKSAhPT0gXCJ0cnVlXCJcblx0XHQpIHtcblx0XHRcdG9Qcm9wcy5uYXZpZ2F0aW9uQXZhaWxhYmxlID0gY29tcGlsZUV4cHJlc3Npb24oZ2V0RXhwcmVzc2lvbkZyb21Bbm5vdGF0aW9uKG9EYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZSkpO1xuXHRcdH1cblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEZpZWxkIGFzIEZpZWxkVHlwZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsSUFBTUEsS0FBSyxHQUFHQyxhQUFhLENBQUNDLE1BQWQsQ0FBcUIsOEJBQXJCLEVBQXFEO0lBQ2xFO0FBQ0Q7QUFDQTtJQUNDQyxJQUFJLEVBQUUsT0FKNEQ7O0lBS2xFO0FBQ0Q7QUFDQTtJQUNDQyxTQUFTLEVBQUUsd0JBUnVEOztJQVNsRTtBQUNEO0FBQ0E7SUFDQ0MsUUFBUSxFQUFFLDhCQVp3RDs7SUFjbEU7QUFDRDtBQUNBO0lBQ0NDLFFBQVEsRUFBRTtNQUNUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUUsVUFKSDs7TUFLVDtBQUNGO0FBQ0E7TUFDRUMsVUFBVSxFQUFFLHlDQVJIOztNQVNUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUU7UUFDWDtBQUNIO0FBQ0E7UUFDR0MsUUFBUSxFQUFFO1VBQ1RDLElBQUksRUFBRTtRQURHLENBSkM7UUFPWEMsTUFBTSxFQUFFO1VBQ1BELElBQUksRUFBRTtRQURDLENBUEc7UUFVWEUsV0FBVyxFQUFFO1VBQ1pGLElBQUksRUFBRTtRQURNLENBVkY7O1FBYVg7QUFDSDtBQUNBO1FBQ0dHLFVBQVUsRUFBRTtVQUNYSCxJQUFJLEVBQUUsUUFESztVQUVYSSxZQUFZLEVBQUU7UUFGSCxDQWhCRDtRQXFCWEMsU0FBUyxFQUFFO1VBQ1ZMLElBQUksRUFBRSxRQURJO1VBRVZNLFFBQVEsRUFBRTtRQUZBLENBckJBOztRQXlCWDtBQUNIO0FBQ0E7UUFDR0MsU0FBUyxFQUFFO1VBQ1ZQLElBQUksRUFBRSxzQkFE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