/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/macros/library", "sap/fe/macros/ResourceModel", "sap/ui/core/Fragment", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/model/json/JSONModel"], function (Log, library, ResourceModel, Fragment, XMLPreprocessor, XMLTemplateProcessor, JSONModel) {
  "use strict";

  var DraftIndicatorState = library.DraftIndicatorState;

  function _getParentViewOfControl(oControl) {
    while (oControl && !(oControl.getMetadata().getName() === "sap.ui.core.mvc.XMLView")) {
      oControl = oControl.getParent();
    }

    return oControl;
  }

  var DraftIndicatorHelper = {
    mDraftPopovers: undefined,

    /**
     *
     * @function to be executed on click of the close button of the draft admin data popover
     * @name closeDraftAdminPopover
     * @param oEvent Event instance
     */
    closeDraftAdminPopover: function (oEvent) {
      // for now go up two levels to get the popover instance
      oEvent.getSource().getParent().getParent().close();
    },

    /**
     * @function
     * @name onDraftLinkPressed
     * @param oEvent Event object passed from the click event
     * @param sEntitySet Name of the entity set for on the fly templating
     * @param pType Name of the page on which popup is being created
     */
    onDraftLinkPressed: function (oEvent, sEntitySet, pType) {
      var _this = this;

      var oSource = oEvent.getSource(),
          oView = _getParentViewOfControl(oSource),
          oBindingContext = oSource.getBindingContext(),
          oMetaModel = oBindingContext.getModel().getMetaModel(),
          sViewId = oView.getId();

      this.mDraftPopovers = this.mDraftPopovers || {};
      this.mDraftPopovers[sViewId] = this.mDraftPopovers[sViewId] || {};
      var oDraftPopover = this.mDraftPopovers[sViewId][sEntitySet];

      if (oDraftPopover) {
        oDraftPopover.setBindingContext(oBindingContext);
        oDraftPopover.openBy(oSource);
      } else {
        var oModel = new JSONModel({
          bIndicatorType: pType
        }); // oDraftPopover.

        var sFragmentName = "sap.fe.macros.field.DraftPopOverAdminData",
            oPopoverFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
        Promise.resolve(XMLPreprocessor.process(oPopoverFragment, {
          name: sFragmentName
        }, {
          bindingContexts: {
            entityType: oMetaModel.createBindingContext("/".concat(sEntitySet, "/$Type")),
            prop: oModel.createBindingContext("/")
          },
          models: {
            entityType: oMetaModel,
            metaModel: oMetaModel,
            prop: oModel
          }
        })).then(function (oFragment) {
          return Fragment.load({
            definition: oFragment,
            controller: _this
          });
        }).then(function (oPopover) {
          oPopover.setModel(ResourceModel.getModel(), "i18n");
          oView.addDependent(oPopover);
          oPopover.setBindingContext(oBindingContext);
          oPopover.setModel(oModel, "prop");
          _this.mDraftPopovers[sViewId][sEntitySet] = oPopover;
          oPopover.openBy(oSource); // ensure to remove the reference to the draft popover as it would be destroyed on exit

          oView.attachEventOnce("beforeExit", function () {
            delete _this.mDraftPopovers;
          });
        }).catch(function (oError) {
          Log.error("Error while opening the draft popup", oError);
        });
      }
    },

    /**
     * @function
     * @name getVisible
     * @param bIsActiveEntity A boolean to check if the entry is active or not
     * @param oLastChangedDateTime The last change time stamp info
     * @param sIndicatorType The type of draft indicator to be rendered
     * @returns Whether a text or vbox to be rendered
     */
    getVisible: function (bIsActiveEntity, oLastChangedDateTime, sIndicatorType) {
      if (!bIsActiveEntity && !oLastChangedDateTime && sIndicatorType == DraftIndicatorState.NoChanges) {
        return true;
      } else if (!bIsActiveEntity && oLastChangedDateTime && sIndicatorType == DraftIndicatorState.WithChanges) {
        return true;
      } else if (bIsActiveEntity && oLastChangedDateTime && sIndicatorType == DraftIndicatorState.Active) {
        return true;
      } else {
        return false;
      }
    }
  };
  return DraftIndicatorHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEcmFmdEluZGljYXRvclN0YXRlIiwibGlicmFyeSIsIl9nZXRQYXJlbnRWaWV3T2ZDb250cm9sIiwib0NvbnRyb2wiLCJnZXRNZXRhZGF0YSIsImdldE5hbWUiLCJnZXRQYXJlbnQiLCJEcmFmdEluZGljYXRvckhlbHBlciIsIm1EcmFmdFBvcG92ZXJzIiwidW5kZWZpbmVkIiwiY2xvc2VEcmFmdEFkbWluUG9wb3ZlciIsIm9FdmVudCIsImdldFNvdXJjZSIsImNsb3NlIiwib25EcmFmdExpbmtQcmVzc2VkIiwic0VudGl0eVNldCIsInBUeXBlIiwib1NvdXJjZSIsIm9WaWV3Iiwib0JpbmRpbmdDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJvTWV0YU1vZGVsIiwiZ2V0TW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzVmlld0lkIiwiZ2V0SWQiLCJvRHJhZnRQb3BvdmVyIiwic2V0QmluZGluZ0NvbnRleHQiLCJvcGVuQnkiLCJvTW9kZWwiLCJKU09OTW9kZWwiLCJiSW5kaWNhdG9yVHlwZSIsInNGcmFnbWVudE5hbWUiLCJvUG9wb3ZlckZyYWdtZW50IiwiWE1MVGVtcGxhdGVQcm9jZXNzb3IiLCJsb2FkVGVtcGxhdGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJuYW1lIiwiYmluZGluZ0NvbnRleHRzIiwiZW50aXR5VHlwZSIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwicHJvcCIsIm1vZGVscyIsIm1ldGFNb2RlbCIsInRoZW4iLCJvRnJhZ21lbnQiLCJGcmFnbWVudCIsImxvYWQiLCJkZWZpbml0aW9uIiwiY29udHJvbGxlciIsIm9Qb3BvdmVyIiwic2V0TW9kZWwiLCJSZXNvdXJjZU1vZGVsIiwiYWRkRGVwZW5kZW50IiwiYXR0YWNoRXZlbnRPbmNlIiwiY2F0Y2giLCJvRXJyb3IiLCJMb2ciLCJlcnJvciIsImdldFZpc2libGUiLCJiSXNBY3RpdmVFbnRpdHkiLCJvTGFzdENoYW5nZWREYXRlVGltZSIsInNJbmRpY2F0b3JUeXBlIiwiTm9DaGFuZ2VzIiwiV2l0aENoYW5nZXMiLCJBY3RpdmUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkRyYWZ0SW5kaWNhdG9yUnVudGltZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBsaWJyYXJ5IGZyb20gXCJzYXAvZmUvbWFjcm9zL2xpYnJhcnlcIjtcbmltcG9ydCBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvZmUvbWFjcm9zL1Jlc291cmNlTW9kZWxcIjtcbmltcG9ydCB0eXBlIFBvcG92ZXIgZnJvbSBcInNhcC9tL1BvcG92ZXJcIjtcbmltcG9ydCB0eXBlIEV2ZW50IGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IEZyYWdtZW50IGZyb20gXCJzYXAvdWkvY29yZS9GcmFnbWVudFwiO1xuaW1wb3J0IFhNTFByZXByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbC9YTUxQcmVwcm9jZXNzb3JcIjtcbmltcG9ydCBYTUxUZW1wbGF0ZVByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvWE1MVGVtcGxhdGVQcm9jZXNzb3JcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L0NvbnRleHRcIjtcblxuY29uc3QgRHJhZnRJbmRpY2F0b3JTdGF0ZSA9IGxpYnJhcnkuRHJhZnRJbmRpY2F0b3JTdGF0ZTtcblxuZnVuY3Rpb24gX2dldFBhcmVudFZpZXdPZkNvbnRyb2wob0NvbnRyb2w6IGFueSkge1xuXHR3aGlsZSAob0NvbnRyb2wgJiYgIShvQ29udHJvbC5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSA9PT0gXCJzYXAudWkuY29yZS5tdmMuWE1MVmlld1wiKSkge1xuXHRcdG9Db250cm9sID0gb0NvbnRyb2wuZ2V0UGFyZW50KCk7XG5cdH1cblx0cmV0dXJuIG9Db250cm9sO1xufVxuXG5jb25zdCBEcmFmdEluZGljYXRvckhlbHBlciA9IHtcblx0bURyYWZ0UG9wb3ZlcnM6IHVuZGVmaW5lZCBhcyBhbnksXG5cdC8qKlxuXHQgKlxuXHQgKiBAZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb24gY2xpY2sgb2YgdGhlIGNsb3NlIGJ1dHRvbiBvZiB0aGUgZHJhZnQgYWRtaW4gZGF0YSBwb3BvdmVyXG5cdCAqIEBuYW1lIGNsb3NlRHJhZnRBZG1pblBvcG92ZXJcblx0ICogQHBhcmFtIG9FdmVudCBFdmVudCBpbnN0YW5jZVxuXHQgKi9cblx0Y2xvc2VEcmFmdEFkbWluUG9wb3ZlcjogZnVuY3Rpb24gKG9FdmVudDogRXZlbnQpIHtcblx0XHQvLyBmb3Igbm93IGdvIHVwIHR3byBsZXZlbHMgdG8gZ2V0IHRoZSBwb3BvdmVyIGluc3RhbmNlXG5cdFx0KChvRXZlbnQuZ2V0U291cmNlKCkgYXMgQ29udHJvbCkuZ2V0UGFyZW50KCkuZ2V0UGFyZW50KCkgYXMgUG9wb3ZlcikuY2xvc2UoKTtcblx0fSxcblxuXHQvKipcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIG9uRHJhZnRMaW5rUHJlc3NlZFxuXHQgKiBAcGFyYW0gb0V2ZW50IEV2ZW50IG9iamVjdCBwYXNzZWQgZnJvbSB0aGUgY2xpY2sgZXZlbnRcblx0ICogQHBhcmFtIHNFbnRpdHlTZXQgTmFtZSBvZiB0aGUgZW50aXR5IHNldCBmb3Igb24gdGhlIGZseSB0ZW1wbGF0aW5nXG5cdCAqIEBwYXJhbSBwVHlwZSBOYW1lIG9mIHRoZSBwYWdlIG9uIHdoaWNoIHBvcHVwIGlzIGJlaW5nIGNyZWF0ZWRcblx0ICovXG5cdG9uRHJhZnRMaW5rUHJlc3NlZDogZnVuY3Rpb24gKG9FdmVudDogRXZlbnQsIHNFbnRpdHlTZXQ6IHN0cmluZywgcFR5cGU6IHN0cmluZykge1xuXHRcdGNvbnN0IG9Tb3VyY2UgPSBvRXZlbnQuZ2V0U291cmNlKCkgYXMgQ29udHJvbCxcblx0XHRcdG9WaWV3ID0gX2dldFBhcmVudFZpZXdPZkNvbnRyb2wob1NvdXJjZSksXG5cdFx0XHRvQmluZGluZ0NvbnRleHQgPSBvU291cmNlLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dCxcblx0XHRcdG9NZXRhTW9kZWwgPSBvQmluZGluZ0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdHNWaWV3SWQgPSBvVmlldy5nZXRJZCgpO1xuXG5cdFx0dGhpcy5tRHJhZnRQb3BvdmVycyA9IHRoaXMubURyYWZ0UG9wb3ZlcnMgfHwge307XG5cdFx0dGhpcy5tRHJhZnRQb3BvdmVyc1tzVmlld0lkXSA9IHRoaXMubURyYWZ0UG9wb3ZlcnNbc1ZpZXdJZF0gfHwge307XG5cdFx0Y29uc3Qgb0RyYWZ0UG9wb3ZlciA9IHRoaXMubURyYWZ0UG9wb3ZlcnNbc1ZpZXdJZF1bc0VudGl0eVNldF07XG5cblx0XHRpZiAob0RyYWZ0UG9wb3Zlcikge1xuXHRcdFx0b0RyYWZ0UG9wb3Zlci5zZXRCaW5kaW5nQ29udGV4dChvQmluZGluZ0NvbnRleHQpO1xuXHRcdFx0b0RyYWZ0UG9wb3Zlci5vcGVuQnkob1NvdXJjZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IG9Nb2RlbCA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0XHRiSW5kaWNhdG9yVHlwZTogcFR5cGVcblx0XHRcdH0pO1xuXHRcdFx0Ly8gb0RyYWZ0UG9wb3Zlci5cblx0XHRcdGNvbnN0IHNGcmFnbWVudE5hbWUgPSBcInNhcC5mZS5tYWNyb3MuZmllbGQuRHJhZnRQb3BPdmVyQWRtaW5EYXRhXCIsXG5cdFx0XHRcdG9Qb3BvdmVyRnJhZ21lbnQgPSBYTUxUZW1wbGF0ZVByb2Nlc3Nvci5sb2FkVGVtcGxhdGUoc0ZyYWdtZW50TmFtZSwgXCJmcmFnbWVudFwiKTtcblxuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKFxuXHRcdFx0XHRYTUxQcmVwcm9jZXNzb3IucHJvY2Vzcyhcblx0XHRcdFx0XHRvUG9wb3ZlckZyYWdtZW50LFxuXHRcdFx0XHRcdHsgbmFtZTogc0ZyYWdtZW50TmFtZSB9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGJpbmRpbmdDb250ZXh0czoge1xuXHRcdFx0XHRcdFx0XHRlbnRpdHlUeXBlOiBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KGAvJHtzRW50aXR5U2V0fS8kVHlwZWApLFxuXHRcdFx0XHRcdFx0XHRwcm9wOiBvTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bW9kZWxzOiB7XG5cdFx0XHRcdFx0XHRcdGVudGl0eVR5cGU6IG9NZXRhTW9kZWwsXG5cdFx0XHRcdFx0XHRcdG1ldGFNb2RlbDogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRcdFx0cHJvcDogb01vZGVsXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0XHRcdC50aGVuKChvRnJhZ21lbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBGcmFnbWVudC5sb2FkKHsgZGVmaW5pdGlvbjogb0ZyYWdtZW50LCBjb250cm9sbGVyOiB0aGlzIH0pO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbigob1BvcG92ZXI6IGFueSkgPT4ge1xuXHRcdFx0XHRcdG9Qb3BvdmVyLnNldE1vZGVsKFJlc291cmNlTW9kZWwuZ2V0TW9kZWwoKSwgXCJpMThuXCIpO1xuXHRcdFx0XHRcdG9WaWV3LmFkZERlcGVuZGVudChvUG9wb3Zlcik7XG5cdFx0XHRcdFx0b1BvcG92ZXIuc2V0QmluZGluZ0NvbnRleHQob0JpbmRpbmdDb250ZXh0KTtcblx0XHRcdFx0XHRvUG9wb3Zlci5zZXRNb2RlbChvTW9kZWwsIFwicHJvcFwiKTtcblx0XHRcdFx0XHR0aGlzLm1EcmFmdFBvcG92ZXJzW3NWaWV3SWRdW3NFbnRpdHlTZXRdID0gb1BvcG92ZXI7XG5cdFx0XHRcdFx0b1BvcG92ZXIub3BlbkJ5KG9Tb3VyY2UpO1xuXHRcdFx0XHRcdC8vIGVuc3VyZSB0byByZW1vdmUgdGhlIHJlZmVyZW5jZSB0byB0aGUgZHJhZnQgcG9wb3ZlciBhcyBpdCB3b3VsZCBiZSBkZXN0cm95ZWQgb24gZXhpdFxuXHRcdFx0XHRcdG9WaWV3LmF0dGFjaEV2ZW50T25jZShcImJlZm9yZUV4aXRcIiwgKCkgPT4ge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMubURyYWZ0UG9wb3ZlcnM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBvcGVuaW5nIHRoZSBkcmFmdCBwb3B1cFwiLCBvRXJyb3IpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0VmlzaWJsZVxuXHQgKiBAcGFyYW0gYklzQWN0aXZlRW50aXR5IEEgYm9vbGVhbiB0byBjaGVjayBpZiB0aGUgZW50cnkgaXMgYWN0aXZlIG9yIG5vdFxuXHQgKiBAcGFyYW0gb0xhc3RDaGFuZ2VkRGF0ZVRpbWUgVGhlIGxhc3QgY2hhbmdlIHRpbWUgc3RhbXAgaW5mb1xuXHQgKiBAcGFyYW0gc0luZGljYXRvclR5cGUgVGhlIHR5cGUgb2YgZHJhZnQgaW5kaWNhdG9yIHRvIGJlIHJlbmRlcmVkXG5cdCAqIEByZXR1cm5zIFdoZXRoZXIgYSB0ZXh0IG9yIHZib3ggdG8gYmUgcmVuZGVyZWRcblx0ICovXG5cdGdldFZpc2libGU6IGZ1bmN0aW9uIChiSXNBY3RpdmVFbnRpdHk6IGJvb2xlYW4sIG9MYXN0Q2hhbmdlZERhdGVUaW1lOiBvYmplY3QsIHNJbmRpY2F0b3JUeXBlOiBzdHJpbmcpIHtcblx0XHRpZiAoIWJJc0FjdGl2ZUVudGl0eSAmJiAhb0xhc3RDaGFuZ2VkRGF0ZVRpbWUgJiYgc0luZGljYXRvclR5cGUgPT0gRHJhZnRJbmRpY2F0b3JTdGF0ZS5Ob0NoYW5nZXMpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoIWJJc0FjdGl2ZUVudGl0eSAmJiBvTGFzdENoYW5nZWREYXRlVGltZSAmJiBzSW5kaWNhdG9yVHlwZSA9PSBEcmFmdEluZGljYXRvclN0YXRlLldpdGhDaGFuZ2VzKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKGJJc0FjdGl2ZUVudGl0eSAmJiBvTGFzdENoYW5nZWREYXRlVGltZSAmJiBzSW5kaWNhdG9yVHlwZSA9PSBEcmFmdEluZGljYXRvclN0YXRlLkFjdGl2ZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IERyYWZ0SW5kaWNhdG9ySGVscGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBWUEsSUFBTUEsbUJBQW1CLEdBQUdDLE9BQU8sQ0FBQ0QsbUJBQXBDOztFQUVBLFNBQVNFLHVCQUFULENBQWlDQyxRQUFqQyxFQUFnRDtJQUMvQyxPQUFPQSxRQUFRLElBQUksRUFBRUEsUUFBUSxDQUFDQyxXQUFULEdBQXVCQyxPQUF2QixPQUFxQyx5QkFBdkMsQ0FBbkIsRUFBc0Y7TUFDckZGLFFBQVEsR0FBR0EsUUFBUSxDQUFDRyxTQUFULEVBQVg7SUFDQTs7SUFDRCxPQUFPSCxRQUFQO0VBQ0E7O0VBRUQsSUFBTUksb0JBQW9CLEdBQUc7SUFDNUJDLGNBQWMsRUFBRUMsU0FEWTs7SUFFNUI7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0NDLHNCQUFzQixFQUFFLFVBQVVDLE1BQVYsRUFBeUI7TUFDaEQ7TUFDRUEsTUFBTSxDQUFDQyxTQUFQLEVBQUQsQ0FBZ0NOLFNBQWhDLEdBQTRDQSxTQUE1QyxFQUFELENBQXFFTyxLQUFyRTtJQUNBLENBWDJCOztJQWE1QjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FB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