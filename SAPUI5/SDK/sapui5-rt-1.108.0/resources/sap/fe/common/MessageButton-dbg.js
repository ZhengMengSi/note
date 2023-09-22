/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/UriParameters", "sap/fe/common/MessagePopover", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/ClassSupport", "sap/m/Button", "sap/m/ColumnListItem", "sap/m/Dialog", "sap/m/FormattedText", "sap/m/library", "sap/ui/core/Core", "sap/ui/core/library", "sap/ui/core/mvc/View", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter"], function (Log, UriParameters, MessagePopover, CommonUtils, ClassSupport, Button, ColumnListItem, Dialog, FormattedText, library, Core, coreLibrary, View, Filter, FilterOperator, Sorter) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;

  var MessageType = coreLibrary.MessageType;
  var ButtonType = library.ButtonType;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;

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

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var MessageButton = (_dec = defineUI5Class("sap.fe.common.MessageButton"), _dec2 = aggregation({
    type: "sap.fe.common.MessageFilter",
    multiple: true,
    singularName: "customFilter"
  }), _dec3 = event(), _dec(_class = (_class2 = /*#__PURE__*/function (_Button) {
    _inheritsLoose(MessageButton, _Button);

    function MessageButton() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Button.call.apply(_Button, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "customFilters", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "messageChange", _descriptor2, _assertThisInitialized(_this));

      _this.sLastActionText = "";
      _this.sGeneralGroupText = "";
      _this.sViewId = "";
      return _this;
    }

    var _proto = MessageButton.prototype;

    _proto.init = function init() {
      Button.prototype.init.apply(this); //press event handler attached to open the message popover

      this.attachPress(this.handleMessagePopoverPress, this);
      this.oMessagePopover = new MessagePopover();
      this.oItemBinding = this.oMessagePopover.getBinding("items");
      this.oItemBinding.attachChange(this._setMessageData, this);
      var messageButtonId = this.getId();

      if (messageButtonId) {
        this.oMessagePopover.addCustomData(new sap.ui.core.CustomData({
          key: "messageButtonId",
          value: messageButtonId
        })); // TODO check for custom data type
      }

      this.attachModelContextChange(this._applyFiltersAndSort.bind(this));
      this.oMessagePopover.attachActiveTitlePress(this._activeTitlePress.bind(this));
    }
    /**
     * The method that is called when a user clicks on the MessageButton control.
     *
     * @param oEvent Event object
     */
    ;

    _proto.handleMessagePopoverPress = function handleMessagePopoverPress(oEvent) {
      this.oMessagePopover.toggle(oEvent.getSource());
    }
    /**
     * The method that groups the messages based on the section or subsection they belong to.
     * This method force the loading of contexts for all tables before to apply the grouping.
     *
     * @param oView Current view.
     * @returns Return promise.
     * @private
     */
    ;

    _proto._applyGroupingAsync = function _applyGroupingAsync(oView) {
      try {
        var _this3 = this;

        var aWaitForData = [];
        var oViewBindingContext = oView.getBindingContext();

        var _findTablesRelatedToMessages = function (view) {
          var oRes = [];

          var aMessages = _this3.oItemBinding.getContexts().map(function (oContext) {
            return oContext.getObject();
          });

          var oViewContext = view.getBindingContext();

          if (oViewContext) {
            var oObjectPage = view.getContent()[0];

            _this3.getVisibleSectionsFromObjectPageLayout(oObjectPage).forEach(function (oSection) {
              oSection.getSubSections().forEach(function (oSubSection) {
                oSubSection.findElements(true).forEach(function (oElem) {
                  if (oElem.isA("sap.ui.mdc.Table")) {
                    for (var i = 0; i < aMessages.length; i++) {
                      var oRowBinding = oElem.getRowBinding();

                      if (oRowBinding) {
                        var sElemeBindingPath = "".concat(oViewContext.getPath(), "/").concat(oElem.getRowBinding().getPath());

                        if (aMessages[i].target.indexOf(sElemeBindingPath) === 0) {
                          oRes.push({
                            table: oElem,
                            subsection: oSubSection
                          });
                          break;
                        }
                      }
                    }
                  }
                });
              });
            });
          }

          return oRes;
        }; // Search for table related to Messages and initialize the binding context of the parent subsection to retrieve the data


        var oTables = _findTablesRelatedToMessages.bind(_this3)(oView);

        oTables.forEach(function (_oTable) {
          var _oMDCTable$getBinding;

          var oMDCTable = _oTable.table,
              oSubsection = _oTable.subsection;

          if (!oMDCTable.getBindingContext() || ((_oMDCTable$getBinding = oMDCTable.getBindingContext()) === null || _oMDCTable$getBinding === void 0 ? void 0 : _oMDCTable$getBinding.getPath()) !== (oViewBindingContext === null || oViewBindingContext === void 0 ? void 0 : oViewBindingContext.getPath())) {
            oSubsection.setBindingContext(oViewBindingContext);

            if (!oMDCTable.getRowBinding().isLengthFinal()) {
              aWaitForData.push(new Promise(function (resolve) {
                oMDCTable.getRowBinding().attachEventOnce("dataReceived", function () {
                  resolve();
                });
              }));
            }
          }
        });
        var waitForGroupingApplied = new Promise(function (resolve) {
          setTimeout(function () {
            try {
              _this3._applyGrouping();

              resolve();
              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          }, 0);
        });

        var _temp2 = _catch(function () {
          return Promise.resolve(Promise.all(aWaitForData)).then(function () {
            oView.getModel().checkMessages();
            return Promise.resolve(waitForGroupingApplied).then(function () {});
          });
        }, function () {
          Log.error("Error while grouping the messages in the messagePopOver");
        });

        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * The method retrieves the visible sections from an object page.
     *
     * @param oObjectPageLayout The objectPageLayout object for which we want to retrieve the visible sections.
     * @returns Array of visible sections.
     * @private
     */
    ;

    _proto.getVisibleSectionsFromObjectPageLayout = function getVisibleSectionsFromObjectPageLayout(oObjectPageLayout) {
      return oObjectPageLayout.getSections().filter(function (oSection) {
        return oSection.getVisible();
      });
    }
    /**
     * The method that groups the messages based on the section or subsection they belong to.
     *
     * @private
     */
    ;

    _proto._applyGrouping = function _applyGrouping() {
      this.oObjectPageLayout = this._getObjectPageLayout(this, this.oObjectPageLayout);

      if (!this.oObjectPageLayout) {
        return;
      }

      var aMessages = this.oMessagePopover.getItems();
      var aSections = this.getVisibleSectionsFromObjectPageLayout(this.oObjectPageLayout);

      var bEnableBinding = this._checkControlIdInSections(aMessages, false);

      if (bEnableBinding) {
        this._fnEnableBindings(aSections);
      }
    }
    /**
     * The method retrieves the binding context for the refError object.
     * The refError contains a map to store the indexes of the rows with errors.
     *
     * @param oTable The table for which we want to get the refError Object.
     * @returns Context of the refError.
     * @private
     */
    ;

    _proto._getTableRefErrorContext = function _getTableRefErrorContext(oTable) {
      var oModel = oTable.getModel("internal"); //initialize the refError property if it doesn't exist

      if (!oTable.getBindingContext("internal").getProperty("refError")) {
        oModel.setProperty("refError", {}, oTable.getBindingContext("internal"));
      }

      var sRefErrorContextPath = oTable.getBindingContext("internal").getPath() + "/refError/" + oTable.getBindingContext().getPath().replace("/", "$") + "$" + oTable.getRowBinding().getPath().replace("/", "$");
      var oContext = oModel.getContext(sRefErrorContextPath);

      if (!oContext.getProperty("")) {
        oModel.setProperty("", {}, oContext);
      }

      return oContext;
    };

    _proto._updateInternalModel = function _updateInternalModel(oTableRowContext, iRowIndex, sTableTargetColProperty, oTable, oMessageObject, bIsCreationRow) {
      var oTemp;

      if (bIsCreationRow) {
        oTemp = {
          rowIndex: "CreationRow",
          targetColProperty: sTableTargetColProperty ? sTableTargetColProperty : ""
        };
      } else {
        oTemp = {
          rowIndex: oTableRowContext ? iRowIndex : "",
          targetColProperty: sTableTargetColProperty ? sTableTargetColProperty : ""
        };
      }

      var oModel = oTable.getModel("internal"),
          oContext = this._getTableRefErrorContext(oTable); //we first remove the entries with obsolete message ids from the internal model before inserting the new error info :


      var aValidMessageIds = sap.ui.getCore().getMessageManager().getMessageModel().getData().map(function (message) {
        return message.id;
      });
      var aObsoleteMessagelIds;

      if (oContext.getProperty()) {
        aObsoleteMessagelIds = Object.keys(oContext.getProperty()).filter(function (internalMessageId) {
          return aValidMessageIds.indexOf(internalMessageId) === -1;
        });
        aObsoleteMessagelIds.forEach(function (obsoleteId) {
          delete oContext.getProperty()[obsoleteId];
        });
      }

      oModel.setProperty(oMessageObject.getId(), Object.assign({}, oContext.getProperty(oMessageObject.getId()) ? oContext.getProperty(oMessageObject.getId()) : {}, oTemp), oContext);
    };

    _proto._getControlFromMessageRelatingToSubSection = function _getControlFromMessageRelatingToSubSection(subSection, message) {
      var _this4 = this;

      var oMessageObject = message.getBindingContext("message").getObject();
      return subSection.findElements(true, function (oElem) {
        return _this4._fnFilterUponIds(oMessageObject.getControlIds(), oElem);
      }).sort(function (a, b) {
        // controls are sorted in order to have the table on top of the array
        // it will help to compute the subtitle of the message based on the type of related controls
        if (a.isA("sap.ui.mdc.Table") && !b.isA("sap.ui.mdc.Table")) {
          return -1;
        }

        return 1;
      });
    }
    /**
     * The method that sets groups for transient messages.
     *
     * @param {object} message The transient message for which we want to compute and set group.
     * @param {string} sActionName The action name.
     * @private
     */
    ;

    _proto._setGroupLabelForTransientMsg = function _setGroupLabelForTransientMsg(message, sActionName) {
      this.sLastActionText = this.sLastActionText ? this.sLastActionText : Core.getLibraryResourceBundle("sap.fe.core").getText("T_MESSAGE_BUTTON_SAPFE_MESSAGE_GROUP_LAST_ACTION");
      message.setGroupName("".concat(this.sLastActionText, ": ").concat(sActionName));
    }
    /**
     * The method that group messages and add the subtitle.
     *
     * @param {object} message The message we want to compute group and subtitle.
     * @param {object} section The section containing the controls.
     * @param {object} subSection The subsection containing the controls.
     * @param {object} aElements List of controls from a subsection related to a message.
     * @param {boolean} bMultipleSubSections True if there is more than 1 subsection in the section.
     * @param {string} sActionName The action name.
     * @returns {object} Return the control targeted by the message.
     * @private
     */
    ;

    _proto._computeMessageGroupAndSubTitle = function _computeMessageGroupAndSubTitle(message, section, subSection, aElements, bMultipleSubSections, sActionName) {
      var _message$getBindingCo;

      this.oItemBinding.detachChange(this._setMessageData, this);
      var oMessageObject = (_message$getBindingCo = message.getBindingContext("message")) === null || _message$getBindingCo === void 0 ? void 0 : _message$getBindingCo.getObject();
      var oElement,
          oTable,
          oTargetTableInfo,
          l,
          iRowIndex,
          oTargetedControl,
          bIsCreationRow,
          sMessageSubtitle = "";
      var bIsBackendMessage = new RegExp("^/").test(oMessageObject === null || oMessageObject === void 0 ? void 0 : oMessageObject.getTargets()[0]),
          oResourceBundle = Core.getLibraryResourceBundle("sap.fe.core");

      if (bIsBackendMessage) {
        for (l = 0; l < aElements.length; l++) {
          oElement = aElements[l];
          oTargetedControl = oElement;

          if (oElement.isA("sap.m.Table") || oElement.isA("sap.ui.table.Table")) {
            oTargetTableInfo = {};
            oTable = oElement.getParent();
            oTargetTableInfo.tableHeader = oTable.getHeader();
            var oRowBinding = oTable.getRowBinding();

            if (oRowBinding && oRowBinding.isLengthFinal() && oTable.getBindingContext()) {
              oTargetTableInfo.sTableTargetColProperty = this._getTableColProperty(oTable, oMessageObject);

              var oTableColInfo = this._getTableColInfo(oTable, oTargetTableInfo.sTableTargetColProperty);

              oTargetTableInfo.oTableRowBindingContexts = oElement.isA("sap.ui.table.Table") ? oRowBinding.getContexts() : oRowBinding.getCurrentContexts();
              oTargetTableInfo.sTableTargetColName = oTableColInfo.sTableTargetColName;
              oTargetTableInfo.sTableTargetProperty = oTargetTableInfo.sTableTargetColProperty;
              oTargetTableInfo.sTableTargetColProperty = oTableColInfo.sTableTargetColProperty;
              oTargetTableInfo.oTableRowContext = oTargetTableInfo.oTableRowBindingContexts.find(function (messageObject, rowContext) {
                return rowContext && messageObject.getTargets()[0].indexOf(rowContext.getPath()) === 0;
              }.bind(this, oMessageObject));
              var sControlId = void 0;

              if (!oTargetTableInfo.oTableRowContext) {
                sControlId = oMessageObject.getControlIds().find(function (table, sId) {
                  return this._IsControlInTable(table, sId);
                }.bind(this, oTable));
              }

              if (sControlId) {
                var oControl = Core.byId(sControlId);
                bIsCreationRow = this._IsControlPartOfCreationRow(oControl);
              }

              sMessageSubtitle = this._getMessageSubtitle(message, oTargetTableInfo.oTableRowBindingContexts, oTargetTableInfo.oTableRowContext, oTargetTableInfo.sTableTargetColName, oResourceBundle, oTable, bIsCreationRow); //set the subtitle

              message.setSubtitle(sMessageSubtitle);
              message.setActiveTitle(!!oTargetTableInfo.oTableRowContext);

              if (oTargetTableInfo.oTableRowContext) {
                this._formatMessageDescription(message, oTargetTableInfo.oTableRowContext, oTargetTableInfo.sTableTargetColName, oResourceBundle, oTable);
              }

              iRowIndex = oTargetTableInfo.oTableRowContext && oTargetTableInfo.oTableRowContext.getIndex();

              this._updateInternalModel(oTargetTableInfo.oTableRowContext, iRowIndex, oTargetTableInfo.sTableTargetColProperty, oTable, oMessageObject);
            }
          } else {
            message.setActiveTitle(true); //check if the targeted control is a child of one of the other controls

            var bIsTargetedControlOrphan = this._bIsOrphanElement(oTargetedControl, aElements);

            if (bIsTargetedControlOrphan) {
              //set the subtitle
              message.setSubtitle(sMessageSubtitle);
              break;
            }
          }
        }
      } else {
        //There is only one elt as this is a frontEnd message
        oTargetedControl = aElements[0];
        oTable = this._getMdcTable(oTargetedControl);

        if (oTable) {
          oTargetTableInfo = {};
          oTargetTableInfo.tableHeader = oTable.getHeader();

          var iTargetColumnIndex = this._getTableColumnIndex(oTargetedControl);

          oTargetTableInfo.sTableTargetColProperty = iTargetColumnIndex > -1 ? oTable.getColumns()[iTargetColumnIndex].getDataProperty() : undefined;
          oTargetTableInfo.sTableTargetProperty = oTargetTableInfo.sTableTargetColProperty;
          oTargetTableInfo.sTableTargetColName = oTargetTableInfo.sTableTargetColProperty && iTargetColumnIndex > -1 ? oTable.getColumns()[iTargetColumnIndex].getHeader() : undefined;
          bIsCreationRow = this._getTableRow(oTargetedControl).isA("sap.ui.table.CreationRow");

          if (!bIsCreationRow) {
            iRowIndex = this._getTableRowIndex(oTargetedControl);
            oTargetTableInfo.oTableRowBindingContexts = oTable.getRowBinding().getCurrentContexts();
            oTargetTableInfo.oTableRowContext = oTargetTableInfo.oTableRowBindingContexts[iRowIndex];
          }

          sMessageSubtitle = this._getMessageSubtitle(message, oTargetTableInfo.oTableRowBindingContexts, oTargetTableInfo.oTableRowContext, oTargetTableInfo.sTableTargetColName, oResourceBundle, oTable, bIsCreationRow, iTargetColumnIndex === 0 && oTargetedControl.getValueState() === "Error" ? oTargetedControl : undefined); //set the subtitle

          message.setSubtitle(sMessageSubtitle);
          message.setActiveTitle(true);

          this._updateInternalModel(oTargetTableInfo.oTableRowContext, iRowIndex, oTargetTableInfo.sTableTargetColProperty, oTable, oMessageObject, bIsCreationRow);
        }
      }

      if (oMessageObject.getPersistent() && sActionName) {
        this._setGroupLabelForTransientMsg(message, sActionName);
      } else {
        message.setGroupName(section.getTitle() + (subSection.getTitle() && bMultipleSubSections ? ", ".concat(subSection.getTitle()) : "") + (oTargetTableInfo ? ", ".concat(oResourceBundle.getText("T_MESSAGE_GROUP_TITLE_TABLE_DENOMINATOR"), ": ").concat(oTargetTableInfo.tableHeader) : ""));

        var sViewId = this._getViewId(this.getId());

        var oView = Core.byId(sViewId);
        var oMessageTargetProperty = oMessageObject.getTargets()[0] && oMessageObject.getTargets()[0].split("/").pop();
        var oUIModel = oView === null || oView === void 0 ? void 0 : oView.getModel("internal");

        if (oUIModel && oUIModel.getProperty("/messageTargetProperty") && oMessageTargetProperty && oMessageTargetProperty === oUIModel.getProperty("/messageTargetProperty")) {
          this.oMessagePopover.fireActiveTitlePress({
            "item": message
          });
          oUIModel.setProperty("/messageTargetProperty", false);
        }
      }

      this.oItemBinding.attachChange(this._setMessageData, this);
      return oTargetedControl;
    };

    _proto._checkControlIdInSections = function _checkControlIdInSections(aMessages, bEnableBinding) {
      var section, aSubSections, message, i, j, k;
      this.sGeneralGroupText = this.sGeneralGroupText ? this.sGeneralGroupText : Core.getLibraryResourceBundle("sap.fe.core").getText("T_MESSAGE_BUTTON_SAPFE_MESSAGE_GROUP_GENERAL"); //Get all sections from the object page layout

      var aVisibleSections = this.getVisibleSectionsFromObjectPageLayout(this.oObjectPageLayout);

      if (aVisibleSections) {
        var _oView$getBindingCont;

        var viewId = this._getViewId(this.getId());

        var oView = Core.byId(viewId);
        var sActionName = oView === null || oView === void 0 ? void 0 : (_oView$getBindingCont = oView.getBindingContext("internal")) === null || _oView$getBindingCont === void 0 ? void 0 : _oView$getBindingCont.getProperty("sActionName");

        if (sActionName) {
          (oView === null || oView === void 0 ? void 0 : oView.getBindingContext("internal")).setProperty("sActionName", null);
        }

        for (i = aMessages.length - 1; i >= 0; --i) {
          // Loop over all messages
          message = aMessages[i];
          var bIsGeneralGroupName = true;

          for (j = aVisibleSections.length - 1; j >= 0; --j) {
            // Loop over all visible sections
            section = aVisibleSections[j];
            aSubSections = section.getSubSections();

            for (k = aSubSections.length - 1; k >= 0; --k) {
              // Loop over all sub-sections
              var subSection = aSubSections[k];

              var aControls = this._getControlFromMessageRelatingToSubSection(subSection, message);

              if (aControls.length > 0) {
                var oTargetedControl = this._computeMessageGroupAndSubTitle(message, section, subSection, aControls, aSubSections.length > 1, sActionName); // if we found table that matches with the message, we don't stop the loop
                // in case we find an additional control (eg mdc field) that also match with the message


                if (oTargetedControl && !oTargetedControl.isA("sap.m.Table") && !oTargetedControl.isA("sap.ui.table.Table")) {
                  j = k = -1;
                }

                bIsGeneralGroupName = false;
              }
            }
          }

          if (bIsGeneralGroupName) {
            var oMessageObject = message.getBindingContext("message").getObject();
            message.setActiveTitle(false);

            if (oMessageObject.persistent && sActionName) {
              this._setGroupLabelForTransientMsg(message, sActionName);
            } else {
              message.setGroupName(this.sGeneralGroupText);
            }
          }

          if (!bEnableBinding && message.getGroupName() === this.sGeneralGroupText && this._findTargetForMessage(message)) {
            return true;
          }
        }
      }
    };

    _proto._findTargetForMessage = function _findTargetForMessage(message) {
      var messageObject = message.getBindingContext("message") && message.getBindingContext("message").getObject();

      if (messageObject && messageObject.target) {
        var oMetaModel = this.oObjectPageLayout && this.oObjectPageLayout.getModel() && this.oObjectPageLayout.getModel().getMetaModel(),
            contextPath = oMetaModel && oMetaModel.getMetaPath(messageObject.target),
            oContextPathMetadata = oMetaModel && oMetaModel.getObject(contextPath);

        if (oContextPathMetadata && oContextPathMetadata.$kind === "Property") {
          return true;
        }
      }
    };

    _proto._fnEnableBindings = function _fnEnableBindings(aSections) {
      if (UriParameters.fromQuery(window.location.search).get("sap-fe-xx-lazyloadingtest")) {
        return;
      }

      for (var iSection = 0; iSection < aSections.length; iSection++) {
        var oSection = aSections[iSection];
        var nonTableChartcontrolFound = false;
        var aSubSections = oSection.getSubSections();

        for (var iSubSection = 0; iSubSection < aSubSections.length; iSubSection++) {
          var oSubSection = aSubSections[iSubSection];
          var oAllBlocks = oSubSection.getBlocks();

          if (oAllBlocks) {
            for (var block = 0; block < oSubSection.getBlocks().length; block++) {
              if (oAllBlocks[block].getContent && !oAllBlocks[block].getContent().isA("sap.fe.macros.table.TableAPI")) {
                nonTableChartcontrolFound = true;
                break;
              }
            }

            if (nonTableChartcontrolFound) {
              oSubSection.setBindingContext(undefined);
            }
          }

          if (oSubSection.getBindingContext()) {
            this._findMessageGroupAfterRebinding();

            oSubSection.getBindingContext().getBinding().attachDataReceived(this._findMessageGroupAfterRebinding);
          }
        }
      }
    };

    _proto._findMessageGroupAfterRebinding = function _findMessageGroupAfterRebinding() {
      var aMessages = this.oMessagePopover.getItems();

      this._checkControlIdInSections(aMessages, true);
    }
    /**
     * The method that retrieves the view ID (HTMLView/XMLView/JSONview/JSView/Templateview) of any control.
     *
     * @param sControlId ID of the control needed to retrieve the view ID
     * @returns The view ID of the control
     */
    ;

    _proto._getViewId = function _getViewId(sControlId) {
      var sViewId,
          oControl = Core.byId(sControlId);

      while (oControl) {
        if (oControl instanceof View) {
          sViewId = oControl.getId();
          break;
        }

        oControl = oControl.getParent();
      }

      return sViewId;
    };

    _proto._setLongtextUrlDescription = function _setLongtextUrlDescription(sMessageDescriptionContent, oDiagnosisTitle) {
      this.oMessagePopover.setAsyncDescriptionHandler(function (config) {
        // This stores the old description
        var sOldDescription = sMessageDescriptionContent; // Here we can fetch the data and concatenate it to the old one
        // By default, the longtextUrl fetching will overwrite the description (with the default behaviour)
        // Here as we have overwritten the default async handler, which fetches and replaces the description of the item
        // we can manually modify it to include whatever needed.

        var sLongTextUrl = config.item.getLongtextUrl();

        if (sLongTextUrl) {
          jQuery.ajax({
            type: "GET",
            url: sLongTextUrl,
            success: function (data) {
              var sDiagnosisText = oDiagnosisTitle.getHtmlText() + data;
              config.item.setDescription("".concat(sOldDescription).concat(sDiagnosisText));
              config.promise.resolve();
            },
            error: function () {
              config.item.setDescription(sMessageDescriptionContent);
              var sError = "A request has failed for long text data. URL: ".concat(sLongTextUrl);
              Log.error(sError);
              config.promise.reject(sError);
            }
          });
        }
      });
    };

    _proto._formatMessageDescription = function _formatMessageDescription(message, oTableRowContext, sTableTargetColName, oResourceBundle, oTable) {
      var sTableFirstColProperty = oTable.getParent().getIdentifierColumn();
      var sColumnInfo = "";

      var oColFromTableSettings = this._fetchColumnInfo(message, oTable);

      if (sTableTargetColName) {
        // if column in present in table definition
        sColumnInfo = "".concat(oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_COLUMN"), ": ").concat(sTableTargetColName);
      } else if (oColFromTableSettings) {
        if (oColFromTableSettings.availability === "Hidden") {
          // if column in neither in table definition nor personalization
          if (message.getType() === "Error") {
            sColumnInfo = sTableFirstColProperty ? "".concat(oResourceBundle.getText("T_COLUMN_AVAILABLE_DIAGNOSIS_MSGDESC_ERROR"), " ").concat(oTableRowContext.getValue(sTableFirstColProperty)) + "." : "".concat(oResourceBundle.getText("T_COLUMN_AVAILABLE_DIAGNOSIS_MSGDESC_ERROR")) + ".";
          } else {
            sColumnInfo = sTableFirstColProperty ? "".concat(oResourceBundle.getText("T_COLUMN_AVAILABLE_DIAGNOSIS_MSGDESC"), " ").concat(oTableRowContext.getValue(sTableFirstColProperty)) + "." : "".concat(oResourceBundle.getText("T_COLUMN_AVAILABLE_DIAGNOSIS_MSGDESC")) + ".";
          }
        } else {
          // if column is not in table definition but in personalization
          //if no navigation to sub op then remove link to error field BCP : 2280168899
          if (!this._navigationConfigured(oTable)) {
            message.setActiveTitle(false);
          }

          sColumnInfo = "".concat(oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_COLUMN"), ": ").concat(oColFromTableSettings.label, " (").concat(oResourceBundle.getText("T_COLUMN_INDICATOR_IN_TABLE_DEFINITION"), ")");
        }
      }

      var oFieldsAffectedTitle = new FormattedText({
        htmlText: "<html><body><strong>".concat(oResourceBundle.getText("T_FIELDS_AFFECTED_TITLE"), "</strong></body></html><br>")
      });
      var sFieldAffectedText;

      if (sTableFirstColProperty) {
        sFieldAffectedText = "".concat(oFieldsAffectedTitle.getHtmlText(), "<br>").concat(oResourceBundle.getText("T_MESSAGE_GROUP_TITLE_TABLE_DENOMINATOR"), ": ").concat(oTable.getHeader(), "<br>").concat(oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_ROW"), ": ").concat(oTableRowContext.getValue(sTableFirstColProperty), "<br>").concat(sColumnInfo, "<br>");
      } else if (sColumnInfo == "" || !sColumnInfo) {
        sFieldAffectedText = "";
      } else {
        sFieldAffectedText = "".concat(oFieldsAffectedTitle.getHtmlText(), "<br>").concat(oResourceBundle.getText("T_MESSAGE_GROUP_TITLE_TABLE_DENOMINATOR"), ": ").concat(oTable.getHeader(), "<br>").concat(sColumnInfo, "<br>");
      }

      var oDiagnosisTitle = new FormattedText({
        htmlText: "<html><body><strong>".concat(oResourceBundle.getText("T_DIAGNOSIS_TITLE"), "</strong></body></html><br>")
      }); // get the UI messages from the message context to set it to Diagnosis section

      var sUIMessageDescription = message.getBindingContext("message").getObject().description; //set the description to null to reset it below

      message.setDescription(null);
      var sDiagnosisText = "";
      var sMessageDescriptionContent = "";

      if (message.getLongtextUrl()) {
        sMessageDescriptionContent = "".concat(sFieldAffectedText, "<br>");

        this._setLongtextUrlDescription(sMessageDescriptionContent, oDiagnosisTitle);
      } else if (sUIMessageDescription) {
        sDiagnosisText = "".concat(oDiagnosisTitle.getHtmlText(), "<br>").concat(sUIMessageDescription);
        sMessageDescriptionContent = "".concat(sFieldAffectedText, "<br>").concat(sDiagnosisText);
        message.setDescription(sMessageDescriptionContent);
      } else {
        message.setDescription(sFieldAffectedText);
      }
    }
    /**
     * Method to set the button text, count and icon property based upon the message items
     * ButtonType:  Possible settings for warning and error messages are 'critical' and 'negative'.
     *
     *
     * @private
     */
    ;

    _proto._setMessageData = function _setMessageData() {
      var _this5 = this;

      clearTimeout(this._setMessageDataTimeout);
      this._setMessageDataTimeout = setTimeout(function () {
        try {
          var sIcon = "",
              oMessages = _this5.oMessagePopover.getItems(),
              oMessageCount = {
            Error: 0,
            Warning: 0,
            Success: 0,
            Information: 0
          },
              oResourceBundle = Core.getLibraryResourceBundle("sap.fe.core"),
              iMessageLength = oMessages.length;

          var sButtonType = ButtonType.Default,
              sMessageKey = "",
              sTooltipText = "",
              sMessageText = "";

          var _temp8 = function () {
            if (iMessageLength > 0) {
              function _temp9() {
                if (iMessageLength > 1) {
                  _this5.oMessagePopover.navigateBack();
                }
              }

              for (var i = 0; i < iMessageLength; i++) {
                if (!oMessages[i].getType() || oMessages[i].getType() === "") {
                  ++oMessageCount["Information"];
                } else {
                  ++oMessageCount[oMessages[i].getType()];
                }
              }

              if (oMessageCount[MessageType.Error] > 0) {
                sButtonType = ButtonType.Negative;
              } else if (oMessageCount[MessageType.Warning] > 0) {
                sButtonType = ButtonType.Critical;
              } else if (oMessageCount[MessageType.Success] > 0) {
                sButtonType = ButtonType.Success;
              } else if (oMessageCount[MessageType.Information] > 0) {
                sButtonType = ButtonType.Neutral;
              }

              if (oMessageCount.Error > 0) {
                _this5.setText(oMessageCount.Error);
              } else {
                _this5.setText("");
              }

              if (oMessageCount.Error === 1) {
                sMessageKey = "C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_TITLE_ERROR";
              } else if (oMessageCount.Error > 1) {
                sMessageKey = "C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_MULTIPLE_ERROR_TOOLTIP";
              } else if (!oMessageCount.Error && oMessageCount.Warning) {
                sMessageKey = "C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_WARNING_TOOLTIP";
              } else if (!oMessageCount.Error && !oMessageCount.Warning && oMessageCount.Information) {
                sMessageKey = "C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_INFO";
              } else if (!oMessageCount.Error && !oMessageCount.Warning && !oMessageCount.Information && oMessageCount.Success) {
                sMessageKey = "C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_SUCCESS";
              }

              if (sMessageKey) {
                sMessageText = oResourceBundle.getText(sMessageKey);
                sTooltipText = oMessageCount.Error ? "".concat(oMessageCount.Error, " ").concat(sMessageText) : sMessageText;

                _this5.setTooltip(sTooltipText);
              }

              _this5.setIcon(sIcon);

              _this5.setType(sButtonType);

              _this5.setVisible(true);

              var oView = Core.byId(_this5.sViewId);

              var _temp10 = function () {
                if (oView) {
                  function _temp11() {
                    _this5.fireMessageChange({
                      iMessageLength: iMessageLength
                    });
                  }

                  var oPageReady = oView.getController().pageReady;

                  var _temp12 = _catch(function () {
                    return Promise.resolve(oPageReady.waitPageReady()).then(function () {
                      return Promise.resolve(_this5._applyGroupingAsync(oView)).then(function () {});
                    });
                  }, function () {
                    Log.error("fail grouping messages");
                  });

                  return _temp12 && _temp12.then ? _temp12.then(_temp11) : _temp11(_temp12);
                }
              }();

              return _temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10);
            } else {
              _this5.setVisible(false);

              _this5.fireMessageChange({
                iMessageLength: iMessageLength
              });
            }
          }();

          return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      }, 100);
    };

    _proto._bIsOrphanElement = function _bIsOrphanElement(oElement, aElements) {
      return !aElements.some(function (oOrphanElement, oElem) {
        var oParentElement = oOrphanElement.getParent();

        while (oParentElement && oParentElement !== oElem) {
          oParentElement = oParentElement.getParent();
        }

        return oParentElement ? true : false;
      }.bind(this, oElement));
    }
    /**
     * The method that is called when a user clicks on the title of the message.
     *
     * @function
     * @name _activeTitlePress
     * @private
     * @param oEvent Event object passed from the handler
     */
    ;

    _proto._activeTitlePress = function _activeTitlePress(oEvent) {
      try {
        var _this7 = this;

        var oInternalModelContext = _this7.getBindingContext("pageInternal");

        oInternalModelContext.setProperty("errorNavigationSectionFlag", true);
        var oItem = oEvent.getParameter("item"),
            oMessage = oItem.getBindingContext("message").getObject(),
            bIsBackendMessage = new RegExp("^/").test(oMessage.getTarget()),
            oView = Core.byId(_this7.sViewId);
        var oControl, sSectionTitle;

        var _defaultFocus = function (message, mdcTable) {
          var focusInfo = {
            preventScroll: true,
            targetInfo: message
          };
          mdcTable.focus(focusInfo);
        }; //check if the pressed item is related to a table control


        var _temp20 = function () {
          if (oItem.getGroupName().indexOf("Table:") !== -1) {
            var oTargetMdcTable;

            var _temp21 = function () {
              if (bIsBackendMessage) {
                oTargetMdcTable = oMessage.controlIds.map(function (sControlId) {
                  var control = Core.byId(sControlId);
                  var oParentControl = control && control.getParent();
                  return oParentControl && oParentControl.isA("sap.ui.mdc.Table") && oParentControl.getHeader() === oItem.getGroupName().split(", Table: ")[1] ? oParentControl : null;
                }).reduce(function (acc, val) {
                  return val ? val : acc;
                });

                var _temp22 = function () {
                  if (oTargetMdcTable) {
                    sSectionTitle = oItem.getGroupName().split(", ")[0];

                    var _temp23 = _catch(function () {
                      return Promise.resolve(_this7._navigateFromMessageToSectionTableInIconTabBarMode(oTargetMdcTable, _this7.oObjectPageLayout, sSectionTitle)).then(function () {
                        var oRefErrorContext = _this7._getTableRefErrorContext(oTargetMdcTable);

                        var oRefError = oRefErrorContext.getProperty(oItem.getBindingContext("message").getObject().getId());

                        var _setFocusOnTargetField = function (targetMdcTable, iRowIndex) {
                          try {
                            var aTargetMdcTableRow = _this7._getMdcTableRows(targetMdcTable),
                                iFirstVisibleRow = _this7._getGridTable(targetMdcTable).getFirstVisibleRow();

                            if (aTargetMdcTableRow.length > 0 && aTargetMdcTableRow[0]) {
                              var oTargetRow = aTargetMdcTableRow[iRowIndex - iFirstVisibleRow],
                                  oTargetCell = _this7.getTargetCell(oTargetRow, oMessage);

                              if (oTargetCell) {
                                _this7.setFocusToControl(oTargetCell);

                                return Promise.resolve(undefined);
                              } else {
                                // control not found on table
                                var errorProperty = oMessage.getTarget().split("/").pop();

                                if (errorProperty) {
                                  oView.getModel("internal").setProperty("/messageTargetProperty", errorProperty);
                                }

                                if (_this7._navigationConfigured(targetMdcTable)) {
                                  return Promise.resolve(oView.getController()._routing.navigateForwardToContext(oTargetRow.getBindingContext()));
                                } else {
                                  return Promise.resolve(false);
                                }
                              }
                            }

                            return Promise.resolve(undefined);
                          } catch (e) {
                            return Promise.reject(e);
                          }
                        };

                        var _temp15 = function () {
                          if (oTargetMdcTable.data("tableType") === "GridTable" && oRefError.rowIndex !== "") {
                            var iFirstVisibleRow = _this7._getGridTable(oTargetMdcTable).getFirstVisibleRow();

                            var _temp24 = _catch(function () {
                              return Promise.resolve(oTargetMdcTable.scrollToIndex(oRefError.rowIndex)).then(function () {
                                var aTargetMdcTableRow = _this7._getMdcTableRows(oTargetMdcTable);

                                var iNewFirstVisibleRow, bScrollNeeded;

                                if (aTargetMdcTableRow.length > 0 && aTargetMdcTableRow[0]) {
                                  iNewFirstVisibleRow = aTargetMdcTableRow[0].getParent().getFirstVisibleRow();
                                  bScrollNeeded = iFirstVisibleRow - iNewFirstVisibleRow !== 0;
                                }

                                var oWaitControlIdAdded;

                                if (bScrollNeeded) {
                                  //The scrollToIndex function does not wait for the UI update. As a workaround, pending a fix from MDC (BCP: 2170251631) we use the event "UIUpdated".
                                  oWaitControlIdAdded = new Promise(function (resolve) {
                                    Core.attachEvent("UIUpdated", resolve);
                                  });
                                } else {
                                  oWaitControlIdAdded = Promise.resolve();
                                }

                                return Promise.resolve(oWaitControlIdAdded).then(function () {
                                  setTimeout(function () {
                                    try {
                                      return Promise.resolve(_setFocusOnTargetField(oTargetMdcTable, oRefError.rowIndex)).then(function (focusOnTargetField) {
                                        if (focusOnTargetField === false) {
                                          _defaultFocus(oMessage, oTargetMdcTable);
                                        }
                                      });
                                    } catch (e) {
                                      return Promise.reject(e);
                                    }
                                  }, 0);
                                });
                              });
                            }, function () {
                              Log.error("Error while focusing on error");
                            });

                            if (_temp24 && _temp24.then) return _temp24.then(function () {});
                          } else {
                            var _temp25 = function () {
                              if (oTargetMdcTable.data("tableType") === "ResponsiveTable" && oRefError) {
                                return Promise.resolve(_this7.focusOnMessageTargetControl(oView, oMessage, oTargetMdcTable, oRefError.rowIndex)).then(function (focusOnMessageTargetControl) {
                                  if (focusOnMessageTargetControl === false) {
                                    _defaultFocus(oMessage, oTargetMdcTable);
                                  }
                                });
                              } else {
                                _this7.focusOnMessageTargetControl(oView, oMessage);
                              }
                            }();

                            if (_temp25 && _temp25.then) return _temp25.then(function () {});
                          }
                        }();

                        if (_temp15 && _temp15.then) return _temp15.then(function () {});
                      });
                    }, function () {
                      Log.error("Fail to navigate to Error control");
                    });

                    if (_temp23 && _temp23.then) return _temp23.then(function () {});
                  }
                }();

                if (_temp22 && _temp22.then) return _temp22.then(function () {});
              } else {
                oControl = Core.byId(oMessage.controlIds[0]); //If the control underlying the frontEnd message is not within the current section, we first go into the target section:

                var oSelectedSection = Core.byId(_this7.oObjectPageLayout.getSelectedSection());

                if ((oSelectedSection === null || oSelectedSection === void 0 ? void 0 : oSelectedSection.findElements(true).indexOf(oControl)) === -1) {
                  sSectionTitle = oItem.getGroupName().split(", ")[0];

                  _this7._navigateFromMessageToSectionInIconTabBarMode(_this7.oObjectPageLayout, sSectionTitle);
                }

                _this7.setFocusToControl(oControl);
              }
            }();

            if (_temp21 && _temp21.then) return _temp21.then(function () {});
          } else {
            // focus on control
            sSectionTitle = oItem.getGroupName().split(", ")[0];

            _this7._navigateFromMessageToSectionInIconTabBarMode(_this7.oObjectPageLayout, sSectionTitle);

            _this7.focusOnMessageTargetControl(oView, oMessage);
          }
        }();

        return Promise.resolve(_temp20 && _temp20.then ? _temp20.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Retrieves a table cell targeted by a message.
     *
     * @param {Object} targetRow A table row
     * @param {Object} message Message targeting a cell
     * @returns {Object} Returns the cell
     * @private
     */
    ;

    _proto.getTargetCell = function getTargetCell(targetRow, message) {
      return message.getControlIds().length > 0 ? message.getControlIds().map(function (controlId) {
        var isControlInTable = targetRow.findElements(true, function (elem) {
          return elem.getId() === controlId;
        });
        return isControlInTable.length > 0 ? Core.byId(controlId) : null;
      }).reduce(function (acc, val) {
        return val ? val : acc;
      }) : null;
    }
    /**
     * Focus on the control targeted by a message.
     *
     * @param {Object} view The current view
     * @param {Object} message The message targeting the control on which we want to set the focus
     * @param {Object} targetMdcTable The table targeted by the message (optional)
     * @param {number} rowIndex The row index of the table targeted by the message (optional)
     * @returns {Promise} Promise
     * @private
     */
    ;

    _proto.focusOnMessageTargetControl = function focusOnMessageTargetControl(view, message, targetMdcTable, rowIndex) {
      try {
        var _this9 = this;

        var aAllViewElements = view.findElements(true);
        var aErroneousControls = message.getControlIds().filter(function (sControlId) {
          return aAllViewElements.some(function (oElem) {
            return oElem.getId() === sControlId && oElem.getDomRef();
          });
        }).map(function (sControlId) {
          return Core.byId(sControlId);
        });
        var aNotTableErroneousControls = aErroneousControls.filter(function (oElem) {
          return !oElem.isA("sap.m.Table") && !oElem.isA("sap.ui.table.Table");
        }); //The focus is set on Not Table control in priority

        if (aNotTableErroneousControls.length > 0) {
          _this9.setFocusToControl(aNotTableErroneousControls[0]);

          return Promise.resolve(undefined);
        } else if (aErroneousControls.length > 0) {
          var aTargetMdcTableRow = targetMdcTable ? targetMdcTable.findElements(true, function (oElem) {
            return oElem.isA(ColumnListItem.getMetadata().getName());
          }) : [];

          if (aTargetMdcTableRow.length > 0 && aTargetMdcTableRow[0]) {
            var oTargetRow = aTargetMdcTableRow[rowIndex];

            var oTargetCell = _this9.getTargetCell(oTargetRow, message);

            if (oTargetCell) {
              var oTargetField = oTargetCell.isA("sap.fe.macros.field.FieldAPI") ? oTargetCell.getContent().getContentEdit()[0] : oTargetCell.getItems()[0].getContent().getContentEdit()[0];

              _this9.setFocusToControl(oTargetField);

              return Promise.resolve(undefined);
            } else {
              var errorProperty = message.getTarget().split("/").pop();

              if (errorProperty) {
                view.getModel("internal").setProperty("/messageTargetProperty", errorProperty);
              }

              if (_this9._navigationConfigured(targetMdcTable)) {
                return Promise.resolve(view.getController()._routing.navigateForwardToContext(oTargetRow.getBindingContext()));
              } else {
                return Promise.resolve(false);
              }
            }
          }

          return Promise.resolve(undefined);
        }

        return Promise.resolve(undefined);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._getTableColInfo = function _getTableColInfo(oTable, sTableTargetColProperty) {
      var sTableTargetColName;
      var oTableTargetCol = oTable.getColumns().find(function (tagetColumnProperty, column) {
        return column.getDataProperty() === tagetColumnProperty;
      }.bind(this, sTableTargetColProperty));

      if (!oTableTargetCol) {
        /* If the target column is not found, we check for a custom column */
        var oCustomColumn = oTable.getControlDelegate().getColumnsFor(oTable).find(function (oColumn) {
          if (!!oColumn.template && oColumn.propertyInfos) {
            return oColumn.propertyInfos[0] === sTableTargetColProperty || oColumn.propertyInfos[0].replace("Property::", "") === sTableTargetColProperty;
          } else {
            return false;
          }
        });

        if (oCustomColumn) {
          oTableTargetCol = oCustomColumn;
          sTableTargetColProperty = oTableTargetCol.name;
          sTableTargetColName = oTable.getColumns().find(function (oColumn) {
            return sTableTargetColProperty === oColumn.getDataProperty();
          }).getHeader();
        } else {
          /* If the target column is not found, we check for a field group */
          var aColumns = oTable.getControlDelegate().getColumnsFor(oTable);
          oTableTargetCol = aColumns.find(function (aTableColumns, targetColumnProperty, oColumn) {
            if (oColumn.key.indexOf("::FieldGroup::") !== -1) {
              return oColumn.propertyInfos.find(function () {
                return aTableColumns.find(function (tableColumn) {
                  return tableColumn.relativePath === targetColumnProperty;
                });
              });
            }
          }.bind(this, aColumns, sTableTargetColProperty));
          /* check if the column with the field group is visible in the table: */

          var bIsTableTargetColVisible = false;

          if (oTableTargetCol && oTableTargetCol.label) {
            bIsTableTargetColVisible = oTable.getColumns().some(function (column) {
              return column.getHeader() === oTableTargetCol.label;
            });
          }

          sTableTargetColName = bIsTableTargetColVisible && oTableTargetCol.label;
          sTableTargetColProperty = bIsTableTargetColVisible && oTableTargetCol.key;
        }
      } else {
        sTableTargetColName = oTableTargetCol && oTableTargetCol.getHeader();
      }

      return {
        sTableTargetColName: sTableTargetColName,
        sTableTargetColProperty: sTableTargetColProperty
      };
    }
    /**
     *
     * @param obj The message object
     * @param aSections The array of sections in the object page
     * @returns The rank of the message
     */
    ;

    _proto._getMessageRank = function _getMessageRank(obj, aSections) {
      if (aSections) {
        var section, aSubSections, subSection, j, k, aElements, aAllElements, sectionRank;

        for (j = aSections.length - 1; j >= 0; --j) {
          // Loop over all sections
          section = aSections[j];
          aSubSections = section.getSubSections();

          for (k = aSubSections.length - 1; k >= 0; --k) {
            // Loop over all sub-sections
            subSection = aSubSections[k];
            aAllElements = subSection.findElements(true); // Get all elements inside a sub-section
            //Try to find the control 1 inside the sub section

            aElements = aAllElements.filter(this._fnFilterUponId.bind(this, obj.getControlId()));
            sectionRank = j + 1;

            if (aElements.length > 0) {
              obj.sectionName = section.getTitle();
              obj.subSectionName = subSection.getTitle();
              return sectionRank * 10 + (k + 1);
            }
          }
        } //if sub section title is Other messages, we return a high number(rank), which ensures
        //that messages belonging to this sub section always come later in messagePopover


        if (!obj.sectionName && !obj.subSectionName && obj.persistent) {
          return 1;
        }

        return 999;
      }

      return 999;
    }
    /**
     * Method to set the filters based upon the message items
     * The desired filter operation is:
     * ( filters provided by user && ( validation = true && Control should be present in view ) || messages for the current matching context ).
     *
     * @private
     */
    ;

    _proto._applyFiltersAndSort = function _applyFiltersAndSort() {
      var _this10 = this;

      var oValidationFilters,
          oValidationAndContextFilter,
          oFilters,
          sPath,
          oSorter,
          oDialogFilter,
          objectPageLayoutSections = null;
      var aUserDefinedFilter = [];

      var filterOutMessagesInDialog = function () {
        var fnTest = function (aControlIds) {
          var index = Infinity,
              oControl = Core.byId(aControlIds[0]);
          var errorFieldControl = Core.byId(aControlIds[0]);

          while (oControl) {
            var fieldRankinDialog = oControl instanceof Dialog ? (errorFieldControl === null || errorFieldControl === void 0 ? void 0 : errorFieldControl.getParent()).findElements(true).indexOf(errorFieldControl) : Infinity;

            if (oControl instanceof Dialog) {
              if (index > fieldRankinDialog) {
                index = fieldRankinDialog; // Set the focus to the dialog's control

                _this10.setFocusToControl(errorFieldControl);
              } // messages for sap.m.Dialog should not appear in the message button


              return false;
            }

            oControl = oControl.getParent();
          }

          return true;
        };

        return new Filter({
          path: "controlIds",
          test: fnTest,
          caseSensitive: true
        });
      }; //Filter function to verify if the control is part of the current view or not


      function getCheckControlInViewFilter() {
        var fnTest = function (aControlIds) {
          if (!aControlIds.length) {
            return false;
          }

          var oControl = Core.byId(aControlIds[0]);

          while (oControl) {
            if (oControl.getId() === sViewId) {
              return true;
            }

            if (oControl instanceof Dialog) {
              // messages for sap.m.Dialog should not appear in the message button
              return false;
            }

            oControl = oControl.getParent();
          }

          return false;
        };

        return new Filter({
          path: "controlIds",
          test: fnTest,
          caseSensitive: true
        });
      }

      if (!this.sViewId) {
        this.sViewId = this._getViewId(this.getId());
      }

      var sViewId = this.sViewId; //Add the filters provided by the user

      var aCustomFilters = this.getAggregation("customFilters");

      if (aCustomFilters) {
        aCustomFilters.forEach(function (filter) {
          aUserDefinedFilter.push(new Filter({
            path: filter.getProperty("path"),
            operator: filter.getProperty("operator"),
            value1: filter.getProperty("value1"),
            value2: filter.getProperty("value2")
          }));
        });
      }

      var oBindingContext = this.getBindingContext();

      if (!oBindingContext) {
        this.setVisible(false);
        return;
      } else {
        sPath = oBindingContext.getPath(); //Filter for filtering out only validation messages which are currently present in the view

        oValidationFilters = new Filter({
          filters: [new Filter({
            path: "validation",
            operator: FilterOperator.EQ,
            value1: true
          }), getCheckControlInViewFilter()],
          and: true
        }); //Filter for filtering out the bound messages i.e target starts with the context path

        oValidationAndContextFilter = new Filter({
          filters: [oValidationFilters, new Filter({
            path: "target",
            operator: FilterOperator.StartsWith,
            value1: sPath
          })],
          and: false
        });
        oDialogFilter = new Filter({
          filters: [filterOutMessagesInDialog()]
        });
      }

      var oValidationContextDialogFilters = new Filter({
        filters: [oValidationAndContextFilter, oDialogFilter],
        and: true
      }); // and finally - if there any - add custom filter (via OR)

      if (aUserDefinedFilter.length > 0) {
        oFilters = new Filter({
          filters: [aUserDefinedFilter, oValidationContextDialogFilters],
          and: false
        });
      } else {
        oFilters = oValidationContextDialogFilters;
      }

      this.oItemBinding.filter(oFilters);
      this.oObjectPageLayout = this._getObjectPageLayout(this, this.oObjectPageLayout); // We support sorting only for ObjectPageLayout use-case.

      if (this.oObjectPageLayout) {
        oSorter = new Sorter("", null, null, function (obj1, obj2) {
          if (!objectPageLayoutSections) {
            objectPageLayoutSections = _this10.oObjectPageLayout && _this10.oObjectPageLayout.getSections();
          }

          var rankA = _this10._getMessageRank(obj1, objectPageLayoutSections);

          var rankB = _this10._getMessageRank(obj2, objectPageLayoutSections);

          if (rankA < rankB) {
            return -1;
          }

          if (rankA > rankB) {
            return 1;
          }

          return 0;
        });
        this.oItemBinding.sort(oSorter);
      }
    }
    /**
     *
     * @param sControlId
     * @param oItem
     * @returns True if the control ID matches the item ID
     */
    ;

    _proto._fnFilterUponId = function _fnFilterUponId(sControlId, oItem) {
      return sControlId === oItem.getId();
    }
    /**
     *
     * @param aControlIds
     * @param oItem
     * @returns True if the item matches one of the controls
     */
    ;

    _proto._fnFilterUponIds = function _fnFilterUponIds(aControlIds, oItem) {
      return aControlIds.some(function (sControlId) {
        if (sControlId === oItem.getId()) {
          return true;
        }

        return false;
      });
    }
    /**
     * Retrieves the section based on section title and visibility.
     *
     * @param oObjectPage Object page.
     * @param sSectionTitle Section title.
     * @returns The section
     * @private
     */
    ;

    _proto._getSectionBySectionTitle = function _getSectionBySectionTitle(oObjectPage, sSectionTitle) {
      if (sSectionTitle) {
        var aSections = oObjectPage.getSections();
        var oSection;

        for (var i = 0; i < aSections.length; i++) {
          if (aSections[i].getVisible() && aSections[i].getTitle() === sSectionTitle) {
            oSection = aSections[i];
            break;
          }
        }

        return oSection;
      }
    }
    /**
     * Navigates to the section if the object page uses an IconTabBar and if the current section is not the target of the navigation.
     *
     * @param oObjectPage Object page.
     * @param sSectionTitle Section title.
     * @private
     */
    ;

    _proto._navigateFromMessageToSectionInIconTabBarMode = function _navigateFromMessageToSectionInIconTabBarMode(oObjectPage, sSectionTitle) {
      var bUseIconTabBar = oObjectPage.getUseIconTabBar();

      if (bUseIconTabBar) {
        var oSection = this._getSectionBySectionTitle(oObjectPage, sSectionTitle);

        var sSelectedSectionId = oObjectPage.getSelectedSection();

        if (oSection && sSelectedSectionId !== oSection.getId()) {
          oObjectPage.setSelectedSection(oSection.getId());
        }
      }
    };

    _proto._navigateFromMessageToSectionTableInIconTabBarMode = function _navigateFromMessageToSectionTableInIconTabBarMode(oTable, oObjectPage, sSectionTitle) {
      try {
        var _this12 = this;

        var oRowBinding = oTable.getRowBinding();
        var oTableContext = oTable.getBindingContext();
        var oOPContext = oObjectPage.getBindingContext();
        var bShouldWaitForTableRefresh = !(oTableContext === oOPContext);

        _this12._navigateFromMessageToSectionInIconTabBarMode(oObjectPage, sSectionTitle);

        return Promise.resolve(new Promise(function (resolve) {
          if (bShouldWaitForTableRefresh) {
            oRowBinding.attachEventOnce("change", function () {
              resolve();
            });
          } else {
            resolve();
          }
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Retrieves the MdcTable if it is found among any of the parent elements.
     *
     * @param oElement Control
     * @returns MDC table || undefined
     * @private
     */
    ;

    _proto._getMdcTable = function _getMdcTable(oElement) {
      //check if the element has a table within any of its parents
      var oParentElement = oElement.getParent();

      while (oParentElement && !oParentElement.isA("sap.ui.mdc.Table")) {
        oParentElement = oParentElement.getParent();
      }

      return oParentElement && oParentElement.isA("sap.ui.mdc.Table") ? oParentElement : undefined;
    };

    _proto._getGridTable = function _getGridTable(oMdcTable) {
      return oMdcTable.findElements(true, function (oElem) {
        return oElem.isA("sap.ui.table.Table") &&
        /** We check the element belongs to the MdcTable :*/
        oElem.getParent() === oMdcTable;
      })[0];
    }
    /**
     * Retrieves the table row (if available) containing the element.
     *
     * @param oElement Control
     * @returns Table row || undefined
     * @private
     */
    ;

    _proto._getTableRow = function _getTableRow(oElement) {
      var oParentElement = oElement.getParent();

      while (oParentElement && !oParentElement.isA("sap.ui.table.Row") && !oParentElement.isA("sap.ui.table.CreationRow") && !oParentElement.isA(ColumnListItem.getMetadata().getName())) {
        oParentElement = oParentElement.getParent();
      }

      return oParentElement && (oParentElement.isA("sap.ui.table.Row") || oParentElement.isA("sap.ui.table.CreationRow") || oParentElement.isA(ColumnListItem.getMetadata().getName())) ? oParentElement : undefined;
    }
    /**
     * Retrieves the index of the table row containing the element.
     *
     * @param oElement Control
     * @returns Row index || undefined
     * @private
     */
    ;

    _proto._getTableRowIndex = function _getTableRowIndex(oElement) {
      var oTableRow = this._getTableRow(oElement);

      var iRowIndex;

      if (oTableRow.isA("sap.ui.table.Row")) {
        iRowIndex = oTableRow.getIndex();
      } else {
        iRowIndex = oTableRow.getTable().getItems().findIndex(function (element) {
          return element.getId() === oTableRow.getId();
        });
      }

      return iRowIndex;
    }
    /**
     * Retrieves the index of the table column containing the element.
     *
     * @param oElement Control
     * @returns Column index || undefined
     * @private
     */
    ;

    _proto._getTableColumnIndex = function _getTableColumnIndex(oElement) {
      var getTargetCellIndex = function (element, oTargetRow) {
        return oTargetRow.getCells().findIndex(function (oCell) {
          return oCell.getId() === element.getId();
        });
      };

      var getTargetColumnIndex = function (element, oTargetRow) {
        var oTargetElement = element.getParent(),
            iTargetCellIndex = getTargetCellIndex(oTargetElement, oTargetRow);

        while (oTargetElement && iTargetCellIndex < 0) {
          oTargetElement = oTargetElement.getParent();
          iTargetCellIndex = getTargetCellIndex(oTargetElement, oTargetRow);
        }

        return iTargetCellIndex;
      };

      var oTargetRow = this._getTableRow(oElement);

      var iTargetColumnIndex;
      iTargetColumnIndex = getTargetColumnIndex(oElement, oTargetRow);

      if (oTargetRow.isA("sap.ui.table.CreationRow")) {
        var sTargetCellId = oTargetRow.getCells()[iTargetColumnIndex].getId(),
            aTableColumns = oTargetRow.getTable().getColumns();
        iTargetColumnIndex = aTableColumns.findIndex(function (column) {
          if (column.getCreationTemplate()) {
            return sTargetCellId.search(column.getCreationTemplate().getId()) > -1 ? true : false;
          } else {
            return false;
          }
        });
      }

      return iTargetColumnIndex;
    };

    _proto._getMdcTableRows = function _getMdcTableRows(oMdcTable) {
      return oMdcTable.findElements(true, function (oElem) {
        return oElem.isA("sap.ui.table.Row") &&
        /** We check the element belongs to the Mdc Table :*/
        oElem.getTable().getParent() === oMdcTable;
      });
    };

    _proto._getTableColProperty = function _getTableColProperty(oTable, oMessageObject) {
      //this function escapes a string to use it as a regex
      var fnRegExpescape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }; // based on the target path of the message we retrieve the property name.
      // to achieve it we remove the bindingContext path and the row binding path from the target


      return oMessageObject.getTargets()[0].replace(new RegExp("".concat(fnRegExpescape("".concat(oTable.getBindingContext().getPath(), "/").concat(oTable.getRowBinding().getPath())), "\\(.*\\)/")), "");
    };

    _proto._getObjectPageLayout = function _getObjectPageLayout(oElement, oObjectPageLayout) {
      if (oObjectPageLayout) {
        return oObjectPageLayout;
      }

      oObjectPageLayout = oElement; //Iterate over parent till you have not reached the object page layout

      while (oObjectPageLayout && !oObjectPageLayout.isA("sap.uxap.ObjectPageLayout")) {
        oObjectPageLayout = oObjectPageLayout.getParent();
      }

      return oObjectPageLayout;
    };

    _proto._getCustomColumnInfo = function _getCustomColumnInfo(oTable, iPosition) {
      var sTableColProperty = oTable.getColumns()[iPosition].getDataProperty();
      return oTable.getControlDelegate().getColumnsFor(oTable).find(function (oColumn) {
        return oColumn.name === sTableColProperty && !!oColumn.template;
      });
    };

    _proto._getTableFirstColProperty = function _getTableFirstColProperty(oTable) {
      var oCustomColumnInfo = this._getCustomColumnInfo(oTable, 0);

      var sTableFirstColProperty;

      if (oCustomColumnInfo) {
        if (oCustomColumnInfo.propertyInfos) {
          sTableFirstColProperty = oCustomColumnInfo.propertyInfos[0].replace("Property::", "");
        } else {
          sTableFirstColProperty = undefined;
        }
      } else {
        sTableFirstColProperty = oTable.getColumns()[0].getDataProperty();
      }

      return sTableFirstColProperty;
    };

    _proto._getTableFirstColBindingContextForTextAnnotation = function _getTableFirstColBindingContextForTextAnnotation(oTable, oTableRowContext, sTableFirstColProperty) {
      var oBindingContext;

      if (oTableRowContext && sTableFirstColProperty) {
        var oModel = oTable.getModel();
        var oMetaModel = oModel.getMetaModel();
        var sMetaPath = oMetaModel.getMetaPath(oTableRowContext.getPath());

        if (oMetaModel.getObject("".concat(sMetaPath, "/").concat(sTableFirstColProperty, "@com.sap.vocabularies.Common.v1.Text/$Path"))) {
          oBindingContext = oMetaModel.createBindingContext("".concat(sMetaPath, "/").concat(sTableFirstColProperty, "@com.sap.vocabularies.Common.v1.Text"));
        }
      }

      return oBindingContext;
    };

    _proto._getTableFirstColValue = function _getTableFirstColValue(sTableFirstColProperty, oTableRowContext, sTextAnnotationPath, sTextArrangement) {
      var sCodeValue = oTableRowContext.getValue(sTableFirstColProperty);
      var sTextValue;
      var sComputedValue = sCodeValue;

      if (sTextAnnotationPath) {
        if (sTableFirstColProperty.lastIndexOf("/") > 0) {
          // the target property is replaced with the text annotation path
          sTableFirstColProperty = sTableFirstColProperty.slice(0, sTableFirstColProperty.lastIndexOf("/") + 1);
          sTableFirstColProperty = sTableFirstColProperty.concat(sTextAnnotationPath);
        } else {
          sTableFirstColProperty = sTextAnnotationPath;
        }

        sTextValue = oTableRowContext.getValue(sTableFirstColProperty);

        if (sTextValue) {
          if (sTextArrangement) {
            var sEnumNumber = sTextArrangement.slice(sTextArrangement.indexOf("/") + 1);

            switch (sEnumNumber) {
              case "TextOnly":
                sComputedValue = sTextValue;
                break;

              case "TextFirst":
                sComputedValue = "".concat(sTextValue, " (").concat(sCodeValue, ")");
                break;

              case "TextLast":
                sComputedValue = "".concat(sCodeValue, " (").concat(sTextValue, ")");
                break;

              case "TextSeparate":
                sComputedValue = sCodeValue;
                break;

              default:
            }
          } else {
            sComputedValue = "".concat(sTextValue, " (").concat(sCodeValue, ")");
          }
        }
      }

      return sComputedValue;
    };

    _proto._IsControlInTable = function _IsControlInTable(oTable, sControlId) {
      var oControl = Core.byId(sControlId);

      if (oControl && !oControl.isA("sap.ui.table.Table") && !oControl.isA("sap.m.Table")) {
        return oTable.findElements(true, function (oElem) {
          return oElem.getId() === oControl;
        });
      }

      return false;
    };

    _proto._IsControlPartOfCreationRow = function _IsControlPartOfCreationRow(oControl) {
      var oParentControl = oControl.getParent();

      while (oParentControl && !oParentControl.isA("sap.ui.table.Row") && !oParentControl.isA("sap.ui.table.CreationRow") && !oParentControl.isA(ColumnListItem.getMetadata().getName())) {
        oParentControl = oParentControl.getParent();
      }

      return !!oParentControl && oParentControl.isA("sap.ui.table.CreationRow");
    }
    /**
     * The method that is called to retrieve the column info from the associated message of the message popover.
     *
     * @private
     * @param oMessage Message object
     * @param oTable MdcTable
     * @returns Returns the column info.
     */
    ;

    _proto._fetchColumnInfo = function _fetchColumnInfo(oMessage, oTable) {
      var sColNameFromMessageObj = oMessage.getBindingContext("message").getObject().getTarget().split("/").pop();
      return oTable.getParent().getTableDefinition().columns.find(function (oColumn) {
        return oColumn.key.split("::").pop() === sColNameFromMessageObj;
      });
    }
    /**
     * The method that is called to check if a navigation is configured from the table to a sub object page.
     *
     * @private
     * @param table MdcTable
     * @returns Either true or false
     */
    ;

    _proto._navigationConfigured = function _navigationConfigured(table) {
      // TODO: this logic would be moved to check the same at the template time to avoid the same check happening multiple times.
      var component = sap.ui.require("sap/ui/core/Component"),
          navObject = table && component.getOwnerComponentFor(table) && component.getOwnerComponentFor(table).getNavigation();

      var subOPConfigured = false,
          navConfigured = false;

      if (navObject && Object.keys(navObject).indexOf(table.getRowBinding().sPath) !== -1) {
        subOPConfigured = navObject[table === null || table === void 0 ? void 0 : table.getRowBinding().sPath] && navObject[table === null || table === void 0 ? void 0 : table.getRowBinding().sPath].detail && navObject[table === null || table === void 0 ? void 0 : table.getRowBinding().sPath].detail.route ? true : false;
      }

      navConfigured = subOPConfigured && (table === null || table === void 0 ? void 0 : table.getRowSettings().getRowActions()) && (table === null || table === void 0 ? void 0 : table.getRowSettings().getRowActions()[0].mProperties.type.indexOf("Navigation")) !== -1;
      return navConfigured;
    }
    /**
     * Determine the message subtitle based on the control holding the error (column/row indicator).
     *
     * @private
     * @param message The message Item
     * @param oTableRowBindingContexts The table row contexts
     * @param oTableRowContext The context of the table row holding the error
     * @param sTableTargetColName The column name where the error is located
     * @param oResourceBundle ResourceBundle
     * @param oTable MdcTable
     * @param bIsCreationRow Is the error on a control that is part of the CreationRow
     * @param oTargetedControl The control targeted by the message
     * @returns The computed message subTitle
     */
    ;

    _proto._getMessageSubtitle = function _getMessageSubtitle(message, oTableRowBindingContexts, oTableRowContext, sTableTargetColName, oResourceBundle, oTable, bIsCreationRow, oTargetedControl) {
      var sMessageSubtitle;
      var sRowSubtitleValue;
      var sTableFirstColProperty = oTable.getParent().getIdentifierColumn();

      var oColFromTableSettings = this._fetchColumnInfo(message, oTable);

      if (bIsCreationRow) {
        sMessageSubtitle = CommonUtils.getTranslatedText("T_MESSAGE_ITEM_SUBTITLE", oResourceBundle, [oResourceBundle.getText("T_MESSAGE_ITEM_SUBTITLE_CREATION_ROW_INDICATOR"), sTableTargetColName ? sTableTargetColName : oColFromTableSettings.label]);
      } else {
        var oTableFirstColBindingContextTextAnnotation = this._getTableFirstColBindingContextForTextAnnotation(oTable, oTableRowContext, sTableFirstColProperty);

        var sTableFirstColTextAnnotationPath = oTableFirstColBindingContextTextAnnotation ? oTableFirstColBindingContextTextAnnotation.getObject("$Path") : undefined;
        var sTableFirstColTextArrangement = sTableFirstColTextAnnotationPath && oTableFirstColBindingContextTextAnnotation ? oTableFirstColBindingContextTextAnnotation.getObject("@com.sap.vocabularies.UI.v1.TextArrangement/$EnumMember") : undefined;

        if (oTableRowBindingContexts.length > 0) {
          // set Row subtitle text
          if (oTargetedControl) {
            // The UI error is on the first column, we then get the control input as the row indicator:
            sRowSubtitleValue = oTargetedControl.getValue();
          } else if (oTableRowContext && sTableFirstColProperty) {
            sRowSubtitleValue = this._getTableFirstColValue(sTableFirstColProperty, oTableRowContext, sTableFirstColTextAnnotationPath, sTableFirstColTextArrangement);
          } else {
            sRowSubtitleValue = undefined;
          } // set the message subtitle


          var oColumnInfo = this._determineColumnInfo(oColFromTableSettings, oResourceBundle);

          if (sRowSubtitleValue && sTableTargetColName) {
            sMessageSubtitle = CommonUtils.getTranslatedText("T_MESSAGE_ITEM_SUBTITLE", oResourceBundle, [sRowSubtitleValue, sTableTargetColName]);
          } else if (sRowSubtitleValue && oColumnInfo.sColumnIndicator === "Hidden") {
            sMessageSubtitle = "".concat(oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_ROW"), ": ").concat(sRowSubtitleValue, ", ").concat(oColumnInfo.sColumnValue);
          } else if (sRowSubtitleValue && oColumnInfo.sColumnIndicator === "Unknown") {
            sMessageSubtitle = CommonUtils.getTranslatedText("T_MESSAGE_ITEM_SUBTITLE", oResourceBundle, [sRowSubtitleValue, oColumnInfo.sColumnValue]);
          } else if (sRowSubtitleValue && oColumnInfo.sColumnIndicator === "undefined") {
            sMessageSubtitle = "".concat(oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_ROW"), ": ").concat(sRowSubtitleValue);
          } else if (!sRowSubtitleValue && sTableTargetColName) {
            sMessageSubtitle = oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_COLUMN") + ": " + sTableTargetColName;
          } else if (!sRowSubtitleValue && oColumnInfo.sColumnIndicator === "Hidden") {
            sMessageSubtitle = oColumnInfo.sColumnValue;
          } else {
            sMessageSubtitle = null;
          }
        } else {
          sMessageSubtitle = null;
        }
      }

      return sMessageSubtitle;
    };

    _proto._determineColumnInfo = function _determineColumnInfo(oColFromTableSettings, oResourceBundle) {
      var oColumnInfo = {
        sColumnIndicator: String,
        sColumnValue: String
      };

      if (oColFromTableSettings) {
        // if column is neither in table definition nor personalization, show only row subtitle text
        if (oColFromTableSettings.availability === "Hidden") {
          oColumnInfo.sColumnValue = undefined;
          oColumnInfo.sColumnIndicator = "undefined";
        } else {
          //if column is in table personalization but not in table definition, show Column (Hidden) : <colName>
          oColumnInfo.sColumnValue = "".concat(oResourceBundle.getText("T_MESSAGE_GROUP_DESCRIPTION_TABLE_COLUMN"), " (").concat(oResourceBundle.getText("T_COLUMN_INDICATOR_IN_TABLE_DEFINITION"), "): ").concat(oColFromTableSettings.label);
          oColumnInfo.sColumnIndicator = "Hidden";
        }
      } else {
        oColumnInfo.sColumnValue = oResourceBundle.getText("T_MESSAGE_ITEM_SUBTITLE_INDICATOR_UNKNOWN");
        oColumnInfo.sColumnIndicator = "Unknown";
      }

      return oColumnInfo;
    };

    _proto.setFocusToControl = function setFocusToControl(control) {
      var messagePopover = this.oMessagePopover;

      if (messagePopover && control && control.focus) {
        var fnFocus = function () {
          control.focus();
        };

        if (!messagePopover.isOpen()) {
          // when navigating to parent page to child page (on click of message), the child page might have a focus logic that might use a timeout.
          // we use the below timeouts to override this focus so that we focus on the target control of the message in the child page.
          setTimeout(fnFocus, 0);
        } else {
          var fnOnClose = function () {
            setTimeout(fnFocus, 0);
            messagePopover.detachEvent("afterClose", fnOnClose);
          };

          messagePopover.attachEvent("afterClose", fnOnClose);
          messagePopover.close();
        }
      } else {
        Log.warning("FE V4 : MessageButton : element doesn't have focus method for focusing.");
      }
    };

    return MessageButton;
  }(Button), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "customFilters", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "messageChange", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return MessageButton;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiTWVzc2FnZUJ1dHRvbiIsImRlZmluZVVJNUNsYXNzIiwiYWdncmVnYXRpb24iLCJ0eXBlIiwibXVsdGlwbGUiLCJzaW5ndWxhck5hbWUiLCJldmVudCIsInNMYXN0QWN0aW9uVGV4dCIsInNHZW5lcmFsR3JvdXBUZXh0Iiwic1ZpZXdJZCIsImluaXQiLCJCdXR0b24iLCJwcm90b3R5cGUiLCJhcHBseSIsImF0dGFjaFByZXNzIiwiaGFuZGxlTWVzc2FnZVBvcG92ZXJQcmVzcyIsIm9NZXNzYWdlUG9wb3ZlciIsIk1lc3NhZ2VQb3BvdmVyIiwib0l0ZW1CaW5kaW5nIiwiZ2V0QmluZGluZyIsImF0dGFjaENoYW5nZSIsIl9zZXRNZXNzYWdlRGF0YSIsIm1lc3NhZ2VCdXR0b25JZCIsImdldElkIiwiYWRkQ3VzdG9tRGF0YSIsInNhcCIsInVpIiwiY29yZSIsIkN1c3RvbURhdGEiLCJrZXkiLCJ2YWx1ZSIsImF0dGFjaE1vZGVsQ29udGV4dENoYW5nZSIsIl9hcHBseUZpbHRlcnNBbmRTb3J0IiwiYmluZCIsImF0dGFjaEFjdGl2ZVRpdGxlUHJlc3MiLCJfYWN0aXZlVGl0bGVQcmVzcyIsIm9FdmVudCIsInRvZ2dsZSIsImdldFNvdXJjZSIsIl9hcHBseUdyb3VwaW5nQXN5bmMiLCJvVmlldyIsImFXYWl0Rm9yRGF0YSIsIm9WaWV3QmluZGluZ0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsIl9maW5kVGFibGVzUmVsYXRlZFRvTWVzc2FnZXMiLCJ2aWV3Iiwib1JlcyIsImFNZXNzYWdlcyIsImdldENvbnRleHRzIiwibWFwIiwib0NvbnRleHQiLCJnZXRPYmplY3QiLCJvVmlld0NvbnRleHQiLCJvT2JqZWN0UGFnZSIsImdldENvbnRlbnQiLCJnZXRWaXNpYmxlU2VjdGlvbnNGcm9tT2JqZWN0UGFnZUxheW91dCIsImZvckVhY2giLCJvU2VjdGlvbiIsImdldFN1YlNlY3Rpb25zIiwib1N1YlNlY3Rpb24iLCJmaW5kRWxlbWVudHMiLCJvRWxlbSIsImlzQSIsImkiLCJsZW5ndGgiLCJvUm93QmluZGluZyIsImdldFJvd0JpbmRpbmciLCJzRWxlbWVCaW5kaW5nUGF0aCIsImdldFBhdGgiLCJ0YXJnZXQiLCJpbmRleE9mIiwicHVzaCIsInRhYmxlIiwic3Vic2VjdGlvbiIsIm9UYWJsZXMiLCJfb1RhYmxlIiwib01EQ1RhYmxlIiwib1N1YnNlY3Rpb24iLCJzZXRCaW5kaW5nQ29udGV4dCIsImlzTGVuZ3RoRmluYWwiLCJQcm9taXNlIiwicmVzb2x2ZSIsImF0dGFjaEV2ZW50T25jZSIsIndhaXRGb3JHcm91cGluZ0FwcGxpZWQiLCJzZXRUaW1lb3V0IiwiX2FwcGx5R3JvdXBpbmciLCJhbGwiLCJnZXRNb2RlbCIsImNoZWNrTWVzc2FnZXMiLCJMb2ciLCJlcnJvciIsIm9PYmplY3RQYWdlTGF5b3V0IiwiZ2V0U2VjdGlvbnMiLCJmaWx0ZXIiLCJnZXRWaXNpYmxlIiwiX2dldE9iamVjdFBhZ2VMYXlvdXQiLCJnZXRJdGVtcyIsImFTZWN0aW9ucyIsImJFbmFibGVCaW5kaW5nIiwiX2NoZWNrQ29udHJvbElkSW5TZWN0aW9ucyIsIl9mbkVuYWJsZUJpbmRpbmdzIiwiX2dldFRhYmxlUmVmRXJyb3JDb250ZXh0Iiwib1RhYmxlIiwib01vZGVsIiwiZ2V0UHJvcGVydHkiLCJzZXRQcm9wZXJ0eSIsInNSZWZFcnJvckNvbnRleHRQYXRoIiwicmVwbGFjZSIsImdldENvbnRleHQiLCJfdXBkYXRlSW50ZXJuYWxNb2RlbCIsIm9UYWJsZVJvd0NvbnRleHQiLCJpUm93SW5kZXgiLCJzVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSIsIm9NZXNzYWdlT2JqZWN0IiwiYklzQ3JlYXRpb25Sb3ciLCJvVGVtcCIsInJvd0luZGV4IiwidGFyZ2V0Q29sUHJvcGVydHkiLCJhVmFsaWRNZXNzYWdlSWRzIiwiZ2V0Q29yZSIsImdldE1lc3NhZ2VNYW5hZ2VyIiwiZ2V0TWVzc2FnZU1vZGVsIiwiZ2V0RGF0YSIsIm1lc3NhZ2UiLCJpZCIsImFPYnNvbGV0ZU1lc3NhZ2VsSWRzIiwiT2JqZWN0Iiwia2V5cyIsImludGVybmFsTWVzc2FnZUlkIiwib2Jzb2xldGVJZCIsImFzc2lnbiIsIl9nZXRDb250cm9sRnJvbU1lc3NhZ2VSZWxhdGluZ1RvU3ViU2VjdGlvbiIsInN1YlNlY3Rpb24iLCJfZm5GaWx0ZXJVcG9uSWRzIiwiZ2V0Q29udHJvbElkcyIsInNvcnQiLCJhIiwiYiIsIl9zZXRHcm91cExhYmVsRm9yVHJhbnNpZW50TXNnIiwic0FjdGlvbk5hbWUiLCJDb3JlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiZ2V0VGV4dCIsInNldEdyb3VwTmFtZSIsIl9jb21wdXRlTWVzc2FnZUdyb3VwQW5kU3ViVGl0bGUiLCJzZWN0aW9uIiwiYUVsZW1lbnRzIiwiYk11bHRpcGxlU3ViU2VjdGlvbnMiLCJkZXRhY2hDaGFuZ2UiLCJvRWxlbWVudCIsIm9UYXJnZXRUYWJsZUluZm8iLCJsIiwib1RhcmdldGVkQ29udHJvbCIsInNNZXNzYWdlU3VidGl0bGUiLCJiSXNCYWNrZW5kTWVzc2FnZSIsIlJlZ0V4cCIsInRlc3QiLCJnZXRUYXJnZXRzIiwib1Jlc291cmNlQnVuZGxlIiwiZ2V0UGFyZW50IiwidGFibGVIZWFkZXIiLCJnZXRIZWFkZXIiLCJfZ2V0VGFibGVDb2xQcm9wZXJ0eSIsIm9UYWJsZUNvbEluZm8iLCJfZ2V0VGFibGVDb2xJbmZvIiwib1RhYmxlUm93QmluZGluZ0NvbnRleHRzIiwiZ2V0Q3VycmVudENvbnRleHRzIiwic1RhYmxlVGFyZ2V0Q29sTmFtZSIsInNUYWJsZVRhcmdldFByb3BlcnR5IiwiZmluZCIsIm1lc3NhZ2VPYmplY3QiLCJyb3dDb250ZXh0Iiwic0NvbnRyb2xJZCIsInNJZCIsIl9Jc0NvbnRyb2xJblRhYmxlIiwib0NvbnRyb2wiLCJieUlkIiwiX0lzQ29udHJvbFBhcnRPZkNyZWF0aW9uUm93IiwiX2dldE1lc3NhZ2VTdWJ0aXRsZSIsInNldFN1YnRpdGxlIiwic2V0QWN0aXZlVGl0bGUiLCJfZm9ybWF0TWVzc2FnZURlc2NyaXB0aW9uIiwiZ2V0SW5kZXgiLCJiSXNUYXJnZXRlZENvbnRyb2xPcnBoYW4iLCJfYklzT3JwaGFuRWxlbWVudCIsIl9nZXRNZGNUYWJsZSIsImlUYXJnZXRDb2x1bW5JbmRleCIsIl9nZXRUYWJsZUNvbHVtbkluZGV4IiwiZ2V0Q29sdW1ucyIsImdldERhdGFQcm9wZXJ0eSIsInVuZGVmaW5lZCIsIl9nZXRUYWJsZVJvdyIsIl9nZXRUYWJsZVJvd0luZGV4IiwiZ2V0VmFsdWVTdGF0ZSIsImdldFBlcnNpc3RlbnQiLCJnZXRUaXRsZSIsIl9nZXRWaWV3SWQiLCJvTWVzc2FnZVRhcmdldFByb3BlcnR5Iiwic3BsaXQiLCJwb3AiLCJvVUlNb2RlbCIsImZpcmVBY3RpdmVUaXRsZVByZXNzIiwiYVN1YlNlY3Rpb25zIiwiaiIsImsiLCJhVmlzaWJsZVNlY3Rpb25zIiwidmlld0lkIiwiYklzR2VuZXJhbEdyb3VwTmFtZSIsImFDb250cm9scyIsInBlcnNpc3RlbnQiLCJnZXRHcm91cE5hbWUiLCJfZmluZFRhcmdldEZvck1lc3NhZ2UiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwiY29udGV4dFBhdGgiLCJnZXRNZXRhUGF0aCIsIm9Db250ZXh0UGF0aE1ldGFkYXRhIiwiJGtpbmQiLCJVcmlQYXJhbWV0ZXJzIiwiZnJvbVF1ZXJ5Iiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJnZXQiLCJpU2VjdGlvbiIsIm5vblRhYmxlQ2hhcnRjb250cm9sRm91bmQiLCJpU3ViU2VjdGlvbiIsIm9BbGxCbG9ja3MiLCJnZXRCbG9ja3MiLCJibG9jayIsIl9maW5kTWVzc2FnZUdyb3VwQWZ0ZXJSZWJpbmRpbmciLCJhdHRhY2hEYXRhUmVjZWl2ZWQiLCJWaWV3IiwiX3NldExvbmd0ZXh0VXJsRGVzY3JpcHRpb24iLCJzTWVzc2FnZURlc2NyaXB0aW9uQ29udGVudCIsIm9EaWFnbm9zaXNUaXRsZSIsInNldEFzeW5jRGVzY3JpcHRpb25IYW5kbGVyIiwiY29uZmlnIiwic09sZERlc2NyaXB0aW9uIiwic0xvbmdUZXh0VXJsIiwiaXRlbSIsImdldExvbmd0ZXh0VXJsIiwialF1ZXJ5IiwiYWpheCIsInVybCIsInN1Y2Nlc3MiLCJkYXRhIiwic0RpYWdub3Npc1RleHQiLCJnZXRIdG1sVGV4dCIsInNldERlc2NyaXB0aW9uIiwicHJvbWlzZSIsInNFcnJvciIsInJlamVjdCIsInNUYWJsZUZpcnN0Q29sUHJvcGVydHkiLCJnZXRJZGVudGlmaWVyQ29sdW1uIiwic0NvbHVtbkluZm8iLCJvQ29sRnJvbVRhYmxlU2V0dGluZ3MiLCJfZmV0Y2hDb2x1bW5JbmZvIiwiYXZhaWxhYmlsaXR5IiwiZ2V0VHlwZSIsImdldFZhbHVlIiwiX25hdmlnYXRpb25Db25maWd1cmVkIiwibGFiZWwiLCJvRmllbGRzQWZmZWN0ZWRUaXRsZSIsIkZvcm1hdHRlZFRleHQiLCJodG1sVGV4dCIsInNGaWVsZEFmZmVjdGVkVGV4dCIsInNVSU1lc3NhZ2VEZXNjcmlwdGlvbiIsImRlc2NyaXB0aW9uIiwiY2xlYXJUaW1lb3V0IiwiX3NldE1lc3NhZ2VEYXRhVGltZW91dCIsInNJY29uIiwib01lc3NhZ2VzIiwib01lc3NhZ2VDb3VudCIsIkVycm9yIiwiV2FybmluZyIsIlN1Y2Nlc3MiLCJJbmZvcm1hdGlvbiIsImlNZXNzYWdlTGVuZ3RoIiwic0J1dHRvblR5cGUiLCJCdXR0b25UeXBlIiwiRGVmYXVsdCIsInNNZXNzYWdlS2V5Iiwic1Rvb2x0aXBUZXh0Iiwic01lc3NhZ2VUZXh0IiwibmF2aWdhdGVCYWNrIiwiTWVzc2FnZVR5cGUiLCJOZWdhdGl2ZSIsIkNyaXRpY2FsIiwiTmV1dHJhbCIsInNldFRleHQiLCJzZXRUb29sdGlwIiwic2V0SWNvbiIsInNldFR5cGUiLCJzZXRWaXNpYmxlIiwiZmlyZU1lc3NhZ2VDaGFuZ2UiLCJvUGFnZVJlYWR5IiwiZ2V0Q29udHJvbGxlciIsInBhZ2VSZWFkeSIsIndhaXRQYWdlUmVhZHkiLCJzb21lIiwib09ycGhhbkVsZW1lbnQiLCJvUGFyZW50RWxlbWVudCIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsIm9JdGVtIiwiZ2V0UGFyYW1ldGVyIiwib01lc3NhZ2UiLCJnZXRUYXJnZXQiLCJzU2VjdGlvblRpdGxlIiwiX2RlZmF1bHRGb2N1cyIsIm1kY1RhYmxlIiwiZm9jdXNJbmZvIiwicHJldmVudFNjcm9sbCIsInRhcmdldEluZm8iLCJmb2N1cyIsIm9UYXJnZXRNZGNUYWJsZSIsImNvbnRyb2xJZHMiLCJjb250cm9sIiwib1BhcmVudENvbnRyb2wiLCJyZWR1Y2UiLCJhY2MiLCJ2YWwiLCJfbmF2aWdhdGVGcm9tTWVzc2FnZVRvU2VjdGlvblRhYmxlSW5JY29uVGFiQmFyTW9kZSIsIm9SZWZFcnJvckNvbnRleHQiLCJvUmVmRXJyb3IiLCJfc2V0Rm9jdXNPblRhcmdldEZpZWxkIiwidGFyZ2V0TWRjVGFibGUiLCJhVGFyZ2V0TWRjVGFibGVSb3ciLCJfZ2V0TWRjVGFibGVSb3dzIiwiaUZpcnN0VmlzaWJsZVJvdyIsIl9nZXRHcmlkVGFibGUiLCJnZXRGaXJzdFZpc2libGVSb3ciLCJvVGFyZ2V0Um93Iiwib1RhcmdldENlbGwiLCJnZXRUYXJnZXRDZWxsIiwic2V0Rm9jdXNUb0NvbnRyb2wiLCJlcnJvclByb3BlcnR5IiwiX3JvdXRpbmciLCJuYXZpZ2F0ZUZvcndhcmRUb0NvbnRleHQiLCJzY3JvbGxUb0luZGV4IiwiaU5ld0ZpcnN0VmlzaWJsZVJvdyIsImJTY3JvbGxOZWVkZWQiLCJvV2FpdENvbnRyb2xJZEFkZGVkIiwiYXR0YWNoRXZlbnQiLCJmb2N1c09uVGFyZ2V0RmllbGQiLCJmb2N1c09uTWVzc2FnZVRhcmdldENvbnRyb2wiLCJvU2VsZWN0ZWRTZWN0aW9uIiwiZ2V0U2VsZWN0ZWRTZWN0aW9uIiwiX25hdmlnYXRlRnJvbU1lc3NhZ2VUb1NlY3Rpb25Jbkljb25UYWJCYXJNb2RlIiwidGFyZ2V0Um93IiwiY29udHJvbElkIiwiaXNDb250cm9sSW5UYWJsZSIsImVsZW0iLCJhQWxsVmlld0VsZW1lbnRzIiwiYUVycm9uZW91c0NvbnRyb2xzIiwiZ2V0RG9tUmVmIiwiYU5vdFRhYmxlRXJyb25lb3VzQ29udHJvbHMiLCJDb2x1bW5MaXN0SXRlbSIsImdldE1ldGFkYXRhIiwiZ2V0TmFtZSIsIm9UYXJnZXRGaWVsZCIsImdldENvbnRlbnRFZGl0Iiwib1RhYmxlVGFyZ2V0Q29sIiwidGFnZXRDb2x1bW5Qcm9wZXJ0eSIsImNvbHVtbiIsIm9DdXN0b21Db2x1bW4iLCJnZXRDb250cm9sRGVsZWdhdGUiLCJnZXRDb2x1bW5zRm9yIiwib0NvbHVtbiIsInRlbXBsYXRlIiwicHJvcGVydHlJbmZvcyIsIm5hbWUiLCJhQ29sdW1ucyIsImFUYWJsZUNvbHVtbnMiLCJ0YXJnZXRDb2x1bW5Qcm9wZXJ0eSIsInRhYmxlQ29sdW1uIiwicmVsYXRpdmVQYXRoIiwiYklzVGFibGVUYXJnZXRDb2xWaXNpYmxlIiwiX2dldE1lc3NhZ2VSYW5rIiwib2JqIiwiYUFsbEVsZW1lbnRzIiwic2VjdGlvblJhbmsiLCJfZm5GaWx0ZXJVcG9uSWQiLCJnZXRDb250cm9sSWQiLCJzZWN0aW9uTmFtZSIsInN1YlNlY3Rpb25OYW1lIiwib1ZhbGlkYXRpb25GaWx0ZXJzIiwib1ZhbGlkYXRpb25BbmRDb250ZXh0RmlsdGVyIiwib0ZpbHRlcnMiLCJzUGF0aCIsIm9Tb3J0ZXIiLCJvRGlhbG9nRmlsdGVyIiwib2JqZWN0UGFnZUxheW91dFNlY3Rpb25zIiwiYVVzZXJEZWZpbmVkRmlsdGVyIiwiZmlsdGVyT3V0TWVzc2FnZXNJbkRpYWxvZyIsImZuVGVzdCIsImFDb250cm9sSWRzIiwiaW5kZXgiLCJJbmZpbml0eSIsImVycm9yRmllbGRDb250cm9sIiwiZmllbGRSYW5raW5EaWFsb2ciLCJEaWFsb2ciLCJGaWx0ZXIiLCJwYXRoIiwiY2FzZVNlbnNpdGl2ZSIsImdldENoZWNrQ29udHJvbEluVmlld0ZpbHRlciIsImFDdXN0b21GaWx0ZXJzIiwiZ2V0QWdncmVnYXRpb24iLCJvcGVyYXRvciIsInZhbHVlMSIsInZhbHVlMiIsIm9CaW5kaW5nQ29udGV4dCIsImZpbHRlcnMiLCJGaWx0ZXJPcGVyYXRvciIsIkVRIiwiYW5kIiwiU3RhcnRzV2l0aCIsIm9WYWxpZGF0aW9uQ29udGV4dERpYWxvZ0ZpbHRlcnMiLCJTb3J0ZXIiLCJvYmoxIiwib2JqMiIsInJhbmtBIiwicmFua0IiLCJfZ2V0U2VjdGlvbkJ5U2VjdGlvblRpdGxlIiwiYlVzZUljb25UYWJCYXIiLCJnZXRVc2VJY29uVGFiQmFyIiwic1NlbGVjdGVkU2VjdGlvbklkIiwic2V0U2VsZWN0ZWRTZWN0aW9uIiwib1RhYmxlQ29udGV4dCIsIm9PUENvbnRleHQiLCJiU2hvdWxkV2FpdEZvclRhYmxlUmVmcmVzaCIsIm9NZGNUYWJsZSIsIm9UYWJsZVJvdyIsImdldFRhYmxlIiwiZmluZEluZGV4IiwiZWxlbWVudCIsImdldFRhcmdldENlbGxJbmRleCIsImdldENlbGxzIiwib0NlbGwiLCJnZXRUYXJnZXRDb2x1bW5JbmRleCIsIm9UYXJnZXRFbGVtZW50IiwiaVRhcmdldENlbGxJbmRleCIsInNUYXJnZXRDZWxsSWQiLCJnZXRDcmVhdGlvblRlbXBsYXRlIiwiZm5SZWdFeHBlc2NhcGUiLCJzIiwiX2dldEN1c3RvbUNvbHVtbkluZm8iLCJpUG9zaXRpb24iLCJzVGFibGVDb2xQcm9wZXJ0eSIsIl9nZXRUYWJsZUZpcnN0Q29sUHJvcGVydHkiLCJvQ3VzdG9tQ29sdW1uSW5mbyIsIl9nZXRUYWJsZUZpcnN0Q29sQmluZGluZ0NvbnRleHRGb3JUZXh0QW5ub3RhdGlvbiIsInNNZXRhUGF0aCIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwiX2dldFRhYmxlRmlyc3RDb2xWYWx1ZSIsInNUZXh0QW5ub3RhdGlvblBhdGgiLCJzVGV4dEFycmFuZ2VtZW50Iiwic0NvZGVWYWx1ZSIsInNUZXh0VmFsdWUiLCJzQ29tcHV0ZWRWYWx1ZSIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJjb25jYXQiLCJzRW51bU51bWJlciIsInNDb2xOYW1lRnJvbU1lc3NhZ2VPYmoiLCJnZXRUYWJsZURlZmluaXRpb24iLCJjb2x1bW5zIiwiY29tcG9uZW50IiwicmVxdWlyZSIsIm5hdk9iamVjdCIsImdldE93bmVyQ29tcG9uZW50Rm9yIiwiZ2V0TmF2aWdhdGlvbiIsInN1Yk9QQ29uZmlndXJlZCIsIm5hdkNvbmZpZ3VyZWQiLCJkZXRhaWwiLCJyb3V0ZSIsImdldFJvd1NldHRpbmdzIiwiZ2V0Um93QWN0aW9ucyIsIm1Qcm9wZXJ0aWVzIiwic1Jvd1N1YnRpdGxlVmFsdWUiLCJDb21tb25VdGlscyIsImdldFRyYW5zbGF0ZWRUZXh0Iiwib1RhYmxlRmlyc3RDb2xCaW5kaW5nQ29udGV4dFRleHRBbm5vdGF0aW9uIiwic1RhYmxlRmlyc3RDb2xUZXh0QW5ub3RhdGlvblBhdGgiLCJzVGFibGVGaXJzdENvbFRleHRBcnJhbmdlbWVudCIsIm9Db2x1bW5JbmZvIiwiX2RldGVybWluZUNvbHVtbkluZm8iLCJzQ29sdW1uSW5kaWNhdG9yIiwic0NvbHVtblZhbHVlIiwiU3RyaW5nIiwibWVzc2FnZVBvcG92ZXIiLCJmbkZvY3VzIiwiaXNPcGVuIiwiZm5PbkNsb3NlIiwiZGV0YWNoRXZlbnQiLCJjbG9zZSIsIndhcm5pbmciXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIk1lc3NhZ2VCdXR0b24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBVcmlQYXJhbWV0ZXJzIGZyb20gXCJzYXAvYmFzZS91dGlsL1VyaVBhcmFtZXRlcnNcIjtcbmltcG9ydCB0eXBlIE1lc3NhZ2VGaWx0ZXIgZnJvbSBcInNhcC9mZS9jb21tb24vTWVzc2FnZUZpbHRlclwiO1xuaW1wb3J0IE1lc3NhZ2VQb3BvdmVyIGZyb20gXCJzYXAvZmUvY29tbW9uL01lc3NhZ2VQb3BvdmVyXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgeyBhZ2dyZWdhdGlvbiwgZGVmaW5lVUk1Q2xhc3MsIGV2ZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5pbXBvcnQgdHlwZSBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBUYWJsZUFQSSBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9UYWJsZUFQSVwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwic2FwL20vQnV0dG9uXCI7XG5pbXBvcnQgQ29sdW1uTGlzdEl0ZW0gZnJvbSBcInNhcC9tL0NvbHVtbkxpc3RJdGVtXCI7XG5pbXBvcnQgRGlhbG9nIGZyb20gXCJzYXAvbS9EaWFsb2dcIjtcbmltcG9ydCBGb3JtYXR0ZWRUZXh0IGZyb20gXCJzYXAvbS9Gb3JtYXR0ZWRUZXh0XCI7XG5pbXBvcnQgeyBCdXR0b25UeXBlIH0gZnJvbSBcInNhcC9tL2xpYnJhcnlcIjtcbmltcG9ydCBNZXNzYWdlSXRlbSBmcm9tIFwic2FwL20vTWVzc2FnZUl0ZW1cIjtcbmltcG9ydCB0eXBlIENvcmVFdmVudCBmcm9tIFwic2FwL3VpL2Jhc2UvRXZlbnRcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgdHlwZSBVSTVFbGVtZW50IGZyb20gXCJzYXAvdWkvY29yZS9FbGVtZW50XCI7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJzYXAvdWkvY29yZS9saWJyYXJ5XCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwic2FwL3VpL2NvcmUvbWVzc2FnZS9NZXNzYWdlXCI7XG5pbXBvcnQgVmlldyBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL1ZpZXdcIjtcbmltcG9ydCBNZGNUYWJsZSBmcm9tIFwic2FwL3VpL21kYy9UYWJsZVwiO1xuaW1wb3J0IEZpbHRlciBmcm9tIFwic2FwL3VpL21vZGVsL0ZpbHRlclwiO1xuaW1wb3J0IEZpbHRlck9wZXJhdG9yIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyT3BlcmF0b3JcIjtcbmltcG9ydCB0eXBlIEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L0NvbnRleHRcIjtcbmltcG9ydCBTb3J0ZXIgZnJvbSBcInNhcC91aS9tb2RlbC9Tb3J0ZXJcIjtcbmltcG9ydCBPYmplY3RQYWdlU2VjdGlvbiBmcm9tIFwic2FwL3V4YXAvT2JqZWN0UGFnZVNlY3Rpb25cIjtcbmltcG9ydCBPYmplY3RQYWdlU3ViU2VjdGlvbiBmcm9tIFwic2FwL3V4YXAvT2JqZWN0UGFnZVN1YlNlY3Rpb25cIjtcblxuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLmNvbW1vbi5NZXNzYWdlQnV0dG9uXCIpXG5jbGFzcyBNZXNzYWdlQnV0dG9uIGV4dGVuZHMgQnV0dG9uIHtcblx0QGFnZ3JlZ2F0aW9uKHsgdHlwZTogXCJzYXAuZmUuY29tbW9uLk1lc3NhZ2VGaWx0ZXJcIiwgbXVsdGlwbGU6IHRydWUsIHNpbmd1bGFyTmFtZTogXCJjdXN0b21GaWx0ZXJcIiB9KVxuXHRjdXN0b21GaWx0ZXJzITogTWVzc2FnZUZpbHRlcjtcblxuXHRAZXZlbnQoKVxuXHRtZXNzYWdlQ2hhbmdlITogRnVuY3Rpb247XG5cblx0cHJpdmF0ZSBvTWVzc2FnZVBvcG92ZXI6IGFueTtcblx0cHJpdmF0ZSBvSXRlbUJpbmRpbmc6IGFueTtcblx0cHJpdmF0ZSBvT2JqZWN0UGFnZUxheW91dDogYW55O1xuXHRwcml2YXRlIHNMYXN0QWN0aW9uVGV4dCA9IFwiXCI7XG5cdHByaXZhdGUgc0dlbmVyYWxHcm91cFRleHQgPSBcIlwiO1xuXHRwcml2YXRlIF9zZXRNZXNzYWdlRGF0YVRpbWVvdXQ6IGFueTtcblx0cHJpdmF0ZSBzVmlld0lkID0gXCJcIjtcblxuXHRpbml0KCkge1xuXHRcdEJ1dHRvbi5wcm90b3R5cGUuaW5pdC5hcHBseSh0aGlzKTtcblx0XHQvL3ByZXNzIGV2ZW50IGhhbmRsZXIgYXR0YWNoZWQgdG8gb3BlbiB0aGUgbWVzc2FnZSBwb3BvdmVyXG5cdFx0dGhpcy5hdHRhY2hQcmVzcyh0aGlzLmhhbmRsZU1lc3NhZ2VQb3BvdmVyUHJlc3MsIHRoaXMpO1xuXHRcdHRoaXMub01lc3NhZ2VQb3BvdmVyID0gbmV3IE1lc3NhZ2VQb3BvdmVyKCk7XG5cdFx0dGhpcy5vSXRlbUJpbmRpbmcgPSB0aGlzLm9NZXNzYWdlUG9wb3Zlci5nZXRCaW5kaW5nKFwiaXRlbXNcIik7XG5cdFx0dGhpcy5vSXRlbUJpbmRpbmcuYXR0YWNoQ2hhbmdlKHRoaXMuX3NldE1lc3NhZ2VEYXRhLCB0aGlzKTtcblx0XHRjb25zdCBtZXNzYWdlQnV0dG9uSWQgPSB0aGlzLmdldElkKCk7XG5cdFx0aWYgKG1lc3NhZ2VCdXR0b25JZCkge1xuXHRcdFx0dGhpcy5vTWVzc2FnZVBvcG92ZXIuYWRkQ3VzdG9tRGF0YShuZXcgKHNhcCBhcyBhbnkpLnVpLmNvcmUuQ3VzdG9tRGF0YSh7IGtleTogXCJtZXNzYWdlQnV0dG9uSWRcIiwgdmFsdWU6IG1lc3NhZ2VCdXR0b25JZCB9KSk7IC8vIFRPRE8gY2hlY2sgZm9yIGN1c3RvbSBkYXRhIHR5cGVcblx0XHR9XG5cdFx0dGhpcy5hdHRhY2hNb2RlbENvbnRleHRDaGFuZ2UodGhpcy5fYXBwbHlGaWx0ZXJzQW5kU29ydC5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm9NZXNzYWdlUG9wb3Zlci5hdHRhY2hBY3RpdmVUaXRsZVByZXNzKHRoaXMuX2FjdGl2ZVRpdGxlUHJlc3MuYmluZCh0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCB3aGVuIGEgdXNlciBjbGlja3Mgb24gdGhlIE1lc3NhZ2VCdXR0b24gY29udHJvbC5cblx0ICpcblx0ICogQHBhcmFtIG9FdmVudCBFdmVudCBvYmplY3Rcblx0ICovXG5cdGhhbmRsZU1lc3NhZ2VQb3BvdmVyUHJlc3Mob0V2ZW50OiBDb3JlRXZlbnQpIHtcblx0XHR0aGlzLm9NZXNzYWdlUG9wb3Zlci50b2dnbGUob0V2ZW50LmdldFNvdXJjZSgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgZ3JvdXBzIHRoZSBtZXNzYWdlcyBiYXNlZCBvbiB0aGUgc2VjdGlvbiBvciBzdWJzZWN0aW9uIHRoZXkgYmVsb25nIHRvLlxuXHQgKiBUaGlzIG1ldGhvZCBmb3JjZSB0aGUgbG9hZGluZyBvZiBjb250ZXh0cyBmb3IgYWxsIHRhYmxlcyBiZWZvcmUgdG8gYXBwbHkgdGhlIGdyb3VwaW5nLlxuXHQgKlxuXHQgKiBAcGFyYW0gb1ZpZXcgQ3VycmVudCB2aWV3LlxuXHQgKiBAcmV0dXJucyBSZXR1cm4gcHJvbWlzZS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGFzeW5jIF9hcHBseUdyb3VwaW5nQXN5bmMob1ZpZXc6IFZpZXcpIHtcblx0XHRjb25zdCBhV2FpdEZvckRhdGE6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xuXHRcdGNvbnN0IG9WaWV3QmluZGluZ0NvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGNvbnN0IF9maW5kVGFibGVzUmVsYXRlZFRvTWVzc2FnZXMgPSAodmlldzogVmlldykgPT4ge1xuXHRcdFx0Y29uc3Qgb1JlczogYW55W10gPSBbXTtcblx0XHRcdGNvbnN0IGFNZXNzYWdlcyA9IHRoaXMub0l0ZW1CaW5kaW5nLmdldENvbnRleHRzKCkubWFwKGZ1bmN0aW9uIChvQ29udGV4dDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvQ29udGV4dC5nZXRPYmplY3QoKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3Qgb1ZpZXdDb250ZXh0ID0gdmlldy5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdFx0aWYgKG9WaWV3Q29udGV4dCkge1xuXHRcdFx0XHRjb25zdCBvT2JqZWN0UGFnZSA9IHZpZXcuZ2V0Q29udGVudCgpWzBdO1xuXHRcdFx0XHR0aGlzLmdldFZpc2libGVTZWN0aW9uc0Zyb21PYmplY3RQYWdlTGF5b3V0KG9PYmplY3RQYWdlKS5mb3JFYWNoKGZ1bmN0aW9uIChvU2VjdGlvbjogYW55KSB7XG5cdFx0XHRcdFx0b1NlY3Rpb24uZ2V0U3ViU2VjdGlvbnMoKS5mb3JFYWNoKGZ1bmN0aW9uIChvU3ViU2VjdGlvbjogYW55KSB7XG5cdFx0XHRcdFx0XHRvU3ViU2VjdGlvbi5maW5kRWxlbWVudHModHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAob0VsZW06IGFueSkge1xuXHRcdFx0XHRcdFx0XHRpZiAob0VsZW0uaXNBKFwic2FwLnVpLm1kYy5UYWJsZVwiKSkge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYU1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBvUm93QmluZGluZyA9IG9FbGVtLmdldFJvd0JpbmRpbmcoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvUm93QmluZGluZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzRWxlbWVCaW5kaW5nUGF0aCA9IGAke29WaWV3Q29udGV4dC5nZXRQYXRoKCl9LyR7b0VsZW0uZ2V0Um93QmluZGluZygpLmdldFBhdGgoKX1gO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYU1lc3NhZ2VzW2ldLnRhcmdldC5pbmRleE9mKHNFbGVtZUJpbmRpbmdQYXRoKSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9SZXMucHVzaCh7IHRhYmxlOiBvRWxlbSwgc3Vic2VjdGlvbjogb1N1YlNlY3Rpb24gfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvUmVzO1xuXHRcdH07XG5cdFx0Ly8gU2VhcmNoIGZvciB0YWJsZSByZWxhdGVkIHRvIE1lc3NhZ2VzIGFuZCBpbml0aWFsaXplIHRoZSBiaW5kaW5nIGNvbnRleHQgb2YgdGhlIHBhcmVudCBzdWJzZWN0aW9uIHRvIHJldHJpZXZlIHRoZSBkYXRhXG5cdFx0Y29uc3Qgb1RhYmxlcyA9IF9maW5kVGFibGVzUmVsYXRlZFRvTWVzc2FnZXMuYmluZCh0aGlzKShvVmlldyk7XG5cdFx0b1RhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uIChfb1RhYmxlKSB7XG5cdFx0XHRjb25zdCBvTURDVGFibGUgPSBfb1RhYmxlLnRhYmxlLFxuXHRcdFx0XHRvU3Vic2VjdGlvbiA9IF9vVGFibGUuc3Vic2VjdGlvbjtcblx0XHRcdGlmICghb01EQ1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KCkgfHwgb01EQ1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KCk/LmdldFBhdGgoKSAhPT0gb1ZpZXdCaW5kaW5nQ29udGV4dD8uZ2V0UGF0aCgpKSB7XG5cdFx0XHRcdG9TdWJzZWN0aW9uLnNldEJpbmRpbmdDb250ZXh0KG9WaWV3QmluZGluZ0NvbnRleHQpO1xuXHRcdFx0XHRpZiAoIW9NRENUYWJsZS5nZXRSb3dCaW5kaW5nKCkuaXNMZW5ndGhGaW5hbCgpKSB7XG5cdFx0XHRcdFx0YVdhaXRGb3JEYXRhLnB1c2goXG5cdFx0XHRcdFx0XHRuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogRnVuY3Rpb24pIHtcblx0XHRcdFx0XHRcdFx0b01EQ1RhYmxlLmdldFJvd0JpbmRpbmcoKS5hdHRhY2hFdmVudE9uY2UoXCJkYXRhUmVjZWl2ZWRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCB3YWl0Rm9yR3JvdXBpbmdBcHBsaWVkID0gbmV3IFByb21pc2UoKHJlc29sdmU6IEZ1bmN0aW9uKSA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0dGhpcy5fYXBwbHlHcm91cGluZygpO1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9LCAwKTtcblx0XHR9KTtcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoYVdhaXRGb3JEYXRhKTtcblx0XHRcdG9WaWV3LmdldE1vZGVsKCkuY2hlY2tNZXNzYWdlcygpO1xuXHRcdFx0YXdhaXQgd2FpdEZvckdyb3VwaW5nQXBwbGllZDtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGdyb3VwaW5nIHRoZSBtZXNzYWdlcyBpbiB0aGUgbWVzc2FnZVBvcE92ZXJcIik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgcmV0cmlldmVzIHRoZSB2aXNpYmxlIHNlY3Rpb25zIGZyb20gYW4gb2JqZWN0IHBhZ2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBvT2JqZWN0UGFnZUxheW91dCBUaGUgb2JqZWN0UGFnZUxheW91dCBvYmplY3QgZm9yIHdoaWNoIHdlIHdhbnQgdG8gcmV0cmlldmUgdGhlIHZpc2libGUgc2VjdGlvbnMuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIHZpc2libGUgc2VjdGlvbnMuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRnZXRWaXNpYmxlU2VjdGlvbnNGcm9tT2JqZWN0UGFnZUxheW91dChvT2JqZWN0UGFnZUxheW91dDogYW55KSB7XG5cdFx0cmV0dXJuIG9PYmplY3RQYWdlTGF5b3V0LmdldFNlY3Rpb25zKCkuZmlsdGVyKGZ1bmN0aW9uIChvU2VjdGlvbjogYW55KSB7XG5cdFx0XHRyZXR1cm4gb1NlY3Rpb24uZ2V0VmlzaWJsZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBncm91cHMgdGhlIG1lc3NhZ2VzIGJhc2VkIG9uIHRoZSBzZWN0aW9uIG9yIHN1YnNlY3Rpb24gdGhleSBiZWxvbmcgdG8uXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfYXBwbHlHcm91cGluZygpIHtcblx0XHR0aGlzLm9PYmplY3RQYWdlTGF5b3V0ID0gdGhpcy5fZ2V0T2JqZWN0UGFnZUxheW91dCh0aGlzLCB0aGlzLm9PYmplY3RQYWdlTGF5b3V0KTtcblx0XHRpZiAoIXRoaXMub09iamVjdFBhZ2VMYXlvdXQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgYU1lc3NhZ2VzID0gdGhpcy5vTWVzc2FnZVBvcG92ZXIuZ2V0SXRlbXMoKTtcblx0XHRjb25zdCBhU2VjdGlvbnMgPSB0aGlzLmdldFZpc2libGVTZWN0aW9uc0Zyb21PYmplY3RQYWdlTGF5b3V0KHRoaXMub09iamVjdFBhZ2VMYXlvdXQpO1xuXHRcdGNvbnN0IGJFbmFibGVCaW5kaW5nID0gdGhpcy5fY2hlY2tDb250cm9sSWRJblNlY3Rpb25zKGFNZXNzYWdlcywgZmFsc2UpO1xuXHRcdGlmIChiRW5hYmxlQmluZGluZykge1xuXHRcdFx0dGhpcy5fZm5FbmFibGVCaW5kaW5ncyhhU2VjdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHJldHJpZXZlcyB0aGUgYmluZGluZyBjb250ZXh0IGZvciB0aGUgcmVmRXJyb3Igb2JqZWN0LlxuXHQgKiBUaGUgcmVmRXJyb3IgY29udGFpbnMgYSBtYXAgdG8gc3RvcmUgdGhlIGluZGV4ZXMgb2YgdGhlIHJvd3Mgd2l0aCBlcnJvcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSBvVGFibGUgVGhlIHRhYmxlIGZvciB3aGljaCB3ZSB3YW50IHRvIGdldCB0aGUgcmVmRXJyb3IgT2JqZWN0LlxuXHQgKiBAcmV0dXJucyBDb250ZXh0IG9mIHRoZSByZWZFcnJvci5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRUYWJsZVJlZkVycm9yQ29udGV4dChvVGFibGU6IGFueSkge1xuXHRcdGNvbnN0IG9Nb2RlbCA9IG9UYWJsZS5nZXRNb2RlbChcImludGVybmFsXCIpO1xuXHRcdC8vaW5pdGlhbGl6ZSB0aGUgcmVmRXJyb3IgcHJvcGVydHkgaWYgaXQgZG9lc24ndCBleGlzdFxuXHRcdGlmICghb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikuZ2V0UHJvcGVydHkoXCJyZWZFcnJvclwiKSkge1xuXHRcdFx0b01vZGVsLnNldFByb3BlcnR5KFwicmVmRXJyb3JcIiwge30sIG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpKTtcblx0XHR9XG5cdFx0Y29uc3Qgc1JlZkVycm9yQ29udGV4dFBhdGggPVxuXHRcdFx0b1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikuZ2V0UGF0aCgpICtcblx0XHRcdFwiL3JlZkVycm9yL1wiICtcblx0XHRcdG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dCgpLmdldFBhdGgoKS5yZXBsYWNlKFwiL1wiLCBcIiRcIikgK1xuXHRcdFx0XCIkXCIgK1xuXHRcdFx0b1RhYmxlLmdldFJvd0JpbmRpbmcoKS5nZXRQYXRoKCkucmVwbGFjZShcIi9cIiwgXCIkXCIpO1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gb01vZGVsLmdldENvbnRleHQoc1JlZkVycm9yQ29udGV4dFBhdGgpO1xuXHRcdGlmICghb0NvbnRleHQuZ2V0UHJvcGVydHkoXCJcIikpIHtcblx0XHRcdG9Nb2RlbC5zZXRQcm9wZXJ0eShcIlwiLCB7fSwgb0NvbnRleHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gb0NvbnRleHQ7XG5cdH1cblxuXHRfdXBkYXRlSW50ZXJuYWxNb2RlbChcblx0XHRvVGFibGVSb3dDb250ZXh0OiBhbnksXG5cdFx0aVJvd0luZGV4OiBudW1iZXIsXG5cdFx0c1RhYmxlVGFyZ2V0Q29sUHJvcGVydHk6IHN0cmluZyxcblx0XHRvVGFibGU6IGFueSxcblx0XHRvTWVzc2FnZU9iamVjdDogYW55LFxuXHRcdGJJc0NyZWF0aW9uUm93PzogYm9vbGVhblxuXHQpIHtcblx0XHRsZXQgb1RlbXA7XG5cdFx0aWYgKGJJc0NyZWF0aW9uUm93KSB7XG5cdFx0XHRvVGVtcCA9IHtcblx0XHRcdFx0cm93SW5kZXg6IFwiQ3JlYXRpb25Sb3dcIixcblx0XHRcdFx0dGFyZ2V0Q29sUHJvcGVydHk6IHNUYWJsZVRhcmdldENvbFByb3BlcnR5ID8gc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkgOiBcIlwiXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvVGVtcCA9IHtcblx0XHRcdFx0cm93SW5kZXg6IG9UYWJsZVJvd0NvbnRleHQgPyBpUm93SW5kZXggOiBcIlwiLFxuXHRcdFx0XHR0YXJnZXRDb2xQcm9wZXJ0eTogc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkgPyBzVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSA6IFwiXCJcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNvbnN0IG9Nb2RlbCA9IG9UYWJsZS5nZXRNb2RlbChcImludGVybmFsXCIpLFxuXHRcdFx0b0NvbnRleHQgPSB0aGlzLl9nZXRUYWJsZVJlZkVycm9yQ29udGV4dChvVGFibGUpO1xuXHRcdC8vd2UgZmlyc3QgcmVtb3ZlIHRoZSBlbnRyaWVzIHdpdGggb2Jzb2xldGUgbWVzc2FnZSBpZHMgZnJvbSB0aGUgaW50ZXJuYWwgbW9kZWwgYmVmb3JlIGluc2VydGluZyB0aGUgbmV3IGVycm9yIGluZm8gOlxuXHRcdGNvbnN0IGFWYWxpZE1lc3NhZ2VJZHMgPSBzYXAudWlcblx0XHRcdC5nZXRDb3JlKClcblx0XHRcdC5nZXRNZXNzYWdlTWFuYWdlcigpXG5cdFx0XHQuZ2V0TWVzc2FnZU1vZGVsKClcblx0XHRcdC5nZXREYXRhKClcblx0XHRcdC5tYXAoZnVuY3Rpb24gKG1lc3NhZ2U6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gbWVzc2FnZS5pZDtcblx0XHRcdH0pO1xuXHRcdGxldCBhT2Jzb2xldGVNZXNzYWdlbElkcztcblx0XHRpZiAob0NvbnRleHQuZ2V0UHJvcGVydHkoKSkge1xuXHRcdFx0YU9ic29sZXRlTWVzc2FnZWxJZHMgPSBPYmplY3Qua2V5cyhvQ29udGV4dC5nZXRQcm9wZXJ0eSgpKS5maWx0ZXIoZnVuY3Rpb24gKGludGVybmFsTWVzc2FnZUlkKSB7XG5cdFx0XHRcdHJldHVybiBhVmFsaWRNZXNzYWdlSWRzLmluZGV4T2YoaW50ZXJuYWxNZXNzYWdlSWQpID09PSAtMTtcblx0XHRcdH0pO1xuXHRcdFx0YU9ic29sZXRlTWVzc2FnZWxJZHMuZm9yRWFjaChmdW5jdGlvbiAob2Jzb2xldGVJZCkge1xuXHRcdFx0XHRkZWxldGUgb0NvbnRleHQuZ2V0UHJvcGVydHkoKVtvYnNvbGV0ZUlkXTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRvTW9kZWwuc2V0UHJvcGVydHkoXG5cdFx0XHRvTWVzc2FnZU9iamVjdC5nZXRJZCgpLFxuXHRcdFx0T2JqZWN0LmFzc2lnbih7fSwgb0NvbnRleHQuZ2V0UHJvcGVydHkob01lc3NhZ2VPYmplY3QuZ2V0SWQoKSkgPyBvQ29udGV4dC5nZXRQcm9wZXJ0eShvTWVzc2FnZU9iamVjdC5nZXRJZCgpKSA6IHt9LCBvVGVtcCksXG5cdFx0XHRvQ29udGV4dFxuXHRcdCk7XG5cdH1cblxuXHRfZ2V0Q29udHJvbEZyb21NZXNzYWdlUmVsYXRpbmdUb1N1YlNlY3Rpb24oc3ViU2VjdGlvbjogYW55LCBtZXNzYWdlOiBhbnkpIHtcblx0XHRjb25zdCBvTWVzc2FnZU9iamVjdCA9IG1lc3NhZ2UuZ2V0QmluZGluZ0NvbnRleHQoXCJtZXNzYWdlXCIpLmdldE9iamVjdCgpO1xuXHRcdHJldHVybiBzdWJTZWN0aW9uXG5cdFx0XHQuZmluZEVsZW1lbnRzKHRydWUsIChvRWxlbTogYW55KSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9mbkZpbHRlclVwb25JZHMob01lc3NhZ2VPYmplY3QuZ2V0Q29udHJvbElkcygpLCBvRWxlbSk7XG5cdFx0XHR9KVxuXHRcdFx0LnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XG5cdFx0XHRcdC8vIGNvbnRyb2xzIGFyZSBzb3J0ZWQgaW4gb3JkZXIgdG8gaGF2ZSB0aGUgdGFibGUgb24gdG9wIG9mIHRoZSBhcnJheVxuXHRcdFx0XHQvLyBpdCB3aWxsIGhlbHAgdG8gY29tcHV0ZSB0aGUgc3VidGl0bGUgb2YgdGhlIG1lc3NhZ2UgYmFzZWQgb24gdGhlIHR5cGUgb2YgcmVsYXRlZCBjb250cm9sc1xuXHRcdFx0XHRpZiAoYS5pc0EoXCJzYXAudWkubWRjLlRhYmxlXCIpICYmICFiLmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgc2V0cyBncm91cHMgZm9yIHRyYW5zaWVudCBtZXNzYWdlcy5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2UgVGhlIHRyYW5zaWVudCBtZXNzYWdlIGZvciB3aGljaCB3ZSB3YW50IHRvIGNvbXB1dGUgYW5kIHNldCBncm91cC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNBY3Rpb25OYW1lIFRoZSBhY3Rpb24gbmFtZS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cblx0X3NldEdyb3VwTGFiZWxGb3JUcmFuc2llbnRNc2cobWVzc2FnZTogYW55LCBzQWN0aW9uTmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zTGFzdEFjdGlvblRleHQgPSB0aGlzLnNMYXN0QWN0aW9uVGV4dFxuXHRcdFx0PyB0aGlzLnNMYXN0QWN0aW9uVGV4dFxuXHRcdFx0OiBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpLmdldFRleHQoXCJUX01FU1NBR0VfQlVUVE9OX1NBUEZFX01FU1NBR0VfR1JPVVBfTEFTVF9BQ1RJT05cIik7XG5cblx0XHRtZXNzYWdlLnNldEdyb3VwTmFtZShgJHt0aGlzLnNMYXN0QWN0aW9uVGV4dH06ICR7c0FjdGlvbk5hbWV9YCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IGdyb3VwIG1lc3NhZ2VzIGFuZCBhZGQgdGhlIHN1YnRpdGxlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gbWVzc2FnZSBUaGUgbWVzc2FnZSB3ZSB3YW50IHRvIGNvbXB1dGUgZ3JvdXAgYW5kIHN1YnRpdGxlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc2VjdGlvbiBUaGUgc2VjdGlvbiBjb250YWluaW5nIHRoZSBjb250cm9scy5cblx0ICogQHBhcmFtIHtvYmplY3R9IHN1YlNlY3Rpb24gVGhlIHN1YnNlY3Rpb24gY29udGFpbmluZyB0aGUgY29udHJvbHMuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBhRWxlbWVudHMgTGlzdCBvZiBjb250cm9scyBmcm9tIGEgc3Vic2VjdGlvbiByZWxhdGVkIHRvIGEgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtib29sZWFufSBiTXVsdGlwbGVTdWJTZWN0aW9ucyBUcnVlIGlmIHRoZXJlIGlzIG1vcmUgdGhhbiAxIHN1YnNlY3Rpb24gaW4gdGhlIHNlY3Rpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzQWN0aW9uTmFtZSBUaGUgYWN0aW9uIG5hbWUuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IFJldHVybiB0aGUgY29udHJvbCB0YXJnZXRlZCBieSB0aGUgbWVzc2FnZS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cblx0X2NvbXB1dGVNZXNzYWdlR3JvdXBBbmRTdWJUaXRsZShcblx0XHRtZXNzYWdlOiBNZXNzYWdlSXRlbSxcblx0XHRzZWN0aW9uOiBPYmplY3RQYWdlU2VjdGlvbixcblx0XHRzdWJTZWN0aW9uOiBPYmplY3RQYWdlU3ViU2VjdGlvbixcblx0XHRhRWxlbWVudHM6IGFueVtdLFxuXHRcdGJNdWx0aXBsZVN1YlNlY3Rpb25zOiBib29sZWFuLFxuXHRcdHNBY3Rpb25OYW1lOiBzdHJpbmdcblx0KSB7XG5cdFx0dGhpcy5vSXRlbUJpbmRpbmcuZGV0YWNoQ2hhbmdlKHRoaXMuX3NldE1lc3NhZ2VEYXRhLCB0aGlzKTtcblx0XHRjb25zdCBvTWVzc2FnZU9iamVjdCA9IG1lc3NhZ2UuZ2V0QmluZGluZ0NvbnRleHQoXCJtZXNzYWdlXCIpPy5nZXRPYmplY3QoKSBhcyBNZXNzYWdlO1xuXG5cdFx0bGV0IG9FbGVtZW50LFxuXHRcdFx0b1RhYmxlOiBhbnksXG5cdFx0XHRvVGFyZ2V0VGFibGVJbmZvOiBhbnksXG5cdFx0XHRsLFxuXHRcdFx0aVJvd0luZGV4LFxuXHRcdFx0b1RhcmdldGVkQ29udHJvbCxcblx0XHRcdGJJc0NyZWF0aW9uUm93LFxuXHRcdFx0c01lc3NhZ2VTdWJ0aXRsZTogc3RyaW5nID0gXCJcIjtcblx0XHRjb25zdCBiSXNCYWNrZW5kTWVzc2FnZSA9IG5ldyBSZWdFeHAoXCJeL1wiKS50ZXN0KG9NZXNzYWdlT2JqZWN0Py5nZXRUYXJnZXRzKClbMF0pLFxuXHRcdFx0b1Jlc291cmNlQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblxuXHRcdGlmIChiSXNCYWNrZW5kTWVzc2FnZSkge1xuXHRcdFx0Zm9yIChsID0gMDsgbCA8IGFFbGVtZW50cy5sZW5ndGg7IGwrKykge1xuXHRcdFx0XHRvRWxlbWVudCA9IGFFbGVtZW50c1tsXTtcblx0XHRcdFx0b1RhcmdldGVkQ29udHJvbCA9IG9FbGVtZW50O1xuXHRcdFx0XHRpZiAob0VsZW1lbnQuaXNBKFwic2FwLm0uVGFibGVcIikgfHwgb0VsZW1lbnQuaXNBKFwic2FwLnVpLnRhYmxlLlRhYmxlXCIpKSB7XG5cdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mbyA9IHt9O1xuXHRcdFx0XHRcdG9UYWJsZSA9IG9FbGVtZW50LmdldFBhcmVudCgpO1xuXHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8udGFibGVIZWFkZXIgPSBvVGFibGUuZ2V0SGVhZGVyKCk7XG5cdFx0XHRcdFx0Y29uc3Qgb1Jvd0JpbmRpbmcgPSBvVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdGlmIChvUm93QmluZGluZyAmJiBvUm93QmluZGluZy5pc0xlbmd0aEZpbmFsKCkgJiYgb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KCkpIHtcblx0XHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkgPSB0aGlzLl9nZXRUYWJsZUNvbFByb3BlcnR5KG9UYWJsZSwgb01lc3NhZ2VPYmplY3QpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgb1RhYmxlQ29sSW5mbyA9IHRoaXMuX2dldFRhYmxlQ29sSW5mbyhvVGFibGUsIG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkpO1xuXHRcdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dCaW5kaW5nQ29udGV4dHMgPSBvRWxlbWVudC5pc0EoXCJzYXAudWkudGFibGUuVGFibGVcIilcblx0XHRcdFx0XHRcdFx0PyBvUm93QmluZGluZy5nZXRDb250ZXh0cygpXG5cdFx0XHRcdFx0XHRcdDogb1Jvd0JpbmRpbmcuZ2V0Q3VycmVudENvbnRleHRzKCk7XG5cdFx0XHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLnNUYWJsZVRhcmdldENvbE5hbWUgPSBvVGFibGVDb2xJbmZvLnNUYWJsZVRhcmdldENvbE5hbWU7XG5cdFx0XHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLnNUYWJsZVRhcmdldFByb3BlcnR5ID0gb1RhcmdldFRhYmxlSW5mby5zVGFibGVUYXJnZXRDb2xQcm9wZXJ0eTtcblx0XHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkgPSBvVGFibGVDb2xJbmZvLnNUYWJsZVRhcmdldENvbFByb3BlcnR5O1xuXHRcdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dDb250ZXh0ID0gb1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dCaW5kaW5nQ29udGV4dHMuZmluZChcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gKG1lc3NhZ2VPYmplY3Q6IGFueSwgcm93Q29udGV4dDogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJvd0NvbnRleHQgJiYgbWVzc2FnZU9iamVjdC5nZXRUYXJnZXRzKClbMF0uaW5kZXhPZihyb3dDb250ZXh0LmdldFBhdGgoKSkgPT09IDA7XG5cdFx0XHRcdFx0XHRcdH0uYmluZCh0aGlzLCBvTWVzc2FnZU9iamVjdClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRsZXQgc0NvbnRyb2xJZDtcblx0XHRcdFx0XHRcdGlmICghb1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dDb250ZXh0KSB7XG5cdFx0XHRcdFx0XHRcdHNDb250cm9sSWQgPSBvTWVzc2FnZU9iamVjdC5nZXRDb250cm9sSWRzKCkuZmluZChcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAodGhpczogYW55LCB0YWJsZTogYW55LCBzSWQ6IHN0cmluZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuX0lzQ29udHJvbEluVGFibGUodGFibGUsIHNJZCk7XG5cdFx0XHRcdFx0XHRcdFx0fS5iaW5kKHRoaXMsIG9UYWJsZSlcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzQ29udHJvbElkKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9Db250cm9sID0gQ29yZS5ieUlkKHNDb250cm9sSWQpO1xuXHRcdFx0XHRcdFx0XHRiSXNDcmVhdGlvblJvdyA9IHRoaXMuX0lzQ29udHJvbFBhcnRPZkNyZWF0aW9uUm93KG9Db250cm9sKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNNZXNzYWdlU3VidGl0bGUgPSB0aGlzLl9nZXRNZXNzYWdlU3VidGl0bGUoXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8ub1RhYmxlUm93QmluZGluZ0NvbnRleHRzLFxuXHRcdFx0XHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLm9UYWJsZVJvd0NvbnRleHQsXG5cdFx0XHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sTmFtZSxcblx0XHRcdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdFx0XHRvVGFibGUsXG5cdFx0XHRcdFx0XHRcdGJJc0NyZWF0aW9uUm93XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Ly9zZXQgdGhlIHN1YnRpdGxlXG5cdFx0XHRcdFx0XHRtZXNzYWdlLnNldFN1YnRpdGxlKHNNZXNzYWdlU3VidGl0bGUpO1xuXHRcdFx0XHRcdFx0bWVzc2FnZS5zZXRBY3RpdmVUaXRsZSghIW9UYXJnZXRUYWJsZUluZm8ub1RhYmxlUm93Q29udGV4dCk7XG5cblx0XHRcdFx0XHRcdGlmIChvVGFyZ2V0VGFibGVJbmZvLm9UYWJsZVJvd0NvbnRleHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZm9ybWF0TWVzc2FnZURlc2NyaXB0aW9uKFxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dDb250ZXh0LFxuXHRcdFx0XHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sTmFtZSxcblx0XHRcdFx0XHRcdFx0XHRvUmVzb3VyY2VCdW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0b1RhYmxlXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpUm93SW5kZXggPSBvVGFyZ2V0VGFibGVJbmZvLm9UYWJsZVJvd0NvbnRleHQgJiYgb1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dDb250ZXh0LmdldEluZGV4KCk7XG5cdFx0XHRcdFx0XHR0aGlzLl91cGRhdGVJbnRlcm5hbE1vZGVsKFxuXHRcdFx0XHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLm9UYWJsZVJvd0NvbnRleHQsXG5cdFx0XHRcdFx0XHRcdGlSb3dJbmRleCxcblx0XHRcdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5zVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSxcblx0XHRcdFx0XHRcdFx0b1RhYmxlLFxuXHRcdFx0XHRcdFx0XHRvTWVzc2FnZU9iamVjdFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5zZXRBY3RpdmVUaXRsZSh0cnVlKTtcblx0XHRcdFx0XHQvL2NoZWNrIGlmIHRoZSB0YXJnZXRlZCBjb250cm9sIGlzIGEgY2hpbGQgb2Ygb25lIG9mIHRoZSBvdGhlciBjb250cm9sc1xuXHRcdFx0XHRcdGNvbnN0IGJJc1RhcmdldGVkQ29udHJvbE9ycGhhbiA9IHRoaXMuX2JJc09ycGhhbkVsZW1lbnQob1RhcmdldGVkQ29udHJvbCwgYUVsZW1lbnRzKTtcblx0XHRcdFx0XHRpZiAoYklzVGFyZ2V0ZWRDb250cm9sT3JwaGFuKSB7XG5cdFx0XHRcdFx0XHQvL3NldCB0aGUgc3VidGl0bGVcblx0XHRcdFx0XHRcdG1lc3NhZ2Uuc2V0U3VidGl0bGUoc01lc3NhZ2VTdWJ0aXRsZSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9UaGVyZSBpcyBvbmx5IG9uZSBlbHQgYXMgdGhpcyBpcyBhIGZyb250RW5kIG1lc3NhZ2Vcblx0XHRcdG9UYXJnZXRlZENvbnRyb2wgPSBhRWxlbWVudHNbMF07XG5cdFx0XHRvVGFibGUgPSB0aGlzLl9nZXRNZGNUYWJsZShvVGFyZ2V0ZWRDb250cm9sKTtcblx0XHRcdGlmIChvVGFibGUpIHtcblx0XHRcdFx0b1RhcmdldFRhYmxlSW5mbyA9IHt9O1xuXHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLnRhYmxlSGVhZGVyID0gb1RhYmxlLmdldEhlYWRlcigpO1xuXHRcdFx0XHRjb25zdCBpVGFyZ2V0Q29sdW1uSW5kZXggPSB0aGlzLl9nZXRUYWJsZUNvbHVtbkluZGV4KG9UYXJnZXRlZENvbnRyb2wpO1xuXHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLnNUYWJsZVRhcmdldENvbFByb3BlcnR5ID1cblx0XHRcdFx0XHRpVGFyZ2V0Q29sdW1uSW5kZXggPiAtMSA/IG9UYWJsZS5nZXRDb2x1bW5zKClbaVRhcmdldENvbHVtbkluZGV4XS5nZXREYXRhUHJvcGVydHkoKSA6IHVuZGVmaW5lZDtcblx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5zVGFibGVUYXJnZXRQcm9wZXJ0eSA9IG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHk7XG5cdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sTmFtZSA9XG5cdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5zVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSAmJiBpVGFyZ2V0Q29sdW1uSW5kZXggPiAtMVxuXHRcdFx0XHRcdFx0PyBvVGFibGUuZ2V0Q29sdW1ucygpW2lUYXJnZXRDb2x1bW5JbmRleF0uZ2V0SGVhZGVyKClcblx0XHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0XHRiSXNDcmVhdGlvblJvdyA9IHRoaXMuX2dldFRhYmxlUm93KG9UYXJnZXRlZENvbnRyb2wpLmlzQShcInNhcC51aS50YWJsZS5DcmVhdGlvblJvd1wiKTtcblx0XHRcdFx0aWYgKCFiSXNDcmVhdGlvblJvdykge1xuXHRcdFx0XHRcdGlSb3dJbmRleCA9IHRoaXMuX2dldFRhYmxlUm93SW5kZXgob1RhcmdldGVkQ29udHJvbCk7XG5cdFx0XHRcdFx0b1RhcmdldFRhYmxlSW5mby5vVGFibGVSb3dCaW5kaW5nQ29udGV4dHMgPSBvVGFibGUuZ2V0Um93QmluZGluZygpLmdldEN1cnJlbnRDb250ZXh0cygpO1xuXHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8ub1RhYmxlUm93Q29udGV4dCA9IG9UYXJnZXRUYWJsZUluZm8ub1RhYmxlUm93QmluZGluZ0NvbnRleHRzW2lSb3dJbmRleF07XG5cdFx0XHRcdH1cblx0XHRcdFx0c01lc3NhZ2VTdWJ0aXRsZSA9IHRoaXMuX2dldE1lc3NhZ2VTdWJ0aXRsZShcblx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8ub1RhYmxlUm93QmluZGluZ0NvbnRleHRzLFxuXHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8ub1RhYmxlUm93Q29udGV4dCxcblx0XHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLnNUYWJsZVRhcmdldENvbE5hbWUsXG5cdFx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLFxuXHRcdFx0XHRcdG9UYWJsZSxcblx0XHRcdFx0XHRiSXNDcmVhdGlvblJvdyxcblx0XHRcdFx0XHRpVGFyZ2V0Q29sdW1uSW5kZXggPT09IDAgJiYgb1RhcmdldGVkQ29udHJvbC5nZXRWYWx1ZVN0YXRlKCkgPT09IFwiRXJyb3JcIiA/IG9UYXJnZXRlZENvbnRyb2wgOiB1bmRlZmluZWRcblx0XHRcdFx0KTtcblx0XHRcdFx0Ly9zZXQgdGhlIHN1YnRpdGxlXG5cdFx0XHRcdG1lc3NhZ2Uuc2V0U3VidGl0bGUoc01lc3NhZ2VTdWJ0aXRsZSk7XG5cdFx0XHRcdG1lc3NhZ2Uuc2V0QWN0aXZlVGl0bGUodHJ1ZSk7XG5cblx0XHRcdFx0dGhpcy5fdXBkYXRlSW50ZXJuYWxNb2RlbChcblx0XHRcdFx0XHRvVGFyZ2V0VGFibGVJbmZvLm9UYWJsZVJvd0NvbnRleHQsXG5cdFx0XHRcdFx0aVJvd0luZGV4LFxuXHRcdFx0XHRcdG9UYXJnZXRUYWJsZUluZm8uc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHksXG5cdFx0XHRcdFx0b1RhYmxlLFxuXHRcdFx0XHRcdG9NZXNzYWdlT2JqZWN0LFxuXHRcdFx0XHRcdGJJc0NyZWF0aW9uUm93XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvTWVzc2FnZU9iamVjdC5nZXRQZXJzaXN0ZW50KCkgJiYgc0FjdGlvbk5hbWUpIHtcblx0XHRcdHRoaXMuX3NldEdyb3VwTGFiZWxGb3JUcmFuc2llbnRNc2cobWVzc2FnZSwgc0FjdGlvbk5hbWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtZXNzYWdlLnNldEdyb3VwTmFtZShcblx0XHRcdFx0c2VjdGlvbi5nZXRUaXRsZSgpICtcblx0XHRcdFx0XHQoc3ViU2VjdGlvbi5nZXRUaXRsZSgpICYmIGJNdWx0aXBsZVN1YlNlY3Rpb25zID8gYCwgJHtzdWJTZWN0aW9uLmdldFRpdGxlKCl9YCA6IFwiXCIpICtcblx0XHRcdFx0XHQob1RhcmdldFRhYmxlSW5mb1xuXHRcdFx0XHRcdFx0PyBgLCAke29SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9NRVNTQUdFX0dST1VQX1RJVExFX1RBQkxFX0RFTk9NSU5BVE9SXCIpfTogJHtvVGFyZ2V0VGFibGVJbmZvLnRhYmxlSGVhZGVyfWBcblx0XHRcdFx0XHRcdDogXCJcIilcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBzVmlld0lkID0gdGhpcy5fZ2V0Vmlld0lkKHRoaXMuZ2V0SWQoKSk7XG5cdFx0XHRjb25zdCBvVmlldyA9IENvcmUuYnlJZChzVmlld0lkIGFzIHN0cmluZyk7XG5cdFx0XHRjb25zdCBvTWVzc2FnZVRhcmdldFByb3BlcnR5ID0gb01lc3NhZ2VPYmplY3QuZ2V0VGFyZ2V0cygpWzBdICYmIG9NZXNzYWdlT2JqZWN0LmdldFRhcmdldHMoKVswXS5zcGxpdChcIi9cIikucG9wKCk7XG5cdFx0XHRjb25zdCBvVUlNb2RlbCA9IG9WaWV3Py5nZXRNb2RlbChcImludGVybmFsXCIpIGFzIEpTT05Nb2RlbDtcblx0XHRcdGlmIChcblx0XHRcdFx0b1VJTW9kZWwgJiZcblx0XHRcdFx0b1VJTW9kZWwuZ2V0UHJvcGVydHkoXCIvbWVzc2FnZVRhcmdldFByb3BlcnR5XCIpICYmXG5cdFx0XHRcdG9NZXNzYWdlVGFyZ2V0UHJvcGVydHkgJiZcblx0XHRcdFx0b01lc3NhZ2VUYXJnZXRQcm9wZXJ0eSA9PT0gb1VJTW9kZWwuZ2V0UHJvcGVydHkoXCIvbWVzc2FnZVRhcmdldFByb3BlcnR5XCIpXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy5vTWVzc2FnZVBvcG92ZXIuZmlyZUFjdGl2ZVRpdGxlUHJlc3MoeyBcIml0ZW1cIjogbWVzc2FnZSB9KTtcblx0XHRcdFx0b1VJTW9kZWwuc2V0UHJvcGVydHkoXCIvbWVzc2FnZVRhcmdldFByb3BlcnR5XCIsIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5vSXRlbUJpbmRpbmcuYXR0YWNoQ2hhbmdlKHRoaXMuX3NldE1lc3NhZ2VEYXRhLCB0aGlzKTtcblx0XHRyZXR1cm4gb1RhcmdldGVkQ29udHJvbDtcblx0fVxuXG5cdF9jaGVja0NvbnRyb2xJZEluU2VjdGlvbnMoYU1lc3NhZ2VzOiBhbnlbXSwgYkVuYWJsZUJpbmRpbmc6IGJvb2xlYW4pIHtcblx0XHRsZXQgc2VjdGlvbiwgYVN1YlNlY3Rpb25zLCBtZXNzYWdlLCBpLCBqLCBrO1xuXG5cdFx0dGhpcy5zR2VuZXJhbEdyb3VwVGV4dCA9IHRoaXMuc0dlbmVyYWxHcm91cFRleHRcblx0XHRcdD8gdGhpcy5zR2VuZXJhbEdyb3VwVGV4dFxuXHRcdFx0OiBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpLmdldFRleHQoXCJUX01FU1NBR0VfQlVUVE9OX1NBUEZFX01FU1NBR0VfR1JPVVBfR0VORVJBTFwiKTtcblx0XHQvL0dldCBhbGwgc2VjdGlvbnMgZnJvbSB0aGUgb2JqZWN0IHBhZ2UgbGF5b3V0XG5cdFx0Y29uc3QgYVZpc2libGVTZWN0aW9ucyA9IHRoaXMuZ2V0VmlzaWJsZVNlY3Rpb25zRnJvbU9iamVjdFBhZ2VMYXlvdXQodGhpcy5vT2JqZWN0UGFnZUxheW91dCk7XG5cdFx0aWYgKGFWaXNpYmxlU2VjdGlvbnMpIHtcblx0XHRcdGNvbnN0IHZpZXdJZCA9IHRoaXMuX2dldFZpZXdJZCh0aGlzLmdldElkKCkpO1xuXHRcdFx0Y29uc3Qgb1ZpZXcgPSBDb3JlLmJ5SWQodmlld0lkKTtcblx0XHRcdGNvbnN0IHNBY3Rpb25OYW1lID0gb1ZpZXc/LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik/LmdldFByb3BlcnR5KFwic0FjdGlvbk5hbWVcIik7XG5cdFx0XHRpZiAoc0FjdGlvbk5hbWUpIHtcblx0XHRcdFx0KG9WaWV3Py5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIGFueSkuc2V0UHJvcGVydHkoXCJzQWN0aW9uTmFtZVwiLCBudWxsKTtcblx0XHRcdH1cblx0XHRcdGZvciAoaSA9IGFNZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHRcdFx0XHQvLyBMb29wIG92ZXIgYWxsIG1lc3NhZ2VzXG5cdFx0XHRcdG1lc3NhZ2UgPSBhTWVzc2FnZXNbaV07XG5cdFx0XHRcdGxldCBiSXNHZW5lcmFsR3JvdXBOYW1lID0gdHJ1ZTtcblx0XHRcdFx0Zm9yIChqID0gYVZpc2libGVTZWN0aW9ucy5sZW5ndGggLSAxOyBqID49IDA7IC0taikge1xuXHRcdFx0XHRcdC8vIExvb3Agb3ZlciBhbGwgdmlzaWJsZSBzZWN0aW9uc1xuXHRcdFx0XHRcdHNlY3Rpb24gPSBhVmlzaWJsZVNlY3Rpb25zW2pdO1xuXHRcdFx0XHRcdGFTdWJTZWN0aW9ucyA9IHNlY3Rpb24uZ2V0U3ViU2VjdGlvbnMoKTtcblx0XHRcdFx0XHRmb3IgKGsgPSBhU3ViU2VjdGlvbnMubGVuZ3RoIC0gMTsgayA+PSAwOyAtLWspIHtcblx0XHRcdFx0XHRcdC8vIExvb3Agb3ZlciBhbGwgc3ViLXNlY3Rpb25zXG5cdFx0XHRcdFx0XHRjb25zdCBzdWJTZWN0aW9uID0gYVN1YlNlY3Rpb25zW2tdO1xuXHRcdFx0XHRcdFx0Y29uc3QgYUNvbnRyb2xzID0gdGhpcy5fZ2V0Q29udHJvbEZyb21NZXNzYWdlUmVsYXRpbmdUb1N1YlNlY3Rpb24oc3ViU2VjdGlvbiwgbWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRpZiAoYUNvbnRyb2xzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb1RhcmdldGVkQ29udHJvbCA9IHRoaXMuX2NvbXB1dGVNZXNzYWdlR3JvdXBBbmRTdWJUaXRsZShcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb24sXG5cdFx0XHRcdFx0XHRcdFx0c3ViU2VjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRhQ29udHJvbHMsXG5cdFx0XHRcdFx0XHRcdFx0YVN1YlNlY3Rpb25zLmxlbmd0aCA+IDEsXG5cdFx0XHRcdFx0XHRcdFx0c0FjdGlvbk5hbWVcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0Ly8gaWYgd2UgZm91bmQgdGFibGUgdGhhdCBtYXRjaGVzIHdpdGggdGhlIG1lc3NhZ2UsIHdlIGRvbid0IHN0b3AgdGhlIGxvb3Bcblx0XHRcdFx0XHRcdFx0Ly8gaW4gY2FzZSB3ZSBmaW5kIGFuIGFkZGl0aW9uYWwgY29udHJvbCAoZWcgbWRjIGZpZWxkKSB0aGF0IGFsc28gbWF0Y2ggd2l0aCB0aGUgbWVzc2FnZVxuXHRcdFx0XHRcdFx0XHRpZiAob1RhcmdldGVkQ29udHJvbCAmJiAhb1RhcmdldGVkQ29udHJvbC5pc0EoXCJzYXAubS5UYWJsZVwiKSAmJiAhb1RhcmdldGVkQ29udHJvbC5pc0EoXCJzYXAudWkudGFibGUuVGFibGVcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRqID0gayA9IC0xO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJJc0dlbmVyYWxHcm91cE5hbWUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGJJc0dlbmVyYWxHcm91cE5hbWUpIHtcblx0XHRcdFx0XHRjb25zdCBvTWVzc2FnZU9iamVjdCA9IG1lc3NhZ2UuZ2V0QmluZGluZ0NvbnRleHQoXCJtZXNzYWdlXCIpLmdldE9iamVjdCgpO1xuXHRcdFx0XHRcdG1lc3NhZ2Uuc2V0QWN0aXZlVGl0bGUoZmFsc2UpO1xuXHRcdFx0XHRcdGlmIChvTWVzc2FnZU9iamVjdC5wZXJzaXN0ZW50ICYmIHNBY3Rpb25OYW1lKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zZXRHcm91cExhYmVsRm9yVHJhbnNpZW50TXNnKG1lc3NhZ2UsIHNBY3Rpb25OYW1lKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVzc2FnZS5zZXRHcm91cE5hbWUodGhpcy5zR2VuZXJhbEdyb3VwVGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghYkVuYWJsZUJpbmRpbmcgJiYgbWVzc2FnZS5nZXRHcm91cE5hbWUoKSA9PT0gdGhpcy5zR2VuZXJhbEdyb3VwVGV4dCAmJiB0aGlzLl9maW5kVGFyZ2V0Rm9yTWVzc2FnZShtZXNzYWdlKSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0X2ZpbmRUYXJnZXRGb3JNZXNzYWdlKG1lc3NhZ2U6IGFueSkge1xuXHRcdGNvbnN0IG1lc3NhZ2VPYmplY3QgPSBtZXNzYWdlLmdldEJpbmRpbmdDb250ZXh0KFwibWVzc2FnZVwiKSAmJiBtZXNzYWdlLmdldEJpbmRpbmdDb250ZXh0KFwibWVzc2FnZVwiKS5nZXRPYmplY3QoKTtcblx0XHRpZiAobWVzc2FnZU9iamVjdCAmJiBtZXNzYWdlT2JqZWN0LnRhcmdldCkge1xuXHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9XG5cdFx0XHRcdFx0dGhpcy5vT2JqZWN0UGFnZUxheW91dCAmJiB0aGlzLm9PYmplY3RQYWdlTGF5b3V0LmdldE1vZGVsKCkgJiYgdGhpcy5vT2JqZWN0UGFnZUxheW91dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0XHRjb250ZXh0UGF0aCA9IG9NZXRhTW9kZWwgJiYgb01ldGFNb2RlbC5nZXRNZXRhUGF0aChtZXNzYWdlT2JqZWN0LnRhcmdldCksXG5cdFx0XHRcdG9Db250ZXh0UGF0aE1ldGFkYXRhID0gb01ldGFNb2RlbCAmJiBvTWV0YU1vZGVsLmdldE9iamVjdChjb250ZXh0UGF0aCk7XG5cdFx0XHRpZiAob0NvbnRleHRQYXRoTWV0YWRhdGEgJiYgb0NvbnRleHRQYXRoTWV0YWRhdGEuJGtpbmQgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRfZm5FbmFibGVCaW5kaW5ncyhhU2VjdGlvbnM6IGFueVtdKSB7XG5cdFx0aWYgKFVyaVBhcmFtZXRlcnMuZnJvbVF1ZXJ5KHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldChcInNhcC1mZS14eC1sYXp5bG9hZGluZ3Rlc3RcIikpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Zm9yIChsZXQgaVNlY3Rpb24gPSAwOyBpU2VjdGlvbiA8IGFTZWN0aW9ucy5sZW5ndGg7IGlTZWN0aW9uKyspIHtcblx0XHRcdGNvbnN0IG9TZWN0aW9uID0gYVNlY3Rpb25zW2lTZWN0aW9uXTtcblx0XHRcdGxldCBub25UYWJsZUNoYXJ0Y29udHJvbEZvdW5kID0gZmFsc2U7XG5cdFx0XHRjb25zdCBhU3ViU2VjdGlvbnMgPSBvU2VjdGlvbi5nZXRTdWJTZWN0aW9ucygpO1xuXHRcdFx0Zm9yIChsZXQgaVN1YlNlY3Rpb24gPSAwOyBpU3ViU2VjdGlvbiA8IGFTdWJTZWN0aW9ucy5sZW5ndGg7IGlTdWJTZWN0aW9uKyspIHtcblx0XHRcdFx0Y29uc3Qgb1N1YlNlY3Rpb24gPSBhU3ViU2VjdGlvbnNbaVN1YlNlY3Rpb25dO1xuXHRcdFx0XHRjb25zdCBvQWxsQmxvY2tzID0gb1N1YlNlY3Rpb24uZ2V0QmxvY2tzKCk7XG5cdFx0XHRcdGlmIChvQWxsQmxvY2tzKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgYmxvY2sgPSAwOyBibG9jayA8IG9TdWJTZWN0aW9uLmdldEJsb2NrcygpLmxlbmd0aDsgYmxvY2srKykge1xuXHRcdFx0XHRcdFx0aWYgKG9BbGxCbG9ja3NbYmxvY2tdLmdldENvbnRlbnQgJiYgIW9BbGxCbG9ja3NbYmxvY2tdLmdldENvbnRlbnQoKS5pc0EoXCJzYXAuZmUubWFjcm9zLnRhYmxlLlRhYmxlQVBJXCIpKSB7XG5cdFx0XHRcdFx0XHRcdG5vblRhYmxlQ2hhcnRjb250cm9sRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG5vblRhYmxlQ2hhcnRjb250cm9sRm91bmQpIHtcblx0XHRcdFx0XHRcdG9TdWJTZWN0aW9uLnNldEJpbmRpbmdDb250ZXh0KHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvU3ViU2VjdGlvbi5nZXRCaW5kaW5nQ29udGV4dCgpKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmluZE1lc3NhZ2VHcm91cEFmdGVyUmViaW5kaW5nKCk7XG5cdFx0XHRcdFx0b1N1YlNlY3Rpb24uZ2V0QmluZGluZ0NvbnRleHQoKS5nZXRCaW5kaW5nKCkuYXR0YWNoRGF0YVJlY2VpdmVkKHRoaXMuX2ZpbmRNZXNzYWdlR3JvdXBBZnRlclJlYmluZGluZyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRfZmluZE1lc3NhZ2VHcm91cEFmdGVyUmViaW5kaW5nKCkge1xuXHRcdGNvbnN0IGFNZXNzYWdlcyA9IHRoaXMub01lc3NhZ2VQb3BvdmVyLmdldEl0ZW1zKCk7XG5cdFx0dGhpcy5fY2hlY2tDb250cm9sSWRJblNlY3Rpb25zKGFNZXNzYWdlcywgdHJ1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHJldHJpZXZlcyB0aGUgdmlldyBJRCAoSFRNTFZpZXcvWE1MVmlldy9KU09Odmlldy9KU1ZpZXcvVGVtcGxhdGV2aWV3KSBvZiBhbnkgY29udHJvbC5cblx0ICpcblx0ICogQHBhcmFtIHNDb250cm9sSWQgSUQgb2YgdGhlIGNvbnRyb2wgbmVlZGVkIHRvIHJldHJpZXZlIHRoZSB2aWV3IElEXG5cdCAqIEByZXR1cm5zIFRoZSB2aWV3IElEIG9mIHRoZSBjb250cm9sXG5cdCAqL1xuXHRfZ2V0Vmlld0lkKHNDb250cm9sSWQ6IHN0cmluZykge1xuXHRcdGxldCBzVmlld0lkLFxuXHRcdFx0b0NvbnRyb2wgPSBDb3JlLmJ5SWQoc0NvbnRyb2xJZCkgYXMgYW55O1xuXHRcdHdoaWxlIChvQ29udHJvbCkge1xuXHRcdFx0aWYgKG9Db250cm9sIGluc3RhbmNlb2YgVmlldykge1xuXHRcdFx0XHRzVmlld0lkID0gb0NvbnRyb2wuZ2V0SWQoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRvQ29udHJvbCA9IG9Db250cm9sLmdldFBhcmVudCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gc1ZpZXdJZDtcblx0fVxuXG5cdF9zZXRMb25ndGV4dFVybERlc2NyaXB0aW9uKHNNZXNzYWdlRGVzY3JpcHRpb25Db250ZW50OiBzdHJpbmcsIG9EaWFnbm9zaXNUaXRsZTogYW55KSB7XG5cdFx0dGhpcy5vTWVzc2FnZVBvcG92ZXIuc2V0QXN5bmNEZXNjcmlwdGlvbkhhbmRsZXIoZnVuY3Rpb24gKGNvbmZpZzogYW55KSB7XG5cdFx0XHQvLyBUaGlzIHN0b3JlcyB0aGUgb2xkIGRlc2NyaXB0aW9uXG5cdFx0XHRjb25zdCBzT2xkRGVzY3JpcHRpb24gPSBzTWVzc2FnZURlc2NyaXB0aW9uQ29udGVudDtcblx0XHRcdC8vIEhlcmUgd2UgY2FuIGZldGNoIHRoZSBkYXRhIGFuZCBjb25jYXRlbmF0ZSBpdCB0byB0aGUgb2xkIG9uZVxuXHRcdFx0Ly8gQnkgZGVmYXVsdCwgdGhlIGxvbmd0ZXh0VXJsIGZldGNoaW5nIHdpbGwgb3ZlcndyaXRlIHRoZSBkZXNjcmlwdGlvbiAod2l0aCB0aGUgZGVmYXVsdCBiZWhhdmlvdXIpXG5cdFx0XHQvLyBIZXJlIGFzIHdlIGhhdmUgb3ZlcndyaXR0ZW4gdGhlIGRlZmF1bHQgYXN5bmMgaGFuZGxlciwgd2hpY2ggZmV0Y2hlcyBhbmQgcmVwbGFjZXMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBpdGVtXG5cdFx0XHQvLyB3ZSBjYW4gbWFudWFsbHkgbW9kaWZ5IGl0IHRvIGluY2x1ZGUgd2hhdGV2ZXIgbmVlZGVkLlxuXHRcdFx0Y29uc3Qgc0xvbmdUZXh0VXJsID0gY29uZmlnLml0ZW0uZ2V0TG9uZ3RleHRVcmwoKTtcblx0XHRcdGlmIChzTG9uZ1RleHRVcmwpIHtcblx0XHRcdFx0alF1ZXJ5LmFqYXgoe1xuXHRcdFx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHRcdFx0dXJsOiBzTG9uZ1RleHRVcmwsXG5cdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHNEaWFnbm9zaXNUZXh0ID0gb0RpYWdub3Npc1RpdGxlLmdldEh0bWxUZXh0KCkgKyBkYXRhO1xuXHRcdFx0XHRcdFx0Y29uZmlnLml0ZW0uc2V0RGVzY3JpcHRpb24oYCR7c09sZERlc2NyaXB0aW9ufSR7c0RpYWdub3Npc1RleHR9YCk7XG5cdFx0XHRcdFx0XHRjb25maWcucHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y29uZmlnLml0ZW0uc2V0RGVzY3JpcHRpb24oc01lc3NhZ2VEZXNjcmlwdGlvbkNvbnRlbnQpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc0Vycm9yID0gYEEgcmVxdWVzdCBoYXMgZmFpbGVkIGZvciBsb25nIHRleHQgZGF0YS4gVVJMOiAke3NMb25nVGV4dFVybH1gO1xuXHRcdFx0XHRcdFx0TG9nLmVycm9yKHNFcnJvcik7XG5cdFx0XHRcdFx0XHRjb25maWcucHJvbWlzZS5yZWplY3Qoc0Vycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0X2Zvcm1hdE1lc3NhZ2VEZXNjcmlwdGlvbihcblx0XHRtZXNzYWdlOiBhbnksXG5cdFx0b1RhYmxlUm93Q29udGV4dDogYW55LFxuXHRcdHNUYWJsZVRhcmdldENvbE5hbWU6IHN0cmluZyxcblx0XHRvUmVzb3VyY2VCdW5kbGU6IFJlc291cmNlQnVuZGxlLFxuXHRcdG9UYWJsZTogYW55XG5cdCkge1xuXHRcdGNvbnN0IHNUYWJsZUZpcnN0Q29sUHJvcGVydHkgPSBvVGFibGUuZ2V0UGFyZW50KCkuZ2V0SWRlbnRpZmllckNvbHVtbigpO1xuXHRcdGxldCBzQ29sdW1uSW5mbyA9IFwiXCI7XG5cdFx0Y29uc3Qgb0NvbEZyb21UYWJsZVNldHRpbmdzID0gdGhpcy5fZmV0Y2hDb2x1bW5JbmZvKG1lc3NhZ2UsIG9UYWJsZSk7XG5cdFx0aWYgKHNUYWJsZVRhcmdldENvbE5hbWUpIHtcblx0XHRcdC8vIGlmIGNvbHVtbiBpbiBwcmVzZW50IGluIHRhYmxlIGRlZmluaXRpb25cblx0XHRcdHNDb2x1bW5JbmZvID0gYCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX01FU1NBR0VfR1JPVVBfREVTQ1JJUFRJT05fVEFCTEVfQ09MVU1OXCIpfTogJHtzVGFibGVUYXJnZXRDb2xOYW1lfWA7XG5cdFx0fSBlbHNlIGlmIChvQ29sRnJvbVRhYmxlU2V0dGluZ3MpIHtcblx0XHRcdGlmIChvQ29sRnJvbVRhYmxlU2V0dGluZ3MuYXZhaWxhYmlsaXR5ID09PSBcIkhpZGRlblwiKSB7XG5cdFx0XHRcdC8vIGlmIGNvbHVtbiBpbiBuZWl0aGVyIGluIHRhYmxlIGRlZmluaXRpb24gbm9yIHBlcnNvbmFsaXphdGlvblxuXHRcdFx0XHRpZiAobWVzc2FnZS5nZXRUeXBlKCkgPT09IFwiRXJyb3JcIikge1xuXHRcdFx0XHRcdHNDb2x1bW5JbmZvID0gc1RhYmxlRmlyc3RDb2xQcm9wZXJ0eVxuXHRcdFx0XHRcdFx0PyBgJHtvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfQ09MVU1OX0FWQUlMQUJMRV9ESUFHTk9TSVNfTVNHREVTQ19FUlJPUlwiKX0gJHtvVGFibGVSb3dDb250ZXh0LmdldFZhbHVlKFxuXHRcdFx0XHRcdFx0XHRcdHNUYWJsZUZpcnN0Q29sUHJvcGVydHlcblx0XHRcdFx0XHRcdCAgKX1gICsgXCIuXCJcblx0XHRcdFx0XHRcdDogYCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX0NPTFVNTl9BVkFJTEFCTEVfRElBR05PU0lTX01TR0RFU0NfRVJST1JcIil9YCArIFwiLlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNDb2x1bW5JbmZvID0gc1RhYmxlRmlyc3RDb2xQcm9wZXJ0eVxuXHRcdFx0XHRcdFx0PyBgJHtvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfQ09MVU1OX0FWQUlMQUJMRV9ESUFHTk9TSVNfTVNHREVTQ1wiKX0gJHtvVGFibGVSb3dDb250ZXh0LmdldFZhbHVlKFxuXHRcdFx0XHRcdFx0XHRcdHNUYWJsZUZpcnN0Q29sUHJvcGVydHlcblx0XHRcdFx0XHRcdCAgKX1gICsgXCIuXCJcblx0XHRcdFx0XHRcdDogYCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX0NPTFVNTl9BVkFJTEFCTEVfRElBR05PU0lTX01TR0RFU0NcIil9YCArIFwiLlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBpZiBjb2x1bW4gaXMgbm90IGluIHRhYmxlIGRlZmluaXRpb24gYnV0IGluIHBlcnNvbmFsaXphdGlvblxuXHRcdFx0XHQvL2lmIG5vIG5hdmlnYXRpb24gdG8gc3ViIG9wIHRoZW4gcmVtb3ZlIGxpbmsgdG8gZXJyb3IgZmllbGQgQkNQIDogMjI4MDE2ODg5OVxuXHRcdFx0XHRpZiAoIXRoaXMuX25hdmlnYXRpb25Db25maWd1cmVkKG9UYWJsZSkpIHtcblx0XHRcdFx0XHRtZXNzYWdlLnNldEFjdGl2ZVRpdGxlKGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzQ29sdW1uSW5mbyA9IGAke29SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9NRVNTQUdFX0dST1VQX0RFU0NSSVBUSU9OX1RBQkxFX0NPTFVNTlwiKX06ICR7XG5cdFx0XHRcdFx0b0NvbEZyb21UYWJsZVNldHRpbmdzLmxhYmVsXG5cdFx0XHRcdH0gKCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX0NPTFVNTl9JTkRJQ0FUT1JfSU5fVEFCTEVfREVGSU5JVElPTlwiKX0pYDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29uc3Qgb0ZpZWxkc0FmZmVjdGVkVGl0bGUgPSBuZXcgRm9ybWF0dGVkVGV4dCh7XG5cdFx0XHRodG1sVGV4dDogYDxodG1sPjxib2R5PjxzdHJvbmc+JHtvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfRklFTERTX0FGRkVDVEVEX1RJVExFXCIpfTwvc3Ryb25nPjwvYm9keT48L2h0bWw+PGJyPmBcblx0XHR9KTtcblx0XHRsZXQgc0ZpZWxkQWZmZWN0ZWRUZXh0OiBTdHJpbmc7XG5cdFx0aWYgKHNUYWJsZUZpcnN0Q29sUHJvcGVydHkpIHtcblx0XHRcdHNGaWVsZEFmZmVjdGVkVGV4dCA9IGAke29GaWVsZHNBZmZlY3RlZFRpdGxlLmdldEh0bWxUZXh0KCl9PGJyPiR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXG5cdFx0XHRcdFwiVF9NRVNTQUdFX0dST1VQX1RJVExFX1RBQkxFX0RFTk9NSU5BVE9SXCJcblx0XHRcdCl9OiAke29UYWJsZS5nZXRIZWFkZXIoKX08YnI+JHtvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfTUVTU0FHRV9HUk9VUF9ERVNDUklQVElPTl9UQUJMRV9ST1dcIil9OiAke29UYWJsZVJvd0NvbnRleHQuZ2V0VmFsdWUoXG5cdFx0XHRcdHNUYWJsZUZpcnN0Q29sUHJvcGVydHlcblx0XHRcdCl9PGJyPiR7c0NvbHVtbkluZm99PGJyPmA7XG5cdFx0fSBlbHNlIGlmIChzQ29sdW1uSW5mbyA9PSBcIlwiIHx8ICFzQ29sdW1uSW5mbykge1xuXHRcdFx0c0ZpZWxkQWZmZWN0ZWRUZXh0ID0gXCJcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c0ZpZWxkQWZmZWN0ZWRUZXh0ID0gYCR7b0ZpZWxkc0FmZmVjdGVkVGl0bGUuZ2V0SHRtbFRleHQoKX08YnI+JHtvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcblx0XHRcdFx0XCJUX01FU1NBR0VfR1JPVVBfVElUTEVfVEFCTEVfREVOT01JTkFUT1JcIlxuXHRcdFx0KX06ICR7b1RhYmxlLmdldEhlYWRlcigpfTxicj4ke3NDb2x1bW5JbmZvfTxicj5gO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9EaWFnbm9zaXNUaXRsZSA9IG5ldyBGb3JtYXR0ZWRUZXh0KHtcblx0XHRcdGh0bWxUZXh0OiBgPGh0bWw+PGJvZHk+PHN0cm9uZz4ke29SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9ESUFHTk9TSVNfVElUTEVcIil9PC9zdHJvbmc+PC9ib2R5PjwvaHRtbD48YnI+YFxuXHRcdH0pO1xuXHRcdC8vIGdldCB0aGUgVUkgbWVzc2FnZXMgZnJvbSB0aGUgbWVzc2FnZSBjb250ZXh0IHRvIHNldCBpdCB0byBEaWFnbm9zaXMgc2VjdGlvblxuXHRcdGNvbnN0IHNVSU1lc3NhZ2VEZXNjcmlwdGlvbiA9IG1lc3NhZ2UuZ2V0QmluZGluZ0NvbnRleHQoXCJtZXNzYWdlXCIpLmdldE9iamVjdCgpLmRlc2NyaXB0aW9uO1xuXHRcdC8vc2V0IHRoZSBkZXNjcmlwdGlvbiB0byBudWxsIHRvIHJlc2V0IGl0IGJlbG93XG5cdFx0bWVzc2FnZS5zZXREZXNjcmlwdGlvbihudWxsKTtcblx0XHRsZXQgc0RpYWdub3Npc1RleHQgPSBcIlwiO1xuXHRcdGxldCBzTWVzc2FnZURlc2NyaXB0aW9uQ29udGVudCA9IFwiXCI7XG5cdFx0aWYgKG1lc3NhZ2UuZ2V0TG9uZ3RleHRVcmwoKSkge1xuXHRcdFx0c01lc3NhZ2VEZXNjcmlwdGlvbkNvbnRlbnQgPSBgJHtzRmllbGRBZmZlY3RlZFRleHR9PGJyPmA7XG5cdFx0XHR0aGlzLl9zZXRMb25ndGV4dFVybERlc2NyaXB0aW9uKHNNZXNzYWdlRGVzY3JpcHRpb25Db250ZW50LCBvRGlhZ25vc2lzVGl0bGUpO1xuXHRcdH0gZWxzZSBpZiAoc1VJTWVzc2FnZURlc2NyaXB0aW9uKSB7XG5cdFx0XHRzRGlhZ25vc2lzVGV4dCA9IGAke29EaWFnbm9zaXNUaXRsZS5nZXRIdG1sVGV4dCgpfTxicj4ke3NVSU1lc3NhZ2VEZXNjcmlwdGlvbn1gO1xuXHRcdFx0c01lc3NhZ2VEZXNjcmlwdGlvbkNvbnRlbnQgPSBgJHtzRmllbGRBZmZlY3RlZFRleHR9PGJyPiR7c0RpYWdub3Npc1RleHR9YDtcblx0XHRcdG1lc3NhZ2Uuc2V0RGVzY3JpcHRpb24oc01lc3NhZ2VEZXNjcmlwdGlvbkNvbnRlbnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtZXNzYWdlLnNldERlc2NyaXB0aW9uKHNGaWVsZEFmZmVjdGVkVGV4dCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byBzZXQgdGhlIGJ1dHRvbiB0ZXh0LCBjb3VudCBhbmQgaWNvbiBwcm9wZXJ0eSBiYXNlZCB1cG9uIHRoZSBtZXNzYWdlIGl0ZW1zXG5cdCAqIEJ1dHRvblR5cGU6ICBQb3NzaWJsZSBzZXR0aW5ncyBmb3Igd2FybmluZyBhbmQgZXJyb3IgbWVzc2FnZXMgYXJlICdjcml0aWNhbCcgYW5kICduZWdhdGl2ZScuXG5cdCAqXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfc2V0TWVzc2FnZURhdGEoKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX3NldE1lc3NhZ2VEYXRhVGltZW91dCk7XG5cblx0XHR0aGlzLl9zZXRNZXNzYWdlRGF0YVRpbWVvdXQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHNJY29uID0gXCJcIixcblx0XHRcdFx0b01lc3NhZ2VzID0gdGhpcy5vTWVzc2FnZVBvcG92ZXIuZ2V0SXRlbXMoKSxcblx0XHRcdFx0b01lc3NhZ2VDb3VudDogYW55ID0geyBFcnJvcjogMCwgV2FybmluZzogMCwgU3VjY2VzczogMCwgSW5mb3JtYXRpb246IDAgfSxcblx0XHRcdFx0b1Jlc291cmNlQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKSxcblx0XHRcdFx0aU1lc3NhZ2VMZW5ndGggPSBvTWVzc2FnZXMubGVuZ3RoO1xuXHRcdFx0bGV0IHNCdXR0b25UeXBlID0gQnV0dG9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0XHRzTWVzc2FnZUtleSA9IFwiXCIsXG5cdFx0XHRcdHNUb29sdGlwVGV4dCA9IFwiXCIsXG5cdFx0XHRcdHNNZXNzYWdlVGV4dCA9IFwiXCI7XG5cdFx0XHRpZiAoaU1lc3NhZ2VMZW5ndGggPiAwKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaU1lc3NhZ2VMZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmICghb01lc3NhZ2VzW2ldLmdldFR5cGUoKSB8fCBvTWVzc2FnZXNbaV0uZ2V0VHlwZSgpID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHQrK29NZXNzYWdlQ291bnRbXCJJbmZvcm1hdGlvblwiXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0KytvTWVzc2FnZUNvdW50W29NZXNzYWdlc1tpXS5nZXRUeXBlKCldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob01lc3NhZ2VDb3VudFtNZXNzYWdlVHlwZS5FcnJvcl0gPiAwKSB7XG5cdFx0XHRcdFx0c0J1dHRvblR5cGUgPSBCdXR0b25UeXBlLk5lZ2F0aXZlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG9NZXNzYWdlQ291bnRbTWVzc2FnZVR5cGUuV2FybmluZ10gPiAwKSB7XG5cdFx0XHRcdFx0c0J1dHRvblR5cGUgPSBCdXR0b25UeXBlLkNyaXRpY2FsO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG9NZXNzYWdlQ291bnRbTWVzc2FnZVR5cGUuU3VjY2Vzc10gPiAwKSB7XG5cdFx0XHRcdFx0c0J1dHRvblR5cGUgPSBCdXR0b25UeXBlLlN1Y2Nlc3M7XG5cdFx0XHRcdH0gZWxzZSBpZiAob01lc3NhZ2VDb3VudFtNZXNzYWdlVHlwZS5JbmZvcm1hdGlvbl0gPiAwKSB7XG5cdFx0XHRcdFx0c0J1dHRvblR5cGUgPSBCdXR0b25UeXBlLk5ldXRyYWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9NZXNzYWdlQ291bnQuRXJyb3IgPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRUZXh0KG9NZXNzYWdlQ291bnQuRXJyb3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2V0VGV4dChcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob01lc3NhZ2VDb3VudC5FcnJvciA9PT0gMSkge1xuXHRcdFx0XHRcdHNNZXNzYWdlS2V5ID0gXCJDX0NPTU1PTl9TQVBGRV9FUlJPUl9NRVNTQUdFU19QQUdFX1RJVExFX0VSUk9SXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAob01lc3NhZ2VDb3VudC5FcnJvciA+IDEpIHtcblx0XHRcdFx0XHRzTWVzc2FnZUtleSA9IFwiQ19DT01NT05fU0FQRkVfRVJST1JfTUVTU0FHRVNfUEFHRV9NVUxUSVBMRV9FUlJPUl9UT09MVElQXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIW9NZXNzYWdlQ291bnQuRXJyb3IgJiYgb01lc3NhZ2VDb3VudC5XYXJuaW5nKSB7XG5cdFx0XHRcdFx0c01lc3NhZ2VLZXkgPSBcIkNfQ09NTU9OX1NBUEZFX0VSUk9SX01FU1NBR0VTX1BBR0VfV0FSTklOR19UT09MVElQXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIW9NZXNzYWdlQ291bnQuRXJyb3IgJiYgIW9NZXNzYWdlQ291bnQuV2FybmluZyAmJiBvTWVzc2FnZUNvdW50LkluZm9ybWF0aW9uKSB7XG5cdFx0XHRcdFx0c01lc3NhZ2VLZXkgPSBcIkNfTUVTU0FHRV9IQU5ETElOR19TQVBGRV9FUlJPUl9NRVNTQUdFU19QQUdFX1RJVExFX0lORk9cIjtcblx0XHRcdFx0fSBlbHNlIGlmICghb01lc3NhZ2VDb3VudC5FcnJvciAmJiAhb01lc3NhZ2VDb3VudC5XYXJuaW5nICYmICFvTWVzc2FnZUNvdW50LkluZm9ybWF0aW9uICYmIG9NZXNzYWdlQ291bnQuU3VjY2Vzcykge1xuXHRcdFx0XHRcdHNNZXNzYWdlS2V5ID0gXCJDX01FU1NBR0VfSEFORExJTkdfU0FQRkVfRVJST1JfTUVTU0FHRVNfUEFHRV9USVRMRV9TVUNDRVNTXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNNZXNzYWdlS2V5KSB7XG5cdFx0XHRcdFx0c01lc3NhZ2VUZXh0ID0gb1Jlc291cmNlQnVuZGxlLmdldFRleHQoc01lc3NhZ2VLZXkpO1xuXHRcdFx0XHRcdHNUb29sdGlwVGV4dCA9IG9NZXNzYWdlQ291bnQuRXJyb3IgPyBgJHtvTWVzc2FnZUNvdW50LkVycm9yfSAke3NNZXNzYWdlVGV4dH1gIDogc01lc3NhZ2VUZXh0O1xuXHRcdFx0XHRcdHRoaXMuc2V0VG9vbHRpcChzVG9vbHRpcFRleHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2V0SWNvbihzSWNvbik7XG5cdFx0XHRcdHRoaXMuc2V0VHlwZShzQnV0dG9uVHlwZSk7XG5cdFx0XHRcdHRoaXMuc2V0VmlzaWJsZSh0cnVlKTtcblx0XHRcdFx0Y29uc3Qgb1ZpZXcgPSBDb3JlLmJ5SWQodGhpcy5zVmlld0lkKSBhcyBWaWV3O1xuXHRcdFx0XHRpZiAob1ZpZXcpIHtcblx0XHRcdFx0XHRjb25zdCBvUGFnZVJlYWR5ID0gKG9WaWV3LmdldENvbnRyb2xsZXIoKSBhcyBQYWdlQ29udHJvbGxlcikucGFnZVJlYWR5O1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRhd2FpdCBvUGFnZVJlYWR5LndhaXRQYWdlUmVhZHkoKTtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuX2FwcGx5R3JvdXBpbmdBc3luYyhvVmlldyk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJmYWlsIGdyb3VwaW5nIG1lc3NhZ2VzXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQodGhpcyBhcyBhbnkpLmZpcmVNZXNzYWdlQ2hhbmdlKHtcblx0XHRcdFx0XHRcdGlNZXNzYWdlTGVuZ3RoOiBpTWVzc2FnZUxlbmd0aFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpTWVzc2FnZUxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHR0aGlzLm9NZXNzYWdlUG9wb3Zlci5uYXZpZ2F0ZUJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0KHRoaXMgYXMgYW55KS5maXJlTWVzc2FnZUNoYW5nZSh7XG5cdFx0XHRcdFx0aU1lc3NhZ2VMZW5ndGg6IGlNZXNzYWdlTGVuZ3RoXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHRfYklzT3JwaGFuRWxlbWVudChvRWxlbWVudDogYW55LCBhRWxlbWVudHM6IGFueVtdKSB7XG5cdFx0cmV0dXJuICFhRWxlbWVudHMuc29tZShcblx0XHRcdGZ1bmN0aW9uIChvT3JwaGFuRWxlbWVudDogYW55LCBvRWxlbTogYW55KSB7XG5cdFx0XHRcdGxldCBvUGFyZW50RWxlbWVudCA9IG9PcnBoYW5FbGVtZW50LmdldFBhcmVudCgpO1xuXHRcdFx0XHR3aGlsZSAob1BhcmVudEVsZW1lbnQgJiYgb1BhcmVudEVsZW1lbnQgIT09IG9FbGVtKSB7XG5cdFx0XHRcdFx0b1BhcmVudEVsZW1lbnQgPSBvUGFyZW50RWxlbWVudC5nZXRQYXJlbnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb1BhcmVudEVsZW1lbnQgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHR9LmJpbmQodGhpcywgb0VsZW1lbnQpXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiB0aGUgdGl0bGUgb2YgdGhlIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfYWN0aXZlVGl0bGVQcmVzc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0gb0V2ZW50IEV2ZW50IG9iamVjdCBwYXNzZWQgZnJvbSB0aGUgaGFuZGxlclxuXHQgKi9cblx0YXN5bmMgX2FjdGl2ZVRpdGxlUHJlc3Mob0V2ZW50OiBDb3JlRXZlbnQpIHtcblx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSB0aGlzLmdldEJpbmRpbmdDb250ZXh0KFwicGFnZUludGVybmFsXCIpO1xuXHRcdChvSW50ZXJuYWxNb2RlbENvbnRleHQgYXMgYW55KS5zZXRQcm9wZXJ0eShcImVycm9yTmF2aWdhdGlvblNlY3Rpb25GbGFnXCIsIHRydWUpO1xuXHRcdGNvbnN0IG9JdGVtID0gb0V2ZW50LmdldFBhcmFtZXRlcihcIml0ZW1cIiksXG5cdFx0XHRvTWVzc2FnZSA9IG9JdGVtLmdldEJpbmRpbmdDb250ZXh0KFwibWVzc2FnZVwiKS5nZXRPYmplY3QoKSxcblx0XHRcdGJJc0JhY2tlbmRNZXNzYWdlID0gbmV3IFJlZ0V4cChcIl4vXCIpLnRlc3Qob01lc3NhZ2UuZ2V0VGFyZ2V0KCkpLFxuXHRcdFx0b1ZpZXcgPSBDb3JlLmJ5SWQodGhpcy5zVmlld0lkKSBhcyBWaWV3O1xuXHRcdGxldCBvQ29udHJvbCwgc1NlY3Rpb25UaXRsZTtcblx0XHRjb25zdCBfZGVmYXVsdEZvY3VzID0gZnVuY3Rpb24gKG1lc3NhZ2U6IGFueSwgbWRjVGFibGU6IGFueSkge1xuXHRcdFx0Y29uc3QgZm9jdXNJbmZvID0geyBwcmV2ZW50U2Nyb2xsOiB0cnVlLCB0YXJnZXRJbmZvOiBtZXNzYWdlIH07XG5cdFx0XHRtZGNUYWJsZS5mb2N1cyhmb2N1c0luZm8pO1xuXHRcdH07XG5cblx0XHQvL2NoZWNrIGlmIHRoZSBwcmVzc2VkIGl0ZW0gaXMgcmVsYXRlZCB0byBhIHRhYmxlIGNvbnRyb2xcblx0XHRpZiAob0l0ZW0uZ2V0R3JvdXBOYW1lKCkuaW5kZXhPZihcIlRhYmxlOlwiKSAhPT0gLTEpIHtcblx0XHRcdGxldCBvVGFyZ2V0TWRjVGFibGU6IGFueTtcblx0XHRcdGlmIChiSXNCYWNrZW5kTWVzc2FnZSkge1xuXHRcdFx0XHRvVGFyZ2V0TWRjVGFibGUgPSBvTWVzc2FnZS5jb250cm9sSWRzXG5cdFx0XHRcdFx0Lm1hcChmdW5jdGlvbiAoc0NvbnRyb2xJZDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjb250cm9sID0gQ29yZS5ieUlkKHNDb250cm9sSWQpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgb1BhcmVudENvbnRyb2wgPSBjb250cm9sICYmIChjb250cm9sLmdldFBhcmVudCgpIGFzIGFueSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb1BhcmVudENvbnRyb2wgJiZcblx0XHRcdFx0XHRcdFx0b1BhcmVudENvbnRyb2wuaXNBKFwic2FwLnVpLm1kYy5UYWJsZVwiKSAmJlxuXHRcdFx0XHRcdFx0XHRvUGFyZW50Q29udHJvbC5nZXRIZWFkZXIoKSA9PT0gb0l0ZW0uZ2V0R3JvdXBOYW1lKCkuc3BsaXQoXCIsIFRhYmxlOiBcIilbMV1cblx0XHRcdFx0XHRcdFx0PyBvUGFyZW50Q29udHJvbFxuXHRcdFx0XHRcdFx0XHQ6IG51bGw7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQucmVkdWNlKGZ1bmN0aW9uIChhY2M6IGFueSwgdmFsOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiB2YWwgPyB2YWwgOiBhY2M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChvVGFyZ2V0TWRjVGFibGUpIHtcblx0XHRcdFx0XHRzU2VjdGlvblRpdGxlID0gb0l0ZW0uZ2V0R3JvdXBOYW1lKCkuc3BsaXQoXCIsIFwiKVswXTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5fbmF2aWdhdGVGcm9tTWVzc2FnZVRvU2VjdGlvblRhYmxlSW5JY29uVGFiQmFyTW9kZShcblx0XHRcdFx0XHRcdFx0b1RhcmdldE1kY1RhYmxlLFxuXHRcdFx0XHRcdFx0XHR0aGlzLm9PYmplY3RQYWdlTGF5b3V0LFxuXHRcdFx0XHRcdFx0XHRzU2VjdGlvblRpdGxlXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgb1JlZkVycm9yQ29udGV4dCA9IHRoaXMuX2dldFRhYmxlUmVmRXJyb3JDb250ZXh0KG9UYXJnZXRNZGNUYWJsZSk7XG5cdFx0XHRcdFx0XHRjb25zdCBvUmVmRXJyb3IgPSBvUmVmRXJyb3JDb250ZXh0LmdldFByb3BlcnR5KG9JdGVtLmdldEJpbmRpbmdDb250ZXh0KFwibWVzc2FnZVwiKS5nZXRPYmplY3QoKS5nZXRJZCgpKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9zZXRGb2N1c09uVGFyZ2V0RmllbGQgPSBhc3luYyAodGFyZ2V0TWRjVGFibGU6IGFueSwgaVJvd0luZGV4OiBudW1iZXIpOiBQcm9taXNlPGFueT4gPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBhVGFyZ2V0TWRjVGFibGVSb3cgPSB0aGlzLl9nZXRNZGNUYWJsZVJvd3ModGFyZ2V0TWRjVGFibGUpLFxuXHRcdFx0XHRcdFx0XHRcdGlGaXJzdFZpc2libGVSb3cgPSB0aGlzLl9nZXRHcmlkVGFibGUodGFyZ2V0TWRjVGFibGUpLmdldEZpcnN0VmlzaWJsZVJvdygpO1xuXHRcdFx0XHRcdFx0XHRpZiAoYVRhcmdldE1kY1RhYmxlUm93Lmxlbmd0aCA+IDAgJiYgYVRhcmdldE1kY1RhYmxlUm93WzBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb1RhcmdldFJvdyA9IGFUYXJnZXRNZGNUYWJsZVJvd1tpUm93SW5kZXggLSBpRmlyc3RWaXNpYmxlUm93XSxcblx0XHRcdFx0XHRcdFx0XHRcdG9UYXJnZXRDZWxsID0gdGhpcy5nZXRUYXJnZXRDZWxsKG9UYXJnZXRSb3csIG9NZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAob1RhcmdldENlbGwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0Rm9jdXNUb0NvbnRyb2wob1RhcmdldENlbGwpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gY29udHJvbCBub3QgZm91bmQgb24gdGFibGVcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGVycm9yUHJvcGVydHkgPSBvTWVzc2FnZS5nZXRUYXJnZXQoKS5zcGxpdChcIi9cIikucG9wKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3JQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQob1ZpZXcuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKSBhcyBKU09OTW9kZWwpLnNldFByb3BlcnR5KFwiL21lc3NhZ2VUYXJnZXRQcm9wZXJ0eVwiLCBlcnJvclByb3BlcnR5KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLl9uYXZpZ2F0aW9uQ29uZmlndXJlZCh0YXJnZXRNZGNUYWJsZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChvVmlldy5nZXRDb250cm9sbGVyKCkgYXMgUGFnZUNvbnRyb2xsZXIpLl9yb3V0aW5nLm5hdmlnYXRlRm9yd2FyZFRvQ29udGV4dChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvVGFyZ2V0Um93LmdldEJpbmRpbmdDb250ZXh0KClcblx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRpZiAob1RhcmdldE1kY1RhYmxlLmRhdGEoXCJ0YWJsZVR5cGVcIikgPT09IFwiR3JpZFRhYmxlXCIgJiYgb1JlZkVycm9yLnJvd0luZGV4ICE9PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGlGaXJzdFZpc2libGVSb3cgPSB0aGlzLl9nZXRHcmlkVGFibGUob1RhcmdldE1kY1RhYmxlKS5nZXRGaXJzdFZpc2libGVSb3coKTtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRhd2FpdCBvVGFyZ2V0TWRjVGFibGUuc2Nyb2xsVG9JbmRleChvUmVmRXJyb3Iucm93SW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGFUYXJnZXRNZGNUYWJsZVJvdyA9IHRoaXMuX2dldE1kY1RhYmxlUm93cyhvVGFyZ2V0TWRjVGFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGxldCBpTmV3Rmlyc3RWaXNpYmxlUm93LCBiU2Nyb2xsTmVlZGVkO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhVGFyZ2V0TWRjVGFibGVSb3cubGVuZ3RoID4gMCAmJiBhVGFyZ2V0TWRjVGFibGVSb3dbMF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlOZXdGaXJzdFZpc2libGVSb3cgPSBhVGFyZ2V0TWRjVGFibGVSb3dbMF0uZ2V0UGFyZW50KCkuZ2V0Rmlyc3RWaXNpYmxlUm93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRiU2Nyb2xsTmVlZGVkID0gaUZpcnN0VmlzaWJsZVJvdyAtIGlOZXdGaXJzdFZpc2libGVSb3cgIT09IDA7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGxldCBvV2FpdENvbnRyb2xJZEFkZGVkOiBQcm9taXNlPHZvaWQ+O1xuXHRcdFx0XHRcdFx0XHRcdGlmIChiU2Nyb2xsTmVlZGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL1RoZSBzY3JvbGxUb0luZGV4IGZ1bmN0aW9uIGRvZXMgbm90IHdhaXQgZm9yIHRoZSBVSSB1cGRhdGUuIEFzIGEgd29ya2Fyb3VuZCwgcGVuZGluZyBhIGZpeCBmcm9tIE1EQyAoQkNQOiAyMTcwMjUxNjMxKSB3ZSB1c2UgdGhlIGV2ZW50IFwiVUlVcGRhdGVkXCIuXG5cdFx0XHRcdFx0XHRcdFx0XHRvV2FpdENvbnRyb2xJZEFkZGVkID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Q29yZS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCByZXNvbHZlKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvV2FpdENvbnRyb2xJZEFkZGVkID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IG9XYWl0Q29udHJvbElkQWRkZWQ7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChhc3luYyBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBmb2N1c09uVGFyZ2V0RmllbGQgPSBhd2FpdCBfc2V0Rm9jdXNPblRhcmdldEZpZWxkKG9UYXJnZXRNZGNUYWJsZSwgb1JlZkVycm9yLnJvd0luZGV4KTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChmb2N1c09uVGFyZ2V0RmllbGQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9kZWZhdWx0Rm9jdXMob01lc3NhZ2UsIG9UYXJnZXRNZGNUYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGZvY3VzaW5nIG9uIGVycm9yXCIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG9UYXJnZXRNZGNUYWJsZS5kYXRhKFwidGFibGVUeXBlXCIpID09PSBcIlJlc3BvbnNpdmVUYWJsZVwiICYmIG9SZWZFcnJvcikge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmb2N1c09uTWVzc2FnZVRhcmdldENvbnRyb2wgPSBhd2FpdCB0aGlzLmZvY3VzT25NZXNzYWdlVGFyZ2V0Q29udHJvbChcblx0XHRcdFx0XHRcdFx0XHRvVmlldyxcblx0XHRcdFx0XHRcdFx0XHRvTWVzc2FnZSxcblx0XHRcdFx0XHRcdFx0XHRvVGFyZ2V0TWRjVGFibGUsXG5cdFx0XHRcdFx0XHRcdFx0b1JlZkVycm9yLnJvd0luZGV4XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdGlmIChmb2N1c09uTWVzc2FnZVRhcmdldENvbnRyb2wgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0X2RlZmF1bHRGb2N1cyhvTWVzc2FnZSwgb1RhcmdldE1kY1RhYmxlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5mb2N1c09uTWVzc2FnZVRhcmdldENvbnRyb2wob1ZpZXcsIG9NZXNzYWdlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkZhaWwgdG8gbmF2aWdhdGUgdG8gRXJyb3IgY29udHJvbFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9Db250cm9sID0gQ29yZS5ieUlkKG9NZXNzYWdlLmNvbnRyb2xJZHNbMF0pO1xuXHRcdFx0XHQvL0lmIHRoZSBjb250cm9sIHVuZGVybHlpbmcgdGhlIGZyb250RW5kIG1lc3NhZ2UgaXMgbm90IHdpdGhpbiB0aGUgY3VycmVudCBzZWN0aW9uLCB3ZSBmaXJzdCBnbyBpbnRvIHRoZSB0YXJnZXQgc2VjdGlvbjpcblx0XHRcdFx0Y29uc3Qgb1NlbGVjdGVkU2VjdGlvbjogYW55ID0gQ29yZS5ieUlkKHRoaXMub09iamVjdFBhZ2VMYXlvdXQuZ2V0U2VsZWN0ZWRTZWN0aW9uKCkpO1xuXHRcdFx0XHRpZiAob1NlbGVjdGVkU2VjdGlvbj8uZmluZEVsZW1lbnRzKHRydWUpLmluZGV4T2Yob0NvbnRyb2wpID09PSAtMSkge1xuXHRcdFx0XHRcdHNTZWN0aW9uVGl0bGUgPSBvSXRlbS5nZXRHcm91cE5hbWUoKS5zcGxpdChcIiwgXCIpWzBdO1xuXHRcdFx0XHRcdHRoaXMuX25hdmlnYXRlRnJvbU1lc3NhZ2VUb1NlY3Rpb25Jbkljb25UYWJCYXJNb2RlKHRoaXMub09iamVjdFBhZ2VMYXlvdXQsIHNTZWN0aW9uVGl0bGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2V0Rm9jdXNUb0NvbnRyb2wob0NvbnRyb2wpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBmb2N1cyBvbiBjb250cm9sXG5cdFx0XHRzU2VjdGlvblRpdGxlID0gb0l0ZW0uZ2V0R3JvdXBOYW1lKCkuc3BsaXQoXCIsIFwiKVswXTtcblx0XHRcdHRoaXMuX25hdmlnYXRlRnJvbU1lc3NhZ2VUb1NlY3Rpb25Jbkljb25UYWJCYXJNb2RlKHRoaXMub09iamVjdFBhZ2VMYXlvdXQsIHNTZWN0aW9uVGl0bGUpO1xuXHRcdFx0dGhpcy5mb2N1c09uTWVzc2FnZVRhcmdldENvbnRyb2wob1ZpZXcsIG9NZXNzYWdlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIGEgdGFibGUgY2VsbCB0YXJnZXRlZCBieSBhIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRSb3cgQSB0YWJsZSByb3dcblx0ICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2UgTWVzc2FnZSB0YXJnZXRpbmcgYSBjZWxsXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNlbGxcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGdldFRhcmdldENlbGwodGFyZ2V0Um93OiBDb2x1bW5MaXN0SXRlbSwgbWVzc2FnZTogTWVzc2FnZSk6IFVJNUVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gbWVzc2FnZS5nZXRDb250cm9sSWRzKCkubGVuZ3RoID4gMFxuXHRcdFx0PyBtZXNzYWdlXG5cdFx0XHRcdFx0LmdldENvbnRyb2xJZHMoKVxuXHRcdFx0XHRcdC5tYXAoZnVuY3Rpb24gKGNvbnRyb2xJZDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpc0NvbnRyb2xJblRhYmxlID0gKHRhcmdldFJvdyBhcyBhbnkpLmZpbmRFbGVtZW50cyh0cnVlLCBmdW5jdGlvbiAoZWxlbTogYW55KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBlbGVtLmdldElkKCkgPT09IGNvbnRyb2xJZDtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGlzQ29udHJvbEluVGFibGUubGVuZ3RoID4gMCA/IENvcmUuYnlJZChjb250cm9sSWQpIDogbnVsbDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5yZWR1Y2UoZnVuY3Rpb24gKGFjYzogYW55LCB2YWw6IGFueSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbCA/IHZhbCA6IGFjYztcblx0XHRcdFx0XHR9KVxuXHRcdFx0OiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvY3VzIG9uIHRoZSBjb250cm9sIHRhcmdldGVkIGJ5IGEgbWVzc2FnZS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZpZXcgVGhlIGN1cnJlbnQgdmlld1xuXHQgKiBAcGFyYW0ge09iamVjdH0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0YXJnZXRpbmcgdGhlIGNvbnRyb2wgb24gd2hpY2ggd2Ugd2FudCB0byBzZXQgdGhlIGZvY3VzXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRNZGNUYWJsZSBUaGUgdGFibGUgdGFyZ2V0ZWQgYnkgdGhlIG1lc3NhZ2UgKG9wdGlvbmFsKVxuXHQgKiBAcGFyYW0ge251bWJlcn0gcm93SW5kZXggVGhlIHJvdyBpbmRleCBvZiB0aGUgdGFibGUgdGFyZ2V0ZWQgYnkgdGhlIG1lc3NhZ2UgKG9wdGlvbmFsKVxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YXN5bmMgZm9jdXNPbk1lc3NhZ2VUYXJnZXRDb250cm9sKHZpZXc6IFZpZXcsIG1lc3NhZ2U6IE1lc3NhZ2UsIHRhcmdldE1kY1RhYmxlPzogYW55LCByb3dJbmRleD86IG51bWJlcik6IFByb21pc2U8YW55PiB7XG5cdFx0Y29uc3QgYUFsbFZpZXdFbGVtZW50cyA9IHZpZXcuZmluZEVsZW1lbnRzKHRydWUpO1xuXHRcdGNvbnN0IGFFcnJvbmVvdXNDb250cm9scyA9IG1lc3NhZ2Vcblx0XHRcdC5nZXRDb250cm9sSWRzKClcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24gKHNDb250cm9sSWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gYUFsbFZpZXdFbGVtZW50cy5zb21lKGZ1bmN0aW9uIChvRWxlbSkge1xuXHRcdFx0XHRcdHJldHVybiBvRWxlbS5nZXRJZCgpID09PSBzQ29udHJvbElkICYmIG9FbGVtLmdldERvbVJlZigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pXG5cdFx0XHQubWFwKGZ1bmN0aW9uIChzQ29udHJvbElkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIENvcmUuYnlJZChzQ29udHJvbElkKTtcblx0XHRcdH0pO1xuXHRcdGNvbnN0IGFOb3RUYWJsZUVycm9uZW91c0NvbnRyb2xzID0gYUVycm9uZW91c0NvbnRyb2xzLmZpbHRlcihmdW5jdGlvbiAob0VsZW06IGFueSkge1xuXHRcdFx0cmV0dXJuICFvRWxlbS5pc0EoXCJzYXAubS5UYWJsZVwiKSAmJiAhb0VsZW0uaXNBKFwic2FwLnVpLnRhYmxlLlRhYmxlXCIpO1xuXHRcdH0pO1xuXHRcdC8vVGhlIGZvY3VzIGlzIHNldCBvbiBOb3QgVGFibGUgY29udHJvbCBpbiBwcmlvcml0eVxuXHRcdGlmIChhTm90VGFibGVFcnJvbmVvdXNDb250cm9scy5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLnNldEZvY3VzVG9Db250cm9sKGFOb3RUYWJsZUVycm9uZW91c0NvbnRyb2xzWzBdKTtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIGlmIChhRXJyb25lb3VzQ29udHJvbHMubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgYVRhcmdldE1kY1RhYmxlUm93ID0gdGFyZ2V0TWRjVGFibGVcblx0XHRcdFx0PyB0YXJnZXRNZGNUYWJsZS5maW5kRWxlbWVudHModHJ1ZSwgZnVuY3Rpb24gKG9FbGVtOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBvRWxlbS5pc0EoQ29sdW1uTGlzdEl0ZW0uZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCkpO1xuXHRcdFx0XHQgIH0pXG5cdFx0XHRcdDogW107XG5cdFx0XHRpZiAoYVRhcmdldE1kY1RhYmxlUm93Lmxlbmd0aCA+IDAgJiYgYVRhcmdldE1kY1RhYmxlUm93WzBdKSB7XG5cdFx0XHRcdGNvbnN0IG9UYXJnZXRSb3cgPSBhVGFyZ2V0TWRjVGFibGVSb3dbcm93SW5kZXggYXMgbnVtYmVyXTtcblx0XHRcdFx0Y29uc3Qgb1RhcmdldENlbGwgPSB0aGlzLmdldFRhcmdldENlbGwob1RhcmdldFJvdywgbWVzc2FnZSkgYXMgYW55O1xuXHRcdFx0XHRpZiAob1RhcmdldENlbGwpIHtcblx0XHRcdFx0XHRjb25zdCBvVGFyZ2V0RmllbGQgPSBvVGFyZ2V0Q2VsbC5pc0EoXCJzYXAuZmUubWFjcm9zLmZpZWxkLkZpZWxkQVBJXCIpXG5cdFx0XHRcdFx0XHQ/IG9UYXJnZXRDZWxsLmdldENvbnRlbnQoKS5nZXRDb250ZW50RWRpdCgpWzBdXG5cdFx0XHRcdFx0XHQ6IG9UYXJnZXRDZWxsLmdldEl0ZW1zKClbMF0uZ2V0Q29udGVudCgpLmdldENvbnRlbnRFZGl0KClbMF07XG5cdFx0XHRcdFx0dGhpcy5zZXRGb2N1c1RvQ29udHJvbChvVGFyZ2V0RmllbGQpO1xuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JQcm9wZXJ0eSA9IG1lc3NhZ2UuZ2V0VGFyZ2V0KCkuc3BsaXQoXCIvXCIpLnBvcCgpO1xuXHRcdFx0XHRcdGlmIChlcnJvclByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHQodmlldy5nZXRNb2RlbChcImludGVybmFsXCIpIGFzIEpTT05Nb2RlbCkuc2V0UHJvcGVydHkoXCIvbWVzc2FnZVRhcmdldFByb3BlcnR5XCIsIGVycm9yUHJvcGVydHkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5fbmF2aWdhdGlvbkNvbmZpZ3VyZWQodGFyZ2V0TWRjVGFibGUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKHZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIFBhZ2VDb250cm9sbGVyKS5fcm91dGluZy5uYXZpZ2F0ZUZvcndhcmRUb0NvbnRleHQob1RhcmdldFJvdy5nZXRCaW5kaW5nQ29udGV4dCgpKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdF9nZXRUYWJsZUNvbEluZm8ob1RhYmxlOiBhbnksIHNUYWJsZVRhcmdldENvbFByb3BlcnR5OiBzdHJpbmcpIHtcblx0XHRsZXQgc1RhYmxlVGFyZ2V0Q29sTmFtZTtcblx0XHRsZXQgb1RhYmxlVGFyZ2V0Q29sID0gb1RhYmxlLmdldENvbHVtbnMoKS5maW5kKFxuXHRcdFx0ZnVuY3Rpb24gKHRhZ2V0Q29sdW1uUHJvcGVydHk6IGFueSwgY29sdW1uOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGNvbHVtbi5nZXREYXRhUHJvcGVydHkoKSA9PT0gdGFnZXRDb2x1bW5Qcm9wZXJ0eTtcblx0XHRcdH0uYmluZCh0aGlzLCBzVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSlcblx0XHQpO1xuXHRcdGlmICghb1RhYmxlVGFyZ2V0Q29sKSB7XG5cdFx0XHQvKiBJZiB0aGUgdGFyZ2V0IGNvbHVtbiBpcyBub3QgZm91bmQsIHdlIGNoZWNrIGZvciBhIGN1c3RvbSBjb2x1bW4gKi9cblx0XHRcdGNvbnN0IG9DdXN0b21Db2x1bW4gPSBvVGFibGVcblx0XHRcdFx0LmdldENvbnRyb2xEZWxlZ2F0ZSgpXG5cdFx0XHRcdC5nZXRDb2x1bW5zRm9yKG9UYWJsZSlcblx0XHRcdFx0LmZpbmQoZnVuY3Rpb24gKG9Db2x1bW46IGFueSkge1xuXHRcdFx0XHRcdGlmICghIW9Db2x1bW4udGVtcGxhdGUgJiYgb0NvbHVtbi5wcm9wZXJ0eUluZm9zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRvQ29sdW1uLnByb3BlcnR5SW5mb3NbMF0gPT09IHNUYWJsZVRhcmdldENvbFByb3BlcnR5IHx8XG5cdFx0XHRcdFx0XHRcdG9Db2x1bW4ucHJvcGVydHlJbmZvc1swXS5yZXBsYWNlKFwiUHJvcGVydHk6OlwiLCBcIlwiKSA9PT0gc1RhYmxlVGFyZ2V0Q29sUHJvcGVydHlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0aWYgKG9DdXN0b21Db2x1bW4pIHtcblx0XHRcdFx0b1RhYmxlVGFyZ2V0Q29sID0gb0N1c3RvbUNvbHVtbjtcblx0XHRcdFx0c1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkgPSBvVGFibGVUYXJnZXRDb2wubmFtZTtcblxuXHRcdFx0XHRzVGFibGVUYXJnZXRDb2xOYW1lID0gb1RhYmxlXG5cdFx0XHRcdFx0LmdldENvbHVtbnMoKVxuXHRcdFx0XHRcdC5maW5kKGZ1bmN0aW9uIChvQ29sdW1uOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSA9PT0gb0NvbHVtbi5nZXREYXRhUHJvcGVydHkoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5nZXRIZWFkZXIoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8qIElmIHRoZSB0YXJnZXQgY29sdW1uIGlzIG5vdCBmb3VuZCwgd2UgY2hlY2sgZm9yIGEgZmllbGQgZ3JvdXAgKi9cblx0XHRcdFx0Y29uc3QgYUNvbHVtbnMgPSBvVGFibGUuZ2V0Q29udHJvbERlbGVnYXRlKCkuZ2V0Q29sdW1uc0ZvcihvVGFibGUpO1xuXHRcdFx0XHRvVGFibGVUYXJnZXRDb2wgPSBhQ29sdW1ucy5maW5kKFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChhVGFibGVDb2x1bW5zOiBhbnlbXSwgdGFyZ2V0Q29sdW1uUHJvcGVydHk6IHN0cmluZywgb0NvbHVtbjogYW55KSB7XG5cdFx0XHRcdFx0XHRpZiAob0NvbHVtbi5rZXkuaW5kZXhPZihcIjo6RmllbGRHcm91cDo6XCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0NvbHVtbi5wcm9wZXJ0eUluZm9zLmZpbmQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBhVGFibGVDb2x1bW5zLmZpbmQoZnVuY3Rpb24gKHRhYmxlQ29sdW1uKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGFibGVDb2x1bW4ucmVsYXRpdmVQYXRoID09PSB0YXJnZXRDb2x1bW5Qcm9wZXJ0eTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fS5iaW5kKHRoaXMsIGFDb2x1bW5zLCBzVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSlcblx0XHRcdFx0KTtcblx0XHRcdFx0LyogY2hlY2sgaWYgdGhlIGNvbHVtbiB3aXRoIHRoZSBmaWVsZCBncm91cCBpcyB2aXNpYmxlIGluIHRoZSB0YWJsZTogKi9cblx0XHRcdFx0bGV0IGJJc1RhYmxlVGFyZ2V0Q29sVmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRpZiAob1RhYmxlVGFyZ2V0Q29sICYmIG9UYWJsZVRhcmdldENvbC5sYWJlbCkge1xuXHRcdFx0XHRcdGJJc1RhYmxlVGFyZ2V0Q29sVmlzaWJsZSA9IG9UYWJsZS5nZXRDb2x1bW5zKCkuc29tZShmdW5jdGlvbiAoY29sdW1uOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBjb2x1bW4uZ2V0SGVhZGVyKCkgPT09IG9UYWJsZVRhcmdldENvbC5sYWJlbDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzVGFibGVUYXJnZXRDb2xOYW1lID0gYklzVGFibGVUYXJnZXRDb2xWaXNpYmxlICYmIG9UYWJsZVRhcmdldENvbC5sYWJlbDtcblx0XHRcdFx0c1RhYmxlVGFyZ2V0Q29sUHJvcGVydHkgPSBiSXNUYWJsZVRhcmdldENvbFZpc2libGUgJiYgb1RhYmxlVGFyZ2V0Q29sLmtleTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0c1RhYmxlVGFyZ2V0Q29sTmFtZSA9IG9UYWJsZVRhcmdldENvbCAmJiBvVGFibGVUYXJnZXRDb2wuZ2V0SGVhZGVyKCk7XG5cdFx0fVxuXHRcdHJldHVybiB7IHNUYWJsZVRhcmdldENvbE5hbWU6IHNUYWJsZVRhcmdldENvbE5hbWUsIHNUYWJsZVRhcmdldENvbFByb3BlcnR5OiBzVGFibGVUYXJnZXRDb2xQcm9wZXJ0eSB9O1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBvYmogVGhlIG1lc3NhZ2Ugb2JqZWN0XG5cdCAqIEBwYXJhbSBhU2VjdGlvbnMgVGhlIGFycmF5IG9mIHNlY3Rpb25zIGluIHRoZSBvYmplY3QgcGFnZVxuXHQgKiBAcmV0dXJucyBUaGUgcmFuayBvZiB0aGUgbWVzc2FnZVxuXHQgKi9cblx0X2dldE1lc3NhZ2VSYW5rKG9iajogYW55LCBhU2VjdGlvbnM6IGFueVtdKSB7XG5cdFx0aWYgKGFTZWN0aW9ucykge1xuXHRcdFx0bGV0IHNlY3Rpb24sIGFTdWJTZWN0aW9ucywgc3ViU2VjdGlvbiwgaiwgaywgYUVsZW1lbnRzLCBhQWxsRWxlbWVudHMsIHNlY3Rpb25SYW5rO1xuXHRcdFx0Zm9yIChqID0gYVNlY3Rpb25zLmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qKSB7XG5cdFx0XHRcdC8vIExvb3Agb3ZlciBhbGwgc2VjdGlvbnNcblx0XHRcdFx0c2VjdGlvbiA9IGFTZWN0aW9uc1tqXTtcblx0XHRcdFx0YVN1YlNlY3Rpb25zID0gc2VjdGlvbi5nZXRTdWJTZWN0aW9ucygpO1xuXHRcdFx0XHRmb3IgKGsgPSBhU3ViU2VjdGlvbnMubGVuZ3RoIC0gMTsgayA+PSAwOyAtLWspIHtcblx0XHRcdFx0XHQvLyBMb29wIG92ZXIgYWxsIHN1Yi1zZWN0aW9uc1xuXHRcdFx0XHRcdHN1YlNlY3Rpb24gPSBhU3ViU2VjdGlvbnNba107XG5cdFx0XHRcdFx0YUFsbEVsZW1lbnRzID0gc3ViU2VjdGlvbi5maW5kRWxlbWVudHModHJ1ZSk7IC8vIEdldCBhbGwgZWxlbWVudHMgaW5zaWRlIGEgc3ViLXNlY3Rpb25cblx0XHRcdFx0XHQvL1RyeSB0byBmaW5kIHRoZSBjb250cm9sIDEgaW5zaWRlIHRoZSBzdWIgc2VjdGlvblxuXHRcdFx0XHRcdGFFbGVtZW50cyA9IGFBbGxFbGVtZW50cy5maWx0ZXIodGhpcy5fZm5GaWx0ZXJVcG9uSWQuYmluZCh0aGlzLCBvYmouZ2V0Q29udHJvbElkKCkpKTtcblx0XHRcdFx0XHRzZWN0aW9uUmFuayA9IGogKyAxO1xuXHRcdFx0XHRcdGlmIChhRWxlbWVudHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0b2JqLnNlY3Rpb25OYW1lID0gc2VjdGlvbi5nZXRUaXRsZSgpO1xuXHRcdFx0XHRcdFx0b2JqLnN1YlNlY3Rpb25OYW1lID0gc3ViU2VjdGlvbi5nZXRUaXRsZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNlY3Rpb25SYW5rICogMTAgKyAoayArIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9pZiBzdWIgc2VjdGlvbiB0aXRsZSBpcyBPdGhlciBtZXNzYWdlcywgd2UgcmV0dXJuIGEgaGlnaCBudW1iZXIocmFuayksIHdoaWNoIGVuc3VyZXNcblx0XHRcdC8vdGhhdCBtZXNzYWdlcyBiZWxvbmdpbmcgdG8gdGhpcyBzdWIgc2VjdGlvbiBhbHdheXMgY29tZSBsYXRlciBpbiBtZXNzYWdlUG9wb3ZlclxuXHRcdFx0aWYgKCFvYmouc2VjdGlvbk5hbWUgJiYgIW9iai5zdWJTZWN0aW9uTmFtZSAmJiBvYmoucGVyc2lzdGVudCkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHRcdHJldHVybiA5OTk7XG5cdFx0fVxuXHRcdHJldHVybiA5OTk7XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHRvIHNldCB0aGUgZmlsdGVycyBiYXNlZCB1cG9uIHRoZSBtZXNzYWdlIGl0ZW1zXG5cdCAqIFRoZSBkZXNpcmVkIGZpbHRlciBvcGVyYXRpb24gaXM6XG5cdCAqICggZmlsdGVycyBwcm92aWRlZCBieSB1c2VyICYmICggdmFsaWRhdGlvbiA9IHRydWUgJiYgQ29udHJvbCBzaG91bGQgYmUgcHJlc2VudCBpbiB2aWV3ICkgfHwgbWVzc2FnZXMgZm9yIHRoZSBjdXJyZW50IG1hdGNoaW5nIGNvbnRleHQgKS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9hcHBseUZpbHRlcnNBbmRTb3J0KCkge1xuXHRcdGxldCBvVmFsaWRhdGlvbkZpbHRlcnMsXG5cdFx0XHRvVmFsaWRhdGlvbkFuZENvbnRleHRGaWx0ZXIsXG5cdFx0XHRvRmlsdGVycyxcblx0XHRcdHNQYXRoLFxuXHRcdFx0b1NvcnRlcixcblx0XHRcdG9EaWFsb2dGaWx0ZXIsXG5cdFx0XHRvYmplY3RQYWdlTGF5b3V0U2VjdGlvbnM6IGFueSA9IG51bGw7XG5cdFx0Y29uc3QgYVVzZXJEZWZpbmVkRmlsdGVyOiBhbnlbXSA9IFtdO1xuXHRcdGNvbnN0IGZpbHRlck91dE1lc3NhZ2VzSW5EaWFsb2cgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCBmblRlc3QgPSAoYUNvbnRyb2xJZHM6IHN0cmluZ1tdKSA9PiB7XG5cdFx0XHRcdGxldCBpbmRleCA9IEluZmluaXR5LFxuXHRcdFx0XHRcdG9Db250cm9sID0gQ29yZS5ieUlkKGFDb250cm9sSWRzWzBdKSBhcyBhbnk7XG5cdFx0XHRcdGNvbnN0IGVycm9yRmllbGRDb250cm9sID0gQ29yZS5ieUlkKGFDb250cm9sSWRzWzBdKTtcblx0XHRcdFx0d2hpbGUgKG9Db250cm9sKSB7XG5cdFx0XHRcdFx0Y29uc3QgZmllbGRSYW5raW5EaWFsb2cgPVxuXHRcdFx0XHRcdFx0b0NvbnRyb2wgaW5zdGFuY2VvZiBEaWFsb2dcblx0XHRcdFx0XHRcdFx0PyAoZXJyb3JGaWVsZENvbnRyb2w/LmdldFBhcmVudCgpIGFzIGFueSkuZmluZEVsZW1lbnRzKHRydWUpLmluZGV4T2YoZXJyb3JGaWVsZENvbnRyb2wpXG5cdFx0XHRcdFx0XHRcdDogSW5maW5pdHk7XG5cdFx0XHRcdFx0aWYgKG9Db250cm9sIGluc3RhbmNlb2YgRGlhbG9nKSB7XG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggPiBmaWVsZFJhbmtpbkRpYWxvZykge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IGZpZWxkUmFua2luRGlhbG9nO1xuXHRcdFx0XHRcdFx0XHQvLyBTZXQgdGhlIGZvY3VzIHRvIHRoZSBkaWFsb2cncyBjb250cm9sXG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0Rm9jdXNUb0NvbnRyb2woZXJyb3JGaWVsZENvbnRyb2wpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gbWVzc2FnZXMgZm9yIHNhcC5tLkRpYWxvZyBzaG91bGQgbm90IGFwcGVhciBpbiB0aGUgbWVzc2FnZSBidXR0b25cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b0NvbnRyb2wgPSBvQ29udHJvbC5nZXRQYXJlbnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gbmV3IEZpbHRlcih7XG5cdFx0XHRcdHBhdGg6IFwiY29udHJvbElkc1wiLFxuXHRcdFx0XHR0ZXN0OiBmblRlc3QsXG5cdFx0XHRcdGNhc2VTZW5zaXRpdmU6IHRydWVcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0Ly9GaWx0ZXIgZnVuY3Rpb24gdG8gdmVyaWZ5IGlmIHRoZSBjb250cm9sIGlzIHBhcnQgb2YgdGhlIGN1cnJlbnQgdmlldyBvciBub3Rcblx0XHRmdW5jdGlvbiBnZXRDaGVja0NvbnRyb2xJblZpZXdGaWx0ZXIoKSB7XG5cdFx0XHRjb25zdCBmblRlc3QgPSBmdW5jdGlvbiAoYUNvbnRyb2xJZHM6IHN0cmluZ1tdKSB7XG5cdFx0XHRcdGlmICghYUNvbnRyb2xJZHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBvQ29udHJvbDogYW55ID0gQ29yZS5ieUlkKGFDb250cm9sSWRzWzBdKTtcblx0XHRcdFx0d2hpbGUgKG9Db250cm9sKSB7XG5cdFx0XHRcdFx0aWYgKG9Db250cm9sLmdldElkKCkgPT09IHNWaWV3SWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob0NvbnRyb2wgaW5zdGFuY2VvZiBEaWFsb2cpIHtcblx0XHRcdFx0XHRcdC8vIG1lc3NhZ2VzIGZvciBzYXAubS5EaWFsb2cgc2hvdWxkIG5vdCBhcHBlYXIgaW4gdGhlIG1lc3NhZ2UgYnV0dG9uXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9Db250cm9sID0gb0NvbnRyb2wuZ2V0UGFyZW50KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBuZXcgRmlsdGVyKHtcblx0XHRcdFx0cGF0aDogXCJjb250cm9sSWRzXCIsXG5cdFx0XHRcdHRlc3Q6IGZuVGVzdCxcblx0XHRcdFx0Y2FzZVNlbnNpdGl2ZTogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5zVmlld0lkKSB7XG5cdFx0XHR0aGlzLnNWaWV3SWQgPSB0aGlzLl9nZXRWaWV3SWQodGhpcy5nZXRJZCgpKSBhcyBzdHJpbmc7XG5cdFx0fVxuXHRcdGNvbnN0IHNWaWV3SWQgPSB0aGlzLnNWaWV3SWQ7XG5cdFx0Ly9BZGQgdGhlIGZpbHRlcnMgcHJvdmlkZWQgYnkgdGhlIHVzZXJcblx0XHRjb25zdCBhQ3VzdG9tRmlsdGVycyA9IHRoaXMuZ2V0QWdncmVnYXRpb24oXCJjdXN0b21GaWx0ZXJzXCIpIGFzIGFueTtcblx0XHRpZiAoYUN1c3RvbUZpbHRlcnMpIHtcblx0XHRcdGFDdXN0b21GaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKGZpbHRlcjogYW55KSB7XG5cdFx0XHRcdGFVc2VyRGVmaW5lZEZpbHRlci5wdXNoKFxuXHRcdFx0XHRcdG5ldyBGaWx0ZXIoe1xuXHRcdFx0XHRcdFx0cGF0aDogZmlsdGVyLmdldFByb3BlcnR5KFwicGF0aFwiKSxcblx0XHRcdFx0XHRcdG9wZXJhdG9yOiBmaWx0ZXIuZ2V0UHJvcGVydHkoXCJvcGVyYXRvclwiKSxcblx0XHRcdFx0XHRcdHZhbHVlMTogZmlsdGVyLmdldFByb3BlcnR5KFwidmFsdWUxXCIpLFxuXHRcdFx0XHRcdFx0dmFsdWUyOiBmaWx0ZXIuZ2V0UHJvcGVydHkoXCJ2YWx1ZTJcIilcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9IHRoaXMuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0XHRpZiAoIW9CaW5kaW5nQ29udGV4dCkge1xuXHRcdFx0dGhpcy5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHRcdHJldHVybjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c1BhdGggPSBvQmluZGluZ0NvbnRleHQuZ2V0UGF0aCgpO1xuXHRcdFx0Ly9GaWx0ZXIgZm9yIGZpbHRlcmluZyBvdXQgb25seSB2YWxpZGF0aW9uIG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgcHJlc2VudCBpbiB0aGUgdmlld1xuXHRcdFx0b1ZhbGlkYXRpb25GaWx0ZXJzID0gbmV3IEZpbHRlcih7XG5cdFx0XHRcdGZpbHRlcnM6IFtcblx0XHRcdFx0XHRuZXcgRmlsdGVyKHtcblx0XHRcdFx0XHRcdHBhdGg6IFwidmFsaWRhdGlvblwiLFxuXHRcdFx0XHRcdFx0b3BlcmF0b3I6IEZpbHRlck9wZXJhdG9yLkVRLFxuXHRcdFx0XHRcdFx0dmFsdWUxOiB0cnVlXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0Z2V0Q2hlY2tDb250cm9sSW5WaWV3RmlsdGVyKClcblx0XHRcdFx0XSxcblx0XHRcdFx0YW5kOiB0cnVlXG5cdFx0XHR9KTtcblx0XHRcdC8vRmlsdGVyIGZvciBmaWx0ZXJpbmcgb3V0IHRoZSBib3VuZCBtZXNzYWdlcyBpLmUgdGFyZ2V0IHN0YXJ0cyB3aXRoIHRoZSBjb250ZXh0IHBhdGhcblx0XHRcdG9WYWxpZGF0aW9uQW5kQ29udGV4dEZpbHRlciA9IG5ldyBGaWx0ZXIoe1xuXHRcdFx0XHRmaWx0ZXJzOiBbXG5cdFx0XHRcdFx0b1ZhbGlkYXRpb25GaWx0ZXJzLFxuXHRcdFx0XHRcdG5ldyBGaWx0ZXIoe1xuXHRcdFx0XHRcdFx0cGF0aDogXCJ0YXJnZXRcIixcblx0XHRcdFx0XHRcdG9wZXJhdG9yOiBGaWx0ZXJPcGVyYXRvci5TdGFydHNXaXRoLFxuXHRcdFx0XHRcdFx0dmFsdWUxOiBzUGF0aFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGFuZDogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0b0RpYWxvZ0ZpbHRlciA9IG5ldyBGaWx0ZXIoe1xuXHRcdFx0XHRmaWx0ZXJzOiBbZmlsdGVyT3V0TWVzc2FnZXNJbkRpYWxvZygpXVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNvbnN0IG9WYWxpZGF0aW9uQ29udGV4dERpYWxvZ0ZpbHRlcnMgPSBuZXcgRmlsdGVyKHtcblx0XHRcdGZpbHRlcnM6IFtvVmFsaWRhdGlvbkFuZENvbnRleHRGaWx0ZXIsIG9EaWFsb2dGaWx0ZXJdLFxuXHRcdFx0YW5kOiB0cnVlXG5cdFx0fSk7XG5cdFx0Ly8gYW5kIGZpbmFsbHkgLSBpZiB0aGVyZSBhbnkgLSBhZGQgY3VzdG9tIGZpbHRlciAodmlhIE9SKVxuXHRcdGlmIChhVXNlckRlZmluZWRGaWx0ZXIubGVuZ3RoID4gMCkge1xuXHRcdFx0b0ZpbHRlcnMgPSBuZXcgKEZpbHRlciBhcyBhbnkpKHtcblx0XHRcdFx0ZmlsdGVyczogW2FVc2VyRGVmaW5lZEZpbHRlciwgb1ZhbGlkYXRpb25Db250ZXh0RGlhbG9nRmlsdGVyc10sXG5cdFx0XHRcdGFuZDogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvRmlsdGVycyA9IG9WYWxpZGF0aW9uQ29udGV4dERpYWxvZ0ZpbHRlcnM7XG5cdFx0fVxuXHRcdHRoaXMub0l0ZW1CaW5kaW5nLmZpbHRlcihvRmlsdGVycyk7XG5cdFx0dGhpcy5vT2JqZWN0UGFnZUxheW91dCA9IHRoaXMuX2dldE9iamVjdFBhZ2VMYXlvdXQodGhpcywgdGhpcy5vT2JqZWN0UGFnZUxheW91dCk7XG5cdFx0Ly8gV2Ugc3VwcG9ydCBzb3J0aW5nIG9ubHkgZm9yIE9iamVjdFBhZ2VMYXlvdXQgdXNlLWNhc2UuXG5cdFx0aWYgKHRoaXMub09iamVjdFBhZ2VMYXlvdXQpIHtcblx0XHRcdG9Tb3J0ZXIgPSBuZXcgKFNvcnRlciBhcyBhbnkpKFwiXCIsIG51bGwsIG51bGwsIChvYmoxOiBhbnksIG9iajI6IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAoIW9iamVjdFBhZ2VMYXlvdXRTZWN0aW9ucykge1xuXHRcdFx0XHRcdG9iamVjdFBhZ2VMYXlvdXRTZWN0aW9ucyA9IHRoaXMub09iamVjdFBhZ2VMYXlvdXQgJiYgdGhpcy5vT2JqZWN0UGFnZUxheW91dC5nZXRTZWN0aW9ucygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHJhbmtBID0gdGhpcy5fZ2V0TWVzc2FnZVJhbmsob2JqMSwgb2JqZWN0UGFnZUxheW91dFNlY3Rpb25zKTtcblx0XHRcdFx0Y29uc3QgcmFua0IgPSB0aGlzLl9nZXRNZXNzYWdlUmFuayhvYmoyLCBvYmplY3RQYWdlTGF5b3V0U2VjdGlvbnMpO1xuXHRcdFx0XHRpZiAocmFua0EgPCByYW5rQikge1xuXHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmFua0EgPiByYW5rQikge1xuXHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLm9JdGVtQmluZGluZy5zb3J0KG9Tb3J0ZXIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gc0NvbnRyb2xJZFxuXHQgKiBAcGFyYW0gb0l0ZW1cblx0ICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBJRCBtYXRjaGVzIHRoZSBpdGVtIElEXG5cdCAqL1xuXHRfZm5GaWx0ZXJVcG9uSWQoc0NvbnRyb2xJZDogc3RyaW5nLCBvSXRlbTogYW55KSB7XG5cdFx0cmV0dXJuIHNDb250cm9sSWQgPT09IG9JdGVtLmdldElkKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIGFDb250cm9sSWRzXG5cdCAqIEBwYXJhbSBvSXRlbVxuXHQgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBpdGVtIG1hdGNoZXMgb25lIG9mIHRoZSBjb250cm9sc1xuXHQgKi9cblx0X2ZuRmlsdGVyVXBvbklkcyhhQ29udHJvbElkczogc3RyaW5nW10sIG9JdGVtOiBhbnkpIHtcblx0XHRyZXR1cm4gYUNvbnRyb2xJZHMuc29tZShmdW5jdGlvbiAoc0NvbnRyb2xJZCkge1xuXHRcdFx0aWYgKHNDb250cm9sSWQgPT09IG9JdGVtLmdldElkKCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBzZWN0aW9uIGJhc2VkIG9uIHNlY3Rpb24gdGl0bGUgYW5kIHZpc2liaWxpdHkuXG5cdCAqXG5cdCAqIEBwYXJhbSBvT2JqZWN0UGFnZSBPYmplY3QgcGFnZS5cblx0ICogQHBhcmFtIHNTZWN0aW9uVGl0bGUgU2VjdGlvbiB0aXRsZS5cblx0ICogQHJldHVybnMgVGhlIHNlY3Rpb25cblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRTZWN0aW9uQnlTZWN0aW9uVGl0bGUob09iamVjdFBhZ2U6IGFueSwgc1NlY3Rpb25UaXRsZTogc3RyaW5nKSB7XG5cdFx0aWYgKHNTZWN0aW9uVGl0bGUpIHtcblx0XHRcdGNvbnN0IGFTZWN0aW9ucyA9IG9PYmplY3RQYWdlLmdldFNlY3Rpb25zKCk7XG5cdFx0XHRsZXQgb1NlY3Rpb247XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFTZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoYVNlY3Rpb25zW2ldLmdldFZpc2libGUoKSAmJiBhU2VjdGlvbnNbaV0uZ2V0VGl0bGUoKSA9PT0gc1NlY3Rpb25UaXRsZSkge1xuXHRcdFx0XHRcdG9TZWN0aW9uID0gYVNlY3Rpb25zW2ldO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb1NlY3Rpb247XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byB0aGUgc2VjdGlvbiBpZiB0aGUgb2JqZWN0IHBhZ2UgdXNlcyBhbiBJY29uVGFiQmFyIGFuZCBpZiB0aGUgY3VycmVudCBzZWN0aW9uIGlzIG5vdCB0aGUgdGFyZ2V0IG9mIHRoZSBuYXZpZ2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gb09iamVjdFBhZ2UgT2JqZWN0IHBhZ2UuXG5cdCAqIEBwYXJhbSBzU2VjdGlvblRpdGxlIFNlY3Rpb24gdGl0bGUuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfbmF2aWdhdGVGcm9tTWVzc2FnZVRvU2VjdGlvbkluSWNvblRhYkJhck1vZGUob09iamVjdFBhZ2U6IGFueSwgc1NlY3Rpb25UaXRsZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgYlVzZUljb25UYWJCYXIgPSBvT2JqZWN0UGFnZS5nZXRVc2VJY29uVGFiQmFyKCk7XG5cdFx0aWYgKGJVc2VJY29uVGFiQmFyKSB7XG5cdFx0XHRjb25zdCBvU2VjdGlvbiA9IHRoaXMuX2dldFNlY3Rpb25CeVNlY3Rpb25UaXRsZShvT2JqZWN0UGFnZSwgc1NlY3Rpb25UaXRsZSk7XG5cdFx0XHRjb25zdCBzU2VsZWN0ZWRTZWN0aW9uSWQgPSBvT2JqZWN0UGFnZS5nZXRTZWxlY3RlZFNlY3Rpb24oKTtcblx0XHRcdGlmIChvU2VjdGlvbiAmJiBzU2VsZWN0ZWRTZWN0aW9uSWQgIT09IG9TZWN0aW9uLmdldElkKCkpIHtcblx0XHRcdFx0b09iamVjdFBhZ2Uuc2V0U2VsZWN0ZWRTZWN0aW9uKG9TZWN0aW9uLmdldElkKCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGFzeW5jIF9uYXZpZ2F0ZUZyb21NZXNzYWdlVG9TZWN0aW9uVGFibGVJbkljb25UYWJCYXJNb2RlKG9UYWJsZTogYW55LCBvT2JqZWN0UGFnZTogYW55LCBzU2VjdGlvblRpdGxlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBvUm93QmluZGluZyA9IG9UYWJsZS5nZXRSb3dCaW5kaW5nKCk7XG5cdFx0Y29uc3Qgb1RhYmxlQ29udGV4dCA9IG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGNvbnN0IG9PUENvbnRleHQgPSBvT2JqZWN0UGFnZS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGNvbnN0IGJTaG91bGRXYWl0Rm9yVGFibGVSZWZyZXNoID0gIShvVGFibGVDb250ZXh0ID09PSBvT1BDb250ZXh0KTtcblx0XHR0aGlzLl9uYXZpZ2F0ZUZyb21NZXNzYWdlVG9TZWN0aW9uSW5JY29uVGFiQmFyTW9kZShvT2JqZWN0UGFnZSwgc1NlY3Rpb25UaXRsZSk7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBGdW5jdGlvbikge1xuXHRcdFx0aWYgKGJTaG91bGRXYWl0Rm9yVGFibGVSZWZyZXNoKSB7XG5cdFx0XHRcdG9Sb3dCaW5kaW5nLmF0dGFjaEV2ZW50T25jZShcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIE1kY1RhYmxlIGlmIGl0IGlzIGZvdW5kIGFtb25nIGFueSBvZiB0aGUgcGFyZW50IGVsZW1lbnRzLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0VsZW1lbnQgQ29udHJvbFxuXHQgKiBAcmV0dXJucyBNREMgdGFibGUgfHwgdW5kZWZpbmVkXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0TWRjVGFibGUob0VsZW1lbnQ6IGFueSkge1xuXHRcdC8vY2hlY2sgaWYgdGhlIGVsZW1lbnQgaGFzIGEgdGFibGUgd2l0aGluIGFueSBvZiBpdHMgcGFyZW50c1xuXHRcdGxldCBvUGFyZW50RWxlbWVudCA9IG9FbGVtZW50LmdldFBhcmVudCgpO1xuXHRcdHdoaWxlIChvUGFyZW50RWxlbWVudCAmJiAhb1BhcmVudEVsZW1lbnQuaXNBKFwic2FwLnVpLm1kYy5UYWJsZVwiKSkge1xuXHRcdFx0b1BhcmVudEVsZW1lbnQgPSBvUGFyZW50RWxlbWVudC5nZXRQYXJlbnQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9QYXJlbnRFbGVtZW50ICYmIG9QYXJlbnRFbGVtZW50LmlzQShcInNhcC51aS5tZGMuVGFibGVcIikgPyBvUGFyZW50RWxlbWVudCA6IHVuZGVmaW5lZDtcblx0fVxuXG5cdF9nZXRHcmlkVGFibGUob01kY1RhYmxlOiBhbnkpIHtcblx0XHRyZXR1cm4gb01kY1RhYmxlLmZpbmRFbGVtZW50cyh0cnVlLCBmdW5jdGlvbiAob0VsZW06IGFueSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0b0VsZW0uaXNBKFwic2FwLnVpLnRhYmxlLlRhYmxlXCIpICYmXG5cdFx0XHRcdC8qKiBXZSBjaGVjayB0aGUgZWxlbWVudCBiZWxvbmdzIHRvIHRoZSBNZGNUYWJsZSA6Ki9cblx0XHRcdFx0b0VsZW0uZ2V0UGFyZW50KCkgPT09IG9NZGNUYWJsZVxuXHRcdFx0KTtcblx0XHR9KVswXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHRhYmxlIHJvdyAoaWYgYXZhaWxhYmxlKSBjb250YWluaW5nIHRoZSBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0gb0VsZW1lbnQgQ29udHJvbFxuXHQgKiBAcmV0dXJucyBUYWJsZSByb3cgfHwgdW5kZWZpbmVkXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0VGFibGVSb3cob0VsZW1lbnQ6IGFueSkge1xuXHRcdGxldCBvUGFyZW50RWxlbWVudCA9IG9FbGVtZW50LmdldFBhcmVudCgpO1xuXHRcdHdoaWxlIChcblx0XHRcdG9QYXJlbnRFbGVtZW50ICYmXG5cdFx0XHQhb1BhcmVudEVsZW1lbnQuaXNBKFwic2FwLnVpLnRhYmxlLlJvd1wiKSAmJlxuXHRcdFx0IW9QYXJlbnRFbGVtZW50LmlzQShcInNhcC51aS50YWJsZS5DcmVhdGlvblJvd1wiKSAmJlxuXHRcdFx0IW9QYXJlbnRFbGVtZW50LmlzQShDb2x1bW5MaXN0SXRlbS5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSlcblx0XHQpIHtcblx0XHRcdG9QYXJlbnRFbGVtZW50ID0gb1BhcmVudEVsZW1lbnQuZ2V0UGFyZW50KCk7XG5cdFx0fVxuXHRcdHJldHVybiBvUGFyZW50RWxlbWVudCAmJlxuXHRcdFx0KG9QYXJlbnRFbGVtZW50LmlzQShcInNhcC51aS50YWJsZS5Sb3dcIikgfHxcblx0XHRcdFx0b1BhcmVudEVsZW1lbnQuaXNBKFwic2FwLnVpLnRhYmxlLkNyZWF0aW9uUm93XCIpIHx8XG5cdFx0XHRcdG9QYXJlbnRFbGVtZW50LmlzQShDb2x1bW5MaXN0SXRlbS5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKSkpXG5cdFx0XHQ/IG9QYXJlbnRFbGVtZW50XG5cdFx0XHQ6IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGluZGV4IG9mIHRoZSB0YWJsZSByb3cgY29udGFpbmluZyB0aGUgZWxlbWVudC5cblx0ICpcblx0ICogQHBhcmFtIG9FbGVtZW50IENvbnRyb2xcblx0ICogQHJldHVybnMgUm93IGluZGV4IHx8IHVuZGVmaW5lZFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldFRhYmxlUm93SW5kZXgob0VsZW1lbnQ6IGFueSkge1xuXHRcdGNvbnN0IG9UYWJsZVJvdyA9IHRoaXMuX2dldFRhYmxlUm93KG9FbGVtZW50KTtcblx0XHRsZXQgaVJvd0luZGV4O1xuXHRcdGlmIChvVGFibGVSb3cuaXNBKFwic2FwLnVpLnRhYmxlLlJvd1wiKSkge1xuXHRcdFx0aVJvd0luZGV4ID0gb1RhYmxlUm93LmdldEluZGV4KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlSb3dJbmRleCA9IG9UYWJsZVJvd1xuXHRcdFx0XHQuZ2V0VGFibGUoKVxuXHRcdFx0XHQuZ2V0SXRlbXMoKVxuXHRcdFx0XHQuZmluZEluZGV4KGZ1bmN0aW9uIChlbGVtZW50OiBhbnkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRJZCgpID09PSBvVGFibGVSb3cuZ2V0SWQoKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBpUm93SW5kZXg7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBpbmRleCBvZiB0aGUgdGFibGUgY29sdW1uIGNvbnRhaW5pbmcgdGhlIGVsZW1lbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRWxlbWVudCBDb250cm9sXG5cdCAqIEByZXR1cm5zIENvbHVtbiBpbmRleCB8fCB1bmRlZmluZWRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRUYWJsZUNvbHVtbkluZGV4KG9FbGVtZW50OiBhbnkpIHtcblx0XHRjb25zdCBnZXRUYXJnZXRDZWxsSW5kZXggPSBmdW5jdGlvbiAoZWxlbWVudDogYW55LCBvVGFyZ2V0Um93OiBhbnkpIHtcblx0XHRcdHJldHVybiBvVGFyZ2V0Um93LmdldENlbGxzKCkuZmluZEluZGV4KGZ1bmN0aW9uIChvQ2VsbDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvQ2VsbC5nZXRJZCgpID09PSBlbGVtZW50LmdldElkKCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdGNvbnN0IGdldFRhcmdldENvbHVtbkluZGV4ID0gZnVuY3Rpb24gKGVsZW1lbnQ6IGFueSwgb1RhcmdldFJvdzogYW55KSB7XG5cdFx0XHRsZXQgb1RhcmdldEVsZW1lbnQgPSBlbGVtZW50LmdldFBhcmVudCgpLFxuXHRcdFx0XHRpVGFyZ2V0Q2VsbEluZGV4ID0gZ2V0VGFyZ2V0Q2VsbEluZGV4KG9UYXJnZXRFbGVtZW50LCBvVGFyZ2V0Um93KTtcblx0XHRcdHdoaWxlIChvVGFyZ2V0RWxlbWVudCAmJiBpVGFyZ2V0Q2VsbEluZGV4IDwgMCkge1xuXHRcdFx0XHRvVGFyZ2V0RWxlbWVudCA9IG9UYXJnZXRFbGVtZW50LmdldFBhcmVudCgpO1xuXHRcdFx0XHRpVGFyZ2V0Q2VsbEluZGV4ID0gZ2V0VGFyZ2V0Q2VsbEluZGV4KG9UYXJnZXRFbGVtZW50LCBvVGFyZ2V0Um93KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpVGFyZ2V0Q2VsbEluZGV4O1xuXHRcdH07XG5cdFx0Y29uc3Qgb1RhcmdldFJvdyA9IHRoaXMuX2dldFRhYmxlUm93KG9FbGVtZW50KTtcblx0XHRsZXQgaVRhcmdldENvbHVtbkluZGV4O1xuXHRcdGlUYXJnZXRDb2x1bW5JbmRleCA9IGdldFRhcmdldENvbHVtbkluZGV4KG9FbGVtZW50LCBvVGFyZ2V0Um93KTtcblx0XHRpZiAob1RhcmdldFJvdy5pc0EoXCJzYXAudWkudGFibGUuQ3JlYXRpb25Sb3dcIikpIHtcblx0XHRcdGNvbnN0IHNUYXJnZXRDZWxsSWQgPSBvVGFyZ2V0Um93LmdldENlbGxzKClbaVRhcmdldENvbHVtbkluZGV4XS5nZXRJZCgpLFxuXHRcdFx0XHRhVGFibGVDb2x1bW5zID0gb1RhcmdldFJvdy5nZXRUYWJsZSgpLmdldENvbHVtbnMoKTtcblx0XHRcdGlUYXJnZXRDb2x1bW5JbmRleCA9IGFUYWJsZUNvbHVtbnMuZmluZEluZGV4KGZ1bmN0aW9uIChjb2x1bW46IGFueSkge1xuXHRcdFx0XHRpZiAoY29sdW1uLmdldENyZWF0aW9uVGVtcGxhdGUoKSkge1xuXHRcdFx0XHRcdHJldHVybiBzVGFyZ2V0Q2VsbElkLnNlYXJjaChjb2x1bW4uZ2V0Q3JlYXRpb25UZW1wbGF0ZSgpLmdldElkKCkpID4gLTEgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGlUYXJnZXRDb2x1bW5JbmRleDtcblx0fVxuXG5cdF9nZXRNZGNUYWJsZVJvd3Mob01kY1RhYmxlOiBhbnkpIHtcblx0XHRyZXR1cm4gb01kY1RhYmxlLmZpbmRFbGVtZW50cyh0cnVlLCBmdW5jdGlvbiAob0VsZW06IGFueSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0b0VsZW0uaXNBKFwic2FwLnVpLnRhYmxlLlJvd1wiKSAmJlxuXHRcdFx0XHQvKiogV2UgY2hlY2sgdGhlIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgTWRjIFRhYmxlIDoqL1xuXHRcdFx0XHRvRWxlbS5nZXRUYWJsZSgpLmdldFBhcmVudCgpID09PSBvTWRjVGFibGVcblx0XHRcdCk7XG5cdFx0fSk7XG5cdH1cblxuXHRfZ2V0VGFibGVDb2xQcm9wZXJ0eShvVGFibGU6IGFueSwgb01lc3NhZ2VPYmplY3Q6IE1lc3NhZ2UpIHtcblx0XHQvL3RoaXMgZnVuY3Rpb24gZXNjYXBlcyBhIHN0cmluZyB0byB1c2UgaXQgYXMgYSByZWdleFxuXHRcdGNvbnN0IGZuUmVnRXhwZXNjYXBlID0gZnVuY3Rpb24gKHM6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHMucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCBcIlxcXFwkJlwiKTtcblx0XHR9O1xuXHRcdC8vIGJhc2VkIG9uIHRoZSB0YXJnZXQgcGF0aCBvZiB0aGUgbWVzc2FnZSB3ZSByZXRyaWV2ZSB0aGUgcHJvcGVydHkgbmFtZS5cblx0XHQvLyB0byBhY2hpZXZlIGl0IHdlIHJlbW92ZSB0aGUgYmluZGluZ0NvbnRleHQgcGF0aCBhbmQgdGhlIHJvdyBiaW5kaW5nIHBhdGggZnJvbSB0aGUgdGFyZ2V0XG5cdFx0cmV0dXJuIG9NZXNzYWdlT2JqZWN0XG5cdFx0XHQuZ2V0VGFyZ2V0cygpWzBdXG5cdFx0XHQucmVwbGFjZShcblx0XHRcdFx0bmV3IFJlZ0V4cChgJHtmblJlZ0V4cGVzY2FwZShgJHtvVGFibGUuZ2V0QmluZGluZ0NvbnRleHQoKS5nZXRQYXRoKCl9LyR7b1RhYmxlLmdldFJvd0JpbmRpbmcoKS5nZXRQYXRoKCl9YCl9XFxcXCguKlxcXFwpL2ApLFxuXHRcdFx0XHRcIlwiXG5cdFx0XHQpO1xuXHR9XG5cblx0X2dldE9iamVjdFBhZ2VMYXlvdXQob0VsZW1lbnQ6IGFueSwgb09iamVjdFBhZ2VMYXlvdXQ6IGFueSkge1xuXHRcdGlmIChvT2JqZWN0UGFnZUxheW91dCkge1xuXHRcdFx0cmV0dXJuIG9PYmplY3RQYWdlTGF5b3V0O1xuXHRcdH1cblx0XHRvT2JqZWN0UGFnZUxheW91dCA9IG9FbGVtZW50O1xuXHRcdC8vSXRlcmF0ZSBvdmVyIHBhcmVudCB0aWxsIHlvdSBoYXZlIG5vdCByZWFjaGVkIHRoZSBvYmplY3QgcGFnZSBsYXlvdXRcblx0XHR3aGlsZSAob09iamVjdFBhZ2VMYXlvdXQgJiYgIW9PYmplY3RQYWdlTGF5b3V0LmlzQShcInNhcC51eGFwLk9iamVjdFBhZ2VMYXlvdXRcIikpIHtcblx0XHRcdG9PYmplY3RQYWdlTGF5b3V0ID0gb09iamVjdFBhZ2VMYXlvdXQuZ2V0UGFyZW50KCk7XG5cdFx0fVxuXHRcdHJldHVybiBvT2JqZWN0UGFnZUxheW91dDtcblx0fVxuXG5cdF9nZXRDdXN0b21Db2x1bW5JbmZvKG9UYWJsZTogYW55LCBpUG9zaXRpb246IG51bWJlcikge1xuXHRcdGNvbnN0IHNUYWJsZUNvbFByb3BlcnR5ID0gb1RhYmxlLmdldENvbHVtbnMoKVtpUG9zaXRpb25dLmdldERhdGFQcm9wZXJ0eSgpO1xuXHRcdHJldHVybiBvVGFibGVcblx0XHRcdC5nZXRDb250cm9sRGVsZWdhdGUoKVxuXHRcdFx0LmdldENvbHVtbnNGb3Iob1RhYmxlKVxuXHRcdFx0LmZpbmQoZnVuY3Rpb24gKG9Db2x1bW46IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gb0NvbHVtbi5uYW1lID09PSBzVGFibGVDb2xQcm9wZXJ0eSAmJiAhIW9Db2x1bW4udGVtcGxhdGU7XG5cdFx0XHR9KTtcblx0fVxuXG5cdF9nZXRUYWJsZUZpcnN0Q29sUHJvcGVydHkob1RhYmxlOiBhbnkpIHtcblx0XHRjb25zdCBvQ3VzdG9tQ29sdW1uSW5mbyA9IHRoaXMuX2dldEN1c3RvbUNvbHVtbkluZm8ob1RhYmxlLCAwKTtcblx0XHRsZXQgc1RhYmxlRmlyc3RDb2xQcm9wZXJ0eTtcblx0XHRpZiAob0N1c3RvbUNvbHVtbkluZm8pIHtcblx0XHRcdGlmIChvQ3VzdG9tQ29sdW1uSW5mby5wcm9wZXJ0eUluZm9zKSB7XG5cdFx0XHRcdHNUYWJsZUZpcnN0Q29sUHJvcGVydHkgPSBvQ3VzdG9tQ29sdW1uSW5mby5wcm9wZXJ0eUluZm9zWzBdLnJlcGxhY2UoXCJQcm9wZXJ0eTo6XCIsIFwiXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c1RhYmxlRmlyc3RDb2xQcm9wZXJ0eSA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0c1RhYmxlRmlyc3RDb2xQcm9wZXJ0eSA9IG9UYWJsZS5nZXRDb2x1bW5zKClbMF0uZ2V0RGF0YVByb3BlcnR5KCk7XG5cdFx0fVxuXHRcdHJldHVybiBzVGFibGVGaXJzdENvbFByb3BlcnR5O1xuXHR9XG5cblx0X2dldFRhYmxlRmlyc3RDb2xCaW5kaW5nQ29udGV4dEZvclRleHRBbm5vdGF0aW9uKG9UYWJsZTogYW55LCBvVGFibGVSb3dDb250ZXh0OiBhbnksIHNUYWJsZUZpcnN0Q29sUHJvcGVydHk6IHN0cmluZykge1xuXHRcdGxldCBvQmluZGluZ0NvbnRleHQ7XG5cdFx0aWYgKG9UYWJsZVJvd0NvbnRleHQgJiYgc1RhYmxlRmlyc3RDb2xQcm9wZXJ0eSkge1xuXHRcdFx0Y29uc3Qgb01vZGVsID0gb1RhYmxlLmdldE1vZGVsKCk7XG5cdFx0XHRjb25zdCBvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHRcdFx0Y29uc3Qgc01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvVGFibGVSb3dDb250ZXh0LmdldFBhdGgoKSk7XG5cdFx0XHRpZiAob01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofS8ke3NUYWJsZUZpcnN0Q29sUHJvcGVydHl9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0LyRQYXRoYCkpIHtcblx0XHRcdFx0b0JpbmRpbmdDb250ZXh0ID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcblx0XHRcdFx0XHRgJHtzTWV0YVBhdGh9LyR7c1RhYmxlRmlyc3RDb2xQcm9wZXJ0eX1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRgXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvQmluZGluZ0NvbnRleHQ7XG5cdH1cblxuXHRfZ2V0VGFibGVGaXJzdENvbFZhbHVlKHNUYWJsZUZpcnN0Q29sUHJvcGVydHk6IHN0cmluZywgb1RhYmxlUm93Q29udGV4dDogYW55LCBzVGV4dEFubm90YXRpb25QYXRoOiBzdHJpbmcsIHNUZXh0QXJyYW5nZW1lbnQ6IHN0cmluZykge1xuXHRcdGNvbnN0IHNDb2RlVmFsdWUgPSBvVGFibGVSb3dDb250ZXh0LmdldFZhbHVlKHNUYWJsZUZpcnN0Q29sUHJvcGVydHkpO1xuXHRcdGxldCBzVGV4dFZhbHVlO1xuXHRcdGxldCBzQ29tcHV0ZWRWYWx1ZSA9IHNDb2RlVmFsdWU7XG5cdFx0aWYgKHNUZXh0QW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdGlmIChzVGFibGVGaXJzdENvbFByb3BlcnR5Lmxhc3RJbmRleE9mKFwiL1wiKSA+IDApIHtcblx0XHRcdFx0Ly8gdGhlIHRhcmdldCBwcm9wZXJ0eSBpcyByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0IGFubm90YXRpb24gcGF0aFxuXHRcdFx0XHRzVGFibGVGaXJzdENvbFByb3BlcnR5ID0gc1RhYmxlRmlyc3RDb2xQcm9wZXJ0eS5zbGljZSgwLCBzVGFibGVGaXJzdENvbFByb3BlcnR5Lmxhc3RJbmRleE9mKFwiL1wiKSArIDEpO1xuXHRcdFx0XHRzVGFibGVGaXJzdENvbFByb3BlcnR5ID0gc1RhYmxlRmlyc3RDb2xQcm9wZXJ0eS5jb25jYXQoc1RleHRBbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzVGFibGVGaXJzdENvbFByb3BlcnR5ID0gc1RleHRBbm5vdGF0aW9uUGF0aDtcblx0XHRcdH1cblx0XHRcdHNUZXh0VmFsdWUgPSBvVGFibGVSb3dDb250ZXh0LmdldFZhbHVlKHNUYWJsZUZpcnN0Q29sUHJvcGVydHkpO1xuXHRcdFx0aWYgKHNUZXh0VmFsdWUpIHtcblx0XHRcdFx0aWYgKHNUZXh0QXJyYW5nZW1lbnQpIHtcblx0XHRcdFx0XHRjb25zdCBzRW51bU51bWJlciA9IHNUZXh0QXJyYW5nZW1lbnQuc2xpY2Uoc1RleHRBcnJhbmdlbWVudC5pbmRleE9mKFwiL1wiKSArIDEpO1xuXHRcdFx0XHRcdHN3aXRjaCAoc0VudW1OdW1iZXIpIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJUZXh0T25seVwiOlxuXHRcdFx0XHRcdFx0XHRzQ29tcHV0ZWRWYWx1ZSA9IHNUZXh0VmFsdWU7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIlRleHRGaXJzdFwiOlxuXHRcdFx0XHRcdFx0XHRzQ29tcHV0ZWRWYWx1ZSA9IGAke3NUZXh0VmFsdWV9ICgke3NDb2RlVmFsdWV9KWA7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIlRleHRMYXN0XCI6XG5cdFx0XHRcdFx0XHRcdHNDb21wdXRlZFZhbHVlID0gYCR7c0NvZGVWYWx1ZX0gKCR7c1RleHRWYWx1ZX0pYDtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwiVGV4dFNlcGFyYXRlXCI6XG5cdFx0XHRcdFx0XHRcdHNDb21wdXRlZFZhbHVlID0gc0NvZGVWYWx1ZTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzQ29tcHV0ZWRWYWx1ZSA9IGAke3NUZXh0VmFsdWV9ICgke3NDb2RlVmFsdWV9KWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHNDb21wdXRlZFZhbHVlO1xuXHR9XG5cblx0X0lzQ29udHJvbEluVGFibGUob1RhYmxlOiBhbnksIHNDb250cm9sSWQ6IHN0cmluZykge1xuXHRcdGNvbnN0IG9Db250cm9sID0gQ29yZS5ieUlkKHNDb250cm9sSWQpO1xuXHRcdGlmIChvQ29udHJvbCAmJiAhb0NvbnRyb2wuaXNBKFwic2FwLnVpLnRhYmxlLlRhYmxlXCIpICYmICFvQ29udHJvbC5pc0EoXCJzYXAubS5UYWJsZVwiKSkge1xuXHRcdFx0cmV0dXJuIG9UYWJsZS5maW5kRWxlbWVudHModHJ1ZSwgZnVuY3Rpb24gKG9FbGVtOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG9FbGVtLmdldElkKCkgPT09IG9Db250cm9sO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdF9Jc0NvbnRyb2xQYXJ0T2ZDcmVhdGlvblJvdyhvQ29udHJvbDogYW55KSB7XG5cdFx0bGV0IG9QYXJlbnRDb250cm9sID0gb0NvbnRyb2wuZ2V0UGFyZW50KCk7XG5cdFx0d2hpbGUgKFxuXHRcdFx0b1BhcmVudENvbnRyb2wgJiZcblx0XHRcdCFvUGFyZW50Q29udHJvbC5pc0EoXCJzYXAudWkudGFibGUuUm93XCIpICYmXG5cdFx0XHQhb1BhcmVudENvbnRyb2wuaXNBKFwic2FwLnVpLnRhYmxlLkNyZWF0aW9uUm93XCIpICYmXG5cdFx0XHQhb1BhcmVudENvbnRyb2wuaXNBKENvbHVtbkxpc3RJdGVtLmdldE1ldGFkYXRhKCkuZ2V0TmFtZSgpKVxuXHRcdCkge1xuXHRcdFx0b1BhcmVudENvbnRyb2wgPSBvUGFyZW50Q29udHJvbC5nZXRQYXJlbnQoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gISFvUGFyZW50Q29udHJvbCAmJiBvUGFyZW50Q29udHJvbC5pc0EoXCJzYXAudWkudGFibGUuQ3JlYXRpb25Sb3dcIik7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCB0byByZXRyaWV2ZSB0aGUgY29sdW1uIGluZm8gZnJvbSB0aGUgYXNzb2NpYXRlZCBtZXNzYWdlIG9mIHRoZSBtZXNzYWdlIHBvcG92ZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSBvTWVzc2FnZSBNZXNzYWdlIG9iamVjdFxuXHQgKiBAcGFyYW0gb1RhYmxlIE1kY1RhYmxlXG5cdCAqIEByZXR1cm5zIFJldHVybnMgdGhlIGNvbHVtbiBpbmZvLlxuXHQgKi9cblx0X2ZldGNoQ29sdW1uSW5mbyhvTWVzc2FnZTogYW55LCBvVGFibGU6IGFueSkge1xuXHRcdGNvbnN0IHNDb2xOYW1lRnJvbU1lc3NhZ2VPYmogPSBvTWVzc2FnZS5nZXRCaW5kaW5nQ29udGV4dChcIm1lc3NhZ2VcIikuZ2V0T2JqZWN0KCkuZ2V0VGFyZ2V0KCkuc3BsaXQoXCIvXCIpLnBvcCgpO1xuXHRcdHJldHVybiBvVGFibGVcblx0XHRcdC5nZXRQYXJlbnQoKVxuXHRcdFx0LmdldFRhYmxlRGVmaW5pdGlvbigpXG5cdFx0XHQuY29sdW1ucy5maW5kKGZ1bmN0aW9uIChvQ29sdW1uOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIG9Db2x1bW4ua2V5LnNwbGl0KFwiOjpcIikucG9wKCkgPT09IHNDb2xOYW1lRnJvbU1lc3NhZ2VPYmo7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHRvIGNoZWNrIGlmIGEgbmF2aWdhdGlvbiBpcyBjb25maWd1cmVkIGZyb20gdGhlIHRhYmxlIHRvIGEgc3ViIG9iamVjdCBwYWdlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0gdGFibGUgTWRjVGFibGVcblx0ICogQHJldHVybnMgRWl0aGVyIHRydWUgb3IgZmFsc2Vcblx0ICovXG5cdF9uYXZpZ2F0aW9uQ29uZmlndXJlZCh0YWJsZTogYW55KTogYm9vbGVhbiB7XG5cdFx0Ly8gVE9ETzogdGhpcyBsb2dpYyB3b3VsZCBiZSBtb3ZlZCB0byBjaGVjayB0aGUgc2FtZSBhdCB0aGUgdGVtcGxhdGUgdGltZSB0byBhdm9pZCB0aGUgc2FtZSBjaGVjayBoYXBwZW5pbmcgbXVsdGlwbGUgdGltZXMuXG5cdFx0Y29uc3QgY29tcG9uZW50ID0gc2FwLnVpLnJlcXVpcmUoXCJzYXAvdWkvY29yZS9Db21wb25lbnRcIiksXG5cdFx0XHRuYXZPYmplY3QgPSB0YWJsZSAmJiBjb21wb25lbnQuZ2V0T3duZXJDb21wb25lbnRGb3IodGFibGUpICYmIGNvbXBvbmVudC5nZXRPd25lckNvbXBvbmVudEZvcih0YWJsZSkuZ2V0TmF2aWdhdGlvbigpO1xuXHRcdGxldCBzdWJPUENvbmZpZ3VyZWQgPSBmYWxzZSxcblx0XHRcdG5hdkNvbmZpZ3VyZWQgPSBmYWxzZTtcblx0XHRpZiAobmF2T2JqZWN0ICYmIE9iamVjdC5rZXlzKG5hdk9iamVjdCkuaW5kZXhPZih0YWJsZS5nZXRSb3dCaW5kaW5nKCkuc1BhdGgpICE9PSAtMSkge1xuXHRcdFx0c3ViT1BDb25maWd1cmVkID1cblx0XHRcdFx0bmF2T2JqZWN0W3RhYmxlPy5nZXRSb3dCaW5kaW5nKCkuc1BhdGhdICYmXG5cdFx0XHRcdG5hdk9iamVjdFt0YWJsZT8uZ2V0Um93QmluZGluZygpLnNQYXRoXS5kZXRhaWwgJiZcblx0XHRcdFx0bmF2T2JqZWN0W3RhYmxlPy5nZXRSb3dCaW5kaW5nKCkuc1BhdGhdLmRldGFpbC5yb3V0ZVxuXHRcdFx0XHRcdD8gdHJ1ZVxuXHRcdFx0XHRcdDogZmFsc2U7XG5cdFx0fVxuXHRcdG5hdkNvbmZpZ3VyZWQgPVxuXHRcdFx0c3ViT1BDb25maWd1cmVkICYmXG5cdFx0XHR0YWJsZT8uZ2V0Um93U2V0dGluZ3MoKS5nZXRSb3dBY3Rpb25zKCkgJiZcblx0XHRcdHRhYmxlPy5nZXRSb3dTZXR0aW5ncygpLmdldFJvd0FjdGlvbnMoKVswXS5tUHJvcGVydGllcy50eXBlLmluZGV4T2YoXCJOYXZpZ2F0aW9uXCIpICE9PSAtMTtcblx0XHRyZXR1cm4gbmF2Q29uZmlndXJlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgdGhlIG1lc3NhZ2Ugc3VidGl0bGUgYmFzZWQgb24gdGhlIGNvbnRyb2wgaG9sZGluZyB0aGUgZXJyb3IgKGNvbHVtbi9yb3cgaW5kaWNhdG9yKS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgSXRlbVxuXHQgKiBAcGFyYW0gb1RhYmxlUm93QmluZGluZ0NvbnRleHRzIFRoZSB0YWJsZSByb3cgY29udGV4dHNcblx0ICogQHBhcmFtIG9UYWJsZVJvd0NvbnRleHQgVGhlIGNvbnRleHQgb2YgdGhlIHRhYmxlIHJvdyBob2xkaW5nIHRoZSBlcnJvclxuXHQgKiBAcGFyYW0gc1RhYmxlVGFyZ2V0Q29sTmFtZSBUaGUgY29sdW1uIG5hbWUgd2hlcmUgdGhlIGVycm9yIGlzIGxvY2F0ZWRcblx0ICogQHBhcmFtIG9SZXNvdXJjZUJ1bmRsZSBSZXNvdXJjZUJ1bmRsZVxuXHQgKiBAcGFyYW0gb1RhYmxlIE1kY1RhYmxlXG5cdCAqIEBwYXJhbSBiSXNDcmVhdGlvblJvdyBJcyB0aGUgZXJyb3Igb24gYSBjb250cm9sIHRoYXQgaXMgcGFydCBvZiB0aGUgQ3JlYXRpb25Sb3dcblx0ICogQHBhcmFtIG9UYXJnZXRlZENvbnRyb2wgVGhlIGNvbnRyb2wgdGFyZ2V0ZWQgYnkgdGhlIG1lc3NhZ2Vcblx0ICogQHJldHVybnMgVGhlIGNvbXB1dGVkIG1lc3NhZ2Ugc3ViVGl0bGVcblx0ICovXG5cdF9nZXRNZXNzYWdlU3VidGl0bGUoXG5cdFx0bWVzc2FnZTogTWVzc2FnZUl0ZW0sXG5cdFx0b1RhYmxlUm93QmluZGluZ0NvbnRleHRzOiBDb250ZXh0W10sXG5cdFx0b1RhYmxlUm93Q29udGV4dDogQ29udGV4dCxcblx0XHRzVGFibGVUYXJnZXRDb2xOYW1lOiBzdHJpbmcsXG5cdFx0b1Jlc291cmNlQnVuZGxlOiBSZXNvdXJjZUJ1bmRsZSxcblx0XHRvVGFibGU6IE1kY1RhYmxlLFxuXHRcdGJJc0NyZWF0aW9uUm93OiBib29sZWFuLFxuXHRcdG9UYXJnZXRlZENvbnRyb2w/OiBhbnlcblx0KSB7XG5cdFx0bGV0IHNNZXNzYWdlU3VidGl0bGU7XG5cdFx0bGV0IHNSb3dTdWJ0aXRsZVZhbHVlO1xuXHRcdGNvbnN0IHNUYWJsZUZpcnN0Q29sUHJvcGVydHkgPSAob1RhYmxlLmdldFBhcmVudCgpIGFzIFRhYmxlQVBJKS5nZXRJZGVudGlmaWVyQ29sdW1uKCk7XG5cdFx0Y29uc3Qgb0NvbEZyb21UYWJsZVNldHRpbmdzID0gdGhpcy5fZmV0Y2hDb2x1bW5JbmZvKG1lc3NhZ2UsIG9UYWJsZSk7XG5cdFx0aWYgKGJJc0NyZWF0aW9uUm93KSB7XG5cdFx0XHRzTWVzc2FnZVN1YnRpdGxlID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJUX01FU1NBR0VfSVRFTV9TVUJUSVRMRVwiLCBvUmVzb3VyY2VCdW5kbGUsIFtcblx0XHRcdFx0b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX01FU1NBR0VfSVRFTV9TVUJUSVRMRV9DUkVBVElPTl9ST1dfSU5ESUNBVE9SXCIpLFxuXHRcdFx0XHRzVGFibGVUYXJnZXRDb2xOYW1lID8gc1RhYmxlVGFyZ2V0Q29sTmFtZSA6IG9Db2xGcm9tVGFibGVTZXR0aW5ncy5sYWJlbFxuXHRcdFx0XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IG9UYWJsZUZpcnN0Q29sQmluZGluZ0NvbnRleHRUZXh0QW5ub3RhdGlvbiA9IHRoaXMuX2dldFRhYmxlRmlyc3RDb2xCaW5kaW5nQ29udGV4dEZvclRleHRBbm5vdGF0aW9uKFxuXHRcdFx0XHRvVGFibGUsXG5cdFx0XHRcdG9UYWJsZVJvd0NvbnRleHQsXG5cdFx0XHRcdHNUYWJsZUZpcnN0Q29sUHJvcGVydHlcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBzVGFibGVGaXJzdENvbFRleHRBbm5vdGF0aW9uUGF0aCA9IG9UYWJsZUZpcnN0Q29sQmluZGluZ0NvbnRleHRUZXh0QW5ub3RhdGlvblxuXHRcdFx0XHQ/IG9UYWJsZUZpcnN0Q29sQmluZGluZ0NvbnRleHRUZXh0QW5ub3RhdGlvbi5nZXRPYmplY3QoXCIkUGF0aFwiKVxuXHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IHNUYWJsZUZpcnN0Q29sVGV4dEFycmFuZ2VtZW50ID1cblx0XHRcdFx0c1RhYmxlRmlyc3RDb2xUZXh0QW5ub3RhdGlvblBhdGggJiYgb1RhYmxlRmlyc3RDb2xCaW5kaW5nQ29udGV4dFRleHRBbm5vdGF0aW9uXG5cdFx0XHRcdFx0PyBvVGFibGVGaXJzdENvbEJpbmRpbmdDb250ZXh0VGV4dEFubm90YXRpb24uZ2V0T2JqZWN0KFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudC8kRW51bU1lbWJlclwiKVxuXHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0aWYgKG9UYWJsZVJvd0JpbmRpbmdDb250ZXh0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdC8vIHNldCBSb3cgc3VidGl0bGUgdGV4dFxuXHRcdFx0XHRpZiAob1RhcmdldGVkQ29udHJvbCkge1xuXHRcdFx0XHRcdC8vIFRoZSBVSSBlcnJvciBpcyBvbiB0aGUgZmlyc3QgY29sdW1uLCB3ZSB0aGVuIGdldCB0aGUgY29udHJvbCBpbnB1dCBhcyB0aGUgcm93IGluZGljYXRvcjpcblx0XHRcdFx0XHRzUm93U3VidGl0bGVWYWx1ZSA9IG9UYXJnZXRlZENvbnRyb2wuZ2V0VmFsdWUoKTtcblx0XHRcdFx0fSBlbHNlIGlmIChvVGFibGVSb3dDb250ZXh0ICYmIHNUYWJsZUZpcnN0Q29sUHJvcGVydHkpIHtcblx0XHRcdFx0XHRzUm93U3VidGl0bGVWYWx1ZSA9IHRoaXMuX2dldFRhYmxlRmlyc3RDb2xWYWx1ZShcblx0XHRcdFx0XHRcdHNUYWJsZUZpcnN0Q29sUHJvcGVydHksXG5cdFx0XHRcdFx0XHRvVGFibGVSb3dDb250ZXh0LFxuXHRcdFx0XHRcdFx0c1RhYmxlRmlyc3RDb2xUZXh0QW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0XHRzVGFibGVGaXJzdENvbFRleHRBcnJhbmdlbWVudFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c1Jvd1N1YnRpdGxlVmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gc2V0IHRoZSBtZXNzYWdlIHN1YnRpdGxlXG5cdFx0XHRcdGNvbnN0IG9Db2x1bW5JbmZvOiBhbnkgPSB0aGlzLl9kZXRlcm1pbmVDb2x1bW5JbmZvKG9Db2xGcm9tVGFibGVTZXR0aW5ncywgb1Jlc291cmNlQnVuZGxlKTtcblx0XHRcdFx0aWYgKHNSb3dTdWJ0aXRsZVZhbHVlICYmIHNUYWJsZVRhcmdldENvbE5hbWUpIHtcblx0XHRcdFx0XHRzTWVzc2FnZVN1YnRpdGxlID0gQ29tbW9uVXRpbHMuZ2V0VHJhbnNsYXRlZFRleHQoXCJUX01FU1NBR0VfSVRFTV9TVUJUSVRMRVwiLCBvUmVzb3VyY2VCdW5kbGUsIFtcblx0XHRcdFx0XHRcdHNSb3dTdWJ0aXRsZVZhbHVlLFxuXHRcdFx0XHRcdFx0c1RhYmxlVGFyZ2V0Q29sTmFtZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHNSb3dTdWJ0aXRsZVZhbHVlICYmIG9Db2x1bW5JbmZvLnNDb2x1bW5JbmRpY2F0b3IgPT09IFwiSGlkZGVuXCIpIHtcblx0XHRcdFx0XHRzTWVzc2FnZVN1YnRpdGxlID0gYCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX01FU1NBR0VfR1JPVVBfREVTQ1JJUFRJT05fVEFCTEVfUk9XXCIpfTogJHtzUm93U3VidGl0bGVWYWx1ZX0sICR7XG5cdFx0XHRcdFx0XHRvQ29sdW1uSW5mby5zQ29sdW1uVmFsdWVcblx0XHRcdFx0XHR9YDtcblx0XHRcdFx0fSBlbHNlIGlmIChzUm93U3VidGl0bGVWYWx1ZSAmJiBvQ29sdW1uSW5mby5zQ29sdW1uSW5kaWNhdG9yID09PSBcIlVua25vd25cIikge1xuXHRcdFx0XHRcdHNNZXNzYWdlU3VidGl0bGUgPSBDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChcIlRfTUVTU0FHRV9JVEVNX1NVQlRJVExFXCIsIG9SZXNvdXJjZUJ1bmRsZSwgW1xuXHRcdFx0XHRcdFx0c1Jvd1N1YnRpdGxlVmFsdWUsXG5cdFx0XHRcdFx0XHRvQ29sdW1uSW5mby5zQ29sdW1uVmFsdWVcblx0XHRcdFx0XHRdKTtcblx0XHRcdFx0fSBlbHNlIGlmIChzUm93U3VidGl0bGVWYWx1ZSAmJiBvQ29sdW1uSW5mby5zQ29sdW1uSW5kaWNhdG9yID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0c01lc3NhZ2VTdWJ0aXRsZSA9IGAke29SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiVF9NRVNTQUdFX0dST1VQX0RFU0NSSVBUSU9OX1RBQkxFX1JPV1wiKX06ICR7c1Jvd1N1YnRpdGxlVmFsdWV9YDtcblx0XHRcdFx0fSBlbHNlIGlmICghc1Jvd1N1YnRpdGxlVmFsdWUgJiYgc1RhYmxlVGFyZ2V0Q29sTmFtZSkge1xuXHRcdFx0XHRcdHNNZXNzYWdlU3VidGl0bGUgPSBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIlRfTUVTU0FHRV9HUk9VUF9ERVNDUklQVElPTl9UQUJMRV9DT0xVTU5cIikgKyBcIjogXCIgKyBzVGFibGVUYXJnZXRDb2xOYW1lO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCFzUm93U3VidGl0bGVWYWx1ZSAmJiBvQ29sdW1uSW5mby5zQ29sdW1uSW5kaWNhdG9yID09PSBcIkhpZGRlblwiKSB7XG5cdFx0XHRcdFx0c01lc3NhZ2VTdWJ0aXRsZSA9IG9Db2x1bW5JbmZvLnNDb2x1bW5WYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzTWVzc2FnZVN1YnRpdGxlID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c01lc3NhZ2VTdWJ0aXRsZSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBzTWVzc2FnZVN1YnRpdGxlO1xuXHR9XG5cblx0X2RldGVybWluZUNvbHVtbkluZm8ob0NvbEZyb21UYWJsZVNldHRpbmdzOiBhbnksIG9SZXNvdXJjZUJ1bmRsZTogYW55KSB7XG5cdFx0Y29uc3Qgb0NvbHVtbkluZm86IGFueSA9IHsgc0NvbHVtbkluZGljYXRvcjogU3RyaW5nLCBzQ29sdW1uVmFsdWU6IFN0cmluZyB9O1xuXHRcdGlmIChvQ29sRnJvbVRhYmxlU2V0dGluZ3MpIHtcblx0XHRcdC8vIGlmIGNvbHVtbiBpcyBuZWl0aGVyIGluIHRhYmxlIGRlZmluaXRpb24gbm9yIHBlcnNvbmFsaXphdGlvbiwgc2hvdyBvbmx5IHJvdyBzdWJ0aXRsZSB0ZXh0XG5cdFx0XHRpZiAob0NvbEZyb21UYWJsZVNldHRpbmdzLmF2YWlsYWJpbGl0eSA9PT0gXCJIaWRkZW5cIikge1xuXHRcdFx0XHRvQ29sdW1uSW5mby5zQ29sdW1uVmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdG9Db2x1bW5JbmZvLnNDb2x1bW5JbmRpY2F0b3IgPSBcInVuZGVmaW5lZFwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9pZiBjb2x1bW4gaXMgaW4gdGFibGUgcGVyc29uYWxpemF0aW9uIGJ1dCBub3QgaW4gdGFibGUgZGVmaW5pdGlvbiwgc2hvdyBDb2x1bW4gKEhpZGRlbikgOiA8Y29sTmFtZT5cblx0XHRcdFx0b0NvbHVtbkluZm8uc0NvbHVtblZhbHVlID0gYCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXG5cdFx0XHRcdFx0XCJUX01FU1NBR0VfR1JPVVBfREVTQ1JJUFRJT05fVEFCTEVfQ09MVU1OXCJcblx0XHRcdFx0KX0gKCR7b1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX0NPTFVNTl9JTkRJQ0FUT1JfSU5fVEFCTEVfREVGSU5JVElPTlwiKX0pOiAke29Db2xGcm9tVGFibGVTZXR0aW5ncy5sYWJlbH1gO1xuXHRcdFx0XHRvQ29sdW1uSW5mby5zQ29sdW1uSW5kaWNhdG9yID0gXCJIaWRkZW5cIjtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0b0NvbHVtbkluZm8uc0NvbHVtblZhbHVlID0gb1Jlc291cmNlQnVuZGxlLmdldFRleHQoXCJUX01FU1NBR0VfSVRFTV9TVUJUSVRMRV9JTkRJQ0FUT1JfVU5LTk9XTlwiKTtcblx0XHRcdG9Db2x1bW5JbmZvLnNDb2x1bW5JbmRpY2F0b3IgPSBcIlVua25vd25cIjtcblx0XHR9XG5cdFx0cmV0dXJuIG9Db2x1bW5JbmZvO1xuXHR9XG5cblx0c2V0Rm9jdXNUb0NvbnRyb2woY29udHJvbD86IFVJNUVsZW1lbnQpIHtcblx0XHRjb25zdCBtZXNzYWdlUG9wb3ZlciA9IHRoaXMub01lc3NhZ2VQb3BvdmVyO1xuXHRcdGlmIChtZXNzYWdlUG9wb3ZlciAmJiBjb250cm9sICYmIGNvbnRyb2wuZm9jdXMpIHtcblx0XHRcdGNvbnN0IGZuRm9jdXMgPSAoKSA9PiB7XG5cdFx0XHRcdGNvbnRyb2wuZm9jdXMoKTtcblx0XHRcdH07XG5cdFx0XHRpZiAoIW1lc3NhZ2VQb3BvdmVyLmlzT3BlbigpKSB7XG5cdFx0XHRcdC8vIHdoZW4gbmF2aWdhdGluZyB0byBwYXJlbnQgcGFnZSB0byBjaGlsZCBwYWdlIChvbiBjbGljayBvZiBtZXNzYWdlKSwgdGhlIGNoaWxkIHBhZ2UgbWlnaHQgaGF2ZSBhIGZvY3VzIGxvZ2ljIHRoYXQgbWlnaHQgdXNlIGEgdGltZW91dC5cblx0XHRcdFx0Ly8gd2UgdXNlIHRoZSBiZWxvdyB0aW1lb3V0cyB0byBvdmVycmlkZSB0aGlzIGZvY3VzIHNvIHRoYXQgd2UgZm9jdXMgb24gdGhlIHRhcmdldCBjb250cm9sIG9mIHRoZSBtZXNzYWdlIGluIHRoZSBjaGlsZCBwYWdlLlxuXHRcdFx0XHRzZXRUaW1lb3V0KGZuRm9jdXMsIDApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgZm5PbkNsb3NlID0gKCkgPT4ge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZm5Gb2N1cywgMCk7XG5cdFx0XHRcdFx0bWVzc2FnZVBvcG92ZXIuZGV0YWNoRXZlbnQoXCJhZnRlckNsb3NlXCIsIGZuT25DbG9zZSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdG1lc3NhZ2VQb3BvdmVyLmF0dGFjaEV2ZW50KFwiYWZ0ZXJDbG9zZVwiLCBmbk9uQ2xvc2UpO1xuXHRcdFx0XHRtZXNzYWdlUG9wb3Zlci5jbG9zZSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRMb2cud2FybmluZyhcIkZFIFY0IDogTWVzc2FnZUJ1dHRvbiA6IGVsZW1lbnQgZG9lc24ndCBoYXZlIGZvY3VzIG1ldGhvZCBmb3IgZm9jdXNpbmcuXCIpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlQnV0dG9uO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7RUFrakJPLGdCQUFnQkEsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0lBQ3JDLElBQUk7TUFDSCxJQUFJQyxNQUFNLEdBQUdGLElBQUksRUFBakI7SUFDQSxDQUZELENBRUUsT0FBTUcsQ0FBTixFQUFTO01BQ1YsT0FBT0YsT0FBTyxDQUFDRSxDQUFELENBQWQ7SUFDQTs7SUFDRCxJQUFJRCxNQUFNLElBQUlBLE1BQU0sQ0FBQ0UsSUFBckIsRUFBMkI7TUFDMUIsT0FBT0YsTUFBTSxDQUFDRSxJQUFQLENBQVksS0FBSyxDQUFqQixFQUFvQkgsT0FBcEIsQ0FBUDtJQUNBOztJQUNELE9BQU9DLE1BQVA7RUFDQTs7Ozs7Ozs7Ozs7Ozs7TUE3aEJLRyxhLFdBRExDLGNBQWMsQ0FBQyw2QkFBRCxDLFVBRWJDLFdBQVcsQ0FBQztJQUFFQyxJQUFJLEVBQUUsNkJBQVI7SUFBdUNDLFFBQVEsRUFBRSxJQUFqRDtJQUF1REMsWUFBWSxFQUFFO0VBQXJFLENBQUQsQyxVQUdYQyxLQUFLLEU7Ozs7Ozs7Ozs7Ozs7Ozs7WUFNRUMsZSxHQUFrQixFO1lBQ2xCQyxpQixHQUFvQixFO1lBRXBCQyxPLEdBQVUsRTs7Ozs7O1dBRWxCQyxJLEdB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