/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/extend", "sap/base/util/ObjectPath", "sap/fe/core/helpers/ClassSupport", "sap/m/library", "sap/ui/core/Core", "sap/ui/core/Fragment", "sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/ui/core/routing/HashChanger", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/model/json/JSONModel"], function (Log, extend, ObjectPath, ClassSupport, library, Core, Fragment, ControllerExtension, OverrideExecution, HashChanger, XMLPreprocessor, XMLTemplateProcessor, JSONModel) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var methodOverride = ClassSupport.methodOverride;
  var finalExtension = ClassSupport.finalExtension;
  var extensible = ClassSupport.extensible;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }

    if (result && result.then) {
      return result.then(void 0, recover);
    }

    return result;
  }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var oLastFocusedControl;
  /**
   * A controller extension offering hooks into the routing flow of the application
   *
   * @hideconstructor
   * @public
   * @since 1.86.0
   */

  var ShareUtils = (_dec = defineUI5Class("sap.fe.core.controllerextensions.Share"), _dec2 = methodOverride(), _dec3 = methodOverride(), _dec4 = publicExtension(), _dec5 = finalExtension(), _dec6 = publicExtension(), _dec7 = extensible(OverrideExecution.After), _dec8 = publicExtension(), _dec9 = finalExtension(), _dec10 = publicExtension(), _dec11 = finalExtension(), _dec12 = publicExtension(), _dec13 = finalExtension(), _dec14 = publicExtension(), _dec15 = finalExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(ShareUtils, _ControllerExtension);

    function ShareUtils() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = ShareUtils.prototype;

    _proto.onInit = function onInit() {
      var collaborationInfoModel = new JSONModel({
        url: "",
        appTitle: "",
        subTitle: ""
      });
      this.base.getView().setModel(collaborationInfoModel, "collaborationInfo");
    };

    _proto.onExit = function onExit() {
      var _this$base, _this$base$getView;

      var collaborationInfoModel = (_this$base = this.base) === null || _this$base === void 0 ? void 0 : (_this$base$getView = _this$base.getView()) === null || _this$base$getView === void 0 ? void 0 : _this$base$getView.getModel("collaborationInfo");

      if (collaborationInfoModel) {
        collaborationInfoModel.destroy();
      }
    }
    /**
     * Opens the share sheet.
     *
     * @function
     * @param oControl The control to which the ActionSheet is opened.
     * @alias sap.fe.core.controllerextensions.Share#openShareSheet
     * @public
     * @since 1.93.0
     */
    ;

    _proto.openShareSheet = function openShareSheet(oControl) {
      this._openShareSheetImpl(oControl);
    }
    /**
     * Adapts the metadata used while sharing the page URL via 'Send Email', 'Share in SAP Jam', and 'Save as Tile'.
     *
     * @function
     * @param oShareMetadata Object containing the share metadata.
     * @param oShareMetadata.url Default URL that will be used via 'Send Email', 'Share in SAP Jam', and 'Save as Tile'
     * @param oShareMetadata.title Default title that will be used as 'email subject' in 'Send Email', 'share text' in 'Share in SAP Jam' and 'title' in 'Save as Tile'
     * @param oShareMetadata.email Email-specific metadata.
     * @param oShareMetadata.email.url URL that will be used specifically for 'Send Email'. This takes precedence over oShareMetadata.url.
     * @param oShareMetadata.email.title Title that will be used as "email subject" in 'Send Email'. This takes precedence over oShareMetadata.title.
     * @param oShareMetadata.jam SAP Jam-specific metadata.
     * @param oShareMetadata.jam.url URL that will be used specifically for 'Share in SAP Jam'. This takes precedence over oShareMetadata.url.
     * @param oShareMetadata.jam.title Title that will be used as 'share text' in 'Share in SAP Jam'. This takes precedence over oShareMetadata.title.
     * @param oShareMetadata.tile Save as Tile-specific metadata.
     * @param oShareMetadata.tile.url URL that will be used specifically for 'Save as Tile'. This takes precedence over oShareMetadata.url.
     * @param oShareMetadata.tile.title Title to be used for the tile. This takes precedence over oShareMetadata.title.
     * @param oShareMetadata.tile.subtitle Subtitle to be used for the tile.
     * @param oShareMetadata.tile.icon Icon to be used for the tile.
     * @param oShareMetadata.tile.queryUrl Query URL of an OData service from which data for a dynamic tile is read.
     * @returns Share Metadata or a Promise resolving the Share Metadata
     * @alias sap.fe.core.controllerextensions.Share#adaptShareMetadata
     * @public
     * @since 1.93.0
     */
    ;

    _proto.adaptShareMetadata = function adaptShareMetadata(oShareMetadata) {
      return oShareMetadata;
    };

    _proto._openShareSheetImpl = function _openShareSheetImpl(by) {
      try {
        var _this2 = this;

        var oShareActionSheet;
        var sHash = HashChanger.getInstance().getHash(),
            sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "",
            oShareMetadata = {
          url: window.location.origin + window.location.pathname + (sHash ? sBasePath + sHash : window.location.hash),
          title: document.title,
          email: {
            url: "",
            title: ""
          },
          jam: {
            url: "",
            title: ""
          },
          tile: {
            url: "",
            title: "",
            subtitle: "",
            icon: "",
            queryUrl: ""
          }
        };
        oLastFocusedControl = by;

        var setShareEmailData = function (shareActionSheet, oModelData) {
          var oShareMailModel = shareActionSheet.getModel("shareData");
          var oNewMailData = extend(oShareMailModel.getData(), oModelData);
          oShareMailModel.setData(oNewMailData);
        };

        var _temp4 = _catch(function () {
          return Promise.resolve(Promise.resolve(_this2.adaptShareMetadata(oShareMetadata))).then(function (oModelData) {
            var fragmentController = {
              shareEmailPressed: function () {
                var oMailModel = oShareActionSheet.getModel("shareData");
                var oMailData = oMailModel.getData();
                var oResource = Core.getLibraryResourceBundle("sap.fe.core");
                var sEmailSubject = oMailData.email.title ? oMailData.email.title : oResource.getText("T_SHARE_UTIL_HELPER_SAPFE_EMAIL_SUBJECT", [oMailData.title]);
                library.URLHelper.triggerEmail(undefined, sEmailSubject, oMailData.email.url ? oMailData.email.url : oMailData.url);
              },
              shareMSTeamsPressed: function () {
                var msTeamsModel = oShareActionSheet.getModel("shareData");
                var msTeamsData = msTeamsModel.getData();
                var message = msTeamsData.email.title ? msTeamsData.email.title : msTeamsData.title;
                var url = msTeamsData.email.url ? msTeamsData.email.url : msTeamsData.url;
                var newWindowOpen = window.open("", "ms-teams-share-popup", "width=700,height=600");
                newWindowOpen.opener = null;
                newWindowOpen.location = "https://teams.microsoft.com/share?msgText=".concat(encodeURIComponent(message), "&href=").concat(encodeURIComponent(url));
              },
              onSaveTilePress: function () {
                // TODO it seems that the press event is executed before the dialog is available - adding a timeout is a cheap workaround
                setTimeout(function () {
                  var _Core$byId;

                  (_Core$byId = Core.byId("bookmarkDialog")) === null || _Core$byId === void 0 ? void 0 : _Core$byId.attachAfterClose(function () {
                    oLastFocusedControl.focus();
                  });
                }, 0);
              },
              shareJamPressed: function () {
                _this2._doOpenJamShareDialog(oModelData.jam.title ? oModelData.jam.title : oModelData.title, oModelData.jam.url ? oModelData.jam.url : oModelData.url);
              }
            };

            fragmentController.onCancelPressed = function () {
              oShareActionSheet.close();
            };

            fragmentController.setShareSheet = function (oShareSheet) {
              by.shareSheet = oShareSheet;
            };

            var oThis = new JSONModel({});
            var oPreprocessorSettings = {
              bindingContexts: {
                "this": oThis.createBindingContext("/")
              },
              models: {
                "this": oThis
              }
            };
            var oTileData = {
              title: oModelData.tile.title ? oModelData.tile.title : oModelData.title,
              subtitle: oModelData.tile.subtitle,
              icon: oModelData.tile.icon,
              url: oModelData.tile.url ? oModelData.tile.url : oModelData.url.substring(oModelData.url.indexOf("#")),
              queryUrl: oModelData.tile.queryUrl
            };

            var _temp2 = function () {
              if (by.shareSheet) {
                oShareActionSheet = by.shareSheet;
                var oShareModel = oShareActionSheet.getModel("share");

                _this2._setStaticShareData(oShareModel);

                var oNewData = extend(oShareModel.getData(), oTileData);
                oShareModel.setData(oNewData);
                setShareEmailData(oShareActionSheet, oModelData);
                oShareActionSheet.openBy(by);
              } else {
                var sFragmentName = "sap.fe.macros.share.ShareSheet";
                var oPopoverFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");

                var _temp5 = _catch(function () {
                  return Promise.resolve(Promise.resolve(XMLPreprocessor.process(oPopoverFragment, {
                    name: sFragmentName
                  }, oPreprocessorSettings))).then(function (oFragment) {
                    return Promise.resolve(Fragment.load({
                      definition: oFragment,
                      controller: fragmentController
                    })).then(function (_Fragment$load) {
                      oShareActionSheet = _Fragment$load;
                      oShareActionSheet.setModel(new JSONModel(oTileData || {}), "share");
                      var oShareModel = oShareActionSheet.getModel("share");

                      _this2._setStaticShareData(oShareModel);

                      var oNewData = extend(oShareModel.getData(), oTileData);
                      oShareModel.setData(oNewData);
                      oShareActionSheet.setModel(new JSONModel(oModelData || {}), "shareData");
                      setShareEmailData(oShareActionSheet, oModelData);
                      by.addDependent(oShareActionSheet);
                      oShareActionSheet.openBy(by);
                      fragmentController.setShareSheet(oShareActionSheet);
                    });
                  });
                }, function (oError) {
                  Log.error("Error while opening the share fragment", oError);
                });

                if (_temp5 && _temp5.then) return _temp5.then(function () {});
              }
            }();

            if (_temp2 && _temp2.then) return _temp2.then(function () {});
          });
        }, function (oError) {
          Log.error("Error while fetching the share model data", oError);
        });

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._setStaticShareData = function _setStaticShareData(shareModel) {
      var oResource = Core.getLibraryResourceBundle("sap.fe.core");
      shareModel.setProperty("/jamButtonText", oResource.getText("T_COMMON_SAPFE_SHARE_JAM"));
      shareModel.setProperty("/emailButtonText", oResource.getText("T_SEMANTIC_CONTROL_SEND_EMAIL"));
      shareModel.setProperty("/msTeamsShareButtonText", oResource.getText("T_COMMON_SAPFE_SHARE_MSTEAMS")); // Share to Microsoft Teams is feature which for now only gets enabled for selected customers.
      // The switch "sapHorizonEnabled" and check for it was aligned with the Fiori launchpad team.

      if (ObjectPath.get("sap-ushell-config.renderers.fiori2.componentData.config.sapHorizonEnabled") === true) {
        shareModel.setProperty("/msTeamsVisible", true);
      } else {
        shareModel.setProperty("/msTeamsVisible", false);
      }

      var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
      shareModel.setProperty("/jamVisible", !!fnGetUser && fnGetUser().isJamActive());
      shareModel.setProperty("/saveAsTileVisible", !!(sap && sap.ushell && sap.ushell.Container));
    } //the actual opening of the JAM share dialog
    ;

    _proto._doOpenJamShareDialog = function _doOpenJamShareDialog(text, sUrl) {
      var oShareDialog = Core.createComponent({
        name: "sap.collaboration.components.fiori.sharing.dialog",
        settings: {
          object: {
            id: sUrl,
            share: text
          }
        }
      });
      oShareDialog.open();
    }
    /**
     * Triggers the email flow.
     *
     * @returns {void}
     * @private
     */
    ;

    _proto._triggerEmail = function _triggerEmail() {
      try {
        var _this4 = this;

        return Promise.resolve(_this4._adaptShareMetadata()).then(function (shareMetadata) {
          var oResource = Core.getLibraryResourceBundle("sap.fe.core");
          var sEmailSubject = shareMetadata.email.title ? shareMetadata.email.title : oResource.getText("T_SHARE_UTIL_HELPER_SAPFE_EMAIL_SUBJECT", [shareMetadata.title]);
          library.URLHelper.triggerEmail(undefined, sEmailSubject, shareMetadata.email.url ? shareMetadata.email.url : shareMetadata.url);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Triggers the share to jam flow.
     *
     * @returns {void}
     * @private
     */
    ;

    _proto._triggerShareToJam = function _triggerShareToJam() {
      try {
        var _this6 = this;

        return Promise.resolve(_this6._adaptShareMetadata()).then(function (shareMetadata) {
          _this6._doOpenJamShareDialog(shareMetadata.jam.title ? shareMetadata.jam.title : shareMetadata.title, shareMetadata.jam.url ? shareMetadata.jam.url : window.location.origin + window.location.pathname + shareMetadata.url);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Triggers the save as tile flow.
     *
     * @param [source]
     * @returns {void}
     * @private
     */
    ;

    _proto._saveAsTile = function _saveAsTile(source) {
      try {
        var _this8 = this;

        return Promise.resolve(_this8._adaptShareMetadata()).then(function (shareMetadata) {
          var internalAddBookmarkButton = source.getDependents()[0];
          // set AddBookmarkButton properties
          internalAddBookmarkButton.setTitle(shareMetadata.tile.title ? shareMetadata.tile.title : shareMetadata.title);
          internalAddBookmarkButton.setSubtitle(shareMetadata.tile.subtitle);
          internalAddBookmarkButton.setTileIcon(shareMetadata.tile.icon);
          internalAddBookmarkButton.setCustomUrl(shareMetadata.tile.url ? shareMetadata.tile.title : shareMetadata.title);
          internalAddBookmarkButton.setServiceUrl(shareMetadata.tile.queryUrl); // addBookmarkButton fire press

          internalAddBookmarkButton.firePress();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Call the adaptShareMetadata extension.
     *
     * @returns {object} Share Metadata
     * @private
     */
    ;

    _proto._adaptShareMetadata = function _adaptShareMetadata() {
      var sHash = HashChanger.getInstance().getHash(),
          sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "",
          oShareMetadata = {
        url: window.location.origin + window.location.pathname + (sHash ? sBasePath + sHash : window.location.hash),
        title: document.title,
        email: {
          url: "",
          title: ""
        },
        jam: {
          url: "",
          title: ""
        },
        tile: {
          url: "",
          title: "",
          subtitle: "",
          icon: "",
          queryUrl: ""
        }
      };
      return this.adaptShareMetadata(oShareMetadata);
    };

    return ShareUtils;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "openShareSheet", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "openShareSheet"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "adaptShareMetadata", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "adaptShareMetadata"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_triggerEmail", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "_triggerEmail"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_triggerShareToJam", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "_triggerShareToJam"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_saveAsTile", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "_saveAsTile"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_adaptShareMetadata", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "_adaptShareMetadata"), _class2.prototype)), _class2)) || _class);
  return ShareUtils;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwib0xhc3RGb2N1c2VkQ29udHJvbCIsIlNoYXJlVXRpbHMiLCJkZWZpbmVVSTVDbGFzcyIsIm1ldGhvZE92ZXJyaWRlIiwicHVibGljRXh0ZW5zaW9uIiwiZmluYWxFeHRlbnNpb24iLCJleHRlbnNpYmxlIiwiT3ZlcnJpZGVFeGVjdXRpb24iLCJBZnRlciIsIm9uSW5pdCIsImNvbGxhYm9yYXRpb25JbmZvTW9kZWwiLCJKU09OTW9kZWwiLCJ1cmwiLCJhcHBUaXRsZSIsInN1YlRpdGxlIiwiYmFzZSIsImdldFZpZXciLCJzZXRNb2RlbCIsIm9uRXhpdCIsImdldE1vZGVsIiwiZGVzdHJveSIsIm9wZW5TaGFyZVNoZWV0Iiwib0NvbnRyb2wiLCJfb3BlblNoYXJlU2hlZXRJbXBsIiwiYWRhcHRTaGFyZU1ldGFkYXRhIiwib1NoYXJlTWV0YWRhdGEiLCJieSIsIm9TaGFyZUFjdGlvblNoZWV0Iiwic0hhc2giLCJIYXNoQ2hhbmdlciIsImdldEluc3RhbmNlIiwiZ2V0SGFzaCIsInNCYXNlUGF0aCIsImhyZWZGb3JBcHBTcGVjaWZpY0hhc2giLCJ3aW5kb3ciLCJsb2NhdGlvbiIsIm9yaWdpbiIsInBhdGhuYW1lIiwiaGFzaCIsInRpdGxlIiwiZG9jdW1lbnQiLCJlbWFpbCIsImphbSIsInRpbGUiLCJzdWJ0aXRsZSIsImljb24iLCJxdWVyeVVybCIsInNldFNoYXJlRW1haWxEYXRhIiwic2hhcmVBY3Rpb25TaGVldCIsIm9Nb2RlbERhdGEiLCJvU2hhcmVNYWlsTW9kZWwiLCJvTmV3TWFpbERhdGEiLCJleHRlbmQiLCJnZXREYXRhIiwic2V0RGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwiZnJhZ21lbnRDb250cm9sbGVyIiwic2hhcmVFbWFpbFByZXNzZWQiLCJvTWFpbE1vZGVsIiwib01haWxEYXRhIiwib1Jlc291cmNlIiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsInNFbWFpbFN1YmplY3QiLCJnZXRUZXh0IiwibGlicmFyeSIsIlVSTEhlbHBlciIsInRyaWdnZXJFbWFpbCIsInVuZGVmaW5lZCIsInNoYXJlTVNUZWFtc1ByZXNzZWQiLCJtc1RlYW1zTW9kZWwiLCJtc1RlYW1zRGF0YSIsIm1lc3NhZ2UiLCJuZXdXaW5kb3dPcGVuIiwib3BlbiIsIm9wZW5lciIsImVuY29kZVVSSUNvbXBvbmVudCIsIm9uU2F2ZVRpbGVQcmVzcyIsInNldFRpbWVvdXQiLCJieUlkIiwiYXR0YWNoQWZ0ZXJDbG9zZSIsImZvY3VzIiwic2hhcmVKYW1QcmVzc2VkIiwiX2RvT3BlbkphbVNoYXJlRGlhbG9nIiwib25DYW5jZWxQcmVzc2VkIiwiY2xvc2UiLCJzZXRTaGFyZVNoZWV0Iiwib1NoYXJlU2hlZXQiLCJzaGFyZVNoZWV0Iiwib1RoaXMiLCJvUHJlcHJvY2Vzc29yU2V0dGluZ3MiLCJiaW5kaW5nQ29udGV4dHMiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsIm1vZGVscyIsIm9UaWxlRGF0YSIsInN1YnN0cmluZyIsImluZGV4T2YiLCJvU2hhcmVNb2RlbCIsIl9zZXRTdGF0aWNTaGFyZURhdGEiLCJvTmV3RGF0YSIsIm9wZW5CeSIsInNGcmFnbWVudE5hbWUiLCJvUG9wb3ZlckZyYWdtZW50IiwiWE1MVGVtcGxhdGVQcm9jZXNzb3IiLCJsb2FkVGVtcGxhdGUiLCJYTUxQcmVwcm9jZXNzb3IiLCJwcm9jZXNzIiwibmFtZSIsIm9GcmFnbWVudCIsIkZyYWdtZW50IiwibG9hZCIsImRlZmluaXRpb24iLCJjb250cm9sbGVyIiwiYWRkRGVwZW5kZW50Iiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJzaGFyZU1vZGVsIiwic2V0UHJvcGVydHkiLCJPYmplY3RQYXRoIiwiZ2V0IiwiZm5HZXRVc2VyIiwiaXNKYW1BY3RpdmUiLCJzYXAiLCJ1c2hlbGwiLCJDb250YWluZXIiLCJ0ZXh0Iiwic1VybCIsIm9TaGFyZURpYWxvZyIsImNyZWF0ZUNvbXBvbmVudCIsInNldHRpbmdzIiwib2JqZWN0IiwiaWQiLCJzaGFyZSIsIl90cmlnZ2VyRW1haWwiLCJfYWRhcHRTaGFyZU1ldGFkYXRhIiwic2hhcmVNZXRhZGF0YSIsIl90cmlnZ2VyU2hhcmVUb0phbSIsIl9zYXZlQXNUaWxlIiwic291cmNlIiwiaW50ZXJuYWxBZGRCb29rbWFya0J1dHRvbiIsImdldERlcGVuZGVudHMiLCJzZXRUaXRsZSIsInNldFN1YnRpdGxlIiwic2V0VGlsZUljb24iLCJzZXRDdXN0b21VcmwiLCJzZXRTZXJ2aWNlVXJsIiwiZmlyZVByZXNzIiwiQ29udHJvbGxlckV4dGVuc2lvbiJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2hhcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgZXh0ZW5kIGZyb20gXCJzYXAvYmFzZS91dGlsL2V4dGVuZFwiO1xuaW1wb3J0IE9iamVjdFBhdGggZnJvbSBcInNhcC9iYXNlL3V0aWwvT2JqZWN0UGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lVUk1Q2xhc3MsIGV4dGVuc2libGUsIGZpbmFsRXh0ZW5zaW9uLCBtZXRob2RPdmVycmlkZSwgcHVibGljRXh0ZW5zaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgdHlwZSBBY3Rpb25TaGVldCBmcm9tIFwic2FwL20vQWN0aW9uU2hlZXRcIjtcbmltcG9ydCB0eXBlIERpYWxvZyBmcm9tIFwic2FwL20vRGlhbG9nXCI7XG5pbXBvcnQgbGlicmFyeSBmcm9tIFwic2FwL20vbGlicmFyeVwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCBGcmFnbWVudCBmcm9tIFwic2FwL3VpL2NvcmUvRnJhZ21lbnRcIjtcbmltcG9ydCBDb250cm9sbGVyRXh0ZW5zaW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvQ29udHJvbGxlckV4dGVuc2lvblwiO1xuaW1wb3J0IE92ZXJyaWRlRXhlY3V0aW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvT3ZlcnJpZGVFeGVjdXRpb25cIjtcbmltcG9ydCBIYXNoQ2hhbmdlciBmcm9tIFwic2FwL3VpL2NvcmUvcm91dGluZy9IYXNoQ2hhbmdlclwiO1xuaW1wb3J0IFhNTFByZXByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbC9YTUxQcmVwcm9jZXNzb3JcIjtcbmltcG9ydCBYTUxUZW1wbGF0ZVByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvWE1MVGVtcGxhdGVQcm9jZXNzb3JcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgUGFnZUNvbnRyb2xsZXIgZnJvbSBcIi4uL1BhZ2VDb250cm9sbGVyXCI7XG5cbmxldCBvTGFzdEZvY3VzZWRDb250cm9sOiBDb250cm9sO1xuXG4vKipcbiAqIEEgY29udHJvbGxlciBleHRlbnNpb24gb2ZmZXJpbmcgaG9va3MgaW50byB0aGUgcm91dGluZyBmbG93IG9mIHRoZSBhcHBsaWNhdGlvblxuICpcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzaW5jZSAxLjg2LjBcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuU2hhcmVcIilcbmNsYXNzIFNoYXJlVXRpbHMgZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJvdGVjdGVkIGJhc2UhOiBQYWdlQ29udHJvbGxlcjtcblx0QG1ldGhvZE92ZXJyaWRlKClcblx0b25Jbml0KCk6IHZvaWQge1xuXHRcdGNvbnN0IGNvbGxhYm9yYXRpb25JbmZvTW9kZWw6IEpTT05Nb2RlbCA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0dXJsOiBcIlwiLFxuXHRcdFx0YXBwVGl0bGU6IFwiXCIsXG5cdFx0XHRzdWJUaXRsZTogXCJcIlxuXHRcdH0pO1xuXHRcdHRoaXMuYmFzZS5nZXRWaWV3KCkuc2V0TW9kZWwoY29sbGFib3JhdGlvbkluZm9Nb2RlbCwgXCJjb2xsYWJvcmF0aW9uSW5mb1wiKTtcblx0fVxuXHRAbWV0aG9kT3ZlcnJpZGUoKVxuXHRvbkV4aXQoKTogdm9pZCB7XG5cdFx0Y29uc3QgY29sbGFib3JhdGlvbkluZm9Nb2RlbDogSlNPTk1vZGVsID0gdGhpcy5iYXNlPy5nZXRWaWV3KCk/LmdldE1vZGVsKFwiY29sbGFib3JhdGlvbkluZm9cIikgYXMgSlNPTk1vZGVsO1xuXHRcdGlmIChjb2xsYWJvcmF0aW9uSW5mb01vZGVsKSB7XG5cdFx0XHRjb2xsYWJvcmF0aW9uSW5mb01vZGVsLmRlc3Ryb3koKTtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIE9wZW5zIHRoZSBzaGFyZSBzaGVldC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBvQ29udHJvbCBUaGUgY29udHJvbCB0byB3aGljaCB0aGUgQWN0aW9uU2hlZXQgaXMgb3BlbmVkLlxuXHQgKiBAYWxpYXMgc2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuU2hhcmUjb3BlblNoYXJlU2hlZXRcblx0ICogQHB1YmxpY1xuXHQgKiBAc2luY2UgMS45My4wXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0b3BlblNoYXJlU2hlZXQob0NvbnRyb2w6IG9iamVjdCkge1xuXHRcdHRoaXMuX29wZW5TaGFyZVNoZWV0SW1wbChvQ29udHJvbCk7XG5cdH1cblx0LyoqXG5cdCAqIEFkYXB0cyB0aGUgbWV0YWRhdGEgdXNlZCB3aGlsZSBzaGFyaW5nIHRoZSBwYWdlIFVSTCB2aWEgJ1NlbmQgRW1haWwnLCAnU2hhcmUgaW4gU0FQIEphbScsIGFuZCAnU2F2ZSBhcyBUaWxlJy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YSBPYmplY3QgY29udGFpbmluZyB0aGUgc2hhcmUgbWV0YWRhdGEuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS51cmwgRGVmYXVsdCBVUkwgdGhhdCB3aWxsIGJlIHVzZWQgdmlhICdTZW5kIEVtYWlsJywgJ1NoYXJlIGluIFNBUCBKYW0nLCBhbmQgJ1NhdmUgYXMgVGlsZSdcblx0ICogQHBhcmFtIG9TaGFyZU1ldGFkYXRhLnRpdGxlIERlZmF1bHQgdGl0bGUgdGhhdCB3aWxsIGJlIHVzZWQgYXMgJ2VtYWlsIHN1YmplY3QnIGluICdTZW5kIEVtYWlsJywgJ3NoYXJlIHRleHQnIGluICdTaGFyZSBpbiBTQVAgSmFtJyBhbmQgJ3RpdGxlJyBpbiAnU2F2ZSBhcyBUaWxlJ1xuXHQgKiBAcGFyYW0gb1NoYXJlTWV0YWRhdGEuZW1haWwgRW1haWwtc3BlY2lmaWMgbWV0YWRhdGEuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS5lbWFpbC51cmwgVVJMIHRoYXQgd2lsbCBiZSB1c2VkIHNwZWNpZmljYWxseSBmb3IgJ1NlbmQgRW1haWwnLiBUaGlzIHRha2VzIHByZWNlZGVuY2Ugb3ZlciBvU2hhcmVNZXRhZGF0YS51cmwuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS5lbWFpbC50aXRsZSBUaXRsZSB0aGF0IHdpbGwgYmUgdXNlZCBhcyBcImVtYWlsIHN1YmplY3RcIiBpbiAnU2VuZCBFbWFpbCcuIFRoaXMgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIG9TaGFyZU1ldGFkYXRhLnRpdGxlLlxuXHQgKiBAcGFyYW0gb1NoYXJlTWV0YWRhdGEuamFtIFNBUCBKYW0tc3BlY2lmaWMgbWV0YWRhdGEuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS5qYW0udXJsIFVSTCB0aGF0IHdpbGwgYmUgdXNlZCBzcGVjaWZpY2FsbHkgZm9yICdTaGFyZSBpbiBTQVAgSmFtJy4gVGhpcyB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgb1NoYXJlTWV0YWRhdGEudXJsLlxuXHQgKiBAcGFyYW0gb1NoYXJlTWV0YWRhdGEuamFtLnRpdGxlIFRpdGxlIHRoYXQgd2lsbCBiZSB1c2VkIGFzICdzaGFyZSB0ZXh0JyBpbiAnU2hhcmUgaW4gU0FQIEphbScuIFRoaXMgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIG9TaGFyZU1ldGFkYXRhLnRpdGxlLlxuXHQgKiBAcGFyYW0gb1NoYXJlTWV0YWRhdGEudGlsZSBTYXZlIGFzIFRpbGUtc3BlY2lmaWMgbWV0YWRhdGEuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS50aWxlLnVybCBVUkwgdGhhdCB3aWxsIGJlIHVzZWQgc3BlY2lmaWNhbGx5IGZvciAnU2F2ZSBhcyBUaWxlJy4gVGhpcyB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgb1NoYXJlTWV0YWRhdGEudXJsLlxuXHQgKiBAcGFyYW0gb1NoYXJlTWV0YWRhdGEudGlsZS50aXRsZSBUaXRsZSB0byBiZSB1c2VkIGZvciB0aGUgdGlsZS4gVGhpcyB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgb1NoYXJlTWV0YWRhdGEudGl0bGUuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS50aWxlLnN1YnRpdGxlIFN1YnRpdGxlIHRvIGJlIHVzZWQgZm9yIHRoZSB0aWxlLlxuXHQgKiBAcGFyYW0gb1NoYXJlTWV0YWRhdGEudGlsZS5pY29uIEljb24gdG8gYmUgdXNlZCBmb3IgdGhlIHRpbGUuXG5cdCAqIEBwYXJhbSBvU2hhcmVNZXRhZGF0YS50aWxlLnF1ZXJ5VXJsIFF1ZXJ5IFVSTCBvZiBhbiBPRGF0YSBzZXJ2aWNlIGZyb20gd2hpY2ggZGF0YSBmb3IgYSBkeW5hbWljIHRpbGUgaXMgcmVhZC5cblx0ICogQHJldHVybnMgU2hhcmUgTWV0YWRhdGEgb3IgYSBQcm9taXNlIHJlc29sdmluZyB0aGUgU2hhcmUgTWV0YWRhdGFcblx0ICogQGFsaWFzIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLlNoYXJlI2FkYXB0U2hhcmVNZXRhZGF0YVxuXHQgKiBAcHVibGljXG5cdCAqIEBzaW5jZSAxLjkzLjBcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5BZnRlcilcblx0YWRhcHRTaGFyZU1ldGFkYXRhKG9TaGFyZU1ldGFkYXRhOiB7XG5cdFx0dXJsOiBzdHJpbmc7XG5cdFx0dGl0bGU6IHN0cmluZztcblx0XHRlbWFpbD86IHsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmcgfTtcblx0XHRqYW0/OiB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nIH07XG5cdFx0dGlsZT86IHsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IHN1YnRpdGxlOiBzdHJpbmc7IGljb246IHN0cmluZzsgcXVlcnlVcmw6IHN0cmluZyB9O1xuXHR9KTogb2JqZWN0IHwgUHJvbWlzZTxvYmplY3Q+IHtcblx0XHRyZXR1cm4gb1NoYXJlTWV0YWRhdGE7XG5cdH1cblx0YXN5bmMgX29wZW5TaGFyZVNoZWV0SW1wbChieTogYW55KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0bGV0IG9TaGFyZUFjdGlvblNoZWV0OiBBY3Rpb25TaGVldDtcblx0XHRjb25zdCBzSGFzaCA9IEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkuZ2V0SGFzaCgpLFxuXHRcdFx0c0Jhc2VQYXRoID0gKEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkgYXMgYW55KS5ocmVmRm9yQXBwU3BlY2lmaWNIYXNoXG5cdFx0XHRcdD8gKEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkgYXMgYW55KS5ocmVmRm9yQXBwU3BlY2lmaWNIYXNoKFwiXCIpXG5cdFx0XHRcdDogXCJcIixcblx0XHRcdG9TaGFyZU1ldGFkYXRhID0ge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAoc0hhc2ggPyBzQmFzZVBhdGggKyBzSGFzaCA6IHdpbmRvdy5sb2NhdGlvbi5oYXNoKSxcblx0XHRcdFx0dGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuXHRcdFx0XHRlbWFpbDoge1xuXHRcdFx0XHRcdHVybDogXCJcIixcblx0XHRcdFx0XHR0aXRsZTogXCJcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRqYW06IHtcblx0XHRcdFx0XHR1cmw6IFwiXCIsXG5cdFx0XHRcdFx0dGl0bGU6IFwiXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0dGlsZToge1xuXHRcdFx0XHRcdHVybDogXCJcIixcblx0XHRcdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdFx0XHRzdWJ0aXRsZTogXCJcIixcblx0XHRcdFx0XHRpY29uOiBcIlwiLFxuXHRcdFx0XHRcdHF1ZXJ5VXJsOiBcIlwiXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0b0xhc3RGb2N1c2VkQ29udHJvbCA9IGJ5O1xuXG5cdFx0Y29uc3Qgc2V0U2hhcmVFbWFpbERhdGEgPSBmdW5jdGlvbiAoc2hhcmVBY3Rpb25TaGVldDogYW55LCBvTW9kZWxEYXRhOiBhbnkpIHtcblx0XHRcdGNvbnN0IG9TaGFyZU1haWxNb2RlbCA9IHNoYXJlQWN0aW9uU2hlZXQuZ2V0TW9kZWwoXCJzaGFyZURhdGFcIik7XG5cdFx0XHRjb25zdCBvTmV3TWFpbERhdGEgPSBleHRlbmQob1NoYXJlTWFpbE1vZGVsLmdldERhdGEoKSwgb01vZGVsRGF0YSk7XG5cdFx0XHRvU2hhcmVNYWlsTW9kZWwuc2V0RGF0YShvTmV3TWFpbERhdGEpO1xuXHRcdH07XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgb01vZGVsRGF0YTogYW55ID0gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKHRoaXMuYWRhcHRTaGFyZU1ldGFkYXRhKG9TaGFyZU1ldGFkYXRhKSk7XG5cdFx0XHRjb25zdCBmcmFnbWVudENvbnRyb2xsZXI6IGFueSA9IHtcblx0XHRcdFx0c2hhcmVFbWFpbFByZXNzZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjb25zdCBvTWFpbE1vZGVsID0gb1NoYXJlQWN0aW9uU2hlZXQuZ2V0TW9kZWwoXCJzaGFyZURhdGFcIikgYXMgSlNPTk1vZGVsO1xuXHRcdFx0XHRcdGNvbnN0IG9NYWlsRGF0YSA9IG9NYWlsTW9kZWwuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdGNvbnN0IG9SZXNvdXJjZSA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIik7XG5cdFx0XHRcdFx0Y29uc3Qgc0VtYWlsU3ViamVjdCA9IG9NYWlsRGF0YS5lbWFpbC50aXRsZVxuXHRcdFx0XHRcdFx0PyBvTWFpbERhdGEuZW1haWwudGl0bGVcblx0XHRcdFx0XHRcdDogb1Jlc291cmNlLmdldFRleHQoXCJUX1NIQVJFX1VUSUxfSEVMUEVSX1NBUEZFX0VNQUlMX1NVQkpFQ1RcIiwgW29NYWlsRGF0YS50aXRsZV0pO1xuXHRcdFx0XHRcdGxpYnJhcnkuVVJMSGVscGVyLnRyaWdnZXJFbWFpbCh1bmRlZmluZWQsIHNFbWFpbFN1YmplY3QsIG9NYWlsRGF0YS5lbWFpbC51cmwgPyBvTWFpbERhdGEuZW1haWwudXJsIDogb01haWxEYXRhLnVybCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNoYXJlTVNUZWFtc1ByZXNzZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjb25zdCBtc1RlYW1zTW9kZWwgPSBvU2hhcmVBY3Rpb25TaGVldC5nZXRNb2RlbChcInNoYXJlRGF0YVwiKSBhcyBKU09OTW9kZWw7XG5cdFx0XHRcdFx0Y29uc3QgbXNUZWFtc0RhdGEgPSBtc1RlYW1zTW9kZWwuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBtc1RlYW1zRGF0YS5lbWFpbC50aXRsZSA/IG1zVGVhbXNEYXRhLmVtYWlsLnRpdGxlIDogbXNUZWFtc0RhdGEudGl0bGU7XG5cdFx0XHRcdFx0Y29uc3QgdXJsID0gbXNUZWFtc0RhdGEuZW1haWwudXJsID8gbXNUZWFtc0RhdGEuZW1haWwudXJsIDogbXNUZWFtc0RhdGEudXJsO1xuXHRcdFx0XHRcdGNvbnN0IG5ld1dpbmRvd09wZW4gPSB3aW5kb3cub3BlbihcIlwiLCBcIm1zLXRlYW1zLXNoYXJlLXBvcHVwXCIsIFwid2lkdGg9NzAwLGhlaWdodD02MDBcIik7XG5cdFx0XHRcdFx0bmV3V2luZG93T3BlbiEub3BlbmVyID0gbnVsbDtcblx0XHRcdFx0XHRuZXdXaW5kb3dPcGVuIS5sb2NhdGlvbiA9IGBodHRwczovL3RlYW1zLm1pY3Jvc29mdC5jb20vc2hhcmU/bXNnVGV4dD0ke2VuY29kZVVSSUNvbXBvbmVudChcblx0XHRcdFx0XHRcdG1lc3NhZ2Vcblx0XHRcdFx0XHQpfSZocmVmPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHVybCl9YDtcblx0XHRcdFx0fSxcblx0XHRcdFx0b25TYXZlVGlsZVByZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gVE9ETyBpdCBzZWVtcyB0aGF0IHRoZSBwcmVzcyBldmVudCBpcyBleGVjdXRlZCBiZWZvcmUgdGhlIGRpYWxvZyBpcyBhdmFpbGFibGUgLSBhZGRpbmcgYSB0aW1lb3V0IGlzIGEgY2hlYXAgd29ya2Fyb3VuZFxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0KENvcmUuYnlJZChcImJvb2ttYXJrRGlhbG9nXCIpIGFzIERpYWxvZyk/LmF0dGFjaEFmdGVyQ2xvc2UoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRvTGFzdEZvY3VzZWRDb250cm9sLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9LCAwKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hhcmVKYW1QcmVzc2VkOiAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fZG9PcGVuSmFtU2hhcmVEaWFsb2coXG5cdFx0XHRcdFx0XHRvTW9kZWxEYXRhLmphbS50aXRsZSA/IG9Nb2RlbERhdGEuamFtLnRpdGxlIDogb01vZGVsRGF0YS50aXRsZSxcblx0XHRcdFx0XHRcdG9Nb2RlbERhdGEuamFtLnVybCA/IG9Nb2RlbERhdGEuamFtLnVybCA6IG9Nb2RlbERhdGEudXJsXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0ZnJhZ21lbnRDb250cm9sbGVyLm9uQ2FuY2VsUHJlc3NlZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0b1NoYXJlQWN0aW9uU2hlZXQuY2xvc2UoKTtcblx0XHRcdH07XG5cblx0XHRcdGZyYWdtZW50Q29udHJvbGxlci5zZXRTaGFyZVNoZWV0ID0gZnVuY3Rpb24gKG9TaGFyZVNoZWV0OiBhbnkpIHtcblx0XHRcdFx0Ynkuc2hhcmVTaGVldCA9IG9TaGFyZVNoZWV0O1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3Qgb1RoaXMgPSBuZXcgSlNPTk1vZGVsKHt9KTtcblx0XHRcdGNvbnN0IG9QcmVwcm9jZXNzb3JTZXR0aW5ncyA9IHtcblx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb2RlbHM6IHtcblx0XHRcdFx0XHRcInRoaXNcIjogb1RoaXNcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IG9UaWxlRGF0YSA9IHtcblx0XHRcdFx0dGl0bGU6IG9Nb2RlbERhdGEudGlsZS50aXRsZSA/IG9Nb2RlbERhdGEudGlsZS50aXRsZSA6IG9Nb2RlbERhdGEudGl0bGUsXG5cdFx0XHRcdHN1YnRpdGxlOiBvTW9kZWxEYXRhLnRpbGUuc3VidGl0bGUsXG5cdFx0XHRcdGljb246IG9Nb2RlbERhdGEudGlsZS5pY29uLFxuXHRcdFx0XHR1cmw6IG9Nb2RlbERhdGEudGlsZS51cmwgPyBvTW9kZWxEYXRhLnRpbGUudXJsIDogb01vZGVsRGF0YS51cmwuc3Vic3RyaW5nKG9Nb2RlbERhdGEudXJsLmluZGV4T2YoXCIjXCIpKSxcblx0XHRcdFx0cXVlcnlVcmw6IG9Nb2RlbERhdGEudGlsZS5xdWVyeVVybFxuXHRcdFx0fTtcblx0XHRcdGlmIChieS5zaGFyZVNoZWV0KSB7XG5cdFx0XHRcdG9TaGFyZUFjdGlvblNoZWV0ID0gYnkuc2hhcmVTaGVldDtcblxuXHRcdFx0XHRjb25zdCBvU2hhcmVNb2RlbCA9IG9TaGFyZUFjdGlvblNoZWV0LmdldE1vZGVsKFwic2hhcmVcIikgYXMgSlNPTk1vZGVsO1xuXHRcdFx0XHR0aGlzLl9zZXRTdGF0aWNTaGFyZURhdGEob1NoYXJlTW9kZWwpO1xuXHRcdFx0XHRjb25zdCBvTmV3RGF0YSA9IGV4dGVuZChvU2hhcmVNb2RlbC5nZXREYXRhKCksIG9UaWxlRGF0YSk7XG5cdFx0XHRcdG9TaGFyZU1vZGVsLnNldERhdGEob05ld0RhdGEpO1xuXHRcdFx0XHRzZXRTaGFyZUVtYWlsRGF0YShvU2hhcmVBY3Rpb25TaGVldCwgb01vZGVsRGF0YSk7XG5cdFx0XHRcdG9TaGFyZUFjdGlvblNoZWV0Lm9wZW5CeShieSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBzRnJhZ21lbnROYW1lID0gXCJzYXAuZmUubWFjcm9zLnNoYXJlLlNoYXJlU2hlZXRcIjtcblx0XHRcdFx0Y29uc3Qgb1BvcG92ZXJGcmFnbWVudCA9IFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShzRnJhZ21lbnROYW1lLCBcImZyYWdtZW50XCIpO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgb0ZyYWdtZW50ID0gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKFxuXHRcdFx0XHRcdFx0WE1MUHJlcHJvY2Vzc29yLnByb2Nlc3Mob1BvcG92ZXJGcmFnbWVudCwgeyBuYW1lOiBzRnJhZ21lbnROYW1lIH0sIG9QcmVwcm9jZXNzb3JTZXR0aW5ncylcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdG9TaGFyZUFjdGlvblNoZWV0ID0gKGF3YWl0IEZyYWdtZW50LmxvYWQoeyBkZWZpbml0aW9uOiBvRnJhZ21lbnQsIGNvbnRyb2xsZXI6IGZyYWdtZW50Q29udHJvbGxlciB9KSkgYXMgYW55O1xuXG5cdFx0XHRcdFx0b1NoYXJlQWN0aW9uU2hlZXQuc2V0TW9kZWwobmV3IEpTT05Nb2RlbChvVGlsZURhdGEgfHwge30pLCBcInNoYXJlXCIpO1xuXHRcdFx0XHRcdGNvbnN0IG9TaGFyZU1vZGVsID0gb1NoYXJlQWN0aW9uU2hlZXQuZ2V0TW9kZWwoXCJzaGFyZVwiKSBhcyBKU09OTW9kZWw7XG5cdFx0XHRcdFx0dGhpcy5fc2V0U3RhdGljU2hhcmVEYXRhKG9TaGFyZU1vZGVsKTtcblx0XHRcdFx0XHRjb25zdCBvTmV3RGF0YSA9IGV4dGVuZChvU2hhcmVNb2RlbC5nZXREYXRhKCksIG9UaWxlRGF0YSk7XG5cdFx0XHRcdFx0b1NoYXJlTW9kZWwuc2V0RGF0YShvTmV3RGF0YSk7XG5cblx0XHRcdFx0XHRvU2hhcmVBY3Rpb25TaGVldC5zZXRNb2RlbChuZXcgSlNPTk1vZGVsKG9Nb2RlbERhdGEgfHwge30pLCBcInNoYXJlRGF0YVwiKTtcblx0XHRcdFx0XHRzZXRTaGFyZUVtYWlsRGF0YShvU2hhcmVBY3Rpb25TaGVldCwgb01vZGVsRGF0YSk7XG5cblx0XHRcdFx0XHRieS5hZGREZXBlbmRlbnQob1NoYXJlQWN0aW9uU2hlZXQpO1xuXHRcdFx0XHRcdG9TaGFyZUFjdGlvblNoZWV0Lm9wZW5CeShieSk7XG5cdFx0XHRcdFx0ZnJhZ21lbnRDb250cm9sbGVyLnNldFNoYXJlU2hlZXQob1NoYXJlQWN0aW9uU2hlZXQpO1xuXHRcdFx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIG9wZW5pbmcgdGhlIHNoYXJlIGZyYWdtZW50XCIsIG9FcnJvcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGNhdGNoIChvRXJyb3I6IGFueSkge1xuXHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdGhlIHNoYXJlIG1vZGVsIGRhdGFcIiwgb0Vycm9yKTtcblx0XHR9XG5cdH1cblx0X3NldFN0YXRpY1NoYXJlRGF0YShzaGFyZU1vZGVsOiBhbnkpIHtcblx0XHRjb25zdCBvUmVzb3VyY2UgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRcdHNoYXJlTW9kZWwuc2V0UHJvcGVydHkoXCIvamFtQnV0dG9uVGV4dFwiLCBvUmVzb3VyY2UuZ2V0VGV4dChcIlRfQ09NTU9OX1NBUEZFX1NIQVJFX0pBTVwiKSk7XG5cdFx0c2hhcmVNb2RlbC5zZXRQcm9wZXJ0eShcIi9lbWFpbEJ1dHRvblRleHRcIiwgb1Jlc291cmNlLmdldFRleHQoXCJUX1NFTUFOVElDX0NPTlRST0xfU0VORF9FTUFJTFwiKSk7XG5cdFx0c2hhcmVNb2RlbC5zZXRQcm9wZXJ0eShcIi9tc1RlYW1zU2hhcmVCdXR0b25UZXh0XCIsIG9SZXNvdXJjZS5nZXRUZXh0KFwiVF9DT01NT05fU0FQRkVfU0hBUkVfTVNURUFNU1wiKSk7XG5cdFx0Ly8gU2hhcmUgdG8gTWljcm9zb2Z0IFRlYW1zIGlzIGZlYXR1cmUgd2hpY2ggZm9yIG5vdyBvbmx5IGdldHMgZW5hYmxlZCBmb3Igc2VsZWN0ZWQgY3VzdG9tZXJzLlxuXHRcdC8vIFRoZSBzd2l0Y2ggXCJzYXBIb3Jpem9uRW5hYmxlZFwiIGFuZCBjaGVjayBmb3IgaXQgd2FzIGFsaWduZWQgd2l0aCB0aGUgRmlvcmkgbGF1bmNocGFkIHRlYW0uXG5cdFx0aWYgKE9iamVjdFBhdGguZ2V0KFwic2FwLXVzaGVsbC1jb25maWcucmVuZGVyZXJzLmZpb3JpMi5jb21wb25lbnREYXRhLmNvbmZpZy5zYXBIb3Jpem9uRW5hYmxlZFwiKSA9PT0gdHJ1ZSkge1xuXHRcdFx0c2hhcmVNb2RlbC5zZXRQcm9wZXJ0eShcIi9tc1RlYW1zVmlzaWJsZVwiLCB0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2hhcmVNb2RlbC5zZXRQcm9wZXJ0eShcIi9tc1RlYW1zVmlzaWJsZVwiLCBmYWxzZSk7XG5cdFx0fVxuXHRcdGNvbnN0IGZuR2V0VXNlciA9IE9iamVjdFBhdGguZ2V0KFwic2FwLnVzaGVsbC5Db250YWluZXIuZ2V0VXNlclwiKTtcblx0XHRzaGFyZU1vZGVsLnNldFByb3BlcnR5KFwiL2phbVZpc2libGVcIiwgISFmbkdldFVzZXIgJiYgZm5HZXRVc2VyKCkuaXNKYW1BY3RpdmUoKSk7XG5cdFx0c2hhcmVNb2RlbC5zZXRQcm9wZXJ0eShcIi9zYXZlQXNUaWxlVmlzaWJsZVwiLCAhIShzYXAgJiYgc2FwLnVzaGVsbCAmJiBzYXAudXNoZWxsLkNvbnRhaW5lcikpO1xuXHR9XG5cdC8vdGhlIGFjdHVhbCBvcGVuaW5nIG9mIHRoZSBKQU0gc2hhcmUgZGlhbG9nXG5cdF9kb09wZW5KYW1TaGFyZURpYWxvZyh0ZXh0OiBhbnksIHNVcmw/OiBhbnkpIHtcblx0XHRjb25zdCBvU2hhcmVEaWFsb2cgPSBDb3JlLmNyZWF0ZUNvbXBvbmVudCh7XG5cdFx0XHRuYW1lOiBcInNhcC5jb2xsYWJvcmF0aW9uLmNvbXBvbmVudHMuZmlvcmkuc2hhcmluZy5kaWFsb2dcIixcblx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdG9iamVjdDoge1xuXHRcdFx0XHRcdGlkOiBzVXJsLFxuXHRcdFx0XHRcdHNoYXJlOiB0ZXh0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHQob1NoYXJlRGlhbG9nIGFzIGFueSkub3BlbigpO1xuXHR9XG5cdC8qKlxuXHQgKiBUcmlnZ2VycyB0aGUgZW1haWwgZmxvdy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXN5bmMgX3RyaWdnZXJFbWFpbCgpIHtcblx0XHRjb25zdCBzaGFyZU1ldGFkYXRhOiBhbnkgPSBhd2FpdCB0aGlzLl9hZGFwdFNoYXJlTWV0YWRhdGEoKTtcblx0XHRjb25zdCBvUmVzb3VyY2UgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRcdGNvbnN0IHNFbWFpbFN1YmplY3QgPSBzaGFyZU1ldGFkYXRhLmVtYWlsLnRpdGxlXG5cdFx0XHQ/IHNoYXJlTWV0YWRhdGEuZW1haWwudGl0bGVcblx0XHRcdDogb1Jlc291cmNlLmdldFRleHQoXCJUX1NIQVJFX1VUSUxfSEVMUEVSX1NBUEZFX0VNQUlMX1NVQkpFQ1RcIiwgW3NoYXJlTWV0YWRhdGEudGl0bGVdKTtcblx0XHRsaWJyYXJ5LlVSTEhlbHBlci50cmlnZ2VyRW1haWwodW5kZWZpbmVkLCBzRW1haWxTdWJqZWN0LCBzaGFyZU1ldGFkYXRhLmVtYWlsLnVybCA/IHNoYXJlTWV0YWRhdGEuZW1haWwudXJsIDogc2hhcmVNZXRhZGF0YS51cmwpO1xuXHR9XG5cdC8qKlxuXHQgKiBUcmlnZ2VycyB0aGUgc2hhcmUgdG8gamFtIGZsb3cuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdGFzeW5jIF90cmlnZ2VyU2hhcmVUb0phbSgpIHtcblx0XHRjb25zdCBzaGFyZU1ldGFkYXRhOiBhbnkgPSBhd2FpdCB0aGlzLl9hZGFwdFNoYXJlTWV0YWRhdGEoKTtcblx0XHR0aGlzLl9kb09wZW5KYW1TaGFyZURpYWxvZyhcblx0XHRcdHNoYXJlTWV0YWRhdGEuamFtLnRpdGxlID8gc2hhcmVNZXRhZGF0YS5qYW0udGl0bGUgOiBzaGFyZU1ldGFkYXRhLnRpdGxlLFxuXHRcdFx0c2hhcmVNZXRhZGF0YS5qYW0udXJsID8gc2hhcmVNZXRhZGF0YS5qYW0udXJsIDogd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHNoYXJlTWV0YWRhdGEudXJsXG5cdFx0KTtcblx0fVxuXHQvKipcblx0ICogVHJpZ2dlcnMgdGhlIHNhdmUgYXMgdGlsZSBmbG93LlxuXHQgKlxuXHQgKiBAcGFyYW0gW3NvdXJjZV1cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0YXN5bmMgX3NhdmVBc1RpbGUoc291cmNlOiBhbnkpIHtcblx0XHRjb25zdCBzaGFyZU1ldGFkYXRhOiBhbnkgPSBhd2FpdCB0aGlzLl9hZGFwdFNoYXJlTWV0YWRhdGEoKSxcblx0XHRcdGludGVybmFsQWRkQm9va21hcmtCdXR0b24gPSBzb3VyY2UuZ2V0RGVwZW5kZW50cygpWzBdO1xuXG5cdFx0Ly8gc2V0IEFkZEJvb2ttYXJrQnV0dG9uIHByb3BlcnRpZXNcblx0XHRpbnRlcm5hbEFkZEJvb2ttYXJrQnV0dG9uLnNldFRpdGxlKHNoYXJlTWV0YWRhdGEudGlsZS50aXRsZSA/IHNoYXJlTWV0YWRhdGEudGlsZS50aXRsZSA6IHNoYXJlTWV0YWRhdGEudGl0bGUpO1xuXHRcdGludGVybmFsQWRkQm9va21hcmtCdXR0b24uc2V0U3VidGl0bGUoc2hhcmVNZXRhZGF0YS50aWxlLnN1YnRpdGxlKTtcblx0XHRpbnRlcm5hbEFkZEJvb2ttYXJrQnV0dG9uLnNldFRpbGVJY29uKHNoYXJlTWV0YWRhdGEudGlsZS5pY29uKTtcblx0XHRpbnRlcm5hbEFkZEJvb2ttYXJrQnV0dG9uLnNldEN1c3RvbVVybChzaGFyZU1ldGFkYXRhLnRpbGUudXJsID8gc2hhcmVNZXRhZGF0YS50aWxlLnRpdGxlIDogc2hhcmVNZXRhZGF0YS50aXRsZSk7XG5cdFx0aW50ZXJuYWxBZGRCb29rbWFya0J1dHRvbi5zZXRTZXJ2aWNlVXJsKHNoYXJlTWV0YWRhdGEudGlsZS5xdWVyeVVybCk7XG5cblx0XHQvLyBhZGRCb29rbWFya0J1dHRvbiBmaXJlIHByZXNzXG5cdFx0aW50ZXJuYWxBZGRCb29rbWFya0J1dHRvbi5maXJlUHJlc3MoKTtcblx0fVxuXHQvKipcblx0ICogQ2FsbCB0aGUgYWRhcHRTaGFyZU1ldGFkYXRhIGV4dGVuc2lvbi5cblx0ICpcblx0ICogQHJldHVybnMge29iamVjdH0gU2hhcmUgTWV0YWRhdGFcblx0ICogQHByaXZhdGVcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRfYWRhcHRTaGFyZU1ldGFkYXRhKCkge1xuXHRcdGNvbnN0IHNIYXNoID0gSGFzaENoYW5nZXIuZ2V0SW5zdGFuY2UoKS5nZXRIYXNoKCksXG5cdFx0XHRzQmFzZVBhdGggPSAoSGFzaENoYW5nZXIuZ2V0SW5zdGFuY2UoKSBhcyBhbnkpLmhyZWZGb3JBcHBTcGVjaWZpY0hhc2hcblx0XHRcdFx0PyAoSGFzaENoYW5nZXIuZ2V0SW5zdGFuY2UoKSBhcyBhbnkpLmhyZWZGb3JBcHBTcGVjaWZpY0hhc2goXCJcIilcblx0XHRcdFx0OiBcIlwiLFxuXHRcdFx0b1NoYXJlTWV0YWRhdGEgPSB7XG5cdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIChzSGFzaCA/IHNCYXNlUGF0aCArIHNIYXNoIDogd2luZG93LmxvY2F0aW9uLmhhc2gpLFxuXHRcdFx0XHR0aXRsZTogZG9jdW1lbnQudGl0bGUsXG5cdFx0XHRcdGVtYWlsOiB7XG5cdFx0XHRcdFx0dXJsOiBcIlwiLFxuXHRcdFx0XHRcdHRpdGxlOiBcIlwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGphbToge1xuXHRcdFx0XHRcdHVybDogXCJcIixcblx0XHRcdFx0XHR0aXRsZTogXCJcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aWxlOiB7XG5cdFx0XHRcdFx0dXJsOiBcIlwiLFxuXHRcdFx0XHRcdHRpdGxlOiBcIlwiLFxuXHRcdFx0XHRcdHN1YnRpdGxlOiBcIlwiLFxuXHRcdFx0XHRcdGljb246IFwiXCIsXG5cdFx0XHRcdFx0cXVlcnlVcmw6IFwiXCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRyZXR1cm4gdGhpcy5hZGFwdFNoYXJlTWV0YWRhdGEob1NoYXJlTWV0YWRhdGEpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlVXRpbHM7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0Ys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