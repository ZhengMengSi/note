/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core"], function (Core) {
  "use strict";

  var oResourceBundle = Core.getLibraryResourceBundle("sap.fe.templates");
  var StashableHBoxDesignTime = {
    actions: {
      remove: {
        changeType: "stashControl"
      },
      reveal: {
        changeType: "unstashControl"
      },
      rename: function
        /*oHeaderFacet: any*/
      () {
        return {
          changeType: "renameHeaderFacet",
          domRef: function (oControl) {
            var oTitleControl = oControl.getTitleControl();

            if (oTitleControl) {
              return oTitleControl.getDomRef();
            } else {
              return null;
            }
          }
        };
      }
    },
    name: {
      singular: function () {
        return oResourceBundle.getText("T_STASHABLE_HBOX_RTA_HEADERFACET_MENU_ADD");
      },
      plural: function () {
        return oResourceBundle.getText("T_STASHABLE_HBOX_RTA_HEADERFACET_MENU_ADD_PLURAL");
      }
    },
    palette: {
      group: "LAYOUT",
      icons: {
        svg: "sap/m/designtime/HBox.icon.svg"
      }
    },
    templates: {
      create: "sap/m/designtime/HBox.create.fragment.xml"
    }
  };
  return StashableHBoxDesignTime;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvUmVzb3VyY2VCdW5kbGUiLCJDb3JlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiU3Rhc2hhYmxlSEJveERlc2lnblRpbWUiLCJhY3Rpb25zIiwicmVtb3ZlIiwiY2hhbmdlVHlwZSIsInJldmVhbCIsInJlbmFtZSIsImRvbVJlZiIsIm9Db250cm9sIiwib1RpdGxlQ29udHJvbCIsImdldFRpdGxlQ29udHJvbCIsImdldERvbVJlZiIsIm5hbWUiLCJzaW5ndWxhciIsImdldFRleHQiLCJwbHVyYWwiLCJwYWxldHRlIiwiZ3JvdXAiLCJpY29ucyIsInN2ZyIsInRlbXBsYXRlcyIsImNyZWF0ZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU3Rhc2hhYmxlSEJveC5kZXNpZ250aW1lLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5cbmNvbnN0IG9SZXNvdXJjZUJ1bmRsZSA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLnRlbXBsYXRlc1wiKTtcblxuY29uc3QgU3Rhc2hhYmxlSEJveERlc2lnblRpbWUgPSB7XG5cdGFjdGlvbnM6IHtcblx0XHRyZW1vdmU6IHtcblx0XHRcdGNoYW5nZVR5cGU6IFwic3Rhc2hDb250cm9sXCJcblx0XHR9LFxuXHRcdHJldmVhbDoge1xuXHRcdFx0Y2hhbmdlVHlwZTogXCJ1bnN0YXNoQ29udHJvbFwiXG5cdFx0fSxcblx0XHRyZW5hbWU6IGZ1bmN0aW9uICgvKm9IZWFkZXJGYWNldDogYW55Ki8pIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNoYW5nZVR5cGU6IFwicmVuYW1lSGVhZGVyRmFjZXRcIixcblx0XHRcdFx0ZG9tUmVmOiBmdW5jdGlvbiAob0NvbnRyb2w6IGFueSkge1xuXHRcdFx0XHRcdGNvbnN0IG9UaXRsZUNvbnRyb2wgPSBvQ29udHJvbC5nZXRUaXRsZUNvbnRyb2woKTtcblx0XHRcdFx0XHRpZiAob1RpdGxlQ29udHJvbCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9UaXRsZUNvbnRyb2wuZ2V0RG9tUmVmKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0sXG5cdG5hbWU6IHtcblx0XHRzaW5ndWxhcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9TVEFTSEFCTEVfSEJPWF9SVEFfSEVBREVSRkFDRVRfTUVOVV9BRERcIik7XG5cdFx0fSxcblx0XHRwbHVyYWw6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfU1RBU0hBQkxFX0hCT1hfUlRBX0hFQURFUkZBQ0VUX01FTlVfQUREX1BMVVJBTFwiKTtcblx0XHR9XG5cdH0sXG5cdHBhbGV0dGU6IHtcblx0XHRncm91cDogXCJMQVlPVVRcIixcblx0XHRpY29uczoge1xuXHRcdFx0c3ZnOiBcInNhcC9tL2Rlc2lnbnRpbWUvSEJveC5pY29uLnN2Z1wiXG5cdFx0fVxuXHR9LFxuXHR0ZW1wbGF0ZXM6IHtcblx0XHRjcmVhdGU6IFwic2FwL20vZGVzaWdudGltZS9IQm94LmNyZWF0ZS5mcmFnbWVudC54bWxcIlxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGFzaGFibGVIQm94RGVzaWduVGltZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQUVBLElBQU1BLGVBQWUsR0FBR0MsSUFBSSxDQUFDQyx3QkFBTCxDQUE4QixrQkFBOUIsQ0FBeEI7RUFFQSxJQUFNQyx1QkFBdUIsR0FBRztJQUMvQkMsT0FBTyxFQUFFO01BQ1JDLE1BQU0sRUFBRTtRQUNQQyxVQUFVLEVBQUU7TUFETCxDQURBO01BSVJDLE1BQU0sRUFBRTtRQUNQRCxVQUFVLEVBQUU7TUFETCxDQUpBO01BT1JFLE1BQU0sRUFBRTtRQUFVO01BQVYsR0FBaUM7UUFDeEMsT0FBTztVQUNORixVQUFVLEVBQUUsbUJBRE47VUFFTkcsTUFBTSxFQUFFLFVBQVVDLFFBQVYsRUFBeUI7WUFDaEMsSUFBTUMsYUFBYSxHQUFHRCxRQUFRLENBQUNFLGVBQVQsRUFBdEI7O1lBQ0EsSUFBSUQsYUFBSixFQUFtQjtjQUNsQixPQUFPQSxhQUFhLENBQUNFLFNBQWQsRUFBUDtZQUNBLENBRkQsTUFFTztjQUNOLE9BQU8sSUFBUDtZQUNBO1VBQ0Q7UUFUSyxDQUFQO01BV0E7SUFuQk8sQ0FEc0I7SUFzQi9CQyxJQUFJLEVBQUU7TUFDTEMsUUFBUSxFQUFFLFlBQVk7UUFDckIsT0FBT2YsZUFBZSxDQUFDZ0IsT0FBaEIsQ0FBd0IsMkNBQXhCLENBQVA7TUFDQSxDQUhJO01BSUxDLE1BQU0sRUFBRSxZQUFZO1FBQ25CLE9BQU9qQixlQUFlLENBQUNnQixPQUFoQixDQUF3QixrREFBeEIsQ0FBUDtNQUNBO0lBTkksQ0F0QnlCO0lBOEIvQkUsT0FBTyxFQUFFO01BQ1JDLEtBQUssRUFBRSxRQURDO01BRVJDLEtBQUssRUFBRTtRQUNOQyxHQUFHLEVBQUU7TUFEQztJQUZDLENBOUJzQjtJQW9DL0JDLFNBQVMsRUFBRTtNQUNWQyxNQUFNLEVBQUU7SUFERTtFQXBDb0IsQ0FBaEM7U0F5Q2VwQix1QiJ9