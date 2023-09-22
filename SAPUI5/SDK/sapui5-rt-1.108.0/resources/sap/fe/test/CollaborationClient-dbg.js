/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/test/api/CollaborationAPI", "sap/ui/test/OpaBuilder"], function (CollaborationCommon, CollaborationAPI, OpaBuilder) {
  "use strict";

  var Activity = CollaborationCommon.Activity;

  function CollaborationClient(oPageDefinition) {
    var sAppId = oPageDefinition.appId,
        sComponentId = oPageDefinition.componentId,
        viewId = "".concat(sAppId, "::").concat(sComponentId);
    return {
      actions: {
        iEnterDraft: function (userID, userName) {
          return OpaBuilder.create(this).hasId(viewId).do(function (view) {
            var oContext = view.getBindingContext();
            CollaborationAPI.enterDraft(oContext, userID, userName);
          }).viewId("").description("Remote session entering draft").execute();
        },
        iLeaveDraft: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.leaveDraft();
          }).description("Remote session leaving draft").execute();
        },
        iLockPropertyForEdition: function (sPropertyPath) {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.startLiveChange(sPropertyPath);
          }).description("Remote session locking property ".concat(sPropertyPath)).execute();
        },
        iUnlockPropertyForEdition: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.undoChange();
          }).description("Remote session unlocking property ").execute();
        },
        iUpdatePropertyValue: function (sPropertyPath, value) {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.updatePropertyValue(sPropertyPath, value);
          }).description("Remote session updating property ".concat(sPropertyPath, " with ").concat(value)).execute();
        },
        iDiscardDraft: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.discardDraft();
          }).description("Remote session discarding draft").execute();
        },
        iDeleteDraft: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.deleteDraft();
          }).description("Remote session deleting draft").execute();
        }
      },
      assertions: {
        iCheckDefaultUserChangedValue: function (sPropertyPath) {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Change,
              clientContent: sPropertyPath
            });
          }).description("Remote session received change notification for".concat(sPropertyPath, " changed")).execute();
        },
        iCheckDefaultUserLeftDraft: function () {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Leave
            });
          }).description("Remote session received notification on default user leaving the draft session").execute();
        },
        iCheckDefaultUserEnteredDraft: function () {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Join
            });
          }).description("Remote session received notification on default user entering the draft session").execute();
        }
      }
    };
  }

  return CollaborationClient;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb2xsYWJvcmF0aW9uQ2xpZW50Iiwib1BhZ2VEZWZpbml0aW9uIiwic0FwcElkIiwiYXBwSWQiLCJzQ29tcG9uZW50SWQiLCJjb21wb25lbnRJZCIsInZpZXdJZCIsImFjdGlvbnMiLCJpRW50ZXJEcmFmdCIsInVzZXJJRCIsInVzZXJOYW1lIiwiT3BhQnVpbGRlciIsImNyZWF0ZSIsImhhc0lkIiwiZG8iLCJ2aWV3Iiwib0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsIkNvbGxhYm9yYXRpb25BUEkiLCJlbnRlckRyYWZ0IiwiZGVzY3JpcHRpb24iLCJleGVjdXRlIiwiaUxlYXZlRHJhZnQiLCJsZWF2ZURyYWZ0IiwiaUxvY2tQcm9wZXJ0eUZvckVkaXRpb24iLCJzUHJvcGVydHlQYXRoIiwic3RhcnRMaXZlQ2hhbmdlIiwiaVVubG9ja1Byb3BlcnR5Rm9yRWRpdGlvbiIsInVuZG9DaGFuZ2UiLCJpVXBkYXRlUHJvcGVydHlWYWx1ZSIsInZhbHVlIiwidXBkYXRlUHJvcGVydHlWYWx1ZSIsImlEaXNjYXJkRHJhZnQiLCJkaXNjYXJkRHJhZnQiLCJpRGVsZXRlRHJhZnQiLCJkZWxldGVEcmFmdCIsImFzc2VydGlvbnMiLCJpQ2hlY2tEZWZhdWx0VXNlckNoYW5nZWRWYWx1ZSIsImNoZWNrIiwiY2hlY2tSZWNlaXZlZCIsInVzZXJBY3Rpb24iLCJBY3Rpdml0eSIsIkNoYW5nZSIsImNsaWVudENvbnRlbnQiLCJpQ2hlY2tEZWZhdWx0VXNlckxlZnREcmFmdCIsIkxlYXZlIiwiaUNoZWNrRGVmYXVsdFVzZXJFbnRlcmVkRHJhZnQiLCJKb2luIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJDb2xsYWJvcmF0aW9uQ2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGl2aXR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL2NvbGxhYm9yYXRpb24vQ29sbGFib3JhdGlvbkNvbW1vblwiO1xuaW1wb3J0IENvbGxhYm9yYXRpb25BUEkgZnJvbSBcInNhcC9mZS90ZXN0L2FwaS9Db2xsYWJvcmF0aW9uQVBJXCI7XG5pbXBvcnQgdHlwZSBPcGE1IGZyb20gXCJzYXAvdWkvdGVzdC9PcGE1XCI7XG5pbXBvcnQgT3BhQnVpbGRlciBmcm9tIFwic2FwL3VpL3Rlc3QvT3BhQnVpbGRlclwiO1xuXG5mdW5jdGlvbiBDb2xsYWJvcmF0aW9uQ2xpZW50KG9QYWdlRGVmaW5pdGlvbjogeyBhcHBJZDogc3RyaW5nOyBjb21wb25lbnRJZDogc3RyaW5nIH0pIHtcblx0Y29uc3Qgc0FwcElkID0gb1BhZ2VEZWZpbml0aW9uLmFwcElkLFxuXHRcdHNDb21wb25lbnRJZCA9IG9QYWdlRGVmaW5pdGlvbi5jb21wb25lbnRJZCxcblx0XHR2aWV3SWQgPSBgJHtzQXBwSWR9Ojoke3NDb21wb25lbnRJZH1gO1xuXG5cdHJldHVybiB7XG5cdFx0YWN0aW9uczoge1xuXHRcdFx0aUVudGVyRHJhZnQ6IGZ1bmN0aW9uICh1c2VySUQ6IHN0cmluZywgdXNlck5hbWU6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gT3BhQnVpbGRlci5jcmVhdGUodGhpcyBhcyBhbnkgYXMgT3BhNSlcblx0XHRcdFx0XHQuaGFzSWQodmlld0lkKVxuXHRcdFx0XHRcdC5kbyhmdW5jdGlvbiAodmlldzogYW55KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvQ29udGV4dCA9IHZpZXcuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0XHRcdFx0XHRcdENvbGxhYm9yYXRpb25BUEkuZW50ZXJEcmFmdChvQ29udGV4dCwgdXNlcklELCB1c2VyTmFtZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQudmlld0lkKFwiXCIpXG5cdFx0XHRcdFx0LmRlc2NyaXB0aW9uKFwiUmVtb3RlIHNlc3Npb24gZW50ZXJpbmcgZHJhZnRcIilcblx0XHRcdFx0XHQuZXhlY3V0ZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0aUxlYXZlRHJhZnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIE9wYUJ1aWxkZXIuY3JlYXRlKHRoaXMgYXMgYW55IGFzIE9wYTUpXG5cdFx0XHRcdFx0LmRvKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdENvbGxhYm9yYXRpb25BUEkubGVhdmVEcmFmdCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmRlc2NyaXB0aW9uKFwiUmVtb3RlIHNlc3Npb24gbGVhdmluZyBkcmFmdFwiKVxuXHRcdFx0XHRcdC5leGVjdXRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRpTG9ja1Byb3BlcnR5Rm9yRWRpdGlvbjogZnVuY3Rpb24gKHNQcm9wZXJ0eVBhdGg6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gT3BhQnVpbGRlci5jcmVhdGUodGhpcyBhcyBhbnkgYXMgT3BhNSlcblx0XHRcdFx0XHQuZG8oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Q29sbGFib3JhdGlvbkFQSS5zdGFydExpdmVDaGFuZ2Uoc1Byb3BlcnR5UGF0aCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZGVzY3JpcHRpb24oYFJlbW90ZSBzZXNzaW9uIGxvY2tpbmcgcHJvcGVydHkgJHtzUHJvcGVydHlQYXRofWApXG5cdFx0XHRcdFx0LmV4ZWN1dGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGlVbmxvY2tQcm9wZXJ0eUZvckVkaXRpb246IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIE9wYUJ1aWxkZXIuY3JlYXRlKHRoaXMgYXMgYW55IGFzIE9wYTUpXG5cdFx0XHRcdFx0LmRvKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdENvbGxhYm9yYXRpb25BUEkudW5kb0NoYW5nZSgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmRlc2NyaXB0aW9uKFwiUmVtb3RlIHNlc3Npb24gdW5sb2NraW5nIHByb3BlcnR5IFwiKVxuXHRcdFx0XHRcdC5leGVjdXRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRpVXBkYXRlUHJvcGVydHlWYWx1ZTogZnVuY3Rpb24gKHNQcm9wZXJ0eVBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gT3BhQnVpbGRlci5jcmVhdGUodGhpcyBhcyBhbnkgYXMgT3BhNSlcblx0XHRcdFx0XHQuZG8oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Q29sbGFib3JhdGlvbkFQSS51cGRhdGVQcm9wZXJ0eVZhbHVlKHNQcm9wZXJ0eVBhdGgsIHZhbHVlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kZXNjcmlwdGlvbihgUmVtb3RlIHNlc3Npb24gdXBkYXRpbmcgcHJvcGVydHkgJHtzUHJvcGVydHlQYXRofSB3aXRoICR7dmFsdWV9YClcblx0XHRcdFx0XHQuZXhlY3V0ZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0aURpc2NhcmREcmFmdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gT3BhQnVpbGRlci5jcmVhdGUodGhpcyBhcyBhbnkgYXMgT3BhNSlcblx0XHRcdFx0XHQuZG8oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Q29sbGFib3JhdGlvbkFQSS5kaXNjYXJkRHJhZnQoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kZXNjcmlwdGlvbihcIlJlbW90ZSBzZXNzaW9uIGRpc2NhcmRpbmcgZHJhZnRcIilcblx0XHRcdFx0XHQuZXhlY3V0ZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0aURlbGV0ZURyYWZ0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBPcGFCdWlsZGVyLmNyZWF0ZSh0aGlzIGFzIGFueSBhcyBPcGE1KVxuXHRcdFx0XHRcdC5kbyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRDb2xsYWJvcmF0aW9uQVBJLmRlbGV0ZURyYWZ0KCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZGVzY3JpcHRpb24oXCJSZW1vdGUgc2Vzc2lvbiBkZWxldGluZyBkcmFmdFwiKVxuXHRcdFx0XHRcdC5leGVjdXRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhc3NlcnRpb25zOiB7XG5cdFx0XHRpQ2hlY2tEZWZhdWx0VXNlckNoYW5nZWRWYWx1ZTogZnVuY3Rpb24gKHNQcm9wZXJ0eVBhdGg6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gT3BhQnVpbGRlci5jcmVhdGUodGhpcyBhcyBhbnkgYXMgT3BhNSlcblx0XHRcdFx0XHQuY2hlY2soZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbGxhYm9yYXRpb25BUEkuY2hlY2tSZWNlaXZlZCh7XG5cdFx0XHRcdFx0XHRcdHVzZXJJRDogXCJERUZBVUxUX1VTRVJcIixcblx0XHRcdFx0XHRcdFx0dXNlckFjdGlvbjogQWN0aXZpdHkuQ2hhbmdlLFxuXHRcdFx0XHRcdFx0XHRjbGllbnRDb250ZW50OiBzUHJvcGVydHlQYXRoXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5kZXNjcmlwdGlvbihgUmVtb3RlIHNlc3Npb24gcmVjZWl2ZWQgY2hhbmdlIG5vdGlmaWNhdGlvbiBmb3Ike3NQcm9wZXJ0eVBhdGh9IGNoYW5nZWRgKVxuXHRcdFx0XHRcdC5leGVjdXRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRpQ2hlY2tEZWZhdWx0VXNlckxlZnREcmFmdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gT3BhQnVpbGRlci5jcmVhdGUodGhpcyBhcyBhbnkgYXMgT3BhNSlcblx0XHRcdFx0XHQuY2hlY2soZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbGxhYm9yYXRpb25BUEkuY2hlY2tSZWNlaXZlZCh7IHVzZXJJRDogXCJERUZBVUxUX1VTRVJcIiwgdXNlckFjdGlvbjogQWN0aXZpdHkuTGVhdmUgfSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZGVzY3JpcHRpb24oXCJSZW1vdGUgc2Vzc2lvbiByZWNlaXZlZCBub3RpZmljYXRpb24gb24gZGVmYXVsdCB1c2VyIGxlYXZpbmcgdGhlIGRyYWZ0IHNlc3Npb25cIilcblx0XHRcdFx0XHQuZXhlY3V0ZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0aUNoZWNrRGVmYXVsdFVzZXJFbnRlcmVkRHJhZnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIE9wYUJ1aWxkZXIuY3JlYXRlKHRoaXMgYXMgYW55IGFzIE9wYTUpXG5cdFx0XHRcdFx0LmNoZWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBDb2xsYWJvcmF0aW9uQVBJLmNoZWNrUmVjZWl2ZWQoeyB1c2VySUQ6IFwiREVGQVVMVF9VU0VSXCIsIHVzZXJBY3Rpb246IEFjdGl2aXR5LkpvaW4gfSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZGVzY3JpcHRpb24oXCJSZW1vdGUgc2Vzc2lvbiByZWNlaXZlZCBub3RpZmljYXRpb24gb24gZGVmYXVsdCB1c2VyIGVudGVyaW5nIHRoZSBkcmFmdCBzZXNzaW9uXCIpXG5cdFx0XHRcdFx0LmV4ZWN1dGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbGxhYm9yYXRpb25DbGllbnQ7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQUtBLFNBQVNBLG1CQUFULENBQTZCQyxlQUE3QixFQUFzRjtJQUNyRixJQUFNQyxNQUFNLEdBQUdELGVBQWUsQ0FBQ0UsS0FBL0I7SUFBQSxJQUNDQyxZQUFZLEdBQUdILGVBQWUsQ0FBQ0ksV0FEaEM7SUFBQSxJQUVDQyxNQUFNLGFBQU1KLE1BQU4sZUFBaUJFLFlBQWpCLENBRlA7SUFJQSxPQUFPO01BQ05HLE9BQU8sRUFBRTtRQUNSQyxXQUFXLEVBQUUsVUFBVUMsTUFBVixFQUEwQkMsUUFBMUIsRUFBNEM7VUFDeEQsT0FBT0MsVUFBVSxDQUFDQyxNQUFYLENBQWtCLElBQWxCLEVBQ0xDLEtBREssQ0FDQ1AsTUFERCxFQUVMUSxFQUZLLENBRUYsVUFBVUMsSUFBVixFQUFxQjtZQUN4QixJQUFNQyxRQUFRLEdBQUdELElBQUksQ0FBQ0UsaUJBQUwsRUFBakI7WUFDQUMsZ0JBQWdCLENBQUNDLFVB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