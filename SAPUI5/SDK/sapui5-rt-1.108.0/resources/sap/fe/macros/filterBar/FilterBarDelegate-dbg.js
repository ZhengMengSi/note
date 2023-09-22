/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/fe/core/CommonUtils", "sap/fe/core/converters/controls/ListReport/FilterBar", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/TemplateModel", "sap/fe/core/templating/PropertyFormatters", "sap/fe/macros/CommonHelper", "sap/fe/macros/DelegateUtil", "sap/fe/macros/filter/FilterUtils", "sap/fe/macros/ResourceModel", "sap/ui/mdc/FilterBarDelegate", "sap/fe/core/type/TypeUtil", "sap/ui/model/json/JSONModel"], function (Log, mergeObjects, CommonUtils, FilterBar, ModelHelper, StableIdHelper, TemplateModel, PropertyFormatters, CommonHelper, DelegateUtil, FilterUtils, ResourceModel, FilterBarDelegate, TypeUtil, JSONModel) {
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

  var hasValueHelp = PropertyFormatters.hasValueHelp;
  var generate = StableIdHelper.generate;
  var processSelectionFields = FilterBar.processSelectionFields;

  var _addPropertyInfo = function (oParentControl, mPropertyBag, oMetaModel, sPropertyInfoName) {
    try {
      sPropertyInfoName = sPropertyInfoName.replace("*", "");
      return Promise.resolve(mPropertyBag.modifier.getProperty(oParentControl, "delegate")).then(function (delegate) {
        return Promise.resolve(mPropertyBag.modifier.getProperty(oParentControl, "propertyInfo")).then(function (aPropertyInfo) {
          var hasPropertyInfo = aPropertyInfo.some(function (prop) {
            return prop.key === sPropertyInfoName || prop.name === sPropertyInfoName;
          });

          if (!hasPropertyInfo) {
            var entityTypePath = delegate.payload.entityTypePath;
            var converterContext = FilterUtils.createConverterContext(oParentControl, entityTypePath, oMetaModel, mPropertyBag.appComponent);
            var entityType = converterContext.getEntityType();
            var filterField = FilterUtils.getFilterField(sPropertyInfoName, converterContext, entityType);
            filterField = FilterUtils.buildProperyInfo(filterField, converterContext);
            aPropertyInfo.push(filterField);
            mPropertyBag.modifier.setProperty(oParentControl, "propertyInfo", aPropertyInfo);
          }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Method responsible for creating filter field in standalone / personalization filter bar.
   *
   * @param sPropertyInfoName Name of the property being added as filter field
   * @param oParentControl Parent control instance to which the filter field is added
   * @param mPropertyBag Instance of property bag from Flex API
   * @returns Once resolved, a filter field definition is returned
   */


  var _addXMLCustomFilterField = function (oFilterBar, oModifier, sPropertyPath) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(Promise.resolve(oModifier.getAggregation(oFilterBar, "dependents"))).then(function (aDependents) {
          var i;

          if (aDependents && aDependents.length > 1) {
            for (i = 0; i <= aDependents.length; i++) {
              var oFilterField = aDependents[i];

              if (oFilterField && oFilterField.isA("sap.ui.mdc.FilterField")) {
                var sDataProperty = oFilterField.getFieldPath(),
                    sFilterFieldId = oFilterField.getId();

                if (sPropertyPath === sDataProperty && sFilterFieldId.indexOf("CustomFilterField")) {
                  return Promise.resolve(oFilterField);
                }
              }
            }
          }
        });
      }, function (oError) {
        Log.error("Filter Cannot be added", oError);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var ODataFilterBarDelegate = Object.assign({}, FilterBarDelegate);
  var EDIT_STATE_PROPERTY_NAME = "$editState",
      SEARCH_PROPERTY_NAME = "$search",
      VALUE_HELP_TYPE = "FilterFieldValueHelp",
      FETCHED_PROPERTIES_DATA_KEY = "sap_fe_FilterBarDelegate_propertyInfoMap",
      CONDITION_PATH_TO_PROPERTY_PATH_REGEX = /\+|\*/g;

  function _templateEditState(sIdPrefix, metaModel, oModifier) {
    var oThis = new JSONModel({
      id: sIdPrefix,
      isDraftCollaborative: ModelHelper.isCollaborationDraftSupported(metaModel)
    }),
        oPreprocessorSettings = {
      bindingContexts: {
        "this": oThis.createBindingContext("/")
      },
      models: {
        "this.i18n": ResourceModel.getModel(),
        "this": oThis
      }
    };
    return DelegateUtil.templateControlFragment("sap.fe.macros.filter.DraftEditState", oPreprocessorSettings, undefined, oModifier).finally(function () {
      oThis.destroy();
    });
  }

  ODataFilterBarDelegate._templateCustomFilter = function (oFilterBar, sIdPrefix, oSelectionFieldInfo, oMetaModel, oModifier) {
    try {
      return Promise.resolve(DelegateUtil.getCustomData(oFilterBar, "entityType", oModifier)).then(function (sEntityTypePath) {
        var oThis = new JSONModel({
          id: sIdPrefix
        }),
            oItemModel = new TemplateModel(oSelectionFieldInfo, oMetaModel),
            oPreprocessorSettings = {
          bindingContexts: {
            "contextPath": oMetaModel.createBindingContext(sEntityTypePath),
            "this": oThis.createBindingContext("/"),
            "item": oItemModel.createBindingContext("/")
          },
          models: {
            "contextPath": oMetaModel,
            "this": oThis,
            "item": oItemModel
          }
        },
            oView = CommonUtils.getTargetView(oFilterBar),
            oController = oView ? oView.getController() : undefined,
            oOptions = {
          controller: oController ? oController : undefined,
          view: oView
        };
        return DelegateUtil.templateControlFragment("sap.fe.macros.filter.CustomFilter", oPreprocessorSettings, oOptions, oModifier).finally(function () {
          oThis.destroy();
          oItemModel.destroy();
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function _getPropertyPath(sConditionPath) {
    return sConditionPath.replace(CONDITION_PATH_TO_PROPERTY_PATH_REGEX, "");
  }

  ODataFilterBarDelegate._findSelectionField = function (aSelectionFields, sFlexName) {
    return aSelectionFields.find(function (oSelectionField) {
      return (oSelectionField.conditionPath === sFlexName || oSelectionField.conditionPath.replaceAll(/\*/g, "") === sFlexName) && oSelectionField.availability !== "Hidden";
    });
  };

  function _generateIdPrefix(sFilterBarId, sControlType, sNavigationPrefix) {
    return sNavigationPrefix ? generate([sFilterBarId, sControlType, sNavigationPrefix]) : generate([sFilterBarId, sControlType]);
  }

  function _templateValueHelp(oSettings, oParameters) {
    var oThis = new JSONModel({
      idPrefix: oParameters.sVhIdPrefix,
      conditionModel: "$filters",
      navigationPrefix: oParameters.sNavigationPrefix ? "/".concat(oParameters.sNavigationPrefix) : "",
      filterFieldValueHelp: true,
      useSemanticDateRange: oParameters.bUseSemanticDateRange,
      useNewValueHelp: location.href.indexOf("sap-fe-oldFieldValueHelp=true") < 0
    });
    var oPreprocessorSettings = mergeObjects({}, oSettings, {
      bindingContexts: {
        "this": oThis.createBindingContext("/")
      },
      models: {
        "this": oThis
      }
    });
    return Promise.resolve(DelegateUtil.templateControlFragment("sap.fe.macros.internal.valuehelp.ValueHelp", oPreprocessorSettings, {
      isXML: oSettings.isXML
    })).then(function (aVHElements) {
      if (aVHElements) {
        var sAggregationName = "dependents"; //Some filter fields have the PersistenceProvider aggregation besides the FVH :

        if (aVHElements.length) {
          aVHElements.forEach(function (elt) {
            if (oParameters.oModifier) {
              oParameters.oModifier.insertAggregation(oParameters.oControl, sAggregationName, elt, 0);
            } else {
              oParameters.oControl.insertAggregation(sAggregationName, elt, 0, false);
            }
          });
        } else if (oParameters.oModifier) {
          oParameters.oModifier.insertAggregation(oParameters.oControl, sAggregationName, aVHElements, 0);
        } else {
          oParameters.oControl.insertAggregation(sAggregationName, aVHElements, 0, false);
        }
      }
    }).catch(function (oError) {
      Log.error("Error while evaluating DelegateUtil.isValueHelpRequired", oError);
    }).finally(function () {
      oThis.destroy();
    });
  }

  function _templateFilterField(oSettings, oParameters) {
    var oThis = new JSONModel({
      idPrefix: oParameters.sIdPrefix,
      vhIdPrefix: oParameters.sVhIdPrefix,
      propertyPath: oParameters.sPropertyName,
      navigationPrefix: oParameters.sNavigationPrefix ? "/".concat(oParameters.sNavigationPrefix) : "",
      useSemanticDateRange: oParameters.bUseSemanticDateRange,
      settings: oParameters.oSettings,
      visualFilter: oParameters.visualFilter
    });
    var oMetaModel = oParameters.oMetaModel;
    var oVisualFilter = new TemplateModel(oParameters.visualFilter, oMetaModel);
    var oPreprocessorSettings = mergeObjects({}, oSettings, {
      bindingContexts: {
        "this": oThis.createBindingContext("/"),
        "visualFilter": oVisualFilter.createBindingContext("/")
      },
      models: {
        "this": oThis,
        "visualFilter": oVisualFilter,
        "metaModel": oMetaModel
      }
    });
    return DelegateUtil.templateControlFragment("sap.fe.macros.internal.FilterField", oPreprocessorSettings, {
      isXML: oSettings.isXML
    }).finally(function () {
      oThis.destroy();
    });
  }

  ODataFilterBarDelegate.addItem = function (sPropertyInfoName, oParentControl, mPropertyBag) {
    try {
      if (!mPropertyBag) {
        // Invoked during runtime.
        return Promise.resolve(ODataFilterBarDelegate._addP13nItem(sPropertyInfoName, oParentControl));
      }

      var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();

      if (!oMetaModel) {
        return Promise.resolve(null);
      }

      return Promise.resolve(_addPropertyInfo(oParentControl, mPropertyBag, oMetaModel, sPropertyInfoName)).then(function () {
        return ODataFilterBarDelegate._addFlexItem(sPropertyInfoName, oParentControl, oMetaModel, mPropertyBag.modifier, mPropertyBag.appComponent);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Method responsible for removing filter field in standalone / personalization filter bar.
   *
   * @param oFilterFieldProperty Object of the filter field property being removed as filter field
   * @param oParentControl Parent control instance from which the filter field is removed
   * @param mPropertyBag Instance of property bag from Flex API
   * @returns The resolved promise
   */


  ODataFilterBarDelegate.removeItem = function (oFilterFieldProperty, oParentControl, mPropertyBag) {
    try {
      var _exit2 = false;

      function _temp4(_result) {
        if (_exit2) return _result;

        if (typeof oFilterFieldProperty !== "string" && oFilterFieldProperty.isA && oFilterFieldProperty.isA("sap.ui.mdc.FilterField")) {
          if (oFilterFieldProperty.data("isSlot") === "true" && mPropertyBag) {
            // Inserting into the modifier creates a change from flex also filter is been removed hence promise is resolved to false
            var oModifier = mPropertyBag.modifier;
            oModifier.insertAggregation(oParentControl, "dependents", oFilterFieldProperty);
            doRemoveItem = false;
          }
        }

        return Promise.resolve(doRemoveItem);
      }

      var doRemoveItem = true;

      var _temp5 = function () {
        if (!oParentControl.data("sap_fe_FilterBarDelegate_propertyInfoMap")) {
          var oMetaModel = mPropertyBag && mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();

          if (!oMetaModel) {
            var _Promise$resolve2 = Promise.resolve(null);

            _exit2 = true;
            return _Promise$resolve2;
          }

          var _temp6 = function () {
            if (typeof oFilterFieldProperty !== "string" && oFilterFieldProperty.getFieldPath()) {
              return Promise.resolve(_addPropertyInfo(oParentControl, mPropertyBag, oMetaModel, oFilterFieldProperty.getFieldPath())).then(function () {});
            } else {
              return Promise.resolve(_addPropertyInfo(oParentControl, mPropertyBag, oMetaModel, oFilterFieldProperty)).then(function () {});
            }
          }();

          if (_temp6 && _temp6.then) return _temp6.then(function () {});
        }
      }();

      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Method responsible for creating filter field condition in standalone / personalization filter bar.
   *
   * @param sPropertyInfoName Name of the property being added as filter field
   * @param oParentControl Parent control instance to which the filter field is added
   * @param mPropertyBag Instance of property bag from Flex API
   * @returns The resolved promise
   */


  ODataFilterBarDelegate.addCondition = function (sPropertyInfoName, oParentControl, mPropertyBag) {
    try {
      var oMetaModel = mPropertyBag && mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();

      if (!oMetaModel) {
        return Promise.resolve(null);
      }

      return Promise.resolve(_addPropertyInfo(oParentControl, mPropertyBag, oMetaModel, sPropertyInfoName)).then(function () {
        return Promise.resolve();
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Method responsible for removing filter field in standalone / personalization filter bar.
   *
   * @param sPropertyInfoName Name of the property being removed as filter field
   * @param oParentControl Parent control instance from which the filter field is removed
   * @param mPropertyBag Instance of property bag from Flex API
   * @returns The resolved promise
   */


  ODataFilterBarDelegate.removeCondition = function (sPropertyInfoName, oParentControl, mPropertyBag) {
    try {
      var _exit4 = false;

      function _temp9(_result2) {
        return _exit4 ? _result2 : Promise.resolve();
      }

      var _temp10 = function () {
        if (!oParentControl.data("sap_fe_FilterBarDelegate_propertyInfoMap")) {
          var oMetaModel = mPropertyBag && mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();

          if (!oMetaModel) {
            var _Promise$resolve4 = Promise.resolve(null);

            _exit4 = true;
            return _Promise$resolve4;
          }

          return Promise.resolve(_addPropertyInfo(oParentControl, mPropertyBag, oMetaModel, sPropertyInfoName)).then(function () {});
        }
      }();

      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Creates the filter field in the table adaptation of the FilterBar.
   *
   * @param sPropertyInfoName The property name of the entity type for which the filter field needs to be created
   * @param oParentControl Instance of the parent control
   * @returns Once resolved, a filter field definition is returned
   */


  ODataFilterBarDelegate._addP13nItem = function (sPropertyInfoName, oParentControl) {
    return DelegateUtil.fetchModel(oParentControl).then(function (oModel) {
      return ODataFilterBarDelegate._addFlexItem(sPropertyInfoName, oParentControl, oModel.getMetaModel(), undefined);
    }).catch(function (oError) {
      Log.error("Model could not be resolved", oError);
      return null;
    });
  };

  ODataFilterBarDelegate.fetchPropertiesForEntity = function (sEntityTypePath, oMetaModel, oFilterControl) {
    var oEntityType = oMetaModel.getObject(sEntityTypePath);
    var includeHidden = oFilterControl.isA("sap.ui.mdc.filterbar.vh.FilterBar") ? true : undefined;

    if (!oFilterControl || !oEntityType) {
      return [];
    }

    var oConverterContext = FilterUtils.createConverterContext(oFilterControl, sEntityTypePath);
    var sEntitySetPath = ModelHelper.getEntitySetPath(sEntityTypePath);
    var mFilterFields = FilterUtils.getConvertedFilterFields(oFilterControl, sEntityTypePath, includeHidden);
    var aFetchedProperties = [];
    mFilterFields.forEach(function (oFilterFieldInfo) {
      if (oFilterFieldInfo.annotationPath) {
        var sTargetPropertyPrefix = CommonHelper.getLocationForPropertyPath(oMetaModel, oFilterFieldInfo.annotationPath);
        var sProperty = oFilterFieldInfo.annotationPath.replace("".concat(sTargetPropertyPrefix, "/"), "");

        if (CommonUtils.isPropertyFilterable(oMetaModel, sTargetPropertyPrefix, _getPropertyPath(sProperty), true)) {
          aFetchedProperties.push(oFilterFieldInfo);
        }
      } else {
        //Custom Filters
        aFetchedProperties.push(oFilterFieldInfo);
      }
    });
    var aParameterFields = [];
    var processedFields = processSelectionFields(aFetchedProperties, oConverterContext);
    var processedFieldsKeys = [];
    processedFields.forEach(function (oProps) {
      if (oProps.key) {
        processedFieldsKeys.push(oProps.key);
      }
    });
    aFetchedProperties = aFetchedProperties.filter(function (oProp) {
      return processedFieldsKeys.includes(oProp.key);
    });
    var oFR = CommonUtils.getFilterRestrictionsByPath(sEntitySetPath, oMetaModel),
        mAllowedExpressions = oFR.FilterAllowedExpressions;
    Object.keys(processedFields).forEach(function (sFilterFieldKey) {
      var oProp = processedFields[sFilterFieldKey];
      var oSelField = aFetchedProperties[sFilterFieldKey];

      if (!oSelField || !oSelField.conditionPath) {
        return;
      }

      var sPropertyPath = _getPropertyPath(oSelField.conditionPath); //fetchBasic


      oProp = Object.assign(oProp, {
        group: oSelField.group,
        groupLabel: oSelField.groupLabel,
        path: oSelField.conditionPath,
        tooltip: null,
        removeFromAppState: false,
        hasValueHelp: false
      }); //fetchPropInfo

      if (oSelField.annotationPath) {
        var sAnnotationPath = oSelField.annotationPath;
        var oProperty = oMetaModel.getObject(sAnnotationPath),
            oPropertyAnnotations = oMetaModel.getObject("".concat(sAnnotationPath, "@")),
            oPropertyContext = oMetaModel.createBindingContext(sAnnotationPath);
        var bRemoveFromAppState = oPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] || oPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] || oPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"];
        var sTargetPropertyPrefix = CommonHelper.getLocationForPropertyPath(oMetaModel, oSelField.annotationPath);
        var sProperty = sAnnotationPath.replace("".concat(sTargetPropertyPrefix, "/"), "");
        var oFilterDefaultValueAnnotation;
        var oFilterDefaultValue;

        if (CommonUtils.isPropertyFilterable(oMetaModel, sTargetPropertyPrefix, _getPropertyPath(sProperty), true)) {
          oFilterDefaultValueAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.FilterDefaultValue"];

          if (oFilterDefaultValueAnnotation) {
            oFilterDefaultValue = oFilterDefaultValueAnnotation["$".concat(DelegateUtil.getModelType(oProperty.$Type))];
          }

          oProp = Object.assign(oProp, {
            tooltip: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.QuickInfo"] || undefined,
            removeFromAppState: bRemoveFromAppState,
            hasValueHelp: hasValueHelp(oPropertyContext.getObject(), {
              context: oPropertyContext
            }),
            defaultFilterConditions: oFilterDefaultValue ? [{
              fieldPath: oSelField.conditionPath,
              operator: "EQ",
              values: [oFilterDefaultValue]
            }] : undefined
          });
        }
      } //base


      if (oProp) {
        if (mAllowedExpressions[sPropertyPath] && mAllowedExpressions[sPropertyPath].length > 0) {
          oProp.filterExpression = CommonUtils.getSpecificAllowedExpression(mAllowedExpressions[sPropertyPath]);
        } else {
          oProp.filterExpression = "auto";
        }

        oProp = Object.assign(oProp, {
          visible: oSelField.availability === "Default"
        });
      }

      processedFields[sFilterFieldKey] = oProp;
    });
    processedFields.forEach(function (propInfo) {
      if (propInfo.path === "$editState") {
        propInfo.label = ResourceModel.getText("FILTERBAR_EDITING_STATUS");
      }

      propInfo.typeConfig = TypeUtil.getTypeConfig(propInfo.dataType, propInfo.formatOptions, propInfo.constraints);
      propInfo.label = DelegateUtil.getLocalizedText(propInfo.label, oFilterControl) || "";

      if (propInfo.isParameter) {
        aParameterFields.push(propInfo.name);
      }
    });
    aFetchedProperties = processedFields;
    DelegateUtil.setCustomData(oFilterControl, "parameters", aParameterFields);
    return aFetchedProperties;
  };

  function getLineItemQualifierFromTable(oControl, oMetaModel) {
    if (oControl.isA("sap.fe.macros.table.TableAPI")) {
      var annotationPaths = oControl.getMetaPath().split("#")[0].split("/");

      switch (annotationPaths[annotationPaths.length - 1]) {
        case "@".concat("com.sap.vocabularies.UI.v1.SelectionPresentationVariant"):
        case "@".concat("com.sap.vocabularies.UI.v1.PresentationVariant"):
          return oMetaModel.getObject(oControl.getMetaPath()).Visualizations.find(function (visualization) {
            return visualization.$AnnotationPath.includes("@".concat("com.sap.vocabularies.UI.v1.LineItem"));
          }).$AnnotationPath;

        case "@".concat("com.sap.vocabularies.UI.v1.LineItem"):
          var metaPaths = oControl.getMetaPath().split("/");
          return metaPaths[metaPaths.length - 1];
      }
    }

    return undefined;
  }

  ODataFilterBarDelegate._addFlexItem = function (sFlexPropertyName, oParentControl, oMetaModel, oModifier, oAppComponent) {
    var sFilterBarId = oModifier ? oModifier.getId(oParentControl) : oParentControl.getId(),
        sIdPrefix = oModifier ? "" : "Adaptation",
        aSelectionFields = FilterUtils.getConvertedFilterFields(oParentControl, null, undefined, oMetaModel, oAppComponent, oModifier, oModifier ? undefined : getLineItemQualifierFromTable(oParentControl.getParent(), oMetaModel)),
        oSelectionField = ODataFilterBarDelegate._findSelectionField(aSelectionFields, sFlexPropertyName),
        sPropertyPath = _getPropertyPath(sFlexPropertyName),
        bIsXML = !!oModifier && oModifier.targets === "xmlTree";

    if (sFlexPropertyName === EDIT_STATE_PROPERTY_NAME) {
      return _templateEditState(sFilterBarId, oMetaModel, oModifier);
    } else if (sFlexPropertyName === SEARCH_PROPERTY_NAME) {
      return Promise.resolve(null);
    } else if (oSelectionField && oSelectionField.template) {
      return ODataFilterBarDelegate._templateCustomFilter(oParentControl, _generateIdPrefix(sFilterBarId, "".concat(sIdPrefix, "FilterField")), oSelectionField, oMetaModel, oModifier);
    }

    if (oSelectionField.type === "Slot" && oModifier) {
      return _addXMLCustomFilterField(oParentControl, oModifier, sPropertyPath);
    }

    var sNavigationPath = CommonHelper.getNavigationPath(sPropertyPath);
    var sAnnotationPath = oSelectionField.annotationPath;
    var sEntityTypePath;
    var sUseSemanticDateRange;
    var oSettings;
    var sBindingPath;
    var oParameters;
    return Promise.resolve().then(function () {
      if (oSelectionField.isParameter) {
        return sAnnotationPath.substr(0, sAnnotationPath.lastIndexOf("/") + 1);
      }

      return DelegateUtil.getCustomData(oParentControl, "entityType", oModifier);
    }).then(function (sRetrievedEntityTypePath) {
      sEntityTypePath = sRetrievedEntityTypePath;
      return DelegateUtil.getCustomData(oParentControl, "useSemanticDateRange", oModifier);
    }).then(function (sRetrievedUseSemanticDateRange) {
      sUseSemanticDateRange = sRetrievedUseSemanticDateRange;
      var oPropertyContext = oMetaModel.createBindingContext(sEntityTypePath + sPropertyPath);
      var sInFilterBarId = oModifier ? oModifier.getId(oParentControl) : oParentControl.getId();
      oSettings = {
        bindingContexts: {
          "contextPath": oMetaModel.createBindingContext(sEntityTypePath),
          "property": oPropertyContext
        },
        models: {
          "contextPath": oMetaModel,
          "property": oMetaModel
        },
        isXML: bIsXML
      };
      sBindingPath = "/".concat(ModelHelper.getEntitySetPath(sEntityTypePath).split("/").filter(ModelHelper.filterOutNavPropBinding).join("/"));
      oParameters = {
        sPropertyName: sPropertyPath,
        sBindingPath: sBindingPath,
        sValueHelpType: sIdPrefix + VALUE_HELP_TYPE,
        oControl: oParentControl,
        oMetaModel: oMetaModel,
        oModifier: oModifier,
        sIdPrefix: _generateIdPrefix(sInFilterBarId, "".concat(sIdPrefix, "FilterField"), sNavigationPath),
        sVhIdPrefix: _generateIdPrefix(sInFilterBarId, sIdPrefix + VALUE_HELP_TYPE),
        sNavigationPrefix: sNavigationPath,
        bUseSemanticDateRange: sUseSemanticDateRange,
        oSettings: oSelectionField ? oSelectionField.settings : {},
        visualFilter: oSelectionField ? oSelectionField.visualFilter : undefined
      };
      return DelegateUtil.doesValueHelpExist(oParameters);
    }).then(function (bValueHelpExists) {
      if (!bValueHelpExists) {
        return _templateValueHelp(oSettings, oParameters);
      }

      return Promise.resolve();
    }).then(function () {
      return _templateFilterField(oSettings, oParameters);
    });
  };

  function _getCachedProperties(oFilterBar) {
    // properties are not cached during templating
    if (oFilterBar instanceof window.Element) {
      return null;
    }

    return DelegateUtil.getCustomData(oFilterBar, FETCHED_PROPERTIES_DATA_KEY);
  }

  function _setCachedProperties(oFilterBar, aFetchedProperties) {
    // do not cache during templating, else it becomes part of the cached view
    if (oFilterBar instanceof window.Element) {
      return;
    }

    DelegateUtil.setCustomData(oFilterBar, FETCHED_PROPERTIES_DATA_KEY, aFetchedProperties);
  }

  function _getCachedOrFetchPropertiesForEntity(sEntityTypePath, oMetaModel, oFilterBar) {
    var aFetchedProperties = _getCachedProperties(oFilterBar);

    var localGroupLabel;

    if (!aFetchedProperties) {
      aFetchedProperties = ODataFilterBarDelegate.fetchPropertiesForEntity(sEntityTypePath, oMetaModel, oFilterBar);
      aFetchedProperties.forEach(function (oGroup) {
        localGroupLabel = null;

        if (oGroup.groupLabel) {
          localGroupLabel = DelegateUtil.getLocalizedText(oGroup.groupLabel, oFilterBar);
          oGroup.groupLabel = localGroupLabel === null ? oGroup.groupLabel : localGroupLabel;
        }
      });
      aFetchedProperties.sort(function (a, b) {
        if (a.groupLabel === undefined || a.groupLabel === null) {
          return -1;
        }

        if (b.groupLabel === undefined || b.groupLabel === null) {
          return 1;
        }

        return a.groupLabel.localeCompare(b.groupLabel);
      });

      _setCachedProperties(oFilterBar, aFetchedProperties);
    }

    return aFetchedProperties;
  }

  ODataFilterBarDelegate.fetchProperties = function (oFilterBar) {
    var sEntityTypePath = DelegateUtil.getCustomData(oFilterBar, "entityType");
    return DelegateUtil.fetchModel(oFilterBar).then(function (oModel) {
      if (!oModel) {
        return [];
      }

      return _getCachedOrFetchPropertiesForEntity(sEntityTypePath, oModel.getMetaModel(), oFilterBar); // var aCleanedProperties = aProperties.concat();
      // var aAllowedAttributes = ["name", "label", "visible", "path", "typeConfig", "maxConditions", "group", "groupLabel"];
      // aCleanedProperties.forEach(function(oProperty) {
      // 	Object.keys(oProperty).forEach(function(sPropName) {
      // 		if (aAllowedAttributes.indexOf(sPropName) === -1) {
      // 			delete oProperty[sPropName];
      // 		}
      // 	});
      // });
      // return aCleanedProperties;
    });
  };

  ODataFilterBarDelegate.getTypeUtil = function () {
    return TypeUtil;
  };

  return ODataFilterBarDelegate;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiX2FkZFByb3BlcnR5SW5mbyIsIm9QYXJlbnRDb250cm9sIiwibVByb3BlcnR5QmFnIiwib01ldGFNb2RlbCIsInNQcm9wZXJ0eUluZm9OYW1lIiwicmVwbGFjZSIsIm1vZGlmaWVyIiwiZ2V0UHJvcGVydHkiLCJkZWxlZ2F0ZSIsImFQcm9wZXJ0eUluZm8iLCJoYXNQcm9wZXJ0eUluZm8iLCJzb21lIiwicHJvcCIsImtleSIsIm5hbWUiLCJlbnRpdHlUeXBlUGF0aCIsInBheWxvYWQiLCJjb252ZXJ0ZXJDb250ZXh0IiwiRmlsdGVyVXRpbHMiLCJjcmVhdGVDb252ZXJ0ZXJDb250ZXh0IiwiYXBwQ29tcG9uZW50IiwiZW50aXR5VHlwZSIsImdldEVudGl0eVR5cGUiLCJmaWx0ZXJGaWVsZCIsImdldEZpbHRlckZpZWxkIiwiYnVpbGRQcm9wZXJ5SW5mbyIsInB1c2giLCJzZXRQcm9wZXJ0eSIsIl9hZGRYTUxDdXN0b21GaWx0ZXJGaWVsZCIsIm9GaWx0ZXJCYXIiLCJvTW9kaWZpZXIiLCJzUHJvcGVydHlQYXRoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRBZ2dyZWdhdGlvbiIsImFEZXBlbmRlbnRzIiwiaSIsImxlbmd0aCIsIm9GaWx0ZXJGaWVsZCIsImlzQSIsInNEYXRhUHJvcGVydHkiLCJnZXRGaWVsZFBhdGgiLCJzRmlsdGVyRmllbGRJZCIsImdldElkIiwiaW5kZXhPZiIsIm9FcnJvciIsIkxvZyIsImVycm9yIiwiT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZSIsIk9iamVjdCIsImFzc2lnbiIsIkZpbHRlckJhckRlbGVnYXRlIiwiRURJVF9TVEFURV9QUk9QRVJUWV9OQU1FIiwiU0VBUkNIX1BST1BFUlRZX05BTUUiLCJWQUxVRV9IRUxQX1RZUEUiLCJGRVRDSEVEX1BST1BFUlRJRVNfREFUQV9LRVkiLCJDT05ESVRJT05fUEFUSF9UT19QUk9QRVJUWV9QQVRIX1JFR0VYIiwiX3RlbXBsYXRlRWRpdFN0YXRlIiwic0lkUHJlZml4IiwibWV0YU1vZGVsIiwib1RoaXMiLCJKU09OTW9kZWwiLCJpZCIsImlzRHJhZnRDb2xsYWJvcmF0aXZlIiwiTW9kZWxIZWxwZXIiLCJpc0NvbGxhYm9yYXRpb25EcmFmdFN1cHBvcnRlZCIsIm9QcmVwcm9jZXNzb3JTZXR0aW5ncyIsImJpbmRpbmdDb250ZXh0cyIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwibW9kZWxzIiwiUmVzb3VyY2VNb2RlbCIsImdldE1vZGVsIiwiRGVsZWdhdGVVdGlsIiwidGVtcGxhdGVDb250cm9sRnJhZ21lbnQiLCJ1bmRlZmluZWQiLCJmaW5hbGx5IiwiZGVzdHJveSIsIl90ZW1wbGF0ZUN1c3RvbUZpbHRlciIsIm9TZWxlY3Rpb25GaWVsZEluZm8iLCJnZXRDdXN0b21EYXRhIiwic0VudGl0eVR5cGVQYXRoIiwib0l0ZW1Nb2RlbCIsIlRlbXBsYXRlTW9kZWwiLCJvVmlldyIsIkNvbW1vblV0aWxzIiwiZ2V0VGFyZ2V0VmlldyIsIm9Db250cm9sbGVyIiwiZ2V0Q29udHJvbGxlciIsIm9PcHRpb25zIiwiY29udHJvbGxlciIsInZpZXciLCJfZ2V0UHJvcGVydHlQYXRoIiwic0NvbmRpdGlvblBhdGgiLCJfZmluZFNlbGVjdGlvbkZpZWxkIiwiYVNlbGVjdGlvbkZpZWxkcyIsInNGbGV4TmFtZSIsImZpbmQiLCJvU2VsZWN0aW9uRmllbGQiLCJjb25kaXRpb25QYXRoIiwicmVwbGFjZUFsbCIsImF2YWlsYWJpbGl0eSIsIl9nZW5lcmF0ZUlkUHJlZml4Iiwic0ZpbHRlckJhcklkIiwic0NvbnRyb2xUeXBlIiwic05hdmlnYXRpb25QcmVmaXgiLCJnZW5lcmF0ZSIsIl90ZW1wbGF0ZVZhbHVlSGVscCIsIm9TZXR0aW5ncyIsIm9QYXJhbWV0ZXJzIiwiaWRQcmVmaXgiLCJzVmhJZFByZWZpeCIsImNvbmRpdGlvbk1vZGVsIiwibmF2aWdhdGlvblByZWZpeCIsImZpbHRlckZpZWxkVmFsdWVIZWxwIiwidXNlU2VtYW50aWNEYXRlUmFuZ2UiLCJiVXNlU2VtYW50aWNEYXRlUmFuZ2UiLCJ1c2VOZXdWYWx1ZUhlbHAiLCJsb2NhdGlvbiIsImhyZWYiLCJtZXJnZU9iamVjdHMiLCJpc1hNTCIsImFWSEVsZW1lbnRzIiwic0FnZ3JlZ2F0aW9uTmFtZSIsImZvckVhY2giLCJlbHQiLCJpbnNlcnRBZ2dyZWdhdGlvbiIsIm9Db250cm9sIiwiY2F0Y2giLCJfdGVtcGxhdGVGaWx0ZXJGaWVsZCIsInZoSWRQcmVmaXgiLCJwcm9wZXJ0eVBhdGgiLCJzUHJvcGVydHlOYW1lIiwic2V0dGluZ3MiLCJ2aXN1YWxGaWx0ZXIiLCJvVmlzdWFsRmlsdGVyIiwiYWRkSXRlbSIsIl9hZGRQMTNuSXRlbSIsImdldE1ldGFNb2RlbCIsIl9hZGRGbGV4SXRlbSIsInJlbW92ZUl0ZW0iLCJvRmlsdGVyRmllbGRQcm9wZXJ0eSIsImRhdGEiLCJkb1JlbW92ZUl0ZW0iLCJhZGRDb25kaXRpb24iLCJyZW1vdmVDb25kaXRpb24iLCJmZXRjaE1vZGVsIiwib01vZGVsIiwiZmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5Iiwib0ZpbHRlckNvbnRyb2wiLCJvRW50aXR5VHlwZSIsImdldE9iamVjdCIsImluY2x1ZGVIaWRkZW4iLCJvQ29udmVydGVyQ29udGV4dCIsInNFbnRpdHlTZXRQYXRoIiwiZ2V0RW50aXR5U2V0UGF0aCIsIm1GaWx0ZXJGaWVsZHMiLCJnZXRDb252ZXJ0ZWRGaWx0ZXJGaWVsZHMiLCJhRmV0Y2hlZFByb3BlcnRpZXMiLCJvRmlsdGVyRmllbGRJbmZvIiwiYW5ub3RhdGlvblBhdGgiLCJzVGFyZ2V0UHJvcGVydHlQcmVmaXgiLCJDb21tb25IZWxwZXIiLCJnZXRMb2NhdGlvbkZvclByb3BlcnR5UGF0aCIsInNQcm9wZXJ0eSIsImlzUHJvcGVydHlGaWx0ZXJhYmxlIiwiYVBhcmFtZXRlckZpZWxkcyIsInByb2Nlc3NlZEZpZWxkcyIsInByb2Nlc3NTZWxlY3Rpb25GaWVsZHMiLCJwcm9jZXNzZWRGaWVsZHNLZXlzIiwib1Byb3BzIiwiZmlsdGVyIiwib1Byb3AiLCJpbmNsdWRlcyIsIm9GUiIsImdldEZpbHRlclJlc3RyaWN0aW9uc0J5UGF0aCIsIm1BbGxvd2VkRXhwcmVzc2lvbnMiLCJGaWx0ZXJBbGxvd2VkRXhwcmVzc2lvbnMiLCJrZXlzIiwic0ZpbHRlckZpZWxkS2V5Iiwib1NlbEZpZWxkIiwiZ3JvdXAiLCJncm91cExhYmVsIiwicGF0aCIsInRvb2x0aXAiLCJyZW1vdmVGcm9tQXBwU3RhdGUiLCJoYXNWYWx1ZUhlbHAiLCJzQW5ub3RhdGlvblBhdGgiLCJvUHJvcGVydHkiLCJvUHJvcGVydHlBbm5vdGF0aW9ucyIsIm9Qcm9wZXJ0eUNvbnRleHQiLCJiUmVtb3ZlRnJvbUFwcFN0YXRlIiwib0ZpbHRlckRlZmF1bHRWYWx1ZUFubm90YXRpb24iLCJvRmlsdGVyRGVmYXVsdFZhbHVlIiwiZ2V0TW9kZWxUeXBlIiwiJFR5cGUiLCJjb250ZXh0IiwiZGVmYXVsdEZpbHRlckNvbmRpdGlvbnMiLCJmaWVsZFBhdGgiLCJvcGVyYXRvciIsInZhbHVlcyIsImZpbHRlckV4cHJlc3Npb24iLCJnZXRTcGVjaWZpY0FsbG93ZWRFeHByZXNzaW9uIiwidmlzaWJsZSIsInByb3BJbmZvIiwibGFiZWwiLCJnZXRUZXh0IiwidHlwZUNvbmZpZyIsIlR5cGVVdGlsIiwiZ2V0VHlwZUNvbmZpZyIsImRhdGFUeXBlIiwiZm9ybWF0T3B0aW9ucyIsImNvbnN0cmFpbnRzIiwiZ2V0TG9jYWxpemVkVGV4dCIsImlzUGFyYW1ldGVyIiwic2V0Q3VzdG9tRGF0YSIsImdldExpbmVJdGVtUXVhbGlmaWVyRnJvbVRhYmxlIiwiYW5ub3RhdGlvblBhdGhzIiwiZ2V0TWV0YVBhdGgiLCJzcGxpdCIsIlZpc3VhbGl6YXRpb25zIiwidmlzdWFsaXphdGlvbiIsIiRBbm5vdGF0aW9uUGF0aCIsIm1ldGFQYXRocyIsInNGbGV4UHJvcGVydHlOYW1lIiwib0FwcENvbXBvbmVudCIsImdldFBhcmVudCIsImJJc1hNTCIsInRhcmdldHMiLCJ0ZW1wbGF0ZSIsInR5cGUiLCJzTmF2aWdhdGlvblBhdGgiLCJnZXROYXZpZ2F0aW9uUGF0aCIsInNVc2VTZW1hbnRpY0RhdGVSYW5nZSIsInNCaW5kaW5nUGF0aCIsInN1YnN0ciIsImxhc3RJbmRleE9mIiwic1JldHJpZXZlZEVudGl0eVR5cGVQYXRoIiwic1JldHJpZXZlZFVzZVNlbWFudGljRGF0ZVJhbmdlIiwic0luRmlsdGVyQmFySWQiLCJmaWx0ZXJPdXROYXZQcm9wQmluZGluZyIsImpvaW4iLCJzVmFsdWVIZWxwVHlwZSIsImRvZXNWYWx1ZUhlbHBFeGlzdCIsImJWYWx1ZUhlbHBFeGlzdHMiLCJfZ2V0Q2FjaGVkUHJvcGVydGllcyIsIndpbmRvdyIsIkVsZW1lbnQiLCJfc2V0Q2FjaGVkUHJvcGVydGllcyIsIl9nZXRDYWNoZWRPckZldGNoUHJvcGVydGllc0ZvckVudGl0eSIsImxvY2FsR3JvdXBMYWJlbCIsIm9Hcm91cCIsInNvcnQiLCJhIiwiYiIsImxvY2FsZUNvbXBhcmUiLCJmZXRjaFByb3BlcnRpZXMiLCJnZXRUeXBlVXRpbCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRmlsdGVyQmFyRGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVUlBbm5vdGF0aW9uVGVybXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL1VJXCI7XG5pbXBvcnQgTG9nIGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBtZXJnZU9iamVjdHMgZnJvbSBcInNhcC9iYXNlL3V0aWwvbWVyZ2VcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB7IHByb2Nlc3NTZWxlY3Rpb25GaWVsZHMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9MaXN0UmVwb3J0L0ZpbHRlckJhclwiO1xuaW1wb3J0IE1vZGVsSGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5pbXBvcnQgVGVtcGxhdGVNb2RlbCBmcm9tIFwic2FwL2ZlL2NvcmUvVGVtcGxhdGVNb2RlbFwiO1xuaW1wb3J0IHsgaGFzVmFsdWVIZWxwIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgQ29tbW9uSGVscGVyIGZyb20gXCJzYXAvZmUvbWFjcm9zL0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IERlbGVnYXRlVXRpbCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9EZWxlZ2F0ZVV0aWxcIjtcbmltcG9ydCBGaWx0ZXJVdGlscyBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWx0ZXIvRmlsdGVyVXRpbHNcIjtcbmltcG9ydCBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvZmUvbWFjcm9zL1Jlc291cmNlTW9kZWxcIjtcbmltcG9ydCBGaWx0ZXJCYXIgZnJvbSBcInNhcC91aS9tZGMvRmlsdGVyQmFyXCI7XG5pbXBvcnQgRmlsdGVyQmFyRGVsZWdhdGUgZnJvbSBcInNhcC91aS9tZGMvRmlsdGVyQmFyRGVsZWdhdGVcIjtcbmltcG9ydCBUeXBlVXRpbCBmcm9tIFwic2FwL2ZlL2NvcmUvdHlwZS9UeXBlVXRpbFwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5cbmNvbnN0IE9EYXRhRmlsdGVyQmFyRGVsZWdhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBGaWx0ZXJCYXJEZWxlZ2F0ZSkgYXMgYW55O1xuY29uc3QgRURJVF9TVEFURV9QUk9QRVJUWV9OQU1FID0gXCIkZWRpdFN0YXRlXCIsXG5cdFNFQVJDSF9QUk9QRVJUWV9OQU1FID0gXCIkc2VhcmNoXCIsXG5cdFZBTFVFX0hFTFBfVFlQRSA9IFwiRmlsdGVyRmllbGRWYWx1ZUhlbHBcIixcblx0RkVUQ0hFRF9QUk9QRVJUSUVTX0RBVEFfS0VZID0gXCJzYXBfZmVfRmlsdGVyQmFyRGVsZWdhdGVfcHJvcGVydHlJbmZvTWFwXCIsXG5cdENPTkRJVElPTl9QQVRIX1RPX1BST1BFUlRZX1BBVEhfUkVHRVggPSAvXFwrfFxcKi9nO1xuXG5mdW5jdGlvbiBfdGVtcGxhdGVFZGl0U3RhdGUoc0lkUHJlZml4OiBhbnksIG1ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwsIG9Nb2RpZmllcjogYW55KSB7XG5cdGNvbnN0IG9UaGlzID0gbmV3IEpTT05Nb2RlbCh7XG5cdFx0XHRpZDogc0lkUHJlZml4LFxuXHRcdFx0aXNEcmFmdENvbGxhYm9yYXRpdmU6IE1vZGVsSGVscGVyLmlzQ29sbGFib3JhdGlvbkRyYWZ0U3VwcG9ydGVkKG1ldGFNb2RlbClcblx0XHR9KSxcblx0XHRvUHJlcHJvY2Vzc29yU2V0dGluZ3MgPSB7XG5cdFx0XHRiaW5kaW5nQ29udGV4dHM6IHtcblx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKVxuXHRcdFx0fSxcblx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcInRoaXMuaTE4blwiOiBSZXNvdXJjZU1vZGVsLmdldE1vZGVsKCksXG5cdFx0XHRcdFwidGhpc1wiOiBvVGhpc1xuXHRcdFx0fVxuXHRcdH07XG5cblx0cmV0dXJuIERlbGVnYXRlVXRpbC50ZW1wbGF0ZUNvbnRyb2xGcmFnbWVudChcInNhcC5mZS5tYWNyb3MuZmlsdGVyLkRyYWZ0RWRpdFN0YXRlXCIsIG9QcmVwcm9jZXNzb3JTZXR0aW5ncywgdW5kZWZpbmVkLCBvTW9kaWZpZXIpLmZpbmFsbHkoXG5cdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0b1RoaXMuZGVzdHJveSgpO1xuXHRcdH1cblx0KTtcbn1cblxuT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZS5fdGVtcGxhdGVDdXN0b21GaWx0ZXIgPSBhc3luYyBmdW5jdGlvbiAoXG5cdG9GaWx0ZXJCYXI6IGFueSxcblx0c0lkUHJlZml4OiBhbnksXG5cdG9TZWxlY3Rpb25GaWVsZEluZm86IGFueSxcblx0b01ldGFNb2RlbDogYW55LFxuXHRvTW9kaWZpZXI6IGFueVxuKSB7XG5cdGNvbnN0IHNFbnRpdHlUeXBlUGF0aCA9IGF3YWl0IERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9GaWx0ZXJCYXIsIFwiZW50aXR5VHlwZVwiLCBvTW9kaWZpZXIpO1xuXHRjb25zdCBvVGhpcyA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0aWQ6IHNJZFByZWZpeFxuXHRcdH0pLFxuXHRcdG9JdGVtTW9kZWwgPSBuZXcgVGVtcGxhdGVNb2RlbChvU2VsZWN0aW9uRmllbGRJbmZvLCBvTWV0YU1vZGVsKSxcblx0XHRvUHJlcHJvY2Vzc29yU2V0dGluZ3MgPSB7XG5cdFx0XHRiaW5kaW5nQ29udGV4dHM6IHtcblx0XHRcdFx0XCJjb250ZXh0UGF0aFwiOiBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNFbnRpdHlUeXBlUGF0aCksXG5cdFx0XHRcdFwidGhpc1wiOiBvVGhpcy5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIiksXG5cdFx0XHRcdFwiaXRlbVwiOiBvSXRlbU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKVxuXHRcdFx0fSxcblx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcImNvbnRleHRQYXRoXCI6IG9NZXRhTW9kZWwsXG5cdFx0XHRcdFwidGhpc1wiOiBvVGhpcyxcblx0XHRcdFx0XCJpdGVtXCI6IG9JdGVtTW9kZWxcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9WaWV3ID0gQ29tbW9uVXRpbHMuZ2V0VGFyZ2V0VmlldyhvRmlsdGVyQmFyKSxcblx0XHRvQ29udHJvbGxlciA9IG9WaWV3ID8gb1ZpZXcuZ2V0Q29udHJvbGxlcigpIDogdW5kZWZpbmVkLFxuXHRcdG9PcHRpb25zID0ge1xuXHRcdFx0Y29udHJvbGxlcjogb0NvbnRyb2xsZXIgPyBvQ29udHJvbGxlciA6IHVuZGVmaW5lZCxcblx0XHRcdHZpZXc6IG9WaWV3XG5cdFx0fTtcblxuXHRyZXR1cm4gRGVsZWdhdGVVdGlsLnRlbXBsYXRlQ29udHJvbEZyYWdtZW50KFwic2FwLmZlLm1hY3Jvcy5maWx0ZXIuQ3VzdG9tRmlsdGVyXCIsIG9QcmVwcm9jZXNzb3JTZXR0aW5ncywgb09wdGlvbnMsIG9Nb2RpZmllcikuZmluYWxseShcblx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRvVGhpcy5kZXN0cm95KCk7XG5cdFx0XHRvSXRlbU1vZGVsLmRlc3Ryb3koKTtcblx0XHR9XG5cdCk7XG59O1xuZnVuY3Rpb24gX2dldFByb3BlcnR5UGF0aChzQ29uZGl0aW9uUGF0aDogYW55KSB7XG5cdHJldHVybiBzQ29uZGl0aW9uUGF0aC5yZXBsYWNlKENPTkRJVElPTl9QQVRIX1RPX1BST1BFUlRZX1BBVEhfUkVHRVgsIFwiXCIpO1xufVxuT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZS5fZmluZFNlbGVjdGlvbkZpZWxkID0gZnVuY3Rpb24gKGFTZWxlY3Rpb25GaWVsZHM6IGFueSwgc0ZsZXhOYW1lOiBhbnkpIHtcblx0cmV0dXJuIGFTZWxlY3Rpb25GaWVsZHMuZmluZChmdW5jdGlvbiAob1NlbGVjdGlvbkZpZWxkOiBhbnkpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0KG9TZWxlY3Rpb25GaWVsZC5jb25kaXRpb25QYXRoID09PSBzRmxleE5hbWUgfHwgb1NlbGVjdGlvbkZpZWxkLmNvbmRpdGlvblBhdGgucmVwbGFjZUFsbCgvXFwqL2csIFwiXCIpID09PSBzRmxleE5hbWUpICYmXG5cdFx0XHRvU2VsZWN0aW9uRmllbGQuYXZhaWxhYmlsaXR5ICE9PSBcIkhpZGRlblwiXG5cdFx0KTtcblx0fSk7XG59O1xuZnVuY3Rpb24gX2dlbmVyYXRlSWRQcmVmaXgoc0ZpbHRlckJhcklkOiBhbnksIHNDb250cm9sVHlwZTogYW55LCBzTmF2aWdhdGlvblByZWZpeD86IGFueSkge1xuXHRyZXR1cm4gc05hdmlnYXRpb25QcmVmaXggPyBnZW5lcmF0ZShbc0ZpbHRlckJhcklkLCBzQ29udHJvbFR5cGUsIHNOYXZpZ2F0aW9uUHJlZml4XSkgOiBnZW5lcmF0ZShbc0ZpbHRlckJhcklkLCBzQ29udHJvbFR5cGVdKTtcbn1cbmZ1bmN0aW9uIF90ZW1wbGF0ZVZhbHVlSGVscChvU2V0dGluZ3M6IGFueSwgb1BhcmFtZXRlcnM6IGFueSkge1xuXHRjb25zdCBvVGhpcyA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdGlkUHJlZml4OiBvUGFyYW1ldGVycy5zVmhJZFByZWZpeCxcblx0XHRjb25kaXRpb25Nb2RlbDogXCIkZmlsdGVyc1wiLFxuXHRcdG5hdmlnYXRpb25QcmVmaXg6IG9QYXJhbWV0ZXJzLnNOYXZpZ2F0aW9uUHJlZml4ID8gYC8ke29QYXJhbWV0ZXJzLnNOYXZpZ2F0aW9uUHJlZml4fWAgOiBcIlwiLFxuXHRcdGZpbHRlckZpZWxkVmFsdWVIZWxwOiB0cnVlLFxuXHRcdHVzZVNlbWFudGljRGF0ZVJhbmdlOiBvUGFyYW1ldGVycy5iVXNlU2VtYW50aWNEYXRlUmFuZ2UsXG5cdFx0dXNlTmV3VmFsdWVIZWxwOiBsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJzYXAtZmUtb2xkRmllbGRWYWx1ZUhlbHA9dHJ1ZVwiKSA8IDBcblx0fSk7XG5cdGNvbnN0IG9QcmVwcm9jZXNzb3JTZXR0aW5ncyA9IG1lcmdlT2JqZWN0cyh7fSwgb1NldHRpbmdzLCB7XG5cdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcInRoaXNcIjogb1RoaXMuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0fSxcblx0XHRtb2RlbHM6IHtcblx0XHRcdFwidGhpc1wiOiBvVGhpc1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShcblx0XHREZWxlZ2F0ZVV0aWwudGVtcGxhdGVDb250cm9sRnJhZ21lbnQoXCJzYXAuZmUubWFjcm9zLmludGVybmFsLnZhbHVlaGVscC5WYWx1ZUhlbHBcIiwgb1ByZXByb2Nlc3NvclNldHRpbmdzLCB7XG5cdFx0XHRpc1hNTDogb1NldHRpbmdzLmlzWE1MXG5cdFx0fSlcblx0KVxuXHRcdC50aGVuKGZ1bmN0aW9uIChhVkhFbGVtZW50czogYW55KSB7XG5cdFx0XHRpZiAoYVZIRWxlbWVudHMpIHtcblx0XHRcdFx0Y29uc3Qgc0FnZ3JlZ2F0aW9uTmFtZSA9IFwiZGVwZW5kZW50c1wiO1xuXHRcdFx0XHQvL1NvbWUgZmlsdGVyIGZpZWxkcyBoYXZlIHRoZSBQZXJzaXN0ZW5jZVByb3ZpZGVyIGFnZ3JlZ2F0aW9uIGJlc2lkZXMgdGhlIEZWSCA6XG5cdFx0XHRcdGlmIChhVkhFbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRhVkhFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbHQ6IGFueSkge1xuXHRcdFx0XHRcdFx0aWYgKG9QYXJhbWV0ZXJzLm9Nb2RpZmllcikge1xuXHRcdFx0XHRcdFx0XHRvUGFyYW1ldGVycy5vTW9kaWZpZXIuaW5zZXJ0QWdncmVnYXRpb24ob1BhcmFtZXRlcnMub0NvbnRyb2wsIHNBZ2dyZWdhdGlvbk5hbWUsIGVsdCwgMCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRvUGFyYW1ldGVycy5vQ29udHJvbC5pbnNlcnRBZ2dyZWdhdGlvbihzQWdncmVnYXRpb25OYW1lLCBlbHQsIDAsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChvUGFyYW1ldGVycy5vTW9kaWZpZXIpIHtcblx0XHRcdFx0XHRvUGFyYW1ldGVycy5vTW9kaWZpZXIuaW5zZXJ0QWdncmVnYXRpb24ob1BhcmFtZXRlcnMub0NvbnRyb2wsIHNBZ2dyZWdhdGlvbk5hbWUsIGFWSEVsZW1lbnRzLCAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvUGFyYW1ldGVycy5vQ29udHJvbC5pbnNlcnRBZ2dyZWdhdGlvbihzQWdncmVnYXRpb25OYW1lLCBhVkhFbGVtZW50cywgMCwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuY2F0Y2goZnVuY3Rpb24gKG9FcnJvcjogYW55KSB7XG5cdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBldmFsdWF0aW5nIERlbGVnYXRlVXRpbC5pc1ZhbHVlSGVscFJlcXVpcmVkXCIsIG9FcnJvcik7XG5cdFx0fSlcblx0XHQuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRvVGhpcy5kZXN0cm95KCk7XG5cdFx0fSk7XG59XG5hc3luYyBmdW5jdGlvbiBfYWRkWE1MQ3VzdG9tRmlsdGVyRmllbGQob0ZpbHRlckJhcjogYW55LCBvTW9kaWZpZXI6IGFueSwgc1Byb3BlcnR5UGF0aDogYW55KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgYURlcGVuZGVudHMgPSBhd2FpdCBQcm9taXNlLnJlc29sdmUob01vZGlmaWVyLmdldEFnZ3JlZ2F0aW9uKG9GaWx0ZXJCYXIsIFwiZGVwZW5kZW50c1wiKSk7XG5cdFx0bGV0IGk7XG5cdFx0aWYgKGFEZXBlbmRlbnRzICYmIGFEZXBlbmRlbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGZvciAoaSA9IDA7IGkgPD0gYURlcGVuZGVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3Qgb0ZpbHRlckZpZWxkID0gYURlcGVuZGVudHNbaV07XG5cdFx0XHRcdGlmIChvRmlsdGVyRmllbGQgJiYgb0ZpbHRlckZpZWxkLmlzQShcInNhcC51aS5tZGMuRmlsdGVyRmllbGRcIikpIHtcblx0XHRcdFx0XHRjb25zdCBzRGF0YVByb3BlcnR5ID0gb0ZpbHRlckZpZWxkLmdldEZpZWxkUGF0aCgpLFxuXHRcdFx0XHRcdFx0c0ZpbHRlckZpZWxkSWQgPSBvRmlsdGVyRmllbGQuZ2V0SWQoKTtcblx0XHRcdFx0XHRpZiAoc1Byb3BlcnR5UGF0aCA9PT0gc0RhdGFQcm9wZXJ0eSAmJiBzRmlsdGVyRmllbGRJZC5pbmRleE9mKFwiQ3VzdG9tRmlsdGVyRmllbGRcIikpIHtcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUob0ZpbHRlckZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gY2F0Y2ggKG9FcnJvcjogYW55KSB7XG5cdFx0TG9nLmVycm9yKFwiRmlsdGVyIENhbm5vdCBiZSBhZGRlZFwiLCBvRXJyb3IpO1xuXHR9XG59XG5mdW5jdGlvbiBfdGVtcGxhdGVGaWx0ZXJGaWVsZChvU2V0dGluZ3M6IGFueSwgb1BhcmFtZXRlcnM6IGFueSkge1xuXHRjb25zdCBvVGhpcyA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdGlkUHJlZml4OiBvUGFyYW1ldGVycy5zSWRQcmVmaXgsXG5cdFx0dmhJZFByZWZpeDogb1BhcmFtZXRlcnMuc1ZoSWRQcmVmaXgsXG5cdFx0cHJvcGVydHlQYXRoOiBvUGFyYW1ldGVycy5zUHJvcGVydHlOYW1lLFxuXHRcdG5hdmlnYXRpb25QcmVmaXg6IG9QYXJhbWV0ZXJzLnNOYXZpZ2F0aW9uUHJlZml4ID8gYC8ke29QYXJhbWV0ZXJzLnNOYXZpZ2F0aW9uUHJlZml4fWAgOiBcIlwiLFxuXHRcdHVzZVNlbWFudGljRGF0ZVJhbmdlOiBvUGFyYW1ldGVycy5iVXNlU2VtYW50aWNEYXRlUmFuZ2UsXG5cdFx0c2V0dGluZ3M6IG9QYXJhbWV0ZXJzLm9TZXR0aW5ncyxcblx0XHR2aXN1YWxGaWx0ZXI6IG9QYXJhbWV0ZXJzLnZpc3VhbEZpbHRlclxuXHR9KTtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IG9QYXJhbWV0ZXJzLm9NZXRhTW9kZWw7XG5cdGNvbnN0IG9WaXN1YWxGaWx0ZXIgPSBuZXcgVGVtcGxhdGVNb2RlbChvUGFyYW1ldGVycy52aXN1YWxGaWx0ZXIsIG9NZXRhTW9kZWwpO1xuXHRjb25zdCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MgPSBtZXJnZU9iamVjdHMoe30sIG9TZXR0aW5ncywge1xuXHRcdGJpbmRpbmdDb250ZXh0czoge1xuXHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKSxcblx0XHRcdFwidmlzdWFsRmlsdGVyXCI6IG9WaXN1YWxGaWx0ZXIuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0fSxcblx0XHRtb2RlbHM6IHtcblx0XHRcdFwidGhpc1wiOiBvVGhpcyxcblx0XHRcdFwidmlzdWFsRmlsdGVyXCI6IG9WaXN1YWxGaWx0ZXIsXG5cdFx0XHRcIm1ldGFNb2RlbFwiOiBvTWV0YU1vZGVsXG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gRGVsZWdhdGVVdGlsLnRlbXBsYXRlQ29udHJvbEZyYWdtZW50KFwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbC5GaWx0ZXJGaWVsZFwiLCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MsIHtcblx0XHRpc1hNTDogb1NldHRpbmdzLmlzWE1MXG5cdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdG9UaGlzLmRlc3Ryb3koKTtcblx0fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9hZGRQcm9wZXJ0eUluZm8ob1BhcmVudENvbnRyb2w6IEZpbHRlckJhciwgbVByb3BlcnR5QmFnOiBhbnksIG9NZXRhTW9kZWw6IGFueSwgc1Byb3BlcnR5SW5mb05hbWU6IHN0cmluZykge1xuXHRzUHJvcGVydHlJbmZvTmFtZSA9IHNQcm9wZXJ0eUluZm9OYW1lLnJlcGxhY2UoXCIqXCIsIFwiXCIpO1xuXHRjb25zdCBkZWxlZ2F0ZSA9IGF3YWl0IG1Qcm9wZXJ0eUJhZy5tb2RpZmllci5nZXRQcm9wZXJ0eShvUGFyZW50Q29udHJvbCwgXCJkZWxlZ2F0ZVwiKTtcblx0Y29uc3QgYVByb3BlcnR5SW5mbyA9IGF3YWl0IG1Qcm9wZXJ0eUJhZy5tb2RpZmllci5nZXRQcm9wZXJ0eShvUGFyZW50Q29udHJvbCwgXCJwcm9wZXJ0eUluZm9cIik7XG5cdGNvbnN0IGhhc1Byb3BlcnR5SW5mbyA9IGFQcm9wZXJ0eUluZm8uc29tZShmdW5jdGlvbiAocHJvcDogYW55KSB7XG5cdFx0cmV0dXJuIHByb3Aua2V5ID09PSBzUHJvcGVydHlJbmZvTmFtZSB8fCBwcm9wLm5hbWUgPT09IHNQcm9wZXJ0eUluZm9OYW1lO1xuXHR9KTtcblx0aWYgKCFoYXNQcm9wZXJ0eUluZm8pIHtcblx0XHRjb25zdCBlbnRpdHlUeXBlUGF0aCA9IGRlbGVnYXRlLnBheWxvYWQuZW50aXR5VHlwZVBhdGg7XG5cdFx0Y29uc3QgY29udmVydGVyQ29udGV4dCA9IEZpbHRlclV0aWxzLmNyZWF0ZUNvbnZlcnRlckNvbnRleHQob1BhcmVudENvbnRyb2wsIGVudGl0eVR5cGVQYXRoLCBvTWV0YU1vZGVsLCBtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50KTtcblx0XHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdFx0bGV0IGZpbHRlckZpZWxkID0gRmlsdGVyVXRpbHMuZ2V0RmlsdGVyRmllbGQoc1Byb3BlcnR5SW5mb05hbWUsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpO1xuXHRcdGZpbHRlckZpZWxkID0gRmlsdGVyVXRpbHMuYnVpbGRQcm9wZXJ5SW5mbyhmaWx0ZXJGaWVsZCwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0YVByb3BlcnR5SW5mby5wdXNoKGZpbHRlckZpZWxkKTtcblx0XHRtUHJvcGVydHlCYWcubW9kaWZpZXIuc2V0UHJvcGVydHkob1BhcmVudENvbnRyb2wsIFwicHJvcGVydHlJbmZvXCIsIGFQcm9wZXJ0eUluZm8pO1xuXHR9XG59XG5cbi8qKlxuICogTWV0aG9kIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyBmaWx0ZXIgZmllbGQgaW4gc3RhbmRhbG9uZSAvIHBlcnNvbmFsaXphdGlvbiBmaWx0ZXIgYmFyLlxuICpcbiAqIEBwYXJhbSBzUHJvcGVydHlJbmZvTmFtZSBOYW1lIG9mIHRoZSBwcm9wZXJ0eSBiZWluZyBhZGRlZCBhcyBmaWx0ZXIgZmllbGRcbiAqIEBwYXJhbSBvUGFyZW50Q29udHJvbCBQYXJlbnQgY29udHJvbCBpbnN0YW5jZSB0byB3aGljaCB0aGUgZmlsdGVyIGZpZWxkIGlzIGFkZGVkXG4gKiBAcGFyYW0gbVByb3BlcnR5QmFnIEluc3RhbmNlIG9mIHByb3BlcnR5IGJhZyBmcm9tIEZsZXggQVBJXG4gKiBAcmV0dXJucyBPbmNlIHJlc29sdmVkLCBhIGZpbHRlciBmaWVsZCBkZWZpbml0aW9uIGlzIHJldHVybmVkXG4gKi9cbk9EYXRhRmlsdGVyQmFyRGVsZWdhdGUuYWRkSXRlbSA9IGFzeW5jIGZ1bmN0aW9uIChzUHJvcGVydHlJbmZvTmFtZTogc3RyaW5nLCBvUGFyZW50Q29udHJvbDogRmlsdGVyQmFyLCBtUHJvcGVydHlCYWc6IGFueSkge1xuXHRpZiAoIW1Qcm9wZXJ0eUJhZykge1xuXHRcdC8vIEludm9rZWQgZHVyaW5nIHJ1bnRpbWUuXG5cdFx0cmV0dXJuIE9EYXRhRmlsdGVyQmFyRGVsZWdhdGUuX2FkZFAxM25JdGVtKHNQcm9wZXJ0eUluZm9OYW1lLCBvUGFyZW50Q29udHJvbCk7XG5cdH1cblxuXHRjb25zdCBvTWV0YU1vZGVsID0gbVByb3BlcnR5QmFnLmFwcENvbXBvbmVudCAmJiBtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdGlmICghb01ldGFNb2RlbCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdH1cblx0YXdhaXQgX2FkZFByb3BlcnR5SW5mbyhvUGFyZW50Q29udHJvbCwgbVByb3BlcnR5QmFnLCBvTWV0YU1vZGVsLCBzUHJvcGVydHlJbmZvTmFtZSk7XG5cdHJldHVybiBPRGF0YUZpbHRlckJhckRlbGVnYXRlLl9hZGRGbGV4SXRlbShcblx0XHRzUHJvcGVydHlJbmZvTmFtZSxcblx0XHRvUGFyZW50Q29udHJvbCxcblx0XHRvTWV0YU1vZGVsLFxuXHRcdG1Qcm9wZXJ0eUJhZy5tb2RpZmllcixcblx0XHRtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50XG5cdCk7XG59O1xuXG4vKipcbiAqIE1ldGhvZCByZXNwb25zaWJsZSBmb3IgcmVtb3ZpbmcgZmlsdGVyIGZpZWxkIGluIHN0YW5kYWxvbmUgLyBwZXJzb25hbGl6YXRpb24gZmlsdGVyIGJhci5cbiAqXG4gKiBAcGFyYW0gb0ZpbHRlckZpZWxkUHJvcGVydHkgT2JqZWN0IG9mIHRoZSBmaWx0ZXIgZmllbGQgcHJvcGVydHkgYmVpbmcgcmVtb3ZlZCBhcyBmaWx0ZXIgZmllbGRcbiAqIEBwYXJhbSBvUGFyZW50Q29udHJvbCBQYXJlbnQgY29udHJvbCBpbnN0YW5jZSBmcm9tIHdoaWNoIHRoZSBmaWx0ZXIgZmllbGQgaXMgcmVtb3ZlZFxuICogQHBhcmFtIG1Qcm9wZXJ0eUJhZyBJbnN0YW5jZSBvZiBwcm9wZXJ0eSBiYWcgZnJvbSBGbGV4IEFQSVxuICogQHJldHVybnMgVGhlIHJlc29sdmVkIHByb21pc2VcbiAqL1xuT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZS5yZW1vdmVJdGVtID0gYXN5bmMgZnVuY3Rpb24gKG9GaWx0ZXJGaWVsZFByb3BlcnR5OiBhbnksIG9QYXJlbnRDb250cm9sOiBhbnksIG1Qcm9wZXJ0eUJhZzogYW55KSB7XG5cdGxldCBkb1JlbW92ZUl0ZW0gPSB0cnVlO1xuXHRpZiAoIW9QYXJlbnRDb250cm9sLmRhdGEoXCJzYXBfZmVfRmlsdGVyQmFyRGVsZWdhdGVfcHJvcGVydHlJbmZvTWFwXCIpKSB7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG1Qcm9wZXJ0eUJhZyAmJiBtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50ICYmIG1Qcm9wZXJ0eUJhZy5hcHBDb21wb25lbnQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0XHRpZiAoIW9NZXRhTW9kZWwpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygb0ZpbHRlckZpZWxkUHJvcGVydHkgIT09IFwic3RyaW5nXCIgJiYgb0ZpbHRlckZpZWxkUHJvcGVydHkuZ2V0RmllbGRQYXRoKCkpIHtcblx0XHRcdGF3YWl0IF9hZGRQcm9wZXJ0eUluZm8ob1BhcmVudENvbnRyb2wsIG1Qcm9wZXJ0eUJhZywgb01ldGFNb2RlbCwgb0ZpbHRlckZpZWxkUHJvcGVydHkuZ2V0RmllbGRQYXRoKCkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhd2FpdCBfYWRkUHJvcGVydHlJbmZvKG9QYXJlbnRDb250cm9sLCBtUHJvcGVydHlCYWcsIG9NZXRhTW9kZWwsIG9GaWx0ZXJGaWVsZFByb3BlcnR5KTtcblx0XHR9XG5cdH1cblx0aWYgKHR5cGVvZiBvRmlsdGVyRmllbGRQcm9wZXJ0eSAhPT0gXCJzdHJpbmdcIiAmJiBvRmlsdGVyRmllbGRQcm9wZXJ0eS5pc0EgJiYgb0ZpbHRlckZpZWxkUHJvcGVydHkuaXNBKFwic2FwLnVpLm1kYy5GaWx0ZXJGaWVsZFwiKSkge1xuXHRcdGlmIChvRmlsdGVyRmllbGRQcm9wZXJ0eS5kYXRhKFwiaXNTbG90XCIpID09PSBcInRydWVcIiAmJiBtUHJvcGVydHlCYWcpIHtcblx0XHRcdC8vIEluc2VydGluZyBpbnRvIHRoZSBtb2RpZmllciBjcmVhdGVzIGEgY2hhbmdlIGZyb20gZmxleCBhbHNvIGZpbHRlciBpcyBiZWVuIHJlbW92ZWQgaGVuY2UgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBmYWxzZVxuXHRcdFx0Y29uc3Qgb01vZGlmaWVyID0gbVByb3BlcnR5QmFnLm1vZGlmaWVyO1xuXHRcdFx0b01vZGlmaWVyLmluc2VydEFnZ3JlZ2F0aW9uKG9QYXJlbnRDb250cm9sLCBcImRlcGVuZGVudHNcIiwgb0ZpbHRlckZpZWxkUHJvcGVydHkpO1xuXHRcdFx0ZG9SZW1vdmVJdGVtID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoZG9SZW1vdmVJdGVtKTtcbn07XG5cbi8qKlxuICogTWV0aG9kIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyBmaWx0ZXIgZmllbGQgY29uZGl0aW9uIGluIHN0YW5kYWxvbmUgLyBwZXJzb25hbGl6YXRpb24gZmlsdGVyIGJhci5cbiAqXG4gKiBAcGFyYW0gc1Byb3BlcnR5SW5mb05hbWUgTmFtZSBvZiB0aGUgcHJvcGVydHkgYmVpbmcgYWRkZWQgYXMgZmlsdGVyIGZpZWxkXG4gKiBAcGFyYW0gb1BhcmVudENvbnRyb2wgUGFyZW50IGNvbnRyb2wgaW5zdGFuY2UgdG8gd2hpY2ggdGhlIGZpbHRlciBmaWVsZCBpcyBhZGRlZFxuICogQHBhcmFtIG1Qcm9wZXJ0eUJhZyBJbnN0YW5jZSBvZiBwcm9wZXJ0eSBiYWcgZnJvbSBGbGV4IEFQSVxuICogQHJldHVybnMgVGhlIHJlc29sdmVkIHByb21pc2VcbiAqL1xuT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZS5hZGRDb25kaXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc1Byb3BlcnR5SW5mb05hbWU6IHN0cmluZywgb1BhcmVudENvbnRyb2w6IEZpbHRlckJhciwgbVByb3BlcnR5QmFnOiBhbnkpIHtcblx0Y29uc3Qgb01ldGFNb2RlbCA9IG1Qcm9wZXJ0eUJhZyAmJiBtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50ICYmIG1Qcm9wZXJ0eUJhZy5hcHBDb21wb25lbnQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0aWYgKCFvTWV0YU1vZGVsKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0fVxuXHRhd2FpdCBfYWRkUHJvcGVydHlJbmZvKG9QYXJlbnRDb250cm9sLCBtUHJvcGVydHlCYWcsIG9NZXRhTW9kZWwsIHNQcm9wZXJ0eUluZm9OYW1lKTtcblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcblxuLyoqXG4gKiBNZXRob2QgcmVzcG9uc2libGUgZm9yIHJlbW92aW5nIGZpbHRlciBmaWVsZCBpbiBzdGFuZGFsb25lIC8gcGVyc29uYWxpemF0aW9uIGZpbHRlciBiYXIuXG4gKlxuICogQHBhcmFtIHNQcm9wZXJ0eUluZm9OYW1lIE5hbWUgb2YgdGhlIHByb3BlcnR5IGJlaW5nIHJlbW92ZWQgYXMgZmlsdGVyIGZpZWxkXG4gKiBAcGFyYW0gb1BhcmVudENvbnRyb2wgUGFyZW50IGNvbnRyb2wgaW5zdGFuY2UgZnJvbSB3aGljaCB0aGUgZmlsdGVyIGZpZWxkIGlzIHJlbW92ZWRcbiAqIEBwYXJhbSBtUHJvcGVydHlCYWcgSW5zdGFuY2Ugb2YgcHJvcGVydHkgYmFnIGZyb20gRmxleCBBUElcbiAqIEByZXR1cm5zIFRoZSByZXNvbHZlZCBwcm9taXNlXG4gKi9cbk9EYXRhRmlsdGVyQmFyRGVsZWdhdGUucmVtb3ZlQ29uZGl0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHNQcm9wZXJ0eUluZm9OYW1lOiBzdHJpbmcsIG9QYXJlbnRDb250cm9sOiBhbnksIG1Qcm9wZXJ0eUJhZzogYW55KSB7XG5cdGlmICghb1BhcmVudENvbnRyb2wuZGF0YShcInNhcF9mZV9GaWx0ZXJCYXJEZWxlZ2F0ZV9wcm9wZXJ0eUluZm9NYXBcIikpIHtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gbVByb3BlcnR5QmFnICYmIG1Qcm9wZXJ0eUJhZy5hcHBDb21wb25lbnQgJiYgbVByb3BlcnR5QmFnLmFwcENvbXBvbmVudC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpO1xuXHRcdGlmICghb01ldGFNb2RlbCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0XHR9XG5cdFx0YXdhaXQgX2FkZFByb3BlcnR5SW5mbyhvUGFyZW50Q29udHJvbCwgbVByb3BlcnR5QmFnLCBvTWV0YU1vZGVsLCBzUHJvcGVydHlJbmZvTmFtZSk7XG5cdH1cblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcbi8qKlxuICogQ3JlYXRlcyB0aGUgZmlsdGVyIGZpZWxkIGluIHRoZSB0YWJsZSBhZGFwdGF0aW9uIG9mIHRoZSBGaWx0ZXJCYXIuXG4gKlxuICogQHBhcmFtIHNQcm9wZXJ0eUluZm9OYW1lIFRoZSBwcm9wZXJ0eSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3Igd2hpY2ggdGhlIGZpbHRlciBmaWVsZCBuZWVkcyB0byBiZSBjcmVhdGVkXG4gKiBAcGFyYW0gb1BhcmVudENvbnRyb2wgSW5zdGFuY2Ugb2YgdGhlIHBhcmVudCBjb250cm9sXG4gKiBAcmV0dXJucyBPbmNlIHJlc29sdmVkLCBhIGZpbHRlciBmaWVsZCBkZWZpbml0aW9uIGlzIHJldHVybmVkXG4gKi9cbk9EYXRhRmlsdGVyQmFyRGVsZWdhdGUuX2FkZFAxM25JdGVtID0gZnVuY3Rpb24gKHNQcm9wZXJ0eUluZm9OYW1lOiBzdHJpbmcsIG9QYXJlbnRDb250cm9sOiBvYmplY3QpIHtcblx0cmV0dXJuIERlbGVnYXRlVXRpbC5mZXRjaE1vZGVsKG9QYXJlbnRDb250cm9sKVxuXHRcdC50aGVuKGZ1bmN0aW9uIChvTW9kZWw6IGFueSkge1xuXHRcdFx0cmV0dXJuIE9EYXRhRmlsdGVyQmFyRGVsZWdhdGUuX2FkZEZsZXhJdGVtKHNQcm9wZXJ0eUluZm9OYW1lLCBvUGFyZW50Q29udHJvbCwgb01vZGVsLmdldE1ldGFNb2RlbCgpLCB1bmRlZmluZWQpO1xuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uIChvRXJyb3I6IGFueSkge1xuXHRcdFx0TG9nLmVycm9yKFwiTW9kZWwgY291bGQgbm90IGJlIHJlc29sdmVkXCIsIG9FcnJvcik7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9KTtcbn07XG5PRGF0YUZpbHRlckJhckRlbGVnYXRlLmZldGNoUHJvcGVydGllc0ZvckVudGl0eSA9IGZ1bmN0aW9uIChzRW50aXR5VHlwZVBhdGg6IGFueSwgb01ldGFNb2RlbDogYW55LCBvRmlsdGVyQ29udHJvbDogYW55KSB7XG5cdGNvbnN0IG9FbnRpdHlUeXBlID0gb01ldGFNb2RlbC5nZXRPYmplY3Qoc0VudGl0eVR5cGVQYXRoKTtcblx0Y29uc3QgaW5jbHVkZUhpZGRlbiA9IG9GaWx0ZXJDb250cm9sLmlzQShcInNhcC51aS5tZGMuZmlsdGVyYmFyLnZoLkZpbHRlckJhclwiKSA/IHRydWUgOiB1bmRlZmluZWQ7XG5cdGlmICghb0ZpbHRlckNvbnRyb2wgfHwgIW9FbnRpdHlUeXBlKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cdGNvbnN0IG9Db252ZXJ0ZXJDb250ZXh0ID0gRmlsdGVyVXRpbHMuY3JlYXRlQ29udmVydGVyQ29udGV4dChvRmlsdGVyQ29udHJvbCwgc0VudGl0eVR5cGVQYXRoKTtcblx0Y29uc3Qgc0VudGl0eVNldFBhdGggPSBNb2RlbEhlbHBlci5nZXRFbnRpdHlTZXRQYXRoKHNFbnRpdHlUeXBlUGF0aCk7XG5cblx0Y29uc3QgbUZpbHRlckZpZWxkcyA9IEZpbHRlclV0aWxzLmdldENvbnZlcnRlZEZpbHRlckZpZWxkcyhvRmlsdGVyQ29udHJvbCwgc0VudGl0eVR5cGVQYXRoLCBpbmNsdWRlSGlkZGVuKTtcblx0bGV0IGFGZXRjaGVkUHJvcGVydGllczogYW55W10gPSBbXTtcblx0bUZpbHRlckZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChvRmlsdGVyRmllbGRJbmZvOiBhbnkpIHtcblx0XHRpZiAob0ZpbHRlckZpZWxkSW5mby5hbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0Y29uc3Qgc1RhcmdldFByb3BlcnR5UHJlZml4ID0gQ29tbW9uSGVscGVyLmdldExvY2F0aW9uRm9yUHJvcGVydHlQYXRoKG9NZXRhTW9kZWwsIG9GaWx0ZXJGaWVsZEluZm8uYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5ID0gb0ZpbHRlckZpZWxkSW5mby5hbm5vdGF0aW9uUGF0aC5yZXBsYWNlKGAke3NUYXJnZXRQcm9wZXJ0eVByZWZpeH0vYCwgXCJcIik7XG5cblx0XHRcdGlmIChDb21tb25VdGlscy5pc1Byb3BlcnR5RmlsdGVyYWJsZShvTWV0YU1vZGVsLCBzVGFyZ2V0UHJvcGVydHlQcmVmaXgsIF9nZXRQcm9wZXJ0eVBhdGgoc1Byb3BlcnR5KSwgdHJ1ZSkpIHtcblx0XHRcdFx0YUZldGNoZWRQcm9wZXJ0aWVzLnB1c2gob0ZpbHRlckZpZWxkSW5mbyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vQ3VzdG9tIEZpbHRlcnNcblx0XHRcdGFGZXRjaGVkUHJvcGVydGllcy5wdXNoKG9GaWx0ZXJGaWVsZEluZm8pO1xuXHRcdH1cblx0fSk7XG5cblx0Y29uc3QgYVBhcmFtZXRlckZpZWxkczogYW55W10gPSBbXTtcblx0Y29uc3QgcHJvY2Vzc2VkRmllbGRzID0gcHJvY2Vzc1NlbGVjdGlvbkZpZWxkcyhhRmV0Y2hlZFByb3BlcnRpZXMsIG9Db252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgcHJvY2Vzc2VkRmllbGRzS2V5czogYW55W10gPSBbXTtcblx0cHJvY2Vzc2VkRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKG9Qcm9wczogYW55KSB7XG5cdFx0aWYgKG9Qcm9wcy5rZXkpIHtcblx0XHRcdHByb2Nlc3NlZEZpZWxkc0tleXMucHVzaChvUHJvcHMua2V5KTtcblx0XHR9XG5cdH0pO1xuXG5cdGFGZXRjaGVkUHJvcGVydGllcyA9IGFGZXRjaGVkUHJvcGVydGllcy5maWx0ZXIoZnVuY3Rpb24gKG9Qcm9wOiBhbnkpIHtcblx0XHRyZXR1cm4gcHJvY2Vzc2VkRmllbGRzS2V5cy5pbmNsdWRlcyhvUHJvcC5rZXkpO1xuXHR9KTtcblxuXHRjb25zdCBvRlIgPSBDb21tb25VdGlscy5nZXRGaWx0ZXJSZXN0cmljdGlvbnNCeVBhdGgoc0VudGl0eVNldFBhdGgsIG9NZXRhTW9kZWwpLFxuXHRcdG1BbGxvd2VkRXhwcmVzc2lvbnMgPSBvRlIuRmlsdGVyQWxsb3dlZEV4cHJlc3Npb25zO1xuXHRPYmplY3Qua2V5cyhwcm9jZXNzZWRGaWVsZHMpLmZvckVhY2goZnVuY3Rpb24gKHNGaWx0ZXJGaWVsZEtleTogc3RyaW5nKSB7XG5cdFx0bGV0IG9Qcm9wID0gcHJvY2Vzc2VkRmllbGRzW3NGaWx0ZXJGaWVsZEtleV07XG5cdFx0Y29uc3Qgb1NlbEZpZWxkID0gYUZldGNoZWRQcm9wZXJ0aWVzW3NGaWx0ZXJGaWVsZEtleSBhcyBhbnldO1xuXHRcdGlmICghb1NlbEZpZWxkIHx8ICFvU2VsRmllbGQuY29uZGl0aW9uUGF0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBzUHJvcGVydHlQYXRoID0gX2dldFByb3BlcnR5UGF0aChvU2VsRmllbGQuY29uZGl0aW9uUGF0aCk7XG5cdFx0Ly9mZXRjaEJhc2ljXG5cdFx0b1Byb3AgPSBPYmplY3QuYXNzaWduKG9Qcm9wLCB7XG5cdFx0XHRncm91cDogb1NlbEZpZWxkLmdyb3VwLFxuXHRcdFx0Z3JvdXBMYWJlbDogb1NlbEZpZWxkLmdyb3VwTGFiZWwsXG5cdFx0XHRwYXRoOiBvU2VsRmllbGQuY29uZGl0aW9uUGF0aCxcblx0XHRcdHRvb2x0aXA6IG51bGwsXG5cdFx0XHRyZW1vdmVGcm9tQXBwU3RhdGU6IGZhbHNlLFxuXHRcdFx0aGFzVmFsdWVIZWxwOiBmYWxzZVxuXHRcdH0pO1xuXG5cdFx0Ly9mZXRjaFByb3BJbmZvXG5cdFx0aWYgKG9TZWxGaWVsZC5hbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0Y29uc3Qgc0Fubm90YXRpb25QYXRoID0gb1NlbEZpZWxkLmFubm90YXRpb25QYXRoO1xuXHRcdFx0Y29uc3Qgb1Byb3BlcnR5ID0gb01ldGFNb2RlbC5nZXRPYmplY3Qoc0Fubm90YXRpb25QYXRoKSxcblx0XHRcdFx0b1Byb3BlcnR5QW5ub3RhdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzQW5ub3RhdGlvblBhdGh9QGApLFxuXHRcdFx0XHRvUHJvcGVydHlDb250ZXh0ID0gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzQW5ub3RhdGlvblBhdGgpO1xuXG5cdFx0XHRjb25zdCBiUmVtb3ZlRnJvbUFwcFN0YXRlID1cblx0XHRcdFx0b1Byb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLklzUG90ZW50aWFsbHlTZW5zaXRpdmVcIl0gfHxcblx0XHRcdFx0b1Byb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRXhjbHVkZUZyb21OYXZpZ2F0aW9uQ29udGV4dFwiXSB8fFxuXHRcdFx0XHRvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjEuTWVhc3VyZVwiXTtcblxuXHRcdFx0Y29uc3Qgc1RhcmdldFByb3BlcnR5UHJlZml4ID0gQ29tbW9uSGVscGVyLmdldExvY2F0aW9uRm9yUHJvcGVydHlQYXRoKG9NZXRhTW9kZWwsIG9TZWxGaWVsZC5hbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRjb25zdCBzUHJvcGVydHkgPSBzQW5ub3RhdGlvblBhdGgucmVwbGFjZShgJHtzVGFyZ2V0UHJvcGVydHlQcmVmaXh9L2AsIFwiXCIpO1xuXHRcdFx0bGV0IG9GaWx0ZXJEZWZhdWx0VmFsdWVBbm5vdGF0aW9uO1xuXHRcdFx0bGV0IG9GaWx0ZXJEZWZhdWx0VmFsdWU7XG5cdFx0XHRpZiAoQ29tbW9uVXRpbHMuaXNQcm9wZXJ0eUZpbHRlcmFibGUob01ldGFNb2RlbCwgc1RhcmdldFByb3BlcnR5UHJlZml4LCBfZ2V0UHJvcGVydHlQYXRoKHNQcm9wZXJ0eSksIHRydWUpKSB7XG5cdFx0XHRcdG9GaWx0ZXJEZWZhdWx0VmFsdWVBbm5vdGF0aW9uID0gb1Byb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckRlZmF1bHRWYWx1ZVwiXTtcblx0XHRcdFx0aWYgKG9GaWx0ZXJEZWZhdWx0VmFsdWVBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0b0ZpbHRlckRlZmF1bHRWYWx1ZSA9IG9GaWx0ZXJEZWZhdWx0VmFsdWVBbm5vdGF0aW9uW2AkJHtEZWxlZ2F0ZVV0aWwuZ2V0TW9kZWxUeXBlKG9Qcm9wZXJ0eS4kVHlwZSl9YF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvUHJvcCA9IE9iamVjdC5hc3NpZ24ob1Byb3AsIHtcblx0XHRcdFx0XHR0b29sdGlwOiBvUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUXVpY2tJbmZvXCJdIHx8IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRyZW1vdmVGcm9tQXBwU3RhdGU6IGJSZW1vdmVGcm9tQXBwU3RhdGUsXG5cdFx0XHRcdFx0aGFzVmFsdWVIZWxwOiBoYXNWYWx1ZUhlbHAob1Byb3BlcnR5Q29udGV4dC5nZXRPYmplY3QoKSwgeyBjb250ZXh0OiBvUHJvcGVydHlDb250ZXh0IH0pLFxuXHRcdFx0XHRcdGRlZmF1bHRGaWx0ZXJDb25kaXRpb25zOiBvRmlsdGVyRGVmYXVsdFZhbHVlXG5cdFx0XHRcdFx0XHQ/IFtcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaWVsZFBhdGg6IG9TZWxGaWVsZC5jb25kaXRpb25QYXRoLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0b3I6IFwiRVFcIixcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlczogW29GaWx0ZXJEZWZhdWx0VmFsdWVdXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ICBdXG5cdFx0XHRcdFx0XHQ6IHVuZGVmaW5lZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2Jhc2VcblxuXHRcdGlmIChvUHJvcCkge1xuXHRcdFx0aWYgKG1BbGxvd2VkRXhwcmVzc2lvbnNbc1Byb3BlcnR5UGF0aF0gJiYgbUFsbG93ZWRFeHByZXNzaW9uc1tzUHJvcGVydHlQYXRoXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG9Qcm9wLmZpbHRlckV4cHJlc3Npb24gPSBDb21tb25VdGlscy5nZXRTcGVjaWZpY0FsbG93ZWRFeHByZXNzaW9uKG1BbGxvd2VkRXhwcmVzc2lvbnNbc1Byb3BlcnR5UGF0aF0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b1Byb3AuZmlsdGVyRXhwcmVzc2lvbiA9IFwiYXV0b1wiO1xuXHRcdFx0fVxuXG5cdFx0XHRvUHJvcCA9IE9iamVjdC5hc3NpZ24ob1Byb3AsIHtcblx0XHRcdFx0dmlzaWJsZTogb1NlbEZpZWxkLmF2YWlsYWJpbGl0eSA9PT0gXCJEZWZhdWx0XCJcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByb2Nlc3NlZEZpZWxkc1tzRmlsdGVyRmllbGRLZXldID0gb1Byb3A7XG5cdH0pO1xuXHRwcm9jZXNzZWRGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcEluZm86IGFueSkge1xuXHRcdGlmIChwcm9wSW5mby5wYXRoID09PSBcIiRlZGl0U3RhdGVcIikge1xuXHRcdFx0cHJvcEluZm8ubGFiZWwgPSBSZXNvdXJjZU1vZGVsLmdldFRleHQoXCJGSUxURVJCQVJfRURJVElOR19TVEFUVVNcIik7XG5cdFx0fVxuXHRcdHByb3BJbmZvLnR5cGVDb25maWcgPSBUeXBlVXRpbC5nZXRUeXBlQ29uZmlnKHByb3BJbmZvLmRhdGFUeXBlLCBwcm9wSW5mby5mb3JtYXRPcHRpb25zLCBwcm9wSW5mby5jb25zdHJhaW50cyk7XG5cdFx0cHJvcEluZm8ubGFiZWwgPSBEZWxlZ2F0ZVV0aWwuZ2V0TG9jYWxpemVkVGV4dChwcm9wSW5mby5sYWJlbCwgb0ZpbHRlckNvbnRyb2wpIHx8IFwiXCI7XG5cdFx0aWYgKHByb3BJbmZvLmlzUGFyYW1ldGVyKSB7XG5cdFx0XHRhUGFyYW1ldGVyRmllbGRzLnB1c2gocHJvcEluZm8ubmFtZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRhRmV0Y2hlZFByb3BlcnRpZXMgPSBwcm9jZXNzZWRGaWVsZHM7XG5cdERlbGVnYXRlVXRpbC5zZXRDdXN0b21EYXRhKG9GaWx0ZXJDb250cm9sLCBcInBhcmFtZXRlcnNcIiwgYVBhcmFtZXRlckZpZWxkcyk7XG5cblx0cmV0dXJuIGFGZXRjaGVkUHJvcGVydGllcztcbn07XG5cbmZ1bmN0aW9uIGdldExpbmVJdGVtUXVhbGlmaWVyRnJvbVRhYmxlKG9Db250cm9sOiBhbnksIG9NZXRhTW9kZWw6IGFueSkge1xuXHRpZiAob0NvbnRyb2wuaXNBKFwic2FwLmZlLm1hY3Jvcy50YWJsZS5UYWJsZUFQSVwiKSkge1xuXHRcdGNvbnN0IGFubm90YXRpb25QYXRocyA9IG9Db250cm9sLmdldE1ldGFQYXRoKCkuc3BsaXQoXCIjXCIpWzBdLnNwbGl0KFwiL1wiKTtcblx0XHRzd2l0Y2ggKGFubm90YXRpb25QYXRoc1thbm5vdGF0aW9uUGF0aHMubGVuZ3RoIC0gMV0pIHtcblx0XHRcdGNhc2UgYEAke1VJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnR9YDpcblx0XHRcdGNhc2UgYEAke1VJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnR9YDpcblx0XHRcdFx0cmV0dXJuIG9NZXRhTW9kZWxcblx0XHRcdFx0XHQuZ2V0T2JqZWN0KG9Db250cm9sLmdldE1ldGFQYXRoKCkpXG5cdFx0XHRcdFx0LlZpc3VhbGl6YXRpb25zLmZpbmQoKHZpc3VhbGl6YXRpb246IGFueSkgPT4gdmlzdWFsaXphdGlvbi4kQW5ub3RhdGlvblBhdGguaW5jbHVkZXMoYEAke1VJQW5ub3RhdGlvblRlcm1zLkxpbmVJdGVtfWApKVxuXHRcdFx0XHRcdC4kQW5ub3RhdGlvblBhdGg7XG5cdFx0XHRjYXNlIGBAJHtVSUFubm90YXRpb25UZXJtcy5MaW5lSXRlbX1gOlxuXHRcdFx0XHRjb25zdCBtZXRhUGF0aHMgPSBvQ29udHJvbC5nZXRNZXRhUGF0aCgpLnNwbGl0KFwiL1wiKTtcblx0XHRcdFx0cmV0dXJuIG1ldGFQYXRoc1ttZXRhUGF0aHMubGVuZ3RoIC0gMV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbk9EYXRhRmlsdGVyQmFyRGVsZWdhdGUuX2FkZEZsZXhJdGVtID0gZnVuY3Rpb24gKFxuXHRzRmxleFByb3BlcnR5TmFtZTogYW55LFxuXHRvUGFyZW50Q29udHJvbDogYW55LFxuXHRvTWV0YU1vZGVsOiBhbnksXG5cdG9Nb2RpZmllcjogYW55LFxuXHRvQXBwQ29tcG9uZW50OiBhbnlcbikge1xuXHRjb25zdCBzRmlsdGVyQmFySWQgPSBvTW9kaWZpZXIgPyBvTW9kaWZpZXIuZ2V0SWQob1BhcmVudENvbnRyb2wpIDogb1BhcmVudENvbnRyb2wuZ2V0SWQoKSxcblx0XHRzSWRQcmVmaXggPSBvTW9kaWZpZXIgPyBcIlwiIDogXCJBZGFwdGF0aW9uXCIsXG5cdFx0YVNlbGVjdGlvbkZpZWxkcyA9IEZpbHRlclV0aWxzLmdldENvbnZlcnRlZEZpbHRlckZpZWxkcyhcblx0XHRcdG9QYXJlbnRDb250cm9sLFxuXHRcdFx0bnVsbCxcblx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdG9NZXRhTW9kZWwsXG5cdFx0XHRvQXBwQ29tcG9uZW50LFxuXHRcdFx0b01vZGlmaWVyLFxuXHRcdFx0b01vZGlmaWVyID8gdW5kZWZpbmVkIDogZ2V0TGluZUl0ZW1RdWFsaWZpZXJGcm9tVGFibGUob1BhcmVudENvbnRyb2wuZ2V0UGFyZW50KCksIG9NZXRhTW9kZWwpXG5cdFx0KSxcblx0XHRvU2VsZWN0aW9uRmllbGQgPSBPRGF0YUZpbHRlckJhckRlbGVnYXRlLl9maW5kU2VsZWN0aW9uRmllbGQoYVNlbGVjdGlvbkZpZWxkcywgc0ZsZXhQcm9wZXJ0eU5hbWUpLFxuXHRcdHNQcm9wZXJ0eVBhdGggPSBfZ2V0UHJvcGVydHlQYXRoKHNGbGV4UHJvcGVydHlOYW1lKSxcblx0XHRiSXNYTUwgPSAhIW9Nb2RpZmllciAmJiBvTW9kaWZpZXIudGFyZ2V0cyA9PT0gXCJ4bWxUcmVlXCI7XG5cdGlmIChzRmxleFByb3BlcnR5TmFtZSA9PT0gRURJVF9TVEFURV9QUk9QRVJUWV9OQU1FKSB7XG5cdFx0cmV0dXJuIF90ZW1wbGF0ZUVkaXRTdGF0ZShzRmlsdGVyQmFySWQsIG9NZXRhTW9kZWwsIG9Nb2RpZmllcik7XG5cdH0gZWxzZSBpZiAoc0ZsZXhQcm9wZXJ0eU5hbWUgPT09IFNFQVJDSF9QUk9QRVJUWV9OQU1FKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0fSBlbHNlIGlmIChvU2VsZWN0aW9uRmllbGQgJiYgb1NlbGVjdGlvbkZpZWxkLnRlbXBsYXRlKSB7XG5cdFx0cmV0dXJuIE9EYXRhRmlsdGVyQmFyRGVsZWdhdGUuX3RlbXBsYXRlQ3VzdG9tRmlsdGVyKFxuXHRcdFx0b1BhcmVudENvbnRyb2wsXG5cdFx0XHRfZ2VuZXJhdGVJZFByZWZpeChzRmlsdGVyQmFySWQsIGAke3NJZFByZWZpeH1GaWx0ZXJGaWVsZGApLFxuXHRcdFx0b1NlbGVjdGlvbkZpZWxkLFxuXHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdG9Nb2RpZmllclxuXHRcdCk7XG5cdH1cblxuXHRpZiAob1NlbGVjdGlvbkZpZWxkLnR5cGUgPT09IFwiU2xvdFwiICYmIG9Nb2RpZmllcikge1xuXHRcdHJldHVybiBfYWRkWE1MQ3VzdG9tRmlsdGVyRmllbGQob1BhcmVudENvbnRyb2wsIG9Nb2RpZmllciwgc1Byb3BlcnR5UGF0aCk7XG5cdH1cblxuXHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBDb21tb25IZWxwZXIuZ2V0TmF2aWdhdGlvblBhdGgoc1Byb3BlcnR5UGF0aCk7XG5cdGNvbnN0IHNBbm5vdGF0aW9uUGF0aCA9IG9TZWxlY3Rpb25GaWVsZC5hbm5vdGF0aW9uUGF0aDtcblx0bGV0IHNFbnRpdHlUeXBlUGF0aDogc3RyaW5nO1xuXHRsZXQgc1VzZVNlbWFudGljRGF0ZVJhbmdlO1xuXHRsZXQgb1NldHRpbmdzOiBhbnk7XG5cdGxldCBzQmluZGluZ1BhdGg7XG5cdGxldCBvUGFyYW1ldGVyczogYW55O1xuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChvU2VsZWN0aW9uRmllbGQuaXNQYXJhbWV0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHNBbm5vdGF0aW9uUGF0aC5zdWJzdHIoMCwgc0Fubm90YXRpb25QYXRoLmxhc3RJbmRleE9mKFwiL1wiKSArIDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9QYXJlbnRDb250cm9sLCBcImVudGl0eVR5cGVcIiwgb01vZGlmaWVyKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uIChzUmV0cmlldmVkRW50aXR5VHlwZVBhdGg6IGFueSkge1xuXHRcdFx0c0VudGl0eVR5cGVQYXRoID0gc1JldHJpZXZlZEVudGl0eVR5cGVQYXRoO1xuXHRcdFx0cmV0dXJuIERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9QYXJlbnRDb250cm9sLCBcInVzZVNlbWFudGljRGF0ZVJhbmdlXCIsIG9Nb2RpZmllcik7XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbiAoc1JldHJpZXZlZFVzZVNlbWFudGljRGF0ZVJhbmdlOiBhbnkpIHtcblx0XHRcdHNVc2VTZW1hbnRpY0RhdGVSYW5nZSA9IHNSZXRyaWV2ZWRVc2VTZW1hbnRpY0RhdGVSYW5nZTtcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eUNvbnRleHQgPSBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNFbnRpdHlUeXBlUGF0aCArIHNQcm9wZXJ0eVBhdGgpO1xuXHRcdFx0Y29uc3Qgc0luRmlsdGVyQmFySWQgPSBvTW9kaWZpZXIgPyBvTW9kaWZpZXIuZ2V0SWQob1BhcmVudENvbnRyb2wpIDogb1BhcmVudENvbnRyb2wuZ2V0SWQoKTtcblx0XHRcdG9TZXR0aW5ncyA9IHtcblx0XHRcdFx0YmluZGluZ0NvbnRleHRzOiB7XG5cdFx0XHRcdFx0XCJjb250ZXh0UGF0aFwiOiBvTWV0YU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNFbnRpdHlUeXBlUGF0aCksXG5cdFx0XHRcdFx0XCJwcm9wZXJ0eVwiOiBvUHJvcGVydHlDb250ZXh0XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGVsczoge1xuXHRcdFx0XHRcdFwiY29udGV4dFBhdGhcIjogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRcInByb3BlcnR5XCI6IG9NZXRhTW9kZWxcblx0XHRcdFx0fSxcblx0XHRcdFx0aXNYTUw6IGJJc1hNTFxuXHRcdFx0fTtcblx0XHRcdHNCaW5kaW5nUGF0aCA9IGAvJHtNb2RlbEhlbHBlci5nZXRFbnRpdHlTZXRQYXRoKHNFbnRpdHlUeXBlUGF0aClcblx0XHRcdFx0LnNwbGl0KFwiL1wiKVxuXHRcdFx0XHQuZmlsdGVyKE1vZGVsSGVscGVyLmZpbHRlck91dE5hdlByb3BCaW5kaW5nKVxuXHRcdFx0XHQuam9pbihcIi9cIil9YDtcblx0XHRcdG9QYXJhbWV0ZXJzID0ge1xuXHRcdFx0XHRzUHJvcGVydHlOYW1lOiBzUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRzQmluZGluZ1BhdGg6IHNCaW5kaW5nUGF0aCxcblx0XHRcdFx0c1ZhbHVlSGVscFR5cGU6IHNJZFByZWZpeCArIFZBTFVFX0hFTFBfVFlQRSxcblx0XHRcdFx0b0NvbnRyb2w6IG9QYXJlbnRDb250cm9sLFxuXHRcdFx0XHRvTWV0YU1vZGVsOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRvTW9kaWZpZXI6IG9Nb2RpZmllcixcblx0XHRcdFx0c0lkUHJlZml4OiBfZ2VuZXJhdGVJZFByZWZpeChzSW5GaWx0ZXJCYXJJZCwgYCR7c0lkUHJlZml4fUZpbHRlckZpZWxkYCwgc05hdmlnYXRpb25QYXRoKSxcblx0XHRcdFx0c1ZoSWRQcmVmaXg6IF9nZW5lcmF0ZUlkUHJlZml4KHNJbkZpbHRlckJhcklkLCBzSWRQcmVmaXggKyBWQUxVRV9IRUxQX1RZUEUpLFxuXHRcdFx0XHRzTmF2aWdhdGlvblByZWZpeDogc05hdmlnYXRpb25QYXRoLFxuXHRcdFx0XHRiVXNlU2VtYW50aWNEYXRlUmFuZ2U6IHNVc2VTZW1hbnRpY0RhdGVSYW5nZSxcblx0XHRcdFx0b1NldHRpbmdzOiBvU2VsZWN0aW9uRmllbGQgPyBvU2VsZWN0aW9uRmllbGQuc2V0dGluZ3MgOiB7fSxcblx0XHRcdFx0dmlzdWFsRmlsdGVyOiBvU2VsZWN0aW9uRmllbGQgPyBvU2VsZWN0aW9uRmllbGQudmlzdWFsRmlsdGVyIDogdW5kZWZpbmVkXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLmRvZXNWYWx1ZUhlbHBFeGlzdChvUGFyYW1ldGVycyk7XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbiAoYlZhbHVlSGVscEV4aXN0czogYW55KSB7XG5cdFx0XHRpZiAoIWJWYWx1ZUhlbHBFeGlzdHMpIHtcblx0XHRcdFx0cmV0dXJuIF90ZW1wbGF0ZVZhbHVlSGVscChvU2V0dGluZ3MsIG9QYXJhbWV0ZXJzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBfdGVtcGxhdGVGaWx0ZXJGaWVsZChvU2V0dGluZ3MsIG9QYXJhbWV0ZXJzKTtcblx0XHR9KTtcbn07XG5mdW5jdGlvbiBfZ2V0Q2FjaGVkUHJvcGVydGllcyhvRmlsdGVyQmFyOiBhbnkpIHtcblx0Ly8gcHJvcGVydGllcyBhcmUgbm90IGNhY2hlZCBkdXJpbmcgdGVtcGxhdGluZ1xuXHRpZiAob0ZpbHRlckJhciBpbnN0YW5jZW9mIHdpbmRvdy5FbGVtZW50KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIERlbGVnYXRlVXRpbC5nZXRDdXN0b21EYXRhKG9GaWx0ZXJCYXIsIEZFVENIRURfUFJPUEVSVElFU19EQVRBX0tFWSk7XG59XG5mdW5jdGlvbiBfc2V0Q2FjaGVkUHJvcGVydGllcyhvRmlsdGVyQmFyOiBhbnksIGFGZXRjaGVkUHJvcGVydGllczogYW55KSB7XG5cdC8vIGRvIG5vdCBjYWNoZSBkdXJpbmcgdGVtcGxhdGluZywgZWxzZSBpdCBiZWNvbWVzIHBhcnQgb2YgdGhlIGNhY2hlZCB2aWV3XG5cdGlmIChvRmlsdGVyQmFyIGluc3RhbmNlb2Ygd2luZG93LkVsZW1lbnQpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0RGVsZWdhdGVVdGlsLnNldEN1c3RvbURhdGEob0ZpbHRlckJhciwgRkVUQ0hFRF9QUk9QRVJUSUVTX0RBVEFfS0VZLCBhRmV0Y2hlZFByb3BlcnRpZXMpO1xufVxuZnVuY3Rpb24gX2dldENhY2hlZE9yRmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5KHNFbnRpdHlUeXBlUGF0aDogYW55LCBvTWV0YU1vZGVsOiBhbnksIG9GaWx0ZXJCYXI6IGFueSkge1xuXHRsZXQgYUZldGNoZWRQcm9wZXJ0aWVzID0gX2dldENhY2hlZFByb3BlcnRpZXMob0ZpbHRlckJhcik7XG5cdGxldCBsb2NhbEdyb3VwTGFiZWw7XG5cblx0aWYgKCFhRmV0Y2hlZFByb3BlcnRpZXMpIHtcblx0XHRhRmV0Y2hlZFByb3BlcnRpZXMgPSBPRGF0YUZpbHRlckJhckRlbGVnYXRlLmZldGNoUHJvcGVydGllc0ZvckVudGl0eShzRW50aXR5VHlwZVBhdGgsIG9NZXRhTW9kZWwsIG9GaWx0ZXJCYXIpO1xuXHRcdGFGZXRjaGVkUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChvR3JvdXA6IGFueSkge1xuXHRcdFx0bG9jYWxHcm91cExhYmVsID0gbnVsbDtcblx0XHRcdGlmIChvR3JvdXAuZ3JvdXBMYWJlbCkge1xuXHRcdFx0XHRsb2NhbEdyb3VwTGFiZWwgPSBEZWxlZ2F0ZVV0aWwuZ2V0TG9jYWxpemVkVGV4dChvR3JvdXAuZ3JvdXBMYWJlbCwgb0ZpbHRlckJhcik7XG5cdFx0XHRcdG9Hcm91cC5ncm91cExhYmVsID0gbG9jYWxHcm91cExhYmVsID09PSBudWxsID8gb0dyb3VwLmdyb3VwTGFiZWwgOiBsb2NhbEdyb3VwTGFiZWw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0YUZldGNoZWRQcm9wZXJ0aWVzLnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XG5cdFx0XHRpZiAoYS5ncm91cExhYmVsID09PSB1bmRlZmluZWQgfHwgYS5ncm91cExhYmVsID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHRcdGlmIChiLmdyb3VwTGFiZWwgPT09IHVuZGVmaW5lZCB8fCBiLmdyb3VwTGFiZWwgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5ncm91cExhYmVsLmxvY2FsZUNvbXBhcmUoYi5ncm91cExhYmVsKTtcblx0XHR9KTtcblx0XHRfc2V0Q2FjaGVkUHJvcGVydGllcyhvRmlsdGVyQmFyLCBhRmV0Y2hlZFByb3BlcnRpZXMpO1xuXHR9XG5cdHJldHVybiBhRmV0Y2hlZFByb3BlcnRpZXM7XG59XG5PRGF0YUZpbHRlckJhckRlbGVnYXRlLmZldGNoUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvRmlsdGVyQmFyOiBhbnkpIHtcblx0Y29uc3Qgc0VudGl0eVR5cGVQYXRoID0gRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEob0ZpbHRlckJhciwgXCJlbnRpdHlUeXBlXCIpO1xuXHRyZXR1cm4gRGVsZWdhdGVVdGlsLmZldGNoTW9kZWwob0ZpbHRlckJhcikudGhlbihmdW5jdGlvbiAob01vZGVsOiBhbnkpIHtcblx0XHRpZiAoIW9Nb2RlbCkge1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0XHRyZXR1cm4gX2dldENhY2hlZE9yRmV0Y2hQcm9wZXJ0aWVzRm9yRW50aXR5KHNFbnRpdHlUeXBlUGF0aCwgb01vZGVsLmdldE1ldGFNb2RlbCgpLCBvRmlsdGVyQmFyKTtcblx0XHQvLyB2YXIgYUNsZWFuZWRQcm9wZXJ0aWVzID0gYVByb3BlcnRpZXMuY29uY2F0KCk7XG5cdFx0Ly8gdmFyIGFBbGxvd2VkQXR0cmlidXRlcyA9IFtcIm5hbWVcIiwgXCJsYWJlbFwiLCBcInZpc2libGVcIiwgXCJwYXRoXCIsIFwidHlwZUNvbmZpZ1wiLCBcIm1heENvbmRpdGlvbnNcIiwgXCJncm91cFwiLCBcImdyb3VwTGFiZWxcIl07XG5cdFx0Ly8gYUNsZWFuZWRQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ob1Byb3BlcnR5KSB7XG5cdFx0Ly8gXHRPYmplY3Qua2V5cyhvUHJvcGVydHkpLmZvckVhY2goZnVuY3Rpb24oc1Byb3BOYW1lKSB7XG5cdFx0Ly8gXHRcdGlmIChhQWxsb3dlZEF0dHJpYnV0ZXMuaW5kZXhPZihzUHJvcE5hbWUpID09PSAtMSkge1xuXHRcdC8vIFx0XHRcdGRlbGV0ZSBvUHJvcGVydHlbc1Byb3BOYW1lXTtcblx0XHQvLyBcdFx0fVxuXHRcdC8vIFx0fSk7XG5cdFx0Ly8gfSk7XG5cdFx0Ly8gcmV0dXJuIGFDbGVhbmVkUHJvcGVydGllcztcblx0fSk7XG59O1xuT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZS5nZXRUeXBlVXRpbCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIFR5cGVVdGlsO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT0RhdGFGaWx0ZXJCYXJEZWxlZ2F0ZTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFNRyxDQUFOLEVBQVM7TUFDVixPQUFPRixPQUFPLENBQUNFLENBQUQsQ0FBZDtJQUNBOztJQUNELElBQUlELE1BQU0sSUFBSUEsTUFBTSxDQUFDRSxJQUFyQixFQUEyQjtNQUMxQixPQUFPRixNQUFNLENBQUNFLElBQVAsQ0FBWSxLQUFLLENBQWpCLEVBQW9CSCxPQUFwQixDQUFQO0lBQ0E7O0lBQ0QsT0FBT0MsTUFBUDtFQUNBOzs7Ozs7TUFwWGNHLGdCLGFBQWlCQyxjLEVBQTJCQyxZLEVBQW1CQyxVLEVBQWlCQyxpQjtRQUEyQjtNQUN6SEEsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDQyxPQUFsQixDQUEwQixHQUExQixFQUErQixFQUEvQixDQUFwQjtNQUR5SCx1QkFFbEdILFlBQVksQ0FBQ0ksUUFBYixDQUFzQkMsV0FBdEIsQ0FBa0NOLGNBQWxDLEVBQWtELFVBQWxELENBRmtHLGlCQUVuSE8sUUFGbUg7UUFBQSx1QkFHN0ZOLFlBQVksQ0FBQ0ksUUFBYixDQUFzQkMsV0FBdEIsQ0FBa0NOLGNBQWxDLEVBQWtELGNBQWxELENBSDZGLGlCQUduSFEsYUFIbUg7VUFJekgsSUFBTUMsZUFBZSxHQUFHRCxhQUFhLENBQUNFLElBQWQsQ0FBbUIsVUFBVUMsSUFBVixFQUFxQjtZQUMvRCxPQUFPQSxJQUFJLENBQUNDLEdBQUwsS0FBYVQsaUJBQWIsSUFBa0NRLElBQUksQ0FBQ0UsSUFBTCxLQUFj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