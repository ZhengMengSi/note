/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/library", "sap/m/MessageBox", "sap/ui/core/Core", "../../operationsHelper"], function (Log, CommonUtils, FELibrary, MessageBox, Core, operationsHelper) {
  "use strict";

  /**
   * Activates a document and closes the sticky session.
   *
   * @function
   * @name sap.fe.core.actions.sticky#activateDocument
   * @memberof sap.fe.core.actions.sticky
   * @static
   * @param oContext Context of the document to be activated
   * @param oAppComponent Context of the document to be activated
   * @returns A promise resolve when the sticky session is activated
   * @private
   * @ui5-restricted
   */
  var activateDocument = function (oContext, oAppComponent) {
    try {
      function _temp2(oResourceBundle) {
        var sActionName = CommonUtils.getTranslatedText("C_OP_OBJECT_PAGE_SAVE", oResourceBundle);
        var oSaveAction = oModel.bindContext("".concat(sSaveAction, "(...)"), oContext, {
          $$inheritExpandSelect: true
        });
        var sGroupId = "direct";
        var oSavePromise = oSaveAction.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(sticky, sGroupId, {
          label: sActionName,
          model: oModel
        }, oResourceBundle, null, null, null, undefined));
        oModel.submitBatch(sGroupId);
        return oSavePromise;
      }

      var oModel = oContext.getModel(),
          oMetaModel = oModel.getMetaModel(),
          sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
          sSaveAction = oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Session.v1.StickySessionSupported/SaveAction"));

      if (!sSaveAction) {
        throw new Error("Save Action for Sticky Session not found for ".concat(sMetaPath));
      }

      return Promise.resolve(oAppComponent ? Promise.resolve(oAppComponent.getModel("sap.fe.i18n").getResourceBundle()).then(_temp2) : _temp2(oAppComponent));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Discards a document and closes sticky session.
   *
   * @function
   * @name sap.fe.core.actions.sticky#discardDocument
   * @memberof sap.fe.core.actions.sticky
   * @static
   * @param oContext Context of the document to be discarded
   * @returns A promise resolved when the document is dicarded
   * @private
   * @ui5-restricted
   */


  /**
   * Opens a sticky session to edit a document.
   *
   * @function
   * @name sap.fe.core.actions.sticky#editDocumentInStickySession
   * @memberof sap.fe.core.actions.sticky
   * @static
   * @param oContext Context of the document to be edited
   * @param oAppComponent The AppComponent
   * @returns A Promise resolved when the sticky session is in edit mode
   * @private
   * @ui5-restricted
   */
  var editDocumentInStickySession = function (oContext, oAppComponent) {
    try {
      var oModel = oContext.getModel(),
          oMetaModel = oModel.getMetaModel(),
          sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
          sEditAction = oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction"));

      if (!sEditAction) {
        throw new Error("Edit Action for Sticky Session not found for ".concat(sMetaPath));
      }

      return Promise.resolve(oAppComponent.getModel("sap.fe.i18n").getResourceBundle()).then(function (oResourceBundle) {
        var sActionName = CommonUtils.getTranslatedText("C_COMMON_OBJECT_PAGE_EDIT", oResourceBundle);
        var oEditAction = oModel.bindContext("".concat(sEditAction, "(...)"), oContext, {
          $$inheritExpandSelect: true
        });
        var sGroupId = "direct";
        var oEditPromise = oEditAction.execute(sGroupId, undefined, operationsHelper.fnOnStrictHandlingFailed.bind(sticky, sGroupId, {
          label: sActionName,
          model: oModel
        }, oResourceBundle, null, null, null, undefined));
        oModel.submitBatch(sGroupId);
        return Promise.resolve(oEditPromise).then(function (oNewContext) {
          var oSideEffects = oAppComponent.getSideEffectsService().getODataActionSideEffects(sEditAction, oNewContext);

          var _temp3 = function () {
            var _oSideEffects$trigger;

            if (oSideEffects !== null && oSideEffects !== void 0 && (_oSideEffects$trigger = oSideEffects.triggerActions) !== null && _oSideEffects$trigger !== void 0 && _oSideEffects$trigger.length) {
              return Promise.resolve(oAppComponent.getSideEffectsService().requestSideEffectsForODataAction(oSideEffects, oNewContext)).then(function () {});
            }
          }();

          return _temp3 && _temp3.then ? _temp3.then(function () {
            return oNewContext;
          }) : oNewContext;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var ProgrammingModel = FELibrary.ProgrammingModel;

  function discardDocument(oContext) {
    var oModel = oContext.getModel(),
        oMetaModel = oModel.getMetaModel(),
        sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
        sDiscardAction = oMetaModel.getObject("".concat(sMetaPath, "@com.sap.vocabularies.Session.v1.StickySessionSupported/DiscardAction"));

    if (!sDiscardAction) {
      throw new Error("Discard Action for Sticky Session not found for ".concat(sMetaPath));
    }

    var oDiscardAction = oModel.bindContext("/".concat(sDiscardAction, "(...)"));
    var oDiscardPromise = oDiscardAction.execute("direct").then(function () {
      return oContext;
    });
    oModel.submitBatch("direct");
    return oDiscardPromise;
  }
  /**
   * Process the Data loss confirmation.
   *
   * @function
   * @name sap.fe.core.actions.sticky#discardDocument
   * @memberof sap.fe.core.actions.sticky
   * @static
   * @param fnProcess Function to execute after confirmation
   * @param oView Current view
   * @param programmingModel Programming Model of the current page
   * @returns `void` i think
   * @private
   * @ui5-restricted
   */


  function processDataLossConfirmation(fnProcess, oView, programmingModel) {
    var bUIEditable = oView.getModel("ui").getProperty("/isEditable"),
        oResourceBundle = Core.getLibraryResourceBundle("sap.fe.templates"),
        sWarningMsg = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_MSG"),
        sConfirmButtonTxt = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CONFIRM_BUTTON"),
        sCancelButtonTxt = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CANCEL_BUTTON");

    if (programmingModel === ProgrammingModel.Sticky && bUIEditable) {
      return MessageBox.warning(sWarningMsg, {
        actions: [sConfirmButtonTxt, sCancelButtonTxt],
        emphasizedAction: sConfirmButtonTxt,
        onClose: function (sAction) {
          if (sAction === sConfirmButtonTxt) {
            var oInternalModel = oView && oView.getModel("internal");
            Log.info("Navigation confirmed.");

            if (oInternalModel) {
              oInternalModel.setProperty("/sessionOn", false);
              oInternalModel.setProperty("/stickySessionToken", undefined);
            } else {
              Log.warning("Local UIModel couldn't be found.");
            }

            fnProcess();
          } else {
            Log.info("Navigation rejected.");
          }
        }
      });
    }

    return fnProcess();
  }
  /**
   * Static functions for the sticky session programming model
   *
   * @namespace
   * @alias sap.fe.core.actions.sticky
   * @private
   * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
   * @since 1.54.0
   */


  var sticky = {
    editDocumentInStickySession: editDocumentInStickySession,
    activateDocument: activateDocument,
    discardDocument: discardDocument,
    processDataLossConfirmation: processDataLossConfirmation
  };
  return sticky;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhY3RpdmF0ZURvY3VtZW50Iiwib0NvbnRleHQiLCJvQXBwQ29tcG9uZW50Iiwib1Jlc291cmNlQnVuZGxlIiwic0FjdGlvbk5hbWUiLCJDb21tb25VdGlscyIsImdldFRyYW5zbGF0ZWRUZXh0Iiwib1NhdmVBY3Rpb24iLCJvTW9kZWwiLCJiaW5kQ29udGV4dCIsInNTYXZlQWN0aW9uIiwiJCRpbmhlcml0RXhwYW5kU2VsZWN0Iiwic0dyb3VwSWQiLCJvU2F2ZVByb21pc2UiLCJleGVjdXRlIiwidW5kZWZpbmVkIiwib3BlcmF0aW9uc0hlbHBlciIsImZuT25TdHJpY3RIYW5kbGluZ0ZhaWxlZCIsImJpbmQiLCJzdGlja3kiLCJsYWJlbCIsIm1vZGVsIiwic3VibWl0QmF0Y2giLCJnZXRNb2RlbCIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzTWV0YVBhdGgiLCJnZXRNZXRhUGF0aCIsImdldFBhdGgiLCJnZXRPYmplY3QiLCJFcnJvciIsImdldFJlc291cmNlQnVuZGxlIiwiZWRpdERvY3VtZW50SW5TdGlja3lTZXNzaW9uIiwic0VkaXRBY3Rpb24iLCJvRWRpdEFjdGlvbiIsIm9FZGl0UHJvbWlzZSIsIm9OZXdDb250ZXh0Iiwib1NpZGVFZmZlY3RzIiwiZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlIiwiZ2V0T0RhdGFBY3Rpb25TaWRlRWZmZWN0cyIsInRyaWdnZXJBY3Rpb25zIiwibGVuZ3RoIiwicmVxdWVzdFNpZGVFZmZlY3RzRm9yT0RhdGFBY3Rpb24iLCJQcm9ncmFtbWluZ01vZGVsIiwiRkVMaWJyYXJ5IiwiZGlzY2FyZERvY3VtZW50Iiwic0Rpc2NhcmRBY3Rpb24iLCJvRGlzY2FyZEFjdGlvbiIsIm9EaXNjYXJkUHJvbWlzZSIsInRoZW4iLCJwcm9jZXNzRGF0YUxvc3NDb25maXJtYXRpb24iLCJmblByb2Nlc3MiLCJvVmlldyIsInByb2dyYW1taW5nTW9kZWwiLCJiVUlFZGl0YWJsZSIsImdldFByb3BlcnR5IiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsInNXYXJuaW5nTXNnIiwiZ2V0VGV4dCIsInNDb25maXJtQnV0dG9uVHh0Iiwic0NhbmNlbEJ1dHRvblR4dCIsIlN0aWNreSIsIk1lc3NhZ2VCb3giLCJ3YXJuaW5nIiwiYWN0aW9ucyIsImVtcGhhc2l6ZWRBY3Rpb24iLCJvbkNsb3NlIiwic0FjdGlvbiIsIm9JbnRlcm5hbE1vZGVsIiwiTG9nIiwiaW5mbyIsInNldFByb3BlcnR5Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJzdGlja3kudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IEZFTGlicmFyeSBmcm9tIFwic2FwL2ZlL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IE1lc3NhZ2VCb3ggZnJvbSBcInNhcC9tL01lc3NhZ2VCb3hcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgdHlwZSBWaWV3IGZyb20gXCJzYXAvdWkvY29yZS9tdmMvVmlld1wiO1xuaW1wb3J0IHR5cGUgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgeyBWNENvbnRleHQgfSBmcm9tIFwidHlwZXMvZXh0ZW5zaW9uX3R5cGVzXCI7XG5pbXBvcnQgb3BlcmF0aW9uc0hlbHBlciBmcm9tIFwiLi4vLi4vb3BlcmF0aW9uc0hlbHBlclwiO1xuXG5jb25zdCBQcm9ncmFtbWluZ01vZGVsID0gRkVMaWJyYXJ5LlByb2dyYW1taW5nTW9kZWw7XG4vKipcbiAqIE9wZW5zIGEgc3RpY2t5IHNlc3Npb24gdG8gZWRpdCBhIGRvY3VtZW50LlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgc2FwLmZlLmNvcmUuYWN0aW9ucy5zdGlja3kjZWRpdERvY3VtZW50SW5TdGlja3lTZXNzaW9uXG4gKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuYWN0aW9ucy5zdGlja3lcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9mIHRoZSBkb2N1bWVudCB0byBiZSBlZGl0ZWRcbiAqIEBwYXJhbSBvQXBwQ29tcG9uZW50IFRoZSBBcHBDb21wb25lbnRcbiAqIEByZXR1cm5zIEEgUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzdGlja3kgc2Vzc2lvbiBpcyBpbiBlZGl0IG1vZGVcbiAqIEBwcml2YXRlXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZWRpdERvY3VtZW50SW5TdGlja3lTZXNzaW9uKG9Db250ZXh0OiBDb250ZXh0LCBvQXBwQ29tcG9uZW50OiBBcHBDb21wb25lbnQpOiBQcm9taXNlPFY0Q29udGV4dD4ge1xuXHRjb25zdCBvTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpIGFzIE9EYXRhTW9kZWwsXG5cdFx0b01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKSxcblx0XHRzTWV0YVBhdGggPSBvTWV0YU1vZGVsLmdldE1ldGFQYXRoKG9Db250ZXh0LmdldFBhdGgoKSksXG5cdFx0c0VkaXRBY3Rpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YVBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjEuU3RpY2t5U2Vzc2lvblN1cHBvcnRlZC9FZGl0QWN0aW9uYCk7XG5cblx0aWYgKCFzRWRpdEFjdGlvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgRWRpdCBBY3Rpb24gZm9yIFN0aWNreSBTZXNzaW9uIG5vdCBmb3VuZCBmb3IgJHtzTWV0YVBhdGh9YCk7XG5cdH1cblx0Y29uc3Qgb1Jlc291cmNlQnVuZGxlID0gYXdhaXQgKG9BcHBDb21wb25lbnQuZ2V0TW9kZWwoXCJzYXAuZmUuaTE4blwiKSBhcyBhbnkpLmdldFJlc291cmNlQnVuZGxlKCk7XG5cdGNvbnN0IHNBY3Rpb25OYW1lID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX0NPTU1PTl9PQkpFQ1RfUEFHRV9FRElUXCIsIG9SZXNvdXJjZUJ1bmRsZSk7XG5cdGNvbnN0IG9FZGl0QWN0aW9uID0gb01vZGVsLmJpbmRDb250ZXh0KGAke3NFZGl0QWN0aW9ufSguLi4pYCwgb0NvbnRleHQsIHsgJCRpbmhlcml0RXhwYW5kU2VsZWN0OiB0cnVlIH0pO1xuXHRjb25zdCBzR3JvdXBJZCA9IFwiZGlyZWN0XCI7XG5cdGNvbnN0IG9FZGl0UHJvbWlzZSA9IG9FZGl0QWN0aW9uLmV4ZWN1dGUoXG5cdFx0c0dyb3VwSWQsXG5cdFx0dW5kZWZpbmVkLFxuXHRcdG9wZXJhdGlvbnNIZWxwZXIuZm5PblN0cmljdEhhbmRsaW5nRmFpbGVkLmJpbmQoXG5cdFx0XHRzdGlja3ksXG5cdFx0XHRzR3JvdXBJZCxcblx0XHRcdHsgbGFiZWw6IHNBY3Rpb25OYW1lLCBtb2RlbDogb01vZGVsIH0sXG5cdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRudWxsLFxuXHRcdFx0bnVsbCxcblx0XHRcdG51bGwsXG5cdFx0XHR1bmRlZmluZWRcblx0XHQpXG5cdCk7XG5cdG9Nb2RlbC5zdWJtaXRCYXRjaChzR3JvdXBJZCk7XG5cblx0Y29uc3Qgb05ld0NvbnRleHQ6IFY0Q29udGV4dCA9IGF3YWl0IG9FZGl0UHJvbWlzZTtcblx0Y29uc3Qgb1NpZGVFZmZlY3RzID0gb0FwcENvbXBvbmVudC5nZXRTaWRlRWZmZWN0c1NlcnZpY2UoKS5nZXRPRGF0YUFjdGlvblNpZGVFZmZlY3RzKHNFZGl0QWN0aW9uLCBvTmV3Q29udGV4dCk7XG5cdGlmIChvU2lkZUVmZmVjdHM/LnRyaWdnZXJBY3Rpb25zPy5sZW5ndGgpIHtcblx0XHRhd2FpdCBvQXBwQ29tcG9uZW50LmdldFNpZGVFZmZlY3RzU2VydmljZSgpLnJlcXVlc3RTaWRlRWZmZWN0c0Zvck9EYXRhQWN0aW9uKG9TaWRlRWZmZWN0cywgb05ld0NvbnRleHQpO1xuXHR9XG5cdHJldHVybiBvTmV3Q29udGV4dDtcbn1cbi8qKlxuICogQWN0aXZhdGVzIGEgZG9jdW1lbnQgYW5kIGNsb3NlcyB0aGUgc3RpY2t5IHNlc3Npb24uXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5hY3Rpb25zLnN0aWNreSNhY3RpdmF0ZURvY3VtZW50XG4gKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuYWN0aW9ucy5zdGlja3lcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9mIHRoZSBkb2N1bWVudCB0byBiZSBhY3RpdmF0ZWRcbiAqIEBwYXJhbSBvQXBwQ29tcG9uZW50IENvbnRleHQgb2YgdGhlIGRvY3VtZW50IHRvIGJlIGFjdGl2YXRlZFxuICogQHJldHVybnMgQSBwcm9taXNlIHJlc29sdmUgd2hlbiB0aGUgc3RpY2t5IHNlc3Npb24gaXMgYWN0aXZhdGVkXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFjdGl2YXRlRG9jdW1lbnQob0NvbnRleHQ6IFY0Q29udGV4dCwgb0FwcENvbXBvbmVudD86IGFueSkge1xuXHRjb25zdCBvTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpLFxuXHRcdG9NZXRhTW9kZWwgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCksXG5cdFx0c01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQ29udGV4dC5nZXRQYXRoKCkpLFxuXHRcdHNTYXZlQWN0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxLlN0aWNreVNlc3Npb25TdXBwb3J0ZWQvU2F2ZUFjdGlvbmApO1xuXG5cdGlmICghc1NhdmVBY3Rpb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFNhdmUgQWN0aW9uIGZvciBTdGlja3kgU2Vzc2lvbiBub3QgZm91bmQgZm9yICR7c01ldGFQYXRofWApO1xuXHR9XG5cdGNvbnN0IG9SZXNvdXJjZUJ1bmRsZSA9IChvQXBwQ29tcG9uZW50ICYmIChhd2FpdCBvQXBwQ29tcG9uZW50LmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikuZ2V0UmVzb3VyY2VCdW5kbGUoKSkpIHx8IG51bGw7XG5cdGNvbnN0IHNBY3Rpb25OYW1lID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJDX09QX09CSkVDVF9QQUdFX1NBVkVcIiwgb1Jlc291cmNlQnVuZGxlKTtcblx0Y29uc3Qgb1NhdmVBY3Rpb24gPSBvTW9kZWwuYmluZENvbnRleHQoYCR7c1NhdmVBY3Rpb259KC4uLilgLCBvQ29udGV4dCwgeyAkJGluaGVyaXRFeHBhbmRTZWxlY3Q6IHRydWUgfSk7XG5cdGNvbnN0IHNHcm91cElkID0gXCJkaXJlY3RcIjtcblx0Y29uc3Qgb1NhdmVQcm9taXNlID0gb1NhdmVBY3Rpb24uZXhlY3V0ZShcblx0XHRzR3JvdXBJZCxcblx0XHR1bmRlZmluZWQsXG5cdFx0b3BlcmF0aW9uc0hlbHBlci5mbk9uU3RyaWN0SGFuZGxpbmdGYWlsZWQuYmluZChcblx0XHRcdHN0aWNreSxcblx0XHRcdHNHcm91cElkLFxuXHRcdFx0eyBsYWJlbDogc0FjdGlvbk5hbWUsIG1vZGVsOiBvTW9kZWwgfSxcblx0XHRcdG9SZXNvdXJjZUJ1bmRsZSxcblx0XHRcdG51bGwsXG5cdFx0XHRudWxsLFxuXHRcdFx0bnVsbCxcblx0XHRcdHVuZGVmaW5lZFxuXHRcdClcblx0KTtcblx0b01vZGVsLnN1Ym1pdEJhdGNoKHNHcm91cElkKTtcblx0cmV0dXJuIG9TYXZlUHJvbWlzZTtcbn1cbi8qKlxuICogRGlzY2FyZHMgYSBkb2N1bWVudCBhbmQgY2xvc2VzIHN0aWNreSBzZXNzaW9uLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgc2FwLmZlLmNvcmUuYWN0aW9ucy5zdGlja3kjZGlzY2FyZERvY3VtZW50XG4gKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuYWN0aW9ucy5zdGlja3lcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IG9mIHRoZSBkb2N1bWVudCB0byBiZSBkaXNjYXJkZWRcbiAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBkb2N1bWVudCBpcyBkaWNhcmRlZFxuICogQHByaXZhdGVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5mdW5jdGlvbiBkaXNjYXJkRG9jdW1lbnQob0NvbnRleHQ6IFY0Q29udGV4dCkge1xuXHRjb25zdCBvTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpLFxuXHRcdG9NZXRhTW9kZWwgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCksXG5cdFx0c01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvQ29udGV4dC5nZXRQYXRoKCkpLFxuXHRcdHNEaXNjYXJkQWN0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxLlN0aWNreVNlc3Npb25TdXBwb3J0ZWQvRGlzY2FyZEFjdGlvbmApO1xuXG5cdGlmICghc0Rpc2NhcmRBY3Rpb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYERpc2NhcmQgQWN0aW9uIGZvciBTdGlja3kgU2Vzc2lvbiBub3QgZm91bmQgZm9yICR7c01ldGFQYXRofWApO1xuXHR9XG5cblx0Y29uc3Qgb0Rpc2NhcmRBY3Rpb24gPSBvTW9kZWwuYmluZENvbnRleHQoYC8ke3NEaXNjYXJkQWN0aW9ufSguLi4pYCk7XG5cdGNvbnN0IG9EaXNjYXJkUHJvbWlzZSA9IG9EaXNjYXJkQWN0aW9uLmV4ZWN1dGUoXCJkaXJlY3RcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG9Db250ZXh0O1xuXHR9KTtcblx0b01vZGVsLnN1Ym1pdEJhdGNoKFwiZGlyZWN0XCIpO1xuXHRyZXR1cm4gb0Rpc2NhcmRQcm9taXNlO1xufVxuXG4vKipcbiAqIFByb2Nlc3MgdGhlIERhdGEgbG9zcyBjb25maXJtYXRpb24uXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5hY3Rpb25zLnN0aWNreSNkaXNjYXJkRG9jdW1lbnRcbiAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5hY3Rpb25zLnN0aWNreVxuICogQHN0YXRpY1xuICogQHBhcmFtIGZuUHJvY2VzcyBGdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIGNvbmZpcm1hdGlvblxuICogQHBhcmFtIG9WaWV3IEN1cnJlbnQgdmlld1xuICogQHBhcmFtIHByb2dyYW1taW5nTW9kZWwgUHJvZ3JhbW1pbmcgTW9kZWwgb2YgdGhlIGN1cnJlbnQgcGFnZVxuICogQHJldHVybnMgYHZvaWRgIGkgdGhpbmtcbiAqIEBwcml2YXRlXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc0RhdGFMb3NzQ29uZmlybWF0aW9uKGZuUHJvY2VzczogRnVuY3Rpb24sIG9WaWV3OiBWaWV3LCBwcm9ncmFtbWluZ01vZGVsOiBzdHJpbmcpIHtcblx0Y29uc3QgYlVJRWRpdGFibGUgPSBvVmlldy5nZXRNb2RlbChcInVpXCIpLmdldFByb3BlcnR5KFwiL2lzRWRpdGFibGVcIiksXG5cdFx0b1Jlc291cmNlQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUudGVtcGxhdGVzXCIpLFxuXHRcdHNXYXJuaW5nTXNnID0gb1Jlc291cmNlQnVuZGxlICYmIG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9DT01NT05fVVRJTFNfTkFWSUdBVElPTl9BV0FZX01TR1wiKSxcblx0XHRzQ29uZmlybUJ1dHRvblR4dCA9IG9SZXNvdXJjZUJ1bmRsZSAmJiBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfQ09NTU9OX1VUSUxTX05BVklHQVRJT05fQVdBWV9DT05GSVJNX0JVVFRPTlwiKSxcblx0XHRzQ2FuY2VsQnV0dG9uVHh0ID0gb1Jlc291cmNlQnVuZGxlICYmIG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9DT01NT05fVVRJTFNfTkFWSUdBVElPTl9BV0FZX0NBTkNFTF9CVVRUT05cIik7XG5cblx0aWYgKHByb2dyYW1taW5nTW9kZWwgPT09IFByb2dyYW1taW5nTW9kZWwuU3RpY2t5ICYmIGJVSUVkaXRhYmxlKSB7XG5cdFx0cmV0dXJuIE1lc3NhZ2VCb3gud2FybmluZyhzV2FybmluZ01zZywge1xuXHRcdFx0YWN0aW9uczogW3NDb25maXJtQnV0dG9uVHh0LCBzQ2FuY2VsQnV0dG9uVHh0XSxcblx0XHRcdGVtcGhhc2l6ZWRBY3Rpb246IHNDb25maXJtQnV0dG9uVHh0LFxuXHRcdFx0b25DbG9zZTogZnVuY3Rpb24gKHNBY3Rpb246IGFueSkge1xuXHRcdFx0XHRpZiAoc0FjdGlvbiA9PT0gc0NvbmZpcm1CdXR0b25UeHQpIHtcblx0XHRcdFx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbCA9IG9WaWV3ICYmIChvVmlldy5nZXRNb2RlbChcImludGVybmFsXCIpIGFzIEpTT05Nb2RlbCk7XG5cblx0XHRcdFx0XHRMb2cuaW5mbyhcIk5hdmlnYXRpb24gY29uZmlybWVkLlwiKTtcblx0XHRcdFx0XHRpZiAob0ludGVybmFsTW9kZWwpIHtcblx0XHRcdFx0XHRcdG9JbnRlcm5hbE1vZGVsLnNldFByb3BlcnR5KFwiL3Nlc3Npb25PblwiLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRvSW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9zdGlja3lTZXNzaW9uVG9rZW5cIiwgdW5kZWZpbmVkKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0TG9nLndhcm5pbmcoXCJMb2NhbCBVSU1vZGVsIGNvdWxkbid0IGJlIGZvdW5kLlwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm5Qcm9jZXNzKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0TG9nLmluZm8oXCJOYXZpZ2F0aW9uIHJlamVjdGVkLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBmblByb2Nlc3MoKTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgZnVuY3Rpb25zIGZvciB0aGUgc3RpY2t5IHNlc3Npb24gcHJvZ3JhbW1pbmcgbW9kZWxcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAYWxpYXMgc2FwLmZlLmNvcmUuYWN0aW9ucy5zdGlja3lcbiAqIEBwcml2YXRlXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgbW9kdWxlIGlzIG9ubHkgZm9yIGV4cGVyaW1lbnRhbCB1c2UhIDxici8+PGI+VGhpcyBpcyBvbmx5IGEgUE9DIGFuZCBtYXliZSBkZWxldGVkPC9iPlxuICogQHNpbmNlIDEuNTQuMFxuICovXG5jb25zdCBzdGlja3kgPSB7XG5cdGVkaXREb2N1bWVudEluU3RpY2t5U2Vzc2lvbjogZWRpdERvY3VtZW50SW5TdGlja3lTZXNzaW9uLFxuXHRhY3RpdmF0ZURvY3VtZW50OiBhY3RpdmF0ZURvY3VtZW50LFxuXHRkaXNjYXJkRG9jdW1lbnQ6IGRpc2NhcmREb2N1bWVudCxcblx0cHJvY2Vzc0RhdGFMb3NzQ29uZmlybWF0aW9uOiBwcm9jZXNzRGF0YUxvc3NDb25maXJtYXRpb25cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHN0aWNreTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQStEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNlQSxnQixhQUFpQkMsUSxFQUFxQkMsYTtRQUFxQjtNQUFBLGdCQVNuRUMsZUFUbUU7UUFVekUsSUFBTUMsV0FBVyxHQUFHQyxXQUFXLENBQUNDLGlCQUFaLENBQThCLHVCQUE5QixFQUF1REgs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