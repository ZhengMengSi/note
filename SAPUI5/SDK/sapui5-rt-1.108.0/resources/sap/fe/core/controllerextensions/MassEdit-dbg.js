/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/MassEditHelper", "sap/fe/core/helpers/ModelHelper", "sap/m/MessageBox", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "../CommonUtils"], function (Log, ClassSupport, MassEditHelper, ModelHelper, MessageBox, ControllerExtension, OverrideExecution, CommonUtils) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @class Controller extension providing hooks for the mass edit in a table
   * @name sap.fe.core.controllerextensions.MassEdit
   * @hideconstructor
   * @private
   */
  var MassEdit = (_dec = defineUI5Class("sap.fe.core.controllerextensions.MassEdit"), _dec2 = publicExtension(), _dec3 = finalExtension(), _dec4 = publicExtension(), _dec5 = finalExtension(), _dec6 = privateExtension(), _dec7 = extensible(OverrideExecution.After), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(MassEdit, _ControllerExtension);

    function MassEdit() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = MassEdit.prototype;

    _proto.getMessageDetailForNonEditable = function getMessageDetailForNonEditable(oResourceBundle, typeName, typeNamePlural) {
      var sHeader = oResourceBundle.getText("C_MASS_EDIT_CONFIRM_MESSAGE_DETAIL_HEADER"),
          sReasonGroup = oResourceBundle.getText("C_MASS_EDIT_CONFIRM_MESSAGE_DETAIL_REASON", [typeNamePlural]),
          sReasonDraft = oResourceBundle.getText("C_MASS_EDIT_CONFIRM_MESSAGE_DETAIL_REASON_DRAFT", [typeName]),
          sReasonNonEditable = oResourceBundle.getText("C_MASS_EDIT_CONFIRM_MESSAGE_DETAIL_REASON_NON_EDITABLE", [typeName]);
      return "<p><strong>".concat(sHeader, "</strong></p>\n") + (!!sReasonGroup && "<p>".concat(sReasonGroup, "</p>\n") + "<ul>" + (!!sReasonDraft && "<li>".concat(sReasonDraft, "</li>")) + (!!sReasonNonEditable && "<li>".concat(sReasonNonEditable, "</li>")) + "</ul>");
    };

    _proto.getResourceText = function getResourceText(exp, control) {
      var resolvedText = exp && CommonUtils.getTranslatedTextFromExpBindingString(exp, control);
      return resolvedText && resolvedText.toLocaleLowerCase();
    };

    _proto._openConfirmDialog = function _openConfirmDialog(oTable, aContexts, iSelectedContexts) {
      var _this = this;

      var iUpdatableContexts = (aContexts || []).length;
      var view = this.getView();
      return new Promise(function (resolve) {
        view.getModel("sap.fe.i18n").getResourceBundle().then(function (oResourceBundle) {
          var sEditButton = oResourceBundle.getText("C_MASS_EDIT_CONFIRM_BUTTON_TEXT"),
              sCancelButton = oResourceBundle.getText("C_COMMON_OBJECT_PAGE_CANCEL"),
              iNonEditable = iSelectedContexts - iUpdatableContexts,
              entityTypePath = oTable.data("entityType"),
              metaModel = oTable.getModel().getMetaModel(),
              headerInfoAnno = metaModel.getObject("".concat(entityTypePath, "@com.sap.vocabularies.UI.v1.HeaderInfo")),
              typeName = _this.getResourceText(headerInfoAnno.TypeName, view) || oResourceBundle.getText("C_MASS_EDIT_DIALOG_DEFAULT_TYPENAME"),
              typeNamePlural = _this.getResourceText(headerInfoAnno.TypeNamePlural, view) || oResourceBundle.getText("C_MASS_EDIT_DIALOG_DEFAULT_TYPENAME_PLURAL"),
              sMessage = oResourceBundle.getText("C_MASS_EDIT_CONFIRM_MESSAGE", [iNonEditable, iSelectedContexts, iUpdatableContexts, typeNamePlural]),
              sPath = oTable.data("targetCollectionPath"),
              oMetaModel = oTable.getModel().getMetaModel(),
              bIsDraft = ModelHelper.isDraftSupported(oMetaModel, sPath),
              bDisplayMode = oTable.data("displayModePropertyBinding") === "true",
              sMessageDetail = bIsDraft && bDisplayMode && _this.getMessageDetailForNonEditable(oResourceBundle, typeName, typeNamePlural);

          MessageBox.warning(sMessage, {
            details: sMessageDetail,
            actions: [sEditButton, sCancelButton],
            emphasizedAction: sEditButton,
            contentWidth: "100px",
            onClose: function (sSelection) {
              var aContextsForEdit = [];

              if (sSelection === sEditButton) {
                Log.info("Mass Edit: Confirmed to edit ", iUpdatableContexts.toString(), " selections.");
                aContextsForEdit = aContexts;
              } else if (sSelection === sCancelButton) {
                Log.info("Mass Edit: Cancelled.");
              }

              resolve(aContextsForEdit);
            }
          });
        }).catch(function (error) {
          Log.error(error);
        });
      });
    };

    _proto._confirmContexts = function _confirmContexts(oTable, aContexts) {
      var oInternalModelContext = oTable.getBindingContext("internal"),
          iSelectedContexts = +oInternalModelContext.getProperty("numberOfSelectedContexts") || 0;
      aContexts = aContexts || [];

      if (aContexts.length && aContexts.length !== iSelectedContexts) {
        return this._openConfirmDialog(oTable, aContexts, iSelectedContexts);
      }

      return Promise.resolve(aContexts);
    }
    /**
     * The following operations are performed by method openMassEditDialog:
     * => Opens the mass edit dialog.
     * => Implements the save and cancel functionality.
     * => Sets the runtime model to the dialog.
     * => Sets the static model's context to the dialog.
     *
     * @param oTable Instance of the table
     * @returns A promise that resolves on open of the mass edit dialog.
     * @private
     */
    ;

    _proto.openMassEditDialog = function openMassEditDialog(oTable) {
      var oController = this.getView().getController(),
          pContextsForEdit = this.fetchContextsForEdit(oTable);
      return pContextsForEdit.then(this._confirmContexts.bind(this, oTable)).then(function (aContexts) {
        return aContexts && aContexts.length > 0 ? MassEditHelper.createDialog(oTable, aContexts, oController) : Promise.resolve();
      }).then(function (oDialog) {
        if (oDialog) {
          oTable.addDependent(oDialog);
          oDialog.open();
        }
      }).catch(function (oError) {
        Log.error("Mass Edit: Something went wrong in mass edit dialog creation.", oError);
      });
    }
    /**
     * Returns a promise that resolves to the contexts for mass edit.
     *
     * @function
     * @param oTable Table for mass edit.
     * @alias sap.fe.core.contrllerextensions.MassEdit#fetchContextsForEdit
     * @returns A promise to be resolved with an array of context(s) which should be considered for mass edit.
     * @private
     */
    ;

    _proto.fetchContextsForEdit = function fetchContextsForEdit(oTable) {
      //To be overridden by the application
      var oInternalModelContext = oTable.getBindingContext("internal"),
          aSelectedContexts = oInternalModelContext.getProperty("updatableContexts") || [];
      return Promise.resolve(aSelectedContexts);
    };

    return MassEdit;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "getMessageDetailForNonEditable", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "getMessageDetailForNonEditable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "openMassEditDialog", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "openMassEditDialog"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fetchContextsForEdit", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "fetchContextsForEdit"), _class2.prototype)), _class2)) || _class);
  return MassEdit;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNYXNzRWRpdCIsImRlZmluZVVJNUNsYXNzIiwicHVibGljRXh0ZW5zaW9uIiwiZmluYWxFeHRlbnNpb24iLCJwcml2YXRlRXh0ZW5zaW9uIiwiZXh0ZW5zaWJsZSIsIk92ZXJyaWRlRXhlY3V0aW9uIiwiQWZ0ZXIiLCJnZXRNZXNzYWdlRGV0YWlsRm9yTm9uRWRpdGFibGUiLCJvUmVzb3VyY2VCdW5kbGUiLCJ0eXBlTmFtZSIsInR5cGVOYW1lUGx1cmFsIiwic0hlYWRlciIsImdldFRleHQiLCJzUmVhc29uR3JvdXAiLCJzUmVhc29uRHJhZnQiLCJzUmVhc29uTm9uRWRpdGFibGUiLCJnZXRSZXNvdXJjZVRleHQiLCJleHAiLCJjb250cm9sIiwicmVzb2x2ZWRUZXh0IiwiQ29tbW9uVXRpbHMiLCJnZXRUcmFuc2xhdGVkVGV4dEZyb21FeHBCaW5kaW5nU3RyaW5nIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJfb3BlbkNvbmZpcm1EaWFsb2ciLCJvVGFibGUiLCJhQ29udGV4dHMiLCJpU2VsZWN0ZWRDb250ZXh0cyIsImlVcGRhdGFibGVDb250ZXh0cyIsImxlbmd0aCIsInZpZXciLCJnZXRWaWV3IiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRNb2RlbCIsImdldFJlc291cmNlQnVuZGxlIiwidGhlbiIsInNFZGl0QnV0dG9uIiwic0NhbmNlbEJ1dHRvbiIsImlOb25FZGl0YWJsZSIsImVudGl0eVR5cGVQYXRoIiwiZGF0YSIsIm1ldGFNb2RlbCIsImdldE1ldGFNb2RlbCIsImhlYWRlckluZm9Bbm5vIiwiZ2V0T2JqZWN0IiwiVHlwZU5hbWUiLCJUeXBlTmFtZVBsdXJhbCIsInNNZXNzYWdlIiwic1BhdGgiLCJvTWV0YU1vZGVsIiwiYklzRHJhZnQiLCJNb2RlbEhlbHBlciIsImlzRHJhZnRTdXBwb3J0ZWQiLCJiRGlzcGxheU1vZGUiLCJzTWVzc2FnZURldGFpbCIsIk1lc3NhZ2VCb3giLCJ3YXJuaW5nIiwiZGV0YWlscyIsImFjdGlvbnMiLCJlbXBoYXNpemVkQWN0aW9uIiwiY29udGVudFdpZHRoIiwib25DbG9zZSIsInNTZWxlY3Rpb24iLCJhQ29udGV4dHNGb3JFZGl0IiwiTG9nIiwiaW5mbyIsInRvU3RyaW5nIiwiY2F0Y2giLCJlcnJvciIsIl9jb25maXJtQ29udGV4dHMiLCJvSW50ZXJuYWxNb2RlbENvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsImdldFByb3BlcnR5Iiwib3Blbk1hc3NFZGl0RGlhbG9nIiwib0NvbnRyb2xsZXIiLCJnZXRDb250cm9sbGVyIiwicENvbnRleHRzRm9yRWRpdCIsImZldGNoQ29udGV4dHNGb3JFZGl0IiwiYmluZCIsIk1hc3NFZGl0SGVscGVyIiwiY3JlYXRlRGlhbG9nIiwib0RpYWxvZyIsImFkZERlcGVuZGVudCIsIm9wZW4iLCJvRXJyb3IiLCJhU2VsZWN0ZWRDb250ZXh0cyIsIkNvbnRyb2xsZXJFeHRlbnNpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIk1hc3NFZGl0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBleHRlbnNpYmxlLCBmaW5hbEV4dGVuc2lvbiwgcHJpdmF0ZUV4dGVuc2lvbiwgcHVibGljRXh0ZW5zaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgTWFzc0VkaXRIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTWFzc0VkaXRIZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgSW50ZXJuYWxNb2RlbENvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBNZXNzYWdlQm94IGZyb20gXCJzYXAvbS9NZXNzYWdlQm94XCI7XG5pbXBvcnQgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IENvbnRyb2xsZXJFeHRlbnNpb24gZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyRXh0ZW5zaW9uXCI7XG5pbXBvcnQgT3ZlcnJpZGVFeGVjdXRpb24gZnJvbSBcInNhcC91aS9jb3JlL212Yy9PdmVycmlkZUV4ZWN1dGlvblwiO1xuaW1wb3J0IHR5cGUgVGFibGUgZnJvbSBcInNhcC91aS9tZGMvVGFibGVcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvcmVzb3VyY2UvUmVzb3VyY2VNb2RlbFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCIuLi9Db21tb25VdGlsc1wiO1xuXG4vKipcbiAqIEBjbGFzcyBDb250cm9sbGVyIGV4dGVuc2lvbiBwcm92aWRpbmcgaG9va3MgZm9yIHRoZSBtYXNzIGVkaXQgaW4gYSB0YWJsZVxuICogQG5hbWUgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuTWFzc0VkaXRcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLk1hc3NFZGl0XCIpXG5jbGFzcyBNYXNzRWRpdCBleHRlbmRzIENvbnRyb2xsZXJFeHRlbnNpb24ge1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0Z2V0TWVzc2FnZURldGFpbEZvck5vbkVkaXRhYmxlKG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGUsIHR5cGVOYW1lOiBzdHJpbmcsIHR5cGVOYW1lUGx1cmFsOiBzdHJpbmcpIHtcblx0XHRjb25zdCBzSGVhZGVyID0gb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX01BU1NfRURJVF9DT05GSVJNX01FU1NBR0VfREVUQUlMX0hFQURFUlwiKSxcblx0XHRcdHNSZWFzb25Hcm91cCA9IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiQ19NQVNTX0VESVRfQ09ORklSTV9NRVNTQUdFX0RFVEFJTF9SRUFTT05cIiwgW3R5cGVOYW1lUGx1cmFsXSksXG5cdFx0XHRzUmVhc29uRHJhZnQgPSBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfTUFTU19FRElUX0NPTkZJUk1fTUVTU0FHRV9ERVRBSUxfUkVBU09OX0RSQUZUXCIsIFt0eXBlTmFtZV0pLFxuXHRcdFx0c1JlYXNvbk5vbkVkaXRhYmxlID0gb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX01BU1NfRURJVF9DT05GSVJNX01FU1NBR0VfREVUQUlMX1JFQVNPTl9OT05fRURJVEFCTEVcIiwgW3R5cGVOYW1lXSk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0YDxwPjxzdHJvbmc+JHtzSGVhZGVyfTwvc3Ryb25nPjwvcD5cXG5gICtcblx0XHRcdCghIXNSZWFzb25Hcm91cCAmJlxuXHRcdFx0XHRgPHA+JHtzUmVhc29uR3JvdXB9PC9wPlxcbmAgK1xuXHRcdFx0XHRcdGA8dWw+YCArXG5cdFx0XHRcdFx0KCEhc1JlYXNvbkRyYWZ0ICYmIGA8bGk+JHtzUmVhc29uRHJhZnR9PC9saT5gKSArXG5cdFx0XHRcdFx0KCEhc1JlYXNvbk5vbkVkaXRhYmxlICYmIGA8bGk+JHtzUmVhc29uTm9uRWRpdGFibGV9PC9saT5gKSArXG5cdFx0XHRcdFx0YDwvdWw+YClcblx0XHQpO1xuXHR9XG5cblx0Z2V0UmVzb3VyY2VUZXh0KGV4cDogc3RyaW5nLCBjb250cm9sOiBDb250cm9sKSB7XG5cdFx0Y29uc3QgcmVzb2x2ZWRUZXh0ID0gZXhwICYmIENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0RnJvbUV4cEJpbmRpbmdTdHJpbmcoZXhwLCBjb250cm9sKTtcblx0XHRyZXR1cm4gcmVzb2x2ZWRUZXh0ICYmIHJlc29sdmVkVGV4dC50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXHR9XG5cblx0X29wZW5Db25maXJtRGlhbG9nKG9UYWJsZTogVGFibGUsIGFDb250ZXh0czogQ29udGV4dFtdLCBpU2VsZWN0ZWRDb250ZXh0czogbnVtYmVyKSB7XG5cdFx0Y29uc3QgaVVwZGF0YWJsZUNvbnRleHRzID0gKGFDb250ZXh0cyB8fCBbXSkubGVuZ3RoO1xuXHRcdGNvbnN0IHZpZXcgPSB0aGlzLmdldFZpZXcoKTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0KCh2aWV3LmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIikgYXMgUmVzb3VyY2VNb2RlbCkuZ2V0UmVzb3VyY2VCdW5kbGUoKSBhcyBQcm9taXNlPFJlc291cmNlQnVuZGxlPilcblx0XHRcdFx0LnRoZW4oKG9SZXNvdXJjZUJ1bmRsZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHNFZGl0QnV0dG9uID0gb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX01BU1NfRURJVF9DT05GSVJNX0JVVFRPTl9URVhUXCIpLFxuXHRcdFx0XHRcdFx0c0NhbmNlbEJ1dHRvbiA9IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiQ19DT01NT05fT0JKRUNUX1BBR0VfQ0FOQ0VMXCIpLFxuXHRcdFx0XHRcdFx0aU5vbkVkaXRhYmxlID0gaVNlbGVjdGVkQ29udGV4dHMgLSBpVXBkYXRhYmxlQ29udGV4dHMsXG5cdFx0XHRcdFx0XHRlbnRpdHlUeXBlUGF0aCA9IG9UYWJsZS5kYXRhKFwiZW50aXR5VHlwZVwiKSxcblx0XHRcdFx0XHRcdG1ldGFNb2RlbCA9IG9UYWJsZS5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0XHRcdFx0aGVhZGVySW5mb0Fubm8gPSBtZXRhTW9kZWwuZ2V0T2JqZWN0KGAke2VudGl0eVR5cGVQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IZWFkZXJJbmZvYCksXG5cdFx0XHRcdFx0XHR0eXBlTmFtZSA9XG5cdFx0XHRcdFx0XHRcdHRoaXMuZ2V0UmVzb3VyY2VUZXh0KGhlYWRlckluZm9Bbm5vLlR5cGVOYW1lLCB2aWV3KSB8fFxuXHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIkNfTUFTU19FRElUX0RJQUxPR19ERUZBVUxUX1RZUEVOQU1FXCIpLFxuXHRcdFx0XHRcdFx0dHlwZU5hbWVQbHVyYWwgPVxuXHRcdFx0XHRcdFx0XHR0aGlzLmdldFJlc291cmNlVGV4dChoZWFkZXJJbmZvQW5uby5UeXBlTmFtZVBsdXJhbCwgdmlldykgfHxcblx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJDX01BU1NfRURJVF9ESUFMT0dfREVGQVVMVF9UWVBFTkFNRV9QTFVSQUxcIiksXG5cdFx0XHRcdFx0XHRzTWVzc2FnZSA9IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiQ19NQVNTX0VESVRfQ09ORklSTV9NRVNTQUdFXCIsIFtcblx0XHRcdFx0XHRcdFx0aU5vbkVkaXRhYmxlLFxuXHRcdFx0XHRcdFx0XHRpU2VsZWN0ZWRDb250ZXh0cyxcblx0XHRcdFx0XHRcdFx0aVVwZGF0YWJsZUNvbnRleHRzLFxuXHRcdFx0XHRcdFx0XHR0eXBlTmFtZVBsdXJhbFxuXHRcdFx0XHRcdFx0XSksXG5cdFx0XHRcdFx0XHRzUGF0aCA9IG9UYWJsZS5kYXRhKFwidGFyZ2V0Q29sbGVjdGlvblBhdGhcIiksXG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsID0gb1RhYmxlLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRcdFx0XHRiSXNEcmFmdCA9IE1vZGVsSGVscGVyLmlzRHJhZnRTdXBwb3J0ZWQob01ldGFNb2RlbCwgc1BhdGgpLFxuXHRcdFx0XHRcdFx0YkRpc3BsYXlNb2RlID0gb1RhYmxlLmRhdGEoXCJkaXNwbGF5TW9kZVByb3BlcnR5QmluZGluZ1wiKSA9PT0gXCJ0cnVlXCIsXG5cdFx0XHRcdFx0XHRzTWVzc2FnZURldGFpbCA9XG5cdFx0XHRcdFx0XHRcdGJJc0RyYWZ0ICYmIGJEaXNwbGF5TW9kZSAmJiB0aGlzLmdldE1lc3NhZ2VEZXRhaWxGb3JOb25FZGl0YWJsZShvUmVzb3VyY2VCdW5kbGUsIHR5cGVOYW1lLCB0eXBlTmFtZVBsdXJhbCk7XG5cblx0XHRcdFx0XHRNZXNzYWdlQm94Lndhcm5pbmcoc01lc3NhZ2UsIHtcblx0XHRcdFx0XHRcdGRldGFpbHM6IHNNZXNzYWdlRGV0YWlsLFxuXHRcdFx0XHRcdFx0YWN0aW9uczogW3NFZGl0QnV0dG9uLCBzQ2FuY2VsQnV0dG9uXSxcblx0XHRcdFx0XHRcdGVtcGhhc2l6ZWRBY3Rpb246IHNFZGl0QnV0dG9uLFxuXHRcdFx0XHRcdFx0Y29udGVudFdpZHRoOiBcIjEwMHB4XCIsXG5cdFx0XHRcdFx0XHRvbkNsb3NlOiBmdW5jdGlvbiAoc1NlbGVjdGlvbjogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBhQ29udGV4dHNGb3JFZGl0OiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRpZiAoc1NlbGVjdGlvbiA9PT0gc0VkaXRCdXR0b24pIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuaW5mbyhcIk1hc3MgRWRpdDogQ29uZmlybWVkIHRvIGVkaXQgXCIsIGlVcGRhdGFibGVDb250ZXh0cy50b1N0cmluZygpLCBcIiBzZWxlY3Rpb25zLlwiKTtcblx0XHRcdFx0XHRcdFx0XHRhQ29udGV4dHNGb3JFZGl0ID0gYUNvbnRleHRzO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHNTZWxlY3Rpb24gPT09IHNDYW5jZWxCdXR0b24pIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuaW5mbyhcIk1hc3MgRWRpdDogQ2FuY2VsbGVkLlwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGFDb250ZXh0c0ZvckVkaXQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gYXMgYW55KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0X2NvbmZpcm1Db250ZXh0cyhvVGFibGU6IFRhYmxlLCBhQ29udGV4dHM6IENvbnRleHRbXSkge1xuXHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0LFxuXHRcdFx0aVNlbGVjdGVkQ29udGV4dHMgPSArb0ludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwibnVtYmVyT2ZTZWxlY3RlZENvbnRleHRzXCIpIHx8IDA7XG5cblx0XHRhQ29udGV4dHMgPSBhQ29udGV4dHMgfHwgW107XG5cblx0XHRpZiAoYUNvbnRleHRzLmxlbmd0aCAmJiBhQ29udGV4dHMubGVuZ3RoICE9PSBpU2VsZWN0ZWRDb250ZXh0cykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX29wZW5Db25maXJtRGlhbG9nKG9UYWJsZSwgYUNvbnRleHRzLCBpU2VsZWN0ZWRDb250ZXh0cyk7XG5cdFx0fVxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYUNvbnRleHRzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZm9sbG93aW5nIG9wZXJhdGlvbnMgYXJlIHBlcmZvcm1lZCBieSBtZXRob2Qgb3Blbk1hc3NFZGl0RGlhbG9nOlxuXHQgKiA9PiBPcGVucyB0aGUgbWFzcyBlZGl0IGRpYWxvZy5cblx0ICogPT4gSW1wbGVtZW50cyB0aGUgc2F2ZSBhbmQgY2FuY2VsIGZ1bmN0aW9uYWxpdHkuXG5cdCAqID0+IFNldHMgdGhlIHJ1bnRpbWUgbW9kZWwgdG8gdGhlIGRpYWxvZy5cblx0ICogPT4gU2V0cyB0aGUgc3RhdGljIG1vZGVsJ3MgY29udGV4dCB0byB0aGUgZGlhbG9nLlxuXHQgKlxuXHQgKiBAcGFyYW0gb1RhYmxlIEluc3RhbmNlIG9mIHRoZSB0YWJsZVxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbiBvcGVuIG9mIHRoZSBtYXNzIGVkaXQgZGlhbG9nLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdG9wZW5NYXNzRWRpdERpYWxvZyhvVGFibGU6IFRhYmxlKSB7XG5cdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSB0aGlzLmdldFZpZXcoKS5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIsXG5cdFx0XHRwQ29udGV4dHNGb3JFZGl0ID0gdGhpcy5mZXRjaENvbnRleHRzRm9yRWRpdChvVGFibGUpO1xuXG5cdFx0cmV0dXJuIHBDb250ZXh0c0ZvckVkaXRcblx0XHRcdC50aGVuKHRoaXMuX2NvbmZpcm1Db250ZXh0cy5iaW5kKHRoaXMsIG9UYWJsZSkpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoYUNvbnRleHRzOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGFDb250ZXh0cyAmJiBhQ29udGV4dHMubGVuZ3RoID4gMCA/IE1hc3NFZGl0SGVscGVyLmNyZWF0ZURpYWxvZyhvVGFibGUsIGFDb250ZXh0cywgb0NvbnRyb2xsZXIpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKG9EaWFsb2c/OiBhbnkpIHtcblx0XHRcdFx0aWYgKG9EaWFsb2cpIHtcblx0XHRcdFx0XHRvVGFibGUuYWRkRGVwZW5kZW50KG9EaWFsb2cpO1xuXHRcdFx0XHRcdG9EaWFsb2cub3BlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJNYXNzIEVkaXQ6IFNvbWV0aGluZyB3ZW50IHdyb25nIGluIG1hc3MgZWRpdCBkaWFsb2cgY3JlYXRpb24uXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBjb250ZXh0cyBmb3IgbWFzcyBlZGl0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIG9UYWJsZSBUYWJsZSBmb3IgbWFzcyBlZGl0LlxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJsbGVyZXh0ZW5zaW9ucy5NYXNzRWRpdCNmZXRjaENvbnRleHRzRm9yRWRpdFxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQgd2l0aCBhbiBhcnJheSBvZiBjb250ZXh0KHMpIHdoaWNoIHNob3VsZCBiZSBjb25zaWRlcmVkIGZvciBtYXNzIGVkaXQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRAcHJpdmF0ZUV4dGVuc2lvbigpXG5cdEBleHRlbnNpYmxlKE92ZXJyaWRlRXhlY3V0aW9uLkFmdGVyKVxuXHRmZXRjaENvbnRleHRzRm9yRWRpdChvVGFibGU6IFRhYmxlKSB7XG5cdFx0Ly9UbyBiZSBvdmVycmlkZGVuIGJ5IHRoZSBhcHBsaWNhdGlvblxuXHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0LFxuXHRcdFx0YVNlbGVjdGVkQ29udGV4dHMgPSBvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0UHJvcGVydHkoXCJ1cGRhdGFibGVDb250ZXh0c1wiKSB8fCBbXTtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYVNlbGVjdGVkQ29udGV4dHMpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hc3NFZGl0O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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