/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/controllerextensions/collaboration/ActivityBase", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/core/controllerextensions/editFlow/draft", "sap/ui/model/json/JSONModel"], function (Log, ActivityBase, CollaborationCommon, draft, JSONModel) {
  "use strict";

  var Activity = CollaborationCommon.Activity;
  var initializeCollaboration = ActivityBase.initializeCollaboration;
  var endCollaboration = ActivityBase.endCollaboration;
  var broadcastCollaborationMessage = ActivityBase.broadcastCollaborationMessage;

  var CollaborationAPI = {
    _lastReceivedMessage: undefined,
    _rootPath: "",
    _oModel: undefined,
    _lockedPropertyPath: "",
    _internalModel: undefined,

    /**
     * Open an existing collaborative draft with a new user, and creates a 'ghost client' for this user.
     *
     * @param oContext The context of the collaborative draft
     * @param userID The ID of the user
     * @param userName The name of the user
     */
    enterDraft: function (oContext, userID, userName) {
      var webSocketBaseURL = oContext.getModel().getMetaModel().getObject("/@com.sap.vocabularies.Common.v1.WebSocketBaseURL");

      if (!webSocketBaseURL) {
        Log.error("Cannot find WebSocketBaseURL annotation");
        return;
      }

      var sDraftUUID = oContext.getProperty("DraftAdministrativeData/DraftUUID");
      this._internalModel = new JSONModel({});
      var serviceUrl = oContext.getModel().getServiceUrl();
      initializeCollaboration({
        id: userID,
        name: userName,
        initialName: userName
      }, webSocketBaseURL, sDraftUUID, serviceUrl, this._internalModel, this._onMessageReceived.bind(this), true);
      this._rootPath = oContext.getPath();
      this._oModel = oContext.getModel();
    },

    /**
     * Checks if the ghost client has revieved a given message.
     *
     * @param message The message content to be looked for
     * @returns True if the last recieved message matches the content
     */
    checkReceived: function (message) {
      if (!this._lastReceivedMessage) {
        return false;
      }

      var found = (!message.userID || message.userID === this._lastReceivedMessage.userID) && (!message.userAction || message.userAction === this._lastReceivedMessage.userAction) && (!message.clientContent || message.clientContent === this._lastReceivedMessage.clientContent);
      this._lastReceivedMessage = undefined; // reset history to avoid finding the same message twice

      return found;
    },

    /**
     * Closes the ghost client and removes the user from the collaborative draft.
     */
    leaveDraft: function () {
      if (this._internalModel) {
        endCollaboration(this._internalModel);

        this._internalModel.destroy();

        this._internalModel = undefined;
      }
    },

    /**
     * Simulates that the user starts typing in an input (live change).
     *
     * @param sPropertyPath The path of the property being modified
     */
    startLiveChange: function (sPropertyPath) {
      if (this._internalModel) {
        if (this._lockedPropertyPath) {
          // Unlock previous property path
          this.undoChange();
        }

        this._lockedPropertyPath = sPropertyPath;
        broadcastCollaborationMessage(Activity.LiveChange, "".concat(this._rootPath, "/").concat(sPropertyPath), this._internalModel);
      }
    },

    /**
     * Simulates that the user has modified a property.
     *
     * @param sPropertyPath The path of the property being modified
     * @param value The new value of the property being modified
     */
    updatePropertyValue: function (sPropertyPath, value) {
      var _this = this;

      if (this._internalModel) {
        if (this._lockedPropertyPath !== sPropertyPath) {
          this.startLiveChange(sPropertyPath);
        }

        var oContextBinding = this._oModel.bindContext(this._rootPath, undefined, {
          $$patchWithoutSideEffects: true,
          $$groupId: "$auto",
          $$updateGroupId: "$auto"
        });

        var oPropertyBinding = this._oModel.bindProperty(sPropertyPath, oContextBinding.getBoundContext());

        oPropertyBinding.requestValue().then(function () {
          oPropertyBinding.setValue(value);
          oContextBinding.attachEventOnce("patchCompleted", function () {
            broadcastCollaborationMessage(Activity.Change, "".concat(_this._rootPath, "/").concat(sPropertyPath), _this._internalModel);
            _this._lockedPropertyPath = "";
          });
        }).catch(function (err) {
          Log.error(err);
        });
      }
    },

    /**
     * Simulates that the user did an 'undo' (to be called after startLiveChange).
     */
    undoChange: function () {
      if (this._lockedPropertyPath) {
        broadcastCollaborationMessage(Activity.Undo, "".concat(this._rootPath, "/").concat(this._lockedPropertyPath), this._internalModel);
        this._lockedPropertyPath = "";
      }
    },

    /**
     * Simulates that the user has discarded the draft.
     */
    discardDraft: function () {
      var _this2 = this;

      if (this._internalModel) {
        var draftContext = this._getDraftContext();

        draftContext.requestProperty("IsActiveEntity").then(function () {
          draft.deleteDraft(draftContext);
        }).then(function () {
          broadcastCollaborationMessage(Activity.Discard, _this2._rootPath.replace("IsActiveEntity=false", "IsActiveEntity=true"), _this2._internalModel);

          _this2._internalModel.destroy();

          _this2._internalModel = undefined;
        }).catch(function (err) {
          Log.error(err);
        });
      }
    },

    /**
     * Simulates that the user has deleted the draft.
     */
    deleteDraft: function () {
      var _this3 = this;

      if (this._internalModel) {
        var draftContext = this._getDraftContext();

        var activeContext;
        draftContext.requestProperty("IsActiveEntity").then(function () {
          return draftContext.getModel().bindContext("".concat(_this3._rootPath, "/SiblingEntity")).getBoundContext();
        }).then(function (context) {
          activeContext = context;
          return context.requestCanonicalPath();
        }).then(function () {
          return draft.deleteDraft(draftContext);
        }).then(function () {
          activeContext.delete();
          broadcastCollaborationMessage(Activity.Delete, _this3._rootPath, _this3._internalModel);

          _this3._internalModel.destroy();

          _this3._internalModel = undefined;
        }).catch(function (err) {
          Log.error(err);
        });
      }
    },
    // /////////////////////////////
    // Private methods
    _getDraftContext: function () {
      return this._oModel.bindContext(this._rootPath, undefined, {
        $$patchWithoutSideEffects: true,
        $$groupId: "$auto",
        $$updateGroupId: "$auto"
      }).getBoundContext();
    },

    /**
     * Callback of the ghost client when receiving a message on the web socket.
     *
     * @param oMessage The message
     */
    _onMessageReceived: function (oMessage) {
      oMessage.userAction = oMessage.userAction || oMessage.clientAction;
      this._lastReceivedMessage = oMessage;

      if (oMessage.userAction === Activity.Join) {
        broadcastCollaborationMessage(Activity.JoinEcho, this._lockedPropertyPath ? "".concat(this._rootPath, "/").concat(this._lockedPropertyPath) : undefined, this._internalModel);
      }
    }
  };
  return CollaborationAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb2xsYWJvcmF0aW9uQVBJIiwiX2xhc3RSZWNlaXZlZE1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJfcm9vdFBhdGgiLCJfb01vZGVsIiwiX2xvY2tlZFByb3BlcnR5UGF0aCIsIl9pbnRlcm5hbE1vZGVsIiwiZW50ZXJEcmFmdCIsIm9Db250ZXh0IiwidXNlcklEIiwidXNlck5hbWUiLCJ3ZWJTb2NrZXRCYXNlVVJMIiwiZ2V0TW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJnZXRPYmplY3QiLCJMb2ciLCJlcnJvciIsInNEcmFmdFVVSUQiLCJnZXRQcm9wZXJ0eSIsIkpTT05Nb2RlbCIsInNlcnZpY2VVcmwiLCJnZXRTZXJ2aWNlVXJsIiwiaW5pdGlhbGl6ZUNvbGxhYm9yYXRpb24iLCJpZCIsIm5hbWUiLCJpbml0aWFsTmFtZSIsIl9vbk1lc3NhZ2VSZWNlaXZlZCIsImJpbmQiLCJnZXRQYXRoIiwiY2hlY2tSZWNlaXZlZCIsIm1lc3NhZ2UiLCJmb3VuZCIsInVzZXJBY3Rpb24iLCJjbGllbnRDb250ZW50IiwibGVhdmVEcmFmdCIsImVuZENvbGxhYm9yYXRpb24iLCJkZXN0cm95Iiwic3RhcnRMaXZlQ2hhbmdlIiwic1Byb3BlcnR5UGF0aCIsInVuZG9DaGFuZ2UiLCJicm9hZGNhc3RDb2xsYWJvcmF0aW9uTWVzc2FnZSIsIkFjdGl2aXR5IiwiTGl2ZUNoYW5nZSIsInVwZGF0ZVByb3BlcnR5VmFsdWUiLCJ2YWx1ZSIsIm9Db250ZXh0QmluZGluZyIsImJpbmRDb250ZXh0IiwiJCRwYXRjaFdpdGhvdXRTaWRlRWZmZWN0cyIsIiQkZ3JvdXBJZCIsIiQkdXBkYXRlR3JvdXBJZCIsIm9Qcm9wZXJ0eUJpbmRpbmciLCJiaW5kUHJvcGVydHkiLCJnZXRCb3VuZENvbnRleHQiLCJyZXF1ZXN0VmFsdWUiLCJ0aGVuIiwic2V0VmFsdWUiLCJhdHRhY2hFdmVudE9uY2UiLCJDaGFuZ2UiLCJjYXRjaCIsImVyciIsIlVuZG8iLCJkaXNjYXJkRHJhZnQiLCJkcmFmdENvbnRleHQiLCJfZ2V0RHJhZnRDb250ZXh0IiwicmVxdWVzdFByb3BlcnR5IiwiZHJhZnQiLCJkZWxldGVEcmFmdCIsIkRpc2NhcmQiLCJyZXBsYWNlIiwiYWN0aXZlQ29udGV4dCIsImNvbnRleHQiLCJyZXF1ZXN0Q2Fub25pY2FsUGF0aCIsImRlbGV0ZSIsIkRlbGV0ZSIsIm9NZXNzYWdlIiwiY2xpZW50QWN0aW9uIiwiSm9pbiIsIkpvaW5FY2hvIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJDb2xsYWJvcmF0aW9uQVBJLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHtcblx0YnJvYWRjYXN0Q29sbGFib3JhdGlvbk1lc3NhZ2UsXG5cdGVuZENvbGxhYm9yYXRpb24sXG5cdGluaXRpYWxpemVDb2xsYWJvcmF0aW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9jb2xsYWJvcmF0aW9uL0FjdGl2aXR5QmFzZVwiO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2NvbGxhYm9yYXRpb24vQ29sbGFib3JhdGlvbkNvbW1vblwiO1xuaW1wb3J0IHsgQWN0aXZpdHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvY29sbGFib3JhdGlvbi9Db2xsYWJvcmF0aW9uQ29tbW9uXCI7XG5pbXBvcnQgZHJhZnQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2VkaXRGbG93L2RyYWZ0XCI7XG5pbXBvcnQgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCB0eXBlIE9EYXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSB7IFY0Q29udGV4dCB9IGZyb20gXCJ0eXBlcy9leHRlbnNpb25fdHlwZXNcIjtcblxuY29uc3QgQ29sbGFib3JhdGlvbkFQSSA9IHtcblx0X2xhc3RSZWNlaXZlZE1lc3NhZ2U6IHVuZGVmaW5lZCBhcyBNZXNzYWdlIHwgdW5kZWZpbmVkLFxuXHRfcm9vdFBhdGg6IFwiXCIsXG5cdF9vTW9kZWw6IHVuZGVmaW5lZCBhcyBPRGF0YU1vZGVsIHwgdW5kZWZpbmVkLFxuXHRfbG9ja2VkUHJvcGVydHlQYXRoOiBcIlwiLFxuXHRfaW50ZXJuYWxNb2RlbDogdW5kZWZpbmVkIGFzIEpTT05Nb2RlbCB8IHVuZGVmaW5lZCxcblxuXHQvKipcblx0ICogT3BlbiBhbiBleGlzdGluZyBjb2xsYWJvcmF0aXZlIGRyYWZ0IHdpdGggYSBuZXcgdXNlciwgYW5kIGNyZWF0ZXMgYSAnZ2hvc3QgY2xpZW50JyBmb3IgdGhpcyB1c2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRleHQgVGhlIGNvbnRleHQgb2YgdGhlIGNvbGxhYm9yYXRpdmUgZHJhZnRcblx0ICogQHBhcmFtIHVzZXJJRCBUaGUgSUQgb2YgdGhlIHVzZXJcblx0ICogQHBhcmFtIHVzZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSB1c2VyXG5cdCAqL1xuXHRlbnRlckRyYWZ0OiBmdW5jdGlvbiAob0NvbnRleHQ6IFY0Q29udGV4dCwgdXNlcklEOiBzdHJpbmcsIHVzZXJOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB3ZWJTb2NrZXRCYXNlVVJMOiBzdHJpbmcgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLmdldE9iamVjdChcIi9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLldlYlNvY2tldEJhc2VVUkxcIik7XG5cblx0XHRpZiAoIXdlYlNvY2tldEJhc2VVUkwpIHtcblx0XHRcdExvZy5lcnJvcihcIkNhbm5vdCBmaW5kIFdlYlNvY2tldEJhc2VVUkwgYW5ub3RhdGlvblwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBzRHJhZnRVVUlEOiBzdHJpbmcgPSBvQ29udGV4dC5nZXRQcm9wZXJ0eShcIkRyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhL0RyYWZ0VVVJRFwiKTtcblx0XHR0aGlzLl9pbnRlcm5hbE1vZGVsID0gbmV3IEpTT05Nb2RlbCh7fSk7XG5cblx0XHRjb25zdCBzZXJ2aWNlVXJsID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRTZXJ2aWNlVXJsKCk7XG5cblx0XHRpbml0aWFsaXplQ29sbGFib3JhdGlvbihcblx0XHRcdHtcblx0XHRcdFx0aWQ6IHVzZXJJRCxcblx0XHRcdFx0bmFtZTogdXNlck5hbWUsXG5cdFx0XHRcdGluaXRpYWxOYW1lOiB1c2VyTmFtZVxuXHRcdFx0fSxcblx0XHRcdHdlYlNvY2tldEJhc2VVUkwsXG5cdFx0XHRzRHJhZnRVVUlELFxuXHRcdFx0c2VydmljZVVybCxcblx0XHRcdHRoaXMuX2ludGVybmFsTW9kZWwsXG5cdFx0XHR0aGlzLl9vbk1lc3NhZ2VSZWNlaXZlZC5iaW5kKHRoaXMpLFxuXHRcdFx0dHJ1ZVxuXHRcdCk7XG5cblx0XHR0aGlzLl9yb290UGF0aCA9IG9Db250ZXh0LmdldFBhdGgoKTtcblx0XHR0aGlzLl9vTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWw7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZ2hvc3QgY2xpZW50IGhhcyByZXZpZXZlZCBhIGdpdmVuIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIGNvbnRlbnQgdG8gYmUgbG9va2VkIGZvclxuXHQgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBsYXN0IHJlY2lldmVkIG1lc3NhZ2UgbWF0Y2hlcyB0aGUgY29udGVudFxuXHQgKi9cblx0Y2hlY2tSZWNlaXZlZDogZnVuY3Rpb24gKG1lc3NhZ2U6IFBhcnRpYWw8TWVzc2FnZT4pOiBib29sZWFuIHtcblx0XHRpZiAoIXRoaXMuX2xhc3RSZWNlaXZlZE1lc3NhZ2UpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBmb3VuZCA9XG5cdFx0XHQoIW1lc3NhZ2UudXNlcklEIHx8IG1lc3NhZ2UudXNlcklEID09PSB0aGlzLl9sYXN0UmVjZWl2ZWRNZXNzYWdlLnVzZXJJRCkgJiZcblx0XHRcdCghbWVzc2FnZS51c2VyQWN0aW9uIHx8IG1lc3NhZ2UudXNlckFjdGlvbiA9PT0gdGhpcy5fbGFzdFJlY2VpdmVkTWVzc2FnZS51c2VyQWN0aW9uKSAmJlxuXHRcdFx0KCFtZXNzYWdlLmNsaWVudENvbnRlbnQgfHwgbWVzc2FnZS5jbGllbnRDb250ZW50ID09PSB0aGlzLl9sYXN0UmVjZWl2ZWRNZXNzYWdlLmNsaWVudENvbnRlbnQpO1xuXG5cdFx0dGhpcy5fbGFzdFJlY2VpdmVkTWVzc2FnZSA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgaGlzdG9yeSB0byBhdm9pZCBmaW5kaW5nIHRoZSBzYW1lIG1lc3NhZ2UgdHdpY2VcblxuXHRcdHJldHVybiBmb3VuZDtcblx0fSxcblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBnaG9zdCBjbGllbnQgYW5kIHJlbW92ZXMgdGhlIHVzZXIgZnJvbSB0aGUgY29sbGFib3JhdGl2ZSBkcmFmdC5cblx0ICovXG5cdGxlYXZlRHJhZnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5faW50ZXJuYWxNb2RlbCkge1xuXHRcdFx0ZW5kQ29sbGFib3JhdGlvbih0aGlzLl9pbnRlcm5hbE1vZGVsKTtcblx0XHRcdHRoaXMuX2ludGVybmFsTW9kZWwuZGVzdHJveSgpO1xuXHRcdFx0dGhpcy5faW50ZXJuYWxNb2RlbCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNpbXVsYXRlcyB0aGF0IHRoZSB1c2VyIHN0YXJ0cyB0eXBpbmcgaW4gYW4gaW5wdXQgKGxpdmUgY2hhbmdlKS5cblx0ICpcblx0ICogQHBhcmFtIHNQcm9wZXJ0eVBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IGJlaW5nIG1vZGlmaWVkXG5cdCAqL1xuXHRzdGFydExpdmVDaGFuZ2U6IGZ1bmN0aW9uIChzUHJvcGVydHlQYXRoOiBzdHJpbmcpIHtcblx0XHRpZiAodGhpcy5faW50ZXJuYWxNb2RlbCkge1xuXHRcdFx0aWYgKHRoaXMuX2xvY2tlZFByb3BlcnR5UGF0aCkge1xuXHRcdFx0XHQvLyBVbmxvY2sgcHJldmlvdXMgcHJvcGVydHkgcGF0aFxuXHRcdFx0XHR0aGlzLnVuZG9DaGFuZ2UoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2xvY2tlZFByb3BlcnR5UGF0aCA9IHNQcm9wZXJ0eVBhdGg7XG5cdFx0XHRicm9hZGNhc3RDb2xsYWJvcmF0aW9uTWVzc2FnZShBY3Rpdml0eS5MaXZlQ2hhbmdlLCBgJHt0aGlzLl9yb290UGF0aH0vJHtzUHJvcGVydHlQYXRofWAsIHRoaXMuX2ludGVybmFsTW9kZWwpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogU2ltdWxhdGVzIHRoYXQgdGhlIHVzZXIgaGFzIG1vZGlmaWVkIGEgcHJvcGVydHkuXG5cdCAqXG5cdCAqIEBwYXJhbSBzUHJvcGVydHlQYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSBiZWluZyBtb2RpZmllZFxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgYmVpbmcgbW9kaWZpZWRcblx0ICovXG5cdHVwZGF0ZVByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uIChzUHJvcGVydHlQYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcblx0XHRpZiAodGhpcy5faW50ZXJuYWxNb2RlbCkge1xuXHRcdFx0aWYgKHRoaXMuX2xvY2tlZFByb3BlcnR5UGF0aCAhPT0gc1Byb3BlcnR5UGF0aCkge1xuXHRcdFx0XHR0aGlzLnN0YXJ0TGl2ZUNoYW5nZShzUHJvcGVydHlQYXRoKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb0NvbnRleHRCaW5kaW5nID0gdGhpcy5fb01vZGVsIS5iaW5kQ29udGV4dCh0aGlzLl9yb290UGF0aCwgdW5kZWZpbmVkLCB7XG5cdFx0XHRcdCQkcGF0Y2hXaXRob3V0U2lkZUVmZmVjdHM6IHRydWUsXG5cdFx0XHRcdCQkZ3JvdXBJZDogXCIkYXV0b1wiLFxuXHRcdFx0XHQkJHVwZGF0ZUdyb3VwSWQ6IFwiJGF1dG9cIlxuXHRcdFx0fSk7XG5cblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eUJpbmRpbmcgPSB0aGlzLl9vTW9kZWwhLmJpbmRQcm9wZXJ0eShzUHJvcGVydHlQYXRoLCBvQ29udGV4dEJpbmRpbmcuZ2V0Qm91bmRDb250ZXh0KCkpO1xuXG5cdFx0XHRvUHJvcGVydHlCaW5kaW5nXG5cdFx0XHRcdC5yZXF1ZXN0VmFsdWUoKVxuXHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0b1Byb3BlcnR5QmluZGluZy5zZXRWYWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdFx0b0NvbnRleHRCaW5kaW5nLmF0dGFjaEV2ZW50T25jZShcInBhdGNoQ29tcGxldGVkXCIsICgpID0+IHtcblx0XHRcdFx0XHRcdGJyb2FkY2FzdENvbGxhYm9yYXRpb25NZXNzYWdlKEFjdGl2aXR5LkNoYW5nZSwgYCR7dGhpcy5fcm9vdFBhdGh9LyR7c1Byb3BlcnR5UGF0aH1gLCB0aGlzLl9pbnRlcm5hbE1vZGVsISk7XG5cdFx0XHRcdFx0XHR0aGlzLl9sb2NrZWRQcm9wZXJ0eVBhdGggPSBcIlwiO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdExvZy5lcnJvcihlcnIpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNpbXVsYXRlcyB0aGF0IHRoZSB1c2VyIGRpZCBhbiAndW5kbycgKHRvIGJlIGNhbGxlZCBhZnRlciBzdGFydExpdmVDaGFuZ2UpLlxuXHQgKi9cblx0dW5kb0NoYW5nZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9sb2NrZWRQcm9wZXJ0eVBhdGgpIHtcblx0XHRcdGJyb2FkY2FzdENvbGxhYm9yYXRpb25NZXNzYWdlKEFjdGl2aXR5LlVuZG8sIGAke3RoaXMuX3Jvb3RQYXRofS8ke3RoaXMuX2xvY2tlZFByb3BlcnR5UGF0aH1gLCB0aGlzLl9pbnRlcm5hbE1vZGVsISk7XG5cdFx0XHR0aGlzLl9sb2NrZWRQcm9wZXJ0eVBhdGggPSBcIlwiO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogU2ltdWxhdGVzIHRoYXQgdGhlIHVzZXIgaGFzIGRpc2NhcmRlZCB0aGUgZHJhZnQuXG5cdCAqL1xuXHRkaXNjYXJkRHJhZnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5faW50ZXJuYWxNb2RlbCkge1xuXHRcdFx0Y29uc3QgZHJhZnRDb250ZXh0ID0gdGhpcy5fZ2V0RHJhZnRDb250ZXh0KCk7XG5cblx0XHRcdGRyYWZ0Q29udGV4dFxuXHRcdFx0XHQucmVxdWVzdFByb3BlcnR5KFwiSXNBY3RpdmVFbnRpdHlcIilcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdGRyYWZ0LmRlbGV0ZURyYWZ0KGRyYWZ0Q29udGV4dCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRicm9hZGNhc3RDb2xsYWJvcmF0aW9uTWVzc2FnZShcblx0XHRcdFx0XHRcdEFjdGl2aXR5LkRpc2NhcmQsXG5cdFx0XHRcdFx0XHR0aGlzLl9yb290UGF0aC5yZXBsYWNlKFwiSXNBY3RpdmVFbnRpdHk9ZmFsc2VcIiwgXCJJc0FjdGl2ZUVudGl0eT10cnVlXCIpLFxuXHRcdFx0XHRcdFx0dGhpcy5faW50ZXJuYWxNb2RlbCFcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHRoaXMuX2ludGVybmFsTW9kZWwhLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR0aGlzLl9pbnRlcm5hbE1vZGVsID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycjogYW55KSB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKGVycik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogU2ltdWxhdGVzIHRoYXQgdGhlIHVzZXIgaGFzIGRlbGV0ZWQgdGhlIGRyYWZ0LlxuXHQgKi9cblx0ZGVsZXRlRHJhZnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5faW50ZXJuYWxNb2RlbCkge1xuXHRcdFx0Y29uc3QgZHJhZnRDb250ZXh0ID0gdGhpcy5fZ2V0RHJhZnRDb250ZXh0KCk7XG5cdFx0XHRsZXQgYWN0aXZlQ29udGV4dDogVjRDb250ZXh0O1xuXG5cdFx0XHRkcmFmdENvbnRleHRcblx0XHRcdFx0LnJlcXVlc3RQcm9wZXJ0eShcIklzQWN0aXZlRW50aXR5XCIpXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gZHJhZnRDb250ZXh0LmdldE1vZGVsKCkuYmluZENvbnRleHQoYCR7dGhpcy5fcm9vdFBhdGh9L1NpYmxpbmdFbnRpdHlgKS5nZXRCb3VuZENvbnRleHQoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oKGNvbnRleHQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdGFjdGl2ZUNvbnRleHQgPSBjb250ZXh0O1xuXHRcdFx0XHRcdHJldHVybiBjb250ZXh0LnJlcXVlc3RDYW5vbmljYWxQYXRoKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gZHJhZnQuZGVsZXRlRHJhZnQoZHJhZnRDb250ZXh0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdChhY3RpdmVDb250ZXh0IGFzIGFueSkuZGVsZXRlKCk7XG5cdFx0XHRcdFx0YnJvYWRjYXN0Q29sbGFib3JhdGlvbk1lc3NhZ2UoQWN0aXZpdHkuRGVsZXRlLCB0aGlzLl9yb290UGF0aCwgdGhpcy5faW50ZXJuYWxNb2RlbCEpO1xuXHRcdFx0XHRcdHRoaXMuX2ludGVybmFsTW9kZWwhLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR0aGlzLl9pbnRlcm5hbE1vZGVsID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycjogYW55KSB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKGVycik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHQvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLyBQcml2YXRlIG1ldGhvZHNcblxuXHRfZ2V0RHJhZnRDb250ZXh0OiBmdW5jdGlvbiAoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcy5fb01vZGVsIS5iaW5kQ29udGV4dCh0aGlzLl9yb290UGF0aCwgdW5kZWZpbmVkLCB7XG5cdFx0XHQkJHBhdGNoV2l0aG91dFNpZGVFZmZlY3RzOiB0cnVlLFxuXHRcdFx0JCRncm91cElkOiBcIiRhdXRvXCIsXG5cdFx0XHQkJHVwZGF0ZUdyb3VwSWQ6IFwiJGF1dG9cIlxuXHRcdH0pLmdldEJvdW5kQ29udGV4dCgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDYWxsYmFjayBvZiB0aGUgZ2hvc3QgY2xpZW50IHdoZW4gcmVjZWl2aW5nIGEgbWVzc2FnZSBvbiB0aGUgd2ViIHNvY2tldC5cblx0ICpcblx0ICogQHBhcmFtIG9NZXNzYWdlIFRoZSBtZXNzYWdlXG5cdCAqL1xuXHRfb25NZXNzYWdlUmVjZWl2ZWQ6IGZ1bmN0aW9uIChvTWVzc2FnZTogTWVzc2FnZSkge1xuXHRcdG9NZXNzYWdlLnVzZXJBY3Rpb24gPSBvTWVzc2FnZS51c2VyQWN0aW9uIHx8IG9NZXNzYWdlLmNsaWVudEFjdGlvbjtcblx0XHR0aGlzLl9sYXN0UmVjZWl2ZWRNZXNzYWdlID0gb01lc3NhZ2U7XG5cblx0XHRpZiAob01lc3NhZ2UudXNlckFjdGlvbiA9PT0gQWN0aXZpdHkuSm9pbikge1xuXHRcdFx0YnJvYWRjYXN0Q29sbGFib3JhdGlvbk1lc3NhZ2UoXG5cdFx0XHRcdEFjdGl2aXR5LkpvaW5FY2hvLFxuXHRcdFx0XHR0aGlzLl9sb2NrZWRQcm9wZXJ0eVBhdGggPyBgJHt0aGlzLl9yb290UGF0aH0vJHt0aGlzLl9sb2NrZWRQcm9wZXJ0eVBhdGh9YCA6IHVuZGVmaW5lZCxcblx0XHRcdFx0dGhpcy5faW50ZXJuYWxNb2RlbCFcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb2xsYWJvcmF0aW9uQVBJO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7RUFhQSxJQUFNQSxnQkFBZ0IsR0FBRztJQUN4QkMsb0JBQW9CLEVBQUVDLFNBREU7SUFFeEJDLFNBQVMsRUFBRSxFQUZhO0lBR3hCQyxPQUFPLEVBQUVGLFNBSGU7SUFJeEJHLG1CQUFtQixFQUFFLEVBSkc7SUFLeEJDLGNBQWMsRUFBRUosU0FMUTs7SUFPeEI7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDQ0ssVUFBVSxFQUFFLFVBQVVDLFFBQVYsRUFBK0JDLE1BQS9CLEVBQStDQyxRQUEvQyxFQUFpRTtNQUM1RSxJQUFNQyxnQkFBd0IsR0FBR0gsUUFBUSxDQUFDSSxRQUFULEdBQW9CQyxZQUFwQixHQUFtQ0MsU0FBbkMsQ0FBNkMsbURBQTdDLENBQWpDOztNQUVBLElBQUksQ0FBQ0gsZ0JBQUwsRUFBdUI7UUFDdEJJLEdBQUcsQ0FBQ0MsS0FBSixDQUFVLHlDQUFWO1FBQ0E7TUFDQTs7TUFFRCxJQUFNQyxVQUFrQixHQUFHVCxRQUFRLENBQUNVLFdBQVQsQ0FBcUIsbUNBQXJCLENBQTNCO01BQ0EsS0FBS1osY0FBTCxHQUFzQixJQUFJYSxTQUFKLENBQWMsRUFBZCxDQUF0QjtNQUVBLElBQU1DLFVBQVUsR0FBR1osUUFBUSxDQUFDSSxRQUFULEdBQW9CUyxhQUFwQixFQUFuQjtNQUVBQyx1QkFBdUIsQ0FDdEI7UUFDQ0MsRUFBRSxFQUFFZCxNQURMO1FBRUNlLElBQUksRUFBRWQsUUFGUDtRQUdDZSxXQUFXLEVBQUVmO01BSGQsQ0FEc0IsRUFNdEJDLGdCQU5zQixFQU90Qk0sVUFQc0IsRUFRdEJHLFVBUnNCLEVBU3RCLEtBQUtkLGNBVGlCLEVBVXRCLEtBQUtvQixrQkFBTCxDQUF3QkMsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FW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