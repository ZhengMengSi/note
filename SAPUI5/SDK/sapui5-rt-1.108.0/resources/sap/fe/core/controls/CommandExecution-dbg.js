/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/helpers/ClassSupport", "sap/ui/core/CommandExecution", "sap/ui/core/Component", "sap/ui/core/Element", "sap/ui/core/Shortcut"], function (Log, ClassSupport, CommandExecution, Component, Element, Shortcut) {
  "use strict";

  var _dec, _class;

  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var CustomCommandExecution = (_dec = defineUI5Class("sap.fe.core.controls.CommandExecution"), _dec(_class = /*#__PURE__*/function (_CommandExecution) {
    _inheritsLoose(CustomCommandExecution, _CommandExecution);

    function CustomCommandExecution() {
      return _CommandExecution.apply(this, arguments) || this;
    }

    var _proto = CustomCommandExecution.prototype;

    _proto.setParent = function setParent(oParent) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _CommandExecution.prototype.setParent.call(this, oParent);

      var aCommands = oParent.data("sap.ui.core.Shortcut");

      if (Array.isArray(aCommands) && aCommands.length > 0) {
        var oCommand = oParent.data("sap.ui.core.Shortcut")[aCommands.length - 1],
            oShortcut = oCommand.shortcutSpec;

        if (oShortcut) {
          // Check if single key shortcut
          for (var key in oShortcut) {
            if (oShortcut[key] && key !== "key") {
              return this;
            }
          }
        }

        return this;
      }
    };

    _proto.destroy = function destroy(bSuppressInvalidate) {
      var oParent = this.getParent();

      if (oParent) {
        var oCommand = this._getCommandInfo();

        if (oCommand) {
          Shortcut.unregister(this.getParent(), oCommand.shortcut);
        }

        this._cleanupContext(oParent);
      }

      Element.prototype.destroy.apply(this, [bSuppressInvalidate]);
    };

    _proto.setVisible = function setVisible(bValue) {
      var oCommand,
          oParentControl = this.getParent(),
          oComponent;

      while (!oComponent && oParentControl) {
        oComponent = Component.getOwnerComponentFor(oParentControl);
        oParentControl = oParentControl.getParent();
      }

      if (oComponent) {
        oCommand = oComponent.getCommand(this.getCommand());

        if (oCommand) {
          _CommandExecution.prototype.setVisible.call(this, bValue);
        } else {
          Log.info("There is no shortcut definition registered in the manifest for the command : " + this.getCommand());
        }
      }

      return this;
    };

    return CustomCommandExecution;
  }(CommandExecution)) || _class);
  return CustomCommandExecution;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDdXN0b21Db21tYW5kRXhlY3V0aW9uIiwiZGVmaW5lVUk1Q2xhc3MiLCJzZXRQYXJlbnQiLCJvUGFyZW50IiwiYUNvbW1hbmRzIiwiZGF0YSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsIm9Db21tYW5kIiwib1Nob3J0Y3V0Iiwic2hvcnRjdXRTcGVjIiwia2V5IiwiZGVzdHJveSIsImJTdXBwcmVzc0ludmFsaWRhdGUiLCJnZXRQYXJlbnQiLCJfZ2V0Q29tbWFuZEluZm8iLCJTaG9ydGN1dCIsInVucmVnaXN0ZXIiLCJzaG9ydGN1dCIsIl9jbGVhbnVwQ29udGV4dCIsIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJhcHBseSIsInNldFZpc2libGUiLCJiVmFsdWUiLCJvUGFyZW50Q29udHJvbCIsIm9Db21wb25lbnQiLCJDb21wb25lbnQiLCJnZXRPd25lckNvbXBvbmVudEZvciIsImdldENvbW1hbmQiLCJMb2ciLCJpbmZvIiwiQ29tbWFuZEV4ZWN1dGlvbiJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiQ29tbWFuZEV4ZWN1dGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgQ29tbWFuZEV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvQ29tbWFuZEV4ZWN1dGlvblwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwic2FwL3VpL2NvcmUvQ29tcG9uZW50XCI7XG5pbXBvcnQgRWxlbWVudCBmcm9tIFwic2FwL3VpL2NvcmUvRWxlbWVudFwiO1xuaW1wb3J0IFNob3J0Y3V0IGZyb20gXCJzYXAvdWkvY29yZS9TaG9ydGN1dFwiO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5jb250cm9scy5Db21tYW5kRXhlY3V0aW9uXCIpXG5jbGFzcyBDdXN0b21Db21tYW5kRXhlY3V0aW9uIGV4dGVuZHMgQ29tbWFuZEV4ZWN1dGlvbiB7XG5cdHNldFBhcmVudChvUGFyZW50OiBhbnkpIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN1cGVyLnNldFBhcmVudChvUGFyZW50KTtcblx0XHRjb25zdCBhQ29tbWFuZHMgPSBvUGFyZW50LmRhdGEoXCJzYXAudWkuY29yZS5TaG9ydGN1dFwiKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhQ29tbWFuZHMpICYmIGFDb21tYW5kcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBvQ29tbWFuZCA9IG9QYXJlbnQuZGF0YShcInNhcC51aS5jb3JlLlNob3J0Y3V0XCIpW2FDb21tYW5kcy5sZW5ndGggLSAxXSxcblx0XHRcdFx0b1Nob3J0Y3V0ID0gb0NvbW1hbmQuc2hvcnRjdXRTcGVjO1xuXHRcdFx0aWYgKG9TaG9ydGN1dCkge1xuXHRcdFx0XHQvLyBDaGVjayBpZiBzaW5nbGUga2V5IHNob3J0Y3V0XG5cdFx0XHRcdGZvciAoY29uc3Qga2V5IGluIG9TaG9ydGN1dCkge1xuXHRcdFx0XHRcdGlmIChvU2hvcnRjdXRba2V5XSAmJiBrZXkgIT09IFwia2V5XCIpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHR9XG5cblx0ZGVzdHJveShiU3VwcHJlc3NJbnZhbGlkYXRlOiBib29sZWFuKSB7XG5cdFx0Y29uc3Qgb1BhcmVudCA9IHRoaXMuZ2V0UGFyZW50KCk7XG5cdFx0aWYgKG9QYXJlbnQpIHtcblx0XHRcdGNvbnN0IG9Db21tYW5kID0gdGhpcy5fZ2V0Q29tbWFuZEluZm8oKTtcblx0XHRcdGlmIChvQ29tbWFuZCkge1xuXHRcdFx0XHRTaG9ydGN1dC51bnJlZ2lzdGVyKHRoaXMuZ2V0UGFyZW50KCksIG9Db21tYW5kLnNob3J0Y3V0KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2NsZWFudXBDb250ZXh0KG9QYXJlbnQpO1xuXHRcdH1cblx0XHRFbGVtZW50LnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMsIFtiU3VwcHJlc3NJbnZhbGlkYXRlXSk7XG5cdH1cblx0c2V0VmlzaWJsZShiVmFsdWU6IGJvb2xlYW4pIHtcblx0XHRsZXQgb0NvbW1hbmQsXG5cdFx0XHRvUGFyZW50Q29udHJvbCA9IHRoaXMuZ2V0UGFyZW50KCksXG5cdFx0XHRvQ29tcG9uZW50OiBhbnk7XG5cblx0XHR3aGlsZSAoIW9Db21wb25lbnQgJiYgb1BhcmVudENvbnRyb2wpIHtcblx0XHRcdG9Db21wb25lbnQgPSBDb21wb25lbnQuZ2V0T3duZXJDb21wb25lbnRGb3Iob1BhcmVudENvbnRyb2wpO1xuXHRcdFx0b1BhcmVudENvbnRyb2wgPSBvUGFyZW50Q29udHJvbC5nZXRQYXJlbnQoKTtcblx0XHR9XG5cblx0XHRpZiAob0NvbXBvbmVudCkge1xuXHRcdFx0b0NvbW1hbmQgPSBvQ29tcG9uZW50LmdldENvbW1hbmQodGhpcy5nZXRDb21tYW5kKCkpO1xuXG5cdFx0XHRpZiAob0NvbW1hbmQpIHtcblx0XHRcdFx0c3VwZXIuc2V0VmlzaWJsZShiVmFsdWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0TG9nLmluZm8oXCJUaGVyZSBpcyBubyBzaG9ydGN1dCBkZWZpbml0aW9uIHJlZ2lzdGVyZWQgaW4gdGhlIG1hbmlmZXN0IGZvciB0aGUgY29tbWFuZCA6IFwiICsgdGhpcy5nZXRDb21tYW5kKCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuaW50ZXJmYWNlIEN1c3RvbUNvbW1hbmRFeGVjdXRpb24ge1xuXHRfZ2V0Q29tbWFuZEluZm8oKTogYW55O1xuXHRfY2xlYW51cENvbnRleHQob1BhcmVudDogYW55KTogdm9pZDtcbn1cbmV4cG9y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