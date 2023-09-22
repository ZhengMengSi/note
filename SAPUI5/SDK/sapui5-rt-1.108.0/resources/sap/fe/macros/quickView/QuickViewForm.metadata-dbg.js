/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/MetaModelConverter", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/MacroMetadata"], function (MetaModelConverter, DataModelPathHelper, FieldTemplating, MacroMetadata) {
  "use strict";

  /**
   * @classdesc
   * Building block used to create a QuickView card based on the metadata provided by OData v4 .
   * Usage example:
   * <pre>
   *   &lt;macro:QuickViewForm
   *   	dataField="{dataField>}"
   *   	entityType="{entityType>}"
   *   /&gt;
   * </pre>
   * @class sap.fe.macros.QuickViewForm
   * @hideconstructor
   * @private
   * @experimental
   */
  var QuickViewForm = MacroMetadata.extend("sap.fe.macros.quickView.QuickViewForm", {
    /**
     * Name of the building block control.
     */
    name: "QuickViewForm",

    /**
     *
     * Namespace of the building block control
     */
    namespace: "sap.fe.macros",

    /**
     * Fragment source of the building block (optional) - if not set, fragment is generated from namespace and name
     */
    fragment: "sap.fe.macros.quickView.QuickViewForm",

    /**
     * The metadata describing the building block control.
     */
    metadata: {
      /**
       * Define building block stereotype for documentation
       */
      stereotype: "xmlmacro",

      /**
       * Location of the designtime info
       */
      designtime: "sap/fe/macros/quickView/QuickViewForm.designtime",

      /**
       * Properties.
       */
      properties: {
        /**
         * Metadata path to the Contact
         * TODO find $type or $kind of the navigationentity
         */
        entityType: {
          type: "sap.ui.model.Context"
        },
        dataField: {
          type: "sap.ui.model.Context",
          required: true,
          $kind: "Property",
          $Type: ["com.sap.vocabularies.UI.v1.DataField", "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "com.sap.vocabularies.UI.v1.DataFieldForAnnotation", "com.sap.vocabularies.UI.v1.DataPointType"]
        },
        semanticObject: {
          type: "string"
        },

        /**
         * Metadata path to the entity set
         */
        contextPath: {
          type: "sap.ui.model.Context",
          required: false
        },
        hasSemanticOnNavigation: {
          type: "boolean",
          required: false
        },
        hasQuickViewFacets: {
          type: "boolean",
          required: false
        },

        /**
         * Context pointing to an array of key value that is used for custom data generation
         */
        semanticObjectsToResolve: {
          type: "sap.ui.model.Context",
          required: false,
          computed: true
        }
      },
      events: {}
    },
    create: function (oProps) {
      if (oProps.contextPath) {
        var oDataFieldConverted = MetaModelConverter.convertMetaModelContext(oProps.dataField);
        var oDataModelPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.dataField, oProps.contextPath);
        var sExtraPath = ""; // data point annotations need not have $Type defined, so add it if missing

        if (oDataFieldConverted && oDataFieldConverted.term === "com.sap.vocabularies.UI.v1.DataPoint") {
          oDataFieldConverted.$Type = oDataFieldConverted.$Type || "com.sap.vocabularies.UI.v1.DataPointType";
        }

        if (oDataFieldConverted && oDataFieldConverted.$Type) {
          switch (oDataFieldConverted.$Type) {
            case "com.sap.vocabularies.UI.v1.DataField":
            case "com.sap.vocabularies.UI.v1.DataPointType":
            case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
            case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
            case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
            case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
              if (typeof oDataFieldConverted.Value === "object") {
                sExtraPath = oDataFieldConverted.Value.path;
              }

              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
              if (oDataFieldConverted.Target.$target) {
                if (oDataFieldConverted.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataField" || oDataFieldConverted.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
                  if (typeof oDataFieldConverted.Target.$target.Value === "object") {
                    sExtraPath = oDataFieldConverted.Target.$target.Value.path;
                  }
                } else {
                  if (typeof oDataFieldConverted.Target === "object") {
                    sExtraPath = oDataFieldConverted.Target.path;
                  }

                  break;
                }
              }

              break;
          }
        }

        oProps.visible = FieldTemplating.getVisibleExpression(oDataModelPath, oProps.formatOptions);

        if (sExtraPath && sExtraPath.length > 0) {
          oDataModelPath = DataModelPathHelper.enhanceDataModelPath(oDataModelPath, sExtraPath);
        }

        if (oDataModelPath.navigationProperties.length > 0) {
          oProps.navigationSemanticObjectList = [];
          oDataModelPath.navigationProperties.forEach(function (navProperty) {
            var _navProperty$annotati, _navProperty$annotati2;

            if (navProperty !== null && navProperty !== void 0 && (_navProperty$annotati = navProperty.annotations) !== null && _navProperty$annotati !== void 0 && (_navProperty$annotati2 = _navProperty$annotati.Common) !== null && _navProperty$annotati2 !== void 0 && _navProperty$annotati2.SemanticObject) {
              oProps.navigationSemanticObjectList.push(navProperty.annotations.Common.SemanticObject.toString());
            }
          });
        } else {
          oProps.navigationSemanticObjectList = null;
        }
      }

      return oProps;
    }
  });
  return QuickViewForm;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJRdWlja1ZpZXdGb3JtIiwiTWFjcm9NZXRhZGF0YSIsImV4dGVuZCIsIm5hbWUiLCJuYW1lc3BhY2UiLCJmcmFnbWVudCIsIm1ldGFkYXRhIiwic3RlcmVvdHlwZSIsImRlc2lnbnRpbWUiLCJwcm9wZXJ0aWVzIiwiZW50aXR5VHlwZSIsInR5cGUiLCJkYXRhRmllbGQiLCJyZXF1aXJlZCIsIiRraW5kIiwiJFR5cGUiLCJzZW1hbnRpY09iamVjdCIsImNvbnRleHRQYXRoIiwiaGFzU2VtYW50aWNPbk5hdmlnYXRpb24iLCJoYXNRdWlja1ZpZXdGYWNldHMiLCJzZW1hbnRpY09iamVjdHNUb1Jlc29sdmUiLCJjb21wdXRlZCIsImV2ZW50cyIsImNyZWF0ZSIsIm9Qcm9wcyIsIm9EYXRhRmllbGRDb252ZXJ0ZWQiLCJNZXRhTW9kZWxDb252ZXJ0ZXIiLCJjb252ZXJ0TWV0YU1vZGVsQ29udGV4dCIsIm9EYXRhTW9kZWxQYXRoIiwiZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzIiwic0V4dHJhUGF0aCIsInRlcm0iLCJWYWx1ZSIsInBhdGgiLCJUYXJnZXQiLCIkdGFyZ2V0IiwidmlzaWJsZSIsIkZpZWxkVGVtcGxhdGluZyIsImdldFZpc2libGVFeHByZXNzaW9uIiwiZm9ybWF0T3B0aW9ucyIsImxlbmd0aCIsIkRhdGFNb2RlbFBhdGhIZWxwZXIiLCJlbmhhbmNlRGF0YU1vZGVsUGF0aCIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwibmF2aWdhdGlvblNlbWFudGljT2JqZWN0TGlzdCIsImZvckVhY2giLCJuYXZQcm9wZXJ0eSIsImFubm90YXRpb25zIiwiQ29tbW9uIiwiU2VtYW50aWNPYmplY3QiLCJwdXNoIiwidG9TdHJpbmciXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlF1aWNrVmlld0Zvcm0ubWV0YWRhdGEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgKiBhcyBNZXRhTW9kZWxDb252ZXJ0ZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5pbXBvcnQgKiBhcyBEYXRhTW9kZWxQYXRoSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCAqIGFzIEZpZWxkVGVtcGxhdGluZyBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWVsZC9GaWVsZFRlbXBsYXRpbmdcIjtcbmltcG9ydCBNYWNyb01ldGFkYXRhIGZyb20gXCJzYXAvZmUvbWFjcm9zL01hY3JvTWV0YWRhdGFcIjtcblxuLyoqXG4gKiBAY2xhc3NkZXNjXG4gKiBCdWlsZGluZyBibG9jayB1c2VkIHRvIGNyZWF0ZSBhIFF1aWNrVmlldyBjYXJkIGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSB2NCAuXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICAgJmx0O21hY3JvOlF1aWNrVmlld0Zvcm1cbiAqICAgXHRkYXRhRmllbGQ9XCJ7ZGF0YUZpZWxkPn1cIlxuICogICBcdGVudGl0eVR5cGU9XCJ7ZW50aXR5VHlwZT59XCJcbiAqICAgLyZndDtcbiAqIDwvcHJlPlxuICogQGNsYXNzIHNhcC5mZS5tYWNyb3MuUXVpY2tWaWV3Rm9ybVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuXG5jb25zdCBRdWlja1ZpZXdGb3JtID0gTWFjcm9NZXRhZGF0YS5leHRlbmQoXCJzYXAuZmUubWFjcm9zLnF1aWNrVmlldy5RdWlja1ZpZXdGb3JtXCIsIHtcblx0LyoqXG5cdCAqIE5hbWUgb2YgdGhlIGJ1aWxkaW5nIGJsb2NrIGNvbnRyb2wuXG5cdCAqL1xuXHRuYW1lOiBcIlF1aWNrVmlld0Zvcm1cIixcblx0LyoqXG5cdCAqXG5cdCAqIE5hbWVzcGFjZSBvZiB0aGUgYnVpbGRpbmcgYmxvY2sgY29udHJvbFxuXHQgKi9cblx0bmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3NcIixcblx0LyoqXG5cdCAqIEZyYWdtZW50IHNvdXJjZSBvZiB0aGUgYnVpbGRpbmcgYmxvY2sgKG9wdGlvbmFsKSAtIGlmIG5vdCBzZXQsIGZyYWdtZW50IGlzIGdlbmVyYXRlZCBmcm9tIG5hbWVzcGFjZSBhbmQgbmFtZVxuXHQgKi9cblx0ZnJhZ21lbnQ6IFwic2FwLmZlLm1hY3Jvcy5xdWlja1ZpZXcuUXVpY2tWaWV3Rm9ybVwiLFxuXHQvKipcblx0ICogVGhlIG1ldGFkYXRhIGRlc2NyaWJpbmcgdGhlIGJ1aWxkaW5nIGJsb2NrIGNvbnRyb2wuXG5cdCAqL1xuXHRtZXRhZGF0YToge1xuXHRcdC8qKlxuXHRcdCAqIERlZmluZSBidWlsZGluZyBibG9jayBzdGVyZW90eXBlIGZvciBkb2N1bWVudGF0aW9uXG5cdFx0ICovXG5cdFx0c3RlcmVvdHlwZTogXCJ4bWxtYWNyb1wiLFxuXHRcdC8qKlxuXHRcdCAqIExvY2F0aW9uIG9mIHRoZSBkZXNpZ250aW1lIGluZm9cblx0XHQgKi9cblx0XHRkZXNpZ250aW1lOiBcInNhcC9mZS9tYWNyb3MvcXVpY2tWaWV3L1F1aWNrVmlld0Zvcm0uZGVzaWdudGltZVwiLFxuXHRcdC8qKlxuXHRcdCAqIFByb3BlcnRpZXMuXG5cdFx0ICovXG5cdFx0cHJvcGVydGllczoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBNZXRhZGF0YSBwYXRoIHRvIHRoZSBDb250YWN0XG5cdFx0XHQgKiBUT0RPIGZpbmQgJHR5cGUgb3IgJGtpbmQgb2YgdGhlIG5hdmlnYXRpb25lbnRpdHlcblx0XHRcdCAqL1xuXHRcdFx0ZW50aXR5VHlwZToge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCJcblx0XHRcdH0sXG5cdFx0XHRkYXRhRmllbGQ6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0JGtpbmQ6IFwiUHJvcGVydHlcIixcblx0XHRcdFx0JFR5cGU6IFtcblx0XHRcdFx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiLFxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aFVybFwiLFxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQW5ub3RhdGlvblwiLFxuXHRcdFx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiXG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRzZW1hbnRpY09iamVjdDoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBNZXRhZGF0YSBwYXRoIHRvIHRoZSBlbnRpdHkgc2V0XG5cdFx0XHQgKi9cblx0XHRcdGNvbnRleHRQYXRoOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0aGFzU2VtYW50aWNPbk5hdmlnYXRpb246IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGhhc1F1aWNrVmlld0ZhY2V0czoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDb250ZXh0IHBvaW50aW5nIHRvIGFuIGFycmF5IG9mIGtleSB2YWx1ZSB0aGF0IGlzIHVzZWQgZm9yIGN1c3RvbSBkYXRhIGdlbmVyYXRpb25cblx0XHRcdCAqL1xuXHRcdFx0c2VtYW50aWNPYmplY3RzVG9SZXNvbHZlOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlLFxuXHRcdFx0XHRjb21wdXRlZDogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRldmVudHM6IHt9XG5cdH0sXG5cdGNyZWF0ZTogZnVuY3Rpb24gKG9Qcm9wczogYW55KSB7XG5cdFx0aWYgKG9Qcm9wcy5jb250ZXh0UGF0aCkge1xuXHRcdFx0Y29uc3Qgb0RhdGFGaWVsZENvbnZlcnRlZCA9IE1ldGFNb2RlbENvbnZlcnRlci5jb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvUHJvcHMuZGF0YUZpZWxkKTtcblx0XHRcdGxldCBvRGF0YU1vZGVsUGF0aCA9IE1ldGFNb2RlbENvbnZlcnRlci5nZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob1Byb3BzLmRhdGFGaWVsZCwgb1Byb3BzLmNvbnRleHRQYXRoKTtcblx0XHRcdGxldCBzRXh0cmFQYXRoID0gXCJcIjtcblx0XHRcdC8vIGRhdGEgcG9pbnQgYW5ub3RhdGlvbnMgbmVlZCBub3QgaGF2ZSAkVHlwZSBkZWZpbmVkLCBzbyBhZGQgaXQgaWYgbWlzc2luZ1xuXHRcdFx0aWYgKG9EYXRhRmllbGRDb252ZXJ0ZWQgJiYgb0RhdGFGaWVsZENvbnZlcnRlZC50ZXJtID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFwiKSB7XG5cdFx0XHRcdG9EYXRhRmllbGRDb252ZXJ0ZWQuJFR5cGUgPSBvRGF0YUZpZWxkQ29udmVydGVkLiRUeXBlIHx8IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGU7XG5cdFx0XHR9XG5cdFx0XHRpZiAob0RhdGFGaWVsZENvbnZlcnRlZCAmJiBvRGF0YUZpZWxkQ29udmVydGVkLiRUeXBlKSB7XG5cdFx0XHRcdHN3aXRjaCAob0RhdGFGaWVsZENvbnZlcnRlZC4kVHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkOlxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZTpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbjpcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygb0RhdGFGaWVsZENvbnZlcnRlZC5WYWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0XHRzRXh0cmFQYXRoID0gb0RhdGFGaWVsZENvbnZlcnRlZC5WYWx1ZS5wYXRoO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdFx0XHRcdFx0aWYgKG9EYXRhRmllbGRDb252ZXJ0ZWQuVGFyZ2V0LiR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdG9EYXRhRmllbGRDb252ZXJ0ZWQuVGFyZ2V0LiR0YXJnZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZCB8fFxuXHRcdFx0XHRcdFx0XHRcdG9EYXRhRmllbGRDb252ZXJ0ZWQuVGFyZ2V0LiR0YXJnZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGVcblx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBvRGF0YUZpZWxkQ29udmVydGVkLlRhcmdldC4kdGFyZ2V0LlZhbHVlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzRXh0cmFQYXRoID0gb0RhdGFGaWVsZENvbnZlcnRlZC5UYXJnZXQuJHRhcmdldC5WYWx1ZS5wYXRoO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIG9EYXRhRmllbGRDb252ZXJ0ZWQuVGFyZ2V0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzRXh0cmFQYXRoID0gb0RhdGFGaWVsZENvbnZlcnRlZC5UYXJnZXQucGF0aDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9Qcm9wcy52aXNpYmxlID0gRmllbGRUZW1wbGF0aW5nLmdldFZpc2libGVFeHByZXNzaW9uKG9EYXRhTW9kZWxQYXRoLCBvUHJvcHMuZm9ybWF0T3B0aW9ucyk7XG5cdFx0XHRpZiAoc0V4dHJhUGF0aCAmJiBzRXh0cmFQYXRoLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0b0RhdGFNb2RlbFBhdGggPSBEYXRhTW9kZWxQYXRoSGVscGVyLmVuaGFuY2VEYXRhTW9kZWxQYXRoKG9EYXRhTW9kZWxQYXRoLCBzRXh0cmFQYXRoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9EYXRhTW9kZWxQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0b1Byb3BzLm5hdmlnYXRpb25TZW1hbnRpY09iamVjdExpc3QgPSBbXTtcblx0XHRcdFx0b0RhdGFNb2RlbFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAobmF2UHJvcGVydHkpIHtcblx0XHRcdFx0XHRpZiAobmF2UHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRvUHJvcHMubmF2aWdhdGlvblNlbWFudGljT2JqZWN0TGlzdC5wdXNoKG5hdlByb3BlcnR5LmFubm90YXRpb25zLkNvbW1vbi5TZW1hbnRpY09iamVjdC50b1N0cmluZygpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b1Byb3BzLm5hdmlnYXRpb25TZW1hbnRpY09iamVjdExpc3QgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb1Byb3BzO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUXVpY2tWaWV3Rm9ybTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUVBLElBQU1BLGFBQWEsR0FBR0MsYUFBYSxDQUFDQyxNQUFkLENBQXFCLHVDQUFyQixFQUE4RDtJQUNuRjtBQUNEO0FBQ0E7SUFDQ0MsSUFBSSxFQUFFLGVBSjZFOztJQUtuRjtBQUNEO0FBQ0E7QUFDQTtJQUNDQyxTQUFTLEVBQUUsZUFUd0U7O0lBVW5GO0FBQ0Q7QUFDQTtJQUNDQyxRQUFRLEVBQUUsdUNBYnlFOztJQWNuRjtBQUNEO0FBQ0E7SUFDQ0MsUUFBUSxFQUFFO01BQ1Q7QUFDRjtBQUNBO01BQ0VDLFVBQVUsRUFBRSxVQUpIOztNQUtUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUUsa0RBUkg7O01BU1Q7QUFDRjtBQUNBO01BQ0VDLFVBQVUsRUFBRTtRQUNYO0FBQ0g7QUFDQTtBQUNBO1FBQ0dDLFVBQVUsRUFBRTtVQUNYQyxJQUFJLEVBQUU7UUFESyxDQUxEO1FBUVhDLFNBQVMsRUFBRTtVQUNWRCxJQUFJLEVBQUUsc0JBREk7VUFFVkUsUUFBUSxFQUFFLElBRkE7VUFHVkMsS0FBSyxFQUFFLFVBSEc7VUFJVkMsS0FBSyxFQUFFLENBQ04sc0NBRE0sRUFFTiw2Q0FGTSxFQUdOLG1EQUhNLEVBSU4sMENBSk07UUFKRyxDQVJBO1FBbUJYQyxjQUFjLEVBQUU7VUFDZkwsSUFB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