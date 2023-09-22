/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/PasteHelper", "sap/fe/macros/DelegateUtil", "sap/fe/macros/filter/FilterUtils", "sap/fe/macros/table/Utils", "sap/m/MessageBox", "sap/ui/core/message/Message", "../MacroAPI"], function (Log, CommonUtils, ManifestSettings, ClassSupport, PasteHelper, DelegateUtil, FilterUtils, TableUtils, MessageBox, Message, MacroAPI) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26;

  var xmlEventHandler = ClassSupport.xmlEventHandler;
  var property = ClassSupport.property;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var CreationMode = ManifestSettings.CreationMode;

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

  function _finallyRethrows(body, finalizer) {
    try {
      var result = body();
    } catch (e) {
      return finalizer(true, e);
    }

    if (result && result.then) {
      return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
    }

    return finalizer(false, result);
  }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Building block used to create a table based on the metadata provided by OData V4.
   * <br>
   * Usually, a LineItem or PresentationVariant annotation is expected, but the Table building block can also be used to display an EntitySet.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Table id="MyTable" metaPath="@com.sap.vocabularies.UI.v1.LineItem" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.Table
   * @public
   */
  var TableAPI = (_dec = defineUI5Class("sap.fe.macros.table.TableAPI"), _dec2 = property({
    type: "string",
    expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
    expectedAnnotations: ["com.sap.vocabularies.UI.v1.LineItem", "com.sap.vocabularies.UI.v1.PresentationVariant", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant"]
  }), _dec3 = property({
    type: "sap.ui.model.Context"
  }), _dec4 = property({
    type: "boolean"
  }), _dec5 = property({
    type: "string"
  }), _dec6 = property({
    type: "boolean",
    defaultValue: false
  }), _dec7 = property({
    type: "string",
    defaultValue: "ResponsiveTable"
  }), _dec8 = property({
    type: "boolean",
    defaultValue: true
  }), _dec9 = property({
    type: "boolean",
    defaultValue: false
  }), _dec10 = property({
    type: "boolean",
    defaultValue: false
  }), _dec11 = property({
    type: "string"
  }), _dec12 = property({
    type: "string"
  }), _dec13 = property({
    type: "string"
  }), _dec14 = property({
    type: "boolean",
    defaultValue: false
  }), _dec15 = property({
    type: "boolean",
    defaultValue: true
  }), _dec16 = property({
    type: "boolean",
    defaultValue: false
  }), _dec17 = property({
    type: "boolean",
    defaultValue: false
  }), _dec18 = property({
    type: "boolean",
    defaultValue: false
  }), _dec19 = property({
    type: "boolean",
    defaultValue: false
  }), _dec20 = event(), _dec21 = event(), _dec22 = event(), _dec23 = property({
    type: "boolean|string",
    defaultValue: true
  }), _dec24 = property({
    type: "string"
  }), _dec25 = property({
    type: "string"
  }), _dec26 = property({
    type: "boolean",
    defaultValue: true
  }), _dec27 = event(), _dec28 = xmlEventHandler(), _dec29 = xmlEventHandler(), _dec30 = xmlEventHandler(), _dec31 = xmlEventHandler(), _dec32 = xmlEventHandler(), _dec33 = xmlEventHandler(), _dec34 = xmlEventHandler(), _dec35 = xmlEventHandler(), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    _inheritsLoose(TableAPI, _MacroAPI);

    function TableAPI(mSettings) {
      var _this;

      for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        others[_key - 1] = arguments[_key];
      }

      _this = _MacroAPI.call.apply(_MacroAPI, [this, mSettings].concat(others)) || this;

      _initializerDefineProperty(_this, "metaPath", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "tableDefinition", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "readOnly", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "id", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "busy", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "type", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "enableExport", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "enablePaste", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "enableFullScreen", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "filterBar", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "selectionMode", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "header", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "enableAutoColumnWidth", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "headerVisible", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "dataInitialized", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "bindingSuspended", _descriptor16, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "outDatedBinding", _descriptor17, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "pendingRequest", _descriptor18, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "rowPress", _descriptor19, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "stateChange", _descriptor20, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "internalDataRequested", _descriptor21, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "personalization", _descriptor22, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "variantManagement", _descriptor23, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "menu", _descriptor24, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "isSearchable", _descriptor25, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "selectionChange", _descriptor26, _assertThisInitialized(_this));

      _this.updateFilterBar();

      if (_this.content) {
        _this.content.attachEvent("selectionChange", {}, _this.onTableSelectionChange, _assertThisInitialized(_this));
      }

      return _this;
    }
    /**
     * Defines the relative path of the property in the metamodel, based on the current contextPath.
     *
     * @public
     */


    var _proto = TableAPI.prototype;

    /**
     * Gets contexts from the table that have been selected by the user.
     *
     * @returns Contexts of the rows selected by the user
     * @public
     */
    _proto.getSelectedContexts = function getSelectedContexts() {
      return this.content.getSelectedContexts();
    }
    /**
     * Adds a message to the table.
     *
     * The message applies to the whole table and not to an individual table row.
     *
     * @param [parameters] The parameters to create the message
     * @param parameters.type Message type
     * @param parameters.message Message text
     * @param parameters.description Message description
     * @param parameters.persistent True if the message is persistent
     * @returns The ID of the message
     * @public
     */
    ;

    _proto.addMessage = function addMessage(parameters) {
      var msgManager = this._getMessageManager();

      var oTable = this.content;
      var oMessage = new Message({
        target: oTable.getRowBinding().getResolvedPath(),
        type: parameters.type,
        message: parameters.message,
        processor: oTable.getModel(),
        description: parameters.description,
        persistent: parameters.persistent
      });
      msgManager.addMessages(oMessage);
      return oMessage.getId();
    }
    /**
     * Removes a message from the table.
     *
     * @param id The id of the message
     * @public
     */
    ;

    _proto.removeMessage = function removeMessage(id) {
      var msgManager = this._getMessageManager();

      var messages = msgManager.getMessageModel().getData();
      var result = messages.find(function (e) {
        return e.id === id;
      });

      if (result) {
        msgManager.removeMessages(result);
      }
    };

    _proto._getMessageManager = function _getMessageManager() {
      return sap.ui.getCore().getMessageManager();
    }
    /**
     * An event triggered when the selection in the table changes.
     *
     * @public
     */
    ;

    _proto._getRowBinding = function _getRowBinding() {
      var oTable = this.getContent();
      return oTable.getRowBinding();
    };

    _proto.getCounts = function getCounts() {
      var oTable = this.getContent();
      return TableUtils.getListBindingForCount(oTable, oTable.getBindingContext(), {
        batchGroupId: !this.getProperty("bindingSuspended") ? oTable.data("batchGroupId") : "$auto",
        additionalFilters: TableUtils.getHiddenFilters(oTable)
      }).then(function (iValue) {
        return TableUtils.getCountFormatted(iValue);
      }).catch(function () {
        return "0";
      });
    };

    _proto.onTableRowPress = function onTableRowPress(oEvent, oController, oContext, mParameters) {
      // prevent navigation to an empty row
      if (oContext && oContext.isInactive() && oContext.isTransient()) {
        return false;
      } // In the case of an analytical table, if we're trying to navigate to a context corresponding to a visual group or grand total
      // --> Cancel navigation


      if (oContext && oContext.isA("sap.ui.model.odata.v4.Context") && typeof oContext.getProperty("@$ui5.node.isExpanded") === "boolean") {
        return false;
      } else {
        oController._routing.navigateForwardToContext(oContext, mParameters);
      }
    };

    _proto.onInternalDataReceived = function onInternalDataReceived(oEvent) {
      if (oEvent.getParameter("error")) {
        this.getController().messageHandler.showMessageDialog();
      }
    };

    _proto.onInternalDataRequested = function onInternalDataRequested(oEvent) {
      this.setProperty("dataInitialized", true);
      this.fireEvent("internalDataRequested", oEvent.getParameters());
    };

    _proto.onPaste = function onPaste(oEvent, oController) {
      // If paste is disable or if we're not in edit mode, we can't paste anything
      if (!this.tableDefinition.control.enablePaste || !this.getModel("ui").getProperty("/isEditable")) {
        return;
      }

      var aRawPastedData = oEvent.getParameter("data"),
          oTable = oEvent.getSource();

      if (oTable.getEnablePaste() === true) {
        PasteHelper.pasteData(aRawPastedData, oTable, oController);
      } else {
        var oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
        MessageBox.error(oResourceModel.getText("T_OP_CONTROLLER_SAPFE_PASTE_DISABLED_MESSAGE"), {
          title: oResourceModel.getText("C_COMMON_SAPFE_ERROR")
        });
      }
    } // This event will allow us to intercept the export before is triggered to cover specific cases
    // that couldn't be addressed on the propertyInfos for each column.
    // e.g. Fixed Target Value for the datapoints
    ;

    _proto.onBeforeExport = function onBeforeExport(oEvent) {
      var _exportSettings$workb;

      var isSplitMode = oEvent.getParameters().userExportSettings.splitCells,
          oTableController = oEvent.getSource(),
          oExportColumns = (_exportSettings$workb = oEvent.getParameters().exportSettings.workbook) === null || _exportSettings$workb === void 0 ? void 0 : _exportSettings$workb.columns,
          oTableColumns = this.tableDefinition.columns;
      TableAPI.updateExportSettings(oExportColumns, oTableColumns, oTableController, isSplitMode);
    }
    /**
     * Handles the MDC DataStateIndicator plugin to display messageStrip on a table.
     *
     * @param oMessage
     * @param oTable
     * @name dataStateFilter
     * @returns Whether to render visible the messageStrip
     */
    ;

    TableAPI.dataStateIndicatorFilter = function dataStateIndicatorFilter(oMessage, oTable) {
      var _oTable$getBindingCon;

      var sTableContextBindingPath = (_oTable$getBindingCon = oTable.getBindingContext()) === null || _oTable$getBindingCon === void 0 ? void 0 : _oTable$getBindingCon.getPath();
      var sTableRowBinding = (sTableContextBindingPath ? "".concat(sTableContextBindingPath, "/") : "") + oTable.getRowBinding().getPath();
      return sTableRowBinding === oMessage.getTarget() ? true : false;
    }
    /**
     * This event handles the DataState of the DataStateIndicator plugin from MDC on a table.
     * It's fired when new error messages are sent from the backend to update row highlighting.
     *
     * @name onDataStateChange
     * @param oEvent Event object
     */
    ;

    _proto.onDataStateChange = function onDataStateChange(oEvent) {
      var oDataStateIndicator = oEvent.getSource();
      var aFilteredMessages = oEvent.getParameter("filteredMessages");

      if (aFilteredMessages) {
        var oInternalModel = oDataStateIndicator.getModel("internal");
        oInternalModel.setProperty("filteredMessages", aFilteredMessages, oDataStateIndicator.getBindingContext("internal"));
      }
    };

    TableAPI.updateExportSettings = function updateExportSettings(oExportColumns, oColumns, oTableController, isSplitMode) {
      var refColumn = null;
      var additionalPropertyIndex;
      oExportColumns.forEach(function (oColumnExport) {
        oColumnExport.label = DelegateUtil.getLocalizedText(oColumnExport.label, oTableController); //translate boolean values

        if (oColumnExport.type === "Boolean") {
          var oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");
          oColumnExport.falseValue = oResourceModel.getText("no");
          oColumnExport.trueValue = oResourceModel.getText("yes");
        }

        oColumns === null || oColumns === void 0 ? void 0 : oColumns.forEach(function (column) {
          var oColumn = column;

          if (isSplitMode) {
            var _refColumn;

            //Add TargetValue on dummy created property when exporting on split mode
            if (oColumn.isDataPointFakeTargetProperty && oColumn.relativePath === oColumnExport.property) {
              oColumnExport.property = [oColumnExport.property];
            } // Modify duplicate labels from splitted columns


            var regex = /(.*)-additionalProperty(\d+)/.exec(oColumnExport.columnId);

            if (regex === null) {
              additionalPropertyIndex = 1;
              refColumn = oColumnExport;
            } else if (regex[1] === ((_refColumn = refColumn) === null || _refColumn === void 0 ? void 0 : _refColumn.columnId)) {
              oColumnExport.label = oColumnExport.label === refColumn.label ? "".concat(refColumn.label, " (").concat(++additionalPropertyIndex, ")") : oColumnExport.label;
            }
          }
        });
      });
      return oExportColumns;
    };

    _proto.resumeBinding = function resumeBinding(bRequestIfNotInitialized) {
      this.setProperty("bindingSuspended", false);

      if (bRequestIfNotInitialized && !this.getDataInitialized() || this.getProperty("outDatedBinding")) {
        var _getContent;

        this.setProperty("outDatedBinding", false);
        (_getContent = this.getContent()) === null || _getContent === void 0 ? void 0 : _getContent.rebind();
      }
    };

    _proto.refreshNotApplicableFields = function refreshNotApplicableFields(oFilterControl) {
      var oTable = this.getContent();
      return FilterUtils.getNotApplicableFilters(oFilterControl, oTable);
    };

    _proto.suspendBinding = function suspendBinding() {
      this.setProperty("bindingSuspended", true);
    };

    _proto.invalidateContent = function invalidateContent() {
      this.setProperty("dataInitialized", false);
      this.setProperty("outDatedBinding", false);
    };

    _proto.onMassEditButtonPressed = function onMassEditButtonPressed(oEvent, pageController) {
      var oTable = this.content;

      if (pageController && pageController.massEdit) {
        pageController.massEdit.openMassEditDialog(oTable);
      } else {
        Log.warning("The Controller is not enhanced with Mass Edit functionality");
      }
    };

    _proto.onTableSelectionChange = function onTableSelectionChange(oEvent) {
      this.fireEvent("selectionChange", oEvent.getParameters());
    }
    /**
     * Expose the internal table definition for external usage in delegate.
     *
     * @returns The tableDefinition
     */
    ;

    _proto.getTableDefinition = function getTableDefinition() {
      return this.tableDefinition;
    }
    /**
     * connect the filter to the tableAPI if required
     *
     * @private
     * @alias sap.fe.macros.TableAPI
     */
    ;

    _proto.updateFilterBar = function updateFilterBar() {
      var table = this.getContent();
      var filterBarRefId = this.getFilterBar();

      if (table && filterBarRefId && table.getFilter() !== filterBarRefId) {
        this._setFilterBar(filterBarRefId);
      }
    }
    /**
     * Sets the filter depending on the type of filterBar.
     *
     * @param filterBarRefId Id of the filter bar
     * @private
     * @alias sap.fe.macros.TableAPI
     */
    ;

    _proto._setFilterBar = function _setFilterBar(filterBarRefId) {
      var _CommonUtils$getTarge;

      var table = this.getContent();
      var core = sap.ui.getCore(); // 'filterBar' property of macro:Table(passed as customData) might be
      // 1. A localId wrt View(FPM explorer example).
      // 2. Absolute Id(this was not supported in older versions).
      // 3. A localId wrt FragmentId(when an XMLComposite or Fragment is independently processed) instead of ViewId.
      //    'filterBar' was supported earlier as an 'association' to the 'mdc:Table' control inside 'macro:Table' in prior versions.
      //    In newer versions 'filterBar' is used like an association to 'macro:TableAPI'.
      //    This means that the Id is relative to 'macro:TableAPI'.
      //    This scenario happens in case of FilterBar and Table in a custom sections in OP of FEV4.

      var tableAPIId = this === null || this === void 0 ? void 0 : this.getId();
      var tableAPILocalId = this.data("tableAPILocalId");
      var potentialfilterBarId = tableAPILocalId && filterBarRefId && tableAPIId && tableAPIId.replace(new RegExp(tableAPILocalId + "$"), filterBarRefId); // 3

      var filterBar = ((_CommonUtils$getTarge = CommonUtils.getTargetView(this)) === null || _CommonUtils$getTarge === void 0 ? void 0 : _CommonUtils$getTarge.byId(filterBarRefId)) || core.byId(filterBarRefId) || core.byId(potentialfilterBarId);

      if (filterBar) {
        if (filterBar.isA("sap.fe.macros.filterBar.FilterBarAPI")) {
          table.setFilter("".concat(filterBar.getId(), "-content"));
        } else if (filterBar.isA("sap.ui.mdc.FilterBar")) {
          table.setFilter(filterBar.getId());
        }
      }

      if (this.data("autoBindOnInit")) {
        // rebind the table as the table is ready with the filter bar.
        this.resumeBinding(true);
      }
    };

    _proto.checkIfColumnExists = function checkIfColumnExists(aFilteredColummns, columnName) {
      return aFilteredColummns.some(function (oColumn) {
        if ((oColumn === null || oColumn === void 0 ? void 0 : oColumn.columnName) === columnName && oColumn !== null && oColumn !== void 0 && oColumn.sColumnNameVisible || (oColumn === null || oColumn === void 0 ? void 0 : oColumn.sTextArrangement) !== undefined && (oColumn === null || oColumn === void 0 ? void 0 : oColumn.sTextArrangement) === columnName) {
          return columnName;
        }
      });
    };

    _proto.getIdentifierColumn = function getIdentifierColumn() {
      var oTable = this.getContent();
      var headerInfoTitlePath = this.getTableDefinition().headerInfoTitle;
      var oMetaModel = oTable && oTable.getModel().getMetaModel(),
          sCurrentEntitySetName = oTable.data("metaPath");
      var aTechnicalKeys = oMetaModel.getObject("".concat(sCurrentEntitySetName, "/$Type/$Key"));
      var aFilteredTechnicalKeys = [];

      if (aTechnicalKeys && aTechnicalKeys.length > 0) {
        aTechnicalKeys.forEach(function (technicalKey) {
          if (technicalKey !== "IsActiveEntity") {
            aFilteredTechnicalKeys.push(technicalKey);
          }
        });
      }

      var semanticKeyColumns = this.getTableDefinition().semanticKeys;
      var aVisibleColumns = [];
      var aFilteredColummns = [];
      var aTableColumns = oTable.getColumns();
      aTableColumns.forEach(function (oColumn) {
        var column = oColumn === null || oColumn === void 0 ? void 0 : oColumn.getDataProperty();
        aVisibleColumns.push(column);
      });
      aVisibleColumns.forEach(function (oColumn) {
        var _oTextArrangement$Co, _oTextArrangement$Co2;

        var oTextArrangement = oMetaModel.getObject("".concat(sCurrentEntitySetName, "/$Type/").concat(oColumn, "@"));
        var sTextArrangement = oTextArrangement && ((_oTextArrangement$Co = oTextArrangement["@com.sap.vocabularies.Common.v1.Text"]) === null || _oTextArrangement$Co === void 0 ? void 0 : _oTextArrangement$Co.$Path);
        var sTextPlacement = oTextArrangement && ((_oTextArrangement$Co2 = oTextArrangement["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]) === null || _oTextArrangement$Co2 === void 0 ? void 0 : _oTextArrangement$Co2.$EnumMember);
        aFilteredColummns.push({
          columnName: oColumn,
          sTextArrangement: sTextArrangement,
          sColumnNameVisible: !(sTextPlacement === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly")
        });
      });
      var column;

      if (headerInfoTitlePath !== undefined && this.checkIfColumnExists(aFilteredColummns, headerInfoTitlePath)) {
        column = headerInfoTitlePath;
      } else if (semanticKeyColumns !== undefined && semanticKeyColumns.length === 1 && this.checkIfColumnExists(aFilteredColummns, semanticKeyColumns[0])) {
        column = semanticKeyColumns[0];
      } else if (aFilteredTechnicalKeys !== undefined && aFilteredTechnicalKeys.length === 1 && this.checkIfColumnExists(aFilteredColummns, aFilteredTechnicalKeys[0])) {
        column = aFilteredTechnicalKeys[0];
      }

      return column;
    };

    _proto.setUpEmptyRows = function setUpEmptyRows(oTable) {
      try {
        var _this3$tableDefinitio;

        var _this3 = this;

        if (((_this3$tableDefinitio = _this3.tableDefinition.control) === null || _this3$tableDefinitio === void 0 ? void 0 : _this3$tableDefinitio.creationMode) !== CreationMode.InlineCreationRows) {
          return Promise.resolve();
        }

        var pWaitTableRendered = new Promise(function (resolve) {
          if (oTable.getDomRef()) {
            resolve();
          } else {
            var delegate = {
              onAfterRendering: function () {
                oTable.removeEventDelegate(delegate);
                resolve();
              }
            };
            oTable.addEventDelegate(delegate, _this3);
          }
        });
        return Promise.resolve(pWaitTableRendered).then(function () {
          var bIsInEditMode = oTable.getModel("ui").getProperty("/isEditable");

          if (!bIsInEditMode) {
            return;
          }

          var oBinding = oTable.getRowBinding();

          var _temp2 = function () {
            if (oBinding.isResolved() && oBinding.isLengthFinal()) {
              var sContextPath = oBinding.getContext().getPath();
              var oInactiveContext = oBinding.getAllCurrentContexts().find(function (oContext) {
                return oContext.isInactive() && oContext.getPath().startsWith(sContextPath);
              });

              var _temp3 = function () {
                if (!oInactiveContext) {
                  return Promise.resolve(_this3._createEmptyRow(oBinding, oTable)).then(function () {});
                }
              }();

              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            }
          }();

          if (_temp2 && _temp2.then) return _temp2.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._createEmptyRow = function _createEmptyRow(oBinding, oTable) {
      try {
        var _this5$tableDefinitio;

        var _this5 = this;

        var iInlineCreationRowCount = ((_this5$tableDefinitio = _this5.tableDefinition.control) === null || _this5$tableDefinitio === void 0 ? void 0 : _this5$tableDefinitio.inlineCreationRowCount) || 2;
        var aData = [];

        for (var i = 0; i < iInlineCreationRowCount; i += 1) {
          aData.push({});
        }

        var bAtEnd = oTable.data("tableType") !== "ResponsiveTable";
        var bInactive = true;
        var oView = CommonUtils.getTargetView(oTable);
        var oController = oView.getController();
        var oInternalEditFlow = oController._editFlow;

        var _temp6 = function () {
          if (!_this5.creatingEmptyRows) {
            _this5.creatingEmptyRows = true;

            var _temp7 = _finallyRethrows(function () {
              return _catch(function () {
                return Promise.resolve(oInternalEditFlow.createMultipleDocuments(oBinding, aData, bAtEnd, false, oController.editFlow.onBeforeCreate, bInactive)).then(function (aContexts) {
                  aContexts === null || aContexts === void 0 ? void 0 : aContexts.forEach(function (oContext) {
                    oContext.created().catch(function (oError) {
                      if (!oError.canceled) {
                        throw oError;
                      }
                    });
                  });
                });
              }, function (e) {
                Log.error(e);
              });
            }, function (_wasThrown, _result) {
              _this5.creatingEmptyRows = false;
              if (_wasThrown) throw _result;
              return _result;
            });

            if (_temp7 && _temp7.then) return _temp7.then(function () {});
          }
        }();

        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return TableAPI;
  }(MacroAPI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tableDefinition", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "readOnly", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "busy", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableExport", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enablePaste", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "enableFullScreen", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "filterBar", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "selectionMode", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "header", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoColumnWidth", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "headerVisible", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "dataInitialized", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "bindingSuspended", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "outDatedBinding", [_dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "pendingRequest", [_dec19], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "rowPress", [_dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "stateChange", [_dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "internalDataRequested", [_dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "personalization", [_dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "variantManagement", [_dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "menu", [_dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "isSearchable", [_dec26], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "selectionChange", [_dec27], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "onTableRowPress", [_dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "onTableRowPress"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onInternalDataReceived", [_dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "onInternalDataReceived"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onInternalDataRequested", [_dec30], Object.getOwnPropertyDescriptor(_class2.prototype, "onInternalDataRequested"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPaste", [_dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "onPaste"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeExport", [_dec32], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeExport"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onDataStateChange", [_dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "onDataStateChange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onMassEditButtonPressed", [_dec34], Object.getOwnPropertyDescriptor(_class2.prototype, "onMassEditButtonPressed"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onTableSelectionChange", [_dec35], Object.getOwnPropertyDescriptor(_class2.prototype, "onTableSelectionChange"), _class2.prototype)), _class2)) || _class);
  return TableAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiZmluYWxpemVyIiwiYmluZCIsIlRhYmxlQVBJIiwiZGVmaW5lVUk1Q2xhc3MiLCJwcm9wZXJ0eSIsInR5cGUiLCJleHBlY3RlZFR5cGVzIiwiZXhwZWN0ZWRBbm5vdGF0aW9ucyIsImRlZmF1bHRWYWx1ZSIsImV2ZW50IiwieG1sRXZlbnRIYW5kbGVyIiwibVNldHRpbmdzIiwib3RoZXJzIiwidXBkYXRlRmlsdGVyQmFyIiwiY29udGVudCIsImF0dGFjaEV2ZW50Iiwib25UYWJsZVNlbGVjdGlvbkNoYW5nZSIsImdldFNlbGVjdGVkQ29udGV4dHMiLCJhZGRNZXNzYWdlIiwicGFyYW1ldGVycyIsIm1zZ01hbmFnZXIiLCJfZ2V0TWVzc2FnZU1hbmFnZXIiLCJvVGFibGUiLCJvTWVzc2FnZSIsIk1lc3NhZ2UiLCJ0YXJnZXQiLCJnZXRSb3dCaW5kaW5nIiwiZ2V0UmVzb2x2ZWRQYXRoIiwibWVzc2FnZSIsInByb2Nlc3NvciIsImdldE1vZGVsIiwiZGVzY3JpcHRpb24iLCJwZXJzaXN0ZW50IiwiYWRkTWVzc2FnZXMiLCJnZXRJZCIsInJlbW92ZU1lc3NhZ2UiLCJpZCIsIm1lc3NhZ2VzIiwiZ2V0TWVzc2FnZU1vZGVsIiwiZ2V0RGF0YSIsImZpbmQiLCJyZW1vdmVNZXNzYWdlcyIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldE1lc3NhZ2VNYW5hZ2VyIiwiX2dldFJvd0JpbmRpbmciLCJnZXRDb250ZW50IiwiZ2V0Q291bnRzIiwiVGFibGVVdGlscyIsImdldExpc3RCaW5kaW5nRm9yQ291bnQiLCJnZXRCaW5kaW5nQ29udGV4dCIsImJhdGNoR3JvdXBJZCIsImdldFByb3BlcnR5IiwiZGF0YSIsImFkZGl0aW9uYWxGaWx0ZXJzIiwiZ2V0SGlkZGVuRmlsdGVycyIsImlWYWx1ZSIsImdldENvdW50Rm9ybWF0dGVkIiwiY2F0Y2giLCJvblRhYmxlUm93UHJlc3MiLCJvRXZlbnQiLCJvQ29udHJvbGxlciIsIm9Db250ZXh0IiwibVBhcmFtZXRlcnMiLCJpc0luYWN0aXZlIiwiaXNUcmFuc2llbnQiLCJpc0EiLCJfcm91dGluZyIsIm5hdmlnYXRlRm9yd2FyZFRvQ29udGV4dCIsIm9uSW50ZXJuYWxEYXRhUmVjZWl2ZWQiLCJnZXRQYXJhbWV0ZXIiLCJnZXRDb250cm9sbGVyIiwibWVzc2FnZUhhbmRsZXIiLCJzaG93TWVzc2FnZURpYWxvZyIsIm9uSW50ZXJuYWxEYXRhUmVxdWVzdGVkIiwic2V0UHJvcGVydHkiLCJmaXJlRXZlbnQiLCJnZXRQYXJhbWV0ZXJzIiwib25QYXN0ZSIsInRhYmxlRGVmaW5pdGlvbiIsImNvbnRyb2wiLCJlbmFibGVQYXN0ZSIsImFSYXdQYXN0ZWREYXRhIiwiZ2V0U291cmNlIiwiZ2V0RW5hYmxlUGFzdGUiLCJQYXN0ZUhlbHBlciIsInBhc3RlRGF0YSIsIm9SZXNvdXJjZU1vZGVsIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiTWVzc2FnZUJveCIsImVycm9yIiwiZ2V0VGV4dCIsInRpdGxlIiwib25CZWZvcmVFeHBvcnQiLCJpc1NwbGl0TW9kZSIsInVzZXJFeHBvcnRTZXR0aW5ncyIsInNwbGl0Q2VsbHMiLCJvVGFibGVDb250cm9sbGVyIiwib0V4cG9ydENvbHVtbnMiLCJleHBvcnRTZXR0aW5ncyIsIndvcmtib29rIiwiY29sdW1ucyIsIm9UYWJsZUNvbHVtbnMiLCJ1cGRhdGVFeHBvcnRTZXR0aW5ncyIsImRhdGFTdGF0ZUluZGljYXRvckZpbHRlciIsInNUYWJsZUNvbnRleHRCaW5kaW5nUGF0aCIsImdldFBhdGgiLCJzVGFibGVSb3dCaW5kaW5nIiwiZ2V0VGFyZ2V0Iiwib25EYXRhU3RhdGVDaGFuZ2UiLCJvRGF0YVN0YXRlSW5kaWNhdG9yIiwiYUZpbHRlcmVkTWVzc2FnZXMiLCJvSW50ZXJuYWxNb2RlbCIsIm9Db2x1bW5zIiwicmVmQ29sdW1uIiwiYWRkaXRpb25hbFByb3BlcnR5SW5kZXgiLCJmb3JFYWNoIiwib0NvbHVtbkV4cG9ydCIsImxhYmVsIiwiRGVsZWdhdGVVdGlsIiwiZ2V0TG9jYWxpemVkVGV4dCIsImZhbHNlVmFsdWUiLCJ0cnVlVmFsdWUiLCJjb2x1bW4iLCJvQ29sdW1uIiwiaXNEYXRhUG9pbnRGYWtlVGFyZ2V0UHJvcGVydHkiLCJyZWxhdGl2ZVBhdGgiLCJyZWdleCIsImV4ZWMiLCJjb2x1bW5JZCIsInJlc3VtZUJpbmRpbmciLCJiUmVxdWVzdElmTm90SW5pdGlhbGl6ZWQiLCJnZXREYXRhSW5pdGlhbGl6ZWQiLCJyZWJpbmQiLCJyZWZyZXNoTm90QXBwbGljYWJsZUZpZWxkcyIsIm9GaWx0ZXJDb250cm9sIiwiRmlsdGVyVXRpbHMiLCJnZXROb3RBcHBsaWNhYmxlRmlsdGVycyIsInN1c3BlbmRCaW5kaW5nIiwiaW52YWxpZGF0ZUNvbnRlbnQiLCJvbk1hc3NFZGl0QnV0dG9uUHJlc3NlZCIsInBhZ2VDb250cm9sbGVyIiwibWFzc0VkaXQiLCJvcGVuTWFzc0VkaXREaWFsb2ciLCJMb2ciLCJ3YXJuaW5nIiwiZ2V0VGFibGVEZWZpbml0aW9uIiwidGFibGUiLCJmaWx0ZXJCYXJSZWZJZCIsImdldEZpbHRlckJhciIsImdldEZpbHRlciIsIl9zZXRGaWx0ZXJCYXIiLCJjb3JlIiwidGFibGVBUElJZCIsInRhYmxlQVBJTG9jYWxJZCIsInBvdGVudGlhbGZpbHRlckJhcklkIiwicmVwbGFjZSIsIlJlZ0V4cCIsImZpbHRlckJhciIsIkNvbW1vblV0aWxzIiwiZ2V0VGFyZ2V0VmlldyIsImJ5SWQiLCJzZXRGaWx0ZXIiLCJjaGVja0lmQ29sdW1uRXhpc3RzIiwiYUZpbHRlcmVkQ29sdW1tbnMiLCJjb2x1bW5OYW1lIiwic29tZSIsInNDb2x1bW5OYW1lVmlzaWJsZSIsInNUZXh0QXJyYW5nZW1lbnQiLCJ1bmRlZmluZWQiLCJnZXRJZGVudGlmaWVyQ29sdW1uIiwiaGVhZGVySW5mb1RpdGxlUGF0aCIsImhlYWRlckluZm9UaXRsZSIsIm9NZXRhTW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJzQ3VycmVudEVudGl0eVNldE5hbWUiLCJhVGVjaG5pY2FsS2V5cyIsImdldE9iamVjdCIsImFGaWx0ZXJlZFRlY2huaWNhbEtleXMiLCJsZW5ndGgiLCJ0ZWNobmljYWxLZXkiLCJwdXNoIiwic2VtYW50aWNLZXlDb2x1bW5zIiwic2VtYW50aWNLZXlzIiwiYVZpc2libGVDb2x1bW5zIiwiYVRhYmxlQ29sdW1ucyIsImdldENvbHVtbnMiLCJnZXREYXRhUHJvcGVydHkiLCJvVGV4dEFycmFuZ2VtZW50IiwiJFBhdGgiLCJzVGV4dFBsYWNlbWVudCIsIiRFbnVtTWVtYmVyIiwic2V0VXBFbXB0eVJvd3MiLCJjcmVhdGlvbk1vZGUiLCJDcmVhdGlvbk1vZGUiLCJJbmxpbmVDcmVhdGlvblJvd3MiLCJwV2FpdFRhYmxlUmVuZGVyZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImdldERvbVJlZiIsImRlbGVnYXRlIiwib25BZnRlclJlbmRlcmluZyIsInJlbW92ZUV2ZW50RGVsZWdhdGUiLCJhZGRFdmVudERlbGVnYXRlIiwiYklzSW5FZGl0TW9kZSIsIm9CaW5kaW5nIiwiaXNSZXNvbHZlZCIsImlzTGVuZ3RoRmluYWwiLCJzQ29udGV4dFBhdGgiLCJnZXRDb250ZXh0Iiwib0luYWN0aXZlQ29udGV4dCIsImdldEFsbEN1cnJlbnRDb250ZXh0cyIsInN0YXJ0c1dpdGgiLCJfY3JlYXRlRW1wdHlSb3ciLCJpSW5saW5lQ3JlYXRpb25Sb3dDb3VudCIsImlubGluZUNyZWF0aW9uUm93Q291bnQiLCJhRGF0YSIsImkiLCJiQXRFbmQiLCJiSW5hY3RpdmUiLCJvVmlldyIsIm9JbnRlcm5hbEVkaXRGbG93IiwiX2VkaXRGbG93IiwiY3JlYXRpbmdFbXB0eVJvd3MiLCJjcmVhdGVNdWx0aXBsZURvY3VtZW50cyIsImVkaXRGbG93Iiwib25CZWZvcmVDcmVhdGUiLCJhQ29udGV4dHMiLCJjcmVhdGVkIiwib0Vycm9yIiwiY2FuY2VsZWQiLCJNYWNyb0FQSSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVGFibGVBUEkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IEFubm90YXRpb25UYWJsZUNvbHVtbiwgVGFibGVDb2x1bW4sIFRhYmxlVmlzdWFsaXphdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9UYWJsZVwiO1xuaW1wb3J0IHsgQ3JlYXRpb25Nb2RlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBQcm9wZXJ0aWVzT2YgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBldmVudCwgcHJvcGVydHksIHhtbEV2ZW50SGFuZGxlciB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IFBhc3RlSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1Bhc3RlSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgRmlsdGVyVXRpbHMgZnJvbSBcInNhcC9mZS9tYWNyb3MvZmlsdGVyL0ZpbHRlclV0aWxzXCI7XG5pbXBvcnQgVGFibGVVdGlscyBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9VdGlsc1wiO1xuaW1wb3J0IE1lc3NhZ2VCb3ggZnJvbSBcInNhcC9tL01lc3NhZ2VCb3hcIjtcbmltcG9ydCBEYXRhU3RhdGVJbmRpY2F0b3IgZnJvbSBcInNhcC9tL3BsdWdpbnMvRGF0YVN0YXRlSW5kaWNhdG9yXCI7XG5pbXBvcnQgVUk1RXZlbnQgZnJvbSBcInNhcC91aS9iYXNlL0V2ZW50XCI7XG5pbXBvcnQgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwic2FwL3VpL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSBcInNhcC91aS9jb3JlL21lc3NhZ2UvTWVzc2FnZVwiO1xuaW1wb3J0IFRhYmxlIGZyb20gXCJzYXAvdWkvbWRjL1RhYmxlXCI7XG5pbXBvcnQgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuaW1wb3J0IE9EYXRhTGlzdEJpbmRpbmcgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YUxpc3RCaW5kaW5nXCI7XG5pbXBvcnQgTWFjcm9BUEkgZnJvbSBcIi4uL01hY3JvQVBJXCI7XG5cbi8qKlxuICogRGVmaW5pdGlvbiBvZiBhIGN1c3RvbSBhY3Rpb24gdG8gYmUgdXNlZCBpbnNpZGUgdGhlIHRhYmxlIHRvb2xiYXJcbiAqXG4gKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy50YWJsZS5BY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgQWN0aW9uID0ge1xuXHQvKipcblx0ICogVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGFjdGlvblxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRrZXk6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSB0ZXh0IHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgZm9yIHRoaXMgYWN0aW9uXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHRleHQ6IHN0cmluZztcblx0LyoqXG5cdCAqIFJlZmVyZW5jZSB0byB0aGUga2V5IG9mIGFub3RoZXIgYWN0aW9uIGFscmVhZHkgZGlzcGxheWVkIGluIHRoZSB0b29sYmFyIHRvIHByb3Blcmx5IHBsYWNlIHRoaXMgb25lXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGFuY2hvcj86IHN0cmluZztcblx0LyoqXG5cdCAqIERlZmluZXMgd2hlcmUgdGhpcyBhY3Rpb24gc2hvdWxkIGJlIHBsYWNlZCByZWxhdGl2ZSB0byB0aGUgZGVmaW5lZCBhbmNob3Jcblx0ICpcblx0ICogQWxsb3dlZCB2YWx1ZXMgYXJlIGBCZWZvcmVgIGFuZCBgQWZ0ZXJgXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHBsYWNlbWVudD86IHN0cmluZztcblxuXHQvKipcblx0ICogRXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaG9vc2VzIHRoZSBhY3Rpb25cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0cHJlc3M6IHN0cmluZztcblxuXHQvKipcblx0ICogRGVmaW5lcyBpZiB0aGUgYWN0aW9uIHJlcXVpcmVzIGEgc2VsZWN0aW9uLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRyZXF1aXJlc1NlbGVjdGlvbj86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEVuYWJsZXMgb3IgZGlzYWJsZXMgdGhlIGFjdGlvblxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRlbmFibGVkPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIEFjdGlvbkdyb3VwID0ge1xuXHQvKipcblx0ICogRGVmaW5lcyBuZXN0ZWQgYWN0aW9uc1xuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRhY3Rpb25zOiBBY3Rpb25bXTtcblxuXHQvKipcblx0ICogVGhlIHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBmb3IgdGhpcyBhY3Rpb24gZ3JvdXBcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0dGV4dDogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHdoZXJlIHRoaXMgYWN0aW9uIGdyb3VwIHNob3VsZCBiZSBwbGFjZWQgcmVsYXRpdmUgdG8gdGhlIGRlZmluZWQgYW5jaG9yXG5cdCAqXG5cdCAqIEFsbG93ZWQgdmFsdWVzIGFyZSBgQmVmb3JlYCBhbmQgYEFmdGVyYFxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRwbGFjZW1lbnQ/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFJlZmVyZW5jZSB0byB0aGUga2V5IG9mIGFub3RoZXIgYWN0aW9uIG9yIGFjdGlvbiBncm91cCBhbHJlYWR5IGRpc3BsYXllZCBpbiB0aGUgdG9vbGJhciB0byBwcm9wZXJseSBwbGFjZSB0aGlzIG9uZVxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRhbmNob3I/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBjdXN0b20gY29sdW1uIHRvIGJlIHVzZWQgaW5zaWRlIHRoZSB0YWJsZS5cbiAqXG4gKiBUaGUgdGVtcGxhdGUgZm9yIHRoZSBjb2x1bW4gaGFzIHRvIGJlIHByb3ZpZGVkIGFzIHRoZSBkZWZhdWx0IGFnZ3JlZ2F0aW9uXG4gKlxuICogQGFsaWFzIHNhcC5mZS5tYWNyb3MudGFibGUuQ29sdW1uXG4gKiBAcHVibGljXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCB0eXBlIENvbHVtbiA9IHtcblx0LyoqXG5cdCAqIFVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBjb2x1bW5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0a2V5OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgdGV4dCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIGZvciB0aGlzIGNvbHVtbiBoZWFkZXJcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0aGVhZGVyOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBSZWZlcmVuY2UgdG8gdGhlIGtleSBvZiBhbm90aGVyIGNvbHVtbiBhbHJlYWR5IGRpc3BsYXllZCBpbiB0aGUgdGFibGUgdG8gcHJvcGVybHkgcGxhY2UgdGhpcyBvbmVcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0YW5jaG9yPzogc3RyaW5nO1xuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgY29sdW1uIGltcG9ydGFuY2Vcblx0ICpcblx0ICogWW91IGNhbiBkZWZpbmUgd2hpY2ggY29sdW1ucyBzaG91bGQgYmUgYXV0b21hdGljYWxseSBtb3ZlZCB0byB0aGUgcG9wLWluIGFyZWEgYmFzZWQgb24gdGhlaXIgaW1wb3J0YW5jZVxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRpbXBvcnRhbmNlPzogc3RyaW5nO1xuXHQvKipcblx0ICogRGVmaW5lcyB3aGVyZSB0aGlzIGNvbHVtbiBzaG91bGQgYmUgcGxhY2VkIHJlbGF0aXZlIHRvIHRoZSBkZWZpbmVkIGFuY2hvclxuXHQgKlxuXHQgKiBBbGxvd2VkIHZhbHVlcyBhcmUgYEJlZm9yZWAgYW5kIGBBZnRlcmBcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0cGxhY2VtZW50Pzogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBCdWlsZGluZyBibG9jayB1c2VkIHRvIGNyZWF0ZSBhIHRhYmxlIGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSBWNC5cbiAqIDxicj5cbiAqIFVzdWFsbHksIGEgTGluZUl0ZW0gb3IgUHJlc2VudGF0aW9uVmFyaWFudCBhbm5vdGF0aW9uIGlzIGV4cGVjdGVkLCBidXQgdGhlIFRhYmxlIGJ1aWxkaW5nIGJsb2NrIGNhbiBhbHNvIGJlIHVzZWQgdG8gZGlzcGxheSBhbiBFbnRpdHlTZXQuXG4gKlxuICpcbiAqIFVzYWdlIGV4YW1wbGU6XG4gKiA8cHJlPlxuICogJmx0O21hY3JvOlRhYmxlIGlkPVwiTXlUYWJsZVwiIG1ldGFQYXRoPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCIgLyZndDtcbiAqIDwvcHJlPlxuICpcbiAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLlRhYmxlXG4gKiBAcHVibGljXG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5tYWNyb3MudGFibGUuVGFibGVBUElcIilcbmNsYXNzIFRhYmxlQVBJIGV4dGVuZHMgTWFjcm9BUEkge1xuXHRjcmVhdGluZ0VtcHR5Um93cz86IGJvb2xlYW47XG5cdGNvbnN0cnVjdG9yKG1TZXR0aW5ncz86IFByb3BlcnRpZXNPZjxUYWJsZUFQST4sIC4uLm90aGVyczogYW55W10pIHtcblx0XHRzdXBlcihtU2V0dGluZ3MgYXMgYW55LCAuLi5vdGhlcnMpO1xuXG5cdFx0dGhpcy51cGRhdGVGaWx0ZXJCYXIoKTtcblxuXHRcdGlmICh0aGlzLmNvbnRlbnQpIHtcblx0XHRcdHRoaXMuY29udGVudC5hdHRhY2hFdmVudChcInNlbGVjdGlvbkNoYW5nZVwiLCB7fSwgdGhpcy5vblRhYmxlU2VsZWN0aW9uQ2hhbmdlLCB0aGlzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgcHJvcGVydHkgaW4gdGhlIG1ldGFtb2RlbCwgYmFzZWQgb24gdGhlIGN1cnJlbnQgY29udGV4dFBhdGguXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7XG5cdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRleHBlY3RlZFR5cGVzOiBbXCJFbnRpdHlTZXRcIiwgXCJFbnRpdHlUeXBlXCIsIFwiU2luZ2xldG9uXCIsIFwiTmF2aWdhdGlvblByb3BlcnR5XCJdLFxuXHRcdGV4cGVjdGVkQW5ub3RhdGlvbnM6IFtcblx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIixcblx0XHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUHJlc2VudGF0aW9uVmFyaWFudFwiLFxuXHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50XCJcblx0XHRdXG5cdH0pXG5cdG1ldGFQYXRoITogc3RyaW5nO1xuXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIiB9KVxuXHR0YWJsZURlZmluaXRpb24hOiBUYWJsZVZpc3VhbGl6YXRpb247XG5cblx0LyoqXG5cdCAqIEFuIGV4cHJlc3Npb24gdGhhdCBhbGxvd3MgeW91IHRvIGNvbnRyb2wgdGhlICdyZWFkLW9ubHknIHN0YXRlIG9mIHRoZSB0YWJsZS5cblx0ICpcblx0ICogSWYgeW91IGRvIG5vdCBzZXQgYW55IGV4cHJlc3Npb24sIFNBUCBGaW9yaSBlbGVtZW50cyBob29rcyBpbnRvIHRoZSBzdGFuZGFyZCBsaWZlY3ljbGUgdG8gZGV0ZXJtaW5lIHRoZSBjdXJyZW50IHN0YXRlLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiB9KVxuXHRyZWFkT25seSE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSB0YWJsZSBjb250cm9sLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXG5cdGlkITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBBbiBleHByZXNzaW9uIHRoYXQgYWxsb3dzIHlvdSB0byBjb250cm9sIHRoZSAnYnVzeScgc3RhdGUgb2YgdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KVxuXHRidXN5ITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgdHlwZSBvZiB0YWJsZSB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgYnVpbGRpbmcgYmxvY2sgdG8gcmVuZGVyIHRoZSBkYXRhLlxuXHQgKlxuXHQgKiBBbGxvd2VkIHZhbHVlcyBhcmUgYEdyaWRUYWJsZWAgYW5kIGBSZXNwb25zaXZlVGFibGVgXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIsIGRlZmF1bHRWYWx1ZTogXCJSZXNwb25zaXZlVGFibGVcIiB9KVxuXHR0eXBlITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBDb250cm9scyBpZiB0aGUgZXhwb3J0IGZ1bmN0aW9uYWxpdHkgb2YgdGhlIHRhYmxlIGlzIGVuYWJsZWQgb3Igbm90LlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiB0cnVlIH0pXG5cdGVuYWJsZUV4cG9ydCE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIGlmIHRoZSBwYXN0ZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSB0YWJsZSBpcyBlbmFibGVkIG9yIG5vdC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UgfSlcblx0ZW5hYmxlUGFzdGUhOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBDb250cm9scyB3aGV0aGVyIHRoZSB0YWJsZSBjYW4gYmUgb3BlbmVkIGluIGZ1bGxzY3JlZW4gbW9kZSBvciBub3QuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlIH0pXG5cdGVuYWJsZUZ1bGxTY3JlZW4hOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBJRCBvZiB0aGUgRmlsdGVyQmFyIGJ1aWxkaW5nIGJsb2NrIGFzc29jaWF0ZWQgd2l0aCB0aGUgdGFibGUuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0ZmlsdGVyQmFyITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSBzZWxlY3Rpb24gbW9kZSB0byBiZSB1c2VkIGJ5IHRoZSB0YWJsZS5cblx0ICpcblx0ICogQWxsb3dlZCB2YWx1ZXMgYXJlIGBOb25lYCwgYFNpbmdsZWAsIGBNdWx0aWAgb3IgYEF1dG9gXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0c2VsZWN0aW9uTW9kZSE6IHN0cmluZztcblxuXHQvKipcblx0ICogU3BlY2lmaWVzIHRoZSBoZWFkZXIgdGV4dCB0aGF0IGlzIHNob3duIGluIHRoZSB0YWJsZS5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRoZWFkZXIhOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFNwZWNpZmllcyB0aGUgaGVhZGVyIHRleHQgdGhhdCBpcyBzaG93biBpbiB0aGUgdGFibGUuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlIH0pXG5cdGVuYWJsZUF1dG9Db2x1bW5XaWR0aCE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIGlmIHRoZSBoZWFkZXIgdGV4dCBzaG91bGQgYmUgc2hvd24gb3Igbm90LlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiB0cnVlIH0pXG5cdGhlYWRlclZpc2libGUhOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UgfSlcblx0ZGF0YUluaXRpYWxpemVkITogYm9vbGVhbjtcblxuXHQvKipcblx0ICpcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlIH0pXG5cdGJpbmRpbmdTdXNwZW5kZWQhOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UgfSlcblx0b3V0RGF0ZWRCaW5kaW5nITogYm9vbGVhbjtcblxuXHQvKipcblx0ICpcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlIH0pXG5cdHBlbmRpbmdSZXF1ZXN0ITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgY2hvb3NlcyBhIHJvdzsgdGhlIGV2ZW50IGNvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHdoaWNoIHJvdyB3YXMgY2hvc2VuLlxuXHQgKlxuXHQgKiBZb3UgY2FuIHNldCB0aGlzIGluIG9yZGVyIHRvIGhhbmRsZSB0aGUgbmF2aWdhdGlvbiBtYW51YWxseS5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QGV2ZW50KClcblx0cm93UHJlc3MhOiBGdW5jdGlvbjtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgdHJpZ2dlcmVkIHdoZW4gdGhlIFRhYmxlIFN0YXRlIGNoYW5nZXMuXG5cdCAqXG5cdCAqIFlvdSBjYW4gc2V0IHRoaXMgaW4gb3JkZXIgdG8gc3RvcmUgdGhlIHRhYmxlIHN0YXRlIGluIHRoZSBhcHBzdGF0ZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdEBldmVudCgpXG5cdHN0YXRlQ2hhbmdlITogRnVuY3Rpb247XG5cblx0QGV2ZW50KClcblx0aW50ZXJuYWxEYXRhUmVxdWVzdGVkITogRnVuY3Rpb247XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIHdoaWNoIG9wdGlvbnMgc2hvdWxkIGJlIGVuYWJsZWQgZm9yIHRoZSB0YWJsZSBwZXJzb25hbGl6YXRpb24gZGlhbG9nLlxuXHQgKlxuXHQgKiBJZiBpdCBpcyBzZXQgdG8gYHRydWVgLCBhbGwgcG9zc2libGUgb3B0aW9ucyBmb3IgdGhpcyBraW5kIG9mIHRhYmxlIGFyZSBlbmFibGVkLjxici8+XG5cdCAqIElmIGl0IGlzIHNldCB0byBgZmFsc2VgLCBwZXJzb25hbGl6YXRpb24gaXMgZGlzYWJsZWQuPGJyLz5cblx0ICo8YnIvPlxuXHQgKiBZb3UgY2FuIGFsc28gcHJvdmlkZSBhIG1vcmUgZ3JhbnVsYXIgY29udHJvbCBmb3IgdGhlIHBlcnNvbmFsaXphdGlvbiBieSBwcm92aWRpbmcgYSBjb21tYS1zZXBhcmF0ZWQgbGlzdCB3aXRoIHRoZSBvcHRpb25zIHlvdSB3YW50IHRvIGJlIGF2YWlsYWJsZS48YnIvPlxuXHQgKiBBdmFpbGFibGUgb3B0aW9ucyBhcmU6PGJyLz5cblx0ICogIC0gU29ydDxici8+XG5cdCAqICAtIENvbHVtbjxici8+XG5cdCAqICAtIEZpbHRlcjxici8+XG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBwcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhbnxzdHJpbmdcIiwgZGVmYXVsdFZhbHVlOiB0cnVlIH0pXG5cdHBlcnNvbmFsaXphdGlvbiE6IGJvb2xlYW4gfCBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIHRoZSBraW5kIG9mIHZhcmlhbnQgbWFuYWdlbWVudCB0aGF0IHNob3VsZCBiZSBlbmFibGVkIGZvciB0aGUgdGFibGUuXG5cdCAqXG5cdCAqIEFsbG93ZWQgdmFsdWUgaXMgYENvbnRyb2xgLjxici8+XG5cdCAqIElmIHNldCB3aXRoIHZhbHVlIGBDb250cm9sYCwgYSB2YXJpYW50IG1hbmFnZW1lbnQgY29udHJvbCBpcyBzZWVuIHdpdGhpbiB0aGUgdGFibGUgYW5kIHRoZSB0YWJsZSBpcyBsaW5rZWQgdG8gdGhpcy48YnIvPlxuXHQgKiBJZiBub3Qgc2V0IHdpdGggYW55IHZhbHVlLCBjb250cm9sIGxldmVsIHZhcmlhbnQgbWFuYWdlbWVudCBpcyBub3QgYXZhaWxhYmxlIGZvciB0aGlzIHRhYmxlLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAcHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXG5cdHZhcmlhbnRNYW5hZ2VtZW50ITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBHcm91cHMgbWVudSBhY3Rpb25zIGJ5IGtleS5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRtZW51Pzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgc2VhcmNoIGFjdGlvbi5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QHByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSB9KVxuXHRpc1NlYXJjaGFibGU/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBHZXRzIGNvbnRleHRzIGZyb20gdGhlIHRhYmxlIHRoYXQgaGF2ZSBiZWVuIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBDb250ZXh0cyBvZiB0aGUgcm93cyBzZWxlY3RlZCBieSB0aGUgdXNlclxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRnZXRTZWxlY3RlZENvbnRleHRzKCk6IENvbnRleHRbXSB7XG5cdFx0cmV0dXJuICh0aGlzLmNvbnRlbnQgYXMgYW55KS5nZXRTZWxlY3RlZENvbnRleHRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhIG1lc3NhZ2UgdG8gdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBUaGUgbWVzc2FnZSBhcHBsaWVzIHRvIHRoZSB3aG9sZSB0YWJsZSBhbmQgbm90IHRvIGFuIGluZGl2aWR1YWwgdGFibGUgcm93LlxuXHQgKlxuXHQgKiBAcGFyYW0gW3BhcmFtZXRlcnNdIFRoZSBwYXJhbWV0ZXJzIHRvIGNyZWF0ZSB0aGUgbWVzc2FnZVxuXHQgKiBAcGFyYW0gcGFyYW1ldGVycy50eXBlIE1lc3NhZ2UgdHlwZVxuXHQgKiBAcGFyYW0gcGFyYW1ldGVycy5tZXNzYWdlIE1lc3NhZ2UgdGV4dFxuXHQgKiBAcGFyYW0gcGFyYW1ldGVycy5kZXNjcmlwdGlvbiBNZXNzYWdlIGRlc2NyaXB0aW9uXG5cdCAqIEBwYXJhbSBwYXJhbWV0ZXJzLnBlcnNpc3RlbnQgVHJ1ZSBpZiB0aGUgbWVzc2FnZSBpcyBwZXJzaXN0ZW50XG5cdCAqIEByZXR1cm5zIFRoZSBJRCBvZiB0aGUgbWVzc2FnZVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRhZGRNZXNzYWdlKHBhcmFtZXRlcnM6IHsgdHlwZT86IE1lc3NhZ2VUeXBlOyBtZXNzYWdlPzogc3RyaW5nOyBkZXNjcmlwdGlvbj86IHN0cmluZzsgcGVyc2lzdGVudD86IGJvb2xlYW4gfSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgbXNnTWFuYWdlciA9IHRoaXMuX2dldE1lc3NhZ2VNYW5hZ2VyKCk7XG5cblx0XHRjb25zdCBvVGFibGUgPSB0aGlzLmNvbnRlbnQgYXMgYW55IGFzIFRhYmxlO1xuXG5cdFx0Y29uc3Qgb01lc3NhZ2UgPSBuZXcgTWVzc2FnZSh7XG5cdFx0XHR0YXJnZXQ6IG9UYWJsZS5nZXRSb3dCaW5kaW5nKCkuZ2V0UmVzb2x2ZWRQYXRoKCksXG5cdFx0XHR0eXBlOiBwYXJhbWV0ZXJzLnR5cGUsXG5cdFx0XHRtZXNzYWdlOiBwYXJhbWV0ZXJzLm1lc3NhZ2UsXG5cdFx0XHRwcm9jZXNzb3I6IG9UYWJsZS5nZXRNb2RlbCgpLFxuXHRcdFx0ZGVzY3JpcHRpb246IHBhcmFtZXRlcnMuZGVzY3JpcHRpb24sXG5cdFx0XHRwZXJzaXN0ZW50OiBwYXJhbWV0ZXJzLnBlcnNpc3RlbnRcblx0XHR9KTtcblxuXHRcdG1zZ01hbmFnZXIuYWRkTWVzc2FnZXMob01lc3NhZ2UpO1xuXHRcdHJldHVybiBvTWVzc2FnZS5nZXRJZCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSBtZXNzYWdlIGZyb20gdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBtZXNzYWdlXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHJlbW92ZU1lc3NhZ2UoaWQ6IHN0cmluZykge1xuXHRcdGNvbnN0IG1zZ01hbmFnZXIgPSB0aGlzLl9nZXRNZXNzYWdlTWFuYWdlcigpO1xuXHRcdGNvbnN0IG1lc3NhZ2VzID0gbXNnTWFuYWdlci5nZXRNZXNzYWdlTW9kZWwoKS5nZXREYXRhKCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gbWVzc2FnZXMuZmluZCgoZTogYW55KSA9PiBlLmlkID09PSBpZCk7XG5cdFx0aWYgKHJlc3VsdCkge1xuXHRcdFx0bXNnTWFuYWdlci5yZW1vdmVNZXNzYWdlcyhyZXN1bHQpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRNZXNzYWdlTWFuYWdlcigpIHtcblx0XHRyZXR1cm4gc2FwLnVpLmdldENvcmUoKS5nZXRNZXNzYWdlTWFuYWdlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIHRoZSBzZWxlY3Rpb24gaW4gdGhlIHRhYmxlIGNoYW5nZXMuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBldmVudCgpXG5cdHNlbGVjdGlvbkNoYW5nZSE6IEZ1bmN0aW9uO1xuXG5cdF9nZXRSb3dCaW5kaW5nKCkge1xuXHRcdGNvbnN0IG9UYWJsZSA9ICh0aGlzIGFzIGFueSkuZ2V0Q29udGVudCgpO1xuXHRcdHJldHVybiBvVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHR9XG5cblx0Z2V0Q291bnRzKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0Y29uc3Qgb1RhYmxlID0gKHRoaXMgYXMgYW55KS5nZXRDb250ZW50KCk7XG5cdFx0cmV0dXJuIFRhYmxlVXRpbHMuZ2V0TGlzdEJpbmRpbmdGb3JDb3VudChvVGFibGUsIG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dCgpLCB7XG5cdFx0XHRiYXRjaEdyb3VwSWQ6ICF0aGlzLmdldFByb3BlcnR5KFwiYmluZGluZ1N1c3BlbmRlZFwiKSA/IG9UYWJsZS5kYXRhKFwiYmF0Y2hHcm91cElkXCIpIDogXCIkYXV0b1wiLFxuXHRcdFx0YWRkaXRpb25hbEZpbHRlcnM6IFRhYmxlVXRpbHMuZ2V0SGlkZGVuRmlsdGVycyhvVGFibGUpXG5cdFx0fSlcblx0XHRcdC50aGVuKChpVmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gVGFibGVVdGlscy5nZXRDb3VudEZvcm1hdHRlZChpVmFsdWUpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaCgoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBcIjBcIjtcblx0XHRcdH0pO1xuXHR9XG5cblx0QHhtbEV2ZW50SGFuZGxlcigpXG5cdG9uVGFibGVSb3dQcmVzcyhvRXZlbnQ6IFVJNUV2ZW50LCBvQ29udHJvbGxlcjogUGFnZUNvbnRyb2xsZXIsIG9Db250ZXh0OiBDb250ZXh0LCBtUGFyYW1ldGVyczogYW55KSB7XG5cdFx0Ly8gcHJldmVudCBuYXZpZ2F0aW9uIHRvIGFuIGVtcHR5IHJvd1xuXHRcdGlmIChvQ29udGV4dCAmJiBvQ29udGV4dC5pc0luYWN0aXZlKCkgJiYgb0NvbnRleHQuaXNUcmFuc2llbnQoKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHQvLyBJbiB0aGUgY2FzZSBvZiBhbiBhbmFseXRpY2FsIHRhYmxlLCBpZiB3ZSdyZSB0cnlpbmcgdG8gbmF2aWdhdGUgdG8gYSBjb250ZXh0IGNvcnJlc3BvbmRpbmcgdG8gYSB2aXN1YWwgZ3JvdXAgb3IgZ3JhbmQgdG90YWxcblx0XHQvLyAtLT4gQ2FuY2VsIG5hdmlnYXRpb25cblx0XHRpZiAoXG5cdFx0XHRvQ29udGV4dCAmJlxuXHRcdFx0b0NvbnRleHQuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0LkNvbnRleHRcIikgJiZcblx0XHRcdHR5cGVvZiBvQ29udGV4dC5nZXRQcm9wZXJ0eShcIkAkdWk1Lm5vZGUuaXNFeHBhbmRlZFwiKSA9PT0gXCJib29sZWFuXCJcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0KG9Db250cm9sbGVyIGFzIGFueSkuX3JvdXRpbmcubmF2aWdhdGVGb3J3YXJkVG9Db250ZXh0KG9Db250ZXh0LCBtUGFyYW1ldGVycyk7XG5cdFx0fVxuXHR9XG5cblx0QHhtbEV2ZW50SGFuZGxlcigpXG5cdG9uSW50ZXJuYWxEYXRhUmVjZWl2ZWQob0V2ZW50OiBVSTVFdmVudCkge1xuXHRcdGlmIChvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiZXJyb3JcIikpIHtcblx0XHRcdHRoaXMuZ2V0Q29udHJvbGxlcigpLm1lc3NhZ2VIYW5kbGVyLnNob3dNZXNzYWdlRGlhbG9nKCk7XG5cdFx0fVxuXHR9XG5cblx0QHhtbEV2ZW50SGFuZGxlcigpXG5cdG9uSW50ZXJuYWxEYXRhUmVxdWVzdGVkKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHR0aGlzLnNldFByb3BlcnR5KFwiZGF0YUluaXRpYWxpemVkXCIsIHRydWUpO1xuXHRcdCh0aGlzIGFzIGFueSkuZmlyZUV2ZW50KFwiaW50ZXJuYWxEYXRhUmVxdWVzdGVkXCIsIG9FdmVudC5nZXRQYXJhbWV0ZXJzKCkpO1xuXHR9XG5cblx0QHhtbEV2ZW50SGFuZGxlcigpXG5cdG9uUGFzdGUob0V2ZW50OiBVSTVFdmVudCwgb0NvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyKSB7XG5cdFx0Ly8gSWYgcGFzdGUgaXMgZGlzYWJsZSBvciBpZiB3ZSdyZSBub3QgaW4gZWRpdCBtb2RlLCB3ZSBjYW4ndCBwYXN0ZSBhbnl0aGluZ1xuXHRcdGlmICghdGhpcy50YWJsZURlZmluaXRpb24uY29udHJvbC5lbmFibGVQYXN0ZSB8fCAhdGhpcy5nZXRNb2RlbChcInVpXCIpLmdldFByb3BlcnR5KFwiL2lzRWRpdGFibGVcIikpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBhUmF3UGFzdGVkRGF0YSA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJkYXRhXCIpLFxuXHRcdFx0b1RhYmxlID0gb0V2ZW50LmdldFNvdXJjZSgpIGFzIFRhYmxlO1xuXG5cdFx0aWYgKG9UYWJsZS5nZXRFbmFibGVQYXN0ZSgpID09PSB0cnVlKSB7XG5cdFx0XHRQYXN0ZUhlbHBlci5wYXN0ZURhdGEoYVJhd1Bhc3RlZERhdGEsIG9UYWJsZSwgb0NvbnRyb2xsZXIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBvUmVzb3VyY2VNb2RlbCA9IHNhcC51aS5nZXRDb3JlKCkuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIik7XG5cdFx0XHRNZXNzYWdlQm94LmVycm9yKG9SZXNvdXJjZU1vZGVsLmdldFRleHQoXCJUX09QX0NPTlRST0xMRVJfU0FQRkVfUEFTVEVfRElTQUJMRURfTUVTU0FHRVwiKSwge1xuXHRcdFx0XHR0aXRsZTogb1Jlc291cmNlTW9kZWwuZ2V0VGV4dChcIkNfQ09NTU9OX1NBUEZFX0VSUk9SXCIpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGlzIGV2ZW50IHdpbGwgYWxsb3cgdXMgdG8gaW50ZXJjZXB0IHRoZSBleHBvcnQgYmVmb3JlIGlzIHRyaWdnZXJlZCB0byBjb3ZlciBzcGVjaWZpYyBjYXNlc1xuXHQvLyB0aGF0IGNvdWxkbid0IGJlIGFkZHJlc3NlZCBvbiB0aGUgcHJvcGVydHlJbmZvcyBmb3IgZWFjaCBjb2x1bW4uXG5cdC8vIGUuZy4gRml4ZWQgVGFyZ2V0IFZhbHVlIGZvciB0aGUgZGF0YXBvaW50c1xuXHRAeG1sRXZlbnRIYW5kbGVyKClcblx0b25CZWZvcmVFeHBvcnQob0V2ZW50OiBVSTVFdmVudCkge1xuXHRcdGNvbnN0IGlzU3BsaXRNb2RlID0gKG9FdmVudC5nZXRQYXJhbWV0ZXJzKCkgYXMgYW55KS51c2VyRXhwb3J0U2V0dGluZ3Muc3BsaXRDZWxscyxcblx0XHRcdG9UYWJsZUNvbnRyb2xsZXIgPSBvRXZlbnQuZ2V0U291cmNlKCkgYXMgUGFnZUNvbnRyb2xsZXIsXG5cdFx0XHRvRXhwb3J0Q29sdW1ucyA9IChvRXZlbnQuZ2V0UGFyYW1ldGVycygpIGFzIGFueSkuZXhwb3J0U2V0dGluZ3Mud29ya2Jvb2s/LmNvbHVtbnMsXG5cdFx0XHRvVGFibGVDb2x1bW5zID0gdGhpcy50YWJsZURlZmluaXRpb24uY29sdW1ucztcblxuXHRcdFRhYmxlQVBJLnVwZGF0ZUV4cG9ydFNldHRpbmdzKG9FeHBvcnRDb2x1bW5zLCBvVGFibGVDb2x1bW5zLCBvVGFibGVDb250cm9sbGVyLCBpc1NwbGl0TW9kZSk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyB0aGUgTURDIERhdGFTdGF0ZUluZGljYXRvciBwbHVnaW4gdG8gZGlzcGxheSBtZXNzYWdlU3RyaXAgb24gYSB0YWJsZS5cblx0ICpcblx0ICogQHBhcmFtIG9NZXNzYWdlXG5cdCAqIEBwYXJhbSBvVGFibGVcblx0ICogQG5hbWUgZGF0YVN0YXRlRmlsdGVyXG5cdCAqIEByZXR1cm5zIFdoZXRoZXIgdG8gcmVuZGVyIHZpc2libGUgdGhlIG1lc3NhZ2VTdHJpcFxuXHQgKi9cblx0c3RhdGljIGRhdGFTdGF0ZUluZGljYXRvckZpbHRlcihvTWVzc2FnZTogYW55LCBvVGFibGU6IGFueSk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IHNUYWJsZUNvbnRleHRCaW5kaW5nUGF0aCA9IG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dCgpPy5nZXRQYXRoKCk7XG5cdFx0Y29uc3Qgc1RhYmxlUm93QmluZGluZyA9IChzVGFibGVDb250ZXh0QmluZGluZ1BhdGggPyBgJHtzVGFibGVDb250ZXh0QmluZGluZ1BhdGh9L2AgOiBcIlwiKSArIG9UYWJsZS5nZXRSb3dCaW5kaW5nKCkuZ2V0UGF0aCgpO1xuXHRcdHJldHVybiBzVGFibGVSb3dCaW5kaW5nID09PSBvTWVzc2FnZS5nZXRUYXJnZXQoKSA/IHRydWUgOiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGV2ZW50IGhhbmRsZXMgdGhlIERhdGFTdGF0ZSBvZiB0aGUgRGF0YVN0YXRlSW5kaWNhdG9yIHBsdWdpbiBmcm9tIE1EQyBvbiBhIHRhYmxlLlxuXHQgKiBJdCdzIGZpcmVkIHdoZW4gbmV3IGVycm9yIG1lc3NhZ2VzIGFyZSBzZW50IGZyb20gdGhlIGJhY2tlbmQgdG8gdXBkYXRlIHJvdyBoaWdobGlnaHRpbmcuXG5cdCAqXG5cdCAqIEBuYW1lIG9uRGF0YVN0YXRlQ2hhbmdlXG5cdCAqIEBwYXJhbSBvRXZlbnQgRXZlbnQgb2JqZWN0XG5cdCAqL1xuXHRAeG1sRXZlbnRIYW5kbGVyKClcblx0b25EYXRhU3RhdGVDaGFuZ2Uob0V2ZW50OiBVSTVFdmVudCkge1xuXHRcdGNvbnN0IG9EYXRhU3RhdGVJbmRpY2F0b3IgPSBvRXZlbnQuZ2V0U291cmNlKCkgYXMgRGF0YVN0YXRlSW5kaWNhdG9yO1xuXHRcdGNvbnN0IGFGaWx0ZXJlZE1lc3NhZ2VzID0gb0V2ZW50LmdldFBhcmFtZXRlcihcImZpbHRlcmVkTWVzc2FnZXNcIik7XG5cdFx0aWYgKGFGaWx0ZXJlZE1lc3NhZ2VzKSB7XG5cdFx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbCA9IG9EYXRhU3RhdGVJbmRpY2F0b3IuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKSBhcyBKU09OTW9kZWw7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcImZpbHRlcmVkTWVzc2FnZXNcIiwgYUZpbHRlcmVkTWVzc2FnZXMsIG9EYXRhU3RhdGVJbmRpY2F0b3IuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBDb250ZXh0KTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgdXBkYXRlRXhwb3J0U2V0dGluZ3Mob0V4cG9ydENvbHVtbnM6IGFueSwgb0NvbHVtbnM6IFRhYmxlQ29sdW1uW10sIG9UYWJsZUNvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyLCBpc1NwbGl0TW9kZTogYm9vbGVhbik6IGFueSB7XG5cdFx0bGV0IHJlZkNvbHVtbjogYW55ID0gbnVsbDtcblx0XHRsZXQgYWRkaXRpb25hbFByb3BlcnR5SW5kZXg6IG51bWJlcjtcblx0XHRvRXhwb3J0Q29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChvQ29sdW1uRXhwb3J0OiBhbnkpIHtcblx0XHRcdG9Db2x1bW5FeHBvcnQubGFiZWwgPSBEZWxlZ2F0ZVV0aWwuZ2V0TG9jYWxpemVkVGV4dChvQ29sdW1uRXhwb3J0LmxhYmVsLCBvVGFibGVDb250cm9sbGVyKTtcblx0XHRcdC8vdHJhbnNsYXRlIGJvb2xlYW4gdmFsdWVzXG5cdFx0XHRpZiAob0NvbHVtbkV4cG9ydC50eXBlID09PSBcIkJvb2xlYW5cIikge1xuXHRcdFx0XHRjb25zdCBvUmVzb3VyY2VNb2RlbCA9IHNhcC51aS5nZXRDb3JlKCkuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLm1hY3Jvc1wiKTtcblx0XHRcdFx0b0NvbHVtbkV4cG9ydC5mYWxzZVZhbHVlID0gb1Jlc291cmNlTW9kZWwuZ2V0VGV4dChcIm5vXCIpO1xuXHRcdFx0XHRvQ29sdW1uRXhwb3J0LnRydWVWYWx1ZSA9IG9SZXNvdXJjZU1vZGVsLmdldFRleHQoXCJ5ZXNcIik7XG5cdFx0XHR9XG5cdFx0XHRvQ29sdW1ucz8uZm9yRWFjaCgoY29sdW1uKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9Db2x1bW4gPSBjb2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdFx0XHRpZiAoaXNTcGxpdE1vZGUpIHtcblx0XHRcdFx0XHQvL0FkZCBUYXJnZXRWYWx1ZSBvbiBkdW1teSBjcmVhdGVkIHByb3BlcnR5IHdoZW4gZXhwb3J0aW5nIG9uIHNwbGl0IG1vZGVcblx0XHRcdFx0XHRpZiAob0NvbHVtbi5pc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eSAmJiBvQ29sdW1uLnJlbGF0aXZlUGF0aCA9PT0gb0NvbHVtbkV4cG9ydC5wcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0b0NvbHVtbkV4cG9ydC5wcm9wZXJ0eSA9IFtvQ29sdW1uRXhwb3J0LnByb3BlcnR5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gTW9kaWZ5IGR1cGxpY2F0ZSBsYWJlbHMgZnJvbSBzcGxpdHRlZCBjb2x1bW5zXG5cdFx0XHRcdFx0Y29uc3QgcmVnZXggPSAvKC4qKS1hZGRpdGlvbmFsUHJvcGVydHkoXFxkKykvLmV4ZWMob0NvbHVtbkV4cG9ydC5jb2x1bW5JZCk7XG5cdFx0XHRcdFx0aWYgKHJlZ2V4ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRhZGRpdGlvbmFsUHJvcGVydHlJbmRleCA9IDE7XG5cdFx0XHRcdFx0XHRyZWZDb2x1bW4gPSBvQ29sdW1uRXhwb3J0O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVnZXhbMV0gPT09IHJlZkNvbHVtbj8uY29sdW1uSWQpIHtcblx0XHRcdFx0XHRcdG9Db2x1bW5FeHBvcnQubGFiZWwgPVxuXHRcdFx0XHRcdFx0XHRvQ29sdW1uRXhwb3J0LmxhYmVsID09PSByZWZDb2x1bW4ubGFiZWxcblx0XHRcdFx0XHRcdFx0XHQ/IGAke3JlZkNvbHVtbi5sYWJlbH0gKCR7KythZGRpdGlvbmFsUHJvcGVydHlJbmRleH0pYFxuXHRcdFx0XHRcdFx0XHRcdDogb0NvbHVtbkV4cG9ydC5sYWJlbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBvRXhwb3J0Q29sdW1ucztcblx0fVxuXG5cdHJlc3VtZUJpbmRpbmcoYlJlcXVlc3RJZk5vdEluaXRpYWxpemVkOiBib29sZWFuKSB7XG5cdFx0dGhpcy5zZXRQcm9wZXJ0eShcImJpbmRpbmdTdXNwZW5kZWRcIiwgZmFsc2UpO1xuXHRcdGlmICgoYlJlcXVlc3RJZk5vdEluaXRpYWxpemVkICYmICEodGhpcyBhcyBhbnkpLmdldERhdGFJbml0aWFsaXplZCgpKSB8fCB0aGlzLmdldFByb3BlcnR5KFwib3V0RGF0ZWRCaW5kaW5nXCIpKSB7XG5cdFx0XHR0aGlzLnNldFByb3BlcnR5KFwib3V0RGF0ZWRCaW5kaW5nXCIsIGZhbHNlKTtcblx0XHRcdCh0aGlzIGFzIGFueSkuZ2V0Q29udGVudCgpPy5yZWJpbmQoKTtcblx0XHR9XG5cdH1cblxuXHRyZWZyZXNoTm90QXBwbGljYWJsZUZpZWxkcyhvRmlsdGVyQ29udHJvbDogQ29udHJvbCk6IGFueVtdIHtcblx0XHRjb25zdCBvVGFibGUgPSAodGhpcyBhcyBhbnkpLmdldENvbnRlbnQoKTtcblx0XHRyZXR1cm4gRmlsdGVyVXRpbHMuZ2V0Tm90QXBwbGljYWJsZUZpbHRlcnMob0ZpbHRlckNvbnRyb2wsIG9UYWJsZSk7XG5cdH1cblxuXHRzdXNwZW5kQmluZGluZygpIHtcblx0XHR0aGlzLnNldFByb3BlcnR5KFwiYmluZGluZ1N1c3BlbmRlZFwiLCB0cnVlKTtcblx0fVxuXG5cdGludmFsaWRhdGVDb250ZW50KCkge1xuXHRcdHRoaXMuc2V0UHJvcGVydHkoXCJkYXRhSW5pdGlhbGl6ZWRcIiwgZmFsc2UpO1xuXHRcdHRoaXMuc2V0UHJvcGVydHkoXCJvdXREYXRlZEJpbmRpbmdcIiwgZmFsc2UpO1xuXHR9XG5cblx0QHhtbEV2ZW50SGFuZGxlcigpXG5cdG9uTWFzc0VkaXRCdXR0b25QcmVzc2VkKG9FdmVudDogVUk1RXZlbnQsIHBhZ2VDb250cm9sbGVyOiBhbnkpIHtcblx0XHRjb25zdCBvVGFibGUgPSB0aGlzLmNvbnRlbnQ7XG5cdFx0aWYgKHBhZ2VDb250cm9sbGVyICYmIHBhZ2VDb250cm9sbGVyLm1hc3NFZGl0KSB7XG5cdFx0XHRwYWdlQ29udHJvbGxlci5tYXNzRWRpdC5vcGVuTWFzc0VkaXREaWFsb2cob1RhYmxlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0TG9nLndhcm5pbmcoXCJUaGUgQ29udHJvbGxlciBpcyBub3QgZW5oYW5jZWQgd2l0aCBNYXNzIEVkaXQgZnVuY3Rpb25hbGl0eVwiKTtcblx0XHR9XG5cdH1cblx0QHhtbEV2ZW50SGFuZGxlcigpXG5cdG9uVGFibGVTZWxlY3Rpb25DaGFuZ2Uob0V2ZW50OiBVSTVFdmVudCkge1xuXHRcdHRoaXMuZmlyZUV2ZW50KFwic2VsZWN0aW9uQ2hhbmdlXCIsIG9FdmVudC5nZXRQYXJhbWV0ZXJzKCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGFibGUgZGVmaW5pdGlvbiBmb3IgZXh0ZXJuYWwgdXNhZ2UgaW4gZGVsZWdhdGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSB0YWJsZURlZmluaXRpb25cblx0ICovXG5cdGdldFRhYmxlRGVmaW5pdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YWJsZURlZmluaXRpb247XG5cdH1cblxuXHQvKipcblx0ICogY29ubmVjdCB0aGUgZmlsdGVyIHRvIHRoZSB0YWJsZUFQSSBpZiByZXF1aXJlZFxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZUFQSVxuXHQgKi9cblxuXHR1cGRhdGVGaWx0ZXJCYXIoKSB7XG5cdFx0Y29uc3QgdGFibGUgPSAodGhpcyBhcyBhbnkpLmdldENvbnRlbnQoKTtcblx0XHRjb25zdCBmaWx0ZXJCYXJSZWZJZCA9ICh0aGlzIGFzIGFueSkuZ2V0RmlsdGVyQmFyKCk7XG5cdFx0aWYgKHRhYmxlICYmIGZpbHRlckJhclJlZklkICYmIHRhYmxlLmdldEZpbHRlcigpICE9PSBmaWx0ZXJCYXJSZWZJZCkge1xuXHRcdFx0dGhpcy5fc2V0RmlsdGVyQmFyKGZpbHRlckJhclJlZklkKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmlsdGVyIGRlcGVuZGluZyBvbiB0aGUgdHlwZSBvZiBmaWx0ZXJCYXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBmaWx0ZXJCYXJSZWZJZCBJZCBvZiB0aGUgZmlsdGVyIGJhclxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZUFQSVxuXHQgKi9cblx0X3NldEZpbHRlckJhcihmaWx0ZXJCYXJSZWZJZDogc3RyaW5nKTogdm9pZCB7XG5cdFx0Y29uc3QgdGFibGUgPSAodGhpcyBhcyBhbnkpLmdldENvbnRlbnQoKTtcblx0XHRjb25zdCBjb3JlID0gc2FwLnVpLmdldENvcmUoKTtcblxuXHRcdC8vICdmaWx0ZXJCYXInIHByb3BlcnR5IG9mIG1hY3JvOlRhYmxlKHBhc3NlZCBhcyBjdXN0b21EYXRhKSBtaWdodCBiZVxuXHRcdC8vIDEuIEEgbG9jYWxJZCB3cnQgVmlldyhGUE0gZXhwbG9yZXIgZXhhbXBsZSkuXG5cdFx0Ly8gMi4gQWJzb2x1dGUgSWQodGhpcyB3YXMgbm90IHN1cHBvcnRlZCBpbiBvbGRlciB2ZXJzaW9ucykuXG5cdFx0Ly8gMy4gQSBsb2NhbElkIHdydCBGcmFnbWVudElkKHdoZW4gYW4gWE1MQ29tcG9zaXRlIG9yIEZyYWdtZW50IGlzIGluZGVwZW5kZW50bHkgcHJvY2Vzc2VkKSBpbnN0ZWFkIG9mIFZpZXdJZC5cblx0XHQvLyAgICAnZmlsdGVyQmFyJyB3YXMgc3VwcG9ydGVkIGVhcmxpZXIgYXMgYW4gJ2Fzc29jaWF0aW9uJyB0byB0aGUgJ21kYzpUYWJsZScgY29udHJvbCBpbnNpZGUgJ21hY3JvOlRhYmxlJyBpbiBwcmlvciB2ZXJzaW9ucy5cblx0XHQvLyAgICBJbiBuZXdlciB2ZXJzaW9ucyAnZmlsdGVyQmFyJyBpcyB1c2VkIGxpa2UgYW4gYXNzb2NpYXRpb24gdG8gJ21hY3JvOlRhYmxlQVBJJy5cblx0XHQvLyAgICBUaGlzIG1lYW5zIHRoYXQgdGhlIElkIGlzIHJlbGF0aXZlIHRvICdtYWNybzpUYWJsZUFQSScuXG5cdFx0Ly8gICAgVGhpcyBzY2VuYXJpbyBoYXBwZW5zIGluIGNhc2Ugb2YgRmlsdGVyQmFyIGFuZCBUYWJsZSBpbiBhIGN1c3RvbSBzZWN0aW9ucyBpbiBPUCBvZiBGRVY0LlxuXG5cdFx0Y29uc3QgdGFibGVBUElJZCA9IHRoaXM/LmdldElkKCk7XG5cdFx0Y29uc3QgdGFibGVBUElMb2NhbElkID0gdGhpcy5kYXRhKFwidGFibGVBUElMb2NhbElkXCIpO1xuXHRcdGNvbnN0IHBvdGVudGlhbGZpbHRlckJhcklkID1cblx0XHRcdHRhYmxlQVBJTG9jYWxJZCAmJiBmaWx0ZXJCYXJSZWZJZCAmJiB0YWJsZUFQSUlkICYmIHRhYmxlQVBJSWQucmVwbGFjZShuZXcgUmVnRXhwKHRhYmxlQVBJTG9jYWxJZCArIFwiJFwiKSwgZmlsdGVyQmFyUmVmSWQpOyAvLyAzXG5cblx0XHRjb25zdCBmaWx0ZXJCYXIgPVxuXHRcdFx0Q29tbW9uVXRpbHMuZ2V0VGFyZ2V0Vmlldyh0aGlzKT8uYnlJZChmaWx0ZXJCYXJSZWZJZCkgfHwgY29yZS5ieUlkKGZpbHRlckJhclJlZklkKSB8fCBjb3JlLmJ5SWQocG90ZW50aWFsZmlsdGVyQmFySWQpO1xuXG5cdFx0aWYgKGZpbHRlckJhcikge1xuXHRcdFx0aWYgKGZpbHRlckJhci5pc0EoXCJzYXAuZmUubWFjcm9zLmZpbHRlckJhci5GaWx0ZXJCYXJBUElcIikpIHtcblx0XHRcdFx0dGFibGUuc2V0RmlsdGVyKGAke2ZpbHRlckJhci5nZXRJZCgpfS1jb250ZW50YCk7XG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJhci5pc0EoXCJzYXAudWkubWRjLkZpbHRlckJhclwiKSkge1xuXHRcdFx0XHR0YWJsZS5zZXRGaWx0ZXIoZmlsdGVyQmFyLmdldElkKCkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLmRhdGEoXCJhdXRvQmluZE9uSW5pdFwiKSkge1xuXHRcdFx0Ly8gcmViaW5kIHRoZSB0YWJsZSBhcyB0aGUgdGFibGUgaXMgcmVhZHkgd2l0aCB0aGUgZmlsdGVyIGJhci5cblx0XHRcdHRoaXMucmVzdW1lQmluZGluZyh0cnVlKTtcblx0XHR9XG5cdH1cblxuXHRjaGVja0lmQ29sdW1uRXhpc3RzKGFGaWx0ZXJlZENvbHVtbW5zOiBhbnksIGNvbHVtbk5hbWU6IGFueSkge1xuXHRcdHJldHVybiBhRmlsdGVyZWRDb2x1bW1ucy5zb21lKGZ1bmN0aW9uIChvQ29sdW1uOiBhbnkpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0KG9Db2x1bW4/LmNvbHVtbk5hbWUgPT09IGNvbHVtbk5hbWUgJiYgb0NvbHVtbj8uc0NvbHVtbk5hbWVWaXNpYmxlKSB8fFxuXHRcdFx0XHQob0NvbHVtbj8uc1RleHRBcnJhbmdlbWVudCAhPT0gdW5kZWZpbmVkICYmIG9Db2x1bW4/LnNUZXh0QXJyYW5nZW1lbnQgPT09IGNvbHVtbk5hbWUpXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIGNvbHVtbk5hbWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Z2V0SWRlbnRpZmllckNvbHVtbigpOiBhbnkge1xuXHRcdGNvbnN0IG9UYWJsZSA9ICh0aGlzIGFzIGFueSkuZ2V0Q29udGVudCgpO1xuXHRcdGNvbnN0IGhlYWRlckluZm9UaXRsZVBhdGggPSB0aGlzLmdldFRhYmxlRGVmaW5pdGlvbigpLmhlYWRlckluZm9UaXRsZTtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb1RhYmxlICYmIG9UYWJsZS5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0c0N1cnJlbnRFbnRpdHlTZXROYW1lID0gb1RhYmxlLmRhdGEoXCJtZXRhUGF0aFwiKTtcblx0XHRjb25zdCBhVGVjaG5pY2FsS2V5cyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NDdXJyZW50RW50aXR5U2V0TmFtZX0vJFR5cGUvJEtleWApO1xuXHRcdGNvbnN0IGFGaWx0ZXJlZFRlY2huaWNhbEtleXM6IHN0cmluZ1tdID0gW107XG5cblx0XHRpZiAoYVRlY2huaWNhbEtleXMgJiYgYVRlY2huaWNhbEtleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0YVRlY2huaWNhbEtleXMuZm9yRWFjaChmdW5jdGlvbiAodGVjaG5pY2FsS2V5OiBzdHJpbmcpIHtcblx0XHRcdFx0aWYgKHRlY2huaWNhbEtleSAhPT0gXCJJc0FjdGl2ZUVudGl0eVwiKSB7XG5cdFx0XHRcdFx0YUZpbHRlcmVkVGVjaG5pY2FsS2V5cy5wdXNoKHRlY2huaWNhbEtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjb25zdCBzZW1hbnRpY0tleUNvbHVtbnMgPSB0aGlzLmdldFRhYmxlRGVmaW5pdGlvbigpLnNlbWFudGljS2V5cztcblxuXHRcdGNvbnN0IGFWaXNpYmxlQ29sdW1uczogYW55ID0gW107XG5cdFx0Y29uc3QgYUZpbHRlcmVkQ29sdW1tbnM6IGFueSA9IFtdO1xuXHRcdGNvbnN0IGFUYWJsZUNvbHVtbnMgPSBvVGFibGUuZ2V0Q29sdW1ucygpO1xuXHRcdGFUYWJsZUNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAob0NvbHVtbjogYW55KSB7XG5cdFx0XHRjb25zdCBjb2x1bW4gPSBvQ29sdW1uPy5nZXREYXRhUHJvcGVydHkoKTtcblx0XHRcdGFWaXNpYmxlQ29sdW1ucy5wdXNoKGNvbHVtbik7XG5cdFx0fSk7XG5cblx0XHRhVmlzaWJsZUNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAob0NvbHVtbjogYW55KSB7XG5cdFx0XHRjb25zdCBvVGV4dEFycmFuZ2VtZW50ID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0N1cnJlbnRFbnRpdHlTZXROYW1lfS8kVHlwZS8ke29Db2x1bW59QGApO1xuXHRcdFx0Y29uc3Qgc1RleHRBcnJhbmdlbWVudCA9IG9UZXh0QXJyYW5nZW1lbnQgJiYgb1RleHRBcnJhbmdlbWVudFtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiXT8uJFBhdGg7XG5cdFx0XHRjb25zdCBzVGV4dFBsYWNlbWVudCA9XG5cdFx0XHRcdG9UZXh0QXJyYW5nZW1lbnQgJiZcblx0XHRcdFx0b1RleHRBcnJhbmdlbWVudFtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dEBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRcIl0/LiRFbnVtTWVtYmVyO1xuXHRcdFx0YUZpbHRlcmVkQ29sdW1tbnMucHVzaCh7XG5cdFx0XHRcdGNvbHVtbk5hbWU6IG9Db2x1bW4sXG5cdFx0XHRcdHNUZXh0QXJyYW5nZW1lbnQ6IHNUZXh0QXJyYW5nZW1lbnQsXG5cdFx0XHRcdHNDb2x1bW5OYW1lVmlzaWJsZTogIShzVGV4dFBsYWNlbWVudCA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRPbmx5XCIpXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRsZXQgY29sdW1uOiBhbnk7XG5cblx0XHRpZiAoaGVhZGVySW5mb1RpdGxlUGF0aCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuY2hlY2tJZkNvbHVtbkV4aXN0cyhhRmlsdGVyZWRDb2x1bW1ucywgaGVhZGVySW5mb1RpdGxlUGF0aCkpIHtcblx0XHRcdGNvbHVtbiA9IGhlYWRlckluZm9UaXRsZVBhdGg7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdHNlbWFudGljS2V5Q29sdW1ucyAhPT0gdW5kZWZpbmVkICYmXG5cdFx0XHRzZW1hbnRpY0tleUNvbHVtbnMubGVuZ3RoID09PSAxICYmXG5cdFx0XHR0aGlzLmNoZWNrSWZDb2x1bW5FeGlzdHMoYUZpbHRlcmVkQ29sdW1tbnMsIHNlbWFudGljS2V5Q29sdW1uc1swXSlcblx0XHQpIHtcblx0XHRcdGNvbHVtbiA9IHNlbWFudGljS2V5Q29sdW1uc1swXTtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0YUZpbHRlcmVkVGVjaG5pY2FsS2V5cyAhPT0gdW5kZWZpbmVkICYmXG5cdFx0XHRhRmlsdGVyZWRUZWNobmljYWxLZXlzLmxlbmd0aCA9PT0gMSAmJlxuXHRcdFx0dGhpcy5jaGVja0lmQ29sdW1uRXhpc3RzKGFGaWx0ZXJlZENvbHVtbW5zLCBhRmlsdGVyZWRUZWNobmljYWxLZXlzWzBdKVxuXHRcdCkge1xuXHRcdFx0Y29sdW1uID0gYUZpbHRlcmVkVGVjaG5pY2FsS2V5c1swXTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbHVtbjtcblx0fVxuXG5cdGFzeW5jIHNldFVwRW1wdHlSb3dzKG9UYWJsZTogVGFibGUpIHtcblx0XHRpZiAodGhpcy50YWJsZURlZmluaXRpb24uY29udHJvbD8uY3JlYXRpb25Nb2RlICE9PSBDcmVhdGlvbk1vZGUuSW5saW5lQ3JlYXRpb25Sb3dzKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IHBXYWl0VGFibGVSZW5kZXJlZCA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG5cdFx0XHRpZiAob1RhYmxlLmdldERvbVJlZigpKSB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGRlbGVnYXRlID0ge1xuXHRcdFx0XHRcdG9uQWZ0ZXJSZW5kZXJpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdG9UYWJsZS5yZW1vdmVFdmVudERlbGVnYXRlKGRlbGVnYXRlKTtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdG9UYWJsZS5hZGRFdmVudERlbGVnYXRlKGRlbGVnYXRlLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRhd2FpdCBwV2FpdFRhYmxlUmVuZGVyZWQ7XG5cdFx0Y29uc3QgYklzSW5FZGl0TW9kZSA9IG9UYWJsZS5nZXRNb2RlbChcInVpXCIpLmdldFByb3BlcnR5KFwiL2lzRWRpdGFibGVcIik7XG5cdFx0aWYgKCFiSXNJbkVkaXRNb2RlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IG9CaW5kaW5nID0gb1RhYmxlLmdldFJvd0JpbmRpbmcoKSBhcyBPRGF0YUxpc3RCaW5kaW5nO1xuXHRcdGlmIChvQmluZGluZy5pc1Jlc29sdmVkKCkgJiYgb0JpbmRpbmcuaXNMZW5ndGhGaW5hbCgpKSB7XG5cdFx0XHRjb25zdCBzQ29udGV4dFBhdGggPSBvQmluZGluZy5nZXRDb250ZXh0KCkuZ2V0UGF0aCgpO1xuXHRcdFx0Y29uc3Qgb0luYWN0aXZlQ29udGV4dCA9IG9CaW5kaW5nLmdldEFsbEN1cnJlbnRDb250ZXh0cygpLmZpbmQoZnVuY3Rpb24gKG9Db250ZXh0KSB7XG5cdFx0XHRcdHJldHVybiBvQ29udGV4dC5pc0luYWN0aXZlKCkgJiYgb0NvbnRleHQuZ2V0UGF0aCgpLnN0YXJ0c1dpdGgoc0NvbnRleHRQYXRoKTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFvSW5hY3RpdmVDb250ZXh0KSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuX2NyZWF0ZUVtcHR5Um93KG9CaW5kaW5nLCBvVGFibGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRhc3luYyBfY3JlYXRlRW1wdHlSb3cob0JpbmRpbmc6IE9EYXRhTGlzdEJpbmRpbmcsIG9UYWJsZTogVGFibGUpIHtcblx0XHRjb25zdCBpSW5saW5lQ3JlYXRpb25Sb3dDb3VudCA9IHRoaXMudGFibGVEZWZpbml0aW9uLmNvbnRyb2w/LmlubGluZUNyZWF0aW9uUm93Q291bnQgfHwgMjtcblx0XHRjb25zdCBhRGF0YSA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaUlubGluZUNyZWF0aW9uUm93Q291bnQ7IGkgKz0gMSkge1xuXHRcdFx0YURhdGEucHVzaCh7fSk7XG5cdFx0fVxuXHRcdGNvbnN0IGJBdEVuZCA9IG9UYWJsZS5kYXRhKFwidGFibGVUeXBlXCIpICE9PSBcIlJlc3BvbnNpdmVUYWJsZVwiO1xuXHRcdGNvbnN0IGJJbmFjdGl2ZSA9IHRydWU7XG5cdFx0Y29uc3Qgb1ZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KG9UYWJsZSk7XG5cdFx0Y29uc3Qgb0NvbnRyb2xsZXIgPSBvVmlldy5nZXRDb250cm9sbGVyKCk7XG5cdFx0Y29uc3Qgb0ludGVybmFsRWRpdEZsb3cgPSBvQ29udHJvbGxlci5fZWRpdEZsb3c7XG5cdFx0aWYgKCF0aGlzLmNyZWF0aW5nRW1wdHlSb3dzKSB7XG5cdFx0XHR0aGlzLmNyZWF0aW5nRW1wdHlSb3dzID0gdHJ1ZTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGFDb250ZXh0cyA9IGF3YWl0IG9JbnRlcm5hbEVkaXRGbG93LmNyZWF0ZU11bHRpcGxlRG9jdW1lbnRzKFxuXHRcdFx0XHRcdG9CaW5kaW5nLFxuXHRcdFx0XHRcdGFEYXRhLFxuXHRcdFx0XHRcdGJBdEVuZCxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRvQ29udHJvbGxlci5lZGl0Rmxvdy5vbkJlZm9yZUNyZWF0ZSxcblx0XHRcdFx0XHRiSW5hY3RpdmVcblx0XHRcdFx0KTtcblx0XHRcdFx0YUNvbnRleHRzPy5mb3JFYWNoKGZ1bmN0aW9uIChvQ29udGV4dDogYW55KSB7XG5cdFx0XHRcdFx0b0NvbnRleHQuY3JlYXRlZCgpLmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdFx0aWYgKCFvRXJyb3IuY2FuY2VsZWQpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgb0Vycm9yO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0TG9nLmVycm9yKGUgYXMgYW55KTtcblx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdHRoaXMuY3JlYXRpbmdFbXB0eVJvd3MgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFibGVBUEk7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFNRyxDQUFOLEVBQVM7TUFDVixPQUFPRixPQUFPLENBQUNFLENBQUQsQ0FBZDtJQUNBOztJQUNELElBQUlELE1BQU0sSUFBSUEsTUFBTSxDQUFDRSxJQUFyQixFQUEyQjtNQUMxQixPQUFPRixNQUFNLENBQUNFLElBQVAsQ0FBWSxLQUFLLENBQWpCLEVBQW9CSCxPQUFwQixDQUFQO0lBQ0E7O0lBQ0QsT0FBT0MsTUFBUDtFQUNBOztFQUdNLDBCQUEwQkYsSUFBMUIsRUFBZ0NLLFNBQWhDLEVBQTJDO0lBQ2pELElBQUk7TUFDSCxJQUFJSCxNQUFNLEdBQUdGLElBQUksRUFBakI7SUFDQSxDQUZELENBRUUsT0FBT0csQ0FBUCxFQUFVO01BQ1gsT0FBT0UsU0FBUyxDQUFDLElBQUQsRUFBT0YsQ0FBUCxDQUFoQjtJQUNBOztJQUNELElBQUlELE1BQU0sSUFBSUEs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