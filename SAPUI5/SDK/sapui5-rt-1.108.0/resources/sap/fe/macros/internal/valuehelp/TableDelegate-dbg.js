/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/deepEqual", "sap/fe/core/CommonUtils", "sap/fe/core/converters/controls/ListReport/FilterBar", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/templating/DisplayModeFormatter", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/type/TypeUtil", "sap/fe/macros/DelegateUtil", "sap/fe/macros/ODataMetaModelUtil", "sap/ui/core/Core", "sap/ui/mdc/odata/v4/TableDelegate", "sap/ui/mdc/odata/v4/util/DelegateUtil", "sap/ui/mdc/util/FilterUtil", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter"], function (Log, deepEqual, CommonUtils, FilterBar, MetaModelConverter, ModelHelper, DisplayModeFormatter, PropertyHelper, TypeUtil, MacrosDelegateUtil, ODataMetaModelUtil, Core, TableDelegate, DelegateUtil, FilterUtil, Filter, FilterOperator, Sorter) {
  "use strict";

  var getLabel = PropertyHelper.getLabel;
  var getAssociatedUnitPropertyPath = PropertyHelper.getAssociatedUnitPropertyPath;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedTimezonePropertyPath = PropertyHelper.getAssociatedTimezonePropertyPath;
  var getAssociatedTimezoneProperty = PropertyHelper.getAssociatedTimezoneProperty;
  var getAssociatedTextPropertyPath = PropertyHelper.getAssociatedTextPropertyPath;
  var getAssociatedTextProperty = PropertyHelper.getAssociatedTextProperty;
  var getAssociatedCurrencyPropertyPath = PropertyHelper.getAssociatedCurrencyPropertyPath;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getDisplayMode = DisplayModeFormatter.getDisplayMode;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var fetchTypeConfig = FilterBar.fetchTypeConfig;

  /**
   * Test delegate for OData V4.
   */
  var ODataTableDelegate = Object.assign({}, TableDelegate);

  ODataTableDelegate.fetchProperties = function (oTable) {
    var _this = this;

    var oModel = this._getModel(oTable);

    var pCreatePropertyInfos;

    if (!oModel) {
      pCreatePropertyInfos = new Promise(function (resolve) {
        oTable.attachModelContextChange({
          resolver: resolve
        }, onModelContextChange, _this);
      }).then(function (oSubModel) {
        return _this._createPropertyInfos(oTable, oSubModel);
      });
    } else {
      pCreatePropertyInfos = this._createPropertyInfos(oTable, oModel);
    }

    return pCreatePropertyInfos.then(function (aProperties) {
      if (oTable.data) {
        oTable.data("$tablePropertyInfo", aProperties);
      }

      return aProperties;
    });
  };

  function onModelContextChange(oEvent, oData) {
    var oTable = oEvent.getSource();

    var oModel = this._getModel(oTable);

    if (oModel) {
      oTable.detachModelContextChange(onModelContextChange);
      oData.resolver(oModel);
    }
  }
  /**
   * Collect related properties from a property's annotations.
   *
   * @param oProperty The property to be considered
   * @param oAdditionalProperty The additional property could refer to the text, currency, unit or timezone.
   * @param oColumn The column already available on the ValueHelpTable.
   * It contains only basic property attributes needed for the ValueHelp.
   * @returns The related properties that were identified.
   */


  function _collectRelatedProperties(oProperty, oAdditionalProperty, oColumn) {
    var _oProperty$annotation, _oProperty$annotation2, _textAnnotation$annot, _textAnnotation$annot2, _textAnnotation$annot3;

    var relatedProperties = {
      properties: {}
    },
        textAnnotation = (_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.Common) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.Text,
        textArrangement = textAnnotation === null || textAnnotation === void 0 ? void 0 : (_textAnnotation$annot = textAnnotation.annotations) === null || _textAnnotation$annot === void 0 ? void 0 : (_textAnnotation$annot2 = _textAnnotation$annot.UI) === null || _textAnnotation$annot2 === void 0 ? void 0 : (_textAnnotation$annot3 = _textAnnotation$annot2.TextArrangement) === null || _textAnnotation$annot3 === void 0 ? void 0 : _textAnnotation$annot3.toString(),
        displayMode = textAnnotation && textArrangement && getDisplayMode(oProperty);

    if (oAdditionalProperty) {
      if (displayMode === "Description") {
        relatedProperties.properties[oAdditionalProperty.name] = oAdditionalProperty;
      } else if (displayMode && displayMode !== "Value" || !textAnnotation) {
        relatedProperties.properties[oProperty.name] = oColumn;
        relatedProperties.properties[oAdditionalProperty.name] = oAdditionalProperty;
      }
    }

    return relatedProperties;
  }

  ODataTableDelegate._createPropertyInfos = function (oTable, oModel) {
    var oMetadataInfo = oTable.getDelegate().payload;
    var aProperties = [];
    var sEntitySetPath = "/".concat(oMetadataInfo.collectionName);
    var oMetaModel = oModel.getMetaModel();
    return oMetaModel.requestObject("".concat(sEntitySetPath, "@")).then(function (mEntitySetAnnotations) {
      var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"];
      var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
      var oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
      var oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);
      var customDataForColumns = MacrosDelegateUtil.getCustomData(oTable, "columns");
      var propertiesToBeCreated = {};
      var targetEntityType = getInvolvedDataModelObjects(oTable.getModel().getMetaModel().getContext(sEntitySetPath)).targetEntityType;
      customDataForColumns.customData.forEach(function (columnDef) {
        var oPropertyInfo = {
          name: columnDef.path,
          label: columnDef.label,
          sortable: _isSortableProperty(oSortRestrictionsInfo, columnDef),
          filterable: _isFilterableProperty(oFilterRestrictionsInfo, columnDef),
          maxConditions: _getPropertyMaxConditions(oFilterRestrictionsInfo, columnDef),
          typeConfig: MacrosDelegateUtil.isTypeFilterable(columnDef.$Type) ? oTable.getTypeUtil().getTypeConfig(columnDef.$Type) : undefined
        };
        var oProperty = targetEntityType.entityProperties.find(function (prop) {
          return prop.name === columnDef.path;
        }); // Check if it's a navigation property and get the corresponding property from the navigationProperty

        if (!oProperty) {
          oProperty = _getNavigationProperty(targetEntityType.navigationProperties, columnDef);
        }

        if (oProperty) {
          var propertyTypeConfig = fetchTypeConfig(oProperty);
          var oTypeConfig = TypeUtil.getTypeConfig(propertyTypeConfig.type, propertyTypeConfig.formatOptions, propertyTypeConfig.constraints) || oTable.getTypeUtil().getTypeConfig(columnDef.$Type); //Check if there is an additional property linked to the property as a Unit, Currency, Timezone or textArrangement

          var additionalProperty = _getAdditionalProperty(oProperty);

          var relatedPropertiesInfo = _collectRelatedProperties(oProperty, additionalProperty, columnDef);

          var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);

          if (relatedPropertyNames.length > 0) {
            oPropertyInfo.propertyInfos = relatedPropertyNames; //Complex properties must be hidden for sorting and filtering

            oPropertyInfo.sortable = false;
            oPropertyInfo.filterable = false; // Collect information of related columns to be created.

            relatedPropertyNames.forEach(function (name) {
              propertiesToBeCreated[name] = relatedPropertiesInfo.properties[name];
            }); // Also add property for the inOut Parameters on the ValueHelp when textArrangement is set to #TextOnly
            // It will not be linked to the complex Property (BCP 2270141154)

            if (relatedPropertyNames.some(function (name) {
              var _oProperty;

              return name !== ((_oProperty = oProperty) === null || _oProperty === void 0 ? void 0 : _oProperty.name);
            })) {
              propertiesToBeCreated[oProperty.name] = oProperty;
            }
          } else {
            oPropertyInfo.path = columnDef.path;
          }

          oPropertyInfo.typeConfig = oPropertyInfo.typeConfig ? oTypeConfig : undefined;
        } else {
          oPropertyInfo.path = columnDef.path;
        }

        aProperties.push(oPropertyInfo);
      });

      var relatedColumns = _createRelatedProperties(propertiesToBeCreated, aProperties, oSortRestrictionsInfo, oFilterRestrictionsInfo);

      return aProperties.concat(relatedColumns);
    });
  };
  /**
   * Updates the binding info with the relevant path and model from the metadata.
   *
   * @param oMDCTable The MDCTable instance
   * @param oBindingInfo The bindingInfo of the table
   */


  ODataTableDelegate.updateBindingInfo = function (oMDCTable, oBindingInfo) {
    TableDelegate.updateBindingInfo.apply(this, [oMDCTable, oBindingInfo]);

    if (!oMDCTable) {
      return;
    }

    var oMetadataInfo = oMDCTable.getDelegate().payload;

    if (oMetadataInfo && oBindingInfo) {
      oBindingInfo.path = oBindingInfo.path || oMetadataInfo.collectionPath || "/".concat(oMetadataInfo.collectionName);
      oBindingInfo.model = oBindingInfo.model || oMetadataInfo.model;
    }

    if (!oBindingInfo) {
      oBindingInfo = {};
    }

    var oFilter = Core.byId(oMDCTable.getFilter()),
        bFilterEnabled = oMDCTable.isFilteringEnabled();
    var mConditions;
    var oInnerFilterInfo, oOuterFilterInfo;
    var aFilters = [];
    var aTableProperties = oMDCTable.data("$tablePropertyInfo"); //TODO: consider a mechanism ('FilterMergeUtil' or enhance 'FilterUtil') to allow the connection between different filters)

    if (bFilterEnabled) {
      mConditions = oMDCTable.getConditions();
      oInnerFilterInfo = FilterUtil.getFilterInfo(oMDCTable, mConditions, aTableProperties, []);

      if (oInnerFilterInfo.filters) {
        aFilters.push(oInnerFilterInfo.filters);
      }
    }

    if (oFilter) {
      mConditions = oFilter.getConditions();

      if (mConditions) {
        var aParameterNames = DelegateUtil.getParameterNames(oFilter); // The table properties needs to updated with the filter field if no Selectionfierlds are annotated and not part as value help parameter

        ODataTableDelegate._updatePropertyInfo(aTableProperties, oMDCTable, mConditions, oMetadataInfo);

        oOuterFilterInfo = FilterUtil.getFilterInfo(oFilter, mConditions, aTableProperties, aParameterNames);

        if (oOuterFilterInfo.filters) {
          aFilters.push(oOuterFilterInfo.filters);
        }

        var sParameterPath = DelegateUtil.getParametersInfo(oFilter, mConditions);

        if (sParameterPath) {
          oBindingInfo.path = sParameterPath;
        }
      } // get the basic search


      oBindingInfo.parameters.$search = CommonUtils.normalizeSearchTerm(oFilter.getSearch()) || undefined;
    }

    this._applyDefaultSorting(oBindingInfo, oMDCTable.getDelegate().payload); // add select to oBindingInfo (BCP 2170163012)


    oBindingInfo.parameters.$select = aTableProperties.reduce(function (sQuery, oProperty) {
      // Navigation properties (represented by X/Y) should not be added to $select.
      // ToDo : They should be added as $expand=X($select=Y) instead
      if (oProperty.path && oProperty.path.indexOf("/") === -1) {
        sQuery = sQuery ? "".concat(sQuery, ",").concat(oProperty.path) : oProperty.path;
      }

      return sQuery;
    }, ""); // Add $count

    oBindingInfo.parameters.$count = true; //If the entity is DraftEnabled add a DraftFilter

    if (ModelHelper.isDraftSupported(oMDCTable.getModel().getMetaModel(), oBindingInfo.path)) {
      aFilters.push(new Filter("IsActiveEntity", FilterOperator.EQ, true));
    }

    oBindingInfo.filters = new Filter(aFilters, true);
  };

  ODataTableDelegate.getTypeUtil = function
    /*oPayload*/
  () {
    return TypeUtil;
  };

  ODataTableDelegate._getModel = function (oTable) {
    var oMetadataInfo = oTable.getDelegate().payload;
    return oTable.getModel(oMetadataInfo.model);
  };
  /**
   * Applies a default sort order if needed. This is only the case if the request is not a $search request
   * (means the parameter $search of the bindingInfo is undefined) and if not already a sort order is set,
   * e.g. via presentation variant or manual by the user.
   *
   * @param oBindingInfo The bindingInfo of the table
   * @param oPayload The payload of the TableDelegate
   */


  ODataTableDelegate._applyDefaultSorting = function (oBindingInfo, oPayload) {
    if (oBindingInfo.parameters && oBindingInfo.parameters.$search == undefined && oBindingInfo.sorter && oBindingInfo.sorter.length == 0) {
      var defaultSortPropertyName = oPayload ? oPayload.defaultSortPropertyName : undefined;

      if (defaultSortPropertyName) {
        oBindingInfo.sorter.push(new Sorter(defaultSortPropertyName, false));
      }
    }
  };
  /**
   * Updates the table properties with filter field infos.
   *
   * @param aTableProperties Array with table properties
   * @param oMDCTable The MDCTable instance
   * @param mConditions The conditions of the table
   * @param oMetadataInfo The metadata info of the filter field
   */


  ODataTableDelegate._updatePropertyInfo = function (aTableProperties, oMDCTable, mConditions, oMetadataInfo) {
    var aConditionKey = Object.keys(mConditions),
        oMetaModel = oMDCTable.getModel().getMetaModel();
    aConditionKey.forEach(function (conditionKey) {
      if (aTableProperties.findIndex(function (tableProperty) {
        return tableProperty.path === conditionKey;
      }) === -1) {
        var oColumnDef = {
          path: conditionKey,
          typeConfig: oMDCTable.getTypeUtil().getTypeConfig(oMetaModel.getObject("/".concat(oMetadataInfo.collectionName, "/").concat(conditionKey)).$Type)
        };
        aTableProperties.push(oColumnDef);
      }
    });
  };

  ODataTableDelegate.updateBinding = function (oTable, oBindingInfo, oBinding) {
    var bNeedManualRefresh = false;
    var oInternalBindingContext = oTable.getBindingContext("internal");
    var sManualUpdatePropertyKey = "pendingManualBindingUpdate";
    var bPendingManualUpdate = oInternalBindingContext === null || oInternalBindingContext === void 0 ? void 0 : oInternalBindingContext.getProperty(sManualUpdatePropertyKey);
    var oRowBinding = oTable.getRowBinding();

    if (oRowBinding) {
      /**
       * Manual refresh if filters are not changed by binding.refresh() since updating the bindingInfo
       * is not enough to trigger a batch request.
       * Removing columns creates one batch request that was not executed before
       */
      var oldFilters = oRowBinding.getFilters("Application");
      bNeedManualRefresh = deepEqual(oBindingInfo.filters, oldFilters[0]) && oRowBinding.getQueryOptionsFromParameters().$search === oBindingInfo.parameters.$search && !bPendingManualUpdate;
    }

    TableDelegate.updateBinding.apply(ODataTableDelegate, [oTable, oBindingInfo, oBinding]);

    if (!oRowBinding) {
      oRowBinding = oTable.getRowBinding();
    } //get row binding after rebind from TableDelegate.updateBinding in case oBinding was undefined


    if (bNeedManualRefresh && oTable.getFilter() && oBinding) {
      oInternalBindingContext === null || oInternalBindingContext === void 0 ? void 0 : oInternalBindingContext.setProperty(sManualUpdatePropertyKey, true);
      oRowBinding.requestRefresh(oRowBinding.getGroupId()).finally(function () {
        oInternalBindingContext === null || oInternalBindingContext === void 0 ? void 0 : oInternalBindingContext.setProperty(sManualUpdatePropertyKey, false);
      }).catch(function (oError) {
        Log.error("Error while refreshing a filterBar VH table", oError);
      });
    }

    oTable.fireEvent("bindingUpdated"); //no need to check for semantic targets here since we are in a VH and don't want to allow further navigation
  };
  /**
   * Creates a simple property for each identified complex property.
   *
   * @param propertiesToBeCreated Identified properties.
   * @param existingColumns The list of columns created for properties defined on the Value List.
   * @param oSortRestrictionsInfo An object containing the sort restriction information
   * @param oFilterRestrictionsInfo An object containing the filter restriction information
   * @returns The array of properties created.
   */


  function _createRelatedProperties(propertiesToBeCreated, existingColumns, oSortRestrictionsInfo, oFilterRestrictionsInfo) {
    var relatedPropertyNameMap = {},
        relatedColumns = [];
    Object.keys(propertiesToBeCreated).forEach(function (name) {
      var property = propertiesToBeCreated[name],
          relatedColumn = existingColumns.find(function (column) {
        return column.name === name;
      });

      if (!relatedColumn || relatedColumn !== null && relatedColumn !== void 0 && relatedColumn.propertyInfos) {
        var newName = "Property::".concat(name);
        relatedPropertyNameMap[name] = newName;

        if (!property.path || property.path.indexOf("/") > 1) {
          var _annotations, _annotations$UI, _annotations$UI$DataF;

          // In this case the related property does not exist because it wasn't created on last iteration or we have a navigation property,
          // then we need to retrieve the corresponding propertyInfo
          var propertyValue = (_annotations = property.annotations) === null || _annotations === void 0 ? void 0 : (_annotations$UI = _annotations.UI) === null || _annotations$UI === void 0 ? void 0 : (_annotations$UI$DataF = _annotations$UI.DataFieldDefault) === null || _annotations$UI$DataF === void 0 ? void 0 : _annotations$UI$DataF.Value;
          property.path = property.path || propertyValue.path;
          property.label = getLabel(property);

          if (MacrosDelegateUtil.isTypeFilterable(propertyValue === null || propertyValue === void 0 ? void 0 : propertyValue.$target.type)) {
            var propertyTypeConfig = fetchTypeConfig(property);
            property.typeConfig = TypeUtil.getTypeConfig(propertyTypeConfig.type, propertyTypeConfig.formatOptions, propertyTypeConfig.constraints);
          }
        }

        if (property.path) {
          relatedColumns.push({
            name: newName,
            label: property.label,
            path: property.path,
            sortable: _isSortableProperty(oSortRestrictionsInfo, property),
            filterable: _isFilterableProperty(oFilterRestrictionsInfo, property),
            typeConfig: (relatedColumn === null || relatedColumn === void 0 ? void 0 : relatedColumn.typeConfig) || property.typeConfig,
            maxConditions: _getPropertyMaxConditions(oFilterRestrictionsInfo, property)
          });
        }
      }
    }); // The property 'name' has been prefixed with 'Property::' for uniqueness.
    // Update the same in other propertyInfos[] references which point to this property.

    existingColumns.forEach(function (column) {
      if (column.propertyInfos) {
        var _column$propertyInfos;

        column.propertyInfos = (_column$propertyInfos = column.propertyInfos) === null || _column$propertyInfos === void 0 ? void 0 : _column$propertyInfos.map(function (propertyInfo) {
          var _relatedPropertyNameM;

          return (_relatedPropertyNameM = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM !== void 0 ? _relatedPropertyNameM : propertyInfo;
        });
      }
    });
    return relatedColumns;
  }
  /**
   * Identifies if the given property is sortable based on the sort restriction information.
   *
   * @param oSortRestrictionsInfo The sort restriction information from the restriction annotation.
   * @param property The target property.
   * @returns `true` if the given property is sortable.
   */


  function _isSortableProperty(oSortRestrictionsInfo, property) {
    return property.path && oSortRestrictionsInfo[property.path] ? oSortRestrictionsInfo[property.path].sortable : property.sortable;
  }
  /**
   * Identifies if the given property is filterable based on the sort restriction information.
   *
   * @param oFilterRestrictionsInfo The filter restriction information from the restriction annotation.
   * @param property The target property.
   * @returns `true` if the given property is filterable.
   */


  function _isFilterableProperty(oFilterRestrictionsInfo, property) {
    return property.path && oFilterRestrictionsInfo[property.path] ? oFilterRestrictionsInfo[property.path].filterable : property.filterable;
  }
  /**
   * Identifies the maxConditions for a given property.
   *
   * @param oFilterRestrictionsInfo The filter restriction information from the restriction annotation.
   * @param property The target property.
   * @returns `-1` or `1` if the property is a MultiValueFilterExpression.
   */


  function _getPropertyMaxConditions(oFilterRestrictionsInfo, property) {
    return property.path && ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[property.path]) ? -1 : 1;
  }
  /**
   * Idenfifies if there is a navigation property and provides the corresponding entity property.
   *
   * @param navigationProperties The navigation Properties for the target entity type.
   * @param columnDef The target column.
   * @returns The navigation Property if it exists.
   */


  function _getNavigationProperty(navigationProperties, columnDef) {
    var _navigationProperties;

    return navigationProperties.length > 0 ? (_navigationProperties = navigationProperties.map(function (navProp) {
      return navProp.targetType.entityProperties.find(function (prop) {
        return columnDef.path && columnDef.path.indexOf(prop.name) > -1;
      });
    })) === null || _navigationProperties === void 0 ? void 0 : _navigationProperties[0] : undefined;
  }
  /**
   * Identifies the additional property which references to the unit, timezone, textArrangement or currency.
   *
   * @param oProperty The target property.
   * @returns The additional property.
   */


  function _getAdditionalProperty(oProperty) {
    //Additional Property could refer to a navigation property, keep the name and path as navigation property
    var additionalPropertyPath = getAssociatedTextPropertyPath(oProperty) || getAssociatedCurrencyPropertyPath(oProperty) || getAssociatedUnitPropertyPath(oProperty) || getAssociatedTimezonePropertyPath(oProperty);
    var associatedProperty = getAssociatedTextProperty(oProperty) || getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty) || getAssociatedTimezoneProperty(oProperty);

    if (associatedProperty && additionalPropertyPath && (additionalPropertyPath === null || additionalPropertyPath === void 0 ? void 0 : additionalPropertyPath.indexOf("/")) > -1) {
      associatedProperty.name = additionalPropertyPath;
      associatedProperty.path = additionalPropertyPath;
    }

    return associatedProperty;
  }

  return ODataTableDelegate;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJPRGF0YVRhYmxlRGVsZWdhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJUYWJsZURlbGVnYXRlIiwiZmV0Y2hQcm9wZXJ0aWVzIiwib1RhYmxlIiwib01vZGVsIiwiX2dldE1vZGVsIiwicENyZWF0ZVByb3BlcnR5SW5mb3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsImF0dGFjaE1vZGVsQ29udGV4dENoYW5nZSIsInJlc29sdmVyIiwib25Nb2RlbENvbnRleHRDaGFuZ2UiLCJ0aGVuIiwib1N1Yk1vZGVsIiwiX2NyZWF0ZVByb3BlcnR5SW5mb3MiLCJhUHJvcGVydGllcyIsImRhdGEiLCJvRXZlbnQiLCJvRGF0YSIsImdldFNvdXJjZSIsImRldGFjaE1vZGVsQ29udGV4dENoYW5nZSIsIl9jb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMiLCJvUHJvcGVydHkiLCJvQWRkaXRpb25hbFByb3BlcnR5Iiwib0NvbHVtbiIsInJlbGF0ZWRQcm9wZXJ0aWVzIiwicHJvcGVydGllcyIsInRleHRBbm5vdGF0aW9uIiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJUZXh0IiwidGV4dEFycmFuZ2VtZW50IiwiVUkiLCJUZXh0QXJyYW5nZW1lbnQiLCJ0b1N0cmluZyIsImRpc3BsYXlNb2RlIiwiZ2V0RGlzcGxheU1vZGUiLCJuYW1lIiwib01ldGFkYXRhSW5mbyIsImdldERlbGVnYXRlIiwicGF5bG9hZCIsInNFbnRpdHlTZXRQYXRoIiwiY29sbGVjdGlvbk5hbWUiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwicmVxdWVzdE9iamVjdCIsIm1FbnRpdHlTZXRBbm5vdGF0aW9ucyIsIm9Tb3J0UmVzdHJpY3Rpb25zIiwib1NvcnRSZXN0cmljdGlvbnNJbmZvIiwiT0RhdGFNZXRhTW9kZWxVdGlsIiwiZ2V0U29ydFJlc3RyaWN0aW9uc0luZm8iLCJvRmlsdGVyUmVzdHJpY3Rpb25zIiwib0ZpbHRlclJlc3RyaWN0aW9uc0luZm8iLCJnZXRGaWx0ZXJSZXN0cmljdGlvbnNJbmZvIiwiY3VzdG9tRGF0YUZvckNvbHVtbnMiLCJNYWNyb3NEZWxlZ2F0ZVV0aWwiLCJnZXRDdXN0b21EYXRhIiwicHJvcGVydGllc1RvQmVDcmVhdGVkIiwidGFyZ2V0RW50aXR5VHlwZSIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsImdldE1vZGVsIiwiZ2V0Q29udGV4dCIsImN1c3RvbURhdGEiLCJmb3JFYWNoIiwiY29sdW1uRGVmIiwib1Byb3BlcnR5SW5mbyIsInBhdGgiLCJsYWJlbCIsInNvcnRhYmxlIiwiX2lzU29ydGFibGVQcm9wZXJ0eSIsImZpbHRlcmFibGUiLCJfaXNGaWx0ZXJhYmxlUHJvcGVydHkiLCJtYXhDb25kaXRpb25zIiwiX2dldFByb3BlcnR5TWF4Q29uZGl0aW9ucyIsInR5cGVDb25maWciLCJpc1R5cGVGaWx0ZXJhYmxlIiwiJFR5cGUiLCJnZXRUeXBlVXRpbCIsImdldFR5cGVDb25maWciLCJ1bmRlZmluZWQiLCJlbnRpdHlQcm9wZXJ0aWVzIiwiZmluZCIsInByb3AiLCJfZ2V0TmF2aWdhdGlvblByb3BlcnR5IiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJwcm9wZXJ0eVR5cGVDb25maWciLCJmZXRjaFR5cGVDb25maWciLCJvVHlwZUNvbmZpZyIsIlR5cGVVdGlsIiwidHlwZSIsImZvcm1hdE9wdGlvbnMiLCJjb25zdHJhaW50cyIsImFkZGl0aW9uYWxQcm9wZXJ0eSIsIl9nZXRBZGRpdGlvbmFsUHJvcGVydHkiLCJyZWxhdGVkUHJvcGVydGllc0luZm8iLCJyZWxhdGVkUHJvcGVydHlOYW1lcyIsImtleXMiLCJsZW5ndGgiLCJwcm9wZXJ0eUluZm9zIiwic29tZSIsInB1c2giLCJyZWxhdGVkQ29sdW1ucyIsIl9jcmVhdGVSZWxhdGVkUHJvcGVydGllcyIsImNvbmNhdCIsInVwZGF0ZUJpbmRpbmdJbmZvIiwib01EQ1RhYmxlIiwib0JpbmRpbmdJbmZvIiwiYXBwbHkiLCJjb2xsZWN0aW9uUGF0aCIsIm1vZGVsIiwib0ZpbHRlciIsIkNvcmUiLCJieUlkIiwiZ2V0RmlsdGVyIiwiYkZpbHRlckVuYWJsZWQiLCJpc0ZpbHRlcmluZ0VuYWJsZWQiLCJtQ29uZGl0aW9ucyIsIm9Jbm5lckZpbHRlckluZm8iLCJvT3V0ZXJGaWx0ZXJJbmZvIiwiYUZpbHRlcnMiLCJhVGFibGVQcm9wZXJ0aWVzIiwiZ2V0Q29uZGl0aW9ucyIsIkZpbHRlclV0aWwiLCJnZXRGaWx0ZXJJbmZvIiwiZmlsdGVycyIsImFQYXJhbWV0ZXJOYW1lcyIsIkRlbGVnYXRlVXRpbCIsImdldFBhcmFtZXRlck5hbWVzIiwiX3VwZGF0ZVByb3BlcnR5SW5mbyIsInNQYXJhbWV0ZXJQYXRoIiwiZ2V0UGFyYW1ldGVyc0luZm8iLCJwYXJhbWV0ZXJzIiwiJHNlYXJjaCIsIkNvbW1vblV0aWxzIiwibm9ybWFsaXplU2VhcmNoVGVybSIsImdldFNlYXJjaCIsIl9hcHBseURlZmF1bHRTb3J0aW5nIiwiJHNlbGVjdCIsInJlZHVjZSIsInNRdWVyeSIsImluZGV4T2YiLCIkY291bnQiLCJNb2RlbEhlbHBlciIsImlzRHJhZnRTdXBwb3J0ZWQiLCJGaWx0ZXIiLCJGaWx0ZXJPcGVyYXRvciIsIkVRIiwib1BheWxvYWQiLCJzb3J0ZXIiLCJkZWZhdWx0U29ydFByb3BlcnR5TmFtZSIsIlNvcnRlciIsImFDb25kaXRpb25LZXkiLCJjb25kaXRpb25LZXkiLCJmaW5kSW5kZXgiLCJ0YWJsZVByb3BlcnR5Iiwib0NvbHVtbkRlZiIsImdldE9iamVjdCIsInVwZGF0ZUJpbmRpbmciLCJvQmluZGluZyIsImJOZWVkTWFudWFsUmVmcmVzaCIsIm9JbnRlcm5hbEJpbmRpbmdDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJzTWFudWFsVXBkYXRlUHJvcGVydHlLZXkiLCJiUGVuZGluZ01hbnVhbFVwZGF0ZSIsImdldFByb3BlcnR5Iiwib1Jvd0JpbmRpbmciLCJnZXRSb3dCaW5kaW5nIiwib2xkRmlsdGVycyIsImdldEZpbHRlcnMiLCJkZWVwRXF1YWwiLCJnZXRRdWVyeU9wdGlvbnNGcm9tUGFyYW1ldGVycyIsInNldFByb3BlcnR5IiwicmVxdWVzdFJlZnJlc2giLCJnZXRHcm91cElkIiwiZmluYWxseSIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJmaXJlRXZlbnQiLCJleGlzdGluZ0NvbHVtbnMiLCJyZWxhdGVkUHJvcGVydHlOYW1lTWFwIiwicHJvcGVydHkiLCJyZWxhdGVkQ29sdW1uIiwiY29sdW1uIiwibmV3TmFtZSIsInByb3BlcnR5VmFsdWUiLCJEYXRhRmllbGREZWZhdWx0IiwiVmFsdWUiLCJnZXRMYWJlbCIsIiR0YXJnZXQiLCJtYXAiLCJwcm9wZXJ0eUluZm8iLCJpc011bHRpVmFsdWVGaWx0ZXJFeHByZXNzaW9uIiwibmF2UHJvcCIsInRhcmdldFR5cGUiLCJhZGRpdGlvbmFsUHJvcGVydHlQYXRoIiwiZ2V0QXNzb2NpYXRlZFRleHRQcm9wZXJ0eVBhdGgiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGgiLCJnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5UGF0aCIsImdldEFzc29jaWF0ZWRUaW1lem9uZVByb3BlcnR5UGF0aCIsImFzc29jaWF0ZWRQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHkiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVGFibGVEZWxlZ2F0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXZpZ2F0aW9uUHJvcGVydHksIFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBEYXRhRmllbGQgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSBcInNhcC9iYXNlL3V0aWwvZGVlcEVxdWFsXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgeyBmZXRjaFR5cGVDb25maWcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9MaXN0UmVwb3J0L0ZpbHRlckJhclwiO1xuaW1wb3J0IHsgZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCB7IGdldERpc3BsYXlNb2RlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGlzcGxheU1vZGVGb3JtYXR0ZXJcIjtcbmltcG9ydCB7XG5cdGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5LFxuXHRnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGgsXG5cdGdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoLFxuXHRnZXRBc3NvY2lhdGVkVGltZXpvbmVQcm9wZXJ0eSxcblx0Z2V0QXNzb2NpYXRlZFRpbWV6b25lUHJvcGVydHlQYXRoLFxuXHRnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5LFxuXHRnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5UGF0aCxcblx0Z2V0TGFiZWxcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcbmltcG9ydCBUeXBlVXRpbCBmcm9tIFwic2FwL2ZlL2NvcmUvdHlwZS9UeXBlVXRpbFwiO1xuaW1wb3J0IE1hY3Jvc0RlbGVnYXRlVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9EZWxlZ2F0ZVV0aWxcIjtcbmltcG9ydCBPRGF0YU1ldGFNb2RlbFV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvT0RhdGFNZXRhTW9kZWxVdGlsXCI7XG5pbXBvcnQgdHlwZSBFdmVudCBmcm9tIFwic2FwL3VpL2Jhc2UvRXZlbnRcIjtcbmltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgVGFibGVEZWxlZ2F0ZSBmcm9tIFwic2FwL3VpL21kYy9vZGF0YS92NC9UYWJsZURlbGVnYXRlXCI7XG5pbXBvcnQgRGVsZWdhdGVVdGlsIGZyb20gXCJzYXAvdWkvbWRjL29kYXRhL3Y0L3V0aWwvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL3VpL21kYy9UYWJsZVwiO1xuaW1wb3J0IEZpbHRlclV0aWwgZnJvbSBcInNhcC91aS9tZGMvdXRpbC9GaWx0ZXJVdGlsXCI7XG5pbXBvcnQgTURDVGFibGUgZnJvbSBcInNhcC91aS9tZGMvdmFsdWVoZWxwL2NvbnRlbnQvTURDVGFibGVcIjtcbmltcG9ydCBGaWx0ZXIgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJcIjtcbmltcG9ydCBGaWx0ZXJPcGVyYXRvciBmcm9tIFwic2FwL3VpL21vZGVsL0ZpbHRlck9wZXJhdG9yXCI7XG5pbXBvcnQgU29ydGVyIGZyb20gXCJzYXAvdWkvbW9kZWwvU29ydGVyXCI7XG5cbmV4cG9ydCB0eXBlIFZhbHVlSGVscFRhYmxlQ29sdW1uID0ge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHByb3BlcnR5SW5mb3M/OiBzdHJpbmdbXTtcblx0c29ydGFibGU/OiBib29sZWFuO1xuXHRwYXRoPzogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0ZmlsdGVyYWJsZT86IGJvb2xlYW47XG5cdHR5cGVDb25maWc/OiBPYmplY3Q7XG5cdG1heENvbmRpdGlvbnM/OiBudW1iZXI7XG59O1xuZXhwb3J0IHR5cGUgQ29tcGxleFByb3BlcnR5SW5mbyA9IHtcblx0cHJvcGVydGllczogUmVjb3JkPHN0cmluZywgVmFsdWVIZWxwVGFibGVDb2x1bW4+O1xufTtcblxuLyoqXG4gKiBUZXN0IGRlbGVnYXRlIGZvciBPRGF0YSBWNC5cbiAqL1xuY29uc3QgT0RhdGFUYWJsZURlbGVnYXRlID0gT2JqZWN0LmFzc2lnbih7fSwgVGFibGVEZWxlZ2F0ZSk7XG5cbk9EYXRhVGFibGVEZWxlZ2F0ZS5mZXRjaFByb3BlcnRpZXMgPSBmdW5jdGlvbiAob1RhYmxlOiBUYWJsZSkge1xuXHRjb25zdCBvTW9kZWwgPSB0aGlzLl9nZXRNb2RlbChvVGFibGUpO1xuXHRsZXQgcENyZWF0ZVByb3BlcnR5SW5mb3M7XG5cblx0aWYgKCFvTW9kZWwpIHtcblx0XHRwQ3JlYXRlUHJvcGVydHlJbmZvcyA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRvVGFibGUuYXR0YWNoTW9kZWxDb250ZXh0Q2hhbmdlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVzb2x2ZXI6IHJlc29sdmVcblx0XHRcdFx0fSxcblx0XHRcdFx0b25Nb2RlbENvbnRleHRDaGFuZ2UgYXMgYW55LFxuXHRcdFx0XHR0aGlzXG5cdFx0XHQpO1xuXHRcdH0pLnRoZW4oKG9TdWJNb2RlbCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVByb3BlcnR5SW5mb3Mob1RhYmxlLCBvU3ViTW9kZWwpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHBDcmVhdGVQcm9wZXJ0eUluZm9zID0gdGhpcy5fY3JlYXRlUHJvcGVydHlJbmZvcyhvVGFibGUsIG9Nb2RlbCk7XG5cdH1cblxuXHRyZXR1cm4gcENyZWF0ZVByb3BlcnR5SW5mb3MudGhlbihmdW5jdGlvbiAoYVByb3BlcnRpZXM6IGFueSkge1xuXHRcdGlmIChvVGFibGUuZGF0YSkge1xuXHRcdFx0b1RhYmxlLmRhdGEoXCIkdGFibGVQcm9wZXJ0eUluZm9cIiwgYVByb3BlcnRpZXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gYVByb3BlcnRpZXM7XG5cdH0pO1xufTtcblxuZnVuY3Rpb24gb25Nb2RlbENvbnRleHRDaGFuZ2UodGhpczogdHlwZW9mIE9EYXRhVGFibGVEZWxlZ2F0ZSwgb0V2ZW50OiBFdmVudCwgb0RhdGE6IGFueSkge1xuXHRjb25zdCBvVGFibGUgPSBvRXZlbnQuZ2V0U291cmNlKCkgYXMgVGFibGU7XG5cdGNvbnN0IG9Nb2RlbCA9IHRoaXMuX2dldE1vZGVsKG9UYWJsZSk7XG5cblx0aWYgKG9Nb2RlbCkge1xuXHRcdG9UYWJsZS5kZXRhY2hNb2RlbENvbnRleHRDaGFuZ2Uob25Nb2RlbENvbnRleHRDaGFuZ2UgYXMgYW55KTtcblx0XHRvRGF0YS5yZXNvbHZlcihvTW9kZWwpO1xuXHR9XG59XG4vKipcbiAqIENvbGxlY3QgcmVsYXRlZCBwcm9wZXJ0aWVzIGZyb20gYSBwcm9wZXJ0eSdzIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGJlIGNvbnNpZGVyZWRcbiAqIEBwYXJhbSBvQWRkaXRpb25hbFByb3BlcnR5IFRoZSBhZGRpdGlvbmFsIHByb3BlcnR5IGNvdWxkIHJlZmVyIHRvIHRoZSB0ZXh0LCBjdXJyZW5jeSwgdW5pdCBvciB0aW1lem9uZS5cbiAqIEBwYXJhbSBvQ29sdW1uIFRoZSBjb2x1bW4gYWxyZWFkeSBhdmFpbGFibGUgb24gdGhlIFZhbHVlSGVscFRhYmxlLlxuICogSXQgY29udGFpbnMgb25seSBiYXNpYyBwcm9wZXJ0eSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgdGhlIFZhbHVlSGVscC5cbiAqIEByZXR1cm5zIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgdGhhdCB3ZXJlIGlkZW50aWZpZWQuXG4gKi9cbmZ1bmN0aW9uIF9jb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMob1Byb3BlcnR5OiBQcm9wZXJ0eSwgb0FkZGl0aW9uYWxQcm9wZXJ0eTogUHJvcGVydHkgfCB1bmRlZmluZWQsIG9Db2x1bW46IFZhbHVlSGVscFRhYmxlQ29sdW1uKSB7XG5cdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0aWVzOiBDb21wbGV4UHJvcGVydHlJbmZvID0geyBwcm9wZXJ0aWVzOiB7fSB9LFxuXHRcdHRleHRBbm5vdGF0aW9uID0gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQsXG5cdFx0dGV4dEFycmFuZ2VtZW50ID0gdGV4dEFubm90YXRpb24/LmFubm90YXRpb25zPy5VST8uVGV4dEFycmFuZ2VtZW50Py50b1N0cmluZygpLFxuXHRcdGRpc3BsYXlNb2RlID0gdGV4dEFubm90YXRpb24gJiYgdGV4dEFycmFuZ2VtZW50ICYmIGdldERpc3BsYXlNb2RlKG9Qcm9wZXJ0eSk7XG5cdGlmIChvQWRkaXRpb25hbFByb3BlcnR5KSB7XG5cdFx0aWYgKGRpc3BsYXlNb2RlID09PSBcIkRlc2NyaXB0aW9uXCIpIHtcblx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLnByb3BlcnRpZXNbb0FkZGl0aW9uYWxQcm9wZXJ0eS5uYW1lXSA9IG9BZGRpdGlvbmFsUHJvcGVydHk7XG5cdFx0fSBlbHNlIGlmICgoZGlzcGxheU1vZGUgJiYgZGlzcGxheU1vZGUgIT09IFwiVmFsdWVcIikgfHwgIXRleHRBbm5vdGF0aW9uKSB7XG5cdFx0XHRyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzW29Qcm9wZXJ0eS5uYW1lXSA9IG9Db2x1bW47XG5cdFx0XHRyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzW29BZGRpdGlvbmFsUHJvcGVydHkubmFtZV0gPSBvQWRkaXRpb25hbFByb3BlcnR5O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVsYXRlZFByb3BlcnRpZXM7XG59XG5cbk9EYXRhVGFibGVEZWxlZ2F0ZS5fY3JlYXRlUHJvcGVydHlJbmZvcyA9IGZ1bmN0aW9uIChvVGFibGU6IGFueSwgb01vZGVsOiBhbnkpIHtcblx0Y29uc3Qgb01ldGFkYXRhSW5mbyA9IG9UYWJsZS5nZXREZWxlZ2F0ZSgpLnBheWxvYWQ7XG5cdGNvbnN0IGFQcm9wZXJ0aWVzOiBWYWx1ZUhlbHBUYWJsZUNvbHVtbltdID0gW107XG5cdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gYC8ke29NZXRhZGF0YUluZm8uY29sbGVjdGlvbk5hbWV9YDtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKTtcblxuXHRyZXR1cm4gb01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke3NFbnRpdHlTZXRQYXRofUBgKS50aGVuKGZ1bmN0aW9uIChtRW50aXR5U2V0QW5ub3RhdGlvbnM6IGFueSkge1xuXHRcdGNvbnN0IG9Tb3J0UmVzdHJpY3Rpb25zID0gbUVudGl0eVNldEFubm90YXRpb25zW1wiQE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU29ydFJlc3RyaWN0aW9uc1wiXTtcblx0XHRjb25zdCBvU29ydFJlc3RyaWN0aW9uc0luZm8gPSBPRGF0YU1ldGFNb2RlbFV0aWwuZ2V0U29ydFJlc3RyaWN0aW9uc0luZm8ob1NvcnRSZXN0cmljdGlvbnMpO1xuXHRcdGNvbnN0IG9GaWx0ZXJSZXN0cmljdGlvbnMgPSBtRW50aXR5U2V0QW5ub3RhdGlvbnNbXCJAT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5GaWx0ZXJSZXN0cmljdGlvbnNcIl07XG5cdFx0Y29uc3Qgb0ZpbHRlclJlc3RyaWN0aW9uc0luZm8gPSBPRGF0YU1ldGFNb2RlbFV0aWwuZ2V0RmlsdGVyUmVzdHJpY3Rpb25zSW5mbyhvRmlsdGVyUmVzdHJpY3Rpb25zKTtcblxuXHRcdGNvbnN0IGN1c3RvbURhdGFGb3JDb2x1bW5zID0gTWFjcm9zRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEob1RhYmxlLCBcImNvbHVtbnNcIik7XG5cdFx0Y29uc3QgcHJvcGVydGllc1RvQmVDcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBWYWx1ZUhlbHBUYWJsZUNvbHVtbj4gPSB7fTtcblx0XHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlID0gZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzKG9UYWJsZS5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLmdldENvbnRleHQoc0VudGl0eVNldFBhdGgpKS50YXJnZXRFbnRpdHlUeXBlO1xuXHRcdGN1c3RvbURhdGFGb3JDb2x1bW5zLmN1c3RvbURhdGEuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uRGVmOiBhbnkpIHtcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eUluZm86IFZhbHVlSGVscFRhYmxlQ29sdW1uID0ge1xuXHRcdFx0XHRuYW1lOiBjb2x1bW5EZWYucGF0aCxcblx0XHRcdFx0bGFiZWw6IGNvbHVtbkRlZi5sYWJlbCxcblx0XHRcdFx0c29ydGFibGU6IF9pc1NvcnRhYmxlUHJvcGVydHkob1NvcnRSZXN0cmljdGlvbnNJbmZvLCBjb2x1bW5EZWYpLFxuXHRcdFx0XHRmaWx0ZXJhYmxlOiBfaXNGaWx0ZXJhYmxlUHJvcGVydHkob0ZpbHRlclJlc3RyaWN0aW9uc0luZm8sIGNvbHVtbkRlZiksXG5cdFx0XHRcdG1heENvbmRpdGlvbnM6IF9nZXRQcm9wZXJ0eU1heENvbmRpdGlvbnMob0ZpbHRlclJlc3RyaWN0aW9uc0luZm8sIGNvbHVtbkRlZiksXG5cdFx0XHRcdHR5cGVDb25maWc6IE1hY3Jvc0RlbGVnYXRlVXRpbC5pc1R5cGVGaWx0ZXJhYmxlKGNvbHVtbkRlZi4kVHlwZSlcblx0XHRcdFx0XHQ/IG9UYWJsZS5nZXRUeXBlVXRpbCgpLmdldFR5cGVDb25maWcoY29sdW1uRGVmLiRUeXBlKVxuXHRcdFx0XHRcdDogdW5kZWZpbmVkXG5cdFx0XHR9O1xuXHRcdFx0bGV0IG9Qcm9wZXJ0eSA9IHRhcmdldEVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5maW5kKChwcm9wKSA9PiBwcm9wLm5hbWUgPT09IGNvbHVtbkRlZi5wYXRoKTtcblx0XHRcdC8vIENoZWNrIGlmIGl0J3MgYSBuYXZpZ2F0aW9uIHByb3BlcnR5IGFuZCBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgZnJvbSB0aGUgbmF2aWdhdGlvblByb3BlcnR5XG5cdFx0XHRpZiAoIW9Qcm9wZXJ0eSkge1xuXHRcdFx0XHRvUHJvcGVydHkgPSBfZ2V0TmF2aWdhdGlvblByb3BlcnR5KHRhcmdldEVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMsIGNvbHVtbkRlZik7XG5cdFx0XHR9XG5cdFx0XHRpZiAob1Byb3BlcnR5KSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5VHlwZUNvbmZpZyA9IGZldGNoVHlwZUNvbmZpZyhvUHJvcGVydHkpO1xuXHRcdFx0XHRjb25zdCBvVHlwZUNvbmZpZyA9XG5cdFx0XHRcdFx0VHlwZVV0aWwuZ2V0VHlwZUNvbmZpZyhwcm9wZXJ0eVR5cGVDb25maWcudHlwZSwgcHJvcGVydHlUeXBlQ29uZmlnLmZvcm1hdE9wdGlvbnMsIHByb3BlcnR5VHlwZUNvbmZpZy5jb25zdHJhaW50cykgfHxcblx0XHRcdFx0XHRvVGFibGUuZ2V0VHlwZVV0aWwoKS5nZXRUeXBlQ29uZmlnKGNvbHVtbkRlZi4kVHlwZSk7XG5cdFx0XHRcdC8vQ2hlY2sgaWYgdGhlcmUgaXMgYW4gYWRkaXRpb25hbCBwcm9wZXJ0eSBsaW5rZWQgdG8gdGhlIHByb3BlcnR5IGFzIGEgVW5pdCwgQ3VycmVuY3ksIFRpbWV6b25lIG9yIHRleHRBcnJhbmdlbWVudFxuXHRcdFx0XHRjb25zdCBhZGRpdGlvbmFsUHJvcGVydHkgPSBfZ2V0QWRkaXRpb25hbFByb3BlcnR5KG9Qcm9wZXJ0eSk7XG5cdFx0XHRcdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mbzogQ29tcGxleFByb3BlcnR5SW5mbyA9IF9jb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMob1Byb3BlcnR5LCBhZGRpdGlvbmFsUHJvcGVydHksIGNvbHVtbkRlZik7XG5cdFx0XHRcdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0eU5hbWVzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzKTtcblxuXHRcdFx0XHRpZiAocmVsYXRlZFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdG9Qcm9wZXJ0eUluZm8ucHJvcGVydHlJbmZvcyA9IHJlbGF0ZWRQcm9wZXJ0eU5hbWVzO1xuXHRcdFx0XHRcdC8vQ29tcGxleCBwcm9wZXJ0aWVzIG11c3QgYmUgaGlkZGVuIGZvciBzb3J0aW5nIGFuZCBmaWx0ZXJpbmdcblx0XHRcdFx0XHRvUHJvcGVydHlJbmZvLnNvcnRhYmxlID0gZmFsc2U7XG5cdFx0XHRcdFx0b1Byb3BlcnR5SW5mby5maWx0ZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRcdFx0Ly8gQ29sbGVjdCBpbmZvcm1hdGlvbiBvZiByZWxhdGVkIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cblx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydHlOYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB7XG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzVG9CZUNyZWF0ZWRbbmFtZV0gPSByZWxhdGVkUHJvcGVydGllc0luZm8ucHJvcGVydGllc1tuYW1lXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyBBbHNvIGFkZCBwcm9wZXJ0eSBmb3IgdGhlIGluT3V0IFBhcmFtZXRlcnMgb24gdGhlIFZhbHVlSGVscCB3aGVuIHRleHRBcnJhbmdlbWVudCBpcyBzZXQgdG8gI1RleHRPbmx5XG5cdFx0XHRcdFx0Ly8gSXQgd2lsbCBub3QgYmUgbGlua2VkIHRvIHRoZSBjb21wbGV4IFByb3BlcnR5IChCQ1AgMjI3MDE0MTE1NClcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydHlOYW1lcy5zb21lKChuYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG5hbWUgIT09IG9Qcm9wZXJ0eT8ubmFtZTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzVG9CZUNyZWF0ZWRbb1Byb3BlcnR5Lm5hbWVdID0gb1Byb3BlcnR5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvUHJvcGVydHlJbmZvLnBhdGggPSBjb2x1bW5EZWYucGF0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRvUHJvcGVydHlJbmZvLnR5cGVDb25maWcgPSBvUHJvcGVydHlJbmZvLnR5cGVDb25maWcgPyBvVHlwZUNvbmZpZyA6IHVuZGVmaW5lZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9Qcm9wZXJ0eUluZm8ucGF0aCA9IGNvbHVtbkRlZi5wYXRoO1xuXHRcdFx0fVxuXHRcdFx0YVByb3BlcnRpZXMucHVzaChvUHJvcGVydHlJbmZvKTtcblx0XHR9KTtcblx0XHRjb25zdCByZWxhdGVkQ29sdW1ucyA9IF9jcmVhdGVSZWxhdGVkUHJvcGVydGllcyhwcm9wZXJ0aWVzVG9CZUNyZWF0ZWQsIGFQcm9wZXJ0aWVzLCBvU29ydFJlc3RyaWN0aW9uc0luZm8sIG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvKTtcblxuXHRcdHJldHVybiBhUHJvcGVydGllcy5jb25jYXQocmVsYXRlZENvbHVtbnMpO1xuXHR9KTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgYmluZGluZyBpbmZvIHdpdGggdGhlIHJlbGV2YW50IHBhdGggYW5kIG1vZGVsIGZyb20gdGhlIG1ldGFkYXRhLlxuICpcbiAqIEBwYXJhbSBvTURDVGFibGUgVGhlIE1EQ1RhYmxlIGluc3RhbmNlXG4gKiBAcGFyYW0gb0JpbmRpbmdJbmZvIFRoZSBiaW5kaW5nSW5mbyBvZiB0aGUgdGFibGVcbiAqL1xuT0RhdGFUYWJsZURlbGVnYXRlLnVwZGF0ZUJpbmRpbmdJbmZvID0gZnVuY3Rpb24gKG9NRENUYWJsZTogYW55LCBvQmluZGluZ0luZm86IGFueSkge1xuXHRUYWJsZURlbGVnYXRlLnVwZGF0ZUJpbmRpbmdJbmZvLmFwcGx5KHRoaXMsIFtvTURDVGFibGUsIG9CaW5kaW5nSW5mb10pO1xuXHRpZiAoIW9NRENUYWJsZSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IG9NZXRhZGF0YUluZm8gPSBvTURDVGFibGUuZ2V0RGVsZWdhdGUoKS5wYXlsb2FkO1xuXG5cdGlmIChvTWV0YWRhdGFJbmZvICYmIG9CaW5kaW5nSW5mbykge1xuXHRcdG9CaW5kaW5nSW5mby5wYXRoID0gb0JpbmRpbmdJbmZvLnBhdGggfHwgb01ldGFkYXRhSW5mby5jb2xsZWN0aW9uUGF0aCB8fCBgLyR7b01ldGFkYXRhSW5mby5jb2xsZWN0aW9uTmFtZX1gO1xuXHRcdG9CaW5kaW5nSW5mby5tb2RlbCA9IG9CaW5kaW5nSW5mby5tb2RlbCB8fCBvTWV0YWRhdGFJbmZvLm1vZGVsO1xuXHR9XG5cblx0aWYgKCFvQmluZGluZ0luZm8pIHtcblx0XHRvQmluZGluZ0luZm8gPSB7fTtcblx0fVxuXG5cdGNvbnN0IG9GaWx0ZXIgPSBDb3JlLmJ5SWQob01EQ1RhYmxlLmdldEZpbHRlcigpKSBhcyBhbnksXG5cdFx0YkZpbHRlckVuYWJsZWQgPSBvTURDVGFibGUuaXNGaWx0ZXJpbmdFbmFibGVkKCk7XG5cdGxldCBtQ29uZGl0aW9uczogYW55O1xuXHRsZXQgb0lubmVyRmlsdGVySW5mbywgb091dGVyRmlsdGVySW5mbzogYW55O1xuXHRjb25zdCBhRmlsdGVycyA9IFtdO1xuXHRjb25zdCBhVGFibGVQcm9wZXJ0aWVzID0gb01EQ1RhYmxlLmRhdGEoXCIkdGFibGVQcm9wZXJ0eUluZm9cIik7XG5cblx0Ly9UT0RPOiBjb25zaWRlciBhIG1lY2hhbmlzbSAoJ0ZpbHRlck1lcmdlVXRpbCcgb3IgZW5oYW5jZSAnRmlsdGVyVXRpbCcpIHRvIGFsbG93IHRoZSBjb25uZWN0aW9uIGJldHdlZW4gZGlmZmVyZW50IGZpbHRlcnMpXG5cdGlmIChiRmlsdGVyRW5hYmxlZCkge1xuXHRcdG1Db25kaXRpb25zID0gb01EQ1RhYmxlLmdldENvbmRpdGlvbnMoKTtcblx0XHRvSW5uZXJGaWx0ZXJJbmZvID0gRmlsdGVyVXRpbC5nZXRGaWx0ZXJJbmZvKG9NRENUYWJsZSwgbUNvbmRpdGlvbnMsIGFUYWJsZVByb3BlcnRpZXMsIFtdKSBhcyBhbnk7XG5cdFx0aWYgKG9Jbm5lckZpbHRlckluZm8uZmlsdGVycykge1xuXHRcdFx0YUZpbHRlcnMucHVzaChvSW5uZXJGaWx0ZXJJbmZvLmZpbHRlcnMpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChvRmlsdGVyKSB7XG5cdFx0bUNvbmRpdGlvbnMgPSBvRmlsdGVyLmdldENvbmRpdGlvbnMoKTtcblx0XHRpZiAobUNvbmRpdGlvbnMpIHtcblx0XHRcdGNvbnN0IGFQYXJhbWV0ZXJOYW1lcyA9IERlbGVnYXRlVXRpbC5nZXRQYXJhbWV0ZXJOYW1lcyhvRmlsdGVyKTtcblx0XHRcdC8vIFRoZSB0YWJsZSBwcm9wZXJ0aWVzIG5lZWRzIHRvIHVwZGF0ZWQgd2l0aCB0aGUgZmlsdGVyIGZpZWxkIGlmIG5vIFNlbGVjdGlvbmZpZXJsZHMgYXJlIGFubm90YXRlZCBhbmQgbm90IHBhcnQgYXMgdmFsdWUgaGVscCBwYXJhbWV0ZXJcblx0XHRcdE9EYXRhVGFibGVEZWxlZ2F0ZS5fdXBkYXRlUHJvcGVydHlJbmZvKGFUYWJsZVByb3BlcnRpZXMsIG9NRENUYWJsZSwgbUNvbmRpdGlvbnMsIG9NZXRhZGF0YUluZm8pO1xuXHRcdFx0b091dGVyRmlsdGVySW5mbyA9IEZpbHRlclV0aWwuZ2V0RmlsdGVySW5mbyhvRmlsdGVyLCBtQ29uZGl0aW9ucywgYVRhYmxlUHJvcGVydGllcywgYVBhcmFtZXRlck5hbWVzKTtcblxuXHRcdFx0aWYgKG9PdXRlckZpbHRlckluZm8uZmlsdGVycykge1xuXHRcdFx0XHRhRmlsdGVycy5wdXNoKG9PdXRlckZpbHRlckluZm8uZmlsdGVycyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNQYXJhbWV0ZXJQYXRoID0gRGVsZWdhdGVVdGlsLmdldFBhcmFtZXRlcnNJbmZvKG9GaWx0ZXIsIG1Db25kaXRpb25zKTtcblx0XHRcdGlmIChzUGFyYW1ldGVyUGF0aCkge1xuXHRcdFx0XHRvQmluZGluZ0luZm8ucGF0aCA9IHNQYXJhbWV0ZXJQYXRoO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGdldCB0aGUgYmFzaWMgc2VhcmNoXG5cdFx0b0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJHNlYXJjaCA9IENvbW1vblV0aWxzLm5vcm1hbGl6ZVNlYXJjaFRlcm0ob0ZpbHRlci5nZXRTZWFyY2goKSkgfHwgdW5kZWZpbmVkO1xuXHR9XG5cblx0dGhpcy5fYXBwbHlEZWZhdWx0U29ydGluZyhvQmluZGluZ0luZm8sIG9NRENUYWJsZS5nZXREZWxlZ2F0ZSgpLnBheWxvYWQpO1xuXHQvLyBhZGQgc2VsZWN0IHRvIG9CaW5kaW5nSW5mbyAoQkNQIDIxNzAxNjMwMTIpXG5cdG9CaW5kaW5nSW5mby5wYXJhbWV0ZXJzLiRzZWxlY3QgPSBhVGFibGVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAoc1F1ZXJ5OiBzdHJpbmcsIG9Qcm9wZXJ0eTogYW55KSB7XG5cdFx0Ly8gTmF2aWdhdGlvbiBwcm9wZXJ0aWVzIChyZXByZXNlbnRlZCBieSBYL1kpIHNob3VsZCBub3QgYmUgYWRkZWQgdG8gJHNlbGVjdC5cblx0XHQvLyBUb0RvIDogVGhleSBzaG91bGQgYmUgYWRkZWQgYXMgJGV4cGFuZD1YKCRzZWxlY3Q9WSkgaW5zdGVhZFxuXHRcdGlmIChvUHJvcGVydHkucGF0aCAmJiBvUHJvcGVydHkucGF0aC5pbmRleE9mKFwiL1wiKSA9PT0gLTEpIHtcblx0XHRcdHNRdWVyeSA9IHNRdWVyeSA/IGAke3NRdWVyeX0sJHtvUHJvcGVydHkucGF0aH1gIDogb1Byb3BlcnR5LnBhdGg7XG5cdFx0fVxuXHRcdHJldHVybiBzUXVlcnk7XG5cdH0sIFwiXCIpO1xuXG5cdC8vIEFkZCAkY291bnRcblx0b0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJGNvdW50ID0gdHJ1ZTtcblxuXHQvL0lmIHRoZSBlbnRpdHkgaXMgRHJhZnRFbmFibGVkIGFkZCBhIERyYWZ0RmlsdGVyXG5cdGlmIChNb2RlbEhlbHBlci5pc0RyYWZ0U3VwcG9ydGVkKG9NRENUYWJsZS5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLCBvQmluZGluZ0luZm8ucGF0aCkpIHtcblx0XHRhRmlsdGVycy5wdXNoKG5ldyBGaWx0ZXIoXCJJc0FjdGl2ZUVudGl0eVwiLCBGaWx0ZXJPcGVyYXRvci5FUSwgdHJ1ZSkpO1xuXHR9XG5cblx0b0JpbmRpbmdJbmZvLmZpbHRlcnMgPSBuZXcgRmlsdGVyKGFGaWx0ZXJzLCB0cnVlKTtcbn07XG5cbk9EYXRhVGFibGVEZWxlZ2F0ZS5nZXRUeXBlVXRpbCA9IGZ1bmN0aW9uICgvKm9QYXlsb2FkKi8pIHtcblx0cmV0dXJuIFR5cGVVdGlsO1xufTtcblxuT0RhdGFUYWJsZURlbGVnYXRlLl9nZXRNb2RlbCA9IGZ1bmN0aW9uIChvVGFibGU6IFRhYmxlKSB7XG5cdGNvbnN0IG9NZXRhZGF0YUluZm8gPSAob1RhYmxlLmdldERlbGVnYXRlKCkgYXMgYW55KS5wYXlsb2FkO1xuXHRyZXR1cm4gb1RhYmxlLmdldE1vZGVsKG9NZXRhZGF0YUluZm8ubW9kZWwpO1xufTtcblxuLyoqXG4gKiBBcHBsaWVzIGEgZGVmYXVsdCBzb3J0IG9yZGVyIGlmIG5lZWRlZC4gVGhpcyBpcyBvbmx5IHRoZSBjYXNlIGlmIHRoZSByZXF1ZXN0IGlzIG5vdCBhICRzZWFyY2ggcmVxdWVzdFxuICogKG1lYW5zIHRoZSBwYXJhbWV0ZXIgJHNlYXJjaCBvZiB0aGUgYmluZGluZ0luZm8gaXMgdW5kZWZpbmVkKSBhbmQgaWYgbm90IGFscmVhZHkgYSBzb3J0IG9yZGVyIGlzIHNldCxcbiAqIGUuZy4gdmlhIHByZXNlbnRhdGlvbiB2YXJpYW50IG9yIG1hbnVhbCBieSB0aGUgdXNlci5cbiAqXG4gKiBAcGFyYW0gb0JpbmRpbmdJbmZvIFRoZSBiaW5kaW5nSW5mbyBvZiB0aGUgdGFibGVcbiAqIEBwYXJhbSBvUGF5bG9hZCBUaGUgcGF5bG9hZCBvZiB0aGUgVGFibGVEZWxlZ2F0ZVxuICovXG5PRGF0YVRhYmxlRGVsZWdhdGUuX2FwcGx5RGVmYXVsdFNvcnRpbmcgPSBmdW5jdGlvbiAob0JpbmRpbmdJbmZvOiBhbnksIG9QYXlsb2FkOiBhbnkpIHtcblx0aWYgKG9CaW5kaW5nSW5mby5wYXJhbWV0ZXJzICYmIG9CaW5kaW5nSW5mby5wYXJhbWV0ZXJzLiRzZWFyY2ggPT0gdW5kZWZpbmVkICYmIG9CaW5kaW5nSW5mby5zb3J0ZXIgJiYgb0JpbmRpbmdJbmZvLnNvcnRlci5sZW5ndGggPT0gMCkge1xuXHRcdGNvbnN0IGRlZmF1bHRTb3J0UHJvcGVydHlOYW1lID0gb1BheWxvYWQgPyBvUGF5bG9hZC5kZWZhdWx0U29ydFByb3BlcnR5TmFtZSA6IHVuZGVmaW5lZDtcblx0XHRpZiAoZGVmYXVsdFNvcnRQcm9wZXJ0eU5hbWUpIHtcblx0XHRcdG9CaW5kaW5nSW5mby5zb3J0ZXIucHVzaChuZXcgU29ydGVyKGRlZmF1bHRTb3J0UHJvcGVydHlOYW1lLCBmYWxzZSkpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB0YWJsZSBwcm9wZXJ0aWVzIHdpdGggZmlsdGVyIGZpZWxkIGluZm9zLlxuICpcbiAqIEBwYXJhbSBhVGFibGVQcm9wZXJ0aWVzIEFycmF5IHdpdGggdGFibGUgcHJvcGVydGllc1xuICogQHBhcmFtIG9NRENUYWJsZSBUaGUgTURDVGFibGUgaW5zdGFuY2VcbiAqIEBwYXJhbSBtQ29uZGl0aW9ucyBUaGUgY29uZGl0aW9ucyBvZiB0aGUgdGFibGVcbiAqIEBwYXJhbSBvTWV0YWRhdGFJbmZvIFRoZSBtZXRhZGF0YSBpbmZvIG9mIHRoZSBmaWx0ZXIgZmllbGRcbiAqL1xuT0RhdGFUYWJsZURlbGVnYXRlLl91cGRhdGVQcm9wZXJ0eUluZm8gPSBmdW5jdGlvbiAoXG5cdGFUYWJsZVByb3BlcnRpZXM6IGFueVtdLFxuXHRvTURDVGFibGU6IE1EQ1RhYmxlLFxuXHRtQ29uZGl0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pixcblx0b01ldGFkYXRhSW5mbzogYW55XG4pIHtcblx0Y29uc3QgYUNvbmRpdGlvbktleSA9IE9iamVjdC5rZXlzKG1Db25kaXRpb25zKSxcblx0XHRvTWV0YU1vZGVsID0gb01EQ1RhYmxlLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdGFDb25kaXRpb25LZXkuZm9yRWFjaChmdW5jdGlvbiAoY29uZGl0aW9uS2V5OiBhbnkpIHtcblx0XHRpZiAoXG5cdFx0XHRhVGFibGVQcm9wZXJ0aWVzLmZpbmRJbmRleChmdW5jdGlvbiAodGFibGVQcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRcdHJldHVybiB0YWJsZVByb3BlcnR5LnBhdGggPT09IGNvbmRpdGlvbktleTtcblx0XHRcdH0pID09PSAtMVxuXHRcdCkge1xuXHRcdFx0Y29uc3Qgb0NvbHVtbkRlZiA9IHtcblx0XHRcdFx0cGF0aDogY29uZGl0aW9uS2V5LFxuXHRcdFx0XHR0eXBlQ29uZmlnOiBvTURDVGFibGVcblx0XHRcdFx0XHQuZ2V0VHlwZVV0aWwoKVxuXHRcdFx0XHRcdC5nZXRUeXBlQ29uZmlnKG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtvTWV0YWRhdGFJbmZvLmNvbGxlY3Rpb25OYW1lfS8ke2NvbmRpdGlvbktleX1gKS4kVHlwZSlcblx0XHRcdH07XG5cdFx0XHRhVGFibGVQcm9wZXJ0aWVzLnB1c2gob0NvbHVtbkRlZik7XG5cdFx0fVxuXHR9KTtcbn07XG5cbk9EYXRhVGFibGVEZWxlZ2F0ZS51cGRhdGVCaW5kaW5nID0gZnVuY3Rpb24gKG9UYWJsZTogYW55LCBvQmluZGluZ0luZm86IGFueSwgb0JpbmRpbmc6IGFueSkge1xuXHRsZXQgYk5lZWRNYW51YWxSZWZyZXNoID0gZmFsc2U7XG5cdGNvbnN0IG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0ID0gb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cdGNvbnN0IHNNYW51YWxVcGRhdGVQcm9wZXJ0eUtleSA9IFwicGVuZGluZ01hbnVhbEJpbmRpbmdVcGRhdGVcIjtcblx0Y29uc3QgYlBlbmRpbmdNYW51YWxVcGRhdGUgPSBvSW50ZXJuYWxCaW5kaW5nQ29udGV4dD8uZ2V0UHJvcGVydHkoc01hbnVhbFVwZGF0ZVByb3BlcnR5S2V5KTtcblx0bGV0IG9Sb3dCaW5kaW5nID0gb1RhYmxlLmdldFJvd0JpbmRpbmcoKTtcblx0aWYgKG9Sb3dCaW5kaW5nKSB7XG5cdFx0LyoqXG5cdFx0ICogTWFudWFsIHJlZnJlc2ggaWYgZmlsdGVycyBhcmUgbm90IGNoYW5nZWQgYnkgYmluZGluZy5yZWZyZXNoKCkgc2luY2UgdXBkYXRpbmcgdGhlIGJpbmRpbmdJbmZvXG5cdFx0ICogaXMgbm90IGVub3VnaCB0byB0cmlnZ2VyIGEgYmF0Y2ggcmVxdWVzdC5cblx0XHQgKiBSZW1vdmluZyBjb2x1bW5zIGNyZWF0ZXMgb25lIGJhdGNoIHJlcXVlc3QgdGhhdCB3YXMgbm90IGV4ZWN1dGVkIGJlZm9yZVxuXHRcdCAqL1xuXHRcdGNvbnN0IG9sZEZpbHRlcnMgPSBvUm93QmluZGluZy5nZXRGaWx0ZXJzKFwiQXBwbGljYXRpb25cIik7XG5cdFx0Yk5lZWRNYW51YWxSZWZyZXNoID1cblx0XHRcdGRlZXBFcXVhbChvQmluZGluZ0luZm8uZmlsdGVycywgb2xkRmlsdGVyc1swXSkgJiZcblx0XHRcdG9Sb3dCaW5kaW5nLmdldFF1ZXJ5T3B0aW9uc0Zyb21QYXJhbWV0ZXJzKCkuJHNlYXJjaCA9PT0gb0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJHNlYXJjaCAmJlxuXHRcdFx0IWJQZW5kaW5nTWFudWFsVXBkYXRlO1xuXHR9XG5cdFRhYmxlRGVsZWdhdGUudXBkYXRlQmluZGluZy5hcHBseShPRGF0YVRhYmxlRGVsZWdhdGUsIFtvVGFibGUsIG9CaW5kaW5nSW5mbywgb0JpbmRpbmddKTtcblx0aWYgKCFvUm93QmluZGluZykge1xuXHRcdG9Sb3dCaW5kaW5nID0gb1RhYmxlLmdldFJvd0JpbmRpbmcoKTtcblx0fSAvL2dldCByb3cgYmluZGluZyBhZnRlciByZWJpbmQgZnJvbSBUYWJsZURlbGVnYXRlLnVwZGF0ZUJpbmRpbmcgaW4gY2FzZSBvQmluZGluZyB3YXMgdW5kZWZpbmVkXG5cdGlmIChiTmVlZE1hbnVhbFJlZnJlc2ggJiYgb1RhYmxlLmdldEZpbHRlcigpICYmIG9CaW5kaW5nKSB7XG5cdFx0b0ludGVybmFsQmluZGluZ0NvbnRleHQ/LnNldFByb3BlcnR5KHNNYW51YWxVcGRhdGVQcm9wZXJ0eUtleSwgdHJ1ZSk7XG5cdFx0b1Jvd0JpbmRpbmdcblx0XHRcdC5yZXF1ZXN0UmVmcmVzaChvUm93QmluZGluZy5nZXRHcm91cElkKCkpXG5cdFx0XHQuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG9JbnRlcm5hbEJpbmRpbmdDb250ZXh0Py5zZXRQcm9wZXJ0eShzTWFudWFsVXBkYXRlUHJvcGVydHlLZXksIGZhbHNlKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIHJlZnJlc2hpbmcgYSBmaWx0ZXJCYXIgVkggdGFibGVcIiwgb0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cdG9UYWJsZS5maXJlRXZlbnQoXCJiaW5kaW5nVXBkYXRlZFwiKTtcblx0Ly9ubyBuZWVkIHRvIGNoZWNrIGZvciBzZW1hbnRpYyB0YXJnZXRzIGhlcmUgc2luY2Ugd2UgYXJlIGluIGEgVkggYW5kIGRvbid0IHdhbnQgdG8gYWxsb3cgZnVydGhlciBuYXZpZ2F0aW9uXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzaW1wbGUgcHJvcGVydHkgZm9yIGVhY2ggaWRlbnRpZmllZCBjb21wbGV4IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzVG9CZUNyZWF0ZWQgSWRlbnRpZmllZCBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIGV4aXN0aW5nQ29sdW1ucyBUaGUgbGlzdCBvZiBjb2x1bW5zIGNyZWF0ZWQgZm9yIHByb3BlcnRpZXMgZGVmaW5lZCBvbiB0aGUgVmFsdWUgTGlzdC5cbiAqIEBwYXJhbSBvU29ydFJlc3RyaWN0aW9uc0luZm8gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHNvcnQgcmVzdHJpY3Rpb24gaW5mb3JtYXRpb25cbiAqIEBwYXJhbSBvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZmlsdGVyIHJlc3RyaWN0aW9uIGluZm9ybWF0aW9uXG4gKiBAcmV0dXJucyBUaGUgYXJyYXkgb2YgcHJvcGVydGllcyBjcmVhdGVkLlxuICovXG5mdW5jdGlvbiBfY3JlYXRlUmVsYXRlZFByb3BlcnRpZXMoXG5cdHByb3BlcnRpZXNUb0JlQ3JlYXRlZDogUmVjb3JkPHN0cmluZywgVmFsdWVIZWxwVGFibGVDb2x1bW4+LFxuXHRleGlzdGluZ0NvbHVtbnM6IFZhbHVlSGVscFRhYmxlQ29sdW1uW10sXG5cdG9Tb3J0UmVzdHJpY3Rpb25zSW5mbzogYW55LFxuXHRvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbzogYW55XG4pIHtcblx0Y29uc3QgcmVsYXRlZFByb3BlcnR5TmFtZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9LFxuXHRcdHJlbGF0ZWRDb2x1bW5zOiBWYWx1ZUhlbHBUYWJsZUNvbHVtbltdID0gW107XG5cdE9iamVjdC5rZXlzKHByb3BlcnRpZXNUb0JlQ3JlYXRlZCkuZm9yRWFjaCgobmFtZSkgPT4ge1xuXHRcdGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydGllc1RvQmVDcmVhdGVkW25hbWVdLFxuXHRcdFx0cmVsYXRlZENvbHVtbiA9IGV4aXN0aW5nQ29sdW1ucy5maW5kKChjb2x1bW4pID0+IGNvbHVtbi5uYW1lID09PSBuYW1lKTtcblx0XHRpZiAoIXJlbGF0ZWRDb2x1bW4gfHwgcmVsYXRlZENvbHVtbj8ucHJvcGVydHlJbmZvcykge1xuXHRcdFx0Y29uc3QgbmV3TmFtZSA9IGBQcm9wZXJ0eTo6JHtuYW1lfWA7XG5cdFx0XHRyZWxhdGVkUHJvcGVydHlOYW1lTWFwW25hbWVdID0gbmV3TmFtZTtcblx0XHRcdGlmICghcHJvcGVydHkucGF0aCB8fCBwcm9wZXJ0eS5wYXRoLmluZGV4T2YoXCIvXCIpID4gMSkge1xuXHRcdFx0XHQvLyBJbiB0aGlzIGNhc2UgdGhlIHJlbGF0ZWQgcHJvcGVydHkgZG9lcyBub3QgZXhpc3QgYmVjYXVzZSBpdCB3YXNuJ3QgY3JlYXRlZCBvbiBsYXN0IGl0ZXJhdGlvbiBvciB3ZSBoYXZlIGEgbmF2aWdhdGlvbiBwcm9wZXJ0eSxcblx0XHRcdFx0Ly8gdGhlbiB3ZSBuZWVkIHRvIHJldHJpZXZlIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5SW5mb1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlID0gKChwcm9wZXJ0eSBhcyBQcm9wZXJ0eSkuYW5ub3RhdGlvbnM/LlVJPy5EYXRhRmllbGREZWZhdWx0IGFzIERhdGFGaWVsZCk/LlZhbHVlO1xuXHRcdFx0XHRwcm9wZXJ0eS5wYXRoID0gcHJvcGVydHkucGF0aCB8fCBwcm9wZXJ0eVZhbHVlLnBhdGg7XG5cdFx0XHRcdHByb3BlcnR5LmxhYmVsID0gZ2V0TGFiZWwocHJvcGVydHkgYXMgUHJvcGVydHkpO1xuXHRcdFx0XHRpZiAoTWFjcm9zRGVsZWdhdGVVdGlsLmlzVHlwZUZpbHRlcmFibGUocHJvcGVydHlWYWx1ZT8uJHRhcmdldC50eXBlKSkge1xuXHRcdFx0XHRcdGNvbnN0IHByb3BlcnR5VHlwZUNvbmZpZyA9IGZldGNoVHlwZUNvbmZpZyhwcm9wZXJ0eSBhcyBQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0cHJvcGVydHkudHlwZUNvbmZpZyA9IFR5cGVVdGlsLmdldFR5cGVDb25maWcoXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVR5cGVDb25maWcudHlwZSxcblx0XHRcdFx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZy5mb3JtYXRPcHRpb25zLFxuXHRcdFx0XHRcdFx0cHJvcGVydHlUeXBlQ29uZmlnLmNvbnN0cmFpbnRzXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHByb3BlcnR5LnBhdGgpIHtcblx0XHRcdFx0cmVsYXRlZENvbHVtbnMucHVzaCh7XG5cdFx0XHRcdFx0bmFtZTogbmV3TmFtZSxcblx0XHRcdFx0XHRsYWJlbDogcHJvcGVydHkubGFiZWwsXG5cdFx0XHRcdFx0cGF0aDogcHJvcGVydHkucGF0aCxcblx0XHRcdFx0XHRzb3J0YWJsZTogX2lzU29ydGFibGVQcm9wZXJ0eShvU29ydFJlc3RyaWN0aW9uc0luZm8sIHByb3BlcnR5KSxcblx0XHRcdFx0XHRmaWx0ZXJhYmxlOiBfaXNGaWx0ZXJhYmxlUHJvcGVydHkob0ZpbHRlclJlc3RyaWN0aW9uc0luZm8sIHByb3BlcnR5KSxcblx0XHRcdFx0XHR0eXBlQ29uZmlnOiByZWxhdGVkQ29sdW1uPy50eXBlQ29uZmlnIHx8IHByb3BlcnR5LnR5cGVDb25maWcsXG5cdFx0XHRcdFx0bWF4Q29uZGl0aW9uczogX2dldFByb3BlcnR5TWF4Q29uZGl0aW9ucyhvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbywgcHJvcGVydHkpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdC8vIFRoZSBwcm9wZXJ0eSAnbmFtZScgaGFzIGJlZW4gcHJlZml4ZWQgd2l0aCAnUHJvcGVydHk6OicgZm9yIHVuaXF1ZW5lc3MuXG5cdC8vIFVwZGF0ZSB0aGUgc2FtZSBpbiBvdGhlciBwcm9wZXJ0eUluZm9zW10gcmVmZXJlbmNlcyB3aGljaCBwb2ludCB0byB0aGlzIHByb3BlcnR5LlxuXHRleGlzdGluZ0NvbHVtbnMuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG5cdFx0aWYgKGNvbHVtbi5wcm9wZXJ0eUluZm9zKSB7XG5cdFx0XHRjb2x1bW4ucHJvcGVydHlJbmZvcyA9IGNvbHVtbi5wcm9wZXJ0eUluZm9zPy5tYXAoKHByb3BlcnR5SW5mbykgPT4gcmVsYXRlZFByb3BlcnR5TmFtZU1hcFtwcm9wZXJ0eUluZm9dID8/IHByb3BlcnR5SW5mbyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHJlbGF0ZWRDb2x1bW5zO1xufVxuLyoqXG4gKiBJZGVudGlmaWVzIGlmIHRoZSBnaXZlbiBwcm9wZXJ0eSBpcyBzb3J0YWJsZSBiYXNlZCBvbiB0aGUgc29ydCByZXN0cmljdGlvbiBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0gb1NvcnRSZXN0cmljdGlvbnNJbmZvIFRoZSBzb3J0IHJlc3RyaWN0aW9uIGluZm9ybWF0aW9uIGZyb20gdGhlIHJlc3RyaWN0aW9uIGFubm90YXRpb24uXG4gKiBAcGFyYW0gcHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgZ2l2ZW4gcHJvcGVydHkgaXMgc29ydGFibGUuXG4gKi9cbmZ1bmN0aW9uIF9pc1NvcnRhYmxlUHJvcGVydHkob1NvcnRSZXN0cmljdGlvbnNJbmZvOiBhbnksIHByb3BlcnR5OiBWYWx1ZUhlbHBUYWJsZUNvbHVtbik6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gcHJvcGVydHkucGF0aCAmJiBvU29ydFJlc3RyaWN0aW9uc0luZm9bcHJvcGVydHkucGF0aF0gPyBvU29ydFJlc3RyaWN0aW9uc0luZm9bcHJvcGVydHkucGF0aF0uc29ydGFibGUgOiBwcm9wZXJ0eS5zb3J0YWJsZTtcbn1cblxuLyoqXG4gKiBJZGVudGlmaWVzIGlmIHRoZSBnaXZlbiBwcm9wZXJ0eSBpcyBmaWx0ZXJhYmxlIGJhc2VkIG9uIHRoZSBzb3J0IHJlc3RyaWN0aW9uIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSBvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbyBUaGUgZmlsdGVyIHJlc3RyaWN0aW9uIGluZm9ybWF0aW9uIGZyb20gdGhlIHJlc3RyaWN0aW9uIGFubm90YXRpb24uXG4gKiBAcGFyYW0gcHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgZ2l2ZW4gcHJvcGVydHkgaXMgZmlsdGVyYWJsZS5cbiAqL1xuZnVuY3Rpb24gX2lzRmlsdGVyYWJsZVByb3BlcnR5KG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvOiBhbnksIHByb3BlcnR5OiBWYWx1ZUhlbHBUYWJsZUNvbHVtbik6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gcHJvcGVydHkucGF0aCAmJiBvRmlsdGVyUmVzdHJpY3Rpb25zSW5mb1twcm9wZXJ0eS5wYXRoXVxuXHRcdD8gb0ZpbHRlclJlc3RyaWN0aW9uc0luZm9bcHJvcGVydHkucGF0aF0uZmlsdGVyYWJsZVxuXHRcdDogcHJvcGVydHkuZmlsdGVyYWJsZTtcbn1cblxuLyoqXG4gKiBJZGVudGlmaWVzIHRoZSBtYXhDb25kaXRpb25zIGZvciBhIGdpdmVuIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbyBUaGUgZmlsdGVyIHJlc3RyaWN0aW9uIGluZm9ybWF0aW9uIGZyb20gdGhlIHJlc3RyaWN0aW9uIGFubm90YXRpb24uXG4gKiBAcGFyYW0gcHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIGAtMWAgb3IgYDFgIGlmIHRoZSBwcm9wZXJ0eSBpcyBhIE11bHRpVmFsdWVGaWx0ZXJFeHByZXNzaW9uLlxuICovXG5mdW5jdGlvbiBfZ2V0UHJvcGVydHlNYXhDb25kaXRpb25zKG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvOiBhbnksIHByb3BlcnR5OiBWYWx1ZUhlbHBUYWJsZUNvbHVtbik6IG51bWJlciB7XG5cdHJldHVybiBwcm9wZXJ0eS5wYXRoICYmIE9EYXRhTWV0YU1vZGVsVXRpbC5pc011bHRpVmFsdWVGaWx0ZXJFeHByZXNzaW9uKG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvLnByb3BlcnR5SW5mb1twcm9wZXJ0eS5wYXRoXSkgPyAtMSA6IDE7XG59XG5cbi8qKlxuICogSWRlbmZpZmllcyBpZiB0aGVyZSBpcyBhIG5hdmlnYXRpb24gcHJvcGVydHkgYW5kIHByb3ZpZGVzIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gbmF2aWdhdGlvblByb3BlcnRpZXMgVGhlIG5hdmlnYXRpb24gUHJvcGVydGllcyBmb3IgdGhlIHRhcmdldCBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSBjb2x1bW5EZWYgVGhlIHRhcmdldCBjb2x1bW4uXG4gKiBAcmV0dXJucyBUaGUgbmF2aWdhdGlvbiBQcm9wZXJ0eSBpZiBpdCBleGlzdHMuXG4gKi9cbmZ1bmN0aW9uIF9nZXROYXZpZ2F0aW9uUHJvcGVydHkobmF2aWdhdGlvblByb3BlcnRpZXM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdLCBjb2x1bW5EZWY6IFZhbHVlSGVscFRhYmxlQ29sdW1uKTogUHJvcGVydHkgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gbmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoID4gMFxuXHRcdD8gbmF2aWdhdGlvblByb3BlcnRpZXMubWFwKChuYXZQcm9wKSA9PlxuXHRcdFx0XHRuYXZQcm9wLnRhcmdldFR5cGUuZW50aXR5UHJvcGVydGllcy5maW5kKChwcm9wKSA9PiBjb2x1bW5EZWYucGF0aCAmJiBjb2x1bW5EZWYucGF0aC5pbmRleE9mKHByb3AubmFtZSkgPiAtMSlcblx0XHQgICk/LlswXVxuXHRcdDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIElkZW50aWZpZXMgdGhlIGFkZGl0aW9uYWwgcHJvcGVydHkgd2hpY2ggcmVmZXJlbmNlcyB0byB0aGUgdW5pdCwgdGltZXpvbmUsIHRleHRBcnJhbmdlbWVudCBvciBjdXJyZW5jeS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHkuXG4gKiBAcmV0dXJucyBUaGUgYWRkaXRpb25hbCBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gX2dldEFkZGl0aW9uYWxQcm9wZXJ0eShvUHJvcGVydHk6IFByb3BlcnR5KSB7XG5cdC8vQWRkaXRpb25hbCBQcm9wZXJ0eSBjb3VsZCByZWZlciB0byBhIG5hdmlnYXRpb24gcHJvcGVydHksIGtlZXAgdGhlIG5hbWUgYW5kIHBhdGggYXMgbmF2aWdhdGlvbiBwcm9wZXJ0eVxuXHRjb25zdCBhZGRpdGlvbmFsUHJvcGVydHlQYXRoID1cblx0XHRnZXRBc3NvY2lhdGVkVGV4dFByb3BlcnR5UGF0aChvUHJvcGVydHkpIHx8XG5cdFx0Z2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHlQYXRoKG9Qcm9wZXJ0eSkgfHxcblx0XHRnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5UGF0aChvUHJvcGVydHkpIHx8XG5cdFx0Z2V0QXNzb2NpYXRlZFRpbWV6b25lUHJvcGVydHlQYXRoKG9Qcm9wZXJ0eSk7XG5cdGNvbnN0IGFzc29jaWF0ZWRQcm9wZXJ0eSA9XG5cdFx0Z2V0QXNzb2NpYXRlZFRleHRQcm9wZXJ0eShvUHJvcGVydHkpIHx8XG5cdFx0Z2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkob1Byb3BlcnR5KSB8fFxuXHRcdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KSB8fFxuXHRcdGdldEFzc29jaWF0ZWRUaW1lem9uZVByb3BlcnR5KG9Qcm9wZXJ0eSk7XG5cdGlmIChhc3NvY2lhdGVkUHJvcGVydHkgJiYgYWRkaXRpb25hbFByb3BlcnR5UGF0aCAmJiBhZGRpdGlvbmFsUHJvcGVydHlQYXRoPy5pbmRleE9mKFwiL1wiKSA+IC0xKSB7XG5cdFx0YXNzb2NpYXRlZFByb3BlcnR5Lm5hbWUgPSBhZGRpdGlvbmFsUHJvcGVydHlQYXRoO1xuXHRcdChhc3NvY2lhdGVkUHJvcGVydHkgYXMgVmFsdWVIZWxwVGFibGVDb2x1bW4pLnBhdGggPSBhZGRpdGlvbmFsUHJvcGVydHlQYXRoO1xuXHR9XG5cdHJldHVybiBhc3NvY2lhdGVkUHJvcGVydHk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9EYXRhVGFibGVEZWxlZ2F0ZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnREE7QUFDQTtBQUNBO0VBQ0EsSUFBTUEsa0JBQWtCLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JDLGFBQWxCLENBQTNCOztFQUVBSCxrQkFBa0IsQ0FBQ0ksZUFBbkIsR0FBcUMsVUFBVUMsTUFBVixFQUF5QjtJQUFBOztJQUM3RCxJQUFNQyxNQUFNLEdBQUcsS0FBS0MsU0FBTCxDQUFlRixNQUFmLENBQWY7O0lBQ0EsSUFBSUcsb0JBQUo7O0lBRUEsSUFBSSxDQUFDRixNQUFMLEVBQWE7TUFDWkUsb0JBQW9CLEdBQUcsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtRQUMvQ0wsTUFBTSxDQUFDTSx3QkFBUCxDQUNDO1VBQ0NDLFFBQVEsRUFBRUY7UUFE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