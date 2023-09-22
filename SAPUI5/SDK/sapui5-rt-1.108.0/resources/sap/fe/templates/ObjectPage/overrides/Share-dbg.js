/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/SemanticKeyHelper", "sap/ui/core/routing/HashChanger", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Log, ModelHelper, SemanticKeyHelper, HashChanger, Filter, FilterOperator) {
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

  var bGlobalIsStickySupported;

  function createFilterToFetchActiveContext(mKeyValues, bIsActiveEntityDefined) {
    var aKeys = Object.keys(mKeyValues);
    var aFilters = aKeys.map(function (sKey) {
      var sValue = mKeyValues[sKey];

      if (sValue !== undefined) {
        return new Filter(sKey, FilterOperator.EQ, sValue);
      }
    });

    if (bIsActiveEntityDefined) {
      var oActiveFilter = new Filter({
        filters: [new Filter("SiblingEntity/IsActiveEntity", FilterOperator.EQ, true)],
        and: false
      });
      aFilters.push(oActiveFilter);
    }

    return new Filter(aFilters, true);
  }

  function getActiveContextPath(oController, sPageEntityName, oFilter) {
    var oListBinding = oController.getView().getBindingContext().getModel().bindList("/".concat(sPageEntityName), undefined, undefined, oFilter, {
      "$$groupId": "$auto.Heroes"
    });
    return oListBinding.requestContexts(0, 2).then(function (oContexts) {
      if (oContexts && oContexts.length) {
        return oContexts[0].getPath();
      }
    });
  }

  function getActiveContextInstances(oContext, oController, oEntitySet) {
    var aActiveContextpromises = [];
    var aPages = [];
    var sMetaPath = oContext.getModel().getMetaModel().getMetaPath(oContext.getPath());

    if (sMetaPath.indexOf("/") === 0) {
      sMetaPath = sMetaPath.substring(1);
    }

    var aMetaPathArray = sMetaPath.split("/");
    var sCurrentHashNoParams = HashChanger.getInstance().getHash().split("?")[0];
    var aCurrentHashArray = sCurrentHashNoParams.split("/"); // oPageMap - creating an object that contains map of metapath name and it's technical details
    // which is required to create a filter to fetch the relavant/correct active context
    // Example: {SalesOrderManage:{technicalID:technicalIDValue}, _Item:{technicalID:technicalIDValue}} etc.,

    var oPageMap = {};
    var aPageHashArray = [];
    aCurrentHashArray.forEach(function (sPageHash) {
      var aKeyValues = sPageHash.substring(sPageHash.indexOf("(") + 1, sPageHash.length - 1).split(",");
      var mKeyValues = {};
      var sPageHashName = sPageHash.split("(")[0];
      oPageMap[sPageHashName] = {};
      aPageHashArray.push(sPageHashName);
      oPageMap[sPageHashName]["bIsActiveEntityDefined"] = true;

      for (var i = 0; i < aKeyValues.length; i++) {
        var sKeyAssignment = aKeyValues[i];
        var aParts = sKeyAssignment.split("=");
        var sKeyValue = aParts[1];
        var sKey = aParts[0]; // In case if only one technical key is defined then the url just contains the technicalIDValue but not the technicalID
        // Example: SalesOrderManage(ID=11111129-aaaa-bbbb-cccc-ddddeeeeffff,IsActiveEntity=false)/_Item(11111129-aaaa-bbbb-cccc-ddddeeeeffff)
        // In above example SalesOrderItem has only one technical key defined, hence technicalID info is not present in the url
        // Hence in such cases we get technical key and use them to fetch active context

        if (sKeyAssignment.indexOf("=") === -1) {
          var oMetaModel = oContext.getModel().getMetaModel();
          var aTechnicalKeys = oMetaModel.getObject("/".concat(aPageHashArray.join("/"), "/$Type/$Key"));
          sKeyValue = aParts[0];
          sKey = aTechnicalKeys[0];
          oPageMap[sPageHash.split("(")[0]]["bIsActiveEntityDefined"] = false;
        }

        if (sKey !== "IsActiveEntity") {
          if (sKeyValue.indexOf("'") === 0 && sKeyValue.lastIndexOf("'") === sKeyValue.length - 1) {
            // Remove the quotes from the value and decode special chars
            sKeyValue = decodeURIComponent(sKeyValue.substring(1, sKeyValue.length - 1));
          }

          mKeyValues[sKey] = sKeyValue;
        }
      }

      oPageMap[sPageHashName].mKeyValues = mKeyValues;
    });
    var oPageEntitySet = oEntitySet;
    aMetaPathArray.forEach(function (sNavigationPath) {
      var oPageInfo = {};
      var sPageEntitySetName = oPageEntitySet.$NavigationPropertyBinding && oPageEntitySet.$NavigationPropertyBinding[sNavigationPath];

      if (sPageEntitySetName) {
        oPageInfo.pageEntityName = oPageEntitySet.$NavigationPropertyBinding[sNavigationPath];
        oPageEntitySet = oContext.getModel().getMetaModel().getObject("/".concat(sPageEntitySetName)) || oEntitySet;
      } else {
        oPageInfo.pageEntityName = sNavigationPath;
      }

      oPageInfo.mKeyValues = oPageMap[sNavigationPath].mKeyValues;
      oPageInfo.bIsActiveEntityDefined = oPageMap[sNavigationPath].bIsActiveEntityDefined;
      aPages.push(oPageInfo);
    });
    aPages.forEach(function (oPageInfo) {
      var oFilter = createFilterToFetchActiveContext(oPageInfo.mKeyValues, oPageInfo.bIsActiveEntityDefined);
      aActiveContextpromises.push(getActiveContextPath(oController, oPageInfo.pageEntityName, oFilter));
    });
    return aActiveContextpromises;
  }
  /**
   * Method to fetch active context path's.
   *
   * @param oContext The Page Context
   * @param oController
   * @returns Promise which is resolved once the active context's are fetched
   */


  function getActiveContextPaths(oContext, oController) {
    var sCurrentHashNoParams = HashChanger.getInstance().getHash().split("?")[0];
    var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));

    if (sRootEntityName.indexOf("/") === 0) {
      sRootEntityName = sRootEntityName.substring(1);
    }

    var oEntitySet = oContext.getModel().getMetaModel().getObject("/".concat(sRootEntityName));
    var oPageContext = oContext;
    var aActiveContextpromises = getActiveContextInstances(oContext, oController, oEntitySet);

    if (aActiveContextpromises.length > 0) {
      return Promise.all(aActiveContextpromises).then(function (aData) {
        var aActiveContextPaths = [];
        var oPageEntitySet = oEntitySet;

        if (aData[0].indexOf("/") === 0) {
          aActiveContextPaths.push(aData[0].substring(1));
        } else {
          aActiveContextPaths.push(aData[0]);
        } // In the active context paths identify and replace the entitySet Name with corresponding navigation property name
        // Required to form the url pointing to active context
        // Example : SalesOrderItem --> _Item, MaterialDetails --> _MaterialDetails etc.,


        for (var i = 1; i < aData.length; i++) {
          var sActiveContextPath = aData[i];
          var sNavigatioProperty = "";
          var sEntitySetName = sActiveContextPath && sActiveContextPath.substr(0, sActiveContextPath.indexOf("("));

          if (sEntitySetName.indexOf("/") === 0) {
            sEntitySetName = sEntitySetName.substring(1);
          }

          if (sActiveContextPath.indexOf("/") === 0) {
            sActiveContextPath = sActiveContextPath.substring(1);
          }

          sNavigatioProperty = Object.keys(oPageEntitySet.$NavigationPropertyBinding)[Object.values(oPageEntitySet.$NavigationPropertyBinding).indexOf(sEntitySetName)];

          if (sNavigatioProperty) {
            aActiveContextPaths.push(sActiveContextPath.replace(sEntitySetName, sNavigatioProperty));
            oPageEntitySet = oPageContext.getModel().getMetaModel().getObject("/".concat(sEntitySetName)) || oEntitySet;
          } else {
            aActiveContextPaths.push(sActiveContextPath);
          }
        }

        return aActiveContextPaths;
      }).catch(function (oError) {
        Log.info("Failed to retrieve one or more active context path's", oError);
      });
    } else {
      return Promise.resolve();
    }
  }

  function fetchActiveContextPaths(oContext, oController) {
    var oPromise, aSemanticKeys;
    var sCurrentHashNoParams = HashChanger.getInstance().getHash().split("?")[0];

    if (oContext) {
      var oModel = oContext.getModel();
      var oMetaModel = oModel.getMetaModel();
      bGlobalIsStickySupported = ModelHelper.isStickySessionSupported(oMetaModel);
      var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));

      if (sRootEntityName.indexOf("/") === 0) {
        sRootEntityName = sRootEntityName.substring(1);
      }

      aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sRootEntityName);
    } // Fetch active context details incase of below scenario's(where page is not sticky supported(we do not have draft instance))
    // 1. In case of draft enabled Object page where semantic key based URL is not possible(like semantic keys are not modeled in the entity set)
    // 2. In case of draft enabled Sub Object Pages (where semantic bookmarking is not supported)


    var oViewData = oController.getView().getViewData();

    if (oContext && !bGlobalIsStickySupported && (oViewData.viewLevel === 1 && !aSemanticKeys || oViewData.viewLevel >= 2)) {
      oPromise = getActiveContextPaths(oContext, oController);
      return oPromise;
    } else {
      return Promise.resolve();
    }
  } // /**
  //  * Get share URL.
  //  * @param bIsEditable
  //  * @param bIsStickySupported
  //  * @param aActiveContextPaths
  //  * @returns {string} The share URL
  //  * @protected
  //  * @static
  //  */


  function getShareUrl(bIsEditable, bIsStickySupported, aActiveContextPaths) {
    var sShareUrl;
    var sHash = HashChanger.getInstance().getHash();
    var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";

    if (bIsEditable && !bIsStickySupported && aActiveContextPaths) {
      sShareUrl = sBasePath + aActiveContextPaths.join("/");
    } else {
      sShareUrl = sHash ? sBasePath + sHash : window.location.hash;
    }

    return window.location.origin + window.location.pathname + sShareUrl;
  }

  function getShareEmailUrl() {
    var oUShellContainer = sap.ushell && sap.ushell.Container;

    if (oUShellContainer) {
      return oUShellContainer.getFLPUrlAsync(true).then(function (sFLPUrl) {
        return sFLPUrl;
      }).catch(function (sError) {
        Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError);
      });
    } else {
      return Promise.resolve(document.URL);
    }
  }

  function getJamUrl(bIsEditMode, bIsStickySupported, aActiveContextPaths) {
    var sJamUrl;
    var sHash = HashChanger.getInstance().getHash();
    var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";

    if (bIsEditMode && !bIsStickySupported && aActiveContextPaths) {
      sJamUrl = sBasePath + aActiveContextPaths.join("/");
    } else {
      sJamUrl = sHash ? sBasePath + sHash : window.location.hash;
    } // in case we are in cFLP scenario, the application is running
    // inside an iframe, and there for we need to get the cFLP URL
    // and not 'document.URL' that represents the iframe URL


    if (sap.ushell && sap.ushell.Container && sap.ushell.Container.runningInIframe && sap.ushell.Container.runningInIframe()) {
      sap.ushell.Container.getFLPUrl(true).then(function (sUrl) {
        return sUrl.substr(0, sUrl.indexOf("#")) + sJamUrl;
      }).catch(function (sError) {
        Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError);
      });
    } else {
      return Promise.resolve(window.location.origin + window.location.pathname + sJamUrl);
    }
  }

  var ShareExtensionOverride = {
    adaptShareMetadata: function (oShareMetadata) {
      try {
        var _this2 = this;

        var oContext = _this2.base.getView().getBindingContext();

        var oUIModel = _this2.base.getView().getModel("ui");

        var bIsEditable = oUIModel.getProperty("/isEditable");

        var _temp2 = _catch(function () {
          return Promise.resolve(fetchActiveContextPaths(oContext, _this2.base.getView().getController())).then(function (aActiveContextPaths) {
            var oPageTitleInfo = _this2.base.getView().getController()._getPageTitleInformation();

            return Promise.resolve(Promise.all([getJamUrl(bIsEditable, bGlobalIsStickySupported, aActiveContextPaths), getShareUrl(bIsEditable, bGlobalIsStickySupported, aActiveContextPaths), getShareEmailUrl()])).then(function (oData) {
              var sTitle = oPageTitleInfo.title;
              var sObjectSubtitle = oPageTitleInfo.subtitle ? oPageTitleInfo.subtitle.toString() : "";

              if (sObjectSubtitle) {
                sTitle = "".concat(sTitle, " - ").concat(sObjectSubtitle);
              }

              oShareMetadata.tile = {
                title: oPageTitleInfo.title,
                subtitle: sObjectSubtitle
              };
              oShareMetadata.email.title = sTitle;
              oShareMetadata.title = sTitle;
              oShareMetadata.jam.url = oData[0];
              oShareMetadata.url = oData[1];
              oShareMetadata.email.url = oData[2]; // MS Teams collaboration does not want to allow further changes to the URL
              // so update colloborationInfo model at LR override to ignore further extension changes at multiple levels

              var collaborationInfoModel = _this2.base.getView().getModel("collaborationInfo");

              collaborationInfoModel.setProperty("/url", oShareMetadata.url);
              collaborationInfoModel.setProperty("/appTitle", oShareMetadata.title);
              collaborationInfoModel.setProperty("/subTitle", sObjectSubtitle);
            });
          });
        }, function (error) {
          Log.error(error);
        });

        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
          return oShareMetadata;
        }) : oShareMetadata);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
  return ShareExtensionOverride;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiYkdsb2JhbElzU3RpY2t5U3VwcG9ydGVkIiwiY3JlYXRlRmlsdGVyVG9GZXRjaEFjdGl2ZUNvbnRleHQiLCJtS2V5VmFsdWVzIiwiYklzQWN0aXZlRW50aXR5RGVmaW5lZCIsImFLZXlzIiwiT2JqZWN0Iiwia2V5cyIsImFGaWx0ZXJzIiwibWFwIiwic0tleSIsInNWYWx1ZSIsInVuZGVmaW5lZCIsIkZpbHRlciIsIkZpbHRlck9wZXJhdG9yIiwiRVEiLCJvQWN0aXZlRmlsdGVyIiwiZmlsdGVycyIsImFuZCIsInB1c2giLCJnZXRBY3RpdmVDb250ZXh0UGF0aCIsIm9Db250cm9sbGVyIiwic1BhZ2VFbnRpdHlOYW1lIiwib0ZpbHRlciIsIm9MaXN0QmluZGluZyIsImdldFZpZXciLCJnZXRCaW5kaW5nQ29udGV4dCIsImdldE1vZGVsIiwiYmluZExpc3QiLCJyZXF1ZXN0Q29udGV4dHMiLCJvQ29udGV4dHMiLCJsZW5ndGgiLCJnZXRQYXRoIiwiZ2V0QWN0aXZlQ29udGV4dEluc3RhbmNlcyIsIm9Db250ZXh0Iiwib0VudGl0eVNldCIsImFBY3RpdmVDb250ZXh0cHJvbWlzZXMiLCJhUGFnZXMiLCJzTWV0YVBhdGgiLCJnZXRNZXRhTW9kZWwiLCJnZXRNZXRhUGF0aCIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJhTWV0YVBhdGhBcnJheSIsInNwbGl0Iiwic0N1cnJlbnRIYXNoTm9QYXJhbXMiLCJIYXNoQ2hhbmdlciIsImdldEluc3RhbmNlIiwiZ2V0SGFzaCIsImFDdXJyZW50SGFzaEFycmF5Iiwib1BhZ2VNYXAiLCJhUGFnZUhhc2hBcnJheSIsImZvckVhY2giLCJzUGFnZUhhc2giLCJhS2V5VmFsdWVzIiwic1BhZ2VIYXNoTmFtZSIsImkiLCJzS2V5QXNzaWdubWVudCIsImFQYXJ0cyIsInNLZXlWYWx1ZSIsIm9NZXRhTW9kZWwiLCJhVGVjaG5pY2FsS2V5cyIsImdldE9iamVjdCIsImpvaW4iLCJsYXN0SW5kZXhPZiIsImRlY29kZVVSSUNvbXBvbmVudCIsIm9QYWdlRW50aXR5U2V0Iiwic05hdmlnYXRpb25QYXRoIiwib1BhZ2VJbmZvIiwic1BhZ2VFbnRpdHlTZXROYW1lIiwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmciLCJwYWdlRW50aXR5TmFtZSIsImdldEFjdGl2ZUNvbnRleHRQYXRocyIsInNSb290RW50aXR5TmFtZSIsInN1YnN0ciIsIm9QYWdlQ29udGV4dCIsIlByb21pc2UiLCJhbGwiLCJhRGF0YSIsImFBY3RpdmVDb250ZXh0UGF0aHMiLCJzQWN0aXZlQ29udGV4dFBhdGgiLCJzTmF2aWdhdGlvUHJvcGVydHkiLCJzRW50aXR5U2V0TmFtZSIsInZhbHVlcyIsInJlcGxhY2UiLCJjYXRjaCIsIm9FcnJvciIsIkxvZyIsImluZm8iLCJyZXNvbHZlIiwiZmV0Y2hBY3RpdmVDb250ZXh0UGF0aHMiLCJvUHJvbWlzZSIsImFTZW1hbnRpY0tleXMiLCJvTW9kZWwiLCJNb2RlbEhlbHBlciIsImlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsIlNlbWFudGljS2V5SGVscGVyIiwiZ2V0U2VtYW50aWNLZXlzIiwib1ZpZXdEYXRhIiwiZ2V0Vmlld0RhdGEiLCJ2aWV3TGV2ZWwiLCJnZXRTaGFyZVVybCIsImJJc0VkaXRhYmxlIiwiYklzU3RpY2t5U3VwcG9ydGVkIiwic1NoYXJlVXJsIiwic0hhc2giLCJzQmFzZVBhdGgiLCJocmVmRm9yQXBwU3BlY2lmaWNIYXNoIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwib3JpZ2luIiwicGF0aG5hbWUiLCJnZXRTaGFyZUVtYWlsVXJsIiwib1VTaGVsbENvbnRhaW5lciIsInNhcCIsInVzaGVsbCIsIkNvbnRhaW5lciIsImdldEZMUFVybEFzeW5jIiwic0ZMUFVybCIsInNFcnJvciIsImVycm9yIiwiZG9jdW1lbnQiLCJVUkwiLCJnZXRKYW1VcmwiLCJiSXNFZGl0TW9kZSIsInNKYW1VcmwiLCJydW5uaW5nSW5JZnJhbWUiLCJnZXRGTFBVcmwiLCJzVXJsIiwiU2hhcmVFeHRlbnNpb25PdmVycmlkZSIsImFkYXB0U2hhcmVNZXRhZGF0YSIsIm9TaGFyZU1ldGFkYXRhIiwiYmFzZSIsIm9VSU1vZGVsIiwiZ2V0UHJvcGVydHkiLCJnZXRDb250cm9sbGVyIiwib1BhZ2VUaXRsZUluZm8iLCJfZ2V0UGFnZVRpdGxlSW5mb3JtYXRpb24iLCJvRGF0YSIsInNUaXRsZSIsInRpdGxlIiwic09iamVjdFN1YnRpdGxlIiwic3VidGl0bGUiLCJ0b1N0cmluZyIsInRpbGUiLCJlbWFpbCIsImphbSIsInVybCIsImNvbGxhYm9yYXRpb25JbmZvTW9kZWwiLCJzZXRQcm9wZXJ0eSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2hhcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBTaGFyZSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvU2hhcmVcIjtcbmltcG9ydCBNb2RlbEhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9Nb2RlbEhlbHBlclwiO1xuaW1wb3J0IFNlbWFudGljS2V5SGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1NlbWFudGljS2V5SGVscGVyXCI7XG5pbXBvcnQgdHlwZSBPYmplY3RQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9PYmplY3RQYWdlL09iamVjdFBhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJcIjtcbmltcG9ydCBIYXNoQ2hhbmdlciBmcm9tIFwic2FwL3VpL2NvcmUvcm91dGluZy9IYXNoQ2hhbmdlclwiO1xuaW1wb3J0IEZpbHRlciBmcm9tIFwic2FwL3VpL21vZGVsL0ZpbHRlclwiO1xuaW1wb3J0IEZpbHRlck9wZXJhdG9yIGZyb20gXCJzYXAvdWkvbW9kZWwvRmlsdGVyT3BlcmF0b3JcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuXG5sZXQgYkdsb2JhbElzU3RpY2t5U3VwcG9ydGVkOiBib29sZWFuO1xuXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJUb0ZldGNoQWN0aXZlQ29udGV4dChtS2V5VmFsdWVzOiBhbnksIGJJc0FjdGl2ZUVudGl0eURlZmluZWQ6IGFueSkge1xuXHRjb25zdCBhS2V5cyA9IE9iamVjdC5rZXlzKG1LZXlWYWx1ZXMpO1xuXG5cdGNvbnN0IGFGaWx0ZXJzID0gYUtleXMubWFwKGZ1bmN0aW9uIChzS2V5OiBzdHJpbmcpIHtcblx0XHRjb25zdCBzVmFsdWUgPSBtS2V5VmFsdWVzW3NLZXldO1xuXHRcdGlmIChzVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIG5ldyBGaWx0ZXIoc0tleSwgRmlsdGVyT3BlcmF0b3IuRVEsIHNWYWx1ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAoYklzQWN0aXZlRW50aXR5RGVmaW5lZCkge1xuXHRcdGNvbnN0IG9BY3RpdmVGaWx0ZXIgPSBuZXcgRmlsdGVyKHtcblx0XHRcdGZpbHRlcnM6IFtuZXcgRmlsdGVyKFwiU2libGluZ0VudGl0eS9Jc0FjdGl2ZUVudGl0eVwiLCBGaWx0ZXJPcGVyYXRvci5FUSwgdHJ1ZSldLFxuXHRcdFx0YW5kOiBmYWxzZVxuXHRcdH0pO1xuXG5cdFx0YUZpbHRlcnMucHVzaChvQWN0aXZlRmlsdGVyKTtcblx0fVxuXG5cdHJldHVybiBuZXcgRmlsdGVyKGFGaWx0ZXJzIGFzIGFueSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBnZXRBY3RpdmVDb250ZXh0UGF0aChvQ29udHJvbGxlcjogYW55LCBzUGFnZUVudGl0eU5hbWU6IGFueSwgb0ZpbHRlcjogYW55KSB7XG5cdGNvbnN0IG9MaXN0QmluZGluZyA9IG9Db250cm9sbGVyXG5cdFx0LmdldFZpZXcoKVxuXHRcdC5nZXRCaW5kaW5nQ29udGV4dCgpXG5cdFx0LmdldE1vZGVsKClcblx0XHQuYmluZExpc3QoYC8ke3NQYWdlRW50aXR5TmFtZX1gLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgb0ZpbHRlciwgeyBcIiQkZ3JvdXBJZFwiOiBcIiRhdXRvLkhlcm9lc1wiIH0pO1xuXHRyZXR1cm4gb0xpc3RCaW5kaW5nLnJlcXVlc3RDb250ZXh0cygwLCAyKS50aGVuKGZ1bmN0aW9uIChvQ29udGV4dHM6IGFueSkge1xuXHRcdGlmIChvQ29udGV4dHMgJiYgb0NvbnRleHRzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIG9Db250ZXh0c1swXS5nZXRQYXRoKCk7XG5cdFx0fVxuXHR9KTtcbn1cbmZ1bmN0aW9uIGdldEFjdGl2ZUNvbnRleHRJbnN0YW5jZXMob0NvbnRleHQ6IGFueSwgb0NvbnRyb2xsZXI6IGFueSwgb0VudGl0eVNldDogYW55KSB7XG5cdGNvbnN0IGFBY3RpdmVDb250ZXh0cHJvbWlzZXM6IGFueVtdID0gW107XG5cdGNvbnN0IGFQYWdlczogYW55W10gPSBbXTtcblx0bGV0IHNNZXRhUGF0aCA9IG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkuZ2V0TWV0YVBhdGgob0NvbnRleHQuZ2V0UGF0aCgpKTtcblx0aWYgKHNNZXRhUGF0aC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdHNNZXRhUGF0aCA9IHNNZXRhUGF0aC5zdWJzdHJpbmcoMSk7XG5cdH1cblx0Y29uc3QgYU1ldGFQYXRoQXJyYXkgPSBzTWV0YVBhdGguc3BsaXQoXCIvXCIpO1xuXHRjb25zdCBzQ3VycmVudEhhc2hOb1BhcmFtcyA9IEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkuZ2V0SGFzaCgpLnNwbGl0KFwiP1wiKVswXTtcblx0Y29uc3QgYUN1cnJlbnRIYXNoQXJyYXkgPSBzQ3VycmVudEhhc2hOb1BhcmFtcy5zcGxpdChcIi9cIik7XG5cblx0Ly8gb1BhZ2VNYXAgLSBjcmVhdGluZyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBtYXAgb2YgbWV0YXBhdGggbmFtZSBhbmQgaXQncyB0ZWNobmljYWwgZGV0YWlsc1xuXHQvLyB3aGljaCBpcyByZXF1aXJlZCB0byBjcmVhdGUgYSBmaWx0ZXIgdG8gZmV0Y2ggdGhlIHJlbGF2YW50L2NvcnJlY3QgYWN0aXZlIGNvbnRleHRcblx0Ly8gRXhhbXBsZToge1NhbGVzT3JkZXJNYW5hZ2U6e3RlY2huaWNhbElEOnRlY2huaWNhbElEVmFsdWV9LCBfSXRlbTp7dGVjaG5pY2FsSUQ6dGVjaG5pY2FsSURWYWx1ZX19IGV0Yy4sXG5cdGNvbnN0IG9QYWdlTWFwOiBhbnkgPSB7fTtcblx0Y29uc3QgYVBhZ2VIYXNoQXJyYXk6IGFueVtdID0gW107XG5cdGFDdXJyZW50SGFzaEFycmF5LmZvckVhY2goZnVuY3Rpb24gKHNQYWdlSGFzaDogYW55KSB7XG5cdFx0Y29uc3QgYUtleVZhbHVlcyA9IHNQYWdlSGFzaC5zdWJzdHJpbmcoc1BhZ2VIYXNoLmluZGV4T2YoXCIoXCIpICsgMSwgc1BhZ2VIYXNoLmxlbmd0aCAtIDEpLnNwbGl0KFwiLFwiKTtcblx0XHRjb25zdCBtS2V5VmFsdWVzOiBhbnkgPSB7fTtcblx0XHRjb25zdCBzUGFnZUhhc2hOYW1lID0gc1BhZ2VIYXNoLnNwbGl0KFwiKFwiKVswXTtcblx0XHRvUGFnZU1hcFtzUGFnZUhhc2hOYW1lXSA9IHt9O1xuXHRcdGFQYWdlSGFzaEFycmF5LnB1c2goc1BhZ2VIYXNoTmFtZSk7XG5cdFx0b1BhZ2VNYXBbc1BhZ2VIYXNoTmFtZV1bXCJiSXNBY3RpdmVFbnRpdHlEZWZpbmVkXCJdID0gdHJ1ZTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFLZXlWYWx1ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHNLZXlBc3NpZ25tZW50ID0gYUtleVZhbHVlc1tpXTtcblx0XHRcdGNvbnN0IGFQYXJ0cyA9IHNLZXlBc3NpZ25tZW50LnNwbGl0KFwiPVwiKTtcblx0XHRcdGxldCBzS2V5VmFsdWUgPSBhUGFydHNbMV07XG5cdFx0XHRsZXQgc0tleSA9IGFQYXJ0c1swXTtcblx0XHRcdC8vIEluIGNhc2UgaWYgb25seSBvbmUgdGVjaG5pY2FsIGtleSBpcyBkZWZpbmVkIHRoZW4gdGhlIHVybCBqdXN0IGNvbnRhaW5zIHRoZSB0ZWNobmljYWxJRFZhbHVlIGJ1dCBub3QgdGhlIHRlY2huaWNhbElEXG5cdFx0XHQvLyBFeGFtcGxlOiBTYWxlc09yZGVyTWFuYWdlKElEPTExMTExMTI5LWFhYWEtYmJiYi1jY2NjLWRkZGRlZWVlZmZmZixJc0FjdGl2ZUVudGl0eT1mYWxzZSkvX0l0ZW0oMTExMTExMjktYWFhYS1iYmJiLWNjY2MtZGRkZGVlZWVmZmZmKVxuXHRcdFx0Ly8gSW4gYWJvdmUgZXhhbXBsZSBTYWxlc09yZGVySXRlbSBoYXMgb25seSBvbmUgdGVjaG5pY2FsIGtleSBkZWZpbmVkLCBoZW5jZSB0ZWNobmljYWxJRCBpbmZvIGlzIG5vdCBwcmVzZW50IGluIHRoZSB1cmxcblx0XHRcdC8vIEhlbmNlIGluIHN1Y2ggY2FzZXMgd2UgZ2V0IHRlY2huaWNhbCBrZXkgYW5kIHVzZSB0aGVtIHRvIGZldGNoIGFjdGl2ZSBjb250ZXh0XG5cdFx0XHRpZiAoc0tleUFzc2lnbm1lbnQuaW5kZXhPZihcIj1cIikgPT09IC0xKSB7XG5cdFx0XHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpO1xuXHRcdFx0XHRjb25zdCBhVGVjaG5pY2FsS2V5cyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHthUGFnZUhhc2hBcnJheS5qb2luKFwiL1wiKX0vJFR5cGUvJEtleWApO1xuXHRcdFx0XHRzS2V5VmFsdWUgPSBhUGFydHNbMF07XG5cdFx0XHRcdHNLZXkgPSBhVGVjaG5pY2FsS2V5c1swXTtcblx0XHRcdFx0b1BhZ2VNYXBbc1BhZ2VIYXNoLnNwbGl0KFwiKFwiKVswXV1bXCJiSXNBY3RpdmVFbnRpdHlEZWZpbmVkXCJdID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzS2V5ICE9PSBcIklzQWN0aXZlRW50aXR5XCIpIHtcblx0XHRcdFx0aWYgKHNLZXlWYWx1ZS5pbmRleE9mKFwiJ1wiKSA9PT0gMCAmJiBzS2V5VmFsdWUubGFzdEluZGV4T2YoXCInXCIpID09PSBzS2V5VmFsdWUubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSB0aGUgcXVvdGVzIGZyb20gdGhlIHZhbHVlIGFuZCBkZWNvZGUgc3BlY2lhbCBjaGFyc1xuXHRcdFx0XHRcdHNLZXlWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChzS2V5VmFsdWUuc3Vic3RyaW5nKDEsIHNLZXlWYWx1ZS5sZW5ndGggLSAxKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bUtleVZhbHVlc1tzS2V5XSA9IHNLZXlWYWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0b1BhZ2VNYXBbc1BhZ2VIYXNoTmFtZV0ubUtleVZhbHVlcyA9IG1LZXlWYWx1ZXM7XG5cdH0pO1xuXG5cdGxldCBvUGFnZUVudGl0eVNldCA9IG9FbnRpdHlTZXQ7XG5cdGFNZXRhUGF0aEFycmF5LmZvckVhY2goZnVuY3Rpb24gKHNOYXZpZ2F0aW9uUGF0aDogYW55KSB7XG5cdFx0Y29uc3Qgb1BhZ2VJbmZvOiBhbnkgPSB7fTtcblx0XHRjb25zdCBzUGFnZUVudGl0eVNldE5hbWUgPSBvUGFnZUVudGl0eVNldC4kTmF2aWdhdGlvblByb3BlcnR5QmluZGluZyAmJiBvUGFnZUVudGl0eVNldC4kTmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tzTmF2aWdhdGlvblBhdGhdO1xuXHRcdGlmIChzUGFnZUVudGl0eVNldE5hbWUpIHtcblx0XHRcdG9QYWdlSW5mby5wYWdlRW50aXR5TmFtZSA9IG9QYWdlRW50aXR5U2V0LiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW3NOYXZpZ2F0aW9uUGF0aF07XG5cdFx0XHRvUGFnZUVudGl0eVNldCA9IG9Db250ZXh0LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkuZ2V0T2JqZWN0KGAvJHtzUGFnZUVudGl0eVNldE5hbWV9YCkgfHwgb0VudGl0eVNldDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b1BhZ2VJbmZvLnBhZ2VFbnRpdHlOYW1lID0gc05hdmlnYXRpb25QYXRoO1xuXHRcdH1cblx0XHRvUGFnZUluZm8ubUtleVZhbHVlcyA9IG9QYWdlTWFwW3NOYXZpZ2F0aW9uUGF0aF0ubUtleVZhbHVlcztcblx0XHRvUGFnZUluZm8uYklzQWN0aXZlRW50aXR5RGVmaW5lZCA9IG9QYWdlTWFwW3NOYXZpZ2F0aW9uUGF0aF0uYklzQWN0aXZlRW50aXR5RGVmaW5lZDtcblx0XHRhUGFnZXMucHVzaChvUGFnZUluZm8pO1xuXHR9KTtcblxuXHRhUGFnZXMuZm9yRWFjaChmdW5jdGlvbiAob1BhZ2VJbmZvOiBhbnkpIHtcblx0XHRjb25zdCBvRmlsdGVyID0gY3JlYXRlRmlsdGVyVG9GZXRjaEFjdGl2ZUNvbnRleHQob1BhZ2VJbmZvLm1LZXlWYWx1ZXMsIG9QYWdlSW5mby5iSXNBY3RpdmVFbnRpdHlEZWZpbmVkKTtcblx0XHRhQWN0aXZlQ29udGV4dHByb21pc2VzLnB1c2goZ2V0QWN0aXZlQ29udGV4dFBhdGgob0NvbnRyb2xsZXIsIG9QYWdlSW5mby5wYWdlRW50aXR5TmFtZSwgb0ZpbHRlcikpO1xuXHR9KTtcblxuXHRyZXR1cm4gYUFjdGl2ZUNvbnRleHRwcm9taXNlcztcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gZmV0Y2ggYWN0aXZlIGNvbnRleHQgcGF0aCdzLlxuICpcbiAqIEBwYXJhbSBvQ29udGV4dCBUaGUgUGFnZSBDb250ZXh0XG4gKiBAcGFyYW0gb0NvbnRyb2xsZXJcbiAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgb25jZSB0aGUgYWN0aXZlIGNvbnRleHQncyBhcmUgZmV0Y2hlZFxuICovXG5mdW5jdGlvbiBnZXRBY3RpdmVDb250ZXh0UGF0aHMob0NvbnRleHQ6IGFueSwgb0NvbnRyb2xsZXI6IGFueSkge1xuXHRjb25zdCBzQ3VycmVudEhhc2hOb1BhcmFtcyA9IEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkuZ2V0SGFzaCgpLnNwbGl0KFwiP1wiKVswXTtcblx0bGV0IHNSb290RW50aXR5TmFtZSA9IHNDdXJyZW50SGFzaE5vUGFyYW1zICYmIHNDdXJyZW50SGFzaE5vUGFyYW1zLnN1YnN0cigwLCBzQ3VycmVudEhhc2hOb1BhcmFtcy5pbmRleE9mKFwiKFwiKSk7XG5cdGlmIChzUm9vdEVudGl0eU5hbWUuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRzUm9vdEVudGl0eU5hbWUgPSBzUm9vdEVudGl0eU5hbWUuc3Vic3RyaW5nKDEpO1xuXHR9XG5cdGNvbnN0IG9FbnRpdHlTZXQgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLmdldE9iamVjdChgLyR7c1Jvb3RFbnRpdHlOYW1lfWApO1xuXHRjb25zdCBvUGFnZUNvbnRleHQgPSBvQ29udGV4dDtcblx0Y29uc3QgYUFjdGl2ZUNvbnRleHRwcm9taXNlcyA9IGdldEFjdGl2ZUNvbnRleHRJbnN0YW5jZXMob0NvbnRleHQsIG9Db250cm9sbGVyLCBvRW50aXR5U2V0KTtcblx0aWYgKGFBY3RpdmVDb250ZXh0cHJvbWlzZXMubGVuZ3RoID4gMCkge1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChhQWN0aXZlQ29udGV4dHByb21pc2VzKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFEYXRhOiBhbnlbXSkge1xuXHRcdFx0XHRjb25zdCBhQWN0aXZlQ29udGV4dFBhdGhzID0gW107XG5cdFx0XHRcdGxldCBvUGFnZUVudGl0eVNldCA9IG9FbnRpdHlTZXQ7XG5cdFx0XHRcdGlmIChhRGF0YVswXS5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0XHRcdGFBY3RpdmVDb250ZXh0UGF0aHMucHVzaChhRGF0YVswXS5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFBY3RpdmVDb250ZXh0UGF0aHMucHVzaChhRGF0YVswXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gSW4gdGhlIGFjdGl2ZSBjb250ZXh0IHBhdGhzIGlkZW50aWZ5IGFuZCByZXBsYWNlIHRoZSBlbnRpdHlTZXQgTmFtZSB3aXRoIGNvcnJlc3BvbmRpbmcgbmF2aWdhdGlvbiBwcm9wZXJ0eSBuYW1lXG5cdFx0XHRcdC8vIFJlcXVpcmVkIHRvIGZvcm0gdGhlIHVybCBwb2ludGluZyB0byBhY3RpdmUgY29udGV4dFxuXHRcdFx0XHQvLyBFeGFtcGxlIDogU2FsZXNPcmRlckl0ZW0gLS0+IF9JdGVtLCBNYXRlcmlhbERldGFpbHMgLS0+IF9NYXRlcmlhbERldGFpbHMgZXRjLixcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBhRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxldCBzQWN0aXZlQ29udGV4dFBhdGggPSBhRGF0YVtpXTtcblx0XHRcdFx0XHRsZXQgc05hdmlnYXRpb1Byb3BlcnR5ID0gXCJcIjtcblx0XHRcdFx0XHRsZXQgc0VudGl0eVNldE5hbWUgPSBzQWN0aXZlQ29udGV4dFBhdGggJiYgc0FjdGl2ZUNvbnRleHRQYXRoLnN1YnN0cigwLCBzQWN0aXZlQ29udGV4dFBhdGguaW5kZXhPZihcIihcIikpO1xuXHRcdFx0XHRcdGlmIChzRW50aXR5U2V0TmFtZS5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0c0VudGl0eVNldE5hbWUgPSBzRW50aXR5U2V0TmFtZS5zdWJzdHJpbmcoMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzQWN0aXZlQ29udGV4dFBhdGguaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdFx0XHRcdHNBY3RpdmVDb250ZXh0UGF0aCA9IHNBY3RpdmVDb250ZXh0UGF0aC5zdWJzdHJpbmcoMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNOYXZpZ2F0aW9Qcm9wZXJ0eSA9IE9iamVjdC5rZXlzKG9QYWdlRW50aXR5U2V0LiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nKVtcblx0XHRcdFx0XHRcdE9iamVjdC52YWx1ZXMob1BhZ2VFbnRpdHlTZXQuJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcpLmluZGV4T2Yoc0VudGl0eVNldE5hbWUpXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0XHRpZiAoc05hdmlnYXRpb1Byb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRhQWN0aXZlQ29udGV4dFBhdGhzLnB1c2goc0FjdGl2ZUNvbnRleHRQYXRoLnJlcGxhY2Uoc0VudGl0eVNldE5hbWUsIHNOYXZpZ2F0aW9Qcm9wZXJ0eSkpO1xuXHRcdFx0XHRcdFx0b1BhZ2VFbnRpdHlTZXQgPSBvUGFnZUNvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKS5nZXRPYmplY3QoYC8ke3NFbnRpdHlTZXROYW1lfWApIHx8IG9FbnRpdHlTZXQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFBY3RpdmVDb250ZXh0UGF0aHMucHVzaChzQWN0aXZlQ29udGV4dFBhdGgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYUFjdGl2ZUNvbnRleHRQYXRocztcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5pbmZvKFwiRmFpbGVkIHRvIHJldHJpZXZlIG9uZSBvciBtb3JlIGFjdGl2ZSBjb250ZXh0IHBhdGgnc1wiLCBvRXJyb3IpO1xuXHRcdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG59XG5mdW5jdGlvbiBmZXRjaEFjdGl2ZUNvbnRleHRQYXRocyhvQ29udGV4dDogYW55LCBvQ29udHJvbGxlcjogYW55KSB7XG5cdGxldCBvUHJvbWlzZSwgYVNlbWFudGljS2V5cztcblx0Y29uc3Qgc0N1cnJlbnRIYXNoTm9QYXJhbXMgPSBIYXNoQ2hhbmdlci5nZXRJbnN0YW5jZSgpLmdldEhhc2goKS5zcGxpdChcIj9cIilbMF07XG5cdGlmIChvQ29udGV4dCkge1xuXHRcdGNvbnN0IG9Nb2RlbCA9IG9Db250ZXh0LmdldE1vZGVsKCk7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9Nb2RlbC5nZXRNZXRhTW9kZWwoKTtcblx0XHRiR2xvYmFsSXNTdGlja3lTdXBwb3J0ZWQgPSBNb2RlbEhlbHBlci5pc1N0aWNreVNlc3Npb25TdXBwb3J0ZWQob01ldGFNb2RlbCk7XG5cdFx0bGV0IHNSb290RW50aXR5TmFtZSA9IHNDdXJyZW50SGFzaE5vUGFyYW1zICYmIHNDdXJyZW50SGFzaE5vUGFyYW1zLnN1YnN0cigwLCBzQ3VycmVudEhhc2hOb1BhcmFtcy5pbmRleE9mKFwiKFwiKSk7XG5cdFx0aWYgKHNSb290RW50aXR5TmFtZS5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0c1Jvb3RFbnRpdHlOYW1lID0gc1Jvb3RFbnRpdHlOYW1lLnN1YnN0cmluZygxKTtcblx0XHR9XG5cdFx0YVNlbWFudGljS2V5cyA9IFNlbWFudGljS2V5SGVscGVyLmdldFNlbWFudGljS2V5cyhvTWV0YU1vZGVsLCBzUm9vdEVudGl0eU5hbWUpO1xuXHR9XG5cdC8vIEZldGNoIGFjdGl2ZSBjb250ZXh0IGRldGFpbHMgaW5jYXNlIG9mIGJlbG93IHNjZW5hcmlvJ3Mod2hlcmUgcGFnZSBpcyBub3Qgc3RpY2t5IHN1cHBvcnRlZCh3ZSBkbyBub3QgaGF2ZSBkcmFmdCBpbnN0YW5jZSkpXG5cdC8vIDEuIEluIGNhc2Ugb2YgZHJhZnQgZW5hYmxlZCBPYmplY3QgcGFnZSB3aGVyZSBzZW1hbnRpYyBrZXkgYmFzZWQgVVJMIGlzIG5vdCBwb3NzaWJsZShsaWtlIHNlbWFudGljIGtleXMgYXJlIG5vdCBtb2RlbGVkIGluIHRoZSBlbnRpdHkgc2V0KVxuXHQvLyAyLiBJbiBjYXNlIG9mIGRyYWZ0IGVuYWJsZWQgU3ViIE9iamVjdCBQYWdlcyAod2hlcmUgc2VtYW50aWMgYm9va21hcmtpbmcgaXMgbm90IHN1cHBvcnRlZClcblx0Y29uc3Qgb1ZpZXdEYXRhID0gb0NvbnRyb2xsZXIuZ2V0VmlldygpLmdldFZpZXdEYXRhKCk7XG5cdGlmIChvQ29udGV4dCAmJiAhYkdsb2JhbElzU3RpY2t5U3VwcG9ydGVkICYmICgob1ZpZXdEYXRhLnZpZXdMZXZlbCA9PT0gMSAmJiAhYVNlbWFudGljS2V5cykgfHwgb1ZpZXdEYXRhLnZpZXdMZXZlbCA+PSAyKSkge1xuXHRcdG9Qcm9taXNlID0gZ2V0QWN0aXZlQ29udGV4dFBhdGhzKG9Db250ZXh0LCBvQ29udHJvbGxlcik7XG5cdFx0cmV0dXJuIG9Qcm9taXNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxufVxuXG4vLyAvKipcbi8vICAqIEdldCBzaGFyZSBVUkwuXG4vLyAgKiBAcGFyYW0gYklzRWRpdGFibGVcbi8vICAqIEBwYXJhbSBiSXNTdGlja3lTdXBwb3J0ZWRcbi8vICAqIEBwYXJhbSBhQWN0aXZlQ29udGV4dFBhdGhzXG4vLyAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgc2hhcmUgVVJMXG4vLyAgKiBAcHJvdGVjdGVkXG4vLyAgKiBAc3RhdGljXG4vLyAgKi9cbmZ1bmN0aW9uIGdldFNoYXJlVXJsKGJJc0VkaXRhYmxlOiBhbnksIGJJc1N0aWNreVN1cHBvcnRlZDogYW55LCBhQWN0aXZlQ29udGV4dFBhdGhzOiBhbnkpIHtcblx0bGV0IHNTaGFyZVVybDtcblx0Y29uc3Qgc0hhc2ggPSBIYXNoQ2hhbmdlci5nZXRJbnN0YW5jZSgpLmdldEhhc2goKTtcblx0Y29uc3Qgc0Jhc2VQYXRoID0gKEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkgYXMgYW55KS5ocmVmRm9yQXBwU3BlY2lmaWNIYXNoXG5cdFx0PyAoSGFzaENoYW5nZXIuZ2V0SW5zdGFuY2UoKSBhcyBhbnkpLmhyZWZGb3JBcHBTcGVjaWZpY0hhc2goXCJcIilcblx0XHQ6IFwiXCI7XG5cdGlmIChiSXNFZGl0YWJsZSAmJiAhYklzU3RpY2t5U3VwcG9ydGVkICYmIGFBY3RpdmVDb250ZXh0UGF0aHMpIHtcblx0XHRzU2hhcmVVcmwgPSBzQmFzZVBhdGggKyBhQWN0aXZlQ29udGV4dFBhdGhzLmpvaW4oXCIvXCIpO1xuXHR9IGVsc2Uge1xuXHRcdHNTaGFyZVVybCA9IHNIYXNoID8gc0Jhc2VQYXRoICsgc0hhc2ggOiB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0fVxuXHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHNTaGFyZVVybDtcbn1cbmZ1bmN0aW9uIGdldFNoYXJlRW1haWxVcmwoKSB7XG5cdGNvbnN0IG9VU2hlbGxDb250YWluZXIgPSBzYXAudXNoZWxsICYmIHNhcC51c2hlbGwuQ29udGFpbmVyO1xuXHRpZiAob1VTaGVsbENvbnRhaW5lcikge1xuXHRcdHJldHVybiBvVVNoZWxsQ29udGFpbmVyXG5cdFx0XHQuZ2V0RkxQVXJsQXN5bmModHJ1ZSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChzRkxQVXJsOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIHNGTFBVcmw7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChzRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJDb3VsZCBub3QgcmV0cmlldmUgY0ZMUCBVUkwgZm9yIHRoZSBzaGFyaW5nIGRpYWxvZyAoZGlhbG9nIHdpbGwgbm90IGJlIG9wZW5lZClcIiwgc0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoZG9jdW1lbnQuVVJMKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRKYW1VcmwoYklzRWRpdE1vZGU6IGJvb2xlYW4sIGJJc1N0aWNreVN1cHBvcnRlZDogYW55LCBhQWN0aXZlQ29udGV4dFBhdGhzOiBhbnkpIHtcblx0bGV0IHNKYW1Vcmw6IHN0cmluZztcblx0Y29uc3Qgc0hhc2ggPSBIYXNoQ2hhbmdlci5nZXRJbnN0YW5jZSgpLmdldEhhc2goKTtcblx0Y29uc3Qgc0Jhc2VQYXRoID0gKEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkgYXMgYW55KS5ocmVmRm9yQXBwU3BlY2lmaWNIYXNoXG5cdFx0PyAoSGFzaENoYW5nZXIuZ2V0SW5zdGFuY2UoKSBhcyBhbnkpLmhyZWZGb3JBcHBTcGVjaWZpY0hhc2goXCJcIilcblx0XHQ6IFwiXCI7XG5cdGlmIChiSXNFZGl0TW9kZSAmJiAhYklzU3RpY2t5U3VwcG9ydGVkICYmIGFBY3RpdmVDb250ZXh0UGF0aHMpIHtcblx0XHRzSmFtVXJsID0gc0Jhc2VQYXRoICsgYUFjdGl2ZUNvbnRleHRQYXRocy5qb2luKFwiL1wiKTtcblx0fSBlbHNlIHtcblx0XHRzSmFtVXJsID0gc0hhc2ggPyBzQmFzZVBhdGggKyBzSGFzaCA6IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHR9XG5cdC8vIGluIGNhc2Ugd2UgYXJlIGluIGNGTFAgc2NlbmFyaW8sIHRoZSBhcHBsaWNhdGlvbiBpcyBydW5uaW5nXG5cdC8vIGluc2lkZSBhbiBpZnJhbWUsIGFuZCB0aGVyZSBmb3Igd2UgbmVlZCB0byBnZXQgdGhlIGNGTFAgVVJMXG5cdC8vIGFuZCBub3QgJ2RvY3VtZW50LlVSTCcgdGhhdCByZXByZXNlbnRzIHRoZSBpZnJhbWUgVVJMXG5cdGlmIChzYXAudXNoZWxsICYmIHNhcC51c2hlbGwuQ29udGFpbmVyICYmIHNhcC51c2hlbGwuQ29udGFpbmVyLnJ1bm5pbmdJbklmcmFtZSAmJiBzYXAudXNoZWxsLkNvbnRhaW5lci5ydW5uaW5nSW5JZnJhbWUoKSkge1xuXHRcdHNhcC51c2hlbGwuQ29udGFpbmVyLmdldEZMUFVybCh0cnVlKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHNVcmw6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gc1VybC5zdWJzdHIoMCwgc1VybC5pbmRleE9mKFwiI1wiKSkgKyBzSmFtVXJsO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAoc0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKFwiQ291bGQgbm90IHJldHJpZXZlIGNGTFAgVVJMIGZvciB0aGUgc2hhcmluZyBkaWFsb2cgKGRpYWxvZyB3aWxsIG5vdCBiZSBvcGVuZWQpXCIsIHNFcnJvcik7XG5cdFx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBzSmFtVXJsKTtcblx0fVxufVxuXG5jb25zdCBTaGFyZUV4dGVuc2lvbk92ZXJyaWRlID0ge1xuXHRhZGFwdFNoYXJlTWV0YWRhdGE6IGFzeW5jIGZ1bmN0aW9uICh0aGlzOiBTaGFyZSwgb1NoYXJlTWV0YWRhdGE6IGFueSkge1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gdGhpcy5iYXNlLmdldFZpZXcoKS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdGNvbnN0IG9VSU1vZGVsID0gdGhpcy5iYXNlLmdldFZpZXcoKS5nZXRNb2RlbChcInVpXCIpO1xuXHRcdGNvbnN0IGJJc0VkaXRhYmxlID0gb1VJTW9kZWwuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBhQWN0aXZlQ29udGV4dFBhdGhzID0gYXdhaXQgZmV0Y2hBY3RpdmVDb250ZXh0UGF0aHMob0NvbnRleHQsIHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpKTtcblx0XHRcdGNvbnN0IG9QYWdlVGl0bGVJbmZvID0gKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIE9iamVjdFBhZ2VDb250cm9sbGVyKS5fZ2V0UGFnZVRpdGxlSW5mb3JtYXRpb24oKTtcblx0XHRcdGNvbnN0IG9EYXRhID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRnZXRKYW1VcmwoYklzRWRpdGFibGUsIGJHbG9iYWxJc1N0aWNreVN1cHBvcnRlZCwgYUFjdGl2ZUNvbnRleHRQYXRocyksXG5cdFx0XHRcdGdldFNoYXJlVXJsKGJJc0VkaXRhYmxlLCBiR2xvYmFsSXNTdGlja3lTdXBwb3J0ZWQsIGFBY3RpdmVDb250ZXh0UGF0aHMpLFxuXHRcdFx0XHRnZXRTaGFyZUVtYWlsVXJsKClcblx0XHRcdF0pO1xuXG5cdFx0XHRsZXQgc1RpdGxlID0gb1BhZ2VUaXRsZUluZm8udGl0bGU7XG5cdFx0XHRjb25zdCBzT2JqZWN0U3VidGl0bGUgPSBvUGFnZVRpdGxlSW5mby5zdWJ0aXRsZSA/IG9QYWdlVGl0bGVJbmZvLnN1YnRpdGxlLnRvU3RyaW5nKCkgOiBcIlwiO1xuXHRcdFx0aWYgKHNPYmplY3RTdWJ0aXRsZSkge1xuXHRcdFx0XHRzVGl0bGUgPSBgJHtzVGl0bGV9IC0gJHtzT2JqZWN0U3VidGl0bGV9YDtcblx0XHRcdH1cblx0XHRcdG9TaGFyZU1ldGFkYXRhLnRpbGUgPSB7XG5cdFx0XHRcdHRpdGxlOiBvUGFnZVRpdGxlSW5mby50aXRsZSxcblx0XHRcdFx0c3VidGl0bGU6IHNPYmplY3RTdWJ0aXRsZVxuXHRcdFx0fTtcblx0XHRcdG9TaGFyZU1ldGFkYXRhLmVtYWlsLnRpdGxlID0gc1RpdGxlO1xuXHRcdFx0b1NoYXJlTWV0YWRhdGEudGl0bGUgPSBzVGl0bGU7XG5cdFx0XHRvU2hhcmVNZXRhZGF0YS5qYW0udXJsID0gb0RhdGFbMF07XG5cdFx0XHRvU2hhcmVNZXRhZGF0YS51cmwgPSBvRGF0YVsxXTtcblx0XHRcdG9TaGFyZU1ldGFkYXRhLmVtYWlsLnVybCA9IG9EYXRhWzJdO1xuXHRcdFx0Ly8gTVMgVGVhbXMgY29sbGFib3JhdGlvbiBkb2VzIG5vdCB3YW50IHRvIGFsbG93IGZ1cnRoZXIgY2hhbmdlcyB0byB0aGUgVVJMXG5cdFx0XHQvLyBzbyB1cGRhdGUgY29sbG9ib3JhdGlvbkluZm8gbW9kZWwgYXQgTFIgb3ZlcnJpZGUgdG8gaWdub3JlIGZ1cnRoZXIgZXh0ZW5zaW9uIGNoYW5nZXMgYXQgbXVsdGlwbGUgbGV2ZWxzXG5cdFx0XHRjb25zdCBjb2xsYWJvcmF0aW9uSW5mb01vZGVsOiBKU09OTW9kZWwgPSB0aGlzLmJhc2UuZ2V0VmlldygpLmdldE1vZGVsKFwiY29sbGFib3JhdGlvbkluZm9cIikgYXMgSlNPTk1vZGVsO1xuXHRcdFx0Y29sbGFib3JhdGlvbkluZm9Nb2RlbC5zZXRQcm9wZXJ0eShcIi91cmxcIiwgb1NoYXJlTWV0YWRhdGEudXJsKTtcblx0XHRcdGNvbGxhYm9yYXRpb25JbmZvTW9kZWwuc2V0UHJvcGVydHkoXCIvYXBwVGl0bGVcIiwgb1NoYXJlTWV0YWRhdGEudGl0bGUpO1xuXHRcdFx0Y29sbGFib3JhdGlvbkluZm9Nb2RlbC5zZXRQcm9wZXJ0eShcIi9zdWJUaXRsZVwiLCBzT2JqZWN0U3VidGl0bGUpO1xuXHRcdH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcblx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9TaGFyZU1ldGFkYXRhO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZUV4dGVuc2lvbk92ZXJyaWRlO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBa2pCTyxnQkFBZ0JBLElBQWhCLEVBQXNCQyxPQUF0QixFQUErQjtJQUNyQyxJQUFJO01BQ0gsSUFBSUMsTUFBTSxHQUFHRixJQUFJLEVBQWpCO0lBQ0EsQ0FGRCxDQUVFLE9BQU1HLENBQU4sRUFBUztNQUNWLE9BQU9GLE9BQU8sQ0FBQ0UsQ0FBRCxDQUFkO0lBQ0E7O0lBQ0QsSUFBSUQsTUFBTSxJQUFJQSxNQUFNLENBQUNFLElBQXJCLEVBQTJCO01BQzFCLE9BQU9GLE1BQU0sQ0FBQ0UsSUFBUCxDQUFZLEtBQUssQ0FBakIsRUFBb0JILE9BQXBCLENBQVA7SUFDQTs7SUFDRCxPQUFPQyxNQUFQO0VBQ0E7O0VBbGpCRCxJQUFJRyx3QkFBSjs7RUFFQSxTQUFTQyxnQ0FBVCxDQUEwQ0MsVUFBMUMsRUFBMkRDLHNCQUEzRCxFQUF3RjtJQUN2RixJQUFNQyxLQUFLLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSixVQUFaLENBQWQ7SUFFQSxJQUFNSyxRQUFRLEdBQUdILEtBQUssQ0FBQ0ksR0FBTixDQUFVLFVBQVVDLElBQVYsRUFBd0I7TUFDbEQsSUFBTUMsTUFBTSxHQUFHUixVQUFVLENBQUNPLElBQUQsQ0FBekI7O01BQ0EsSUFBSUMsTUFBTSxLQUFLQyxTQUFmLEVBQTBCO1FBQ3pCLE9BQU8sSUFB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