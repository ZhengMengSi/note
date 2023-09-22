/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/collaboration/ActivityBase", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/m/MessageBox"], function (CommonUtils, ActivityBase, CollaborationCommon, MessageBox) {
  "use strict";

  var _exports = {};
  var CollaborationUtils = CollaborationCommon.CollaborationUtils;
  var Activity = CollaborationCommon.Activity;
  var isCollaborationConnected = ActivityBase.isCollaborationConnected;
  var initializeCollaboration = ActivityBase.initializeCollaboration;
  var endCollaboration = ActivityBase.endCollaboration;
  var broadcastCollaborationMessage = ActivityBase.broadcastCollaborationMessage;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var MYACTIVITY = "/collaboration/myActivity";
  var ACTIVEUSERS = "/collaboration/activeUsers";
  var ACTIVITIES = "/collaboration/activities";

  var isConnected = function (control) {
    var internalModel = control.getModel("internal");
    return isCollaborationConnected(internalModel);
  };

  _exports.isConnected = isConnected;

  var send = function (control, action, content) {
    if (isConnected(control)) {
      var internalModel = control.getModel("internal");
      var clientContent = Array.isArray(content) ? content.join("|") : content;

      if (action === Activity.LiveChange) {
        // To avoid unnecessary traffic we keep track of live changes and send it only once
        var myActivity = internalModel.getProperty(MYACTIVITY);

        if (myActivity === clientContent) {
          return;
        } else {
          internalModel.setProperty(MYACTIVITY, clientContent);
        }
      } else {
        // user finished the activity
        internalModel.setProperty(MYACTIVITY, null);
      }

      broadcastCollaborationMessage(action, clientContent, internalModel);
    }
  };

  _exports.send = send;

  var getWebSocketBaseURL = function (bindingContext) {
    return bindingContext.getModel().getMetaModel().getObject("/@com.sap.vocabularies.Common.v1.WebSocketBaseURL");
  };

  var isCollaborationEnabled = function (view) {
    var bindingContext = (view === null || view === void 0 ? void 0 : view.getBindingContext) && view.getBindingContext();
    return !!(bindingContext && getWebSocketBaseURL(bindingContext));
  };

  _exports.isCollaborationEnabled = isCollaborationEnabled;

  var connect = function (view) {
    try {
      var internalModel = view.getModel("internal");
      var me = CollaborationUtils.getMe(view); // Retrieving ME from shell service

      if (!me) {
        // no me = no shell = not sure what to do
        return Promise.resolve();
      }

      var bindingContext = view.getBindingContext();
      var webSocketBaseURL = getWebSocketBaseURL(bindingContext);
      var serviceUrl = bindingContext.getModel().getServiceUrl();

      if (!webSocketBaseURL) {
        return Promise.resolve();
      }

      return Promise.resolve(bindingContext.requestProperty("DraftAdministrativeData/DraftUUID")).then(function (sDraftUUID) {
        if (!sDraftUUID) {
          return;
        }

        initializeCollaboration(me, webSocketBaseURL, sDraftUUID, serviceUrl, internalModel, function (message) {
          messageReceive(message, view);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.connect = connect;

  var disconnect = function (control) {
    var internalModel = control.getModel("internal");
    endCollaboration(internalModel);
  };

  _exports.disconnect = disconnect;

  function messageReceive(message, view) {
    var _message$clientConten, _activities;

    var internalModel = view.getModel("internal");
    var activeUsers = internalModel.getProperty(ACTIVEUSERS);
    var activities;
    var activityKey;
    var metaPath = message.clientContent && view.getModel().getMetaModel().getMetaPath(message.clientContent);
    message.userAction = message.userAction || message.clientAction;
    var sender = {
      id: message.userID,
      name: message.userDescription,
      initials: CollaborationUtils.formatInitials(message.userDescription),
      color: CollaborationUtils.getUserColor(message.userID, activeUsers, [])
    };
    var mactivity = sender; // eslint-disable-next-line default-case

    switch (message.userAction) {
      case Activity.Join:
      case Activity.JoinEcho:
        if (activeUsers.findIndex(function (user) {
          return user.id === sender.id;
        }) === -1) {
          activeUsers.unshift(sender);
          internalModel.setProperty(ACTIVEUSERS, activeUsers);
        }

        if (message.userAction === Activity.Join) {
          // we echo our existence to the newly entered user and also send the current activity if there is any
          broadcastCollaborationMessage(Activity.JoinEcho, internalModel.getProperty(MYACTIVITY), internalModel);
        }

        if (message.userAction === Activity.JoinEcho) {
          if (message.clientContent) {
            // another user was already typing therefore I want to see his activity immediately. Calling me again as a live change
            message.userAction = Activity.LiveChange;
            messageReceive(message, view);
          }
        }

        break;

      case Activity.Leave:
        // Removing the active user. Not removing "me" if I had the screen open in another session
        activeUsers = activeUsers.filter(function (user) {
          return user.id !== sender.id || user.me;
        });
        internalModel.setProperty(ACTIVEUSERS, activeUsers);
        var allActivities = internalModel.getProperty(ACTIVITIES) || {};

        var removeUserActivities = function (bag) {
          if (Array.isArray(bag)) {
            return bag.filter(function (activity) {
              return activity.id !== sender.id;
            });
          } else {
            for (var p in bag) {
              bag[p] = removeUserActivities(bag[p]);
            }

            return bag;
          }
        };

        removeUserActivities(allActivities);
        internalModel.setProperty(ACTIVITIES, allActivities);
        break;

      case Activity.Change:
        var metaPaths = message === null || message === void 0 ? void 0 : (_message$clientConten = message.clientContent) === null || _message$clientConten === void 0 ? void 0 : _message$clientConten.split("|").map(function (path) {
          return view.getModel().getMetaModel().getMetaPath(path);
        });
        metaPaths.forEach(function (currentMetaPath, i) {
          var _message$clientConten2, _currentActivities;

          var nesteedMessage = _objectSpread(_objectSpread({}, message), {}, {
            clientContent: message === null || message === void 0 ? void 0 : (_message$clientConten2 = message.clientContent) === null || _message$clientConten2 === void 0 ? void 0 : _message$clientConten2.split("|")[i]
          });

          var currentActivities = internalModel.getProperty(ACTIVITIES + currentMetaPath) || [];
          activityKey = getActivityKey(nesteedMessage.clientContent);
          currentActivities = ((_currentActivities = currentActivities) === null || _currentActivities === void 0 ? void 0 : _currentActivities.filter) && currentActivities.filter(function (activity) {
            return activity.key !== activityKey;
          });

          if (currentActivities) {
            internalModel.setProperty(ACTIVITIES + currentMetaPath, currentActivities);
            update(view, nesteedMessage, currentMetaPath, Activity.Change);
          }
        });
        break;

      case Activity.Create:
        // For create we actually just need to refresh the table
        update(view, message, metaPath, Activity.Create);
        break;

      case Activity.Delete:
        // For now also refresh the page but in case of deletion we need to inform the user
        update(view, message, metaPath, Activity.Delete);
        break;

      case Activity.Activate:
        disconnect(view);
        MessageBox.information(CollaborationUtils.getText("C_COLLABORATIONDRAFT_ACTIVATE", sender.name));
        navigate(message.clientContent, view);
        break;

      case Activity.Discard:
        disconnect(view);
        MessageBox.information(CollaborationUtils.getText("C_COLLABORATIONDRAFT_DISCARD", sender.name));
        navigate(message.clientContent, view);
        break;

      /*
      // TODO: Action to be implemented
      case Activity.Action:
      	// Just for test reasons show a toast - to be checked with UX
      	MessageToast.show("User " + sender.name + " has executed action " + metaPath.split("|")[0]);
      	//update(view, message, metaPath, Activity.Delete);
      	break;
       */

      case Activity.LiveChange:
        mactivity = sender;
        mactivity.key = getActivityKey(message.clientContent); // stupid JSON model...

        var initJSONModel = "";
        var parts = metaPath.split("/");

        for (var i = 1; i < parts.length - 1; i++) {
          initJSONModel += "/".concat(parts[i]);

          if (!internalModel.getProperty(ACTIVITIES + initJSONModel)) {
            internalModel.setProperty(ACTIVITIES + initJSONModel, {});
          }
        }

        activities = internalModel.getProperty(ACTIVITIES + metaPath);
        activities = (_activities = activities) !== null && _activities !== void 0 && _activities.slice ? activities.slice() : [];
        activities.push(mactivity);
        internalModel.setProperty(ACTIVITIES + metaPath, activities);
        break;

      case Activity.Undo:
        // The user did a change but reverted it, therefore unblock the control
        activities = internalModel.getProperty(ACTIVITIES + metaPath);
        activityKey = getActivityKey(message.clientContent);
        internalModel.setProperty(ACTIVITIES + metaPath, activities.filter(function (a) {
          return a.key !== activityKey;
        }));
        break;
    }
  }

  function update(view, message, metaPath, action) {
    var appComponent = CollaborationUtils.getAppComponent(view);
    var metaModel = view.getModel().getMetaModel();
    var currentPage = getCurrentPage(view);
    var sideEffectsService = appComponent.getSideEffectsService();
    var currentContext = currentPage.getBindingContext();
    var currentPath = currentContext.getPath();
    var currentMetaPath = metaModel.getMetaPath(currentPath);
    var changedDocument = message.clientContent;

    if (action === Activity.Delete) {
      // check if user currently displays one deleted object
      var deletedObjects = message.clientContent.split("|");
      var parentDeletedIndex = deletedObjects.findIndex(function (deletedObject) {
        return currentPath.startsWith(deletedObject);
      });

      if (parentDeletedIndex > -1) {
        // any other user deleted the object I'm currently looking at. Inform the user we will navigate to root now
        MessageBox.information(CollaborationUtils.getText("C_COLLABORATIONDRAFT_DELETE", message.userDescription), {
          onClose: function () {
            var targetContext = view.getModel().bindContext(deletedObjects[parentDeletedIndex]).getBoundContext();

            currentPage.getController()._routing.navigateBackFromContext(targetContext);
          }
        });
      } // TODO: For now just take the first object to get the meta path and do a full refresh of the table


      changedDocument = deletedObjects[0];
    }

    if (changedDocument.startsWith(currentPath)) {
      // Execute SideEffects (TODO for Meet there should be one central method)
      var activityPath = metaPath.replace(currentMetaPath, "").slice(1);

      if (activityPath) {
        (function () {
          // Request also the property itself
          var sideEffects = [{
            $PropertyPath: activityPath
          }];
          var entityType = sideEffectsService.getEntityTypeFromContext(currentContext);
          var entityTypeSideEffects = sideEffectsService.getODataEntitySideEffects(entityType); // Poor man solution without checking source targets, just for POC, this is throw-way coding only

          var object = Object; // just to overcome TS issues, will be anyway replaced

          var relevantSideEffects = object.fromEntries(object.entries(entityTypeSideEffects).filter(function (x) {
            var _x$1$SourceProperties;

            return ((_x$1$SourceProperties = x[1].SourceProperties) === null || _x$1$SourceProperties === void 0 ? void 0 : _x$1$SourceProperties.findIndex(function (source) {
              return source.value === activityPath;
            })) > -1;
          }));

          for (var p in relevantSideEffects) {
            relevantSideEffects[p].TargetProperties.forEach(function (targetProperty) {
              sideEffects.push({
                $PropertyPath: targetProperty
              });
            });
          }

          sideEffectsService.requestSideEffects(sideEffects, currentContext, "$auto");
        })();
      }
    } // Simulate any change so the edit flow shows the draft indicator and sets the page to dirty


    currentPage.getController().editFlow.updateDocument(currentContext, Promise.resolve());
  }

  function navigate(path, view) {
    // TODO: routing.navigate doesn't consider semantic bookmarking
    var currentPage = getCurrentPage(view);
    var targetContext = view.getModel().bindContext(path).getBoundContext();
    currentPage.getController().routing.navigate(targetContext);
  }

  function getCurrentPage(view) {
    var appComponent = CollaborationUtils.getAppComponent(view);
    return CommonUtils.getCurrentPageView(appComponent);
  }

  function getActivityKey(x) {
    return x.substring(x.lastIndexOf("(") + 1, x.lastIndexOf(")"));
  }

  return {
    connect: connect,
    disconnect: disconnect,
    isConnected: isConnected,
    isCollaborationEnabled: isCollaborationEnabled,
    send: send
  };
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNWUFDVElWSVRZIiwiQUNUSVZFVVNFUlMiLCJBQ1RJVklUSUVTIiwiaXNDb25uZWN0ZWQiLCJjb250cm9sIiwiaW50ZXJuYWxNb2RlbCIsImdldE1vZGVsIiwiaXNDb2xsYWJvcmF0aW9uQ29ubmVjdGVkIiwic2VuZCIsImFjdGlvbiIsImNvbnRlbnQiLCJjbGllbnRDb250ZW50IiwiQXJyYXkiLCJpc0FycmF5Iiwiam9pbiIsIkFjdGl2aXR5IiwiTGl2ZUNoYW5nZSIsIm15QWN0aXZpdHkiLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5IiwiYnJvYWRjYXN0Q29sbGFib3JhdGlvbk1lc3NhZ2UiLCJnZXRXZWJTb2NrZXRCYXNlVVJMIiwiYmluZGluZ0NvbnRleHQiLCJnZXRNZXRhTW9kZWwiLCJnZXRPYmplY3QiLCJpc0NvbGxhYm9yYXRpb25FbmFibGVkIiwidmlldyIsImdldEJpbmRpbmdDb250ZXh0IiwiY29ubmVjdCIsIm1lIiwiQ29sbGFib3JhdGlvblV0aWxzIiwiZ2V0TWUiLCJ3ZWJTb2NrZXRCYXNlVVJMIiwic2VydmljZVVybCIsImdldFNlcnZpY2VVcmwiLCJyZXF1ZXN0UHJvcGVydHkiLCJzRHJhZnRVVUlEIiwiaW5pdGlhbGl6ZUNvbGxhYm9yYXRpb24iLCJtZXNzYWdlIiwibWVzc2FnZVJlY2VpdmUiLCJkaXNjb25uZWN0IiwiZW5kQ29sbGFib3JhdGlvbiIsImFjdGl2ZVVzZXJzIiwiYWN0aXZpdGllcyIsImFjdGl2aXR5S2V5IiwibWV0YVBhdGgiLCJnZXRNZXRhUGF0aCIsInVzZXJBY3Rpb24iLCJjbGllbnRBY3Rpb24iLCJzZW5kZXIiLCJpZCIsInVzZXJJRCIsIm5hbWUiLCJ1c2VyRGVzY3JpcHRpb24iLCJpbml0aWFscyIsImZvcm1hdEluaXRpYWxzIiwiY29sb3IiLCJnZXRVc2VyQ29sb3IiLCJtYWN0aXZpdHkiLCJKb2luIiwiSm9pbkVjaG8iLCJmaW5kSW5kZXgiLCJ1c2VyIiwidW5zaGlmdCIsIkxlYXZlIiwiZmlsdGVyIiwiYWxsQWN0aXZpdGllcyIsInJlbW92ZVVzZXJBY3Rpdml0aWVzIiwiYmFnIiwiYWN0aXZpdHkiLCJwIiwiQ2hhbmdlIiwibWV0YVBhdGhzIiwic3BsaXQiLCJtYXAiLCJwYXRoIiwiZm9yRWFjaCIsImN1cnJlbnRNZXRhUGF0aCIsImkiLCJuZXN0ZWVkTWVzc2FnZSIsImN1cnJlbnRBY3Rpdml0aWVzIiwiZ2V0QWN0aXZpdHlLZXkiLCJrZXkiLCJ1cGRhdGUiLCJDcmVhdGUiLCJEZWxldGUiLCJBY3RpdmF0ZSIsIk1lc3NhZ2VCb3giLCJpbmZvcm1hdGlvbiIsImdldFRleHQiLCJuYXZpZ2F0ZSIsIkRpc2NhcmQiLCJpbml0SlNPTk1vZGVsIiwicGFydHMiLCJsZW5ndGgiLCJzbGljZSIsInB1c2giLCJVbmRvIiwiYSIsImFwcENvbXBvbmVudCIsImdldEFwcENvbXBvbmVudCIsIm1ldGFNb2RlbCIsImN1cnJlbnRQYWdlIiwiZ2V0Q3VycmVudFBhZ2UiLCJzaWRlRWZmZWN0c1NlcnZpY2UiLCJnZXRTaWRlRWZmZWN0c1NlcnZpY2UiLCJjdXJyZW50Q29udGV4dCIsImN1cnJlbnRQYXRoIiwiZ2V0UGF0aCIsImNoYW5nZWREb2N1bWVudCIsImRlbGV0ZWRPYmplY3RzIiwicGFyZW50RGVsZXRlZEluZGV4IiwiZGVsZXRlZE9iamVjdCIsInN0YXJ0c1dpdGgiLCJvbkNsb3NlIiwidGFyZ2V0Q29udGV4dCIsImJpbmRDb250ZXh0IiwiZ2V0Qm91bmRDb250ZXh0IiwiZ2V0Q29udHJvbGxlciIsIl9yb3V0aW5nIiwibmF2aWdhdGVCYWNrRnJvbUNvbnRleHQiLCJhY3Rpdml0eVBhdGgiLCJyZXBsYWNlIiwic2lkZUVmZmVjdHMiLCIkUHJvcGVydHlQYXRoIiwiZW50aXR5VHlwZSIsImdldEVudGl0eVR5cGVGcm9tQ29udGV4dCIsImVudGl0eVR5cGVTaWRlRWZmZWN0cyIsImdldE9EYXRhRW50aXR5U2lkZUVmZmVjdHMiLCJvYmplY3QiLCJPYmplY3QiLCJyZWxldmFudFNpZGVFZmZlY3RzIiwiZnJvbUVudHJpZXMiLCJlbnRyaWVzIiwieCIsIlNvdXJjZVByb3BlcnRpZXMiLCJzb3VyY2UiLCJ2YWx1ZSIsIlRhcmdldFByb3BlcnRpZXMiLCJ0YXJnZXRQcm9wZXJ0eSIsInJlcXVlc3RTaWRlRWZmZWN0cyIsImVkaXRGbG93IiwidXBkYXRlRG9jdW1lbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJvdXRpbmciLCJDb21tb25VdGlscyIsImdldEN1cnJlbnRQYWdlVmlldyIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJBY3Rpdml0eVN5bmMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IHtcblx0YnJvYWRjYXN0Q29sbGFib3JhdGlvbk1lc3NhZ2UsXG5cdGVuZENvbGxhYm9yYXRpb24sXG5cdGluaXRpYWxpemVDb2xsYWJvcmF0aW9uLFxuXHRpc0NvbGxhYm9yYXRpb25Db25uZWN0ZWRcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2NvbGxhYm9yYXRpb24vQWN0aXZpdHlCYXNlXCI7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2UsIFVzZXIsIFVzZXJBY3Rpdml0eSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9jb2xsYWJvcmF0aW9uL0NvbGxhYm9yYXRpb25Db21tb25cIjtcbmltcG9ydCB7IEFjdGl2aXR5LCBDb2xsYWJvcmF0aW9uVXRpbHMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvY29sbGFib3JhdGlvbi9Db2xsYWJvcmF0aW9uQ29tbW9uXCI7XG5pbXBvcnQgTWVzc2FnZUJveCBmcm9tIFwic2FwL20vTWVzc2FnZUJveFwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IHR5cGUgVmlldyBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL1ZpZXdcIjtcbmltcG9ydCB0eXBlIEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSB7IFY0Q29udGV4dCB9IGZyb20gXCJ0eXBlcy9leHRlbnNpb25fdHlwZXNcIjtcblxuY29uc3QgTVlBQ1RJVklUWSA9IFwiL2NvbGxhYm9yYXRpb24vbXlBY3Rpdml0eVwiO1xuY29uc3QgQUNUSVZFVVNFUlMgPSBcIi9jb2xsYWJvcmF0aW9uL2FjdGl2ZVVzZXJzXCI7XG5jb25zdCBBQ1RJVklUSUVTID0gXCIvY29sbGFib3JhdGlvbi9hY3Rpdml0aWVzXCI7XG5cbmV4cG9ydCBjb25zdCBpc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uIChjb250cm9sOiBDb250cm9sKTogYm9vbGVhbiB7XG5cdGNvbnN0IGludGVybmFsTW9kZWwgPSBjb250cm9sLmdldE1vZGVsKFwiaW50ZXJuYWxcIikgYXMgSlNPTk1vZGVsO1xuXHRyZXR1cm4gaXNDb2xsYWJvcmF0aW9uQ29ubmVjdGVkKGludGVybmFsTW9kZWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlbmQgPSBmdW5jdGlvbiAoY29udHJvbDogQ29udHJvbCwgYWN0aW9uOiBBY3Rpdml0eSwgY29udGVudDogc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWQpIHtcblx0aWYgKGlzQ29ubmVjdGVkKGNvbnRyb2wpKSB7XG5cdFx0Y29uc3QgaW50ZXJuYWxNb2RlbCA9IGNvbnRyb2wuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKSBhcyBKU09OTW9kZWw7XG5cdFx0Y29uc3QgY2xpZW50Q29udGVudCA9IEFycmF5LmlzQXJyYXkoY29udGVudCkgPyBjb250ZW50LmpvaW4oXCJ8XCIpIDogY29udGVudDtcblxuXHRcdGlmIChhY3Rpb24gPT09IEFjdGl2aXR5LkxpdmVDaGFuZ2UpIHtcblx0XHRcdC8vIFRvIGF2b2lkIHVubmVjZXNzYXJ5IHRyYWZmaWMgd2Uga2VlcCB0cmFjayBvZiBsaXZlIGNoYW5nZXMgYW5kIHNlbmQgaXQgb25seSBvbmNlXG5cdFx0XHRjb25zdCBteUFjdGl2aXR5ID0gaW50ZXJuYWxNb2RlbC5nZXRQcm9wZXJ0eShNWUFDVElWSVRZKTtcblx0XHRcdGlmIChteUFjdGl2aXR5ID09PSBjbGllbnRDb250ZW50KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoTVlBQ1RJVklUWSwgY2xpZW50Q29udGVudCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHVzZXIgZmluaXNoZWQgdGhlIGFjdGl2aXR5XG5cdFx0XHRpbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KE1ZQUNUSVZJVFksIG51bGwpO1xuXHRcdH1cblxuXHRcdGJyb2FkY2FzdENvbGxhYm9yYXRpb25NZXNzYWdlKGFjdGlvbiwgY2xpZW50Q29udGVudCwgaW50ZXJuYWxNb2RlbCk7XG5cdH1cbn07XG5cbmNvbnN0IGdldFdlYlNvY2tldEJhc2VVUkwgPSBmdW5jdGlvbiAoYmluZGluZ0NvbnRleHQ6IFY0Q29udGV4dCk6IHN0cmluZyB7XG5cdHJldHVybiBiaW5kaW5nQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLmdldE9iamVjdChcIi9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLldlYlNvY2tldEJhc2VVUkxcIik7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDb2xsYWJvcmF0aW9uRW5hYmxlZCA9IGZ1bmN0aW9uICh2aWV3OiBWaWV3KTogYm9vbGVhbiB7XG5cdGNvbnN0IGJpbmRpbmdDb250ZXh0ID0gdmlldz8uZ2V0QmluZGluZ0NvbnRleHQgJiYgKHZpZXcuZ2V0QmluZGluZ0NvbnRleHQoKSBhcyBWNENvbnRleHQpO1xuXHRyZXR1cm4gISEoYmluZGluZ0NvbnRleHQgJiYgZ2V0V2ViU29ja2V0QmFzZVVSTChiaW5kaW5nQ29udGV4dCkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbm5lY3QgPSBhc3luYyBmdW5jdGlvbiAodmlldzogVmlldykge1xuXHRjb25zdCBpbnRlcm5hbE1vZGVsID0gdmlldy5nZXRNb2RlbChcImludGVybmFsXCIpIGFzIEpTT05Nb2RlbDtcblx0Y29uc3QgbWUgPSBDb2xsYWJvcmF0aW9uVXRpbHMuZ2V0TWUodmlldyk7XG5cblx0Ly8gUmV0cmlldmluZyBNRSBmcm9tIHNoZWxsIHNlcnZpY2Vcblx0aWYgKCFtZSkge1xuXHRcdC8vIG5vIG1lID0gbm8gc2hlbGwgPSBub3Qgc3VyZSB3aGF0IHRvIGRvXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgYmluZGluZ0NvbnRleHQgPSB2aWV3LmdldEJpbmRpbmdDb250ZXh0KCkgYXMgVjRDb250ZXh0O1xuXHRjb25zdCB3ZWJTb2NrZXRCYXNlVVJMID0gZ2V0V2ViU29ja2V0QmFzZVVSTChiaW5kaW5nQ29udGV4dCk7XG5cdGNvbnN0IHNlcnZpY2VVcmwgPSBiaW5kaW5nQ29udGV4dC5nZXRNb2RlbCgpLmdldFNlcnZpY2VVcmwoKTtcblxuXHRpZiAoIXdlYlNvY2tldEJhc2VVUkwpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBzRHJhZnRVVUlEID0gYXdhaXQgYmluZGluZ0NvbnRleHQucmVxdWVzdFByb3BlcnR5KFwiRHJhZnRBZG1pbmlzdHJhdGl2ZURhdGEvRHJhZnRVVUlEXCIpO1xuXHRpZiAoIXNEcmFmdFVVSUQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpbml0aWFsaXplQ29sbGFib3JhdGlvbihtZSwgd2ViU29ja2V0QmFzZVVSTCwgc0RyYWZ0VVVJRCwgc2VydmljZVVybCwgaW50ZXJuYWxNb2RlbCwgKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcblx0XHRtZXNzYWdlUmVjZWl2ZShtZXNzYWdlLCB2aWV3KTtcblx0fSk7XG59O1xuXG5leHBvcnQgY29uc3QgZGlzY29ubmVjdCA9IGZ1bmN0aW9uIChjb250cm9sOiBDb250cm9sKSB7XG5cdGNvbnN0IGludGVybmFsTW9kZWwgPSBjb250cm9sLmdldE1vZGVsKFwiaW50ZXJuYWxcIikgYXMgSlNPTk1vZGVsO1xuXHRlbmRDb2xsYWJvcmF0aW9uKGludGVybmFsTW9kZWwpO1xufTtcblxuZnVuY3Rpb24gbWVzc2FnZVJlY2VpdmUobWVzc2FnZTogTWVzc2FnZSwgdmlldzogVmlldykge1xuXHRjb25zdCBpbnRlcm5hbE1vZGVsOiBhbnkgPSB2aWV3LmdldE1vZGVsKFwiaW50ZXJuYWxcIik7XG5cdGxldCBhY3RpdmVVc2VyczogVXNlcltdID0gaW50ZXJuYWxNb2RlbC5nZXRQcm9wZXJ0eShBQ1RJVkVVU0VSUyk7XG5cdGxldCBhY3Rpdml0aWVzOiBVc2VyQWN0aXZpdHlbXTtcblx0bGV0IGFjdGl2aXR5S2V5OiBzdHJpbmc7XG5cdGNvbnN0IG1ldGFQYXRoOiBzdHJpbmcgPSBtZXNzYWdlLmNsaWVudENvbnRlbnQgJiYgKHZpZXcuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbCkuZ2V0TWV0YVBhdGgobWVzc2FnZS5jbGllbnRDb250ZW50KTtcblx0bWVzc2FnZS51c2VyQWN0aW9uID0gbWVzc2FnZS51c2VyQWN0aW9uIHx8IG1lc3NhZ2UuY2xpZW50QWN0aW9uO1xuXG5cdGNvbnN0IHNlbmRlcjogVXNlciA9IHtcblx0XHRpZDogbWVzc2FnZS51c2VySUQsXG5cdFx0bmFtZTogbWVzc2FnZS51c2VyRGVzY3JpcHRpb24sXG5cdFx0aW5pdGlhbHM6IENvbGxhYm9yYXRpb25VdGlscy5mb3JtYXRJbml0aWFscyhtZXNzYWdlLnVzZXJEZXNjcmlwdGlvbiksXG5cdFx0Y29sb3I6IENvbGxhYm9yYXRpb25VdGlscy5nZXRVc2VyQ29sb3IobWVzc2FnZS51c2VySUQsIGFjdGl2ZVVzZXJzLCBbXSlcblx0fTtcblxuXHRsZXQgbWFjdGl2aXR5OiBVc2VyQWN0aXZpdHkgPSBzZW5kZXI7XG5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxuXHRzd2l0Y2ggKG1lc3NhZ2UudXNlckFjdGlvbikge1xuXHRcdGNhc2UgQWN0aXZpdHkuSm9pbjpcblx0XHRjYXNlIEFjdGl2aXR5LkpvaW5FY2hvOlxuXHRcdFx0aWYgKGFjdGl2ZVVzZXJzLmZpbmRJbmRleCgodXNlcikgPT4gdXNlci5pZCA9PT0gc2VuZGVyLmlkKSA9PT0gLTEpIHtcblx0XHRcdFx0YWN0aXZlVXNlcnMudW5zaGlmdChzZW5kZXIpO1xuXHRcdFx0XHRpbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KEFDVElWRVVTRVJTLCBhY3RpdmVVc2Vycyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChtZXNzYWdlLnVzZXJBY3Rpb24gPT09IEFjdGl2aXR5LkpvaW4pIHtcblx0XHRcdFx0Ly8gd2UgZWNobyBvdXIgZXhpc3RlbmNlIHRvIHRoZSBuZXdseSBlbnRlcmVkIHVzZXIgYW5kIGFsc28gc2VuZCB0aGUgY3VycmVudCBhY3Rpdml0eSBpZiB0aGVyZSBpcyBhbnlcblx0XHRcdFx0YnJvYWRjYXN0Q29sbGFib3JhdGlvbk1lc3NhZ2UoQWN0aXZpdHkuSm9pbkVjaG8sIGludGVybmFsTW9kZWwuZ2V0UHJvcGVydHkoTVlBQ1RJVklUWSksIGludGVybmFsTW9kZWwpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobWVzc2FnZS51c2VyQWN0aW9uID09PSBBY3Rpdml0eS5Kb2luRWNobykge1xuXHRcdFx0XHRpZiAobWVzc2FnZS5jbGllbnRDb250ZW50KSB7XG5cdFx0XHRcdFx0Ly8gYW5vdGhlciB1c2VyIHdhcyBhbHJlYWR5IHR5cGluZyB0aGVyZWZvcmUgSSB3YW50IHRvIHNlZSBoaXMgYWN0aXZpdHkgaW1tZWRpYXRlbHkuIENhbGxpbmcgbWUgYWdhaW4gYXMgYSBsaXZlIGNoYW5nZVxuXHRcdFx0XHRcdG1lc3NhZ2UudXNlckFjdGlvbiA9IEFjdGl2aXR5LkxpdmVDaGFuZ2U7XG5cdFx0XHRcdFx0bWVzc2FnZVJlY2VpdmUobWVzc2FnZSwgdmlldyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBBY3Rpdml0eS5MZWF2ZTpcblx0XHRcdC8vIFJlbW92aW5nIHRoZSBhY3RpdmUgdXNlci4gTm90IHJlbW92aW5nIFwibWVcIiBpZiBJIGhhZCB0aGUgc2NyZWVuIG9wZW4gaW4gYW5vdGhlciBzZXNzaW9uXG5cdFx0XHRhY3RpdmVVc2VycyA9IGFjdGl2ZVVzZXJzLmZpbHRlcigodXNlcikgPT4gdXNlci5pZCAhPT0gc2VuZGVyLmlkIHx8IHVzZXIubWUpO1xuXHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShBQ1RJVkVVU0VSUywgYWN0aXZlVXNlcnMpO1xuXHRcdFx0Y29uc3QgYWxsQWN0aXZpdGllcyA9IGludGVybmFsTW9kZWwuZ2V0UHJvcGVydHkoQUNUSVZJVElFUykgfHwge307XG5cdFx0XHRjb25zdCByZW1vdmVVc2VyQWN0aXZpdGllcyA9IGZ1bmN0aW9uIChiYWc6IGFueSkge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShiYWcpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGJhZy5maWx0ZXIoKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5pZCAhPT0gc2VuZGVyLmlkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHAgaW4gYmFnKSB7XG5cdFx0XHRcdFx0XHRiYWdbcF0gPSByZW1vdmVVc2VyQWN0aXZpdGllcyhiYWdbcF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gYmFnO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmVtb3ZlVXNlckFjdGl2aXRpZXMoYWxsQWN0aXZpdGllcyk7XG5cdFx0XHRpbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KEFDVElWSVRJRVMsIGFsbEFjdGl2aXRpZXMpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIEFjdGl2aXR5LkNoYW5nZTpcblx0XHRcdGNvbnN0IG1ldGFQYXRocyA9IG1lc3NhZ2U/LmNsaWVudENvbnRlbnQ/LnNwbGl0KFwifFwiKS5tYXAoKHBhdGgpID0+IHtcblx0XHRcdFx0cmV0dXJuICh2aWV3LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkgYXMgT0RhdGFNZXRhTW9kZWwpLmdldE1ldGFQYXRoKHBhdGgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1ldGFQYXRocy5mb3JFYWNoKChjdXJyZW50TWV0YVBhdGgsIGkpID0+IHtcblx0XHRcdFx0Y29uc3QgbmVzdGVlZE1lc3NhZ2UgPSB7XG5cdFx0XHRcdFx0Li4ubWVzc2FnZSxcblx0XHRcdFx0XHRjbGllbnRDb250ZW50OiBtZXNzYWdlPy5jbGllbnRDb250ZW50Py5zcGxpdChcInxcIilbaV1cblx0XHRcdFx0fTtcblx0XHRcdFx0bGV0IGN1cnJlbnRBY3Rpdml0aWVzOiBhbnlbXSA9IGludGVybmFsTW9kZWwuZ2V0UHJvcGVydHkoQUNUSVZJVElFUyArIGN1cnJlbnRNZXRhUGF0aCkgfHwgW107XG5cdFx0XHRcdGFjdGl2aXR5S2V5ID0gZ2V0QWN0aXZpdHlLZXkobmVzdGVlZE1lc3NhZ2UuY2xpZW50Q29udGVudCk7XG5cdFx0XHRcdGN1cnJlbnRBY3Rpdml0aWVzID0gY3VycmVudEFjdGl2aXRpZXM/LmZpbHRlciAmJiBjdXJyZW50QWN0aXZpdGllcy5maWx0ZXIoKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5rZXkgIT09IGFjdGl2aXR5S2V5KTtcblx0XHRcdFx0aWYgKGN1cnJlbnRBY3Rpdml0aWVzKSB7XG5cdFx0XHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShBQ1RJVklUSUVTICsgY3VycmVudE1ldGFQYXRoLCBjdXJyZW50QWN0aXZpdGllcyk7XG5cdFx0XHRcdFx0dXBkYXRlKHZpZXcsIG5lc3RlZWRNZXNzYWdlLCBjdXJyZW50TWV0YVBhdGgsIEFjdGl2aXR5LkNoYW5nZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBBY3Rpdml0eS5DcmVhdGU6XG5cdFx0XHQvLyBGb3IgY3JlYXRlIHdlIGFjdHVhbGx5IGp1c3QgbmVlZCB0byByZWZyZXNoIHRoZSB0YWJsZVxuXHRcdFx0dXBkYXRlKHZpZXcsIG1lc3NhZ2UsIG1ldGFQYXRoLCBBY3Rpdml0eS5DcmVhdGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBBY3Rpdml0eS5EZWxldGU6XG5cdFx0XHQvLyBGb3Igbm93IGFsc28gcmVmcmVzaCB0aGUgcGFnZSBidXQgaW4gY2FzZSBvZiBkZWxldGlvbiB3ZSBuZWVkIHRvIGluZm9ybSB0aGUgdXNlclxuXHRcdFx0dXBkYXRlKHZpZXcsIG1lc3NhZ2UsIG1ldGFQYXRoLCBBY3Rpdml0eS5EZWxldGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBBY3Rpdml0eS5BY3RpdmF0ZTpcblx0XHRcdGRpc2Nvbm5lY3Qodmlldyk7XG5cdFx0XHRNZXNzYWdlQm94LmluZm9ybWF0aW9uKENvbGxhYm9yYXRpb25VdGlscy5nZXRUZXh0KFwiQ19DT0xMQUJPUkFUSU9ORFJBRlRfQUNUSVZBVEVcIiwgc2VuZGVyLm5hbWUpKTtcblx0XHRcdG5hdmlnYXRlKG1lc3NhZ2UuY2xpZW50Q29udGVudCwgdmlldyk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEFjdGl2aXR5LkRpc2NhcmQ6XG5cdFx0XHRkaXNjb25uZWN0KHZpZXcpO1xuXHRcdFx0TWVzc2FnZUJveC5pbmZvcm1hdGlvbihDb2xsYWJvcmF0aW9uVXRpbHMuZ2V0VGV4dChcIkNfQ09MTEFCT1JBVElPTkRSQUZUX0RJU0NBUkRcIiwgc2VuZGVyLm5hbWUpKTtcblx0XHRcdG5hdmlnYXRlKG1lc3NhZ2UuY2xpZW50Q29udGVudCwgdmlldyk7XG5cdFx0XHRicmVhaztcblx0XHQvKlxuXHRcdC8vIFRPRE86IEFjdGlvbiB0byBiZSBpbXBsZW1lbnRlZFxuXHRcdGNhc2UgQWN0aXZpdHkuQWN0aW9uOlxuXHRcdFx0Ly8gSnVzdCBmb3IgdGVzdCByZWFzb25zIHNob3cgYSB0b2FzdCAtIHRvIGJlIGNoZWNrZWQgd2l0aCBVWFxuXHRcdFx0TWVzc2FnZVRvYXN0LnNob3coXCJVc2VyIFwiICsgc2VuZGVyLm5hbWUgKyBcIiBoYXMgZXhlY3V0ZWQgYWN0aW9uIFwiICsgbWV0YVBhdGguc3BsaXQoXCJ8XCIpWzBdKTtcblx0XHRcdC8vdXBkYXRlKHZpZXcsIG1lc3NhZ2UsIG1ldGFQYXRoLCBBY3Rpdml0eS5EZWxldGUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ICovXG5cdFx0Y2FzZSBBY3Rpdml0eS5MaXZlQ2hhbmdlOlxuXHRcdFx0bWFjdGl2aXR5ID0gc2VuZGVyO1xuXHRcdFx0bWFjdGl2aXR5LmtleSA9IGdldEFjdGl2aXR5S2V5KG1lc3NhZ2UuY2xpZW50Q29udGVudCk7XG5cblx0XHRcdC8vIHN0dXBpZCBKU09OIG1vZGVsLi4uXG5cdFx0XHRsZXQgaW5pdEpTT05Nb2RlbDogc3RyaW5nID0gXCJcIjtcblx0XHRcdGNvbnN0IHBhcnRzID0gbWV0YVBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpKyspIHtcblx0XHRcdFx0aW5pdEpTT05Nb2RlbCArPSBgLyR7cGFydHNbaV19YDtcblx0XHRcdFx0aWYgKCFpbnRlcm5hbE1vZGVsLmdldFByb3BlcnR5KEFDVElWSVRJRVMgKyBpbml0SlNPTk1vZGVsKSkge1xuXHRcdFx0XHRcdGludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoQUNUSVZJVElFUyArIGluaXRKU09OTW9kZWwsIHt9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhY3Rpdml0aWVzID0gaW50ZXJuYWxNb2RlbC5nZXRQcm9wZXJ0eShBQ1RJVklUSUVTICsgbWV0YVBhdGgpO1xuXHRcdFx0YWN0aXZpdGllcyA9IGFjdGl2aXRpZXM/LnNsaWNlID8gYWN0aXZpdGllcy5zbGljZSgpIDogW107XG5cdFx0XHRhY3Rpdml0aWVzLnB1c2gobWFjdGl2aXR5KTtcblx0XHRcdGludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoQUNUSVZJVElFUyArIG1ldGFQYXRoLCBhY3Rpdml0aWVzKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgQWN0aXZpdHkuVW5kbzpcblx0XHRcdC8vIFRoZSB1c2VyIGRpZCBhIGNoYW5nZSBidXQgcmV2ZXJ0ZWQgaXQsIHRoZXJlZm9yZSB1bmJsb2NrIHRoZSBjb250cm9sXG5cdFx0XHRhY3Rpdml0aWVzID0gaW50ZXJuYWxNb2RlbC5nZXRQcm9wZXJ0eShBQ1RJVklUSUVTICsgbWV0YVBhdGgpO1xuXHRcdFx0YWN0aXZpdHlLZXkgPSBnZXRBY3Rpdml0eUtleShtZXNzYWdlLmNsaWVudENvbnRlbnQpO1xuXHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcblx0XHRcdFx0QUNUSVZJVElFUyArIG1ldGFQYXRoLFxuXHRcdFx0XHRhY3Rpdml0aWVzLmZpbHRlcigoYSkgPT4gYS5rZXkgIT09IGFjdGl2aXR5S2V5KVxuXHRcdFx0KTtcblx0XHRcdGJyZWFrO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSh2aWV3OiBWaWV3LCBtZXNzYWdlOiBNZXNzYWdlLCBtZXRhUGF0aDogc3RyaW5nLCBhY3Rpb246IEFjdGl2aXR5KSB7XG5cdGNvbnN0IGFwcENvbXBvbmVudCA9IENvbGxhYm9yYXRpb25VdGlscy5nZXRBcHBDb21wb25lbnQodmlldyk7XG5cdGNvbnN0IG1ldGFNb2RlbCA9IHZpZXcuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbDtcblx0Y29uc3QgY3VycmVudFBhZ2UgPSBnZXRDdXJyZW50UGFnZSh2aWV3KTtcblx0Y29uc3Qgc2lkZUVmZmVjdHNTZXJ2aWNlID0gYXBwQ29tcG9uZW50LmdldFNpZGVFZmZlY3RzU2VydmljZSgpO1xuXHRjb25zdCBjdXJyZW50Q29udGV4dCA9IGN1cnJlbnRQYWdlLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdGNvbnN0IGN1cnJlbnRQYXRoID0gY3VycmVudENvbnRleHQuZ2V0UGF0aCgpO1xuXHRjb25zdCBjdXJyZW50TWV0YVBhdGggPSBtZXRhTW9kZWwuZ2V0TWV0YVBhdGgoY3VycmVudFBhdGgpO1xuXHRsZXQgY2hhbmdlZERvY3VtZW50ID0gbWVzc2FnZS5jbGllbnRDb250ZW50O1xuXG5cdGlmIChhY3Rpb24gPT09IEFjdGl2aXR5LkRlbGV0ZSkge1xuXHRcdC8vIGNoZWNrIGlmIHVzZXIgY3VycmVudGx5IGRpc3BsYXlzIG9uZSBkZWxldGVkIG9iamVjdFxuXHRcdGNvbnN0IGRlbGV0ZWRPYmplY3RzID0gbWVzc2FnZS5jbGllbnRDb250ZW50LnNwbGl0KFwifFwiKTtcblx0XHRjb25zdCBwYXJlbnREZWxldGVkSW5kZXggPSBkZWxldGVkT2JqZWN0cy5maW5kSW5kZXgoKGRlbGV0ZWRPYmplY3QpID0+IGN1cnJlbnRQYXRoLnN0YXJ0c1dpdGgoZGVsZXRlZE9iamVjdCkpO1xuXHRcdGlmIChwYXJlbnREZWxldGVkSW5kZXggPiAtMSkge1xuXHRcdFx0Ly8gYW55IG90aGVyIHVzZXIgZGVsZXRlZCB0aGUgb2JqZWN0IEknbSBjdXJyZW50bHkgbG9va2luZyBhdC4gSW5mb3JtIHRoZSB1c2VyIHdlIHdpbGwgbmF2aWdhdGUgdG8gcm9vdCBub3dcblx0XHRcdE1lc3NhZ2VCb3guaW5mb3JtYXRpb24oQ29sbGFib3JhdGlvblV0aWxzLmdldFRleHQoXCJDX0NPTExBQk9SQVRJT05EUkFGVF9ERUxFVEVcIiwgbWVzc2FnZS51c2VyRGVzY3JpcHRpb24pLCB7XG5cdFx0XHRcdG9uQ2xvc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjb25zdCB0YXJnZXRDb250ZXh0ID0gdmlldy5nZXRNb2RlbCgpLmJpbmRDb250ZXh0KGRlbGV0ZWRPYmplY3RzW3BhcmVudERlbGV0ZWRJbmRleF0pLmdldEJvdW5kQ29udGV4dCgpO1xuXHRcdFx0XHRcdGN1cnJlbnRQYWdlLmdldENvbnRyb2xsZXIoKS5fcm91dGluZy5uYXZpZ2F0ZUJhY2tGcm9tQ29udGV4dCh0YXJnZXRDb250ZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8vIFRPRE86IEZvciBub3cganVzdCB0YWtlIHRoZSBmaXJzdCBvYmplY3QgdG8gZ2V0IHRoZSBtZXRhIHBhdGggYW5kIGRvIGEgZnVsbCByZWZyZXNoIG9mIHRoZSB0YWJsZVxuXHRcdGNoYW5nZWREb2N1bWVudCA9IGRlbGV0ZWRPYmplY3RzWzBdO1xuXHR9XG5cblx0aWYgKGNoYW5nZWREb2N1bWVudC5zdGFydHNXaXRoKGN1cnJlbnRQYXRoKSkge1xuXHRcdC8vIEV4ZWN1dGUgU2lkZUVmZmVjdHMgKFRPRE8gZm9yIE1lZXQgdGhlcmUgc2hvdWxkIGJlIG9uZSBjZW50cmFsIG1ldGhvZClcblx0XHRjb25zdCBhY3Rpdml0eVBhdGggPSBtZXRhUGF0aC5yZXBsYWNlKGN1cnJlbnRNZXRhUGF0aCwgXCJcIikuc2xpY2UoMSk7XG5cdFx0aWYgKGFjdGl2aXR5UGF0aCkge1xuXHRcdFx0Ly8gUmVxdWVzdCBhbHNvIHRoZSBwcm9wZXJ0eSBpdHNlbGZcblx0XHRcdGNvbnN0IHNpZGVFZmZlY3RzOiBhbnlbXSA9IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCRQcm9wZXJ0eVBhdGg6IGFjdGl2aXR5UGF0aFxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgZW50aXR5VHlwZSA9IHNpZGVFZmZlY3RzU2VydmljZS5nZXRFbnRpdHlUeXBlRnJvbUNvbnRleHQoY3VycmVudENvbnRleHQpO1xuXHRcdFx0Y29uc3QgZW50aXR5VHlwZVNpZGVFZmZlY3RzID0gc2lkZUVmZmVjdHNTZXJ2aWNlLmdldE9EYXRhRW50aXR5U2lkZUVmZmVjdHMoZW50aXR5VHlwZSEpO1xuXHRcdFx0Ly8gUG9vciBtYW4gc29sdXRpb24gd2l0aG91dCBjaGVja2luZyBzb3VyY2UgdGFyZ2V0cywganVzdCBmb3IgUE9DLCB0aGlzIGlzIHRocm93LXdheSBjb2Rpbmcgb25seVxuXHRcdFx0Y29uc3Qgb2JqZWN0OiBhbnkgPSBPYmplY3Q7IC8vIGp1c3QgdG8gb3ZlcmNvbWUgVFMgaXNzdWVzLCB3aWxsIGJlIGFueXdheSByZXBsYWNlZFxuXHRcdFx0Y29uc3QgcmVsZXZhbnRTaWRlRWZmZWN0cyA9IG9iamVjdC5mcm9tRW50cmllcyhcblx0XHRcdFx0b2JqZWN0XG5cdFx0XHRcdFx0LmVudHJpZXMoZW50aXR5VHlwZVNpZGVFZmZlY3RzKVxuXHRcdFx0XHRcdC5maWx0ZXIoKHg6IGFueVtdKSA9PiB4WzFdLlNvdXJjZVByb3BlcnRpZXM/LmZpbmRJbmRleCgoc291cmNlOiBhbnkpID0+IHNvdXJjZS52YWx1ZSA9PT0gYWN0aXZpdHlQYXRoKSA+IC0xKVxuXHRcdFx0KTtcblx0XHRcdGZvciAoY29uc3QgcCBpbiByZWxldmFudFNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdHJlbGV2YW50U2lkZUVmZmVjdHNbcF0uVGFyZ2V0UHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXRQcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRcdFx0c2lkZUVmZmVjdHMucHVzaCh7XG5cdFx0XHRcdFx0XHQkUHJvcGVydHlQYXRoOiB0YXJnZXRQcm9wZXJ0eVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHNpZGVFZmZlY3RzU2VydmljZS5yZXF1ZXN0U2lkZUVmZmVjdHMoc2lkZUVmZmVjdHMsIGN1cnJlbnRDb250ZXh0LCBcIiRhdXRvXCIpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFNpbXVsYXRlIGFueSBjaGFuZ2Ugc28gdGhlIGVkaXQgZmxvdyBzaG93cyB0aGUgZHJhZnQgaW5kaWNhdG9yIGFuZCBzZXRzIHRoZSBwYWdlIHRvIGRpcnR5XG5cdGN1cnJlbnRQYWdlLmdldENvbnRyb2xsZXIoKS5lZGl0Rmxvdy51cGRhdGVEb2N1bWVudChjdXJyZW50Q29udGV4dCwgUHJvbWlzZS5yZXNvbHZlKCkpO1xufVxuXG5mdW5jdGlvbiBuYXZpZ2F0ZShwYXRoOiBzdHJpbmcsIHZpZXc6IFZpZXcpIHtcblx0Ly8gVE9ETzogcm91dGluZy5uYXZpZ2F0ZSBkb2Vzbid0IGNvbnNpZGVyIHNlbWFudGljIGJvb2ttYXJraW5nXG5cdGNvbnN0IGN1cnJlbnRQYWdlID0gZ2V0Q3VycmVudFBhZ2Uodmlldyk7XG5cdGNvbnN0IHRhcmdldENvbnRleHQgPSB2aWV3LmdldE1vZGVsKCkuYmluZENvbnRleHQocGF0aCkuZ2V0Qm91bmRDb250ZXh0KCk7XG5cdGN1cnJlbnRQYWdlLmdldENvbnRyb2xsZXIoKS5yb3V0aW5nLm5hdmlnYXRlKHRhcmdldENvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50UGFnZSh2aWV3OiBWaWV3KSB7XG5cdGNvbnN0IGFwcENvbXBvbmVudCA9IENvbGxhYm9yYXRpb25VdGlscy5nZXRBcHBDb21wb25lbnQodmlldyk7XG5cdHJldHVybiBDb21tb25VdGlscy5nZXRDdXJyZW50UGFnZVZpZXcoYXBwQ29tcG9uZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWN0aXZpdHlLZXkoeDogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIHguc3Vic3RyaW5nKHgubGFzdEluZGV4T2YoXCIoXCIpICsgMSwgeC5sYXN0SW5kZXhPZihcIilcIikpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGNvbm5lY3Q6IGNvbm5lY3QsXG5cdGRpc2Nvbm5lY3Q6IGRpc2Nvbm5lY3QsXG5cdGlzQ29ubmVjdGVkOiBpc0Nvbm5lY3RlZCxcblx0aXNDb2xsYWJvcmF0aW9uRW5hYmxlZDogaXNDb2xsYWJvcmF0aW9uRW5hYmxlZCxcblx0c2VuZDogc2VuZFxufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JBLElBQU1BLFVBQVUsR0FBRywyQkFBbkI7RUFDQSxJQUFNQyxXQUFXLEdBQUcsNEJBQXBCO0VBQ0EsSUFBTUMsVUFBVSxHQUFHLDJCQUFuQjs7RUFFTyxJQUFNQyxXQUFXLEdBQUcsVUFBVUMsT0FBVixFQUFxQztJQUMvRCxJQUFNQyxhQUFhLEdBQUdELE9BQU8sQ0FBQ0UsUUFBUixDQUFpQixVQUFqQixDQUF0QjtJQUNB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