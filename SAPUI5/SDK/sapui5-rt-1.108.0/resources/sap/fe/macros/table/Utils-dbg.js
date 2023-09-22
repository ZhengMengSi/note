/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/BindingToolkit", "sap/fe/macros/DelegateUtil", "sap/fe/macros/field/FieldRuntime", "sap/fe/macros/filter/FilterUtils", "sap/ui/core/Component", "sap/ui/core/format/NumberFormat", "sap/ui/model/Filter"], function (Log, CommonUtils, BindingToolkit, DelegateUtil, FieldRuntime, FilterUtils, Component, NumberFormat, Filter) {
  "use strict";

  var pathInModel = BindingToolkit.pathInModel;
  var compileExpression = BindingToolkit.compileExpression;

  /**
   * Get filter information for a SelectionVariant annotation.
   *
   * @param oTable The table instance
   * @param sSvPath Relative SelectionVariant annotation path
   * @returns Information on filters
   *  filters: array of sap.ui.model.filters
   * text: selection Variant text property
   * @private
   * @ui5-restricted
   */
  function getFiltersInfoForSV(oTable, sSvPath) {
    var sEntityTypePath = oTable.data("entityType"),
        oMetaModel = CommonUtils.getAppComponent(oTable).getMetaModel(),
        oSelectionVariant = oMetaModel.getObject("".concat(sEntityTypePath).concat(sSvPath)),
        mPropertyFilters = {},
        aFilters = [],
        aPaths = [];
    var sText = "";

    if (oSelectionVariant) {
      sText = oSelectionVariant.Text;
      (oSelectionVariant.SelectOptions || []).filter(function (oSelectOption) {
        return oSelectOption && oSelectOption.PropertyName && oSelectOption.PropertyName.$PropertyPath;
      }).forEach(function (oSelectOption) {
        var sPath = oSelectOption.PropertyName.$PropertyPath;

        if (!aPaths.includes(sPath)) {
          aPaths.push(sPath);
        }

        for (var j in oSelectOption.Ranges) {
          var oRange = oSelectOption.Ranges[j];
          mPropertyFilters[sPath] = (mPropertyFilters[sPath] || []).concat(new Filter(sPath, oRange.Option.$EnumMember.split("/").pop(), oRange.Low, oRange.High));
        }
      });

      for (var sPropertyPath in mPropertyFilters) {
        aFilters.push(new Filter({
          filters: mPropertyFilters[sPropertyPath],
          and: false
        }));
      }
    }

    return {
      properties: aPaths,
      filters: aFilters,
      text: sText
    };
  }

  function getHiddenFilters(oTable) {
    var aFilters = [];
    var hiddenFilters = oTable.data("hiddenFilters");

    if (hiddenFilters && Array.isArray(hiddenFilters.paths)) {
      hiddenFilters.paths.forEach(function (mPath) {
        var oSvFilter = getFiltersInfoForSV(oTable, mPath.annotationPath);
        aFilters = aFilters.concat(oSvFilter.filters);
      });
    }

    return aFilters;
  }

  function getQuickFilter(oTable) {
    var aFilters = [];
    var sQuickFilterKey = DelegateUtil.getCustomData(oTable, "quickFilterKey");

    if (sQuickFilterKey) {
      aFilters = aFilters.concat(getFiltersInfoForSV(oTable, sQuickFilterKey).filters);
    }

    return aFilters;
  }

  function getTableFilters(oTable) {
    return getQuickFilter(oTable).concat(getHiddenFilters(oTable));
  }

  function getListBindingForCount(oTable, oPageBinding, oParams) {
    var countBinding;
    var oBindingInfo = oTable.data("rowsBindingInfo"),
        oDataModel = oTable.getModel();
    var sBatchId = oParams.batchGroupId || "",
        oFilterInfo = getFilterInfo(oTable);
    var aFilters = Array.isArray(oParams.additionalFilters) ? oParams.additionalFilters : [];
    var sBindingPath = oFilterInfo.bindingPath ? oFilterInfo.bindingPath : oBindingInfo.path;
    aFilters = aFilters.concat(oFilterInfo.filters).concat(getP13nFilters(oTable));
    var oTableContextFilter = new Filter({
      filters: aFilters,
      and: true
    }); // Need to pass by a temporary ListBinding in order to get $filter query option (as string) thanks to fetchFilter of OdataListBinding

    var oListBinding = oDataModel.bindList((oPageBinding ? "".concat(oPageBinding.getPath(), "/") : "") + sBindingPath, oTable.getBindingContext(), [], oTableContextFilter);
    return oListBinding.fetchFilter(oListBinding.getContext()).then(function (aStringFilters) {
      countBinding = oDataModel.bindProperty("".concat(oListBinding.getPath(), "/$count"), oListBinding.getContext(), {
        $$groupId: sBatchId || "$auto",
        $filter: aStringFilters[0],
        $search: oFilterInfo.search
      });
      return countBinding.requestValue();
    }).then(function (iValue) {
      countBinding.destroy();
      oListBinding.destroy();
      return iValue;
    });
  }

  function getCountFormatted(iCount) {
    var oCountFormatter = NumberFormat.getIntegerInstance({
      groupingEnabled: true
    });
    return oCountFormatter.format(iCount);
  }

  function getFilterInfo(oTable) {
    var oTableDefinition = oTable.getParent().getTableDefinition();
    var aIgnoreProperties = [];

    function _getRelativePathArrayFromAggregates(oSubTable) {
      var mAggregates = oSubTable.getParent().getTableDefinition().aggregates;
      return Object.keys(mAggregates).map(function (sAggregateName) {
        return mAggregates[sAggregateName].relativePath;
      });
    }

    if (oTableDefinition.enableAnalytics) {
      aIgnoreProperties = aIgnoreProperties.concat(_getRelativePathArrayFromAggregates(oTable));

      if (!oTableDefinition.enableAnalyticsSearch) {
        // Search isn't allow as a $apply transformation for this table
        aIgnoreProperties = aIgnoreProperties.concat(["search"]);
      }
    }

    return FilterUtils.getFilterInfo(oTable.getFilter(), {
      ignoredProperties: aIgnoreProperties,
      targetControl: oTable
    });
  }
  /**
   * Retrieves all filters configured in Table filter personalization dialog.
   *
   * @param oTable Table instance
   * @returns Filters configured in table personalization dialog
   * @private
   * @ui5-restricted
   */


  function getP13nFilters(oTable) {
    var aP13nMode = oTable.getP13nMode();

    if (aP13nMode && aP13nMode.indexOf("Filter") > -1) {
      var aP13nProperties = (DelegateUtil.getCustomData(oTable, "sap_fe_TableDelegate_propertyInfoMap") || []).filter(function (oTableProperty) {
        return oTableProperty && !(oTableProperty.filterable === false);
      }),
          oFilterInfo = FilterUtils.getFilterInfo(oTable, {
        propertiesMetadata: aP13nProperties
      });

      if (oFilterInfo && oFilterInfo.filters) {
        return oFilterInfo.filters;
      }
    }

    return [];
  }

  function getAllFilterInfo(oTable) {
    var oIFilterInfo = getFilterInfo(oTable);
    return {
      filters: oIFilterInfo.filters.concat(getTableFilters(oTable), getP13nFilters(oTable)),
      search: oIFilterInfo.search,
      bindingPath: oIFilterInfo.bindingPath
    };
  }
  /**
   * Returns a promise that is resolved with the table itself when the table was bound.
   *
   * @param oTable The table to check for binding
   * @returns A Promise that will be resolved when table is bound
   */


  function whenBound(oTable) {
    return _getOrCreateBoundPromiseInfo(oTable).promise;
  }
  /**
   * If not yet happened, it resolves the table bound promise.
   *
   * @param oTable The table that was bound
   */


  function onTableBound(oTable) {
    var oBoundPromiseInfo = _getOrCreateBoundPromiseInfo(oTable);

    if (oBoundPromiseInfo.resolve) {
      oBoundPromiseInfo.resolve(oTable);
      oTable.data("boundPromiseResolve", null);
    }
  }

  function _getOrCreateBoundPromiseInfo(oTable) {
    if (!oTable.data("boundPromise")) {
      var fnResolve;
      oTable.data("boundPromise", new Promise(function (resolve) {
        fnResolve = resolve;
      }));

      if (oTable.isBound()) {
        fnResolve(oTable);
      } else {
        oTable.data("boundPromiseResolve", fnResolve);
      }
    }

    return {
      promise: oTable.data("boundPromise"),
      resolve: oTable.data("boundPromiseResolve")
    };
  }

  function updateBindingInfo(oBindingInfo, oFilterInfo, oFilter) {
    oBindingInfo.filters = oFilter;

    if (oFilterInfo.search) {
      oBindingInfo.parameters.$search = CommonUtils.normalizeSearchTerm(oFilterInfo.search);
    } else {
      oBindingInfo.parameters.$search = undefined;
    }
  }

  function fnGetSemanticTargetsFromTable(oController, oTable) {
    var oView = oController.getView();
    var oInternalModelContext = oView.getBindingContext("internal");

    if (oInternalModelContext) {
      var sEntitySet = DelegateUtil.getCustomData(oTable, "targetCollectionPath");

      if (sEntitySet) {
        var oComponent = oController.getOwnerComponent();
        var oAppComponent = Component.getOwnerComponentFor(oComponent);
        var oMetaModel = oAppComponent.getMetaModel();
        var oShellServiceHelper = CommonUtils.getShellServices(oAppComponent);

        var sCurrentHash = FieldRuntime._fnFixHashQueryString(CommonUtils.getHash());

        var oColumns = oTable.getParent().getTableDefinition().columns;
        var aSemanticObjectsForGetLinks = [];
        var aSemanticObjects = [];
        var aPathAlreadyProcessed = [];
        var sPath = "",
            sAnnotationPath,
            oProperty;

        var _oSemanticObject;

        var aSemanticObjectsPromises = [];
        var sQualifier, regexResult;

        for (var i = 0; i < oColumns.length; i++) {
          sAnnotationPath = oColumns[i].annotationPath; //this check is required in cases where custom columns are configured via manifest where there is no provision for an annotation path.

          if (sAnnotationPath) {
            oProperty = oMetaModel.getObject(sAnnotationPath);

            if (oProperty && oProperty.$kind === "Property") {
              sPath = oColumns[i].annotationPath;
            } else if (oProperty && oProperty.$Type === "com.sap.vocabularies.UI.v1.DataField") {
              sPath = "".concat(sEntitySet, "/").concat(oMetaModel.getObject("".concat(sAnnotationPath, "/Value/$Path")));
            }
          }

          if (sPath !== "") {
            var _Keys = Object.keys(oMetaModel.getObject(sPath + "@"));

            for (var index = 0; index < _Keys.length; index++) {
              if (!aPathAlreadyProcessed.includes(sPath) && _Keys[index].indexOf("@".concat("com.sap.vocabularies.Common.v1.SemanticObject")) === 0 && _Keys[index].indexOf("@".concat("com.sap.vocabularies.Common.v1.SemanticObjectMapping")) === -1 && _Keys[index].indexOf("@".concat("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")) === -1) {
                regexResult = /#(.*)/.exec(_Keys[index]);
                sQualifier = regexResult ? regexResult[1] : "";
                aSemanticObjectsPromises.push(CommonUtils.getSemanticObjectPromise(oAppComponent, oView, oMetaModel, sPath, sQualifier));
                aPathAlreadyProcessed.push(sPath);
              }
            }
          }

          sPath = "";
        }

        if (aSemanticObjectsPromises.length === 0) {
          return Promise.resolve();
        } else {
          Promise.all(aSemanticObjectsPromises).then(function (aValues) {
            var aGetLinksPromises = [];
            var sSemObjExpression;
            var aSemanticObjectsResolved = aValues.filter(function (element) {
              if (element.semanticObject && typeof element.semanticObject.semanticObject === "object") {
                sSemObjExpression = compileExpression(pathInModel(element.semanticObject.semanticObject.$Path));
                element.semanticObject.semanticObject = sSemObjExpression;
                element.semanticObjectForGetLinks[0].semanticObject = sSemObjExpression;
                return true;
              } else if (element) {
                return element.semanticObject !== undefined;
              } else {
                return false;
              }
            });

            for (var j = 0; j < aSemanticObjectsResolved.length; j++) {
              _oSemanticObject = aSemanticObjectsResolved[j];

              if (_oSemanticObject && _oSemanticObject.semanticObject && !(_oSemanticObject.semanticObject.semanticObject.indexOf("{") === 0)) {
                aSemanticObjectsForGetLinks.push(_oSemanticObject.semanticObjectForGetLinks);
                aSemanticObjects.push({
                  semanticObject: _oSemanticObject.semanticObject && _oSemanticObject.semanticObject.semanticObject,
                  unavailableActions: _oSemanticObject.unavailableActions,
                  path: aSemanticObjectsResolved[j].semanticObjectPath
                });
                aGetLinksPromises.push(oShellServiceHelper.getLinksWithCache([_oSemanticObject.semanticObjectForGetLinks])); //aSemanticObjectsForGetLinks));
              }
            }

            return CommonUtils.updateSemanticTargets(aGetLinksPromises, aSemanticObjects, oInternalModelContext, sCurrentHash);
          }).catch(function (oError) {
            Log.error("fnGetSemanticTargetsFromTable: Cannot get Semantic Objects", oError);
          });
        }
      }
    }
  }

  function clearSelection(oTable) {
    oTable.clearSelection();
    var oInternalModelContext = oTable.getBindingContext("internal");

    if (oInternalModelContext) {
      oInternalModelContext.setProperty("deleteEnabled", false);
      oInternalModelContext.setProperty("numberOfSelectedContexts", 0);
      oInternalModelContext.setProperty("selectedContexts", []);
      oInternalModelContext.setProperty("deletableContexts", []);
    }
  }

  var oTableUtils = {
    getCountFormatted: getCountFormatted,
    getHiddenFilters: getHiddenFilters,
    getFiltersInfoForSV: getFiltersInfoForSV,
    getTableFilters: getTableFilters,
    getListBindingForCount: getListBindingForCount,
    getFilterInfo: getFilterInfo,
    getP13nFilters: getP13nFilters,
    getAllFilterInfo: getAllFilterInfo,
    whenBound: whenBound,
    onTableBound: onTableBound,
    getSemanticTargetsFromTable: fnGetSemanticTargetsFromTable,
    updateBindingInfo: updateBindingInfo,
    clearSelection: clearSelection
  };
  return oTableUtils;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRGaWx0ZXJzSW5mb0ZvclNWIiwib1RhYmxlIiwic1N2UGF0aCIsInNFbnRpdHlUeXBlUGF0aCIsImRhdGEiLCJvTWV0YU1vZGVsIiwiQ29tbW9uVXRpbHMiLCJnZXRBcHBDb21wb25lbnQiLCJnZXRNZXRhTW9kZWwiLCJvU2VsZWN0aW9uVmFyaWFudCIsImdldE9iamVjdCIsIm1Qcm9wZXJ0eUZpbHRlcnMiLCJhRmlsdGVycyIsImFQYXRocyIsInNUZXh0IiwiVGV4dCIsIlNlbGVjdE9wdGlvbnMiLCJmaWx0ZXIiLCJvU2VsZWN0T3B0aW9uIiwiUHJvcGVydHlOYW1lIiwiJFByb3BlcnR5UGF0aCIsImZvckVhY2giLCJzUGF0aCIsImluY2x1ZGVzIiwicHVzaCIsImoiLCJSYW5nZXMiLCJvUmFuZ2UiLCJjb25jYXQiLCJGaWx0ZXIiLCJPcHRpb24iLCIkRW51bU1lbWJlciIsInNwbGl0IiwicG9wIiwiTG93IiwiSGlnaCIsInNQcm9wZXJ0eVBhdGgiLCJmaWx0ZXJzIiwiYW5kIiwicHJvcGVydGllcyIsInRleHQiLCJnZXRIaWRkZW5GaWx0ZXJzIiwiaGlkZGVuRmlsdGVycyIsIkFycmF5IiwiaXNBcnJheSIsInBhdGhzIiwibVBhdGgiLCJvU3ZGaWx0ZXIiLCJhbm5vdGF0aW9uUGF0aCIsImdldFF1aWNrRmlsdGVyIiwic1F1aWNrRmlsdGVyS2V5IiwiRGVsZWdhdGVVdGlsIiwiZ2V0Q3VzdG9tRGF0YSIsImdldFRhYmxlRmlsdGVycyIsImdldExpc3RCaW5kaW5nRm9yQ291bnQiLCJvUGFnZUJpbmRpbmciLCJvUGFyYW1zIiwiY291bnRCaW5kaW5nIiwib0JpbmRpbmdJbmZvIiwib0RhdGFNb2RlbCIsImdldE1vZGVsIiwic0JhdGNoSWQiLCJiYXRjaEdyb3VwSWQiLCJvRmlsdGVySW5mbyIsImdldEZpbHRlckluZm8iLCJhZGRpdGlvbmFsRmlsdGVycyIsInNCaW5kaW5nUGF0aCIsImJpbmRpbmdQYXRoIiwicGF0aCIsImdldFAxM25GaWx0ZXJzIiwib1RhYmxlQ29udGV4dEZpbHRlciIsIm9MaXN0QmluZGluZyIsImJpbmRMaXN0IiwiZ2V0UGF0aCIsImdldEJpbmRpbmdDb250ZXh0IiwiZmV0Y2hGaWx0ZXIiLCJnZXRDb250ZXh0IiwidGhlbiIsImFTdHJpbmdGaWx0ZXJzIiwiYmluZFByb3BlcnR5IiwiJCRncm91cElkIiwiJGZpbHRlciIsIiRzZWFyY2giLCJzZWFyY2giLCJyZXF1ZXN0VmFsdWUiLCJpVmFsdWUiLCJkZXN0cm95IiwiZ2V0Q291bnRGb3JtYXR0ZWQiLCJpQ291bnQiLCJvQ291bnRGb3JtYXR0ZXIiLCJOdW1iZXJGb3JtYXQiLCJnZXRJbnRlZ2VySW5zdGFuY2UiLCJncm91cGluZ0VuYWJsZWQiLCJmb3JtYXQiLCJvVGFibGVEZWZpbml0aW9uIiwiZ2V0UGFyZW50IiwiZ2V0VGFibGVEZWZpbml0aW9uIiwiYUlnbm9yZVByb3BlcnRpZXMiLCJfZ2V0UmVsYXRpdmVQYXRoQXJyYXlGcm9tQWdncmVnYXRlcyIsIm9TdWJUYWJsZSIsIm1BZ2dyZWdhdGVzIiwiYWdncmVnYXRlcyIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJzQWdncmVnYXRlTmFtZSIsInJlbGF0aXZlUGF0aCIsImVuYWJsZUFuYWx5dGljcyIsImVuYWJsZUFuYWx5dGljc1NlYXJjaCIsIkZpbHRlclV0aWxzIiwiZ2V0RmlsdGVyIiwiaWdub3JlZFByb3BlcnRpZXMiLCJ0YXJnZXRDb250cm9sIiwiYVAxM25Nb2RlIiwiZ2V0UDEzbk1vZGUiLCJpbmRleE9mIiwiYVAxM25Qcm9wZXJ0aWVzIiwib1RhYmxlUHJvcGVydHkiLCJmaWx0ZXJhYmxlIiwicHJvcGVydGllc01ldGFkYXRhIiwiZ2V0QWxsRmlsdGVySW5mbyIsIm9JRmlsdGVySW5mbyIsIndoZW5Cb3VuZCIsIl9nZXRPckNyZWF0ZUJvdW5kUHJvbWlzZUluZm8iLCJwcm9taXNlIiwib25UYWJsZUJvdW5kIiwib0JvdW5kUHJvbWlzZUluZm8iLCJyZXNvbHZlIiwiZm5SZXNvbHZlIiwiUHJvbWlzZSIsImlzQm91bmQiLCJ1cGRhdGVCaW5kaW5nSW5mbyIsIm9GaWx0ZXIiLCJwYXJhbWV0ZXJzIiwibm9ybWFsaXplU2VhcmNoVGVybSIsInVuZGVmaW5lZCIsImZuR2V0U2VtYW50aWNUYXJnZXRzRnJvbVRhYmxlIiwib0NvbnRyb2xsZXIiLCJvVmlldyIsImdldFZpZXciLCJvSW50ZXJuYWxNb2RlbENvbnRleHQiLCJzRW50aXR5U2V0Iiwib0NvbXBvbmVudCIsImdldE93bmVyQ29tcG9uZW50Iiwib0FwcENvbXBvbmVudCIsIkNvbXBvbmVudCIsImdldE93bmVyQ29tcG9uZW50Rm9yIiwib1NoZWxsU2VydmljZUhlbHBlciIsImdldFNoZWxsU2VydmljZXMiLCJzQ3VycmVudEhhc2giLCJGaWVsZFJ1bnRpbWUiLCJfZm5GaXhIYXNoUXVlcnlTdHJpbmciLCJnZXRIYXNoIiwib0NvbHVtbnMiLCJjb2x1bW5zIiwiYVNlbWFudGljT2JqZWN0c0ZvckdldExpbmtzIiwiYVNlbWFudGljT2JqZWN0cyIsImFQYXRoQWxyZWFkeVByb2Nlc3NlZCIsInNBbm5vdGF0aW9uUGF0aCIsIm9Qcm9wZXJ0eSIsIl9vU2VtYW50aWNPYmplY3QiLCJhU2VtYW50aWNPYmplY3RzUHJvbWlzZXMiLCJzUXVhbGlmaWVyIiwicmVnZXhSZXN1bHQiLCJpIiwibGVuZ3RoIiwiJGtpbmQiLCIkVHlwZSIsIl9LZXlzIiwiaW5kZXgiLCJleGVjIiwiZ2V0U2VtYW50aWNPYmplY3RQcm9taXNlIiwiYWxsIiwiYVZhbHVlcyIsImFHZXRMaW5rc1Byb21pc2VzIiwic1NlbU9iakV4cHJlc3Npb24iLCJhU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQiLCJlbGVtZW50Iiwic2VtYW50aWNPYmplY3QiLCJjb21waWxlRXhwcmVzc2lvbiIsInBhdGhJbk1vZGVsIiwiJFBhdGgiLCJzZW1hbnRpY09iamVjdEZvckdldExpbmtzIiwidW5hdmFpbGFibGVBY3Rpb25zIiwic2VtYW50aWNPYmplY3RQYXRoIiwiZ2V0TGlua3NXaXRoQ2FjaGUiLCJ1cGRhdGVTZW1hbnRpY1RhcmdldHMiLCJjYXRjaCIsIm9FcnJvciIsIkxvZyIsImVycm9yIiwiY2xlYXJTZWxlY3Rpb24iLCJzZXRQcm9wZXJ0eSIsIm9UYWJsZVV0aWxzIiwiZ2V0U2VtYW50aWNUYXJnZXRzRnJvbVRhYmxlIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJVdGlscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Bbm5vdGF0aW9uVGVybXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NvbW1vblwiO1xuaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24sIHBhdGhJbk1vZGVsIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB0eXBlIFBhZ2VDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvY29yZS9QYWdlQ29udHJvbGxlclwiO1xuaW1wb3J0IERlbGVnYXRlVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9EZWxlZ2F0ZVV0aWxcIjtcbmltcG9ydCBGaWVsZFJ1bnRpbWUgZnJvbSBcInNhcC9mZS9tYWNyb3MvZmllbGQvRmllbGRSdW50aW1lXCI7XG5pbXBvcnQgRmlsdGVyVXRpbHMgZnJvbSBcInNhcC9mZS9tYWNyb3MvZmlsdGVyL0ZpbHRlclV0aWxzXCI7XG5pbXBvcnQgdHlwZSBUYWJsZUFQSSBmcm9tIFwic2FwL2ZlL21hY3Jvcy90YWJsZS9UYWJsZUFQSVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwic2FwL3VpL2NvcmUvQ29tcG9uZW50XCI7XG5pbXBvcnQgdHlwZSBDb250cm9sIGZyb20gXCJzYXAvdWkvY29yZS9Db250cm9sXCI7XG5pbXBvcnQgTnVtYmVyRm9ybWF0IGZyb20gXCJzYXAvdWkvY29yZS9mb3JtYXQvTnVtYmVyRm9ybWF0XCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL3VpL21kYy9UYWJsZVwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBGaWx0ZXIgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJcIjtcbmltcG9ydCB0eXBlIE9EYXRhVjRMaXN0QmluZGluZyBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTGlzdEJpbmRpbmdcIjtcblxuLyoqXG4gKiBHZXQgZmlsdGVyIGluZm9ybWF0aW9uIGZvciBhIFNlbGVjdGlvblZhcmlhbnQgYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gb1RhYmxlIFRoZSB0YWJsZSBpbnN0YW5jZVxuICogQHBhcmFtIHNTdlBhdGggUmVsYXRpdmUgU2VsZWN0aW9uVmFyaWFudCBhbm5vdGF0aW9uIHBhdGhcbiAqIEByZXR1cm5zIEluZm9ybWF0aW9uIG9uIGZpbHRlcnNcbiAqICBmaWx0ZXJzOiBhcnJheSBvZiBzYXAudWkubW9kZWwuZmlsdGVyc1xuICogdGV4dDogc2VsZWN0aW9uIFZhcmlhbnQgdGV4dCBwcm9wZXJ0eVxuICogQHByaXZhdGVcbiAqIEB1aTUtcmVzdHJpY3RlZFxuICovXG5mdW5jdGlvbiBnZXRGaWx0ZXJzSW5mb0ZvclNWKG9UYWJsZTogYW55LCBzU3ZQYXRoOiBzdHJpbmcpIHtcblx0Y29uc3Qgc0VudGl0eVR5cGVQYXRoID0gb1RhYmxlLmRhdGEoXCJlbnRpdHlUeXBlXCIpLFxuXHRcdG9NZXRhTW9kZWwgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQob1RhYmxlKS5nZXRNZXRhTW9kZWwoKSxcblx0XHRvU2VsZWN0aW9uVmFyaWFudCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NFbnRpdHlUeXBlUGF0aH0ke3NTdlBhdGh9YCksXG5cdFx0bVByb3BlcnR5RmlsdGVyczogYW55ID0ge30sXG5cdFx0YUZpbHRlcnMgPSBbXSxcblx0XHRhUGF0aHM6IGFueVtdID0gW107XG5cdGxldCBzVGV4dCA9IFwiXCI7XG5cdGlmIChvU2VsZWN0aW9uVmFyaWFudCkge1xuXHRcdHNUZXh0ID0gb1NlbGVjdGlvblZhcmlhbnQuVGV4dDtcblx0XHQob1NlbGVjdGlvblZhcmlhbnQuU2VsZWN0T3B0aW9ucyB8fCBbXSlcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24gKG9TZWxlY3RPcHRpb246IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gb1NlbGVjdE9wdGlvbiAmJiBvU2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZSAmJiBvU2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0fSlcblx0XHRcdC5mb3JFYWNoKGZ1bmN0aW9uIChvU2VsZWN0T3B0aW9uOiBhbnkpIHtcblx0XHRcdFx0Y29uc3Qgc1BhdGggPSBvU2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRpZiAoIWFQYXRocy5pbmNsdWRlcyhzUGF0aCkpIHtcblx0XHRcdFx0XHRhUGF0aHMucHVzaChzUGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yIChjb25zdCBqIGluIG9TZWxlY3RPcHRpb24uUmFuZ2VzKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1JhbmdlID0gb1NlbGVjdE9wdGlvbi5SYW5nZXNbal07XG5cdFx0XHRcdFx0bVByb3BlcnR5RmlsdGVyc1tzUGF0aF0gPSAobVByb3BlcnR5RmlsdGVyc1tzUGF0aF0gfHwgW10pLmNvbmNhdChcblx0XHRcdFx0XHRcdG5ldyBGaWx0ZXIoc1BhdGgsIG9SYW5nZS5PcHRpb24uJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpLnBvcCgpLCBvUmFuZ2UuTG93LCBvUmFuZ2UuSGlnaClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdGZvciAoY29uc3Qgc1Byb3BlcnR5UGF0aCBpbiBtUHJvcGVydHlGaWx0ZXJzKSB7XG5cdFx0XHRhRmlsdGVycy5wdXNoKFxuXHRcdFx0XHRuZXcgRmlsdGVyKHtcblx0XHRcdFx0XHRmaWx0ZXJzOiBtUHJvcGVydHlGaWx0ZXJzW3NQcm9wZXJ0eVBhdGhdLFxuXHRcdFx0XHRcdGFuZDogZmFsc2Vcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRwcm9wZXJ0aWVzOiBhUGF0aHMsXG5cdFx0ZmlsdGVyczogYUZpbHRlcnMsXG5cdFx0dGV4dDogc1RleHRcblx0fTtcbn1cbmZ1bmN0aW9uIGdldEhpZGRlbkZpbHRlcnMob1RhYmxlOiBDb250cm9sKSB7XG5cdGxldCBhRmlsdGVyczogYW55W10gPSBbXTtcblx0Y29uc3QgaGlkZGVuRmlsdGVycyA9IG9UYWJsZS5kYXRhKFwiaGlkZGVuRmlsdGVyc1wiKTtcblx0aWYgKGhpZGRlbkZpbHRlcnMgJiYgQXJyYXkuaXNBcnJheShoaWRkZW5GaWx0ZXJzLnBhdGhzKSkge1xuXHRcdGhpZGRlbkZpbHRlcnMucGF0aHMuZm9yRWFjaChmdW5jdGlvbiAobVBhdGg6IGFueSkge1xuXHRcdFx0Y29uc3Qgb1N2RmlsdGVyID0gZ2V0RmlsdGVyc0luZm9Gb3JTVihvVGFibGUsIG1QYXRoLmFubm90YXRpb25QYXRoKTtcblx0XHRcdGFGaWx0ZXJzID0gYUZpbHRlcnMuY29uY2F0KG9TdkZpbHRlci5maWx0ZXJzKTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYUZpbHRlcnM7XG59XG5mdW5jdGlvbiBnZXRRdWlja0ZpbHRlcihvVGFibGU6IENvbnRyb2wpIHtcblx0bGV0IGFGaWx0ZXJzOiBhbnlbXSA9IFtdO1xuXHRjb25zdCBzUXVpY2tGaWx0ZXJLZXkgPSBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwicXVpY2tGaWx0ZXJLZXlcIik7XG5cdGlmIChzUXVpY2tGaWx0ZXJLZXkpIHtcblx0XHRhRmlsdGVycyA9IGFGaWx0ZXJzLmNvbmNhdChnZXRGaWx0ZXJzSW5mb0ZvclNWKG9UYWJsZSwgc1F1aWNrRmlsdGVyS2V5KS5maWx0ZXJzKTtcblx0fVxuXHRyZXR1cm4gYUZpbHRlcnM7XG59XG5mdW5jdGlvbiBnZXRUYWJsZUZpbHRlcnMob1RhYmxlOiBDb250cm9sKSB7XG5cdHJldHVybiBnZXRRdWlja0ZpbHRlcihvVGFibGUpLmNvbmNhdChnZXRIaWRkZW5GaWx0ZXJzKG9UYWJsZSkpO1xufVxuZnVuY3Rpb24gZ2V0TGlzdEJpbmRpbmdGb3JDb3VudChvVGFibGU6IFRhYmxlLCBvUGFnZUJpbmRpbmc6IGFueSwgb1BhcmFtczogYW55KSB7XG5cdGxldCBjb3VudEJpbmRpbmchOiBhbnk7XG5cdGNvbnN0IG9CaW5kaW5nSW5mbyA9IG9UYWJsZS5kYXRhKFwicm93c0JpbmRpbmdJbmZvXCIpLFxuXHRcdG9EYXRhTW9kZWwgPSBvVGFibGUuZ2V0TW9kZWwoKTtcblx0Y29uc3Qgc0JhdGNoSWQgPSBvUGFyYW1zLmJhdGNoR3JvdXBJZCB8fCBcIlwiLFxuXHRcdG9GaWx0ZXJJbmZvID0gZ2V0RmlsdGVySW5mbyhvVGFibGUpO1xuXHRsZXQgYUZpbHRlcnMgPSBBcnJheS5pc0FycmF5KG9QYXJhbXMuYWRkaXRpb25hbEZpbHRlcnMpID8gb1BhcmFtcy5hZGRpdGlvbmFsRmlsdGVycyA6IFtdO1xuXHRjb25zdCBzQmluZGluZ1BhdGggPSBvRmlsdGVySW5mby5iaW5kaW5nUGF0aCA/IG9GaWx0ZXJJbmZvLmJpbmRpbmdQYXRoIDogb0JpbmRpbmdJbmZvLnBhdGg7XG5cblx0YUZpbHRlcnMgPSBhRmlsdGVycy5jb25jYXQob0ZpbHRlckluZm8uZmlsdGVycykuY29uY2F0KGdldFAxM25GaWx0ZXJzKG9UYWJsZSkpO1xuXHRjb25zdCBvVGFibGVDb250ZXh0RmlsdGVyID0gbmV3IEZpbHRlcih7XG5cdFx0ZmlsdGVyczogYUZpbHRlcnMsXG5cdFx0YW5kOiB0cnVlXG5cdH0pO1xuXG5cdC8vIE5lZWQgdG8gcGFzcyBieSBhIHRlbXBvcmFyeSBMaXN0QmluZGluZyBpbiBvcmRlciB0byBnZXQgJGZpbHRlciBxdWVyeSBvcHRpb24gKGFzIHN0cmluZykgdGhhbmtzIHRvIGZldGNoRmlsdGVyIG9mIE9kYXRhTGlzdEJpbmRpbmdcblx0Y29uc3Qgb0xpc3RCaW5kaW5nID0gb0RhdGFNb2RlbC5iaW5kTGlzdChcblx0XHQob1BhZ2VCaW5kaW5nID8gYCR7b1BhZ2VCaW5kaW5nLmdldFBhdGgoKX0vYCA6IFwiXCIpICsgc0JpbmRpbmdQYXRoLFxuXHRcdG9UYWJsZS5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIENvbnRleHQsXG5cdFx0W10sXG5cdFx0b1RhYmxlQ29udGV4dEZpbHRlclxuXHQpIGFzIE9EYXRhVjRMaXN0QmluZGluZztcblxuXHRyZXR1cm4gKG9MaXN0QmluZGluZyBhcyBhbnkpXG5cdFx0LmZldGNoRmlsdGVyKG9MaXN0QmluZGluZy5nZXRDb250ZXh0KCkpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKGFTdHJpbmdGaWx0ZXJzOiBzdHJpbmdbXSkge1xuXHRcdFx0Y291bnRCaW5kaW5nID0gb0RhdGFNb2RlbC5iaW5kUHJvcGVydHkoYCR7b0xpc3RCaW5kaW5nLmdldFBhdGgoKX0vJGNvdW50YCwgb0xpc3RCaW5kaW5nLmdldENvbnRleHQoKSwge1xuXHRcdFx0XHQkJGdyb3VwSWQ6IHNCYXRjaElkIHx8IFwiJGF1dG9cIixcblx0XHRcdFx0JGZpbHRlcjogYVN0cmluZ0ZpbHRlcnNbMF0sXG5cdFx0XHRcdCRzZWFyY2g6IG9GaWx0ZXJJbmZvLnNlYXJjaFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY291bnRCaW5kaW5nLnJlcXVlc3RWYWx1ZSgpO1xuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24gKGlWYWx1ZTogYW55KSB7XG5cdFx0XHRjb3VudEJpbmRpbmcuZGVzdHJveSgpO1xuXHRcdFx0b0xpc3RCaW5kaW5nLmRlc3Ryb3koKTtcblx0XHRcdHJldHVybiBpVmFsdWU7XG5cdFx0fSk7XG59XG5mdW5jdGlvbiBnZXRDb3VudEZvcm1hdHRlZChpQ291bnQ6IGFueSkge1xuXHRjb25zdCBvQ291bnRGb3JtYXR0ZXIgPSBOdW1iZXJGb3JtYXQuZ2V0SW50ZWdlckluc3RhbmNlKHsgZ3JvdXBpbmdFbmFibGVkOiB0cnVlIH0pO1xuXHRyZXR1cm4gb0NvdW50Rm9ybWF0dGVyLmZvcm1hdChpQ291bnQpO1xufVxuZnVuY3Rpb24gZ2V0RmlsdGVySW5mbyhvVGFibGU6IGFueSkge1xuXHRjb25zdCBvVGFibGVEZWZpbml0aW9uID0gb1RhYmxlLmdldFBhcmVudCgpLmdldFRhYmxlRGVmaW5pdGlvbigpO1xuXHRsZXQgYUlnbm9yZVByb3BlcnRpZXM6IGFueVtdID0gW107XG5cblx0ZnVuY3Rpb24gX2dldFJlbGF0aXZlUGF0aEFycmF5RnJvbUFnZ3JlZ2F0ZXMob1N1YlRhYmxlOiBUYWJsZSkge1xuXHRcdGNvbnN0IG1BZ2dyZWdhdGVzID0gKG9TdWJUYWJsZS5nZXRQYXJlbnQoKSBhcyBUYWJsZUFQSSkuZ2V0VGFibGVEZWZpbml0aW9uKCkuYWdncmVnYXRlcyBhcyBhbnk7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKG1BZ2dyZWdhdGVzKS5tYXAoZnVuY3Rpb24gKHNBZ2dyZWdhdGVOYW1lKSB7XG5cdFx0XHRyZXR1cm4gbUFnZ3JlZ2F0ZXNbc0FnZ3JlZ2F0ZU5hbWVdLnJlbGF0aXZlUGF0aDtcblx0XHR9KTtcblx0fVxuXG5cdGlmIChvVGFibGVEZWZpbml0aW9uLmVuYWJsZUFuYWx5dGljcykge1xuXHRcdGFJZ25vcmVQcm9wZXJ0aWVzID0gYUlnbm9yZVByb3BlcnRpZXMuY29uY2F0KF9nZXRSZWxhdGl2ZVBhdGhBcnJheUZyb21BZ2dyZWdhdGVzKG9UYWJsZSkpO1xuXG5cdFx0aWYgKCFvVGFibGVEZWZpbml0aW9uLmVuYWJsZUFuYWx5dGljc1NlYXJjaCkge1xuXHRcdFx0Ly8gU2VhcmNoIGlzbid0IGFsbG93IGFzIGEgJGFwcGx5IHRyYW5zZm9ybWF0aW9uIGZvciB0aGlzIHRhYmxlXG5cdFx0XHRhSWdub3JlUHJvcGVydGllcyA9IGFJZ25vcmVQcm9wZXJ0aWVzLmNvbmNhdChbXCJzZWFyY2hcIl0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gRmlsdGVyVXRpbHMuZ2V0RmlsdGVySW5mbyhvVGFibGUuZ2V0RmlsdGVyKCksIHtcblx0XHRpZ25vcmVkUHJvcGVydGllczogYUlnbm9yZVByb3BlcnRpZXMsXG5cdFx0dGFyZ2V0Q29udHJvbDogb1RhYmxlXG5cdH0pO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyBhbGwgZmlsdGVycyBjb25maWd1cmVkIGluIFRhYmxlIGZpbHRlciBwZXJzb25hbGl6YXRpb24gZGlhbG9nLlxuICpcbiAqIEBwYXJhbSBvVGFibGUgVGFibGUgaW5zdGFuY2VcbiAqIEByZXR1cm5zIEZpbHRlcnMgY29uZmlndXJlZCBpbiB0YWJsZSBwZXJzb25hbGl6YXRpb24gZGlhbG9nXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKi9cbmZ1bmN0aW9uIGdldFAxM25GaWx0ZXJzKG9UYWJsZTogVGFibGUpIHtcblx0Y29uc3QgYVAxM25Nb2RlID0gb1RhYmxlLmdldFAxM25Nb2RlKCk7XG5cdGlmIChhUDEzbk1vZGUgJiYgYVAxM25Nb2RlLmluZGV4T2YoXCJGaWx0ZXJcIikgPiAtMSkge1xuXHRcdGNvbnN0IGFQMTNuUHJvcGVydGllcyA9IChEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvVGFibGUsIFwic2FwX2ZlX1RhYmxlRGVsZWdhdGVfcHJvcGVydHlJbmZvTWFwXCIpIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24gKFxuXHRcdFx0XHRvVGFibGVQcm9wZXJ0eTogYW55XG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIG9UYWJsZVByb3BlcnR5ICYmICEob1RhYmxlUHJvcGVydHkuZmlsdGVyYWJsZSA9PT0gZmFsc2UpO1xuXHRcdFx0fSksXG5cdFx0XHRvRmlsdGVySW5mbyA9IEZpbHRlclV0aWxzLmdldEZpbHRlckluZm8ob1RhYmxlLCB7IHByb3BlcnRpZXNNZXRhZGF0YTogYVAxM25Qcm9wZXJ0aWVzIH0pO1xuXHRcdGlmIChvRmlsdGVySW5mbyAmJiBvRmlsdGVySW5mby5maWx0ZXJzKSB7XG5cdFx0XHRyZXR1cm4gb0ZpbHRlckluZm8uZmlsdGVycztcblx0XHR9XG5cdH1cblx0cmV0dXJuIFtdO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxGaWx0ZXJJbmZvKG9UYWJsZTogVGFibGUpIHtcblx0Y29uc3Qgb0lGaWx0ZXJJbmZvID0gZ2V0RmlsdGVySW5mbyhvVGFibGUpO1xuXHRyZXR1cm4ge1xuXHRcdGZpbHRlcnM6IG9JRmlsdGVySW5mby5maWx0ZXJzLmNvbmNhdChnZXRUYWJsZUZpbHRlcnMob1RhYmxlKSwgZ2V0UDEzbkZpbHRlcnMob1RhYmxlKSksXG5cdFx0c2VhcmNoOiBvSUZpbHRlckluZm8uc2VhcmNoLFxuXHRcdGJpbmRpbmdQYXRoOiBvSUZpbHRlckluZm8uYmluZGluZ1BhdGhcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIHRhYmxlIGl0c2VsZiB3aGVuIHRoZSB0YWJsZSB3YXMgYm91bmQuXG4gKlxuICogQHBhcmFtIG9UYWJsZSBUaGUgdGFibGUgdG8gY2hlY2sgZm9yIGJpbmRpbmdcbiAqIEByZXR1cm5zIEEgUHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiB0YWJsZSBpcyBib3VuZFxuICovXG5mdW5jdGlvbiB3aGVuQm91bmQob1RhYmxlOiBUYWJsZSkge1xuXHRyZXR1cm4gX2dldE9yQ3JlYXRlQm91bmRQcm9taXNlSW5mbyhvVGFibGUpLnByb21pc2U7XG59XG5cbi8qKlxuICogSWYgbm90IHlldCBoYXBwZW5lZCwgaXQgcmVzb2x2ZXMgdGhlIHRhYmxlIGJvdW5kIHByb21pc2UuXG4gKlxuICogQHBhcmFtIG9UYWJsZSBUaGUgdGFibGUgdGhhdCB3YXMgYm91bmRcbiAqL1xuZnVuY3Rpb24gb25UYWJsZUJvdW5kKG9UYWJsZTogVGFibGUpIHtcblx0Y29uc3Qgb0JvdW5kUHJvbWlzZUluZm8gPSBfZ2V0T3JDcmVhdGVCb3VuZFByb21pc2VJbmZvKG9UYWJsZSk7XG5cdGlmIChvQm91bmRQcm9taXNlSW5mby5yZXNvbHZlKSB7XG5cdFx0b0JvdW5kUHJvbWlzZUluZm8ucmVzb2x2ZShvVGFibGUpO1xuXHRcdG9UYWJsZS5kYXRhKFwiYm91bmRQcm9taXNlUmVzb2x2ZVwiLCBudWxsKTtcblx0fVxufVxuXG5mdW5jdGlvbiBfZ2V0T3JDcmVhdGVCb3VuZFByb21pc2VJbmZvKG9UYWJsZTogVGFibGUpIHtcblx0aWYgKCFvVGFibGUuZGF0YShcImJvdW5kUHJvbWlzZVwiKSkge1xuXHRcdGxldCBmblJlc29sdmU6IGFueTtcblx0XHRvVGFibGUuZGF0YShcblx0XHRcdFwiYm91bmRQcm9taXNlXCIsXG5cdFx0XHRuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0XHRmblJlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0fSlcblx0XHQpO1xuXHRcdGlmICgob1RhYmxlIGFzIGFueSkuaXNCb3VuZCgpKSB7XG5cdFx0XHRmblJlc29sdmUob1RhYmxlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b1RhYmxlLmRhdGEoXCJib3VuZFByb21pc2VSZXNvbHZlXCIsIGZuUmVzb2x2ZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB7IHByb21pc2U6IG9UYWJsZS5kYXRhKFwiYm91bmRQcm9taXNlXCIpLCByZXNvbHZlOiBvVGFibGUuZGF0YShcImJvdW5kUHJvbWlzZVJlc29sdmVcIikgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmluZGluZ0luZm8ob0JpbmRpbmdJbmZvOiBhbnksIG9GaWx0ZXJJbmZvOiBhbnksIG9GaWx0ZXI6IGFueSkge1xuXHRvQmluZGluZ0luZm8uZmlsdGVycyA9IG9GaWx0ZXI7XG5cdGlmIChvRmlsdGVySW5mby5zZWFyY2gpIHtcblx0XHRvQmluZGluZ0luZm8ucGFyYW1ldGVycy4kc2VhcmNoID0gQ29tbW9uVXRpbHMubm9ybWFsaXplU2VhcmNoVGVybShvRmlsdGVySW5mby5zZWFyY2gpO1xuXHR9IGVsc2Uge1xuXHRcdG9CaW5kaW5nSW5mby5wYXJhbWV0ZXJzLiRzZWFyY2ggPSB1bmRlZmluZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm5HZXRTZW1hbnRpY1RhcmdldHNGcm9tVGFibGUob0NvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyLCBvVGFibGU6IFRhYmxlKSB7XG5cdGNvbnN0IG9WaWV3ID0gb0NvbnRyb2xsZXIuZ2V0VmlldygpO1xuXHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpO1xuXHRpZiAob0ludGVybmFsTW9kZWxDb250ZXh0KSB7XG5cdFx0Y29uc3Qgc0VudGl0eVNldCA9IERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9UYWJsZSwgXCJ0YXJnZXRDb2xsZWN0aW9uUGF0aFwiKTtcblx0XHRpZiAoc0VudGl0eVNldCkge1xuXHRcdFx0Y29uc3Qgb0NvbXBvbmVudCA9IG9Db250cm9sbGVyLmdldE93bmVyQ29tcG9uZW50KCk7XG5cdFx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tcG9uZW50LmdldE93bmVyQ29tcG9uZW50Rm9yKG9Db21wb25lbnQpIGFzIEFwcENvbXBvbmVudDtcblx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvQXBwQ29tcG9uZW50LmdldE1ldGFNb2RlbCgpO1xuXHRcdFx0Y29uc3Qgb1NoZWxsU2VydmljZUhlbHBlciA9IENvbW1vblV0aWxzLmdldFNoZWxsU2VydmljZXMob0FwcENvbXBvbmVudCk7XG5cdFx0XHRjb25zdCBzQ3VycmVudEhhc2ggPSBGaWVsZFJ1bnRpbWUuX2ZuRml4SGFzaFF1ZXJ5U3RyaW5nKENvbW1vblV0aWxzLmdldEhhc2goKSk7XG5cdFx0XHRjb25zdCBvQ29sdW1ucyA9IChvVGFibGUuZ2V0UGFyZW50KCkgYXMgVGFibGVBUEkpLmdldFRhYmxlRGVmaW5pdGlvbigpLmNvbHVtbnM7XG5cdFx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzRm9yR2V0TGlua3MgPSBbXTtcblx0XHRcdGNvbnN0IGFTZW1hbnRpY09iamVjdHM6IGFueVtdID0gW107XG5cdFx0XHRjb25zdCBhUGF0aEFscmVhZHlQcm9jZXNzZWQ6IHN0cmluZ1tdID0gW107XG5cdFx0XHRsZXQgc1BhdGg6IHN0cmluZyA9IFwiXCIsXG5cdFx0XHRcdHNBbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0b1Byb3BlcnR5O1xuXHRcdFx0bGV0IF9vU2VtYW50aWNPYmplY3Q7XG5cdFx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzUHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG5cdFx0XHRsZXQgc1F1YWxpZmllcjogc3RyaW5nLCByZWdleFJlc3VsdDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRzQW5ub3RhdGlvblBhdGggPSAob0NvbHVtbnNbaV0gYXMgYW55KS5hbm5vdGF0aW9uUGF0aDtcblx0XHRcdFx0Ly90aGlzIGNoZWNrIGlzIHJlcXVpcmVkIGluIGNhc2VzIHdoZXJlIGN1c3RvbSBjb2x1bW5zIGFyZSBjb25maWd1cmVkIHZpYSBtYW5pZmVzdCB3aGVyZSB0aGVyZSBpcyBubyBwcm92aXNpb24gZm9yIGFuIGFubm90YXRpb24gcGF0aC5cblx0XHRcdFx0aWYgKHNBbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0XHRcdG9Qcm9wZXJ0eSA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KHNBbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRcdFx0aWYgKG9Qcm9wZXJ0eSAmJiBvUHJvcGVydHkuJGtpbmQgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdFx0XHRcdFx0c1BhdGggPSAob0NvbHVtbnNbaV0gYXMgYW55KS5hbm5vdGF0aW9uUGF0aDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG9Qcm9wZXJ0eSAmJiBvUHJvcGVydHkuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkXCIpIHtcblx0XHRcdFx0XHRcdHNQYXRoID0gYCR7c0VudGl0eVNldH0vJHtvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzQW5ub3RhdGlvblBhdGh9L1ZhbHVlLyRQYXRoYCl9YDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNQYXRoICE9PSBcIlwiKSB7XG5cdFx0XHRcdFx0Y29uc3QgX0tleXMgPSBPYmplY3Qua2V5cyhvTWV0YU1vZGVsLmdldE9iamVjdChzUGF0aCArIFwiQFwiKSk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IF9LZXlzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHQhYVBhdGhBbHJlYWR5UHJvY2Vzc2VkLmluY2x1ZGVzKHNQYXRoKSAmJlxuXHRcdFx0XHRcdFx0XHRfS2V5c1tpbmRleF0uaW5kZXhPZihgQCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0fWApID09PSAwICYmXG5cdFx0XHRcdFx0XHRcdF9LZXlzW2luZGV4XS5pbmRleE9mKGBAJHtDb21tb25Bbm5vdGF0aW9uVGVybXMuU2VtYW50aWNPYmplY3RNYXBwaW5nfWApID09PSAtMSAmJlxuXHRcdFx0XHRcdFx0XHRfS2V5c1tpbmRleF0uaW5kZXhPZihgQCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zfWApID09PSAtMVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdHJlZ2V4UmVzdWx0ID0gLyMoLiopLy5leGVjKF9LZXlzW2luZGV4XSk7XG5cdFx0XHRcdFx0XHRcdHNRdWFsaWZpZXIgPSByZWdleFJlc3VsdCA/IHJlZ2V4UmVzdWx0WzFdIDogXCJcIjtcblx0XHRcdFx0XHRcdFx0YVNlbWFudGljT2JqZWN0c1Byb21pc2VzLnB1c2goXG5cdFx0XHRcdFx0XHRcdFx0Q29tbW9uVXRpbHMuZ2V0U2VtYW50aWNPYmplY3RQcm9taXNlKG9BcHBDb21wb25lbnQsIG9WaWV3LCBvTWV0YU1vZGVsLCBzUGF0aCwgc1F1YWxpZmllcilcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0YVBhdGhBbHJlYWR5UHJvY2Vzc2VkLnB1c2goc1BhdGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRzUGF0aCA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhU2VtYW50aWNPYmplY3RzUHJvbWlzZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFByb21pc2UuYWxsKGFTZW1hbnRpY09iamVjdHNQcm9taXNlcylcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYVZhbHVlczogYW55W10pIHtcblx0XHRcdFx0XHRcdGNvbnN0IGFHZXRMaW5rc1Byb21pc2VzID0gW107XG5cdFx0XHRcdFx0XHRsZXQgc1NlbU9iakV4cHJlc3Npb247XG5cdFx0XHRcdFx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgPSBhVmFsdWVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudDogYW55KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnNlbWFudGljT2JqZWN0ICYmIHR5cGVvZiBlbGVtZW50LnNlbWFudGljT2JqZWN0LnNlbWFudGljT2JqZWN0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0c1NlbU9iakV4cHJlc3Npb24gPSBjb21waWxlRXhwcmVzc2lvbihwYXRoSW5Nb2RlbChlbGVtZW50LnNlbWFudGljT2JqZWN0LnNlbWFudGljT2JqZWN0LiRQYXRoKSk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5zZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdCA9IHNTZW1PYmpFeHByZXNzaW9uO1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuc2VtYW50aWNPYmplY3RGb3JHZXRMaW5rc1swXS5zZW1hbnRpY09iamVjdCA9IHNTZW1PYmpFeHByZXNzaW9uO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudC5zZW1hbnRpY09iamVjdCAhPT0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGFTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHRfb1NlbWFudGljT2JqZWN0ID0gYVNlbWFudGljT2JqZWN0c1Jlc29sdmVkW2pdO1xuXHRcdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdFx0X29TZW1hbnRpY09iamVjdCAmJlxuXHRcdFx0XHRcdFx0XHRcdF9vU2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3QgJiZcblx0XHRcdFx0XHRcdFx0XHQhKF9vU2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3QuaW5kZXhPZihcIntcIikgPT09IDApXG5cdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdGFTZW1hbnRpY09iamVjdHNGb3JHZXRMaW5rcy5wdXNoKF9vU2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3RGb3JHZXRMaW5rcyk7XG5cdFx0XHRcdFx0XHRcdFx0YVNlbWFudGljT2JqZWN0cy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBfb1NlbWFudGljT2JqZWN0LnNlbWFudGljT2JqZWN0ICYmIF9vU2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3QsXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmF2YWlsYWJsZUFjdGlvbnM6IF9vU2VtYW50aWNPYmplY3QudW5hdmFpbGFibGVBY3Rpb25zLFxuXHRcdFx0XHRcdFx0XHRcdFx0cGF0aDogYVNlbWFudGljT2JqZWN0c1Jlc29sdmVkW2pdLnNlbWFudGljT2JqZWN0UGF0aFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGFHZXRMaW5rc1Byb21pc2VzLnB1c2gob1NoZWxsU2VydmljZUhlbHBlci5nZXRMaW5rc1dpdGhDYWNoZShbX29TZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdEZvckdldExpbmtzXSkpOyAvL2FTZW1hbnRpY09iamVjdHNGb3JHZXRMaW5rcykpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29tbW9uVXRpbHMudXBkYXRlU2VtYW50aWNUYXJnZXRzKGFHZXRMaW5rc1Byb21pc2VzLCBhU2VtYW50aWNPYmplY3RzLCBvSW50ZXJuYWxNb2RlbENvbnRleHQsIHNDdXJyZW50SGFzaCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJmbkdldFNlbWFudGljVGFyZ2V0c0Zyb21UYWJsZTogQ2Fubm90IGdldCBTZW1hbnRpYyBPYmplY3RzXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5mdW5jdGlvbiBjbGVhclNlbGVjdGlvbihvVGFibGU6IGFueSkge1xuXHRvVGFibGUuY2xlYXJTZWxlY3Rpb24oKTtcblx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb1RhYmxlLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIik7XG5cdGlmIChvSW50ZXJuYWxNb2RlbENvbnRleHQpIHtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJkZWxldGVFbmFibGVkXCIsIGZhbHNlKTtcblx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXCJudW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcIiwgMCk7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwic2VsZWN0ZWRDb250ZXh0c1wiLCBbXSk7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KFwiZGVsZXRhYmxlQ29udGV4dHNcIiwgW10pO1xuXHR9XG59XG5cbmNvbnN0IG9UYWJsZVV0aWxzID0ge1xuXHRnZXRDb3VudEZvcm1hdHRlZDogZ2V0Q291bnRGb3JtYXR0ZWQsXG5cdGdldEhpZGRlbkZpbHRlcnM6IGdldEhpZGRlbkZpbHRlcnMsXG5cdGdldEZpbHRlcnNJbmZvRm9yU1Y6IGdldEZpbHRlcnNJbmZvRm9yU1YsXG5cdGdldFRhYmxlRmlsdGVyczogZ2V0VGFibGVGaWx0ZXJzLFxuXHRnZXRMaXN0QmluZGluZ0ZvckNvdW50OiBnZXRMaXN0QmluZGluZ0ZvckNvdW50LFxuXHRnZXRGaWx0ZXJJbmZvOiBnZXRGaWx0ZXJJbmZvLFxuXHRnZXRQMTNuRmlsdGVyczogZ2V0UDEzbkZpbHRlcnMsXG5cdGdldEFsbEZpbHRlckluZm86IGdldEFsbEZpbHRlckluZm8sXG5cdHdoZW5Cb3VuZDogd2hlbkJvdW5kLFxuXHRvblRhYmxlQm91bmQ6IG9uVGFibGVCb3VuZCxcblx0Z2V0U2VtYW50aWNUYXJnZXRzRnJvbVRhYmxlOiBmbkdldFNlbWFudGljVGFyZ2V0c0Zyb21UYWJsZSxcblx0dXBkYXRlQmluZGluZ0luZm86IHVwZGF0ZUJpbmRpbmdJbmZvLFxuXHRjbGVhclNlbGVjdGlvbjogY2xlYXJTZWxlY3Rpb25cbn07XG5cbmV4cG9ydCBkZWZhdWx0IG9UYWJsZVV0aWxzO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7O0VBa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxT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