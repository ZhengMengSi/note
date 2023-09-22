/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/deepClone", "sap/base/util/deepEqual", "sap/base/util/deepExtend", "sap/fe/core/ActionRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/helpers/ExcelFormatHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/macros/CommonHelper", "sap/fe/macros/DelegateUtil", "sap/fe/macros/filterBar/FilterBarDelegate", "sap/fe/macros/ResourceModel", "sap/fe/macros/table/TableHelper", "sap/fe/macros/table/TableSizeHelper", "sap/fe/macros/table/Utils", "sap/ui/core/Fragment", "sap/ui/mdc/odata/v4/TableDelegate", "sap/fe/core/type/TypeUtil", "sap/ui/model/Filter", "sap/ui/model/json/JSONModel"], function (Log, deepClone, deepEqual, deepExtend, ActionRuntime, CommonUtils, ValueFormatter, ExcelFormat, ModelHelper, CommonHelper, DelegateUtil, FilterBarDelegate, ResourceModel, TableHelper, TableSizeHelper, TableUtils, Fragment, TableDelegateBase, TypeUtil, Filter, JSONModel) {
  "use strict";

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

  var FETCHED_PROPERTIES_DATA_KEY = "sap_fe_TableDelegate_propertyInfoMap";
  var SEMANTICKEY_HAS_DRAFTINDICATOR = "/semanticKeyHasDraftIndicator";
  var FilterRestrictions = CommonUtils.FilterRestrictions;

  function _setCachedProperties(oTable, aFetchedProperties, bUseAdditionalProperties) {
    // do not cache during templating, else it becomes part of the cached view
    if (oTable instanceof window.Element) {
      return;
    }

    var key = bUseAdditionalProperties ? "".concat(FETCHED_PROPERTIES_DATA_KEY, "_add") : FETCHED_PROPERTIES_DATA_KEY;
    DelegateUtil.setCustomData(oTable, key, aFetchedProperties);
  }

  function _getCachedProperties(oTable, bUseAdditionalProperties) {
    // properties are not cached during templating
    if (oTable instanceof window.Element) {
      return null;
    }

    var key = bUseAdditionalProperties ? "".concat(FETCHED_PROPERTIES_DATA_KEY, "_add") : FETCHED_PROPERTIES_DATA_KEY;
    return DelegateUtil.getCustomData(oTable, key);
  }
  /**
   * Helper class for sap.ui.mdc.Table.
   * <h3><b>Note:</b></h3>
   * The class is experimental and the API and the behavior are not finalized. This class is not intended for productive usage.
   *
   * @author SAP SE
   * @private
   * @experimental
   * @since 1.69
   * @alias sap.fe.macros.TableDelegate
   */


  return Object.assign({}, TableDelegateBase, {
    /**
     * This function calculates the width for a FieldGroup column.
     * The width of the FieldGroup is the width of the widest property contained in the FieldGroup (including the label if showDataFieldsLabel is true)
     * The result of this calculation is stored in the visualSettings.widthCalculation.minWidth property, which is used by the MDCtable.
     *
     * @param oTable Instance of the MDCtable
     * @param oProperty Current property
     * @param aProperties Array of properties
     * @private
     * @alias sap.fe.macros.TableDelegate
     */
    _computeVisualSettingsForFieldGroup: function (oTable, oProperty, aProperties) {
      if (oProperty.name.indexOf("DataFieldForAnnotation::FieldGroup::") === 0) {
        var oColumn = oTable.getColumns().find(function (oCol) {
          return oCol.getDataProperty() === oProperty.name;
        });
        var bShowDataFieldsLabel = oColumn ? oColumn.data("showDataFieldsLabel") === "true" : false;
        var oMetaModel = oTable.getModel().getMetaModel();
        var oContext = oMetaModel.createBindingContext(oProperty.metadataPath.replace(/@.*/, ""));
        var oDataField = oMetaModel.getObject(oProperty.metadataPath);
        var oFieldGroup = oDataField.Target ? oContext.getObject(oDataField.Target.$AnnotationPath) : null;
        var aFieldWidth = [];
        oFieldGroup.Data.forEach(function (oData) {
          var oDataFieldWidth;

          switch (oData.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
              oDataFieldWidth = TableSizeHelper.getWidthForDataFieldForAnnotation(oData, bShowDataFieldsLabel, aProperties, oContext);
              break;

            case "com.sap.vocabularies.UI.v1.DataField":
              if (bShowDataFieldsLabel) {
                oDataFieldWidth = TableSizeHelper.getWidthForDataField(oData, bShowDataFieldsLabel, aProperties, oContext);
              }

              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              oDataFieldWidth = {
                labelWidth: 0,
                propertyWidth: TableSizeHelper.getButtonWidth(oData.Label)
              };
              break;

            default:
          }

          if (oDataFieldWidth) {
            aFieldWidth.push(oDataFieldWidth.labelWidth + oDataFieldWidth.propertyWidth);
          }
        });
        var nWidest = aFieldWidth.reduce(function (acc, value) {
          return Math.max(acc, value);
        }, 0);
        oProperty.visualSettings = deepExtend(oProperty.visualSettings, {
          widthCalculation: {
            verticalArrangement: true,
            minWidth: Math.ceil(nWidest)
          }
        });
      }
    },
    _computeVisualSettingsForPropertyWithValueHelp: function (oTable, oProperty) {
      var oTableAPI = oTable ? oTable.getParent() : null;

      if (!oProperty.propertyInfos) {
        var oMetaModel = oTable.getModel().getMetaModel();

        if (oProperty.metadataPath === undefined) {
          throw new Error("a `metadataPath` property is expected when computing VisualSettings for property with ValueHelp");
        }

        var oDataField = oMetaModel.getObject("".concat(oProperty.metadataPath, "@"));

        if (oDataField && oDataField["@com.sap.vocabularies.Common.v1.ValueList"]) {
          oProperty.visualSettings = deepExtend(oProperty.visualSettings, {
            widthCalculation: {
              gap: oTableAPI && oTableAPI.getReadOnly() ? 0 : 4
            }
          });
        }
      }
    },
    _computeVisualSettingsForPropertyWithUnit: function (oTable, oProperty, oUnit, oUnitText, oTimezoneText) {
      var oTableAPI = oTable ? oTable.getParent() : null; // update gap for properties with string unit

      var sUnitText = oUnitText || oTimezoneText;

      if (sUnitText) {
        oProperty.visualSettings = deepExtend(oProperty.visualSettings, {
          widthCalculation: {
            gap: Math.ceil(TableSizeHelper.getButtonWidth(sUnitText))
          }
        });
      }

      if (oUnit) {
        oProperty.visualSettings = deepExtend(oProperty.visualSettings, {
          widthCalculation: {
            // For properties with unit, a gap needs to be added to properly render the column width on edit mode
            gap: oTableAPI && oTableAPI.getReadOnly() ? 0 : 6
          }
        });
      }
    },
    _computeLabel: function (oProperty, labelMap) {
      var _oProperty$path;

      var propertiesWithSameLabel = labelMap[oProperty.label];

      if ((propertiesWithSameLabel === null || propertiesWithSameLabel === void 0 ? void 0 : propertiesWithSameLabel.length) > 1 && (_oProperty$path = oProperty.path) !== null && _oProperty$path !== void 0 && _oProperty$path.includes("/")) {
        var _oProperty$additional;

        oProperty.label = oProperty.label + " (" + ((_oProperty$additional = oProperty.additionalLabels) === null || _oProperty$additional === void 0 ? void 0 : _oProperty$additional.join(" / ")) + ")";
      }

      delete oProperty.additionalLabels;
    },
    //Update VisualSetting for columnWidth calculation and labels on navigation properties
    _updatePropertyInfo: function (oTable, aProperties) {
      var _this = this;

      var labelMap = {};
      aProperties.forEach(function (oProperty) {
        if (!oProperty.propertyInfos) {
          // Only for non-complex properties
          labelMap[oProperty.label] = labelMap[oProperty.label] !== undefined ? labelMap[oProperty.label].concat([oProperty]) : [oProperty];
        }
      });
      aProperties.forEach(function (oProperty) {
        _this._computeVisualSettingsForFieldGroup(oTable, oProperty, aProperties);

        _this._computeVisualSettingsForPropertyWithValueHelp(oTable, oProperty); // bcp: 2270003577
        // Some columns (eg: custom columns) have no typeConfig property.
        // initializing it prevents an exception throw


        oProperty.typeConfig = deepExtend(oProperty.typeConfig, {});

        _this._computeLabel(oProperty, labelMap);
      });
      return aProperties;
    },
    getColumnsFor: function (oTable) {
      return oTable.getParent().getTableDefinition().columns;
    },
    _getAggregatedPropertyMap: function (oTable) {
      return oTable.getParent().getTableDefinition().aggregates;
    },

    /**
     * Returns the export capabilities for the given sap.ui.mdc.Table instance.
     *
     * @param oTable Instance of the table
     * @returns Promise representing the export capabilities of the table instance
     */
    fetchExportCapabilities: function (oTable) {
      var oCapabilities = {
        "XLSX": {}
      };
      var oModel;
      return DelegateUtil.fetchModel(oTable).then(function (model) {
        oModel = model;
        return oModel.getMetaModel().getObject("/$EntityContainer@Org.OData.Capabilities.V1.SupportedFormats");
      }).then(function (aSupportedFormats) {
        var aLowerFormats = (aSupportedFormats || []).map(function (element) {
          return element.toLowerCase();
        });

        if (aLowerFormats.indexOf("application/pdf") > -1) {
          return oModel.getMetaModel().getObject("/$EntityContainer@com.sap.vocabularies.PDF.v1.Features");
        }

        return undefined;
      }).then(function (oAnnotation) {
        if (oAnnotation) {
          oCapabilities["PDF"] = Object.assign({}, oAnnotation);
        }
      }).catch(function (err) {
        Log.error("An error occurs while computing export capabilities: ".concat(err));
      }).then(function () {
        return oCapabilities;
      });
    },
    _isFilterableNavigationProperty: function (oColumnInfo, oMetaModel) {
      // Temporary logic to only allow filtering on navigation properties when they're part of a line item and only 1:1 properties
      var property = oMetaModel.getObject(oColumnInfo.annotationPath.slice(0, oColumnInfo.annotationPath.lastIndexOf("/")));
      return !oColumnInfo.relativePath.includes("/") || oColumnInfo.isPartOfLineItem === true && property && !property.$isCollection;
    },
    _fetchPropertyInfo: function (oMetaModel, oColumnInfo, oTable, oAppComponent, bUseAdditionalProperties) {
      var sAbsoluteNavigationPath = oColumnInfo.annotationPath,
          oDataField = oMetaModel.getObject(sAbsoluteNavigationPath),
          oNavigationContext = oMetaModel.createBindingContext(sAbsoluteNavigationPath),
          oTypeConfig = oColumnInfo.typeConfig && oColumnInfo.typeConfig.className && DelegateUtil.isTypeFilterable(oColumnInfo.typeConfig.className) ? TypeUtil.getTypeConfig(oColumnInfo.typeConfig.className, oColumnInfo.typeConfig.oFormatOptions, oColumnInfo.typeConfig.oConstraints) : {},
          bFilterable = CommonHelper.isPropertyFilterable(oColumnInfo.relativePath, {
        context: oNavigationContext
      }, oDataField),
          bComplexType = oColumnInfo.typeConfig && oColumnInfo.typeConfig.className.indexOf("Edm.") !== 0,
          bIsAnalyticalTable = DelegateUtil.getCustomData(oTable, "enableAnalytics") === "true",
          aAggregatedPropertyMapUnfilterable = bIsAnalyticalTable ? this._getAggregatedPropertyMap(oTable) : {},
          oExportSettings = oColumnInfo.exportSettings,
          exportFormat = oColumnInfo.typeConfig && oColumnInfo.typeConfig.className ? this._getExportFormat(oColumnInfo.typeConfig.className) : undefined;
      var sLabel = oColumnInfo.isDataPointFakeTargetProperty ? ResourceModel.getText("TargetValue") : DelegateUtil.getLocalizedText(oColumnInfo.label, oAppComponent || oTable);

      if (oExportSettings) {
        if (exportFormat && !oExportSettings.timezoneProperty) {
          oExportSettings.format = exportFormat;
        } // Set the exportSettings template only if it exists.


        if (oExportSettings.template) {
          oExportSettings.template = oColumnInfo.exportSettings.template;
        }
      }

      var oPropertyInfo = {
        name: oColumnInfo.name,
        metadataPath: sAbsoluteNavigationPath,
        groupLabel: oColumnInfo.groupLabel,
        group: oColumnInfo.group,
        label: sLabel,
        tooltip: oColumnInfo.tooltip,
        typeConfig: oTypeConfig,
        visible: oColumnInfo.availability !== "Hidden" && !bComplexType,
        exportSettings: oExportSettings,
        unit: oColumnInfo.unit
      }; // Set visualSettings only if it exists

      if (oColumnInfo.visualSettings && Object.keys(oColumnInfo.visualSettings).length > 0) {
        oPropertyInfo.visualSettings = oColumnInfo.visualSettings;
      }

      if (exportFormat) {
        var oTableAPI = oTable ? oTable.getParent() : null; // For properties with date/time/dateTime data types, a gap needs to be added to properly render the column width on edit mode

        oPropertyInfo.visualSettings = {
          widthCalculation: {
            // a gap of 1 is still needed because of the padding of the cell
            // BCP: 2180413431
            gap: oTableAPI && oTableAPI.getReadOnly() ? 1 : 1.5
          }
        };
      } // MDC expects  'propertyInfos' only for complex properties.
      // An empty array throws validation error and undefined value is unhandled.


      if (oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length) {
        oPropertyInfo.propertyInfos = oColumnInfo.propertyInfos; //only in case of complex properties, wrap the cell content	on the excel exported file

        oPropertyInfo.exportSettings.wrap = oColumnInfo.exportSettings.wrap;

        if (bUseAdditionalProperties && oColumnInfo.additionalPropertyInfos && oColumnInfo.additionalPropertyInfos.length) {
          oPropertyInfo.propertyInfos = oPropertyInfo.propertyInfos.concat(oColumnInfo.additionalPropertyInfos);
        }
      } else {
        // Add properties which are supported only by simple PropertyInfos.
        oPropertyInfo.path = oColumnInfo.relativePath; // TODO with the new complex property info, a lot of "Description" fields are added as filter/sort fields

        oPropertyInfo.sortable = oColumnInfo.sortable;
        oPropertyInfo.filterable = !oColumnInfo.isDataPointFakeTargetProperty && bFilterable && this._isFilterableNavigationProperty(oColumnInfo, oMetaModel) && ( // TODO ignoring all properties that are not also available for adaptation for now, but proper concept required
        !bIsAnalyticalTable || !aAggregatedPropertyMapUnfilterable[oPropertyInfo.name]);
        oPropertyInfo.key = oColumnInfo.isKey;
        oPropertyInfo.groupable = oColumnInfo.isGroupable;

        if (oColumnInfo.textArrangement) {
          var oDescriptionColumn = this.getColumnsFor(oTable).find(function (oCol) {
            return oCol.name === oColumnInfo.textArrangement.textProperty;
          });

          if (oDescriptionColumn) {
            oPropertyInfo.mode = oColumnInfo.textArrangement.mode;
            oPropertyInfo.valueProperty = oColumnInfo.relativePath;
            oPropertyInfo.descriptionProperty = oDescriptionColumn.relativePath;
          }
        }

        oPropertyInfo.text = oColumnInfo.textArrangement && oColumnInfo.textArrangement.textProperty;
        oPropertyInfo.caseSensitive = oColumnInfo.caseSensitive;

        if (oColumnInfo.additionalLabels) {
          oPropertyInfo.additionalLabels = oColumnInfo.additionalLabels.map(function (label) {
            return DelegateUtil.getLocalizedText(label, oAppComponent || oTable);
          });
        }
      }

      this._computeVisualSettingsForPropertyWithUnit(oTable, oPropertyInfo, oColumnInfo.unit, oColumnInfo.unitText, oColumnInfo.timezoneText);

      return oPropertyInfo;
    },
    _fetchCustomPropertyInfo: function (oColumnInfo, oTable, oAppComponent) {
      var sLabel = DelegateUtil.getLocalizedText(oColumnInfo.header, oAppComponent || oTable); // Todo: To be removed once MDC provides translation support

      var oPropertyInfo = {
        name: oColumnInfo.name,
        groupLabel: null,
        group: null,
        label: sLabel,
        type: "Edm.String",
        // TBD
        visible: oColumnInfo.availability !== "Hidden",
        exportSettings: oColumnInfo.exportSettings,
        visualSettings: oColumnInfo.visualSettings
      }; // MDC expects 'propertyInfos' only for complex properties.
      // An empty array throws validation error and undefined value is unhandled.

      if (oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length) {
        oPropertyInfo.propertyInfos = oColumnInfo.propertyInfos; //only in case of complex properties, wrap the cell content on the excel exported file

        oPropertyInfo.exportSettings = {
          wrap: oColumnInfo.exportSettings.wrap,
          template: oColumnInfo.exportSettings.template
        };
      } else {
        // Add properties which are supported only by simple PropertyInfos.
        oPropertyInfo.path = oColumnInfo.name;
        oPropertyInfo.sortable = false;
        oPropertyInfo.filterable = false;
      }

      return oPropertyInfo;
    },
    _bColumnHasPropertyWithDraftIndicator: function (oColumnInfo) {
      return !!(oColumnInfo.formatOptions && oColumnInfo.formatOptions.hasDraftIndicator || oColumnInfo.formatOptions && oColumnInfo.formatOptions.fieldGroupDraftIndicatorPropertyPath);
    },
    _updateDraftIndicatorModel: function (_oTable, _oColumnInfo) {
      var aVisibleColumns = _oTable.getColumns();

      var oInternalBindingContext = _oTable.getBindingContext("internal");

      var sInternalPath = oInternalBindingContext && oInternalBindingContext.getPath();

      if (aVisibleColumns && oInternalBindingContext) {
        for (var index in aVisibleColumns) {
          if (this._bColumnHasPropertyWithDraftIndicator(_oColumnInfo) && _oColumnInfo.name === aVisibleColumns[index].getDataProperty()) {
            if (oInternalBindingContext.getProperty(sInternalPath + SEMANTICKEY_HAS_DRAFTINDICATOR) === undefined) {
              oInternalBindingContext.setProperty(sInternalPath + SEMANTICKEY_HAS_DRAFTINDICATOR, _oColumnInfo.name);
              break;
            }
          }
        }
      }
    },
    _fetchPropertiesForEntity: function (oTable, sEntityTypePath, oMetaModel, oAppComponent, bUseAdditionalProperties) {
      var _this2 = this;

      // when fetching properties, this binding context is needed - so lets create it only once and use if for all properties/data-fields/line-items
      var sBindingPath = ModelHelper.getEntitySetPath(sEntityTypePath);
      var aFetchedProperties = [];
      var oFR = CommonUtils.getFilterRestrictionsByPath(sBindingPath, oMetaModel);
      var aNonFilterableProps = oFR[FilterRestrictions.NON_FILTERABLE_PROPERTIES];
      return Promise.resolve(this.getColumnsFor(oTable)).then(function (aColumns) {
        // DraftAdministrativeData does not work via 'entitySet/$NavigationPropertyBinding/DraftAdministrativeData'
        if (aColumns) {
          var oPropertyInfo;
          aColumns.forEach(function (oColumnInfo) {
            _this2._updateDraftIndicatorModel(oTable, oColumnInfo);

            switch (oColumnInfo.type) {
              case "Annotation":
                oPropertyInfo = _this2._fetchPropertyInfo(oMetaModel, oColumnInfo, oTable, oAppComponent, bUseAdditionalProperties);

                if (oPropertyInfo && aNonFilterableProps.indexOf(oPropertyInfo.name) === -1) {
                  oPropertyInfo.maxConditions = DelegateUtil.isMultiValue(oPropertyInfo) ? -1 : 1;
                }

                break;

              case "Slot":
              case "Default":
                oPropertyInfo = _this2._fetchCustomPropertyInfo(oColumnInfo, oTable, oAppComponent);
                break;

              default:
                throw new Error("unhandled switch case ".concat(oColumnInfo.type));
            }

            aFetchedProperties.push(oPropertyInfo);
          });
        }
      }).then(function () {
        aFetchedProperties = _this2._updatePropertyInfo(oTable, aFetchedProperties);
      }).catch(function (err) {
        Log.error("An error occurs while updating fetched properties: ".concat(err));
      }).then(function () {
        return aFetchedProperties;
      });
    },
    _getCachedOrFetchPropertiesForEntity: function (oTable, sEntityTypePath, oMetaModel, oAppComponent, bUseAdditionalProperties) {
      var aFetchedProperties = _getCachedProperties(oTable, bUseAdditionalProperties);

      if (aFetchedProperties) {
        return Promise.resolve(aFetchedProperties);
      }

      return this._fetchPropertiesForEntity(oTable, sEntityTypePath, oMetaModel, oAppComponent, bUseAdditionalProperties).then(function (aSubFetchedProperties) {
        _setCachedProperties(oTable, aSubFetchedProperties, bUseAdditionalProperties);

        return aSubFetchedProperties;
      });
    },
    _setTableNoDataText: function (oTable, oBindingInfo) {
      var sNoDataKey = "";
      var oTableFilterInfo = TableUtils.getAllFilterInfo(oTable),
          suffixResourceKey = oBindingInfo.path.startsWith("/") ? oBindingInfo.path.substr(1) : oBindingInfo.path;

      var _getNoDataTextWithFilters = function () {
        if (oTable.data("hiddenFilters") || oTable.data("quickFilterKey")) {
          return "M_TABLE_AND_CHART_NO_DATA_TEXT_MULTI_VIEW";
        } else {
          return "T_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER";
        }
      };

      var sFilterAssociation = oTable.getFilter();

      if (sFilterAssociation && !/BasicSearch$/.test(sFilterAssociation)) {
        // check if a FilterBar is associated to the Table (basic search on toolBar is excluded)
        if (oTableFilterInfo.search || oTableFilterInfo.filters && oTableFilterInfo.filters.length) {
          // check if table has any Filterbar filters or personalization filters
          sNoDataKey = _getNoDataTextWithFilters();
        } else {
          sNoDataKey = "T_TABLE_AND_CHART_NO_DATA_TEXT";
        }
      } else if (oTableFilterInfo.search || oTableFilterInfo.filters && oTableFilterInfo.filters.length) {
        //check if table has any personalization filters
        sNoDataKey = _getNoDataTextWithFilters();
      } else {
        sNoDataKey = "M_TABLE_AND_CHART_NO_FILTERS_NO_DATA_TEXT";
      }

      return oTable.getModel("sap.fe.i18n").getResourceBundle().then(function (oResourceBundle) {
        oTable.setNoData(CommonUtils.getTranslatedText(sNoDataKey, oResourceBundle, null, suffixResourceKey));
      }).catch(function (error) {
        Log.error(error);
      });
    },
    handleTableDataReceived: function (oTable, oInternalModelContext) {
      var oBinding = oTable && oTable.getRowBinding(),
          bDataReceivedAttached = oInternalModelContext && oInternalModelContext.getProperty("dataReceivedAttached");

      if (oInternalModelContext && !bDataReceivedAttached) {
        oBinding.attachDataReceived(function () {
          TableHelper.handleTableDeleteEnablementForSideEffects(oTable, oInternalModelContext); // Refresh the selected contexts to trigger re-calculation of enabled state of actions.

          oInternalModelContext.setProperty("selectedContexts", []);
          var aSelectedContexts = oTable.getSelectedContexts();
          oInternalModelContext.setProperty("selectedContexts", aSelectedContexts);
          oInternalModelContext.setProperty("numberOfSelectedContexts", aSelectedContexts.length);
          var oActionOperationAvailableMap = JSON.parse(CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "operationAvailableMap")));
          ActionRuntime.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts, "table");
          var oTableAPI = oTable ? oTable.getParent() : null;

          if (oTableAPI) {
            oTableAPI.setUpEmptyRows(oTable);
          }
        });
        oInternalModelContext.setProperty("dataReceivedAttached", true);
      }
    },
    rebind: function (oTable, oBindingInfo) {
      var oTableAPI = oTable.getParent();
      var bIsSuspended = oTableAPI === null || oTableAPI === void 0 ? void 0 : oTableAPI.getProperty("bindingSuspended");
      oTableAPI === null || oTableAPI === void 0 ? void 0 : oTableAPI.setProperty("outDatedBinding", bIsSuspended);

      if (!bIsSuspended) {
        TableUtils.clearSelection(oTable);
        TableDelegateBase.rebind.apply(this, [oTable, oBindingInfo]);
        TableUtils.onTableBound(oTable);

        this._setTableNoDataText(oTable, oBindingInfo);

        return TableUtils.whenBound(oTable).then(this.handleTableDataReceived(oTable, oTable.getBindingContext("internal"))).catch(function (oError) {
          Log.error("Error while waiting for the table to be bound", oError);
        });
      }

      return Promise.resolve();
    },

    /**
     * Fetches the relevant metadata for the table and returns property info array.
     *
     * @param oTable Instance of the MDCtable
     * @returns Array of property info
     */
    fetchProperties: function (oTable) {
      var _this3 = this;

      return DelegateUtil.fetchModel(oTable).then(function (oModel) {
        if (!oModel) {
          return [];
        }

        return _this3._getCachedOrFetchPropertiesForEntity(oTable, DelegateUtil.getCustomData(oTable, "entityType"), oModel.getMetaModel());
      });
    },
    preInit: function (oTable) {
      return TableDelegateBase.preInit.apply(this, [oTable]).then(function () {
        /**
         * Set the binding context to null for every fast creation row to avoid it inheriting
         * the wrong context and requesting the table columns on the parent entity
         * Set the correct binding context in ObjectPageController.enableFastCreationRow()
         */
        var oFastCreationRow = oTable.getCreationRow();

        if (oFastCreationRow) {
          oFastCreationRow.setBindingContext(null);
        }
      });
    },
    updateBindingInfo: function (oTable, oBindingInfo) {
      TableDelegateBase.updateBindingInfo.apply(this, [oTable, oBindingInfo]);

      this._internalUpdateBindingInfo(oTable, oBindingInfo);

      oBindingInfo.events.dataReceived = oTable.getParent().onInternalDataReceived.bind(oTable.getParent());
      oBindingInfo.events.dataRequested = oTable.getParent().onInternalDataRequested.bind(oTable.getParent());

      this._setTableNoDataText(oTable, oBindingInfo);
    },
    _manageSemanticTargets: function (oMDCTable) {
      var oRowBinding = oMDCTable.getRowBinding();

      if (oRowBinding) {
        oRowBinding.attachEventOnce("dataRequested", function () {
          setTimeout(function () {
            var _oView = CommonUtils.getTargetView(oMDCTable);

            if (_oView) {
              TableUtils.getSemanticTargetsFromTable(_oView.getController(), oMDCTable);
            }
          }, 0);
        });
      }
    },
    updateBinding: function (oTable, oBindingInfo, oBinding) {
      var oTableAPI = oTable.getParent();
      var bIsSuspended = oTableAPI === null || oTableAPI === void 0 ? void 0 : oTableAPI.getProperty("bindingSuspended");

      if (!bIsSuspended) {
        var bNeedManualRefresh = false;

        var _oView = CommonUtils.getTargetView(oTable);

        var oInternalBindingContext = oTable.getBindingContext("internal");
        var sManualUpdatePropertyKey = "pendingManualBindingUpdate";
        var bPendingManualUpdate = oInternalBindingContext.getProperty(sManualUpdatePropertyKey);
        var oRowBinding = oTable.getRowBinding();

        if (oRowBinding) {
          /**
           * Manual refresh if filters are not changed by binding.refresh() since updating the bindingInfo
           * is not enough to trigger a batch request.
           * Removing columns creates one batch request that was not executed before
           */
          var oldFilters = oRowBinding.getFilters("Application");
          bNeedManualRefresh = deepEqual(oBindingInfo.filters, oldFilters[0]) && oRowBinding.getQueryOptionsFromParameters().$search === oBindingInfo.parameters.$search && !bPendingManualUpdate && _oView && _oView.getViewData().converterType === "ListReport";
        }

        TableDelegateBase.updateBinding.apply(this, [oTable, oBindingInfo, oBinding]);
        oTable.fireEvent("bindingUpdated");

        if (bNeedManualRefresh && oTable.getFilter() && oBinding) {
          oRowBinding.requestRefresh(oRowBinding.getGroupId()).finally(function () {
            oInternalBindingContext.setProperty(sManualUpdatePropertyKey, false);
          }).catch(function (oError) {
            Log.error("Error while refreshing the table", oError);
          });
          oInternalBindingContext.setProperty(sManualUpdatePropertyKey, true);
        }

        this._manageSemanticTargets(oTable);
      }

      oTableAPI === null || oTableAPI === void 0 ? void 0 : oTableAPI.setProperty("outDatedBinding", bIsSuspended);
    },
    _computeRowBindingInfoFromTemplate: function (oTable) {
      // We need to deepClone the info we get from the custom data, otherwise some of its subobjects (e.g. parameters) will
      // be shared with oBindingInfo and modified later (Object.assign only does a shallow clone)
      var rowBindingInfo = deepClone(DelegateUtil.getCustomData(oTable, "rowsBindingInfo")); // if the rowBindingInfo has a $$getKeepAliveContext parameter we need to check it is the only Table with such a
      // parameter for the collectionMetaPath

      if (rowBindingInfo.parameters.$$getKeepAliveContext) {
        var collectionPath = DelegateUtil.getCustomData(oTable, "targetCollectionPath");
        var internalModel = oTable.getModel("internal");
        var keptAliveLists = internalModel.getObject("/keptAliveLists") || {};

        if (!keptAliveLists[collectionPath]) {
          keptAliveLists[collectionPath] = oTable.getId();
          internalModel.setProperty("/keptAliveLists", keptAliveLists);
        } else if (keptAliveLists[collectionPath] !== oTable.getId()) {
          delete rowBindingInfo.parameters.$$getKeepAliveContext;
        }
      }

      return rowBindingInfo;
    },
    _internalUpdateBindingInfo: function (oTable, oBindingInfo) {
      var oInternalModelContext = oTable.getBindingContext("internal");
      Object.assign(oBindingInfo, this._computeRowBindingInfoFromTemplate(oTable));
      /**
       * Binding info might be suspended at the beginning when the first bindRows is called:
       * To avoid duplicate requests but still have a binding to create new entries.				 *
       * After the initial binding step, follow up bindings should not longer be suspended.
       */

      if (oTable.getRowBinding()) {
        oBindingInfo.suspended = false;
      } // The previously added handler for the event 'dataReceived' is not anymore there
      // since the bindingInfo is recreated from scratch so we need to set the flag to false in order
      // to again add the handler on this event if needed


      if (oInternalModelContext) {
        oInternalModelContext.setProperty("dataReceivedAttached", false);
      }

      var oFilter;
      var oFilterInfo = TableUtils.getAllFilterInfo(oTable); // Prepare binding info with filter/search parameters

      if (oFilterInfo.filters.length > 0) {
        oFilter = new Filter({
          filters: oFilterInfo.filters,
          and: true
        });
      }

      if (oFilterInfo.bindingPath) {
        oBindingInfo.path = oFilterInfo.bindingPath;
      }

      var oDataStateIndicator = oTable.getDataStateIndicator();

      if (oDataStateIndicator && oDataStateIndicator.isFiltering()) {
        // Include filters on messageStrip
        if (oBindingInfo.filters.length > 0) {
          oFilter = new Filter({
            filters: oBindingInfo.filters.concat(oFilterInfo.filters),
            and: true
          });
          TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
        }
      } else {
        TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
      }
    },
    _templateCustomColumnFragment: function (oColumnInfo, oView, oModifier, sTableId) {
      var oColumnModel = new JSONModel(oColumnInfo),
          oThis = new JSONModel({
        id: sTableId
      }),
          oPreprocessorSettings = {
        bindingContexts: {
          "this": oThis.createBindingContext("/"),
          "column": oColumnModel.createBindingContext("/")
        },
        models: {
          "this": oThis,
          "column": oColumnModel
        }
      };
      return DelegateUtil.templateControlFragment("sap.fe.macros.table.CustomColumn", oPreprocessorSettings, {
        view: oView
      }, oModifier).then(function (oItem) {
        oColumnModel.destroy();
        return oItem;
      });
    },
    _templateSlotColumnFragment: function (oColumnInfo, oView, oModifier, sTableId) {
      try {
        var oColumnModel = new JSONModel(oColumnInfo),
            oThis = new JSONModel({
          id: sTableId
        }),
            oPreprocessorSettings = {
          bindingContexts: {
            "this": oThis.createBindingContext("/"),
            "column": oColumnModel.createBindingContext("/")
          },
          models: {
            "this": oThis,
            "column": oColumnModel
          }
        };
        return Promise.resolve(DelegateUtil.templateControlFragment("sap.fe.macros.table.SlotColumn", oPreprocessorSettings, {
          isXML: true
        })).then(function (slotColumnsXML) {
          if (!slotColumnsXML) {
            return Promise.resolve(null);
          }

          var slotXML = slotColumnsXML.getElementsByTagName("slot")[0],
              mdcTableTemplateXML = slotColumnsXML.getElementsByTagName("mdcTable:template")[0];
          mdcTableTemplateXML.removeChild(slotXML);

          if (oColumnInfo.template) {
            var oTemplate = new DOMParser().parseFromString(oColumnInfo.template, "text/xml");
            mdcTableTemplateXML.appendChild(oTemplate.firstElementChild);
          } else {
            Log.error("Please provide content inside this Building Block Column: ".concat(oColumnInfo.header));
            return Promise.resolve(null);
          }

          return oModifier.targets !== "jsControlTree" ? slotColumnsXML : Fragment.load({
            type: "XML",
            definition: slotColumnsXML
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _getExportFormat: function (dataType) {
      switch (dataType) {
        case "Edm.Date":
          return ExcelFormat.getExcelDatefromJSDate();

        case "Edm.DateTimeOffset":
          return ExcelFormat.getExcelDateTimefromJSDateTime();

        case "Edm.TimeOfDay":
          return ExcelFormat.getExcelTimefromJSTime();

        default:
          return undefined;
      }
    },
    _getVHRelevantFields: function (oMetaModel, sMetadataPath, sBindingPath) {
      var _this4 = this;

      var aFields = [],
          oDataFieldData = oMetaModel.getObject(sMetadataPath);

      if (oDataFieldData.$kind && oDataFieldData.$kind === "Property") {
        oDataFieldData = oMetaModel.getObject("".concat(sMetadataPath, "@com.sap.vocabularies.UI.v1.DataFieldDefault"));
        sMetadataPath = "".concat(sMetadataPath, "@com.sap.vocabularies.UI.v1.DataFieldDefault");
      }

      switch (oDataFieldData.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          if (oMetaModel.getObject("".concat(sMetadataPath, "/Target/$AnnotationPath")).includes("com.sap.vocabularies.UI.v1.FieldGroup")) {
            oMetaModel.getObject("".concat(sMetadataPath, "/Target/$AnnotationPath/Data")).forEach(function (oValue, iIndex) {
              aFields = aFields.concat(_this4._getVHRelevantFields(oMetaModel, "".concat(sMetadataPath, "/Target/$AnnotationPath/Data/").concat(iIndex)));
            });
          }

          break;

        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
          aFields.push(oMetaModel.getObject("".concat(sMetadataPath, "/Value/$Path")));
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          break;

        default:
          // property
          // temporary workaround to make sure VH relevant field path do not contain the bindingpath
          if (sMetadataPath.indexOf(sBindingPath) === 0) {
            aFields.push(sMetadataPath.substring(sBindingPath.length + 1));
            break;
          }

          aFields.push(CommonHelper.getNavigationPath(sMetadataPath, true));
          break;
      }

      return aFields;
    },
    _setDraftIndicatorOnVisibleColumn: function (oTable, aColumns, oColumnInfo) {
      var _this5 = this;

      var oInternalBindingContext = oTable.getBindingContext("internal");

      if (!oInternalBindingContext) {
        return;
      }

      var sInternalPath = oInternalBindingContext.getPath();
      var aColumnsWithDraftIndicator = aColumns.filter(function (oColumn) {
        return _this5._bColumnHasPropertyWithDraftIndicator(oColumn);
      });
      var aVisibleColumns = oTable.getColumns();
      var sAddVisibleColumnName, sVisibleColumnName, bFoundColumnVisibleWithDraft, sColumnNameWithDraftIndicator;

      for (var i in aVisibleColumns) {
        sVisibleColumnName = aVisibleColumns[i].getDataProperty();

        for (var j in aColumnsWithDraftIndicator) {
          sColumnNameWithDraftIndicator = aColumnsWithDraftIndicator[j].name;

          if (sVisibleColumnName === sColumnNameWithDraftIndicator) {
            bFoundColumnVisibleWithDraft = true;
            break;
          }

          if (oColumnInfo && oColumnInfo.name === sColumnNameWithDraftIndicator) {
            sAddVisibleColumnName = oColumnInfo.name;
          }
        }

        if (bFoundColumnVisibleWithDraft) {
          oInternalBindingContext.setProperty(sInternalPath + SEMANTICKEY_HAS_DRAFTINDICATOR, sVisibleColumnName);
          break;
        }
      }

      if (!bFoundColumnVisibleWithDraft && sAddVisibleColumnName) {
        oInternalBindingContext.setProperty(sInternalPath + SEMANTICKEY_HAS_DRAFTINDICATOR, sAddVisibleColumnName);
      }
    },
    removeItem: function (oPropertyInfoName, oTable, mPropertyBag) {
      var doRemoveItem = true;
      var oModifier = mPropertyBag.modifier;
      var sDataProperty = oPropertyInfoName && oModifier.getProperty(oPropertyInfoName, "dataProperty");

      if (sDataProperty && sDataProperty.indexOf && sDataProperty.indexOf("InlineXML") !== -1) {
        oModifier.insertAggregation(oTable, "dependents", oPropertyInfoName);
        doRemoveItem = false;
      }

      if (oTable.isA && oModifier.targets === "jsControlTree") {
        this._setDraftIndicatorStatus(oModifier, oTable, this.getColumnsFor(oTable));
      }

      return Promise.resolve(doRemoveItem);
    },
    _getMetaModel: function (mPropertyBag) {
      return mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();
    },
    _setDraftIndicatorStatus: function (oModifier, oTable, aColumns, oColumnInfo) {
      if (oModifier.targets === "jsControlTree") {
        this._setDraftIndicatorOnVisibleColumn(oTable, aColumns, oColumnInfo);
      }
    },
    _getGroupId: function (sRetrievedGroupId) {
      return sRetrievedGroupId || undefined;
    },
    _getDependent: function (oDependent, sPropertyInfoName, sDataProperty) {
      if (sPropertyInfoName === sDataProperty) {
        return oDependent;
      }

      return undefined;
    },
    _fnTemplateValueHelp: function (fnTemplateValueHelp, bValueHelpRequired, bValueHelpExists) {
      if (bValueHelpRequired && !bValueHelpExists) {
        return fnTemplateValueHelp("sap.fe.macros.table.ValueHelp");
      }

      return Promise.resolve();
    },
    _getDisplayMode: function (bDisplayMode) {
      var columnEditMode;

      if (bDisplayMode !== undefined) {
        bDisplayMode = typeof bDisplayMode === "boolean" ? bDisplayMode : bDisplayMode === "true";
        columnEditMode = bDisplayMode ? "Display" : "Editable";
        return {
          displaymode: bDisplayMode,
          columnEditMode: columnEditMode
        };
      }

      return {
        displaymode: undefined,
        columnEditMode: undefined
      };
    },
    _insertAggregation: function (oValueHelp, oModifier, oTable) {
      if (oValueHelp) {
        return oModifier.insertAggregation(oTable, "dependents", oValueHelp, 0);
      }

      return undefined;
    },

    /**
     * Invoked when a column is added using the table personalization dialog.
     *
     * @param sPropertyInfoName Name of the property for which the column is added
     * @param oTable Instance of table control
     * @param mPropertyBag Instance of property bag from the flexibility API
     * @returns Once resolved, a table column definition is returned
     */
    addItem: function (sPropertyInfoName, oTable, mPropertyBag) {
      try {
        var _this7 = this;

        var oMetaModel = _this7._getMetaModel(mPropertyBag),
            oModifier = mPropertyBag.modifier,
            sTableId = oModifier.getId(oTable),
            aColumns = oTable.isA ? _this7.getColumnsFor(oTable) : null;

        if (!aColumns) {
          return Promise.resolve(null);
        }

        var oColumnInfo = aColumns.find(function (oColumn) {
          return oColumn.name === sPropertyInfoName;
        });

        if (!oColumnInfo) {
          Log.error("".concat(sPropertyInfoName, " not found while adding column"));
          return Promise.resolve(null);
        }

        _this7._setDraftIndicatorStatus(oModifier, oTable, aColumns, oColumnInfo); // render custom column


        if (oColumnInfo.type === "Default") {
          return Promise.resolve(_this7._templateCustomColumnFragment(oColumnInfo, mPropertyBag.view, oModifier, sTableId));
        }

        if (oColumnInfo.type === "Slot") {
          return Promise.resolve(_this7._templateSlotColumnFragment(oColumnInfo, mPropertyBag.view, oModifier, sTableId));
        } // fall-back


        if (!oMetaModel) {
          return Promise.resolve(null);
        }

        return Promise.resolve(DelegateUtil.getCustomData(oTable, "metaPath", oModifier)).then(function (sPath) {
          return Promise.resolve(DelegateUtil.getCustomData(oTable, "entityType", oModifier)).then(function (sEntityTypePath) {
            return Promise.resolve(DelegateUtil.getCustomData(oTable, "requestGroupId", oModifier)).then(function (sRetrievedGroupId) {
              var sGroupId = _this7._getGroupId(sRetrievedGroupId);

              var oTableContext = oMetaModel.createBindingContext(sPath);
              return Promise.resolve(_this7._getCachedOrFetchPropertiesForEntity(oTable, sEntityTypePath, oMetaModel, mPropertyBag.appComponent)).then(function (aFetchedProperties) {
                var oPropertyInfo = aFetchedProperties.find(function (oInfo) {
                  return oInfo.name === sPropertyInfoName;
                });
                var oPropertyContext = oMetaModel.createBindingContext(oPropertyInfo.metadataPath);

                var aVHProperties = _this7._getVHRelevantFields(oMetaModel, oPropertyInfo.metadataPath, sPath);

                var oParameters = {
                  sBindingPath: sPath,
                  sValueHelpType: "TableValueHelp",
                  oControl: oTable,
                  oMetaModel: oMetaModel,
                  oModifier: oModifier,
                  oPropertyInfo: oPropertyInfo
                };

                var fnTemplateValueHelp = function (sFragmentName) {
                  try {
                    var oThis = new JSONModel({
                      id: sTableId,
                      requestGroupId: sGroupId
                    }),
                        oPreprocessorSettings = {
                      bindingContexts: {
                        "this": oThis.createBindingContext("/"),
                        "dataField": oPropertyContext
                      },
                      models: {
                        "this": oThis,
                        "dataField": oMetaModel,
                        metaModel: oMetaModel
                      }
                    };
                    return Promise.resolve(_finallyRethrows(function () {
                      return _catch(function () {
                        return Promise.resolve(DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {}, oModifier)).then(function (oValueHelp) {
                          return Promise.resolve(_this7._insertAggregation(oValueHelp, oModifier, oTable));
                        });
                      }, function (oError) {
                        //We always resolve the promise to ensure that the app does not crash
                        Log.error("ValueHelp not loaded : ".concat(oError.message));
                        return null;
                      });
                    }, function (_wasThrown, _result) {
                      oThis.destroy();
                      if (_wasThrown) throw _result;
                      return _result;
                    }));
                  } catch (e) {
                    return Promise.reject(e);
                  }
                };

                var fnTemplateFragment = function (oInPropertyInfo, oView) {
                  var sFragmentName = "sap.fe.macros.table.Column";
                  var bDisplayMode;
                  var sTableTypeCustomData;
                  var sOnChangeCustomData;
                  var sCreationModeCustomData;
                  return Promise.all([DelegateUtil.getCustomData(oTable, "displayModePropertyBinding", oModifier), DelegateUtil.getCustomData(oTable, "tableType", oModifier), DelegateUtil.getCustomData(oTable, "onChange", oModifier), DelegateUtil.getCustomData(oTable, "creationMode", oModifier)]).then(function (aCustomData) {
                    bDisplayMode = aCustomData[0];
                    sTableTypeCustomData = aCustomData[1];
                    sOnChangeCustomData = aCustomData[2];
                    sCreationModeCustomData = aCustomData[3]; // Read Only and Column Edit Mode can both have three state
                    // Undefined means that the framework decides what to do
                    // True / Display means always read only
                    // False / Editable means editable but while still respecting the low level principle (immutable property will not be editable)

                    var oDisplayModes = _this7._getDisplayMode(bDisplayMode);

                    bDisplayMode = oDisplayModes.displaymode;
                    var columnEditMode = oDisplayModes.columnEditMode;
                    var oThis = new JSONModel({
                      readOnly: bDisplayMode,
                      columnEditMode: columnEditMode,
                      tableType: sTableTypeCustomData,
                      onChange: sOnChangeCustomData,
                      id: sTableId,
                      navigationPropertyPath: sPropertyInfoName,
                      columnInfo: oColumnInfo,
                      collection: {
                        sPath: sPath,
                        oModel: oMetaModel
                      },
                      creationMode: sCreationModeCustomData
                    }),
                        oPreprocessorSettings = {
                      bindingContexts: {
                        "entitySet": oTableContext,
                        "collection": oTableContext,
                        "dataField": oPropertyContext,
                        "this": oThis.createBindingContext("/"),
                        "column": oThis.createBindingContext("/columnInfo")
                      },
                      models: {
                        "this": oThis,
                        "entitySet": oMetaModel,
                        "collection": oMetaModel,
                        "dataField": oMetaModel,
                        metaModel: oMetaModel,
                        "column": oThis
                      }
                    };
                    return DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {
                      view: oView
                    }, oModifier).finally(function () {
                      oThis.destroy();
                    });
                  });
                };

                return Promise.resolve(Promise.all(aVHProperties.map(function (sPropertyName) {
                  try {
                    var mParameters = Object.assign({}, oParameters, {
                      sPropertyName: sPropertyName
                    });
                    return Promise.resolve(Promise.all([DelegateUtil.isValueHelpRequired(mParameters), DelegateUtil.doesValueHelpExist(mParameters)])).then(function (aResults) {
                      var bValueHelpRequired = aResults[0],
                          bValueHelpExists = aResults[1];
                      return _this7._fnTemplateValueHelp(fnTemplateValueHelp, bValueHelpRequired, bValueHelpExists);
                    });
                  } catch (e) {
                    return Promise.reject(e);
                  }
                }))).then(function () {
                  // If view is not provided try to get it by accessing to the parental hierarchy
                  // If it doesn't work (table into an unattached OP section) get the view via the AppComponent
                  var view = mPropertyBag.view || CommonUtils.getTargetView(oTable) || (mPropertyBag.appComponent ? CommonUtils.getCurrentPageView(mPropertyBag.appComponent) : undefined);
                  return fnTemplateFragment(oPropertyInfo, view);
                });
              });
            });
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },

    /**
     * Provide the Table's filter delegate to provide basic filter functionality such as adding FilterFields.
     *
     * @returns Object for the Tables filter personalization.
     */
    getFilterDelegate: function () {
      return Object.assign({}, FilterBarDelegate, {
        addItem: function (sPropertyInfoName, oParentControl) {
          if (sPropertyInfoName.indexOf("Property::") === 0) {
            // Correct the name of complex property info references.
            sPropertyInfoName = sPropertyInfoName.replace("Property::", "");
          }

          return FilterBarDelegate.addItem(sPropertyInfoName, oParentControl);
        }
      });
    },

    /**
     * Returns the TypeUtil attached to this delegate.
     *
     * @returns Any instance of TypeUtil
     */
    getTypeUtil: function
      /*oPayload: object*/
    () {
      return TypeUtil;
    },
    formatGroupHeader: function (oTable, oContext, sProperty) {
      var _oFormatInfo$typeConf, _oFormatInfo$typeConf2;

      var mFormatInfos = _getCachedProperties(oTable, null),
          oFormatInfo = mFormatInfos && mFormatInfos.filter(function (obj) {
        return obj.name === sProperty;
      })[0],

      /*For a Date or DateTime property, the value is returned in external format using a UI5 type for the
            given property path that formats corresponding to the property's EDM type and constraints*/
      bExternalFormat = (oFormatInfo === null || oFormatInfo === void 0 ? void 0 : (_oFormatInfo$typeConf = oFormatInfo.typeConfig) === null || _oFormatInfo$typeConf === void 0 ? void 0 : _oFormatInfo$typeConf.baseType) === "DateTime" || (oFormatInfo === null || oFormatInfo === void 0 ? void 0 : (_oFormatInfo$typeConf2 = oFormatInfo.typeConfig) === null || _oFormatInfo$typeConf2 === void 0 ? void 0 : _oFormatInfo$typeConf2.baseType) === "Date";

      var sValue;

      if (oFormatInfo && oFormatInfo.mode) {
        switch (oFormatInfo.mode) {
          case "Description":
            sValue = oContext.getProperty(oFormatInfo.descriptionProperty, bExternalFormat);
            break;

          case "DescriptionValue":
            sValue = ValueFormatter.formatWithBrackets(oContext.getProperty(oFormatInfo.descriptionProperty, bExternalFormat), oContext.getProperty(oFormatInfo.valueProperty, bExternalFormat));
            break;

          case "ValueDescription":
            sValue = ValueFormatter.formatWithBrackets(oContext.getProperty(oFormatInfo.valueProperty, bExternalFormat), oContext.getProperty(oFormatInfo.descriptionProperty, bExternalFormat));
            break;
        }
      } else {
        sValue = oContext.getProperty(oFormatInfo.path, bExternalFormat);
      }

      return ResourceModel.getText("M_TABLE_GROUP_HEADER_TITLE", [oFormatInfo.label, sValue]);
    }
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiZmluYWxpemVyIiwiYmluZCIsIkZFVENIRURfUFJPUEVSVElFU19EQVRBX0tFWSIsIlNFTUFOVElDS0VZX0hBU19EUkFGVElORElDQVRPUiIsIkZpbHRlclJlc3RyaWN0aW9ucyIsIkNvbW1vblV0aWxzIiwiX3NldENhY2hlZFByb3BlcnRpZXMiLCJvVGFibGUiLCJhRmV0Y2hlZFByb3BlcnRpZXMiLCJiVXNlQWRkaXRpb25hbFByb3BlcnRpZXMiLCJ3aW5kb3ciLCJFbGVtZW50Iiwia2V5IiwiRGVsZWdhdGVVdGlsIiwic2V0Q3VzdG9tRGF0YSIsIl9nZXRDYWNoZWRQcm9wZXJ0aWVzIiwiZ2V0Q3VzdG9tRGF0YSIsIk9iamVjdCIsImFzc2lnbiIsIlRhYmxlRGVsZWdhdGVCYXNlIiwiX2NvbXB1dGVWaXN1YWxTZXR0aW5nc0ZvckZpZWxkR3JvdXAiLCJvUHJvcGVydHkiLCJhUHJvcGVydGllcyIsIm5hbWUiLCJpbmRleE9mIiwib0NvbHVtbiIsImdldENvbHVtbnMiLCJmaW5kIiwib0NvbCIsImdldERhdGFQcm9wZXJ0eSIsImJTaG93RGF0YUZpZWxkc0xhYmVsIiwiZGF0YSIsIm9NZXRhTW9kZWwiLCJnZXRNb2RlbCIsImdldE1ldGFNb2RlbCIsIm9Db250ZXh0IiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJtZXRhZGF0YVBhdGgiLCJyZXBsYWNlIiwib0RhdGFGaWVsZCIsImdldE9iamVjdCIsIm9GaWVsZEdyb3VwIiwiVGFyZ2V0IiwiJEFubm90YXRpb25QYXRoIiwiYUZpZWxkV2lkdGgiLCJEYXRhIiwiZm9yRWFjaCIsIm9EYXRhIiwib0RhdGFGaWVsZFdpZHRoIiwiJFR5cGUiLCJUYWJsZVNpemVIZWxwZXIiLCJnZXRXaWR0aEZvckRhdGFGaWVsZEZvckFubm90YXRpb24iLCJnZXRXaWR0aEZvckRhdGFGaWVsZCIsImxhYmVsV2lkdGgiLCJwcm9wZXJ0eVdpZHRoIiwiZ2V0QnV0dG9uV2lkdGgiLCJMYWJlbCIsInB1c2giLCJuV2lkZXN0IiwicmVkdWNlIiwiYWNjIiwidmFsdWUiLCJNYXRoIiwibWF4IiwidmlzdWFsU2V0dGluZ3MiLCJkZWVwRXh0ZW5kIiwid2lkdGhDYWxjdWxhdGlvbiIsInZlcnRpY2FsQXJyYW5nZW1lbnQiLCJtaW5XaWR0aCIsImNlaWwiLCJfY29tcHV0ZVZpc3VhbFNldHRpbmdzRm9yUHJvcGVydHlXaXRoVmFsdWVIZWxwIiwib1RhYmxlQVBJIiwiZ2V0UGFyZW50IiwicHJvcGVydHlJbmZvcyIsInVuZGVmaW5lZCIsIkVycm9yIiwiZ2FwIiwiZ2V0UmVhZE9ubHkiLCJfY29tcHV0ZVZpc3VhbFNldHRpbmdzRm9yUHJvcGVydHlXaXRoVW5pdCIsIm9Vbml0Iiwib1VuaXRUZXh0Iiwib1RpbWV6b25lVGV4dCIsInNVbml0VGV4dCIsIl9jb21wdXRlTGFiZWwiLCJsYWJlbE1hcCIsInByb3BlcnRpZXNXaXRoU2FtZUxhYmVsIiwibGFiZWwiLCJsZW5ndGgiLCJwYXRoIiwiaW5jbHVkZXMiLCJhZGRpdGlvbmFsTGFiZWxzIiwiam9pbiIsIl91cGRhdGVQcm9wZXJ0eUluZm8iLCJjb25jYXQiLCJ0eXBlQ29uZmlnIiwiZ2V0Q29sdW1uc0ZvciIsImdldFRhYmxlRGVmaW5pdGlvbiIsImNvbHVtbnMiLCJfZ2V0QWdncmVnYXRlZFByb3BlcnR5TWFwIiwiYWdncmVnYXRlcyIsImZldGNoRXhwb3J0Q2FwYWJpbGl0aWVzIiwib0NhcGFiaWxpdGllcyIsIm9Nb2RlbCIsImZldGNoTW9kZWwiLCJtb2RlbCIsImFTdXBwb3J0ZWRGb3JtYXRzIiwiYUxvd2VyRm9ybWF0cyIsIm1hcCIsImVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsIm9Bbm5vdGF0aW9uIiwiY2F0Y2giLCJlcnIiLCJMb2ciLCJlcnJvciIsIl9pc0ZpbHRlcmFibGVOYXZpZ2F0aW9uUHJvcGVydHkiLCJvQ29sdW1uSW5mbyIsInByb3BlcnR5IiwiYW5ub3RhdGlvblBhdGgiLCJzbGljZSIsImxhc3RJbmRleE9mIiwicmVsYXRpdmVQYXRoIiwiaXNQYXJ0T2ZMaW5lSXRlbSIsIiRpc0NvbGxlY3Rpb24iLCJfZmV0Y2hQcm9wZXJ0eUluZm8iLCJvQXBwQ29tcG9uZW50Iiwic0Fic29sdXRlTmF2aWdhdGlvblBhdGgiLCJvTmF2aWdhdGlvbkNvbnRleHQiLCJvVHlwZUNvbmZpZyIsImNsYXNzTmFtZSIsImlzVHlwZUZpbHRlcmFibGUiLCJUeXBlVXRpbCIsImdldFR5cGVDb25maWciLCJvRm9ybWF0T3B0aW9ucyIsIm9Db25zdHJhaW50cyIsImJGaWx0ZXJhYmxlIiwiQ29tbW9uSGVscGVyIiwiaXNQcm9wZXJ0eUZpbHRlcmFibGUiLCJjb250ZXh0IiwiYkNvbXBsZXhUeXBlIiwiYklzQW5hbHl0aWNhbFRhYmxlIiwiYUFnZ3JlZ2F0ZWRQcm9wZXJ0eU1hcFVuZmlsdGVyYWJsZSIsIm9FeHBvcnRTZXR0aW5ncyIsImV4cG9ydFNldHRpbmdzIiwiZXhwb3J0Rm9ybWF0IiwiX2dldEV4cG9ydEZvcm1hdCIsInNMYWJlbCIsImlzRGF0YVBvaW50RmFrZVRhcmdldFByb3BlcnR5IiwiUmVzb3VyY2VNb2RlbCIsImdldFRleHQiLCJnZXRMb2NhbGl6ZWRUZXh0IiwidGltZXpvbmVQcm9wZXJ0eSIsImZvcm1hdCIsInRlbXBsYXRlIiwib1Byb3BlcnR5SW5mbyIsImdyb3VwTGFiZWwiLCJncm91cCIsInRvb2x0aXAiLCJ2aXNpYmxlIiwiYXZhaWxhYmlsaXR5IiwidW5pdCIsImtleXMiLCJ3cmFwIiwiYWRkaXRpb25hbFByb3BlcnR5SW5mb3MiLCJzb3J0YWJsZSIsImZpbHRlcmFibGUiLCJpc0tleSIsImdyb3VwYWJsZSIsImlzR3JvdXBhYmxlIiwidGV4dEFycmFuZ2VtZW50Iiwib0Rlc2NyaXB0aW9uQ29sdW1uIiwidGV4dFByb3BlcnR5IiwibW9kZSIsInZhbHVlUHJvcGVydHkiLCJkZXNjcmlwdGlvblByb3BlcnR5IiwidGV4dCIsImNhc2VTZW5zaXRpdmUiLCJ1bml0VGV4dCIsInRpbWV6b25lVGV4dCIsIl9mZXRjaEN1c3RvbVByb3BlcnR5SW5mbyIsImhlYWRlciIsInR5cGUiLCJfYkNvbHVtbkhhc1Byb3BlcnR5V2l0aERyYWZ0SW5kaWNhdG9yIiwiZm9ybWF0T3B0aW9ucyIsImhhc0RyYWZ0SW5kaWNhdG9yIiwiZmllbGRHcm91cERyYWZ0SW5kaWNhdG9yUHJvcGVydHlQYXRoIiwiX3VwZGF0ZURyYWZ0SW5kaWNhdG9yTW9kZWwiLCJfb1RhYmxlIiwiX29Db2x1bW5JbmZvIiwiYVZpc2libGVDb2x1bW5zIiwib0ludGVybmFsQmluZGluZ0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsInNJbnRlcm5hbFBhdGgiLCJnZXRQYXRoIiwiaW5kZXgiLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5IiwiX2ZldGNoUHJvcGVydGllc0ZvckVudGl0eSIsInNFbnRpdHlUeXBlUGF0aCIsInNCaW5kaW5nUGF0aCIsIk1vZGVsSGVscGVyIiwiZ2V0RW50aXR5U2V0UGF0aCIsIm9GUiIsImdldEZpbHRlclJlc3RyaWN0aW9uc0J5UGF0aCIsImFOb25GaWx0ZXJhYmxlUHJvcHMiLCJOT05fRklMVEVSQUJMRV9QUk9QRVJUSUVTIiwiUHJvbWlzZSIsInJlc29sdmUiLCJhQ29sdW1ucyIsIm1heENvbmRpdGlvbnMiLCJpc011bHRpVmFsdWUiLCJfZ2V0Q2FjaGVkT3JGZXRjaFByb3BlcnRpZXNGb3JFbnRpdHkiLCJhU3ViRmV0Y2hlZFByb3BlcnRpZXMiLCJfc2V0VGFibGVOb0RhdGFUZXh0Iiwib0JpbmRpbmdJbmZvIiwic05vRGF0YUtleSIsIm9UYWJsZUZpbHRlckluZm8iLCJUYWJsZVV0aWxzIiwiZ2V0QWxsRmlsdGVySW5mbyIsInN1ZmZpeFJlc291cmNlS2V5Iiwic3RhcnRzV2l0aCIsInN1YnN0ciIsIl9nZXROb0RhdGFUZXh0V2l0aEZpbHRlcnMiLCJzRmlsdGVyQXNzb2NpYXRpb24iLCJnZXRGaWx0ZXIiLCJ0ZXN0Iiwic2VhcmNoIiwiZmlsdGVycyIsImdldFJlc291cmNlQnVuZGxlIiwib1Jlc291cmNlQnVuZGxlIiwic2V0Tm9EYXRhIiwiZ2V0VHJhbnNsYXRlZFRleHQiLCJoYW5kbGVUYWJsZURhdGFSZWNlaXZlZCIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsIm9CaW5kaW5nIiwiZ2V0Um93QmluZGluZyIsImJEYXRhUmVjZWl2ZWRBdHRhY2hlZCIsImF0dGFjaERhdGFSZWNlaXZlZCIsIlRhYmxlSGVscGVyIiwiaGFuZGxlVGFibGVEZWxldGVFbmFibGVtZW50Rm9yU2lkZUVmZmVjdHMiLCJhU2VsZWN0ZWRDb250ZXh0cyIsImdldFNlbGVjdGVkQ29udGV4dHMiLCJvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwiSlNPTiIsInBhcnNlIiwicGFyc2VDdXN0b21EYXRhIiwiQWN0aW9uUnVudGltZSIsInNldEFjdGlvbkVuYWJsZW1lbnQiLCJzZXRVcEVtcHR5Um93cyIsInJlYmluZCIsImJJc1N1c3BlbmRlZCIsImNsZWFyU2VsZWN0aW9uIiwiYXBwbHkiLCJvblRhYmxlQm91bmQiLCJ3aGVuQm91bmQiLCJvRXJyb3IiLCJmZXRjaFByb3BlcnRpZXMiLCJwcmVJbml0Iiwib0Zhc3RDcmVhdGlvblJvdyIsImdldENyZWF0aW9uUm93Iiwic2V0QmluZGluZ0NvbnRleHQiLCJ1cGRhdGVCaW5kaW5nSW5mbyIsIl9pbnRlcm5hbFVwZGF0ZUJpbmRpbmdJbmZvIiwiZXZlbnRzIiwiZGF0YVJlY2VpdmVkIiwib25JbnRlcm5hbERhdGFSZWNlaXZlZCIsImRhdGFSZXF1ZXN0ZWQiLCJvbkludGVybmFsRGF0YVJlcXVlc3RlZCIsIl9tYW5hZ2VTZW1hbnRpY1RhcmdldHMiLCJvTURDVGFibGUiLCJvUm93QmluZGluZyIsImF0dGFjaEV2ZW50T25jZSIsInNldFRpbWVvdXQiLCJfb1ZpZXciLCJnZXRUYXJnZXRWaWV3IiwiZ2V0U2VtYW50aWNUYXJnZXRzRnJvbVRhYmxlIiwiZ2V0Q29udHJvbGxlciIsInVwZGF0ZUJpbmRpbmciLCJiTmVlZE1hbnVhbFJlZnJlc2giLCJzTWFudWFsVXBkYXRlUHJvcGVydHlLZXkiLCJiUGVuZGluZ01hbnVhbFVwZGF0ZSIsIm9sZEZpbHRlcnMiLCJnZXRGaWx0ZXJzIiwiZGVlcEVxdWFsIiwiZ2V0UXVlcnlPcHRpb25zRnJvbVBhcmFtZXRlcnMiLCIkc2VhcmNoIiwicGFyYW1ldGVycyIsImdldFZpZXdEYXRhIiwiY29udmVydGVyVHlwZSIsImZpcmVFdmVudCIsInJlcXVlc3RSZWZyZXNoIiwiZ2V0R3JvdXBJZCIsImZpbmFsbHkiLCJfY29tcHV0ZVJvd0JpbmRpbmdJbmZvRnJvbVRlbXBsYXRlIiwicm93QmluZGluZ0luZm8iLCJkZWVwQ2xvbmUiLCIkJGdldEtlZXBBbGl2ZUNvbnRleHQiLCJjb2xsZWN0aW9uUGF0aCIsImludGVybmFsTW9kZWwiLCJrZXB0QWxpdmVMaXN0cyIsImdldElkIiwic3VzcGVuZGVkIiwib0ZpbHRlciIsIm9GaWx0ZXJJbmZvIiwiRmlsdGVyIiwiYW5kIiwiYmluZGluZ1BhdGgiLCJvRGF0YVN0YXRlSW5kaWNhdG9yIiwiZ2V0RGF0YVN0YXRlSW5kaWNhdG9yIiwiaXNGaWx0ZXJpbmciLCJfdGVtcGxhdGVDdXN0b21Db2x1bW5GcmFnbWVudCIsIm9WaWV3Iiwib01vZGlmaWVyIiwic1RhYmxlSWQiLCJvQ29sdW1uTW9kZWwiLCJKU09OTW9kZWwiLCJvVGhpcyIsImlkIiwib1ByZXByb2Nlc3NvclNldHRpbmdzIiwiYmluZGluZ0NvbnRleHRzIiwibW9kZWxzIiwidGVtcGxhdGVDb250cm9sRnJhZ21lbnQiLCJ2aWV3Iiwib0l0ZW0iLCJkZXN0cm95IiwiX3RlbXBsYXRlU2xvdENvbHVtbkZyYWdtZW50IiwiaXNYTUwiLCJzbG90Q29sdW1uc1hNTCIsInNsb3RYTUwiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIm1kY1RhYmxlVGVtcGxhdGVYTUwiLCJyZW1vdmVDaGlsZCIsIm9UZW1wbGF0ZSIsIkRPTVBhcnNlciIsInBhcnNlRnJvbVN0cmluZyIsImFwcGVuZENoaWxkIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJ0YXJnZXRzIiwiRnJhZ21lbnQiLCJsb2FkIiwiZGVmaW5pdGlvbiIsImRhdGFUeXBlIiwiRXhjZWxGb3JtYXQiLCJnZXRFeGNlbERhdGVmcm9tSlNEYXRlIiwiZ2V0RXhjZWxEYXRlVGltZWZyb21KU0RhdGVUaW1lIiwiZ2V0RXhjZWxUaW1lZnJvbUpTVGltZSIsIl9nZXRWSFJlbGV2YW50RmllbGRzIiwic01ldGFkYXRhUGF0aCIsImFGaWVsZHMiLCJvRGF0YUZpZWxkRGF0YSIsIiRraW5kIiwib1ZhbHVlIiwiaUluZGV4Iiwic3Vic3RyaW5nIiwiZ2V0TmF2aWdhdGlvblBhdGgiLCJfc2V0RHJhZnRJbmRpY2F0b3JPblZpc2libGVDb2x1bW4iLCJhQ29sdW1uc1dpdGhEcmFmdEluZGljYXRvciIsImZpbHRlciIsInNBZGRWaXNpYmxlQ29sdW1uTmFtZSIsInNWaXNpYmxlQ29sdW1uTmFtZSIsImJGb3VuZENvbHVtblZpc2libGVXaXRoRHJhZnQiLCJzQ29sdW1uTmFtZVdpdGhEcmFmdEluZGljYXRvciIsImkiLCJqIiwicmVtb3ZlSXRlbSIsIm9Qcm9wZXJ0eUluZm9OYW1lIiwibVByb3BlcnR5QmFnIiwiZG9SZW1vdmVJdGVtIiwibW9kaWZpZXIiLCJzRGF0YVByb3BlcnR5IiwiaW5zZXJ0QWdncmVnYXRpb24iLCJpc0EiLCJfc2V0RHJhZnRJbmRpY2F0b3JTdGF0dXMiLCJfZ2V0TWV0YU1vZGVsIiwiYXBwQ29tcG9uZW50IiwiX2dldEdyb3VwSWQiLCJzUmV0cmlldmVkR3JvdXBJZCIsIl9nZXREZXBlbmRlbnQiLCJvRGVwZW5kZW50Iiwic1Byb3BlcnR5SW5mb05hbWUiLCJfZm5UZW1wbGF0ZVZhbHVlSGVscCIsImZuVGVtcGxhdGVWYWx1ZUhlbHAiLCJiVmFsdWVIZWxwUmVxdWlyZWQiLCJiVmFsdWVIZWxwRXhpc3RzIiwiX2dldERpc3BsYXlNb2RlIiwiYkRpc3BsYXlNb2RlIiwiY29sdW1uRWRpdE1vZGUiLCJkaXNwbGF5bW9kZSIsIl9pbnNlcnRBZ2dyZWdhdGlvbiIsIm9WYWx1ZUhlbHAiLCJhZGRJdGVtIiwic1BhdGgiLCJzR3JvdXBJZCIsIm9UYWJsZUNvbnRleHQiLCJvSW5mbyIsIm9Qcm9wZXJ0eUNvbnRleHQiLCJhVkhQcm9wZXJ0aWVzIiwib1BhcmFtZXRlcnMiLCJzVmFsdWVIZWxwVHlwZSIsIm9Db250cm9sIiwic0ZyYWdtZW50TmFtZSIsInJlcXVlc3RHcm91cElkIiwibWV0YU1vZGVsIiwibWVzc2FnZSIsImZuVGVtcGxhdGVGcmFnbWVudCIsIm9JblByb3BlcnR5SW5mbyIsInNUYWJsZVR5cGVDdXN0b21EYXRhIiwic09uQ2hhbmdlQ3VzdG9tRGF0YSIsInNDcmVhdGlvbk1vZGVDdXN0b21EYXRhIiwiYWxsIiwiYUN1c3RvbURhdGEiLCJvRGlzcGxheU1vZGVzIiwicmVhZE9ubHkiLCJ0YWJsZVR5cGUiLCJvbkNoYW5nZSIsIm5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJjb2x1bW5JbmZvIiwiY29sbGVjdGlvbiIsImNyZWF0aW9uTW9kZSIsInNQcm9wZXJ0eU5hbWUiLCJtUGFyYW1ldGVycyIsImlzVmFsdWVIZWxwUmVxdWlyZWQiLCJkb2VzVmFsdWVIZWxwRXhpc3QiLCJhUmVzdWx0cyIsImdldEN1cnJlbnRQYWdlVmlldyIsImdldEZpbHRlckRlbGVnYXRlIiwiRmlsdGVyQmFyRGVsZWdhdGUiLCJvUGFyZW50Q29udHJvbCIsImdldFR5cGVVdGlsIiwiZm9ybWF0R3JvdXBIZWFkZXIiLCJzUHJvcGVydHkiLCJtRm9ybWF0SW5mb3MiLCJvRm9ybWF0SW5mbyIsIm9iaiIsImJFeHRlcm5hbEZvcm1hdCIsImJhc2VUeXBlIiwic1ZhbHVlIiwiVmFsdWVGb3JtYXR0ZXIiLCJmb3JtYXRXaXRoQnJhY2tldHMiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlRhYmxlRGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gXCJzYXAvYmFzZS91dGlsL2RlZXBDbG9uZVwiO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tIFwic2FwL2Jhc2UvdXRpbC9kZWVwRXF1YWxcIjtcbmltcG9ydCBkZWVwRXh0ZW5kIGZyb20gXCJzYXAvYmFzZS91dGlsL2RlZXBFeHRlbmRcIjtcbmltcG9ydCBBY3Rpb25SdW50aW1lIGZyb20gXCJzYXAvZmUvY29yZS9BY3Rpb25SdW50aW1lXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IEN1c3RvbUJhc2VkVGFibGVDb2x1bW4gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vVGFibGVcIjtcbmltcG9ydCB0eXBlIHsgQ3VzdG9tRWxlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgVmFsdWVGb3JtYXR0ZXIgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVmFsdWVGb3JtYXR0ZXJcIjtcbmltcG9ydCBFeGNlbEZvcm1hdCBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9FeGNlbEZvcm1hdEhlbHBlclwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgQ29tbW9uSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IERlbGVnYXRlVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9EZWxlZ2F0ZVV0aWxcIjtcbmltcG9ydCBGaWx0ZXJCYXJEZWxlZ2F0ZSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWx0ZXJCYXIvRmlsdGVyQmFyRGVsZWdhdGVcIjtcbmltcG9ydCBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvZmUvbWFjcm9zL1Jlc291cmNlTW9kZWxcIjtcbmltcG9ydCBUYWJsZUhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9UYWJsZUhlbHBlclwiO1xuaW1wb3J0IFRhYmxlU2l6ZUhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9UYWJsZVNpemVIZWxwZXJcIjtcbmltcG9ydCBUYWJsZVV0aWxzIGZyb20gXCJzYXAvZmUvbWFjcm9zL3RhYmxlL1V0aWxzXCI7XG5pbXBvcnQgRnJhZ21lbnQgZnJvbSBcInNhcC91aS9jb3JlL0ZyYWdtZW50XCI7XG5pbXBvcnQgVGFibGVEZWxlZ2F0ZUJhc2UgZnJvbSBcInNhcC91aS9tZGMvb2RhdGEvdjQvVGFibGVEZWxlZ2F0ZVwiO1xuaW1wb3J0IFR5cGVVdGlsIGZyb20gXCJzYXAvZmUvY29yZS90eXBlL1R5cGVVdGlsXCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL3VpL21kYy9UYWJsZVwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBGaWx0ZXIgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgVGFibGVBUEkgZnJvbSBcIi4uL1RhYmxlQVBJXCI7XG5cbmNvbnN0IEZFVENIRURfUFJPUEVSVElFU19EQVRBX0tFWSA9IFwic2FwX2ZlX1RhYmxlRGVsZWdhdGVfcHJvcGVydHlJbmZvTWFwXCI7XG5jb25zdCBTRU1BTlRJQ0tFWV9IQVNfRFJBRlRJTkRJQ0FUT1IgPSBcIi9zZW1hbnRpY0tleUhhc0RyYWZ0SW5kaWNhdG9yXCI7XG5jb25zdCBGaWx0ZXJSZXN0cmljdGlvbnMgPSBDb21tb25VdGlscy5GaWx0ZXJSZXN0cmljdGlvbnM7XG5cbmZ1bmN0aW9uIF9zZXRDYWNoZWRQcm9wZXJ0aWVzKG9UYWJsZTogYW55LCBhRmV0Y2hlZFByb3BlcnRpZXM6IGFueSwgYlVzZUFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBhbnkpIHtcblx0Ly8gZG8gbm90IGNhY2hlIGR1cmluZyB0ZW1wbGF0aW5nLCBlbHNlIGl0IGJlY29tZXMgcGFydCBvZiB0aGUgY2FjaGVkIHZpZXdcblx0aWYgKG9UYWJsZSBpbnN0YW5jZW9mIHdpbmRvdy5FbGVtZW50KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGNvbnN0IGtleSA9IGJVc2VBZGRpdGlvbmFsUHJvcGVydGllcyA/IGAke0ZFVENIRURfUFJPUEVSVElFU19EQVRBX0tFWX1fYWRkYCA6IEZFVENIRURfUFJPUEVSVElFU19EQVRBX0tFWTtcblx0RGVsZWdhdGVVdGlsLnNldEN1c3RvbURhdGEob1RhYmxlLCBrZXksIGFGZXRjaGVkUHJvcGVydGllcyk7XG59XG5mdW5jdGlvbiBfZ2V0Q2FjaGVkUHJvcGVydGllcyhvVGFibGU6IGFueSwgYlVzZUFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBhbnkpIHtcblx0Ly8gcHJvcGVydGllcyBhcmUgbm90IGNhY2hlZCBkdXJpbmcgdGVtcGxhdGluZ1xuXHRpZiAob1RhYmxlIGluc3RhbmNlb2Ygd2luZG93LkVsZW1lbnQpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRjb25zdCBrZXkgPSBiVXNlQWRkaXRpb25hbFByb3BlcnRpZXMgPyBgJHtGRVRDSEVEX1BST1BFUlRJRVNfREFUQV9LRVl9X2FkZGAgOiBGRVRDSEVEX1BST1BFUlRJRVNfREFUQV9LRVk7XG5cdHJldHVybiBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIGtleSk7XG59XG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3Igc2FwLnVpLm1kYy5UYWJsZS5cbiAqIDxoMz48Yj5Ob3RlOjwvYj48L2gzPlxuICogVGhlIGNsYXNzIGlzIGV4cGVyaW1lbnRhbCBhbmQgdGhlIEFQSSBhbmQgdGhlIGJlaGF2aW9yIGFyZSBub3QgZmluYWxpemVkLiBUaGlzIGNsYXNzIGlzIG5vdCBpbnRlbmRlZCBmb3IgcHJvZHVjdGl2ZSB1c2FnZS5cbiAqXG4gKiBAYXV0aG9yIFNBUCBTRVxuICogQHByaXZhdGVcbiAqIEBleHBlcmltZW50YWxcbiAqIEBzaW5jZSAxLjY5XG4gKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZURlbGVnYXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IE9iamVjdC5hc3NpZ24oe30sIFRhYmxlRGVsZWdhdGVCYXNlLCB7XG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGNhbGN1bGF0ZXMgdGhlIHdpZHRoIGZvciBhIEZpZWxkR3JvdXAgY29sdW1uLlxuXHQgKiBUaGUgd2lkdGggb2YgdGhlIEZpZWxkR3JvdXAgaXMgdGhlIHdpZHRoIG9mIHRoZSB3aWRlc3QgcHJvcGVydHkgY29udGFpbmVkIGluIHRoZSBGaWVsZEdyb3VwIChpbmNsdWRpbmcgdGhlIGxhYmVsIGlmIHNob3dEYXRhRmllbGRzTGFiZWwgaXMgdHJ1ZSlcblx0ICogVGhlIHJlc3VsdCBvZiB0aGlzIGNhbGN1bGF0aW9uIGlzIHN0b3JlZCBpbiB0aGUgdmlzdWFsU2V0dGluZ3Mud2lkdGhDYWxjdWxhdGlvbi5taW5XaWR0aCBwcm9wZXJ0eSwgd2hpY2ggaXMgdXNlZCBieSB0aGUgTURDdGFibGUuXG5cdCAqXG5cdCAqIEBwYXJhbSBvVGFibGUgSW5zdGFuY2Ugb2YgdGhlIE1EQ3RhYmxlXG5cdCAqIEBwYXJhbSBvUHJvcGVydHkgQ3VycmVudCBwcm9wZXJ0eVxuXHQgKiBAcGFyYW0gYVByb3BlcnRpZXMgQXJyYXkgb2YgcHJvcGVydGllc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZURlbGVnYXRlXG5cdCAqL1xuXHRfY29tcHV0ZVZpc3VhbFNldHRpbmdzRm9yRmllbGRHcm91cDogZnVuY3Rpb24gKG9UYWJsZTogVGFibGUsIG9Qcm9wZXJ0eTogYW55LCBhUHJvcGVydGllczogYW55W10pIHtcblx0XHRpZiAob1Byb3BlcnR5Lm5hbWUuaW5kZXhPZihcIkRhdGFGaWVsZEZvckFubm90YXRpb246OkZpZWxkR3JvdXA6OlwiKSA9PT0gMCkge1xuXHRcdFx0Y29uc3Qgb0NvbHVtbiA9IG9UYWJsZS5nZXRDb2x1bW5zKCkuZmluZChmdW5jdGlvbiAob0NvbDogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvQ29sLmdldERhdGFQcm9wZXJ0eSgpID09PSBvUHJvcGVydHkubmFtZTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgYlNob3dEYXRhRmllbGRzTGFiZWwgPSBvQ29sdW1uID8gb0NvbHVtbi5kYXRhKFwic2hvd0RhdGFGaWVsZHNMYWJlbFwiKSA9PT0gXCJ0cnVlXCIgOiBmYWxzZTtcblx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvVGFibGUuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbDtcblx0XHRcdGNvbnN0IG9Db250ZXh0ID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChvUHJvcGVydHkubWV0YWRhdGFQYXRoLnJlcGxhY2UoL0AuKi8sIFwiXCIpKSBhcyBDb250ZXh0O1xuXHRcdFx0Y29uc3Qgb0RhdGFGaWVsZCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KG9Qcm9wZXJ0eS5tZXRhZGF0YVBhdGgpO1xuXHRcdFx0Y29uc3Qgb0ZpZWxkR3JvdXA6IGFueSA9IG9EYXRhRmllbGQuVGFyZ2V0ID8gb0NvbnRleHQuZ2V0T2JqZWN0KG9EYXRhRmllbGQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aCkgOiBudWxsO1xuXHRcdFx0Y29uc3QgYUZpZWxkV2lkdGg6IGFueSA9IFtdO1xuXHRcdFx0b0ZpZWxkR3JvdXAuRGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChvRGF0YTogYW55KSB7XG5cdFx0XHRcdGxldCBvRGF0YUZpZWxkV2lkdGg6IGFueTtcblx0XHRcdFx0c3dpdGNoIChvRGF0YS4kVHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBbm5vdGF0aW9uXCI6XG5cdFx0XHRcdFx0XHRvRGF0YUZpZWxkV2lkdGggPSBUYWJsZVNpemVIZWxwZXIuZ2V0V2lkdGhGb3JEYXRhRmllbGRGb3JBbm5vdGF0aW9uKFxuXHRcdFx0XHRcdFx0XHRvRGF0YSxcblx0XHRcdFx0XHRcdFx0YlNob3dEYXRhRmllbGRzTGFiZWwsXG5cdFx0XHRcdFx0XHRcdGFQcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdFx0XHRvQ29udGV4dFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRcIjpcblx0XHRcdFx0XHRcdGlmIChiU2hvd0RhdGFGaWVsZHNMYWJlbCkge1xuXHRcdFx0XHRcdFx0XHRvRGF0YUZpZWxkV2lkdGggPSBUYWJsZVNpemVIZWxwZXIuZ2V0V2lkdGhGb3JEYXRhRmllbGQob0RhdGEsIGJTaG93RGF0YUZpZWxkc0xhYmVsLCBhUHJvcGVydGllcywgb0NvbnRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiOlxuXHRcdFx0XHRcdFx0b0RhdGFGaWVsZFdpZHRoID0ge1xuXHRcdFx0XHRcdFx0XHRsYWJlbFdpZHRoOiAwLFxuXHRcdFx0XHRcdFx0XHRwcm9wZXJ0eVdpZHRoOiBUYWJsZVNpemVIZWxwZXIuZ2V0QnV0dG9uV2lkdGgob0RhdGEuTGFiZWwpXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob0RhdGFGaWVsZFdpZHRoKSB7XG5cdFx0XHRcdFx0YUZpZWxkV2lkdGgucHVzaChvRGF0YUZpZWxkV2lkdGgubGFiZWxXaWR0aCArIG9EYXRhRmllbGRXaWR0aC5wcm9wZXJ0eVdpZHRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBuV2lkZXN0ID0gYUZpZWxkV2lkdGgucmVkdWNlKGZ1bmN0aW9uIChhY2M6IGFueSwgdmFsdWU6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoYWNjLCB2YWx1ZSk7XG5cdFx0XHR9LCAwKTtcblx0XHRcdG9Qcm9wZXJ0eS52aXN1YWxTZXR0aW5ncyA9IGRlZXBFeHRlbmQob1Byb3BlcnR5LnZpc3VhbFNldHRpbmdzLCB7XG5cdFx0XHRcdHdpZHRoQ2FsY3VsYXRpb246IHtcblx0XHRcdFx0XHR2ZXJ0aWNhbEFycmFuZ2VtZW50OiB0cnVlLFxuXHRcdFx0XHRcdG1pbldpZHRoOiBNYXRoLmNlaWwobldpZGVzdClcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdF9jb21wdXRlVmlzdWFsU2V0dGluZ3NGb3JQcm9wZXJ0eVdpdGhWYWx1ZUhlbHA6IGZ1bmN0aW9uIChvVGFibGU6IGFueSwgb1Byb3BlcnR5OiBhbnkpIHtcblx0XHRjb25zdCBvVGFibGVBUEkgPSBvVGFibGUgPyBvVGFibGUuZ2V0UGFyZW50KCkgOiBudWxsO1xuXHRcdGlmICghb1Byb3BlcnR5LnByb3BlcnR5SW5mb3MpIHtcblx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvVGFibGUuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0XHRcdGlmIChvUHJvcGVydHkubWV0YWRhdGFQYXRoID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYSBgbWV0YWRhdGFQYXRoYCBwcm9wZXJ0eSBpcyBleHBlY3RlZCB3aGVuIGNvbXB1dGluZyBWaXN1YWxTZXR0aW5ncyBmb3IgcHJvcGVydHkgd2l0aCBWYWx1ZUhlbHBcIik7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBvRGF0YUZpZWxkID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7b1Byb3BlcnR5Lm1ldGFkYXRhUGF0aH1AYCk7XG5cdFx0XHRpZiAob0RhdGFGaWVsZCAmJiBvRGF0YUZpZWxkW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RcIl0pIHtcblx0XHRcdFx0b1Byb3BlcnR5LnZpc3VhbFNldHRpbmdzID0gZGVlcEV4dGVuZChvUHJvcGVydHkudmlzdWFsU2V0dGluZ3MsIHtcblx0XHRcdFx0XHR3aWR0aENhbGN1bGF0aW9uOiB7XG5cdFx0XHRcdFx0XHRnYXA6IG9UYWJsZUFQSSAmJiBvVGFibGVBUEkuZ2V0UmVhZE9ubHkoKSA/IDAgOiA0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0X2NvbXB1dGVWaXN1YWxTZXR0aW5nc0ZvclByb3BlcnR5V2l0aFVuaXQ6IGZ1bmN0aW9uIChcblx0XHRvVGFibGU6IGFueSxcblx0XHRvUHJvcGVydHk6IGFueSxcblx0XHRvVW5pdDogc3RyaW5nLFxuXHRcdG9Vbml0VGV4dDogc3RyaW5nLFxuXHRcdG9UaW1lem9uZVRleHQ6IHN0cmluZ1xuXHQpIHtcblx0XHRjb25zdCBvVGFibGVBUEkgPSBvVGFibGUgPyBvVGFibGUuZ2V0UGFyZW50KCkgOiBudWxsO1xuXHRcdC8vIHVwZGF0ZSBnYXAgZm9yIHByb3BlcnRpZXMgd2l0aCBzdHJpbmcgdW5pdFxuXHRcdGNvbnN0IHNVbml0VGV4dCA9IG9Vbml0VGV4dCB8fCBvVGltZXpvbmVUZXh0O1xuXHRcdGlmIChzVW5pdFRleHQpIHtcblx0XHRcdG9Qcm9wZXJ0eS52aXN1YWxTZXR0aW5ncyA9IGRlZXBFeHRlbmQob1Byb3BlcnR5LnZpc3VhbFNldHRpbmdzLCB7XG5cdFx0XHRcdHdpZHRoQ2FsY3VsYXRpb246IHtcblx0XHRcdFx0XHRnYXA6IE1hdGguY2VpbChUYWJsZVNpemVIZWxwZXIuZ2V0QnV0dG9uV2lkdGgoc1VuaXRUZXh0KSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmIChvVW5pdCkge1xuXHRcdFx0b1Byb3BlcnR5LnZpc3VhbFNldHRpbmdzID0gZGVlcEV4dGVuZChvUHJvcGVydHkudmlzdWFsU2V0dGluZ3MsIHtcblx0XHRcdFx0d2lkdGhDYWxjdWxhdGlvbjoge1xuXHRcdFx0XHRcdC8vIEZvciBwcm9wZXJ0aWVzIHdpdGggdW5pdCwgYSBnYXAgbmVlZHMgdG8gYmUgYWRkZWQgdG8gcHJvcGVybHkgcmVuZGVyIHRoZSBjb2x1bW4gd2lkdGggb24gZWRpdCBtb2RlXG5cdFx0XHRcdFx0Z2FwOiBvVGFibGVBUEkgJiYgb1RhYmxlQVBJLmdldFJlYWRPbmx5KCkgPyAwIDogNlxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0X2NvbXB1dGVMYWJlbDogZnVuY3Rpb24gKG9Qcm9wZXJ0eTogYW55LCBsYWJlbE1hcDogeyBbbGFiZWw6IHN0cmluZ106IGFueVtdIH0pIHtcblx0XHRjb25zdCBwcm9wZXJ0aWVzV2l0aFNhbWVMYWJlbCA9IGxhYmVsTWFwW29Qcm9wZXJ0eS5sYWJlbF07XG5cdFx0aWYgKHByb3BlcnRpZXNXaXRoU2FtZUxhYmVsPy5sZW5ndGggPiAxICYmIG9Qcm9wZXJ0eS5wYXRoPy5pbmNsdWRlcyhcIi9cIikpIHtcblx0XHRcdG9Qcm9wZXJ0eS5sYWJlbCA9IG9Qcm9wZXJ0eS5sYWJlbCArIFwiIChcIiArIG9Qcm9wZXJ0eS5hZGRpdGlvbmFsTGFiZWxzPy5qb2luKFwiIC8gXCIpICsgXCIpXCI7XG5cdFx0fVxuXHRcdGRlbGV0ZSBvUHJvcGVydHkuYWRkaXRpb25hbExhYmVscztcblx0fSxcblx0Ly9VcGRhdGUgVmlzdWFsU2V0dGluZyBmb3IgY29sdW1uV2lkdGggY2FsY3VsYXRpb24gYW5kIGxhYmVscyBvbiBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblx0X3VwZGF0ZVByb3BlcnR5SW5mbzogZnVuY3Rpb24gKG9UYWJsZTogVGFibGUsIGFQcm9wZXJ0aWVzOiBhbnkpIHtcblx0XHRjb25zdCBsYWJlbE1hcDogeyBbbGFiZWw6IHN0cmluZ106IGFueVtdIH0gPSB7fTtcblx0XHRhUHJvcGVydGllcy5mb3JFYWNoKChvUHJvcGVydHk6IGFueSkgPT4ge1xuXHRcdFx0aWYgKCFvUHJvcGVydHkucHJvcGVydHlJbmZvcykge1xuXHRcdFx0XHQvLyBPbmx5IGZvciBub24tY29tcGxleCBwcm9wZXJ0aWVzXG5cdFx0XHRcdGxhYmVsTWFwW29Qcm9wZXJ0eS5sYWJlbF0gPVxuXHRcdFx0XHRcdGxhYmVsTWFwW29Qcm9wZXJ0eS5sYWJlbF0gIT09IHVuZGVmaW5lZCA/IGxhYmVsTWFwW29Qcm9wZXJ0eS5sYWJlbF0uY29uY2F0KFtvUHJvcGVydHldKSA6IFtvUHJvcGVydHldO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGFQcm9wZXJ0aWVzLmZvckVhY2goKG9Qcm9wZXJ0eTogYW55KSA9PiB7XG5cdFx0XHR0aGlzLl9jb21wdXRlVmlzdWFsU2V0dGluZ3NGb3JGaWVsZEdyb3VwKG9UYWJsZSwgb1Byb3BlcnR5LCBhUHJvcGVydGllcyk7XG5cdFx0XHR0aGlzLl9jb21wdXRlVmlzdWFsU2V0dGluZ3NGb3JQcm9wZXJ0eVdpdGhWYWx1ZUhlbHAob1RhYmxlLCBvUHJvcGVydHkpO1xuXHRcdFx0Ly8gYmNwOiAyMjcwMDAzNTc3XG5cdFx0XHQvLyBTb21lIGNvbHVtbnMgKGVnOiBjdXN0b20gY29sdW1ucykgaGF2ZSBubyB0eXBlQ29uZmlnIHByb3BlcnR5LlxuXHRcdFx0Ly8gaW5pdGlhbGl6aW5nIGl0IHByZXZlbnRzIGFuIGV4Y2VwdGlvbiB0aHJvd1xuXHRcdFx0b1Byb3BlcnR5LnR5cGVDb25maWcgPSBkZWVwRXh0ZW5kKG9Qcm9wZXJ0eS50eXBlQ29uZmlnLCB7fSk7XG5cblx0XHRcdHRoaXMuX2NvbXB1dGVMYWJlbChvUHJvcGVydHksIGxhYmVsTWFwKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gYVByb3BlcnRpZXM7XG5cdH0sXG5cblx0Z2V0Q29sdW1uc0ZvcjogZnVuY3Rpb24gKG9UYWJsZTogYW55KSB7XG5cdFx0cmV0dXJuIG9UYWJsZS5nZXRQYXJlbnQoKS5nZXRUYWJsZURlZmluaXRpb24oKS5jb2x1bW5zO1xuXHR9LFxuXG5cdF9nZXRBZ2dyZWdhdGVkUHJvcGVydHlNYXA6IGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdHJldHVybiBvVGFibGUuZ2V0UGFyZW50KCkuZ2V0VGFibGVEZWZpbml0aW9uKCkuYWdncmVnYXRlcztcblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZXhwb3J0IGNhcGFiaWxpdGllcyBmb3IgdGhlIGdpdmVuIHNhcC51aS5tZGMuVGFibGUgaW5zdGFuY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBvVGFibGUgSW5zdGFuY2Ugb2YgdGhlIHRhYmxlXG5cdCAqIEByZXR1cm5zIFByb21pc2UgcmVwcmVzZW50aW5nIHRoZSBleHBvcnQgY2FwYWJpbGl0aWVzIG9mIHRoZSB0YWJsZSBpbnN0YW5jZVxuXHQgKi9cblx0ZmV0Y2hFeHBvcnRDYXBhYmlsaXRpZXM6IGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdGNvbnN0IG9DYXBhYmlsaXRpZXM6IGFueSA9IHsgXCJYTFNYXCI6IHt9IH07XG5cdFx0bGV0IG9Nb2RlbCE6IGFueTtcblx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLmZldGNoTW9kZWwob1RhYmxlKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKG1vZGVsOiBhbnkpIHtcblx0XHRcdFx0b01vZGVsID0gbW9kZWw7XG5cdFx0XHRcdHJldHVybiBvTW9kZWwuZ2V0TWV0YU1vZGVsKCkuZ2V0T2JqZWN0KFwiLyRFbnRpdHlDb250YWluZXJAT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TdXBwb3J0ZWRGb3JtYXRzXCIpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChhU3VwcG9ydGVkRm9ybWF0czogc3RyaW5nW10gfCB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uc3QgYUxvd2VyRm9ybWF0cyA9IChhU3VwcG9ydGVkRm9ybWF0cyB8fCBbXSkubWFwKChlbGVtZW50KSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChhTG93ZXJGb3JtYXRzLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9wZGZcIikgPiAtMSkge1xuXHRcdFx0XHRcdHJldHVybiBvTW9kZWwuZ2V0TWV0YU1vZGVsKCkuZ2V0T2JqZWN0KFwiLyRFbnRpdHlDb250YWluZXJAY29tLnNhcC52b2NhYnVsYXJpZXMuUERGLnYxLkZlYXR1cmVzXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKG9Bbm5vdGF0aW9uOiBhbnkpIHtcblx0XHRcdFx0aWYgKG9Bbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0b0NhcGFiaWxpdGllc1tcIlBERlwiXSA9IE9iamVjdC5hc3NpZ24oe30sIG9Bbm5vdGF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKGBBbiBlcnJvciBvY2N1cnMgd2hpbGUgY29tcHV0aW5nIGV4cG9ydCBjYXBhYmlsaXRpZXM6ICR7ZXJyfWApO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIG9DYXBhYmlsaXRpZXM7XG5cdFx0XHR9KTtcblx0fSxcblxuXHRfaXNGaWx0ZXJhYmxlTmF2aWdhdGlvblByb3BlcnR5OiBmdW5jdGlvbiAob0NvbHVtbkluZm86IGFueSwgb01ldGFNb2RlbDogYW55KSB7XG5cdFx0Ly8gVGVtcG9yYXJ5IGxvZ2ljIHRvIG9ubHkgYWxsb3cgZmlsdGVyaW5nIG9uIG5hdmlnYXRpb24gcHJvcGVydGllcyB3aGVuIHRoZXkncmUgcGFydCBvZiBhIGxpbmUgaXRlbSBhbmQgb25seSAxOjEgcHJvcGVydGllc1xuXHRcdGNvbnN0IHByb3BlcnR5ID0gb01ldGFNb2RlbC5nZXRPYmplY3Qob0NvbHVtbkluZm8uYW5ub3RhdGlvblBhdGguc2xpY2UoMCwgb0NvbHVtbkluZm8uYW5ub3RhdGlvblBhdGgubGFzdEluZGV4T2YoXCIvXCIpKSk7XG5cdFx0cmV0dXJuICFvQ29sdW1uSW5mby5yZWxhdGl2ZVBhdGguaW5jbHVkZXMoXCIvXCIpIHx8IChvQ29sdW1uSW5mby5pc1BhcnRPZkxpbmVJdGVtID09PSB0cnVlICYmIHByb3BlcnR5ICYmICFwcm9wZXJ0eS4kaXNDb2xsZWN0aW9uKTtcblx0fSxcblxuXHRfZmV0Y2hQcm9wZXJ0eUluZm86IGZ1bmN0aW9uIChvTWV0YU1vZGVsOiBhbnksIG9Db2x1bW5JbmZvOiBhbnksIG9UYWJsZTogYW55LCBvQXBwQ29tcG9uZW50OiBhbnksIGJVc2VBZGRpdGlvbmFsUHJvcGVydGllczogYW55KSB7XG5cdFx0Y29uc3Qgc0Fic29sdXRlTmF2aWdhdGlvblBhdGggPSBvQ29sdW1uSW5mby5hbm5vdGF0aW9uUGF0aCxcblx0XHRcdG9EYXRhRmllbGQgPSBvTWV0YU1vZGVsLmdldE9iamVjdChzQWJzb2x1dGVOYXZpZ2F0aW9uUGF0aCksXG5cdFx0XHRvTmF2aWdhdGlvbkNvbnRleHQgPSBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNBYnNvbHV0ZU5hdmlnYXRpb25QYXRoKSxcblx0XHRcdG9UeXBlQ29uZmlnID1cblx0XHRcdFx0b0NvbHVtbkluZm8udHlwZUNvbmZpZyAmJlxuXHRcdFx0XHRvQ29sdW1uSW5mby50eXBlQ29uZmlnLmNsYXNzTmFtZSAmJlxuXHRcdFx0XHREZWxlZ2F0ZVV0aWwuaXNUeXBlRmlsdGVyYWJsZShvQ29sdW1uSW5mby50eXBlQ29uZmlnLmNsYXNzTmFtZSlcblx0XHRcdFx0XHQ/IFR5cGVVdGlsLmdldFR5cGVDb25maWcoXG5cdFx0XHRcdFx0XHRcdG9Db2x1bW5JbmZvLnR5cGVDb25maWcuY2xhc3NOYW1lLFxuXHRcdFx0XHRcdFx0XHRvQ29sdW1uSW5mby50eXBlQ29uZmlnLm9Gb3JtYXRPcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRvQ29sdW1uSW5mby50eXBlQ29uZmlnLm9Db25zdHJhaW50c1xuXHRcdFx0XHRcdCAgKVxuXHRcdFx0XHRcdDoge30sXG5cdFx0XHRiRmlsdGVyYWJsZSA9IENvbW1vbkhlbHBlci5pc1Byb3BlcnR5RmlsdGVyYWJsZShvQ29sdW1uSW5mby5yZWxhdGl2ZVBhdGgsIHsgY29udGV4dDogb05hdmlnYXRpb25Db250ZXh0IH0sIG9EYXRhRmllbGQpLFxuXHRcdFx0YkNvbXBsZXhUeXBlID0gb0NvbHVtbkluZm8udHlwZUNvbmZpZyAmJiBvQ29sdW1uSW5mby50eXBlQ29uZmlnLmNsYXNzTmFtZS5pbmRleE9mKFwiRWRtLlwiKSAhPT0gMCxcblx0XHRcdGJJc0FuYWx5dGljYWxUYWJsZSA9IERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJlbmFibGVBbmFseXRpY3NcIikgPT09IFwidHJ1ZVwiLFxuXHRcdFx0YUFnZ3JlZ2F0ZWRQcm9wZXJ0eU1hcFVuZmlsdGVyYWJsZSA9IGJJc0FuYWx5dGljYWxUYWJsZSA/IHRoaXMuX2dldEFnZ3JlZ2F0ZWRQcm9wZXJ0eU1hcChvVGFibGUpIDoge30sXG5cdFx0XHRvRXhwb3J0U2V0dGluZ3MgPSBvQ29sdW1uSW5mby5leHBvcnRTZXR0aW5ncyxcblx0XHRcdGV4cG9ydEZvcm1hdCA9XG5cdFx0XHRcdG9Db2x1bW5JbmZvLnR5cGVDb25maWcgJiYgb0NvbHVtbkluZm8udHlwZUNvbmZpZy5jbGFzc05hbWVcblx0XHRcdFx0XHQ/IHRoaXMuX2dldEV4cG9ydEZvcm1hdChvQ29sdW1uSW5mby50eXBlQ29uZmlnLmNsYXNzTmFtZSlcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBzTGFiZWwgPSBvQ29sdW1uSW5mby5pc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eVxuXHRcdFx0PyBSZXNvdXJjZU1vZGVsLmdldFRleHQoXCJUYXJnZXRWYWx1ZVwiKVxuXHRcdFx0OiBEZWxlZ2F0ZVV0aWwuZ2V0TG9jYWxpemVkVGV4dChvQ29sdW1uSW5mby5sYWJlbCwgb0FwcENvbXBvbmVudCB8fCBvVGFibGUpO1xuXG5cdFx0aWYgKG9FeHBvcnRTZXR0aW5ncykge1xuXHRcdFx0aWYgKGV4cG9ydEZvcm1hdCAmJiAhb0V4cG9ydFNldHRpbmdzLnRpbWV6b25lUHJvcGVydHkpIHtcblx0XHRcdFx0b0V4cG9ydFNldHRpbmdzLmZvcm1hdCA9IGV4cG9ydEZvcm1hdDtcblx0XHRcdH1cblx0XHRcdC8vIFNldCB0aGUgZXhwb3J0U2V0dGluZ3MgdGVtcGxhdGUgb25seSBpZiBpdCBleGlzdHMuXG5cdFx0XHRpZiAob0V4cG9ydFNldHRpbmdzLnRlbXBsYXRlKSB7XG5cdFx0XHRcdG9FeHBvcnRTZXR0aW5ncy50ZW1wbGF0ZSA9IG9Db2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLnRlbXBsYXRlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IG9Qcm9wZXJ0eUluZm86IGFueSA9IHtcblx0XHRcdG5hbWU6IG9Db2x1bW5JbmZvLm5hbWUsXG5cdFx0XHRtZXRhZGF0YVBhdGg6IHNBYnNvbHV0ZU5hdmlnYXRpb25QYXRoLFxuXHRcdFx0Z3JvdXBMYWJlbDogb0NvbHVtbkluZm8uZ3JvdXBMYWJlbCxcblx0XHRcdGdyb3VwOiBvQ29sdW1uSW5mby5ncm91cCxcblx0XHRcdGxhYmVsOiBzTGFiZWwsXG5cdFx0XHR0b29sdGlwOiBvQ29sdW1uSW5mby50b29sdGlwLFxuXHRcdFx0dHlwZUNvbmZpZzogb1R5cGVDb25maWcsXG5cdFx0XHR2aXNpYmxlOiBvQ29sdW1uSW5mby5hdmFpbGFiaWxpdHkgIT09IFwiSGlkZGVuXCIgJiYgIWJDb21wbGV4VHlwZSxcblx0XHRcdGV4cG9ydFNldHRpbmdzOiBvRXhwb3J0U2V0dGluZ3MsXG5cdFx0XHR1bml0OiBvQ29sdW1uSW5mby51bml0XG5cdFx0fTtcblxuXHRcdC8vIFNldCB2aXN1YWxTZXR0aW5ncyBvbmx5IGlmIGl0IGV4aXN0c1xuXHRcdGlmIChvQ29sdW1uSW5mby52aXN1YWxTZXR0aW5ncyAmJiBPYmplY3Qua2V5cyhvQ29sdW1uSW5mby52aXN1YWxTZXR0aW5ncykubGVuZ3RoID4gMCkge1xuXHRcdFx0b1Byb3BlcnR5SW5mby52aXN1YWxTZXR0aW5ncyA9IG9Db2x1bW5JbmZvLnZpc3VhbFNldHRpbmdzO1xuXHRcdH1cblx0XHRpZiAoZXhwb3J0Rm9ybWF0KSB7XG5cdFx0XHRjb25zdCBvVGFibGVBUEkgPSBvVGFibGUgPyBvVGFibGUuZ2V0UGFyZW50KCkgOiBudWxsO1xuXHRcdFx0Ly8gRm9yIHByb3BlcnRpZXMgd2l0aCBkYXRlL3RpbWUvZGF0ZVRpbWUgZGF0YSB0eXBlcywgYSBnYXAgbmVlZHMgdG8gYmUgYWRkZWQgdG8gcHJvcGVybHkgcmVuZGVyIHRoZSBjb2x1bW4gd2lkdGggb24gZWRpdCBtb2RlXG5cdFx0XHRvUHJvcGVydHlJbmZvLnZpc3VhbFNldHRpbmdzID0ge1xuXHRcdFx0XHR3aWR0aENhbGN1bGF0aW9uOiB7XG5cdFx0XHRcdFx0Ly8gYSBnYXAgb2YgMSBpcyBzdGlsbCBuZWVkZWQgYmVjYXVzZSBvZiB0aGUgcGFkZGluZyBvZiB0aGUgY2VsbFxuXHRcdFx0XHRcdC8vIEJDUDogMjE4MDQxMzQzMVxuXHRcdFx0XHRcdGdhcDogb1RhYmxlQVBJICYmIG9UYWJsZUFQSS5nZXRSZWFkT25seSgpID8gMSA6IDEuNVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIE1EQyBleHBlY3RzICAncHJvcGVydHlJbmZvcycgb25seSBmb3IgY29tcGxleCBwcm9wZXJ0aWVzLlxuXHRcdC8vIEFuIGVtcHR5IGFycmF5IHRocm93cyB2YWxpZGF0aW9uIGVycm9yIGFuZCB1bmRlZmluZWQgdmFsdWUgaXMgdW5oYW5kbGVkLlxuXHRcdGlmIChvQ29sdW1uSW5mby5wcm9wZXJ0eUluZm9zICYmIG9Db2x1bW5JbmZvLnByb3BlcnR5SW5mb3MubGVuZ3RoKSB7XG5cdFx0XHRvUHJvcGVydHlJbmZvLnByb3BlcnR5SW5mb3MgPSBvQ29sdW1uSW5mby5wcm9wZXJ0eUluZm9zO1xuXHRcdFx0Ly9vbmx5IGluIGNhc2Ugb2YgY29tcGxleCBwcm9wZXJ0aWVzLCB3cmFwIHRoZSBjZWxsIGNvbnRlbnRcdG9uIHRoZSBleGNlbCBleHBvcnRlZCBmaWxlXG5cdFx0XHRvUHJvcGVydHlJbmZvLmV4cG9ydFNldHRpbmdzLndyYXAgPSBvQ29sdW1uSW5mby5leHBvcnRTZXR0aW5ncy53cmFwO1xuXHRcdFx0aWYgKGJVc2VBZGRpdGlvbmFsUHJvcGVydGllcyAmJiBvQ29sdW1uSW5mby5hZGRpdGlvbmFsUHJvcGVydHlJbmZvcyAmJiBvQ29sdW1uSW5mby5hZGRpdGlvbmFsUHJvcGVydHlJbmZvcy5sZW5ndGgpIHtcblx0XHRcdFx0b1Byb3BlcnR5SW5mby5wcm9wZXJ0eUluZm9zID0gb1Byb3BlcnR5SW5mby5wcm9wZXJ0eUluZm9zLmNvbmNhdChvQ29sdW1uSW5mby5hZGRpdGlvbmFsUHJvcGVydHlJbmZvcyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEFkZCBwcm9wZXJ0aWVzIHdoaWNoIGFyZSBzdXBwb3J0ZWQgb25seSBieSBzaW1wbGUgUHJvcGVydHlJbmZvcy5cblx0XHRcdG9Qcm9wZXJ0eUluZm8ucGF0aCA9IG9Db2x1bW5JbmZvLnJlbGF0aXZlUGF0aDtcblx0XHRcdC8vIFRPRE8gd2l0aCB0aGUgbmV3IGNvbXBsZXggcHJvcGVydHkgaW5mbywgYSBsb3Qgb2YgXCJEZXNjcmlwdGlvblwiIGZpZWxkcyBhcmUgYWRkZWQgYXMgZmlsdGVyL3NvcnQgZmllbGRzXG5cdFx0XHRvUHJvcGVydHlJbmZvLnNvcnRhYmxlID0gb0NvbHVtbkluZm8uc29ydGFibGU7XG5cdFx0XHRvUHJvcGVydHlJbmZvLmZpbHRlcmFibGUgPVxuXHRcdFx0XHQhb0NvbHVtbkluZm8uaXNEYXRhUG9pbnRGYWtlVGFyZ2V0UHJvcGVydHkgJiZcblx0XHRcdFx0YkZpbHRlcmFibGUgJiZcblx0XHRcdFx0dGhpcy5faXNGaWx0ZXJhYmxlTmF2aWdhdGlvblByb3BlcnR5KG9Db2x1bW5JbmZvLCBvTWV0YU1vZGVsKSAmJlxuXHRcdFx0XHQvLyBUT0RPIGlnbm9yaW5nIGFsbCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBhbHNvIGF2YWlsYWJsZSBmb3IgYWRhcHRhdGlvbiBmb3Igbm93LCBidXQgcHJvcGVyIGNvbmNlcHQgcmVxdWlyZWRcblx0XHRcdFx0KCFiSXNBbmFseXRpY2FsVGFibGUgfHwgIWFBZ2dyZWdhdGVkUHJvcGVydHlNYXBVbmZpbHRlcmFibGVbb1Byb3BlcnR5SW5mby5uYW1lXSk7XG5cdFx0XHRvUHJvcGVydHlJbmZvLmtleSA9IG9Db2x1bW5JbmZvLmlzS2V5O1xuXHRcdFx0b1Byb3BlcnR5SW5mby5ncm91cGFibGUgPSBvQ29sdW1uSW5mby5pc0dyb3VwYWJsZTtcblx0XHRcdGlmIChvQ29sdW1uSW5mby50ZXh0QXJyYW5nZW1lbnQpIHtcblx0XHRcdFx0Y29uc3Qgb0Rlc2NyaXB0aW9uQ29sdW1uID0gdGhpcy5nZXRDb2x1bW5zRm9yKG9UYWJsZSkuZmluZChmdW5jdGlvbiAob0NvbDogYW55KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9Db2wubmFtZSA9PT0gb0NvbHVtbkluZm8udGV4dEFycmFuZ2VtZW50LnRleHRQcm9wZXJ0eTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChvRGVzY3JpcHRpb25Db2x1bW4pIHtcblx0XHRcdFx0XHRvUHJvcGVydHlJbmZvLm1vZGUgPSBvQ29sdW1uSW5mby50ZXh0QXJyYW5nZW1lbnQubW9kZTtcblx0XHRcdFx0XHRvUHJvcGVydHlJbmZvLnZhbHVlUHJvcGVydHkgPSBvQ29sdW1uSW5mby5yZWxhdGl2ZVBhdGg7XG5cdFx0XHRcdFx0b1Byb3BlcnR5SW5mby5kZXNjcmlwdGlvblByb3BlcnR5ID0gb0Rlc2NyaXB0aW9uQ29sdW1uLnJlbGF0aXZlUGF0aDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0b1Byb3BlcnR5SW5mby50ZXh0ID0gb0NvbHVtbkluZm8udGV4dEFycmFuZ2VtZW50ICYmIG9Db2x1bW5JbmZvLnRleHRBcnJhbmdlbWVudC50ZXh0UHJvcGVydHk7XG5cdFx0XHRvUHJvcGVydHlJbmZvLmNhc2VTZW5zaXRpdmUgPSBvQ29sdW1uSW5mby5jYXNlU2Vuc2l0aXZlO1xuXHRcdFx0aWYgKG9Db2x1bW5JbmZvLmFkZGl0aW9uYWxMYWJlbHMpIHtcblx0XHRcdFx0b1Byb3BlcnR5SW5mby5hZGRpdGlvbmFsTGFiZWxzID0gb0NvbHVtbkluZm8uYWRkaXRpb25hbExhYmVscy5tYXAoKGxhYmVsOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLmdldExvY2FsaXplZFRleHQobGFiZWwsIG9BcHBDb21wb25lbnQgfHwgb1RhYmxlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fY29tcHV0ZVZpc3VhbFNldHRpbmdzRm9yUHJvcGVydHlXaXRoVW5pdChcblx0XHRcdG9UYWJsZSxcblx0XHRcdG9Qcm9wZXJ0eUluZm8sXG5cdFx0XHRvQ29sdW1uSW5mby51bml0LFxuXHRcdFx0b0NvbHVtbkluZm8udW5pdFRleHQsXG5cdFx0XHRvQ29sdW1uSW5mby50aW1lem9uZVRleHRcblx0XHQpO1xuXG5cdFx0cmV0dXJuIG9Qcm9wZXJ0eUluZm87XG5cdH0sXG5cblx0X2ZldGNoQ3VzdG9tUHJvcGVydHlJbmZvOiBmdW5jdGlvbiAob0NvbHVtbkluZm86IGFueSwgb1RhYmxlOiBhbnksIG9BcHBDb21wb25lbnQ6IGFueSkge1xuXHRcdGNvbnN0IHNMYWJlbCA9IERlbGVnYXRlVXRpbC5nZXRMb2NhbGl6ZWRUZXh0KG9Db2x1bW5JbmZvLmhlYWRlciwgb0FwcENvbXBvbmVudCB8fCBvVGFibGUpOyAvLyBUb2RvOiBUbyBiZSByZW1vdmVkIG9uY2UgTURDIHByb3ZpZGVzIHRyYW5zbGF0aW9uIHN1cHBvcnRcblx0XHRjb25zdCBvUHJvcGVydHlJbmZvOiBhbnkgPSB7XG5cdFx0XHRuYW1lOiBvQ29sdW1uSW5mby5uYW1lLFxuXHRcdFx0Z3JvdXBMYWJlbDogbnVsbCxcblx0XHRcdGdyb3VwOiBudWxsLFxuXHRcdFx0bGFiZWw6IHNMYWJlbCxcblx0XHRcdHR5cGU6IFwiRWRtLlN0cmluZ1wiLCAvLyBUQkRcblx0XHRcdHZpc2libGU6IG9Db2x1bW5JbmZvLmF2YWlsYWJpbGl0eSAhPT0gXCJIaWRkZW5cIixcblx0XHRcdGV4cG9ydFNldHRpbmdzOiBvQ29sdW1uSW5mby5leHBvcnRTZXR0aW5ncyxcblx0XHRcdHZpc3VhbFNldHRpbmdzOiBvQ29sdW1uSW5mby52aXN1YWxTZXR0aW5nc1xuXHRcdH07XG5cblx0XHQvLyBNREMgZXhwZWN0cyAncHJvcGVydHlJbmZvcycgb25seSBmb3IgY29tcGxleCBwcm9wZXJ0aWVzLlxuXHRcdC8vIEFuIGVtcHR5IGFycmF5IHRocm93cyB2YWxpZGF0aW9uIGVycm9yIGFuZCB1bmRlZmluZWQgdmFsdWUgaXMgdW5oYW5kbGVkLlxuXHRcdGlmIChvQ29sdW1uSW5mby5wcm9wZXJ0eUluZm9zICYmIG9Db2x1bW5JbmZvLnByb3BlcnR5SW5mb3MubGVuZ3RoKSB7XG5cdFx0XHRvUHJvcGVydHlJbmZvLnByb3BlcnR5SW5mb3MgPSBvQ29sdW1uSW5mby5wcm9wZXJ0eUluZm9zO1xuXHRcdFx0Ly9vbmx5IGluIGNhc2Ugb2YgY29tcGxleCBwcm9wZXJ0aWVzLCB3cmFwIHRoZSBjZWxsIGNvbnRlbnQgb24gdGhlIGV4Y2VsIGV4cG9ydGVkIGZpbGVcblx0XHRcdG9Qcm9wZXJ0eUluZm8uZXhwb3J0U2V0dGluZ3MgPSB7XG5cdFx0XHRcdHdyYXA6IG9Db2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLndyYXAsXG5cdFx0XHRcdHRlbXBsYXRlOiBvQ29sdW1uSW5mby5leHBvcnRTZXR0aW5ncy50ZW1wbGF0ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gQWRkIHByb3BlcnRpZXMgd2hpY2ggYXJlIHN1cHBvcnRlZCBvbmx5IGJ5IHNpbXBsZSBQcm9wZXJ0eUluZm9zLlxuXHRcdFx0b1Byb3BlcnR5SW5mby5wYXRoID0gb0NvbHVtbkluZm8ubmFtZTtcblx0XHRcdG9Qcm9wZXJ0eUluZm8uc29ydGFibGUgPSBmYWxzZTtcblx0XHRcdG9Qcm9wZXJ0eUluZm8uZmlsdGVyYWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gb1Byb3BlcnR5SW5mbztcblx0fSxcblx0X2JDb2x1bW5IYXNQcm9wZXJ0eVdpdGhEcmFmdEluZGljYXRvcjogZnVuY3Rpb24gKG9Db2x1bW5JbmZvOiBhbnkpIHtcblx0XHRyZXR1cm4gISEoXG5cdFx0XHQob0NvbHVtbkluZm8uZm9ybWF0T3B0aW9ucyAmJiBvQ29sdW1uSW5mby5mb3JtYXRPcHRpb25zLmhhc0RyYWZ0SW5kaWNhdG9yKSB8fFxuXHRcdFx0KG9Db2x1bW5JbmZvLmZvcm1hdE9wdGlvbnMgJiYgb0NvbHVtbkluZm8uZm9ybWF0T3B0aW9ucy5maWVsZEdyb3VwRHJhZnRJbmRpY2F0b3JQcm9wZXJ0eVBhdGgpXG5cdFx0KTtcblx0fSxcblx0X3VwZGF0ZURyYWZ0SW5kaWNhdG9yTW9kZWw6IGZ1bmN0aW9uIChfb1RhYmxlOiBhbnksIF9vQ29sdW1uSW5mbzogYW55KSB7XG5cdFx0Y29uc3QgYVZpc2libGVDb2x1bW5zID0gX29UYWJsZS5nZXRDb2x1bW5zKCk7XG5cdFx0Y29uc3Qgb0ludGVybmFsQmluZGluZ0NvbnRleHQgPSBfb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cdFx0Y29uc3Qgc0ludGVybmFsUGF0aCA9IG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0ICYmIG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0LmdldFBhdGgoKTtcblx0XHRpZiAoYVZpc2libGVDb2x1bW5zICYmIG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0KSB7XG5cdFx0XHRmb3IgKGNvbnN0IGluZGV4IGluIGFWaXNpYmxlQ29sdW1ucykge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5fYkNvbHVtbkhhc1Byb3BlcnR5V2l0aERyYWZ0SW5kaWNhdG9yKF9vQ29sdW1uSW5mbykgJiZcblx0XHRcdFx0XHRfb0NvbHVtbkluZm8ubmFtZSA9PT0gYVZpc2libGVDb2x1bW5zW2luZGV4XS5nZXREYXRhUHJvcGVydHkoKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRpZiAob0ludGVybmFsQmluZGluZ0NvbnRleHQuZ2V0UHJvcGVydHkoc0ludGVybmFsUGF0aCArIFNFTUFOVElDS0VZX0hBU19EUkFGVElORElDQVRPUikgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0b0ludGVybmFsQmluZGluZ0NvbnRleHQuc2V0UHJvcGVydHkoc0ludGVybmFsUGF0aCArIFNFTUFOVElDS0VZX0hBU19EUkFGVElORElDQVRPUiwgX29Db2x1bW5JbmZvLm5hbWUpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRfZmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5OiBmdW5jdGlvbiAoXG5cdFx0b1RhYmxlOiBhbnksXG5cdFx0c0VudGl0eVR5cGVQYXRoOiBhbnksXG5cdFx0b01ldGFNb2RlbDogYW55LFxuXHRcdG9BcHBDb21wb25lbnQ6IGFueSxcblx0XHRiVXNlQWRkaXRpb25hbFByb3BlcnRpZXM6IGFueVxuXHQpIHtcblx0XHQvLyB3aGVuIGZldGNoaW5nIHByb3BlcnRpZXMsIHRoaXMgYmluZGluZyBjb250ZXh0IGlzIG5lZWRlZCAtIHNvIGxldHMgY3JlYXRlIGl0IG9ubHkgb25jZSBhbmQgdXNlIGlmIGZvciBhbGwgcHJvcGVydGllcy9kYXRhLWZpZWxkcy9saW5lLWl0ZW1zXG5cdFx0Y29uc3Qgc0JpbmRpbmdQYXRoID0gTW9kZWxIZWxwZXIuZ2V0RW50aXR5U2V0UGF0aChzRW50aXR5VHlwZVBhdGgpO1xuXHRcdGxldCBhRmV0Y2hlZFByb3BlcnRpZXM6IGFueVtdID0gW107XG5cdFx0Y29uc3Qgb0ZSID0gQ29tbW9uVXRpbHMuZ2V0RmlsdGVyUmVzdHJpY3Rpb25zQnlQYXRoKHNCaW5kaW5nUGF0aCwgb01ldGFNb2RlbCk7XG5cdFx0Y29uc3QgYU5vbkZpbHRlcmFibGVQcm9wcyA9IG9GUltGaWx0ZXJSZXN0cmljdGlvbnMuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFU107XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmdldENvbHVtbnNGb3Iob1RhYmxlKSlcblx0XHRcdC50aGVuKChhQ29sdW1uczogYW55KSA9PiB7XG5cdFx0XHRcdC8vIERyYWZ0QWRtaW5pc3RyYXRpdmVEYXRhIGRvZXMgbm90IHdvcmsgdmlhICdlbnRpdHlTZXQvJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcvRHJhZnRBZG1pbmlzdHJhdGl2ZURhdGEnXG5cdFx0XHRcdGlmIChhQ29sdW1ucykge1xuXHRcdFx0XHRcdGxldCBvUHJvcGVydHlJbmZvO1xuXHRcdFx0XHRcdGFDb2x1bW5zLmZvckVhY2goKG9Db2x1bW5JbmZvOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuX3VwZGF0ZURyYWZ0SW5kaWNhdG9yTW9kZWwob1RhYmxlLCBvQ29sdW1uSW5mbyk7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKG9Db2x1bW5JbmZvLnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSBcIkFubm90YXRpb25cIjpcblx0XHRcdFx0XHRcdFx0XHRvUHJvcGVydHlJbmZvID0gdGhpcy5fZmV0Y2hQcm9wZXJ0eUluZm8oXG5cdFx0XHRcdFx0XHRcdFx0XHRvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcdFx0b0NvbHVtbkluZm8sXG5cdFx0XHRcdFx0XHRcdFx0XHRvVGFibGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRvQXBwQ29tcG9uZW50LFxuXHRcdFx0XHRcdFx0XHRcdFx0YlVzZUFkZGl0aW9uYWxQcm9wZXJ0aWVzXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRpZiAob1Byb3BlcnR5SW5mbyAmJiBhTm9uRmlsdGVyYWJsZVByb3BzLmluZGV4T2Yob1Byb3BlcnR5SW5mby5uYW1lKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9Qcm9wZXJ0eUluZm8ubWF4Q29uZGl0aW9ucyA9IERlbGVnYXRlVXRpbC5pc011bHRpVmFsdWUob1Byb3BlcnR5SW5mbykgPyAtMSA6IDE7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIFwiU2xvdFwiOlxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiRGVmYXVsdFwiOlxuXHRcdFx0XHRcdFx0XHRcdG9Qcm9wZXJ0eUluZm8gPSB0aGlzLl9mZXRjaEN1c3RvbVByb3BlcnR5SW5mbyhvQ29sdW1uSW5mbywgb1RhYmxlLCBvQXBwQ29tcG9uZW50KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBzd2l0Y2ggY2FzZSAke29Db2x1bW5JbmZvLnR5cGV9YCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRhRmV0Y2hlZFByb3BlcnRpZXMucHVzaChvUHJvcGVydHlJbmZvKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0YUZldGNoZWRQcm9wZXJ0aWVzID0gdGhpcy5fdXBkYXRlUHJvcGVydHlJbmZvKG9UYWJsZSwgYUZldGNoZWRQcm9wZXJ0aWVzKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihgQW4gZXJyb3Igb2NjdXJzIHdoaWxlIHVwZGF0aW5nIGZldGNoZWQgcHJvcGVydGllczogJHtlcnJ9YCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gYUZldGNoZWRQcm9wZXJ0aWVzO1xuXHRcdFx0fSk7XG5cdH0sXG5cblx0X2dldENhY2hlZE9yRmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5OiBmdW5jdGlvbiAoXG5cdFx0b1RhYmxlOiBhbnksXG5cdFx0c0VudGl0eVR5cGVQYXRoOiBhbnksXG5cdFx0b01ldGFNb2RlbDogYW55LFxuXHRcdG9BcHBDb21wb25lbnQ/OiBhbnksXG5cdFx0YlVzZUFkZGl0aW9uYWxQcm9wZXJ0aWVzPzogYW55XG5cdCkge1xuXHRcdGNvbnN0IGFGZXRjaGVkUHJvcGVydGllcyA9IF9nZXRDYWNoZWRQcm9wZXJ0aWVzKG9UYWJsZSwgYlVzZUFkZGl0aW9uYWxQcm9wZXJ0aWVzKTtcblxuXHRcdGlmIChhRmV0Y2hlZFByb3BlcnRpZXMpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYUZldGNoZWRQcm9wZXJ0aWVzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2ZldGNoUHJvcGVydGllc0ZvckVudGl0eShvVGFibGUsIHNFbnRpdHlUeXBlUGF0aCwgb01ldGFNb2RlbCwgb0FwcENvbXBvbmVudCwgYlVzZUFkZGl0aW9uYWxQcm9wZXJ0aWVzKS50aGVuKGZ1bmN0aW9uIChcblx0XHRcdGFTdWJGZXRjaGVkUHJvcGVydGllczogYW55W11cblx0XHQpIHtcblx0XHRcdF9zZXRDYWNoZWRQcm9wZXJ0aWVzKG9UYWJsZSwgYVN1YkZldGNoZWRQcm9wZXJ0aWVzLCBiVXNlQWRkaXRpb25hbFByb3BlcnRpZXMpO1xuXHRcdFx0cmV0dXJuIGFTdWJGZXRjaGVkUHJvcGVydGllcztcblx0XHR9KTtcblx0fSxcblxuXHRfc2V0VGFibGVOb0RhdGFUZXh0OiBmdW5jdGlvbiAob1RhYmxlOiBhbnksIG9CaW5kaW5nSW5mbzogYW55KSB7XG5cdFx0bGV0IHNOb0RhdGFLZXkgPSBcIlwiO1xuXHRcdGNvbnN0IG9UYWJsZUZpbHRlckluZm8gPSBUYWJsZVV0aWxzLmdldEFsbEZpbHRlckluZm8ob1RhYmxlKSxcblx0XHRcdHN1ZmZpeFJlc291cmNlS2V5ID0gb0JpbmRpbmdJbmZvLnBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBvQmluZGluZ0luZm8ucGF0aC5zdWJzdHIoMSkgOiBvQmluZGluZ0luZm8ucGF0aDtcblxuXHRcdGNvbnN0IF9nZXROb0RhdGFUZXh0V2l0aEZpbHRlcnMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAob1RhYmxlLmRhdGEoXCJoaWRkZW5GaWx0ZXJzXCIpIHx8IG9UYWJsZS5kYXRhKFwicXVpY2tGaWx0ZXJLZXlcIikpIHtcblx0XHRcdFx0cmV0dXJuIFwiTV9UQUJMRV9BTkRfQ0hBUlRfTk9fREFUQV9URVhUX01VTFRJX1ZJRVdcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBcIlRfVEFCTEVfQU5EX0NIQVJUX05PX0RBVEFfVEVYVF9XSVRIX0ZJTFRFUlwiO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3Qgc0ZpbHRlckFzc29jaWF0aW9uID0gb1RhYmxlLmdldEZpbHRlcigpO1xuXG5cdFx0aWYgKHNGaWx0ZXJBc3NvY2lhdGlvbiAmJiAhL0Jhc2ljU2VhcmNoJC8udGVzdChzRmlsdGVyQXNzb2NpYXRpb24pKSB7XG5cdFx0XHQvLyBjaGVjayBpZiBhIEZpbHRlckJhciBpcyBhc3NvY2lhdGVkIHRvIHRoZSBUYWJsZSAoYmFzaWMgc2VhcmNoIG9uIHRvb2xCYXIgaXMgZXhjbHVkZWQpXG5cdFx0XHRpZiAob1RhYmxlRmlsdGVySW5mby5zZWFyY2ggfHwgKG9UYWJsZUZpbHRlckluZm8uZmlsdGVycyAmJiBvVGFibGVGaWx0ZXJJbmZvLmZpbHRlcnMubGVuZ3RoKSkge1xuXHRcdFx0XHQvLyBjaGVjayBpZiB0YWJsZSBoYXMgYW55IEZpbHRlcmJhciBmaWx0ZXJzIG9yIHBlcnNvbmFsaXphdGlvbiBmaWx0ZXJzXG5cdFx0XHRcdHNOb0RhdGFLZXkgPSBfZ2V0Tm9EYXRhVGV4dFdpdGhGaWx0ZXJzKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzTm9EYXRhS2V5ID0gXCJUX1RBQkxFX0FORF9DSEFSVF9OT19EQVRBX1RFWFRcIjtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9UYWJsZUZpbHRlckluZm8uc2VhcmNoIHx8IChvVGFibGVGaWx0ZXJJbmZvLmZpbHRlcnMgJiYgb1RhYmxlRmlsdGVySW5mby5maWx0ZXJzLmxlbmd0aCkpIHtcblx0XHRcdC8vY2hlY2sgaWYgdGFibGUgaGFzIGFueSBwZXJzb25hbGl6YXRpb24gZmlsdGVyc1xuXHRcdFx0c05vRGF0YUtleSA9IF9nZXROb0RhdGFUZXh0V2l0aEZpbHRlcnMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c05vRGF0YUtleSA9IFwiTV9UQUJMRV9BTkRfQ0hBUlRfTk9fRklMVEVSU19OT19EQVRBX1RFWFRcIjtcblx0XHR9XG5cdFx0cmV0dXJuIG9UYWJsZVxuXHRcdFx0LmdldE1vZGVsKFwic2FwLmZlLmkxOG5cIilcblx0XHRcdC5nZXRSZXNvdXJjZUJ1bmRsZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAob1Jlc291cmNlQnVuZGxlOiBhbnkpIHtcblx0XHRcdFx0b1RhYmxlLnNldE5vRGF0YShDb21tb25VdGlscy5nZXRUcmFuc2xhdGVkVGV4dChzTm9EYXRhS2V5LCBvUmVzb3VyY2VCdW5kbGUsIG51bGwsIHN1ZmZpeFJlc291cmNlS2V5KSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR9KTtcblx0fSxcblxuXHRoYW5kbGVUYWJsZURhdGFSZWNlaXZlZDogZnVuY3Rpb24gKG9UYWJsZTogYW55LCBvSW50ZXJuYWxNb2RlbENvbnRleHQ6IGFueSkge1xuXHRcdGNvbnN0IG9CaW5kaW5nID0gb1RhYmxlICYmIG9UYWJsZS5nZXRSb3dCaW5kaW5nKCksXG5cdFx0XHRiRGF0YVJlY2VpdmVkQXR0YWNoZWQgPSBvSW50ZXJuYWxNb2RlbENvbnRleHQgJiYgb0ludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwiZGF0YVJlY2VpdmVkQXR0YWNoZWRcIik7XG5cblx0XHRpZiAob0ludGVybmFsTW9kZWxDb250ZXh0ICYmICFiRGF0YVJlY2VpdmVkQXR0YWNoZWQpIHtcblx0XHRcdG9CaW5kaW5nLmF0dGFjaERhdGFSZWNlaXZlZChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFRhYmxlSGVscGVyLmhhbmRsZVRhYmxlRGVsZXRlRW5hYmxlbWVudEZvclNpZGVFZmZlY3RzKG9UYWJsZSwgb0ludGVybmFsTW9kZWxDb250ZXh0KTtcblx0XHRcdFx0Ly8gUmVmcmVzaCB0aGUgc2VsZWN0ZWQgY29udGV4dHMgdG8gdHJpZ2dlciByZS1jYWxjdWxhdGlvbiBvZiBlbmFibGVkIHN0YXRlIG9mIGFjdGlvbnMuXG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInNlbGVjdGVkQ29udGV4dHNcIiwgW10pO1xuXHRcdFx0XHRjb25zdCBhU2VsZWN0ZWRDb250ZXh0cyA9IG9UYWJsZS5nZXRTZWxlY3RlZENvbnRleHRzKCk7XG5cdFx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcInNlbGVjdGVkQ29udGV4dHNcIiwgYVNlbGVjdGVkQ29udGV4dHMpO1xuXHRcdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJudW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcIiwgYVNlbGVjdGVkQ29udGV4dHMubGVuZ3RoKTtcblx0XHRcdFx0Y29uc3Qgb0FjdGlvbk9wZXJhdGlvbkF2YWlsYWJsZU1hcCA9IEpTT04ucGFyc2UoXG5cdFx0XHRcdFx0Q29tbW9uSGVscGVyLnBhcnNlQ3VzdG9tRGF0YShEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwib3BlcmF0aW9uQXZhaWxhYmxlTWFwXCIpKVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRBY3Rpb25SdW50aW1lLnNldEFjdGlvbkVuYWJsZW1lbnQob0ludGVybmFsTW9kZWxDb250ZXh0LCBvQWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlTWFwLCBhU2VsZWN0ZWRDb250ZXh0cywgXCJ0YWJsZVwiKTtcblx0XHRcdFx0Y29uc3Qgb1RhYmxlQVBJID0gb1RhYmxlID8gb1RhYmxlLmdldFBhcmVudCgpIDogbnVsbDtcblx0XHRcdFx0aWYgKG9UYWJsZUFQSSkge1xuXHRcdFx0XHRcdG9UYWJsZUFQSS5zZXRVcEVtcHR5Um93cyhvVGFibGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShcImRhdGFSZWNlaXZlZEF0dGFjaGVkXCIsIHRydWUpO1xuXHRcdH1cblx0fSxcblxuXHRyZWJpbmQ6IGZ1bmN0aW9uIChvVGFibGU6IGFueSwgb0JpbmRpbmdJbmZvOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuXHRcdGNvbnN0IG9UYWJsZUFQSSA9IG9UYWJsZS5nZXRQYXJlbnQoKSBhcyBUYWJsZUFQSTtcblx0XHRjb25zdCBiSXNTdXNwZW5kZWQgPSBvVGFibGVBUEk/LmdldFByb3BlcnR5KFwiYmluZGluZ1N1c3BlbmRlZFwiKTtcblx0XHRvVGFibGVBUEk/LnNldFByb3BlcnR5KFwib3V0RGF0ZWRCaW5kaW5nXCIsIGJJc1N1c3BlbmRlZCk7XG5cdFx0aWYgKCFiSXNTdXNwZW5kZWQpIHtcblx0XHRcdFRhYmxlVXRpbHMuY2xlYXJTZWxlY3Rpb24ob1RhYmxlKTtcblx0XHRcdFRhYmxlRGVsZWdhdGVCYXNlLnJlYmluZC5hcHBseSh0aGlzLCBbb1RhYmxlLCBvQmluZGluZ0luZm9dKTtcblx0XHRcdFRhYmxlVXRpbHMub25UYWJsZUJvdW5kKG9UYWJsZSk7XG5cdFx0XHR0aGlzLl9zZXRUYWJsZU5vRGF0YVRleHQob1RhYmxlLCBvQmluZGluZ0luZm8pO1xuXHRcdFx0cmV0dXJuIFRhYmxlVXRpbHMud2hlbkJvdW5kKG9UYWJsZSlcblx0XHRcdFx0LnRoZW4odGhpcy5oYW5kbGVUYWJsZURhdGFSZWNlaXZlZChvVGFibGUsIG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpKSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHdhaXRpbmcgZm9yIHRoZSB0YWJsZSB0byBiZSBib3VuZFwiLCBvRXJyb3IpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBGZXRjaGVzIHRoZSByZWxldmFudCBtZXRhZGF0YSBmb3IgdGhlIHRhYmxlIGFuZCByZXR1cm5zIHByb3BlcnR5IGluZm8gYXJyYXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBvVGFibGUgSW5zdGFuY2Ugb2YgdGhlIE1EQ3RhYmxlXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIHByb3BlcnR5IGluZm9cblx0ICovXG5cdGZldGNoUHJvcGVydGllczogZnVuY3Rpb24gKG9UYWJsZTogYW55KSB7XG5cdFx0cmV0dXJuIERlbGVnYXRlVXRpbC5mZXRjaE1vZGVsKG9UYWJsZSkudGhlbigob01vZGVsOiBhbnkpID0+IHtcblx0XHRcdGlmICghb01vZGVsKSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuX2dldENhY2hlZE9yRmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5KFxuXHRcdFx0XHRvVGFibGUsXG5cdFx0XHRcdERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJlbnRpdHlUeXBlXCIpLFxuXHRcdFx0XHRvTW9kZWwuZ2V0TWV0YU1vZGVsKClcblx0XHRcdCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0cHJlSW5pdDogZnVuY3Rpb24gKG9UYWJsZTogVGFibGUpIHtcblx0XHRyZXR1cm4gVGFibGVEZWxlZ2F0ZUJhc2UucHJlSW5pdC5hcHBseSh0aGlzLCBbb1RhYmxlXSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIFNldCB0aGUgYmluZGluZyBjb250ZXh0IHRvIG51bGwgZm9yIGV2ZXJ5IGZhc3QgY3JlYXRpb24gcm93IHRvIGF2b2lkIGl0IGluaGVyaXRpbmdcblx0XHRcdCAqIHRoZSB3cm9uZyBjb250ZXh0IGFuZCByZXF1ZXN0aW5nIHRoZSB0YWJsZSBjb2x1bW5zIG9uIHRoZSBwYXJlbnQgZW50aXR5XG5cdFx0XHQgKiBTZXQgdGhlIGNvcnJlY3QgYmluZGluZyBjb250ZXh0IGluIE9iamVjdFBhZ2VDb250cm9sbGVyLmVuYWJsZUZhc3RDcmVhdGlvblJvdygpXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IG9GYXN0Q3JlYXRpb25Sb3cgPSBvVGFibGUuZ2V0Q3JlYXRpb25Sb3coKTtcblx0XHRcdGlmIChvRmFzdENyZWF0aW9uUm93KSB7XG5cdFx0XHRcdG9GYXN0Q3JlYXRpb25Sb3cuc2V0QmluZGluZ0NvbnRleHQobnVsbCBhcyBhbnkgYXMgQ29udGV4dCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdHVwZGF0ZUJpbmRpbmdJbmZvOiBmdW5jdGlvbiAob1RhYmxlOiBhbnksIG9CaW5kaW5nSW5mbzogYW55KSB7XG5cdFx0VGFibGVEZWxlZ2F0ZUJhc2UudXBkYXRlQmluZGluZ0luZm8uYXBwbHkodGhpcywgW29UYWJsZSwgb0JpbmRpbmdJbmZvXSk7XG5cdFx0dGhpcy5faW50ZXJuYWxVcGRhdGVCaW5kaW5nSW5mbyhvVGFibGUsIG9CaW5kaW5nSW5mbyk7XG5cdFx0b0JpbmRpbmdJbmZvLmV2ZW50cy5kYXRhUmVjZWl2ZWQgPSBvVGFibGUuZ2V0UGFyZW50KCkub25JbnRlcm5hbERhdGFSZWNlaXZlZC5iaW5kKG9UYWJsZS5nZXRQYXJlbnQoKSk7XG5cdFx0b0JpbmRpbmdJbmZvLmV2ZW50cy5kYXRhUmVxdWVzdGVkID0gb1RhYmxlLmdldFBhcmVudCgpLm9uSW50ZXJuYWxEYXRhUmVxdWVzdGVkLmJpbmQob1RhYmxlLmdldFBhcmVudCgpKTtcblx0XHR0aGlzLl9zZXRUYWJsZU5vRGF0YVRleHQob1RhYmxlLCBvQmluZGluZ0luZm8pO1xuXHR9LFxuXG5cdF9tYW5hZ2VTZW1hbnRpY1RhcmdldHM6IGZ1bmN0aW9uIChvTURDVGFibGU6IGFueSkge1xuXHRcdGNvbnN0IG9Sb3dCaW5kaW5nID0gb01EQ1RhYmxlLmdldFJvd0JpbmRpbmcoKTtcblx0XHRpZiAob1Jvd0JpbmRpbmcpIHtcblx0XHRcdG9Sb3dCaW5kaW5nLmF0dGFjaEV2ZW50T25jZShcImRhdGFSZXF1ZXN0ZWRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjb25zdCBfb1ZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KG9NRENUYWJsZSk7XG5cdFx0XHRcdFx0aWYgKF9vVmlldykge1xuXHRcdFx0XHRcdFx0VGFibGVVdGlscy5nZXRTZW1hbnRpY1RhcmdldHNGcm9tVGFibGUoX29WaWV3LmdldENvbnRyb2xsZXIoKSwgb01EQ1RhYmxlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIDApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHVwZGF0ZUJpbmRpbmc6IGZ1bmN0aW9uIChvVGFibGU6IGFueSwgb0JpbmRpbmdJbmZvOiBhbnksIG9CaW5kaW5nOiBhbnkpIHtcblx0XHRjb25zdCBvVGFibGVBUEkgPSBvVGFibGUuZ2V0UGFyZW50KCkgYXMgVGFibGVBUEk7XG5cdFx0Y29uc3QgYklzU3VzcGVuZGVkID0gb1RhYmxlQVBJPy5nZXRQcm9wZXJ0eShcImJpbmRpbmdTdXNwZW5kZWRcIik7XG5cdFx0aWYgKCFiSXNTdXNwZW5kZWQpIHtcblx0XHRcdGxldCBiTmVlZE1hbnVhbFJlZnJlc2ggPSBmYWxzZTtcblx0XHRcdGNvbnN0IF9vVmlldyA9IENvbW1vblV0aWxzLmdldFRhcmdldFZpZXcob1RhYmxlKTtcblx0XHRcdGNvbnN0IG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0ID0gb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cdFx0XHRjb25zdCBzTWFudWFsVXBkYXRlUHJvcGVydHlLZXkgPSBcInBlbmRpbmdNYW51YWxCaW5kaW5nVXBkYXRlXCI7XG5cdFx0XHRjb25zdCBiUGVuZGluZ01hbnVhbFVwZGF0ZSA9IG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0LmdldFByb3BlcnR5KHNNYW51YWxVcGRhdGVQcm9wZXJ0eUtleSk7XG5cdFx0XHRjb25zdCBvUm93QmluZGluZyA9IG9UYWJsZS5nZXRSb3dCaW5kaW5nKCk7XG5cdFx0XHRpZiAob1Jvd0JpbmRpbmcpIHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIE1hbnVhbCByZWZyZXNoIGlmIGZpbHRlcnMgYXJlIG5vdCBjaGFuZ2VkIGJ5IGJpbmRpbmcucmVmcmVzaCgpIHNpbmNlIHVwZGF0aW5nIHRoZSBiaW5kaW5nSW5mb1xuXHRcdFx0XHQgKiBpcyBub3QgZW5vdWdoIHRvIHRyaWdnZXIgYSBiYXRjaCByZXF1ZXN0LlxuXHRcdFx0XHQgKiBSZW1vdmluZyBjb2x1bW5zIGNyZWF0ZXMgb25lIGJhdGNoIHJlcXVlc3QgdGhhdCB3YXMgbm90IGV4ZWN1dGVkIGJlZm9yZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0Y29uc3Qgb2xkRmlsdGVycyA9IG9Sb3dCaW5kaW5nLmdldEZpbHRlcnMoXCJBcHBsaWNhdGlvblwiKTtcblx0XHRcdFx0Yk5lZWRNYW51YWxSZWZyZXNoID1cblx0XHRcdFx0XHRkZWVwRXF1YWwob0JpbmRpbmdJbmZvLmZpbHRlcnMsIG9sZEZpbHRlcnNbMF0pICYmXG5cdFx0XHRcdFx0b1Jvd0JpbmRpbmcuZ2V0UXVlcnlPcHRpb25zRnJvbVBhcmFtZXRlcnMoKS4kc2VhcmNoID09PSBvQmluZGluZ0luZm8ucGFyYW1ldGVycy4kc2VhcmNoICYmXG5cdFx0XHRcdFx0IWJQZW5kaW5nTWFudWFsVXBkYXRlICYmXG5cdFx0XHRcdFx0X29WaWV3ICYmXG5cdFx0XHRcdFx0X29WaWV3LmdldFZpZXdEYXRhKCkuY29udmVydGVyVHlwZSA9PT0gXCJMaXN0UmVwb3J0XCI7XG5cdFx0XHR9XG5cdFx0XHRUYWJsZURlbGVnYXRlQmFzZS51cGRhdGVCaW5kaW5nLmFwcGx5KHRoaXMsIFtvVGFibGUsIG9CaW5kaW5nSW5mbywgb0JpbmRpbmddKTtcblx0XHRcdG9UYWJsZS5maXJlRXZlbnQoXCJiaW5kaW5nVXBkYXRlZFwiKTtcblx0XHRcdGlmIChiTmVlZE1hbnVhbFJlZnJlc2ggJiYgb1RhYmxlLmdldEZpbHRlcigpICYmIG9CaW5kaW5nKSB7XG5cdFx0XHRcdG9Sb3dCaW5kaW5nXG5cdFx0XHRcdFx0LnJlcXVlc3RSZWZyZXNoKG9Sb3dCaW5kaW5nLmdldEdyb3VwSWQoKSlcblx0XHRcdFx0XHQuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRvSW50ZXJuYWxCaW5kaW5nQ29udGV4dC5zZXRQcm9wZXJ0eShzTWFudWFsVXBkYXRlUHJvcGVydHlLZXksIGZhbHNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJlZnJlc2hpbmcgdGhlIHRhYmxlXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0LnNldFByb3BlcnR5KHNNYW51YWxVcGRhdGVQcm9wZXJ0eUtleSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9tYW5hZ2VTZW1hbnRpY1RhcmdldHMob1RhYmxlKTtcblx0XHR9XG5cdFx0b1RhYmxlQVBJPy5zZXRQcm9wZXJ0eShcIm91dERhdGVkQmluZGluZ1wiLCBiSXNTdXNwZW5kZWQpO1xuXHR9LFxuXG5cdF9jb21wdXRlUm93QmluZGluZ0luZm9Gcm9tVGVtcGxhdGU6IGZ1bmN0aW9uIChvVGFibGU6IGFueSkge1xuXHRcdC8vIFdlIG5lZWQgdG8gZGVlcENsb25lIHRoZSBpbmZvIHdlIGdldCBmcm9tIHRoZSBjdXN0b20gZGF0YSwgb3RoZXJ3aXNlIHNvbWUgb2YgaXRzIHN1Ym9iamVjdHMgKGUuZy4gcGFyYW1ldGVycykgd2lsbFxuXHRcdC8vIGJlIHNoYXJlZCB3aXRoIG9CaW5kaW5nSW5mbyBhbmQgbW9kaWZpZWQgbGF0ZXIgKE9iamVjdC5hc3NpZ24gb25seSBkb2VzIGEgc2hhbGxvdyBjbG9uZSlcblx0XHRjb25zdCByb3dCaW5kaW5nSW5mbyA9IGRlZXBDbG9uZShEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwicm93c0JpbmRpbmdJbmZvXCIpKTtcblx0XHQvLyBpZiB0aGUgcm93QmluZGluZ0luZm8gaGFzIGEgJCRnZXRLZWVwQWxpdmVDb250ZXh0IHBhcmFtZXRlciB3ZSBuZWVkIHRvIGNoZWNrIGl0IGlzIHRoZSBvbmx5IFRhYmxlIHdpdGggc3VjaCBhXG5cdFx0Ly8gcGFyYW1ldGVyIGZvciB0aGUgY29sbGVjdGlvbk1ldGFQYXRoXG5cdFx0aWYgKHJvd0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJCRnZXRLZWVwQWxpdmVDb250ZXh0KSB7XG5cdFx0XHRjb25zdCBjb2xsZWN0aW9uUGF0aCA9IERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJ0YXJnZXRDb2xsZWN0aW9uUGF0aFwiKTtcblx0XHRcdGNvbnN0IGludGVybmFsTW9kZWwgPSBvVGFibGUuZ2V0TW9kZWwoXCJpbnRlcm5hbFwiKTtcblx0XHRcdGNvbnN0IGtlcHRBbGl2ZUxpc3RzID0gaW50ZXJuYWxNb2RlbC5nZXRPYmplY3QoXCIva2VwdEFsaXZlTGlzdHNcIikgfHwge307XG5cdFx0XHRpZiAoIWtlcHRBbGl2ZUxpc3RzW2NvbGxlY3Rpb25QYXRoXSkge1xuXHRcdFx0XHRrZXB0QWxpdmVMaXN0c1tjb2xsZWN0aW9uUGF0aF0gPSBvVGFibGUuZ2V0SWQoKTtcblx0XHRcdFx0aW50ZXJuYWxNb2RlbC5zZXRQcm9wZXJ0eShcIi9rZXB0QWxpdmVMaXN0c1wiLCBrZXB0QWxpdmVMaXN0cyk7XG5cdFx0XHR9IGVsc2UgaWYgKGtlcHRBbGl2ZUxpc3RzW2NvbGxlY3Rpb25QYXRoXSAhPT0gb1RhYmxlLmdldElkKCkpIHtcblx0XHRcdFx0ZGVsZXRlIHJvd0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJCRnZXRLZWVwQWxpdmVDb250ZXh0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcm93QmluZGluZ0luZm87XG5cdH0sXG5cdF9pbnRlcm5hbFVwZGF0ZUJpbmRpbmdJbmZvOiBmdW5jdGlvbiAob1RhYmxlOiBhbnksIG9CaW5kaW5nSW5mbzogYW55KSB7XG5cdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cdFx0T2JqZWN0LmFzc2lnbihvQmluZGluZ0luZm8sIHRoaXMuX2NvbXB1dGVSb3dCaW5kaW5nSW5mb0Zyb21UZW1wbGF0ZShvVGFibGUpKTtcblx0XHQvKipcblx0XHQgKiBCaW5kaW5nIGluZm8gbWlnaHQgYmUgc3VzcGVuZGVkIGF0IHRoZSBiZWdpbm5pbmcgd2hlbiB0aGUgZmlyc3QgYmluZFJvd3MgaXMgY2FsbGVkOlxuXHRcdCAqIFRvIGF2b2lkIGR1cGxpY2F0ZSByZXF1ZXN0cyBidXQgc3RpbGwgaGF2ZSBhIGJpbmRpbmcgdG8gY3JlYXRlIG5ldyBlbnRyaWVzLlx0XHRcdFx0ICpcblx0XHQgKiBBZnRlciB0aGUgaW5pdGlhbCBiaW5kaW5nIHN0ZXAsIGZvbGxvdyB1cCBiaW5kaW5ncyBzaG91bGQgbm90IGxvbmdlciBiZSBzdXNwZW5kZWQuXG5cdFx0ICovXG5cdFx0aWYgKG9UYWJsZS5nZXRSb3dCaW5kaW5nKCkpIHtcblx0XHRcdG9CaW5kaW5nSW5mby5zdXNwZW5kZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0Ly8gVGhlIHByZXZpb3VzbHkgYWRkZWQgaGFuZGxlciBmb3IgdGhlIGV2ZW50ICdkYXRhUmVjZWl2ZWQnIGlzIG5vdCBhbnltb3JlIHRoZXJlXG5cdFx0Ly8gc2luY2UgdGhlIGJpbmRpbmdJbmZvIGlzIHJlY3JlYXRlZCBmcm9tIHNjcmF0Y2ggc28gd2UgbmVlZCB0byBzZXQgdGhlIGZsYWcgdG8gZmFsc2UgaW4gb3JkZXJcblx0XHQvLyB0byBhZ2FpbiBhZGQgdGhlIGhhbmRsZXIgb24gdGhpcyBldmVudCBpZiBuZWVkZWRcblx0XHRpZiAob0ludGVybmFsTW9kZWxDb250ZXh0KSB7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJkYXRhUmVjZWl2ZWRBdHRhY2hlZFwiLCBmYWxzZSk7XG5cdFx0fVxuXG5cdFx0bGV0IG9GaWx0ZXI7XG5cdFx0Y29uc3Qgb0ZpbHRlckluZm8gPSBUYWJsZVV0aWxzLmdldEFsbEZpbHRlckluZm8ob1RhYmxlKTtcblx0XHQvLyBQcmVwYXJlIGJpbmRpbmcgaW5mbyB3aXRoIGZpbHRlci9zZWFyY2ggcGFyYW1ldGVyc1xuXHRcdGlmIChvRmlsdGVySW5mby5maWx0ZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdG9GaWx0ZXIgPSBuZXcgRmlsdGVyKHsgZmlsdGVyczogb0ZpbHRlckluZm8uZmlsdGVycywgYW5kOiB0cnVlIH0pO1xuXHRcdH1cblx0XHRpZiAob0ZpbHRlckluZm8uYmluZGluZ1BhdGgpIHtcblx0XHRcdG9CaW5kaW5nSW5mby5wYXRoID0gb0ZpbHRlckluZm8uYmluZGluZ1BhdGg7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb0RhdGFTdGF0ZUluZGljYXRvciA9IG9UYWJsZS5nZXREYXRhU3RhdGVJbmRpY2F0b3IoKTtcblx0XHRpZiAob0RhdGFTdGF0ZUluZGljYXRvciAmJiBvRGF0YVN0YXRlSW5kaWNhdG9yLmlzRmlsdGVyaW5nKCkpIHtcblx0XHRcdC8vIEluY2x1ZGUgZmlsdGVycyBvbiBtZXNzYWdlU3RyaXBcblx0XHRcdGlmIChvQmluZGluZ0luZm8uZmlsdGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG9GaWx0ZXIgPSBuZXcgRmlsdGVyKHsgZmlsdGVyczogb0JpbmRpbmdJbmZvLmZpbHRlcnMuY29uY2F0KG9GaWx0ZXJJbmZvLmZpbHRlcnMpLCBhbmQ6IHRydWUgfSk7XG5cdFx0XHRcdFRhYmxlVXRpbHMudXBkYXRlQmluZGluZ0luZm8ob0JpbmRpbmdJbmZvLCBvRmlsdGVySW5mbywgb0ZpbHRlcik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdFRhYmxlVXRpbHMudXBkYXRlQmluZGluZ0luZm8ob0JpbmRpbmdJbmZvLCBvRmlsdGVySW5mbywgb0ZpbHRlcik7XG5cdFx0fVxuXHR9LFxuXG5cdF90ZW1wbGF0ZUN1c3RvbUNvbHVtbkZyYWdtZW50OiBmdW5jdGlvbiAoXG5cdFx0b0NvbHVtbkluZm86IEN1c3RvbUVsZW1lbnQ8Q3VzdG9tQmFzZWRUYWJsZUNvbHVtbj4sXG5cdFx0b1ZpZXc6IGFueSxcblx0XHRvTW9kaWZpZXI6IGFueSxcblx0XHRzVGFibGVJZDogYW55XG5cdCkge1xuXHRcdGNvbnN0IG9Db2x1bW5Nb2RlbCA9IG5ldyBKU09OTW9kZWwob0NvbHVtbkluZm8pLFxuXHRcdFx0b1RoaXMgPSBuZXcgSlNPTk1vZGVsKHtcblx0XHRcdFx0aWQ6IHNUYWJsZUlkXG5cdFx0XHR9KSxcblx0XHRcdG9QcmVwcm9jZXNzb3JTZXR0aW5ncyA9IHtcblx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKSxcblx0XHRcdFx0XHRcImNvbHVtblwiOiBvQ29sdW1uTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFwidGhpc1wiOiBvVGhpcyxcblx0XHRcdFx0XHRcImNvbHVtblwiOiBvQ29sdW1uTW9kZWxcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdHJldHVybiBEZWxlZ2F0ZVV0aWwudGVtcGxhdGVDb250cm9sRnJhZ21lbnQoXG5cdFx0XHRcInNhcC5mZS5tYWNyb3MudGFibGUuQ3VzdG9tQ29sdW1uXCIsXG5cdFx0XHRvUHJlcHJvY2Vzc29yU2V0dGluZ3MsXG5cdFx0XHR7IHZpZXc6IG9WaWV3IH0sXG5cdFx0XHRvTW9kaWZpZXJcblx0XHQpLnRoZW4oZnVuY3Rpb24gKG9JdGVtOiBhbnkpIHtcblx0XHRcdG9Db2x1bW5Nb2RlbC5kZXN0cm95KCk7XG5cdFx0XHRyZXR1cm4gb0l0ZW07XG5cdFx0fSk7XG5cdH0sXG5cblx0X3RlbXBsYXRlU2xvdENvbHVtbkZyYWdtZW50OiBhc3luYyBmdW5jdGlvbiAoXG5cdFx0b0NvbHVtbkluZm86IEN1c3RvbUVsZW1lbnQ8Q3VzdG9tQmFzZWRUYWJsZUNvbHVtbj4sXG5cdFx0b1ZpZXc6IGFueSxcblx0XHRvTW9kaWZpZXI6IGFueSxcblx0XHRzVGFibGVJZDogYW55XG5cdCkge1xuXHRcdGNvbnN0IG9Db2x1bW5Nb2RlbCA9IG5ldyBKU09OTW9kZWwob0NvbHVtbkluZm8pLFxuXHRcdFx0b1RoaXMgPSBuZXcgSlNPTk1vZGVsKHtcblx0XHRcdFx0aWQ6IHNUYWJsZUlkXG5cdFx0XHR9KSxcblx0XHRcdG9QcmVwcm9jZXNzb3JTZXR0aW5ncyA9IHtcblx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKSxcblx0XHRcdFx0XHRcImNvbHVtblwiOiBvQ29sdW1uTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFwidGhpc1wiOiBvVGhpcyxcblx0XHRcdFx0XHRcImNvbHVtblwiOiBvQ29sdW1uTW9kZWxcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRjb25zdCBzbG90Q29sdW1uc1hNTCA9IGF3YWl0IERlbGVnYXRlVXRpbC50ZW1wbGF0ZUNvbnRyb2xGcmFnbWVudChcInNhcC5mZS5tYWNyb3MudGFibGUuU2xvdENvbHVtblwiLCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MsIHtcblx0XHRcdGlzWE1MOiB0cnVlXG5cdFx0fSk7XG5cdFx0aWYgKCFzbG90Q29sdW1uc1hNTCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0XHR9XG5cdFx0Y29uc3Qgc2xvdFhNTCA9IHNsb3RDb2x1bW5zWE1MLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2xvdFwiKVswXSxcblx0XHRcdG1kY1RhYmxlVGVtcGxhdGVYTUwgPSBzbG90Q29sdW1uc1hNTC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1kY1RhYmxlOnRlbXBsYXRlXCIpWzBdO1xuXHRcdG1kY1RhYmxlVGVtcGxhdGVYTUwucmVtb3ZlQ2hpbGQoc2xvdFhNTCk7XG5cdFx0aWYgKG9Db2x1bW5JbmZvLnRlbXBsYXRlKSB7XG5cdFx0XHRjb25zdCBvVGVtcGxhdGUgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKG9Db2x1bW5JbmZvLnRlbXBsYXRlLCBcInRleHQveG1sXCIpO1xuXHRcdFx0bWRjVGFibGVUZW1wbGF0ZVhNTC5hcHBlbmRDaGlsZChvVGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRMb2cuZXJyb3IoYFBsZWFzZSBwcm92aWRlIGNvbnRlbnQgaW5zaWRlIHRoaXMgQnVpbGRpbmcgQmxvY2sgQ29sdW1uOiAke29Db2x1bW5JbmZvLmhlYWRlcn1gKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXHRcdGlmIChvTW9kaWZpZXIudGFyZ2V0cyAhPT0gXCJqc0NvbnRyb2xUcmVlXCIpIHtcblx0XHRcdHJldHVybiBzbG90Q29sdW1uc1hNTDtcblx0XHR9XG5cdFx0cmV0dXJuIEZyYWdtZW50LmxvYWQoe1xuXHRcdFx0dHlwZTogXCJYTUxcIixcblx0XHRcdGRlZmluaXRpb246IHNsb3RDb2x1bW5zWE1MXG5cdFx0fSk7XG5cdH0sXG5cblx0X2dldEV4cG9ydEZvcm1hdDogZnVuY3Rpb24gKGRhdGFUeXBlOiBhbnkpIHtcblx0XHRzd2l0Y2ggKGRhdGFUeXBlKSB7XG5cdFx0XHRjYXNlIFwiRWRtLkRhdGVcIjpcblx0XHRcdFx0cmV0dXJuIEV4Y2VsRm9ybWF0LmdldEV4Y2VsRGF0ZWZyb21KU0RhdGUoKTtcblx0XHRcdGNhc2UgXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjpcblx0XHRcdFx0cmV0dXJuIEV4Y2VsRm9ybWF0LmdldEV4Y2VsRGF0ZVRpbWVmcm9tSlNEYXRlVGltZSgpO1xuXHRcdFx0Y2FzZSBcIkVkbS5UaW1lT2ZEYXlcIjpcblx0XHRcdFx0cmV0dXJuIEV4Y2VsRm9ybWF0LmdldEV4Y2VsVGltZWZyb21KU1RpbWUoKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9LFxuXG5cdF9nZXRWSFJlbGV2YW50RmllbGRzOiBmdW5jdGlvbiAob01ldGFNb2RlbDogYW55LCBzTWV0YWRhdGFQYXRoOiBhbnksIHNCaW5kaW5nUGF0aD86IGFueSkge1xuXHRcdGxldCBhRmllbGRzOiBhbnlbXSA9IFtdLFxuXHRcdFx0b0RhdGFGaWVsZERhdGEgPSBvTWV0YU1vZGVsLmdldE9iamVjdChzTWV0YWRhdGFQYXRoKTtcblxuXHRcdGlmIChvRGF0YUZpZWxkRGF0YS4ka2luZCAmJiBvRGF0YUZpZWxkRGF0YS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiKSB7XG5cdFx0XHRvRGF0YUZpZWxkRGF0YSA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhZGF0YVBhdGh9QGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZERlZmF1bHRgKTtcblx0XHRcdHNNZXRhZGF0YVBhdGggPSBgJHtzTWV0YWRhdGFQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGREZWZhdWx0YDtcblx0XHR9XG5cdFx0c3dpdGNoIChvRGF0YUZpZWxkRGF0YS4kVHlwZSkge1xuXHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFubm90YXRpb25cIjpcblx0XHRcdFx0aWYgKG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NNZXRhZGF0YVBhdGh9L1RhcmdldC8kQW5ub3RhdGlvblBhdGhgKS5pbmNsdWRlcyhcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIikpIHtcblx0XHRcdFx0XHRvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YWRhdGFQYXRofS9UYXJnZXQvJEFubm90YXRpb25QYXRoL0RhdGFgKS5mb3JFYWNoKChvVmFsdWU6IGFueSwgaUluZGV4OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdGFGaWVsZHMgPSBhRmllbGRzLmNvbmNhdChcblx0XHRcdFx0XHRcdFx0dGhpcy5fZ2V0VkhSZWxldmFudEZpZWxkcyhvTWV0YU1vZGVsLCBgJHtzTWV0YWRhdGFQYXRofS9UYXJnZXQvJEFubm90YXRpb25QYXRoL0RhdGEvJHtpSW5kZXh9YClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoXCI6XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aFVybFwiOlxuXHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiOlxuXHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjpcblx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoQWN0aW9uXCI6XG5cdFx0XHRcdGFGaWVsZHMucHVzaChvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YWRhdGFQYXRofS9WYWx1ZS8kUGF0aGApKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCI6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gcHJvcGVydHlcblx0XHRcdFx0Ly8gdGVtcG9yYXJ5IHdvcmthcm91bmQgdG8gbWFrZSBzdXJlIFZIIHJlbGV2YW50IGZpZWxkIHBhdGggZG8gbm90IGNvbnRhaW4gdGhlIGJpbmRpbmdwYXRoXG5cdFx0XHRcdGlmIChzTWV0YWRhdGFQYXRoLmluZGV4T2Yoc0JpbmRpbmdQYXRoKSA9PT0gMCkge1xuXHRcdFx0XHRcdGFGaWVsZHMucHVzaChzTWV0YWRhdGFQYXRoLnN1YnN0cmluZyhzQmluZGluZ1BhdGgubGVuZ3RoICsgMSkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFGaWVsZHMucHVzaChDb21tb25IZWxwZXIuZ2V0TmF2aWdhdGlvblBhdGgoc01ldGFkYXRhUGF0aCwgdHJ1ZSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0cmV0dXJuIGFGaWVsZHM7XG5cdH0sXG5cdF9zZXREcmFmdEluZGljYXRvck9uVmlzaWJsZUNvbHVtbjogZnVuY3Rpb24gKG9UYWJsZTogYW55LCBhQ29sdW1uczogYW55LCBvQ29sdW1uSW5mbzogYW55KSB7XG5cdFx0Y29uc3Qgb0ludGVybmFsQmluZGluZ0NvbnRleHQgPSBvVGFibGUuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKTtcblx0XHRpZiAoIW9JbnRlcm5hbEJpbmRpbmdDb250ZXh0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IHNJbnRlcm5hbFBhdGggPSBvSW50ZXJuYWxCaW5kaW5nQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgYUNvbHVtbnNXaXRoRHJhZnRJbmRpY2F0b3IgPSBhQ29sdW1ucy5maWx0ZXIoKG9Db2x1bW46IGFueSkgPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2JDb2x1bW5IYXNQcm9wZXJ0eVdpdGhEcmFmdEluZGljYXRvcihvQ29sdW1uKTtcblx0XHR9KTtcblx0XHRjb25zdCBhVmlzaWJsZUNvbHVtbnMgPSBvVGFibGUuZ2V0Q29sdW1ucygpO1xuXHRcdGxldCBzQWRkVmlzaWJsZUNvbHVtbk5hbWUsIHNWaXNpYmxlQ29sdW1uTmFtZSwgYkZvdW5kQ29sdW1uVmlzaWJsZVdpdGhEcmFmdCwgc0NvbHVtbk5hbWVXaXRoRHJhZnRJbmRpY2F0b3I7XG5cdFx0Zm9yIChjb25zdCBpIGluIGFWaXNpYmxlQ29sdW1ucykge1xuXHRcdFx0c1Zpc2libGVDb2x1bW5OYW1lID0gYVZpc2libGVDb2x1bW5zW2ldLmdldERhdGFQcm9wZXJ0eSgpO1xuXHRcdFx0Zm9yIChjb25zdCBqIGluIGFDb2x1bW5zV2l0aERyYWZ0SW5kaWNhdG9yKSB7XG5cdFx0XHRcdHNDb2x1bW5OYW1lV2l0aERyYWZ0SW5kaWNhdG9yID0gYUNvbHVtbnNXaXRoRHJhZnRJbmRpY2F0b3Jbal0ubmFtZTtcblx0XHRcdFx0aWYgKHNWaXNpYmxlQ29sdW1uTmFtZSA9PT0gc0NvbHVtbk5hbWVXaXRoRHJhZnRJbmRpY2F0b3IpIHtcblx0XHRcdFx0XHRiRm91bmRDb2x1bW5WaXNpYmxlV2l0aERyYWZ0ID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob0NvbHVtbkluZm8gJiYgb0NvbHVtbkluZm8ubmFtZSA9PT0gc0NvbHVtbk5hbWVXaXRoRHJhZnRJbmRpY2F0b3IpIHtcblx0XHRcdFx0XHRzQWRkVmlzaWJsZUNvbHVtbk5hbWUgPSBvQ29sdW1uSW5mby5uYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoYkZvdW5kQ29sdW1uVmlzaWJsZVdpdGhEcmFmdCkge1xuXHRcdFx0XHRvSW50ZXJuYWxCaW5kaW5nQ29udGV4dC5zZXRQcm9wZXJ0eShzSW50ZXJuYWxQYXRoICsgU0VNQU5USUNLRVlfSEFTX0RSQUZUSU5ESUNBVE9SLCBzVmlzaWJsZUNvbHVtbk5hbWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCFiRm91bmRDb2x1bW5WaXNpYmxlV2l0aERyYWZ0ICYmIHNBZGRWaXNpYmxlQ29sdW1uTmFtZSkge1xuXHRcdFx0b0ludGVybmFsQmluZGluZ0NvbnRleHQuc2V0UHJvcGVydHkoc0ludGVybmFsUGF0aCArIFNFTUFOVElDS0VZX0hBU19EUkFGVElORElDQVRPUiwgc0FkZFZpc2libGVDb2x1bW5OYW1lKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUl0ZW06IGZ1bmN0aW9uIChvUHJvcGVydHlJbmZvTmFtZTogYW55LCBvVGFibGU6IGFueSwgbVByb3BlcnR5QmFnOiBhbnkpIHtcblx0XHRsZXQgZG9SZW1vdmVJdGVtID0gdHJ1ZTtcblx0XHRjb25zdCBvTW9kaWZpZXIgPSBtUHJvcGVydHlCYWcubW9kaWZpZXI7XG5cdFx0Y29uc3Qgc0RhdGFQcm9wZXJ0eSA9IG9Qcm9wZXJ0eUluZm9OYW1lICYmIG9Nb2RpZmllci5nZXRQcm9wZXJ0eShvUHJvcGVydHlJbmZvTmFtZSwgXCJkYXRhUHJvcGVydHlcIik7XG5cdFx0aWYgKHNEYXRhUHJvcGVydHkgJiYgc0RhdGFQcm9wZXJ0eS5pbmRleE9mICYmIHNEYXRhUHJvcGVydHkuaW5kZXhPZihcIklubGluZVhNTFwiKSAhPT0gLTEpIHtcblx0XHRcdG9Nb2RpZmllci5pbnNlcnRBZ2dyZWdhdGlvbihvVGFibGUsIFwiZGVwZW5kZW50c1wiLCBvUHJvcGVydHlJbmZvTmFtZSk7XG5cdFx0XHRkb1JlbW92ZUl0ZW0gPSBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKG9UYWJsZS5pc0EgJiYgb01vZGlmaWVyLnRhcmdldHMgPT09IFwianNDb250cm9sVHJlZVwiKSB7XG5cdFx0XHR0aGlzLl9zZXREcmFmdEluZGljYXRvclN0YXR1cyhvTW9kaWZpZXIsIG9UYWJsZSwgdGhpcy5nZXRDb2x1bW5zRm9yKG9UYWJsZSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRvUmVtb3ZlSXRlbSk7XG5cdH0sXG5cdF9nZXRNZXRhTW9kZWw6IGZ1bmN0aW9uIChtUHJvcGVydHlCYWc6IGFueSkge1xuXHRcdHJldHVybiBtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50ICYmIG1Qcm9wZXJ0eUJhZy5hcHBDb21wb25lbnQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0fSxcblx0X3NldERyYWZ0SW5kaWNhdG9yU3RhdHVzOiBmdW5jdGlvbiAob01vZGlmaWVyOiBhbnksIG9UYWJsZTogYW55LCBhQ29sdW1uczogYW55LCBvQ29sdW1uSW5mbz86IGFueSkge1xuXHRcdGlmIChvTW9kaWZpZXIudGFyZ2V0cyA9PT0gXCJqc0NvbnRyb2xUcmVlXCIpIHtcblx0XHRcdHRoaXMuX3NldERyYWZ0SW5kaWNhdG9yT25WaXNpYmxlQ29sdW1uKG9UYWJsZSwgYUNvbHVtbnMsIG9Db2x1bW5JbmZvKTtcblx0XHR9XG5cdH0sXG5cdF9nZXRHcm91cElkOiBmdW5jdGlvbiAoc1JldHJpZXZlZEdyb3VwSWQ6IGFueSkge1xuXHRcdHJldHVybiBzUmV0cmlldmVkR3JvdXBJZCB8fCB1bmRlZmluZWQ7XG5cdH0sXG5cdF9nZXREZXBlbmRlbnQ6IGZ1bmN0aW9uIChvRGVwZW5kZW50OiBhbnksIHNQcm9wZXJ0eUluZm9OYW1lOiBhbnksIHNEYXRhUHJvcGVydHk6IGFueSkge1xuXHRcdGlmIChzUHJvcGVydHlJbmZvTmFtZSA9PT0gc0RhdGFQcm9wZXJ0eSkge1xuXHRcdFx0cmV0dXJuIG9EZXBlbmRlbnQ7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH0sXG5cdF9mblRlbXBsYXRlVmFsdWVIZWxwOiBmdW5jdGlvbiAoZm5UZW1wbGF0ZVZhbHVlSGVscDogYW55LCBiVmFsdWVIZWxwUmVxdWlyZWQ6IGFueSwgYlZhbHVlSGVscEV4aXN0czogYW55KSB7XG5cdFx0aWYgKGJWYWx1ZUhlbHBSZXF1aXJlZCAmJiAhYlZhbHVlSGVscEV4aXN0cykge1xuXHRcdFx0cmV0dXJuIGZuVGVtcGxhdGVWYWx1ZUhlbHAoXCJzYXAuZmUubWFjcm9zLnRhYmxlLlZhbHVlSGVscFwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9LFxuXHRfZ2V0RGlzcGxheU1vZGU6IGZ1bmN0aW9uIChiRGlzcGxheU1vZGU6IGFueSkge1xuXHRcdGxldCBjb2x1bW5FZGl0TW9kZTtcblx0XHRpZiAoYkRpc3BsYXlNb2RlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGJEaXNwbGF5TW9kZSA9IHR5cGVvZiBiRGlzcGxheU1vZGUgPT09IFwiYm9vbGVhblwiID8gYkRpc3BsYXlNb2RlIDogYkRpc3BsYXlNb2RlID09PSBcInRydWVcIjtcblx0XHRcdGNvbHVtbkVkaXRNb2RlID0gYkRpc3BsYXlNb2RlID8gXCJEaXNwbGF5XCIgOiBcIkVkaXRhYmxlXCI7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkaXNwbGF5bW9kZTogYkRpc3BsYXlNb2RlLFxuXHRcdFx0XHRjb2x1bW5FZGl0TW9kZTogY29sdW1uRWRpdE1vZGVcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRkaXNwbGF5bW9kZTogdW5kZWZpbmVkLFxuXHRcdFx0Y29sdW1uRWRpdE1vZGU6IHVuZGVmaW5lZFxuXHRcdH07XG5cdH0sXG5cdF9pbnNlcnRBZ2dyZWdhdGlvbjogZnVuY3Rpb24gKG9WYWx1ZUhlbHA6IGFueSwgb01vZGlmaWVyOiBhbnksIG9UYWJsZTogYW55KSB7XG5cdFx0aWYgKG9WYWx1ZUhlbHApIHtcblx0XHRcdHJldHVybiBvTW9kaWZpZXIuaW5zZXJ0QWdncmVnYXRpb24ob1RhYmxlLCBcImRlcGVuZGVudHNcIiwgb1ZhbHVlSGVscCwgMCk7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH0sXG5cdC8qKlxuXHQgKiBJbnZva2VkIHdoZW4gYSBjb2x1bW4gaXMgYWRkZWQgdXNpbmcgdGhlIHRhYmxlIHBlcnNvbmFsaXphdGlvbiBkaWFsb2cuXG5cdCAqXG5cdCAqIEBwYXJhbSBzUHJvcGVydHlJbmZvTmFtZSBOYW1lIG9mIHRoZSBwcm9wZXJ0eSBmb3Igd2hpY2ggdGhlIGNvbHVtbiBpcyBhZGRlZFxuXHQgKiBAcGFyYW0gb1RhYmxlIEluc3RhbmNlIG9mIHRhYmxlIGNvbnRyb2xcblx0ICogQHBhcmFtIG1Qcm9wZXJ0eUJhZyBJbnN0YW5jZSBvZiBwcm9wZXJ0eSBiYWcgZnJvbSB0aGUgZmxleGliaWxpdHkgQVBJXG5cdCAqIEByZXR1cm5zIE9uY2UgcmVzb2x2ZWQsIGEgdGFibGUgY29sdW1uIGRlZmluaXRpb24gaXMgcmV0dXJuZWRcblx0ICovXG5cdGFkZEl0ZW06IGFzeW5jIGZ1bmN0aW9uIChzUHJvcGVydHlJbmZvTmFtZTogc3RyaW5nLCBvVGFibGU6IGFueSwgbVByb3BlcnR5QmFnOiBhbnkpIHtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gdGhpcy5fZ2V0TWV0YU1vZGVsKG1Qcm9wZXJ0eUJhZyksXG5cdFx0XHRvTW9kaWZpZXIgPSBtUHJvcGVydHlCYWcubW9kaWZpZXIsXG5cdFx0XHRzVGFibGVJZCA9IG9Nb2RpZmllci5nZXRJZChvVGFibGUpLFxuXHRcdFx0YUNvbHVtbnMgPSBvVGFibGUuaXNBID8gdGhpcy5nZXRDb2x1bW5zRm9yKG9UYWJsZSkgOiBudWxsO1xuXHRcdGlmICghYUNvbHVtbnMpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb0NvbHVtbkluZm8gPSBhQ29sdW1ucy5maW5kKGZ1bmN0aW9uIChvQ29sdW1uOiBhbnkpIHtcblx0XHRcdHJldHVybiBvQ29sdW1uLm5hbWUgPT09IHNQcm9wZXJ0eUluZm9OYW1lO1xuXHRcdH0pO1xuXHRcdGlmICghb0NvbHVtbkluZm8pIHtcblx0XHRcdExvZy5lcnJvcihgJHtzUHJvcGVydHlJbmZvTmFtZX0gbm90IGZvdW5kIHdoaWxlIGFkZGluZyBjb2x1bW5gKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXHRcdHRoaXMuX3NldERyYWZ0SW5kaWNhdG9yU3RhdHVzKG9Nb2RpZmllciwgb1RhYmxlLCBhQ29sdW1ucywgb0NvbHVtbkluZm8pO1xuXHRcdC8vIHJlbmRlciBjdXN0b20gY29sdW1uXG5cdFx0aWYgKG9Db2x1bW5JbmZvLnR5cGUgPT09IFwiRGVmYXVsdFwiKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdGVtcGxhdGVDdXN0b21Db2x1bW5GcmFnbWVudChvQ29sdW1uSW5mbywgbVByb3BlcnR5QmFnLnZpZXcsIG9Nb2RpZmllciwgc1RhYmxlSWQpO1xuXHRcdH1cblxuXHRcdGlmIChvQ29sdW1uSW5mby50eXBlID09PSBcIlNsb3RcIikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RlbXBsYXRlU2xvdENvbHVtbkZyYWdtZW50KG9Db2x1bW5JbmZvLCBtUHJvcGVydHlCYWcudmlldywgb01vZGlmaWVyLCBzVGFibGVJZCk7XG5cdFx0fVxuXHRcdC8vIGZhbGwtYmFja1xuXHRcdGlmICghb01ldGFNb2RlbCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0XHR9XG5cblx0XHRjb25zdCBzUGF0aDogc3RyaW5nID0gYXdhaXQgRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEob1RhYmxlLCBcIm1ldGFQYXRoXCIsIG9Nb2RpZmllcik7XG5cdFx0Y29uc3Qgc0VudGl0eVR5cGVQYXRoOiBzdHJpbmcgPSBhd2FpdCBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwiZW50aXR5VHlwZVwiLCBvTW9kaWZpZXIpO1xuXHRcdGNvbnN0IHNSZXRyaWV2ZWRHcm91cElkID0gYXdhaXQgRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEob1RhYmxlLCBcInJlcXVlc3RHcm91cElkXCIsIG9Nb2RpZmllcik7XG5cdFx0Y29uc3Qgc0dyb3VwSWQ6IHN0cmluZyA9IHRoaXMuX2dldEdyb3VwSWQoc1JldHJpZXZlZEdyb3VwSWQpO1xuXHRcdGNvbnN0IG9UYWJsZUNvbnRleHQ6IENvbnRleHQgPSBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNQYXRoKTtcblx0XHRjb25zdCBhRmV0Y2hlZFByb3BlcnRpZXMgPSBhd2FpdCB0aGlzLl9nZXRDYWNoZWRPckZldGNoUHJvcGVydGllc0ZvckVudGl0eShcblx0XHRcdG9UYWJsZSxcblx0XHRcdHNFbnRpdHlUeXBlUGF0aCxcblx0XHRcdG9NZXRhTW9kZWwsXG5cdFx0XHRtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50XG5cdFx0KTtcblx0XHRjb25zdCBvUHJvcGVydHlJbmZvID0gYUZldGNoZWRQcm9wZXJ0aWVzLmZpbmQoZnVuY3Rpb24gKG9JbmZvOiBhbnkpIHtcblx0XHRcdHJldHVybiBvSW5mby5uYW1lID09PSBzUHJvcGVydHlJbmZvTmFtZTtcblx0XHR9KTtcblxuXHRcdGNvbnN0IG9Qcm9wZXJ0eUNvbnRleHQ6IENvbnRleHQgPSBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KG9Qcm9wZXJ0eUluZm8ubWV0YWRhdGFQYXRoKTtcblx0XHRjb25zdCBhVkhQcm9wZXJ0aWVzID0gdGhpcy5fZ2V0VkhSZWxldmFudEZpZWxkcyhvTWV0YU1vZGVsLCBvUHJvcGVydHlJbmZvLm1ldGFkYXRhUGF0aCwgc1BhdGgpO1xuXHRcdGNvbnN0IG9QYXJhbWV0ZXJzID0ge1xuXHRcdFx0c0JpbmRpbmdQYXRoOiBzUGF0aCxcblx0XHRcdHNWYWx1ZUhlbHBUeXBlOiBcIlRhYmxlVmFsdWVIZWxwXCIsXG5cdFx0XHRvQ29udHJvbDogb1RhYmxlLFxuXHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdG9Nb2RpZmllcixcblx0XHRcdG9Qcm9wZXJ0eUluZm9cblx0XHR9O1xuXG5cdFx0Y29uc3QgZm5UZW1wbGF0ZVZhbHVlSGVscCA9IGFzeW5jIChzRnJhZ21lbnROYW1lOiBhbnkpID0+IHtcblx0XHRcdGNvbnN0IG9UaGlzID0gbmV3IEpTT05Nb2RlbCh7XG5cdFx0XHRcdFx0aWQ6IHNUYWJsZUlkLFxuXHRcdFx0XHRcdHJlcXVlc3RHcm91cElkOiBzR3JvdXBJZFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0b1ByZXByb2Nlc3NvclNldHRpbmdzID0ge1xuXHRcdFx0XHRcdGJpbmRpbmdDb250ZXh0czoge1xuXHRcdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKSxcblx0XHRcdFx0XHRcdFwiZGF0YUZpZWxkXCI6IG9Qcm9wZXJ0eUNvbnRleHRcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLFxuXHRcdFx0XHRcdFx0XCJkYXRhRmllbGRcIjogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRcdG1ldGFNb2RlbDogb01ldGFNb2RlbFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3Qgb1ZhbHVlSGVscCA9IGF3YWl0IERlbGVnYXRlVXRpbC50ZW1wbGF0ZUNvbnRyb2xGcmFnbWVudChzRnJhZ21lbnROYW1lLCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MsIHt9LCBvTW9kaWZpZXIpO1xuXHRcdFx0XHRyZXR1cm4gYXdhaXQgdGhpcy5faW5zZXJ0QWdncmVnYXRpb24ob1ZhbHVlSGVscCwgb01vZGlmaWVyLCBvVGFibGUpO1xuXHRcdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly9XZSBhbHdheXMgcmVzb2x2ZSB0aGUgcHJvbWlzZSB0byBlbnN1cmUgdGhhdCB0aGUgYXBwIGRvZXMgbm90IGNyYXNoXG5cdFx0XHRcdExvZy5lcnJvcihgVmFsdWVIZWxwIG5vdCBsb2FkZWQgOiAke29FcnJvci5tZXNzYWdlfWApO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdG9UaGlzLmRlc3Ryb3koKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3QgZm5UZW1wbGF0ZUZyYWdtZW50ID0gKG9JblByb3BlcnR5SW5mbzogYW55LCBvVmlldzogYW55KSA9PiB7XG5cdFx0XHRjb25zdCBzRnJhZ21lbnROYW1lID0gXCJzYXAuZmUubWFjcm9zLnRhYmxlLkNvbHVtblwiO1xuXG5cdFx0XHRsZXQgYkRpc3BsYXlNb2RlO1xuXHRcdFx0bGV0IHNUYWJsZVR5cGVDdXN0b21EYXRhO1xuXHRcdFx0bGV0IHNPbkNoYW5nZUN1c3RvbURhdGE7XG5cdFx0XHRsZXQgc0NyZWF0aW9uTW9kZUN1c3RvbURhdGE7XG5cblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChbXG5cdFx0XHRcdERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJkaXNwbGF5TW9kZVByb3BlcnR5QmluZGluZ1wiLCBvTW9kaWZpZXIpLFxuXHRcdFx0XHREZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwidGFibGVUeXBlXCIsIG9Nb2RpZmllciksXG5cdFx0XHRcdERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJvbkNoYW5nZVwiLCBvTW9kaWZpZXIpLFxuXHRcdFx0XHREZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwiY3JlYXRpb25Nb2RlXCIsIG9Nb2RpZmllcilcblx0XHRcdF0pLnRoZW4oKGFDdXN0b21EYXRhOiBhbnlbXSkgPT4ge1xuXHRcdFx0XHRiRGlzcGxheU1vZGUgPSBhQ3VzdG9tRGF0YVswXTtcblx0XHRcdFx0c1RhYmxlVHlwZUN1c3RvbURhdGEgPSBhQ3VzdG9tRGF0YVsxXTtcblx0XHRcdFx0c09uQ2hhbmdlQ3VzdG9tRGF0YSA9IGFDdXN0b21EYXRhWzJdO1xuXHRcdFx0XHRzQ3JlYXRpb25Nb2RlQ3VzdG9tRGF0YSA9IGFDdXN0b21EYXRhWzNdO1xuXHRcdFx0XHQvLyBSZWFkIE9ubHkgYW5kIENvbHVtbiBFZGl0IE1vZGUgY2FuIGJvdGggaGF2ZSB0aHJlZSBzdGF0ZVxuXHRcdFx0XHQvLyBVbmRlZmluZWQgbWVhbnMgdGhhdCB0aGUgZnJhbWV3b3JrIGRlY2lkZXMgd2hhdCB0byBkb1xuXHRcdFx0XHQvLyBUcnVlIC8gRGlzcGxheSBtZWFucyBhbHdheXMgcmVhZCBvbmx5XG5cdFx0XHRcdC8vIEZhbHNlIC8gRWRpdGFibGUgbWVhbnMgZWRpdGFibGUgYnV0IHdoaWxlIHN0aWxsIHJlc3BlY3RpbmcgdGhlIGxvdyBsZXZlbCBwcmluY2lwbGUgKGltbXV0YWJsZSBwcm9wZXJ0eSB3aWxsIG5vdCBiZSBlZGl0YWJsZSlcblx0XHRcdFx0Y29uc3Qgb0Rpc3BsYXlNb2RlcyA9IHRoaXMuX2dldERpc3BsYXlNb2RlKGJEaXNwbGF5TW9kZSk7XG5cdFx0XHRcdGJEaXNwbGF5TW9kZSA9IG9EaXNwbGF5TW9kZXMuZGlzcGxheW1vZGU7XG5cdFx0XHRcdGNvbnN0IGNvbHVtbkVkaXRNb2RlID0gb0Rpc3BsYXlNb2Rlcy5jb2x1bW5FZGl0TW9kZTtcblxuXHRcdFx0XHRjb25zdCBvVGhpcyA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0XHRcdFx0cmVhZE9ubHk6IGJEaXNwbGF5TW9kZSxcblx0XHRcdFx0XHRcdGNvbHVtbkVkaXRNb2RlOiBjb2x1bW5FZGl0TW9kZSxcblx0XHRcdFx0XHRcdHRhYmxlVHlwZTogc1RhYmxlVHlwZUN1c3RvbURhdGEsXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogc09uQ2hhbmdlQ3VzdG9tRGF0YSxcblx0XHRcdFx0XHRcdGlkOiBzVGFibGVJZCxcblx0XHRcdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IHNQcm9wZXJ0eUluZm9OYW1lLFxuXHRcdFx0XHRcdFx0Y29sdW1uSW5mbzogb0NvbHVtbkluZm8sXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiB7XG5cdFx0XHRcdFx0XHRcdHNQYXRoOiBzUGF0aCxcblx0XHRcdFx0XHRcdFx0b01vZGVsOiBvTWV0YU1vZGVsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Y3JlYXRpb25Nb2RlOiBzQ3JlYXRpb25Nb2RlQ3VzdG9tRGF0YVxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdG9QcmVwcm9jZXNzb3JTZXR0aW5ncyA9IHtcblx0XHRcdFx0XHRcdGJpbmRpbmdDb250ZXh0czoge1xuXHRcdFx0XHRcdFx0XHRcImVudGl0eVNldFwiOiBvVGFibGVDb250ZXh0LFxuXHRcdFx0XHRcdFx0XHRcImNvbGxlY3Rpb25cIjogb1RhYmxlQ29udGV4dCxcblx0XHRcdFx0XHRcdFx0XCJkYXRhRmllbGRcIjogb1Byb3BlcnR5Q29udGV4dCxcblx0XHRcdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKSxcblx0XHRcdFx0XHRcdFx0XCJjb2x1bW5cIjogb1RoaXMuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvY29sdW1uSW5mb1wiKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFx0XHRcInRoaXNcIjogb1RoaXMsXG5cdFx0XHRcdFx0XHRcdFwiZW50aXR5U2V0XCI6IG9NZXRhTW9kZWwsXG5cdFx0XHRcdFx0XHRcdFwiY29sbGVjdGlvblwiOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFGaWVsZFwiOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XHRtZXRhTW9kZWw6IG9NZXRhTW9kZWwsXG5cdFx0XHRcdFx0XHRcdFwiY29sdW1uXCI6IG9UaGlzXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLnRlbXBsYXRlQ29udHJvbEZyYWdtZW50KHNGcmFnbWVudE5hbWUsIG9QcmVwcm9jZXNzb3JTZXR0aW5ncywgeyB2aWV3OiBvVmlldyB9LCBvTW9kaWZpZXIpLmZpbmFsbHkoXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0b1RoaXMuZGVzdHJveSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdGFWSFByb3BlcnRpZXMubWFwKGFzeW5jIChzUHJvcGVydHlOYW1lOiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3QgbVBhcmFtZXRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBvUGFyYW1ldGVycywgeyBzUHJvcGVydHlOYW1lOiBzUHJvcGVydHlOYW1lIH0pO1xuXG5cdFx0XHRcdGNvbnN0IGFSZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRcdERlbGVnYXRlVXRpbC5pc1ZhbHVlSGVscFJlcXVpcmVkKG1QYXJhbWV0ZXJzKSxcblx0XHRcdFx0XHREZWxlZ2F0ZVV0aWwuZG9lc1ZhbHVlSGVscEV4aXN0KG1QYXJhbWV0ZXJzKVxuXHRcdFx0XHRdKTtcblxuXHRcdFx0XHRjb25zdCBiVmFsdWVIZWxwUmVxdWlyZWQgPSBhUmVzdWx0c1swXSxcblx0XHRcdFx0XHRiVmFsdWVIZWxwRXhpc3RzID0gYVJlc3VsdHNbMV07XG5cdFx0XHRcdHJldHVybiB0aGlzLl9mblRlbXBsYXRlVmFsdWVIZWxwKGZuVGVtcGxhdGVWYWx1ZUhlbHAsIGJWYWx1ZUhlbHBSZXF1aXJlZCwgYlZhbHVlSGVscEV4aXN0cyk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdFx0Ly8gSWYgdmlldyBpcyBub3QgcHJvdmlkZWQgdHJ5IHRvIGdldCBpdCBieSBhY2Nlc3NpbmcgdG8gdGhlIHBhcmVudGFsIGhpZXJhcmNoeVxuXHRcdC8vIElmIGl0IGRvZXNuJ3Qgd29yayAodGFibGUgaW50byBhbiB1bmF0dGFjaGVkIE9QIHNlY3Rpb24pIGdldCB0aGUgdmlldyB2aWEgdGhlIEFwcENvbXBvbmVudFxuXHRcdGNvbnN0IHZpZXcgPVxuXHRcdFx0bVByb3BlcnR5QmFnLnZpZXcgfHxcblx0XHRcdENvbW1vblV0aWxzLmdldFRhcmdldFZpZXcob1RhYmxlKSB8fFxuXHRcdFx0KG1Qcm9wZXJ0eUJhZy5hcHBDb21wb25lbnQgPyBDb21tb25VdGlscy5nZXRDdXJyZW50UGFnZVZpZXcobVByb3BlcnR5QmFnLmFwcENvbXBvbmVudCkgOiB1bmRlZmluZWQpO1xuXHRcdHJldHVybiBmblRlbXBsYXRlRnJhZ21lbnQob1Byb3BlcnR5SW5mbywgdmlldyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb3ZpZGUgdGhlIFRhYmxlJ3MgZmlsdGVyIGRlbGVnYXRlIHRvIHByb3ZpZGUgYmFzaWMgZmlsdGVyIGZ1bmN0aW9uYWxpdHkgc3VjaCBhcyBhZGRpbmcgRmlsdGVyRmllbGRzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBPYmplY3QgZm9yIHRoZSBUYWJsZXMgZmlsdGVyIHBlcnNvbmFsaXphdGlvbi5cblx0ICovXG5cdGdldEZpbHRlckRlbGVnYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIEZpbHRlckJhckRlbGVnYXRlLCB7XG5cdFx0XHRhZGRJdGVtOiBmdW5jdGlvbiAoc1Byb3BlcnR5SW5mb05hbWU6IGFueSwgb1BhcmVudENvbnRyb2w6IGFueSkge1xuXHRcdFx0XHRpZiAoc1Byb3BlcnR5SW5mb05hbWUuaW5kZXhPZihcIlByb3BlcnR5OjpcIikgPT09IDApIHtcblx0XHRcdFx0XHQvLyBDb3JyZWN0IHRoZSBuYW1lIG9mIGNvbXBsZXggcHJvcGVydHkgaW5mbyByZWZlcmVuY2VzLlxuXHRcdFx0XHRcdHNQcm9wZXJ0eUluZm9OYW1lID0gc1Byb3BlcnR5SW5mb05hbWUucmVwbGFjZShcIlByb3BlcnR5OjpcIiwgXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIEZpbHRlckJhckRlbGVnYXRlLmFkZEl0ZW0oc1Byb3BlcnR5SW5mb05hbWUsIG9QYXJlbnRDb250cm9sKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgVHlwZVV0aWwgYXR0YWNoZWQgdG8gdGhpcyBkZWxlZ2F0ZS5cblx0ICpcblx0ICogQHJldHVybnMgQW55IGluc3RhbmNlIG9mIFR5cGVVdGlsXG5cdCAqL1xuXHRnZXRUeXBlVXRpbDogZnVuY3Rpb24gKC8qb1BheWxvYWQ6IG9iamVjdCovKSB7XG5cdFx0cmV0dXJuIFR5cGVVdGlsO1xuXHR9LFxuXG5cdGZvcm1hdEdyb3VwSGVhZGVyKG9UYWJsZTogYW55LCBvQ29udGV4dDogYW55LCBzUHJvcGVydHk6IGFueSkge1xuXHRcdGNvbnN0IG1Gb3JtYXRJbmZvcyA9IF9nZXRDYWNoZWRQcm9wZXJ0aWVzKG9UYWJsZSwgbnVsbCksXG5cdFx0XHRvRm9ybWF0SW5mbyA9XG5cdFx0XHRcdG1Gb3JtYXRJbmZvcyAmJlxuXHRcdFx0XHRtRm9ybWF0SW5mb3MuZmlsdGVyKChvYmo6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBvYmoubmFtZSA9PT0gc1Byb3BlcnR5O1xuXHRcdFx0XHR9KVswXSxcblx0XHRcdC8qRm9yIGEgRGF0ZSBvciBEYXRlVGltZSBwcm9wZXJ0eSwgdGhlIHZhbHVlIGlzIHJldHVybmVkIGluIGV4dGVybmFsIGZvcm1hdCB1c2luZyBhIFVJNSB0eXBlIGZvciB0aGVcblx0ICAgICAgICBnaXZlbiBwcm9wZXJ0eSBwYXRoIHRoYXQgZm9ybWF0cyBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm9wZXJ0eSdzIEVETSB0eXBlIGFuZCBjb25zdHJhaW50cyovXG5cdFx0XHRiRXh0ZXJuYWxGb3JtYXQgPSBvRm9ybWF0SW5mbz8udHlwZUNvbmZpZz8uYmFzZVR5cGUgPT09IFwiRGF0ZVRpbWVcIiB8fCBvRm9ybWF0SW5mbz8udHlwZUNvbmZpZz8uYmFzZVR5cGUgPT09IFwiRGF0ZVwiO1xuXHRcdGxldCBzVmFsdWU7XG5cdFx0aWYgKG9Gb3JtYXRJbmZvICYmIG9Gb3JtYXRJbmZvLm1vZGUpIHtcblx0XHRcdHN3aXRjaCAob0Zvcm1hdEluZm8ubW9kZSkge1xuXHRcdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25cIjpcblx0XHRcdFx0XHRzVmFsdWUgPSBvQ29udGV4dC5nZXRQcm9wZXJ0eShvRm9ybWF0SW5mby5kZXNjcmlwdGlvblByb3BlcnR5LCBiRXh0ZXJuYWxGb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblZhbHVlXCI6XG5cdFx0XHRcdFx0c1ZhbHVlID0gVmFsdWVGb3JtYXR0ZXIuZm9ybWF0V2l0aEJyYWNrZXRzKFxuXHRcdFx0XHRcdFx0b0NvbnRleHQuZ2V0UHJvcGVydHkob0Zvcm1hdEluZm8uZGVzY3JpcHRpb25Qcm9wZXJ0eSwgYkV4dGVybmFsRm9ybWF0KSxcblx0XHRcdFx0XHRcdG9Db250ZXh0LmdldFByb3BlcnR5KG9Gb3JtYXRJbmZvLnZhbHVlUHJvcGVydHksIGJFeHRlcm5hbEZvcm1hdClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJWYWx1ZURlc2NyaXB0aW9uXCI6XG5cdFx0XHRcdFx0c1ZhbHVlID0gVmFsdWVGb3JtYXR0ZXIuZm9ybWF0V2l0aEJyYWNrZXRzKFxuXHRcdFx0XHRcdFx0b0NvbnRleHQuZ2V0UHJvcGVydHkob0Zvcm1hdEluZm8udmFsdWVQcm9wZXJ0eSwgYkV4dGVybmFsRm9ybWF0KSxcblx0XHRcdFx0XHRcdG9Db250ZXh0LmdldFByb3BlcnR5KG9Gb3JtYXRJbmZvLmRlc2NyaXB0aW9uUHJvcGVydHksIGJFeHRlcm5hbEZvcm1hdClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzVmFsdWUgPSBvQ29udGV4dC5nZXRQcm9wZXJ0eShvRm9ybWF0SW5mby5wYXRoLCBiRXh0ZXJuYWxGb3JtYXQpO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiTV9UQUJMRV9HUk9VUF9IRUFERVJfVElUTEVcIiwgW29Gb3JtYXRJbmZvLmxhYmVsLCBzVmFsdWVdKTtcblx0fVxufSk7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUFrakJPLGdCQUFnQkEsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0lBQ3JDLElBQUk7TUFDSCxJQUFJQyxNQUFNLEdBQUdGLElBQUksRUFBakI7SUFDQSxDQUZELENBRUUsT0FBTUcsQ0FBTixFQUFTO01BQ1YsT0FBT0YsT0FBTyxDQUFDRSxDQUFELENBQWQ7SUFDQTs7SUFDRCxJQUFJRCxNQUFNLElBQUlBLE1BQU0sQ0FBQ0UsSUFBckIsRUFBMkI7TUFDMUIsT0FBT0YsTUFBTSxDQUFDRSxJQUFQLENBQVksS0FBSyxDQUFq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