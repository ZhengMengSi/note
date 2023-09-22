/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/m/MessageToast", "sap/ui/core/Core", "sap/ui/core/Fragment", "sap/ui/core/library"], function (CollaborationCommon, MessageToast, Core, Fragment, coreLibrary) {
  "use strict";

  var _exports = {};
  var UserStatus = CollaborationCommon.UserStatus;
  var UserEditingState = CollaborationCommon.UserEditingState;
  var shareObject = CollaborationCommon.shareObject;
  var getText = CollaborationCommon.getText;
  var CollaborationUtils = CollaborationCommon.CollaborationUtils;

  var createUserDetailsPopover = function (view) {
    try {
      var popoverPromise = Fragment.load({
        id: "manageCollaborationDraft",
        // todo should be view id
        name: "sap.fe.core.controllerextensions.collaboration.UserDetails"
      });
      return Promise.resolve(popoverPromise.then(function (popover) {
        view.addDependent(popover);
        return popover;
      }).catch(function () {
        throw "not this time";
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var showUserDetails = function (event, view) {
    try {
      function _temp7() {
        popover.setBindingContext(source.getBindingContext("internal"), "internal");
        popover.openBy(source, false);
      }

      var source = event.getSource();
      var popover = byId("userDetails");

      var _temp8 = function () {
        if (!popover) {
          return Promise.resolve(createUserDetailsPopover(view)).then(function (_createUserDetailsPop) {
            popover = _createUserDetailsPop;
          });
        }
      }();

      return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.showUserDetails = showUserDetails;

  var readInvitedUsers = function (view) {
    try {
      var model = view.getModel(); // TODO: inform model colleagues on missing TS definition

      var parameters = {
        $select: "UserID,UserDescription,UserEditingState"
      };
      var invitedUserList = model.bindList("DraftAdministrativeData/DraftAdministrativeUser", view.getBindingContext(), [], [], parameters);
      var internalModelContext = view.getBindingContext("internal"); // TODO: limit?

      return Promise.resolve(invitedUserList.requestContexts(0, 100).then(function (aContexts) {
        var invitedUsers = [];
        var activeUsers = view.getModel("internal").getProperty("/collaboration/activeUsers") || [];
        var me = CollaborationUtils.getMe(view);
        var userStatus;

        if ((aContexts === null || aContexts === void 0 ? void 0 : aContexts.length) > 0) {
          aContexts.forEach(function (oContext) {
            var userData = oContext.getObject();
            var isMe = (me === null || me === void 0 ? void 0 : me.id) === userData.UserID;
            var isActive = activeUsers.find(function (u) {
              return u.id === userData.UserID;
            });
            var userDescription = userData.UserDescription || userData.UserID;
            var initials = CollaborationUtils.formatInitials(userDescription);
            userDescription += isMe ? " (".concat(CollaborationUtils.getText("C_COLLABORATIONDRAFT_YOU"), ")") : "";

            switch (userData.UserEditingState) {
              case UserEditingState.NoChanges:
                userStatus = isActive ? UserStatus.CurrentlyEditing : UserStatus.NoChangesMade;
                break;

              case UserEditingState.InProgress:
                userStatus = isActive ? UserStatus.CurrentlyEditing : UserStatus.ChangesMade;
                break;

              default:
                userStatus = UserStatus.NotYetInvited;
            }

            var user = {
              id: userData.UserID,
              name: userDescription,
              status: userStatus,
              color: CollaborationUtils.getUserColor(userData.UserID, activeUsers, invitedUsers),
              initials: initials,
              me: isMe
            };
            invitedUsers.push(user);
          });
        } else {
          //not yet shared, just add me
          invitedUsers.push(me);
        }

        internalModelContext.setProperty("collaboration/UserID", "");
        internalModelContext.setProperty("collaboration/UserDescription", "");
        internalModelContext.setProperty("collaboration/invitedUsers", invitedUsers);
      }).catch(function () {// TODO: handle this case, close dialog?
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.readInvitedUsers = readInvitedUsers;

  var createManageCollaborationDialog = function (view) {
    try {
      var pDialog = view.getController().getExtensionAPI().loadFragment({
        name: "sap.fe.core.controllerextensions.collaboration.ManageDialog",
        id: "manageCollaborationDraft",
        controller: {
          share: share,
          addUser: addUser,
          removeUser: removeUser,
          close: closeDialog,
          addUserChanged: addUserChanged,
          formatUserStatus: formatUserStatus,
          formatUserStatusColor: formatUserStatusColor
        }
      });
      return Promise.resolve(pDialog.then(function (dialog) {
        view.addDependent(dialog);
        return dialog;
      }).catch(function () {
        throw "not this time";
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var ValueState = coreLibrary.ValueState;

  var openManageDialog = function (view) {
    try {
      function _temp3() {
        return Promise.resolve(readInvitedUsers(view)).then(function () {
          dialog.open();
        });
      }

      var dialog = byId("dialog");

      var _temp4 = function () {
        if (!dialog) {
          return Promise.resolve(createManageCollaborationDialog(view)).then(function (_createManageCollabor) {
            dialog = _createManageCollabor;
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.openManageDialog = openManageDialog;

  function addUser(event) {
    var addButton = event.getSource();
    var internalModelContext = addButton.getBindingContext("internal");
    var invitedUsers = internalModelContext.getProperty("invitedUsers") || [];
    var activeUsers = addButton.getModel("internal").getProperty("/collaboration/activeUsers");
    var newUser = {
      id: internalModelContext === null || internalModelContext === void 0 ? void 0 : internalModelContext.getProperty("UserID"),
      name: internalModelContext === null || internalModelContext === void 0 ? void 0 : internalModelContext.getProperty("UserDescription")
    };

    if (!(invitedUsers.findIndex(function (user) {
      return user.id === newUser.id;
    }) > -1 || newUser.id === newUser.name && newUser.id === "")) {
      newUser.name = newUser.name || newUser.id;
      newUser.initials = CollaborationUtils.formatInitials(newUser.name);
      newUser.color = CollaborationUtils.getUserColor(newUser.id, activeUsers, invitedUsers);
      newUser.transient = true;
      newUser.status = UserStatus.NotYetInvited;
      invitedUsers.unshift(newUser);
      internalModelContext.setProperty("invitedUsers", invitedUsers);
      internalModelContext.setProperty("UserID", "");
      internalModelContext.setProperty("UserDescription", "");
    }
  }

  function addUserChanged(event) {
    var userInput = event.getSource();
    event.getParameter("promise").then(function (newUserId) {
      var internalModelContext = userInput.getBindingContext("internal");
      var invitedUsers = internalModelContext.getProperty("invitedUsers") || [];

      if (invitedUsers.findIndex(function (user) {
        return user.id === newUserId;
      }) > -1) {
        userInput.setValueState("Error");
        userInput.setValueStateText(getText("C_COLLABORATIONDRAFT_INVITATION_USER_ERROR"));
      } else {
        userInput.setValueState("None");
        userInput.setValueStateText("");
      }
    }).catch(function () {
      throw "User couldn't be determined at all";
    });
  }

  function removeUser(event) {
    removeUserFromList(event.getSource());
  }

  function removeUserFromList(item) {
    var internalModelContext = item.getBindingContext("pageInternal");
    var deleteUserID = item.getBindingContext("internal").getProperty("id");
    var invitedUsers = internalModelContext.getProperty("collaboration/invitedUsers");
    invitedUsers = invitedUsers.filter(function (user) {
      return user.id !== deleteUserID;
    });
    internalModelContext.setProperty("collaboration/invitedUsers", invitedUsers);
  }

  function byId(id) {
    return Core.byId("manageCollaborationDraft--".concat(id));
  }

  function closeDialog() {
    byId("dialog").close();
  }

  function share(event) {
    var users = [];
    var source = event.getSource();
    var bindingContext = source.getBindingContext();
    var contexts = byId("userList").getBinding("items").getContexts();
    contexts.forEach(function (context) {
      users.push({
        UserID: context.getProperty("id"),
        UserAccessRole: "O" // For now according to UX every user retrieves the owner role

      });
    });
    shareObject(bindingContext, users).then(function () {
      MessageToast.show(getText("C_COLLABORATIONDRAFT_INVITATION_SUCCESS_TOAST"));
    }).catch(function () {
      MessageToast.show(getText("C_COLLABORATIONDRAFT_INVITATION_FAILED_TOAST"));
    });
    closeDialog();
  }

  function formatUserStatus(userStatus) {
    switch (userStatus) {
      case UserStatus.CurrentlyEditing:
        return getText("C_COLLABORATIONDRAFT_USER_CURRENTLY_EDITING");

      case UserStatus.ChangesMade:
        return getText("C_COLLABORATIONDRAFT_USER_CHANGES_MADE");

      case UserStatus.NoChangesMade:
        return getText("C_COLLABORATIONDRAFT_USER_NO_CHANGES_MADE");

      case UserStatus.NotYetInvited:
      default:
        return getText("C_COLLABORATIONDRAFT_USER_NOT_YET_INVITED");
    }
  }

  function formatUserStatusColor(userStatus) {
    switch (userStatus) {
      case UserStatus.CurrentlyEditing:
        return ValueState.Success;

      case UserStatus.ChangesMade:
        return ValueState.Warning;

      case UserStatus.NoChangesMade:
      case UserStatus.NotYetInvited:
      default:
        return ValueState.Information;
    }
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVVc2VyRGV0YWlsc1BvcG92ZXIiLCJ2aWV3IiwicG9wb3ZlclByb21pc2UiLCJGcmFnbWVudCIsImxvYWQiLCJpZCIsIm5hbWUiLCJ0aGVuIiwicG9wb3ZlciIsImFkZERlcGVuZGVudCIsImNhdGNoIiwic2hvd1VzZXJEZXRhaWxzIiwiZXZlbnQiLCJzZXRCaW5kaW5nQ29udGV4dCIsInNvdXJjZSIsImdldEJpbmRpbmdDb250ZXh0Iiwib3BlbkJ5IiwiZ2V0U291cmNlIiwiYnlJZCIsInJlYWRJbnZpdGVkVXNlcnMiLCJtb2RlbCIsImdldE1vZGVsIiwicGFyYW1ldGVycyIsIiRzZWxlY3QiLCJpbnZpdGVkVXNlckxpc3QiLCJiaW5kTGlzdCIsImludGVybmFsTW9kZWxDb250ZXh0IiwicmVxdWVzdENvbnRleHRzIiwiYUNvbnRleHRzIiwiaW52aXRlZFVzZXJzIiwiYWN0aXZlVXNlcnMiLCJnZXRQcm9wZXJ0eSIsIm1lIiwiQ29sbGFib3JhdGlvblV0aWxzIiwiZ2V0TWUiLCJ1c2VyU3RhdHVzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIm9Db250ZXh0IiwidXNlckRhdGEiLCJnZXRPYmplY3QiLCJpc01lIiwiVXNlcklEIiwiaXNBY3RpdmUiLCJmaW5kIiwidSIsInVzZXJEZXNjcmlwdGlvbiIsIlVzZXJEZXNjcmlwdGlvbiIsImluaXRpYWxzIiwiZm9ybWF0SW5pdGlhbHMiLCJnZXRUZXh0IiwiVXNlckVkaXRpbmdTdGF0ZSIsIk5vQ2hhbmdlcyIsIlVzZXJTdGF0dXMiLCJDdXJyZW50bHlFZGl0aW5nIiwiTm9DaGFuZ2VzTWFkZSIsIkluUHJvZ3Jlc3MiLCJDaGFuZ2VzTWFkZSIsIk5vdFlldEludml0ZWQiLCJ1c2VyIiwic3RhdHVzIiwiY29sb3IiLCJnZXRVc2VyQ29sb3IiLCJwdXNoIiwic2V0UHJvcGVydHkiLCJjcmVhdGVNYW5hZ2VDb2xsYWJvcmF0aW9uRGlhbG9nIiwicERpYWxvZyIsImdldENvbnRyb2xsZXIiLCJnZXRFeHRlbnNpb25BUEkiLCJsb2FkRnJhZ21lbnQiLCJjb250cm9sbGVyIiwic2hhcmUiLCJhZGRVc2VyIiwicmVtb3ZlVXNlciIsImNsb3NlIiwiY2xvc2VEaWFsb2ciLCJhZGRVc2VyQ2hhbmdlZCIsImZvcm1hdFVzZXJTdGF0dXMiLCJmb3JtYXRVc2VyU3RhdHVzQ29sb3IiLCJkaWFsb2ciLCJWYWx1ZVN0YXRlIiwiY29yZUxpYnJhcnkiLCJvcGVuTWFuYWdlRGlhbG9nIiwib3BlbiIsImFkZEJ1dHRvbiIsIm5ld1VzZXIiLCJmaW5kSW5kZXgiLCJ0cmFuc2llbnQiLCJ1bnNoaWZ0IiwidXNlcklucHV0IiwiZ2V0UGFyYW1ldGVyIiwibmV3VXNlcklkIiwic2V0VmFsdWVTdGF0ZSIsInNldFZhbHVlU3RhdGVUZXh0IiwicmVtb3ZlVXNlckZyb21MaXN0IiwiaXRlbSIsImRlbGV0ZVVzZXJJRCIsImZpbHRlciIsIkNvcmUiLCJ1c2VycyIsImJpbmRpbmdDb250ZXh0IiwiY29udGV4dHMiLCJnZXRCaW5kaW5nIiwiZ2V0Q29udGV4dHMiLCJjb250ZXh0IiwiVXNlckFjY2Vzc1JvbGUiLCJzaGFyZU9iamVjdCIsIk1lc3NhZ2VUb2FzdCIsInNob3ciLCJTdWNjZXNzIiwiV2FybmluZyIsIkluZm9ybWF0aW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJNYW5hZ2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QmFja2VuZFVzZXIsXG5cdENvbGxhYm9yYXRpb25VdGlscyxcblx0Z2V0VGV4dCxcblx0c2hhcmVPYmplY3QsXG5cdFVzZXIsXG5cdFVzZXJFZGl0aW5nU3RhdGUsXG5cdFVzZXJTdGF0dXNcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2NvbGxhYm9yYXRpb24vQ29sbGFib3JhdGlvbkNvbW1vblwiO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbE1vZGVsQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBCdXR0b24gZnJvbSBcInNhcC9tL0J1dHRvblwiO1xuaW1wb3J0IHR5cGUgRGlhbG9nIGZyb20gXCJzYXAvbS9EaWFsb2dcIjtcbmltcG9ydCB0eXBlIElucHV0IGZyb20gXCJzYXAvbS9JbnB1dFwiO1xuaW1wb3J0IE1lc3NhZ2VUb2FzdCBmcm9tIFwic2FwL20vTWVzc2FnZVRvYXN0XCI7XG5pbXBvcnQgdHlwZSBQb3BvdmVyIGZyb20gXCJzYXAvbS9Qb3BvdmVyXCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL20vVGFibGVcIjtcbmltcG9ydCB0eXBlIEV2ZW50IGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCBGcmFnbWVudCBmcm9tIFwic2FwL3VpL2NvcmUvRnJhZ21lbnRcIjtcbmltcG9ydCBjb3JlTGlicmFyeSBmcm9tIFwic2FwL3VpL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IHR5cGUgVmlldyBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL1ZpZXdcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YUxpc3RCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFMaXN0QmluZGluZ1wiO1xuaW1wb3J0IHR5cGUgT0RhdGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTW9kZWxcIjtcbmltcG9ydCB7IFY0Q29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi90eXBlcy9leHRlbnNpb25fdHlwZXNcIjtcbmNvbnN0IFZhbHVlU3RhdGUgPSBjb3JlTGlicmFyeS5WYWx1ZVN0YXRlO1xuXG5leHBvcnQgY29uc3Qgb3Blbk1hbmFnZURpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICh2aWV3OiBWaWV3KSB7XG5cdGxldCBkaWFsb2c6IGFueSA9IGJ5SWQoXCJkaWFsb2dcIik7XG5cblx0aWYgKCFkaWFsb2cpIHtcblx0XHRkaWFsb2cgPSBhd2FpdCBjcmVhdGVNYW5hZ2VDb2xsYWJvcmF0aW9uRGlhbG9nKHZpZXcpO1xuXHR9XG5cblx0YXdhaXQgcmVhZEludml0ZWRVc2Vycyh2aWV3KTtcblx0ZGlhbG9nLm9wZW4oKTtcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1hbmFnZUNvbGxhYm9yYXRpb25EaWFsb2codmlldzogVmlldykge1xuXHRjb25zdCBwRGlhbG9nOiBQcm9taXNlPGFueT4gPSAodmlldy5nZXRDb250cm9sbGVyKCkgYXMgYW55KS5nZXRFeHRlbnNpb25BUEkoKS5sb2FkRnJhZ21lbnQoe1xuXHRcdG5hbWU6IFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuY29sbGFib3JhdGlvbi5NYW5hZ2VEaWFsb2dcIixcblx0XHRpZDogXCJtYW5hZ2VDb2xsYWJvcmF0aW9uRHJhZnRcIixcblx0XHRjb250cm9sbGVyOiB7XG5cdFx0XHRzaGFyZTogc2hhcmUsXG5cdFx0XHRhZGRVc2VyOiBhZGRVc2VyLFxuXHRcdFx0cmVtb3ZlVXNlcjogcmVtb3ZlVXNlcixcblx0XHRcdGNsb3NlOiBjbG9zZURpYWxvZyxcblx0XHRcdGFkZFVzZXJDaGFuZ2VkOiBhZGRVc2VyQ2hhbmdlZCxcblx0XHRcdGZvcm1hdFVzZXJTdGF0dXM6IGZvcm1hdFVzZXJTdGF0dXMsXG5cdFx0XHRmb3JtYXRVc2VyU3RhdHVzQ29sb3I6IGZvcm1hdFVzZXJTdGF0dXNDb2xvclxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBwRGlhbG9nXG5cdFx0LnRoZW4oZnVuY3Rpb24gKGRpYWxvZzogYW55KSB7XG5cdFx0XHR2aWV3LmFkZERlcGVuZGVudChkaWFsb2cpO1xuXHRcdFx0cmV0dXJuIGRpYWxvZztcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBcIm5vdCB0aGlzIHRpbWVcIjtcblx0XHR9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRJbnZpdGVkVXNlcnModmlldzogVmlldykge1xuXHRjb25zdCBtb2RlbCA9IHZpZXcuZ2V0TW9kZWwoKSBhcyBPRGF0YU1vZGVsO1xuXHQvLyBUT0RPOiBpbmZvcm0gbW9kZWwgY29sbGVhZ3VlcyBvbiBtaXNzaW5nIFRTIGRlZmluaXRpb25cblx0Y29uc3QgcGFyYW1ldGVyczogYW55ID0ge1xuXHRcdCRzZWxlY3Q6IFwiVXNlcklELFVzZXJEZXNjcmlwdGlvbixVc2VyRWRpdGluZ1N0YXRlXCJcblx0fTtcblx0Y29uc3QgaW52aXRlZFVzZXJMaXN0ID0gbW9kZWwuYmluZExpc3QoXG5cdFx0XCJEcmFmdEFkbWluaXN0cmF0aXZlRGF0YS9EcmFmdEFkbWluaXN0cmF0aXZlVXNlclwiLFxuXHRcdHZpZXcuZ2V0QmluZGluZ0NvbnRleHQoKSBhcyBDb250ZXh0LFxuXHRcdFtdLFxuXHRcdFtdLFxuXHRcdHBhcmFtZXRlcnNcblx0KTtcblx0Y29uc3QgaW50ZXJuYWxNb2RlbENvbnRleHQgPSB2aWV3LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdC8vIFRPRE86IGxpbWl0P1xuXHRyZXR1cm4gaW52aXRlZFVzZXJMaXN0XG5cdFx0LnJlcXVlc3RDb250ZXh0cygwLCAxMDApXG5cdFx0LnRoZW4oZnVuY3Rpb24gKGFDb250ZXh0cykge1xuXHRcdFx0Y29uc3QgaW52aXRlZFVzZXJzOiBVc2VyW10gPSBbXTtcblx0XHRcdGNvbnN0IGFjdGl2ZVVzZXJzID0gdmlldy5nZXRNb2RlbChcImludGVybmFsXCIpLmdldFByb3BlcnR5KFwiL2NvbGxhYm9yYXRpb24vYWN0aXZlVXNlcnNcIikgfHwgW107XG5cdFx0XHRjb25zdCBtZSA9IENvbGxhYm9yYXRpb25VdGlscy5nZXRNZSh2aWV3KTtcblx0XHRcdGxldCB1c2VyU3RhdHVzOiBVc2VyU3RhdHVzO1xuXHRcdFx0aWYgKGFDb250ZXh0cz8ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRhQ29udGV4dHMuZm9yRWFjaChmdW5jdGlvbiAob0NvbnRleHQpIHtcblx0XHRcdFx0XHRjb25zdCB1c2VyRGF0YSA9IG9Db250ZXh0LmdldE9iamVjdCgpIGFzIEJhY2tlbmRVc2VyO1xuXHRcdFx0XHRcdGNvbnN0IGlzTWU6IGJvb2xlYW4gPSBtZT8uaWQgPT09IHVzZXJEYXRhLlVzZXJJRDtcblx0XHRcdFx0XHRjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVVzZXJzLmZpbmQoKHU6IFVzZXIpID0+IHUuaWQgPT09IHVzZXJEYXRhLlVzZXJJRCk7XG5cdFx0XHRcdFx0bGV0IHVzZXJEZXNjcmlwdGlvbiA9IHVzZXJEYXRhLlVzZXJEZXNjcmlwdGlvbiB8fCB1c2VyRGF0YS5Vc2VySUQ7XG5cdFx0XHRcdFx0Y29uc3QgaW5pdGlhbHMgPSBDb2xsYWJvcmF0aW9uVXRpbHMuZm9ybWF0SW5pdGlhbHModXNlckRlc2NyaXB0aW9uKTtcblx0XHRcdFx0XHR1c2VyRGVzY3JpcHRpb24gKz0gaXNNZSA/IGAgKCR7Q29sbGFib3JhdGlvblV0aWxzLmdldFRleHQoXCJDX0NPTExBQk9SQVRJT05EUkFGVF9ZT1VcIil9KWAgOiBcIlwiO1xuXHRcdFx0XHRcdHN3aXRjaCAodXNlckRhdGEuVXNlckVkaXRpbmdTdGF0ZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBVc2VyRWRpdGluZ1N0YXRlLk5vQ2hhbmdlczpcblx0XHRcdFx0XHRcdFx0dXNlclN0YXR1cyA9IGlzQWN0aXZlID8gVXNlclN0YXR1cy5DdXJyZW50bHlFZGl0aW5nIDogVXNlclN0YXR1cy5Ob0NoYW5nZXNNYWRlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgVXNlckVkaXRpbmdTdGF0ZS5JblByb2dyZXNzOlxuXHRcdFx0XHRcdFx0XHR1c2VyU3RhdHVzID0gaXNBY3RpdmUgPyBVc2VyU3RhdHVzLkN1cnJlbnRseUVkaXRpbmcgOiBVc2VyU3RhdHVzLkNoYW5nZXNNYWRlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHVzZXJTdGF0dXMgPSBVc2VyU3RhdHVzLk5vdFlldEludml0ZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnN0IHVzZXI6IFVzZXIgPSB7XG5cdFx0XHRcdFx0XHRpZDogdXNlckRhdGEuVXNlcklELFxuXHRcdFx0XHRcdFx0bmFtZTogdXNlckRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdFx0c3RhdHVzOiB1c2VyU3RhdHVzLFxuXHRcdFx0XHRcdFx0Y29sb3I6IENvbGxhYm9yYXRpb25VdGlscy5nZXRVc2VyQ29sb3IodXNlckRhdGEuVXNlcklELCBhY3RpdmVVc2VycywgaW52aXRlZFVzZXJzKSxcblx0XHRcdFx0XHRcdGluaXRpYWxzOiBpbml0aWFscyxcblx0XHRcdFx0XHRcdG1lOiBpc01lXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpbnZpdGVkVXNlcnMucHVzaCh1c2VyKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL25vdCB5ZXQgc2hhcmVkLCBqdXN0IGFkZCBtZVxuXHRcdFx0XHRpbnZpdGVkVXNlcnMucHVzaChtZSk7XG5cdFx0XHR9XG5cdFx0XHRpbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImNvbGxhYm9yYXRpb24vVXNlcklEXCIsIFwiXCIpO1xuXHRcdFx0aW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJjb2xsYWJvcmF0aW9uL1VzZXJEZXNjcmlwdGlvblwiLCBcIlwiKTtcblx0XHRcdGludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiY29sbGFib3JhdGlvbi9pbnZpdGVkVXNlcnNcIiwgaW52aXRlZFVzZXJzKTtcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyBUT0RPOiBoYW5kbGUgdGhpcyBjYXNlLCBjbG9zZSBkaWFsb2c/XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVzZXIoZXZlbnQ6IEV2ZW50KSB7XG5cdGNvbnN0IGFkZEJ1dHRvbiA9IGV2ZW50LmdldFNvdXJjZSgpIGFzIEJ1dHRvbjtcblx0Y29uc3QgaW50ZXJuYWxNb2RlbENvbnRleHQgPSBhZGRCdXR0b24uZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0Y29uc3QgaW52aXRlZFVzZXJzOiBVc2VyW10gPSBpbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcImludml0ZWRVc2Vyc1wiKSB8fCBbXTtcblx0Y29uc3QgYWN0aXZlVXNlcnMgPSBhZGRCdXR0b24uZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKS5nZXRQcm9wZXJ0eShcIi9jb2xsYWJvcmF0aW9uL2FjdGl2ZVVzZXJzXCIpO1xuXHRjb25zdCBuZXdVc2VyOiBVc2VyID0ge1xuXHRcdGlkOiBpbnRlcm5hbE1vZGVsQ29udGV4dD8uZ2V0UHJvcGVydHkoXCJVc2VySURcIiksXG5cdFx0bmFtZTogaW50ZXJuYWxNb2RlbENvbnRleHQ/LmdldFByb3BlcnR5KFwiVXNlckRlc2NyaXB0aW9uXCIpXG5cdH07XG5cblx0aWYgKCEoaW52aXRlZFVzZXJzLmZpbmRJbmRleCgodXNlcikgPT4gdXNlci5pZCA9PT0gbmV3VXNlci5pZCkgPiAtMSB8fCAobmV3VXNlci5pZCA9PT0gbmV3VXNlci5uYW1lICYmIG5ld1VzZXIuaWQgPT09IFwiXCIpKSkge1xuXHRcdG5ld1VzZXIubmFtZSA9IG5ld1VzZXIubmFtZSB8fCBuZXdVc2VyLmlkO1xuXHRcdG5ld1VzZXIuaW5pdGlhbHMgPSBDb2xsYWJvcmF0aW9uVXRpbHMuZm9ybWF0SW5pdGlhbHMobmV3VXNlci5uYW1lKTtcblx0XHRuZXdVc2VyLmNvbG9yID0gQ29sbGFib3JhdGlvblV0aWxzLmdldFVzZXJDb2xvcihuZXdVc2VyLmlkLCBhY3RpdmVVc2VycywgaW52aXRlZFVzZXJzKTtcblx0XHRuZXdVc2VyLnRyYW5zaWVudCA9IHRydWU7XG5cdFx0bmV3VXNlci5zdGF0dXMgPSBVc2VyU3RhdHVzLk5vdFlldEludml0ZWQ7XG5cdFx0aW52aXRlZFVzZXJzLnVuc2hpZnQobmV3VXNlcik7XG5cdFx0aW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJpbnZpdGVkVXNlcnNcIiwgaW52aXRlZFVzZXJzKTtcblx0XHRpbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcIlVzZXJJRFwiLCBcIlwiKTtcblx0XHRpbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcIlVzZXJEZXNjcmlwdGlvblwiLCBcIlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGRVc2VyQ2hhbmdlZChldmVudDogRXZlbnQpIHtcblx0Y29uc3QgdXNlcklucHV0ID0gZXZlbnQuZ2V0U291cmNlKCkgYXMgSW5wdXQ7XG5cdGV2ZW50XG5cdFx0LmdldFBhcmFtZXRlcihcInByb21pc2VcIilcblx0XHQudGhlbihmdW5jdGlvbiAobmV3VXNlcklkOiBzdHJpbmcpIHtcblx0XHRcdGNvbnN0IGludGVybmFsTW9kZWxDb250ZXh0ID0gdXNlcklucHV0LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0XHRjb25zdCBpbnZpdGVkVXNlcnM6IFVzZXJbXSA9IGludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiaW52aXRlZFVzZXJzXCIpIHx8IFtdO1xuXHRcdFx0aWYgKGludml0ZWRVc2Vycy5maW5kSW5kZXgoKHVzZXIpID0+IHVzZXIuaWQgPT09IG5ld1VzZXJJZCkgPiAtMSkge1xuXHRcdFx0XHR1c2VySW5wdXQuc2V0VmFsdWVTdGF0ZShcIkVycm9yXCIpO1xuXHRcdFx0XHR1c2VySW5wdXQuc2V0VmFsdWVTdGF0ZVRleHQoZ2V0VGV4dChcIkNfQ09MTEFCT1JBVElPTkRSQUZUX0lOVklUQVRJT05fVVNFUl9FUlJPUlwiKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VySW5wdXQuc2V0VmFsdWVTdGF0ZShcIk5vbmVcIik7XG5cdFx0XHRcdHVzZXJJbnB1dC5zZXRWYWx1ZVN0YXRlVGV4dChcIlwiKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBcIlVzZXIgY291bGRuJ3QgYmUgZGV0ZXJtaW5lZCBhdCBhbGxcIjtcblx0XHR9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVXNlcihldmVudDogRXZlbnQpIHtcblx0cmVtb3ZlVXNlckZyb21MaXN0KGV2ZW50LmdldFNvdXJjZSgpKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVXNlckZyb21MaXN0KGl0ZW06IGFueSkge1xuXHRjb25zdCBpbnRlcm5hbE1vZGVsQ29udGV4dCA9IGl0ZW0uZ2V0QmluZGluZ0NvbnRleHQoXCJwYWdlSW50ZXJuYWxcIik7XG5cdGNvbnN0IGRlbGV0ZVVzZXJJRCA9IGl0ZW0uZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKS5nZXRQcm9wZXJ0eShcImlkXCIpO1xuXHRsZXQgaW52aXRlZFVzZXJzOiBVc2VyW10gPSBpbnRlcm5hbE1vZGVsQ29udGV4dC5nZXRQcm9wZXJ0eShcImNvbGxhYm9yYXRpb24vaW52aXRlZFVzZXJzXCIpO1xuXHRpbnZpdGVkVXNlcnMgPSBpbnZpdGVkVXNlcnMuZmlsdGVyKCh1c2VyKSA9PiB1c2VyLmlkICE9PSBkZWxldGVVc2VySUQpO1xuXHRpbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImNvbGxhYm9yYXRpb24vaW52aXRlZFVzZXJzXCIsIGludml0ZWRVc2Vycyk7XG59XG5cbmZ1bmN0aW9uIGJ5SWQoaWQ6IHN0cmluZyk6IGFueSB7XG5cdHJldHVybiBDb3JlLmJ5SWQoYG1hbmFnZUNvbGxhYm9yYXRpb25EcmFmdC0tJHtpZH1gKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VEaWFsb2coKSB7XG5cdChieUlkKFwiZGlhbG9nXCIpIGFzIERpYWxvZykuY2xvc2UoKTtcbn1cblxuZnVuY3Rpb24gc2hhcmUoZXZlbnQ6IEV2ZW50KSB7XG5cdGNvbnN0IHVzZXJzOiBCYWNrZW5kVXNlcltdID0gW107XG5cdGNvbnN0IHNvdXJjZSA9IGV2ZW50LmdldFNvdXJjZSgpIGFzIENvbnRyb2w7XG5cdGNvbnN0IGJpbmRpbmdDb250ZXh0ID0gc291cmNlLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgVjRDb250ZXh0O1xuXHRjb25zdCBjb250ZXh0cyA9ICgoYnlJZChcInVzZXJMaXN0XCIpIGFzIFRhYmxlKS5nZXRCaW5kaW5nKFwiaXRlbXNcIikgYXMgT0RhdGFMaXN0QmluZGluZykuZ2V0Q29udGV4dHMoKTtcblxuXHRjb250ZXh0cy5mb3JFYWNoKGZ1bmN0aW9uIChjb250ZXh0KSB7XG5cdFx0dXNlcnMucHVzaCh7XG5cdFx0XHRVc2VySUQ6IGNvbnRleHQuZ2V0UHJvcGVydHkoXCJpZFwiKSxcblx0XHRcdFVzZXJBY2Nlc3NSb2xlOiBcIk9cIiAvLyBGb3Igbm93IGFjY29yZGluZyB0byBVWCBldmVyeSB1c2VyIHJldHJpZXZlcyB0aGUgb3duZXIgcm9sZVxuXHRcdH0pO1xuXHR9KTtcblx0c2hhcmVPYmplY3QoYmluZGluZ0NvbnRleHQsIHVzZXJzKVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdE1lc3NhZ2VUb2FzdC5zaG93KGdldFRleHQoXCJDX0NPTExBQk9SQVRJT05EUkFGVF9JTlZJVEFUSU9OX1NVQ0NFU1NfVE9BU1RcIikpO1xuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdE1lc3NhZ2VUb2FzdC5zaG93KGdldFRleHQoXCJDX0NPTExBQk9SQVRJT05EUkFGVF9JTlZJVEFUSU9OX0ZBSUxFRF9UT0FTVFwiKSk7XG5cdFx0fSk7XG5cblx0Y2xvc2VEaWFsb2coKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNob3dVc2VyRGV0YWlscyhldmVudDogRXZlbnQsIHZpZXc6IFZpZXcpIHtcblx0Y29uc3Qgc291cmNlID0gZXZlbnQuZ2V0U291cmNlKCkgYXMgQ29udHJvbDtcblx0bGV0IHBvcG92ZXIgPSBieUlkKFwidXNlckRldGFpbHNcIikgYXMgUG9wb3Zlcjtcblx0aWYgKCFwb3BvdmVyKSB7XG5cdFx0cG9wb3ZlciA9IGF3YWl0IGNyZWF0ZVVzZXJEZXRhaWxzUG9wb3Zlcih2aWV3KTtcblx0fVxuXG5cdHBvcG92ZXIuc2V0QmluZGluZ0NvbnRleHQoc291cmNlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQsIFwiaW50ZXJuYWxcIik7XG5cblx0cG9wb3Zlci5vcGVuQnkoc291cmNlLCBmYWxzZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVVzZXJEZXRhaWxzUG9wb3Zlcih2aWV3OiBWaWV3KSB7XG5cdGNvbnN0IHBvcG92ZXJQcm9taXNlOiBQcm9taXNlPGFueT4gPSBGcmFnbWVudC5sb2FkKHtcblx0XHRpZDogXCJtYW5hZ2VDb2xsYWJvcmF0aW9uRHJhZnRcIiwgLy8gdG9kbyBzaG91bGQgYmUgdmlldyBpZFxuXHRcdG5hbWU6IFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuY29sbGFib3JhdGlvbi5Vc2VyRGV0YWlsc1wiXG5cdH0pO1xuXHRyZXR1cm4gcG9wb3ZlclByb21pc2Vcblx0XHQudGhlbihmdW5jdGlvbiAocG9wb3ZlcjogYW55KSB7XG5cdFx0XHR2aWV3LmFkZERlcGVuZGVudChwb3BvdmVyKTtcblx0XHRcdHJldHVybiBwb3BvdmVyO1xuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHRocm93IFwibm90IHRoaXMgdGltZVwiO1xuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVc2VyU3RhdHVzKHVzZXJTdGF0dXM6IFVzZXJTdGF0dXMpIHtcblx0c3dpdGNoICh1c2VyU3RhdHVzKSB7XG5cdFx0Y2FzZSBVc2VyU3RhdHVzLkN1cnJlbnRseUVkaXRpbmc6XG5cdFx0XHRyZXR1cm4gZ2V0VGV4dChcIkNfQ09MTEFCT1JBVElPTkRSQUZUX1VTRVJfQ1VSUkVOVExZX0VESVRJTkdcIik7XG5cdFx0Y2FzZSBVc2VyU3RhdHVzLkNoYW5nZXNNYWRlOlxuXHRcdFx0cmV0dXJuIGdldFRleHQoXCJDX0NPTExBQk9SQVRJT05EUkFGVF9VU0VSX0NIQU5HRVNfTUFERVwiKTtcblx0XHRjYXNlIFVzZXJTdGF0dXMuTm9DaGFuZ2VzTWFkZTpcblx0XHRcdHJldHVybiBnZXRUZXh0KFwiQ19DT0xMQUJPUkFUSU9ORFJBRlRfVVNFUl9OT19DSEFOR0VTX01BREVcIik7XG5cdFx0Y2FzZSBVc2VyU3RhdHVzLk5vdFlldEludml0ZWQ6XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBnZXRUZXh0KFwiQ19DT0xMQUJPUkFUSU9ORFJBRlRfVVNFUl9OT1RfWUVUX0lOVklURURcIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXNlclN0YXR1c0NvbG9yKHVzZXJTdGF0dXM6IFVzZXJTdGF0dXMpIHtcblx0c3dpdGNoICh1c2VyU3RhdHVzKSB7XG5cdFx0Y2FzZSBVc2VyU3RhdHVzLkN1cnJlbnRseUVkaXRpbmc6XG5cdFx0XHRyZXR1cm4gVmFsdWVTdGF0ZS5TdWNjZXNzO1xuXHRcdGNhc2UgVXNlclN0YXR1cy5DaGFuZ2VzTWFkZTpcblx0XHRcdHJldHVybiBWYWx1ZVN0YXRlLldhcm5pbmc7XG5cdFx0Y2FzZSBVc2VyU3RhdHVzLk5vQ2hhbmdlc01hZGU6XG5cdFx0Y2FzZSBVc2VyU3RhdHVzLk5vdFlldEludml0ZWQ6XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBWYWx1ZVN0YXRlLkluZm9ybWF0aW9uO1xuXHR9XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7O01BZ09lQSx3QixhQUF5QkMsSTtRQUFZO01BQ25ELElBQU1DLGNBQTRCLEdBQUdDLFFBQVEsQ0FBQ0MsSUFBVCxDQUFjO1FBQ2xEQyxF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