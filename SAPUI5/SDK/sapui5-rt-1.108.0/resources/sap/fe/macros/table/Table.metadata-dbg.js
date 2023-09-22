/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/converters/controls/Common/DataVisualization", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/macros/internal/helpers/TableTemplating", "sap/fe/macros/MacroMetadata"], function (Log, DataVisualization, MetaModelConverter, StableIdHelper, DataModelPathHelper, TableTemplating, MacroMetadata) {
  "use strict";

  var buildExpressionForHeaderVisible = TableTemplating.buildExpressionForHeaderVisible;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var generate = StableIdHelper.generate;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var getVisualizationsFromPresentationVariant = DataVisualization.getVisualizationsFromPresentationVariant;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;

  /**
   * @classdesc
   * Building block used to create a table based on the metadata provided by OData V4.
   *
   * Usage example:
   * <pre>
   * &lt;macro:Table
   *   id="someID"
   *   type="ResponsiveTable"
   *   collection="collection",
   *   presentation="presentation"
   *   selectionMode="Multi"
   *   requestGroupId="$auto.test"
   *   displayMode="false"
   *   personalization="Column,Sort"
   * /&gt;
   * </pre>
   * @class sap.fe.macros.Table
   * @hideconstructor
   * @private
   * @experimental
   */
  var Table = MacroMetadata.extend("sap.fe.macros.table.Table", {
    /**
     * Name of the macro control.
     */
    name: "Table",

    /**
     * Namespace of the macro control
     */
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",

    /**
     * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
     */
    fragment: "sap.fe.macros.table.Table",

    /**
     * The metadata describing the macro control.
     */
    metadata: {
      /**
       * Define macro stereotype for documentation
       */
      stereotype: "xmlmacro",

      /**
       * Properties.
       */
      properties: {
        tableDefinition: {
          type: "sap.ui.model.Context"
        },
        metaPath: {
          type: "sap.ui.model.Context",
          isPublic: true
        },
        contextPath: {
          type: "sap.ui.model.Context",
          isPublic: true
        },

        /**
         * metadataContext:collection Mandatory context to a collection (entitySet or 1:n navigation)
         */
        collection: {
          type: "sap.ui.model.Context",
          required: true,
          $kind: ["EntitySet", "NavigationProperty", "Singleton"]
        },

        /**
         * Parent EntitySet for the present collection
         */
        parentEntitySet: {
          type: "sap.ui.model.Context"
        },

        /**
         * ID of the table
         */
        id: {
          type: "string",
          isPublic: true
        },
        _apiId: {
          type: "string"
        },

        /**
         * Used for binding the table to a navigation path. Only the path is used for binding rows.
         */
        navigationPath: {
          type: "string"
        },

        /**
         * Specifies whether the table should be read-only or not.
         */
        readOnly: {
          type: "boolean",
          isPublic: true
        },
        fieldMode: {
          type: "string",
          defaultValue: "",
          allowedValues: ["", "nowrapper"]
        },

        /**
         * Specifies whether the button is hidden when no data has been entered yet in the row (true/false). The default setting is `false`.
         */
        disableAddRowButtonForEmptyData: {
          type: "boolean"
        },

        /**
         * Specifies the full path and function name of a custom validation function.
         */
        customValidationFunction: {
          type: "string"
        },

        /**
         * Specifies whether the table is displayed with condensed layout (true/false). The default setting is `false`.
         */
        useCondensedTableLayout: {
          type: "boolean"
        },

        /**
         * Specifies the possible actions available on the table row (Navigation,null). The default setting is `undefined`
         */
        rowAction: {
          type: "string",
          defaultValue: undefined
        },

        /**
         * Specifies the selection mode (None,Single,Multi,Auto)
         */
        selectionMode: {
          type: "string",
          isPublic: true
        },

        /**
         * The `busy` mode of table
         */
        busy: {
          type: "boolean",
          isPublic: true
        },

        /**
         * Parameter used to show the fullScreen button on the table.
         */
        enableFullScreen: {
          type: "boolean",
          isPublic: true
        },

        /**
         * Specifies header text that is shown in table.
         */
        header: {
          type: "string",
          isPublic: true
        },

        /**
         * Controls if the header text should be shown or not
         */
        headerVisible: {
          type: "boolean",
          isPublic: true
        },

        /**
         * Defines the "aria-level" of the table header
         */
        headerLevel: {
          type: "sap.ui.core.TitleLevel",
          defaultValue: "Auto",
          isPublic: true
        },

        /**
         * Parameter which sets the noDataText for the mdc table
         */
        noDataText: {
          type: "string"
        },

        /**
         * Creation Mode to be passed to the onCreate hanlder. Values: ["Inline", "NewPage"]
         */
        creationMode: {
          type: "string"
        },

        /**
         * Setting to determine if the new row should be created at the end or beginning
         */
        createAtEnd: {
          type: "boolean"
        },
        createOutbound: {
          type: "string"
        },
        createOutboundDetail: {
          type: "string"
        },
        createNewAction: {
          type: "string"
        },

        /**
         * Personalization Mode
         */
        personalization: {
          type: "string|boolean",
          isPublic: true
        },
        isSearchable: {
          type: "boolean",
          isPublic: true
        },

        /**
         * Allows to choose the Table type. Allowed values are `ResponsiveTable` or `GridTable`.
         */
        type: {
          type: "string",
          isPublic: true
        },
        tableType: {
          type: "string"
        },

        /**
         * Enable export to file
         */
        enableExport: {
          type: "boolean",
          isPublic: true
        },

        /**
         * Enable export to file
         */
        enablePaste: {
          type: "boolean",
          isPublic: true
        },

        /**
         * ONLY FOR GRID TABLE: Number of indices which can be selected in a range. If set to 0, the selection limit is disabled, and the Select All checkbox appears instead of the Deselect All button.
         */
        selectionLimit: {
          type: "string"
        },

        /**
         * ONLY FOR RESPONSIVE TABLE: Setting to define the checkbox in the column header: Allowed values are `Default` or `ClearAll`. If set to `Default`, the sap.m.Table control renders the Select All checkbox, otherwise the Deselect All button is rendered.
         */
        multiSelectMode: {
          type: "string"
        },

        /**
         * The control ID of the FilterBar that is used to filter the rows of the table.
         */
        filterBar: {
          type: "string",
          isPublic: true
        },

        /**
         * The control ID of the FilterBar that is used internally to filter the rows of the table.
         */
        filterBarId: {
          type: "string"
        },
        tableDelegate: {
          type: "string"
        },
        enableAutoScroll: {
          type: "boolean"
        },
        visible: {
          type: "string"
        },
        isAlp: {
          type: "boolean",
          defaultValue: false
        },
        variantManagement: {
          type: "string",
          isPublic: true
        },
        columnEditMode: {
          type: "string",
          computed: true
        },
        tabTitle: {
          type: "string",
          defaultValue: ""
        },
        enableAutoColumnWidth: {
          type: "boolean"
        },
        dataStateIndicatorFilter: {
          type: "string"
        },
        isCompactType: {
          type: "boolean"
        }
      },
      events: {
        variantSaved: {
          type: "function"
        },
        variantSelected: {
          type: "function"
        },

        /**
         * Event handler for change event
         */
        onChange: {
          type: "function"
        },

        /**
         * Event handler to react when the user chooses a row
         */
        rowPress: {
          type: "function",
          isPublic: true
        },

        /**
         * Event handler to react to the contextChange event of the table.
         */
        onContextChange: {
          type: "function"
        },

        /**
         * Event handler called when the user chooses an option of the segmented button in the ALP View
         */
        onSegmentedButtonPressed: {
          type: "function"
        },

        /**
         * Event handler to react to the stateChange event of the table.
         */
        stateChange: {
          type: "function"
        },

        /**
         * Event handler to react when the table selection changes
         */
        selectionChange: {
          type: "function",
          isPublic: true
        }
      },
      aggregations: {
        actions: {
          type: "sap.fe.macros.internal.table.Action | sap.fe.macros.internal.table.ActionGroup",
          isPublic: true
        },
        columns: {
          type: "sap.fe.macros.internal.table.Column",
          isPublic: true
        }
      }
    },
    create: function (oProps, oControlConfiguration, mSettings, oAggregations) {
      var oTableDefinition;
      var oContextObjectPath = getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);

      if (!oProps.tableDefinition) {
        var initialConverterContext = this.getConverterContext(oContextObjectPath, oProps.contextPath, mSettings);

        var sVisualizationPath = this._getVisualizationPath(oContextObjectPath, initialConverterContext);

        var sPresentationPath = this._getPresentationPath(oContextObjectPath); //Check if we have ActionGroup and add nested actions


        var oExtraActions = this._buildActions(oAggregations.actions);

        var oExtraColumns = this.parseAggregation(oAggregations.columns, function (childColumn, columnChildIdx) {
          var _childColumn$children;

          var columnKey = childColumn.getAttribute("key") || "InlineXMLColumn_" + columnChildIdx;
          oAggregations[columnKey] = childColumn;
          return {
            // Defaults are to be defined in Table.ts
            key: columnKey,
            type: "Slot",
            width: childColumn.getAttribute("width"),
            importance: childColumn.getAttribute("importance"),
            horizontalAlign: childColumn.getAttribute("horizontalAlign"),
            availability: childColumn.getAttribute("availability"),
            header: childColumn.getAttribute("header"),
            template: ((_childColumn$children = childColumn.children[0]) === null || _childColumn$children === void 0 ? void 0 : _childColumn$children.outerHTML) || "",
            properties: childColumn.getAttribute("properties") ? childColumn.getAttribute("properties").split(",") : undefined,
            position: {
              placement: childColumn.getAttribute("positionPlacement"),
              anchor: childColumn.getAttribute("positionAnchor")
            }
          };
        });
        var oExtraParams = {};
        var mTableSettings = {
          enableExport: oProps.enableExport,
          enableFullScreen: oProps.enableFullScreen,
          enablePaste: oProps.enablePaste,
          selectionMode: oProps.selectionMode,
          type: oProps.type
        }; //removes undefined values from mTableSettings

        mTableSettings = JSON.parse(JSON.stringify(mTableSettings));
        oExtraParams[sVisualizationPath] = {
          actions: oExtraActions,
          columns: oExtraColumns,
          tableSettings: mTableSettings
        };
        var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.contextPath, mSettings, oExtraParams);
        var oVisualizationDefinition = getDataVisualizationConfiguration(sVisualizationPath, oProps.useCondensedLayout, oConverterContext, undefined, undefined, sPresentationPath);
        oTableDefinition = oVisualizationDefinition.visualizations[0];
        oProps.tableDefinition = this.createBindingContext(oTableDefinition, mSettings);
      } else {
        oTableDefinition = oProps.tableDefinition.getObject();
      }

      oTableDefinition.path = "{_pageModel>" + oProps.tableDefinition.getPath() + "}"; // public properties processed by converter context

      this.setDefaultValue(oProps, "selectionMode", oTableDefinition.annotation.selectionMode, true);
      this.setDefaultValue(oProps, "enableFullScreen", oTableDefinition.control.enableFullScreen, true);
      this.setDefaultValue(oProps, "enableExport", oTableDefinition.control.enableExport, true);
      this.setDefaultValue(oProps, "enablePaste", oTableDefinition.annotation.standardActions.actions.paste.enabled, true);
      this.setDefaultValue(oProps, "updatablePropertyPath", oTableDefinition.annotation.standardActions.updatablePropertyPath, true);
      this.setDefaultValue(oProps, "type", oTableDefinition.control.type, true);
      this.setDefaultValue(oProps, "useCondensedTableLayout", oTableDefinition.control.useCondensedTableLayout);
      this.setDefaultValue(oProps, "disableAddRowButtonForEmptyData", oTableDefinition.control.disableAddRowButtonForEmptyData);
      this.setDefaultValue(oProps, "customValidationFunction", oTableDefinition.control.customValidationFunction);
      this.setDefaultValue(oProps, "headerVisible", oTableDefinition.control.headerVisible);
      this.setDefaultValue(oProps, "searchable", oTableDefinition.annotation.searchable);
      this.setDefaultValue(oProps, "showRowCount", oTableDefinition.control.showRowCount);
      this.setDefaultValue(oProps, "inlineCreationRowCount", oTableDefinition.control.inlineCreationRowCount);
      this.setDefaultValue(oProps, "header", oTableDefinition.annotation.title);
      this.setDefaultValue(oProps, "selectionLimit", oTableDefinition.control.selectionLimit);
      this.setDefaultValue(oProps, "isCompactType", oTableDefinition.control.isCompactType);

      if (oProps.id) {
        // The given ID shall be assigned to the TableAPI and not to the MDC Table
        oProps._apiId = oProps.id;
        oProps.id = this.getContentId(oProps.id);
      } else {
        // We generate the ID. Due to compatibility reasons we keep it on the MDC Table but provide assign
        // the ID with a ::Table suffix to the TableAPI
        this.setDefaultValue(oProps, "id", oTableDefinition.annotation.id);
        oProps._apiId = oTableDefinition.annotation.id + "::Table";
      }

      this.setDefaultValue(oProps, "creationMode", oTableDefinition.annotation.create.mode);
      this.setDefaultValue(oProps, "createAtEnd", oTableDefinition.annotation.create.append);
      this.setDefaultValue(oProps, "createOutbound", oTableDefinition.annotation.create.outbound);
      this.setDefaultValue(oProps, "createNewAction", oTableDefinition.annotation.create.newAction);
      this.setDefaultValue(oProps, "createOutboundDetail", oTableDefinition.annotation.create.outboundDetail);
      this.setDefaultValue(oProps, "personalization", oTableDefinition.annotation.p13nMode);
      this.setDefaultValue(oProps, "variantManagement", oTableDefinition.annotation.variantManagement);
      this.setDefaultValue(oProps, "enableAutoColumnWidth", oTableDefinition.control.enableAutoColumnWidth);
      this.setDefaultValue(oProps, "dataStateIndicatorFilter", oTableDefinition.control.dataStateIndicatorFilter); // Special code for readOnly
      // readonly = false -> Force editable
      // readonly = true -> Force display mode
      // readonly = undefined -> Bound to edit flow

      switch (oProps.readOnly) {
        case "false":
          oProps.readOnly = false;
          break;

        case "true":
          oProps.readOnly = true;
          break;

        default:
      }

      if (oProps.readOnly === undefined && oTableDefinition.annotation.displayMode === true) {
        oProps.readOnly = true;
      }

      if (oProps.rowPress) {
        oProps.rowAction = "Navigation";
      }

      this.setDefaultValue(oProps, "rowPress", oTableDefinition.annotation.row.press);
      this.setDefaultValue(oProps, "rowAction", oTableDefinition.annotation.row.action);

      if (oProps.personalization === "false") {
        oProps.personalization = undefined;
      } else if (oProps.personalization === "true") {
        oProps.personalization = "Sort,Column,Filter";
      }

      switch (oProps.personalization) {
        case "false":
          oProps.personalization = undefined;
          break;

        case "true":
          oProps.personalization = "Sort,Column,Filter";
          break;

        default:
      }

      if (oProps.isSearchable === "false") {
        oProps.searchable = false;
      } else {
        oProps.searchable = oTableDefinition.annotation.searchable;
      }

      var useBasicSearch = false; // Note for the 'filterBar' property:
      // 1. ID relative to the view of the Table.
      // 2. Absolute ID.
      // 3. ID would be considered in association to TableAPI's ID.

      if (!oProps.filterBar && !oProps.filterBarId && oProps.searchable) {
        // filterBar: Public property for building blocks
        // filterBarId: Only used as Internal private property for FE templates
        oProps.filterBarId = generate([oProps.id, "StandardAction", "BasicSearch"]);
        useBasicSearch = true;
      } // Internal properties


      oProps.useBasicSearch = useBasicSearch;
      oProps.tableType = oProps.type;
      oProps.showCreate = oTableDefinition.annotation.standardActions.actions.create.visible || true;
      oProps.autoBindOnInit = oTableDefinition.annotation.autoBindOnInit; // Internal that I want to remove in the end

      oProps.navigationPath = oTableDefinition.annotation.navigationPath; // oTableDefinition.annotation.collection; //DataModelPathHelper.getContextRelativeTargetObjectPath(oContextObjectPath); //

      if (oTableDefinition.annotation.collection.startsWith("/") && oContextObjectPath.startingEntitySet._type === "Singleton") {
        oTableDefinition.annotation.collection = oProps.navigationPath;
      }

      oProps.parentEntitySet = mSettings.models.metaModel.createBindingContext("/" + (oContextObjectPath.contextLocation.targetEntitySet ? oContextObjectPath.contextLocation.targetEntitySet.name : oContextObjectPath.startingEntitySet.name));
      oProps.collection = mSettings.models.metaModel.createBindingContext(oTableDefinition.annotation.collection);

      switch (oProps.readOnly) {
        case true:
          oProps.columnEditMode = "Display";
          break;

        case false:
          oProps.columnEditMode = "Editable";
          break;

        default:
          oProps.columnEditMode = undefined;
      } // Regarding the remaining ones that I think we could review
      // selectedContextsModel -> potentially hardcoded or internal only
      // onContextChange -> Autoscroll ... might need revision
      // onChange -> Just proxied down to the Field may need to see if needed or not
      // variantSelected / variantSaved -> Variant Management standard helpers ?
      // tableDelegate  -> used externally for ALP ... might need to see if relevant still
      // onSegmentedButtonPressed -> ALP specific, should be a dedicated control for the contentViewSwitcher
      // visible -> related to this ALP contentViewSwitcher... maybe an outer control would make more sense ?


      oProps.headerBindingExpression = buildExpressionForHeaderVisible(oProps);
      return oProps;
    },

    /**
     * Build actions and action groups for table visualisation.
     *
     * @param oActions XML node corresponding to actions
     * @returns Prepared actions
     */
    _buildActions: function (oActions) {
      var oExtraActions = {};

      if (oActions && oActions.children.length > 0) {
        var actions = Array.prototype.slice.apply(oActions.children);
        var actionIdx = 0;
        actions.forEach(function (act) {
          actionIdx++;
          var menuActions = [];

          if (act.children.length && act.localName === "ActionGroup" && act.namespaceURI === "sap.fe.macros") {
            var actionsToAdd = Array.prototype.slice.apply(act.children);
            actionsToAdd.forEach(function (actToAdd) {
              var actionKeyAdd = actToAdd.getAttribute("key") || "InlineXMLAction_" + actionIdx;
              var curOutObject = {
                key: actionKeyAdd,
                text: actToAdd.getAttribute("text"),
                __noWrap: true,
                press: actToAdd.getAttribute("press"),
                requiresSelection: actToAdd.getAttribute("requiresSelection") === "true",
                enabled: actToAdd.getAttribute("enabled") === null ? true : actToAdd.getAttribute("enabled")
              };
              oExtraActions[curOutObject.key] = curOutObject;
              actionIdx++;
            });
            menuActions = Object.values(oExtraActions).slice(-act.children.length).map(function (menuItem) {
              return menuItem.key;
            });
          }

          var actionKey = act.getAttribute("key") || "InlineXMLAction_" + actionIdx;
          var actObject = {
            key: actionKey,
            text: act.getAttribute("text"),
            position: {
              placement: act.getAttribute("placement"),
              anchor: act.getAttribute("anchor")
            },
            __noWrap: true,
            press: act.getAttribute("press"),
            requiresSelection: act.getAttribute("requiresSelection") === "true",
            enabled: act.getAttribute("enabled") === null ? true : act.getAttribute("enabled"),
            menu: menuActions.length ? menuActions : null
          };
          oExtraActions[actObject.key] = actObject;
        });
      }

      return oExtraActions;
    },

    /**
     * Returns the annotation path pointing to the visualization annotation (LineItem).
     *
     * @param contextObjectPath The datamodel object path for the table
     * @param converterContext The converter context
     * @returns The annotation path
     */
    _getVisualizationPath: function (contextObjectPath, converterContext) {
      var metaPath = getContextRelativeTargetObjectPath(contextObjectPath);

      if (contextObjectPath.targetObject.term === "com.sap.vocabularies.UI.v1.LineItem") {
        return metaPath; // MetaPath is already pointing to a LineItem
      }

      var visualizations = [];

      switch (contextObjectPath.targetObject.term) {
        case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
          if (contextObjectPath.targetObject.PresentationVariant) {
            visualizations = getVisualizationsFromPresentationVariant(contextObjectPath.targetObject.PresentationVariant, metaPath, converterContext);
          }

          break;

        case "com.sap.vocabularies.UI.v1.PresentationVariant":
          visualizations = getVisualizationsFromPresentationVariant(contextObjectPath.targetObject, metaPath, converterContext);
          break;

        default:
          Log.error("Bad metapath parameter for table : ".concat(contextObjectPath.targetObject.term));
      }

      var lineItemViz = visualizations.find(function (viz) {
        return viz.visualization.term === "com.sap.vocabularies.UI.v1.LineItem";
      });

      if (lineItemViz) {
        return lineItemViz.annotationPath;
      } else {
        return metaPath; // Fallback
      }
    },
    _getPresentationPath: function (oContextObjectPath) {
      var presentationPath;

      switch (oContextObjectPath.targetObject.term) {
        case "com.sap.vocabularies.UI.v1.PresentationVariant":
          presentationPath = getContextRelativeTargetObjectPath(oContextObjectPath);
          break;

        case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
          presentationPath = getContextRelativeTargetObjectPath(oContextObjectPath) + "/PresentationVariant";
          break;

        default:
          presentationPath = null;
      }

      return presentationPath;
    }
  });
  return Table;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUYWJsZSIsIk1hY3JvTWV0YWRhdGEiLCJleHRlbmQiLCJuYW1lIiwibmFtZXNwYWNlIiwicHVibGljTmFtZXNwYWNlIiwiZnJhZ21lbnQiLCJtZXRhZGF0YSIsInN0ZXJlb3R5cGUiLCJwcm9wZXJ0aWVzIiwidGFibGVEZWZpbml0aW9uIiwidHlwZSIsIm1ldGFQYXRoIiwiaXNQdWJsaWMiLCJjb250ZXh0UGF0aCIsImNvbGxlY3Rpb24iLCJyZXF1aXJlZCIsIiRraW5kIiwicGFyZW50RW50aXR5U2V0IiwiaWQiLCJfYXBpSWQiLCJuYXZpZ2F0aW9uUGF0aCIsInJlYWRPbmx5IiwiZmllbGRNb2RlIiwiZGVmYXVsdFZhbHVlIiwiYWxsb3dlZFZhbHVlcyIsImRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEiLCJjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb24iLCJ1c2VDb25kZW5zZWRUYWJsZUxheW91dCIsInJvd0FjdGlvbiIsInVuZGVmaW5lZCIsInNlbGVjdGlvbk1vZGUiLCJidXN5IiwiZW5hYmxlRnVsbFNjcmVlbiIsImhlYWRlciIsImhlYWRlclZpc2libGUiLCJoZWFkZXJMZXZlbCIsIm5vRGF0YVRleHQiLCJjcmVhdGlvbk1vZGUiLCJjcmVhdGVBdEVuZCIsImNyZWF0ZU91dGJvdW5kIiwiY3JlYXRlT3V0Ym91bmREZXRhaWwiLCJjcmVhdGVOZXdBY3Rpb24iLCJwZXJzb25hbGl6YXRpb24iLCJpc1NlYXJjaGFibGUiLCJ0YWJsZVR5cGUiLCJlbmFibGVFeHBvcnQiLCJlbmFibGVQYXN0ZSIsInNlbGVjdGlvbkxpbWl0IiwibXVsdGlTZWxlY3RNb2RlIiwiZmlsdGVyQmFyIiwiZmlsdGVyQmFySWQiLCJ0YWJsZURlbGVnYXRlIiwiZW5hYmxlQXV0b1Njcm9sbCIsInZpc2libGUiLCJpc0FscCIsInZhcmlhbnRNYW5hZ2VtZW50IiwiY29sdW1uRWRpdE1vZGUiLCJjb21wdXRlZCIsInRhYlRpdGxlIiwiZW5hYmxlQXV0b0NvbHVtbldpZHRoIiwiZGF0YVN0YXRlSW5kaWNhdG9yRmlsdGVyIiwiaXNDb21wYWN0VHlwZSIsImV2ZW50cyIsInZhcmlhbnRTYXZlZCIsInZhcmlhbnRTZWxlY3RlZCIsIm9uQ2hhbmdlIiwicm93UHJlc3MiLCJvbkNvbnRleHRDaGFuZ2UiLCJvblNlZ21lbnRlZEJ1dHRvblByZXNzZWQiLCJzdGF0ZUNoYW5nZSIsInNlbGVjdGlvbkNoYW5nZSIsImFnZ3JlZ2F0aW9ucyIsImFjdGlvbnMiLCJjb2x1bW5zIiwiY3JlYXRlIiwib1Byb3BzIiwib0NvbnRyb2xDb25maWd1cmF0aW9uIiwibVNldHRpbmdzIiwib0FnZ3JlZ2F0aW9ucyIsIm9UYWJsZURlZmluaXRpb24iLCJvQ29udGV4dE9iamVjdFBhdGgiLCJnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMiLCJpbml0aWFsQ29udmVydGVyQ29udGV4dCIsImdldENvbnZlcnRlckNvbnRleHQiLCJzVmlzdWFsaXphdGlvblBhdGgiLCJfZ2V0VmlzdWFsaXphdGlvblBhdGgiLCJzUHJlc2VudGF0aW9uUGF0aCIsIl9nZXRQcmVzZW50YXRpb25QYXRoIiwib0V4dHJhQWN0aW9ucyIsIl9idWlsZEFjdGlvbnMiLCJvRXh0cmFDb2x1bW5zIiwicGFyc2VBZ2dyZWdhdGlvbiIsImNoaWxkQ29sdW1uIiwiY29sdW1uQ2hpbGRJZHgiLCJjb2x1bW5LZXkiLCJnZXRBdHRyaWJ1dGUiLCJrZXkiLCJ3aWR0aCIsImltcG9ydGFuY2UiLCJob3Jpem9udGFsQWxpZ24iLCJhdmFpbGFiaWxpdHkiLCJ0ZW1wbGF0ZSIsImNoaWxkcmVuIiwib3V0ZXJIVE1MIiwic3BsaXQiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsImFuY2hvciIsIm9FeHRyYVBhcmFtcyIsIm1UYWJsZVNldHRpbmdzIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidGFibGVTZXR0aW5ncyIsIm9Db252ZXJ0ZXJDb250ZXh0Iiwib1Zpc3VhbGl6YXRpb25EZWZpbml0aW9uIiwiZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uIiwidXNlQ29uZGVuc2VkTGF5b3V0IiwidmlzdWFsaXphdGlvbnMiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsImdldE9iamVjdCIsInBhdGgiLCJnZXRQYXRoIiwic2V0RGVmYXVsdFZhbHVlIiwiYW5ub3RhdGlvbiIsImNvbnRyb2wiLCJzdGFuZGFyZEFjdGlvbnMiLCJwYXN0ZSIsImVuYWJsZWQiLCJ1cGRhdGFibGVQcm9wZXJ0eVBhdGgiLCJzZWFyY2hhYmxlIiwic2hvd1Jvd0NvdW50IiwiaW5saW5lQ3JlYXRpb25Sb3dDb3VudCIsInRpdGxlIiwiZ2V0Q29udGVudElkIiwibW9kZSIsImFwcGVuZCIsIm91dGJvdW5kIiwibmV3QWN0aW9uIiwib3V0Ym91bmREZXRhaWwiLCJwMTNuTW9kZSIsImRpc3BsYXlNb2RlIiwicm93IiwicHJlc3MiLCJhY3Rpb24iLCJ1c2VCYXNpY1NlYXJjaCIsImdlbmVyYXRlIiwic2hvd0NyZWF0ZSIsImF1dG9CaW5kT25Jbml0Iiwic3RhcnRzV2l0aCIsInN0YXJ0aW5nRW50aXR5U2V0IiwiX3R5cGUiLCJtb2RlbHMiLCJtZXRhTW9kZWwiLCJjb250ZXh0TG9jYXRpb24iLCJ0YXJnZXRFbnRpdHlTZXQiLCJoZWFkZXJCaW5kaW5nRXhwcmVzc2lvbiIsImJ1aWxkRXhwcmVzc2lvbkZvckhlYWRlclZpc2libGUiLCJvQWN0aW9ucyIsImxlbmd0aCIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJhcHBseSIsImFjdGlvbklkeCIsImZvckVhY2giLCJhY3QiLCJtZW51QWN0aW9ucyIsImxvY2FsTmFtZSIsIm5hbWVzcGFjZVVSSSIsImFjdGlvbnNUb0FkZCIsImFjdFRvQWRkIiwiYWN0aW9uS2V5QWRkIiwiY3VyT3V0T2JqZWN0IiwidGV4dCIsIl9fbm9XcmFwIiwicmVxdWlyZXNTZWxlY3Rpb24iLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJtZW51SXRlbSIsImFjdGlvbktleSIsImFjdE9iamVjdCIsIm1lbnUiLCJjb250ZXh0T2JqZWN0UGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoIiwidGFyZ2V0T2JqZWN0IiwidGVybSIsIlByZXNlbnRhdGlvblZhcmlhbnQiLCJnZXRWaXN1YWxpemF0aW9uc0Zyb21QcmVzZW50YXRpb25WYXJpYW50IiwiTG9nIiwiZXJyb3IiLCJsaW5lSXRlbVZpeiIsImZpbmQiLCJ2aXoiLCJ2aXN1YWxpemF0aW9uIiwiYW5ub3RhdGlvblBhdGgiLCJwcmVzZW50YXRpb25QYXRoIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJUYWJsZS5tZXRhZGF0YS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVSUFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy92b2NhYnVsYXJpZXMvVUlcIjtcbmltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgeyBWaXN1YWxpemF0aW9uQW5kUGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IHtcblx0Z2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uLFxuXHRnZXRWaXN1YWxpemF0aW9uc0Zyb21QcmVzZW50YXRpb25WYXJpYW50XG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IHR5cGUgQ29udmVydGVyQ29udGV4dCBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyBidWlsZEV4cHJlc3Npb25Gb3JIZWFkZXJWaXNpYmxlIH0gZnJvbSBcInNhcC9mZS9tYWNyb3MvaW50ZXJuYWwvaGVscGVycy9UYWJsZVRlbXBsYXRpbmdcIjtcbmltcG9ydCBNYWNyb01ldGFkYXRhIGZyb20gXCJzYXAvZmUvbWFjcm9zL01hY3JvTWV0YWRhdGFcIjtcblxuLyoqXG4gKiBAY2xhc3NkZXNjXG4gKiBCdWlsZGluZyBibG9jayB1c2VkIHRvIGNyZWF0ZSBhIHRhYmxlIGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSBWNC5cbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpUYWJsZVxuICogICBpZD1cInNvbWVJRFwiXG4gKiAgIHR5cGU9XCJSZXNwb25zaXZlVGFibGVcIlxuICogICBjb2xsZWN0aW9uPVwiY29sbGVjdGlvblwiLFxuICogICBwcmVzZW50YXRpb249XCJwcmVzZW50YXRpb25cIlxuICogICBzZWxlY3Rpb25Nb2RlPVwiTXVsdGlcIlxuICogICByZXF1ZXN0R3JvdXBJZD1cIiRhdXRvLnRlc3RcIlxuICogICBkaXNwbGF5TW9kZT1cImZhbHNlXCJcbiAqICAgcGVyc29uYWxpemF0aW9uPVwiQ29sdW1uLFNvcnRcIlxuICogLyZndDtcbiAqIDwvcHJlPlxuICogQGNsYXNzIHNhcC5mZS5tYWNyb3MuVGFibGVcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmNvbnN0IFRhYmxlID0gTWFjcm9NZXRhZGF0YS5leHRlbmQoXCJzYXAuZmUubWFjcm9zLnRhYmxlLlRhYmxlXCIsIHtcblx0LyoqXG5cdCAqIE5hbWUgb2YgdGhlIG1hY3JvIGNvbnRyb2wuXG5cdCAqL1xuXHRuYW1lOiBcIlRhYmxlXCIsXG5cdC8qKlxuXHQgKiBOYW1lc3BhY2Ugb2YgdGhlIG1hY3JvIGNvbnRyb2xcblx0ICovXG5cdG5hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zLmludGVybmFsXCIsXG5cdHB1YmxpY05hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zXCIsXG5cdC8qKlxuXHQgKiBGcmFnbWVudCBzb3VyY2Ugb2YgdGhlIG1hY3JvIChvcHRpb25hbCkgLSBpZiBub3Qgc2V0LCBmcmFnbWVudCBpcyBnZW5lcmF0ZWQgZnJvbSBuYW1lc3BhY2UgYW5kIG5hbWVcblx0ICovXG5cdGZyYWdtZW50OiBcInNhcC5mZS5tYWNyb3MudGFibGUuVGFibGVcIixcblx0LyoqXG5cdCAqIFRoZSBtZXRhZGF0YSBkZXNjcmliaW5nIHRoZSBtYWNybyBjb250cm9sLlxuXHQgKi9cblx0bWV0YWRhdGE6IHtcblx0XHQvKipcblx0XHQgKiBEZWZpbmUgbWFjcm8gc3RlcmVvdHlwZSBmb3IgZG9jdW1lbnRhdGlvblxuXHRcdCAqL1xuXHRcdHN0ZXJlb3R5cGU6IFwieG1sbWFjcm9cIixcblx0XHQvKipcblx0XHQgKiBQcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdHRhYmxlRGVmaW5pdGlvbjoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCJcblx0XHRcdH0sXG5cdFx0XHRtZXRhUGF0aDoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0Y29udGV4dFBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBtZXRhZGF0YUNvbnRleHQ6Y29sbGVjdGlvbiBNYW5kYXRvcnkgY29udGV4dCB0byBhIGNvbGxlY3Rpb24gKGVudGl0eVNldCBvciAxOm4gbmF2aWdhdGlvbilcblx0XHRcdCAqL1xuXHRcdFx0Y29sbGVjdGlvbjoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0XHQka2luZDogW1wiRW50aXR5U2V0XCIsIFwiTmF2aWdhdGlvblByb3BlcnR5XCIsIFwiU2luZ2xldG9uXCJdXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQYXJlbnQgRW50aXR5U2V0IGZvciB0aGUgcHJlc2VudCBjb2xsZWN0aW9uXG5cdFx0XHQgKi9cblx0XHRcdHBhcmVudEVudGl0eVNldDoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCJcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSUQgb2YgdGhlIHRhYmxlXG5cdFx0XHQgKi9cblx0XHRcdGlkOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0X2FwaUlkOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFVzZWQgZm9yIGJpbmRpbmcgdGhlIHRhYmxlIHRvIGEgbmF2aWdhdGlvbiBwYXRoLiBPbmx5IHRoZSBwYXRoIGlzIHVzZWQgZm9yIGJpbmRpbmcgcm93cy5cblx0XHRcdCAqL1xuXHRcdFx0bmF2aWdhdGlvblBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHRhYmxlIHNob3VsZCBiZSByZWFkLW9ubHkgb3Igbm90LlxuXHRcdFx0ICovXG5cdFx0XHRyZWFkT25seToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRmaWVsZE1vZGU6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBcIlwiLFxuXHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbXCJcIiwgXCJub3dyYXBwZXJcIl1cblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBidXR0b24gaXMgaGlkZGVuIHdoZW4gbm8gZGF0YSBoYXMgYmVlbiBlbnRlcmVkIHlldCBpbiB0aGUgcm93ICh0cnVlL2ZhbHNlKS4gVGhlIGRlZmF1bHQgc2V0dGluZyBpcyBgZmFsc2VgLlxuXHRcdFx0ICovXG5cdFx0XHRkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBTcGVjaWZpZXMgdGhlIGZ1bGwgcGF0aCBhbmQgZnVuY3Rpb24gbmFtZSBvZiBhIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9uLlxuXHRcdFx0ICovXG5cdFx0XHRjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb246IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHRhYmxlIGlzIGRpc3BsYXllZCB3aXRoIGNvbmRlbnNlZCBsYXlvdXQgKHRydWUvZmFsc2UpLiBUaGUgZGVmYXVsdCBzZXR0aW5nIGlzIGBmYWxzZWAuXG5cdFx0XHQgKi9cblx0XHRcdHVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0OiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBTcGVjaWZpZXMgdGhlIHBvc3NpYmxlIGFjdGlvbnMgYXZhaWxhYmxlIG9uIHRoZSB0YWJsZSByb3cgKE5hdmlnYXRpb24sbnVsbCkuIFRoZSBkZWZhdWx0IHNldHRpbmcgaXMgYHVuZGVmaW5lZGBcblx0XHRcdCAqL1xuXHRcdFx0cm93QWN0aW9uOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBTcGVjaWZpZXMgdGhlIHNlbGVjdGlvbiBtb2RlIChOb25lLFNpbmdsZSxNdWx0aSxBdXRvKVxuXHRcdFx0ICovXG5cdFx0XHRzZWxlY3Rpb25Nb2RlOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBgYnVzeWAgbW9kZSBvZiB0YWJsZVxuXHRcdFx0ICovXG5cdFx0XHRidXN5OiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogUGFyYW1ldGVyIHVzZWQgdG8gc2hvdyB0aGUgZnVsbFNjcmVlbiBidXR0b24gb24gdGhlIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHRlbmFibGVGdWxsU2NyZWVuOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogU3BlY2lmaWVzIGhlYWRlciB0ZXh0IHRoYXQgaXMgc2hvd24gaW4gdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogQ29udHJvbHMgaWYgdGhlIGhlYWRlciB0ZXh0IHNob3VsZCBiZSBzaG93biBvciBub3Rcblx0XHRcdCAqL1xuXHRcdFx0aGVhZGVyVmlzaWJsZToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIERlZmluZXMgdGhlIFwiYXJpYS1sZXZlbFwiIG9mIHRoZSB0YWJsZSBoZWFkZXJcblx0XHRcdCAqL1xuXHRcdFx0aGVhZGVyTGV2ZWw6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkuY29yZS5UaXRsZUxldmVsXCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogXCJBdXRvXCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQYXJhbWV0ZXIgd2hpY2ggc2V0cyB0aGUgbm9EYXRhVGV4dCBmb3IgdGhlIG1kYyB0YWJsZVxuXHRcdFx0ICovXG5cdFx0XHRub0RhdGFUZXh0OiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIENyZWF0aW9uIE1vZGUgdG8gYmUgcGFzc2VkIHRvIHRoZSBvbkNyZWF0ZSBoYW5sZGVyLiBWYWx1ZXM6IFtcIklubGluZVwiLCBcIk5ld1BhZ2VcIl1cblx0XHRcdCAqL1xuXHRcdFx0Y3JlYXRpb25Nb2RlOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFNldHRpbmcgdG8gZGV0ZXJtaW5lIGlmIHRoZSBuZXcgcm93IHNob3VsZCBiZSBjcmVhdGVkIGF0IHRoZSBlbmQgb3IgYmVnaW5uaW5nXG5cdFx0XHQgKi9cblx0XHRcdGNyZWF0ZUF0RW5kOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlT3V0Ym91bmQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdGNyZWF0ZU91dGJvdW5kRGV0YWlsOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHRjcmVhdGVOZXdBY3Rpb246IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogUGVyc29uYWxpemF0aW9uIE1vZGVcblx0XHRcdCAqL1xuXHRcdFx0cGVyc29uYWxpemF0aW9uOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nfGJvb2xlYW5cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRpc1NlYXJjaGFibGU6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBbGxvd3MgdG8gY2hvb3NlIHRoZSBUYWJsZSB0eXBlLiBBbGxvd2VkIHZhbHVlcyBhcmUgYFJlc3BvbnNpdmVUYWJsZWAgb3IgYEdyaWRUYWJsZWAuXG5cdFx0XHQgKi9cblx0XHRcdHR5cGU6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHR0YWJsZVR5cGU6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRW5hYmxlIGV4cG9ydCB0byBmaWxlXG5cdFx0XHQgKi9cblx0XHRcdGVuYWJsZUV4cG9ydDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEVuYWJsZSBleHBvcnQgdG8gZmlsZVxuXHRcdFx0ICovXG5cdFx0XHRlbmFibGVQYXN0ZToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIE9OTFkgRk9SIEdSSUQgVEFCTEU6IE51bWJlciBvZiBpbmRpY2VzIHdoaWNoIGNhbiBiZSBzZWxlY3RlZCBpbiBhIHJhbmdlLiBJZiBzZXQgdG8gMCwgdGhlIHNlbGVjdGlvbiBsaW1pdCBpcyBkaXNhYmxlZCwgYW5kIHRoZSBTZWxlY3QgQWxsIGNoZWNrYm94IGFwcGVhcnMgaW5zdGVhZCBvZiB0aGUgRGVzZWxlY3QgQWxsIGJ1dHRvbi5cblx0XHRcdCAqL1xuXHRcdFx0c2VsZWN0aW9uTGltaXQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogT05MWSBGT1IgUkVTUE9OU0lWRSBUQUJMRTogU2V0dGluZyB0byBkZWZpbmUgdGhlIGNoZWNrYm94IGluIHRoZSBjb2x1bW4gaGVhZGVyOiBBbGxvd2VkIHZhbHVlcyBhcmUgYERlZmF1bHRgIG9yIGBDbGVhckFsbGAuIElmIHNldCB0byBgRGVmYXVsdGAsIHRoZSBzYXAubS5UYWJsZSBjb250cm9sIHJlbmRlcnMgdGhlIFNlbGVjdCBBbGwgY2hlY2tib3gsIG90aGVyd2lzZSB0aGUgRGVzZWxlY3QgQWxsIGJ1dHRvbiBpcyByZW5kZXJlZC5cblx0XHRcdCAqL1xuXHRcdFx0bXVsdGlTZWxlY3RNb2RlOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBjb250cm9sIElEIG9mIHRoZSBGaWx0ZXJCYXIgdGhhdCBpcyB1c2VkIHRvIGZpbHRlciB0aGUgcm93cyBvZiB0aGUgdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdGZpbHRlckJhcjoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIGNvbnRyb2wgSUQgb2YgdGhlIEZpbHRlckJhciB0aGF0IGlzIHVzZWQgaW50ZXJuYWxseSB0byBmaWx0ZXIgdGhlIHJvd3Mgb2YgdGhlIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHRmaWx0ZXJCYXJJZDoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHR9LFxuXHRcdFx0dGFibGVEZWxlZ2F0ZToge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHR9LFxuXHRcdFx0ZW5hYmxlQXV0b1Njcm9sbDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdFx0fSxcblx0XHRcdHZpc2libGU6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdGlzQWxwOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0dmFyaWFudE1hbmFnZW1lbnQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRjb2x1bW5FZGl0TW9kZToge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRjb21wdXRlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdHRhYlRpdGxlOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogXCJcIlxuXHRcdFx0fSxcblx0XHRcdGVuYWJsZUF1dG9Db2x1bW5XaWR0aDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdFx0fSxcblx0XHRcdGRhdGFTdGF0ZUluZGljYXRvckZpbHRlcjoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHR9LFxuXHRcdFx0aXNDb21wYWN0VHlwZToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHR2YXJpYW50U2F2ZWQ6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9LFxuXHRcdFx0dmFyaWFudFNlbGVjdGVkOiB7XG5cdFx0XHRcdHR5cGU6IFwiZnVuY3Rpb25cIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRXZlbnQgaGFuZGxlciBmb3IgY2hhbmdlIGV2ZW50XG5cdFx0XHQgKi9cblx0XHRcdG9uQ2hhbmdlOiB7XG5cdFx0XHRcdHR5cGU6IFwiZnVuY3Rpb25cIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRXZlbnQgaGFuZGxlciB0byByZWFjdCB3aGVuIHRoZSB1c2VyIGNob29zZXMgYSByb3dcblx0XHRcdCAqL1xuXHRcdFx0cm93UHJlc3M6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRXZlbnQgaGFuZGxlciB0byByZWFjdCB0byB0aGUgY29udGV4dENoYW5nZSBldmVudCBvZiB0aGUgdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdG9uQ29udGV4dENoYW5nZToge1xuXHRcdFx0XHR0eXBlOiBcImZ1bmN0aW9uXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEV2ZW50IGhhbmRsZXIgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2hvb3NlcyBhbiBvcHRpb24gb2YgdGhlIHNlZ21lbnRlZCBidXR0b24gaW4gdGhlIEFMUCBWaWV3XG5cdFx0XHQgKi9cblx0XHRcdG9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZDoge1xuXHRcdFx0XHR0eXBlOiBcImZ1bmN0aW9uXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEV2ZW50IGhhbmRsZXIgdG8gcmVhY3QgdG8gdGhlIHN0YXRlQ2hhbmdlIGV2ZW50IG9mIHRoZSB0YWJsZS5cblx0XHRcdCAqL1xuXHRcdFx0c3RhdGVDaGFuZ2U6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IHdoZW4gdGhlIHRhYmxlIHNlbGVjdGlvbiBjaGFuZ2VzXG5cdFx0XHQgKi9cblx0XHRcdHNlbGVjdGlvbkNoYW5nZToge1xuXHRcdFx0XHR0eXBlOiBcImZ1bmN0aW9uXCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhZ2dyZWdhdGlvbnM6IHtcblx0XHRcdGFjdGlvbnM6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAuZmUubWFjcm9zLmludGVybmFsLnRhYmxlLkFjdGlvbiB8IHNhcC5mZS5tYWNyb3MuaW50ZXJuYWwudGFibGUuQWN0aW9uR3JvdXBcIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRjb2x1bW5zOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbC50YWJsZS5Db2x1bW5cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGNyZWF0ZTogZnVuY3Rpb24gKG9Qcm9wczogYW55LCBvQ29udHJvbENvbmZpZ3VyYXRpb246IGFueSwgbVNldHRpbmdzOiBhbnksIG9BZ2dyZWdhdGlvbnM6IGFueSkge1xuXHRcdGxldCBvVGFibGVEZWZpbml0aW9uO1xuXHRcdGNvbnN0IG9Db250ZXh0T2JqZWN0UGF0aCA9IGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvUHJvcHMubWV0YVBhdGgsIG9Qcm9wcy5jb250ZXh0UGF0aCk7XG5cblx0XHRpZiAoIW9Qcm9wcy50YWJsZURlZmluaXRpb24pIHtcblx0XHRcdGNvbnN0IGluaXRpYWxDb252ZXJ0ZXJDb250ZXh0ID0gdGhpcy5nZXRDb252ZXJ0ZXJDb250ZXh0KG9Db250ZXh0T2JqZWN0UGF0aCwgb1Byb3BzLmNvbnRleHRQYXRoLCBtU2V0dGluZ3MpO1xuXHRcdFx0Y29uc3Qgc1Zpc3VhbGl6YXRpb25QYXRoID0gdGhpcy5fZ2V0VmlzdWFsaXphdGlvblBhdGgob0NvbnRleHRPYmplY3RQYXRoLCBpbml0aWFsQ29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRjb25zdCBzUHJlc2VudGF0aW9uUGF0aCA9IHRoaXMuX2dldFByZXNlbnRhdGlvblBhdGgob0NvbnRleHRPYmplY3RQYXRoKTtcblxuXHRcdFx0Ly9DaGVjayBpZiB3ZSBoYXZlIEFjdGlvbkdyb3VwIGFuZCBhZGQgbmVzdGVkIGFjdGlvbnNcblx0XHRcdGNvbnN0IG9FeHRyYUFjdGlvbnMgPSB0aGlzLl9idWlsZEFjdGlvbnMob0FnZ3JlZ2F0aW9ucy5hY3Rpb25zKTtcblxuXHRcdFx0Y29uc3Qgb0V4dHJhQ29sdW1ucyA9IHRoaXMucGFyc2VBZ2dyZWdhdGlvbihvQWdncmVnYXRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChjaGlsZENvbHVtbjogYW55LCBjb2x1bW5DaGlsZElkeDogbnVtYmVyKSB7XG5cdFx0XHRcdGNvbnN0IGNvbHVtbktleSA9IGNoaWxkQ29sdW1uLmdldEF0dHJpYnV0ZShcImtleVwiKSB8fCBcIklubGluZVhNTENvbHVtbl9cIiArIGNvbHVtbkNoaWxkSWR4O1xuXHRcdFx0XHRvQWdncmVnYXRpb25zW2NvbHVtbktleV0gPSBjaGlsZENvbHVtbjtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQvLyBEZWZhdWx0cyBhcmUgdG8gYmUgZGVmaW5lZCBpbiBUYWJsZS50c1xuXHRcdFx0XHRcdGtleTogY29sdW1uS2V5LFxuXHRcdFx0XHRcdHR5cGU6IFwiU2xvdFwiLFxuXHRcdFx0XHRcdHdpZHRoOiBjaGlsZENvbHVtbi5nZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSxcblx0XHRcdFx0XHRpbXBvcnRhbmNlOiBjaGlsZENvbHVtbi5nZXRBdHRyaWJ1dGUoXCJpbXBvcnRhbmNlXCIpLFxuXHRcdFx0XHRcdGhvcml6b250YWxBbGlnbjogY2hpbGRDb2x1bW4uZ2V0QXR0cmlidXRlKFwiaG9yaXpvbnRhbEFsaWduXCIpLFxuXHRcdFx0XHRcdGF2YWlsYWJpbGl0eTogY2hpbGRDb2x1bW4uZ2V0QXR0cmlidXRlKFwiYXZhaWxhYmlsaXR5XCIpLFxuXHRcdFx0XHRcdGhlYWRlcjogY2hpbGRDb2x1bW4uZ2V0QXR0cmlidXRlKFwiaGVhZGVyXCIpLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiBjaGlsZENvbHVtbi5jaGlsZHJlblswXT8ub3V0ZXJIVE1MIHx8IFwiXCIsXG5cdFx0XHRcdFx0cHJvcGVydGllczogY2hpbGRDb2x1bW4uZ2V0QXR0cmlidXRlKFwicHJvcGVydGllc1wiKSA/IGNoaWxkQ29sdW1uLmdldEF0dHJpYnV0ZShcInByb3BlcnRpZXNcIikuc3BsaXQoXCIsXCIpIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdFx0XHRwbGFjZW1lbnQ6IGNoaWxkQ29sdW1uLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uUGxhY2VtZW50XCIpLFxuXHRcdFx0XHRcdFx0YW5jaG9yOiBjaGlsZENvbHVtbi5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvbkFuY2hvclwiKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3Qgb0V4dHJhUGFyYW1zOiBhbnkgPSB7fTtcblx0XHRcdGxldCBtVGFibGVTZXR0aW5ncyA9IHtcblx0XHRcdFx0ZW5hYmxlRXhwb3J0OiBvUHJvcHMuZW5hYmxlRXhwb3J0LFxuXHRcdFx0XHRlbmFibGVGdWxsU2NyZWVuOiBvUHJvcHMuZW5hYmxlRnVsbFNjcmVlbixcblx0XHRcdFx0ZW5hYmxlUGFzdGU6IG9Qcm9wcy5lbmFibGVQYXN0ZSxcblx0XHRcdFx0c2VsZWN0aW9uTW9kZTogb1Byb3BzLnNlbGVjdGlvbk1vZGUsXG5cdFx0XHRcdHR5cGU6IG9Qcm9wcy50eXBlXG5cdFx0XHR9O1xuXHRcdFx0Ly9yZW1vdmVzIHVuZGVmaW5lZCB2YWx1ZXMgZnJvbSBtVGFibGVTZXR0aW5nc1xuXHRcdFx0bVRhYmxlU2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1UYWJsZVNldHRpbmdzKSk7XG5cblx0XHRcdG9FeHRyYVBhcmFtc1tzVmlzdWFsaXphdGlvblBhdGhdID0ge1xuXHRcdFx0XHRhY3Rpb25zOiBvRXh0cmFBY3Rpb25zLFxuXHRcdFx0XHRjb2x1bW5zOiBvRXh0cmFDb2x1bW5zLFxuXHRcdFx0XHR0YWJsZVNldHRpbmdzOiBtVGFibGVTZXR0aW5nc1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IG9Db252ZXJ0ZXJDb250ZXh0ID0gdGhpcy5nZXRDb252ZXJ0ZXJDb250ZXh0KG9Db250ZXh0T2JqZWN0UGF0aCwgb1Byb3BzLmNvbnRleHRQYXRoLCBtU2V0dGluZ3MsIG9FeHRyYVBhcmFtcyk7XG5cblx0XHRcdGNvbnN0IG9WaXN1YWxpemF0aW9uRGVmaW5pdGlvbiA9IGdldERhdGFWaXN1YWxpemF0aW9uQ29uZmlndXJhdGlvbihcblx0XHRcdFx0c1Zpc3VhbGl6YXRpb25QYXRoLFxuXHRcdFx0XHRvUHJvcHMudXNlQ29uZGVuc2VkTGF5b3V0LFxuXHRcdFx0XHRvQ29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdHNQcmVzZW50YXRpb25QYXRoXG5cdFx0XHQpO1xuXHRcdFx0b1RhYmxlRGVmaW5pdGlvbiA9IG9WaXN1YWxpemF0aW9uRGVmaW5pdGlvbi52aXN1YWxpemF0aW9uc1swXTtcblxuXHRcdFx0b1Byb3BzLnRhYmxlRGVmaW5pdGlvbiA9IHRoaXMuY3JlYXRlQmluZGluZ0NvbnRleHQob1RhYmxlRGVmaW5pdGlvbiwgbVNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b1RhYmxlRGVmaW5pdGlvbiA9IG9Qcm9wcy50YWJsZURlZmluaXRpb24uZ2V0T2JqZWN0KCk7XG5cdFx0fVxuXHRcdG9UYWJsZURlZmluaXRpb24ucGF0aCA9IFwie19wYWdlTW9kZWw+XCIgKyBvUHJvcHMudGFibGVEZWZpbml0aW9uLmdldFBhdGgoKSArIFwifVwiO1xuXHRcdC8vIHB1YmxpYyBwcm9wZXJ0aWVzIHByb2Nlc3NlZCBieSBjb252ZXJ0ZXIgY29udGV4dFxuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJzZWxlY3Rpb25Nb2RlXCIsIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5zZWxlY3Rpb25Nb2RlLCB0cnVlKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwiZW5hYmxlRnVsbFNjcmVlblwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wuZW5hYmxlRnVsbFNjcmVlbiwgdHJ1ZSk7XG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcImVuYWJsZUV4cG9ydFwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wuZW5hYmxlRXhwb3J0LCB0cnVlKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwiZW5hYmxlUGFzdGVcIiwgb1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLnN0YW5kYXJkQWN0aW9ucy5hY3Rpb25zLnBhc3RlLmVuYWJsZWQsIHRydWUpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJ1cGRhdGFibGVQcm9wZXJ0eVBhdGhcIiwgb1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLnN0YW5kYXJkQWN0aW9ucy51cGRhdGFibGVQcm9wZXJ0eVBhdGgsIHRydWUpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJ0eXBlXCIsIG9UYWJsZURlZmluaXRpb24uY29udHJvbC50eXBlLCB0cnVlKTtcblxuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJ1c2VDb25kZW5zZWRUYWJsZUxheW91dFwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wudXNlQ29uZGVuc2VkVGFibGVMYXlvdXQpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhXCIsIG9UYWJsZURlZmluaXRpb24uY29udHJvbC5kaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwiY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uXCIsIG9UYWJsZURlZmluaXRpb24uY29udHJvbC5jdXN0b21WYWxpZGF0aW9uRnVuY3Rpb24pO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJoZWFkZXJWaXNpYmxlXCIsIG9UYWJsZURlZmluaXRpb24uY29udHJvbC5oZWFkZXJWaXNpYmxlKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwic2VhcmNoYWJsZVwiLCBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uc2VhcmNoYWJsZSk7XG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcInNob3dSb3dDb3VudFwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wuc2hvd1Jvd0NvdW50KTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwiaW5saW5lQ3JlYXRpb25Sb3dDb3VudFwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wuaW5saW5lQ3JlYXRpb25Sb3dDb3VudCk7XG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcImhlYWRlclwiLCBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24udGl0bGUpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJzZWxlY3Rpb25MaW1pdFwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wuc2VsZWN0aW9uTGltaXQpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJpc0NvbXBhY3RUeXBlXCIsIG9UYWJsZURlZmluaXRpb24uY29udHJvbC5pc0NvbXBhY3RUeXBlKTtcblx0XHRpZiAob1Byb3BzLmlkKSB7XG5cdFx0XHQvLyBUaGUgZ2l2ZW4gSUQgc2hhbGwgYmUgYXNzaWduZWQgdG8gdGhlIFRhYmxlQVBJIGFuZCBub3QgdG8gdGhlIE1EQyBUYWJsZVxuXHRcdFx0b1Byb3BzLl9hcGlJZCA9IG9Qcm9wcy5pZDtcblx0XHRcdG9Qcm9wcy5pZCA9IHRoaXMuZ2V0Q29udGVudElkKG9Qcm9wcy5pZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFdlIGdlbmVyYXRlIHRoZSBJRC4gRHVlIHRvIGNvbXBhdGliaWxpdHkgcmVhc29ucyB3ZSBrZWVwIGl0IG9uIHRoZSBNREMgVGFibGUgYnV0IHByb3ZpZGUgYXNzaWduXG5cdFx0XHQvLyB0aGUgSUQgd2l0aCBhIDo6VGFibGUgc3VmZml4IHRvIHRoZSBUYWJsZUFQSVxuXHRcdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcImlkXCIsIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5pZCk7XG5cdFx0XHRvUHJvcHMuX2FwaUlkID0gb1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmlkICsgXCI6OlRhYmxlXCI7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcImNyZWF0aW9uTW9kZVwiLCBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uY3JlYXRlLm1vZGUpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJjcmVhdGVBdEVuZFwiLCBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uY3JlYXRlLmFwcGVuZCk7XG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcImNyZWF0ZU91dGJvdW5kXCIsIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5jcmVhdGUub3V0Ym91bmQpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJjcmVhdGVOZXdBY3Rpb25cIiwgb1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmNyZWF0ZS5uZXdBY3Rpb24pO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJjcmVhdGVPdXRib3VuZERldGFpbFwiLCBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uY3JlYXRlLm91dGJvdW5kRGV0YWlsKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwicGVyc29uYWxpemF0aW9uXCIsIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5wMTNuTW9kZSk7XG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcInZhcmlhbnRNYW5hZ2VtZW50XCIsIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi52YXJpYW50TWFuYWdlbWVudCk7XG5cdFx0dGhpcy5zZXREZWZhdWx0VmFsdWUob1Byb3BzLCBcImVuYWJsZUF1dG9Db2x1bW5XaWR0aFwiLCBvVGFibGVEZWZpbml0aW9uLmNvbnRyb2wuZW5hYmxlQXV0b0NvbHVtbldpZHRoKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwiZGF0YVN0YXRlSW5kaWNhdG9yRmlsdGVyXCIsIG9UYWJsZURlZmluaXRpb24uY29udHJvbC5kYXRhU3RhdGVJbmRpY2F0b3JGaWx0ZXIpO1xuXHRcdC8vIFNwZWNpYWwgY29kZSBmb3IgcmVhZE9ubHlcblx0XHQvLyByZWFkb25seSA9IGZhbHNlIC0+IEZvcmNlIGVkaXRhYmxlXG5cdFx0Ly8gcmVhZG9ubHkgPSB0cnVlIC0+IEZvcmNlIGRpc3BsYXkgbW9kZVxuXHRcdC8vIHJlYWRvbmx5ID0gdW5kZWZpbmVkIC0+IEJvdW5kIHRvIGVkaXQgZmxvd1xuXG5cdFx0c3dpdGNoIChvUHJvcHMucmVhZE9ubHkpIHtcblx0XHRcdGNhc2UgXCJmYWxzZVwiOlxuXHRcdFx0XHRvUHJvcHMucmVhZE9ubHkgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidHJ1ZVwiOlxuXHRcdFx0XHRvUHJvcHMucmVhZE9ubHkgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0fVxuXG5cdFx0aWYgKG9Qcm9wcy5yZWFkT25seSA9PT0gdW5kZWZpbmVkICYmIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5kaXNwbGF5TW9kZSA9PT0gdHJ1ZSkge1xuXHRcdFx0b1Byb3BzLnJlYWRPbmx5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAob1Byb3BzLnJvd1ByZXNzKSB7XG5cdFx0XHRvUHJvcHMucm93QWN0aW9uID0gXCJOYXZpZ2F0aW9uXCI7XG5cdFx0fVxuXHRcdHRoaXMuc2V0RGVmYXVsdFZhbHVlKG9Qcm9wcywgXCJyb3dQcmVzc1wiLCBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24ucm93LnByZXNzKTtcblx0XHR0aGlzLnNldERlZmF1bHRWYWx1ZShvUHJvcHMsIFwicm93QWN0aW9uXCIsIG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5yb3cuYWN0aW9uKTtcblxuXHRcdGlmIChvUHJvcHMucGVyc29uYWxpemF0aW9uID09PSBcImZhbHNlXCIpIHtcblx0XHRcdG9Qcm9wcy5wZXJzb25hbGl6YXRpb24gPSB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIGlmIChvUHJvcHMucGVyc29uYWxpemF0aW9uID09PSBcInRydWVcIikge1xuXHRcdFx0b1Byb3BzLnBlcnNvbmFsaXphdGlvbiA9IFwiU29ydCxDb2x1bW4sRmlsdGVyXCI7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChvUHJvcHMucGVyc29uYWxpemF0aW9uKSB7XG5cdFx0XHRjYXNlIFwiZmFsc2VcIjpcblx0XHRcdFx0b1Byb3BzLnBlcnNvbmFsaXphdGlvbiA9IHVuZGVmaW5lZDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidHJ1ZVwiOlxuXHRcdFx0XHRvUHJvcHMucGVyc29uYWxpemF0aW9uID0gXCJTb3J0LENvbHVtbixGaWx0ZXJcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdH1cblxuXHRcdGlmIChvUHJvcHMuaXNTZWFyY2hhYmxlID09PSBcImZhbHNlXCIpIHtcblx0XHRcdG9Qcm9wcy5zZWFyY2hhYmxlID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9Qcm9wcy5zZWFyY2hhYmxlID0gb1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLnNlYXJjaGFibGU7XG5cdFx0fVxuXG5cdFx0bGV0IHVzZUJhc2ljU2VhcmNoID0gZmFsc2U7XG5cblx0XHQvLyBOb3RlIGZvciB0aGUgJ2ZpbHRlckJhcicgcHJvcGVydHk6XG5cdFx0Ly8gMS4gSUQgcmVsYXRpdmUgdG8gdGhlIHZpZXcgb2YgdGhlIFRhYmxlLlxuXHRcdC8vIDIuIEFic29sdXRlIElELlxuXHRcdC8vIDMuIElEIHdvdWxkIGJlIGNvbnNpZGVyZWQgaW4gYXNzb2NpYXRpb24gdG8gVGFibGVBUEkncyBJRC5cblx0XHRpZiAoIW9Qcm9wcy5maWx0ZXJCYXIgJiYgIW9Qcm9wcy5maWx0ZXJCYXJJZCAmJiBvUHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0Ly8gZmlsdGVyQmFyOiBQdWJsaWMgcHJvcGVydHkgZm9yIGJ1aWxkaW5nIGJsb2Nrc1xuXHRcdFx0Ly8gZmlsdGVyQmFySWQ6IE9ubHkgdXNlZCBhcyBJbnRlcm5hbCBwcml2YXRlIHByb3BlcnR5IGZvciBGRSB0ZW1wbGF0ZXNcblx0XHRcdG9Qcm9wcy5maWx0ZXJCYXJJZCA9IGdlbmVyYXRlKFtvUHJvcHMuaWQsIFwiU3RhbmRhcmRBY3Rpb25cIiwgXCJCYXNpY1NlYXJjaFwiXSk7XG5cdFx0XHR1c2VCYXNpY1NlYXJjaCA9IHRydWU7XG5cdFx0fVxuXHRcdC8vIEludGVybmFsIHByb3BlcnRpZXNcblx0XHRvUHJvcHMudXNlQmFzaWNTZWFyY2ggPSB1c2VCYXNpY1NlYXJjaDtcblx0XHRvUHJvcHMudGFibGVUeXBlID0gb1Byb3BzLnR5cGU7XG5cdFx0b1Byb3BzLnNob3dDcmVhdGUgPSBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uc3RhbmRhcmRBY3Rpb25zLmFjdGlvbnMuY3JlYXRlLnZpc2libGUgfHwgdHJ1ZTtcblx0XHRvUHJvcHMuYXV0b0JpbmRPbkluaXQgPSBvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uYXV0b0JpbmRPbkluaXQ7XG5cblx0XHQvLyBJbnRlcm5hbCB0aGF0IEkgd2FudCB0byByZW1vdmUgaW4gdGhlIGVuZFxuXHRcdG9Qcm9wcy5uYXZpZ2F0aW9uUGF0aCA9IG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5uYXZpZ2F0aW9uUGF0aDsgLy8gb1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmNvbGxlY3Rpb247IC8vRGF0YU1vZGVsUGF0aEhlbHBlci5nZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoKG9Db250ZXh0T2JqZWN0UGF0aCk7IC8vXG5cdFx0aWYgKG9UYWJsZURlZmluaXRpb24uYW5ub3RhdGlvbi5jb2xsZWN0aW9uLnN0YXJ0c1dpdGgoXCIvXCIpICYmIG9Db250ZXh0T2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldC5fdHlwZSA9PT0gXCJTaW5nbGV0b25cIikge1xuXHRcdFx0b1RhYmxlRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmNvbGxlY3Rpb24gPSBvUHJvcHMubmF2aWdhdGlvblBhdGg7XG5cdFx0fVxuXHRcdG9Qcm9wcy5wYXJlbnRFbnRpdHlTZXQgPSBtU2V0dGluZ3MubW9kZWxzLm1ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcblx0XHRcdFwiL1wiICtcblx0XHRcdFx0KG9Db250ZXh0T2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24hLnRhcmdldEVudGl0eVNldFxuXHRcdFx0XHRcdD8gb0NvbnRleHRPYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbiEudGFyZ2V0RW50aXR5U2V0Lm5hbWVcblx0XHRcdFx0XHQ6IG9Db250ZXh0T2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldC5uYW1lKVxuXHRcdCk7XG5cdFx0b1Byb3BzLmNvbGxlY3Rpb24gPSBtU2V0dGluZ3MubW9kZWxzLm1ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChvVGFibGVEZWZpbml0aW9uLmFubm90YXRpb24uY29sbGVjdGlvbik7XG5cblx0XHRzd2l0Y2ggKG9Qcm9wcy5yZWFkT25seSkge1xuXHRcdFx0Y2FzZSB0cnVlOlxuXHRcdFx0XHRvUHJvcHMuY29sdW1uRWRpdE1vZGUgPSBcIkRpc3BsYXlcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIGZhbHNlOlxuXHRcdFx0XHRvUHJvcHMuY29sdW1uRWRpdE1vZGUgPSBcIkVkaXRhYmxlXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0b1Byb3BzLmNvbHVtbkVkaXRNb2RlID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHQvLyBSZWdhcmRpbmcgdGhlIHJlbWFpbmluZyBvbmVzIHRoYXQgSSB0aGluayB3ZSBjb3VsZCByZXZpZXdcblx0XHQvLyBzZWxlY3RlZENvbnRleHRzTW9kZWwgLT4gcG90ZW50aWFsbHkgaGFyZGNvZGVkIG9yIGludGVybmFsIG9ubHlcblx0XHQvLyBvbkNvbnRleHRDaGFuZ2UgLT4gQXV0b3Njcm9sbCAuLi4gbWlnaHQgbmVlZCByZXZpc2lvblxuXHRcdC8vIG9uQ2hhbmdlIC0+IEp1c3QgcHJveGllZCBkb3duIHRvIHRoZSBGaWVsZCBtYXkgbmVlZCB0byBzZWUgaWYgbmVlZGVkIG9yIG5vdFxuXHRcdC8vIHZhcmlhbnRTZWxlY3RlZCAvIHZhcmlhbnRTYXZlZCAtPiBWYXJpYW50IE1hbmFnZW1lbnQgc3RhbmRhcmQgaGVscGVycyA/XG5cdFx0Ly8gdGFibGVEZWxlZ2F0ZSAgLT4gdXNlZCBleHRlcm5hbGx5IGZvciBBTFAgLi4uIG1pZ2h0IG5lZWQgdG8gc2VlIGlmIHJlbGV2YW50IHN0aWxsXG5cdFx0Ly8gb25TZWdtZW50ZWRCdXR0b25QcmVzc2VkIC0+IEFMUCBzcGVjaWZpYywgc2hvdWxkIGJlIGEgZGVkaWNhdGVkIGNvbnRyb2wgZm9yIHRoZSBjb250ZW50Vmlld1N3aXRjaGVyXG5cdFx0Ly8gdmlzaWJsZSAtPiByZWxhdGVkIHRvIHRoaXMgQUxQIGNvbnRlbnRWaWV3U3dpdGNoZXIuLi4gbWF5YmUgYW4gb3V0ZXIgY29udHJvbCB3b3VsZCBtYWtlIG1vcmUgc2Vuc2UgP1xuXG5cdFx0b1Byb3BzLmhlYWRlckJpbmRpbmdFeHByZXNzaW9uID0gYnVpbGRFeHByZXNzaW9uRm9ySGVhZGVyVmlzaWJsZShvUHJvcHMpO1xuXHRcdHJldHVybiBvUHJvcHM7XG5cdH0sXG5cdC8qKlxuXHQgKiBCdWlsZCBhY3Rpb25zIGFuZCBhY3Rpb24gZ3JvdXBzIGZvciB0YWJsZSB2aXN1YWxpc2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0FjdGlvbnMgWE1MIG5vZGUgY29ycmVzcG9uZGluZyB0byBhY3Rpb25zXG5cdCAqIEByZXR1cm5zIFByZXBhcmVkIGFjdGlvbnNcblx0ICovXG5cdF9idWlsZEFjdGlvbnM6IGZ1bmN0aW9uIChvQWN0aW9uczogYW55KSB7XG5cdFx0Y29uc3Qgb0V4dHJhQWN0aW9uczogYW55ID0ge307XG5cdFx0aWYgKG9BY3Rpb25zICYmIG9BY3Rpb25zLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IGFjdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkob0FjdGlvbnMuY2hpbGRyZW4pO1xuXHRcdFx0bGV0IGFjdGlvbklkeCA9IDA7XG5cdFx0XHRhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKGFjdCkge1xuXHRcdFx0XHRhY3Rpb25JZHgrKztcblx0XHRcdFx0bGV0IG1lbnVBY3Rpb25zOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRpZiAoYWN0LmNoaWxkcmVuLmxlbmd0aCAmJiBhY3QubG9jYWxOYW1lID09PSBcIkFjdGlvbkdyb3VwXCIgJiYgYWN0Lm5hbWVzcGFjZVVSSSA9PT0gXCJzYXAuZmUubWFjcm9zXCIpIHtcblx0XHRcdFx0XHRjb25zdCBhY3Rpb25zVG9BZGQgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYWN0LmNoaWxkcmVuKTtcblx0XHRcdFx0XHRhY3Rpb25zVG9BZGQuZm9yRWFjaChmdW5jdGlvbiAoYWN0VG9BZGQpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGFjdGlvbktleUFkZCA9IGFjdFRvQWRkLmdldEF0dHJpYnV0ZShcImtleVwiKSB8fCBcIklubGluZVhNTEFjdGlvbl9cIiArIGFjdGlvbklkeDtcblx0XHRcdFx0XHRcdGNvbnN0IGN1ck91dE9iamVjdCA9IHtcblx0XHRcdFx0XHRcdFx0a2V5OiBhY3Rpb25LZXlBZGQsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IGFjdFRvQWRkLmdldEF0dHJpYnV0ZShcInRleHRcIiksXG5cdFx0XHRcdFx0XHRcdF9fbm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRwcmVzczogYWN0VG9BZGQuZ2V0QXR0cmlidXRlKFwicHJlc3NcIiksXG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVzU2VsZWN0aW9uOiBhY3RUb0FkZC5nZXRBdHRyaWJ1dGUoXCJyZXF1aXJlc1NlbGVjdGlvblwiKSA9PT0gXCJ0cnVlXCIsXG5cdFx0XHRcdFx0XHRcdGVuYWJsZWQ6IGFjdFRvQWRkLmdldEF0dHJpYnV0ZShcImVuYWJsZWRcIikgPT09IG51bGwgPyB0cnVlIDogYWN0VG9BZGQuZ2V0QXR0cmlidXRlKFwiZW5hYmxlZFwiKVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdG9FeHRyYUFjdGlvbnNbY3VyT3V0T2JqZWN0LmtleV0gPSBjdXJPdXRPYmplY3Q7XG5cdFx0XHRcdFx0XHRhY3Rpb25JZHgrKztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRtZW51QWN0aW9ucyA9IE9iamVjdC52YWx1ZXMob0V4dHJhQWN0aW9ucylcblx0XHRcdFx0XHRcdC5zbGljZSgtYWN0LmNoaWxkcmVuLmxlbmd0aClcblx0XHRcdFx0XHRcdC5tYXAoZnVuY3Rpb24gKG1lbnVJdGVtOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1lbnVJdGVtLmtleTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGFjdGlvbktleSA9IGFjdC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgfHwgXCJJbmxpbmVYTUxBY3Rpb25fXCIgKyBhY3Rpb25JZHg7XG5cdFx0XHRcdGNvbnN0IGFjdE9iamVjdCA9IHtcblx0XHRcdFx0XHRrZXk6IGFjdGlvbktleSxcblx0XHRcdFx0XHR0ZXh0OiBhY3QuZ2V0QXR0cmlidXRlKFwidGV4dFwiKSxcblx0XHRcdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRcdFx0cGxhY2VtZW50OiBhY3QuZ2V0QXR0cmlidXRlKFwicGxhY2VtZW50XCIpLFxuXHRcdFx0XHRcdFx0YW5jaG9yOiBhY3QuZ2V0QXR0cmlidXRlKFwiYW5jaG9yXCIpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRfX25vV3JhcDogdHJ1ZSxcblx0XHRcdFx0XHRwcmVzczogYWN0LmdldEF0dHJpYnV0ZShcInByZXNzXCIpLFxuXHRcdFx0XHRcdHJlcXVpcmVzU2VsZWN0aW9uOiBhY3QuZ2V0QXR0cmlidXRlKFwicmVxdWlyZXNTZWxlY3Rpb25cIikgPT09IFwidHJ1ZVwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6IGFjdC5nZXRBdHRyaWJ1dGUoXCJlbmFibGVkXCIpID09PSBudWxsID8gdHJ1ZSA6IGFjdC5nZXRBdHRyaWJ1dGUoXCJlbmFibGVkXCIpLFxuXHRcdFx0XHRcdG1lbnU6IG1lbnVBY3Rpb25zLmxlbmd0aCA/IG1lbnVBY3Rpb25zIDogbnVsbFxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvRXh0cmFBY3Rpb25zW2FjdE9iamVjdC5rZXldID0gYWN0T2JqZWN0O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBvRXh0cmFBY3Rpb25zO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBhbm5vdGF0aW9uIHBhdGggcG9pbnRpbmcgdG8gdGhlIHZpc3VhbGl6YXRpb24gYW5ub3RhdGlvbiAoTGluZUl0ZW0pLlxuXHQgKlxuXHQgKiBAcGFyYW0gY29udGV4dE9iamVjdFBhdGggVGhlIGRhdGFtb2RlbCBvYmplY3QgcGF0aCBmb3IgdGhlIHRhYmxlXG5cdCAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuXHQgKiBAcmV0dXJucyBUaGUgYW5ub3RhdGlvbiBwYXRoXG5cdCAqL1xuXHRfZ2V0VmlzdWFsaXphdGlvblBhdGg6IGZ1bmN0aW9uIChjb250ZXh0T2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCwgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IHN0cmluZyB7XG5cdFx0Y29uc3QgbWV0YVBhdGggPSBnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoKGNvbnRleHRPYmplY3RQYXRoKSBhcyBzdHJpbmc7XG5cdFx0aWYgKGNvbnRleHRPYmplY3RQYXRoLnRhcmdldE9iamVjdC50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5MaW5lSXRlbSkge1xuXHRcdFx0cmV0dXJuIG1ldGFQYXRoOyAvLyBNZXRhUGF0aCBpcyBhbHJlYWR5IHBvaW50aW5nIHRvIGEgTGluZUl0ZW1cblx0XHR9XG5cblx0XHRsZXQgdmlzdWFsaXphdGlvbnM6IFZpc3VhbGl6YXRpb25BbmRQYXRoW10gPSBbXTtcblx0XHRzd2l0Y2ggKGNvbnRleHRPYmplY3RQYXRoLnRhcmdldE9iamVjdC50ZXJtKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQ6XG5cdFx0XHRcdGlmIChjb250ZXh0T2JqZWN0UGF0aC50YXJnZXRPYmplY3QuUHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdFx0XHRcdHZpc3VhbGl6YXRpb25zID0gZ2V0VmlzdWFsaXphdGlvbnNGcm9tUHJlc2VudGF0aW9uVmFyaWFudChcblx0XHRcdFx0XHRcdGNvbnRleHRPYmplY3RQYXRoLnRhcmdldE9iamVjdC5QcmVzZW50YXRpb25WYXJpYW50LFxuXHRcdFx0XHRcdFx0bWV0YVBhdGgsXG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5QcmVzZW50YXRpb25WYXJpYW50OlxuXHRcdFx0XHR2aXN1YWxpemF0aW9ucyA9IGdldFZpc3VhbGl6YXRpb25zRnJvbVByZXNlbnRhdGlvblZhcmlhbnQoY29udGV4dE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LCBtZXRhUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRMb2cuZXJyb3IoYEJhZCBtZXRhcGF0aCBwYXJhbWV0ZXIgZm9yIHRhYmxlIDogJHtjb250ZXh0T2JqZWN0UGF0aC50YXJnZXRPYmplY3QudGVybX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBsaW5lSXRlbVZpeiA9IHZpc3VhbGl6YXRpb25zLmZpbmQoKHZpeikgPT4ge1xuXHRcdFx0cmV0dXJuIHZpei52aXN1YWxpemF0aW9uLnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLkxpbmVJdGVtO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGxpbmVJdGVtVml6KSB7XG5cdFx0XHRyZXR1cm4gbGluZUl0ZW1WaXouYW5ub3RhdGlvblBhdGg7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBtZXRhUGF0aDsgLy8gRmFsbGJhY2tcblx0XHR9XG5cdH0sXG5cblx0X2dldFByZXNlbnRhdGlvblBhdGg6IGZ1bmN0aW9uIChvQ29udGV4dE9iamVjdFBhdGg6IGFueSkge1xuXHRcdGxldCBwcmVzZW50YXRpb25QYXRoO1xuXHRcdHN3aXRjaCAob0NvbnRleHRPYmplY3RQYXRoLnRhcmdldE9iamVjdC50ZXJtKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQ6XG5cdFx0XHRcdHByZXNlbnRhdGlvblBhdGggPSBnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoKG9Db250ZXh0T2JqZWN0UGF0aCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50OlxuXHRcdFx0XHRwcmVzZW50YXRpb25QYXRoID0gZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aChvQ29udGV4dE9iamVjdFBhdGgpICsgXCIvUHJlc2VudGF0aW9uVmFyaWFudFwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHByZXNlbnRhdGlvblBhdGggPSBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJlc2VudGF0aW9uUGF0aDtcblx0fVxufSk7XG5leHBvcnQgZGVmYXVsdCBUYWJsZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7RUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNBLElBQU1BLEtBQUssR0FBR0MsYUFBYSxDQUFDQyxNQUFkLENBQXFCLDJCQUFyQixFQUFrRDtJQUMvRDtBQUNEO0FBQ0E7SUFDQ0MsSUFBSSxFQUFFLE9BSnlEOztJQUsvRDtBQUNEO0FBQ0E7SUFDQ0MsU0FBUyxFQUFFLHdCQVJvRDtJQVMvREMsZUFBZSxFQUFFLGVBVDhDOztJQVUvRDtBQUNEO0FBQ0E7SUFDQ0MsUUFBUSxFQUFFLDJCQWJxRDs7SUFjL0Q7QUFDRDtBQUNBO0lBQ0NDLFFBQVEsRUFBRTtNQUNUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUUsVUFKSDs7TUFLVDtBQUNGO0FBQ0E7TUFDRUMsVUFBVSxFQUFFO1FBQ1hDLGVBQWUsRUFBRTtVQUNoQkMsSUFBSSxFQUFFO1FBRFUsQ0FETjtRQUlYQyxRQUFRLEVBQUU7VUFDVEQsSUFBSSxFQUFFLHNCQURHO1VBRVRFLFFBQVEsRUFBRTtRQUZELENBSkM7UUFRWEMsV0FBVyxFQUFFO1VBQ1pILElBQUksRUFBRSxzQkFETTtVQUVaRSxRQUFRLEVBQUU7UUFGRSxDQVJGOztRQWFYO0FBQ0g7QUFDQTtRQUNHRSxVQUFVLEVBQUU7VUFDWEosSUFBSSxFQUFFLHNCQURLO1VBRVhLLFFBQVEsRUFBRSxJQUZDO1VBR1hDLEtBQUssRUFBRSxDQUFDLFdBQUQsRUFBYyxvQkFBZCxFQUFvQyxXQUFwQztRQUhJLENBaEJEOztRQXFCWDtBQUNIO0FBQ0E7UUFDR0MsZUFBZSxFQUFFO1VBQ2hCUCxJQUFJLEVBQUU7UUFEVSxDQXhCTjs7UUE0Qlg7QUFDSDtBQUNBO1FBQ0dRLEVBQUUsRUFBRTtVQUNIUixJQUFJLEVBQUUsUUFESDtVQUVIRSxRQUFRLEVBQUU7UUFGUCxDQS9CTztRQW1DWE8sTUFBTSxFQUFFO1VBQ1BULElBQUksRUFBRTtRQURDLENBbkNHOztRQXNDWDtBQUNIO0FBQ0E7UUFDR1UsY0FBYyxFQUFFO1VBQ2ZWLElBQUksRUFBRTtRQURTLENBekNMOztRQTRDWDtBQUNIO0FBQ0E7UUFDR1csUUFBUSxFQUFFO1VBQ1RYLElBQUksRUFBRSxTQURHO1VBRVRFLFFBQVEsRUFBRTtRQUZELENBL0NDO1FBbURYVSxTQUFTLEVBQUU7VUFDVlosSUFBSSxFQUFFLFFBREk7VUFFVmEsWUFBWSxFQUFFLEVBRko7VUFHVkMsYUFBYSxFQUFFLENBQUMsRUFBRCxFQUFLLFdBQUw7UUFITCxDQW5EQTs7UUF3RFg7QUFDSDtBQUNBO1FBQ0dDLCtCQUErQixFQUFFO1VBQ2hDZixJQUFJLEVBQUU7UUFEMEIsQ0EzRHRCOztRQThEWDtBQUNIO0FBQ0E7UUFDR2dCLHdCQUF3QixFQUFFO1VBQ3pCaEIsSUFBSSxFQUFFO1FBRG1CLENBakVmOztRQW9FWDtBQUNIO0FBQ0E7UUFDR2lCLHVCQUF1QixFQUFFO1VBQ3hCakIsSUFBSSxFQUFFO1FBRGtCLENBdkVkOztRQTBFWDtBQUNIO0FBQ0E7UUFDR2tCLFNBQVMsRUFBRTtVQUNWbEIsSUFBSSxFQUFFLFFBREk7VUFFVmEsWUFBWSxFQUFFTTtRQUZKLENBN0VBOztRQWlGWDtBQUNIO0FBQ0E7UUFDR0MsYUFBYSxFQUFFO1VBQ2RwQixJQUFJLEVBQUUsUUFEUTtVQUVkRSxRQUFRLEVBQUU7UUFGSSxDQXBGSjs7UUF5Rlg7QUFDSDtBQUNBO1FBQ0dtQixJQUFJLEVBQUU7VUFDTHJCLElBQUksRUFBRSxTQUREO1VBRUxFLFFBQVEsRUFBRTtRQUZMLENBNUZLOztRQWdHWDtBQUNIO0FBQ0E7UUFDR29CLGdCQUFnQixFQUFFO1VBQ2pCdEIsSUFBSSxFQUFFLFNBRFc7VUFFakJFLFFBQVEsRUFBRTtRQUZPLENBbkdQOztRQXVHWDtBQUNIO0FBQ0E7UUFDR3FCLE1BQU0sRUFBRTtVQUNQdkIsSUFBSSxFQUFFLFFBREM7VUFFUEUsUUFBUSxFQUFFO1FBRkgsQ0ExR0c7O1FBOEdYO0FBQ0g7QUFDQTtRQUNHc0IsYUFBYSxFQUFFO1VBQ2R4QixJQUFJLEVBQUUsU0FEUTtVQUVkRSxRQUFRLEVBQUU7UUFGSSxDQWpISjs7UUFxSFg7QUFDSDtBQUNBO1FBQ0d1QixXQUFXLEVBQUU7VUFDWnpCLElBQUksRUFBRSx3QkFETTtVQUVaYSxZQUFZLEVBQUUsTUFGRjtVQUdaWCxRQUFRLEVBQUU7UUFIRSxDQXhIRjs7UUE2SFg7QUFDSDtBQUNBO1FBQ0d3QixVQUFVLEVBQUU7VUFDWDFCLElBQUksRUFBRTtRQURLLENBaElEOztRQW1JWDtBQUNIO0FBQ0E7UUFDRzJCLFlBQVksRUFBRTtVQUNiM0IsSUFBSSxFQUFFO1FBRE8sQ0F0SUg7O1FBeUlYO0FBQ0g7QUFDQTtRQUNHNEIsV0FBVyxFQUFFO1VBQ1o1QixJQUFJLEVBQUU7UUFETSxDQTVJRjtRQStJWDZCLGNBQWMsRUFBRTtVQUNmN0IsSUFBSSxFQUFFO1FBRFMsQ0EvSUw7UUFrSlg4QixvQkFBb0IsRUFBRTtVQUNyQjlCLElBQUksRUFBRTtRQURlLENBbEpYO1FBcUpYK0IsZUFBZSxFQUFFO1VBQ2hCL0IsSUFBSSxFQUFFO1FBRFUsQ0FySk47O1FBd0pYO0FBQ0g7QUFDQTtRQUNHZ0MsZUFBZSxFQUFFO1VBQ2hCaEMsSUFBSSxFQUFFLGdCQURVO1VBRWhCRSxRQUFRLEVBQUU7UUFGTSxDQTNKTjtRQStKWCtCLFlBQVksRUFBRTtVQUNiakMsSUFBSSxFQUFFLFNBRE87VUFFYkUsUUFBUSxFQUFFO1FBRkcsQ0EvSkg7O1FBbUtYO0FBQ0g7QUFDQTtRQUNHRixJQUFJLEVBQUU7VUFDTEEsSUFBSSxFQUFFLFFBREQ7VUFFTEUsUUFBUSxFQUFFO1FBRkwsQ0F0S0s7UUEwS1hnQyxTQUFTLEVBQUU7VUFDVmxDLElBQUksRUFBRTtRQURJLENBMUtBOztRQTZLWDtBQUNIO0FBQ0E7UUFDR21DLFlBQVksRUFBRTtVQUNibkMsSUFBSSxFQUFFLFNBRE87VUFFYkUsUUFBUSxFQUFFO1FBRkcsQ0FoTEg7O1FBb0xYO0FBQ0g7QUFDQTtRQUNHa0MsV0FBVyxFQUFFO1VBQ1pwQyxJQUFJLEVBQUUsU0FETTtVQUVaRSxRQUFRLEVBQUU7UUFGRSxDQXZMRjs7UUEyTFg7QUFDSDtBQUNBO1FBQ0dtQyxjQUFjLEVBQUU7VUFDZnJDLElBQUksRUFBRTtRQURTLENBOUxMOztRQWlNWDtBQUNIO0FBQ0E7UUFDR3NDLGVBQWUsRUFBRTtVQUNoQnRDLElBQUksRUFBRTtRQURVLENBcE1OOztRQXVNWDtBQUNIO0FBQ0E7UUFDR3VDLFNBQVMsRUFBRTtVQUNWdkMsSUFBSSxFQUFFLFFBREk7VUFFVkUsUUFBUSxFQUFFO1FBRkEsQ0ExTUE7O1FBOE1YO0FBQ0g7QUFDQTtRQUNHc0MsV0FBVyxFQUFFO1VBQ1p4QyxJQUFJLEVBQUU7UUFETSxDQWpORjtRQW9OWHlDLGFBQWEsRUFBRTtVQUNkekMsSUFBSSxFQUFFO1FBRFEsQ0FwTko7UUF1TlgwQyxnQkFBZ0IsRUFBRTtVQUNqQjFDLElBQUksRUFBRTtRQURXLENBdk5QO1FBME5YMkMsT0FBTyxFQUFFO1VBQ1IzQyxJQUFJLEVBQUU7UUFERSxDQTFORTtRQTZOWDRDLEtBQUssRUFBRTtVQUNONUMsSUFBSSxFQUFFLFNBREE7VUFFTmEsWUFBWSxFQUFFO1FBRlIsQ0E3Tkk7UUFpT1hnQyxpQkFBaUIsRUFBRTtVQUNsQjdDLElBQUksRUFBRSxRQURZO1VBRWxCRSxRQUFRLEVBQUU7UUFGUSxDQWpPUjtRQXFPWDRDLGNBQWMsRUFBRTtVQUNmOUMsSUFBSSxFQUFFLFFBRFM7VUFFZitDLFFBQVEsRUFBRTtRQUZLLENBck9MO1FBeU9YQyxRQUFRLEVBQUU7VUFDVGhELElBQUksRUFBRSxRQURHO1VBRVRhLFlBQVksRUFBRTtRQUZMLENBek9DO1FBNk9Yb0MscUJBQXFCLEVBQUU7VUFDdEJqRCxJQUFJLEVBQUU7UUFEZ0IsQ0E3T1o7UUFnUFhrRCx3QkFBd0IsRUFBRTtVQUN6QmxELElBQUksRUFBRTtRQURtQixDQWhQZjtRQW1QWG1ELGFBQWEsRUFBRTtVQUNkbkQsSUFBSSxFQUFFO1FBRFE7TUFuUEosQ0FSSDtNQStQVG9ELE1BQU0sRUFBRTtRQUNQQyxZQUFZLEVBQUU7VUFDYnJELElBQUksRUFBRTtRQURPLENBRFA7UUFJUHNELGVBQWUsRUFBRTtVQUNoQnRELElBQUksRUFBRTtRQURVLENBSlY7O1FBT1A7QUFDSDtBQUNBO1FBQ0d1RCxRQUFRLEVBQUU7VUFDVHZELElBQUksRUFBRTtRQURHLENBVkg7O1FBYVA7QUFDSDtBQUNBO1FBQ0d3RCxRQUFRLEVBQUU7VUFDVHhELElBQUksRUFBRSxVQURHO1VBRVRFLFFBQVEsRUFBRTtRQUZELENBaEJIOztRQW9CUDtBQUNIO0FBQ0E7UUFDR3VELGVBQWUsRUFBRTtVQUNoQnpELElBQUksRUFBRTtRQURVLENBdkJWOztRQTBCUDtBQUNIO0FBQ0E7UUFDRzBELHdCQUF3QixFQUFFO1VBQ3pCMUQsSUFBSSxFQUFFO1FBRG1CLENBN0JuQjs7UUFnQ1A7QUFDSDtBQUNBO1FBQ0cyRCxXQUFXLEVBQUU7VUFDWjNELElBQUksRUFBRTtRQURNLENBbkNOOztRQXNDUDtBQUNIO0FBQ0E7UUFDRzRELGVBQWUsRUFBRTtVQUNoQjVELElBQUksRUFBRSxVQURVO1VBRWhCRSxRQUFRLEVBQUU7UUFGTTtNQXpDVixDQS9QQztNQTZTVDJELFlBQVksRUFBRTtRQUNiQyxPQUFPLEVBQUU7VUFDUjlELElBQUksRUFBRSxnRkFERTtVQUVSRSxRQUFRLEVBQUU7UUFGRixDQURJO1FBS2I2RCxPQUFPLEVBQUU7VUFDUi9ELElBQUksRUFBRSxxQ0FERTtVQUVSRSxRQUFRLEVBQUU7UUFGRjtNQUxJO0lBN1NMLENBakJxRDtJQXlVL0Q4RCxNQUFNLEVBQUUsVUFBVUMsTUFBVixFQUF1QkMscUJBQXZCLEVBQW1EQyxTQUFuRCxFQUFtRUMsYUFBbkUsRUFBdUY7TUFDOUYsSUFBSUMsZ0JBQUo7TUFDQSxJQUFNQyxrQkFBa0IsR0FBR0MsMkJBQTJCLENBQUNOLE1BQU0sQ0FBQ2hFLFFBQVIsRUFBa0JnRSxNQUFNLENBQUM5RCxXQUF6QixDQUF0RDs7TUFFQSxJQUFJLENBQUM4RCxNQUFNLENBQUNsRSxlQUFaLEVBQTZCO1FBQzVCLElBQU15RSx1QkFBdUIsR0FBRyxLQUFLQyxtQkFBTCxDQUF5Qkgsa0JBQXpCLEVBQTZDTCxNQUFNLENBQUM5RCxXQUFwRCxFQUFpRWdFLFNBQWpFLENBQWhDOztRQUNBLElBQU1PLGtCQUFrQixHQUFHLEtBQUtDLHFCQUFMLENBQTJCTCxrQkFBM0IsRUFBK0NFLHVCQUEvQyxDQUEzQjs7UUFDQSxJQUFNSSxpQkFBaUIsR0FBRyxLQUFLQyxvQkFBTCxDQUEwQlAsa0JBQTFCLENBQTFCLENBSDRCLENBSzVCOzs7UUFDQSxJQUFNUSxhQUFhLEdBQUcsS0FBS0MsYUFBTCxDQUFtQlgsYUFBYSxDQUFDTixPQUFqQyxDQUF0Qjs7UUFFQSxJQUFNa0IsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCYixhQUFhLENBQUNMLE9BQXBDLEVBQTZDLFVBQVVtQixXQUFWLEVBQTRCQyxjQUE1QixFQUFvRDtVQUFBOztVQUN0SCxJQUFNQyxTQUFTLEdBQUdGLFdBQVcsQ0FBQ0csWUFBWixDQUF5QixLQUF6QixLQUFtQyxxQkFBcUJGLGNBQTFFO1VBQ0FmLGFBQWEsQ0FBQ2dCLFNBQUQsQ0FBYixHQUEyQkYsV0FBM0I7VUFDQSxPQUFPO1lBQ047WUFDQUksR0FBRyxFQUFFRixTQUZDO1lBR05wRixJQUFJLEVBQUUsTUFIQTtZQUlOdUYsS0FBSyxFQUFFTCxXQUFXLENBQUNHLFlBQVosQ0FBeUIsT0FBekIsQ0FKRDtZQUtORyxVQUFVLEVBQUVOLFdBQVcsQ0FBQ0csWUFBWixDQUF5QixZQUF6QixDQUxOO1lBTU5JLGVBQWUsRUFBRVAsV0FBVyxDQUFDRyxZQUFaLENBQXlCLGlCQUF6QixDQU5YO1lBT05LLFlBQVksRUFBRVIsV0FBVyxDQUFDRyxZQUFaLENBQXlCLGNBQXpCLENBUFI7WUFRTjlELE1BQU0sRUFBRTJELFdBQVcsQ0FBQ0csWUFBWixDQUF5QixRQUF6QixDQVJGO1lBU05NLFFBQVEsRUFBRSwwQkFBQVQsV0FBVyxDQUFDVSxRQUFaLENBQXFCLENBQXJCLGlGQUF5QkMsU0FBekIsS0FBc0MsRUFUMUM7WUFVTi9GLFVBQVUsRUFBRW9GLFdBQVcsQ0FBQ0csWUFBWixDQUF5QixZQUF6QixJQUF5Q0gsV0FBVyxDQUFDRyxZQUFaLENBQXlCLFlBQXpCLEVBQXVDUyxLQUF2QyxDQUE2QyxHQUE3QyxDQUF6QyxHQUE2RjNFLFNBVm5HO1lBV040RSxRQUFRLEVBQUU7Y0FDVEMsU0FBUyxFQUFFZCxXQUFXLENBQUNHLFlBQVosQ0FBeUIsbUJBQXpCLENBREY7Y0FFVFksTUFBTSxFQUFFZixXQUFXLENBQUNHLFlBQVosQ0FBeUIsZ0JBQXpCO1lBRkM7VUFYSixDQUFQO1FBZ0JBLENBbkJxQixDQUF0QjtRQW9CQSxJQUFNYSxZQUFpQixHQUFHLEVBQTFCO1FBQ0EsSUFBSUMsY0FBYyxHQUFHO1VBQ3BCaEUsWUFBWSxFQUFFOEIsTUFBTSxDQUFDOUIsWUFERDtVQUVwQmIsZ0JBQWdCLEVBQUUyQyxNQUFNLENBQUMzQyxnQkFGTDtVQUdwQmMsV0FBVyxFQUFFNkIsTUFBTSxDQUFDN0IsV0FIQTtVQUlwQmhCLGFBQWEsRUFBRTZDLE1BQU0sQ0FBQzdDLGFBSkY7VUFLcEJwQixJQUFJLEVBQUVpRSxNQUFNLENBQUNqRTtRQUxPLENBQXJCLENBN0I0QixDQW9DNUI7O1FBQ0FtRyxjQUFjLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLFNBQUwsQ0FBZUgsY0FBZixDQUFYLENBQWpCO1FBRUFELFlBQVksQ0FBQ3hCLGtCQUFELENBQVosR0FBbUM7VUFDbENaLE9BQU8sRUFBRWdCLGFBRHlCO1VBRWxDZixPQUFPLEVBQUVpQixhQUZ5QjtVQUdsQ3VCLGFBQWEsRUFBRUo7UUFIbUIsQ0FBbkM7UUFLQSxJQUFNSyxpQkFBaUIsR0FBRyxLQUFLL0IsbUJBQUwsQ0FBeUJILGtCQUF6QixFQUE2Q0wsTUFBTSxDQUFDOUQsV0FBcEQsRUFBaUVnRSxTQUFqRSxFQUE0RStCLFlBQTVFLENBQTFCO1FBRUEsSUFBTU8sd0JBQXdCLEdBQUdDLGlDQUFpQyxDQUNqRWhDLGtCQURpRSxFQUVqRVQsTUFBTSxDQUFDMEMsa0JBRjBELEVBR2pFSCxpQkFIaUUsRUFJakVyRixTQUppRSxFQUtqRUEsU0FMaUUsRUFNakV5RCxpQkFOaUUsQ0FBbEU7UUFRQVAsZ0JBQWdCLEdBQUdvQyx3QkFBd0IsQ0FBQ0csY0FBekIsQ0FBd0MsQ0FBeEMsQ0FBbkI7UUFFQTNDLE1BQU0sQ0FBQ2xFLGVBQVAsR0FBeUIsS0FBSzhHLG9CQUFMLENBQTBCeEMsZ0JBQTFCLEVBQTRDRixTQUE1QyxDQUF6QjtNQUNBLENBekRELE1BeURPO1FBQ05FLGdCQUFnQixHQUFHSixNQUFNLENBQUNsRSxlQUFQLENBQXVCK0csU0FBdkIsRUFBbkI7TUFDQTs7TUFDRHpDLGdCQUFnQixDQUFDMEMsSUFBakIsR0FBd0IsaUJBQWlCOUMsTUFBTSxDQUFDbEUsZUFBUCxDQUF1QmlILE9BQXZCLEVBQWpCLEdBQW9ELEdBQTVFLENBaEU4RixDQWlFOUY7O01BQ0EsS0FBS0MsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLGVBQTdCLEVBQThDSSxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCOUYsYUFBMUUsRUFBeUYsSUFBekY7TUFDQSxLQUFLNkYsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLGtCQUE3QixFQUFpREksZ0JBQWdCLENBQUM4QyxPQUFqQixDQUF5QjdGLGdCQUExRSxFQUE0RixJQUE1RjtNQUNBLEtBQUsyRixlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsY0FBN0IsRUFBNkNJLGdCQUFnQixDQUFDOEMsT0FBakIsQ0FBeUJoRixZQUF0RSxFQUFvRixJQUFwRjtNQUNBLEtBQUs4RSxlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsYUFBN0IsRUFBNENJLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJFLGVBQTVCLENBQTRDdEQsT0FBNUMsQ0FBb0R1RCxLQUFwRCxDQUEwREMsT0FBdEcsRUFBK0csSUFBL0c7TUFDQSxLQUFLTCxlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsdUJBQTdCLEVBQXNESSxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCRSxlQUE1QixDQUE0Q0cscUJBQWxHLEVBQXlILElBQXpIO01BQ0EsS0FBS04sZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLE1BQTdCLEVBQXFDSSxnQkFBZ0IsQ0FBQzhDLE9BQWpCLENBQXlCbkgsSUFBOUQsRUFBb0UsSUFBcEU7TUFFQSxLQUFLaUgsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLHlCQUE3QixFQUF3REksZ0JBQWdCLENBQUM4QyxPQUFqQixDQUF5QmxHLHVCQUFqRjtNQUNBLEtBQUtnRyxlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsaUNBQTdCLEVBQWdFSSxnQkFBZ0IsQ0FBQzhDLE9BQWpCLENBQXlCcEcsK0JBQXpGO01BQ0EsS0FBS2tHLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QiwwQkFBN0IsRUFBeURJLGdCQUFnQixDQUFDOEMsT0FBakIsQ0FBeUJuRyx3QkFBbEY7TUFDQSxLQUFLaUcsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLGVBQTdCLEVBQThDSSxnQkFBZ0IsQ0FBQzhDLE9BQWpCLENBQXlCM0YsYUFBdkU7TUFDQSxLQUFLeUYsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLFlBQTdCLEVBQTJDSSxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCTSxVQUF2RTtNQUNBLEtBQUtQLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixjQUE3QixFQUE2Q0ksZ0JBQWdCLENBQUM4QyxPQUFqQixDQUF5Qk0sWUFBdEU7TUFDQSxLQUFLUixlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsd0JBQTdCLEVBQXVESSxnQkFBZ0IsQ0FBQzhDLE9BQWpCLENBQXlCTyxzQkFBaEY7TUFDQSxLQUFLVCxlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsUUFBN0IsRUFBdUNJLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJTLEtBQW5FO01BQ0EsS0FBS1YsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLGdCQUE3QixFQUErQ0ksZ0JBQWdCLENBQUM4QyxPQUFqQixDQUF5QjlFLGNBQXhFO01BQ0EsS0FBSzRFLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixlQUE3QixFQUE4Q0ksZ0JBQWdCLENBQUM4QyxPQUFqQixDQUF5QmhFLGFBQXZFOztNQUNBLElBQUljLE1BQU0sQ0FBQ3pELEVBQVgsRUFBZTtRQUNkO1FBQ0F5RCxNQUFNLENBQUN4RCxNQUFQLEdBQWdCd0QsTUFBTSxDQUFDekQsRUFBdkI7UUFDQXlELE1BQU0sQ0FBQ3pELEVBQVAsR0FBWSxLQUFLb0gsWUFBTCxDQUFrQjNELE1BQU0sQ0FBQ3pELEVBQXpCLENBQVo7TUFDQSxDQUpELE1BSU87UUFDTjtRQUNBO1FBQ0EsS0FBS3lHLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixJQUE3QixFQUFtQ0ksZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QjFHLEVBQS9EO1FBQ0F5RCxNQUFNLENBQUN4RCxNQUFQLEdBQWdCNEQsZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QjFHLEVBQTVCLEdBQWlDLFNBQWpEO01BQ0E7O01BRUQsS0FBS3lHLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixjQUE3QixFQUE2Q0ksZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QmxELE1BQTVCLENBQW1DNkQsSUFBaEY7TUFDQSxLQUFLWixlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsYUFBN0IsRUFBNENJLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJsRCxNQUE1QixDQUFtQzhELE1BQS9FO01BQ0EsS0FBS2IsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLGdCQUE3QixFQUErQ0ksZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QmxELE1BQTVCLENBQW1DK0QsUUFBbEY7TUFDQSxLQUFLZCxlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsaUJBQTdCLEVBQWdESSxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCbEQsTUFBNUIsQ0FBbUNnRSxTQUFuRjtNQUNBLEtBQUtmLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixzQkFBN0IsRUFBcURJLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJsRCxNQUE1QixDQUFtQ2lFLGNBQXhGO01BQ0EsS0FBS2hCLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixpQkFBN0IsRUFBZ0RJLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJnQixRQUE1RTtNQUNBLEtBQUtqQixlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsbUJBQTdCLEVBQWtESSxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCckUsaUJBQTlFO01BQ0EsS0FBS29FLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2Qix1QkFBN0IsRUFBc0RJLGdCQUFnQixDQUFDOEMsT0FBakIsQ0FBeUJsRSxxQkFBL0U7TUFDQSxLQUFLZ0UsZUFBTCxDQUFxQmhELE1BQXJCLEVBQTZCLDBCQUE3QixFQUF5REksZ0JBQWdCLENBQUM4QyxPQUFqQixDQUF5QmpFLHdCQUFsRixFQXRHOEYsQ0F1RzlGO01BQ0E7TUFDQTtNQUNBOztNQUVBLFFBQVFlLE1BQU0sQ0FBQ3RELFFBQWY7UUFDQyxLQUFLLE9BQUw7VUFDQ3NELE1BQU0sQ0FBQ3RELFFBQVAsR0FBa0IsS0FBbEI7VUFDQTs7UUFDRCxLQUFLLE1BQUw7VUFDQ3NELE1BQU0sQ0FBQ3RELFFBQVAsR0FBa0IsSUFBbEI7VUFDQTs7UUFDRDtNQVBEOztNQVVBLElBQUlzRCxNQUFNLENBQUN0RCxRQUFQLEtBQW9CUSxTQUFwQixJQUFpQ2tELGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJpQixXQUE1QixLQUE0QyxJQUFqRixFQUF1RjtRQUN0RmxFLE1BQU0sQ0FBQ3RELFFBQVAsR0FBa0IsSUFBbEI7TUFDQTs7TUFFRCxJQUFJc0QsTUFBTSxDQUFDVCxRQUFYLEVBQXFCO1FBQ3BCUyxNQUFNLENBQUMvQyxTQUFQLEdBQW1CLFlBQW5CO01BQ0E7O01BQ0QsS0FBSytGLGVBQUwsQ0FBcUJoRCxNQUFyQixFQUE2QixVQUE3QixFQUF5Q0ksZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QmtCLEdBQTVCLENBQWdDQyxLQUF6RTtNQUNBLEtBQUtwQixlQUFMLENBQXFCaEQsTUFBckIsRUFBNkIsV0FBN0IsRUFBMENJLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEJrQixHQUE1QixDQUFnQ0UsTUFBMUU7O01BRUEsSUFBSXJFLE1BQU0sQ0FBQ2pDLGVBQVAsS0FBMkIsT0FBL0IsRUFBd0M7UUFDdkNpQyxNQUFNLENBQUNqQyxlQUFQLEdBQXlCYixTQUF6QjtNQUNBLENBRkQsTUFFTyxJQUFJOEMsTUFBTSxDQUFDakMsZUFBUCxLQUEyQixNQUEvQixFQUF1QztRQUM3Q2lDLE1BQU0sQ0FBQ2pDLGVBQVAsR0FBeUIsb0JBQXpCO01BQ0E7O01BRUQsUUFBUWlDLE1BQU0sQ0FBQ2pDLGVBQWY7UUFDQyxLQUFLLE9BQUw7VUFDQ2lDLE1BQU0sQ0FBQ2pDLGVBQVAsR0FBeUJiLFNBQXpCO1VBQ0E7O1FBQ0QsS0FBSyxNQUFMO1VBQ0M4QyxNQUFNLENBQUNqQyxlQUFQLEdBQXlCLG9CQUF6QjtVQUNBOztRQUNEO01BUEQ7O01BVUEsSUFBSWlDLE1BQU0sQ0FBQ2hDLFlBQVAsS0FBd0IsT0FBNUIsRUFBcUM7UUFDcENnQyxNQUFNLENBQUN1RCxVQUFQLEdBQW9CLEtBQXBCO01BQ0EsQ0FGRCxNQUVPO1FBQ052RCxNQUFNLENBQUN1RCxVQUFQLEdBQW9CbkQsZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0Qk0sVUFBaEQ7TUFDQTs7TUFFRCxJQUFJZSxjQUFjLEdBQUcsS0FBckIsQ0F0SjhGLENBd0o5RjtNQUNBO01BQ0E7TUFDQTs7TUFDQSxJQUFJLENBQUN0RSxNQUFNLENBQUMxQixTQUFSLElBQXFCLENBQUMwQixNQUFNLENBQUN6QixXQUE3QixJQUE0Q3lCLE1BQU0sQ0FBQ3VELFVBQXZELEVBQW1FO1FBQ2xFO1FBQ0E7UUFDQXZELE1BQU0sQ0FBQ3pCLFdBQVAsR0FBcUJnRyxRQUFRLENBQUMsQ0FBQ3ZFLE1BQU0sQ0FBQ3pELEVBQVIsRUFBWSxnQkFBWixFQUE4QixhQUE5QixDQUFELENBQTdCO1FBQ0ErSCxjQUFjLEdBQUcsSUFBakI7TUFDQSxDQWpLNkYsQ0FrSzlGOzs7TUFDQXRFLE1BQU0sQ0FBQ3NFLGNBQVAsR0FBd0JBLGNBQXhCO01BQ0F0RSxNQUFNLENBQUMvQixTQUFQLEdBQW1CK0IsTUFBTSxDQUFDakUsSUFBMUI7TUFDQWlFLE1BQU0sQ0FBQ3dFLFVBQVAsR0FBb0JwRSxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCRSxlQUE1QixDQUE0Q3RELE9BQTVDLENBQW9ERSxNQUFwRCxDQUEyRHJCLE9BQTNELElBQXNFLElBQTFGO01BQ0FzQixNQUFNLENBQUN5RSxjQUFQLEdBQXdCckUsZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QndCLGNBQXBELENBdEs4RixDQXdLOUY7O01BQ0F6RSxNQUFNLENBQUN2RCxjQUFQLEdBQXdCMkQsZ0JBQWdCLENBQUM2QyxVQUFqQixDQUE0QnhHLGNBQXBELENBeks4RixDQXlLMUI7O01BQ3BFLElBQUkyRCxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCOUcsVUFBNUIsQ0FBdUN1SSxVQUF2QyxDQUFrRCxHQUFsRCxLQUEwRHJFLGtCQUFrQixDQUFDc0UsaUJBQW5CLENBQXFDQyxLQUFyQyxLQUErQyxXQUE3RyxFQUEwSDtRQUN6SHhFLGdCQUFnQixDQUFDNkMsVUFBakIsQ0FBNEI5RyxVQUE1QixHQUF5QzZELE1BQU0sQ0FBQ3ZELGNBQWhEO01BQ0E7O01BQ0R1RCxNQUFNLENBQUMxRCxlQUFQLEdBQXlCNEQsU0FBUyxDQUFDMkUsTUFBVixDQUFpQkMsU0FBakIsQ0FBMkJsQyxvQkFBM0IsQ0FDeEIsT0FDRXZDLGtCQUFrQixDQUFDMEUsZUFBbkIsQ0FBb0NDLGVBQXBDLEdBQ0UzRSxrQkFBa0IsQ0FBQzBFLGVBQW5CLENBQW9DQyxlQUFwQyxDQUFvRHpKLElBRHRELEdBRUU4RSxrQkFBa0IsQ0FBQ3NFLGlCQUFuQixDQUFxQ3BKLElBSHpDLENBRHdCLENBQXpCO01BTUF5RSxNQUFNLENBQUM3RCxVQUFQLEdBQW9CK0QsU0FBUyxDQUFDMkUsTUFBVixDQUFpQkMsU0FBakIsQ0FBMkJsQyxvQkFBM0IsQ0FBZ0R4QyxnQkFBZ0IsQ0FBQzZDLFVBQWpCLENBQTRCOUcsVUFBNUUsQ0FBcEI7O01BRUEsUUFBUTZELE1BQU0sQ0FBQ3RELFFBQWY7UUFDQyxLQUFLLElBQUw7VUFDQ3NELE1BQU0sQ0FBQ25CLGNBQVAsR0FBd0IsU0FBeEI7VUFDQTs7UUFDRCxLQUFLLEtBQUw7VUFDQ21CLE1BQU0sQ0FBQ25CLGNBQVAsR0FBd0IsVUFBeEI7VUFDQTs7UUFDRDtVQUNDbUIsTUFBTSxDQUFDbkIsY0FBUCxHQUF3QjNCLFNBQXhCO01BUkYsQ0FyTDhGLENBK0w5RjtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBOzs7TUFFQThDLE1BQU0sQ0FBQ2lGLHVCQUFQLEdBQWlDQywrQkFBK0IsQ0FBQ2xGLE1BQUQsQ0FBaEU7TUFDQSxPQUFPQSxNQUFQO0lBQ0EsQ0FuaEI4RDs7SUFvaEIvRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDQ2MsYUFBYSxFQUFFLFVBQVVxRSxRQUFWLEVBQXlCO01BQ3ZDLElBQU10RSxhQUFrQixHQUFHLEVBQTNCOztNQUNBLElBQUlzRSxRQUFRLElBQUlBLFFBQVEsQ0FBQ3hELFFBQVQsQ0FBa0J5RCxNQUFsQixHQUEyQixDQUEzQyxFQUE4QztRQUM3QyxJQUFNdkYsT0FBTyxHQUFHd0YsS0FBSyxDQUFDQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsS0FBdEIsQ0FBNEJMLFFBQVEsQ0FBQ3hELFFBQXJDLENBQWhCO1FBQ0EsSUFBSThELFNBQVMsR0FBRyxDQUFoQjtRQUNBNUYsT0FBTyxDQUFDNkYsT0FBUixDQUFnQixVQUFVQyxHQUFWLEVBQWU7VUFDOUJGLFNBQVM7VUFDVCxJQUFJRyxXQUFrQixHQUFHLEVBQXpCOztVQUNBLElBQUlELEdBQUcsQ0FBQ2hFLFFBQUosQ0FBYXlELE1BQWIsSUFBdUJPLEdBQUcsQ0FBQ0UsU0FBSixLQUFrQixhQUF6QyxJQUEwREYsR0FBRyxDQUFDRyxZQUFKLEtBQXFCLGVBQW5GLEVBQW9HO1lBQ25HLElBQU1DLFlBQVksR0FBR1YsS0FBSyxDQUFDQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsS0FBdEIsQ0FBNEJHLEdBQUcsQ0FBQ2hFLFFBQWhDLENBQXJCO1lBQ0FvRSxZQUFZLENBQUNMLE9BQWIsQ0FBcUIsVUFBVU0sUUFBVixFQUFvQjtjQUN4QyxJQUFNQyxZQUFZLEdBQUdELFFBQVEsQ0FBQzVFLFlBQVQsQ0FBc0IsS0FBdEIsS0FBZ0MscUJBQXFCcUUsU0FBMUU7Y0FDQSxJQUFNUyxZQUFZLEdBQUc7Z0JBQ3BCN0UsR0FBRyxFQUFFNEUsWUFEZTtnQkFFcEJFLElBQUksRUFBRUgsUUFBUSxDQUFDNUUsWUFBVCxDQUFzQixNQUF0QixDQUZjO2dCQUdwQmdGLFFBQVEsRUFBRSxJQUhVO2dCQUlwQmhDLEtBQUssRUFBRTRCLFFBQVEsQ0FBQzVFLFlBQVQsQ0FBc0IsT0FBdEIsQ0FKYTtnQkFLcEJpRixpQkFBaUIsRUFBRUwsUUFBUSxDQUFDNUUsWUFBVCxDQUFzQixtQkFBdEIsTUFBK0MsTUFMOUM7Z0JBTXBCaUMsT0FBTyxFQUFFMkMsUUFBUSxDQUFDNUUsWUFBVCxDQUFzQixTQUF0QixNQUFxQyxJQUFyQyxHQUE0QyxJQUE1QyxHQUFtRDRFLFFBQVEsQ0FBQzVFLFlBQVQsQ0FBc0IsU0FBdEI7Y0FOeEMsQ0FBckI7Y0FRQVAsYUFBYSxDQUFDcUYsWUFBWSxDQUFDN0UsR0FBZCxDQUFiLEdBQWtDNkUsWUFBbEM7Y0FDQVQsU0FBUztZQUNULENBWkQ7WUFhQUcsV0FBVyxHQUFHVSxNQUFNLENBQUNDLE1BQVAsQ0FBYzFGLGFBQWQsRUFDWjBFLEtBRFksQ0FDTixDQUFDSSxHQUFHLENBQUNoRSxRQUFKLENBQWF5RCxNQURSLEVBRVpvQixHQUZZLENBRVIsVUFBVUMsUUFBVixFQUF5QjtjQUM3QixPQUFPQSxRQUFRLENBQUNwRixHQUFoQjtZQUNBLENBSlksQ0FBZDtVQUtBOztVQUNELElBQU1xRixTQUFTLEdBQUdmLEdBQUcsQ0FBQ3ZFLFlBQUosQ0FBaUIsS0FBakIsS0FBMkIscUJBQXFCcUUsU0FBbEU7VUFDQSxJQUFNa0IsU0FBUyxHQUFHO1lBQ2pCdEYsR0FBRyxFQUFFcUYsU0FEWTtZQUVqQlAsSUFBSSxFQUFFUixHQUFHLENBQUN2RSxZQUFKLENBQWlCLE1BQWpCLENBRlc7WUFHakJVLFFBQVEsRUFBRTtjQUNUQyxTQUFTLEVBQUU0RCxHQUFHLENBQUN2RSxZQUFKLENBQWlCLFdBQWpCLENBREY7Y0FFVFksTUFBTSxFQUFFMkQsR0FBRyxDQUFDdkUsWUFBSixDQUFpQixRQUFqQjtZQUZDLENBSE87WUFPakJnRixRQUFRLEVBQUUsSUFQTztZQVFqQmhDLEtBQUssRUFBRXVCLEdBQUcsQ0FBQ3ZFLFlBQUosQ0FBaUIsT0FBakIsQ0FSVTtZQVNqQmlGLGlCQUFpQixFQUFFVixHQUFHLENBQUN2RSxZQUFKLENBQWlCLG1CQUFqQixNQUEwQyxNQVQ1QztZQVVqQmlDLE9BQU8sRUFBRXNDLEdBQUcsQ0FBQ3ZFLFlBQUosQ0FBaUIsU0FBakIsTUFBZ0MsSUFBaEMsR0FBdUMsSUFBdkMsR0FBOEN1RSxHQUFHLENBQUN2RSxZQUFKLENBQWlCLFNBQWpCLENBVnRDO1lBV2pCd0YsSUFBSSxFQUFFaEIsV0FBVyxDQUFDUixNQUFaLEdBQXFCUSxXQUFyQixHQUFtQztVQVh4QixDQUFsQjtVQWFBL0UsYUFBYSxDQUFDOEYsU0FBUyxDQUFDdEYsR0FBWCxDQUFiLEdBQStCc0YsU0FBL0I7UUFDQSxDQXZDRDtNQXdDQTs7TUFDRCxPQUFPOUYsYUFBUDtJQUNBLENBemtCOEQ7O0lBMmtCL0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDQ0gscUJBQXFCLEVBQUUsVUFBVW1HLGlCQUFWLEVBQWtEQyxnQkFBbEQsRUFBOEY7TUFDcEgsSUFBTTlLLFFBQVEsR0FBRytLLGtDQUFrQyxDQUFDRixpQkFBRCxDQUFuRDs7TUFDQSxJQUFJQSxpQkFBaUIsQ0FBQ0csWUFBbEIsQ0FBK0JDLElBQS9CLDBDQUFKLEVBQXdFO1FBQ3ZFLE9BQU9qTCxRQUFQLENBRHVFLENBQ3REO01BQ2pCOztNQUVELElBQUkyRyxjQUFzQyxHQUFHLEVBQTdDOztNQUNBLFFBQVFrRSxpQkFBaUIsQ0FBQ0csWUFBbEIsQ0FBK0JDLElBQXZDO1FBQ0M7VUFDQyxJQUFJSixpQkFBaUIsQ0FBQ0csWUFBbEIsQ0FBK0JFLG1CQUFuQyxFQUF3RDtZQUN2RHZFLGNBQWMsR0FBR3dFLHdDQUF3QyxDQUN4RE4saUJBQWlCLENBQUNHLFlBQWxCLENBQStCRSxtQkFEeUIsRUFFeERsTCxRQUZ3RCxFQUd4RDhLLGdCQUh3RCxDQUF6RDtVQUtBOztVQUNEOztRQUVEO1VBQ0NuRSxjQUFjLEdBQUd3RSx3Q0FBd0MsQ0FBQ04saUJBQWlCLENBQUNHLFlBQW5CLEVBQWlDaEwsUUFBakMsRUFBMkM4SyxnQkFBM0MsQ0FBekQ7VUFDQTs7UUFFRDtVQUNDTSxHQUFHLENBQUNDLEtBQUosOENBQWdEUixpQkFBaUIsQ0FBQ0csWUFBbEIsQ0FBK0JDLElBQS9FO01BaEJGOztNQW1CQSxJQUFNSyxXQUFXLEdBQUczRSxjQUFjLENBQUM0RSxJQUFmLENBQW9CLFVBQUNDLEdBQUQsRUFBUztRQUNoRCxPQUFPQSxHQUFHLENBQUNDLGFBQUosQ0FBa0JSLElBQWxCLDBDQUFQO01BQ0EsQ0FGbUIsQ0FBcEI7O01BSUEsSUFBSUssV0FBSixFQUFpQjtRQUNoQixPQUFPQSxXQUFXLENBQUNJLGNBQW5CO01BQ0EsQ0FGRCxNQUVPO1FBQ04sT0FBTzFMLFFBQVAsQ0FETSxDQUNXO01BQ2pCO0lBQ0QsQ0FybkI4RDtJQXVuQi9ENEUsb0JBQW9CLEVBQUUsVUFBVVAsa0JBQVYsRUFBbUM7TUFDeEQsSUFBSXNILGdCQUFKOztNQUNBLFFBQVF0SCxrQkFBa0IsQ0FBQzJHLFlBQW5CLENBQWdDQyxJQUF4QztRQUNDO1VBQ0NVLGdCQUFnQixHQUFHWixrQ0FBa0MsQ0FBQzFHLGtCQUFELENBQXJEO1VBQ0E7O1FBQ0Q7VUFDQ3NILGdCQUFnQixHQUFHWixrQ0FBa0MsQ0FBQzFHLGtCQUFELENBQWxDLEdBQXlELHNCQUE1RTtVQUNBOztRQUNEO1VBQ0NzSCxnQkFBZ0IsR0FBRyxJQUFuQjtNQVJGOztNQVVBLE9BQU9BLGdCQUFQO0lBQ0E7RUFwb0I4RCxDQUFsRCxDQUFkO1NBc29CZXZNLEsifQ==