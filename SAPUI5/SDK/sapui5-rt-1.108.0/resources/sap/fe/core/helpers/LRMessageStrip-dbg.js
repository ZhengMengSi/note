/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core", "sap/ui/core/message/Message"], function (Core, Message) {
  "use strict";

  var _exports = {};

  var LRMessageStrip = /*#__PURE__*/function () {
    function LRMessageStrip() {
      var messageManager = Core.getMessageManager();
      this.customMessageInfo = {
        messageManagerDataBinding: messageManager.getMessageModel().bindList("/"),
        multiModeControlMessagesMap: {}
      };
    }

    _exports.LRMessageStrip = LRMessageStrip;
    var _proto = LRMessageStrip.prototype;

    _proto.getCustomMessageInfo = function getCustomMessageInfo() {
      return this.customMessageInfo;
    };

    _proto.destroy = function destroy() {
      this.customMessageInfo.messageManagerDataBinding.detachChange(this._eventHandlerCustomMessage, this);
    };

    _proto._getMessagesWithSameTargetThanCustomMessage = function _getMessagesWithSameTargetThanCustomMessage() {
      var _this = this;

      var messageManager = Core.getMessageManager();
      return messageManager.getMessageModel().getData().filter(function (msg) {
        var _this$customMessageIn;

        return msg.getTargets()[0] === ((_this$customMessageIn = _this.customMessageInfo.currentMessage) === null || _this$customMessageIn === void 0 ? void 0 : _this$customMessageIn.getTargets()[0]) && msg !== _this.customMessageInfo.currentMessage;
      });
    }
    /**
     * MessageManager Event Handler responsible to add or remove the current customMessage.
     *
     * @alias sap.fe.core.helpers.LRMessageStrip#_eventHandlerCustomMessage
     * @private
     */
    ;

    _proto._eventHandlerCustomMessage = function _eventHandlerCustomMessage() {
      var _this2 = this;

      var messageManager = Core.getMessageManager();

      if (this.customMessageInfo.currentMessage) {
        var aMessageWithSameTargetThanCustomMessage = this._getMessagesWithSameTargetThanCustomMessage();

        var isCustomMessageInMessageManager = !!messageManager.getMessageModel().getData().find(function (msg) {
          return msg === _this2.customMessageInfo.currentMessage;
        });

        if (aMessageWithSameTargetThanCustomMessage.length > 0 && isCustomMessageInMessageManager) {
          var _this$customMessageIn2;

          //if there are other messages with the same message on the MessageManager and the customMessage
          //then we need to remove the customeMessage from the MessageManager
          messageManager.removeMessages([(_this$customMessageIn2 = this.customMessageInfo) === null || _this$customMessageIn2 === void 0 ? void 0 : _this$customMessageIn2.currentMessage]);
        } else if (aMessageWithSameTargetThanCustomMessage.length === 0 && !isCustomMessageInMessageManager) {
          messageManager.addMessages([this.customMessageInfo.currentMessage]);
        }
      }
    }
    /**
     * This function manages the lifecycle of the custom message (populates the customMessageInfo object, attaches an event to the message manager and inserts a message).
     *
     * @param event Event object (optional).
     * @param oData Parameters
     * @param oData.message The LRCustomMessage to be used to generate the message object
     * @param oData.table The table targeted by the message
     * @param oData.skipMessageManagerUpdate Should skip to insert the message in the MessageManager
     * @alias sap.fe.core.helpers.LRMessageStrip#createCustomMessage
     * @private
     */
    ;

    _proto.createCustomMessage = function createCustomMessage(event, oData) {
      var _table$getRowBinding, _customMessageMap$tab;

      var message = oData.message;
      var table = oData.table;
      var skipMessageManagerUpdate = oData.skipMessageManagerUpdate;
      var rowBindingPath = (_table$getRowBinding = table.getRowBinding()) === null || _table$getRowBinding === void 0 ? void 0 : _table$getRowBinding.getPath();
      var messageManager = Core.getMessageManager();
      var customMessageMap = this.customMessageInfo.multiModeControlMessagesMap;
      customMessageMap[table.getId()] = message;

      if (!rowBindingPath) {
        table.attachEventOnce("bindingUpdated", oData, this.createCustomMessage, this);
        return;
      }

      if ((_customMessageMap$tab = customMessageMap[table.getId()]) !== null && _customMessageMap$tab !== void 0 && _customMessageMap$tab.onClose) {
        var _customMessageMap$tab2;

        table.getDataStateIndicator().detachEvent("close", (_customMessageMap$tab2 = customMessageMap[table.getId()]) === null || _customMessageMap$tab2 === void 0 ? void 0 : _customMessageMap$tab2.onClose, this);
      }

      var processor = table.getModel();
      var oMessage = message ? new Message({
        message: message.message,
        type: message.type,
        target: [rowBindingPath],
        persistent: true,
        processor: processor
      }) : null;
      this.customMessageInfo.messageManagerDataBinding.detachChange(this._eventHandlerCustomMessage, this);

      if (!skipMessageManagerUpdate) {
        if (this.customMessageInfo.currentMessage) {
          messageManager.removeMessages([this.customMessageInfo.currentMessage]);
        }

        if (oMessage) {
          this.customMessageInfo.currentMessage = oMessage;
        } else {
          delete this.customMessageInfo.currentMessage;
        }

        if (oMessage && this._getMessagesWithSameTargetThanCustomMessage().length === 0) {
          messageManager.addMessages([oMessage]);
        }
      }

      this.customMessageInfo.messageManagerDataBinding.attachChange(this._eventHandlerCustomMessage, this);
      this.attachDataStateIndicatorCloseEvent(table, customMessageMap, message === null || message === void 0 ? void 0 : message.onClose);
    }
    /**
     * This function attaches the onClose event function to the dataStateIndicator.
     *
     * @param table The table associated with the dataStateIndicator
     * @param customMessageMap The CustomMessageMap object
     * @param fnOnClose A function to be attached to the "close" event
     * @alias sap.fe.core.helpers.LRMessageStrip#attachDataStateIndicatorCloseEvent
     * @private
     */
    ;

    _proto.attachDataStateIndicatorCloseEvent = function attachDataStateIndicatorCloseEvent(table, customMessageMap, fnOnClose) {
      if (fnOnClose) {
        table.getDataStateIndicator().attachEventOnce("close", fnOnClose, this);
      } //When closing the the messageStrip, the associated message is removed


      table.getDataStateIndicator().attachEventOnce("close", function () {
        delete customMessageMap[table.getId()];
      });
    }
    /**
     * MultipleModeControl Event handler responsible for displaying the correct custom message when a specific tab is selected.
     *
     * @alias sap.fe.core.helpers.LRMessageStrip#onSelectMultipleModeControl
     * @private
     */
    ;

    _proto.onSelectMultipleModeControl = function onSelectMultipleModeControl(event, controller) {
      var table = controller._getTable();

      var message = this.customMessageInfo.multiModeControlMessagesMap[table.getId()];
      this.createCustomMessage(null, {
        message: message,
        table: table
      });
    }
    /**
     * Provide an option for showing a custom message in the message bar above the list report table.
     *
     * @param {object} [message] Custom message along with the message type to be set on the table.
     * @param {string} [message.message] Message string to be displayed.
     * @param {sap.ui.core.MessageType} [message.type] Indicates the type of message.
     * @param {ListReportController} [controller] Controller of the current view.
     * @param {string[]|string} [tabKey] The entitySet identifying the table in which to display the custom message.
     * @param {Function} [onClose] A function that is called when the user closes the message bar.
     * @private
     */
    ;

    _proto.showCustomMessage = function showCustomMessage(message, controller, tabKey, onClose) {
      var _this3 = this;

      var _tabKey = Array.isArray(tabKey) ? tabKey : [tabKey];

      var isMultiMode = controller._isMultiMode();

      var table;

      if (message) {
        message.onClose = onClose;
      }

      if (isMultiMode) {
        var multipleModeControl = controller._getMultiModeControl(); //we fisrt need to detach the select event to prevent multiple attachments.


        multipleModeControl.detachEvent("select", this.onSelectMultipleModeControl, this);
        multipleModeControl.attachEvent("select", controller, this.onSelectMultipleModeControl, this);
        multipleModeControl.getAllInnerControls(true).forEach(function (innerControl, index) {
          if (innerControl.isA("sap.fe.macros.table.TableAPI")) {
            if (!tabKey || _tabKey.indexOf(index.toString()) !== -1) {
              table = innerControl.getContent();

              _this3.createCustomMessage(null, {
                message: message,
                table: table,
                skipMessageManagerUpdate: multipleModeControl.getSelectedInnerControl() !== innerControl
              });
            }
          }
        });
        return;
      }

      table = controller._getTable();
      this.createCustomMessage(null, {
        message: message,
        table: table
      });
    };

    return LRMessageStrip;
  }();

  _exports.LRMessageStrip = LRMessageStrip;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJMUk1lc3NhZ2VTdHJpcCIsIm1lc3NhZ2VNYW5hZ2VyIiwiQ29yZSIsImdldE1lc3NhZ2VNYW5hZ2VyIiwiY3VzdG9tTWVzc2FnZUluZm8iLCJtZXNzYWdlTWFuYWdlckRhdGFCaW5kaW5nIiwiZ2V0TWVzc2FnZU1vZGVsIiwiYmluZExpc3QiLCJtdWx0aU1vZGVDb250cm9sTWVzc2FnZXNNYXAiLCJnZXRDdXN0b21NZXNzYWdlSW5mbyIsImRlc3Ryb3kiLCJkZXRhY2hDaGFuZ2UiLCJfZXZlbnRIYW5kbGVyQ3VzdG9tTWVzc2FnZSIsIl9nZXRNZXNzYWdlc1dpdGhTYW1lVGFyZ2V0VGhhbkN1c3RvbU1lc3NhZ2UiLCJnZXREYXRhIiwiZmlsdGVyIiwibXNnIiwiZ2V0VGFyZ2V0cyIsImN1cnJlbnRNZXNzYWdlIiwiYU1lc3NhZ2VXaXRoU2FtZVRhcmdldFRoYW5DdXN0b21NZXNzYWdlIiwiaXNDdXN0b21NZXNzYWdlSW5NZXNzYWdlTWFuYWdlciIsImZpbmQiLCJsZW5ndGgiLCJyZW1vdmVNZXNzYWdlcyIsImFkZE1lc3NhZ2VzIiwiY3JlYXRlQ3VzdG9tTWVzc2FnZSIsImV2ZW50Iiwib0RhdGEiLCJtZXNzYWdlIiwidGFibGUiLCJza2lwTWVzc2FnZU1hbmFnZXJVcGRhdGUiLCJyb3dCaW5kaW5nUGF0aCIsImdldFJvd0JpbmRpbmciLCJnZXRQYXRoIiwiY3VzdG9tTWVzc2FnZU1hcCIsImdldElkIiwiYXR0YWNoRXZlbnRPbmNlIiwib25DbG9zZSIsImdldERhdGFTdGF0ZUluZGljYXRvciIsImRldGFjaEV2ZW50IiwicHJvY2Vzc29yIiwiZ2V0TW9kZWwiLCJvTWVzc2FnZSIsIk1lc3NhZ2UiLCJ0eXBlIiwidGFyZ2V0IiwicGVyc2lzdGVudCIsImF0dGFjaENoYW5nZSIsImF0dGFjaERhdGFTdGF0ZUluZGljYXRvckNsb3NlRXZlbnQiLCJmbk9uQ2xvc2UiLCJvblNlbGVjdE11bHRpcGxlTW9kZUNvbnRyb2wiLCJjb250cm9sbGVyIiwiX2dldFRhYmxlIiwic2hvd0N1c3RvbU1lc3NhZ2UiLCJ0YWJLZXkiLCJfdGFiS2V5IiwiQXJyYXkiLCJpc0FycmF5IiwiaXNNdWx0aU1vZGUiLCJfaXNNdWx0aU1vZGUiLCJtdWx0aXBsZU1vZGVDb250cm9sIiwiX2dldE11bHRpTW9kZUNvbnRyb2wiLCJhdHRhY2hFdmVudCIsImdldEFsbElubmVyQ29udHJvbHMiLCJmb3JFYWNoIiwiaW5uZXJDb250cm9sIiwiaW5kZXgiLCJpc0EiLCJpbmRleE9mIiwidG9TdHJpbmciLCJnZXRDb250ZW50IiwiZ2V0U2VsZWN0ZWRJbm5lckNvbnRyb2wiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkxSTWVzc2FnZVN0cmlwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElubmVyQ29udHJvbFR5cGUgfSBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9MaXN0UmVwb3J0L2NvbnRyb2xzL011bHRpcGxlTW9kZUNvbnRyb2xcIjtcbmltcG9ydCB0eXBlIExpc3RSZXBvcnRDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvdGVtcGxhdGVzL0xpc3RSZXBvcnQvTGlzdFJlcG9ydENvbnRyb2xsZXIuY29udHJvbGxlclwiO1xuaW1wb3J0IEV2ZW50IGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcInNhcC91aS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCJzYXAvdWkvY29yZS9tZXNzYWdlL01lc3NhZ2VcIjtcbmltcG9ydCB0eXBlIFRhYmxlIGZyb20gXCJzYXAvdWkvbWRjL1RhYmxlXCI7XG5pbXBvcnQgTGlzdEJpbmRpbmcgZnJvbSBcInNhcC91aS9tb2RlbC9MaXN0QmluZGluZ1wiO1xuXG5leHBvcnQgdHlwZSBMUkN1c3RvbU1lc3NhZ2UgPSB7XG5cdG1lc3NhZ2U6IHN0cmluZztcblx0dHlwZT86IE1lc3NhZ2VUeXBlO1xuXHRvbkNsb3NlPzogRnVuY3Rpb247XG59O1xuXG5leHBvcnQgY2xhc3MgTFJNZXNzYWdlU3RyaXAge1xuXHRjdXN0b21NZXNzYWdlSW5mbyE6IHtcblx0XHRtZXNzYWdlTWFuYWdlckRhdGFCaW5kaW5nOiBMaXN0QmluZGluZztcblx0XHRjdXJyZW50TWVzc2FnZT86IE1lc3NhZ2U7XG5cdFx0bXVsdGlNb2RlQ29udHJvbE1lc3NhZ2VzTWFwOiB7IFtrZXk6IHN0cmluZ106IExSQ3VzdG9tTWVzc2FnZSB8IHVuZGVmaW5lZCB9O1xuXHR9O1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRjb25zdCBtZXNzYWdlTWFuYWdlciA9IENvcmUuZ2V0TWVzc2FnZU1hbmFnZXIoKTtcblx0XHR0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvID0ge1xuXHRcdFx0bWVzc2FnZU1hbmFnZXJEYXRhQmluZGluZzogbWVzc2FnZU1hbmFnZXIuZ2V0TWVzc2FnZU1vZGVsKCkuYmluZExpc3QoXCIvXCIpLFxuXHRcdFx0bXVsdGlNb2RlQ29udHJvbE1lc3NhZ2VzTWFwOiB7fVxuXHRcdH07XG5cdH1cblx0Z2V0Q3VzdG9tTWVzc2FnZUluZm8oKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3VzdG9tTWVzc2FnZUluZm87XG5cdH1cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLm1lc3NhZ2VNYW5hZ2VyRGF0YUJpbmRpbmcuZGV0YWNoQ2hhbmdlKHRoaXMuX2V2ZW50SGFuZGxlckN1c3RvbU1lc3NhZ2UsIHRoaXMpO1xuXHR9XG5cdF9nZXRNZXNzYWdlc1dpdGhTYW1lVGFyZ2V0VGhhbkN1c3RvbU1lc3NhZ2UoKSB7XG5cdFx0Y29uc3QgbWVzc2FnZU1hbmFnZXIgPSBDb3JlLmdldE1lc3NhZ2VNYW5hZ2VyKCk7XG5cdFx0cmV0dXJuIG1lc3NhZ2VNYW5hZ2VyXG5cdFx0XHQuZ2V0TWVzc2FnZU1vZGVsKClcblx0XHRcdC5nZXREYXRhKClcblx0XHRcdC5maWx0ZXIoXG5cdFx0XHRcdChtc2c6IE1lc3NhZ2UpID0+XG5cdFx0XHRcdFx0bXNnLmdldFRhcmdldHMoKVswXSA9PT0gdGhpcy5jdXN0b21NZXNzYWdlSW5mby5jdXJyZW50TWVzc2FnZT8uZ2V0VGFyZ2V0cygpWzBdICYmXG5cdFx0XHRcdFx0bXNnICE9PSB0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLmN1cnJlbnRNZXNzYWdlXG5cdFx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1lc3NhZ2VNYW5hZ2VyIEV2ZW50IEhhbmRsZXIgcmVzcG9uc2libGUgdG8gYWRkIG9yIHJlbW92ZSB0aGUgY3VycmVudCBjdXN0b21NZXNzYWdlLlxuXHQgKlxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuaGVscGVycy5MUk1lc3NhZ2VTdHJpcCNfZXZlbnRIYW5kbGVyQ3VzdG9tTWVzc2FnZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2V2ZW50SGFuZGxlckN1c3RvbU1lc3NhZ2UoKSB7XG5cdFx0Y29uc3QgbWVzc2FnZU1hbmFnZXIgPSBDb3JlLmdldE1lc3NhZ2VNYW5hZ2VyKCk7XG5cdFx0aWYgKHRoaXMuY3VzdG9tTWVzc2FnZUluZm8uY3VycmVudE1lc3NhZ2UpIHtcblx0XHRcdGNvbnN0IGFNZXNzYWdlV2l0aFNhbWVUYXJnZXRUaGFuQ3VzdG9tTWVzc2FnZSA9IHRoaXMuX2dldE1lc3NhZ2VzV2l0aFNhbWVUYXJnZXRUaGFuQ3VzdG9tTWVzc2FnZSgpO1xuXHRcdFx0Y29uc3QgaXNDdXN0b21NZXNzYWdlSW5NZXNzYWdlTWFuYWdlciA9ICEhbWVzc2FnZU1hbmFnZXJcblx0XHRcdFx0LmdldE1lc3NhZ2VNb2RlbCgpXG5cdFx0XHRcdC5nZXREYXRhKClcblx0XHRcdFx0LmZpbmQoKG1zZzogTWVzc2FnZSkgPT4gbXNnID09PSB0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLmN1cnJlbnRNZXNzYWdlKTtcblxuXHRcdFx0aWYgKGFNZXNzYWdlV2l0aFNhbWVUYXJnZXRUaGFuQ3VzdG9tTWVzc2FnZS5sZW5ndGggPiAwICYmIGlzQ3VzdG9tTWVzc2FnZUluTWVzc2FnZU1hbmFnZXIpIHtcblx0XHRcdFx0Ly9pZiB0aGVyZSBhcmUgb3RoZXIgbWVzc2FnZXMgd2l0aCB0aGUgc2FtZSBtZXNzYWdlIG9uIHRoZSBNZXNzYWdlTWFuYWdlciBhbmQgdGhlIGN1c3RvbU1lc3NhZ2Vcblx0XHRcdFx0Ly90aGVuIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBjdXN0b21lTWVzc2FnZSBmcm9tIHRoZSBNZXNzYWdlTWFuYWdlclxuXHRcdFx0XHRtZXNzYWdlTWFuYWdlci5yZW1vdmVNZXNzYWdlcyhbdGhpcy5jdXN0b21NZXNzYWdlSW5mbz8uY3VycmVudE1lc3NhZ2VdKTtcblx0XHRcdH0gZWxzZSBpZiAoYU1lc3NhZ2VXaXRoU2FtZVRhcmdldFRoYW5DdXN0b21NZXNzYWdlLmxlbmd0aCA9PT0gMCAmJiAhaXNDdXN0b21NZXNzYWdlSW5NZXNzYWdlTWFuYWdlcikge1xuXHRcdFx0XHRtZXNzYWdlTWFuYWdlci5hZGRNZXNzYWdlcyhbdGhpcy5jdXN0b21NZXNzYWdlSW5mby5jdXJyZW50TWVzc2FnZV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIG1hbmFnZXMgdGhlIGxpZmVjeWNsZSBvZiB0aGUgY3VzdG9tIG1lc3NhZ2UgKHBvcHVsYXRlcyB0aGUgY3VzdG9tTWVzc2FnZUluZm8gb2JqZWN0LCBhdHRhY2hlcyBhbiBldmVudCB0byB0aGUgbWVzc2FnZSBtYW5hZ2VyIGFuZCBpbnNlcnRzIGEgbWVzc2FnZSkuXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudCBFdmVudCBvYmplY3QgKG9wdGlvbmFsKS5cblx0ICogQHBhcmFtIG9EYXRhIFBhcmFtZXRlcnNcblx0ICogQHBhcmFtIG9EYXRhLm1lc3NhZ2UgVGhlIExSQ3VzdG9tTWVzc2FnZSB0byBiZSB1c2VkIHRvIGdlbmVyYXRlIHRoZSBtZXNzYWdlIG9iamVjdFxuXHQgKiBAcGFyYW0gb0RhdGEudGFibGUgVGhlIHRhYmxlIHRhcmdldGVkIGJ5IHRoZSBtZXNzYWdlXG5cdCAqIEBwYXJhbSBvRGF0YS5za2lwTWVzc2FnZU1hbmFnZXJVcGRhdGUgU2hvdWxkIHNraXAgdG8gaW5zZXJ0IHRoZSBtZXNzYWdlIGluIHRoZSBNZXNzYWdlTWFuYWdlclxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuaGVscGVycy5MUk1lc3NhZ2VTdHJpcCNjcmVhdGVDdXN0b21NZXNzYWdlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRjcmVhdGVDdXN0b21NZXNzYWdlKFxuXHRcdGV2ZW50OiBFdmVudCB8IG51bGwsXG5cdFx0b0RhdGE6IHsgbWVzc2FnZTogTFJDdXN0b21NZXNzYWdlIHwgdW5kZWZpbmVkOyB0YWJsZTogVGFibGU7IHNraXBNZXNzYWdlTWFuYWdlclVwZGF0ZT86IGJvb2xlYW4gfVxuXHQpIHtcblx0XHRjb25zdCBtZXNzYWdlID0gb0RhdGEubWVzc2FnZTtcblx0XHRjb25zdCB0YWJsZSA9IG9EYXRhLnRhYmxlO1xuXHRcdGNvbnN0IHNraXBNZXNzYWdlTWFuYWdlclVwZGF0ZSA9IG9EYXRhLnNraXBNZXNzYWdlTWFuYWdlclVwZGF0ZTtcblx0XHRjb25zdCByb3dCaW5kaW5nUGF0aCA9IHRhYmxlLmdldFJvd0JpbmRpbmcoKT8uZ2V0UGF0aCgpO1xuXHRcdGNvbnN0IG1lc3NhZ2VNYW5hZ2VyID0gQ29yZS5nZXRNZXNzYWdlTWFuYWdlcigpO1xuXHRcdGNvbnN0IGN1c3RvbU1lc3NhZ2VNYXAgPSB0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLm11bHRpTW9kZUNvbnRyb2xNZXNzYWdlc01hcDtcblx0XHRjdXN0b21NZXNzYWdlTWFwW3RhYmxlLmdldElkKCldID0gbWVzc2FnZTtcblx0XHRpZiAoIXJvd0JpbmRpbmdQYXRoKSB7XG5cdFx0XHR0YWJsZS5hdHRhY2hFdmVudE9uY2UoXCJiaW5kaW5nVXBkYXRlZFwiLCBvRGF0YSwgdGhpcy5jcmVhdGVDdXN0b21NZXNzYWdlLCB0aGlzKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoY3VzdG9tTWVzc2FnZU1hcFt0YWJsZS5nZXRJZCgpXT8ub25DbG9zZSkge1xuXHRcdFx0dGFibGUuZ2V0RGF0YVN0YXRlSW5kaWNhdG9yKCkuZGV0YWNoRXZlbnQoXCJjbG9zZVwiLCBjdXN0b21NZXNzYWdlTWFwW3RhYmxlLmdldElkKCldPy5vbkNsb3NlIGFzIEZ1bmN0aW9uLCB0aGlzKTtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9jZXNzb3IgPSB0YWJsZS5nZXRNb2RlbCgpO1xuXHRcdGNvbnN0IG9NZXNzYWdlID0gbWVzc2FnZVxuXHRcdFx0PyBuZXcgTWVzc2FnZSh7XG5cdFx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZS5tZXNzYWdlLFxuXHRcdFx0XHRcdHR5cGU6IG1lc3NhZ2UudHlwZSxcblx0XHRcdFx0XHR0YXJnZXQ6IFtyb3dCaW5kaW5nUGF0aF0sXG5cdFx0XHRcdFx0cGVyc2lzdGVudDogdHJ1ZSxcblx0XHRcdFx0XHRwcm9jZXNzb3Jcblx0XHRcdCAgfSlcblx0XHRcdDogbnVsbDtcblxuXHRcdHRoaXMuY3VzdG9tTWVzc2FnZUluZm8ubWVzc2FnZU1hbmFnZXJEYXRhQmluZGluZy5kZXRhY2hDaGFuZ2UodGhpcy5fZXZlbnRIYW5kbGVyQ3VzdG9tTWVzc2FnZSwgdGhpcyk7XG5cdFx0aWYgKCFza2lwTWVzc2FnZU1hbmFnZXJVcGRhdGUpIHtcblx0XHRcdGlmICh0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLmN1cnJlbnRNZXNzYWdlKSB7XG5cdFx0XHRcdG1lc3NhZ2VNYW5hZ2VyLnJlbW92ZU1lc3NhZ2VzKFt0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLmN1cnJlbnRNZXNzYWdlXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob01lc3NhZ2UpIHtcblx0XHRcdFx0dGhpcy5jdXN0b21NZXNzYWdlSW5mby5jdXJyZW50TWVzc2FnZSA9IG9NZXNzYWdlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuY3VzdG9tTWVzc2FnZUluZm8uY3VycmVudE1lc3NhZ2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAob01lc3NhZ2UgJiYgdGhpcy5fZ2V0TWVzc2FnZXNXaXRoU2FtZVRhcmdldFRoYW5DdXN0b21NZXNzYWdlKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdG1lc3NhZ2VNYW5hZ2VyLmFkZE1lc3NhZ2VzKFtvTWVzc2FnZV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmN1c3RvbU1lc3NhZ2VJbmZvLm1lc3NhZ2VNYW5hZ2VyRGF0YUJpbmRpbmcuYXR0YWNoQ2hhbmdlKHRoaXMuX2V2ZW50SGFuZGxlckN1c3RvbU1lc3NhZ2UsIHRoaXMpO1xuXG5cdFx0dGhpcy5hdHRhY2hEYXRhU3RhdGVJbmRpY2F0b3JDbG9zZUV2ZW50KHRhYmxlLCBjdXN0b21NZXNzYWdlTWFwLCBtZXNzYWdlPy5vbkNsb3NlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGF0dGFjaGVzIHRoZSBvbkNsb3NlIGV2ZW50IGZ1bmN0aW9uIHRvIHRoZSBkYXRhU3RhdGVJbmRpY2F0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSB0YWJsZSBUaGUgdGFibGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRhU3RhdGVJbmRpY2F0b3Jcblx0ICogQHBhcmFtIGN1c3RvbU1lc3NhZ2VNYXAgVGhlIEN1c3RvbU1lc3NhZ2VNYXAgb2JqZWN0XG5cdCAqIEBwYXJhbSBmbk9uQ2xvc2UgQSBmdW5jdGlvbiB0byBiZSBhdHRhY2hlZCB0byB0aGUgXCJjbG9zZVwiIGV2ZW50XG5cdCAqIEBhbGlhcyBzYXAuZmUuY29yZS5oZWxwZXJzLkxSTWVzc2FnZVN0cmlwI2F0dGFjaERhdGFTdGF0ZUluZGljYXRvckNsb3NlRXZlbnRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGF0dGFjaERhdGFTdGF0ZUluZGljYXRvckNsb3NlRXZlbnQoXG5cdFx0dGFibGU6IFRhYmxlLFxuXHRcdGN1c3RvbU1lc3NhZ2VNYXA6IHsgW2tleTogc3RyaW5nXTogTFJDdXN0b21NZXNzYWdlIHwgdW5kZWZpbmVkIH0sXG5cdFx0Zm5PbkNsb3NlPzogRnVuY3Rpb25cblx0KSB7XG5cdFx0aWYgKGZuT25DbG9zZSkge1xuXHRcdFx0dGFibGUuZ2V0RGF0YVN0YXRlSW5kaWNhdG9yKCkuYXR0YWNoRXZlbnRPbmNlKFwiY2xvc2VcIiwgZm5PbkNsb3NlLCB0aGlzKTtcblx0XHR9XG5cdFx0Ly9XaGVuIGNsb3NpbmcgdGhlIHRoZSBtZXNzYWdlU3RyaXAsIHRoZSBhc3NvY2lhdGVkIG1lc3NhZ2UgaXMgcmVtb3ZlZFxuXHRcdHRhYmxlLmdldERhdGFTdGF0ZUluZGljYXRvcigpLmF0dGFjaEV2ZW50T25jZShcImNsb3NlXCIsICgpID0+IHtcblx0XHRcdGRlbGV0ZSBjdXN0b21NZXNzYWdlTWFwW3RhYmxlLmdldElkKCldO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE11bHRpcGxlTW9kZUNvbnRyb2wgRXZlbnQgaGFuZGxlciByZXNwb25zaWJsZSBmb3IgZGlzcGxheWluZyB0aGUgY29ycmVjdCBjdXN0b20gbWVzc2FnZSB3aGVuIGEgc3BlY2lmaWMgdGFiIGlzIHNlbGVjdGVkLlxuXHQgKlxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuaGVscGVycy5MUk1lc3NhZ2VTdHJpcCNvblNlbGVjdE11bHRpcGxlTW9kZUNvbnRyb2xcblx0ICogQHByaXZhdGVcblx0ICovXG5cblx0b25TZWxlY3RNdWx0aXBsZU1vZGVDb250cm9sKGV2ZW50OiBFdmVudCwgY29udHJvbGxlcjogTGlzdFJlcG9ydENvbnRyb2xsZXIpIHtcblx0XHRjb25zdCB0YWJsZSA9IGNvbnRyb2xsZXIuX2dldFRhYmxlKCkgYXMgVGFibGU7XG5cdFx0Y29uc3QgbWVzc2FnZSA9IHRoaXMuY3VzdG9tTWVzc2FnZUluZm8ubXVsdGlNb2RlQ29udHJvbE1lc3NhZ2VzTWFwW3RhYmxlLmdldElkKCldO1xuXHRcdHRoaXMuY3JlYXRlQ3VzdG9tTWVzc2FnZShudWxsLCB7IG1lc3NhZ2UsIHRhYmxlIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByb3ZpZGUgYW4gb3B0aW9uIGZvciBzaG93aW5nIGEgY3VzdG9tIG1lc3NhZ2UgaW4gdGhlIG1lc3NhZ2UgYmFyIGFib3ZlIHRoZSBsaXN0IHJlcG9ydCB0YWJsZS5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IFttZXNzYWdlXSBDdXN0b20gbWVzc2FnZSBhbG9uZyB3aXRoIHRoZSBtZXNzYWdlIHR5cGUgdG8gYmUgc2V0IG9uIHRoZSB0YWJsZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlLm1lc3NhZ2VdIE1lc3NhZ2Ugc3RyaW5nIHRvIGJlIGRpc3BsYXllZC5cblx0ICogQHBhcmFtIHtzYXAudWkuY29yZS5NZXNzYWdlVHlwZX0gW21lc3NhZ2UudHlwZV0gSW5kaWNhdGVzIHRoZSB0eXBlIG9mIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7TGlzdFJlcG9ydENvbnRyb2xsZXJ9IFtjb250cm9sbGVyXSBDb250cm9sbGVyIG9mIHRoZSBjdXJyZW50IHZpZXcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nW118c3RyaW5nfSBbdGFiS2V5XSBUaGUgZW50aXR5U2V0IGlkZW50aWZ5aW5nIHRoZSB0YWJsZSBpbiB3aGljaCB0byBkaXNwbGF5IHRoZSBjdXN0b20gbWVzc2FnZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ2xvc2VdIEEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjbG9zZXMgdGhlIG1lc3NhZ2UgYmFyLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0c2hvd0N1c3RvbU1lc3NhZ2UoXG5cdFx0bWVzc2FnZTogTFJDdXN0b21NZXNzYWdlIHwgdW5kZWZpbmVkLFxuXHRcdGNvbnRyb2xsZXI6IExpc3RSZXBvcnRDb250cm9sbGVyLFxuXHRcdHRhYktleT86IHN0cmluZ1tdIHwgc3RyaW5nIHwgbnVsbCxcblx0XHRvbkNsb3NlPzogRnVuY3Rpb25cblx0KSB7XG5cdFx0Y29uc3QgX3RhYktleSA9IEFycmF5LmlzQXJyYXkodGFiS2V5KSA/IHRhYktleSA6IFt0YWJLZXldO1xuXHRcdGNvbnN0IGlzTXVsdGlNb2RlID0gY29udHJvbGxlci5faXNNdWx0aU1vZGUoKTtcblx0XHRsZXQgdGFibGU6IFRhYmxlO1xuXHRcdGlmIChtZXNzYWdlKSB7XG5cdFx0XHRtZXNzYWdlLm9uQ2xvc2UgPSBvbkNsb3NlO1xuXHRcdH1cblx0XHRpZiAoaXNNdWx0aU1vZGUpIHtcblx0XHRcdGNvbnN0IG11bHRpcGxlTW9kZUNvbnRyb2wgPSBjb250cm9sbGVyLl9nZXRNdWx0aU1vZGVDb250cm9sKCk7XG5cdFx0XHQvL3dlIGZpc3J0IG5lZWQgdG8gZGV0YWNoIHRoZSBzZWxlY3QgZXZlbnQgdG8gcHJldmVudCBtdWx0aXBsZSBhdHRhY2htZW50cy5cblx0XHRcdG11bHRpcGxlTW9kZUNvbnRyb2wuZGV0YWNoRXZlbnQoXCJzZWxlY3RcIiwgdGhpcy5vblNlbGVjdE11bHRpcGxlTW9kZUNvbnRyb2wsIHRoaXMpO1xuXHRcdFx0bXVsdGlwbGVNb2RlQ29udHJvbC5hdHRhY2hFdmVudChcInNlbGVjdFwiLCBjb250cm9sbGVyLCB0aGlzLm9uU2VsZWN0TXVsdGlwbGVNb2RlQ29udHJvbCwgdGhpcyk7XG5cblx0XHRcdG11bHRpcGxlTW9kZUNvbnRyb2wuZ2V0QWxsSW5uZXJDb250cm9scyh0cnVlKS5mb3JFYWNoKChpbm5lckNvbnRyb2w6IElubmVyQ29udHJvbFR5cGUsIGluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdFx0aWYgKGlubmVyQ29udHJvbC5pc0EoXCJzYXAuZmUubWFjcm9zLnRhYmxlLlRhYmxlQVBJXCIpKSB7XG5cdFx0XHRcdFx0aWYgKCF0YWJLZXkgfHwgX3RhYktleS5pbmRleE9mKGluZGV4LnRvU3RyaW5nKCkpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0dGFibGUgPSAoaW5uZXJDb250cm9sIGFzIGFueSkuZ2V0Q29udGVudCgpO1xuXHRcdFx0XHRcdFx0dGhpcy5jcmVhdGVDdXN0b21NZXNzYWdlKG51bGwsIHtcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRcdFx0dGFibGUsXG5cdFx0XHRcdFx0XHRcdHNraXBNZXNzYWdlTWFuYWdlclVwZGF0ZTogbXVsdGlwbGVNb2RlQ29udHJvbC5nZXRTZWxlY3RlZElubmVyQ29udHJvbCgpICE9PSBpbm5lckNvbnRyb2xcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGFibGUgPSBjb250cm9sbGVyLl9nZXRUYWJsZSgpIGFzIFRhYmxlO1xuXHRcdHRoaXMuY3JlYXRlQ3VzdG9tTWVzc2FnZShudWxsLCB7IG1lc3NhZ2UsIHRhYmxlIH0pO1xuXHR9XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztNQWVhQSxjO0lBTVosMEJBQWM7TUFDYixJQUFNQyxjQUFjLEdBQUdDLElBQUksQ0FBQ0MsaUJBQUwsRUFBdkI7TUFDQSxLQUFLQyxpQkFBTCxHQUF5QjtRQUN4QkMseUJBQXlCLEVBQUVKLGNBQWMsQ0FBQ0ssZUFBZixHQUFpQ0MsUUFBakMsQ0FBMEMsR0FBMUMsQ0FESDtRQUV4QkMsMkJBQTJCLEVBQUU7TUFGTCxDQUF6QjtJQUlBOzs7OztXQUNEQyxvQixHQUFBLGdDQUF1QjtNQUN0QixPQUFPLEtBQUtMLGlCQUFaO0lBQ0EsQzs7V0FDRE0sTyxHQUFBLG1CQUFVO01BQ1QsS0FBS04saUJBQUwsQ0FBdUJDLHlCQUF2QixDQUFpRE0sWUFBakQsQ0FBOEQsS0FBS0MsMEJBQW5FLEVBQStGLElBQS9GO0lBQ0EsQzs7V0FDREMsMkMsR0FBQSx1REFBOEM7TUFBQTs7TUFDN0MsSUFBTVosY0FBYyxHQUFHQyxJQUFJLENBQUNDLGlCQUFMLEVBQXZCO01BQ0EsT0FBT0YsY0FBYyxDQUNuQkssZUFESyxHQUVMUSxPQUZLLEdBR0xDLE1BSEssQ0FJTCxVQUFDQyxHQUFEO1FBQUE7O1FBQUEsT0FDQ0EsR0FBRyxDQUFDQyxVQUFKLEdBQWlCLENBQWpCLGdDQUF3QixLQUFJLENBQUNiLGlCQUFMLENBQXVCYyxjQUEvQywwREFBd0Isc0JBQXVDRCxVQUF2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