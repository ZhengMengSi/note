/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/array/uniqueSort", "sap/base/util/merge", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/SemanticDateOperators", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/type/TypeUtil", "sap/ui/core/Component", "sap/ui/core/Core", "sap/ui/core/Fragment", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/mdc/condition/FilterOperatorUtil", "sap/ui/mdc/condition/RangeOperator", "./controls/AnyElement", "./templating/FilterHelper"], function (Log, uniqueSort, mergeObjects, IssueManager, BindingToolkit, ModelHelper, SemanticDateOperators, StableIdHelper, TypeUtil, Component, Core, Fragment, XMLPreprocessor, XMLTemplateProcessor, FilterOperatorUtil, RangeOperator, AnyElement, FilterHelper) {
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

  function _forTo(array, body, check) {
    var i = -1,
        pact,
        reject;

    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);

          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }

    _cycle();

    return pact;
  }

  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }

  var _Pact = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      var result = new _Pact();
      var state = this.s;

      if (state) {
        var callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          var _value = _this.v;

          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(_value) : _value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(_value));
          } else {
            _settle(result, 2, _value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      var observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  var _exports = {};
  var getConditions = FilterHelper.getConditions;
  var generate = StableIdHelper.generate;
  var pathInModel = BindingToolkit.pathInModel;
  var or = BindingToolkit.or;
  var not = BindingToolkit.not;
  var compileExpression = BindingToolkit.compileExpression;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategoryType = IssueManager.IssueCategoryType;
  var IssueCategory = IssueManager.IssueCategory;

  var updateRelateAppsModel = function (oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath) {
    try {
      var oShellServiceHelper = getShellServices(oObjectPageLayout);
      var oParam = {};
      var sCurrentSemObj = "",
          sCurrentAction = "";
      var oSemanticObjectAnnotations;
      var aRelatedAppsMenuItems = [];
      var aExcludedActions = [];

      function fnGetParseShellHashAndGetLinks() {
        var oParsedUrl = oShellServiceHelper.parseShellHash(document.location.hash);
        sCurrentSemObj = oParsedUrl.semanticObject; // Current Semantic Object

        sCurrentAction = oParsedUrl.action;
        return _getSOIntents(oShellServiceHelper, oObjectPageLayout, sCurrentSemObj, oParam);
      }

      var aManifestSOKeys;

      var _temp5 = _catch(function () {
        function _temp3() {
          return Promise.resolve(fnGetParseShellHashAndGetLinks()).then(function (aLinks) {
            if (aLinks) {
              if (aLinks.length > 0) {
                var isSemanticObjectHasSameTargetInManifest = false;
                var oTargetParams = {};
                var aAnnotationsSOItems = [];
                var sEntitySetPath = "".concat(oMetaPath, "@");
                var sEntityTypePath = "".concat(oMetaPath, "/@");
                var oEntitySetAnnotations = oMetaModel.getObject(sEntitySetPath);
                oSemanticObjectAnnotations = CommonUtils.getSemanticObjectAnnotations(oEntitySetAnnotations, sCurrentSemObj);

                if (!oSemanticObjectAnnotations.bHasEntitySetSO) {
                  var oEntityTypeAnnotations = oMetaModel.getObject(sEntityTypePath);
                  oSemanticObjectAnnotations = CommonUtils.getSemanticObjectAnnotations(oEntityTypeAnnotations, sCurrentSemObj);
                }

                aExcludedActions = oSemanticObjectAnnotations.aUnavailableActions; //Skip same application from Related Apps

                aExcludedActions.push(sCurrentAction);
                oTargetParams.navigationContexts = oBindingContext;
                oTargetParams.semanticObjectMapping = oSemanticObjectAnnotations.aMappings;

                _getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aAnnotationsSOItems);

                aManifestSOItems.forEach(function (_ref) {
                  var targetSemObject = _ref.targetSemObject;

                  if (aAnnotationsSOItems[0].targetSemObject === targetSemObject) {
                    isSemanticObjectHasSameTargetInManifest = true;
                  }
                }); // remove all actions from current hash application if manifest contains empty allowedActions

                if (oManifestData.additionalSemanticObjects && oManifestData.additionalSemanticObjects[aAnnotationsSOItems[0].targetSemObject] && oManifestData.additionalSemanticObjects[aAnnotationsSOItems[0].targetSemObject].allowedActions && oManifestData.additionalSemanticObjects[aAnnotationsSOItems[0].targetSemObject].allowedActions.length === 0) {
                  isSemanticObjectHasSameTargetInManifest = true;
                }

                aRelatedAppsMenuItems = isSemanticObjectHasSameTargetInManifest ? aManifestSOItems : aManifestSOItems.concat(aAnnotationsSOItems); // If no app in list, related apps button will be hidden

                oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/visibility", aRelatedAppsMenuItems.length > 0);
                oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/items", aRelatedAppsMenuItems);
              } else {
                oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/visibility", false);
              }
            } else {
              oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/visibility", false);
            }
          });
        }

        if (oEntry) {
          if (aSemKeys && aSemKeys.length > 0) {
            for (var j = 0; j < aSemKeys.length; j++) {
              var sSemKey = aSemKeys[j].$PropertyPath;

              if (!oParam[sSemKey]) {
                oParam[sSemKey] = {
                  value: oEntry[sSemKey]
                };
              }
            }
          } else {
            // fallback to Technical Keys if no Semantic Key is present
            var aTechnicalKeys = oMetaModel.getObject("".concat(oMetaPath, "/$Type/$Key"));

            for (var _key2 in aTechnicalKeys) {
              var sObjKey = aTechnicalKeys[_key2];

              if (!oParam[sObjKey]) {
                oParam[sObjKey] = {
                  value: oEntry[sObjKey]
                };
              }
            }
          }
        } // Logic to read additional SO from manifest and updated relatedapps model


        var oManifestData = getTargetView(oObjectPageLayout).getViewData();
        var aManifestSOItems = [];
        var semanticObjectIntents;

        var _temp2 = function () {
          if (oManifestData.additionalSemanticObjects) {
            aManifestSOKeys = Object.keys(oManifestData.additionalSemanticObjects);

            var _temp6 = _forTo(aManifestSOKeys, function (key) {
              return Promise.resolve(Promise.resolve(_getSOIntents(oShellServiceHelper, oObjectPageLayout, aManifestSOKeys[key], oParam))).then(function (_Promise$resolve) {
                semanticObjectIntents = _Promise$resolve;

                _getRelatedIntents(oManifestData.additionalSemanticObjects[aManifestSOKeys[key]], oBindingContext, aManifestSOItems, semanticObjectIntents);
              });
            });

            if (_temp6 && _temp6.then) return _temp6.then(function () {});
          }
        }();

        return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
      }, function (error) {
        Log.error("Cannot read links", error);
      });

      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {
        return aRelatedAppsMenuItems;
      }) : aRelatedAppsMenuItems);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var aValidTypes = ["Edm.Boolean", "Edm.Byte", "Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.Decimal", "Edm.Double", "Edm.Float", "Edm.Guid", "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.SByte", "Edm.Single", "Edm.String", "Edm.Time", "Edm.TimeOfDay"];

  function normalizeSearchTerm(sSearchTerm) {
    if (!sSearchTerm) {
      return undefined;
    }

    return sSearchTerm.replace(/"/g, " ").replace(/\\/g, "\\\\") //escape backslash characters. Can be removed if odata/binding handles backend errors responds.
    .split(/\s+/).reduce(function (sNormalized, sCurrentWord) {
      if (sCurrentWord !== "") {
        sNormalized = "".concat(sNormalized ? "".concat(sNormalized, " ") : "", "\"").concat(sCurrentWord, "\"");
      }

      return sNormalized;
    }, undefined);
  }

  function getPropertyDataType(oNavigationContext) {
    var sDataType = oNavigationContext.getProperty("$Type"); // if $kind exists, it's not a DataField and we have the final type already

    if (!oNavigationContext.getProperty("$kind")) {
      switch (sDataType) {
        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          sDataType = undefined;
          break;

        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
          sDataType = oNavigationContext.getProperty("Value/$Path/$Type");
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        default:
          var sAnnotationPath = oNavigationContext.getProperty("Target/$AnnotationPath");

          if (sAnnotationPath) {
            if (sAnnotationPath.indexOf("com.sap.vocabularies.Communication.v1.Contact") > -1) {
              sDataType = oNavigationContext.getProperty("Target/$AnnotationPath/fn/$Path/$Type");
            } else if (sAnnotationPath.indexOf("com.sap.vocabularies.UI.v1.DataPoint") > -1) {
              sDataType = oNavigationContext.getProperty("Value/$Path/$Type");
            } else {
              // e.g. FieldGroup or Chart
              sDataType = undefined;
            }
          } else {
            sDataType = undefined;
          }

          break;
      }
    }

    return sDataType;
  }

  function fnHasTransientContexts(oListBinding) {
    var bHasTransientContexts = false;

    if (oListBinding) {
      oListBinding.getCurrentContexts().forEach(function (oContext) {
        if (oContext && oContext.isTransient()) {
          bHasTransientContexts = true;
        }
      });
    }

    return bHasTransientContexts;
  }

  function getSearchRestrictions(sFullPath, oMetaModel) {
    var oSearchRestrictions;
    var oNavigationSearchRestrictions;
    var navigationText = "$NavigationPropertyBinding";
    var searchRestrictionsTerm = "@Org.OData.Capabilities.V1.SearchRestrictions";
    var entityTypePathParts = sFullPath.replaceAll("%2F", "/").split("/").filter(ModelHelper.filterOutNavPropBinding);
    var entitySetPath = ModelHelper.getEntitySetPath(sFullPath, oMetaModel);
    var entitySetPathParts = entitySetPath.split("/").filter(ModelHelper.filterOutNavPropBinding);
    var isContainment = oMetaModel.getObject("/".concat(entityTypePathParts.join("/"), "/$ContainsTarget"));
    var containmentNavPath = isContainment && entityTypePathParts[entityTypePathParts.length - 1]; //LEAST PRIORITY - Search restrictions directly at Entity Set
    //e.g. FR in "NS.EntityContainer/SalesOrderManage" ContextPath: /SalesOrderManage

    if (!isContainment) {
      oSearchRestrictions = oMetaModel.getObject("".concat(entitySetPath).concat(searchRestrictionsTerm));
    }

    if (entityTypePathParts.length > 1) {
      var navPath = isContainment ? containmentNavPath : entitySetPathParts[entitySetPathParts.length - 1]; // In case of containment we take entitySet provided as parent. And in case of normal we would remove the last navigation from entitySetPath.

      var parentEntitySetPath = isContainment ? entitySetPath : "/".concat(entitySetPathParts.slice(0, -1).join("/".concat(navigationText, "/"))); //HIGHEST priority - Navigation restrictions
      //e.g. Parent "/Customer" with NavigationPropertyPath="Set" ContextPath: Customer/Set

      var oNavigationRestrictions = CommonUtils.getNavigationRestrictions(oMetaModel, parentEntitySetPath, navPath.replaceAll("%2F", "/"));
      oNavigationSearchRestrictions = oNavigationRestrictions && oNavigationRestrictions["SearchRestrictions"];
    }

    return oNavigationSearchRestrictions || oSearchRestrictions;
  }

  function getNavigationRestrictions(oModel, sEntitySetPath, sNavigationPath) {
    var oNavigationRestrictions = oModel.getObject("".concat(sEntitySetPath, "@Org.OData.Capabilities.V1.NavigationRestrictions"));
    var aRestrictedProperties = oNavigationRestrictions && oNavigationRestrictions.RestrictedProperties;
    return aRestrictedProperties && aRestrictedProperties.find(function (oRestrictedProperty) {
      return oRestrictedProperty && oRestrictedProperty.NavigationProperty && oRestrictedProperty.NavigationProperty.$NavigationPropertyPath === sNavigationPath;
    });
  }

  function _isInNonFilterableProperties(oModel, sEntitySetPath, sContextPath) {
    var bIsNotFilterable = false;
    var oAnnotation = oModel.getObject("".concat(sEntitySetPath, "@Org.OData.Capabilities.V1.FilterRestrictions"));

    if (oAnnotation && oAnnotation.NonFilterableProperties) {
      bIsNotFilterable = oAnnotation.NonFilterableProperties.some(function (property) {
        return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
      });
    }

    return bIsNotFilterable;
  } // TODO rework this!


  function _isContextPathFilterable(oModel, sEntitySetPath, sContexPath) {
    var sFullPath = "".concat(sEntitySetPath, "/").concat(sContexPath),
        aESParts = sFullPath.split("/").splice(0, 2),
        aContext = sFullPath.split("/").splice(2);
    var bIsNotFilterable = false,
        sContext = "";
    sEntitySetPath = aESParts.join("/");
    bIsNotFilterable = aContext.some(function (item, index, array) {
      if (sContext.length > 0) {
        sContext += "/".concat(item);
      } else {
        sContext = item;
      }

      if (index === array.length - 2) {
        // In case of "/Customer/Set/Property" this is to check navigation restrictions of "Customer" for non-filterable properties in "Set"
        var oNavigationRestrictions = getNavigationRestrictions(oModel, sEntitySetPath, item);
        var oFilterRestrictions = oNavigationRestrictions && oNavigationRestrictions.FilterRestrictions;
        var aNonFilterableProperties = oFilterRestrictions && oFilterRestrictions.NonFilterableProperties;
        var sTargetPropertyPath = array[array.length - 1];

        if (aNonFilterableProperties && aNonFilterableProperties.find(function (oPropertyPath) {
          return oPropertyPath.$PropertyPath === sTargetPropertyPath;
        })) {
          return true;
        }
      }

      if (index === array.length - 1) {
        //last path segment
        bIsNotFilterable = _isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
      } else if (oModel.getObject("".concat(sEntitySetPath, "/$NavigationPropertyBinding/").concat(item))) {
        //check existing context path and initialize it
        bIsNotFilterable = _isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
        sContext = ""; //set the new EntitySet

        sEntitySetPath = "/".concat(oModel.getObject("".concat(sEntitySetPath, "/$NavigationPropertyBinding/").concat(item)));
      }

      return bIsNotFilterable === true;
    });
    return bIsNotFilterable;
  } // TODO check used places and rework this


  function isPropertyFilterable(oModel, sEntitySetPath, sProperty, bSkipHiddenFilter) {
    if (typeof sProperty !== "string") {
      throw new Error("sProperty parameter must be a string");
    }

    var bIsFilterable; // Parameters should be rendered as filterfields

    if (oModel.getObject("".concat(sEntitySetPath, "/@com.sap.vocabularies.Common.v1.ResultContext")) === true) {
      return true;
    }

    var oNavigationContext = oModel.createBindingContext("".concat(sEntitySetPath, "/").concat(sProperty));

    if (!bSkipHiddenFilter) {
      if (oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.Hidden") === true || oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.HiddenFilter") === true) {
        return false;
      }

      var sHiddenPath = oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.Hidden/$Path");
      var sHiddenFilterPath = oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.HiddenFilter/$Path");

      if (sHiddenPath && sHiddenFilterPath) {
        return compileExpression(not(or(pathInModel(sHiddenPath), pathInModel(sHiddenFilterPath))));
      } else if (sHiddenPath) {
        return compileExpression(not(pathInModel(sHiddenPath)));
      } else if (sHiddenFilterPath) {
        return compileExpression(not(pathInModel(sHiddenFilterPath)));
      }
    }

    if (sEntitySetPath.split("/").length === 2 && sProperty.indexOf("/") < 0) {
      // there is no navigation in entitySet path and property path
      bIsFilterable = !_isInNonFilterableProperties(oModel, sEntitySetPath, sProperty);
    } else {
      bIsFilterable = !_isContextPathFilterable(oModel, sEntitySetPath, sProperty);
    } // check if type can be used for filtering


    if (bIsFilterable && oNavigationContext) {
      var sPropertyDataType = getPropertyDataType(oNavigationContext);

      if (sPropertyDataType) {
        bIsFilterable = aValidTypes.indexOf(sPropertyDataType) !== -1;
      } else {
        bIsFilterable = false;
      }
    }

    return bIsFilterable;
  }

  function getShellServices(oControl) {
    return getAppComponent(oControl).getShellServices();
  }

  function getHash() {
    var sHash = window.location.hash;
    return sHash.split("&")[0];
  }

  function _getSOIntents(oShellServiceHelper, oObjectPageLayout, oSemanticObject, oParam) {
    return oShellServiceHelper.getLinks({
      semanticObject: oSemanticObject,
      params: oParam
    });
  } // TO-DO add this as part of applySemanticObjectmappings logic in IntentBasednavigation controller extension


  function _createMappings(oMapping) {
    var aSOMappings = [];
    var aMappingKeys = Object.keys(oMapping);
    var oSemanticMapping;

    for (var i = 0; i < aMappingKeys.length; i++) {
      oSemanticMapping = {
        "LocalProperty": {
          "$PropertyPath": aMappingKeys[i]
        },
        "SemanticObjectProperty": oMapping[aMappingKeys[i]]
      };
      aSOMappings.push(oSemanticMapping);
    }

    return aSOMappings;
  }
  /**
   * @param aLinks
   * @param aExcludedActions
   * @param oTargetParams
   * @param aItems
   * @param aAllowedActions
   */


  function _getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aItems, aAllowedActions) {
    for (var i = 0; i < aLinks.length; i++) {
      var oLink = aLinks[i];
      var sIntent = oLink.intent;
      var sAction = sIntent.split("-")[1].split("?")[0];

      if (aAllowedActions && aAllowedActions.includes(sAction)) {
        aItems.push({
          text: oLink.text,
          targetSemObject: sIntent.split("#")[1].split("-")[0],
          targetAction: sAction.split("~")[0],
          targetParams: oTargetParams
        });
      } else if (!aAllowedActions && aExcludedActions && aExcludedActions.indexOf(sAction) === -1) {
        aItems.push({
          text: oLink.text,
          targetSemObject: sIntent.split("#")[1].split("-")[0],
          targetAction: sAction.split("~")[0],
          targetParams: oTargetParams
        });
      }
    }
  }
  /**
   * @param oAdditionalSemanticObjects
   * @param oBindingContext
   * @param aManifestSOItems
   * @param aLinks
   */


  function _getRelatedIntents(oAdditionalSemanticObjects, oBindingContext, aManifestSOItems, aLinks) {
    if (aLinks && aLinks.length > 0) {
      var aAllowedActions = oAdditionalSemanticObjects.allowedActions || undefined;
      var aExcludedActions = oAdditionalSemanticObjects.unavailableActions ? oAdditionalSemanticObjects.unavailableActions : [];
      var aSOMappings = oAdditionalSemanticObjects.mapping ? _createMappings(oAdditionalSemanticObjects.mapping) : [];
      var oTargetParams = {
        navigationContexts: oBindingContext,
        semanticObjectMapping: aSOMappings
      };

      _getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aManifestSOItems, aAllowedActions);
    }
  }

  function _getSemanticObjectAnnotations(oEntityAnnotations, sCurrentSemObj) {
    var oSemanticObjectAnnotations = {
      bHasEntitySetSO: false,
      aAllowedActions: [],
      aUnavailableActions: [],
      aMappings: []
    };
    var sAnnotationMappingTerm, sAnnotationActionTerm;
    var sQualifier;

    for (var key in oEntityAnnotations) {
      if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 && oEntityAnnotations[key] === sCurrentSemObj) {
        oSemanticObjectAnnotations.bHasEntitySetSO = true;
        sAnnotationMappingTerm = "@".concat("com.sap.vocabularies.Common.v1.SemanticObjectMapping");
        sAnnotationActionTerm = "@".concat("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions");

        if (key.indexOf("#") > -1) {
          sQualifier = key.split("#")[1];
          sAnnotationMappingTerm = "".concat(sAnnotationMappingTerm, "#").concat(sQualifier);
          sAnnotationActionTerm = "".concat(sAnnotationActionTerm, "#").concat(sQualifier);
        }

        oSemanticObjectAnnotations.aMappings = oSemanticObjectAnnotations.aMappings.concat(oEntityAnnotations[sAnnotationMappingTerm]);
        oSemanticObjectAnnotations.aUnavailableActions = oSemanticObjectAnnotations.aUnavailableActions.concat(oEntityAnnotations[sAnnotationActionTerm]);
        break;
      }
    }

    return oSemanticObjectAnnotations;
  }

  function fnUpdateRelatedAppsDetails(oObjectPageLayout) {
    var oMetaModel = oObjectPageLayout.getModel().getMetaModel();
    var oBindingContext = oObjectPageLayout.getBindingContext();
    var oPath = oBindingContext && oBindingContext.getPath();
    var oMetaPath = oMetaModel.getMetaPath(oPath); // Semantic Key Vocabulary

    var sSemanticKeyVocabulary = "".concat(oMetaPath, "/") + "@com.sap.vocabularies.Common.v1.SemanticKey"; //Semantic Keys

    var aSemKeys = oMetaModel.getObject(sSemanticKeyVocabulary); // Unavailable Actions

    var oEntry = oBindingContext.getObject();

    if (!oEntry) {
      oBindingContext.requestObject().then(function (requestedObject) {
        return updateRelateAppsModel(oBindingContext, requestedObject, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath);
      }).catch(function (oError) {
        Log.error("Cannot update the related app details", oError);
      });
    } else {
      return updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath);
    }
  }
  /**
   * @param oButton
   */


  function fnFireButtonPress(oButton) {
    var aAuthorizedTypes = ["sap.m.Button", "sap.m.OverflowToolbarButton"];

    if (oButton && aAuthorizedTypes.indexOf(oButton.getMetadata().getName()) !== -1 && oButton.getVisible() && oButton.getEnabled()) {
      oButton.firePress();
    }
  }

  function fnResolveStringtoBoolean(sValue) {
    if (sValue === "true" || sValue === true) {
      return true;
    } else {
      return false;
    }
  }

  function getAppComponent(oControl) {
    if (oControl.isA("sap.fe.core.AppComponent")) {
      return oControl;
    }

    var oOwner = Component.getOwnerComponentFor(oControl);

    if (!oOwner) {
      return oControl;
    } else {
      return getAppComponent(oOwner);
    }
  }

  function getCurrentPageView(oAppComponent) {
    var rootViewController = oAppComponent.getRootViewController();
    return rootViewController.isFclEnabled() ? rootViewController.getRightmostView() : CommonUtils.getTargetView(oAppComponent.getRootContainer().getCurrentPage());
  }

  function getTargetView(oControl) {
    if (oControl && oControl.isA("sap.ui.core.ComponentContainer")) {
      oControl = oControl.getComponentInstance();
      oControl = oControl && oControl.getRootControl();
    }

    while (oControl && !oControl.isA("sap.ui.core.mvc.View")) {
      oControl = oControl.getParent();
    }

    return oControl;
  }

  function isFieldControlPathInapplicable(sFieldControlPath, oAttribute) {
    var bInapplicable = false;
    var aParts = sFieldControlPath.split("/"); // sensitive data is removed only if the path has already been resolved.

    if (aParts.length > 1) {
      bInapplicable = oAttribute[aParts[0]] && oAttribute[aParts[0]].hasOwnProperty(aParts[1]) && oAttribute[aParts[0]][aParts[1]] === 0;
    } else {
      bInapplicable = oAttribute[sFieldControlPath] === 0;
    }

    return bInapplicable;
  }

  function removeSensitiveData(aAttributes, oMetaModel) {
    var aOutAttributes = [];

    for (var i = 0; i < aAttributes.length; i++) {
      var sEntitySet = aAttributes[i].entitySet,
          oAttribute = aAttributes[i].contextData;
      delete oAttribute["@odata.context"];
      delete oAttribute["%40odata.context"];
      delete oAttribute["@odata.metadataEtag"];
      delete oAttribute["%40odata.metadataEtag"];
      delete oAttribute["SAP__Messages"];
      var aProperties = Object.keys(oAttribute);

      for (var j = 0; j < aProperties.length; j++) {
        var sProp = aProperties[j],
            aPropertyAnnotations = oMetaModel.getObject("/".concat(sEntitySet, "/").concat(sProp, "@"));

        if (aPropertyAnnotations) {
          if (aPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] || aPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] || aPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"]) {
            delete oAttribute[sProp];
          } else if (aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"]) {
            var oFieldControl = aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];

            if (oFieldControl["$EnumMember"] && oFieldControl["$EnumMember"].split("/")[1] === "Inapplicable") {
              delete oAttribute[sProp];
            } else if (oFieldControl["$Path"] && CommonUtils.isFieldControlPathInapplicable(oFieldControl["$Path"], oAttribute)) {
              delete oAttribute[sProp];
            }
          }
        }
      }

      aOutAttributes.push(oAttribute);
    }

    return aOutAttributes;
  }

  function _fnCheckIsMatch(oObject, oKeysToCheck) {
    for (var sKey in oKeysToCheck) {
      if (oKeysToCheck[sKey] !== oObject[sKey]) {
        return false;
      }
    }

    return true;
  }

  function fnGetContextPathProperties(oMetaModel, sContextPath, oFilter) {
    var oEntityType = oMetaModel.getObject("".concat(sContextPath, "/")) || {},
        oProperties = {};

    for (var sKey in oEntityType) {
      if (oEntityType.hasOwnProperty(sKey) && !/^\$/i.test(sKey) && oEntityType[sKey].$kind && _fnCheckIsMatch(oEntityType[sKey], oFilter || {
        $kind: "Property"
      })) {
        oProperties[sKey] = oEntityType[sKey];
      }
    }

    return oProperties;
  }

  function fnGetMandatoryFilterFields(oMetaModel, sContextPath) {
    var aMandatoryFilterFields;

    if (oMetaModel && sContextPath) {
      aMandatoryFilterFields = oMetaModel.getObject("".concat(sContextPath, "@Org.OData.Capabilities.V1.FilterRestrictions/RequiredProperties"));
    }

    return aMandatoryFilterFields;
  }

  function fnGetIBNActions(oControl, aIBNActions) {
    var aActions = oControl && oControl.getActions();

    if (aActions) {
      aActions.forEach(function (oAction) {
        if (oAction.isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")) {
          oAction = oAction.getAction();
        }

        if (oAction.isA("sap.m.MenuButton")) {
          var oMenu = oAction.getMenu();
          var aItems = oMenu.getItems();
          aItems.forEach(function (oItem) {
            if (oItem.data("IBNData")) {
              aIBNActions.push(oItem);
            }
          });
        } else if (oAction.data("IBNData")) {
          aIBNActions.push(oAction);
        }
      });
    }

    return aIBNActions;
  }
  /**
   * @param aIBNActions
   * @param oView
   */


  function fnUpdateDataFieldForIBNButtonsVisibility(aIBNActions, oView) {
    var oParams = {};

    var fnGetLinks = function (oData) {
      if (oData) {
        var aKeys = Object.keys(oData);
        aKeys.forEach(function (sKey) {
          if (sKey.indexOf("_") !== 0 && sKey.indexOf("odata.context") === -1) {
            oParams[sKey] = {
              value: oData[sKey]
            };
          }
        });
      }

      if (aIBNActions.length) {
        aIBNActions.forEach(function (oIBNAction) {
          var sSemanticObject = oIBNAction.data("IBNData").semanticObject;
          var sAction = oIBNAction.data("IBNData").action;
          CommonUtils.getShellServices(oView).getLinks({
            semanticObject: sSemanticObject,
            action: sAction,
            params: oParams
          }).then(function (aLink) {
            oIBNAction.setVisible(oIBNAction.getVisible() && aLink && aLink.length === 1);
          }).catch(function (oError) {
            Log.error("Cannot retrieve the links from the shell service", oError);
          });
        });
      }
    };

    if (oView && oView.getBindingContext()) {
      var _oView$getBindingCont;

      (_oView$getBindingCont = oView.getBindingContext()) === null || _oView$getBindingCont === void 0 ? void 0 : _oView$getBindingCont.requestObject().then(function (oData) {
        return fnGetLinks(oData);
      }).catch(function (oError) {
        Log.error("Cannot retrieve the links from the shell service", oError);
      });
    } else {
      fnGetLinks();
    }
  }

  function getTranslatedText(sFrameworkKey, oResourceBundle, oParams, sEntitySetName) {
    var sResourceKey = sFrameworkKey;

    if (oResourceBundle) {
      if (sEntitySetName) {
        // There are console errors logged when making calls to getText for keys that are not defined in the resource bundle
        // for instance keys which are supposed to be provided by the application, e.g, <key>|<entitySet> to override instance specific text
        // hence check if text exists (using "hasText") in the resource bundle before calling "getText"
        // "hasText" only checks for the key in the immediate resource bundle and not it's custom bundles
        // hence we need to do this recurrsively to check if the key exists in any of the bundles the forms the FE resource bundle
        var bResourceKeyExists = checkIfResourceKeyExists(oResourceBundle.aCustomBundles, "".concat(sFrameworkKey, "|").concat(sEntitySetName)); // if resource key with entity set name for instance specific text overriding is provided by the application
        // then use the same key otherwise use the Framework key

        sResourceKey = bResourceKeyExists ? "".concat(sFrameworkKey, "|").concat(sEntitySetName) : sFrameworkKey;
      }

      return oResourceBundle.getText(sResourceKey, oParams);
    } // do not allow override so get text from the internal bundle directly


    oResourceBundle = Core.getLibraryResourceBundle("sap.fe.core");
    return oResourceBundle.getText(sResourceKey, oParams);
  }

  function checkIfResourceKeyExists(aCustomBundles, sKey) {
    if (aCustomBundles.length) {
      for (var i = aCustomBundles.length - 1; i >= 0; i--) {
        var sValue = aCustomBundles[i].hasText(sKey); // text found return true

        if (sValue) {
          return true;
        }

        checkIfResourceKeyExists(aCustomBundles[i].aCustomBundles, sKey);
      }
    }

    return false;
  }

  function getActionPath(oAction, bReturnOnlyPath, sActionName, bCheckStaticValue) {
    sActionName = !sActionName ? oAction.getObject(oAction.getPath()) : sActionName;
    var sContextPath = oAction.getPath().split("/@")[0];
    var sEntityTypeName = oAction.getObject(sContextPath).$Type;
    var sEntityName = getEntitySetName(oAction.getModel(), sEntityTypeName);

    if (sEntityName) {
      sContextPath = "/".concat(sEntityName);
    }

    if (bCheckStaticValue) {
      return oAction.getObject("".concat(sContextPath, "/").concat(sActionName, "@Org.OData.Core.V1.OperationAvailable"));
    }

    if (bReturnOnlyPath) {
      return "".concat(sContextPath, "/").concat(sActionName);
    } else {
      return {
        sContextPath: sContextPath,
        sProperty: oAction.getObject("".concat(sContextPath, "/").concat(sActionName, "@Org.OData.Core.V1.OperationAvailable/$Path")),
        sBindingParameter: oAction.getObject("".concat(sContextPath, "/").concat(sActionName, "/@$ui5.overload/0/$Parameter/0/$Name"))
      };
    }
  }

  function getEntitySetName(oMetaModel, sEntityType) {
    var oEntityContainer = oMetaModel.getObject("/");

    for (var key in oEntityContainer) {
      if (typeof oEntityContainer[key] === "object" && oEntityContainer[key].$Type === sEntityType) {
        return key;
      }
    }
  }

  function computeDisplayMode(oPropertyAnnotations, oCollectionAnnotations) {
    var oTextAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"],
        oTextArrangementAnnotation = oTextAnnotation && (oPropertyAnnotations && oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] || oCollectionAnnotations && oCollectionAnnotations["@com.sap.vocabularies.UI.v1.TextArrangement"]);

    if (oTextArrangementAnnotation) {
      if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
        return "Description";
      } else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
        return "ValueDescription";
      } else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate") {
        return "Value";
      } //Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set


      return "DescriptionValue";
    }

    return oTextAnnotation ? "DescriptionValue" : "Value";
  }

  function _getEntityType(oContext) {
    var oMetaModel = oContext.getModel().getMetaModel();
    return oMetaModel.getObject("".concat(oMetaModel.getMetaPath(oContext.getPath()), "/$Type"));
  }

  function _requestObject(sAction, oSelectedContext, sProperty) {
    var oContext = oSelectedContext;
    var nBracketIndex = sAction.indexOf("(");

    if (nBracketIndex > -1) {
      var sTargetType = sAction.slice(nBracketIndex + 1, -1);

      var sCurrentType = _getEntityType(oContext);

      while (sCurrentType !== sTargetType) {
        // Find parent binding context and retrieve entity type
        oContext = oContext.getBinding().getContext();

        if (oContext) {
          sCurrentType = _getEntityType(oContext);
        } else {
          Log.warning("Cannot determine target type to request property value for bound action invocation");
          return Promise.resolve(undefined);
        }
      }
    }

    return oContext.requestObject(sProperty);
  }

  function requestProperty(oSelectedContext, sAction, sProperty, sDynamicActionEnabledPath) {
    var oPromise = sProperty && sProperty.indexOf("/") === 0 ? requestSingletonProperty(sProperty, oSelectedContext.getModel()) : _requestObject(sAction, oSelectedContext, sProperty);
    return oPromise.then(function (vPropertyValue) {
      return Promise.resolve({
        vPropertyValue: vPropertyValue,
        oSelectedContext: oSelectedContext,
        sAction: sAction,
        sDynamicActionEnabledPath: sDynamicActionEnabledPath
      });
    });
  }

  function setContextsBasedOnOperationAvailable(oInternalModelContext, aRequestPromises) {
    return Promise.all(aRequestPromises).then(function (aResults) {
      if (aResults.length) {
        var aApplicableContexts = [],
            aNotApplicableContexts = [];
        aResults.forEach(function (aResult) {
          if (aResult) {
            if (aResult.vPropertyValue) {
              oInternalModelContext.getModel().setProperty(aResult.sDynamicActionEnabledPath, true);
              aApplicableContexts.push(aResult.oSelectedContext);
            } else {
              aNotApplicableContexts.push(aResult.oSelectedContext);
            }
          }
        });
        setDynamicActionContexts(oInternalModelContext, aResults[0].sAction, aApplicableContexts, aNotApplicableContexts);
      }
    }).catch(function (oError) {
      Log.trace("Cannot retrieve property value from path", oError);
    });
  }
  /**
   * @param oInternalModelContext
   * @param sAction
   * @param aApplicable
   * @param aNotApplicable
   */


  function setDynamicActionContexts(oInternalModelContext, sAction, aApplicable, aNotApplicable) {
    var sDynamicActionPathPrefix = "".concat(oInternalModelContext.getPath(), "/dynamicActions/").concat(sAction),
        oInternalModel = oInternalModelContext.getModel();
    oInternalModel.setProperty("".concat(sDynamicActionPathPrefix, "/aApplicable"), aApplicable);
    oInternalModel.setProperty("".concat(sDynamicActionPathPrefix, "/aNotApplicable"), aNotApplicable);
  }

  function _getDefaultOperators(sPropertyType) {
    // mdc defines the full set of operations that are meaningful for each Edm Type
    // TODO Replace with model / internal way of retrieving the actual model type used for the property
    var oDataClass = TypeUtil.getDataTypeClassName(sPropertyType); // TODO need to pass proper formatOptions, constraints here

    var oBaseType = TypeUtil.getBaseType(oDataClass, {}, {});
    return FilterOperatorUtil.getOperatorsForType(oBaseType);
  }

  function _getRestrictions(aDefaultOps, aExpressionOps) {
    // From the default set of Operators for the Base Type, select those that are defined in the Allowed Value.
    // In case that no operators are found, return undefined so that the default set is used.
    var aOperators = aDefaultOps.filter(function (sElement) {
      return aExpressionOps.indexOf(sElement) > -1;
    });
    return aOperators.toString() || undefined;
  }

  function getSpecificAllowedExpression(aExpressions) {
    var aAllowedExpressionsPriority = CommonUtils.AllowedExpressionsPrio;
    aExpressions.sort(function (a, b) {
      return aAllowedExpressionsPriority.indexOf(a) - aAllowedExpressionsPriority.indexOf(b);
    });
    return aExpressions[0];
  }
  /**
   * Method to fetch the correct operators based on the filter restrictions that can be annotated on an entity set or a navigation property.
   * We return the correct operators based on the specified restriction and also check for the operators defined in the manifest to include or exclude them.
   *
   * @param sProperty String name of the property
   * @param sEntitySetPath String path to the entity set
   * @param oContext Context used during templating
   * @param sType String data type od the property, for example edm.Date
   * @param bUseSemanticDateRange Boolean passed from the manifest for semantic date range
   * @param sSettings Stringified object of the property settings
   * @returns String containing comma-separated list of operators for filtering
   */


  function getOperatorsForProperty(sProperty, sEntitySetPath, oContext, sType, bUseSemanticDateRange, sSettings) {
    var oFilterRestrictions = CommonUtils.getFilterRestrictionsByPath(sEntitySetPath, oContext);
    var aEqualsOps = ["EQ"];
    var aSingleRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
    var aSingleRangeDTBasicOps = ["EQ", "BT"];
    var aSingleValueDateOps = ["TODAY", "TOMORROW", "YESTERDAY", "DATE", "FIRSTDAYWEEK", "LASTDAYWEEK", "FIRSTDAYMONTH", "LASTDAYMONTH", "FIRSTDAYQUARTER", "LASTDAYQUARTER", "FIRSTDAYYEAR", "LASTDAYYEAR"];
    var aBasicDateTimeOps = ["EQ", "BT"];
    var aMultiRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NE", "NOTBT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
    var aSearchExpressionOps = ["Contains", "NotContains", "StartsWith", "NotStartsWith", "EndsWith", "NotEndsWith"];
    var aSemanticDateOpsExt = SemanticDateOperators.getSupportedOperations();
    var bSemanticDateRange = bUseSemanticDateRange === "true" || bUseSemanticDateRange === true;
    var aSemanticDateOps = [];
    var oSettings = typeof sSettings === "string" ? JSON.parse(sSettings).customData : sSettings;

    if (oContext.getObject("".concat(sEntitySetPath, "/@com.sap.vocabularies.Common.v1.ResultContext")) === true) {
      return aEqualsOps.toString();
    }

    if (oSettings && oSettings.operatorConfiguration && oSettings.operatorConfiguration.length > 0) {
      aSemanticDateOps = SemanticDateOperators.getFilterOperations(oSettings.operatorConfiguration);
    } else {
      aSemanticDateOps = SemanticDateOperators.getSemanticDateOperations();
    } // Get the default Operators for this Property Type


    var aDefaultOperators = _getDefaultOperators(sType);

    if (bSemanticDateRange) {
      aDefaultOperators = aSemanticDateOpsExt.concat(aDefaultOperators);
    }

    var sRestrictions; // Is there a Filter Restriction defined for this property?

    if (oFilterRestrictions && oFilterRestrictions.FilterAllowedExpressions && oFilterRestrictions.FilterAllowedExpressions[sProperty]) {
      // Extending the default operators list with Semantic Date options DATERANGE, DATE, FROM and TO
      var sAllowedExpression = CommonUtils.getSpecificAllowedExpression(oFilterRestrictions.FilterAllowedExpressions[sProperty]); // In case more than one Allowed Expressions has been defined for a property
      // choose the most restrictive Allowed Expression
      // MultiValue has same Operator as SingleValue, but there can be more than one (maxConditions)

      switch (sAllowedExpression) {
        case "SingleValue":
          var aSingleValueOps = sType === "Edm.Date" && bSemanticDateRange ? aSingleValueDateOps : aEqualsOps;
          sRestrictions = _getRestrictions(aDefaultOperators, aSingleValueOps);
          break;

        case "MultiValue":
          sRestrictions = _getRestrictions(aDefaultOperators, aEqualsOps);
          break;

        case "SingleRange":
          var aExpressionOps;

          if (bSemanticDateRange) {
            if (sType === "Edm.Date") {
              aExpressionOps = aSemanticDateOps;
            } else if (sType === "Edm.DateTimeOffset") {
              aExpressionOps = aSemanticDateOps.concat(aBasicDateTimeOps);
            } else {
              aExpressionOps = aSingleRangeOps;
            }
          } else if (sType === "Edm.DateTimeOffset") {
            aExpressionOps = aSingleRangeDTBasicOps;
          } else {
            aExpressionOps = aSingleRangeOps;
          }

          var sOperators = _getRestrictions(aDefaultOperators, aExpressionOps);

          sRestrictions = sOperators ? sOperators : "";
          break;

        case "MultiRange":
          sRestrictions = _getRestrictions(aDefaultOperators, aMultiRangeOps);
          break;

        case "SearchExpression":
          sRestrictions = _getRestrictions(aDefaultOperators, aSearchExpressionOps);
          break;

        case "MultiRangeOrSearchExpression":
          sRestrictions = _getRestrictions(aDefaultOperators, aSearchExpressionOps.concat(aMultiRangeOps));
          break;

        default:
          break;
      } // In case AllowedExpressions is not recognised, undefined in return results in the default set of
      // operators for the type.

    }

    return sRestrictions;
  }
  /**
   * Method to return allowed operators for type Guid.
   *
   * @function
   * @name getOperatorsForGuidProperty
   * @returns Allowed operators for type Guid
   */


  _exports.getOperatorsForProperty = getOperatorsForProperty;

  function getOperatorsForGuidProperty() {
    var allowedOperatorsForGuid = ["EQ", "NE"];
    return allowedOperatorsForGuid.toString();
  }

  function getOperatorsForDateProperty(propertyType) {
    // In case AllowedExpressions is not provided for type Edm.Date then all the default
    // operators for the type should be returned excluding semantic operators from the list.
    var aDefaultOperators = _getDefaultOperators(propertyType);

    var aMultiRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NE", "NOTBT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
    return _getRestrictions(aDefaultOperators, aMultiRangeOps);
  }

  function getParameterInfo(oMetaModel, sContextPath) {
    var sParameterContextPath = sContextPath.substring(0, sContextPath.lastIndexOf("/"));
    var bResultContext = oMetaModel.getObject("".concat(sParameterContextPath, "/@com.sap.vocabularies.Common.v1.ResultContext"));
    var oParameterInfo = {};

    if (bResultContext && sParameterContextPath !== sContextPath) {
      oParameterInfo.contextPath = sParameterContextPath;
      oParameterInfo.parameterProperties = CommonUtils.getContextPathProperties(oMetaModel, sParameterContextPath);
    }

    return oParameterInfo;
  }
  /**
   * Method to add the select Options to filter conditions.
   *
   * @function
   * @name addSelectOptionToConditions
   * @param oPropertyMetadata Property metadata information
   * @param aValidOperators Operators for all the data types
   * @param aSemanticDateOperators Operators for the Date type
   * @param aCumulativeConditions Filter conditions
   * @param oSelectOption Selectoption of selection variant
   * @returns The filter conditions
   */


  function addSelectOptionToConditions(oPropertyMetadata, aValidOperators, aSemanticDateOperators, aCumulativeConditions, oSelectOption) {
    var _oSelectOption$Semant;

    var oCondition = getConditions(oSelectOption, oPropertyMetadata);

    if (oSelectOption !== null && oSelectOption !== void 0 && oSelectOption.SemanticDates && aSemanticDateOperators && aSemanticDateOperators.indexOf(oSelectOption === null || oSelectOption === void 0 ? void 0 : (_oSelectOption$Semant = oSelectOption.SemanticDates) === null || _oSelectOption$Semant === void 0 ? void 0 : _oSelectOption$Semant.operator) > -1) {
      var semanticDates = CommonUtils.addSemanticDatesToConditions(oSelectOption === null || oSelectOption === void 0 ? void 0 : oSelectOption.SemanticDates);

      if (semanticDates && Object.keys(semanticDates).length > 0) {
        aCumulativeConditions.push(semanticDates);
      }
    } else if (oCondition) {
      if (!aValidOperators || aValidOperators.indexOf(oCondition.operator) > -1) {
        aCumulativeConditions.push(oCondition);
      }
    }

    return aCumulativeConditions;
  }
  /**
   * Method to add the semantic dates to filter conditions
   *
   * @function
   * @name addSemanticDatesToConditions
   * @param oSemanticDates Semantic date infomation
   * @returns The filter conditions containing semantic dates
   */


  function addSemanticDatesToConditions(oSemanticDates) {
    var values = [];

    if (oSemanticDates !== null && oSemanticDates !== void 0 && oSemanticDates.high) {
      values.push(oSemanticDates === null || oSemanticDates === void 0 ? void 0 : oSemanticDates.high);
    }

    if (oSemanticDates !== null && oSemanticDates !== void 0 && oSemanticDates.low) {
      values.push(oSemanticDates === null || oSemanticDates === void 0 ? void 0 : oSemanticDates.low);
    }

    return {
      values: values,
      operator: oSemanticDates === null || oSemanticDates === void 0 ? void 0 : oSemanticDates.operator,
      isEmpty: null
    };
  }
  /**
   * @param sContextPath
   * @param oSelectionVariant
   * @param sSelectOptionProp
   * @param oConditions
   * @param sConditionPath
   * @param sConditionProp
   * @param oValidProperties
   * @param oMetaModel
   * @param isParameter
   * @param bIsFLPValuePresent
   * @param bUseSemanticDateRange
   * @param oViewData
   */


  function addSelectOptionsToConditions(sContextPath, oSelectionVariant, sSelectOptionProp, oConditions, sConditionPath, sConditionProp, oValidProperties, oMetaModel, isParameter, bIsFLPValuePresent, bUseSemanticDateRange, oViewData) {
    var aConditions = [],
        aSelectOptions,
        aValidOperators,
        aSemanticDateOperators;

    if (isParameter || CommonUtils.isPropertyFilterable(oMetaModel, sContextPath, sConditionProp, true)) {
      var oPropertyMetadata = oValidProperties[sConditionProp];
      aSelectOptions = oSelectionVariant.getSelectOption(sSelectOptionProp);
      var settings = getFilterConfigurationSetting(oViewData, sConditionProp);
      aValidOperators = isParameter ? ["EQ"] : CommonUtils.getOperatorsForProperty(sConditionProp, sContextPath, oMetaModel);

      if (bUseSemanticDateRange) {
        aSemanticDateOperators = isParameter ? ["EQ"] : CommonUtils.getOperatorsForProperty(sConditionProp, sContextPath, oMetaModel, oPropertyMetadata === null || oPropertyMetadata === void 0 ? void 0 : oPropertyMetadata.$Type, bUseSemanticDateRange, settings);
      } // Create conditions for all the selectOptions of the property


      aConditions = isParameter ? CommonUtils.addSelectOptionToConditions(oPropertyMetadata, aValidOperators, aSemanticDateOperators, aConditions, aSelectOptions[0]) : aSelectOptions.reduce(CommonUtils.addSelectOptionToConditions.bind(null, oPropertyMetadata, aValidOperators, aSemanticDateOperators), aConditions);

      if (aConditions.length) {
        if (sConditionPath) {
          oConditions[sConditionPath + sConditionProp] = oConditions.hasOwnProperty(sConditionPath + sConditionProp) ? oConditions[sConditionPath + sConditionProp].concat(aConditions) : aConditions;
        } else if (bIsFLPValuePresent) {
          // If FLP values are present replace it with FLP values
          aConditions.forEach(function (element) {
            element["filtered"] = true;
          });

          if (oConditions.hasOwnProperty(sConditionProp)) {
            oConditions[sConditionProp].forEach(function (element) {
              element["filtered"] = false;
            });
            oConditions[sConditionProp] = oConditions[sConditionProp].concat(aConditions);
          } else {
            oConditions[sConditionProp] = aConditions;
          }
        } else {
          oConditions[sConditionProp] = oConditions.hasOwnProperty(sConditionProp) ? oConditions[sConditionProp].concat(aConditions) : aConditions;
        }
      }
    }
  }
  /**
   * Method to create the semantic dates from filter conditions
   *
   * @function
   * @name createSemanticDatesFromConditions
   * @param oCondition Filter field condition
   * @param sFilterName Filter Field Path
   * @returns The Semantic date conditions
   */


  function createSemanticDatesFromConditions(oCondition) {
    var _oCondition$values, _oCondition$values2;

    return {
      high: (oCondition === null || oCondition === void 0 ? void 0 : (_oCondition$values = oCondition.values) === null || _oCondition$values === void 0 ? void 0 : _oCondition$values[0]) || null,
      low: (oCondition === null || oCondition === void 0 ? void 0 : (_oCondition$values2 = oCondition.values) === null || _oCondition$values2 === void 0 ? void 0 : _oCondition$values2[1]) || null,
      operator: oCondition === null || oCondition === void 0 ? void 0 : oCondition.operator
    };
  }
  /**
   * Method to Return the filter configuration
   *
   * @function
   * @name getFilterConfigurationSetting
   * @param oViewData manifest Configuration
   * @param sProperty Filter Field Path
   * @returns The Filter Field Configuration
   */


  function getFilterConfigurationSetting(oViewData, sProperty) {
    var _oConfig$ComSapVoc, _filterConfig$sProper;

    var oConfig = oViewData === null || oViewData === void 0 ? void 0 : oViewData.controlConfiguration;
    var filterConfig = oConfig && ((_oConfig$ComSapVoc = oConfig["@com.sap.vocabularies.UI.v1.SelectionFields"]) === null || _oConfig$ComSapVoc === void 0 ? void 0 : _oConfig$ComSapVoc.filterFields);
    return filterConfig !== null && filterConfig !== void 0 && filterConfig[sProperty] ? (_filterConfig$sProper = filterConfig[sProperty]) === null || _filterConfig$sProper === void 0 ? void 0 : _filterConfig$sProper.settings : undefined;
  }

  function addSelectionVariantToConditions(oSelectionVariant, oConditions, oMetaModel, sContextPath, bIsFLPValues, bUseSemanticDateRange, oViewData) {
    var aSelectOptionsPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames(),
        oValidProperties = CommonUtils.getContextPathProperties(oMetaModel, sContextPath),
        aMetadatProperties = Object.keys(oValidProperties),
        oParameterInfo = CommonUtils.getParameterInfo(oMetaModel, sContextPath),
        sParameterContextPath = oParameterInfo.contextPath,
        oValidParameterProperties = oParameterInfo.parameterProperties,
        bHasParameters = !!oParameterInfo.contextPath && oValidParameterProperties && Object.keys(oValidParameterProperties).length > 0;

    if (bHasParameters) {
      var aMetadataParameters = Object.keys(oValidParameterProperties);
      aMetadataParameters.forEach(function (sMetadataParameter) {
        var sSelectOptionName;

        if (aSelectOptionsPropertyNames.includes("$Parameter.".concat(sMetadataParameter))) {
          sSelectOptionName = "$Parameter.".concat(sMetadataParameter);
        } else if (aSelectOptionsPropertyNames.includes(sMetadataParameter)) {
          sSelectOptionName = sMetadataParameter;
        } else if (sMetadataParameter.startsWith("P_") && aSelectOptionsPropertyNames.includes("$Parameter.".concat(sMetadataParameter.slice(2, sMetadataParameter.length)))) {
          sSelectOptionName = "$Parameter.".concat(sMetadataParameter.slice(2, sMetadataParameter.length));
        } else if (sMetadataParameter.startsWith("P_") && aSelectOptionsPropertyNames.includes(sMetadataParameter.slice(2, sMetadataParameter.length))) {
          sSelectOptionName = sMetadataParameter.slice(2, sMetadataParameter.length);
        } else if (aSelectOptionsPropertyNames.includes("$Parameter.P_".concat(sMetadataParameter))) {
          sSelectOptionName = "$Parameter.P_".concat(sMetadataParameter);
        } else if (aSelectOptionsPropertyNames.includes("P_".concat(sMetadataParameter))) {
          sSelectOptionName = "P_".concat(sMetadataParameter);
        }

        if (sSelectOptionName) {
          addSelectOptionsToConditions(sParameterContextPath, oSelectionVariant, sSelectOptionName, oConditions, undefined, sMetadataParameter, oValidParameterProperties, oMetaModel, true, bIsFLPValues, bUseSemanticDateRange, oViewData);
        }
      });
    }

    aMetadatProperties.forEach(function (sMetadataProperty) {
      var sSelectOptionName;

      if (aSelectOptionsPropertyNames.includes(sMetadataProperty)) {
        sSelectOptionName = sMetadataProperty;
      } else if (sMetadataProperty.startsWith("P_") && aSelectOptionsPropertyNames.includes(sMetadataProperty.slice(2, sMetadataProperty.length))) {
        sSelectOptionName = sMetadataProperty.slice(2, sMetadataProperty.length);
      } else if (aSelectOptionsPropertyNames.includes("P_".concat(sMetadataProperty))) {
        sSelectOptionName = "P_".concat(sMetadataProperty);
      }

      if (sSelectOptionName) {
        addSelectOptionsToConditions(sContextPath, oSelectionVariant, sSelectOptionName, oConditions, undefined, sMetadataProperty, oValidProperties, oMetaModel, false, bIsFLPValues, bUseSemanticDateRange, oViewData);
      }
    });
    aSelectOptionsPropertyNames.forEach(function (sSelectOption) {
      if (sSelectOption.indexOf(".") > 0 && !sSelectOption.includes("$Parameter")) {
        var sReplacedOption = sSelectOption.replaceAll(".", "/");
        var sFullContextPath = "/".concat(sReplacedOption).startsWith(sContextPath) ? "/".concat(sReplacedOption) : "".concat(sContextPath, "/").concat(sReplacedOption); // check if the full path, eg SalesOrderManage._Item.Material exists in the metamodel

        if (oMetaModel.getObject(sFullContextPath.replace("P_", ""))) {
          _createConditionsForNavProperties(sFullContextPath, sContextPath, oSelectionVariant, sSelectOption, oMetaModel, oConditions, bIsFLPValues, bUseSemanticDateRange, oViewData);
        }
      }
    });
    return oConditions;
  }
  /**
   * @param sFullContextPath
   * @param sMainEntitySetPath
   * @param oSelectionVariant
   * @param sSelectOption
   * @param oMetaModel
   * @param oConditions
   * @param bIsFLPValuePresent
   * @param bSemanticDateRange
   * @param oViewData
   */


  function _createConditionsForNavProperties(sFullContextPath, sMainEntitySetPath, oSelectionVariant, sSelectOption, oMetaModel, oConditions, bIsFLPValuePresent, bSemanticDateRange, oViewData) {
    var aNavObjectNames = sSelectOption.split("."); // Eg: "SalesOrderManage._Item._Material.Material" or "_Item.Material"

    if ("/".concat(sSelectOption.replaceAll(".", "/")).startsWith(sMainEntitySetPath)) {
      var sFullPath = "/".concat(sSelectOption).replaceAll(".", "/"),
          sNavPath = sFullPath.replace("".concat(sMainEntitySetPath, "/"), "");
      aNavObjectNames = sNavPath.split("/");
    }

    var sConditionPath = "";
    var sPropertyName = aNavObjectNames[aNavObjectNames.length - 1]; // Material from SalesOrderManage._Item.Material

    for (var i = 0; i < aNavObjectNames.length - 1; i++) {
      if (oMetaModel.getObject("".concat(sMainEntitySetPath, "/").concat(aNavObjectNames[i].replace("P_", ""))).$isCollection) {
        sConditionPath = "".concat(sConditionPath + aNavObjectNames[i], "*/"); // _Item*/ in case of 1:n cardinality
      } else {
        sConditionPath = "".concat(sConditionPath + aNavObjectNames[i], "/"); // _Item/ in case of 1:1 cardinality
      }

      sMainEntitySetPath = "".concat(sMainEntitySetPath, "/").concat(aNavObjectNames[i]);
    }

    var sNavPropertyPath = sFullContextPath.slice(0, sFullContextPath.lastIndexOf("/")),
        oValidProperties = CommonUtils.getContextPathProperties(oMetaModel, sNavPropertyPath),
        aSelectOptionsPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames();
    var sSelectOptionName = sPropertyName;

    if (oValidProperties[sPropertyName]) {
      sSelectOptionName = sPropertyName;
    } else if (sPropertyName.startsWith("P_") && oValidProperties[sPropertyName.replace("P_", "")]) {
      sSelectOptionName = sPropertyName.replace("P_", "");
    } else if (oValidProperties["P_".concat(sPropertyName)] && aSelectOptionsPropertyNames.includes("P_".concat(sPropertyName))) {
      sSelectOptionName = "P_".concat(sPropertyName);
    }

    if (sPropertyName.startsWith("P_") && oConditions[sConditionPath + sSelectOptionName]) {// if there is no SalesOrderManage._Item.Material yet in the oConditions
    } else if (!sPropertyName.startsWith("P_") && oConditions[sConditionPath + sSelectOptionName]) {
      delete oConditions[sConditionPath + sSelectOptionName];
      addSelectOptionsToConditions(sNavPropertyPath, oSelectionVariant, sSelectOption, oConditions, sConditionPath, sSelectOptionName, oValidProperties, oMetaModel, false, bIsFLPValuePresent, bSemanticDateRange, oViewData);
    } else {
      addSelectOptionsToConditions(sNavPropertyPath, oSelectionVariant, sSelectOption, oConditions, sConditionPath, sSelectOptionName, oValidProperties, oMetaModel, false, bIsFLPValuePresent, bSemanticDateRange, oViewData);
    }
  }

  function addPageContextToSelectionVariant(oSelectionVariant, mPageContext, oView) {
    var oAppComponent = CommonUtils.getAppComponent(oView);
    var oNavigationService = oAppComponent.getNavigationService();
    return oNavigationService.mixAttributesAndSelectionVariant(mPageContext, oSelectionVariant.toJSONString());
  }

  function addExternalStateFiltersToSelectionVariant(oSelectionVariant, mFilters, oTargetInfo, oFilterBar) {
    var sFilter;

    var fnGetSignAndOption = function (sOperator, sLowValue, sHighValue) {
      var oSelectOptionState = {
        option: "",
        sign: "I",
        low: sLowValue,
        high: sHighValue
      };

      switch (sOperator) {
        case "Contains":
          oSelectOptionState.option = "CP";
          break;

        case "StartsWith":
          oSelectOptionState.option = "CP";
          oSelectOptionState.low += "*";
          break;

        case "EndsWith":
          oSelectOptionState.option = "CP";
          oSelectOptionState.low = "*".concat(oSelectOptionState.low);
          break;

        case "BT":
        case "LE":
        case "LT":
        case "GT":
        case "NE":
        case "EQ":
          oSelectOptionState.option = sOperator;
          break;

        case "DATE":
          oSelectOptionState.option = "EQ";
          break;

        case "DATERANGE":
          oSelectOptionState.option = "BT";
          break;

        case "FROM":
          oSelectOptionState.option = "GE";
          break;

        case "TO":
          oSelectOptionState.option = "LE";
          break;

        case "EEQ":
          oSelectOptionState.option = "EQ";
          break;

        case "Empty":
          oSelectOptionState.option = "EQ";
          oSelectOptionState.low = "";
          break;

        case "NotContains":
          oSelectOptionState.option = "CP";
          oSelectOptionState.sign = "E";
          break;

        case "NOTBT":
          oSelectOptionState.option = "BT";
          oSelectOptionState.sign = "E";
          break;

        case "NotStartsWith":
          oSelectOptionState.option = "CP";
          oSelectOptionState.low += "*";
          oSelectOptionState.sign = "E";
          break;

        case "NotEndsWith":
          oSelectOptionState.option = "CP";
          oSelectOptionState.low = "*".concat(oSelectOptionState.low);
          oSelectOptionState.sign = "E";
          break;

        case "NotEmpty":
          oSelectOptionState.option = "NE";
          oSelectOptionState.low = "";
          break;

        case "NOTLE":
          oSelectOptionState.option = "LE";
          oSelectOptionState.sign = "E";
          break;

        case "NOTGE":
          oSelectOptionState.option = "GE";
          oSelectOptionState.sign = "E";
          break;

        case "NOTLT":
          oSelectOptionState.option = "LT";
          oSelectOptionState.sign = "E";
          break;

        case "NOTGT":
          oSelectOptionState.option = "GT";
          oSelectOptionState.sign = "E";
          break;

        default:
          Log.warning("".concat(sOperator, " is not supported. ").concat(sFilter, " could not be added to the navigation context"));
      }

      return oSelectOptionState;
    };

    var oFilterConditions = mFilters.filterConditions;
    var oFiltersWithoutConflict = mFilters.filterConditionsWithoutConflict ? mFilters.filterConditionsWithoutConflict : {};
    var oTablePropertiesWithoutConflict = oTargetInfo.propertiesWithoutConflict ? oTargetInfo.propertiesWithoutConflict : {};

    var addFiltersToSelectionVariant = function (selectionVariant, sFilterName, sPath) {
      var aConditions = oFilterConditions[sFilterName];
      var oPropertyInfo = oFilterBar && oFilterBar.getPropertyHelper().getProperty(sFilterName);
      var oTypeConfig = oPropertyInfo === null || oPropertyInfo === void 0 ? void 0 : oPropertyInfo.typeConfig;
      var oTypeUtil = oFilterBar && oFilterBar.getControlDelegate().getTypeUtil();

      for (var item in aConditions) {
        var oCondition = aConditions[item];
        var option = "",
            sign = "I",
            low = "",
            high = null,
            semanticDates = void 0;
        var oOperator = FilterOperatorUtil.getOperator(oCondition.operator);

        if (oOperator instanceof RangeOperator) {
          var _oModelFilter$aFilter;

          semanticDates = CommonUtils.createSemanticDatesFromConditions(oCondition); // handling of Date RangeOperators

          var oModelFilter = oOperator.getModelFilter(oCondition, sFilterName, oTypeConfig === null || oTypeConfig === void 0 ? void 0 : oTypeConfig.typeInstance, false, oTypeConfig === null || oTypeConfig === void 0 ? void 0 : oTypeConfig.baseType);

          if (!(oModelFilter !== null && oModelFilter !== void 0 && oModelFilter.aFilters) && !(oModelFilter !== null && oModelFilter !== void 0 && (_oModelFilter$aFilter = oModelFilter.aFilters) !== null && _oModelFilter$aFilter !== void 0 && _oModelFilter$aFilter.length)) {
            sign = oOperator !== null && oOperator !== void 0 && oOperator.exclude ? "E" : "I";
            low = oTypeUtil.externalizeValue(oModelFilter.getValue1(), oTypeConfig.typeInstance);
            high = oTypeUtil.externalizeValue(oModelFilter.getValue2(), oTypeConfig.typeInstance);
            option = oModelFilter.getOperator();
          }
        } else {
          var aSemanticDateOpsExt = SemanticDateOperators.getSupportedOperations();

          if (aSemanticDateOpsExt.includes(oCondition === null || oCondition === void 0 ? void 0 : oCondition.operator)) {
            semanticDates = CommonUtils.createSemanticDatesFromConditions(oCondition);
          }

          var value1 = oCondition.values[0] && oCondition.values[0].toString() || "";
          var value2 = oCondition.values[1] && oCondition.values[1].toString() || null;
          var oSelectOption = fnGetSignAndOption(oCondition.operator, value1, value2);
          sign = oOperator !== null && oOperator !== void 0 && oOperator.exclude ? "E" : "I";
          low = oSelectOption === null || oSelectOption === void 0 ? void 0 : oSelectOption.low;
          high = oSelectOption === null || oSelectOption === void 0 ? void 0 : oSelectOption.high;
          option = oSelectOption === null || oSelectOption === void 0 ? void 0 : oSelectOption.option;
        }

        if (option && semanticDates) {
          selectionVariant.addSelectOption(sPath ? sPath : sFilterName, sign, option, low, high, undefined, semanticDates);
        } else if (option) {
          selectionVariant.addSelectOption(sPath ? sPath : sFilterName, sign, option, low, high);
        }
      }
    };

    for (sFilter in oFilterConditions) {
      // only add the filter values if it is not already present in the SV already
      if (!oSelectionVariant.getSelectOption(sFilter)) {
        // TODO : custom filters should be ignored more generically
        if (sFilter === "$editState") {
          continue;
        }

        addFiltersToSelectionVariant(oSelectionVariant, sFilter);
      } else {
        if (oTablePropertiesWithoutConflict && sFilter in oTablePropertiesWithoutConflict) {
          addFiltersToSelectionVariant(oSelectionVariant, sFilter, oTablePropertiesWithoutConflict[sFilter]);
        } // if property was without conflict in page context then add path from page context to SV


        if (sFilter in oFiltersWithoutConflict) {
          addFiltersToSelectionVariant(oSelectionVariant, sFilter, oFiltersWithoutConflict[sFilter]);
        }
      }
    }

    return oSelectionVariant;
  }

  function isStickyEditMode(oControl) {
    var bIsStickyMode = ModelHelper.isStickySessionSupported(oControl.getModel().getMetaModel());
    var bUIEditable = oControl.getModel("ui").getProperty("/isEditable");
    return bIsStickyMode && bUIEditable;
  }
  /**
   * @param aMandatoryFilterFields
   * @param oSelectionVariant
   * @param oSelectionVariantDefaults
   */


  function addDefaultDisplayCurrency(aMandatoryFilterFields, oSelectionVariant, oSelectionVariantDefaults) {
    if (oSelectionVariant && aMandatoryFilterFields && aMandatoryFilterFields.length) {
      for (var i = 0; i < aMandatoryFilterFields.length; i++) {
        var aSVOption = oSelectionVariant.getSelectOption("DisplayCurrency"),
            aDefaultSVOption = oSelectionVariantDefaults && oSelectionVariantDefaults.getSelectOption("DisplayCurrency");

        if (aMandatoryFilterFields[i].$PropertyPath === "DisplayCurrency" && (!aSVOption || !aSVOption.length) && aDefaultSVOption && aDefaultSVOption.length) {
          var displayCurrencySelectOption = aDefaultSVOption[0];
          var sSign = displayCurrencySelectOption["Sign"];
          var sOption = displayCurrencySelectOption["Option"];
          var sLow = displayCurrencySelectOption["Low"];
          var sHigh = displayCurrencySelectOption["High"];
          oSelectionVariant.addSelectOption("DisplayCurrency", sSign, sOption, sLow, sHigh);
        }
      }
    }
  }

  function getNonComputedVisibleFields(oMetaModel, sPath, oView) {
    var aTechnicalKeys = oMetaModel.getObject("".concat(sPath, "/")).$Key;
    var aNonComputedVisibleFields = [];
    var aImmutableVisibleFields = [];
    var oEntityType = oMetaModel.getObject("".concat(sPath, "/"));

    for (var item in oEntityType) {
      if (oEntityType[item].$kind && oEntityType[item].$kind === "Property") {
        var oAnnotations = oMetaModel.getObject("".concat(sPath, "/").concat(item, "@")) || {},
            bIsKey = aTechnicalKeys.indexOf(item) > -1,
            bIsImmutable = oAnnotations["@Org.OData.Core.V1.Immutable"],
            bIsNonComputed = !oAnnotations["@Org.OData.Core.V1.Computed"],
            bIsVisible = !oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"],
            bIsComputedDefaultValue = oAnnotations["@Org.OData.Core.V1.ComputedDefaultValue"],
            bIsKeyComputedDefaultValueWithText = bIsKey && oEntityType[item].$Type === "Edm.Guid" ? bIsComputedDefaultValue && oAnnotations["@com.sap.vocabularies.Common.v1.Text"] : false;

        if ((bIsKeyComputedDefaultValueWithText || bIsKey && oEntityType[item].$Type !== "Edm.Guid") && bIsNonComputed && bIsVisible) {
          aNonComputedVisibleFields.push(item);
        } else if (bIsImmutable && bIsNonComputed && bIsVisible) {
          aImmutableVisibleFields.push(item);
        }

        if (!bIsNonComputed && bIsComputedDefaultValue && oView) {
          var _IssueCategoryType$An;

          var oDiagnostics = getAppComponent(oView).getDiagnostics();
          var sMessage = "Core.ComputedDefaultValue is ignored as Core.Computed is already set to true";
          oDiagnostics.addIssue(IssueCategory.Annotation, IssueSeverity.Medium, sMessage, IssueCategoryType, IssueCategoryType === null || IssueCategoryType === void 0 ? void 0 : (_IssueCategoryType$An = IssueCategoryType.Annotations) === null || _IssueCategoryType$An === void 0 ? void 0 : _IssueCategoryType$An.IgnoredAnnotation);
        }
      }
    }

    var aRequiredProperties = CommonUtils.getRequiredPropertiesFromInsertRestrictions(sPath, oMetaModel);

    if (aRequiredProperties.length) {
      aRequiredProperties.forEach(function (sProperty) {
        var oAnnotations = oMetaModel.getObject("".concat(sPath, "/").concat(sProperty, "@")),
            bIsVisible = !oAnnotations || !oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];

        if (bIsVisible && aNonComputedVisibleFields.indexOf(sProperty) === -1 && aImmutableVisibleFields.indexOf(sProperty) === -1) {
          aNonComputedVisibleFields.push(sProperty);
        }
      });
    }

    return aNonComputedVisibleFields.concat(aImmutableVisibleFields);
  }

  function getRequiredProperties(sPath, oMetaModel) {
    var bCheckUpdateRestrictions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var aRequiredProperties = [];
    var aRequiredPropertiesWithPaths = [];
    var navigationText = "$NavigationPropertyBinding";
    var oEntitySetAnnotations;

    if (sPath.endsWith("$")) {
      // if sPath comes with a $ in the end, removing it as it is of no significance
      sPath = sPath.replace("/$", "");
    }

    var entityTypePathParts = sPath.replaceAll("%2F", "/").split("/").filter(ModelHelper.filterOutNavPropBinding);
    var entitySetPath = ModelHelper.getEntitySetPath(sPath, oMetaModel);
    var entitySetPathParts = entitySetPath.split("/").filter(ModelHelper.filterOutNavPropBinding);
    var isContainment = oMetaModel.getObject("/".concat(entityTypePathParts.join("/"), "/$ContainsTarget"));
    var containmentNavPath = isContainment && entityTypePathParts[entityTypePathParts.length - 1]; //Restrictions directly at Entity Set
    //e.g. FR in "NS.EntityContainer/SalesOrderManage" ContextPath: /SalesOrderManage

    if (!isContainment) {
      oEntitySetAnnotations = oMetaModel.getObject("".concat(entitySetPath, "@"));
    }

    if (entityTypePathParts.length > 1) {
      var navPath = isContainment ? containmentNavPath : entitySetPathParts[entitySetPathParts.length - 1];
      var parentEntitySetPath = isContainment ? entitySetPath : "/".concat(entitySetPathParts.slice(0, -1).join("/".concat(navigationText, "/"))); //Navigation restrictions
      //e.g. Parent "/Customer" with NavigationPropertyPath="Set" ContextPath: Customer/Set

      var oNavRest = CommonUtils.getNavigationRestrictions(oMetaModel, parentEntitySetPath, navPath.replaceAll("%2F", "/"));

      if (CommonUtils.hasRestrictedPropertiesInAnnotations(oNavRest, true, bCheckUpdateRestrictions)) {
        aRequiredPropertiesWithPaths = bCheckUpdateRestrictions ? oNavRest["UpdateRestrictions"].RequiredProperties : oNavRest["InsertRestrictions"].RequiredProperties;
      }

      if ((!aRequiredPropertiesWithPaths || !aRequiredPropertiesWithPaths.length) && CommonUtils.hasRestrictedPropertiesInAnnotations(oEntitySetAnnotations, false, bCheckUpdateRestrictions)) {
        aRequiredPropertiesWithPaths = CommonUtils.getRequiredPropertiesFromAnnotations(oEntitySetAnnotations, bCheckUpdateRestrictions);
      }
    } else if (CommonUtils.hasRestrictedPropertiesInAnnotations(oEntitySetAnnotations, false, bCheckUpdateRestrictions)) {
      aRequiredPropertiesWithPaths = CommonUtils.getRequiredPropertiesFromAnnotations(oEntitySetAnnotations, bCheckUpdateRestrictions);
    }

    aRequiredPropertiesWithPaths.forEach(function (oRequiredProperty) {
      var sProperty = oRequiredProperty["$PropertyPath"];
      aRequiredProperties.push(sProperty);
    });
    return aRequiredProperties;
  }

  function getRequiredPropertiesFromInsertRestrictions(sPath, oMetaModel) {
    return CommonUtils.getRequiredProperties(sPath, oMetaModel);
  }

  function getRequiredPropertiesFromUpdateRestrictions(sPath, oMetaModel) {
    return CommonUtils.getRequiredProperties(sPath, oMetaModel, true);
  }

  function getRequiredPropertiesFromAnnotations(oAnnotations) {
    var bCheckUpdateRestrictions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (bCheckUpdateRestrictions) {
      return oAnnotations["@Org.OData.Capabilities.V1.UpdateRestrictions"].RequiredProperties;
    }

    return oAnnotations["@Org.OData.Capabilities.V1.InsertRestrictions"].RequiredProperties;
  }

  function hasRestrictedPropertiesInAnnotations(oAnnotations) {
    var bIsNavigationRestrictions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var bCheckUpdateRestrictions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (bIsNavigationRestrictions) {
      if (bCheckUpdateRestrictions) {
        return oAnnotations && oAnnotations["UpdateRestrictions"] && oAnnotations["UpdateRestrictions"].RequiredProperties ? true : false;
      }

      return oAnnotations && oAnnotations["InsertRestrictions"] && oAnnotations["InsertRestrictions"].RequiredProperties ? true : false;
    } else if (bCheckUpdateRestrictions) {
      return oAnnotations && oAnnotations["@Org.OData.Capabilities.V1.UpdateRestrictions"] && oAnnotations["@Org.OData.Capabilities.V1.UpdateRestrictions"].RequiredProperties ? true : false;
    }

    return oAnnotations && oAnnotations["@Org.OData.Capabilities.V1.InsertRestrictions"] && oAnnotations["@Org.OData.Capabilities.V1.InsertRestrictions"].RequiredProperties ? true : false;
  }

  function setUserDefaults(oAppComponent, aParameters, oModel, bIsAction, bIsCreate, oActionDefaultValues) {
    return new Promise(function (resolve) {
      var oComponentData = oAppComponent.getComponentData(),
          oStartupParameters = oComponentData && oComponentData.startupParameters || {},
          oShellServices = oAppComponent.getShellServices();

      if (!oShellServices.hasUShell()) {
        aParameters.forEach(function (oParameter) {
          var sPropertyName = bIsAction ? "/".concat(oParameter.$Name) : oParameter.getPath().slice(oParameter.getPath().lastIndexOf("/") + 1);
          var sParameterName = bIsAction ? sPropertyName.slice(1) : sPropertyName;

          if (oActionDefaultValues && bIsCreate) {
            if (oActionDefaultValues[sParameterName]) {
              oModel.setProperty(sPropertyName, oActionDefaultValues[sParameterName]);
            }
          } else if (oStartupParameters[sParameterName]) {
            oModel.setProperty(sPropertyName, oStartupParameters[sParameterName][0]);
          }
        });
        return resolve(true);
      }

      return oShellServices.getStartupAppState(oAppComponent).then(function (oStartupAppState) {
        var oData = oStartupAppState.getData() || {},
            aExtendedParameters = oData.selectionVariant && oData.selectionVariant.SelectOptions || [];
        aParameters.forEach(function (oParameter) {
          var sPropertyName = bIsAction ? "/".concat(oParameter.$Name) : oParameter.getPath().slice(oParameter.getPath().lastIndexOf("/") + 1);
          var sParameterName = bIsAction ? sPropertyName.slice(1) : sPropertyName;

          if (oActionDefaultValues && bIsCreate) {
            if (oActionDefaultValues[sParameterName]) {
              oModel.setProperty(sPropertyName, oActionDefaultValues[sParameterName]);
            }
          } else if (oStartupParameters[sParameterName]) {
            oModel.setProperty(sPropertyName, oStartupParameters[sParameterName][0]);
          } else if (aExtendedParameters.length > 0) {
            for (var i in aExtendedParameters) {
              var oExtendedParameter = aExtendedParameters[i];

              if (oExtendedParameter.PropertyName === sParameterName) {
                var oRange = oExtendedParameter.Ranges.length ? oExtendedParameter.Ranges[oExtendedParameter.Ranges.length - 1] : undefined;

                if (oRange && oRange.Sign === "I" && oRange.Option === "EQ") {
                  oModel.setProperty(sPropertyName, oRange.Low); // high is ignored when Option=EQ
                }
              }
            }
          }
        });
        return resolve(true);
      });
    });
  }

  function getAdditionalParamsForCreate(oStartupParameters, oInboundParameters) {
    var oInbounds = oInboundParameters,
        aCreateParameters = oInbounds ? Object.keys(oInbounds).filter(function (sParameter) {
      return oInbounds[sParameter].useForCreate;
    }) : [];
    var oRet;

    for (var i = 0; i < aCreateParameters.length; i++) {
      var sCreateParameter = aCreateParameters[i];
      var aValues = oStartupParameters && oStartupParameters[sCreateParameter];

      if (aValues && aValues.length === 1) {
        oRet = oRet || Object.create(null);
        oRet[sCreateParameter] = aValues[0];
      }
    }

    return oRet;
  }

  function getSemanticObjectMapping(oOutbound) {
    var aSemanticObjectMapping = [];

    if (oOutbound.parameters) {
      var aParameters = Object.keys(oOutbound.parameters) || [];

      if (aParameters.length > 0) {
        aParameters.forEach(function (sParam) {
          var oMapping = oOutbound.parameters[sParam];

          if (oMapping.value && oMapping.value.value && oMapping.value.format === "binding") {
            // using the format of UI.Mapping
            var oSemanticMapping = {
              "LocalProperty": {
                "$PropertyPath": oMapping.value.value
              },
              "SemanticObjectProperty": sParam
            };

            if (aSemanticObjectMapping.length > 0) {
              // To check if the semanticObject Mapping is done for the same local property more that once then first one will be considered
              for (var i = 0; i < aSemanticObjectMapping.length; i++) {
                if (aSemanticObjectMapping[i]["LocalProperty"]["$PropertyPath"] !== oSemanticMapping["LocalProperty"]["$PropertyPath"]) {
                  aSemanticObjectMapping.push(oSemanticMapping);
                }
              }
            } else {
              aSemanticObjectMapping.push(oSemanticMapping);
            }
          }
        });
      }
    }

    return aSemanticObjectMapping;
  }

  function getHeaderFacetItemConfigForExternalNavigation(oViewData, oCrossNav) {
    var oHeaderFacetItems = {};
    var sId;
    var oControlConfig = oViewData.controlConfiguration;

    for (var config in oControlConfig) {
      if (config.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 || config.indexOf("@com.sap.vocabularies.UI.v1.Chart") > -1) {
        if (oControlConfig[config].navigation && oControlConfig[config].navigation.targetOutbound && oControlConfig[config].navigation.targetOutbound.outbound) {
          var sOutbound = oControlConfig[config].navigation.targetOutbound.outbound;
          var oOutbound = oCrossNav[sOutbound];

          if (oOutbound.semanticObject && oOutbound.action) {
            if (config.indexOf("Chart") > -1) {
              sId = generate(["fe", "MicroChartLink", config]);
            } else {
              sId = generate(["fe", "HeaderDPLink", config]);
            }

            var aSemanticObjectMapping = CommonUtils.getSemanticObjectMapping(oOutbound);
            oHeaderFacetItems[sId] = {
              semanticObject: oOutbound.semanticObject,
              action: oOutbound.action,
              semanticObjectMapping: aSemanticObjectMapping
            };
          } else {
            Log.error("Cross navigation outbound is configured without semantic object and action for ".concat(sOutbound));
          }
        }
      }
    }

    return oHeaderFacetItems;
  }

  function setSemanticObjectMappings(oSelectionVariant, vMappings) {
    var oMappings = typeof vMappings === "string" ? JSON.parse(vMappings) : vMappings;

    for (var i = 0; i < oMappings.length; i++) {
      var sLocalProperty = oMappings[i]["LocalProperty"] && oMappings[i]["LocalProperty"]["$PropertyPath"] || oMappings[i]["@com.sap.vocabularies.Common.v1.LocalProperty"] && oMappings[i]["@com.sap.vocabularies.Common.v1.LocalProperty"]["$Path"];
      var sSemanticObjectProperty = oMappings[i]["SemanticObjectProperty"] || oMappings[i]["@com.sap.vocabularies.Common.v1.SemanticObjectProperty"];

      if (oSelectionVariant.getSelectOption(sLocalProperty)) {
        var oSelectOption = oSelectionVariant.getSelectOption(sLocalProperty); //Create a new SelectOption with sSemanticObjectProperty as the property Name and remove the older one

        oSelectionVariant.removeSelectOption(sLocalProperty);
        oSelectionVariant.massAddSelectOption(sSemanticObjectProperty, oSelectOption);
      }
    }

    return oSelectionVariant;
  }

  function fnGetSemanticObjectsFromPath(oMetaModel, sPath, sQualifier) {
    return new Promise(function (resolve) {
      var sSemanticObject, aSemanticObjectUnavailableActions;

      if (sQualifier === "") {
        sSemanticObject = oMetaModel.getObject("".concat(sPath, "@").concat("com.sap.vocabularies.Common.v1.SemanticObject"));
        aSemanticObjectUnavailableActions = oMetaModel.getObject("".concat(sPath, "@").concat("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"));
      } else {
        sSemanticObject = oMetaModel.getObject("".concat(sPath, "@").concat("com.sap.vocabularies.Common.v1.SemanticObject", "#").concat(sQualifier));
        aSemanticObjectUnavailableActions = oMetaModel.getObject("".concat(sPath, "@").concat("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions", "#").concat(sQualifier));
      }

      var aSemanticObjectForGetLinks = [{
        semanticObject: sSemanticObject
      }];
      var oSemanticObject = {
        semanticObject: sSemanticObject
      };
      resolve({
        semanticObjectPath: sPath,
        semanticObjectForGetLinks: aSemanticObjectForGetLinks,
        semanticObject: oSemanticObject,
        unavailableActions: aSemanticObjectUnavailableActions
      });
    }).catch(function (oError) {
      Log.error("Error in fnGetSemanticObjectsFromPath", oError);
    });
  }

  function fnUpdateSemanticTargetsModel(aGetLinksPromises, aSemanticObjects, oInternalModelContext, sCurrentHash) {
    return Promise.all(aGetLinksPromises).then(function (aValues) {
      var aLinks,
          _oLink,
          _sLinkIntentAction,
          aFinalLinks = [];

      var oFinalSemanticObjects = {};

      var bIntentHasActions = function (sIntent, aActions) {
        for (var intent in aActions) {
          if (intent === sIntent) {
            return true;
          } else {
            return false;
          }
        }
      };

      for (var k = 0; k < aValues.length; k++) {
        aLinks = aValues[k];

        if (aLinks && aLinks.length > 0 && aLinks[0] !== undefined) {
          var oSemanticObject = {};
          var oTmp = {};
          var sAlternatePath = void 0;

          for (var i = 0; i < aLinks.length; i++) {
            aFinalLinks.push([]);
            var hasTargetsNotFiltered = false;
            var hasTargets = false;

            for (var iLinkCount = 0; iLinkCount < aLinks[i][0].length; iLinkCount++) {
              _oLink = aLinks[i][0][iLinkCount];
              _sLinkIntentAction = _oLink && _oLink.intent.split("?")[0].split("-")[1];

              if (!(_oLink && _oLink.intent && _oLink.intent.indexOf(sCurrentHash) === 0)) {
                hasTargetsNotFiltered = true;

                if (!bIntentHasActions(_sLinkIntentAction, aSemanticObjects[k].unavailableActions)) {
                  aFinalLinks[i].push(_oLink);
                  hasTargets = true;
                }
              }
            }

            oTmp = {
              semanticObject: aSemanticObjects[k].semanticObject,
              path: aSemanticObjects[k].path,
              HasTargets: hasTargets,
              HasTargetsNotFiltered: hasTargetsNotFiltered
            };

            if (oSemanticObject[aSemanticObjects[k].semanticObject] === undefined) {
              oSemanticObject[aSemanticObjects[k].semanticObject] = {};
            }

            sAlternatePath = aSemanticObjects[k].path.replace(/\//g, "_");

            if (oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath] === undefined) {
              oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath] = {};
            }

            oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath] = Object.assign(oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath], oTmp);
          }

          var sSemanticObjectName = Object.keys(oSemanticObject)[0];

          if (Object.keys(oFinalSemanticObjects).includes(sSemanticObjectName)) {
            oFinalSemanticObjects[sSemanticObjectName] = Object.assign(oFinalSemanticObjects[sSemanticObjectName], oSemanticObject[sSemanticObjectName]);
          } else {
            oFinalSemanticObjects = Object.assign(oFinalSemanticObjects, oSemanticObject);
          }

          aFinalLinks = [];
        }
      }

      if (Object.keys(oFinalSemanticObjects).length > 0) {
        oInternalModelContext.setProperty("semanticsTargets", mergeObjects(oFinalSemanticObjects, oInternalModelContext.getProperty("semanticsTargets")));
        return oFinalSemanticObjects;
      }
    }).catch(function (oError) {
      Log.error("fnUpdateSemanticTargetsModel: Cannot read links", oError);
    });
  }

  function fnGetSemanticObjectPromise(oAppComponent, oView, oMetaModel, sPath, sQualifier) {
    return CommonUtils.getSemanticObjectsFromPath(oMetaModel, sPath, sQualifier);
  }

  function fnPrepareSemanticObjectsPromises(_oAppComponent, _oView, _oMetaModel, _aSemanticObjectsFound, _aSemanticObjectsPromises) {
    var _Keys, sPath;

    var sQualifier, regexResult;

    for (var i = 0; i < _aSemanticObjectsFound.length; i++) {
      sPath = _aSemanticObjectsFound[i];
      _Keys = Object.keys(_oMetaModel.getObject(sPath + "@"));

      for (var index = 0; index < _Keys.length; index++) {
        if (_Keys[index].indexOf("@".concat("com.sap.vocabularies.Common.v1.SemanticObject")) === 0 && _Keys[index].indexOf("@".concat("com.sap.vocabularies.Common.v1.SemanticObjectMapping")) === -1 && _Keys[index].indexOf("@".concat("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")) === -1) {
          regexResult = /#(.*)/.exec(_Keys[index]);
          sQualifier = regexResult ? regexResult[1] : "";

          _aSemanticObjectsPromises.push(CommonUtils.getSemanticObjectPromise(_oAppComponent, _oView, _oMetaModel, sPath, sQualifier));
        }
      }
    }
  }

  function fnGetSemanticTargetsFromPageModel(oController, sPageModel) {
    var _fnfindValuesHelper = function (obj, key, list) {
      if (!obj) {
        return list;
      }

      if (obj instanceof Array) {
        for (var i in obj) {
          list = list.concat(_fnfindValuesHelper(obj[i], key, []));
        }

        return list;
      }

      if (obj[key]) {
        list.push(obj[key]);
      }

      if (typeof obj == "object" && obj !== null) {
        var children = Object.keys(obj);

        if (children.length > 0) {
          for (var _i = 0; _i < children.length; _i++) {
            list = list.concat(_fnfindValuesHelper(obj[children[_i]], key, []));
          }
        }
      }

      return list;
    };

    var _fnfindValues = function (obj, key) {
      return _fnfindValuesHelper(obj, key, []);
    };

    var _fnDeleteDuplicateSemanticObjects = function (aSemanticObjectPath) {
      return aSemanticObjectPath.filter(function (value, index) {
        return aSemanticObjectPath.indexOf(value) === index;
      });
    };

    var oView = oController.getView();
    var oInternalModelContext = oView.getBindingContext("internal");

    if (oInternalModelContext) {
      var aSemanticObjectsPromises = [];
      var oComponent = oController.getOwnerComponent();
      var oAppComponent = Component.getOwnerComponentFor(oComponent);
      var oMetaModel = oAppComponent.getMetaModel();
      var oPageModel = oComponent.getModel(sPageModel).getData();

      if (JSON.stringify(oPageModel) === "{}") {
        oPageModel = oComponent.getModel(sPageModel)._getObject("/", undefined);
      }

      var aSemanticObjectsFound = _fnfindValues(oPageModel, "semanticObjectPath");

      aSemanticObjectsFound = _fnDeleteDuplicateSemanticObjects(aSemanticObjectsFound);
      var oShellServiceHelper = CommonUtils.getShellServices(oAppComponent);
      var sCurrentHash = CommonUtils.getHash();
      var aSemanticObjectsForGetLinks = [];
      var aSemanticObjects = [];

      var _oSemanticObject;

      if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
        // sCurrentHash can contain query string, cut it off!
        sCurrentHash = sCurrentHash.split("?")[0];
      }

      fnPrepareSemanticObjectsPromises(oAppComponent, oView, oMetaModel, aSemanticObjectsFound, aSemanticObjectsPromises);

      if (aSemanticObjectsPromises.length === 0) {
        return Promise.resolve();
      } else {
        Promise.all(aSemanticObjectsPromises).then(function (aValues) {
          var aGetLinksPromises = [];
          var sSemObjExpression;
          var aSemanticObjectsResolved = aValues.filter(function (element) {
            if (element.semanticObject !== undefined && element.semanticObject.semanticObject && typeof element.semanticObject.semanticObject === "object") {
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
                semanticObject: _oSemanticObject.semanticObject.semanticObject,
                unavailableActions: _oSemanticObject.unavailableActions,
                path: aSemanticObjectsResolved[j].semanticObjectPath
              });
              aGetLinksPromises.push(oShellServiceHelper.getLinksWithCache([_oSemanticObject.semanticObjectForGetLinks]));
            }
          }

          return CommonUtils.updateSemanticTargets(aGetLinksPromises, aSemanticObjects, oInternalModelContext, sCurrentHash);
        }).catch(function (oError) {
          Log.error("fnGetSemanticTargetsFromTable: Cannot get Semantic Objects", oError);
        });
      }
    } else {
      return Promise.resolve();
    }
  }

  function getFilterRestrictions(oFilterRestrictionsAnnotation, sRestriction) {
    var FilterRestrictions = CommonUtils.FilterRestrictions;

    if (sRestriction === FilterRestrictions.REQUIRED_PROPERTIES || sRestriction === FilterRestrictions.NON_FILTERABLE_PROPERTIES) {
      var aProps = [];

      if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation[sRestriction]) {
        aProps = oFilterRestrictionsAnnotation[sRestriction].map(function (oProperty) {
          return oProperty.$PropertyPath;
        });
      }

      return aProps;
    } else if (sRestriction === FilterRestrictions.ALLOWED_EXPRESSIONS) {
      var mAllowedExpressions = {};

      if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation.FilterExpressionRestrictions) {
        oFilterRestrictionsAnnotation.FilterExpressionRestrictions.forEach(function (oProperty) {
          //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
          if (mAllowedExpressions[oProperty.Property.$PropertyPath]) {
            mAllowedExpressions[oProperty.Property.$PropertyPath].push(oProperty.AllowedExpressions);
          } else {
            mAllowedExpressions[oProperty.Property.$PropertyPath] = [oProperty.AllowedExpressions];
          }
        });
      }

      return mAllowedExpressions;
    } // Default return the FilterRestrictions Annotation


    return oFilterRestrictionsAnnotation;
  }

  function _fetchPropertiesForNavPath(paths, navPath, props) {
    var navPathPrefix = navPath + "/";
    return paths.reduce(function (outPaths, pathToCheck) {
      if (pathToCheck.startsWith(navPathPrefix)) {
        var outPath = pathToCheck.replace(navPathPrefix, "");

        if (outPaths.indexOf(outPath) === -1) {
          outPaths.push(outPath);
        }
      }

      return outPaths;
    }, props);
  }

  function getFilterRestrictionsByPath(entityPath, oMetaModel) {
    var oRet = {},
        FR = CommonUtils.FilterRestrictions;
    var oFilterRestrictions;
    var navigationText = "$NavigationPropertyBinding";
    var frTerm = "@Org.OData.Capabilities.V1.FilterRestrictions";
    var entityTypePathParts = entityPath.replaceAll("%2F", "/").split("/").filter(ModelHelper.filterOutNavPropBinding);
    var entityTypePath = "/".concat(entityTypePathParts.join("/"), "/");
    var entitySetPath = ModelHelper.getEntitySetPath(entityPath, oMetaModel);
    var entitySetPathParts = entitySetPath.split("/").filter(ModelHelper.filterOutNavPropBinding);
    var isContainment = oMetaModel.getObject("".concat(entityTypePath, "$ContainsTarget"));
    var containmentNavPath = isContainment && entityTypePathParts[entityTypePathParts.length - 1]; //LEAST PRIORITY - Filter restrictions directly at Entity Set
    //e.g. FR in "NS.EntityContainer/SalesOrderManage" ContextPath: /SalesOrderManage

    if (!isContainment) {
      oFilterRestrictions = oMetaModel.getObject("".concat(entitySetPath).concat(frTerm));
      oRet[FR.REQUIRED_PROPERTIES] = getFilterRestrictions(oFilterRestrictions, FR.REQUIRED_PROPERTIES) || [];
      var resultContextCheck = oMetaModel.getObject("".concat(entityTypePath, "@com.sap.vocabularies.Common.v1.ResultContext"));

      if (!resultContextCheck) {
        oRet[FR.NON_FILTERABLE_PROPERTIES] = getFilterRestrictions(oFilterRestrictions, FR.NON_FILTERABLE_PROPERTIES) || [];
      } //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression


      oRet[FR.ALLOWED_EXPRESSIONS] = getFilterRestrictions(oFilterRestrictions, FR.ALLOWED_EXPRESSIONS) || {};
    }

    if (entityTypePathParts.length > 1) {
      var navPath = isContainment ? containmentNavPath : entitySetPathParts[entitySetPathParts.length - 1]; // In case of containment we take entitySet provided as parent. And in case of normal we would remove the last navigation from entitySetPath.

      var parentEntitySetPath = isContainment ? entitySetPath : "/".concat(entitySetPathParts.slice(0, -1).join("/".concat(navigationText, "/"))); //THIRD HIGHEST PRIORITY - Reading property path restrictions - Annotation at main entity but directly on navigation property path
      //e.g. Parent Customer with PropertyPath="Set/CityName" ContextPath: Customer/Set

      var oParentRet = {};

      if (!navPath.includes("%2F")) {
        var oParentFR = oMetaModel.getObject("".concat(parentEntitySetPath).concat(frTerm));
        oRet[FR.REQUIRED_PROPERTIES] = _fetchPropertiesForNavPath(getFilterRestrictions(oParentFR, FR.REQUIRED_PROPERTIES) || [], navPath, oRet[FR.REQUIRED_PROPERTIES] || []);
        oRet[FR.NON_FILTERABLE_PROPERTIES] = _fetchPropertiesForNavPath(getFilterRestrictions(oParentFR, FR.NON_FILTERABLE_PROPERTIES) || [], navPath, oRet[FR.NON_FILTERABLE_PROPERTIES] || []); //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

        var completeAllowedExps = getFilterRestrictions(oParentFR, FR.ALLOWED_EXPRESSIONS) || {};
        oParentRet[FR.ALLOWED_EXPRESSIONS] = Object.keys(completeAllowedExps).reduce(function (outProp, propPath) {
          if (propPath.startsWith(navPath + "/")) {
            var outPropPath = propPath.replace(navPath + "/", "");
            outProp[outPropPath] = completeAllowedExps[propPath];
          }

          return outProp;
        }, {});
      } //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression


      oRet[FR.ALLOWED_EXPRESSIONS] = mergeObjects({}, oRet[FR.ALLOWED_EXPRESSIONS], oParentRet[FR.ALLOWED_EXPRESSIONS] || {}); //SECOND HIGHEST priority - Navigation restrictions
      //e.g. Parent "/Customer" with NavigationPropertyPath="Set" ContextPath: Customer/Set

      var oNavRestrictions = CommonUtils.getNavigationRestrictions(oMetaModel, parentEntitySetPath, navPath.replaceAll("%2F", "/"));
      var oNavFilterRest = oNavRestrictions && oNavRestrictions["FilterRestrictions"];
      var navResReqProps = getFilterRestrictions(oNavFilterRest, FR.REQUIRED_PROPERTIES) || [];
      oRet[FR.REQUIRED_PROPERTIES] = uniqueSort(oRet[FR.REQUIRED_PROPERTIES].concat(navResReqProps));
      var navNonFilterProps = getFilterRestrictions(oNavFilterRest, FR.NON_FILTERABLE_PROPERTIES) || [];
      oRet[FR.NON_FILTERABLE_PROPERTIES] = uniqueSort(oRet[FR.NON_FILTERABLE_PROPERTIES].concat(navNonFilterProps)); //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

      oRet[FR.ALLOWED_EXPRESSIONS] = mergeObjects({}, oRet[FR.ALLOWED_EXPRESSIONS], getFilterRestrictions(oNavFilterRest, FR.ALLOWED_EXPRESSIONS) || {}); //HIGHEST priority - Restrictions having target with navigation association entity
      // e.g. FR in "CustomerParameters/Set" ContextPath: "Customer/Set"

      var navAssociationEntityRest = oMetaModel.getObject("/".concat(entityTypePathParts.join("/")).concat(frTerm));
      var navAssocReqProps = getFilterRestrictions(navAssociationEntityRest, FR.REQUIRED_PROPERTIES) || [];
      oRet[FR.REQUIRED_PROPERTIES] = uniqueSort(oRet[FR.REQUIRED_PROPERTIES].concat(navAssocReqProps));
      var navAssocNonFilterProps = getFilterRestrictions(navAssociationEntityRest, FR.NON_FILTERABLE_PROPERTIES) || [];
      oRet[FR.NON_FILTERABLE_PROPERTIES] = uniqueSort(oRet[FR.NON_FILTERABLE_PROPERTIES].concat(navAssocNonFilterProps)); //SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

      oRet[FR.ALLOWED_EXPRESSIONS] = mergeObjects({}, oRet[FR.ALLOWED_EXPRESSIONS], getFilterRestrictions(navAssociationEntityRest, FR.ALLOWED_EXPRESSIONS) || {});
    }

    return oRet;
  }

  function templateControlFragment(sFragmentName, oPreprocessorSettings, oOptions, oModifier) {
    oOptions = oOptions || {};

    if (oModifier) {
      return oModifier.templateControlFragment(sFragmentName, oPreprocessorSettings, oOptions.view).then(function (oFragment) {
        // This is required as Flex returns an HTMLCollection as templating result in XML time.
        return oModifier.targets === "xmlTree" && oFragment.length > 0 ? oFragment[0] : oFragment;
      });
    } else {
      return loadMacroLibrary().then(function () {
        return XMLPreprocessor.process(XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"), {
          name: sFragmentName
        }, oPreprocessorSettings);
      }).then(function (oFragment) {
        var oControl = oFragment.firstElementChild;

        if (!!oOptions.isXML && oControl) {
          return oControl;
        }

        return Fragment.load({
          id: oOptions.id,
          definition: oFragment,
          controller: oOptions.controller
        });
      });
    }
  }

  function getSingletonPath(path, metaModel) {
    var parts = path.split("/").filter(Boolean),
        propertyName = parts.pop(),
        navigationPath = parts.join("/"),
        entitySet = navigationPath && metaModel.getObject("/".concat(navigationPath));

    if ((entitySet === null || entitySet === void 0 ? void 0 : entitySet.$kind) === "Singleton") {
      var singletonName = parts[parts.length - 1];
      return "/".concat(singletonName, "/").concat(propertyName);
    }

    return undefined;
  }

  function requestSingletonProperty(path, model) {
    if (!path || !model) {
      return Promise.resolve(null);
    }

    var metaModel = model.getMetaModel(); // Find the underlying entity set from the property path and check whether it is a singleton.

    var resolvedPath = getSingletonPath(path, metaModel);

    if (resolvedPath) {
      var propertyBinding = model.bindProperty(resolvedPath);
      return propertyBinding.requestValue();
    }

    return Promise.resolve(null);
  }

  function addEventToBindingInfo(oControl, sEventName, fHandler) {
    var oBindingInfo;

    var setBindingInfo = function () {
      if (oBindingInfo) {
        if (!oBindingInfo.events) {
          oBindingInfo.events = {};
        }

        if (!oBindingInfo.events[sEventName]) {
          oBindingInfo.events[sEventName] = fHandler;
        } else {
          var fOriginalHandler = oBindingInfo.events[sEventName];

          oBindingInfo.events[sEventName] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            fHandler.apply.apply(fHandler, [this].concat(args));
            fOriginalHandler.apply.apply(fOriginalHandler, [this].concat(args));
          };
        }
      }
    };

    if (oControl.isA("sap.ui.mdc.Chart")) {
      oControl.innerChartBound().then(function () {
        oBindingInfo = oControl.getControlDelegate()._getChart(oControl).getBindingInfo("data");
        setBindingInfo();
      }).catch(function (sError) {
        Log.error(sError);
      });
    } else {
      oBindingInfo = oControl.data("rowsBindingInfo");
      setBindingInfo();
    }
  }

  function loadMacroLibrary() {
    return new Promise(function (resolve) {
      sap.ui.require(["sap/fe/macros/macroLibrary"], function
        /*macroLibrary*/
      () {
        resolve();
      });
    });
  } // Get the path for action parameters that is needed to read the annotations


  function getParameterPath(sPath, sParameter) {
    var sContext;

    if (sPath.indexOf("@$ui5.overload") > -1) {
      sContext = sPath.split("@$ui5.overload")[0];
    } else {
      // For Unbound Actions in Action Parameter Dialogs
      var aAction = sPath.split("/0")[0].split(".");
      sContext = "/".concat(aAction[aAction.length - 1], "/");
    }

    return sContext + sParameter;
  }
  /**
   * Get resolved expression binding used for texts at runtime.
   *
   * @param expBinding
   * @param control
   * @function
   * @static
   * @memberof sap.fe.core.CommonUtils
   * @returns A string after resolution.
   * @ui5-restricted
   */


  function _fntranslatedTextFromExpBindingString(expBinding, control) {
    // The idea here is to create dummy element with the expresion binding.
    // Adding it as dependent to the view/control would propagate all the models to the dummy element and resolve the binding.
    // We remove the dummy element after that and destroy it.
    var anyResourceText = new AnyElement({
      anyText: expBinding
    });
    control.addDependent(anyResourceText);
    var resultText = anyResourceText.getAnyText();
    control.removeDependent(anyResourceText);
    anyResourceText.destroy();
    return resultText;
  }

  var CommonUtils = {
    isPropertyFilterable: isPropertyFilterable,
    isFieldControlPathInapplicable: isFieldControlPathInapplicable,
    removeSensitiveData: removeSensitiveData,
    fireButtonPress: fnFireButtonPress,
    getTargetView: getTargetView,
    getCurrentPageView: getCurrentPageView,
    hasTransientContext: fnHasTransientContexts,
    updateRelatedAppsDetails: fnUpdateRelatedAppsDetails,
    resolveStringtoBoolean: fnResolveStringtoBoolean,
    getAppComponent: getAppComponent,
    getMandatoryFilterFields: fnGetMandatoryFilterFields,
    getContextPathProperties: fnGetContextPathProperties,
    getParameterInfo: getParameterInfo,
    updateDataFieldForIBNButtonsVisibility: fnUpdateDataFieldForIBNButtonsVisibility,
    getTranslatedText: getTranslatedText,
    getEntitySetName: getEntitySetName,
    getActionPath: getActionPath,
    computeDisplayMode: computeDisplayMode,
    isStickyEditMode: isStickyEditMode,
    getOperatorsForProperty: getOperatorsForProperty,
    getOperatorsForDateProperty: getOperatorsForDateProperty,
    getOperatorsForGuidProperty: getOperatorsForGuidProperty,
    addSelectionVariantToConditions: addSelectionVariantToConditions,
    addExternalStateFiltersToSelectionVariant: addExternalStateFiltersToSelectionVariant,
    addPageContextToSelectionVariant: addPageContextToSelectionVariant,
    addDefaultDisplayCurrency: addDefaultDisplayCurrency,
    getNonComputedVisibleFields: getNonComputedVisibleFields,
    setUserDefaults: setUserDefaults,
    getShellServices: getShellServices,
    getHash: getHash,
    getIBNActions: fnGetIBNActions,
    getHeaderFacetItemConfigForExternalNavigation: getHeaderFacetItemConfigForExternalNavigation,
    getSemanticObjectMapping: getSemanticObjectMapping,
    setSemanticObjectMappings: setSemanticObjectMappings,
    getSemanticObjectPromise: fnGetSemanticObjectPromise,
    getSemanticTargetsFromPageModel: fnGetSemanticTargetsFromPageModel,
    getSemanticObjectsFromPath: fnGetSemanticObjectsFromPath,
    updateSemanticTargets: fnUpdateSemanticTargetsModel,
    getPropertyDataType: getPropertyDataType,
    getNavigationRestrictions: getNavigationRestrictions,
    getSearchRestrictions: getSearchRestrictions,
    getFilterRestrictionsByPath: getFilterRestrictionsByPath,
    getSpecificAllowedExpression: getSpecificAllowedExpression,
    getAdditionalParamsForCreate: getAdditionalParamsForCreate,
    requestSingletonProperty: requestSingletonProperty,
    templateControlFragment: templateControlFragment,
    addEventToBindingInfo: addEventToBindingInfo,
    FilterRestrictions: {
      REQUIRED_PROPERTIES: "RequiredProperties",
      NON_FILTERABLE_PROPERTIES: "NonFilterableProperties",
      ALLOWED_EXPRESSIONS: "FilterAllowedExpressions"
    },
    AllowedExpressionsPrio: ["SingleValue", "MultiValue", "SingleRange", "MultiRange", "SearchExpression", "MultiRangeOrSearchExpression"],
    normalizeSearchTerm: normalizeSearchTerm,
    getSingletonPath: getSingletonPath,
    getRequiredPropertiesFromUpdateRestrictions: getRequiredPropertiesFromUpdateRestrictions,
    getRequiredPropertiesFromInsertRestrictions: getRequiredPropertiesFromInsertRestrictions,
    hasRestrictedPropertiesInAnnotations: hasRestrictedPropertiesInAnnotations,
    getRequiredPropertiesFromAnnotations: getRequiredPropertiesFromAnnotations,
    getRequiredProperties: getRequiredProperties,
    checkIfResourceKeyExists: checkIfResourceKeyExists,
    setContextsBasedOnOperationAvailable: setContextsBasedOnOperationAvailable,
    setDynamicActionContexts: setDynamicActionContexts,
    requestProperty: requestProperty,
    getParameterPath: getParameterPath,
    getRelatedAppsMenuItems: _getRelatedAppsMenuItems,
    getTranslatedTextFromExpBindingString: _fntranslatedTextFromExpBindingString,
    addSemanticDatesToConditions: addSemanticDatesToConditions,
    addSelectOptionToConditions: addSelectOptionToConditions,
    createSemanticDatesFromConditions: createSemanticDatesFromConditions,
    updateRelateAppsModel: updateRelateAppsModel,
    getSemanticObjectAnnotations: _getSemanticObjectAnnotations
  };
  return CommonUtils;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiYXJyYXkiLCJjaGVjayIsImkiLCJwYWN0IiwicmVqZWN0IiwiX2N5Y2xlIiwibGVuZ3RoIiwidiIsImJpbmQiLCJ0aGVuYWJsZSIsInMiLCJwcm90b3R5cGUiLCJvbkZ1bGZpbGxlZCIsIm9uUmVqZWN0ZWQiLCJzdGF0ZSIsImNhbGxiYWNrIiwibyIsIl90aGlzIiwidmFsdWUiLCJvYnNlcnZlciIsInVwZGF0ZVJlbGF0ZUFwcHNNb2RlbCIsIm9CaW5kaW5nQ29udGV4dCIsIm9FbnRyeSIsIm9PYmplY3RQYWdlTGF5b3V0IiwiYVNlbUtleXMiLCJvTWV0YU1vZGVsIiwib01ldGFQYXRoIiwib1NoZWxsU2VydmljZUhlbHBlciIsImdldFNoZWxsU2VydmljZXMiLCJvUGFyYW0iLCJzQ3VycmVudFNlbU9iaiIsInNDdXJyZW50QWN0aW9uIiwib1NlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMiLCJhUmVsYXRlZEFwcHNNZW51SXRlbXMiLCJhRXhjbHVkZWRBY3Rpb25zIiwiZm5HZXRQYXJzZVNoZWxsSGFzaEFuZEdldExpbmtzIiwib1BhcnNlZFVybCIsInBhcnNlU2hlbGxIYXNoIiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsImhhc2giLCJzZW1hbnRpY09iamVjdCIsImFjdGlvbiIsIl9nZXRTT0ludGVudHMiLCJhTWFuaWZlc3RTT0tleXMiLCJhTGlua3MiLCJpc1NlbWFudGljT2JqZWN0SGFzU2FtZVRhcmdldEluTWFuaWZlc3QiLCJvVGFyZ2V0UGFyYW1zIiwiYUFubm90YXRpb25zU09JdGVtcyIsInNFbnRpdHlTZXRQYXRoIiwic0VudGl0eVR5cGVQYXRoIiwib0VudGl0eVNldEFubm90YXRpb25zIiwiZ2V0T2JqZWN0IiwiQ29tbW9uVXRpbHMiLCJnZXRTZW1hbnRpY09iamVjdEFubm90YXRpb25zIiwiYkhhc0VudGl0eVNldFNPIiwib0VudGl0eVR5cGVBbm5vdGF0aW9ucyIsImFVbmF2YWlsYWJsZUFjdGlvbnMiLCJwdXNoIiwibmF2aWdhdGlvbkNvbnRleHRzIiwic2VtYW50aWNPYmplY3RNYXBwaW5nIiwiYU1hcHBpbmdzIiwiX2dldFJlbGF0ZWRBcHBzTWVudUl0ZW1zIiwiYU1hbmlmZXN0U09JdGVtcyIsImZvckVhY2giLCJ0YXJnZXRTZW1PYmplY3QiLCJvTWFuaWZlc3REYXRhIiwiYWRkaXRpb25hbFNlbWFudGljT2JqZWN0cyIsImFsbG93ZWRBY3Rpb25zIiwiY29uY2F0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJzZXRQcm9wZXJ0eSIsImoiLCJzU2VtS2V5IiwiJFByb3BlcnR5UGF0aCIsImFUZWNobmljYWxLZXlzIiwia2V5Iiwic09iaktleSIsImdldFRhcmdldFZpZXciLCJnZXRWaWV3RGF0YSIsInNlbWFudGljT2JqZWN0SW50ZW50cyIsIk9iamVjdCIsImtleXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIl9nZXRSZWxhdGVkSW50ZW50cyIsImVycm9yIiwiTG9nIiwiYVZhbGlkVHlwZXMiLCJub3JtYWxpemVTZWFyY2hUZXJtIiwic1NlYXJjaFRlcm0iLCJ1bmRlZmluZWQiLCJyZXBsYWNlIiwic3BsaXQiLCJyZWR1Y2UiLCJzTm9ybWFsaXplZCIsInNDdXJyZW50V29yZCIsImdldFByb3BlcnR5RGF0YVR5cGUiLCJvTmF2aWdhdGlvbkNvbnRleHQiLCJzRGF0YVR5cGUiLCJnZXRQcm9wZXJ0eSIsInNBbm5vdGF0aW9uUGF0aCIsImluZGV4T2YiLCJmbkhhc1RyYW5zaWVudENvbnRleHRzIiwib0xpc3RCaW5kaW5nIiwiYkhhc1RyYW5zaWVudENvbnRleHRzIiwiZ2V0Q3VycmVudENvbnRleHRzIiwib0NvbnRleHQiLCJpc1RyYW5zaWVudCIsImdldFNlYXJjaFJlc3RyaWN0aW9ucyIsInNGdWxsUGF0aCIsIm9TZWFyY2hSZXN0cmljdGlvbnMiLCJvTmF2aWdhdGlvblNlYXJjaFJlc3RyaWN0aW9ucyIsIm5hdmlnYXRpb25UZXh0Iiwic2VhcmNoUmVzdHJpY3Rpb25zVGVybSIsImVudGl0eVR5cGVQYXRoUGFydHMiLCJyZXBsYWNlQWxsIiwiZmlsdGVyIiwiTW9kZWxIZWxwZXIiLCJmaWx0ZXJPdXROYXZQcm9wQmluZGluZyIsImVudGl0eVNldFBhdGgiLCJnZXRFbnRpdHlTZXRQYXRoIiwiZW50aXR5U2V0UGF0aFBhcnRzIiwiaXNDb250YWlubWVudCIsImpvaW4iLCJjb250YWlubWVudE5hdlBhdGgiLCJuYXZQYXRoIiwicGFyZW50RW50aXR5U2V0UGF0aCIsInNsaWNlIiwib05hdmlnYXRpb25SZXN0cmljdGlvbnMiLCJnZXROYXZpZ2F0aW9uUmVzdHJpY3Rpb25zIiwib01vZGVsIiwic05hdmlnYXRpb25QYXRoIiwiYVJlc3RyaWN0ZWRQcm9wZXJ0aWVzIiwiUmVzdHJpY3RlZFByb3BlcnRpZXMiLCJmaW5kIiwib1Jlc3RyaWN0ZWRQcm9wZXJ0eSIsIk5hdmlnYXRpb25Qcm9wZXJ0eSIsIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiX2lzSW5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcyIsInNDb250ZXh0UGF0aCIsImJJc05vdEZpbHRlcmFibGUiLCJvQW5ub3RhdGlvbiIsIk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzIiwic29tZSIsInByb3BlcnR5IiwiX2lzQ29udGV4dFBhdGhGaWx0ZXJhYmxlIiwic0NvbnRleFBhdGgiLCJhRVNQYXJ0cyIsInNwbGljZSIsImFDb250ZXh0Iiwic0NvbnRleHQiLCJpdGVtIiwiaW5kZXgiLCJvRmlsdGVyUmVzdHJpY3Rpb25zIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiYU5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzIiwic1RhcmdldFByb3BlcnR5UGF0aCIsIm9Qcm9wZXJ0eVBhdGgiLCJpc1Byb3BlcnR5RmlsdGVyYWJsZSIsInNQcm9wZXJ0eSIsImJTa2lwSGlkZGVuRmlsdGVyIiwiRXJyb3IiLCJiSXNGaWx0ZXJhYmxlIiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJzSGlkZGVuUGF0aCIsInNIaWRkZW5GaWx0ZXJQYXRoIiwiY29tcGlsZUV4cHJlc3Npb24iLCJub3QiLCJvciIsInBhdGhJbk1vZGVsIiwic1Byb3BlcnR5RGF0YVR5cGUiLCJvQ29udHJvbCIsImdldEFwcENvbXBvbmVudCIsImdldEhhc2giLCJzSGFzaCIsIndpbmRvdyIsIm9TZW1hbnRpY09iamVjdCIsImdldExpbmtzIiwicGFyYW1zIiwiX2NyZWF0ZU1hcHBpbmdzIiwib01hcHBpbmciLCJhU09NYXBwaW5ncyIsImFNYXBwaW5nS2V5cyIsIm9TZW1hbnRpY01hcHBpbmciLCJhSXRlbXMiLCJhQWxsb3dlZEFjdGlvbnMiLCJvTGluayIsInNJbnRlbnQiLCJpbnRlbnQiLCJzQWN0aW9uIiwiaW5jbHVkZXMiLCJ0ZXh0IiwidGFyZ2V0QWN0aW9uIiwidGFyZ2V0UGFyYW1zIiwib0FkZGl0aW9uYWxTZW1hbnRpY09iamVjdHMiLCJ1bmF2YWlsYWJsZUFjdGlvbnMiLCJtYXBwaW5nIiwiX2dldFNlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMiLCJvRW50aXR5QW5ub3RhdGlvbnMiLCJzQW5ub3RhdGlvbk1hcHBpbmdUZXJtIiwic0Fubm90YXRpb25BY3Rpb25UZXJtIiwic1F1YWxpZmllciIsImZuVXBkYXRlUmVsYXRlZEFwcHNEZXRhaWxzIiwiZ2V0TW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJvUGF0aCIsImdldFBhdGgiLCJnZXRNZXRhUGF0aCIsInNTZW1hbnRpY0tleVZvY2FidWxhcnkiLCJyZXF1ZXN0T2JqZWN0IiwicmVxdWVzdGVkT2JqZWN0IiwiY2F0Y2giLCJvRXJyb3IiLCJmbkZpcmVCdXR0b25QcmVzcyIsIm9CdXR0b24iLCJhQXV0aG9yaXplZFR5cGVzIiwiZ2V0TWV0YWRhdGEiLCJnZXROYW1lIiwiZ2V0VmlzaWJsZSIsImdldEVuYWJsZWQiLCJmaXJlUHJlc3MiLCJmblJlc29sdmVTdHJpbmd0b0Jvb2xlYW4iLCJzVmFsdWUiLCJpc0EiLCJvT3duZXIiLCJDb21wb25lbnQiLCJnZXRPd25lckNvbXBvbmVudEZvciIsImdldEN1cnJlbnRQYWdlVmlldyIsIm9BcHBDb21wb25lbnQiLCJyb290Vmlld0NvbnRyb2xsZXIiLCJnZXRSb290Vmlld0NvbnRyb2xsZXIiLCJpc0ZjbEVuYWJsZWQiLCJnZXRSaWdodG1vc3RWaWV3IiwiZ2V0Um9vdENvbnRhaW5lciIsImdldEN1cnJlbnRQYWdlIiwiZ2V0Q29tcG9uZW50SW5zdGFuY2UiLCJnZXRSb290Q29udHJvbCIsImdldFBhcmVudCIsImlzRmllbGRDb250cm9sUGF0aEluYXBwbGljYWJsZSIsInNGaWVsZENvbnRyb2xQYXRoIiwib0F0dHJpYnV0ZSIsImJJbmFwcGxpY2FibGUiLCJhUGFydHMiLCJoYXNPd25Qcm9wZXJ0eSIsInJlbW92ZVNlbnNpdGl2ZURhdGEiLCJhQXR0cmlidXRlcyIsImFPdXRBdHRyaWJ1dGVzIiwic0VudGl0eVNldCIsImVudGl0eVNldCIsImNvbnRleHREYXRhIiwiYVByb3BlcnRpZXMiLCJzUHJvcCIsImFQcm9wZXJ0eUFubm90YXRpb25zIiwib0ZpZWxkQ29udHJvbCIsIl9mbkNoZWNrSXNNYXRjaCIsIm9PYmplY3QiLCJvS2V5c1RvQ2hlY2siLCJzS2V5IiwiZm5HZXRDb250ZXh0UGF0aFByb3BlcnRpZXMiLCJvRmlsdGVyIiwib0VudGl0eVR5cGUiLCJvUHJvcGVydGllcyIsInRlc3QiLCIka2luZCIsImZuR2V0TWFuZGF0b3J5RmlsdGVyRmllbGRzIiwiYU1hbmRhdG9yeUZpbHRlckZpZWxkcyIsImZuR2V0SUJOQWN0aW9ucyIsImFJQk5BY3Rpb25zIiwiYUFjdGlvbnMiLCJnZXRBY3Rpb25zIiwib0FjdGlvbiIsImdldEFjdGlvbiIsIm9NZW51IiwiZ2V0TWVudSIsImdldEl0ZW1zIiwib0l0ZW0iLCJkYXRhIiwiZm5VcGRhdGVEYXRhRmllbGRGb3JJQk5CdXR0b25zVmlzaWJpbGl0eSIsIm9WaWV3Iiwib1BhcmFtcyIsImZuR2V0TGlua3MiLCJvRGF0YSIsImFLZXlzIiwib0lCTkFjdGlvbiIsInNTZW1hbnRpY09iamVjdCIsImFMaW5rIiwic2V0VmlzaWJsZSIsImdldFRyYW5zbGF0ZWRUZXh0Iiwic0ZyYW1ld29ya0tleSIsIm9SZXNvdXJjZUJ1bmRsZSIsInNFbnRpdHlTZXROYW1lIiwic1Jlc291cmNlS2V5IiwiYlJlc291cmNlS2V5RXhpc3RzIiwiY2hlY2tJZlJlc291cmNlS2V5RXhpc3RzIiwiYUN1c3RvbUJ1bmRsZXMiLCJnZXRUZXh0IiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImhhc1RleHQiLCJnZXRBY3Rpb25QYXRoIiwiYlJldHVybk9ubHlQYXRoIiwic0FjdGlvbk5hbWUiLCJiQ2hlY2tTdGF0aWNWYWx1ZSIsInNFbnRpdHlUeXBlTmFtZSIsIiRUeXBlIiwic0VudGl0eU5hbWUiLCJnZXRFbnRpdHlTZXROYW1lIiwic0JpbmRpbmdQYXJhbWV0ZXIiLCJzRW50aXR5VHlwZSIsIm9FbnRpdHlDb250YWluZXIiLCJjb21wdXRlRGlzcGxheU1vZGUiLCJvUHJvcGVydHlBbm5vdGF0aW9ucyIsIm9Db2xsZWN0aW9uQW5ub3RhdGlvbnMiLCJvVGV4dEFubm90YXRpb24iLCJvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbiIsIiRFbnVtTWVtYmVyIiwiX2dldEVudGl0eVR5cGUiLCJfcmVxdWVzdE9iamVjdCIsIm9TZWxlY3RlZENvbnRleHQiLCJuQnJhY2tldEluZGV4Iiwic1RhcmdldFR5cGUiLCJzQ3VycmVudFR5cGUiLCJnZXRCaW5kaW5nIiwiZ2V0Q29udGV4dCIsIndhcm5pbmciLCJyZXF1ZXN0UHJvcGVydHkiLCJzRHluYW1pY0FjdGlvbkVuYWJsZWRQYXRoIiwib1Byb21pc2UiLCJyZXF1ZXN0U2luZ2xldG9uUHJvcGVydHkiLCJ2UHJvcGVydHlWYWx1ZSIsInNldENvbnRleHRzQmFzZWRPbk9wZXJhdGlvbkF2YWlsYWJsZSIsIm9JbnRlcm5hbE1vZGVsQ29udGV4dCIsImFSZXF1ZXN0UHJvbWlzZXMiLCJhbGwiLCJhUmVzdWx0cyIsImFBcHBsaWNhYmxlQ29udGV4dHMiLCJhTm90QXBwbGljYWJsZUNvbnRleHRzIiwiYVJlc3VsdCIsInNldER5bmFtaWNBY3Rpb25Db250ZXh0cyIsInRyYWNlIiwiYUFwcGxpY2FibGUiLCJhTm90QXBwbGljYWJsZSIsInNEeW5hbWljQWN0aW9uUGF0aFByZWZpeCIsIm9JbnRlcm5hbE1vZGVsIiwiX2dldERlZmF1bHRPcGVyYXRvcnMiLCJzUHJvcGVydHlUeXBlIiwib0RhdGFDbGFzcyIsIlR5cGVVdGlsIiwiZ2V0RGF0YVR5cGVDbGFzc05hbWUiLCJvQmFzZVR5cGUiLCJnZXRCYXNlVHlwZSIsIkZpbHRlck9wZXJhdG9yVXRpbCIsImdldE9wZXJhdG9yc0ZvclR5cGUiLCJfZ2V0UmVzdHJpY3Rpb25zIiwiYURlZmF1bHRPcHMiLCJhRXhwcmVzc2lvbk9wcyIsImFPcGVyYXRvcnMiLCJzRWxlbWVudCIsInRvU3RyaW5nIiwiZ2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbiIsImFFeHByZXNzaW9ucyIsImFBbGxvd2VkRXhwcmVzc2lvbnNQcmlvcml0eSIsIkFsbG93ZWRFeHByZXNzaW9uc1ByaW8iLCJzb3J0IiwiYSIsImIiLCJnZXRPcGVyYXRvcnNGb3JQcm9wZXJ0eSIsInNUeXBlIiwiYlVzZVNlbWFudGljRGF0ZVJhbmdlIiwic1NldHRpbmdzIiwiZ2V0RmlsdGVyUmVzdHJpY3Rpb25zQnlQYXRoIiwiYUVxdWFsc09wcyIsImFTaW5nbGVSYW5nZU9wcyIsImFTaW5nbGVSYW5nZURUQmFzaWNPcHMiLCJhU2luZ2xlVmFsdWVEYXRlT3BzIiwiYUJhc2ljRGF0ZVRpbWVPcHMiLCJhTXVsdGlSYW5nZU9wcyIsImFTZWFyY2hFeHByZXNzaW9uT3BzIiwiYVNlbWFudGljRGF0ZU9wc0V4dCIsIlNlbWFudGljRGF0ZU9wZXJhdG9ycyIsImdldFN1cHBvcnRlZE9wZXJhdGlvbnMiLCJiU2VtYW50aWNEYXRlUmFuZ2UiLCJhU2VtYW50aWNEYXRlT3BzIiwib1NldHRpbmdzIiwiSlNPTiIsInBhcnNlIiwiY3VzdG9tRGF0YSIsIm9wZXJhdG9yQ29uZmlndXJhdGlvbiIsImdldEZpbHRlck9wZXJhdGlvbnMiLCJnZXRTZW1hbnRpY0RhdGVPcGVyYXRpb25zIiwiYURlZmF1bHRPcGVyYXRvcnMiLCJzUmVzdHJpY3Rpb25zIiwiRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zIiwic0FsbG93ZWRFeHByZXNzaW9uIiwiYVNpbmdsZVZhbHVlT3BzIiwic09wZXJhdG9ycyIsImdldE9wZXJhdG9yc0Zvckd1aWRQcm9wZXJ0eSIsImFsbG93ZWRPcGVyYXRvcnNGb3JHdWlkIiwiZ2V0T3BlcmF0b3JzRm9yRGF0ZVByb3BlcnR5IiwicHJvcGVydHlUeXBlIiwiZ2V0UGFyYW1ldGVySW5mbyIsInNQYXJhbWV0ZXJDb250ZXh0UGF0aCIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwiYlJlc3VsdENvbnRleHQiLCJvUGFyYW1ldGVySW5mbyIsImNvbnRleHRQYXRoIiwicGFyYW1ldGVyUHJvcGVydGllcyIsImdldENvbnRleHRQYXRoUHJvcGVydGllcyIsImFkZFNlbGVjdE9wdGlvblRvQ29uZGl0aW9ucyIsIm9Qcm9wZXJ0eU1ldGFkYXRhIiwiYVZhbGlkT3BlcmF0b3JzIiwiYVNlbWFudGljRGF0ZU9wZXJhdG9ycyIsImFDdW11bGF0aXZlQ29uZGl0aW9ucyIsIm9TZWxlY3RPcHRpb24iLCJvQ29uZGl0aW9uIiwiZ2V0Q29uZGl0aW9ucyIsIlNlbWFudGljRGF0ZXMiLCJvcGVyYXRvciIsInNlbWFudGljRGF0ZXMiLCJhZGRTZW1hbnRpY0RhdGVzVG9Db25kaXRpb25zIiwib1NlbWFudGljRGF0ZXMiLCJ2YWx1ZXMiLCJoaWdoIiwibG93IiwiaXNFbXB0eSIsImFkZFNlbGVjdE9wdGlvbnNUb0NvbmRpdGlvbnMiLCJvU2VsZWN0aW9uVmFyaWFudCIsInNTZWxlY3RPcHRpb25Qcm9wIiwib0NvbmRpdGlvbnMiLCJzQ29uZGl0aW9uUGF0aCIsInNDb25kaXRpb25Qcm9wIiwib1ZhbGlkUHJvcGVydGllcyIsImlzUGFyYW1ldGVyIiwiYklzRkxQVmFsdWVQcmVzZW50Iiwib1ZpZXdEYXRhIiwiYUNvbmRpdGlvbnMiLCJhU2VsZWN0T3B0aW9ucyIsImdldFNlbGVjdE9wdGlvbiIsInNldHRpbmdzIiwiZ2V0RmlsdGVyQ29uZmlndXJhdGlvblNldHRpbmciLCJlbGVtZW50IiwiY3JlYXRlU2VtYW50aWNEYXRlc0Zyb21Db25kaXRpb25zIiwib0NvbmZpZyIsImNvbnRyb2xDb25maWd1cmF0aW9uIiwiZmlsdGVyQ29uZmlnIiwiZmlsdGVyRmllbGRzIiwiYWRkU2VsZWN0aW9uVmFyaWFudFRvQ29uZGl0aW9ucyIsImJJc0ZMUFZhbHVlcyIsImFTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcyIsImdldFNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzIiwiYU1ldGFkYXRQcm9wZXJ0aWVzIiwib1ZhbGlkUGFyYW1ldGVyUHJvcGVydGllcyIsImJIYXNQYXJhbWV0ZXJzIiwiYU1ldGFkYXRhUGFyYW1ldGVycyIsInNNZXRhZGF0YVBhcmFtZXRlciIsInNTZWxlY3RPcHRpb25OYW1lIiwic3RhcnRzV2l0aCIsInNNZXRhZGF0YVByb3BlcnR5Iiwic1NlbGVjdE9wdGlvbiIsInNSZXBsYWNlZE9wdGlvbiIsInNGdWxsQ29udGV4dFBhdGgiLCJfY3JlYXRlQ29uZGl0aW9uc0Zvck5hdlByb3BlcnRpZXMiLCJzTWFpbkVudGl0eVNldFBhdGgiLCJhTmF2T2JqZWN0TmFtZXMiLCJzTmF2UGF0aCIsInNQcm9wZXJ0eU5hbWUiLCIkaXNDb2xsZWN0aW9uIiwic05hdlByb3BlcnR5UGF0aCIsImFkZFBhZ2VDb250ZXh0VG9TZWxlY3Rpb25WYXJpYW50IiwibVBhZ2VDb250ZXh0Iiwib05hdmlnYXRpb25TZXJ2aWNlIiwiZ2V0TmF2aWdhdGlvblNlcnZpY2UiLCJtaXhBdHRyaWJ1dGVzQW5kU2VsZWN0aW9uVmFyaWFudCIsInRvSlNPTlN0cmluZyIsImFkZEV4dGVybmFsU3RhdGVGaWx0ZXJzVG9TZWxlY3Rpb25WYXJpYW50IiwibUZpbHRlcnMiLCJvVGFyZ2V0SW5mbyIsIm9GaWx0ZXJCYXIiLCJzRmlsdGVyIiwiZm5HZXRTaWduQW5kT3B0aW9uIiwic09wZXJhdG9yIiwic0xvd1ZhbHVlIiwic0hpZ2hWYWx1ZSIsIm9TZWxlY3RPcHRpb25TdGF0ZSIsIm9wdGlvbiIsInNpZ24iLCJvRmlsdGVyQ29uZGl0aW9ucyIsImZpbHRlckNvbmRpdGlvbnMiLCJvRmlsdGVyc1dpdGhvdXRDb25mbGljdCIsImZpbHRlckNvbmRpdGlvbnNXaXRob3V0Q29uZmxpY3QiLCJvVGFibGVQcm9wZXJ0aWVzV2l0aG91dENvbmZsaWN0IiwicHJvcGVydGllc1dpdGhvdXRDb25mbGljdCIsImFkZEZpbHRlcnNUb1NlbGVjdGlvblZhcmlhbnQiLCJzZWxlY3Rpb25WYXJpYW50Iiwic0ZpbHRlck5hbWUiLCJzUGF0aCIsIm9Qcm9wZXJ0eUluZm8iLCJnZXRQcm9wZXJ0eUhlbHBlciIsIm9UeXBlQ29uZmlnIiwidHlwZUNvbmZpZyIsIm9UeXBlVXRpbCIsImdldENvbnRyb2xEZWxlZ2F0ZSIsImdldFR5cGVVdGlsIiwib09wZXJhdG9yIiwiZ2V0T3BlcmF0b3IiLCJSYW5nZU9wZXJhdG9yIiwib01vZGVsRmlsdGVyIiwiZ2V0TW9kZWxGaWx0ZXIiLCJ0eXBlSW5zdGFuY2UiLCJiYXNlVHlwZSIsImFGaWx0ZXJzIiwiZXhjbHVkZSIsImV4dGVybmFsaXplVmFsdWUiLCJnZXRWYWx1ZTEiLCJnZXRWYWx1ZTIiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJhZGRTZWxlY3RPcHRpb24iLCJpc1N0aWNreUVkaXRNb2RlIiwiYklzU3RpY2t5TW9kZSIsImlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsImJVSUVkaXRhYmxlIiwiYWRkRGVmYXVsdERpc3BsYXlDdXJyZW5jeSIsIm9TZWxlY3Rpb25WYXJpYW50RGVmYXVsdHMiLCJhU1ZPcHRpb24iLCJhRGVmYXVsdFNWT3B0aW9uIiwiZGlzcGxheUN1cnJlbmN5U2VsZWN0T3B0aW9uIiwic1NpZ24iLCJzT3B0aW9uIiwic0xvdyIsInNIaWdoIiwiZ2V0Tm9uQ29tcHV0ZWRWaXNpYmxlRmllbGRzIiwiJEtleSIsImFOb25Db21wdXRlZFZpc2libGVGaWVsZHMiLCJhSW1tdXRhYmxlVmlzaWJsZUZpZWxkcyIsIm9Bbm5vdGF0aW9ucyIsImJJc0tleSIsImJJc0ltbXV0YWJsZSIsImJJc05vbkNvbXB1dGVkIiwiYklzVmlzaWJsZSIsImJJc0NvbXB1dGVkRGVmYXVsdFZhbHVlIiwiYklzS2V5Q29tcHV0ZWREZWZhdWx0VmFsdWVXaXRoVGV4dCIsIm9EaWFnbm9zdGljcyIsImdldERpYWdub3N0aWNzIiwic01lc3NhZ2UiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJBbm5vdGF0aW9uIiwiSXNzdWVTZXZlcml0eSIsIk1lZGl1bSIsIklzc3VlQ2F0ZWdvcnlUeXBlIiwiQW5ub3RhdGlvbnMiLCJJZ25vcmVkQW5ub3RhdGlvbiIsImFSZXF1aXJlZFByb3BlcnRpZXMiLCJnZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zIiwiZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzIiwiYkNoZWNrVXBkYXRlUmVzdHJpY3Rpb25zIiwiYVJlcXVpcmVkUHJvcGVydGllc1dpdGhQYXRocyIsImVuZHNXaXRoIiwib05hdlJlc3QiLCJoYXNSZXN0cmljdGVkUHJvcGVydGllc0luQW5ub3RhdGlvbnMiLCJSZXF1aXJlZFByb3BlcnRpZXMiLCJnZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tQW5ub3RhdGlvbnMiLCJvUmVxdWlyZWRQcm9wZXJ0eSIsImdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMiLCJiSXNOYXZpZ2F0aW9uUmVzdHJpY3Rpb25zIiwic2V0VXNlckRlZmF1bHRzIiwiYVBhcmFtZXRlcnMiLCJiSXNBY3Rpb24iLCJiSXNDcmVhdGUiLCJvQWN0aW9uRGVmYXVsdFZhbHVlcyIsIm9Db21wb25lbnREYXRhIiwiZ2V0Q29tcG9uZW50RGF0YSIsIm9TdGFydHVwUGFyYW1ldGVycyIsInN0YXJ0dXBQYXJhbWV0ZXJzIiwib1NoZWxsU2VydmljZXMiLCJoYXNVU2hlbGwiLCJvUGFyYW1ldGVyIiwiJE5hbWUiLCJzUGFyYW1ldGVyTmFtZSIsImdldFN0YXJ0dXBBcHBTdGF0ZSIsIm9TdGFydHVwQXBwU3RhdGUiLCJnZXREYXRhIiwiYUV4dGVuZGVkUGFyYW1ldGVycyIsIlNlbGVjdE9wdGlvbnMiLCJvRXh0ZW5kZWRQYXJhbWV0ZXIiLCJQcm9wZXJ0eU5hbWUiLCJvUmFuZ2UiLCJSYW5nZXMiLCJTaWduIiwiT3B0aW9uIiwiTG93IiwiZ2V0QWRkaXRpb25hbFBhcmFtc0ZvckNyZWF0ZSIsIm9JbmJvdW5kUGFyYW1ldGVycyIsIm9JbmJvdW5kcyIsImFDcmVhdGVQYXJhbWV0ZXJzIiwic1BhcmFtZXRlciIsInVzZUZvckNyZWF0ZSIsIm9SZXQiLCJzQ3JlYXRlUGFyYW1ldGVyIiwiYVZhbHVlcyIsImNyZWF0ZSIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsIm9PdXRib3VuZCIsImFTZW1hbnRpY09iamVjdE1hcHBpbmciLCJwYXJhbWV0ZXJzIiwic1BhcmFtIiwiZm9ybWF0IiwiZ2V0SGVhZGVyRmFjZXRJdGVtQ29uZmlnRm9yRXh0ZXJuYWxOYXZpZ2F0aW9uIiwib0Nyb3NzTmF2Iiwib0hlYWRlckZhY2V0SXRlbXMiLCJzSWQiLCJvQ29udHJvbENvbmZpZyIsImNvbmZpZyIsIm5hdmlnYXRpb24iLCJ0YXJnZXRPdXRib3VuZCIsIm91dGJvdW5kIiwic091dGJvdW5kIiwiZ2VuZXJhdGUiLCJzZXRTZW1hbnRpY09iamVjdE1hcHBpbmdzIiwidk1hcHBpbmdzIiwib01hcHBpbmdzIiwic0xvY2FsUHJvcGVydHkiLCJzU2VtYW50aWNPYmplY3RQcm9wZXJ0eSIsInJlbW92ZVNlbGVjdE9wdGlvbiIsIm1hc3NBZGRTZWxlY3RPcHRpb24iLCJmbkdldFNlbWFudGljT2JqZWN0c0Zyb21QYXRoIiwiYVNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zIiwiYVNlbWFudGljT2JqZWN0Rm9yR2V0TGlua3MiLCJzZW1hbnRpY09iamVjdFBhdGgiLCJzZW1hbnRpY09iamVjdEZvckdldExpbmtzIiwiZm5VcGRhdGVTZW1hbnRpY1RhcmdldHNNb2RlbCIsImFHZXRMaW5rc1Byb21pc2VzIiwiYVNlbWFudGljT2JqZWN0cyIsInNDdXJyZW50SGFzaCIsIl9vTGluayIsIl9zTGlua0ludGVudEFjdGlvbiIsImFGaW5hbExpbmtzIiwib0ZpbmFsU2VtYW50aWNPYmplY3RzIiwiYkludGVudEhhc0FjdGlvbnMiLCJrIiwib1RtcCIsInNBbHRlcm5hdGVQYXRoIiwiaGFzVGFyZ2V0c05vdEZpbHRlcmVkIiwiaGFzVGFyZ2V0cyIsImlMaW5rQ291bnQiLCJwYXRoIiwiSGFzVGFyZ2V0cyIsIkhhc1RhcmdldHNOb3RGaWx0ZXJlZCIsImFzc2lnbiIsInNTZW1hbnRpY09iamVjdE5hbWUiLCJtZXJnZU9iamVjdHMiLCJmbkdldFNlbWFudGljT2JqZWN0UHJvbWlzZSIsImdldFNlbWFudGljT2JqZWN0c0Zyb21QYXRoIiwiZm5QcmVwYXJlU2VtYW50aWNPYmplY3RzUHJvbWlzZXMiLCJfb0FwcENvbXBvbmVudCIsIl9vVmlldyIsIl9vTWV0YU1vZGVsIiwiX2FTZW1hbnRpY09iamVjdHNGb3VuZCIsIl9hU2VtYW50aWNPYmplY3RzUHJvbWlzZXMiLCJfS2V5cyIsInJlZ2V4UmVzdWx0IiwiZXhlYyIsImdldFNlbWFudGljT2JqZWN0UHJvbWlzZSIsImZuR2V0U2VtYW50aWNUYXJnZXRzRnJvbVBhZ2VNb2RlbCIsIm9Db250cm9sbGVyIiwic1BhZ2VNb2RlbCIsIl9mbmZpbmRWYWx1ZXNIZWxwZXIiLCJvYmoiLCJsaXN0IiwiQXJyYXkiLCJjaGlsZHJlbiIsIl9mbmZpbmRWYWx1ZXMiLCJfZm5EZWxldGVEdXBsaWNhdGVTZW1hbnRpY09iamVjdHMiLCJhU2VtYW50aWNPYmplY3RQYXRoIiwiZ2V0VmlldyIsImFTZW1hbnRpY09iamVjdHNQcm9taXNlcyIsIm9Db21wb25lbnQiLCJnZXRPd25lckNvbXBvbmVudCIsIm9QYWdlTW9kZWwiLCJzdHJpbmdpZnkiLCJfZ2V0T2JqZWN0IiwiYVNlbWFudGljT2JqZWN0c0ZvdW5kIiwiYVNlbWFudGljT2JqZWN0c0ZvckdldExpbmtzIiwiX29TZW1hbnRpY09iamVjdCIsInNTZW1PYmpFeHByZXNzaW9uIiwiYVNlbWFudGljT2JqZWN0c1Jlc29sdmVkIiwiJFBhdGgiLCJnZXRMaW5rc1dpdGhDYWNoZSIsInVwZGF0ZVNlbWFudGljVGFyZ2V0cyIsImdldEZpbHRlclJlc3RyaWN0aW9ucyIsIm9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uIiwic1Jlc3RyaWN0aW9uIiwiUkVRVUlSRURfUFJPUEVSVElFUyIsIk5PTl9GSUxURVJBQkxFX1BST1BFUlRJRVMiLCJhUHJvcHMiLCJtYXAiLCJvUHJvcGVydHkiLCJBTExPV0VEX0VYUFJFU1NJT05TIiwibUFsbG93ZWRFeHByZXNzaW9ucyIsIkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMiLCJQcm9wZXJ0eSIsIkFsbG93ZWRFeHByZXNzaW9ucyIsIl9mZXRjaFByb3BlcnRpZXNGb3JOYXZQYXRoIiwicGF0aHMiLCJwcm9wcyIsIm5hdlBhdGhQcmVmaXgiLCJvdXRQYXRocyIsInBhdGhUb0NoZWNrIiwib3V0UGF0aCIsImVudGl0eVBhdGgiLCJGUiIsImZyVGVybSIsImVudGl0eVR5cGVQYXRoIiwicmVzdWx0Q29udGV4dENoZWNrIiwib1BhcmVudFJldCIsIm9QYXJlbnRGUiIsImNvbXBsZXRlQWxsb3dlZEV4cHMiLCJvdXRQcm9wIiwicHJvcFBhdGgiLCJvdXRQcm9wUGF0aCIsIm9OYXZSZXN0cmljdGlvbnMiLCJvTmF2RmlsdGVyUmVzdCIsIm5hdlJlc1JlcVByb3BzIiwidW5pcXVlU29ydCIsIm5hdk5vbkZpbHRlclByb3BzIiwibmF2QXNzb2NpYXRpb25FbnRpdHlSZXN0IiwibmF2QXNzb2NSZXFQcm9wcyIsIm5hdkFzc29jTm9uRmlsdGVyUHJvcHMiLCJ0ZW1wbGF0ZUNvbnRyb2xGcmFnbWVudCIsInNGcmFnbWVudE5hbWUiLCJvUHJlcHJvY2Vzc29yU2V0dGluZ3MiLCJvT3B0aW9ucyIsIm9Nb2RpZmllciIsInZpZXciLCJvRnJhZ21lbnQiLCJ0YXJnZXRzIiwibG9hZE1hY3JvTGlicmFyeSIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJYTUxUZW1wbGF0ZVByb2Nlc3NvciIsImxvYWRUZW1wbGF0ZSIsIm5hbWUiLCJmaXJzdEVsZW1lbnRDaGlsZCIsImlzWE1MIiwiRnJhZ21lbnQiLCJsb2FkIiwiaWQiLCJkZWZpbml0aW9uIiwiY29udHJvbGxlciIsImdldFNpbmdsZXRvblBhdGgiLCJtZXRhTW9kZWwiLCJwYXJ0cyIsIkJvb2xlYW4iLCJwcm9wZXJ0eU5hbWUiLCJwb3AiLCJuYXZpZ2F0aW9uUGF0aCIsInNpbmdsZXRvbk5hbWUiLCJtb2RlbCIsInJlc29sdmVkUGF0aCIsInByb3BlcnR5QmluZGluZyIsImJpbmRQcm9wZXJ0eSIsInJlcXVlc3RWYWx1ZSIsImFkZEV2ZW50VG9CaW5kaW5nSW5mbyIsInNFdmVudE5hbWUiLCJmSGFuZGxlciIsIm9CaW5kaW5nSW5mbyIsInNldEJpbmRpbmdJbmZvIiwiZXZlbnRzIiwiZk9yaWdpbmFsSGFuZGxlciIsImFyZ3MiLCJhcHBseSIsImlubmVyQ2hhcnRCb3VuZCIsIl9nZXRDaGFydCIsImdldEJpbmRpbmdJbmZvIiwic0Vycm9yIiwic2FwIiwidWkiLCJyZXF1aXJlIiwiZ2V0UGFyYW1ldGVyUGF0aCIsImFBY3Rpb24iLCJfZm50cmFuc2xhdGVkVGV4dEZyb21FeHBCaW5kaW5nU3RyaW5nIiwiZXhwQmluZGluZyIsImNvbnRyb2wiLCJhbnlSZXNvdXJjZVRleHQiLCJBbnlFbGVtZW50IiwiYW55VGV4dCIsImFkZERlcGVuZGVudCIsInJlc3VsdFRleHQiLCJnZXRBbnlUZXh0IiwicmVtb3ZlRGVwZW5kZW50IiwiZGVzdHJveSIsImZpcmVCdXR0b25QcmVzcyIsImhhc1RyYW5zaWVudENvbnRleHQiLCJ1cGRhdGVSZWxhdGVkQXBwc0RldGFpbHMiLCJyZXNvbHZlU3RyaW5ndG9Cb29sZWFuIiwiZ2V0TWFuZGF0b3J5RmlsdGVyRmllbGRzIiwidXBkYXRlRGF0YUZpZWxkRm9ySUJOQnV0dG9uc1Zpc2liaWxpdHkiLCJnZXRJQk5BY3Rpb25zIiwiZ2V0U2VtYW50aWNUYXJnZXRzRnJvbVBhZ2VNb2RlbCIsImdldFJlbGF0ZWRBcHBzTWVudUl0ZW1zIiwiZ2V0VHJhbnNsYXRlZFRleHRGcm9tRXhwQmluZGluZ1N0cmluZyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiQ29tbW9uVXRpbHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uQW5ub3RhdGlvblRlcm1zIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tb25cIjtcbmltcG9ydCB0eXBlIFJlc291cmNlQnVuZGxlIGZyb20gXCJzYXAvYmFzZS9pMThuL1Jlc291cmNlQnVuZGxlXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCB1bmlxdWVTb3J0IGZyb20gXCJzYXAvYmFzZS91dGlsL2FycmF5L3VuaXF1ZVNvcnRcIjtcbmltcG9ydCBtZXJnZU9iamVjdHMgZnJvbSBcInNhcC9iYXNlL3V0aWwvbWVyZ2VcIjtcbmltcG9ydCB0eXBlIEFwcENvbXBvbmVudCBmcm9tIFwic2FwL2ZlL2NvcmUvQXBwQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5LCBJc3N1ZUNhdGVnb3J5VHlwZSwgSXNzdWVTZXZlcml0eSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5pbXBvcnQgdHlwZSB7IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcbmltcG9ydCB7IGNvbXBpbGVFeHByZXNzaW9uLCBub3QsIG9yLCBwYXRoSW5Nb2RlbCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgTW9kZWxIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvTW9kZWxIZWxwZXJcIjtcbmltcG9ydCBTZW1hbnRpY0RhdGVPcGVyYXRvcnMgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU2VtYW50aWNEYXRlT3BlcmF0b3JzXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5pbXBvcnQgeyBJU2hlbGxTZXJ2aWNlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9TaGVsbFNlcnZpY2VzRmFjdG9yeVwiO1xuaW1wb3J0IFR5cGVVdGlsIGZyb20gXCJzYXAvZmUvY29yZS90eXBlL1R5cGVVdGlsXCI7XG5pbXBvcnQgeyBzZW1hbnRpY0RhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcInNhcC9mZS9uYXZpZ2F0aW9uL1NlbGVjdGlvblZhcmlhbnRcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcInNhcC91aS9jb3JlL0NvbXBvbmVudFwiO1xuaW1wb3J0IHR5cGUgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IENvcmUgZnJvbSBcInNhcC91aS9jb3JlL0NvcmVcIjtcbmltcG9ydCBGcmFnbWVudCBmcm9tIFwic2FwL3VpL2NvcmUvRnJhZ21lbnRcIjtcbmltcG9ydCB0eXBlIFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgWE1MUHJlcHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS91dGlsL1hNTFByZXByb2Nlc3NvclwiO1xuaW1wb3J0IFhNTFRlbXBsYXRlUHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS9YTUxUZW1wbGF0ZVByb2Nlc3NvclwiO1xuaW1wb3J0IEZpbHRlck9wZXJhdG9yVXRpbCBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vRmlsdGVyT3BlcmF0b3JVdGlsXCI7XG5pbXBvcnQgUmFuZ2VPcGVyYXRvciBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vUmFuZ2VPcGVyYXRvclwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFWNENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNb2RlbFwiO1xuaW1wb3J0IEFueUVsZW1lbnQgZnJvbSBcIi4vY29udHJvbHMvQW55RWxlbWVudFwiO1xuaW1wb3J0IHsgZ2V0Q29uZGl0aW9ucyB9IGZyb20gXCIuL3RlbXBsYXRpbmcvRmlsdGVySGVscGVyXCI7XG5cbmNvbnN0IGFWYWxpZFR5cGVzID0gW1xuXHRcIkVkbS5Cb29sZWFuXCIsXG5cdFwiRWRtLkJ5dGVcIixcblx0XCJFZG0uRGF0ZVwiLFxuXHRcIkVkbS5EYXRlVGltZVwiLFxuXHRcIkVkbS5EYXRlVGltZU9mZnNldFwiLFxuXHRcIkVkbS5EZWNpbWFsXCIsXG5cdFwiRWRtLkRvdWJsZVwiLFxuXHRcIkVkbS5GbG9hdFwiLFxuXHRcIkVkbS5HdWlkXCIsXG5cdFwiRWRtLkludDE2XCIsXG5cdFwiRWRtLkludDMyXCIsXG5cdFwiRWRtLkludDY0XCIsXG5cdFwiRWRtLlNCeXRlXCIsXG5cdFwiRWRtLlNpbmdsZVwiLFxuXHRcIkVkbS5TdHJpbmdcIixcblx0XCJFZG0uVGltZVwiLFxuXHRcIkVkbS5UaW1lT2ZEYXlcIlxuXTtcblxudHlwZSBDb25kaXRpb25UeXBlID0ge1xuXHRvcGVyYXRvcjogc3RyaW5nO1xuXHR2YWx1ZXM6IEFycmF5PGFueT4gfCB1bmRlZmluZWQ7XG5cdHZhbGlkYXRlZD86IHN0cmluZztcbn07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNlYXJjaFRlcm0oc1NlYXJjaFRlcm06IHN0cmluZykge1xuXHRpZiAoIXNTZWFyY2hUZXJtKSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBzU2VhcmNoVGVybVxuXHRcdC5yZXBsYWNlKC9cIi9nLCBcIiBcIilcblx0XHQucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpIC8vZXNjYXBlIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLiBDYW4gYmUgcmVtb3ZlZCBpZiBvZGF0YS9iaW5kaW5nIGhhbmRsZXMgYmFja2VuZCBlcnJvcnMgcmVzcG9uZHMuXG5cdFx0LnNwbGl0KC9cXHMrLylcblx0XHQucmVkdWNlKGZ1bmN0aW9uIChzTm9ybWFsaXplZDogc3RyaW5nIHwgdW5kZWZpbmVkLCBzQ3VycmVudFdvcmQ6IHN0cmluZykge1xuXHRcdFx0aWYgKHNDdXJyZW50V29yZCAhPT0gXCJcIikge1xuXHRcdFx0XHRzTm9ybWFsaXplZCA9IGAke3NOb3JtYWxpemVkID8gYCR7c05vcm1hbGl6ZWR9IGAgOiBcIlwifVwiJHtzQ3VycmVudFdvcmR9XCJgO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNOb3JtYWxpemVkO1xuXHRcdH0sIHVuZGVmaW5lZCk7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5RGF0YVR5cGUob05hdmlnYXRpb25Db250ZXh0OiBhbnkpIHtcblx0bGV0IHNEYXRhVHlwZSA9IG9OYXZpZ2F0aW9uQ29udGV4dC5nZXRQcm9wZXJ0eShcIiRUeXBlXCIpO1xuXHQvLyBpZiAka2luZCBleGlzdHMsIGl0J3Mgbm90IGEgRGF0YUZpZWxkIGFuZCB3ZSBoYXZlIHRoZSBmaW5hbCB0eXBlIGFscmVhZHlcblx0aWYgKCFvTmF2aWdhdGlvbkNvbnRleHQuZ2V0UHJvcGVydHkoXCIka2luZFwiKSkge1xuXHRcdHN3aXRjaCAoc0RhdGFUeXBlKSB7XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCI6XG5cdFx0XHRcdHNEYXRhVHlwZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRcIjpcblx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGhcIjpcblx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoVXJsXCI6XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvblwiOlxuXHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhBY3Rpb25cIjpcblx0XHRcdFx0c0RhdGFUeXBlID0gb05hdmlnYXRpb25Db250ZXh0LmdldFByb3BlcnR5KFwiVmFsdWUvJFBhdGgvJFR5cGVcIik7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQW5ub3RhdGlvblwiOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc3Qgc0Fubm90YXRpb25QYXRoID0gb05hdmlnYXRpb25Db250ZXh0LmdldFByb3BlcnR5KFwiVGFyZ2V0LyRBbm5vdGF0aW9uUGF0aFwiKTtcblx0XHRcdFx0aWYgKHNBbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0XHRcdGlmIChzQW5ub3RhdGlvblBhdGguaW5kZXhPZihcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFwiKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRzRGF0YVR5cGUgPSBvTmF2aWdhdGlvbkNvbnRleHQuZ2V0UHJvcGVydHkoXCJUYXJnZXQvJEFubm90YXRpb25QYXRoL2ZuLyRQYXRoLyRUeXBlXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc0Fubm90YXRpb25QYXRoLmluZGV4T2YoXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIikgPiAtMSkge1xuXHRcdFx0XHRcdFx0c0RhdGFUeXBlID0gb05hdmlnYXRpb25Db250ZXh0LmdldFByb3BlcnR5KFwiVmFsdWUvJFBhdGgvJFR5cGVcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGUuZy4gRmllbGRHcm91cCBvciBDaGFydFxuXHRcdFx0XHRcdFx0c0RhdGFUeXBlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzRGF0YVR5cGUgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHNEYXRhVHlwZTtcbn1cblxuZnVuY3Rpb24gZm5IYXNUcmFuc2llbnRDb250ZXh0cyhvTGlzdEJpbmRpbmc6IGFueSkge1xuXHRsZXQgYkhhc1RyYW5zaWVudENvbnRleHRzID0gZmFsc2U7XG5cdGlmIChvTGlzdEJpbmRpbmcpIHtcblx0XHRvTGlzdEJpbmRpbmcuZ2V0Q3VycmVudENvbnRleHRzKCkuZm9yRWFjaChmdW5jdGlvbiAob0NvbnRleHQ6IGFueSkge1xuXHRcdFx0aWYgKG9Db250ZXh0ICYmIG9Db250ZXh0LmlzVHJhbnNpZW50KCkpIHtcblx0XHRcdFx0Ykhhc1RyYW5zaWVudENvbnRleHRzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYkhhc1RyYW5zaWVudENvbnRleHRzO1xufVxuXG5mdW5jdGlvbiBnZXRTZWFyY2hSZXN0cmljdGlvbnMoc0Z1bGxQYXRoOiBhbnksIG9NZXRhTW9kZWw6IGFueSkge1xuXHRsZXQgb1NlYXJjaFJlc3RyaWN0aW9ucztcblx0bGV0IG9OYXZpZ2F0aW9uU2VhcmNoUmVzdHJpY3Rpb25zO1xuXHRjb25zdCBuYXZpZ2F0aW9uVGV4dCA9IFwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjtcblx0Y29uc3Qgc2VhcmNoUmVzdHJpY3Rpb25zVGVybSA9IFwiQE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU2VhcmNoUmVzdHJpY3Rpb25zXCI7XG5cdGNvbnN0IGVudGl0eVR5cGVQYXRoUGFydHMgPSBzRnVsbFBhdGgucmVwbGFjZUFsbChcIiUyRlwiLCBcIi9cIikuc3BsaXQoXCIvXCIpLmZpbHRlcihNb2RlbEhlbHBlci5maWx0ZXJPdXROYXZQcm9wQmluZGluZyk7XG5cdGNvbnN0IGVudGl0eVNldFBhdGggPSBNb2RlbEhlbHBlci5nZXRFbnRpdHlTZXRQYXRoKHNGdWxsUGF0aCwgb01ldGFNb2RlbCk7XG5cdGNvbnN0IGVudGl0eVNldFBhdGhQYXJ0cyA9IGVudGl0eVNldFBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihNb2RlbEhlbHBlci5maWx0ZXJPdXROYXZQcm9wQmluZGluZyk7XG5cdGNvbnN0IGlzQ29udGFpbm1lbnQgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZVBhdGhQYXJ0cy5qb2luKFwiL1wiKX0vJENvbnRhaW5zVGFyZ2V0YCk7XG5cdGNvbnN0IGNvbnRhaW5tZW50TmF2UGF0aCA9IGlzQ29udGFpbm1lbnQgJiYgZW50aXR5VHlwZVBhdGhQYXJ0c1tlbnRpdHlUeXBlUGF0aFBhcnRzLmxlbmd0aCAtIDFdO1xuXG5cdC8vTEVBU1QgUFJJT1JJVFkgLSBTZWFyY2ggcmVzdHJpY3Rpb25zIGRpcmVjdGx5IGF0IEVudGl0eSBTZXRcblx0Ly9lLmcuIEZSIGluIFwiTlMuRW50aXR5Q29udGFpbmVyL1NhbGVzT3JkZXJNYW5hZ2VcIiBDb250ZXh0UGF0aDogL1NhbGVzT3JkZXJNYW5hZ2Vcblx0aWYgKCFpc0NvbnRhaW5tZW50KSB7XG5cdFx0b1NlYXJjaFJlc3RyaWN0aW9ucyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke2VudGl0eVNldFBhdGh9JHtzZWFyY2hSZXN0cmljdGlvbnNUZXJtfWApO1xuXHR9XG5cdGlmIChlbnRpdHlUeXBlUGF0aFBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRjb25zdCBuYXZQYXRoID0gaXNDb250YWlubWVudCA/IGNvbnRhaW5tZW50TmF2UGF0aCA6IGVudGl0eVNldFBhdGhQYXJ0c1tlbnRpdHlTZXRQYXRoUGFydHMubGVuZ3RoIC0gMV07XG5cdFx0Ly8gSW4gY2FzZSBvZiBjb250YWlubWVudCB3ZSB0YWtlIGVudGl0eVNldCBwcm92aWRlZCBhcyBwYXJlbnQuIEFuZCBpbiBjYXNlIG9mIG5vcm1hbCB3ZSB3b3VsZCByZW1vdmUgdGhlIGxhc3QgbmF2aWdhdGlvbiBmcm9tIGVudGl0eVNldFBhdGguXG5cdFx0Y29uc3QgcGFyZW50RW50aXR5U2V0UGF0aCA9IGlzQ29udGFpbm1lbnQgPyBlbnRpdHlTZXRQYXRoIDogYC8ke2VudGl0eVNldFBhdGhQYXJ0cy5zbGljZSgwLCAtMSkuam9pbihgLyR7bmF2aWdhdGlvblRleHR9L2ApfWA7XG5cblx0XHQvL0hJR0hFU1QgcHJpb3JpdHkgLSBOYXZpZ2F0aW9uIHJlc3RyaWN0aW9uc1xuXHRcdC8vZS5nLiBQYXJlbnQgXCIvQ3VzdG9tZXJcIiB3aXRoIE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg9XCJTZXRcIiBDb250ZXh0UGF0aDogQ3VzdG9tZXIvU2V0XG5cdFx0Y29uc3Qgb05hdmlnYXRpb25SZXN0cmljdGlvbnMgPSBDb21tb25VdGlscy5nZXROYXZpZ2F0aW9uUmVzdHJpY3Rpb25zKFxuXHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdHBhcmVudEVudGl0eVNldFBhdGgsXG5cdFx0XHRuYXZQYXRoLnJlcGxhY2VBbGwoXCIlMkZcIiwgXCIvXCIpXG5cdFx0KTtcblx0XHRvTmF2aWdhdGlvblNlYXJjaFJlc3RyaWN0aW9ucyA9IG9OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zICYmIG9OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zW1wiU2VhcmNoUmVzdHJpY3Rpb25zXCJdO1xuXHR9XG5cdHJldHVybiBvTmF2aWdhdGlvblNlYXJjaFJlc3RyaWN0aW9ucyB8fCBvU2VhcmNoUmVzdHJpY3Rpb25zO1xufVxuXG5mdW5jdGlvbiBnZXROYXZpZ2F0aW9uUmVzdHJpY3Rpb25zKG9Nb2RlbDogYW55LCBzRW50aXR5U2V0UGF0aDogYW55LCBzTmF2aWdhdGlvblBhdGg6IGFueSkge1xuXHRjb25zdCBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucyA9IG9Nb2RlbC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGh9QE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuTmF2aWdhdGlvblJlc3RyaWN0aW9uc2ApO1xuXHRjb25zdCBhUmVzdHJpY3RlZFByb3BlcnRpZXMgPSBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucyAmJiBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucy5SZXN0cmljdGVkUHJvcGVydGllcztcblx0cmV0dXJuIChcblx0XHRhUmVzdHJpY3RlZFByb3BlcnRpZXMgJiZcblx0XHRhUmVzdHJpY3RlZFByb3BlcnRpZXMuZmluZChmdW5jdGlvbiAob1Jlc3RyaWN0ZWRQcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRvUmVzdHJpY3RlZFByb3BlcnR5ICYmXG5cdFx0XHRcdG9SZXN0cmljdGVkUHJvcGVydHkuTmF2aWdhdGlvblByb3BlcnR5ICYmXG5cdFx0XHRcdG9SZXN0cmljdGVkUHJvcGVydHkuTmF2aWdhdGlvblByb3BlcnR5LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoID09PSBzTmF2aWdhdGlvblBhdGhcblx0XHRcdCk7XG5cdFx0fSlcblx0KTtcbn1cblxuZnVuY3Rpb24gX2lzSW5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcyhvTW9kZWw6IGFueSwgc0VudGl0eVNldFBhdGg6IGFueSwgc0NvbnRleHRQYXRoOiBhbnkpIHtcblx0bGV0IGJJc05vdEZpbHRlcmFibGUgPSBmYWxzZTtcblx0Y29uc3Qgb0Fubm90YXRpb24gPSBvTW9kZWwuZ2V0T2JqZWN0KGAke3NFbnRpdHlTZXRQYXRofUBPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkZpbHRlclJlc3RyaWN0aW9uc2ApO1xuXHRpZiAob0Fubm90YXRpb24gJiYgb0Fubm90YXRpb24uTm9uRmlsdGVyYWJsZVByb3BlcnRpZXMpIHtcblx0XHRiSXNOb3RGaWx0ZXJhYmxlID0gb0Fubm90YXRpb24uTm9uRmlsdGVyYWJsZVByb3BlcnRpZXMuc29tZShmdW5jdGlvbiAocHJvcGVydHk6IGFueSkge1xuXHRcdFx0cmV0dXJuIHByb3BlcnR5LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoID09PSBzQ29udGV4dFBhdGggfHwgcHJvcGVydHkuJFByb3BlcnR5UGF0aCA9PT0gc0NvbnRleHRQYXRoO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBiSXNOb3RGaWx0ZXJhYmxlO1xufVxuXG4vLyBUT0RPIHJld29yayB0aGlzIVxuZnVuY3Rpb24gX2lzQ29udGV4dFBhdGhGaWx0ZXJhYmxlKG9Nb2RlbDogYW55LCBzRW50aXR5U2V0UGF0aDogYW55LCBzQ29udGV4UGF0aDogYW55KSB7XG5cdGNvbnN0IHNGdWxsUGF0aCA9IGAke3NFbnRpdHlTZXRQYXRofS8ke3NDb250ZXhQYXRofWAsXG5cdFx0YUVTUGFydHMgPSBzRnVsbFBhdGguc3BsaXQoXCIvXCIpLnNwbGljZSgwLCAyKSxcblx0XHRhQ29udGV4dCA9IHNGdWxsUGF0aC5zcGxpdChcIi9cIikuc3BsaWNlKDIpO1xuXHRsZXQgYklzTm90RmlsdGVyYWJsZSA9IGZhbHNlLFxuXHRcdHNDb250ZXh0ID0gXCJcIjtcblxuXHRzRW50aXR5U2V0UGF0aCA9IGFFU1BhcnRzLmpvaW4oXCIvXCIpO1xuXG5cdGJJc05vdEZpbHRlcmFibGUgPSBhQ29udGV4dC5zb21lKGZ1bmN0aW9uIChpdGVtOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIGFycmF5OiBzdHJpbmdbXSkge1xuXHRcdGlmIChzQ29udGV4dC5sZW5ndGggPiAwKSB7XG5cdFx0XHRzQ29udGV4dCArPSBgLyR7aXRlbX1gO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzQ29udGV4dCA9IGl0ZW07XG5cdFx0fVxuXHRcdGlmIChpbmRleCA9PT0gYXJyYXkubGVuZ3RoIC0gMikge1xuXHRcdFx0Ly8gSW4gY2FzZSBvZiBcIi9DdXN0b21lci9TZXQvUHJvcGVydHlcIiB0aGlzIGlzIHRvIGNoZWNrIG5hdmlnYXRpb24gcmVzdHJpY3Rpb25zIG9mIFwiQ3VzdG9tZXJcIiBmb3Igbm9uLWZpbHRlcmFibGUgcHJvcGVydGllcyBpbiBcIlNldFwiXG5cdFx0XHRjb25zdCBvTmF2aWdhdGlvblJlc3RyaWN0aW9ucyA9IGdldE5hdmlnYXRpb25SZXN0cmljdGlvbnMob01vZGVsLCBzRW50aXR5U2V0UGF0aCwgaXRlbSk7XG5cdFx0XHRjb25zdCBvRmlsdGVyUmVzdHJpY3Rpb25zID0gb05hdmlnYXRpb25SZXN0cmljdGlvbnMgJiYgb05hdmlnYXRpb25SZXN0cmljdGlvbnMuRmlsdGVyUmVzdHJpY3Rpb25zO1xuXHRcdFx0Y29uc3QgYU5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzID0gb0ZpbHRlclJlc3RyaWN0aW9ucyAmJiBvRmlsdGVyUmVzdHJpY3Rpb25zLk5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzO1xuXHRcdFx0Y29uc3Qgc1RhcmdldFByb3BlcnR5UGF0aCA9IGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRhTm9uRmlsdGVyYWJsZVByb3BlcnRpZXMgJiZcblx0XHRcdFx0YU5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzLmZpbmQoZnVuY3Rpb24gKG9Qcm9wZXJ0eVBhdGg6IGFueSkge1xuXHRcdFx0XHRcdHJldHVybiBvUHJvcGVydHlQYXRoLiRQcm9wZXJ0eVBhdGggPT09IHNUYXJnZXRQcm9wZXJ0eVBhdGg7XG5cdFx0XHRcdH0pXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChpbmRleCA9PT0gYXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0Ly9sYXN0IHBhdGggc2VnbWVudFxuXHRcdFx0YklzTm90RmlsdGVyYWJsZSA9IF9pc0luTm9uRmlsdGVyYWJsZVByb3BlcnRpZXMob01vZGVsLCBzRW50aXR5U2V0UGF0aCwgc0NvbnRleHQpO1xuXHRcdH0gZWxzZSBpZiAob01vZGVsLmdldE9iamVjdChgJHtzRW50aXR5U2V0UGF0aH0vJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcvJHtpdGVtfWApKSB7XG5cdFx0XHQvL2NoZWNrIGV4aXN0aW5nIGNvbnRleHQgcGF0aCBhbmQgaW5pdGlhbGl6ZSBpdFxuXHRcdFx0YklzTm90RmlsdGVyYWJsZSA9IF9pc0luTm9uRmlsdGVyYWJsZVByb3BlcnRpZXMob01vZGVsLCBzRW50aXR5U2V0UGF0aCwgc0NvbnRleHQpO1xuXHRcdFx0c0NvbnRleHQgPSBcIlwiO1xuXHRcdFx0Ly9zZXQgdGhlIG5ldyBFbnRpdHlTZXRcblx0XHRcdHNFbnRpdHlTZXRQYXRoID0gYC8ke29Nb2RlbC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGh9LyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLyR7aXRlbX1gKX1gO1xuXHRcdH1cblx0XHRyZXR1cm4gYklzTm90RmlsdGVyYWJsZSA9PT0gdHJ1ZTtcblx0fSk7XG5cdHJldHVybiBiSXNOb3RGaWx0ZXJhYmxlO1xufVxuXG4vLyBUT0RPIGNoZWNrIHVzZWQgcGxhY2VzIGFuZCByZXdvcmsgdGhpc1xuZnVuY3Rpb24gaXNQcm9wZXJ0eUZpbHRlcmFibGUoXG5cdG9Nb2RlbDogT0RhdGFNZXRhTW9kZWwsXG5cdHNFbnRpdHlTZXRQYXRoOiBzdHJpbmcsXG5cdHNQcm9wZXJ0eTogc3RyaW5nLFxuXHRiU2tpcEhpZGRlbkZpbHRlcj86IGJvb2xlYW5cbik6IGJvb2xlYW4gfCBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiB7XG5cdGlmICh0eXBlb2Ygc1Byb3BlcnR5ICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwic1Byb3BlcnR5IHBhcmFtZXRlciBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuXHR9XG5cdGxldCBiSXNGaWx0ZXJhYmxlO1xuXG5cdC8vIFBhcmFtZXRlcnMgc2hvdWxkIGJlIHJlbmRlcmVkIGFzIGZpbHRlcmZpZWxkc1xuXHRpZiAob01vZGVsLmdldE9iamVjdChgJHtzRW50aXR5U2V0UGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5SZXN1bHRDb250ZXh0YCkgPT09IHRydWUpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGNvbnN0IG9OYXZpZ2F0aW9uQ29udGV4dCA9IG9Nb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChgJHtzRW50aXR5U2V0UGF0aH0vJHtzUHJvcGVydHl9YCkgYXMgQ29udGV4dDtcblxuXHRpZiAoIWJTa2lwSGlkZGVuRmlsdGVyKSB7XG5cdFx0aWYgKFxuXHRcdFx0b05hdmlnYXRpb25Db250ZXh0LmdldFByb3BlcnR5KFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhpZGRlblwiKSA9PT0gdHJ1ZSB8fFxuXHRcdFx0b05hdmlnYXRpb25Db250ZXh0LmdldFByb3BlcnR5KFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhpZGRlbkZpbHRlclwiKSA9PT0gdHJ1ZVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRjb25zdCBzSGlkZGVuUGF0aCA9IG9OYXZpZ2F0aW9uQ29udGV4dC5nZXRQcm9wZXJ0eShcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW4vJFBhdGhcIik7XG5cdFx0Y29uc3Qgc0hpZGRlbkZpbHRlclBhdGggPSBvTmF2aWdhdGlvbkNvbnRleHQuZ2V0UHJvcGVydHkoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuRmlsdGVyLyRQYXRoXCIpO1xuXG5cdFx0aWYgKHNIaWRkZW5QYXRoICYmIHNIaWRkZW5GaWx0ZXJQYXRoKSB7XG5cdFx0XHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24obm90KG9yKHBhdGhJbk1vZGVsKHNIaWRkZW5QYXRoKSwgcGF0aEluTW9kZWwoc0hpZGRlbkZpbHRlclBhdGgpKSkpO1xuXHRcdH0gZWxzZSBpZiAoc0hpZGRlblBhdGgpIHtcblx0XHRcdHJldHVybiBjb21waWxlRXhwcmVzc2lvbihub3QocGF0aEluTW9kZWwoc0hpZGRlblBhdGgpKSk7XG5cdFx0fSBlbHNlIGlmIChzSGlkZGVuRmlsdGVyUGF0aCkge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVFeHByZXNzaW9uKG5vdChwYXRoSW5Nb2RlbChzSGlkZGVuRmlsdGVyUGF0aCkpKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoc0VudGl0eVNldFBhdGguc3BsaXQoXCIvXCIpLmxlbmd0aCA9PT0gMiAmJiBzUHJvcGVydHkuaW5kZXhPZihcIi9cIikgPCAwKSB7XG5cdFx0Ly8gdGhlcmUgaXMgbm8gbmF2aWdhdGlvbiBpbiBlbnRpdHlTZXQgcGF0aCBhbmQgcHJvcGVydHkgcGF0aFxuXHRcdGJJc0ZpbHRlcmFibGUgPSAhX2lzSW5Ob25GaWx0ZXJhYmxlUHJvcGVydGllcyhvTW9kZWwsIHNFbnRpdHlTZXRQYXRoLCBzUHJvcGVydHkpO1xuXHR9IGVsc2Uge1xuXHRcdGJJc0ZpbHRlcmFibGUgPSAhX2lzQ29udGV4dFBhdGhGaWx0ZXJhYmxlKG9Nb2RlbCwgc0VudGl0eVNldFBhdGgsIHNQcm9wZXJ0eSk7XG5cdH1cblx0Ly8gY2hlY2sgaWYgdHlwZSBjYW4gYmUgdXNlZCBmb3IgZmlsdGVyaW5nXG5cdGlmIChiSXNGaWx0ZXJhYmxlICYmIG9OYXZpZ2F0aW9uQ29udGV4dCkge1xuXHRcdGNvbnN0IHNQcm9wZXJ0eURhdGFUeXBlID0gZ2V0UHJvcGVydHlEYXRhVHlwZShvTmF2aWdhdGlvbkNvbnRleHQpO1xuXHRcdGlmIChzUHJvcGVydHlEYXRhVHlwZSkge1xuXHRcdFx0YklzRmlsdGVyYWJsZSA9IGFWYWxpZFR5cGVzLmluZGV4T2Yoc1Byb3BlcnR5RGF0YVR5cGUpICE9PSAtMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YklzRmlsdGVyYWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBiSXNGaWx0ZXJhYmxlO1xufVxuXG5mdW5jdGlvbiBnZXRTaGVsbFNlcnZpY2VzKG9Db250cm9sOiBhbnkpOiBJU2hlbGxTZXJ2aWNlcyB7XG5cdHJldHVybiBnZXRBcHBDb21wb25lbnQob0NvbnRyb2wpLmdldFNoZWxsU2VydmljZXMoKTtcbn1cblxuZnVuY3Rpb24gZ2V0SGFzaCgpOiBzdHJpbmcge1xuXHRjb25zdCBzSGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRyZXR1cm4gc0hhc2guc3BsaXQoXCImXCIpWzBdO1xufVxuXG5mdW5jdGlvbiBfZ2V0U09JbnRlbnRzKG9TaGVsbFNlcnZpY2VIZWxwZXI6IGFueSwgb09iamVjdFBhZ2VMYXlvdXQ6IGFueSwgb1NlbWFudGljT2JqZWN0OiBhbnksIG9QYXJhbTogYW55KTogUHJvbWlzZTxhbnk+IHtcblx0cmV0dXJuIG9TaGVsbFNlcnZpY2VIZWxwZXIuZ2V0TGlua3Moe1xuXHRcdHNlbWFudGljT2JqZWN0OiBvU2VtYW50aWNPYmplY3QsXG5cdFx0cGFyYW1zOiBvUGFyYW1cblx0fSk7XG59XG5cbi8vIFRPLURPIGFkZCB0aGlzIGFzIHBhcnQgb2YgYXBwbHlTZW1hbnRpY09iamVjdG1hcHBpbmdzIGxvZ2ljIGluIEludGVudEJhc2VkbmF2aWdhdGlvbiBjb250cm9sbGVyIGV4dGVuc2lvblxuZnVuY3Rpb24gX2NyZWF0ZU1hcHBpbmdzKG9NYXBwaW5nOiBhbnkpIHtcblx0Y29uc3QgYVNPTWFwcGluZ3MgPSBbXTtcblx0Y29uc3QgYU1hcHBpbmdLZXlzID0gT2JqZWN0LmtleXMob01hcHBpbmcpO1xuXHRsZXQgb1NlbWFudGljTWFwcGluZztcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhTWFwcGluZ0tleXMubGVuZ3RoOyBpKyspIHtcblx0XHRvU2VtYW50aWNNYXBwaW5nID0ge1xuXHRcdFx0XCJMb2NhbFByb3BlcnR5XCI6IHtcblx0XHRcdFx0XCIkUHJvcGVydHlQYXRoXCI6IGFNYXBwaW5nS2V5c1tpXVxuXHRcdFx0fSxcblx0XHRcdFwiU2VtYW50aWNPYmplY3RQcm9wZXJ0eVwiOiBvTWFwcGluZ1thTWFwcGluZ0tleXNbaV1dXG5cdFx0fTtcblx0XHRhU09NYXBwaW5ncy5wdXNoKG9TZW1hbnRpY01hcHBpbmcpO1xuXHR9XG5cblx0cmV0dXJuIGFTT01hcHBpbmdzO1xufVxuXG4vKipcbiAqIEBwYXJhbSBhTGlua3NcbiAqIEBwYXJhbSBhRXhjbHVkZWRBY3Rpb25zXG4gKiBAcGFyYW0gb1RhcmdldFBhcmFtc1xuICogQHBhcmFtIGFJdGVtc1xuICogQHBhcmFtIGFBbGxvd2VkQWN0aW9uc1xuICovXG5mdW5jdGlvbiBfZ2V0UmVsYXRlZEFwcHNNZW51SXRlbXMoYUxpbmtzOiBhbnksIGFFeGNsdWRlZEFjdGlvbnM6IGFueSwgb1RhcmdldFBhcmFtczogYW55LCBhSXRlbXM6IGFueSwgYUFsbG93ZWRBY3Rpb25zPzogYW55KSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYUxpbmtzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qgb0xpbmsgPSBhTGlua3NbaV07XG5cdFx0Y29uc3Qgc0ludGVudCA9IG9MaW5rLmludGVudDtcblx0XHRjb25zdCBzQWN0aW9uID0gc0ludGVudC5zcGxpdChcIi1cIilbMV0uc3BsaXQoXCI/XCIpWzBdO1xuXHRcdGlmIChhQWxsb3dlZEFjdGlvbnMgJiYgYUFsbG93ZWRBY3Rpb25zLmluY2x1ZGVzKHNBY3Rpb24pKSB7XG5cdFx0XHRhSXRlbXMucHVzaCh7XG5cdFx0XHRcdHRleHQ6IG9MaW5rLnRleHQsXG5cdFx0XHRcdHRhcmdldFNlbU9iamVjdDogc0ludGVudC5zcGxpdChcIiNcIilbMV0uc3BsaXQoXCItXCIpWzBdLFxuXHRcdFx0XHR0YXJnZXRBY3Rpb246IHNBY3Rpb24uc3BsaXQoXCJ+XCIpWzBdLFxuXHRcdFx0XHR0YXJnZXRQYXJhbXM6IG9UYXJnZXRQYXJhbXNcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoIWFBbGxvd2VkQWN0aW9ucyAmJiBhRXhjbHVkZWRBY3Rpb25zICYmIGFFeGNsdWRlZEFjdGlvbnMuaW5kZXhPZihzQWN0aW9uKSA9PT0gLTEpIHtcblx0XHRcdGFJdGVtcy5wdXNoKHtcblx0XHRcdFx0dGV4dDogb0xpbmsudGV4dCxcblx0XHRcdFx0dGFyZ2V0U2VtT2JqZWN0OiBzSW50ZW50LnNwbGl0KFwiI1wiKVsxXS5zcGxpdChcIi1cIilbMF0sXG5cdFx0XHRcdHRhcmdldEFjdGlvbjogc0FjdGlvbi5zcGxpdChcIn5cIilbMF0sXG5cdFx0XHRcdHRhcmdldFBhcmFtczogb1RhcmdldFBhcmFtc1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIG9BZGRpdGlvbmFsU2VtYW50aWNPYmplY3RzXG4gKiBAcGFyYW0gb0JpbmRpbmdDb250ZXh0XG4gKiBAcGFyYW0gYU1hbmlmZXN0U09JdGVtc1xuICogQHBhcmFtIGFMaW5rc1xuICovXG5mdW5jdGlvbiBfZ2V0UmVsYXRlZEludGVudHMob0FkZGl0aW9uYWxTZW1hbnRpY09iamVjdHM6IGFueSwgb0JpbmRpbmdDb250ZXh0OiBhbnksIGFNYW5pZmVzdFNPSXRlbXM6IGFueSwgYUxpbmtzOiBhbnkpIHtcblx0aWYgKGFMaW5rcyAmJiBhTGlua3MubGVuZ3RoID4gMCkge1xuXHRcdGNvbnN0IGFBbGxvd2VkQWN0aW9ucyA9IG9BZGRpdGlvbmFsU2VtYW50aWNPYmplY3RzLmFsbG93ZWRBY3Rpb25zIHx8IHVuZGVmaW5lZDtcblx0XHRjb25zdCBhRXhjbHVkZWRBY3Rpb25zID0gb0FkZGl0aW9uYWxTZW1hbnRpY09iamVjdHMudW5hdmFpbGFibGVBY3Rpb25zID8gb0FkZGl0aW9uYWxTZW1hbnRpY09iamVjdHMudW5hdmFpbGFibGVBY3Rpb25zIDogW107XG5cdFx0Y29uc3QgYVNPTWFwcGluZ3MgPSBvQWRkaXRpb25hbFNlbWFudGljT2JqZWN0cy5tYXBwaW5nID8gX2NyZWF0ZU1hcHBpbmdzKG9BZGRpdGlvbmFsU2VtYW50aWNPYmplY3RzLm1hcHBpbmcpIDogW107XG5cdFx0Y29uc3Qgb1RhcmdldFBhcmFtcyA9IHsgbmF2aWdhdGlvbkNvbnRleHRzOiBvQmluZGluZ0NvbnRleHQsIHNlbWFudGljT2JqZWN0TWFwcGluZzogYVNPTWFwcGluZ3MgfTtcblx0XHRfZ2V0UmVsYXRlZEFwcHNNZW51SXRlbXMoYUxpbmtzLCBhRXhjbHVkZWRBY3Rpb25zLCBvVGFyZ2V0UGFyYW1zLCBhTWFuaWZlc3RTT0l0ZW1zLCBhQWxsb3dlZEFjdGlvbnMpO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlbGF0ZUFwcHNNb2RlbChcblx0dGhpczogYW55LFxuXHRvQmluZGluZ0NvbnRleHQ6IGFueSxcblx0b0VudHJ5OiBhbnksXG5cdG9PYmplY3RQYWdlTGF5b3V0OiBhbnksXG5cdGFTZW1LZXlzOiBhbnksXG5cdG9NZXRhTW9kZWw6IGFueSxcblx0b01ldGFQYXRoOiBhbnlcbikge1xuXHRjb25zdCBvU2hlbGxTZXJ2aWNlSGVscGVyOiBJU2hlbGxTZXJ2aWNlcyA9IGdldFNoZWxsU2VydmljZXMob09iamVjdFBhZ2VMYXlvdXQpO1xuXHRjb25zdCBvUGFyYW06IGFueSA9IHt9O1xuXHRsZXQgc0N1cnJlbnRTZW1PYmogPSBcIlwiLFxuXHRcdHNDdXJyZW50QWN0aW9uID0gXCJcIjtcblx0bGV0IG9TZW1hbnRpY09iamVjdEFubm90YXRpb25zO1xuXHRsZXQgYVJlbGF0ZWRBcHBzTWVudUl0ZW1zOiBhbnlbXSA9IFtdO1xuXHRsZXQgYUV4Y2x1ZGVkQWN0aW9uczogYW55W10gPSBbXTtcblx0bGV0IGFNYW5pZmVzdFNPS2V5czogc3RyaW5nW107XG5cblx0ZnVuY3Rpb24gZm5HZXRQYXJzZVNoZWxsSGFzaEFuZEdldExpbmtzKCkge1xuXHRcdGNvbnN0IG9QYXJzZWRVcmwgPSBvU2hlbGxTZXJ2aWNlSGVscGVyLnBhcnNlU2hlbGxIYXNoKGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpO1xuXHRcdHNDdXJyZW50U2VtT2JqID0gb1BhcnNlZFVybC5zZW1hbnRpY09iamVjdDsgLy8gQ3VycmVudCBTZW1hbnRpYyBPYmplY3Rcblx0XHRzQ3VycmVudEFjdGlvbiA9IG9QYXJzZWRVcmwuYWN0aW9uO1xuXHRcdHJldHVybiBfZ2V0U09JbnRlbnRzKG9TaGVsbFNlcnZpY2VIZWxwZXIsIG9PYmplY3RQYWdlTGF5b3V0LCBzQ3VycmVudFNlbU9iaiwgb1BhcmFtKTtcblx0fVxuXG5cdHRyeSB7XG5cdFx0aWYgKG9FbnRyeSkge1xuXHRcdFx0aWYgKGFTZW1LZXlzICYmIGFTZW1LZXlzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBhU2VtS2V5cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdGNvbnN0IHNTZW1LZXkgPSBhU2VtS2V5c1tqXS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRcdGlmICghb1BhcmFtW3NTZW1LZXldKSB7XG5cdFx0XHRcdFx0XHRvUGFyYW1bc1NlbUtleV0gPSB7IHZhbHVlOiBvRW50cnlbc1NlbUtleV0gfTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGZhbGxiYWNrIHRvIFRlY2huaWNhbCBLZXlzIGlmIG5vIFNlbWFudGljIEtleSBpcyBwcmVzZW50XG5cdFx0XHRcdGNvbnN0IGFUZWNobmljYWxLZXlzID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7b01ldGFQYXRofS8kVHlwZS8kS2V5YCk7XG5cdFx0XHRcdGZvciAoY29uc3Qga2V5IGluIGFUZWNobmljYWxLZXlzKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc09iaktleSA9IGFUZWNobmljYWxLZXlzW2tleV07XG5cdFx0XHRcdFx0aWYgKCFvUGFyYW1bc09iaktleV0pIHtcblx0XHRcdFx0XHRcdG9QYXJhbVtzT2JqS2V5XSA9IHsgdmFsdWU6IG9FbnRyeVtzT2JqS2V5XSB9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBMb2dpYyB0byByZWFkIGFkZGl0aW9uYWwgU08gZnJvbSBtYW5pZmVzdCBhbmQgdXBkYXRlZCByZWxhdGVkYXBwcyBtb2RlbFxuXG5cdFx0Y29uc3Qgb01hbmlmZXN0RGF0YSA9IGdldFRhcmdldFZpZXcob09iamVjdFBhZ2VMYXlvdXQpLmdldFZpZXdEYXRhKCk7XG5cdFx0Y29uc3QgYU1hbmlmZXN0U09JdGVtczogYW55W10gPSBbXTtcblx0XHRsZXQgc2VtYW50aWNPYmplY3RJbnRlbnRzO1xuXHRcdGlmIChvTWFuaWZlc3REYXRhLmFkZGl0aW9uYWxTZW1hbnRpY09iamVjdHMpIHtcblx0XHRcdGFNYW5pZmVzdFNPS2V5cyA9IE9iamVjdC5rZXlzKG9NYW5pZmVzdERhdGEuYWRkaXRpb25hbFNlbWFudGljT2JqZWN0cyk7XG5cdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBhTWFuaWZlc3RTT0tleXMubGVuZ3RoOyBrZXkrKykge1xuXHRcdFx0XHRzZW1hbnRpY09iamVjdEludGVudHMgPSBhd2FpdCBQcm9taXNlLnJlc29sdmUoXG5cdFx0XHRcdFx0X2dldFNPSW50ZW50cyhvU2hlbGxTZXJ2aWNlSGVscGVyLCBvT2JqZWN0UGFnZUxheW91dCwgYU1hbmlmZXN0U09LZXlzW2tleV0sIG9QYXJhbSlcblx0XHRcdFx0KTtcblx0XHRcdFx0X2dldFJlbGF0ZWRJbnRlbnRzKFxuXHRcdFx0XHRcdG9NYW5pZmVzdERhdGEuYWRkaXRpb25hbFNlbWFudGljT2JqZWN0c1thTWFuaWZlc3RTT0tleXNba2V5XV0sXG5cdFx0XHRcdFx0b0JpbmRpbmdDb250ZXh0LFxuXHRcdFx0XHRcdGFNYW5pZmVzdFNPSXRlbXMsXG5cdFx0XHRcdFx0c2VtYW50aWNPYmplY3RJbnRlbnRzXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgYUxpbmtzID0gYXdhaXQgZm5HZXRQYXJzZVNoZWxsSGFzaEFuZEdldExpbmtzKCk7XG5cdFx0aWYgKGFMaW5rcykge1xuXHRcdFx0aWYgKGFMaW5rcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGxldCBpc1NlbWFudGljT2JqZWN0SGFzU2FtZVRhcmdldEluTWFuaWZlc3QgPSBmYWxzZTtcblx0XHRcdFx0Y29uc3Qgb1RhcmdldFBhcmFtczogYW55ID0ge307XG5cdFx0XHRcdGNvbnN0IGFBbm5vdGF0aW9uc1NPSXRlbXM6IGFueVtdID0gW107XG5cdFx0XHRcdGNvbnN0IHNFbnRpdHlTZXRQYXRoID0gYCR7b01ldGFQYXRofUBgO1xuXHRcdFx0XHRjb25zdCBzRW50aXR5VHlwZVBhdGggPSBgJHtvTWV0YVBhdGh9L0BgO1xuXHRcdFx0XHRjb25zdCBvRW50aXR5U2V0QW5ub3RhdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChzRW50aXR5U2V0UGF0aCk7XG5cdFx0XHRcdG9TZW1hbnRpY09iamVjdEFubm90YXRpb25zID0gQ29tbW9uVXRpbHMuZ2V0U2VtYW50aWNPYmplY3RBbm5vdGF0aW9ucyhvRW50aXR5U2V0QW5ub3RhdGlvbnMsIHNDdXJyZW50U2VtT2JqKTtcblx0XHRcdFx0aWYgKCFvU2VtYW50aWNPYmplY3RBbm5vdGF0aW9ucy5iSGFzRW50aXR5U2V0U08pIHtcblx0XHRcdFx0XHRjb25zdCBvRW50aXR5VHlwZUFubm90YXRpb25zID0gb01ldGFNb2RlbC5nZXRPYmplY3Qoc0VudGl0eVR5cGVQYXRoKTtcblx0XHRcdFx0XHRvU2VtYW50aWNPYmplY3RBbm5vdGF0aW9ucyA9IENvbW1vblV0aWxzLmdldFNlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMob0VudGl0eVR5cGVBbm5vdGF0aW9ucywgc0N1cnJlbnRTZW1PYmopO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFFeGNsdWRlZEFjdGlvbnMgPSBvU2VtYW50aWNPYmplY3RBbm5vdGF0aW9ucy5hVW5hdmFpbGFibGVBY3Rpb25zO1xuXHRcdFx0XHQvL1NraXAgc2FtZSBhcHBsaWNhdGlvbiBmcm9tIFJlbGF0ZWQgQXBwc1xuXHRcdFx0XHRhRXhjbHVkZWRBY3Rpb25zLnB1c2goc0N1cnJlbnRBY3Rpb24pO1xuXHRcdFx0XHRvVGFyZ2V0UGFyYW1zLm5hdmlnYXRpb25Db250ZXh0cyA9IG9CaW5kaW5nQ29udGV4dDtcblx0XHRcdFx0b1RhcmdldFBhcmFtcy5zZW1hbnRpY09iamVjdE1hcHBpbmcgPSBvU2VtYW50aWNPYmplY3RBbm5vdGF0aW9ucy5hTWFwcGluZ3M7XG5cdFx0XHRcdF9nZXRSZWxhdGVkQXBwc01lbnVJdGVtcyhhTGlua3MsIGFFeGNsdWRlZEFjdGlvbnMsIG9UYXJnZXRQYXJhbXMsIGFBbm5vdGF0aW9uc1NPSXRlbXMpO1xuXG5cdFx0XHRcdGFNYW5pZmVzdFNPSXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoeyB0YXJnZXRTZW1PYmplY3QgfSkge1xuXHRcdFx0XHRcdGlmIChhQW5ub3RhdGlvbnNTT0l0ZW1zWzBdLnRhcmdldFNlbU9iamVjdCA9PT0gdGFyZ2V0U2VtT2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRpc1NlbWFudGljT2JqZWN0SGFzU2FtZVRhcmdldEluTWFuaWZlc3QgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIGFsbCBhY3Rpb25zIGZyb20gY3VycmVudCBoYXNoIGFwcGxpY2F0aW9uIGlmIG1hbmlmZXN0IGNvbnRhaW5zIGVtcHR5IGFsbG93ZWRBY3Rpb25zXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRvTWFuaWZlc3REYXRhLmFkZGl0aW9uYWxTZW1hbnRpY09iamVjdHMgJiZcblx0XHRcdFx0XHRvTWFuaWZlc3REYXRhLmFkZGl0aW9uYWxTZW1hbnRpY09iamVjdHNbYUFubm90YXRpb25zU09JdGVtc1swXS50YXJnZXRTZW1PYmplY3RdICYmXG5cdFx0XHRcdFx0b01hbmlmZXN0RGF0YS5hZGRpdGlvbmFsU2VtYW50aWNPYmplY3RzW2FBbm5vdGF0aW9uc1NPSXRlbXNbMF0udGFyZ2V0U2VtT2JqZWN0XS5hbGxvd2VkQWN0aW9ucyAmJlxuXHRcdFx0XHRcdG9NYW5pZmVzdERhdGEuYWRkaXRpb25hbFNlbWFudGljT2JqZWN0c1thQW5ub3RhdGlvbnNTT0l0ZW1zWzBdLnRhcmdldFNlbU9iamVjdF0uYWxsb3dlZEFjdGlvbnMubGVuZ3RoID09PSAwXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlzU2VtYW50aWNPYmplY3RIYXNTYW1lVGFyZ2V0SW5NYW5pZmVzdCA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhUmVsYXRlZEFwcHNNZW51SXRlbXMgPSBpc1NlbWFudGljT2JqZWN0SGFzU2FtZVRhcmdldEluTWFuaWZlc3Rcblx0XHRcdFx0XHQ/IGFNYW5pZmVzdFNPSXRlbXNcblx0XHRcdFx0XHQ6IGFNYW5pZmVzdFNPSXRlbXMuY29uY2F0KGFBbm5vdGF0aW9uc1NPSXRlbXMpO1xuXHRcdFx0XHQvLyBJZiBubyBhcHAgaW4gbGlzdCwgcmVsYXRlZCBhcHBzIGJ1dHRvbiB3aWxsIGJlIGhpZGRlblxuXHRcdFx0XHRvT2JqZWN0UGFnZUxheW91dC5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpLnNldFByb3BlcnR5KFwicmVsYXRlZEFwcHMvdmlzaWJpbGl0eVwiLCBhUmVsYXRlZEFwcHNNZW51SXRlbXMubGVuZ3RoID4gMCk7XG5cdFx0XHRcdG9PYmplY3RQYWdlTGF5b3V0LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikuc2V0UHJvcGVydHkoXCJyZWxhdGVkQXBwcy9pdGVtc1wiLCBhUmVsYXRlZEFwcHNNZW51SXRlbXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b09iamVjdFBhZ2VMYXlvdXQuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKS5zZXRQcm9wZXJ0eShcInJlbGF0ZWRBcHBzL3Zpc2liaWxpdHlcIiwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRvT2JqZWN0UGFnZUxheW91dC5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpLnNldFByb3BlcnR5KFwicmVsYXRlZEFwcHMvdmlzaWJpbGl0eVwiLCBmYWxzZSk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcjogYW55KSB7XG5cdFx0TG9nLmVycm9yKFwiQ2Fubm90IHJlYWQgbGlua3NcIiwgZXJyb3IpO1xuXHR9XG5cdHJldHVybiBhUmVsYXRlZEFwcHNNZW51SXRlbXM7XG59XG5cbmZ1bmN0aW9uIF9nZXRTZW1hbnRpY09iamVjdEFubm90YXRpb25zKG9FbnRpdHlBbm5vdGF0aW9uczogYW55LCBzQ3VycmVudFNlbU9iajogYW55KSB7XG5cdGNvbnN0IG9TZW1hbnRpY09iamVjdEFubm90YXRpb25zID0ge1xuXHRcdGJIYXNFbnRpdHlTZXRTTzogZmFsc2UsXG5cdFx0YUFsbG93ZWRBY3Rpb25zOiBbXSxcblx0XHRhVW5hdmFpbGFibGVBY3Rpb25zOiBbXSxcblx0XHRhTWFwcGluZ3M6IFtdXG5cdH07XG5cdGxldCBzQW5ub3RhdGlvbk1hcHBpbmdUZXJtLCBzQW5ub3RhdGlvbkFjdGlvblRlcm07XG5cdGxldCBzUXVhbGlmaWVyO1xuXHRmb3IgKGNvbnN0IGtleSBpbiBvRW50aXR5QW5ub3RhdGlvbnMpIHtcblx0XHRpZiAoa2V5LmluZGV4T2YoQ29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0KSA+IC0xICYmIG9FbnRpdHlBbm5vdGF0aW9uc1trZXldID09PSBzQ3VycmVudFNlbU9iaikge1xuXHRcdFx0b1NlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMuYkhhc0VudGl0eVNldFNPID0gdHJ1ZTtcblx0XHRcdHNBbm5vdGF0aW9uTWFwcGluZ1Rlcm0gPSBgQCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0TWFwcGluZ31gO1xuXHRcdFx0c0Fubm90YXRpb25BY3Rpb25UZXJtID0gYEAke0NvbW1vbkFubm90YXRpb25UZXJtcy5TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uc31gO1xuXG5cdFx0XHRpZiAoa2V5LmluZGV4T2YoXCIjXCIpID4gLTEpIHtcblx0XHRcdFx0c1F1YWxpZmllciA9IGtleS5zcGxpdChcIiNcIilbMV07XG5cdFx0XHRcdHNBbm5vdGF0aW9uTWFwcGluZ1Rlcm0gPSBgJHtzQW5ub3RhdGlvbk1hcHBpbmdUZXJtfSMke3NRdWFsaWZpZXJ9YDtcblx0XHRcdFx0c0Fubm90YXRpb25BY3Rpb25UZXJtID0gYCR7c0Fubm90YXRpb25BY3Rpb25UZXJtfSMke3NRdWFsaWZpZXJ9YDtcblx0XHRcdH1cblxuXHRcdFx0b1NlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMuYU1hcHBpbmdzID0gb1NlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMuYU1hcHBpbmdzLmNvbmNhdChvRW50aXR5QW5ub3RhdGlvbnNbc0Fubm90YXRpb25NYXBwaW5nVGVybV0pO1xuXHRcdFx0b1NlbWFudGljT2JqZWN0QW5ub3RhdGlvbnMuYVVuYXZhaWxhYmxlQWN0aW9ucyA9IG9TZW1hbnRpY09iamVjdEFubm90YXRpb25zLmFVbmF2YWlsYWJsZUFjdGlvbnMuY29uY2F0KFxuXHRcdFx0XHRvRW50aXR5QW5ub3RhdGlvbnNbc0Fubm90YXRpb25BY3Rpb25UZXJtXVxuXHRcdFx0KTtcblxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvU2VtYW50aWNPYmplY3RBbm5vdGF0aW9ucztcbn1cblxuZnVuY3Rpb24gZm5VcGRhdGVSZWxhdGVkQXBwc0RldGFpbHMob09iamVjdFBhZ2VMYXlvdXQ6IGFueSkge1xuXHRjb25zdCBvTWV0YU1vZGVsID0gb09iamVjdFBhZ2VMYXlvdXQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0Y29uc3Qgb0JpbmRpbmdDb250ZXh0ID0gb09iamVjdFBhZ2VMYXlvdXQuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0Y29uc3Qgb1BhdGggPSBvQmluZGluZ0NvbnRleHQgJiYgb0JpbmRpbmdDb250ZXh0LmdldFBhdGgoKTtcblx0Y29uc3Qgb01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChvUGF0aCk7XG5cdC8vIFNlbWFudGljIEtleSBWb2NhYnVsYXJ5XG5cdGNvbnN0IHNTZW1hbnRpY0tleVZvY2FidWxhcnkgPSBgJHtvTWV0YVBhdGh9L2AgKyBgQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY0tleWA7XG5cdC8vU2VtYW50aWMgS2V5c1xuXHRjb25zdCBhU2VtS2V5cyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KHNTZW1hbnRpY0tleVZvY2FidWxhcnkpO1xuXHQvLyBVbmF2YWlsYWJsZSBBY3Rpb25zXG5cdGNvbnN0IG9FbnRyeSA9IG9CaW5kaW5nQ29udGV4dC5nZXRPYmplY3QoKTtcblx0aWYgKCFvRW50cnkpIHtcblx0XHRvQmluZGluZ0NvbnRleHRcblx0XHRcdC5yZXF1ZXN0T2JqZWN0KClcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXF1ZXN0ZWRPYmplY3Q6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gdXBkYXRlUmVsYXRlQXBwc01vZGVsKG9CaW5kaW5nQ29udGV4dCwgcmVxdWVzdGVkT2JqZWN0LCBvT2JqZWN0UGFnZUxheW91dCwgYVNlbUtleXMsIG9NZXRhTW9kZWwsIG9NZXRhUGF0aCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgdXBkYXRlIHRoZSByZWxhdGVkIGFwcCBkZXRhaWxzXCIsIG9FcnJvcik7XG5cdFx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdXBkYXRlUmVsYXRlQXBwc01vZGVsKG9CaW5kaW5nQ29udGV4dCwgb0VudHJ5LCBvT2JqZWN0UGFnZUxheW91dCwgYVNlbUtleXMsIG9NZXRhTW9kZWwsIG9NZXRhUGF0aCk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gb0J1dHRvblxuICovXG5mdW5jdGlvbiBmbkZpcmVCdXR0b25QcmVzcyhvQnV0dG9uOiBhbnkpIHtcblx0Y29uc3QgYUF1dGhvcml6ZWRUeXBlcyA9IFtcInNhcC5tLkJ1dHRvblwiLCBcInNhcC5tLk92ZXJmbG93VG9vbGJhckJ1dHRvblwiXTtcblx0aWYgKG9CdXR0b24gJiYgYUF1dGhvcml6ZWRUeXBlcy5pbmRleE9mKG9CdXR0b24uZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCkpICE9PSAtMSAmJiBvQnV0dG9uLmdldFZpc2libGUoKSAmJiBvQnV0dG9uLmdldEVuYWJsZWQoKSkge1xuXHRcdG9CdXR0b24uZmlyZVByZXNzKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm5SZXNvbHZlU3RyaW5ndG9Cb29sZWFuKHNWYWx1ZTogYW55KSB7XG5cdGlmIChzVmFsdWUgPT09IFwidHJ1ZVwiIHx8IHNWYWx1ZSA9PT0gdHJ1ZSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRBcHBDb21wb25lbnQob0NvbnRyb2w6IGFueSk6IEFwcENvbXBvbmVudCB7XG5cdGlmIChvQ29udHJvbC5pc0EoXCJzYXAuZmUuY29yZS5BcHBDb21wb25lbnRcIikpIHtcblx0XHRyZXR1cm4gb0NvbnRyb2w7XG5cdH1cblx0Y29uc3Qgb093bmVyID0gQ29tcG9uZW50LmdldE93bmVyQ29tcG9uZW50Rm9yKG9Db250cm9sKTtcblx0aWYgKCFvT3duZXIpIHtcblx0XHRyZXR1cm4gb0NvbnRyb2w7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGdldEFwcENvbXBvbmVudChvT3duZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRQYWdlVmlldyhvQXBwQ29tcG9uZW50OiBBcHBDb21wb25lbnQpIHtcblx0Y29uc3Qgcm9vdFZpZXdDb250cm9sbGVyID0gb0FwcENvbXBvbmVudC5nZXRSb290Vmlld0NvbnRyb2xsZXIoKSBhcyBhbnk7XG5cdHJldHVybiByb290Vmlld0NvbnRyb2xsZXIuaXNGY2xFbmFibGVkKClcblx0XHQ/IHJvb3RWaWV3Q29udHJvbGxlci5nZXRSaWdodG1vc3RWaWV3KClcblx0XHQ6IENvbW1vblV0aWxzLmdldFRhcmdldFZpZXcoKG9BcHBDb21wb25lbnQuZ2V0Um9vdENvbnRhaW5lcigpIGFzIGFueSkuZ2V0Q3VycmVudFBhZ2UoKSk7XG59XG5cbmZ1bmN0aW9uIGdldFRhcmdldFZpZXcob0NvbnRyb2w6IGFueSkge1xuXHRpZiAob0NvbnRyb2wgJiYgb0NvbnRyb2wuaXNBKFwic2FwLnVpLmNvcmUuQ29tcG9uZW50Q29udGFpbmVyXCIpKSB7XG5cdFx0b0NvbnRyb2wgPSBvQ29udHJvbC5nZXRDb21wb25lbnRJbnN0YW5jZSgpO1xuXHRcdG9Db250cm9sID0gb0NvbnRyb2wgJiYgb0NvbnRyb2wuZ2V0Um9vdENvbnRyb2woKTtcblx0fVxuXHR3aGlsZSAob0NvbnRyb2wgJiYgIW9Db250cm9sLmlzQShcInNhcC51aS5jb3JlLm12Yy5WaWV3XCIpKSB7XG5cdFx0b0NvbnRyb2wgPSBvQ29udHJvbC5nZXRQYXJlbnQoKTtcblx0fVxuXHRyZXR1cm4gb0NvbnRyb2w7XG59XG5cbmZ1bmN0aW9uIGlzRmllbGRDb250cm9sUGF0aEluYXBwbGljYWJsZShzRmllbGRDb250cm9sUGF0aDogc3RyaW5nLCBvQXR0cmlidXRlOiBhbnkpIHtcblx0bGV0IGJJbmFwcGxpY2FibGUgPSBmYWxzZTtcblx0Y29uc3QgYVBhcnRzID0gc0ZpZWxkQ29udHJvbFBhdGguc3BsaXQoXCIvXCIpO1xuXHQvLyBzZW5zaXRpdmUgZGF0YSBpcyByZW1vdmVkIG9ubHkgaWYgdGhlIHBhdGggaGFzIGFscmVhZHkgYmVlbiByZXNvbHZlZC5cblx0aWYgKGFQYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0YkluYXBwbGljYWJsZSA9IG9BdHRyaWJ1dGVbYVBhcnRzWzBdXSAmJiBvQXR0cmlidXRlW2FQYXJ0c1swXV0uaGFzT3duUHJvcGVydHkoYVBhcnRzWzFdKSAmJiBvQXR0cmlidXRlW2FQYXJ0c1swXV1bYVBhcnRzWzFdXSA9PT0gMDtcblx0fSBlbHNlIHtcblx0XHRiSW5hcHBsaWNhYmxlID0gb0F0dHJpYnV0ZVtzRmllbGRDb250cm9sUGF0aF0gPT09IDA7XG5cdH1cblx0cmV0dXJuIGJJbmFwcGxpY2FibGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNlbnNpdGl2ZURhdGEoYUF0dHJpYnV0ZXM6IGFueVtdLCBvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCkge1xuXHRjb25zdCBhT3V0QXR0cmlidXRlcyA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGFBdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qgc0VudGl0eVNldCA9IGFBdHRyaWJ1dGVzW2ldLmVudGl0eVNldCxcblx0XHRcdG9BdHRyaWJ1dGUgPSBhQXR0cmlidXRlc1tpXS5jb250ZXh0RGF0YTtcblxuXHRcdGRlbGV0ZSBvQXR0cmlidXRlW1wiQG9kYXRhLmNvbnRleHRcIl07XG5cdFx0ZGVsZXRlIG9BdHRyaWJ1dGVbXCIlNDBvZGF0YS5jb250ZXh0XCJdO1xuXHRcdGRlbGV0ZSBvQXR0cmlidXRlW1wiQG9kYXRhLm1ldGFkYXRhRXRhZ1wiXTtcblx0XHRkZWxldGUgb0F0dHJpYnV0ZVtcIiU0MG9kYXRhLm1ldGFkYXRhRXRhZ1wiXTtcblx0XHRkZWxldGUgb0F0dHJpYnV0ZVtcIlNBUF9fTWVzc2FnZXNcIl07XG5cdFx0Y29uc3QgYVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhvQXR0cmlidXRlKTtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGFQcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRjb25zdCBzUHJvcCA9IGFQcm9wZXJ0aWVzW2pdLFxuXHRcdFx0XHRhUHJvcGVydHlBbm5vdGF0aW9ucyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtzRW50aXR5U2V0fS8ke3NQcm9wfUBgKTtcblx0XHRcdGlmIChhUHJvcGVydHlBbm5vdGF0aW9ucykge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0YVByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLklzUG90ZW50aWFsbHlTZW5zaXRpdmVcIl0gfHxcblx0XHRcdFx0XHRhUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5FeGNsdWRlRnJvbU5hdmlnYXRpb25Db250ZXh0XCJdIHx8XG5cdFx0XHRcdFx0YVByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLk1lYXN1cmVcIl1cblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0ZGVsZXRlIG9BdHRyaWJ1dGVbc1Byb3BdO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFQcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWVsZENvbnRyb2xcIl0pIHtcblx0XHRcdFx0XHRjb25zdCBvRmllbGRDb250cm9sID0gYVByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpZWxkQ29udHJvbFwiXTtcblx0XHRcdFx0XHRpZiAob0ZpZWxkQ29udHJvbFtcIiRFbnVtTWVtYmVyXCJdICYmIG9GaWVsZENvbnRyb2xbXCIkRW51bU1lbWJlclwiXS5zcGxpdChcIi9cIilbMV0gPT09IFwiSW5hcHBsaWNhYmxlXCIpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBvQXR0cmlidXRlW3NQcm9wXTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG9GaWVsZENvbnRyb2xbXCIkUGF0aFwiXSAmJiBDb21tb25VdGlscy5pc0ZpZWxkQ29udHJvbFBhdGhJbmFwcGxpY2FibGUob0ZpZWxkQ29udHJvbFtcIiRQYXRoXCJdLCBvQXR0cmlidXRlKSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG9BdHRyaWJ1dGVbc1Byb3BdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRhT3V0QXR0cmlidXRlcy5wdXNoKG9BdHRyaWJ1dGUpO1xuXHR9XG5cblx0cmV0dXJuIGFPdXRBdHRyaWJ1dGVzO1xufVxuXG5mdW5jdGlvbiBfZm5DaGVja0lzTWF0Y2gob09iamVjdDogYW55LCBvS2V5c1RvQ2hlY2s6IGFueSkge1xuXHRmb3IgKGNvbnN0IHNLZXkgaW4gb0tleXNUb0NoZWNrKSB7XG5cdFx0aWYgKG9LZXlzVG9DaGVja1tzS2V5XSAhPT0gb09iamVjdFtzS2V5XSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZm5HZXRDb250ZXh0UGF0aFByb3BlcnRpZXMob01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwsIHNDb250ZXh0UGF0aDogc3RyaW5nLCBvRmlsdGVyPzogb2JqZWN0KSB7XG5cdGNvbnN0IG9FbnRpdHlUeXBlID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c0NvbnRleHRQYXRofS9gKSB8fCB7fSxcblx0XHRvUHJvcGVydGllczogYW55ID0ge307XG5cblx0Zm9yIChjb25zdCBzS2V5IGluIG9FbnRpdHlUeXBlKSB7XG5cdFx0aWYgKFxuXHRcdFx0b0VudGl0eVR5cGUuaGFzT3duUHJvcGVydHkoc0tleSkgJiZcblx0XHRcdCEvXlxcJC9pLnRlc3Qoc0tleSkgJiZcblx0XHRcdG9FbnRpdHlUeXBlW3NLZXldLiRraW5kICYmXG5cdFx0XHRfZm5DaGVja0lzTWF0Y2gob0VudGl0eVR5cGVbc0tleV0sIG9GaWx0ZXIgfHwgeyAka2luZDogXCJQcm9wZXJ0eVwiIH0pXG5cdFx0KSB7XG5cdFx0XHRvUHJvcGVydGllc1tzS2V5XSA9IG9FbnRpdHlUeXBlW3NLZXldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb1Byb3BlcnRpZXM7XG59XG5cbmZ1bmN0aW9uIGZuR2V0TWFuZGF0b3J5RmlsdGVyRmllbGRzKG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLCBzQ29udGV4dFBhdGg6IHN0cmluZykge1xuXHRsZXQgYU1hbmRhdG9yeUZpbHRlckZpZWxkcztcblx0aWYgKG9NZXRhTW9kZWwgJiYgc0NvbnRleHRQYXRoKSB7XG5cdFx0YU1hbmRhdG9yeUZpbHRlckZpZWxkcyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NDb250ZXh0UGF0aH1AT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5GaWx0ZXJSZXN0cmljdGlvbnMvUmVxdWlyZWRQcm9wZXJ0aWVzYCk7XG5cdH1cblx0cmV0dXJuIGFNYW5kYXRvcnlGaWx0ZXJGaWVsZHM7XG59XG5cbmZ1bmN0aW9uIGZuR2V0SUJOQWN0aW9ucyhvQ29udHJvbDogYW55LCBhSUJOQWN0aW9uczogYW55W10pIHtcblx0Y29uc3QgYUFjdGlvbnMgPSBvQ29udHJvbCAmJiBvQ29udHJvbC5nZXRBY3Rpb25zKCk7XG5cdGlmIChhQWN0aW9ucykge1xuXHRcdGFBY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKG9BY3Rpb246IGFueSkge1xuXHRcdFx0aWYgKG9BY3Rpb24uaXNBKFwic2FwLnVpLm1kYy5hY3Rpb250b29sYmFyLkFjdGlvblRvb2xiYXJBY3Rpb25cIikpIHtcblx0XHRcdFx0b0FjdGlvbiA9IG9BY3Rpb24uZ2V0QWN0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob0FjdGlvbi5pc0EoXCJzYXAubS5NZW51QnV0dG9uXCIpKSB7XG5cdFx0XHRcdGNvbnN0IG9NZW51ID0gb0FjdGlvbi5nZXRNZW51KCk7XG5cdFx0XHRcdGNvbnN0IGFJdGVtcyA9IG9NZW51LmdldEl0ZW1zKCk7XG5cdFx0XHRcdGFJdGVtcy5mb3JFYWNoKChvSXRlbTogYW55KSA9PiB7XG5cdFx0XHRcdFx0aWYgKG9JdGVtLmRhdGEoXCJJQk5EYXRhXCIpKSB7XG5cdFx0XHRcdFx0XHRhSUJOQWN0aW9ucy5wdXNoKG9JdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmIChvQWN0aW9uLmRhdGEoXCJJQk5EYXRhXCIpKSB7XG5cdFx0XHRcdGFJQk5BY3Rpb25zLnB1c2gob0FjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGFJQk5BY3Rpb25zO1xufVxuXG4vKipcbiAqIEBwYXJhbSBhSUJOQWN0aW9uc1xuICogQHBhcmFtIG9WaWV3XG4gKi9cbmZ1bmN0aW9uIGZuVXBkYXRlRGF0YUZpZWxkRm9ySUJOQnV0dG9uc1Zpc2liaWxpdHkoYUlCTkFjdGlvbnM6IGFueVtdLCBvVmlldzogVmlldykge1xuXHRjb25zdCBvUGFyYW1zOiBhbnkgPSB7fTtcblx0Y29uc3QgZm5HZXRMaW5rcyA9IGZ1bmN0aW9uIChvRGF0YT86IGFueSkge1xuXHRcdGlmIChvRGF0YSkge1xuXHRcdFx0Y29uc3QgYUtleXMgPSBPYmplY3Qua2V5cyhvRGF0YSk7XG5cdFx0XHRhS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChzS2V5OiBzdHJpbmcpIHtcblx0XHRcdFx0aWYgKHNLZXkuaW5kZXhPZihcIl9cIikgIT09IDAgJiYgc0tleS5pbmRleE9mKFwib2RhdGEuY29udGV4dFwiKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRvUGFyYW1zW3NLZXldID0geyB2YWx1ZTogb0RhdGFbc0tleV0gfTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmIChhSUJOQWN0aW9ucy5sZW5ndGgpIHtcblx0XHRcdGFJQk5BY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKG9JQk5BY3Rpb246IGFueSkge1xuXHRcdFx0XHRjb25zdCBzU2VtYW50aWNPYmplY3QgPSBvSUJOQWN0aW9uLmRhdGEoXCJJQk5EYXRhXCIpLnNlbWFudGljT2JqZWN0O1xuXHRcdFx0XHRjb25zdCBzQWN0aW9uID0gb0lCTkFjdGlvbi5kYXRhKFwiSUJORGF0YVwiKS5hY3Rpb247XG5cdFx0XHRcdENvbW1vblV0aWxzLmdldFNoZWxsU2VydmljZXMob1ZpZXcpXG5cdFx0XHRcdFx0LmdldExpbmtzKHtcblx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBzU2VtYW50aWNPYmplY3QsXG5cdFx0XHRcdFx0XHRhY3Rpb246IHNBY3Rpb24sXG5cdFx0XHRcdFx0XHRwYXJhbXM6IG9QYXJhbXNcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChhTGluazogYW55KSB7XG5cdFx0XHRcdFx0XHRvSUJOQWN0aW9uLnNldFZpc2libGUob0lCTkFjdGlvbi5nZXRWaXNpYmxlKCkgJiYgYUxpbmsgJiYgYUxpbmsubGVuZ3RoID09PSAxKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihcIkNhbm5vdCByZXRyaWV2ZSB0aGUgbGlua3MgZnJvbSB0aGUgc2hlbGwgc2VydmljZVwiLCBvRXJyb3IpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRpZiAob1ZpZXcgJiYgb1ZpZXcuZ2V0QmluZGluZ0NvbnRleHQoKSkge1xuXHRcdChvVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpIGFzIGFueSlcblx0XHRcdD8ucmVxdWVzdE9iamVjdCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAob0RhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZm5HZXRMaW5rcyhvRGF0YSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgcmV0cmlldmUgdGhlIGxpbmtzIGZyb20gdGhlIHNoZWxsIHNlcnZpY2VcIiwgb0Vycm9yKTtcblx0XHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGZuR2V0TGlua3MoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRUcmFuc2xhdGVkVGV4dChzRnJhbWV3b3JrS2V5OiBzdHJpbmcsIG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGUsIG9QYXJhbXM/OiBhbnksIHNFbnRpdHlTZXROYW1lPzogc3RyaW5nKSB7XG5cdGxldCBzUmVzb3VyY2VLZXkgPSBzRnJhbWV3b3JrS2V5O1xuXHRpZiAob1Jlc291cmNlQnVuZGxlKSB7XG5cdFx0aWYgKHNFbnRpdHlTZXROYW1lKSB7XG5cdFx0XHQvLyBUaGVyZSBhcmUgY29uc29sZSBlcnJvcnMgbG9nZ2VkIHdoZW4gbWFraW5nIGNhbGxzIHRvIGdldFRleHQgZm9yIGtleXMgdGhhdCBhcmUgbm90IGRlZmluZWQgaW4gdGhlIHJlc291cmNlIGJ1bmRsZVxuXHRcdFx0Ly8gZm9yIGluc3RhbmNlIGtleXMgd2hpY2ggYXJlIHN1cHBvc2VkIHRvIGJlIHByb3ZpZGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiwgZS5nLCA8a2V5Pnw8ZW50aXR5U2V0PiB0byBvdmVycmlkZSBpbnN0YW5jZSBzcGVjaWZpYyB0ZXh0XG5cdFx0XHQvLyBoZW5jZSBjaGVjayBpZiB0ZXh0IGV4aXN0cyAodXNpbmcgXCJoYXNUZXh0XCIpIGluIHRoZSByZXNvdXJjZSBidW5kbGUgYmVmb3JlIGNhbGxpbmcgXCJnZXRUZXh0XCJcblxuXHRcdFx0Ly8gXCJoYXNUZXh0XCIgb25seSBjaGVja3MgZm9yIHRoZSBrZXkgaW4gdGhlIGltbWVkaWF0ZSByZXNvdXJjZSBidW5kbGUgYW5kIG5vdCBpdCdzIGN1c3RvbSBidW5kbGVzXG5cdFx0XHQvLyBoZW5jZSB3ZSBuZWVkIHRvIGRvIHRoaXMgcmVjdXJyc2l2ZWx5IHRvIGNoZWNrIGlmIHRoZSBrZXkgZXhpc3RzIGluIGFueSBvZiB0aGUgYnVuZGxlcyB0aGUgZm9ybXMgdGhlIEZFIHJlc291cmNlIGJ1bmRsZVxuXHRcdFx0Y29uc3QgYlJlc291cmNlS2V5RXhpc3RzID0gY2hlY2tJZlJlc291cmNlS2V5RXhpc3RzKFxuXHRcdFx0XHQob1Jlc291cmNlQnVuZGxlIGFzIGFueSkuYUN1c3RvbUJ1bmRsZXMsXG5cdFx0XHRcdGAke3NGcmFtZXdvcmtLZXl9fCR7c0VudGl0eVNldE5hbWV9YFxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gaWYgcmVzb3VyY2Uga2V5IHdpdGggZW50aXR5IHNldCBuYW1lIGZvciBpbnN0YW5jZSBzcGVjaWZpYyB0ZXh0IG92ZXJyaWRpbmcgaXMgcHJvdmlkZWQgYnkgdGhlIGFwcGxpY2F0aW9uXG5cdFx0XHQvLyB0aGVuIHVzZSB0aGUgc2FtZSBrZXkgb3RoZXJ3aXNlIHVzZSB0aGUgRnJhbWV3b3JrIGtleVxuXHRcdFx0c1Jlc291cmNlS2V5ID0gYlJlc291cmNlS2V5RXhpc3RzID8gYCR7c0ZyYW1ld29ya0tleX18JHtzRW50aXR5U2V0TmFtZX1gIDogc0ZyYW1ld29ya0tleTtcblx0XHR9XG5cdFx0cmV0dXJuIG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KHNSZXNvdXJjZUtleSwgb1BhcmFtcyk7XG5cdH1cblxuXHQvLyBkbyBub3QgYWxsb3cgb3ZlcnJpZGUgc28gZ2V0IHRleHQgZnJvbSB0aGUgaW50ZXJuYWwgYnVuZGxlIGRpcmVjdGx5XG5cdG9SZXNvdXJjZUJ1bmRsZSA9IENvcmUuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIik7XG5cdHJldHVybiBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChzUmVzb3VyY2VLZXksIG9QYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBjaGVja0lmUmVzb3VyY2VLZXlFeGlzdHMoYUN1c3RvbUJ1bmRsZXM6IGFueSwgc0tleTogYW55KSB7XG5cdGlmIChhQ3VzdG9tQnVuZGxlcy5sZW5ndGgpIHtcblx0XHRmb3IgKGxldCBpID0gYUN1c3RvbUJ1bmRsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IHNWYWx1ZSA9IGFDdXN0b21CdW5kbGVzW2ldLmhhc1RleHQoc0tleSk7XG5cdFx0XHQvLyB0ZXh0IGZvdW5kIHJldHVybiB0cnVlXG5cdFx0XHRpZiAoc1ZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Y2hlY2tJZlJlc291cmNlS2V5RXhpc3RzKGFDdXN0b21CdW5kbGVzW2ldLmFDdXN0b21CdW5kbGVzLCBzS2V5KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRBY3Rpb25QYXRoKG9BY3Rpb246IGFueSwgYlJldHVybk9ubHlQYXRoOiBib29sZWFuLCBzQWN0aW9uTmFtZT86IHN0cmluZywgYkNoZWNrU3RhdGljVmFsdWU/OiBib29sZWFuKSB7XG5cdHNBY3Rpb25OYW1lID0gIXNBY3Rpb25OYW1lID8gb0FjdGlvbi5nZXRPYmplY3Qob0FjdGlvbi5nZXRQYXRoKCkpIDogc0FjdGlvbk5hbWU7XG5cdGxldCBzQ29udGV4dFBhdGggPSBvQWN0aW9uLmdldFBhdGgoKS5zcGxpdChcIi9AXCIpWzBdO1xuXHRjb25zdCBzRW50aXR5VHlwZU5hbWUgPSBvQWN0aW9uLmdldE9iamVjdChzQ29udGV4dFBhdGgpLiRUeXBlO1xuXHRjb25zdCBzRW50aXR5TmFtZSA9IGdldEVudGl0eVNldE5hbWUob0FjdGlvbi5nZXRNb2RlbCgpLCBzRW50aXR5VHlwZU5hbWUpO1xuXHRpZiAoc0VudGl0eU5hbWUpIHtcblx0XHRzQ29udGV4dFBhdGggPSBgLyR7c0VudGl0eU5hbWV9YDtcblx0fVxuXHRpZiAoYkNoZWNrU3RhdGljVmFsdWUpIHtcblx0XHRyZXR1cm4gb0FjdGlvbi5nZXRPYmplY3QoYCR7c0NvbnRleHRQYXRofS8ke3NBY3Rpb25OYW1lfUBPcmcuT0RhdGEuQ29yZS5WMS5PcGVyYXRpb25BdmFpbGFibGVgKTtcblx0fVxuXHRpZiAoYlJldHVybk9ubHlQYXRoKSB7XG5cdFx0cmV0dXJuIGAke3NDb250ZXh0UGF0aH0vJHtzQWN0aW9uTmFtZX1gO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzQ29udGV4dFBhdGg6IHNDb250ZXh0UGF0aCxcblx0XHRcdHNQcm9wZXJ0eTogb0FjdGlvbi5nZXRPYmplY3QoYCR7c0NvbnRleHRQYXRofS8ke3NBY3Rpb25OYW1lfUBPcmcuT0RhdGEuQ29yZS5WMS5PcGVyYXRpb25BdmFpbGFibGUvJFBhdGhgKSxcblx0XHRcdHNCaW5kaW5nUGFyYW1ldGVyOiBvQWN0aW9uLmdldE9iamVjdChgJHtzQ29udGV4dFBhdGh9LyR7c0FjdGlvbk5hbWV9L0AkdWk1Lm92ZXJsb2FkLzAvJFBhcmFtZXRlci8wLyROYW1lYClcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldEVudGl0eVNldE5hbWUob01ldGFNb2RlbDogYW55LCBzRW50aXR5VHlwZTogYW55KSB7XG5cdGNvbnN0IG9FbnRpdHlDb250YWluZXIgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcIi9cIik7XG5cdGZvciAoY29uc3Qga2V5IGluIG9FbnRpdHlDb250YWluZXIpIHtcblx0XHRpZiAodHlwZW9mIG9FbnRpdHlDb250YWluZXJba2V5XSA9PT0gXCJvYmplY3RcIiAmJiBvRW50aXR5Q29udGFpbmVyW2tleV0uJFR5cGUgPT09IHNFbnRpdHlUeXBlKSB7XG5cdFx0XHRyZXR1cm4ga2V5O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjb21wdXRlRGlzcGxheU1vZGUob1Byb3BlcnR5QW5ub3RhdGlvbnM6IGFueSwgb0NvbGxlY3Rpb25Bbm5vdGF0aW9ucz86IGFueSkge1xuXHRjb25zdCBvVGV4dEFubm90YXRpb24gPSBvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiXSxcblx0XHRvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbiA9XG5cdFx0XHRvVGV4dEFubm90YXRpb24gJiZcblx0XHRcdCgob1Byb3BlcnR5QW5ub3RhdGlvbnMgJiZcblx0XHRcdFx0b1Byb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50XCJdKSB8fFxuXHRcdFx0XHQob0NvbGxlY3Rpb25Bbm5vdGF0aW9ucyAmJiBvQ29sbGVjdGlvbkFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFwiXSkpO1xuXG5cdGlmIChvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbikge1xuXHRcdGlmIChvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbi4kRW51bU1lbWJlciA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRPbmx5XCIpIHtcblx0XHRcdHJldHVybiBcIkRlc2NyaXB0aW9uXCI7XG5cdFx0fSBlbHNlIGlmIChvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbi4kRW51bU1lbWJlciA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRMYXN0XCIpIHtcblx0XHRcdHJldHVybiBcIlZhbHVlRGVzY3JpcHRpb25cIjtcblx0XHR9IGVsc2UgaWYgKG9UZXh0QXJyYW5nZW1lbnRBbm5vdGF0aW9uLiRFbnVtTWVtYmVyID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFR5cGUvVGV4dFNlcGFyYXRlXCIpIHtcblx0XHRcdHJldHVybiBcIlZhbHVlXCI7XG5cdFx0fVxuXHRcdC8vRGVmYXVsdCBzaG91bGQgYmUgVGV4dEZpcnN0IGlmIHRoZXJlIGlzIGEgVGV4dCBhbm5vdGF0aW9uIGFuZCBuZWl0aGVyIFRleHRPbmx5IG5vciBUZXh0TGFzdCBhcmUgc2V0XG5cdFx0cmV0dXJuIFwiRGVzY3JpcHRpb25WYWx1ZVwiO1xuXHR9XG5cdHJldHVybiBvVGV4dEFubm90YXRpb24gPyBcIkRlc2NyaXB0aW9uVmFsdWVcIiA6IFwiVmFsdWVcIjtcbn1cblxuZnVuY3Rpb24gX2dldEVudGl0eVR5cGUob0NvbnRleHQ6IGFueSkge1xuXHRjb25zdCBvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0cmV0dXJuIG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke29NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob0NvbnRleHQuZ2V0UGF0aCgpKX0vJFR5cGVgKTtcbn1cblxuZnVuY3Rpb24gX3JlcXVlc3RPYmplY3Qoc0FjdGlvbjogYW55LCBvU2VsZWN0ZWRDb250ZXh0OiBhbnksIHNQcm9wZXJ0eTogYW55KSB7XG5cdGxldCBvQ29udGV4dCA9IG9TZWxlY3RlZENvbnRleHQ7XG5cdGNvbnN0IG5CcmFja2V0SW5kZXggPSBzQWN0aW9uLmluZGV4T2YoXCIoXCIpO1xuXG5cdGlmIChuQnJhY2tldEluZGV4ID4gLTEpIHtcblx0XHRjb25zdCBzVGFyZ2V0VHlwZSA9IHNBY3Rpb24uc2xpY2UobkJyYWNrZXRJbmRleCArIDEsIC0xKTtcblx0XHRsZXQgc0N1cnJlbnRUeXBlID0gX2dldEVudGl0eVR5cGUob0NvbnRleHQpO1xuXG5cdFx0d2hpbGUgKHNDdXJyZW50VHlwZSAhPT0gc1RhcmdldFR5cGUpIHtcblx0XHRcdC8vIEZpbmQgcGFyZW50IGJpbmRpbmcgY29udGV4dCBhbmQgcmV0cmlldmUgZW50aXR5IHR5cGVcblx0XHRcdG9Db250ZXh0ID0gb0NvbnRleHQuZ2V0QmluZGluZygpLmdldENvbnRleHQoKTtcblx0XHRcdGlmIChvQ29udGV4dCkge1xuXHRcdFx0XHRzQ3VycmVudFR5cGUgPSBfZ2V0RW50aXR5VHlwZShvQ29udGV4dCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRMb2cud2FybmluZyhcIkNhbm5vdCBkZXRlcm1pbmUgdGFyZ2V0IHR5cGUgdG8gcmVxdWVzdCBwcm9wZXJ0eSB2YWx1ZSBmb3IgYm91bmQgYWN0aW9uIGludm9jYXRpb25cIik7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb0NvbnRleHQucmVxdWVzdE9iamVjdChzUHJvcGVydHkpO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0UHJvcGVydHkob1NlbGVjdGVkQ29udGV4dDogYW55LCBzQWN0aW9uOiBhbnksIHNQcm9wZXJ0eTogYW55LCBzRHluYW1pY0FjdGlvbkVuYWJsZWRQYXRoOiBhbnkpIHtcblx0Y29uc3Qgb1Byb21pc2UgPVxuXHRcdHNQcm9wZXJ0eSAmJiBzUHJvcGVydHkuaW5kZXhPZihcIi9cIikgPT09IDBcblx0XHRcdD8gcmVxdWVzdFNpbmdsZXRvblByb3BlcnR5KHNQcm9wZXJ0eSwgb1NlbGVjdGVkQ29udGV4dC5nZXRNb2RlbCgpKVxuXHRcdFx0OiBfcmVxdWVzdE9iamVjdChzQWN0aW9uLCBvU2VsZWN0ZWRDb250ZXh0LCBzUHJvcGVydHkpO1xuXG5cdHJldHVybiBvUHJvbWlzZS50aGVuKGZ1bmN0aW9uICh2UHJvcGVydHlWYWx1ZTogYW55KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG5cdFx0XHR2UHJvcGVydHlWYWx1ZTogdlByb3BlcnR5VmFsdWUsXG5cdFx0XHRvU2VsZWN0ZWRDb250ZXh0OiBvU2VsZWN0ZWRDb250ZXh0LFxuXHRcdFx0c0FjdGlvbjogc0FjdGlvbixcblx0XHRcdHNEeW5hbWljQWN0aW9uRW5hYmxlZFBhdGg6IHNEeW5hbWljQWN0aW9uRW5hYmxlZFBhdGhcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldENvbnRleHRzQmFzZWRPbk9wZXJhdGlvbkF2YWlsYWJsZShvSW50ZXJuYWxNb2RlbENvbnRleHQ6IGFueSwgYVJlcXVlc3RQcm9taXNlczogYW55KSB7XG5cdHJldHVybiBQcm9taXNlLmFsbChhUmVxdWVzdFByb21pc2VzKVxuXHRcdC50aGVuKGZ1bmN0aW9uIChhUmVzdWx0czogYW55W10pIHtcblx0XHRcdGlmIChhUmVzdWx0cy5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc3QgYUFwcGxpY2FibGVDb250ZXh0czogYW55W10gPSBbXSxcblx0XHRcdFx0XHRhTm90QXBwbGljYWJsZUNvbnRleHRzOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRhUmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChhUmVzdWx0OiBhbnkpIHtcblx0XHRcdFx0XHRpZiAoYVJlc3VsdCkge1xuXHRcdFx0XHRcdFx0aWYgKGFSZXN1bHQudlByb3BlcnR5VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LmdldE1vZGVsKCkuc2V0UHJvcGVydHkoYVJlc3VsdC5zRHluYW1pY0FjdGlvbkVuYWJsZWRQYXRoLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0YUFwcGxpY2FibGVDb250ZXh0cy5wdXNoKGFSZXN1bHQub1NlbGVjdGVkQ29udGV4dCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhTm90QXBwbGljYWJsZUNvbnRleHRzLnB1c2goYVJlc3VsdC5vU2VsZWN0ZWRDb250ZXh0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzZXREeW5hbWljQWN0aW9uQ29udGV4dHMob0ludGVybmFsTW9kZWxDb250ZXh0LCBhUmVzdWx0c1swXS5zQWN0aW9uLCBhQXBwbGljYWJsZUNvbnRleHRzLCBhTm90QXBwbGljYWJsZUNvbnRleHRzKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdExvZy50cmFjZShcIkNhbm5vdCByZXRyaWV2ZSBwcm9wZXJ0eSB2YWx1ZSBmcm9tIHBhdGhcIiwgb0Vycm9yKTtcblx0XHR9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gb0ludGVybmFsTW9kZWxDb250ZXh0XG4gKiBAcGFyYW0gc0FjdGlvblxuICogQHBhcmFtIGFBcHBsaWNhYmxlXG4gKiBAcGFyYW0gYU5vdEFwcGxpY2FibGVcbiAqL1xuZnVuY3Rpb24gc2V0RHluYW1pY0FjdGlvbkNvbnRleHRzKG9JbnRlcm5hbE1vZGVsQ29udGV4dDogYW55LCBzQWN0aW9uOiBhbnksIGFBcHBsaWNhYmxlOiBhbnksIGFOb3RBcHBsaWNhYmxlOiBhbnkpIHtcblx0Y29uc3Qgc0R5bmFtaWNBY3Rpb25QYXRoUHJlZml4ID0gYCR7b0ludGVybmFsTW9kZWxDb250ZXh0LmdldFBhdGgoKX0vZHluYW1pY0FjdGlvbnMvJHtzQWN0aW9ufWAsXG5cdFx0b0ludGVybmFsTW9kZWwgPSBvSW50ZXJuYWxNb2RlbENvbnRleHQuZ2V0TW9kZWwoKTtcblx0b0ludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoYCR7c0R5bmFtaWNBY3Rpb25QYXRoUHJlZml4fS9hQXBwbGljYWJsZWAsIGFBcHBsaWNhYmxlKTtcblx0b0ludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoYCR7c0R5bmFtaWNBY3Rpb25QYXRoUHJlZml4fS9hTm90QXBwbGljYWJsZWAsIGFOb3RBcHBsaWNhYmxlKTtcbn1cblxuZnVuY3Rpb24gX2dldERlZmF1bHRPcGVyYXRvcnMoc1Byb3BlcnR5VHlwZT86IHN0cmluZykge1xuXHQvLyBtZGMgZGVmaW5lcyB0aGUgZnVsbCBzZXQgb2Ygb3BlcmF0aW9ucyB0aGF0IGFyZSBtZWFuaW5nZnVsIGZvciBlYWNoIEVkbSBUeXBlXG5cdC8vIFRPRE8gUmVwbGFjZSB3aXRoIG1vZGVsIC8gaW50ZXJuYWwgd2F5IG9mIHJldHJpZXZpbmcgdGhlIGFjdHVhbCBtb2RlbCB0eXBlIHVzZWQgZm9yIHRoZSBwcm9wZXJ0eVxuXHRjb25zdCBvRGF0YUNsYXNzID0gVHlwZVV0aWwuZ2V0RGF0YVR5cGVDbGFzc05hbWUoc1Byb3BlcnR5VHlwZSk7XG5cdC8vIFRPRE8gbmVlZCB0byBwYXNzIHByb3BlciBmb3JtYXRPcHRpb25zLCBjb25zdHJhaW50cyBoZXJlXG5cdGNvbnN0IG9CYXNlVHlwZSA9IFR5cGVVdGlsLmdldEJhc2VUeXBlKG9EYXRhQ2xhc3MsIHt9LCB7fSk7XG5cdHJldHVybiBGaWx0ZXJPcGVyYXRvclV0aWwuZ2V0T3BlcmF0b3JzRm9yVHlwZShvQmFzZVR5cGUpO1xufVxuXG5mdW5jdGlvbiBfZ2V0UmVzdHJpY3Rpb25zKGFEZWZhdWx0T3BzOiBhbnksIGFFeHByZXNzaW9uT3BzOiBhbnkpOiBzdHJpbmcge1xuXHQvLyBGcm9tIHRoZSBkZWZhdWx0IHNldCBvZiBPcGVyYXRvcnMgZm9yIHRoZSBCYXNlIFR5cGUsIHNlbGVjdCB0aG9zZSB0aGF0IGFyZSBkZWZpbmVkIGluIHRoZSBBbGxvd2VkIFZhbHVlLlxuXHQvLyBJbiBjYXNlIHRoYXQgbm8gb3BlcmF0b3JzIGFyZSBmb3VuZCwgcmV0dXJuIHVuZGVmaW5lZCBzbyB0aGF0IHRoZSBkZWZhdWx0IHNldCBpcyB1c2VkLlxuXHRjb25zdCBhT3BlcmF0b3JzID0gYURlZmF1bHRPcHMuZmlsdGVyKGZ1bmN0aW9uIChzRWxlbWVudDogYW55KSB7XG5cdFx0cmV0dXJuIGFFeHByZXNzaW9uT3BzLmluZGV4T2Yoc0VsZW1lbnQpID4gLTE7XG5cdH0pO1xuXHRyZXR1cm4gYU9wZXJhdG9ycy50b1N0cmluZygpIHx8IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZ2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbihhRXhwcmVzc2lvbnM6IGFueSkge1xuXHRjb25zdCBhQWxsb3dlZEV4cHJlc3Npb25zUHJpb3JpdHkgPSBDb21tb25VdGlscy5BbGxvd2VkRXhwcmVzc2lvbnNQcmlvO1xuXG5cdGFFeHByZXNzaW9ucy5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xuXHRcdHJldHVybiBhQWxsb3dlZEV4cHJlc3Npb25zUHJpb3JpdHkuaW5kZXhPZihhKSAtIGFBbGxvd2VkRXhwcmVzc2lvbnNQcmlvcml0eS5pbmRleE9mKGIpO1xuXHR9KTtcblxuXHRyZXR1cm4gYUV4cHJlc3Npb25zWzBdO1xufVxuXG4vKipcbiAqIE1ldGhvZCB0byBmZXRjaCB0aGUgY29ycmVjdCBvcGVyYXRvcnMgYmFzZWQgb24gdGhlIGZpbHRlciByZXN0cmljdGlvbnMgdGhhdCBjYW4gYmUgYW5ub3RhdGVkIG9uIGFuIGVudGl0eSBzZXQgb3IgYSBuYXZpZ2F0aW9uIHByb3BlcnR5LlxuICogV2UgcmV0dXJuIHRoZSBjb3JyZWN0IG9wZXJhdG9ycyBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIHJlc3RyaWN0aW9uIGFuZCBhbHNvIGNoZWNrIGZvciB0aGUgb3BlcmF0b3JzIGRlZmluZWQgaW4gdGhlIG1hbmlmZXN0IHRvIGluY2x1ZGUgb3IgZXhjbHVkZSB0aGVtLlxuICpcbiAqIEBwYXJhbSBzUHJvcGVydHkgU3RyaW5nIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0gc0VudGl0eVNldFBhdGggU3RyaW5nIHBhdGggdG8gdGhlIGVudGl0eSBzZXRcbiAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IHVzZWQgZHVyaW5nIHRlbXBsYXRpbmdcbiAqIEBwYXJhbSBzVHlwZSBTdHJpbmcgZGF0YSB0eXBlIG9kIHRoZSBwcm9wZXJ0eSwgZm9yIGV4YW1wbGUgZWRtLkRhdGVcbiAqIEBwYXJhbSBiVXNlU2VtYW50aWNEYXRlUmFuZ2UgQm9vbGVhbiBwYXNzZWQgZnJvbSB0aGUgbWFuaWZlc3QgZm9yIHNlbWFudGljIGRhdGUgcmFuZ2VcbiAqIEBwYXJhbSBzU2V0dGluZ3MgU3RyaW5naWZpZWQgb2JqZWN0IG9mIHRoZSBwcm9wZXJ0eSBzZXR0aW5nc1xuICogQHJldHVybnMgU3RyaW5nIGNvbnRhaW5pbmcgY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2Ygb3BlcmF0b3JzIGZvciBmaWx0ZXJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE9wZXJhdG9yc0ZvclByb3BlcnR5KFxuXHRzUHJvcGVydHk6IHN0cmluZyxcblx0c0VudGl0eVNldFBhdGg6IHN0cmluZyxcblx0b0NvbnRleHQ6IENvbnRleHQsXG5cdHNUeXBlPzogc3RyaW5nLFxuXHRiVXNlU2VtYW50aWNEYXRlUmFuZ2U/OiBib29sZWFuIHwgc3RyaW5nLFxuXHRzU2V0dGluZ3M/OiBzdHJpbmdcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IG9GaWx0ZXJSZXN0cmljdGlvbnMgPSBDb21tb25VdGlscy5nZXRGaWx0ZXJSZXN0cmljdGlvbnNCeVBhdGgoc0VudGl0eVNldFBhdGgsIG9Db250ZXh0KTtcblx0Y29uc3QgYUVxdWFsc09wcyA9IFtcIkVRXCJdO1xuXHRjb25zdCBhU2luZ2xlUmFuZ2VPcHMgPSBbXCJFUVwiLCBcIkdFXCIsIFwiTEVcIiwgXCJMVFwiLCBcIkdUXCIsIFwiQlRcIiwgXCJOT1RMRVwiLCBcIk5PVExUXCIsIFwiTk9UR0VcIiwgXCJOT1RHVFwiXTtcblx0Y29uc3QgYVNpbmdsZVJhbmdlRFRCYXNpY09wcyA9IFtcIkVRXCIsIFwiQlRcIl07XG5cdGNvbnN0IGFTaW5nbGVWYWx1ZURhdGVPcHMgPSBbXG5cdFx0XCJUT0RBWVwiLFxuXHRcdFwiVE9NT1JST1dcIixcblx0XHRcIllFU1RFUkRBWVwiLFxuXHRcdFwiREFURVwiLFxuXHRcdFwiRklSU1REQVlXRUVLXCIsXG5cdFx0XCJMQVNUREFZV0VFS1wiLFxuXHRcdFwiRklSU1REQVlNT05USFwiLFxuXHRcdFwiTEFTVERBWU1PTlRIXCIsXG5cdFx0XCJGSVJTVERBWVFVQVJURVJcIixcblx0XHRcIkxBU1REQVlRVUFSVEVSXCIsXG5cdFx0XCJGSVJTVERBWVlFQVJcIixcblx0XHRcIkxBU1REQVlZRUFSXCJcblx0XTtcblx0Y29uc3QgYUJhc2ljRGF0ZVRpbWVPcHMgPSBbXCJFUVwiLCBcIkJUXCJdO1xuXHRjb25zdCBhTXVsdGlSYW5nZU9wcyA9IFtcIkVRXCIsIFwiR0VcIiwgXCJMRVwiLCBcIkxUXCIsIFwiR1RcIiwgXCJCVFwiLCBcIk5FXCIsIFwiTk9UQlRcIiwgXCJOT1RMRVwiLCBcIk5PVExUXCIsIFwiTk9UR0VcIiwgXCJOT1RHVFwiXTtcblx0Y29uc3QgYVNlYXJjaEV4cHJlc3Npb25PcHMgPSBbXCJDb250YWluc1wiLCBcIk5vdENvbnRhaW5zXCIsIFwiU3RhcnRzV2l0aFwiLCBcIk5vdFN0YXJ0c1dpdGhcIiwgXCJFbmRzV2l0aFwiLCBcIk5vdEVuZHNXaXRoXCJdO1xuXHRjb25zdCBhU2VtYW50aWNEYXRlT3BzRXh0ID0gU2VtYW50aWNEYXRlT3BlcmF0b3JzLmdldFN1cHBvcnRlZE9wZXJhdGlvbnMoKTtcblx0Y29uc3QgYlNlbWFudGljRGF0ZVJhbmdlID0gYlVzZVNlbWFudGljRGF0ZVJhbmdlID09PSBcInRydWVcIiB8fCBiVXNlU2VtYW50aWNEYXRlUmFuZ2UgPT09IHRydWU7XG5cdGxldCBhU2VtYW50aWNEYXRlT3BzOiBhbnlbXSA9IFtdO1xuXHRjb25zdCBvU2V0dGluZ3MgPSB0eXBlb2Ygc1NldHRpbmdzID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShzU2V0dGluZ3MpLmN1c3RvbURhdGEgOiBzU2V0dGluZ3M7XG5cblx0aWYgKChvQ29udGV4dC5nZXRPYmplY3QoYCR7c0VudGl0eVNldFBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVzdWx0Q29udGV4dGApIGFzIGFueSkgPT09IHRydWUpIHtcblx0XHRyZXR1cm4gYUVxdWFsc09wcy50b1N0cmluZygpO1xuXHR9XG5cblx0aWYgKG9TZXR0aW5ncyAmJiBvU2V0dGluZ3Mub3BlcmF0b3JDb25maWd1cmF0aW9uICYmIG9TZXR0aW5ncy5vcGVyYXRvckNvbmZpZ3VyYXRpb24ubGVuZ3RoID4gMCkge1xuXHRcdGFTZW1hbnRpY0RhdGVPcHMgPSBTZW1hbnRpY0RhdGVPcGVyYXRvcnMuZ2V0RmlsdGVyT3BlcmF0aW9ucyhvU2V0dGluZ3Mub3BlcmF0b3JDb25maWd1cmF0aW9uKTtcblx0fSBlbHNlIHtcblx0XHRhU2VtYW50aWNEYXRlT3BzID0gU2VtYW50aWNEYXRlT3BlcmF0b3JzLmdldFNlbWFudGljRGF0ZU9wZXJhdGlvbnMoKTtcblx0fVxuXHQvLyBHZXQgdGhlIGRlZmF1bHQgT3BlcmF0b3JzIGZvciB0aGlzIFByb3BlcnR5IFR5cGVcblx0bGV0IGFEZWZhdWx0T3BlcmF0b3JzID0gX2dldERlZmF1bHRPcGVyYXRvcnMoc1R5cGUpO1xuXHRpZiAoYlNlbWFudGljRGF0ZVJhbmdlKSB7XG5cdFx0YURlZmF1bHRPcGVyYXRvcnMgPSBhU2VtYW50aWNEYXRlT3BzRXh0LmNvbmNhdChhRGVmYXVsdE9wZXJhdG9ycyk7XG5cdH1cblx0bGV0IHNSZXN0cmljdGlvbnM7XG5cblx0Ly8gSXMgdGhlcmUgYSBGaWx0ZXIgUmVzdHJpY3Rpb24gZGVmaW5lZCBmb3IgdGhpcyBwcm9wZXJ0eT9cblx0aWYgKG9GaWx0ZXJSZXN0cmljdGlvbnMgJiYgb0ZpbHRlclJlc3RyaWN0aW9ucy5GaWx0ZXJBbGxvd2VkRXhwcmVzc2lvbnMgJiYgb0ZpbHRlclJlc3RyaWN0aW9ucy5GaWx0ZXJBbGxvd2VkRXhwcmVzc2lvbnNbc1Byb3BlcnR5XSkge1xuXHRcdC8vIEV4dGVuZGluZyB0aGUgZGVmYXVsdCBvcGVyYXRvcnMgbGlzdCB3aXRoIFNlbWFudGljIERhdGUgb3B0aW9ucyBEQVRFUkFOR0UsIERBVEUsIEZST00gYW5kIFRPXG5cdFx0Y29uc3Qgc0FsbG93ZWRFeHByZXNzaW9uID0gQ29tbW9uVXRpbHMuZ2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbihvRmlsdGVyUmVzdHJpY3Rpb25zLkZpbHRlckFsbG93ZWRFeHByZXNzaW9uc1tzUHJvcGVydHldKTtcblx0XHQvLyBJbiBjYXNlIG1vcmUgdGhhbiBvbmUgQWxsb3dlZCBFeHByZXNzaW9ucyBoYXMgYmVlbiBkZWZpbmVkIGZvciBhIHByb3BlcnR5XG5cdFx0Ly8gY2hvb3NlIHRoZSBtb3N0IHJlc3RyaWN0aXZlIEFsbG93ZWQgRXhwcmVzc2lvblxuXG5cdFx0Ly8gTXVsdGlWYWx1ZSBoYXMgc2FtZSBPcGVyYXRvciBhcyBTaW5nbGVWYWx1ZSwgYnV0IHRoZXJlIGNhbiBiZSBtb3JlIHRoYW4gb25lIChtYXhDb25kaXRpb25zKVxuXHRcdHN3aXRjaCAoc0FsbG93ZWRFeHByZXNzaW9uKSB7XG5cdFx0XHRjYXNlIFwiU2luZ2xlVmFsdWVcIjpcblx0XHRcdFx0Y29uc3QgYVNpbmdsZVZhbHVlT3BzID0gc1R5cGUgPT09IFwiRWRtLkRhdGVcIiAmJiBiU2VtYW50aWNEYXRlUmFuZ2UgPyBhU2luZ2xlVmFsdWVEYXRlT3BzIDogYUVxdWFsc09wcztcblx0XHRcdFx0c1Jlc3RyaWN0aW9ucyA9IF9nZXRSZXN0cmljdGlvbnMoYURlZmF1bHRPcGVyYXRvcnMsIGFTaW5nbGVWYWx1ZU9wcyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIk11bHRpVmFsdWVcIjpcblx0XHRcdFx0c1Jlc3RyaWN0aW9ucyA9IF9nZXRSZXN0cmljdGlvbnMoYURlZmF1bHRPcGVyYXRvcnMsIGFFcXVhbHNPcHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJTaW5nbGVSYW5nZVwiOlxuXHRcdFx0XHRsZXQgYUV4cHJlc3Npb25PcHM7XG5cdFx0XHRcdGlmIChiU2VtYW50aWNEYXRlUmFuZ2UpIHtcblx0XHRcdFx0XHRpZiAoc1R5cGUgPT09IFwiRWRtLkRhdGVcIikge1xuXHRcdFx0XHRcdFx0YUV4cHJlc3Npb25PcHMgPSBhU2VtYW50aWNEYXRlT3BzO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIpIHtcblx0XHRcdFx0XHRcdGFFeHByZXNzaW9uT3BzID0gYVNlbWFudGljRGF0ZU9wcy5jb25jYXQoYUJhc2ljRGF0ZVRpbWVPcHMpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhRXhwcmVzc2lvbk9wcyA9IGFTaW5nbGVSYW5nZU9wcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIpIHtcblx0XHRcdFx0XHRhRXhwcmVzc2lvbk9wcyA9IGFTaW5nbGVSYW5nZURUQmFzaWNPcHM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YUV4cHJlc3Npb25PcHMgPSBhU2luZ2xlUmFuZ2VPcHM7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgc09wZXJhdG9ycyA9IF9nZXRSZXN0cmljdGlvbnMoYURlZmF1bHRPcGVyYXRvcnMsIGFFeHByZXNzaW9uT3BzKTtcblx0XHRcdFx0c1Jlc3RyaWN0aW9ucyA9IHNPcGVyYXRvcnMgPyBzT3BlcmF0b3JzIDogXCJcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTXVsdGlSYW5nZVwiOlxuXHRcdFx0XHRzUmVzdHJpY3Rpb25zID0gX2dldFJlc3RyaWN0aW9ucyhhRGVmYXVsdE9wZXJhdG9ycywgYU11bHRpUmFuZ2VPcHMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJTZWFyY2hFeHByZXNzaW9uXCI6XG5cdFx0XHRcdHNSZXN0cmljdGlvbnMgPSBfZ2V0UmVzdHJpY3Rpb25zKGFEZWZhdWx0T3BlcmF0b3JzLCBhU2VhcmNoRXhwcmVzc2lvbk9wcyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIk11bHRpUmFuZ2VPclNlYXJjaEV4cHJlc3Npb25cIjpcblx0XHRcdFx0c1Jlc3RyaWN0aW9ucyA9IF9nZXRSZXN0cmljdGlvbnMoYURlZmF1bHRPcGVyYXRvcnMsIGFTZWFyY2hFeHByZXNzaW9uT3BzLmNvbmNhdChhTXVsdGlSYW5nZU9wcykpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHQvLyBJbiBjYXNlIEFsbG93ZWRFeHByZXNzaW9ucyBpcyBub3QgcmVjb2duaXNlZCwgdW5kZWZpbmVkIGluIHJldHVybiByZXN1bHRzIGluIHRoZSBkZWZhdWx0IHNldCBvZlxuXHRcdC8vIG9wZXJhdG9ycyBmb3IgdGhlIHR5cGUuXG5cdH1cblx0cmV0dXJuIHNSZXN0cmljdGlvbnM7XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIHJldHVybiBhbGxvd2VkIG9wZXJhdG9ycyBmb3IgdHlwZSBHdWlkLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgZ2V0T3BlcmF0b3JzRm9yR3VpZFByb3BlcnR5XG4gKiBAcmV0dXJucyBBbGxvd2VkIG9wZXJhdG9ycyBmb3IgdHlwZSBHdWlkXG4gKi9cbmZ1bmN0aW9uIGdldE9wZXJhdG9yc0Zvckd1aWRQcm9wZXJ0eSgpOiBzdHJpbmcge1xuXHRjb25zdCBhbGxvd2VkT3BlcmF0b3JzRm9yR3VpZCA9IFtcIkVRXCIsIFwiTkVcIl07XG5cdHJldHVybiBhbGxvd2VkT3BlcmF0b3JzRm9yR3VpZC50b1N0cmluZygpO1xufVxuXG5mdW5jdGlvbiBnZXRPcGVyYXRvcnNGb3JEYXRlUHJvcGVydHkocHJvcGVydHlUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHQvLyBJbiBjYXNlIEFsbG93ZWRFeHByZXNzaW9ucyBpcyBub3QgcHJvdmlkZWQgZm9yIHR5cGUgRWRtLkRhdGUgdGhlbiBhbGwgdGhlIGRlZmF1bHRcblx0Ly8gb3BlcmF0b3JzIGZvciB0aGUgdHlwZSBzaG91bGQgYmUgcmV0dXJuZWQgZXhjbHVkaW5nIHNlbWFudGljIG9wZXJhdG9ycyBmcm9tIHRoZSBsaXN0LlxuXHRjb25zdCBhRGVmYXVsdE9wZXJhdG9ycyA9IF9nZXREZWZhdWx0T3BlcmF0b3JzKHByb3BlcnR5VHlwZSk7XG5cdGNvbnN0IGFNdWx0aVJhbmdlT3BzID0gW1wiRVFcIiwgXCJHRVwiLCBcIkxFXCIsIFwiTFRcIiwgXCJHVFwiLCBcIkJUXCIsIFwiTkVcIiwgXCJOT1RCVFwiLCBcIk5PVExFXCIsIFwiTk9UTFRcIiwgXCJOT1RHRVwiLCBcIk5PVEdUXCJdO1xuXHRyZXR1cm4gX2dldFJlc3RyaWN0aW9ucyhhRGVmYXVsdE9wZXJhdG9ycywgYU11bHRpUmFuZ2VPcHMpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJhbWV0ZXJJbmZvKG9NZXRhTW9kZWw6IGFueSwgc0NvbnRleHRQYXRoOiBhbnkpIHtcblx0Y29uc3Qgc1BhcmFtZXRlckNvbnRleHRQYXRoID0gc0NvbnRleHRQYXRoLnN1YnN0cmluZygwLCBzQ29udGV4dFBhdGgubGFzdEluZGV4T2YoXCIvXCIpKTtcblx0Y29uc3QgYlJlc3VsdENvbnRleHQgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzUGFyYW1ldGVyQ29udGV4dFBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVzdWx0Q29udGV4dGApO1xuXHRjb25zdCBvUGFyYW1ldGVySW5mbzogYW55ID0ge307XG5cdGlmIChiUmVzdWx0Q29udGV4dCAmJiBzUGFyYW1ldGVyQ29udGV4dFBhdGggIT09IHNDb250ZXh0UGF0aCkge1xuXHRcdG9QYXJhbWV0ZXJJbmZvLmNvbnRleHRQYXRoID0gc1BhcmFtZXRlckNvbnRleHRQYXRoO1xuXHRcdG9QYXJhbWV0ZXJJbmZvLnBhcmFtZXRlclByb3BlcnRpZXMgPSBDb21tb25VdGlscy5nZXRDb250ZXh0UGF0aFByb3BlcnRpZXMob01ldGFNb2RlbCwgc1BhcmFtZXRlckNvbnRleHRQYXRoKTtcblx0fVxuXHRyZXR1cm4gb1BhcmFtZXRlckluZm87XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIGFkZCB0aGUgc2VsZWN0IE9wdGlvbnMgdG8gZmlsdGVyIGNvbmRpdGlvbnMuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBhZGRTZWxlY3RPcHRpb25Ub0NvbmRpdGlvbnNcbiAqIEBwYXJhbSBvUHJvcGVydHlNZXRhZGF0YSBQcm9wZXJ0eSBtZXRhZGF0YSBpbmZvcm1hdGlvblxuICogQHBhcmFtIGFWYWxpZE9wZXJhdG9ycyBPcGVyYXRvcnMgZm9yIGFsbCB0aGUgZGF0YSB0eXBlc1xuICogQHBhcmFtIGFTZW1hbnRpY0RhdGVPcGVyYXRvcnMgT3BlcmF0b3JzIGZvciB0aGUgRGF0ZSB0eXBlXG4gKiBAcGFyYW0gYUN1bXVsYXRpdmVDb25kaXRpb25zIEZpbHRlciBjb25kaXRpb25zXG4gKiBAcGFyYW0gb1NlbGVjdE9wdGlvbiBTZWxlY3RvcHRpb24gb2Ygc2VsZWN0aW9uIHZhcmlhbnRcbiAqIEByZXR1cm5zIFRoZSBmaWx0ZXIgY29uZGl0aW9uc1xuICovXG5mdW5jdGlvbiBhZGRTZWxlY3RPcHRpb25Ub0NvbmRpdGlvbnMoXG5cdG9Qcm9wZXJ0eU1ldGFkYXRhOiBhbnksXG5cdGFWYWxpZE9wZXJhdG9yczogYW55LFxuXHRhU2VtYW50aWNEYXRlT3BlcmF0b3JzOiBhbnksXG5cdGFDdW11bGF0aXZlQ29uZGl0aW9uczogYW55LFxuXHRvU2VsZWN0T3B0aW9uOiBhbnlcbikge1xuXHRjb25zdCBvQ29uZGl0aW9uID0gZ2V0Q29uZGl0aW9ucyhvU2VsZWN0T3B0aW9uLCBvUHJvcGVydHlNZXRhZGF0YSk7XG5cdGlmIChcblx0XHRvU2VsZWN0T3B0aW9uPy5TZW1hbnRpY0RhdGVzICYmXG5cdFx0YVNlbWFudGljRGF0ZU9wZXJhdG9ycyAmJlxuXHRcdGFTZW1hbnRpY0RhdGVPcGVyYXRvcnMuaW5kZXhPZihvU2VsZWN0T3B0aW9uPy5TZW1hbnRpY0RhdGVzPy5vcGVyYXRvcikgPiAtMVxuXHQpIHtcblx0XHRjb25zdCBzZW1hbnRpY0RhdGVzID0gQ29tbW9uVXRpbHMuYWRkU2VtYW50aWNEYXRlc1RvQ29uZGl0aW9ucyhvU2VsZWN0T3B0aW9uPy5TZW1hbnRpY0RhdGVzKTtcblx0XHRpZiAoc2VtYW50aWNEYXRlcyAmJiBPYmplY3Qua2V5cyhzZW1hbnRpY0RhdGVzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRhQ3VtdWxhdGl2ZUNvbmRpdGlvbnMucHVzaChzZW1hbnRpY0RhdGVzKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAob0NvbmRpdGlvbikge1xuXHRcdGlmICghYVZhbGlkT3BlcmF0b3JzIHx8IGFWYWxpZE9wZXJhdG9ycy5pbmRleE9mKG9Db25kaXRpb24ub3BlcmF0b3IpID4gLTEpIHtcblx0XHRcdGFDdW11bGF0aXZlQ29uZGl0aW9ucy5wdXNoKG9Db25kaXRpb24pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gYUN1bXVsYXRpdmVDb25kaXRpb25zO1xufVxuXG4vKipcbiAqIE1ldGhvZCB0byBhZGQgdGhlIHNlbWFudGljIGRhdGVzIHRvIGZpbHRlciBjb25kaXRpb25zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBhZGRTZW1hbnRpY0RhdGVzVG9Db25kaXRpb25zXG4gKiBAcGFyYW0gb1NlbWFudGljRGF0ZXMgU2VtYW50aWMgZGF0ZSBpbmZvbWF0aW9uXG4gKiBAcmV0dXJucyBUaGUgZmlsdGVyIGNvbmRpdGlvbnMgY29udGFpbmluZyBzZW1hbnRpYyBkYXRlc1xuICovXG5cbmZ1bmN0aW9uIGFkZFNlbWFudGljRGF0ZXNUb0NvbmRpdGlvbnMob1NlbWFudGljRGF0ZXM6IHNlbWFudGljRGF0ZUNvbmZpZ3VyYXRpb24pOiBvYmplY3Qge1xuXHRjb25zdCB2YWx1ZXM6IGFueSA9IFtdO1xuXHRpZiAob1NlbWFudGljRGF0ZXM/LmhpZ2gpIHtcblx0XHR2YWx1ZXMucHVzaChvU2VtYW50aWNEYXRlcz8uaGlnaCk7XG5cdH1cblx0aWYgKG9TZW1hbnRpY0RhdGVzPy5sb3cpIHtcblx0XHR2YWx1ZXMucHVzaChvU2VtYW50aWNEYXRlcz8ubG93KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlczogdmFsdWVzLFxuXHRcdG9wZXJhdG9yOiBvU2VtYW50aWNEYXRlcz8ub3BlcmF0b3IsXG5cdFx0aXNFbXB0eTogbnVsbFxuXHR9O1xufVxuXG4vKipcbiAqIEBwYXJhbSBzQ29udGV4dFBhdGhcbiAqIEBwYXJhbSBvU2VsZWN0aW9uVmFyaWFudFxuICogQHBhcmFtIHNTZWxlY3RPcHRpb25Qcm9wXG4gKiBAcGFyYW0gb0NvbmRpdGlvbnNcbiAqIEBwYXJhbSBzQ29uZGl0aW9uUGF0aFxuICogQHBhcmFtIHNDb25kaXRpb25Qcm9wXG4gKiBAcGFyYW0gb1ZhbGlkUHJvcGVydGllc1xuICogQHBhcmFtIG9NZXRhTW9kZWxcbiAqIEBwYXJhbSBpc1BhcmFtZXRlclxuICogQHBhcmFtIGJJc0ZMUFZhbHVlUHJlc2VudFxuICogQHBhcmFtIGJVc2VTZW1hbnRpY0RhdGVSYW5nZVxuICogQHBhcmFtIG9WaWV3RGF0YVxuICovXG5mdW5jdGlvbiBhZGRTZWxlY3RPcHRpb25zVG9Db25kaXRpb25zKFxuXHRzQ29udGV4dFBhdGg6IGFueSxcblx0b1NlbGVjdGlvblZhcmlhbnQ6IGFueSxcblx0c1NlbGVjdE9wdGlvblByb3A6IGFueSxcblx0b0NvbmRpdGlvbnM6IGFueSxcblx0c0NvbmRpdGlvblBhdGg6IGFueSxcblx0c0NvbmRpdGlvblByb3A6IGFueSxcblx0b1ZhbGlkUHJvcGVydGllczogYW55LFxuXHRvTWV0YU1vZGVsOiBhbnksXG5cdGlzUGFyYW1ldGVyOiBhbnksXG5cdGJJc0ZMUFZhbHVlUHJlc2VudD86IGJvb2xlYW4sXG5cdGJVc2VTZW1hbnRpY0RhdGVSYW5nZT86IGJvb2xlYW4gfCBzdHJpbmcsXG5cdG9WaWV3RGF0YT86IGFueVxuKSB7XG5cdGxldCBhQ29uZGl0aW9uczogYW55W10gPSBbXSxcblx0XHRhU2VsZWN0T3B0aW9ucyxcblx0XHRhVmFsaWRPcGVyYXRvcnMsXG5cdFx0YVNlbWFudGljRGF0ZU9wZXJhdG9ycztcblxuXHRpZiAoaXNQYXJhbWV0ZXIgfHwgQ29tbW9uVXRpbHMuaXNQcm9wZXJ0eUZpbHRlcmFibGUob01ldGFNb2RlbCwgc0NvbnRleHRQYXRoLCBzQ29uZGl0aW9uUHJvcCwgdHJ1ZSkpIHtcblx0XHRjb25zdCBvUHJvcGVydHlNZXRhZGF0YSA9IG9WYWxpZFByb3BlcnRpZXNbc0NvbmRpdGlvblByb3BdO1xuXHRcdGFTZWxlY3RPcHRpb25zID0gb1NlbGVjdGlvblZhcmlhbnQuZ2V0U2VsZWN0T3B0aW9uKHNTZWxlY3RPcHRpb25Qcm9wKTtcblx0XHRjb25zdCBzZXR0aW5ncyA9IGdldEZpbHRlckNvbmZpZ3VyYXRpb25TZXR0aW5nKG9WaWV3RGF0YSwgc0NvbmRpdGlvblByb3ApO1xuXHRcdGFWYWxpZE9wZXJhdG9ycyA9IGlzUGFyYW1ldGVyID8gW1wiRVFcIl0gOiBDb21tb25VdGlscy5nZXRPcGVyYXRvcnNGb3JQcm9wZXJ0eShzQ29uZGl0aW9uUHJvcCwgc0NvbnRleHRQYXRoLCBvTWV0YU1vZGVsKTtcblx0XHRpZiAoYlVzZVNlbWFudGljRGF0ZVJhbmdlKSB7XG5cdFx0XHRhU2VtYW50aWNEYXRlT3BlcmF0b3JzID0gaXNQYXJhbWV0ZXJcblx0XHRcdFx0PyBbXCJFUVwiXVxuXHRcdFx0XHQ6IENvbW1vblV0aWxzLmdldE9wZXJhdG9yc0ZvclByb3BlcnR5KFxuXHRcdFx0XHRcdFx0c0NvbmRpdGlvblByb3AsXG5cdFx0XHRcdFx0XHRzQ29udGV4dFBhdGgsXG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0b1Byb3BlcnR5TWV0YWRhdGE/LiRUeXBlLFxuXHRcdFx0XHRcdFx0YlVzZVNlbWFudGljRGF0ZVJhbmdlLFxuXHRcdFx0XHRcdFx0c2V0dGluZ3Ncblx0XHRcdFx0ICApO1xuXHRcdH1cblx0XHQvLyBDcmVhdGUgY29uZGl0aW9ucyBmb3IgYWxsIHRoZSBzZWxlY3RPcHRpb25zIG9mIHRoZSBwcm9wZXJ0eVxuXHRcdGFDb25kaXRpb25zID0gaXNQYXJhbWV0ZXJcblx0XHRcdD8gQ29tbW9uVXRpbHMuYWRkU2VsZWN0T3B0aW9uVG9Db25kaXRpb25zKFxuXHRcdFx0XHRcdG9Qcm9wZXJ0eU1ldGFkYXRhLFxuXHRcdFx0XHRcdGFWYWxpZE9wZXJhdG9ycyxcblx0XHRcdFx0XHRhU2VtYW50aWNEYXRlT3BlcmF0b3JzLFxuXHRcdFx0XHRcdGFDb25kaXRpb25zLFxuXHRcdFx0XHRcdGFTZWxlY3RPcHRpb25zWzBdXG5cdFx0XHQgIClcblx0XHRcdDogYVNlbGVjdE9wdGlvbnMucmVkdWNlKFxuXHRcdFx0XHRcdENvbW1vblV0aWxzLmFkZFNlbGVjdE9wdGlvblRvQ29uZGl0aW9ucy5iaW5kKG51bGwsIG9Qcm9wZXJ0eU1ldGFkYXRhLCBhVmFsaWRPcGVyYXRvcnMsIGFTZW1hbnRpY0RhdGVPcGVyYXRvcnMpLFxuXHRcdFx0XHRcdGFDb25kaXRpb25zXG5cdFx0XHQgICk7XG5cdFx0aWYgKGFDb25kaXRpb25zLmxlbmd0aCkge1xuXHRcdFx0aWYgKHNDb25kaXRpb25QYXRoKSB7XG5cdFx0XHRcdG9Db25kaXRpb25zW3NDb25kaXRpb25QYXRoICsgc0NvbmRpdGlvblByb3BdID0gb0NvbmRpdGlvbnMuaGFzT3duUHJvcGVydHkoc0NvbmRpdGlvblBhdGggKyBzQ29uZGl0aW9uUHJvcClcblx0XHRcdFx0XHQ/IG9Db25kaXRpb25zW3NDb25kaXRpb25QYXRoICsgc0NvbmRpdGlvblByb3BdLmNvbmNhdChhQ29uZGl0aW9ucylcblx0XHRcdFx0XHQ6IGFDb25kaXRpb25zO1xuXHRcdFx0fSBlbHNlIGlmIChiSXNGTFBWYWx1ZVByZXNlbnQpIHtcblx0XHRcdFx0Ly8gSWYgRkxQIHZhbHVlcyBhcmUgcHJlc2VudCByZXBsYWNlIGl0IHdpdGggRkxQIHZhbHVlc1xuXHRcdFx0XHRhQ29uZGl0aW9ucy5mb3JFYWNoKChlbGVtZW50OiBhbnkpID0+IHtcblx0XHRcdFx0XHRlbGVtZW50W1wiZmlsdGVyZWRcIl0gPSB0cnVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKG9Db25kaXRpb25zLmhhc093blByb3BlcnR5KHNDb25kaXRpb25Qcm9wKSkge1xuXHRcdFx0XHRcdG9Db25kaXRpb25zW3NDb25kaXRpb25Qcm9wXS5mb3JFYWNoKChlbGVtZW50OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdGVsZW1lbnRbXCJmaWx0ZXJlZFwiXSA9IGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9Db25kaXRpb25zW3NDb25kaXRpb25Qcm9wXSA9IG9Db25kaXRpb25zW3NDb25kaXRpb25Qcm9wXS5jb25jYXQoYUNvbmRpdGlvbnMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9Db25kaXRpb25zW3NDb25kaXRpb25Qcm9wXSA9IGFDb25kaXRpb25zO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvQ29uZGl0aW9uc1tzQ29uZGl0aW9uUHJvcF0gPSBvQ29uZGl0aW9ucy5oYXNPd25Qcm9wZXJ0eShzQ29uZGl0aW9uUHJvcClcblx0XHRcdFx0XHQ/IG9Db25kaXRpb25zW3NDb25kaXRpb25Qcm9wXS5jb25jYXQoYUNvbmRpdGlvbnMpXG5cdFx0XHRcdFx0OiBhQ29uZGl0aW9ucztcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gY3JlYXRlIHRoZSBzZW1hbnRpYyBkYXRlcyBmcm9tIGZpbHRlciBjb25kaXRpb25zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBjcmVhdGVTZW1hbnRpY0RhdGVzRnJvbUNvbmRpdGlvbnNcbiAqIEBwYXJhbSBvQ29uZGl0aW9uIEZpbHRlciBmaWVsZCBjb25kaXRpb25cbiAqIEBwYXJhbSBzRmlsdGVyTmFtZSBGaWx0ZXIgRmllbGQgUGF0aFxuICogQHJldHVybnMgVGhlIFNlbWFudGljIGRhdGUgY29uZGl0aW9uc1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVNlbWFudGljRGF0ZXNGcm9tQ29uZGl0aW9ucyhvQ29uZGl0aW9uOiBDb25kaXRpb25UeXBlKSB7XG5cdHJldHVybiB7XG5cdFx0aGlnaDogb0NvbmRpdGlvbj8udmFsdWVzPy5bMF0gfHwgbnVsbCxcblx0XHRsb3c6IG9Db25kaXRpb24/LnZhbHVlcz8uWzFdIHx8IG51bGwsXG5cdFx0b3BlcmF0b3I6IG9Db25kaXRpb24/Lm9wZXJhdG9yXG5cdH07XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIFJldHVybiB0aGUgZmlsdGVyIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIGdldEZpbHRlckNvbmZpZ3VyYXRpb25TZXR0aW5nXG4gKiBAcGFyYW0gb1ZpZXdEYXRhIG1hbmlmZXN0IENvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSBzUHJvcGVydHkgRmlsdGVyIEZpZWxkIFBhdGhcbiAqIEByZXR1cm5zIFRoZSBGaWx0ZXIgRmllbGQgQ29uZmlndXJhdGlvblxuICovXG5cbmZ1bmN0aW9uIGdldEZpbHRlckNvbmZpZ3VyYXRpb25TZXR0aW5nKG9WaWV3RGF0YTogYW55LCBzUHJvcGVydHk6IHN0cmluZykge1xuXHRjb25zdCBvQ29uZmlnID0gb1ZpZXdEYXRhPy5jb250cm9sQ29uZmlndXJhdGlvbjtcblx0Y29uc3QgZmlsdGVyQ29uZmlnID0gb0NvbmZpZyAmJiBvQ29uZmlnW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvbkZpZWxkc1wiXT8uZmlsdGVyRmllbGRzO1xuXHRyZXR1cm4gZmlsdGVyQ29uZmlnPy5bc1Byb3BlcnR5XSA/IGZpbHRlckNvbmZpZ1tzUHJvcGVydHldPy5zZXR0aW5ncyA6IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gYWRkU2VsZWN0aW9uVmFyaWFudFRvQ29uZGl0aW9ucyhcblx0b1NlbGVjdGlvblZhcmlhbnQ6IGFueSxcblx0b0NvbmRpdGlvbnM6IG9iamVjdCxcblx0b01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwsXG5cdHNDb250ZXh0UGF0aDogc3RyaW5nLFxuXHRiSXNGTFBWYWx1ZXM/OiBib29sZWFuLFxuXHRiVXNlU2VtYW50aWNEYXRlUmFuZ2U/OiBib29sZWFuIHwgc3RyaW5nLFxuXHRvVmlld0RhdGE/OiBhbnlcbikge1xuXHRjb25zdCBhU2VsZWN0T3B0aW9uc1Byb3BlcnR5TmFtZXMgPSBvU2VsZWN0aW9uVmFyaWFudC5nZXRTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcygpLFxuXHRcdG9WYWxpZFByb3BlcnRpZXMgPSBDb21tb25VdGlscy5nZXRDb250ZXh0UGF0aFByb3BlcnRpZXMob01ldGFNb2RlbCwgc0NvbnRleHRQYXRoKSxcblx0XHRhTWV0YWRhdFByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhvVmFsaWRQcm9wZXJ0aWVzKSxcblx0XHRvUGFyYW1ldGVySW5mbyA9IENvbW1vblV0aWxzLmdldFBhcmFtZXRlckluZm8ob01ldGFNb2RlbCwgc0NvbnRleHRQYXRoKSxcblx0XHRzUGFyYW1ldGVyQ29udGV4dFBhdGggPSBvUGFyYW1ldGVySW5mby5jb250ZXh0UGF0aCxcblx0XHRvVmFsaWRQYXJhbWV0ZXJQcm9wZXJ0aWVzID0gb1BhcmFtZXRlckluZm8ucGFyYW1ldGVyUHJvcGVydGllcyxcblx0XHRiSGFzUGFyYW1ldGVycyA9ICEhb1BhcmFtZXRlckluZm8uY29udGV4dFBhdGggJiYgb1ZhbGlkUGFyYW1ldGVyUHJvcGVydGllcyAmJiBPYmplY3Qua2V5cyhvVmFsaWRQYXJhbWV0ZXJQcm9wZXJ0aWVzKS5sZW5ndGggPiAwO1xuXG5cdGlmIChiSGFzUGFyYW1ldGVycykge1xuXHRcdGNvbnN0IGFNZXRhZGF0YVBhcmFtZXRlcnMgPSBPYmplY3Qua2V5cyhvVmFsaWRQYXJhbWV0ZXJQcm9wZXJ0aWVzKTtcblx0XHRhTWV0YWRhdGFQYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHNNZXRhZGF0YVBhcmFtZXRlcjogc3RyaW5nKSB7XG5cdFx0XHRsZXQgc1NlbGVjdE9wdGlvbk5hbWU7XG5cdFx0XHRpZiAoYVNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzLmluY2x1ZGVzKGAkUGFyYW1ldGVyLiR7c01ldGFkYXRhUGFyYW1ldGVyfWApKSB7XG5cdFx0XHRcdHNTZWxlY3RPcHRpb25OYW1lID0gYCRQYXJhbWV0ZXIuJHtzTWV0YWRhdGFQYXJhbWV0ZXJ9YDtcblx0XHRcdH0gZWxzZSBpZiAoYVNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzLmluY2x1ZGVzKHNNZXRhZGF0YVBhcmFtZXRlcikpIHtcblx0XHRcdFx0c1NlbGVjdE9wdGlvbk5hbWUgPSBzTWV0YWRhdGFQYXJhbWV0ZXI7XG5cdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRzTWV0YWRhdGFQYXJhbWV0ZXIuc3RhcnRzV2l0aChcIlBfXCIpICYmXG5cdFx0XHRcdGFTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcy5pbmNsdWRlcyhgJFBhcmFtZXRlci4ke3NNZXRhZGF0YVBhcmFtZXRlci5zbGljZSgyLCBzTWV0YWRhdGFQYXJhbWV0ZXIubGVuZ3RoKX1gKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHNTZWxlY3RPcHRpb25OYW1lID0gYCRQYXJhbWV0ZXIuJHtzTWV0YWRhdGFQYXJhbWV0ZXIuc2xpY2UoMiwgc01ldGFkYXRhUGFyYW1ldGVyLmxlbmd0aCl9YDtcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdHNNZXRhZGF0YVBhcmFtZXRlci5zdGFydHNXaXRoKFwiUF9cIikgJiZcblx0XHRcdFx0YVNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzLmluY2x1ZGVzKHNNZXRhZGF0YVBhcmFtZXRlci5zbGljZSgyLCBzTWV0YWRhdGFQYXJhbWV0ZXIubGVuZ3RoKSlcblx0XHRcdCkge1xuXHRcdFx0XHRzU2VsZWN0T3B0aW9uTmFtZSA9IHNNZXRhZGF0YVBhcmFtZXRlci5zbGljZSgyLCBzTWV0YWRhdGFQYXJhbWV0ZXIubGVuZ3RoKTtcblx0XHRcdH0gZWxzZSBpZiAoYVNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzLmluY2x1ZGVzKGAkUGFyYW1ldGVyLlBfJHtzTWV0YWRhdGFQYXJhbWV0ZXJ9YCkpIHtcblx0XHRcdFx0c1NlbGVjdE9wdGlvbk5hbWUgPSBgJFBhcmFtZXRlci5QXyR7c01ldGFkYXRhUGFyYW1ldGVyfWA7XG5cdFx0XHR9IGVsc2UgaWYgKGFTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcy5pbmNsdWRlcyhgUF8ke3NNZXRhZGF0YVBhcmFtZXRlcn1gKSkge1xuXHRcdFx0XHRzU2VsZWN0T3B0aW9uTmFtZSA9IGBQXyR7c01ldGFkYXRhUGFyYW1ldGVyfWA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzU2VsZWN0T3B0aW9uTmFtZSkge1xuXHRcdFx0XHRhZGRTZWxlY3RPcHRpb25zVG9Db25kaXRpb25zKFxuXHRcdFx0XHRcdHNQYXJhbWV0ZXJDb250ZXh0UGF0aCxcblx0XHRcdFx0XHRvU2VsZWN0aW9uVmFyaWFudCxcblx0XHRcdFx0XHRzU2VsZWN0T3B0aW9uTmFtZSxcblx0XHRcdFx0XHRvQ29uZGl0aW9ucyxcblx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0c01ldGFkYXRhUGFyYW1ldGVyLFxuXHRcdFx0XHRcdG9WYWxpZFBhcmFtZXRlclByb3BlcnRpZXMsXG5cdFx0XHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRcdGJJc0ZMUFZhbHVlcyxcblx0XHRcdFx0XHRiVXNlU2VtYW50aWNEYXRlUmFuZ2UsXG5cdFx0XHRcdFx0b1ZpZXdEYXRhXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0YU1ldGFkYXRQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHNNZXRhZGF0YVByb3BlcnR5OiBzdHJpbmcpIHtcblx0XHRsZXQgc1NlbGVjdE9wdGlvbk5hbWU7XG5cdFx0aWYgKGFTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcy5pbmNsdWRlcyhzTWV0YWRhdGFQcm9wZXJ0eSkpIHtcblx0XHRcdHNTZWxlY3RPcHRpb25OYW1lID0gc01ldGFkYXRhUHJvcGVydHk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdHNNZXRhZGF0YVByb3BlcnR5LnN0YXJ0c1dpdGgoXCJQX1wiKSAmJlxuXHRcdFx0YVNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzLmluY2x1ZGVzKHNNZXRhZGF0YVByb3BlcnR5LnNsaWNlKDIsIHNNZXRhZGF0YVByb3BlcnR5Lmxlbmd0aCkpXG5cdFx0KSB7XG5cdFx0XHRzU2VsZWN0T3B0aW9uTmFtZSA9IHNNZXRhZGF0YVByb3BlcnR5LnNsaWNlKDIsIHNNZXRhZGF0YVByb3BlcnR5Lmxlbmd0aCk7XG5cdFx0fSBlbHNlIGlmIChhU2VsZWN0T3B0aW9uc1Byb3BlcnR5TmFtZXMuaW5jbHVkZXMoYFBfJHtzTWV0YWRhdGFQcm9wZXJ0eX1gKSkge1xuXHRcdFx0c1NlbGVjdE9wdGlvbk5hbWUgPSBgUF8ke3NNZXRhZGF0YVByb3BlcnR5fWA7XG5cdFx0fVxuXHRcdGlmIChzU2VsZWN0T3B0aW9uTmFtZSkge1xuXHRcdFx0YWRkU2VsZWN0T3B0aW9uc1RvQ29uZGl0aW9ucyhcblx0XHRcdFx0c0NvbnRleHRQYXRoLFxuXHRcdFx0XHRvU2VsZWN0aW9uVmFyaWFudCxcblx0XHRcdFx0c1NlbGVjdE9wdGlvbk5hbWUsXG5cdFx0XHRcdG9Db25kaXRpb25zLFxuXHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdHNNZXRhZGF0YVByb3BlcnR5LFxuXHRcdFx0XHRvVmFsaWRQcm9wZXJ0aWVzLFxuXHRcdFx0XHRvTWV0YU1vZGVsLFxuXHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0YklzRkxQVmFsdWVzLFxuXHRcdFx0XHRiVXNlU2VtYW50aWNEYXRlUmFuZ2UsXG5cdFx0XHRcdG9WaWV3RGF0YVxuXHRcdFx0KTtcblx0XHR9XG5cdH0pO1xuXG5cdGFTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChzU2VsZWN0T3B0aW9uOiBhbnkpIHtcblx0XHRpZiAoc1NlbGVjdE9wdGlvbi5pbmRleE9mKFwiLlwiKSA+IDAgJiYgIXNTZWxlY3RPcHRpb24uaW5jbHVkZXMoXCIkUGFyYW1ldGVyXCIpKSB7XG5cdFx0XHRjb25zdCBzUmVwbGFjZWRPcHRpb24gPSBzU2VsZWN0T3B0aW9uLnJlcGxhY2VBbGwoXCIuXCIsIFwiL1wiKTtcblx0XHRcdGNvbnN0IHNGdWxsQ29udGV4dFBhdGggPSBgLyR7c1JlcGxhY2VkT3B0aW9ufWAuc3RhcnRzV2l0aChzQ29udGV4dFBhdGgpXG5cdFx0XHRcdD8gYC8ke3NSZXBsYWNlZE9wdGlvbn1gXG5cdFx0XHRcdDogYCR7c0NvbnRleHRQYXRofS8ke3NSZXBsYWNlZE9wdGlvbn1gOyAvLyBjaGVjayBpZiB0aGUgZnVsbCBwYXRoLCBlZyBTYWxlc09yZGVyTWFuYWdlLl9JdGVtLk1hdGVyaWFsIGV4aXN0cyBpbiB0aGUgbWV0YW1vZGVsXG5cdFx0XHRpZiAob01ldGFNb2RlbC5nZXRPYmplY3Qoc0Z1bGxDb250ZXh0UGF0aC5yZXBsYWNlKFwiUF9cIiwgXCJcIikpKSB7XG5cdFx0XHRcdF9jcmVhdGVDb25kaXRpb25zRm9yTmF2UHJvcGVydGllcyhcblx0XHRcdFx0XHRzRnVsbENvbnRleHRQYXRoLFxuXHRcdFx0XHRcdHNDb250ZXh0UGF0aCxcblx0XHRcdFx0XHRvU2VsZWN0aW9uVmFyaWFudCxcblx0XHRcdFx0XHRzU2VsZWN0T3B0aW9uLFxuXHRcdFx0XHRcdG9NZXRhTW9kZWwsXG5cdFx0XHRcdFx0b0NvbmRpdGlvbnMsXG5cdFx0XHRcdFx0YklzRkxQVmFsdWVzLFxuXHRcdFx0XHRcdGJVc2VTZW1hbnRpY0RhdGVSYW5nZSxcblx0XHRcdFx0XHRvVmlld0RhdGFcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gb0NvbmRpdGlvbnM7XG59XG5cbi8qKlxuICogQHBhcmFtIHNGdWxsQ29udGV4dFBhdGhcbiAqIEBwYXJhbSBzTWFpbkVudGl0eVNldFBhdGhcbiAqIEBwYXJhbSBvU2VsZWN0aW9uVmFyaWFudFxuICogQHBhcmFtIHNTZWxlY3RPcHRpb25cbiAqIEBwYXJhbSBvTWV0YU1vZGVsXG4gKiBAcGFyYW0gb0NvbmRpdGlvbnNcbiAqIEBwYXJhbSBiSXNGTFBWYWx1ZVByZXNlbnRcbiAqIEBwYXJhbSBiU2VtYW50aWNEYXRlUmFuZ2VcbiAqIEBwYXJhbSBvVmlld0RhdGFcbiAqL1xuZnVuY3Rpb24gX2NyZWF0ZUNvbmRpdGlvbnNGb3JOYXZQcm9wZXJ0aWVzKFxuXHRzRnVsbENvbnRleHRQYXRoOiBhbnksXG5cdHNNYWluRW50aXR5U2V0UGF0aDogYW55LFxuXHRvU2VsZWN0aW9uVmFyaWFudDogYW55LFxuXHRzU2VsZWN0T3B0aW9uOiBhbnksXG5cdG9NZXRhTW9kZWw6IGFueSxcblx0b0NvbmRpdGlvbnM6IGFueSxcblx0YklzRkxQVmFsdWVQcmVzZW50PzogYm9vbGVhbixcblx0YlNlbWFudGljRGF0ZVJhbmdlPzogYW55LFxuXHRvVmlld0RhdGE/OiBhbnlcbikge1xuXHRsZXQgYU5hdk9iamVjdE5hbWVzID0gc1NlbGVjdE9wdGlvbi5zcGxpdChcIi5cIik7XG5cdC8vIEVnOiBcIlNhbGVzT3JkZXJNYW5hZ2UuX0l0ZW0uX01hdGVyaWFsLk1hdGVyaWFsXCIgb3IgXCJfSXRlbS5NYXRlcmlhbFwiXG5cdGlmIChgLyR7c1NlbGVjdE9wdGlvbi5yZXBsYWNlQWxsKFwiLlwiLCBcIi9cIil9YC5zdGFydHNXaXRoKHNNYWluRW50aXR5U2V0UGF0aCkpIHtcblx0XHRjb25zdCBzRnVsbFBhdGggPSAoYC8ke3NTZWxlY3RPcHRpb259YCBhcyBhbnkpLnJlcGxhY2VBbGwoXCIuXCIsIFwiL1wiKSxcblx0XHRcdHNOYXZQYXRoID0gc0Z1bGxQYXRoLnJlcGxhY2UoYCR7c01haW5FbnRpdHlTZXRQYXRofS9gLCBcIlwiKTtcblx0XHRhTmF2T2JqZWN0TmFtZXMgPSBzTmF2UGF0aC5zcGxpdChcIi9cIik7XG5cdH1cblx0bGV0IHNDb25kaXRpb25QYXRoID0gXCJcIjtcblx0Y29uc3Qgc1Byb3BlcnR5TmFtZSA9IGFOYXZPYmplY3ROYW1lc1thTmF2T2JqZWN0TmFtZXMubGVuZ3RoIC0gMV07IC8vIE1hdGVyaWFsIGZyb20gU2FsZXNPcmRlck1hbmFnZS5fSXRlbS5NYXRlcmlhbFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGFOYXZPYmplY3ROYW1lcy5sZW5ndGggLSAxOyBpKyspIHtcblx0XHRpZiAob01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01haW5FbnRpdHlTZXRQYXRofS8ke2FOYXZPYmplY3ROYW1lc1tpXS5yZXBsYWNlKFwiUF9cIiwgXCJcIil9YCkuJGlzQ29sbGVjdGlvbikge1xuXHRcdFx0c0NvbmRpdGlvblBhdGggPSBgJHtzQ29uZGl0aW9uUGF0aCArIGFOYXZPYmplY3ROYW1lc1tpXX0qL2A7IC8vIF9JdGVtKi8gaW4gY2FzZSBvZiAxOm4gY2FyZGluYWxpdHlcblx0XHR9IGVsc2Uge1xuXHRcdFx0c0NvbmRpdGlvblBhdGggPSBgJHtzQ29uZGl0aW9uUGF0aCArIGFOYXZPYmplY3ROYW1lc1tpXX0vYDsgLy8gX0l0ZW0vIGluIGNhc2Ugb2YgMToxIGNhcmRpbmFsaXR5XG5cdFx0fVxuXHRcdHNNYWluRW50aXR5U2V0UGF0aCA9IGAke3NNYWluRW50aXR5U2V0UGF0aH0vJHthTmF2T2JqZWN0TmFtZXNbaV19YDtcblx0fVxuXHRjb25zdCBzTmF2UHJvcGVydHlQYXRoID0gc0Z1bGxDb250ZXh0UGF0aC5zbGljZSgwLCBzRnVsbENvbnRleHRQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSksXG5cdFx0b1ZhbGlkUHJvcGVydGllcyA9IENvbW1vblV0aWxzLmdldENvbnRleHRQYXRoUHJvcGVydGllcyhvTWV0YU1vZGVsLCBzTmF2UHJvcGVydHlQYXRoKSxcblx0XHRhU2VsZWN0T3B0aW9uc1Byb3BlcnR5TmFtZXMgPSBvU2VsZWN0aW9uVmFyaWFudC5nZXRTZWxlY3RPcHRpb25zUHJvcGVydHlOYW1lcygpO1xuXHRsZXQgc1NlbGVjdE9wdGlvbk5hbWUgPSBzUHJvcGVydHlOYW1lO1xuXHRpZiAob1ZhbGlkUHJvcGVydGllc1tzUHJvcGVydHlOYW1lXSkge1xuXHRcdHNTZWxlY3RPcHRpb25OYW1lID0gc1Byb3BlcnR5TmFtZTtcblx0fSBlbHNlIGlmIChzUHJvcGVydHlOYW1lLnN0YXJ0c1dpdGgoXCJQX1wiKSAmJiBvVmFsaWRQcm9wZXJ0aWVzW3NQcm9wZXJ0eU5hbWUucmVwbGFjZShcIlBfXCIsIFwiXCIpXSkge1xuXHRcdHNTZWxlY3RPcHRpb25OYW1lID0gc1Byb3BlcnR5TmFtZS5yZXBsYWNlKFwiUF9cIiwgXCJcIik7XG5cdH0gZWxzZSBpZiAob1ZhbGlkUHJvcGVydGllc1tgUF8ke3NQcm9wZXJ0eU5hbWV9YF0gJiYgYVNlbGVjdE9wdGlvbnNQcm9wZXJ0eU5hbWVzLmluY2x1ZGVzKGBQXyR7c1Byb3BlcnR5TmFtZX1gKSkge1xuXHRcdHNTZWxlY3RPcHRpb25OYW1lID0gYFBfJHtzUHJvcGVydHlOYW1lfWA7XG5cdH1cblx0aWYgKHNQcm9wZXJ0eU5hbWUuc3RhcnRzV2l0aChcIlBfXCIpICYmIG9Db25kaXRpb25zW3NDb25kaXRpb25QYXRoICsgc1NlbGVjdE9wdGlvbk5hbWVdKSB7XG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gU2FsZXNPcmRlck1hbmFnZS5fSXRlbS5NYXRlcmlhbCB5ZXQgaW4gdGhlIG9Db25kaXRpb25zXG5cdH0gZWxzZSBpZiAoIXNQcm9wZXJ0eU5hbWUuc3RhcnRzV2l0aChcIlBfXCIpICYmIG9Db25kaXRpb25zW3NDb25kaXRpb25QYXRoICsgc1NlbGVjdE9wdGlvbk5hbWVdKSB7XG5cdFx0ZGVsZXRlIG9Db25kaXRpb25zW3NDb25kaXRpb25QYXRoICsgc1NlbGVjdE9wdGlvbk5hbWVdO1xuXHRcdGFkZFNlbGVjdE9wdGlvbnNUb0NvbmRpdGlvbnMoXG5cdFx0XHRzTmF2UHJvcGVydHlQYXRoLFxuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnQsXG5cdFx0XHRzU2VsZWN0T3B0aW9uLFxuXHRcdFx0b0NvbmRpdGlvbnMsXG5cdFx0XHRzQ29uZGl0aW9uUGF0aCxcblx0XHRcdHNTZWxlY3RPcHRpb25OYW1lLFxuXHRcdFx0b1ZhbGlkUHJvcGVydGllcyxcblx0XHRcdG9NZXRhTW9kZWwsXG5cdFx0XHRmYWxzZSxcblx0XHRcdGJJc0ZMUFZhbHVlUHJlc2VudCxcblx0XHRcdGJTZW1hbnRpY0RhdGVSYW5nZSxcblx0XHRcdG9WaWV3RGF0YVxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0YWRkU2VsZWN0T3B0aW9uc1RvQ29uZGl0aW9ucyhcblx0XHRcdHNOYXZQcm9wZXJ0eVBhdGgsXG5cdFx0XHRvU2VsZWN0aW9uVmFyaWFudCxcblx0XHRcdHNTZWxlY3RPcHRpb24sXG5cdFx0XHRvQ29uZGl0aW9ucyxcblx0XHRcdHNDb25kaXRpb25QYXRoLFxuXHRcdFx0c1NlbGVjdE9wdGlvbk5hbWUsXG5cdFx0XHRvVmFsaWRQcm9wZXJ0aWVzLFxuXHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdGZhbHNlLFxuXHRcdFx0YklzRkxQVmFsdWVQcmVzZW50LFxuXHRcdFx0YlNlbWFudGljRGF0ZVJhbmdlLFxuXHRcdFx0b1ZpZXdEYXRhXG5cdFx0KTtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGRQYWdlQ29udGV4dFRvU2VsZWN0aW9uVmFyaWFudChvU2VsZWN0aW9uVmFyaWFudDogYW55LCBtUGFnZUNvbnRleHQ6IGFueVtdLCBvVmlldzogYW55KSB7XG5cdGNvbnN0IG9BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQob1ZpZXcpO1xuXHRjb25zdCBvTmF2aWdhdGlvblNlcnZpY2UgPSBvQXBwQ29tcG9uZW50LmdldE5hdmlnYXRpb25TZXJ2aWNlKCk7XG5cdHJldHVybiBvTmF2aWdhdGlvblNlcnZpY2UubWl4QXR0cmlidXRlc0FuZFNlbGVjdGlvblZhcmlhbnQobVBhZ2VDb250ZXh0LCBvU2VsZWN0aW9uVmFyaWFudC50b0pTT05TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIGFkZEV4dGVybmFsU3RhdGVGaWx0ZXJzVG9TZWxlY3Rpb25WYXJpYW50KG9TZWxlY3Rpb25WYXJpYW50OiBhbnksIG1GaWx0ZXJzOiBhbnksIG9UYXJnZXRJbmZvOiBhbnksIG9GaWx0ZXJCYXI/OiBhbnkpIHtcblx0bGV0IHNGaWx0ZXI6IGFueTtcblx0Y29uc3QgZm5HZXRTaWduQW5kT3B0aW9uID0gZnVuY3Rpb24gKHNPcGVyYXRvcjogYW55LCBzTG93VmFsdWU6IGFueSwgc0hpZ2hWYWx1ZTogYW55KSB7XG5cdFx0Y29uc3Qgb1NlbGVjdE9wdGlvblN0YXRlID0ge1xuXHRcdFx0b3B0aW9uOiBcIlwiLFxuXHRcdFx0c2lnbjogXCJJXCIsXG5cdFx0XHRsb3c6IHNMb3dWYWx1ZSxcblx0XHRcdGhpZ2g6IHNIaWdoVmFsdWVcblx0XHR9O1xuXHRcdHN3aXRjaCAoc09wZXJhdG9yKSB7XG5cdFx0XHRjYXNlIFwiQ29udGFpbnNcIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiQ1BcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiU3RhcnRzV2l0aFwiOlxuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUub3B0aW9uID0gXCJDUFwiO1xuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUubG93ICs9IFwiKlwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJFbmRzV2l0aFwiOlxuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUub3B0aW9uID0gXCJDUFwiO1xuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUubG93ID0gYCoke29TZWxlY3RPcHRpb25TdGF0ZS5sb3d9YDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiQlRcIjpcblx0XHRcdGNhc2UgXCJMRVwiOlxuXHRcdFx0Y2FzZSBcIkxUXCI6XG5cdFx0XHRjYXNlIFwiR1RcIjpcblx0XHRcdGNhc2UgXCJORVwiOlxuXHRcdFx0Y2FzZSBcIkVRXCI6XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5vcHRpb24gPSBzT3BlcmF0b3I7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkRBVEVcIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiRVFcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiREFURVJBTkdFXCI6XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5vcHRpb24gPSBcIkJUXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkZST01cIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiR0VcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiVE9cIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiTEVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRUVRXCI6XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5vcHRpb24gPSBcIkVRXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkVtcHR5XCI6XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5vcHRpb24gPSBcIkVRXCI7XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5sb3cgPSBcIlwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJOb3RDb250YWluc1wiOlxuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUub3B0aW9uID0gXCJDUFwiO1xuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUuc2lnbiA9IFwiRVwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJOT1RCVFwiOlxuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUub3B0aW9uID0gXCJCVFwiO1xuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUuc2lnbiA9IFwiRVwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJOb3RTdGFydHNXaXRoXCI6XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5vcHRpb24gPSBcIkNQXCI7XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5sb3cgKz0gXCIqXCI7XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5zaWduID0gXCJFXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIk5vdEVuZHNXaXRoXCI6XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5vcHRpb24gPSBcIkNQXCI7XG5cdFx0XHRcdG9TZWxlY3RPcHRpb25TdGF0ZS5sb3cgPSBgKiR7b1NlbGVjdE9wdGlvblN0YXRlLmxvd31gO1xuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUuc2lnbiA9IFwiRVwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJOb3RFbXB0eVwiOlxuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUub3B0aW9uID0gXCJORVwiO1xuXHRcdFx0XHRvU2VsZWN0T3B0aW9uU3RhdGUubG93ID0gXCJcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTk9UTEVcIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiTEVcIjtcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLnNpZ24gPSBcIkVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTk9UR0VcIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiR0VcIjtcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLnNpZ24gPSBcIkVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTk9UTFRcIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiTFRcIjtcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLnNpZ24gPSBcIkVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTk9UR1RcIjpcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLm9wdGlvbiA9IFwiR1RcIjtcblx0XHRcdFx0b1NlbGVjdE9wdGlvblN0YXRlLnNpZ24gPSBcIkVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRMb2cud2FybmluZyhgJHtzT3BlcmF0b3J9IGlzIG5vdCBzdXBwb3J0ZWQuICR7c0ZpbHRlcn0gY291bGQgbm90IGJlIGFkZGVkIHRvIHRoZSBuYXZpZ2F0aW9uIGNvbnRleHRgKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9TZWxlY3RPcHRpb25TdGF0ZTtcblx0fTtcblx0Y29uc3Qgb0ZpbHRlckNvbmRpdGlvbnMgPSBtRmlsdGVycy5maWx0ZXJDb25kaXRpb25zO1xuXHRjb25zdCBvRmlsdGVyc1dpdGhvdXRDb25mbGljdCA9IG1GaWx0ZXJzLmZpbHRlckNvbmRpdGlvbnNXaXRob3V0Q29uZmxpY3QgPyBtRmlsdGVycy5maWx0ZXJDb25kaXRpb25zV2l0aG91dENvbmZsaWN0IDoge307XG5cdGNvbnN0IG9UYWJsZVByb3BlcnRpZXNXaXRob3V0Q29uZmxpY3QgPSBvVGFyZ2V0SW5mby5wcm9wZXJ0aWVzV2l0aG91dENvbmZsaWN0ID8gb1RhcmdldEluZm8ucHJvcGVydGllc1dpdGhvdXRDb25mbGljdCA6IHt9O1xuXHRjb25zdCBhZGRGaWx0ZXJzVG9TZWxlY3Rpb25WYXJpYW50ID0gZnVuY3Rpb24gKHNlbGVjdGlvblZhcmlhbnQ6IGFueSwgc0ZpbHRlck5hbWU6IGFueSwgc1BhdGg/OiBhbnkpIHtcblx0XHRjb25zdCBhQ29uZGl0aW9ucyA9IG9GaWx0ZXJDb25kaXRpb25zW3NGaWx0ZXJOYW1lXTtcblx0XHRjb25zdCBvUHJvcGVydHlJbmZvID0gb0ZpbHRlckJhciAmJiBvRmlsdGVyQmFyLmdldFByb3BlcnR5SGVscGVyKCkuZ2V0UHJvcGVydHkoc0ZpbHRlck5hbWUpO1xuXHRcdGNvbnN0IG9UeXBlQ29uZmlnID0gb1Byb3BlcnR5SW5mbz8udHlwZUNvbmZpZztcblx0XHRjb25zdCBvVHlwZVV0aWwgPSBvRmlsdGVyQmFyICYmIG9GaWx0ZXJCYXIuZ2V0Q29udHJvbERlbGVnYXRlKCkuZ2V0VHlwZVV0aWwoKTtcblxuXHRcdGZvciAoY29uc3QgaXRlbSBpbiBhQ29uZGl0aW9ucykge1xuXHRcdFx0Y29uc3Qgb0NvbmRpdGlvbiA9IGFDb25kaXRpb25zW2l0ZW1dO1xuXG5cdFx0XHRsZXQgb3B0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBcIlwiLFxuXHRcdFx0XHRzaWduID0gXCJJXCIsXG5cdFx0XHRcdGxvdyA9IFwiXCIsXG5cdFx0XHRcdGhpZ2ggPSBudWxsLFxuXHRcdFx0XHRzZW1hbnRpY0RhdGVzO1xuXG5cdFx0XHRjb25zdCBvT3BlcmF0b3I6IGFueSA9IEZpbHRlck9wZXJhdG9yVXRpbC5nZXRPcGVyYXRvcihvQ29uZGl0aW9uLm9wZXJhdG9yKTtcblx0XHRcdGlmIChvT3BlcmF0b3IgaW5zdGFuY2VvZiBSYW5nZU9wZXJhdG9yKSB7XG5cdFx0XHRcdHNlbWFudGljRGF0ZXMgPSBDb21tb25VdGlscy5jcmVhdGVTZW1hbnRpY0RhdGVzRnJvbUNvbmRpdGlvbnMob0NvbmRpdGlvbik7XG5cdFx0XHRcdC8vIGhhbmRsaW5nIG9mIERhdGUgUmFuZ2VPcGVyYXRvcnNcblx0XHRcdFx0Y29uc3Qgb01vZGVsRmlsdGVyID0gb09wZXJhdG9yLmdldE1vZGVsRmlsdGVyKFxuXHRcdFx0XHRcdG9Db25kaXRpb24sXG5cdFx0XHRcdFx0c0ZpbHRlck5hbWUsXG5cdFx0XHRcdFx0b1R5cGVDb25maWc/LnR5cGVJbnN0YW5jZSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRvVHlwZUNvbmZpZz8uYmFzZVR5cGVcblx0XHRcdFx0KSBhcyBhbnk7XG5cdFx0XHRcdGlmICghb01vZGVsRmlsdGVyPy5hRmlsdGVycyAmJiAhb01vZGVsRmlsdGVyPy5hRmlsdGVycz8ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0c2lnbiA9IChvT3BlcmF0b3IgYXMgYW55KT8uZXhjbHVkZSA/IFwiRVwiIDogXCJJXCI7XG5cdFx0XHRcdFx0bG93ID0gb1R5cGVVdGlsLmV4dGVybmFsaXplVmFsdWUob01vZGVsRmlsdGVyLmdldFZhbHVlMSgpLCBvVHlwZUNvbmZpZy50eXBlSW5zdGFuY2UpO1xuXHRcdFx0XHRcdGhpZ2ggPSBvVHlwZVV0aWwuZXh0ZXJuYWxpemVWYWx1ZShvTW9kZWxGaWx0ZXIuZ2V0VmFsdWUyKCksIG9UeXBlQ29uZmlnLnR5cGVJbnN0YW5jZSk7XG5cdFx0XHRcdFx0b3B0aW9uID0gb01vZGVsRmlsdGVyLmdldE9wZXJhdG9yKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGFTZW1hbnRpY0RhdGVPcHNFeHQgPSBTZW1hbnRpY0RhdGVPcGVyYXRvcnMuZ2V0U3VwcG9ydGVkT3BlcmF0aW9ucygpO1xuXHRcdFx0XHRpZiAoYVNlbWFudGljRGF0ZU9wc0V4dC5pbmNsdWRlcyhvQ29uZGl0aW9uPy5vcGVyYXRvcikpIHtcblx0XHRcdFx0XHRzZW1hbnRpY0RhdGVzID0gQ29tbW9uVXRpbHMuY3JlYXRlU2VtYW50aWNEYXRlc0Zyb21Db25kaXRpb25zKG9Db25kaXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHZhbHVlMSA9IChvQ29uZGl0aW9uLnZhbHVlc1swXSAmJiBvQ29uZGl0aW9uLnZhbHVlc1swXS50b1N0cmluZygpKSB8fCBcIlwiO1xuXHRcdFx0XHRjb25zdCB2YWx1ZTIgPSAob0NvbmRpdGlvbi52YWx1ZXNbMV0gJiYgb0NvbmRpdGlvbi52YWx1ZXNbMV0udG9TdHJpbmcoKSkgfHwgbnVsbDtcblx0XHRcdFx0Y29uc3Qgb1NlbGVjdE9wdGlvbiA9IGZuR2V0U2lnbkFuZE9wdGlvbihvQ29uZGl0aW9uLm9wZXJhdG9yLCB2YWx1ZTEsIHZhbHVlMik7XG5cdFx0XHRcdHNpZ24gPSBvT3BlcmF0b3I/LmV4Y2x1ZGUgPyBcIkVcIiA6IFwiSVwiO1xuXHRcdFx0XHRsb3cgPSBvU2VsZWN0T3B0aW9uPy5sb3c7XG5cdFx0XHRcdGhpZ2ggPSBvU2VsZWN0T3B0aW9uPy5oaWdoO1xuXHRcdFx0XHRvcHRpb24gPSBvU2VsZWN0T3B0aW9uPy5vcHRpb247XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRpb24gJiYgc2VtYW50aWNEYXRlcykge1xuXHRcdFx0XHRzZWxlY3Rpb25WYXJpYW50LmFkZFNlbGVjdE9wdGlvbihzUGF0aCA/IHNQYXRoIDogc0ZpbHRlck5hbWUsIHNpZ24sIG9wdGlvbiwgbG93LCBoaWdoLCB1bmRlZmluZWQsIHNlbWFudGljRGF0ZXMpO1xuXHRcdFx0fSBlbHNlIGlmIChvcHRpb24pIHtcblx0XHRcdFx0c2VsZWN0aW9uVmFyaWFudC5hZGRTZWxlY3RPcHRpb24oc1BhdGggPyBzUGF0aCA6IHNGaWx0ZXJOYW1lLCBzaWduLCBvcHRpb24sIGxvdywgaGlnaCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGZvciAoc0ZpbHRlciBpbiBvRmlsdGVyQ29uZGl0aW9ucykge1xuXHRcdC8vIG9ubHkgYWRkIHRoZSBmaWx0ZXIgdmFsdWVzIGlmIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQgaW4gdGhlIFNWIGFscmVhZHlcblx0XHRpZiAoIW9TZWxlY3Rpb25WYXJpYW50LmdldFNlbGVjdE9wdGlvbihzRmlsdGVyKSkge1xuXHRcdFx0Ly8gVE9ETyA6IGN1c3RvbSBmaWx0ZXJzIHNob3VsZCBiZSBpZ25vcmVkIG1vcmUgZ2VuZXJpY2FsbHlcblx0XHRcdGlmIChzRmlsdGVyID09PSBcIiRlZGl0U3RhdGVcIikge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGFkZEZpbHRlcnNUb1NlbGVjdGlvblZhcmlhbnQob1NlbGVjdGlvblZhcmlhbnQsIHNGaWx0ZXIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAob1RhYmxlUHJvcGVydGllc1dpdGhvdXRDb25mbGljdCAmJiBzRmlsdGVyIGluIG9UYWJsZVByb3BlcnRpZXNXaXRob3V0Q29uZmxpY3QpIHtcblx0XHRcdFx0YWRkRmlsdGVyc1RvU2VsZWN0aW9uVmFyaWFudChvU2VsZWN0aW9uVmFyaWFudCwgc0ZpbHRlciwgb1RhYmxlUHJvcGVydGllc1dpdGhvdXRDb25mbGljdFtzRmlsdGVyXSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBwcm9wZXJ0eSB3YXMgd2l0aG91dCBjb25mbGljdCBpbiBwYWdlIGNvbnRleHQgdGhlbiBhZGQgcGF0aCBmcm9tIHBhZ2UgY29udGV4dCB0byBTVlxuXHRcdFx0aWYgKHNGaWx0ZXIgaW4gb0ZpbHRlcnNXaXRob3V0Q29uZmxpY3QpIHtcblx0XHRcdFx0YWRkRmlsdGVyc1RvU2VsZWN0aW9uVmFyaWFudChvU2VsZWN0aW9uVmFyaWFudCwgc0ZpbHRlciwgb0ZpbHRlcnNXaXRob3V0Q29uZmxpY3Rbc0ZpbHRlcl0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gb1NlbGVjdGlvblZhcmlhbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU3RpY2t5RWRpdE1vZGUob0NvbnRyb2w6IENvbnRyb2wpIHtcblx0Y29uc3QgYklzU3RpY2t5TW9kZSA9IE1vZGVsSGVscGVyLmlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCgob0NvbnRyb2wuZ2V0TW9kZWwoKSBhcyBPRGF0YU1vZGVsKS5nZXRNZXRhTW9kZWwoKSk7XG5cdGNvbnN0IGJVSUVkaXRhYmxlID0gb0NvbnRyb2wuZ2V0TW9kZWwoXCJ1aVwiKS5nZXRQcm9wZXJ0eShcIi9pc0VkaXRhYmxlXCIpO1xuXHRyZXR1cm4gYklzU3RpY2t5TW9kZSAmJiBiVUlFZGl0YWJsZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gYU1hbmRhdG9yeUZpbHRlckZpZWxkc1xuICogQHBhcmFtIG9TZWxlY3Rpb25WYXJpYW50XG4gKiBAcGFyYW0gb1NlbGVjdGlvblZhcmlhbnREZWZhdWx0c1xuICovXG5mdW5jdGlvbiBhZGREZWZhdWx0RGlzcGxheUN1cnJlbmN5KGFNYW5kYXRvcnlGaWx0ZXJGaWVsZHM6IGFueVtdLCBvU2VsZWN0aW9uVmFyaWFudDogYW55LCBvU2VsZWN0aW9uVmFyaWFudERlZmF1bHRzOiBhbnkpIHtcblx0aWYgKG9TZWxlY3Rpb25WYXJpYW50ICYmIGFNYW5kYXRvcnlGaWx0ZXJGaWVsZHMgJiYgYU1hbmRhdG9yeUZpbHRlckZpZWxkcy5sZW5ndGgpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFNYW5kYXRvcnlGaWx0ZXJGaWVsZHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGFTVk9wdGlvbiA9IG9TZWxlY3Rpb25WYXJpYW50LmdldFNlbGVjdE9wdGlvbihcIkRpc3BsYXlDdXJyZW5jeVwiKSxcblx0XHRcdFx0YURlZmF1bHRTVk9wdGlvbiA9IG9TZWxlY3Rpb25WYXJpYW50RGVmYXVsdHMgJiYgb1NlbGVjdGlvblZhcmlhbnREZWZhdWx0cy5nZXRTZWxlY3RPcHRpb24oXCJEaXNwbGF5Q3VycmVuY3lcIik7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGFNYW5kYXRvcnlGaWx0ZXJGaWVsZHNbaV0uJFByb3BlcnR5UGF0aCA9PT0gXCJEaXNwbGF5Q3VycmVuY3lcIiAmJlxuXHRcdFx0XHQoIWFTVk9wdGlvbiB8fCAhYVNWT3B0aW9uLmxlbmd0aCkgJiZcblx0XHRcdFx0YURlZmF1bHRTVk9wdGlvbiAmJlxuXHRcdFx0XHRhRGVmYXVsdFNWT3B0aW9uLmxlbmd0aFxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlDdXJyZW5jeVNlbGVjdE9wdGlvbiA9IGFEZWZhdWx0U1ZPcHRpb25bMF07XG5cdFx0XHRcdGNvbnN0IHNTaWduID0gZGlzcGxheUN1cnJlbmN5U2VsZWN0T3B0aW9uW1wiU2lnblwiXTtcblx0XHRcdFx0Y29uc3Qgc09wdGlvbiA9IGRpc3BsYXlDdXJyZW5jeVNlbGVjdE9wdGlvbltcIk9wdGlvblwiXTtcblx0XHRcdFx0Y29uc3Qgc0xvdyA9IGRpc3BsYXlDdXJyZW5jeVNlbGVjdE9wdGlvbltcIkxvd1wiXTtcblx0XHRcdFx0Y29uc3Qgc0hpZ2ggPSBkaXNwbGF5Q3VycmVuY3lTZWxlY3RPcHRpb25bXCJIaWdoXCJdO1xuXHRcdFx0XHRvU2VsZWN0aW9uVmFyaWFudC5hZGRTZWxlY3RPcHRpb24oXCJEaXNwbGF5Q3VycmVuY3lcIiwgc1NpZ24sIHNPcHRpb24sIHNMb3csIHNIaWdoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0Tm9uQ29tcHV0ZWRWaXNpYmxlRmllbGRzKG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLCBzUGF0aDogYW55LCBvVmlldz86IGFueSkge1xuXHRjb25zdCBhVGVjaG5pY2FsS2V5cyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXRofS9gKS4kS2V5O1xuXHRjb25zdCBhTm9uQ29tcHV0ZWRWaXNpYmxlRmllbGRzOiBhbnkgPSBbXTtcblx0Y29uc3QgYUltbXV0YWJsZVZpc2libGVGaWVsZHM6IGFueSA9IFtdO1xuXHRjb25zdCBvRW50aXR5VHlwZSA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXRofS9gKTtcblx0Zm9yIChjb25zdCBpdGVtIGluIG9FbnRpdHlUeXBlKSB7XG5cdFx0aWYgKG9FbnRpdHlUeXBlW2l0ZW1dLiRraW5kICYmIG9FbnRpdHlUeXBlW2l0ZW1dLiRraW5kID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRcdGNvbnN0IG9Bbm5vdGF0aW9ucyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXRofS8ke2l0ZW19QGApIHx8IHt9LFxuXHRcdFx0XHRiSXNLZXkgPSBhVGVjaG5pY2FsS2V5cy5pbmRleE9mKGl0ZW0pID4gLTEsXG5cdFx0XHRcdGJJc0ltbXV0YWJsZSA9IG9Bbm5vdGF0aW9uc1tcIkBPcmcuT0RhdGEuQ29yZS5WMS5JbW11dGFibGVcIl0sXG5cdFx0XHRcdGJJc05vbkNvbXB1dGVkID0gIW9Bbm5vdGF0aW9uc1tcIkBPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiXSxcblx0XHRcdFx0YklzVmlzaWJsZSA9ICFvQW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuXCJdLFxuXHRcdFx0XHRiSXNDb21wdXRlZERlZmF1bHRWYWx1ZSA9IG9Bbm5vdGF0aW9uc1tcIkBPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZERlZmF1bHRWYWx1ZVwiXSxcblx0XHRcdFx0YklzS2V5Q29tcHV0ZWREZWZhdWx0VmFsdWVXaXRoVGV4dCA9XG5cdFx0XHRcdFx0YklzS2V5ICYmIG9FbnRpdHlUeXBlW2l0ZW1dLiRUeXBlID09PSBcIkVkbS5HdWlkXCJcblx0XHRcdFx0XHRcdD8gYklzQ29tcHV0ZWREZWZhdWx0VmFsdWUgJiYgb0Fubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0XCJdXG5cdFx0XHRcdFx0XHQ6IGZhbHNlO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQoYklzS2V5Q29tcHV0ZWREZWZhdWx0VmFsdWVXaXRoVGV4dCB8fCAoYklzS2V5ICYmIG9FbnRpdHlUeXBlW2l0ZW1dLiRUeXBlICE9PSBcIkVkbS5HdWlkXCIpKSAmJlxuXHRcdFx0XHRiSXNOb25Db21wdXRlZCAmJlxuXHRcdFx0XHRiSXNWaXNpYmxlXG5cdFx0XHQpIHtcblx0XHRcdFx0YU5vbkNvbXB1dGVkVmlzaWJsZUZpZWxkcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fSBlbHNlIGlmIChiSXNJbW11dGFibGUgJiYgYklzTm9uQ29tcHV0ZWQgJiYgYklzVmlzaWJsZSkge1xuXHRcdFx0XHRhSW1tdXRhYmxlVmlzaWJsZUZpZWxkcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWJJc05vbkNvbXB1dGVkICYmIGJJc0NvbXB1dGVkRGVmYXVsdFZhbHVlICYmIG9WaWV3KSB7XG5cdFx0XHRcdGNvbnN0IG9EaWFnbm9zdGljcyA9IGdldEFwcENvbXBvbmVudChvVmlldykuZ2V0RGlhZ25vc3RpY3MoKTtcblx0XHRcdFx0Y29uc3Qgc01lc3NhZ2UgPSBcIkNvcmUuQ29tcHV0ZWREZWZhdWx0VmFsdWUgaXMgaWdub3JlZCBhcyBDb3JlLkNvbXB1dGVkIGlzIGFscmVhZHkgc2V0IHRvIHRydWVcIjtcblx0XHRcdFx0b0RpYWdub3N0aWNzLmFkZElzc3VlKFxuXHRcdFx0XHRcdElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbixcblx0XHRcdFx0XHRJc3N1ZVNldmVyaXR5Lk1lZGl1bSxcblx0XHRcdFx0XHRzTWVzc2FnZSxcblx0XHRcdFx0XHRJc3N1ZUNhdGVnb3J5VHlwZSxcblx0XHRcdFx0XHRJc3N1ZUNhdGVnb3J5VHlwZT8uQW5ub3RhdGlvbnM/Lklnbm9yZWRBbm5vdGF0aW9uXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGNvbnN0IGFSZXF1aXJlZFByb3BlcnRpZXMgPSBDb21tb25VdGlscy5nZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tSW5zZXJ0UmVzdHJpY3Rpb25zKHNQYXRoLCBvTWV0YU1vZGVsKTtcblx0aWYgKGFSZXF1aXJlZFByb3BlcnRpZXMubGVuZ3RoKSB7XG5cdFx0YVJlcXVpcmVkUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChzUHJvcGVydHk6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0Fubm90YXRpb25zID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c1BhdGh9LyR7c1Byb3BlcnR5fUBgKSxcblx0XHRcdFx0YklzVmlzaWJsZSA9ICFvQW5ub3RhdGlvbnMgfHwgIW9Bbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5cIl07XG5cdFx0XHRpZiAoYklzVmlzaWJsZSAmJiBhTm9uQ29tcHV0ZWRWaXNpYmxlRmllbGRzLmluZGV4T2Yoc1Byb3BlcnR5KSA9PT0gLTEgJiYgYUltbXV0YWJsZVZpc2libGVGaWVsZHMuaW5kZXhPZihzUHJvcGVydHkpID09PSAtMSkge1xuXHRcdFx0XHRhTm9uQ29tcHV0ZWRWaXNpYmxlRmllbGRzLnB1c2goc1Byb3BlcnR5KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYU5vbkNvbXB1dGVkVmlzaWJsZUZpZWxkcy5jb25jYXQoYUltbXV0YWJsZVZpc2libGVGaWVsZHMpO1xufVxuXG5mdW5jdGlvbiBnZXRSZXF1aXJlZFByb3BlcnRpZXMoc1BhdGg6IGFueSwgb01ldGFNb2RlbDogYW55LCBiQ2hlY2tVcGRhdGVSZXN0cmljdGlvbnM6IGJvb2xlYW4gPSBmYWxzZSkge1xuXHRjb25zdCBhUmVxdWlyZWRQcm9wZXJ0aWVzOiBhbnkgPSBbXTtcblx0bGV0IGFSZXF1aXJlZFByb3BlcnRpZXNXaXRoUGF0aHM6IGFueSA9IFtdO1xuXHRjb25zdCBuYXZpZ2F0aW9uVGV4dCA9IFwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjtcblx0bGV0IG9FbnRpdHlTZXRBbm5vdGF0aW9ucztcblx0aWYgKHNQYXRoLmVuZHNXaXRoKFwiJFwiKSkge1xuXHRcdC8vIGlmIHNQYXRoIGNvbWVzIHdpdGggYSAkIGluIHRoZSBlbmQsIHJlbW92aW5nIGl0IGFzIGl0IGlzIG9mIG5vIHNpZ25pZmljYW5jZVxuXHRcdHNQYXRoID0gc1BhdGgucmVwbGFjZShcIi8kXCIsIFwiXCIpO1xuXHR9XG5cdGNvbnN0IGVudGl0eVR5cGVQYXRoUGFydHMgPSBzUGF0aC5yZXBsYWNlQWxsKFwiJTJGXCIsIFwiL1wiKS5zcGxpdChcIi9cIikuZmlsdGVyKE1vZGVsSGVscGVyLmZpbHRlck91dE5hdlByb3BCaW5kaW5nKTtcblx0Y29uc3QgZW50aXR5U2V0UGF0aCA9IE1vZGVsSGVscGVyLmdldEVudGl0eVNldFBhdGgoc1BhdGgsIG9NZXRhTW9kZWwpO1xuXHRjb25zdCBlbnRpdHlTZXRQYXRoUGFydHMgPSBlbnRpdHlTZXRQYXRoLnNwbGl0KFwiL1wiKS5maWx0ZXIoTW9kZWxIZWxwZXIuZmlsdGVyT3V0TmF2UHJvcEJpbmRpbmcpO1xuXHRjb25zdCBpc0NvbnRhaW5tZW50ID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVQYXRoUGFydHMuam9pbihcIi9cIil9LyRDb250YWluc1RhcmdldGApO1xuXHRjb25zdCBjb250YWlubWVudE5hdlBhdGggPSBpc0NvbnRhaW5tZW50ICYmIGVudGl0eVR5cGVQYXRoUGFydHNbZW50aXR5VHlwZVBhdGhQYXJ0cy5sZW5ndGggLSAxXTtcblxuXHQvL1Jlc3RyaWN0aW9ucyBkaXJlY3RseSBhdCBFbnRpdHkgU2V0XG5cdC8vZS5nLiBGUiBpbiBcIk5TLkVudGl0eUNvbnRhaW5lci9TYWxlc09yZGVyTWFuYWdlXCIgQ29udGV4dFBhdGg6IC9TYWxlc09yZGVyTWFuYWdlXG5cdGlmICghaXNDb250YWlubWVudCkge1xuXHRcdG9FbnRpdHlTZXRBbm5vdGF0aW9ucyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke2VudGl0eVNldFBhdGh9QGApO1xuXHR9XG5cdGlmIChlbnRpdHlUeXBlUGF0aFBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRjb25zdCBuYXZQYXRoID0gaXNDb250YWlubWVudCA/IGNvbnRhaW5tZW50TmF2UGF0aCA6IGVudGl0eVNldFBhdGhQYXJ0c1tlbnRpdHlTZXRQYXRoUGFydHMubGVuZ3RoIC0gMV07XG5cdFx0Y29uc3QgcGFyZW50RW50aXR5U2V0UGF0aCA9IGlzQ29udGFpbm1lbnQgPyBlbnRpdHlTZXRQYXRoIDogYC8ke2VudGl0eVNldFBhdGhQYXJ0cy5zbGljZSgwLCAtMSkuam9pbihgLyR7bmF2aWdhdGlvblRleHR9L2ApfWA7XG5cdFx0Ly9OYXZpZ2F0aW9uIHJlc3RyaWN0aW9uc1xuXHRcdC8vZS5nLiBQYXJlbnQgXCIvQ3VzdG9tZXJcIiB3aXRoIE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg9XCJTZXRcIiBDb250ZXh0UGF0aDogQ3VzdG9tZXIvU2V0XG5cdFx0Y29uc3Qgb05hdlJlc3QgPSBDb21tb25VdGlscy5nZXROYXZpZ2F0aW9uUmVzdHJpY3Rpb25zKG9NZXRhTW9kZWwsIHBhcmVudEVudGl0eVNldFBhdGgsIG5hdlBhdGgucmVwbGFjZUFsbChcIiUyRlwiLCBcIi9cIikpO1xuXG5cdFx0aWYgKENvbW1vblV0aWxzLmhhc1Jlc3RyaWN0ZWRQcm9wZXJ0aWVzSW5Bbm5vdGF0aW9ucyhvTmF2UmVzdCwgdHJ1ZSwgYkNoZWNrVXBkYXRlUmVzdHJpY3Rpb25zKSkge1xuXHRcdFx0YVJlcXVpcmVkUHJvcGVydGllc1dpdGhQYXRocyA9IGJDaGVja1VwZGF0ZVJlc3RyaWN0aW9uc1xuXHRcdFx0XHQ/IG9OYXZSZXN0W1wiVXBkYXRlUmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllc1xuXHRcdFx0XHQ6IG9OYXZSZXN0W1wiSW5zZXJ0UmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllcztcblx0XHR9XG5cdFx0aWYgKFxuXHRcdFx0KCFhUmVxdWlyZWRQcm9wZXJ0aWVzV2l0aFBhdGhzIHx8ICFhUmVxdWlyZWRQcm9wZXJ0aWVzV2l0aFBhdGhzLmxlbmd0aCkgJiZcblx0XHRcdENvbW1vblV0aWxzLmhhc1Jlc3RyaWN0ZWRQcm9wZXJ0aWVzSW5Bbm5vdGF0aW9ucyhvRW50aXR5U2V0QW5ub3RhdGlvbnMsIGZhbHNlLCBiQ2hlY2tVcGRhdGVSZXN0cmljdGlvbnMpXG5cdFx0KSB7XG5cdFx0XHRhUmVxdWlyZWRQcm9wZXJ0aWVzV2l0aFBhdGhzID0gQ29tbW9uVXRpbHMuZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUFubm90YXRpb25zKFxuXHRcdFx0XHRvRW50aXR5U2V0QW5ub3RhdGlvbnMsXG5cdFx0XHRcdGJDaGVja1VwZGF0ZVJlc3RyaWN0aW9uc1xuXHRcdFx0KTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoQ29tbW9uVXRpbHMuaGFzUmVzdHJpY3RlZFByb3BlcnRpZXNJbkFubm90YXRpb25zKG9FbnRpdHlTZXRBbm5vdGF0aW9ucywgZmFsc2UsIGJDaGVja1VwZGF0ZVJlc3RyaWN0aW9ucykpIHtcblx0XHRhUmVxdWlyZWRQcm9wZXJ0aWVzV2l0aFBhdGhzID0gQ29tbW9uVXRpbHMuZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUFubm90YXRpb25zKG9FbnRpdHlTZXRBbm5vdGF0aW9ucywgYkNoZWNrVXBkYXRlUmVzdHJpY3Rpb25zKTtcblx0fVxuXHRhUmVxdWlyZWRQcm9wZXJ0aWVzV2l0aFBhdGhzLmZvckVhY2goZnVuY3Rpb24gKG9SZXF1aXJlZFByb3BlcnR5OiBhbnkpIHtcblx0XHRjb25zdCBzUHJvcGVydHkgPSBvUmVxdWlyZWRQcm9wZXJ0eVtcIiRQcm9wZXJ0eVBhdGhcIl07XG5cdFx0YVJlcXVpcmVkUHJvcGVydGllcy5wdXNoKHNQcm9wZXJ0eSk7XG5cdH0pO1xuXHRyZXR1cm4gYVJlcXVpcmVkUHJvcGVydGllcztcbn1cblxuZnVuY3Rpb24gZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzRnJvbUluc2VydFJlc3RyaWN0aW9ucyhzUGF0aDogYW55LCBvTWV0YU1vZGVsOiBhbnkpIHtcblx0cmV0dXJuIENvbW1vblV0aWxzLmdldFJlcXVpcmVkUHJvcGVydGllcyhzUGF0aCwgb01ldGFNb2RlbCk7XG59XG5cbmZ1bmN0aW9uIGdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMoc1BhdGg6IGFueSwgb01ldGFNb2RlbDogYW55KSB7XG5cdHJldHVybiBDb21tb25VdGlscy5nZXRSZXF1aXJlZFByb3BlcnRpZXMoc1BhdGgsIG9NZXRhTW9kZWwsIHRydWUpO1xufVxuXG5mdW5jdGlvbiBnZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tQW5ub3RhdGlvbnMob0Fubm90YXRpb25zOiBhbnksIGJDaGVja1VwZGF0ZVJlc3RyaWN0aW9uczogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdGlmIChiQ2hlY2tVcGRhdGVSZXN0cmljdGlvbnMpIHtcblx0XHRyZXR1cm4gb0Fubm90YXRpb25zW1wiQE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVXBkYXRlUmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllcztcblx0fVxuXHRyZXR1cm4gb0Fubm90YXRpb25zW1wiQE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSW5zZXJ0UmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllcztcbn1cblxuZnVuY3Rpb24gaGFzUmVzdHJpY3RlZFByb3BlcnRpZXNJbkFubm90YXRpb25zKFxuXHRvQW5ub3RhdGlvbnM6IGFueSxcblx0YklzTmF2aWdhdGlvblJlc3RyaWN0aW9uczogYm9vbGVhbiA9IGZhbHNlLFxuXHRiQ2hlY2tVcGRhdGVSZXN0cmljdGlvbnM6IGJvb2xlYW4gPSBmYWxzZVxuKSB7XG5cdGlmIChiSXNOYXZpZ2F0aW9uUmVzdHJpY3Rpb25zKSB7XG5cdFx0aWYgKGJDaGVja1VwZGF0ZVJlc3RyaWN0aW9ucykge1xuXHRcdFx0cmV0dXJuIG9Bbm5vdGF0aW9ucyAmJiBvQW5ub3RhdGlvbnNbXCJVcGRhdGVSZXN0cmljdGlvbnNcIl0gJiYgb0Fubm90YXRpb25zW1wiVXBkYXRlUmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllc1xuXHRcdFx0XHQ/IHRydWVcblx0XHRcdFx0OiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIG9Bbm5vdGF0aW9ucyAmJiBvQW5ub3RhdGlvbnNbXCJJbnNlcnRSZXN0cmljdGlvbnNcIl0gJiYgb0Fubm90YXRpb25zW1wiSW5zZXJ0UmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllcyA/IHRydWUgOiBmYWxzZTtcblx0fSBlbHNlIGlmIChiQ2hlY2tVcGRhdGVSZXN0cmljdGlvbnMpIHtcblx0XHRyZXR1cm4gb0Fubm90YXRpb25zICYmXG5cdFx0XHRvQW5ub3RhdGlvbnNbXCJAT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5VcGRhdGVSZXN0cmljdGlvbnNcIl0gJiZcblx0XHRcdG9Bbm5vdGF0aW9uc1tcIkBPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlVwZGF0ZVJlc3RyaWN0aW9uc1wiXS5SZXF1aXJlZFByb3BlcnRpZXNcblx0XHRcdD8gdHJ1ZVxuXHRcdFx0OiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gb0Fubm90YXRpb25zICYmXG5cdFx0b0Fubm90YXRpb25zW1wiQE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSW5zZXJ0UmVzdHJpY3Rpb25zXCJdICYmXG5cdFx0b0Fubm90YXRpb25zW1wiQE9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSW5zZXJ0UmVzdHJpY3Rpb25zXCJdLlJlcXVpcmVkUHJvcGVydGllc1xuXHRcdD8gdHJ1ZVxuXHRcdDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNldFVzZXJEZWZhdWx0cyhcblx0b0FwcENvbXBvbmVudDogQXBwQ29tcG9uZW50LFxuXHRhUGFyYW1ldGVyczogYW55W10sXG5cdG9Nb2RlbDogSlNPTk1vZGVsIHwgT0RhdGFWNENvbnRleHQsXG5cdGJJc0FjdGlvbjogYm9vbGVhbixcblx0YklzQ3JlYXRlPzogYm9vbGVhbixcblx0b0FjdGlvbkRlZmF1bHRWYWx1ZXM/OiBhbnlcbikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG5cdFx0Y29uc3Qgb0NvbXBvbmVudERhdGEgPSBvQXBwQ29tcG9uZW50LmdldENvbXBvbmVudERhdGEoKSxcblx0XHRcdG9TdGFydHVwUGFyYW1ldGVycyA9IChvQ29tcG9uZW50RGF0YSAmJiBvQ29tcG9uZW50RGF0YS5zdGFydHVwUGFyYW1ldGVycykgfHwge30sXG5cdFx0XHRvU2hlbGxTZXJ2aWNlcyA9IG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpO1xuXHRcdGlmICghb1NoZWxsU2VydmljZXMuaGFzVVNoZWxsKCkpIHtcblx0XHRcdGFQYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9QYXJhbWV0ZXI6IGFueSkge1xuXHRcdFx0XHRjb25zdCBzUHJvcGVydHlOYW1lID0gYklzQWN0aW9uXG5cdFx0XHRcdFx0PyBgLyR7b1BhcmFtZXRlci4kTmFtZX1gXG5cdFx0XHRcdFx0OiBvUGFyYW1ldGVyLmdldFBhdGgoKS5zbGljZShvUGFyYW1ldGVyLmdldFBhdGgoKS5sYXN0SW5kZXhPZihcIi9cIikgKyAxKTtcblx0XHRcdFx0Y29uc3Qgc1BhcmFtZXRlck5hbWUgPSBiSXNBY3Rpb24gPyBzUHJvcGVydHlOYW1lLnNsaWNlKDEpIDogc1Byb3BlcnR5TmFtZTtcblx0XHRcdFx0aWYgKG9BY3Rpb25EZWZhdWx0VmFsdWVzICYmIGJJc0NyZWF0ZSkge1xuXHRcdFx0XHRcdGlmIChvQWN0aW9uRGVmYXVsdFZhbHVlc1tzUGFyYW1ldGVyTmFtZV0pIHtcblx0XHRcdFx0XHRcdG9Nb2RlbC5zZXRQcm9wZXJ0eShzUHJvcGVydHlOYW1lLCBvQWN0aW9uRGVmYXVsdFZhbHVlc1tzUGFyYW1ldGVyTmFtZV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChvU3RhcnR1cFBhcmFtZXRlcnNbc1BhcmFtZXRlck5hbWVdKSB7XG5cdFx0XHRcdFx0b01vZGVsLnNldFByb3BlcnR5KHNQcm9wZXJ0eU5hbWUsIG9TdGFydHVwUGFyYW1ldGVyc1tzUGFyYW1ldGVyTmFtZV1bMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXNvbHZlKHRydWUpO1xuXHRcdH1cblx0XHRyZXR1cm4gb1NoZWxsU2VydmljZXMuZ2V0U3RhcnR1cEFwcFN0YXRlKG9BcHBDb21wb25lbnQpLnRoZW4oZnVuY3Rpb24gKG9TdGFydHVwQXBwU3RhdGU6IGFueSkge1xuXHRcdFx0Y29uc3Qgb0RhdGEgPSBvU3RhcnR1cEFwcFN0YXRlLmdldERhdGEoKSB8fCB7fSxcblx0XHRcdFx0YUV4dGVuZGVkUGFyYW1ldGVycyA9IChvRGF0YS5zZWxlY3Rpb25WYXJpYW50ICYmIG9EYXRhLnNlbGVjdGlvblZhcmlhbnQuU2VsZWN0T3B0aW9ucykgfHwgW107XG5cdFx0XHRhUGFyYW1ldGVycy5mb3JFYWNoKGZ1bmN0aW9uIChvUGFyYW1ldGVyOiBhbnkpIHtcblx0XHRcdFx0Y29uc3Qgc1Byb3BlcnR5TmFtZSA9IGJJc0FjdGlvblxuXHRcdFx0XHRcdD8gYC8ke29QYXJhbWV0ZXIuJE5hbWV9YFxuXHRcdFx0XHRcdDogb1BhcmFtZXRlci5nZXRQYXRoKCkuc2xpY2Uob1BhcmFtZXRlci5nZXRQYXRoKCkubGFzdEluZGV4T2YoXCIvXCIpICsgMSk7XG5cdFx0XHRcdGNvbnN0IHNQYXJhbWV0ZXJOYW1lID0gYklzQWN0aW9uID8gc1Byb3BlcnR5TmFtZS5zbGljZSgxKSA6IHNQcm9wZXJ0eU5hbWU7XG5cdFx0XHRcdGlmIChvQWN0aW9uRGVmYXVsdFZhbHVlcyAmJiBiSXNDcmVhdGUpIHtcblx0XHRcdFx0XHRpZiAob0FjdGlvbkRlZmF1bHRWYWx1ZXNbc1BhcmFtZXRlck5hbWVdKSB7XG5cdFx0XHRcdFx0XHRvTW9kZWwuc2V0UHJvcGVydHkoc1Byb3BlcnR5TmFtZSwgb0FjdGlvbkRlZmF1bHRWYWx1ZXNbc1BhcmFtZXRlck5hbWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAob1N0YXJ0dXBQYXJhbWV0ZXJzW3NQYXJhbWV0ZXJOYW1lXSkge1xuXHRcdFx0XHRcdG9Nb2RlbC5zZXRQcm9wZXJ0eShzUHJvcGVydHlOYW1lLCBvU3RhcnR1cFBhcmFtZXRlcnNbc1BhcmFtZXRlck5hbWVdWzBdKTtcblx0XHRcdFx0fSBlbHNlIGlmIChhRXh0ZW5kZWRQYXJhbWV0ZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IGkgaW4gYUV4dGVuZGVkUGFyYW1ldGVycykge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb0V4dGVuZGVkUGFyYW1ldGVyID0gYUV4dGVuZGVkUGFyYW1ldGVyc1tpXTtcblx0XHRcdFx0XHRcdGlmIChvRXh0ZW5kZWRQYXJhbWV0ZXIuUHJvcGVydHlOYW1lID09PSBzUGFyYW1ldGVyTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvUmFuZ2UgPSBvRXh0ZW5kZWRQYXJhbWV0ZXIuUmFuZ2VzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdD8gb0V4dGVuZGVkUGFyYW1ldGVyLlJhbmdlc1tvRXh0ZW5kZWRQYXJhbWV0ZXIuUmFuZ2VzLmxlbmd0aCAtIDFdXG5cdFx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdGlmIChvUmFuZ2UgJiYgb1JhbmdlLlNpZ24gPT09IFwiSVwiICYmIG9SYW5nZS5PcHRpb24gPT09IFwiRVFcIikge1xuXHRcdFx0XHRcdFx0XHRcdG9Nb2RlbC5zZXRQcm9wZXJ0eShzUHJvcGVydHlOYW1lLCBvUmFuZ2UuTG93KTsgLy8gaGlnaCBpcyBpZ25vcmVkIHdoZW4gT3B0aW9uPUVRXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc29sdmUodHJ1ZSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBZGRpdGlvbmFsUGFyYW1zRm9yQ3JlYXRlKG9TdGFydHVwUGFyYW1ldGVyczogYW55LCBvSW5ib3VuZFBhcmFtZXRlcnM6IGFueSkge1xuXHRjb25zdCBvSW5ib3VuZHMgPSBvSW5ib3VuZFBhcmFtZXRlcnMsXG5cdFx0YUNyZWF0ZVBhcmFtZXRlcnMgPSBvSW5ib3VuZHNcblx0XHRcdD8gT2JqZWN0LmtleXMob0luYm91bmRzKS5maWx0ZXIoZnVuY3Rpb24gKHNQYXJhbWV0ZXI6IHN0cmluZykge1xuXHRcdFx0XHRcdHJldHVybiBvSW5ib3VuZHNbc1BhcmFtZXRlcl0udXNlRm9yQ3JlYXRlO1xuXHRcdFx0ICB9KVxuXHRcdFx0OiBbXTtcblx0bGV0IG9SZXQ7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYUNyZWF0ZVBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBzQ3JlYXRlUGFyYW1ldGVyID0gYUNyZWF0ZVBhcmFtZXRlcnNbaV07XG5cdFx0Y29uc3QgYVZhbHVlcyA9IG9TdGFydHVwUGFyYW1ldGVycyAmJiBvU3RhcnR1cFBhcmFtZXRlcnNbc0NyZWF0ZVBhcmFtZXRlcl07XG5cdFx0aWYgKGFWYWx1ZXMgJiYgYVZhbHVlcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdG9SZXQgPSBvUmV0IHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdFx0XHRvUmV0W3NDcmVhdGVQYXJhbWV0ZXJdID0gYVZhbHVlc1swXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9SZXQ7XG59XG5cbmZ1bmN0aW9uIGdldFNlbWFudGljT2JqZWN0TWFwcGluZyhvT3V0Ym91bmQ6IGFueSkge1xuXHRjb25zdCBhU2VtYW50aWNPYmplY3RNYXBwaW5nOiBhbnlbXSA9IFtdO1xuXHRpZiAob091dGJvdW5kLnBhcmFtZXRlcnMpIHtcblx0XHRjb25zdCBhUGFyYW1ldGVycyA9IE9iamVjdC5rZXlzKG9PdXRib3VuZC5wYXJhbWV0ZXJzKSB8fCBbXTtcblx0XHRpZiAoYVBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0YVBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1BhcmFtOiBzdHJpbmcpIHtcblx0XHRcdFx0Y29uc3Qgb01hcHBpbmcgPSBvT3V0Ym91bmQucGFyYW1ldGVyc1tzUGFyYW1dO1xuXHRcdFx0XHRpZiAob01hcHBpbmcudmFsdWUgJiYgb01hcHBpbmcudmFsdWUudmFsdWUgJiYgb01hcHBpbmcudmFsdWUuZm9ybWF0ID09PSBcImJpbmRpbmdcIikge1xuXHRcdFx0XHRcdC8vIHVzaW5nIHRoZSBmb3JtYXQgb2YgVUkuTWFwcGluZ1xuXHRcdFx0XHRcdGNvbnN0IG9TZW1hbnRpY01hcHBpbmcgPSB7XG5cdFx0XHRcdFx0XHRcIkxvY2FsUHJvcGVydHlcIjoge1xuXHRcdFx0XHRcdFx0XHRcIiRQcm9wZXJ0eVBhdGhcIjogb01hcHBpbmcudmFsdWUudmFsdWVcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcIlNlbWFudGljT2JqZWN0UHJvcGVydHlcIjogc1BhcmFtXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGlmIChhU2VtYW50aWNPYmplY3RNYXBwaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdC8vIFRvIGNoZWNrIGlmIHRoZSBzZW1hbnRpY09iamVjdCBNYXBwaW5nIGlzIGRvbmUgZm9yIHRoZSBzYW1lIGxvY2FsIHByb3BlcnR5IG1vcmUgdGhhdCBvbmNlIHRoZW4gZmlyc3Qgb25lIHdpbGwgYmUgY29uc2lkZXJlZFxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhU2VtYW50aWNPYmplY3RNYXBwaW5nLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRhU2VtYW50aWNPYmplY3RNYXBwaW5nW2ldW1wiTG9jYWxQcm9wZXJ0eVwiXVtcIiRQcm9wZXJ0eVBhdGhcIl0gIT09XG5cdFx0XHRcdFx0XHRcdFx0b1NlbWFudGljTWFwcGluZ1tcIkxvY2FsUHJvcGVydHlcIl1bXCIkUHJvcGVydHlQYXRoXCJdXG5cdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdGFTZW1hbnRpY09iamVjdE1hcHBpbmcucHVzaChvU2VtYW50aWNNYXBwaW5nKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhU2VtYW50aWNPYmplY3RNYXBwaW5nLnB1c2gob1NlbWFudGljTWFwcGluZyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGFTZW1hbnRpY09iamVjdE1hcHBpbmc7XG59XG5cbmZ1bmN0aW9uIGdldEhlYWRlckZhY2V0SXRlbUNvbmZpZ0ZvckV4dGVybmFsTmF2aWdhdGlvbihvVmlld0RhdGE6IGFueSwgb0Nyb3NzTmF2OiBhbnkpIHtcblx0Y29uc3Qgb0hlYWRlckZhY2V0SXRlbXM6IGFueSA9IHt9O1xuXHRsZXQgc0lkO1xuXHRjb25zdCBvQ29udHJvbENvbmZpZyA9IG9WaWV3RGF0YS5jb250cm9sQ29uZmlndXJhdGlvbjtcblx0Zm9yIChjb25zdCBjb25maWcgaW4gb0NvbnRyb2xDb25maWcpIHtcblx0XHRpZiAoY29uZmlnLmluZGV4T2YoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50XCIpID4gLTEgfHwgY29uZmlnLmluZGV4T2YoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIikgPiAtMSkge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRvQ29udHJvbENvbmZpZ1tjb25maWddLm5hdmlnYXRpb24gJiZcblx0XHRcdFx0b0NvbnRyb2xDb25maWdbY29uZmlnXS5uYXZpZ2F0aW9uLnRhcmdldE91dGJvdW5kICYmXG5cdFx0XHRcdG9Db250cm9sQ29uZmlnW2NvbmZpZ10ubmF2aWdhdGlvbi50YXJnZXRPdXRib3VuZC5vdXRib3VuZFxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IHNPdXRib3VuZCA9IG9Db250cm9sQ29uZmlnW2NvbmZpZ10ubmF2aWdhdGlvbi50YXJnZXRPdXRib3VuZC5vdXRib3VuZDtcblx0XHRcdFx0Y29uc3Qgb091dGJvdW5kID0gb0Nyb3NzTmF2W3NPdXRib3VuZF07XG5cdFx0XHRcdGlmIChvT3V0Ym91bmQuc2VtYW50aWNPYmplY3QgJiYgb091dGJvdW5kLmFjdGlvbikge1xuXHRcdFx0XHRcdGlmIChjb25maWcuaW5kZXhPZihcIkNoYXJ0XCIpID4gLTEpIHtcblx0XHRcdFx0XHRcdHNJZCA9IGdlbmVyYXRlKFtcImZlXCIsIFwiTWljcm9DaGFydExpbmtcIiwgY29uZmlnXSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNJZCA9IGdlbmVyYXRlKFtcImZlXCIsIFwiSGVhZGVyRFBMaW5rXCIsIGNvbmZpZ10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RNYXBwaW5nID0gQ29tbW9uVXRpbHMuZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nKG9PdXRib3VuZCk7XG5cdFx0XHRcdFx0b0hlYWRlckZhY2V0SXRlbXNbc0lkXSA9IHtcblx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBvT3V0Ym91bmQuc2VtYW50aWNPYmplY3QsXG5cdFx0XHRcdFx0XHRhY3Rpb246IG9PdXRib3VuZC5hY3Rpb24sXG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdE1hcHBpbmc6IGFTZW1hbnRpY09iamVjdE1hcHBpbmdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdExvZy5lcnJvcihgQ3Jvc3MgbmF2aWdhdGlvbiBvdXRib3VuZCBpcyBjb25maWd1cmVkIHdpdGhvdXQgc2VtYW50aWMgb2JqZWN0IGFuZCBhY3Rpb24gZm9yICR7c091dGJvdW5kfWApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvSGVhZGVyRmFjZXRJdGVtcztcbn1cblxuZnVuY3Rpb24gc2V0U2VtYW50aWNPYmplY3RNYXBwaW5ncyhvU2VsZWN0aW9uVmFyaWFudDogYW55LCB2TWFwcGluZ3M6IG9iamVjdCkge1xuXHRjb25zdCBvTWFwcGluZ3MgPSB0eXBlb2Ygdk1hcHBpbmdzID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZSh2TWFwcGluZ3MpIDogdk1hcHBpbmdzO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9NYXBwaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHNMb2NhbFByb3BlcnR5ID1cblx0XHRcdChvTWFwcGluZ3NbaV1bXCJMb2NhbFByb3BlcnR5XCJdICYmIG9NYXBwaW5nc1tpXVtcIkxvY2FsUHJvcGVydHlcIl1bXCIkUHJvcGVydHlQYXRoXCJdKSB8fFxuXHRcdFx0KG9NYXBwaW5nc1tpXVtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTG9jYWxQcm9wZXJ0eVwiXSAmJlxuXHRcdFx0XHRvTWFwcGluZ3NbaV1bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkxvY2FsUHJvcGVydHlcIl1bXCIkUGF0aFwiXSk7XG5cdFx0Y29uc3Qgc1NlbWFudGljT2JqZWN0UHJvcGVydHkgPVxuXHRcdFx0b01hcHBpbmdzW2ldW1wiU2VtYW50aWNPYmplY3RQcm9wZXJ0eVwiXSB8fCBvTWFwcGluZ3NbaV1bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlbWFudGljT2JqZWN0UHJvcGVydHlcIl07XG5cdFx0aWYgKG9TZWxlY3Rpb25WYXJpYW50LmdldFNlbGVjdE9wdGlvbihzTG9jYWxQcm9wZXJ0eSkpIHtcblx0XHRcdGNvbnN0IG9TZWxlY3RPcHRpb24gPSBvU2VsZWN0aW9uVmFyaWFudC5nZXRTZWxlY3RPcHRpb24oc0xvY2FsUHJvcGVydHkpO1xuXG5cdFx0XHQvL0NyZWF0ZSBhIG5ldyBTZWxlY3RPcHRpb24gd2l0aCBzU2VtYW50aWNPYmplY3RQcm9wZXJ0eSBhcyB0aGUgcHJvcGVydHkgTmFtZSBhbmQgcmVtb3ZlIHRoZSBvbGRlciBvbmVcblx0XHRcdG9TZWxlY3Rpb25WYXJpYW50LnJlbW92ZVNlbGVjdE9wdGlvbihzTG9jYWxQcm9wZXJ0eSk7XG5cdFx0XHRvU2VsZWN0aW9uVmFyaWFudC5tYXNzQWRkU2VsZWN0T3B0aW9uKHNTZW1hbnRpY09iamVjdFByb3BlcnR5LCBvU2VsZWN0T3B0aW9uKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9TZWxlY3Rpb25WYXJpYW50O1xufVxuXG5mdW5jdGlvbiBmbkdldFNlbWFudGljT2JqZWN0c0Zyb21QYXRoKG9NZXRhTW9kZWw6IGFueSwgc1BhdGg6IHN0cmluZywgc1F1YWxpZmllcjogc3RyaW5nKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcblx0XHRsZXQgc1NlbWFudGljT2JqZWN0LCBhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnM7XG5cdFx0aWYgKHNRdWFsaWZpZXIgPT09IFwiXCIpIHtcblx0XHRcdHNTZW1hbnRpY09iamVjdCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXRofUAke0NvbW1vbkFubm90YXRpb25UZXJtcy5TZW1hbnRpY09iamVjdH1gKTtcblx0XHRcdGFTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXRofUAke0NvbW1vbkFubm90YXRpb25UZXJtcy5TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uc31gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c1NlbWFudGljT2JqZWN0ID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c1BhdGh9QCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0fSMke3NRdWFsaWZpZXJ9YCk7XG5cdFx0XHRhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcblx0XHRcdFx0YCR7c1BhdGh9QCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zfSMke3NRdWFsaWZpZXJ9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RGb3JHZXRMaW5rcyA9IFt7IHNlbWFudGljT2JqZWN0OiBzU2VtYW50aWNPYmplY3QgfV07XG5cdFx0Y29uc3Qgb1NlbWFudGljT2JqZWN0ID0ge1xuXHRcdFx0c2VtYW50aWNPYmplY3Q6IHNTZW1hbnRpY09iamVjdFxuXHRcdH07XG5cdFx0cmVzb2x2ZSh7XG5cdFx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNQYXRoLFxuXHRcdFx0c2VtYW50aWNPYmplY3RGb3JHZXRMaW5rczogYVNlbWFudGljT2JqZWN0Rm9yR2V0TGlua3MsXG5cdFx0XHRzZW1hbnRpY09iamVjdDogb1NlbWFudGljT2JqZWN0LFxuXHRcdFx0dW5hdmFpbGFibGVBY3Rpb25zOiBhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnNcblx0XHR9KTtcblx0fSkuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0TG9nLmVycm9yKFwiRXJyb3IgaW4gZm5HZXRTZW1hbnRpY09iamVjdHNGcm9tUGF0aFwiLCBvRXJyb3IpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZm5VcGRhdGVTZW1hbnRpY1RhcmdldHNNb2RlbChhR2V0TGlua3NQcm9taXNlczogYW55LCBhU2VtYW50aWNPYmplY3RzOiBhbnksIG9JbnRlcm5hbE1vZGVsQ29udGV4dDogYW55LCBzQ3VycmVudEhhc2g6IGFueSkge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoYUdldExpbmtzUHJvbWlzZXMpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKGFWYWx1ZXM6IGFueVtdKSB7XG5cdFx0XHRsZXQgYUxpbmtzLFxuXHRcdFx0XHRfb0xpbmssXG5cdFx0XHRcdF9zTGlua0ludGVudEFjdGlvbixcblx0XHRcdFx0YUZpbmFsTGlua3M6IGFueVtdID0gW107XG5cdFx0XHRsZXQgb0ZpbmFsU2VtYW50aWNPYmplY3RzOiBhbnkgPSB7fTtcblx0XHRcdGNvbnN0IGJJbnRlbnRIYXNBY3Rpb25zID0gZnVuY3Rpb24gKHNJbnRlbnQ6IGFueSwgYUFjdGlvbnM6IGFueSkge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGludGVudCBpbiBhQWN0aW9ucykge1xuXHRcdFx0XHRcdGlmIChpbnRlbnQgPT09IHNJbnRlbnQpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGFWYWx1ZXMubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0YUxpbmtzID0gYVZhbHVlc1trXTtcblx0XHRcdFx0aWYgKGFMaW5rcyAmJiBhTGlua3MubGVuZ3RoID4gMCAmJiBhTGlua3NbMF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGNvbnN0IG9TZW1hbnRpY09iamVjdDogYW55ID0ge307XG5cdFx0XHRcdFx0bGV0IG9UbXAgPSB7fTtcblx0XHRcdFx0XHRsZXQgc0FsdGVybmF0ZVBhdGg7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhTGlua3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGFGaW5hbExpbmtzLnB1c2goW10pO1xuXHRcdFx0XHRcdFx0bGV0IGhhc1RhcmdldHNOb3RGaWx0ZXJlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0bGV0IGhhc1RhcmdldHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGlMaW5rQ291bnQgPSAwOyBpTGlua0NvdW50IDwgYUxpbmtzW2ldWzBdLmxlbmd0aDsgaUxpbmtDb3VudCsrKSB7XG5cdFx0XHRcdFx0XHRcdF9vTGluayA9IGFMaW5rc1tpXVswXVtpTGlua0NvdW50XTtcblx0XHRcdFx0XHRcdFx0X3NMaW5rSW50ZW50QWN0aW9uID0gX29MaW5rICYmIF9vTGluay5pbnRlbnQuc3BsaXQoXCI/XCIpWzBdLnNwbGl0KFwiLVwiKVsxXTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIShfb0xpbmsgJiYgX29MaW5rLmludGVudCAmJiBfb0xpbmsuaW50ZW50LmluZGV4T2Yoc0N1cnJlbnRIYXNoKSA9PT0gMCkpIHtcblx0XHRcdFx0XHRcdFx0XHRoYXNUYXJnZXRzTm90RmlsdGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghYkludGVudEhhc0FjdGlvbnMoX3NMaW5rSW50ZW50QWN0aW9uLCBhU2VtYW50aWNPYmplY3RzW2tdLnVuYXZhaWxhYmxlQWN0aW9ucykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFGaW5hbExpbmtzW2ldLnB1c2goX29MaW5rKTtcblx0XHRcdFx0XHRcdFx0XHRcdGhhc1RhcmdldHMgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0b1RtcCA9IHtcblx0XHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IGFTZW1hbnRpY09iamVjdHNba10uc2VtYW50aWNPYmplY3QsXG5cdFx0XHRcdFx0XHRcdHBhdGg6IGFTZW1hbnRpY09iamVjdHNba10ucGF0aCxcblx0XHRcdFx0XHRcdFx0SGFzVGFyZ2V0czogaGFzVGFyZ2V0cyxcblx0XHRcdFx0XHRcdFx0SGFzVGFyZ2V0c05vdEZpbHRlcmVkOiBoYXNUYXJnZXRzTm90RmlsdGVyZWRcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRpZiAob1NlbWFudGljT2JqZWN0W2FTZW1hbnRpY09iamVjdHNba10uc2VtYW50aWNPYmplY3RdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0b1NlbWFudGljT2JqZWN0W2FTZW1hbnRpY09iamVjdHNba10uc2VtYW50aWNPYmplY3RdID0ge307XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzQWx0ZXJuYXRlUGF0aCA9IGFTZW1hbnRpY09iamVjdHNba10ucGF0aC5yZXBsYWNlKC9cXC8vZywgXCJfXCIpO1xuXHRcdFx0XHRcdFx0aWYgKG9TZW1hbnRpY09iamVjdFthU2VtYW50aWNPYmplY3RzW2tdLnNlbWFudGljT2JqZWN0XVtzQWx0ZXJuYXRlUGF0aF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRvU2VtYW50aWNPYmplY3RbYVNlbWFudGljT2JqZWN0c1trXS5zZW1hbnRpY09iamVjdF1bc0FsdGVybmF0ZVBhdGhdID0ge307XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvU2VtYW50aWNPYmplY3RbYVNlbWFudGljT2JqZWN0c1trXS5zZW1hbnRpY09iamVjdF1bc0FsdGVybmF0ZVBhdGhdID0gT2JqZWN0LmFzc2lnbihcblx0XHRcdFx0XHRcdFx0b1NlbWFudGljT2JqZWN0W2FTZW1hbnRpY09iamVjdHNba10uc2VtYW50aWNPYmplY3RdW3NBbHRlcm5hdGVQYXRoXSxcblx0XHRcdFx0XHRcdFx0b1RtcFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3Qgc1NlbWFudGljT2JqZWN0TmFtZSA9IE9iamVjdC5rZXlzKG9TZW1hbnRpY09iamVjdClbMF07XG5cdFx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKG9GaW5hbFNlbWFudGljT2JqZWN0cykuaW5jbHVkZXMoc1NlbWFudGljT2JqZWN0TmFtZSkpIHtcblx0XHRcdFx0XHRcdG9GaW5hbFNlbWFudGljT2JqZWN0c1tzU2VtYW50aWNPYmplY3ROYW1lXSA9IE9iamVjdC5hc3NpZ24oXG5cdFx0XHRcdFx0XHRcdG9GaW5hbFNlbWFudGljT2JqZWN0c1tzU2VtYW50aWNPYmplY3ROYW1lXSxcblx0XHRcdFx0XHRcdFx0b1NlbWFudGljT2JqZWN0W3NTZW1hbnRpY09iamVjdE5hbWVdXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvRmluYWxTZW1hbnRpY09iamVjdHMgPSBPYmplY3QuYXNzaWduKG9GaW5hbFNlbWFudGljT2JqZWN0cywgb1NlbWFudGljT2JqZWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YUZpbmFsTGlua3MgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKE9iamVjdC5rZXlzKG9GaW5hbFNlbWFudGljT2JqZWN0cykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoXG5cdFx0XHRcdFx0XCJzZW1hbnRpY3NUYXJnZXRzXCIsXG5cdFx0XHRcdFx0bWVyZ2VPYmplY3RzKG9GaW5hbFNlbWFudGljT2JqZWN0cywgb0ludGVybmFsTW9kZWxDb250ZXh0LmdldFByb3BlcnR5KFwic2VtYW50aWNzVGFyZ2V0c1wiKSlcblx0XHRcdFx0KTtcblx0XHRcdFx0cmV0dXJuIG9GaW5hbFNlbWFudGljT2JqZWN0cztcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdExvZy5lcnJvcihcImZuVXBkYXRlU2VtYW50aWNUYXJnZXRzTW9kZWw6IENhbm5vdCByZWFkIGxpbmtzXCIsIG9FcnJvcik7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGZuR2V0U2VtYW50aWNPYmplY3RQcm9taXNlKG9BcHBDb21wb25lbnQ6IGFueSwgb1ZpZXc6IGFueSwgb01ldGFNb2RlbDogYW55LCBzUGF0aDogc3RyaW5nLCBzUXVhbGlmaWVyOiBzdHJpbmcpIHtcblx0cmV0dXJuIENvbW1vblV0aWxzLmdldFNlbWFudGljT2JqZWN0c0Zyb21QYXRoKG9NZXRhTW9kZWwsIHNQYXRoLCBzUXVhbGlmaWVyKTtcbn1cblxuZnVuY3Rpb24gZm5QcmVwYXJlU2VtYW50aWNPYmplY3RzUHJvbWlzZXMoXG5cdF9vQXBwQ29tcG9uZW50OiBhbnksXG5cdF9vVmlldzogYW55LFxuXHRfb01ldGFNb2RlbDogYW55LFxuXHRfYVNlbWFudGljT2JqZWN0c0ZvdW5kOiBzdHJpbmdbXSxcblx0X2FTZW1hbnRpY09iamVjdHNQcm9taXNlczogUHJvbWlzZTxhbnk+W11cbikge1xuXHRsZXQgX0tleXM6IHN0cmluZ1tdLCBzUGF0aDtcblx0bGV0IHNRdWFsaWZpZXI6IHN0cmluZywgcmVnZXhSZXN1bHQ7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgX2FTZW1hbnRpY09iamVjdHNGb3VuZC5sZW5ndGg7IGkrKykge1xuXHRcdHNQYXRoID0gX2FTZW1hbnRpY09iamVjdHNGb3VuZFtpXTtcblx0XHRfS2V5cyA9IE9iamVjdC5rZXlzKF9vTWV0YU1vZGVsLmdldE9iamVjdChzUGF0aCArIFwiQFwiKSk7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IF9LZXlzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRfS2V5c1tpbmRleF0uaW5kZXhPZihgQCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0fWApID09PSAwICYmXG5cdFx0XHRcdF9LZXlzW2luZGV4XS5pbmRleE9mKGBAJHtDb21tb25Bbm5vdGF0aW9uVGVybXMuU2VtYW50aWNPYmplY3RNYXBwaW5nfWApID09PSAtMSAmJlxuXHRcdFx0XHRfS2V5c1tpbmRleF0uaW5kZXhPZihgQCR7Q29tbW9uQW5ub3RhdGlvblRlcm1zLlNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zfWApID09PSAtMVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJlZ2V4UmVzdWx0ID0gLyMoLiopLy5leGVjKF9LZXlzW2luZGV4XSk7XG5cdFx0XHRcdHNRdWFsaWZpZXIgPSByZWdleFJlc3VsdCA/IHJlZ2V4UmVzdWx0WzFdIDogXCJcIjtcblx0XHRcdFx0X2FTZW1hbnRpY09iamVjdHNQcm9taXNlcy5wdXNoKFxuXHRcdFx0XHRcdENvbW1vblV0aWxzLmdldFNlbWFudGljT2JqZWN0UHJvbWlzZShfb0FwcENvbXBvbmVudCwgX29WaWV3LCBfb01ldGFNb2RlbCwgc1BhdGgsIHNRdWFsaWZpZXIpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGZuR2V0U2VtYW50aWNUYXJnZXRzRnJvbVBhZ2VNb2RlbChvQ29udHJvbGxlcjogYW55LCBzUGFnZU1vZGVsOiBzdHJpbmcpIHtcblx0Y29uc3QgX2ZuZmluZFZhbHVlc0hlbHBlciA9IGZ1bmN0aW9uIChvYmo6IGFueSwga2V5OiBhbnksIGxpc3Q6IGFueSkge1xuXHRcdGlmICghb2JqKSB7XG5cdFx0XHRyZXR1cm4gbGlzdDtcblx0XHR9XG5cdFx0aWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG5cdFx0XHRcdGxpc3QgPSBsaXN0LmNvbmNhdChfZm5maW5kVmFsdWVzSGVscGVyKG9ialtpXSwga2V5LCBbXSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0fVxuXHRcdGlmIChvYmpba2V5XSkge1xuXHRcdFx0bGlzdC5wdXNoKG9ialtrZXldKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiICYmIG9iaiAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgY2hpbGRyZW4gPSBPYmplY3Qua2V5cyhvYmopO1xuXHRcdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxpc3QgPSBsaXN0LmNvbmNhdChfZm5maW5kVmFsdWVzSGVscGVyKG9ialtjaGlsZHJlbltpXV0sIGtleSwgW10pKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbGlzdDtcblx0fTtcblx0Y29uc3QgX2ZuZmluZFZhbHVlcyA9IGZ1bmN0aW9uIChvYmo6IGFueSwga2V5OiBhbnkpIHtcblx0XHRyZXR1cm4gX2ZuZmluZFZhbHVlc0hlbHBlcihvYmosIGtleSwgW10pO1xuXHR9O1xuXHRjb25zdCBfZm5EZWxldGVEdXBsaWNhdGVTZW1hbnRpY09iamVjdHMgPSBmdW5jdGlvbiAoYVNlbWFudGljT2JqZWN0UGF0aDogYW55KSB7XG5cdFx0cmV0dXJuIGFTZW1hbnRpY09iamVjdFBhdGguZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZTogYW55LCBpbmRleDogYW55KSB7XG5cdFx0XHRyZXR1cm4gYVNlbWFudGljT2JqZWN0UGF0aC5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG5cdFx0fSk7XG5cdH07XG5cdGNvbnN0IG9WaWV3ID0gb0NvbnRyb2xsZXIuZ2V0VmlldygpO1xuXHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpO1xuXG5cdGlmIChvSW50ZXJuYWxNb2RlbENvbnRleHQpIHtcblx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzUHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG5cdFx0Y29uc3Qgb0NvbXBvbmVudCA9IG9Db250cm9sbGVyLmdldE93bmVyQ29tcG9uZW50KCk7XG5cdFx0Y29uc3Qgb0FwcENvbXBvbmVudCA9IENvbXBvbmVudC5nZXRPd25lckNvbXBvbmVudEZvcihvQ29tcG9uZW50KSBhcyBBcHBDb21wb25lbnQ7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9BcHBDb21wb25lbnQuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0bGV0IG9QYWdlTW9kZWwgPSBvQ29tcG9uZW50LmdldE1vZGVsKHNQYWdlTW9kZWwpLmdldERhdGEoKTtcblx0XHRpZiAoSlNPTi5zdHJpbmdpZnkob1BhZ2VNb2RlbCkgPT09IFwie31cIikge1xuXHRcdFx0b1BhZ2VNb2RlbCA9IG9Db21wb25lbnQuZ2V0TW9kZWwoc1BhZ2VNb2RlbCkuX2dldE9iamVjdChcIi9cIiwgdW5kZWZpbmVkKTtcblx0XHR9XG5cdFx0bGV0IGFTZW1hbnRpY09iamVjdHNGb3VuZCA9IF9mbmZpbmRWYWx1ZXMob1BhZ2VNb2RlbCwgXCJzZW1hbnRpY09iamVjdFBhdGhcIik7XG5cdFx0YVNlbWFudGljT2JqZWN0c0ZvdW5kID0gX2ZuRGVsZXRlRHVwbGljYXRlU2VtYW50aWNPYmplY3RzKGFTZW1hbnRpY09iamVjdHNGb3VuZCk7XG5cdFx0Y29uc3Qgb1NoZWxsU2VydmljZUhlbHBlciA9IENvbW1vblV0aWxzLmdldFNoZWxsU2VydmljZXMob0FwcENvbXBvbmVudCk7XG5cdFx0bGV0IHNDdXJyZW50SGFzaCA9IENvbW1vblV0aWxzLmdldEhhc2goKTtcblx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzRm9yR2V0TGlua3MgPSBbXTtcblx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzOiBhbnlbXSA9IFtdO1xuXHRcdGxldCBfb1NlbWFudGljT2JqZWN0O1xuXG5cdFx0aWYgKHNDdXJyZW50SGFzaCAmJiBzQ3VycmVudEhhc2guaW5kZXhPZihcIj9cIikgIT09IC0xKSB7XG5cdFx0XHQvLyBzQ3VycmVudEhhc2ggY2FuIGNvbnRhaW4gcXVlcnkgc3RyaW5nLCBjdXQgaXQgb2ZmIVxuXHRcdFx0c0N1cnJlbnRIYXNoID0gc0N1cnJlbnRIYXNoLnNwbGl0KFwiP1wiKVswXTtcblx0XHR9XG5cblx0XHRmblByZXBhcmVTZW1hbnRpY09iamVjdHNQcm9taXNlcyhvQXBwQ29tcG9uZW50LCBvVmlldywgb01ldGFNb2RlbCwgYVNlbWFudGljT2JqZWN0c0ZvdW5kLCBhU2VtYW50aWNPYmplY3RzUHJvbWlzZXMpO1xuXG5cdFx0aWYgKGFTZW1hbnRpY09iamVjdHNQcm9taXNlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0UHJvbWlzZS5hbGwoYVNlbWFudGljT2JqZWN0c1Byb21pc2VzKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYVZhbHVlczogYW55W10pIHtcblx0XHRcdFx0XHRjb25zdCBhR2V0TGlua3NQcm9taXNlcyA9IFtdO1xuXHRcdFx0XHRcdGxldCBzU2VtT2JqRXhwcmVzc2lvbjtcblx0XHRcdFx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgPSBhVmFsdWVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudDogYW55KSB7XG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuc2VtYW50aWNPYmplY3QgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnNlbWFudGljT2JqZWN0LnNlbWFudGljT2JqZWN0ICYmXG5cdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtZW50LnNlbWFudGljT2JqZWN0LnNlbWFudGljT2JqZWN0ID09PSBcIm9iamVjdFwiXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0c1NlbU9iakV4cHJlc3Npb24gPSBjb21waWxlRXhwcmVzc2lvbihwYXRoSW5Nb2RlbChlbGVtZW50LnNlbWFudGljT2JqZWN0LnNlbWFudGljT2JqZWN0LiRQYXRoKSk7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuc2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3QgPSBzU2VtT2JqRXhwcmVzc2lvbjtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5zZW1hbnRpY09iamVjdEZvckdldExpbmtzWzBdLnNlbWFudGljT2JqZWN0ID0gc1NlbU9iakV4cHJlc3Npb247XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBlbGVtZW50LnNlbWFudGljT2JqZWN0ICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBhU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdF9vU2VtYW50aWNPYmplY3QgPSBhU2VtYW50aWNPYmplY3RzUmVzb2x2ZWRbal07XG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdF9vU2VtYW50aWNPYmplY3QgJiZcblx0XHRcdFx0XHRcdFx0X29TZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdCAmJlxuXHRcdFx0XHRcdFx0XHQhKF9vU2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3Quc2VtYW50aWNPYmplY3QuaW5kZXhPZihcIntcIikgPT09IDApXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0YVNlbWFudGljT2JqZWN0c0ZvckdldExpbmtzLnB1c2goX29TZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdEZvckdldExpbmtzKTtcblx0XHRcdFx0XHRcdFx0YVNlbWFudGljT2JqZWN0cy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogX29TZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdCxcblx0XHRcdFx0XHRcdFx0XHR1bmF2YWlsYWJsZUFjdGlvbnM6IF9vU2VtYW50aWNPYmplY3QudW5hdmFpbGFibGVBY3Rpb25zLFxuXHRcdFx0XHRcdFx0XHRcdHBhdGg6IGFTZW1hbnRpY09iamVjdHNSZXNvbHZlZFtqXS5zZW1hbnRpY09iamVjdFBhdGhcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGFHZXRMaW5rc1Byb21pc2VzLnB1c2gob1NoZWxsU2VydmljZUhlbHBlci5nZXRMaW5rc1dpdGhDYWNoZShbX29TZW1hbnRpY09iamVjdC5zZW1hbnRpY09iamVjdEZvckdldExpbmtzXSkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gQ29tbW9uVXRpbHMudXBkYXRlU2VtYW50aWNUYXJnZXRzKGFHZXRMaW5rc1Byb21pc2VzLCBhU2VtYW50aWNPYmplY3RzLCBvSW50ZXJuYWxNb2RlbENvbnRleHQsIHNDdXJyZW50SGFzaCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJmbkdldFNlbWFudGljVGFyZ2V0c0Zyb21UYWJsZTogQ2Fubm90IGdldCBTZW1hbnRpYyBPYmplY3RzXCIsIG9FcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uOiBhbnksIHNSZXN0cmljdGlvbjogYW55KSB7XG5cdGNvbnN0IEZpbHRlclJlc3RyaWN0aW9ucyA9IENvbW1vblV0aWxzLkZpbHRlclJlc3RyaWN0aW9ucztcblx0aWYgKHNSZXN0cmljdGlvbiA9PT0gRmlsdGVyUmVzdHJpY3Rpb25zLlJFUVVJUkVEX1BST1BFUlRJRVMgfHwgc1Jlc3RyaWN0aW9uID09PSBGaWx0ZXJSZXN0cmljdGlvbnMuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFUykge1xuXHRcdGxldCBhUHJvcHMgPSBbXTtcblx0XHRpZiAob0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24gJiYgb0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb25bc1Jlc3RyaWN0aW9uXSkge1xuXHRcdFx0YVByb3BzID0gb0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb25bc1Jlc3RyaWN0aW9uXS5tYXAoZnVuY3Rpb24gKG9Qcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBvUHJvcGVydHkuJFByb3BlcnR5UGF0aDtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gYVByb3BzO1xuXHR9IGVsc2UgaWYgKHNSZXN0cmljdGlvbiA9PT0gRmlsdGVyUmVzdHJpY3Rpb25zLkFMTE9XRURfRVhQUkVTU0lPTlMpIHtcblx0XHRjb25zdCBtQWxsb3dlZEV4cHJlc3Npb25zOiBhbnkgPSB7fTtcblx0XHRpZiAob0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24gJiYgb0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucykge1xuXHRcdFx0b0ZpbHRlclJlc3RyaWN0aW9uc0Fubm90YXRpb24uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChvUHJvcGVydHk6IGFueSkge1xuXHRcdFx0XHQvL1NpbmdsZVZhbHVlIHwgTXVsdGlWYWx1ZSB8IFNpbmdsZVJhbmdlIHwgTXVsdGlSYW5nZSB8IFNlYXJjaEV4cHJlc3Npb24gfCBNdWx0aVJhbmdlT3JTZWFyY2hFeHByZXNzaW9uXG5cdFx0XHRcdGlmIChtQWxsb3dlZEV4cHJlc3Npb25zW29Qcm9wZXJ0eS5Qcm9wZXJ0eS4kUHJvcGVydHlQYXRoXSkge1xuXHRcdFx0XHRcdG1BbGxvd2VkRXhwcmVzc2lvbnNbb1Byb3BlcnR5LlByb3BlcnR5LiRQcm9wZXJ0eVBhdGhdLnB1c2gob1Byb3BlcnR5LkFsbG93ZWRFeHByZXNzaW9ucyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bUFsbG93ZWRFeHByZXNzaW9uc1tvUHJvcGVydHkuUHJvcGVydHkuJFByb3BlcnR5UGF0aF0gPSBbb1Byb3BlcnR5LkFsbG93ZWRFeHByZXNzaW9uc107XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gbUFsbG93ZWRFeHByZXNzaW9ucztcblx0fVxuXHQvLyBEZWZhdWx0IHJldHVybiB0aGUgRmlsdGVyUmVzdHJpY3Rpb25zIEFubm90YXRpb25cblx0cmV0dXJuIG9GaWx0ZXJSZXN0cmljdGlvbnNBbm5vdGF0aW9uO1xufVxuXG5mdW5jdGlvbiBfZmV0Y2hQcm9wZXJ0aWVzRm9yTmF2UGF0aChwYXRoczogc3RyaW5nW10sIG5hdlBhdGg6IHN0cmluZywgcHJvcHM6IHN0cmluZ1tdKSB7XG5cdGNvbnN0IG5hdlBhdGhQcmVmaXggPSBuYXZQYXRoICsgXCIvXCI7XG5cdHJldHVybiBwYXRocy5yZWR1Y2UoKG91dFBhdGhzOiBhbnksIHBhdGhUb0NoZWNrOiBzdHJpbmcpID0+IHtcblx0XHRpZiAocGF0aFRvQ2hlY2suc3RhcnRzV2l0aChuYXZQYXRoUHJlZml4KSkge1xuXHRcdFx0Y29uc3Qgb3V0UGF0aCA9IHBhdGhUb0NoZWNrLnJlcGxhY2UobmF2UGF0aFByZWZpeCwgXCJcIik7XG5cdFx0XHRpZiAob3V0UGF0aHMuaW5kZXhPZihvdXRQYXRoKSA9PT0gLTEpIHtcblx0XHRcdFx0b3V0UGF0aHMucHVzaChvdXRQYXRoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dFBhdGhzO1xuXHR9LCBwcm9wcyk7XG59XG5cbmZ1bmN0aW9uIGdldEZpbHRlclJlc3RyaWN0aW9uc0J5UGF0aChlbnRpdHlQYXRoOiBzdHJpbmcsIG9NZXRhTW9kZWw6IGFueSkge1xuXHRjb25zdCBvUmV0OiBhbnkgPSB7fSxcblx0XHRGUiA9IENvbW1vblV0aWxzLkZpbHRlclJlc3RyaWN0aW9ucztcblx0bGV0IG9GaWx0ZXJSZXN0cmljdGlvbnM7XG5cdGNvbnN0IG5hdmlnYXRpb25UZXh0ID0gXCIkTmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiO1xuXHRjb25zdCBmclRlcm0gPSBcIkBPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkZpbHRlclJlc3RyaWN0aW9uc1wiO1xuXHRjb25zdCBlbnRpdHlUeXBlUGF0aFBhcnRzID0gZW50aXR5UGF0aC5yZXBsYWNlQWxsKFwiJTJGXCIsIFwiL1wiKS5zcGxpdChcIi9cIikuZmlsdGVyKE1vZGVsSGVscGVyLmZpbHRlck91dE5hdlByb3BCaW5kaW5nKTtcblx0Y29uc3QgZW50aXR5VHlwZVBhdGggPSBgLyR7ZW50aXR5VHlwZVBhdGhQYXJ0cy5qb2luKFwiL1wiKX0vYDtcblx0Y29uc3QgZW50aXR5U2V0UGF0aCA9IE1vZGVsSGVscGVyLmdldEVudGl0eVNldFBhdGgoZW50aXR5UGF0aCwgb01ldGFNb2RlbCk7XG5cdGNvbnN0IGVudGl0eVNldFBhdGhQYXJ0cyA9IGVudGl0eVNldFBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihNb2RlbEhlbHBlci5maWx0ZXJPdXROYXZQcm9wQmluZGluZyk7XG5cdGNvbnN0IGlzQ29udGFpbm1lbnQgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtlbnRpdHlUeXBlUGF0aH0kQ29udGFpbnNUYXJnZXRgKTtcblx0Y29uc3QgY29udGFpbm1lbnROYXZQYXRoID0gaXNDb250YWlubWVudCAmJiBlbnRpdHlUeXBlUGF0aFBhcnRzW2VudGl0eVR5cGVQYXRoUGFydHMubGVuZ3RoIC0gMV07XG5cblx0Ly9MRUFTVCBQUklPUklUWSAtIEZpbHRlciByZXN0cmljdGlvbnMgZGlyZWN0bHkgYXQgRW50aXR5IFNldFxuXHQvL2UuZy4gRlIgaW4gXCJOUy5FbnRpdHlDb250YWluZXIvU2FsZXNPcmRlck1hbmFnZVwiIENvbnRleHRQYXRoOiAvU2FsZXNPcmRlck1hbmFnZVxuXHRpZiAoIWlzQ29udGFpbm1lbnQpIHtcblx0XHRvRmlsdGVyUmVzdHJpY3Rpb25zID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYCR7ZW50aXR5U2V0UGF0aH0ke2ZyVGVybX1gKTtcblx0XHRvUmV0W0ZSLlJFUVVJUkVEX1BST1BFUlRJRVNdID0gZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9GaWx0ZXJSZXN0cmljdGlvbnMsIEZSLlJFUVVJUkVEX1BST1BFUlRJRVMpIHx8IFtdO1xuXHRcdGNvbnN0IHJlc3VsdENvbnRleHRDaGVjayA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke2VudGl0eVR5cGVQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVzdWx0Q29udGV4dGApO1xuXHRcdGlmICghcmVzdWx0Q29udGV4dENoZWNrKSB7XG5cdFx0XHRvUmV0W0ZSLk5PTl9GSUxURVJBQkxFX1BST1BFUlRJRVNdID0gZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9GaWx0ZXJSZXN0cmljdGlvbnMsIEZSLk5PTl9GSUxURVJBQkxFX1BST1BFUlRJRVMpIHx8IFtdO1xuXHRcdH1cblx0XHQvL1NpbmdsZVZhbHVlIHwgTXVsdGlWYWx1ZSB8IFNpbmdsZVJhbmdlIHwgTXVsdGlSYW5nZSB8IFNlYXJjaEV4cHJlc3Npb24gfCBNdWx0aVJhbmdlT3JTZWFyY2hFeHByZXNzaW9uXG5cdFx0b1JldFtGUi5BTExPV0VEX0VYUFJFU1NJT05TXSA9IGdldEZpbHRlclJlc3RyaWN0aW9ucyhvRmlsdGVyUmVzdHJpY3Rpb25zLCBGUi5BTExPV0VEX0VYUFJFU1NJT05TKSB8fCB7fTtcblx0fVxuXG5cdGlmIChlbnRpdHlUeXBlUGF0aFBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRjb25zdCBuYXZQYXRoID0gaXNDb250YWlubWVudCA/IGNvbnRhaW5tZW50TmF2UGF0aCA6IGVudGl0eVNldFBhdGhQYXJ0c1tlbnRpdHlTZXRQYXRoUGFydHMubGVuZ3RoIC0gMV07XG5cdFx0Ly8gSW4gY2FzZSBvZiBjb250YWlubWVudCB3ZSB0YWtlIGVudGl0eVNldCBwcm92aWRlZCBhcyBwYXJlbnQuIEFuZCBpbiBjYXNlIG9mIG5vcm1hbCB3ZSB3b3VsZCByZW1vdmUgdGhlIGxhc3QgbmF2aWdhdGlvbiBmcm9tIGVudGl0eVNldFBhdGguXG5cdFx0Y29uc3QgcGFyZW50RW50aXR5U2V0UGF0aCA9IGlzQ29udGFpbm1lbnQgPyBlbnRpdHlTZXRQYXRoIDogYC8ke2VudGl0eVNldFBhdGhQYXJ0cy5zbGljZSgwLCAtMSkuam9pbihgLyR7bmF2aWdhdGlvblRleHR9L2ApfWA7XG5cdFx0Ly9USElSRCBISUdIRVNUIFBSSU9SSVRZIC0gUmVhZGluZyBwcm9wZXJ0eSBwYXRoIHJlc3RyaWN0aW9ucyAtIEFubm90YXRpb24gYXQgbWFpbiBlbnRpdHkgYnV0IGRpcmVjdGx5IG9uIG5hdmlnYXRpb24gcHJvcGVydHkgcGF0aFxuXHRcdC8vZS5nLiBQYXJlbnQgQ3VzdG9tZXIgd2l0aCBQcm9wZXJ0eVBhdGg9XCJTZXQvQ2l0eU5hbWVcIiBDb250ZXh0UGF0aDogQ3VzdG9tZXIvU2V0XG5cdFx0Y29uc3Qgb1BhcmVudFJldDogYW55ID0ge307XG5cdFx0aWYgKCFuYXZQYXRoLmluY2x1ZGVzKFwiJTJGXCIpKSB7XG5cdFx0XHRjb25zdCBvUGFyZW50RlIgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtwYXJlbnRFbnRpdHlTZXRQYXRofSR7ZnJUZXJtfWApO1xuXHRcdFx0b1JldFtGUi5SRVFVSVJFRF9QUk9QRVJUSUVTXSA9IF9mZXRjaFByb3BlcnRpZXNGb3JOYXZQYXRoKFxuXHRcdFx0XHRnZXRGaWx0ZXJSZXN0cmljdGlvbnMob1BhcmVudEZSLCBGUi5SRVFVSVJFRF9QUk9QRVJUSUVTKSB8fCBbXSxcblx0XHRcdFx0bmF2UGF0aCxcblx0XHRcdFx0b1JldFtGUi5SRVFVSVJFRF9QUk9QRVJUSUVTXSB8fCBbXVxuXHRcdFx0KTtcblx0XHRcdG9SZXRbRlIuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFU10gPSBfZmV0Y2hQcm9wZXJ0aWVzRm9yTmF2UGF0aChcblx0XHRcdFx0Z2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9QYXJlbnRGUiwgRlIuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFUykgfHwgW10sXG5cdFx0XHRcdG5hdlBhdGgsXG5cdFx0XHRcdG9SZXRbRlIuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFU10gfHwgW11cblx0XHRcdCk7XG5cdFx0XHQvL1NpbmdsZVZhbHVlIHwgTXVsdGlWYWx1ZSB8IFNpbmdsZVJhbmdlIHwgTXVsdGlSYW5nZSB8IFNlYXJjaEV4cHJlc3Npb24gfCBNdWx0aVJhbmdlT3JTZWFyY2hFeHByZXNzaW9uXG5cdFx0XHRjb25zdCBjb21wbGV0ZUFsbG93ZWRFeHBzID0gZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG9QYXJlbnRGUiwgRlIuQUxMT1dFRF9FWFBSRVNTSU9OUykgfHwge307XG5cdFx0XHRvUGFyZW50UmV0W0ZSLkFMTE9XRURfRVhQUkVTU0lPTlNdID0gT2JqZWN0LmtleXMoY29tcGxldGVBbGxvd2VkRXhwcykucmVkdWNlKChvdXRQcm9wOiBhbnksIHByb3BQYXRoOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKHByb3BQYXRoLnN0YXJ0c1dpdGgobmF2UGF0aCArIFwiL1wiKSkge1xuXHRcdFx0XHRcdGNvbnN0IG91dFByb3BQYXRoID0gcHJvcFBhdGgucmVwbGFjZShuYXZQYXRoICsgXCIvXCIsIFwiXCIpO1xuXHRcdFx0XHRcdG91dFByb3Bbb3V0UHJvcFBhdGhdID0gY29tcGxldGVBbGxvd2VkRXhwc1twcm9wUGF0aF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG91dFByb3A7XG5cdFx0XHR9LCB7fSBhcyBhbnkpO1xuXHRcdH1cblxuXHRcdC8vU2luZ2xlVmFsdWUgfCBNdWx0aVZhbHVlIHwgU2luZ2xlUmFuZ2UgfCBNdWx0aVJhbmdlIHwgU2VhcmNoRXhwcmVzc2lvbiB8IE11bHRpUmFuZ2VPclNlYXJjaEV4cHJlc3Npb25cblx0XHRvUmV0W0ZSLkFMTE9XRURfRVhQUkVTU0lPTlNdID0gbWVyZ2VPYmplY3RzKHt9LCBvUmV0W0ZSLkFMTE9XRURfRVhQUkVTU0lPTlNdLCBvUGFyZW50UmV0W0ZSLkFMTE9XRURfRVhQUkVTU0lPTlNdIHx8IHt9KTtcblxuXHRcdC8vU0VDT05EIEhJR0hFU1QgcHJpb3JpdHkgLSBOYXZpZ2F0aW9uIHJlc3RyaWN0aW9uc1xuXHRcdC8vZS5nLiBQYXJlbnQgXCIvQ3VzdG9tZXJcIiB3aXRoIE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg9XCJTZXRcIiBDb250ZXh0UGF0aDogQ3VzdG9tZXIvU2V0XG5cdFx0Y29uc3Qgb05hdlJlc3RyaWN0aW9ucyA9IENvbW1vblV0aWxzLmdldE5hdmlnYXRpb25SZXN0cmljdGlvbnMob01ldGFNb2RlbCwgcGFyZW50RW50aXR5U2V0UGF0aCwgbmF2UGF0aC5yZXBsYWNlQWxsKFwiJTJGXCIsIFwiL1wiKSk7XG5cdFx0Y29uc3Qgb05hdkZpbHRlclJlc3QgPSBvTmF2UmVzdHJpY3Rpb25zICYmIG9OYXZSZXN0cmljdGlvbnNbXCJGaWx0ZXJSZXN0cmljdGlvbnNcIl07XG5cdFx0Y29uc3QgbmF2UmVzUmVxUHJvcHMgPSBnZXRGaWx0ZXJSZXN0cmljdGlvbnMob05hdkZpbHRlclJlc3QsIEZSLlJFUVVJUkVEX1BST1BFUlRJRVMpIHx8IFtdO1xuXHRcdG9SZXRbRlIuUkVRVUlSRURfUFJPUEVSVElFU10gPSB1bmlxdWVTb3J0KG9SZXRbRlIuUkVRVUlSRURfUFJPUEVSVElFU10uY29uY2F0KG5hdlJlc1JlcVByb3BzKSk7XG5cdFx0Y29uc3QgbmF2Tm9uRmlsdGVyUHJvcHMgPSBnZXRGaWx0ZXJSZXN0cmljdGlvbnMob05hdkZpbHRlclJlc3QsIEZSLk5PTl9GSUxURVJBQkxFX1BST1BFUlRJRVMpIHx8IFtdO1xuXHRcdG9SZXRbRlIuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFU10gPSB1bmlxdWVTb3J0KG9SZXRbRlIuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFU10uY29uY2F0KG5hdk5vbkZpbHRlclByb3BzKSk7XG5cdFx0Ly9TaW5nbGVWYWx1ZSB8IE11bHRpVmFsdWUgfCBTaW5nbGVSYW5nZSB8IE11bHRpUmFuZ2UgfCBTZWFyY2hFeHByZXNzaW9uIHwgTXVsdGlSYW5nZU9yU2VhcmNoRXhwcmVzc2lvblxuXHRcdG9SZXRbRlIuQUxMT1dFRF9FWFBSRVNTSU9OU10gPSBtZXJnZU9iamVjdHMoXG5cdFx0XHR7fSxcblx0XHRcdG9SZXRbRlIuQUxMT1dFRF9FWFBSRVNTSU9OU10sXG5cdFx0XHRnZXRGaWx0ZXJSZXN0cmljdGlvbnMob05hdkZpbHRlclJlc3QsIEZSLkFMTE9XRURfRVhQUkVTU0lPTlMpIHx8IHt9XG5cdFx0KTtcblxuXHRcdC8vSElHSEVTVCBwcmlvcml0eSAtIFJlc3RyaWN0aW9ucyBoYXZpbmcgdGFyZ2V0IHdpdGggbmF2aWdhdGlvbiBhc3NvY2lhdGlvbiBlbnRpdHlcblx0XHQvLyBlLmcuIEZSIGluIFwiQ3VzdG9tZXJQYXJhbWV0ZXJzL1NldFwiIENvbnRleHRQYXRoOiBcIkN1c3RvbWVyL1NldFwiXG5cdFx0Y29uc3QgbmF2QXNzb2NpYXRpb25FbnRpdHlSZXN0ID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVQYXRoUGFydHMuam9pbihcIi9cIil9JHtmclRlcm19YCk7XG5cdFx0Y29uc3QgbmF2QXNzb2NSZXFQcm9wcyA9IGdldEZpbHRlclJlc3RyaWN0aW9ucyhuYXZBc3NvY2lhdGlvbkVudGl0eVJlc3QsIEZSLlJFUVVJUkVEX1BST1BFUlRJRVMpIHx8IFtdO1xuXHRcdG9SZXRbRlIuUkVRVUlSRURfUFJPUEVSVElFU10gPSB1bmlxdWVTb3J0KG9SZXRbRlIuUkVRVUlSRURfUFJPUEVSVElFU10uY29uY2F0KG5hdkFzc29jUmVxUHJvcHMpKTtcblx0XHRjb25zdCBuYXZBc3NvY05vbkZpbHRlclByb3BzID0gZ2V0RmlsdGVyUmVzdHJpY3Rpb25zKG5hdkFzc29jaWF0aW9uRW50aXR5UmVzdCwgRlIuTk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFUykgfHwgW107XG5cdFx0b1JldFtGUi5OT05fRklMVEVSQUJMRV9QUk9QRVJUSUVTXSA9IHVuaXF1ZVNvcnQob1JldFtGUi5OT05fRklMVEVSQUJMRV9QUk9QRVJUSUVTXS5jb25jYXQobmF2QXNzb2NOb25GaWx0ZXJQcm9wcykpO1xuXHRcdC8vU2luZ2xlVmFsdWUgfCBNdWx0aVZhbHVlIHwgU2luZ2xlUmFuZ2UgfCBNdWx0aVJhbmdlIHwgU2VhcmNoRXhwcmVzc2lvbiB8IE11bHRpUmFuZ2VPclNlYXJjaEV4cHJlc3Npb25cblx0XHRvUmV0W0ZSLkFMTE9XRURfRVhQUkVTU0lPTlNdID0gbWVyZ2VPYmplY3RzKFxuXHRcdFx0e30sXG5cdFx0XHRvUmV0W0ZSLkFMTE9XRURfRVhQUkVTU0lPTlNdLFxuXHRcdFx0Z2V0RmlsdGVyUmVzdHJpY3Rpb25zKG5hdkFzc29jaWF0aW9uRW50aXR5UmVzdCwgRlIuQUxMT1dFRF9FWFBSRVNTSU9OUykgfHwge31cblx0XHQpO1xuXHR9XG5cdHJldHVybiBvUmV0O1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZUNvbnRyb2xGcmFnbWVudChzRnJhZ21lbnROYW1lOiBhbnksIG9QcmVwcm9jZXNzb3JTZXR0aW5nczogYW55LCBvT3B0aW9uczogYW55LCBvTW9kaWZpZXI/OiBhbnkpIHtcblx0b09wdGlvbnMgPSBvT3B0aW9ucyB8fCB7fTtcblx0aWYgKG9Nb2RpZmllcikge1xuXHRcdHJldHVybiBvTW9kaWZpZXIudGVtcGxhdGVDb250cm9sRnJhZ21lbnQoc0ZyYWdtZW50TmFtZSwgb1ByZXByb2Nlc3NvclNldHRpbmdzLCBvT3B0aW9ucy52aWV3KS50aGVuKGZ1bmN0aW9uIChvRnJhZ21lbnQ6IGFueSkge1xuXHRcdFx0Ly8gVGhpcyBpcyByZXF1aXJlZCBhcyBGbGV4IHJldHVybnMgYW4gSFRNTENvbGxlY3Rpb24gYXMgdGVtcGxhdGluZyByZXN1bHQgaW4gWE1MIHRpbWUuXG5cdFx0XHRyZXR1cm4gb01vZGlmaWVyLnRhcmdldHMgPT09IFwieG1sVHJlZVwiICYmIG9GcmFnbWVudC5sZW5ndGggPiAwID8gb0ZyYWdtZW50WzBdIDogb0ZyYWdtZW50O1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBsb2FkTWFjcm9MaWJyYXJ5KClcblx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIFhNTFByZXByb2Nlc3Nvci5wcm9jZXNzKFxuXHRcdFx0XHRcdFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShzRnJhZ21lbnROYW1lLCBcImZyYWdtZW50XCIpLFxuXHRcdFx0XHRcdHsgbmFtZTogc0ZyYWdtZW50TmFtZSB9LFxuXHRcdFx0XHRcdG9QcmVwcm9jZXNzb3JTZXR0aW5nc1xuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChvRnJhZ21lbnQ6IGFueSkge1xuXHRcdFx0XHRjb25zdCBvQ29udHJvbCA9IG9GcmFnbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcblx0XHRcdFx0aWYgKCEhb09wdGlvbnMuaXNYTUwgJiYgb0NvbnRyb2wpIHtcblx0XHRcdFx0XHRyZXR1cm4gb0NvbnRyb2w7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIEZyYWdtZW50LmxvYWQoe1xuXHRcdFx0XHRcdGlkOiBvT3B0aW9ucy5pZCxcblx0XHRcdFx0XHRkZWZpbml0aW9uOiBvRnJhZ21lbnQsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogb09wdGlvbnMuY29udHJvbGxlclxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFNpbmdsZXRvblBhdGgocGF0aDogc3RyaW5nLCBtZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbiksXG5cdFx0cHJvcGVydHlOYW1lID0gcGFydHMucG9wKCksXG5cdFx0bmF2aWdhdGlvblBhdGggPSBwYXJ0cy5qb2luKFwiL1wiKSxcblx0XHRlbnRpdHlTZXQgPSBuYXZpZ2F0aW9uUGF0aCAmJiBtZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtuYXZpZ2F0aW9uUGF0aH1gKTtcblx0aWYgKGVudGl0eVNldD8uJGtpbmQgPT09IFwiU2luZ2xldG9uXCIpIHtcblx0XHRjb25zdCBzaW5nbGV0b25OYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG5cdFx0cmV0dXJuIGAvJHtzaW5nbGV0b25OYW1lfS8ke3Byb3BlcnR5TmFtZX1gO1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3RTaW5nbGV0b25Qcm9wZXJ0eShwYXRoOiBzdHJpbmcsIG1vZGVsOiBPRGF0YU1vZGVsKSB7XG5cdGlmICghcGF0aCB8fCAhbW9kZWwpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXHR9XG5cdGNvbnN0IG1ldGFNb2RlbCA9IG1vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHQvLyBGaW5kIHRoZSB1bmRlcmx5aW5nIGVudGl0eSBzZXQgZnJvbSB0aGUgcHJvcGVydHkgcGF0aCBhbmQgY2hlY2sgd2hldGhlciBpdCBpcyBhIHNpbmdsZXRvbi5cblx0Y29uc3QgcmVzb2x2ZWRQYXRoID0gZ2V0U2luZ2xldG9uUGF0aChwYXRoLCBtZXRhTW9kZWwpO1xuXHRpZiAocmVzb2x2ZWRQYXRoKSB7XG5cdFx0Y29uc3QgcHJvcGVydHlCaW5kaW5nID0gbW9kZWwuYmluZFByb3BlcnR5KHJlc29sdmVkUGF0aCk7XG5cdFx0cmV0dXJuIHByb3BlcnR5QmluZGluZy5yZXF1ZXN0VmFsdWUoKTtcblx0fVxuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50VG9CaW5kaW5nSW5mbyhvQ29udHJvbDogQ29udHJvbCwgc0V2ZW50TmFtZTogc3RyaW5nLCBmSGFuZGxlcjogRnVuY3Rpb24pIHtcblx0bGV0IG9CaW5kaW5nSW5mbzogYW55O1xuXHRjb25zdCBzZXRCaW5kaW5nSW5mbyA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAob0JpbmRpbmdJbmZvKSB7XG5cdFx0XHRpZiAoIW9CaW5kaW5nSW5mby5ldmVudHMpIHtcblx0XHRcdFx0b0JpbmRpbmdJbmZvLmV2ZW50cyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFvQmluZGluZ0luZm8uZXZlbnRzW3NFdmVudE5hbWVdKSB7XG5cdFx0XHRcdG9CaW5kaW5nSW5mby5ldmVudHNbc0V2ZW50TmFtZV0gPSBmSGFuZGxlcjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGZPcmlnaW5hbEhhbmRsZXIgPSBvQmluZGluZ0luZm8uZXZlbnRzW3NFdmVudE5hbWVdO1xuXHRcdFx0XHRvQmluZGluZ0luZm8uZXZlbnRzW3NFdmVudE5hbWVdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdFx0ZkhhbmRsZXIuYXBwbHkodGhpcywgLi4uYXJncyk7XG5cdFx0XHRcdFx0Zk9yaWdpbmFsSGFuZGxlci5hcHBseSh0aGlzLCAuLi5hcmdzKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdGlmIChvQ29udHJvbC5pc0EoXCJzYXAudWkubWRjLkNoYXJ0XCIpKSB7XG5cdFx0KG9Db250cm9sIGFzIGFueSlcblx0XHRcdC5pbm5lckNoYXJ0Qm91bmQoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRvQmluZGluZ0luZm8gPSAob0NvbnRyb2wgYXMgYW55KS5nZXRDb250cm9sRGVsZWdhdGUoKS5fZ2V0Q2hhcnQob0NvbnRyb2wpLmdldEJpbmRpbmdJbmZvKFwiZGF0YVwiKTtcblx0XHRcdFx0c2V0QmluZGluZ0luZm8oKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKHNFcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihzRXJyb3IpO1xuXHRcdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0b0JpbmRpbmdJbmZvID0gb0NvbnRyb2wuZGF0YShcInJvd3NCaW5kaW5nSW5mb1wiKTtcblx0XHRzZXRCaW5kaW5nSW5mbygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxvYWRNYWNyb0xpYnJhcnkoKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdHNhcC51aS5yZXF1aXJlKFtcInNhcC9mZS9tYWNyb3MvbWFjcm9MaWJyYXJ5XCJdLCBmdW5jdGlvbiAoLyptYWNyb0xpYnJhcnkqLykge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuLy8gR2V0IHRoZSBwYXRoIGZvciBhY3Rpb24gcGFyYW1ldGVycyB0aGF0IGlzIG5lZWRlZCB0byByZWFkIHRoZSBhbm5vdGF0aW9uc1xuZnVuY3Rpb24gZ2V0UGFyYW1ldGVyUGF0aChzUGF0aDogYW55LCBzUGFyYW1ldGVyOiBhbnkpIHtcblx0bGV0IHNDb250ZXh0O1xuXHRpZiAoc1BhdGguaW5kZXhPZihcIkAkdWk1Lm92ZXJsb2FkXCIpID4gLTEpIHtcblx0XHRzQ29udGV4dCA9IHNQYXRoLnNwbGl0KFwiQCR1aTUub3ZlcmxvYWRcIilbMF07XG5cdH0gZWxzZSB7XG5cdFx0Ly8gRm9yIFVuYm91bmQgQWN0aW9ucyBpbiBBY3Rpb24gUGFyYW1ldGVyIERpYWxvZ3Ncblx0XHRjb25zdCBhQWN0aW9uID0gc1BhdGguc3BsaXQoXCIvMFwiKVswXS5zcGxpdChcIi5cIik7XG5cdFx0c0NvbnRleHQgPSBgLyR7YUFjdGlvblthQWN0aW9uLmxlbmd0aCAtIDFdfS9gO1xuXHR9XG5cdHJldHVybiBzQ29udGV4dCArIHNQYXJhbWV0ZXI7XG59XG5cbi8qKlxuICogR2V0IHJlc29sdmVkIGV4cHJlc3Npb24gYmluZGluZyB1c2VkIGZvciB0ZXh0cyBhdCBydW50aW1lLlxuICpcbiAqIEBwYXJhbSBleHBCaW5kaW5nXG4gKiBAcGFyYW0gY29udHJvbFxuICogQGZ1bmN0aW9uXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUuQ29tbW9uVXRpbHNcbiAqIEByZXR1cm5zIEEgc3RyaW5nIGFmdGVyIHJlc29sdXRpb24uXG4gKiBAdWk1LXJlc3RyaWN0ZWRcbiAqL1xuZnVuY3Rpb24gX2ZudHJhbnNsYXRlZFRleHRGcm9tRXhwQmluZGluZ1N0cmluZyhleHBCaW5kaW5nOiBzdHJpbmcsIGNvbnRyb2w6IENvbnRyb2wpIHtcblx0Ly8gVGhlIGlkZWEgaGVyZSBpcyB0byBjcmVhdGUgZHVtbXkgZWxlbWVudCB3aXRoIHRoZSBleHByZXNpb24gYmluZGluZy5cblx0Ly8gQWRkaW5nIGl0IGFzIGRlcGVuZGVudCB0byB0aGUgdmlldy9jb250cm9sIHdvdWxkIHByb3BhZ2F0ZSBhbGwgdGhlIG1vZGVscyB0byB0aGUgZHVtbXkgZWxlbWVudCBhbmQgcmVzb2x2ZSB0aGUgYmluZGluZy5cblx0Ly8gV2UgcmVtb3ZlIHRoZSBkdW1teSBlbGVtZW50IGFmdGVyIHRoYXQgYW5kIGRlc3Ryb3kgaXQuXG5cblx0Y29uc3QgYW55UmVzb3VyY2VUZXh0ID0gbmV3IEFueUVsZW1lbnQoeyBhbnlUZXh0OiBleHBCaW5kaW5nIH0pO1xuXHRjb250cm9sLmFkZERlcGVuZGVudChhbnlSZXNvdXJjZVRleHQpO1xuXHRjb25zdCByZXN1bHRUZXh0ID0gYW55UmVzb3VyY2VUZXh0LmdldEFueVRleHQoKTtcblx0Y29udHJvbC5yZW1vdmVEZXBlbmRlbnQoYW55UmVzb3VyY2VUZXh0KTtcblx0YW55UmVzb3VyY2VUZXh0LmRlc3Ryb3koKTtcblxuXHRyZXR1cm4gcmVzdWx0VGV4dDtcbn1cblxuY29uc3QgQ29tbW9uVXRpbHMgPSB7XG5cdGlzUHJvcGVydHlGaWx0ZXJhYmxlOiBpc1Byb3BlcnR5RmlsdGVyYWJsZSxcblx0aXNGaWVsZENvbnRyb2xQYXRoSW5hcHBsaWNhYmxlOiBpc0ZpZWxkQ29udHJvbFBhdGhJbmFwcGxpY2FibGUsXG5cdHJlbW92ZVNlbnNpdGl2ZURhdGE6IHJlbW92ZVNlbnNpdGl2ZURhdGEsXG5cdGZpcmVCdXR0b25QcmVzczogZm5GaXJlQnV0dG9uUHJlc3MsXG5cdGdldFRhcmdldFZpZXc6IGdldFRhcmdldFZpZXcsXG5cdGdldEN1cnJlbnRQYWdlVmlldzogZ2V0Q3VycmVudFBhZ2VWaWV3LFxuXHRoYXNUcmFuc2llbnRDb250ZXh0OiBmbkhhc1RyYW5zaWVudENvbnRleHRzLFxuXHR1cGRhdGVSZWxhdGVkQXBwc0RldGFpbHM6IGZuVXBkYXRlUmVsYXRlZEFwcHNEZXRhaWxzLFxuXHRyZXNvbHZlU3RyaW5ndG9Cb29sZWFuOiBmblJlc29sdmVTdHJpbmd0b0Jvb2xlYW4sXG5cdGdldEFwcENvbXBvbmVudDogZ2V0QXBwQ29tcG9uZW50LFxuXHRnZXRNYW5kYXRvcnlGaWx0ZXJGaWVsZHM6IGZuR2V0TWFuZGF0b3J5RmlsdGVyRmllbGRzLFxuXHRnZXRDb250ZXh0UGF0aFByb3BlcnRpZXM6IGZuR2V0Q29udGV4dFBhdGhQcm9wZXJ0aWVzLFxuXHRnZXRQYXJhbWV0ZXJJbmZvOiBnZXRQYXJhbWV0ZXJJbmZvLFxuXHR1cGRhdGVEYXRhRmllbGRGb3JJQk5CdXR0b25zVmlzaWJpbGl0eTogZm5VcGRhdGVEYXRhRmllbGRGb3JJQk5CdXR0b25zVmlzaWJpbGl0eSxcblx0Z2V0VHJhbnNsYXRlZFRleHQ6IGdldFRyYW5zbGF0ZWRUZXh0LFxuXHRnZXRFbnRpdHlTZXROYW1lOiBnZXRFbnRpdHlTZXROYW1lLFxuXHRnZXRBY3Rpb25QYXRoOiBnZXRBY3Rpb25QYXRoLFxuXHRjb21wdXRlRGlzcGxheU1vZGU6IGNvbXB1dGVEaXNwbGF5TW9kZSxcblx0aXNTdGlja3lFZGl0TW9kZTogaXNTdGlja3lFZGl0TW9kZSxcblx0Z2V0T3BlcmF0b3JzRm9yUHJvcGVydHk6IGdldE9wZXJhdG9yc0ZvclByb3BlcnR5LFxuXHRnZXRPcGVyYXRvcnNGb3JEYXRlUHJvcGVydHk6IGdldE9wZXJhdG9yc0ZvckRhdGVQcm9wZXJ0eSxcblx0Z2V0T3BlcmF0b3JzRm9yR3VpZFByb3BlcnR5OiBnZXRPcGVyYXRvcnNGb3JHdWlkUHJvcGVydHksXG5cdGFkZFNlbGVjdGlvblZhcmlhbnRUb0NvbmRpdGlvbnM6IGFkZFNlbGVjdGlvblZhcmlhbnRUb0NvbmRpdGlvbnMsXG5cdGFkZEV4dGVybmFsU3RhdGVGaWx0ZXJzVG9TZWxlY3Rpb25WYXJpYW50OiBhZGRFeHRlcm5hbFN0YXRlRmlsdGVyc1RvU2VsZWN0aW9uVmFyaWFudCxcblx0YWRkUGFnZUNvbnRleHRUb1NlbGVjdGlvblZhcmlhbnQ6IGFkZFBhZ2VDb250ZXh0VG9TZWxlY3Rpb25WYXJpYW50LFxuXHRhZGREZWZhdWx0RGlzcGxheUN1cnJlbmN5OiBhZGREZWZhdWx0RGlzcGxheUN1cnJlbmN5LFxuXHRnZXROb25Db21wdXRlZFZpc2libGVGaWVsZHM6IGdldE5vbkNvbXB1dGVkVmlzaWJsZUZpZWxkcyxcblx0c2V0VXNlckRlZmF1bHRzOiBzZXRVc2VyRGVmYXVsdHMsXG5cdGdldFNoZWxsU2VydmljZXM6IGdldFNoZWxsU2VydmljZXMsXG5cdGdldEhhc2g6IGdldEhhc2gsXG5cdGdldElCTkFjdGlvbnM6IGZuR2V0SUJOQWN0aW9ucyxcblx0Z2V0SGVhZGVyRmFjZXRJdGVtQ29uZmlnRm9yRXh0ZXJuYWxOYXZpZ2F0aW9uOiBnZXRIZWFkZXJGYWNldEl0ZW1Db25maWdGb3JFeHRlcm5hbE5hdmlnYXRpb24sXG5cdGdldFNlbWFudGljT2JqZWN0TWFwcGluZzogZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nLFxuXHRzZXRTZW1hbnRpY09iamVjdE1hcHBpbmdzOiBzZXRTZW1hbnRpY09iamVjdE1hcHBpbmdzLFxuXHRnZXRTZW1hbnRpY09iamVjdFByb21pc2U6IGZuR2V0U2VtYW50aWNPYmplY3RQcm9taXNlLFxuXHRnZXRTZW1hbnRpY1RhcmdldHNGcm9tUGFnZU1vZGVsOiBmbkdldFNlbWFudGljVGFyZ2V0c0Zyb21QYWdlTW9kZWwsXG5cdGdldFNlbWFudGljT2JqZWN0c0Zyb21QYXRoOiBmbkdldFNlbWFudGljT2JqZWN0c0Zyb21QYXRoLFxuXHR1cGRhdGVTZW1hbnRpY1RhcmdldHM6IGZuVXBkYXRlU2VtYW50aWNUYXJnZXRzTW9kZWwsXG5cdGdldFByb3BlcnR5RGF0YVR5cGU6IGdldFByb3BlcnR5RGF0YVR5cGUsXG5cdGdldE5hdmlnYXRpb25SZXN0cmljdGlvbnM6IGdldE5hdmlnYXRpb25SZXN0cmljdGlvbnMsXG5cdGdldFNlYXJjaFJlc3RyaWN0aW9uczogZ2V0U2VhcmNoUmVzdHJpY3Rpb25zLFxuXHRnZXRGaWx0ZXJSZXN0cmljdGlvbnNCeVBhdGg6IGdldEZpbHRlclJlc3RyaWN0aW9uc0J5UGF0aCxcblx0Z2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbjogZ2V0U3BlY2lmaWNBbGxvd2VkRXhwcmVzc2lvbixcblx0Z2V0QWRkaXRpb25hbFBhcmFtc0ZvckNyZWF0ZTogZ2V0QWRkaXRpb25hbFBhcmFtc0ZvckNyZWF0ZSxcblx0cmVxdWVzdFNpbmdsZXRvblByb3BlcnR5OiByZXF1ZXN0U2luZ2xldG9uUHJvcGVydHksXG5cdHRlbXBsYXRlQ29udHJvbEZyYWdtZW50OiB0ZW1wbGF0ZUNvbnRyb2xGcmFnbWVudCxcblx0YWRkRXZlbnRUb0JpbmRpbmdJbmZvOiBhZGRFdmVudFRvQmluZGluZ0luZm8sXG5cdEZpbHRlclJlc3RyaWN0aW9uczoge1xuXHRcdFJFUVVJUkVEX1BST1BFUlRJRVM6IFwiUmVxdWlyZWRQcm9wZXJ0aWVzXCIsXG5cdFx0Tk9OX0ZJTFRFUkFCTEVfUFJPUEVSVElFUzogXCJOb25GaWx0ZXJhYmxlUHJvcGVydGllc1wiLFxuXHRcdEFMTE9XRURfRVhQUkVTU0lPTlM6IFwiRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zXCJcblx0fSxcblx0QWxsb3dlZEV4cHJlc3Npb25zUHJpbzogW1wiU2luZ2xlVmFsdWVcIiwgXCJNdWx0aVZhbHVlXCIsIFwiU2luZ2xlUmFuZ2VcIiwgXCJNdWx0aVJhbmdlXCIsIFwiU2VhcmNoRXhwcmVzc2lvblwiLCBcIk11bHRpUmFuZ2VPclNlYXJjaEV4cHJlc3Npb25cIl0sXG5cdG5vcm1hbGl6ZVNlYXJjaFRlcm06IG5vcm1hbGl6ZVNlYXJjaFRlcm0sXG5cdGdldFNpbmdsZXRvblBhdGg6IGdldFNpbmdsZXRvblBhdGgsXG5cdGdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnM6IGdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21VcGRhdGVSZXN0cmljdGlvbnMsXG5cdGdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21JbnNlcnRSZXN0cmljdGlvbnM6IGdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21JbnNlcnRSZXN0cmljdGlvbnMsXG5cdGhhc1Jlc3RyaWN0ZWRQcm9wZXJ0aWVzSW5Bbm5vdGF0aW9uczogaGFzUmVzdHJpY3RlZFByb3BlcnRpZXNJbkFubm90YXRpb25zLFxuXHRnZXRSZXF1aXJlZFByb3BlcnRpZXNGcm9tQW5ub3RhdGlvbnM6IGdldFJlcXVpcmVkUHJvcGVydGllc0Zyb21Bbm5vdGF0aW9ucyxcblx0Z2V0UmVxdWlyZWRQcm9wZXJ0aWVzOiBnZXRSZXF1aXJlZFByb3BlcnRpZXMsXG5cdGNoZWNrSWZSZXNvdXJjZUtleUV4aXN0czogY2hlY2tJZlJlc291cmNlS2V5RXhpc3RzLFxuXHRzZXRDb250ZXh0c0Jhc2VkT25PcGVyYXRpb25BdmFpbGFibGU6IHNldENvbnRleHRzQmFzZWRPbk9wZXJhdGlvbkF2YWlsYWJsZSxcblx0c2V0RHluYW1pY0FjdGlvbkNvbnRleHRzOiBzZXREeW5hbWljQWN0aW9uQ29udGV4dHMsXG5cdHJlcXVlc3RQcm9wZXJ0eTogcmVxdWVzdFByb3BlcnR5LFxuXHRnZXRQYXJhbWV0ZXJQYXRoOiBnZXRQYXJhbWV0ZXJQYXRoLFxuXHRnZXRSZWxhdGVkQXBwc01lbnVJdGVtczogX2dldFJlbGF0ZWRBcHBzTWVudUl0ZW1zLFxuXHRnZXRUcmFuc2xhdGVkVGV4dEZyb21FeHBCaW5kaW5nU3RyaW5nOiBfZm50cmFuc2xhdGVkVGV4dEZyb21FeHBCaW5kaW5nU3RyaW5nLFxuXHRhZGRTZW1hbnRpY0RhdGVzVG9Db25kaXRpb25zOiBhZGRTZW1hbnRpY0RhdGVzVG9Db25kaXRpb25zLFxuXHRhZGRTZWxlY3RPcHRpb25Ub0NvbmRpdGlvbnM6IGFkZFNlbGVjdE9wdGlvblRvQ29uZGl0aW9ucyxcblx0Y3JlYXRlU2VtYW50aWNEYXRlc0Zyb21Db25kaXRpb25zOiBjcmVhdGVTZW1hbnRpY0RhdGVzRnJvbUNvbmRpdGlvbnMsXG5cdHVwZGF0ZVJlbGF0ZUFwcHNNb2RlbDogdXBkYXRlUmVsYXRlQXBwc01vZGVsLFxuXHRnZXRTZW1hbnRpY09iamVjdEFubm90YXRpb25zOiBfZ2V0U2VtYW50aWNPYmplY3RBbm5vdGF0aW9uc1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tbW9uVXRpbHM7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUFrakJPLGdCQUFnQkEsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0lBQ3JDLElBQUk7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