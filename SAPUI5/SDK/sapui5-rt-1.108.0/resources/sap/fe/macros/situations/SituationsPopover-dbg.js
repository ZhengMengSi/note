/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/macros/ResourceModel", "sap/fe/macros/situations/SituationsText", "sap/m/Button", "sap/m/CustomListItem", "sap/m/HBox", "sap/m/Label", "sap/m/List", "sap/m/ObjectIdentifier", "sap/m/ObjectStatus", "sap/m/ResponsivePopover", "sap/m/Text", "sap/m/Toolbar", "sap/m/VBox"], function (CommonUtils, BusyLocker, ResourceModel, SituationsText, Button, CustomListItem, HBox, Label, List, ObjectIdentifier, ObjectStatus, ResponsivePopover, Text, Toolbar, VBox) {
  "use strict";

  var _exports = {};
  var bindText = SituationsText.bindText;

  var showPopover = function (controller, event, situationsNavigationProperty) {
    try {
      function _temp9() {
        controller.getView().addDependent(popover);
        popover.openBy(currentSituationIndicator);
      }

      currentSituationIndicator = event.getSource();
      var bindingContext = currentSituationIndicator.getBindingContext(),
          numberOfSituations = bindingContext.getObject("".concat(situationsNavigationProperty, "/SitnNumberOfInstances"));
      var popover;
      var context = bindingContext.getModel().bindContext(situationsNavigationProperty, bindingContext, {
        $expand: "_Instance($expand=_InstanceAttribute($expand=_InstanceAttributeValue))"
      }).getBoundContext();

      var _temp10 = function () {
        if (numberOfSituations <= 1) {
          return Promise.resolve(createPreviewPopover(controller)).then(function (_createPreviewPopover2) {
            popover = _createPreviewPopover2;
            popover.setBindingContext(context);
            popover.bindElement({
              path: "_Instance/0"
            });
          });
        } else {
          popover = createListPopover(controller, numberOfSituations);
          popover.setBindingContext(context);
        }
      }();

      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.showPopover = showPopover;

  var createPreviewPopover = function (controller, back) {
    try {
      var toolBarContent = [];

      if (back) {
        toolBarContent.push(new Button({
          type: "Back",
          tooltip: ResourceModel.getText("back"),
          press: back
        }).addStyleClass("sapUiNoMarginEnd"));
      }

      toolBarContent.push(new ObjectStatus({
        state: "Warning",
        icon: "sap-icon://alert",
        tooltip: ResourceModel.getText("situationIconTooltip")
      }).addStyleClass("sapUiSmallMarginBegin"));
      toolBarContent.push(new ObjectIdentifier({
        titleActive: false,
        title: bindText("SituationTitle")
      }).addStyleClass("sapUiSmallMarginEnd"));
      var popoverSettings = {
        contentWidth: "25em",
        contentHeight: "7em",
        placement: "Horizontal",
        customHeader: new Toolbar({
          content: toolBarContent
        }),
        busyIndicatorDelay: 100,
        content: [new VBox({
          items: [new Label({
            text: bindTimestamp("SitnInstceLastChgdAtDateTime")
          }), new Text({
            text: bindText("SituationText")
          }).addStyleClass("sapUiTinyMarginTop")]
        })]
      };
      var shellServices = CommonUtils.getShellServices(controller.getView());
      var navigationArguments = {
        target: {
          action: "displayExtended",
          semanticObject: "SituationInstance"
        }
      };
      return Promise.resolve(shellServices.isNavigationSupported([navigationArguments])).then(function (isNavigationSupported) {
        if (isNavigationSupported[0].supported) {
          popoverSettings.endButton = new Button({
            text: ResourceModel.getText("showDetails"),
            press: function (event) {
              var _getBindingContext;

              var situationKey = (_getBindingContext = event.getSource().getBindingContext()) === null || _getBindingContext === void 0 ? void 0 : _getBindingContext.getObject("SitnInstceKey");

              if (situationKey !== undefined && situationKey !== null && shellServices.crossAppNavService) {
                navigationArguments.params = {
                  SitnInstceKey: situationKey
                };
                shellServices.crossAppNavService.toExternal(navigationArguments);
              }
            }
          });
        }

        return new ResponsivePopover(popoverSettings).addStyleClass("sapUiPopupWithPadding").addStyleClass("sapUiResponsivePadding--header");
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function bindTimestamp(timestampPropertyPath) {
    return {
      path: timestampPropertyPath,
      type: "sap.ui.model.odata.type.DateTimeOffset",
      constraints: {
        precision: 7
      },
      formatOptions: {
        relative: true
      }
    };
  }

  var currentSituationIndicator;

  function createListPopover(controller, expectedNumberOfSituations) {
    var goToDetails = function (event) {
      try {
        var pressedItem = event.getSource();
        var context = pressedItem.getBindingContext();

        var _temp4 = function () {
          if (context && currentSituationIndicator) {
            function _temp5() {
              listDetailsPopover.bindElement({
                path: context.getPath(),
                parameters: {
                  $expand: "_InstanceAttribute($expand=_InstanceAttributeValue)"
                },
                events: {
                  dataReceived: function () {
                    BusyLocker.unlock(listDetailsPopover);
                  }
                }
              });
              listPopover.close();
              BusyLocker.lock(listDetailsPopover);
              listDetailsPopover.openBy(currentSituationIndicator);
            }

            var _temp6 = function () {
              if (listDetailsPopover === null) {
                return Promise.resolve(createPreviewPopover(controller, goToList)).then(function (_createPreviewPopover) {
                  listDetailsPopover = _createPreviewPopover;
                  controller.getView().addDependent(listDetailsPopover);
                });
              }
            }();

            return _temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6);
          }
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    var listDetailsPopover = null;
    var listPopover = new ResponsivePopover({
      showHeader: false,
      contentHeight: "".concat(expectedNumberOfSituations * 4.5, "em"),
      contentWidth: "25em",
      busyIndicatorDelay: 200,
      placement: "Horizontal",
      content: [new List({
        items: {
          path: "_Instance",
          events: {
            dataReceived: function () {
              listPopover.setContentHeight();
            }
          },
          parameters: {
            $orderby: "SitnInstceLastChgdAtDateTime desc",
            $expand: "_InstanceAttribute($expand=_InstanceAttributeValue)" // required for formatting the texts

          },
          template: new CustomListItem({
            type: "Navigation",
            press: goToDetails,
            content: [new HBox({
              items: [new ObjectStatus({
                icon: "sap-icon://alert",
                state: "Warning",
                tooltip: ResourceModel.getText("situation")
              }).addStyleClass("sapUiTinyMarginEnd"), new ObjectIdentifier({
                title: bindText("SituationTitle"),
                text: bindTimestamp("SitnInstceLastChgdAtDateTime")
              })]
            }).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiSmallMarginTopBottom")]
          }),
          templateShareable: false
        },
        showNoData: false
      })]
    });

    function goToList() {
      if (listDetailsPopover) {
        listDetailsPopover.unbindObject();
        listDetailsPopover.close();
      }

      if (currentSituationIndicator) {
        listPopover.openBy(currentSituationIndicator);
      }
    }

    return listPopover;
  }

  showPopover.__functionName = "rt.showPopover";
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzaG93UG9wb3ZlciIsImNvbnRyb2xsZXIiLCJldmVudCIsInNpdHVhdGlvbnNOYXZpZ2F0aW9uUHJvcGVydHkiLCJnZXRWaWV3IiwiYWRkRGVwZW5kZW50IiwicG9wb3ZlciIsIm9wZW5CeSIsImN1cnJlbnRTaXR1YXRpb25JbmRpY2F0b3IiLCJnZXRTb3VyY2UiLCJiaW5kaW5nQ29udGV4dCIsImdldEJpbmRpbmdDb250ZXh0IiwibnVtYmVyT2ZTaXR1YXRpb25zIiwiZ2V0T2JqZWN0IiwiY29udGV4dCIsImdldE1vZGVsIiwiYmluZENvbnRleHQiLCIkZXhwYW5kIiwiZ2V0Qm91bmRDb250ZXh0IiwiY3JlYXRlUHJldmlld1BvcG92ZXIiLCJzZXRCaW5kaW5nQ29udGV4dCIsImJpbmRFbGVtZW50IiwicGF0aCIsImNyZWF0ZUxpc3RQb3BvdmVyIiwiYmFjayIsInRvb2xCYXJDb250ZW50IiwicHVzaCIsIkJ1dHRvbiIsInR5cGUiLCJ0b29sdGlwIiwiUmVzb3VyY2VNb2RlbCIsImdldFRleHQiLCJwcmVzcyIsImFkZFN0eWxlQ2xhc3MiLCJPYmplY3RTdGF0dXMiLCJzdGF0ZSIsImljb24iLCJPYmplY3RJZGVudGlmaWVyIiwidGl0bGVBY3RpdmUiLCJ0aXRsZSIsImJpbmRUZXh0IiwicG9wb3ZlclNldHRpbmdzIiwiY29udGVudFdpZHRoIiwiY29udGVudEhlaWdodCIsInBsYWNlbWVudCIsImN1c3RvbUhlYWRlciIsIlRvb2xiYXIiLCJjb250ZW50IiwiYnVzeUluZGljYXRvckRlbGF5IiwiVkJveCIsIml0ZW1zIiwiTGFiZWwiLCJ0ZXh0IiwiYmluZFRpbWVzdGFtcCIsIlRleHQiLCJzaGVsbFNlcnZpY2VzIiwiQ29tbW9uVXRpbHMiLCJnZXRTaGVsbFNlcnZpY2VzIiwibmF2aWdhdGlvbkFyZ3VtZW50cyIsInRhcmdldCIsImFjdGlvbiIsInNlbWFudGljT2JqZWN0IiwiaXNOYXZpZ2F0aW9uU3VwcG9ydGVkIiwic3VwcG9ydGVkIiwiZW5kQnV0dG9uIiwic2l0dWF0aW9uS2V5IiwidW5kZWZpbmVkIiwiY3Jvc3NBcHBOYXZTZXJ2aWNlIiwicGFyYW1zIiwiU2l0bkluc3RjZUtleSIsInRvRXh0ZXJuYWwiLCJSZXNwb25zaXZlUG9wb3ZlciIsInRpbWVzdGFtcFByb3BlcnR5UGF0aCIsImNvbnN0cmFpbnRzIiwicHJlY2lzaW9uIiwiZm9ybWF0T3B0aW9ucyIsInJlbGF0aXZlIiwiZXhwZWN0ZWROdW1iZXJPZlNpdHVhdGlvbnMiLCJnb1RvRGV0YWlscyIsInByZXNzZWRJdGVtIiwibGlzdERldGFpbHNQb3BvdmVyIiwiZ2V0UGF0aCIsInBhcmFtZXRlcnMiLCJldmVudHMiLCJkYXRhUmVjZWl2ZWQiLCJCdXN5TG9ja2VyIiwidW5sb2NrIiwibGlzdFBvcG92ZXIiLCJjbG9zZSIsImxvY2siLCJnb1RvTGlzdCIsInNob3dIZWFkZXIiLCJMaXN0Iiwic2V0Q29udGVudEhlaWdodCIsIiRvcmRlcmJ5IiwidGVtcGxhdGUiLCJDdXN0b21MaXN0SXRlbSIsIkhCb3giLCJ0ZW1wbGF0ZVNoYXJlYWJsZSIsInNob3dOb0RhdGEiLCJ1bmJpbmRPYmplY3QiLCJfX2Z1bmN0aW9uTmFtZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2l0dWF0aW9uc1BvcG92ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IEJ1c3lMb2NrZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0J1c3lMb2NrZXJcIjtcbmltcG9ydCBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvZmUvbWFjcm9zL1Jlc291cmNlTW9kZWxcIjtcbmltcG9ydCB7IGJpbmRUZXh0IH0gZnJvbSBcInNhcC9mZS9tYWNyb3Mvc2l0dWF0aW9ucy9TaXR1YXRpb25zVGV4dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwic2FwL20vQnV0dG9uXCI7XG5pbXBvcnQgQ3VzdG9tTGlzdEl0ZW0gZnJvbSBcInNhcC9tL0N1c3RvbUxpc3RJdGVtXCI7XG5pbXBvcnQgSEJveCBmcm9tIFwic2FwL20vSEJveFwiO1xuaW1wb3J0IExhYmVsIGZyb20gXCJzYXAvbS9MYWJlbFwiO1xuaW1wb3J0IExpc3QgZnJvbSBcInNhcC9tL0xpc3RcIjtcbmltcG9ydCBPYmplY3RJZGVudGlmaWVyIGZyb20gXCJzYXAvbS9PYmplY3RJZGVudGlmaWVyXCI7XG5pbXBvcnQgT2JqZWN0U3RhdHVzIGZyb20gXCJzYXAvbS9PYmplY3RTdGF0dXNcIjtcbmltcG9ydCB0eXBlIHsgJFJlc3BvbnNpdmVQb3BvdmVyU2V0dGluZ3MgfSBmcm9tIFwic2FwL20vUmVzcG9uc2l2ZVBvcG92ZXJcIjtcbmltcG9ydCBSZXNwb25zaXZlUG9wb3ZlciBmcm9tIFwic2FwL20vUmVzcG9uc2l2ZVBvcG92ZXJcIjtcbmltcG9ydCBUZXh0IGZyb20gXCJzYXAvbS9UZXh0XCI7XG5pbXBvcnQgVG9vbGJhciBmcm9tIFwic2FwL20vVG9vbGJhclwiO1xuaW1wb3J0IFZCb3ggZnJvbSBcInNhcC9tL1ZCb3hcIjtcbmltcG9ydCB0eXBlIFVJNUV2ZW50IGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFwiO1xuaW1wb3J0IHR5cGUgeyBBZ2dyZWdhdGlvbkJpbmRpbmdJbmZvLCBQcm9wZXJ0eUJpbmRpbmdJbmZvIH0gZnJvbSBcInNhcC91aS9iYXNlL01hbmFnZWRPYmplY3RcIjtcbmltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCB0eXBlIENvbnRyb2xsZXIgZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuXG5mdW5jdGlvbiBiaW5kVGltZXN0YW1wKHRpbWVzdGFtcFByb3BlcnR5UGF0aDogc3RyaW5nKTogUHJvcGVydHlCaW5kaW5nSW5mbyB7XG5cdHJldHVybiB7XG5cdFx0cGF0aDogdGltZXN0YW1wUHJvcGVydHlQYXRoLFxuXHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuRGF0ZVRpbWVPZmZzZXRcIixcblx0XHRjb25zdHJhaW50czogeyBwcmVjaXNpb246IDcgfSxcblx0XHRmb3JtYXRPcHRpb25zOiB7IHJlbGF0aXZlOiB0cnVlIH1cblx0fTtcbn1cblxubGV0IGN1cnJlbnRTaXR1YXRpb25JbmRpY2F0b3I6IENvbnRyb2wgfCB1bmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpc3RQb3BvdmVyKGNvbnRyb2xsZXI6IENvbnRyb2xsZXIsIGV4cGVjdGVkTnVtYmVyT2ZTaXR1YXRpb25zOiBudW1iZXIpIHtcblx0bGV0IGxpc3REZXRhaWxzUG9wb3ZlcjogUmVzcG9uc2l2ZVBvcG92ZXIgfCBudWxsID0gbnVsbDtcblxuXHRjb25zdCBsaXN0UG9wb3ZlciA9IG5ldyBSZXNwb25zaXZlUG9wb3Zlcih7XG5cdFx0c2hvd0hlYWRlcjogZmFsc2UsXG5cdFx0Y29udGVudEhlaWdodDogYCR7ZXhwZWN0ZWROdW1iZXJPZlNpdHVhdGlvbnMgKiA0LjV9ZW1gLFxuXHRcdGNvbnRlbnRXaWR0aDogXCIyNWVtXCIsXG5cdFx0YnVzeUluZGljYXRvckRlbGF5OiAyMDAsXG5cdFx0cGxhY2VtZW50OiBcIkhvcml6b250YWxcIixcblx0XHRjb250ZW50OiBbXG5cdFx0XHRuZXcgTGlzdCh7XG5cdFx0XHRcdGl0ZW1zOiB7XG5cdFx0XHRcdFx0cGF0aDogXCJfSW5zdGFuY2VcIixcblx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdGRhdGFSZWNlaXZlZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRsaXN0UG9wb3Zlci5zZXRDb250ZW50SGVpZ2h0KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRwYXJhbWV0ZXJzOiB7XG5cdFx0XHRcdFx0XHQkb3JkZXJieTogXCJTaXRuSW5zdGNlTGFzdENoZ2RBdERhdGVUaW1lIGRlc2NcIixcblx0XHRcdFx0XHRcdCRleHBhbmQ6IFwiX0luc3RhbmNlQXR0cmlidXRlKCRleHBhbmQ9X0luc3RhbmNlQXR0cmlidXRlVmFsdWUpXCIgLy8gcmVxdWlyZWQgZm9yIGZvcm1hdHRpbmcgdGhlIHRleHRzXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogbmV3IEN1c3RvbUxpc3RJdGVtKHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblwiLFxuXHRcdFx0XHRcdFx0cHJlc3M6IGdvVG9EZXRhaWxzLFxuXHRcdFx0XHRcdFx0Y29udGVudDogW1xuXHRcdFx0XHRcdFx0XHRuZXcgSEJveCh7XG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IFtcblx0XHRcdFx0XHRcdFx0XHRcdG5ldyBPYmplY3RTdGF0dXMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBcInNhcC1pY29uOi8vYWxlcnRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGU6IFwiV2FybmluZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b29sdGlwOiBSZXNvdXJjZU1vZGVsLmdldFRleHQoXCJzaXR1YXRpb25cIilcblx0XHRcdFx0XHRcdFx0XHRcdH0pLmFkZFN0eWxlQ2xhc3MoXCJzYXBVaVRpbnlNYXJnaW5FbmRcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHRuZXcgT2JqZWN0SWRlbnRpZmllcih7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBiaW5kVGV4dChcIlNpdHVhdGlvblRpdGxlXCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiBiaW5kVGltZXN0YW1wKFwiU2l0bkluc3RjZUxhc3RDaGdkQXREYXRlVGltZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0LmFkZFN0eWxlQ2xhc3MoXCJzYXBVaVNtYWxsTWFyZ2luQmVnaW5FbmRcIilcblx0XHRcdFx0XHRcdFx0XHQuYWRkU3R5bGVDbGFzcyhcInNhcFVpU21hbGxNYXJnaW5Ub3BCb3R0b21cIilcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHR0ZW1wbGF0ZVNoYXJlYWJsZTogZmFsc2Vcblx0XHRcdFx0fSBhcyBBZ2dyZWdhdGlvbkJpbmRpbmdJbmZvLFxuXHRcdFx0XHRzaG93Tm9EYXRhOiBmYWxzZVxuXHRcdFx0fSlcblx0XHRdXG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGdvVG9MaXN0KCkge1xuXHRcdGlmIChsaXN0RGV0YWlsc1BvcG92ZXIpIHtcblx0XHRcdGxpc3REZXRhaWxzUG9wb3Zlci51bmJpbmRPYmplY3QoKTtcblx0XHRcdGxpc3REZXRhaWxzUG9wb3Zlci5jbG9zZSgpO1xuXHRcdH1cblx0XHRpZiAoY3VycmVudFNpdHVhdGlvbkluZGljYXRvcikge1xuXHRcdFx0bGlzdFBvcG92ZXIub3BlbkJ5KGN1cnJlbnRTaXR1YXRpb25JbmRpY2F0b3IpO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIGdvVG9EZXRhaWxzKGV2ZW50OiBVSTVFdmVudCkge1xuXHRcdGNvbnN0IHByZXNzZWRJdGVtID0gZXZlbnQuZ2V0U291cmNlKCkgYXMgQ29udHJvbDtcblx0XHRjb25zdCBjb250ZXh0ID0gcHJlc3NlZEl0ZW0uZ2V0QmluZGluZ0NvbnRleHQoKTtcblxuXHRcdGlmIChjb250ZXh0ICYmIGN1cnJlbnRTaXR1YXRpb25JbmRpY2F0b3IpIHtcblx0XHRcdGlmIChsaXN0RGV0YWlsc1BvcG92ZXIgPT09IG51bGwpIHtcblx0XHRcdFx0bGlzdERldGFpbHNQb3BvdmVyID0gYXdhaXQgY3JlYXRlUHJldmlld1BvcG92ZXIoY29udHJvbGxlciwgZ29Ub0xpc3QpO1xuXHRcdFx0XHRjb250cm9sbGVyLmdldFZpZXcoKS5hZGREZXBlbmRlbnQobGlzdERldGFpbHNQb3BvdmVyKTtcblx0XHRcdH1cblxuXHRcdFx0bGlzdERldGFpbHNQb3BvdmVyLmJpbmRFbGVtZW50KHtcblx0XHRcdFx0cGF0aDogY29udGV4dC5nZXRQYXRoKCksXG5cdFx0XHRcdHBhcmFtZXRlcnM6IHsgJGV4cGFuZDogXCJfSW5zdGFuY2VBdHRyaWJ1dGUoJGV4cGFuZD1fSW5zdGFuY2VBdHRyaWJ1dGVWYWx1ZSlcIiB9LFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRkYXRhUmVjZWl2ZWQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdEJ1c3lMb2NrZXIudW5sb2NrKGxpc3REZXRhaWxzUG9wb3Zlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGlzdFBvcG92ZXIuY2xvc2UoKTtcblxuXHRcdFx0QnVzeUxvY2tlci5sb2NrKGxpc3REZXRhaWxzUG9wb3Zlcik7XG5cdFx0XHRsaXN0RGV0YWlsc1BvcG92ZXIub3BlbkJ5KGN1cnJlbnRTaXR1YXRpb25JbmRpY2F0b3IpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBsaXN0UG9wb3Zlcjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJldmlld1BvcG92ZXIoY29udHJvbGxlcjogQ29udHJvbGxlciwgYmFjaz86IChldmVudDogVUk1RXZlbnQpID0+IHZvaWQpIHtcblx0Y29uc3QgdG9vbEJhckNvbnRlbnQ6IENvbnRyb2xbXSA9IFtdO1xuXG5cdGlmIChiYWNrKSB7XG5cdFx0dG9vbEJhckNvbnRlbnQucHVzaChcblx0XHRcdG5ldyBCdXR0b24oe1xuXHRcdFx0XHR0eXBlOiBcIkJhY2tcIixcblx0XHRcdFx0dG9vbHRpcDogUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiYmFja1wiKSxcblx0XHRcdFx0cHJlc3M6IGJhY2tcblx0XHRcdH0pLmFkZFN0eWxlQ2xhc3MoXCJzYXBVaU5vTWFyZ2luRW5kXCIpXG5cdFx0KTtcblx0fVxuXG5cdHRvb2xCYXJDb250ZW50LnB1c2goXG5cdFx0bmV3IE9iamVjdFN0YXR1cyh7XG5cdFx0XHRzdGF0ZTogXCJXYXJuaW5nXCIsXG5cdFx0XHRpY29uOiBcInNhcC1pY29uOi8vYWxlcnRcIixcblx0XHRcdHRvb2x0aXA6IFJlc291cmNlTW9kZWwuZ2V0VGV4dChcInNpdHVhdGlvbkljb25Ub29sdGlwXCIpXG5cdFx0fSkuYWRkU3R5bGVDbGFzcyhcInNhcFVpU21hbGxNYXJnaW5CZWdpblwiKVxuXHQpO1xuXG5cdHRvb2xCYXJDb250ZW50LnB1c2goXG5cdFx0bmV3IE9iamVjdElkZW50aWZpZXIoe1xuXHRcdFx0dGl0bGVBY3RpdmU6IGZhbHNlLFxuXHRcdFx0dGl0bGU6IGJpbmRUZXh0KFwiU2l0dWF0aW9uVGl0bGVcIilcblx0XHR9KS5hZGRTdHlsZUNsYXNzKFwic2FwVWlTbWFsbE1hcmdpbkVuZFwiKVxuXHQpO1xuXG5cdGNvbnN0IHBvcG92ZXJTZXR0aW5nczogJFJlc3BvbnNpdmVQb3BvdmVyU2V0dGluZ3MgPSB7XG5cdFx0Y29udGVudFdpZHRoOiBcIjI1ZW1cIixcblx0XHRjb250ZW50SGVpZ2h0OiBcIjdlbVwiLFxuXHRcdHBsYWNlbWVudDogXCJIb3Jpem9udGFsXCIsXG5cdFx0Y3VzdG9tSGVhZGVyOiBuZXcgVG9vbGJhcih7IGNvbnRlbnQ6IHRvb2xCYXJDb250ZW50IH0pLFxuXHRcdGJ1c3lJbmRpY2F0b3JEZWxheTogMTAwLFxuXHRcdGNvbnRlbnQ6IFtcblx0XHRcdG5ldyBWQm94KHtcblx0XHRcdFx0aXRlbXM6IFtcblx0XHRcdFx0XHRuZXcgTGFiZWwoeyB0ZXh0OiBiaW5kVGltZXN0YW1wKFwiU2l0bkluc3RjZUxhc3RDaGdkQXREYXRlVGltZVwiKSB9KSxcblx0XHRcdFx0XHRuZXcgVGV4dCh7IHRleHQ6IGJpbmRUZXh0KFwiU2l0dWF0aW9uVGV4dFwiKSB9KS5hZGRTdHlsZUNsYXNzKFwic2FwVWlUaW55TWFyZ2luVG9wXCIpXG5cdFx0XHRcdF1cblx0XHRcdH0pXG5cdFx0XVxuXHR9O1xuXG5cdGNvbnN0IHNoZWxsU2VydmljZXMgPSBDb21tb25VdGlscy5nZXRTaGVsbFNlcnZpY2VzKGNvbnRyb2xsZXIuZ2V0VmlldygpKTtcblx0Y29uc3QgbmF2aWdhdGlvbkFyZ3VtZW50czogYW55ID0ge1xuXHRcdHRhcmdldDoge1xuXHRcdFx0YWN0aW9uOiBcImRpc3BsYXlFeHRlbmRlZFwiLFxuXHRcdFx0c2VtYW50aWNPYmplY3Q6IFwiU2l0dWF0aW9uSW5zdGFuY2VcIlxuXHRcdH1cblx0fTtcblx0Y29uc3QgaXNOYXZpZ2F0aW9uU3VwcG9ydGVkID0gYXdhaXQgc2hlbGxTZXJ2aWNlcy5pc05hdmlnYXRpb25TdXBwb3J0ZWQoW25hdmlnYXRpb25Bcmd1bWVudHNdKTtcblxuXHRpZiAoaXNOYXZpZ2F0aW9uU3VwcG9ydGVkWzBdLnN1cHBvcnRlZCkge1xuXHRcdHBvcG92ZXJTZXR0aW5ncy5lbmRCdXR0b24gPSBuZXcgQnV0dG9uKHtcblx0XHRcdHRleHQ6IFJlc291cmNlTW9kZWwuZ2V0VGV4dChcInNob3dEZXRhaWxzXCIpLFxuXG5cdFx0XHRwcmVzczogKGV2ZW50OiBVSTVFdmVudCkgPT4ge1xuXHRcdFx0XHRjb25zdCBzaXR1YXRpb25LZXkgPSAoZXZlbnQuZ2V0U291cmNlKCkgYXMgQ29udHJvbCkuZ2V0QmluZGluZ0NvbnRleHQoKT8uZ2V0T2JqZWN0KGBTaXRuSW5zdGNlS2V5YCk7XG5cblx0XHRcdFx0aWYgKHNpdHVhdGlvbktleSAhPT0gdW5kZWZpbmVkICYmIHNpdHVhdGlvbktleSAhPT0gbnVsbCAmJiBzaGVsbFNlcnZpY2VzLmNyb3NzQXBwTmF2U2VydmljZSkge1xuXHRcdFx0XHRcdG5hdmlnYXRpb25Bcmd1bWVudHMucGFyYW1zID0geyBTaXRuSW5zdGNlS2V5OiBzaXR1YXRpb25LZXkgfTtcblx0XHRcdFx0XHRzaGVsbFNlcnZpY2VzLmNyb3NzQXBwTmF2U2VydmljZS50b0V4dGVybmFsKG5hdmlnYXRpb25Bcmd1bWVudHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gbmV3IFJlc3BvbnNpdmVQb3BvdmVyKHBvcG92ZXJTZXR0aW5ncykuYWRkU3R5bGVDbGFzcyhcInNhcFVpUG9wdXBXaXRoUGFkZGluZ1wiKS5hZGRTdHlsZUNsYXNzKFwic2FwVWlSZXNwb25zaXZlUGFkZGluZy0taGVhZGVyXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hvd1BvcG92ZXIoY29udHJvbGxlcjogQ29udHJvbGxlciwgZXZlbnQ6IFVJNUV2ZW50LCBzaXR1YXRpb25zTmF2aWdhdGlvblByb3BlcnR5OiBzdHJpbmcpIHtcblx0Y3VycmVudFNpdHVhdGlvbkluZGljYXRvciA9IGV2ZW50LmdldFNvdXJjZSgpIGFzIENvbnRyb2w7XG5cblx0Y29uc3QgYmluZGluZ0NvbnRleHQgPSBjdXJyZW50U2l0dWF0aW9uSW5kaWNhdG9yLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dCxcblx0XHRudW1iZXJPZlNpdHVhdGlvbnMgPSBiaW5kaW5nQ29udGV4dC5nZXRPYmplY3QoYCR7c2l0dWF0aW9uc05hdmlnYXRpb25Qcm9wZXJ0eX0vU2l0bk51bWJlck9mSW5zdGFuY2VzYCk7XG5cblx0bGV0IHBvcG92ZXI6IFJlc3BvbnNpdmVQb3BvdmVyO1xuXHRjb25zdCBjb250ZXh0ID0gYmluZGluZ0NvbnRleHRcblx0XHQuZ2V0TW9kZWwoKVxuXHRcdC5iaW5kQ29udGV4dChzaXR1YXRpb25zTmF2aWdhdGlvblByb3BlcnR5LCBiaW5kaW5nQ29udGV4dCwge1xuXHRcdFx0JGV4cGFuZDogXCJfSW5zdGFuY2UoJGV4cGFuZD1fSW5zdGFuY2VBdHRyaWJ1dGUoJGV4cGFuZD1fSW5zdGFuY2VBdHRyaWJ1dGVWYWx1ZSkpXCJcblx0XHR9KVxuXHRcdC5nZXRCb3VuZENvbnRleHQoKTtcblxuXHRpZiAobnVtYmVyT2ZTaXR1YXRpb25zIDw9IDEpIHtcblx0XHRwb3BvdmVyID0gYXdhaXQgY3JlYXRlUHJldmlld1BvcG92ZXIoY29udHJvbGxlcik7XG5cdFx0cG9wb3Zlci5zZXRCaW5kaW5nQ29udGV4dChjb250ZXh0KTtcblx0XHRwb3BvdmVyLmJpbmRFbGVtZW50KHsgcGF0aDogXCJfSW5zdGFuY2UvMFwiIH0pO1xuXHR9IGVsc2Uge1xuXHRcdHBvcG92ZXIgPSBjcmVhdGVMaXN0UG9wb3Zlcihjb250cm9sbGVyLCBudW1iZXJPZlNpdHVhdGlvbnMpO1xuXHRcdHBvcG92ZXIuc2V0QmluZGluZ0NvbnRleHQoY29udGV4dCk7XG5cdH1cblxuXHRjb250cm9sbGVyLmdldFZpZXcoKS5hZGREZXBlbmRlbnQocG9wb3Zlcik7XG5cdHBvcG92ZXIub3BlbkJ5KGN1cnJlbnRTaXR1YXRpb25JbmRpY2F0b3IpO1xufVxuXG5zaG93UG9wb3Zlci5fX2Z1bmN0aW9uTmFtZSA9IFwicnQuc2hvd1BvcG92ZXJcIjtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7OztNQWtNc0JBLFcsYUFBWUMsVSxFQUF3QkMsSyxFQUFpQkMsNEI7UUFBc0M7TUFBQTtRQXVCaEhGLFVBQVUsQ0FBQ0csT0FBWCxHQUFxQkMsWUFBckIsQ0FBa0NDLE9BQWxDO1FBQ0FBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyx5QkFBZjtNQXhCZ0g7O01BQ2hIQSx5QkFBeUIsR0FBR04sS0FBSyxDQUFDTyxTQUFOLEVBQTVCO01BRUEsSUFBTUMsY0FBYyxHQUFHRix5QkFBeUIsQ0FBQ0csaUJBQTFCLEVBQXZCO01BQUEsSUFDQ0Msa0JBQWtCLEdBQUdGLGNBQWMsQ0FBQ0csU0FBZixXQUE0QlYsNEJBQTVCLDRCQUR0QjtNQUdBLElBQUlHLE9BQUo7TUFDQSxJQUFNUSxPQUFPLEdBQUdKLGNBQWMsQ0FDNUJLLFFBRGMsR0FFZEMsV0FGYyxDQUVGYiw0QkFGRSxFQUU0Qk8sY0FGNUIsRUFFNEM7UUFDMURPLE9BQU8sRUFBRTtNQURpRCxDQUY1QyxFQUtkQyxlQUxjLEVBQWhCOztNQVBnSDtRQUFBLElBYzVHTixrQkFBa0IsSUFBSSxDQWRzRjtVQUFBLHVCQWUvRk8sb0JBQW9CLENBQUNsQixVQUFELENBZjJFO1lBZS9HSyxPQUFPLHlCQUFQO1lBQ0FBLE9BQU8sQ0FBQ2MsaUJBQVIsQ0FBMEJOLE9BQTFCO1lBQ0FSLE9BQU8sQ0FBQ2UsV0FB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