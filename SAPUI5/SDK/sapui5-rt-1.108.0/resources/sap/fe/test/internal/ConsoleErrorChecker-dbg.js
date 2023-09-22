/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  function wrapPatterns(pattern) {
    if (pattern instanceof RegExp) {
      return function (message) {
        return message.match(pattern) !== null;
      };
    } else {
      return function (message) {
        return message.includes(pattern);
      };
    }
  }
  /**
   * List of error message patterns that are always accepted.
   */


  var GLOBALLY_ACCEPTED_ERRORS = ["failed to load JavaScript resource: sap/esh/search/ui/i18n.js" // shell
  ].map(wrapPatterns);

  var ConsoleErrorChecker = /*#__PURE__*/function () {
    function ConsoleErrorChecker(window) {
      var _this = this;

      this.matchers = [];
      this.messages = [];
      this.observer = new MutationObserver(function (mutations) {
        var opaFrame = mutations.reduce(function (iFrame, mutation) {
          if (iFrame !== null) {
            return iFrame;
          }

          for (var _i = 0, _Array$from = Array.from(mutation.addedNodes); _i < _Array$from.length; _i++) {
            var node = _Array$from[_i];

            if (node instanceof Element) {
              var element = node.querySelector("#OpaFrame");

              if (element instanceof HTMLIFrameElement && element.contentWindow) {
                return element;
              }
            }
          }

          return iFrame;
        }, null);

        if (opaFrame && opaFrame.contentWindow) {
          _this.prepareWindow(opaFrame.contentWindow);
        }
      });
      QUnit.moduleStart(function () {
        _this.observer.observe(window.document.body, {
          childList: true
        });
      });
      QUnit.moduleDone(function () {
        _this.observer.disconnect();
      });
      QUnit.testStart(function () {
        _this.reset();
      });
      QUnit.log(function () {
        _this.handleFailedMessages();
      });
      this.karma = window.__karma__; // either go for Karma config option "ui5.config.strictConsoleErrors" or use URL query parameter "strict"

      var search = new URLSearchParams(window.location.search);
      var urlParam = search.get("strictConsoleErrors");

      if (urlParam !== null) {
        this.isStrict = urlParam === "true";
      } else {
        var _this$karma$config$ui, _this$karma, _this$karma$config$ui2;

        this.isStrict = (_this$karma$config$ui = (_this$karma = this.karma) === null || _this$karma === void 0 ? void 0 : (_this$karma$config$ui2 = _this$karma.config.ui5) === null || _this$karma$config$ui2 === void 0 ? void 0 : _this$karma$config$ui2.config.strictconsoleerrors) !== null && _this$karma$config$ui !== void 0 ? _this$karma$config$ui : false;
      }

      this.reset();
    }

    var _proto = ConsoleErrorChecker.prototype;

    _proto.handleFailedMessages = function handleFailedMessages() {
      var failedMessages = this.messages;
      this.messages = [];

      if (failedMessages.length > 0) {
        QUnit.assert.pushResult({
          result: false,
          source: "FE Console Log Check",
          message: "There were ".concat(failedMessages.length, " unexpected console errors"),
          actual: failedMessages,
          expected: []
        });
      }
    };

    _proto.reset = function reset() {
      this.messages = []; // this sets the default to apply if no allowed patterns are set via setAcceptedErrorPatterns().

      if (this.isStrict) {
        this.matchers = GLOBALLY_ACCEPTED_ERRORS;
      } else {
        this.matchers = [function () {
          return true;
        }];
      }
    };

    _proto.setAcceptedErrorPatterns = function setAcceptedErrorPatterns(patterns) {
      if (!patterns || patterns.length === 0) {
        this.matchers = GLOBALLY_ACCEPTED_ERRORS;
      } else {
        this.matchers = patterns.map(wrapPatterns).concat(GLOBALLY_ACCEPTED_ERRORS);
      }
    };

    _proto.checkAndLog = function checkAndLog(type) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      // only check the error messages
      if (type === "error") {
        var messageText = data[0];
        var isAllowed = this.matchers.some(function (matcher) {
          return matcher(messageText);
        });

        if (!isAllowed) {
          this.messages.push(messageText);
        }
      }

      if (this.karma) {
        // wrap the data to facilitate parsing in the backend
        var wrappedData = data.map(function (d) {
          return [d];
        });
        this.karma.log(type, wrappedData);
      }
    };

    _proto.prepareWindow = function prepareWindow(window) {
      var _this2 = this;

      var console = window.console; // capture console.log(), console.debug(), etc.

      var patchConsoleMethod = function (method) {
        var fnOriginal = console[method];

        console[method] = function () {
          for (var _len2 = arguments.length, data = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            data[_key2] = arguments[_key2];
          }

          _this2.checkAndLog.apply(_this2, [method].concat(data));

          return fnOriginal.apply(console, data);
        };
      };

      patchConsoleMethod("log");
      patchConsoleMethod("debug");
      patchConsoleMethod("info");
      patchConsoleMethod("warn");
      patchConsoleMethod("error"); // capture console.assert()
      // see https://console.spec.whatwg.org/#assert

      console.assert = function () {
        var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (condition) {
          return;
        }

        var message = "Assertion failed";

        for (var _len3 = arguments.length, data = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          data[_key3 - 1] = arguments[_key3];
        }

        if (data.length === 0) {
          data.push(message);
        } else {
          var first = data[0];

          if (typeof first !== "string") {
            data.unshift(message);
          } else {
            first = "".concat(message, ": ").concat(first);
            data[0] = first;
          }
        }

        console.error.apply(console, data);
      }; // capture errors


      function onPromiseRejection(event) {
        var _event$reason;

        var message = "UNHANDLED PROMISE REJECTION: ".concat(event.reason);
        this.checkAndLog("error", message, (_event$reason = event.reason) === null || _event$reason === void 0 ? void 0 : _event$reason.stack);
      }

      function onError(event) {
        var message = event.message;
        this.checkAndLog("error", message, event.filename);
      }

      window.addEventListener("error", onError.bind(this), {
        passive: true
      });
      window.addEventListener("unhandledrejection", onPromiseRejection.bind(this), {
        passive: true
      });
    };

    ConsoleErrorChecker.getInstance = function getInstance(window) {
      // the global instance is needed to support multiple tests in a row (in Karma)
      if (!window.sapFEConsoleErrorChecker) {
        window.sapFEConsoleErrorChecker = new ConsoleErrorChecker(window);
      }

      return window.sapFEConsoleErrorChecker;
    };

    return ConsoleErrorChecker;
  }();

  return ConsoleErrorChecker.getInstance(window);
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ3cmFwUGF0dGVybnMiLCJwYXR0ZXJuIiwiUmVnRXhwIiwibWVzc2FnZSIsIm1hdGNoIiwiaW5jbHVkZXMiLCJHTE9CQUxMWV9BQ0NFUFRFRF9FUlJPUlMiLCJtYXAiLCJDb25zb2xlRXJyb3JDaGVja2VyIiwid2luZG93IiwibWF0Y2hlcnMiLCJtZXNzYWdlcyIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9wYUZyYW1lIiwicmVkdWNlIiwiaUZyYW1lIiwibXV0YXRpb24iLCJBcnJheSIsImZyb20iLCJhZGRlZE5vZGVzIiwibm9kZSIsIkVsZW1lbnQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsIkhUTUxJRnJhbWVFbGVtZW50IiwiY29udGVudFdpbmRvdyIsInByZXBhcmVXaW5kb3ciLCJRVW5pdCIsIm1vZHVsZVN0YXJ0Iiwib2JzZXJ2ZSIsImRvY3VtZW50IiwiYm9keSIsImNoaWxkTGlzdCIsIm1vZHVsZURvbmUiLCJkaXNjb25uZWN0IiwidGVzdFN0YXJ0IiwicmVzZXQiLCJsb2ciLCJoYW5kbGVGYWlsZWRNZXNzYWdlcyIsImthcm1hIiwiX19rYXJtYV9fIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwibG9jYXRpb24iLCJ1cmxQYXJhbSIsImdldCIsImlzU3RyaWN0IiwiY29uZmlnIiwidWk1Iiwic3RyaWN0Y29uc29sZWVycm9ycyIsImZhaWxlZE1lc3NhZ2VzIiwibGVuZ3RoIiwiYXNzZXJ0IiwicHVzaFJlc3VsdCIsInJlc3VsdCIsInNvdXJjZSIsImFjdHVhbCIsImV4cGVjdGVkIiwic2V0QWNjZXB0ZWRFcnJvclBhdHRlcm5zIiwicGF0dGVybnMiLCJjb25jYXQiLCJjaGVja0FuZExvZyIsInR5cGUiLCJkYXRhIiwibWVzc2FnZVRleHQiLCJpc0FsbG93ZWQiLCJzb21lIiwibWF0Y2hlciIsInB1c2giLCJ3cmFwcGVkRGF0YSIsImQiLCJjb25zb2xlIiwicGF0Y2hDb25zb2xlTWV0aG9kIiwibWV0aG9kIiwiZm5PcmlnaW5hbCIsImFwcGx5IiwiY29uZGl0aW9uIiwiZmlyc3QiLCJ1bnNoaWZ0IiwiZXJyb3IiLCJvblByb21pc2VSZWplY3Rpb24iLCJldmVudCIsInJlYXNvbiIsInN0YWNrIiwib25FcnJvciIsImZpbGVuYW1lIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJpbmQiLCJwYXNzaXZlIiwiZ2V0SW5zdGFuY2UiLCJzYXBGRUNvbnNvbGVFcnJvckNoZWNrZXIiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkNvbnNvbGVFcnJvckNoZWNrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBCcm93c2VyQ29uc29sZUxvZ09wdGlvbnMgfSBmcm9tIFwia2FybWFcIjtcblxudHlwZSBNZXNzYWdlTWF0Y2hlckZ1bmN0aW9uID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gYm9vbGVhbjtcbnR5cGUgS2FybWEgPSB7XG5cdGxvZzogKGxldmVsOiBCcm93c2VyQ29uc29sZUxvZ09wdGlvbnNbXCJsZXZlbFwiXSwgLi4uZGF0YTogYW55W10pID0+IHZvaWQ7XG5cdGNvbmZpZzoge1xuXHRcdHVpNT86IHtcblx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHRzdHJpY3Rjb25zb2xlZXJyb3JzPzogYm9vbGVhbjsgLy8gS2FybWEgb3B0aW9ucyBhcmUgYWxsIGxvd2VyY2FzZSBhdCBydW50aW1lIVxuXHRcdFx0fTtcblx0XHR9O1xuXHR9O1xufTtcblxuZnVuY3Rpb24gd3JhcFBhdHRlcm5zKHBhdHRlcm46IFJlZ0V4cCB8IHN0cmluZyk6IE1lc3NhZ2VNYXRjaGVyRnVuY3Rpb24ge1xuXHRpZiAocGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHRcdHJldHVybiAobWVzc2FnZSkgPT4gbWVzc2FnZS5tYXRjaChwYXR0ZXJuKSAhPT0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gKG1lc3NhZ2UpID0+IG1lc3NhZ2UuaW5jbHVkZXMocGF0dGVybik7XG5cdH1cbn1cblxuLyoqXG4gKiBMaXN0IG9mIGVycm9yIG1lc3NhZ2UgcGF0dGVybnMgdGhhdCBhcmUgYWx3YXlzIGFjY2VwdGVkLlxuICovXG5jb25zdCBHTE9CQUxMWV9BQ0NFUFRFRF9FUlJPUlMgPSBbXG5cdFwiZmFpbGVkIHRvIGxvYWQgSmF2YVNjcmlwdCByZXNvdXJjZTogc2FwL2VzaC9zZWFyY2gvdWkvaTE4bi5qc1wiIC8vIHNoZWxsXG5dLm1hcCh3cmFwUGF0dGVybnMpO1xuXG5jbGFzcyBDb25zb2xlRXJyb3JDaGVja2VyIHtcblx0cHJpdmF0ZSBtYXRjaGVyczogTWVzc2FnZU1hdGNoZXJGdW5jdGlvbltdID0gW107XG5cdHByaXZhdGUgbWVzc2FnZXM6IHN0cmluZ1tdID0gW107XG5cdHByaXZhdGUgcmVhZG9ubHkga2FybWE6IEthcm1hIHwgdW5kZWZpbmVkO1xuXHRwcml2YXRlIHJlYWRvbmx5IGlzU3RyaWN0OiBib29sZWFuO1xuXG5cdHByaXZhdGUgcmVhZG9ubHkgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG5cdFx0Y29uc3Qgb3BhRnJhbWUgPSBtdXRhdGlvbnMucmVkdWNlKChpRnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgbnVsbCwgbXV0YXRpb246IE11dGF0aW9uUmVjb3JkKSA9PiB7XG5cdFx0XHRpZiAoaUZyYW1lICE9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBpRnJhbWU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoY29uc3Qgbm9kZSBvZiBBcnJheS5mcm9tKG11dGF0aW9uLmFkZGVkTm9kZXMpKSB7XG5cdFx0XHRcdGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuXHRcdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSBub2RlLnF1ZXJ5U2VsZWN0b3IoXCIjT3BhRnJhbWVcIik7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCAmJiBlbGVtZW50LmNvbnRlbnRXaW5kb3cpIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaUZyYW1lO1xuXHRcdH0sIG51bGwpO1xuXG5cdFx0aWYgKG9wYUZyYW1lICYmIG9wYUZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcblx0XHRcdHRoaXMucHJlcGFyZVdpbmRvdyhvcGFGcmFtZS5jb250ZW50V2luZG93KTtcblx0XHR9XG5cdH0pO1xuXG5cdGNvbnN0cnVjdG9yKHdpbmRvdzogV2luZG93ICYgeyBfX2thcm1hX18/OiBLYXJtYSB9KSB7XG5cdFx0UVVuaXQubW9kdWxlU3RhcnQoKCkgPT4ge1xuXHRcdFx0dGhpcy5vYnNlcnZlci5vYnNlcnZlKHdpbmRvdy5kb2N1bWVudC5ib2R5LCB7IGNoaWxkTGlzdDogdHJ1ZSB9KTtcblx0XHR9KTtcblxuXHRcdFFVbml0Lm1vZHVsZURvbmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cdFx0fSk7XG5cblx0XHRRVW5pdC50ZXN0U3RhcnQoKCkgPT4ge1xuXHRcdFx0dGhpcy5yZXNldCgpO1xuXHRcdH0pO1xuXG5cdFx0UVVuaXQubG9nKCgpID0+IHtcblx0XHRcdHRoaXMuaGFuZGxlRmFpbGVkTWVzc2FnZXMoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMua2FybWEgPSB3aW5kb3cuX19rYXJtYV9fO1xuXG5cdFx0Ly8gZWl0aGVyIGdvIGZvciBLYXJtYSBjb25maWcgb3B0aW9uIFwidWk1LmNvbmZpZy5zdHJpY3RDb25zb2xlRXJyb3JzXCIgb3IgdXNlIFVSTCBxdWVyeSBwYXJhbWV0ZXIgXCJzdHJpY3RcIlxuXHRcdGNvbnN0IHNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cdFx0Y29uc3QgdXJsUGFyYW0gPSBzZWFyY2guZ2V0KFwic3RyaWN0Q29uc29sZUVycm9yc1wiKTtcblx0XHRpZiAodXJsUGFyYW0gIT09IG51bGwpIHtcblx0XHRcdHRoaXMuaXNTdHJpY3QgPSB1cmxQYXJhbSA9PT0gXCJ0cnVlXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuaXNTdHJpY3QgPSB0aGlzLmthcm1hPy5jb25maWcudWk1Py5jb25maWcuc3RyaWN0Y29uc29sZWVycm9ycyA/PyBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLnJlc2V0KCk7XG5cdH1cblxuXHRwcml2YXRlIGhhbmRsZUZhaWxlZE1lc3NhZ2VzKCkge1xuXHRcdGNvbnN0IGZhaWxlZE1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlcztcblx0XHR0aGlzLm1lc3NhZ2VzID0gW107XG5cblx0XHRpZiAoZmFpbGVkTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0UVVuaXQuYXNzZXJ0LnB1c2hSZXN1bHQoe1xuXHRcdFx0XHRyZXN1bHQ6IGZhbHNlLFxuXHRcdFx0XHRzb3VyY2U6IFwiRkUgQ29uc29sZSBMb2cgQ2hlY2tcIixcblx0XHRcdFx0bWVzc2FnZTogYFRoZXJlIHdlcmUgJHtmYWlsZWRNZXNzYWdlcy5sZW5ndGh9IHVuZXhwZWN0ZWQgY29uc29sZSBlcnJvcnNgLFxuXHRcdFx0XHRhY3R1YWw6IGZhaWxlZE1lc3NhZ2VzLFxuXHRcdFx0XHRleHBlY3RlZDogW11cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcmVzZXQoKSB7XG5cdFx0dGhpcy5tZXNzYWdlcyA9IFtdO1xuXG5cdFx0Ly8gdGhpcyBzZXRzIHRoZSBkZWZhdWx0IHRvIGFwcGx5IGlmIG5vIGFsbG93ZWQgcGF0dGVybnMgYXJlIHNldCB2aWEgc2V0QWNjZXB0ZWRFcnJvclBhdHRlcm5zKCkuXG5cdFx0aWYgKHRoaXMuaXNTdHJpY3QpIHtcblx0XHRcdHRoaXMubWF0Y2hlcnMgPSBHTE9CQUxMWV9BQ0NFUFRFRF9FUlJPUlM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubWF0Y2hlcnMgPSBbKCkgPT4gdHJ1ZV07XG5cdFx0fVxuXHR9XG5cblx0c2V0QWNjZXB0ZWRFcnJvclBhdHRlcm5zKHBhdHRlcm5zPzogKFJlZ0V4cCB8IHN0cmluZylbXSkge1xuXHRcdGlmICghcGF0dGVybnMgfHwgcGF0dGVybnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHR0aGlzLm1hdGNoZXJzID0gR0xPQkFMTFlfQUNDRVBURURfRVJST1JTO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm1hdGNoZXJzID0gcGF0dGVybnMubWFwKHdyYXBQYXR0ZXJucykuY29uY2F0KEdMT0JBTExZX0FDQ0VQVEVEX0VSUk9SUyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBjaGVja0FuZExvZyh0eXBlOiBCcm93c2VyQ29uc29sZUxvZ09wdGlvbnNbXCJsZXZlbFwiXSwgLi4uZGF0YTogYW55W10pIHtcblx0XHQvLyBvbmx5IGNoZWNrIHRoZSBlcnJvciBtZXNzYWdlc1xuXHRcdGlmICh0eXBlID09PSBcImVycm9yXCIpIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2VUZXh0ID0gZGF0YVswXTtcblx0XHRcdGNvbnN0IGlzQWxsb3dlZCA9IHRoaXMubWF0Y2hlcnMuc29tZSgobWF0Y2hlcikgPT4gbWF0Y2hlcihtZXNzYWdlVGV4dCkpO1xuXHRcdFx0aWYgKCFpc0FsbG93ZWQpIHtcblx0XHRcdFx0dGhpcy5tZXNzYWdlcy5wdXNoKG1lc3NhZ2VUZXh0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5rYXJtYSkge1xuXHRcdFx0Ly8gd3JhcCB0aGUgZGF0YSB0byBmYWNpbGl0YXRlIHBhcnNpbmcgaW4gdGhlIGJhY2tlbmRcblx0XHRcdGNvbnN0IHdyYXBwZWREYXRhID0gZGF0YS5tYXAoKGQpID0+IFtkXSk7XG5cdFx0XHR0aGlzLmthcm1hLmxvZyh0eXBlLCB3cmFwcGVkRGF0YSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwcmVwYXJlV2luZG93KHdpbmRvdzogV2luZG93KSB7XG5cdFx0Y29uc3QgY29uc29sZTogQ29uc29sZSA9ICh3aW5kb3cgYXMgYW55KS5jb25zb2xlO1xuXG5cdFx0Ly8gY2FwdHVyZSBjb25zb2xlLmxvZygpLCBjb25zb2xlLmRlYnVnKCksIGV0Yy5cblx0XHRjb25zdCBwYXRjaENvbnNvbGVNZXRob2QgPSAobWV0aG9kOiBcImxvZ1wiIHwgXCJpbmZvXCIgfCBcIndhcm5cIiB8IFwiZXJyb3JcIiB8IFwiZGVidWdcIikgPT4ge1xuXHRcdFx0Y29uc3QgZm5PcmlnaW5hbCA9IGNvbnNvbGVbbWV0aG9kXTtcblx0XHRcdGNvbnNvbGVbbWV0aG9kXSA9ICguLi5kYXRhOiBhbnlbXSk6IHZvaWQgPT4ge1xuXHRcdFx0XHR0aGlzLmNoZWNrQW5kTG9nKG1ldGhvZCwgLi4uZGF0YSk7XG5cdFx0XHRcdHJldHVybiBmbk9yaWdpbmFsLmFwcGx5KGNvbnNvbGUsIGRhdGEpO1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0cGF0Y2hDb25zb2xlTWV0aG9kKFwibG9nXCIpO1xuXHRcdHBhdGNoQ29uc29sZU1ldGhvZChcImRlYnVnXCIpO1xuXHRcdHBhdGNoQ29uc29sZU1ldGhvZChcImluZm9cIik7XG5cdFx0cGF0Y2hDb25zb2xlTWV0aG9kKFwid2FyblwiKTtcblx0XHRwYXRjaENvbnNvbGVNZXRob2QoXCJlcnJvclwiKTtcblxuXHRcdC8vIGNhcHR1cmUgY29uc29sZS5hc3NlcnQoKVxuXHRcdC8vIHNlZSBodHRwczovL2NvbnNvbGUuc3BlYy53aGF0d2cub3JnLyNhc3NlcnRcblx0XHRjb25zb2xlLmFzc2VydCA9IGZ1bmN0aW9uIChjb25kaXRpb24gPSBmYWxzZSwgLi4uZGF0YTogYW55W10pIHtcblx0XHRcdGlmIChjb25kaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBtZXNzYWdlID0gXCJBc3NlcnRpb24gZmFpbGVkXCI7XG5cdFx0XHRpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0ZGF0YS5wdXNoKG1lc3NhZ2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGZpcnN0ID0gZGF0YVswXTtcblx0XHRcdFx0aWYgKHR5cGVvZiBmaXJzdCAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdGRhdGEudW5zaGlmdChtZXNzYWdlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaXJzdCA9IGAke21lc3NhZ2V9OiAke2ZpcnN0fWA7XG5cdFx0XHRcdFx0ZGF0YVswXSA9IGZpcnN0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoLi4uZGF0YSk7XG5cdFx0fTtcblxuXHRcdC8vIGNhcHR1cmUgZXJyb3JzXG5cdFx0ZnVuY3Rpb24gb25Qcm9taXNlUmVqZWN0aW9uKHRoaXM6IENvbnNvbGVFcnJvckNoZWNrZXIsIGV2ZW50OiBQcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBgVU5IQU5ETEVEIFBST01JU0UgUkVKRUNUSU9OOiAke2V2ZW50LnJlYXNvbn1gO1xuXHRcdFx0dGhpcy5jaGVja0FuZExvZyhcImVycm9yXCIsIG1lc3NhZ2UsIGV2ZW50LnJlYXNvbj8uc3RhY2spO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uRXJyb3IodGhpczogQ29uc29sZUVycm9yQ2hlY2tlciwgZXZlbnQ6IEVycm9yRXZlbnQpIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBldmVudC5tZXNzYWdlO1xuXHRcdFx0dGhpcy5jaGVja0FuZExvZyhcImVycm9yXCIsIG1lc3NhZ2UsIGV2ZW50LmZpbGVuYW1lKTtcblx0XHR9XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIG9uRXJyb3IuYmluZCh0aGlzKSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIG9uUHJvbWlzZVJlamVjdGlvbi5iaW5kKHRoaXMpLCB7IHBhc3NpdmU6IHRydWUgfSk7XG5cdH1cblxuXHRzdGF0aWMgZ2V0SW5zdGFuY2Uod2luZG93OiBXaW5kb3cgJiB7IHNhcEZFQ29uc29sZUVycm9yQ2hlY2tlcj86IENvbnNvbGVFcnJvckNoZWNrZXIgfSk6IENvbnNvbGVFcnJvckNoZWNrZXIge1xuXHRcdC8vIHRoZSBnbG9iYWwgaW5zdGFuY2UgaXMgbmVlZGVkIHRvIHN1cHBvcnQgbXVsdGlwbGUgdGVzdHMgaW4gYSByb3cgKGluIEthcm1hKVxuXHRcdGlmICghd2luZG93LnNhcEZFQ29uc29sZUVycm9yQ2hlY2tlcikge1xuXHRcdFx0d2luZG93LnNhcEZFQ29uc29sZUVycm9yQ2hlY2tlciA9IG5ldyBDb25zb2xlRXJyb3JDaGVja2VyKHdpbmRvdyk7XG5cdFx0fVxuXHRcdHJldHVybiB3aW5kb3cuc2FwRkVDb25zb2xlRXJyb3JDaGVja2VyO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnNvbGVFcnJvckNoZWNrZXIuZ2V0SW5zdGFuY2Uod2luZG93KTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQWNBLFNBQVNBLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQXdFO0lBQ3ZFLElBQUlBLE9BQU8sWUFBWUMsTUFBdkIsRUFBK0I7TUFDOUIsT0FBTyxVQUFDQyxPQUFEO1FBQUEsT0FBYUEsT0FBTyxDQUFDQyxLQUFSLENBQWNILE9BQWQsTUFBMkIsSUFBeEM7TUFBQSxDQUFQO0lBQ0EsQ0FGRCxNQUVPO01BQ04sT0FBTyxVQUFDRSxPQUFEO1FBQUEsT0FBYUEsT0FBTyxDQUFDRSxRQUFSLENBQWlCSixPQUFqQixDQUFiO01BQUEsQ0FBUDtJQUNBO0VBQ0Q7RUFFRDtBQUNBO0FBQ0E7OztFQUNBLElBQU1LLHdCQUF3QixHQUFHLENBQ2hDLCtEQURnQyxDQUNnQztFQURoQyxFQUUvQkMsR0FGK0IsQ0FFM0JQLFlBRjJCLENBQWpDOztNQUlNUSxtQjtJQTZCTCw2QkFBWUMsTUFBWixFQUFvRDtNQUFBOztNQUFBLEtBNUI1Q0MsUUE0QjRDLEdBNUJQLEVBNEJPO01BQUEsS0EzQjVDQyxRQTJCNEMsR0EzQnZCLEVBMkJ1QjtNQUFBLEtBdkJuQ0MsUUF1Qm1DLEdBdkJ4QixJ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