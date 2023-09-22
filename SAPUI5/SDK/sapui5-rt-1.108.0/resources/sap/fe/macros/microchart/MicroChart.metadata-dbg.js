/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/MacroMetadata"], function (MacroMetadata) {
  "use strict";

  /**
   * @classdesc
   * Building block used to create a MicroChart based on the metadata provided by OData V4.
   * @class sap.fe.macros.MicroChart
   * @hideconstructor
   * @public
   * @since 1.93.0
   */
  var MicroChart = MacroMetadata.extend("sap.fe.macros.microchart.MicroChart", {
    /**
     * Name of the macro control.
     */
    name: "MicroChart",

    /**
     * Namespace of the macro control.
     */
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",

    /**
     * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name.
     */
    fragment: "sap.fe.macros.microchart.MicroChart",

    /**
     * The metadata describing the macro control.
     */
    metadata: {
      /**
       * Macro stereotype for documentation generation. Not visible in documentation.
       */
      stereotype: "xmlmacro",

      /**
       * Properties.
       */
      properties: {
        /**
         * Metadata path to the entitySet or navigationProperty.
         */
        contextPath: {
          type: "sap.ui.model.Context",
          $kind: ["EntitySet", "NavigationProperty"],
          isPublic: true
        },

        /**
         * Metadata path to the Chart annotations.
         */
        metaPath: {
          type: "sap.ui.model.Context",
          required: true,
          isPublic: true
        },

        /**
         * ID of the MicroChart.
         */
        id: {
          type: "string",
          isPublic: true,
          required: true
        },

        /**
         * To control the rendering of Title, Subtitle and Currency Labels. When the size is xs then we do
         * not see the inner labels of the MicroChart as well.
         */
        showOnlyChart: {
          type: "boolean",
          defaultValue: false,
          isPublic: true
        },

        /**
         * Batch group ID along with which this call should be grouped.
         */
        batchGroupId: {
          type: "string",
          defaultValue: "",
          isPublic: true
        },

        /**
         * Title for the MicroChart. If no title is provided, the title from the Chart annotation is used.
         */
        title: {
          type: "string",
          defaultValue: "",
          visibility: "hidden"
        },

        /**
         * Show blank space in case there is no data in the chart
         */
        hideOnNoData: {
          type: "boolean",
          defaultValue: false,
          isPublic: true
        },

        /**
         * Description for the MicroChart. If no description is provided, the description from the Chart annotation is used.
         */
        description: {
          type: "string",
          defaultValue: "",
          visibility: "hidden"
        },

        /**
         * Type of navigation, that is, External or InPage
         */
        navigationType: {
          type: "sap.fe.macros.NavigationType",
          defaultValue: "None",
          visibility: "hidden"
        },

        /**
         * Event handler for onTitlePressed event
         */
        onTitlePressed: {
          type: "string",
          visibility: "hidden"
        },

        /**
         * Size of the MicroChart
         */
        size: {
          type: "string",
          isPublic: true
        },

        /**
         * Defines whether the MicroChart is part of an analytical table
         */
        isAnalytics: {
          type: "boolean",
          defaultValue: false,
          visibility: "hidden"
        }
      },
      events: {}
    }
  });
  return MicroChart;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNaWNyb0NoYXJ0IiwiTWFjcm9NZXRhZGF0YSIsImV4dGVuZCIsIm5hbWUiLCJuYW1lc3BhY2UiLCJwdWJsaWNOYW1lc3BhY2UiLCJmcmFnbWVudCIsIm1ldGFkYXRhIiwic3RlcmVvdHlwZSIsInByb3BlcnRpZXMiLCJjb250ZXh0UGF0aCIsInR5cGUiLCIka2luZCIsImlzUHVibGljIiwibWV0YVBhdGgiLCJyZXF1aXJlZCIsImlkIiwic2hvd09ubHlDaGFydCIsImRlZmF1bHRWYWx1ZSIsImJhdGNoR3JvdXBJZCIsInRpdGxlIiwidmlzaWJpbGl0eSIsImhpZGVPbk5vRGF0YSIsImRlc2NyaXB0aW9uIiwibmF2aWdhdGlvblR5cGUiLCJvblRpdGxlUHJlc3NlZCIsInNpemUiLCJpc0FuYWx5dGljcyIsImV2ZW50cyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiTWljcm9DaGFydC5tZXRhZGF0YS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFjcm9NZXRhZGF0YSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9NYWNyb01ldGFkYXRhXCI7XG5cbi8qKlxuICogQGNsYXNzZGVzY1xuICogQnVpbGRpbmcgYmxvY2sgdXNlZCB0byBjcmVhdGUgYSBNaWNyb0NoYXJ0IGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSBWNC5cbiAqIEBjbGFzcyBzYXAuZmUubWFjcm9zLk1pY3JvQ2hhcnRcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzaW5jZSAxLjkzLjBcbiAqL1xuY29uc3QgTWljcm9DaGFydCA9IE1hY3JvTWV0YWRhdGEuZXh0ZW5kKFwic2FwLmZlLm1hY3Jvcy5taWNyb2NoYXJ0Lk1pY3JvQ2hhcnRcIiwge1xuXHQvKipcblx0ICogTmFtZSBvZiB0aGUgbWFjcm8gY29udHJvbC5cblx0ICovXG5cdG5hbWU6IFwiTWljcm9DaGFydFwiLFxuXHQvKipcblx0ICogTmFtZXNwYWNlIG9mIHRoZSBtYWNybyBjb250cm9sLlxuXHQgKi9cblx0bmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIixcblx0cHVibGljTmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3NcIixcblx0LyoqXG5cdCAqIEZyYWdtZW50IHNvdXJjZSBvZiB0aGUgbWFjcm8gKG9wdGlvbmFsKSAtIGlmIG5vdCBzZXQsIGZyYWdtZW50IGlzIGdlbmVyYXRlZCBmcm9tIG5hbWVzcGFjZSBhbmQgbmFtZS5cblx0ICovXG5cdGZyYWdtZW50OiBcInNhcC5mZS5tYWNyb3MubWljcm9jaGFydC5NaWNyb0NoYXJ0XCIsXG5cblx0LyoqXG5cdCAqIFRoZSBtZXRhZGF0YSBkZXNjcmliaW5nIHRoZSBtYWNybyBjb250cm9sLlxuXHQgKi9cblx0bWV0YWRhdGE6IHtcblx0XHQvKipcblx0XHQgKiBNYWNybyBzdGVyZW90eXBlIGZvciBkb2N1bWVudGF0aW9uIGdlbmVyYXRpb24uIE5vdCB2aXNpYmxlIGluIGRvY3VtZW50YXRpb24uXG5cdFx0ICovXG5cdFx0c3RlcmVvdHlwZTogXCJ4bWxtYWNyb1wiLFxuXHRcdC8qKlxuXHRcdCAqIFByb3BlcnRpZXMuXG5cdFx0ICovXG5cdFx0cHJvcGVydGllczoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBNZXRhZGF0YSBwYXRoIHRvIHRoZSBlbnRpdHlTZXQgb3IgbmF2aWdhdGlvblByb3BlcnR5LlxuXHRcdFx0ICovXG5cdFx0XHRjb250ZXh0UGF0aDoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdCRraW5kOiBbXCJFbnRpdHlTZXRcIiwgXCJOYXZpZ2F0aW9uUHJvcGVydHlcIl0sXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBNZXRhZGF0YSBwYXRoIHRvIHRoZSBDaGFydCBhbm5vdGF0aW9ucy5cblx0XHRcdCAqL1xuXHRcdFx0bWV0YVBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIElEIG9mIHRoZSBNaWNyb0NoYXJ0LlxuXHRcdFx0ICovXG5cdFx0XHRpZDoge1xuXHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZSxcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFRvIGNvbnRyb2wgdGhlIHJlbmRlcmluZyBvZiBUaXRsZSwgU3VidGl0bGUgYW5kIEN1cnJlbmN5IExhYmVscy4gV2hlbiB0aGUgc2l6ZSBpcyB4cyB0aGVuIHdlIGRvXG5cdFx0XHQgKiBub3Qgc2VlIHRoZSBpbm5lciBsYWJlbHMgb2YgdGhlIE1pY3JvQ2hhcnQgYXMgd2VsbC5cblx0XHRcdCAqL1xuXHRcdFx0c2hvd09ubHlDaGFydDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZSxcblx0XHRcdFx0aXNQdWJsaWM6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEJhdGNoIGdyb3VwIElEIGFsb25nIHdpdGggd2hpY2ggdGhpcyBjYWxsIHNob3VsZCBiZSBncm91cGVkLlxuXHRcdFx0ICovXG5cdFx0XHRiYXRjaEdyb3VwSWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBcIlwiLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogVGl0bGUgZm9yIHRoZSBNaWNyb0NoYXJ0LiBJZiBubyB0aXRsZSBpcyBwcm92aWRlZCwgdGhlIHRpdGxlIGZyb20gdGhlIENoYXJ0IGFubm90YXRpb24gaXMgdXNlZC5cblx0XHRcdCAqL1xuXHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBcIlwiLFxuXHRcdFx0XHR2aXNpYmlsaXR5OiBcImhpZGRlblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBTaG93IGJsYW5rIHNwYWNlIGluIGNhc2UgdGhlcmUgaXMgbm8gZGF0YSBpbiB0aGUgY2hhcnRcblx0XHRcdCAqL1xuXHRcdFx0aGlkZU9uTm9EYXRhOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlLFxuXHRcdFx0XHRpc1B1YmxpYzogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRGVzY3JpcHRpb24gZm9yIHRoZSBNaWNyb0NoYXJ0LiBJZiBubyBkZXNjcmlwdGlvbiBpcyBwcm92aWRlZCwgdGhlIGRlc2NyaXB0aW9uIGZyb20gdGhlIENoYXJ0IGFubm90YXRpb24gaXMgdXNlZC5cblx0XHRcdCAqL1xuXHRcdFx0ZGVzY3JpcHRpb246IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBcIlwiLFxuXHRcdFx0XHR2aXNpYmlsaXR5OiBcImhpZGRlblwiXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBUeXBlIG9mIG5hdmlnYXRpb24sIHRoYXQgaXMsIEV4dGVybmFsIG9yIEluUGFnZVxuXHRcdFx0ICovXG5cdFx0XHRuYXZpZ2F0aW9uVHlwZToge1xuXHRcdFx0XHR0eXBlOiBcInNhcC5mZS5tYWNyb3MuTmF2aWdhdGlvblR5cGVcIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBcIk5vbmVcIixcblx0XHRcdFx0dmlzaWJpbGl0eTogXCJoaWRkZW5cIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRXZlbnQgaGFuZGxlciBmb3Igb25UaXRsZVByZXNzZWQgZXZlbnRcblx0XHRcdCAqL1xuXHRcdFx0b25UaXRsZVByZXNzZWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0dmlzaWJpbGl0eTogXCJoaWRkZW5cIlxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogU2l6ZSBvZiB0aGUgTWljcm9DaGFydFxuXHRcdFx0ICovXG5cdFx0XHRzaXplOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdGlzUHVibGljOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBEZWZpbmVzIHdoZXRoZXIgdGhlIE1pY3JvQ2hhcnQgaXMgcGFydCBvZiBhbiBhbmFseXRpY2FsIHRhYmxlXG5cdFx0XHQgKi9cblx0XHRcdGlzQW5hbHl0aWNzOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlLFxuXHRcdFx0XHR2aXNpYmlsaXR5OiBcImhpZGRlblwiXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGV2ZW50czoge31cblx0fVxufSk7XG5leHBvcnQgZGVmYXVsdCBNaWNyb0NoYXJ0O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNBLElBQU1BLFVBQVUsR0FBR0MsYUFBYSxDQUFDQyxNQUFkLENBQXFCLHFDQUFyQixFQUE0RDtJQUM5RTtBQUNEO0FBQ0E7SUFDQ0MsSUFBSSxFQUFFLFlBSndFOztJQUs5RTtBQUNEO0FBQ0E7SUFDQ0MsU0FBUyxFQUFFLHdCQVJtRTtJQVM5RUMsZUFBZSxFQUFFLGVBVDZEOztJQVU5RTtBQUNEO0FBQ0E7SUFDQ0MsUUFBUSxFQUFFLHFDQWJvRTs7SUFlOUU7QUFDRDtBQUNBO0lBQ0NDLFFBQVEsRUFBRTtNQUNUO0FBQ0Y7QUFDQTtNQUNFQyxVQUFVLEVBQUUsVUFKSDs7TUFLVDtBQUNGO0FBQ0E7TUFDRUMsVUFBVSxFQUFFO1FBQ1g7QUFDSDtBQUNBO1FBQ0dDLFdBQVcsRUFBRTtVQUNaQyxJQUFJLEVBQUUsc0JBRE07VUFFWkMsS0FBSyxFQUFFLENBQUMsV0FBRCxFQUFjLG9CQUFkLENBRks7VUFHWkMsUUFBUSxFQUFFO1FBSEUsQ0FKRjs7UUFTWDtBQUNIO0FBQ0E7UUFDR0MsUUFBUSxFQUFFO1VBQ1RILElBQUksRUFBRSxzQkFERztVQUVUSSxRQUFRLEVBQUUsSUFGRDtVQUdURixRQUFRLEVBQUU7UUFIRCxDQVpDOztRQWlCWDtBQUNIO0FBQ0E7UUFDR0csRUFBRSxFQUFFO1VBQ0hMLElBQUksRUFBRSxRQURIO1VBRUhFLFFBQVEsRUFBRSxJQUZQO1VBR0hFLFFBQVEsRUFBRTtRQUhQLENBcEJPOztRQXlCWDtBQUNIO0FBQ0E7QUFDQTtRQUNHRSxhQUFhLEVBQUU7VUFDZE4sSUFBSSxFQUFFLFNBRFE7VUFFZE8sWUFBWSxFQUFFLEtBRkE7VUFHZEwsUUFBUSxFQUFFO1FBSEksQ0E3Qko7O1FBa0NYO0FBQ0g7QUFDQTtRQUNHTSxZQUFZLEVBQUU7VUFDYlIsSUFBSSxFQUFFLFFBRE87VUFFYk8sWUFBWSxFQUFFLEVBRkQ7VUFHYkwsUUFBUSxFQUFFO1FBSEcsQ0FyQ0g7O1FBMENYO0FBQ0g7QUFDQTtRQUNHTyxLQUFLLEVBQUU7VUFDTlQsSUFBSSxFQUFFLFFBREE7VUFFTk8sWUFBWSxFQUFFLEVBRlI7VUFHTkcsVUFBVSxFQUFFO1FBSE4sQ0E3Q0k7O1FBa0RYO0FBQ0g7QUFDQTtRQUNHQyxZQUFZLEVBQUU7VUFDYlgsSUFBSSxFQUFFLFNBRE87VUFFYk8sWUFBWSxFQUFFLEtBRkQ7VUFHYkwsUUFBUSxFQUFFO1FBSEcsQ0FyREg7O1FBMERYO0FBQ0g7QUFDQTtRQUNHVSxXQUFXLEVBQUU7VUFDWlosSUFBSSxFQUFFLFFBRE07VUFFWk8sWUFBWSxFQUFFLEVBRkY7VUFHWkcsVUFBVSxFQUFFO1FBSEEsQ0E3REY7O1FBa0VYO0FBQ0g7QUFDQTtRQUNHRyxjQUFjLEVBQUU7VUFDZmIsSUFBSSxFQUFFLDhCQURTO1VBRWZPLFlBQVksRUFBRSxNQUZDO1VBR2ZHLFVBQVUsRUFBRTtRQUhHLENBckVMOztRQTBFWDtBQUNIO0FBQ0E7UUFDR0ksY0FBYyxFQUFFO1VBQ2ZkLElBQUksRUFBRSxRQURTO1VBRWZVLFVBQVUsRUFBRTtRQUZHLENBN0VMOztRQWlGWDtBQUNIO0FBQ0E7UUFDR0ssSUFBSSxFQUFFO1VBQ0xmLElBQUksRUFBRSxRQUREO1VBRUxFLFFBQVEsRUFBRTtRQUZMLENBcEZLOztRQXdGWDtBQUNIO0FBQ0E7UUFDR2MsV0FBVyxFQUFFO1VBQ1poQixJQUFJLEVBQUUsU0FETTtVQUVaTyxZQUFZLEVBQUUsS0FGRjtVQUdaRyxVQUFVLEVBQUU7UUFIQTtNQTNGRixDQVJIO01BMEdUTyxNQUFNLEVBQUU7SUExR0M7RUFsQm9FLENBQTVELENBQW5CO1NBK0hlNUIsVSJ9