/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/converters/controls/Common/DataVisualization", "sap/fe/core/converters/controls/ListReport/FilterBar", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/TemplateModel", "sap/fe/core/templating/FilterHelper", "sap/fe/macros/MacroMetadata", "sap/fe/macros/ResourceModel"], function (Log, CommonUtils, DataVisualization, FilterBar, MetaModelConverter, ModelHelper, TemplateModel, FilterHelper, MacroMetadata, ResourceModel) {
  "use strict";

  var getFilterConditions = FilterHelper.getFilterConditions;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var getSelectionFields = FilterBar.getSelectionFields;
  var getSelectionVariant = DataVisualization.getSelectionVariant;

  var FilterBarMetadata = MacroMetadata.extend("sap.fe.macros.FilterBar", {
    /**
     * Name of the building block control.
     */
    name: "FilterBar",

    /**
     * Name of the building block control.
     */
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",

    /**
     * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
     */
    fragment: "sap.fe.macros.filterBar.FilterBar",

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
      designtime: "sap/fe/macros/filterBar/FilterBar.designtime",

      /**
       * Properties.
       */
      properties: {
        /**
         * selectionFields to be displayed
         */
        selectionFields: {
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
         * ID of the FilterBar
         */
        id: {
          type: "string",
          isPublic: true
        },
        visible: {
          type: "boolean",
          isPublic: true
        },

        /**
         * Displays possible errors during the search in a message box
         */
        showMessages: {
          type: "boolean",
          defaultValue: false,
          isPublic: true
        },

        /**
         * If specificed as true the ID is applied to the inner content of the building block
         * This is only a private property to be used by sap.fe (Fiori Elements)
         */
        _applyIdToContent: {
          type: "boolean",
          defaultValue: false
        },

        /**
         * ID of the assigned variant management
         */
        variantBackreference: {
          type: "string"
        },

        /**
         * Don't show the basic search field
         */
        hideBasicSearch: {
          type: "boolean"
        },

        /**
         * Enables the fallback to show all fields of the EntityType as filter fields if com.sap.vocabularies.UI.v1.SelectionFields are not present
         */
        enableFallback: {
          type: "boolean",
          defaultValue: false
        },

        /**
         * Handles visibility of the 'Adapt Filters' button on the FilterBar
         */
        showAdaptFiltersButton: {
          type: "boolean",
          defaultValue: true
        },

        /**
         * Specifies the personalization options for the filter bar.
         */
        p13nMode: {
          type: "sap.ui.mdc.FilterBarP13nMode[]",
          defaultValue: "Item,Value"
        },
        propertyInfo: {
          type: "string"
        },

        /**
         * Specifies the Sematic Date Range option for the filter bar.
         */
        useSemanticDateRange: {
          type: "boolean",
          defaultValue: true
        },

        /**
         * If set the search will be automatically triggered, when a filter value was changed.
         */
        liveMode: {
          type: "boolean",
          defaultValue: false,
          isPublic: true
        },

        /**
         * Temporary workaround only
         * path to valuelist
         */
        _valueList: {
          type: "sap.ui.model.Context",
          required: false
        },

        /**
         * Temporary workaround only
         * path to contextPath to be used by child filterfields
         */
        _internalContextPath: {
          type: "sap.ui.model.Context",
          required: false
        },

        /**
         * Filter conditions to be applied to the filter bar
         */
        filterConditions: {
          type: "string",
          required: false
        },

        /**
         * If set to <code>true</code>, all search requests are ignored. Once it has been set to <code>false</code>,
         * a search is triggered immediately if one or more search requests have been triggered in the meantime
         * but were ignored based on the setting.
         */
        suspendSelection: {
          type: "boolean",
          defaultValue: false
        },
        showDraftEditState: {
          type: "boolean",
          defaultValue: false
        },
        isDraftCollaborative: {
          type: "boolean",
          defaultValue: false
        },

        /**
         * Id of control that will allow for switching between normal and visual filter
         */
        toggleControlId: {
          type: "string"
        },
        initialLayout: {
          type: "string",
          defaultValue: "compact"
        }
      },
      events: {
        /**
         * Event handler to react to the search event of the FilterBar
         */
        search: {
          type: "function",
          isPublic: true
        },

        /**
         * Event handler to react to the filterChange event of the FilterBar
         */
        filterChanged: {
          type: "function",
          isPublic: true
        },

        /**
         * Event handler to react to the stateChange event of the FilterBar.
         */
        stateChange: {
          type: "function"
        },

        /**
         * Event handler to react to the filterChanged event of the FilterBar. Exposes parameters from the MDC filter bar
         */
        internalFilterChanged: {
          type: "function"
        },

        /**
         * Event handler to react to the search event of the FilterBar. Exposes parameteres from the MDC filter bar
         */
        internalSearch: {
          type: "function"
        }
      },
      aggregations: {
        filterFields: {
          type: "sap.fe.macros.FilterField",
          isPublic: true
        }
      }
    },
    _processPropertyInfos: function (oProps) {
      var aParameterFields = [];

      if (oProps.propertyInfo) {
        var sFetchedProperties = oProps.propertyInfo.replace(/\\{/g, "{").replace(/\\}/g, "}");
        var aFetchedProperties = JSON.parse(sFetchedProperties);
        aFetchedProperties.forEach(function (propInfo) {
          if (propInfo.isParameter) {
            aParameterFields.push(propInfo.name);
          }

          if (propInfo.path === "$editState") {
            propInfo.label = ResourceModel.getText("FILTERBAR_EDITING_STATUS");
          }
        });
        oProps.propertyInfo = JSON.stringify(aFetchedProperties).replace(/\{/g, "\\{").replace(/\}/g, "\\}");
      }

      oProps.parameters = JSON.stringify(aParameterFields);
    },
    create: function (oProps, oControlConfiguration, mSettings, oAggregations) {
      var oContext = oProps.contextPath;

      if (!oContext) {
        Log.error("Context Path not available for FilterBar Macro.");
        return;
      }

      var oMetaPathContext = oProps.metaPath;
      var sMetaPath = oMetaPathContext && oMetaPathContext.getPath();
      var metaPathParts = sMetaPath.split("/@com.sap.vocabularies.UI.v1.SelectionFields"); // [0]: entityTypePath, [1]: SF Qualifier.

      var entityTypePath = metaPathParts[0].endsWith("/") ? metaPathParts[0] : metaPathParts[0] + "/";
      var annotationPath = "@com.sap.vocabularies.UI.v1.SelectionFields" + (metaPathParts[1] || "");
      var sEntitySetPath = ModelHelper.getEntitySetPath(entityTypePath);
      var oMetaModel = oContext.getModel();
      var oExtraFilters = this.parseAggregation(oAggregations.filterFields, function (childFilterField) {
        var filterFieldKey = childFilterField.getAttribute("key");
        oAggregations[filterFieldKey] = childFilterField;
        return {
          key: filterFieldKey,
          label: childFilterField.getAttribute("label"),
          position: {
            placement: childFilterField.getAttribute("placement"),
            anchor: childFilterField.getAttribute("anchor")
          },
          required: childFilterField.getAttribute("required") === "true",
          type: "Slot"
        };
      });
      oProps._internalContextPath = oMetaModel.createBindingContext(entityTypePath);
      var oVisualizationObjectPath = getInvolvedDataModelObjects(oProps._internalContextPath);
      var sObjectPath = "@com.sap.vocabularies.UI.v1.SelectionFields";
      var oExtraParams = {};
      oExtraParams[sObjectPath] = {
        filterFields: oExtraFilters
      };
      var oConverterContext = this.getConverterContext(oVisualizationObjectPath, undefined, mSettings, oExtraParams);

      if (!oProps.propertyInfo) {
        oProps.propertyInfo = getSelectionFields(oConverterContext, [], annotationPath).sPropertyInfo;
      }

      this._processPropertyInfos(oProps); //Filter Fields and values to the field are filled based on the selectionFields and this would be empty in case of macro outside the FE template


      if (!oProps.selectionFields) {
        var oSelectionFields = getSelectionFields(oConverterContext, [], annotationPath).selectionFields;
        oProps.selectionFields = new TemplateModel(oSelectionFields, oMetaModel).createBindingContext("/");
        var oEntityType = oConverterContext.getEntityType(),
            oSelectionVariant = getSelectionVariant(oEntityType, oConverterContext),
            oEntitySetContext = oContext.getModel().getContext(sEntitySetPath),
            oFilterConditions = getFilterConditions(oEntitySetContext, {
          selectionVariant: oSelectionVariant
        });
        oProps.filterConditions = oFilterConditions;
      } // TODO: this could be also moved into a central place


      if (oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot") || oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode")) {
        oProps.showDraftEditState = true;

        if (ModelHelper.isCollaborationDraftSupported(oMetaModel)) {
          oProps.isDraftCollaborative = true;
        }
      }

      if (oProps._applyIdToContent) {
        oProps._apiId = oProps.id + "::FilterBar";
        oProps._contentId = oProps.id;
      } else {
        oProps._apiId = oProps.id;
        oProps._contentId = this.getContentId(oProps.id);
      }

      if (oProps.hideBasicSearch !== "true") {
        var oSearchRestrictionAnnotation = CommonUtils.getSearchRestrictions(sEntitySetPath, oMetaModel);
        oProps.hideBasicSearch = Boolean(oSearchRestrictionAnnotation && !oSearchRestrictionAnnotation.Searchable);
      }

      return oProps;
    }
  });
  return FilterBarMetadata;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWx0ZXJCYXJNZXRhZGF0YSIsIk1hY3JvTWV0YWRhdGEiLCJleHRlbmQiLCJuYW1lIiwibmFtZXNwYWNlIiwicHVibGljTmFtZXNwYWNlIiwiZnJhZ21lbnQiLCJtZXRhZGF0YSIsInN0ZXJlb3R5cGUiLCJkZXNpZ250aW1lIiwicHJvcGVydGllcyIsInNlbGVjdGlvbkZpZWxkcyIsInR5cGUiLCJtZXRhUGF0aCIsImlzUHVibGljIiwiY29udGV4dFBhdGgiLCJpZCIsInZpc2libGUiLCJzaG93TWVzc2FnZXMiLCJkZWZhdWx0VmFsdWUiLCJfYXBwbHlJZFRvQ29udGVudCIsInZhcmlhbnRCYWNrcmVmZXJlbmNlIiwiaGlkZUJhc2ljU2VhcmNoIiwiZW5hYmxlRmFsbGJhY2siLCJzaG93QWRhcHRGaWx0ZXJzQnV0dG9uIiwicDEzbk1vZGUiLCJwcm9wZXJ0eUluZm8iLCJ1c2VTZW1hbnRpY0RhdGVSYW5nZSIsImxpdmVNb2RlIiwiX3ZhbHVlTGlzdCIsInJlcXVpcmVkIiwiX2ludGVybmFsQ29udGV4dFBhdGgiLCJmaWx0ZXJDb25kaXRpb25zIiwic3VzcGVuZFNlbGVjdGlvbiIsInNob3dEcmFmdEVkaXRTdGF0ZSIsImlzRHJhZnRDb2xsYWJvcmF0aXZlIiwidG9nZ2xlQ29udHJvbElkIiwiaW5pdGlhbExheW91dCIsImV2ZW50cyIsInNlYXJjaCIsImZpbHRlckNoYW5nZWQiLCJzdGF0ZUNoYW5nZSIsImludGVybmFsRmlsdGVyQ2hhbmdlZCIsImludGVybmFsU2VhcmNoIiwiYWdncmVnYXRpb25zIiwiZmlsdGVyRmllbGRzIiwiX3Byb2Nlc3NQcm9wZXJ0eUluZm9zIiwib1Byb3BzIiwiYVBhcmFtZXRlckZpZWxkcyIsInNGZXRjaGVkUHJvcGVydGllcyIsInJlcGxhY2UiLCJhRmV0Y2hlZFByb3BlcnRpZXMiLCJKU09OIiwicGFyc2UiLCJmb3JFYWNoIiwicHJvcEluZm8iLCJpc1BhcmFtZXRlciIsInB1c2giLCJwYXRoIiwibGFiZWwiLCJSZXNvdXJjZU1vZGVsIiwiZ2V0VGV4dCIsInN0cmluZ2lmeSIsInBhcmFtZXRlcnMiLCJjcmVhdGUiLCJvQ29udHJvbENvbmZpZ3VyYXRpb24iLCJtU2V0dGluZ3MiLCJvQWdncmVnYXRpb25zIiwib0NvbnRleHQiLCJMb2ciLCJlcnJvciIsIm9NZXRhUGF0aENvbnRleHQiLCJzTWV0YVBhdGgiLCJnZXRQYXRoIiwibWV0YVBhdGhQYXJ0cyIsInNwbGl0IiwiZW50aXR5VHlwZVBhdGgiLCJlbmRzV2l0aCIsImFubm90YXRpb25QYXRoIiwic0VudGl0eVNldFBhdGgiLCJNb2RlbEhlbHBlciIsImdldEVudGl0eVNldFBhdGgiLCJvTWV0YU1vZGVsIiwiZ2V0TW9kZWwiLCJvRXh0cmFGaWx0ZXJzIiwicGFyc2VBZ2dyZWdhdGlvbiIsImNoaWxkRmlsdGVyRmllbGQiLCJmaWx0ZXJGaWVsZEtleSIsImdldEF0dHJpYnV0ZSIsImtleSIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiYW5jaG9yIiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJvVmlzdWFsaXphdGlvbk9iamVjdFBhdGgiLCJnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMiLCJzT2JqZWN0UGF0aCIsIm9FeHRyYVBhcmFtcyIsIm9Db252ZXJ0ZXJDb250ZXh0IiwiZ2V0Q29udmVydGVyQ29udGV4dCIsInVuZGVmaW5lZCIsImdldFNlbGVjdGlvbkZpZWxkcyIsInNQcm9wZXJ0eUluZm8iLCJvU2VsZWN0aW9uRmllbGRzIiwiVGVtcGxhdGVNb2RlbCIsIm9FbnRpdHlUeXBlIiwiZ2V0RW50aXR5VHlwZSIsIm9TZWxlY3Rpb25WYXJpYW50IiwiZ2V0U2VsZWN0aW9uVmFyaWFudCIsIm9FbnRpdHlTZXRDb250ZXh0IiwiZ2V0Q29udGV4dCIsIm9GaWx0ZXJDb25kaXRpb25zIiwiZ2V0RmlsdGVyQ29uZGl0aW9ucyIsInNlbGVjdGlvblZhcmlhbnQiLCJnZXRPYmplY3QiLCJpc0NvbGxhYm9yYXRpb25EcmFmdFN1cHBvcnRlZCIsIl9hcGlJZCIsIl9jb250ZW50SWQiLCJnZXRDb250ZW50SWQiLCJvU2VhcmNoUmVzdHJpY3Rpb25Bbm5vdGF0aW9uIiwiQ29tbW9uVXRpbHMiLCJnZXRTZWFyY2hSZXN0cmljdGlvbnMiLCJCb29sZWFuIiwiU2VhcmNoYWJsZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRmlsdGVyQmFyLm1ldGFkYXRhLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqIEBjbGFzc2Rlc2NcbiAqIEJ1aWxkaW5nIGJsb2NrIGZvciBjcmVhdGluZyBhIEZpbHRlckJhciBiYXNlZCBvbiB0aGUgbWV0YWRhdGEgcHJvdmlkZWQgYnkgT0RhdGEgVjQuXG4gKlxuICpcbiAqIFVzYWdlIGV4YW1wbGU6XG4gKiA8cHJlPlxuICogJmx0O21hY3JvOkZpbHRlckJhclxuICogICBpZD1cIlNvbWVJRFwiXG4gKiAgIHNob3dBZGFwdEZpbHRlcnNCdXR0b249XCJ0cnVlXCJcbiAqICAgcDEzbk1vZGU9W1wiSXRlbVwiLFwiVmFsdWVcIl1cbiAqICAgbGlzdEJpbmRpbmdOYW1lcyA9IFwic2FwLmZlLnRhYmxlQmluZGluZ1wiXG4gKiAgIGxpdmVNb2RlPVwidHJ1ZVwiXG4gKiAgIHNlYXJjaD1cIi5oYW5kbGVycy5vblNlYXJjaFwiXG4gKiAgIGZpbHRlckNoYW5nZWQ9XCIuaGFuZGxlcnMub25GaWx0ZXJzQ2hhbmdlZFwiXG4gKiAvJmd0O1xuICogPC9wcmU+XG4gKlxuICogQnVpbGRpbmcgYmxvY2sgZm9yIGNyZWF0aW5nIGEgRmlsdGVyQmFyIGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSBWNC5cbiAqIEBjbGFzcyBzYXAuZmUubWFjcm9zLkZpbHRlckJhclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICogQHNpbmNlIDEuOTQuMFxuICovXG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB7IGdldFNlbGVjdGlvblZhcmlhbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vRGF0YVZpc3VhbGl6YXRpb25cIjtcbmltcG9ydCB7IGdldFNlbGVjdGlvbkZpZWxkcyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0xpc3RSZXBvcnQvRmlsdGVyQmFyXCI7XG5pbXBvcnQgeyBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IFRlbXBsYXRlTW9kZWwgZnJvbSBcInNhcC9mZS9jb3JlL1RlbXBsYXRlTW9kZWxcIjtcbmltcG9ydCB7IGdldEZpbHRlckNvbmRpdGlvbnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9GaWx0ZXJIZWxwZXJcIjtcbmltcG9ydCBNYWNyb01ldGFkYXRhIGZyb20gXCJzYXAvZmUvbWFjcm9zL01hY3JvTWV0YWRhdGFcIjtcbmltcG9ydCBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvZmUvbWFjcm9zL1Jlc291cmNlTW9kZWxcIjtcblxuY29uc3QgRmlsdGVyQmFyTWV0YWRhdGEgPSBNYWNyb01ldGFkYXRhLmV4dGVuZChcInNhcC5mZS5tYWNyb3MuRmlsdGVyQmFyXCIsIHtcblx0LyoqXG5cdCAqIE5hbWUgb2YgdGhlIGJ1aWxkaW5nIGJsb2NrIGNvbnRyb2wuXG5cdCAqL1xuXHRuYW1lOiBcIkZpbHRlckJhclwiLFxuXHQvKipcblx0ICogTmFtZSBvZiB0aGUgYnVpbGRpbmcgYmxvY2sgY29udHJvbC5cblx0ICovXG5cdG5hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zLmludGVybmFsXCIsXG5cdHB1YmxpY05hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zXCIsXG5cdC8qKlxuXHQgKiBGcmFnbWVudCBzb3VyY2Ugb2YgdGhlIG1hY3JvIChvcHRpb25hbCkgLSBpZiBub3Qgc2V0LCBmcmFnbWVudCBpcyBnZW5lcmF0ZWQgZnJvbSBuYW1lc3BhY2UgYW5kIG5hbWVcblx0ICovXG5cdGZyYWdtZW50OiBcInNhcC5mZS5tYWNyb3MuZmlsdGVyQmFyLkZpbHRlckJhclwiLFxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0YWRhdGEgZGVzY3JpYmluZyB0aGUgbWFjcm8gY29udHJvbC5cblx0ICovXG5cdG1ldGFkYXRhOiB7XG5cdFx0LyoqXG5cdFx0ICogRGVmaW5lIG1hY3JvIHN0ZXJlb3R5cGUgZm9yIGRvY3VtZW50YXRpb25cblx0XHQgKi9cblx0XHRzdGVyZW90eXBlOiBcInhtbG1hY3JvXCIsXG5cdFx0LyoqXG5cdFx0ICogTG9jYXRpb24gb2YgdGhlIGRlc2lnbnRpbWUgaW5mb1xuXHRcdCAqL1xuXHRcdGRlc2lnbnRpbWU6IFwic2FwL2ZlL21hY3Jvcy9maWx0ZXJCYXIvRmlsdGVyQmFyLmRlc2lnbnRpbWVcIixcblx0XHQvKipcblx0XHQgKiBQcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogc2VsZWN0aW9uRmllbGRzIHRvIGJlIGRpc3BsYXllZFxuXHRcdFx0ICovXG5cdFx0XHRzZWxlY3Rpb25GaWVsZHM6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiXG5cdFx0XHR9LFxuXHRcdFx0bWV0YVBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGNvbnRleHRQYXRoOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIElEIG9mIHRoZSBGaWx0ZXJCYXJcblx0XHRcdCAqL1xuXHRcdFx0aWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHR2aXNpYmxlOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRGlzcGxheXMgcG9zc2libGUgZXJyb3JzIGR1cmluZyB0aGUgc2VhcmNoIGluIGEgbWVzc2FnZSBib3hcblx0XHRcdCAqL1xuXHRcdFx0c2hvd01lc3NhZ2VzOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogSWYgc3BlY2lmaWNlZCBhcyB0cnVlIHRoZSBJRCBpcyBhcHBsaWVkIHRvIHRoZSBpbm5lciBjb250ZW50IG9mIHRoZSBidWlsZGluZyBibG9ja1xuXHRcdFx0ICogVGhpcyBpcyBvbmx5IGEgcHJpdmF0ZSBwcm9wZXJ0eSB0byBiZSB1c2VkIGJ5IHNhcC5mZSAoRmlvcmkgRWxlbWVudHMpXG5cdFx0XHQgKi9cblx0XHRcdF9hcHBseUlkVG9Db250ZW50OiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJRCBvZiB0aGUgYXNzaWduZWQgdmFyaWFudCBtYW5hZ2VtZW50XG5cdFx0XHQgKi9cblx0XHRcdHZhcmlhbnRCYWNrcmVmZXJlbmNlOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIERvbid0IHNob3cgdGhlIGJhc2ljIHNlYXJjaCBmaWVsZFxuXHRcdFx0ICovXG5cdFx0XHRoaWRlQmFzaWNTZWFyY2g6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCJcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogRW5hYmxlcyB0aGUgZmFsbGJhY2sgdG8gc2hvdyBhbGwgZmllbGRzIG9mIHRoZSBFbnRpdHlUeXBlIGFzIGZpbHRlciBmaWVsZHMgaWYgY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uRmllbGRzIGFyZSBub3QgcHJlc2VudFxuXHRcdFx0ICovXG5cdFx0XHRlbmFibGVGYWxsYmFjazoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBIYW5kbGVzIHZpc2liaWxpdHkgb2YgdGhlICdBZGFwdCBGaWx0ZXJzJyBidXR0b24gb24gdGhlIEZpbHRlckJhclxuXHRcdFx0ICovXG5cdFx0XHRzaG93QWRhcHRGaWx0ZXJzQnV0dG9uOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRydWVcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogU3BlY2lmaWVzIHRoZSBwZXJzb25hbGl6YXRpb24gb3B0aW9ucyBmb3IgdGhlIGZpbHRlciBiYXIuXG5cdFx0XHQgKi9cblx0XHRcdHAxM25Nb2RlOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1kYy5GaWx0ZXJCYXJQMTNuTW9kZVtdXCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogXCJJdGVtLFZhbHVlXCJcblx0XHRcdH0sXG5cdFx0XHRwcm9wZXJ0eUluZm86IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogU3BlY2lmaWVzIHRoZSBTZW1hdGljIERhdGUgUmFuZ2Ugb3B0aW9uIGZvciB0aGUgZmlsdGVyIGJhci5cblx0XHRcdCAqL1xuXHRcdFx0dXNlU2VtYW50aWNEYXRlUmFuZ2U6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdHJ1ZVxuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJZiBzZXQgdGhlIHNlYXJjaCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgdHJpZ2dlcmVkLCB3aGVuIGEgZmlsdGVyIHZhbHVlIHdhcyBjaGFuZ2VkLlxuXHRcdFx0ICovXG5cdFx0XHRsaXZlTW9kZToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZSxcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFRlbXBvcmFyeSB3b3JrYXJvdW5kIG9ubHlcblx0XHRcdCAqIHBhdGggdG8gdmFsdWVsaXN0XG5cdFx0XHQgKi9cblx0XHRcdF92YWx1ZUxpc3Q6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFRlbXBvcmFyeSB3b3JrYXJvdW5kIG9ubHlcblx0XHRcdCAqIHBhdGggdG8gY29udGV4dFBhdGggdG8gYmUgdXNlZCBieSBjaGlsZCBmaWx0ZXJmaWVsZHNcblx0XHRcdCAqL1xuXHRcdFx0X2ludGVybmFsQ29udGV4dFBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEZpbHRlciBjb25kaXRpb25zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGZpbHRlciBiYXJcblx0XHRcdCAqL1xuXHRcdFx0ZmlsdGVyQ29uZGl0aW9uczoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIElmIHNldCB0byA8Y29kZT50cnVlPC9jb2RlPiwgYWxsIHNlYXJjaCByZXF1ZXN0cyBhcmUgaWdub3JlZC4gT25jZSBpdCBoYXMgYmVlbiBzZXQgdG8gPGNvZGU+ZmFsc2U8L2NvZGU+LFxuXHRcdFx0ICogYSBzZWFyY2ggaXMgdHJpZ2dlcmVkIGltbWVkaWF0ZWx5IGlmIG9uZSBvciBtb3JlIHNlYXJjaCByZXF1ZXN0cyBoYXZlIGJlZW4gdHJpZ2dlcmVkIGluIHRoZSBtZWFudGltZVxuXHRcdFx0ICogYnV0IHdlcmUgaWdub3JlZCBiYXNlZCBvbiB0aGUgc2V0dGluZy5cblx0XHRcdCAqL1xuXHRcdFx0c3VzcGVuZFNlbGVjdGlvbjoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdHNob3dEcmFmdEVkaXRTdGF0ZToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGlzRHJhZnRDb2xsYWJvcmF0aXZlOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJZCBvZiBjb250cm9sIHRoYXQgd2lsbCBhbGxvdyBmb3Igc3dpdGNoaW5nIGJldHdlZW4gbm9ybWFsIGFuZCB2aXN1YWwgZmlsdGVyXG5cdFx0XHQgKi9cblx0XHRcdHRvZ2dsZUNvbnRyb2xJZDoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHR9LFxuXHRcdFx0aW5pdGlhbExheW91dDoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IFwiY29tcGFjdFwiXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRldmVudHM6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogRXZlbnQgaGFuZGxlciB0byByZWFjdCB0byB0aGUgc2VhcmNoIGV2ZW50IG9mIHRoZSBGaWx0ZXJCYXJcblx0XHRcdCAqL1xuXHRcdFx0c2VhcmNoOiB7XG5cdFx0XHRcdHR5cGU6IFwiZnVuY3Rpb25cIixcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEV2ZW50IGhhbmRsZXIgdG8gcmVhY3QgdG8gdGhlIGZpbHRlckNoYW5nZSBldmVudCBvZiB0aGUgRmlsdGVyQmFyXG5cdFx0XHQgKi9cblx0XHRcdGZpbHRlckNoYW5nZWQ6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRXZlbnQgaGFuZGxlciB0byByZWFjdCB0byB0aGUgc3RhdGVDaGFuZ2UgZXZlbnQgb2YgdGhlIEZpbHRlckJhci5cblx0XHRcdCAqL1xuXHRcdFx0c3RhdGVDaGFuZ2U6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IHRvIHRoZSBmaWx0ZXJDaGFuZ2VkIGV2ZW50IG9mIHRoZSBGaWx0ZXJCYXIuIEV4cG9zZXMgcGFyYW1ldGVycyBmcm9tIHRoZSBNREMgZmlsdGVyIGJhclxuXHRcdFx0ICovXG5cdFx0XHRpbnRlcm5hbEZpbHRlckNoYW5nZWQ6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IHRvIHRoZSBzZWFyY2ggZXZlbnQgb2YgdGhlIEZpbHRlckJhci4gRXhwb3NlcyBwYXJhbWV0ZXJlcyBmcm9tIHRoZSBNREMgZmlsdGVyIGJhclxuXHRcdFx0ICovXG5cdFx0XHRpbnRlcm5hbFNlYXJjaDoge1xuXHRcdFx0XHR0eXBlOiBcImZ1bmN0aW9uXCJcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFnZ3JlZ2F0aW9uczoge1xuXHRcdFx0ZmlsdGVyRmllbGRzOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLmZlLm1hY3Jvcy5GaWx0ZXJGaWVsZFwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0X3Byb2Nlc3NQcm9wZXJ0eUluZm9zOiBmdW5jdGlvbiAob1Byb3BzOiBhbnkpOiB2b2lkIHtcblx0XHRjb25zdCBhUGFyYW1ldGVyRmllbGRzOiBhbnlbXSA9IFtdO1xuXHRcdGlmIChvUHJvcHMucHJvcGVydHlJbmZvKSB7XG5cdFx0XHRjb25zdCBzRmV0Y2hlZFByb3BlcnRpZXMgPSBvUHJvcHMucHJvcGVydHlJbmZvLnJlcGxhY2UoL1xcXFx7L2csIFwie1wiKS5yZXBsYWNlKC9cXFxcfS9nLCBcIn1cIik7XG5cdFx0XHRjb25zdCBhRmV0Y2hlZFByb3BlcnRpZXMgPSBKU09OLnBhcnNlKHNGZXRjaGVkUHJvcGVydGllcyk7XG5cdFx0XHRhRmV0Y2hlZFByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcEluZm86IGFueSkge1xuXHRcdFx0XHRpZiAocHJvcEluZm8uaXNQYXJhbWV0ZXIpIHtcblx0XHRcdFx0XHRhUGFyYW1ldGVyRmllbGRzLnB1c2gocHJvcEluZm8ubmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHByb3BJbmZvLnBhdGggPT09IFwiJGVkaXRTdGF0ZVwiKSB7XG5cdFx0XHRcdFx0cHJvcEluZm8ubGFiZWwgPSBSZXNvdXJjZU1vZGVsLmdldFRleHQoXCJGSUxURVJCQVJfRURJVElOR19TVEFUVVNcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRvUHJvcHMucHJvcGVydHlJbmZvID0gSlNPTi5zdHJpbmdpZnkoYUZldGNoZWRQcm9wZXJ0aWVzKS5yZXBsYWNlKC9cXHsvZywgXCJcXFxce1wiKS5yZXBsYWNlKC9cXH0vZywgXCJcXFxcfVwiKTtcblx0XHR9XG5cdFx0b1Byb3BzLnBhcmFtZXRlcnMgPSBKU09OLnN0cmluZ2lmeShhUGFyYW1ldGVyRmllbGRzKTtcblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbiAob1Byb3BzOiBhbnksIG9Db250cm9sQ29uZmlndXJhdGlvbjogYW55LCBtU2V0dGluZ3M6IGFueSwgb0FnZ3JlZ2F0aW9uczogYW55KSB7XG5cdFx0Y29uc3Qgb0NvbnRleHQgPSBvUHJvcHMuY29udGV4dFBhdGg7XG5cblx0XHRpZiAoIW9Db250ZXh0KSB7XG5cdFx0XHRMb2cuZXJyb3IoXCJDb250ZXh0IFBhdGggbm90IGF2YWlsYWJsZSBmb3IgRmlsdGVyQmFyIE1hY3JvLlwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBvTWV0YVBhdGhDb250ZXh0ID0gb1Byb3BzLm1ldGFQYXRoO1xuXHRcdGNvbnN0IHNNZXRhUGF0aCA9IG9NZXRhUGF0aENvbnRleHQgJiYgb01ldGFQYXRoQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgbWV0YVBhdGhQYXJ0cyA9IHNNZXRhUGF0aC5zcGxpdChcIi9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uRmllbGRzXCIpOyAvLyBbMF06IGVudGl0eVR5cGVQYXRoLCBbMV06IFNGIFF1YWxpZmllci5cblx0XHRjb25zdCBlbnRpdHlUeXBlUGF0aDogc3RyaW5nID0gbWV0YVBhdGhQYXJ0c1swXS5lbmRzV2l0aChcIi9cIikgPyBtZXRhUGF0aFBhcnRzWzBdIDogbWV0YVBhdGhQYXJ0c1swXSArIFwiL1wiO1xuXHRcdGNvbnN0IGFubm90YXRpb25QYXRoOiBzdHJpbmcgPSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIiArIChtZXRhUGF0aFBhcnRzWzFdIHx8IFwiXCIpO1xuXHRcdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gTW9kZWxIZWxwZXIuZ2V0RW50aXR5U2V0UGF0aChlbnRpdHlUeXBlUGF0aCk7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCk7XG5cdFx0Y29uc3Qgb0V4dHJhRmlsdGVycyA9IHRoaXMucGFyc2VBZ2dyZWdhdGlvbihvQWdncmVnYXRpb25zLmZpbHRlckZpZWxkcywgZnVuY3Rpb24gKGNoaWxkRmlsdGVyRmllbGQ6IGFueSkge1xuXHRcdFx0Y29uc3QgZmlsdGVyRmllbGRLZXkgPSBjaGlsZEZpbHRlckZpZWxkLmdldEF0dHJpYnV0ZShcImtleVwiKTtcblx0XHRcdG9BZ2dyZWdhdGlvbnNbZmlsdGVyRmllbGRLZXldID0gY2hpbGRGaWx0ZXJGaWVsZDtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGtleTogZmlsdGVyRmllbGRLZXksXG5cdFx0XHRcdGxhYmVsOiBjaGlsZEZpbHRlckZpZWxkLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpLFxuXHRcdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogY2hpbGRGaWx0ZXJGaWVsZC5nZXRBdHRyaWJ1dGUoXCJwbGFjZW1lbnRcIiksXG5cdFx0XHRcdFx0YW5jaG9yOiBjaGlsZEZpbHRlckZpZWxkLmdldEF0dHJpYnV0ZShcImFuY2hvclwiKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZXF1aXJlZDogY2hpbGRGaWx0ZXJGaWVsZC5nZXRBdHRyaWJ1dGUoXCJyZXF1aXJlZFwiKSA9PT0gXCJ0cnVlXCIsXG5cdFx0XHRcdHR5cGU6IFwiU2xvdFwiXG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdFx0b1Byb3BzLl9pbnRlcm5hbENvbnRleHRQYXRoID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChlbnRpdHlUeXBlUGF0aCk7XG5cdFx0Y29uc3Qgb1Zpc3VhbGl6YXRpb25PYmplY3RQYXRoID0gZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzKG9Qcm9wcy5faW50ZXJuYWxDb250ZXh0UGF0aCk7XG5cdFx0Y29uc3Qgc09iamVjdFBhdGggPSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIjtcblx0XHRjb25zdCBvRXh0cmFQYXJhbXM6IGFueSA9IHt9O1xuXHRcdG9FeHRyYVBhcmFtc1tzT2JqZWN0UGF0aF0gPSB7XG5cdFx0XHRmaWx0ZXJGaWVsZHM6IG9FeHRyYUZpbHRlcnNcblx0XHR9O1xuXHRcdGNvbnN0IG9Db252ZXJ0ZXJDb250ZXh0ID0gdGhpcy5nZXRDb252ZXJ0ZXJDb250ZXh0KG9WaXN1YWxpemF0aW9uT2JqZWN0UGF0aCwgdW5kZWZpbmVkLCBtU2V0dGluZ3MsIG9FeHRyYVBhcmFtcyk7XG5cdFx0aWYgKCFvUHJvcHMucHJvcGVydHlJbmZvKSB7XG5cdFx0XHRvUHJvcHMucHJvcGVydHlJbmZvID0gZ2V0U2VsZWN0aW9uRmllbGRzKG9Db252ZXJ0ZXJDb250ZXh0LCBbXSwgYW5ub3RhdGlvblBhdGgpLnNQcm9wZXJ0eUluZm87XG5cdFx0fVxuXG5cdFx0dGhpcy5fcHJvY2Vzc1Byb3BlcnR5SW5mb3Mob1Byb3BzKTtcblxuXHRcdC8vRmlsdGVyIEZpZWxkcyBhbmQgdmFsdWVzIHRvIHRoZSBmaWVsZCBhcmUgZmlsbGVkIGJhc2VkIG9uIHRoZSBzZWxlY3Rpb25GaWVsZHMgYW5kIHRoaXMgd291bGQgYmUgZW1wdHkgaW4gY2FzZSBvZiBtYWNybyBvdXRzaWRlIHRoZSBGRSB0ZW1wbGF0ZVxuXHRcdGlmICghb1Byb3BzLnNlbGVjdGlvbkZpZWxkcykge1xuXHRcdFx0Y29uc3Qgb1NlbGVjdGlvbkZpZWxkcyA9IGdldFNlbGVjdGlvbkZpZWxkcyhvQ29udmVydGVyQ29udGV4dCwgW10sIGFubm90YXRpb25QYXRoKS5zZWxlY3Rpb25GaWVsZHM7XG5cdFx0XHRvUHJvcHMuc2VsZWN0aW9uRmllbGRzID0gbmV3IFRlbXBsYXRlTW9kZWwob1NlbGVjdGlvbkZpZWxkcywgb01ldGFNb2RlbCkuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpO1xuXHRcdFx0Y29uc3Qgb0VudGl0eVR5cGUgPSBvQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksXG5cdFx0XHRcdG9TZWxlY3Rpb25WYXJpYW50ID0gZ2V0U2VsZWN0aW9uVmFyaWFudChvRW50aXR5VHlwZSwgb0NvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0XHRvRW50aXR5U2V0Q29udGV4dCA9IG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0Q29udGV4dChzRW50aXR5U2V0UGF0aCksXG5cdFx0XHRcdG9GaWx0ZXJDb25kaXRpb25zID0gZ2V0RmlsdGVyQ29uZGl0aW9ucyhvRW50aXR5U2V0Q29udGV4dCwgeyBzZWxlY3Rpb25WYXJpYW50OiBvU2VsZWN0aW9uVmFyaWFudCB9KTtcblx0XHRcdG9Qcm9wcy5maWx0ZXJDb25kaXRpb25zID0gb0ZpbHRlckNvbmRpdGlvbnM7XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETzogdGhpcyBjb3VsZCBiZSBhbHNvIG1vdmVkIGludG8gYSBjZW50cmFsIHBsYWNlXG5cdFx0aWYgKFxuXHRcdFx0b01ldGFNb2RlbC5nZXRPYmplY3Qoc0VudGl0eVNldFBhdGggKyBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRSb290XCIpIHx8XG5cdFx0XHRvTWV0YU1vZGVsLmdldE9iamVjdChzRW50aXR5U2V0UGF0aCArIFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdE5vZGVcIilcblx0XHQpIHtcblx0XHRcdG9Qcm9wcy5zaG93RHJhZnRFZGl0U3RhdGUgPSB0cnVlO1xuXG5cdFx0XHRpZiAoTW9kZWxIZWxwZXIuaXNDb2xsYWJvcmF0aW9uRHJhZnRTdXBwb3J0ZWQob01ldGFNb2RlbCkpIHtcblx0XHRcdFx0b1Byb3BzLmlzRHJhZnRDb2xsYWJvcmF0aXZlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAob1Byb3BzLl9hcHBseUlkVG9Db250ZW50KSB7XG5cdFx0XHRvUHJvcHMuX2FwaUlkID0gb1Byb3BzLmlkICsgXCI6OkZpbHRlckJhclwiO1xuXHRcdFx0b1Byb3BzLl9jb250ZW50SWQgPSBvUHJvcHMuaWQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9Qcm9wcy5fYXBpSWQgPSBvUHJvcHMuaWQ7XG5cdFx0XHRvUHJvcHMuX2NvbnRlbnRJZCA9IHRoaXMuZ2V0Q29udGVudElkKG9Qcm9wcy5pZCk7XG5cdFx0fVxuXG5cdFx0aWYgKG9Qcm9wcy5oaWRlQmFzaWNTZWFyY2ggIT09IFwidHJ1ZVwiKSB7XG5cdFx0XHRjb25zdCBvU2VhcmNoUmVzdHJpY3Rpb25Bbm5vdGF0aW9uID0gQ29tbW9uVXRpbHMuZ2V0U2VhcmNoUmVzdHJpY3Rpb25zKHNFbnRpdHlTZXRQYXRoLCBvTWV0YU1vZGVsKTtcblx0XHRcdG9Qcm9wcy5oaWRlQmFzaWNTZWFyY2ggPSBCb29sZWFuKG9TZWFyY2hSZXN0cmljdGlvbkFubm90YXRpb24gJiYgIW9TZWFyY2hSZXN0cmljdGlvbkFubm90YXRpb24uU2VhcmNoYWJsZSk7XG5cdFx0fVxuXHRcdHJldHVybiBvUHJvcHM7XG5cdH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgRmlsdGVyQmFyTWV0YWRhdGE7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztFQW9DQSxJQUFNQSxpQkFBaUIsR0FBR0MsYUFBYSxDQUFDQyxNQUFkLENBQXFCLHlCQUFyQixFQUFnRDtJQUN6RTtBQUNEO0FBQ0E7SUFDQ0MsSUFBSSxFQUFFLFdBSm1FOztJQUt6RTtBQUNEO0FBQ0E7SUFDQ0MsU0FBUyxFQUFFLHdCQVI4RDtJQVN6RUMsZUFBZSxFQUFFLGVBVHdEOztJQVV6RTtBQUNEO0FBQ0E7SUFDQ0MsUUFBUSxFQUFFLG1DQWIrRDs7SUFlekU7QUFDRDtBQUNBO0lBQ0NDLFFBQVEsRUFBRTtNQUNUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUUsVUFKSDs7TUFLVDtBQUNGO0FBQ0E7TUFDRUMsVUFBVSxFQUFFLDhDQVJIOztNQVNUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUU7UUFDWDtBQUNIO0FBQ0E7UUFDR0MsZUFBZSxFQUFFO1VBQ2hCQyxJQUFJLEVBQUU7UUFEVSxDQUpOO1FBT1hDLFFBQVEsRUFBRTtVQUNURCxJQUFJLEVBQUUsc0JBREc7VUFFVEUsUUFBUSxFQUFFO1FBRkQsQ0FQ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