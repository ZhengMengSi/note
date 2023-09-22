/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/fe/core/CommonUtils", "sap/fe/macros/chart/ChartUtils", "sap/fe/macros/CommonHelper", "sap/fe/macros/filter/FilterUtils", "sap/fe/macros/ODataMetaModelUtil", "sap/ui/mdc/library", "sap/ui/mdc/odata/v4/util/DelegateUtil", "sap/ui/mdc/odata/v4/vizChart/ChartDelegate", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Log, merge, CommonUtils, ChartUtils, CommonHelper, FilterUtils, ODataMetaModelUtil, MDCLib, DelegateUtil, BaseChartDelegate, Filter, FilterOperator) {
  "use strict";

  var ChartItemRoleType = MDCLib.ChartItemRoleType; // /**
  //  * Helper class for sap.ui.mdc.Chart.
  //  * <h3><b>Note:</b></h3>
  //  * The class is experimental and the API/behaviour is not finalised
  //  * and hence this should not be used for productive usage.
  //  * Especially this class is not intended to be used for the FE scenario,
  //  * here we shall use sap.fe.macros.ChartDelegate that is especially tailored for V4
  //  * meta model
  //  *
  //  * @author SAP SE
  //  * @private
  //  * @experimental
  //  * @since 1.62
  //  * @alias sap.fe.macros.ChartDelegate
  //  */

  var ChartDelegate = Object.assign({}, BaseChartDelegate);

  ChartDelegate._setChartNoDataText = function (oChart, oBindingInfo) {
    var sNoDataKey = "";
    var oChartFilterInfo = ChartUtils.getAllFilterInfo(oChart),
        suffixResourceKey = oBindingInfo.path.startsWith("/") ? oBindingInfo.path.substr(1) : oBindingInfo.path;

    var _getNoDataTextWithFilters = function () {
      if (oChart.data("multiViews")) {
        return "M_TABLE_AND_CHART_NO_DATA_TEXT_MULTI_VIEW";
      } else {
        return "T_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER";
      }
    };

    if (oChart.getFilter()) {
      if (oChartFilterInfo.search || oChartFilterInfo.filters && oChartFilterInfo.filters.length) {
        sNoDataKey = _getNoDataTextWithFilters();
      } else {
        sNoDataKey = "T_TABLE_AND_CHART_NO_DATA_TEXT";
      }
    } else if (oChartFilterInfo.search || oChartFilterInfo.filters && oChartFilterInfo.filters.length) {
      sNoDataKey = _getNoDataTextWithFilters();
    } else {
      sNoDataKey = "M_TABLE_AND_CHART_NO_FILTERS_NO_DATA_TEXT";
    }

    return oChart.getModel("sap.fe.i18n").getResourceBundle().then(function (oResourceBundle) {
      oChart.setNoDataText(CommonUtils.getTranslatedText(sNoDataKey, oResourceBundle, null, suffixResourceKey));
    }).catch(function (error) {
      Log.error(error);
    });
  };

  ChartDelegate._handleProperty = function (oMDCChart, mEntitySetAnnotations, mKnownAggregatableProps, mCustomAggregates, aProperties, sCriticality) {
    var oApplySupported = CommonHelper.parseCustomData(oMDCChart.data("applySupported"));
    var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
    var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
    var oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
    var oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);
    var oObj = this.getModel().getObject(this.getPath());
    var sKey = this.getModel().getObject("".concat(this.getPath(), "@sapui.name"));
    var oMetaModel = this.getModel();

    if (oObj && oObj.$kind === "Property") {
      // ignore (as for now) all complex properties
      // not clear if they might be nesting (complex in complex)
      // not clear how they are represented in non-filterable annotation
      // etc.
      if (oObj.$isCollection) {
        //Log.warning("Complex property with type " + oObj.$Type + " has been ignored");
        return;
      }

      var oPropertyAnnotations = oMetaModel.getObject("".concat(this.getPath(), "@"));
      var sPath = oMetaModel.getObject("@sapui.name", oMetaModel.getMetaContext(this.getPath()));
      var aGroupableProperties = oApplySupported && oApplySupported.GroupableProperties;
      var aAggregatableProperties = oApplySupported && oApplySupported.AggregatableProperties;
      var bGroupable = false,
          bAggregatable = false;

      if (aGroupableProperties && aGroupableProperties.length) {
        for (var i = 0; i < aGroupableProperties.length; i++) {
          if (aGroupableProperties[i].$PropertyPath === sPath) {
            bGroupable = true;
            break;
          }
        }
      }

      if (aAggregatableProperties && aAggregatableProperties.length) {
        for (var j = 0; j < aAggregatableProperties.length; j++) {
          if (aAggregatableProperties[j].Property.$PropertyPath === sPath) {
            bAggregatable = true;
            break;
          }
        }
      }

      if (!aGroupableProperties || aGroupableProperties && !aGroupableProperties.length) {
        bGroupable = oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"];
      }

      if (!aAggregatableProperties || aAggregatableProperties && !aAggregatableProperties.length) {
        bAggregatable = oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"];
      } //Right now: skip them, since we can't create a chart from it


      if (!bGroupable && !bAggregatable) {
        return;
      }

      if (bAggregatable) {
        var aAggregateProperties = ChartDelegate._createPropertyInfosForAggregatable(oMDCChart, sKey, oPropertyAnnotations, oFilterRestrictionsInfo, oSortRestrictionsInfo, mKnownAggregatableProps, mCustomAggregates);

        aAggregateProperties.forEach(function (oAggregateProperty) {
          aProperties.push(oAggregateProperty);
        });
      }

      if (bGroupable) {
        var sName = sKey || "",
            sTextProperty = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] ? oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path : null;
        var bIsNavigationText = false;

        if (sName && sName.indexOf("/") > -1) {
          Log.error("$expand is not yet supported. Property: ".concat(sName, " from an association cannot be used"));
          return;
        }

        if (sTextProperty && sTextProperty.indexOf("/") > -1) {
          Log.error("$expand is not yet supported. Text Property: ".concat(sTextProperty, " from an association cannot be used"));
          bIsNavigationText = true;
        }

        aProperties.push({
          name: "_fe_groupable_" + sKey,
          propertyPath: sKey,
          label: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sKey,
          sortable: ChartDelegate._getSortable(oMDCChart, oSortRestrictionsInfo[sKey], false),
          filterable: oFilterRestrictionsInfo[sKey] ? oFilterRestrictionsInfo[sKey].filterable : true,
          groupable: true,
          aggregatable: false,
          maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[sKey]) ? -1 : 1,
          sortKey: sKey,
          role: ChartItemRoleType.category,
          //standard, normally this should be interpreted from UI.Chart annotation
          criticality: sCriticality,
          //To be implemented by FE
          textProperty: !bIsNavigationText && oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] ? oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path : null,
          //To be implemented by FE
          textFormatter: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
        });
      }
    }
  };

  ChartDelegate.formatText = function (oValue1, oValue2) {
    var oTextArrangementAnnotation = this.textFormatter;

    if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst") {
      return "".concat(oValue2, " (").concat(oValue1, ")");
    } else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
      return "".concat(oValue1, " (").concat(oValue2, ")");
    } else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
      return oValue2;
    }

    return oValue2 ? oValue2 : oValue1;
  };

  ChartDelegate.updateBindingInfo = function (oChart, oBindingInfo) {
    ChartDelegate._setChartNoDataText(oChart, oBindingInfo);

    var oFilter = sap.ui.getCore().byId(oChart.getFilter());

    if (oFilter) {
      var mConditions = oFilter.getConditions();

      if (mConditions) {
        if (!oBindingInfo) {
          oBindingInfo = {};
        }

        oBindingInfo.sorter = this.getSorters(oChart);
        var oInnerChart = oChart.getControlDelegate().getInnerChart(oChart);
        var oFilterInfo;

        if (oInnerChart) {
          // if the action is a drill down, chart selections must be considered
          if (ChartUtils.getChartSelectionsExist(oChart)) {
            oFilterInfo = ChartUtils.getAllFilterInfo(oChart);
          }
        }

        oFilterInfo = oFilterInfo ? oFilterInfo : ChartUtils.getFilterBarFilterInfo(oChart);

        if (oFilterInfo) {
          oBindingInfo.filters = oFilterInfo.filters;
        }

        var sParameterPath = DelegateUtil.getParametersInfo(oFilter, mConditions);

        if (sParameterPath) {
          oBindingInfo.path = sParameterPath;
        }
      } // Search


      var oInfo = FilterUtils.getFilterInfo(oFilter, {});
      var oApplySupported = CommonHelper.parseCustomData(oChart.data("applySupported"));

      if (oApplySupported && oApplySupported.enableSearch && oInfo.search) {
        oBindingInfo.parameters.$search = CommonUtils.normalizeSearchTerm(oInfo.search);
      } else if (oBindingInfo.parameters.$search) {
        delete oBindingInfo.parameters.$search;
      }
    } else {
      if (!oBindingInfo) {
        oBindingInfo = {};
      }

      oBindingInfo.sorter = this.getSorters(oChart);
    }

    ChartDelegate._checkAndAddDraftFilter(oChart, oBindingInfo);
  };

  ChartDelegate.fetchProperties = function (oMDCChart) {
    var _this = this;

    var oModel = this._getModel(oMDCChart);

    var pCreatePropertyInfos;

    if (!oModel) {
      pCreatePropertyInfos = new Promise(function (resolve) {
        oMDCChart.attachModelContextChange({
          resolver: resolve
        }, onModelContextChange, _this);
      }).then(function (oRetrievedModel) {
        return _this._createPropertyInfos(oMDCChart, oRetrievedModel);
      });
    } else {
      pCreatePropertyInfos = this._createPropertyInfos(oMDCChart, oModel);
    }

    return pCreatePropertyInfos.then(function (aProperties) {
      if (oMDCChart.data) {
        oMDCChart.data("$mdcChartPropertyInfo", aProperties);
      }

      return aProperties;
    });
  };

  function onModelContextChange(oEvent, oData) {
    var oMDCChart = oEvent.getSource();

    var oModel = this._getModel(oMDCChart);

    if (oModel) {
      oMDCChart.detachModelContextChange(onModelContextChange);
      oData.resolver(oModel);
    }
  }

  ChartDelegate._createPropertyInfos = function (oMDCChart, oModel) {
    try {
      var sEntitySetPath = "/".concat(oMDCChart.data("entitySet"));
      var oMetaModel = oModel.getMetaModel();
      return Promise.resolve(Promise.all([oMetaModel.requestObject("".concat(sEntitySetPath, "/")), oMetaModel.requestObject("".concat(sEntitySetPath, "@"))])).then(function (aResults) {
        var aProperties = [];
        var oEntityType = aResults[0],
            mEntitySetAnnotations = aResults[1];
        var mCustomAggregates = CommonHelper.parseCustomData(oMDCChart.data("customAgg"));
        var sAnno;
        var aPropertyPromise = [];

        for (var sAnnoKey in mEntitySetAnnotations) {
          if (sAnnoKey.startsWith("@Org.OData.Aggregation.V1.CustomAggregate")) {
            sAnno = sAnnoKey.replace("@Org.OData.Aggregation.V1.CustomAggregate#", "");
            var aAnno = sAnno.split("@");

            if (aAnno.length == 2 && aAnno[1] == "com.sap.vocabularies.Common.v1.Label") {
              mCustomAggregates[aAnno[0]] = mEntitySetAnnotations[sAnnoKey];
            }
          }
        }

        var aDimensions = [],
            aMeasures = [];

        if (Object.keys(mCustomAggregates).length >= 1) {
          var aChartItems = oMDCChart.getItems();

          for (var key in aChartItems) {
            if (aChartItems[key].isA("sap.ui.mdc.chart.DimensionItem")) {
              aDimensions.push(aChartItems[key].getKey());
            } else if (aChartItems[key].isA("sap.ui.mdc.chart.MeasureItem")) {
              aMeasures.push(aChartItems[key].getKey());
            }
          }

          if (aMeasures.filter(function (val) {
            return aDimensions.indexOf(val) != -1;
          }).length >= 1) {
            Log.error("Dimension and Measure has the sameProperty Configured");
          }
        }

        var mTypeAggregatableProps = CommonHelper.parseCustomData(oMDCChart.data("transAgg"));
        var mKnownAggregatableProps = {};

        for (var sAggregatable in mTypeAggregatableProps) {
          var sPropKey = mTypeAggregatableProps[sAggregatable].propertyPath;
          mKnownAggregatableProps[sPropKey] = mKnownAggregatableProps[sPropKey] || {};
          mKnownAggregatableProps[sPropKey][mTypeAggregatableProps[sAggregatable].aggregationMethod] = {
            name: mTypeAggregatableProps[sAggregatable].name,
            label: mTypeAggregatableProps[sAggregatable].label
          };
        }

        for (var sKey in oEntityType) {
          if (sKey.indexOf("$") !== 0) {
            aPropertyPromise.push(ODataMetaModelUtil.fetchCriticality(oMetaModel, oMetaModel.createBindingContext("".concat(sEntitySetPath, "/").concat(sKey))).then(ChartDelegate._handleProperty.bind(oMetaModel.getMetaContext("".concat(sEntitySetPath, "/").concat(sKey)), oMDCChart, mEntitySetAnnotations, mKnownAggregatableProps, mCustomAggregates, aProperties)));
          }
        }

        return Promise.resolve(Promise.all(aPropertyPromise)).then(function () {
          return aProperties;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  ChartDelegate._createPropertyInfosForAggregatable = function (oMDCChart, sKey, oPropertyAnnotations, oFilterRestrictionsInfo, oSortRestrictionsInfo, mKnownAggregatableProps, mCustomAggregates) {
    var aAggregateProperties = [];

    if (Object.keys(mKnownAggregatableProps).indexOf(sKey) > -1) {
      for (var sAggregatable in mKnownAggregatableProps[sKey]) {
        aAggregateProperties.push({
          name: "_fe_aggregatable_" + mKnownAggregatableProps[sKey][sAggregatable].name,
          propertyPath: sKey,
          label: mKnownAggregatableProps[sKey][sAggregatable].label || "".concat(oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"], " (").concat(sAggregatable, ")") || "".concat(sKey, " (").concat(sAggregatable, ")"),
          sortable: oSortRestrictionsInfo[sKey] ? oSortRestrictionsInfo[sKey].sortable : true,
          filterable: oFilterRestrictionsInfo[sKey] ? oFilterRestrictionsInfo[sKey].filterable : true,
          groupable: false,
          aggregatable: true,
          aggregationMethod: sAggregatable,
          maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[sKey]) ? -1 : 1,
          role: ChartItemRoleType.axis1,
          datapoint: null //To be implemented by FE

        });
      }
    }

    if (Object.keys(mCustomAggregates).indexOf(sKey) > -1) {
      for (var sCustom in mCustomAggregates) {
        if (sCustom === sKey) {
          var oItem = merge({}, mCustomAggregates[sCustom], {
            name: "_fe_aggregatable_" + sCustom,
            groupable: false,
            aggregatable: true,
            role: ChartItemRoleType.axis1,
            datapoint: null //To be implemented by FE

          });
          aAggregateProperties.push(oItem);
          break;
        }
      }
    }

    return aAggregateProperties;
  };

  ChartDelegate.rebind = function (oMDCChart, oBindingInfo) {
    var sSearch = oBindingInfo.parameters.$search;

    if (sSearch) {
      delete oBindingInfo.parameters.$search;
    }

    BaseChartDelegate.rebind(oMDCChart, oBindingInfo);

    if (sSearch) {
      var oInnerChart = oMDCChart.getControlDelegate().getInnerChart(oMDCChart),
          oChartBinding = oInnerChart && oInnerChart.getBinding("data"); // Temporary workaround until this is fixed in MDCChart / UI5 Chart
      // In order to avoid having 2 OData requests, we need to suspend the binding before setting some aggregation properties
      // and resume it once the chart has added other aggregation properties (in onBeforeRendering)

      oChartBinding.suspend();
      oChartBinding.setAggregation({
        search: sSearch
      });
      var oInnerChartDelegate = {
        onBeforeRendering: function () {
          oChartBinding.resume();
          oInnerChart.removeEventDelegate(oInnerChartDelegate);
        }
      };
      oInnerChart.addEventDelegate(oInnerChartDelegate);
    }

    oMDCChart.fireEvent("bindingUpdated");
  };

  ChartDelegate._setChart = function (oMDCChart, oInnerChart) {
    var oChartAPI = oMDCChart.getParent();
    oInnerChart.setVizProperties(oMDCChart.data("vizProperties"));
    oInnerChart.detachSelectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
    oInnerChart.detachDeselectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
    oInnerChart.detachDrilledUp(oChartAPI.handleSelectionChange.bind(oChartAPI));
    oInnerChart.attachSelectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
    oInnerChart.attachDeselectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
    oInnerChart.attachDrilledUp(oChartAPI.handleSelectionChange.bind(oChartAPI));
    oInnerChart.setSelectionMode(oMDCChart.getPayload().selectionMode.toUpperCase());

    BaseChartDelegate._setChart(oMDCChart, oInnerChart);
  };

  ChartDelegate._getBindingInfo = function (oMDCChart) {
    if (this._getBindingInfoFromState(oMDCChart)) {
      return this._getBindingInfoFromState(oMDCChart);
    }

    var oMetadataInfo = oMDCChart.getDelegate().payload;
    var oMetaModel = oMDCChart.getModel() && oMDCChart.getModel().getMetaModel();
    var sTargetCollectionPath = oMDCChart.data("targetCollectionPath");
    var sEntitySetPath = (oMetaModel.getObject("".concat(sTargetCollectionPath, "/$kind")) !== "NavigationProperty" ? "/" : "") + oMetadataInfo.contextPath;
    var oParams = merge({}, oMetadataInfo.parameters, {
      entitySet: oMDCChart.data("entitySet"),
      useBatchRequests: true,
      provideGrandTotals: true,
      provideTotalResultSize: true,
      noPaging: true
    });
    return {
      path: sEntitySetPath,
      events: {
        dataRequested: oMDCChart.getParent().onInternalDataRequested.bind(oMDCChart.getParent())
      },
      parameters: oParams
    };
  };

  ChartDelegate.removeItemFromInnerChart = function (oMDCChart, oMDCChartItem) {
    BaseChartDelegate.removeItemFromInnerChart.call(this, oMDCChart, oMDCChartItem);

    if (oMDCChartItem.getType() === "groupable") {
      var oInnerChart = this._getChart(oMDCChart);

      oInnerChart.fireDeselectData();
    }
  };

  ChartDelegate._getSortable = function (oMDCChart, oSortRestrictions, bIsTransAggregate) {
    if (bIsTransAggregate) {
      if (oMDCChart.data("draftSupported") === "true") {
        return false;
      } else {
        return oSortRestrictions ? oSortRestrictions.sortable : true;
      }
    }

    return oSortRestrictions ? oSortRestrictions.sortable : true;
  };

  ChartDelegate._checkAndAddDraftFilter = function (oChart, oBindingInfo) {
    if (oChart.data("draftSupported") === "true") {
      if (!oBindingInfo) {
        oBindingInfo = {};
      }

      if (!oBindingInfo.filters) {
        oBindingInfo.filters = [];
      }

      oBindingInfo.filters.push(new Filter("IsActiveEntity", FilterOperator.EQ, true));
    }
  };
  /**
   * This function returns an ID which should be used in the internal chart for the measure/dimension.
   * For standard cases, this is just the id of the property.
   * If it is necessary to use another id internally inside the chart (e.g. on duplicate property ids) this method can be overwritten.
   * In this case, <code>getPropertyFromNameAndKind</code> needs to be overwritten as well.
   *
   * @param {string} name ID of the property
   * @param {string} kind Type of the Property (Measure/Dimension)
   * @returns {string} Internal id for the sap.chart.Chart
   */


  ChartDelegate.getInternalChartNameFromPropertyNameAndKind = function (name, kind) {
    return name.replace("_fe_" + kind + "_", "");
  };
  /**
   * This maps an id of an internal chart dimension/measure & type of a property to its corresponding property entry.
   *
   * @param {string} name ID of internal chart measure/dimension
   * @param {string} kind Kind of the property
   * @param {sap.ui.mdc.Chart} mdcChart Reference to the MDC chart
   * @returns {object} PropertyInfo object
   */


  ChartDelegate.getPropertyFromNameAndKind = function (name, kind, mdcChart) {
    return mdcChart.getPropertyHelper().getProperty("_fe_" + kind + "_" + name);
  };

  return ChartDelegate;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGFydEl0ZW1Sb2xlVHlwZSIsIk1EQ0xpYiIsIkNoYXJ0RGVsZWdhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJCYXNlQ2hhcnREZWxlZ2F0ZSIsIl9zZXRDaGFydE5vRGF0YVRleHQiLCJvQ2hhcnQiLCJvQmluZGluZ0luZm8iLCJzTm9EYXRhS2V5Iiwib0NoYXJ0RmlsdGVySW5mbyIsIkNoYXJ0VXRpbHMiLCJnZXRBbGxGaWx0ZXJJbmZvIiwic3VmZml4UmVzb3VyY2VLZXkiLCJwYXRoIiwic3RhcnRzV2l0aCIsInN1YnN0ciIsIl9nZXROb0RhdGFUZXh0V2l0aEZpbHRlcnMiLCJkYXRhIiwiZ2V0RmlsdGVyIiwic2VhcmNoIiwiZmlsdGVycyIsImxlbmd0aCIsImdldE1vZGVsIiwiZ2V0UmVzb3VyY2VCdW5kbGUiLCJ0aGVuIiwib1Jlc291cmNlQnVuZGxlIiwic2V0Tm9EYXRhVGV4dCIsIkNvbW1vblV0aWxzIiwiZ2V0VHJhbnNsYXRlZFRleHQiLCJjYXRjaCIsImVycm9yIiwiTG9nIiwiX2hhbmRsZVByb3BlcnR5Iiwib01EQ0NoYXJ0IiwibUVudGl0eVNldEFubm90YXRpb25zIiwibUtub3duQWdncmVnYXRhYmxlUHJvcHMiLCJtQ3VzdG9tQWdncmVnYXRlcyIsImFQcm9wZXJ0aWVzIiwic0NyaXRpY2FsaXR5Iiwib0FwcGx5U3VwcG9ydGVkIiwiQ29tbW9uSGVscGVyIiwicGFyc2VDdXN0b21EYXRhIiwib1NvcnRSZXN0cmljdGlvbnMiLCJvU29ydFJlc3RyaWN0aW9uc0luZm8iLCJPRGF0YU1ldGFNb2RlbFV0aWwiLCJnZXRTb3J0UmVzdHJpY3Rpb25zSW5mbyIsIm9GaWx0ZXJSZXN0cmljdGlvbnMiLCJvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbyIsImdldEZpbHRlclJlc3RyaWN0aW9uc0luZm8iLCJvT2JqIiwiZ2V0T2JqZWN0IiwiZ2V0UGF0aCIsInNLZXkiLCJvTWV0YU1vZGVsIiwiJGtpbmQiLCIkaXNDb2xsZWN0aW9uIiwib1Byb3BlcnR5QW5ub3RhdGlvbnMiLCJzUGF0aCIsImdldE1ldGFDb250ZXh0IiwiYUdyb3VwYWJsZVByb3BlcnRpZXMiLCJHcm91cGFibGVQcm9wZXJ0aWVzIiwiYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJBZ2dyZWdhdGFibGVQcm9wZXJ0aWVzIiwiYkdyb3VwYWJsZSIsImJBZ2dyZWdhdGFibGUiLCJpIiwiJFByb3BlcnR5UGF0aCIsImoiLCJQcm9wZXJ0eSIsImFBZ2dyZWdhdGVQcm9wZXJ0aWVzIiwiX2NyZWF0ZVByb3BlcnR5SW5mb3NGb3JBZ2dyZWdhdGFibGUiLCJmb3JFYWNoIiwib0FnZ3JlZ2F0ZVByb3BlcnR5IiwicHVzaCIsInNOYW1lIiwic1RleHRQcm9wZXJ0eSIsIiRQYXRoIiwiYklzTmF2aWdhdGlvblRleHQiLCJpbmRleE9mIiwibmFtZSIsInByb3BlcnR5UGF0aCIsImxhYmVsIiwic29ydGFibGUiLCJfZ2V0U29ydGFibGUiLCJmaWx0ZXJhYmxlIiwiZ3JvdXBhYmxlIiwiYWdncmVnYXRhYmxlIiwibWF4Q29uZGl0aW9ucyIsImlzTXVsdGlWYWx1ZUZpbHRlckV4cHJlc3Npb24iLCJwcm9wZXJ0eUluZm8iLCJzb3J0S2V5Iiwicm9sZSIsImNhdGVnb3J5IiwiY3JpdGljYWxpdHkiLCJ0ZXh0UHJvcGVydHkiLCJ0ZXh0Rm9ybWF0dGVyIiwiZm9ybWF0VGV4dCIsIm9WYWx1ZTEiLCJvVmFsdWUyIiwib1RleHRBcnJhbmdlbWVudEFubm90YXRpb24iLCIkRW51bU1lbWJlciIsInVwZGF0ZUJpbmRpbmdJbmZvIiwib0ZpbHRlciIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImJ5SWQiLCJtQ29uZGl0aW9ucyIsImdldENvbmRpdGlvbnMiLCJzb3J0ZXIiLCJnZXRTb3J0ZXJzIiwib0lubmVyQ2hhcnQiLCJnZXRDb250cm9sRGVsZWdhdGUiLCJnZXRJbm5lckNoYXJ0Iiwib0ZpbHRlckluZm8iLCJnZXRDaGFydFNlbGVjdGlvbnNFeGlzdCIsImdldEZpbHRlckJhckZpbHRlckluZm8iLCJzUGFyYW1ldGVyUGF0aCIsIkRlbGVnYXRlVXRpbCIsImdldFBhcmFtZXRlcnNJbmZvIiwib0luZm8iLCJGaWx0ZXJVdGlscyIsImdldEZpbHRlckluZm8iLCJlbmFibGVTZWFyY2giLCJwYXJhbWV0ZXJzIiwiJHNlYXJjaCIsIm5vcm1hbGl6ZVNlYXJjaFRlcm0iLCJfY2hlY2tBbmRBZGREcmFmdEZpbHRlciIsImZldGNoUHJvcGVydGllcyIsIm9Nb2RlbCIsIl9nZXRNb2RlbCIsInBDcmVhdGVQcm9wZXJ0eUluZm9zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJhdHRhY2hNb2RlbENvbnRleHRDaGFuZ2UiLCJyZXNvbHZlciIsIm9uTW9kZWxDb250ZXh0Q2hhbmdlIiwib1JldHJpZXZlZE1vZGVsIiwiX2NyZWF0ZVByb3BlcnR5SW5mb3MiLCJvRXZlbnQiLCJvRGF0YSIsImdldFNvdXJjZSIsImRldGFjaE1vZGVsQ29udGV4dENoYW5nZSIsInNFbnRpdHlTZXRQYXRoIiwiZ2V0TWV0YU1vZGVsIiwiYWxsIiwicmVxdWVzdE9iamVjdCIsImFSZXN1bHRzIiwib0VudGl0eVR5cGUiLCJzQW5ubyIsImFQcm9wZXJ0eVByb21pc2UiLCJzQW5ub0tleSIsInJlcGxhY2UiLCJhQW5ubyIsInNwbGl0IiwiYURpbWVuc2lvbnMiLCJhTWVhc3VyZXMiLCJrZXlzIiwiYUNoYXJ0SXRlbXMiLCJnZXRJdGVtcyIsImtleSIsImlzQSIsImdldEtleSIsImZpbHRlciIsInZhbCIsIm1UeXBlQWdncmVnYXRhYmxlUHJvcHMiLCJzQWdncmVnYXRhYmxlIiwic1Byb3BLZXkiLCJhZ2dyZWdhdGlvbk1ldGhvZCIsImZldGNoQ3JpdGljYWxpdHkiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsImJpbmQiLCJheGlzMSIsImRhdGFwb2ludCIsInNDdXN0b20iLCJvSXRlbSIsIm1lcmdlIiwicmViaW5kIiwic1NlYXJjaCIsIm9DaGFydEJpbmRpbmciLCJnZXRCaW5kaW5nIiwic3VzcGVuZCIsInNldEFnZ3JlZ2F0aW9uIiwib0lubmVyQ2hhcnREZWxlZ2F0ZSIsIm9uQmVmb3JlUmVuZGVyaW5nIiwicmVzdW1lIiwicmVtb3ZlRXZlbnREZWxlZ2F0ZSIsImFkZEV2ZW50RGVsZWdhdGUiLCJmaXJlRXZlbnQiLCJfc2V0Q2hhcnQiLCJvQ2hhcnRBUEkiLCJnZXRQYXJlbnQiLCJzZXRWaXpQcm9wZXJ0aWVzIiwiZGV0YWNoU2VsZWN0RGF0YSIsImhhbmRsZVNlbGVjdGlvbkNoYW5nZSIsImRldGFjaERlc2VsZWN0RGF0YSIsImRldGFjaERyaWxsZWRVcCIsImF0dGFjaFNlbGVjdERhdGEiLCJhdHRhY2hEZXNlbGVjdERhdGEiLCJhdHRhY2hEcmlsbGVkVXAiLCJzZXRTZWxlY3Rpb25Nb2RlIiwiZ2V0UGF5bG9hZCIsInNlbGVjdGlvbk1vZGUiLCJ0b1VwcGVyQ2FzZSIsIl9nZXRCaW5kaW5nSW5mbyIsIl9nZXRCaW5kaW5nSW5mb0Zyb21TdGF0ZSIsIm9NZXRhZGF0YUluZm8iLCJnZXREZWxlZ2F0ZSIsInBheWxvYWQiLCJzVGFyZ2V0Q29sbGVjdGlvblBhdGgiLCJjb250ZXh0UGF0aCIsIm9QYXJhbXMiLCJlbnRpdHlTZXQiLCJ1c2VCYXRjaFJlcXVlc3RzIiwicHJvdmlkZUdyYW5kVG90YWxzIiwicHJvdmlkZVRvdGFsUmVzdWx0U2l6ZSIsIm5vUGFnaW5nIiwiZXZlbnRzIiwiZGF0YVJlcXVlc3RlZCIsIm9uSW50ZXJuYWxEYXRhUmVxdWVzdGVkIiwicmVtb3ZlSXRlbUZyb21Jbm5lckNoYXJ0Iiwib01EQ0NoYXJ0SXRlbSIsImNhbGwiLCJnZXRUeXBlIiwiX2dldENoYXJ0IiwiZmlyZURlc2VsZWN0RGF0YSIsImJJc1RyYW5zQWdncmVnYXRlIiwiRmlsdGVyIiwiRmlsdGVyT3BlcmF0b3IiLCJFUSIsImdldEludGVybmFsQ2hhcnROYW1lRnJvbVByb3BlcnR5TmFtZUFuZEtpbmQiLCJraW5kIiwiZ2V0UHJvcGVydHlGcm9tTmFtZUFuZEtpbmQiLCJtZGNDaGFydCIsImdldFByb3BlcnR5SGVscGVyIiwiZ2V0UHJvcGVydHkiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkNoYXJ0RGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgUmVzb3VyY2VCdW5kbGUgZnJvbSBcInNhcC9iYXNlL2kxOG4vUmVzb3VyY2VCdW5kbGVcIjtcbmltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IG1lcmdlIGZyb20gXCJzYXAvYmFzZS91dGlsL21lcmdlXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgQ2hhcnRVdGlscyBmcm9tIFwic2FwL2ZlL21hY3Jvcy9jaGFydC9DaGFydFV0aWxzXCI7XG5pbXBvcnQgQ29tbW9uSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IEZpbHRlclV0aWxzIGZyb20gXCJzYXAvZmUvbWFjcm9zL2ZpbHRlci9GaWx0ZXJVdGlsc1wiO1xuaW1wb3J0IE9EYXRhTWV0YU1vZGVsVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9PRGF0YU1ldGFNb2RlbFV0aWxcIjtcbmltcG9ydCB0eXBlIENoYXJ0IGZyb20gXCJzYXAvdWkvbWRjL0NoYXJ0XCI7XG5pbXBvcnQgTURDTGliIGZyb20gXCJzYXAvdWkvbWRjL2xpYnJhcnlcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC91aS9tZGMvb2RhdGEvdjQvdXRpbC9EZWxlZ2F0ZVV0aWxcIjtcbmltcG9ydCBCYXNlQ2hhcnREZWxlZ2F0ZSBmcm9tIFwic2FwL3VpL21kYy9vZGF0YS92NC92aXpDaGFydC9DaGFydERlbGVnYXRlXCI7XG5pbXBvcnQgRmlsdGVyIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyXCI7XG5pbXBvcnQgRmlsdGVyT3BlcmF0b3IgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJPcGVyYXRvclwiO1xuXG5jb25zdCBDaGFydEl0ZW1Sb2xlVHlwZSA9IChNRENMaWIgYXMgYW55KS5DaGFydEl0ZW1Sb2xlVHlwZTtcbi8vIC8qKlxuLy8gICogSGVscGVyIGNsYXNzIGZvciBzYXAudWkubWRjLkNoYXJ0LlxuLy8gICogPGgzPjxiPk5vdGU6PC9iPjwvaDM+XG4vLyAgKiBUaGUgY2xhc3MgaXMgZXhwZXJpbWVudGFsIGFuZCB0aGUgQVBJL2JlaGF2aW91ciBpcyBub3QgZmluYWxpc2VkXG4vLyAgKiBhbmQgaGVuY2UgdGhpcyBzaG91bGQgbm90IGJlIHVzZWQgZm9yIHByb2R1Y3RpdmUgdXNhZ2UuXG4vLyAgKiBFc3BlY2lhbGx5IHRoaXMgY2xhc3MgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQgZm9yIHRoZSBGRSBzY2VuYXJpbyxcbi8vICAqIGhlcmUgd2Ugc2hhbGwgdXNlIHNhcC5mZS5tYWNyb3MuQ2hhcnREZWxlZ2F0ZSB0aGF0IGlzIGVzcGVjaWFsbHkgdGFpbG9yZWQgZm9yIFY0XG4vLyAgKiBtZXRhIG1vZGVsXG4vLyAgKlxuLy8gICogQGF1dGhvciBTQVAgU0Vcbi8vICAqIEBwcml2YXRlXG4vLyAgKiBAZXhwZXJpbWVudGFsXG4vLyAgKiBAc2luY2UgMS42MlxuLy8gICogQGFsaWFzIHNhcC5mZS5tYWNyb3MuQ2hhcnREZWxlZ2F0ZVxuLy8gICovXG5jb25zdCBDaGFydERlbGVnYXRlID0gT2JqZWN0LmFzc2lnbih7fSwgQmFzZUNoYXJ0RGVsZWdhdGUpO1xuXG5DaGFydERlbGVnYXRlLl9zZXRDaGFydE5vRGF0YVRleHQgPSBmdW5jdGlvbiAob0NoYXJ0OiBhbnksIG9CaW5kaW5nSW5mbzogYW55KSB7XG5cdGxldCBzTm9EYXRhS2V5ID0gXCJcIjtcblx0Y29uc3Qgb0NoYXJ0RmlsdGVySW5mbyA9IENoYXJ0VXRpbHMuZ2V0QWxsRmlsdGVySW5mbyhvQ2hhcnQpLFxuXHRcdHN1ZmZpeFJlc291cmNlS2V5ID0gb0JpbmRpbmdJbmZvLnBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBvQmluZGluZ0luZm8ucGF0aC5zdWJzdHIoMSkgOiBvQmluZGluZ0luZm8ucGF0aDtcblx0Y29uc3QgX2dldE5vRGF0YVRleHRXaXRoRmlsdGVycyA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAob0NoYXJ0LmRhdGEoXCJtdWx0aVZpZXdzXCIpKSB7XG5cdFx0XHRyZXR1cm4gXCJNX1RBQkxFX0FORF9DSEFSVF9OT19EQVRBX1RFWFRfTVVMVElfVklFV1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJUX1RBQkxFX0FORF9DSEFSVF9OT19EQVRBX1RFWFRfV0lUSF9GSUxURVJcIjtcblx0XHR9XG5cdH07XG5cdGlmIChvQ2hhcnQuZ2V0RmlsdGVyKCkpIHtcblx0XHRpZiAob0NoYXJ0RmlsdGVySW5mby5zZWFyY2ggfHwgKG9DaGFydEZpbHRlckluZm8uZmlsdGVycyAmJiBvQ2hhcnRGaWx0ZXJJbmZvLmZpbHRlcnMubGVuZ3RoKSkge1xuXHRcdFx0c05vRGF0YUtleSA9IF9nZXROb0RhdGFUZXh0V2l0aEZpbHRlcnMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c05vRGF0YUtleSA9IFwiVF9UQUJMRV9BTkRfQ0hBUlRfTk9fREFUQV9URVhUXCI7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKG9DaGFydEZpbHRlckluZm8uc2VhcmNoIHx8IChvQ2hhcnRGaWx0ZXJJbmZvLmZpbHRlcnMgJiYgb0NoYXJ0RmlsdGVySW5mby5maWx0ZXJzLmxlbmd0aCkpIHtcblx0XHRzTm9EYXRhS2V5ID0gX2dldE5vRGF0YVRleHRXaXRoRmlsdGVycygpO1xuXHR9IGVsc2Uge1xuXHRcdHNOb0RhdGFLZXkgPSBcIk1fVEFCTEVfQU5EX0NIQVJUX05PX0ZJTFRFUlNfTk9fREFUQV9URVhUXCI7XG5cdH1cblx0cmV0dXJuIChvQ2hhcnQuZ2V0TW9kZWwoXCJzYXAuZmUuaTE4blwiKS5nZXRSZXNvdXJjZUJ1bmRsZSgpIGFzIFByb21pc2U8UmVzb3VyY2VCdW5kbGU+KVxuXHRcdC50aGVuKGZ1bmN0aW9uIChvUmVzb3VyY2VCdW5kbGUpIHtcblx0XHRcdG9DaGFydC5zZXROb0RhdGFUZXh0KENvbW1vblV0aWxzLmdldFRyYW5zbGF0ZWRUZXh0KHNOb0RhdGFLZXksIG9SZXNvdXJjZUJ1bmRsZSwgbnVsbCwgc3VmZml4UmVzb3VyY2VLZXkpKTtcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0fSk7XG59O1xuXG5DaGFydERlbGVnYXRlLl9oYW5kbGVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChcblx0b01EQ0NoYXJ0OiBDaGFydCxcblx0bUVudGl0eVNldEFubm90YXRpb25zOiBhbnksXG5cdG1Lbm93bkFnZ3JlZ2F0YWJsZVByb3BzOiBhbnksXG5cdG1DdXN0b21BZ2dyZWdhdGVzOiBhbnksXG5cdGFQcm9wZXJ0aWVzOiBhbnlbXSxcblx0c0NyaXRpY2FsaXR5OiBzdHJpbmdcbikge1xuXHRjb25zdCBvQXBwbHlTdXBwb3J0ZWQgPSBDb21tb25IZWxwZXIucGFyc2VDdXN0b21EYXRhKG9NRENDaGFydC5kYXRhKFwiYXBwbHlTdXBwb3J0ZWRcIikpO1xuXHRjb25zdCBvU29ydFJlc3RyaWN0aW9ucyA9IG1FbnRpdHlTZXRBbm5vdGF0aW9uc1tcIkBPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNvcnRSZXN0cmljdGlvbnNcIl0gfHwge307XG5cdGNvbnN0IG9Tb3J0UmVzdHJpY3Rpb25zSW5mbyA9IE9EYXRhTWV0YU1vZGVsVXRpbC5nZXRTb3J0UmVzdHJpY3Rpb25zSW5mbyhvU29ydFJlc3RyaWN0aW9ucyk7XG5cdGNvbnN0IG9GaWx0ZXJSZXN0cmljdGlvbnMgPSBtRW50aXR5U2V0QW5ub3RhdGlvbnNbXCJAT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5GaWx0ZXJSZXN0cmljdGlvbnNcIl07XG5cdGNvbnN0IG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvID0gT0RhdGFNZXRhTW9kZWxVdGlsLmdldEZpbHRlclJlc3RyaWN0aW9uc0luZm8ob0ZpbHRlclJlc3RyaWN0aW9ucyk7XG5cdGNvbnN0IG9PYmogPSB0aGlzLmdldE1vZGVsKCkuZ2V0T2JqZWN0KHRoaXMuZ2V0UGF0aCgpKTtcblx0Y29uc3Qgc0tleSA9IHRoaXMuZ2V0TW9kZWwoKS5nZXRPYmplY3QoYCR7dGhpcy5nZXRQYXRoKCl9QHNhcHVpLm5hbWVgKTtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKTtcblx0aWYgKG9PYmogJiYgb09iai4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiKSB7XG5cdFx0Ly8gaWdub3JlIChhcyBmb3Igbm93KSBhbGwgY29tcGxleCBwcm9wZXJ0aWVzXG5cdFx0Ly8gbm90IGNsZWFyIGlmIHRoZXkgbWlnaHQgYmUgbmVzdGluZyAoY29tcGxleCBpbiBjb21wbGV4KVxuXHRcdC8vIG5vdCBjbGVhciBob3cgdGhleSBhcmUgcmVwcmVzZW50ZWQgaW4gbm9uLWZpbHRlcmFibGUgYW5ub3RhdGlvblxuXHRcdC8vIGV0Yy5cblx0XHRpZiAob09iai4kaXNDb2xsZWN0aW9uKSB7XG5cdFx0XHQvL0xvZy53YXJuaW5nKFwiQ29tcGxleCBwcm9wZXJ0eSB3aXRoIHR5cGUgXCIgKyBvT2JqLiRUeXBlICsgXCIgaGFzIGJlZW4gaWdub3JlZFwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBvUHJvcGVydHlBbm5vdGF0aW9ucyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3RoaXMuZ2V0UGF0aCgpfUBgKTtcblx0XHRjb25zdCBzUGF0aCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KFwiQHNhcHVpLm5hbWVcIiwgb01ldGFNb2RlbC5nZXRNZXRhQ29udGV4dCh0aGlzLmdldFBhdGgoKSkpO1xuXG5cdFx0Y29uc3QgYUdyb3VwYWJsZVByb3BlcnRpZXMgPSBvQXBwbHlTdXBwb3J0ZWQgJiYgb0FwcGx5U3VwcG9ydGVkLkdyb3VwYWJsZVByb3BlcnRpZXM7XG5cdFx0Y29uc3QgYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMgPSBvQXBwbHlTdXBwb3J0ZWQgJiYgb0FwcGx5U3VwcG9ydGVkLkFnZ3JlZ2F0YWJsZVByb3BlcnRpZXM7XG5cdFx0bGV0IGJHcm91cGFibGUgPSBmYWxzZSxcblx0XHRcdGJBZ2dyZWdhdGFibGUgPSBmYWxzZTtcblx0XHRpZiAoYUdyb3VwYWJsZVByb3BlcnRpZXMgJiYgYUdyb3VwYWJsZVByb3BlcnRpZXMubGVuZ3RoKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFHcm91cGFibGVQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChhR3JvdXBhYmxlUHJvcGVydGllc1tpXS4kUHJvcGVydHlQYXRoID09PSBzUGF0aCkge1xuXHRcdFx0XHRcdGJHcm91cGFibGUgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChhQWdncmVnYXRhYmxlUHJvcGVydGllcyAmJiBhQWdncmVnYXRhYmxlUHJvcGVydGllcy5sZW5ndGgpIHtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0aWYgKGFBZ2dyZWdhdGFibGVQcm9wZXJ0aWVzW2pdLlByb3BlcnR5LiRQcm9wZXJ0eVBhdGggPT09IHNQYXRoKSB7XG5cdFx0XHRcdFx0YkFnZ3JlZ2F0YWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCFhR3JvdXBhYmxlUHJvcGVydGllcyB8fCAoYUdyb3VwYWJsZVByb3BlcnRpZXMgJiYgIWFHcm91cGFibGVQcm9wZXJ0aWVzLmxlbmd0aCkpIHtcblx0XHRcdGJHcm91cGFibGUgPSBvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuR3JvdXBhYmxlXCJdO1xuXHRcdH1cblx0XHRpZiAoIWFBZ2dyZWdhdGFibGVQcm9wZXJ0aWVzIHx8IChhQWdncmVnYXRhYmxlUHJvcGVydGllcyAmJiAhYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMubGVuZ3RoKSkge1xuXHRcdFx0YkFnZ3JlZ2F0YWJsZSA9IG9Qcm9wZXJ0eUFubm90YXRpb25zW1wiQE9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5BZ2dyZWdhdGFibGVcIl07XG5cdFx0fVxuXG5cdFx0Ly9SaWdodCBub3c6IHNraXAgdGhlbSwgc2luY2Ugd2UgY2FuJ3QgY3JlYXRlIGEgY2hhcnQgZnJvbSBpdFxuXHRcdGlmICghYkdyb3VwYWJsZSAmJiAhYkFnZ3JlZ2F0YWJsZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChiQWdncmVnYXRhYmxlKSB7XG5cdFx0XHRjb25zdCBhQWdncmVnYXRlUHJvcGVydGllcyA9IENoYXJ0RGVsZWdhdGUuX2NyZWF0ZVByb3BlcnR5SW5mb3NGb3JBZ2dyZWdhdGFibGUoXG5cdFx0XHRcdG9NRENDaGFydCxcblx0XHRcdFx0c0tleSxcblx0XHRcdFx0b1Byb3BlcnR5QW5ub3RhdGlvbnMsXG5cdFx0XHRcdG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvLFxuXHRcdFx0XHRvU29ydFJlc3RyaWN0aW9uc0luZm8sXG5cdFx0XHRcdG1Lbm93bkFnZ3JlZ2F0YWJsZVByb3BzLFxuXHRcdFx0XHRtQ3VzdG9tQWdncmVnYXRlc1xuXHRcdFx0KTtcblx0XHRcdGFBZ2dyZWdhdGVQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKG9BZ2dyZWdhdGVQcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRcdGFQcm9wZXJ0aWVzLnB1c2gob0FnZ3JlZ2F0ZVByb3BlcnR5KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChiR3JvdXBhYmxlKSB7XG5cdFx0XHRjb25zdCBzTmFtZSA9IHNLZXkgfHwgXCJcIixcblx0XHRcdFx0c1RleHRQcm9wZXJ0eSA9IG9Qcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0XCJdXG5cdFx0XHRcdFx0PyBvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiXS4kUGF0aFxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdGxldCBiSXNOYXZpZ2F0aW9uVGV4dCA9IGZhbHNlO1xuXHRcdFx0aWYgKHNOYW1lICYmIHNOYW1lLmluZGV4T2YoXCIvXCIpID4gLTEpIHtcblx0XHRcdFx0TG9nLmVycm9yKGAkZXhwYW5kIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLiBQcm9wZXJ0eTogJHtzTmFtZX0gZnJvbSBhbiBhc3NvY2lhdGlvbiBjYW5ub3QgYmUgdXNlZGApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoc1RleHRQcm9wZXJ0eSAmJiBzVGV4dFByb3BlcnR5LmluZGV4T2YoXCIvXCIpID4gLTEpIHtcblx0XHRcdFx0TG9nLmVycm9yKGAkZXhwYW5kIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLiBUZXh0IFByb3BlcnR5OiAke3NUZXh0UHJvcGVydHl9IGZyb20gYW4gYXNzb2NpYXRpb24gY2Fubm90IGJlIHVzZWRgKTtcblx0XHRcdFx0YklzTmF2aWdhdGlvblRleHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0YVByb3BlcnRpZXMucHVzaCh7XG5cdFx0XHRcdG5hbWU6IFwiX2ZlX2dyb3VwYWJsZV9cIiArIHNLZXksXG5cdFx0XHRcdHByb3BlcnR5UGF0aDogc0tleSxcblx0XHRcdFx0bGFiZWw6IG9Qcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5MYWJlbFwiXSB8fCBzS2V5LFxuXHRcdFx0XHRzb3J0YWJsZTogQ2hhcnREZWxlZ2F0ZS5fZ2V0U29ydGFibGUob01EQ0NoYXJ0LCBvU29ydFJlc3RyaWN0aW9uc0luZm9bc0tleV0sIGZhbHNlKSxcblx0XHRcdFx0ZmlsdGVyYWJsZTogb0ZpbHRlclJlc3RyaWN0aW9uc0luZm9bc0tleV0gPyBvRmlsdGVyUmVzdHJpY3Rpb25zSW5mb1tzS2V5XS5maWx0ZXJhYmxlIDogdHJ1ZSxcblx0XHRcdFx0Z3JvdXBhYmxlOiB0cnVlLFxuXHRcdFx0XHRhZ2dyZWdhdGFibGU6IGZhbHNlLFxuXHRcdFx0XHRtYXhDb25kaXRpb25zOiBPRGF0YU1ldGFNb2RlbFV0aWwuaXNNdWx0aVZhbHVlRmlsdGVyRXhwcmVzc2lvbihvRmlsdGVyUmVzdHJpY3Rpb25zSW5mby5wcm9wZXJ0eUluZm9bc0tleV0pID8gLTEgOiAxLFxuXHRcdFx0XHRzb3J0S2V5OiBzS2V5LFxuXHRcdFx0XHRyb2xlOiBDaGFydEl0ZW1Sb2xlVHlwZS5jYXRlZ29yeSwgLy9zdGFuZGFyZCwgbm9ybWFsbHkgdGhpcyBzaG91bGQgYmUgaW50ZXJwcmV0ZWQgZnJvbSBVSS5DaGFydCBhbm5vdGF0aW9uXG5cdFx0XHRcdGNyaXRpY2FsaXR5OiBzQ3JpdGljYWxpdHksIC8vVG8gYmUgaW1wbGVtZW50ZWQgYnkgRkVcblx0XHRcdFx0dGV4dFByb3BlcnR5OlxuXHRcdFx0XHRcdCFiSXNOYXZpZ2F0aW9uVGV4dCAmJiBvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiXVxuXHRcdFx0XHRcdFx0PyBvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiXS4kUGF0aFxuXHRcdFx0XHRcdFx0OiBudWxsLCAvL1RvIGJlIGltcGxlbWVudGVkIGJ5IEZFXG5cdFx0XHRcdHRleHRGb3JtYXR0ZXI6IG9Qcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0QGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFwiXVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59O1xuXG5DaGFydERlbGVnYXRlLmZvcm1hdFRleHQgPSBmdW5jdGlvbiAob1ZhbHVlMTogYW55LCBvVmFsdWUyOiBhbnkpIHtcblx0Y29uc3Qgb1RleHRBcnJhbmdlbWVudEFubm90YXRpb24gPSB0aGlzLnRleHRGb3JtYXR0ZXI7XG5cdGlmIChvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbi4kRW51bU1lbWJlciA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRGaXJzdFwiKSB7XG5cdFx0cmV0dXJuIGAke29WYWx1ZTJ9ICgke29WYWx1ZTF9KWA7XG5cdH0gZWxzZSBpZiAob1RleHRBcnJhbmdlbWVudEFubm90YXRpb24uJEVudW1NZW1iZXIgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50VHlwZS9UZXh0TGFzdFwiKSB7XG5cdFx0cmV0dXJuIGAke29WYWx1ZTF9ICgke29WYWx1ZTJ9KWA7XG5cdH0gZWxzZSBpZiAob1RleHRBcnJhbmdlbWVudEFubm90YXRpb24uJEVudW1NZW1iZXIgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50VHlwZS9UZXh0T25seVwiKSB7XG5cdFx0cmV0dXJuIG9WYWx1ZTI7XG5cdH1cblx0cmV0dXJuIG9WYWx1ZTIgPyBvVmFsdWUyIDogb1ZhbHVlMTtcbn07XG5cbkNoYXJ0RGVsZWdhdGUudXBkYXRlQmluZGluZ0luZm8gPSBmdW5jdGlvbiAob0NoYXJ0OiBhbnksIG9CaW5kaW5nSW5mbzogYW55KSB7XG5cdENoYXJ0RGVsZWdhdGUuX3NldENoYXJ0Tm9EYXRhVGV4dChvQ2hhcnQsIG9CaW5kaW5nSW5mbyk7XG5cblx0Y29uc3Qgb0ZpbHRlciA9IHNhcC51aS5nZXRDb3JlKCkuYnlJZChvQ2hhcnQuZ2V0RmlsdGVyKCkpIGFzIGFueTtcblx0aWYgKG9GaWx0ZXIpIHtcblx0XHRjb25zdCBtQ29uZGl0aW9ucyA9IG9GaWx0ZXIuZ2V0Q29uZGl0aW9ucygpO1xuXG5cdFx0aWYgKG1Db25kaXRpb25zKSB7XG5cdFx0XHRpZiAoIW9CaW5kaW5nSW5mbykge1xuXHRcdFx0XHRvQmluZGluZ0luZm8gPSB7fTtcblx0XHRcdH1cblx0XHRcdG9CaW5kaW5nSW5mby5zb3J0ZXIgPSB0aGlzLmdldFNvcnRlcnMob0NoYXJ0KTtcblx0XHRcdGNvbnN0IG9Jbm5lckNoYXJ0ID0gb0NoYXJ0LmdldENvbnRyb2xEZWxlZ2F0ZSgpLmdldElubmVyQ2hhcnQob0NoYXJ0KTtcblx0XHRcdGxldCBvRmlsdGVySW5mbztcblx0XHRcdGlmIChvSW5uZXJDaGFydCkge1xuXHRcdFx0XHQvLyBpZiB0aGUgYWN0aW9uIGlzIGEgZHJpbGwgZG93biwgY2hhcnQgc2VsZWN0aW9ucyBtdXN0IGJlIGNvbnNpZGVyZWRcblx0XHRcdFx0aWYgKENoYXJ0VXRpbHMuZ2V0Q2hhcnRTZWxlY3Rpb25zRXhpc3Qob0NoYXJ0KSkge1xuXHRcdFx0XHRcdG9GaWx0ZXJJbmZvID0gQ2hhcnRVdGlscy5nZXRBbGxGaWx0ZXJJbmZvKG9DaGFydCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9GaWx0ZXJJbmZvID0gb0ZpbHRlckluZm8gPyBvRmlsdGVySW5mbyA6IENoYXJ0VXRpbHMuZ2V0RmlsdGVyQmFyRmlsdGVySW5mbyhvQ2hhcnQpO1xuXHRcdFx0aWYgKG9GaWx0ZXJJbmZvKSB7XG5cdFx0XHRcdG9CaW5kaW5nSW5mby5maWx0ZXJzID0gb0ZpbHRlckluZm8uZmlsdGVycztcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc1BhcmFtZXRlclBhdGggPSBEZWxlZ2F0ZVV0aWwuZ2V0UGFyYW1ldGVyc0luZm8ob0ZpbHRlciwgbUNvbmRpdGlvbnMpO1xuXHRcdFx0aWYgKHNQYXJhbWV0ZXJQYXRoKSB7XG5cdFx0XHRcdG9CaW5kaW5nSW5mby5wYXRoID0gc1BhcmFtZXRlclBhdGg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2VhcmNoXG5cdFx0Y29uc3Qgb0luZm8gPSBGaWx0ZXJVdGlscy5nZXRGaWx0ZXJJbmZvKG9GaWx0ZXIsIHt9KTtcblx0XHRjb25zdCBvQXBwbHlTdXBwb3J0ZWQgPSBDb21tb25IZWxwZXIucGFyc2VDdXN0b21EYXRhKG9DaGFydC5kYXRhKFwiYXBwbHlTdXBwb3J0ZWRcIikpO1xuXHRcdGlmIChvQXBwbHlTdXBwb3J0ZWQgJiYgb0FwcGx5U3VwcG9ydGVkLmVuYWJsZVNlYXJjaCAmJiBvSW5mby5zZWFyY2gpIHtcblx0XHRcdG9CaW5kaW5nSW5mby5wYXJhbWV0ZXJzLiRzZWFyY2ggPSBDb21tb25VdGlscy5ub3JtYWxpemVTZWFyY2hUZXJtKG9JbmZvLnNlYXJjaCk7XG5cdFx0fSBlbHNlIGlmIChvQmluZGluZ0luZm8ucGFyYW1ldGVycy4kc2VhcmNoKSB7XG5cdFx0XHRkZWxldGUgb0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJHNlYXJjaDtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCFvQmluZGluZ0luZm8pIHtcblx0XHRcdG9CaW5kaW5nSW5mbyA9IHt9O1xuXHRcdH1cblx0XHRvQmluZGluZ0luZm8uc29ydGVyID0gdGhpcy5nZXRTb3J0ZXJzKG9DaGFydCk7XG5cdH1cblx0Q2hhcnREZWxlZ2F0ZS5fY2hlY2tBbmRBZGREcmFmdEZpbHRlcihvQ2hhcnQsIG9CaW5kaW5nSW5mbyk7XG59O1xuXG5DaGFydERlbGVnYXRlLmZldGNoUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvTURDQ2hhcnQ6IENoYXJ0KSB7XG5cdGNvbnN0IG9Nb2RlbCA9IHRoaXMuX2dldE1vZGVsKG9NRENDaGFydCk7XG5cdGxldCBwQ3JlYXRlUHJvcGVydHlJbmZvcztcblxuXHRpZiAoIW9Nb2RlbCkge1xuXHRcdHBDcmVhdGVQcm9wZXJ0eUluZm9zID0gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuXHRcdFx0b01EQ0NoYXJ0LmF0dGFjaE1vZGVsQ29udGV4dENoYW5nZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlc29sdmVyOiByZXNvbHZlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uTW9kZWxDb250ZXh0Q2hhbmdlIGFzIGFueSxcblx0XHRcdFx0dGhpc1xuXHRcdFx0KTtcblx0XHR9KS50aGVuKChvUmV0cmlldmVkTW9kZWw6IGFueSkgPT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVByb3BlcnR5SW5mb3Mob01EQ0NoYXJ0LCBvUmV0cmlldmVkTW9kZWwpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHBDcmVhdGVQcm9wZXJ0eUluZm9zID0gdGhpcy5fY3JlYXRlUHJvcGVydHlJbmZvcyhvTURDQ2hhcnQsIG9Nb2RlbCk7XG5cdH1cblxuXHRyZXR1cm4gcENyZWF0ZVByb3BlcnR5SW5mb3MudGhlbihmdW5jdGlvbiAoYVByb3BlcnRpZXM6IGFueSkge1xuXHRcdGlmIChvTURDQ2hhcnQuZGF0YSkge1xuXHRcdFx0b01EQ0NoYXJ0LmRhdGEoXCIkbWRjQ2hhcnRQcm9wZXJ0eUluZm9cIiwgYVByb3BlcnRpZXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gYVByb3BlcnRpZXM7XG5cdH0pO1xufTtcbmZ1bmN0aW9uIG9uTW9kZWxDb250ZXh0Q2hhbmdlKHRoaXM6IHR5cGVvZiBDaGFydERlbGVnYXRlLCBvRXZlbnQ6IGFueSwgb0RhdGE6IGFueSkge1xuXHRjb25zdCBvTURDQ2hhcnQgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdGNvbnN0IG9Nb2RlbCA9IHRoaXMuX2dldE1vZGVsKG9NRENDaGFydCk7XG5cblx0aWYgKG9Nb2RlbCkge1xuXHRcdG9NRENDaGFydC5kZXRhY2hNb2RlbENvbnRleHRDaGFuZ2Uob25Nb2RlbENvbnRleHRDaGFuZ2UpO1xuXHRcdG9EYXRhLnJlc29sdmVyKG9Nb2RlbCk7XG5cdH1cbn1cbkNoYXJ0RGVsZWdhdGUuX2NyZWF0ZVByb3BlcnR5SW5mb3MgPSBhc3luYyBmdW5jdGlvbiAob01EQ0NoYXJ0OiBhbnksIG9Nb2RlbDogYW55KSB7XG5cdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gYC8ke29NRENDaGFydC5kYXRhKFwiZW50aXR5U2V0XCIpfWA7XG5cdGNvbnN0IG9NZXRhTW9kZWwgPSBvTW9kZWwuZ2V0TWV0YU1vZGVsKCk7XG5cblx0Y29uc3QgYVJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbChbb01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke3NFbnRpdHlTZXRQYXRofS9gKSwgb01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KGAke3NFbnRpdHlTZXRQYXRofUBgKV0pO1xuXHRjb25zdCBhUHJvcGVydGllczogYW55W10gPSBbXTtcblx0Y29uc3Qgb0VudGl0eVR5cGUgPSBhUmVzdWx0c1swXSxcblx0XHRtRW50aXR5U2V0QW5ub3RhdGlvbnMgPSBhUmVzdWx0c1sxXTtcblx0Y29uc3QgbUN1c3RvbUFnZ3JlZ2F0ZXMgPSBDb21tb25IZWxwZXIucGFyc2VDdXN0b21EYXRhKG9NRENDaGFydC5kYXRhKFwiY3VzdG9tQWdnXCIpKTtcblx0bGV0IHNBbm5vO1xuXHRjb25zdCBhUHJvcGVydHlQcm9taXNlID0gW107XG5cdGZvciAoY29uc3Qgc0Fubm9LZXkgaW4gbUVudGl0eVNldEFubm90YXRpb25zKSB7XG5cdFx0aWYgKHNBbm5vS2V5LnN0YXJ0c1dpdGgoXCJAT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkN1c3RvbUFnZ3JlZ2F0ZVwiKSkge1xuXHRcdFx0c0Fubm8gPSBzQW5ub0tleS5yZXBsYWNlKFwiQE9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5DdXN0b21BZ2dyZWdhdGUjXCIsIFwiXCIpO1xuXHRcdFx0Y29uc3QgYUFubm8gPSBzQW5uby5zcGxpdChcIkBcIik7XG5cblx0XHRcdGlmIChhQW5uby5sZW5ndGggPT0gMiAmJiBhQW5ub1sxXSA9PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5MYWJlbFwiKSB7XG5cdFx0XHRcdG1DdXN0b21BZ2dyZWdhdGVzW2FBbm5vWzBdXSA9IG1FbnRpdHlTZXRBbm5vdGF0aW9uc1tzQW5ub0tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGNvbnN0IGFEaW1lbnNpb25zOiBhbnlbXSA9IFtdLFxuXHRcdGFNZWFzdXJlcyA9IFtdO1xuXHRpZiAoT2JqZWN0LmtleXMobUN1c3RvbUFnZ3JlZ2F0ZXMpLmxlbmd0aCA+PSAxKSB7XG5cdFx0Y29uc3QgYUNoYXJ0SXRlbXMgPSBvTURDQ2hhcnQuZ2V0SXRlbXMoKTtcblx0XHRmb3IgKGNvbnN0IGtleSBpbiBhQ2hhcnRJdGVtcykge1xuXHRcdFx0aWYgKGFDaGFydEl0ZW1zW2tleV0uaXNBKFwic2FwLnVpLm1kYy5jaGFydC5EaW1lbnNpb25JdGVtXCIpKSB7XG5cdFx0XHRcdGFEaW1lbnNpb25zLnB1c2goYUNoYXJ0SXRlbXNba2V5XS5nZXRLZXkoKSk7XG5cdFx0XHR9IGVsc2UgaWYgKGFDaGFydEl0ZW1zW2tleV0uaXNBKFwic2FwLnVpLm1kYy5jaGFydC5NZWFzdXJlSXRlbVwiKSkge1xuXHRcdFx0XHRhTWVhc3VyZXMucHVzaChhQ2hhcnRJdGVtc1trZXldLmdldEtleSgpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKFxuXHRcdFx0YU1lYXN1cmVzLmZpbHRlcihmdW5jdGlvbiAodmFsOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGFEaW1lbnNpb25zLmluZGV4T2YodmFsKSAhPSAtMTtcblx0XHRcdH0pLmxlbmd0aCA+PSAxXG5cdFx0KSB7XG5cdFx0XHRMb2cuZXJyb3IoXCJEaW1lbnNpb24gYW5kIE1lYXN1cmUgaGFzIHRoZSBzYW1lUHJvcGVydHkgQ29uZmlndXJlZFwiKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBtVHlwZUFnZ3JlZ2F0YWJsZVByb3BzID0gQ29tbW9uSGVscGVyLnBhcnNlQ3VzdG9tRGF0YShvTURDQ2hhcnQuZGF0YShcInRyYW5zQWdnXCIpKTtcblx0Y29uc3QgbUtub3duQWdncmVnYXRhYmxlUHJvcHM6IGFueSA9IHt9O1xuXHRmb3IgKGNvbnN0IHNBZ2dyZWdhdGFibGUgaW4gbVR5cGVBZ2dyZWdhdGFibGVQcm9wcykge1xuXHRcdGNvbnN0IHNQcm9wS2V5ID0gbVR5cGVBZ2dyZWdhdGFibGVQcm9wc1tzQWdncmVnYXRhYmxlXS5wcm9wZXJ0eVBhdGg7XG5cdFx0bUtub3duQWdncmVnYXRhYmxlUHJvcHNbc1Byb3BLZXldID0gbUtub3duQWdncmVnYXRhYmxlUHJvcHNbc1Byb3BLZXldIHx8IHt9O1xuXHRcdG1Lbm93bkFnZ3JlZ2F0YWJsZVByb3BzW3NQcm9wS2V5XVttVHlwZUFnZ3JlZ2F0YWJsZVByb3BzW3NBZ2dyZWdhdGFibGVdLmFnZ3JlZ2F0aW9uTWV0aG9kXSA9IHtcblx0XHRcdG5hbWU6IG1UeXBlQWdncmVnYXRhYmxlUHJvcHNbc0FnZ3JlZ2F0YWJsZV0ubmFtZSxcblx0XHRcdGxhYmVsOiBtVHlwZUFnZ3JlZ2F0YWJsZVByb3BzW3NBZ2dyZWdhdGFibGVdLmxhYmVsXG5cdFx0fTtcblx0fVxuXHRmb3IgKGNvbnN0IHNLZXkgaW4gb0VudGl0eVR5cGUpIHtcblx0XHRpZiAoc0tleS5pbmRleE9mKFwiJFwiKSAhPT0gMCkge1xuXHRcdFx0YVByb3BlcnR5UHJvbWlzZS5wdXNoKFxuXHRcdFx0XHRPRGF0YU1ldGFNb2RlbFV0aWwuZmV0Y2hDcml0aWNhbGl0eShvTWV0YU1vZGVsLCBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KGAke3NFbnRpdHlTZXRQYXRofS8ke3NLZXl9YCkpLnRoZW4oXG5cdFx0XHRcdFx0Q2hhcnREZWxlZ2F0ZS5faGFuZGxlUHJvcGVydHkuYmluZChcblx0XHRcdFx0XHRcdG9NZXRhTW9kZWwuZ2V0TWV0YUNvbnRleHQoYCR7c0VudGl0eVNldFBhdGh9LyR7c0tleX1gKSxcblx0XHRcdFx0XHRcdG9NRENDaGFydCxcblx0XHRcdFx0XHRcdG1FbnRpdHlTZXRBbm5vdGF0aW9ucyxcblx0XHRcdFx0XHRcdG1Lbm93bkFnZ3JlZ2F0YWJsZVByb3BzLFxuXHRcdFx0XHRcdFx0bUN1c3RvbUFnZ3JlZ2F0ZXMsXG5cdFx0XHRcdFx0XHRhUHJvcGVydGllc1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblx0YXdhaXQgUHJvbWlzZS5hbGwoYVByb3BlcnR5UHJvbWlzZSk7XG5cblx0cmV0dXJuIGFQcm9wZXJ0aWVzO1xufTtcblxuQ2hhcnREZWxlZ2F0ZS5fY3JlYXRlUHJvcGVydHlJbmZvc0ZvckFnZ3JlZ2F0YWJsZSA9IGZ1bmN0aW9uIChcblx0b01EQ0NoYXJ0OiBDaGFydCxcblx0c0tleTogc3RyaW5nLFxuXHRvUHJvcGVydHlBbm5vdGF0aW9uczogYW55LFxuXHRvRmlsdGVyUmVzdHJpY3Rpb25zSW5mbzogYW55LFxuXHRvU29ydFJlc3RyaWN0aW9uc0luZm86IGFueSxcblx0bUtub3duQWdncmVnYXRhYmxlUHJvcHM6IGFueSxcblx0bUN1c3RvbUFnZ3JlZ2F0ZXM6IGFueVxuKSB7XG5cdGNvbnN0IGFBZ2dyZWdhdGVQcm9wZXJ0aWVzID0gW107XG5cdGlmIChPYmplY3Qua2V5cyhtS25vd25BZ2dyZWdhdGFibGVQcm9wcykuaW5kZXhPZihzS2V5KSA+IC0xKSB7XG5cdFx0Zm9yIChjb25zdCBzQWdncmVnYXRhYmxlIGluIG1Lbm93bkFnZ3JlZ2F0YWJsZVByb3BzW3NLZXldKSB7XG5cdFx0XHRhQWdncmVnYXRlUHJvcGVydGllcy5wdXNoKHtcblx0XHRcdFx0bmFtZTogXCJfZmVfYWdncmVnYXRhYmxlX1wiICsgbUtub3duQWdncmVnYXRhYmxlUHJvcHNbc0tleV1bc0FnZ3JlZ2F0YWJsZV0ubmFtZSxcblx0XHRcdFx0cHJvcGVydHlQYXRoOiBzS2V5LFxuXHRcdFx0XHRsYWJlbDpcblx0XHRcdFx0XHRtS25vd25BZ2dyZWdhdGFibGVQcm9wc1tzS2V5XVtzQWdncmVnYXRhYmxlXS5sYWJlbCB8fFxuXHRcdFx0XHRcdGAke29Qcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5MYWJlbFwiXX0gKCR7c0FnZ3JlZ2F0YWJsZX0pYCB8fFxuXHRcdFx0XHRcdGAke3NLZXl9ICgke3NBZ2dyZWdhdGFibGV9KWAsXG5cdFx0XHRcdHNvcnRhYmxlOiBvU29ydFJlc3RyaWN0aW9uc0luZm9bc0tleV0gPyBvU29ydFJlc3RyaWN0aW9uc0luZm9bc0tleV0uc29ydGFibGUgOiB0cnVlLFxuXHRcdFx0XHRmaWx0ZXJhYmxlOiBvRmlsdGVyUmVzdHJpY3Rpb25zSW5mb1tzS2V5XSA/IG9GaWx0ZXJSZXN0cmljdGlvbnNJbmZvW3NLZXldLmZpbHRlcmFibGUgOiB0cnVlLFxuXHRcdFx0XHRncm91cGFibGU6IGZhbHNlLFxuXHRcdFx0XHRhZ2dyZWdhdGFibGU6IHRydWUsXG5cdFx0XHRcdGFnZ3JlZ2F0aW9uTWV0aG9kOiBzQWdncmVnYXRhYmxlLFxuXHRcdFx0XHRtYXhDb25kaXRpb25zOiBPRGF0YU1ldGFNb2RlbFV0aWwuaXNNdWx0aVZhbHVlRmlsdGVyRXhwcmVzc2lvbihvRmlsdGVyUmVzdHJpY3Rpb25zSW5mby5wcm9wZXJ0eUluZm9bc0tleV0pID8gLTEgOiAxLFxuXHRcdFx0XHRyb2xlOiBDaGFydEl0ZW1Sb2xlVHlwZS5heGlzMSxcblx0XHRcdFx0ZGF0YXBvaW50OiBudWxsIC8vVG8gYmUgaW1wbGVtZW50ZWQgYnkgRkVcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRpZiAoT2JqZWN0LmtleXMobUN1c3RvbUFnZ3JlZ2F0ZXMpLmluZGV4T2Yoc0tleSkgPiAtMSkge1xuXHRcdGZvciAoY29uc3Qgc0N1c3RvbSBpbiBtQ3VzdG9tQWdncmVnYXRlcykge1xuXHRcdFx0aWYgKHNDdXN0b20gPT09IHNLZXkpIHtcblx0XHRcdFx0Y29uc3Qgb0l0ZW0gPSBtZXJnZSh7fSwgbUN1c3RvbUFnZ3JlZ2F0ZXNbc0N1c3RvbV0sIHtcblx0XHRcdFx0XHRuYW1lOiBcIl9mZV9hZ2dyZWdhdGFibGVfXCIgKyBzQ3VzdG9tLFxuXHRcdFx0XHRcdGdyb3VwYWJsZTogZmFsc2UsXG5cdFx0XHRcdFx0YWdncmVnYXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHJvbGU6IENoYXJ0SXRlbVJvbGVUeXBlLmF4aXMxLFxuXHRcdFx0XHRcdGRhdGFwb2ludDogbnVsbCAvL1RvIGJlIGltcGxlbWVudGVkIGJ5IEZFXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhQWdncmVnYXRlUHJvcGVydGllcy5wdXNoKG9JdGVtKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGFBZ2dyZWdhdGVQcm9wZXJ0aWVzO1xufTtcbkNoYXJ0RGVsZWdhdGUucmViaW5kID0gZnVuY3Rpb24gKG9NRENDaGFydDogYW55LCBvQmluZGluZ0luZm86IGFueSkge1xuXHRjb25zdCBzU2VhcmNoID0gb0JpbmRpbmdJbmZvLnBhcmFtZXRlcnMuJHNlYXJjaDtcblxuXHRpZiAoc1NlYXJjaCkge1xuXHRcdGRlbGV0ZSBvQmluZGluZ0luZm8ucGFyYW1ldGVycy4kc2VhcmNoO1xuXHR9XG5cblx0QmFzZUNoYXJ0RGVsZWdhdGUucmViaW5kKG9NRENDaGFydCwgb0JpbmRpbmdJbmZvKTtcblxuXHRpZiAoc1NlYXJjaCkge1xuXHRcdGNvbnN0IG9Jbm5lckNoYXJ0ID0gb01EQ0NoYXJ0LmdldENvbnRyb2xEZWxlZ2F0ZSgpLmdldElubmVyQ2hhcnQob01EQ0NoYXJ0KSxcblx0XHRcdG9DaGFydEJpbmRpbmcgPSBvSW5uZXJDaGFydCAmJiBvSW5uZXJDaGFydC5nZXRCaW5kaW5nKFwiZGF0YVwiKTtcblxuXHRcdC8vIFRlbXBvcmFyeSB3b3JrYXJvdW5kIHVudGlsIHRoaXMgaXMgZml4ZWQgaW4gTURDQ2hhcnQgLyBVSTUgQ2hhcnRcblx0XHQvLyBJbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgMiBPRGF0YSByZXF1ZXN0cywgd2UgbmVlZCB0byBzdXNwZW5kIHRoZSBiaW5kaW5nIGJlZm9yZSBzZXR0aW5nIHNvbWUgYWdncmVnYXRpb24gcHJvcGVydGllc1xuXHRcdC8vIGFuZCByZXN1bWUgaXQgb25jZSB0aGUgY2hhcnQgaGFzIGFkZGVkIG90aGVyIGFnZ3JlZ2F0aW9uIHByb3BlcnRpZXMgKGluIG9uQmVmb3JlUmVuZGVyaW5nKVxuXHRcdG9DaGFydEJpbmRpbmcuc3VzcGVuZCgpO1xuXHRcdG9DaGFydEJpbmRpbmcuc2V0QWdncmVnYXRpb24oeyBzZWFyY2g6IHNTZWFyY2ggfSk7XG5cblx0XHRjb25zdCBvSW5uZXJDaGFydERlbGVnYXRlID0ge1xuXHRcdFx0b25CZWZvcmVSZW5kZXJpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0b0NoYXJ0QmluZGluZy5yZXN1bWUoKTtcblx0XHRcdFx0b0lubmVyQ2hhcnQucmVtb3ZlRXZlbnREZWxlZ2F0ZShvSW5uZXJDaGFydERlbGVnYXRlKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdG9Jbm5lckNoYXJ0LmFkZEV2ZW50RGVsZWdhdGUob0lubmVyQ2hhcnREZWxlZ2F0ZSk7XG5cdH1cblxuXHRvTURDQ2hhcnQuZmlyZUV2ZW50KFwiYmluZGluZ1VwZGF0ZWRcIik7XG59O1xuQ2hhcnREZWxlZ2F0ZS5fc2V0Q2hhcnQgPSBmdW5jdGlvbiAob01EQ0NoYXJ0OiBhbnksIG9Jbm5lckNoYXJ0OiBhbnkpIHtcblx0Y29uc3Qgb0NoYXJ0QVBJID0gb01EQ0NoYXJ0LmdldFBhcmVudCgpO1xuXHRvSW5uZXJDaGFydC5zZXRWaXpQcm9wZXJ0aWVzKG9NRENDaGFydC5kYXRhKFwidml6UHJvcGVydGllc1wiKSk7XG5cdG9Jbm5lckNoYXJ0LmRldGFjaFNlbGVjdERhdGEob0NoYXJ0QVBJLmhhbmRsZVNlbGVjdGlvbkNoYW5nZS5iaW5kKG9DaGFydEFQSSkpO1xuXHRvSW5uZXJDaGFydC5kZXRhY2hEZXNlbGVjdERhdGEob0NoYXJ0QVBJLmhhbmRsZVNlbGVjdGlvbkNoYW5nZS5iaW5kKG9DaGFydEFQSSkpO1xuXHRvSW5uZXJDaGFydC5kZXRhY2hEcmlsbGVkVXAob0NoYXJ0QVBJLmhhbmRsZVNlbGVjdGlvbkNoYW5nZS5iaW5kKG9DaGFydEFQSSkpO1xuXHRvSW5uZXJDaGFydC5hdHRhY2hTZWxlY3REYXRhKG9DaGFydEFQSS5oYW5kbGVTZWxlY3Rpb25DaGFuZ2UuYmluZChvQ2hhcnRBUEkpKTtcblx0b0lubmVyQ2hhcnQuYXR0YWNoRGVzZWxlY3REYXRhKG9DaGFydEFQSS5oYW5kbGVTZWxlY3Rpb25DaGFuZ2UuYmluZChvQ2hhcnRBUEkpKTtcblx0b0lubmVyQ2hhcnQuYXR0YWNoRHJpbGxlZFVwKG9DaGFydEFQSS5oYW5kbGVTZWxlY3Rpb25DaGFuZ2UuYmluZChvQ2hhcnRBUEkpKTtcblxuXHRvSW5uZXJDaGFydC5zZXRTZWxlY3Rpb25Nb2RlKG9NRENDaGFydC5nZXRQYXlsb2FkKCkuc2VsZWN0aW9uTW9kZS50b1VwcGVyQ2FzZSgpKTtcblx0QmFzZUNoYXJ0RGVsZWdhdGUuX3NldENoYXJ0KG9NRENDaGFydCwgb0lubmVyQ2hhcnQpO1xufTtcbkNoYXJ0RGVsZWdhdGUuX2dldEJpbmRpbmdJbmZvID0gZnVuY3Rpb24gKG9NRENDaGFydDogYW55KSB7XG5cdGlmICh0aGlzLl9nZXRCaW5kaW5nSW5mb0Zyb21TdGF0ZShvTURDQ2hhcnQpKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldEJpbmRpbmdJbmZvRnJvbVN0YXRlKG9NRENDaGFydCk7XG5cdH1cblxuXHRjb25zdCBvTWV0YWRhdGFJbmZvID0gb01EQ0NoYXJ0LmdldERlbGVnYXRlKCkucGF5bG9hZDtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9NRENDaGFydC5nZXRNb2RlbCgpICYmIG9NRENDaGFydC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpO1xuXHRjb25zdCBzVGFyZ2V0Q29sbGVjdGlvblBhdGggPSBvTURDQ2hhcnQuZGF0YShcInRhcmdldENvbGxlY3Rpb25QYXRoXCIpO1xuXHRjb25zdCBzRW50aXR5U2V0UGF0aCA9XG5cdFx0KG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NUYXJnZXRDb2xsZWN0aW9uUGF0aH0vJGtpbmRgKSAhPT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiA/IFwiL1wiIDogXCJcIikgKyBvTWV0YWRhdGFJbmZvLmNvbnRleHRQYXRoO1xuXHRjb25zdCBvUGFyYW1zID0gbWVyZ2Uoe30sIG9NZXRhZGF0YUluZm8ucGFyYW1ldGVycywge1xuXHRcdGVudGl0eVNldDogb01EQ0NoYXJ0LmRhdGEoXCJlbnRpdHlTZXRcIiksXG5cdFx0dXNlQmF0Y2hSZXF1ZXN0czogdHJ1ZSxcblx0XHRwcm92aWRlR3JhbmRUb3RhbHM6IHRydWUsXG5cdFx0cHJvdmlkZVRvdGFsUmVzdWx0U2l6ZTogdHJ1ZSxcblx0XHRub1BhZ2luZzogdHJ1ZVxuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRwYXRoOiBzRW50aXR5U2V0UGF0aCxcblx0XHRldmVudHM6IHtcblx0XHRcdGRhdGFSZXF1ZXN0ZWQ6IG9NRENDaGFydC5nZXRQYXJlbnQoKS5vbkludGVybmFsRGF0YVJlcXVlc3RlZC5iaW5kKG9NRENDaGFydC5nZXRQYXJlbnQoKSlcblx0XHR9LFxuXHRcdHBhcmFtZXRlcnM6IG9QYXJhbXNcblx0fTtcbn07XG5DaGFydERlbGVnYXRlLnJlbW92ZUl0ZW1Gcm9tSW5uZXJDaGFydCA9IGZ1bmN0aW9uIChvTURDQ2hhcnQ6IGFueSwgb01EQ0NoYXJ0SXRlbTogYW55KSB7XG5cdEJhc2VDaGFydERlbGVnYXRlLnJlbW92ZUl0ZW1Gcm9tSW5uZXJDaGFydC5jYWxsKHRoaXMsIG9NRENDaGFydCwgb01EQ0NoYXJ0SXRlbSk7XG5cdGlmIChvTURDQ2hhcnRJdGVtLmdldFR5cGUoKSA9PT0gXCJncm91cGFibGVcIikge1xuXHRcdGNvbnN0IG9Jbm5lckNoYXJ0ID0gdGhpcy5fZ2V0Q2hhcnQob01EQ0NoYXJ0KTtcblx0XHRvSW5uZXJDaGFydC5maXJlRGVzZWxlY3REYXRhKCk7XG5cdH1cbn07XG5DaGFydERlbGVnYXRlLl9nZXRTb3J0YWJsZSA9IGZ1bmN0aW9uIChvTURDQ2hhcnQ6IGFueSwgb1NvcnRSZXN0cmljdGlvbnM6IGFueSwgYklzVHJhbnNBZ2dyZWdhdGU6IGFueSkge1xuXHRpZiAoYklzVHJhbnNBZ2dyZWdhdGUpIHtcblx0XHRpZiAob01EQ0NoYXJ0LmRhdGEoXCJkcmFmdFN1cHBvcnRlZFwiKSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG9Tb3J0UmVzdHJpY3Rpb25zID8gb1NvcnRSZXN0cmljdGlvbnMuc29ydGFibGUgOiB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb1NvcnRSZXN0cmljdGlvbnMgPyBvU29ydFJlc3RyaWN0aW9ucy5zb3J0YWJsZSA6IHRydWU7XG59O1xuQ2hhcnREZWxlZ2F0ZS5fY2hlY2tBbmRBZGREcmFmdEZpbHRlciA9IGZ1bmN0aW9uIChvQ2hhcnQ6IGFueSwgb0JpbmRpbmdJbmZvOiBhbnkpIHtcblx0aWYgKG9DaGFydC5kYXRhKFwiZHJhZnRTdXBwb3J0ZWRcIikgPT09IFwidHJ1ZVwiKSB7XG5cdFx0aWYgKCFvQmluZGluZ0luZm8pIHtcblx0XHRcdG9CaW5kaW5nSW5mbyA9IHt9O1xuXHRcdH1cblx0XHRpZiAoIW9CaW5kaW5nSW5mby5maWx0ZXJzKSB7XG5cdFx0XHRvQmluZGluZ0luZm8uZmlsdGVycyA9IFtdO1xuXHRcdH1cblx0XHRvQmluZGluZ0luZm8uZmlsdGVycy5wdXNoKG5ldyBGaWx0ZXIoXCJJc0FjdGl2ZUVudGl0eVwiLCBGaWx0ZXJPcGVyYXRvci5FUSwgdHJ1ZSkpO1xuXHR9XG59O1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhbiBJRCB3aGljaCBzaG91bGQgYmUgdXNlZCBpbiB0aGUgaW50ZXJuYWwgY2hhcnQgZm9yIHRoZSBtZWFzdXJlL2RpbWVuc2lvbi5cbiAqIEZvciBzdGFuZGFyZCBjYXNlcywgdGhpcyBpcyBqdXN0IHRoZSBpZCBvZiB0aGUgcHJvcGVydHkuXG4gKiBJZiBpdCBpcyBuZWNlc3NhcnkgdG8gdXNlIGFub3RoZXIgaWQgaW50ZXJuYWxseSBpbnNpZGUgdGhlIGNoYXJ0IChlLmcuIG9uIGR1cGxpY2F0ZSBwcm9wZXJ0eSBpZHMpIHRoaXMgbWV0aG9kIGNhbiBiZSBvdmVyd3JpdHRlbi5cbiAqIEluIHRoaXMgY2FzZSwgPGNvZGU+Z2V0UHJvcGVydHlGcm9tTmFtZUFuZEtpbmQ8L2NvZGU+IG5lZWRzIHRvIGJlIG92ZXJ3cml0dGVuIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgSUQgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0ge3N0cmluZ30ga2luZCBUeXBlIG9mIHRoZSBQcm9wZXJ0eSAoTWVhc3VyZS9EaW1lbnNpb24pXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBJbnRlcm5hbCBpZCBmb3IgdGhlIHNhcC5jaGFydC5DaGFydFxuICovXG5DaGFydERlbGVnYXRlLmdldEludGVybmFsQ2hhcnROYW1lRnJvbVByb3BlcnR5TmFtZUFuZEtpbmQgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nLCBraW5kOiBzdHJpbmcpIHtcblx0cmV0dXJuIG5hbWUucmVwbGFjZShcIl9mZV9cIiArIGtpbmQgKyBcIl9cIiwgXCJcIik7XG59O1xuXG4vKipcbiAqIFRoaXMgbWFwcyBhbiBpZCBvZiBhbiBpbnRlcm5hbCBjaGFydCBkaW1lbnNpb24vbWVhc3VyZSAmIHR5cGUgb2YgYSBwcm9wZXJ0eSB0byBpdHMgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBlbnRyeS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBJRCBvZiBpbnRlcm5hbCBjaGFydCBtZWFzdXJlL2RpbWVuc2lvblxuICogQHBhcmFtIHtzdHJpbmd9IGtpbmQgS2luZCBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7c2FwLnVpLm1kYy5DaGFydH0gbWRjQ2hhcnQgUmVmZXJlbmNlIHRvIHRoZSBNREMgY2hhcnRcbiAqIEByZXR1cm5zIHtvYmplY3R9IFByb3BlcnR5SW5mbyBvYmplY3RcbiAqL1xuQ2hhcnREZWxlZ2F0ZS5nZXRQcm9wZXJ0eUZyb21OYW1lQW5kS2luZCA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcsIGtpbmQ6IHN0cmluZywgbWRjQ2hhcnQ6IGFueSkge1xuXHRyZXR1cm4gbWRjQ2hhcnQuZ2V0UHJvcGVydHlIZWxwZXIoKS5nZXRQcm9wZXJ0eShcIl9mZV9cIiArIGtpbmQgKyBcIl9cIiArIG5hbWUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhcnREZWxlZ2F0ZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQWVBLElBQU1BLGlCQUFpQixHQUFJQyxNQUFELENBQWdCRCxpQkFBMUMsQyxDQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7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