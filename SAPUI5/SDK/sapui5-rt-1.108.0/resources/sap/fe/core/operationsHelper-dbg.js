/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/m/Bar", "sap/m/Button", "sap/m/Dialog", "sap/m/MessageBox", "sap/m/Title", "sap/ui/core/message/Message", "sap/ui/model/json/JSONModel", "./CommonUtils", "./controllerextensions/messageHandler/messageHandling", "./formatters/TableFormatterTypes"], function (Bar, Button, Dialog, MessageBox, Title, Message, JSONModel, CommonUtils, messageHandling, TableFormatterTypes) {
  "use strict";

  var MessageType = TableFormatterTypes.MessageType;

  function renderMessageView(mParameters, oResourceBundle, messageHandler, aMessages, isMultiContext412, resolve, sGroupId) {
    var _mParameters$internal;

    var sActionName = mParameters.label;
    var oModel = mParameters.model,
        sCancelButtonTxt = CommonUtils.getTranslatedText("C_COMMON_DIALOG_SKIP", oResourceBundle);
    var strictHandlingPromises = mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal = mParameters.internalModelContext) === null || _mParameters$internal === void 0 ? void 0 : _mParameters$internal.getProperty("strictHandlingPromises");
    var sMessage;

    if (aMessages.length === 1) {
      var messageText = aMessages[0].getMessage();
      var identifierText = aMessages[0].getAdditionalText();

      if (!isMultiContext412) {
        sMessage = "".concat(messageText, "\n").concat(CommonUtils.getTranslatedText("PROCEED", oResourceBundle));
      } else if (identifierText !== undefined && identifierText !== "") {
        var sHeaderInfoTypeName = mParameters.control.getParent().getTableDefinition().headerInfoTypeName;

        if (sHeaderInfoTypeName) {
          sMessage = "".concat(sHeaderInfoTypeName, " ").concat(identifierText, ": ").concat(messageText, "\n\n").concat(CommonUtils.getTranslatedText("C_COMMON_DIALOG_SKIP_SINGLE_MESSAGE_TEXT", oResourceBundle));
        } else {
          sMessage = "".concat(identifierText, ": ").concat(messageText, "\n\n").concat(CommonUtils.getTranslatedText("C_COMMON_DIALOG_SKIP_SINGLE_MESSAGE_TEXT", oResourceBundle));
        }
      } else {
        sMessage = "".concat(messageText, "\n\n").concat(CommonUtils.getTranslatedText("C_COMMON_DIALOG_SKIP_SINGLE_MESSAGE_TEXT", oResourceBundle));
      }

      MessageBox.warning(sMessage, {
        title: CommonUtils.getTranslatedText("WARNING", oResourceBundle),
        actions: [sActionName, sCancelButtonTxt],
        emphasizedAction: sActionName,
        onClose: function (sAction) {
          var _mParameters$internal5;

          if (sAction === sActionName) {
            var _mParameters$internal3;

            if (!isMultiContext412) {
              resolve(true);
              oModel.submitBatch(sGroupId);

              if (mParameters.requestSideEffects) {
                mParameters.requestSideEffects();
              }
            } else {
              var _mParameters$internal2;

              strictHandlingPromises.forEach(function (sHPromise) {
                sHPromise.resolve(true);
                oModel.submitBatch(sHPromise.groupId);

                if (sHPromise.requestSideEffects) {
                  sHPromise.requestSideEffects();
                }
              });
              var strictHandlingFails = mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal2 = mParameters.internalModelContext) === null || _mParameters$internal2 === void 0 ? void 0 : _mParameters$internal2.getProperty("strictHandlingFails");

              if (strictHandlingFails.length > 0) {
                messageHandler === null || messageHandler === void 0 ? void 0 : messageHandler.removeTransitionMessages();
              }
            }

            mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal3 = mParameters.internalModelContext) === null || _mParameters$internal3 === void 0 ? void 0 : _mParameters$internal3.setProperty("412Executed", true);
          } else {
            var _mParameters$internal4;

            mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal4 = mParameters.internalModelContext) === null || _mParameters$internal4 === void 0 ? void 0 : _mParameters$internal4.setProperty("412Executed", false);

            if (!isMultiContext412) {
              resolve(false);
            } else {
              strictHandlingPromises.forEach(function (sHPromise) {
                sHPromise.resolve(false);
              });
            }
          }

          mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal5 = mParameters.internalModelContext) === null || _mParameters$internal5 === void 0 ? void 0 : _mParameters$internal5.setProperty("412Messages", []);
        }
      });
    } else if (aMessages.length > 1) {
      if (isMultiContext412) {
        var genericMessage = new Message({
          message: CommonUtils.getTranslatedText("C_COMMON_DIALOG_SKIP_MESSAGES_WARNING", oResourceBundle),
          type: MessageType.Warning,
          target: undefined,
          persistent: true,
          description: CommonUtils.getTranslatedText("C_COMMON_DIALOG_SKIP_MESSAGES_TEXT", oResourceBundle, sActionName)
        });
        aMessages = [genericMessage].concat(aMessages);
      }

      var oMessageDialogModel = new JSONModel();
      oMessageDialogModel.setData(aMessages);
      var bStrictHandlingFlow = true;
      var oMessageObject = messageHandling.prepareMessageViewForDialog(oMessageDialogModel, bStrictHandlingFlow, isMultiContext412);
      var oDialog = new Dialog({
        resizable: true,
        content: oMessageObject.oMessageView,
        state: "Warning",
        customHeader: new Bar({
          contentLeft: [oMessageObject.oBackButton],
          contentMiddle: [new Title({
            text: "Warning"
          })]
        }),
        contentHeight: "50%",
        contentWidth: "50%",
        verticalScrolling: false
      });
      oDialog.setBeginButton(new Button({
        press: function () {
          var _mParameters$internal8;

          if (!isMultiContext412) {
            resolve(true);
            oModel.submitBatch(sGroupId);
          } else {
            var _mParameters$internal6, _mParameters$internal7;

            strictHandlingPromises.forEach(function (sHPromise) {
              sHPromise.resolve(true);
              oModel.submitBatch(sHPromise.groupId);

              if (sHPromise.requestSideEffects) {
                sHPromise.requestSideEffects();
              }
            });
            var strictHandlingFails = mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal6 = mParameters.internalModelContext) === null || _mParameters$internal6 === void 0 ? void 0 : _mParameters$internal6.getProperty("strictHandlingFails");

            if (strictHandlingFails.length > 0) {
              messageHandler === null || messageHandler === void 0 ? void 0 : messageHandler.removeTransitionMessages();
            }

            mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal7 = mParameters.internalModelContext) === null || _mParameters$internal7 === void 0 ? void 0 : _mParameters$internal7.setProperty("412Messages", []);
          }

          mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal8 = mParameters.internalModelContext) === null || _mParameters$internal8 === void 0 ? void 0 : _mParameters$internal8.setProperty("412Executed", true);
          oMessageDialogModel.setData({});
          oDialog.close();
        },
        type: "Emphasized",
        text: sActionName
      }));
      oDialog.setEndButton(new Button({
        press: function () {
          var _mParameters$internal9, _mParameters$internal10;

          mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal9 = mParameters.internalModelContext) === null || _mParameters$internal9 === void 0 ? void 0 : _mParameters$internal9.setProperty("412Messages", []);
          mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal10 = mParameters.internalModelContext) === null || _mParameters$internal10 === void 0 ? void 0 : _mParameters$internal10.setProperty("412Executed", false);

          if (!isMultiContext412) {
            resolve(false);
          } else {
            strictHandlingPromises.forEach(function (sHPromise) {
              sHPromise.resolve(false);
            });
          }

          oMessageDialogModel.setData({});
          oDialog.close();
        },
        text: sCancelButtonTxt
      }));
      oDialog.open();
    }
  }

  function fnOnStrictHandlingFailed(sGroupId, mParameters, oResourceBundle, current_context_index, oContext, iContextLength, messageHandler, a412Messages) {
    if (current_context_index === null && iContextLength === null || current_context_index === 1 && iContextLength === 1) {
      return new Promise(function (resolve) {
        operationsHelper.renderMessageView(mParameters, oResourceBundle, messageHandler, a412Messages, false, resolve, sGroupId);
      });
    } else {
      var _mParameters$internal11, _mParameters$internal12, _mParameters$internal13, _mParameters$internal14;

      var sActionName = mParameters.label;
      var a412TransitionMessages = mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal11 = mParameters.internalModelContext) === null || _mParameters$internal11 === void 0 ? void 0 : _mParameters$internal11.getProperty("412Messages");
      var sColumn = mParameters.control.getParent().getIdentifierColumn();
      var sValue = "";

      if (sColumn && iContextLength && iContextLength > 1) {
        sValue = oContext && oContext.getObject(sColumn);
      }

      a412Messages.forEach(function (msg) {
        msg.setType("Warning");
        msg.setAdditionalText(sValue);
        a412TransitionMessages.push(msg);
      });

      if (mParameters.dialog && mParameters.dialog.isOpen()) {
        mParameters.dialog.close();
      }

      var strictHandlingPromises = mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal12 = mParameters.internalModelContext) === null || _mParameters$internal12 === void 0 ? void 0 : _mParameters$internal12.getProperty("strictHandlingPromises");
      var strictHandlingPromise = new Promise(function (resolve) {
        strictHandlingPromises.push({
          groupId: sGroupId,
          resolve: resolve,
          actionName: sActionName,
          model: mParameters.model,
          value: sValue,
          requestSideEffects: mParameters.requestSideEffects
        });
      });
      mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal13 = mParameters.internalModelContext) === null || _mParameters$internal13 === void 0 ? void 0 : _mParameters$internal13.setProperty("412Messages", a412TransitionMessages);
      mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal14 = mParameters.internalModelContext) === null || _mParameters$internal14 === void 0 ? void 0 : _mParameters$internal14.setProperty("strictHandlingPromises", strictHandlingPromises);

      if (current_context_index === iContextLength) {
        var _mParameters$internal15;

        operationsHelper.renderMessageView(mParameters, oResourceBundle, messageHandler, mParameters === null || mParameters === void 0 ? void 0 : (_mParameters$internal15 = mParameters.internalModelContext) === null || _mParameters$internal15 === void 0 ? void 0 : _mParameters$internal15.getProperty("412Messages"), true);
      }

      return strictHandlingPromise;
    }
  }

  var operationsHelper = {
    renderMessageView: renderMessageView,
    fnOnStrictHandlingFailed: fnOnStrictHandlingFailed
  };
  return operationsHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZW5kZXJNZXNzYWdlVmlldyIsIm1QYXJhbWV0ZXJzIiwib1Jlc291cmNlQnVuZGxlIiwibWVzc2FnZUhhbmRsZXIiLCJhTWVzc2FnZXMiLCJpc011bHRpQ29udGV4dDQxMiIsInJlc29sdmUiLCJzR3JvdXBJZCIsInNBY3Rpb25OYW1lIiwibGFiZWwiLCJvTW9kZWwiLCJtb2RlbCIsInNDYW5jZWxCdXR0b25UeHQiLCJDb21tb25VdGlscyIsImdldFRyYW5zbGF0ZWRUZXh0Iiwic3RyaWN0SGFuZGxpbmdQcm9taXNlcyIsImludGVybmFsTW9kZWxDb250ZXh0IiwiZ2V0UHJvcGVydHkiLCJzTWVzc2FnZSIsImxlbmd0aCIsIm1lc3NhZ2VUZXh0IiwiZ2V0TWVzc2FnZSIsImlkZW50aWZpZXJUZXh0IiwiZ2V0QWRkaXRpb25hbFRleHQiLCJ1bmRlZmluZWQiLCJzSGVhZGVySW5mb1R5cGVOYW1lIiwiY29udHJvbCIsImdldFBhcmVudCIsImdldFRhYmxlRGVmaW5pdGlvbiIsImhlYWRlckluZm9UeXBlTmFtZSIsIk1lc3NhZ2VCb3giLCJ3YXJuaW5nIiwidGl0bGUiLCJhY3Rpb25zIiwiZW1waGFzaXplZEFjdGlvbiIsIm9uQ2xvc2UiLCJzQWN0aW9uIiwic3VibWl0QmF0Y2giLCJyZXF1ZXN0U2lkZUVmZmVjdHMiLCJmb3JFYWNoIiwic0hQcm9taXNlIiwiZ3JvdXBJZCIsInN0cmljdEhhbmRsaW5nRmFpbHMiLCJyZW1vdmVUcmFuc2l0aW9uTWVzc2FnZXMiLCJzZXRQcm9wZXJ0eSIsImdlbmVyaWNNZXNzYWdlIiwiTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0eXBlIiwiTWVzc2FnZVR5cGUiLCJXYXJuaW5nIiwidGFyZ2V0IiwicGVyc2lzdGVudCIsImRlc2NyaXB0aW9uIiwiY29uY2F0Iiwib01lc3NhZ2VEaWFsb2dNb2RlbCIsIkpTT05Nb2RlbCIsInNldERhdGEiLCJiU3RyaWN0SGFuZGxpbmdGbG93Iiwib01lc3NhZ2VPYmplY3QiLCJtZXNzYWdlSGFuZGxpbmciLCJwcmVwYXJlTWVzc2FnZVZpZXdGb3JEaWFsb2ciLCJvRGlhbG9nIiwiRGlhbG9nIiwicmVzaXphYmxlIiwiY29udGVudCIsIm9NZXNzYWdlVmlldyIsInN0YXRlIiwiY3VzdG9tSGVhZGVyIiwiQmFyIiwiY29udGVudExlZnQiLCJvQmFja0J1dHRvbiIsImNvbnRlbnRNaWRkbGUiLCJUaXRsZSIsInRleHQiLCJjb250ZW50SGVpZ2h0IiwiY29udGVudFdpZHRoIiwidmVydGljYWxTY3JvbGxpbmciLCJzZXRCZWdpbkJ1dHRvbiIsIkJ1dHRvbiIsInByZXNzIiwiY2xvc2UiLCJzZXRFbmRCdXR0b24iLCJvcGVuIiwiZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkIiwiY3VycmVudF9jb250ZXh0X2luZGV4Iiwib0NvbnRleHQiLCJpQ29udGV4dExlbmd0aCIsImE0MTJNZXNzYWdlcyIsIlByb21pc2UiLCJvcGVyYXRpb25zSGVscGVyIiwiYTQxMlRyYW5zaXRpb25NZXNzYWdlcyIsInNDb2x1bW4iLCJnZXRJZGVudGlmaWVyQ29sdW1uIiwic1ZhbHVlIiwiZ2V0T2JqZWN0IiwibXNnIiwic2V0VHlwZSIsInNldEFkZGl0aW9uYWxUZXh0IiwicHVzaCIsImRpYWxvZyIsImlzT3BlbiIsInN0cmljdEhhbmRsaW5nUHJvbWlzZSIsImFjdGlvbk5hbWUiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsib3BlcmF0aW9uc0hlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzb3VyY2VCdW5kbGUgZnJvbSBcInNhcC9iYXNlL2kxOG4vUmVzb3VyY2VCdW5kbGVcIjtcbmltcG9ydCBCYXIgZnJvbSBcInNhcC9tL0JhclwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwic2FwL20vQnV0dG9uXCI7XG5pbXBvcnQgRGlhbG9nIGZyb20gXCJzYXAvbS9EaWFsb2dcIjtcbmltcG9ydCBNZXNzYWdlQm94IGZyb20gXCJzYXAvbS9NZXNzYWdlQm94XCI7XG5pbXBvcnQgVGl0bGUgZnJvbSBcInNhcC9tL1RpdGxlXCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwic2FwL3VpL2NvcmUvbWVzc2FnZS9NZXNzYWdlXCI7XG5pbXBvcnQgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwiLi9Db21tb25VdGlsc1wiO1xuaW1wb3J0IE1lc3NhZ2VIYW5kbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJleHRlbnNpb25zL01lc3NhZ2VIYW5kbGVyXCI7XG5pbXBvcnQgbWVzc2FnZUhhbmRsaW5nIGZyb20gXCIuL2NvbnRyb2xsZXJleHRlbnNpb25zL21lc3NhZ2VIYW5kbGVyL21lc3NhZ2VIYW5kbGluZ1wiO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwiLi9mb3JtYXR0ZXJzL1RhYmxlRm9ybWF0dGVyVHlwZXNcIjtcblxuZnVuY3Rpb24gcmVuZGVyTWVzc2FnZVZpZXcoXG5cdG1QYXJhbWV0ZXJzOiBhbnksXG5cdG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGUsXG5cdG1lc3NhZ2VIYW5kbGVyOiBNZXNzYWdlSGFuZGxlciB8IHVuZGVmaW5lZCxcblx0YU1lc3NhZ2VzOiBNZXNzYWdlW10sXG5cdGlzTXVsdGlDb250ZXh0NDEyPzogYm9vbGVhbixcblx0cmVzb2x2ZT86IGFueSxcblx0c0dyb3VwSWQ/OiBzdHJpbmdcbikge1xuXHRjb25zdCBzQWN0aW9uTmFtZSA9IG1QYXJhbWV0ZXJzLmxhYmVsO1xuXHRjb25zdCBvTW9kZWwgPSBtUGFyYW1ldGVycy5tb2RlbCxcblx0XHRzQ2FuY2VsQnV0dG9uVHh0ID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX0NPTU1PTl9ESUFMT0dfU0tJUFwiLCBvUmVzb3VyY2VCdW5kbGUpO1xuXHRjb25zdCBzdHJpY3RIYW5kbGluZ1Byb21pc2VzID0gbVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5nZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nUHJvbWlzZXNcIik7XG5cdGxldCBzTWVzc2FnZTogc3RyaW5nO1xuXHRpZiAoYU1lc3NhZ2VzLmxlbmd0aCA9PT0gMSkge1xuXHRcdGNvbnN0IG1lc3NhZ2VUZXh0ID0gYU1lc3NhZ2VzWzBdLmdldE1lc3NhZ2UoKTtcblx0XHRjb25zdCBpZGVudGlmaWVyVGV4dCA9IGFNZXNzYWdlc1swXS5nZXRBZGRpdGlvbmFsVGV4dCgpO1xuXHRcdGlmICghaXNNdWx0aUNvbnRleHQ0MTIpIHtcblx0XHRcdHNNZXNzYWdlID0gYCR7bWVzc2FnZVRleHR9XFxuJHtDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIlBST0NFRURcIiwgb1Jlc291cmNlQnVuZGxlKX1gO1xuXHRcdH0gZWxzZSBpZiAoaWRlbnRpZmllclRleHQgIT09IHVuZGVmaW5lZCAmJiBpZGVudGlmaWVyVGV4dCAhPT0gXCJcIikge1xuXHRcdFx0Y29uc3Qgc0hlYWRlckluZm9UeXBlTmFtZSA9IG1QYXJhbWV0ZXJzLmNvbnRyb2wuZ2V0UGFyZW50KCkuZ2V0VGFibGVEZWZpbml0aW9uKCkuaGVhZGVySW5mb1R5cGVOYW1lO1xuXHRcdFx0aWYgKHNIZWFkZXJJbmZvVHlwZU5hbWUpIHtcblx0XHRcdFx0c01lc3NhZ2UgPSBgJHtzSGVhZGVySW5mb1R5cGVOYW1lfSAke2lkZW50aWZpZXJUZXh0fTogJHttZXNzYWdlVGV4dH1cXG5cXG4ke0NvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFwiQ19DT01NT05fRElBTE9HX1NLSVBfU0lOR0xFX01FU1NBR0VfVEVYVFwiLFxuXHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHQpfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzTWVzc2FnZSA9IGAke2lkZW50aWZpZXJUZXh0fTogJHttZXNzYWdlVGV4dH1cXG5cXG4ke0NvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KFxuXHRcdFx0XHRcdFwiQ19DT01NT05fRElBTE9HX1NLSVBfU0lOR0xFX01FU1NBR0VfVEVYVFwiLFxuXHRcdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZVxuXHRcdFx0XHQpfWA7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNNZXNzYWdlID0gYCR7bWVzc2FnZVRleHR9XFxuXFxuJHtDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfQ09NTU9OX0RJQUxPR19TS0lQX1NJTkdMRV9NRVNTQUdFX1RFWFRcIiwgb1Jlc291cmNlQnVuZGxlKX1gO1xuXHRcdH1cblx0XHRNZXNzYWdlQm94Lndhcm5pbmcoc01lc3NhZ2UsIHtcblx0XHRcdHRpdGxlOiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIldBUk5JTkdcIiwgb1Jlc291cmNlQnVuZGxlKSxcblx0XHRcdGFjdGlvbnM6IFtzQWN0aW9uTmFtZSwgc0NhbmNlbEJ1dHRvblR4dF0sXG5cdFx0XHRlbXBoYXNpemVkQWN0aW9uOiBzQWN0aW9uTmFtZSxcblx0XHRcdG9uQ2xvc2U6IGZ1bmN0aW9uIChzQWN0aW9uOiBzdHJpbmcpIHtcblx0XHRcdFx0aWYgKHNBY3Rpb24gPT09IHNBY3Rpb25OYW1lKSB7XG5cdFx0XHRcdFx0aWYgKCFpc011bHRpQ29udGV4dDQxMikge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRcdG9Nb2RlbC5zdWJtaXRCYXRjaChzR3JvdXBJZCk7XG5cdFx0XHRcdFx0XHRpZiAobVBhcmFtZXRlcnMucmVxdWVzdFNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdFx0XHRcdG1QYXJhbWV0ZXJzLnJlcXVlc3RTaWRlRWZmZWN0cygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHJpY3RIYW5kbGluZ1Byb21pc2VzLmZvckVhY2goZnVuY3Rpb24gKHNIUHJvbWlzZTogYW55KSB7XG5cdFx0XHRcdFx0XHRcdHNIUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRvTW9kZWwuc3VibWl0QmF0Y2goc0hQcm9taXNlLmdyb3VwSWQpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc0hQcm9taXNlLnJlcXVlc3RTaWRlRWZmZWN0cykge1xuXHRcdFx0XHRcdFx0XHRcdHNIUHJvbWlzZS5yZXF1ZXN0U2lkZUVmZmVjdHMoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjb25zdCBzdHJpY3RIYW5kbGluZ0ZhaWxzID0gbVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5nZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nRmFpbHNcIik7XG5cdFx0XHRcdFx0XHRpZiAoc3RyaWN0SGFuZGxpbmdGYWlscy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2VIYW5kbGVyPy5yZW1vdmVUcmFuc2l0aW9uTWVzc2FnZXMoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcIjQxMkV4ZWN1dGVkXCIsIHRydWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzPy5pbnRlcm5hbE1vZGVsQ29udGV4dD8uc2V0UHJvcGVydHkoXCI0MTJFeGVjdXRlZFwiLCBmYWxzZSk7XG5cdFx0XHRcdFx0aWYgKCFpc011bHRpQ29udGV4dDQxMikge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0cmljdEhhbmRsaW5nUHJvbWlzZXMuZm9yRWFjaChmdW5jdGlvbiAoc0hQcm9taXNlOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0c0hQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdG1QYXJhbWV0ZXJzPy5pbnRlcm5hbE1vZGVsQ29udGV4dD8uc2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiLCBbXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAoYU1lc3NhZ2VzLmxlbmd0aCA+IDEpIHtcblx0XHRpZiAoaXNNdWx0aUNvbnRleHQ0MTIpIHtcblx0XHRcdGNvbnN0IGdlbmVyaWNNZXNzYWdlID0gbmV3IE1lc3NhZ2Uoe1xuXHRcdFx0XHRtZXNzYWdlOiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfQ09NTU9OX0RJQUxPR19TS0lQX01FU1NBR0VTX1dBUk5JTkdcIiwgb1Jlc291cmNlQnVuZGxlKSxcblx0XHRcdFx0dHlwZTogTWVzc2FnZVR5cGUuV2FybmluZyxcblx0XHRcdFx0dGFyZ2V0OiB1bmRlZmluZWQsXG5cdFx0XHRcdHBlcnNpc3RlbnQ6IHRydWUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIkNfQ09NTU9OX0RJQUxPR19TS0lQX01FU1NBR0VTX1RFWFRcIiwgb1Jlc291cmNlQnVuZGxlLCBzQWN0aW9uTmFtZSlcblx0XHRcdH0pO1xuXHRcdFx0YU1lc3NhZ2VzID0gW2dlbmVyaWNNZXNzYWdlXS5jb25jYXQoYU1lc3NhZ2VzKTtcblx0XHR9XG5cdFx0Y29uc3Qgb01lc3NhZ2VEaWFsb2dNb2RlbCA9IG5ldyBKU09OTW9kZWwoKTtcblx0XHRvTWVzc2FnZURpYWxvZ01vZGVsLnNldERhdGEoYU1lc3NhZ2VzKTtcblx0XHRjb25zdCBiU3RyaWN0SGFuZGxpbmdGbG93ID0gdHJ1ZTtcblx0XHRjb25zdCBvTWVzc2FnZU9iamVjdCA9IG1lc3NhZ2VIYW5kbGluZy5wcmVwYXJlTWVzc2FnZVZpZXdGb3JEaWFsb2cob01lc3NhZ2VEaWFsb2dNb2RlbCwgYlN0cmljdEhhbmRsaW5nRmxvdywgaXNNdWx0aUNvbnRleHQ0MTIpO1xuXHRcdGNvbnN0IG9EaWFsb2cgPSBuZXcgRGlhbG9nKHtcblx0XHRcdHJlc2l6YWJsZTogdHJ1ZSxcblx0XHRcdGNvbnRlbnQ6IG9NZXNzYWdlT2JqZWN0Lm9NZXNzYWdlVmlldyxcblx0XHRcdHN0YXRlOiBcIldhcm5pbmdcIixcblx0XHRcdGN1c3RvbUhlYWRlcjogbmV3IEJhcih7XG5cdFx0XHRcdGNvbnRlbnRMZWZ0OiBbb01lc3NhZ2VPYmplY3Qub0JhY2tCdXR0b25dLFxuXHRcdFx0XHRjb250ZW50TWlkZGxlOiBbbmV3IFRpdGxlKHsgdGV4dDogXCJXYXJuaW5nXCIgfSldXG5cdFx0XHR9KSxcblx0XHRcdGNvbnRlbnRIZWlnaHQ6IFwiNTAlXCIsXG5cdFx0XHRjb250ZW50V2lkdGg6IFwiNTAlXCIsXG5cdFx0XHR2ZXJ0aWNhbFNjcm9sbGluZzogZmFsc2Vcblx0XHR9KTtcblx0XHRvRGlhbG9nLnNldEJlZ2luQnV0dG9uKFxuXHRcdFx0bmV3IEJ1dHRvbih7XG5cdFx0XHRcdHByZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCFpc011bHRpQ29udGV4dDQxMikge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRcdG9Nb2RlbC5zdWJtaXRCYXRjaChzR3JvdXBJZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0cmljdEhhbmRsaW5nUHJvbWlzZXMuZm9yRWFjaChmdW5jdGlvbiAoc0hQcm9taXNlOiBhbnkpIHtcblx0XHRcdFx0XHRcdFx0c0hQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdG9Nb2RlbC5zdWJtaXRCYXRjaChzSFByb21pc2UuZ3JvdXBJZCk7XG5cdFx0XHRcdFx0XHRcdGlmIChzSFByb21pc2UucmVxdWVzdFNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdFx0XHRcdFx0c0hQcm9taXNlLnJlcXVlc3RTaWRlRWZmZWN0cygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvbnN0IHN0cmljdEhhbmRsaW5nRmFpbHMgPSBtUGFyYW1ldGVycz8uaW50ZXJuYWxNb2RlbENvbnRleHQ/LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdGYWlsc1wiKTtcblx0XHRcdFx0XHRcdGlmIChzdHJpY3RIYW5kbGluZ0ZhaWxzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0bWVzc2FnZUhhbmRsZXI/LnJlbW92ZVRyYW5zaXRpb25NZXNzYWdlcygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcIjQxMk1lc3NhZ2VzXCIsIFtdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcIjQxMkV4ZWN1dGVkXCIsIHRydWUpO1xuXHRcdFx0XHRcdG9NZXNzYWdlRGlhbG9nTW9kZWwuc2V0RGF0YSh7fSk7XG5cdFx0XHRcdFx0b0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0eXBlOiBcIkVtcGhhc2l6ZWRcIixcblx0XHRcdFx0dGV4dDogc0FjdGlvbk5hbWVcblx0XHRcdH0pXG5cdFx0KTtcblx0XHRvRGlhbG9nLnNldEVuZEJ1dHRvbihcblx0XHRcdG5ldyBCdXR0b24oe1xuXHRcdFx0XHRwcmVzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG1QYXJhbWV0ZXJzPy5pbnRlcm5hbE1vZGVsQ29udGV4dD8uc2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiLCBbXSk7XG5cdFx0XHRcdFx0bVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcIjQxMkV4ZWN1dGVkXCIsIGZhbHNlKTtcblx0XHRcdFx0XHRpZiAoIWlzTXVsdGlDb250ZXh0NDEyKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3RyaWN0SGFuZGxpbmdQcm9taXNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzSFByb21pc2U6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRzSFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b01lc3NhZ2VEaWFsb2dNb2RlbC5zZXREYXRhKHt9KTtcblx0XHRcdFx0XHRvRGlhbG9nLmNsb3NlKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRleHQ6IHNDYW5jZWxCdXR0b25UeHRcblx0XHRcdH0pXG5cdFx0KTtcblx0XHRvRGlhbG9nLm9wZW4oKTtcblx0fVxufVxuXG5mdW5jdGlvbiBmbk9uU3RyaWN0SGFuZGxpbmdGYWlsZWQoXG5cdHNHcm91cElkOiBzdHJpbmcsXG5cdG1QYXJhbWV0ZXJzOiBhbnksXG5cdG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGUsXG5cdGN1cnJlbnRfY29udGV4dF9pbmRleDogbnVtYmVyIHwgbnVsbCxcblx0b0NvbnRleHQ6IGFueSxcblx0aUNvbnRleHRMZW5ndGg6IG51bWJlciB8IG51bGwsXG5cdG1lc3NhZ2VIYW5kbGVyOiBNZXNzYWdlSGFuZGxlciB8IHVuZGVmaW5lZCxcblx0YTQxMk1lc3NhZ2VzOiBNZXNzYWdlW11cbikge1xuXHRpZiAoKGN1cnJlbnRfY29udGV4dF9pbmRleCA9PT0gbnVsbCAmJiBpQ29udGV4dExlbmd0aCA9PT0gbnVsbCkgfHwgKGN1cnJlbnRfY29udGV4dF9pbmRleCA9PT0gMSAmJiBpQ29udGV4dExlbmd0aCA9PT0gMSkpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRcdG9wZXJhdGlvbnNIZWxwZXIucmVuZGVyTWVzc2FnZVZpZXcobVBhcmFtZXRlcnMsIG9SZXNvdXJjZUJ1bmRsZSwgbWVzc2FnZUhhbmRsZXIsIGE0MTJNZXNzYWdlcywgZmFsc2UsIHJlc29sdmUsIHNHcm91cElkKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBzQWN0aW9uTmFtZSA9IG1QYXJhbWV0ZXJzLmxhYmVsO1xuXHRcdGNvbnN0IGE0MTJUcmFuc2l0aW9uTWVzc2FnZXM6IE1lc3NhZ2VbXSA9IG1QYXJhbWV0ZXJzPy5pbnRlcm5hbE1vZGVsQ29udGV4dD8uZ2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiKTtcblx0XHRjb25zdCBzQ29sdW1uID0gbVBhcmFtZXRlcnMuY29udHJvbC5nZXRQYXJlbnQoKS5nZXRJZGVudGlmaWVyQ29sdW1uKCk7XG5cdFx0bGV0IHNWYWx1ZTogc3RyaW5nID0gXCJcIjtcblx0XHRpZiAoc0NvbHVtbiAmJiBpQ29udGV4dExlbmd0aCAmJiBpQ29udGV4dExlbmd0aCA+IDEpIHtcblx0XHRcdHNWYWx1ZSA9IG9Db250ZXh0ICYmIG9Db250ZXh0LmdldE9iamVjdChzQ29sdW1uKTtcblx0XHR9XG5cdFx0YTQxMk1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24gKG1zZzogTWVzc2FnZSkge1xuXHRcdFx0bXNnLnNldFR5cGUoXCJXYXJuaW5nXCIpO1xuXHRcdFx0bXNnLnNldEFkZGl0aW9uYWxUZXh0KHNWYWx1ZSk7XG5cdFx0XHRhNDEyVHJhbnNpdGlvbk1lc3NhZ2VzLnB1c2gobXNnKTtcblx0XHR9KTtcblx0XHRpZiAobVBhcmFtZXRlcnMuZGlhbG9nICYmIG1QYXJhbWV0ZXJzLmRpYWxvZy5pc09wZW4oKSkge1xuXHRcdFx0bVBhcmFtZXRlcnMuZGlhbG9nLmNsb3NlKCk7XG5cdFx0fVxuXHRcdGNvbnN0IHN0cmljdEhhbmRsaW5nUHJvbWlzZXMgPSBtUGFyYW1ldGVycz8uaW50ZXJuYWxNb2RlbENvbnRleHQ/LmdldFByb3BlcnR5KFwic3RyaWN0SGFuZGxpbmdQcm9taXNlc1wiKTtcblx0XHRjb25zdCBzdHJpY3RIYW5kbGluZ1Byb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0c3RyaWN0SGFuZGxpbmdQcm9taXNlcy5wdXNoKHtcblx0XHRcdFx0Z3JvdXBJZDogc0dyb3VwSWQsXG5cdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG5cdFx0XHRcdGFjdGlvbk5hbWU6IHNBY3Rpb25OYW1lLFxuXHRcdFx0XHRtb2RlbDogbVBhcmFtZXRlcnMubW9kZWwsXG5cdFx0XHRcdHZhbHVlOiBzVmFsdWUsXG5cdFx0XHRcdHJlcXVlc3RTaWRlRWZmZWN0czogbVBhcmFtZXRlcnMucmVxdWVzdFNpZGVFZmZlY3RzXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRtUGFyYW1ldGVycz8uaW50ZXJuYWxNb2RlbENvbnRleHQ/LnNldFByb3BlcnR5KFwiNDEyTWVzc2FnZXNcIiwgYTQxMlRyYW5zaXRpb25NZXNzYWdlcyk7XG5cdFx0bVBhcmFtZXRlcnM/LmludGVybmFsTW9kZWxDb250ZXh0Py5zZXRQcm9wZXJ0eShcInN0cmljdEhhbmRsaW5nUHJvbWlzZXNcIiwgc3RyaWN0SGFuZGxpbmdQcm9taXNlcyk7XG5cblx0XHRpZiAoY3VycmVudF9jb250ZXh0X2luZGV4ID09PSBpQ29udGV4dExlbmd0aCkge1xuXHRcdFx0b3BlcmF0aW9uc0hlbHBlci5yZW5kZXJNZXNzYWdlVmlldyhcblx0XHRcdFx0bVBhcmFtZXRlcnMsXG5cdFx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdFx0bWVzc2FnZUhhbmRsZXIsXG5cdFx0XHRcdG1QYXJhbWV0ZXJzPy5pbnRlcm5hbE1vZGVsQ29udGV4dD8uZ2V0UHJvcGVydHkoXCI0MTJNZXNzYWdlc1wiKSxcblx0XHRcdFx0dHJ1ZVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0cmljdEhhbmRsaW5nUHJvbWlzZTtcblx0fVxufVxuXG5jb25zdCBvcGVyYXRpb25zSGVscGVyID0ge1xuXHRyZW5kZXJNZXNzYWdlVmlldzogcmVuZGVyTWVzc2FnZVZpZXcsXG5cdGZuT25TdHJpY3RIYW5kbGluZ0ZhaWxlZDogZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBvcGVyYXRpb25zSGVscGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUFhQSxTQUFTQSxpQkFBVCxDQUNDQyxXQURELEVBRUNDLGVBRkQsRUFHQ0MsY0FIRCxFQUlD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