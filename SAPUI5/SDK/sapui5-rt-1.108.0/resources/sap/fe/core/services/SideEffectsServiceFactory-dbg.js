/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/converters/MetaModelConverter", "sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory"], function (Log, MetaModelConverter, Service, ServiceFactory) {
  "use strict";

  var _exports = {};
  var convertTypes = MetaModelConverter.convertTypes;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var SideEffectsService = /*#__PURE__*/function (_Service) {
    _inheritsLoose(SideEffectsService, _Service);

    function SideEffectsService() {
      return _Service.apply(this, arguments) || this;
    }

    _exports.SideEffectsService = SideEffectsService;
    var _proto = SideEffectsService.prototype;

    // !: means that we know it will be assigned before usage
    _proto.init = function init() {
      this._oSideEffectsType = {
        oData: {
          entities: {},
          actions: {}
        },
        control: {}
      };
      this._bInitialized = false;
      this.initPromise = Promise.resolve(this);
    }
    /**
     * Adds a SideEffects control
     * SideEffects definition is added by a control to keep data up to date
     * These SideEffects get limited scope compared with SideEffects coming from an OData service:
     * - Only one SideEffects definition can be defined for the combination entity type - control Id
     * - Only SideEffects source properties are recognized and used to trigger SideEffects
     *
     * Ensure the sourceControlId matches the associated SAPUI5 control ID.
     *
     * @private
     * @ui5-restricted
     * @param sEntityType Name of the entity type
     * @param oSideEffect SideEffects definition
     */
    ;

    _proto.addControlSideEffects = function addControlSideEffects(sEntityType, oSideEffect) {
      if (oSideEffect.sourceControlId) {
        var oControlSideEffect = _objectSpread(_objectSpread({}, oSideEffect), {}, {
          fullyQualifiedName: "".concat(sEntityType, "/SideEffectsForControl/").concat(oSideEffect.sourceControlId)
        });

        var mEntityControlSideEffects = this._oSideEffectsType.control[sEntityType] || {};
        mEntityControlSideEffects[oControlSideEffect.sourceControlId] = oControlSideEffect;
        this._oSideEffectsType.control[sEntityType] = mEntityControlSideEffects;
      }
    }
    /**
     * Executes SideEffects action.
     *
     * @private
     * @ui5-restricted
     * @param sTriggerAction Name of the action
     * @param oContext Context
     * @param sGroupId The group ID to be used for the request
     * @returns A promise that is resolved without data or with a return value context when the action call succeeded
     */
    ;

    _proto.executeAction = function executeAction(sTriggerAction, oContext, sGroupId) {
      var oTriggerAction = oContext.getModel().bindContext("".concat(sTriggerAction, "(...)"), oContext);
      return oTriggerAction.execute(sGroupId || oContext.getBinding().getUpdateGroupId());
    }
    /**
     * Gets converted OData metaModel.
     *
     * @private
     * @ui5-restricted
     * @returns Converted OData metaModel
     */
    ;

    _proto.getConvertedMetaModel = function getConvertedMetaModel() {
      var oContext = this.getContext();
      var oComponent = oContext.scopeObject;
      var oMetaModel = oComponent.getModel().getMetaModel();
      return convertTypes(oMetaModel, this._oCapabilities);
    }
    /**
     * Gets the entity type of a context.
     *
     * @function
     * @name getEntityTypeFromContext
     * @param oContext Context
     * @returns Entity Type
     */
    ;

    _proto.getEntityTypeFromContext = function getEntityTypeFromContext(oContext) {
      var oMetaModel = oContext.getModel().getMetaModel(),
          sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
          sEntityType = oMetaModel.getObject(sMetaPath)["$Type"];
      return sEntityType;
    }
    /**
     * Gets the SideEffects that come from an OData service.
     *
     * @private
     * @ui5-restricted
     * @param sEntityTypeName Name of the entity type
     * @returns SideEffects dictionary
     */
    ;

    _proto.getODataEntitySideEffects = function getODataEntitySideEffects(sEntityTypeName) {
      return this._oSideEffectsType.oData.entities[sEntityTypeName] || {};
    }
    /**
     * Gets the global SideEffects that come from an OData service.
     *
     * @private
     * @ui5-restricted
     * @param sEntityTypeName Name of the entity type
     * @returns Global SideEffects
     */
    ;

    _proto.getGlobalODataEntitySideEffects = function getGlobalODataEntitySideEffects(sEntityTypeName) {
      var mEntitySideEffects = this.getODataEntitySideEffects(sEntityTypeName);
      var aGlobalSideEffects = [];

      for (var key in mEntitySideEffects) {
        var oEntitySideEffects = mEntitySideEffects[key];

        if (!oEntitySideEffects.SourceEntities && !oEntitySideEffects.SourceProperties) {
          aGlobalSideEffects.push(oEntitySideEffects);
        }
      }

      return aGlobalSideEffects;
    }
    /**
     * Gets the SideEffects that come from an OData service.
     *
     * @private
     * @ui5-restricted
     * @param sActionName Name of the action
     * @param oContext Context
     * @returns SideEffects definition
     */
    ;

    _proto.getODataActionSideEffects = function getODataActionSideEffects(sActionName, oContext) {
      if (oContext) {
        var sEntityType = this.getEntityTypeFromContext(oContext);

        if (sEntityType) {
          var _this$_oSideEffectsTy;

          return (_this$_oSideEffectsTy = this._oSideEffectsType.oData.actions[sEntityType]) === null || _this$_oSideEffectsTy === void 0 ? void 0 : _this$_oSideEffectsTy[sActionName];
        }
      }

      return undefined;
    }
    /**
     * Generates the dictionary for the SideEffects.
     *
     * @private
     * @ui5-restricted
     * @param oCapabilities The current capabilities
     */
    ;

    _proto.initializeSideEffects = function initializeSideEffects(oCapabilities) {
      var _this = this;

      this._oCapabilities = oCapabilities;

      if (!this._bInitialized) {
        var oConvertedMetaModel = this.getConvertedMetaModel();
        oConvertedMetaModel.entityTypes.forEach(function (entityType) {
          _this._oSideEffectsType.oData.entities[entityType.fullyQualifiedName] = _this._retrieveODataEntitySideEffects(entityType);
          _this._oSideEffectsType.oData.actions[entityType.fullyQualifiedName] = _this._retrieveODataActionsSideEffects(entityType); // only bound actions are analyzed since unbound ones don't get SideEffects
        });
        this._bInitialized = true;
      }
    }
    /**
     * Removes all SideEffects related to a control.
     *
     * @private
     * @ui5-restricted
     * @param sControlId Control Id
     */
    ;

    _proto.removeControlSideEffects = function removeControlSideEffects(sControlId) {
      var _this2 = this;

      Object.keys(this._oSideEffectsType.control).forEach(function (sEntityType) {
        if (_this2._oSideEffectsType.control[sEntityType][sControlId]) {
          delete _this2._oSideEffectsType.control[sEntityType][sControlId];
        }
      });
    }
    /**
     * Request SideEffects on a specific context.
     *
     * @function
     * @name requestSideEffects
     * @param aPathExpressions Targets of SideEffects to be executed
     * @param oContext Context where SideEffects need to be executed
     * @param sGroupId The group ID to be used for the request
     * @returns Promise on SideEffects request
     */
    ;

    _proto.requestSideEffects = function requestSideEffects(aPathExpressions, oContext, sGroupId) {
      this._logRequest(aPathExpressions, oContext);

      var oPromise;
      /**
       * Context.requestSideEffects either returns a promise or throws a new error. This return is caught if an error is thrown
       * to avoid breaking the promise chain.
       */

      try {
        oPromise = oContext.requestSideEffects(aPathExpressions, sGroupId);
      } catch (e) {
        oPromise = Promise.reject(e);
      }

      return oPromise;
    };

    _proto.requestSideEffectsForODataAction = function requestSideEffectsForODataAction(sideEffects, oContext) {
      var _sideEffects$triggerA,
          _this3 = this,
          _sideEffects$pathExpr;

      var aPromises;

      if ((_sideEffects$triggerA = sideEffects.triggerActions) !== null && _sideEffects$triggerA !== void 0 && _sideEffects$triggerA.length) {
        aPromises = sideEffects.triggerActions.map(function (sTriggerActionName) {
          return _this3.executeAction(sTriggerActionName, oContext);
        });
      } else {
        aPromises = [];
      }

      if ((_sideEffects$pathExpr = sideEffects.pathExpressions) !== null && _sideEffects$pathExpr !== void 0 && _sideEffects$pathExpr.length) {
        aPromises.push(this.requestSideEffects(sideEffects.pathExpressions, oContext));
      }

      return aPromises.length ? Promise.all(aPromises) : Promise.resolve();
    }
    /**
     * Request SideEffects for a navigation property on a specific context.
     *
     * @function
     * @name requestSideEffectsForNavigationProperty
     * @param sNavigationProperty Navigation property
     * @param oContext Context where SideEffects need to be executed
     * @returns SideEffects request on SAPUI5 context
     */
    ;

    _proto.requestSideEffectsForNavigationProperty = function requestSideEffectsForNavigationProperty(sNavigationProperty, oContext) {
      var _this4 = this;

      var sBaseEntityType = this.getEntityTypeFromContext(oContext);

      if (sBaseEntityType) {
        var sNavigationPath = "".concat(sNavigationProperty, "/");
        var aSideEffects = this.getODataEntitySideEffects(sBaseEntityType);
        var aTargets = [];
        Object.keys(aSideEffects).filter( // Keep relevant SideEffects
        function (sAnnotationName) {
          var oSideEffects = aSideEffects[sAnnotationName];
          return (oSideEffects.SourceProperties || []).some(function (oPropertyPath) {
            var sPropertyPath = oPropertyPath.value;
            return sPropertyPath.startsWith(sNavigationPath) && sPropertyPath.replace(sNavigationPath, "").indexOf("/") === -1;
          }) || (oSideEffects.SourceEntities || []).some(function (oNavigationPropertyPath) {
            return oNavigationPropertyPath.value === sNavigationProperty;
          });
        }).forEach(function (sAnnotationName) {
          var oSideEffects = aSideEffects[sAnnotationName];

          if (oSideEffects.TriggerAction) {
            _this4.executeAction(oSideEffects.TriggerAction, oContext);
          }

          (oSideEffects.TargetEntities || []).concat(oSideEffects.TargetProperties || []).forEach(function (mTarget) {
            return aTargets.push(mTarget);
          });
        }); // Remove duplicate properties

        aTargets = this._removeDuplicateTargets(aTargets);

        if (aTargets.length > 0) {
          return this.requestSideEffects(aTargets, oContext).catch(function (oError) {
            return Log.error("SideEffects - Error while processing SideEffects for Navigation Property ".concat(sNavigationProperty), oError);
          });
        }
      }

      return Promise.resolve();
    }
    /**
     * Gets the SideEffects that come from controls.
     *
     * @private
     * @ui5-restricted
     * @param sEntityTypeName Entity type Name
     * @returns SideEffects dictionary
     */
    ;

    _proto.getControlEntitySideEffects = function getControlEntitySideEffects(sEntityTypeName) {
      return this._oSideEffectsType.control[sEntityTypeName] || {};
    }
    /**
     * Adds the text properties required for SideEffects
     * If a property has an associated text then this text needs to be added as targetProperties or targetEntities.
     *
     * @private
     * @ui5-restricted
     * @param oSideEffect SideEffects definition
     * @param mEntityType Entity type
     * @returns SideEffects definition with added text properties
     */
    ;

    _proto._addRequiredTextProperties = function _addRequiredTextProperties(oSideEffect, mEntityType) {
      var aInitialProperties = oSideEffect.TargetProperties || [],
          aEntitiesRequested = (oSideEffect.TargetEntities || []).map(function (navigation) {
        return navigation.$NavigationPropertyPath;
      });
      var aDerivedProperties = [];
      aInitialProperties.forEach(function (sPropertyPath) {
        var bIsStarProperty = sPropertyPath.endsWith("*"),
            // Can be '*' or '.../navProp/*'
        sNavigationPropertyPath = sPropertyPath.substring(0, sPropertyPath.lastIndexOf("/")),
            sRelativePath = sNavigationPropertyPath ? "".concat(sNavigationPropertyPath, "/") : "",
            mTarget = mEntityType.resolvePath(sNavigationPropertyPath) || mEntityType;

        if (mTarget) {
          var _targetType;

          // mTarget can be an entity type, navigationProperty or or a complexType
          var aTargetEntityProperties = mTarget.entityProperties || ((_targetType = mTarget.targetType) === null || _targetType === void 0 ? void 0 : _targetType.properties) || mTarget.targetType.entityProperties;

          if (aTargetEntityProperties) {
            if (bIsStarProperty) {
              // Add all required properties behind the *
              aEntitiesRequested.push(sNavigationPropertyPath);
              aDerivedProperties = aDerivedProperties.concat(aTargetEntityProperties.map(function (mProperty) {
                return {
                  navigationPath: sRelativePath,
                  property: mProperty
                };
              }));
            } else {
              aDerivedProperties.push({
                property: aTargetEntityProperties.find(function (mProperty) {
                  return mProperty.name === sPropertyPath.split("/").pop();
                }),
                navigationPath: sRelativePath
              });
            }
          } else {
            Log.info("SideEffects - The entity type associated to property path ".concat(sPropertyPath, " cannot be resolved"));
          }
        } else {
          Log.info("SideEffects - The property path ".concat(sPropertyPath, " cannot be resolved"));
        }
      });
      aDerivedProperties.forEach(function (mPropertyInfo) {
        if (mPropertyInfo.property) {
          var _mPropertyInfo$proper, _mPropertyInfo$proper2, _mPropertyInfo$proper3;

          var sTargetTextPath = (_mPropertyInfo$proper = mPropertyInfo.property.annotations) === null || _mPropertyInfo$proper === void 0 ? void 0 : (_mPropertyInfo$proper2 = _mPropertyInfo$proper.Common) === null || _mPropertyInfo$proper2 === void 0 ? void 0 : (_mPropertyInfo$proper3 = _mPropertyInfo$proper2.Text) === null || _mPropertyInfo$proper3 === void 0 ? void 0 : _mPropertyInfo$proper3.path,
              sTextPathFromInitialEntity = mPropertyInfo.navigationPath + sTargetTextPath,
              sTargetCollectionPath = sTextPathFromInitialEntity.substring(0, sTextPathFromInitialEntity.lastIndexOf("/"));
          /**
           * The property Text must be added only if the property is
           * - not part of a star property (.i.e '*' or 'navigation/*') or a targeted Entity
           * - not include into the initial targeted properties of SideEffects
           *  Indeed in the two listed cases, the property containing text will be/is requested by initial SideEffects configuration.
           */

          if (sTargetTextPath && aEntitiesRequested.indexOf(sTargetCollectionPath) === -1 && aInitialProperties.indexOf(sTextPathFromInitialEntity) === -1) {
            var _mEntityType$resolveP;

            // The Text association is added as TargetEntities if it's contained on a different entitySet and not a complexType
            // Otherwise it's added as targetProperties
            if (sTargetTextPath.lastIndexOf("/") > -1 && ((_mEntityType$resolveP = mEntityType.resolvePath(sTargetCollectionPath)) === null || _mEntityType$resolveP === void 0 ? void 0 : _mEntityType$resolveP._type) === "NavigationProperty") {
              oSideEffect.TargetEntities.push({
                $NavigationPropertyPath: sTargetCollectionPath
              });
              aEntitiesRequested.push(sTargetCollectionPath);
            } else {
              oSideEffect.TargetProperties.push(sTextPathFromInitialEntity);
            }
          }
        }
      });
      return oSideEffect;
    }
    /**
     * Converts SideEffects to expected format
     *  - Converts SideEffects targets to expected format
     *  - Removes binding parameter from SideEffects targets properties
     *  - Adds the text properties
     *  - Replaces TargetProperties having reference to Source Properties for a SideEffects.
     *
     * @private
     * @ui5-restricted
     * @param oSideEffects SideEffects definition
     * @param mEntityType Entity type
     * @param sBindingParameter Name of the binding parameter
     * @returns SideEffects definition
     */
    ;

    _proto._convertSideEffects = function _convertSideEffects(oSideEffects, mEntityType, sBindingParameter) {
      var oTempSideEffects = this._removeBindingParameter(this._convertTargetsFormat(oSideEffects), sBindingParameter);

      return this._addRequiredTextProperties(oTempSideEffects, mEntityType);
    }
    /**
     * Converts SideEffects targets (TargetEntities and TargetProperties) to expected format
     *  - TargetProperties as array of string
     *  - TargetEntities as array of object with property $NavigationPropertyPath.
     *
     * @private
     * @ui5-restricted
     * @param oSideEffects SideEffects definition
     * @returns Converted SideEffects
     */
    ;

    _proto._convertTargetsFormat = function _convertTargetsFormat(oSideEffects) {
      var TargetProperties = (oSideEffects.TargetProperties || []).reduce(function (aTargetProperties, vTarget) {
        var sTarget = typeof vTarget === "string" && vTarget || vTarget.type === "PropertyPath" && vTarget.value;

        if (sTarget) {
          aTargetProperties.push(sTarget);
        } else {
          Log.error("SideEffects - Error while processing TargetProperties for SideEffects".concat(oSideEffects.fullyQualifiedName));
        }

        return aTargetProperties;
      }, []),
          TargetEntities = (oSideEffects.TargetEntities || []).map(function (mTargetEntity) {
        /**
         *  SideEffects that comes from SAP FE get TargetEntities with $NavigationPropertyPath whereas
         *  ones coming from the converted OData model gets a NavigationPropertyPath format
         *
         */
        return {
          "$NavigationPropertyPath": mTargetEntity.$NavigationPropertyPath || mTargetEntity.value || ""
        };
      });
      return _objectSpread(_objectSpread({}, oSideEffects), {
        TargetProperties: TargetProperties,
        TargetEntities: TargetEntities
      });
    }
    /**
     * Gets SideEffects related to an entity type or action that come from an OData Service
     * Internal routine to get, from converted oData metaModel, SideEffects related to a specific entity type or action
     * and to convert these SideEffects with expected format.
     *
     * @private
     * @ui5-restricted
     * @param oSource Entity type or action
     * @returns Array of SideEffects
     */
    ;

    _proto._getSideEffectsFromSource = function _getSideEffectsFromSource(oSource) {
      var _this5 = this;

      var aSideEffects = [];
      var authorizedTypes = ["EntityType", "Action"];

      if (oSource._type && authorizedTypes.indexOf(oSource._type) > -1) {
        var mEntityType = oSource._type === "EntityType" ? oSource : oSource.sourceEntityType;

        if (mEntityType) {
          var _oSource$annotations;

          var mCommonAnnotation = ((_oSource$annotations = oSource.annotations) === null || _oSource$annotations === void 0 ? void 0 : _oSource$annotations.Common) || {};
          var mBindingParameter = (oSource.parameters || []).find(function (mParameter) {
            return mParameter.type === mEntityType.fullyQualifiedName;
          });
          var sBindingParameter = mBindingParameter ? mBindingParameter.fullyQualifiedName.split("/")[1] : "";
          Object.keys(mCommonAnnotation).filter(function (sAnnotationName) {
            return mCommonAnnotation[sAnnotationName].$Type === "com.sap.vocabularies.Common.v1.SideEffectsType";
          }).forEach(function (sAnnotationName) {
            aSideEffects.push(_this5._convertSideEffects(mCommonAnnotation[sAnnotationName], mEntityType, sBindingParameter));
          });
        }
      }

      return aSideEffects;
    }
    /**
     * Logs SideEffects request.
     *
     * @private
     * @ui5-restricted
     * @param aPathExpressions SideEffects targets
     * @param oContext Context
     */
    ;

    _proto._logRequest = function _logRequest(aPathExpressions, oContext) {
      var sTargetPaths = aPathExpressions.reduce(function (sPaths, mTarget) {
        return "".concat(sPaths, "\n\t\t").concat(mTarget.$NavigationPropertyPath || mTarget || "");
      }, "");
      Log.debug("SideEffects - Request:\n\tContext path : ".concat(oContext.getPath(), "\n\tProperty paths :").concat(sTargetPaths));
    }
    /**
     * Removes name of binding parameter on SideEffects targets.
     *
     * @private
     * @ui5-restricted
     * @param oSideEffects SideEffects definition
     * @param sBindingParameterName Name of binding parameter
     * @returns SideEffects definition
     */
    ;

    _proto._removeBindingParameter = function _removeBindingParameter(oSideEffects, sBindingParameterName) {
      if (sBindingParameterName) {
        var aTargets = ["TargetProperties", "TargetEntities"];
        aTargets.forEach(function (sTarget) {
          var mTarget = oSideEffects[sTarget];

          if (mTarget) {
            mTarget = mTarget.map(function (mProperty) {
              var bNavigationPropertyPath = mProperty.$NavigationPropertyPath !== undefined; // Need to test with undefined since  mProperty.$NavigationPropertyPath could be "" (empty string)

              var sValue = (bNavigationPropertyPath ? mProperty.$NavigationPropertyPath : mProperty).replace(new RegExp("^".concat(sBindingParameterName, "/?")), "");
              return bNavigationPropertyPath ? {
                $NavigationPropertyPath: sValue
              } : sValue;
            });
          }

          oSideEffects[sTarget] = mTarget;
        });
      }

      return oSideEffects;
    }
    /**
     * Remove duplicates in SideEffects targets.
     *
     * @private
     * @ui5-restricted
     * @param aTargets SideEffects targets
     * @returns SideEffects targets without duplicates
     */
    ;

    _proto._removeDuplicateTargets = function _removeDuplicateTargets(aTargets) {
      return aTargets.filter(function (mTarget, iIndex, aInTargets) {
        return aInTargets.findIndex(function (mSearchTarget) {
          return mSearchTarget === mTarget || // PropertyPath
          mTarget.$NavigationPropertyPath && mSearchTarget.$NavigationPropertyPath === mTarget.$NavigationPropertyPath // NavigationPropertyPath
          ;
        }) === iIndex;
      });
    }
    /**
     * Gets SideEffects action type that come from an OData Service
     * Internal routine to get, from converted oData metaModel, SideEffects on actions
     * related to a specific entity type and to convert these SideEffects with
     * expected format.
     *
     * @private
     * @ui5-restricted
     * @param mEntityType Entity type
     * @returns Entity type SideEffects dictionary
     */
    ;

    _proto._retrieveODataActionsSideEffects = function _retrieveODataActionsSideEffects(mEntityType) {
      var _this6 = this;

      var oSideEffects = {};
      var aActions = mEntityType.actions;

      if (aActions) {
        Object.keys(aActions).forEach(function (sActionName) {
          var oAction = mEntityType.actions[sActionName];
          var triggerActions = [];
          var pathExpressions = [];
          var aTargets = [];

          _this6._getSideEffectsFromSource(oAction).forEach(function (oSideEffect) {
            var sTriggerAction = oSideEffect.TriggerAction;
            aTargets = aTargets.concat(oSideEffect.TargetEntities || []).concat(oSideEffect.TargetProperties || []);

            if (sTriggerAction && triggerActions.indexOf(sTriggerAction) === -1) {
              triggerActions.push(sTriggerAction);
            }
          });

          pathExpressions = _this6._removeDuplicateTargets(aTargets);
          oSideEffects[sActionName] = {
            pathExpressions: pathExpressions,
            triggerActions: triggerActions
          };
        });
      }

      return oSideEffects;
    }
    /**
     * Gets SideEffects entity type that come from an OData Service
     * Internal routine to get, from converted oData metaModel, SideEffects
     * related to a specific entity type and to convert these SideEffects with
     * expected format.
     *
     * @private
     * @ui5-restricted
     * @param mEntityType Entity type
     * @returns Entity type SideEffects dictionary
     */
    ;

    _proto._retrieveODataEntitySideEffects = function _retrieveODataEntitySideEffects(mEntityType) {
      var oEntitySideEffects = {};

      this._getSideEffectsFromSource(mEntityType).forEach(function (oSideEffects) {
        oEntitySideEffects[oSideEffects.fullyQualifiedName] = oSideEffects;
      });

      return oEntitySideEffects;
    };

    _proto.getInterface = function getInterface() {
      return this;
    };

    return SideEffectsService;
  }(Service);

  _exports.SideEffectsService = SideEffectsService;

  var SideEffectsServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inheritsLoose(SideEffectsServiceFactory, _ServiceFactory);

    function SideEffectsServiceFactory() {
      return _ServiceFactory.apply(this, arguments) || this;
    }

    var _proto2 = SideEffectsServiceFactory.prototype;

    _proto2.createInstance = function createInstance(oServiceContext) {
      var SideEffectsServiceService = new SideEffectsService(oServiceContext);
      return SideEffectsServiceService.initPromise;
    };

    return SideEffectsServiceFactory;
  }(ServiceFactory);

  return SideEffectsServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTaWRlRWZmZWN0c1NlcnZpY2UiLCJpbml0IiwiX29TaWRlRWZmZWN0c1R5cGUiLCJvRGF0YSIsImVudGl0aWVzIiwiYWN0aW9ucyIsImNvbnRyb2wiLCJfYkluaXRpYWxpemVkIiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsImFkZENvbnRyb2xTaWRlRWZmZWN0cyIsInNFbnRpdHlUeXBlIiwib1NpZGVFZmZlY3QiLCJzb3VyY2VDb250cm9sSWQiLCJvQ29udHJvbFNpZGVFZmZlY3QiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJtRW50aXR5Q29udHJvbFNpZGVFZmZlY3RzIiwiZXhlY3V0ZUFjdGlvbiIsInNUcmlnZ2VyQWN0aW9uIiwib0NvbnRleHQiLCJzR3JvdXBJZCIsIm9UcmlnZ2VyQWN0aW9uIiwiZ2V0TW9kZWwiLCJiaW5kQ29udGV4dCIsImV4ZWN1dGUiLCJnZXRCaW5kaW5nIiwiZ2V0VXBkYXRlR3JvdXBJZCIsImdldENvbnZlcnRlZE1ldGFNb2RlbCIsImdldENvbnRleHQiLCJvQ29tcG9uZW50Iiwic2NvcGVPYmplY3QiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwiY29udmVydFR5cGVzIiwiX29DYXBhYmlsaXRpZXMiLCJnZXRFbnRpdHlUeXBlRnJvbUNvbnRleHQiLCJzTWV0YVBhdGgiLCJnZXRNZXRhUGF0aCIsImdldFBhdGgiLCJnZXRPYmplY3QiLCJnZXRPRGF0YUVudGl0eVNpZGVFZmZlY3RzIiwic0VudGl0eVR5cGVOYW1lIiwiZ2V0R2xvYmFsT0RhdGFFbnRpdHlTaWRlRWZmZWN0cyIsIm1FbnRpdHlTaWRlRWZmZWN0cyIsImFHbG9iYWxTaWRlRWZmZWN0cyIsImtleSIsIm9FbnRpdHlTaWRlRWZmZWN0cyIsIlNvdXJjZUVudGl0aWVzIiwiU291cmNlUHJvcGVydGllcyIsInB1c2giLCJnZXRPRGF0YUFjdGlvblNpZGVFZmZlY3RzIiwic0FjdGlvbk5hbWUiLCJ1bmRlZmluZWQiLCJpbml0aWFsaXplU2lkZUVmZmVjdHMiLCJvQ2FwYWJpbGl0aWVzIiwib0NvbnZlcnRlZE1ldGFNb2RlbCIsImVudGl0eVR5cGVzIiwiZm9yRWFjaCIsImVudGl0eVR5cGUiLCJfcmV0cmlldmVPRGF0YUVudGl0eVNpZGVFZmZlY3RzIiwiX3JldHJpZXZlT0RhdGFBY3Rpb25zU2lkZUVmZmVjdHMiLCJyZW1vdmVDb250cm9sU2lkZUVmZmVjdHMiLCJzQ29udHJvbElkIiwiT2JqZWN0Iiwia2V5cyIsInJlcXVlc3RTaWRlRWZmZWN0cyIsImFQYXRoRXhwcmVzc2lvbnMiLCJfbG9nUmVxdWVzdCIsIm9Qcm9taXNlIiwiZSIsInJlamVjdCIsInJlcXVlc3RTaWRlRWZmZWN0c0Zvck9EYXRhQWN0aW9uIiwic2lkZUVmZmVjdHMiLCJhUHJvbWlzZXMiLCJ0cmlnZ2VyQWN0aW9ucyIsImxlbmd0aCIsIm1hcCIsInNUcmlnZ2VyQWN0aW9uTmFtZSIsInBhdGhFeHByZXNzaW9ucyIsImFsbCIsInJlcXVlc3RTaWRlRWZmZWN0c0Zvck5hdmlnYXRpb25Qcm9wZXJ0eSIsInNOYXZpZ2F0aW9uUHJvcGVydHkiLCJzQmFzZUVudGl0eVR5cGUiLCJzTmF2aWdhdGlvblBhdGgiLCJhU2lkZUVmZmVjdHMiLCJhVGFyZ2V0cyIsImZpbHRlciIsInNBbm5vdGF0aW9uTmFtZSIsIm9TaWRlRWZmZWN0cyIsInNvbWUiLCJvUHJvcGVydHlQYXRoIiwic1Byb3BlcnR5UGF0aCIsInZhbHVlIiwic3RhcnRzV2l0aCIsInJlcGxhY2UiLCJpbmRleE9mIiwib05hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJUcmlnZ2VyQWN0aW9uIiwiVGFyZ2V0RW50aXRpZXMiLCJjb25jYXQiLCJUYXJnZXRQcm9wZXJ0aWVzIiwibVRhcmdldCIsIl9yZW1vdmVEdXBsaWNhdGVUYXJnZXRzIiwiY2F0Y2giLCJvRXJyb3IiLCJMb2ciLCJlcnJvciIsImdldENvbnRyb2xFbnRpdHlTaWRlRWZmZWN0cyIsIl9hZGRSZXF1aXJlZFRleHRQcm9wZXJ0aWVzIiwibUVudGl0eVR5cGUiLCJhSW5pdGlhbFByb3BlcnRpZXMiLCJhRW50aXRpZXNSZXF1ZXN0ZWQiLCJuYXZpZ2F0aW9uIiwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJhRGVyaXZlZFByb3BlcnRpZXMiLCJiSXNTdGFyUHJvcGVydHkiLCJlbmRzV2l0aCIsInNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzUmVsYXRpdmVQYXRoIiwicmVzb2x2ZVBhdGgiLCJhVGFyZ2V0RW50aXR5UHJvcGVydGllcyIsImVudGl0eVByb3BlcnRpZXMiLCJ0YXJnZXRUeXBlIiwicHJvcGVydGllcyIsIm1Qcm9wZXJ0eSIsIm5hdmlnYXRpb25QYXRoIiwicHJvcGVydHkiLCJmaW5kIiwibmFtZSIsInNwbGl0IiwicG9wIiwiaW5mbyIsIm1Qcm9wZXJ0eUluZm8iLCJzVGFyZ2V0VGV4dFBhdGgiLCJhbm5vdGF0aW9ucyIsIkNvbW1vbiIsIlRleHQiLCJwYXRoIiwic1RleHRQYXRoRnJvbUluaXRpYWxFbnRpdHkiLCJzVGFyZ2V0Q29sbGVjdGlvblBhdGgiLCJfdHlwZSIsIl9jb252ZXJ0U2lkZUVmZmVjdHMiLCJzQmluZGluZ1BhcmFtZXRlciIsIm9UZW1wU2lkZUVmZmVjdHMiLCJfcmVtb3ZlQmluZGluZ1BhcmFtZXRlciIsIl9jb252ZXJ0VGFyZ2V0c0Zvcm1hdCIsInJlZHVjZSIsImFUYXJnZXRQcm9wZXJ0aWVzIiwidlRhcmdldCIsInNUYXJnZXQiLCJ0eXBlIiwibVRhcmdldEVudGl0eSIsIl9nZXRTaWRlRWZmZWN0c0Zyb21Tb3VyY2UiLCJvU291cmNlIiwiYXV0aG9yaXplZFR5cGVzIiwic291cmNlRW50aXR5VHlwZSIsIm1Db21tb25Bbm5vdGF0aW9uIiwibUJpbmRpbmdQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJzIiwibVBhcmFtZXRlciIsIiRUeXBlIiwic1RhcmdldFBhdGhzIiwic1BhdGhzIiwiZGVidWciLCJzQmluZGluZ1BhcmFtZXRlck5hbWUiLCJiTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsInNWYWx1ZSIsIlJlZ0V4cCIsImlJbmRleCIsImFJblRhcmdldHMiLCJmaW5kSW5kZXgiLCJtU2VhcmNoVGFyZ2V0IiwiYUFjdGlvbnMiLCJvQWN0aW9uIiwiZ2V0SW50ZXJmYWNlIiwiU2VydmljZSIsIlNpZGVFZmZlY3RzU2VydmljZUZhY3RvcnkiLCJjcmVhdGVJbnN0YW5jZSIsIm9TZXJ2aWNlQ29udGV4dCIsIlNpZGVFZmZlY3RzU2VydmljZVNlcnZpY2UiLCJTZXJ2aWNlRmFjdG9yeSJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2lkZUVmZmVjdHNTZXJ2aWNlRmFjdG9yeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG5cdEFjdGlvbixcblx0Q29tcGxleFR5cGUsXG5cdENvbnZlcnRlZE1ldGFkYXRhLFxuXHRFbnRpdHlUeXBlLFxuXHROYXZpZ2F0aW9uUHJvcGVydHksXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFByb3BlcnR5LFxuXHRQcm9wZXJ0eVBhdGhcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFF1YWxpZmllZE5hbWUgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdm9jYWJ1bGFyaWVzL0NvbW1vblwiO1xuaW1wb3J0IHsgQ29tbW9uQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3ZvY2FidWxhcmllcy9Db21tb25cIjtcbmltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgeyBFbnZpcm9ubWVudENhcGFiaWxpdGllcyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHsgY29udmVydFR5cGVzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5pbXBvcnQgU2VydmljZSBmcm9tIFwic2FwL3VpL2NvcmUvc2VydmljZS9TZXJ2aWNlXCI7XG5pbXBvcnQgU2VydmljZUZhY3RvcnkgZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2UvU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCB0eXBlIENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgdHlwZSBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgdHlwZSB7IFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInR5cGVzL2V4dGVuc2lvbl90eXBlc1wiO1xuXG50eXBlIFNpZGVFZmZlY3RzU2V0dGluZ3MgPSB7fTtcblxuZXhwb3J0IHR5cGUgU2lkZUVmZmVjdHNUYXJnZXRFbnRpdHlUeXBlID0ge1xuXHQkTmF2aWdhdGlvblByb3BlcnR5UGF0aDogc3RyaW5nO1xuXHQkUHJvcGVydHlQYXRoPzogc3RyaW5nO1xufTtcbnR5cGUgU2lkZUVmZmVjdHNUYXJnZXQgPSBTaWRlRWZmZWN0c1RhcmdldEVudGl0eVR5cGUgfCBzdHJpbmc7XG5cbnR5cGUgU2lkZUVmZmVjdHNUYXJnZXRUeXBlID0ge1xuXHRUYXJnZXRQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcblx0VGFyZ2V0RW50aXRpZXM6IFNpZGVFZmZlY3RzVGFyZ2V0RW50aXR5VHlwZVtdO1xufTtcblxudHlwZSBCYXNlQW5ub3RhdGlvblNpZGVFZmZlY3RzVHlwZSA9IHtcblx0VGFyZ2V0UHJvcGVydGllczogc3RyaW5nW107XG5cdFRhcmdldEVudGl0aWVzOiBOYXZpZ2F0aW9uUHJvcGVydHlQYXRoW107XG5cdGZ1bGx5UXVhbGlmaWVkTmFtZTogc3RyaW5nO1xufTtcblxudHlwZSBCYXNlU2lkZUVmZmVjdHNUeXBlID0ge1xuXHRmdWxseVF1YWxpZmllZE5hbWU6IHN0cmluZztcbn0gJiBTaWRlRWZmZWN0c1RhcmdldFR5cGU7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblNpZGVFZmZlY3RzVHlwZSA9IHtcblx0cGF0aEV4cHJlc3Npb25zOiBTaWRlRWZmZWN0c1RhcmdldFtdO1xuXHR0cmlnZ2VyQWN0aW9ucz86IFF1YWxpZmllZE5hbWVbXTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRyb2xTaWRlRWZmZWN0c1R5cGUgPSBQYXJ0aWFsPEJhc2VTaWRlRWZmZWN0c1R5cGU+ICYge1xuXHRmdWxseVF1YWxpZmllZE5hbWU6IHN0cmluZztcblx0U291cmNlUHJvcGVydGllczogc3RyaW5nW107XG5cdHNvdXJjZUNvbnRyb2xJZDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgT0RhdGFTaWRlRWZmZWN0c1R5cGUgPSBCYXNlU2lkZUVmZmVjdHNUeXBlICYge1xuXHRTb3VyY2VQcm9wZXJ0aWVzPzogUHJvcGVydHlQYXRoW107XG5cdFNvdXJjZUVudGl0aWVzPzogTmF2aWdhdGlvblByb3BlcnR5UGF0aFtdO1xuXHRUcmlnZ2VyQWN0aW9uPzogUXVhbGlmaWVkTmFtZTtcbn07XG5cbmV4cG9ydCB0eXBlIFNpZGVFZmZlY3RzVHlwZSA9IENvbnRyb2xTaWRlRWZmZWN0c1R5cGUgfCBPRGF0YVNpZGVFZmZlY3RzVHlwZTtcblxuZXhwb3J0IHR5cGUgT0RhdGFTaWRlRWZmZWN0c0VudGl0eURpY3Rpb25hcnkgPSBSZWNvcmQ8c3RyaW5nLCBPRGF0YVNpZGVFZmZlY3RzVHlwZT47XG5leHBvcnQgdHlwZSBPRGF0YVNpZGVFZmZlY3RzQWN0aW9uRGljdGlvbmFyeSA9IFJlY29yZDxzdHJpbmcsIEFjdGlvblNpZGVFZmZlY3RzVHlwZT47XG5leHBvcnQgdHlwZSBDb250cm9sU2lkZUVmZmVjdHNFbnRpdHlEaWN0aW9uYXJ5ID0gUmVjb3JkPHN0cmluZywgQ29udHJvbFNpZGVFZmZlY3RzVHlwZT47XG5cbnR5cGUgU2lkZUVmZmVjdHNPcmlnaW5SZWdpc3RyeSA9IHtcblx0b0RhdGE6IHtcblx0XHRlbnRpdGllczoge1xuXHRcdFx0W2VudGl0eTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgT0RhdGFTaWRlRWZmZWN0c1R5cGU+O1xuXHRcdH07XG5cdFx0YWN0aW9uczoge1xuXHRcdFx0W2VudGl0eTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgQWN0aW9uU2lkZUVmZmVjdHNUeXBlPjtcblx0XHR9O1xuXHR9O1xuXHRjb250cm9sOiB7XG5cdFx0W2VudGl0eTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgQ29udHJvbFNpZGVFZmZlY3RzVHlwZT47XG5cdH07XG59O1xuXG50eXBlIEV4dHJhY3RvclByb3BlcnR5SW5mbyA9IHtcblx0cHJvcGVydHk6IFByb3BlcnR5O1xuXHRuYXZpZ2F0aW9uUGF0aD86IHN0cmluZztcbn07XG5cbmV4cG9ydCBjbGFzcyBTaWRlRWZmZWN0c1NlcnZpY2UgZXh0ZW5kcyBTZXJ2aWNlPFNpZGVFZmZlY3RzU2V0dGluZ3M+IHtcblx0aW5pdFByb21pc2UhOiBQcm9taXNlPGFueT47XG5cdF9vU2lkZUVmZmVjdHNUeXBlITogU2lkZUVmZmVjdHNPcmlnaW5SZWdpc3RyeTtcblx0X29DYXBhYmlsaXRpZXMhOiBFbnZpcm9ubWVudENhcGFiaWxpdGllcyB8IHVuZGVmaW5lZDtcblx0X2JJbml0aWFsaXplZCE6IGJvb2xlYW47XG5cdC8vICE6IG1lYW5zIHRoYXQgd2Uga25vdyBpdCB3aWxsIGJlIGFzc2lnbmVkIGJlZm9yZSB1c2FnZVxuXHRpbml0KCkge1xuXHRcdHRoaXMuX29TaWRlRWZmZWN0c1R5cGUgPSB7XG5cdFx0XHRvRGF0YToge1xuXHRcdFx0XHRlbnRpdGllczoge30sXG5cdFx0XHRcdGFjdGlvbnM6IHt9XG5cdFx0XHR9LFxuXHRcdFx0Y29udHJvbDoge31cblx0XHR9O1xuXHRcdHRoaXMuX2JJbml0aWFsaXplZCA9IGZhbHNlO1xuXHRcdHRoaXMuaW5pdFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodGhpcyk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhIFNpZGVFZmZlY3RzIGNvbnRyb2xcblx0ICogU2lkZUVmZmVjdHMgZGVmaW5pdGlvbiBpcyBhZGRlZCBieSBhIGNvbnRyb2wgdG8ga2VlcCBkYXRhIHVwIHRvIGRhdGVcblx0ICogVGhlc2UgU2lkZUVmZmVjdHMgZ2V0IGxpbWl0ZWQgc2NvcGUgY29tcGFyZWQgd2l0aCBTaWRlRWZmZWN0cyBjb21pbmcgZnJvbSBhbiBPRGF0YSBzZXJ2aWNlOlxuXHQgKiAtIE9ubHkgb25lIFNpZGVFZmZlY3RzIGRlZmluaXRpb24gY2FuIGJlIGRlZmluZWQgZm9yIHRoZSBjb21iaW5hdGlvbiBlbnRpdHkgdHlwZSAtIGNvbnRyb2wgSWRcblx0ICogLSBPbmx5IFNpZGVFZmZlY3RzIHNvdXJjZSBwcm9wZXJ0aWVzIGFyZSByZWNvZ25pemVkIGFuZCB1c2VkIHRvIHRyaWdnZXIgU2lkZUVmZmVjdHNcblx0ICpcblx0ICogRW5zdXJlIHRoZSBzb3VyY2VDb250cm9sSWQgbWF0Y2hlcyB0aGUgYXNzb2NpYXRlZCBTQVBVSTUgY29udHJvbCBJRC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBzRW50aXR5VHlwZSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuXHQgKiBAcGFyYW0gb1NpZGVFZmZlY3QgU2lkZUVmZmVjdHMgZGVmaW5pdGlvblxuXHQgKi9cblx0cHVibGljIGFkZENvbnRyb2xTaWRlRWZmZWN0cyhzRW50aXR5VHlwZTogc3RyaW5nLCBvU2lkZUVmZmVjdDogT21pdDxDb250cm9sU2lkZUVmZmVjdHNUeXBlLCBcImZ1bGx5UXVhbGlmaWVkTmFtZVwiPik6IHZvaWQge1xuXHRcdGlmIChvU2lkZUVmZmVjdC5zb3VyY2VDb250cm9sSWQpIHtcblx0XHRcdGNvbnN0IG9Db250cm9sU2lkZUVmZmVjdDogQ29udHJvbFNpZGVFZmZlY3RzVHlwZSA9IHtcblx0XHRcdFx0Li4ub1NpZGVFZmZlY3QsXG5cdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7c0VudGl0eVR5cGV9L1NpZGVFZmZlY3RzRm9yQ29udHJvbC8ke29TaWRlRWZmZWN0LnNvdXJjZUNvbnRyb2xJZH1gXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgbUVudGl0eUNvbnRyb2xTaWRlRWZmZWN0cyA9IHRoaXMuX29TaWRlRWZmZWN0c1R5cGUuY29udHJvbFtzRW50aXR5VHlwZV0gfHwge307XG5cdFx0XHRtRW50aXR5Q29udHJvbFNpZGVFZmZlY3RzW29Db250cm9sU2lkZUVmZmVjdC5zb3VyY2VDb250cm9sSWRdID0gb0NvbnRyb2xTaWRlRWZmZWN0O1xuXHRcdFx0dGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5jb250cm9sW3NFbnRpdHlUeXBlXSA9IG1FbnRpdHlDb250cm9sU2lkZUVmZmVjdHM7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIFNpZGVFZmZlY3RzIGFjdGlvbi5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBzVHJpZ2dlckFjdGlvbiBOYW1lIG9mIHRoZSBhY3Rpb25cblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHRcblx0ICogQHBhcmFtIHNHcm91cElkIFRoZSBncm91cCBJRCB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRob3V0IGRhdGEgb3Igd2l0aCBhIHJldHVybiB2YWx1ZSBjb250ZXh0IHdoZW4gdGhlIGFjdGlvbiBjYWxsIHN1Y2NlZWRlZFxuXHQgKi9cblx0cHVibGljIGV4ZWN1dGVBY3Rpb24oc1RyaWdnZXJBY3Rpb246IHN0cmluZywgb0NvbnRleHQ6IENvbnRleHQsIHNHcm91cElkPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBvVHJpZ2dlckFjdGlvbjogYW55ID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5iaW5kQ29udGV4dChgJHtzVHJpZ2dlckFjdGlvbn0oLi4uKWAsIG9Db250ZXh0KTtcblx0XHRyZXR1cm4gb1RyaWdnZXJBY3Rpb24uZXhlY3V0ZShzR3JvdXBJZCB8fCAob0NvbnRleHQgYXMgYW55KS5nZXRCaW5kaW5nKCkuZ2V0VXBkYXRlR3JvdXBJZCgpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGNvbnZlcnRlZCBPRGF0YSBtZXRhTW9kZWwuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyBDb252ZXJ0ZWQgT0RhdGEgbWV0YU1vZGVsXG5cdCAqL1xuXHRwdWJsaWMgZ2V0Q29udmVydGVkTWV0YU1vZGVsKCk6IENvbnZlcnRlZE1ldGFkYXRhIHtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdGNvbnN0IG9Db21wb25lbnQgPSBvQ29udGV4dC5zY29wZU9iamVjdCBhcyBhbnk7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwgPSBvQ29tcG9uZW50LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0cmV0dXJuIGNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsLCB0aGlzLl9vQ2FwYWJpbGl0aWVzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBlbnRpdHkgdHlwZSBvZiBhIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBnZXRFbnRpdHlUeXBlRnJvbUNvbnRleHRcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHRcblx0ICogQHJldHVybnMgRW50aXR5IFR5cGVcblx0ICovXG5cdHB1YmxpYyBnZXRFbnRpdHlUeXBlRnJvbUNvbnRleHQob0NvbnRleHQ6IENvbnRleHQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0c01ldGFQYXRoID0gKG9NZXRhTW9kZWwgYXMgYW55KS5nZXRNZXRhUGF0aChvQ29udGV4dC5nZXRQYXRoKCkpLFxuXHRcdFx0c0VudGl0eVR5cGUgPSBvTWV0YU1vZGVsLmdldE9iamVjdChzTWV0YVBhdGgpW1wiJFR5cGVcIl07XG5cdFx0cmV0dXJuIHNFbnRpdHlUeXBlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIFNpZGVFZmZlY3RzIHRoYXQgY29tZSBmcm9tIGFuIE9EYXRhIHNlcnZpY2UuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gc0VudGl0eVR5cGVOYW1lIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG5cdCAqIEByZXR1cm5zIFNpZGVFZmZlY3RzIGRpY3Rpb25hcnlcblx0ICovXG5cdHB1YmxpYyBnZXRPRGF0YUVudGl0eVNpZGVFZmZlY3RzKHNFbnRpdHlUeXBlTmFtZTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgT0RhdGFTaWRlRWZmZWN0c1R5cGU+IHtcblx0XHRyZXR1cm4gdGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5vRGF0YS5lbnRpdGllc1tzRW50aXR5VHlwZU5hbWVdIHx8IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGdsb2JhbCBTaWRlRWZmZWN0cyB0aGF0IGNvbWUgZnJvbSBhbiBPRGF0YSBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHNFbnRpdHlUeXBlTmFtZSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuXHQgKiBAcmV0dXJucyBHbG9iYWwgU2lkZUVmZmVjdHNcblx0ICovXG5cdHB1YmxpYyBnZXRHbG9iYWxPRGF0YUVudGl0eVNpZGVFZmZlY3RzKHNFbnRpdHlUeXBlTmFtZTogc3RyaW5nKTogT0RhdGFTaWRlRWZmZWN0c1R5cGVbXSB7XG5cdFx0Y29uc3QgbUVudGl0eVNpZGVFZmZlY3RzID0gdGhpcy5nZXRPRGF0YUVudGl0eVNpZGVFZmZlY3RzKHNFbnRpdHlUeXBlTmFtZSk7XG5cdFx0Y29uc3QgYUdsb2JhbFNpZGVFZmZlY3RzOiBPRGF0YVNpZGVFZmZlY3RzVHlwZVtdID0gW107XG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gbUVudGl0eVNpZGVFZmZlY3RzKSB7XG5cdFx0XHRjb25zdCBvRW50aXR5U2lkZUVmZmVjdHMgPSBtRW50aXR5U2lkZUVmZmVjdHNba2V5XTtcblx0XHRcdGlmICghb0VudGl0eVNpZGVFZmZlY3RzLlNvdXJjZUVudGl0aWVzICYmICFvRW50aXR5U2lkZUVmZmVjdHMuU291cmNlUHJvcGVydGllcykge1xuXHRcdFx0XHRhR2xvYmFsU2lkZUVmZmVjdHMucHVzaChvRW50aXR5U2lkZUVmZmVjdHMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYUdsb2JhbFNpZGVFZmZlY3RzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIFNpZGVFZmZlY3RzIHRoYXQgY29tZSBmcm9tIGFuIE9EYXRhIHNlcnZpY2UuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gc0FjdGlvbk5hbWUgTmFtZSBvZiB0aGUgYWN0aW9uXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0XG5cdCAqIEByZXR1cm5zIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICovXG5cdHB1YmxpYyBnZXRPRGF0YUFjdGlvblNpZGVFZmZlY3RzKHNBY3Rpb25OYW1lOiBzdHJpbmcsIG9Db250ZXh0PzogQ29udGV4dCk6IEFjdGlvblNpZGVFZmZlY3RzVHlwZSB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKG9Db250ZXh0KSB7XG5cdFx0XHRjb25zdCBzRW50aXR5VHlwZSA9IHRoaXMuZ2V0RW50aXR5VHlwZUZyb21Db250ZXh0KG9Db250ZXh0KTtcblx0XHRcdGlmIChzRW50aXR5VHlwZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5vRGF0YS5hY3Rpb25zW3NFbnRpdHlUeXBlXT8uW3NBY3Rpb25OYW1lXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgdGhlIGRpY3Rpb25hcnkgZm9yIHRoZSBTaWRlRWZmZWN0cy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBvQ2FwYWJpbGl0aWVzIFRoZSBjdXJyZW50IGNhcGFiaWxpdGllc1xuXHQgKi9cblx0cHVibGljIGluaXRpYWxpemVTaWRlRWZmZWN0cyhvQ2FwYWJpbGl0aWVzPzogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpOiB2b2lkIHtcblx0XHR0aGlzLl9vQ2FwYWJpbGl0aWVzID0gb0NhcGFiaWxpdGllcztcblx0XHRpZiAoIXRoaXMuX2JJbml0aWFsaXplZCkge1xuXHRcdFx0Y29uc3Qgb0NvbnZlcnRlZE1ldGFNb2RlbCA9IHRoaXMuZ2V0Q29udmVydGVkTWV0YU1vZGVsKCk7XG5cdFx0XHRvQ29udmVydGVkTWV0YU1vZGVsLmVudGl0eVR5cGVzLmZvckVhY2goKGVudGl0eVR5cGUpID0+IHtcblx0XHRcdFx0dGhpcy5fb1NpZGVFZmZlY3RzVHlwZS5vRGF0YS5lbnRpdGllc1tlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSB0aGlzLl9yZXRyaWV2ZU9EYXRhRW50aXR5U2lkZUVmZmVjdHMoZW50aXR5VHlwZSk7XG5cdFx0XHRcdHRoaXMuX29TaWRlRWZmZWN0c1R5cGUub0RhdGEuYWN0aW9uc1tlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSB0aGlzLl9yZXRyaWV2ZU9EYXRhQWN0aW9uc1NpZGVFZmZlY3RzKGVudGl0eVR5cGUpOyAvLyBvbmx5IGJvdW5kIGFjdGlvbnMgYXJlIGFuYWx5emVkIHNpbmNlIHVuYm91bmQgb25lcyBkb24ndCBnZXQgU2lkZUVmZmVjdHNcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fYkluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgU2lkZUVmZmVjdHMgcmVsYXRlZCB0byBhIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gc0NvbnRyb2xJZCBDb250cm9sIElkXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlQ29udHJvbFNpZGVFZmZlY3RzKHNDb250cm9sSWQ6IHN0cmluZyk6IHZvaWQge1xuXHRcdE9iamVjdC5rZXlzKHRoaXMuX29TaWRlRWZmZWN0c1R5cGUuY29udHJvbCkuZm9yRWFjaCgoc0VudGl0eVR5cGUpID0+IHtcblx0XHRcdGlmICh0aGlzLl9vU2lkZUVmZmVjdHNUeXBlLmNvbnRyb2xbc0VudGl0eVR5cGVdW3NDb250cm9sSWRdKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9vU2lkZUVmZmVjdHNUeXBlLmNvbnRyb2xbc0VudGl0eVR5cGVdW3NDb250cm9sSWRdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcXVlc3QgU2lkZUVmZmVjdHMgb24gYSBzcGVjaWZpYyBjb250ZXh0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgcmVxdWVzdFNpZGVFZmZlY3RzXG5cdCAqIEBwYXJhbSBhUGF0aEV4cHJlc3Npb25zIFRhcmdldHMgb2YgU2lkZUVmZmVjdHMgdG8gYmUgZXhlY3V0ZWRcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHQgd2hlcmUgU2lkZUVmZmVjdHMgbmVlZCB0byBiZSBleGVjdXRlZFxuXHQgKiBAcGFyYW0gc0dyb3VwSWQgVGhlIGdyb3VwIElEIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG5cdCAqIEByZXR1cm5zIFByb21pc2Ugb24gU2lkZUVmZmVjdHMgcmVxdWVzdFxuXHQgKi9cblx0cHVibGljIHJlcXVlc3RTaWRlRWZmZWN0cyhhUGF0aEV4cHJlc3Npb25zOiBTaWRlRWZmZWN0c1RhcmdldFtdLCBvQ29udGV4dDogQ29udGV4dCwgc0dyb3VwSWQ/OiBzdHJpbmcgfCB1bmRlZmluZWQpOiBQcm9taXNlPGFueT4ge1xuXHRcdHRoaXMuX2xvZ1JlcXVlc3QoYVBhdGhFeHByZXNzaW9ucywgb0NvbnRleHQpO1xuXHRcdGxldCBvUHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuXHRcdC8qKlxuXHRcdCAqIENvbnRleHQucmVxdWVzdFNpZGVFZmZlY3RzIGVpdGhlciByZXR1cm5zIGEgcHJvbWlzZSBvciB0aHJvd3MgYSBuZXcgZXJyb3IuIFRoaXMgcmV0dXJuIGlzIGNhdWdodCBpZiBhbiBlcnJvciBpcyB0aHJvd25cblx0XHQgKiB0byBhdm9pZCBicmVha2luZyB0aGUgcHJvbWlzZSBjaGFpbi5cblx0XHQgKi9cblx0XHR0cnkge1xuXHRcdFx0b1Byb21pc2UgPSAob0NvbnRleHQgYXMgYW55KS5yZXF1ZXN0U2lkZUVmZmVjdHMoYVBhdGhFeHByZXNzaW9ucywgc0dyb3VwSWQpIGFzIFByb21pc2U8YW55Pjtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRvUHJvbWlzZSA9IFByb21pc2UucmVqZWN0KGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gb1Byb21pc2U7XG5cdH1cblxuXHRwdWJsaWMgcmVxdWVzdFNpZGVFZmZlY3RzRm9yT0RhdGFBY3Rpb24oc2lkZUVmZmVjdHM6IEFjdGlvblNpZGVFZmZlY3RzVHlwZSwgb0NvbnRleHQ6IENvbnRleHQpOiBQcm9taXNlPGFueT4ge1xuXHRcdGxldCBhUHJvbWlzZXM6IFByb21pc2U8YW55PltdO1xuXG5cdFx0aWYgKHNpZGVFZmZlY3RzLnRyaWdnZXJBY3Rpb25zPy5sZW5ndGgpIHtcblx0XHRcdGFQcm9taXNlcyA9IHNpZGVFZmZlY3RzLnRyaWdnZXJBY3Rpb25zLm1hcCgoc1RyaWdnZXJBY3Rpb25OYW1lOiBTdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZXhlY3V0ZUFjdGlvbihzVHJpZ2dlckFjdGlvbk5hbWUgYXMgc3RyaW5nLCBvQ29udGV4dCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YVByb21pc2VzID0gW107XG5cdFx0fVxuXG5cdFx0aWYgKHNpZGVFZmZlY3RzLnBhdGhFeHByZXNzaW9ucz8ubGVuZ3RoKSB7XG5cdFx0XHRhUHJvbWlzZXMucHVzaCh0aGlzLnJlcXVlc3RTaWRlRWZmZWN0cyhzaWRlRWZmZWN0cy5wYXRoRXhwcmVzc2lvbnMsIG9Db250ZXh0KSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFQcm9taXNlcy5sZW5ndGggPyBQcm9taXNlLmFsbChhUHJvbWlzZXMpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVxdWVzdCBTaWRlRWZmZWN0cyBmb3IgYSBuYXZpZ2F0aW9uIHByb3BlcnR5IG9uIGEgc3BlY2lmaWMgY29udGV4dC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHJlcXVlc3RTaWRlRWZmZWN0c0Zvck5hdmlnYXRpb25Qcm9wZXJ0eVxuXHQgKiBAcGFyYW0gc05hdmlnYXRpb25Qcm9wZXJ0eSBOYXZpZ2F0aW9uIHByb3BlcnR5XG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IHdoZXJlIFNpZGVFZmZlY3RzIG5lZWQgdG8gYmUgZXhlY3V0ZWRcblx0ICogQHJldHVybnMgU2lkZUVmZmVjdHMgcmVxdWVzdCBvbiBTQVBVSTUgY29udGV4dFxuXHQgKi9cblx0cHVibGljIHJlcXVlc3RTaWRlRWZmZWN0c0Zvck5hdmlnYXRpb25Qcm9wZXJ0eShzTmF2aWdhdGlvblByb3BlcnR5OiBzdHJpbmcsIG9Db250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBzQmFzZUVudGl0eVR5cGUgPSB0aGlzLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQ29udGV4dCk7XG5cdFx0aWYgKHNCYXNlRW50aXR5VHlwZSkge1xuXHRcdFx0Y29uc3Qgc05hdmlnYXRpb25QYXRoID0gYCR7c05hdmlnYXRpb25Qcm9wZXJ0eX0vYDtcblx0XHRcdGNvbnN0IGFTaWRlRWZmZWN0cyA9IHRoaXMuZ2V0T0RhdGFFbnRpdHlTaWRlRWZmZWN0cyhzQmFzZUVudGl0eVR5cGUpO1xuXHRcdFx0bGV0IGFUYXJnZXRzOiBTaWRlRWZmZWN0c1RhcmdldFtdID0gW107XG5cdFx0XHRPYmplY3Qua2V5cyhhU2lkZUVmZmVjdHMpXG5cdFx0XHRcdC5maWx0ZXIoXG5cdFx0XHRcdFx0Ly8gS2VlcCByZWxldmFudCBTaWRlRWZmZWN0c1xuXHRcdFx0XHRcdChzQW5ub3RhdGlvbk5hbWUpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0czogT0RhdGFTaWRlRWZmZWN0c1R5cGUgPSBhU2lkZUVmZmVjdHNbc0Fubm90YXRpb25OYW1lXTtcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdChvU2lkZUVmZmVjdHMuU291cmNlUHJvcGVydGllcyB8fCBbXSkuc29tZSgob1Byb3BlcnR5UGF0aCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNQcm9wZXJ0eVBhdGggPSBvUHJvcGVydHlQYXRoLnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRzUHJvcGVydHlQYXRoLnN0YXJ0c1dpdGgoc05hdmlnYXRpb25QYXRoKSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0c1Byb3BlcnR5UGF0aC5yZXBsYWNlKHNOYXZpZ2F0aW9uUGF0aCwgXCJcIikuaW5kZXhPZihcIi9cIikgPT09IC0xXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fSkgfHxcblx0XHRcdFx0XHRcdFx0KG9TaWRlRWZmZWN0cy5Tb3VyY2VFbnRpdGllcyB8fCBbXSkuc29tZShcblx0XHRcdFx0XHRcdFx0XHQob05hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpID0+IG9OYXZpZ2F0aW9uUHJvcGVydHlQYXRoLnZhbHVlID09PSBzTmF2aWdhdGlvblByb3BlcnR5XG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRcdC5mb3JFYWNoKChzQW5ub3RhdGlvbk5hbWUpID0+IHtcblx0XHRcdFx0XHRjb25zdCBvU2lkZUVmZmVjdHM6IE9EYXRhU2lkZUVmZmVjdHNUeXBlID0gYVNpZGVFZmZlY3RzW3NBbm5vdGF0aW9uTmFtZV07XG5cdFx0XHRcdFx0aWYgKG9TaWRlRWZmZWN0cy5UcmlnZ2VyQWN0aW9uKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmV4ZWN1dGVBY3Rpb24ob1NpZGVFZmZlY3RzLlRyaWdnZXJBY3Rpb24gYXMgc3RyaW5nLCBvQ29udGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCgob1NpZGVFZmZlY3RzLlRhcmdldEVudGl0aWVzIGFzIGFueVtdKSB8fCBbXSlcblx0XHRcdFx0XHRcdC5jb25jYXQoKG9TaWRlRWZmZWN0cy5UYXJnZXRQcm9wZXJ0aWVzIGFzIGFueVtdKSB8fCBbXSlcblx0XHRcdFx0XHRcdC5mb3JFYWNoKChtVGFyZ2V0KSA9PiBhVGFyZ2V0cy5wdXNoKG1UYXJnZXQpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlIHByb3BlcnRpZXNcblx0XHRcdGFUYXJnZXRzID0gdGhpcy5fcmVtb3ZlRHVwbGljYXRlVGFyZ2V0cyhhVGFyZ2V0cyk7XG5cdFx0XHRpZiAoYVRhcmdldHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0U2lkZUVmZmVjdHMoYVRhcmdldHMsIG9Db250ZXh0KS5jYXRjaCgob0Vycm9yKSA9PlxuXHRcdFx0XHRcdExvZy5lcnJvcihgU2lkZUVmZmVjdHMgLSBFcnJvciB3aGlsZSBwcm9jZXNzaW5nIFNpZGVFZmZlY3RzIGZvciBOYXZpZ2F0aW9uIFByb3BlcnR5ICR7c05hdmlnYXRpb25Qcm9wZXJ0eX1gLCBvRXJyb3IpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBTaWRlRWZmZWN0cyB0aGF0IGNvbWUgZnJvbSBjb250cm9scy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBzRW50aXR5VHlwZU5hbWUgRW50aXR5IHR5cGUgTmFtZVxuXHQgKiBAcmV0dXJucyBTaWRlRWZmZWN0cyBkaWN0aW9uYXJ5XG5cdCAqL1xuXHRwdWJsaWMgZ2V0Q29udHJvbEVudGl0eVNpZGVFZmZlY3RzKHNFbnRpdHlUeXBlTmFtZTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgQ29udHJvbFNpZGVFZmZlY3RzVHlwZT4ge1xuXHRcdHJldHVybiB0aGlzLl9vU2lkZUVmZmVjdHNUeXBlLmNvbnRyb2xbc0VudGl0eVR5cGVOYW1lXSB8fCB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHRoZSB0ZXh0IHByb3BlcnRpZXMgcmVxdWlyZWQgZm9yIFNpZGVFZmZlY3RzXG5cdCAqIElmIGEgcHJvcGVydHkgaGFzIGFuIGFzc29jaWF0ZWQgdGV4dCB0aGVuIHRoaXMgdGV4dCBuZWVkcyB0byBiZSBhZGRlZCBhcyB0YXJnZXRQcm9wZXJ0aWVzIG9yIHRhcmdldEVudGl0aWVzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIG9TaWRlRWZmZWN0IFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICogQHBhcmFtIG1FbnRpdHlUeXBlIEVudGl0eSB0eXBlXG5cdCAqIEByZXR1cm5zIFNpZGVFZmZlY3RzIGRlZmluaXRpb24gd2l0aCBhZGRlZCB0ZXh0IHByb3BlcnRpZXNcblx0ICovXG5cdHByaXZhdGUgX2FkZFJlcXVpcmVkVGV4dFByb3BlcnRpZXMob1NpZGVFZmZlY3Q6IEJhc2VTaWRlRWZmZWN0c1R5cGUsIG1FbnRpdHlUeXBlOiBFbnRpdHlUeXBlKTogQmFzZVNpZGVFZmZlY3RzVHlwZSB7XG5cdFx0Y29uc3QgYUluaXRpYWxQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IG9TaWRlRWZmZWN0LlRhcmdldFByb3BlcnRpZXMgfHwgW10sXG5cdFx0XHRhRW50aXRpZXNSZXF1ZXN0ZWQ6IHN0cmluZ1tdID0gKG9TaWRlRWZmZWN0LlRhcmdldEVudGl0aWVzIHx8IFtdKS5tYXAoKG5hdmlnYXRpb24pID0+IG5hdmlnYXRpb24uJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpO1xuXHRcdGxldCBhRGVyaXZlZFByb3BlcnRpZXM6IEV4dHJhY3RvclByb3BlcnR5SW5mb1tdID0gW107XG5cblx0XHRhSW5pdGlhbFByb3BlcnRpZXMuZm9yRWFjaCgoc1Byb3BlcnR5UGF0aCkgPT4ge1xuXHRcdFx0Y29uc3QgYklzU3RhclByb3BlcnR5ID0gc1Byb3BlcnR5UGF0aC5lbmRzV2l0aChcIipcIiksIC8vIENhbiBiZSAnKicgb3IgJy4uLi9uYXZQcm9wLyonXG5cdFx0XHRcdHNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBzUHJvcGVydHlQYXRoLnN1YnN0cmluZygwLCBzUHJvcGVydHlQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSksXG5cdFx0XHRcdHNSZWxhdGl2ZVBhdGggPSBzTmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IGAke3NOYXZpZ2F0aW9uUHJvcGVydHlQYXRofS9gIDogXCJcIixcblx0XHRcdFx0bVRhcmdldDogYW55ID0gbUVudGl0eVR5cGUucmVzb2x2ZVBhdGgoc05hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpIHx8IG1FbnRpdHlUeXBlO1xuXG5cdFx0XHRpZiAobVRhcmdldCkge1xuXHRcdFx0XHQvLyBtVGFyZ2V0IGNhbiBiZSBhbiBlbnRpdHkgdHlwZSwgbmF2aWdhdGlvblByb3BlcnR5IG9yIG9yIGEgY29tcGxleFR5cGVcblx0XHRcdFx0Y29uc3QgYVRhcmdldEVudGl0eVByb3BlcnRpZXM6IFByb3BlcnR5W10gPVxuXHRcdFx0XHRcdChtVGFyZ2V0IGFzIEVudGl0eVR5cGUpLmVudGl0eVByb3BlcnRpZXMgfHxcblx0XHRcdFx0XHQoKG1UYXJnZXQgYXMgUHJvcGVydHkpLnRhcmdldFR5cGUgYXMgQ29tcGxleFR5cGUpPy5wcm9wZXJ0aWVzIHx8XG5cdFx0XHRcdFx0KG1UYXJnZXQgYXMgTmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlLmVudGl0eVByb3BlcnRpZXM7XG5cdFx0XHRcdGlmIChhVGFyZ2V0RW50aXR5UHJvcGVydGllcykge1xuXHRcdFx0XHRcdGlmIChiSXNTdGFyUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdC8vIEFkZCBhbGwgcmVxdWlyZWQgcHJvcGVydGllcyBiZWhpbmQgdGhlICpcblx0XHRcdFx0XHRcdGFFbnRpdGllc1JlcXVlc3RlZC5wdXNoKHNOYXZpZ2F0aW9uUHJvcGVydHlQYXRoKTtcblx0XHRcdFx0XHRcdGFEZXJpdmVkUHJvcGVydGllcyA9IGFEZXJpdmVkUHJvcGVydGllcy5jb25jYXQoXG5cdFx0XHRcdFx0XHRcdGFUYXJnZXRFbnRpdHlQcm9wZXJ0aWVzLm1hcCgobVByb3BlcnR5KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdG5hdmlnYXRpb25QYXRoOiBzUmVsYXRpdmVQYXRoLFxuXHRcdFx0XHRcdFx0XHRcdFx0cHJvcGVydHk6IG1Qcm9wZXJ0eVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhRGVyaXZlZFByb3BlcnRpZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHByb3BlcnR5OiBhVGFyZ2V0RW50aXR5UHJvcGVydGllcy5maW5kKFxuXHRcdFx0XHRcdFx0XHRcdChtUHJvcGVydHkpID0+IG1Qcm9wZXJ0eS5uYW1lID09PSBzUHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKVxuXHRcdFx0XHRcdFx0XHQpIGFzIFByb3BlcnR5LFxuXHRcdFx0XHRcdFx0XHRuYXZpZ2F0aW9uUGF0aDogc1JlbGF0aXZlUGF0aFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdExvZy5pbmZvKGBTaWRlRWZmZWN0cyAtIFRoZSBlbnRpdHkgdHlwZSBhc3NvY2lhdGVkIHRvIHByb3BlcnR5IHBhdGggJHtzUHJvcGVydHlQYXRofSBjYW5ub3QgYmUgcmVzb2x2ZWRgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0TG9nLmluZm8oYFNpZGVFZmZlY3RzIC0gVGhlIHByb3BlcnR5IHBhdGggJHtzUHJvcGVydHlQYXRofSBjYW5ub3QgYmUgcmVzb2x2ZWRgKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGFEZXJpdmVkUHJvcGVydGllcy5mb3JFYWNoKChtUHJvcGVydHlJbmZvKSA9PiB7XG5cdFx0XHRpZiAobVByb3BlcnR5SW5mby5wcm9wZXJ0eSkge1xuXHRcdFx0XHRjb25zdCBzVGFyZ2V0VGV4dFBhdGggPSAobVByb3BlcnR5SW5mby5wcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0IGFzIGFueSk/LnBhdGgsXG5cdFx0XHRcdFx0c1RleHRQYXRoRnJvbUluaXRpYWxFbnRpdHkgPSBtUHJvcGVydHlJbmZvLm5hdmlnYXRpb25QYXRoICsgc1RhcmdldFRleHRQYXRoLFxuXHRcdFx0XHRcdHNUYXJnZXRDb2xsZWN0aW9uUGF0aCA9IHNUZXh0UGF0aEZyb21Jbml0aWFsRW50aXR5LnN1YnN0cmluZygwLCBzVGV4dFBhdGhGcm9tSW5pdGlhbEVudGl0eS5sYXN0SW5kZXhPZihcIi9cIikpO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogVGhlIHByb3BlcnR5IFRleHQgbXVzdCBiZSBhZGRlZCBvbmx5IGlmIHRoZSBwcm9wZXJ0eSBpc1xuXHRcdFx0XHQgKiAtIG5vdCBwYXJ0IG9mIGEgc3RhciBwcm9wZXJ0eSAoLmkuZSAnKicgb3IgJ25hdmlnYXRpb24vKicpIG9yIGEgdGFyZ2V0ZWQgRW50aXR5XG5cdFx0XHRcdCAqIC0gbm90IGluY2x1ZGUgaW50byB0aGUgaW5pdGlhbCB0YXJnZXRlZCBwcm9wZXJ0aWVzIG9mIFNpZGVFZmZlY3RzXG5cdFx0XHRcdCAqICBJbmRlZWQgaW4gdGhlIHR3byBsaXN0ZWQgY2FzZXMsIHRoZSBwcm9wZXJ0eSBjb250YWluaW5nIHRleHQgd2lsbCBiZS9pcyByZXF1ZXN0ZWQgYnkgaW5pdGlhbCBTaWRlRWZmZWN0cyBjb25maWd1cmF0aW9uLlxuXHRcdFx0XHQgKi9cblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0c1RhcmdldFRleHRQYXRoICYmXG5cdFx0XHRcdFx0YUVudGl0aWVzUmVxdWVzdGVkLmluZGV4T2Yoc1RhcmdldENvbGxlY3Rpb25QYXRoKSA9PT0gLTEgJiZcblx0XHRcdFx0XHRhSW5pdGlhbFByb3BlcnRpZXMuaW5kZXhPZihzVGV4dFBhdGhGcm9tSW5pdGlhbEVudGl0eSkgPT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdC8vIFRoZSBUZXh0IGFzc29jaWF0aW9uIGlzIGFkZGVkIGFzIFRhcmdldEVudGl0aWVzIGlmIGl0J3MgY29udGFpbmVkIG9uIGEgZGlmZmVyZW50IGVudGl0eVNldCBhbmQgbm90IGEgY29tcGxleFR5cGVcblx0XHRcdFx0XHQvLyBPdGhlcndpc2UgaXQncyBhZGRlZCBhcyB0YXJnZXRQcm9wZXJ0aWVzXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0c1RhcmdldFRleHRQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA+IC0xICYmXG5cdFx0XHRcdFx0XHRtRW50aXR5VHlwZS5yZXNvbHZlUGF0aChzVGFyZ2V0Q29sbGVjdGlvblBhdGgpPy5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIlxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0b1NpZGVFZmZlY3QuVGFyZ2V0RW50aXRpZXMucHVzaCh7ICROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBzVGFyZ2V0Q29sbGVjdGlvblBhdGggfSk7XG5cdFx0XHRcdFx0XHRhRW50aXRpZXNSZXF1ZXN0ZWQucHVzaChzVGFyZ2V0Q29sbGVjdGlvblBhdGgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvU2lkZUVmZmVjdC5UYXJnZXRQcm9wZXJ0aWVzLnB1c2goc1RleHRQYXRoRnJvbUluaXRpYWxFbnRpdHkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIG9TaWRlRWZmZWN0O1xuXHR9XG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBTaWRlRWZmZWN0cyB0byBleHBlY3RlZCBmb3JtYXRcblx0ICogIC0gQ29udmVydHMgU2lkZUVmZmVjdHMgdGFyZ2V0cyB0byBleHBlY3RlZCBmb3JtYXRcblx0ICogIC0gUmVtb3ZlcyBiaW5kaW5nIHBhcmFtZXRlciBmcm9tIFNpZGVFZmZlY3RzIHRhcmdldHMgcHJvcGVydGllc1xuXHQgKiAgLSBBZGRzIHRoZSB0ZXh0IHByb3BlcnRpZXNcblx0ICogIC0gUmVwbGFjZXMgVGFyZ2V0UHJvcGVydGllcyBoYXZpbmcgcmVmZXJlbmNlIHRvIFNvdXJjZSBQcm9wZXJ0aWVzIGZvciBhIFNpZGVFZmZlY3RzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIG9TaWRlRWZmZWN0cyBTaWRlRWZmZWN0cyBkZWZpbml0aW9uXG5cdCAqIEBwYXJhbSBtRW50aXR5VHlwZSBFbnRpdHkgdHlwZVxuXHQgKiBAcGFyYW0gc0JpbmRpbmdQYXJhbWV0ZXIgTmFtZSBvZiB0aGUgYmluZGluZyBwYXJhbWV0ZXJcblx0ICogQHJldHVybnMgU2lkZUVmZmVjdHMgZGVmaW5pdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBfY29udmVydFNpZGVFZmZlY3RzKFxuXHRcdG9TaWRlRWZmZWN0czogQmFzZVNpZGVFZmZlY3RzVHlwZSB8IEJhc2VBbm5vdGF0aW9uU2lkZUVmZmVjdHNUeXBlLFxuXHRcdG1FbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRcdHNCaW5kaW5nUGFyYW1ldGVyPzogc3RyaW5nXG5cdCk6IE9EYXRhU2lkZUVmZmVjdHNUeXBlIHtcblx0XHRjb25zdCBvVGVtcFNpZGVFZmZlY3RzID0gdGhpcy5fcmVtb3ZlQmluZGluZ1BhcmFtZXRlcih0aGlzLl9jb252ZXJ0VGFyZ2V0c0Zvcm1hdChvU2lkZUVmZmVjdHMpLCBzQmluZGluZ1BhcmFtZXRlcik7XG5cdFx0cmV0dXJuIHRoaXMuX2FkZFJlcXVpcmVkVGV4dFByb3BlcnRpZXMob1RlbXBTaWRlRWZmZWN0cywgbUVudGl0eVR5cGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIFNpZGVFZmZlY3RzIHRhcmdldHMgKFRhcmdldEVudGl0aWVzIGFuZCBUYXJnZXRQcm9wZXJ0aWVzKSB0byBleHBlY3RlZCBmb3JtYXRcblx0ICogIC0gVGFyZ2V0UHJvcGVydGllcyBhcyBhcnJheSBvZiBzdHJpbmdcblx0ICogIC0gVGFyZ2V0RW50aXRpZXMgYXMgYXJyYXkgb2Ygb2JqZWN0IHdpdGggcHJvcGVydHkgJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICogQHJldHVybnMgQ29udmVydGVkIFNpZGVFZmZlY3RzXG5cdCAqL1xuXHRwcml2YXRlIF9jb252ZXJ0VGFyZ2V0c0Zvcm1hdChvU2lkZUVmZmVjdHM6IEJhc2VTaWRlRWZmZWN0c1R5cGUgfCBCYXNlQW5ub3RhdGlvblNpZGVFZmZlY3RzVHlwZSk6IEJhc2VTaWRlRWZmZWN0c1R5cGUge1xuXHRcdGNvbnN0IFRhcmdldFByb3BlcnRpZXM6IHN0cmluZ1tdID0gKChvU2lkZUVmZmVjdHMuVGFyZ2V0UHJvcGVydGllcyBhcyBhbnlbXSkgfHwgW10pLnJlZHVjZShmdW5jdGlvbiAoYVRhcmdldFByb3BlcnRpZXMsIHZUYXJnZXQpIHtcblx0XHRcdFx0Y29uc3Qgc1RhcmdldCA9ICh0eXBlb2YgdlRhcmdldCA9PT0gXCJzdHJpbmdcIiAmJiB2VGFyZ2V0KSB8fCAodlRhcmdldC50eXBlID09PSBcIlByb3BlcnR5UGF0aFwiICYmIHZUYXJnZXQudmFsdWUpO1xuXHRcdFx0XHRpZiAoc1RhcmdldCkge1xuXHRcdFx0XHRcdGFUYXJnZXRQcm9wZXJ0aWVzLnB1c2goc1RhcmdldCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKGBTaWRlRWZmZWN0cyAtIEVycm9yIHdoaWxlIHByb2Nlc3NpbmcgVGFyZ2V0UHJvcGVydGllcyBmb3IgU2lkZUVmZmVjdHMke29TaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWV9YCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFUYXJnZXRQcm9wZXJ0aWVzO1xuXHRcdFx0fSwgW10pLFxuXHRcdFx0VGFyZ2V0RW50aXRpZXM6IFNpZGVFZmZlY3RzVGFyZ2V0RW50aXR5VHlwZVtdID0gKChvU2lkZUVmZmVjdHMuVGFyZ2V0RW50aXRpZXMgYXMgYW55W10pIHx8IFtdKS5tYXAoKG1UYXJnZXRFbnRpdHkpID0+IHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqICBTaWRlRWZmZWN0cyB0aGF0IGNvbWVzIGZyb20gU0FQIEZFIGdldCBUYXJnZXRFbnRpdGllcyB3aXRoICROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIHdoZXJlYXNcblx0XHRcdFx0ICogIG9uZXMgY29taW5nIGZyb20gdGhlIGNvbnZlcnRlZCBPRGF0YSBtb2RlbCBnZXRzIGEgTmF2aWdhdGlvblByb3BlcnR5UGF0aCBmb3JtYXRcblx0XHRcdFx0ICpcblx0XHRcdFx0ICovXG5cdFx0XHRcdHJldHVybiB7IFwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjogbVRhcmdldEVudGl0eS4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCB8fCBtVGFyZ2V0RW50aXR5LnZhbHVlIHx8IFwiXCIgfTtcblx0XHRcdH0pO1xuXHRcdHJldHVybiB7IC4uLm9TaWRlRWZmZWN0cywgLi4ueyBUYXJnZXRQcm9wZXJ0aWVzLCBUYXJnZXRFbnRpdGllcyB9IH07XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBTaWRlRWZmZWN0cyByZWxhdGVkIHRvIGFuIGVudGl0eSB0eXBlIG9yIGFjdGlvbiB0aGF0IGNvbWUgZnJvbSBhbiBPRGF0YSBTZXJ2aWNlXG5cdCAqIEludGVybmFsIHJvdXRpbmUgdG8gZ2V0LCBmcm9tIGNvbnZlcnRlZCBvRGF0YSBtZXRhTW9kZWwsIFNpZGVFZmZlY3RzIHJlbGF0ZWQgdG8gYSBzcGVjaWZpYyBlbnRpdHkgdHlwZSBvciBhY3Rpb25cblx0ICogYW5kIHRvIGNvbnZlcnQgdGhlc2UgU2lkZUVmZmVjdHMgd2l0aCBleHBlY3RlZCBmb3JtYXQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb1NvdXJjZSBFbnRpdHkgdHlwZSBvciBhY3Rpb25cblx0ICogQHJldHVybnMgQXJyYXkgb2YgU2lkZUVmZmVjdHNcblx0ICovXG5cdHByaXZhdGUgX2dldFNpZGVFZmZlY3RzRnJvbVNvdXJjZShvU291cmNlOiBhbnkpOiBPRGF0YVNpZGVFZmZlY3RzVHlwZVtdIHtcblx0XHRjb25zdCBhU2lkZUVmZmVjdHM6IE9EYXRhU2lkZUVmZmVjdHNUeXBlW10gPSBbXTtcblx0XHRjb25zdCBhdXRob3JpemVkVHlwZXMgPSBbXCJFbnRpdHlUeXBlXCIsIFwiQWN0aW9uXCJdO1xuXHRcdGlmIChvU291cmNlLl90eXBlICYmIGF1dGhvcml6ZWRUeXBlcy5pbmRleE9mKG9Tb3VyY2UuX3R5cGUpID4gLTEpIHtcblx0XHRcdGNvbnN0IG1FbnRpdHlUeXBlOiBFbnRpdHlUeXBlIHwgdW5kZWZpbmVkID0gb1NvdXJjZS5fdHlwZSA9PT0gXCJFbnRpdHlUeXBlXCIgPyBvU291cmNlIDogb1NvdXJjZS5zb3VyY2VFbnRpdHlUeXBlO1xuXHRcdFx0aWYgKG1FbnRpdHlUeXBlKSB7XG5cdFx0XHRcdGNvbnN0IG1Db21tb25Bbm5vdGF0aW9uOiBhbnkgPSBvU291cmNlLmFubm90YXRpb25zPy5Db21tb24gfHwge307XG5cdFx0XHRcdGNvbnN0IG1CaW5kaW5nUGFyYW1ldGVyID0gKChvU291cmNlIGFzIEFjdGlvbikucGFyYW1ldGVycyB8fCBbXSkuZmluZChcblx0XHRcdFx0XHQobVBhcmFtZXRlcikgPT4gbVBhcmFtZXRlci50eXBlID09PSBtRW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWVcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3Qgc0JpbmRpbmdQYXJhbWV0ZXIgPSBtQmluZGluZ1BhcmFtZXRlciA/IG1CaW5kaW5nUGFyYW1ldGVyLmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcIi9cIilbMV0gOiBcIlwiO1xuXHRcdFx0XHRPYmplY3Qua2V5cyhtQ29tbW9uQW5ub3RhdGlvbilcblx0XHRcdFx0XHQuZmlsdGVyKChzQW5ub3RhdGlvbk5hbWUpID0+IG1Db21tb25Bbm5vdGF0aW9uW3NBbm5vdGF0aW9uTmFtZV0uJFR5cGUgPT09IENvbW1vbkFubm90YXRpb25UeXBlcy5TaWRlRWZmZWN0c1R5cGUpXG5cdFx0XHRcdFx0LmZvckVhY2goKHNBbm5vdGF0aW9uTmFtZSkgPT4ge1xuXHRcdFx0XHRcdFx0YVNpZGVFZmZlY3RzLnB1c2godGhpcy5fY29udmVydFNpZGVFZmZlY3RzKG1Db21tb25Bbm5vdGF0aW9uW3NBbm5vdGF0aW9uTmFtZV0sIG1FbnRpdHlUeXBlLCBzQmluZGluZ1BhcmFtZXRlcikpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYVNpZGVFZmZlY3RzO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvZ3MgU2lkZUVmZmVjdHMgcmVxdWVzdC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBhUGF0aEV4cHJlc3Npb25zIFNpZGVFZmZlY3RzIHRhcmdldHNcblx0ICogQHBhcmFtIG9Db250ZXh0IENvbnRleHRcblx0ICovXG5cdHByaXZhdGUgX2xvZ1JlcXVlc3QoYVBhdGhFeHByZXNzaW9uczogU2lkZUVmZmVjdHNUYXJnZXRbXSwgb0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRjb25zdCBzVGFyZ2V0UGF0aHMgPSBhUGF0aEV4cHJlc3Npb25zLnJlZHVjZShmdW5jdGlvbiAoc1BhdGhzLCBtVGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gYCR7c1BhdGhzfVxcblxcdFxcdCR7KG1UYXJnZXQgYXMgU2lkZUVmZmVjdHNUYXJnZXRFbnRpdHlUeXBlKS4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCB8fCBtVGFyZ2V0IHx8IFwiXCJ9YDtcblx0XHR9LCBcIlwiKTtcblx0XHRMb2cuZGVidWcoYFNpZGVFZmZlY3RzIC0gUmVxdWVzdDpcXG5cXHRDb250ZXh0IHBhdGggOiAke29Db250ZXh0LmdldFBhdGgoKX1cXG5cXHRQcm9wZXJ0eSBwYXRocyA6JHtzVGFyZ2V0UGF0aHN9YCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBuYW1lIG9mIGJpbmRpbmcgcGFyYW1ldGVyIG9uIFNpZGVFZmZlY3RzIHRhcmdldHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICogQHBhcmFtIHNCaW5kaW5nUGFyYW1ldGVyTmFtZSBOYW1lIG9mIGJpbmRpbmcgcGFyYW1ldGVyXG5cdCAqIEByZXR1cm5zIFNpZGVFZmZlY3RzIGRlZmluaXRpb25cblx0ICovXG5cdHByaXZhdGUgX3JlbW92ZUJpbmRpbmdQYXJhbWV0ZXIob1NpZGVFZmZlY3RzOiBCYXNlU2lkZUVmZmVjdHNUeXBlLCBzQmluZGluZ1BhcmFtZXRlck5hbWU/OiBzdHJpbmcpOiBCYXNlU2lkZUVmZmVjdHNUeXBlIHtcblx0XHRpZiAoc0JpbmRpbmdQYXJhbWV0ZXJOYW1lKSB7XG5cdFx0XHRjb25zdCBhVGFyZ2V0cyA9IFtcIlRhcmdldFByb3BlcnRpZXNcIiwgXCJUYXJnZXRFbnRpdGllc1wiXTtcblx0XHRcdGFUYXJnZXRzLmZvckVhY2goKHNUYXJnZXQpID0+IHtcblx0XHRcdFx0bGV0IG1UYXJnZXQgPSAob1NpZGVFZmZlY3RzIGFzIGFueSlbc1RhcmdldF07XG5cdFx0XHRcdGlmIChtVGFyZ2V0KSB7XG5cdFx0XHRcdFx0bVRhcmdldCA9IG1UYXJnZXQubWFwKChtUHJvcGVydHk6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgYk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSBtUHJvcGVydHkuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZDsgLy8gTmVlZCB0byB0ZXN0IHdpdGggdW5kZWZpbmVkIHNpbmNlICBtUHJvcGVydHkuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggY291bGQgYmUgXCJcIiAoZW1wdHkgc3RyaW5nKVxuXHRcdFx0XHRcdFx0Y29uc3Qgc1ZhbHVlID0gKGJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoID8gbVByb3BlcnR5LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoIDogbVByb3BlcnR5KS5yZXBsYWNlKFxuXHRcdFx0XHRcdFx0XHRuZXcgUmVnRXhwKGBeJHtzQmluZGluZ1BhcmFtZXRlck5hbWV9Lz9gKSxcblx0XHRcdFx0XHRcdFx0XCJcIlxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiBiTmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IHsgJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IHNWYWx1ZSB9IDogc1ZhbHVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdChvU2lkZUVmZmVjdHMgYXMgYW55KVtzVGFyZ2V0XSA9IG1UYXJnZXQ7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG9TaWRlRWZmZWN0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgZHVwbGljYXRlcyBpbiBTaWRlRWZmZWN0cyB0YXJnZXRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIGFUYXJnZXRzIFNpZGVFZmZlY3RzIHRhcmdldHNcblx0ICogQHJldHVybnMgU2lkZUVmZmVjdHMgdGFyZ2V0cyB3aXRob3V0IGR1cGxpY2F0ZXNcblx0ICovXG5cdHByaXZhdGUgX3JlbW92ZUR1cGxpY2F0ZVRhcmdldHMoYVRhcmdldHM6IFNpZGVFZmZlY3RzVGFyZ2V0W10pOiBTaWRlRWZmZWN0c1RhcmdldFtdIHtcblx0XHRyZXR1cm4gYVRhcmdldHMuZmlsdGVyKFxuXHRcdFx0KG1UYXJnZXQ6IGFueSwgaUluZGV4LCBhSW5UYXJnZXRzKSA9PlxuXHRcdFx0XHRhSW5UYXJnZXRzLmZpbmRJbmRleCgobVNlYXJjaFRhcmdldDogYW55KSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdG1TZWFyY2hUYXJnZXQgPT09IG1UYXJnZXQgfHwgLy8gUHJvcGVydHlQYXRoXG5cdFx0XHRcdFx0XHQobVRhcmdldC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCAmJiBtU2VhcmNoVGFyZ2V0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoID09PSBtVGFyZ2V0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoKSAvLyBOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSkgPT09IGlJbmRleFxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBTaWRlRWZmZWN0cyBhY3Rpb24gdHlwZSB0aGF0IGNvbWUgZnJvbSBhbiBPRGF0YSBTZXJ2aWNlXG5cdCAqIEludGVybmFsIHJvdXRpbmUgdG8gZ2V0LCBmcm9tIGNvbnZlcnRlZCBvRGF0YSBtZXRhTW9kZWwsIFNpZGVFZmZlY3RzIG9uIGFjdGlvbnNcblx0ICogcmVsYXRlZCB0byBhIHNwZWNpZmljIGVudGl0eSB0eXBlIGFuZCB0byBjb252ZXJ0IHRoZXNlIFNpZGVFZmZlY3RzIHdpdGhcblx0ICogZXhwZWN0ZWQgZm9ybWF0LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIG1FbnRpdHlUeXBlIEVudGl0eSB0eXBlXG5cdCAqIEByZXR1cm5zIEVudGl0eSB0eXBlIFNpZGVFZmZlY3RzIGRpY3Rpb25hcnlcblx0ICovXG5cdHByaXZhdGUgX3JldHJpZXZlT0RhdGFBY3Rpb25zU2lkZUVmZmVjdHMobUVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBSZWNvcmQ8c3RyaW5nLCBBY3Rpb25TaWRlRWZmZWN0c1R5cGU+IHtcblx0XHRjb25zdCBvU2lkZUVmZmVjdHM6IFJlY29yZDxzdHJpbmcsIEFjdGlvblNpZGVFZmZlY3RzVHlwZT4gPSB7fTtcblx0XHRjb25zdCBhQWN0aW9ucyA9IG1FbnRpdHlUeXBlLmFjdGlvbnM7XG5cdFx0aWYgKGFBY3Rpb25zKSB7XG5cdFx0XHRPYmplY3Qua2V5cyhhQWN0aW9ucykuZm9yRWFjaCgoc0FjdGlvbk5hbWUpID0+IHtcblx0XHRcdFx0Y29uc3Qgb0FjdGlvbiA9IG1FbnRpdHlUeXBlLmFjdGlvbnNbc0FjdGlvbk5hbWVdO1xuXHRcdFx0XHRjb25zdCB0cmlnZ2VyQWN0aW9uczogc3RyaW5nW10gPSBbXTtcblx0XHRcdFx0bGV0IHBhdGhFeHByZXNzaW9uczogU2lkZUVmZmVjdHNUYXJnZXRbXSA9IFtdO1xuXHRcdFx0XHRsZXQgYVRhcmdldHM6IFNpZGVFZmZlY3RzVGFyZ2V0W10gPSBbXTtcblxuXHRcdFx0XHR0aGlzLl9nZXRTaWRlRWZmZWN0c0Zyb21Tb3VyY2Uob0FjdGlvbikuZm9yRWFjaCgob1NpZGVFZmZlY3QpID0+IHtcblx0XHRcdFx0XHRjb25zdCBzVHJpZ2dlckFjdGlvbiA9IG9TaWRlRWZmZWN0LlRyaWdnZXJBY3Rpb247XG5cdFx0XHRcdFx0YVRhcmdldHMgPSBhVGFyZ2V0cy5jb25jYXQob1NpZGVFZmZlY3QuVGFyZ2V0RW50aXRpZXMgfHwgW10pLmNvbmNhdCgob1NpZGVFZmZlY3QuVGFyZ2V0UHJvcGVydGllcyBhcyBhbnlbXSkgfHwgW10pO1xuXHRcdFx0XHRcdGlmIChzVHJpZ2dlckFjdGlvbiAmJiB0cmlnZ2VyQWN0aW9ucy5pbmRleE9mKHNUcmlnZ2VyQWN0aW9uIGFzIHN0cmluZykgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0cmlnZ2VyQWN0aW9ucy5wdXNoKHNUcmlnZ2VyQWN0aW9uIGFzIHN0cmluZyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cGF0aEV4cHJlc3Npb25zID0gdGhpcy5fcmVtb3ZlRHVwbGljYXRlVGFyZ2V0cyhhVGFyZ2V0cyk7XG5cdFx0XHRcdG9TaWRlRWZmZWN0c1tzQWN0aW9uTmFtZV0gPSB7IHBhdGhFeHByZXNzaW9ucywgdHJpZ2dlckFjdGlvbnMgfTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gb1NpZGVFZmZlY3RzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgU2lkZUVmZmVjdHMgZW50aXR5IHR5cGUgdGhhdCBjb21lIGZyb20gYW4gT0RhdGEgU2VydmljZVxuXHQgKiBJbnRlcm5hbCByb3V0aW5lIHRvIGdldCwgZnJvbSBjb252ZXJ0ZWQgb0RhdGEgbWV0YU1vZGVsLCBTaWRlRWZmZWN0c1xuXHQgKiByZWxhdGVkIHRvIGEgc3BlY2lmaWMgZW50aXR5IHR5cGUgYW5kIHRvIGNvbnZlcnQgdGhlc2UgU2lkZUVmZmVjdHMgd2l0aFxuXHQgKiBleHBlY3RlZCBmb3JtYXQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gbUVudGl0eVR5cGUgRW50aXR5IHR5cGVcblx0ICogQHJldHVybnMgRW50aXR5IHR5cGUgU2lkZUVmZmVjdHMgZGljdGlvbmFyeVxuXHQgKi9cblx0cHJpdmF0ZSBfcmV0cmlldmVPRGF0YUVudGl0eVNpZGVFZmZlY3RzKG1FbnRpdHlUeXBlOiBFbnRpdHlUeXBlKTogUmVjb3JkPHN0cmluZywgT0RhdGFTaWRlRWZmZWN0c1R5cGU+IHtcblx0XHRjb25zdCBvRW50aXR5U2lkZUVmZmVjdHM6IFJlY29yZDxzdHJpbmcsIE9EYXRhU2lkZUVmZmVjdHNUeXBlPiA9IHt9O1xuXHRcdHRoaXMuX2dldFNpZGVFZmZlY3RzRnJvbVNvdXJjZShtRW50aXR5VHlwZSkuZm9yRWFjaCgob1NpZGVFZmZlY3RzKSA9PiB7XG5cdFx0XHRvRW50aXR5U2lkZUVmZmVjdHNbb1NpZGVFZmZlY3RzLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBvU2lkZUVmZmVjdHM7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9FbnRpdHlTaWRlRWZmZWN0cztcblx0fVxuXG5cdGdldEludGVyZmFjZSgpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbmNsYXNzIFNpZGVFZmZlY3RzU2VydmljZUZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxTaWRlRWZmZWN0c1NldHRpbmdzPiB7XG5cdGNyZWF0ZUluc3RhbmNlKG9TZXJ2aWNlQ29udGV4dDogU2VydmljZUNvbnRleHQ8U2lkZUVmZmVjdHNTZXR0aW5ncz4pOiBQcm9taXNlPGFueT4ge1xuXHRcdGNvbnN0IFNpZGVFZmZlY3RzU2VydmljZVNlcnZpY2UgPSBuZXcgU2lkZUVmZmVjdHNTZXJ2aWNlKG9TZXJ2aWNlQ29udGV4dCk7XG5cdFx0cmV0dXJuIFNpZGVFZmZlY3RzU2VydmljZVNlcnZpY2UuaW5pdFByb21pc2U7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lkZUVmZmVjdHNTZXJ2aWNlRmFjdG9yeTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFzRmFBLGtCOzs7Ozs7Ozs7O0lBS1o7V0FDQUMsSSxHQUFBLGdCQUFPO01BQ04sS0FBS0MsaUJBQUwsR0FBeUI7UUFDeEJDLEtBQUssRUFBRTtVQUNOQyxRQUFRLEVBQUUsRUFESjtVQUVOQyxPQUFPLEVBQUU7UUFGSCxDQURpQjtRQUt4QkMsT0FBTyxFQUFFO01BTGUsQ0FBekI7TUFPQSxLQUFLQyxhQUFMLEdBQXFCLEtBQXJCO01BQ0EsS0FBS0MsV0FBTCxHQUFtQkMsT0FBTyxDQUFDQyxPQUFSLENBQWdCLElBQWhCLENBQW5CO0lBQ0E7SUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7V0FDUUMscUIsR0FBUCwrQkFBNkJDLFdBQTdCLEVBQWtE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